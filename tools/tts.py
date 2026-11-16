"""Narração + timeline de um episódio.
Uso: python3 tools/tts.py episodes/<slug> [--engine edge|piper]
Lê episodes/<slug>/script.py (BEATS, META) e grava work/<slug>/voice.wav e work/<slug>/timeline.json.
Markup no texto: [[y:palavras]] destaque (y amarelo, r vermelho, c ciano, g verde); {legenda|fala} legenda ≠ fala.
Motor padrão: edge (Microsoft Edge TTS, pt-BR-AntonioNeural). Se falhar, cai para piper (offline).
"""
import re, json, sys, math, os, asyncio, subprocess, importlib.util, tempfile
import numpy as np

SR = 44100
ep = sys.argv[1].rstrip('/')
engine = 'edge'
if '--engine' in sys.argv: engine = sys.argv[sys.argv.index('--engine') + 1]
slug = os.path.basename(ep)
work = os.path.join('work', slug); os.makedirs(work, exist_ok=True)
spec = importlib.util.spec_from_file_location('script', os.path.join(ep, 'script.py')); S = importlib.util.module_from_spec(spec); spec.loader.exec_module(S)
BEATS = S.BEATS; META = getattr(S, 'META', {})
FMT = META.get('format', 'long')
SHORT = FMT == 'short'
VOICE = META.get('voice', 'pt-BR-AntonioNeural')
RATE = META.get('rate', '+12%' if SHORT else '+0%')
MAXW = 3 if SHORT else 4

PAT = re.compile(r'\[\[(\w):(.*?)\]\]|\{(.*?)\|(.*?)\}|(\S+)')
def tokenize(text):
    toks = []
    for mt in PAT.finditer(text):
        if mt.group(1):
            for w in mt.group(2).split(): toks.append(dict(d=w, s=w, c=mt.group(1)))
        elif mt.group(3) is not None: toks.append(dict(d=mt.group(3), s=mt.group(4), c=None))
        else:
            w = mt.group(5)
            if re.fullmatch(r'[.,:;!?…]+', w) and toks: toks[-1]['d'] += w; toks[-1]['s'] += w
            else: toks.append(dict(d=w, s=w, c=None))
    return toks
def clauses(toks):
    cur = []; out = []
    for t in toks:
        cur.append(t)
        if re.search(r'[.,:;!?…]$', t['d']): out.append(cur); cur = []
    if cur: out.append(cur)
    return out
def gap_for(cl):
    e = cl[-1]['d']; k = 0.6 if SHORT else 1.0
    if e.endswith('...') or e.endswith('…'): return 0.55 * k
    if e[-1] in '.': return 0.24 * k
    if e[-1] in '?!': return 0.30 * k
    return 0.10 * k
def split_words(words):
    n = len(words)
    if n <= MAXW: return [words]
    k = math.ceil(n / MAXW); size = math.ceil(n / k)
    return [words[i:i + size] for i in range(0, n, size)]
def trim(a):
    if len(a) == 0: return a
    thr = 0.012 * np.max(np.abs(a)); idx = np.where(np.abs(a) > thr)[0]
    if len(idx) == 0: return a
    s = max(0, idx[0] - int(0.02 * SR)); e = min(len(a), idx[-1] + int(0.05 * SR)); return a[s:e]
def decode(path):
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', path, '-ar', str(SR), '-ac', '1', '-f', 'f32le', '-'], capture_output=True, check=True).stdout
    return np.frombuffer(raw, dtype=np.float32).copy()

# ---------- motores ----------
def synth_edge(texts):
    import edge_tts
    tmp = tempfile.mkdtemp()
    async def one(i, txt, sem):
        async with sem:
            for attempt in range(4):
                try:
                    f = os.path.join(tmp, f'{i}.mp3'); await edge_tts.Communicate(txt, VOICE, rate=RATE).save(f)
                    if os.path.getsize(f) > 500: return f
                except Exception as e:
                    print('edge retry', i, e); await asyncio.sleep(2 + attempt * 3)
            raise RuntimeError('edge-tts falhou: ' + txt)
    async def all_():
        sem = asyncio.Semaphore(6); return await asyncio.gather(*[one(i, t, sem) for i, t in enumerate(texts)])
    files = asyncio.run(all_())
    return [trim(decode(f)) for f in files]
