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
- `c.env(nome, params)` — cenários e parâmetros (`ice` = Antártida, ver `engine/envs6.js`; `desert` = Saara/oásis, ver `engine/envs7.js`):
  - palito/geral: `street` {tod: day|dawn|dusk|night|gray, light: red|green, flick, grow 0–1, collapse 0–1, ruin, cars}, `lab` {alarm, timer, level, dispOk, power, mist, doorOpen}, `void`, `bakery`, `market` {power}, `stadium`, `citynight` {black}, `metro` {water, power}, `roof` {shoot}, `hospital` {torch, power}, `farm` {cycle, plant, dead}, `mars` {tod: day|dusk|night, storm, dust, green, glow, power, earth, cable, ships 1–3, rover:{x,z,ry,dust,off}, base, rocket} (domo em (0,-12), estufa em (12,-12), painéis x −20..−9, foguete em (−16,−30)), `sea` fundo do mar {night, power, alarm, storm, light, kelp, buoy: true|'broken'|false, cable, spin, fish:{x,y,z,r,n,speed}, glowy, more} (módulo em (0,2.6,-10), kelp x 8..18 — câmera fora do kelp, turbina (16,-28)), `seahab` interior da base {power, alarm, sun, night, glowy, fish, screen, haze} (sala x −6..6, z −3.5..3.5: câmera com |x|<5.8 e z<3.4), `hospital` {day:true} = claro, `vault`, `solar` {removed, on, spark}, `library` {bolts}, `classroom` {board: (ctx2d, W, H) => desenho no quadro}, `gen` {power, shake, crank, smoke}, `final` {night}, `outro`
  - `cave` cidade subterrânea (caverna, domo centrado em (0,0,−10)) {sun 0–1, power, lamp (lâmpadas de vitamina D em (−4,−14)), lights (luzinhas), plant, dead, water 0–1, alarm, cage (elevador em (−11,−20))}; fazenda de LED x 4..12, z −7/−11/−15; poço geotérmico (9,−22). `gen` aceita `{water}`.
  - `plane` também serve de nave espacial no longo com `{space:true}` (janelas com estrelas). `starship` = nave geracional por fora {spin, power, alarm, hit, earth 0–1, planet 0–1, engine, sunA}; `shipfarm` = corredor das plantações {plant, dead, alarm, hole, patch, leak, door, dim, frost}; `seahab {space:true}` = sala da nave.
  - shorts: `house` {door, tv, tvColor}, `plane` (cabine; assentos x=±1.15/±2.0, fileiras z=6−1.4r; {cockpitOpen, tilt, shake, pitch}), `sky` {plane:{x,y,z,rx,ry,rz}, cloudSpeed}, `ocean` {night, sink, ship, ice, boat:{x,z,ry,flip}}, `park` {swing}, `baseplate`
- `c.track(nome, keys)` personagem: keys `{t, p:[x,y,z], ry, a, e2, hold, over:{campo:valor}, y, s, gx, gy, suit}` (`suit:true` = capacete de vidro + mochila no palito). Frente do personagem: `ry=0` olha +z, `ry=PI` olha −z, `ry=PI/2` olha +x.
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
- `engine/` motor (three.js): `main.js` (contexto e render), `chars.js` (palito, poses, props), `roblox.js` (Roblox), `envs*.js` (cenários; `envs5.js` = ilha), `vehicles.js`, `kit.js`.
- `tools/tts.py` narração+timeline, `tools/render.js` quadros, `tools/mix.py` SFX+trilha, `tools/meta.py` youtube.json, `tools/build.sh` tudo, `tools/upload.py` YouTube (secrets `YT_CLIENT_ID`, `YT_CLIENT_SECRET`, `YT_REFRESH_TOKEN`), `tools/get_token.py` gera o refresh token.
- O repositório é **público** (minutos ilimitados no Actions); nunca coloque senhas em arquivos.

