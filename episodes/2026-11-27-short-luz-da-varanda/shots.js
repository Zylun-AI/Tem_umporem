// SHORT: "Ela piscava a luz da varanda toda noite às 9h" — Roblox, 1080x1920.
// Cenário: `farm` à noite (casa em z=-12, frente em z=-9, porta em x=-2) + varanda, lâmpada, estrada (z=46) e caminhão desenhados aqui.
import { clamp, lerp, prog, ease, PI, stamp } from '/engine/kit.js';
export const SHOTS = {};
export const CAST = {
  neusa: { shirt: 0x8a4f9e, pants: 0x3b3550, skin: 'tan', hair: 'bun', hairColor: 0xdedede, glasses: true, female: true, sleeves: 'long' },
  ze: { shirt: 0x2f6db5, pants: 0x2b2b33, skin: 'tan', hair: 'short', hairColor: 0x1a1008, hat: 'cap', hatColor: 0xc0392b, beard: 0x2a1a10, sleeves: 'short' },
  lucas: { shirt: 0x3fa35a, pants: 0x1f3d7a, skin: 'brown', hair: 'curly', hairColor: 0x111111, sleeves: 'short' },
  viz1: { shirt: 0xe67e22, pants: 0x4a4a4a, skin: 'light', hair: 'long', hairColor: 0x6b3a1a, female: true, sleeves: 'short' },
  viz2: { shirt: 0x9e9e9e, pants: 0x2a3a55, skin: 'dark', hair: 'bald', sleeves: 'short', glasses: true },
};

