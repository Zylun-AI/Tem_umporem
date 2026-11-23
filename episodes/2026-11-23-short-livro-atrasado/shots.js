// SHORT: "Ele devolveu um livro com 30 anos de atraso" — Roblox, 1080x1920.
import { clamp, lerp, prog, ease, PI, stamp } from '/engine/kit.js';
export const SHOTS = {};
export const CAST = {
  paulo: { shirt: 0x3d7f5a, pants: 0x2b2d42, skin: 'brown', hair: 'short', hairColor: 0x1a1008, beard: 0x1a1008, glasses: true, sleeves: 'long' },
  cida: { shirt: 0xc2557a, pants: 0x4a3b5c, skin: 'light', hair: 'bun', hairColor: 0xe6e6e6, glasses: true, female: true, sleeves: 'long' },
  paulinho: { shirt: 0xf2c200, pants: 0x2e6fb5, skin: 'brown', hair: 'short', hairColor: 0x1a1008, scale: 0.72 },
  cidaJ: { shirt: 0xc2557a, pants: 0x4a3b5c, skin: 'light', hair: 'bun', hairColor: 0x6b3a1a, glasses: true, female: true, sleeves: 'long' },
};
// Biblioteca com balcão (env library {desk}): balcão em z=2 (tampo y=1.1); atendente em z=1.15 olhando +z; cliente em z=2.95 olhando −z.
const CIDA = [0, 0, 1.15], PAU = [0, 0, 2.95], KID = [0, 0, 2.85];
const lib = (c, o = {}) => c.env('library', { desk: true, bolts: [], ...o });
const big = (c, txt, cls, t0, t1, y = 300) => { const t = c.t; if (t < t0 || t > t1) return; const k = ease.oo(prog(t, t0, t0 + 0.25)); c.ui(`<div class="chip ${cls}" style="left:540px;top:${y}px;font-size:58px;padding:14px 34px;border-radius:18px;opacity:${k};transform:translate(-50%,-50%) scale(${0.8 + 0.2 * k})">${txt}</div>`); };
const sepia = (c, label) => c.ui(`<div class="abs" style="left:0;top:0;right:0;bottom:0;backdrop-filter:sepia(0.85) contrast(1.05) brightness(0.95);box-shadow:inset 0 0 0 40px #f3ead8, inset 0 0 160px 80px rgba(60,35,10,.45)"></div>` +
  (label ? `<div class="abs" style="left:0;right:0;top:130px;text-align:center;font-size:62px;font-weight:900;color:#fff;text-shadow:0 5px 0 #000">${label}</div>` : ''));
const hand = "font-family:'Comic Sans MS','Segoe Print',cursive;font-weight:700;font-style:italic";
// ficha amarelada de empréstimo
const ficha = (c, t0, note = 0) => { const t = c.t; if (t < t0) return; const k = ease.oo(prog(t, t0, t0 + 0.3));
  c.ui(`<div class="abs" style="left:110px;right:110px;top:1240px;padding:26px 34px 30px;border-radius:10px;background:#efd99a;border:4px solid #b8955a;box-shadow:0 18px 40px rgba(0,0,0,.45), inset 0 0 60px rgba(150,100,30,.35);opacity:${k};transform:scale(${0.85 + 0.15 * k}) rotate(1.5deg);color:#3a2a14">
    <div style="font-weight:900;font-size:40px;letter-spacing:2px;border-bottom:3px solid #8a6a3a;padding-bottom:8px">FICHA DE EMPRÉSTIMO</div>
    <div style="font-size:36px;margin-top:12px">Leitor: <span style="${hand}">Paulinho, 10 anos</span></div>
    <div style="font-size:36px">Devolver até: <span style="${hand}">15/03/1996</span></div>
    <div style="${hand};font-size:64px;color:#1f8a3a;margin-top:10px;transform:rotate(-4deg)">MULTA PAGA ✔</div>
    ${note > 0 ? `<div style="${hand};font-size:56px;color:#1f2a8a;margin-top:6px;opacity:${clamp(note)}">"Ele vai voltar."<br><span style="font-size:38px">— Cida</span></div>` : ''}
  </div>`); };
// página de dedicatória do livro novo
const dedic = (c, t0) => { const t = c.t; if (t < t0) return; const k = ease.oo(prog(t, t0, t0 + 0.35));
  c.ui(`<div class="abs" style="left:120px;right:120px;top:1260px;padding:44px 40px;border-radius:8px;background:#fbf7ec;border-left:22px solid #2e6fb5;box-shadow:0 18px 40px rgba(0,0,0,.45);opacity:${k};transform:scale(${0.85 + 0.15 * k}) rotate(-1deg);text-align:center;color:#2a2418">
    <div style="font-size:34px;letter-spacing:3px;color:#7a6a50">DEDICATÓRIA</div>
    <div style="${hand};font-size:58px;line-height:1.15;margin-top:14px">Para a Dona Cida,<br>que me deixou levar.</div>
    <div style="font-size:34px;margin-top:16px;color:#7a6a50">— Paulo</div></div>`); };

