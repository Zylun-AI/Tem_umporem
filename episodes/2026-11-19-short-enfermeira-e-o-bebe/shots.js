// SHORT: "O médico novo começou a cantar pra enfermeira" — Roblox, 1080x1920.
import { clamp, lerp, prog, ease, PI } from '/engine/kit.js';
export const SHOTS = {};
export const CAST = {
  enf: { shirt: 0x6fc3d6, pants: 0x6fc3d6, skin: 'light', hair: 'bun', hairColor: 0x5a3519, hat: 'nurse', female: true, sleeves: 'short' },
  enfV: { shirt: 0x6fc3d6, pants: 0x6fc3d6, skin: 'light', hair: 'bun', hairColor: 0xd2d2d2, hat: 'nurse', female: true, sleeves: 'short', glasses: true },
  med: { shirt: 0xf4f6f8, pants: 0x2c3e50, skin: 'brown', hair: 'short', hairColor: 0x15100a, tie: 0x2a7ab0, sleeves: 'long', logo: 'DR.' },
  mae: { shirt: 0xe67e9a, pants: 0x30344a, skin: 'brown', hair: 'curly', hairColor: 0x1a1008, female: true },
};
// quarto (UTI) centrado em x=26: chão x 20..32, z -5..5; camas em x=22/26/30, z≈-2.6; janela em x=23.5, z=-4.85
const NINAR = { lsx: 0.75, rsx: 0.75, lel: 1.45, rel: 1.45, lsz: -0.5, rsz: -0.5 };
const UTI = (c) => c.env('hospital', { power: 1, day: true });
// corredor: x de -2 a 2, sem camas entre z=+2 e z=-6
const big = (c, txt, cls, t0, t1, y = 330) => { const t = c.t; if (t < t0 || t > t1) return; const k = ease.oo(prog(t, t0, t0 + 0.25)); c.ui(`<div class="chip ${cls}" style="left:540px;top:${y}px;font-size:58px;padding:14px 34px;border-radius:18px;opacity:${k};transform:translate(-50%,-50%) scale(${0.8 + 0.2 * k})">${txt}</div>`); };
const notes = (c, ch, t0, t1, off = [0.35, 2.35, 0]) => c.bubble(c.CH[ch], `<span style="font-size:64px">${['♪', '♫', '♪ ♫'][Math.floor(c.t * 3) % 3]}</span>`, t0, t1, off);
const photo = (k) => `<div class="abs" style="left:300px;right:300px;top:110px;padding:26px 26px 90px;background:#fbf8f1;border-radius:8px;box-shadow:0 20px 50px rgba(0,0,0,.5);transform:rotate(3deg) scale(${0.85 + 0.15 * k});opacity:${k}">
  <div style="position:relative;height:300px;background:radial-gradient(circle at 50% 40%,#e9d7b0,#b89a68);filter:sepia(.5);overflow:hidden;border-radius:4px">
    <div style="position:absolute;left:160px;top:45px;width:100px;height:100px;border-radius:24px;background:#e8c49a"></div>
    <div style="position:absolute;left:150px;top:30px;width:120px;height:34px;border-radius:10px;background:#fff"></div>
    <div style="position:absolute;left:120px;top:150px;width:180px;height:200px;border-radius:30px 30px 0 0;background:#6fc3d6"></div>
    <div style="position:absolute;left:160px;top:190px;width:150px;height:70px;border-radius:40px;background:#cfe8ff"></div>
    <div style="position:absolute;left:272px;top:198px;width:46px;height:46px;border-radius:50%;background:#f3c9a0"></div>
  </div>
  <div style="position:absolute;left:0;right:0;bottom:20px;text-align:center;font-family:'Comic Sans MS','Segoe Print',cursive;font-size:44px;color:#333">UTI Neonatal, 2001</div></div>`;

SHOTS.s01 = (c) => {
  const t = c.t; UTI(c); c.sfx('heartbeat', 0, 0.35); const tP = c.at('prematuro');
  c.track('enf', [{ t: 0, p: [24.6, 0, -0.4], ry: 0.35, a: 'idle', over: NINAR, e2: 'happy', hold: 'baby' }]);
  if (t < tP) c.frame('enf', { yaw: 0.5, d: 6.4, h: 1.75, up: 0.4, f: 46, to: { d: 5.5 }, t1: tP });
  else c.frame('enf', { yaw: -0.2, d: 3.2, h: 1.75, up: 0.2, f: 44, t0: tP, to: { d: 2.8 } });
  big(c, '3 MESES NA UTI', 'blue', 0.3, c.dur);
};