const ROADZ = 46, LAMP = [-3.25, 2.75, -8.8];
let W = null;
function world(c) {
  if (W) return W; const T = c.THREE; const g = new T.Group(); c.ENV.farm.g.add(g);
  const box = (par, w, h, d, col, x, y, z, basic, op) => { const m = new T.Mesh(new T.BoxGeometry(w, h, d), basic ? new T.MeshBasicMaterial({ color: col, transparent: !!op, opacity: op || 1, depthWrite: !op }) : new T.MeshLambertMaterial({ color: col })); m.position.set(x, y, z); par.add(m); return m; };
  // varanda: piso de tábua, 2 pilares, telhadinho
  box(g, 7, 0.12, 2.4, 0x8a6a4a, -1, 0.06, -7.8); for (const x of [-4.2, 2.2]) box(g, 0.18, 2.9, 0.18, 0x6b4a2f, x, 1.5, -6.75); box(g, 7, 0.14, 2.6, 0x7a3b22, -1, 3.0, -7.75);
  // lâmpada + interruptor
  box(g, 0.14, 0.14, 0.12, 0x333333, LAMP[0], LAMP[1] + 0.12, -8.92);
  const bulb = new T.Mesh(new T.SphereGeometry(0.16, 12, 8), new T.MeshBasicMaterial({ color: 0xfff0b0 })); bulb.position.set(...LAMP); g.add(bulb);
  const halo = new T.Mesh(new T.SphereGeometry(0.55, 14, 10), new T.MeshBasicMaterial({ color: 0xffd27a, transparent: true, opacity: 0.35, depthWrite: false, blending: T.AdditiveBlending })); halo.position.set(...LAMP); g.add(halo);
  box(g, 0.16, 0.24, 0.04, 0xf4f4f4, -3.0, 1.3, -8.93);
  // cadeira de balanço na varanda (assento 0,5 m) em x=0,2
  const ch = new T.Group(); ch.position.set(0.3, 0.12, -8.2); g.add(ch); box(ch, 0.7, 0.07, 0.65, 0x6b4423, 0, 0.45, 0); box(ch, 0.7, 0.75, 0.07, 0x6b4423, 0, 0.85, -0.3); for (const sx of [-0.3, 0.3]) for (const sz of [-0.27, 0.27]) box(ch, 0.06, 0.45, 0.06, 0x6b4423, sx, 0.22, sz);
  // estrada lá longe
  box(g, 400, 0.04, 9, 0x2c2e33, 0, 0.02, ROADZ); for (let x = -200; x < 200; x += 8) box(g, 3, 0.05, 0.25, 0xf2c230, x, 0.04, ROADZ);
  box(g, 400, 0.5, 0.15, 0x9aa0a6, 0, 0.5, ROADZ - 5.2);
  for (let x = -120; x <= 120; x += 30) { box(g, 0.15, 6, 0.15, 0x555555, x, 3, ROADZ - 6); box(g, 0.7, 0.15, 0.4, 0xffe9a8, x + 0.3, 6, ROADZ - 5.6, true); }
  // portão na cerca (z=14)
  box(g, 2.6, 1.3, 0.1, 0xd9c7a0, 0, 0.75, 14.05);
  // caminhão (anda em +x; cabine aberta por dentro pra filmar o motorista)
  const tr = new T.Group(); g.add(tr); const red = 0xc0392b;
  box(tr, 2.3, 0.25, 2.5, 0x222222, 1.1, 1.15, 0);                            // piso
  box(tr, 2.3, 1.0, 2.5, red, 1.1, 0.75, 0);                                  // parte de baixo
  box(tr, 0.6, 1.0, 2.5, red, 2.55, 0.75, 0);                                 // capô
  box(tr, 0.1, 2.2, 2.5, red, 0.0, 2.3, 0);                                   // fundo da cabine
  box(tr, 2.3, 0.12, 2.5, red, 1.1, 3.4, 0);                                  // teto
  for (const sz of [-1.22, 1.22]) { box(tr, 2.3, 0.9, 0.08, red, 1.1, 1.7, sz); box(tr, 0.12, 2.2, 0.1, red, 2.2, 2.3, sz); box(tr, 0.12, 2.2, 0.1, red, 0.05, 2.3, sz); }
  box(tr, 0.12, 0.95, 2.5, red, 2.2, 1.7, 0);                                 // painel frontal
    box(tr, 0.5, 0.3, 0.7, 0x333333, 1.95, 2.2, -0.55);                         // painel
  const wheel = new T.Mesh(new T.TorusGeometry(0.24, 0.04, 8, 18), new T.MeshLambertMaterial({ color: 0x111111 })); wheel.position.set(1.72, 2.3, -0.55); wheel.rotation.y = PI / 2; wheel.rotation.x = 0.0; wheel.rotation.z = 0; tr.add(wheel); wheel.rotation.set(0, PI / 2, 0); wheel.rotateX(-0.5);
  box(tr, 0.6, 0.12, 0.6, 0x444444, 0.75, 1.75, -0.55);                       // banco
  box(tr, 0.12, 0.7, 0.6, 0x444444, 0.42, 2.1, -0.55);
  box(tr, 9.5, 3.0, 2.6, 0xeeeeee, -5.0, 2.3, 0);                             // baú
  box(tr, 9.5, 0.3, 2.62, 0x2f6db5, -5.0, 1.0, 0);
  for (const x of [2.1, -2.0, -3.2, -8.2, -9.2]) for (const sz of [-1.25, 1.25]) { const w = new T.Mesh(new T.CylinderGeometry(0.55, 0.55, 0.35, 16), new T.MeshLambertMaterial({ color: 0x111111 })); w.rotation.x = PI / 2; w.position.set(x, 0.55, sz); tr.add(w); }
  const hl = [], beams = [];
  for (const sz of [-0.85, 0.85]) { hl.push(box(tr, 0.08, 0.3, 0.45, 0xfff6c8, 2.88, 0.85, sz, true));
    const hg = new T.Mesh(new T.SphereGeometry(0.38, 12, 8), new T.MeshBasicMaterial({ color: 0xfff2b0, transparent: true, opacity: 0.55, depthWrite: false, blending: T.AdditiveBlending })); hg.position.set(3.0, 0.85, sz); tr.add(hg); beams.push(hg);
    const cone = new T.Mesh(new T.ConeGeometry(2.6, 16, 18, 1, true), new T.MeshBasicMaterial({ color: 0xfff2b0, transparent: true, opacity: 0.18, depthWrite: false, blending: T.AdditiveBlending, side: T.DoubleSide })); cone.rotation.z = PI / 2; cone.position.set(2.9 + 8, 0.6, sz); tr.add(cone); beams.push(cone); }
  const amb = new T.AmbientLight(0x9fb0ff, 0); g.add(amb); const fill = new T.DirectionalLight(0xc8d4ff, 0); fill.position.set(0, 8, 30); g.add(fill); g.add(fill.target);
  W = { g, bulb, halo, tr, hl, beams, ch, amb, fill }; return W;
}
// cena base: noite na fazenda. o: {lamp 0..1, truck:{x,z,ry,on}, cycle}
function scene(c, o = {}) {
  c.env('farm', { cycle: o.cycle ?? 0.74, plant: 0 }); const w = world(c);
  const cy = o.cycle ?? 0.74; const night = cy > 0.55 && cy < 0.98 ? 1 : 0; w.amb.intensity = night ? 1.1 : 0.25; w.fill.intensity = night ? 0.9 : 0;
  const L = o.lamp ?? 1; w.bulb.material.color.set(L > 0.5 ? 0xfff0b0 : 0x4a4436); w.halo.visible = L > 0.5;
  if (L > 0.5) c.glow([LAMP[0], LAMP[1] - 0.3, -8.2], 0xffc870, 9);
  const tk = o.truck; w.tr.visible = !!tk; if (tk) { w.tr.position.set(tk.x, 0, tk.z ?? ROADZ + 1.5); w.tr.rotation.y = tk.ry ?? 0; const on = tk.on ?? 1;
    w.hl.forEach(m => m.material.color.set(on > 0.5 ? 0xfff6c8 : 0x555544)); w.beams.forEach(b => { b.visible = on > 0.5; b.material.opacity = 0.18 + (tk.boost || 0) * 0.25; }); }
  return w;
}
// 3 piscadas a partir de t0 (0,5 s cada)
const blink3 = (t, t0) => (t < t0 || t > t0 + 1.5) ? 1 : (((t - t0) % 0.5) < 0.25 ? 0 : 1);
const big = (c, txt, cls, t0, t1, y = 1330) => { const t = c.t; if (t < t0 || t > t1) return; const k = ease.oo(prog(t, t0, t0 + 0.25)); c.ui(`<div class="chip ${cls}" style="left:540px;top:${y}px;font-size:58px;padding:14px 34px;border-radius:18px;opacity:${k};transform:translate(-50%,-50%) scale(${0.8 + 0.2 * k})">${txt}</div>`); };
const N_POS = [-3.55, 0.12, -8.25];
const truckX = (t, t0, t1, x0 = -60, x1 = 60) => lerp(x0, x1, clamp((t - t0) / (t1 - t0)));

