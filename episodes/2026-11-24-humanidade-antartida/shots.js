// LONGO: "E se a humanidade tivesse que recomeçar na Antártida?" — palito, 1920x1080.
// Cenário novo: 'ice' (engine/envs6.js). Também: seahab {night} (refeitório), shipfarm (estufa), gen (sala do gerador), street, void, outro.
import { clamp, lerp, ease, PI, prog, stamp, bigNum, pop, seeded, subBtn } from '/engine/kit.js';
export const SHOTS = {};
const P0 = { num: null, flag: false };
export const CAST = {
  ana: { style: 'palito', ...P0, shirt: 0xd62828, trim: 0xffffff, shorts: 0x1d2a44, hair: 'lia', cap: 0xffffff, scale: 0.96 },
  tiao: { style: 'palito', ...P0, shirt: 0xff7a1a, trim: 0x2a2e35, shorts: 0x2a2e35, cap: 0x2a2e35 },
  clara: { style: 'palito', ...P0, shirt: 0xf4f4f4, trim: 0x2a8ad6, shorts: 0x2a8ad6, hair: 'lia', scale: 0.96 },
  nico: { style: 'palito', ...P0, shirt: 0xffd21f, trim: 0x2a6ad6, shorts: 0x2a6ad6, cap: 0x2a6ad6, scale: 0.68 },
  nicov: { style: 'palito', ...P0, shirt: 0xffd21f, trim: 0x2a6ad6, shorts: 0x2a6ad6, cap: 0x2a6ad6, scale: 1.0 },
};
const COLS = [0xd62828, 0xff7a1a, 0x2a6ad6, 0xffd21f, 0x2fa35a, 0xf4f4f4, 0x8a3ad6, 0x0aa6b8];
const title = (c, txt, t0, o = {}) => { if (c.t < t0) return; const s = pop(c.t, t0, 0.3) || 1; c.ui(`<div class="abs" style="left:0;right:0;top:${o.top ?? 70}px;text-align:center;transform:scale(${s})"><div style="display:inline-block;background:${o.bg ?? '#d62828'};border:7px solid #fff;border-radius:22px;padding:6px 60px;font-weight:900;font-size:${o.size ?? 96}px;color:${o.color ?? '#fff'};transform:rotate(-2deg);box-shadow:0 14px 0 rgba(0,0,0,.45)">${txt}</div></div>`); };
const card = (html, o = {}) => `<div class="abs" style="left:${o.x ?? 960}px;top:${o.y ?? 150}px;transform:translate(-50%,0) scale(${o.s ?? 1});opacity:${o.a ?? 1};background:rgba(8,12,28,.86);border:5px solid ${o.b ?? '#38d6ff'};border-radius:26px;padding:22px 44px;color:#fff;font-weight:900;font-size:${o.size ?? 50}px;text-align:center;white-space:nowrap">${html}</div>`;
const big = (c, txt, t0, o = {}) => { if (c.t < t0) return; c.ui(bigNum(txt, o.x ?? 960, o.y ?? 250, { size: o.size ?? 130, color: o.color ?? '#ffd21f', glow: o.glow ?? 'rgba(255,210,31,.6)', s: pop(c.t, t0, 0.3) || 1 })); };
const ICE = (c, p = {}) => c.env('ice', p);
const frost = (c, k = 1) => c.ui(`<div class="abs" style="left:0;top:0;width:1920px;height:1080px;box-shadow:inset 0 0 220px 90px rgba(220,240,255,${0.55 * k});pointer-events:none"></div>`);
const thermo = (c, v, o = {}) => c.ui(`<div class="abs" style="left:${o.x ?? 1480}px;top:${o.y ?? 120}px;padding:16px 34px;border-radius:24px;background:rgba(8,12,28,.86);border:5px solid ${o.b ?? '#38d6ff'};color:${o.color ?? '#9fe0ff'};font-weight:900;font-size:${o.size ?? 64}px;white-space:nowrap">🌡️ ${v}</div>`);
// pontos importantes do cenário 'ice'
const STAIR = [2.4, 0, -8.2], GDOOR = [20.6, 0, -12], VENT = [25, 1.6, -9.95];
const RA = [3.6, -8.6], RB = [21.2, -10.8];
const onRope = (u, off = 0.55) => { const x = lerp(RA[0], RB[0], u), z = lerp(RA[1], RB[1], u); return [x, 0, z + off]; };
const ROPE_RY = Math.atan2(RB[0] - RA[0], RB[1] - RA[1]);
// gente na frente da estação
const camp = (c, n, o = {}) => { const R = seeded(o.seed || 5); const L = []; for (let i = 0; i < n; i++) { const x = -12 + R() * 22, z = -7 + R() * 9; const walk = o.walk && i % 3 === 0; const ph = c.t * 0.25 + i; const wx = walk ? x + Math.sin(ph) * 1.5 : x;
  c.mini(i, { p: [wx, 0, z], ry: walk ? (Math.cos(ph) > 0 ? PI / 2 : -PI / 2) : (o.ry ?? (R() - 0.5) * 2), a: walk ? 'walk' : (o.a || 'idle'), e: o.e || 'happy', s: (o.kids && i % 4 === 0) ? 0.62 : 0.95 }); } };
// refeitório (seahab): multidão abraçada (pinguins humanos), centro (0.6, 0, 1.0)
const HUD = [0.4, 0, 0.6];
const huddle = (c, n, k = 1, rot = 0) => c.crowd(Array.from({ length: n }, (_, i) => { const a = i * 2.39996 + rot * (i % 2 ? 1 : -1), r = (0.32 + Math.sqrt(i) * 0.36) * lerp(2.2, 1, k); const x = HUD[0] + Math.cos(a) * r * 1.5, z = HUD[2] + Math.sin(a) * r * 0.8; return { p: [x, 0, z], ry: Math.atan2(HUD[0] - x, HUD[2] - z), c: COLS[i % COLS.length], s: i % 5 ? 0.9 : 0.62, a: 'idle' }; }));
const HAB = (c, p = {}) => c.env('seahab', { night: true, ...p });

// ================= GANCHO =================
SHOTS.b01 = (c) => {
  const t = c.t; const tN = c.at('Não tem árvore'), tE = c.at('E essa estação'), tU = c.at('única casa'); c.sfx('wind', 0, 0.5); c.sfx('riser', 0.2, 0.4); c.sfx('boom', tU, 0.8);
  ICE(c, { snow: 0.2, exhaust: 0.6 });
  if (t < tN) { c.cam([{ t: 0, p: [-60, 40, 90], l: [0, 0, -14], f: 46 }, { t: tN, p: [-46, 30, 66], l: [0, 0, -14], f: 46 }]); c.chip(960, 90, 'O LUGAR MAIS FRIO DA TERRA', 'blue', 0.6, tN); }
  else if (t < tE) { c.cam([{ t: tN, p: [40, 18, 40], l: [0, 3, -14], f: 46 }, { t: tE, p: [34, 15, 32], l: [0, 3, -14], f: 46 }]);
    ['🌲 SEM ÁRVORE', '🏙️ SEM CIDADE', '📍 VIZINHO A 1.000 KM'].forEach((s, i) => { const t0 = tN + i * 0.9; if (t > t0) c.ui(card(s, { x: 400 + i * 560, y: 90, size: 40, b: '#ff3b30', s: pop(t, t0, 0.25) || 1 })); }); }
  else { camp(c, 36, { walk: true, kids: true }); c.cam([{ t: tE, p: [-7, 4.5, 12], l: [0, 2.6, -10], f: 50 }, { t: c.dur, p: [-5.5, 4, 9.5], l: [0, 2.6, -10], f: 50 }]); if (t > tU) title(c, 'A ÚNICA CASA DE 120 PESSOAS', tU + 0.1, { size: 78, bg: '#2a6ad6' }); }
};

