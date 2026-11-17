// LONGO: "E se a humanidade recomeçasse com 98 pessoas?" — palito, 1920x1080.
import { clamp, lerp, ease, PI, prog, dots, mmss, center, stamp, bigNum, pop, seeded, subBtn, boardCam, dotsGrid } from '/engine/kit.js';
export const SHOTS = {};
const P0 = { num: null, flag: false };
export const CAST = {
  bia: { style: 'palito', ...P0, shirt: 0x2a6ad6, trim: 0xffffff, shorts: 0x2b2f45, hair: 'lia', scale: 0.96 },
  helena: { style: 'palito', ...P0, shirt: 0xf4f4f4, trim: 0x2aa198, shorts: 0x2aa198, hair: 'lia', scale: 0.96 },
  tonho: { style: 'palito', ...P0, shirt: 0xe07b22, trim: 0x5a3a1a, shorts: 0x3a4a6a, cap: 0xf6c90e },
  jorge: { style: 'palito', ...P0, shirt: 0x6b8e23, trim: 0x3a4a1a, shorts: 0x6a4a2a, hair: 'old' },
  davi: { style: 'palito', ...P0, shirt: 0x8a3ad6, trim: 0x111111, shorts: 0x222222, cap: 0x111111, capYaw: PI },
};
const COLS = [0xd6561c, 0x2a6ad6, 0x1c9a4a, 0xd6a31c, 0x8a3ad6, 0xe02020, 0x0aa6b8, 0xf4f4f4, 0xff7f11];
// multidão em anel/grade
const ring = (n, cx, cz, r0, o = {}) => { const R = seeded(o.seed || 5); const L = []; for (let i = 0; i < n; i++) { const a = i * 2.399 + R() * 0.3; const r = r0 + Math.sqrt(i) * (o.sp || 0.75); const x = cx + Math.cos(a) * r, z = cz + Math.sin(a) * r; L.push({ p: [x, 0, z], ry: Math.atan2(cx - x, cz - z) + (R() - 0.5) * 0.8, c: COLS[i % COLS.length], s: 0.85 + 0.15 * R(), a: o.a ? o.a(i) : 'idle' }); } return L; };
const chipsAt = (c, list) => list.forEach(([w, x, y, txt, cls]) => { const tt = c.at(w); if (c.t >= tt) c.chip(x, y, txt, cls, tt, 1e9); });

// ================= GANCHO =================
SHOTS.b01 = (c) => {
  c.env('void'); const t = c.t; const tD = c.at('noventa e oito'), tC = c.at('pode cair'); c.sfx('riser', 0.4, 0.9); c.sfx('boom', tD, 1.0); c.sfx('heartbeat', tC, 0.8);
  c.cam([{ t: 0, p: [0, 3.2, 16], l: [0, 1.6, 0], f: 44 }, { t: c.dur, p: [0, 2.6, 12.5], l: [0, 1.4, 0], f: 44 }]);
  const u = clamp((t - 0.5) / (tD - 0.55)); const v = u >= 1 ? 98 : Math.max(98, 98 + 8.2e9 * Math.pow(1 - u, 6)); const after = t >= tD; const k = after ? prog(t, tD, tD + 0.45) : 0;
  const top = after ? lerp(360, 120, ease.o(k)) : 360, size = after ? lerp(200, 150, ease.o(k)) : 200; const red = t > tC && Math.sin(t * 9) > 0;
  c.ui(center('POPULAÇÃO MUNDIAL', { top: top - 90, size: 36, color: '#b9a8ff', ls: 8, a: clamp((t - 0.1) / 0.3) }));
  c.ui(center(after ? '98' : dots(v), { top, size, color: after ? (red ? '#ff3b30' : '#ffd21f') : '#ffffff', s: after ? 1 + 0.5 * Math.max(0, 1 - (t - tD) / 0.3) : 1, glow: after ? 'rgba(255,210,31,.7)' : 'rgba(150,130,255,.7)', extra: 'font-variant-numeric:tabular-nums;' }));
  if (after) { const L = []; for (let i = 0; i < 98; i++) { const cc = i % 14, rr = Math.floor(i / 14); L.push({ p: [(cc - 6.5) * 1.05, 0, -1 - rr * 1.3], ry: 0, c: COLS[i % 9], s: 1, a: 'idle' }); }
    c.crowd(L.slice(0, Math.ceil(98 * prog(t, tD, tD + 0.8)))); c.flash('#ffffff', Math.max(0, 0.6 * (1 - (t - tD) / 0.25))); c.shake(Math.max(0, 1 - (t - tD) / 0.5)); }
  if (t > tC) c.chip(960, 1000, 'E HOJE À NOITE, PODE CAIR', 'red', tC, 1e9);
};

SHOTS.b02 = (c) => {
  const t = c.t; const tV = c.at('Vinte pessoas'), tH = c.at('o hospital'), tM = c.at('a única médica'); c.sfx('cough', 0.4, 0.6); c.sfx('cough', 2.2, 0.5); c.sfx('wind', 0, 0.4); c.sfx('flicker', tH, 0.5);
  const lx = 26 + Math.sin(t * 0.9) * 2.5;
  c.env('hospital', { torch: [27.8, 1.9, 0.4, lx, 0.8, -2.6] });
  for (let i = 0; i < 3; i++) { const m = c.mini(i, { p: [22 + i * 4, 0.82, -1.65], ry: 0, a: 'idle', e: i === 1 ? 'tired' : 'sad', s: 0.85 }); m.root.rotation.set(-PI / 2, 0, 0, 'YXZ'); }
  c.track('helena', [{ t: 0, p: [27.8, 0, 0.4], ry: -2.0, a: 'idle', e2: 'worried', hold: 'light' }]);
  if (t < tH) c.cam([{ t: 0, p: [20.5, 2.6, 3.5], l: [25, 0.9, -2.4], f: 46 }, { t: tH, p: [22, 2.4, 3.2], l: [26, 0.9, -2.4], f: 44 }]);
  else if (t < tM) c.cam([{ t: tH, p: [31.5, 2.2, 3.6], l: [26, 1.2, -1.5], f: 50 }, { t: tM, p: [31, 2.1, 3.0], l: [26, 1.2, -1.5], f: 48 }]);
  else c.cam([{ t: tM, p: [25.4, 2.0, -0.4], l: [27.8, 1.8, 0.4], f: 40 }, { t: c.dur, p: [25.7, 2.0, -0.3], l: [27.8, 1.8, 0.4], f: 34 }]);
  if (t > tV) c.chip(330, 120, 'DOENTES: 20', 'red', tV, 1e9); if (t > tH) c.chip(1590, 120, 'ENERGIA: 0%', 'red', tH, 1e9);
  if (t > tM) c.tag([27.8, 3.0, 0.4], 'DRA. HELENA · A ÚNICA MÉDICA', 'blue', tM, 1e9);
};

SHOTS.b03 = (c) => {
  const t = c.t; const tB = c.at('A Bia'), tS = c.at('seis meses'); c.sfx('clang', 0.6, 0.6); c.sfx('clang', 2.2, 0.5); c.sfx('whoosh', tS, 0.6);
  c.env('gen', { power: 0, smoke: 0.25 });
  c.track('bia', [{ t: 0, p: [-0.9, 0, -0.5], ry: PI, a: 'tinker', e2: 'worried', hold: 'wrench' }]);
  c.torch([1.2, 2.4, 1.2], [-1.0, 1.0, -1.6], 45);
  if (t < tB) c.cam([{ t: 0, p: [4.6, 2.6, 5.0], l: [0, 1.4, -2], f: 50 }, { t: tB, p: [3.8, 2.4, 4.2], l: [0, 1.3, -2], f: 48 }]);
  else c.cam([{ t: tB, p: [2.0, 1.9, 0.9], l: [-0.9, 1.6, -0.6], f: 40 }, { t: c.dur, p: [1.6, 1.9, 0.6], l: [-0.9, 1.6, -0.6], f: 34 }]);
  if (t > tB) c.chip(1560, 120, 'PRAZO: 1 NOITE', 'red', tB, tS);
  const k = prog(t, tS + 0.6, tS + 1.3); if (k > 0) { c.state.fade = k; c.ui(center('6 MESES ANTES', { top: 440, size: 130, a: k, s: 0.9 + 0.1 * k, ls: 3 })); }
};

