// SHORT: "Ele devolveu uma carteira com 2 mil reais" — Roblox, 1080x1920.
// Cenários: `park` (banco em (-2.6,0,0)), `street` + fachada nº 14 (desenhada aqui), `house` (porta em x=7,9), `market` + sala do dono (desenhada aqui).
import { clamp, lerp, prog, ease, PI, stamp } from '/engine/kit.js';
export const SHOTS = {};
export const CAST = {
  lucas: { shirt: 0x3f7fc9, pants: 0x2b2b33, skin: 'brown', hair: 'curly', hairColor: 0x111111, sleeves: 'short' },
  augusto: { shirt: 0xf2efe6, pants: 0x4a3b2c, skin: 'light', hair: 'short', hairColor: 0xdedede, glasses: true, vest: 0x7a4a26, sleeves: 'long', beard: 0xdcdcdc },
};

// ---- fachada da casa do Seu Augusto (rua): porta na face do prédio em x≈15,45, z=DZ ----
const DZ = 7, DX = 15.42;
let FAC = null;
function facade(c) {
  if (FAC) return FAC; const T = c.THREE; const g = new T.Group(); c.ENV.street.g.add(g);
  const box = (w, h, d, col, x, y, z) => { const m = new T.Mesh(new T.BoxGeometry(w, h, d), new T.MeshLambertMaterial({ color: col })); m.position.set(x, y, z); g.add(m); return m; };
  box(0.12, 3.3, 3.4, 0xd9e8d0, DX + 0.02, 1.65, DZ); box(0.14, 2.6, 1.5, 0xffffff, DX - 0.02, 1.3, DZ); box(0.12, 2.45, 1.25, 0x2f5a3a, DX - 0.06, 1.24, DZ);
  box(0.06, 0.08, 0.08, 0xf2c94c, DX - 0.14, 1.2, DZ - 0.45); box(0.9, 0.04, 1.6, 0x8a3b2b, DX - 0.5, 0.15, DZ);
  const cv = document.createElement('canvas'); cv.width = 128; cv.height = 80; const x = cv.getContext('2d'); x.fillStyle = '#2f6fb5'; x.fillRect(0, 0, 128, 80); x.fillStyle = '#fff'; x.font = '900 56px Inter, sans-serif'; x.textAlign = 'center'; x.fillText('14', 64, 60);
  const num = new T.Mesh(new T.PlaneGeometry(0.5, 0.31), new T.MeshBasicMaterial({ map: new T.CanvasTexture(cv) })); num.position.set(DX - 0.1, 2.85, DZ); num.rotation.y = -PI / 2; g.add(num);
  box(0.4, 0.4, 0.4, 0xa0522d, DX - 0.4, 0.2, DZ - 1.2); const pl = new T.Mesh(new T.IcosahedronGeometry(0.32, 1), new T.MeshLambertMaterial({ color: 0x3f9d4a })); pl.position.set(DX - 0.4, 0.62, DZ - 1.2); g.add(pl);
  FAC = g; return g;
}
// ---- sala do dono no mercado: parede de fundo em z=OZ-1.6, mesa em z=OZ, cadeira atrás ----
const OX = 12, OZ = 8;
let OFF = null;
function office(c) {
  if (OFF) return OFF; const T = c.THREE; const g = new T.Group(); c.ENV.market.g.add(g);
  const box = (w, h, d, col, x, y, z, basic) => { const m = new T.Mesh(new T.BoxGeometry(w, h, d), basic ? new T.MeshBasicMaterial({ color: col }) : new T.MeshLambertMaterial({ color: col })); m.position.set(x, y, z); g.add(m); return m; };
  box(8, 4.8, 0.2, 0xdfe9f0, OX, 2.4, OZ - 2.0);                       // parede atrás do dono
  box(0.2, 4.8, 9, 0xdfe9f0, OX - 4, 2.4, OZ + 2.5); box(0.2, 4.8, 9, 0xdfe9f0, OX + 4, 2.4, OZ + 2.5);
  box(2.4, 0.08, 1.1, 0x7a5232, OX, 0.78, OZ); box(2.3, 0.72, 0.06, 0x6a4428, OX, 0.4, OZ + 0.5);   // mesa (frente fechada)
  for (const sx of [-1.1, 1.1]) box(0.08, 0.76, 1.0, 0x6a4428, OX + sx, 0.38, OZ);
  box(0.6, 0.4, 0.05, 0x222222, OX - 0.7, 1.05, OZ - 0.2); box(0.3, 0.03, 0.4, 0xffffff, OX + 0.5, 0.83, OZ + 0.1);   // monitor e papel
  // cadeira do dono (assento 0,5 m) e diploma/quadro
  box(0.7, 0.07, 0.65, 0x222831, OX, 0.47, OZ - 0.9); box(0.7, 0.9, 0.07, 0x222831, OX, 0.95, OZ - 1.25);
  const cv = document.createElement('canvas'); cv.width = 256; cv.height = 96; const x = cv.getContext('2d'); x.fillStyle = '#d62828'; x.fillRect(0, 0, 256, 96); x.fillStyle = '#fff'; x.font = '900 44px Inter, sans-serif'; x.textAlign = 'center'; x.fillText('GERÊNCIA', 128, 64);
  const sg = new T.Mesh(new T.PlaneGeometry(1.8, 0.68), new T.MeshBasicMaterial({ map: new T.CanvasTexture(cv) })); sg.position.set(OX, 3.5, OZ - 1.88); g.add(sg);
  box(1.0, 0.75, 0.05, 0xf2c94c, OX - 1.9, 2.4, OZ - 1.88); box(0.85, 0.6, 0.06, 0x58a55c, OX - 1.9, 2.4, OZ - 1.85, true);
  OFF = g; return g;
}
const park = (c) => c.env('park', { swing: 0.4 });
const street = (c, tod = 'day') => { c.env('street', { tod }); facade(c); };
const room = (c, o = {}) => c.env('house', o);
const mkt = (c) => { c.env('market', { power: 1 }); office(c); };
const BENCH = [-2.55, 0.36, 0];
const AT_DOOR = [14.55, 0.12, DZ - 0.1];
const L_IN = [7.45, 0, 3.15], A_IN = [6.1, 0, 3.15];
const BOSS = [OX, 0.36, OZ - 0.85], L_OFF = [OX + 0.2, 0, OZ + 2.3];

