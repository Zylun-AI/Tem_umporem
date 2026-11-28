// LONGO: "E se a humanidade tivesse que recomeçar no alto das montanhas?" — palito, 1920x1080.
// Cenário novo: 'mountain' (engine/envs10.js): vila em volta da origem, lago do glaciar atrás (crista z≈-60, y≈21), terraços na frente (z>30).
// Também: street (flashback do mar subindo), outro.
import { clamp, lerp, ease, PI, prog, stamp, bigNum, pop, seeded, subBtn } from '/engine/kit.js';
export const SHOTS = {};
const P0 = { num: null, flag: false };
export const CAST = {
  jade: { style: 'palito', ...P0, shirt: 0xff7a1a, trim: 0x1f3d7a, shorts: 0x2b3a55, hair: 'lia', cap: 0xff7a1a, scale: 0.96 },
  tome: { style: 'palito', ...P0, shirt: 0x8a5a32, trim: 0xd62828, shorts: 0x3a3a3a, hair: 'old', cap: 0x6a4a2a },
  ines: { style: 'palito', ...P0, shirt: 0xf4f4f4, trim: 0x2aa198, shorts: 0x2aa198, hair: 'lia', scale: 0.96 },
  dudu: { style: 'palito', ...P0, shirt: 0xd62828, trim: 0xffd21f, shorts: 0x222a44, cap: 0x2a6ad6, scale: 0.66 },
  duduA: { style: 'palito', ...P0, shirt: 0xd62828, trim: 0xffd21f, shorts: 0x222a44, cap: 0x2a6ad6, scale: 1.0 },
};
const title = (c, txt, t0, o = {}) => { if (c.t < t0) return; const s = pop(c.t, t0, 0.3) || 1; c.ui(`<div class="abs" style="left:0;right:0;top:${o.top ?? 70}px;text-align:center;transform:scale(${s})"><div style="display:inline-block;background:${o.bg ?? '#d62828'};border:7px solid #fff;border-radius:22px;padding:6px 60px;font-weight:900;font-size:${o.size ?? 86}px;color:#fff;text-shadow:0 5px 0 rgba(0,0,0,.35)">${txt}</div></div>`); };
const card = (html, o = {}) => `<div class="abs" style="left:${o.x ?? 960}px;top:${o.y ?? 150}px;transform:translate(-50%,0) scale(${o.s ?? 1});opacity:${o.a ?? 1};background:rgba(10,14,28,.88);border:5px solid ${o.b ?? '#7ab8ff'};border-radius:26px;padding:22px 44px;color:#fff;font-weight:900;font-size:${o.size ?? 50}px;text-align:center;white-space:nowrap">${html}</div>`;
const big = (c, txt, t0, o = {}) => { if (c.t < t0) return; c.ui(bigNum(txt, o.x ?? 960, o.y ?? 250, { size: o.size ?? 130, color: o.color ?? '#ffd21f', glow: o.glow ?? 'rgba(255,210,31,.6)', s: pop(c.t, t0, 0.3) || 1 })); };
const cards = (c, list, y = 90, b = '#7ab8ff') => list.forEach(([w, txt, x], i) => { const t0 = typeof w === 'number' ? w : c.at(w); if (c.t > t0) c.ui(card(txt, { x: x ?? (560 + i * 800), y, size: 46, b, s: pop(c.t, t0, 0.25) || 1 })); });
const at = (c, s) => c.at(s);
const M = (c, p = {}) => { hideProps(); c.env('mountain', { tod: 'day', plant: 1, ...p }); };
const gy = (c, x, z) => c.ENV.mountain.g.userData.H(x, z);
const smoke = (c, k = 0.5) => { for (const [x, z] of [[-7.6, -6.8], [-1.1, -11.8], [6.4, -10.8]]) c.puffs([x, 4.1, z], k, { color: 0xbbbbbb, rise: 4, grow: 2, spread: 1, op: 0.35 }); };
// figurantes na praça (raio < 6)
const plazaPeople = (c, n, o = {}) => { const R = seeded(o.seed || 5); for (let i = 0; i < n; i++) { const a = (i / n) * PI * 2 + R() * 0.3, r = (o.r0 ?? 3.2) + R() * (o.dr ?? 2.4); const x = Math.sin(a) * r + (o.cx ?? 0), z = Math.cos(a) * r * 0.8 + (o.cz ?? 0);
  const jump = o.jump ? Math.abs(Math.sin(c.t * 2.4 + i * 0.9)) * 0.5 : 0; c.mini(i, { p: [x, jump, z], ry: o.ry ?? Math.atan2(-x, -z) + (o.dry ?? 0), a: typeof o.a === 'function' ? o.a(i) : (o.a || 'idle'), e: o.e || 'neutral', s: 0.95 * (o.kids && i % 3 === 0 ? 0.65 : 1) }); } };
// ===== props do episódio =====
let PR = null;
function props(c) {
  if (PR) return PR; const T = c.THREE; const g = new T.Group(); c.scene.add(g);
  const box = (par, w, h, d, col, x, y, z) => { const m = new T.Mesh(new T.BoxGeometry(w, h, d), new T.MeshLambertMaterial({ color: col })); m.position.set(x, y, z); par.add(m); return m; };
  const mkLlama = (col) => { const l = new T.Group(); g.add(l); box(l, 0.5, 0.5, 1.2, col, 0, 1.0, 0); const nk = new T.Group(); nk.position.set(0, 1.15, 0.5); l.add(nk); box(nk, 0.26, 0.9, 0.26, col, 0, 0.42, 0.05); box(nk, 0.28, 0.26, 0.45, col, 0, 0.9, 0.2);
    box(nk, 0.07, 0.22, 0.07, col, -0.08, 1.12, 0.1); box(nk, 0.07, 0.22, 0.07, col, 0.08, 1.12, 0.1); box(nk, 0.05, 0.06, 0.02, 0x111111, -0.1, 0.95, 0.43); box(nk, 0.05, 0.06, 0.02, 0x111111, 0.1, 0.95, 0.43);
    const legs = []; for (const [lx, lz] of [[-0.16, -0.45], [0.16, -0.45], [-0.16, 0.45], [0.16, 0.45]]) { const lg = new T.Group(); lg.position.set(lx, 0.78, lz); l.add(lg); box(lg, 0.13, 0.78, 0.13, col, 0, -0.39, 0); legs.push(lg); }
    box(l, 0.16, 0.2, 0.16, col, 0, 1.15, -0.65); const bow = box(l, 0.3, 0.12, 0.05, 0xff4fa3, 0, 1.75, 0.68); const pack = new T.Group(); l.add(pack);
    for (const sx of [-0.38, 0.38]) { const r = new T.Mesh(new T.TorusGeometry(0.28, 0.1, 8, 16), new T.MeshLambertMaterial({ color: 0x202326 })); r.position.set(sx, 1.05, 0); r.rotation.y = PI / 2; pack.add(r); }
    return { l, legs, nk, bow, pack }; };
  const pip = mkLlama(0xf2ede2), l2 = mkLlama(0x8a5a32), l3 = mkLlama(0xc9a77a);
  // régua no lago
  const rul = new T.Group(); g.add(rul); box(rul, 0.25, 9, 0.12, 0xffffff, 0, 4.5, 0); for (let i = 0; i < 18; i++) box(rul, i % 2 ? 0.3 : 0.45, 0.08, 0.14, i % 4 === 0 ? 0xd62828 : 0x111111, 0, 0.5 * i, 0.02);
  // fogueira da festa / fogão
  const fire = new T.Group(); g.add(fire); for (let i = 0; i < 5; i++) { const lg = box(fire, 0.12, 0.12, 1.0, 0x5a3b26, 0, 0.08, 0); lg.rotation.y = i * 0.63; }
  const fl = new T.Mesh(new T.ConeGeometry(0.35, 1.0, 8), new T.MeshBasicMaterial({ color: 0xffa020 })); fl.position.y = 0.6; fire.add(fl);
  const pot = new T.Group(); g.add(pot); const pb = new T.Mesh(new T.CylinderGeometry(0.38, 0.32, 0.45, 18), new T.MeshLambertMaterial({ color: 0x9aa0a6 })); pb.position.y = 0.95; pot.add(pb); box(pot, 0.85, 0.05, 0.1, 0x222222, 0, 1.2, 0);
  const valve = new T.Mesh(new T.CylinderGeometry(0.05, 0.05, 0.18, 8), new T.MeshLambertMaterial({ color: 0x222222 })); valve.position.y = 1.3; pot.add(valve);
  for (const [a, b] of [[-0.35, -0.35], [0.35, -0.35], [0, 0.4]]) box(pot, 0.1, 0.7, 0.1, 0x333333, a, 0.35, b);
  // batatas (chuño)
  const pots = new T.Group(); g.add(pots); const R = seeded(8); for (let i = 0; i < 40; i++) { const m = new T.Mesh(new T.SphereGeometry(0.13, 8, 6), new T.MeshLambertMaterial({ color: 0x9a7a5a })); m.scale.set(1.2, 0.8, 1); m.position.set((R() - 0.5) * 2.4, 0.08, (R() - 0.5) * 1.6); pots.add(m); }
  box(pots, 2.8, 0.04, 2.0, 0x6a8a3a, 0, 0.01, 0);
  PR = { g, pip, l2, l3, rul, fire, fl, pot, valve, pots, potM: pots.children }; return PR;
}
function hideProps() { if (!PR) return; [PR.pip.l, PR.l2.l, PR.l3.l, PR.rul, PR.fire, PR.pot, PR.pots].forEach(o => o.visible = false); }
const llama = (c, which, p, ry, o = {}) => { const P = props(c); const L = P[which]; L.l.visible = true; L.l.position.set(...p); L.l.rotation.y = ry; const w = o.walk ? c.t * 7 : 0; L.legs.forEach((lg, i) => lg.rotation.x = o.walk ? Math.sin(w + (i % 2 ? PI : 0) + (i > 1 ? PI : 0)) * 0.45 : 0);
  L.nk.rotation.x = o.look ?? Math.sin(c.t * 0.9) * 0.08; L.bow.visible = which === 'pip'; L.pack.visible = !!o.pack; };
