// LONGO: "E se a humanidade tivesse que recomeçar em Marte?" — palito, 1920x1080.
import { clamp, lerp, ease, PI, prog, center, stamp, bigNum, pop, seeded, subBtn, boardCam } from '/engine/kit.js';
export const SHOTS = {};
const P0 = { num: null, flag: false };
export const CAST = {
  lia: { style: 'palito', ...P0, shirt: 0xff7a1a, trim: 0xffffff, shorts: 0x2b2f45, hair: 'lia', scale: 0.96 },
  rafa: { style: 'palito', ...P0, shirt: 0x2fa35a, trim: 0x1a5a2a, shorts: 0x5a4a2a, cap: 0x2fa35a },
  nina: { style: 'palito', ...P0, shirt: 0xf4f4f4, trim: 0x2aa198, shorts: 0x2aa198, hair: 'lia', scale: 0.96 },
  teo: { style: 'palito', ...P0, shirt: 0x2a6ad6, trim: 0xffd21f, shorts: 0x222a44, cap: 0x111111, capYaw: PI },
};
const COLS = [0xff7a1a, 0x2a6ad6, 0x2fa35a, 0xf4f4f4, 0xd6a31c, 0x8a3ad6, 0x0aa6b8, 0xe02020];
const ring = (n, cx, cz, r0, o = {}) => { const R = seeded(o.seed || 5); const L = []; for (let i = 0; i < n; i++) { const a = i * 2.399 + R() * 0.3; const r = r0 + Math.sqrt(i) * (o.sp || 0.75); const x = cx + Math.cos(a) * r, z = cz + Math.sin(a) * r; L.push({ p: [x, 0, z], ry: Math.atan2(cx - x, cz - z) + (R() - 0.5) * 0.6, c: COLS[i % COLS.length], s: 0.85 + 0.15 * R(), a: o.a ? o.a(i) : 'idle' }); } return L; };
const chipsAt = (c, list) => list.forEach(([w, x, y, txt, cls]) => { const tt = c.at(w); if (c.t >= tt) c.chip(x, y, txt, cls, tt, 1e9); });
const title = (c, txt, t0, o = {}) => { if (c.t < t0) return; const s = pop(c.t, t0, 0.3) || 1; c.ui(`<div class="abs" style="left:0;right:0;top:${o.top ?? 70}px;text-align:center;transform:scale(${s})"><div style="display:inline-block;background:${o.bg ?? '#d62828'};border:7px solid #fff;border-radius:22px;padding:6px 60px;font-weight:900;font-size:${o.size ?? 96}px;color:${o.color ?? '#fff'};transform:rotate(-2deg);box-shadow:0 14px 0 rgba(0,0,0,.45)">${txt}</div></div>`); };
const energy = (c, v, o = {}) => { const col = v > 60 ? '#3ddc6a' : v > 30 ? '#ffb02e' : '#ff3b30'; c.ui(`<div class="abs" style="left:${o.x ?? 1440}px;top:${o.y ?? 60}px;width:420px;padding:16px 20px;border-radius:20px;background:rgba(10,10,14,.82);border:4px solid ${col}"><div style="font-weight:900;font-size:34px;color:#fff;letter-spacing:3px">⚡ ENERGIA DA BASE</div><div style="margin-top:10px;height:34px;border-radius:10px;background:#222"><div style="height:100%;width:${clamp(v / 100) * 100}%;border-radius:10px;background:${col}"></div></div><div style="text-align:right;font-weight:900;font-size:52px;color:${col};margin-top:4px">${Math.round(v)}%</div></div>`); };
// estufa: centro (12, -12); posições locais -> mundo
const GH = (x, z, y = 0) => [12 + x, y, -12 + z];
// cabine da nave: assentos x=±1.15/±2.0, fileiras z = 6 - 1.4 r; palito sentado y≈0.22, olhando p/ -z
const SEAT = (x, r) => [x, 0.22, 6 - 1.4 * r];
function cabinCrowd(c, skip = []) { let k = 0; for (let r = 0; r < 9; r++) for (const x of [-2.0, -1.15, 1.15, 2.0]) { if (skip.some(([sx, sr]) => sx === x && sr === r)) continue; if (k >= 30) return; c.mini(k++, { p: SEAT(x, r), ry: PI, a: 'sit', e: (r + k) % 3 ? 'neutral' : 'happy', s: 0.95 }); } }

// ================= GANCHO =================
SHOTS.b01 = (c) => {
  const t = c.t; const tT = c.at('sessenta graus'), tA = c.at('quase nenhum ar'), tD = c.at('cinquenta milhões'), tU = c.at('única casa'); c.sfx('wind', 0, 0.6); c.sfx('riser', 0.3, 0.6); [tT, tA, tD].forEach(q => c.sfx('pop', q, 0.6)); c.sfx('boom', tU, 0.9);
  c.env('mars', { tod: 'day' });
  if (t < tU) {
    c.cam([{ t: 0, p: [40, 30, 60], l: [0, 2, -12], f: 46 }, { t: tU, p: [16, 10, 22], l: [2, 2, -10], f: 46 }]);
  } else {
    c.crowd(ring(96, 0, 1.5, 2.2, { seed: 3, sp: 0.55 }).map(q => ({ ...q, ry: PI + (q.ry - PI) * 0.2 })));
    ['lia', 'rafa', 'nina', 'teo'].forEach((n, i) => c.track(n, [{ t: 0, p: [-1.8 + i * 1.2, 0, 4.2], ry: PI, a: 'lookup', e2: 'neutral', suit: true }]));
    c.cam([{ t: tU, p: [0, 2.0, 9.5], l: [0, 2.8, -6], f: 50 }, { t: c.dur, p: [0, 3.2, 14], l: [0, 2.8, -6], f: 50 }]);
    c.ui(bigNum('100', 960, 170, { size: 170, color: '#ffd21f', glow: 'rgba(255,210,31,.7)', s: pop(t, tU, 0.3) || 1 })); c.chip(960, 290, 'PESSOAS', 'gold', tU, 1e9);
    c.flash('#ffffff', Math.max(0, 0.5 * (1 - (t - tU) / 0.25)));
  }
  chipsAt(c, [['sessenta graus', 380, 900, '−60 °C', 'blue'], ['quase nenhum ar', 960, 900, 'AR IRRESPIRÁVEL', 'red'], ['cinquenta milhões', 1540, 900, '+55 MILHÕES DE KM', 'gold']].filter(() => t < tU));
};

SHOTS.b02 = (c) => {
  const t = c.t; const tP = c.at('Os painéis'), tE = c.at('a energia'); c.sfx('wind', 0, 0.9); c.sfx('alarm', tE, 0.4);
  const st = lerp(0.1, 0.55, prog(t, 0, c.dur)); c.env('mars', { tod: 'day', storm: st, dust: prog(t, tP - 1, c.dur) * 0.8 });
  c.track('lia', [{ t: 0, p: [-14, 0, 6.2], ry: PI + 0.3, a: t < tP ? 'lookaround' : 'idle', e2: 'worried', suit: true }]);
  if (t < tP) c.cam([{ t: 0, p: [10, 3, 14], l: [-30, 8, -60], f: 50 }, { t: tP, p: [6, 2.6, 12], l: [-30, 6, -60], f: 50 }]);
  else if (t < tE) c.cam([{ t: tP, p: [-11, 2.6, 9.5], l: [-15, 1.0, 1], f: 44 }, { t: tE, p: [-12, 2.4, 9], l: [-15, 1.0, 1], f: 40 }]);
  else c.frame('lia', { yaw: 0.4, d: 2.8, h: 1.6, f: 40, to: { d: 2.4 } });
  c.ui(center('TEMPESTADE DE POEIRA', { top: 50, size: 64, color: '#ffb27a', a: clamp((t - 0.3) / 0.3) * (t < tP ? 1 : 0) }));
  if (t > tE) energy(c, lerp(62, 48, prog(t, tE, c.dur)));
};