const big = (c, txt, cls, t0, t1, y = 300) => { const t = c.t; if (t < t0 || t > t1) return; const k = ease.oo(prog(t, t0, t0 + 0.25)); c.ui(`<div class="chip ${cls}" style="left:540px;top:${y}px;font-size:58px;padding:14px 34px;border-radius:18px;opacity:${k};transform:translate(-50%,-50%) scale(${0.8 + 0.2 * k})">${txt}</div>`); };

SHOTS.s01 = (c) => {
  const t = c.t; park(c); const tD = c.at('dois mil'); c.sfx('rustle', 0.6, 0.5);
  c.track('lucas', [{ t: 0, p: BENCH, ry: PI / 2, a: t < tD - 0.3 ? 'lookdown' : 'hold', e2: t < tD ? 'neutral' : 'surprised', hold: t < tD - 0.3 ? null : 'money' }]);
  if (t < tD - 0.3) c.frame('lucas', { yaw: 0.45, d: 3.6, h: 2.0, up: 0.3, f: 46, to: { d: 3.2 }, t1: tD });
  else { c.frame('lucas', { yaw: -0.35, d: 2.8, h: 2.0, up: 0.2, f: 44, t0: tD - 0.3, to: { d: 2.5 } }); c.sfx('ding', tD, 0.5); }
  big(c, 'CARTEIRA NO BANCO', 'white', 0.3, tD - 0.3);
  if (t > tD) { const k = ease.oo(prog(t, tD, tD + 0.25)); c.ui(stamp('R$ 2.000', { top: 1330, size: 110, s: 1.4 - 0.4 * k, a: k })); }
};

SHOTS.s02 = (c) => {
  const t = c.t; park(c); const tO = c.at('oito meses'); c.sfx('pad', 0, 0.3);
  c.track('lucas', [{ t: 0, p: BENCH, ry: PI / 2, a: 'phone', e2: 'sad', hold: 'phone' }]);
  c.frame('lucas', { yaw: 0.6, d: 3.2, h: 2.0, up: 0.25, f: 46, to: { d: 2.8 } });
  big(c, 'DESEMPREGADO', 'red', 0.1, c.dur, 1330);
  big(c, '8 MESES', 'white', tO - 0.1, c.dur, 300);
};

