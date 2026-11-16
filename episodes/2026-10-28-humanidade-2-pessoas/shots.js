import { ANIMS } from '/engine/chars.js';
export const SHOTS = {};
export const CAST = {
  caio: { style: 'palito', cap: 0x1b8a3c, capYaw: 0 },
  lia: { style: 'palito', shirt: 0x7b3fe4, trim: 0xffffff, shorts: 0x2b2f45, shoes: 0xffffff, num: null, flag: false, hair: 'lia', scale: 0.96 },
  caioOld: { style: 'palito', cap: 0x1b8a3c, hair: null },
  liaOld: { style: 'palito', shirt: 0x7b3fe4, trim: 0xffffff, shorts: 0x2b2f45, num: null, flag: false, hair: 'lia', scale: 0.96 },
  breno: { style: 'palito', shirt: 0xdddddd, trim: 0x888888, shorts: 0x333333, num: null, flag: false },
};
const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const lerp = (a, b, t) => a + (b - a) * t;
const ease = { io: x => x * x * (3 - 2 * x), o: x => 1 - (1 - x) * (1 - x), i: x => x * x, oo: x => 1 - Math.pow(1 - x, 3), lin: x => x };
const dots = (n) => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
const mmss = (s) => { s = Math.max(0, s); return '00:' + String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(Math.floor(s % 60)).padStart(2, '0'); };
const PI = Math.PI;
const prog = (t, a, b) => clamp((t - a) / (b - a));
const labTimer = (c) => mmss(660 - (c.T - c.B('b02').start));
const abs = (html) => `<div class="abs" style="left:0;top:0;width:1920px;height:1080px">${html}</div>`;
const center = (txt, o = {}) => `<div class="abs" style="left:0;right:0;top:${o.top ?? 400}px;text-align:center;font-weight:900;font-size:${o.size ?? 120}px;color:${o.color ?? '#fff'};opacity:${o.a ?? 1};transform:scale(${o.s ?? 1});letter-spacing:${o.ls ?? 0}px;text-shadow:0 6px 0 rgba(0,0,0,.55),0 0 40px ${o.glow ?? 'rgba(0,0,0,0)'};${o.extra ?? ''}">${txt}</div>`;

// ================= GANCHO =================
SHOTS.b01 = (c) => {
  c.env('void'); const tD = c.at('dois'); c.sfx('riser', 0.4, 0.9); c.sfx('boom', tD, 1.0);
  const t = c.t, t0 = 0.5;
  c.cam([{ t: 0, p: [0, 1.9, 9.5], l: [0, 2.0, 0], f: 40 }, { t: c.dur, p: [0, 1.7, 6.8], l: [0, 1.8, 0], f: 40 }]);
  const u = clamp((t - t0) / (tD - t0 - 0.05)); const v = u >= 1 ? 2 : Math.max(2, 2 + 8.2e9 * Math.pow(1 - u, 6));
  const after = t >= tD; const k = after ? prog(t, tD, tD + 0.45) : 0;
  const top = after ? lerp(360, 120, ease.o(k)) : 360; const size = after ? lerp(200, 150, ease.o(k)) : 200;
  const pop = after ? 1 + 0.5 * Math.max(0, 1 - (t - tD) / 0.3) : 1;
  c.ui(center('POPULAÇÃO MUNDIAL', { top: top - 90, size: 36, color: '#b9a8ff', ls: 8, a: clamp((t - 0.1) / 0.3) }));
  c.ui(center(after ? '2' : dots(v), { top, size, color: after ? '#ff3b30' : '#ffffff', s: pop, glow: after ? 'rgba(255,59,48,.8)' : 'rgba(150,130,255,.7)', extra: 'font-variant-numeric:tabular-nums;' }));
  if (after) {
    const s = 0.2; const a = clamp((t - tD) / 0.2);
    c.track('caio', [{ t: 0, p: [-1.3, 0, 0], ry: 0.25, a: 'idle', e2: 'worried' }]);
    c.track('lia', [{ t: 0, p: [1.2, 0, 0.2], ry: -0.25, a: 'idle', e2: 'worried' }]);
    c.flash('#ffffff', Math.max(0, 0.7 * (1 - (t - tD) / 0.25)));
    c.shake(Math.max(0, 1 - (t - tD) / 0.5) * 1.2);
  }
  c.state.fade = clamp((t - (c.dur - 0.0)) / 0.1) * 0;
};

SHOTS.b02 = (c) => {
  const t = c.t; c.sfx('alarm', 0.0, 0.5); c.sfx('whoosh', 2.6, 0.7); c.sfx('whoosh', 5.3, 0.6);
  c.env('lab', { alarm: 1, timer: labTimer(c), level: 0.1, dispOk: false });
  // lia correndo até a porta do gerador
  const r = [{ t: 0, p: [8.2, 0, 3.5], ry: -PI / 2, a: 'run', e2: 'scared' }, { t: 2.6, p: [8.2, 0, 3.5], ry: -PI / 2, a: 'run', e2: 'scared' }, { t: 5.0, p: [-8.2, 0, 3.5], ry: -PI / 2, a: 'run', e2: 'scared' }, { t: 5.01, p: [-8.2, 0, 3.5], ry: -PI / 2, a: 'idle', e2: 'worried', hold: 'wrench' }];
  if (t >= 2.6) c.track('lia', r);
  c.cam([
    { t: 0, p: [0.0, 2.5, -1.0], l: [0, 3.0, -7.5], f: 42 }, { t: 2.6, p: [0.5, 2.8, -3.6], l: [0, 3.0, -7.5], f: 36 },
    { t: 2.6, p: [9.0, 3.4, 7.4], l: [3, 1.2, 2.0], f: 46 }, { t: 5.0, p: [0.5, 2.6, 7.2], l: [-6, 1.3, 3.2], f: 44 },
    { t: 5.0, p: [-5.6, 1.7, 6.8], l: [-9.2, 1.8, 3.6], f: 32 }, { t: c.dur, p: [-6.6, 1.9, 6.0], l: [-9.2, 1.7, 3.6], f: 28 }]);
  c.shake(0.3);
};

SHOTS.b03 = (c) => {
  const t = c.t; c.sfx('whoosh', 0.0, 0.5); c.sfx('door', 4.2, 0.5);
  c.env('lab', { alarm: 1, timer: labTimer(c), level: 0.08, dispOk: false });
  c.track('lia', [{ t: 0, p: [-8.2, 0, 3.5], ry: -PI / 2, a: 'idle', e2: 'worried', hold: 'wrench' }, { t: 2.2, p: [-8.2, 0, 3.5], ry: -PI / 2, a: 'idle', e2: 'worried', hold: 'wrench' }]);
  c.track('caio', [{ t: 0, p: [8.6, 0, 3.5], ry: -PI / 2, a: 'run', e2: 'scared' }, { t: 2.4, p: [-5.6, 0, 3.5], ry: -PI / 2, a: 'run', e2: 'scared' }, { t: 2.41, p: [-5.6, 0, 3.5], ry: -PI / 2, a: 'tired', e2: 'tired' }]);
  const P = c.pos('caio');
  if (t < 2.4) c.camSet([P.x + 2.5, 1.8, P.z + 5.5], [P.x - 2, 1.4, P.z], 46); else c.cam([{ t: 2.4, p: [-1.0, 1.7, 7.0], l: [-7, 1.4, 3.5], f: 40 }, { t: c.dur, p: [-3.2, 1.6, 6.4], l: [-7, 1.4, 3.5], f: 34 }]);
  const tt = c.at('três semanas'); const k = prog(t, tt + 0.7, tt + 1.4);
  if (k > 0) { c.state.fade = k; c.ui(center('3 SEMANAS ANTES', { top: 440, size: 130, a: k, s: 0.9 + 0.1 * k, ls: 3 })); }
};

// ================= RUA =================
SHOTS.b04 = (c) => {
  const t = c.t; const tg = c.at('abre'); const green = t >= tg;
  c.sfx('traffic', tg, 0.6); c.sfx('wind', 0, 0.35); c.sfx('whoosh', 6.0, 0.6);
  c.env('street', { tod: 'dawn', light: green ? 'green' : 'red', flick: 1 });
  const M = c.PROPS.moto; M.visible = true; M.position.set(2.4, 0, -4.5); M.rotation.y = PI;
  c.track('caio', [{ t: 0, p: [2.4, 0.37, -4.62], ry: PI, a: t > 3.4 ? 'ridelook' : 'ridestop', e2: 'deadpan', hold: null }]);
  c.cam([
    { t: 0, p: [4.8, 1.9, -0.6], l: [1.7, 2.2, -8.0], f: 44 }, { t: 3.5, p: [4.0, 1.8, -1.6], l: [1.9, 2.2, -8.0], f: 40 },
    { t: 3.5, p: [2.5, 1.7, -7.4], l: [2.4, 1.6, -4.6], f: 34 }, { t: 6.0, p: [2.0, 1.65, -6.6], l: [2.4, 1.6, -4.6], f: 32 },
    { t: 6.0, p: [3.4, 2.4, -2.0], l: [2.4, 1.7, -4.6], f: 40 }, { t: c.dur, p: [-6, 34, 30], l: [0, 6, -80], f: 50, e: 'io' }]);
  c.tag([2.4, 3.1, -4.6], 'CAIO · 33 ANOS · MOTOBOY', 'gold', 0.5, 3.4);
};

SHOTS.test_faces = (c) => {
  c.env('void', { cone: false });
  const ems = ['neutral', 'happy', 'smirk', 'sad', 'angry', 'surprised', 'scared', 'worried', 'tired', 'cry', 'deadpan'];
  const n = ems.length; c.cam([{ t: 0, p: [0, 2.0, 11], l: [0, 1.9, 0], f: 34 }]);
  ems.forEach((e, i) => { const x = (i - (n - 1) / 2) * 1.05; const ch = i % 2 ? 'lia' : 'caio'; const C = c.CH[ch]; });
  // usa 2 personagens x emoções em sequência de tempo
  const idx = Math.floor(c.t / 1) % n; const e = ems[idx];
  c.track('caio', [{ t: 0, p: [-0.55, 0, 6], ry: 0.2, a: 'idle', e2: e }]); c.track('lia', [{ t: 0, p: [0.55, 0, 6], ry: -0.2, a: 'idle', e2: e }]);
  c.camSet([0, 1.95, 8.2], [0, 1.9, 6], 30);
  c.ui(center(e, { top: 80, size: 60 }));
};

