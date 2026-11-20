// LONGO: "E se a humanidade tivesse que recomeçar numa nave que viaja por cem anos?" — palito, 1920x1080.
import { clamp, lerp, ease, PI, prog, center, stamp, bigNum, pop, seeded, subBtn } from '/engine/kit.js';
export const SHOTS = {};
const P0 = { num: null, flag: false };
export const CAST = {
  maya: { style: 'palito', ...P0, shirt: 0x2a6ad6, trim: 0xffd21f, shorts: 0x1d2a44, hair: 'lia', scale: 0.96 },
  mayav: { style: 'palito', ...P0, shirt: 0x2a6ad6, trim: 0xd8d8d8, shorts: 0x1d2a44, hair: 'lia', scale: 0.92 },
  caio: { style: 'palito', ...P0, shirt: 0x2fa35a, trim: 0x1a5a2a, shorts: 0x5a4a2a, cap: 0x2fa35a },
  caiov: { style: 'palito', ...P0, shirt: 0x2fa35a, trim: 0x1a5a2a, shorts: 0x5a4a2a, hair: 'old' },
  iris: { style: 'palito', ...P0, shirt: 0xf4f4f4, trim: 0xe91e8c, shorts: 0xe91e8c, hair: 'lia', scale: 0.96 },
  juca: { style: 'palito', ...P0, shirt: 0xff7a1a, trim: 0xffffff, shorts: 0x222a44, cap: 0x111111, capYaw: PI },
  estrela: { style: 'palito', ...P0, shirt: 0xffd21f, trim: 0x8a3ad6, shorts: 0x8a3ad6, hair: 'lia', scale: 0.62 },
  bis: { style: 'palito', ...P0, shirt: 0x0aa6b8, trim: 0xffd21f, shorts: 0x1d2a44, hair: 'lia', scale: 0.9 },
};
const COLS = [0x2a6ad6, 0xff7a1a, 0x2fa35a, 0xf4f4f4, 0xd6a31c, 0x8a3ad6, 0x0aa6b8, 0xe02020];
const title = (c, txt, t0, o = {}) => { if (c.t < t0) return; const s = pop(c.t, t0, 0.3) || 1; c.ui(`<div class="abs" style="left:0;right:0;top:${o.top ?? 70}px;text-align:center;transform:scale(${s})"><div style="display:inline-block;background:${o.bg ?? '#d62828'};border:7px solid #fff;border-radius:22px;padding:6px 60px;font-weight:900;font-size:${o.size ?? 96}px;color:${o.color ?? '#fff'};transform:rotate(-2deg);box-shadow:0 14px 0 rgba(0,0,0,.45)">${txt}</div></div>`); };
const card = (html, o = {}) => `<div class="abs" style="left:${o.x ?? 960}px;top:${o.y ?? 150}px;transform:translate(-50%,0) scale(${o.s ?? 1});opacity:${o.a ?? 1};background:rgba(8,12,28,.86);border:5px solid ${o.b ?? '#38d6ff'};border-radius:26px;padding:22px 44px;color:#fff;font-weight:900;font-size:${o.size ?? 50}px;text-align:center;white-space:nowrap">${html}</div>`;
const big = (c, txt, t0, o = {}) => { if (c.t < t0) return; c.ui(bigNum(txt, o.x ?? 960, o.y ?? 250, { size: o.size ?? 130, color: o.color ?? '#ffd21f', glow: o.glow ?? 'rgba(255,210,31,.6)', s: pop(c.t, t0, 0.3) || 1 })); };
// cronômetro da porta (segundos restantes)
const timer = (c, secs, o = {}) => { const s = Math.max(0, Math.ceil(secs)); const col = s > 60 ? '#ffd21f' : '#ff3b30'; c.ui(`<div class="abs" style="left:${o.x ?? 1500}px;top:${o.y ?? 60}px;width:340px;padding:14px 20px;border-radius:20px;background:rgba(10,10,14,.85);border:4px solid ${col};text-align:center"><div style="font-weight:900;font-size:28px;color:#fff;letter-spacing:3px">🚪 PORTA FECHA EM</div><div style="font-weight:900;font-size:72px;color:${col}">${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}</div></div>`); };
// figurantes na sala da nave (seahab {space}): grade x -0.6..3.2, z -2.6..0
const roomPeople = (c, n, o = {}) => { const R = seeded(o.seed || 3); let k = 0; for (let i = 0; i < n; i++) { const x = -0.6 + (i % 6) * 0.75 + (R() - 0.5) * 0.2, z = -2.6 + Math.floor(i / 6) * 0.85; if (z > 0.2) break; c.mini(k++, { p: [x, 0, z], ry: o.ry ?? 0, a: typeof o.a === 'function' ? o.a(i) : (o.a || 'idle'), e: o.e || 'neutral', s: (o.s ?? 0.92) * (o.kids && i % 3 === 0 ? 0.65 : 1) }); } };
const SEAT = (x, r) => [x, 0.22, 6 - 1.4 * r];
function cabinCrowd(c, skip = []) { let k = 0; for (let r = 0; r < 9; r++) for (const x of [-2.0, -1.15, 1.15, 2.0]) { if (skip.some(([sx, sr]) => sx === x && sr === r)) continue; if (k >= 30) return; c.mini(k++, { p: SEAT(x, r), ry: PI, a: 'sit', e: (r + k) % 3 ? 'neutral' : 'happy', s: 0.95 }); } }
const SPACE = (c, p = {}) => c.env('starship', p);
const ROOM = (c, p = {}) => c.env('seahab', { space: true, ...p });
const FARM = (c, p = {}) => c.env('shipfarm', p);
const HOLE = [-4.45, 1.7, -6];
// a nave inteira, vista de longe (órbita lenta)
const orbit = (c, a0, a1, r, y, o = {}) => { const a = lerp(a0, a1, c.t / c.dur); c.camSet([Math.sin(a) * r, y, (o.cz ?? 10) + Math.cos(a) * r], o.l ?? [0, 0, 10], o.f ?? 50); };

// ================= GANCHO =================
SHOTS.b01 = (c) => {
  const t = c.t; const tS = c.at('sessenta'), tU = c.at('única casa'); c.sfx('riser', 0.2, 0.5); c.sfx('pop', tS, 0.6); c.sfx('boom', tU, 0.8);
  if (t < tU) {
    SPACE(c, { earth: 0, planet: 0 });
    c.cam([{ t: 0, p: [160, 70, -170], l: [0, 0, 15], f: 46 }, { t: tU, p: [95, 35, -100], l: [0, 0, 15], f: 46 }]);
    c.chip(960, 90, 'SAIU DA TERRA HÁ 40 ANOS', 'blue', 0.6, tU); c.chip(960, 180, 'FALTAM 60', 'red', tS, tU);
  } else {
    ROOM(c); roomPeople(c, 18, { ry: 0.05, a: (i) => (i % 4 ? 'idle' : 'talk'), e: 'neutral', kids: true });
    c.cam([{ t: tU, p: [0.6, 1.9, 3.3], l: [1.0, 1.3, -1.5], f: 56 }, { t: c.dur, p: [0.8, 2.0, 2.9], l: [1.0, 1.3, -1.5], f: 54 }]);
    title(c, 'A ÚNICA CASA DE 100 PESSOAS', tU + 0.1, { size: 80, bg: '#2a6ad6' });
  }
};