SHOTS.b03 = (c) => {
  const t = c.t; const tC = c.at('a comida'), tL = c.at('A Lia tem'), tD = c.at('dois anos'); c.sfx('heartbeat', 0.2, 0.6); c.sfx('whoosh', tD, 0.6);
  c.env('mars', { tod: 'day', storm: 0.6, glow: 0.4 + 0.3 * Math.sin(t * 17) * (t > 1 ? 1 : 0), green: 1, dust: 0.8 });
  c.track('lia', [{ t: 0, p: GH(-0.6, 2.5), ry: PI, a: 'think', e2: 'worried' }]);
  if (t < tL) c.cam([{ t: 0, p: GH(1.6, -1.9, 2.0), l: GH(-0.6, 2.5, 1.2), f: 50 }, { t: tL, p: GH(1.4, -1.7, 1.9), l: GH(-0.6, 2.5, 1.2), f: 46 }]);
  else c.cam([{ t: tL, p: GH(0.6, 0.6, 1.8), l: GH(-0.6, 2.5, 1.6), f: 40 }, { t: c.dur, p: GH(0.5, 0.9, 1.8), l: GH(-0.6, 2.5, 1.6), f: 36 }]);
  if (t > tC && t < tD) c.chip(960, 120, 'COMIDA DE 1 ANO EM RISCO', 'red', tC, tD);
  if (t > tL && t < tD) c.chip(960, 210, 'PRAZO: POUCAS HORAS', 'gold', tL, tD);
  const k = prog(t, tD + 0.6, tD + 1.3); if (k > 0) { c.state.fade = k; c.ui(center('2 ANOS ANTES', { top: 440, size: 130, a: k, s: 0.9 + 0.1 * k, ls: 3 })); }
};

// ================= COMEÇO =================
SHOTS.b04 = (c) => {
  const t = c.t; const tL = c.at('a Lia'), tN = c.at('numa nave'), tS = c.at('sete meses'); c.sfx('engine', 0, 0.4); c.sfx('pop', tL + 0.3, 0.5); c.sfx('boom', tS, 0.6);
  c.state.fade = 1 - prog(t, 0, 0.5);
  c.env('plane', { space: true, shake: 0.3 });
  c.track('lia', [{ t: 0, p: SEAT(-1.15, 2), ry: PI, a: 'sit', e2: t < tS ? 'neutral' : 'happy' }]);
  cabinCrowd(c, [[-1.15, 2]]);
  if (t < tN) c.cam([{ t: 0, p: [0.05, 1.75, 1.9], l: [-1.15, 1.3, 3.2], f: 50 }, { t: tN, p: [0.05, 1.75, 2.1], l: [-1.15, 1.3, 3.2], f: 46 }]);
  else c.cam([{ t: tN, p: [0.2, 2.6, -8], l: [0, 1.0, 6], f: 54 }, { t: c.dur, p: [0.1, 2.4, -6], l: [0, 1.0, 6], f: 54 }]);
  if (t > tL && t < tN) c.chip(960, 110, 'LIA · 31 ANOS · ENGENHEIRA DE ENERGIA', 'gold', tL, tN);
  if (t > tN) c.chip(960, 120, '100 PESSOAS A BORDO', 'blue', tN, 1e9);
  if (t > tS) c.ui(bigNum('7 MESES', 960, 260, { size: 130, color: '#ffd21f', glow: 'rgba(255,210,31,.6)', s: pop(t, tS, 0.3) || 1 }));
};

SHOTS.b05 = (c) => {
  const t = c.t; const ts = [c.at('um botânico'), c.at('Uma médica'), c.at('E o Teo'), c.at('treme')]; ts.slice(0, 3).forEach(q => c.sfx('pop', q + 0.3, 0.6)); c.sfx('crash', ts[3], 0.5); c.sfx('laugh', ts[3] + 0.4, 0.5);
  const shake = t > ts[3] ? 1.4 : 0.3; c.env('plane', { space: true, shake });
  const who = [['rafa', 1.15, 3, 'RAFA · BOTÂNICO', 'green'], ['nina', -1.15, 4, 'DRA. NINA · MÉDICA', 'blue'], ['teo', 1.15, 5, 'TEO · 22 · PILOTO', 'gold']];
  who.forEach(([n, x, r], i) => c.track(n, [{ t: 0, p: SEAT(x, r), ry: PI, a: n === 'teo' && t > ts[2] ? 'talk' : 'sit', e2: n === 'teo' ? 'happy' : 'neutral', over: n === 'teo' && t > ts[2] ? { hipY: 0.42 } : undefined }]));
  c.track('lia', [{ t: 0, p: SEAT(-1.15, 2), ry: PI, a: 'sit', e2: 'happy' }]);
  cabinCrowd(c, [[1.15, 3], [-1.15, 4], [1.15, 5], [-1.15, 2]]);
  let i = 0; for (let k = 0; k < 3; k++) if (t >= ts[k]) i = k;
  const [n, x, r, lab, cls] = who[i]; const z = 6 - 1.4 * r; const t0 = i ? ts[i] : 0, t1 = i < 2 ? ts[i + 1] : c.dur;
  c.cam([{ t: t0, p: [0, 1.75, z - 1.3], l: [x, 1.3, z], f: 50 }, { t: t1, p: [0, 1.75, z - 1.1], l: [x, 1.3, z], f: 46 }]);
  if (t > ts[3]) c.shake(0.8);
  c.chip(960, 110, lab, cls, t0 + 0.2, t1);
  if (t > ts[3]) c.ui(stamp('HAHAHA', { top: 140, size: 80, color: '#ffd21f', s: pop(t, ts[3], 0.3) || 1 }));
};

SHOTS.b06 = (c) => {
  const t = c.t; const tI = [['Nem comida', 'COMIDA', 0], ['nem peças', 'PEÇAS', 1], ['nem gente', 'GENTE', 2]].map(([k, l, i]) => [c.at(k), l, i]); const tM = c.at('tirar de Marte');
  c.sfx('hit', 0.3, 1); tI.forEach(([q]) => c.sfx('error', q, 0.5)); c.sfx('whoosh', tM, 0.5);
  c.env('void');
  c.track('lia', [{ t: 0, p: [0, 0, 0], ry: 0, a: t > tM ? 'point' : 'idle', e2: 'worried' }]);
  c.cam([{ t: 0, p: [0, 1.7, 7.5], l: [0, 1.6, 0], f: 44 }, { t: c.dur, p: [0, 1.7, 6.2], l: [0, 1.5, 0], f: 44 }]);
  title(c, 'REGRA Nº 1', 0.3);
  c.ui(`<div class="abs" style="left:0;right:0;top:240px;text-align:center;font-weight:900;font-size:56px;color:#ffd21f;opacity:${clamp((t - 0.7) / 0.3)};text-shadow:0 5px 0 #000">A TERRA NÃO MANDA MAIS NADA</div>`);
  tI.forEach(([tt, l, i]) => { if (t > tt) c.ui(`<div class="abs" style="left:${[380, 960, 1540][i]}px;top:850px;transform:translate(-50%,-50%) scale(${pop(t, tt, 0.25) || 1});padding:10px 34px;border-radius:16px;background:rgba(60,10,10,.9);border:4px solid #ff4b3e;color:#ff8a80;font-weight:900;font-size:50px;text-decoration:line-through">${l}</div>`); });
  if (t > tM) c.chip(960, 340, 'TUDO VEM DE MARTE', 'gold', tM, 1e9);
};