// ================= COMEÇO =================
SHOTS.b04 = (c) => {
  const t = c.t; const tA = c.at('acorda'), tE = c.at('Em volta'), tC = c.at('Ela conta'), t98 = c.at('Noventa e oito'); c.sfx('wind', 0, 0.4); c.sfx('whoosh', tE, 0.5); c.sfx('boom', t98, 0.8);
  c.env('stadium');
  const up = t > tE; c.track('bia', up ? [{ t: 0, p: [0, 0, 0], ry: 0, a: t < tC ? 'lookaround' : 'idle', e2: t < t98 ? 'scared' : 'surprised' }] : [{ t: 0, p: [0, 0.25, 1.0], ry: 0, rx: -PI / 2, a: 'idle', e2: 'tired' }]);
  const n = up ? 97 : 0; const L = ring(n, 0, 0, 3.2, { seed: 4, sp: 0.9, a: (i) => (i % 3 ? 'lookaround' : 'idle') }); if (n) c.crowd(L);
  if (t < tE) c.cam([{ t: 0, p: [0, 5.5, 0.6], l: [0, 0, 0.0], f: 44 }, { t: tE, p: [0, 3.6, 0.6], l: [0, 0, -0.1], f: 44 }]);
  else if (t < tC) c.cam([{ t: tE, p: [4.2, 2.2, 6.0], l: [0, 1.4, 0], f: 46 }, { t: tC, p: [3.2, 2.0, 5.0], l: [0, 1.5, 0], f: 44 }]);
  else c.cam([{ t: tC, p: [0.8, 2.0, 4.0], l: [0, 1.6, 0], f: 40 }, { t: t98, p: [2, 6, 12], l: [0, 1, 0], f: 50 }, { t: c.dur, p: [8, 22, 30], l: [0, 0, 0], f: 50 }]);
  if (t > tA && t < tE + 2.5) c.tag([0, 3.0, 0], 'BIA · 26 ANOS · ENGENHEIRA ELETRICISTA', 'gold', tA, tE + 2.5);
  if (t > tC) { const m = Math.min(98, Math.max(1, Math.round(98 * prog(t, tC, t98)))); c.ui(bigNum(m, 960, 150, { size: 140, color: '#ffd21f', glow: 'rgba(255,210,31,.6)', s: t > t98 ? pop(t, t98, 0.3) || 1 : 1 })); }
};

SHOTS.b05 = (c) => {
  const t = c.t; const ts = [c.at('uma médica'), c.at('Um pedreiro'), c.at('Um agricultor'), c.at('E o Davi'), c.at('E ninguém')]; ts.forEach(q => c.sfx('pop', q + 0.3, 0.6));
  c.env('stadium');
  const who = [['helena', -3, 'DRA. HELENA · MÉDICA', 'blue'], ['tonho', -1, 'TONHO · PEDREIRO', 'gold'], ['jorge', 1, 'SEU JORGE · 61 · AGRICULTOR', 'green'], ['davi', 3, 'DAVI · 19 · GAMER', 'red']];
  who.forEach(([n, x], i) => c.track(n, [{ t: 0, p: [x, 0, 0], ry: 0, a: t > ts[i] && t < ts[i + 1] ? 'wave' : 'idle', e2: n === 'davi' ? 'smirk' : 'neutral', hold: n === 'davi' ? 'phone' : n === 'tonho' ? 'wrench' : n === 'helena' ? 'bandage' : n === 'jorge' ? 'bean' : null }]));
  c.crowd(ring(40, 0, -6, 2, { seed: 9 }).map(q => ({ ...q, ry: 0 })));
  let i = ts.findIndex((q, k) => t >= q && (k === ts.length - 1 || t < ts[k + 1])); if (t < ts[0]) i = 0;
  if (i >= 0 && i < 4) { const x = who[i][1]; c.cam([{ t: ts[i], p: [x + 1.3, 1.9, 3.6], l: [x, 1.6, 0], f: 38 }, { t: ts[i + 1], p: [x + 0.8, 1.9, 3.2], l: [x, 1.6, 0], f: 36 }]); c.tag([x, 2.95, 0], who[i][2], who[i][3], ts[i], ts[i + 1]); }
  else c.cam([{ t: ts[4], p: [0, 2.2, 9.5], l: [0, 1.4, -2], f: 50 }, { t: c.dur, p: [0, 2.6, 11.5], l: [0, 1.4, -2], f: 50 }]);
};

SHOTS.b06 = (c) => {
  const t = c.t; const tI = [['Prédios', 'PRÉDIOS'], ['comida', 'COMIDA'], ['máquinas', 'MÁQUINAS']].map(([k, l]) => [c.at(k), l]); const tR = c.at('Rio de Janeiro');
  c.sfx('hit', 0.35, 1); tI.forEach(([q]) => c.sfx('pop', q, 0.6)); c.sfx('pop', tR, 0.6);
  c.env('street', { tod: 'day', light: 'green' });
  c.track('bia', [{ t: 0, p: [0, 0, 0], ry: PI, a: 'idle', e2: 'worried' }]);
  c.crowd(ring(60, 0, 2.5, 1.6, { seed: 2, sp: 0.6 }).map(q => ({ ...q, ry: PI, p: [q.p[0], 0, Math.max(1.2, q.p[2])] })));
  const a = 0.05 + c.u * 0.8; c.camSet([Math.sin(a) * 9.5, 2.4 + c.u * 0.8, Math.cos(a) * 9.5 - 2], [0, 2.0, -3], 46);
  const s1 = pop(t, 0.35, 0.3); c.ui(`<div class="abs" style="left:0;right:0;top:80px;text-align:center;transform:scale(${s1 || 0});opacity:${s1 ? 1 : 0}"><div style="display:inline-block;background:#d62828;border:7px solid #fff;border-radius:22px;padding:6px 70px;font-weight:900;font-size:110px;transform:rotate(-2deg);box-shadow:0 14px 0 rgba(0,0,0,.45)">REGRA Nº 1</div></div>`);
  c.ui(`<div class="abs" style="left:0;right:0;top:250px;text-align:center;font-weight:900;font-size:56px;color:#ffd21f;opacity:${clamp((t - 0.7) / 0.3)};text-shadow:0 5px 0 #000,0 0 20px #000">SÓ SOBRARAM 98 PESSOAS</div>`);
  if (t > tR) c.chip(960, 350, 'TODAS NO RIO DE JANEIRO', 'blue', tR, 1e9);
  tI.forEach(([tt, l], i) => { if (t > tt) c.chip([480, 960, 1440][i], 800, l, 'green', tt, 1e9); });
};

// ================= VANTAGENS =================
SHOTS.b07 = (c) => {
  const t = c.t; const tQ = c.at('Quando um'), tP = c.at('O pedreiro'), tM = c.at('a médica cuida'), tB = c.at('uma padeira'); c.sfx('ding', tP, 0.5); c.sfx('ding', tM, 0.5); c.sfx('ding', tB, 0.5);
  c.env('bakery');
  c.track('bia', [{ t: 0, p: [0.2, 0, 1.6], ry: PI * 0.92, a: t > tB ? 'eat' : 'idle', e2: 'happy', hold: t > tB ? 'bread' : null }]);
  c.track('tonho', [{ t: 0, p: [2.0, 0, 2.6], ry: -2.4, a: 'talk', e2: 'happy', hold: 'wrench' }]);
  c.track('helena', [{ t: 0, p: [-1.6, 0, 2.6], ry: 2.6, a: 'idle', e2: 'happy', hold: 'bandage' }]);
  c.mini(0, { p: [-1.5, 0, -2.3], ry: 0, a: 'idle', e: 'happy' });
  if (t < tQ) c.cam([{ t: 0, p: [0.6, 2.2, -1.5], l: [0.3, 1.3, 2.4], f: 56 }, { t: tQ, p: [0.6, 2.1, -1.2], l: [0.3, 1.3, 2.4], f: 52 }]);
  else if (t < tB) c.cam([{ t: tQ, p: [-0.6, 1.9, -0.9], l: [1.4, 1.5, 2.4], f: 44 }, { t: tB, p: [-0.5, 1.9, -0.7], l: [1.4, 1.5, 2.4], f: 40 }]);
  else c.cam([{ t: tB, p: [-0.4, 1.9, 1.0], l: [-1.5, 1.6, -2.3], f: 36 }, { t: c.dur, p: [-0.6, 1.9, 0.6], l: [-1.5, 1.6, -2.3], f: 32 }]);
  if (t > tQ && t < tB) c.chip(960, 140, '98 > 2', 'gold', tQ, tB);
  chipsAt(c, [['O pedreiro', 360, 230, 'PEDREIRO ✓', 'green'], ['a médica cuida', 960, 230, 'MÉDICA ✓', 'green'], ['uma padeira', 1560, 230, 'PÃO QUENTINHO ✓', 'green']]);
};

