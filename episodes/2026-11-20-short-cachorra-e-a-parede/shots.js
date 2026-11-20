// SHORT: "A cachorra latia toda noite pra mesma parede" — Roblox, 1080x1920.
import { clamp, lerp, prog, ease, PI } from '/engine/kit.js';
export const SHOTS = {};
export const CAST = {
  pai: { shirt: 0x3d5a80, pants: 0x9aa7b8, skin: 'tan', hair: 'short', hairColor: 0x2a1a0e, beard: 0x2a1a0e, sleeves: 'long' },
  mae: { shirt: 0xd9667a, pants: 0x30344a, skin: 'light', hair: 'long', hairColor: 0x6b3a1a, female: true },
  filha: { shirt: 0xf1c40f, pants: 0x3a86ff, skin: 'tan', hair: 'pony', hairColor: 0x2a1a0e, female: true, scale: 0.66 },
};
// Sala da casa: parede da direita em x=7.9; buraco (env house {hole}) em z=-2.5, pé da parede.
const HZ = -2.5;
const MEL_S = 2.4, PUP_S = 1.05;
// Mel (prop 'dog' grande). ry=PI/2 olha para a parede (+x). pitch>0 abaixa o focinho.
const mel = (c, x, z, ry, pitch = 0, hop = 0) => { const d = c.prop('dog', { p: [x, 0.28 * MEL_S + hop, z], s: MEL_S }); d.rotation.order = 'YXZ'; d.rotation.set(pitch, ry, 0); return d; };
const pup = (c, x, z, ry, pitch = 0) => { const d = c.prop('dog', { p: [x, 0.28 * PUP_S, z], s: PUP_S }); d.rotation.order = 'YXZ'; d.rotation.set(pitch, ry, 0); return d; };
const barkMel = (c, x, z, t) => { const b = Math.abs(Math.sin(t * 9)); return mel(c, x, z, PI / 2, -0.25 * b, 0.05 * b); };
const AU = (c, v, t0, t1) => { const t = c.t; if (t < t0 || t > t1) return; const s = c.proj(v); const k = 0.9 + 0.1 * Math.abs(Math.sin(t * 9)); c.ui(`<div class="bubble" style="left:${s.x}px;top:${s.y}px;font-size:56px;transform:translate(-50%,-100%) scale(${k})">AU! AU!</div>`); };
const big = (c, txt, cls, t0, t1, y = 330) => { const t = c.t; if (t < t0 || t > t1) return; const k = ease.oo(prog(t, t0, t0 + 0.25)); c.ui(`<div class="chip ${cls}" style="left:540px;top:${y}px;font-size:58px;padding:14px 34px;border-radius:18px;opacity:${k};transform:translate(-50%,-50%) scale(${0.8 + 0.2 * k})">${txt}</div>`); };
const NIGHT = (c, extra = {}) => c.env('house', { night: true, ...extra });

SHOTS.s01 = (c) => {
  const t = c.t; NIGHT(c); c.sfx('crickets', 0, 0.4); const tM = c.at('latia');
  barkMel(c, 6.5, HZ, t);
  if (t < tM) c.frame([6.8, 0, HZ], { yaw: -0.95, d: 5.6, h: 0.9, up: 0.4, f: 48, drop: 0, to: { d: 4.6 } });
  else { c.frame([7.1, 0, HZ], { yaw: -0.35, d: 3.2, h: 0.8, up: 0.3, f: 48, drop: 0, t0: tM, to: { d: 2.8 } }); AU(c, [7.3, 1.25, HZ], tM, c.dur); c.sfx('knock', tM, 0.25); }
  big(c, '3:00 DA MANHÃ', 'blue', 0.2, c.dur, 300);
};

SHOTS.s02 = (c) => {
  const t = c.t; NIGHT(c); c.sfx('dramatic', 0.1, 0.5);
  c.track('mae', [{ t: 0, p: [-0.6, 0.56, 2.15], ry: PI, a: 'sit', e2: 'scared', hold: 'light' }]);
  c.track('filha', [{ t: 0, p: [0.35, 0.56, 2.15], ry: PI, a: 'sit', e2: 'scared', over: { hy: Math.sin(t * 6) * 0.25 } }]);
  c.torch([-0.6, 1.6, 1.6], [6, 0.5, HZ], 10);
  c.frame([-0.1, 0.56, 2.15], { yaw: PI - 0.25, d: 4.4, h: 0.95, up: 0.3, f: 48, drop: 0.2, to: { d: 3.8 } });
  big(c, 'ASSOMBRADA?', 'red', c.at('assombrada') - 0.1, c.dur, 300);
};

