// LONGO: "E se a humanidade tivesse que recomeçar num navio que nunca pode parar?" — palito, 1920x1080.
// Cenário novo: 'ship' (engine/envs9.js). Também: gen (casa de máquinas), street (névoa), lab, ocean {pier} (embarque), outro.
import { clamp, lerp, ease, PI, prog, stamp, bigNum, pop, seeded, subBtn } from '/engine/kit.js';
export const SHOTS = {};
const P0 = { num: null, flag: false };
export const CAST = {
  tati: { style: 'palito', ...P0, shirt: 0xf4f4f4, trim: 0x1f3d7a, shorts: 0x1f3d7a, hair: 'lia', cap: 0x1f3d7a, scale: 0.96 },
  dito: { style: 'palito', ...P0, shirt: 0x2f6db5, trim: 0xffd21f, shorts: 0x3a3a3a, hair: 'old', cap: 0xffd21f },
  ceci: { style: 'palito', ...P0, shirt: 0xf4f4f4, trim: 0x2aa198, shorts: 0x2aa198, hair: 'lia', scale: 0.96 },
  nino: { style: 'palito', ...P0, shirt: 0xff7a1a, trim: 0xffffff, shorts: 0x222a44, cap: 0xd62828, scale: 0.66 },
  ninoA: { style: 'palito', ...P0, shirt: 0xf4f4f4, trim: 0xff7a1a, shorts: 0x1f3d7a, cap: 0x1f3d7a, scale: 1.0 },
  mec: { style: 'palito', ...P0, shirt: 0x5a5f66, trim: 0xff7a1a, shorts: 0x2b2b33, cap: 0xff7a1a },
};
const COLS = [0xff7a1a, 0x2a6ad6, 0x2fa35a, 0xf4f4f4, 0xd6a31c, 0x8a3ad6, 0x0aa6b8, 0xe02020];
const title = (c, txt, t0, o = {}) => { if (c.t < t0) return; const s = pop(c.t, t0, 0.3) || 1; c.ui(`<div class="abs" style="left:0;right:0;top:${o.top ?? 70}px;text-align:center;transform:scale(${s})"><div style="display:inline-block;background:${o.bg ?? '#d62828'};border:7px solid #fff;border-radius:22px;padding:6px 60px;font-weight:900;font-size:${o.size ?? 86}px;color:#fff;text-shadow:0 5px 0 rgba(0,0,0,.35)">${txt}</div></div>`); };
const card = (html, o = {}) => `<div class="abs" style="left:${o.x ?? 960}px;top:${o.y ?? 150}px;transform:translate(-50%,0) scale(${o.s ?? 1});opacity:${o.a ?? 1};background:rgba(10,14,28,.88);border:5px solid ${o.b ?? '#7ab8ff'};border-radius:26px;padding:22px 44px;color:#fff;font-weight:900;font-size:${o.size ?? 50}px;text-align:center;white-space:nowrap">${html}</div>`;
const big = (c, txt, t0, o = {}) => { if (c.t < t0) return; c.ui(bigNum(txt, o.x ?? 960, o.y ?? 250, { size: o.size ?? 130, color: o.color ?? '#ffd21f', glow: o.glow ?? 'rgba(255,210,31,.6)', s: pop(c.t, t0, 0.3) || 1 })); };
const cards = (c, list, y = 90, b = '#7ab8ff') => list.forEach(([w, txt, x], i) => { const t0 = typeof w === 'number' ? w : c.at(w); if (c.t > t0) c.ui(card(txt, { x: x ?? (560 + i * 800), y, size: 46, b, s: pop(c.t, t0, 0.25) || 1 })); });
const at = (c, s) => c.at(s);
const D = 0.2;                                   // altura do convés
const S = (c, p = {}) => c.env('ship', { waves: 0.25, green: 1, tarp: true, ...p });
const smoke = (c, k = 1) => c.puffs([0, 14.6, 24.5], k, { color: 0x555555, rise: 6, grow: 3, spread: 2.5, op: 0.5 });
const storm = (c, k = 1) => ({ tod: 'storm', waves: 0.7 + 0.3 * k, rain: k, power: 1, tarp: false });
// figurantes no convés (área livre da proa: x -5.5..5.5, z -20..-32)
const deckPeople = (c, n, o = {}) => { const R = seeded(o.seed || 3); for (let i = 0; i < n; i++) { const x = (o.x0 ?? -5.2) + (i % (o.cols ?? 8)) * (o.dx ?? 1.4) + (R() - 0.5) * 0.4, z = (o.z0 ?? -21) - Math.floor(i / (o.cols ?? 8)) * (o.dz ?? 1.6) + (R() - 0.5) * 0.4;
  const jump = o.jump ? Math.abs(Math.sin(c.t * 2.4 + i * 0.9)) * 0.6 : 0; c.mini(i, { p: [x, D + jump, z], ry: o.ry ?? 0, a: typeof o.a === 'function' ? o.a(i) : (o.a || 'idle'), e: o.e || 'neutral', s: (o.s ?? 0.95) * (o.kids && i % 3 === 0 ? 0.65 : 1) }); } };
// peixe (malha simples)
let FISH = null; const fish = (c, p, ry = 0, s = 1) => { if (!FISH) { const T = c.THREE; FISH = new T.Group(); const m = new T.MeshLambertMaterial({ color: 0x9fb8c8 }); const b = new T.Mesh(new T.SphereGeometry(0.18, 10, 8), m); b.scale.set(0.5, 0.8, 1.8); FISH.add(b); const tl = new T.Mesh(new T.ConeGeometry(0.14, 0.22, 4), m); tl.rotation.x = PI / 2; tl.position.z = -0.38; FISH.add(tl); c.scene.add(FISH); }
  FISH.visible = true; FISH.position.set(...p); FISH.rotation.set(0, ry, 0.3); FISH.scale.setScalar(s); };
const hideFish = () => { if (FISH) FISH.visible = false; };
// lona dobrada / sendo amarrada (âncora de mar improvisada)
let TARP = null; const tarpProp = (c, p, s = 1, open = 0) => { if (!TARP) { const T = c.THREE; TARP = new T.Mesh(new T.ConeGeometry(1, 1, 12, 1, true), new T.MeshLambertMaterial({ color: 0x3a86ff, side: T.DoubleSide })); c.scene.add(TARP); }
  TARP.visible = true; TARP.position.set(...p); TARP.scale.set(s * (0.4 + open), s * 0.6, s * (0.4 + open)); TARP.rotation.set(0, 0, 0); };
const hideProps = () => { hideFish(); if (TARP) TARP.visible = false; };
// névoa verde por cima (flashback)
const fogUI = (c, k) => c.ui(`<div class="abs" style="left:0;top:0;width:1920px;height:1080px;background:radial-gradient(ellipse at 50% 60%, rgba(150,210,120,${0.45 * k}), rgba(60,110,50,${0.8 * k}));pointer-events:none"></div>`);
const dark = (c, k = 1) => c.ui(`<div class="abs" style="left:0;top:0;width:1920px;height:1080px;box-shadow:inset 0 0 300px 140px rgba(0,0,10,${0.75 * k});pointer-events:none"></div>`);
const lightning = (c, ts) => { for (const t0 of ts) if (c.t > t0 && c.t < t0 + 0.18) c.flash('#e8f4ff', 0.55 * (1 - (c.t - t0) / 0.18)); };
// casa de máquinas
const ENG = (c, p = {}) => { hideProps(); c.env('gen', p); };