SHOTS.b07 = (c) => {
  const t = c.t; const tM = c.at('Medições'), tC = c.at('centenas'); c.sfx('buzz', 0.2, 0.4); c.sfx('dramatic', tC, 0.7);
  c.env('plane', { space: true, shake: 0.2 });
  c.track('nina', [{ t: 0, p: SEAT(-1.15, 4), ry: PI, a: 'sit', e2: t > tC ? 'scared' : 'worried' }]);
  cabinCrowd(c, [[-1.15, 4]]);
  c.cam([{ t: 0, p: [0.05, 1.75, -0.9], l: [-1.15, 1.3, 0.4], f: 50 }, { t: c.dur, p: [0.05, 1.75, -0.7], l: [-1.15, 1.3, 0.4], f: 46 }]);
  const k = ease.o(prog(t, tC, tC + 1.0));
  c.ui(`<div class="abs" style="left:1180px;top:150px;width:620px;padding:24px;border-radius:24px;background:rgba(8,10,20,.85);border:4px solid #4aa3ff;opacity:${clamp((t - tM) / 0.3)}">
    <div style="font-weight:900;font-size:36px;color:#9fd0ff;letter-spacing:2px">RADIAÇÃO POR DIA</div>
    <div style="display:flex;align-items:flex-end;gap:40px;height:420px;margin-top:16px">
      <div style="flex:1;text-align:center"><div style="height:${8}px;background:#3ddc6a;border-radius:6px"></div><div style="font-weight:900;font-size:34px;color:#fff;margin-top:8px">TERRA</div></div>
      <div style="flex:1;text-align:center"><div style="height:${8 + 360 * k}px;background:#ff3b30;border-radius:6px"></div><div style="font-weight:900;font-size:34px;color:#fff;margin-top:8px">VIAGEM</div></div></div>
    <div style="font-size:24px;color:#9fb3c8;margin-top:10px">Fonte: instrumento RAD da Curiosity (NASA), 2013</div></div>`);
  if (t > tC) c.chip(1490, 110, 'CENTENAS DE VEZES MAIS', 'red', tC, 1e9);
};

SHOTS.b08 = (c) => {
  const t = c.t; const tPo = c.at('Pouso'), tA = c.at('A porta'), tP = c.at('pular'), tG = c.at('trinta e oito'), tS = c.at('Ele sobe'), tC = c.at('cai rindo'); c.sfx('boom', 0.2, 0.7); c.sfx('whoosh', tS, 0.6); c.sfx('laugh', tC + 0.2, 0.6);
  c.env('mars', { tod: 'day' });
  if (t < tA) { c.cam([{ t: 0, p: [10, 6, -2], l: [-16, 8, -30], f: 50 }, { t: tA, p: [6, 4, -6], l: [-16, 6, -30], f: 50 }]); c.puffs([-16, 0.3, -30], clamp(1 - t / 2), { color: 0xc0683a, spread: 6, rise: 3, grow: 4 }); }
  else {
    const jy = t > tS ? Math.max(0, Math.sin(clamp((t - tS) / 1.6) * PI) * 1.2) : 0;
    c.track('teo', [{ t: 0, p: [-12, 0, -24], ry: 0.6, a: jy > 0.05 ? 'cheer' : (t > tC ? 'shrug' : 'idle'), e2: 'happy', y: jy, suit: true }]);
    c.track('lia', [{ t: 0, p: [-13.6, 0, -25.2], ry: 0.4, a: 'idle', e2: t > tC ? 'happy' : 'neutral', suit: true }]);
    c.track('rafa', [{ t: 0, p: [-10.6, 0, -25.6], ry: -0.2, a: 'lookaround', e2: 'surprised', suit: true }]);
    c.cam([{ t: tA, p: [-7.5, 2.0, -17.5], l: [-12.2, 1.6, -24.5], f: 46 }, { t: c.dur, p: [-8.2, 1.9, -18.6], l: [-12.2, 1.7, -24.5], f: 42 }]);
    if (t > tG) c.chip(420, 120, 'GRAVIDADE: 38% DA TERRA', 'gold', tG, 1e9);
    if (t > tS) c.tag([-12, 3.4 + jy, -24], '+1 METRO!', 'green', tS, tC + 1);
  }
};

// ================= VANTAGENS =================
SHOTS.b09 = (c) => {
  const t = c.t; const tD = c.at('Um dia lá'), tQ = c.at('Quase igual'), tDo = c.at('dormir'); c.sfx('tick', tD, 0.5); c.sfx('ding', tQ, 0.5); c.sfx('crickets', tDo, 0.4);
  const night = t > tDo; c.env('mars', { tod: night ? 'night' : (t > tQ ? 'dusk' : 'day'), earth: night, power: 1 });
  if (!night) c.cam([{ t: 0, p: [14, 3, 12], l: [0, 2, -12], f: 48 }, { t: tDo, p: [9, 2.6, 8], l: [0, 2.2, -12], f: 48 }]);
  else c.cam([{ t: tDo, p: [6, 1.6, 6], l: [0, 3.2, -12], f: 50 }, { t: c.dur, p: [5, 1.5, 4.5], l: [0, 3.2, -12], f: 50 }]);
  if (t > tD) { c.ui(`<div class="abs" style="left:300px;top:70px;width:1320px;display:flex;gap:40px;justify-content:center;opacity:${clamp((t - tD) / 0.3)}">
    <div style="padding:18px 40px;border-radius:22px;background:rgba(10,30,55,.85);border:4px solid #4aa3ff;text-align:center"><div style="font-weight:900;font-size:34px;color:#9fd0ff">DIA NA TERRA</div><div style="font-weight:900;font-size:86px;color:#fff">24h</div></div>
    <div style="padding:18px 40px;border-radius:22px;background:rgba(60,25,10,.85);border:4px solid #ff7a45;text-align:center"><div style="font-weight:900;font-size:34px;color:#ffb27a">DIA EM MARTE</div><div style="font-weight:900;font-size:86px;color:#fff">24h40</div></div></div>`); }
  if (night) c.ui(bigNum('Z z z', 960, 520, { size: 90, color: '#cfe0ff', a: 0.5 + 0.5 * Math.sin(t * 3) }));
};

SHOTS.b10 = (c) => {
  const t = c.t; const tC = c.at('Congelada'), tL = c.at('A Lia derrete'); c.sfx('ice', tC, 0.6); ['bebida', 'irrigação', 'oxigênio'].forEach(w => c.sfx('pop', c.at(w), 0.6));
  c.env('mars', { tod: 'day' });
  if (t < tL) {
    c.track('lia', [{ t: 0, p: [3, 0, 4], ry: -0.6, a: 'crouch', e2: 'surprised', suit: true, hold: 'wrench' }]);
    c.cam([{ t: 0, p: [5.6, 1.8, 7.6], l: [2.6, 0.6, 3.2], f: 42 }, { t: tL, p: [5.0, 1.6, 6.8], l: [2.6, 0.6, 3.2], f: 38 }]);
    c.ui(`<div class="abs" style="left:${960 - 300}px;top:700px;width:600px;height:110px;border-radius:24px;background:linear-gradient(#e9fbff,#9fdcff);border:5px solid #fff;box-shadow:0 0 40px #9fdcff;opacity:${clamp((t - tC) / 0.3)};text-align:center;font-weight:900;font-size:60px;color:#16465b;line-height:110px">GELO 🧊</div>`);
  } else {
    c.env('classroom', { board: (x, W, H) => { x.textAlign = 'center'; x.font = '900 70px Inter'; x.fillStyle = '#1c6fa8'; x.fillText('GELO  →  ÁGUA', W / 2, 110);
      const items = [['BEBIDA', '#1c9ad6', 'bebida'], ['IRRIGAÇÃO', '#1c9a4a', 'irrigação'], ['OXIGÊNIO', '#d6a31c', 'oxigênio']]; items.forEach(([l, col, w], i) => { if (t < c.at(w)) return; const cx = 300 + i * 470; x.fillStyle = col; x.beginPath(); x.roundRect(cx - 200, 220, 400, 230, 30); x.fill(); x.fillStyle = '#fff'; x.font = '900 56px Inter'; x.fillText(l, cx, 355); }); } });
    c.track('lia', [{ t: 0, p: [4.4, 0, -4.4], ry: PI + 0.7, a: 'point', e2: 'happy' }]);
    boardCam(c, tL, c.dur, 3.0, 2.2);
  }
};

