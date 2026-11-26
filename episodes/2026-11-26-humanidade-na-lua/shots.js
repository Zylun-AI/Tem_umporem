// LONGO: "E se a humanidade tivesse que recomeçar na Lua?" — palito, 1920x1080.
// Cenário novo: 'moon' (engine/envs8.js). Também: seahab {space} (sala da base), plane {space} (viagem), street, metro, outro.
import { clamp, lerp, ease, PI, prog, stamp, bigNum, pop, seeded, subBtn } from '/engine/kit.js';
export const SHOTS = {};
const P0 = { num: null, flag: false };
export const CAST = {
  duda: { style: 'palito', ...P0, shirt: 0xff7a1a, trim: 0xffffff, shorts: 0x2b2f45, hair: 'lia', scale: 0.96 },
  rai: { style: 'palito', ...P0, shirt: 0x8a6a45, trim: 0xffd21f, shorts: 0x3a3a3a, hair: 'old', cap: 0xffd21f },
  yara: { style: 'palito', ...P0, shirt: 0xf4f4f4, trim: 0x2aa198, shorts: 0x2aa198, hair: 'lia', scale: 0.96 },
  biel: { style: 'palito', ...P0, shirt: 0x2a6ad6, trim: 0xffd21f, shorts: 0x222a44, cap: 0xd62828, scale: 0.66 },
  bielA: { style: 'palito', ...P0, shirt: 0x2a6ad6, trim: 0xffd21f, shorts: 0x222a44, cap: 0xd62828, scale: 1.0 },
};
const COLS = [0xff7a1a, 0x2a6ad6, 0x2fa35a, 0xf4f4f4, 0xd6a31c, 0x8a3ad6, 0x0aa6b8, 0xe02020];
const title = (c, txt, t0, o = {}) => { if (c.t < t0) return; const s = pop(c.t, t0, 0.3) || 1; c.ui(`<div class="abs" style="left:0;right:0;top:${o.top ?? 70}px;text-align:center;transform:scale(${s})"><div style="display:inline-block;background:${o.bg ?? '#d62828'};border:7px solid #fff;border-radius:22px;padding:6px 60px;font-weight:900;font-size:${o.size ?? 96}px;color:${o.color ?? '#fff'};transform:rotate(-2deg);box-shadow:0 14px 0 rgba(0,0,0,.45)">${txt}</div></div>`); };
const card = (html, o = {}) => `<div class="abs" style="left:${o.x ?? 960}px;top:${o.y ?? 150}px;transform:translate(-50%,0) scale(${o.s ?? 1});opacity:${o.a ?? 1};background:rgba(10,14,28,.88);border:5px solid ${o.b ?? '#7ab8ff'};border-radius:26px;padding:22px 44px;color:#fff;font-weight:900;font-size:${o.size ?? 50}px;text-align:center;white-space:nowrap">${html}</div>`;
const big = (c, txt, t0, o = {}) => { if (c.t < t0) return; c.ui(bigNum(txt, o.x ?? 960, o.y ?? 250, { size: o.size ?? 130, color: o.color ?? '#ffd21f', glow: o.glow ?? 'rgba(255,210,31,.6)', s: pop(c.t, t0, 0.3) || 1 })); };
const cards = (c, list, y = 90, b = '#7ab8ff') => list.forEach(([w, txt, x], i) => { const t0 = typeof w === 'number' ? w : c.at(w); if (c.t > t0) c.ui(card(txt, { x: x ?? (560 + i * 800), y, size: 46, b, s: pop(c.t, t0, 0.25) || 1 })); });
const dark = (c, k = 1) => c.ui(`<div class="abs" style="left:0;top:0;width:1920px;height:1080px;box-shadow:inset 0 0 300px 140px rgba(0,0,10,${0.75 * k});pointer-events:none"></div>`);
const M = (c, p = {}) => { c.env('moon', p); if (ROCKM) ROCKM.visible = false; };
// sala da base (seahab space) + a Terra na janela redonda
let EARTHWIN = null;
const ROOM = (c, p = {}) => { c.env('seahab', { space: true, ...p }); if (!EARTHWIN) { const T = c.THREE; const cv = document.createElement('canvas'); cv.width = 128; cv.height = 128; const x = cv.getContext('2d');
    const gr = x.createRadialGradient(54, 54, 8, 64, 64, 62); gr.addColorStop(0, '#5aa8ff'); gr.addColorStop(1, '#16408a'); x.fillStyle = gr; x.beginPath(); x.arc(64, 64, 60, 0, 7); x.fill(); x.fillStyle = '#3f9a4a'; [[40, 50, 18, 12], [80, 80, 14, 20], [70, 36, 10, 8]].forEach(([a, b, w, h]) => { x.beginPath(); x.ellipse(a, b, w, h, 0.5, 0, 7); x.fill(); });
    x.fillStyle = 'rgba(255,255,255,.8)'; [[50, 30, 30, 5], [86, 58, 22, 4], [44, 92, 26, 5]].forEach(([a, b, w, h]) => { x.beginPath(); x.ellipse(a, b, w, h, 0.2, 0, 7); x.fill(); });
    const tx = new T.CanvasTexture(cv); tx.colorSpace = T.SRGBColorSpace; EARTHWIN = new T.Mesh(new T.CircleGeometry(0.42, 32), new T.MeshBasicMaterial({ map: tx, transparent: true })); EARTHWIN.position.set(0.35, 1.95, -3.45); c.ENV.seahab.g.add(EARTHWIN); }
  EARTHWIN.visible = true; };
// figurantes na sala (grade x -0.6..3.2, z -2.6..0)
const roomPeople = (c, n, o = {}) => { const R = seeded(o.seed || 3); let k = 0; for (let i = 0; i < n; i++) { const x = -0.6 + (o.ox || 0) + (i % 6) * 0.75 + (R() - 0.5) * 0.2, z = -2.6 + (o.oz || 0) + Math.floor(i / 6) * 0.85; if (z > 0.2 + (o.oz || 0)) break;
  const jump = o.jump ? Math.abs(Math.sin(c.t * 2.2 + i * 0.9)) * 0.9 : 0; c.mini(k++, { p: [x, jump, z], ry: o.ry ?? 0, a: typeof o.a === 'function' ? o.a(i) : (o.a || 'idle'), e: o.e || 'neutral', s: (o.s ?? 0.92) * (o.kids && i % 3 === 0 ? 0.65 : 1) }); } };
// viagem (cabine do "avião" em modo nave)
const SEAT = (x, r) => [x, 0.22, 6 - 1.4 * r];
function cabinCrowd(c, skip = []) { let k = 0; for (let r = 0; r < 9; r++) for (const x of [-2.0, -1.15, 1.15, 2.0]) { if (skip.some(([sx, sr]) => sx === x && sr === r)) continue; if (k >= 30) return; c.mini(k++, { p: SEAT(x, r), ry: PI, a: 'sit', e: (r + k) % 3 ? 'neutral' : 'happy', s: 0.95 }); } }
// pontos do cenário da Lua
const DOOR = [0, 0, -5.0], CUT = [-18, 0, -42], MINE = [30, 0, 14], GH = [11, 0, -9];
// jipe: posição dos assentos (local ±0.5, y 1.02, z -0.2), frente +z
const seatOn = (rv, sx) => [rv.x + Math.cos(rv.ry) * sx + Math.sin(rv.ry) * -0.2, 1.02, rv.z - Math.sin(rv.ry) * sx + Math.cos(rv.ry) * -0.2];
const lerp3 = (a, b, u) => a.map((v, i) => lerp(v, b[i], u));
let ROCKM = null; const ROCK = (c, p, s = 0.5) => { if (!ROCKM) { const T = c.THREE; ROCKM = new T.Mesh(new T.DodecahedronGeometry(1, 0), new T.MeshLambertMaterial({ color: 0x8a8a86 })); c.ENV.moon.g.add(ROCKM); } ROCKM.position.set(...p); ROCKM.scale.setScalar(s); ROCKM.visible = true; };
// tremor
const quake = (c, k) => { if (k > 0) c.shake(k * 1.6, 30); };

