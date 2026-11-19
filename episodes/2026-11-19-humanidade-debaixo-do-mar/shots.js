// LONGO: "E se a humanidade tivesse que recomeçar debaixo do mar?" — palito, 1920x1080.
import { clamp, lerp, ease, PI, prog, center, stamp, bigNum, pop, seeded, subBtn } from '/engine/kit.js';
export const SHOTS = {};
const P0 = { num: null, flag: false };
export const CAST = {
  iara: { style: 'palito', ...P0, shirt: 0x0aa6b8, trim: 0xffd21f, shorts: 0x1d2a44, hair: 'lia', scale: 0.96 },
  davi: { style: 'palito', ...P0, shirt: 0x2fa35a, trim: 0x1a5a2a, shorts: 0x5a4a2a, cap: 0x2fa35a },
  sol: { style: 'palito', ...P0, shirt: 0xf4f4f4, trim: 0xff7a1a, shorts: 0xff7a1a, hair: 'lia', scale: 0.96 },
  kaue: { style: 'palito', ...P0, shirt: 0xff3b30, trim: 0xffffff, shorts: 0x222a44, cap: 0x111111, capYaw: PI },
};
const COLS = [0x0aa6b8, 0xff7a1a, 0x2fa35a, 0xf4f4f4, 0xd6a31c, 0x8a3ad6, 0x2a6ad6, 0xe02020];
const chipsAt = (c, list) => list.forEach(([w, x, y, txt, cls]) => { const tt = c.at(w); if (c.t >= tt) c.chip(x, y, txt, cls, tt, 1e9); });
const title = (c, txt, t0, o = {}) => { if (c.t < t0) return; const s = pop(c.t, t0, 0.3) || 1; c.ui(`<div class="abs" style="left:0;right:0;top:${o.top ?? 70}px;text-align:center;transform:scale(${s})"><div style="display:inline-block;background:${o.bg ?? '#d62828'};border:7px solid #fff;border-radius:22px;padding:6px 60px;font-weight:900;font-size:${o.size ?? 96}px;color:${o.color ?? '#fff'};transform:rotate(-2deg);box-shadow:0 14px 0 rgba(0,0,0,.45)">${txt}</div></div>`); };
// medidor do ar (CO2 subindo = ruim)
const airG = (c, v, o = {}) => { const col = v > 60 ? '#3ddc6a' : v > 30 ? '#ffb02e' : '#ff3b30'; c.ui(`<div class="abs" style="left:${o.x ?? 1440}px;top:${o.y ?? 60}px;width:420px;padding:16px 20px;border-radius:20px;background:rgba(10,10,14,.82);border:4px solid ${col}"><div style="font-weight:900;font-size:34px;color:#fff;letter-spacing:3px">💨 AR DA BASE</div><div style="margin-top:10px;height:34px;border-radius:10px;background:#222"><div style="height:100%;width:${clamp(v / 100) * 100}%;border-radius:10px;background:${col}"></div></div><div style="text-align:right;font-weight:900;font-size:52px;color:${col};margin-top:4px">${Math.round(v)}%</div></div>`); };
const card = (html, o = {}) => `<div class="abs" style="left:${o.x ?? 960}px;top:${o.y ?? 150}px;transform:translate(-50%,0) scale(${o.s ?? 1});opacity:${o.a ?? 1};background:rgba(8,20,32,.86);border:5px solid ${o.b ?? '#38d6ff'};border-radius:26px;padding:22px 44px;color:#fff;font-weight:900;font-size:${o.size ?? 50}px;text-align:center;white-space:nowrap">${html}</div>`;
const ring = (n, cx, cz, r0, o = {}) => { const R = seeded(o.seed || 5); const L = []; for (let i = 0; i < n; i++) { const a = i * 2.399 + R() * 0.3; const r = r0 + Math.sqrt(i) * (o.sp || 0.75); const x = cx + Math.cos(a) * r, z = cz + Math.sin(a) * r; L.push({ p: [x, 0, z], ry: Math.atan2(cx - x, cz - z) + (R() - 0.5) * 0.6, c: COLS[i % COLS.length], s: 0.85 + 0.15 * R(), a: o.a ? o.a(i) : 'idle' }); } return L; };
// figurantes dentro da sala (seahab): grade livre de móveis, x -1..3, z -2.8..-0.6 e perto da janela
const roomPeople = (c, n, o = {}) => { const R = seeded(o.seed || 3); let k = 0; for (let i = 0; i < n; i++) { const x = -0.6 + (i % 6) * 0.75 + (R() - 0.5) * 0.2, z = -2.6 + Math.floor(i / 6) * 0.85; if (z > 0.2) break; c.mini(k++, { p: [x, 0, z], ry: o.ry ?? 0, a: typeof o.a === 'function' ? o.a(i) : (o.a || 'idle'), e: o.e || 'neutral', s: 0.92 }); } };
const bubblesAt = (c, p, k = 1) => c.puffs(p, k, { color: 0xdff6ff, rise: 3, op: 0.5, speed: 0.6, grow: 0.3, spread: 0.6 });
// mergulhadores em fila: posições para os 3/4 heróis
const DIVERS = ['iara', 'kaue', 'davi', 'sol'];

// ================= GANCHO =================
SHOTS.b01 = (c) => {
  const t = c.t; const tC = c.at('Não tem céu'), tR = c.at('cada respiração'), tU = c.at('única casa'); c.sfx('water', 0, 0.5); c.sfx('riser', 0.3, 0.6); [tC, tR].forEach(q => c.sfx('pop', q, 0.6)); c.sfx('boom', tU, 0.9);
  c.env('sea', { fish: { x: 6, z: 0, r: 7, y: 3 } });
  if (t < tU) {
    c.cam([{ t: 0, p: [-20, 16, 22], l: [0, 2.6, -10], f: 46 }, { t: tU, p: [-7, 4.5, 7], l: [0, 2.6, -9], f: 46 }]);
    chipsAt(c, [['vinte metros', 380, 900, '20 m DE PROFUNDIDADE', 'blue'], ['Não tem céu', 960, 900, 'SEM CÉU', 'gold'], ['cada respiração', 1540, 900, 'AR FABRICADO', 'red']]);
  } else {
    DIVERS.forEach((n, i) => c.track(n, [{ t: 0, p: [-1.8 + i * 1.2, 0, -3.6], ry: PI, a: 'lookup', e2: 'neutral', suit: true }]));
    c.cam([{ t: tU, p: [0, 2.0, 4.5], l: [0, 2.6, -8], f: 50 }, { t: c.dur, p: [0, 3.0, 9.5], l: [0, 2.6, -8], f: 50 }]);
    c.ui(bigNum('100', 960, 170, { size: 170, color: '#ffd21f', glow: 'rgba(255,210,31,.7)', s: pop(t, tU, 0.3) || 1 })); c.chip(960, 290, 'PESSOAS', 'gold', tU, 1e9);
    c.flash('#ffffff', Math.max(0, 0.5 * (1 - (t - tU) / 0.25)));
  }
};

