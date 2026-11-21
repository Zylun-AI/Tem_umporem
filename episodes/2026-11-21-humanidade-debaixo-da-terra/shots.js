// LONGO: "E se a humanidade tivesse que recomeçar debaixo da terra?" — palito, 1920x1080.
// Cenário novo: 'cave' (engine/envs4.js). Também: metro {water, power}, gen {power, shake, crank, smoke, water}, vault, classroom, street, farm, final, outro.
import { clamp, lerp, ease, PI, prog, center, stamp, bigNum, pop, seeded, subBtn } from '/engine/kit.js';
export const SHOTS = {};
const P0 = { num: null, flag: false };
export const CAST = {
  nara: { style: 'palito', ...P0, shirt: 0x2a6ad6, trim: 0xffd21f, shorts: 0x1d2a44, hair: 'lia', scale: 0.96 },
  narav: { style: 'palito', ...P0, shirt: 0x2a6ad6, trim: 0xd8d8d8, shorts: 0x1d2a44, hair: 'lia', scale: 0.94 },
  beto: { style: 'palito', ...P0, shirt: 0xff7a1a, trim: 0x8a4a1a, shorts: 0x5a4a2a, cap: 0x8a5a2a },
  luz: { style: 'palito', ...P0, shirt: 0xf4f4f4, trim: 0xe91e8c, shorts: 0xe91e8c, hair: 'lia', scale: 0.96 },
  tito: { style: 'palito', ...P0, shirt: 0x2fa35a, trim: 0xffd21f, shorts: 0x222a44, cap: 0xffd21f, capYaw: PI },
  sol: { style: 'palito', ...P0, shirt: 0xffd21f, trim: 0xff7a1a, shorts: 0x8a3ad6, scale: 0.6 },
  solv: { style: 'palito', ...P0, shirt: 0xffd21f, trim: 0xff7a1a, shorts: 0x1d2a44, scale: 1.0 },
};
const COLS = [0x2a6ad6, 0xff7a1a, 0x2fa35a, 0xf4f4f4, 0xd6a31c, 0x8a3ad6, 0x0aa6b8, 0xe02020];
const title = (c, txt, t0, o = {}) => { if (c.t < t0) return; const s = pop(c.t, t0, 0.3) || 1; c.ui(`<div class="abs" style="left:0;right:0;top:${o.top ?? 70}px;text-align:center;transform:scale(${s})"><div style="display:inline-block;background:${o.bg ?? '#d62828'};border:7px solid #fff;border-radius:22px;padding:6px 60px;font-weight:900;font-size:${o.size ?? 96}px;color:${o.color ?? '#fff'};transform:rotate(-2deg);box-shadow:0 14px 0 rgba(0,0,0,.45)">${txt}</div></div>`); };
const card = (html, o = {}) => `<div class="abs" style="left:${o.x ?? 960}px;top:${o.y ?? 150}px;transform:translate(-50%,0) scale(${o.s ?? 1});opacity:${o.a ?? 1};background:rgba(8,12,28,.86);border:5px solid ${o.b ?? '#38d6ff'};border-radius:26px;padding:22px 44px;color:#fff;font-weight:900;font-size:${o.size ?? 50}px;text-align:center;white-space:nowrap">${html}</div>`;
const big = (c, txt, t0, o = {}) => { if (c.t < t0) return; c.ui(bigNum(txt, o.x ?? 960, o.y ?? 250, { size: o.size ?? 130, color: o.color ?? '#ffd21f', glow: o.glow ?? 'rgba(255,210,31,.6)', s: pop(c.t, t0, 0.3) || 1 })); };
// cronômetro (minutos:segundos restantes)
const timer = (c, secs, label = '🌊 ÁGUA NA SALA EM', o = {}) => { const s = Math.max(0, Math.ceil(secs)); const col = s > 600 ? '#ffd21f' : '#ff3b30'; c.ui(`<div class="abs" style="left:${o.x ?? 1500}px;top:${o.y ?? 60}px;width:360px;padding:14px 20px;border-radius:20px;background:rgba(10,10,14,.85);border:4px solid ${col};text-align:center"><div style="font-weight:900;font-size:26px;color:#fff;letter-spacing:2px">${label}</div><div style="font-weight:900;font-size:72px;color:${col}">${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}</div></div>`); };
const CAVE = (c, p = {}) => c.env('cave', p);
// figurantes na praça da caverna (centro (0,0,-8))
const plazaPeople = (c, n, o = {}) => { const R = seeded(o.seed || 5); for (let i = 0; i < n; i++) { const a = R() * PI * 2, r = 1.5 + R() * (o.r ?? 7); const x = Math.cos(a) * r, z = -8 + Math.sin(a) * r * 0.8; if (z > (o.zmax ?? 1)) continue; const walk = o.walk && i % 3 === 0; const ph = c.t * 0.25 + i; const wx = walk ? x + Math.sin(ph) * 1.2 : x;
  c.mini(i, { p: [wx, 0, z], ry: walk ? (Math.cos(ph) > 0 ? PI / 2 : -PI / 2) : (o.ry ?? Math.atan2(-x, 8 - z)), a: walk ? 'walk' : (typeof o.a === 'function' ? o.a(i) : (o.a || 'idle')), e: o.e || 'happy', s: (o.kids && i % 4 === 0) ? 0.62 : 0.95 }); } };
// plataforma do metrô: topo em y=0.4 (z 9..15); fundo dos trilhos em y≈-1.55; água em y = -1.4 + 1.7*w
const PLAT = 0.4, TRK = -1.55;
const wl = (w) => -1.4 + 1.7 * w;
// cartão estilo monitor
const monitor = (inner, o = {}) => `<div class="abs" style="left:${o.x ?? 960}px;top:${o.y ?? 140}px;transform:translate(-50%,0) scale(${o.s ?? 1});width:${o.w ?? 720}px;height:${o.h ?? 400}px;border:14px solid #2a2e33;border-radius:18px;box-shadow:0 18px 40px rgba(0,0,0,.6);overflow:hidden;background:#000">${inner}</div>`;

// ================= GANCHO =================
SHOTS.b01 = (c) => {
  const t = c.t; const tS = c.at('o sol é'), tU = c.at('única casa'); c.sfx('riser', 0.2, 0.5); c.sfx('pop', 0.6, 0.5); c.sfx('boom', tU, 0.8);
  CAVE(c); plazaPeople(c, 34, { walk: true, kids: true });
  if (t < tS) { c.cam([{ t: 0, p: [0, 5.5, 11], l: [0, 2.5, -12], f: 52 }, { t: tS, p: [0, 4.2, 7.5], l: [0, 2.3, -12], f: 52 }]); c.chip(960, 90, '100 METROS DEBAIXO DA TERRA', 'gold', 0.6, tS); }
  else if (t < tU) { c.cam([{ t: tS, p: [2, 1.6, -1], l: [0, 11.6, -10], f: 56 }, { t: tU, p: [1.5, 1.8, -2], l: [0, 11.6, -10], f: 50 }]); c.tag([0, 11.2, -10], 'O "SOL" DA CIDADE', 'gold', tS + 0.4, tU); }
  else { c.cam([{ t: tU, p: [-3, 3.0, 4], l: [0, 1.4, -10], f: 50 }, { t: c.dur, p: [-2.4, 2.8, 2.6], l: [0, 1.4, -10], f: 50 }]); title(c, 'A ÚNICA CASA DE 300 PESSOAS', tU + 0.1, { size: 80, bg: '#2a6ad6' }); }
};