SHOTS.b02 = (c) => {
  const t = c.t; const tS = c.at('faz dois meses'), tN = c.at('Lá fora'), tG = c.at('gerador'), tP = c.at('acabou de parar'); c.sfx('wind', 0, 0.9); c.sfx('engine', 0, 0.3); c.sfx('blackout', tP, 0.8);
  const off = t > tP; ICE(c, { tod: 'night', storm: t < tN ? 0.4 : 1, power: off ? 0.05 : 1, exhaust: off ? 0 : 1, flick: t > tP - 0.6 && !off, clog: t > tG ? 0.8 : 0.4 });
  if (t < tN) { c.cam([{ t: 0, p: [-20, 10, 26], l: [0, 3, -12], f: 50 }, { t: tN, p: [-16, 8, 20], l: [0, 3, -12], f: 50 }]); c.chip(960, 90, '🌑 2 MESES SEM SOL', 'blue', tS, tN); }
  else if (t < tG) { c.shake(0.15); c.cam([{ t: tN, p: [-4, 2.2, 6], l: [1, 2.8, -10], f: 50 }, { t: tG, p: [-3, 2.0, 4.5], l: [1, 2.8, -10], f: 50 }]); c.chip(960, 90, '💨 NEVASCA: 150 KM/H', 'red', tN + 0.2, tG); }
  else { c.shake(0.12); c.cam([{ t: tG, p: [30, 2.6, -2], l: [24, 1.6, -12], f: 46 }, { t: c.dur, p: [28.5, 2.4, -4], l: [24, 1.6, -12], f: 46 }]); c.tag([24, 3.9, -12], 'GERADOR', 'gold', tG, tP); if (off) title(c, 'O GERADOR PAROU', tP, { size: 92 }); }
  frost(c, 0.6);
};

SHOTS.b03 = (c) => {
  const t = c.t; const tA = c.at('aquecimento'), tC = c.at('congelador'), tV = c.at('voltar três'); c.sfx('heartbeat', 0, 0.6); c.sfx('whoosh', tV, 0.7);
  HAB(c, { power: 0.06, alarm: 0.7, screen: 'red' }); c.torch([2.5, 2.2, 2.5], [0, 1.2, -1], 30);
  c.track('ana', [{ t: 0, p: [0.4, 0, 0.6], ry: 0.3, a: t < tV ? 'panic' : 'think', e2: 'scared', hold: 'light' }]);
  c.frame('ana', { yaw: 0.25, d: 3.4, h: 1.2, f: 44, to: { d: 2.9 } });
  if (t > tA) thermo(c, `${Math.round(lerp(18, 9, prog(t, tA, tV)))} °C`, { b: '#ff3b30', color: '#fff' });
  if (t > tC && t < tV) c.chip(960, 90, '🧊 VIRA UM CONGELADOR', 'red', tC, tV);
  if (t > tV) c.chip(420, 520, '⏪ 3 ANOS ANTES', 'gold', tV, 1e9);
  frost(c, 0.4 + 0.4 * prog(t, 0, c.dur));
};

// ================= COMEÇO =================
SHOTS.b04 = (c) => {
  const t = c.t; const tA = c.at('Ano após ano'), tV = c.at('ficam vazias'); c.sfx('riser', 0.2, 0.4); c.sfx('sizzle', 0.5, 0.4); c.sfx('dramatic', tV, 0.6);
  c.env('street', { tod: 'day', cars: false });
  if (t < tA) c.cam([{ t: 0, p: [0, 3, 14], l: [0, 4, -10], f: 52 }, { t: tA, p: [0, 3.5, 11], l: [0, 4, -10], f: 52 }]);
  else c.cam([{ t: tA, p: [10, 14, 22], l: [0, 2, -6], f: 50 }, { t: c.dur, p: [8, 12, 18], l: [0, 2, -6], f: 50 }]);
  c.ui(`<div class="abs" style="left:0;top:0;width:1920px;height:1080px;background:radial-gradient(ellipse at 50% 0%,rgba(255,240,180,.55),rgba(255,110,20,.35) 60%,rgba(160,40,0,.35));mix-blend-mode:multiply"></div><div class="abs" style="left:0;top:0;width:1920px;height:1080px;background:rgba(255,150,40,${0.12 + 0.05 * Math.sin(t * 3)})"></div>`);
  thermo(c, `${Math.round(lerp(44, 52, prog(t, 0.5, tV)))} °C`, { b: '#ff3b30', color: '#fff', x: 1520 });
  c.chip(960, 90, '☀️ UM VERÃO QUE NÃO ACABA', 'gold', 0.6, tV);
  if (t > tV) title(c, 'CIDADES VAZIAS', tV, { bg: '#111', size: 96 });
};

SHOTS.b05 = (c) => {
  const t = c.t; const tA = c.at('Antártida'), tE = c.at('Ela é enorme'), tB = c.at('uma vez e meia'); c.sfx('whoosh', tA, 0.6); c.sfx('pop', tE + 0.6, 0.5); c.sfx('pop', tB, 0.6);
  if (t < tE) { ICE(c, { snow: 0.3 }); c.cam([{ t: 0, p: [0, 70, 160], l: [0, 10, -60], f: 50 }, { t: tE, p: [0, 55, 120], l: [0, 10, -60], f: 50 }]); if (t > tA) title(c, 'A ANTÁRTIDA', tA, { bg: '#2a6ad6' }); thermo(c, '−20 °C', { x: 1560 }); return; }
  c.env('void'); c.camSet([0, 1.5, 8], [0, 1.5, 0], 50);
  const k1 = ease.oo(prog(t, tE + 0.4, tE + 1.4)), k2 = ease.oo(prog(t, tB - 0.2, tB + 0.8));
  c.ui(`<div class="abs" style="left:0;top:0;width:1920px;height:1080px;background:linear-gradient(#0b2a4a,#061424)"></div>
    <div class="abs" style="left:260px;top:330px;font-weight:900;font-size:56px;color:#fff">ANTÁRTIDA</div><div class="abs" style="left:260px;top:410px;height:150px;width:${1400 * k1}px;border-radius:20px;background:linear-gradient(90deg,#dff2ff,#9fd6ff)"></div>
    <div class="abs" style="left:${260 + 1400 * k1 - 20}px;top:440px;transform:translateX(-100%);font-weight:900;font-size:64px;color:#0b2a4a;white-space:nowrap;opacity:${k1}">14 MI km²</div>
    <div class="abs" style="left:260px;top:640px;font-weight:900;font-size:56px;color:#fff;opacity:${k2 > 0 ? 1 : 0}">BRASIL</div><div class="abs" style="left:260px;top:720px;height:150px;width:${850 * k2}px;border-radius:20px;background:linear-gradient(90deg,#2fa35a,#ffd21f)"></div>
    <div class="abs" style="left:${260 + 850 * k2 - 20}px;top:750px;transform:translateX(-100%);font-weight:900;font-size:64px;color:#0b2a4a;white-space:nowrap;opacity:${k2}">8,5 MI km²</div>`);
  if (t > tB + 0.6) c.chip(960, 160, 'MAIS DE 1,5× O BRASIL', 'gold', tB + 0.6, 1e9);
};