SHOTS.b02 = (c) => {
  const t = c.t; const tO = c.at('As ondas'), tA = c.at('o ar da base'); c.sfx('wind', 0, 0.7); c.sfx('crash', tO + 0.6, 0.6); c.sfx('alarm', tA, 0.4);
  if (t < tA) {
    const br = t > tO + 0.8; c.env('sea', { storm: 0.85, buoy: br ? 'broken' : true, alarm: br ? 1 : 0 }); c.shake(br ? 0.15 : 0.05);
    c.cam([{ t: 0, p: [-6, 18, 6], l: [0, 40, -12], f: 56 }, { t: tA, p: [-5, 22, 4], l: [0, 40, -11], f: 56 }]);
    if (t > tO) c.chip(960, 120, 'O CABO DE ENERGIA SE SOLTOU', 'red', tO + 0.8, 1e9);
  } else {
    c.env('seahab', { power: 0.35, alarm: 1, screen: 'red', haze: 0.3 });
    c.track('iara', [{ t: 0, p: [-4.6, 0, -1.0], ry: -PI / 2, a: 'panic', e2: 'scared' }]);
    c.cam([{ t: tA, p: [-1.4, 1.9, 1.8], l: [-4.8, 1.4, -1.0], f: 50 }, { t: c.dur, p: [-1.8, 1.8, 1.4], l: [-4.8, 1.4, -1.0], f: 48 }]);
    airG(c, lerp(78, 61, prog(t, tA, c.dur)));
  }
};

SHOTS.b03 = (c) => {
  const t = c.t; const tP = c.at('máquinas que limpam'), tG = c.at('gás carbônico'), tI = c.at('A Iara tem'), tV = c.at('voltar dois anos'); c.sfx('heartbeat', 0, 0.5); c.sfx('alarm', 0, 0.3); c.sfx('whoosh', tV, 0.7);
  c.env('seahab', { power: t > tP ? 0.2 : 0.35, alarm: 1, screen: 'red', haze: lerp(0.3, 0.8, prog(t, tG, tI)) });
  if (t < tI) {
    c.track('iara', [{ t: 0, p: [-4.4, 0, 2.0], ry: -PI * 0.7, a: 'lookup', e2: 'worried' }]);
    c.cam([{ t: 0, p: [-1.6, 1.6, 0.3], l: [-4.6, 1.8, 2.7], f: 48 }, { t: tI, p: [-2.2, 1.6, 0.6], l: [-4.6, 1.6, 2.7], f: 46 }]);
    if (t > tG) c.ui(card('CO₂ SUBINDO ↑', { y: 120, b: '#ff3b30', a: clamp((t - tG) / 0.3) }));
  } else {
    c.track('iara', [{ t: 0, p: [-4.6, 0, -1.0], ry: -PI / 2, a: 'tinker', e2: 'angry' }]);
    c.cam([{ t: tI, p: [-2.2, 1.7, 0.4], l: [-4.8, 1.4, -1.0], f: 46 }, { t: c.dur, p: [-3.2, 1.6, 0.2], l: [-4.8, 1.4, -1.0], f: 42 }]);
    if (t < tV) c.chip(960, 110, 'POUCAS HORAS', 'red', tI, tV);
    if (t > tV) { c.ui(center('2 ANOS ANTES', { top: 420, size: 140, color: '#ffd21f' })); c.flash('#ffffff', 0.6 * clamp(1 - (t - tV) / 0.4)); }
  }
  c.state.fade = prog(t, c.dur - 0.45, c.dur);
};

// ================= COMEÇO (navio) =================
// navio do env 'ocean': convés livre na proa, mundo z −17..−12, y 4.3, x −3..3
const DECK = (x, z) => [x, 4.3, z];
const deckCrowd = (c, n = 14) => { const R = seeded(8); for (let i = 0; i < n; i++) c.mini(i, { p: DECK(-2.6 + (i % 7) * 0.85, -16.6 + Math.floor(i / 7) * 0.8 + R() * 0.2), ry: 0, a: i % 3 ? 'idle' : 'lookaround', e: i % 2 ? 'happy' : 'neutral', s: 0.9 }); };
SHOTS.b04 = (c) => {
  const t = c.t; const tI = c.at('a Iara'), tN = c.at('num navio'), tB = c.at('bem embaixo'); c.sfx('waves', 0, 0.6); c.sfx('pop', tI + 0.3, 0.5); c.sfx('whoosh', tB, 0.6);
  c.state.fade = 1 - prog(t, 0, 0.5);
  c.env('ocean', {});
  if (t < tN) {
    c.track('iara', [{ t: 0, p: DECK(0.2, -13.2), ry: 0.2, a: 'idle', e2: 'happy' }]); deckCrowd(c);
    c.cam([{ t: 0, p: [1.0, 5.9, -9.6], l: [0.2, 5.3, -13.2], f: 46 }, { t: tN, p: [0.8, 5.9, -10.2], l: [0.2, 5.3, -13.2], f: 46 }]);
    if (t > tI) c.chip(960, 110, 'IARA · 29 ANOS · ENGENHEIRA NAVAL', 'gold', tI, tN);
  } else if (t < tB) {
    c.cam([{ t: tN, p: [40, 18, 10], l: [0, 3, -40], f: 46 }, { t: tB, p: [34, 14, 0], l: [0, 3, -40], f: 46 }]);
    c.chip(960, 120, '100 PESSOAS A BORDO', 'blue', tN, 1e9);
  } else {
    c.env('sea', { fish: { x: 2, z: -2, r: 6, y: 4 } });
    c.cam([{ t: tB, p: [6, 14, 8], l: [0, 2, -10], f: 50 }, { t: c.dur, p: [6, 6, 6], l: [0, 2.4, -10], f: 50 }]);
    c.ui(bigNum('↓ 20 METROS', 960, 200, { size: 120, color: '#38d6ff', glow: 'rgba(56,214,255,.6)', s: pop(t, tB, 0.3) || 1 }));
  }
};

SHOTS.b05 = (c) => {
  const t = c.t; const ts = [c.at('o Davi'), c.at('Uma médica'), c.at('E o Kauê'), c.at('tubarão')]; ts.slice(0, 3).forEach(q => c.sfx('pop', q + 0.3, 0.6)); c.sfx('laugh', ts[3] + 0.3, 0.5);
  c.env('ocean', {}); deckCrowd(c, 10);
  const who = [['davi', -1.4, 'DAVI · BIÓLOGO MARINHO', 'green'], ['sol', 0.0, 'DRA. SOL · MÉDICA DE MERGULHO', 'blue'], ['kaue', 1.4, 'KAUÊ · 23 · MERGULHADOR', 'gold']];
  c.track('iara', [{ t: 0, p: DECK(2.4, -13.6), ry: -0.5, a: 'idle', e2: 'happy' }]);
  who.forEach(([n, x], i) => c.track(n, [{ t: 0, p: DECK(x, -13.0), ry: 0, a: i === 2 && t > ts[3] ? 'clap' : 'idle', e2: i === 2 && t > ts[3] ? 'happy' : 'neutral' }]));
  const k = t < ts[1] ? 0 : t < ts[2] ? 1 : 2; const [n, x, txt, cls] = who[k];
  c.frame(n, { d: 3.0, h: 1.5, up: 0.25, yaw: k === 1 ? -0.25 : 0.25, f: 44 });
  c.chip(960, 110, txt, cls, ts[k], 1e9);
  if (t > ts[3]) c.ui(bigNum('🦈 😂', 1450, 380, { size: 110, s: pop(t, ts[3], 0.3) || 1 }));
};