// ================= GANCHO =================
SHOTS.b01 = (c) => {
  const t = c.t; const tN = at(c, 'Não pode atracar'), tE = at(c, 'E ele é'), tU = at(c, 'única casa'); c.sfx('waves', 0, 0.5); c.sfx('riser', 0.2, 0.3); c.sfx('boom', tU, 0.6);
  hideProps(); S(c, { tod: 'day', kite: 1 }); smoke(c, 0.7);
  if (t < tN) { c.cam([{ t: 0, p: [70, 32, 70], l: [0, 0, -5], f: 46 }, { t: tN, p: [52, 24, 52], l: [0, 0, -5], f: 46 }]); c.chip(960, 90, '🚢 NAVIO ANDORINHÃO', 'gold', 0.5, tN); if (t > at(c, 'três anos')) big(c, '3 ANOS SEM PARAR', at(c, 'três anos'), { y: 250, size: 100 }); }
  else if (t < tE) { c.cam([{ t: tN, p: [-26, 6, -60], l: [0, 2, -20], f: 50 }, { t: tE, p: [-22, 5, -54], l: [0, 2, -20], f: 50 }]);
    cards(c, [['Não pode atracar', '⚓ NÃO ATRACA', 400], ['não pode ancorar', '🚫 NÃO ANCORA', 960], ['desligar o motor', '⚙️ MOTOR LIGADO', 1520]], 90, '#ff3b30'); }
  else { c.cam([{ t: tE, p: [0, 3.2, -6], l: [0, 1.4, -26], f: 50 }, { t: c.dur, p: [0, 3.0, -9], l: [0, 1.4, -26], f: 50 }]); deckPeople(c, 24, { a: (i) => i % 3 ? 'idle' : 'wave', e: 'happy', ry: PI, seed: 4, kids: true });
    c.track('tati', [{ t: 0, p: [0, D, -17.5], ry: PI, a: 'idle', e2: 'neutral' }]);
    if (t > tU) title(c, 'A ÚNICA CASA DE 300 PESSOAS', tU + 0.1, { size: 78, bg: '#2a4ab0' }); }
};

SHOTS.b02 = (c) => {
  const t = c.t; const tM = at(c, 'o motor'), tP = at(c, 'engasgou'); c.sfx('wind', 0, 0.6); c.sfx('waves', 0, 0.6); lightning(c, [0.6]); c.sfx('boom', 0.6, 0.5);
  if (t < tM - 0.2) { hideProps(); S(c, storm(c)); c.track('tati', [{ t: 0, p: [-6.3, D, -24], ry: -PI / 2, a: 'hold', e2: 'scared' }]);
    c.cam([{ t: 0, p: [-9.6, 2.3, -21.5], l: [-6.3, 1.5, -24], f: 50 }, { t: tM, p: [-9.4, 2.2, -22.0], l: [-6.3, 1.5, -24], f: 50 }]); c.shake(0.8, 6);
    title(c, 'A MAIOR TEMPESTADE', 0.3, { bg: '#2a4a3a' }); }
  else { const off = t > tP + 0.6; ENG(c, { power: off ? 0.08 : 1, shake: off ? 0 : 1.2, smoke: off ? 1 : 0.3 }); c.sfx('crank', tP, 0.6); c.sfx('blackout', tP + 0.6, 0.6);
    c.track('mec', [{ t: 0, p: [2.5, 0, 0.6], ry: -0.9, a: off ? 'panic' : 'tinker', e2: off ? 'scared' : 'worried' }]);
    c.cam([{ t: tM - 0.2, p: [4.5, 2.2, 4.2], l: [0, 1.2, -2.4], f: 48 }, { t: c.dur, p: [4.0, 2.0, 3.6], l: [0, 1.2, -2.4], f: 48 }]); if (off) { c.torch([3.5, 3, 3.5], [0, 0.8, -2.4], 20); title(c, 'O MOTOR PAROU', tP + 0.6); } }
};

SHOTS.b03 = (c) => {
  const t = c.t; const tO = at(c, 'onda'), tV = at(c, 'Mas pra entender'); c.sfx('wind', 0, 0.6); c.sfx('dramatic', tO, 0.6); c.sfx('whoosh', tV + 1.2, 0.6);
  const ang = lerp(0.2, 1.25, ease.io(prog(t, 0, tO))); hideProps();
  S(c, { ...storm(c), rogue: { d: lerp(150, 115, t / c.dur), ang } });
  c.cam([{ t: 0, p: [46, 22, 52], l: [0, 2, -10], f: 48, r: 0 }, { t: tO, p: [40, 18, 44], l: [0, 2, -10], f: 48, r: 0.06 }, { t: c.dur, p: [30, 14, 40], l: [-60, 8, -30], f: 46, r: -0.04 }]);
  if (t < tO) cards(c, [[0.4, '↩️ NAVIO VIRANDO DE LADO', 960]], 90, '#ff3b30');
  if (t > tO) big(c, '🌊 DO TAMANHO DE UM PRÉDIO', tO + 0.2, { y: 200, size: 90, color: '#ff3b30', glow: 'rgba(255,60,48,.6)' });
  lightning(c, [tO + 0.4]);
  if (t > tV + 0.8) c.state.fade = prog(t, c.dur - 0.6, c.dur);
};

// ================= COMEÇO =================
SHOTS.b04 = (c) => {
  const t = c.t; const tQ = at(c, 'Quem respira'), tT = at(c, 'todos os continentes'); c.sfx('dramatic', 0.3, 0.4); c.sfx('cough', tQ + 0.3, 0.5);
  c.state.fade = 1 - prog(t, 0, 0.6); hideProps();
  c.env('street', { tod: 'gray', cars: true });
  for (let i = 0; i < 10; i++) { const z = -4 - i * 2.4, x = (i % 2 ? 11.5 : -11.5) + (i % 3) * 0.6; c.mini(i, { p: [x, 0.12, z + ((t * 1.1) % 2)], ry: i % 2 ? PI : 0, a: i === 3 && t > tQ ? 'hurt' : 'walk', e: 'worried' }); }
  c.cam([{ t: 0, p: [4, 3.2, 14], l: [0, 3, -20], f: 50 }, { t: c.dur, p: [2.5, 3.0, 9], l: [0, 3, -20], f: 50 }]);
  fogUI(c, clamp(0.3 + t / c.dur));
  title(c, '🌫️ A NÉVOA', 0.6, { bg: '#3a6a2a' });
  if (t > tT) c.ui(card('🌍 TODOS OS CONTINENTES', { y: 700, b: '#ff3b30', s: pop(t, tT, 0.25) || 1 }));
};

SHOTS.b05 = (c) => {
  const t = c.t; const tM = at(c, 'mar aberto'), tO = at(c, 'E os oceanos'), tS = at(c, 'setenta'); c.sfx('ding', tM, 0.5); c.sfx('pop', tS, 0.6);
  hideProps();
  if (t < tO - 0.2) { c.env('lab', { level: 0.2, dispOk: true }); c.track('ceci', [{ t: 0, p: [0.6, 0, 1.2], ry: -0.5, a: t < tM ? 'think' : 'point', e2: t < tM ? 'worried' : 'surprised' }]);
    c.frame('ceci', { yaw: 0.6, d: 3.2, h: 1.45, f: 46, to: { d: 2.8 } });
    if (t > tM - 0.3) c.ui(card('🧂 SAL + 💨 VENTO = SEM NÉVOA', { y: 90, b: '#3ad6ff', s: pop(t, tM - 0.3, 0.25) || 1 })); }
  else { S(c, { tod: 'day', waves: 0.3, green: 0, tarp: false }); c.cam([{ t: tO - 0.2, p: [-120, 70, 200], l: [0, -4, -80], f: 50 }, { t: c.dur, p: [-110, 60, 170], l: [0, -4, -80], f: 50 }]);
    if (t > tS) big(c, '🌊 71% DO PLANETA', tS, { y: 260, size: 120, color: '#7ad8ff', glow: 'rgba(90,200,255,.6)' }); c.chip(960, 860, 'FONTE: NOAA', 'white', tS, 1e9); }
};