SHOTS.b02 = (c) => {
  const t = c.t; const tA = c.at('Um alarme'), tP = c.at('atravessou'), tE = c.at('ar começa'); c.sfx('alarm', tA, 0.5); c.sfx('crash', tP, 0.7); c.sfx('wind', tE, 0.7);
  if (t < tE) {
    const hit = t > tP ? clamp(1 - (t - tP) / 0.7) : 0; SPACE(c, { spin: 0, alarm: t > tA ? 1 : 0, hit });
    c.cam([{ t: 0, p: [110, 95, 150], l: [0, 22, 20], f: 44 }, { t: tE, p: [85, 78, 120], l: [0, 26, 22], f: 42 }]);
    if (t > tP) { const k = clamp((t - tP + 0.25) / 0.25); c.ui(`<div class="abs" style="left:0;top:0;right:0;bottom:0;background:rgba(255,255,255,${0.6 * (1 - clamp((t - tP) / 0.4))})"></div>`); }
    c.chip(960, 90, 'MENOR QUE UM GRÃO DE ARROZ', 'gold', tP, tE);
  } else {
    FARM(c, { alarm: 1, hole: true, leak: 1 });
    c.track('mayav', [{ t: 0, p: [-1.2, 0, -3.5], ry: -2.23, a: 'panic', e2: 'scared' }]);
    c.cam([{ t: tE, p: [0.2, 1.7, -10], l: [-2.2, 1.3, -4.5], f: 50 }, { t: c.dur, p: [0.0, 1.7, -9.2], l: [-2.2, 1.3, -4.5], f: 46 }]);
    title(c, 'O AR ESTÁ ESCAPANDO', tE + 0.1, { size: 84 });
  }
};

SHOTS.b03 = (c) => {
  const t = c.t; const tS = c.at('Sem a plantação'), tM = c.at('A Maya tem'), tV = c.at('voltar quarenta'); c.sfx('heartbeat', 0, 0.6); c.sfx('whoosh', tV, 0.7);
  FARM(c, { alarm: 1, hole: true, leak: 1, door: lerp(0, 0.12, t / c.dur), frost: 0.3 });
  c.track('mayav', [{ t: 0, p: [0.3, 0, -3.2], ry: PI + 0.9, a: t < tM ? 'think' : 'lookaround', e2: 'worried' }]);
  if (t < tM) c.cam([{ t: 0, p: [1.3, 1.5, 4], l: [-0.6, 1.2, -6], f: 50 }, { t: tM, p: [1.2, 1.5, 2.5], l: [-0.6, 1.2, -6], f: 48 }]);
  else c.frame('mayav', { yaw: 0.3, d: 2.4, h: 1.5, f: 42, t0: tM, to: { d: 2.0 } });
  if (t > tS && t < tM) c.chip(960, 90, 'SEM COMIDA · SEM OXIGÊNIO', 'red', tS, tM);
  if (t > tM) timer(c, 120 - (t - tM));
  if (t > tV) { c.state.fade = prog(t, c.dur - 0.6, c.dur); c.ui(center('40 ANOS ANTES', { top: 420, size: 120, color: '#ffd21f' })); }
};

// ================= COMEÇO =================
SHOTS.b04 = (c) => {
  const t = c.t; const tM = c.at('a Maya'), tN = c.at('nave Travessia'), tD = c.at('O destino'); c.sfx('engine', 0, 0.4); c.sfx('pop', tM + 0.3, 0.5); c.sfx('riser', tD - 0.5, 0.5);
  c.state.fade = 1 - prog(t, 0, 0.5);
  if (t < tD) {
    c.env('plane', { space: true, shake: 0.2 });
    c.track('maya', [{ t: 0, p: SEAT(-1.15, 2), ry: PI, a: 'sit', e2: t < tN ? 'neutral' : 'happy' }]); cabinCrowd(c, [[-1.15, 2]]);
    if (t < tN) c.cam([{ t: 0, p: [0.05, 1.75, 1.9], l: [-1.15, 1.3, 3.2], f: 50 }, { t: tN, p: [0.05, 1.75, 2.1], l: [-1.15, 1.3, 3.2], f: 46 }]);
    else c.cam([{ t: tN, p: [0.2, 2.6, -8], l: [0, 1.0, 6], f: 54 }, { t: tD, p: [0.1, 2.4, -6], l: [0, 1.0, 6], f: 54 }]);
    if (t > tM && t < tN) c.chip(960, 110, 'MAYA · 28 ANOS · ENGENHEIRA', 'gold', tM, tN);
    if (t > tN) c.chip(960, 110, 'NAVE TRAVESSIA · 100 PESSOAS', 'blue', tN, tD);
  } else {
    SPACE(c, { earth: 1, engine: 1, sunA: 2.2 });
    c.cam([{ t: tD, p: [-90, 40, -200], l: [0, 0, 0], f: 50 }, { t: c.dur, p: [-70, 30, -170], l: [0, 0, 0], f: 50 }]);
    c.ui(card('🪐 DESTINO: UM PLANETA EM OUTRA ESTRELA', { y: 80, s: pop(t, tD, 0.3) || 1, size: 46 }));
  }
};

SHOTS.b05 = (c) => {
  const t = c.t; const ts = [c.at('um botânico'), c.at('Uma médica'), c.at('E o Juca'), c.at('faz piada')]; ts.slice(0, 3).forEach(q => c.sfx('pop', q + 0.3, 0.6)); c.sfx('laugh', ts[3] + 0.6, 0.5);
  c.env('plane', { space: true, shake: 0.2 });
  const who = [['caio', 1.15, 3, 'CAIO · BOTÂNICO', 'green'], ['iris', -1.15, 4, 'DRA. ÍRIS · MÉDICA', 'blue'], ['juca', 1.15, 5, 'JUCA · 24 · PILOTO', 'gold']];
  who.forEach(([n, x, r]) => c.track(n, [{ t: 0, p: SEAT(x, r), ry: PI, a: n === 'juca' && t > ts[3] ? 'talk' : 'sit', e2: n === 'juca' ? 'happy' : 'neutral', over: n === 'juca' && t > ts[3] ? { hipY: 0.42 } : undefined }]));
  c.track('maya', [{ t: 0, p: SEAT(-1.15, 2), ry: PI, a: 'sit', e2: t > ts[3] ? 'happy' : 'neutral' }]);
  cabinCrowd(c, [[1.15, 3], [-1.15, 4], [1.15, 5], [-1.15, 2], [1.15, 4], [-1.15, 5], [1.15, 6]]);
  const k = t < ts[1] ? 0 : t < ts[2] ? 1 : 2; const [n, x, r, lab, cls] = who[k]; const P = SEAT(x, r);
  c.cam([{ t: 0, p: [0.05, 1.8, P[2] - 1.9], l: [x, 1.25, P[2]], f: 44 }]);
  const t0 = ts[k]; c.chip(960, 110, lab, cls, t0, k < 2 ? ts[k + 1] : 1e9);
  if (t > ts[3]) c.bubble(c.CH.juca, '3… 2… 1… CADÊ MEU LANCHE?', ts[3], c.dur, [0, 2.1, 0]);
};

