import * as THREE from 'three';
import { Char, ANIMS, EMOTES, blendPose, makeProp, lam } from './chars.js';
import { buildEnvs } from './envs.js';
import { RChar, loadRobloxFaces } from './roblox.js';
import { makeMoto, makeCar, makeCart, makePanel, makeFire } from './vehicles.js';

const Q = new URLSearchParams(location.search);
const EP = Q.get('ep') || '/episodes/2026-10-28-humanidade-2-pessoas';
const FMT = Q.get('fmt') || 'long';
const W = +(Q.get('w') || (FMT === 'short' ? 1080 : 1920)), H = +(Q.get('h') || (FMT === 'short' ? 1920 : 1080));
const SCALE = +(Q.get('scale') || 1);
const stage = document.getElementById('stage'); stage.style.width = W + 'px'; stage.style.height = H + 'px'; stage.classList.add(FMT);
for (const id of ['c', 'ov']) { const e = document.getElementById(id); e.style.width = W + 'px'; e.style.height = H + 'px'; }
const MOD = await import(EP + '/shots.js'); const SHOTS = MOD.SHOTS;
window.W = W; window.H = H; window.FMT = FMT;
const canvas = document.getElementById('c');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, preserveDrawingBuffer: true });
renderer.setPixelRatio(SCALE); renderer.setSize(W, H, false);
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(50, W / H, 0.1, 900);
const hemi = new THREE.HemisphereLight(0xffffff, 0x888899, 1.0); scene.add(hemi);
const sun = new THREE.DirectionalLight(0xffffff, 1.0); scene.add(sun, sun.target);
await Promise.all(['700 40px Inter', '800 40px Inter', '900 40px Inter'].map(f => document.fonts.load(f)));
await loadRobloxFaces();
const ENV = buildEnvs(THREE, scene);
for (const k in ENV) { ENV[k].g.visible = false; scene.add(ENV[k].g); }

// ---- personagens ----
const DEFAULT_CAST = {
  caio: { cap: 0x1b8a3c, capYaw: 0 },
  lia: { shirt: 0x7b3fe4, trim: 0xffffff, shorts: 0x2b2f45, shoes: 0xffffff, num: null, flag: false, hair: 'lia', scale: 0.96 },
};
const CAST = MOD.CAST || DEFAULT_CAST;
const mk = (o) => (o.style === 'roblox' || (FMT === 'short' && o.style !== 'palito')) ? new RChar(o) : new Char(o);
const CH = {}; for (const k in CAST) CH[k] = mk(CAST[k]);
for (const k in CH) { CH[k].root.visible = false; scene.add(CH[k].root); }
const TL = await (await fetch(Q.get('tl') || (EP + '/timeline.json'))).json();
const BEATS = TL.beats;
// mini pessoas (multidão/fogueira)
const MINI = []; {
  const cols = [0xe74c3c, 0x3498db, 0xf1c40f, 0x2ecc71, 0x9b59b6, 0xe67e22, 0x1abc9c, 0xff6b9d, 0xffffff];
  const N = FMT === 'short' ? 40 : 120; const roblox = FMT === 'short' || MOD.MINI_STYLE === 'roblox';
  const hairs = ['short', 'long', 'bun', 'curly', 'spiky', 'pony', 'bald'], skins = ['light', 'tan', 'brown', 'dark', 'white'];
  for (let i = 0; i < N; i++) { const c = roblox ? new RChar({ shirt: cols[i % 9], pants: [0x223355, 0x444444, 0x553322, 0x1f1f1f][i % 4], skin: skins[i % 5], hair: hairs[(i * 3) % 7], hairColor: [0x2a1a0e, 0x6b4423, 0xd8b04a, 0x111111][i % 4], scale: 0.78 + (i % 5) * 0.02 })
    : new Char({ shirt: cols[i % cols.length], trim: cols[(i * 3) % cols.length], shorts: [0x223355, 0x444444, 0x553322][i % 3], num: null, flag: false, cap: i % 5 == 0 ? cols[(i + 2) % cols.length] : null, scale: 0.6 + (i % 7) * 0.05 });
    c.root.visible = false; scene.add(c.root); MINI.push(c); }
}
const PROPS = { moto: makeMoto(), car: makeCar(), cart: makeCart(), panel: makePanel(), fire: makeFire(), panel2: makePanel(), panel3: makePanel() };
for (const k in PROPS) { PROPS[k].visible = false; scene.add(PROPS[k]); }
let COLLECT = null;
const WPROPS = {}; const WPUSED = {};
function worldProp(key, o = {}) { const list = (WPROPS[key] ||= []); const i = (WPUSED[key] = (WPUSED[key] || 0) + 1) - 1; if (!list[i]) { const g = makeProp(key); scene.add(g); list.push(g); }
  const g = list[i]; g.visible = true; g.position.set(...(o.p || [0, 0, 0])); g.rotation.set(...(o.r || [0, 0, 0])); g.scale.setScalar(o.s || 1); return g; }
