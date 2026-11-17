# Canal "Tem Um Porém" — produção automática (1 vídeo longo + 1 short por dia)

Você (Claude) escreve e confere os vídeos; o GitHub Actions renderiza e publica. O dono é brasileiro: **fale com ele em português**. Todo o conteúdo do canal é em **português do Brasil**.

## Os dois formatos
| | Vídeo longo | Short |
|---|---|---|
| Estilo | Bonequinho **palito** (cabeça preta, olhos grandes), história "E se você…/E se a humanidade…", igual ao canal Imagina Só | Personagens **Roblox** (blocos R15, cabeça clássica e **rostos oficiais do Roblox** em `assets/roblox-faces/`), igual aos shorts de histórias de Roblox |
| Tamanho | 1920x1080, **5–8 min** (~800–1.100 palavras) | 1080x1920, **25–45 s** (~70–110 palavras) |
| Tema | Cenário hipotético grande, com gancho, flashback, vantagens, preço, desafios, clímax, final e CTA (modelo: `episodes/2026-10-28-humanidade-2-pessoas`) | História curta e rápida **de ficção no estilo "história real"**, com virada no final (modelo: `episodes/2026-11-16-short-mala-do-aviao`). Nunca um tema de vídeo longo. |
| Narração | edge-tts `pt-BR-AntonioNeural` (no Actions); legenda grande em CAIXA ALTA | mesma voz, +12% de velocidade; legenda pequena 2–3 palavras com 1 palavra amarela (automático) |
| Publica | **18:00** (Brasília) | **12:00** (Brasília) |

## Passo a passo da sessão diária
1. Leia a seção **Histórico** abaixo: não repita temas. Se já existe job de hoje em `jobs/`, não faça outro (só avise o dono).
2. Escolha o tema do longo e o do short. Pesquise na web números/fatos do longo (cite fontes reais no roteiro; nada inventado apresentado como fato científico).
3. Crie `episodes/<AAAA-MM-DD>-<slug>/script.py` (META + BEATS) e `shots.js` (CAST + SHOTS) — um para o longo e um para o short (`<AAAA-MM-DD>-short-<slug>`).
4. Preview local (o sandbox não acessa o edge-tts; use o piper só para os tempos):
   ```bash
   npm ci && pip install --break-system-packages -q numpy scipy soundfile sherpa-onnx==1.12.40 edge-tts
   bash tools/get_piper.sh            # baixa a voz offline para models/
   python3 -m http.server 8765 &      # na raiz do repo
   python3 tools/tts.py episodes/<slug> --engine piper
   EP=episodes/<slug> FMT=long  node tools/render.js beats /tmp/prev 0.25,0.6,0.9      # longo
   EP=episodes/<slug> FMT=short node tools/render.js beats /tmp/prev 0.3,0.85          # short
   ```
   **Olhe os quadros** (Read) e corrija: câmera dentro de personagem/objeto, braços atravessando corpo, gente flutuando, texto saindo da tela ou cobrindo rosto, legenda em cima do rosto, cena vazia ou escura, `at?` no log (frase não encontrada). Repita até ficar limpo. Qualquer `[pageerror]` = bug, conserte.
5. Crie `jobs/<AAAA-MM-DD>-long-<slug>.json` e `jobs/<AAAA-MM-DD>-short-<slug>.json`:
   `{"episode": "episodes/<slug>", "publish_at": "2026-11-17T18:00:00-03:00"}` (short: 12:00). Opcional `"privacy": "private"` para teste.
6. Atualize o **Histórico** neste arquivo, faça commit e `git push origin main`. O workflow `render.yml` roda um job por arquivo novo em `jobs/`; o resultado vira uma Issue (✅/❌).
7. Avise o dono em português: os dois temas, horários e que o resultado aparece nas Issues.

