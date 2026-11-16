"""Gera work/<slug>/youtube.json a partir do META do roteiro.
META (episodes/<slug>/script.py):
  format: 'long' | 'short'
  title, description (pode usar {CHAPTERS} no longo), tags (lista)
  thumb (só longo): dict(beat='b01', frac=0.7, text='LINHA 1', text2='linha 2')  ou dict(t=12.3, ...)
  chapters (só longo, opcional): lista de (beat_id, 'Título do capítulo')
"""
import json, sys, os, importlib.util
ep = sys.argv[1].rstrip('/'); slug = os.path.basename(ep); work = os.path.join('work', slug)
spec = importlib.util.spec_from_file_location('s', os.path.join(ep, 'script.py')); S = importlib.util.module_from_spec(spec); spec.loader.exec_module(S)
M = getattr(S, 'META', {}); TL = json.load(open(os.path.join(work, 'timeline.json')))
beats = {b['id']: b for b in TL['beats']}
fmt = M.get('format', 'long')
def mmss(s): s = int(s); return f'{s // 60}:{s % 60:02d}'
desc = M.get('description', '')
if fmt == 'long':
    ch = M.get('chapters') or []
    lines = [f"{mmss(beats[b]['start'] if i else 0)} {name}" for i, (b, name) in enumerate(ch) if b in beats]
    desc = desc.replace('{CHAPTERS}', '\n'.join(lines))
title = M.get('title', slug)
if fmt == 'short' and '#shorts' not in (title + desc).lower(): desc += '\n#shorts'
th = dict(M.get('thumb', {}))
if fmt == 'long':
    if 't' not in th:
        b = beats.get(th.get('beat', TL['beats'][0]['id'])); th['t'] = round(b['start'] + b['dur'] * th.get('frac', 0.6), 2)
out = dict(title=title[:100], description=desc[:4900], tags=M.get('tags', [])[:30], category=M.get('category', '24'), lang='pt-BR', format=fmt, thumb=th, duration=TL['total'])
json.dump(out, open(os.path.join(work, 'youtube.json'), 'w'), ensure_ascii=False, indent=1)
print('youtube.json:', out['title'])