const TORCH = new THREE.SpotLight(0xfff2c0, 0, 40, 0.5, 0.6, 1.0); scene.add(TORCH, TORCH.target);
const GLOW = new THREE.PointLight(0xff9a40, 0, 14, 1.5); scene.add(GLOW);
const PUFF = new THREE.Group(); scene.add(PUFF); const PUFFS = []; for (let i = 0; i < 40; i++) { const s = new THREE.Mesh(new THREE.SphereGeometry(0.3, 8, 6), new THREE.MeshBasicMaterial({ color: 0x777777, transparent: true, opacity: 0.5, depthWrite: false })); s.visible = false; PUFF.add(s); PUFFS.push(s); }
const CROWD = (() => { const N = 160, g = new THREE.Group(); const mk = (geo, mat) => { const m = new THREE.InstancedMesh(geo, mat, N); m.instanceMatrix.setUsage(THREE.DynamicDrawUsage); m.frustumCulled = false; g.add(m); return m; };
  const skin = lam(0x0d0d12); const head = mk(new THREE.SphereGeometry(0.3, 12, 10), skin), torso = mk(new THREE.CapsuleGeometry(0.2, 0.3, 3, 8), new THREE.MeshLambertMaterial({ color: 0xffffff })), legs = mk(new THREE.CapsuleGeometry(0.09, 0.7, 3, 6), skin), arms = mk(new THREE.CapsuleGeometry(0.07, 0.5, 3, 6).translate(0, -0.3, 0), skin); g.visible = false; scene.add(g); return { g, head, torso, legs, arms, N }; })();
// ---- util ----
const ease = { lin: x => x, io: x => x * x * (3 - 2 * x), o: x => 1 - (1 - x) * (1 - x), i: x => x * x, oo: x => 1 - Math.pow(1 - x, 3) };
const lerp = (a, b, t) => a + (b - a) * t;
const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const lerpV = (a, b, t) => a.map((v, i) => lerp(v, b[i], t));
function angLerp(a, b, t) { let d = ((b - a + Math.PI) % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI) - Math.PI; return a + d * t; }
function seg(keys, t) { let i = 0; while (i < keys.length - 1 && t >= keys[i + 1].t) i++; const k0 = keys[i], k1 = keys[Math.min(i + 1, keys.length - 1)]; const span = k1.t - k0.t; const u = span > 0 ? clamp((t - k0.t) / span) : 0; return { i, k0, k1, u }; }
const STRIDE = { walk: 1.5, run: 3.0, carry: 1.5, sprint: 3.0, shoulder: 3.0 };

const ovEl = document.getElementById('ov'), capEl = document.getElementById('cap'), flashEl = document.getElementById('flash'), vigEl = document.getElementById('vig');