SHOTS.b11 = (c) => {
  const t = c.t; const tM = c.at('MOXIE'), tP = c.at('Pouco'), tC = c.at('cachorrinho'), tF = c.at('Mas funcionou'); c.sfx('ding', tM, 0.5); c.sfx('pop', tP + 0.6, 0.6); c.sfx('aww', tC, 0.5); c.sfx('tada', tF, 0.6);
  c.env('classroom', { board: (x, W, H) => {
    x.fillStyle = '#c9ccd2'; x.beginPath(); x.roundRect(120, 160, 380, 260, 26); x.fill(); x.fillStyle = '#9aa0a8'; x.fillRect(150, 190, 320, 40); x.fillStyle = '#e8b13a'; x.fillRect(150, 250, 320, 20); x.fillStyle = '#111'; x.font = '900 46px Inter'; x.textAlign = 'center'; x.fillText('MOXIE', 310, 360);
    x.fillStyle = '#d6561c'; x.font = '900 60px Inter'; x.fillText('AR DE MARTE  →  O₂', 980, 140);
    if (t > tP) { x.fillStyle = '#1c9a4a'; x.font = '900 150px Inter'; x.fillText('122 g', 980, 330); x.fillStyle = '#555'; x.font = '700 38px Inter'; x.fillText('de oxigênio no total (2021–2023)', 980, 390); }
    if (t > tC) { x.fillStyle = '#7a4a2b'; x.font = '900 58px Inter'; x.fillText('≈ 1 cachorrinho por 10 horas', 980, 490); } } });
  c.track('lia', [{ t: 0, p: [4.4, 0, -4.4], ry: PI + 0.7, a: t > tF ? 'cheer' : 'point', e2: 'happy' }]);
  c.track('teo', [{ t: 0, p: [-1.8, 0, 2.2], ry: PI, a: 'idle', e2: t > tC ? 'happy' : 'neutral' }]);
  if (t < tM) c.cam([{ t: 0, p: [3, 2.2, 6], l: [0, 1.8, -5], f: 50 }, { t: tM, p: [2.4, 2.1, 5], l: [0, 1.8, -5], f: 50 }]);
  else boardCam(c, tM, c.dur, 3.0, 1.6);
  if (t > tM) c.chip(1500, 120, 'NASA · PERSEVERANCE', 'blue', tM, 1e9);
  if (t > tF) c.ui(stamp('FUNCIONOU!', { top: 820, size: 80, color: '#3ddc6a', s: pop(t, tF, 0.3) || 1 }));
};

SHOTS.b12 = (c) => {
  const t = c.t; const tB = c.at('batizam'), tF = c.at('futebol'), tT = c.at('o Teo bate'), tD = c.at('Do planeta'); c.sfx('cheer', tB + 0.6, 0.6); c.sfx('whoosh', tF + 0.5, 0.5); c.sfx('tada', tT + 0.8, 0.5); c.sfx('laugh', tD + 0.3, 0.5);
  c.env('mars', { tod: 'day' });
  if (t < tF) {
    c.crowd(ring(40, 0, 2, 2.0, { seed: 8, sp: 0.5, a: (i) => (Math.sin(t * 3 + i) > 0.3 ? 'cheer' : 'idle') }).map(q => ({ ...q, ry: PI })));
    c.cam([{ t: 0, p: [3, 2.0, 12], l: [0, 2.6, -6], f: 50 }, { t: tF, p: [2, 2.3, 10], l: [0, 2.6, -6], f: 50 }]);
    if (t > tB) c.ui(bigNum('BASE NOVA ESPERANÇA', 960, 140, { size: 100, color: '#ffd21f', glow: 'rgba(255,210,31,.6)', s: pop(t, tB, 0.3) || 1 }));
  } else if (t < tT) {
    const u = prog(t, tF, tT); const bx = lerp(-6, 30, u), by = 0.3 + Math.sin(u * PI) * 14;
    c.prop('ball', { p: [bx, by, 2], s: 2.5 });
    c.track('rafa', [{ t: 0, p: [-6.5, 0, 2], ry: PI / 2, a: u < 0.15 ? 'run' : 'cheer', e2: 'happy', suit: true }]);
    c.cam([{ t: tF, p: [-4, 2.2, 12], l: [0, 3, 2], f: 52 }, { t: tT, p: [4, 3, 16], l: [14, 6, 2], f: 52 }]);
  } else {
    const jy = Math.max(0, Math.sin(clamp((t - tT - 0.3) / 1.8) * PI) * 1.6);
    c.track('teo', [{ t: 0, p: [0, 0, 4], ry: 0.2, a: jy > 0.05 ? 'cheer' : 'idle', e2: 'happy', y: jy, suit: true }]);
    c.crowd(ring(16, 0, 4, 2.4, { seed: 2, a: () => 'cheer' }).filter(q => q.p[2] < 3.5));
    c.cam([{ t: tT, p: [1, 1.8, 10], l: [0, 2.2, 4], f: 46 }, { t: c.dur, p: [1, 1.9, 9], l: [0, 2.4, 4], f: 46 }]);
    c.tag([0, 3.6 + jy, 4], 'RECORDE: 2,3 m', 'gold', tT + 0.5, 1e9);
  }
};

// ================= PREÇO =================
SHOTS.b13 = (c) => {
  const t = c.t; const tT = c.at('a temperatura'), tG = c.at('gás carbônico'), tF = c.at('tão fino'); c.sfx('wind', 0, 0.8); c.sfx('dramatic', 0.1, 0.5); [tT, tG, tF].forEach(q => c.sfx('pop', q + 0.5, 0.6));
  c.env('mars', { tod: 'day', storm: 0.15 });
  c.track('nina', [{ t: 0, p: [1.5, 0, 2], ry: 0.4, a: 'lookaround', e2: 'worried', suit: true, hold: 'light' }]);
  c.cam([{ t: 0, p: [6, 1.6, 9], l: [1.5, 1.6, 2], f: 44 }, { t: c.dur, p: [4.2, 1.7, 6.4], l: [1.5, 1.6, 2], f: 40 }]);
  title(c, 'MARTE NÃO PERDOA', 0.2, { size: 80 });
  chipsAt(c, [['a temperatura', 1500, 330, '−60 °C DE MÉDIA', 'blue'], ['gás carbônico', 1500, 440, '95% GÁS CARBÔNICO', 'red'], ['tão fino', 1500, 550, 'PRESSÃO < 1% DA TERRA', 'red']]);
};