// ---------------- helpers extra ----------------
const lerpA = (a, b, u) => a.map((v, i) => lerp(v, b[i], u));
const rotY = (v, a) => [v[0] * Math.cos(a) + v[2] * Math.sin(a), v[1], -v[0] * Math.sin(a) + v[2] * Math.cos(a)];
const stamp = (txt, o = {}) => `<div class="abs" style="left:0;right:0;top:${o.top ?? 380}px;text-align:center;transform:rotate(${o.rot ?? -4}deg) scale(${o.s ?? 1});opacity:${o.a ?? 1}"><span style="display:inline-block;padding:10px 50px;border:10px solid ${o.color ?? '#ff3b30'};border-radius:20px;color:${o.color ?? '#ff3b30'};font-weight:900;font-size:${o.size ?? 120}px;background:rgba(0,0,0,.55);letter-spacing:4px">${txt}</span></div>`;
const bigNum = (txt, x, y, o = {}) => `<div class="abs" style="left:${x}px;top:${y}px;transform:translate(-50%,-50%) scale(${o.s ?? 1});opacity:${o.a ?? 1};font-weight:900;font-size:${o.size ?? 110}px;color:${o.color ?? '#fff'};text-shadow:0 6px 0 rgba(0,0,0,.6),0 0 30px ${o.glow ?? 'rgba(0,0,0,0)'};white-space:nowrap">${txt}</div>`;
const pop = (t, t0, d = 0.25) => { const k = clamp((t - t0) / d); return k <= 0 ? 0 : (1 + 0.35 * (1 - k)) * (k > 0 ? 1 : 0); };
const phoneUI = (t, t0, t1, rows) => { if (t < t0 || t > t1) return ''; const a = clamp((t - t0) / 0.2) * clamp((t1 - t) / 0.2);
  let h = `<div class="abs" style="left:1230px;top:120px;width:430px;height:720px;border-radius:50px;background:#0f1218;border:9px solid #2b303a;transform:rotate(4deg);opacity:${a};box-shadow:0 30px 80px rgba(0,0,0,.55);overflow:hidden"><div style="padding:34px 30px;font-weight:800;color:#8fb4ff;font-size:30px;letter-spacing:3px">CONTATOS</div><div style="text-align:center;font-weight:900;font-size:150px;color:#fff;line-height:1">200</div>`;
  rows.forEach((r, i) => { const on = t > t0 + 0.4 + i * 0.7; if (!on) return; const done = t > t0 + 0.4 + i * 0.7 + 0.55; h += `<div style="margin:16px 26px 0;padding:14px 20px;border-radius:16px;background:#1a1f2a;display:flex;justify-content:space-between;font-weight:800;font-size:30px;color:#fff"><span>${r}</span><span style="color:${done ? '#ff6a5e' : '#7fd8ff'};font-size:24px">${done ? 'SEM RESPOSTA' : 'chamando' + '.'.repeat(1 + Math.floor(t * 4) % 3)}</span></div>`; });
  return h + '</div>'; };
const wheelsSpin = (M, d, r = 0.36) => M.userData.wheels.forEach(w => w.rotation.x = d / r);

// ================= b05 =================
SHOTS.b05 = (c) => {
  const t = c.t; const tH = c.at('ouve um'), tG = c.at('no fim da rua'); c.sfx('radio', tH, 0.5); c.sfx('engine', tG, 0.8); c.sfx('wind', 0, 0.3);
  c.env('street', { tod: 'dawn', light: 'green' });
  const M = c.PROPS.moto; M.visible = true; const go = Math.max(0, t - tG); const dist = 0.5 * 3.2 * go * go + 0 * go; const z = -4.5 - dist; M.position.set(2.4, 0, z); M.rotation.y = PI; wheelsSpin(M, dist);
  const A = t < tH ? 'ridephone' : (t < tG ? 'ridelook' : 'ride');
  c.track('caio', [{ t: 0, p: [2.4, 0.37, z - 0.12], ry: PI, a: A, e2: t < tH ? 'worried' : (t < tG ? 'surprised' : 'happy'), hold: t < tH ? 'phone' : null }]);
  if (t < tH) c.cam([{ t: 0, p: [1.0, 1.95, -7.0], l: [2.4, 1.95, -4.6], f: 32 }, { t: tH, p: [1.5, 1.95, -6.2], l: [2.4, 1.95, -4.6], f: 28 }]);
  else if (t < tG) c.cam([{ t: tH, p: [2.9, 2.0, -2.2], l: [0, 2.4, -60], f: 38 }, { t: tG, p: [2.9, 2.0, -3.0], l: [0, 2.4, -60], f: 34 }]);
  else c.camSet([2.4 + 1.2, 1.6 + Math.min(1.5, go * 0.4), z + 5.5 + go * 0.4], [2.4, 1.3, z - 6], 55);
  c.ui(phoneUI(t, 0.25, tH - 0.2, ['Mãe', 'Rafa', 'Patrão', 'Tia Nete']));
  if (t > tH) { const k = 0.5 + 0.5 * Math.sin(t * 5); c.tag([0, 5 + k, -70], '♪ ♫', 'white', tH + 0.3, tG + 2); }
};

// ================= b06 =================
SHOTS.b06 = (c) => {
  const t = c.t; const tIn = 2.4; const tLia = c.at('É a Lia'), tOl = c.at('Ela olha'), tS1 = c.at('Só nós?'), tS2 = c.beat.chunks[c.beat.chunks.length - 1].t0;
  c.sfx('radio', 0, 0.4); c.sfx('door', tIn, 0.5);
  c.env('bakery');
  c.track('lia', [{ t: 0, p: [-1.5, 0, -2.3], ry: 0, a: 'eat', e2: 'worried', hold: 'bread' }, { t: tOl, p: [-1.5, 0, -2.3], ry: 0, a: 'idle', e2: 'surprised', hold: null }]);
  c.track('caio', [{ t: 0, p: [0, 0, 7.5], ry: PI, a: 'idle', e2: 'neutral' }, { t: tIn, p: [0, 0, 7.5], ry: PI, a: 'walk', e2: 'surprised' }, { t: tIn + 2.3, p: [0.2, 0, 1.6], ry: PI * 0.92, a: 'walk', e2: 'surprised' }, { t: tIn + 2.31, p: [0.2, 0, 1.6], ry: PI * 0.92, a: 'idle', e2: 'surprised' }]);
  if (t < tIn + 0.8) c.cam([{ t: 0, p: [-4.4, 2.0, 3.2], l: [-2.2, 1.4, -2.0], f: 42 }, { t: tIn + 0.8, p: [-4.0, 1.9, 2.6], l: [-2.0, 1.4, -2.0], f: 38 }]);
  else if (t < tOl + 0.6) c.cam([{ t: tIn + 0.8, p: [3.4, 1.7, 3.4], l: [-0.4, 1.5, -0.6], f: 40 }, { t: tOl + 0.6, p: [3.0, 1.7, 3.2], l: [-0.4, 1.5, -0.6], f: 36 }]);
  else if (t < tS1 - 0.2) c.cam([{ t: tOl + 0.6, p: [1.3, 1.7, 4.2], l: [0.2, 1.8, 1.6], f: 30 }, { t: tS1 - 0.2, p: [1.0, 1.75, 3.8], l: [0.2, 1.8, 1.6], f: 26 }]);
  else if (t < tS2 - 0.1) c.cam([{ t: tS1 - 0.2, p: [-0.4, 1.7, 0.2], l: [-1.5, 1.8, -2.3], f: 30 }, { t: tS2 - 0.1, p: [-0.7, 1.7, 0.0], l: [-1.5, 1.8, -2.3], f: 26 }]);
  else c.cam([{ t: tS2 - 0.1, p: [3.8, 2.2, 4.6], l: [-0.6, 1.4, -0.4], f: 44 }, { t: c.dur, p: [3.2, 2.0, 4.0], l: [-0.6, 1.4, -0.4], f: 40 }]);
  c.tag([-1.5, 3.2, -2.3], 'LIA · 29 ANOS · PROFESSORA DE BIOLOGIA', 'blue', tLia, tLia + 3.2);
  if (t >= tS1) c.bubble(c.CH.caio, 'Só nós?', tS1, tS1 + 1.4, [0, 2.7, 0]);
  if (t >= tS2) c.bubble(c.CH.lia, 'Só nós.', tS2, tS2 + 1.6, [0, 2.7, 0]);
};

// ================= b07 =================
SHOTS.b07 = (c) => {
  const t = c.t; const tI = [['prédios', 'PRÉDIOS'], ['carros', 'CARROS'], ['comida', 'COMIDA'], ['hospitais', 'HOSPITAIS']].map(([k, l]) => [c.at(k), l]); const tC = c.at('sair caro');
  c.sfx('hit', 0.35, 1); c.sfx('pop', tI[0][0], 0.6); c.sfx('pop', tI[1][0], 0.6); c.sfx('pop', tI[2][0], 0.6); c.sfx('pop', tI[3][0], 0.6); c.sfx('boom', tC, 1.0);
  c.env('street', { tod: 'gray', light: 'green' });
  c.track('caio', [{ t: 0, p: [-1.0, 0, 0], ry: PI, a: 'idle', e2: 'worried' }]); c.track('lia', [{ t: 0, p: [1.0, 0, 0.1], ry: PI, a: 'idle', e2: 'worried' }]);
  const a = 0.05 + c.u * 0.9; c.camSet([Math.sin(a) * 8.5, 2.2 + c.u * 0.8, Math.cos(a) * 8.5], [0, 2.0, -3], 46);
  const s1 = pop(t, 0.35, 0.3); c.ui(`<div class="abs" style="left:0;right:0;top:80px;text-align:center;transform:scale(${s1 ? s1 : 0});opacity:${s1 ? 1 : 0}"><div style="display:inline-block;background:#d62828;border:7px solid #fff;border-radius:22px;padding:6px 70px;font-weight:900;font-size:110px;transform:rotate(-2deg);box-shadow:0 14px 0 rgba(0,0,0,.45)">REGRA Nº 1</div></div>`);
  c.ui(`<div class="abs" style="left:0;right:0;top:250px;text-align:center;font-weight:900;font-size:56px;color:#ffd21f;opacity:${clamp((t - 0.7) / 0.3)};text-shadow:0 5px 0 #000,0 0 20px #000">SÓ AS PESSOAS SUMIRAM</div>`);
  tI.forEach(([tt, l], i) => { if (t > tt) c.chip([300, 620, 1300, 1620][i], 800, l, 'green', tt, 1e9); });
  if (t > tC) { const k = pop(t, tC, 0.2); c.ui(stamp('ISSO VAI SAIR CARO', { top: 420, s: k, size: 104 })); c.shake(Math.max(0, 1 - (t - tC) / 0.4)); c.flash('#ff2020', Math.max(0, 0.35 * (1 - (t - tC) / 0.25))); }
};

// ================= b08 =================
SHOTS.b08 = (c) => {
  const t = c.t; c.sfx('wheelie', 0.4, 0.5); c.sfx('ding', 3.4, 0.4);
  c.env('market', { power: 1 });
  const z = 4 - (t / c.dur) * 46 * (0.7 + 0.3 * (t / c.dur)); const C = c.PROPS.cart; C.visible = true; C.position.set(0, 0, z); C.rotation.y = PI;
  c.track('caio', [{ t: 0, p: [0, 0.45, z + 0.5], ry: PI, a: t < 7.2 ? 'surf' : 'cheer', e2: 'happy' }]);
  if (t < 3.4) c.camSet([0.7, 1.5, z - 7.5], [0, 1.4, z], 48);
  else if (t < 7.0) c.camSet([0, 4.5, z + 3.5], [0, 0.6, z - 3], 58);
  else c.camSet([0.9, 1.2, z + 5.5], [0, 1.4, z - 7], 58);
  c.ui(`<div class="chip green" style="left:1580px;top:120px;font-size:36px;transform:none">TOTAL: R$ 0,00</div>`);
  c.shake(0.35, 18);
};

