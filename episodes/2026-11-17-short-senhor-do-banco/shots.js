// SHORT: "Ela dividia o lanche com um estranho todo dia" — Roblox, 1080x1920.
import { clamp, lerp, prog, ease, PI } from '/engine/kit.js';
export const SHOTS = {};
export const CAST = {
  menina: { shirt: 0xf7b32b, pants: 0x3a5bbf, skin: 'brown', hair: 'pony', hairColor: 0x1a1008, female: true, scale: 0.78 },
  avo: { shirt: 0x8a8f96, pants: 0x4a3b2a, skin: 'light', hair: 'short', hairColor: 0xdedede, beard: 0xe6e6e6, hat: 'fedora', hatColor: 0x5a4632, sleeves: 'long' },
  avoT: { shirt: 0x1d2333, pants: 0x1d2333, skin: 'light', hair: 'short', hairColor: 0xdedede, beard: 0xe6e6e6, hat: 'fedora', hatColor: 0x1d2333, sleeves: 'long', tie: 0x8a1f2b },
  jovem: { shirt: 0x6b8fb3, pants: 0x4a3b2a, skin: 'light', hair: 'short', hairColor: 0x3a2412, sleeves: 'long' },
  mae: { shirt: 0x2fa37a, pants: 0x30344a, skin: 'brown', hair: 'long', hairColor: 0x1a1008, female: true },
};
// banco da praça em x=-2.6 (de frente para +x), assento a 0,5 m
const AVO_B = [-2.55, 0.36, -0.55], MEN_B = [-2.55, 0.395, 0.55];
const benchAvo = (c, e2, extra = {}) => c.track('avo', [{ t: 0, p: AVO_B, ry: PI / 2, a: 'sit', e2, ...extra }]);
const benchMen = (c, e2, extra = {}) => c.track('menina', [{ t: 0, p: MEN_B, ry: PI / 2, a: 'sit', e2, ...extra }]);
// sofá da casa: assento a 0,7 m, de frente para -z
const MAE_S = [-0.8, 0.56, 2.25], MEN_S = [0.3, 0.595, 2.25], AVO_S = [1.25, 0.56, 2.25];
function walkers(c, n = 6) { for (let i = 0; i < n; i++) { const z = 14 - ((c.t * 1.2 + i * 6.5) % 34); c.mini(i, { p: [i % 2 ? 0.6 : -0.6, 0, z], ry: i % 2 ? 0 : PI, a: 'walk', e: 'neutral' }); } }

SHOTS.s01 = (c) => {
  const t = c.t; c.env('park', { swing: 0.6 }); walkers(c); c.sfx('whoosh', 0, 0.4);
  const tS = Math.max(1.2, c.at('senhor') - 0.2);
  benchAvo(c, 'sad');
  if (t < tS) {
    c.track('menina', [{ t: 0, p: [0.2, 0, 4.5], ry: -2.68, a: 'walk', e2: 'happy', hold: 'bread' }, { t: tS, p: [-1.7, 0, 0.6], ry: -2.68, a: 'walk', e2: 'happy', hold: 'bread' }]);
    const P = c.pos('menina'); c.camSet([2.3, 1.9, -1.8], [P.x, 1.25, P.z], 44);
  } else {
    benchMen(c, 'happy', { hold: 'bread' });
    c.frame([-2.55, 0.9, 0], { yaw: PI / 2 + 0.25, d: 4.6, h: 0.5, f: 46, drop: 0, t0: tS, to: { d: 4.0 } });
  }
};

SHOTS.s02 = (c) => {
  const t = c.t; c.env('park'); walkers(c, 4); const tS = c.at('sorria');
  benchMen(c, 'happy', { hold: 'bread' });
  benchAvo(c, t < tS ? 'neutral' : 'happy', { a: t < tS ? 'sit' : 'sit', hold: t < tS ? null : 'bread' });
  if (t < tS) c.frame('avo', { yaw: 0.35, d: 3.0, h: 1.5, up: 0.3, f: 48, to: { d: 2.6 } });
  else c.frame('avo', { yaw: 0.75, d: 2.6, h: 1.5, up: 0.3, f: 48, t0: tS, to: { d: 2.3 } });
};