SHOTS.b06 = (c) => {
  const t = c.t; const tR = c.at('Regra'), tC = c.at('cem anos'), tB = c.at('os bisnetos'); c.sfx('boom', tR + 0.2, 0.7); c.sfx('pop', tC, 0.6); c.sfx('pad', tB, 0.5);
  SPACE(c, { earth: lerp(0.9, 0.7, t / c.dur), engine: 1, sunA: 2.2 });
  c.cam([{ t: 0, p: [110, 45, 170], l: [0, 0, 10], f: 44 }, { t: c.dur, p: [85, 35, 140], l: [0, 0, 10], f: 44 }]);
  if (t > tR) c.ui(stamp('NÃO EXISTE VOLTA', { top: 70, s: pop(t, tR, 0.3) || 1 }));
  if (t > tC) c.chip(960, 330, 'VIAGEM DE 100 ANOS', 'gold', tC, 1e9);
  if (t > tB) c.chip(960, 420, 'QUEM CHEGA SÃO OS BISNETOS', 'blue', tB, 1e9);
};

SHOTS.b07 = (c) => {
  const t = c.t; const tE = c.at('A estrela mais'), tV = c.at('sonda Voyager'), tS = c.at('setenta e três'), tF = c.at('nave imaginária'); [tE, tV].forEach(q => c.sfx('pop', q, 0.6)); c.sfx('boom', tS, 0.7); c.sfx('ding', tF, 0.5);
  SPACE(c, { earth: 0, sunA: -1.2 + t * 0.02, engine: 1 });
  if (t < tS) c.cam([{ t: 0, p: [70, 30, 170], l: [0, 0, -120], f: 46 }, { t: tS, p: [60, 25, 150], l: [0, 0, -120], f: 46 }]);
  else c.cam([{ t: tS, p: [160, 60, 60], l: [0, 0, 0], f: 48 }, { t: c.dur, p: [140, 50, 30], l: [0, 0, 0], f: 48 }]);
  if (t > tE && t < tS) c.ui(card(`⭐ ESTRELA MAIS PRÓXIMA: ~4,2 ANOS-LUZ`, { y: 80, s: pop(t, tE, 0.3) || 1 }));
  if (t > tV && t < tF) big(c, t > tS ? '73.000 ANOS' : '🛰️ VOYAGER…', t > tS ? tS : tV, { y: 330, size: t > tS ? 150 : 90, color: t > tS ? '#ff5a4e' : '#fff', glow: 'rgba(255,90,78,.5)' });
  if (t > tF) c.ui(card('A TRAVESSIA É FICÇÃO: 100 ANOS', { y: 90, b: '#ffd21f', s: pop(t, tF, 0.3) || 1 }));
};

SHOTS.b08 = (c) => {
  const t = c.t; const tT = c.at('A Terra vai'), tE = c.at('só sobra'); c.sfx('whoosh', tT, 0.5); c.sfx('pad', tE, 0.6);
  if (t < tT) {
    ROOM(c, { glowy: 0 }); roomPeople(c, 14, { ry: PI, a: (i) => (i % 3 ? 'idle' : 'point'), e: 'happy', seed: 4 });
    c.track('maya', [{ t: 0, p: [-0.8, 0, -1.6], ry: PI - 0.2, a: 'point', e2: 'happy' }]);
    c.cam([{ t: 0, p: [-1.2, 1.7, 2.6], l: [0.2, 1.5, -3.4], f: 52 }, { t: tT, p: [-1.0, 1.75, 2.0], l: [0.2, 1.5, -3.4], f: 50 }]);
  } else {
    const k = prog(t, tT, tE); SPACE(c, { earth: lerp(1, 0.02, ease.io(k)), sunA: -1.0, engine: 1 });
    c.cam([{ t: tT, p: [25, 18, 130], l: [-60, -40, 720], f: 44 }]);
    if (t > tE) c.state.fade = 0.45 * prog(t, tE, c.dur);
    if (t > tE - 0.6 && t < tE + 1.2) c.tag([-60, -40, 720], 'TERRA', 'blue', tE - 0.6, tE + 1.2);
  }
};

// ================= VANTAGENS =================
SHOTS.b09 = (c) => {
  const t = c.t; const tA = c.at('A nave tem'), tG = c.at('esse giro'); c.sfx('whoosh', tA, 0.5); c.sfx('ding', tG + 1, 0.5);
  if (t < tG) {
    if (t < tA) { ROOM(c); c.track('maya', [{ t: 0, p: [-1, 0, 1], ry: 0.3, a: 'cheer', e2: 'happy' }]); c.frame('maya', { yaw: 0.2, d: 3, h: 1.4, f: 46 }); }
    else { SPACE(c, { spin: 0.25, sunA: 1.0 }); c.cam([{ t: tA, p: [90, 50, -120], l: [0, 0, 5], f: 46 }, { t: tG, p: [75, 42, -100], l: [0, 0, 5], f: 46 }]); c.chip(960, 90, 'O ANEL GIRA SEM PARAR', 'blue', tA, tG); }
  } else {
    ROOM(c); c.track('maya', [{ t: 0, p: [-3, 0, 0.6], ry: PI / 2, a: 'walk', e2: 'happy' }, { t: c.dur, p: [2, 0, 0.6], ry: PI / 2, a: 'walk', e2: 'happy' }]);
    c.track('juca', [{ t: 0, p: [2.5, 0, -1.4], ry: -0.6, a: 'idle', e2: 'happy', hold: 'cup' }]);
    c.cam([{ t: tG, p: [-0.5, 1.6, 3.3], l: [0, 1.0, 0], f: 52 }, { t: c.dur, p: [0.3, 1.6, 3.3], l: [0.5, 1.0, 0], f: 52 }]);
    c.chip(960, 90, 'GIRO = "GRAVIDADE"', 'gold', tG + 0.3, 1e9);
  }
};

SHOTS.b10 = (c) => {
  const t = c.t; const tN = c.at('Segundo a'), tP = c.at('por mês'), tS = c.at('Sem o giro'); c.sfx('pop', tN, 0.5); c.sfx('boom', tP, 0.6); c.sfx('crash', tS + 1, 0.3);
  c.env('hospital', { day: true, power: 1 });
  c.track('iris', [{ t: 0, p: [-0.7, 0, -2], ry: 0.9, a: t < tN ? 'talk' : 'point', e2: 'neutral', hold: 'paper' }]);
  c.track('maya', [{ t: 0, p: [0.6, 0, -1.6], ry: -2.2, a: t > tS ? 'shrug' : 'idle', e2: t > tP ? 'surprised' : 'neutral' }]);
  c.cam([{ t: 0, p: [0.9, 1.6, 1.4], l: [-0.2, 1.3, -1.8], f: 48 }, { t: c.dur, p: [0.7, 1.6, 0.9], l: [-0.2, 1.3, -1.8], f: 46 }]);
  if (t > tN) c.ui(card(`🦴 SEM GRAVIDADE: −1% A −1,5% DOS OSSOS${t > tP ? ' <span style="color:#ff5a4e">POR MÊS</span>' : ''}`, { y: 50, s: pop(t, tN, 0.3) || 1, b: '#ff5a4e', size: 44 }));
};

