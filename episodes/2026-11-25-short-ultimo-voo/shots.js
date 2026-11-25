// SHORT: "O piloto parou tudo pra falar da comissária" — Roblox, 1080x1920.
import { clamp, lerp, prog, ease, PI, stamp } from '/engine/kit.js';
export const SHOTS = {};
export const CAST = {
  vera: { shirt: 0x1d2b53, pants: 0x1d2b53, skin: 'light', hair: 'bun', hairColor: 0xd6d6d6, female: true, tie: 0xc0392b, sleeves: 'long', glasses: true },
  veraJ: { shirt: 0x1d2b53, pants: 0x1d2b53, skin: 'light', hair: 'bun', hairColor: 0x6b3a1a, female: true, tie: 0xc0392b, sleeves: 'long' },
  piloto: { shirt: 0xf4f4f4, pants: 0x15233f, skin: 'brown', hair: 'short', hairColor: 0x111111, hat: 'pilot', tie: 0x15233f, belt: true, logo: '✈', logoColor: '#e0a800' },
  menino: { shirt: 0xf2c94c, pants: 0x2f5fa8, skin: 'brown', hair: 'curly', hairColor: 0x111111, scale: 0.56 },
};
const SEAT_Y = 0.36, KID_Y = 0.43;
const ROW = (r) => 6 - r * 1.4;
const SEATX = [-2.0, -1.15, 1.15, 2.0];
function passengers(c, o = {}) {
  let k = 0; const skip = new Set(o.skip || ['3,2', '3,3', '2,2', '2,3']);
  for (let r = 0; r < 13; r++) for (let s = 0; s < 4; s++) { if (skip.has(r + ',' + s) || (r * 7 + s * 3) % 5 === 0) continue; if (k >= 38) return;
    c.mini(k, { p: [SEATX[s], SEAT_Y, ROW(r)], ry: PI, a: o.a || 'sit', e: o.e || 'neutral', ph: o.a === 'clap' ? null : 0 }); k++; }
}
const big = (c, txt, cls, t0, t1, y = 300) => { const t = c.t; if (t < t0 || t > t1) return; const k = ease.oo(prog(t, t0, t0 + 0.25)); c.ui(`<div class="chip ${cls}" style="left:540px;top:${y}px;font-size:58px;padding:14px 34px;border-radius:18px;opacity:${k};transform:translate(-50%,-50%) scale(${0.8 + 0.2 * k})">${txt}</div>`); };
const sepia = (c, label) => c.ui(`<div class="abs" style="left:0;top:0;right:0;bottom:0;backdrop-filter:sepia(0.85) contrast(1.05) brightness(0.95);box-shadow:inset 0 0 0 40px #f3ead8, inset 0 0 160px 80px rgba(60,35,10,.45)"></div>` +
  (label ? `<div class="abs" style="left:0;right:0;top:130px;text-align:center;font-size:62px;font-weight:900;color:#fff;text-shadow:0 5px 0 #000">${label}</div>` : ''));
// broche de asinhas (SVG dourado)
const WINGS = (w) => `<svg width="${w}" height="${w * 0.42}" viewBox="0 0 200 84"><defs><linearGradient id="gw" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffe680"/><stop offset="1" stop-color="#c88a00"/></linearGradient></defs>
  <g fill="url(#gw)" stroke="#7a5200" stroke-width="3"><path d="M100 30 C70 10 40 8 4 14 C30 22 50 30 62 40 C40 38 24 40 12 46 C40 50 60 54 78 56 Z"/><path d="M100 30 C130 10 160 8 196 14 C170 22 150 30 138 40 C160 38 176 40 188 46 C160 50 140 54 122 56 Z"/>
  <circle cx="100" cy="44" r="20"/></g><text x="100" y="52" font-size="22" font-weight="900" text-anchor="middle" fill="#7a5200">✈</text></svg>`;
const pin = (c, t0, y = 1250, w = 560) => { const t = c.t; if (t < t0) return; const k = ease.oo(prog(t, t0, t0 + 0.3)); const s = 1 + 0.35 * Math.max(0, 1 - (t - t0) / 0.3);
  c.ui(`<div class="abs" style="left:0;right:0;top:${y}px;text-align:center;opacity:${k};transform:scale(${s}) rotate(${Math.sin(t * 2) * 2}deg);filter:drop-shadow(0 10px 14px rgba(0,0,0,.5))">${WINGS(w)}</div>`); };

const KID = [1.15, KID_Y, ROW(3)];
const AISLE_V = [0.1, 0, ROW(3) - 1.5];

