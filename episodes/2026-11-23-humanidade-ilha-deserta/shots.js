// LONGO: "E se a humanidade tivesse que recomeçar numa ilha deserta?" — palito, 1920x1080.
// Cenário novo: 'island' (engine/envs5.js). Também: void, citynight {black}, ocean {ship}, outro.
import { clamp, lerp, ease, PI, prog, center, stamp, bigNum, pop, seeded, subBtn } from '/engine/kit.js';
export const SHOTS = {};
const P0 = { num: null, flag: false };
export const CAST = {
  mari: { style: 'palito', ...P0, shirt: 0x2a6ad6, trim: 0xffffff, shorts: 0x1d2a44, hair: 'lia', scale: 0.96 },
  zeca: { style: 'palito', ...P0, shirt: 0xf4f4f4, trim: 0xd62828, shorts: 0x3a3a48, cap: 0xd62828 },
  rosa: { style: 'palito', ...P0, shirt: 0xf4f4f4, trim: 0xe91e8c, shorts: 0xe91e8c, hair: 'lia', scale: 0.96 },
  kiko: { style: 'palito', ...P0, shirt: 0xff7a1a, trim: 0xffd21f, shorts: 0x2fa35a, scale: 0.68 },
  kikov: { style: 'palito', ...P0, shirt: 0xff7a1a, trim: 0xffd21f, shorts: 0x2fa35a, scale: 1.0 },
};
const COLS = [0x2a6ad6, 0xff7a1a, 0x2fa35a, 0xf4f4f4, 0xd6a31c, 0x8a3ad6, 0x0aa6b8, 0xe02020];
const title = (c, txt, t0, o = {}) => { if (c.t < t0) return; const s = pop(c.t, t0, 0.3) || 1; c.ui(`<div class="abs" style="left:0;right:0;top:${o.top ?? 70}px;text-align:center;transform:scale(${s})"><div style="display:inline-block;background:${o.bg ?? '#d62828'};border:7px solid #fff;border-radius:22px;padding:6px 60px;font-weight:900;font-size:${o.size ?? 96}px;color:${o.color ?? '#fff'};transform:rotate(-2deg);box-shadow:0 14px 0 rgba(0,0,0,.45)">${txt}</div></div>`); };
const card = (html, o = {}) => `<div class="abs" style="left:${o.x ?? 960}px;top:${o.y ?? 150}px;transform:translate(-50%,0) scale(${o.s ?? 1});opacity:${o.a ?? 1};background:rgba(8,12,28,.86);border:5px solid ${o.b ?? '#38d6ff'};border-radius:26px;padding:22px 44px;color:#fff;font-weight:900;font-size:${o.size ?? 50}px;text-align:center;white-space:nowrap">${html}</div>`;
const big = (c, txt, t0, o = {}) => { if (c.t < t0) return; c.ui(bigNum(txt, o.x ?? 960, o.y ?? 250, { size: o.size ?? 130, color: o.color ?? '#ffd21f', glow: o.glow ?? 'rgba(255,210,31,.6)', s: pop(c.t, t0, 0.3) || 1 })); };
const ISL = (c, p = {}) => c.env('island', { fire: 0.8, tarp: true, ...p });
const FIRE = [0, 0, -4], TANK = [6, 0, 3], CAVE = [-15, 0, -19.5], HOSP = [-8, 0, -8];
// figurantes na vila (ao redor da fogueira)
const village = (c, n, o = {}) => { const R = seeded(o.seed || 7); for (let i = 0; i < n; i++) { const a = R() * PI * 2, r = (o.r0 ?? 2.2) + R() * (o.r ?? 6); const x = Math.cos(a) * r * 1.3, z = -5 + Math.sin(a) * r * 0.8; if (z > (o.zmax ?? 2)) continue; const walk = o.walk && i % 3 === 0; const ph = c.t * 0.25 + i; const wx = walk ? x + Math.sin(ph) * 1.2 : x;
  c.mini(i, { p: [wx, 0, z], ry: walk ? (Math.cos(ph) > 0 ? PI / 2 : -PI / 2) : (o.ry ?? Math.atan2(-x, -4 - z)), a: walk ? 'walk' : (typeof o.a === 'function' ? o.a(i) : (o.a || 'idle')), e: o.e || 'happy', s: (o.kids && i % 4 === 0) ? 0.62 : 0.95 }); } };
// caixa d'água: Mari à esquerda e Zeca à direita, câmera do lado da praia
const MP = [4.4, 0, 3.0], ZP = [7.6, 0, 3.0];
const TCAM = (c, t0, d = 0) => c.cam([{ t: t0, p: [6.2, 4.2, -3.4 - d], l: [6, 0.9, 4.0], f: 46 }, { t: c.dur, p: [6.2, 4.0, -2.6 - d], l: [6, 0.9, 4.0], f: 44 }]);
const fireLight = (c, k = 1) => c.glow([0, 1.0, -3.6], 0xff8a2a, 18 * k);

// ================= GANCHO =================
SHOTS.b01 = (c) => {
  const t = c.t; const tN = c.at('Não tem loja'), tU = c.at('única casa'); c.sfx('waves', 0, 0.6); c.sfx('riser', 0.2, 0.4); c.sfx('boom', tU, 0.8);
  ISL(c);
  if (t < tN) { c.cam([{ t: 0, p: [40, 34, 60], l: [0, 0, -14], f: 46 }, { t: tN, p: [30, 26, 44], l: [0, 0, -14], f: 46 }]); c.chip(960, 90, 'A MILHARES DE KM DE QUALQUER CIDADE', 'blue', 0.6, tN); }
  else if (t < tU) { village(c, 16, { walk: true, kids: true }); c.cam([{ t: tN, p: [9, 4.5, 9], l: [-2, 1.2, -7], f: 50 }, { t: tU, p: [7, 4.0, 7], l: [-2, 1.2, -7], f: 50 }]);
    ['🏪 SEM LOJA', '🏥 SEM HOSPITAL', '📶 SEM INTERNET'].forEach((s, i) => { const t0 = tN + i * 0.9; if (t > t0) c.ui(card(s, { x: 400 + i * 560, y: 90, size: 40, b: '#ff3b30', s: pop(t, t0, 0.25) || 1 })); }); }
  else { village(c, 34, { walk: true, kids: true }); c.cam([{ t: tU, p: [-6, 6, 10], l: [0, 1.2, -6], f: 50 }, { t: c.dur, p: [-4.5, 5, 7.5], l: [0, 1.2, -6], f: 50 }]); title(c, 'A ÚNICA CASA DE 60 PESSOAS', tU + 0.1, { size: 80, bg: '#2a6ad6' }); }
};