SHOTS.s01 = (c) => {
  const t = c.t; const t3 = c.at('três vezes'); const L = blink3(t, t3 - 0.2); scene(c, { lamp: L }); c.sfx('crickets', 0, 0.35);
  for (const k of [0, 0.5, 1.0]) c.sfx('click', t3 - 0.2 + k, 0.6);
  c.track('neusa', [{ t: 0, p: N_POS, ry: PI - 0.75, a: t < t3 - 0.5 ? 'idle' : 'point', e2: 'neutral' }]);
  c.frame('neusa', { yaw: -0.9, d: 4.3, h: 1.45, up: 0.35, f: 46, to: { d: 3.8 } });
  big(c, '🕘 21:00', 'gold', 0.3, t3 - 0.3);
  if (t > t3 - 0.2) big(c, '3 VEZES', 'gold', t3 - 0.2, c.dur);
};

SHOTS.s02 = (c) => {
  const t = c.t; scene(c, { lamp: blink3(t, 0.3) }); c.sfx('laugh', c.at('mania') + 0.3, 0.35);
  c.track('viz1', [{ t: 0, p: [5.2, 0, 6.5], ry: PI + 0.75, a: 'talk', e2: 'smirk' }]);
  c.track('viz2', [{ t: 0, p: [6.4, 0, 6.0], ry: PI + 0.95, a: t < c.at('mania') ? 'idle' : 'shrug', e2: 'deadpan' }]);
  c.cam([{ t: 0, p: [4.0, 1.9, 1.3], l: [5.8, 1.55, 6.25], f: 46 }, { t: c.dur, p: [4.2, 1.9, 1.8], l: [5.8, 1.55, 6.25], f: 46 }]);
  big(c, '“MANIA”', 'white', c.at('mania') - 0.1, c.dur);
};