SHOTS.b06 = (c) => {
  const t = c.t; const tN = c.at('Nem comida'), tT = c.at('tirar do mar'); c.sfx('boom', 0.1, 0.7); c.sfx('pop', tN, 0.5); c.sfx('pop', tN + 0.8, 0.5); c.sfx('pop', tN + 1.6, 0.5);
  c.env('ocean', {}); deckCrowd(c);
  DIVERS.forEach((n, i) => c.track(n, [{ t: 0, p: DECK(-1.8 + i * 1.2, -13.2), ry: 0, a: t > tT ? 'think' : 'idle', e2: t > tT ? 'worried' : 'neutral' }]));
  c.cam([{ t: 0, p: [0, 6.9, -7.6], l: [0, 5.6, -14], f: 50 }, { t: c.dur, p: [0, 6.6, -8.4], l: [0, 5.6, -14], f: 50 }]);
  title(c, 'REGRA Nº 1', 0.1);
  if (t > tN) { const L = [['SEM COMIDA', '#ff7a45'], ['SEM PEÇAS', '#ffb02e'], ['SEM GENTE', '#ff3b30']]; L.forEach(([w, col], i) => { const tt = tN + i * 0.8; if (t > tt) c.ui(bigNum('✖ ' + w, 480 + i * 480, 245, { size: 62, color: col, s: pop(t, tt, 0.25) || 1 })); }); }
  if (t > tT) c.chip(960, 880, 'TUDO VEM DO MAR', 'blue', tT, 1e9);
};

SHOTS.b07 = (c) => {
  const t = c.t; const tA = c.at('A cada dez'), tV = c.at('A vinte metros'), tX = c.at('três vezes'); c.sfx('water', 0, 0.6); c.sfx('heartbeat', tV, 0.5); c.sfx('boom', tX, 0.6);
  c.env('sea', { fish: { x: 0, z: -2, r: 6, y: 6 } });
  const u = ease.io(prog(t, 0, c.dur * 0.85)); const y = lerp(18, 0, u);
  DIVERS.forEach((n, i) => c.track(n, [{ t: 0, p: [-1.6 + i * 1.05, y, -1.5 + (i % 2) * 0.6], ry: 0.2, a: u < 1 ? 'lookdown' : 'idle', e2: t > tX ? 'worried' : 'neutral', suit: true }]));
  bubblesAt(c, [0, y + 2.2, -1.2], 0.8);
  c.camSet([2.2, y + 1.4, 6.2], [0, y + 1.0, -1.2], 50);
  const depth = Math.round(lerp(0, 20, u)), atm = (1 + depth / 10).toFixed(1).replace('.', ',');
  c.ui(`<div class="abs" style="left:70px;top:70px;padding:18px 30px;border-radius:20px;background:rgba(8,20,32,.85);border:4px solid #38d6ff;color:#fff;font-weight:900;font-size:46px">↓ ${depth} m<br><span style="color:${t > tX ? '#ff3b30' : '#ffd21f'}">${atm} atm</span></div>`);
  if (t > tA && t < tV) c.chip(960, 120, '+10 m = +1 ATMOSFERA', 'gold', tA, tV);
  if (t > tX) c.ui(bigNum('3× A PRESSÃO', 1300, 300, { size: 110, color: '#ff3b30', glow: 'rgba(255,59,48,.5)', s: pop(t, tX, 0.3) || 1 }));
};

SHOTS.b08 = (c) => {
  const t = c.t; const tK = c.at('O Kauê entra'), tM = c.at('tira a máscara'), tR = c.at('Ar de verdade'); c.sfx('splash', tK + 0.6, 0.6); c.sfx('aww', tR, 0.4);
  if (t < tK) {
    c.env('sea', { fish: { x: -10, z: 3, r: 5, y: 1.8 } });
    c.cam([{ t: 0, p: [-14, 6, 10], l: [-4, 2, -8], f: 46 }, { t: tK, p: [-6, 4, 9], l: [0, 2.4, -9], f: 46 }]);
    c.chip(960, 110, 'BASE MONTADA DO LADO DO RECIFE', 'blue', 0.3, 1e9);
  } else {
    c.env('seahab', { fish: true });
    const yk = lerp(-1.6, 0, ease.oo(prog(t, tK, tK + 1.4)));
    c.track('kaue', [{ t: 0, p: [3.6, yk, 1.4], ry: -2.3, a: t < tM ? 'idle' : t < tR ? 'shrug' : 'cheer', e2: t < tR ? 'neutral' : 'happy', suit: t < tM }]);
    c.track('iara', [{ t: 0, p: [1.8, 0, -0.3], ry: 2.2, a: 'clap', e2: 'happy' }]);
    if (t > tK + 0.4) c.puffs([3.6, 0.1, 1.4], clamp(1 - (t - tK - 0.4) / 1.2), { color: 0xffffff, rise: 0.8, op: 0.5, speed: 1.2 });
    c.cam([{ t: tK, p: [0.6, 1.9, 3.3], l: [3.4, 1.0, 1.0], f: 52 }, { t: c.dur, p: [1.1, 1.8, 3.2], l: [3.5, 1.3, 1.0], f: 48 }]);
    c.chip(960, 110, 'A PISCINA É A PORTA', 'gold', tK + 0.3, tR);
    if (t > tR) c.chip(960, 110, 'AR DE VERDADE, A 20 m', 'green', tR, 1e9);
  }
};

// ================= VANTAGENS =================
SHOTS.b09 = (c) => {
  const t = c.t; const tA = c.at('Água, por exemplo'), tM = c.at('Uma máquina'), tB = c.at('água de beber'); c.sfx('twinkle', 0, 0.5); c.sfx('water', tM, 0.5); c.sfx('ding', tB, 0.6);
  c.env('seahab', { fish: true });
  c.track('iara', [{ t: 0, p: [-0.6, 0, -1.8], ry: 0.3, a: 'idle', e2: 'happy' }, { t: tB - 0.3, p: [-0.6, 0, -1.8], ry: 0.3, a: 'eat', e2: 'happy', hold: 'cup' }]);
  c.cam([{ t: 0, p: [1.6, 1.7, 2.6], l: [-0.6, 1.3, -1.8], f: 46 }, { t: c.dur, p: [1.0, 1.6, 1.6], l: [-0.6, 1.4, -1.8], f: 44 }]);
  title(c, 'O LADO BOM', 0.2, { bg: '#1c9a4a', size: 80 });
  if (t > tM) { const a = clamp((t - tM) / 0.3); c.ui(card(`🌊 ÁGUA DO MAR <span style="color:#38d6ff">→</span> ⚙️ TIRA O SAL <span style="color:#38d6ff">→</span> ${t > tB ? '<span style="color:#3ddc6a">🥤 ÁGUA DE BEBER</span>' : '…'}`, { y: 190, a, size: 46 })); }
};

SHOTS.b10 = (c) => {
  const t = c.t; const tF = c.at('fazenda de algas'), tK = c.at('pode crescer'), tS = c.at('sessenta centímetros'); c.sfx('water', 0, 0.4); c.sfx('pop', tF, 0.5); c.sfx('riser', tK, 0.4); c.sfx('ding', tS + 0.8, 0.6);
  const kg = t < tF ? 0.15 : lerp(0.15, 1, ease.io(prog(t, tF, tS + 1.5)));
  c.env('sea', { kelp: kg, fish: { x: 13, z: 3, r: 4, y: 5, n: 20 } });
  c.track('davi', [{ t: 0, p: [11.4, 0, 6.3], ry: PI * 0.85, a: t < tF ? 'idle' : 'point', e2: 'happy', suit: true }]);
  c.cam([{ t: 0, p: [7.4, 2.4, 12.2], l: [12, 1.6, 4], f: 50 }, { t: c.dur, p: [6.4, 3.0, 13.4], l: [13, 2.6, 3], f: 50 }]);
  if (t > tS) c.ui(bigNum('ATÉ 60 cm POR DIA', 960, 180, { size: 100, color: '#3ddc6a', glow: 'rgba(61,220,106,.5)', s: pop(t, tS, 0.3) || 1 }));
  if (t > tK) c.chip(1700, 60, 'FONTE: NOAA', 'white', tK, 1e9);
};