const ruler = (c, ly) => { const P = props(c); P.rul.visible = true; P.rul.position.set(13, ly - 4, -63.5); };
const fireAt = (c, p) => { const P = props(c); P.fire.visible = true; P.fire.position.set(...p); P.fl.scale.set(1, 0.85 + Math.sin(c.t * 13) * 0.15, 1); c.glow([p[0], p[1] + 0.8, p[2]], 0xff9a40, 7); };
const lakeY = (k) => lerp(13.5, 18.6, k);
const water = (c, x, z) => Math.max(gy(c, x, z), 0);
const CREST = (c, x) => [x, gy(c, x, -59.2), -59.2];
const dark = (c, k = 1) => c.ui(`<div class="abs" style="left:0;top:0;width:1920px;height:1080px;box-shadow:inset 0 0 300px 140px rgba(0,0,10,${0.75 * k});pointer-events:none"></div>`);
const sepia = (c) => c.ui(`<div class="abs" style="left:0;top:0;width:1920px;height:1080px;background:rgba(120,80,30,.28);mix-blend-mode:multiply;box-shadow:inset 0 0 260px 90px rgba(40,25,10,.7);pointer-events:none"></div>`);

// ===== rua inundada (flashback) =====
let SEA = null; const streetSea = (c, lvl) => { c.env('street', { tod: 'gray' }); if (!SEA) { const T = c.THREE; SEA = new T.Mesh(new T.PlaneGeometry(200, 800), new T.MeshLambertMaterial({ color: 0x3a6a8a, emissive: 0x0a2030, transparent: true, opacity: 0.92 })); SEA.rotation.x = -PI / 2; c.ENV.street.g.add(SEA); }
  SEA.position.set(0, lvl, -300 + 0); SEA.visible = lvl > -0.5; };

// ================= GANCHO =================
SHOTS.b01 = (c) => {
  const t = c.t; const tC = at(c, 'Ela fica'), tQ = at(c, 'quinhentas'); c.sfx('wind', 0, 0.45); c.sfx('riser', 0.2, 0.3); c.sfx('boom', tQ, 0.5);
  M(c, { llamas: 4 }); smoke(c);
  if (t < tQ - 0.4) { c.cam([{ t: 0, p: [40, 55, 110], l: [0, 6, -30], f: 44 }, { t: tQ, p: [22, 34, 70], l: [0, 4, -25], f: 44 }]); c.chip(960, 90, '🏔️ VILA CONDOR', 'gold', 0.5, tC + 0.2); if (t > at(c, 'quatro mil')) big(c, '4.200 m DE ALTURA', at(c, 'quatro mil'), { y: 250, size: 110 }); }
  else { c.cam([{ t: tQ - 0.4, p: [0, 3.0, 14], l: [0, 1.5, 0], f: 50 }, { t: c.dur, p: [0, 2.8, 11.5], l: [0, 1.5, 0], f: 50 }]); plazaPeople(c, 26, { a: (i) => i % 3 ? 'idle' : 'wave', e: 'happy', kids: true, dry: PI, ry: 0 });
    c.track('jade', [{ t: 0, p: [0, 0, 2], ry: 0, a: 'wave', e2: 'happy' }]); title(c, 'A CASA DE 500 PESSOAS', tQ + 0.1, { size: 78, bg: '#2a4ab0' }); }
};

SHOTS.b02 = (c) => {
  const t = c.t; const tL = at(c, 'lago de gelo'), tP = at(c, 'parede de pedra'), tS = at(c, 'se soltou');
  const cv = clamp((t - tS + 0.4) / 2.2); M(c, { calve: cv, lake: 1, wave: clamp((cv - 0.75) * 1.6) }); c.sfx('wind', 0, 0.4); c.sfx('crash', tS + 0.2, 0.7); c.sfx('boom', tS + 1.3, 0.8);
  if (t < tS - 0.4) { c.cam([{ t: 0, p: [-30, 34, -40], l: [4, 20, -82], f: 46 }, { t: tS, p: [-26, 33, -46], l: [4, 20, -82], f: 46 }]); c.tag([0, 24, -59.5], 'PAREDE DE PEDRA SOLTA', 'white', tP, 1e9); c.chip(960, 90, '🧊 LAGO DO GLACIAR', 'blue', tL, tS - 0.4); }
  else { c.cam([{ t: tS - 0.4, p: [-22, 30, -58], l: [6, 28, -94], f: 44 }, { t: c.dur, p: [-20, 29, -60], l: [6, 22, -92], f: 44 }]); if (t > tS + 1.3) c.shake(0.6, 8); title(c, 'O GELO SE SOLTOU', tS + 0.1, { bg: '#d62828' }); }
};