function makeCtx(beat, t) {
  const ui = [];
  const ctx = {
    THREE, scene, camera, t, beat, dur: beat.dur, u: t / beat.dur, ENV, CH, MINI, PROPS, ease, lerp, clamp, lerpV, uiList: ui,
    state: { shake: 0, flash: null, fade: 0, noCap: false, vig: 1, noise: 0 },
    env(name, p = {}) { const E = ENV[name]; if (!E) throw new Error('env? ' + name); for (const k in ENV) ENV[k].g.visible = false; E.g.visible = true; E.apply && E.apply(p, t, ctx);
      scene.background = new THREE.Color(E.bg); if (E.fog) scene.fog = new THREE.Fog(E.fog[0], E.fog[1], E.fog[2]); else scene.fog = null;
      hemi.color.set(E.hemi[0]); hemi.groundColor.set(E.hemi[1]); hemi.intensity = E.hemi[2]; sun.color.set(E.sun[0]); sun.intensity = E.sun[1]; sun.position.set(...E.sun[2]); sun.target.position.set(0, 0, 0);
      ctx.cur = E; return E; },
    cam(keys, o = {}) { const { i, k0, k1, u } = seg(keys, t); const e = ease[k0.e || o.e || 'io'](u);
      const p = lerpV(k0.p, k1.p, e), l = lerpV(k0.l, k1.l, e); camera.fov = lerp(k0.f || 50, k1.f || k0.f || 50, e); camera.updateProjectionMatrix();
      camera.position.set(...p); camera.up.set(0, 1, 0); camera.lookAt(new THREE.Vector3(...l)); const roll = lerp(k0.r || 0, k1.r || 0, e); if (roll) camera.rotateZ(roll); },
    shake(a, f = 24) { const s = a * 0.05; camera.position.x += (Math.sin(t * f * 1.3) + Math.sin(t * f * 0.7 + 1)) * s * 0.5; camera.position.y += (Math.sin(t * f * 1.1 + 2)) * s * 0.5; camera.position.z += Math.sin(t * f * 0.9 + 4) * s * 0.3; camera.rotateZ(Math.sin(t * f) * a * 0.004); },
    track(name, keys) { const c = CH[name]; return placeChar(c, keys, t, ctx); },
    mini(i, o) { const c = MINI[i]; c.root.visible = true; c.root.position.set(...o.p); c.root.rotation.y = o.ry || 0; const A = ANIMS[o.a || 'idle'](t + i * 0.37, (o.ph != null ? o.ph : t * 4) + i); c.pose(A, Object.assign({ name: o.e || 'happy' }, EMOTES[o.e || 'happy'])); c.shadow.visible = true; if (o.s) c.root.scale.setScalar(o.s); return c; },
    ui(h) { ui.push(h); },
    proj(v) { const p = new THREE.Vector3(...v).project(camera); return { x: (p.x * 0.5 + 0.5) * W, y: (-p.y * 0.5 + 0.5) * H, z: p.z }; },
    at(str) { const s = str.toLowerCase(); const parts = []; let full = ''; for (const c of beat.chunks) { const txt = c.words.map(w => w.w).join(' ').toLowerCase(); parts.push({ s: full.length, e: full.length + txt.length, c }); full += txt + ' '; }
      const ix = full.indexOf(s); if (ix < 0) { console.warn('at? ' + str + ' in ' + beat.id); return beat.dur * 0.5; }
      const p = parts.find(q => ix >= q.s && ix < q.e + 1) || parts[parts.length - 1]; return lerp(p.c.t0, p.c.t1, clamp((ix - p.s) / Math.max(1, p.e - p.s))); },
    lastChunkT() { return beat.chunks[beat.chunks.length - 1].t0; },
    bubble(char, text, t0, t1, off = [0, 2.5, 0]) { if (t < t0 || t > t1) return; const a = clamp((t - t0) / 0.12) * clamp((t1 - t) / 0.12); const w = char.root.position; const s = ctx.proj([w.x + off[0], w.y + off[1], w.z + off[2]]); ui.push(`<div class="bubble" style="left:${s.x}px;top:${s.y}px;opacity:${a};transform:translate(-50%,-100%) scale(${0.8 + 0.2 * a})">${text}</div>`); },
    tag(v, text, cls = 'gold', t0 = 0, t1 = 1e9) { if (t < t0 || t > t1) return; const a = clamp((t - t0) / 0.15) * clamp((t1 - t) / 0.15); const s = ctx.proj(v); const hw = text.length * 10 + 40; s.x = clamp(s.x, hw + 24, W - hw - 24); s.y = clamp(s.y, 60, H - 80); ui.push(`<div class="chip ${cls}" style="left:${s.x}px;top:${s.y}px;opacity:${a};transform:translate(-50%,-50%) scale(${0.85 + 0.15 * a})">${text}</div>`); },
    chip(x, y, text, cls = 'gold', t0 = 0, t1 = 1e9) { if (t < t0 || t > t1) return; const a = clamp((t - t0) / 0.15) * clamp((t1 - t) / 0.15); ui.push(`<div class="chip ${cls}" style="left:${x}px;top:${y}px;opacity:${a};transform:translate(-50%,-50%) scale(${0.85 + 0.15 * a})">${text}</div>`); },
    sfx(name, t0, vol = 1) { if (COLLECT) COLLECT.push({ n: name, t: beat.start + t0, v: vol }); },
    B(id) { return BEATS.find(b => b.id === id); },
    pos(name) { return CH[name].root.position; },
    camSet(p, l, f = 50, roll = 0) { camera.fov = f; camera.updateProjectionMatrix(); camera.position.set(...p); camera.up.set(0, 1, 0); camera.lookAt(new THREE.Vector3(...l)); if (roll) camera.rotateZ(roll); },
    torch(p, tgt, I = 80) { TORCH.position.set(...p); TORCH.target.position.set(...tgt); TORCH.intensity = I; },
    glow(p, color, I = 12) { GLOW.position.set(...p); GLOW.color.set(color); GLOW.intensity = I; },
    puffs(p, k, o = {}) { const n = Math.floor(k * 40); PUFFS.forEach((s, i) => { if (i >= n) { s.visible = false; return; } const ph = ((t * (o.speed || 0.7) + i * 0.137) % 1); s.visible = true; s.position.set(p[0] + Math.sin(i * 2.1 + t) * 0.25 * (o.spread || 1), p[1] + ph * (o.rise || 2.4), p[2] + Math.cos(i * 1.7) * 0.25 * (o.spread || 1)); s.scale.setScalar(0.4 + ph * (o.grow || 1.8)); s.material.color.set(o.color || 0x777777); s.material.opacity = (1 - ph) * (o.op || 0.55); }); },
    crowd(list, o = {}) { const C = CROWD; C.g.visible = true; const d = new THREE.Object3D(); const n = Math.min(list.length, C.N); C.head.count = C.torso.count = C.legs.count = n; C.arms.count = n * 2; const colr = new THREE.Color();
      for (let i = 0; i < n; i++) { const q = list[i]; const s = q.s || 1; const bob = (q.a === 'cheer' ? Math.abs(Math.sin(t * 7 + i)) * 0.25 : q.a === 'walk' ? Math.abs(Math.sin(t * 6 + i)) * 0.05 : Math.sin(t * 2 + i) * 0.01) * s; const sw = (q.a === 'walk') ? Math.sin(t * 6 + i) * 0.5 : 0;
        const base = new THREE.Matrix4().compose(new THREE.Vector3(q.p[0], q.p[1] + bob, q.p[2]), new THREE.Quaternion().setFromEuler(new THREE.Euler(0, q.ry || 0, 0)), new THREE.Vector3(s, s, s));
        const put = (mesh, idx, lp, sc = [1, 1, 1], rot = [0, 0, 0]) => { d.position.set(...lp); d.scale.set(...sc); d.rotation.set(...rot); d.updateMatrix(); mesh.setMatrixAt(idx, new THREE.Matrix4().multiplyMatrices(base, d.matrix)); };
        put(C.head, i, [0, 1.62, 0]); put(C.torso, i, [0, 1.12, 0], [1.18, 1, 0.72]); put(C.legs, i, [0, 0.45, 0], [1.9, 1, 1]);
        const ch = q.a === 'cheer'; put(C.arms, i * 2, [0.25, 1.4, 0], [1, 1, 1], [-sw, 0, ch ? 2.6 : 0.14]); put(C.arms, i * 2 + 1, [-0.25, 1.4, 0], [1, 1, 1], [sw, 0, ch ? -2.6 : -0.14]);
        if (q.a === 'cheer') { d.position.set(0.4, 1.7, 0); } colr.set(q.c || 0xffffff); C.torso.setColorAt(i, colr); }
      for (const m of [C.head, C.torso, C.legs, C.arms]) { m.instanceMatrix.needsUpdate = true; } if (C.torso.instanceColor) C.torso.instanceColor.needsUpdate = true; },
    prop(key, o) { return worldProp(key, o); },
    // enquadra um personagem (nome) ou ponto [x,y,z]. o: {d distância, h altura do alvo, up altura extra da câmera, yaw ângulo (0 = de frente pro personagem), side deslocamento lateral, f fov}
    // o.to = mesmos campos no fim do beat (ou o.t0/o.t1 para intervalo) — interpola suave.
    frame(target, o = {}) { const base = (typeof target === 'string') ? CH[target].root : null; const P = base ? base.position : new THREE.Vector3(...target); const ry0 = base ? base.rotation.y : 0;
      const k = o.to ? ease.io(clamp((t - (o.t0 ?? 0)) / ((o.t1 ?? beat.dur) - (o.t0 ?? 0)))) : 0; const v = (f, d) => { const a = o[f] ?? d; const b = o.to && o.to[f] !== undefined ? o.to[f] : a; return lerp(a, b, k); };
      const d = v('d', 2.6), h = v('h', 1.55), up = v('up', 0.05), yaw = ry0 + v('yaw', 0), side = v('side', 0), f = v('f', 50);
      const fx = Math.sin(yaw), fz = Math.cos(yaw); const cx = P.x + fx * d + fz * side, cz = P.z + fz * d - fx * side;
      const drop = v('drop', (FMT === 'short' ? 0.3 : 0.12) * d * Math.tan(f * Math.PI / 360)); ctx.camSet([cx, P.y + h + up - drop * 0.5, cz], [P.x + fz * side * 0.3, P.y + h - drop, P.z - fx * side * 0.3], f, v('roll', 0)); },
    fade(a) { ctx.state.fade = a; }, flash(c, a) { ctx.state.flash = [c, a]; },
  };
  return ctx;
}