SHOTS.s01 = (c) => {
  const t = c.t; lib(c); c.sfx('door', 0.05, 0.5); c.sfx('footsteps', 0.3, 0.4);
  c.track('paulo', [{ t: 0, p: [0.4, 0, 8.5], ry: PI, a: 'walk', e2: 'worried', hold: 'book' }, { t: c.dur, p: [0.2, 0, 4.6], ry: PI, a: 'walk', e2: 'worried', hold: 'book' }]);
  c.track('cida', [{ t: 0, p: CIDA, ry: 0, a: 'write', e2: 'neutral', hold: 'marker' }]);
  c.frame('paulo', { yaw: 0.5, d: 3.4, h: 1.8, up: 0.25, f: 48, to: { d: 3.0 } });
  c.tag([0.2, 2.2, 1.5], 'BIBLIOTECA', 'blue', 0.3, c.dur);
};

SHOTS.s02 = (c) => {
  const t = c.t; const tD = c.at('dez anos'); const tN = c.at('nunca devolveu');
  if (t < tD - 0.2) {
    lib(c);
    c.track('paulo', [{ t: 0, p: [0.2, 0, 4.4], ry: PI, a: 'idle', e2: 'sad', hold: 'book' }]);
    c.frame('paulo', { yaw: -0.45, d: 3.3, h: 1.8, up: 0.2, f: 46, to: { d: 3.0 } });
    big(c, 'O LIVRO', 'gold', 0.2, c.dur);
    return;
  }
  lib(c); c.sfx('swoosh', tD - 0.2, 0.5);
  const away = t > tN - 0.1;
  c.track('cidaJ', [{ t: 0, p: CIDA, ry: 0, a: away ? 'wave' : 'talk', e2: 'happy' }]);
  c.track('paulinho', [{ t: 0, p: KID, ry: PI, a: 'idle', e2: 'happy', hold: 'book' }, { t: tN, p: [0.2, 0, 3.6], ry: PI, a: 'idle', e2: 'happy', hold: 'book' }, { t: tN + 0.25, p: [0.3, 0, 3.7], ry: 0.6, a: 'walk', e2: 'smirk', hold: 'book' }, { t: c.dur, p: [0.6, 0, 4.0], ry: 0.6, a: 'idle', e2: 'smirk', hold: 'book' }]);
  c.frame([0, 0, 2.6], { yaw: 0.6, d: 4.4, h: 1.4, up: 0.3, f: 46, drop: 0.15, t0: tD, to: { d: 4.4 } });
  sepia(c, '1996');
};

SHOTS.s03 = (c) => {
  const t = c.t; lib(c); const tT = c.at('trinta'); c.sfx('dramatic', tT, 0.5);
  c.track('paulo', [{ t: 0, p: [0.2, 0, 4.2], ry: PI, a: 'hold', e2: 'worried', hold: 'book' }]);
  c.frame('paulo', { yaw: 0.35, d: 2.9, h: 1.8, up: 0.2, f: 44, to: { d: 2.6 } });
  if (t > tT) { const k = ease.oo(prog(t, tT, tT + 0.25)); c.ui(stamp('30 ANOS', { top: 1280, size: 110, s: 1.4 - 0.4 * k, a: k })); }
};

SHOTS.s04 = (c) => {
  const t = c.t; lib(c); const tC = c.at('Dona Cida');
  c.track('paulo', [{ t: 0, p: [0.2, 0, 4.2], ry: PI, a: 'walk', e2: 'worried', hold: 'book' }, { t: Math.min(1.2, c.dur * 0.4), p: PAU, ry: PI, a: 'idle', e2: 'worried', hold: 'book' }]);
  c.track('cida', [{ t: 0, p: CIDA, ry: 0, a: t < tC ? 'write' : 'idle', e2: t < tC ? 'neutral' : 'surprised', hold: t < tC ? 'marker' : null }]);
  if (t < tC - 0.2) c.frame([0, 0, 2.0], { yaw: 0.55, d: 5.0, h: 1.6, up: 0.3, f: 46, drop: 0.15 });
  else c.frame('cida', { yaw: 0.6, d: 3.2, h: 1.8, up: 0.2, f: 46, t0: tC - 0.2, to: { d: 2.9 } });
  big(c, 'A MESMA BIBLIOTECÁRIA', 'red', tC - 0.1, c.dur);
};