SHOTS.b11 = (c) => {
  const t = c.t; const tO = c.at('Os oceanos'), tB = c.at('dentro da base'), tQ = c.at('quebrar a água'); c.sfx('twinkle', tO, 0.5); c.sfx('zip', tQ, 0.5); c.sfx('ding', tQ + 1.5, 0.5);
  if (t < tB) {
    c.env('sea', { fish: { x: 2, z: 0, r: 8, y: 6 }, light: 1 });
    c.cam([{ t: 0, p: [0, 3, 10], l: [0, 12, -10], f: 54 }, { t: tB, p: [0, 3, 8], l: [0, 16, -10], f: 54 }]);
    if (t > tO) c.ui(bigNum('~50% DO OXIGÊNIO', 960, 200, { size: 110, color: '#38d6ff', glow: 'rgba(56,214,255,.6)', s: pop(t, tO + 0.6, 0.3) || 1 }));
    if (t > tO) c.chip(960, 330, 'VEM DO OCEANO (NOAA)', 'blue', tO + 0.6, 1e9);
  } else {
    c.env('seahab', {});
    c.track('iara', [{ t: 0, p: [-4.3, 0, 1.9], ry: -0.8, a: 'tinker', e2: 'happy', hold: 'wrench' }]);
    c.cam([{ t: tB, p: [-2.2, 1.8, 0.2], l: [-4.7, 1.3, 2.4], f: 48 }, { t: c.dur, p: [-2.5, 1.8, 0.4], l: [-4.7, 1.4, 2.4], f: 46 }]);
    if (t > tQ) c.ui(card(`💧 ÁGUA + ⚡ = <span style="color:#38d6ff">OXIGÊNIO</span>`, { y: 110, a: clamp((t - tQ) / 0.3) }));
    bubblesAt(c, [-5.1, 1.0, 2.6], 0.5);
  }
};

SHOTS.b12 = (c) => {
  const t = c.t; const tA = c.at('Atlântida'), tK = c.at('o Kauê aposta'), tD = c.at('todo mundo dorme'); c.sfx('cheer', 0.2, 0.4); c.sfx('tada', tA, 0.6); c.sfx('whoosh', tK + 0.3, 0.5); c.sfx('pad', tD, 0.4);
  if (t < tK) {
    c.env('sea', { fish: { x: 4, z: 2, r: 7, y: 3 } });
    c.cam([{ t: 0, p: [6, 3.4, 8], l: [0, 3.4, -8], f: 46 }, { t: tK, p: [3, 3.2, 6], l: [0, 3.8, -8], f: 46 }]);
    if (t > tA) title(c, 'ATLÂNTIDA', tA, { bg: '#0d3b66', color: '#ffd21f' });
  } else if (t < tD) {
    const u = t - tK; c.env('sea', { fish: { x: 2 + u * 3.2, z: 4, r: 1.4, y: 1.4, speed: 0.6 } });
    c.track('kaue', [{ t: 0, p: [-2 + u * 3.2, 0, 2.6], ry: PI / 2, a: 'run', e2: 'happy', suit: true }]);
    c.camSet([-1 + u * 3.2, 1.8, 8.5], [-1 + u * 3.2, 1.2, 2.6], 48);
    bubblesAt(c, [-2 + u * 3.2, 2.0, 2.6], 0.5);
  } else {
    c.env('seahab', { fish: true, power: 0.25 });
    const L = [['iara', -1.0, 'happy'], ['davi', 0.0, 'neutral'], ['sol', 1.0, 'happy'], ['kaue', 2.0, 'tired']];
    L.forEach(([n, x, e], i) => c.track(n, [{ t: 0, p: [x * 0.9, 0, -1.6 + (i % 2) * 0.3], ry: PI, a: 'floor', e2: e }]));
    c.cam([{ t: tD, p: [0.3, 1.3, 2.2], l: [0, 1.4, -3.5], f: 50 }, { t: c.dur, p: [0.3, 1.4, 1.6], l: [0, 1.5, -3.5], f: 50 }]);
  }
};

// ================= PREÇO =================
SHOTS.b13 = (c) => {
  const t = c.t; const tP = c.at('Com a pressão'), tS = c.at('se alguém subir'), tB = c.at('bolhas no sangue'), tD = c.at('doença descompressiva'); c.sfx('dramatic', 0.05, 0.6); c.sfx('riser', tS, 0.4); c.sfx('boom', tB, 0.6);
  c.env('seahab', { fish: true, power: 0.85 });
  c.track('sol', [{ t: 0, p: [-0.4, 0, -2.4], ry: 0.35, a: 'talk', e2: 'worried' }, { t: tB, p: [-0.4, 0, -2.4], ry: 0.35, a: 'point', e2: 'scared' }]);
  c.track('kaue', [{ t: 0, p: [0.9, 0, -2.2], ry: -1.2, a: 'idle', e2: 'neutral' }, { t: tB, p: [0.9, 0, -2.2], ry: -1.2, a: 'hurt', e2: 'scared' }]);
  c.cam([{ t: 0, p: [1.6, 1.7, 2.4], l: [0.2, 1.3, -2.0], f: 46 }, { t: c.dur, p: [1.2, 1.6, 1.6], l: [0.2, 1.3, -2.0], f: 44 }]);
  if (t < tB) title(c, 'O MAR NÃO PERDOA', 0.1, { size: 76 });
  if (t > tP && t < tB) c.chip(960, 880, 'MAIS PRESSÃO = MAIS NITROGÊNIO NO CORPO', 'gold', tP + 0.5, tB);
  if (t > tB) { let h = ''; for (let i = 0; i < 14; i++) { const x = 200 + ((i * 137) % 1500), y = 900 - ((t - tB) * (120 + (i % 5) * 40) + i * 53) % 700, r = 14 + (i % 4) * 8; h += `<div class="abs" style="left:${x}px;top:${y}px;width:${r * 2}px;height:${r * 2}px;border-radius:50%;border:5px solid #ff6b6b;background:rgba(255,80,80,.25)"></div>`; } c.ui(h); c.ui(bigNum('BOLHAS NO SANGUE', 960, 170, { size: 104, color: '#ff3b30', glow: 'rgba(255,59,48,.6)', s: pop(t, tB, 0.3) || 1 })); }
  if (t > tD) c.chip(960, 290, 'DOENÇA DESCOMPRESSIVA', 'red', tD, 1e9);
};