// ================= GANCHO =================
SHOTS.b01 = (c) => {
  const t = c.t; const tN = c.at('Nenhum ar'), tE = c.at('E essa base'), tU = c.at('única casa'); c.sfx('riser', 0.2, 0.4); c.sfx('boom', tU, 0.7);
  M(c, {});
  if (t < tN) { c.cam([{ t: 0, p: [70, 40, 90], l: [-20, 0, -20], f: 46 }, { t: tN, p: [55, 30, 70], l: [-20, 0, -20], f: 46 }]); c.chip(960, 90, 'A LUA', 'gold', 0.5, tN); }
  else if (t < tE) { c.cam([{ t: tN, p: [-6, 2.0, 30], l: [-40, 12, -40], f: 50 }, { t: tE, p: [-4, 2.2, 26], l: [-40, 12, -40], f: 50 }]);
    cards(c, [['Nenhum ar', '🚫 SEM AR'], ['céu preto', '🌑 CÉU PRETO'], ['crateras', '🥶 −200 °C', 960]], 90, '#ff3b30'); }
  else { c.cam([{ t: tE, p: [9, 3.2, 14], l: [-2, 2.4, -6], f: 50 }, { t: c.dur, p: [7, 3.0, 11.5], l: [-2, 2.4, -6], f: 50 }]);
    c.track('duda', [{ t: 0, p: [2.2, 0, -2], ry: 0.6, a: 'walk', e2: 'neutral', suit: true }, { t: c.dur, p: [3.4, 0, 0], ry: 0.6, a: 'walk', e2: 'neutral', suit: true }]);
    if (t > tU) title(c, 'A ÚNICA CASA DE 120 PESSOAS', tU + 0.1, { size: 78, bg: '#2a4ab0' }); }
};

SHOTS.b02 = (c) => {
  const t = c.t; const tT = c.at('tremer'), tC = c.at('o cabo'), tP = c.at('se partiu'); c.sfx('crash', tT, 0.6); c.sfx('boom', tP, 0.8); c.sfx('spark', tP, 0.6);
  const qk = t > tT ? 1 : 0;
  if (t < tC) { ROOM(c, { alarm: t > tT ? 1 : 0 }); roomPeople(c, 14, { a: 'panic', e: 'scared', seed: 2 }); quake(c, qk);
    c.track('biel', [{ t: 0, p: [-0.3, 0, 1.9], ry: 0.2, a: t < tT ? 'idle' : 'panic', e2: t < tT ? 'neutral' : 'scared' }]);
    c.cam([{ t: 0, p: [0.5, 1.6, 3.2], l: [-1.2, 1.0, 0.2], f: 50 }, { t: tC, p: [0.3, 1.6, 3.0], l: [-1.2, 1.0, 0.2], f: 50 }]);
    if (t > tT) title(c, 'TREMOR LUNAR', tT, { bg: '#d62828' }); }
  else { M(c, { cut: t > tP ? 1 : 0, rock: clamp(prog(t, tC, tP)), power: t > tP ? 0 : 1 }); quake(c, 0.6);
    c.cam([{ t: tC, p: [-8, 3.5, -30], l: [-20, 1.5, -46], f: 50 }, { t: c.dur, p: [-9, 3.0, -33], l: [-18, 0.5, -42], f: 46 }]);
    if (t > tP) { c.tag([CUT[0], 1.2, CUT[2]], '⚡ CABO PARTIDO', 'red', tP, 1e9); } }
};

SHOTS.b03 = (c) => {
  const t = c.t; const tO = c.at('oxigênio'), tB = c.at('só dois dias'), tV = c.at('Mas pra entender'); c.sfx('blackout', 0.1, 0.6); c.sfx('alarm', tO, 0.3); c.sfx('whoosh', tV + 1.2, 0.6);
  ROOM(c, { power: 0.15, alarm: 1, screen: 'red' }); roomPeople(c, 12, { a: 'idle', e: 'worried', seed: 6 });
  c.track('duda', [{ t: 0, p: [-4.8, 0, -1.0], ry: -PI / 2 + 0.5, a: 'think', e2: 'worried' }]);
  c.cam([{ t: 0, p: [-1.8, 1.7, 1.8], l: [-5.2, 1.3, -1.2], f: 48 }, { t: c.dur, p: [-2.2, 1.65, 1.2], l: [-5.2, 1.3, -1.2], f: 48 }]);
  if (t > tO) c.ui(card('🫁 MÁQUINA DE OXIGÊNIO: <span style="color:#ff3b30">PARADA</span>', { y: 90, b: '#ff3b30', s: pop(t, tO, 0.25) || 1 }));
  if (t > tB) big(c, '🔋 2 DIAS', tB, { y: 300, color: '#ff3b30', glow: 'rgba(255,60,48,.6)' });
  if (t > tV + 0.8) c.state.fade = prog(t, c.dur - 0.6, c.dur);
};

// ================= COMEÇO =================
SHOTS.b04 = (c) => {
  const t = c.t; const tA = c.at('asteroide'), tI = c.at('O impacto'), tP = c.at('por anos'); c.sfx('dramatic', tA, 0.5); c.sfx('riser', tI, 0.4);
  c.state.fade = 1 - prog(t, 0, 0.6);
  c.env('street', { tod: t < tI ? 'dusk' : 'gray' });
  for (let i = 0; i < 16; i++) c.mini(i, { p: [-6 + (i % 8) * 1.6, 0, 2 + Math.floor(i / 8) * 1.8], ry: PI, a: i % 3 ? 'lookup' : 'point', e: 'scared', s: 0.95 });
  c.track('duda', [{ t: 0, p: [-0.8, 0, 6.5], ry: PI - 0.2, a: 'lookup', e2: 'worried' }]); c.track('biel', [{ t: 0, p: [0.4, 0, 6.6], ry: PI + 0.2, a: 'point', e2: 'scared' }]);
  c.cam([{ t: 0, p: [1.5, 1.3, 11], l: [-1, 3.6, -8], f: 52 }, { t: c.dur, p: [1.2, 1.2, 9.5], l: [-1, 3.8, -8], f: 52 }]);
  c.chip(960, 70, '5 ANOS ANTES', 'white', 0.3, tA);
  if (t > tA && t < tI) { const k = prog(t, tA, tI); const x = lerp(1500, 1180, k), y = lerp(160, 250, k); c.ui(`<div class="abs" style="left:${x}px;top:${y}px;width:60px;height:60px;border-radius:50%;background:radial-gradient(circle at 35% 35%,#b79a7a,#5a4636);box-shadow:0 0 40px 10px rgba(255,150,60,.7),60px -30px 80px 10px rgba(255,170,80,.35)"></div>`); c.chip(x + 30, y - 40, '☄️ ASTEROIDE', 'red', tA, tI); }
  if (t > tP) title(c, 'O SOL SOME POR ANOS', tP, { bg: '#3a3a3a', size: 84 });
};