SHOTS.s01 = (c) => {
  const t = c.t; c.env('plane'); passengers(c); c.sfx('engine', 0, 0.22); c.sfx('whoosh', 0, 0.3);
  c.track('vera', [{ t: 0, p: [0, 0, 3.5], ry: PI, a: 'walk', e2: 'happy', hold: 'cup' }, { t: c.dur, p: [0, 0, 0.6], ry: PI, a: 'walk', e2: 'happy', hold: 'cup' }]);
  c.frame('vera', { d: 3.3, h: 1.5, up: 0.3, f: 46, to: { d: 2.9 } });
  big(c, 'ÚLTIMO VOO', 'gold', c.at('último voo') - 0.1, c.dur);
};

SHOTS.s02 = (c) => {
  const t = c.t; c.env('sky', { plane: { x: 0, y: 0, z: 0, ry: PI / 2, rz: Math.sin(t * 0.8) * 0.03 }, cloudSpeed: 40 }); c.sfx('wind', 0, 0.4);
  c.cam([{ t: 0, p: [-14, 6, 34], l: [0, 1, 0], f: 52 }, { t: c.dur, p: [-6, 5, 30], l: [0, 1, 0], f: 52 }]);
  const tN = c.at('trinta'); if (t > tN) { const k = ease.oo(prog(t, tN, tN + 0.25)); c.ui(stamp('35 ANOS', { top: 360, size: 120, s: 1.4 - 0.4 * k, a: k })); }
};

SHOTS.s03 = (c) => {
  const t = c.t; c.env('plane'); const tM = c.at('microfone'); c.sfx('click', tM, 0.6);
  const Z = ROW(13) + 0.4 - 1.8;   // assento da cabine do piloto
  c.track('piloto', [{ t: 0, p: [-1.0, SEAT_Y, Z], ry: PI, a: 'sit', e2: 'neutral', hold: t > tM ? 'mic' : null }]);
  c.cam([{ t: 0, p: [0.2, 1.95, Z - 1.75], l: [-1.0, 1.45, Z], f: 58 }, { t: c.dur, p: [0.1, 1.9, Z - 1.6], l: [-1.0, 1.45, Z], f: 55 }]);
};

SHOTS.s04 = (c) => {
  const t = c.t; c.env('plane', { shake: 0.5 }); passengers(c, { e: 'neutral' }); c.sfx('swoosh', 0, 0.5); c.sfx('heartbeat', 0.8, 0.4);
  const tS = c.at('sozinho');
  c.track('menino', [{ t: 0, p: KID, ry: PI, a: 'sit', e2: t < tS ? 'worried' : 'scared', over: t > tS ? { hy: Math.sin(t * 7) * 0.25 } : {} }]);
  c.frame('menino', { yaw: 0.7, d: 1.9, h: 0.85, up: 0.35, f: 48, to: { d: 1.6 } });
  sepia(c, '25 ANOS ATRÁS');
  big(c, '7 ANOS', 'blue', c.at('sete anos') - 0.1, c.dur, 1330);
};

SHOTS.s05 = (c) => {
  const t = c.t; c.env('plane'); passengers(c); const tM = c.at('mão');
  c.track('menino', [{ t: 0, p: KID, ry: PI, a: 'sit', e2: t < tM ? 'scared' : 'worried', over: { lsx: t > tM ? 0.7 : 0, lsz: t > tM ? 0.5 : 0 } }]);
  c.track('veraJ', [{ t: 0, p: [0.2, 0, ROW(3) + 0.35], ry: PI - 0.3, a: 'kneel', e2: 'happy', over: { rsx: 1.1, rsz: 0.2 } }]);
  c.cam([{ t: 0, p: [-0.6, 1.95, -0.4], l: [0.85, 0.95, 1.95], f: 50 }, { t: c.dur, p: [-0.55, 1.9, -0.1], l: [0.85, 0.95, 1.95], f: 50 }]);
  sepia(c, '25 ANOS ATRÁS');
};

SHOTS.s06 = (c) => {
  const t = c.t; c.env('plane'); passengers(c); const tA = c.at('asinhas'); c.sfx('twinkle', tA, 0.6);
  c.track('menino', [{ t: 0, p: KID, ry: PI, a: 'sit', e2: t < tA ? 'surprised' : 'happy' }]);
  c.track('veraJ', [{ t: 0, p: [0.2, 0, ROW(3) + 0.35], ry: PI - 0.3, a: 'kneel', e2: 'happy', over: { rsx: 1.3, rsz: 0.1 } }]);
  c.cam([{ t: 0, p: [-0.6, 1.95, -0.4], l: [0.85, 0.95, 1.95], f: 50 }, { t: c.dur, p: [-0.55, 1.9, -0.1], l: [0.85, 0.95, 1.95], f: 50 }]);
  sepia(c, '25 ANOS ATRÁS'); pin(c, tA - 0.15);
};

