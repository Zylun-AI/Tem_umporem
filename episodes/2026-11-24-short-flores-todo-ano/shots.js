// SHORT: "Todo ano ela recebia flores de alguém que já tinha partido" — Roblox, 1080x1920.
import { clamp, lerp, prog, ease, PI, stamp } from '/engine/kit.js';
export const SHOTS = {};
export const CAST = {
  rosa: { shirt: 0x8e5bb5, pants: 0x3b3550, skin: 'light', hair: 'bun', hairColor: 0xe8e8e8, glasses: true, female: true, sleeves: 'long' },
  ent: { shirt: 0xd8433b, pants: 0x2b2d42, skin: 'brown', hair: 'short', hairColor: 0x1a1008, hat: 'cap', hatColor: 0xd8433b },
  joaoJ: { shirt: 0x2e6fb5, pants: 0x3a3a3a, skin: 'light', hair: 'short', hairColor: 0x5a3414, sleeves: 'long', tie: 0x8a1c1c },
  rosaJ: { shirt: 0xe7a0c0, pants: 0x3b3550, skin: 'light', hair: 'long', hairColor: 0x6b3a1a, female: true },
};
// Sala (env house): porta na parede x=7.9 (abre com {door}); sofá em z≈2.2; quadro na parede do fundo em (3.5, 2.2, −5.9).
const ROSA_D = [2.0, 0, 3.6], ENT_D = [3.35, 0, 3.6];
const room = (c, o = {}) => c.env('house', o);
const big = (c, txt, cls, t0, t1, y = 300) => { const t = c.t; if (t < t0 || t > t1) return; const k = ease.oo(prog(t, t0, t0 + 0.25)); c.ui(`<div class="chip ${cls}" style="left:540px;top:${y}px;font-size:58px;padding:14px 34px;border-radius:18px;opacity:${k};transform:translate(-50%,-50%) scale(${0.8 + 0.2 * k})">${txt}</div>`); };
const sepia = (c, label) => c.ui(`<div class="abs" style="left:0;top:0;right:0;bottom:0;backdrop-filter:sepia(0.85) contrast(1.05) brightness(0.95);box-shadow:inset 0 0 0 40px #f3ead8, inset 0 0 160px 80px rgba(60,35,10,.45)"></div>` +
  (label ? `<div class="abs" style="left:0;right:0;top:130px;text-align:center;font-size:62px;font-weight:900;color:#fff;text-shadow:0 5px 0 #000">${label}</div>` : ''));
const hand = "font-family:'Comic Sans MS','Segoe Print',cursive;font-weight:700;font-style:italic";
// buquê: flores soltas num ponto [x,y,z]
const bouquet = (c, p, s = 2.6) => { const off = [[0, 0, 0], [0.09, 0.03, 0.02], [-0.09, 0.02, 0.03], [0.04, 0.07, -0.06], [-0.05, 0.05, -0.07], [0.0, 0.1, 0.05], [0.11, -0.02, -0.03]];
  off.forEach((o, i) => c.prop('flower', { p: [p[0] + o[0] * s / 2.6, p[1] + o[1], p[2] + o[2] * s / 2.6], r: [o[2] * 3, i, -o[0] * 3], s })); };
const front = (c, name, d = 0.42, y = 1.15) => { const P = c.pos(name); const ry = c.CH[name].root.rotation.y; return [P.x + Math.sin(ry) * d, y, P.z + Math.cos(ry) * d]; };
// cartão / recibo / bilhete
const card = (c, t0, html, top = 1240, rot = 1.5, bg = '#fffaf0', bd = '#d9b8c8') => { const t = c.t; if (t < t0) return; const k = ease.oo(prog(t, t0, t0 + 0.3));
  c.ui(`<div class="abs" style="left:120px;right:120px;top:${top}px;padding:30px 36px 34px;border-radius:12px;background:${bg};border:4px solid ${bd};box-shadow:0 18px 40px rgba(0,0,0,.45);opacity:${k};transform:scale(${0.85 + 0.15 * k}) rotate(${rot}deg);color:#3a2a20;text-align:center">${html}</div>`); };

SHOTS.s01 = (c) => {
  const t = c.t; room(c); const tC = c.at('campainha'); c.sfx('ding', tC + 0.1, 0.6); c.sfx('ding', tC + 0.45, 0.6);
  c.track('rosa', [{ t: 0, p: [-0.3, 0.56, 2.15], ry: PI, a: 'sit', e2: t < tC ? 'neutral' : 'surprised' }, { t: c.dur - 0.6, p: [-0.3, 0.56, 2.15], ry: PI, a: 'sit', e2: 'surprised' }, { t: c.dur, p: [-0.1, 0.56, 2.15], ry: PI / 2, a: 'sit', e2: 'surprised' }]);
  if (t < tC - 0.2) c.frame('rosa', { yaw: 0.35, d: 3.4, h: 1.4, up: 0.3, f: 48, to: { d: 3.0 }, t1: tC });
  else c.frame([7.4, 0, 3.15], { yaw: -1.2, d: 5.0, h: 1.5, up: 0.2, f: 46, drop: 0.1, t0: tC - 0.2, to: { d: 4.4 } });
  big(c, 'ANIVERSÁRIO DELA', 'gold', 0.3, tC - 0.2);
  big(c, '9:00', 'blue', tC - 0.2, c.dur);
};