SHOTS.s03 = (c) => {
  const t = c.t; scene(c); const tP = c.at('perguntar');
  if (t < tP - 0.3) {
    c.track('lucas', [{ t: 0, p: [2.5, 0, -1.5], ry: PI + 0.8, a: 'walk', e2: 'neutral' }, { t: tP, p: [-1.2, 0.12, -6.6], ry: PI + 0.8, a: 'walk', e2: 'neutral' }]);
    c.track('neusa', [{ t: 0, p: N_POS, ry: 0.5, a: 'idle', e2: 'neutral' }]);
    c.frame('lucas', { yaw: 0.5, d: 4.2, h: 1.6, up: 0.4, f: 46 });
    big(c, 'VIZINHO NOVO', 'blue', 0.2, tP - 0.3);
  } else {
    c.track('lucas', [{ t: 0, p: [-2.25, 0.12, -7.3], ry: -PI / 2 + 0.6, a: 'talk', e2: 'surprised' }]);
    c.track('neusa', [{ t: 0, p: N_POS, ry: PI / 2 - 0.6, a: 'idle', e2: 'neutral' }]);
    c.frame([-2.9, 0.12, -7.7], { yaw: 0.05, d: 4.4, h: 1.45, up: 0.3, f: 46, drop: 0.1, to: { d: 4.0 }, t0: tP - 0.3 });
    c.bubble(c.CH.lucas, 'Por que a senhora<br>faz isso?', tP - 0.2, c.dur, [-0.3, 2.3, 0]);
  }
};

SHOTS.s04 = (c) => {
  const t = c.t; scene(c); const tA = c.at('apontou'); const tE = c.at('estrada');
  c.track('lucas', [{ t: 0, p: [-2.25, 0.12, -7.3], ry: t < tA ? -PI / 2 + 0.6 : 0.2, a: t < tA ? 'idle' : 'lookaround', e2: 'neutral' }]);
  c.track('neusa', [{ t: 0, p: N_POS, ry: t < tA - 0.1 ? PI / 2 - 0.6 : 0.15, a: t < tA - 0.1 ? 'idle' : 'point', e2: t < tA ? 'smirk' : 'happy' }]);
  if (t < tE - 0.1) c.frame([-2.9, 0.12, -7.7], { yaw: 0.1, d: 4.3, h: 1.45, up: 0.3, f: 46, drop: 0.1, to: { d: 3.9 } });
  else { c.cam([{ t: tE - 0.1, p: [-2.6, 2.4, -6.2], l: [0, 1.0, ROADZ], f: 30 }, { t: c.dur, p: [-2.5, 2.3, -5.6], l: [0, 1.0, ROADZ], f: 26 }]); c.tag([0, 1.5, ROADZ], 'ESTRADA', 'white', tE, c.dur); }
};