function evalPose(k, t, ph, em) { return ANIMS[k.a || 'idle'](t, ph); }
function placeChar(c, keys, t, ctx) {
  const { i, k0, k1, u } = seg(keys, t);
  const e = ease[k0.e || 'lin'](u);
  const hasP = k => k.p !== undefined;
  // posição
  let pk = keys.filter(hasP); let pos = [0, 0, 0];
  if (pk.length) { const s2 = seg(pk, t); pos = lerpV(s2.k0.p, s2.k1.p, ease[s2.k0.e || 'lin'](s2.u)); }
  // distância acumulada p/ fase
  let dist = 0; for (let j = 0; j < pk.length - 1; j++) { const a = pk[j], b = pk[j + 1]; const L = Math.hypot(b.p[0] - a.p[0], b.p[2] - a.p[2]); if (t >= b.t) dist += L; else if (t > a.t) { dist += L * ease[a.e || 'lin']((t - a.t) / (b.t - a.t)); } }
  const A = k0.a || 'idle'; const stride = STRIDE[A] || 1.5;
  const phase = (STRIDE[A] ? dist / stride * Math.PI * 2 : t * 6);
  let pose = ANIMS[A](t, phase);
  if (i > 0 && t - k0.t < 0.22 && (keys[i - 1].a || 'idle') !== A) { const Ap = keys[i - 1].a || 'idle'; const ph0 = STRIDE[Ap] ? dist / STRIDE[Ap] * Math.PI * 2 : t * 6; pose = blendPose(ANIMS[Ap](t, ph0), pose, (t - k0.t) / 0.22); }
  // emote
  const em = EMOTES[k0.e2 || 'neutral']; c.root.visible = true;
  const num = (f, d = 0) => { const a = k0[f] !== undefined ? k0[f] : d; const b = k1[f] !== undefined ? k1[f] : a; return lerp(a, b, e); };
  let ry = k0.ry !== undefined ? angLerp(k0.ry, k1.ry !== undefined ? k1.ry : k0.ry, e) : 0;
  if (k0.face && !k0.ry) { const f = k0.face; ry = Math.atan2(f[0] - pos[0], f[2] - pos[2]); }
  c.root.position.set(pos[0], pos[1] + num('y', 0), pos[2]); c.root.rotation.set(num('rx', 0), ry, num('rz', 0), 'YXZ');
  c.root.scale.setScalar(num('s', c.o.scale));
  c._blink = (Math.sin(t * 1.9 + c.o.shirt) > 0.985) ? 0.9 : 0; c._gx = k0.gx || 0; c._gy = k0.gy || 0;
  c.setHold(k0.hold || null);
  const emN = k0.e2 || 'neutral'; const emO = Object.assign({ name: emN }, EMOTES[emN]);
  if (i > 0 && t - k0.t < 0.15 && keys[i - 1].e2 && keys[i - 1].e2 !== emN) { const pe = EMOTES[keys[i - 1].e2]; const w = (t - k0.t) / 0.15; for (const f of ['eye', 'lid', 'tilt', 'pr']) emO[f] = lerp(pe[f], emO[f], w); }
  if (k0.over) for (const f in k0.over) pose[f] = k0.over[f];
  c.pose(pose, emO); c.shadow.visible = (k0.y || 0) < 0.3 && !(k0.rx);
  return c;
}