SHOTS.b11 = (c) => {
  const t = c.t; const tE = c.at('Na Estação'), tN = c.at('noventa e oito'), tT = c.at('Na Travessia'); c.sfx('water', 0, 0.4); c.sfx('pop', tN, 0.6); c.sfx('ding', tT + 1.4, 0.5);
  ROOM(c);
  c.track('maya', [{ t: 0, p: [-2.6, 0, -0.6], ry: -0.3, a: 'idle', e2: 'neutral', hold: 'cup' }, { t: tT, p: [-2.6, 0, -0.6], ry: -0.3, a: 'cheer', e2: 'happy', hold: 'cup' }]);
  c.track('juca', [{ t: 0, p: [-1.4, 0, -0.5], ry: -1.0, a: t > tT + 1 ? 'shrug' : 'idle', e2: t > tN ? 'deadpan' : 'neutral', hold: 'cup' }]);
  c.cam([{ t: 0, p: [-1.0, 1.6, 2.6], l: [-2.2, 1.3, -0.6], f: 46 }, { t: c.dur, p: [-1.3, 1.6, 2.1], l: [-2.2, 1.3, -0.6], f: 44 }]);
  if (t > tE) c.ui(card('💧 ESTAÇÃO ESPACIAL: 98% DA ÁGUA RECUPERADA', { y: 70, s: pop(t, tE, 0.3) || 1, size: 44 }));
  if (t > tN) c.chip(960, 230, 'ATÉ SUOR E XIXI 😅', 'gold', tN + 0.6, 1e9);
};

SHOTS.b12 = (c) => {
  const t = c.t; const tC = c.at('o Caio'), tA = c.at('Ali cresce'), tO = c.at('oxigênio'); c.sfx('twinkle', tC, 0.4); c.sfx('pop', tA, 0.5); c.sfx('ding', tO, 0.6);
  FARM(c, {});
  c.track('caio', [{ t: 0, p: [0.4, 0, -3], ry: 0, a: 'walk', e2: 'happy', hold: 'can' }, { t: tA - 0.2, p: [1.0, 0, 1.2], ry: 0, a: 'walk', e2: 'happy', hold: 'can' }, { t: tA, p: [1.0, 0, 1.2], ry: PI - 0.4, a: 'hold', e2: 'happy', hold: 'can' }]);
  if (t < tA) c.cam([{ t: 0, p: [0, 2.2, 9], l: [0, 1.4, -6], f: 52 }, { t: tA, p: [0, 2.0, 7], l: [0, 1.4, -6], f: 52 }]);
  else c.cam([{ t: tA, p: [-0.4, 1.7, -2.2], l: [1.5, 1.1, 1.4], f: 46 }, { t: c.dur, p: [-0.3, 1.7, -1.6], l: [1.5, 1.1, 1.4], f: 44 }]);
  if (t < tA) c.chip(960, 90, 'O ANEL DAS PLANTAÇÕES', 'green', 0.6, tA);
  if (t > tA) { c.chip(760, 110, 'CO₂', 'red', tA + 0.3, 1e9); c.chip(960, 110, '➜', 'white', tA + 0.6, 1e9); c.chip(1160, 110, 'O₂', 'green', tO, 1e9); }
};

SHOTS.b13 = (c) => {
  const t = c.t; const tF = c.at('campeonato'), tN = c.at('nasce'), tE = c.at('Estrela'); c.sfx('cheer', tF, 0.5); c.sfx('aww', tE, 0.5); c.sfx('twinkle', tE, 0.5);
  if (t < tN) {
    ROOM(c, { sun: 0.3 }); roomPeople(c, 10, { ry: 0, a: 'cheer', e: 'happy', seed: 7 });
    const bx = 1.0 + Math.sin(t * 2.2) * 1.3; c.prop('ball', { p: [bx, 0.25 + Math.abs(Math.sin(t * 5)) * 0.4, 0.6], s: 2 });
    c.track('juca', [{ t: 0, p: [bx - 0.5, 0, 0.4], ry: PI / 2, a: 'run', e2: 'happy' }]);
    c.cam([{ t: 0, p: [0.6, 1.9, 3.3], l: [0.6, 1.0, -0.5], f: 62 }]);
    c.chip(960, 90, 'COPA DO ANEL 🏆', 'gold', tF, tN);
  } else {
    c.env('hospital', { day: true, power: 1 });
    c.track('iris', [{ t: 0, p: [0, 0, -2], ry: 0.2, a: 'idle', e2: 'happy', hold: 'baby' }]);
    c.track('caio', [{ t: 0, p: [-0.9, 0, -2.3], ry: 0.6, a: 'clap', e2: 'happy' }]);
    c.frame('iris', { yaw: 0.2, d: 4.0, h: 1.65, f: 44, t0: tN, to: { d: 3.5 } });
    if (t > tE) c.ui(card('⭐ ESTRELA', { y: 40, b: '#8a3ad6', size: 56, s: pop(t, tE, 0.3) || 1 }));
  }
};

// ================= PREÇO =================
SHOTS.b14 = (c) => {
  const t = c.t; const tR = c.at('radiação'), tP = c.at('as paredes'), tX = c.at('exame'); c.sfx('buzz', tR, 0.5); c.sfx('pop', tP, 0.5); c.sfx('click', tX, 0.6);
  if (t < tP) {
    SPACE(c, { sunA: 0.2 }); c.cam([{ t: 0, p: [-110, 30, 40], l: [0, 0, 0], f: 50 }, { t: tP, p: [-95, 26, 30], l: [0, 0, 0], f: 50 }]);
    if (t > tR) { c.ui(card('☢️ RADIAÇÃO', { y: 80, b: '#ff5a4e', size: 70, s: pop(t, tR, 0.3) || 1 })); c.flash('#ff3030', 0.12 * (0.5 + 0.5 * Math.sin(t * 8))); }
  } else {
    c.env('hospital', { day: true, power: 1 });
    c.track('iris', [{ t: 0, p: [-0.6, 0, -2], ry: 0.8, a: 'write', e2: 'neutral', hold: 'paper' }]);
    c.track('juca', [{ t: 0, p: [0.6, 0, -1.6], ry: -2.3, a: 'idle', e2: 'worried' }]);
    c.cam([{ t: tP, p: [0.9, 1.6, 1.4], l: [-0.2, 1.3, -1.8], f: 48 }, { t: c.dur, p: [0.7, 1.6, 1.0], l: [-0.2, 1.3, -1.8], f: 46 }]);
    c.chip(960, 90, 'PAREDES GROSSAS', 'blue', tP + 0.2, 1e9); if (t > tX) c.chip(960, 180, 'EXAME TODO MÊS', 'gold', tX, 1e9);
  }
};

