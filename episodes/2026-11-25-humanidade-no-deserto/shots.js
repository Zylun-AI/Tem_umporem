// LONGO: "E se a humanidade tivesse que recomeçar no deserto?" — palito, 1920x1080.
// Cenário novo: 'desert' (engine/envs7.js). Também: island {storm, rain}, metro {water}, farm {dead}, void, outro.
import { clamp, lerp, ease, PI, prog, stamp, bigNum, pop, seeded, subBtn } from '/engine/kit.js';
export const SHOTS = {};
const P0 = { num: null, flag: false };
export const CAST = {
  lara: { style: 'palito', ...P0, shirt: 0x2a8ad6, trim: 0xffffff, shorts: 0x3a2a1a, hair: 'lia', scale: 0.96 },
  bento: { style: 'palito', ...P0, shirt: 0xf4efe4, trim: 0xc8402a, shorts: 0x8a6a45, hair: 'old', cap: 0xf4efe4 },
  nadia: { style: 'palito', ...P0, shirt: 0xf4f4f4, trim: 0x2fa35a, shorts: 0x2fa35a, hair: 'lia', scale: 0.96 },
  pipo: { style: 'palito', ...P0, shirt: 0xff7a1a, trim: 0x2a6ad6, shorts: 0x2a6ad6, cap: 0x2a6ad6, scale: 0.68 },
  pipov: { style: 'palito', ...P0, shirt: 0xff7a1a, trim: 0x2a6ad6, shorts: 0x2a6ad6, cap: 0x2a6ad6, scale: 1.0 },
};
const COLS = [0xd62828, 0xff7a1a, 0x2a6ad6, 0xffd21f, 0x2fa35a, 0xf4f4f4, 0x8a3ad6, 0x0aa6b8];
const title = (c, txt, t0, o = {}) => { if (c.t < t0) return; const s = pop(c.t, t0, 0.3) || 1; c.ui(`<div class="abs" style="left:0;right:0;top:${o.top ?? 70}px;text-align:center;transform:scale(${s})"><div style="display:inline-block;background:${o.bg ?? '#d62828'};border:7px solid #fff;border-radius:22px;padding:6px 60px;font-weight:900;font-size:${o.size ?? 96}px;color:${o.color ?? '#fff'};transform:rotate(-2deg);box-shadow:0 14px 0 rgba(0,0,0,.45)">${txt}</div></div>`); };
const card = (html, o = {}) => `<div class="abs" style="left:${o.x ?? 960}px;top:${o.y ?? 150}px;transform:translate(-50%,0) scale(${o.s ?? 1});opacity:${o.a ?? 1};background:rgba(28,16,6,.86);border:5px solid ${o.b ?? '#ffb02e'};border-radius:26px;padding:22px 44px;color:#fff;font-weight:900;font-size:${o.size ?? 50}px;text-align:center;white-space:nowrap">${html}</div>`;
const big = (c, txt, t0, o = {}) => { if (c.t < t0) return; c.ui(bigNum(txt, o.x ?? 960, o.y ?? 250, { size: o.size ?? 130, color: o.color ?? '#ffd21f', glow: o.glow ?? 'rgba(255,210,31,.6)', s: pop(c.t, t0, 0.3) || 1 })); };
const thermo = (c, v, o = {}) => c.ui(`<div class="abs" style="left:${o.x ?? 1480}px;top:${o.y ?? 120}px;padding:16px 34px;border-radius:24px;background:rgba(28,16,6,.86);border:5px solid ${o.b ?? '#ff3b30'};color:${o.color ?? '#fff'};font-weight:900;font-size:${o.size ?? 64}px;white-space:nowrap">🌡️ ${v}</div>`);
const heat = (c, k = 1) => c.ui(`<div class="abs" style="left:0;top:0;width:1920px;height:1080px;background:radial-gradient(ellipse at 50% 0%,rgba(255,240,180,${0.35 * k}),rgba(255,120,20,${0.22 * k}) 70%);pointer-events:none"></div>`);
const dusty = (c, k = 1) => c.ui(`<div class="abs" style="left:0;top:0;width:1920px;height:1080px;box-shadow:inset 0 0 260px 110px rgba(150,90,40,${0.6 * k});pointer-events:none"></div>`);
const D = (c, p = {}) => c.env('desert', p);
const tag = (c, txt, sub, col) => c.ui(`<div class="abs" style="left:120px;top:760px;padding:16px 40px;border-radius:24px;background:rgba(28,16,6,.86);border:5px solid ${col};color:#fff;font-weight:900;font-size:60px">${txt}<div style="font-size:36px;color:${col}">${sub}</div></div>`);
// pontos do cenário
const WELL = [0, 0, -4], PUMP = [1.9, 0, -4], TANK = [5, 4.3, -7.5];
// altura das dunas (mesma fórmula de envs7.js)
const H = (x, z) => { const y = -z; const r = Math.hypot(x, y); const k = clamp((r - 45) / 40); const d = (Math.sin(x * 0.045 + Math.sin(y * 0.02) * 2) * 0.5 + 0.5) * (Math.cos(y * 0.03 + x * 0.01) * 0.4 + 0.6); return k * (d * 16 + Math.sin(x * 0.11) * 1.2); };
// gente no oásis (entre a lagoa e a vila)
const camp = (c, n, o = {}) => { const R = seeded(o.seed || 5); for (let i = 0; i < n; i++) { const x = -8 + R() * 18, z = 0 + R() * 6; const walk = o.walk && i % 3 === 0; const ph = c.t * 0.25 + i; const wx = walk ? x + Math.sin(ph) * 1.5 : x;
  c.mini(i, { p: [wx, 0, z], ry: walk ? (Math.cos(ph) > 0 ? PI / 2 : -PI / 2) : (o.ry ?? (R() - 0.5) * 2), a: walk ? 'walk' : (o.a || 'idle'), e: o.e || 'happy', s: (o.kids && i % 4 === 0) ? 0.62 : 0.95 }); } };
const crowdAt = (c, n, cx, cz, o = {}) => c.crowd(Array.from({ length: n }, (_, i) => { const a = i * 2.399, r = (o.r0 ?? 0.8) + Math.sqrt(i) * (o.sp ?? 0.55); const x = cx + Math.cos(a) * r * (o.sx ?? 1.4), z = cz + Math.sin(a) * r * (o.sz ?? 0.8);
  return { p: [x, 0, z], ry: o.ry ?? Math.atan2(cx - x, cz - z) + PI, c: COLS[i % COLS.length], s: i % 5 ? 0.95 : 0.62, a: o.a || 'idle' }; }));