SHOTS.b08 = (c) => {
  const t = c.t; const tL = c.at('lava a louça'), tQ = c.at('Quase sempre'), tN = c.at('À noite'); c.sfx('laugh', 0.6, 0.4); c.sfx('whoosh', tN, 0.5); c.sfx('cheer', tN + 1.2, 0.5);
  if (t < tN) {
    c.env('market', { power: 1 });
    const L = []; for (let i = 0; i < 40; i++) { const z = 6 - (i % 10) * 2.6, x = (i < 20 ? -1 : 1) * (0.8 + (i % 2) * 0.6); L.push({ p: [x, 0, z], ry: i % 3 ? (x < 0 ? PI / 2 : -PI / 2) : PI, c: COLS[i % 9], s: 0.9, a: i % 4 ? 'idle' : 'cheer' }); } c.crowd(L);
    c.track('bia', [{ t: 0, p: [0, 0, 8], ry: PI, a: 'eat', e2: 'happy', hold: 'can' }]);
    c.track('tonho', [{ t: 0, p: [1.0, 0, 9.2], ry: -2.6, a: t > tQ ? 'shrug' : 'wipe', e2: t > tQ ? 'deadpan' : 'neutral', hold: 'cup' }]);
    if (t < tL) c.cam([{ t: 0, p: [0.6, 3.2, 14], l: [0, 1.2, -6], f: 50 }, { t: tL, p: [0.4, 2.8, 12], l: [0, 1.2, -6], f: 50 }]);
    else c.cam([{ t: tL, p: [3.2, 1.9, 11.8], l: [1.0, 1.6, 9.2], f: 38 }, { t: tN, p: [2.8, 1.9, 11.4], l: [1.0, 1.6, 9.2], f: 34 }]);
    c.ui(`<div class="chip green" style="left:1580px;top:120px;font-size:36px;transform:none">TOTAL: R$ 0,00</div>`);
    if (t > tQ) c.chip(960, 160, 'QUASE SEMPRE', 'red', tQ, tN);
  } else {
    c.env('void', { cone: true });
    c.track('davi', [{ t: 0, p: [0, 0, 0], ry: 0, a: 'floor', e2: 'happy', hold: 'phone' }]);
    c.crowd(ring(24, 0, 0.6, 1.6, { seed: 7, a: (i) => (Math.sin(t * 3 + i) > 0.6 ? 'cheer' : 'idle') }).filter(q => q.p[2] < 0.2));
    c.cam([{ t: tN, p: [0, 1.6, 4.4], l: [0, 1.0, 0], f: 44 }, { t: c.dur, p: [0, 1.7, 3.8], l: [0, 1.0, 0], f: 42 }]);
    c.chip(960, 140, 'CAMPEONATO NO TELÃO', 'blue', tN, 1e9); c.tag([0, 2.2, 0], 'DAVI', 'red', tN + 0.3, 1e9);
  }
};

SHOTS.b09 = (c) => {
  const t = c.t; const tQ = c.at('Quarenta e nove'), tP = c.at('Placar'), tPn = c.at('pênalti'); c.sfx('whoosh', 0, 0.4); c.sfx('cheer', tP, 0.6); c.sfx('cheer', tPn, 0.5);
  c.env('stadium');
  const L = []; for (let i = 0; i < 98; i++) { const team = i < 49 ? -1 : 1; const k = i % 49; const x = team * (2 + (k % 7) * 3.2) + Math.sin(t * 1.3 + i) * 0.8, z = (Math.floor(k / 7) - 3) * 4.5 + Math.cos(t + i) * 0.8; L.push({ p: [x, 0, z], ry: team > 0 ? -PI / 2 : PI / 2, c: team < 0 ? 0xe02020 : 0xf4f4f4, s: 1, a: (i + Math.floor(t * 2)) % 3 ? 'run' : 'idle' }); } c.crowd(L);
  c.prop('ball', { p: [Math.sin(t * 0.8) * 6, 0.25 + Math.abs(Math.sin(t * 3)) * 0.5, Math.cos(t * 0.6) * 4], s: 2.5 });
  c.track('tonho', [{ t: 0, p: [0.5, 0, 22], ry: PI, a: t > tPn ? 'shout' : 'cheer', e2: t > tPn ? 'angry' : 'happy' }]);
  if (t < tPn) c.cam([{ t: 0, p: [-50, 30, 60], l: [0, 0, 0], f: 46 }, { t: tPn, p: [-22, 12, 30], l: [0, 0, 0], f: 46 }]);
  else c.cam([{ t: tPn, p: [0.0, 2.0, 26.0], l: [0.5, 1.6, 22], f: 38 }, { t: c.dur, p: [0.2, 2.0, 25.2], l: [0.5, 1.6, 22], f: 34 }]);
  if (t > tQ) c.chip(960, 120, '49 × 49', 'gold', tQ, tP);
  if (t > tP) c.ui(`<div class="abs" style="left:760px;top:70px;width:400px;padding:14px 0;text-align:center;border-radius:20px;background:#111;border:5px solid #fff;font-weight:900;font-size:80px;color:#ffd21f;transform:scale(${pop(t, tP, 0.3) || 1})">11 × 10</div>`);
  if (t > tPn) c.ui(stamp('FOI PÊNALTI?!', { top: 330, size: 90, s: pop(t, tPn, 0.3) || 1 }));
};

// ================= PREÇO =================
SHOTS.b10 = (c) => {
  const t = c.t; const tD = c.at('décimo dia'), tA = c.at('apaga'), tE = c.at('Elevador'); c.sfx('blackout', tA, 0.9); c.sfx('error', tE, 0.4);
  if (t < tD) {
    c.env('classroom', { board: (x, W, H) => { x.textAlign = 'center'; x.fillStyle = '#2a6ad6'; x.font = '900 120px Inter'; x.fillText('98 OPINIÕES', W / 2, 200); const n = Math.ceil(98 * prog(t, 0.5, tD - 0.4)); x.font = '800 30px Inter'; const R = seeded(3); for (let i = 0; i < n; i++) { x.fillStyle = ['#e02020', '#1c9a4a', '#d6a31c', '#8a3ad6'][i % 4]; x.fillText(['SIM', 'NÃO', 'TALVEZ', 'EU ACHO…'][Math.floor(R() * 4)], 120 + R() * (W - 240), 260 + R() * 280); } } });
    c.track('bia', [{ t: 0, p: [3.4, 0, -4.2], ry: PI + 0.6, a: 'think', e2: 'worried' }]); c.track('tonho', [{ t: 0, p: [-3.6, 0, -4.2], ry: PI - 0.6, a: 'shout', e2: 'angry' }]);
    boardCam(c, 0, tD, 2.6, 1.8);
  } else {
    const bl = prog(t, tA, tA + 1.6); c.env('citynight', { black: bl });
    c.cam([{ t: tD, p: [-46, 22, 76], l: [0, 52, -170], f: 46 }, { t: c.dur, p: [30, 22, 76], l: [0, 52, -170], f: 46 }]);
    c.chip(300, 140, 'DIA 10', 'gold', tD, 1e9); c.chip(1560, 140, 'USINAS: DESLIGADAS', 'red', tA, 1e9);
    chipsAt(c, [['Elevador', 480, 900, 'ELEVADOR: PARADO', 'red'], ['chuveiro', 960, 900, 'CHUVEIRO: GELADO', 'blue'], ['celulares', 1440, 900, 'CELULARES: 0%', 'red']]);
  }
};

SHOTS.b11 = (c) => {
  const t = c.t; const tQ = c.at('Quem manda'), tL = c.at('um líder'), tV = c.at('votar tudo'), tH = c.at('quatro horas'), tD = c.at('dividir as tarefas'); c.sfx('chalk', tQ, 0.5); c.sfx('tick', tH, 0.5); c.sfx('tada', tD, 0.6);
  const P = (a, b) => clamp((t - a) / (b - a));
  c.env('classroom', { board: (x, W, H) => {
    x.textAlign = 'center'; x.globalAlpha = P(tQ, tQ + 0.5); x.fillStyle = '#222'; x.font = '900 80px Inter'; x.fillText(t < tD ? 'QUEM MANDA?' : 'DIVISÃO DE TAREFAS', W / 2, 100); x.globalAlpha = 1;
    if (t < tD) { const a = P(tL, tL + 1.5) * 41, b = P(tV, tV + 1.5) * 57; x.font = '900 60px Inter'; x.fillStyle = '#e02020'; x.fillText('UM LÍDER: ' + Math.round(a), W * 0.28, 300); x.fillStyle = '#2a6ad6'; x.fillText('VOTAR TUDO: ' + Math.round(b), W * 0.72, 300);
      x.fillStyle = '#e02020'; x.fillRect(W * 0.28 - 200, 340, 400 * a / 57, 50); x.fillStyle = '#2a6ad6'; x.fillRect(W * 0.72 - 200, 340, 400 * b / 57, 50); }
    else { const rows = [['COMIDA', 'SEU JORGE'], ['SAÚDE', 'DRA. HELENA'], ['ENERGIA', 'BIA'], ['OBRAS', 'TONHO'], ['ÁGUA', 'DAVI']]; x.font = '800 52px Inter'; rows.forEach((r, i) => { if (P(tD + i * 0.35, tD + i * 0.35 + 0.3) <= 0) return; x.textAlign = 'right'; x.fillStyle = '#555'; x.fillText(r[0], W / 2 - 30, 190 + i * 78); x.textAlign = 'left'; x.fillStyle = '#1c9a4a'; x.fillText(r[1], W / 2 + 30, 190 + i * 78); }); }
  } });
  c.track('bia', [{ t: 0, p: [4.4, 0, -4.4], ry: PI + 0.7, a: t < tD ? 'think' : 'point', e2: t < tD ? 'worried' : 'happy' }]);
  c.track('tonho', [{ t: 0, p: [-4.4, 0, -4.4], ry: PI - 0.5, a: t > tL && t < tH ? 'shout' : 'idle', e2: t < tD ? 'angry' : 'happy' }]);
  for (let i = 0; i < 8; i++) c.mini(i, { p: [-5.2 + (i % 4) * 3.4, 0.22, -1.6 + Math.floor(i / 4) * 2.6 + 0.6], ry: PI, a: 'sit', e: t < tD ? 'angry' : 'happy' });
  if (t < tH) boardCam(c, 0, tH, 4.6, 3.4); else boardCam(c, tH, c.dur, 2.6, 1.6);
  if (t > tH && t < tD) c.chip(1560, 120, '4 HORAS DEPOIS…', 'gold', tH, tD);
};