SHOTS.s03 = (c) => {
  const t = c.t; const tF = c.at('foi até lá');
  if (t < tF - 0.25) {
    park(c);
    c.track('lucas', [{ t: 0, p: BENCH, ry: PI / 2, a: 'hold', e2: 'worried', hold: 'paper' }]);
    c.frame('lucas', { yaw: -0.4, d: 2.9, h: 2.0, up: 0.2, f: 44, to: { d: 2.6 }, t1: tF });
    big(c, '📍 RUA DAS PALMEIRAS, 14', 'gold', c.at('endereço') - 0.1, tF);
  } else {
    street(c); c.sfx('traffic', tF, 0.25); c.sfx('footsteps', tF, 0.4);
    c.track('lucas', [{ t: tF - 0.25, p: [12.3, 0.12, 13], ry: PI, a: 'walk', e2: 'neutral', hold: 'paper' }, { t: c.dur, p: [12.3, 0.12, 8.5], ry: PI, a: 'walk', e2: 'neutral', hold: 'paper' }]);
    c.frame('lucas', { yaw: 0.5, d: 3.6, h: 1.9, up: 0.3, f: 46, to: { d: 3.2 }, t0: tF - 0.25 });
    big(c, '📍 Nº 14', 'gold', tF, c.dur);
  }
};

SHOTS.s04 = (c) => {
  const t = c.t; room(c, { door: ease.io(prog(t, 0, 0.5)) }); c.sfx('door', 0.05, 0.5); const tC = c.at('conferiu'); const tO = c.at('obrigado');
  c.track('lucas', [{ t: 0, p: L_IN, ry: -PI / 2 + 0.4, a: t < tC ? 'hold' : 'idle', e2: t < tO ? 'happy' : 'neutral', hold: t < tC - 0.2 ? 'money' : null }]);
  c.track('augusto', [{ t: 0, p: A_IN, ry: PI / 2 - 0.4, a: t < tC - 0.2 ? 'idle' : t < tO ? 'hold' : 'talk', e2: t < tO ? 'surprised' : 'deadpan', hold: t < tC - 0.2 ? null : 'money' }]);
  if (t < tO - 0.2) c.frame([6.8, 0, 3.15], { yaw: 0.25, d: 4.4, h: 1.5, up: 0.3, f: 46, drop: 0.1, to: { d: 3.9 }, t1: tO });
  else c.cam([{ t: tO - 0.2, p: [6.9, 2.2, 5.6], l: [6.15, 1.5, 3.15], f: 44 }, { t: c.dur, p: [6.85, 2.18, 5.3], l: [6.15, 1.5, 3.15], f: 44 }]);
  big(c, 'CONFERIU TUDO', 'blue', tC, tO - 0.2, 1330);
  c.bubble(c.CH.augusto, 'Obrigado.', tO - 0.1, c.dur, [0, 2.3, 0]);
};

SHOTS.s05 = (c) => {
  const t = c.t; street(c, 'dusk'); c.sfx('footsteps', 0, 0.35); const tN = c.at('Nem uma');
  c.track('lucas', [{ t: 0, p: [12.3, 0.12, 4], ry: 0, a: 'walk', e2: 'sad' }, { t: c.dur, p: [12.3, 0.12, 9], ry: 0, a: 'walk', e2: 'sad' }]);
  c.frame('lucas', { yaw: 0.35, d: 3.4, h: 1.9, up: 0.3, f: 46, to: { d: 3.0 } });
  big(c, 'NEM UMA RECOMPENSA', 'white', tN - 0.1, c.dur, 1330);
};