// ================= b09 =================
SHOTS.b09 = (c) => {
  const t = c.t; c.sfx('engine', 0, 1.0); c.sfx('whoosh', 2.2, 0.8); c.sfx('whoosh', 5.0, 0.8);
  c.env('street', { tod: 'day', light: 'green' });
  const spd = 60; const z = 36 - t * spd; const d = t * spd; const Cr = c.PROPS.car; Cr.visible = true; Cr.position.set(0, 0, z); Cr.rotation.y = PI; wheelsSpin(Cr, d, 0.4);
  c.track('caio', [{ t: 0, p: [-0.45, 0.42, z + 0.3], ry: PI, a: 'drive', e2: t > 4 ? 'surprised' : 'happy' }]);
  if (t < 2.4) c.camSet([2.5, 3.4 - t * 0.2, z + 9 - t * 0.5], [0, 1.0, z - 4], 62);
  else if (t < 4.9) c.camSet([-5.2, 1.0, z + 1.0 + Math.sin(t) * 1.2], [0, 0.9, z - 1.5], 46);
  else c.camSet([1.2, 1.1, z - 11], [0, 0.9, z], 70);
  const kmh = Math.round(lerp(0, 312, ease.o(clamp(t / 4.5)))); c.ui(`<div class="abs" style="left:110px;top:90px;font-weight:900;font-size:100px;color:#ff4b3e;text-shadow:0 5px 0 #000">${kmh}<span style="font-size:40px;color:#fff"> KM/H</span></div>`);
  c.shake(0.8, 30);
};

// ================= b10 =================
SHOTS.b10 = (c) => {
  const t = c.t; const tG = c.at('grita'), tV = c.at('vazios'), tS = c.at('sessenta');
  c.sfx('echo', tG + 0.5, 0.9); c.sfx('whoosh', 3.2, 0.5);
  c.env('stadium');
  const sh = t > tG - 0.3 && t < tG + 1.4;
  c.track('lia', [{ t: 0, p: [0, 0, 0], ry: 0.2, a: 'idle', e2: 'happy' }, { t: tG - 0.3, p: [0, 0, 0], ry: 0.2, a: 'shout', e2: 'happy' }, { t: tG + 1.4, p: [0, 0, 0], ry: 0.2, a: 'idle', e2: 'happy' }]);
  if (t < 3.3) c.cam([{ t: 0, p: [-68, 46, 84], l: [0, 0, 0], f: 48 }, { t: 3.3, p: [-34, 20, 40], l: [0, 1, 0], f: 48 }]);
  else if (t < tV - 0.2) c.cam([{ t: 3.3, p: [2.6, 1.8, 6.5], l: [0, 1.9, 0], f: 32 }, { t: tV - 0.2, p: [2.0, 1.9, 5.8], l: [0, 1.9, 0], f: 28 }]);
  else c.cam([{ t: tV - 0.2, p: [0, 2.2, 6], l: [-26, 9, 50], f: 55 }, { t: c.dur, p: [0, 2.2, 6], l: [26, 9, 50], f: 55 }]);
  [[0, 'LIA!', 1.0], [0.45, 'Lia!', 0.6], [0.9, 'lia...', 0.35]].forEach(([d, tx, op], i) => { const a = clamp((t - (tG + 0.5 + d)) / 0.15) * clamp((tG + 2.2 + d - t) / 0.7); if (a > 0) c.ui(bigNum(tx, 520 + i * 440, 300 + i * 40, { size: 130 - i * 22, a: a * op, s: 0.9 + 0.1 * a })); });
  if (t >= tS) { c.chip(560, 160, '60.000 LUGARES', 'gold', tS, 1e9); } if (t >= tV) c.chip(1360, 160, '0 PESSOAS', 'red', tV, 1e9);
};

// ================= b11 =================
SHOTS.b11 = (c) => {
  const t = c.t; const tL = c.at('a luz pisca'), tD = c.at('segundo dia');
  c.sfx('flicker', tL, 0.7);
  const fl = t > tL ? (Math.sin(t * 38) > -0.2 && Math.sin(t * 7) > -0.6 ? 1 : 0.05) : 1;
  c.env('street', { tod: 'dusk', light: 'green', flick: fl });
  const z0 = 6, z = z0 - t * 1.5; c.track('caio', [{ t: 0, p: [-0.8, 0, z0], ry: PI, a: 'walk', e2: 'neutral' }, { t: c.dur, p: [-0.8, 0, z0 - c.dur * 1.5], ry: PI, a: 'walk', e2: 'worried' }]);
  c.track('lia', [{ t: 0, p: [0.8, 0, z0 + 0.3], ry: PI, a: 'walk', e2: 'neutral' }, { t: c.dur, p: [0.8, 0, z0 + 0.3 - c.dur * 1.5], ry: PI, a: 'walk', e2: 'worried' }]);
  c.camSet([0.3 + Math.sin(t * 0.4) * 1.2, 1.7, z + 5.6], [0, 1.9, z - 5], 44);
  c.chip(220, 130, 'DIA 2', 'gold', tD, 1e9);
  if (fl < 0.5) c.flash('#000000', 0.35);
};

// ================= b12 =================
SHOTS.b12 = (c) => {
  const t = c.t; const tCut = c.at('as bombas'); const tU = c.at('desligam tudo'); c.sfx('blackout', 0.8, 0.9); c.sfx('water', tCut, 0.8); c.sfx('whoosh', tCut, 0.5);
  if (t < tCut) {
    const bl = prog(t, 0.8, tCut - 0.5); c.env('citynight', { black: bl });
    c.cam([{ t: 0, p: [-46, 22, 76], l: [0, 52, -170], f: 46 }, { t: tCut, p: [46, 22, 76], l: [0, 52, -170], f: 46 }]);
    c.chip(300, 140, 'DIA 2 · 19:42', 'gold', 0.2, 1e9); c.chip(1560, 140, 'USINAS: DESLIGADAS', 'red', tU, 1e9);
    c.ui(bigNum(Math.round(bl * 100) + '%', 960, 180, { size: 120, color: '#ffd21f' })); c.ui(center('DA CIDADE SEM LUZ', { top: 262, size: 34, color: '#b9c8ff', ls: 6 }));
  } else {
    const wk = prog(t, tCut, c.dur - 0.2); c.env('metro', { water: wk, power: 0.3 });
    c.cam([{ t: tCut, p: [-8, 2.4, 12.2], l: [7, 0.4, 1.5], f: 52 }, { t: c.dur, p: [5, 3.3, 13.8], l: [-12, -0.6, 0], f: 52 }]);
    c.chip(1560, 140, 'BOMBAS: OFF', 'red', tCut, 1e9); c.chip(380, 140, 'ÁGUA: ' + (wk * 1.7).toFixed(1).replace('.', ',') + ' m', 'blue', tCut + 0.3, 1e9);
  }
};

// ================= b12b =================
SHOTS.b12b = (c) => {
  const t = c.t; const tA = c.at('A Lia aponta'), tN = c.at('três nomes'), tE = c.at('esquece dois'); c.sfx('crickets', 0, 0.4); c.sfx('twinkle', 1.0, 0.5); c.sfx('shoot', 4.3, 0.6);
  c.env('roof', { shoot: prog(t, 4.3, 5.4) });
  const R = c.ENV.roof.g.userData;
  c.track('caio', [{ t: 0, p: [-1.1, 0.15, 3.2], ry: PI, a: 'sit', e2: 'surprised' }, { t: 1.0, p: [-1.1, 0.15, 3.2], ry: PI, a: 'sit', e2: 'happy' }]);
  c.track('lia', [{ t: 0, p: [1.1, 0.15, 3.2], ry: PI, a: 'sit', e2: 'happy' }, { t: tA, p: [1.1, 0.15, 3.2], ry: PI, a: 'sit', e2: 'happy', over: { rsx: 2.5, rsz: 0.2, rel: 0, hx: -0.5 } }]);
  c.CH.caio.pose; // (olhar pra cima via over)
  if (t < tA + 3.0) c.cam([{ t: 0, p: [0.2, 1.1, 8.6], l: [0, 7, -40], f: 66 }, { t: tA + 3.0, p: [0.1, 1.2, 7.6], l: [0, 9, -40], f: 62 }]);
  else c.cam([{ t: tA + 3.0, p: [0.1, 1.45, -1.6], l: [0, 1.65, 3.2], f: 36 }, { t: c.dur, p: [0.1, 1.5, -0.6], l: [0, 1.7, 3.2], f: 28 }]);
  if (t < tA + 3.0) { const cx = R.crux, tr = R.tres; c.tag([cx.x, cx.y, cx.z], 'CRUZEIRO DO SUL', 'gold', tA, tA + 4.5); c.tag([tr.x, tr.y, tr.z], 'TRÊS MARIAS', 'blue', tA + 1.4, tA + 4.5); }
  c.chip(330, 140, 'NOMES APRENDIDOS: 3', 'green', tN, 1e9); c.chip(1560, 140, 'ESQUECIDOS: 2', 'red', tE, 1e9);
};