// ================= GANCHO =================
SHOTS.b01 = (c) => {
  const t = c.t; const tA = c.at('Areia até'), tE = c.at('E esse oásis'), tU = c.at('única casa'); c.sfx('wind', 0, 0.4); c.sfx('riser', 0.2, 0.4); c.sfx('boom', tU, 0.8);
  D(c, {});
  if (t < tA) { c.cam([{ t: 0, p: [-140, 60, 160], l: [0, 0, 0], f: 46 }, { t: tA, p: [-110, 45, 120], l: [0, 0, 0], f: 46 }]); c.chip(960, 90, 'O MAIOR DESERTO QUENTE DO MUNDO', 'gold', 0.6, tA); }
  else if (t < tE) { c.cam([{ t: tA, p: [60, 26, 70], l: [-4, 2, -4], f: 46 }, { t: tE, p: [48, 20, 56], l: [-4, 2, -4], f: 46 }]);
    ['🏜️ AREIA SEM FIM', '🌧️ QUASE NUNCA CHOVE'].forEach((s, i) => { const t0 = tA + 0.3 + i * 1.0; if (t > t0) c.ui(card(s, { x: 640 + i * 640, y: 90, size: 44, b: '#ff3b30', s: pop(t, t0, 0.25) || 1 })); }); }
  else { camp(c, 36, { walk: true, kids: true }); c.cam([{ t: tE, p: [-4, 3.5, 16], l: [2, 2, -4], f: 50 }, { t: c.dur, p: [-3, 3.2, 13.5], l: [2, 2, -4], f: 50 }]); if (t > tU) title(c, 'A ÚNICA CASA DE 150 PESSOAS', tU + 0.1, { size: 78, bg: '#c8402a' }); }
};

SHOTS.b02 = (c) => {
  const t = c.t; const tP = c.at('Uma parede'), tB = c.at('E a bomba'), tS = c.at('acabou de parar'); c.sfx('wind', 0, 0.6); c.sfx('engine', 0, 0.25); c.sfx('blackout', tS, 0.8); c.sfx('dramatic', tP + 0.3, 0.5);
  const off = t > tS;
  if (t < tB) { D(c, { wall: lerp(0.35, 0.55, prog(t, 0, tB)), storm: 0.08 }); camp(c, 20, { ry: PI, a: t < tP ? 'idle' : 'lookup', e: 'scared' });
    if (t < tP) c.cam([{ t: 0, p: [4, 2.2, 14], l: [0, 4, -40], f: 50 }, { t: tP, p: [3.5, 2.1, 12.5], l: [0, 5, -40], f: 50 }]); else c.cam([{ t: tP, p: [40, 22, 50], l: [0, 15, -120], f: 50 }, { t: tB, p: [34, 18, 42], l: [0, 15, -120], f: 50 }]);
    if (t > tP) c.ui(card('🌪️ MAIS DE 1 KM DE ALTURA', { y: 70, b: '#ff3b30', s: pop(t, tP + 0.6, 0.25) || 1 })); }
  else { D(c, { wall: 0.6, storm: 0.25, clog: lerp(0.2, 0.55, prog(t, tB, c.dur)) }); c.shake(off ? 0.12 : 0.05);
    c.track('lara', [{ t: 0, p: [0.9, 0, -2.6], ry: 2.48, a: off ? 'panic' : 'tinker', e2: off ? 'scared' : 'worried', hold: 'wrench' }]);
    c.frame('lara', { yaw: -0.95, d: 4.2, h: 1.0, f: 44, t0: tB, to: { d: 3.7 } });
    c.tag([1.9, 1.9, -4], 'BOMBA DO POÇO', 'gold', tB, tS); if (off) title(c, 'A BOMBA PAROU', tS, { size: 92 }); }
  dusty(c, 0.5);
};

SHOTS.b03 = (c) => {
  const t = c.t; const tS = c.at('E no calor'), tL = c.at('um litro'), tV = c.at('voltar três'); c.sfx('heartbeat', 0, 0.6); c.sfx('whoosh', tV, 0.7);
  D(c, { storm: 0.3, wall: 0.7, tank: lerp(0.5, 0.3, prog(t, 0, c.dur)), clog: 0.6 });
  if (t < tS) { c.cam([{ t: 0, p: [10, 3.0, 0], l: TANK, f: 46 }, { t: tS, p: [9, 3.2, -1], l: TANK, f: 46 }]); c.chip(960, 90, '💧 SEM BOMBA, SEM ÁGUA', 'red', 0.3, tS); }
  else { c.track('pipo', [{ t: 0, p: [-1, 0, 2], ry: 0.3, a: 'idle', e2: 'tired', hold: 'bottle' }]); c.frame('pipo', { yaw: 0.25, d: 2.6, h: 0.8, up: 0.3, f: 44, t0: tS, to: { d: 2.2 } });
    if (t > tL) big(c, '1 LITRO DE SUOR POR HORA', tL, { y: 180, size: 96, color: '#ff6b4a', glow: 'rgba(255,80,40,.6)' }); }
  if (t > tV) c.chip(420, 520, '⏪ 3 ANOS ANTES', 'gold', tV, 1e9);
  dusty(c, 0.5);
};

// ================= COMEÇO =================
SHOTS.b04 = (c) => {
  const t = c.t; const tR = c.at('Rios'), tM = c.at('e o mofo'); c.sfx('water', 0, 0.6); c.sfx('crackle', 0.2, 0.3); c.sfx('dramatic', tM, 0.5);
  if (t < tR) { c.env('island', { storm: 1, rain: 1, tod: 'day' }); c.cam([{ t: 0, p: [0, 6, 30], l: [0, 2, -10], f: 50 }, { t: tR, p: [0, 5, 24], l: [0, 2, -10], f: 50 }]); c.chip(960, 90, '🌧️ CHUVA QUE NÃO PARA', 'blue', 0.6, tR); }
  else if (t < tM) { c.env('metro', { water: 1, power: 0.5 }); c.cam([{ t: tR, p: [0, 2.2, 8], l: [0, 1, -10], f: 50 }, { t: tM, p: [0, 2.0, 5], l: [0, 1, -10], f: 50 }]); c.chip(960, 90, '🌊 CIDADES DEBAIXO D\'ÁGUA', 'blue', tR, tM); }
  else { c.env('farm', { dead: 1, plant: 1 }); c.cam([{ t: tM, p: [6, 3, 10], l: [0, 0.5, 0], f: 48 }, { t: c.dur, p: [5, 2.6, 8], l: [0, 0.5, 0], f: 48 }]); c.chip(960, 90, '🍄 O MOFO DESTRÓI AS PLANTAÇÕES', 'red', tM, 1e9); }
  c.ui(`<div class="abs" style="left:0;top:0;width:1920px;height:1080px;background:rgba(40,70,110,.18)"></div>`);
};

SHOTS.b05 = (c) => {
  const t = c.t; const tS = c.at('o Saara'), tN = c.at('nove milhões'), tB = c.at('maior que o Brasil'); c.sfx('whoosh', tS, 0.6); c.sfx('pop', tN, 0.5); c.sfx('pop', tB, 0.6);
  if (t < tN) { D(c, { village: false }); c.cam([{ t: 0, p: [0, 90, 220], l: [0, 10, -80], f: 50 }, { t: tN, p: [0, 70, 170], l: [0, 10, -80], f: 50 }]); if (t > tS) title(c, 'O SAARA', tS, { bg: '#c8802a' }); thermo(c, 'SECO', { x: 1560, b: '#ffb02e' }); return; }
  c.env('void'); c.camSet([0, 1.5, 8], [0, 1.5, 0], 50);
  const k1 = ease.oo(prog(t, tN, tN + 1.0)), k2 = ease.oo(prog(t, tB - 0.2, tB + 0.8));
  c.ui(`<div class="abs" style="left:0;top:0;width:1920px;height:1080px;background:linear-gradient(#3a2210,#1a0e06)"></div>
    <div class="abs" style="left:260px;top:330px;font-weight:900;font-size:56px;color:#fff">SAARA · ~9 MILHÕES DE KM²</div><div class="abs" style="left:260px;top:410px;height:150px;width:${1400 * k1}px;border-radius:20px;background:linear-gradient(90deg,#ffd08a,#e2a050)"></div>
    <div class="abs" style="left:260px;top:620px;font-weight:900;font-size:56px;color:#fff;opacity:${k2}">BRASIL · ~8,5 MILHÕES DE KM²</div><div class="abs" style="left:260px;top:700px;height:150px;width:${1320 * k2}px;border-radius:20px;background:linear-gradient(90deg,#3ddc6a,#ffd21f)"></div>`);
  if (t > tB) big(c, 'MAIOR QUE O BRASIL', tB + 0.3, { y: 120, size: 110 });
};

