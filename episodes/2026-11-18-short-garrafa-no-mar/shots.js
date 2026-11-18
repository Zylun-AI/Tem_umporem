// SHORT: "Ele pescou uma garrafa com um bilhete dentro" — Roblox, 1080x1920.
import { clamp, lerp, prog, ease, PI } from '/engine/kit.js';
export const SHOTS = {};
export const CAST = {
  pesc: { shirt: 0x2f6f9f, pants: 0x3a3a44, skin: 'tan', hair: 'short', hairColor: 0x2a1a0e, beard: 0x2a1a0e, hat: 'beanie', hatColor: 0xc0392b, vest: 0xf1c40f, sleeves: 'long' },
  pedro: { shirt: 0xe67e22, pants: 0x2c3e8f, skin: 'tan', hair: 'curly', hairColor: 0x2a1a0e, scale: 0.72 },
};
// bote em (BX, BZ); o pescador fica em pé no fundo do bote (y≈0.4) e balança junto
const BX = 6, BZ = 8;
const bob = (t) => Math.sin(t * 1.7) * 0.12;
const boatEnv = (c, extra = {}) => c.env('ocean', { ship: false, boat: { x: BX, z: BZ, ry: 0 }, ...extra });
const PESC = (t) => [BX, 0.4 + bob(t), BZ + 1.4];
// filtro de "lembrança" (sépia) + rótulo
const sepia = (c, label) => c.ui(`<div class="abs" style="left:0;top:0;right:0;bottom:0;backdrop-filter:sepia(0.85) contrast(1.05) brightness(0.95);box-shadow:inset 0 0 0 40px #f3ead8, inset 0 0 160px 80px rgba(60,35,10,.45)"></div>` +
  (label ? `<div class="abs" style="left:0;right:0;top:130px;text-align:center;font-size:62px;font-weight:900;color:#fff;text-shadow:0 5px 0 #000">${label}</div>` : ''));
const big = (c, txt, cls, t0, t1, y = 330) => { const t = c.t; if (t < t0 || t > t1) return; const k = ease.oo(prog(t, t0, t0 + 0.25)); c.ui(`<div class="chip ${cls}" style="left:540px;top:${y}px;font-size:58px;padding:14px 34px;border-radius:18px;opacity:${k};transform:translate(-50%,-50%) scale(${0.8 + 0.2 * k})">${txt}</div>`); };
// cartão do bilhete (parte de cima da tela, a legenda fica em ~60%)
const note = (lines, k = 1) => `<div class="abs" style="left:90px;right:90px;top:200px;padding:60px 56px;background:#efe0b6;border-radius:18px;box-shadow:0 18px 50px rgba(0,0,0,.45), inset 0 0 90px rgba(120,80,20,.45);transform:rotate(-2.5deg) scale(${0.9 + 0.1 * k});opacity:${k};font-family:'Comic Sans MS','Segoe Print',cursive;color:#3a2a14;font-size:76px;line-height:1.25;text-align:center">${lines}</div>`;

SHOTS.s01 = (c) => {
  const t = c.t; boatEnv(c); c.sfx('waves', 0, 0.5); const tG = c.at('garrafa');
  const p = PESC(t);
  if (t < tG) {
    c.track('pesc', [{ t: 0, p, ry: PI / 2, a: 'crank', e2: 'tired' }]);
    c.frame([BX, 0.4, BZ + 1.4], { yaw: PI / 2 + 0.9, d: 6.5, h: 1.3, up: 0.6, f: 46, drop: 0, to: { d: 5.6 } });
  } else {
    c.track('pesc', [{ t: 0, p, ry: PI / 2 + 0.5, a: 'hold', e2: 'surprised', hold: 'bottle' }]);
    c.frame('pesc', { yaw: 0.25, d: 3.8, h: 1.7, up: 0.3, f: 46, t0: tG, to: { d: 3.4 } });
    c.sfx('splash', tG, 0.6); c.puffs([BX + 0.9, 0.2, BZ + 1.4], clamp(1 - (t - tG) / 0.8), { color: 0xffffff, rise: 1.2, op: 0.6, speed: 1.4 });
  }
};

