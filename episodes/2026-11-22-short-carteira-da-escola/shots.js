// SHORT: "Ela achou um recado embaixo da carteira da escola" — Roblox, 1080x1920.
import { clamp, lerp, prog, ease, PI } from '/engine/kit.js';
export const SHOTS = {};
export const CAST = {
  ana: { shirt: 0x5aa9e6, pants: 0x2b2d42, skin: 'tan', hair: 'long', hairColor: 0x3a2412, female: true, sleeves: 'long' },
  marta: { shirt: 0x9b2c3c, pants: 0x3a3a48, skin: 'light', hair: 'bun', hairColor: 0xdedede, glasses: true, female: true, sleeves: 'long' },
  aninha: { shirt: 0xffffff, pants: 0x2e6fb5, skin: 'tan', hair: 'long', hairColor: 0x3a2412, female: true, scale: 0.5 },
  martaJ: { shirt: 0x9b2c3c, pants: 0x3a3a48, skin: 'light', hair: 'bun', hairColor: 0x6b3a1a, female: true, sleeves: 'long' },
};
// Sala: carteiras em x −5.2/−1.8/1.6/5.0 e z −1.6/1.0/3.6 (cadeira em z+0.7); quadro em z=−5.85; porta na parede x=8 (z≈2.2).
const DX = -1.8, DZ = 3.6;                 // a última carteira
const SEAT = [DX, 0.36, DZ + 0.7];         // Ana sentada na cadeira da carteira, olhando −z (ry=PI)
const DOOR = [7.6, 0, 2.2];
const big = (c, txt, cls, t0, t1, y = 300) => { const t = c.t; if (t < t0 || t > t1) return; const k = ease.oo(prog(t, t0, t0 + 0.25)); c.ui(`<div class="chip ${cls}" style="left:540px;top:${y}px;font-size:58px;padding:14px 34px;border-radius:18px;opacity:${k};transform:translate(-50%,-50%) scale(${0.8 + 0.2 * k})">${txt}</div>`); };
const sepia = (c, label) => c.ui(`<div class="abs" style="left:0;top:0;right:0;bottom:0;backdrop-filter:sepia(0.85) contrast(1.05) brightness(0.95);box-shadow:inset 0 0 0 40px #f3ead8, inset 0 0 160px 80px rgba(60,35,10,.45)"></div>` +
  (label ? `<div class="abs" style="left:0;right:0;top:130px;text-align:center;font-size:62px;font-weight:900;color:#fff;text-shadow:0 5px 0 #000">${label}</div>` : ''));
// a madeira de baixo do tampo, com as frases riscadas
const tampo = (c, t0, red = 0, redTxt = true) => { const t = c.t; if (t < t0) return; const k = ease.oo(prog(t, t0, t0 + 0.3));
  const hand = "font-family:'Comic Sans MS','Segoe Print',cursive;font-weight:700;font-style:italic";
  c.ui(`<div class="abs" style="left:70px;right:70px;top:110px;padding:30px 36px 34px;border-radius:22px;border:8px solid #4a2e18;background:repeating-linear-gradient(0deg,#a87a4c 0 26px,#9a6c40 26px 52px);box-shadow:0 18px 40px rgba(0,0,0,.45);opacity:${k};transform:scale(${0.85 + 0.15 * k}) rotate(-1.5deg)">
    <div style="${hand};font-size:60px;line-height:1.1;color:#1f2a44;text-shadow:0 1px 0 rgba(255,255,255,.25)">Um dia eu volto<br>pra ensinar aqui!</div>
    <div style="${hand};font-size:40px;color:#1f2a44;text-align:right;margin-top:6px">— Ana, 5ª série</div>
    ${red > 0 ? `<div style="${hand};font-size:58px;line-height:1.1;color:#d61f1f;margin-top:22px;opacity:${clamp(red)}">${redTxt ? 'Tô te esperando.<br><span style="font-size:42px">— Prof.ª Marta</span>' : '. . . . . . . . . .'}</div>` : ''}
  </div>`); };
const room = (c, o = {}) => c.env('classroom', { door: o.door || 0, board: (x, W, H) => { x.textAlign = 'center'; x.fillStyle = '#2a6ad6'; x.font = '900 120px Inter'; x.fillText(o.txt || 'BEM-VINDOS!', W / 2, 330); } });