SHOTS.b06 = (c) => {
  const t = c.t; const tM = c.at('Mas um navio'), tA = c.at('Estação Aurora'); c.sfx('waves', tM, 0.5); c.sfx('tada', tA, 0.5);
  if (t < tM) { ICE(c, { power: 1 }); camp(c, 8, {}); c.cam([{ t: 0, p: [14, 5, 8], l: [0, 3, -12], f: 48 }, { t: tM, p: [12, 4.5, 6], l: [0, 3, -12], f: 48 }]);
    if (t > 0.3) c.ui(card('VERÃO: ALGUNS MILHARES · INVERNO: ~1.000', { y: 80, size: 44 })); return; }
  const u = prog(t, tM, c.dur); ICE(c, { ship: { x: lerp(-60, -22, ease.o(u)), z: 46, ry: PI / 2 } });
  if (t < tA) c.cam([{ t: tM, p: [30, 12, 50], l: [-24, 2, 46], f: 46 }, { t: tA, p: [24, 10, 44], l: [-24, 2, 46], f: 46 }]);
  else { const R = seeded(3); c.crowd(Array.from({ length: 60 }, (_, i) => { const lane = (i % 6) - 2.5, row = Math.floor(i / 6); const z = 20 - row * 2.4 - (t - tA) * 1.3; return { p: [lane * 1.1 + (R() - 0.5) * 0.4, 0, z], ry: PI, c: COLS[i % COLS.length], s: i % 5 ? 0.95 : 0.62, a: 'walk' }; }));
    c.cam([{ t: tA, p: [-14, 8, 26], l: [1, 2, -6], f: 50 }, { t: c.dur, p: [-12, 7, 22], l: [1, 2, -6], f: 50 }]); title(c, 'ESTAÇÃO AURORA', tA, { bg: '#d62828', size: 84 }); }
};

SHOTS.b07 = (c) => {
  const t = c.t; const tT = c.at('O Tião'), tC = c.at('A doutora Clara'), tN = c.at('E o Nico'), tV = c.at('neve'); c.sfx('pop', 0.3, 0.5); c.sfx('pop', tT, 0.5); c.sfx('pop', tC, 0.5); c.sfx('pop', tN, 0.5); c.sfx('twinkle', tV, 0.5);
  const tag = (txt, sub, col) => c.ui(`<div class="abs" style="left:120px;top:760px;padding:16px 40px;border-radius:24px;background:rgba(8,12,28,.86);border:5px solid ${col};color:#fff;font-weight:900;font-size:60px">${txt}<div style="font-size:36px;color:${col}">${sub}</div></div>`);
  if (t < tT) { ICE(c, {}); c.track('ana', [{ t: 0, p: [-3, 0, -3], ry: 0.4, a: 'hold', e2: 'happy', hold: 'book' }]); c.frame('ana', { yaw: 0.3, d: 3.2, h: 1.1, f: 44, to: { d: 2.8 } }); tag('ANA, 30', '🧊 ESTUDA O GELO', '#ff6b6b'); }
  else if (t < tC) { ICE(c, { exhaust: 1 }); c.track('tiao', [{ t: 0, p: [20, 0, -8.6], ry: 0.4, a: 'tinker', e2: 'happy', hold: 'wrench' }]); c.frame('tiao', { yaw: 0.35, d: 3.2, h: 1.2, f: 44, t0: tT, to: { d: 2.8 } }); tag('TIÃO', '🔧 CONVERSA COM MOTOR', '#ff9a3a'); }
  else if (t < tN) { HAB(c, { power: 1, screen: 'ok' }); c.track('clara', [{ t: 0, p: [0.5, 0, 1.0], ry: 0.2, a: 'idle', e2: 'happy', hold: 'bandage' }]); c.frame('clara', { yaw: 0.25, d: 3.0, h: 1.2, f: 44, t0: tC, to: { d: 2.6 } }); tag('DRA. CLARA', '🩺 MÉDICA', '#38d6ff'); }
  else { ICE(c, { snow: 0.7 }); c.track('nico', [{ t: 0, p: [-8, 0, 12], ry: 0.3, a: t < tV ? 'lookup' : 'cheer', e2: 'happy' }]); c.frame('nico', { yaw: 0.3, d: 2.6, h: 0.75, up: 0.3, f: 44, t0: tN, to: { d: 2.2 } }); tag('NICO, 11', '❄️ NUNCA TINHA VISTO NEVE', '#ffd21f'); }
};

SHOTS.b08 = (c) => {
  const t = c.t; const tR = c.at('ninguém sai'), tS = c.at('sensação'), tP = c.at('em poucos minutos'); c.sfx('wind', 0, 0.7); c.sfx('ding', tR, 0.5); c.sfx('dramatic', tP, 0.5);
  ICE(c, { storm: 0.55, tod: 'dusk' });
  c.track('ana', [{ t: 0, p: [1.2, 0, -5], ry: -0.2, a: t < tR ? 'point' : 'shout', e2: 'angry' }]); c.track('nico', [{ t: 0, p: [-0.2, 0, -4.4], ry: 0.6, a: 'idle', e2: 'worried' }]);
  c.cam([{ t: 0, p: [0.8, 1.5, 0.8], l: [0.5, 1.0, -5], f: 46 }, { t: c.dur, p: [0.8, 1.4, -0.2], l: [0.5, 1.0, -5], f: 46 }]); c.shake(0.08);
  if (t > tR) c.ui(card('☝️ REGRA Nº 1: NINGUÉM SAI SOZINHO', { y: 70, b: '#ffd21f', s: pop(t, tR, 0.25) || 1 }));
  if (t > tS) thermo(c, '−50 °C', { b: '#ff3b30', color: '#fff', y: 230, x: 1500 });
  if (t > tP) c.chip(960, 200, '⏱️ PELE CONGELA EM MINUTOS', 'red', tP, 1e9);
  frost(c, 0.7);
};

// ================= VANTAGENS =================
SHOTS.b09 = (c) => {
  const t = c.t; const tN = c.at('noventa'), tS = c.at('setenta'), tD = c.at('É só derreter'); c.sfx('twinkle', 0.3, 0.4); c.sfx('pop', tN, 0.5); c.sfx('pop', tS, 0.6); c.sfx('water', tD, 0.5);
  if (t < tD) { ICE(c, {}); c.cam([{ t: 0, p: [0, 30, 120], l: [0, 20, -130], f: 50 }, { t: tD, p: [0, 24, 96], l: [0, 20, -130], f: 50 }]);
    if (t > tN) big(c, '90% DO GELO', tN, { y: 230, color: '#dff2ff', glow: 'rgba(120,200,255,.7)' }); if (t > tS) big(c, '70% DA ÁGUA DOCE', tS, { y: 420, size: 110, color: '#5aff8a', glow: 'rgba(60,255,120,.6)' }); return; }
  ICE(c, {}); c.track('ana', [{ t: 0, p: [-2, 0, -2], ry: 0.5, a: 'hold', e2: 'happy', hold: 'can' }]); c.frame('ana', { yaw: 0.2, d: 3.4, h: 1.0, f: 44, t0: tD, to: { d: 2.6 } }); c.chip(420, 300, 'GELO 🧊 → 💧 ÁGUA', 'blue', tD, 1e9);
};