SHOTS.s05 = (c) => {
  const t = c.t; lib(c); const tM = c.at('multa');
  c.track('paulo', [{ t: 0, p: PAU, ry: PI, a: t < tM ? 'shrug' : 'talk', e2: 'worried', hold: 'book' }]);
  c.track('cida', [{ t: 0, p: CIDA, ry: 0, a: 'idle', e2: 'surprised' }]);
  c.frame('paulo', { yaw: 0.55, d: 3.1, h: 1.8, up: 0.2, f: 46, to: { d: 2.8 } });
  if (t > tM) c.bubble(c.CH.paulo, 'Quanto é a multa?', tM - 0.1, c.dur);
};

SHOTS.s06 = (c) => {
  const t = c.t; const tG = c.at('gaveta'); const tF = c.at('ficha'); const tP = c.at('multa paga');
  lib(c, { drawer: ease.io(prog(t, tG, tG + 0.5)) }); c.sfx('pop', tG, 0.4);
  c.track('paulo', [{ t: 0, p: PAU, ry: PI, a: 'idle', e2: t < tP ? 'worried' : 'surprised', hold: 'book' }]);
  c.track('cida', [{ t: 0, p: CIDA, ry: 0, a: t < tG ? 'idle' : (t < tF ? 'lookdown' : 'hold'), e2: 'smirk', hold: t > tF ? 'paper' : null }]);
  if (t < tP - 0.3) c.frame('cida', { yaw: -0.5, d: 3.1, h: 1.8, up: 0.2, f: 46, to: { d: 2.8 } });
  else { c.frame('paulo', { yaw: 0.5, d: 3.0, h: 1.8, up: 0.2, f: 46, t0: tP - 0.3 }); ficha(c, tP - 0.3); c.sfx('twinkle', tP, 0.45); }
};

SHOTS.s07 = (c) => {
  const t = c.t; const tA = c.at('trinta anos'); const tE = c.at('escreveu'); const tV = c.at('ele vai voltar');
  if (t < tE - 0.2) {
    // lembrança: a Cida jovem paga a multa do próprio bolso
    lib(c); c.sfx('swoosh', 0, 0.5);
    c.track('cidaJ', [{ t: 0, p: CIDA, ry: 0, a: 'hold', e2: 'sad', hold: 'money' }]);
    c.frame('cidaJ', { yaw: 0.45, d: 3.1, h: 1.8, up: 0.2, f: 46, to: { d: 2.8 } });
    sepia(c, '1996');
    return;
  }
  lib(c);
  c.track('cidaJ', [{ t: 0, p: CIDA, ry: 0, a: 'write', e2: 'happy', hold: 'marker' }]);
  c.frame('cidaJ', { yaw: 0.45, d: 3.0, h: 1.8, up: 0.2, f: 46, t0: tE - 0.2 });
  sepia(c); ficha(c, tE - 0.2, prog(t, tV - 0.3, tV + 0.2));
};

SHOTS.s08 = (c) => {
  const t = c.t; lib(c); const tO = c.at('outro livro'); c.sfx('pop', tO, 0.4);
  c.track('cida', [{ t: 0, p: CIDA, ry: 0, a: 'idle', e2: 'cry' }]);
  c.track('paulo', [{ t: 0, p: PAU, ry: PI, a: t < tO ? 'lookdown' : 'hold', e2: 'happy', hold: t < tO ? 'bag' : 'book' }]);
  c.frame('paulo', { yaw: 0.5, d: 3.1, h: 1.8, up: 0.2, f: 46, to: { d: 2.8 } });
  big(c, 'OUTRO LIVRO?', 'gold', tO, c.dur);
};

SHOTS.s09 = (c) => {
  const t = c.t; lib(c); const tP = c.at('primeiro livro'); const tD = c.at('dedicatória');
  const hug = t > c.dur - 1.1;
  c.track('cida', [{ t: 0, p: hug ? [0.55, 0, 2.95] : CIDA, ry: hug ? -PI / 2 : 0, a: hug ? 'hug' : (t < tD ? 'hold' : 'idle'), e2: hug ? 'happy' : (t < tP ? 'surprised' : 'cry'), hold: hug ? null : 'book' }]);
  c.track('paulo', [{ t: 0, p: hug ? [-0.25, 0, 2.95] : PAU, ry: hug ? PI / 2 : PI, a: hug ? 'hug' : 'idle', e2: 'happy' }]);
  if (hug) c.frame([0.15, 0, 2.95], { yaw: 0.25, d: 3.4, h: 1.55, up: 0.3, f: 48, drop: 0.2 });
  else if (t < tD - 0.2) { c.frame('cida', { yaw: 0.5, d: 3.0, h: 1.8, up: 0.2, f: 46, to: { d: 2.7 } }); big(c, 'ELE VIROU ESCRITOR', 'blue', tP, c.dur); }
  else { c.frame('cida', { yaw: 0.5, d: 2.9, h: 1.8, up: 0.2, f: 46, t0: tD - 0.2 }); dedic(c, tD - 0.2); c.sfx('aww', tD, 0.4); }
  c.state.fade = prog(t, c.dur - 0.35, c.dur);
};