SHOTS.b06 = (c) => {
  const t = c.t; const tR = at(c, 'rebatizado'), tP = at(c, 'pássaro'), tD = at(c, 'dez meses'); c.sfx('waves', 0, 0.4); c.sfx('pop', tD, 0.6);
  hideProps(); S(c, { tod: 'day', green: 0, tarp: false }); smoke(c, 0.5);
  if (t < tP) { for (let i = 0; i < 16; i++) c.mini(i, { p: [(i % 2 ? 0.8 : -0.8), D, -2 - i * 1.3 - ((t * 1.2) % 1.3)], ry: PI, a: 'walk', e: 'neutral', s: i % 4 === 0 ? 0.65 : 0.95 });
    c.cam([{ t: 0, p: [3.5, 4.0, 12], l: [0, 1, -20], f: 46 }, { t: tP, p: [3, 3.6, 8], l: [0, 1, -20], f: 46 }]);
    c.chip(960, 90, '300 PESSOAS', 'gold', 0.5, 1e9); if (t > tR) title(c, '🚢 ANDORINHÃO', tR + 0.2, { top: 190, bg: '#2a4ab0' }); }
  else { c.cam([{ t: tP, p: [-3, 2.5, -20], l: [0, 22, -60], f: 50 }, { t: c.dur, p: [-3, 2.5, -22], l: [0, 24, -60], f: 50 }]);
    // andorinhão (silhueta) voando
    const bx = 960 + Math.sin(t * 0.8) * 300, by = 380 + Math.sin(t * 1.7) * 40, fl = Math.sin(t * 14) * 0.6;
    c.ui(`<div class="abs" style="left:${bx}px;top:${by}px;transform:translate(-50%,-50%)"><svg width="260" height="120" viewBox="-130 -60 260 120"><path d="M0 0 C -40 ${-30 - fl * 30} -90 ${-20 - fl * 30} -128 ${10 - fl * 40} C -80 ${0 - fl * 10} -40 8 0 10 C 40 8 80 ${0 - fl * 10} 128 ${10 - fl * 40} C 90 ${-20 - fl * 30} 40 ${-30 - fl * 30} 0 0 Z" fill="#1a1a1a"/><ellipse cx="0" cy="6" rx="10" ry="16" fill="#1a1a1a"/></svg></div>`);
    if (t > tD) c.ui(card('🐦 ANDORINHÃO: ATÉ <span style="color:#ffd21f">10 MESES</span> VOANDO SEM POUSAR', { y: 680, b: '#ffd21f', size: 44, s: pop(t, tD, 0.25) || 1 }));
    c.chip(960, 860, 'Current Biology, 2016', 'white', tD, 1e9); }
};

SHOTS.b07 = (c) => {
  const t = c.t; const tD = at(c, 'O Seu Dito'), tC = at(c, 'A doutora'), tN = at(c, 'E o Nino'); c.sfx('pop', 0.3, 0.5); c.sfx('pop', tD, 0.5); c.sfx('pop', tC, 0.5); c.sfx('pop', tN, 0.5);
  hideProps(); S(c, { tod: 'day', green: 0.3 }); smoke(c, 0.5);
  if (t < tD) { c.track('tati', [{ t: 0, p: [0, D, 12], ry: PI, a: 'point', e2: 'happy', hold: null }]); c.frame('tati', { yaw: 0.35, d: 3.4, h: 1.5, f: 46, to: { d: 2.9 } }); c.chip(1300, 500, '⚓ TATI · CAPITÃ', 'blue', 0.3, 1e9); }
  else if (t < tC) { c.track('dito', [{ t: 0, p: [6.2, D, -26], ry: PI / 2, a: 'idle', e2: 'happy' }]); c.frame('dito', { yaw: -1.3, d: 3.2, h: 1.45, f: 46, to: { d: 2.8 }, t0: tD }); c.chip(1300, 500, '🎣 SEU DITO · PESCADOR', 'gold', tD, 1e9); }
  else if (t < tN) { c.track('ceci', [{ t: 0, p: [-1.2, D, 9.5], ry: 0.4, a: 'idle', e2: 'happy', hold: 'bandage' }]); c.frame('ceci', { yaw: 0.3, d: 3.2, h: 1.45, f: 46, to: { d: 2.8 }, t0: tC }); c.chip(1300, 500, '🩺 DRA. CECÍLIA · MÉDICA', 'green', tC, 1e9); }
  else { c.track('nino', [{ t: 0, p: [0.5, D, -24], ry: 0.2, a: 'hold', e2: 'happy', hold: 'book' }]); c.frame('nino', { yaw: 0.2, d: 2.6, h: 1.0, f: 46, to: { d: 2.2 }, t0: tN }); c.chip(1300, 500, '📖 NINO · 9 ANOS', 'red', tN, 1e9); }
};

SHOTS.b08 = (c) => {
  const t = c.t; const tE = at(c, 'É ele'), tA = at(c, 'E água do mar'), tD = at(c, 'desidrata'); c.sfx('engine', 0, 0.4); c.sfx('error', tD, 0.5);
  if (t < tA - 0.2) { ENG(c, { power: 1, shake: 0.5 }); c.track('tati', [{ t: 0, p: [-2.2, 0, 1.2], ry: 0.7, a: 'point', e2: 'neutral' }]); c.track('mec', [{ t: 0, p: [2.4, 0, 0.6], ry: -0.9, a: 'tinker', e2: 'neutral' }]);
    c.cam([{ t: 0, p: [0, 2.4, 6.2], l: [0, 1.3, -1.5], f: 48 }, { t: tA, p: [0.4, 2.2, 5.2], l: [0, 1.3, -1.5], f: 48 }]);
    title(c, 'REGRA Nº 1: O MOTOR NUNCA DESLIGA', 0.2, { size: 66, bg: '#2a4ab0' }); if (t > tE) c.ui(card('⚙️ MOTOR → ⚡ → 🧂❌ → 💧', { y: 230, b: '#3ad6ff', s: pop(t, tE, 0.25) || 1 })); }
  else { S(c, { tod: 'day' }); c.track('dito', [{ t: 0, p: [6.1, D, -24], ry: PI / 2, a: 'idle', e2: t < tD ? 'neutral' : 'deadpan' }]);
    c.cam([{ t: tA - 0.2, p: [9.8, 2.2, -21.8], l: [6.1, 1.4, -24], f: 46 }, { t: c.dur, p: [9.6, 2.1, -22.4], l: [6.1, 1.4, -24], f: 46 }]);
    if (t > tD) c.ui(card('🌊 ÁGUA DO MAR <span style="color:#ff3b30">DESIDRATA</span>', { y: 90, b: '#ff3b30', s: pop(t, tD, 0.25) || 1 })); }
};

SHOTS.b09 = (c) => {
  const t = c.t; const tL = at(c, 'De lado'), tV = at(c, 'virar o navio'); c.sfx('wind', 0, 0.4); c.sfx('error', tV, 0.5);
  hideProps(); const side = t > tL; S(c, { tod: 'day', waves: 0.6, rogue: { d: lerp(150, 120, t / c.dur), ang: side ? PI / 2 : 0, h: 10 } });
  if (!side) c.cam([{ t: 0, p: [38, 18, 30], l: [0, 0, -30], f: 48 }, { t: tL, p: [34, 16, 26], l: [0, 0, -30], f: 48 }]);
  else c.cam([{ t: tL, p: [10, 14, 70], l: [-30, 0, 0], f: 48, r: 0 }, { t: c.dur, p: [8, 12, 62], l: [-30, 0, 0], f: 48, r: 0.12 }]);
  title(c, 'REGRA Nº 2: SEMPRE DE FRENTE PRAS ONDAS', 0.2, { size: 60, bg: '#2a4ab0' });
  c.ui(card(side ? '🌊 → 🚢 DE LADO = <span style="color:#ff3b30">PERIGO</span>' : '🌊 → 🚢 DE FRENTE = <span style="color:#30d060">SEGURO</span>', { y: 700, b: side ? '#ff3b30' : '#30d060', size: 46 }));
  if (t > tV) { const k = ease.oo(prog(t, tV, tV + 0.25)); c.ui(stamp('PODE VIRAR!', { top: 420, size: 110, s: 1.4 - 0.4 * k, a: k })); }
};