## Histórico (não repita)
- 2026-10-28 longo: E se a humanidade recomeçasse com apenas 2 pessoas? (`2026-10-28-humanidade-2-pessoas`) — publicado manualmente.
- 2026-11-16 short: Ela não largava a mala no avião (`2026-11-16-short-mala-do-aviao`) — publicado na hora (16/11 à noite).
- 2026-11-17 short: Ela dividia o lanche com um estranho todo dia (`2026-11-17-short-senhor-do-banco`) — avô na praça; publica 12:00.
- 2026-11-17 longo: E se a humanidade recomeçasse com 98 pessoas? (`2026-11-17-humanidade-98-pessoas`) — Bia, Seu Jorge, Dra. Helena; publica 18:00.
- 2026-11-18 short: Ele pescou uma garrafa com um bilhete dentro (`2026-11-18-short-garrafa-no-mar`) — pescador Pedro, bilhete escrito por ele mesmo aos 8 anos; publica 12:00.
- 2026-11-18 longo: E se a humanidade tivesse que recomeçar em Marte? (`2026-11-18-humanidade-em-marte`) — Lia, Rafa, Dra. Nina, Teo; base Nova Esperança; publica 18:00.
- 2026-11-19 short: O médico novo começou a cantar pra enfermeira (`2026-11-19-short-enfermeira-e-o-bebe`) — enfermeira cantava pro bebê prematuro; 25 anos depois ele volta médico; publica 12:00. (Motor: `hospital` ganhou `{day:true}` = iluminação clara de dia.)
- 2026-11-19 longo: E se a humanidade tivesse que recomeçar debaixo do mar? (`2026-11-19-humanidade-debaixo-do-mar`) — Iara, Davi, Dra. Sol, Kauê; base Atlântida; publica 18:00. (Motor: novos cenários `sea` e `seahab`, ver comentários em `engine/envs3.js`.)
- 2026-11-20 short: A cachorra latia toda noite pra mesma parede (`2026-11-20-short-cachorra-e-a-parede`) — Mel alimentava um filhote preso dentro da parede; publica 12:00. (Motor: `house` ganhou `{night:true}` e `{hole: 0..1}` = buraco na parede da direita em z=−2,5.)
- 2026-11-20 longo: E se a humanidade tivesse que recomeçar numa nave que viaja por cem anos? (`2026-11-20-humanidade-nave-cem-anos`) — Maya, Caio, Dra. Íris, Juca; nave Travessia; furo no anel das plantações; publica 18:00. (Motor: novos cenários `starship` (nave por fora) e `shipfarm` (anel das plantações), e `seahab` ganhou `{space:true}`; ver comentários em `engine/envs3.js`.)
- 2026-11-21 short: Ela pagava dois cafés, mas só tomava um (`2026-11-21-short-cafe-pago`) — Dona Lurdes paga café pra quem não pode; 50 anos antes o avô do atendente pagou o dela; padaria; publica 12:00.
- 2026-11-21 longo: E se a humanidade tivesse que recomeçar debaixo da terra? (`2026-11-21-humanidade-debaixo-da-terra`) — Nara, Beto, Dra. Luz, Tito, bebê Sol; supervulcão; enchente no túnel e gerador; publica 18:00. (Motor: novo cenário `cave` em `engine/envs4.js` (cidade na caverna: {sun, power, lamp, lights, plant, dead, water, alarm, cage}) e `gen` ganhou `{water}`.)
- 2026-11-22 short: Ela achou um recado embaixo da carteira da escola (`2026-11-22-short-carteira-da-escola`) — professora Ana volta à escola; resposta em caneta vermelha da Prof.ª Marta, hoje diretora; publica 12:00. (Motor: `classroom` ganhou porta na parede x=8, z≈2,2, com `{door: 0..1}`.)
- 2026-11-23 short: Ele devolveu um livro com 30 anos de atraso (`2026-11-23-short-livro-atrasado`) — Paulo devolve livro; bibliotecária Dona Cida tinha pago a multa ("ele vai voltar"); ele vira escritor e dedica o livro a ela; publica 12:00. (Motor: `library` ganhou `{desk:true, drawer:0..1}` = balcão de empréstimo em z=2, atendente em z≈1,15, cliente em z≈2,95.)
- 2026-11-23 longo: E se a humanidade tivesse que recomeçar numa ilha deserta? (`2026-11-23-humanidade-ilha-deserta`) — Mari, Zeca, Dra. Rosa, Kiko; tempestade solar (Carrington), navio à deriva; furacão e a tampa da caixa d'água; brasa no pote; publica 18:00. (Motor: novo cenário `island` em `engine/envs5.js` — ilha com {fire, lid, rope, tarp, tank, tanks, huts, roofs, houses, cross, plant, wreck, ship, storm, rain, surge, tod, stars, aurora}; ver comentários no arquivo.)
- 2026-11-24 short: Todo ano ela recebia flores de alguém que já tinha partido (`2026-11-24-short-flores-todo-ano`) — Dona Rosa; cartão "com amor, J."; Seu João tinha pago a floricultura por 20 anos ("se eu for antes, não deixa ela ficar sem flor"); casa; publica 12:00.
- 2026-11-24 longo: E se a humanidade tivesse que recomeçar na Antártida? (`2026-11-24-humanidade-antartida`) — Ana, Tião, Dra. Clara, Nico; "verão que não acaba"; Estação Aurora; nevasca entope a entrada de ar do gerador; "abraço de pinguim" no refeitório; publica 18:00. (Motor: novo cenário `ice` em `engine/envs6.js` — estação na Antártida com {tod, storm, snow, power, flick, clog, cap, gen2, exhaust, rope, glow, panels, peng, huddle, ship, more, stars, aurora}; ver comentários no arquivo.)
- 2026-11-25 short: O piloto parou tudo pra falar da comissária (`2026-11-25-short-ultimo-voo`) — último voo da comissária Vera; 25 anos antes ela segurou a mão de um menino que voava sozinho e deu um broche de asinhas; ele virou o comandante; avião; publica 12:00.
- 2026-11-25 longo: E se a humanidade tivesse que recomeçar no deserto? (`2026-11-25-humanidade-no-deserto`) — Lara, Seu Bento, Dra. Nádia, Pipo; "chuva que não para"; Oásis Estrela no Saara; tempestade de areia entope a bomba do único poço; redes de orvalho; publica 18:00. (Motor: novo cenário `desert` em `engine/envs7.js` — oásis com {tod, storm, wall, clog, jet, tank, well2, dust, wet, nets, plant, lush, trees, trucks, more, village, panels, power, stars}; ver comentários no arquivo.)
- 2026-11-26 short: O carteiro batia na porta dela mesmo sem carta (`2026-11-26-short-carteiro-sem-carta`) — carteiro Tonho visita Dona Zilda todo dia; ela cai, ele ouve e chama ajuda; a primeira carta dela em 20 anos é pra ele; rua (fachada nº 27 desenhada no shots.js) + casa + hospital; publica 12:00.
- 2026-11-26 longo: E se a humanidade tivesse que recomeçar na Lua? (`2026-11-26-humanidade-na-lua`) — Duda, Seu Raimundo, Dra. Yara, Biel; asteroide; Base Saudade no polo sul; tremor lunar corta o cabo da torre solar; o Biel guia o jipe pela Terra parada no céu; publica 18:00. (Motor: novo cenário `moon` em `engine/envs8.js` — {tod: day|dark, power, alarm, green, glow, forest, more, cable2, tube, cut, rock, spark, rover:{x,z,ry,lights,spin}, lander:{y}, flame, landerOff, earth, ast}; ver comentários no arquivo. A Terra na janela da `seahab` é desenhada no shots.js do episódio.)
- 2026-11-27 short: Ela piscava a luz da varanda toda noite às 9h (`2026-11-27-short-luz-da-varanda`) — Dona Neusa pisca 3 vezes; o filho caminhoneiro Zé responde com o farol na estrada ("tô bem, mãe"); um dia não pisca: ele largou a estrada pra jantar com ela; `farm` à noite + varanda/estrada/caminhão desenhados no shots.js; publica 12:00.
- Ideia já prometida no final do vídeo de 26/11: "E se a humanidade tivesse que recomeçar num navio que nunca pode parar?" — boa candidata a próximo longo (o cenário `ocean` pode servir de base).