SHOTS.b02 = (c) => {
  const t = c.t; const tA = c.at('aqui embaixo'), tG = c.at('água'), tE = c.at('enchendo'); c.sfx('wind', 0, 0.6); c.sfx('water', tG - 0.3, 0.7); c.sfx('alarm', tE, 0.5);
  if (t < tA) {
    c.env('vault'); c.cam([{ t: 0, p: [0, 4.5, 6], l: [0, 6.5, -34], f: 50 }, { t: tA, p: [0, 3.8, -6], l: [0, 5.5, -34], f: 50 }]);
    c.chip(960, 90, 'LÁ EM CIMA: TUDO CONGELADO', 'blue', 0.3, tA);
  } else {
    const w = lerp(0.35, 0.85, prog(t, tA, c.dur)); c.env('metro', { water: w, power: t > tE ? 0.3 : 1 });
    c.cam([{ t: tA, p: [7, 1.9, 14], l: [-4, -0.6, 0], f: 54 }, { t: c.dur, p: [5.5, 1.6, 12.5], l: [-4, -0.6, 0], f: 50 }]);
    if (t > tE) title(c, 'O TÚNEL ESTÁ ENCHENDO', tE, { size: 84 });
  }
};

SHOTS.b03 = (c) => {
  const t = c.t; const tS = c.at('sala das bombas'), tN = c.at('A Nara'), tV = c.at('voltar vinte'); c.sfx('heartbeat', 0, 0.6); c.sfx('whoosh', tV, 0.7);
  if (t < tN) { c.env('gen', { power: 0.25, water: 0.08 }); c.cam([{ t: 0, p: [4.5, 2.6, 5], l: [0, 1.2, -2.4], f: 50 }, { t: tN, p: [3.5, 2.3, 4], l: [0, 1.2, -2.4], f: 48 }]); c.torch([3, 3.5, 3], [0, 1, -2.4], 40); c.tag([0, 2.6, -2.4], 'SALA DAS BOMBAS', 'red', tS, tN); }
  else {
    c.env('metro', { water: 0.9, power: 0.3 });
    c.track('narav', [{ t: 0, p: [3, PLAT, 11.8], ry: PI + 0.3, a: t < tV ? 'lookaround' : 'think', e2: 'worried', hold: 'light' }]);
    c.frame('narav', { yaw: 0.35, d: 2.6, h: 1.5, f: 42, t0: tN, to: { d: 2.2 } });
    timer(c, 30 * 60 - (t - tN) * 8);
  }
  if (t > tV) { c.state.fade = prog(t, c.dur - 0.6, c.dur); c.ui(center('20 ANOS ANTES', { top: 420, size: 120, color: '#ffd21f' })); }
};

// ================= COMEÇO =================
SHOTS.b04 = (c) => {
  const t = c.t; const tC = c.at('As cinzas'), tN = c.at('não chega'); c.sfx('boom', 0.9, 0.9); c.sfx('wind', tC, 0.6); c.sfx('dramatic', tN, 0.6);
  c.state.fade = 1 - prog(t, 0, 0.5);
  const dark = prog(t, tC, tN + 1); c.env('street', { tod: dark < 0.5 ? 'gray' : 'night', cars: false });
  for (let i = 0; i < 14; i++) c.mini(i, { p: [-6 + (i % 7) * 2, 0, 2 + Math.floor(i / 7) * 2.2], ry: PI, a: t > 1.2 ? 'lookup' : 'idle', e: t > 1.2 ? 'scared' : 'neutral', s: 0.95 });
  c.puffs([0, 9, -2], 1, { color: 0x6a6a6a, rise: -9, op: 0.55, speed: 0.25, spread: 14 });
  c.cam([{ t: 0, p: [0, 2.0, -6], l: [0, 3.2, 6], f: 56 }, { t: c.dur, p: [0, 1.8, -4.5], l: [0, 4.0, 6], f: 54 }]);
  if (t < 1.6) c.shake(0.5 * clamp(1 - Math.abs(t - 1.0) / 0.6));
  c.chip(960, 90, 'UM SUPERVULCÃO ACORDA', 'red', 0.6, tC + 1.5);
  if (t > tN) title(c, 'O CÉU FICOU CINZA', tN, { bg: '#444a55', size: 84 });
};

SHOTS.b05 = (c) => {
  const t = c.t; const tM = c.at('mil oitocentos'), tA = c.at('ano sem verão'), tJ = c.at('neve em junho'); c.sfx('chalk', tM, 0.5); c.sfx('pop', tA, 0.6); c.sfx('chalk', tJ, 0.5);
  c.env('classroom', { board: (x, W, H) => {
    x.fillStyle = '#1d2a44'; x.font = '900 92px Inter'; x.textAlign = 'center';
    if (t > tM - 0.3) { x.fillText('1815 · VULCÃO TAMBORA', W / 2, 130); x.font = '700 54px Inter'; x.fillText('Indonésia', W / 2, 200); }
    if (t > tA) { x.fillStyle = '#d62828'; x.font = '900 110px Inter'; x.fillText('1816: O "ANO SEM VERÃO"', W / 2, 360); }
    if (t > tJ) { x.fillStyle = '#2e6fb5'; x.font = '800 62px Inter'; x.fillText('❄ neve em junho  ·  plantações perdidas', W / 2, 480); }
  } });
  c.track('beto', [{ t: 0, p: [4.2, 0, -4.4], ry: -0.5, a: t < tA ? 'point' : 'talk', e2: 'happy' }]);
  c.cam([{ t: 0, p: [0, 2.1, 2.6], l: [-0.2, 2.1, -5.8], f: 52 }, { t: c.dur, p: [0, 2.1, 1.4], l: [-0.2, 2.1, -5.8], f: 52 }]);
};

SHOTS.b06 = (c) => {
  const t = c.t; const tS = c.at('Sem sol'), tT = c.at('trezentas'), tD = c.at('debaixo da terra'); c.sfx('wind', 0, 0.6); c.sfx('footsteps', tT, 0.5); c.sfx('boom', tD, 0.6);
  c.env('vault');
  // fila de gente andando até a porta do bunker (porta em z≈-27)
  for (let i = 0; i < 40; i++) { const z = -26 + i * 1.3 + ((t * 1.3) % 1.3); if (z > 20) continue; c.mini(i, { p: [Math.sin(i * 1.7) * 0.8, 0, z], ry: PI, a: 'walk', e: 'worried', s: i % 5 === 0 ? 0.65 : 0.95 }); }
  if (t < tT) c.cam([{ t: 0, p: [-3, 5, 22], l: [0, 3, -27], f: 46 }, { t: tT, p: [-2.5, 4.5, 16], l: [0, 3, -27], f: 46 }]);
  else c.cam([{ t: tT, p: [3.5, 2.4, 0], l: [0, 2.2, -26], f: 46 }, { t: c.dur, p: [3, 2.4, -6], l: [0, 2.4, -26], f: 46 }]);
  if (t < tT) c.chip(960, 90, 'A SUPERFÍCIE CONGELA', 'blue', tS, tT);
  if (t > tD) title(c, 'DEBAIXO DA TERRA', tD, { bg: '#7a5a3a' });
};