SHOTS.b05 = (c) => {
  const t = c.t; const tC = c.at('cento e vinte'), tL = c.at('a Lua'); c.sfx('footsteps', 0.2, 0.4); c.sfx('whoosh', tC, 0.5); c.sfx('tada', tL, 0.5);
  if (t < tC - 0.3) { c.env('metro', { power: 1 }); for (let i = 0; i < 30; i++) { const z = 2 - (i % 10) * 3, x = -1.6 + Math.floor(i / 10) * 1.6; c.mini(i, { p: [x, 0, z - ((t * 1.2) % 3)], ry: PI, a: 'walk', e: 'worried', s: i % 4 ? 0.95 : 0.62 }); }
    c.cam([{ t: 0, p: [3, 2.6, 8], l: [0, 1.4, -6], f: 52 }, { t: tC, p: [2.6, 2.4, 6.5], l: [0, 1.4, -6], f: 52 }]); c.chip(960, 90, '🏚️ ABRIGOS DEBAIXO DA TERRA', 'white', 0.3, tC); }
  else { M(c, {}); c.cam([{ t: tC - 0.3, p: [16, 2.6, 8], l: [-40, 8, -30], f: 46 }, { t: c.dur, p: [14, 2.4, 6], l: [-40, 8, -30], f: 46 }]);
    cards(c, [['sementes', '🌱 SEMENTES'], ['conhecimento', '📚 CONHECIMENTO']], 90, '#2fa35a');
    if (t > tL) title(c, '🌕 A LUA', tL, { bg: '#2a4ab0', top: 820 }); }
};

SHOTS.b06 = (c) => {
  const t = c.t; const tA = c.at('Os astronautas'), tR = c.at('Artemis'); c.sfx('engine', 0, 0.4); c.sfx('pop', tA + 0.3, 0.5); c.sfx('ding', tR, 0.5);
  c.env('plane', { space: true, shake: 0.25 });
  c.track('biel', [{ t: 0, p: SEAT(-2.0, 2), ry: PI, a: 'sit', e2: 'happy' }]); c.track('duda', [{ t: 0, p: SEAT(-1.15, 2), ry: PI, a: 'sit', e2: 'neutral' }]);
  cabinCrowd(c, [[-2.0, 2], [-1.15, 2]]);
  if (t < tA) c.cam([{ t: 0, p: [0.2, 2.6, -6], l: [0, 1.0, 6], f: 54 }, { t: tA, p: [0.1, 2.4, -4.5], l: [0, 1.0, 6], f: 54 }]);
  else c.cam([{ t: tA, p: [0.2, 1.75, 1.6], l: [-1.6, 1.2, 3.2], f: 50 }, { t: c.dur, p: [0.15, 1.75, 1.9], l: [-1.6, 1.2, 3.2], f: 46 }]);
  big(c, '384.400 KM', 0.3, { y: 820 }); if (t > tA) c.chip(960, 360, '🚀 APOLLO: ~3 DIAS', 'gold', tA, tR);
  if (t > tR) c.ui(card('ARTEMIS II · ABRIL DE 2026<div style="font-size:34px;color:#7ab8ff">4 astronautas deram a volta na Lua</div>', { y: 340, s: pop(t, tR, 0.25) || 1 }));
};

SHOTS.b07 = (c) => {
  const t = c.t; const tS = c.at('Base Saudade'), tT = c.at('a Terra fica'); c.sfx('engine', 0, 0.5); c.sfx('boom', tS - 0.5, 0.4); c.sfx('twinkle', tT, 0.5);
  if (t < tS - 0.4) { const k = prog(t, 0, tS - 0.5); M(c, { lander: { y: lerp(30, 0, ease.o(k)) }, flame: k < 1 ? 1 : 0 }); c.puffs([-16, 0.3, 4], k > 0.7 ? 1 : 0, { speed: 1.2 });
    c.cam([{ t: 0, p: [4, 3, 26], l: [-16, 14, 4], f: 50 }, { t: tS, p: [2, 2.5, 22], l: [-16, 4, 4], f: 50 }]); c.chip(960, 90, 'POLO SUL DA LUA', 'white', 0.3, tS); }
  else if (t < tT - 0.2) { M(c, { power: 1 }); c.cam([{ t: tS - 0.4, p: [0, 3.0, 12], l: [0, 2.6, -6], f: 50 }, { t: tT, p: [0, 2.8, 9.5], l: [0, 2.6, -6], f: 50 }]); title(c, 'BASE SAUDADE', tS, { bg: '#2a4ab0' }); }
  else { M(c, { power: 1 }); c.cam([{ t: tT - 0.2, p: [16, 2.2, 6], l: [-80, 11, -20], f: 44 }, { t: c.dur, p: [16, 2.2, 6], l: [-80, 11, -20], f: 36 }]);
    c.tag([-420, 160, -60], '🌍 A TERRA — SEMPRE NO MESMO LUGAR', 'blue', tT, 1e9); }
};

SHOTS.b08 = (c) => {
  const t = c.t; const ts = [c.at('a Duda'), c.at('Seu Raimundo'), c.at('doutora Yara'), c.at('o Biel'), c.at('telescópio')]; ts.forEach(q => c.sfx('pop', q + 0.2, 0.5));
  ROOM(c); roomPeople(c, 12, { a: 'idle', e: 'happy', seed: 9, s: 0.85 });
  const W = [['duda', -0.9], ['rai', 0.5], ['yara', 1.9], ['biel', 3.2]];
  W.forEach(([n, x], i) => c.track(n, [{ t: 0, p: [x, 0, 0.5], ry: 0.05 * (i - 1.5) * -1, a: t > ts[i] && t < ts[i] + 1.6 ? (n === 'biel' ? 'cheer' : 'wave') : 'idle', e2: 'happy', hold: n === 'biel' && t > ts[4] ? 'light' : (n === 'yara' ? 'paper' : (n === 'rai' ? 'wrench' : null)) }]));
  const lab = [['DUDA', 'ENGENHEIRA ELÉTRICA', '#ff7a1a'], ['SEU RAIMUNDO', 'EX-MINEIRO DE MINAS', '#ffd21f'], ['DRA. YARA', 'MÉDICA', '#2aa198'], ['BIEL · 9 ANOS', '🔭 TELESCÓPIO DE BRINQUEDO', '#5aa8ff']];
  const who = ts.slice(0, 4).filter(q => t > q).length - 1;
  if (who < 0) c.cam([{ t: 0, p: [1.2, 1.7, 3.3], l: [1.2, 1.1, -0.5], f: 56 }, { t: ts[0], p: [1.2, 1.7, 3.1], l: [1.2, 1.1, -0.5], f: 56 }]);
  else { const x = W[who][1]; const s = who === 3 ? 0.66 : 1; c.cam([{ t: ts[who], p: [x + 0.4, 0.9 + 0.75 * s, 0.5 + 2.5 * s], l: [x, 0.75 + 0.55 * s, 0.5], f: 46 }, { t: ts[who] + 3, p: [x + 0.3, 0.9 + 0.75 * s, 0.5 + 2.2 * s], l: [x, 0.75 + 0.55 * s, 0.5], f: 46 }]);
    const [n, d, col] = lab[who]; c.ui(`<div class="abs" style="left:120px;top:760px;padding:16px 40px;border-radius:24px;background:rgba(10,14,28,.88);border:5px solid ${col};color:#fff;font-weight:900;font-size:60px">${n}<div style="font-size:36px;color:${col}">${d}</div></div>`); }
};

SHOTS.b09 = (c) => {
  const t = c.t; const tR = c.at('Regra'), tA = c.at('não tem ar'), tM = c.at('mais de duzentos'); c.sfx('door', 0.2, 0.5); c.sfx('ding', tR, 0.5); c.sfx('boom', tM, 0.5);
  M(c, {});
  ['duda', 'rai', 'biel'].forEach((n, i) => c.track(n, [{ t: 0, p: [-0.9 + i * 0.9, 0, -4.6], ry: 0, a: 'walk', e2: 'neutral', suit: true }, { t: 3, p: [-0.9 + i * 0.9, 0, -1.2], ry: 0, a: 'idle', e2: 'happy', suit: true }]));
  c.cam([{ t: 0, p: [3.2, 1.8, 4.6], l: [0, 1.2, -2.5], f: 48 }, { t: c.dur, p: [2.4, 1.7, 3.6], l: [0, 1.2, -2.2], f: 48 }]);
  title(c, 'REGRA Nº 1: SEMPRE DE TRAJE', tR, { bg: '#2a4ab0', size: 76 });
  if (t > tM) { c.ui(card('☀️ <span style="color:#ffb02e">+120 °C</span>', { x: 640, y: 260, b: '#ffb02e', s: pop(t, tM, 0.25) || 1 })); c.ui(card('🌑 <span style="color:#7ab8ff">−130 °C</span>', { x: 1280, y: 260, s: pop(t, tM + 0.3, 0.25) || 1 })); }
};