SHOTS.b14 = (c) => {
  const t = c.t; const tV = c.at('perclorato'), tR = c.at('o Rafa precisa'), tB = c.at('balde por balde'); c.sfx('error', tV, 0.6); c.sfx('water', tR, 0.5); c.sfx('water', tB, 0.5);
  c.env('mars', { tod: 'day', green: 0 });
  const walk = t > tR; const x0 = walk ? lerp(1.6, 0.3, prog(t, tR, c.dur)) : 1.6;
  c.track('rafa', [{ t: 0, p: GH(x0, 2.4), ry: -PI / 2, a: walk ? 'carry' : 'lookdown', e2: walk ? 'tired' : 'worried', hold: 'can' }]);
  c.cam([{ t: 0, p: GH(-2.7, 1.2, 1.9), l: GH(0.8, 2.4, 1.1), f: 48 }, { t: c.dur, p: GH(-2.6, 1.3, 1.8), l: GH(0.0, 2.4, 1.1), f: 44 }]);
  if (t > tV) c.ui(`<div class="abs" style="left:960px;top:150px;transform:translate(-50%,-50%) scale(${pop(t, tV, 0.3) || 1});padding:14px 50px;border-radius:20px;background:rgba(60,10,10,.9);border:5px solid #ff4b3e;color:#ff8a80;font-weight:900;font-size:64px">☠ PERCLORATO NO SOLO</div>`);
  if (t > tB) c.chip(960, 270, 'LAVAR A TERRA', 'blue', tB, 1e9);
};

SHOTS.b15 = (c) => {
  const t = c.t; const tA = c.at('astronautas'), tN = c.at('a doutora Nina'), tR = c.at('duas horas'); c.sfx('chalk', tA, 0.5); c.sfx('ding', tR, 0.5); c.sfx('pop', tR, 0.6);
  if (t < tN) {
    c.env('classroom', { board: (x, W, H) => { x.textAlign = 'center'; x.fillStyle = '#d62828'; x.font = '900 64px Inter'; x.fillText('OSSOS NO ESPAÇO', W / 2, 90);
      const k = prog(t, tA, tA + 2); for (let i = 0; i < 6; i++) { const h = 330 * (1 - 0.01 * i * 6 * k); x.fillStyle = '#e8e2cf'; x.strokeStyle = '#666'; x.lineWidth = 4; x.beginPath(); x.roundRect(260 + i * 180, 520 - h, 90, h, 30); x.fill(); x.stroke(); x.fillStyle = '#555'; x.font = '700 30px Inter'; x.fillText('MÊS ' + i, 305 + i * 180, 560); }
      if (t > tA) { x.fillStyle = '#d62828'; x.font = '900 54px Inter'; x.fillText('≈ −1% POR MÊS', W / 2, 160); } } });
    c.track('nina', [{ t: 0, p: [4.4, 0, -4.4], ry: PI + 0.7, a: 'point', e2: 'worried' }]);
    boardCam(c, 0, tN, 3.0, 2.2);
  } else {
    c.env('mars', { tod: 'day' });
    const L = []; for (let i = 0; i < 24; i++) { const x = (i % 8 - 3.5) * 1.3, z = 2 + Math.floor(i / 8) * 1.4; L.push({ p: [x, Math.abs(Math.sin(t * 5 + i)) * 0.4, z], ry: PI, c: COLS[i % 8], s: 0.95, a: 'cheer' }); } c.crowd(L);
    c.track('nina', [{ t: 0, p: [0, 0, -0.6], ry: 0, a: 'shout', e2: 'happy', suit: false }]);
    c.cam([{ t: tN, p: [0, 3.2, -6.4], l: [0, 1.2, 2.5], f: 50 }, { t: c.dur, p: [0, 2.9, -5.4], l: [0, 1.2, 2.5], f: 50 }]);
    if (t > tR) c.ui(bigNum('2 h DE EXERCÍCIO POR DIA', 960, 130, { size: 84, color: '#ffd21f', glow: 'rgba(255,210,31,.6)', s: pop(t, tR, 0.3) || 1 }));
  }
};

// ================= CTA MEIO =================
SHOTS.b16 = (c) => {
  const t = c.t; const tS = c.at('inscrever'), tL = c.at('deixa o like'); c.sfx('click', tS + 1.1, 0.8); c.sfx('ding', tS + 1.15, 0.6); c.sfx('pop', tL + 0.3, 0.8);
  c.env('mars', { tod: 'dusk', earth: true });
  c.track('lia', [{ t: 0, p: [-1.0, 0, 3], ry: 0.25, a: 'wave', e2: 'happy', suit: true }]);
  c.track('teo', [{ t: 0, p: [1.0, 0, 3.1], ry: -0.25, a: 'idle', e2: 'happy', suit: true }]);
  c.cam([{ t: 0, p: [-0.5, 1.6, 9.8], l: [0, 1.3, 3], f: 40 }, { t: c.dur, p: [0.8, 1.6, 8.6], l: [0, 1.4, 3], f: 38 }]);
  subBtn(c, tS);
  if (t > tL) c.ui(bigNum('👍 +1', 1400, 560, { size: 80, color: '#2b7bff', s: pop(t, tL, 0.3) || 1 }));
};

// ================= A CONTA =================
SHOTS.b17 = (c) => {
  const t = c.t; const tC = c.at('Cem pessoas'), tN = c.at('A nave trouxe'), tD = c.at('Depois disso'); c.sfx('chalk', tC, 0.5); c.sfx('chalk', tN, 0.5); c.sfx('heartbeat', tD, 0.6);
  c.env('classroom', { board: (x, W, H) => { x.textAlign = 'center'; x.fillStyle = '#d6561c'; x.font = '900 64px Inter'; x.fillText('A CONTA DA COMIDA', W / 2, 90);
    if (t > tC) { x.fillStyle = '#222'; x.font = '900 80px Inter'; x.fillText('100 × 2.000 = 200.000 kcal/dia', W / 2, 220); }
    if (t > tN) { x.fillStyle = '#1c6fa8'; x.font = '900 52px Inter'; x.fillText('ESTOQUE DA NAVE: 18 MESES', W / 2, 330); const k = 1 - prog(t, tN + 0.5, c.dur); x.strokeStyle = '#333'; x.lineWidth = 6; x.strokeRect(220, 380, W - 440, 70); x.fillStyle = k > 0.3 ? '#1c9a4a' : '#d62828'; x.fillRect(226, 386, (W - 452) * k, 58); }
    if (t > tD) { x.fillStyle = '#d62828'; x.font = '900 52px Inter'; x.fillText('DEPOIS: SÓ A ESTUFA', W / 2, 530); } } });
  c.track('lia', [{ t: 0, p: [4.4, 0, -4.4], ry: PI + 0.7, a: 'point', e2: t > tD ? 'worried' : 'neutral' }]);
  boardCam(c, 0, c.dur, 3.0, 1.6);
};

SHOTS.b18 = (c) => {
  const t = c.t; const tF = c.at('falta de energia'), tI = c.at('maior inimigo'); c.sfx('pad', 0, 0.4); ['batata', 'feijão', 'alface'].forEach(w => c.sfx('pop', c.at(w), 0.5)); c.sfx('flicker', tF, 0.7);
  const fl = t > tF ? (Math.sin(t * 40) > 0.2 ? 0.2 : 1) * 0.8 : 1;
  c.env('mars', { tod: 'day', green: 0.7, glow: fl });
  c.track('rafa', [{ t: 0, p: GH(-0.4, 2.4), ry: PI, a: t < tI ? 'eat' : 'think', e2: t < tF ? 'happy' : 'worried', hold: t < tI ? 'bean' : null }]);
  if (t < tI) c.cam([{ t: 0, p: GH(1.6, -1.9, 2.0), l: GH(-0.4, 2.4, 1.2), f: 50 }, { t: tI, p: GH(1.4, -1.7, 1.9), l: GH(-0.4, 2.4, 1.2), f: 46 }]);
  else c.cam([{ t: tI, p: GH(0.9, 0.2, 1.7), l: GH(-0.4, 2.4, 1.5), f: 44 }, { t: c.dur, p: GH(0.8, 0.4, 1.7), l: GH(-0.4, 2.4, 1.5), f: 40 }]);
  chipsAt(c, [['batata', 480, 120, 'BATATA', 'gold'], ['feijão', 960, 120, 'FEIJÃO', 'gold'], ['alface', 1440, 120, 'ALFACE', 'green']]);
  if (t > tF) c.ui(stamp('SEM ENERGIA = SEM COMIDA', { top: 780, size: 64, s: pop(t, tF, 0.3) || 1 }));
};