SHOTS.b12 = (c) => {
  const t = c.t; const tC = c.at('duzentas mil'), tG = c.at('Sem geladeira'), tL = c.at('as latas'); c.sfx('buzz', tG, 0.4); c.sfx('error', tL + 1.0, 0.5);
  c.env('market', { power: 0 });
  const z = lerp(4, -10, t / c.dur);
  c.track('bia', [{ t: 0, p: [0, 0, 4], ry: PI, a: 'walk', e2: 'worried', hold: 'light' }, { t: c.dur, p: [0, 0, -10], ry: PI, a: 'walk', e2: 'worried', hold: 'light' }]);
  c.torch([0.3, 1.5, z - 0.3], [-0.4 + Math.sin(t * 1.3) * 1.5, 0.7, z - 9], 140);
  if (t < tG) c.camSet([0.9, 1.9, z + 4.8], [0, 1.3, z - 7], 50); else c.camSet([-1.2, 1.7, z - 3.6], [0, 1.6, z], 46);
  if (t > tC) { c.ui(bigNum('200.000', 960, 160, { size: 120, color: '#ffd21f', glow: 'rgba(255,210,31,.6)' })); c.ui(center('CALORIAS POR DIA', { top: 225, size: 36, color: '#fff', ls: 6 })); }
  if (t > tG) c.chip(400, 420, 'COMIDA FRESCA: ESTRAGADA', 'red', tG, 1e9);
  if (t > tL) { const w = Math.max(0, 6 - Math.floor(prog(t, tL, c.dur) * 6)); c.chip(1520, 420, 'LATAS: ' + w + ' SEMANAS', w < 3 ? 'red' : 'gold', tL, 1e9); }
};

SHOTS.b13 = (c) => {
  const t = c.t; const tJ = c.at('Seu Jorge'), tE = c.at('Ele ensina'), tD = c.at('E o Davi'), tI = c.at('irrigação'), tC = c.at('Ele desvia'); c.sfx('tada', tI, 0.5); c.sfx('water', tC, 0.6);
  c.env('farm', { cycle: 0.25, plant: clamp(prog(t, tE, tD) * 0.9 + prog(t, tC, c.dur) * 0.1), which: 0 });
  c.track('jorge', [{ t: 0, p: [-5.9, 0, 1.2], ry: 0.6, a: t > tE && t < tD ? 'point' : 'idle', e2: 'happy', hold: 'bean' }]);
  c.track('davi', [{ t: 0, p: [-8.4, 0, 2.2], ry: 0.9, a: t > tC ? 'cheer' : 'idle', e2: t > tI ? 'happy' : 'neutral' }]);
  if (t > tC) c.puffs([-6.6, 0.6, -0.2], 0.9, { color: 0x6fc8ff, spread: 1.6, rise: 0.8, grow: 0.6, op: 0.7, speed: 1.4 });
  if (t < tJ + 0.6) c.cam([{ t: 0, p: [-2, 4.5, 10], l: [-6.5, 0.8, 0], f: 50 }, { t: tJ + 0.6, p: [-3.5, 3.2, 8], l: [-6.5, 0.9, 0], f: 48 }]);
  else if (t < tD) c.cam([{ t: tJ + 0.6, p: [-7.8, 2.2, 5.6], l: [-6.5, 1.2, 0.4], f: 44 }, { t: tD, p: [-7.4, 2.0, 5.0], l: [-6.5, 1.2, 0.4], f: 40 }]);
  else c.cam([{ t: tD, p: [-5.2, 1.9, 6.2], l: [-8.0, 1.2, 1.6], f: 40 }, { t: c.dur, p: [-4.4, 2.6, 6.8], l: [-7.2, 0.8, 0.8], f: 46 }]);
  if (t > tJ && t < tD) c.tag([-5.9, 2.9, 1.2], 'O HOMEM MAIS IMPORTANTE DA CIDADE', 'green', tJ, tD);
  chipsAt(c, [['feijão', 420, 140, 'FEIJÃO', 'green'], ['milho', 960, 140, 'MILHO', 'green'], ['mandioca', 1500, 140, 'MANDIOCA', 'green']]);
  if (t > tI) c.chip(960, 860, 'IRRIGAÇÃO: DAVI ✓', 'blue', tI, 1e9);
};

// ================= CTA =================
SHOTS.b14 = (c) => {
  const t = c.t; const tS = c.at('inscrever'), tL = c.at('deixa o like'); c.sfx('click', tS + 1.1, 0.8); c.sfx('ding', tS + 1.15, 0.6); c.sfx('pop', tL + 0.3, 0.8);
  c.env('street', { tod: 'dawn', light: 'green' });
  c.track('bia', [{ t: 0, p: [-1.0, 0, 3], ry: 0.25, a: 'floorEat', e2: 'happy', hold: 'bread' }]);
  c.track('davi', [{ t: 0, p: [1.0, 0, 3.1], ry: -0.25, a: 'floor', e2: 'happy', hold: 'phone' }]);
  c.cam([{ t: 0, p: [-0.5, 1.4, 9.8], l: [0, 1.0, 3], f: 40 }, { t: c.dur, p: [0.8, 1.5, 8.6], l: [0, 1.1, 3], f: 38 }]);
  subBtn(c, tS);
  if (t > tL) { const s = pop(t, tL, 0.3); c.ui(bigNum('👍 +1', 1400, 560, { size: 80, color: '#2b7bff', s: s || 1 })); }
};

// ================= A CONTA =================
const board98 = (x, W, t, t98, a = 1) => { x.globalAlpha = a; x.textAlign = 'center'; x.fillStyle = '#1c9a4a'; x.font = '900 150px Inter'; x.fillText('98', 330, 230); x.globalAlpha = 1; dotsGrid(x, Math.ceil(98 * clamp((t - t98) / 1.6)), 330, 275, 10, 24, 8, '#1c9a4a'); x.font = '800 34px Inter'; x.fillStyle = '#555'; x.fillText('Marin · 2018', 330, 556); };
SHOTS.b15 = (c) => {
  const t = c.t; const tE = c.at('Em dois mil'), tN = c.at('uma nave'), t98 = c.at('noventa e oito'); c.sfx('page', 0.6, 0.5); c.sfx('whoosh', tE, 0.5); c.sfx('chalk', t98, 0.6);
  if (t < tE) {
    c.env('library', { bolts: [] });
    c.track('bia', [{ t: 0, p: [0, 0, -4.9], ry: PI, a: 'idle', e2: 'surprised', hold: 'book' }]); c.torch([0.4, 2.2, -2.6], [0, 1.4, -5.2], 90);
    c.cam([{ t: 0, p: [3.0, 2.2, 0.0], l: [0, 1.6, -5], f: 44 }, { t: tE, p: [2.2, 2.0, -1.2], l: [0, 1.7, -5], f: 38 }]);
    c.chip(300, 140, 'MADRUGADA', 'blue', 0.2, 1e9);
  } else {
    const P = (a, b) => clamp((t - a) / (b - a));
    c.env('classroom', { board: (x, W, H) => { x.textAlign = 'center'; x.fillStyle = '#2a6ad6'; x.font = '900 60px Inter'; x.globalAlpha = P(tE, tE + 0.6); x.fillText('2018 · FRÉDÉRIC MARIN · ASTROFÍSICO', W / 2, 80); x.globalAlpha = 1;
      const a = P(tN, tN + 0.8); if (a > 0) { x.globalAlpha = a; x.strokeStyle = '#555'; x.lineWidth = 6; x.beginPath(); x.ellipse(1050, 330, 330, 110, 0, 0, 7); x.stroke(); x.fillStyle = '#555'; x.font = '800 38px Inter'; x.fillText('NAVE DE GERAÇÕES', 1050, 340); x.fillText('MILHARES DE ANOS', 1050, 520); x.globalAlpha = 1; }
      if (t > t98 - 0.3) board98(x, W, t, t98, P(t98 - 0.3, t98 + 0.4)); } });
    c.track('bia', [{ t: 0, p: [4.4, 0, -4.4], ry: PI + 0.7, a: 'point', e2: 'neutral' }]);
    boardCam(c, tE, c.dur, 2.4, 1.6);
  }
};