SHOTS.b06 = (c) => {
  const t = c.t; const tV = c.at('o Saara era verde'), tP = c.at('As pinturas'); c.sfx('whoosh', 0.2, 0.5); c.sfx('twinkle', tV, 0.5); c.sfx('pop', tP, 0.5);
  if (t < tP) { const k = ease.io(prog(t, tV - 0.6, tV + 1.2)); D(c, { village: false, lush: k, panels: false });
    c.cam([{ t: 0, p: [-40, 18, 40], l: [-12, 1, 0], f: 48 }, { t: tP, p: [-32, 14, 30], l: [-12, 1, 0], f: 48 }]);
    c.chip(960, 90, '⏳ UNS 6.000 ANOS ATRÁS', 'gold', 0.3, tP); if (t > tV) c.chip(960, 200, '🦛 LAGOS · HIPOPÓTAMOS · 🐊 CROCODILOS', 'green', tV + 0.4, tP); return; }
  D(c, { village: false, panels: false }); c.cam([{ t: tP, p: [-26, 1.9, 22.5], l: [-26, 1.7, 18], f: 46 }, { t: c.dur, p: [-26, 1.8, 21.6], l: [-26, 1.7, 18], f: 46 }]);
  c.chip(960, 90, '🎨 ARTE NAS ROCHAS DO SAARA', 'gold', tP, 1e9);
};

SHOTS.b07 = (c) => {
  const t = c.t; const tO = c.at('Oásis Estrela'); c.sfx('engine', 0, 0.4); c.sfx('tada', tO, 0.5);
  if (t < tO - 0.4) { D(c, { trucks: { x: lerp(-60, -20, prog(t, 0, tO)), z: 22 } }); c.cam([{ t: 0, p: [-30, 6, 40], l: [-40, 1.5, 22], f: 46 }, { t: tO, p: [-20, 5, 38], l: [-30, 1.5, 22], f: 46 }]); c.chip(960, 90, '🚚 150 PESSOAS', 'gold', 0.3, tO); return; }
  D(c, { trucks: { x: -8, z: 22 } }); crowdAt(c, 40, 0, 16, { a: 'walk', ry: PI }); c.cam([{ t: tO - 0.4, p: [-14, 9, 34], l: [0, 2, -4], f: 48 }, { t: c.dur, p: [-12, 8, 30], l: [0, 2, -4], f: 48 }]);
  title(c, '⭐ OÁSIS ESTRELA', tO, { bg: '#c8802a' });
};

SHOTS.b08 = (c) => {
  const t = c.t; const tB = c.at('O Seu Bento'), tN = c.at('A doutora Nádia'), tP = c.at('E o Pipo'), tD = c.at('uma duna'); c.sfx('pop', 0.3, 0.5); c.sfx('pop', tB, 0.5); c.sfx('pop', tN, 0.5); c.sfx('pop', tP, 0.5); c.sfx('twinkle', tD, 0.5);
  if (t < tB) { D(c, {}); c.track('lara', [{ t: 0, p: [1.9, 0, -2.4], ry: 0.4, a: 'hold', e2: 'happy', hold: 'wrench' }]); c.frame('lara', { yaw: 0.3, d: 3.2, h: 1.1, f: 44, to: { d: 2.8 } }); tag(c, 'LARA', '💧 ENGENHEIRA DE ÁGUA', '#38d6ff'); }
  else if (t < tN) { D(c, {}); c.track('bento', [{ t: 0, p: [-4, 0, 14], ry: 0.3, a: 'point', e2: 'smirk' }]); c.frame('bento', { yaw: 0.35, d: 3.2, h: 1.2, f: 44, t0: tB, to: { d: 2.8 } }); tag(c, 'SEU BENTO', '🧭 ATRAVESSOU O DESERTO 20 VEZES', '#ffb02e'); }
  else if (t < tP) { D(c, {}); c.track('nadia', [{ t: 0, p: [10.5, 0, 6], ry: -0.3, a: 'idle', e2: 'happy', hold: 'bandage' }]); c.frame('nadia', { yaw: -0.3, d: 3.0, h: 1.2, f: 44, t0: tN, to: { d: 2.6 } }); tag(c, 'DRA. NÁDIA', '🩺 MÉDICA', '#3ddc6a'); }
  else { D(c, {}); const px = 20, pz = -60; c.track('pipo', [{ t: 0, p: [px, H(px, pz), pz], ry: PI - 0.3, a: t < tD ? 'lookup' : 'cheer', e2: 'happy' }]); c.frame('pipo', { yaw: 0.3, d: 2.6, h: 0.75, up: 0.6, f: 44, t0: tP, to: { d: 2.2 } }); tag(c, 'PIPO, 10', '🏜️ NUNCA TINHA VISTO UMA DUNA', '#ffd21f'); }
};

SHOTS.b09 = (c) => {
  const t = c.t; const tD = c.at('De dia'), tN = c.at('E de noite'), tZ = c.at('perto de zero'); c.sfx('ding', 0.3, 0.5); c.sfx('sizzle', tD, 0.4); c.sfx('wind', tN, 0.5);
  if (t < tN) { D(c, {}); c.track('bento', [{ t: 0, p: [2.2, 0, 1.2], ry: -PI / 2 + 0.3, a: t < tD ? 'point' : 'idle', e2: 'deadpan' }]); c.track('pipo', [{ t: 0, p: [0.6, 0, 1.6], ry: PI / 2 - 0.3, a: 'idle', e2: 'surprised' }]);
    c.cam([{ t: 0, p: [1.4, 1.5, 6.4], l: [1.4, 1.0, 1.3], f: 46 }, { t: tN, p: [1.4, 1.4, 5.4], l: [1.4, 1.0, 1.3], f: 46 }]);
    if (t > 0.3) c.ui(card('☝️ REGRA Nº 1: NADA DE SOL DO MEIO-DIA', { y: 70, b: '#ffd21f', s: pop(t, 0.3, 0.25) || 1 })); if (t > tD) thermo(c, '+40 °C', { y: 230, x: 1500 }); heat(c, 0.8); return; }
  D(c, { tod: 'night', power: 1 }); c.track('pipo', [{ t: 0, p: [0.6, 0, 1.6], ry: 0.3, a: 'tired', e2: 'worried', over: { hy: Math.sin(t * 30) * 0.05 } }]);
  c.frame('pipo', { yaw: 0.2, d: 2.6, h: 0.8, up: 0.3, f: 44, t0: tN, to: { d: 2.2 } });
  thermo(c, `${Math.round(lerp(15, 2, prog(t, tN, tZ + 0.5)))} °C`, { b: '#38d6ff', color: '#9fe0ff', x: 1500 });
};