SHOTS.b19 = (c) => {
  const t = c.t; const tP = c.at('tem um porém'), tE = c.at('A energia'), tL = c.at('a luz do Sol'); c.sfx('hit', tP, 0.9); c.sfx('pop', tL + 0.8, 0.6);
  c.env('mars', { tod: 'day' });
  c.track('lia', [{ t: 0, p: [-14, 0, 6.2], ry: PI + 0.2, a: t > tL ? 'pointup' : 'idle', e2: 'worried', suit: true }]);
  if (t < tE) c.cam([{ t: 0, p: [-13, 1.9, 9.4], l: [-14, 1.7, 6.2], f: 40 }, { t: tE, p: [-12.8, 1.9, 9.0], l: [-14, 1.7, 6.2], f: 36 }]);
  else c.cam([{ t: tE, p: [-6, 4, 12], l: [-15, 1, 0], f: 50 }, { t: c.dur, p: [-8, 3.4, 11], l: [-15, 1, 0], f: 50 }]);
  if (t > tP && t < tE) c.ui(stamp('TEM UM PORÉM', { top: 120, size: 100, s: pop(t, tP, 0.3) || 1 }));
  if (t > tL) { const k = ease.o(prog(t, tL + 0.3, tL + 1.3)); c.ui(`<div class="abs" style="left:1180px;top:90px;width:620px;padding:22px;border-radius:24px;background:rgba(8,10,20,.85);border:4px solid #ffb02e">
    <div style="font-weight:900;font-size:34px;color:#ffd27a;letter-spacing:2px">☀️ LUZ DO SOL QUE CHEGA</div>
    <div style="margin-top:16px;font-weight:900;font-size:30px;color:#fff">TERRA</div><div style="height:40px;width:${560 * k}px;background:#ffd21f;border-radius:8px"></div>
    <div style="margin-top:14px;font-weight:900;font-size:30px;color:#fff">MARTE · ~43%</div><div style="height:40px;width:${560 * 0.43 * k}px;background:#ff7a45;border-radius:8px"></div></div>`); }
};

SHOTS.b20 = (c) => {
  const t = c.t; const tO = c.at('Opportunity'), tN = c.at('nunca mais'), tS = c.at('ficou sem luz'); c.sfx('wind', 0, 0.9); c.sfx('power', tS, 0.6); c.sfx('dramatic', tN, 0.7);
  const st = lerp(0.2, 0.85, prog(t, 0, tS + 1)); const off = t > tS + 0.8;
  c.env('mars', { tod: 'day', storm: st, base: false, rocket: false, rover: { x: 0, z: 0, ry: 0.6, dust: prog(t, 0, tS), off } });
  c.cam([{ t: 0, p: [4.2, 1.8, 5.2], l: [0, 1.0, 0], f: 44 }, { t: c.dur, p: [3.2, 1.6, 3.8], l: [0, 1.0, 0], f: 40 }]);
  c.ui(center('2018', { top: 60, size: 90, color: '#ffb27a' }));
  if (t > tO) c.chip(960, 200, 'ROBÔ OPPORTUNITY · NASA', 'blue', tO, 1e9);
  if (t > tN) c.ui(stamp('SEM SINAL', { top: 760, size: 90, s: pop(t, tN, 0.3) || 1 }));
};

// ================= CLÍMAX =================
SHOTS.b21 = (c) => {
  const t = c.t; const tC = c.at('O céu escurece'), n = [c.at('quarenta'), c.at('Trinta'), c.at('Vinte')]; c.sfx('wind', 0, 1.0); c.sfx('alarm', n[0], 0.5); n.forEach(q => c.sfx('hit', q, 0.6));
  const st = lerp(0.55, 1, prog(t, 0, tC + 1));
  c.env('mars', { tod: 'day', storm: st, dust: 1, power: 0.5 });
  c.track('lia', [{ t: 0, p: [0.8, 0, -3.6], ry: 0.1, a: 'lookup', e2: 'scared', suit: true, hold: 'light' }]);
  if (t < n[0]) c.cam([{ t: 0, p: [10, 4, 10], l: [0, 2.5, -10], f: 50 }, { t: n[0], p: [7, 3, 6], l: [0, 2.5, -10], f: 50 }]);
  else c.frame('lia', { yaw: -0.35, d: 3.2, h: 1.6, f: 42, t0: n[0], to: { d: 2.7 } });
  c.shake(0.25);
  const v = t < n[0] ? 48 : t < n[1] ? 40 : t < n[2] ? 30 : 20; energy(c, v);
  if (t > tC && t < n[0]) c.chip(960, 120, 'MEIO-DIA', 'gold', tC, n[0]);
};

SHOTS.b22 = (c) => {
  const t = c.t; const tO = c.at('Ou aquece'), tA = c.at('A assembleia'), tE = c.at('a estufa'); c.sfx('chalk', tO, 0.5); c.sfx('cheer', tA, 0.3); c.sfx('tada', tE, 0.7);
  const vote = t > tA + 0.6;
  c.env('classroom', { board: (x, W, H) => { x.textAlign = 'center'; x.fillStyle = '#222'; x.font = '900 60px Inter'; x.fillText('ENERGIA SÓ DÁ PRA UM:', W / 2, 90);
    if (t > tO) { x.fillStyle = '#d6561c'; x.beginPath(); x.roundRect(170, 160, 520, 260, 30); x.fill(); x.fillStyle = '#1c9a4a'; x.beginPath(); x.roundRect(846, 160, 520, 260, 30); x.fill(); x.fillStyle = '#fff'; x.font = '900 64px Inter'; x.fillText('QUARTOS', 430, 310); x.fillText('ESTUFA', 1106, 310); }
    if (t > tE) { x.strokeStyle = '#ffd21f'; x.lineWidth = 16; x.strokeRect(830, 144, 552, 292); x.fillStyle = '#1c9a4a'; x.font = '900 70px Inter'; x.fillText('100 VOTOS', 1106, 520); } } });
  if (t < tA) { c.track('lia', [{ t: 0, p: [4.4, 0, -4.4], ry: PI + 0.7, a: 'think', e2: 'worried' }]); boardCam(c, 0, tA, 3.0, 2.0); }
  else {
    const L = []; for (let i = 0; i < 24; i++) { const x = (i % 6 - 2.5) * 1.6, z = -0.6 + Math.floor(i / 6) * 1.6; L.push({ p: [x, 0, z], ry: PI, c: COLS[i % 8], s: 0.9, a: vote ? 'cheer' : 'idle' }); } c.crowd(L);
    c.track('lia', [{ t: 0, p: [-3.2, 0, -3.6], ry: 0.4, a: vote ? 'pointup' : 'idle', e2: t > tE ? 'happy' : 'neutral' }]);
    c.cam([{ t: tA, p: [3.0, 2.4, -5.3], l: [-1, 1.2, 1.5], f: 54 }, { t: c.dur, p: [2.8, 2.2, -5.0], l: [-1, 1.2, 1.5], f: 50 }]);
  }
};