SHOTS.b16 = (c) => {
  const t = c.t; const tP = c.at('tem um porém'), tR = c.at('regras rígidas'), t1 = c.at('ninguém tem filhos'), t2 = c.at('cada família'); c.sfx('boom', tP, 0.8); c.sfx('chalk', t1, 0.5); c.sfx('chalk', t2, 0.5);
  const P = (a, b) => clamp((t - a) / (b - a));
  c.env('classroom', { board: (x, W, H) => { board98(x, W, t, -10, 1); x.textAlign = 'left'; x.fillStyle = '#222'; x.font = '900 64px Inter'; x.globalAlpha = P(tR, tR + 0.5); x.fillText('SÓ FUNCIONA COM REGRAS:', 640, 170); x.globalAlpha = 1; x.font = '800 44px Inter';
    if (t > t1) { x.globalAlpha = P(t1, t1 + 0.4); x.fillStyle = '#e02020'; x.fillText('✗ FILHOS COM PARENTE PRÓXIMO', 640, 290); x.globalAlpha = 1; }
    if (t > t2) { x.globalAlpha = P(t2, t2 + 0.4); x.fillStyle = '#1c9a4a'; x.fillText('✓ FAMÍLIAS PLANEJADAS', 640, 390); x.fillText('    POR GERAÇÕES', 640, 450); x.globalAlpha = 1; } } });
  c.track('bia', [{ t: 0, p: [4.4, 0, -4.4], ry: PI + 0.7, a: t < tR ? 'think' : 'point', e2: 'worried' }]);
  c.track('helena', [{ t: 0, p: [-4.4, 0, -4.4], ry: PI - 0.5, a: 'think', e2: 'worried' }]);
  boardCam(c, 0, c.dur, 2.4, 1.6);
  if (t > tP && t < tR) { c.ui(stamp('TEM UM PORÉM', { top: 380, size: 110, s: pop(t, tP, 0.3) || 1 })); c.shake(Math.max(0, 1 - (t - tP) / 0.35)); }
};

SHOTS.b17 = (c) => {
  const t = c.t; const tC = c.at('Cameron'), t14 = c.at('catorze mil'), tM = c.at('mínimo do mínimo'), tN = c.at('Ninguém pode'); c.sfx('chalk', t14, 0.5); c.sfx('boom', tN, 0.9);
  const R = seeded(7); const pts = []; for (let i = 0; i < 2600; i++) pts.push([R(), R()]);
  c.env('classroom', { board: (x, W, H) => { board98(x, W, t, -10, 1); const a = clamp((t - (t14 - 0.3)) / 0.6); if (a > 0) { x.globalAlpha = a; x.textAlign = 'center'; x.fillStyle = '#d6561c'; x.font = '900 110px Inter'; x.fillText('14.000 – 44.000', 1090, 210); x.globalAlpha = 1; const n = Math.floor(pts.length * clamp((t - t14) / 1.8)); x.fillStyle = '#d6561c'; for (let i = 0; i < n; i++) { x.beginPath(); x.arc(760 + pts[i][0] * 660, 260 + pts[i][1] * 260, 3, 0, 7); x.fill(); } x.font = '800 34px Inter'; x.fillStyle = '#555'; x.fillText('Smith · antropólogo', 1090, 556); }
    if (t > tM) { x.strokeStyle = '#e02020'; x.lineWidth = 8; x.beginPath(); x.ellipse(330, 330, 200, 250, 0, 0, 7 * clamp((t - tM) / 0.6)); x.stroke(); } } });
  c.track('bia', [{ t: 0, p: [4.4, 0, -4.4], ry: PI + 0.7, a: 'idle', e2: t > tN ? 'scared' : 'worried' }]);
  c.track('helena', [{ t: 0, p: [-4.4, 0, -4.4], ry: PI - 0.5, a: 'think', e2: t > t14 ? 'surprised' : 'neutral' }]);
  boardCam(c, 0, c.dur, 2.4, 1.6);
  if (t > tC && t < t14 + 2) c.chip(960, 140, 'CAMERON SMITH · ANTROPÓLOGO', 'gold', tC, t14 + 2);
  if (t > tN) { c.ui(stamp('NINGUÉM PODE FALTAR', { top: 400, size: 104, s: pop(t, tN, 0.3) || 1 })); c.shake(Math.max(0, 1 - (t - tN) / 0.35) * 1.2); }
};

// ================= A HISTÓRIA AVISA =================
SHOTS.b18 = (c) => {
  const t = c.t; const tM = c.at('Mayflower'), t102 = c.at('cento e duas'), tW = c.at('primeiro inverno'), tH = c.at('quase metade'); c.sfx('waves', 0, 0.5); c.sfx('page', 0.3, 0.4); c.sfx('wind', tW, 0.6); c.sfx('hit', tH + 0.3, 0.7);
  const P = (a, b) => clamp((t - a) / (b - a)); const R = seeded(13); const dead = Array.from({ length: 102 }, () => R() < 0.49);
  c.env('classroom', { board: (x, W, H) => {
    x.textAlign = 'center'; x.fillStyle = '#8a5a32'; x.globalAlpha = P(0.2, 0.8);
    x.beginPath(); x.moveTo(110, 300); x.lineTo(470, 300); x.lineTo(420, 380); x.lineTo(160, 380); x.closePath(); x.fill(); x.fillRect(285, 120, 10, 180); x.fillStyle = '#f2ead8'; x.strokeStyle = '#8a5a32'; x.lineWidth = 3; x.fillRect(200, 140, 170, 120); x.strokeRect(200, 140, 170, 120); x.fillStyle = '#2a6ad6'; x.fillRect(60, 380, 460, 30);
    x.fillStyle = '#222'; x.font = '900 52px Inter'; x.fillText('1620 · MAYFLOWER', 290, 480); x.globalAlpha = 1;
    const n = Math.ceil(102 * P(t102, t102 + 1.4)); for (let i = 0; i < n; i++) { const cc = i % 17, rr = Math.floor(i / 17); const gone = dead[i] && t > tH; x.fillStyle = gone ? '#c9c9c9' : '#2a6ad6'; x.beginPath(); x.arc(700 + cc * 44, 150 + rr * 44, 15, 0, 7); x.fill(); }
    if (n) { x.fillStyle = '#2a6ad6'; x.font = '900 48px Inter'; x.fillText('102 PESSOAS', 1052, 470); }
    if (t > tH) { x.fillStyle = '#e02020'; x.font = '900 46px Inter'; x.fillText('1º INVERNO: QUASE METADE MORREU', 1052, 540); }
  } });
  c.track('bia', [{ t: 0, p: [4.4, 0, -4.4], ry: PI + 0.7, a: 'point', e2: t > tH ? 'worried' : 'neutral' }]);
  boardCam(c, 0, c.dur, 2.4, 1.4);
  if (t < tM) c.chip(960, 980, 'AVISO Nº 1', 'red', 0.2, tM + 2);
};

SHOTS.b19 = (c) => {
  const t = c.t; const tF = c.at('punhado'), tA = c.at('asma'), tB = c.at('A Bia fecha'), tI = c.at('o inverno chega'); c.sfx('chalk', tF, 0.5); c.sfx('error', tA + 0.4, 0.4); c.sfx('page', tB + 0.3, 0.7); c.sfx('wind', tI, 0.9);
  const P = (a, b) => clamp((t - a) / (b - a));
  if (t < tB) {
    c.env('classroom', { board: (x, W, H) => {
      x.fillStyle = '#cfe6ff'; x.fillRect(40, 40, 600, 500); x.fillStyle = '#2f8a3e'; x.beginPath(); x.arc(340, 290, 110, 0, 7); x.fill(); x.fillStyle = '#6a5a4a'; x.beginPath(); x.moveTo(300, 290); x.lineTo(340, 220); x.lineTo(380, 290); x.fill();
      x.textAlign = 'center'; x.fillStyle = '#16365b'; x.font = '900 44px Inter'; x.fillText('TRISTÃO DA CUNHA', 340, 110); x.font = '700 30px Inter'; x.fillText('meio do Oceano Atlântico', 340, 480);
      const a = P(tF, tF + 0.6); if (a > 0) { x.globalAlpha = a; const top = [[880, 130], [960, 130], [1040, 130], [1120, 130], [1200, 130]]; x.strokeStyle = '#2a6ad6'; x.lineWidth = 3; const rows = [top]; for (let r = 1; r < 4; r++) { const n = 5 + r * 5; rows.push(Array.from({ length: n }, (_, i) => [1040 + (i - (n - 1) / 2) * (560 / n), 130 + r * 105])); }
        for (let r = 1; r < 4; r++) { const k = P(tF + r * 0.4, tF + r * 0.4 + 0.4); if (k <= 0) continue; rows[r].forEach((p, i) => { const q1 = rows[r - 1][i % rows[r - 1].length], q2 = rows[r - 1][(i * 3 + 1) % rows[r - 1].length]; x.globalAlpha = a * k; x.beginPath(); x.moveTo(q1[0], q1[1]); x.lineTo(p[0], p[1]); x.moveTo(q2[0], q2[1]); x.lineTo(p[0], p[1]); x.stroke(); }); }
        rows.forEach((row, r) => { const k = r ? P(tF + r * 0.4, tF + r * 0.4 + 0.4) : 1; x.globalAlpha = a * k; row.forEach(p => { x.fillStyle = r ? '#2a6ad6' : '#e02020'; x.beginPath(); x.arc(p[0], p[1], r ? 11 : 18, 0, 7); x.fill(); }); }); x.globalAlpha = 1; }
      if (t > tA) { x.globalAlpha = P(tA, tA + 0.4); x.fillStyle = '#e02020'; x.font = '900 46px Inter'; x.fillText('ASMA: MUITO MAIS COMUM', 1040, 545); x.globalAlpha = 1; }
    } });
    c.track('bia', [{ t: 0, p: [4.4, 0, -4.4], ry: PI + 0.7, a: 'point', e2: 'neutral' }]);
    boardCam(c, 0, tB, 2.4, 1.4);
    c.chip(960, 980, 'AVISO Nº 2', 'red', 0.2, tF + 1);
  } else if (t < tI) {
    c.env('library', { bolts: [] }); c.torch([0.4, 2.2, -2.6], [0, 1.4, -5.2], 90);
    c.track('bia', [{ t: 0, p: [0, 0, -4.9], ry: PI, a: 'idle', e2: 'worried', hold: t < tB + 0.4 ? 'book' : null }]);
    c.cam([{ t: tB, p: [1.2, 1.9, -2.6], l: [0, 1.6, -4.9], f: 36 }, { t: tI, p: [1.0, 1.9, -2.9], l: [0, 1.6, -4.9], f: 32 }]);
  } else {
    c.env('street', { tod: 'gray', light: 'red' });
    c.track('bia', [{ t: 0, p: [0, 0, 2], ry: PI, a: 'walk', e2: 'worried' }, { t: c.dur, p: [0, 0, 2 - (c.dur - tI) * 1.2], ry: PI, a: 'walk', e2: 'worried' }]);
    c.cam([{ t: tI, p: [0.5, 2.6, 9], l: [0, 2.4, -20], f: 50 }, { t: c.dur, p: [0.3, 2.4, 7.5], l: [0, 2.4, -20], f: 50 }]);
    c.chip(960, 140, 'JUNHO · INVERNO', 'blue', tI, 1e9);
  }
};