SHOTS.b14 = (c) => {
  const t = c.t; const tA = c.at('Aquarius'), tH = c.at('dezessete horas'), tO = c.at('Ou seja'); c.sfx('tick', tH, 0.6); c.sfx('boom', tO + 1.2, 0.5);
  c.env('sea', { fish: { x: 3, z: 0, r: 7, y: 5 } });
  if (t < tO) {
    c.cam([{ t: 0, p: [-13, 7, 12], l: [0, 2.6, -10], f: 46 }, { t: tO, p: [-9, 5, 10], l: [0, 2.6, -10], f: 46 }]);
    if (t > tA) c.ui(card(`🔬 LABORATÓRIO AQUARIUS · FLÓRIDA<br><span style="color:#38d6ff">~19 m de profundidade</span>`, { y: 90, a: clamp((t - tA) / 0.3), size: 46 }));
    if (t > tH) c.ui(bigNum('~17 HORAS', 960, 560, { size: 150, color: '#ffd21f', glow: 'rgba(255,210,31,.6)', s: pop(t, tH, 0.3) || 1 })), c.chip(960, 690, 'PRA VOLTAR À SUPERFÍCIE', 'gold', tH, 1e9);
  } else {
    DIVERS.slice(0, 3).forEach((n, i) => c.track(n, [{ t: 0, p: [-1.2 + i * 1.2, 0, -3.4], ry: PI, a: 'lookup', e2: 'worried', suit: true }]));
    c.cam([{ t: tO, p: [0.3, 0.6, 1.5], l: [0, 4, -6], f: 54 }, { t: c.dur, p: [0.3, 0.6, 2.2], l: [0, 4.5, -6], f: 54 }]);
    c.ui(stamp('NINGUÉM SOBE CORRENDO', { top: 120, s: pop(t, tO + 1.2, 0.3) || 1, a: t > tO + 1.2 ? 1 : 0 }));
  }
};

SHOTS.b15 = (c) => {
  const t = c.t; const tV = c.at('o vermelho'), tZ = c.at('tudo é azul'), tS = c.at('Então a doutora'), tH = c.at('uma hora por dia'); c.sfx('whoosh', tV, 0.5); c.sfx('power', tH, 0.6);
  if (t < tS) {
    c.env('sea', { fish: { x: 0, z: 0, r: 6, y: 3 } }); c.cam([{ t: 0, p: [4, 3, 8], l: [-8, 2, -2], f: 50 }, { t: tS, p: [3, 2.6, 6], l: [-10, 1.5, 0], f: 50 }]);
    const cols = [['#ff3030', 0.6], ['#ff9a30', 1.3], ['#ffe030', 2.0], ['#3ddc6a', 2.7], ['#2fa0ff', 99], ['#6a5aff', 99]]; const k = prog(t, tV - 0.3, tZ + 1);
    c.ui(`<div class="abs" style="left:560px;top:90px;width:800px;padding:18px;border-radius:22px;background:rgba(8,20,32,.85);display:flex;gap:10px">${cols.map(([col, d], i) => `<div style="flex:1;height:70px;border-radius:12px;background:${col};opacity:${k * 3 > d ? 0.08 : 1};transition:none"></div>`).join('')}</div>`);
    if (t > tV) c.chip(960, 230, 'O VERMELHO SOME PRIMEIRO', 'red', tV, 1e9);
  } else {
    c.env('seahab', { sun: t > tH ? 1 : 0.1, fish: true });
    ['iara', 'davi', 'sol', 'kaue'].forEach((n, i) => c.track(n, [{ t: 0, p: [-0.6 + i * 0.75, 0, 0.3 + (i % 2) * 0.35], ry: PI * 0.1, a: t > tH ? (i === 3 ? 'dance' : 'lookup') : 'idle', e2: t > tH ? 'happy' : 'neutral' }]));
    c.cam([{ t: tS, p: [0.6, 1.7, 3.3], l: [0.6, 1.4, 0.4], f: 56 }, { t: c.dur, p: [0.6, 1.8, 3.2], l: [0.6, 1.7, 0.4], f: 56 }]);
    if (t > tH) c.ui(bigNum('☀️ 1 HORA POR DIA', 960, 150, { size: 96, color: '#ffd21f', glow: 'rgba(255,210,31,.6)', s: pop(t, tH, 0.3) || 1 }));
  }
};

SHOTS.b16 = (c) => {
  const t = c.t; const tS = c.at('inscrever'), tL = c.at('deixa o like'); c.sfx('click', tS + 1.1, 0.8); c.sfx('ding', tS + 1.15, 0.6); c.sfx('pop', tL + 0.3, 0.8);
  c.env('seahab', { fish: true });
  c.track('iara', [{ t: 0, p: [-0.6, 0, -2.2], ry: 0.25, a: 'wave', e2: 'happy' }]);
  c.track('kaue', [{ t: 0, p: [0.6, 0, -2.1], ry: -0.25, a: 'idle', e2: 'happy' }]);
  c.cam([{ t: 0, p: [-0.3, 1.5, 2.6], l: [0, 1.3, -2.2], f: 42 }, { t: c.dur, p: [0.3, 1.5, 1.9], l: [0, 1.35, -2.2], f: 40 }]);
  subBtn(c, tS);
  if (t > tL) c.ui(bigNum('👍 +1', 1400, 560, { size: 80, color: '#2b7bff', s: pop(t, tL, 0.3) || 1 }));
};

// ================= A CONTA =================
SHOTS.b17 = (c) => {
  const t = c.t; const tP = c.at('Cada pessoa'), tC = c.at('Cem pessoas'), tF = c.at('base fechada'); c.sfx('chalk', tP, 0.5); c.sfx('chalk', tC, 0.5); c.sfx('heartbeat', tF, 0.6);
  c.env('seahab', { fish: true });
  roomPeople(c, 12, { ry: 0.3, a: (i) => (i % 3 ? 'idle' : 'talk'), e: 'neutral' });
  c.track('davi', [{ t: 0, p: [-2.4, 0.22, 1.7], ry: PI, a: 'sit', e2: 'worried' }]);
  c.cam([{ t: 0, p: [2.6, 2.6, 3.2], l: [-0.6, 1.0, -1.2], f: 52 }, { t: c.dur, p: [2.0, 2.4, 2.4], l: [-0.6, 1.0, -1.2], f: 50 }]);
  if (t > tP) c.ui(card(`1 PESSOA = <span style="color:#ffb02e">~1 kg de CO₂ por dia</span>`, { y: 120, a: clamp((t - tP) / 0.3), size: 48 }));
  if (t > tC) c.ui(bigNum('100 kg / DIA', 960, 620, { size: 130, color: '#ff3b30', glow: 'rgba(255,59,48,.5)', s: pop(t, tC + 0.6, 0.3) || 1 }));
  if (t > tP) c.chip(1700, 60, 'FONTE: NASA', 'white', tP, 1e9);
};

SHOTS.b18 = (c) => {
  const t = c.t; const tF = c.at('funcionam o tempo'), tI = c.at('único inimigo'), tE = c.at('falta de energia'); c.sfx('crank', 0, 0.4); c.sfx('flicker', tE, 0.6); c.sfx('blackout', tE + 0.5, 0.6);
  const fl = t > tE ? (Math.sin(t * 40) > 0.3 ? 0.2 : 0.9) : 1; c.env('seahab', { power: t > tE + 0.8 ? 0.15 : fl });
  c.track('iara', [{ t: 0, p: [-3.0, 0, 2.4], ry: -1.25, a: t > tE ? 'lookaround' : 'idle', e2: t > tE ? 'scared' : 'neutral' }]);
  c.cam([{ t: 0, p: [-1.2, 2.0, -0.6], l: [-4.6, 1.6, 2.7], f: 50 }, { t: c.dur, p: [-1.8, 1.9, -0.3], l: [-4.6, 1.6, 2.7], f: 46 }]);
  if (t > tF) c.chip(960, 110, '24 HORAS POR DIA', 'blue', tF, tE);
  if (t > tE) c.ui(bigNum('⚡ FALTA DE ENERGIA', 960, 200, { size: 100, color: '#ff3b30', glow: 'rgba(255,59,48,.6)', s: pop(t, tE, 0.3) || 1 }));
};