// ================= VANTAGENS =================
const aquifer = (c, t0, k) => c.ui(`<div class="abs" style="left:1060px;top:300px;width:760px;height:600px;border-radius:26px;overflow:hidden;border:6px solid #fff;opacity:${k};transform:scale(${0.9 + 0.1 * k})">
  <div style="height:22%;background:#e2b877"></div><div style="height:30%;background:repeating-linear-gradient(0deg,#b8834a 0 18px,#a87440 18px 36px)"></div>
  <div style="height:36%;background:linear-gradient(#2a8ad6,#1a5aa8);display:flex;align-items:center;justify-content:center;color:#fff;font-weight:900;font-size:44px">💧 AQUÍFERO NÚBIO</div><div style="height:12%;background:#5a4a3a"></div>
  <div class="abs" style="left:360px;top:0;width:24px;height:${78 * k}%;background:#9aa0a8"></div></div>`);
SHOTS.b10 = (c) => {
  const t = c.t; const tE = c.at('Embaixo do Saara'), tA = c.at('Aquífero'), tC = c.at('cento e cinquenta mil'); c.sfx('twinkle', 0.3, 0.4); c.sfx('pop', tA, 0.5); c.sfx('tada', tC, 0.5);
  if (t < tE) { D(c, {}); c.track('lara', [{ t: 0, p: [-1.4, 0, -2.6], ry: 0.6, a: 'lookdown', e2: 'smirk' }]); c.cam([{ t: 0, p: [3.5, 2.4, 2.0], l: [-0.5, 0.5, -3.5], f: 46 }, { t: tE, p: [3.0, 2.3, 1.2], l: [-0.5, 0.5, -3.5], f: 46 }]); return; }
  D(c, {}); c.cam([{ t: tE, p: [-2.0, 3.4, 2.4], l: [1.6, 0.4, -4], f: 50 }, { t: c.dur, p: [-1.8, 3.2, 1.6], l: [1.6, 0.4, -4], f: 50 }]);
  aquifer(c, tE, ease.oo(prog(t, tE, tE + 0.6)));
  if (t > tC) big(c, '≈150.000 KM³ DE ÁGUA', tC, { x: 560, y: 160, size: 96, color: '#5ad8ff', glow: 'rgba(60,200,255,.6)' });
};

SHOTS.b11 = (c) => {
  const t = c.t; const tF = c.at('É água fóssil'), tO = c.at('O oásis tem'), tL = c.at('lá do fundo'); c.sfx('water', tO, 0.5); c.sfx('engine', tO, 0.25);
  if (t < tO) { D(c, { lush: 0.8, village: false, panels: false }); c.cam([{ t: 0, p: [-30, 6, 20], l: [-12, 0, 3], f: 48 }, { t: tO, p: [-27, 5, 16], l: [-12, 0, 3], f: 48 }]); c.chip(960, 90, '🌧️ CHUVA DE MILHARES DE ANOS ATRÁS', 'blue', tF, tO); return; }
  D(c, { tank: lerp(0.4, 0.9, prog(t, tO, c.dur)) }); c.track('lara', [{ t: 0, p: [2.6, 0, -2.4], ry: -0.6, a: 'idle', e2: 'happy' }]);
  c.cam([{ t: tO, p: [6, 2.4, 3], l: [2.5, 1.6, -5], f: 46 }, { t: c.dur, p: [5.5, 2.6, 1.8], l: [3, 2.6, -6], f: 46 }]);
  c.tag([0, 2.4, -4], 'O POÇO', 'gold', tO, 1e9); if (t > tL) c.tag([5, 5.9, -7.5], 'CAIXA D\'ÁGUA', 'blue', tL, 1e9);
};

SHOTS.b12 = (c) => {
  const t = c.t; const tM = c.at('No Marrocos'), tO = c.at('O oásis faz'), tP = c.at('painéis solares'); c.sfx('twinkle', 0.2, 0.4); c.sfx('pop', tM, 0.5); c.sfx('tada', tP, 0.5);
  if (t < tM) { D(c, {}); c.cam([{ t: 0, p: [4, 2.5, 17], l: [-20, 30, -100], f: 50 }, { t: tM, p: [4, 2.5, 15], l: [-30, 26, -100], f: 50 }]); c.ui(`<div class="abs" style="left:1500px;top:90px;font-size:160px">☀️</div>`); return; }
  if (t < tO) { D(c, { village: false }); c.cam([{ t: tM, p: [-60, 30, 30], l: [-27, 0, -14], f: 48 }, { t: tO, p: [-54, 26, 24], l: [-27, 0, -14], f: 48 }]); c.ui(card('🇲🇦 NOOR OUARZAZATE (MARROCOS)', { y: 70, size: 46 })); c.chip(960, 200, 'UMA DAS MAIORES USINAS SOLARES DO MUNDO', 'gold', tM + 0.5, tO); return; }
  D(c, {}); c.track('lara', [{ t: 0, p: [-17, 0, -9.5], ry: -1.0, a: 'point', e2: 'happy' }]); c.cam([{ t: tO, p: [-12.5, 2.4, -8.5], l: [-25, 0.8, -14], f: 46 }, { t: c.dur, p: [-13, 2.2, -9.5], l: [-25, 0.8, -14], f: 46 }]);
  if (t > tP) title(c, '☀️ PAINÉIS SOLARES', tP, { bg: '#2a6ad6' });
};

SHOTS.b13 = (c) => {
  const t = c.t; const tP = c.at('E o Pipo'), tE = c.at('escorregar'); c.sfx('pop', 0.3, 0.4); c.sfx('whoosh', tE, 0.6); c.sfx('laugh', tE + 0.6, 0.5);
  if (t < tP) { D(c, {}); c.track('nadia', [{ t: 0, p: [0, 0, 6.6], ry: PI, a: 'crouch', e2: 'happy' }]); c.cam([{ t: 0, p: [4, 2.4, 3], l: [0.5, 0.4, 9], f: 46 }, { t: tP, p: [3.6, 2.2, 3.8], l: [0.5, 0.4, 9], f: 46 }]); c.chip(960, 90, '🥬 HORTA NA SOMBRA DAS TAMAREIRAS', 'green', 0.3, tP); return; }
  D(c, {}); const u = ease.io(prog(t, tE - 0.4, c.dur - 0.2)); const x = lerp(14, 26, u), z = -56; const y = H(x, z);
  c.track('pipo', [{ t: 0, p: [x, y, z], ry: PI / 2, a: t < tE - 0.4 ? 'idle' : 'surf', e2: 'happy' }]);
  c.puffs([x - 0.5, y, z], t > tE ? 0.4 : 0, { color: 0xe2b877, rise: 0.8, spread: 1 });
  const cx = x + 1.0, cz = z + 4.2; c.camSet([cx, Math.max(H(cx, cz) + 1.6, y + 2.2), cz], [x, y + 0.6, z], 46);
};