// ================= b13 =================
SHOTS.b13 = (c) => {
  const t = c.t; const tR = c.at('estraga'), tL = c.at('latas aguentam'), tA1 = c.at('Primeira vez'), tA2 = c.at('Segunda:'), tA3 = c.at('Terceira:'), tAl = c.at('ninguém');
  c.sfx('buzz', tR, 0.4); c.sfx('sizzle', tA1, 0.5); c.sfx('sizzle', tA2, 0.7); c.sfx('alarm', tA3 + 0.2, 0.8);
  c.env('market', { power: 0 });
  const t2 = tA1 - 1.2;
  if (t < t2) {
    const z = lerp(2, -9, t / t2); c.track('caio', [{ t: 0, p: [0, 0, 2], ry: PI, a: 'walk', e2: 'worried', hold: 'light' }, { t: t2, p: [0, 0, -9], ry: PI, a: 'walk', e2: 'worried', hold: 'light' }]);
    c.torch([0.3, 1.5, z - 0.3], [-0.4 + Math.sin(t * 1.3) * 1.5, 0.7, z - 9], 140);
    c.camSet([0.9, 1.9, z + 4.8], [0, 1.3, z - 7], 50);
    c.chip(430, 150, 'CARNE: ESTRAGADA', 'red', tR, tL + 0.6); c.chip(1500, 150, 'LATAS: OK', 'green', tL, 1e9);
  } else {
    const F = c.PROPS.fire; F.visible = true; F.position.set(0, 0.05, -12.4); F.scale.setScalar(0.45 + (t > tA3 ? 0.4 : 0)); F.userData.flames.forEach((m, i) => m.scale.y = 1 + 0.2 * Math.sin(t * 12 + i)); c.glow([0, 0.9, -12.0], 0xff8a2a, 16);
    const k = t < tA2 ? 0.25 : (t < tA3 ? 0.65 : 1.0); const alarm = t > tA3 + 0.2;
    c.track('caio', [{ t: 0, p: [0.5, 0, -13.2], ry: 0.2, a: 'kneel', e2: t > tA3 ? 'scared' : 'worried', hold: 'pan' }, { t: tA3, p: [0.5, 0, -13.2], ry: 0.2, a: 'panic', e2: 'scared', hold: null }]);
    c.track('lia', [{ t: 0, p: [-1.9, 0, -11.4], ry: 0.5, a: 'eat', e2: 'happy', hold: 'can' }, { t: tAl, p: [-1.9, 0, -11.4], ry: 0.5, a: 'shrug', e2: 'deadpan', hold: null }]);
    c.puffs([0, 1.0, -12.4], t > tA1 ? k : 0, { color: t > tA2 ? 0x333333 : 0x888888, spread: 1.4, grow: 1.6 });
    c.camSet([1.0, 2.0, -6.2], [-0.6, 1.0, -12.2], 50);
    const n = t < tA1 ? 0 : 1 + (t > tA2 ? 1 : 0) + (t > tA3 ? 1 : 0); c.chip(1560, 140, 'PASTÉIS QUEIMADOS: ' + n + '/3', n >= 3 ? 'red' : 'gold', tA1, 1e9);
    if (alarm) { c.flash('#ff0000', 0.06 + 0.06 * Math.sin(t * 14)); c.ui(bigNum('BIIIP BIIIP!', 960, 215, { size: 110, color: '#ff4b3e', s: 1 + 0.05 * Math.sin(t * 14) })); c.shake(0.5); }
    if (t > tAl) c.ui(bigNum('...e ninguém aparece.', 960, 320, { size: 56, color: '#fff', a: clamp((t - tAl) / 0.4) }));
  }
};

// ================= b14 =================
SHOTS.b14 = (c) => {
  const t = c.t; const tC1 = c.at('O hospital'), tC2 = c.at('A Lia lê'), tF = c.at('Fundo'), tZ = c.at('zero médicos'), tM = c.at('três mil'), tS = c.at('costura'), tD = c.at('Dentista');
  c.sfx('ouch', tF, 0.8); c.sfx('whoosh', tC1, 0.5); c.sfx('whoosh', tC2, 0.5); c.sfx('error', tZ, 0.5); c.sfx('error', tD + 0.5, 0.5);
  if (t < tC1) {
    c.env('bakery'); const hurt = t >= tF;
    c.track('caio', [{ t: 0, p: [-1.5, 0, -0.8], ry: PI, a: 'idle', e2: 'worried', hold: 'can' }, { t: tF, p: [-1.5, 0, -0.8], ry: PI, a: 'hurt', e2: 'scared', hold: 'bandage' }]);
    c.cam([{ t: 0, p: [-0.3, 1.9, 1.6], l: [-1.5, 1.5, -0.9], f: 38 }, { t: tF, p: [-0.7, 1.9, 1.3], l: [-1.5, 1.5, -0.9], f: 30 }, { t: tF, p: [-0.9, 1.8, 0.9], l: [-1.5, 1.7, -0.9], f: 26 }, { t: tC1, p: [-0.9, 1.8, 0.6], l: [-1.5, 1.7, -0.9], f: 24 }]);
    c.chip(300, 140, 'DIA 5', 'gold', 0.1, 1e9); if (hurt) { c.bubble(c.CH.caio, 'AAAI!', tF, tF + 1.2, [0, 2.7, 0]); c.shake(Math.max(0, 1 - (t - tF) / 0.4) * 1.2); c.flash('#ff0000', Math.max(0, 0.25 * (1 - (t - tF) / 0.3))); }
  } else if (t < tC2) {
    const u = (t - tC1) / (tC2 - tC1); const z = lerp(2, -10, u);
    c.track('caio', [{ t: tC1, p: [-0.5, 0, 2], ry: PI, a: 'walk', e2: 'worried', hold: 'bandage' }, { t: tC2, p: [-0.5, 0, -10], ry: PI, a: 'walk', e2: 'worried', hold: 'bandage' }]);
    c.track('lia', [{ t: tC1, p: [0.6, 0, 1.8], ry: PI, a: 'walk', e2: 'worried', hold: 'light' }, { t: tC2, p: [0.6, 0, -10.2], ry: PI, a: 'walk', e2: 'worried', hold: 'light' }]);
    c.env('hospital', { torch: [0.9, 1.5, z + 1.4, 0.3, 0.8, z - 9] });
    c.camSet([0.1, 1.7, z + 4.4], [0, 1.4, z - 8], 52);
    c.chip(430, 150, 'LEITOS: 3.000', 'blue', tM, 1e9); c.chip(1500, 150, 'MÉDICOS: 0', 'red', tZ, 1e9);
  } else {
    c.env('hospital', { torch: [27.5, 1.9, -0.5, 25.9, 1.0, -1.9] });
    const needle = t >= tS;
    c.track('caio', [{ t: 0, p: [26, 0.18, -1.9], ry: 0, a: 'sit', e2: t > tD ? 'surprised' : 'scared', hold: 'bandage' }]);
    c.track('lia', [{ t: 0, p: [27.6, 0, -0.9], ry: -2.1, a: needle ? 'write' : 'idle', e2: 'worried', hold: needle ? 'needle' : 'book' }]);
    if (t < tS) c.cam([{ t: tC2, p: [29.2, 1.9, 2.6], l: [26.2, 1.2, -1.6], f: 40 }, { t: tS, p: [28.5, 1.8, 2.2], l: [26.4, 1.2, -1.5], f: 36 }]);
    else if (t < tD) c.cam([{ t: tS, p: [27.4, 1.5, 0.9], l: [26.0, 1.15, -1.7], f: 30 }, { t: tD, p: [27.0, 1.45, 0.6], l: [26.0, 1.15, -1.7], f: 26 }]);
    else c.cam([{ t: tD, p: [26.6, 1.4, 2.6], l: [26.3, 1.2, -1.7], f: 36 }, { t: c.dur, p: [26.4, 1.4, 1.8], l: [26.2, 1.25, -1.7], f: 30 }]);
    if (t > tD) c.chip(960, 170, 'DENTISTA MAIS PRÓXIMO: 0', 'red', tD, 1e9);
  }
};

// ================= b15 =================
SHOTS.b15 = (c) => {
  const t = c.t; const tS = c.at('inscrever'), tL = c.at('deixa o like'); c.sfx('click', tS + 1.1, 0.8); c.sfx('ding', tS + 1.15, 0.6); c.sfx('pop', tL + 0.3, 0.8);
  c.env('street', { tod: 'dawn', light: 'green' });
  c.track('caio', [{ t: 0, p: [-1.0, 0, 3], ry: 0.25, a: 'floorEat', e2: 'happy', hold: 'can' }, { t: tS, p: [-1.0, 0, 3], ry: 0.25, a: 'floor', e2: 'happy', hold: 'can' }]);
  c.track('lia', [{ t: 0, p: [1.0, 0, 3.1], ry: -0.25, a: 'floor', e2: 'happy', hold: 'can' }, { t: tS, p: [1.0, 0, 3.1], ry: -0.25, a: 'floor', e2: 'happy', hold: 'can' }]);
  c.cam([{ t: 0, p: [-0.5, 1.4, 9.8], l: [0, 1.0, 3], f: 40 }, { t: c.dur, p: [0.8, 1.5, 8.6], l: [0, 1.1, 3], f: 38 }]);
  if (t > tS - 0.1) { const a = clamp((t - (tS - 0.1)) / 0.3); const cl = t > tS + 1.1; const cx = lerp(1700, 1470, ease.io(clamp((t - tS) / 0.9))), cy = lerp(520, 345, ease.io(clamp((t - tS) / 0.9)));
    c.ui(`<div class="abs" style="left:1280px;top:290px;opacity:${a};transform:scale(${0.8 + 0.2 * a})"><div style="display:flex;gap:18px;align-items:center"><div style="padding:18px 46px;border-radius:60px;background:${cl ? '#3a3a3a' : '#ff0033'};color:#fff;font-weight:900;font-size:44px;box-shadow:0 8px 0 rgba(0,0,0,.4)">${cl ? 'INSCRITO' : 'INSCREVER'}</div><div style="font-size:56px;transform:rotate(${cl ? Math.sin(t * 22) * 14 : 0}deg)"><svg width="62" height="62" viewBox="0 0 24 24"><path fill="#fff" d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/></svg></div></div></div>`);
    if (!cl || t < tS + 1.6) c.ui(`<div class="abs" style="left:${cx}px;top:${cy}px;transform:scale(${cl && t < tS + 1.25 ? 0.8 : 1});font-size:70px"><svg width="70" height="70" viewBox="0 0 24 24"><path fill="#fff" stroke="#000" stroke-width="1.2" d="M4 3l16 9-7 1.6L9.5 20z"/></svg></div>`); }
  if (t > tL) { const s = pop(t, tL, 0.3); c.ui(`<div class="abs" style="left:1330px;top:470px;transform:scale(${s || 0});opacity:${s ? 1 : 0}"><div style="display:flex;align-items:center;gap:16px"><div style="width:110px;height:110px;border-radius:55px;background:#2b7bff;display:flex;align-items:center;justify-content:center;box-shadow:0 8px 0 rgba(0,0,0,.4)"><svg width="64" height="64" viewBox="0 0 24 24"><path fill="#fff" d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z"/></svg></div><div style="font-weight:900;font-size:64px;text-shadow:0 5px 0 #000">+1</div></div></div>`); }
};

// ================= b16 =================
SHOTS.b16 = (c) => {
  const t = c.t; const tF = c.at('Aqui,'), tM = c.at('mais de um milhão'), tP = c.at('um pacote'); c.sfx('whoosh', tF, 0.6); c.sfx('wind', 0, 0.3);
  if (t < tF) {
    c.env('vault'); c.cam([{ t: 0, p: [0, 3.4, 0], l: [0, 5.2, -34], f: 46 }, { t: tF, p: [0, 3.4, -16], l: [0, 5.0, -34], f: 46 }]);
    const n = Math.round(1401285 * ease.o(prog(t, tM - 0.3, tF - 0.4))); c.chip(960, 150, 'COFRE DE SVALBARD · NORUEGA', 'gold', 0.3, 1e9);
    c.ui(bigNum(dots(n), 960, 250, { size: 110, color: '#7fffd8', glow: 'rgba(127,255,216,.7)' })); c.ui(center('AMOSTRAS DE SEMENTES', { top: 305, size: 38, color: '#bff', ls: 6 }));
  } else {
    c.env('farm', { cycle: 0.23 });
    c.track('caio', [{ t: 0, p: [-1.5, 0, 8.6], ry: 0.2, a: 'idle', e2: 'happy', hold: 'bean' }]); c.track('lia', [{ t: 0, p: [1.5, 0, 8.6], ry: -0.2, a: 'idle', e2: 'neutral', hold: 'book' }]);
    c.cam([{ t: tF, p: [0.5, 2.4, 16], l: [0, 1.4, 5], f: 48 }, { t: c.dur, p: [0.3, 2.0, 14.2], l: [0, 1.5, 6], f: 44 }]);
    c.chip(960, 150, 'SEMENTES AQUI: 1 PACOTE', 'red', tP, 1e9);
  }
};