SHOTS.b07 = (c) => {
  const t = c.t; const tB = c.at('O Beto'), tL = c.at('A doutora Luz'), tT = c.at('E o Tito'), tM = c.at('medo do escuro'); c.sfx('pop', 0.2, 0.5); c.sfx('pop', tB, 0.5); c.sfx('pop', tL, 0.5); c.sfx('pop', tT, 0.5); c.sfx('laugh', tM + 0.3, 0.4);
  CAVE(c);
  c.track('nara', [{ t: 0, p: [-3, 0, -6], ry: 0.3, a: t < tB ? 'wave' : 'idle', e2: 'happy', hold: 'paper' }]);
  c.track('beto', [{ t: 0, p: [-1, 0, -6.3], ry: 0.1, a: t > tB && t < tL ? 'point' : 'idle', e2: 'happy', hold: 'ball' }]);
  c.track('luz', [{ t: 0, p: [1, 0, -6.3], ry: -0.1, a: t > tL && t < tT ? 'wave' : 'idle', e2: 'happy' }]);
  c.track('tito', [{ t: 0, p: [3, 0, -6], ry: -0.3, a: t > tM ? 'panic' : 'idle', e2: t > tM ? 'scared' : 'happy', hold: 'light' }]);
  const who = t < tB ? 'nara' : t < tL ? 'beto' : t < tT ? 'luz' : 'tito'; const t0 = t < tB ? 0 : t < tL ? tB : t < tT ? tL : tT;
  c.frame(who, { yaw: 0.25, d: 2.6, h: 1.4, f: 42, t0, to: { d: 2.2 } });
  const lab = { nara: ['NARA · ENGENHEIRA', 'blue'], beto: ['BETO · GEÓLOGO', 'gold'], luz: ['DRA. LUZ · MÉDICA', 'red'], tito: ['TITO · ELETRICISTA', 'green'] }[who];
  c.chip(960, 90, lab[0], lab[1], t0 + 0.1, 1e9);
};

SHOTS.b08 = (c) => {
  const t = c.t; const tF = c.at('Lá fora'), tE = c.at('O elevador'); c.sfx('pop', 0.3, 0.5); c.sfx('wind', tF, 0.4); c.sfx('buzz', tE + 0.5, 0.5);
  const up = t > tE + 1.5 ? (t - tE - 1.5) * 1.2 : 0;
  CAVE(c, { cage: up });
  c.track('nara', [{ t: 0, p: [-8.6, 0, -18.4], ry: -1.0, a: t < tE ? 'point' : 'hold', e2: 'neutral', hold: t < tE ? undefined : 'paper' }]);
  c.track('tito', [{ t: 0, p: [-11, up, -20], ry: 0.6, a: 'idle', e2: 'worried', suit: true }]);
  c.track('beto', [{ t: 0, p: [-10.4, up, -20.4], ry: 0.4, a: 'idle', e2: 'neutral', suit: true }]);
  if (t < tF) c.frame('nara', { yaw: 0.2, d: 3.6, h: 1.4, f: 44, to: { d: 3.0 } });
  else c.cam([{ t: tF, p: [-6, 1.6, -13], l: [-11, 1.4 + up * 0.5, -20], f: 46 }, { t: c.dur, p: [-6.5, 1.8, -14], l: [-11, 1.6 + up * 0.8, -20], f: 46 }]);
  title(c, 'REGRA Nº 1', 0.1, { bg: '#ffd21f', color: '#111', size: 80 });
  if (t > tF && t < tE) c.chip(960, 210, 'FRIO DE MATAR · CINZA NO AR', 'red', tF + 0.2, tE);
  if (t > tE) c.chip(960, 210, 'SÓ COM AUTORIZAÇÃO DA NARA', 'blue', tE + 0.2, 1e9);
};

// ================= VANTAGENS =================
SHOTS.b09 = (c) => {
  const t = c.t; const tC = c.at('Uma caverna'), tP = c.at('cobertor de pedra'); c.sfx('twinkle', 0.3, 0.4); c.sfx('pop', tP, 0.6);
  CAVE(c); plazaPeople(c, 24, { a: (i) => (i % 3 ? 'idle' : 'talk'), seed: 9, walk: true });
  c.cam([{ t: 0, p: [10, 3.5, 4], l: [0, 2, -12], f: 52 }, { t: c.dur, p: [6, 3, 6], l: [0, 2, -12], f: 52 }]);
  // termômetro
  if (t > tC) { const k = pop(t, tC, 0.3) || 1; c.ui(`<div class="abs" style="left:1560px;top:170px;transform:scale(${k});width:220px;text-align:center;font-weight:900;color:#fff"><div style="font-size:30px">LÁ FORA</div><div style="font-size:54px;color:#38d6ff">❄ ${Math.round(lerp(-5, -35, (Math.sin(t * 1.2) + 1) / 2))}°</div><div style="height:30px"></div><div style="font-size:30px">AQUI</div><div style="font-size:54px;color:#ffd21f">● estável</div></div>`); }
  if (t > tP) title(c, 'COBERTOR DE PEDRA', tP, { bg: '#7a5a3a' });
};

SHOTS.b10 = (c) => {
  const t = c.t; const tQ = c.at('quanto mais fundo'), tK = c.at('A cada quilômetro'), tF = c.at('Eles furam'); c.sfx('pop', tK, 0.5); c.sfx('crank', tF, 0.5); c.sfx('sizzle', tF + 0.8, 0.5);
  CAVE(c);
  c.track('beto', [{ t: 0, p: [6.8, 0, -19.6], ry: 0.9, a: t < tF ? 'talk' : 'point', e2: 'happy' }]);
  if (t < tK) c.frame('beto', { yaw: 0.2, d: 3.2, h: 1.5, f: 44, to: { d: 2.8 } });
  else c.cam([{ t: tK, p: [5, 2.4, -14.5], l: [8.5, 2.2, -22], f: 50 }, { t: c.dur, p: [5.6, 2.2, -16], l: [8.5, 2.2, -22], f: 50 }]);
  if (t > tK) { const k = prog(t, tK, tK + 2.5); const d = (k * 3).toFixed(1); c.ui(`<div class="abs" style="left:120px;top:150px;width:360px;padding:20px;border-radius:24px;background:rgba(10,10,14,.85);border:4px solid #ff7a1a;text-align:center;font-weight:900;color:#fff"><div style="font-size:32px">PROFUNDIDADE</div><div style="font-size:64px;color:#ffd21f">${d} km</div><div style="font-size:32px;margin-top:10px">ROCHA MAIS QUENTE</div><div style="font-size:64px;color:#ff5a3a">+${Math.round(k * 75)} °C</div></div>`); }
  if (t > tK) c.chip(1250, 90, '≈ +25 °C POR QUILÔMETRO', 'gold', tK + 0.2, 1e9);
};

