// SHORT: "Ela pagava dois cafés, mas só tomava um" — Roblox, 1080x1920.
import { clamp, lerp, prog, ease, PI } from '/engine/kit.js';
export const SHOTS = {};
export const CAST = {
  lurdes: { shirt: 0x9b6bc4, pants: 0x4a3b5c, skin: 'light', hair: 'bun', hairColor: 0xe8e8e8, glasses: true, female: true, sleeves: 'long' },
  lucas: { shirt: 0xffffff, pants: 0x2b2d42, skin: 'brown', hair: 'short', hairColor: 0x1a1008, hat: 'cap', hatColor: 0x2a8f5a, vest: 0x2a8f5a },
  homem: { shirt: 0x6c6f75, pants: 0x3b3328, skin: 'tan', hair: 'curly', hairColor: 0x2a1a0e, beard: 0x2a1a0e, sleeves: 'long' },
  jovem: { shirt: 0x9b6bc4, pants: 0x4a3b5c, skin: 'light', hair: 'long', hairColor: 0x3a2412, female: true },
  avo: { shirt: 0xffffff, pants: 0x2b2d42, skin: 'brown', hair: 'short', hairColor: 0x1a1008, hat: 'chef', beard: 0x1a1008 },
};
// Padaria: balcão em z=-1.4 (tampo y≈1.13), x −5.5..2.5; porta em z=5 (vão x −1.6..1.6).
const CZ = -1.4, TOP = 1.13;
const LUC = [0.6, 0, -2.3];        // atendente atrás do balcão, olhando +z
const LUR = [0.3, 0, -0.42];       // Dona Lurdes na frente do balcão, olhando −z
const HOM = [1.4, 0, -0.42];
const cup = (c, x, steam = true) => { c.prop('cup', { p: [x, TOP + 0.13, CZ + 0.25], s: 2.2 }); }; 
// planos padrão: W = plano aberto 3/4 do balcão; os closes usam h 1.75
const W = (c, o = {}) => c.frame([0.7, 0, -1.3], { yaw: 0.75, d: 5.4, h: 1.55, up: 0.45, f: 46, drop: 0.2, ...o });
const big = (c, txt, cls, t0, t1, y = 300) => { const t = c.t; if (t < t0 || t > t1) return; const k = ease.oo(prog(t, t0, t0 + 0.25)); c.ui(`<div class="chip ${cls}" style="left:540px;top:${y}px;font-size:58px;padding:14px 34px;border-radius:18px;opacity:${k};transform:translate(-50%,-50%) scale(${0.8 + 0.2 * k})">${txt}</div>`); };
const sepia = (c, label) => c.ui(`<div class="abs" style="left:0;top:0;right:0;bottom:0;backdrop-filter:sepia(0.85) contrast(1.05) brightness(0.95);box-shadow:inset 0 0 0 40px #f3ead8, inset 0 0 160px 80px rgba(60,35,10,.45)"></div>` +
  (label ? `<div class="abs" style="left:0;right:0;top:130px;text-align:center;font-size:62px;font-weight:900;color:#fff;text-shadow:0 5px 0 #000">${label}</div>` : ''));
const lucas = (c, o = {}) => c.track('lucas', [{ t: 0, p: LUC, ry: 0, a: 'idle', e2: 'neutral', ...o }]);

SHOTS.s01 = (c) => {
  const t = c.t; c.env('bakery'); c.sfx('door', 0.1, 0.5); c.sfx('footsteps', 0.3, 0.4); const tD = c.at('dois cafés');
  const tA = Math.min(tD - 0.3, c.dur * 0.55);
  c.track('lurdes', [{ t: 0, p: [0.3, 0, 3.6], ry: PI, a: 'walk', e2: 'happy', hold: 'money' }, { t: tA, p: LUR, ry: PI, a: 'idle', e2: 'happy', hold: 'money' }]);
  lucas(c, { e2: 'happy', a: t > tA ? 'wave' : 'idle' });
  if (t < tA) c.frame([0.3, 0, 2.2], { yaw: 1.1, d: 4.6, h: 1.6, up: 0.3, f: 50, drop: 0.2 });
  else { W(c, { t0: tA, to: { d: 4.8 } }); cup(c, 0.1); cup(c, 0.55); }
  big(c, '2 CAFÉS', 'gold', tD, c.dur);
};