SHOTS.s01 = (c) => {
  const t = c.t; room(c, { door: 1 }); c.sfx('door', 0.05, 0.5); c.sfx('footsteps', 0.3, 0.4);
  c.track('ana', [{ t: 0, p: [8.7, 0, 2.2], ry: -PI / 2, a: 'walk', e2: 'happy', hold: 'book' }, { t: c.dur * 0.75, p: [5.2, 0, 2.2], ry: -PI / 2, a: 'idle', e2: 'happy', hold: 'book' }]);
  c.frame([6.0, 0, 2.2], { yaw: -1.15, d: 4.6, h: 1.6, up: 0.3, f: 50, to: { d: 4.0 } });
  big(c, '1º DIA DE AULA', 'gold', 0.3, c.dur);
};

SHOTS.s02 = (c) => {
  const t = c.t; const tV = c.at('vinte anos');
  if (t < tV - 0.1) {
    room(c, { door: 1 });
    c.track('ana', [{ t: 0, p: [4.6, 0, 2.2], ry: -PI / 2 - 0.3, a: 'lookaround', e2: 'happy', hold: 'book' }]);
    c.frame('ana', { yaw: 0.35, d: 3.2, h: 1.7, up: 0.2, f: 46, to: { d: 2.9 } });
    big(c, 'A MESMA ESCOLA', 'blue', 0.4, c.dur);
    return;
  }
  room(c, { txt: '2 + 2 = 4' }); c.sfx('swoosh', tV - 0.1, 0.5);
  c.track('aninha', [{ t: 0, p: [DX, 0.42, DZ + 0.7], ry: PI, a: 'sit', e2: 'happy' }]);
  for (let i = 0; i < 5; i++) { const sp = [[-5.2, 1.0], [1.6, 1.0], [-5.2, 3.6], [1.6, 3.6], [-1.8, 1.0]][i]; c.mini(i, { p: [sp[0], 0.42, sp[1] + 0.7], ry: PI, a: 'sit', e: 'happy', s: 0.5 }); }
  c.frame('aninha', { yaw: 0.45, d: 2.6, h: 1.0, up: 0.3, f: 48, drop: 0.2, t0: tV, to: { d: 2.7 } });
  sepia(c, '20 ANOS ATRÁS');
};

SHOTS.s03 = (c) => {
  const t = c.t; room(c, { door: 1 }); c.sfx('footsteps', 0.1, 0.4); const tA = Math.min(c.at('abaixou') - 0.3, c.dur * 0.7);
  c.track('ana', [{ t: 0, p: [1.0, 0, 5.0], ry: -PI / 2, a: 'walk', e2: 'happy', hold: 'book' }, { t: tA - 0.5, p: [DX, 0, 5.0], ry: -PI / 2, a: 'walk', e2: 'happy', hold: 'book' },
    { t: tA, p: SEAT, ry: PI, a: 'sit', e2: 'happy' }]);
  if (t < tA) c.frame([-0.6, 0, 4.6], { yaw: PI + 0.5, d: 4.5, h: 1.5, up: 0.3, f: 50, drop: 0.2 });
  else c.frame('ana', { yaw: 0.45, d: 3.0, h: 1.55, up: 0.3, f: 46, drop: 0.2, t0: tA, to: { d: 2.7 } });
  c.tag([DX, 1.5, DZ], 'ÚLTIMA CARTEIRA', 'gold', 0.4, tA);
};

SHOTS.s04 = (c) => {
  const t = c.t; room(c, { door: 1 }); const tF = c.at('um dia eu volto'); const tR = c.at('riscou'); c.sfx('twinkle', tF, 0.4);
  if (t < tR) {
    c.track('ana', [{ t: 0, p: SEAT, ry: PI, a: 'sit', e2: 'surprised' }]);
    c.frame('ana', { yaw: 0.45, d: 2.8, h: 1.55, up: 0.3, f: 46, drop: 0.2, to: { d: 2.5 } });
  } else if (t < tF) {
    // lembrança rápida: a Aninha riscando a carteira
    room(c, { txt: '2 + 2 = 4' });
    c.track('aninha', [{ t: 0, p: [DX, 0.42, DZ + 0.7], ry: PI, a: 'write', e2: 'smirk', hold: 'marker' }]);
    c.frame('aninha', { yaw: 0.5, d: 2.2, h: 1.0, up: 0.2, f: 46, drop: 0.15 });
    sepia(c);
  } else {
    c.track('ana', [{ t: 0, p: SEAT, ry: PI, a: 'sit', e2: 'happy' }]);
    c.frame('ana', { yaw: 0.45, d: 2.6, h: 1.55, up: 0.3, f: 46, drop: 0.2 });
    tampo(c, tF);
  }
};