// ================= VANTAGENS =================
SHOTS.b10 = (c) => {
  const t = c.t; const tP = at(c, 'peixe todo dia'), tN = at(c, 'nó de marinheiro'); c.sfx('splash', 1.0, 0.4); c.sfx('pop', tP, 0.5);
  hideProps(); S(c, { tod: 'day', green: 0.4 });
  if (t < tN - 0.3) { const pulled = t > tP - 0.4;
    c.track('dito', [{ t: 0, p: [6.2, D, -26], ry: PI / 2, a: pulled ? 'cheer' : 'point', e2: 'happy' }]); c.track('nino', [{ t: 0, p: [5.6, D, -24.6], ry: PI / 2 + 0.5, a: pulled ? 'cheer' : 'idle', e2: pulled ? 'happy' : 'neutral' }]);
    if (pulled) fish(c, [6.5, 2.6 + Math.sin(t * 9) * 0.05, -26.3], 0.5, 1.4); else hideFish();
    c.cam([{ t: 0, p: [10.2, 2.4, -22.4], l: [6.0, 1.3, -25.4], f: 46 }, { t: tN, p: [10.0, 2.3, -23.0], l: [6.0, 1.3, -25.4], f: 46 }]);
    if (t > tP) c.ui(card('🐟 PEIXE TODO DIA', { y: 90, b: '#30d060', s: pop(t, tP, 0.25) || 1 })); }
  else { hideFish(); deckPeople(c, 6, { x0: -3.5, z0: -24, cols: 6, dx: 1.3, a: (i) => i % 2 ? 'tinker' : 'think', e: 'happy', ry: 0, s: 0.66, seed: 8 });
    c.track('dito', [{ t: 0, p: [0, D, -21.5], ry: PI, a: 'talk', e2: 'happy' }]);
    c.cam([{ t: tN - 0.3, p: [0, 2.6, -29.5], l: [0, 0.8, -22.5], f: 50 }, { t: c.dur, p: [0.6, 2.4, -29], l: [0, 0.8, -22.5], f: 50 }]); c.chip(960, 90, '🪢 NÓ DE MARINHEIRO', 'gold', tN, 1e9); }
};

SHOTS.b11 = (c) => {
  const t = c.t; const tC = at(c, 'quando chove'), tG = at(c, 'guardam'); c.sfx('water', 0.4, 0.4); c.sfx('splash', tC + 0.4, 0.3);
  hideProps();
  if (t < tC - 0.2) { S(c, { tod: 'day' }); c.track('tati', [{ t: 0, p: [3.4, D, 10.0], ry: -2.6, a: 'hold', e2: 'happy', hold: 'cup' }]);
    c.cam([{ t: 0, p: [1.2, 2.2, 6.5], l: [4.6, 1.3, 11.4], f: 46 }, { t: tC, p: [1.5, 2.1, 7.2], l: [4.6, 1.3, 11.4], f: 46 }]);
    c.ui(card('🌊 ÁGUA DO MAR → 💧 ÁGUA DE BEBER', { y: 90, b: '#3ad6ff', s: pop(t, 0.4, 0.25) || 1 })); c.chip(960, 860, 'igual nos navios de cruzeiro', 'white', 1.2, 1e9); }
  else { S(c, { tod: 'storm', waves: 0.3, rain: 0.6, power: 0, tarp: true }); deckPeople(c, 4, { x0: -1.0, z0: 3.5, cols: 4, dx: 0.7, a: 'lookup', e: 'happy', ry: PI, seed: 2 });
    c.cam([{ t: tC - 0.2, p: [0, 2.6, -1.5], l: [0, 1.6, 6], f: 50 }, { t: c.dur, p: [0, 2.4, -0.5], l: [0, 1.6, 6], f: 50 }]);
    if (t > tG) c.ui(card('🌧️ CADA GOTA GUARDADA', { y: 90, b: '#30d060', s: pop(t, tG, 0.25) || 1 })); }
};

SHOTS.b12 = (c) => {
  const t = c.t; const tE = at(c, 'escorbuto'), tA = at(c, 'e aqui'); c.sfx('twinkle', 1.0, 0.4); c.sfx('error', tE, 0.4);
  hideProps(); const gr = clamp(0.1 + t / (tE * 0.9)); S(c, { tod: 'day', green: gr });
  c.track('ceci', [{ t: 0, p: [-1.2, D, -10], ry: -PI / 2 + 0.6, a: t < tE ? 'tinker' : 'talk', e2: 'happy' }]); c.track('nino', [{ t: 0, p: [-1.0, D, -12.2], ry: -PI / 2 + 0.2, a: 'idle', e2: 'happy' }]);
  c.cam([{ t: 0, p: [2.4, 3.6, -3.5], l: [-3.6, 0.9, -11], f: 48 }, { t: c.dur, p: [1.8, 3.2, -5.0], l: [-3.6, 0.9, -11], f: 48 }]);
  c.chip(960, 90, '🥬 HORTA NOS CONTÊINERES', 'green', 0.4, tE - 0.2);
  if (t > tE) c.ui(card('☠️ ESCORBUTO = FALTA DE <span style="color:#ffd21f">VITAMINA C</span>', { y: 90, b: '#ff3b30', s: pop(t, tE, 0.25) || 1 }));
  if (t > tA) c.ui(card('🍋 AQUI NÃO!', { y: 700, b: '#30d060', s: pop(t, tA, 0.25) || 1 }));
};

SHOTS.b13 = (c) => {
  const t = c.t; const tM = at(c, 'mais estrelas'), tN = at(c, 'O Nino aprende'); c.sfx('pad', 0, 0.4); c.sfx('twinkle', tM, 0.5);
  hideProps(); S(c, { tod: 'night', power: 0 });
  if (t < tN - 0.2) c.cam([{ t: 0, p: [0, 2, -18], l: [-20, 40, -120], f: 55 }, { t: tN, p: [0, 2, -18], l: [-10, 60, -120], f: 55 }]);
  else { c.track('tati', [{ t: 0, p: [-0.5, D, -27], ry: PI - 0.4, a: 'pointup', e2: 'happy' }]); c.track('nino', [{ t: 0, p: [0.5, D, -26.6], ry: PI - 0.2, a: 'lookup', e2: 'happy' }]);
    c.cam([{ t: tN - 0.2, p: [2.0, 1.6, -30.5], l: [0, 1.6, -26], f: 48 }, { t: c.dur, p: [1.6, 1.5, -30.2], l: [0, 1.7, -26], f: 48 }]); c.glow([0, 2.5, -29], 0x9ab4ff, 8); c.chip(960, 90, '⭐ NAVEGAR PELAS ESTRELAS', 'blue', tN, 1e9); }
};

SHOTS.b14 = (c) => {
  const t = c.t; const tF = at(c, 'peixes-voadores'), tC = at(c, 'caiu sozinho'); c.sfx('cheer', 0.4, 0.5); c.sfx('laugh', tC, 0.4); c.sfx('splash', tF, 0.3);
  S(c, { tod: 'dusk', power: 1, fish: t > tF - 0.5 ? 1 : 0 }); hideProps();
  deckPeople(c, 30, { a: (i) => i % 2 ? 'dance' : 'cheer', e: 'happy', ry: (0), seed: 5, kids: true, jump: true, z0: -22 });
  c.track('nino', [{ t: 0, p: [0.4, D, -18.6], ry: PI, a: 'cheer', e2: 'happy' }]);
  if (t > tC) fish(c, [0.3, D + 0.15, -19.6], 0.8, 1.2);
  c.cam([{ t: 0, p: [0, 3.0, -14], l: [0, 1.4, -26], f: 50 }, { t: c.dur, p: [0, 3.4, -12], l: [0, 2.0, -26], f: 50 }]);
  title(c, '🎉 1 ANO NO MAR', 0.3, { bg: '#d68a1c' }); if (t > tC) c.ui(card('🐟 CHUVA DE PEIXE-VOADOR', { y: 700, b: '#ffd21f', s: pop(t, tC, 0.25) || 1 }));
};