def synth_piper(texts):
    import sherpa_onnx
    m = os.environ.get('PIPER_DIR', 'models/vits-piper-pt_BR-faber-medium') + '/'
    cfg = sherpa_onnx.OfflineTtsConfig(model=sherpa_onnx.OfflineTtsModelConfig(vits=sherpa_onnx.OfflineTtsVitsModelConfig(model=m + 'pt_BR-faber-medium.onnx', tokens=m + 'tokens.txt', data_dir=m + 'espeak-ng-data'), num_threads=2, provider='cpu'))
    tts = sherpa_onnx.OfflineTts(cfg); out = []
    sp = 0.95 if SHORT else 0.82
    for t in texts:
        g = tts.generate(t, sid=0, speed=sp); a = np.array(g.samples, dtype=np.float32)
        r = subprocess.run(['ffmpeg', '-v', 'error', '-f', 'f32le', '-ar', str(g.sample_rate), '-ac', '1', '-i', '-', '-ar', str(SR), '-f', 'f32le', '-'], input=a.tobytes(), capture_output=True, check=True).stdout
        out.append(trim(np.frombuffer(r, dtype=np.float32).copy()))
    return out

# ---------- monta ----------
plan = []
for b in BEATS:
    cls = clauses(tokenize(b['text'])); plan.append((b, cls))
texts = [' '.join(t['s'] for t in cl) for _, cls in plan for cl in cls]
try:
    audios = synth_edge(texts) if engine == 'edge' else synth_piper(texts); used = engine
except Exception as e:
    print('!! motor', engine, 'falhou:', e, '-> usando piper'); audios = synth_piper(texts); used = 'piper'
ai = 0; t_cursor = 0.0; timeline = []; items = []
for b, cls in plan:
    beat_start = t_cursor; cur = b.get('pre', 0.15 if SHORT else 0.2); chunks = []
    for cl in cls:
        a = audios[ai]; ai += 1; dur = len(a) / SR
        items.append((beat_start + cur, a))
        words = [dict(w=w, c=t['c']) for t in cl for w in t['d'].split()]
        total = sum(len(w['w']) + 1 for w in words); acc = 0.0
        for p in split_words(words):
            if SHORT and not any(w['c'] for w in p):   # estilo dos shorts: uma palavra-chave amarela por legenda
                cand = max(p, key=lambda w: len(re.sub(r'\W', '', w['w'])))
                if len(re.sub(r'\W', '', cand['w'])) >= 5: cand['c'] = 'y'
            ch = sum(len(w['w']) + 1 for w in p); d0 = dur * acc / total; d1 = dur * (acc + ch) / total; acc += ch
            chunks.append(dict(t0=round(cur + d0, 3), t1=round(cur + d1, 3), words=p))
        cur += dur + gap_for(cl)
    dur_total = cur + b.get('post', 0.15 if SHORT else 0.2)
    timeline.append(dict(id=b['id'], env=b.get('env', ''), start=round(beat_start, 3), dur=round(dur_total, 3), chunks=chunks, clauses=[' '.join(t['d'] for t in cl) for cl in cls]))
    t_cursor += dur_total
total = t_cursor
buf = np.zeros(int((total + 0.5) * SR), dtype=np.float32)
for st, a in items: i = int(st * SR); buf[i:i + len(a)] += a[:max(0, len(buf) - i)]
pk = np.max(np.abs(buf)) or 1; buf = buf / pk * 0.89
import wave
with wave.open(os.path.join(work, 'voice.wav'), 'wb') as w: w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((buf * 32767).astype(np.int16).tobytes())
json.dump(dict(total=round(total, 3), format=FMT, tts=used, beats=timeline), open(os.path.join(work, 'timeline.json'), 'w'), ensure_ascii=False, indent=1)
words = sum(len(t['d'].split()) for b in BEATS for t in tokenize(b['text']))
print(f'[{used}] total {total:.1f}s ({int(total // 60)}m{round(total % 60)}s), {words} palavras, {round(words / total * 60)} ppm')
for b in timeline: print(' ', b['id'], round(b['start'], 1), round(b['dur'], 1))