SHOTS.b03 = (c) => {
  const t = c.t; const tC = at(c, 'em cima das casas'), tV = at(c, 'voltar dois anos'); c.sfx('water', 0, 0.6); c.sfx('dramatic', tC, 0.5); c.sfx('whoosh', tV, 0.5);
  M(c, { lake: 1, wave: 0.85, spill: 0.15 + 0.25 * prog(t, 0, tV) });
  c.cam([{ t: 0, p: [3, 4.5, 15], l: [0, 12, -50], f: 48 }, { t: tV, p: [2, 4.0, 12], l: [0, 12, -50], f: 48 }]);
  plazaPeople(c, 22, { a: (i) => i % 2 ? 'panic' : 'pointup', e: 'scared', kids: true, ry: PI });
  c.track('dudu', [{ t: 0, p: [1.2, 0, 4], ry: PI, a: 'lookup', e2: 'scared' }]);
  if (t > tC && t < tV) { const k = ease.oo(prog(t, tC, tC + 0.25)); c.ui(stamp('EM CIMA DAS CASAS', { top: 360, size: 100, s: 1.4 - 0.4 * k, a: k })); }
  if (t > tV) { c.state.fade = prog(t, tV, tV + 0.6) * 0.85; big(c, '⏪ 2 ANOS ANTES', tV + 0.1, { y: 540, size: 140, color: '#fff', glow: 'rgba(255,255,255,.5)' }); }
};

// ================= COMEÇO =================
SHOTS.b04 = (c) => {
  const t = c.t; const tM = at(c, 'metros por mês'), tP = at(c, 'As praias'); c.sfx('waves', 0, 0.6); c.sfx('siren', tP, 0.3);
  const lvl = lerp(-0.6, 1.4, prog(t, tP - 1, c.dur)); streetSea(c, lvl);
  for (let i = 0; i < 14; i++) c.mini(i, { p: [-6 + (i % 7) * 2, 0, 6 - Math.floor(i / 7) * 2 + ((t * 2.5 + i) % 6) * 0], ry: PI, a: 'run', e: 'scared' });
  c.cam([{ t: 0, p: [3, 3.2, 14], l: [0, 1.6, -20], f: 50 }, { t: c.dur, p: [3, 4.2, 12], l: [0, 1.2, -20], f: 50 }]);
  big(c, '🌊 METROS POR MÊS', tM, { y: 230, size: 110, color: '#7ad8ff', glow: 'rgba(120,216,255,.6)' });
  cards(c, [['As praias', '🏖️ PRAIAS', 460], ['os portos', '⚓ PORTOS', 960], ['cidades inteiras', '🏙️ CIDADES', 1460]], 820, '#ff3b30');
};

SHOTS.b05 = (c) => {
  const t = c.t; const tA = at(c, 'mais alto'), tN = at(c, 'montanhas'); c.sfx('wind', 0, 0.5); c.sfx('whoosh', tA, 0.4);
  M(c, { sea: 0.3 + 0.5 * prog(t, 0, c.dur), more: false, llamas: 0 });
  if (t < tN - 0.3) { c.cam([{ t: 0, p: [0, 30, 110], l: [0, -170, 360], f: 50 }, { t: tN, p: [0, 26, 100], l: [0, -175, 360], f: 50 }]); if (t > tA) title(c, 'QUANTO MAIS ALTO, MAIS SEGURO', tA, { size: 72, bg: '#2a6ad6' }); }
  else { c.cam([{ t: tN - 0.3, p: [0, 30, 80], l: [0, 20, -120], f: 46 }, { t: c.dur, p: [0, 26, 60], l: [0, 22, -120], f: 46 }]); title(c, '🏔️ AS MONTANHAS', tN, { size: 80, bg: '#2a8a4a' }); }
};

SHOTS.b06 = (c) => {
  const t = c.t; const tL = at(c, 'La Rinconada'), tC = at(c, 'cinco mil e cem'), tO = at(c, 'o lugar mais alto'); c.sfx('pop', tL, 0.5); c.sfx('ding', tC, 0.5);
  M(c, {}); c.cam([{ t: 0, p: [14, 2.4, 25], l: [-40, 80, -330], f: 40 }, { t: c.dur, p: [14, 2.3, 23], l: [-40, 90, -330], f: 40 }]);
  c.track('jade', [{ t: 0, p: [11.2, 0, 19.5], ry: PI + 0.3, a: 'pointup', e2: 'happy' }]);
  if (t > tL) c.ui(card('🇵🇪 LA RINCONADA, PERU', { y: 90, size: 54, b: '#ffd21f', s: pop(t, tL, 0.25) || 1 }));
  big(c, '≈ 5.100 m', tC, { y: 300, size: 150 });
  if (t > tO) c.ui(card('A CIDADE MAIS ALTA DO MUNDO', { y: 840, size: 46, b: '#7ab8ff', s: pop(t, tO, 0.25) || 1 }));
};

SHOTS.b07 = (c) => {
  const t = c.t; const tT = at(c, 'O Seu Tomé'), tI = at(c, 'A doutora'), tD = at(c, 'E o Dudu'); for (const x of [0.3, tT, tI, tD]) c.sfx('pop', x, 0.5);
  M(c, { llamas: 3 }); smoke(c, 0.4);
  if (t < tT) { c.track('jade', [{ t: 0, p: [2, 0, 1], ry: 0.3, a: 'point', e2: 'happy', hold: 'paper' }]); c.frame('jade', { yaw: 0.35, d: 3.4, h: 1.45, f: 46, to: { d: 2.9 } }); c.chip(1300, 500, '🪨 JADE · GEÓLOGA', 'gold', 0.3, 1e9); }
  else if (t < tI) { const y = -0.2 - 2.2; c.track('tome', [{ t: 0, p: [3, y, 35.2], ry: 0.3, a: 'idle', e2: 'happy', hold: 'wrench' }]); c.frame('tome', { yaw: 0.4, d: 3.2, h: 1.45, f: 46, to: { d: 2.8 }, t0: tT }); c.chip(1300, 500, '🥔 SEU TOMÉ · AGRICULTOR', 'green', tT, 1e9); }
  else if (t < tD) { c.track('ines', [{ t: 0, p: [-3, 0, -2], ry: 0.4, a: 'idle', e2: 'happy', hold: 'bandage' }]); c.frame('ines', { yaw: 0.3, d: 3.2, h: 1.45, f: 46, to: { d: 2.8 }, t0: tI }); c.chip(1300, 500, '🩺 DRA. INÊS · MÉDICA', 'blue', tI, 1e9); }
  else { c.track('dudu', [{ t: 0, p: [3.7, 0, 6.2], ry: 0.5, a: 'wave', e2: 'happy' }]); llama(c, 'pip', [2.3, 0, 7.3], PI / 2 + 0.6); c.frame([3.9, 0, 6.3], { yaw: 0.6, d: 4.0, h: 1.0, f: 46, to: { d: 3.4 }, t0: tD }); c.chip(1300, 500, '🦙 DUDU · 10 ANOS + PIPOCA', 'red', tD, 1e9); }
};

SHOTS.b08 = (c) => {
  const t = c.t; const tO = at(c, 'bem menos oxigênio'), tD = at(c, 'Dá dor'), tM = at(c, 'mal da altitude'); c.sfx('wind', 0, 0.4); c.sfx('heartbeat', tD, 0.5);
  M(c, {});
  c.track('tome', [{ t: 0, p: [-1, 0, 3], ry: 0.3, a: 'tired', e2: 'tired' }]); c.track('jade', [{ t: 0, p: [1.2, 0, 3.2], ry: -0.3, a: t < tD ? 'walk' : 'hurt', e2: 'worried', y: 0 }]);
  c.cam([{ t: 0, p: [0.2, 1.7, 8], l: [0, 1.3, 3], f: 46 }, { t: c.dur, p: [0.2, 1.6, 6.8], l: [0, 1.3, 3], f: 46 }]);
  big(c, 'O₂ ⬇', tO, { x: 960, y: 200, size: 150, color: '#7ad8ff', glow: 'rgba(120,216,255,.6)' });
  cards(c, [['dor de cabeça', '🤕 DOR DE CABEÇA', 420], ['enjoo', '🤢 ENJOO', 960], ['falta de fôlego', '😮‍💨 SEM FÔLEGO', 1500]], 820, '#ff3b30');
  if (t > tM) title(c, 'MAL DA ALTITUDE', tM, { top: 380 });
};