// ================= CLÍMAX =================
SHOTS.b20 = (c) => {
  const t = c.t; const tF = c.at('febre'), tS = c.at('Em uma semana'), tR = c.at('tem remédio'), tP = c.at('precisa de energia'); c.sfx('cough', 0.3, 0.8); c.sfx('cough', 1.4, 0.6); c.sfx('cough', tF + 0.5, 0.7); c.sfx('heartbeat', tP, 0.6);
  if (t < tS) {
    c.env('street', { tod: 'gray', light: 'red' });
    c.track('tonho', [{ t: 0, p: [0, 0, 3], ry: 0.3, a: 'hurt', e2: 'tired' }]); c.track('helena', [{ t: 0, p: [1.2, 0, 3.6], ry: -1.8, a: 'idle', e2: 'worried', hold: 'bandage' }]);
    c.cam([{ t: 0, p: [2.4, 1.9, 7.2], l: [0.4, 1.5, 3], f: 40 }, { t: tS, p: [2.0, 1.9, 6.4], l: [0.4, 1.5, 3], f: 36 }]);
  } else {
    const u = prog(t, tS, c.dur); const z = lerp(2, -10, u);
    c.track('bia', [{ t: tS, p: [-0.5, 0, 2], ry: PI, a: 'walk', e2: 'worried' }, { t: c.dur, p: [-0.5, 0, -10], ry: PI, a: 'walk', e2: 'worried' }]);
    c.track('helena', [{ t: tS, p: [0.6, 0, 1.8], ry: PI, a: 'walk', e2: 'worried', hold: 'light' }, { t: c.dur, p: [0.6, 0, -10.2], ry: PI, a: 'walk', e2: 'worried', hold: 'light' }]);
    c.env('hospital', { torch: [0.9, 1.5, z + 1.4, 0.3, 0.8, z - 9] });
    c.camSet([0.1, 1.7, z + 4.4], [0, 1.4, z - 8], 52);
    if (t > tR) c.chip(430, 150, 'REMÉDIO: OK', 'green', tR, 1e9); if (t > tP) c.chip(1500, 150, 'ENERGIA: 0%', 'red', tP, 1e9);
  }
  if (t > tF) { const n = Math.min(20, Math.max(1, Math.round(20 * prog(t, tF, tS + 1.5)))); c.ui(bigNum('DOENTES: ' + n, 960, 240, { size: 90, color: '#ff4b3e', glow: 'rgba(255,75,62,.5)' })); }
};

SHOTS.b21 = (c) => {
  const t = c.t; const tT = c.at('tempestade'), tQ = c.at('queima'), tO = c.at('oxigênio'), tA = c.at('aquecedor'), tG = c.at('geladeira'), tL = c.at('A doutora olha'), tV = c.at('Você consegue');
  c.sfx('boom', tT, 0.8); c.sfx('spark', tQ, 0.9); c.sfx('blackout', tQ + 0.2, 0.6); c.sfx('error', tO, 0.4); c.sfx('error', tA, 0.4); c.sfx('error', tG, 0.4);
  if (t < tL) {
    const fl = (t > tT && t < tT + 0.15) || (t > tT + 0.35 && t < tT + 0.45) ? 1 : 0;
    c.env('gen', { power: t < tQ ? 0.6 : 0, smoke: t > tQ ? 0.9 : 0, shake: t > tQ - 0.3 && t < tQ + 0.5 ? 1 : 0 });
    if (fl) c.flash('#dfe8ff', 0.6); if (t > tQ && t < tQ + 0.25) c.flash('#ffffff', 0.5);
    c.cam([{ t: 0, p: [5.4, 2.8, 5.6], l: [0, 1.6, -2.4], f: 50 }, { t: tL, p: [4.4, 2.6, 4.6], l: [0, 1.6, -2.4], f: 46 }]);
    chipsAt(c, [['oxigênio', 400, 900, 'OXIGÊNIO ✗', 'red'], ['aquecedor', 960, 900, 'AQUECEDOR ✗', 'red'], ['geladeira', 1520, 900, 'GELADEIRA ✗', 'red']]);
    if (t > tQ) c.ui(stamp('QUEIMOU', { top: 200, size: 100, s: pop(t, tQ, 0.3) || 1 }));
  } else {
    c.env('hospital', { torch: [27.8, 1.9, 0.4, 25.6, 1.4, 0.6] });
    for (let i = 0; i < 3; i++) { const m = c.mini(i, { p: [22 + i * 4, 0.82, -1.65], ry: 0, a: 'idle', e: 'tired', s: 0.85 }); m.root.rotation.set(-PI / 2, 0, 0, 'YXZ'); }
    c.track('helena', [{ t: 0, p: [27.8, 0, 0.4], ry: -1.5, a: 'idle', e2: 'worried', hold: 'light' }]);
    c.track('bia', [{ t: 0, p: [25.6, 0, 0.6], ry: 1.5, a: 'idle', e2: t > tV + 0.8 ? 'angry' : 'scared' }]);
    c.cam([{ t: tL, p: [26.7, 1.8, 3.4], l: [26.7, 1.7, 0.5], f: 44 }, { t: c.dur, p: [26.7, 1.8, 3.0], l: [26.7, 1.7, 0.5], f: 40 }]);
    c.bubble(c.CH.helena, 'Você consegue?', tV, c.dur, [0, 2.9, 0]);
  }
};

SHOTS.b22 = (c) => {
  const t = c.t; const tS = c.at('não está sozinha'), tT = c.at('O Tonho'), tD = c.at('o Davi'), tJ = c.at('o Seu Jorge'), tC = c.at('Lá fora'); c.sfx('wind', 0, 0.5); c.sfx('boom', tC + 0.3, 0.6); c.sfx('clang', tT + 0.4, 0.5);
  const fl = (t > tC + 0.3 && t < tC + 0.45) ? 1 : 0;
  c.env('gen', { power: 0, smoke: 0.2 }); if (fl) c.flash('#dfe8ff', 0.5);
  c.track('bia', [{ t: 0, p: [-0.9, 0, -0.5], ry: PI, a: 'tinker', e2: 'worried', hold: 'wrench' }]);
  const on = (q) => t > q - 0.2;
  if (on(tT)) c.track('tonho', [{ t: 0, p: [0.6, 0, -0.5], ry: PI, a: 'carryidle', e2: 'angry' }]);
  if (on(tD)) { c.track('davi', [{ t: 0, p: [-2.4, 0, 0.6], ry: 2.4, a: 'idle', e2: 'worried', hold: 'light' }]); c.torch([-2.2, 1.6, 0.4], [-0.6, 1.0, -1.6], 50); } else c.torch([1.2, 2.4, 1.2], [-1.0, 1.0, -1.6], 45);
  if (on(tJ)) c.track('jorge', [{ t: 0, p: [-3.5, 0, -2.4], ry: PI / 2, a: 'crank', e2: 'angry' }]);
  if (t < tS) c.cam([{ t: 0, p: [2.0, 1.9, 0.9], l: [-0.9, 1.6, -0.6], f: 40 }, { t: tS, p: [1.6, 1.9, 0.6], l: [-0.9, 1.6, -0.6], f: 34 }]);
  else if (t < tC) c.cam([{ t: tS, p: [4.0, 2.4, 5.0], l: [-1.0, 1.3, -1.0], f: 50 }, { t: tC, p: [3.2, 2.2, 4.4], l: [-1.0, 1.3, -1.0], f: 46 }]);
  else c.cam([{ t: tC, p: [3.8, 2.6, 4.8], l: [-1.4, 1.2, -1.2], f: 50 }, { t: c.dur, p: [3.4, 2.5, 4.4], l: [-1.4, 1.2, -1.2], f: 48 }]);
  chipsAt(c, [['O Tonho', 400, 130, 'TONHO: SEGURA', 'gold'], ['o Davi', 960, 130, 'DAVI: ILUMINA', 'blue'], ['o Seu Jorge', 1520, 130, 'JORGE: MANIVELA', 'green']]);
};