// ================= PREÇO =================
SHOTS.b15 = (c) => {
  const t = c.t; const tR = at(c, 'raspando'), tE = at(c, 'E tem gente'); c.sfx('wipe', 0.5, 0.4); c.sfx('wipe', 1.5, 0.4); c.sfx('cough', tE + 1, 0.4);
  hideProps();
  if (t < tE - 0.2) { S(c, { tod: 'day', rust: 1 }); c.track('tati', [{ t: 0, p: [-2.5, D, 15.2], ry: PI, a: 'wipe', e2: 'tired' }]);
    c.cam([{ t: 0, p: [0.8, 2.0, 11.5], l: [-2.5, 1.5, 15.5], f: 46 }, { t: tE, p: [0.4, 1.9, 12.2], l: [-2.5, 1.5, 15.5], f: 46 }]);
    cards(c, [[0.5, '🧂 O SAL COME TUDO', 960]], 90, '#ff3b30'); if (t > tR) c.chip(960, 860, '🔩 FERRO · FIOS · PARAFUSOS', 'red', tR, 1e9); }
  else { S(c, { tod: 'day', waves: 0.5 }); c.track('mec', [{ t: 0, p: [6.0, D, -24], ry: PI / 2, a: 'tired', e2: 'tired' }]); c.track('ceci', [{ t: 0, p: [5.0, D, -23.2], ry: PI / 2 + 0.4, a: 'talk', e2: 'worried', hold: 'cup' }]);
    c.cam([{ t: tE - 0.2, p: [9.8, 2.2, -21.0], l: [5.6, 1.3, -23.6], f: 46, r: 0.04 }, { t: c.dur, p: [9.6, 2.1, -21.6], l: [5.6, 1.3, -23.6], f: 46, r: -0.04 }]);
    c.ui(card('🤢 ENJOO POR SEMANAS', { y: 90, b: '#7ad860', s: pop(t, tE, 0.25) || 1 })); }
};

SHOTS.b16 = (c) => {
  const t = c.t; const tP = at(c, 'pipa gigante'), tE = at(c, 'Em 2008'); c.sfx('whoosh', tP, 0.5); c.sfx('wind', tP, 0.4);
  hideProps(); const k = clamp(prog(t, tP - 0.5, tE + 0.5)); S(c, { tod: 'day', kite: t < tP - 0.6 ? 0 : Math.max(0.05, k) });
  if (t < tP - 0.6) { c.track('tati', [{ t: 0, p: [0, D, -33], ry: PI, a: 'think', e2: 'neutral' }]); c.frame('tati', { yaw: 0.5, d: 3.4, h: 1.5, f: 46 });
    c.ui(card('⛽ COMBUSTÍVEL NÃO É INFINITO', { y: 90, b: '#ff3b30', s: pop(t, 0.4, 0.25) || 1 })); }
  else if (t < tE) { c.track('tati', [{ t: 0, p: [0, D, -33], ry: PI, a: 'cheer', e2: 'happy' }]);
    c.cam([{ t: tP - 0.6, p: [0, 3.2, -24], l: [0, 6, -60], f: 52 }, { t: tE, p: [0, 3.0, -27], l: [0, 18, -100], f: 52 }]); title(c, '🪁 UMA PIPA GIGANTE', tP, { bg: '#d62828' }); }
  else { c.cam([{ t: tE, p: [60, 30, 40], l: [0, 10, -60], f: 46 }, { t: c.dur, p: [50, 26, 30], l: [0, 10, -60], f: 46 }]); smoke(c, 0.4);
    c.ui(card('📅 2008: um cargueiro de verdade cruzou o oceano<br>puxado em parte por uma pipa (SkySails)', { y: 680, b: '#ffd21f', size: 40, s: pop(t, tE, 0.25) || 1 })); }
};

SHOTS.b17 = (c) => {
  const t = c.t; const tC = at(c, 'coração'), tD = at(c, 'O Seu Dito escuta'); c.sfx('engine', 0, 0.35); c.sfx('heartbeat', tC, 0.5);
  if (t < tD - 0.2) { hideProps(); S(c, { tod: 'day', kite: 1 }); smoke(c, 0.3); c.cam([{ t: 0, p: [-40, 12, 40], l: [0, 4, 10], f: 46 }, { t: tD, p: [-34, 10, 34], l: [0, 6, 20], f: 46 }]);
    c.ui(card('🪁 + ⚙️ = MENOS COMBUSTÍVEL', { y: 90, b: '#30d060', s: pop(t, 0.4, 0.25) || 1 })); if (t > tC) big(c, '❤️ O CORAÇÃO DO NAVIO', tC, { y: 900, size: 90, color: '#ff5a5a', glow: 'rgba(255,80,80,.6)' }); }
  else { ENG(c, { power: 0.7, shake: 0.4 }); c.track('dito', [{ t: 0, p: [3.2, 0, 1.6], ry: -0.9, a: 'think', e2: 'happy' }]);
    c.cam([{ t: tD - 0.2, p: [5.4, 1.9, 4.8], l: [2.2, 1.3, 0.6], f: 46 }, { t: c.dur, p: [5.0, 1.8, 4.2], l: [2.2, 1.3, 0.6], f: 46 }]); c.chip(960, 90, '🌙 TODA NOITE', 'blue', tD, 1e9); }
};

// ================= CTA =================
SHOTS.b18 = (c) => {
  const t = c.t; const tI = at(c, 'inscrever'); c.sfx('pop', 0.3, 0.5); c.sfx('click', tI + 1.1, 0.8); c.sfx('ding', tI + 1.15, 0.6);
  hideProps(); S(c, { tod: 'day', kite: 1 });
  c.track('tati', [{ t: 0, p: [-0.8, D, -24], ry: 0.15, a: t < tI ? 'wave' : 'point', e2: 'happy' }]);
  const jy = Math.max(0, Math.sin(t * 2.2)) * 0.5; c.track('nino', [{ t: 0, p: [0.6, D, -23.7], ry: -0.1, a: 'cheer', e2: 'happy', y: D + jy }]);
  c.cam([{ t: 0, p: [0, 1.7, -18.8], l: [-0.1, 1.3, -24], f: 44 }, { t: c.dur, p: [0, 1.7, -19.5], l: [-0.1, 1.3, -24], f: 44 }]);
  subBtn(c, tI);
};

// ================= O PORÉM =================
SHOTS.b19 = (c) => {
  const t = c.t; const tP = at(c, 'tem um porém'), tE = at(c, 'Em 1995'), tV = at(c, 'vinte e cinco'); c.sfx('dramatic', tP, 0.6); c.sfx('boom', tV, 0.6);
  hideProps(); S(c, { tod: 'day', waves: 0.4, rogue: { d: 140, ang: 0.15, h: 25 } });
  c.cam([{ t: 0, p: [30, 6, 10], l: [0, 6, -140], f: 46 }, { t: c.dur, p: [24, 5, 4], l: [0, 8, -140], f: 46 }]);
  if (t > tP && t < tE) { const k = ease.oo(prog(t, tP, tP + 0.25)); c.ui(stamp('TEM UM PORÉM', { top: 380, size: 110, s: 1.4 - 0.4 * k, a: k })); }
  if (t > tE) c.ui(card('📍 MAR DO NORTE · 1º DE JANEIRO DE 1995', { y: 90, b: '#7ab8ff', size: 44, s: pop(t, tE, 0.25) || 1 }));
  if (t > tV) { big(c, '🌊 25,6 METROS', tV, { y: 280, size: 120, color: '#ff3b30', glow: 'rgba(255,60,48,.6)' }); c.chip(960, 860, 'Onda de Draupner · ≈ um prédio de 8 andares', 'white', tV, 1e9); }
};

