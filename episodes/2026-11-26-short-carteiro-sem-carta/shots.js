// SHORT: "O carteiro batia na porta dela mesmo sem carta" — Roblox, 1080x1920.
import { clamp, lerp, prog, ease, PI, stamp } from '/engine/kit.js';
export const SHOTS = {};
export const CAST = {
  tonho: { shirt: 0xf2c230, pants: 0x1f3d7a, skin: 'tan', hair: 'short', hairColor: 0x1a1008, hat: 'cap', hatColor: 0x1f3d7a, logo: '✉', logoColor: '#1f3d7a', sleeves: 'short' },
  zilda: { shirt: 0x4f9a6a, pants: 0x4a3b5c, skin: 'light', hair: 'bun', hairColor: 0xe6e6e6, glasses: true, female: true, sleeves: 'long' },
  medico: { shirt: 0xf4f4f4, pants: 0x2a6f8f, skin: 'dark', hair: 'short', hairColor: 0x111111, sleeves: 'long', tie: 0x2a6f8f },
};

// ---- fachada da casa da Dona Zilda (rua): porta na face do prédio em x≈15,45, z=DZ ----
const DZ = 7, DX = 15.42;
let FAC = null;
function facade(c) {
  if (FAC) return FAC; const T = c.THREE; const g = new T.Group(); c.ENV.street.g.add(g);
  const box = (w, h, d, col, x, y, z, basic) => { const m = new T.Mesh(new T.BoxGeometry(w, h, d), basic ? new T.MeshBasicMaterial({ color: col }) : new T.MeshLambertMaterial({ color: col })); m.position.set(x, y, z); g.add(m); return m; };
  box(0.12, 3.3, 3.4, 0xf1e6cf, DX + 0.02, 1.65, DZ);                 // parede clara da casinha
  box(0.14, 2.6, 1.5, 0xffffff, DX - 0.02, 1.3, DZ);                  // batente
  box(0.12, 2.45, 1.25, 0x7a4a26, DX - 0.06, 1.24, DZ);               // porta
  box(0.06, 0.08, 0.08, 0xf2c94c, DX - 0.14, 1.2, DZ - 0.45);          // maçaneta
  box(0.05, 0.9, 0.06, 0x6a3c1c, DX - 0.13, 1.5, DZ - 0.2); box(0.05, 0.9, 0.06, 0x6a3c1c, DX - 0.13, 1.5, DZ + 0.2);
  box(0.9, 0.04, 1.6, 0x8a3b2b, DX - 0.5, 0.15, DZ);                  // capacho
  box(0.08, 0.32, 0.5, 0x2f6fb5, DX - 0.05, 2.85, DZ);                 // número
  const cv = document.createElement('canvas'); cv.width = 128; cv.height = 80; const x = cv.getContext('2d'); x.fillStyle = '#2f6fb5'; x.fillRect(0, 0, 128, 80); x.fillStyle = '#fff'; x.font = '900 56px Inter, sans-serif'; x.textAlign = 'center'; x.fillText('27', 64, 60);
  const num = new T.Mesh(new T.PlaneGeometry(0.5, 0.31), new T.MeshBasicMaterial({ map: new T.CanvasTexture(cv) })); num.position.set(DX - 0.1, 2.85, DZ); num.rotation.y = -PI / 2; g.add(num);
  // caixinha de correio e vaso
  box(0.35, 0.3, 0.5, 0xc0392b, DX - 0.2, 1.3, DZ + 1.1); box(0.05, 0.04, 0.3, 0x222222, DX - 0.38, 1.38, DZ + 1.1);
  box(0.4, 0.4, 0.4, 0xa0522d, DX - 0.4, 0.2, DZ - 1.2); const pl = new T.Mesh(new T.IcosahedronGeometry(0.32, 1), new T.MeshLambertMaterial({ color: 0x3f9d4a })); pl.position.set(DX - 0.4, 0.62, DZ - 1.2); g.add(pl);
  FAC = g; return g;
}
const street = (c) => { c.env('street', { tod: 'day' }); facade(c); };
const room = (c, o = {}) => c.env('house', o);
const AT_DOOR = [14.55, 0.12, DZ - 0.1];       // Tonho em frente à porta, olhando +x
// dentro da casa: porta em x=7,9; Tonho no batente, Zilda na sala
const T_IN = [7.45, 0, 3.15], Z_IN = [6.1, 0, 3.15];