const earthBoard = (x, W, H) => { x.fillStyle = '#0a1230'; x.fillRect(560, 60, 420, 420); x.fillStyle = '#2a6ad6'; x.beginPath(); x.arc(770, 270, 170, 0, 7); x.fill(); x.fillStyle = '#3f9b4a'; for (const [a, b, r] of [[700, 210, 60], [820, 320, 50], [760, 160, 30], [850, 230, 34]]) { x.beginPath(); x.ellipse(a, b, r, r * 0.6, 0.4, 0, 7); x.fill(); } x.fillStyle = 'rgba(255,255,255,.8)'; x.beginPath(); x.ellipse(720, 330, 70, 10, 0.2, 0, 7); x.fill(); x.fillStyle = '#222'; x.font = 'bold 54px sans-serif'; x.textAlign = 'center'; x.fillText('A TERRA', 770, 540); x.fillStyle = '#d62828'; x.font = 'bold 60px sans-serif'; x.fillText('CHUVA?', 250, 200); x.fillText('MAR?', 1290, 200); x.fillText('CÉU AZUL?', 1290, 420); };
SHOTS.b15 = (c) => {
  const t = c.t; const tE = c.at('A Estrela cresce'), tF = c.at('Na escola'); c.sfx('pad', 0, 0.5); c.sfx('chalk', tF, 0.5);
  c.env('classroom', { board: earthBoard });
  c.track('estrela', [{ t: 0, p: [-0.3, 0, -3.6], ry: PI, a: 'lookup', e2: 'sad' }]);
  c.track('maya', [{ t: 0, p: [1.6, 0, -3.8], ry: -2.4, a: 'idle', e2: 'sad' }]);
  for (let i = 0; i < 6; i++) c.mini(i, { p: [-4 + (i % 3) * 3.4, 0.22, -0.9 + Math.floor(i / 3) * 2.6], ry: PI, a: 'sit', e: 'neutral', s: 0.62 });
  if (t < tF) c.frame('estrela', { yaw: PI - 0.4, d: 2.4, h: 0.9, f: 44, to: { d: 2.0 } });
  else c.cam([{ t: tF, p: [0.8, 1.6, 2.4], l: [-0.3, 1.7, -5.8], f: 50 }, { t: c.dur, p: [0.6, 1.6, 1.4], l: [-0.3, 1.8, -5.8], f: 50 }]);
  if (t > tE && t < tF) c.chip(960, 90, 'NUNCA VIU A TERRA', 'blue', tE, tF);
};

SHOTS.b16 = (c) => {
  const t = c.t; const tS = c.at('inscrever'), tL = c.at('deixa o like'); c.sfx('click', tS + 1.1, 0.8); c.sfx('ding', tS + 1.15, 0.6); c.sfx('pop', tL + 0.3, 0.8);
  ROOM(c);
  c.track('maya', [{ t: 0, p: [-0.6, 0, -2.2], ry: 0.25, a: 'wave', e2: 'happy' }]);
  c.track('juca', [{ t: 0, p: [0.6, 0, -2.1], ry: -0.25, a: 'idle', e2: 'happy' }]);
  c.cam([{ t: 0, p: [-0.3, 1.5, 2.6], l: [0, 1.3, -2.2], f: 42 }, { t: c.dur, p: [0.3, 1.5, 1.9], l: [0, 1.35, -2.2], f: 40 }]);
  subBtn(c, tS);
  if (t > tL) c.ui(bigNum('👍 +1', 1400, 560, { size: 80, color: '#2b7bff', s: pop(t, tL, 0.3) || 1 }));
};

// ================= A CONTA =================
SHOTS.b17 = (c) => {
  const t = c.t; const tM = c.at('mil novecentos'), tB = c.at('Biosfera'), tD = c.at('dois anos'); c.sfx('whoosh', 0, 0.5); c.sfx('pop', tB, 0.6); c.sfx('pop', tD, 0.6);
  c.env('farm', { plant: 1, cycle: 0.25 });
  for (let i = 0; i < 8; i++) c.mini(i, { p: [-6 + i * 1.6, 0, 6.5 + (i % 2) * 0.6], ry: PI + (i - 3.5) * 0.08, a: i % 3 ? 'idle' : 'wave', e: 'happy' });
  c.cam([{ t: 0, p: [3, 3.2, 17], l: [-1, 1.5, 0], f: 50 }, { t: c.dur, p: [1.5, 2.6, 14], l: [-1, 1.5, 0], f: 48 }]);
  c.ui(`<div class="abs" style="left:0;top:0;right:0;bottom:0;backdrop-filter:sepia(.35)"></div>`);
  if (t > tM) c.ui(card('🌵 BIOSFERA 2 · ARIZONA · 1991', { y: 70, b: '#ffd21f', s: pop(t, tM, 0.3) || 1 }));
  if (t > tB) c.chip(700, 230, '8 PESSOAS', 'gold', tB + 0.8, 1e9); if (t > tD) c.chip(1220, 230, '2 ANOS FECHADOS', 'blue', tD, 1e9);
};

const o2G = (c, v, o = {}) => { const col = v > 19 ? '#3ddc6a' : v > 16.5 ? '#ffb02e' : '#ff3b30'; c.ui(`<div class="abs" style="left:${o.x ?? 1440}px;top:${o.y ?? 60}px;width:420px;padding:16px 20px;border-radius:20px;background:rgba(10,10,14,.82);border:4px solid ${col}"><div style="font-weight:900;font-size:34px;color:#fff;letter-spacing:3px">💨 OXIGÊNIO NO AR</div><div style="margin-top:10px;height:34px;border-radius:10px;background:#222"><div style="height:100%;width:${clamp(v / 21) * 100}%;border-radius:10px;background:${col}"></div></div><div style="text-align:right;font-weight:900;font-size:52px;color:${col};margin-top:4px">${v.toFixed(1).replace('.', ',')}%</div></div>`); };
SHOTS.b18 = (c) => {
  const t = c.t; const tQ = c.at('quatorze'), tR = c.at('precisaram'), tT = c.at('Na Travessia'), tI = c.at('mais importante'); c.sfx('heartbeat', 0.3, 0.5); c.sfx('boom', tQ, 0.6); c.sfx('whoosh', tT, 0.5);
  if (t < tT) {
    c.env('farm', { plant: 1, cycle: 0.25 });
    for (let i = 0; i < 8; i++) c.mini(i, { p: [-6 + i * 1.6, 0, 6.5 + (i % 2) * 0.6], ry: PI, a: 'tired', e: 'tired' });
    c.cam([{ t: 0, p: [1.5, 2.6, 14], l: [-1, 1.5, 0], f: 48 }, { t: tT, p: [0.5, 2.2, 12.5], l: [-1, 1.4, 0], f: 46 }]);
    c.ui(`<div class="abs" style="left:0;top:0;right:0;bottom:0;backdrop-filter:sepia(.35)"></div>`);
    o2G(c, lerp(20.9, 14.5, ease.io(prog(t, 0.3, tQ + 0.3))));
    if (t > tR) c.chip(700, 110, 'OXIGÊNIO VEIO DE FORA', 'gold', tR, tT);
  } else {
    FARM(c, {}); c.track('caio', [{ t: 0, p: [0.5, 0, -1], ry: PI / 2 + 0.3, a: 'think', e2: 'worried' }]);
    c.frame('caio', { yaw: 0.9, d: 2.9, h: 1.75, up: 0.1, f: 46, t0: tT, to: { d: 2.5 } });
    c.ui(card('AQUI NÃO EXISTE “FORA”', { y: 40, b: '#ff3b30', size: 46, s: pop(t, tT, 0.3) || 1 }));
    if (t > tI) c.chip(960, 170, 'A PLANTAÇÃO É TUDO', 'green', tI, 1e9);
  }
};