SHOTS.b19 = (c) => {
  const t = c.t; const tP = c.at('tem um porém'), tB = c.at('uma boia'), tC = c.at('presa à base'); c.sfx('boom', tP, 0.8); c.sfx('whoosh', tB, 0.6);
  c.env('sea', { fish: { x: 3, z: 0, r: 7, y: 6 } });
  if (t < tB) { c.cam([{ t: 0, p: [-8, 3, 6], l: [0, 2.6, -10], f: 48 }, { t: tB, p: [-7, 3, 5], l: [0, 2.6, -10], f: 48 }]); c.ui(stamp('TEM UM PORÉM', { top: 360, s: pop(t, tP, 0.3) || 1, a: t > tP ? 1 : 0 })); }
  else { const u = ease.io(prog(t, tB, c.dur)); c.camSet([-6, lerp(4, 28, u), 6], [0, lerp(8, 40, u), -10], 54); c.tag([0, 39.6, -10], 'BOIA SOLAR', 'gold', tB + 1, 1e9); if (t > tC) c.chip(960, 880, 'UM CABO LIGA A BOIA À BASE', 'gold', tC, 1e9); }
};

SHOTS.b20 = (c) => {
  const t = c.t; const tO = c.at('As ondas'), tB = c.at('a boia é'); c.sfx('wind', 0, 0.6); c.sfx('crash', tO + 0.5, 0.5);
  const st = lerp(0.2, 1, prog(t, 0, tO + 1)); c.env('sea', { storm: st }); c.shake(0.05 * st);
  c.cam([{ t: 0, p: [-8, 22, 6], l: [0, 40, -10], f: 56 }, { t: c.dur, p: [-6, 25, 3], l: [0, 40, -10], f: 56 }]);
  if (t > tO) c.ui(bigNum('ONDAS DE +10 m', 960, 200, { size: 110, color: '#ffffff', glow: 'rgba(56,214,255,.7)', s: pop(t, tO + 0.4, 0.3) || 1 }));
  if (t > tB) c.tag([0, 39.6, -10], 'PONTO MAIS FRÁGIL', 'red', tB + 0.5, 1e9);
};

// ================= CLÍMAX =================
SHOTS.b21 = (c) => {
  const t = c.t; const tM = c.at('o mar vira'), tL = c.at('as luzes piscam'), tA = c.at('arrebenta'); c.sfx('wind', 0, 0.8); c.sfx('flicker', tL, 0.6); c.sfx('crash', tA, 0.9); c.sfx('alarm', tA + 0.4, 0.5);
  if (t < tL) { c.env('sea', { storm: 1 }); c.shake(0.08); c.cam([{ t: 0, p: [-8, 22, 6], l: [0, 40, -10], f: 58 }, { t: tL, p: [-5, 26, 2], l: [0, 40, -10], f: 58 }]); title(c, 'O FURACÃO CHEGOU', 0.1, { size: 80 }); }
  else if (t < tA) { const fl = Math.sin(t * 35) > 0 ? 1 : 0.2; c.env('sea', { storm: 1, power: fl }); c.shake(0.06); c.cam([{ t: tL, p: [-8, 3.2, 5], l: [0, 2.6, -9], f: 46 }, { t: tA, p: [-7, 3, 4], l: [0, 2.6, -9], f: 46 }]); }
  else { c.env('sea', { storm: 1, power: 0.3, alarm: 1, buoy: 'broken' }); c.shake(0.35 * clamp(1 - (t - tA) / 0.8) + 0.05); c.cam([{ t: tA, p: [-6, 6, 5], l: [0, 9, -10], f: 52 }]); c.flash('#ffffff', 0.7 * clamp(1 - (t - tA) / 0.3)); c.ui(stamp('O CABO ARREBENTOU', { top: 150, s: pop(t, tA, 0.3) || 1 })); }
};

SHOTS.b22 = (c) => {
  const t = c.t; const tB = c.at('As baterias'), tO = c.at('Ou mantém'), tA = c.at('A assembleia'), tE = c.at('mesma coisa') + 0.9; c.sfx('alarm', 0, 0.25); c.sfx('chalk', tO, 0.5); c.sfx('cheer', tA + 0.6, 0.3); c.sfx('tada', tE, 0.7);
  c.env('seahab', { power: 0.3, alarm: 0.6, screen: 'red', haze: 0.35 });
  const vote = t > tA + 0.6;
  if (t < tA) { c.track('iara', [{ t: 0, p: [-4.6, 0, -1.0], ry: -PI / 2, a: 'think', e2: 'worried' }]); c.cam([{ t: 0, p: [-2.0, 1.8, 0.6], l: [-5.6, 1.5, -1.0], f: 48 }, { t: tA, p: [-2.6, 1.7, 0.3], l: [-5.6, 1.5, -1.0], f: 44 }]); }
  else {
    roomPeople(c, 18, { ry: 0.1, a: vote ? 'pointup' : 'idle', e: vote ? 'happy' : 'worried' });
    c.track('iara', [{ t: 0, p: [0.9, 0, 1.0], ry: PI, a: vote ? 'cheer' : 'talk', e2: t > tE ? 'happy' : 'neutral' }]);
    c.cam([{ t: tA, p: [1.7, 2.3, 3.2], l: [1.2, 1.0, -1.8], f: 56 }, { t: c.dur, p: [1.5, 2.2, 3.1], l: [1.2, 1.1, -1.8], f: 52 }]);
  }
  if (t > tB) c.ui(card(`🔋 BATERIAS: <span style="color:#ffb02e">~6 HORAS</span>`, { y: 60, a: clamp((t - tB) / 0.3), size: 44 }));
  if (t > tO) { [['🔥 AQUECIMENTO', '#d6561c', 600], ['💨 AR', '#1c9a4a', 1320]].forEach(([l, col, x], i) => { const s = pop(t, tO + i * 0.5, 0.25); if (!s) return; const win = i === 1 && t > tE; c.ui(`<div class="abs" style="left:${x}px;top:200px;transform:translate(-50%,0) scale(${s});padding:20px 50px;border-radius:24px;background:${col};color:#fff;font-weight:900;font-size:64px;border:${win ? '10px solid #ffd21f' : '6px solid #fff'};opacity:${t > tE && i === 0 ? 0.35 : 1}">${l}</div>`); }); }
  if (t > tE) c.chip(1320, 350, '100 VOTOS', 'green', tE, 1e9);
};

SHOTS.b23 = (c) => {
  const t = c.t; const tI = c.at('E a Iara lembra'), tT = c.at('a turbina'); c.sfx('heartbeat', 0, 0.4); c.sfx('ding', tT, 0.7);
  c.env('seahab', { power: 0.15, haze: 0.6, screen: 'red' });
  roomPeople(c, 16, { ry: PI * 0.95, a: (i) => (i % 3 ? 'floor' : 'tired'), e: 'tired' });
  if (t < tI) c.cam([{ t: 0, p: [3.8, 2.6, 2.6], l: [0.6, 0.6, -1.6], f: 52 }, { t: tI, p: [3.2, 2.4, 2.0], l: [0.6, 0.6, -1.6], f: 50 }]);
  else { c.track('iara', [{ t: 0, p: [-0.9, 0, 0.0], ry: 0.1, a: t > tT ? 'pointup' : 'think', e2: t > tT ? 'surprised' : 'tired' }]); c.cam([{ t: tI, p: [-0.5, 1.7, 3.35], l: [-0.9, 1.4, 0.0], f: 50 }, { t: c.dur, p: [-0.55, 1.7, 3.3], l: [-0.9, 1.45, 0.0], f: 44 }]); }
  if (t > tT) c.ui(bigNum('💡 A TURBINA DE MARÉ', 960, 170, { size: 96, color: '#ffd21f', glow: 'rgba(255,210,31,.6)', s: pop(t, tT, 0.3) || 1 }));
  if (t < tI) c.chip(960, 110, 'FALANDO POUCO PRA GASTAR MENOS AR', 'blue', 0.3, tI);
};