SHOTS.s06 = (c) => {
  const t = c.t; mkt(c); c.sfx('pad', 0, 0.3); const tE = c.at('entrevista');
  c.track('lucas', [{ t: 0, p: [0, 0, 1.5], ry: 0, a: 'walk', e2: 'worried', hold: 'paper' }, { t: c.dur, p: [0, 0, 5.5], ry: 0, a: 'walk', e2: 'worried', hold: 'paper' }]);
  c.frame('lucas', { yaw: 0.3, d: 3.6, h: 1.9, up: 0.3, f: 46, to: { d: 3.2 } });
  big(c, 'NO DIA SEGUINTE', 'white', 0.1, tE - 0.1, 300);
  big(c, 'ENTREVISTA 9:00', 'gold', tE - 0.1, c.dur, 1330);
};

SHOTS.s07 = (c) => {
  const t = c.t; mkt(c); const tC = c.at('congelou'); c.sfx('door', 0.1, 0.4);
  c.track('augusto', [{ t: 0, p: BOSS, ry: 0, a: 'sit', e2: 'neutral' }]);
  c.track('lucas', [{ t: 0, p: [L_OFF[0], 0, L_OFF[2] + 1.6], ry: PI, a: 'walk', e2: 'neutral', hold: 'paper' }, { t: tC - 0.2, p: L_OFF, ry: PI, a: 'idle', e2: 'neutral', hold: 'paper' }, { t: tC, p: L_OFF, ry: PI, a: 'idle', e2: 'surprised', hold: 'paper' }]);
  if (t < tC - 0.2) c.frame('lucas', { yaw: 0.35, d: 3.6, h: 1.7, up: 0.3, f: 46 });
  else { c.frame('lucas', { yaw: 0.15, d: 2.4, h: 1.9, up: 0.15, f: 44, t0: tC - 0.2, to: { d: 2.1 } }); c.sfx('dramatic', tC, 0.55); if (t > tC) { const k = ease.oo(prog(t, tC, tC + 0.25)); c.ui(stamp('CONGELOU', { top: 1330, size: 100, s: 1.4 - 0.4 * k, a: k })); } }
};

SHOTS.s08 = (c) => {
  const t = c.t; mkt(c); const tS = c.at('senhor');
  c.track('augusto', [{ t: 0, p: BOSS, ry: 0, a: 'sit', e2: t < tS ? 'neutral' : 'smirk' }]);
  c.track('lucas', [{ t: 0, p: L_OFF, ry: PI, a: 'idle', e2: 'surprised', hold: 'paper' }]);
  c.cam([{ t: 0, p: [OX - 1.4, 2.0, OZ + 2.9], l: [OX, 1.45, OZ - 0.85], f: 42 }, { t: c.dur, p: [OX - 1.1, 1.95, OZ + 2.3], l: [OX, 1.45, OZ - 0.85], f: 42 }]);
  big(c, 'O DONO', 'gold', 0.3, c.dur, 300);
  big(c, 'O SENHOR DA CARTEIRA', 'white', tS - 0.1, c.dur, 1330);
};

SHOTS.s09 = (c) => {
  const t = c.t; mkt(c); const tE = c.at('entrevista foi'); const tV = c.at('vaga');
  c.track('augusto', [{ t: 0, p: BOSS, ry: 0, a: 'sit', e2: 'happy' }]);
  c.track('lucas', [{ t: 0, p: L_OFF, ry: PI, a: t < tV + 0.4 ? 'idle' : 'cheer', e2: t < tV ? 'surprised' : 'happy', hold: t < tV + 0.4 ? 'paper' : null }]);
  if (t < tV - 0.2) { c.frame([OX, 0.36, OZ - 0.85], { yaw: 0.25, d: 2.6, h: 1.4, up: 0.2, f: 44, drop: 0.05, to: { d: 2.3 } }); c.bubble(c.CH.augusto, 'A entrevista<br>foi ontem.', tE - 0.1, tV + 0.6, [0, 2.0, 0]); }
  else { c.frame('lucas', { yaw: -0.2, d: 2.8, h: 1.8, up: 0.2, f: 44, t0: tV - 0.2, to: { d: 2.5 } }); c.sfx('tada', tV + 0.3, 0.5); c.sfx('aww', tV + 0.8, 0.35); if (t > tV) { const k = ease.oo(prog(t, tV, tV + 0.25)); c.ui(stamp('A VAGA É SUA', { top: 1330, size: 96, s: 1.4 - 0.4 * k, a: k })); } }
  c.state.fade = prog(t, c.dur - 0.35, c.dur);
};