SHOTS.s02 = (c) => {
  const t = c.t; c.env('bakery'); c.sfx('pop', 0.15, 0.4); const tU = c.at('um');
  c.track('lurdes', [{ t: 0, p: LUR, ry: PI, a: 'eat', e2: 'happy', hold: 'cup' }]);
  lucas(c, { e2: 'neutral' });
  cup(c, 0.95);
  c.frame('lurdes', { yaw: -0.9, d: 3.4, h: 1.6, up: 0.25, f: 46, to: { d: 3.0 } });
  c.tag([0.95, TOP + 0.45, CZ + 0.25], 'NINGUÉM TOMA', 'red', tU, c.dur);
};

SHOTS.s03 = (c) => {
  const t = c.t; c.env('bakery'); const tT = c.at('devolver'); c.sfx('click', tT, 0.4);
  c.track('lurdes', [{ t: 0, p: LUR, ry: PI, a: 'idle', e2: 'neutral' }]);
  lucas(c, { a: t < tT ? 'think' : 'hold', e2: t < tT ? 'worried' : 'neutral', hold: t < tT ? undefined : 'money' });
  cup(c, 0.95);
  c.frame('lucas', { yaw: -0.6, d: 3.3, h: 1.75, up: 0.2, f: 46, to: { d: 3.0 } });
  big(c, 'ELA ESTÁ CONFUSA?', 'blue', 0.3, c.dur);
};

SHOTS.s04 = (c) => {
  const t = c.t; c.env('bakery'); c.sfx('twinkle', 0.2, 0.4); const tO = c.at('o outro');
  c.track('lurdes', [{ t: 0, p: LUR, ry: PI, a: t < tO + 0.6 ? 'idle' : 'point', e2: 'happy' }]);
  lucas(c, { p: [-0.7, 0, -2.3], ry: 0.3, e2: 'surprised', hold: 'money' });
  cup(c, 0.95);
  c.frame('lurdes', { yaw: -0.5, d: 3.2, h: 1.75, up: 0.2, f: 46, to: { d: 2.9 } });
  big(c, 'É PRA QUEM NÃO PODE PAGAR', 'green', c.at('sem dinheiro') - 0.2, c.dur);
};

SHOTS.s05 = (c) => {
  const t = c.t; c.env('bakery'); c.sfx('door', 0.05, 0.5); const tP = c.at('pediu'); const tA = Math.min(tP, c.dur * 0.55);
  c.track('homem', [{ t: 0, p: [1.4, 0, 3.6], ry: PI, a: 'walk', e2: 'tired' }, { t: tA, p: HOM, ry: PI, a: 'idle', e2: 'sad' }]);
  c.track('lurdes', [{ t: 0, p: LUR, ry: PI + 0.6, a: 'idle', e2: 'neutral' }]);
  lucas(c, { ry: 0.3, e2: 'neutral' });
  cup(c, 0.95);
  if (t < tA) c.frame([1.4, 0, 2.2], { yaw: 1.1, d: 4.6, h: 1.6, up: 0.3, f: 50, drop: 0.2 });
  else { c.frame('homem', { yaw: -0.5, d: 3.2, h: 1.75, up: 0.2, f: 46, t0: tA, to: { d: 2.9 } }); big(c, 'SÓ UM COPO D\'ÁGUA…', 'blue', tP, c.dur); }
};

SHOTS.s06 = (c) => {
  const t = c.t; c.env('bakery'); const tC = c.at('quase chorou'); c.sfx('pop', 0.3, 0.4); c.sfx('aww', tC, 0.45);
  const tS = Math.min(1.0, c.dur * 0.3);
  c.track('homem', [{ t: 0, p: HOM, ry: PI, a: t < tS ? 'idle' : 'hold', e2: t < tC ? 'surprised' : 'cry', hold: t < tS ? undefined : 'cup' }]);
  c.track('lurdes', [{ t: 0, p: LUR, ry: PI + 0.6, a: 'idle', e2: 'happy' }]);
  lucas(c, { p: [1.3, 0, -2.3], a: t < tS ? 'hold' : 'idle', hold: t < tS ? 'cup' : undefined, e2: 'happy' });
  if (t < tC) W(c, { yaw: 0.9 });
  else c.frame('homem', { yaw: -0.5, d: 3.0, h: 1.75, up: 0.15, f: 44, t0: tC, to: { d: 2.7 } });
};