// ================= VANTAGENS =================
SHOTS.b10 = (c) => {
  const t = c.t; const tG = c.at('gelo de água'), tE = c.at('Em 2018'); c.sfx('twinkle', tG, 0.6); c.sfx('pop', tE, 0.4);
  M(c, {});
  c.cam([{ t: 0, p: [44, 9, 30], l: [30, 0, 14], f: 46 }, { t: c.dur, p: [38, 5, 23], l: [29, 0, 13], f: 46 }]);
  if (t > tE) c.chip(960, 90, '2018 · NASA CONFIRMA', 'white', tE, 1e9);
  if (t > tG) c.tag([30, 1.2, 14], '🧊 GELO DE ÁGUA', 'blue', tG, 1e9);
  if (t > c.at('sol nunca bate')) c.ui(card('☀️ ✕ O SOL NUNCA BATE AQUI', { y: 880, size: 42, b: '#ffb02e' }));
};

SHOTS.b11 = (c) => {
  const t = c.t; const tC = c.at('chefe'), tB = c.at('pra beber'), tO = c.at('oxigênio'); c.sfx('crank', 0.2, 0.4); c.sfx('water', tB, 0.4); c.sfx('ding', tO, 0.5);
  if (t < tB) { M(c, {}); c.track('rai', [{ t: 0, p: [MINE[0] + 2.2, 0, MINE[2] + 2.0], ry: 0.5, a: 'tinker', e2: 'happy', hold: 'wrench', suit: true }]);
    c.frame('rai', { yaw: 0.4, d: 3.6, h: 1.1, f: 46, to: { d: 3.2 } }); if (t > tC) c.ui(card('⛏️ CHEFE DA MINA DE GELO', { y: 90, b: '#ffd21f' })); }
  else { ROOM(c); c.track('yara', [{ t: 0, p: [-4.4, 0, 2.2], ry: -PI / 2 - 0.4, a: 'hold', e2: 'happy', hold: 'cup' }]); c.track('duda', [{ t: 0, p: [-3.2, 0, 1.6], ry: -PI / 2 - 0.2, a: 'point', e2: 'happy' }]);
    c.cam([{ t: tB, p: [-0.8, 1.7, 3.2], l: [-4.6, 1.2, 2.2], f: 50 }, { t: c.dur, p: [-1.2, 1.7, 3.0], l: [-4.6, 1.2, 2.2], f: 50 }]);
    c.ui(card('🧊 GELO → 💧 ÁGUA', { y: 90, b: '#5aa8ff' }));
    if (t > tO) c.ui(card('💧 + ⚡ = H₂ + <span style="color:#5ad87a">O₂ 🫁</span>', { y: 250, b: '#2fa35a', size: 60, s: pop(t, tO, 0.25) || 1 })); }
};

SHOTS.b12 = (c) => {
  const t = c.t; const tN = c.at('nunca se põe'), tT = c.at('torre solar'), tC = c.at('dois quilômetros'); c.sfx('twinkle', tN, 0.4); c.sfx('pop', tC, 0.5);
  M(c, {});
  if (t < tT - 0.2) { c.cam([{ t: 0, p: [-10, 14, -52], l: [-34, 18, -78], f: 46 }, { t: tT, p: [-14, 12, -56], l: [-34, 18, -78], f: 46 }]); if (t > tN) c.chip(960, 90, '☀️ O SOL QUASE NUNCA SE PÕE', 'gold', tN, 1e9); }
  else { c.cam([{ t: tT - 0.2, p: [6, 9, 8], l: [-16, 2, -40], f: 46 }, { t: c.dur, p: [4, 10, 4], l: [-16, 2, -40], f: 46 }]);
    c.tag([-34, 36, -78], '☀️ TORRE SOLAR', 'gold', tT, 1e9); if (t > tC) c.tag([-9, 0.6, -30], '⚡ CABO · 2 KM', 'gold', tC, 1e9); }
};

SHOTS.b13 = (c) => {
  const t = c.t; const tP = c.at('pula'), tR = c.at('Seu Raimundo'); c.sfx('whoosh', tP, 0.5); c.sfx('laugh', tP + 0.8, 0.4); c.sfx('pop', tR, 0.4);
  M(c, {});
  const jy = t > tP - 0.3 ? Math.max(0, Math.sin((t - tP + 0.3) * 1.6)) * 2.4 : 0;
  c.track('biel', [{ t: 0, p: [2, 0, 1], ry: 0.3, a: jy > 0.05 ? 'cheer' : 'idle', e2: 'happy', y: jy, suit: true }]);
  c.track('rai', [{ t: 0, p: [-1.4, 0, 0.6], ry: 0.3, a: t > tR ? 'cheer' : 'idle', e2: 'happy', suit: true }]);
  if (t > tR) ROCK(c, [-1.4, 2.55, 0.6], 0.5); else ROCK(c, [-0.9, 0.35, 1.3], 0.5);
  c.cam([{ t: 0, p: [1.2, 2.2, 8.5], l: [0.4, 1.9, 0.8], f: 50 }, { t: c.dur, p: [0.8, 2.1, 7.5], l: [0.4, 1.9, 0.8], f: 50 }]);
  big(c, 'GRAVIDADE: 1/6', 0.4, { y: 150, size: 100, color: '#7ab8ff', glow: 'rgba(120,180,255,.6)' });
  if (t > tP) c.chip(1450, 300, '6× MAIS ALTO', 'gold', tP, 1e9);
};

SHOTS.b14 = (c) => {
  const t = c.t; const tA = c.at('alface'), tJ = c.at('E pela janela'), tQ = c.at('quatro vezes'); c.sfx('cheer', 0.3, 0.4); c.sfx('twinkle', tQ, 0.5);
  if (t < tJ - 0.2) { M(c, { power: 1 }); c.cam([{ t: 0, p: [17, 2.4, -1], l: [11, 1.2, -9], f: 46 }, { t: tJ, p: [16, 2.2, -2.5], l: [11, 1.2, -9], f: 46 }]);
    c.chip(960, 90, '🎉 PRIMEIRO ANO', 'gold', 0.3, tJ); if (t > tA) c.tag([11, 4.4, -9], '🥬 A PRIMEIRA ALFACE FORA DA TERRA', 'green', tA, 1e9); }
  else { ROOM(c); roomPeople(c, 10, { a: (i) => (i % 3 ? 'dance' : 'clap'), e: 'happy', seed: 4, kids: true, ox: 1.4, oz: 1.4 });
    c.track('biel', [{ t: 0, p: [-0.7, 0, -2.75], ry: PI - 0.3, a: 'hold', e2: 'happy', hold: 'light', y: 0.3 }]);
    c.cam([{ t: tJ - 0.2, p: [-2.6, 1.6, -0.6], l: [-0.2, 1.6, -3.3], f: 50 }, { t: c.dur, p: [-2.4, 1.6, -0.9], l: [-0.2, 1.6, -3.3], f: 50 }]);
    if (t > tQ) c.ui(card('🌍 4× MAIOR QUE A LUA CHEIA', { y: 90, s: pop(t, tQ, 0.25) || 1 })); }
};