SHOTS.b14 = (c) => {
  const t = c.t; const tL = c.at('E lá fora'), tM = c.at('milhares de estrelas'); c.sfx('pad', 0, 0.4); c.sfx('cheer', 0.4, 0.4); c.sfx('twinkle', tM, 0.5);
  if (t < tL) { D(c, { tod: 'night', power: 1 }); crowdAt(c, 26, 13.5, 6, { a: 'dance', sx: 1.4, sz: 0.7, sp: 0.45 }); c.track('pipo', [{ t: 0, p: [11, 0, 4.4], ry: -1.2, a: 'dance', e2: 'happy' }]);
    c.cam([{ t: 0, p: [4, 2.4, 9], l: [13, 1.4, 5.5], f: 48 }, { t: tL, p: [5, 2.2, 8], l: [13, 1.4, 5.5], f: 48 }]); c.chip(960, 90, '🎉 PRIMEIRO ANO', 'gold', 0.3, tL); return; }
  D(c, { tod: 'night', power: 1, stars: true }); c.track('pipo', [{ t: 0, p: [-2, 0, 12], ry: PI, a: 'lookup', e2: 'happy' }]); c.track('bento', [{ t: 0, p: [-0.8, 0, 12.3], ry: PI, a: 'point', e2: 'happy' }]);
  c.cam([{ t: tL, p: [-1.5, 1.0, 16], l: [-1.5, 14, -30], f: 60 }, { t: c.dur, p: [-1.5, 1.0, 15.5], l: [-1.5, 18, -30], f: 60 }]);
};

// ================= PREÇO =================
SHOTS.b15 = (c) => {
  const t = c.t; const tC = c.at('mais de cinquenta'), tA = c.at('Andar na areia'); c.sfx('sizzle', 0.3, 0.5); c.sfx('dramatic', tC, 0.5); c.sfx('ouch', tA + 1.2, 0.5);
  D(c, {});
  if (t < tA) { c.cam([{ t: 0, p: [10, 3, 22], l: [0, 18, -100], f: 50 }, { t: tA, p: [10, 3, 20], l: [0, 22, -100], f: 50 }]); thermo(c, `${Math.round(lerp(38, 51, prog(t, 0.3, tC + 0.5)))} °C`, { x: 1500 }); if (t > tC) big(c, '+50 °C', tC, { y: 300, color: '#ff5a3a', glow: 'rgba(255,60,30,.7)' }); heat(c, 1.2); return; }
  c.track('pipo', [{ t: 0, p: [7, 0, 17], ry: 0.4, a: t < tA + 1.1 ? 'walk' : 'panic', e2: t < tA + 1.1 ? 'neutral' : 'surprised' }]); c.frame('pipo', { yaw: 0.4, d: 2.6, h: 0.6, up: 0.3, f: 44, t0: tA, to: { d: 2.2 } });
  c.ui(card('🍳 COMO PISAR NUMA FRIGIDEIRA', { y: 70, b: '#ff3b30', s: pop(t, tA + 0.4, 0.25) || 1 })); heat(c, 1.2);
};

SHOTS.b16 = (c) => {
  const t = c.t; const tR = c.at('regra da água'), tP = c.at('Roupa clara'); c.sfx('ding', tR, 0.5); c.sfx('pop', tP, 0.5);
  D(c, {}); camp(c, 14, { seed: 8 });
  c.track('nadia', [{ t: 0, p: [8, 0, 14], ry: 0.3, a: t < tR ? 'talk' : 'hold', e2: 'happy', hold: 'bottle' }]); c.track('pipo', [{ t: 0, p: [9.2, 0, 14.4], ry: -PI / 2 - 0.6, a: 'eat', e2: 'happy', hold: 'bottle' }]);
  if (t < tP) c.frame([8.5, 0, 14.3], { yaw: 0.2, d: 5.2, h: 1.6, up: 0.1, f: 44, drop: 0.1, to: { d: 4.6 } }); else c.frame('nadia', { yaw: 0.1, d: 4.2, h: 1.5, f: 44, t0: tP, to: { d: 3.8 } });
  if (t > tR) c.ui(card('💧 REGRA DA ÁGUA: BEBER O DIA INTEIRO', { y: 70, b: '#38d6ff', s: pop(t, tR, 0.25) || 1 }));
  if (t > tP) ['👕 ROUPA CLARA E LARGA', '🧢 CABEÇA COBERTA'].forEach((s, i) => { const t0 = tP + 0.2 + i * 1.2; if (t > t0) c.chip(560 + i * 800, 220, s, 'gold', t0, 1e9); });
};

SHOTS.b17 = (c) => {
  const t = c.t; const tL = c.at('A Lara'), tB = c.at('bebê'); c.sfx('engine', 0, 0.3); c.sfx('aww', tB, 0.4);
  D(c, { tank: 0.9 });
  if (t < tL) { c.cam([{ t: 0, p: [5, 6, 8], l: [1, 0.5, -4], f: 48 }, { t: tL, p: [4.4, 5, 6], l: [1, 0.5, -4], f: 48 }]); c.tag([0, 2.4, -4], 'O POÇO', 'gold', 0.3, 1e9); ['🚰 BEBER', '🥬 HORTA', '🧺 TUDO'].forEach((s, i) => { const t0 = 1.0 + i * 0.7; if (t > t0) c.chip(560 + i * 400, 120, s, 'blue', t0, 1e9); }); return; }
  c.track('lara', [{ t: 0, p: [0.9, 0, -2.6], ry: 2.48, a: 'tinker', e2: 'happy', hold: 'wrench' }]); c.frame('lara', { yaw: -0.75, d: 3.2, h: 1.0, f: 44, t0: tL, to: { d: 2.8 } });
  if (t > tB) c.ui(`<div class="abs" style="left:1300px;top:160px;font-size:120px;transform:scale(${pop(t, tB, 0.3) || 1})">💙</div>`);
};

// ================= CTA =================
SHOTS.b18 = (c) => {
  const t = c.t; const tI = c.at('inscrever'); c.sfx('pop', 0.3, 0.5); c.sfx('click', tI + 1.1, 0.8); c.sfx('ding', tI + 1.15, 0.6);
  D(c, {});
  c.track('lara', [{ t: 0, p: [-1, 0, 8], ry: 0.15, a: t < tI ? 'wave' : 'point', e2: 'happy' }]); c.track('pipo', [{ t: 0, p: [0.4, 0, 8.4], ry: -0.1, a: 'cheer', e2: 'happy' }]);
  c.cam([{ t: 0, p: [0, 1.5, 13.2], l: [-0.2, 1.2, 8], f: 44 }, { t: c.dur, p: [0, 1.5, 12.4], l: [-0.2, 1.2, 8], f: 44 }]);
  subBtn(c, tI);
};

// ================= O PORÉM =================
SHOTS.b19 = (c) => {
  const t = c.t; const tO = c.at('O oásis tem'), tB = c.at('E o Seu Bento'), tT = c.at('a tempestade'); c.sfx('dramatic', 0.2, 0.7); c.sfx('wind', tB, 0.5);
  if (t < tO) { c.env('void'); c.camSet([0, 1.5, 8], [0, 1.5, 0], 50); c.ui(`<div class="abs" style="left:0;top:0;width:1920px;height:1080px;background:#0a0604"></div>`); title(c, 'TEM UM PORÉM', 0.2, { top: 420, size: 140 }); return; }
  if (t < tB) { D(c, {}); c.cam([{ t: tO, p: [4, 7, 8], l: [0, 0.5, -4], f: 48 }, { t: tB, p: [3.5, 6, 6], l: [0, 0.5, -4], f: 48 }]); c.ui(card('⚠️ 1 POÇO SÓ', { y: 70, b: '#ff3b30', size: 60, s: pop(t, tO + 0.3, 0.25) || 1 })); return; }
  D(c, { wall: 0.12 }); c.track('bento', [{ t: 0, p: [0, 0, 14], ry: PI, a: 'lookaround', e2: 'worried' }]); c.frame('bento', { yaw: PI * 0.65, d: 4.4, h: 1.5, up: 0.3, f: 44, t0: tB, to: { d: 3.9 } });
  if (t > tT) c.ui(card('🌪️ TEMPESTADE DE AREIA', { y: 70, b: '#ff3b30', s: pop(t, tT, 0.25) || 1 }));
};