// ================= b17 =================
SHOTS.b17 = (c) => {
  const t = c.t; const w1 = c.at('Primeira semana'), w2 = c.at('Segunda:'), w5 = c.at('quinta semana'), tF = c.at('festa');
  c.sfx('tick', w1, 0.4); c.sfx('tick', w2, 0.4); c.sfx('ding', w5 + 0.6, 0.7); c.sfx('tada', tF, 0.6);
  let plant = 0, dead = 0, wk = 1;
  if (t < w2) { const u = prog(t, w1, w2 - 0.1); plant = clamp(u * 2.2) * 0.8; dead = clamp((u - 0.45) * 2.2); wk = 1; }
  else if (t < w5 - 0.2) { const u = prog(t, w2, w5 - 0.2); const k = u * 2.4; const ph = k % 1; plant = clamp(ph * 2) * 0.8; dead = clamp((ph - 0.45) * 2.2); wk = 2 + Math.min(2, Math.floor(k)); }
  else { const u = prog(t, w5, w5 + 1.2); plant = clamp(u) * 1.0; dead = 0; wk = 5; }
  c.env('farm', { cycle: 0.12 + 0.3 * ((t * 0.7) % 1), plant, dead, which: 0 });
  c.track('caio', [{ t: 0, p: [-5.9, 0, 1.2], ry: 0.6, a: 'idle', e2: 'neutral' }, { t: w5 + 0.8, p: [-5.9, 0, 1.2], ry: 0.6, a: 'idle', e2: 'surprised' }, { t: tF, p: [-5.9, 0, 1.2], ry: 0.6, a: 'dance', e2: 'happy' }]);
  c.cam([{ t: 0, p: [-7.8, 2.2, 5.6], l: [-7.0, 0.9, -0.5], f: 44 }, { t: w5, p: [-7.6, 2.0, 5.0], l: [-7.0, 0.9, -0.5], f: 40 }, { t: c.dur, p: [-6.6, 1.7, 4.4], l: [-6.6, 1.1, 0], f: 42 }]);
  c.chip(960, 140, 'SEMANA ' + wk, wk === 5 ? 'green' : 'red', 0.1, 1e9);
};

// ================= b18 =================
SHOTS.b18 = (c) => {
  const t = c.t; const tP = c.at('tiram'), tA1 = c.at('Primeira tentativa'), tA5 = c.at('Quinta tentativa'), tJ = c.at('dá um pulo'), tC = c.at('A Lia chora');
  c.sfx('spark', tA1 + 0.2, 0.9); c.sfx('spark', tA1 + 1.4, 0.6); c.sfx('ding', tA5 + 0.5, 0.8); c.sfx('cheer', tA5 + 0.6, 0.5);
  const spark = (t > tA1 + 0.2 && t < tA1 + 0.8) ? prog(t, tA1 + 0.2, tA1 + 0.8) : 0; const on = t >= tA5 + 0.5;
  c.env('solar', { removed: t > tP ? Math.min(3, Math.floor((t - tP) * 3)) : 0, on, spark });
  const walk0 = Math.max(0, tP - 0.5), walkEnd = tA1 - 0.2; const u = clamp((t - walk0) / (walkEnd - walk0));
  const cx = lerp(-8, 5.0, ease.io(u)), cz = lerp(-6, 3.4, ease.io(u));
  if (t < tA1) { c.track('caio', [{ t: 0, p: [-8, 0, -6], ry: 1.4, a: 'idle', e2: 'neutral' }, { t: walk0, p: [-8, 0, -6], ry: 1.1, a: 'carry', e2: 'worried' }, { t: walkEnd, p: [5.0, 0, 3.4], ry: 1.1, a: 'carry', e2: 'worried' }]); const P = c.PROPS.panel; P.visible = t > walk0; P.position.set(cx + 0.55, 1.15, cz + 0.2); P.rotation.set(0.1, 1.1, 0.3); P.scale.setScalar(0.9); }
  else { const jumping = t > tJ - 0.3 && t < tJ + 0.9; c.track('caio', [{ t: tA1, p: [5.0, 0, 3.4], ry: 1.1, a: 'idle', e2: 'neutral' }, { t: tA1 + 0.2, p: [5.0, 0, 3.4], ry: 1.1, a: jumping ? 'panic' : 'think', e2: jumping ? 'scared' : 'worried' }, { t: tA5 + 0.5, p: [5.0, 0, 3.4], ry: 1.1, a: 'cheer', e2: 'happy' }]); }
  c.track('lia', [{ t: 0, p: [8.6, 0, 5.2], ry: -1.9, a: 'idle', e2: 'worried' }, { t: tA5 + 0.5, p: [8.6, 0, 5.2], ry: -1.9, a: 'idle', e2: 'cry' }]);
  if (t < tA1) c.cam([{ t: 0, p: [-3, 2.6, 8], l: [-8, 1.2, -6], f: 50 }, { t: tP + 1, p: [2, 2.2, 9], l: [-4, 1.2, -2], f: 50 }, { t: tA1, p: [4, 2.2, 10.5], l: [6.5, 1.0, 4], f: 44 }]);
  else if (t < tA5) c.cam([{ t: tA1, p: [1.8, 2.0, 8.4], l: [6.6, 1.0, 4], f: 40 }, { t: tA5, p: [3, 2.2, 8.6], l: [6.8, 1.0, 4], f: 40 }]);
  else c.cam([{ t: tA5, p: [4.4, 1.5, 8.2], l: [7.3, 1.1, 4.4], f: 34 }, { t: c.dur, p: [5.4, 1.5, 7.8], l: [7.4, 1.2, 4.4], f: 28 }]);
  const att = t < tA1 ? 0 : (t < tA5 ? 1 + Math.floor(prog(t, tA1, tA5) * 3.99) : 5); if (att) c.chip(960, 150, 'TENTATIVA ' + att, att === 5 ? 'green' : 'gold', tA1, 1e9);
  if (spark) c.shake(1.0);
};

// ================= b19 =================
SHOTS.b19 = (c) => {
  const t = c.t; const tB = c.at('Como fazer pão'), tM = c.at('consertar um motor'), tG = c.at('ligar um gerador'), tE = c.at('errando'); c.sfx('page', 0.5, 0.4); c.sfx('clang', tE + 0.2, 0.7);
  const ev = []; for (let i = 0; i < 9; i++) ev.push(tE + 0.05 + Math.pow(i / 8, 0.6) * (c.dur - tE - 1.6));
  const bolts = []; let hit = false; ev.forEach((te, i) => { const k = (t - te) / 0.55; if (k >= 0 && k <= 1) bolts.push([lerp(0.2, 0, k), 1.6 + Math.sin(k * PI) * 1.3, lerp(-6, -4.75, k)]); if (t > te + 0.5 && t < te + 0.85) hit = true; });
  c.env('library', { bolts });
  c.track('lia', [{ t: 0, p: [-9, 0, -3.9], ry: PI, a: 'idle', e2: 'happy', hold: 'book' }]);
  c.track('caio', [{ t: 0, p: [0, 0, -4.9], ry: PI, a: 'idle', e2: 'happy', hold: 'wrench' }, { t: tE - 0.2, p: [0, 0, -4.9], ry: PI, a: 'write', e2: 'worried', hold: 'wrench' }, { t: tE + 0.5, p: [0, 0, -4.9], ry: PI, a: hit ? 'hurt' : 'write', e2: hit ? 'scared' : 'angry', hold: 'wrench', over: hit ? { lean: 0.5, hx: 0.5 } : undefined }]);
  if (t < tE - 0.3) c.cam([{ t: 0, p: [-12, 2.6, 6], l: [-14, 4, -14], f: 56 }, { t: tE - 0.3, p: [10, 2.6, 6], l: [12, 4, -14], f: 56 }]);
  else c.cam([{ t: tE - 0.3, p: [4.2, 2.2, 1.2], l: [0, 1.6, -5.2], f: 44 }, { t: c.dur, p: [3.0, 2.0, -0.4], l: [0, 1.7, -5.2], f: 38 }]);
  c.chip(420, 330, 'COMO FAZER PÃO', 'gold', tB, tB + 2.2); c.chip(960, 400, 'COMO CONSERTAR UM MOTOR', 'gold', tM, tM + 2.4); c.chip(1500, 330, 'COMO LIGAR UM GERADOR', 'gold', tG, tG + 2.6);
  if (t > tE) { const n = Math.round(100 * Math.pow(prog(t, tE, c.dur - 0.6), 1.6)); c.ui(bigNum('ERROS: ' + n, 960, 150, { size: 100, color: '#ff4b3e', glow: 'rgba(255,75,62,.6)' })); if (hit) c.shake(0.8); }
};

// ================= helpers finais =================
const seeded = (n) => { let x = n * 9301 + 49297; return () => { x = (x * 9301 + 49297) % 233280; return x / 233280; }; };
const subBtn = (c, tS) => { const t = c.t; if (t < tS - 0.1) return; const a = clamp((t - (tS - 0.1)) / 0.3); const cl = t > tS + 1.1; const k = ease.io(clamp((t - tS) / 0.9)); const cx = lerp(1700, 1470, k), cy = lerp(520, 345, k);
  c.ui(`<div class="abs" style="left:1280px;top:290px;opacity:${a};transform:scale(${0.8 + 0.2 * a})"><div style="display:flex;gap:18px;align-items:center"><div style="padding:18px 46px;border-radius:60px;background:${cl ? '#3a3a3a' : '#ff0033'};color:#fff;font-weight:900;font-size:44px;box-shadow:0 8px 0 rgba(0,0,0,.4)">${cl ? 'INSCRITO' : 'INSCREVER'}</div></div></div>`);
  if (!cl || t < tS + 1.6) c.ui(`<div class="abs" style="left:${cx}px;top:${cy}px;transform:scale(${cl && t < tS + 1.25 ? 0.8 : 1})"><svg width="70" height="70" viewBox="0 0 24 24"><path fill="#fff" stroke="#000" stroke-width="1.2" d="M4 3l16 9-7 1.6L9.5 20z"/></svg></div>`); };