// lembrança: 50 anos atrás, o avô (padeiro) paga o café da jovem Lurdes
SHOTS.s07 = (c) => {
  const t = c.t; c.env('bakery'); const tF = c.at('há cinquenta'); const tN = c.at('não tinha nada'); const tP = c.at('pagou');
  if (t < tF) {
    c.track('lurdes', [{ t: 0, p: LUR, ry: PI + 0.6, a: 'talk', e2: 'happy' }]);
    lucas(c, { p: [-0.7, 0, -2.3], ry: 0.3, e2: 'neutral' });
    c.frame('lurdes', { yaw: -0.5, d: 3.2, h: 1.75, up: 0.2, f: 46 });
    return;
  }
  c.sfx('swoosh', tF, 0.5);
  c.track('jovem', [{ t: 0, p: LUR, ry: PI, a: t < tP + 0.4 ? 'idle' : 'hold', e2: t < tP + 0.4 ? 'sad' : 'happy', hold: t < tP + 0.4 ? undefined : 'cup' }]);
  c.track('avo', [{ t: 0, p: LUC, ry: 0, a: t < tP + 0.4 ? 'hold' : 'idle', e2: 'happy', hold: t < tP + 0.4 ? 'cup' : undefined }]);
  W(c, { t0: tF, to: { d: 4.6 } });
  sepia(c, '50 ANOS ATRÁS');
  big(c, 'SEM UM CENTAVO', 'red', tN - 0.1, c.dur, 290);
};

SHOTS.s08 = (c) => {
  const t = c.t; c.env('bakery'); const tA = c.at('avô'); c.sfx('dramatic', tA - 0.2, 0.55);
  c.track('lurdes', [{ t: 0, p: LUR, ry: PI, a: 'idle', e2: 'happy' }]);
  lucas(c, { p: [-0.2, 0, -2.3], ry: 0.3, a: 'idle', e2: t < tA ? 'neutral' : 'surprised' });
  cup(c, 0.95, false);
  if (t < tA) c.frame('lurdes', { yaw: -0.5, d: 3.2, h: 1.75, up: 0.2, f: 46 });
  else c.frame('lucas', { yaw: -0.6, d: 3.1, h: 1.75, up: 0.15, f: 44, t0: tA, to: { d: 2.7 } });
  big(c, 'ERA O AVÔ DELE!', 'gold', tA, c.dur);
};

SHOTS.s09 = (c) => {
  const t = c.t; c.env('bakery'); c.sfx('pad', 0, 0.4); c.sfx('twinkle', 0.3, 0.5); const tP = c.at('café pago');
  c.track('lurdes', [{ t: 0, p: [1.2, 0, -0.42], ry: 0.6, a: 'idle', e2: 'happy' }]);
  c.track('homem', [{ t: 0, p: [2.9, 0, 0.2], ry: 0.2, a: 'eat', e2: 'happy', hold: 'cup' }]);
  lucas(c, { p: [0.65, 0, -2.3], a: 'wave', e2: 'happy' });
  // plaquinha sobre o balcão
  W(c, { to: { d: 4.9 } });
  if (t > tP - 0.2) { const k = ease.oo(prog(t, tP - 0.2, tP + 0.2)); c.ui(`<div class="abs" style="left:150px;right:150px;top:150px;padding:36px 24px;background:#fff7e6;border:10px solid #2a8f5a;border-radius:26px;text-align:center;font-size:84px;line-height:1.05;font-weight:900;color:#2a8f5a;box-shadow:0 18px 40px rgba(0,0,0,.4);opacity:${k};transform:rotate(-2deg) scale(${0.8 + 0.2 * k})">☕ CAFÉ PAGO<br><span style="font-size:60px;color:#7a4a2b">É SÓ PEDIR</span></div>`); }
  c.state.fade = prog(t, c.dur - 0.35, c.dur);
};