SHOTS.b11 = (c) => {
  const t = c.t; const tT = c.at('Na Turquia'), tD = c.at('Derin'), tO = c.at('oitenta e cinco'), tM = c.at('milhares'); c.sfx('whoosh', tT, 0.5); c.sfx('pop', tO, 0.6); c.sfx('cheer', tM, 0.3);
  c.env('void', { cone: false });
  c.track('beto', [{ t: 0, p: [-4.6, 0, 0], ry: 0.5, a: t > tD ? 'point' : 'idle', e2: 'happy' }]);
  c.cam([{ t: 0, p: [0, 2.2, 9], l: [0, 2.2, 0], f: 50 }, { t: c.dur, p: [0, 2.2, 8.2], l: [0, 2.2, 0], f: 50 }]);
  if (t < tT) { c.ui(center('MORAR DEBAIXO DA TERRA?', { top: 160, size: 84, color: '#fff' })); return; }
  // corte de terreno com andares
  const lv = Math.floor(clamp((t - tD) / 0.35, 0, 8));
  let rooms = ''; for (let i = 0; i < 8; i++) { if (i >= lv) break; const y = 250 + i * 80, x = 760 + (i % 2 ? 120 : 0); rooms += `<div style="position:absolute;left:${x - 500}px;top:${y - 120}px;width:${260 + (i % 3) * 60}px;height:52px;background:#2a1a10;border-radius:14px;box-shadow:inset 0 0 0 4px #ffcf7a"></div><div style="position:absolute;left:${x - 520 + 130}px;top:${y - 120 - 28}px;width:24px;height:30px;background:#2a1a10"></div>`; }
  c.ui(`<div class="abs" style="left:620px;top:150px;width:1100px;height:760px;background:linear-gradient(#c9955a,#8a5a32 40%,#5a3a20);border-radius:24px;border:6px solid #fff;overflow:hidden"><div style="position:absolute;left:0;right:0;top:0;height:40px;background:#e8d9a8"></div><div style="position:relative;left:0;top:0">${rooms}</div>
    <div style="position:absolute;right:40px;top:40px;bottom:40px;width:10px;background:#fff"></div>${t > tO ? `<div style="position:absolute;right:70px;top:${330}px;font-weight:900;font-size:70px;color:#fff;text-shadow:0 4px 0 #000">85 m</div>` : ''}</div>`);
  c.chip(1170, 100, 'DERINKUYU · TURQUIA', 'gold', tD - 0.2, 1e9);
  if (t > tM) c.chip(1170, 840, 'MILHARES DE PESSOAS', 'green', tM, 1e9);
};

SHOTS.b12 = (c) => {
  const t = c.t; const tL = c.at('Luz vermelha'), tA = c.at('o ano inteiro'); c.sfx('twinkle', 0.2, 0.5); c.sfx('pop', tA, 0.5);
  CAVE(c, { plant: 0.6 + 0.4 * prog(t, 0, c.dur) });
  c.track('tito', [{ t: 0, p: [5.6, 0, -9.0], ry: 0.5, a: 'crouch', e2: 'happy', hold: 'flower' }]);
  c.track('nara', [{ t: 0, p: [8.0, 0, -9.1], ry: -0.4, a: 'tinker', e2: 'happy' }]);
  c.cam([{ t: 0, p: [6.8, 2.4, -3.2], l: [7, 0.9, -11], f: 50 }, { t: c.dur, p: [6.6, 2.2, -4.0], l: [7, 0.9, -11], f: 50 }]);
  if (t > tL) { c.chip(760, 90, 'VERMELHO', 'red', tL, 1e9); c.chip(1160, 90, 'AZUL', 'blue', tL + 0.4, 1e9); }
  if (t > tA) title(c, 'ALFACE O ANO INTEIRO', tA, { bg: '#2fa35a', top: 180, size: 76 });
};

SHOTS.b13 = (c) => {
  const t = c.t; const tN = c.at('Noruega'), tU = c.at('um milhão'); c.sfx('wind', 0, 0.5); c.sfx('pop', tU, 0.7);
  c.env('vault');
  if (t < tN) { CAVE(c); c.track('luz', [{ t: 0, p: [-2, 0, -6], ry: 0.2, a: 'hold', e2: 'happy', hold: 'bag' }]); c.frame('luz', { yaw: 0.3, d: 3.0, h: 1.3, f: 44, to: { d: 2.6 } }); return; }
  c.cam([{ t: tN, p: [0, 3.4, 0], l: [0, 5.2, -34], f: 46 }, { t: c.dur, p: [0, 3.4, -12], l: [0, 5.0, -34], f: 46 }]);
  c.chip(960, 90, 'COFRE DE SVALBARD · NORUEGA', 'blue', tN + 0.2, 1e9);
  big(c, '+1 MILHÃO DE SEMENTES', tU, { size: 96, y: 260 });
};

SHOTS.b14 = (c) => {
  const t = c.t; const tP = c.at('pendura'), tN = c.at('nasce'), tS = c.at('Sol'); c.sfx('cheer', tP + 0.5, 0.5); c.sfx('aww', tS, 0.5); c.sfx('twinkle', tS, 0.5);
  if (t < tN) {
    CAVE(c, { lights: t > tP + 0.4, sun: 0.35 }); plazaPeople(c, 30, { a: (i) => (i % 2 ? 'cheer' : 'dance'), seed: 4, kids: true });
    c.track('tito', [{ t: 0, p: [0.5, 0, -4], ry: 0.2, a: 'pointup', e2: 'happy' }]);
    c.cam([{ t: 0, p: [0, 2.0, 4], l: [0, 4.0, -10], f: 56 }, { t: tN, p: [0, 2.0, 3], l: [0, 4.4, -10], f: 56 }]);
    c.chip(960, 90, 'PRIMEIRO ANO 🎉', 'gold', 0.2, tN);
  } else {
    c.env('hospital', { day: true, power: 1 });
    c.track('luz', [{ t: 0, p: [0, 0, -2], ry: 0.2, a: 'idle', e2: 'happy', hold: 'baby' }]);
    c.track('nara', [{ t: 0, p: [-0.9, 0, -2.3], ry: 0.6, a: 'clap', e2: 'happy' }]);
    c.frame('luz', { yaw: 0.2, d: 3.6, h: 1.5, f: 44, t0: tN, to: { d: 3.1 } });
    if (t > tS) title(c, 'O NOME DELE É SOL ☀️', tS, { bg: '#ff9a1a', top: 80, size: 80 });
  }
};