function findBeat(t) { for (const b of BEATS) if (t >= b.start && t < b.start + b.dur) return b; return BEATS[BEATS.length - 1]; }

window.renderAt = (T) => {
  const beat = findBeat(T); const t = Math.min(T - beat.start, beat.dur - 1e-3);
  for (const k in CH) CH[k].root.visible = false; for (const m of MINI) m.root.visible = false;
  for (const k in PROPS) PROPS[k].visible = false; for (const k in WPROPS) { WPROPS[k].forEach(g => g.visible = false); WPUSED[k] = 0; } TORCH.intensity = 0; GLOW.intensity = 0; PUFFS.forEach(s => s.visible = false); CROWD.g.visible = false;
  const ctx = makeCtx(beat, t); ctx.T = T;
  const f = SHOTS[beat.id]; if (!f) throw new Error('shot? ' + beat.id); f(ctx);
  ovEl.innerHTML = ctx.uiList.join('');
  // legenda
  let html = '', capOp = 1, sc = 1;
  if (!ctx.state.noCap) { const ch = beat.chunks; for (let i = 0; i < ch.length; i++) { const c = ch[i]; const nxt = ch[i + 1]; const end = nxt && nxt.t0 - c.t1 < 0.45 ? nxt.t0 : c.t1 + 0.25; if (t >= c.t0 - 0.03 && t < end) { html = c.words.map(w => `<span class="${w.c ? 'w-' + w.c : ''}">${w.w}</span>`).join(' '); const a = clamp((t - c.t0 + 0.03) / 0.09); sc = 0.9 + 0.1 * a; capOp = clamp(a * 2); break; } } }
  capEl.innerHTML = html; capEl.style.opacity = capOp; capEl.style.transform = `scale(${sc})`;
  const S = ctx.state; flashEl.style.opacity = S.flash ? S.flash[1] : 0; flashEl.style.background = S.flash ? S.flash[0] : '#fff';
  vigEl.style.opacity = S.vig;
  // fade p/ preto (global): início/fim de cada beat opcional
  document.getElementById('stage').style.background = '#000'; canvas.style.opacity = 1 - S.fade; ovEl.style.opacity = 1 - S.fade;
  renderer.render(scene, camera);
  return beat.id + ' ' + t.toFixed(2);
};
window.renderShot = (name, t) => { const beat = { id: name, start: 0, dur: 20, chunks: [] }; for (const k in CH) CH[k].root.visible = false; for (const m of MINI) m.root.visible = false; for (const k in PROPS) PROPS[k].visible = false; for (const k in WPROPS) { WPROPS[k].forEach(g => g.visible = false); WPUSED[k] = 0; } TORCH.intensity = 0; GLOW.intensity = 0; PUFFS.forEach(s => s.visible = false); CROWD.g.visible = false;
  const ctx = makeCtx(beat, t); ctx.T = t; SHOTS[name](ctx); ovEl.innerHTML = ctx.uiList.join(''); capEl.innerHTML = ''; canvas.style.opacity = 1; renderer.render(scene, camera); return name; };
await document.fonts.ready; await new Promise(r => setTimeout(r, 200)); window.ready = true; window.TOTAL = TL.total;

window.getSfx = () => { COLLECT = []; const out = [];
  for (const b of BEATS) { for (let tt = 0; tt < b.dur; tt += 0.1) { COLLECT = []; try { const c = makeCtx(b, tt); c.T = b.start + tt; SHOTS[b.id] && SHOTS[b.id](c); } catch (e) { if (tt === 0) console.log('sfxerr ' + b.id + ' ' + e.message); }
      for (const e of COLLECT) { if (!out.some(o => o.n === e.n && Math.abs(o.t - e.t) < 0.3)) out.push(e); } } }
  COLLECT = null; return out; };