SHOTS.b20 = (c) => {
  const t = c.t; const tM = c.at('Mas numa tarde'), tP = c.at('Os pássaros'), tE = c.at('E o Seu Bento'), tC = c.at('corre'); c.sfx('crickets', tM, 0.2); c.sfx('dramatic', tE, 0.6); c.sfx('alarm', tC, 0.5);
  if (t < tM) { D(c, {}); camp(c, 24, { walk: true }); c.cam([{ t: 0, p: [20, 10, 30], l: [0, 1, -2], f: 48 }, { t: tM, p: [16, 8, 24], l: [0, 1, -2], f: 48 }]); c.chip(960, 90, '☀️ 3 ANOS DE CÉU LIMPO', 'gold', 0.3, tM); return; }
  if (t < tE) { D(c, { tod: 'dusk', wall: 0.08 }); c.cam([{ t: tM, p: [-4, 1.8, 16], l: [-8, 8, -10], f: 50 }, { t: tE, p: [-4, 1.8, 15], l: [-8, 9, -10], f: 50 }]); if (t > tP) c.chip(960, 90, '🐦 OS PÁSSAROS SOMEM', 'red', tP, tE); return; }
  D(c, { tod: 'dusk', wall: lerp(0.18, 0.35, prog(t, tE, c.dur)) }); c.track('bento', [{ t: 0, p: [0, 0, 12], ry: t < tC ? PI : 0.2, a: t < tC ? 'lookaround' : 'shout', e2: t < tC ? 'worried' : 'scared' }]);
  if (t < tC) c.cam([{ t: tE, p: [1.2, 1.6, 15], l: [-1, 6, -40], f: 48 }, { t: tC, p: [1.2, 1.6, 14.5], l: [-1, 7, -40], f: 48 }]);
  else { c.frame('bento', { yaw: 0.1, d: 2.6, h: 1.3, f: 44, t0: tC, to: { d: 2.2 } }); c.bubble(c.CH.bento, 'CORRE!', tC, c.dur, [0, 2.3, 0]); }
};

// ================= CLÍMAX =================
SHOTS.b21 = (c) => {
  const t = c.t; const tA = c.at('A areia entra'), tE = c.at('e entope'), tP = c.at('Ela para'); c.sfx('wind', 0, 1); c.sfx('crash', 0.4, 0.4); c.sfx('blackout', tP, 0.8);
  if (t < tA) { D(c, { wall: lerp(0.6, 1, prog(t, 0, tA)), storm: lerp(0.2, 0.9, prog(t, 0, tA)), tod: 'dusk' }); crowdAt(c, 24, 10, 6, { a: 'run', ry: -PI / 2, sp: 0.6 });
    c.cam([{ t: 0, p: [-8, 3, 14], l: [4, 2, -10], f: 50 }, { t: tA, p: [-6, 2.6, 12], l: [4, 2, -10], f: 50 }]); c.shake(0.12); title(c, 'AGORA, ACONTECEU', 0.4, { size: 80 }); dusty(c, 0.8); return; }
  if (t < tE) { D(c, { storm: 1, dust: prog(t, tA, tE + 0.3), tod: 'dusk' }); c.cam([{ t: tA, p: [-20, 3, -3], l: [-27, 1, -14], f: 46 }, { t: tE, p: [-21, 2.6, -5], l: [-27, 1, -14], f: 46 }]); c.shake(0.1); c.chip(960, 90, '🟫 AREIA NOS PAINÉIS', 'red', tA + 0.3, tE); dusty(c, 1); return; }
  D(c, { storm: 1, dust: 1, clog: lerp(0.5, 1, prog(t, tE, tP)), tod: 'dusk' }); c.cam([{ t: tE, p: [4.4, 1.5, 0.5], l: [1.9, 0.6, -4], f: 46 }, { t: c.dur, p: [4.0, 1.4, -0.3], l: [1.9, 0.6, -4], f: 46 }]); c.shake(0.12);
  if (t > tP) title(c, 'A BOMBA PAROU', tP, { size: 92 }); dusty(c, 1);
};

SHOTS.b22 = (c) => {
  const t = c.t; const tD = c.at('dois dias'), tL = c.at('A Lara e o Seu Bento'), tM = c.at('Mas a areia'); c.sfx('heartbeat', 0, 0.5); c.sfx('wind', 0, 0.7); c.sfx('rustle', tL + 1, 0.5);
  if (t < tL) { D(c, { storm: 0.6, tank: 0.22, clog: 1, dust: 1, tod: 'dusk' }); c.cam([{ t: 0, p: [10, 3, -1], l: TANK, f: 44 }, { t: tL, p: [9, 3.4, -2], l: TANK, f: 44 }]); if (t > tD) big(c, '💧 ÁGUA PRA 2 DIAS', tD, { y: 160, size: 110, color: '#ff6b4a', glow: 'rgba(255,80,40,.6)' }); dusty(c, 0.7); return; }
  D(c, { storm: 0.6, tank: 0.2, clog: lerp(1, 0.75, Math.abs(Math.sin((t - tL) * 0.8))), dust: 1, tod: 'dusk' });
  c.track('lara', [{ t: 0, p: [1.2, 0, -2.6], ry: PI - 0.4, a: 'tinker', e2: 'angry' }]); c.track('bento', [{ t: 0, p: [2.8, 0, -2.6], ry: PI + 0.4, a: 'tinker', e2: 'tired' }]);
  c.puffs([1.9, 0.6, -3.2], 0.5, { color: 0xd8ac6a, rise: 1.2, spread: 1.5 });
  c.cam([{ t: tL, p: [2.0, 1.9, 1.6], l: [2.0, 0.6, -3.4], f: 48 }, { t: c.dur, p: [2.0, 1.8, 0.9], l: [2.0, 0.6, -3.4], f: 48 }]); c.shake(0.06);
  if (t > tM) c.chip(960, 90, '🔁 A AREIA VOLTA', 'red', tM, 1e9); dusty(c, 0.7);
};

SHOTS.b23 = (c) => {
  const t = c.t; const tP = c.at('o Pipo repara'), tM = c.at('molhados'), tO = c.at('É o orvalho'); c.sfx('crickets', 0, 0.3); c.sfx('twinkle', tM, 0.6);
  if (t < tP) { D(c, { tod: 'dawn', dust: 0.3, clog: 0.8, tank: 0.12, wet: 1 }); c.cam([{ t: 0, p: [-20, 6, 20], l: [-10, 1, -8], f: 48 }, { t: tP, p: [-18, 5.5, 18], l: [-10, 1, -8], f: 48 }]); c.chip(960, 90, '🌅 DIA SEGUINTE', 'gold', 0.3, tP); return; }
  D(c, { tod: 'dawn', dust: 0.3, wet: 1 }); c.track('pipo', [{ t: 0, p: [-19, 0, -6], ry: -2.3, a: t < tM ? 'idle' : 'point', e2: t < tM ? 'neutral' : 'surprised' }]);
  if (t < tO) c.cam([{ t: tP, p: [-15.6, 1.4, -4.6], l: [-20, 1.0, -7.5], f: 44 }, { t: tO, p: [-16.1, 1.35, -5.0], l: [-20, 1.0, -7.5], f: 44 }]);
  else { c.cam([{ t: tO, p: [-23.5, 2.1, -8.3], l: [-25, 1.2, -10], f: 40 }, { t: c.dur, p: [-23.8, 1.95, -8.7], l: [-25, 1.2, -10], f: 38 }]); c.chip(960, 90, '💧 ORVALHO DA NOITE FRIA', 'blue', tO, 1e9); }
};