// ================= PREÇO =================
SHOTS.b15 = (c) => {
  const t = c.t; const tV = c.at('vitamina D'), tL = c.at('lâmpadas especiais'); c.sfx('pop', tV, 0.5); c.sfx('buzz', tL, 0.4);
  const on = t > tL - 0.2; CAVE(c, { sun: 0.35, lamp: on ? 1 : 0 });
  if (t < tL - 0.2) { c.track('luz', [{ t: 0, p: [-2, 0, -6], ry: 0.1, a: 'talk', e2: 'worried' }]); c.frame('luz', { yaw: 0.25, d: 2.6, h: 1.4, f: 44, to: { d: 2.2 } }); }
  else {
    for (let i = 0; i < 8; i++) c.mini(i, { p: [-5.6 + (i % 4) * 1.05, 0, -13.4 + Math.floor(i / 4) * 1.0], ry: 0.1, a: i % 2 ? 'lookup' : 'idle', e: 'happy', s: i % 3 ? 0.95 : 0.62 });
    c.track('luz', [{ t: 0, p: [-1.0, 0, -12.6], ry: -0.6, a: 'point', e2: 'happy' }]);
    c.cam([{ t: tL - 0.2, p: [-1.5, 2.2, -6.5], l: [-4, 1.6, -13.5], f: 50 }, { t: c.dur, p: [-2, 2.1, -8], l: [-4, 1.6, -13.5], f: 50 }]);
  }
  if (t > tV) c.chip(960, 90, '☀️ SOL → VITAMINA D → OSSOS FORTES', 'gold', tV, 1e9);
};

SHOTS.b16 = (c) => {
  const t = c.t; const tI = c.at('inventa'), tA = c.at('acende'), tP = c.at('apaga'); c.sfx('click', tA, 0.6); c.sfx('click', tP, 0.6);
  const sn = t < tA ? 0.25 : t < tP ? lerp(0.25, 1, prog(t, tA, tA + 0.6)) : lerp(1, 0.08, prog(t, tP, tP + 0.6));
  CAVE(c, { sun: sn });
  if (t < tI) { for (let i = 0; i < 6; i++) c.mini(i, { p: [-3 + i * 1.2, 0, -6], ry: 0.2, a: i % 2 ? 'tired' : 'shrug', e: 'tired', s: 0.95 }); c.cam([{ t: 0, p: [0, 1.8, -0.5], l: [0, 1.2, -6], f: 52 }]); c.chip(960, 90, 'QUE HORAS SÃO? 🥱', 'white', 0.3, tI); }
  else { c.track('nara', [{ t: 0, p: [1, 0, -5], ry: 0, a: 'pointup', e2: 'happy' }]); c.cam([{ t: tI, p: [3, 1.6, 1], l: [0, 6, -10], f: 56 }, { t: c.dur, p: [2.5, 1.5, 0.5], l: [0, 7, -10], f: 56 }]);
    if (t > tA) c.chip(760, 90, t < tP ? '07:00 ☀️ BOM DIA' : '22:00 🌙 BOA NOITE', t < tP ? 'gold' : 'blue', tA, 1e9); }
};

SHOTS.b17 = (c) => {
  const t = c.t; const tR = c.at('radônio'), tN = c.at('nunca podem parar'); c.sfx('dramatic', 0.2, 0.4); c.sfx('alarm', tN, 0.3);
  CAVE(c, { sun: 0.3 });
  c.puffs([-2, 0.2, -10], 0.9, { color: 0x9a5ad6, rise: 1.2, op: 0.35, speed: 0.3, spread: 6 });
  c.track('beto', [{ t: 0, p: [-1, 0, -7.5], ry: 0.3, a: t < tR ? 'lookdown' : 'point', e2: 'worried' }]);
  c.cam([{ t: 0, p: [0.8, 1.5, -3.6], l: [-1.6, 1.0, -9], f: 48 }, { t: c.dur, p: [0.6, 1.5, -4.2], l: [-1.6, 1.0, -9], f: 46 }]);
  if (t > tR) c.tag([-3, 1.0, -10], 'RADÔNIO', 'red', tR, 1e9);
  if (t > tN) title(c, 'VENTILADORES: SEMPRE LIGADOS', tN, { size: 72 });
};

// ================= CTA MEIO =================
SHOTS.b18 = (c) => {
  const t = c.t; const tS = c.at('inscrever'), tL = c.at('deixa o like'); c.sfx('click', tS + 1.1, 0.8); c.sfx('ding', tS + 1.15, 0.6); c.sfx('pop', tL + 0.3, 0.8);
  CAVE(c, { lights: true });
  c.track('nara', [{ t: 0, p: [-0.6, 0, -5.2], ry: 0.25, a: 'wave', e2: 'happy' }]);
  c.track('tito', [{ t: 0, p: [0.6, 0, -5.1], ry: -0.25, a: 'idle', e2: 'happy', hold: 'light' }]);
  c.cam([{ t: 0, p: [-0.3, 1.5, -0.4], l: [0, 1.3, -5.2], f: 42 }, { t: c.dur, p: [0.3, 1.5, -1.1], l: [0, 1.35, -5.2], f: 40 }]);
  subBtn(c, tS);
  if (t > tL) c.ui(bigNum('👍 +1', 1400, 560, { size: 80, color: '#2b7bff', s: pop(t, tL, 0.3) || 1 }));
};

// ================= O PORÉM =================
SHOTS.b19 = (c) => {
  const t = c.t; const tP = c.at('tem um porém'), tM = c.at('Minas e túneis'), tQ = c.at('Quando as bombas'); c.sfx('dramatic', tP, 0.7); c.sfx('water', tM, 0.5); c.sfx('water', tQ, 0.7);
  const w = t < tQ ? 0.12 : lerp(0.12, 0.8, prog(t, tQ, c.dur));
  c.env('metro', { water: w, power: 1 });
  c.cam([{ t: 0, p: [8, 2.6, 14], l: [-3, -1.0, 0], f: 52 }, { t: c.dur, p: [6, 2.2, 12.5], l: [-3, -1.0, 0], f: 50 }]);
  if (t > tP && t < tM) title(c, 'TEM UM PORÉM', tP);
  if (t > tM && t < tQ) c.chip(960, 90, 'BOMBAS LIGADAS 24 HORAS', 'blue', tM, tQ);
  if (t > tQ) c.chip(960, 90, 'BOMBAS PARAM = TÚNEL ENCHE', 'red', tQ, 1e9);
};