SHOTS.s05 = (c) => {
  const t = c.t; room(c, { door: 1 }); const tV = c.at('vermelha'); c.sfx('dramatic', c.at('coisa nova') - 0.1, 0.5);
  c.track('ana', [{ t: 0, p: SEAT, ry: PI, a: 'sit', e2: t < c.at('coisa nova') ? 'happy' : 'surprised' }]);
  c.frame('ana', { yaw: 0.45, d: 2.6, h: 1.55, up: 0.3, f: 46, drop: 0.2, to: { d: 2.3 } });
  tampo(c, 0, prog(t, tV - 0.4, tV), false);
};

SHOTS.s06 = (c) => {
  const t = c.t; room(c, { door: 1 }); c.sfx('aww', 0.3, 0.4);
  c.track('ana', [{ t: 0, p: SEAT, ry: PI, a: 'sit', e2: t < c.dur * 0.5 ? 'surprised' : 'cry' }]);
  c.frame('ana', { yaw: 0.35, d: 2.4, h: 1.55, up: 0.3, f: 44, drop: 0.2, to: { d: 2.1 } });
  tampo(c, 0, prog(t, 0.1, 0.6));
};

SHOTS.s07 = (c) => {
  const t = c.t; c.sfx('swoosh', 0, 0.5); c.sfx('pad', 0.2, 0.35); const tA = c.at('acreditou');
  room(c, { txt: 'ANA ⭐ 10' });
  c.track('aninha', [{ t: 0, p: [DX, 0.42, DZ + 0.7], ry: PI, a: t < tA ? 'pointup' : 'sit', e2: 'happy' }]);
  c.track('martaJ', [{ t: 0, p: [DX + 1.1, 0, DZ + 0.3], ry: -1.22, a: t < tA ? 'point' : 'clap', e2: 'happy' }]);
  c.frame([DX + 0.55, 0, DZ + 0.5], { yaw: PI + 0.25, d: 3.6, h: 1.25, up: 0.3, f: 48, drop: 0.2, to: { d: 3.8 } });
  sepia(c, 'A PROFESSORA MARTA');
};

SHOTS.s08 = (c) => {
  const t = c.t; const tP = c.at('porta'); const tD = c.at('diretora'); const k = ease.io(prog(t, tP, tP + 0.7)); room(c, { door: t < tP ? 0 : k });
  c.sfx('door', tP, 0.55);
  if (t < tD - 0.2) {
    c.track('ana', [{ t: 0, p: SEAT, ry: PI, a: 'sit', e2: 'cry' }, { t: tP + 0.2, p: SEAT, ry: PI, a: 'sit', e2: 'cry' }, { t: tP + 0.7, p: [DX + 0.6, 0, DZ + 1.1], ry: PI / 2, a: 'idle', e2: 'surprised' }]);
    c.camSet([DX - 1.4, 1.75, DZ + 2.0], [DOOR[0], 1.2, DOOR[2]], 48);
  } else {
    c.track('marta', [{ t: 0, p: [7.3, 0, 2.2], ry: -PI / 2, a: 'walk', e2: 'smirk' }, { t: c.dur, p: [6.6, 0, 2.2], ry: -PI / 2, a: 'idle', e2: 'smirk' }]);
    c.frame('marta', { yaw: 0.45, d: 3.2, h: 1.65, up: 0.2, f: 46, t0: tD - 0.2, to: { d: 2.8 } });
    big(c, 'A DIRETORA', 'red', tD - 0.1, c.dur);
  }
};

SHOTS.s09 = (c) => {
  const t = c.t; room(c, { door: 1 }); const tE = c.at('ela só disse'); const tD = c.at('demorou'); c.sfx('twinkle', tD, 0.5);
  const hug = t > c.dur - 1.0;
  c.track('marta', [{ t: 0, p: [4.5, 0, 2.3], ry: hug ? -PI / 2 : -PI / 2 - 0.5, a: hug ? 'hug' : (t < tD ? 'idle' : 'talk'), e2: hug ? 'happy' : 'smirk' }]);
  c.track('ana', [{ t: 0, p: [hug ? 3.6 : 3.2, 0, 2.3], ry: hug ? PI / 2 : PI / 2 + 0.5, a: hug ? 'hug' : 'idle', e2: t < tE ? 'surprised' : 'cry' }]);
  if (t < tE || hug) c.frame([3.9, 0, 2.3], { yaw: PI, d: 3.6, h: 1.55, up: 0.3, f: 48, drop: 0.2 });
  else c.frame('marta', { yaw: -0.5, d: 2.8, h: 1.65, up: 0.2, f: 46, t0: tE, to: { d: 2.5 } });
  if (t > tD - 0.1 && !hug) c.bubble(c.CH.marta, 'Demorou, hein?', tD - 0.1, c.dur - 1.0);
  c.state.fade = prog(t, c.dur - 0.35, c.dur);
};