const boardCam = (c, t0, t1, z0 = 1.8, z1 = 0.8) => c.cam([{ t: t0, p: [0, 2.1, z0], l: [-0.2, 2.0, -5.8], f: 50 }, { t: t1, p: [0, 2.1, z1], l: [-0.2, 2.0, -5.8], f: 50 }]);
const dotsGrid = (x, n, cx, cy, cols, sp, r, col) => { for (let i = 0; i < n; i++) { const cc = i % cols, rr = Math.floor(i / cols); x.fillStyle = col; x.beginPath(); x.arc(cx + (cc - (cols - 1) / 2) * sp, cy + rr * sp, r, 0, 7); x.fill(); } };

// ================= b20 =================
SHOTS.b20 = (c) => {
  const t = c.t; const tQ = c.at('quadro'), tM = c.at('Frédéric'), t98 = c.at('noventa e oito'), tC = c.at('Cameron'), t14 = c.at('catorze mil'), t2 = c.at('Dois não');
  c.sfx('chalk', tQ, 0.5); c.sfx('chalk', t98, 0.5); c.sfx('chalk', t14, 0.5); c.sfx('hit', t2 + 0.2, 0.7); c.sfx('error', t2 + 0.25, 0.5);
  const P = (a, b) => clamp((t - a) / (b - a));
  const R = seeded(7); const pts = []; for (let i = 0; i < 2600; i++) pts.push([R(), R()]);
  c.env('classroom', { board: (x, W, H) => {
    x.textAlign = 'center'; x.fillStyle = '#2a6ad6'; x.font = '900 68px Inter'; x.globalAlpha = P(tQ, tQ + 1.0); x.fillText('QUANTAS PESSOAS PRECISAMOS?', W / 2, 92); x.globalAlpha = 1;
    // esquerda: 98
    const a98 = P(t98 - 0.3, t98 + 0.5); if (a98 > 0) { x.globalAlpha = a98; x.fillStyle = '#1c9a4a'; x.font = '900 150px Inter'; x.fillText('98', 330, 270); x.globalAlpha = 1; const n = Math.ceil(98 * P(t98, t98 + 1.6)); dotsGrid(x, n, 330, 305, 10, 24, 8, '#1c9a4a'); x.font = '800 36px Inter'; x.fillStyle = '#555'; x.fillText('Marin · astrofísico', 330, 556); }
    // direita: 14.000
    const a14 = P(t14 - 0.3, t14 + 0.5); if (a14 > 0) { x.globalAlpha = a14; x.fillStyle = '#d6561c'; x.font = '900 150px Inter'; x.fillText('14.000', 1090, 270); x.globalAlpha = 1; const n = Math.floor(pts.length * P(t14, t14 + 1.8)); x.fillStyle = '#d6561c'; for (let i = 0; i < n; i++) { x.beginPath(); x.arc(760 + pts[i][0] * 660, 305 + pts[i][1] * 215, 3, 0, 7); x.fill(); } x.font = '800 36px Inter'; x.fillStyle = '#555'; x.fillText('Smith · antropólogo', 1090, 556); }
    // vermelho: 2
    const a2 = P(t2, t2 + 0.4); if (a2 > 0) { const s = 1 + 0.6 * (1 - a2); x.save(); x.translate(710, 300); x.scale(s, s); x.globalAlpha = a2; x.fillStyle = '#e02020'; x.font = '900 230px Inter'; x.fillText('2', 0, 80); x.fillStyle = '#e02020'; x.beginPath(); x.arc(-60, 120, 12, 0, 7); x.arc(60, 120, 12, 0, 7); x.fill(); x.restore(); x.globalAlpha = 1; }
  } });
  c.track('lia', [{ t: 0, p: [4.4, 0, -4.4], ry: PI + 0.7, a: t < tQ + 1.4 ? 'write' : 'point', e2: 'neutral', hold: t < tQ + 1.4 ? 'marker' : null }]);
  c.track('caio', [{ t: 0, p: [-4.4, 0, -4.4], ry: PI - 0.5, a: 'think', e2: t > t2 ? 'worried' : 'neutral' }]);
  boardCam(c, 0, c.dur, 2.4, 1.8);
  c.chip(300, 140, 'DOIS MESES DEPOIS', 'gold', 0.1, tM);
};

// ================= b21 =================
SHOTS.b21 = (c) => {
  const t = c.t; const tP = c.at('pontos de partida'), tG = c.at('poucas gerações'), tD = c.at('doenças'), tW = c.at('apaga'), tN = c.at('A conta não');
  c.sfx('chalk', tP, 0.5); c.sfx('wipe', tW, 0.8); c.sfx('boom', tN, 0.9);
  const P = (a, b) => clamp((t - a) / (b - a)); const wipe = P(tW, tW + 1.3);
  c.env('classroom', { board: (x, W, H) => {
    const a = P(tP, tP + 0.6); const R = seeded(3);
    const rows = [2, 4, 6, 8]; const ys = [150, 270, 390, 510];
    const nodes = rows.map((n, ri) => Array.from({ length: n }, (_, i) => [W / 2 + (i - (n - 1) / 2) * 120, ys[ri]]));
    const gk = clamp((t - tG) / 2.4) * 3;
    x.globalAlpha = a; x.fillStyle = '#e02020'; nodes[0].forEach(p => { x.beginPath(); x.arc(p[0], p[1], 20, 0, 7); x.fill(); }); x.font = '800 34px Inter'; x.fillStyle = '#555'; x.textAlign = 'left'; x.fillText('GERAÇÃO 0', 80, 160); x.globalAlpha = 1;
    for (let ri = 1; ri < 4; ri++) { const k = clamp(gk - (ri - 1)); if (k <= 0) continue; x.globalAlpha = k; x.strokeStyle = '#2a6ad6'; x.lineWidth = 3; nodes[ri].forEach((p, i) => { [-1, 0, 1].forEach(d => { const q = nodes[ri - 1][Math.max(0, Math.min(nodes[ri - 1].length - 1, Math.round(i / 2 + d * 0.5 - 0.25)))]; if (q) { x.beginPath(); x.moveTo(q[0], q[1]); x.lineTo(p[0], p[1]); x.stroke(); } }); }); nodes[ri].forEach(p => { x.fillStyle = '#2a6ad6'; x.beginPath(); x.arc(p[0], p[1], 16, 0, 7); x.fill(); }); x.fillStyle = '#555'; x.font = '800 34px Inter'; x.fillText('GERAÇÃO ' + ri, 80, ys[ri] + 10); x.globalAlpha = 1; }
    if (t > tD) { const k = clamp((t - tD) / 0.5); x.globalAlpha = k; x.fillStyle = '#e02020'; x.font = '900 60px Inter'; x.textAlign = 'center'; x.fillText('MAIS PARENTES = MAIS DOENÇAS RARAS', W / 2, 80); x.globalAlpha = 1; }
    if (wipe > 0) { const wx = wipe * (W + 200) - 100; x.fillStyle = '#fbfbf8'; x.fillRect(0, 0, wx, H); x.fillStyle = '#6a6e73'; x.fillRect(wx - 6, 40, 90, H - 80); x.fillStyle = '#2b2f33'; x.fillRect(wx + 44, 40, 40, H - 80); }
  } });
  c.track('lia', [{ t: 0, p: [4.2, 0, -4.6], ry: PI + 0.7, a: 'idle', e2: 'worried' }, { t: tW - 0.3, p: [4.2, 0, -4.6], ry: PI + 0.7, a: 'idle', e2: 'worried' }, { t: tW, p: [lerp(4.2, -3.8, wipe), 0, -4.8], ry: PI + 0.3, a: 'wipe', e2: 'angry', hold: 'wipe' }, { t: tW + 1.3, p: [-3.8, 0, -4.8], ry: PI + 0.3, a: 'wipe', e2: 'angry', hold: 'wipe' }]);
  c.track('caio', [{ t: 0, p: [-4.4, 0, -4.4], ry: PI - 0.5, a: 'think', e2: 'worried' }]);
  boardCam(c, 0, c.dur, 2.4, 1.8);
  if (t > tN) { const k = pop(t, tN, 0.3); c.ui(stamp('A CONTA NÃO FECHA', { top: 400, size: 110, s: k, a: 1, rot: -3 })); c.shake(Math.max(0, 1 - (t - tN) / 0.35) * 1.4); }
};

// ================= b22 =================
SHOTS.b22 = (c) => {
  const t = c.t; const tB = c.at('existe um backup'), tF = c.at('células congeladas'), tG = c.at('duzentos'), tE = c.at('depende de energia'), tA = c.at('está acabando');
  c.sfx('chalk', tB, 0.5); c.sfx('ice', tG, 0.5); c.sfx('alarm', tA, 0.5);
  const P = (a, b) => clamp((t - a) / (b - a)); const R = seeded(11); const cols = ['#e02020', '#2a6ad6', '#1c9a4a', '#d6a31c', '#8a3ad6', '#d6561c', '#0aa6b8']; const dpts = Array.from({ length: 140 }, (_, i) => [R(), R(), cols[i % 7]]);
  c.env('classroom', { board: (x, W, H) => {
    const a = P(tB, tB + 0.7); x.globalAlpha = a; x.strokeStyle = '#2a6ad6'; x.lineWidth = 8; x.strokeRect(260, 130, 330, 400); x.fillStyle = '#cfe6ff'; x.fillRect(260, 130, 330, 400 * 0.0 + 60); x.globalAlpha = 1;
    const n = Math.floor(dpts.length * P(tF, tF + 2.2)); dpts.slice(0, n).forEach(d => { x.fillStyle = d[2]; x.beginPath(); x.arc(285 + d[0] * 280, 215 + d[1] * 290, 7, 0, 7); x.fill(); });
    x.textAlign = 'left'; const g = P(tG, tG + 0.8); if (g > 0) { x.globalAlpha = g; x.fillStyle = '#2a6ad6'; x.font = '900 120px Inter'; x.fillText('−196 °C', 660, 260); x.globalAlpha = 1; }
    if (t > tE) { const k = P(tE, tE + 0.5); x.globalAlpha = k; x.fillStyle = '#555'; x.font = '800 44px Inter'; x.fillText('ENERGIA', 660, 360); const lv = 1 - P(tE + 0.5, tA + 3.5) * 0.85; const red = lv < 0.4; x.strokeStyle = '#222'; x.lineWidth = 6; x.strokeRect(660, 390, 640, 90); x.fillStyle = red ? '#e02020' : '#1c9a4a'; x.fillRect(666, 396, 628 * lv, 78); x.fillStyle = '#222'; x.fillRect(1300, 418, 24, 34); x.globalAlpha = 1; }
  } });
  c.track('lia', [{ t: 0, p: [4.4, 0, -4.4], ry: PI + 0.7, a: t < tG ? 'point' : 'think', e2: t > tE ? 'worried' : 'neutral' }]);
  c.track('caio', [{ t: 0, p: [-4.4, 0, -4.4], ry: PI - 0.5, a: 'think', e2: t > tE ? 'scared' : 'neutral' }]);
  boardCam(c, 0, c.dur, 2.4, 1.8);
  if (t > tA) c.flash('#ff0000', 0.06 + 0.05 * Math.sin(t * 10));
};