SHOTS.s05 = (c) => {
  const t = c.t; const tP = c.at('piscou'); scene(c, { truck: { x: truckX(t, 0, c.dur, -55, 25), on: blink3(t, tP), boost: 1 } }); c.sfx('engine', 0.3, 0.4);
  if (t < tP - 0.25) {
    { const x = truckX(t, 0, c.dur, -55, 25); c.cam([{ t: 0, p: [-1.2, 2.5, -8.7], l: [x * 0.5, 1.4, ROADZ], f: 30 }, { t: tP, p: [-1.1, 2.45, -8.5], l: [x * 0.5, 1.4, ROADZ], f: 28 }]); }
    big(c, '21:01', 'gold', 0.2, tP);
  } else {
    const x = truckX(t, 0, c.dur, -55, 25); c.cam([{ t: tP - 0.25, p: [x + 9, 1.8, ROADZ - 3.4], l: [x + 1, 1.5, ROADZ + 1.5], f: 44 }, { t: c.dur, p: [x + 8, 1.8, ROADZ - 3.2], l: [x + 1, 1.5, ROADZ + 1.5], f: 44 }]);
    for (const k of [0, 0.5, 1]) c.sfx('click', tP + k, 0.4);
    big(c, '3 PISCADAS', 'gold', tP, c.dur);
  }
};

SHOTS.s06 = (c) => {
  const t = c.t; const tC = c.at('caminhoneiro'); const x = 0; scene(c, { truck: { x, on: 1 } }); c.sfx('engine', 0, 0.35);
  c.track('ze', [{ t: 0, p: [x + 0.75, 1.47, ROADZ + 1.5 - 0.55], ry: PI / 2, a: 'drive', e2: 'happy' }]);
  c.cam([{ t: 0, p: [x + 4.6, 2.75, ROADZ + 1.5 - 0.9], l: [x + 0.75, 2.6, ROADZ + 1.5 - 0.55], f: 40 }, { t: c.dur, p: [x + 4.1, 2.7, ROADZ + 1.5 - 0.8], l: [x + 0.75, 2.6, ROADZ + 1.5 - 0.55], f: 40 }]);
  c.shake(0.25, 10);
  big(c, 'O FILHO: ZÉ', 'blue', 0.2, tC - 0.1); big(c, '🚚 CAMINHONEIRO', 'gold', tC - 0.1, c.dur);
};

SHOTS.s07 = (c) => {
  const t = c.t; const tB = c.at('tô bem');
  if (t < tB - 0.25) {
    scene(c, { truck: { x: 0, on: blink3(t, 0.2) } });
    c.track('ze', [{ t: 0, p: [0.75, 1.47, ROADZ + 0.95], ry: PI / 2, a: 'drive', e2: 'happy' }]);
    c.cam([{ t: 0, p: [4.3, 2.72, ROADZ + 0.65], l: [0.75, 2.6, ROADZ + 0.95], f: 40 }, { t: c.dur, p: [4.0, 2.7, ROADZ + 0.7], l: [0.75, 2.6, ROADZ + 0.95], f: 40 }]); c.shake(0.25, 10);
    big(c, '💡💡💡', 'white', 0.2, tB);
  } else {
    scene(c); c.sfx('aww', tB + 0.3, 0.4);
    c.track('neusa', [{ t: 0, p: [-3.0, 0.12, -7.3], ry: 0.45, a: 'idle', e2: 'happy' }]);
    c.frame('neusa', { yaw: 0, d: 2.9, h: 1.6, up: 0.2, f: 44, to: { d: 2.6 }, t0: tB - 0.25 });
    big(c, '“TÔ BEM, MÃE”', 'green', tB - 0.1, c.dur);
  }
};