SHOTS.b20 = (c) => {
  const t = c.t; const tC = at(c, 'o céu fica'), tS = at(c, 'fala baixinho'); c.sfx('wind', tC, 0.5); c.sfx('dramatic', tS + 0.8, 0.5);
  hideProps(); const k = prog(t, tC, tC + 2.5); S(c, { tod: k > 0.5 ? 'storm' : 'dusk', waves: 0.25 + k * 0.4, power: 0 });
  if (t < tS - 0.2) { c.cam([{ t: 0, p: [-30, 10, 40], l: [0, 4, -40], f: 46 }, { t: tS, p: [-26, 9, 34], l: [0, 6, -60], f: 46 }]); c.chip(960, 90, '3 ANOS DEPOIS', 'white', 0.3, tC); if (t > tC) c.chip(960, 90, '🐦 OS PÁSSAROS SOMEM', 'red', tC + 1.2, 1e9); }
  else { c.track('dito', [{ t: 0, p: [0, D, -33], ry: PI, a: 'idle', e2: 'worried' }]); c.track('nino', [{ t: 0, p: [0.9, D, -32.4], ry: PI - 0.3, a: 'idle', e2: 'scared' }]);
    c.frame([0.4, D, -32.8], { yaw: PI + 0.35, d: 3.6, h: 1.4, f: 46, t0: tS - 0.2, to: { d: 3.0 } }); c.bubble(c.CH.dito, 'Essa é das grandes…', tS + 0.4, c.dur, [0, 2.3, 0]); }
};

// ================= CLÍMAX =================
SHOTS.b21 = (c) => {
  const t = c.t; const tA = at(c, 'A água do mar'); c.sfx('wind', 0, 0.7); c.sfx('splash', 0.8, 0.7); c.sfx('crash', 2.0, 0.5); lightning(c, [0.4, 2.6]);
  if (t < tA - 0.2) { hideProps(); S(c, storm(c)); const sp = Math.max(0, Math.sin(t * 2.6)); c.puffs([0, 1.0, -30], sp, { color: 0xe8f4f4, rise: 4, grow: 2.5, spread: 6, op: 0.7, speed: 1.2 });
    c.track('tati', [{ t: 0, p: [-6.3, D, -16.5], ry: -PI / 2, a: 'hold', e2: 'scared' }]); c.track('dito', [{ t: 0, p: [6.3, D, -17], ry: PI / 2, a: 'hold', e2: 'scared' }]);
    c.cam([{ t: 0, p: [0, 3.0, -9], l: [0, 1.4, -30], f: 52, r: -0.06 }, { t: tA, p: [0, 3.2, -10], l: [0, 1.6, -30], f: 52, r: 0.07 }]); c.shake(1.0, 7);
    c.ui(card('🌊 ONDAS DE 10 METROS', { y: 90, b: '#ff3b30', s: pop(t, 0.4, 0.25) || 1 })); }
  else { const tp = at(c, 'para'); const off = t > tp; ENG(c, { power: off ? 0.06 : 0.8, water: 0.25, shake: off ? 0 : 1.5, smoke: off ? 1 : 0 }); c.sfx('splash', tA, 0.6); c.sfx('blackout', tp, 0.7);
    c.track('mec', [{ t: 0, p: [2.5, 0, 0.6], ry: -0.9, a: off ? 'panic' : 'tinker', e2: 'scared' }]); c.cam([{ t: tA - 0.2, p: [4.5, 2.2, 4.2], l: [0, 1.2, -2.4], f: 48 }, { t: c.dur, p: [4.0, 2.0, 3.6], l: [0, 1.2, -2.4], f: 48 }]);
    if (off) { c.torch([3.5, 3, 3.5], [0, 0.8, -2.4], 20); title(c, 'O MOTOR PAROU', tp); } }
};

SHOTS.b22 = (c) => {
  const t = c.t; const tG = at(c, 'girar de lado'), tP = at(c, 'A pipa'), tO = at(c, 'E lá na frente'); c.sfx('wind', 0, 0.7); c.sfx('dramatic', tO, 0.6); lightning(c, [tO + 0.5]);
  hideProps();
  if (t < tP - 0.2) { const ang = lerp(0, 1.2, ease.io(prog(t, tG - 0.5, tP))); S(c, { ...storm(c), rogue: { d: 160, ang } });
    c.cam([{ t: 0, p: [0, 60, 40], l: [0, 0, -5], f: 46, r: 0 }, { t: tP, p: [0, 58, 36], l: [0, 0, -5], f: 46, r: 0.25 }]);
    c.ui(card('↩️ O NAVIO GIRA DE LADO', { y: 90, b: '#ff3b30', s: pop(t, tG, 0.25) || 1 })); }
  else if (t < tO - 0.2) { S(c, storm(c)); c.track('tati', [{ t: 0, p: [0, D, -33], ry: PI, a: 'shout', e2: 'scared' }]); c.frame('tati', { yaw: -0.5, d: 3.2, h: 1.5, f: 46 }); c.chip(960, 90, '🪁 PIPA RECOLHIDA', 'red', tP, 1e9); c.shake(0.6, 7); }
  else { S(c, { ...storm(c), rogue: { d: lerp(240, 190, prog(t, tO, c.dur)), ang: 1.2 } }); c.cam([{ t: tO - 0.2, p: [6.5, 3.2, -8], l: [-80, 12, -20], f: 46, r: 0.1 }, { t: c.dur, p: [6.4, 3.4, -9], l: [-80, 14, -20], f: 46, r: 0.14 }]);
    big(c, '🌊 ONDA GIGANTE', tO + 0.2, { y: 200, size: 100, color: '#ff3b30', glow: 'rgba(255,60,48,.6)' }); }
};

SHOTS.b23 = (c) => {
  const t = c.t; const tL = at(c, 'Tem uma página'), tA = at(c, 'âncora de mar'), tPq = at(c, 'um paraquedas'); c.sfx('footsteps', 0, 0.5); c.sfx('page', tL, 0.6); c.sfx('ding', tA, 0.5);
  hideProps(); S(c, storm(c)); c.shake(0.5, 7);
  const run = t < 2.0;
  c.track('nino', [{ t: 0, p: [0.2, D, -10], ry: PI, a: 'run', e2: 'scared', hold: 'book' }, { t: 2.0, p: [0.2, D, -33.6], ry: PI, a: run ? 'run' : 'hold', e2: 'worried', hold: 'book' }, { t: 2.01, p: [0.2, D, -33.6], ry: PI, a: 'hold', e2: 'worried', hold: 'book' }]);
  c.track('tati', [{ t: 0, p: [0.3, D, -36], ry: t < 1.6 ? PI : 0, a: t < tL ? 'idle' : 'think', e2: t < tA ? 'scared' : 'surprised' }]);
  if (run) c.frame('nino', { yaw: 0.6, d: 3.4, h: 0.9, f: 46 });
  else c.cam([{ t: 2.0, p: [3.4, 2.0, -32], l: [0.2, 1.1, -34.8], f: 46 }, { t: c.dur, p: [3.0, 1.9, -32.5], l: [0.2, 1.1, -34.8], f: 46 }]);
  if (t > tL) { const s = pop(t, tL, 0.3) || 1; c.ui(`<div class="abs" style="left:1240px;top:150px;width:560px;height:440px;background:#f4ecd8;border:6px solid #8a6a45;border-radius:14px;transform:rotate(3deg) scale(${s});box-shadow:0 20px 50px rgba(0,0,0,.5);color:#3a2a20;text-align:center;font-weight:900">
    <div style="font-size:40px;margin-top:22px">ÂNCORA DE MAR</div><svg width="440" height="250" viewBox="0 0 440 250"><path d="M20 70 L130 70 L150 40 L20 40 Z" fill="#555"/><path d="M150 55 L320 150" stroke="#8a6a45" stroke-width="5"/><path d="M320 150 L420 95 L420 205 Z" fill="none" stroke="#2a6ad6" stroke-width="6"/><path d="M0 95 Q 110 85 220 95 T 440 95" stroke="#3a86ff" stroke-width="4" fill="none"/></svg>
    <div style="font-size:30px;opacity:${t > tPq ? 1 : 0}">um paraquedas jogado pela proa</div></div>`); }
};