const big = (c, txt, cls, t0, t1, y = 300) => { const t = c.t; if (t < t0 || t > t1) return; const k = ease.oo(prog(t, t0, t0 + 0.25)); c.ui(`<div class="chip ${cls}" style="left:540px;top:${y}px;font-size:58px;padding:14px 34px;border-radius:18px;opacity:${k};transform:translate(-50%,-50%) scale(${0.8 + 0.2 * k})">${txt}</div>`); };
const hand = "font-family:'Comic Sans MS','Segoe Print',cursive;font-weight:700;font-style:italic";
const card = (c, t0, html, top = 1240, rot = 1.5, bg = '#fffaf0', bd = '#c9b48a') => { const t = c.t; if (t < t0) return; const k = ease.oo(prog(t, t0, t0 + 0.3));
  c.ui(`<div class="abs" style="left:110px;right:110px;top:${top}px;padding:28px 36px 32px;border-radius:10px;background:${bg};border:4px solid ${bd};box-shadow:0 18px 40px rgba(0,0,0,.45);opacity:${k};transform:scale(${0.85 + 0.15 * k}) rotate(${rot}deg);color:#3a2a20;text-align:center">${html}</div>`); };
const ENVELOPE = `<div style="display:flex;justify-content:space-between;align-items:flex-start"><div style="text-align:left;font-size:30px;color:#7a6a50">De: <b style="${hand};font-size:40px;color:#1f2a8a">Zilda</b></div>
  <div style="width:92px;height:110px;border:3px dashed #b03030;background:#f6d2a0;display:flex;align-items:center;justify-content:center;font-size:56px">✉</div></div>
  <div style="${hand};font-size:64px;color:#1f2a8a;margin-top:6px;line-height:1.1">Para: Tonho,<br>o carteiro</div><div style="${hand};font-size:38px;color:#1f2a8a;margin-top:6px">Rua das Flores, 27</div>`;

SHOTS.s01 = (c) => {
  const t = c.t; street(c); c.sfx('traffic', 0, 0.25); const tB = c.at('batia');
  if (t < tB - 0.15) {
    c.track('tonho', [{ t: 0, p: [12.3, 0.12, 13], ry: PI, a: 'walk', e2: 'happy', hold: 'bag' }, { t: c.dur, p: [12.3, 0.12, 6.5], ry: PI, a: 'walk', e2: 'happy', hold: 'bag' }]);
    c.frame('tonho', { yaw: 0.45, d: 3.6, h: 1.9, up: 0.3, f: 46, to: { d: 3.2 }, t1: tB });
    big(c, 'CARTEIRO TONHO', 'gold', 0.2, tB);
  } else {
    c.track('tonho', [{ t: 0, p: AT_DOOR, ry: PI / 2, a: 'point', e2: 'happy', hold: 'bag', over: { rsx: 1.6 + Math.abs(Math.sin(t * 9)) * 0.25 } }]);
    c.cam([{ t: tB - 0.15, p: [11.6, 2.2, DZ + 3.6], l: [14.6, 1.5, DZ - 0.2], f: 46 }, { t: c.dur, p: [11.9, 2.15, DZ + 3.1], l: [14.6, 1.5, DZ - 0.2], f: 46 }]);
    c.sfx('knock', tB, 0.7); c.sfx('knock', tB + 0.35, 0.7);
    c.tag([DX, 3.3, DZ], 'DONA ZILDA', 'white', c.at('dona') - 0.1, c.dur);
  }
};

SHOTS.s02 = (c) => {
  const t = c.t; room(c, { door: ease.io(prog(t, 0, 0.5)) }); c.sfx('door', 0.05, 0.5); const tN = c.at('não tinha');
  c.track('tonho', [{ t: 0, p: T_IN, ry: -PI / 2 + 0.4, a: t < tN ? 'wave' : 'shrug', e2: 'happy', hold: 'bag' }]);
  c.track('zilda', [{ t: 0, p: Z_IN, ry: PI / 2 - 0.4, a: 'idle', e2: 'happy' }]);
  c.frame([6.8, 0, 3.15], { yaw: 0.25, d: 4.4, h: 1.5, up: 0.3, f: 46, drop: 0.1, to: { d: 3.9 } });
  big(c, 'SEM CARTA', 'blue', tN - 0.1, c.dur, 1330);
};