SHOTS.b10 = (c) => {
  const t = c.t; const tE = c.at('uma estufa'), tK = c.at('duzentos e setenta'), tL = c.at('luz de LED'); c.sfx('pop', tE, 0.5); c.sfx('tada', tK, 0.5);
  c.env('shipfarm', { plant: 1 });
  c.cam([{ t: 0, p: [0, 2.2, 14], l: [0, 1.2, -6], f: 50 }, { t: c.dur, p: [0, 1.9, 8], l: [0, 1.2, -6], f: 50 }]);
  if (t > tE) c.ui(card('NEUMAYER III (ALEMANHA) · 2018', { y: 70, size: 44 }));
  if (t > tK) big(c, '≈ 270 kg DE VERDURA', tK, { y: 300, size: 110, color: '#5aff8a', glow: 'rgba(60,255,120,.6)' });
  if (t > tL) c.chip(960, 200, 'SEM TERRA · SEM SOL · SÓ ÁGUA E LED', 'green', tL, 1e9);
};

SHOTS.b11 = (c) => {
  const t = c.t; const tV = c.at('E no verão'), tP = c.at('Os painéis'), tE = c.at('a estufa fica'); c.sfx('twinkle', tV, 0.4); c.sfx('pop', tE, 0.4);
  if (t < tV) { c.env('shipfarm', { plant: 0.6 }); c.track('clara', [{ t: 0, p: [0, 0, 2], ry: PI - 0.4, a: 'tinker', e2: 'happy' }]); c.frame('clara', { yaw: PI * 0 + 0.4, d: 3, h: 1.2, f: 46, to: { d: 2.6 } }); return; }
  if (t < tE) { ICE(c, { tod: 'dusk', power: 0.3 }); c.cam([{ t: tV, p: [-24, 5, 7], l: [-31, 1, -16], f: 50 }, { t: tE, p: [-25, 4.4, 5], l: [-31, 1, -16], f: 50 }]);
    const h = (t - tV) * 3; c.chip(960, 90, `☀️ ${String(Math.floor(h) % 24).padStart(2, '0')}:00 — E O SOL NÃO SE PÕE`, 'gold', tV, tE); if (t > tP) c.chip(960, 200, 'PAINÉIS: 24 HORAS POR DIA', 'gold', tP, tE); return; }
  c.env('shipfarm', { plant: 1 }); c.track('nico', [{ t: 0, p: [0.6, 0, 3], ry: PI + 0.4, a: 'cheer', e2: 'happy' }]); c.track('clara', [{ t: 0, p: [-0.7, 0, 2.6], ry: PI - 0.3, a: 'idle', e2: 'happy', hold: 'flower' }]);
  c.cam([{ t: tE, p: [0.2, 1.5, -1], l: [0, 1.0, 3], f: 48 }, { t: c.dur, p: [0.2, 1.5, -0.2], l: [0, 1.0, 3], f: 48 }]);
};

SHOTS.b12 = (c) => {
  const t = c.t; const tP = c.at('colônias'), tN = c.at('E o Nico'), tD = c.at('Ele dá nome'); c.sfx('waves', 0, 0.4); c.sfx('laugh', tD + 0.5, 0.4);
  ICE(c, { peng: 50 });
  if (t < tN) { c.cam([{ t: 0, p: [-30, 8, 40], l: [-12, 0.5, 20], f: 46 }, { t: tN, p: [-26, 6, 34], l: [-12, 0.5, 20], f: 46 }]); if (t > tP) c.chip(960, 90, '🐟 PEIXE · 🦐 KRILL · 🦭 FOCAS · 🐧 PINGUINS', 'blue', tP, tN); return; }
  c.track('nico', [{ t: 0, p: [-9, 0, 11.6], ry: PI - 0.5, a: t < tD ? 'point' : 'talk', e2: 'happy' }]);
  c.cam([{ t: tN, p: [-6.2, 1.4, 9.0], l: [-11, 0.7, 15.5], f: 48 }, { t: c.dur, p: [-6.6, 1.3, 9.8], l: [-11, 0.7, 15.5], f: 48 }]);
  [['PIPOCA', [-11.5, 1.4, 16]], ['BOLINHA', [-8.5, 1.4, 17.5]], ['SEU ZÉ', [-13.6, 1.4, 18.4]]].forEach(([n, v], i) => c.tag(v, n, 'white', tD + 0.2 + i * 0.6, 1e9));
  title(c, 'GUIA DOS PINGUINS', tN + 0.2, { bg: '#2a6ad6', size: 70 });
};

SHOTS.b13 = (c) => {
  const t = c.t; const tS = c.at('Sopa quente'), tL = c.at('E lá fora'), tA = c.at('aurora austral'); c.sfx('laugh', 0.3, 0.5); c.sfx('cheer', 0.8, 0.4); c.sfx('pad', tL, 0.5); c.sfx('twinkle', tA, 0.6);
  if (t < tL) { HAB(c, { power: 1, screen: 'ok' }); const R = seeded(2);
    for (let i = 0; i < 8; i++) { const x = -3.5 + (i % 4) * 0.75, z = i < 4 ? 0.1 : 1.7; c.mini(i, { p: [x, 0.2, z], ry: i < 4 ? 0 : PI, a: i % 2 ? 'sit' : 'floorEat', e: 'happy', s: 0.92 }); } for (let i = 8; i < 13; i++) c.mini(i, { p: [-5 + (i - 8) * 1.0, 0, -2.4], ry: 0.3, a: 'cheer', e: 'happy', s: i % 2 ? 0.92 : 0.62 });
    c.track('nico', [{ t: 0, p: [0.6, 0, 0.6], ry: 0.2, a: 'dance', e2: 'happy' }]);
    c.cam([{ t: 0, p: [4.6, 2.4, 3.0], l: [-1.5, 1, -0.3], f: 50 }, { t: tL, p: [4.2, 2.2, 2.6], l: [-1.5, 1, -0.3], f: 50 }]); title(c, '1º ANO: FESTA!', 0.3, { bg: '#2fa35a', size: 80 }); if (t > tS) c.chip(960, 200, '🍲 SOPA QUENTE · 🥗 SALADA DA ESTUFA', 'gold', tS, 1e9); return; }
  ICE(c, { tod: 'night', aurora: true, stars: true, power: 1 }); camp(c, 24, { a: 'lookup', ry: PI, e: 'surprised', kids: true });
  c.cam([{ t: tL, p: [0, 1.2, 9], l: [0, 14, -60], f: 56 }, { t: c.dur, p: [0, 1.0, 7], l: [0, 18, -60], f: 56 }]);
  if (t > tA) title(c, 'AURORA AUSTRAL', tA, { bg: '#0aa6b8', size: 84 });
};

// ================= PREÇO =================
SHOTS.b14 = (c) => {
  const t = c.t; const tF = c.at('o frio despenca'), tR = c.at('O recorde'), tO = c.at('oitenta e nove'), tV = c.at('Vostok'); c.sfx('wind', 0, 0.8); c.sfx('dramatic', tO, 0.6);
  if (t < tR) { const k = prog(t, 0, tR); ICE(c, { tod: k < 0.4 ? 'dusk' : 'night', storm: 0.3 * k, power: 1 }); c.cam([{ t: 0, p: [26, 6, 14], l: [0, 3, -14], f: 46 }, { t: tR, p: [22, 5, 10], l: [0, 3, -14], f: 46 }]);
    if (t > tF) thermo(c, `${Math.round(lerp(-20, -60, prog(t, tF, tR)))} °C`, { b: '#38d6ff' }); return; }
  ICE(c, { tod: 'night', storm: 0.5, power: 0.6, panels: true }); c.cam([{ t: tR, p: [0, 40, 100], l: [0, 10, -120], f: 46 }, { t: c.dur, p: [0, 34, 80], l: [0, 10, -120], f: 46 }]);
  if (t > tO) big(c, '−89,2 °C', tO, { y: 330, size: 190, color: '#9fe0ff', glow: 'rgba(120,200,255,.8)' });
  if (t > tV) c.chip(960, 520, '📍 ESTAÇÃO VOSTOK (RÚSSIA) · 1983', 'white', tV, 1e9);
  frost(c, 0.8);
};