SHOTS.s02 = (c) => {
  const t = c.t; boatEnv(c); const tA = c.at('apagado');
  c.track('pesc', [{ t: 0, p: PESC(t), ry: PI / 2 + 0.5, a: t < tA ? 'lookdown' : 'hold', e2: t < tA ? 'neutral' : 'worried', hold: 'paper' }]);
  if (t < tA) c.frame('pesc', { yaw: 0.5, d: 3.6, h: 1.7, up: 0.3, f: 46, to: { d: 3.2 } });
  else c.frame('pesc', { yaw: 0.2, d: 3.0, h: 1.7, up: 0.3, f: 44, t0: tA, to: { d: 2.7 } });
  c.sfx('page', 0.1, 0.7);
};

SHOTS.s03 = (c) => {
  const t = c.t; boatEnv(c); c.sfx('pad', 0, 0.4);
  c.track('pesc', [{ t: 0, p: PESC(t), ry: PI / 2 + 0.5, a: 'lookdown', e2: 'sad', hold: 'paper' }]);
  c.frame('pesc', { yaw: 0.6, d: 5.2, h: 2.3, up: 0.2, f: 46, to: { d: 4.6 } });
  c.ui(`<div class="abs" style="left:0;top:0;right:0;bottom:0;background:rgba(0,0,0,.35)"></div>`);
  c.ui(note('Quem achar isso,<br>por favor,<br><b>seja meu amigo.</b>', ease.oo(prog(t, 0, 0.35))));
};

SHOTS.s04 = (c) => {
  const t = c.t; boatEnv(c); const tP = c.at('pedro');
  c.track('pesc', [{ t: 0, p: PESC(t), ry: PI / 2 + 0.5, a: 'lookdown', e2: 'neutral', hold: 'paper' }]);
  c.frame('pesc', { yaw: -0.3, d: 5.0, h: 2.3, up: 0.2, f: 46, to: { d: 4.4 } });
  c.ui(`<div class="abs" style="left:0;top:0;right:0;bottom:0;background:rgba(0,0,0,.35)"></div>`);
  c.ui(note(`seja meu amigo.<br><br><span style="opacity:${clamp((t - tP + 0.1) / 0.3)}">— <b style="color:#b0281c">Pedro, 8 anos</b></span>`));
  c.sfx('pop', tP, 0.7);
};

SHOTS.s05 = (c) => {
  const t = c.t; boatEnv(c); const tN = c.at('o nome'); c.sfx('dramatic', 0.05, 0.6);
  if (t < tN) {
    c.track('pesc', [{ t: 0, p: PESC(t), ry: PI / 2 + 0.5, a: 'idle', e2: 'surprised', hold: 'paper' }]);
    c.frame('pesc', { yaw: 0.15, d: 5.0, h: 1.7, up: 0.2, f: 46, to: { d: 3.4 } }); c.shake(0.3 * clamp(1 - t / 0.5));
  } else {
    c.track('pesc', [{ t: 0, p: PESC(t), ry: PI / 2 + 0.5, a: 'think', e2: 'scared', hold: 'paper' }]);
    c.frame('pesc', { yaw: -0.5, d: 3.4, h: 1.7, up: 0.3, f: 44, t0: tN, to: { d: 3.1 } });
    big(c, 'O NOME DELE: PEDRO', 'gold', tN + 0.2, c.dur);
  }
};

// píer: x=0, de z=1.5 (ponta) a z=27; tábuas no topo y≈0.48
SHOTS.s06 = (c) => {
  const t = c.t; c.env('ocean', { ship: false, pier: true }); c.sfx('whoosh', 0, 0.5); const tJ = c.at('jogado') + 0.15;
  const KZ = 2.4;
  c.track('pedro', [{ t: 0, p: [0.6, 0.48, KZ + 6], ry: PI, a: 'walk', e2: 'sad', hold: 'bottle' }, { t: Math.max(0.6, tJ - 1.2), p: [0.3, 0.48, KZ], ry: PI, a: 'idle', e2: 'sad', hold: 'bottle' },
    { t: tJ, p: [0.3, 0.48, KZ], ry: PI, a: 'pointup', e2: 'sad' }, { t: tJ + 0.9, p: [0.3, 0.48, KZ], ry: PI, a: 'idle', e2: 'cry' }]);
  if (t > tJ) { const u = clamp((t - tJ) / 1.1); if (u < 1) c.prop('bottle', { p: [0.3 + u * 0.4, 1.3 + u * 2.2 - u * u * 3.6, KZ - 0.4 - u * 6], r: [u * 9, 0, u * 3], s: 1.6 }); else c.prop('bottle', { p: [0.7, -0.02 + Math.sin(t * 2) * 0.05, KZ - 6.4], r: [1.2, 0, 0.3], s: 1.6 }); }
  if (t > tJ + 1.1) c.sfx('splash', tJ + 1.1, 0.5);
  if (t < tJ - 0.4) c.frame('pedro', { yaw: 0.55, d: 4.4, h: 1.25, up: 0.4, f: 46, to: { d: 3.9 } });
  else c.frame([0.3, 0.48, KZ], { yaw: 2.5, d: 5.0, h: 1.0, up: 0.8, f: 46, drop: 0, t0: tJ - 0.4, to: { d: 6.0, yaw: 2.7 } });
  sepia(c, '30 ANOS ATRÁS');
};