SHOTS.b02 = (c) => {
  const t = c.t; const tV = c.at('O vento'), tI = c.at('invadindo'); c.sfx('wind', 0, 0.8); c.sfx('waves', 0.5, 0.8); c.sfx('crash', tI, 0.5);
  const su = lerp(0.15, 0.55, prog(t, 0, c.dur));
  ISL(c, { tod: 'night', storm: 1, rain: 1, surge: su, fire: 0.3, lid: 0.3 }); c.shake(0.15);
  if (t < tV) c.cam([{ t: 0, p: [0, 16, 30], l: [0, 2, -10], f: 50 }, { t: tV, p: [0, 13, 24], l: [0, 2, -10], f: 50 }]);
  else { c.cam([{ t: tV, p: [1, 2.6, 12.5], l: [5.5, 1.0, 2], f: 50 }, { t: c.dur, p: [1.5, 2.3, 11], l: [5.5, 1.0, 2], f: 48 }]); c.chip(960, 90, '💨 VENTO: +100 KM/H', 'red', tV + 0.3, tI); }
  if (t > tI) title(c, 'AS ONDAS INVADEM A PRAIA', tI, { size: 80 });
};

SHOTS.b03 = (c) => {
  const t = c.t; const tC = c.at("caixa d'água"), tN = c.at('nada pra beber'), tV = c.at('voltar cinco'); c.sfx('heartbeat', 0, 0.6); c.sfx('whoosh', tV, 0.7);
  ISL(c, { tod: 'night', storm: 1, rain: 1, surge: 0.5, fire: 0.3, lid: 0.7 }); c.shake(0.12);
  if (t < tN) { c.cam([{ t: 0, p: [10, 2.6, 7.5], l: [6, 1.4, 3], f: 46 }, { t: tN, p: [9, 2.4, 6.4], l: [6, 1.4, 3], f: 44 }]); c.tag([6, 2.4, 3], "ÚNICA ÁGUA DOCE", 'red', tC, tN); }
  else { c.track('mari', [{ t: 0, p: [4, 0, 6], ry: 0.6, a: t < tV ? 'panic' : 'think', e2: 'scared' }]); c.frame('mari', { yaw: 0.3, d: 3.4, h: 1.2, f: 42, t0: tN, to: { d: 3.0 } }); if (t > tV) c.chip(420, 520, '⏪ 5 ANOS ANTES', 'gold', tV, 1e9); }
};

// ================= COMEÇO =================
SHOTS.b04 = (c) => {
  const t = c.t; const tT = c.at('Uma tempestade'), tA = c.at('apagam'); c.sfx('boom', 0.6, 0.6); c.sfx('riser', 0.2, 0.4); c.sfx('blackout', tA, 0.8);
  if (t < tT) { c.env('void'); c.camSet([0, 1.5, 8], [0, 1.5, 0], 50); const k = prog(t, 0.6, tT); c.ui(`<div class="abs" style="left:0;top:0;width:1920px;height:1080px;background:#02030a"></div><div class="abs" style="left:960px;top:540px;width:520px;height:520px;transform:translate(-50%,-50%) scale(${1 + 0.05 * Math.sin(t * 3)});border-radius:50%;background:radial-gradient(#fff6c0,#ffb22e 55%,#ff5a1a 80%,rgba(255,80,20,0) 100%);"></div><div class="abs" style="left:960px;top:540px;width:${700 + 500 * k}px;height:${700 + 500 * k}px;transform:translate(-50%,-50%);border-radius:50%;background:radial-gradient(rgba(255,150,40,.55),rgba(255,120,30,0) 70%)"></div><div class="abs" style="left:${1180 + 500 * k}px;top:${400 - 60 * k}px;width:${200 + 800 * k}px;height:${120 + 260 * k}px;transform:translate(-50%,-50%);border-radius:50%;background:radial-gradient(rgba(255,240,180,.95),rgba(255,120,30,0) 70%);opacity:${k}"></div>`); c.chip(960, 90, '☀️ EXPLOSÃO SOLAR', 'gold', 0.5, tT); }
  else { const b = prog(t, c.at('de uma hora'), tA + 0.2); c.env('citynight', { black: b }); c.cam([{ t: tT, p: [0, 30, 60], l: [0, 10, -40], f: 50 }, { t: c.dur, p: [0, 26, 48], l: [0, 10, -40], f: 50 }]); c.chip(960, 90, 'SATÉLITES · CELULARES · COMPUTADORES', 'white', tT + 0.2, tA); if (t > tA) title(c, 'TUDO APAGA', tA, { bg: '#111', size: 96 }); }
};

SHOTS.b05 = (c) => {
  const t = c.t; const tE = c.at('Evento Carrington'), tF = c.at('faíscas'), tA = c.at('aurora'); c.sfx('spark', tF, 0.6); c.sfx('pad', tA, 0.5);
  ISL(c, { tod: 'night', aurora: t > tA - 0.3, fire: 0.6, stars: true });
  if (t < tA - 0.3) { c.cam([{ t: 0, p: [0, 6, 18], l: [0, 20, -100], f: 56 }]); c.ui(`<div class="abs" style="left:0;top:0;width:1920px;height:1080px;background:rgba(10,10,20,.75)"></div>`); c.chip(960, 90, '📜 HISTÓRIA REAL', 'gold', 0.3, 1e9);
    if (t > tE - 0.4) c.ui(card('1859 · EVENTO CARRINGTON', { y: 260, size: 70, b: '#ffd21f', s: pop(t, tE - 0.4, 0.3) || 1 }));
    if (t > tF) { c.ui(card('⚡ FIOS DE TELÉGRAFO SOLTAM FAÍSCAS', { y: 470, size: 54, b: '#ff3b30', s: pop(t, tF, 0.3) || 1 })); if (Math.sin(t * 40) > 0.6) c.flash('#fff6c0', 0.15); } }
  else { c.cam([{ t: tA - 0.3, p: [2, 1.6, 8], l: [-20, 40, -200], f: 56 }, { t: c.dur, p: [2, 1.5, 6], l: [-20, 46, -200], f: 56 }]); c.chip(960, 90, 'AURORA PERTO DOS TRÓPICOS', 'green', tA, 1e9); }
};