## Roteiro (`script.py`)
```python
META = dict(format='long'|'short', title='...', description='... {CHAPTERS} ...', tags=[...],
            thumb=dict(beat='b01', frac=0.7, text='LINHA AMARELA', text2='linha branca'),   # só longo
            chapters=[('b01', 'O começo'), ('b05', '...')])                                    # só longo
BEATS = [dict(id='b01', text="...", pre=0.2, post=0.3), ...]
```
- Markup: `[[y:palavras]]` destaque (y amarelo, r vermelho, c ciano, g verde); `{Legenda|fala}` quando a pronúncia difere (nomes estrangeiros).
- Cada beat = uma cena. Longo: 25–32 beats de 6–17 s. Short: 7–10 beats de 2–5 s (1 frase cada; corte rápido como nos shorts de referência).
- Short: título curto e curioso + `#shorts`; descrição com "História ilustrativa (ficção)." Temas proibidos: crimes contra crianças, suicídio/automutilação, violência explícita, tragédias reais recentes, pessoas reais identificáveis.

## Cenas (`shots.js`)
```js
import { clamp, lerp, prog, ease, PI, center, bigNum, stamp, pop, dots, mmss, subBtn } from '/engine/kit.js';
export const SHOTS = {};
export const CAST = { nome: { style: 'palito'|'roblox', ...opções } };
SHOTS.b01 = (c) => { c.env('street', {tod:'dawn'}); c.track('nome', [{t:0, p:[x,y,z], ry, a:'walk', e2:'happy', hold:'phone'}, ...]); c.frame('nome', {d:3, h:1.5}); };
```
API do `c` (ver `engine/main.js` → `makeCtx`):
- `c.t` tempo no beat, `c.dur`, `c.at('trecho da fala')` → segundo em que a frase é dita (sincronize tudo com isso).
- `c.env(nome, params)` — cenários e parâmetros:
  - palito/geral: `street` {tod: day|dawn|dusk|night|gray, light: red|green, flick, grow 0–1, collapse 0–1, ruin, cars}, `lab` {alarm, timer, level, dispOk, power, mist, doorOpen}, `void`, `bakery`, `market` {power}, `stadium`, `citynight` {black}, `metro` {water, power}, `roof` {shoot}, `hospital` {torch, power}, `farm` {cycle, plant, dead}, `vault`, `solar` {removed, on, spark}, `library` {bolts}, `classroom` {board: (ctx2d, W, H) => desenho no quadro}, `gen` {power, shake, crank, smoke}, `final` {night}, `outro`
  - shorts: `house` {door, tv, tvColor}, `plane` (cabine; assentos x=±1.15/±2.0, fileiras z=6−1.4r; {cockpitOpen, tilt, shake, pitch}), `sky` {plane:{x,y,z,rx,ry,rz}, cloudSpeed}, `ocean` {night, sink, ship, ice, boat:{x,z,ry,flip}}, `park` {swing}, `baseplate`
- `c.track(nome, keys)` personagem: keys `{t, p:[x,y,z], ry, a, e2, hold, over:{campo:valor}, y, s, gx, gy}`. Frente do personagem: `ry=0` olha +z, `ry=PI` olha −z, `ry=PI/2` olha +x.
  - Animações `a`: idle walk run sprint sit sitleg floor floorEat crouch kneel point pointup shrug cheer dance hurt think lookup lookdown lookaround panic talk shout write wipe carry carryidle drive ride hug shoulder fall lie wave clap sleep tired turn crank tinker hold surf eat phone ridephone ridestop ridelook
  - Emoções `e2`: neutral happy smirk sad angry surprised scared worried tired cry deadpan (no Roblox cada uma vira um rosto oficial)
  - `hold`/props: can wrench book marker phone light needle ball bean pan bread bandage bolt suitcase dog mic cup bottle bag paper laptop money key flower baby umbrella
  - Sentado em cadeira de 0,5 m: Roblox `y≈0.36`, palito `y≈0.22`.