SHOTS.s07 = (c) => {
  const t = c.t; boatEnv(c); const tC = c.at('completamente');
  c.track('pesc', [{ t: 0, p: PESC(t), ry: PI / 2 + 0.5, a: 'think', e2: 'sad', hold: 'paper' }, { t: tC, p: PESC(t), ry: PI / 2 + 0.5, a: 'shrug', e2: 'cry' }]);
  c.frame('pesc', { yaw: 0.35, d: 3.6, h: 1.7, up: 0.3, f: 46, to: { d: 3.2 } });
};

SHOTS.s08 = (c) => {
  const t = c.t; const tV = c.at('voltou');
  if (t < tV) {
    c.env('ocean', { ship: false }); c.sfx('waves', 0, 0.6);
    const x = -10 + t * 2, y = Math.sin(t * 1.3) * 0.15 + 0.55; c.prop('bottle', { p: [x, y, 0], r: [PI / 2 - 0.2, 0.4, Math.sin(t * 2) * 0.2], s: 3 });
    c.camSet([x - 2.5, 2.6, 4.5], [x, 0.4, 0], 40);
    big(c, '30 ANOS NO MAR', 'blue', 0.2, tV);
  } else {
    boatEnv(c); c.sfx('twinkle', tV, 0.5);
    c.track('pesc', [{ t: 0, p: PESC(t), ry: PI / 2 + 0.5, a: 'hug', e2: 'cry', hold: 'bottle' }]);
    c.frame('pesc', { yaw: 0.2, d: 3.6, h: 1.7, up: 0.3, f: 46, t0: tV, to: { d: 3.2 } });
  }
};

// casa à noite: cadeira da cozinha em (-5, -1.9), mesa à frente (-z)
SHOTS.s09 = (c) => {
  const t = c.t; const tR = c.at('você nunca'); c.sfx('pad', 0, 0.4);
  if (t < tR) {
    c.env('house', { tv: false });
    c.track('pesc', [{ t: 0, p: [-5, 0.36, -1.95], ry: PI, a: 'write', e2: 'happy', hold: 'marker' }]);
    c.prop('bottle', { p: [-4.6, 1.06, -2.7], r: [0, 0, 0], s: 1.6 });
    c.prop('paper', { p: [-5.05, 0.99, -2.55], r: [-PI / 2 + 0.4, 0, 0], s: 1.4 });
    c.frame('pesc', { yaw: 0.6, d: 3.4, h: 1.4, up: 0.6, f: 46, to: { d: 3.0 } });
  } else {
    c.env('ocean', { ship: false, night: true, pier: true }); c.sfx('twinkle', tR, 0.5);
    const u = t - tR; c.prop('bottle', { p: [0.4 + u * 0.3, Math.sin(t * 1.3) * 0.12 + 0.55, -1 - u * 0.5], r: [PI / 2 - 0.2, 0.4, Math.sin(t * 2) * 0.2], s: 3 });
    c.track('pesc', [{ t: 0, p: [0, 0.48, 2.2], ry: PI, a: 'wave', e2: 'happy' }]);
    c.frame([0.2, 0.4, 1.2], { yaw: -0.4, d: 6.0, h: 0.9, up: 1.0, f: 46, drop: 0, t0: tR, to: { d: 7.5 } });
    const k = ease.oo(prog(t, tR, tR + 0.35));
    c.ui(`<div class="abs" style="left:60px;right:60px;top:260px;text-align:center;font-size:96px;line-height:1.05;font-weight:900;color:#ffd21f;-webkit-text-stroke:7px #000;paint-order:stroke fill;opacity:${k};transform:scale(${0.8 + 0.2 * k})">VOCÊ NUNCA<br>ESTEVE SOZINHO</div>`);
  }
  c.state.fade = prog(t, c.dur - 0.35, c.dur);
};