SHOTS.b09 = (c) => {
  const t = c.t; const tR = at(c, 'regra número um'), tS = at(c, 'Sobe devagar'); c.sfx('ding', tR, 0.5);
  M(c, {});
  if (t < tS - 0.2) { c.track('ines', [{ t: 0, p: [0, 0, 1], ry: 0, a: 'point', e2: 'neutral' }]); plazaPeople(c, 14, { cz: 6.5, cx: 2.5, r0: 1.6, dr: 1.4, a: 'idle', ry: PI, e: 'neutral' }); c.frame('ines', { yaw: -0.8, d: 3.6, h: 1.4, f: 46, to: { d: 3.1 } }); title(c, 'REGRA Nº 1: NINGUÉM SOBE CORRENDO', tR, { size: 64 }); }
  else { const k = prog(t, tS, c.dur); for (let i = 0; i < 8; i++) { const z = 60 - i * 3 - k * 6; c.mini(i, { p: [-30 - i * 0.3, gy(c, -30 - i * 0.3, z), z], ry: PI, a: 'walk', e: 'neutral' }); }
    c.cam([{ t: tS - 0.2, p: [-18, gy(c, -18, 45) + 8, 60], l: [-30, gy(c, -30, 50) + 1, 50], f: 44 }, { t: c.dur, p: [-17, gy(c, -17, 44) + 7.5, 58], l: [-30, gy(c, -30, 48) + 1, 48], f: 44 }]);
    cards(c, [[tS, '🐢 DEVAGAR', 380], ['alguns dias', '📅 ALGUNS DIAS EM CADA ALTURA', 1180]], 760, '#2fa35a'); }
};

// ================= VANTAGENS =================
SHOTS.b10 = (c) => {
  const t = c.t; const tN = at(c, 'nunca chega'), tG = at(c, 'E o gelo'); c.sfx('water', tG, 0.5);
  if (t < tG - 0.2) { M(c, { sea: 0.7 }); c.cam([{ t: 0, p: [0, 8, 34], l: [0, -150, 260], f: 44 }, { t: tG, p: [0, 7, 30], l: [0, -150, 260], f: 44 }]); c.track('jade', [{ t: 0, p: [-1.5, gy(c, -1.5, 29.5), 29.5], ry: 0, a: 'idle', e2: 'happy' }]); if (t > tN) title(c, '🌊 O MAR NUNCA CHEGA', tN, { bg: '#2fa35a' }); }
  else { M(c, { lake: 0.85 }); c.cam([{ t: tG - 0.2, p: [-24, 30, -52], l: [0, 22, -90], f: 46 }, { t: c.dur, p: [-20, 29, -55], l: [0, 22, -90], f: 46 }]); c.chip(960, 90, '💧 ÁGUA LIMPA O ANO TODO', 'blue', tG, 1e9); }
};

SHOTS.b11 = (c) => {
  const t = c.t; const tD = at(c, 'degraus'), tS = at(c, 'segura a terra');
  M(c, {}); const y1 = -0.2 - 2.2, y2 = -0.2 - 4.4;
  c.track('tome', [{ t: 0, p: [4, y1, 35.0], ry: PI / 2, a: 'crank', e2: 'happy', hold: 'wrench' }]);
  for (let i = 0; i < 5; i++) c.mini(i, { p: [-8 + i * 3, i % 2 ? y2 : y1, i % 2 ? 38.5 : 35.0], ry: PI / 2, a: 'crank', e: 'happy' });
  if (t < tD) c.cam([{ t: 0, p: [26, 10, 55], l: [0, -4, 35], f: 46 }, { t: tD, p: [22, 8, 50], l: [0, -4, 35], f: 46 }]);
  else c.cam([{ t: tD, p: [9, 1.0, 40.5], l: [3.5, -1.2, 35], f: 46 }, { t: c.dur, p: [8, 0.6, 39.5], l: [3.5, -1.2, 35], f: 46 }]);
  if (t > tD) c.ui(card('TERRAÇOS (ANDENES) — IGUAL OS INCAS', { y: 80, size: 46, b: '#2fa35a', s: pop(t, tD, 0.25) || 1 }));
  cards(c, [['segura a terra', '🟫 SEGURA A TERRA', 420], ['guarda o calor', '☀️ GUARDA O CALOR', 960], ['não deixa a chuva', '🌧️ CONTRA A CHUVA', 1500]], 760, '#ffd21f');
};

SHOTS.b12 = (c) => {
  const t = c.t; const tN = at(c, 'À noite'), tD = at(c, 'de dia'), tC = at(c, 'chuño'), tQ = at(c, 'quinhentos anos'); c.sfx('ice', tN, 0.4); c.sfx('ding', tQ, 0.6);
  const night = t > tN - 0.2 && t < tD - 0.1; M(c, { tod: night ? 'night' : 'day', frost: night ? 0.6 : 0 }); const P = props(c); P.pots.visible = true; P.pots.position.set(-3, 0, 6);
  P.potM.forEach((m, i) => { if (m.geometry.type === 'SphereGeometry') m.material.color.set(night ? 0xdfe8f0 : (t > tD ? 0x6a5a4a : 0x9a7a5a)); });
  c.track('tome', [{ t: 0, p: [-3, 0, 7.6], ry: PI, a: 'crouch', e2: 'happy' }]);
  c.cam([{ t: 0, p: [-0.6, 2.6, 10.5], l: [-3, 0.4, 6], f: 46 }, { t: c.dur, p: [-0.8, 2.3, 9.6], l: [-3, 0.4, 6], f: 46 }]);
  cards(c, [[tN, '🌙 CONGELA', 600], [tD, '☀️ SECA', 1320]], 80, '#7ab8ff');
  if (t > tC && t < tQ - 0.2) title(c, 'CHUÑO = DURA ANOS', tC, { top: 300, bg: '#8a5a32' });
  big(c, '500 ANOS', tQ, { y: 330, size: 150 });
  if (night) dark(c, 0.4);
};

SHOTS.b13 = (c) => {
  const t = c.t; const tL = at(c, 'lã'), tM = at(c, 'mascote'); c.sfx('footsteps', 0, 0.4);
  M(c, { llamas: 5 }); const k = prog(t, 0, c.dur); const z = lerp(12, 2, k);
  c.track('dudu', [{ t: 0, p: [-1.2, 0, 12], ry: PI, a: 'walk', e2: 'happy' }, { t: c.dur, p: [-1.2, 0, 2], ry: PI, a: 'walk', e2: 'happy' }]);
  llama(c, 'pip', [0.2, 0, z + 0.3], PI, { walk: true }); llama(c, 'l2', [1.6, 0, z + 2.0], PI, { walk: true, pack: true });
  c.cam([{ t: 0, p: [5, 2.2, 4], l: [-0.5, 1.0, 10], f: 46 }, { t: c.dur, p: [4.2, 2.0, -5.5], l: [-0.5, 1.0, 0.8], f: 46 }]);
  cards(c, [['carregam peso', '📦 CARGA', 460], ['lã', '🧶 LÃ', 960], ['não reclamam', '😌 ZERO RECLAMAÇÃO', 1460]], 80, '#ffd21f');
  if (t > tM) title(c, '🦙 PIPOCA, A MASCOTE', tM, { top: 740, size: 70, bg: '#ff4fa3' });
};