- Câmera: `c.frame(nome|[x,y,z], {d, h, up, yaw, side, f, drop, to:{...}, t0, t1})` (recomendado; yaw=0 = de frente pro personagem; em ponto [x,y,z] o yaw é absoluto), `c.cam([{t,p,l,f}, ...])` (chaves com mesmo t = corte seco), `c.camSet(p, l, f)`, `c.shake(a)`.
- Extras: `c.prop(key, {p, r, s})` objeto solto no mundo, `c.mini(i, {p, ry, a, e})` figurantes (40 no short, 120 no longo), `c.crowd(lista)` multidão instanciada, `c.puffs`, `c.glow`, `c.torch`, `c.PROPS.moto|car|cart|panel|fire`.
- Tela: `c.ui(html)`, `c.chip(x, y, texto, 'gold'|'blue'|'red'|'green'|'white', t0, t1)`, `c.tag([x,y,z], texto, cls, t0, t1)`, `c.bubble(c.CH.nome, texto, t0, t1)`, `c.flash(cor, a)`, `c.state.fade`, helpers do kit (`center`, `bigNum`, `stamp`, `subBtn`).
- Som: `c.sfx(nome, t, vol)` — nomes em `python3 tools/mix.py --list`.

### Personagem Roblox (`style:'roblox'`, padrão nos shorts)
Opções: `skin` light|tan|brown|dark|white|yellow, `shirt`, `pants`, `shoes`, `sleeves` short|long|none, `hair` short|long|bun|curly|spiky|pony|bald, `hairColor`, `hat` cap|police|captain|pilot|tophat|fedora|beanie|hard|chef|nurse|crown|bandana, `hatColor`, `female` (rostos femininos), `face` (rosto do neutro, ex. 'chill'), `faces` {emoção: rosto}, `glasses` 'sun'|true, `beard` cor, `tie` cor, `vest` cor, `belt`, `logo` texto. Rostos disponíveis: `assets/roblox-faces/index.json`.

### Regras de câmera que evitam bugs (aprendidas)
- Nunca deixe a câmera passar dentro de um personagem, assento ou parede: num corredor estreito, enquadre pelo corredor (yaw ~0.7 a partir do lado do corredor) ou de cima.
- Short: rosto entre 25% e 50% da altura da tela (a legenda fica em ~60%); `c.frame` já baixa o olhar no short.
- Longo: 1 corte a cada 3–6 s; short: 1 corte a cada ~2 s, quase sempre plano médio de 1–2 personagens.

## Arquivos
- `engine/` motor (three.js): `main.js` (contexto e render), `chars.js` (palito, poses, props), `roblox.js` (Roblox), `envs*.js` (cenários), `vehicles.js`, `kit.js`.
- `tools/tts.py` narração+timeline, `tools/render.js` quadros, `tools/mix.py` SFX+trilha, `tools/meta.py` youtube.json, `tools/build.sh` tudo, `tools/upload.py` YouTube (secrets `YT_CLIENT_ID`, `YT_CLIENT_SECRET`, `YT_REFRESH_TOKEN`), `tools/get_token.py` gera o refresh token.
- O repositório é **público** (minutos ilimitados no Actions); nunca coloque senhas em arquivos.

## Histórico (não repita)
- 2026-10-28 longo: E se a humanidade recomeçasse com apenas 2 pessoas? (`2026-10-28-humanidade-2-pessoas`) — publicado manualmente.
- 2026-11-16 short: Ela não largava a mala no avião (`2026-11-16-short-mala-do-aviao`) — publicado na hora (16/11 à noite).
- 2026-11-17 short: Ela dividia o lanche com um estranho todo dia (`2026-11-17-short-senhor-do-banco`) — avô na praça; publica 12:00.
- Ideia já prometida no final do vídeo 1: "E se a humanidade recomeçasse com 98 pessoas?" — boa candidata a próximo longo.