SHOTS.b24 = (c) => {
  const t = c.t; const tA = c.at('A doutora Nádia'), tC = c.at('coletor de orvalho'), tG = c.at('Cada gota'); c.sfx('pop', 0.3, 0.5); c.sfx('rustle', tA + 1, 0.5); c.sfx('water', tG, 0.5);
  if (t < tA) { c.env('void'); c.camSet([0, 1.5, 8], [0, 1.5, 0], 50); c.ui(`<div class="abs" style="left:0;top:0;width:1920px;height:1080px;background:linear-gradient(#c9b8a0,#8a7a64)"></div>
    <div class="abs" style="left:260px;top:240px;width:1400px;height:520px;border-radius:30px;background:repeating-linear-gradient(0deg,rgba(30,40,50,.6) 0 3px,transparent 3px 40px),repeating-linear-gradient(90deg,rgba(30,40,50,.6) 0 3px,transparent 3px 40px),linear-gradient(#e8eef2,#b8c4cc);border:10px solid #6b4a2a"></div>`);
    c.ui(card('🇨🇱 ATACAMA, CHILE: ÁGUA TIRADA DA NEBLINA', { y: 80, size: 46 })); return; }
  const k = ease.io(prog(t, tA + 0.5, tC + 0.5)); D(c, { tod: 'dawn', nets: k, wet: 1, dust: 0.3 });
  c.track('nadia', [{ t: 0, p: [-9.5, 0, 11], ry: PI + 0.3, a: t < tG ? 'point' : 'cheer', e2: 'happy' }]); c.track('pipo', [{ t: 0, p: [-11, 0, 10.2], ry: PI, a: 'carry', e2: 'happy', hold: 'can' }]);
  c.cam([{ t: tA, p: [-9.5, 2.2, 17], l: [-9.5, 1.3, 9], f: 50 }, { t: c.dur, p: [-9.5, 2.0, 15.5], l: [-9.5, 1.3, 9], f: 50 }]);
  if (t > tC) title(c, '💧 COLETOR DE ORVALHO', tC, { bg: '#2a6ad6', size: 80 }); if (t > tG) c.chip(960, 230, 'CADA GOTA → UM BALDE', 'blue', tG, 1e9);
};

SHOTS.b25 = (c) => {
  const t = c.t; const tN = c.at('No terceiro dia'), t1 = c.at('Primeira tentativa'), t2 = c.at('Segunda'); c.sfx('clang', tN + 1.2, 0.5); c.sfx('crank', t1 + 0.6, 0.6); c.sfx('error', t1 + 1.3, 0.5); c.sfx('crank', t2 + 0.4, 0.6); c.sfx('error', t2 + 1.0, 0.5);
  if (t < tN) { D(c, { tod: 'day', nets: 1, wet: 0.4, tank: 0.1, clog: 0.4 }); crowdAt(c, 10, -9.5, 11, { a: 'idle', ry: PI }); c.cam([{ t: 0, p: [-2, 2.4, 18], l: [-9.5, 0.6, 9.2], f: 44 }, { t: tN, p: [-3, 2.2, 16.5], l: [-9.5, 0.6, 9.2], f: 44 }]); c.chip(960, 90, '⏳ COMPRA TEMPO', 'gold', 0.3, tN); return; }
  D(c, { tod: 'day', tank: 0.08, clog: 0.15 });
  c.track('lara', [{ t: 0, p: [0.9, 0, -2.6], ry: 2.48, a: t < t1 ? 'tinker' : 'crank', e2: t > t2 + 1 ? 'angry' : 'worried', hold: 'wrench' }]);
  c.frame('lara', { yaw: -0.75, d: 3.4, h: 1.0, f: 44, t0: tN, to: { d: 3.0 } });
  if (t > t1 + 1.3) c.chip(620, 140, 'TENTATIVA 1 ❌', 'red', t1 + 1.3, 1e9); if (t > t2 + 1.0) c.chip(1300, 140, 'TENTATIVA 2 ❌', 'red', t2 + 1.0, 1e9);
};

SHOTS.b26 = (c) => {
  const t = c.t; const tJ = c.at('jorra'), tC = c.at('Cento e cinquenta'); c.sfx('crank', 0.3, 0.6); c.sfx('engine', 1.2, 0.5); c.sfx('splash', tJ, 0.8); c.sfx('cheer', tJ + 0.2, 0.7);
  const j = ease.oo(prog(t, tJ - 0.1, tJ + 0.4));
  if (t < tC) { D(c, { tod: 'day', jet: j, tank: 0.1 + j * 0.5 }); c.track('lara', [{ t: 0, p: [0.9, 0, -2.6], ry: 2.48, a: t < tJ ? 'crank' : 'cheer', e2: t < tJ ? 'worried' : 'happy', hold: t < tJ ? 'wrench' : null }]);
    c.cam([{ t: 0, p: [6, 2.2, 4], l: [0.5, 1.6, -4], f: 46 }, { t: tC, p: [5.4, 2.4, 3], l: [0.5, 2.4, -4], f: 46 }]); if (t > tJ) title(c, '💦 A ÁGUA JORRA!', tJ, { bg: '#2a8ad6' }); return; }
  D(c, { tod: 'day', jet: 1, tank: 0.7 }); crowdAt(c, 40, 0, -4, { a: 'dance', r0: 1.8, sp: 0.5, sx: 1.2, sz: 1.0 }); c.track('pipo', [{ t: 0, p: [-0.6, 0, -1.6], ry: 0.3, a: 'dance', e2: 'happy' }]);
  c.cam([{ t: tC, p: [-6, 3.5, 7], l: [0, 1.6, -4], f: 50 }, { t: c.dur, p: [-5, 3.2, 5.5], l: [0, 1.8, -4], f: 50 }]);
};

SHOTS.b27 = (c) => {
  const t = c.t; const tD = c.at('dois poços'), tM = c.at('muralha de árvores'), tG = c.at('Igual à Grande'); c.sfx('tada', tD, 0.5); c.sfx('pop', tM, 0.5); c.sfx('whoosh', tG, 0.5);
  const k = ease.io(prog(t, tM - 0.5, tG));
  if (t < tG) { D(c, { well2: true, trees: k, tank: 0.9 }); c.cam([{ t: 0, p: [20, 18, 30], l: [0, 1, -10], f: 48 }, { t: tG, p: [14, 22, 26], l: [0, 1, -14], f: 48 }]); c.tag([9, 2.5, 3], '2º POÇO', 'green', tD, 1e9); if (t > tM) c.chip(960, 90, '🌳 MURALHA DE ÁRVORES', 'green', tM, 1e9); return; }
  D(c, { well2: true, trees: 1, village: false, panels: false }); c.cam([{ t: tG, p: [0, 26, 30], l: [0, 2, -40], f: 54 }, { t: c.dur, p: [0, 22, 20], l: [0, 2, -40], f: 54 }]);
  c.ui(card('🌍 GRANDE MURALHA VERDE (ÁFRICA)', { y: 70, b: '#3ddc6a' })); if (t > tG + 2.5) big(c, '≈ 8.000 KM', tG + 2.5, { y: 260, color: '#5aff8a', glow: 'rgba(60,255,120,.6)' });
};