SHOTS.b20 = (c) => {
  const t = c.t; const tT = c.at('O Tito'), tU = c.at('uma noite'), tD = c.at('de uma vez'); c.sfx('engine', 0, 0.4); c.sfx('wind', tU, 0.5); c.sfx('water', tD - 0.4, 0.8);
  if (t < tU) {
    c.env('gen', { power: 1, shake: 0.5 });
    c.track('tito', [{ t: 0, p: [-1.2, 0, -0.6], ry: PI + 0.2, a: 'wipe', e2: 'happy' }]);
    c.cam([{ t: 0, p: [2.5, 2.0, 3.5], l: [-0.6, 1.3, -1.6], f: 46 }, { t: tU, p: [2.0, 1.9, 2.8], l: [-0.8, 1.3, -1.6], f: 44 }]);
    c.chip(960, 90, '20 ANOS DEPOIS', 'gold', 0.2, tU); if (t > tT) c.chip(960, 180, 'TITO, 42 ANOS', 'green', tT + 0.3, tU);
  } else if (t < tD - 0.4) {
    c.env('vault'); c.cam([{ t: tU, p: [1.5, 3.4, 2], l: [0, 5.2, -34], f: 46 }, { t: tD, p: [1, 3.4, -6], l: [0, 5.0, -34], f: 46 }]);
    c.chip(960, 90, 'O GELO COMEÇA A DERRETER', 'blue', tU + 0.2, 1e9);
  } else {
    c.env('metro', { water: lerp(0.15, 0.45, prog(t, tD - 0.4, c.dur)), power: 1 });
    c.cam([{ t: tD - 0.4, p: [-6, 1.0, 8.5], l: [6, -1.2, -2], f: 50 }, { t: c.dur, p: [-5.5, 1.1, 9], l: [6, -1.2, -2], f: 48 }]); c.shake(0.25);
  }
};

// ================= CLÍMAX =================
SHOTS.b21 = (c) => {
  const t = c.t; const tE = c.at('Um estrondo'), tA = c.at('apaga'), tS = c.at('A água começa'); c.sfx('boom', tE, 0.9); c.sfx('blackout', tA, 0.8); c.sfx('water', tS, 0.8);
  if (t < tS) {
    const pw = t < tA ? 1 : 0.06; c.env('gen', { power: pw, shake: t < tE ? 0.5 : 0, smoke: t > tE ? 1 : 0 });
    c.cam([{ t: 0, p: [4, 2.3, 4], l: [0, 1.4, -2.4], f: 48 }, { t: tS, p: [3.2, 2.1, 3.2], l: [0, 1.4, -2.4], f: 46 }]);
    if (t > tE && t < tE + 0.6) c.shake(1.2 * (1 - (t - tE) / 0.6));
    if (t > tA) title(c, 'O GERADOR APAGOU', tA, { size: 84 });
  } else {
    c.env('metro', { water: lerp(0.5, 0.95, prog(t, tS, c.dur)), power: 0.1 });
    c.torch([6, 3, 12], [-2, -0.5, 2], 30);
    c.cam([{ t: tS, p: [7, 1.6, 13], l: [-4, -0.6, 0], f: 52 }, { t: c.dur, p: [6, 1.4, 12], l: [-4, -0.6, 0], f: 50 }]);
    c.chip(960, 90, '+1 PALMO POR MINUTO', 'red', tS + 0.3, 1e9);
  }
};

SHOTS.b22 = (c) => {
  const t = c.t; const tN = c.at('A Nara e o Tito'), tJ = c.at('até o joelho'); c.sfx('heartbeat', 0, 0.5); c.sfx('splash', tN + 0.4, 0.6); c.sfx('splash', tJ, 0.7);
  if (t < tN) { c.env('gen', { power: 0.06, water: 0.05 }); c.cam([{ t: 0, p: [4, 2.0, 4], l: [0, 1.2, -2.4], f: 48 }]); c.torch([3, 3, 3], [0, 0.6, -2.4], 25); timer(c, 18 * 60 - t * 8); return; }
  const W = 0.22; c.env('metro', { water: W, power: 0.35 });
  const x0 = 10, x1 = -4; const u = prog(t, tN, c.dur); const x = lerp(x0, x1, u);
  c.track('narav', [{ t: 0, p: [x, TRK, 1.6], ry: -PI / 2, a: 'run', e2: 'scared', hold: 'light' }]);
  c.track('tito', [{ t: 0, p: [x + 1.5, TRK, 0.6], ry: -PI / 2, a: 'run', e2: 'scared' }]);
  c.torch([x + 1, TRK + 3, 5], [x - 3, TRK + 0.5, 1], 60);
  c.camSet([x - 4.5, TRK + 1.4, 4.6], [x + 0.5, TRK + 0.9, 1.1], 50);
  if (t > tJ) c.chip(960, 90, 'ÁGUA ATÉ O JOELHO', 'red', tJ, 1e9);
  timer(c, 18 * 60 - t * 8);
};

SHOTS.b23 = (c) => {
  const t = c.t; const tN = c.at('não pega'), tC = c.at('um cabo queimado'), tR = c.at('o cabo reserva'); c.sfx('crank', 0.3, 0.6); c.sfx('error', tN, 0.5); c.sfx('spark', tC, 0.6);
  c.env('gen', { power: 0.06, water: 0.2, smoke: 0.4 });
  c.track('tito', [{ t: 0, p: [1.6, 0, -0.6], ry: PI, a: t < tC ? 'crank' : 'tinker', e2: t < tC ? 'angry' : 'worried', hold: 'light' }]);
  c.track('narav', [{ t: 0, p: [-0.6, 0, 0.6], ry: PI - 0.2, a: 'idle', e2: 'worried', hold: 'light' }]);
  c.torch([2.5, 3.2, 2.5], [1.3, 1.2, -1.5], 30);
  if (t < tC) c.cam([{ t: 0, p: [3.8, 2.0, 3.2], l: [0.8, 1.2, -1.2], f: 46 }]);
  else c.cam([{ t: tC, p: [3.8, 1.9, 1.6], l: [1.3, 1.0, -1.3], f: 44 }, { t: c.dur, p: [3.4, 1.8, 1.2], l: [1.3, 1.0, -1.3], f: 42 }]);
  if (t > tC && t < tC + 0.4) c.flash('#ffe066', 0.5 * (1 - (t - tC) / 0.4));
  if (t > tC) c.tag([1.5, 1.6, -1.4], 'CABO QUEIMADO', 'red', tC, 1e9);
  if (t > tR) c.chip(960, 90, 'CABO RESERVA: DO OUTRO LADO DO TÚNEL', 'gold', tR, 1e9);
  timer(c, 14 * 60 - t * 8);
};

SHOTS.b24 = (c) => {
  const t = c.t; const tA = c.at('Ela atravessa'), tV = c.at('e volta'); c.sfx('water', 0, 0.6); c.sfx('splash', tA, 0.6); c.sfx('splash', tV, 0.6);
  const W = 0.78; c.env('metro', { water: W, power: 0.35 });
  if (t < tA) { c.track('narav', [{ t: 0, p: [1.5, PLAT, 10.2], ry: PI, a: 'idle', e2: 'angry', hold: 'light' }]); c.frame('narav', { yaw: 0.3, d: 2.4, h: 1.5, f: 42, to: { d: 2.1 } }); c.torch([1.5, 1.8, 10.5], [1, -0.5, 2], 30); return; }
  // atravessa os trilhos com a água no peito
  const back = t > tV; const u = prog(t, tA, back ? tA + 0.01 : tV);
  const x = back ? lerp(-4, 0, prog(t, tV, c.dur)) : lerp(2, -6, prog(t, tA, tV));
  c.track('narav', [{ t: 0, p: [x, TRK, 3.2], ry: back ? PI / 2 : -PI / 2, a: 'walk', e2: 'scared', hold: back ? 'bolt' : 'light', over: { rsx: 2.6, rel: 0.2 } }]);
  c.torch([x + 1.5, wl(W) + 2.2, 5.5], [x, wl(W) + 0.5, 3.2], 60);
  c.cam([{ t: tA, p: [x + 0.5, wl(W) + 0.7, 7.8], l: [x, wl(W) + 0.6, 3.2], f: 44 }, { t: c.dur, p: [x + 0.5, wl(W) + 0.7, 7.8], l: [x, wl(W) + 0.6, 3.2], f: 44 }]);
  c.camSet([x + 0.8, wl(W) + 0.9, 6.6], [x, wl(W) + 0.5, 3.2], 46);
  if (back) c.chip(960, 90, 'CABO NA MÃO!', 'green', tV, 1e9);
  timer(c, 10 * 60 - t * 8);
};