SHOTS.s02 = (c) => {
  const t = c.t; room(c, { door: ease.io(prog(t, 0, 0.6)) }); c.sfx('door', 0.05, 0.5);
  c.track('ent', [{ t: 0, p: [8.6, 0, 3.15], ry: -PI / 2, a: 'walk', e2: 'happy' }, { t: 0.5, p: [7.4, 0, 3.15], ry: -PI / 2, a: 'walk', e2: 'happy' }, { t: 1.5, p: ENT_D, ry: -PI / 2 + 0.6, a: 'carryidle', e2: 'happy' }]);
  c.track('rosa', [{ t: 0, p: [0.6, 0, 3.6], ry: PI / 2, a: 'walk', e2: 'surprised' }, { t: 1.0, p: ROSA_D, ry: PI / 2 - 0.6, a: 'idle', e2: 'surprised' }]);
  bouquet(c, front(c, 'ent', 0.45, 1.0), 2.0);
  c.frame('ent', { yaw: 0.8, d: 3.2, h: 1.6, up: 0.2, f: 46, to: { d: 2.8 } });
  big(c, 'UM BUQUÊ', 'gold', c.at('buquê') - 0.1, c.dur);
};

SHOTS.s03 = (c) => {
  const t = c.t; room(c, { door: 1 }); const tC = c.at('cartão');
  c.track('ent', [{ t: 0, p: ENT_D, ry: -PI / 2 + 0.6, a: 'idle', e2: 'happy' }]);
  c.track('rosa', [{ t: 0, p: ROSA_D, ry: PI / 2 - 0.6, a: 'hold', e2: 'neutral', hold: 'paper' }]);
  bouquet(c, front(c, 'rosa', 0.4, 0.95), 2.0);
  c.frame('rosa', { yaw: 0, d: 3.0, h: 1.8, up: 0.2, f: 46, to: { d: 2.7 } });
  card(c, tC + 0.2, `<div style="font-size:30px;letter-spacing:3px;color:#a07a8a">♥ FLORICULTURA ♥</div><div style="${hand};font-size:84px;color:#b0204a;margin-top:10px">Com amor, J.</div>`);
};

SHOTS.s04 = (c) => {
  const t = c.t; room(c); c.sfx('swoosh', 0, 0.5);
  c.track('joaoJ', [{ t: 0, p: [0.55, 0, 3.6], ry: -PI / 2 + 0.5, a: 'hold', e2: 'happy', hold: 'flower' }]);
  c.track('rosaJ', [{ t: 0, p: [-0.55, 0, 3.6], ry: PI / 2 - 0.5, a: t < 1.2 ? 'idle' : 'clap', e2: 'happy' }]);
  c.frame([0, 0, 3.6], { yaw: 0.05, d: 4.2, h: 1.4, up: 0.3, f: 46, drop: 0.15, to: { d: 3.8 } });
  sepia(c, '1975');
  big(c, 'SEU JOÃO', 'blue', c.at('Seu João') - 0.1, c.dur, 1300);
};

SHOTS.s05 = (c) => {
  const t = c.t; room(c); const tT = c.at('três anos'); c.sfx('dramatic', tT - 0.2, 0.5);
  c.track('rosa', [{ t: 0, p: [3.5, 0, -4.2], ry: t < tT - 0.3 ? PI : 0.1, a: 'idle', e2: 'sad' }]);
  if (t < tT - 0.3) c.frame('rosa', { yaw: PI + 0.25, d: 3.2, h: 1.7, up: 0.6, f: 48, to: { d: 2.8 } });
  else c.frame('rosa', { yaw: 0.3, d: 2.9, h: 1.8, up: 0.2, f: 46, t0: tT - 0.3, to: { d: 2.6 } });
  if (t < tT - 0.3) c.tag([3.5, 2.95, -5.8], 'SEU JOÃO', 'white', 0.2, c.dur);
  if (t > tT) { const k = ease.oo(prog(t, tT, tT + 0.25)); c.ui(stamp('3 ANOS', { top: 1280, size: 110, s: 1.4 - 0.4 * k, a: k })); }
};