SHOTS.s03 = (c) => {
  const t = c.t; c.env('park', { swing: 0.1 }); c.sfx('wind', 0, 0.5); const tN = c.at('nunca mais');
  if (t < tN) { c.track('menina', [{ t: 0, p: [-1.4, 0, 0.3], ry: -PI / 2, a: 'lookaround', e2: 'worried', hold: 'bread' }]); c.frame('menina', { yaw: 0.7, d: 3.8, h: 1.35, f: 48, to: { d: 3.3 } }); }
  else { c.track('menina', [{ t: 0, p: [-2.55, 0.395, 0.45], ry: PI / 2, a: 'sit', e2: 'sad', hold: 'bread' }]); c.frame('menina', { yaw: 0.1, d: 3.4, h: 1.3, up: 0.2, f: 46, t0: tN, to: { d: 2.9 } }); c.sfx('pad', tN, 0.4); }
};

SHOTS.s04 = (c) => {
  const t = c.t; c.env('house', { tv: true }); const tB = c.at('bateu'); c.sfx('knock', tB, 0.9); c.sfx('knock', tB + 0.35, 0.9);
  c.track('mae', [{ t: 0, p: MAE_S, ry: PI, a: 'sit', e2: 'neutral' }, { t: tB + 0.2, p: MAE_S, ry: PI, a: 'sit', e2: 'neutral' }, { t: tB + 0.5, p: MAE_S, ry: PI / 2 + 0.6, a: 'sit', e2: 'surprised' }]);
  c.track('menina', [{ t: 0, p: MEN_S, ry: PI, a: 'sit', e2: 'sad' }, { t: tB + 0.2, p: MEN_S, ry: PI, a: 'sit', e2: 'sad' }, { t: tB + 0.5, p: MEN_S, ry: PI / 2 + 0.4, a: 'sit', e2: 'surprised' }]);
  if (t < tB) c.frame([-0.25, 1.1, 2.25], { yaw: PI + 0.35, d: 4.2, h: 0.4, f: 46, drop: 0, to: { d: 3.7 } });
  else { c.frame([7.88, 1.3, 3.15], { yaw: -PI / 2, d: 4.2, h: 0.2, f: 50, drop: 0, t0: tB, to: { d: 3.6 } }); c.shake(0.15 * clamp(1 - (t - tB) / 0.6)); }
};

SHOTS.s05 = (c) => {
  const t = c.t; c.env('house', { door: ease.oo(prog(t, 0, 0.8)) }); c.sfx('door', 0.05, 0.6); const tF = c.at('foto');
  c.track('avoT', [{ t: 0, p: [7.1, 0, 3.15], ry: -PI / 2, a: 'idle', e2: 'sad', hold: 'paper', over: { rsx: 1.3, rel: 0.9 } }]);
  if (t < tF) c.track('mae', [{ t: 0, p: [5.8, 0, 1.9], ry: 0.8, a: 'idle', e2: 'surprised' }]);
  if (t < tF) c.frame('avoT', { yaw: 0.2, d: 3.4, h: 1.3, up: 0.3, f: 48, to: { d: 2.9 } });
  else c.frame([7.1, 1.4, 3.15], { yaw: -PI / 2 - 0.25, d: 1.9, h: 0.1, f: 44, drop: 0, t0: tF, to: { d: 1.6 } });
  c.chip(540, 1460, 'O SENHOR DA PRAÇA', 'gold', 0.4, c.dur);
};

SHOTS.s06 = (c) => {
  const t = c.t; c.env('house', { door: 1 }); const tC = c.at('chorar'); c.sfx('dramatic', tC - 0.2, 0.5);
  c.track('mae', [{ t: 0, p: [5.4, 0, 2.7], ry: PI / 2 - 0.3, a: 'idle', e2: t < tC ? 'surprised' : 'cry', hold: 'paper', over: { rsx: 1.3, rel: 0.9 } }]);
  c.track('avoT', [{ t: 0, p: [7.1, 0, 3.15], ry: -PI / 2, a: 'idle', e2: 'sad' }]);
  if (t < tC) c.frame('mae', { yaw: 0.9, d: 2.6, h: 1.7, up: 0.2, f: 48, to: { d: 2.4 } });
  else c.frame('mae', { yaw: 0.75, d: 2.3, h: 1.8, up: 0.2, f: 46, t0: tC, to: { d: 2.1 } });
};