SHOTS.b23 = (c) => {
  const t = c.t; const tI = c.at('E a Lia tem'), tB = c.at('as baterias'); c.sfx('wind', 0, 0.5); c.sfx('ding', tB, 0.7);
  if (t < tI) {
    c.env('mars', { tod: 'night', storm: 0.8, power: 0.35 });
    c.cam([{ t: 0, p: [9, 2.4, 6], l: [0, 2.4, -12], f: 46 }, { t: tI, p: [7.5, 2.2, 3.5], l: [0, 2.4, -12], f: 46 }]);
    c.chip(960, 120, 'NOITE · 100 PESSOAS NUM SÓ MÓDULO', 'blue', 0.2, tI);
  } else {
    c.env('gen', { power: 0.25 });
    const L = []; for (let i = 0; i < 18; i++) { const x = -5 + (i % 6) * 1.6, z = 1.5 + Math.floor(i / 6) * 1.3; L.push({ p: [x, -0.45, z], ry: PI + (i % 3 - 1) * 0.4, c: COLS[i % 8], s: 0.9, a: 'idle' }); } c.crowd(L);
    c.track('lia', [{ t: 0, p: [3.0, 0, 0.8], ry: -0.4, a: t > tB ? 'pointup' : 'think', e2: t > tB ? 'surprised' : 'tired' }]);
    c.cam([{ t: tI, p: [4.8, 1.8, 3.6], l: [3.0, 1.6, 0.8], f: 40 }, { t: c.dur, p: [4.5, 1.8, 3.2], l: [3.0, 1.6, 0.8], f: 36 }]);
    if (t > tB) c.ui(bigNum('💡 BATERIAS DO FOGUETE', 960, 140, { size: 80, color: '#ffd21f', glow: 'rgba(255,210,31,.6)', s: pop(t, tB, 0.3) || 1 }));
  }
};

SHOTS.b24 = (c) => {
  const t = c.t; const tC = c.at('puxando um cabo'), tN = c.at('não dá pra enxergar'); c.sfx('wind', 0, 1.0); c.sfx('footsteps', 0.3, 0.5);
  const u = prog(t, 0, c.dur); const cb = lerp(0.3, 0.8, u);
  c.env('mars', { tod: 'day', storm: t > tN ? 1 : 0.9, dust: 1, cable: cb, power: 0.3 });
  // caminham ao longo do cabo (da base ao foguete)
  const path = (k) => [lerp(-1.0, -13.5, k), 0, lerp(-3.0, -25.0, k)];
  const k0 = cb * 0.95; const names = ['lia', 'teo', 'rafa'];
  names.forEach((n, i) => { const p = path(Math.max(0, k0 - i * 0.05)); const q = path(Math.max(0, k0 - i * 0.05) + 0.01); c.track(n, [{ t: 0, p, ry: Math.atan2(q[0] - p[0], q[2] - p[2]), a: 'walk', e2: 'worried', suit: true, hold: i === 0 ? 'light' : null }]); });
  const L = c.pos('lia'); const ry = c.CH.lia.root.rotation.y;
  c.camSet([L.x - Math.sin(ry) * -4.5 + 1.5, 2.2, L.z - Math.cos(ry) * -4.5], [L.x, 1.4, L.z], 48);
  c.torch([L.x, 1.8, L.z], [L.x + Math.sin(ry) * 6, 0, L.z + Math.cos(ry) * 6], 60);
  if (t > tC) c.chip(380, 110, 'CABO: 400 m', 'gold', tC, 1e9);
  if (t > tN) c.chip(1540, 110, 'VISIBILIDADE: 2 m', 'red', tN, 1e9);
  energy(c, 15, { x: 1440, y: 800 });
};

SHOTS.b25 = (c) => {
  const t = c.t; const t1 = c.at('Primeira conexão'), t2 = c.at('Segunda'), tF = c.at('faísca'), t3 = c.at('Na terceira'), tA = c.at('acende'), tV = c.at('folhas'); c.sfx('click', t1 + 0.5, 0.7); c.sfx('spark', tF, 0.8); c.sfx('power', tA, 0.9); c.sfx('tada', tV, 0.6);
  if (t < tA) {
    c.env('mars', { tod: 'day', storm: 0.9, dust: 1, cable: 1 });
    c.track('lia', [{ t: 0, p: [-13.4, 0, -26.2], ry: -0.8, a: 'tinker', e2: t > tF ? 'scared' : 'worried', suit: true, hold: 'wrench' }]);
    c.track('teo', [{ t: 0, p: [-15.4, 0, -24.6], ry: 2.3, a: 'idle', e2: 'worried', suit: true, hold: 'light' }]);
    c.cam([{ t: 0, p: [-10.6, 1.9, -23.4], l: [-13.6, 1.3, -26.6], f: 44 }, { t: tA, p: [-11.4, 1.8, -24.2], l: [-13.6, 1.3, -26.6], f: 38 }]);
    if (t > tF && t < tF + 0.5) { c.flash('#fff6a0', 0.6 * (1 - (t - tF) / 0.5)); c.glow([-14, 1.2, -27], 0xfff2a0, 30); }
    c.torch([-15.4, 1.9, -24.6], [-13.4, 0.8, -26.4], 70);
  } else {
    c.env('mars', { tod: 'day', storm: 0.85, green: 1, glow: 1 });
    c.track('rafa', [{ t: 0, p: GH(-0.4, 2.4), ry: PI, a: 'cheer', e2: 'happy' }]);
    c.cam([{ t: tA, p: GH(1.6, -1.9, 2.0), l: GH(-0.4, 2.4, 1.2), f: 50 }, { t: c.dur, p: GH(1.4, -1.6, 1.9), l: GH(-0.4, 2.4, 1.2), f: 44 }]);
    c.flash('#ffffff', Math.max(0, 0.6 * (1 - (t - tA) / 0.3)));
    c.ui(bigNum('ACENDEU!', 960, 150, { size: 130, color: '#3ddc6a', glow: 'rgba(61,220,106,.6)', s: pop(t, tA, 0.3) || 1 }));
  }
};

SHOTS.b26 = (c) => {
  const t = c.t; const tL = c.at('Eles limpam'), tR = c.at('E o Rafa'); c.sfx('wipe', tL + 0.3, 0.6); c.sfx('wipe', tL + 1.3, 0.6); c.sfx('tada', tR + 1.0, 0.7);
  if (t < tL) { c.env('mars', { tod: 'day', storm: lerp(0.5, 0, prog(t, 0, tL)), dust: 1 }); c.cam([{ t: 0, p: [12, 5, 14], l: [-4, 2, -10], f: 50 }, { t: tL, p: [10, 4, 12], l: [-4, 2, -10], f: 50 }]); c.chip(960, 120, '3 DIAS DEPOIS', 'gold', 0.2, tL); }
  else if (t < tR) {
    c.env('mars', { tod: 'day', dust: 1 - prog(t, tL, tR) });
    c.track('lia', [{ t: 0, p: [-14.2, 0, 1.6], ry: PI, a: 'wipe', e2: 'happy', suit: true }]); c.track('teo', [{ t: 0, p: [-11.4, 0, 1.6], ry: PI, a: 'wipe', e2: 'happy', suit: true }]);
    c.cam([{ t: tL, p: [-12.8, 2.4, 6.8], l: [-12.8, 1.0, 0], f: 46 }, { t: tR, p: [-12.8, 2.3, 6.0], l: [-12.8, 1.0, 0], f: 44 }]);
  } else {
    c.env('mars', { tod: 'day', green: 1, glow: 0.8 });
    c.track('rafa', [{ t: 0, p: GH(-0.4, 2.4), ry: PI * 0.9, a: 'cheer', e2: 'happy', hold: 'bean' }]);
    c.cam([{ t: tR, p: GH(0.9, 0.0, 1.8), l: GH(-0.4, 2.4, 1.6), f: 46 }, { t: c.dur, p: GH(0.8, 0.3, 1.8), l: GH(-0.4, 2.4, 1.6), f: 42 }]);
    if (t > tR + 0.8) c.chip(960, 120, '1ª BATATA MARCIANA', 'gold', tR + 0.8, 1e9);
  }
};