// ================= PREÇO =================
SHOTS.b15 = (c) => {
  const t = c.t; const tV = c.at('caquinho'), tA = c.at('Os astronautas'), tN = c.at('nariz'); c.sfx('wipe', 0.4, 0.5); c.sfx('error', tV, 0.4); c.sfx('cough', tN, 0.5);
  M(c, {});
  c.track('duda', [{ t: 0, p: [1.2, 0, -2.4], ry: 0.4, a: 'wipe', e2: 'angry', suit: true }]);
  c.frame('duda', { yaw: 0.3, d: 4.6, h: 1.0, f: 46, to: { d: 4.0 } });
  if (t > tV) c.ui(card('🔍 POEIRA LUNAR = <span style="color:#ff3b30">CAQUINHOS DE VIDRO</span>', { y: 90, b: '#ff3b30', s: pop(t, tV, 0.25) || 1 }));
  if (t > tA) c.chip(1460, 900, 'APOLLO 17: “FEBRE DO FENO LUNAR”', 'white', tA, 1e9);
};

SHOTS.b16 = (c) => {
  const t = c.t; const tR = c.at('radiação'), tE = c.at('enterrada'), tY = c.at('doutora Yara'); c.sfx('buzz', tR, 0.3); c.sfx('pop', tE, 0.4); c.sfx('tick', tY, 0.5);
  if (t < tY - 0.2) { M(c, { power: 1 }); c.cam([{ t: 0, p: [14, 6, 8], l: [-2, 2, -12], f: 48 }, { t: tY, p: [12, 5, 5], l: [-2, 2, -12], f: 48 }]);
    if (t > tR) c.chip(960, 90, '☢️ SEM AR = SEM PROTEÇÃO', 'red', tR, tE); if (t > tE) c.tag([0, 4.8, -12], '🛡️ CAMADA DE TERRA LUNAR', 'gold', tE, 1e9); }
  else { M(c, { power: 1 }); c.track('yara', [{ t: 0, p: [0.9, 0, -4.4], ry: 0.3, a: 'write', e2: 'neutral', hold: 'paper' }]); c.track('rai', [{ t: 0, p: [-0.9, 0, -1.6], ry: PI - 0.4, a: 'walk', e2: 'happy', suit: true }, { t: c.dur, p: [-0.6, 0, -3.8], ry: PI - 0.4, a: 'walk', e2: 'happy', suit: true }]);
    c.cam([{ t: tY - 0.2, p: [2.6, 1.8, 0.6], l: [0.4, 1.2, -4.2], f: 46 }, { t: c.dur, p: [2.4, 1.7, 0.1], l: [0.4, 1.2, -4.2], f: 46 }]);
    c.ui(card('⏱️ TEMPO LÁ FORA: 02:00', { y: 90, b: '#2aa198' })); }
};

SHOTS.b17 = (c) => {
  const t = c.t; const tC = c.at('o cabo'), tL = c.at('não tem luz'), tD = c.at('A Duda'); c.sfx('tick', tD, 0.4);
  M(c, {});
  const u = prog(t, 0, c.dur); const P = lerp3([-6, 0, -24], [-9, 0, -30], u);
  c.track('duda', [{ t: 0, p: [P[0] + 0.9, 0, P[2]], ry: PI + 0.3, a: 'walk', e2: 'neutral', suit: true, hold: 'light' }, { t: c.dur, p: [P[0] + 0.9, 0, P[2]], ry: PI + 0.3, a: 'walk', e2: 'neutral', suit: true, hold: 'light' }]);
  c.cam([{ t: 0, p: [-2, 2.4, -19], l: [-7, 0.6, -28], f: 48 }, { t: c.dur, p: [-4, 2.4, -24], l: [-10, 0.6, -33], f: 48 }]);
  if (t > tC) c.tag([-8, 0.4, -27], '⚡ O CABO', 'gold', tC, 1e9);
  cards(c, [['não tem luz', '💡 ✕', 560], ['não tem água', '💡'.slice(0,0) + '💧 ✕', 960], ['e não tem', '🫁 ✕', 1360]], 90, '#ff3b30');
  if (t > tD) c.chip(960, 900, '✅ CONFERIDO TODA SEMANA', 'green', tD, 1e9);
};

// ================= CTA =================
SHOTS.b18 = (c) => {
  const t = c.t; const tI = c.at('inscrever'); c.sfx('pop', 0.3, 0.5); c.sfx('click', tI + 1.1, 0.8); c.sfx('ding', tI + 1.15, 0.6);
  M(c, { power: 1 });
  c.track('duda', [{ t: 0, p: [-0.8, 0, 0], ry: 0.15, a: t < tI ? 'wave' : 'point', e2: 'happy', suit: true }]);
  const jy = Math.max(0, Math.sin(t * 2.2)) * 0.8; c.track('biel', [{ t: 0, p: [0.6, 0, 0.3], ry: -0.1, a: 'cheer', e2: 'happy', y: jy, suit: true }]);
  c.cam([{ t: 0, p: [0, 1.6, 5.2], l: [-0.1, 1.2, 0], f: 44 }, { t: c.dur, p: [0, 1.6, 4.5], l: [-0.1, 1.2, 0], f: 44 }]);
  subBtn(c, tI);
};

// ================= O PORÉM =================
SHOTS.b19 = (c) => {
  const t = c.t; const tP = c.at('tem um porém'), tS = c.at('sismógrafos'), tD = c.at('mais de dez'); c.sfx('dramatic', tP, 0.6); c.sfx('tick', tS, 0.4); c.sfx('boom', tD, 0.5);
  M(c, {});
  c.cam([{ t: 0, p: [20, 6, 18], l: [0, 1, -8], f: 46 }, { t: c.dur, p: [16, 4.5, 13], l: [0, 1, -8], f: 46 }]);
  title(c, 'TEM UM PORÉM', tP);
  if (t > tS) { let pts = ''; for (let i = 0; i <= 120; i++) { const x = i * 10, amp = i > 30 ? 40 * Math.exp(-(i - 30) / 60) : 3; pts += `${x},${60 + Math.sin(i * 1.7 + t * 6) * amp * Math.min(1, (t - tS) * 1.5)} `; }
    c.ui(`<div class="abs" style="left:360px;top:300px;width:1200px;padding:18px 0;border-radius:22px;background:rgba(10,14,28,.88);border:5px solid #ff3b30"><div style="color:#fff;font-weight:900;font-size:36px;text-align:center">📈 SISMÓGRAFO DA APOLLO</div><svg width="1200" height="120"><polyline points="${pts}" fill="none" stroke="#ff3b30" stroke-width="5"/></svg></div>`); }
  if (t > tD) big(c, '+10 MINUTOS', tD, { y: 620, color: '#ff3b30', glow: 'rgba(255,60,48,.6)' });
};

SHOTS.b20 = (c) => {
  const t = c.t; const tC = c.at('canecas'), tS = c.at('segura'); c.sfx('clang', tC + 0.3, 0.3); c.sfx('clang', tC + 0.9, 0.3); c.sfx('crash', tS, 0.6);
  ROOM(c); const qk = t > tC ? (t > tS ? 0.9 : 0.25) : 0; quake(c, qk);
  for (let i = 0; i < 4; i++) c.prop('cup', { p: [-3.0 + i * 0.4 + (qk ? Math.sin(t * 40 + i) * 0.02 : 0), 0.78, 0.9], r: [0, i, qk ? Math.sin(t * 30 + i) * 0.1 : 0], s: 1.2 });
  c.track('rai', [{ t: 0, p: [-2.0, 0.17, 1.75], ry: PI, a: t < tS ? 'sit' : 'shout', e2: t < tC ? 'happy' : (t < tS ? 'worried' : 'scared'), over: t > tS ? { hipY: 0.5 } : undefined }]);
  c.track('biel', [{ t: 0, p: [-3.0, 0.17, 1.75], ry: PI, a: 'sit', e2: t < tC ? 'happy' : 'scared' }]);
  if (t < tC) c.chip(960, 90, '5 ANOS DEPOIS', 'white', 0.3, tC);
  if (t < tS - 0.2) c.cam([{ t: 0, p: [-2.5, 1.5, -1.6], l: [-2.5, 0.95, 1.3], f: 48 }, { t: tS, p: [-2.5, 1.45, -1.2], l: [-2.5, 0.95, 1.3], f: 48 }]);
  else c.cam([{ t: tS - 0.2, p: [-1.7, 1.6, -0.5], l: [-2.0, 1.3, 1.75], f: 46 }, { t: c.dur, p: [-1.75, 1.6, -0.3], l: [-2.0, 1.3, 1.75], f: 46 }]);
  if (t > tS) c.bubble(c.CH.rai, 'SEGURA!', tS, c.dur, [0, 2.2, 0]);
};

