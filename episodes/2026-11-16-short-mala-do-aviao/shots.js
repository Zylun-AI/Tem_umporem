// SHORT: "Ela não largava a mala no avião" — Roblox, 1080x1920.
import { clamp, lerp, prog, ease, PI } from '/engine/kit.js';
export const SHOTS = {};
export const CAST = {
  mulher: { shirt: 0xe86aa6, pants: 0x30344a, skin: 'tan', hair: 'long', hairColor: 0x3a2412, female: true },
  aeromoca: { shirt: 0x1d2b53, pants: 0x1d2b53, skin: 'light', hair: 'bun', hairColor: 0xb8862b, female: true, tie: 0xc0392b, sleeves: 'long' },
  vizinho: { shirt: 0x6aa84f, pants: 0x4a3b2a, skin: 'brown', hair: 'short', hairColor: 0x111111, glasses: 'round', face: 'chill' },
  comandante: { shirt: 0xf4f4f4, pants: 0x15233f, skin: 'white', hair: 'short', hairColor: 0x6b6b6b, hat: 'pilot', tie: 0x15233f, beard: 0x8a8a8a, belt: true },
};
const SEAT_Y = 0.36;                      // raiz de quem está sentado (Roblox) p/ o quadril ficar no assento
const ROW = (r) => 6 - r * 1.4;           // z da fileira r (frente = -z)
const SEATX = [-2.0, -1.15, 1.15, 2.0];
// passageiros de fundo sentados; pula o lugar do elenco e a frente dele (para a câmera)
function passengers(c, o = {}) {
  let k = 0; const skip = new Set(['3,2', '3,3', '4,2', '4,3']);
  for (let r = 0; r < 13; r++) for (let s = 0; s < 4; s++) { if (skip.has(r + ',' + s) || (r * 7 + s * 3) % 5 === 0) continue; if (k >= 38) return;
    c.mini(k, { p: [SEATX[s], SEAT_Y, ROW(r)], ry: PI, a: o.a || 'sit', e: o.e || 'neutral', ph: 0 }); k++; }
}
const MULHER = [1.15, SEAT_Y, ROW(3)], VIZ = [2.0, SEAT_Y, ROW(3)];
const sitM = (c, e2, extra = {}) => c.track('mulher', [{ t: 0, p: MULHER, ry: PI, a: 'sit', e2, ...extra }]);
const sitV = (c, e2, extra = {}) => c.track('vizinho', [{ t: 0, p: VIZ, ry: PI, a: 'sit', e2, ...extra }]);
// mala no colo; k = tremida
const malaColo = (c, k = 0) => c.prop('suitcase', { p: [1.15 + Math.sin(c.t * 31) * 0.03 * k, 1.22 + Math.abs(Math.sin(c.t * 23)) * 0.04 * k, ROW(3) - 0.45], r: [0, PI, Math.sin(c.t * 27) * 0.08 * k], s: 1.5 });

SHOTS.s01 = (c) => {
  const t = c.t; c.env('plane'); passengers(c); c.sfx('whoosh', 0, 0.4); c.sfx('engine', 0, 0.25);
  const tR = c.at('recusou'); const tS = Math.max(0.6, tR - 0.3);
  if (t < tS) { c.track('mulher', [{ t: 0, p: [0, 0, 7.5], ry: PI, a: 'carry', e2: 'worried', hold: 'suitcase' }, { t: tS, p: [0, 0, ROW(3) - 0.2], ry: PI, a: 'carry', e2: 'worried', hold: 'suitcase' }]);
    const P = c.pos('mulher'); c.camSet([0.35, 1.95, ROW(3) - 3.4], [P.x, 1.35, P.z], 46); }
  else { sitM(c, 'angry', { hold: null }); malaColo(c); c.track('aeromoca', [{ t: 0, p: [-0.2, 0, ROW(3) - 1.7], ry: PI / 2 + 0.95, a: 'point', e2: 'surprised', hold: null }]);
    c.cam([{ t: 0, p: [0.3, 1.85, ROW(3) - 4.6], l: [-0.2, 1.45, ROW(3) - 1.7], f: 42 }, { t: c.dur, p: [0.3, 1.8, ROW(3) - 4.0], l: [-0.2, 1.45, ROW(3) - 1.7], f: 42 }]); }
};