SHOTS.b24 = (c) => {
  const t = c.t; const tL = at(c, 'Mas têm'), tA = at(c, 'O Seu Dito amarra'), tJ = at(c, 'e eles jogam'); c.sfx('rustle', tL, 0.5); c.sfx('splash', tJ + 1.2, 0.8);
  S(c, { ...storm(c), drogue: t > tJ + 1.1 ? 0.15 : 0 }); c.shake(0.5, 7);
  if (t < tJ - 0.2) { c.track('dito', [{ t: 0, p: [-0.7, D, -33], ry: PI / 2, a: 'tinker', e2: 'angry' }]); c.track('tati', [{ t: 0, p: [2.1, D, -33.2], ry: -PI / 2, a: 'tinker', e2: 'worried' }]); tarpProp(c, [0.7, D + 0.3, -33.1], 0.9, 0.2);
    c.cam([{ t: 0, p: [0.7, 2.6, -28.4], l: [0.7, 0.8, -33.1], f: 48 }, { t: tJ, p: [1.0, 2.5, -28.9], l: [0.7, 0.8, -33.1], f: 48 }]); c.chip(960, 90, '🟦 A LONA DA CHUVA + 🪢 CORDA', 'blue', tL, 1e9); }
  else { const u = prog(t, tJ, tJ + 1.2); c.track('dito', [{ t: 0, p: [-0.5, D, -42.5], ry: PI, a: u < 1 ? 'carry' : 'point', e2: 'angry' }]); c.track('tati', [{ t: 0, p: [0.6, D, -42.3], ry: PI, a: u < 1 ? 'carry' : 'point', e2: 'scared' }]);
    if (u < 1) tarpProp(c, [0, lerp(1.6, -3.5, u * u), lerp(-43.2, -47, u)], 1.2, 0.3); else if (TARP) TARP.visible = false; hideFish();
    c.cam([{ t: tJ - 0.2, p: [4.2, 3.0, -37.5], l: [0, 0.2, -44.5], f: 50 }, { t: c.dur, p: [3.8, 3.2, -38], l: [0, -1, -46], f: 50 }]); c.chip(960, 90, '⬇️ PELA PROA', 'gold', tJ + 0.4, 1e9); }
};

SHOTS.b25 = (c) => {
  const t = c.t; const tV = at(c, 'Devagar'), tF = at(c, 'de frente pra onda'), tC = at(c, 'E ela chega'); c.sfx('whoosh', 0.3, 0.4); c.sfx('riser', tC - 0.5, 0.6);
  hideProps(); const ang = lerp(1.2, 0, ease.io(prog(t, tV, tF + 0.6))); const dg = clamp(0.15 + t / 2);
  if (t < tV) { S(c, { ...storm(c), drogue: dg }); c.cam([{ t: 0, p: [3.5, 3.2, -43], l: [0, -4.5, -56], f: 50 }, { t: tV, p: [3.2, 3.0, -43.5], l: [0, -4.5, -60], f: 50 }]); c.chip(960, 90, '🪂 A LONA ABRE E PUXA', 'blue', 0.4, 1e9); }
  else if (t < tC - 0.2) { S(c, { ...storm(c), drogue: 1, rogue: { d: 230, ang } }); c.cam([{ t: tV, p: [0, 60, 40], l: [0, 0, -5], f: 46, r: 0.25 }, { t: tC, p: [0, 62, 42], l: [0, 0, -5], f: 46, r: 0 }]);
    if (t > tF) c.ui(card('🚢 DE FRENTE PRA ONDA', { y: 90, b: '#30d060', s: pop(t, tF, 0.25) || 1 })); }
  else { S(c, { ...storm(c), drogue: 1, rogue: { d: lerp(120, 70, prog(t, tC, c.dur)), ang: 0 } }); c.cam([{ t: tC - 0.2, p: [2, 3.0, -28], l: [0, 14, -90], f: 52 }, { t: c.dur, p: [2, 2.8, -27], l: [0, 18, -90], f: 52 }]); c.shake(0.8, 7); }
};

SHOTS.b26 = (c) => {
  const t = c.t; const tS = at(c, 'sobe'), tP = at(c, 'passa por cima'), tL = at(c, 'Lá embaixo'), tR = at(c, 'volta a roncar'), tG = at(c, 'Trezentas pessoas'); c.sfx('riser', 0, 0.6); c.sfx('splash', tP, 0.8); c.sfx('engine', tR, 0.6); c.sfx('cheer', tG, 0.7);
  hideProps();
  if (t < tP) { const u = prog(t, 0, tP); S(c, { ...storm(c), drogue: 1, rogue: { d: lerp(85, 55, u), ang: 0 } });
    c.cam([{ t: 0, p: [1.5, 3.0, -26], l: [0, 10, -80], f: 54, r: 0 }, { t: tP, p: [1.5, 4.0, -27], l: [0, 34, -80], f: 54, r: 0.08 }]); c.shake(0.9, 6);
    if (t > tS) c.ui(card('⬆️ SOBE… SOBE…', { y: 90, b: '#ffd21f', s: pop(t, tS, 0.25) || 1 })); }
  else if (t < tL - 0.2) { const u = prog(t, tP, tL); S(c, { ...storm(c), drogue: 1, rogue: { d: lerp(-40, -70, u), ang: 0 } }); if (t < tP + 0.3) c.flash('#e8f4ff', 0.6 * (1 - (t - tP) / 0.3));
    c.cam([{ t: tP, p: [24, 16, -70], l: [0, 2, 10], f: 48 }, { t: tL, p: [22, 14, -66], l: [0, 2, 10], f: 48 }]);
    c.ui(card('✅ PASSOU POR CIMA!', { y: 90, b: '#30d060', s: pop(t, tP, 0.25) || 1 })); }
  else if (t < tG - 0.2) { const on = t > tR; ENG(c, { power: on ? 1 : 0.1, water: 0.25, shake: on ? 1 : 0 }); if (!on) c.torch([3.5, 3, 3.5], [0, 0.8, -2.4], 20);
    c.track('mec', [{ t: 0, p: [1.4, 0, -1.0], ry: -PI / 2, a: on ? 'cheer' : 'tinker', e2: on ? 'happy' : 'worried' }]); c.cam([{ t: tL - 0.2, p: [4.4, 2.2, 3.8], l: [0.5, 1.2, -1.6], f: 48 }, { t: tG, p: [4.0, 2.0, 3.4], l: [0.5, 1.2, -1.6], f: 48 }]);
    if (on) title(c, '⚙️ O MOTOR VOLTOU', tR); }
  else { S(c, { tod: 'storm', waves: 0.6, rain: 0.8, power: 1, tarp: false, drogue: 1 }); deckPeople(c, 30, { a: 'cheer', e: 'happy', ry: 0, seed: 7, kids: true, jump: true });
    c.track('nino', [{ t: 0, p: [0.3, D, -19], ry: PI, a: 'cheer', e2: 'happy' }]); c.track('tati', [{ t: 0, p: [-1.0, D, -19.3], ry: PI, a: 'cheer', e2: 'happy' }]);
    c.cam([{ t: tG - 0.2, p: [0, 3.0, -13.5], l: [0, 1.5, -24], f: 50 }, { t: c.dur, p: [0, 3.2, -12.5], l: [0, 1.6, -24], f: 50 }]); }
};

SHOTS.b27 = (c) => {
  const t = c.t; const tD = at(c, 'dois motores'), tA = at(c, 'e uma âncora'); c.sfx('tada', tD, 0.5); c.sfx('pop', tA, 0.5);
  hideProps(); S(c, { tod: 'day', engine2: true, kite: 1 }); smoke(c, 0.6); c.puffs([4.2, 13.9, 24.5], 0.4, { color: 0x666666, rise: 5, grow: 2 });
  if (t < tA - 0.2) { c.cam([{ t: 0, p: [-30, 14, 50], l: [0, 9, 22], f: 46 }, { t: tA, p: [-26, 13, 44], l: [0, 9, 22], f: 46 }]); if (t > tD) big(c, '⚙️⚙️ DOIS MOTORES', tD, { y: 200, size: 100, color: '#30d060', glow: 'rgba(60,220,100,.6)' }); }
  else { tarpProp(c, [0, 4.3, -38.4], 0.9, 0.1); c.track('nino', [{ t: 0, p: [1.0, D, -36.5], ry: PI + 0.6, a: 'pointup', e2: 'happy' }]);
    c.cam([{ t: tA - 0.2, p: [3.5, 2.2, -32], l: [0, 3.2, -38.4], f: 46 }, { t: c.dur, p: [3.1, 2.1, -32.6], l: [0, 3.2, -38.4], f: 46 }]); c.chip(960, 90, '🪂 ÂNCORA DE MAR COSTURADA À MÃO', 'blue', tA, 1e9); }
};