// ================= b23 =================
SHOTS.b23 = (c) => {
  const t = c.t; const tK = c.at('trinta quilômetros'), tR = c.at('Ruas rachadas'), tY = c.at('dez anos'), tV = c.at('Ele vai');
  c.sfx('engine', 0, 0.6); c.sfx('wheelie', tV, 0.8); c.sfx('whoosh', tR, 0.4); c.sfx('whoosh', tY, 0.4);
  c.env('street', { tod: 'gray', ruin: true, grow: 0.22, cars: true });
  const spd = 13 + 6 * prog(t, tV, c.dur); const d = t * 13 + (t > tV ? (t - tV) * (t - tV) * 3 : 0); const z = 24 - d; const x = 0.35 * Math.sin(z * 0.11);
  const M = c.PROPS.moto; M.visible = true; M.position.set(x, 0, z); M.rotation.y = PI + Math.cos(z * 0.11) * 0.04; wheelsSpin(M, d);
  const wl = t > tV ? Math.min(0.5, (t - tV) * 0.7) : 0; M.rotation.x = -wl; 
  c.track('caio', [{ t: 0, p: [x, 0.37, z - 0.12], ry: PI, a: 'ride', e2: 'smirk' }]);
  c.track('lia', [{ t: 0, p: [x, 0.37, z + 0.5], ry: PI, a: 'hug', e2: 'scared' }]);
  if (t < tR) c.camSet([x + 3.0, 1.5, z + 5.5], [x, 1.0, z - 3], 50);
  else if (t < tY) c.camSet([x - 1.6, 0.7, z - 6.5], [x, 1.1, z], 52);
  else if (t < tV) c.camSet([x + 2.2, 1.1, z + 0.5], [x, 1.1, z - 0.3], 46);
  else c.camSet([x, 1.9 + (t - tV) * 0.2, z + 6.0], [x, 1.2, z - 8], 50);
  const km = Math.max(0, 30 * (1 - prog(t, 0.5, c.dur - 0.4))); c.chip(1560, 120, 'TANQUE: ' + Math.ceil(km) + ' KM', 'blue', 0.3, 1e9);
  if (t > tY) c.chip(380, 120, '10 ANOS ENTREGANDO PIZZA', 'gold', tY, tV - 0.2);
  c.shake(0.35);
};

// ================= b24 =================
SHOTS.b24 = (c) => {
  const t = c.t; const tOn = c.at('onze minutos'), tP = c.at('A porta'), tS = c.at('ombro'), tNo = c.at('Não abre'), tR = c.at('respira'), tCh = c.at('chave de fenda');
  c.sfx('whoosh', 0, 0.5); c.sfx('alarm', 0, 0.4); c.sfx('hit', tS + 1.05, 1.0); c.sfx('click', tCh + 1.0, 0.7); c.sfx('door', tCh + 1.5, 0.6);
  const sec = 660 - Math.max(0, t - tOn); const sw = ease.io(prog(t, tS + 1.4, tCh + 0.5)); const open = ease.io(prog(t, tCh + 1.5, tCh + 2.3)) * -1.5;
  c.env('lab', { alarm: 1, timer: mmss(sec), level: 0.1, dispOk: false, doorOpen: open });
  const run = prog(t, 0, tOn - 0.2);
  // chegada
  if (t < tS) c.track('caio', [{ t: 0, p: [9.0, 0, 3.7], ry: -PI / 2, a: 'run', e2: 'scared' }, { t: tOn - 0.2, p: [-3.2, 0, 3.7], ry: -PI / 2, a: 'run', e2: 'scared' }, { t: tOn - 0.19, p: [-3.2, 0, 3.7], ry: -PI / 2, a: 'tired', e2: 'tired' }]);
  else { const k = prog(t, tS, tS + 1.0); const hit = t > tS + 1.0; const kb = prog(t, tS + 1.0, tS + 1.5);
    c.track('caio', [{ t: tS, p: [-3.2, 0, 3.7], ry: -PI / 2, a: 'shoulder', e2: 'angry' }, { t: tS + 1.0, p: [-9.2, 0, 3.5], ry: -PI / 2, a: 'shoulder', e2: 'angry', e: 'i' }, { t: tS + 1.01, p: [-9.2, 0, 3.5], ry: -PI / 2, a: 'hurt', e2: 'scared' }, { t: tS + 1.5, p: [-8.0, 0, 3.5], ry: -PI / 2, a: 'hurt', e2: 'scared' }, { t: tCh + 3, p: [-8.0, 0, 3.5], ry: -PI / 2, a: 'tired', e2: 'worried' }]); }
  c.track('lia', [{ t: 0, p: [10.6, 0, 3.0], ry: -PI / 2, a: 'run', e2: 'scared' }, { t: tOn - 0.2, p: [-1.4, 0, 2.2], ry: -PI / 2, a: 'run', e2: 'scared' }, { t: tOn - 0.19, p: [-1.4, 0, 2.2], ry: -PI / 2, a: 'idle', e2: 'worried' }, { t: tR - 0.1, p: [-1.4, 0, 2.2], ry: -PI / 2, a: 'idle', e2: 'worried' }, { t: tR + 0.9, p: [-1.4, 0, 2.2], ry: -PI / 2, a: 'think', e2: 'neutral' }, { t: tCh, p: [-1.4, 0, 2.2], ry: -PI / 2, a: 'walk', e2: 'neutral', hold: 'wrench' }, { t: tCh + 1.2, p: [-8.6, 0, 2.2], ry: -PI / 2, a: 'walk', e2: 'neutral', hold: 'wrench' }, { t: tCh + 1.21, p: [-8.7, 0, 2.2], ry: -PI / 2, a: 'tinker', e2: 'neutral', hold: 'wrench' }]);
  if (t < tOn - 0.2) c.cam([{ t: 0, p: [3.5, 2.2, 8.0], l: [0, 1.4, 3.5], f: 50 }, { t: tOn - 0.2, p: [-1.0, 2.0, 7.5], l: [-4, 1.4, 3.5], f: 48 }]);
  else if (t < tP - 0.2) c.cam([{ t: tOn - 0.2, p: [0, 3.0, 3.0], l: [0, 3.0, -7.5], f: 36 }, { t: tP - 0.2, p: [0, 3.0, 1.2], l: [0, 3.0, -7.5], f: 34 }]);
  else if (t < tS) c.cam([{ t: tP - 0.2, p: [-2.0, 1.8, 7.0], l: [-9.0, 1.9, 3.4], f: 46 }, { t: tS, p: [-3.0, 1.8, 6.8], l: [-9.0, 1.9, 3.4], f: 44 }]);
  else if (t < tCh) c.cam([{ t: tS, p: [-3.5, 1.7, 7.0], l: [-9.0, 1.7, 3.5], f: 46 }, { t: tS + 1.0, p: [-6.0, 1.9, 6.8], l: [-9.4, 1.6, 3.5], f: 34 }, { t: tCh, p: [-5.2, 1.6, 6.6], l: [-8.6, 1.5, 3.4], f: 38 }]);
  else c.cam([{ t: tCh, p: [-5.6, 1.5, 6.0], l: [-9.0, 1.2, 2.6], f: 36 }, { t: c.dur, p: [-6.2, 1.5, 5.2], l: [-9.2, 1.2, 2.4], f: 30 }]);
  c.shake(t > tS + 1.0 && t < tS + 1.4 ? 1.6 : 0.25); if (t > tS + 1.0 && t < tS + 1.2) c.flash('#ffffff', 0.35);
  if (t > tNo && t < tR) c.ui(stamp('TRANCADA', { top: 300, size: 90, rot: -5 }));
  c.chip(1560, 120, 'BATERIA: ' + mmss(sec).slice(3), 'red', tOn, 1e9);
};

// ================= b25 =================
SHOTS.b25 = (c) => {
  const t = c.t; const tPa = c.at('parafusos'), tCab = c.at('Cabo vermelho'), tMan = c.at('manivela'), tT1 = c.at('tosse.'), tT2 = c.at('Tosse de novo'), tL = c.at('E liga'), tLu = c.at('luzes voltam'), tTa = c.at('tanque volta'), tQ = c.at('Faltavam');
  c.sfx('crank', tMan, 0.7); c.sfx('cough', tT1, 0.9); c.sfx('cough', tT2, 0.9); c.sfx('engine', tL, 0.9); c.sfx('power', tL + 0.1, 0.9); c.sfx('ding', tTa, 0.6); c.sfx('ding', tQ + 0.3, 0.8);
  if (t < tQ) {
    const on = t >= tL; const fl = (t >= tL - 0.15 && t < tL + 0.4) ? (Math.sin(t * 50) > 0 ? 1 : 0.3) : (on ? 1 : 0);
    const crank = t > tMan ? (t - tMan) * 9 : 0; const sm = (t > tT1 && t < tT1 + 0.9) || (t > tT2 && t < tT2 + 0.9) ? 0.8 : (on ? 0.35 : 0); const shk = t > tMan ? (on ? 0.5 : 0.35) + (sm > 0.7 ? 0.9 : 0) : 0;
    c.env('gen', { power: fl, shake: shk, crank, smoke: sm });
    const pre = t < tMan;
    c.track('lia', [{ t: 0, p: [-0.9, 0, -0.5], ry: PI, a: t < tCab ? 'tinker' : (t < tMan ? 'tinker' : (on ? 'clap' : 'idle')), e2: on ? 'happy' : 'worried', hold: t < tCab ? 'wrench' : null }]);
    c.track('caio', [{ t: 0, p: [-3.6, 0, -4.2], ry: 0, a: 'idle', e2: 'worried' }, { t: tMan - 0.6, p: [-3.6, 0, -4.2], ry: 0, a: 'idle', e2: 'worried' }, { t: tMan, p: [-3.5, 0, -2.4], ry: PI / 2, a: 'crank', e2: 'angry' }, { t: tL - 0.01, p: [-3.5, 0, -2.4], ry: PI / 2, a: 'crank', e2: 'angry' }, { t: tL, p: [-3.5, 0, -2.4], ry: PI / 2, a: 'cheer', e2: 'happy' }]);
    if (t < tCab) c.cam([{ t: 0, p: [2.6, 1.8, 3.0], l: [-0.8, 1.0, -1.6], f: 42 }, { t: tCab, p: [1.6, 1.6, 2.2], l: [-0.8, 0.9, -1.2], f: 36 }]);
    else if (t < tMan) c.cam([{ t: tCab, p: [2.2, 2.0, 0.6], l: [1.3, 1.9, -1.5], f: 30 }, { t: tMan, p: [2.0, 2.0, 0.2], l: [1.3, 1.9, -1.5], f: 26 }]);
    else if (t < tL + 0.3) c.cam([{ t: tMan, p: [4.0, 2.2, 3.4], l: [-0.3, 1.5, -2.4], f: 48 }, { t: tL, p: [3.0, 2.0, 2.4], l: [0.0, 1.6, -2.4], f: 42 }]);
    else c.cam([{ t: tL, p: [3.2, 1.9, 5.0], l: [-0.8, 2.2, -2.0], f: 52 }, { t: tQ, p: [1.8, 2.0, 5.8], l: [-1.0, 2.3, -2.0], f: 54 }]);
    if (t < tCab) { const n = Math.round(100 * prog(t, tPa - 0.2, tPa + 1.6)); c.chip(1560, 140, 'PARAFUSOS SOLTOS: ' + n, 'gold', tPa - 0.2, 1e9); }
    if (t >= tCab && t < tMan) c.chip(960, 150, 'CABO VERMELHO → POLO CERTO', 'red', tCab, 1e9);
    if (t > tT1 && t < tL) c.chip(960, 150, 'TOSSE...', 'gold', tT1, tL);
    if (t >= tL - 0.15 && t < tL + 0.3) c.flash('#fff2b0', 0.35);
    if (t > tL && t < tL + 1.2) c.ui(bigNum('LIGOU!', 960, 230, { size: 130, color: '#3ddc6a', glow: 'rgba(61,220,106,.7)', s: pop(t, tL, 0.3) || 1 }));
  } else {
    const k = prog(t, tQ, c.dur); c.env('lab', { alarm: 0, timer: '00:00:40', level: lerp(0.25, 0.95, ease.o(k)), dispOk: true, power: 1, mist: 1 });
    c.cam([{ t: tQ, p: [0, 3.0, 5.5], l: [0, 3.0, -7.5], f: 40 }, { t: c.dur, p: [0, 3.0, 4.2], l: [0, 3.0, -7.5], f: 38 }]);
    c.chip(960, 760, 'FALTAVAM 40 SEGUNDOS', 'green', tQ + 0.4, 1e9);
  }
};