SHOTS.b06 = (c) => {
  const t = c.t; const tS = c.at('Sem motor'), tE = c.at('encalhar'), tM = c.at('mapa nenhum'); c.sfx('waves', 0, 0.6); c.sfx('crash', tE, 0.6);
  if (t < tE) { c.env('ocean', { ship: true }); const z = lerp(-40, -30, prog(t, 0, tE)); c.cam([{ t: 0, p: [60, 14, 30], l: [0, 4, -40], f: 46 }, { t: tE, p: [48, 11, 20], l: [0, 4, -40], f: 46 }]); if (t > tS) c.chip(960, 90, '⚙️ SEM MOTOR · 🧭 SEM GPS · À DERIVA', 'red', tS, 1e9); }
  else { ISL(c, { huts: 0, fire: 0, tarp: false, plant: 0, tank: false }); c.cam([{ t: tE, p: [-2, 7, 34], l: [16, 1.5, 6], f: 48 }, { t: c.dur, p: [0, 6, 30], l: [16, 1.5, 6], f: 48 }]); if (t > tE + 0.3) c.shake(Math.max(0, 0.4 - (t - tE) * 0.4));
    if (t > tM - 0.2) c.tag([0, 6, -20], 'ILHA SEM NOME', 'gold', tM - 0.2, 1e9); }
};

SHOTS.b07 = (c) => {
  const t = c.t; const tZ = c.at('O Zeca'), tR = c.at('doutora Rosa'), tK = c.at('E o Kiko'), tS = c.at('estrela cadente'); c.sfx('pop', 0.3, 0.5); c.sfx('pop', tZ, 0.5); c.sfx('pop', tR, 0.5); c.sfx('pop', tK, 0.5);
  ISL(c, { huts: 0, fire: 0, tarp: false, plant: 0, tod: t > tK ? 'night' : 'day' });
  const L = (n, cap, t0, b) => c.ui(card(cap, { x: 470, y: 470, size: 46, b, s: pop(t, t0, 0.25) || 1 }));
  if (t < tZ) { c.track('mari', [{ t: 0, p: [0, 0, 7], ry: 0.2, a: 'wave', e2: 'happy' }]); c.frame('mari', { yaw: 0.3, d: 3.3, h: 1.15, f: 42, to: { d: 2.4 } }); L('mari', 'MARI · 30 · MARINHEIRA', 0.3, '#2a6ad6'); }
  else if (t < tR) { c.track('zeca', [{ t: 0, p: [3, 0, 9], ry: -0.4, a: 'idle', e2: 'deadpan', hold: 'pan' }]); c.frame('zeca', { yaw: -0.3, d: 3.3, h: 1.15, f: 42, t0: tZ, to: { d: 2.4 } }); L('zeca', 'ZECA · COZINHEIRO DO NAVIO', tZ, '#d62828'); }
  else if (t < tK) { c.track('rosa', [{ t: 0, p: [-3, 0, 8], ry: 0.3, a: 'idle', e2: 'smirk' }]); c.frame('rosa', { yaw: 0.3, d: 3.3, h: 1.15, f: 42, t0: tR, to: { d: 2.4 } }); L('rosa', 'DRA. ROSA · MÉDICA', tR, '#e91e8c'); }
  else { c.track('kiko', [{ t: 0, p: [0, 0, 6], ry: PI - 0.3, a: 'lookup', e2: t > tS ? 'surprised' : 'happy' }]); c.cam([{ t: tK, p: [1.4, 0.9, 8.6], l: [0, 2.2, 4], f: 50 }, { t: c.dur, p: [1.2, 0.8, 8.0], l: [0, 2.6, 4], f: 50 }]); L('kiko', 'KIKO · 12 ANOS', tK, '#ffd21f');
    if (t > tS) { const k = prog(t, tS, tS + 0.8); c.ui(`<div class="abs" style="left:${1300 - 500 * k}px;top:${120 + 160 * k}px;width:220px;height:4px;background:linear-gradient(90deg,rgba(255,255,255,0),#fff);transform:rotate(-18deg);opacity:${1 - k * 0.6}"></div>`); } }
};

SHOTS.b08 = (c) => {
  const t = c.t; const tS = c.at('O sal'), tT = c.at('três dias'); c.sfx('ding', 0.3, 0.5); c.sfx('dramatic', tT, 0.5);
  ISL(c, { huts: 0, fire: 0, tarp: false, plant: 0 });
  c.track('mari', [{ t: 0, p: [0, 0, 6.5], ry: PI, a: t < tS ? 'shout' : 'point', e2: 'angry' }]);
  village(c, 14, { r0: 0, r: 0 }); for (let i = 0; i < 14; i++) c.mini(i, { p: [-4 + (i % 7) * 1.3, 0, 3 - Math.floor(i / 7) * 1.3], ry: 0, a: 'idle', e: 'worried', s: i % 4 ? 0.95 : 0.62 });
  if (t < tT) c.cam([{ t: 0, p: [7, 2.2, 6], l: [-0.5, 1.1, 4.5], f: 46 }, { t: tT, p: [6.2, 2.0, 5.6], l: [-0.5, 1.1, 4.5], f: 44 }]);
  else c.frame('mari', { yaw: -0.3, d: 3.4, h: 1.1, f: 42, t0: tT });
  c.chip(960, 90, '🚫 REGRA Nº 1: NADA DE ÁGUA DO MAR', 'red', 0.3, tT); if (t > tT) big(c, '3 DIAS SEM BEBER', tT, { color: '#ff3b30', glow: 'rgba(255,59,48,.6)', y: 520, size: 90, x: 520 });
};

// ================= VANTAGENS =================
SHOTS.b09 = (c) => {
  const t = c.t; const tC = c.at('dentro de cada coco'), tP = c.at('pronta pra beber'); c.sfx('pop', tC, 0.5); c.sfx('splash', tP, 0.4);
  ISL(c, { huts: 1, fire: 0.6, tarp: false, plant: 0 });
  c.track('zeca', [{ t: 0, p: [-5.0, 0, 5], ry: 0.6, a: t < tC ? 'lookup' : 'point', e2: 'happy' }]);
  c.track('kiko', [{ t: 0, p: [-3.6, 0, 6.2], ry: -1.8, a: t < tP ? 'idle' : 'eat', e2: 'happy', hold: 'cup' }]);
  if (t < tC) c.cam([{ t: 0, p: [-2, 1.3, 10], l: [-6, 5, 6], f: 50 }]);
  else c.cam([{ t: tC, p: [-2.4, 1.6, 9.5], l: [-4.3, 1.1, 5.6], f: 44 }, { t: c.dur, p: [-2.8, 1.5, 8.8], l: [-4.3, 1.1, 5.6], f: 42 }]);
  c.chip(960, 90, '🥥 ÁGUA DE COCO', 'green', tC, 1e9);
};