SHOTS.s02 = (c) => {
  const t = c.t; UTI(c); c.sfx('twinkle', 0.2, 0.4);
  c.track('enf', [{ t: 0, p: [24.6, 0, -0.4], ry: 0.35 + Math.sin(t * 2.2) * 0.25, a: 'idle', over: NINAR, e2: 'happy', hold: 'baby' }]);
  c.frame([24.6, 0, -0.4], { yaw: 0.7, d: 4.3, h: 1.75, up: 0.3, f: 46, drop: 0.5, to: { d: 3.6, yaw: 0.55 } });
  notes(c, 'enf', 0.3, c.dur);
};

SHOTS.s03 = (c) => {
  const t = c.t; c.env('hospital', { power: 1, day: true }); const tN = c.at('nunca mais');
  c.track('mae', [{ t: 0, p: [0.7, 0, -0.5], ry: PI, a: 'walk', e2: 'happy', hold: 'baby' }, { t: c.dur, p: [0.7, 0, -0.5 - c.dur * 1.1], ry: PI, a: 'walk', e2: 'happy', hold: 'baby' }]);
  if (t < tN) {
    c.track('enf', [{ t: 0, p: [-0.9, 0, 1.6], ry: PI, a: 'wave', e2: 'happy' }]);
    c.cam([{ t: 0, p: [1.0, 2.4, 5.4], l: [-0.3, 1.4, -0.6], f: 54 }, { t: c.dur, p: [0.9, 2.4, 4.9], l: [-0.1, 1.4, -1.6], f: 54 }]);
  } else {
    c.track('enf', [{ t: 0, p: [-0.9, 0, 1.6], ry: PI, a: 'idle', e2: 'sad' }]);
    c.frame('enf', { yaw: 0.3, d: 3.5, h: 1.75, up: 0.2, f: 46, t0: tN, to: { d: 3.0 } });
    c.sfx('pad', tN, 0.4);
  }
};

SHOTS.s04 = (c) => {
  const t = c.t; c.env('hospital', { power: 1, day: true }); c.sfx('whoosh', 0, 0.6); const tM = c.at('médico novo');
  c.track('med', [{ t: 0, p: [0.2, 0, -7], ry: 0, a: 'walk', e2: 'happy' }, { t: c.dur, p: [0.2, 0, -7 + c.dur * 1.25], ry: 0, a: 'walk', e2: 'happy' }]);
  if (t < tM) {
    c.frame('med', { yaw: 0.25, d: 4.9, h: 1.75, up: 0.5, f: 48, drop: 0.3 });
    big(c, '25 ANOS DEPOIS', 'gold', 0.1, tM);
  } else {
    c.track('enfV', [{ t: 0, p: [-0.9, 0, 2.2], ry: PI - 0.3, a: 'lookaround', e2: 'neutral' }]);
    c.frame('med', { yaw: 0.15, d: 3.2, h: 1.75, up: 0.15, f: 46, t0: tM, to: { d: 2.8 } });
  }
};

// os dois frente a frente no corredor: enfermeira em z=0.9 (olha −z), médico em z=-0.3 (olha +z)
const ENF = [-0.7, 0, 1.1], MED = [0.6, 0, -0.3], RE = 2.39, RM = -0.75;
SHOTS.s05 = (c) => {
  const t = c.t; c.env('hospital', { power: 1, day: true }); const tC = c.at('cantarolar');
  c.track('med', [{ t: 0, p: [0.6, 0, -2.4], ry: 0, a: 'walk', e2: 'happy' }, { t: Math.min(1.3, tC - 0.2), p: MED, ry: RM, a: 'idle', e2: 'smirk' }, { t: tC, p: MED, ry: RM, a: 'talk', e2: 'happy' }]);
  c.track('enfV', [{ t: 0, p: ENF, ry: RE, a: 'idle', e2: 'neutral' }]);
  if (t < tC) c.frame([0, 0, 0.4], { yaw: 0.35, d: 4.8, h: 1.75, up: 0.3, f: 48, drop: 0.35 });
  else { c.frame('med', { yaw: 0.75, d: 3.0, h: 1.75, up: 0.15, f: 46, t0: tC, to: { d: 2.8 } }); notes(c, 'med', tC + 0.1, c.dur); }
};