SHOTS.b15 = (c) => {
  const t = c.t; const tI = c.at('insônia'), tC = c.at('Então a doutora'), tR = c.at('regra da luz'); c.sfx('tick', 0, 0.3); c.sfx('ding', tR, 0.5);
  if (t < tC) { HAB(c, { power: 0.25 }); c.track('nico', [{ t: 0, p: [4.6, 0, -2.0], ry: 0.4, a: 'tired', e2: 'sad' }]); c.cam([{ t: 0, p: [2.2, 1.6, 0.8], l: [4.8, 0.8, -2.2], f: 48 }, { t: tC, p: [2.6, 1.5, 0.4], l: [4.8, 0.8, -2.2], f: 48 }]);
    if (t > tI) c.chip(960, 90, '😴 INSÔNIA · 😞 TRISTEZA', 'blue', tI, tC); return; }
  HAB(c, { power: 1, sun: 1, screen: 'ok' }); const R = seeded(4);
  for (let i = 0; i < 8; i++) { const x = -3.5 + (i % 4) * 0.75, z = i < 4 ? 0.1 : 1.7; c.mini(i, { p: [x, 0.2, z], ry: i < 4 ? 0 : PI, a: 'sit', e: 'happy', s: 0.92 }); }
  c.track('clara', [{ t: 0, p: [0.2, 0, 1.6], ry: -1.1, a: t < tR ? 'talk' : 'pointup', e2: 'happy' }]);
  c.cam([{ t: tC, p: [3.4, 1.9, 3.1], l: [-1.8, 1.0, 0.6], f: 50 }, { t: c.dur, p: [3.0, 1.8, 2.8], l: [-1.8, 1.0, 0.6], f: 50 }]);
  if (t > tR) title(c, '☀️ REGRA DA LUZ', tR, { bg: '#ffb02e', color: '#111', size: 84 });
};

SHOTS.b16 = (c) => {
  const t = c.t; const tG = c.at('o gerador'), tE = c.at('Ele esquenta'), tB = c.at('bebê'); c.sfx('engine', 0, 0.5); c.sfx('aww', tB, 0.4);
  c.env('gen', { power: 1, shake: 0.5 });
  c.track('tiao', [{ t: 0, p: [-1.0, 0, 0.2], ry: 0.3, a: t < tB ? 'tinker' : 'hug', e2: 'happy', hold: t < tB ? 'wrench' : null }]);
  c.cam([{ t: 0, p: [3.4, 2.2, 4.2], l: [-0.4, 1.3, -1.6], f: 48 }, { t: c.dur, p: [2.8, 2.0, 3.4], l: [-0.4, 1.3, -1.6], f: 48 }]);
  if (t > tE) ['🔥 CALOR', '💧 ÁGUA', '🌱 ESTUFA'].forEach((s, i) => { const t0 = tE + i * 0.8; if (t > t0) c.ui(card(s, { x: 480 + i * 480, y: 70, size: 44, b: '#ffb02e', s: pop(t, t0, 0.25) || 1 })); });
  if (t > tB) c.tag([-0.4, 3.1, -2.4], '👶 O "BEBÊ" DO TIÃO', 'gold', tB, 1e9);
};

SHOTS.b17 = (c) => {
  const t = c.t; const tI = c.at('inscrever'); c.sfx('pop', 0.3, 0.5); c.sfx('click', tI + 1.1, 0.8); c.sfx('ding', tI + 1.15, 0.6);
  ICE(c, { snow: 0.3 });
  c.track('ana', [{ t: 0, p: [-1, 0, 2], ry: 0.15, a: t < tI ? 'wave' : 'point', e2: 'happy' }]); c.track('nico', [{ t: 0, p: [0.4, 0, 2.4], ry: -0.1, a: 'cheer', e2: 'happy' }]);
  c.cam([{ t: 0, p: [0, 1.5, 7.2], l: [-0.2, 1.2, 2], f: 44 }, { t: c.dur, p: [0, 1.5, 6.4], l: [-0.2, 1.2, 2], f: 44 }]);
  subBtn(c, tI);
};

// ================= O PORÉM =================
SHOTS.b18 = (c) => {
  const t = c.t; const tP = c.at('tem um porém'), tG = c.at('O gerador fica'), tI = c.at('incêndio'), tC = c.at('corda guia'); c.sfx('dramatic', tP, 0.7); c.sfx('pop', tG + 0.5, 0.4); c.sfx('pop', tC, 0.5);
  ICE(c, { exhaust: 1 });
  if (t < tG) { c.cam([{ t: 0, p: [6, 2, 4], l: [6, 3, -14], f: 50 }, { t: tG, p: [6, 2, 2], l: [6, 3, -14], f: 50 }]); if (t > tP) title(c, 'TEM UM PORÉM', tP, { size: 100 }); return; }
  c.cam([{ t: tG, p: [12, 34, 22], l: [12, 0, -10], f: 46 }, { t: c.dur, p: [12, 30, 18], l: [12, 0, -10], f: 46 }]);
  c.tag([0, 7, -14], 'ESTAÇÃO', 'blue', tG, 1e9); c.tag([24, 4.5, -12], 'GERADOR', 'gold', tG + 0.4, 1e9); c.tag([12.4, 1.5, -9.7], '↔ 100 m', 'white', tG + 0.9, 1e9);
  if (t > tI) c.chip(960, 90, '🔥 LONGE, POR CAUSA DO RISCO DE INCÊNDIO', 'red', tI, tC);
  if (t > tC) c.tag([8, 1.4, -7.4], 'CORDA GUIA', 'red', tC, 1e9);
};

SHOTS.b19 = (c) => {
  const t = c.t; const tN = c.at('Mas numa noite'), tV = c.at('o vento começa'), tM = c.at('muda'); c.sfx('wind', tN, 0.9); c.sfx('engine', 0, 0.4); c.sfx('heartbeat', tM, 0.6);
  if (t < tN) { const k = prog(t, 0, tN); ICE(c, { tod: ['day', 'dusk', 'night'][Math.min(2, Math.floor(k * 3))], exhaust: 1, gen2: false }); c.cam([{ t: 0, p: [-24, 8, 30], l: [0, 2, -12], f: 46 }, { t: tN, p: [-20, 7, 26], l: [0, 2, -12], f: 46 }]); c.chip(960, 90, `${['1º', '2º', '3º'][Math.min(2, Math.floor(k * 3))]} INVERNO ✔`, 'green', 0.2, tN); return; }
  if (t < tM - 0.3) { ICE(c, { tod: 'night', storm: lerp(0.3, 0.9, prog(t, tN, tM)), exhaust: 1 }); c.cam([{ t: tN, p: [30, 2.4, 2], l: [24, 1.8, -12], f: 46 }, { t: tM, p: [29, 2.2, 0], l: [24, 1.8, -12], f: 46 }]); c.chip(960, 90, '📅 JULHO', 'blue', tN, tM); frost(c, 0.4); return; }
  HAB(c, { power: Math.sin(t * 23) > 0 ? 1 : 0.5, screen: 'red' }); c.track('tiao', [{ t: 0, p: [0.5, 0, 0.6], ry: 0.3, a: 'lookaround', e2: 'scared' }]); c.frame('tiao', { yaw: 0.2, d: 2.8, h: 1.3, f: 44, t0: tM - 0.3, to: { d: 2.4 } });
  c.bubble(c.CH.tiao, '…esse barulho não é normal.', tM, c.dur);
};