SHOTS.b23 = (c) => {
  const t = c.t; const t1 = c.at('Primeira tentativa'), t2 = c.at('Segunda'), t3 = c.at('Na terceira'), tT1 = c.at('o motor tosse'), tT2 = c.at('tosse de novo'), tL = c.at('liga'), tLu = c.at('As luzes');
  c.sfx('crank', t1, 0.6); c.sfx('crank', t2, 0.6); c.sfx('crank', t3, 0.6); c.sfx('cough', tT1 + 0.2, 0.9); c.sfx('cough', tT2 + 0.2, 0.9); c.sfx('engine', tL, 0.9); c.sfx('power', tL + 0.1, 0.9); c.sfx('cheer', tL + 0.4, 0.6);
  if (t < tLu) {
    const on = t >= tL; const fl = (t >= tL - 0.15 && t < tL + 0.4) ? (Math.sin(t * 50) > 0 ? 1 : 0.3) : (on ? 1 : 0);
    const cr = t > t1 ? (t - t1) * 9 : 0; const sm = (t > t2 && t < t2 + 1.2) ? 0.9 : ((t > tT1 && t < tL) ? 0.6 : (on ? 0.3 : 0));
    c.env('gen', { power: fl, shake: t > t1 ? (on ? 0.5 : 0.3) : 0, crank: cr, smoke: sm });
    c.track('bia', [{ t: 0, p: [-0.9, 0, -0.5], ry: PI, a: on ? 'cheer' : 'tinker', e2: on ? 'happy' : 'worried', hold: on ? null : 'wrench' }]);
    c.track('tonho', [{ t: 0, p: [0.6, 0, -0.5], ry: PI, a: on ? 'clap' : 'carryidle', e2: on ? 'happy' : 'angry' }]);
    c.track('davi', [{ t: 0, p: [-2.4, 0, 0.6], ry: 2.4, a: on ? 'cheer' : 'idle', e2: on ? 'happy' : 'worried', hold: on ? null : 'light' }]);
    c.track('jorge', [{ t: 0, p: [-3.5, 0, -2.4], ry: PI / 2, a: on ? 'cheer' : 'crank', e2: on ? 'happy' : 'angry' }]);
    if (!on) c.torch([-2.2, 1.6, 0.4], [-0.6, 1.0, -1.6], 50);
    if (t < t3) c.cam([{ t: 0, p: [3.8, 2.6, 4.8], l: [-1.4, 1.2, -1.2], f: 50 }, { t: t3, p: [3.2, 2.5, 4.2], l: [-1.4, 1.2, -1.2], f: 46 }]);
    else if (t < tL) c.cam([{ t: t3, p: [-0.4, 3.4, 3.4], l: [-1.2, 1.0, -1.0], f: 46 }, { t: tL, p: [-0.4, 3.2, 3.0], l: [-1.2, 1.0, -1.0], f: 42 }]);
    else c.cam([{ t: tL, p: [3.2, 1.9, 5.0], l: [-0.8, 2.0, -2.0], f: 52 }, { t: tLu, p: [2.4, 2.0, 5.6], l: [-1.0, 2.1, -2.0], f: 54 }]);
    const n = t < t1 ? 0 : t < t2 ? 1 : t < t3 ? 2 : 3; if (n) c.chip(960, 140, 'TENTATIVA ' + n, on ? 'green' : 'gold', t1, 1e9);
    if (t > t1 + 0.6 && t < t2) c.chip(960, 230, 'NADA', 'red', t1 + 0.6, t2); if (t > t2 + 0.6 && t < t3) c.chip(960, 230, 'FUMAÇA', 'red', t2 + 0.6, t3);
    if (t >= tL - 0.15 && t < tL + 0.3) c.flash('#fff2b0', 0.35);
    if (t > tL) c.ui(bigNum('LIGOU!', 960, 260, { size: 130, color: '#3ddc6a', glow: 'rgba(61,220,106,.7)', s: pop(t, tL, 0.3) || 1 }));
  } else {
    const k = prog(t, tLu, tLu + 2.0); const idx = Math.floor(k * 12);
    c.env('hospital', { power: k > 0.15 ? 1 : 0 });
    c.camSet([0.1, 1.7, 5.4 - k * 2], [0, 1.6, -30], 52);
    c.ui(center('ENERGIA: ' + Math.round(k * 100) + '%', { top: 120, size: 70, color: '#3ddc6a' }));
  }
};

SHOTS.b24 = (c) => {
  const t = c.t; const tE = c.at('escreve o número'), t98 = c.at('Noventa e oito'), tB = c.at('E a Bia dorme'); c.sfx('chalk', tE + 0.4, 0.5); c.sfx('tada', t98, 0.6); c.sfx('pad', tB, 0.4);
  if (t < tB) {
    c.env('hospital', { power: 1 });
    for (let i = 0; i < 3; i++) { const m = c.mini(i, { p: [22 + i * 4, 0.82, -1.65], ry: 0, a: 'idle', e: 'happy', s: 0.85 }); m.root.rotation.set(-PI / 2, 0, 0, 'YXZ'); }
    c.track('helena', [{ t: 0, p: [27.8, 0, 0.4], ry: -2.0, a: t > tE ? 'write' : 'idle', e2: 'happy', hold: t > tE ? 'marker' : null }]);
    c.cam([{ t: 0, p: [22, 2.4, 3.6], l: [26, 1.0, -2.0], f: 46 }, { t: tE, p: [23, 2.2, 3.4], l: [26.5, 1.2, -1.0], f: 44 }, { t: tE, p: [25.4, 2.0, -0.4], l: [27.8, 1.7, 0.3], f: 42 }, { t: tB, p: [25.7, 2.0, -0.3], l: [27.8, 1.7, 0.3], f: 38 }]);
    if (t > t98) c.ui(bigNum('98', 1500, 250, { size: 200, color: '#ffd21f', glow: 'rgba(255,210,31,.7)', s: pop(t, t98, 0.3) || 1 }));
    if (t > t98 + 0.8) c.chip(1500, 400, 'NINGUÉM FICOU PRA TRÁS', 'green', t98 + 0.8, 1e9);
  } else {
    c.env('gen', { power: 1, shake: 0.3 });
    c.track('bia', [{ t: 0, p: [3.2, 0, 1.0], ry: 0.54, a: 'floor', e2: 'tired', over: { hz: 0.4, hx: 0.3 } }]);
    c.cam([{ t: tB, p: [5.0, 1.4, 4.0], l: [3.2, 0.8, 1.0], f: 40 }, { t: c.dur, p: [4.6, 1.3, 3.4], l: [3.2, 0.8, 1.0], f: 34 }]);
    c.ui(bigNum('Z z z', 1380, 260, { size: 90, color: '#cfe0ff', a: 0.5 + 0.5 * Math.sin(t * 3) }));
  }
};