SHOTS.b14 = (c) => {
  const t = c.t; const tE = at(c, 'mais estrelas'); c.sfx('cheer', 0.3, 0.5); c.sfx('crackle', 0, 0.4);
  M(c, { tod: t < tE - 0.3 ? 'dusk' : 'night', power: 1 }); fireAt(c, [0, 0, 0]);
  plazaPeople(c, 30, { a: (i) => i % 2 ? 'dance' : 'clap', e: 'happy', kids: true, jump: true, r0: 2.6, dr: 2.8 });
  c.track('dudu', [{ t: 0, p: [1.6, 0, 4.0], ry: PI + 0.3, a: 'cheer', e2: 'happy' }]); llama(c, 'pip', [2.8, 0, 4.4], PI + 0.6);
  if (t < tE - 0.3) { c.cam([{ t: 0, p: [3, 3, 11], l: [0, 1.2, 0], f: 46 }, { t: tE, p: [2.4, 2.8, 9.5], l: [0, 1.2, 0], f: 46 }]); title(c, '🎉 1º ANO · 1ª COLHEITA', 0.3, { bg: '#2fa35a' }); }
  else { c.cam([{ t: tE - 0.3, p: [0, 2, 14], l: [0, 60, -100], f: 50 }, { t: c.dur, p: [0, 2, 14], l: [0, 75, -100], f: 50 }]); title(c, '✨ MAIS ESTRELAS DO QUE NUNCA', tE, { bg: '#2a2a6a' }); }
};

// ================= PREÇO =================
SHOTS.b15 = (c) => {
  const t = c.t; const tS = at(c, 'seis graus'), tG = at(c, 'De noite a geada'), tE = at(c, 'as estufas'); c.sfx('wind', 0, 0.5); c.sfx('ice', tG, 0.5);
  if (t < tE - 0.2) { const fr = prog(t, tG, tG + 1.5); M(c, { tod: t < tG ? 'day' : 'dusk', frost: fr }); const y1 = -0.2 - 2.2;
    c.track('tome', [{ t: 0, p: [2, y1, 35.0], ry: PI + 0.4, a: fr > 0.5 ? 'kneel' : 'idle', e2: fr > 0.5 ? 'sad' : 'worried' }]);
    c.cam([{ t: 0, p: [6, 1.2, 39.5], l: [1.5, -1.4, 34.5], f: 46 }, { t: tE, p: [5.4, 1.0, 38.8], l: [1.5, -1.4, 34.5], f: 46 }]);
    big(c, '−6,5 °C A CADA 1.000 m', tS, { y: 200, size: 100, color: '#7ad8ff', glow: 'rgba(120,216,255,.6)' }); if (t > tG) title(c, '❄️ GEADA', tG, { top: 740, bg: '#2a6ad6' }); }
  else { M(c, { tod: 'dusk', frost: 0, power: 1 }); c.track('ines', [{ t: 0, p: [-15.6, 0, 9], ry: -PI / 2 - 0.4, a: 'point', e2: 'happy' }]);
    c.cam([{ t: tE - 0.2, p: [-12, 2.6, 17.5], l: [-20, 0.8, 9], f: 46 }, { t: c.dur, p: [-12.4, 2.4, 16.5], l: [-20, 0.8, 9], f: 46 }]); title(c, '🌱 ESTUFAS: A HORTA QUE NUNCA PARA', tE, { size: 66, bg: '#2fa35a' }); }
};

SHOTS.b16 = (c) => {
  const t = c.t; const tO = at(c, 'oitenta e seis'), tF = at(c, 'o feijão'), tP = at(c, 'Panela de pressão'); c.sfx('crackle', 0, 0.4); c.sfx('sizzle', tP + 0.4, 0.4);
  M(c, {}); const P = props(c); fireAt(c, [4.2, 0, -1.5]); P.pot.visible = true; P.pot.position.set(4.2, 0, -1.5); P.valve.visible = t > tP; P.pot.scale.setScalar(t > tP ? 1.15 : 1);
  if (t > tP) c.puffs([4.2, 1.5, -1.5], 1, { color: 0xffffff, rise: 2, grow: 1, spread: 0.3, op: 0.6 }); else c.puffs([4.2, 1.2, -1.5], 0.5, { color: 0xffffff, rise: 1.5, grow: 1, spread: 0.4, op: 0.4 });
  c.track('dudu', [{ t: 0, p: [3.0, 0, -0.4], ry: PI / 2 + 0.4, a: t < tF ? 'idle' : t < tP ? 'shrug' : 'cheer', e2: t < tF ? 'neutral' : t < tP ? 'angry' : 'happy' }]);
  c.track('tome', [{ t: 0, p: [5.4, 0, -0.4], ry: -PI / 2 - 0.4, a: t < tP ? 'think' : 'point', e2: t < tP ? 'worried' : 'happy' }]);
  c.cam([{ t: 0, p: [4.2, 2.1, 5.4], l: [4.2, 1.1, -1.0], f: 46 }, { t: c.dur, p: [4.2, 1.9, 4.6], l: [4.2, 1.1, -1.0], f: 46 }]);
  big(c, '🌡️ ÁGUA FERVE A ~86 °C', tO, { y: 150, size: 96, color: '#ff8a4a', glow: 'rgba(255,138,74,.6)' });
  if (t > tF && t < tP) title(c, 'FEIJÃO DURO 😩', tF, { top: 740, bg: '#8a5a32' });
  if (t > tP) title(c, '✅ PANELA DE PRESSÃO', tP, { top: 740, bg: '#2fa35a' });
};

SHOTS.b17 = (c) => {
  const t = c.t; const tR = at(c, 'régua'), tQ = at(c, 'quase ninguém'); c.sfx('wind', 0, 0.5);
  const ly = lakeY(0.9); M(c, { lake: 0.9 }); ruler(c, ly);
  if (t < tR + 0.6) { const k = prog(t, 0, tR + 0.6); const z = lerp(-44, -54, k); c.track('jade', [{ t: 0, p: [10, gy(c, 10, -44), -44], ry: PI, a: 'walk', e2: 'neutral', hold: 'paper' }, { t: tR + 0.6, p: [10, gy(c, 10, -54), -54], ry: PI, a: 'walk', e2: 'neutral', hold: 'paper' }]);
    c.frame('jade', { yaw: 0.9, d: 4.5, h: 1.5, up: 0.6, f: 46 }); c.chip(960, 90, '📏 TODO DIA, A RÉGUA', 'gold', 0.3, 1e9); }
  else { const P = CREST(c, 11.5); c.track('jade', [{ t: 0, p: P, ry: PI + 0.3, a: 'write', e2: 'worried', hold: 'paper' }]);
    c.cam([{ t: tR + 0.6, p: [5.5, P[1] + 2.5, -55.5], l: [12, P[1] + 0.5, -61], f: 46 }, { t: c.dur, p: [6.5, P[1] + 2.3, -56.2], l: [12, P[1] + 0.5, -61], f: 46 }]); if (t > tQ) title(c, 'ELA SABE DE UMA COISA…', tQ, { top: 740, bg: '#2a2a6a', size: 70 }); }
};

// ================= CTA MEIO =================
SHOTS.b18 = (c) => {
  const t = c.t; const tI = at(c, 'inscrever'); c.sfx('pop', 0.3, 0.5); c.sfx('click', tI + 1.1, 0.8); c.sfx('ding', tI + 1.15, 0.6);
  M(c, {}); smoke(c, 0.4);
  const jy = Math.max(0, Math.sin(t * 2.2)) * 0.4; c.track('dudu', [{ t: 0, p: [-0.5, 0, 3], ry: 0.15, a: t < tI ? 'wave' : 'cheer', e2: 'happy', y: jy }]);
  llama(c, 'pip', [0.9, 0, 2.7], 0.3);
  c.cam([{ t: 0, p: [0.2, 1.3, 7.5], l: [0.2, 0.9, 3], f: 44 }, { t: c.dur, p: [0.2, 1.3, 7.0], l: [0.2, 0.9, 3], f: 44 }]);
  subBtn(c, tI);
};