// ================= b26 =================
SHOTS.b26 = (c) => {
  const t = c.t; const tA = c.at('Os anos passam'), tF = c.at('Mas em volta'), tN3 = c.at('Três.'), tN5 = c.at('Cinco.'), tN9 = c.at('Nove.'), tN14 = c.at('Catorze.'), tN23 = c.at('Vinte e três');
  c.sfx('tick', 0.3, 0.4); c.sfx('wind', 0, 0.3); c.sfx('crackle', tF, 0.5); [tN3, tN5, tN9, tN14].forEach(q => c.sfx('pop', q, 0.6)); c.sfx('cheer', tN23, 0.6);
  if (t < tF - 0.3) {
    const u = prog(t, 0.2, tF - 0.5); const yr = Math.round(1 + 39 * u);
    c.env('street', { tod: 'day', ruin: true, grow: ease.io(u), collapse: clamp((u - 0.45) / 0.55) * 0.95, cars: true });
    const old = u > 0.4; c.track(old ? 'caioOld' : 'caio', [{ t: 0, p: [-0.9, 0, 28], ry: PI, a: 'idle', e2: 'neutral' }]); c.track(old ? 'liaOld' : 'lia', [{ t: 0, p: [0.9, 0, 28.2], ry: PI, a: 'idle', e2: 'neutral' }]);
    c.cam([{ t: 0, p: [0, 2.6, 34], l: [0, 4.5, -80], f: 50 }, { t: tF - 0.3, p: [0, 4.0, 35], l: [0, 6, -80], f: 50 }]);
    c.ui(bigNum('ANO ' + yr, 960, 130, { size: 130, color: '#ffd21f', glow: 'rgba(255,210,31,.5)' }));
    if (t > tF - 0.7) c.state.fade = prog(t, tF - 0.7, tF - 0.3);
  } else {
    c.env('final', { night: true }); const F = c.PROPS.fire; F.visible = true; F.position.set(0, 0, 0); F.scale.setScalar(0.9); F.userData.flames.forEach((m, i) => m.scale.y = 1 + 0.25 * Math.sin(t * 11 + i)); c.glow([0, 1.0, 0.2], 0xff8a2a, 22);
    c.state.fade = 1 - prog(t, tF - 0.3, tF + 0.3);
    const n = t >= tN23 ? 23 : t >= tN14 ? 14 : t >= tN9 ? 9 : t >= tN5 ? 5 : t >= tN3 ? 3 : 2;
    c.track('caioOld', [{ t: 0, p: [-1.1, 0, 2.0], ry: PI, a: 'floor', e2: 'happy' }]); c.track('liaOld', [{ t: 0, p: [1.1, 0, 2.0], ry: PI, a: 'floor', e2: 'happy' }]);
    const R = seeded(21); const list = []; const cols = [0xd6561c, 0x2a6ad6, 0x1c9a4a, 0xd6a31c, 0x8a3ad6, 0xe02020, 0x0aa6b8];
    for (let i = 0; i < 21; i++) { const ang = Math.PI * (0.12 + 0.76 * (i / 20)) + 0; const side = i % 2 ? 1 : -1; const rr = 2.6 + (i % 3) * 0.9; const px = Math.cos(ang + (side > 0 ? 0 : Math.PI)) * rr * 1.0; const pz = -Math.abs(Math.sin(ang)) * rr * 0.9 - 0.2; list.push({ p: [px, 0, pz], ry: Math.atan2(-px, -pz), c: cols[i % 7], s: 0.9 + 0.1 * R(), a: i < n - 2 && t > tN23 ? 'cheer' : 'idle' }); }
    c.crowd(list.slice(0, Math.max(0, n - 2)));
    c.cam([{ t: tF, p: [0, 2.1, 6.4], l: [0, 1.1, -1.5], f: 48 }, { t: c.dur, p: [0, 2.8, 8.4], l: [0, 1.3, -1.5], f: 48 }]);
    const lastChg = Math.max(...[tN3, tN5, tN9, tN14, tN23].filter(q => q <= t), tF); const s = 1 + 0.5 * Math.max(0, 1 - (t - lastChg) / 0.3);
    c.ui(center('PESSOAS', { top: 70, size: 34, color: '#ffe9b0', ls: 8 })); c.ui(bigNum(n, 960, 170, { size: 150, color: '#ffd21f', glow: 'rgba(255,210,31,.6)', s }));
  }
};

// ================= b27 =================
SHOTS.b27 = (c) => {
  const t = c.t; const tR = c.at('Recomeçou com dois'); c.sfx('pad', 0, 0.5);
  c.env('final', { night: false });
  c.track('caioOld', [{ t: 0, p: [-0.7, 0, 0], ry: PI, a: 'floor', e2: 'happy' }]); c.track('liaOld', [{ t: 0, p: [0.7, 0, 0.1], ry: PI, a: 'floor', e2: 'happy' }]);
  c.cam([{ t: 0, p: [0.2, 1.5, 3.4], l: [0, 1.5, -20], f: 44 }, { t: c.dur, p: [0.6, 2.6, 8.4], l: [0, 1.9, -20], f: 44 }]);
  c.chip(960, 160, 'DOIS + TUDO O QUE FOI GUARDADO', 'gold', tR, 1e9);
  c.state.fade = prog(t, c.dur - 0.5, c.dur);
};

// ================= b28 =================
SHOTS.b28 = (c) => {
  const t = c.t; const tQ = c.at('E você'), tM = c.at('mundo'), tT = c.at('tanque'), t98 = c.at('noventa e oito'), tS = c.at('Se inscreve'), tB = c.at('Até lá');
  c.sfx('pop', tM, 0.6); c.sfx('pop', tT, 0.6); c.sfx('whoosh', t98, 0.5); c.sfx('click', tS + 1.1, 0.8); c.sfx('ding', tS + 1.15, 0.6); c.sfx('tada', tB, 0.6);
  c.env('outro');
  const w = t > tB;
  c.track('caio', [{ t: 0, p: [-2.4, 0, 5.2], ry: 0.3, a: w ? 'wave' : 'idle', e2: 'happy' }]); c.track('lia', [{ t: 0, p: [2.4, 0, 5.2], ry: -0.3, a: w ? 'wave' : 'idle', e2: 'happy' }]);
  c.cam([{ t: 0, p: [0, 1.9, 11.4], l: [0, 2.0, 5], f: 42 }, { t: c.dur, p: [0, 2.0, 10.4], l: [0, 2.0, 5], f: 42 }]);
  if (t > tQ && t < t98 - 0.3) { const a = clamp((t - tQ) / 0.4); const pm = pop(t, tM, 0.25), pt = pop(t, tT, 0.25);
    c.ui(`<div class="abs" style="left:0;top:170px;width:1920px;text-align:center;font-weight:900;font-size:56px;color:#fff;opacity:${a};text-shadow:0 5px 0 #000">MUNDO OU TANQUE?</div>`);
    c.ui(`<div class="abs" style="left:380px;top:270px;width:480px;padding:26px 0;text-align:center;border-radius:26px;background:#ffd21f;color:#111;font-weight:900;font-size:90px;transform:scale(${pm ? pm : 0.001});box-shadow:0 10px 0 #a88a00">MUNDO</div>`);
    c.ui(`<div class="abs" style="left:1060px;top:270px;width:480px;padding:26px 0;text-align:center;border-radius:26px;background:#38d6ff;color:#111;font-weight:900;font-size:90px;transform:scale(${pt ? pt : 0.001});box-shadow:0 10px 0 #1b8aa8">TANQUE</div>`); }
  if (t > t98 - 0.2 && t < tS - 0.1) { const list = []; for (let i = 0; i < 98; i++) { const cc = i % 14, rr = Math.floor(i / 14); list.push({ p: [(cc - 6.5) * 1.15, 0, -2 - rr * 1.5], ry: 0, c: [0xd6561c, 0x2a6ad6, 0x1c9a4a, 0xd6a31c, 0x8a3ad6, 0xe02020, 0x0aa6b8][i % 7], s: 1, a: 'idle' }); }
    const k = prog(t, t98 - 0.2, t98 + 1.2); c.crowd(list.slice(0, Math.ceil(98 * k)));
    c.ui(`<div class="abs" style="left:0;top:120px;width:1920px;text-align:center;font-weight:900;font-size:60px;color:#fff;text-shadow:0 5px 0 #000">E SE A HUMANIDADE RECOMEÇASSE COM</div>`); c.ui(bigNum('98 PESSOAS?', 960, 270, { size: 150, color: '#ffd21f', glow: 'rgba(255,210,31,.6)', s: pop(t, t98 + 0.2, 0.3) || 1 }));
    c.cam([{ t: t98 - 0.2, p: [0, 3.4, 12], l: [0, 1.4, -4], f: 50 }, { t: tS - 0.1, p: [0, 3.0, 11], l: [0, 1.4, -4], f: 50 }]); }
  if (t < tB) subBtn(c, tS);
  if (t > tS + 1.5 && t < tB) { const s = pop(t, tS + 1.5, 0.3) || 1; c.ui(bigNum('+ LIKE', 1400, 560, { size: 80, color: '#2b7bff', s })); }
  if (t > tB) c.ui(bigNum('ATÉ LÁ!', 960, 250, { size: 190, color: '#ffd21f', glow: 'rgba(255,210,31,.7)', s: pop(t, tB, 0.3) || 1 }));
  c.state.fade = prog(t, c.dur - 1.0, c.dur);
};