SHOTS.b19 = (c) => {
  const t = c.t; const tP = c.at('tem um porém'), tV = c.at('O espaço não'), tB = c.at('mais rápido'), tA = c.at('E o anel'); c.sfx('boom', tP, 0.9); c.sfx('whoosh', tB, 0.7);
  if (t < tA) {
    SPACE(c, { sunA: 0.9 });
    c.cam([{ t: 0, p: [90, 50, -60], l: [0, 20, 20], f: 46 }, { t: tA, p: [75, 45, -40], l: [0, 20, 20], f: 46 }]);
    if (t > tP && t < tV) c.ui(stamp('TEM UM PORÉM', { top: 380, s: pop(t, tP, 0.3) || 1 }));
    if (t > tB) { const k = ((t - tB) * 1.6) % 1; c.ui(`<div class="abs" style="left:${-300 + k * 2400}px;top:${200 + k * 300}px;width:320px;height:6px;border-radius:6px;background:linear-gradient(90deg,rgba(255,200,120,0),#fff);transform:rotate(7deg)"></div>`); c.chip(960, 90, 'MAIS RÁPIDO QUE UMA BALA', 'red', tB, tA); }
  } else {
    FARM(c, {}); c.track('maya', [{ t: 0, p: [-2.8, 0, -5.4], ry: -PI / 2 + 0.7, a: 'lookup', e2: 'worried' }]);
    c.frame('maya', { yaw: 0.6, d: 2.5, h: 1.6, f: 46, t0: tA, to: { d: 2.1 } });
    c.chip(960, 90, 'PAREDES MAIS FINAS', 'red', tA + 0.3, 1e9);
  }
};

SHOTS.b20 = (c) => {
  const t = c.t; const tM = c.at('A Maya, agora'), tS = c.at('a sorte acaba'); c.sfx('pad', 0, 0.4); c.sfx('heartbeat', tS, 0.8);
  if (t < tM) { SPACE(c, { sunA: 1.4 }); orbit(c, 2.2, 2.5, 170, 40); c.chip(960, 90, '40 ANOS SEM NENHUM FURO', 'green', 0.4, tM); }
  else {
    FARM(c, {}); c.track('mayav', [{ t: 0, p: [-3.5, 0, -4.4], ry: -0.67, a: 'idle', e2: t > tS ? 'worried' : 'neutral', hold: 'light' }]);
    c.frame('mayav', { yaw: 0.9, d: 2.3, h: 1.45, f: 46, t0: tM, to: { d: 2.0 } });
    c.chip(960, 90, 'MAYA · 68 ANOS', 'gold', tM + 0.2, 1e9);
    if (t > tS) { c.shake(0.2); c.state.fade = 0.3 * prog(t, tS, c.dur); }
  }
};

// ================= CLÍMAX =================
// heróis no anel: Maya (velha) e Caio (velho)
SHOTS.b21 = (c) => {
  const t = c.t; const tE = c.at('Um estalo'), tF = c.at('as folhas'), tR = c.at('escapando'); c.sfx('crash', tE, 0.9); c.sfx('wind', tE + 0.3, 0.9); c.sfx('alarm', tF, 0.5);
  const on = t > tE; FARM(c, { hole: on, leak: on ? clamp((t - tE) / 0.8) : 0, alarm: t > tF ? 1 : 0 });
  if (on && t < tE + 0.3) c.flash('#ffffff', 0.6 * (1 - (t - tE) / 0.3));
  c.track('mayav', [{ t: 0, p: [0.8, 0, -1.2], ry: PI, a: on ? 'panic' : 'idle', e2: on ? 'scared' : 'neutral' }]);
  c.track('caiov', [{ t: 0, p: [1.6, 0, -0.4], ry: PI - 0.3, a: on ? 'point' : 'idle', e2: on ? 'surprised' : 'neutral', hold: on ? null : 'can' }]);
  if (t < tF) c.cam([{ t: 0, p: [0.2, 1.6, -4.9], l: [1.1, 1.2, -0.8], f: 50 }]);
  else c.cam([{ t: tF, p: [-0.4, 1.7, -2.4], l: [-4.2, 1.6, -6], f: 48 }, { t: c.dur, p: [-0.9, 1.7, -3.2], l: [-4.4, 1.7, -6], f: 44 }]);
  if (t > tR) title(c, 'O AR ESTÁ ESCAPANDO', tR, { size: 84 });
};

SHOTS.b22 = (c) => {
  const t = c.t; const tP = c.at('As portas'), tN = c.at('A nave sobrevive'), tM = c.at('Mas a plantação'); c.sfx('alarm', 0, 0.5); c.sfx('wind', 0, 0.8); c.sfx('crank', tP, 0.6); c.sfx('boom', tM, 0.6);
  const door = lerp(0, 0.18, t / c.dur); FARM(c, { hole: true, leak: 1, alarm: 1, door, frost: t > tM ? 0.6 : 0.25 });
  c.track('mayav', [{ t: 0, p: [0.4, 0, -12], ry: PI, a: 'lookup', e2: 'scared' }]);
  c.track('caiov', [{ t: 0, p: [-0.6, 0, -11.6], ry: PI + 0.3, a: 'panic', e2: 'scared' }]);
  if (t < tM) c.cam([{ t: 0, p: [1.2, 1.4, -7], l: [0, 2.8, -19], f: 50 }, { t: tM, p: [1.0, 1.3, -8], l: [0, 2.8, -19], f: 50 }]);
  else { c.cam([{ t: tM, p: [1.3, 1.7, -3], l: [2.6, 0.9, -12], f: 46 }, { t: c.dur, p: [1.3, 1.6, -5], l: [2.6, 0.9, -13], f: 44 }]); c.ui(stamp('PLANTAÇÃO CONGELADA', { top: 380, s: pop(t, tM, 0.3) || 1 })); }
  timer(c, 120 - t * 2);
};