SHOTS.b10 = (c) => {
  const t = c.t; const tL = c.at('lona'), tF = c.at('fervem'), tS = c.at('o sal'); c.sfx('rustle', tL, 0.5); c.sfx('sizzle', tF, 0.5);
  if (t < tF) { ISL(c, { huts: 2, fire: 0.7, plant: 0, rain: prog(t, tL + 1.5, tL + 2.5) * 0.6, storm: 0.3 });
    c.track('mari', [{ t: 0, p: [8.6, 0, 4.6], ry: -2.2, a: 'pointup', e2: 'happy' }]);
    c.cam([{ t: 0, p: [11, 2.2, 10], l: [6, 1.8, 2.8], f: 46 }, { t: tF, p: [10, 2.0, 8.8], l: [6, 1.8, 2.8], f: 46 }]); c.tag([6, 3.4, 3], 'LONA DO NAVIO', 'blue', tL, tF); c.tag([6, 1.0, 4.4], "CAIXA D'ÁGUA", 'gold', tL + 1.5, tF); }
  else { ISL(c, { huts: 2, fire: 1, plant: 0 }); c.track('zeca', [{ t: 0, p: [1.3, 0, -3.2], ry: -1.8, a: 'hold', e2: 'neutral', hold: 'pan' }]); c.puffs([0.2, 1.4, -3.8], 0.8, { color: 0xffffff, rise: 2, op: 0.5 }); fireLight(c);
    c.cam([{ t: tF, p: [2.4, 1.8, 0.6], l: [0.2, 1.1, -3.8], f: 46 }, { t: c.dur, p: [2.0, 1.7, 0], l: [0.2, 1.1, -3.8], f: 44 }]);
    if (t > tS) c.chip(960, 90, '♨️ VAPOR → ÁGUA SEM SAL', 'blue', tS, 1e9); }
};

SHOTS.b11 = (c) => {
  const t = c.t; const tM = c.at('mil novecentos'), tQ = c.at('quinze meses'), tG = c.at('guardavam'), tT = c.at('todos sobreviveram'); c.sfx('page', 0.2, 0.5); c.sfx('tada', tT, 0.5);
  ISL(c, { huts: 0, fire: 0.9, tarp: false, plant: prog(t, tG, tT) * 0.6, tod: t < tG ? 'dusk' : 'day' });
  for (let i = 0; i < 6; i++) { const a = i / 6 * PI * 2 + 0.3; c.mini(i, { p: [Math.cos(a) * 1.9, 0, -4 + Math.sin(a) * 1.9], ry: Math.atan2(-Math.cos(a), -Math.sin(a)), a: t > tT ? 'cheer' : (i % 2 ? 'sit' : 'idle'), e: 'happy', s: 0.75 }); }
  fireLight(c, 0.8);
  c.cam([{ t: 0, p: [5, 3.4, 4], l: [0, 0.8, -4], f: 46 }, { t: c.dur, p: [3.6, 2.8, 2.5], l: [0, 0.8, -4], f: 46 }]);
  if (t > tM) c.ui(card('🇹🇴 1965 · TONGA · 6 GAROTOS', { y: 70, size: 54, b: '#ffd21f', s: pop(t, tM, 0.3) || 1 }));
  if (t > tQ) big(c, '15 MESES', tQ, { y: 330 });
  if (t > tG) c.chip(960, 580, 'ÁGUA EM TRONCOS · HORTA · FOGO ACESO', 'green', tG, 1e9);
};

SHOTS.b12 = (c) => {
  const t = c.t; const tR = c.at('o recife'), tP = c.at('Eles plantam'); c.sfx('splash', 0.5, 0.5); c.sfx('waves', 0, 0.4);
  if (t < tP) { ISL(c, { huts: 3, plant: 0.2 });
    c.track('zeca', [{ t: 0, p: [1, -0.2, 12.4], ry: PI, a: t % 3 < 1.5 ? 'point' : 'crouch', e2: 'happy', hold: 'bag' }]);
    for (let i = 0; i < 4; i++) c.mini(i, { p: [-1.6 + i * 1.3, -0.2, 11.6 + (i % 2) * 0.6], ry: PI + 0.3, a: (i + Math.floor(t)) % 2 ? 'crouch' : 'idle', e: 'happy', s: i === 0 ? 0.62 : 0.95 });
    c.cam([{ t: 0, p: [3, 2.0, 5], l: [0, 0.5, 12.5], f: 48 }, { t: tP, p: [2.4, 1.8, 6.2], l: [0, 0.5, 12.5], f: 46 }]);
    if (t > tR) c.chip(960, 90, '🐟 PEIXE O ANO INTEIRO', 'blue', tR, 1e9); }
  else { const k = prog(t, tP, c.dur); ISL(c, { huts: 3, plant: lerp(0.1, 0.9, k) }); c.track('mari', [{ t: 0, p: [9.6, 0, -15.4], ry: PI, a: 'kneel', e2: 'happy' }]);
    c.cam([{ t: tP, p: [13, 2.4, -10], l: [10.5, 0.4, -18], f: 46 }, { t: c.dur, p: [12.4, 2.2, -11.2], l: [10.5, 0.4, -18], f: 46 }]); c.tag([11, 1.2, -19], '🫘 FEIJÃO · 🎃 ABÓBORA', 'green', tP + 0.3, 1e9); }
};

SHOTS.b13 = (c) => {
  const t = c.t; const tZ = c.at('O Zeca faz'), tK = c.at('o Kiko finalmente'), tM = c.at('milhares de estrelas'); c.sfx('cheer', 0.3, 0.5); c.sfx('crackle', 0, 0.4); c.sfx('twinkle', tM, 0.6);
  if (t < tK) { ISL(c, { huts: 4, fire: 1, tod: 'dusk' }); village(c, 30, { a: (i) => i % 3 ? 'dance' : 'clap', kids: true }); fireLight(c);
    c.track('zeca', [{ t: 0, p: [1.6, 0, -2.4], ry: -2.3, a: t < tZ ? 'dance' : 'carry', e2: 'happy', hold: t < tZ ? null : 'pan' }]);
    c.cam([{ t: 0, p: [-7, 3.2, 6], l: [0, 1.0, -4], f: 48 }, { t: tK, p: [-5.5, 2.6, 4], l: [0, 1.0, -4], f: 46 }]); title(c, 'FESTA NA PRAIA', 0.4, { bg: '#ff7a1a', size: 80 }); }
  else { ISL(c, { huts: 4, fire: 0.6, tod: 'night' }); c.track('kiko', [{ t: 0, p: [0, 0, 7], ry: PI, a: 'lookup', e2: t > tM ? 'surprised' : 'happy' }]);
    c.cam([{ t: tK, p: [1.2, 0.6, 9.6], l: [-2, 9, -30], f: 62 }, { t: c.dur, p: [1.0, 0.5, 9.2], l: [-2, 16, -30], f: 62 }]); }
};