// ================= FINAL =================
SHOTS.b28 = (c) => {
  const t = c.t; const tC = at(c, 'cidade flutuante'), tF = at(c, 'Os filhos'), tR = at(c, 'o rádio'), tN = at(c, 'a névoa sumiu'); c.sfx('pad', 0, 0.4); c.sfx('splash', tF + 0.5, 0.3); c.sfx('radio', tR, 0.5); c.sfx('tada', tN, 0.5);
  hideProps();
  if (t < tF - 0.2) { S(c, { tod: 'day', more: true, kite: 1, engine2: true }); smoke(c, 0.4); c.cam([{ t: 0, p: [90, 50, 90], l: [0, 0, -5], f: 46 }, { t: tF, p: [70, 40, 70], l: [0, 0, -5], f: 46 }]); if (t > tC) title(c, '🏙️ CIDADE FLUTUANTE', tC, { bg: '#2a4ab0' }); }
  else if (t < tR - 0.2) { S(c, { tod: 'day', more: true }); for (let i = 0; i < 6; i++) c.mini(i, { p: [-12 + i * 1.6 + Math.sin(t * 2 + i) * 0.3, -4.9, -22 + (i % 2) * 2], ry: -PI / 2, a: 'surf', e: 'happy', s: 0.65 });
    c.cam([{ t: tF - 0.2, p: [-6.5, 2.5, -18], l: [-12, -4.4, -21], f: 48 }, { t: tR, p: [-6.5, 2.4, -19], l: [-12, -4.4, -21], f: 48 }]); c.chip(960, 90, '🏊 NADAR ANTES DE ANDAR', 'blue', tF, 1e9); }
  else { S(c, { tod: 'dusk', more: true, power: 1 }); c.track('tati', [{ t: 0, p: [-0.4, D, 12], ry: PI, a: 'phone', e2: t < tN ? 'neutral' : 'surprised', hold: 'phone' }]); c.frame('tati', { yaw: 0.3, d: 3.0, h: 1.45, f: 46, t0: tR - 0.2, to: { d: 2.6 } });
    c.bubble(c.CH.tati, '📻 …a névoa sumiu!', tN - 0.3, c.dur, [0, 2.3, 0]); if (t > tN) c.ui(card('🌍 DÁ PRA VOLTAR', { y: 700, b: '#30d060', s: pop(t, tN + 0.5, 0.25) || 1 })); }
};

SHOTS.b29 = (c) => {
  const t = c.t; const tF = at(c, 'fica'), tN = at(c, 'E o Nino'), tL = at(c, 'livro velho'); c.sfx('pad', 0, 0.4); c.sfx('twinkle', tL, 0.4);
  hideProps();
  if (t < tN - 0.2) { S(c, { tod: 'day', more: true, engine2: true }); smoke(c, 0.4); for (let i = 0; i < 12; i++) { const back = i % 3 === 0; c.mini(i, { p: [-5.6 + (i % 4) * 0.7, D, back ? -20 - i * 0.8 : -8 - i * 1.2 - ((t * 1.1) % 1.2)], ry: back ? 0 : -PI / 2 - 0.3, a: back ? 'wave' : 'walk', e: 'happy' }); }
    c.cam([{ t: 0, p: [4.5, 4, -2], l: [-6, 1, -18], f: 46 }, { t: tN, p: [4, 3.6, -4], l: [-6, 1, -18], f: 46 }]); c.chip(960, 90, '🏠 MUITA GENTE VOLTA', 'white', 0.3, tF); if (t > tF) c.chip(960, 90, '🚢 MUITA GENTE FICA', 'gold', tF, 1e9); }
  else { S(c, { tod: 'day', more: true, engine2: true, kite: 1 }); smoke(c, 0.4); c.track('ninoA', [{ t: 0, p: [0, D, -33], ry: PI, a: 'hold', e2: 'happy', hold: 'book' }]); c.frame('ninoA', { yaw: 0.45, d: 3.2, h: 1.5, f: 46, t0: tN - 0.2, to: { d: 2.7 } }); c.chip(960, 90, '⚓ CAPITÃO NINO', 'blue', tN, 1e9); }
};

SHOTS.b30 = (c) => {
  const t = c.t; const tR = at(c, 'Recomeçou porque'), tN = at(c, 'nunca parar'); c.sfx('pad', 0, 0.5);
  hideProps(); S(c, { tod: 'dusk', more: true, engine2: true, power: 1, kite: 1 }); smoke(c, 0.4);
  c.cam([{ t: 0, p: [-60, 18, 80], l: [0, 2, -10], f: 46 }, { t: c.dur, p: [-50, 14, 66], l: [0, 2, -10], f: 44 }]);
  if (t > tR) c.chip(960, 120, 'APRENDERAM A', 'white', tR, 1e9); if (t > tN) big(c, '🚢 NUNCA PARAR', tN, { y: 250, size: 110, color: '#ffd21f' });
  c.state.fade = prog(t, c.dur - 0.5, c.dur);
};

SHOTS.b31 = (c) => {
  const t = c.t; const tQ = at(c, 'Aguentaria'), tM = at(c, 'E deixa nos comentários'), tS = at(c, 'Se inscreve'), tB = at(c, 'Até lá'); c.sfx('whoosh', tM, 0.5); c.sfx('click', tS + 1.1, 0.8); c.sfx('ding', tS + 1.15, 0.6); c.sfx('tada', tB, 0.6);
  hideProps(); c.env('outro');
  const w = t > tB;
  [['tati', -3.0, 0.3], ['ceci', -1.0, 0.1], ['dito', 1.0, -0.1], ['nino', 3.0, -0.3]].forEach(([n, x, ry]) => c.track(n, [{ t: 0, p: [x, 0, 5.1], ry, a: w ? 'wave' : 'idle', e2: 'happy' }]));
  c.cam([{ t: 0, p: [0, 1.9, 12.4], l: [0, 2.0, 5], f: 42 }, { t: c.dur, p: [0, 2.0, 11.4], l: [0, 2.0, 5], f: 42 }]);
  if (t > tQ && t < tM - 0.2) { const a = clamp((t - tQ) / 0.4); c.ui(`<div class="abs" style="left:0;top:130px;width:1920px;text-align:center;font-weight:900;font-size:60px;color:#fff;opacity:${a};text-shadow:0 5px 0 #000">ANOS NUM NAVIO, SEM PISAR EM TERRA?</div>`);
    ['AGUENTO 🚢', 'NEM PENSAR 🤢'].forEach((l, i) => { const s = pop(t, tQ + 0.5 + i * 0.3, 0.25); c.ui(`<div class="abs" style="left:${500 + i * 480}px;top:240px;width:440px;padding:20px 0;text-align:center;border-radius:24px;background:${['#5aa8ff', '#ff6b4a'][i]};color:#111;font-weight:900;font-size:50px;white-space:nowrap;transform:scale(${s})">${l}</div>`); }); }
  if (t > tM - 0.2 && t < tS - 0.1) { c.ui(`<div class="abs" style="left:0;top:120px;width:1920px;text-align:center;font-weight:900;font-size:60px;color:#fff;text-shadow:0 5px 0 #000">PRÓXIMO EPISÓDIO</div>`); c.ui(bigNum('ONDE A HUMANIDADE RECOMEÇA? 💬', 960, 270, { size: 90, color: '#ffd21f', glow: 'rgba(255,210,31,.6)', s: pop(t, tM - 0.2, 0.3) || 1 })); }
  if (t > tS - 0.1) subBtn(c, tS);
};