SHOTS.b23 = (c) => {
  const t = c.t; const tP = c.at('Ela pega'), tC = c.at('contra o vento'), tA = c.at('o Caio'); c.sfx('alarm', 0, 0.4); c.sfx('wind', 0, 0.8); c.sfx('footsteps', tP + 0.4, 0.7); c.sfx('clang', tP, 0.6);
  FARM(c, { hole: true, leak: 1, alarm: 1, door: 0.18 + 0.12 * t / c.dur });
  const p1 = [-3.4, 0, -6.0]; c.track('mayav', [{ t: 0, p: [0.4, 0, -1], ry: PI, a: 'idle', e2: 'angry' }, { t: tP, p: [0.4, 0, -1], ry: PI + 0.6, a: 'carry', e2: 'angry', hold: 'paper' }, { t: c.dur, p: p1, ry: -PI / 2 - 0.1, a: 'walk', e2: 'angry', hold: 'paper', over: { lean: 0.3 } }]);
  c.track('caiov', [{ t: 0, p: [1.4, 0, 1.5], ry: PI, a: 'idle', e2: 'worried' }, { t: tA, p: [1.4, 0, 1.5], ry: PI + 0.4, a: 'run', e2: 'worried', hold: 'can' }, { t: c.dur, p: [-0.8, 0, -3.4], ry: PI + 0.6, a: 'run', e2: 'worried', hold: 'can' }]);
  if (t < tC) c.frame('mayav', { yaw: 0.6, d: 3.0, h: 1.4, f: 46 });
  else c.cam([{ t: tC, p: [-0.6, 1.6, -9.8], l: [-1.6, 1.2, -4], f: 50 }, { t: c.dur, p: [-1.2, 1.6, -9.6], l: [-2.6, 1.3, -5], f: 48 }]);
  timer(c, 82 - t * 2);
};

const PUSH = [-4.05, 0, -6.0];
SHOTS.b24 = (c) => {
  const t = c.t; const tU = c.at('uma vez'), tD = c.at('Duas'), tP = c.at('A porta'); c.sfx('wind', 0, 0.9); c.sfx('clang', tU, 0.7); c.sfx('clang', tD, 0.7); c.sfx('alarm', tP, 0.5);
  const slip = (t > tU && t < tU + 0.5) || (t > tD && t < tD + 0.5); const pa = slip ? 0.35 : t > 0.4 ? 0.9 : 0.5;
  FARM(c, { hole: true, leak: slip ? 1 : 0.5, alarm: 1, door: t > tP ? lerp(0.45, 0.55, prog(t, tP, c.dur)) : 0.32 + 0.1 * t / tP, patch: pa });
  c.track('mayav', [{ t: 0, p: PUSH, ry: -PI / 2, a: 'carry', e2: slip ? 'scared' : 'angry', over: { lean: 0.2 } }]);
  c.track('caiov', [{ t: 0, p: [-3.3, 0, -5.0], ry: -PI / 2 - 0.6, a: 'hold', e2: 'worried', hold: 'can' }]);
  if (t < tP) c.cam([{ t: 0, p: [-2.4, 1.7, -8.6], l: [-4.3, 1.5, -5.8], f: 46 }, { t: tP, p: [-2.6, 1.7, -8.2], l: [-4.3, 1.5, -5.8], f: 44 }]);
  else c.cam([{ t: tP, p: [1.5, 1.2, -9], l: [0, 2.0, -19], f: 50 }]);
  if (slip) c.shake(0.4);
  timer(c, 40 - t * 3);
};

SHOTS.b25 = (c) => {
  const t = c.t; const tT = c.at('Na terceira'), tA = c.at('O assobio'), tP = c.at('E a porta'); c.sfx('clang', tT, 0.8); c.sfx('sizzle', tT + 0.5, 0.5); c.sfx('ding', tA, 0.7); c.sfx('boom', tP + 0.6, 0.5); c.sfx('tada', tP + 1.3, 0.5);
  const done = t > tT + 0.4; const door = t < tP ? lerp(0.6, 0.8, t / tP) : lerp(0.8, 0.88, clamp((t - tP) / 0.6));
  FARM(c, { hole: true, leak: done ? 0 : 0.7, alarm: t < tA ? 1 : 0, door, patch: t < tT ? 0.8 : 1 });
  c.track('mayav', [{ t: 0, p: PUSH, ry: -PI / 2, a: 'carry', e2: t > tA ? 'happy' : 'angry' }]);
  c.track('caiov', [{ t: 0, p: [-3.1, 0, -4.1], ry: -PI / 2 - 0.6, a: t > tA ? 'cheer' : 'tinker', e2: t > tA ? 'happy' : 'worried', hold: t > tA ? null : 'can' }]);
  if (t < tP) c.cam([{ t: 0, p: [-2.4, 1.7, -8.4], l: [-4.3, 1.5, -5.8], f: 44 }, { t: tP, p: [-2.6, 1.7, -7.8], l: [-4.3, 1.5, -5.8], f: 42 }]);
  else c.cam([{ t: tP, p: [1.0, 0.7, -12], l: [0, 0.5, -19], f: 48 }]);
  if (t > tA && t < tP) title(c, 'O ASSOBIO PAROU', tA, { bg: '#1c9a4a', size: 80 });
  if (t > tP + 0.6) c.ui(card('🖐️ A UM PALMO DO CHÃO', { y: 80, b: '#3ddc6a', s: pop(t, tP + 0.6, 0.3) || 1 }));
  if (t < tP) timer(c, t < tT ? 9 - t : 6);
};

SHOTS.b26 = (c) => {
  const t = c.t; const tN = c.at('ninguém se feriu'), tP = c.at('E as plantas'); c.sfx('pad', 0, 0.5); c.sfx('ding', tN, 0.5); c.sfx('twinkle', tP, 0.5);
  if (t < tP) {
    FARM(c, { hole: true, patch: 1, door: 0.88, frost: 0.5, dim: 0.2 });
    c.track('iris', [{ t: 0, p: [-0.6, 0, -3.0], ry: 0.6, a: 'talk', e2: 'neutral', hold: 'paper' }]);
    c.track('mayav', [{ t: 0, p: [0.6, 0, -3.4], ry: -0.5, a: 'tired', e2: 'tired' }]);
    c.track('caiov', [{ t: 0, p: [0.0, 0, -4.4], ry: 0.1, a: 'idle', e2: 'happy' }]);
    c.cam([{ t: 0, p: [0.2, 1.6, 0.4], l: [0.1, 1.3, -3.5], f: 48 }, { t: tP, p: [0.2, 1.6, -0.2], l: [0.1, 1.3, -3.5], f: 46 }]);
    if (t > tN) c.chip(960, 90, 'NINGUÉM SE FERIU', 'green', tN, 1e9);
  } else {
    const k = prog(t, tP, c.dur); FARM(c, { hole: true, patch: 1, plant: lerp(0.45, 1, ease.io(k)), dead: lerp(0.7, 0, k) });
    c.cam([{ t: tP, p: [1.3, 1.4, 2], l: [2.6, 0.9, -8], f: 46 }, { t: c.dur, p: [1.3, 1.4, 0.5], l: [2.6, 0.9, -8], f: 46 }]);
    c.chip(960, 90, 'POUCOS DIAS DEPOIS 🌱', 'green', tP + 0.2, 1e9);
  }
};