// ================= CLÍMAX =================
SHOTS.b20 = (c) => {
  const t = c.t; const tE = c.at('entope'), tA = c.at('apaga'), tL = c.at('As luzes caem'), tQ = c.at('O aquecimento'); c.sfx('wind', 0, 0.9); c.sfx('blackout', tA, 0.9); c.sfx('alarm', tL + 0.3, 0.5);
  if (t < tA) { ICE(c, { tod: 'night', storm: 1, exhaust: t < tA - 0.3 ? 0.6 : 0, clog: lerp(0.2, 1, prog(t, 0.3, tA)), power: 1 }); c.shake(0.12);
    c.cam([{ t: 0, p: [29, 2.6, -4.6], l: [25, 1.3, -10], f: 48 }, { t: tA, p: [28.4, 2.4, -5.4], l: [25, 1.3, -10], f: 46 }]); c.torch([26, 4, -6], [25, 1.5, -10], 40); if (t > tE) c.tag([25, 2.4, -9.9], 'ENTRADA DE AR', 'red', tE, 1e9); frost(c, 0.5); return; }
  if (t < tL) { c.env('gen', { power: 0.04, smoke: 0.5 }); c.cam([{ t: tA, p: [3, 2.0, 4], l: [0, 1.2, -2.4], f: 48 }]); c.torch([3, 3, 3], [0, 0.6, -2.4], 0); title(c, 'APAGOU', tA, { bg: '#111' }); return; }
  HAB(c, { power: 0.05, alarm: 1, screen: 'red' }); camp(c, 0);
  c.track('clara', [{ t: 0, p: [-1, 0, 0.4], ry: 0.2, a: 'panic', e2: 'scared' }]); c.track('nico', [{ t: 0, p: [0.6, 0, 1.0], ry: -0.2, a: 'hug', e2: 'scared' }]);
  c.cam([{ t: tL, p: [0.2, 1.5, 3.4], l: [-0.2, 1.0, 0.4], f: 48 }, { t: c.dur, p: [0.2, 1.4, 3.0], l: [-0.2, 1.0, 0.4], f: 48 }]);
  if (t > tQ) thermo(c, '🔥 AQUECIMENTO: OFF', { b: '#ff3b30', color: '#fff', size: 52, x: 1180 });
};

SHOTS.b21 = (c) => {
  const t = c.t; const tS = c.at('sessenta'), tP = c.at('se prendem'), tE = c.at('entram na nevasca'), tM = c.at('nem a própria'); c.sfx('wind', 0, 1); c.sfx('footsteps', tE, 0.5);
  ICE(c, { tod: 'night', storm: 1, power: 0.05, clog: 1 }); c.shake(0.18);
  if (t < tP) { c.cam([{ t: 0, p: [-6, 3, 8], l: [2, 2.6, -10], f: 50 }, { t: tP, p: [-5, 2.6, 6.5], l: [2, 2.6, -10], f: 50 }]); thermo(c, '−60 °C', { b: '#ff3b30', color: '#fff' }); frost(c, 1); return; }
  const u = clamp(0.03 + (t - tP) * 0.035, 0, 0.6);
  c.track('tiao', [{ t: 0, p: onRope(u + 0.05), ry: ROPE_RY, a: 'walk', e2: 'worried', hold: 'light' }]); c.track('ana', [{ t: 0, p: onRope(u), ry: ROPE_RY, a: 'walk', e2: 'scared' }]);
  const T = c.pos('tiao'); c.torch([T.x, 1.6, T.z], [T.x + 6, 0.6, T.z - 0.8], 60);
  c.frame('ana', { yaw: 0.9, d: 3.6, h: 1.2, up: 0.3, f: 46 });
  if (t > tE) c.chip(960, 90, '🪢 PRESOS NA CORDA GUIA', 'gold', tE, tM);
  if (t > tM) title(c, 'VISIBILIDADE: ZERO', tM, { bg: '#111', size: 80 });
  frost(c, 1);
};

SHOTS.b22 = (c) => {
  const t = c.t; const tT = c.at('o termômetro'), tI = c.at('uma ideia'), tP = c.at('dos pinguins'); c.sfx('heartbeat', 0, 0.5); c.sfx('ding', tP, 0.6);
  HAB(c, { power: 0.05, alarm: 0.4, screen: 'red' }); c.torch([2.5, 2.6, 3], [0, 1.0, 0], 30);
  if (t < tI) { const R = seeded(8); for (let i = 0; i < 12; i++) c.mini(i, { p: [-5 + (i % 6) * (i < 6 ? 1.1 : 0.7) + R() * 0.3, 0, i < 6 ? -1.8 : 2.6], ry: i < 6 ? 0.1 : PI, a: 'hug', e: 'scared', s: i % 4 ? 0.92 : 0.62 });
    c.cam([{ t: 0, p: [3.6, 2.1, 2.6], l: [-1.4, 1.0, 0.4], f: 50 }, { t: tI, p: [3.2, 2.0, 2.2], l: [-1.4, 1.0, 0.4], f: 50 }]); }
  else { c.track('clara', [{ t: 0, p: [0.4, 0, 0.8], ry: 0.25, a: t < tP ? 'think' : 'pointup', e2: t < tP ? 'worried' : 'surprised', hold: 'light' }]); c.frame('clara', { yaw: 0.2, d: 2.8, h: 1.25, f: 44, t0: tI, to: { d: 2.4 } }); if (t > tP) c.chip(960, 90, '💡🐧', 'gold', tP, 1e9); }
  if (t > tT) thermo(c, `${Math.round(lerp(9, 2, prog(t, tT, c.dur)))} °C`, { b: '#ff3b30', color: '#fff' });
  frost(c, 0.6);
};

SHOTS.b23 = (c) => {
  const t = c.t; const tR = c.at('vão revezando'), tC = c.at('Cento e vinte'), tM = c.at('a mesma coisa'); c.sfx('wind', 0, 0.6); c.sfx('pad', tC, 0.5); c.sfx('aww', tM, 0.4);
  if (t < tC) { ICE(c, { tod: 'night', storm: 0.5, peng: 70, huddle: ease.io(prog(t, 0, 1.6)), aurora: false, power: 0.05 });
    c.cam([{ t: 0, p: [-3, 4, 28], l: [-12, 0.5, 19], f: 46 }, { t: tC, p: [-4, 3.2, 25], l: [-12, 0.5, 19], f: 46 }]); c.chip(960, 90, '🐧 PINGUINS-IMPERADORES NO INVERNO', 'blue', 0.3, tC); if (t > tR) c.chip(960, 200, '🔄 REVEZAM QUEM FICA NA BORDA', 'gold', tR, tC); frost(c, 0.4); return; }
  HAB(c, { power: 0.05, screen: 'red' }); c.torch([2.5, 2.8, 3], [0.4, 0.8, 0.6], 30); huddle(c, 60, ease.io(prog(t, tC, tC + 1.5)), t * 0.15);
  c.cam([{ t: tC, p: [3.8, 3.2, 3.2], l: [0.4, 0.8, 0.6], f: 52 }, { t: c.dur, p: [3.4, 3.0, 2.8], l: [0.4, 0.8, 0.6], f: 52 }]);
  if (t > tM) title(c, 'O ABRAÇO DE PINGUIM', tM, { bg: '#2a6ad6', size: 76 });
};