SHOTS.s02 = (c) => {
  const t = c.t; c.env('plane'); passengers(c); const tN = c.at('mas ela'); sitV(c, 'neutral', { face: 0 }); malaColo(c);
  c.track('aeromoca', [{ t: 0, p: [-0.2, 0, ROW(3) - 1.7], ry: PI / 2 + 0.95, a: t < tN ? 'talk' : 'idle', e2: t < tN ? 'happy' : 'surprised' }]);
  if (t < tN) { sitM(c, 'worried'); c.cam([{ t: 0, p: [0.3, 1.85, ROW(3) - 4.6], l: [-0.2, 1.45, ROW(3) - 1.7], f: 42 }, { t: c.dur, p: [0.3, 1.8, ROW(3) - 4.0], l: [-0.2, 1.45, ROW(3) - 1.7], f: 42 }]); }
  else { c.track('mulher', [{ t: 0, p: MULHER, ry: PI, a: 'sit', e2: 'angry', over: { hy: Math.sin(t * 9) * 0.35 } }]); c.frame('mulher', { yaw: 0.75, d: 2.29, h: 1.35, up: 0.6, f: 50, t0: tN, to: { d: 1.89 } }); }
};

SHOTS.s03 = (c) => {
  const t = c.t; c.env('plane', { shake: 0.4 }); passengers(c); const tM = c.at('se mexer'); sitV(c, 'neutral'); sitM(c, t > tM ? 'scared' : 'tired');
  const k = t > tM ? 1 : 0; malaColo(c, k); c.sfx('rustle', tM, 0.8);
  if (t < tM) c.frame('mulher', { yaw: 0.75, d: 2.43, h: 1.35, up: 0.3, f: 52 });
  else { c.frame([1.15, 1.3, ROW(3) - 0.45], { yaw: PI + 0.85, d: 1.9, h: 0, up: 0.5, f: 46, drop: 0, t0: tM, to: { d: 1.6 } }); c.shake(0.5); }
};

SHOTS.s04 = (c) => {
  const t = c.t; c.env('plane'); passengers(c); const tC = c.at('chamou'); sitM(c, 'scared'); malaColo(c, 1);
  c.track('vizinho', [{ t: 0, p: VIZ, ry: PI, a: 'sit', e2: 'scared', gx: -1 }, { t: tC, p: VIZ, ry: PI, a: 'sit', e2: 'scared', over: { rsx: 2.8, rel: 0.2, rsz: 0.2 } }]);
  c.frame('vizinho', { d: 2.29, h: 1.4, up: 0.75, yaw: 0.35, f: 50, to: { d: 1.89 } });
  c.sfx('ding', tC + 0.2, 0.8);
};

SHOTS.s05 = (c) => {
  const t = c.t; c.env('plane', { cockpitOpen: 1 }); passengers(c, { e: 'surprised' }); c.sfx('door', 0.1, 0.5);
  const tA = c.at('abrir'); sitM(c, 'scared'); sitV(c, 'worried'); malaColo(c, 0.5);
  c.track('comandante', [{ t: 0, p: [0, 0, -10.5], ry: 0, a: 'walk', e2: 'angry' }, { t: Math.max(0.6, tA), p: [0, 0, ROW(3) - 1.3], ry: 0, a: 'walk', e2: 'angry' }, { t: tA + 0.01, p: [0, 0, ROW(3) - 1.3], ry: PI / 2 + 0.7, a: 'point', e2: 'angry' }]);
  if (t < tA) c.frame('comandante', { d: 4.59, h: 1.5, up: 0.1, f: 48, yaw: PI * 0 }); else c.frame('comandante', { d: 2.70, h: 1.55, yaw: -0.4, f: 48, t0: tA, to: { d: 2.29 } });
};