// ================= PREÇO =================
SHOTS.b14 = (c) => {
  const t = c.t; const tF = c.at('o fogo vira'), tN = c.at('nunca deixar'); c.sfx('crackle', 0, 0.5); c.sfx('dramatic', tN, 0.5);
  ISL(c, { huts: 5, fire: 0.75, tod: 'night' }); fireLight(c, 1.2);
  c.track('kiko', [{ t: 0, p: [1.4, 0, -2.6], ry: -2.3, a: t < tN ? 'floor' : 'crouch', e2: 'worried' }]);
  if (t < tF) { c.cam([{ t: 0, p: [3.6, 1.6, 1.2], l: [0.3, 0.6, -3.6], f: 46 }]); c.chip(960, 90, '🚫 SEM FÓSFORO · SEM ISQUEIRO', 'red', 0.4, tF); }
  else { c.frame('kiko', { yaw: 0.5, d: 2.1, h: 0.9, f: 42, t0: tF, to: { d: 1.8 } }); if (t > tF) c.tag([0, 1.6, -4], 'O TESOURO DA ILHA', 'gold', tF + 0.2, tN); }
  if (t > tN) title(c, 'NUNCA DEIXAR O FOGO APAGAR', tN, { size: 76 });
};

SHOTS.b15 = (c) => {
  const t = c.t; const tT = c.at('Tromelin'), tM = c.at('mil setecentos'), tQ = c.at('quinze anos'); c.sfx('page', 0.2, 0.5); c.sfx('boom', tQ, 0.5);
  ISL(c, { huts: 5, fire: 0.9, tod: 'night' }); fireLight(c, 1.2);
  c.cam([{ t: 0, p: [2.4, 0.9, -1.2], l: [0, 0.6, -4], f: 46 }, { t: c.dur, p: [1.6, 0.8, -2.2], l: [0, 0.6, -4], f: 46 }]);
  if (t > tT - 0.3) c.ui(card('🏝️ ILHA DE TROMELIN · OCEANO ÍNDICO', { y: 70, size: 50, b: '#38d6ff', s: pop(t, tT - 0.3, 0.3) || 1 }));
  if (t > tM) c.chip(960, 230, 'NAUFRÁGIO EM 1761', 'white', tM, 1e9);
  if (t > tQ) big(c, '🔥 15 ANOS ACESA', tQ, { y: 420, color: '#ff7a1a', glow: 'rgba(255,122,26,.7)' });
};

SHOTS.b16 = (c) => {
  const t = c.t; const tC = c.at('Um corte'), tR = c.at('A doutora Rosa'), tH = c.at('hospital da ilha'); c.sfx('ouch', tC, 0.5); c.sfx('ding', tH, 0.5);
  ISL(c, { huts: 5, fire: 0.8, cross: t > tH - 0.3 });
  if (t < tR) { c.track('zeca', [{ t: 0, p: [2, -0.1, 11.6], ry: 0.3, a: 'hurt', e2: 'cry' }]); c.frame('zeca', { yaw: 0.2, d: 3.8, h: 1.0, f: 42, to: { d: 3.5 } }); c.chip(1440, 520, '⚠️ CORTE NO CORAL = INFECÇÃO', 'red', tC, 1e9); }
  else { c.track('rosa', [{ t: 0, p: [-7.2, 0, -5.8], ry: 0.4, a: t < tH ? 'hold' : 'point', e2: 'happy' }]); c.track('zeca', [{ t: 0, p: [-5.8, 0, -5.4], ry: -1.2, a: 'idle', e2: 'happy' }]);
    c.cam([{ t: tR, p: [-3, 2.0, -0.5], l: [-7.2, 1.2, -7], f: 46 }, { t: c.dur, p: [-3.6, 1.9, -1.4], l: [-7.2, 1.2, -7], f: 46 }]); if (t > tH) c.tag([-8, 3.6, -8], '🏥 HOSPITAL DA ILHA', 'red', tH, 1e9); }
};

// ================= CTA =================
SHOTS.b17 = (c) => {
  const t = c.t; const tI = c.at('inscrever'); c.sfx('pop', 0.3, 0.5); c.sfx('click', tI + 1.1, 0.8); c.sfx('ding', tI + 1.15, 0.6);
  ISL(c, { huts: 5 });
  c.track('mari', [{ t: 0, p: [-1, 0, 7], ry: 0.15, a: t < tI ? 'wave' : 'point', e2: 'happy' }]); c.track('kiko', [{ t: 0, p: [0.4, 0, 7.4], ry: -0.1, a: 'cheer', e2: 'happy' }]);
  c.cam([{ t: 0, p: [0, 1.5, 12.2], l: [-0.2, 1.2, 7], f: 44 }, { t: c.dur, p: [0, 1.5, 11.4], l: [-0.2, 1.2, 7], f: 44 }]);
  subBtn(c, tI);
};

// ================= O PORÉM =================
SHOTS.b18 = (c) => {
  const t = c.t; const tT = c.at('tem um porém'), tC = c.at("a caixa d'água"), tS = c.at('têm três dias'); c.sfx('dramatic', tT, 0.6); c.sfx('heartbeat', tS, 0.5);
  ISL(c, { huts: 5, storm: 0.15 });
  if (t < tC) { c.cam([{ t: 0, p: [0, 14, 22], l: [4, 0, -2], f: 46 }, { t: tC, p: [4, 9, 16], l: [6, 1, 3], f: 46 }]); title(c, 'TEM UM PORÉM', tT, { size: 100 }); }
  else { c.cam([{ t: tC, p: [11, 2.4, 9], l: [6, 1.3, 3], f: 44 }, { t: c.dur, p: [10, 2.2, 7.8], l: [6, 1.3, 3], f: 44 }]); c.tag([6, 1.9, 3], "TODA A ÁGUA DOCE", 'red', tC + 0.2, 1e9); if (t > tS) big(c, '60 PESSOAS · 3 DIAS', tS, { y: 130, size: 110, color: '#ff3b30', glow: 'rgba(255,59,48,.6)' }); }
};