SHOTS.s03 = (c) => {
  const t = c.t; const tU = c.at('única visita');
  if (t < tU - 0.35) {
    room(c, { tv: true, tvColor: 0x3a5a8a });
    c.track('zilda', [{ t: 0, p: [-0.3, 0.56, 2.15], ry: PI, a: 'sit', e2: 'sad' }]);
    c.frame('zilda', { yaw: 0.35, d: 3.6, h: 1.3, up: 0.3, f: 48, to: { d: 3.1 }, t1: tU });
    big(c, 'SOZINHA', 'white', c.at('sozinha') - 0.1, tU);
  } else {
    room(c, { door: 1 }); c.sfx('laugh', tU + 0.2, 0.35);
    c.track('tonho', [{ t: 0, p: T_IN, ry: -PI / 2 + 0.4, a: 'talk', e2: 'happy', hold: 'cup' }]);
    c.track('zilda', [{ t: 0, p: Z_IN, ry: PI / 2 - 0.4, a: 'talk', e2: 'happy', hold: 'cup' }]);
    c.frame([6.8, 0, 3.15], { yaw: -0.3, d: 4.2, h: 1.5, up: 0.3, f: 46, drop: 0.1, t0: tU - 0.35, to: { d: 3.8 } });
    big(c, 'ÚNICA VISITA', 'gold', tU - 0.1, c.dur, 1330);
  }
};

SHOTS.s04 = (c) => {
  const t = c.t; street(c); c.sfx('knock', 0.3, 0.8); c.sfx('knock', 0.9, 0.8); const tN = c.at('não abriu'); c.sfx('dramatic', tN, 0.5);
  c.track('tonho', [{ t: 0, p: AT_DOOR, ry: t < tN - 0.2 ? PI / 2 : -0.25, a: t < tN ? 'point' : 'idle', e2: 'worried', hold: 'bag', over: t < tN ? { rsx: 1.6 + Math.abs(Math.sin(t * 9)) * 0.25 } : {} }]);
  if (t < tN - 0.2) c.cam([{ t: 0, p: [11.6, 2.2, DZ + 3.6], l: [14.6, 1.5, DZ - 0.2], f: 46 }, { t: tN, p: [11.9, 2.15, DZ + 3.1], l: [14.6, 1.5, DZ - 0.2], f: 46 }]);
  else c.cam([{ t: tN - 0.2, p: [12.6, 2.25, DZ + 2.0], l: [14.5, 1.75, DZ - 0.1], f: 44 }, { t: c.dur, p: [12.8, 2.2, DZ + 1.8], l: [14.5, 1.75, DZ - 0.1], f: 44 }]);
  big(c, 'SEGUNDA-FEIRA', 'blue', 0.1, tN - 0.2, 1330);
};

SHOTS.s05 = (c) => {
  const t = c.t; const tV = c.at('voz'); const tC = c.at('chamou');
  if (t < tC - 0.2) {
    room(c);
    c.track('zilda', [{ t: 0, p: [2.6, 0, 1.0], ry: 0.6, a: 'floor', e2: 'sad', over: { rsx: 1.3 } }]);
    c.cam([{ t: 0, p: [4.4, 2.3, 4.2], l: [2.6, 0.75, 1.0], f: 46 }, { t: tC, p: [4.1, 2.1, 3.7], l: [2.6, 0.75, 1.0], f: 46 }]);
    c.bubble(c.CH.zilda, 'Tonho…?', tV - 0.1, tC, [0, 1.6, 0]);
  } else {
    street(c); c.sfx('phone', tC, 0.5); c.sfx('siren', tC + 0.6, 0.35);
    c.track('tonho', [{ t: 0, p: AT_DOOR, ry: -0.55, a: 'phone', e2: 'scared', hold: 'phone' }]);
    c.cam([{ t: tC - 0.2, p: [12.5, 2.25, DZ + 2.2], l: [14.5, 1.75, DZ - 0.1], f: 44 }, { t: c.dur, p: [12.7, 2.2, DZ + 1.9], l: [14.5, 1.75, DZ - 0.1], f: 44 }]);
    big(c, 'CHAMOU AJUDA', 'red', tC, c.dur, 1330);
  }
};

SHOTS.s06 = (c) => {
  const t = c.t; c.env('hospital', { power: 1, day: true }); const tB = c.at('bem na hora'); c.sfx('pad', 0, 0.25);
  c.track('zilda', [{ t: 0, p: [26, 0.62, -1.95], ry: 0, a: 'sit', e2: t < tB ? 'tired' : 'happy' }]);
  c.track('medico', [{ t: 0, p: [25.35, 0, -0.75], ry: PI / 2 + 0.5, a: 'talk', e2: 'happy', hold: 'paper' }]);
  c.track('tonho', [{ t: 0, p: [26.65, 0, -0.75], ry: -PI / 2 - 0.5, a: 'idle', e2: t < tB ? 'worried' : 'happy' }]);
  if (t < tB - 0.3) c.cam([{ t: 0, p: [26, 2.5, 3.4], l: [26, 1.2, -1.2], f: 50 }, { t: tB, p: [26, 2.45, 2.9], l: [26, 1.2, -1.2], f: 50 }]);
  else c.cam([{ t: tB - 0.3, p: [26.3, 2.25, 0.7], l: [26, 1.8, -1.95], f: 46 }, { t: c.dur, p: [26.3, 2.25, 0.45], l: [26, 1.8, -1.95], f: 46 }]);
  if (t > tB) { const k = ease.oo(prog(t, tB, tB + 0.25)); c.ui(stamp('BEM NA HORA', { top: 1330, size: 96, s: 1.4 - 0.4 * k, a: k })); }
};