SHOTS.b24 = (c) => {
  const t = c.t; const tC = c.at('cava a neve'), tL = c.at('A Ana segura'), t1 = c.at('Primeira tentativa'), t2 = c.at('Segunda'); c.sfx('wind', 0, 0.5); c.sfx('crank', t1 + 0.5, 0.7); c.sfx('error', t1 + 1.3, 0.5); c.sfx('crank', t2, 0.7); c.sfx('error', t2 + 0.9, 0.5);
  if (t < tL) { ICE(c, { tod: 'night', storm: 1, power: 0.05, clog: lerp(1, 0.25, prog(t, 0.4, tL)) }); c.shake(0.12);
    c.track('tiao', [{ t: 0, p: [25, 0, -9.0], ry: PI, a: 'crank', e2: 'angry' }]); c.track('ana', [{ t: 0, p: [23.6, 0, -8.4], ry: PI - 0.6, a: 'hold', e2: 'worried', hold: 'light' }]);
    c.torch([23.6, 1.6, -8.4], [25, 1.2, -10], 60); c.cam([{ t: 0, p: [27.6, 1.9, -6.0], l: [24.7, 1.2, -9.4], f: 48 }, { t: tL, p: [27.2, 1.8, -6.4], l: [24.7, 1.2, -9.4], f: 48 }]); frost(c, 0.6); return; }
  c.env('gen', { power: 0.04, crank: t * 3 }); c.torch([3.2, 2.2, 2.6], [0, 1.2, -2.4], 45);
  c.track('tiao', [{ t: 0, p: [-2.5, 0, -0.9], ry: 0.6, a: 'crank', e2: 'angry' }]); c.track('ana', [{ t: 0, p: [2.6, 0, 1.6], ry: -2.2, a: 'hold', e2: 'worried', hold: 'light' }]);
  c.cam([{ t: tL, p: [1.0, 1.8, 3.6], l: [-1.4, 1.2, -1.2], f: 48 }, { t: c.dur, p: [0.6, 1.7, 3.0], l: [-1.4, 1.2, -1.2], f: 48 }]);
  if (t > t1 + 1.2) c.ui(card('1ª TENTATIVA ❌', { x: 560, y: 70, b: '#ff3b30', s: pop(t, t1 + 1.2, 0.25) || 1 }));
  if (t > t2 + 0.8) c.ui(card('2ª TENTATIVA ❌', { x: 1360, y: 70, b: '#ff3b30', s: pop(t, t2 + 0.8, 0.25) || 1 }));
};

SHOTS.b25 = (c) => {
  const t = c.t; const tT = c.at('tosse'), tP = c.at('pega'), tL = c.at('As luzes voltam'); c.sfx('crank', 0.2, 0.7); c.sfx('cough', tT, 0.6); c.sfx('engine', tP, 0.8); c.sfx('power', tP + 0.1, 0.7); c.sfx('cheer', tL + 0.3, 0.4);
  if (t < tL) { const on = t > tP; c.env('gen', { power: on ? ease.o(prog(t, tP, tP + 0.6)) : 0.04, shake: on ? 0.6 : (t > tT ? 0.3 * Math.abs(Math.sin(t * 9)) : 0), smoke: t > tT && !on ? 0.6 : 0, crank: t * 3 }); c.torch([3.2, 2.2, 2.6], [0, 1.2, -2.4], on ? 0 : 45);
    c.track('tiao', [{ t: 0, p: [-2.5, 0, -0.9], ry: 0.6, a: on ? 'cheer' : 'crank', e2: on ? 'happy' : 'angry' }]); c.track('ana', [{ t: 0, p: [2.6, 0, 1.6], ry: -2.2, a: on ? 'cheer' : 'hold', e2: on ? 'happy' : 'worried', hold: on ? null : 'light' }]);
    c.cam([{ t: 0, p: [0.6, 1.7, 3.0], l: [-1.4, 1.2, -1.2], f: 48 }, { t: tL, p: [0.4, 1.6, 2.6], l: [-1.4, 1.2, -1.2], f: 48 }]);
    if (t > tT && !on) c.chip(960, 90, '3ª TENTATIVA…', 'gold', tT, tP); if (on) title(c, 'PEGOU!', tP, { bg: '#2fa35a', size: 110 }); return; }
  ICE(c, { tod: 'night', storm: 0.8, power: ease.io(prog(t, tL, tL + 2)), exhaust: 1, clog: 0.2 });
  c.cam([{ t: tL, p: [-10, 4, 14], l: [2, 3.6, -12], f: 46 }, { t: c.dur, p: [-8, 3.6, 11], l: [2, 3.6, -12], f: 46 }]);
};

SHOTS.b26 = (c) => {
  const t = c.t; const tA = c.at('encontram'), tN = c.at('Ninguém congelou'), tD = c.at('E desde aquela'), tG = c.at('dois geradores'), tT = c.at('ganhou um telhado'); c.sfx('door', 0.1, 0.5); c.sfx('cheer', tN, 0.5); c.sfx('tada', tG, 0.5);
  if (t < tD) { HAB(c, { power: 1, screen: 'ok' }); huddle(c, 60, 1, t * 0.1);
    c.track('tiao', [{ t: 0, p: [4.4, 0, 2.4], ry: -2.0, a: t < tN ? 'idle' : 'cheer', e2: 'happy' }]); c.track('ana', [{ t: 0, p: [4.8, 0, 1.3], ry: -1.9, a: t < tN ? 'idle' : 'cheer', e2: 'happy' }]);
    c.cam([{ t: 0, p: [-3.6, 2.6, 2.8], l: [2.2, 1.0, 1.0], f: 52 }, { t: tD, p: [-3.2, 2.4, 2.4], l: [2.2, 1.0, 1.0], f: 52 }]);
    if (t > tA) c.chip(960, 90, '🎶 120 PESSOAS ABRAÇADAS, CANTANDO', 'gold', tA, tN); if (t > tN) title(c, 'NINGUÉM CONGELOU', tN, { bg: '#2fa35a', size: 84 }); return; }
  ICE(c, { gen2: true, cap: true, exhaust: 1 });
  c.cam([{ t: tD, p: [36, 6, 2], l: [24, 1.6, -15], f: 46 }, { t: c.dur, p: [33, 5, 0], l: [24, 1.6, -15], f: 46 }]);
  if (t > tG) c.tag([24, 4.6, -20], '2º GERADOR', 'green', tG, 1e9); if (t > tT) c.tag([25, 3.4, -9.4], 'TELHADO NA ENTRADA DE AR', 'green', tT, 1e9);
};