SHOTS.s08 = (c) => {
  const t = c.t; const tN = c.at('não piscou'); c.sfx('crickets', 0, 0.4);
  if (t < tN - 0.3) {
    scene(c, { truck: { x: truckX(t, 0, tN + 1, -40, 10), on: 1 } });
    c.cam([{ t: 0, p: [-1.2, 2.45, -8.5], l: [-14, 1.2, ROADZ], f: 28 }, { t: tN, p: [-1.1, 2.4, -8.2], l: [0, 1.2, ROADZ], f: 26 }]);
    big(c, 'SEXTA-FEIRA', 'blue', 0.1, tN);
  } else {
    scene(c); c.sfx('dramatic', tN, 0.5);
    c.track('neusa', [{ t: 0, p: [-3.0, 0.12, -7.3], ry: 0.45, a: 'idle', e2: 'worried' }]);
    c.frame('neusa', { yaw: 0, d: 2.8, h: 1.6, up: 0.2, f: 44, to: { d: 2.4 }, t0: tN - 0.3 });
    if (t > tN) { const k = ease.oo(prog(t, tN, tN + 0.25)); c.ui(stamp('NÃO PISCOU', { top: 1330, size: 96, s: 1.4 - 0.4 * k, a: k })); }
  }
};

SHOTS.s09 = (c) => {
  const t = c.t; const tM = c.at('de manhã'); const tO = c.at('motor');
  if (t < tM - 0.2) {
    scene(c, { cycle: 0.76 }); c.sfx('crickets', 0, 0.4);
    c.track('neusa', [{ t: 0, p: [0.3, 0.48, -8.15], ry: 0.2, a: 'sit', e2: 'tired' }]);
    c.frame('neusa', { yaw: 0.1, d: 3.6, h: 1.1, up: 0.4, f: 46, to: { d: 3.2 }, t1: tM });
    big(c, 'A NOITE INTEIRA', 'white', 0.2, tM - 0.2);
  } else {
    scene(c, { cycle: 0.02, lamp: 0, truck: { x: truckX(t, tM - 0.2, tO + 0.6, -25, 1.5), z: 17.5, ry: PI, on: 1 } }); c.sfx('engine', tO - 0.6, 0.6); c.sfx('pad', tO, 0.3);
    const up = t > tO + 0.2;
    c.track('neusa', [{ t: 0, p: up ? [0.3, 0.12, -7.4] : [0.3, 0.48, -8.15], ry: 0.1, a: up ? 'idle' : 'sit', e2: up ? 'surprised' : 'tired' }]);
    if (t < tO + 0.2) c.cam([{ t: tM - 0.2, p: [2.2, 2.0, -3.4], l: [0.4, 1.2, -8.0], f: 46 }, { t: tO + 0.2, p: [2.0, 2.0, -3.8], l: [0.4, 1.2, -8.0], f: 46 }]);
    else c.cam([{ t: tO + 0.2, p: [1.6, 2.4, -8.7], l: [-1, 1.6, 17], f: 40 }, { t: c.dur, p: [1.6, 2.35, -8.6], l: [-1, 1.6, 17], f: 36 }]);
    big(c, '🌅 DE MANHÃ', 'gold', tM - 0.1, tO + 0.3);
    big(c, 'O CAMINHÃO DELE', 'gold', tO + 0.3, c.dur);
  }
};

SHOTS.s10 = (c) => {
  const t = c.t; scene(c, { cycle: 0.12, lamp: 0 }); const tJ = c.at('jantar'); c.sfx('pad', 0, 0.35); c.sfx('aww', tJ + 0.4, 0.4);
  c.track('ze', [{ t: 0, p: [0.0, 0.12, -6.55], ry: PI, a: 'hug', e2: 'happy' }]);
  c.track('neusa', [{ t: 0, p: [0.0, 0.12, -7.75], ry: 0, a: 'hug', e2: t < tJ ? 'cry' : 'happy' }]);
  c.frame([0, 0.12, -7.2], { yaw: 1.0, d: 3.9, h: 1.6, up: 0.3, f: 46, drop: 0.1, to: { d: 3.3 } });
  big(c, '🍲 JANTAR TODO DIA', 'green', tJ - 0.1, c.dur);
  c.state.fade = prog(t, c.dur - 0.35, c.dur);
};