SHOTS.s06 = (c) => {
  const t = c.t; room(c, { door: 1 }); const tQ = c.at('quem manda');
  c.track('ent', [{ t: 0, p: ENT_D, ry: -PI / 2 + 0.6, a: t < tQ ? 'idle' : 'shrug', e2: t < tQ ? 'happy' : 'smirk' }]);
  c.track('rosa', [{ t: 0, p: ROSA_D, ry: PI / 2 - 0.6, a: 'hold', e2: 'worried' }]);
  bouquet(c, front(c, 'rosa', 0.4, 0.95), 2.0);
  if (t < tQ - 0.2) c.frame('rosa', { yaw: 0, d: 3.1, h: 1.8, up: 0.2, f: 46, to: { d: 2.8 }, t1: tQ });
  else c.frame([2.65, 0, 3.6], { yaw: 0.35, d: 4.8, h: 1.6, up: 0.3, f: 46, drop: 0.1, t0: tQ - 0.2 });
  if (t > tQ) c.bubble(c.CH.rosa, 'Quem manda essas flores?', tQ - 0.1, c.dur, [0.9, 2.45, 0]);
};

SHOTS.s07 = (c) => {
  const t = c.t; room(c, { door: 1 }); const tP = c.at('papel'); const tV = c.at('vinte anos'); c.sfx('rustle', tP, 0.5);
  c.track('ent', [{ t: 0, p: ENT_D, ry: -PI / 2 + 0.6, a: t < tP ? 'idle' : 'hold', e2: 'happy', hold: t < tP ? null : 'paper' }]);
  c.track('rosa', [{ t: 0, p: ROSA_D, ry: PI / 2 - 0.6, a: 'idle', e2: t < tV ? 'worried' : 'surprised' }]);
  if (t < tV - 0.4) c.frame('ent', { yaw: 0, d: 3.0, h: 1.8, up: 0.2, f: 46, to: { d: 2.7 } });
  else { c.frame('rosa', { yaw: 0, d: 3.0, h: 1.8, up: 0.2, f: 46, t0: tV - 0.4 }); c.sfx('twinkle', tV, 0.45);
    card(c, tV - 0.4, `<div style="font-weight:900;font-size:38px;letter-spacing:2px;border-bottom:3px solid #8a7a6a;padding-bottom:8px">PEDIDO Nº 0417</div>
      <div style="font-size:36px;margin-top:12px;text-align:left">Entregar: <b>todo dia 14/03</b></div><div style="font-size:36px;text-align:left">Para: <b>Rosa</b></div>
      <div style="${hand};font-size:62px;color:#1f8a3a;margin-top:10px;transform:rotate(-3deg)">PAGO: 20 ANOS ✔</div>`, 1240, 1.5, '#f4f1e8', '#9a8a70'); }
};

SHOTS.s08 = (c) => {
  const t = c.t; room(c, { door: 1 }); const tL = c.at('letra'); const tS = c.at('se eu for');
  c.track('rosa', [{ t: 0, p: ROSA_D, ry: PI / 2 - 0.6, a: 'hold', e2: t < tS ? 'surprised' : 'cry', hold: 'paper' }]);
  c.track('ent', [{ t: 0, p: ENT_D, ry: -PI / 2 + 0.6, a: 'idle', e2: 'sad' }]);
  c.frame('rosa', { yaw: 0, d: 3.0, h: 1.8, up: 0.2, f: 46, to: { d: 2.6 } });
  card(c, tL, `<div style="font-size:32px;letter-spacing:2px;color:#7a6a50">OBSERVAÇÃO DO CLIENTE</div>
    <div style="${hand};font-size:56px;line-height:1.15;margin-top:12px;color:#1f2a8a;opacity:${clamp(prog(t, tS - 0.3, tS + 0.2))}">"Se eu for antes,<br>não deixa ela<br>ficar sem flor."</div>
    <div style="${hand};font-size:40px;margin-top:8px;color:#1f2a8a;opacity:${clamp(prog(t, tS, tS + 0.5))}">— João</div>`, 1220, -1.2, '#fbf7ec', '#b8a888');
  if (t > tS) c.sfx('aww', tS + 0.3, 0.4);
};

SHOTS.s09 = (c) => {
  const t = c.t; room(c); c.sfx('pad', 0, 0.4); const tS = c.at('sorriu'); const tF = c.at('foto');
  c.track('rosa', [{ t: 0, p: [2.6, 0, -5.0], ry: 0.15, a: 'hold', e2: t < tS ? 'cry' : 'happy' }]);
  bouquet(c, front(c, 'rosa', 0.42, 1.1), 2.4);
  if (t < tF - 0.2) c.frame('rosa', { yaw: 0.3, d: 3.0, h: 1.8, up: 0.2, f: 46, to: { d: 2.7 }, t1: tF });
  else { c.frame([3.1, 0, -5.2], { yaw: 0.2, d: 4.6, h: 1.8, up: 0.3, f: 48, drop: 0.1, t0: tF - 0.2, to: { d: 4.1 } }); c.tag([3.5, 2.95, -5.8], 'SEU JOÃO ♥', 'red', tF, c.dur); c.sfx('twinkle', tF, 0.4); }
  c.state.fade = prog(t, c.dur - 0.35, c.dur);
};