// ================= FINAL =================
SHOTS.b27 = (c) => {
  const t = c.t; const tC = c.at('A estação cresce'), tR = c.at('o rádio'), tE = c.at('esfriou de novo'); c.sfx('whoosh', 0.2, 0.5); c.sfx('radio', tR, 0.6); c.sfx('tada', tE, 0.5);
  if (t < tR) { ICE(c, { more: t > tC, gen2: true, cap: true, exhaust: 1 }); camp(c, 30, { walk: true, kids: true }); c.cam([{ t: 0, p: [-30, 12, 22], l: [-6, 2, -10], f: 46 }, { t: tR, p: [-26, 10, 18], l: [-6, 2, -10], f: 46 }]);
    c.chip(960, 90, `⏩ +${Math.floor(1 + prog(t, 0, tR) * 9)} ANOS`, 'gold', 0.2, tR); return; }
  HAB(c, { power: 1, screen: 'ok' }); c.track('clara', [{ t: 0, p: [-4.4, 0, -1.0], ry: -1.3, a: t < tE ? 'phone' : 'cheer', e2: t < tE ? 'surprised' : 'happy', hold: t < tE ? 'phone' : null }]);
  c.cam([{ t: tR, p: [-1.4, 1.7, 1.4], l: [-5, 1.2, -1.2], f: 48 }, { t: c.dur, p: [-1.8, 1.6, 0.9], l: [-5, 1.2, -1.2], f: 48 }]);
  if (t > tR) c.bubble(c.CH.clara, '📻 …o planeta esfriou…', tR + 0.2, tE);
  if (t > tE) title(c, 'DÁ PRA VOLTAR', tE, { bg: '#0aa6b8', size: 90 });
};

SHOTS.b28 = (c) => {
  const t = c.t; const tF = c.at('fica'), tN = c.at('E o Nico'), tS = c.at('Ele ainda'); c.sfx('waves', 0, 0.5); c.sfx('pad', tN, 0.5);
  if (t < tN) { ICE(c, { more: true, gen2: true, cap: true, ship: { x: -14, z: 46, ry: PI / 2 } });
    const R = seeded(6); c.crowd(Array.from({ length: 50 }, (_, i) => { const stay = i % 2 === 0; const x = stay ? -2 + (i % 10) * 0.9 : -14 + ((i % 10) - 5) * 0.8, z = stay ? -5 + R() * 3 : 24 + (R() * 2) + (t * 0.5); return { p: [x, 0, z], ry: stay ? 0.4 : 0, c: COLS[i % COLS.length], s: i % 5 ? 0.95 : 0.62, a: stay ? 'idle' : 'walk' }; }));
    c.cam([{ t: 0, p: [12, 8, -2], l: [-10, 1, 32], f: 48 }, { t: tN, p: [10, 7, 0], l: [-10, 1, 32], f: 48 }]); if (t > tF) title(c, 'MUITA GENTE FICA', tF, { bg: '#2a6ad6', size: 80 }); return; }
  ICE(c, { more: true, peng: 50 }); c.track('nicov', [{ t: 0, p: [-9, 0, 11.6], ry: PI - 0.5, a: t < tS ? 'write' : 'point', e2: 'happy', hold: t < tS ? 'book' : null }]);
  c.cam([{ t: tN, p: [-6.0, 1.9, 8.4], l: [-10, 1.1, 14], f: 48 }, { t: c.dur, p: [-6.4, 1.8, 9.0], l: [-10, 1.1, 14], f: 48 }]);
  c.chip(960, 90, '🔬 NICO, O NOVO CIENTISTA', 'gold', tN + 0.2, 1e9);
  if (t > tS) [['PIPOCA', [-11.5, 1.4, 16]], ['BOLINHA', [-8.5, 1.4, 17.5]]].forEach(([n, v], i) => c.tag(v, n, 'white', tS + 0.2 + i * 0.5, 1e9));
};

SHOTS.b29 = (c) => {
  const t = c.t; const tR = c.at('Recomeçou porque'), tC = c.at('o calor'), tL = c.at('a luz'), tF = c.at('e a comida'); c.sfx('pad', 0, 0.5); c.sfx('wind', 0, 0.2);
  ICE(c, { tod: 'night', aurora: true, stars: true, power: 1, more: true, gen2: true, cap: true, exhaust: 0.6 });
  c.crowd(Array.from({ length: 60 }, (_, i) => { const a = i * 2.399, r = 1.2 + Math.sqrt(i) * 0.6; const x = Math.cos(a) * r * 1.6, z = -4 + Math.sin(a) * r * 0.7; return { p: [x, 0, z], ry: PI, c: COLS[i % COLS.length], s: i % 4 ? 0.95 : 0.65, a: 'idle' }; }));
  c.cam([{ t: 0, p: [0, 2.0, 9], l: [0, 6, -20], f: 54 }, { t: c.dur, p: [0, 1.8, 7.5], l: [0, 7, -20], f: 54 }]);
  [[tC, '🔥 O CALOR', 'red'], [tL, '💡 A LUZ', 'gold'], [tF, '🥗 A COMIDA', 'green']].forEach(([t0, s, cl], i) => { if (t > t0) c.chip(560 + i * 400, 120, s, cl, t0, 1e9); });
  if (t > tR) c.chip(960, 230, 'APRENDERAM A DIVIDIR', 'white', tR, 1e9);
  c.state.fade = prog(t, c.dur - 0.5, c.dur);
};

SHOTS.b30 = (c) => {
  const t = c.t; const tQ = c.at('Aguentaria'), tM = c.at('no deserto'), tS = c.at('Se inscreve'), tB = c.at('Até lá'); c.sfx('whoosh', tM, 0.5); c.sfx('click', tS + 1.1, 0.8); c.sfx('ding', tS + 1.15, 0.6); c.sfx('tada', tB, 0.6);
  c.env('outro');
  const w = t > tB;
  [['ana', -3.0, 0.3], ['clara', -1.0, 0.1], ['tiao', 1.0, -0.1], ['nico', 3.0, -0.3]].forEach(([n, x, ry]) => c.track(n, [{ t: 0, p: [x, 0, 5.1], ry, a: w ? 'wave' : 'idle', e2: 'happy' }]));
  c.cam([{ t: 0, p: [0, 1.9, 12.4], l: [0, 2.0, 5], f: 42 }, { t: c.dur, p: [0, 2.0, 11.4], l: [0, 2.0, 5], f: 42 }]);
  if (t > tQ && t < tM - 1.5) { const a = clamp((t - tQ) / 0.4); c.ui(`<div class="abs" style="left:0;top:130px;width:1920px;text-align:center;font-weight:900;font-size:60px;color:#fff;opacity:${a};text-shadow:0 5px 0 #000">UM INVERNO INTEIRO SEM SOL?</div>`);
    ['AGUENTO 💪', 'NEM PENSAR 🥶'].forEach((l, i) => { const s = pop(t, tQ + 0.5 + i * 0.3, 0.25); c.ui(`<div class="abs" style="left:${500 + i * 480}px;top:240px;width:440px;padding:20px 0;text-align:center;border-radius:24px;background:${['#ffb02e', '#38d6ff'][i]};color:#111;font-weight:900;font-size:50px;white-space:nowrap;transform:scale(${s})">${l}</div>`); }); }
  if (t > tM - 1.4 && t < tS - 0.1) { c.ui(`<div class="abs" style="left:0;top:120px;width:1920px;text-align:center;font-weight:900;font-size:60px;color:#fff;text-shadow:0 5px 0 #000">PRÓXIMO EPISÓDIO</div>`); c.ui(bigNum('NO DESERTO?', 960, 270, { size: 130, color: '#ffd21f', glow: 'rgba(255,210,31,.6)', s: pop(t, tM - 1.4, 0.3) || 1 })); }
  if (t > tS - 0.1) subBtn(c, tS);
  c.state.fade = prog(t, c.dur - 0.4, c.dur);
};