SHOTS.s03 = (c) => {
  const t = c.t; c.env('house'); c.sfx('pop', 0.2, 0.4); const tS = c.at('sumia'), tM = c.at('magrinha');
  // pote de ração na cozinha
  const BX = -5.6, BZ = 1.4; c.prop('cup', { p: [BX, 0.12, BZ], s: 3 });
  if (t < tS) for (let i = 0; i < 5; i++) c.prop('bean', { p: [BX + (i % 3 - 1) * 0.07, 0.2, BZ + (i > 2 ? 0.05 : -0.04)], r: [0.3 * i, i, 0], s: 0.45 });
  mel(c, -4.9, 0.55, -0.64);
  if (t < tM) {
    c.track('mae', [{ t: 0, p: [-5.6, 0, 2.5], ry: PI, a: t < tS ? 'idle' : 'shrug', e2: t < tS ? 'neutral' : 'surprised' }]);
    c.frame([-5.5, 0, 1.6], { yaw: PI + 0.35, d: 3.4, h: 1.0, up: 0.5, f: 50, drop: 0.2 });
  } else c.frame([-4.9, 0, 0.55], { yaw: -0.9, d: 3.4, h: 0.35, up: 0.5, f: 46, drop: 0, t0: tM, to: { d: 3.0 } });
  big(c, 'A RAÇÃO SUMIA', 'gold', tS, c.dur, 300);
};

SHOTS.s04 = (c) => {
  const t = c.t; NIGHT(c); c.sfx('footsteps', 0, 0.5);
  c.track('pai', [{ t: 0, p: [3.4, 0, 4.8], ry: 2.91, a: 'walk', e2: 'worried', hold: 'light' }, { t: c.dur, p: [4.4, 0, 0.6], ry: 2.91, a: 'walk', e2: 'worried', hold: 'light' }]);
  const P = c.pos('pai'); c.torch([P.x, 1.4, P.z], [6.6, 0.4, HZ], 10);
  mel(c, 6.5, HZ, PI / 2, 0.15);
  c.frame('pai', { yaw: 0.6, d: 4.4, h: 1.65, up: 0.3, f: 48, to: { d: 3.8, yaw: 0.35 } });
};

SHOTS.s05 = (c) => {
  const t = c.t; NIGHT(c, { hole: 0.05 }); c.sfx('rustle', 0.3, 0.6); const tB = c.at('buraquinho');
  const push = Math.sin(t * 5) * 0.5 + 0.5;
  mel(c, 6.6 + push * 0.12, HZ, PI / 2, 0.55);
  c.torch([5.0, 1.4, -0.5], [7.6, 0.2, HZ], 9);
  // grão de ração indo para o buraco
  const u = (t * 0.8) % 1; c.prop('bean', { p: [lerp(7.55, 7.92, u), 0.04, HZ], r: [0, t * 3, 0], s: 0.45 });
  if (t < tB) c.frame([7.2, 0, HZ], { yaw: -0.5, d: 3.2, h: 0.6, up: 0.4, f: 46, drop: 0 });
  else { c.frame([7.65, 0, HZ], { yaw: -0.3, d: 1.9, h: 0.25, up: 0.3, f: 46, drop: 0, t0: tB, to: { d: 1.6 } }); c.tag([7.88, 0.4, HZ], 'BURAQUINHO', 'gold', tB + 0.1, c.dur); }
};

// câmera do lado −z da sala, olhando para o buraco e para o pai de frente
SHOTS.s06 = (c) => {
  const t = c.t; const tA = c.at('abriu'); const h = lerp(0.05, 1, ease.oo(prog(t, tA, tA + 0.8)));
  NIGHT(c, { hole: h });
  c.track('pai', [{ t: 0, p: [7.25, 0, HZ + 0.95], ry: PI - 0.3, a: t < tA ? 'hold' : 'tinker', e2: 'angry', hold: 'wrench' }]);
  mel(c, 5.9, HZ + 1.8, PI / 2, 0, 0);
  c.torch([5.8, 1.8, -4.5], [7.6, 0.6, HZ + 0.4], 9);
  if (t > tA) { c.sfx('crash', tA, 0.6); c.shake(0.3 * clamp(1 - (t - tA) / 0.6)); c.puffs([7.7, 0.5, HZ], clamp(1 - (t - tA) / 1.2), { color: 0xd8cfc0, rise: 0.8, op: 0.6, speed: 1.2 }); }
  c.frame([7.4, 0, HZ + 0.5], { yaw: PI + 0.5, d: 3.8, h: 1.0, up: 0.4, f: 48, drop: 0.2, to: { d: 3.3 } });
};