SHOTS.s06 = (c) => {
  const t = c.t; c.env('plane'); passengers(c, { e: 'surprised' }); c.sfx('zip', c.at('abriu'), 0.8);
  c.track('mulher', [{ t: 0, p: MULHER, ry: PI, a: 'sit', e2: 'cry' }]); sitV(c, 'worried'); malaColo(c);
  c.frame('mulher', { yaw: 0.75, d: 2.16, h: 1.35, up: 0.2, f: 46, to: { d: 1.69 } });
};

SHOTS.s07 = (c) => {
  const t = c.t; c.env('plane'); passengers(c, { e: 'surprised' }); const tD = c.at('cachorrinho'); c.sfx('pop', tD, 0.9); c.sfx('aww', tD + 0.2, 0.7);
  sitM(c, t > tD ? 'happy' : 'cry'); sitV(c, 'surprised'); malaColo(c);
  const up = ease.oo(prog(t, tD - 0.1, tD + 0.4)); c.prop('dog', { p: [1.15, 1.5 + up * 0.35, ROW(3) - 0.75], r: [0, PI + 1.0 + Math.sin(t * 2) * 0.15, 0], s: 1.7 });
  if (t < tD) c.frame('mulher', { yaw: 0.75, d: 2.03, h: 1.35, up: 0.2, f: 46 }); else c.frame([1.15, 1.75, ROW(3) - 0.75], { yaw: PI + 1.25, d: 2.3, h: 0, up: 0.25, f: 44, drop: 0.15, t0: tD, to: { d: 2.0 } });
  if (t > tD) c.ui(`<div class="abs" style="left:0;right:0;top:300px;text-align:center;font-size:130px;font-weight:900;color:#fff;text-shadow:0 6px 0 #000;transform:scale(${1 + 0.4 * Math.max(0, 1 - (t - tD) / 0.3)})">16 ANOS</div>`);
};

SHOTS.s08 = (c) => {
  const t = c.t; c.env('ocean', { ship: false, pier: true }); c.sfx('waves', 0, 0.5);
  c.track('mulher', [{ t: 0, p: [0, 0.48, 6], ry: PI + 0.3, a: 'idle', e2: 'sad', over: { rsx: 1.3, rel: 1.4, lsx: 1.3, lel: 1.4 } }]);
  c.prop('dog', { p: [0.05, 1.93, 5.65], r: [0, PI + 0.3, 0], s: 1.6 });
  c.frame('mulher', { yaw: 0.75, d: 4.32, h: 1.4, f: 50, to: { d: 3.51, yaw: 0.7 } });
};

SHOTS.s09 = (c) => {
  const t = c.t; c.env('plane'); const tB = c.at('bem-vindo'); passengers(c, { a: t > tB ? 'clap' : 'sit', e: 'happy' }); c.sfx('ding', 0.1, 0.6); c.sfx('cheer', tB + 0.3, 0.6);
  sitM(c, 'cry'); sitV(c, 'happy'); c.prop('dog', { p: [1.15, 1.3, ROW(3) - 0.5], r: [0, PI, 0], s: 1.7 });
  c.track('comandante', [{ t: 0, p: [0, 0, ROW(3) - 1.6], ry: 0, a: 'talk', e2: 'happy', hold: 'mic' }]);
  if (t < tB) c.frame('comandante', { d: 2.97, h: 1.55, f: 46 });
  else c.cam([{ t: tB, p: [0, 2.6, -6.5], l: [0.4, 1.3, 3], f: 58 }, { t: c.dur, p: [0, 2.8, -7.5], l: [0.4, 1.3, 3], f: 58 }]);
  c.state.fade = prog(t, c.dur - 0.35, c.dur);
};