// ================= CLÍMAX =================
SHOTS.b21 = (c) => {
  const t = c.t; const tL = c.at('Lá fora'), tC = c.at('corta o cabo'), tA = c.at('apagam'); c.sfx('crash', 0.1, 0.7); c.sfx('boom', tC, 0.8); c.sfx('blackout', tA, 0.7);
  if (t < tL - 0.2) { ROOM(c, { alarm: 1 }); roomPeople(c, 14, { a: 'panic', e: 'scared', seed: 5 }); quake(c, 1);
    c.cam([{ t: 0, p: [3.8, 2.2, 2.6], l: [0.8, 1.0, -1.4], f: 54 }, { t: tL, p: [3.6, 2.1, 2.2], l: [0.8, 1.0, -1.4], f: 54 }]); title(c, 'AGORA, ACONTECEU', 0.2, { bg: '#d62828', size: 80 }); }
  else if (t < tA - 0.3) { M(c, { rock: clamp(prog(t, tL, tC)), cut: t > tC ? 1 : 0 }); quake(c, 0.7);
    c.cam([{ t: tL - 0.2, p: [-6, 4.5, -30], l: [-24, 3, -54], f: 50 }, { t: tA, p: [-8, 3.0, -34], l: [-18, 0.4, -42], f: 46 }]); if (t > tC) c.tag([CUT[0], 1.4, CUT[2]], '⚡ CABO CORTADO', 'red', tC, 1e9); }
  else { M(c, { power: 0, tod: 'dark' }); quake(c, 0.3); c.cam([{ t: tA - 0.3, p: [8, 3, 12], l: [-1, 2, -8], f: 50 }, { t: c.dur, p: [7, 2.8, 10], l: [-1, 2, -8], f: 50 }]);
    title(c, 'AS LUZES APAGAM', tA, { bg: '#111', size: 80 }); }
};

SHOTS.b22 = (c) => {
  const t = c.t; const tB = c.at('As baterias'), tD = c.at('A Duda e'), tJ = c.at('jipe'); c.sfx('alarm', 0.2, 0.3); c.sfx('zip', tD + 0.5, 0.5); c.sfx('engine', tJ, 0.4);
  if (t < tD - 0.2) { ROOM(c, { power: 0.15, alarm: 1, screen: 'red', haze: 0.3 }); roomPeople(c, 12, { a: 'idle', e: 'worried', seed: 8 });
    c.track('duda', [{ t: 0, p: [-4.8, 0, -0.8], ry: -PI / 2 + 0.4, a: 'think', e2: 'worried' }]);
    c.cam([{ t: 0, p: [-1.4, 1.7, 1.6], l: [-5, 1.3, -1], f: 48 }, { t: tD, p: [-1.8, 1.65, 1.1], l: [-5, 1.3, -1], f: 48 }]);
    if (t > tB) { const h = Math.round(lerp(48, 47, prog(t, tB, tD))); c.ui(card(`🔋 BATERIA: <span style="color:#ff3b30">${h} HORAS</span>`, { y: 90, b: '#ff3b30', s: pop(t, tB, 0.25) || 1 })); } }
  else { const k = prog(t, tJ, c.dur); const rv = { x: lerp(1.8, -8, k), z: lerp(-1.5, -4.5, k), ry: -PI / 2 - 0.3, lights: true, spin: t * 3 };
    M(c, { power: 0, tod: 'dark', alarm: 1, rover: rv });
    c.track('duda', [{ t: 0, p: seatOn(rv, 0.5), ry: rv.ry, a: 'drive', e2: 'worried', suit: true }]); c.track('rai', [{ t: 0, p: seatOn(rv, -0.5), ry: rv.ry, a: 'sit', e2: 'worried', suit: true }]);
    c.cam([{ t: tD - 0.2, p: [5, 2.4, 6], l: [0, 1.4, -2], f: 48 }, { t: c.dur, p: [-2, 2.6, 5], l: [-7, 1.4, -4], f: 48 }]); dark(c, 0.6); }
};

SHOTS.b23 = (c) => {
  const t = c.t; const tS = c.at('sombra'), tN = c.at('apagou'), tG = c.at('GPS'), tB = c.at('bússola'); c.sfx('engine', 0, 0.35); c.sfx('error', tN, 0.6); c.sfx('error', tB + 0.3, 0.4);
  const k = prog(t, 0, c.dur); const rv = { x: lerp(-4, -8, k), z: lerp(-18, -27, k), ry: PI + 0.42, lights: true, spin: t * 3 };
  M(c, { power: 0, tod: 'dark', rover: rv });
  c.track('duda', [{ t: 0, p: seatOn(rv, 0.5), ry: rv.ry, a: 'drive', e2: t < tN ? 'worried' : 'scared', suit: true }]); c.track('rai', [{ t: 0, p: seatOn(rv, -0.5), ry: rv.ry, a: 'sit', e2: 'worried', suit: true }]);
  if (t < tN - 0.2) c.cam([{ t: 0, p: [rv.x + 6, 3, rv.z + 6], l: [rv.x, 1.2, rv.z], f: 48 }, { t: tN, p: [rv.x + 5, 2.8, rv.z + 5], l: [rv.x, 1.2, rv.z], f: 48 }]);
  else c.cam([{ t: tN - 0.2, p: [rv.x - 1.6, 2.3, rv.z - 2.6], l: [rv.x + 0.2, 1.5, rv.z], f: 46 }, { t: c.dur, p: [rv.x - 1.6, 2.3, rv.z - 2.6], l: [rv.x + 0.2, 1.5, rv.z], f: 46 }]);
  dark(c, 0.8);
  if (t > tS && t < tN) c.chip(960, 90, '🌑 ESCURO COMO BREU', 'white', tS, tN);
  if (t > tN) c.ui(`<div class="abs" style="left:1380px;top:90px;width:420px;height:260px;border-radius:20px;background:#05070c;border:6px solid #444;display:flex;align-items:center;justify-content:center;flex-direction:column;color:#ff3b30;font-weight:900;font-size:44px">🧭 NAVEGAÇÃO<div style="font-size:60px">${Math.sin(t * 8) > 0 ? 'SEM SINAL' : ''}</div></div>`);
  if (t > tG) c.ui(card('🛰️ GPS ✕', { x: 560, y: 90, size: 46, b: '#ff3b30', s: pop(t, tG, 0.25) || 1 }));
  if (t > tB) c.ui(card('🧭 BÚSSOLA ✕', { x: 980, y: 90, size: 46, b: '#ff3b30', s: pop(t, tB, 0.25) || 1 }));
};