// ================= FINAL =================
SHOTS.b28 = (c) => {
  const t = c.t; const tU = c.at('Um dia'), tP = c.at('a chuva'), tV = c.at('Dá pra voltar'); c.sfx('pad', 0, 0.4); c.sfx('radio', tU, 0.5); c.sfx('tada', tV, 0.5);
  if (t < tU) { D(c, { more: true, well2: true, trees: 1, lush: 0.35, tank: 0.9 }); camp(c, 30, { walk: true, kids: true, seed: 9 }); c.cam([{ t: 0, p: [-30, 20, 34], l: [6, 1, -10], f: 48 }, { t: tU, p: [-24, 16, 28], l: [6, 1, -10], f: 48 }]); c.chip(960, 90, '⏩ OS ANOS PASSAM', 'gold', 0.3, tU); return; }
  D(c, { more: true, well2: true, trees: 1, lush: 0.35 }); c.track('bento', [{ t: 0, p: [8.2, 0, 12.2], ry: -0.4, a: 'phone', e2: t < tP ? 'neutral' : 'surprised', hold: 'phone' }]); c.track('lara', [{ t: 0, p: [6.9, 0, 12.8], ry: 1.2, a: t < tV ? 'idle' : 'cheer', e2: 'happy' }]);
  c.cam([{ t: tU, p: [8.0, 1.8, 17.4], l: [7.5, 1.1, 12.4], f: 44 }, { t: c.dur, p: [8.0, 1.75, 16.6], l: [7.5, 1.1, 12.4], f: 44 }]);
  if (t > tP) c.ui(card('📻 "A CHUVA PAROU"', { y: 70, b: '#38d6ff', s: pop(t, tP, 0.25) || 1 }));
};

SHOTS.b29 = (c) => {
  const t = c.t; const tF = c.at('Mas muita gente'), tP = c.at('E o Pipo'), tE = c.at('E toda noite'); c.sfx('pad', 0, 0.4); c.sfx('twinkle', tE, 0.5);
  if (t < tP) { D(c, { more: true, well2: true, trees: 1, lush: 0.35, trucks: { x: lerp(10, 40, prog(t, 0, tP)), z: 22 } }); camp(c, 26, { seed: 4, ry: PI }); c.cam([{ t: 0, p: [-14, 6, 26], l: [4, 1, 10], f: 48 }, { t: tP, p: [-12, 5, 23], l: [4, 1, 10], f: 48 }]); if (t > tF) title(c, 'MUITA GENTE FICA', tF, { bg: '#c8802a' }); return; }
  if (t < tE) { D(c, { more: true, well2: true, trees: 1, lush: 0.35, jet: 0 }); c.track('pipov', [{ t: 0, p: [0.9, 0, -2.6], ry: 2.48, a: 'tinker', e2: 'happy', hold: 'wrench' }]); c.frame('pipov', { yaw: -0.75, d: 3.2, h: 1.2, f: 44, t0: tP, to: { d: 2.8 } }); tag(c, 'PIPO, 30', '💧 CUIDA DOS POÇOS', '#ffd21f'); return; }
  D(c, { tod: 'night', stars: true, power: 1, more: true, well2: true, trees: 1, lush: 0.35 }); c.track('pipov', [{ t: 0, p: [-2, 0, 12], ry: PI, a: 'pointup', e2: 'happy' }]);
  c.cam([{ t: tE, p: [-2.6, 1.2, 15.5], l: [-2, 12, -30], f: 60 }, { t: c.dur, p: [-2.6, 1.2, 15], l: [-2, 16, -30], f: 60 }]);
};

SHOTS.b30 = (c) => {
  const t = c.t; const tR = c.at('Recomeçou porque'), tG = c.at('cada gota conta'); c.sfx('pad', 0, 0.5); c.sfx('wind', 0, 0.15);
  D(c, { tod: 'night', stars: true, power: 1, more: true, well2: true, trees: 1, lush: 0.35 });
  crowdAt(c, 60, 0, 19, { a: 'idle', ry: PI, sx: 1.6, sz: 0.6, r0: 1.2, sp: 0.6 });
  c.cam([{ t: 0, p: [0, 2.2, 31], l: [0, 6, -20], f: 54 }, { t: c.dur, p: [0, 2.0, 29], l: [0, 7, -20], f: 54 }]);
  if (t > tR) c.chip(960, 120, 'APRENDERAM QUE', 'white', tR, 1e9); if (t > tG) big(c, '💧 CADA GOTA CONTA', tG, { y: 250, size: 110, color: '#5ad8ff', glow: 'rgba(60,200,255,.6)' });
  c.state.fade = prog(t, c.dur - 0.5, c.dur);
};

SHOTS.b31 = (c) => {
  const t = c.t; const tQ = c.at('Aguentaria'), tM = c.at('na Lua'), tS = c.at('Se inscreve'), tB = c.at('Até lá'); c.sfx('whoosh', tM, 0.5); c.sfx('click', tS + 1.1, 0.8); c.sfx('ding', tS + 1.15, 0.6); c.sfx('tada', tB, 0.6);
  c.env('outro');
  const w = t > tB;
  [['lara', -3.0, 0.3], ['nadia', -1.0, 0.1], ['bento', 1.0, -0.1], ['pipo', 3.0, -0.3]].forEach(([n, x, ry]) => c.track(n, [{ t: 0, p: [x, 0, 5.1], ry, a: w ? 'wave' : 'idle', e2: 'happy' }]));
  c.cam([{ t: 0, p: [0, 1.9, 12.4], l: [0, 2.0, 5], f: 42 }, { t: c.dur, p: [0, 2.0, 11.4], l: [0, 2.0, 5], f: 42 }]);
  if (t > tQ && t < tM - 1.5) { const a = clamp((t - tQ) / 0.4); c.ui(`<div class="abs" style="left:0;top:130px;width:1920px;text-align:center;font-weight:900;font-size:60px;color:#fff;opacity:${a};text-shadow:0 5px 0 #000">VIVER ONDE QUASE NUNCA CHOVE?</div>`);
    ['AGUENTO 💪', 'NEM PENSAR 🥵'].forEach((l, i) => { const s = pop(t, tQ + 0.5 + i * 0.3, 0.25); c.ui(`<div class="abs" style="left:${500 + i * 480}px;top:240px;width:440px;padding:20px 0;text-align:center;border-radius:24px;background:${['#ffb02e', '#ff6b4a'][i]};color:#111;font-weight:900;font-size:50px;white-space:nowrap;transform:scale(${s})">${l}</div>`); }); }
  if (t > tM - 1.4 && t < tS - 0.1) { c.ui(`<div class="abs" style="left:0;top:120px;width:1920px;text-align:center;font-weight:900;font-size:60px;color:#fff;text-shadow:0 5px 0 #000">PRÓXIMO EPISÓDIO</div>`); c.ui(bigNum('NA LUA? 🌕', 960, 270, { size: 130, color: '#ffd21f', glow: 'rgba(255,210,31,.6)', s: pop(t, tM - 1.4, 0.3) || 1 })); }
  if (t > tS) subBtn(c, tS);
};