SHOTS.b25 = (c) => {
  const t = c.t; const tU = c.at('Uma vez'), tD = c.at('Duas vezes'), tB = c.at('batendo na porta'); c.sfx('crank', tU, 0.7); c.sfx('error', tU + 0.8, 0.4); c.sfx('crank', tD, 0.7); c.sfx('error', tD + 0.8, 0.4); c.sfx('water', tB, 0.7);
  const wv = lerp(0.2, 0.45, prog(t, 0, c.dur));
  c.env('gen', { power: 0.06, water: wv, crank: t * 8 });
  c.track('tito', [{ t: 0, p: [-2.4, 0, -0.9], ry: PI - 0.3, a: t < tU ? 'tinker' : 'crank', e2: 'angry' }]);
  c.track('narav', [{ t: 0, p: [-0.2, 0, 0.8], ry: PI + 0.5, a: 'idle', e2: 'scared', hold: 'light' }]);
  c.torch([0, 3.2, 2.2], [-2.2, 1.2, -1.4], 30);
  if (t < tB) c.cam([{ t: 0, p: [-0.6, 1.8, 2.6], l: [-2.3, 1.2, -1.2], f: 46 }, { t: tB, p: [-0.8, 1.7, 2.0], l: [-2.3, 1.2, -1.2], f: 44 }]);
  else { c.cam([{ t: tB, p: [2.6, 0.9, 3.2], l: [-0.5, 0.45, -1.2], f: 50 }]); c.chip(960, 90, 'A ÁGUA CHEGOU NA PORTA', 'red', tB, 1e9); }
  if (t > tU && t < tD) big(c, '1ª… NADA', tU + 0.6, { size: 90, color: '#ff5a3a', glow: 'rgba(255,90,58,.6)', y: 330, x: 1250 });
  if (t > tD && t < tB) big(c, '2ª… NADA', tD + 0.6, { size: 90, color: '#ff5a3a', glow: 'rgba(255,90,58,.6)', y: 330, x: 1250 });
  timer(c, 3 * 60 - t * 20);
};

SHOTS.b26 = (c) => {
  const t = c.t; const tR = c.at('ruge'), tL = c.at('As luzes voltam'), tS = c.at('começa a secar'); c.sfx('crank', 0, 0.6); c.sfx('engine', tR, 0.9); c.sfx('power', tL, 0.7); c.sfx('tada', tS, 0.5);
  if (t < tL) {
    c.env('gen', { power: t < tR ? 0.06 : 1, water: 0.45, shake: t > tR ? 1 : 0, crank: t * 9 });
    c.track('tito', [{ t: 0, p: [-2.4, 0, -0.9], ry: PI - 0.3, a: t < tR ? 'crank' : 'cheer', e2: t < tR ? 'angry' : 'happy' }]);
    c.track('narav', [{ t: 0, p: [-0.2, 0, 0.8], ry: PI + 0.5, a: t < tR ? 'idle' : 'cheer', e2: t < tR ? 'scared' : 'happy' }]);
    if (t < tR) c.torch([0, 3.2, 2.2], [-2.2, 1.2, -1.4], 30);
    c.cam([{ t: 0, p: [-0.6, 1.8, 2.6], l: [-2.3, 1.2, -1.2], f: 46 }, { t: tL, p: [0.6, 2.0, 3.6], l: [-1.4, 1.2, -1.2], f: 50 }]);
    if (t > tR) { c.shake(0.4); title(c, 'O GERADOR RUGIU!', tR, { bg: '#2fa35a' }); }
  } else {
    c.env('metro', { water: lerp(0.9, 0.2, prog(t, tL, c.dur)), power: 1 });
    c.cam([{ t: tL, p: [7, 1.9, 14], l: [-4, -0.6, 0], f: 54 }, { t: c.dur, p: [6, 2.1, 13], l: [-4, -0.8, 0], f: 52 }]);
    c.chip(960, 90, 'O TÚNEL ESTÁ SECANDO', 'green', tL + 0.2, 1e9);
  }
};

SHOTS.b27 = (c) => {
  const t = c.t; const tN = c.at('ninguém se machucou'), tD = c.at('dois geradores'); c.sfx('laugh', tN + 0.6, 0.4); c.sfx('tada', tD, 0.5);
  CAVE(c, { sun: 0.4 }); plazaPeople(c, 20, { seed: 12, a: (i) => (i % 3 ? 'idle' : 'clap'), r: 5 });
  c.track('luz', [{ t: 0, p: [0.4, 0, -3.2], ry: 0.5, a: 'write', e2: 'happy', hold: 'paper' }]);
  c.track('tito', [{ t: 0, p: [-0.9, 0, -4.2], ry: 0.5, a: 'shrug', e2: 'happy' }]);
  c.track('narav', [{ t: 0, p: [-1.8, 0, -3.4], ry: 0.8, a: 'idle', e2: 'happy' }]);
  c.cam([{ t: 0, p: [1.6, 1.8, 1.2], l: [-0.6, 1.2, -3.8], f: 48 }, { t: c.dur, p: [1.2, 1.7, 0.4], l: [-0.6, 1.2, -3.8], f: 46 }]);
  if (t > tN && t < tD) c.chip(960, 90, 'SÓ ROUPA MOLHADA 😅', 'blue', tN, tD);
  if (t > tD) title(c, '+2 GERADORES RESERVA', tD, { bg: '#2fa35a', size: 80 });
};