SHOTS.s07 = (c) => {
  const t = c.t; street(c); c.sfx('traffic', 0, 0.2); const tC = c.at('cartas'); const tN = c.at('com o nome'); c.sfx('rustle', tC, 0.5);
  c.track('tonho', [{ t: 0, p: [12.0, 0.12, 3.5], ry: PI - 0.5, a: 'hold', e2: t < tN ? 'neutral' : 'surprised', hold: 'paper' }]);
  if (t < tN - 0.3) c.frame('tonho', { yaw: 0.2, d: 3.4, h: 1.9, up: 0.3, f: 46, to: { d: 3.0 }, t1: tN });
  else { c.frame('tonho', { yaw: -0.25, d: 2.7, h: 2.1, up: 0.15, f: 44, t0: tN - 0.3, to: { d: 2.4 } }); c.sfx('twinkle', tN, 0.5); card(c, tN - 0.2, ENVELOPE, 1260, -1.5); }
  big(c, '1 SEMANA DEPOIS', 'white', 0.1, tN - 0.3, 1330);
};

SHOTS.s08 = (c) => {
  const t = c.t; street(c); const tP = c.at('primeira'); const tV = c.at('vinte anos');
  c.track('tonho', [{ t: 0, p: [12.0, 0.12, 3.5], ry: PI - 0.5, a: 'hold', e2: t < tV ? 'surprised' : 'sad', hold: 'paper' }]);
  c.frame('tonho', { yaw: 0.35, d: 2.7, h: 2.1, up: 0.15, f: 44, to: { d: 2.4 } });
  card(c, 0, ENVELOPE, 1260, -1.5);
  if (t > tV) { const k = ease.oo(prog(t, tV, tV + 0.25)); c.ui(stamp('1ª CARTA EM 20 ANOS', { top: 1700, size: 70, s: 1.4 - 0.4 * k, a: k })); }
};

SHOTS.s09 = (c) => {
  const t = c.t; street(c); const tO = c.at('obrigada'); c.sfx('page', 0.05, 0.6); c.sfx('aww', tO + 0.5, 0.4);
  c.track('tonho', [{ t: 0, p: [12.0, 0.12, 3.5], ry: PI - 0.5, a: 'hold', e2: t < tO + 0.4 ? 'surprised' : 'cry', hold: 'paper' }]);
  c.frame('tonho', { yaw: -0.3, d: 2.6, h: 2.1, up: 0.15, f: 44, to: { d: 2.3 } });
  card(c, 0.1, `<div style="text-align:left;${hand};font-size:40px;color:#1f2a8a">Querido Tonho,</div>
    <div style="${hand};font-size:62px;line-height:1.15;margin-top:12px;color:#1f2a8a;opacity:${clamp(prog(t, tO - 0.3, tO + 0.2))}">obrigada por bater<br>todo dia.</div>
    <div style="${hand};font-size:40px;margin-top:10px;text-align:right;color:#1f2a8a;opacity:${clamp(prog(t, tO + 0.6, tO + 1.0))}">— Zilda ♥</div>`, 1260, 1.2, '#fbf7ec', '#b8a888');
};

SHOTS.s10 = (c) => {
  const t = c.t; room(c, { door: ease.io(prog(t, 0, 0.5)) }); c.sfx('door', 0.05, 0.5); c.sfx('pad', 0.3, 0.35); const tC = c.at('café');
  c.track('tonho', [{ t: 0, p: T_IN, ry: -PI / 2 + 0.4, a: t < tC ? 'wave' : 'hold', e2: 'happy', hold: t < tC ? 'bag' : 'cup' }]);
  c.track('zilda', [{ t: 0, p: Z_IN, ry: PI / 2 - 0.4, a: 'hold', e2: 'happy', hold: 'cup' }]);
  c.frame([6.8, 0, 3.15], { yaw: 0.2, d: 4.3, h: 1.5, up: 0.3, f: 46, drop: 0.1, to: { d: 3.7 } });
  big(c, '☕ COM CAFÉ', 'gold', tC - 0.1, c.dur, 1330);
  c.state.fade = prog(t, c.dur - 0.35, c.dur);
};