// ================= O PORÉM =================
SHOTS.b19 = (c) => {
  const t = c.t; const tP = at(c, 'tem um porém'), tC = at(c, 'cedeu'), tE = at(c, 'A enxurrada'); c.sfx('dramatic', tP, 0.6); c.sfx('crash', tC, 0.6); c.sfx('water', tE, 0.7);
  if (t < at(c, 'Em 1941') - 0.2) { M(c, { lake: 1 }); c.cam([{ t: 0, p: [0, 6, 22], l: [0, 14, -50], f: 46 }, { t: c.dur, p: [0, 6, 20], l: [0, 14, -50], f: 46 }]); title(c, '⚠️ TEM UM PORÉM', tP, { size: 100 }); return; }
  M(c, { lake: lerp(1, 0.4, prog(t, tC, c.dur)), spill: prog(t, tC, c.dur), more: false, llamas: 0, plant: 0.3 });
  c.cam([{ t: at(c, 'Em 1941') - 0.2, p: [3, 6, 18], l: [0, 12, -50], f: 44 }, { t: c.dur, p: [2, 5, 14], l: [0, 10, -50], f: 44 }]);
  sepia(c); c.ui(card('📜 LAGO PALCACOCHA, PERU · 1941', { y: 80, size: 50, b: '#c9a46a' }));
  if (t > tE) title(c, 'A ENXURRADA ATINGIU HUARAZ', tE, { top: 740, size: 64, bg: '#6a4a2a' });
};

SHOTS.b20 = (c) => {
  const t = c.t; const tM = at(c, 'mais um pouco'), tA = at(c, 'A Jade avisa'); c.sfx('wind', 0, 0.5); c.sfx('tick', tM, 0.5);
  const lk = 0.9 + 0.1 * prog(t, 0, tM + 0.5); const ly = lakeY(lk); M(c, { lake: lk }); ruler(c, ly);
  if (t < tA - 0.2) { c.cam([{ t: 0, p: [9.2, ly + 3.2, -57], l: [13, ly + 0.6, -63.5], f: 40 }, { t: tA, p: [9.6, ly + 2.9, -58], l: [13, ly + 0.6, -63.5], f: 40 }]); big(c, '📏 + 1 cm POR DIA', tM, { y: 200, size: 110, color: '#ff5a4a', glow: 'rgba(255,90,74,.6)' }); }
  else { const P = CREST(c, 9); c.track('jade', [{ t: 0, p: P, ry: 0.2, a: 'shout', e2: 'scared', hold: 'paper' }]); c.frame('jade', { yaw: 0.3, d: 3.2, h: 1.45, f: 46, to: { d: 2.8 }, t0: tA - 0.2 }); title(c, 'GELO CAIU = A ONDA PASSA', at(c, 'se cair gelo'), { top: 740, size: 70 }); }
};

// ================= CLÍMAX =================
SHOTS.b21 = (c) => {
  const t = c.t; const tE = at(c, 'estrondo'), tD = at(c, 'despenca'), tO = at(c, 'outro bloco'); c.sfx('boom', tE, 0.9); c.sfx('crash', tD + 0.3, 0.8); c.sfx('ice', tO, 0.6);
  const cv = clamp((t - tD + 0.3) / 2.0);
  if (t < tD - 0.3) { M(c, { lake: 1, block: true }); plazaPeople(c, 20, { a: 'lookup', e: 'scared', ry: PI }); c.track('dudu', [{ t: 0, p: [1, 0, 4], ry: PI, a: 'lookup', e2: 'scared' }]); llama(c, 'pip', [2.2, 0, 4.3], PI);
    c.cam([{ t: 0, p: [2, 1.5, 9], l: [1, 1.6, 3], f: 46 }, { t: tD, p: [2, 1.5, 8], l: [1, 1.6, 3], f: 46 }]); if (t > tE) c.shake(0.7, 10); title(c, 'AGORA, ACONTECEU', 0.2); }
  else if (t < tO - 0.2) { M(c, { lake: 1, calve: cv, wave: clamp((cv - 0.75) * 1.4) }); c.cam([{ t: tD - 0.3, p: [-20, 31, -56], l: [6, 26, -94], f: 44 }, { t: tO, p: [-18, 30, -58], l: [6, 22, -92], f: 44 }]); c.shake(0.5, 8); }
  else { M(c, { lake: 1, block: true, wave: 0.6 }); c.cam([{ t: tO - 0.2, p: [-6, 30, -66], l: [6, 34, -97], f: 36 }, { t: c.dur, p: [-5, 30, -68], l: [6, 34, -97], f: 34 }]); c.tag([6, 41, -96], '⚠️ OUTRO BLOCO RACHANDO', 'red', tO, 1e9); c.shake(0.2, 12); }
};

SHOTS.b22 = (c) => {
  const t = c.t; const tA = at(c, 'A parede aguentou'), tN = at(c, 'não vai aguentar'); c.sfx('water', 0, 0.7); c.sfx('dramatic', tN, 0.6);
  M(c, { lake: 1, wave: 0.6 + 0.35 * prog(t, 0, tA), spill: 0.25 * prog(t, 0.3, tA) * (1 - 0.6 * prog(t, tA, tA + 2)), block: true });
  if (t < tA) { c.cam([{ t: 0, p: [-16, 24, -40], l: [0, 18, -62], f: 46 }, { t: tA, p: [-15, 22, -38], l: [0, 14, -56], f: 46 }]); }
  else { c.cam([{ t: tA, p: [0, 4, 10], l: [0, 12, -50], f: 46 }, { t: c.dur, p: [0, 3.6, 8], l: [0, 12, -50], f: 46 }]); plazaPeople(c, 20, { a: 'lookup', e: 'worried', ry: PI }); c.track('jade', [{ t: 0, p: [1.5, 0, 3], ry: PI, a: 'think', e2: 'worried' }]);
    title(c, '✅ A PAREDE AGUENTOU', tA, { bg: '#2fa35a' }); if (t > tN) title(c, '…MAS NÃO VAI AGUENTAR DE NOVO', tN, { top: 220, size: 66 }); }
};

const siphonSVG = (k) => `<svg width="760" height="480" viewBox="0 0 760 480"><rect x="40" y="60" width="300" height="220" rx="14" fill="rgba(120,200,255,.18)" stroke="#fff" stroke-width="8"/>
  <rect x="48" y="${110 + 40 * k}" width="284" height="${162 - 40 * k}" fill="#4aa8e8"/><rect x="480" y="300" width="220" height="150" rx="12" fill="rgba(120,200,255,.18)" stroke="#fff" stroke-width="8"/>
  <rect x="488" y="${442 - 60 * k}" width="204" height="${60 * k}" fill="#4aa8e8"/><path d="M 260 250 L 260 20 Q 260 0 290 0 L 400 0 Q 420 0 420 20 L 420 20" fill="none"/>
  <path d="M 250 260 L 250 30 Q 250 14 270 14 L 560 14 Q 580 14 580 34 L 580 330" fill="none" stroke="#222" stroke-width="18" stroke-linecap="round"/>
  <path d="M 250 260 L 250 30 Q 250 14 270 14 L 560 14 Q 580 14 580 34 L 580 330" fill="none" stroke="#7ad8ff" stroke-width="8" stroke-dasharray="18 14" stroke-dashoffset="${-k * 200}"/>
  <text x="190" y="320" fill="#fff" font-size="34" font-weight="900" text-anchor="middle">LAGO</text><text x="590" y="476" fill="#fff" font-size="30" font-weight="900" text-anchor="middle">MAIS BAIXO ✅</text></svg>`;