SHOTS.s06 = (c) => {
  const t = c.t; c.env('hospital', { power: 1, day: true }); c.sfx('dramatic', 0.05, 0.6);
  c.track('med', [{ t: 0, p: MED, ry: RM, a: 'talk', e2: 'happy' }]);
  c.track('enfV', [{ t: 0, p: ENF, ry: RE, a: 'idle', e2: 'surprised' }]);
  c.frame('enfV', { yaw: 0.75, d: 3.8, h: 1.75, up: 0.2, f: 46, to: { d: 2.6 } }); c.shake(0.25 * clamp(1 - t / 0.5));
  big(c, 'A MESMA MÚSICA', 'gold', 0.4, c.dur);
};

SHOTS.s07 = (c) => {
  const t = c.t; c.env('hospital', { power: 1, day: true }); c.sfx('page', 0.2, 0.7); const tF = c.at('foto antiga'), tE = c.at('ela, segurando');
  c.track('med', [{ t: 0, p: MED, ry: RM, a: 'idle', e2: 'happy' }, { t: tF - 0.3, p: MED, ry: RM, a: 'hold', e2: 'happy', hold: 'paper' }]);
  c.track('enfV', [{ t: 0, p: ENF, ry: RE, a: 'idle', e2: 'surprised' }]);
  if (t < tE) c.frame([0, 0, 0.4], { yaw: -0.35, d: 4.5, h: 1.75, up: 0.3, f: 48, drop: 0.35 });
  else {
    c.frame('enfV', { yaw: 0.75, d: 3.6, h: 1.75, up: 0.1, f: 46, t0: tE, to: { d: 3.2 } });
    c.ui(`<div class="abs" style="left:0;top:0;right:0;bottom:0;background:rgba(0,0,0,.35)"></div>`);
    c.ui(photo(ease.oo(prog(t, tE, tE + 0.35))));
  }
};

SHOTS.s08 = (c) => {
  const t = c.t; c.env('hospital', { power: 1, day: true }); const tV = c.at('Virei');
  c.track('enfV', [{ t: 0, p: ENF, ry: RE, a: 'idle', e2: 'surprised' }, { t: tV, p: ENF, ry: RE, a: 'idle', e2: 'cry' }]);
  c.track('med', [{ t: 0, p: MED, ry: RM, a: 'talk', e2: 'happy', hold: 'paper' }, { t: tV, p: MED, ry: RM, a: 'point', e2: 'happy' }]);
  if (t < tV) c.frame('med', { yaw: 0.75, d: 3.2, h: 1.75, up: 0.15, f: 46, to: { d: 2.8 }, t1: tV });
  else { c.frame('enfV', { yaw: 0.75, d: 2.9, h: 1.75, up: 0.15, f: 46, t0: tV, to: { d: 2.6 } }); c.sfx('aww', tV + 0.2, 0.5); }
};

SHOTS.s09 = (c) => {
  const t = c.t; UTI(c); c.sfx('twinkle', 0.1, 0.5); c.sfx('pad', 0, 0.4); const tU = c.at('mesma');
  c.track('enfV', [{ t: 0, p: [24.3, 0, -0.3], ry: 0.45, a: 'idle', over: NINAR, e2: 'happy', hold: 'baby' }]);
  c.track('med', [{ t: 0, p: [25.6, 0, -0.1], ry: -0.4, a: 'idle', over: NINAR, e2: 'happy', hold: 'baby' }]);
  c.frame([24.95, 0, -0.2], { yaw: 0, d: 3.6, h: 1.75, up: 0.4, f: 50, drop: 0.6, to: { d: 4.3 } });
  if (t > tU) { const k = ease.oo(prog(t, tU, tU + 0.35)); c.ui(`<div class="abs" style="left:60px;right:60px;top:240px;text-align:center;font-size:92px;line-height:1.05;font-weight:900;color:#ffd21f;-webkit-text-stroke:7px #000;paint-order:stroke fill;opacity:${k};transform:scale(${0.8 + 0.2 * k})">O BEBÊ VOLTOU<br>PRA CUIDAR</div>`); }
  c.state.fade = prog(t, c.dur - 0.35, c.dur);
};