SHOTS.s07 = (c) => {
  const t = c.t; c.env('park', { swing: 0.3 }); c.sfx('page', 0, 0.6);
  c.track('jovem', [{ t: 0, p: [0.42, 0, 6], ry: 0.15, a: 'idle', e2: 'happy' }]);
  c.track('mae', [{ t: 0, p: [-0.5, 0, 6.1], ry: -0.15, a: 'wave', e2: 'happy', s: 0.6 }]);
  c.frame([-0.05, 0, 6], { yaw: 0.05, d: 5.2, h: 1.5, f: 46, to: { d: 4.6 } });
  // aparência de foto antiga: sépia + moldura
  c.ui(`<div class="abs" style="left:0;top:0;right:0;bottom:0;backdrop-filter:sepia(0.85) contrast(1.05) brightness(0.95);box-shadow:inset 0 0 0 46px #f3ead8, inset 0 0 160px 80px rgba(60,35,10,.45)"></div>
        <div class="abs" style="left:0;right:0;top:120px;text-align:center;font-size:64px;font-weight:900;color:#fff;text-shadow:0 5px 0 #000">2005</div>`);
};

SHOTS.s08 = (c) => {
  const t = c.t; c.env('house', { door: 1 }); const tA = c.at('avô'); c.sfx('riser', 0, 0.4); c.sfx('pop', tA, 0.8);
  c.track('avoT', [{ t: 0, p: [6.6, 0, 3.15], ry: -PI / 2 - 0.4, a: 'idle', e2: 'sad' }, { t: tA, p: [6.6, 0, 3.15], ry: -PI / 2 - 0.4, a: 'idle', e2: 'cry' }]);
  c.track('menina', [{ t: 0, p: [5.3, 0, 3.6], ry: PI / 2 + 0.3, a: 'idle', e2: 'surprised' }, { t: tA, p: [5.3, 0, 3.6], ry: PI / 2 + 0.3, a: 'idle', e2: 'happy' }]);
  c.frame([5.95, 1.0, 3.4], { yaw: PI + 0.15, d: 4.8, h: 0.6, f: 46, drop: 0, to: { d: 3.4 } });
  if (t > tA) c.ui(`<div class="abs" style="left:0;right:0;top:300px;text-align:center;font-size:150px;font-weight:900;color:#ffd21f;-webkit-text-stroke:8px #000;paint-order:stroke fill;transform:scale(${1 + 0.4 * Math.max(0, 1 - (t - tA) / 0.3)})">AVÔ</div>`);
};

SHOTS.s09 = (c) => {
  const t = c.t; c.env('house', { tv: true, tvColor: 0xf2a33a }); const tL = c.at('naquela noite'); c.sfx('twinkle', tL, 0.5);
  if (t < tL) {
    c.track('avoT', [{ t: 0, p: [6.6, 0, 3.15], ry: -PI / 2 - 0.4, a: 'hug', e2: 'cry' }]);
    c.track('menina', [{ t: 0, p: [6.05, 0, 3.4], ry: PI / 2 + 0.4, a: 'hug', e2: 'happy' }]);
    c.track('mae', [{ t: 0, p: [5.0, 0, 2.4], ry: PI / 2, a: 'idle', e2: 'cry' }]);
    c.frame([6.0, 1.0, 3.2], { yaw: PI + 0.1, d: 3.6, h: 0.4, f: 46, drop: 0, to: { d: 3.1 } });
  } else {
    c.track('mae', [{ t: 0, p: MAE_S, ry: PI, a: 'sit', e2: 'happy', hold: 'bread' }]);
    c.track('menina', [{ t: 0, p: MEN_S, ry: PI, a: 'sit', e2: 'happy', hold: 'bread' }]);
    c.track('avoT', [{ t: 0, p: AVO_S, ry: PI, a: 'sit', e2: 'happy', hold: 'bread' }]);
    c.frame([0.2, 1.1, 2.25], { yaw: PI, d: 7.0, h: 0.6, f: 46, drop: 0, t0: tL, to: { d: 6.4 } });
  }
  c.state.fade = prog(t, c.dur - 0.35, c.dur);
};