SHOTS.b19 = (c) => {
  const t = c.t; const tA = c.at('as aves'), tC = c.at('chumbo'), tF = c.at('É furacão'); c.sfx('wind', tA, 0.4); c.sfx('dramatic', tF, 0.7);
  const s = t < tA ? 0 : lerp(0.15, 0.75, prog(t, tA, tF)); ISL(c, { huts: 6, storm: s, cross: true });
  if (t < tA) { village(c, 24, { walk: true, kids: true }); c.cam([{ t: 0, p: [-3.5, 4.5, 10], l: [1, 1, -6], f: 50 }]); c.chip(960, 90, '5 ANOS DE PAZ', 'green', 0.3, tA); }
  else { c.track('mari', [{ t: 0, p: [0, 0, 8.5], ry: 0, a: t < tF ? 'lookup' : 'point', e2: t < tF ? 'worried' : 'scared' }]);
    if (t < tF) c.cam([{ t: tA, p: [-1.5, 1.0, 4.5], l: [2, 7, 60], f: 54 }, { t: tF, p: [-1.2, 1.0, 5.2], l: [2, 9, 60], f: 54 }]);
    else c.frame('mari', { yaw: 0.35, d: 4.0, h: 1.0, f: 42, t0: tF });
    if (t > tF) title(c, '🌀 FURACÃO!', tF, { size: 110, top: 600 }); }
};

// ================= CLÍMAX =================
const STORM = (c, o = {}) => { ISL(c, { huts: 6, storm: 1, rain: 1, tod: 'dusk', fire: 0.4, cross: true, ...o }); c.shake(0.12); };
SHOTS.b20 = (c) => {
  const t = c.t; const tO = c.at('as ondas'), tP = c.at('cada vez mais perto'); c.sfx('wind', 0, 0.9); c.sfx('crash', tO, 0.6);
  STORM(c, { roofs: ease.io(prog(t, 0.8, tO)), surge: lerp(0.2, 0.75, prog(t, tO, c.dur)) });
  if (t < tO) c.cam([{ t: 0, p: [-2, 2.6, 2], l: [-8, 2, -10], f: 50 }, { t: tO, p: [-1.5, 2.4, 1], l: [-8, 2.6, -10], f: 50 }]);
  else { c.cam([{ t: tO, p: [0.5, 3.2, 13], l: [5.5, 0.6, 2], f: 50 }, { t: c.dur, p: [1, 2.8, 11.5], l: [5.5, 0.6, 2], f: 48 }]); c.tag([6, 2.4, 3], "CAIXA D'ÁGUA", 'red', tO + 0.2, 1e9); }
};

SHOTS.b21 = (c) => {
  const t = c.t; const tT = c.at('A tampa'), tS = c.at('água salgada'); c.sfx('footsteps', 0, 0.5); c.sfx('clang', tT, 0.6);
  STORM(c, { roofs: 1, surge: 0.7, lid: 0.9 });
  if (t < tT) { c.track('mari', [{ t: 0, p: [-1, 0, -2], ry: 0.6, a: 'run', e2: 'scared' }, { t: tT, p: [4.0, 0, 4.4], ry: 0.9, a: 'run', e2: 'scared' }]); c.track('zeca', [{ t: 0, p: [-2.2, 0, -2.8], ry: 0.6, a: 'run', e2: 'scared' }, { t: tT, p: [3.0, 0, 3.6], ry: 0.9, a: 'run', e2: 'scared' }]);
    c.cam([{ t: 0, p: [-3, 2.2, -8], l: [0, 1.0, -1], f: 50 }, { t: tT, p: [1, 2.4, -4], l: [3.8, 1.0, 3], f: 50 }]); }
  else { c.track('mari', [{ t: 0, p: MP, ry: PI / 2, a: 'panic', e2: 'scared' }]); c.track('zeca', [{ t: 0, p: ZP, ry: -PI / 2, a: 'point', e2: 'scared' }]);
    TCAM(c, tT); c.tag([6, 2.1, 3], 'TAMPA SOLTA!', 'red', tT + 0.1, tS); if (t > tS) c.chip(960, 90, 'ONDA NA CAIXA = ÁGUA SALGADA', 'red', tS, 1e9); }
};

SHOTS.b22 = (c) => {
  const t = c.t; const tB = c.at('O Kiko enfia'), tA = c.at('abraça'), tC = c.at('corre pra caverna'); c.sfx('sizzle', 0.2, 0.6); c.sfx('footsteps', tC, 0.5);
  const f = lerp(0.6, 0.12, prog(t, 0, tB));
  if (t < tC) { STORM(c, { roofs: 1, surge: 0.6, fire: f }); fireLight(c, f); c.puffs([0, 0.8, -4], 0.6, { color: 0x8a8a8a, rise: 2, op: 0.5 });
    c.track('kiko', [{ t: 0, p: [1.3, 0, -2.8], ry: -2.3, a: t < tA ? 'crouch' : 'carryidle', e2: 'scared', hold: t > tB ? 'cup' : null }]);
    c.cam([{ t: 0, p: [-1.8, 1.5, -6.8], l: [1.0, 0.7, -2.9], f: 46 }, { t: tC, p: [-1.4, 1.4, -6.4], l: [1.0, 0.7, -2.9], f: 44 }]); if (t > tB) c.tag([1.3, 1.4, -2.8], 'BRASA NO POTE', 'gold', tB + 0.3, 1e9); }
  else { STORM(c, { roofs: 1, surge: 0.6, fire: 0.1 }); c.track('kiko', [{ t: 0, p: [-9.5, 0, -16.2], ry: -1.9, a: 'run', e2: 'scared', hold: 'cup' }, { t: c.dur, p: [-14.4, 0, -18.6], ry: -2.0, a: 'run', e2: 'scared', hold: 'cup' }]);
    c.frame('kiko', { yaw: PI - 0.5, d: 3.4, h: 0.9, f: 46, t0: tC }); c.tag([-15, 3.4, -21], 'CAVERNA', 'blue', tC, 1e9); }
};

SHOTS.b23 = (c) => {
  const t = c.t; const tU = c.at('Uma volta'), tD = c.at('Duas voltas'), tO = c.at('onda maior'); c.sfx('zip', tU, 0.5); c.sfx('zip', tD, 0.5); c.sfx('riser', tO - 0.5, 0.6);
  const rope = t < tU ? 0 : t < tD ? 1 : 2; STORM(c, { roofs: 1, surge: t < tO ? 0.65 : lerp(0.65, 0.9, prog(t, tO, c.dur)), lid: t < tU ? 0.5 : 0, rope });
  c.track('mari', [{ t: 0, p: MP, ry: PI / 2, a: 'hold', e2: 'angry' }]); c.track('zeca', [{ t: 0, p: ZP, ry: -PI / 2, a: 'tinker', e2: 'angry' }]);
  if (t < tO) TCAM(c, 0);
  else { c.cam([{ t: tO, p: [3, 3.2, -3], l: [6, 1.2, 8], f: 50 }]); c.shake(0.35); }
  if (t > tU) c.chip(860, 90, rope === 1 ? '🪢 UMA VOLTA' : '🪢🪢 DUAS VOLTAS', 'gold', tU, tO); if (t > tO) title(c, 'A ONDA MAIOR', tO, { size: 90 });
};