SHOTS.b24 = (c) => {
  const t = c.t; const tI = c.at('ideia'), tT = c.at('nunca sai'), tE = c.at('É só manter'); c.sfx('radio', 0.2, 0.5); c.sfx('ding', tI, 0.6); c.sfx('twinkle', tT, 0.5);
  if (t < tE - 0.2) { ROOM(c, { power: 0.15, alarm: 0.5 });
    c.track('biel', [{ t: 0, p: [0.0, 0, -2.4], ry: t < tI ? 0.6 : PI - 0.2, a: t < tI ? 'phone' : 'pointup', e2: t < tI ? 'worried' : 'happy', hold: 'phone' }]);
    c.cam([{ t: 0, p: [1.6, 1.3, 0.4], l: [0.1, 1.4, -3.2], f: 46 }, { t: tE, p: [1.4, 1.3, 0.1], l: [0.1, 1.4, -3.2], f: 46 }]);
    if (t > tI) c.ui(card('💡 A IDEIA DO BIEL', { y: 90, b: '#ffd21f', s: pop(t, tI, 0.25) || 1 })); if (t > tT) c.chip(960, 900, '🌍 A TERRA NUNCA SAI DO LUGAR', 'blue', tT, 1e9); }
  else { const k = prog(t, tE, c.dur); const rv = { x: lerp(-9, -13, k), z: lerp(-29, -36, k), ry: PI + 0.5, lights: true, spin: t * 3 };
    M(c, { power: 0, tod: 'dark', rover: rv });
    c.track('duda', [{ t: 0, p: seatOn(rv, 0.5), ry: rv.ry, a: 'drive', e2: 'happy', suit: true }]); c.track('rai', [{ t: 0, p: seatOn(rv, -0.5), ry: rv.ry, a: 'point', e2: 'happy', suit: true }]);
    c.cam([{ t: tE - 0.2, p: [rv.x + 4, 2.4, rv.z + 5.5], l: [rv.x - 6, 3.5, rv.z - 3], f: 54 }, { t: c.dur, p: [rv.x + 4, 2.4, rv.z + 5.5], l: [rv.x - 6, 3.5, rv.z - 3], f: 54 }]);
    c.tag([-420, 175, -60], '⬅ A TERRA SEMPRE À ESQUERDA', 'blue', tE, 1e9); dark(c, 0.5); }
};

SHOTS.b25 = (c) => {
  const t = c.t; const tA = c.at('acham o cabo'), tE = c.at('emenda'), t1 = c.at('Primeira'), t2 = c.at('Segunda'); c.sfx('engine', 0, 0.3); c.sfx('ding', tA, 0.4); c.sfx('spark', t1 + 0.6, 0.4); c.sfx('error', t1 + 1.0, 0.5); c.sfx('spark', t2 + 0.4, 0.4); c.sfx('error', t2 + 0.8, 0.5);
  const rv = { x: -15.5, z: -39, ry: PI + 0.6, lights: true };
  M(c, { power: 0, tod: 'dark', rover: rv, cut: 1, rock: 1, spark: (t > t1 + 0.5 && t < t1 + 0.9) || (t > t2 + 0.3 && t < t2 + 0.7) ? 1 : 0 });
  c.track('duda', [{ t: 0, p: [CUT[0] + 0.3, 0, CUT[2] + 0.9], ry: PI + 0.2, a: t > tE ? 'tinker' : 'crouch', e2: t > t2 + 0.8 ? 'scared' : 'worried', suit: true, hold: 'wrench' }]);
  c.track('rai', [{ t: 0, p: [CUT[0] + 1.5, 0, CUT[2] + 1.6], ry: PI + 0.6, a: 'hold', e2: 'worried', suit: true, hold: 'light' }]);
  c.glow([CUT[0] + 0.6, 1.6, CUT[2] + 1.2], 0xfff0c8, 10);
  if (t < tE) c.cam([{ t: 0, p: [CUT[0] - 3.5, 3.2, CUT[2] + 5], l: [CUT[0] + 0.5, 0.6, CUT[2] + 0.5], f: 48 }, { t: tE, p: [CUT[0] - 3, 3.0, CUT[2] + 4.2], l: [CUT[0] + 0.5, 0.6, CUT[2] + 0.5], f: 48 }]);
  else c.cam([{ t: tE, p: [CUT[0] + 0.7, 1.95, CUT[2] - 2.3], l: [CUT[0] + 0.4, 1.0, CUT[2] + 0.8], f: 48 }, { t: c.dur, p: [CUT[0] + 0.7, 1.9, CUT[2] - 2.1], l: [CUT[0] + 0.4, 1.0, CUT[2] + 0.8], f: 48 }]);
  dark(c, 0.4);
  if (t > tA && t < tE) c.tag([CUT[0], 0.8, CUT[2]], '✂️ O CORTE', 'red', tA, tE);
  if (t > t1 + 1.0) c.ui(stamp('1ª ✕', { top: 120, size: 90, a: 1, rot: -6 }).replace('left:0;right:0', 'left:-500px;right:0'));
  if (t > t2 + 0.8) c.ui(stamp('2ª ✕', { top: 120, size: 90, a: 1, rot: 5 }).replace('left:0;right:0', 'left:500px;right:0'));
};

SHOTS.b26 = (c) => {
  const t = c.t; const tF = c.at('uma faísca'), tA = c.at('acendem'), tC = c.at('Cento e vinte'); c.sfx('spark', tF, 0.7); c.sfx('power', tA, 0.7); c.sfx('cheer', tC, 0.7);
  if (t < tA - 0.2) { M(c, { power: 0, tod: 'dark', rover: { x: -15.5, z: -39, ry: PI + 0.6, lights: true }, cut: 1, rock: 1, spark: t > tF ? 1 : 0 });
    c.track('duda', [{ t: 0, p: [CUT[0] + 0.3, 0, CUT[2] + 0.9], ry: PI + 0.2, a: 'tinker', e2: t > tF ? 'surprised' : 'worried', suit: true, hold: 'wrench' }]);
    c.cam([{ t: 0, p: [CUT[0] + 0.7, 1.95, CUT[2] - 2.3], l: [CUT[0] + 0.4, 1.0, CUT[2] + 0.8], f: 48 }, { t: tA, p: [CUT[0] + 0.7, 1.9, CUT[2] - 2.0], l: [CUT[0] + 0.4, 1.0, CUT[2] + 0.8], f: 46 }]);
    c.ui(stamp('3ª…', { top: 120, size: 90, a: 1, rot: -3 })); dark(c, 0.4); }
  else if (t < tC - 0.2) { M(c, { power: 1 }); c.flash('#ffffff', 1 - prog(t, tA - 0.2, tA + 0.4)); c.cam([{ t: tA - 0.2, p: [9, 3.2, 13], l: [-1, 2.4, -7], f: 50 }, { t: tC, p: [8, 3.0, 11], l: [-1, 2.4, -7], f: 50 }]); title(c, 'A LUZ VOLTOU!', tA, { bg: '#2fa35a' }); }
  else { ROOM(c); roomPeople(c, 16, { a: 'cheer', e: 'happy', seed: 7, jump: true, kids: true });
    c.track('biel', [{ t: 0, p: [-0.9, Math.abs(Math.sin(t * 2.4)) * 1.0, 1.0], ry: 0.2, a: 'cheer', e2: 'happy' }]);
    c.cam([{ t: tC - 0.2, p: [-0.6, 1.8, 3.2], l: [0.8, 1.2, -1.4], f: 58 }, { t: c.dur, p: [-0.4, 1.8, 3.0], l: [0.8, 1.2, -1.4], f: 58 }]); }
};

SHOTS.b27 = (c) => {
  const t = c.t; const tD = c.at('dois cabos'), tT = c.at('túnel de lava'), tM = c.at('Mar da Tranquilidade'); c.sfx('ding', tD, 0.5); c.sfx('whoosh', tT - 0.4, 0.5); c.sfx('pop', tM, 0.4);
  if (t < tT - 0.4) { M(c, { power: 1, cable2: true }); c.cam([{ t: 0, p: [10, 12, 6], l: [-6, 0, -36], f: 48 }, { t: tT, p: [8, 13, 2], l: [-6, 0, -36], f: 48 }]);
    if (t > tD) { c.tag([-9, 1, -30], 'CABO 1', 'gold', tD, 1e9); c.tag([6, 1, -30], 'CABO 2', 'blue', tD + 0.4, 1e9); title(c, '2 CABOS', tD, { bg: '#2fa35a' }); } }
  else { M(c, { power: 1, cable2: true, tube: true }); c.cam([{ t: tT - 0.4, p: [48, 9, -20], l: [36, 0, -36], f: 46 }, { t: c.dur, p: [45, 7.5, -24], l: [36, 0, -36], f: 46 }]);
    c.tag([36, 2, -36], '🌋 TÚNEL DE LAVA', 'gold', tT, 1e9); if (t > tM) c.chip(960, 90, '2024 · CONFIRMADO NO MAR DA TRANQUILIDADE', 'white', tM, 1e9); }
};