// ================= FINAL =================
SHOTS.b27 = (c) => {
  const t = c.t; const tS = c.at('segunda nave'), tT = c.at('a terceira'), tB = c.at('nasce'); c.sfx('tick', 0.2, 0.4); c.sfx('boom', tS, 0.5); c.sfx('boom', tT, 0.5); c.sfx('aww', tB + 0.3, 0.7);
  const ships = t > tT ? 3 : t > tS ? 2 : 1; const yr = t > tB ? 6 : t > tT ? 4 : t > tS ? 2 : 1;
  if (t < tB) {
    c.env('mars', { tod: 'day', ships, green: 1, glow: 0.5 });
    c.crowd(ring(30 + ships * 25, 0, 3, 2.4, { seed: 6, sp: 0.6 }).map(q => ({ ...q, ry: PI })));
    c.cam([{ t: 0, p: [18, 9, 22], l: [-8, 3, -20], f: 50 }, { t: tB, p: [12, 6, 16], l: [-10, 4, -26], f: 50 }]);
  } else {
    c.env('mars', { tod: 'day', green: 1 });
    c.track('nina', [{ t: 0, p: [0, 0, 3.4], ry: 0, a: 'idle', e2: 'happy', hold: 'baby', over: { rsx: 1.1, rel: 1.4, lsx: 1.1, lel: 1.4 } }]);
    c.track('lia', [{ t: 0, p: [-1.2, 0, 3.0], ry: 0.5, a: 'clap', e2: 'happy' }]);
    c.cam([{ t: tB, p: [0.6, 1.8, 6.4], l: [-0.3, 1.4, 3.2], f: 42 }, { t: c.dur, p: [0.5, 1.8, 5.6], l: [-0.3, 1.4, 3.2], f: 40 }]);
    c.tag([0, 2.4, 3.4], '1º BEBÊ MARCIANO', 'gold', tB + 0.4, 1e9);
  }
  c.ui(bigNum('ANO ' + yr, 960, 130, { size: 110, color: '#ffd21f', glow: 'rgba(255,210,31,.5)' }));
};

SHOTS.b28 = (c) => {
  const t = c.t; const tA = c.at('azul'), tT = c.at('a Terra'); c.sfx('pad', 0, 0.6); c.sfx('twinkle', tA, 0.6); c.sfx('twinkle', tT, 0.6);
  c.env('mars', { tod: 'dusk', earth: t > tT - 1.2 });
  c.state.fade = 1 - prog(t, 0, 0.4);
  c.track('lia', [{ t: 0, p: [-2, 0, 6], ry: PI - 0.05, a: 'floor', e2: 'happy' }]);
  if (t < tA) c.cam([{ t: 0, p: [-0.4, 1.5, 10.5], l: [-12, 8, -200], f: 50 }, { t: tA, p: [-0.8, 1.6, 9.5], l: [-14, 10, -200], f: 50 }]);
  else c.cam([{ t: tA, p: [-1.4, 1.4, 9.0], l: [-12, 18, -200], f: 52 }, { t: c.dur, p: [-1.5, 1.3, 8.4], l: [-10, 26, -200], f: 52 }]);
  if (t > tA) c.chip(560, 120, 'O PÔR DO SOL EM MARTE É AZUL', 'blue', tA, 1e9);
  if (t > tT) c.tag([-20, 55, -380], 'A TERRA', 'gold', tT, 1e9);
};

SHOTS.b29 = (c) => {
  const t = c.t; const tR = c.at('Recomeçou porque'), tS = c.at('salvar a comida'); c.sfx('pad', 0, 0.5);
  c.env('mars', { tod: 'night', earth: true, power: 1, glow: 0.7, ships: 3 });
  const L = []; for (let i = 0; i < 40; i++) { const x = (i % 10 - 4.5) * 1.1, z = 5.2 + Math.floor(i / 10) * 1.2; L.push({ p: [x, 0, z], ry: PI, c: COLS[i % 8], s: 0.9, a: 'idle' }); } c.crowd(L);
  ['lia', 'rafa', 'nina', 'teo'].forEach((n, i) => c.track(n, [{ t: 0, p: [-1.8 + i * 1.2, 0, 4.0], ry: PI, a: 'idle', e2: 'happy' }]));
  c.cam([{ t: 0, p: [0.2, 1.5, 1.4], l: [0, 1.6, 20], f: 50 }, { t: c.dur, p: [0.6, 2.6, -2.2], l: [0, 1.8, 20], f: 50 }]);
  if (t > tR) c.chip(960, 160, 'FIZERAM ESCOLHAS JUNTOS', 'gold', tR, 1e9); if (t > tS) c.chip(960, 250, 'A COMIDA DE TODOS PRIMEIRO', 'green', tS, 1e9);
  c.state.fade = prog(t, c.dur - 0.5, c.dur);
};

SHOTS.b30 = (c) => {
  const t = c.t; const tQ = c.at('Iria pra Marte'), tM = c.at('debaixo do mar'), tS = c.at('Se inscreve'), tB = c.at('Até lá'); c.sfx('whoosh', tM, 0.5); c.sfx('click', tS + 1.1, 0.8); c.sfx('ding', tS + 1.15, 0.6); c.sfx('tada', tB, 0.6);
  c.env('outro');
  const w = t > tB;
  [['lia', -3.0, 0.3], ['nina', -1.0, 0.1], ['rafa', 1.0, -0.1], ['teo', 3.0, -0.3]].forEach(([n, x, ry]) => c.track(n, [{ t: 0, p: [x, 0, 5.1], ry, a: w ? 'wave' : 'idle', e2: 'happy' }]));
  c.cam([{ t: 0, p: [0, 1.9, 12.4], l: [0, 2.0, 5], f: 42 }, { t: c.dur, p: [0, 2.0, 11.4], l: [0, 2.0, 5], f: 42 }]);
  if (t > tQ && t < tM - 0.3) { const a = clamp((t - tQ) / 0.4); c.ui(`<div class="abs" style="left:0;top:130px;width:1920px;text-align:center;font-weight:900;font-size:60px;color:#fff;opacity:${a};text-shadow:0 5px 0 #000">VOCÊ IRIA PRA MARTE SEM VOLTA?</div>`);
    ['SIM 🚀', 'NÃO 🌍'].forEach((l, i) => { const s = pop(t, tQ + 0.5 + i * 0.3, 0.25); c.ui(`<div class="abs" style="left:${580 + i * 420}px;top:240px;width:340px;padding:20px 0;text-align:center;border-radius:24px;background:${['#3ddc6a', '#ff7a45'][i]};color:#111;font-weight:900;font-size:56px;transform:scale(${s || 0.001});box-shadow:0 8px 0 rgba(0,0,0,.35)">${l}</div>`); }); }
  if (t > tM - 0.2 && t < tS - 0.1) { c.ui(`<div class="abs" style="left:0;top:120px;width:1920px;text-align:center;font-weight:900;font-size:60px;color:#fff;text-shadow:0 5px 0 #000">PRÓXIMO EPISÓDIO</div>`); c.ui(bigNum('RECOMEÇAR DEBAIXO DO MAR?', 960, 270, { size: 110, color: '#38d6ff', glow: 'rgba(56,214,255,.6)', s: pop(t, tM, 0.3) || 1 })); }
  if (t < tB) subBtn(c, tS);
  if (t > tB) c.ui(bigNum('ATÉ LÁ!', 960, 250, { size: 190, color: '#ffd21f', glow: 'rgba(255,210,31,.7)', s: pop(t, tB, 0.3) || 1 }));
  c.state.fade = prog(t, c.dur - 1.0, c.dur);
};