// ================= FINAL =================
SHOTS.b28 = (c) => {
  const t = c.t; const tC = c.at('a câmera'), tA = c.at('céu azul'); c.sfx('pad', 0, 0.5); c.sfx('twinkle', tA, 0.6);
  CAVE(c, { sun: 0.7 });
  for (let i = 0; i < 12; i++) c.mini(i, { p: [-3 + (i % 6) * 1.2, 0, -7 - Math.floor(i / 6) * 1.2], ry: PI, a: t > tA ? 'cheer' : 'idle', e: t > tA ? 'happy' : 'neutral', s: i % 4 ? 0.95 : 0.62 });
  c.cam([{ t: 0, p: [0, 3, 2], l: [0, 2, -10], f: 52 }, { t: c.dur, p: [0, 2.6, 0.5], l: [0, 2.4, -10], f: 52 }]);
  if (t < tC) c.chip(960, 90, 'AS CINZAS VÃO BAIXANDO…', 'white', 0.3, tC);
  if (t > tC) { const k = prog(t, tA - 0.3, tA + 0.5); const sky = k > 0 ? `linear-gradient(#4f8fd6 ${(1 - k) * 100}%, #6a6a6a)` : '#6a6a6a'; c.ui(monitor(`<div style="width:100%;height:100%;background:${k > 0 ? `linear-gradient(rgba(106,106,106,${1 - k}),rgba(106,106,106,${1 - k})),linear-gradient(#3f7fd0,#bcd6ee)` : '#6a6a6a'};position:relative"><div style="position:absolute;left:0;right:0;bottom:0;height:90px;background:#e8eef2"></div><div style="position:absolute;left:18px;top:12px;font:900 30px Inter;color:#ff3b30">● CÂMERA · SUPERFÍCIE</div></div>`, { y: 170, w: 760, h: 420, s: pop(t, tC, 0.3) || 1 })); }
  if (t > tA) title(c, 'CÉU AZUL!', tA, { bg: '#2a6ad6', top: 640, size: 100 });
};

SHOTS.b29 = (c) => {
  const t = c.t; const tP = c.at('Ele é o primeiro'), tC = c.at('Ele chora'); c.sfx('wind', 0, 0.3); c.sfx('pad', tP, 0.5); c.sfx('aww', tC, 0.5);
  c.env('farm', { cycle: 0.22, plant: 0 });
  if (t < tP) { CAVE(c, { sun: 0.8 }); c.track('solv', [{ t: 0, p: [-11, 0, -20], ry: 0.3, a: 'idle', e2: 'happy' }]); c.track('narav', [{ t: 0, p: [-9.5, 0, -18.6], ry: -1.2, a: 'wave', e2: 'happy' }]); c.cam([{ t: 0, p: [-6.5, 1.8, -14.5], l: [-10.5, 1.4, -19.5], f: 44 }, { t: tP, p: [-7, 1.8, -15], l: [-10.5, 1.4, -19.5], f: 44 }]); c.chip(960, 90, 'SOL, 25 ANOS', 'gold', 0.3, 1e9); return; }
  c.track('solv', [{ t: 0, p: [0, 0, 6], ry: PI, a: t < tC ? 'lookup' : 'wipe', e2: t < tC ? 'surprised' : 'cry' }]);
  if (t < tC) c.cam([{ t: tP, p: [0, 1.2, 0.5], l: [0, 2.2, 6], f: 50 }, { t: tC, p: [0, 1.4, 2.5], l: [0, 2.0, 6], f: 48 }]);
  else c.frame('solv', { yaw: 0.2, d: 2.2, h: 1.55, f: 40, t0: tC, to: { d: 1.8 } });
  c.state.fade = 0;
};

SHOTS.b30 = (c) => {
  const t = c.t; const tR = c.at('Recomeçou porque'), tL = c.at('até a luz voltar'); c.sfx('pad', 0, 0.5);
  c.env('final', {});
  c.crowd(Array.from({ length: 60 }, (_, i) => { const a = i * 2.399, r = 3 + Math.sqrt(i) * 0.9; const x = Math.cos(a) * r, z = Math.sin(a) * r - 2; return { p: [x, 0, z], ry: Math.atan2(-x, 6 - z), c: COLS[i % COLS.length], s: i % 4 ? 0.95 : 0.65, a: 'idle' }; }));
  c.track('solv', [{ t: 0, p: [0, 0, 3.8], ry: 0, a: 'idle', e2: 'happy' }]);
  c.cam([{ t: 0, p: [0.6, 3.4, 8.6], l: [0, 1.2, 2.5], f: 50 }, { t: c.dur, p: [0.5, 3.2, 7.6], l: [0, 1.2, 2.5], f: 50 }]);
  if (t > tR) c.chip(960, 140, 'VIVERAM NO ESCURO', 'gold', tR, 1e9); if (t > tL) c.chip(960, 230, 'ATÉ A LUZ VOLTAR', 'blue', tL, 1e9);
  c.state.fade = prog(t, c.dur - 0.5, c.dur);
};

SHOTS.b31 = (c) => {
  const t = c.t; const tQ = c.at('Teria coragem'), tM = c.at('ilha deserta'), tS = c.at('Se inscreve'), tB = c.at('Até lá'); c.sfx('whoosh', tM, 0.5); c.sfx('click', tS + 1.1, 0.8); c.sfx('ding', tS + 1.15, 0.6); c.sfx('tada', tB, 0.6);
  c.env('outro');
  const w = t > tB;
  [['nara', -3.0, 0.3], ['luz', -1.0, 0.1], ['beto', 1.0, -0.1], ['tito', 3.0, -0.3]].forEach(([n, x, ry]) => c.track(n, [{ t: 0, p: [x, 0, 5.1], ry, a: w ? 'wave' : 'idle', e2: 'happy' }]));
  c.cam([{ t: 0, p: [0, 1.9, 12.4], l: [0, 2.0, 5], f: 42 }, { t: c.dur, p: [0, 2.0, 11.4], l: [0, 2.0, 5], f: 42 }]);
  if (t > tQ && t < tM - 1.5) { const a = clamp((t - tQ) / 0.4); c.ui(`<div class="abs" style="left:0;top:130px;width:1920px;text-align:center;font-weight:900;font-size:60px;color:#fff;opacity:${a};text-shadow:0 5px 0 #000">VOCÊ TERIA CORAGEM?</div>`);
    ['SIM 🕳️', 'NÃO ☀️'].forEach((l, i) => { const s = pop(t, tQ + 0.5 + i * 0.3, 0.25); c.ui(`<div class="abs" style="left:${580 + i * 420}px;top:240px;width:340px;padding:20px 0;text-align:center;border-radius:24px;background:${['#38d6ff', '#ffb02e'][i]};color:#111;font-weight:900;font-size:64px;transform:scale(${s})">${l}</div>`); }); }
  if (t > tM - 1.4 && t < tS - 0.1) { c.ui(`<div class="abs" style="left:0;top:120px;width:1920px;text-align:center;font-weight:900;font-size:60px;color:#fff;text-shadow:0 5px 0 #000">PRÓXIMO EPISÓDIO</div>`); c.ui(bigNum('NUMA ILHA DESERTA?', 960, 270, { size: 120, color: '#ffd21f', glow: 'rgba(255,210,31,.6)', s: pop(t, tM - 1.4, 0.3) || 1 })); }
  if (t < tB) subBtn(c, tS);
  if (t > tB) c.ui(bigNum('ATÉ LÁ!', 960, 250, { size: 190, color: '#ffd21f', glow: 'rgba(255,210,31,.7)', s: pop(t, tB, 0.3) || 1 }));
  c.state.fade = prog(t, c.dur - 1.0, c.dur);
};