SHOTS.b23 = (c) => {
  const t = c.t; const tA = at(c, 'aula de ciências'), tS = at(c, 'sifão'), tE = at(c, 'É só encher'); c.sfx('ding', tA, 0.5); c.sfx('pop', tS, 0.6);
  M(c, { lake: 1 });
  c.track('dudu', [{ t: 0, p: [-1.6, 0, 2.5], ry: 0.4, a: t < tA ? 'think' : 'pointup', e2: t < tA ? 'worried' : 'happy' }]); c.track('jade', [{ t: 0, p: [0.4, 0, 2.0], ry: -0.7, a: 'idle', e2: 'worried' }]);
  c.cam([{ t: 0, p: [-0.4, 1.4, 6.8], l: [-0.2, 1.1, 2.4], f: 46 }, { t: c.dur, p: [-0.4, 1.3, 6.0], l: [-0.2, 1.1, 2.4], f: 46 }]);
  if (t > tA) { const a = clamp((t - tA) / 0.3); c.ui(`<div class="abs" style="left:1080px;top:150px;opacity:${a};background:rgba(10,14,28,.82);border:5px solid #ffd21f;border-radius:26px;padding:20px">${siphonSVG(prog(t, tE, c.dur))}</div>`); }
  if (t > tS) title(c, '💡 SIFÃO!', tS, { top: 40, bg: '#ffb31f', size: 90 });
};

SHOTS.b24 = (c) => {
  const t = c.t; const tP = at(c, 'no Peru'), tC = at(c, 'A vila inteira'); c.sfx('whoosh', tC, 0.5); c.sfx('footsteps', tC, 0.6);
  M(c, { lake: 1 });
  if (t < tC - 0.2) { c.track('jade', [{ t: 0, p: [-1.0, 0, 2.2], ry: 0.4, a: 'talk', e2: 'surprised' }]); c.frame('jade', { yaw: 0.2, d: 3.6, h: 1.3, f: 46, to: { d: 3.1 } }); if (t > tP) c.ui(card('🇵🇪 PALCACOCHA: BAIXADO COM SIFÕES', { y: 80, size: 46, b: '#ffd21f', s: pop(t, tP, 0.25) || 1 })); }
  else { const k = prog(t, tC, c.dur); for (let i = 0; i < 16; i++) { const x0 = -2 + (i % 4) * 1.4 - k * 13, z0 = 4 + Math.floor(i / 4) * 1.6 + k * 4; c.mini(i, { p: [x0, 0, z0], ry: -PI / 2 + 0.3, a: 'run', e: 'worried' }); }
    c.track('dudu', [{ t: 0, p: [-1 - k * 13, 0, 3 + k * 4], ry: -PI / 2 + 0.3, a: 'run', e2: 'happy' }]);
    c.cam([{ t: tC - 0.2, p: [-2, 12, 18], l: [-13, 0, 7], f: 46 }, { t: c.dur, p: [-4, 12, 20], l: [-19, 0, 9], f: 46 }]); title(c, 'ARRANCAR TODAS AS MANGUEIRAS!', at(c, 'arranca'), { size: 68 }); }
};

SHOTS.b25 = (c) => {
  const t = c.t; const tE = at(c, 'Eles enchem'), tS = at(c, 'sair sozinha'), tB = at(c, 'O lago baixa'); c.sfx('footsteps', 0, 0.5); c.sfx('water', tS, 0.7);
  if (t < tE - 0.2) { M(c, { lake: 1, siphon: 0 }); const k = prog(t, 0, tE); const z = lerp(-36, -46, k);
    llama(c, 'pip', [8, gy(c, 8, z), z], PI, { walk: true, pack: true }); llama(c, 'l2', [10, gy(c, 10, z + 2.5), z + 2.5], PI, { walk: true, pack: true }); llama(c, 'l3', [12, gy(c, 12, z + 1), z + 1], PI, { walk: true, pack: true });
    c.track('dudu', [{ t: 0, p: [6.3, gy(c, 6.3, -36), -36], ry: PI, a: 'walk', e2: 'happy' }, { t: tE, p: [6.3, gy(c, 6.3, -45.5), -45.5], ry: PI, a: 'walk', e2: 'happy' }]);
    c.cam([{ t: 0, p: [18, gy(c, 18, -30) + 4.5, -30], l: [9, gy(c, 9, -40) + 1.5, -40], f: 46 }, { t: tE, p: [18, gy(c, 18, -36) + 5, -36], l: [9, gy(c, 9, -46) + 1.5, -46], f: 46 }]); c.chip(960, 90, '🦙 AS LHAMAS LEVAM AS MANGUEIRAS', 'gold', 0.3, 1e9); }
  else { const lk = 1 - 0.3 * prog(t, tS, c.dur); M(c, { lake: lk, siphon: t > tS - 0.3 ? 1 : 0.3 }); ruler(c, lakeY(lk));
    for (let i = 0; i < 4; i++) c.mini(i, { p: [-8 + i * 4.5, gy(c, -8 + i * 4.5, -47), -47], ry: PI, a: t > tS ? 'cheer' : 'carry', e: 'happy' });
    c.cam([{ t: tE - 0.2, p: [-16, 30, -36], l: [0, 16, -56], f: 46 }, { t: c.dur, p: [-14, 28, -34], l: [0, 16, -56], f: 46 }]);
    if (t > tS) title(c, '💧 A ÁGUA SAI SOZINHA', tS, { bg: '#2fa35a' }); if (t > tB) c.ui(card('📏 O LAGO BAIXA, UM PALMO DE CADA VEZ', { y: 760, size: 44, b: '#7ab8ff', s: pop(t, tB, 0.25) || 1 })); }
};

SHOTS.b26 = (c) => {
  const t = c.t; const tD = at(c, 'despenca'), tB = at(c, 'bate na parede'), tN = at(c, 'não passa'), tG = at(c, 'quinhentas pessoas'); c.sfx('crash', tD + 0.2, 0.8); c.sfx('water', tB, 0.6); c.sfx('cheer', tG, 0.7); c.sfx('tada', tN + 0.2, 0.5);
  const cv = clamp((t - tD + 0.2) / 2.0);
  if (t < tN + 0.6) { M(c, { lake: 0.55, siphon: 1, calve: cv, wave: clamp((cv - 0.7) * 1.3) }); if (t < tB) c.cam([{ t: 0, p: [-20, 31, -56], l: [6, 26, -94], f: 44 }, { t: tB, p: [-18, 30, -58], l: [6, 22, -92], f: 44 }]);
    else c.cam([{ t: tB, p: [-16, 24, -40], l: [0, 18, -62], f: 46 }, { t: c.dur, p: [-15, 22, -38], l: [0, 16, -58], f: 46 }]); if (t > tD + 0.4 && t < tD + 1.4) c.shake(0.5, 8);
    big(c, '3 DIAS DEPOIS', 0.2, { y: 160, size: 90, color: '#fff', glow: 'rgba(255,255,255,.5)' }); if (t > tN) { const k = ease.oo(prog(t, tN, tN + 0.25)); c.ui(stamp('NÃO PASSOU!', { top: 380, size: 120, s: 1.4 - 0.4 * k, a: k })); } }
  else { M(c, { lake: 0.55, siphon: 1 }); plazaPeople(c, 34, { a: (i) => i % 2 ? 'cheer' : 'clap', e: 'happy', kids: true, jump: true, ry: 0, dry: PI });
    c.track('dudu', [{ t: 0, p: [0.2, 0, 2], ry: 0, a: 'cheer', e2: 'happy', y: Math.max(0, Math.sin(t * 6)) * 0.3 }]); llama(c, 'pip', [1.5, 0, 2.2], 0.3, { look: -0.5 + Math.sin(t * 8) * 0.2 });
    c.cam([{ t: tN + 0.6, p: [0.6, 2.2, 9], l: [0.6, 1.0, 2], f: 46 }, { t: c.dur, p: [0.6, 2.0, 7.8], l: [0.6, 1.0, 2], f: 46 }]); }
};