// ================= FINAL =================
SHOTS.b25 = (c) => {
  const t = c.t; const tC = c.at('primeira colheita'), tB1 = c.at('O primeiro bebê'), tB2 = c.at('o segundo'), tR = c.at('A regra'), tA = c.at('árvore genealógica'); c.sfx('tick', 0.3, 0.4); c.sfx('tada', tC, 0.5); c.sfx('aww', tB1 + 0.3, 0.6); c.sfx('chalk', tA, 0.5);
  if (t < tR) {
    const u = prog(t, 0.2, tR); c.env('farm', { cycle: (t * 0.5) % 1, plant: 1, which: 0 });
    c.track('jorge', [{ t: 0, p: [-5.9, 0, 1.2], ry: 0.6, a: 'cheer', e2: 'happy' }]);
    c.track('bia', [{ t: 0, p: [-7.6, 0, 2.4], ry: 0.6, a: t > tB1 ? 'idle' : 'clap', e2: 'happy', hold: t > tB1 ? 'baby' : null, over: t > tB1 ? { rsx: 1.1, rel: 1.4, lsx: 1.1, lel: 1.4 } : undefined }]);
    c.cam([{ t: 0, p: [-3, 3.0, 8.5], l: [-6.5, 1.0, 0.6], f: 50 }, { t: tB1, p: [-4.5, 2.4, 6.8], l: [-6.8, 1.1, 1.6], f: 46 }, { t: tR, p: [-5.6, 2.0, 5.8], l: [-7.2, 1.3, 2.2], f: 40 }]);
    c.ui(bigNum('ANO ' + Math.max(1, Math.round(1 + 9 * u)), 960, 130, { size: 120, color: '#ffd21f', glow: 'rgba(255,210,31,.5)' }));
    chipsAt(c, [['primeira colheita', 420, 900, '1ª COLHEITA', 'green'], ['O primeiro bebê', 960, 900, '1º BEBÊ', 'gold'], ['o segundo', 1500, 900, '2º BEBÊ', 'gold']]);
  } else {
    const P = (a, b) => clamp((t - a) / (b - a)); const gk = P(tA, tA + 2.5) * 4;
    c.env('classroom', { board: (x, W, H) => {
      x.textAlign = 'center'; x.fillStyle = '#1c9a4a'; x.font = '900 64px Inter'; x.fillText('LEI Nº 1: ÁRVORE GENEALÓGICA', W / 2, 80);
      const ys = [150, 260, 370, 480]; const ns = [12, 18, 26, 34]; const R = seeded(5);
      for (let r = 0; r < 4; r++) { const k = clamp(gk - r); if (k <= 0) continue; x.globalAlpha = k; const n = ns[r]; for (let i = 0; i < n; i++) { const px = 100 + i * (W - 200) / (n - 1), py = ys[r]; if (r) { x.strokeStyle = '#9ab'; x.lineWidth = 2; const q = 100 + Math.floor(R() * ns[r - 1]) * (W - 200) / (ns[r - 1] - 1); x.beginPath(); x.moveTo(q, ys[r - 1]); x.lineTo(px, py); x.stroke(); } x.fillStyle = COLS[(i + r) % 9] === 0xf4f4f4 ? '#888' : '#' + COLS[(i + r) % 9].toString(16).padStart(6, '0'); x.beginPath(); x.arc(px, py, 12, 0, 7); x.fill(); } x.globalAlpha = 1; }
    } });
    c.track('bia', [{ t: 0, p: [4.4, 0, -4.4], ry: PI + 0.7, a: 'point', e2: 'happy' }]);
    boardCam(c, tR, c.dur, 3.0, 2.0);
  }
};

SHOTS.b26 = (c) => {
  const t = c.t; const tF = c.at('senta em volta'), tM = c.at('o número muda'), n1 = c.at('Cento e cinquenta'), n2 = c.at('Trezentos'), n3 = c.at('Quinhentos'); c.sfx('crackle', 0, 0.5); [n1, n2].forEach(q => c.sfx('pop', q, 0.6)); c.sfx('cheer', n3, 0.6);
  c.env('final', { night: true }); const F = c.PROPS.fire; F.visible = true; F.position.set(0, 0, 0); F.scale.setScalar(0.9); F.userData.flames.forEach((m, i) => m.scale.y = 1 + 0.25 * Math.sin(t * 11 + i)); c.glow([0, 1.0, 0.2], 0xff8a2a, 22);
  c.state.fade = 1 - prog(t, 0, 0.4);
  const n = t >= n3 ? 500 : t >= n2 ? 300 : t >= n1 ? 150 : 98;
  c.track('bia', [{ t: 0, p: [0, 0, 2.2], ry: PI, a: 'floor', e2: 'happy', s: 0.92 }]);
  const cnt = Math.min(140, Math.round(n * 0.28)); const L = []; const R = seeded(21);
  for (let i = 0; i < cnt; i++) { const a = PI * 0.15 + (i * 2.399) % (PI * 1.7); const rr = 2.8 + Math.floor(i / 14) * 1.1 + R() * 0.4; const px = Math.sin(a + PI) * rr, pz = Math.cos(a + PI) * rr; if (pz > 1.2) continue; L.push({ p: [px, 0, pz], ry: Math.atan2(-px, -pz), c: COLS[i % 9], s: i % 4 === 0 ? 0.6 : 0.9 + 0.1 * R(), a: t > n3 && i % 2 ? 'cheer' : 'idle' }); }
  c.crowd(L);
  c.cam([{ t: 0, p: [0, 2.1, 6.4], l: [0, 1.1, -1.5], f: 48 }, { t: c.dur, p: [0, 4.4, 11], l: [0, 1.3, -2.5], f: 50 }]);
  if (t > tF && t < tM + 0.6) c.tag([0, 2.4, 2.2], 'BIA · 86 ANOS', 'gold', tF, tM + 0.6);
  const lastChg = Math.max(...[n1, n2, n3].filter(q => q <= t), 0); const s = 1 + 0.5 * Math.max(0, 1 - (t - lastChg) / 0.3);
  c.ui(center('ANO 60 · PESSOAS', { top: 70, size: 34, color: '#ffe9b0', ls: 8 })); c.ui(bigNum(n, 960, 170, { size: 150, color: '#ffd21f', glow: 'rgba(255,210,31,.6)', s }));
};

SHOTS.b27 = (c) => {
  const t = c.t; const tR = c.at('Recomeçou porque'), tN = c.at('não deixar'); c.sfx('pad', 0, 0.5);
  c.env('final', { night: false });
  c.track('bia', [{ t: 0, p: [0, 0, 0], ry: PI, a: 'floor', e2: 'happy', s: 0.92 }]);
  const L = []; for (let i = 0; i < 30; i++) { const x = (i % 10 - 4.5) * 1.1, z = 1.6 + Math.floor(i / 10) * 1.2; L.push({ p: [x, 0, z], ry: PI, c: COLS[i % 9], s: 0.9, a: 'idle' }); } c.crowd(L);
  c.cam([{ t: 0, p: [0.2, 1.5, -3.4], l: [0, 1.4, 20], f: 50 }, { t: c.dur, p: [0.6, 3.0, -7.4], l: [0, 1.6, 20], f: 50 }]);
  if (t > tR) c.chip(960, 160, 'DECIDIR JUNTOS', 'gold', tR, 1e9); if (t > tN) c.chip(960, 250, 'NÃO DEIXAR NINGUÉM PRA TRÁS', 'green', tN, 1e9);
  c.state.fade = prog(t, c.dur - 0.5, c.dur);
};

SHOTS.b28 = (c) => {
  const t = c.t; const tQ = c.at('qual seria'), tC = c.at('Comenta'), tM = c.at('em Marte'), tS = c.at('Se inscreve'), tB = c.at('Até lá'); c.sfx('whoosh', tM, 0.5); c.sfx('click', tS + 1.1, 0.8); c.sfx('ding', tS + 1.15, 0.6); c.sfx('tada', tB, 0.6);
  c.env('outro');
  const w = t > tB;
  c.track('bia', [{ t: 0, p: [-3.0, 0, 5.2], ry: 0.3, a: w ? 'wave' : 'idle', e2: 'happy' }]); c.track('helena', [{ t: 0, p: [-1.0, 0, 5.0], ry: 0.1, a: w ? 'wave' : 'idle', e2: 'happy' }]);
  c.track('jorge', [{ t: 0, p: [1.0, 0, 5.0], ry: -0.1, a: w ? 'wave' : 'idle', e2: 'happy' }]); c.track('davi', [{ t: 0, p: [3.0, 0, 5.2], ry: -0.3, a: w ? 'wave' : 'idle', e2: 'happy' }]);
  c.cam([{ t: 0, p: [0, 1.9, 12.4], l: [0, 2.0, 5], f: 42 }, { t: c.dur, p: [0, 2.0, 11.4], l: [0, 2.0, 5], f: 42 }]);
  if (t > tQ && t < tM - 0.3) { const a = clamp((t - tQ) / 0.4); c.ui(`<div class="abs" style="left:0;top:130px;width:1920px;text-align:center;font-weight:900;font-size:60px;color:#fff;opacity:${a};text-shadow:0 5px 0 #000">QUAL SERIA A SUA FUNÇÃO?</div>`);
    ['MÉDICO', 'PEDREIRO', 'AGRICULTOR', 'ENGENHEIRO'].forEach((l, i) => { const s = pop(t, tQ + 0.4 + i * 0.25, 0.25); c.ui(`<div class="abs" style="left:${170 + i * 410}px;top:240px;width:360px;padding:20px 0;text-align:center;border-radius:24px;background:${['#38d6ff', '#ffb02e', '#3ddc6a', '#ffd21f'][i]};color:#111;font-weight:900;font-size:50px;transform:scale(${s || 0.001});box-shadow:0 8px 0 rgba(0,0,0,.35)">${l}</div>`); }); }
  if (t > tM - 0.2 && t < tS - 0.1) { c.ui(`<div class="abs" style="left:0;top:120px;width:1920px;text-align:center;font-weight:900;font-size:60px;color:#fff;text-shadow:0 5px 0 #000">PRÓXIMO EPISÓDIO</div>`); c.ui(bigNum('RECOMEÇAR EM MARTE?', 960, 270, { size: 120, color: '#ff7a45', glow: 'rgba(255,122,69,.6)', s: pop(t, tM, 0.3) || 1 })); }
  if (t < tB) subBtn(c, tS);
  if (t > tB) c.ui(bigNum('ATÉ LÁ!', 960, 250, { size: 190, color: '#ffd21f', glow: 'rgba(255,210,31,.7)', s: pop(t, tB, 0.3) || 1 }));
  c.state.fade = prog(t, c.dur - 1.0, c.dur);
};