SHOTS.b24 = (c) => {
  const t = c.t; const tJ = c.at('joga os dois'), tP = c.at('e passa'), tA = c.at('aguentou'); c.sfx('crash', 0.2, 0.9); c.sfx('splash', 0.3, 0.7); c.sfx('tada', tA, 0.5);
  const su = t < tP ? lerp(0.9, 1, prog(t, 0, tJ)) : lerp(1, 0.35, prog(t, tP, tP + 1.2)); STORM(c, { roofs: 1, surge: su, rope: 2 });
  if (t < 0.5) c.flash('#ffffff', 0.6 * (1 - t / 0.5));
  const down = t > tJ - 0.2;
  c.track('mari', [{ t: 0, p: down ? [4.0, 0, 5.2] : MP, ry: PI / 2, a: down ? 'fall' : 'hold', e2: 'scared' }]); c.track('zeca', [{ t: 0, p: down ? [8.0, 0, 5.4] : ZP, ry: -PI / 2, a: down ? 'fall' : 'tinker', e2: 'scared' }]);
  TCAM(c, 0, 1.2); if (t < tP) c.shake(0.3);
  if (t > tA) title(c, 'A TAMPA AGUENTOU!', tA, { bg: '#2fa35a', size: 90 });
};

SHOTS.b25 = (c) => {
  const t = c.t; const tM = c.at('mas a água'), tN = c.at('na caverna'), tA = c.at('ainda está acesa'); c.sfx('pad', 0, 0.5); c.sfx('twinkle', tA, 0.6);
  if (t < tN) { ISL(c, { huts: 6, roofs: 1, fire: 0, rope: 2, cross: true });
    if (t < tM) c.cam([{ t: 0, p: [-2, 3, 3], l: [-8, 1, -10], f: 50 }, { t: tM, p: [-1.5, 2.8, 2], l: [-8, 1, -10], f: 50 }]);
    else { c.cam([{ t: tM, p: [10, 2.4, 8.4], l: [6, 1.2, 3], f: 46 }]); c.tag([6, 2.5, 3], '💧 ÁGUA DOCE SALVA', 'green', tM + 0.1, 1e9); } c.chip(960, 90, '🌅 NA MANHÃ SEGUINTE', 'gold', 0.3, tN); }
  else { ISL(c, { huts: 6, roofs: 1, fire: 0 }); c.track('kiko', [{ t: 0, p: [-15, 0, -18.4], ry: 0.2, a: t < tA ? 'idle' : 'cheer', e2: 'happy', hold: 'cup' }]); c.glow([-15, 1.2, -17.6], 0xff8a2a, 10 + 4 * Math.sin(t * 9));
    c.frame('kiko', { yaw: 0.25, d: 3.6, h: 0.5, f: 42, t0: tN, to: { d: 3.3 } }); if (t > tA) title(c, 'A BRASA AINDA ESTÁ ACESA', tA, { bg: '#ff7a1a', size: 70, top: 40 }); }
};

SHOTS.b26 = (c) => {
  const t = c.t; const tS = c.at('só arranhões'), tE = c.at('E desde aquele dia'), tT = c.at("três caixas d'água"); c.sfx('ding', tS, 0.5); c.sfx('pop', tT, 0.5); c.sfx('pop', tT + 0.3, 0.5); c.sfx('pop', tT + 0.6, 0.5);
  if (t < tE) { ISL(c, { huts: 6, roofs: 1, fire: 0.6, cross: true }); c.track('rosa', [{ t: 0, p: [-1, 0, 3], ry: PI / 2, a: 'talk', e2: 'happy' }]); c.track('zeca', [{ t: 0, p: [0.3, 0, 3.2], ry: -PI / 2, a: 'idle', e2: 'happy' }]); c.track('mari', [{ t: 0, p: [-0.3, 0, 2.0], ry: 0.3, a: 'shrug', e2: 'happy' }]);
    c.cam([{ t: 0, p: [-0.6, 1.7, 8.6], l: [-0.3, 1.1, 2.8], f: 44 }, { t: tE, p: [-0.4, 1.6, 7.8], l: [-0.3, 1.1, 2.8], f: 44 }]); if (t > tS) c.chip(960, 90, '🩹 SÓ ARRANHÕES', 'green', tS, 1e9); }
  else { ISL(c, { huts: 6, tanks: 3, fire: 0.8, cross: true }); c.cam([{ t: tE, p: [0, 30, 22], l: [0, 0, -6], f: 50 }, { t: c.dur, p: [0, 26, 16], l: [0, 0, -6], f: 50 }]);
    [[6, 3], [-12, -9], [13, -15]].forEach(([x, z], i) => c.tag([x, 2.6, z], "💧 CAIXA " + (i + 1), 'blue', tT + i * 0.3, 1e9)); }
};

// ================= FINAL =================
SHOTS.b27 = (c) => {
  const t = c.t; const tC = c.at('As cabanas viram'), tK = c.at('o Kiko, já adulto'), tN = c.at('um navio'), tO = c.at('O mundo tinha'); c.sfx('pad', 0, 0.4); c.sfx('whoosh', tK, 0.5); c.sfx('siren', tN, 0.4);
  ISL(c, { huts: 6, houses: t > tC, tanks: 3, plant: 1, fire: 0.6, cross: true, ship: t > tN - 0.2 ? { x: 30, z: 120, ry: PI / 2 } : null });
  if (t < tK) { village(c, 30, { walk: true, kids: true }); c.cam([{ t: 0, p: [-2.5, 6, 11], l: [0, 1, -8], f: 50 }, { t: tK, p: [-2, 5, 8], l: [0, 1, -8], f: 50 }]); c.chip(960, 90, '⏩ OS ANOS PASSAM', 'gold', 0.3, tK); }
  else { c.track('kikov', [{ t: 0, p: [0, 0, 9.5], ry: PI, a: t < tN ? 'idle' : 'point', e2: t < tN ? 'happy' : 'surprised' }]);
    if (t < tN) c.frame('kikov', { yaw: 0.3, d: 3.4, h: 1.3, f: 42, t0: tK }); else c.cam([{ t: tN, p: [1.4, 1.8, 7], l: [20, 3, 120], f: 30 }, { t: c.dur, p: [1.4, 1.8, 7.6], l: [24, 3, 120], f: 26 }]);
    if (t > tK) c.chip(420, 520, 'KIKO, ANOS DEPOIS', 'white', tK, tN); if (t > tN) c.tag([30, 12, 120], '🚢 UM NAVIO!', 'gold', tN, 1e9); if (t > tO) c.chip(960, 200, 'O MUNDO VOLTOU A FUNCIONAR', 'blue', tO, 1e9); }
};