SHOTS.s07 = (c) => {
  const t = c.t; NIGHT(c, { hole: 1 }); const tV = c.at('vivo'); c.sfx('dramatic', 0, 0.5);
  pup(c, 7.6, HZ, -PI / 2, t < tV ? 0.35 : -0.1);
  c.torch([5.6, 1.5, -1.2], [7.8, 0.3, HZ], 9);
  if (t < tV) c.frame([7.55, 0, HZ], { yaw: -1.57, d: 2.4, h: 0.45, up: 0.3, f: 46, drop: 0, to: { d: 1.8 } });
  else { c.track('pai', [{ t: 0, p: [6.2, 0, HZ - 1.1], ry: 0.8, a: 'kneel', e2: 'surprised' }]); c.frame([7.05, 0, HZ - 0.4], { yaw: 0.15, d: 3.1, h: 0.8, up: 0.3, f: 46, drop: 0.2, t0: tV, to: { d: 2.8 } }); c.sfx('aww', tV, 0.5); }
  big(c, 'UM FILHOTE!', 'gold', 0.6, c.dur, 300);
};

SHOTS.s08 = (c) => {
  const t = c.t; NIGHT(c, { hole: 1 }); const tM = c.at('e a Mel');
  pup(c, 7.35, HZ, -PI / 2 + 0.3, 0);
  mel(c, 6.4, HZ + 0.9, 2.2, 0.35 + Math.sin(t * 6) * 0.1);
  c.track('pai', [{ t: 0, p: [5.8, 0, HZ - 1.4], ry: 0.3, a: 'kneel', e2: t < tM ? 'sad' : 'cry' }]);
  c.torch([4.6, 1.8, -1.5], [7.0, 0.3, HZ], 9);
  if (t < tM) c.frame([7.3, 0, HZ], { yaw: -1.57, d: 2.2, h: 0.5, up: 0.3, f: 46, drop: 0, to: { d: 2.0 }, t1: tM });
  else { c.frame([6.9, 0, HZ + 0.3], { yaw: -1.3, d: 4.6, h: 0.9, up: 0.8, f: 46, drop: 0.15, t0: tM, to: { d: 3.6 } }); c.sfx('twinkle', tM, 0.4); }
  big(c, 'ELA DIVIDIA A COMIDA', 'green', tM + 0.2, c.dur, 300);
};

SHOTS.s09 = (c) => {
  const t = c.t; c.env('house'); c.sfx('pad', 0, 0.4); c.sfx('twinkle', 0.3, 0.5); const tT = c.at('mesmo tapete');
  // os dois deitados no tapete, entre a mesinha e o sofá
  mel(c, 1.5, 1.3, PI / 2, 0.08 + Math.sin(t * 2) * 0.02);
  pup(c, 1.6, 0.55, -PI / 2 + 0.3, 0.1);
  c.track('mae', [{ t: 0, p: [-0.7, 0.56, 2.15], ry: PI, a: 'sit', e2: 'happy' }]);
  c.track('filha', [{ t: 0, p: [0.2, 0.56, 2.15], ry: PI, a: 'sit', e2: 'happy' }]);
  c.track('pai', [{ t: 0, p: [1.1, 0.56, 2.15], ry: PI, a: 'sit', e2: 'happy' }]);
  c.frame([1.0, 0, 1.2], { yaw: PI - 0.05, d: 4.6, h: 0.9, up: 0.7, f: 50, drop: 0, to: { d: 4.1 } });
  if (t > tT) { const k = ease.oo(prog(t, tT, tT + 0.35)); c.ui(`<div class="abs" style="left:60px;right:60px;top:110px;text-align:center;font-size:92px;line-height:1.05;font-weight:900;color:#ffd21f;-webkit-text-stroke:7px #000;paint-order:stroke fill;opacity:${k};transform:scale(${0.8 + 0.2 * k})">ELA SALVOU<br>O FILHOTE</div>`); }
  c.state.fade = prog(t, c.dur - 0.35, c.dur);
};