// caminho do cabo novo (mesmo do env): da porta molhada (7.4,-11.3) até a turbina (15.6,-27)
const CAB = (u) => { const P = [[7.4, -11.3], [8.6, -14], [11, -19], [14, -24], [15.4, -26.6]]; const f = clamp(u) * 4; const i = Math.min(3, Math.floor(f)), k = f - i; return [lerp(P[i][0], P[i + 1][0], k), lerp(P[i][1], P[i + 1][1], k)]; };
SHOTS.b24 = (c) => {
  const t = c.t; const tP = c.at('Uma turbina'), tE = c.at('Ela, o Kauê'); c.sfx('water', 0, 0.5); c.sfx('heartbeat', tE, 0.4);
  if (t < tE) {
    c.env('sea', { night: true, power: 0.15, spin: 0 }); c.glow([16, 8, -24], 0x88bbff, 6);
    c.cam([{ t: 0, p: [10, 5, -8], l: [16, 4, -28], f: 46 }, { t: tE, p: [12, 6, -14], l: [16, 5, -28], f: 46 }]);
    if (t > tP) c.tag([16, 9, -28], 'PARADA · 200 m', 'gold', tP + 0.4, 1e9);
  } else {
    const u = 0.14 + prog(t, tE, c.dur + 4) * 0.45; c.env('sea', { night: true, power: 0.15, cable: u + 0.02 });
    const [x, z] = CAB(u); const ry = Math.atan2(15.6 - 7.4, -27 + 11.3);
    [['iara', 0], ['kaue', 1.4], ['davi', 2.8]].forEach(([n, back], i) => { const [xx, zz] = CAB(u - back / 18); c.track(n, [{ t: 0, p: [xx + (i - 1) * 0.5, 0, zz], ry, a: 'walk', e2: 'worried', suit: true, hold: i === 0 ? 'light' : null }]); });
    c.torch([x, 1.8, z], [x + Math.sin(ry) * 6, 0, z + Math.cos(ry) * 6], 70);
    c.camSet([x + 0.46 * 4.5 + 0.88 * 1.6, 2.2, z - 0.88 * 4.5 + 0.46 * 1.6], [x - 0.3, 1.1, z + 0.6], 50);
  }
};

SHOTS.b25 = (c) => {
  const t = c.t; const t2 = c.at('Segunda'), t3 = c.at('Na terceira'), tH = c.at('as hélices'), tL = c.at('acendem'), tD = c.at('Lá dentro'); c.sfx('click', 0.4, 0.6); c.sfx('spark', t2 + 0.3, 0.8); c.sfx('click', t3 + 0.2, 0.6); c.sfx('power', tH, 0.8); c.sfx('tada', tL, 0.7); c.sfx('cheer', tD, 0.5);
  const spin = t > tH ? clamp((t - tH) / 1.5) * 2 : 0;
  if (t < tL) {
    c.env('sea', { night: true, power: 0.15, cable: 0.98, spin });
    c.track('iara', [{ t: 0, p: [15.2, 0, -25.6], ry: PI * 0.85, a: 'tinker', e2: t > tH ? 'happy' : 'worried', suit: true, hold: 'wrench' }]);
    c.track('kaue', [{ t: 0, p: [16.7, 0, -24.8], ry: -2.4, a: 'idle', e2: 'worried', suit: true, hold: 'light' }]);
    c.torch([16.5, 1.6, -24.6], [15.3, 0.6, -26.4], 70);
    if (t < tH) c.cam([{ t: 0, p: [12.4, 1.9, -22.2], l: [15.2, 1.1, -25.8], f: 44 }, { t: tH, p: [12.8, 1.8, -22.6], l: [15.2, 1.1, -25.8], f: 42 }]);
    else c.cam([{ t: tH, p: [10, 4, -18], l: [16, 6, -28], f: 50 }]);
    if (t > t2 && t < t2 + 0.6) { c.puffs([15.5, 0.7, -26.6], 1 - (t - t2) / 0.6, { color: 0xffe066, rise: 0.6, op: 0.9, speed: 3, grow: 0.2 }); c.flash('#fff2a0', 0.4 * (1 - (t - t2) / 0.6)); }
    if (t < t2) c.chip(960, 110, '1ª: NADA', 'red', 0.3, t2); else if (t < t3) c.chip(960, 110, '2ª: FAÍSCA', 'gold', t2, t3); else c.chip(960, 110, '3ª…', 'green', t3, tL);
  } else if (t < tD) {
    c.env('sea', { night: true, power: clamp((t - tL) / 0.4), cable: 1, spin: 2 });
    c.cam([{ t: tL, p: [10, 4, 6], l: [0, 2.6, -10], f: 46 }, { t: tD, p: [8, 4, 5], l: [0, 2.6, -10], f: 46 }]); c.flash('#ffffff', 0.5 * clamp(1 - (t - tL) / 0.3));
    c.ui(bigNum('ACENDEU!', 960, 200, { size: 140, color: '#3ddc6a', glow: 'rgba(61,220,106,.6)', s: pop(t, tL, 0.3) || 1 }));
  } else {
    c.env('seahab', { power: 1, fish: false, night: true });
    roomPeople(c, 18, { ry: 0.1, a: 'cheer', e: 'happy' });
    c.cam([{ t: tD, p: [1.7, 2.3, 3.2], l: [1.2, 1.0, -1.8], f: 56 }, { t: c.dur, p: [1.5, 2.2, 3.1], l: [1.2, 1.1, -1.8], f: 54 }]);
    airG(c, lerp(22, 60, prog(t, tD, c.dur)), { x: 1440, y: 60 });
  }
};

SHOTS.b26 = (c) => {
  const t = c.t; const tT = c.at('E a turbina'), tN = c.at('nunca para'); c.sfx('pad', 0, 0.5); c.sfx('ding', tN, 0.6);
  c.env('sea', { cable: 1, spin: 2, buoy: false, fish: { x: 15, z: -22, r: 5, y: 4 } });
  ['iara', 'kaue', 'davi'].forEach((n, i) => c.track(n, [{ t: 0, p: [13 + i * 1.1, 0, -22.5 + i * 0.3], ry: PI * 0.85, a: 'cheer', e2: 'happy', suit: true }]));
  if (t < tT) c.cam([{ t: 0, p: [0, 20, 10], l: [0, 30, -20], f: 52 }, { t: tT, p: [0, 16, 10], l: [0, 26, -20], f: 52 }]);
  else c.cam([{ t: tT, p: [10.5, 2.4, -16.5], l: [15.5, 3.5, -26], f: 50 }, { t: c.dur, p: [10, 3.2, -15.5], l: [15.5, 4.5, -26], f: 50 }]);
  if (t < tT) c.chip(960, 120, 'O FURACÃO PASSOU', 'blue', 0.3, tT);
  if (t > tN) c.ui(bigNum('A MARÉ NUNCA PARA', 960, 190, { size: 100, color: '#ffd21f', glow: 'rgba(255,210,31,.6)', s: pop(t, tN, 0.3) || 1 }));
};