// ================= FINAL =================
SHOTS.b27 = (c) => {
  const t = c.t; const tA = c.at('vira avó'), tB = c.at('bisavó'), tG = c.at('ela grava'); c.sfx('pad', 0, 0.5); c.sfx('pop', tB, 0.5); c.sfx('click', tG + 0.5, 0.6);
  ROOM(c, { sun: 0.4 });
  if (t < tG) {
    c.track('mayav', [{ t: 0, p: [-0.8, 0, -1.8], ry: 0.2, a: 'hug', e2: 'happy' }]);
    for (let i = 0; i < 6; i++) c.mini(i, { p: [-0.2 + (i % 3) * 0.7, 0, -2.4 + Math.floor(i / 3) * 0.9], ry: -0.4, a: i % 2 ? 'wave' : 'idle', e: 'happy', s: i < 3 ? 0.62 : 0.9 });
    c.cam([{ t: 0, p: [0.2, 1.6, 2.6], l: [0, 1.0, -1.8], f: 50 }, { t: tG, p: [0.1, 1.6, 2.0], l: [0, 1.0, -1.8], f: 48 }]);
    if (t > tA) c.chip(760, 90, 'AVÓ', 'gold', tA, 1e9); if (t > tB) c.chip(1160, 90, 'BISAVÓ', 'gold', tB, 1e9);
  } else {
    c.track('mayav', [{ t: 0, p: [-2.4, 0.22, 0.1], ry: 0, a: 'sit', e2: 'happy', hold: 'phone' }]);
    c.frame('mayav', { yaw: 0.25, d: 3.0, h: 1.15, f: 42, t0: tG, to: { d: 2.6 } });
    c.ui(card('🔴 REC · “ABRIR NO DIA DA CHEGADA”', { y: 70, b: '#ff3b30', size: 44, s: pop(t, tG, 0.3) || 1 }));
  }
};

SHOTS.b28 = (c) => {
  const t = c.t; const tC = c.at('a Travessia chega'), tB = c.at('A bisneta'), tV = c.at('vento'); c.sfx('riser', 0, 0.5); c.sfx('boom', tC, 0.6); c.sfx('wind', tB, 0.6); c.sfx('tada', tV, 0.5);
  if (t < tB) {
    SPACE(c, { planet: lerp(0.75, 1, t / tB), engine: 0.2, sunA: 0.3 });
    c.cam([{ t: 0, p: [130, 55, 170], l: [30, -20, -250], f: 48 }, { t: tB, p: [115, 48, 150], l: [30, -20, -250], f: 46 }]);
    c.chip(960, 90, '100 ANOS DEPOIS DA PARTIDA', 'gold', 0.4, tB);
  } else {
    c.env('final', {});
    c.track('bis', [{ t: 0, p: [0, 0, 4], ry: 0, a: 'walk', e2: 'surprised' }, { t: tV - 0.3, p: [0, 0, 5.5], ry: 0, a: 'walk', e2: 'surprised' }, { t: tV, p: [0, 0, 5.5], ry: 0, a: 'cheer', e2: 'happy' }]);
    c.frame('bis', { yaw: 0.25, d: 4.2, h: 1.3, f: 44, t0: tB, to: { d: 3.4 } });
    c.chip(960, 90, 'MAYA · A BISNETA', 'blue', tB + 0.3, 1e9);
    if (t > tV) for (let i = 0; i < 6; i++) { const u = ((t - tV) * 0.9 + i / 6) % 1; c.ui(`<div class="abs" style="left:${-200 + u * 2300}px;top:${300 + i * 90}px;width:260px;height:5px;border-radius:5px;background:rgba(255,255,255,${0.5 * Math.sin(u * PI)})"></div>`); }
  }
};

SHOTS.b29 = (c) => {
  const t = c.t; const tR = c.at('Recomeçou porque'), tB = c.at('só os bisnetos'); c.sfx('pad', 0, 0.5);
  c.env('final', {});
  c.crowd(Array.from({ length: 60 }, (_, i) => { const a = i * 2.399, r = 3 + Math.sqrt(i) * 0.9; const x = Math.cos(a) * r, z = Math.sin(a) * r - 2; return { p: [x, 0, z], ry: Math.atan2(-x, 6 - z), c: COLS[i % COLS.length], s: i % 4 ? 0.95 : 0.65, a: 'idle' }; }));
  c.track('bis', [{ t: 0, p: [0, 0, 3.8], ry: 0, a: 'idle', e2: 'happy', hold: 'phone' }]);
  c.cam([{ t: 0, p: [0.6, 3.4, 8.6], l: [0, 1.2, 2.5], f: 50 }, { t: c.dur, p: [0.5, 3.2, 7.6], l: [0, 1.2, 2.5], f: 50 }]);
  if (t > tR) c.chip(960, 140, 'COMEÇARAM A VIAGEM', 'gold', tR, 1e9); if (t > tB) c.chip(960, 230, 'OS BISNETOS TERMINARAM', 'blue', tB, 1e9);
  c.state.fade = prog(t, c.dur - 0.5, c.dur);
};

SHOTS.b30 = (c) => {
  const t = c.t; const tQ = c.at('Embarcaria'), tM = c.at('debaixo da terra'), tS = c.at('Se inscreve'), tB = c.at('Até lá'); c.sfx('whoosh', tM, 0.5); c.sfx('click', tS + 1.1, 0.8); c.sfx('ding', tS + 1.15, 0.6); c.sfx('tada', tB, 0.6);
  c.env('outro');
  const w = t > tB;
  [['maya', -3.0, 0.3], ['iris', -1.0, 0.1], ['caio', 1.0, -0.1], ['juca', 3.0, -0.3]].forEach(([n, x, ry]) => c.track(n, [{ t: 0, p: [x, 0, 5.1], ry, a: w ? 'wave' : 'idle', e2: 'happy' }]));
  c.cam([{ t: 0, p: [0, 1.9, 12.4], l: [0, 2.0, 5], f: 42 }, { t: c.dur, p: [0, 2.0, 11.4], l: [0, 2.0, 5], f: 42 }]);
  if (t > tQ && t < tM - 1.5) { const a = clamp((t - tQ) / 0.4); c.ui(`<div class="abs" style="left:0;top:130px;width:1920px;text-align:center;font-weight:900;font-size:60px;color:#fff;opacity:${a};text-shadow:0 5px 0 #000">VOCÊ EMBARCARIA?</div>`);
    ['SIM 🚀', 'NÃO 🌍'].forEach((l, i) => { const s = pop(t, tQ + 0.5 + i * 0.3, 0.25); c.ui(`<div class="abs" style="left:${580 + i * 420}px;top:240px;width:340px;padding:20px 0;text-align:center;border-radius:24px;background:${['#38d6ff', '#ffb02e'][i]};color:#111;font-weight:900;font-size:64px;transform:scale(${s})">${l}</div>`); }); }
  if (t > tM - 1.4 && t < tS - 0.1) { c.ui(`<div class="abs" style="left:0;top:120px;width:1920px;text-align:center;font-weight:900;font-size:60px;color:#fff;text-shadow:0 5px 0 #000">PRÓXIMO EPISÓDIO</div>`); c.ui(bigNum('DEBAIXO DA TERRA?', 960, 270, { size: 120, color: '#ffd21f', glow: 'rgba(255,210,31,.6)', s: pop(t, tM - 1.4, 0.3) || 1 })); }
  if (t < tB) subBtn(c, tS);
  if (t > tB) c.ui(bigNum('ATÉ LÁ!', 960, 250, { size: 190, color: '#ffd21f', glow: 'rgba(255,210,31,.7)', s: pop(t, tB, 0.3) || 1 }));
  c.state.fade = prog(t, c.dur - 1.0, c.dur);
};