SHOTS.b28 = (c) => {
  const t = c.t; const tH = c.at('Mas na hora'), tF = c.at('fica'), tC = c.at('Era a casa'); c.sfx('siren', 0.2, 0.3); c.sfx('pad', tC, 0.5);
  ISL(c, { huts: 6, houses: true, tanks: 3, plant: 1, fire: 0.6, cross: true, ship: { x: 18, z: 60, ry: PI / 2 + 0.2 } });
  const R = seeded(3); for (let i = 0; i < 30; i++) { const goes = i % 3 === 0; const x = -8 + (i % 10) * 1.6, z0 = 4 + Math.floor(i / 10) * 1.4; const k = goes ? prog(t, tH, c.dur) : 0; c.mini(i, { p: [x, 0, z0 + k * 6], ry: goes && t > tH ? 0 : (t > tF && !goes ? PI : 0), a: goes && t > tH ? 'walk' : (t > tF && !goes ? 'walk' : 'idle'), e: 'happy', s: i % 5 ? 0.95 : 0.62 }); }
  if (t < tH) c.cam([{ t: 0, p: [-14, 3.5, 10], l: [0, 1, 4], f: 50 }]);
  else c.cam([{ t: tH, p: [15, 3.8, 9], l: [-1, 1, 6], f: 48 }, { t: c.dur, p: [14, 3.6, 10], l: [-1, 1, 7], f: 48 }]);
  if (t > tF) title(c, 'MUITA GENTE FICA', tF, { bg: '#2fa35a', size: 86 }); if (t > tC) c.chip(960, 270, 'A ILHA ERA A CASA DELES', 'gold', tC, 1e9);
};

SHOTS.b29 = (c) => {
  const t = c.t; const tR = c.at('Recomeçou porque'), tA = c.at('a água'), tP = c.at('o peixe'), tF = c.at('e o fogo'); c.sfx('pad', 0, 0.5); c.sfx('crackle', 0, 0.4);
  ISL(c, { huts: 6, houses: true, tanks: 3, plant: 1, fire: 1, tod: 'dusk', cross: true }); fireLight(c);
  c.crowd(Array.from({ length: 56 }, (_, i) => { const a = i * 2.399, r = 2.4 + Math.sqrt(i) * 0.75; const x = Math.cos(a) * r, z = -4 + Math.sin(a) * r; return { p: [x, 0, z], ry: Math.atan2(-x, -4 - z), c: COLS[i % COLS.length], s: i % 4 ? 0.95 : 0.65, a: 'idle' }; }));
  c.cam([{ t: 0, p: [0.6, 5, 9], l: [0, 0.8, -4], f: 50 }, { t: c.dur, p: [0.5, 4.2, 7.4], l: [0, 0.8, -4], f: 50 }]);
  [[tA, '💧 A ÁGUA', 'blue'], [tP, '🐟 O PEIXE', 'green'], [tF, '🔥 O FOGO', 'gold']].forEach(([t0, s, cl], i) => { if (t > t0) c.chip(560 + i * 400, 120, s, cl, t0, 1e9); });
  if (t > tR) c.chip(960, 230, 'APRENDERAM A DIVIDIR', 'white', tR, 1e9);
  c.state.fade = prog(t, c.dur - 0.5, c.dur);
};

SHOTS.b30 = (c) => {
  const t = c.t; const tQ = c.at('Ia querer'), tM = c.at('na Antártida'), tS = c.at('Se inscreve'), tB = c.at('Até lá'); c.sfx('whoosh', tM, 0.5); c.sfx('click', tS + 1.1, 0.8); c.sfx('ding', tS + 1.15, 0.6); c.sfx('tada', tB, 0.6);
  c.env('outro');
  const w = t > tB;
  [['mari', -3.0, 0.3], ['rosa', -1.0, 0.1], ['zeca', 1.0, -0.1], ['kiko', 3.0, -0.3]].forEach(([n, x, ry]) => c.track(n, [{ t: 0, p: [x, 0, 5.1], ry, a: w ? 'wave' : 'idle', e2: 'happy' }]));
  c.cam([{ t: 0, p: [0, 1.9, 12.4], l: [0, 2.0, 5], f: 42 }, { t: c.dur, p: [0, 2.0, 11.4], l: [0, 2.0, 5], f: 42 }]);
  if (t > tQ && t < tM - 1.5) { const a = clamp((t - tQ) / 0.4); c.ui(`<div class="abs" style="left:0;top:130px;width:1920px;text-align:center;font-weight:900;font-size:60px;color:#fff;opacity:${a};text-shadow:0 5px 0 #000">VOLTAR OU FICAR?</div>`);
    ['VOLTAR 🏙️', 'FICAR 🏝️'].forEach((l, i) => { const s = pop(t, tQ + 0.5 + i * 0.3, 0.25); c.ui(`<div class="abs" style="left:${560 + i * 440}px;top:240px;width:360px;padding:20px 0;text-align:center;border-radius:24px;background:${['#38d6ff', '#ffb02e'][i]};color:#111;font-weight:900;font-size:60px;transform:scale(${s})">${l}</div>`); }); }
  if (t > tM - 1.4 && t < tS - 0.1) { c.ui(`<div class="abs" style="left:0;top:120px;width:1920px;text-align:center;font-weight:900;font-size:60px;color:#fff;text-shadow:0 5px 0 #000">PRÓXIMO EPISÓDIO</div>`); c.ui(bigNum('NA ANTÁRTIDA?', 960, 270, { size: 130, color: '#ffd21f', glow: 'rgba(255,210,31,.6)', s: pop(t, tM - 1.4, 0.3) || 1 })); }
  if (t < tB) subBtn(c, tS);
  if (t > tB) c.ui(bigNum('ATÉ LÁ!', 960, 250, { size: 190, color: '#ffd21f', glow: 'rgba(255,210,31,.7)', s: pop(t, tB, 0.3) || 1 }));
  c.state.fade = prog(t, c.dur - 1.0, c.dur);
};