// ================= FINAL =================
SHOTS.b27 = (c) => {
  const t = c.t; const tA = at(c, 'Os anos passam'), tC = at(c, 'as crianças'), tR = at(c, 'o rádio'), tP = at(c, 'o mar parou'); c.sfx('pad', 0, 0.4); c.sfx('radio', tR, 0.5); c.sfx('ding', tP, 0.6);
  if (t < tA - 0.2) { M(c, { lake: 0.5, siphon: 1 }); c.cam([{ t: 0, p: [-14, 28, -40], l: [0, 15, -60], f: 46 }, { t: tA, p: [-13, 27, -41], l: [0, 15, -60], f: 46 }]); title(c, 'OS SIFÕES NUNCA MAIS SAÍRAM', 0.2, { bg: '#2a6ad6', size: 70 }); }
  else if (t < tR - 0.2) { M(c, { lake: 0.5, siphon: 1, more: true, llamas: 6 }); smoke(c, 0.5);
    for (let i = 0; i < 8; i++) { const a = t * 0.9 + i * 0.8; c.mini(i, { p: [Math.sin(a) * 4.5, 0, Math.cos(a) * 4.5], ry: a + PI / 2, a: 'run', e: 'happy', s: 0.62 }); }
    c.cam([{ t: tA - 0.2, p: [18, 14, 34], l: [0, 1, 0], f: 46 }, { t: tR, p: [14, 10, 26], l: [0, 1, 0], f: 46 }]); title(c, '⏩ ANOS DEPOIS', tA, { bg: '#2a2a6a' }); }
  else { M(c, { more: true }); c.track('ines', [{ t: 0, p: [0, 0, 2], ry: 0.2, a: 'phone', e2: 'surprised', hold: 'phone' }]); c.frame('ines', { yaw: 0.3, d: 3.8, h: 1.3, f: 46, to: { d: 3.3 }, t0: tR - 0.2 });
    c.ui(card('📻 “O MAR PAROU DE SUBIR”', { y: 90, size: 56, b: '#2fa35a', s: pop(t, tP, 0.25) || 1, a: t > tR ? 1 : 0 })); }
};

SHOTS.b28 = (c) => {
  const t = c.t; const tF = at(c, 'fica'), tD = at(c, 'E o Dudu'); c.sfx('wind', 0, 0.3); c.sfx('pad', tD, 0.4);
  if (t < tD - 0.2) { M(c, { more: true, tod: 'day' }); for (let i = 0; i < 10; i++) { const z = 30 + i * 2.2; c.mini(i, { p: [-30 - (i % 2), gy(c, -30 - (i % 2), z), z], ry: 0, a: 'walk', e: 'happy' }); }
    plazaPeople(c, 18, { a: 'wave', e: 'happy', kids: true, ry: PI });
    c.cam([{ t: 0, p: [-14, 12, 30], l: [-10, 0, 2], f: 46 }, { t: tD, p: [-12, 10, 26], l: [-10, 0, 2], f: 46 }]); if (t > tF) title(c, '🏠 MUITA GENTE FICA', tF, { bg: '#2fa35a' }); }
  else { const ly = lakeY(0.5); M(c, { more: true, lake: 0.5, siphon: 1 }); ruler(c, ly); const P = CREST(c, 11.5);
    c.track('duduA', [{ t: 0, p: P, ry: PI + 0.3, a: 'write', e2: 'happy', hold: 'paper' }]);
    c.cam([{ t: tD - 0.2, p: [5.5, P[1] + 2.4, -55.5], l: [11, P[1] + 1.0, -60], f: 46 }, { t: c.dur, p: [6.3, P[1] + 2.2, -56.0], l: [11, P[1] + 1.0, -60], f: 46 }]); c.chip(1300, 500, '📏 DUDU, ADULTO', 'red', tD, 1e9); }
};

SHOTS.b29 = (c) => {
  const t = c.t; const tR = at(c, 'respeitar a montanha'); c.sfx('pad', 0, 0.5); c.sfx('tada', tR, 0.4);
  M(c, { tod: 'dusk', power: 1, more: true, lake: 0.5, siphon: 1 }); smoke(c, 0.5);
  c.cam([{ t: 0, p: [40, 30, 90], l: [0, 8, -30], f: 44 }, { t: c.dur, p: [30, 24, 70], l: [0, 10, -40], f: 44 }]);
  if (t > tR) title(c, '🏔️ RESPEITAR A MONTANHA', tR, { bg: '#d6a31c', size: 90 });
  c.state.fade = prog(t, c.dur - 0.4, c.dur) * 0.6;
};

SHOTS.b30 = (c) => {
  const t = c.t; const tQ = at(c, 'Aguentaria'), tM = at(c, 'E deixa nos comentários'), tS = at(c, 'Se inscreve'), tB = at(c, 'Até lá'); c.sfx('whoosh', tM, 0.5); c.sfx('click', tS + 1.1, 0.8); c.sfx('ding', tS + 1.15, 0.6); c.sfx('tada', tB, 0.6);
  hideProps(); c.env('outro');
  const w = t > tB;
  [['jade', -3.0, 0.3], ['ines', -1.0, 0.1], ['tome', 1.0, -0.1], ['dudu', 3.0, -0.3]].forEach(([n, x, ry]) => c.track(n, [{ t: 0, p: [x, 0, 5.1], ry, a: w ? 'wave' : 'idle', e2: 'happy' }]));
  c.cam([{ t: 0, p: [0, 1.9, 12.4], l: [0, 2.0, 5], f: 42 }, { t: c.dur, p: [0, 2.0, 11.4], l: [0, 2.0, 5], f: 42 }]);
  if (t > tQ && t < tM - 0.2) { const a = clamp((t - tQ) / 0.4); c.ui(`<div class="abs" style="left:0;top:130px;width:1920px;text-align:center;font-weight:900;font-size:60px;color:#fff;opacity:${a};text-shadow:0 5px 0 #000">VIVER A 4 MIL METROS DE ALTURA?</div>`);
    ['AGUENTO 🏔️', 'NEM PENSAR 🥵'].forEach((l, i) => { const s = pop(t, tQ + 0.5 + i * 0.3, 0.25); c.ui(`<div class="abs" style="left:${500 + i * 480}px;top:240px;width:440px;padding:20px 0;text-align:center;border-radius:24px;background:${['#5aa8ff', '#ff6b4a'][i]};color:#111;font-weight:900;font-size:50px;white-space:nowrap;transform:scale(${s})">${l}</div>`); }); }
  if (t > tM - 0.2 && t < tS - 0.1) { c.ui(`<div class="abs" style="left:0;top:120px;width:1920px;text-align:center;font-weight:900;font-size:60px;color:#fff;text-shadow:0 5px 0 #000">PRÓXIMO EPISÓDIO</div>`); c.ui(bigNum('ONDE A HUMANIDADE RECOMEÇA? 💬', 960, 270, { size: 90, color: '#ffd21f', glow: 'rgba(255,210,31,.6)', s: pop(t, tM - 0.2, 0.3) || 1 })); }
  if (t > tS - 0.1) subBtn(c, tS);
};