// ================= FINAL =================
SHOTS.b27 = (c) => {
  const t = c.t; const tM = c.at('Chegam novos'), tB = c.at('E nasce'), tN = c.at('aprende a nadar'); c.sfx('whoosh', 0, 0.5); c.sfx('aww', tB + 0.4, 0.6); c.sfx('twinkle', tN, 0.5);
  if (t < tB) {
    c.env('sea', { more: t > tM, cable: 1, spin: 2, buoy: false, fish: { x: 2, z: 0, r: 9, y: 5 } });
    c.cam([{ t: 0, p: [-24, 14, 14], l: [0, 2, -14], f: 46 }, { t: tB, p: [-18, 10, 12], l: [0, 2, -14], f: 46 }]);
    title(c, 'ANOS DEPOIS', 0.1, { bg: '#0d3b66', size: 80 });
    if (t > tM) ['+ MÓDULOS', '+ GENTE', '+ ESCOLA'].forEach((l, i) => { const tt = tM + i * 0.7; if (t > tt) c.ui(bigNum(l, 480 + i * 480, 820, { size: 70, color: '#3ddc6a', s: pop(t, tt, 0.25) || 1 })); });
  } else {
    c.env('seahab', { fish: true });
    c.track('sol', [{ t: 0, p: [2.3, 0, -0.2], ry: -0.25, a: 'idle', e2: 'happy', hold: 'baby' }]);
    roomPeople(c, 8, { ry: 0.6, a: 'clap', e: 'happy' });
    c.cam([{ t: tB, p: [1.4, 1.7, 3.3], l: [2.3, 1.3, -0.2], f: 50 }, { t: c.dur, p: [1.6, 1.7, 3.2], l: [2.3, 1.2, -0.2], f: 46 }]);
    c.chip(960, 110, 'O 1º BEBÊ DE ATLÂNTIDA', 'gold', tB + 0.3, 1e9);
  }
};

SHOTS.b28 = (c) => {
  const t = c.t; const tA = c.at('apaga as luzes'), tB = c.at('O mar inteiro'), tL = c.at('bioluminescência'); c.sfx('click', tA + 0.5, 0.6); c.sfx('twinkle', tB, 0.6); c.sfx('pad', 0, 0.4);
  if (t < tB) {
    c.env('seahab', { power: t > tA + 0.5 ? 0.05 : 0.6, night: true, glowy: t > tA + 0.8 ? 0.6 : 0 });
    c.track('iara', [{ t: 0, p: [0, 0, -1.6], ry: PI, a: 'idle', e2: 'happy' }]);
    c.cam([{ t: 0, p: [0.4, 1.6, 2.8], l: [0, 1.6, -3.5], f: 46 }, { t: tB, p: [0.3, 1.6, 1.6], l: [0, 1.7, -3.5], f: 46 }]);
  } else {
    c.env('sea', { night: true, glowy: 1, power: 0.9, more: true, cable: 1, spin: 0.5, buoy: false });
    c.cam([{ t: tB, p: [-9, 3, 8], l: [0, 3, -10], f: 52 }, { t: c.dur, p: [-6, 4, 10], l: [0, 3, -10], f: 52 }]);
    if (t > tL) c.ui(bigNum('BIOLUMINESCÊNCIA', 960, 180, { size: 100, color: '#4ff3ff', glow: 'rgba(79,243,255,.7)', s: pop(t, tL, 0.3) || 1 }));
  }
};

SHOTS.b29 = (c) => {
  const t = c.t; const tR = c.at('Recomeçou porque'), tS = c.at('o ar de todo mundo'); c.sfx('pad', 0, 0.5);
  c.env('seahab', { fish: true, power: 0.8 });
  roomPeople(c, 18, { ry: 0.05, a: 'idle', e: 'happy', seed: 9 });
  ['iara', 'davi', 'sol', 'kaue'].forEach((n, i) => c.track(n, [{ t: 0, p: [-0.9 + i * 0.8, 0, 0.5], ry: 0, a: 'idle', e2: 'happy' }]));
  c.cam([{ t: 0, p: [0.3, 1.9, 3.3], l: [0.3, 1.6, -1.5], f: 58 }, { t: c.dur, p: [0.3, 2.0, 3.2], l: [0.3, 1.7, -1.5], f: 58 }]);
  if (t > tR) c.chip(960, 160, 'FIZERAM ESCOLHAS JUNTOS', 'gold', tR, 1e9); if (t > tS) c.chip(960, 250, 'O AR DE TODOS PRIMEIRO', 'green', tS, 1e9);
  c.state.fade = prog(t, c.dur - 0.5, c.dur);
};

SHOTS.b30 = (c) => {
  const t = c.t; const tQ = c.at('Moraria debaixo'), tM = c.at('numa nave'), tS = c.at('Se inscreve'), tB = c.at('Até lá'); c.sfx('whoosh', tM, 0.5); c.sfx('click', tS + 1.1, 0.8); c.sfx('ding', tS + 1.15, 0.6); c.sfx('tada', tB, 0.6);
  c.env('outro');
  const w = t > tB;
  [['iara', -3.0, 0.3], ['sol', -1.0, 0.1], ['davi', 1.0, -0.1], ['kaue', 3.0, -0.3]].forEach(([n, x, ry]) => c.track(n, [{ t: 0, p: [x, 0, 5.1], ry, a: w ? 'wave' : 'idle', e2: 'happy' }]));
  c.cam([{ t: 0, p: [0, 1.9, 12.4], l: [0, 2.0, 5], f: 42 }, { t: c.dur, p: [0, 2.0, 11.4], l: [0, 2.0, 5], f: 42 }]);
  if (t > tQ && t < tM - 0.3) { const a = clamp((t - tQ) / 0.4); c.ui(`<div class="abs" style="left:0;top:130px;width:1920px;text-align:center;font-weight:900;font-size:60px;color:#fff;opacity:${a};text-shadow:0 5px 0 #000">VOCÊ MORARIA DEBAIXO DO MAR?</div>`);
    ['SIM 🌊', 'NÃO ☀️'].forEach((l, i) => { const s = pop(t, tQ + 0.5 + i * 0.3, 0.25); c.ui(`<div class="abs" style="left:${580 + i * 420}px;top:240px;width:340px;padding:20px 0;text-align:center;border-radius:24px;background:${['#38d6ff', '#ffb02e'][i]};color:#111;font-weight:900;font-size:64px;transform:scale(${s})">${l}</div>`); }); }
  if (t > tM - 0.2 && t < tS - 0.1) { c.ui(`<div class="abs" style="left:0;top:120px;width:1920px;text-align:center;font-weight:900;font-size:60px;color:#fff;text-shadow:0 5px 0 #000">PRÓXIMO EPISÓDIO</div>`); c.ui(bigNum('UMA NAVE DE 100 ANOS?', 960, 270, { size: 110, color: '#ffd21f', glow: 'rgba(255,210,31,.6)', s: pop(t, tM, 0.3) || 1 })); }
  if (t < tB) subBtn(c, tS);
  if (t > tB) c.ui(bigNum('ATÉ LÁ!', 960, 250, { size: 190, color: '#ffd21f', glow: 'rgba(255,210,31,.7)', s: pop(t, tB, 0.3) || 1 }));
  c.state.fade = prog(t, c.dur - 1.0, c.dur);
};