// ================= FINAL =================
SHOTS.b28 = (c) => {
  const t = c.t; const tB = c.at('A base vira'), tR = c.at('o rádio'), tL = c.at('limpou'); c.sfx('pad', 0, 0.4); c.sfx('radio', tR, 0.5); c.sfx('tada', tL, 0.6);
  if (t < tR - 0.2) { M(c, { power: 1, more: true, forest: true, cable2: true }); c.cam([{ t: 0, p: [30, 16, 30], l: [0, 0, -8], f: 46 }, { t: tR, p: [24, 12, 24], l: [0, 0, -8], f: 46 }]);
    c.chip(960, 90, 'OS ANOS PASSAM', 'white', 0.3, tB); if (t > tB) c.tag([11, 5.2, -9], '🌳 A ESTUFA VIROU BOSQUE', 'green', tB + 1.5, 1e9); }
  else { ROOM(c, { sun: 0.3 }); roomPeople(c, 14, { a: (i) => (i % 3 ? 'idle' : 'cheer'), e: 'happy', seed: 11, ry: PI });
    c.track('yara', [{ t: 0, p: [-4.4, 0, -0.8], ry: PI / 2 - 0.5, a: t > tL ? 'cheer' : 'phone', e2: t > tL ? 'happy' : 'surprised', hold: t > tL ? null : 'phone' }]);
    c.cam([{ t: tR - 0.2, p: [-1.0, 1.7, 2.2], l: [-4.2, 1.2, -0.8], f: 48 }, { t: c.dur, p: [-1.3, 1.7, 1.8], l: [-4.2, 1.2, -0.8], f: 48 }]);
    if (t > tL) c.ui(card('📻 “O CÉU DA TERRA LIMPOU!”', { y: 90, b: '#2fa35a', size: 60, s: pop(t, tL, 0.25) || 1 })); }
};

SHOTS.b29 = (c) => {
  const t = c.t; const tF = c.at('fica'), tB = c.at('o Biel'), tA = c.at('acena'); c.sfx('engine', 0, 0.5); c.sfx('pop', tF, 0.5); c.sfx('twinkle', tA, 0.5);
  if (t < tF - 0.2) { const k = prog(t, 0.3, tF); M(c, { power: 1, more: true, forest: true, cable2: true, lander: { y: ease.i(k) * 26 }, flame: 1 }); c.puffs([-16, 0.3, 4], k < 0.3 ? 1 : 0, { speed: 1.2 });
    c.cam([{ t: 0, p: [4, 3, 26], l: [-16, 6, 4], f: 50 }, { t: tF, p: [4, 3, 26], l: [-16, 16, 4], f: 50 }]); c.chip(960, 90, '🚀 MUITA GENTE VOLTA', 'white', 0.3, tF); }
  else if (t < tB - 0.2) { M(c, { power: 1, more: true, forest: true, cable2: true, landerOff: true });
    c.cam([{ t: tF - 0.2, p: [8, 4, 16], l: [0, 2, -6], f: 50 }, { t: tB, p: [7, 3.6, 14], l: [0, 2, -6], f: 50 }]); title(c, 'MAS MUITA GENTE FICA', tF, { bg: '#2a4ab0', size: 80 }); }
  else { M(c, { power: 1, more: true, forest: true, cable2: true, landerOff: true });
    c.track('bielA', [{ t: 0, p: [-10.2, 0, -31], ry: t > tA ? -PI / 2 - 0.2 : 0.6, a: t > tA ? 'wave' : 'tinker', e2: 'happy', suit: true, hold: t > tA ? null : 'wrench' }]);
    c.cam([{ t: tB - 0.2, p: [-6.2, 1.9, -27.5], l: [-11, 2.0, -32], f: 48 }, { t: c.dur, p: [-6.0, 2.0, -27], l: [-14, 4.5, -33], f: 48 }]);
    c.ui(`<div class="abs" style="left:120px;top:760px;padding:16px 40px;border-radius:24px;background:rgba(10,14,28,.88);border:5px solid #5aa8ff;color:#fff;font-weight:900;font-size:60px">BIEL · ADULTO<div style="font-size:36px;color:#5aa8ff">CUIDA DOS CABOS</div></div>`); }
};

SHOTS.b30 = (c) => {
  const t = c.t; const tR = c.at('Recomeçou porque'), tN = c.at('nunca perder'); c.sfx('pad', 0, 0.5);
  M(c, { power: 1, more: true, forest: true, cable2: true, landerOff: true });
  c.cam([{ t: 0, p: [16, 3.2, 9], l: [-60, 14, -25], f: 50 }, { t: c.dur, p: [15, 3.0, 7.5], l: [-60, 14, -25], f: 46 }]);
  if (t > tR) c.chip(960, 120, 'APRENDERAM A', 'white', tR, 1e9); if (t > tN) big(c, '🌍 NUNCA PERDER A TERRA DE VISTA', tN, { y: 250, size: 84, color: '#7ab8ff', glow: 'rgba(120,180,255,.6)' });
  c.state.fade = prog(t, c.dur - 0.5, c.dur);
};

SHOTS.b31 = (c) => {
  const t = c.t; const tQ = c.at('Aguentaria'), tM = c.at('num navio'), tS = c.at('Se inscreve'), tB = c.at('Até lá'); c.sfx('whoosh', tM, 0.5); c.sfx('click', tS + 1.1, 0.8); c.sfx('ding', tS + 1.15, 0.6); c.sfx('tada', tB, 0.6);
  c.env('outro');
  const w = t > tB;
  [['duda', -3.0, 0.3], ['yara', -1.0, 0.1], ['rai', 1.0, -0.1], ['biel', 3.0, -0.3]].forEach(([n, x, ry]) => c.track(n, [{ t: 0, p: [x, 0, 5.1], ry, a: w ? 'wave' : 'idle', e2: 'happy' }]));
  c.cam([{ t: 0, p: [0, 1.9, 12.4], l: [0, 2.0, 5], f: 42 }, { t: c.dur, p: [0, 2.0, 11.4], l: [0, 2.0, 5], f: 42 }]);
  if (t > tQ && t < tM - 1.5) { const a = clamp((t - tQ) / 0.4); c.ui(`<div class="abs" style="left:0;top:130px;width:1920px;text-align:center;font-weight:900;font-size:60px;color:#fff;opacity:${a};text-shadow:0 5px 0 #000">VIVER NA LUA, OLHANDO A TERRA PELA JANELA?</div>`);
    ['AGUENTO 🚀', 'NEM PENSAR 😰'].forEach((l, i) => { const s = pop(t, tQ + 0.5 + i * 0.3, 0.25); c.ui(`<div class="abs" style="left:${500 + i * 480}px;top:240px;width:440px;padding:20px 0;text-align:center;border-radius:24px;background:${['#5aa8ff', '#ff6b4a'][i]};color:#111;font-weight:900;font-size:50px;white-space:nowrap;transform:scale(${s})">${l}</div>`); }); }
  if (t > tM - 1.4 && t < tS - 0.1) { c.ui(`<div class="abs" style="left:0;top:120px;width:1920px;text-align:center;font-weight:900;font-size:60px;color:#fff;text-shadow:0 5px 0 #000">PRÓXIMO EPISÓDIO</div>`); c.ui(bigNum('NUM NAVIO QUE NUNCA PARA? 🚢', 960, 270, { size: 96, color: '#ffd21f', glow: 'rgba(255,210,31,.6)', s: pop(t, tM - 1.4, 0.3) || 1 })); }
  if (t > tS - 0.1) subBtn(c, tS);
};