SHOTS.s07 = (c) => {
  const t = c.t; c.env('plane'); passengers(c); const tU = c.at('um dia');
  c.track('menino', [{ t: 0, p: KID, ry: PI, a: 'sit', e2: 'happy' }]);
  c.track('veraJ', [{ t: 0, p: [0.3, 0, ROW(3) + 0.45], ry: PI - 0.5, a: 'kneel', e2: 'happy', over: { rsx: 2.6, rel: 0.2 } }]);
  c.cam([{ t: 0, p: [0.0, 1.95, -0.5], l: [0.45, 1.05, 2.1], f: 46 }, { t: c.dur, p: [0.0, 1.9, -0.2], l: [0.45, 1.05, 2.1], f: 46 }]);
  c.bubble(c.CH.veraJ, 'Um dia, é você que vai levar a gente.', tU - 0.1, c.dur, [0, 2.1, 0]);
  sepia(c, '25 ANOS ATRÁS');
};

SHOTS.s08 = (c) => {
  const t = c.t; const tA = c.at('abriu'); const tB = c.at('mesmo broche'); c.env('plane', { cockpitOpen: ease.io(prog(t, tA - 0.2, tA + 0.5)) }); passengers(c, { e: 'surprised' }); c.sfx('door', tA - 0.2, 0.6);
  const DZ = ROW(13) + 0.4;
  c.track('piloto', [{ t: 0, p: [0, 0, DZ - 0.4], ry: 0, a: 'idle', e2: 'happy', hold: 'mic' }, { t: tA + 0.3, p: [0, 0, DZ - 0.4], ry: 0, a: 'walk', e2: 'happy', hold: 'mic' }, { t: tB - 0.3, p: [0, 0, DZ + 2.2], ry: 0, a: 'walk', e2: 'happy', hold: 'mic' }, { t: tB - 0.29, p: [0, 0, DZ + 2.2], ry: 0, a: 'idle', e2: 'smirk', hold: 'mic' }]);
  if (t < tB - 0.3) c.cam([{ t: 0, p: [0, 1.8, -6.0], l: [0, 1.4, DZ], f: 48 }, { t: tB, p: [0, 1.8, -6.6], l: [0, 1.4, DZ], f: 48 }]);
  else { c.frame('piloto', { d: 3.2, h: 1.8, up: 0.2, f: 46, t0: tB - 0.3, to: { d: 2.9 } }); c.sfx('twinkle', tB, 0.6); pin(c, tB, 1250, 380); }
};

SHOTS.s09 = (c) => {
  const t = c.t; c.env('plane'); passengers(c, { e: 'happy' }); const tS = c.at('sou eu');
  c.track('piloto', [{ t: 0, p: [-0.2, 0, ROW(3) - 2.6], ry: 0.1, a: 'talk', e2: 'happy', hold: 'mic' }]);
  c.track('vera', [{ t: 0, p: [0.25, 0, ROW(3) - 1.2], ry: PI - 0.1, a: 'idle', e2: t < tS ? 'surprised' : 'cry', hold: 'cup' }]);
  if (t < tS - 0.3) c.cam([{ t: 0, p: [-0.15, 3.05, 2.9], l: [-0.2, 1.45, -0.8], f: 44 }, { t: tS, p: [-0.15, 2.95, 2.5], l: [-0.2, 1.45, -0.8], f: 44 }]);
  else c.cam([{ t: tS - 0.3, p: [0.4, 3.0, -2.6], l: [0.25, 1.4, 0.6], f: 46 }, { t: c.dur, p: [0.4, 2.95, -2.3], l: [0.25, 1.4, 0.6], f: 46 }]);
  if (t > tS) c.sfx('aww', tS + 0.2, 0.5);
};

SHOTS.s10 = (c) => {
  const t = c.t; c.env('plane'); const tA = c.at('aplaudiu'); passengers(c, { a: t > tA ? 'clap' : 'sit', e: 'happy' }); c.sfx('cheer', tA, 0.7); c.sfx('pad', 0, 0.3);
  c.track('piloto', [{ t: 0, p: [-0.22, 0, ROW(3) - 2.0], ry: 0.25, a: 'hug', e2: 'happy' }]);
  c.track('vera', [{ t: 0, p: [0.2, 0, ROW(3) - 1.45], ry: PI + 0.25, a: 'hug', e2: 'cry' }]);
  c.cam([{ t: 0, p: [0.35, 2.75, ROW(3) + 1.3], l: [-0.2, 1.5, ROW(3) - 2.0], f: 48 }, { t: c.dur, p: [0.3, 2.95, ROW(3) + 2.0], l: [-0.2, 1.45, ROW(3) - 2.0], f: 52 }]);
  c.state.fade = prog(t, c.dur - 0.35, c.dur);
};
