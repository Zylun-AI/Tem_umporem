import { lam } from './chars.js';
import { extraEnvs } from './envs2.js';
import { moreEnvs } from './envs3.js';
import { caveEnvs } from './envs4.js';
import { islandEnvs } from './envs5.js';

export function buildEnvs(THREE, scene) {
  const envs = {};
  const rng = (seed) => () => { seed |= 0; seed = seed + 0x6D2B79F5 | 0; let t = Math.imul(seed ^ seed >>> 15, 1 | seed); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
  const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
  const lerp = (a, b, t) => a + (b - a) * t;
  const col = (c) => new THREE.Color(c);
  const mix = (a, b, t) => col(a).lerp(col(b), t);
  const B = (g, w, h, d, c, x = 0, y = 0, z = 0, o = {}) => { const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), o.basic ? new THREE.MeshBasicMaterial({ color: c }) : lam(c, o.m || {})); m.position.set(x, y, z); if (o.r) m.rotation.set(...o.r); g.add(m); return m; };
  const Cy = (g, rt, rb, h, c, x = 0, y = 0, z = 0, o = {}) => { const m = new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, o.seg || 16), o.basic ? new THREE.MeshBasicMaterial({ color: c }) : lam(c)); m.position.set(x, y, z); if (o.r) m.rotation.set(...o.r); g.add(m); return m; };
  const Sp = (g, r, c, x = 0, y = 0, z = 0, o = {}) => { const m = new THREE.Mesh(new THREE.SphereGeometry(r, o.seg || 14, o.seg ? o.seg - 4 : 10), o.basic ? new THREE.MeshBasicMaterial({ color: c, ...(o.m || {}) }) : lam(c, o.m || {})); m.position.set(x, y, z); if (o.s) m.scale.set(...o.s); g.add(m); return m; };
  const Pl = (g, w, h, mat, x = 0, y = 0, z = 0, r = [0, 0, 0]) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), mat); m.position.set(x, y, z); m.rotation.set(...r); g.add(m); return m; };
  const cvs = (w, h, f) => { const c = document.createElement('canvas'); c.width = w; c.height = h; const x = c.getContext('2d'); f(x, w, h); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; return t; };
  const mkEnv = (name, def) => { const g = new THREE.Group(); const E = Object.assign({ g, bg: 0x000000, fog: null, hemi: [0xffffff, 0x888888, 1], sun: [0xffffff, 1, [10, 20, 10]] }, def(g)); envs[name] = E; return E; };
  // céu em gradiente
  const sky = (g, R = 600) => { const geo = new THREE.SphereGeometry(R, 24, 16); const n = geo.attributes.position.count; geo.setAttribute('color', new THREE.BufferAttribute(new Float32Array(n * 3), 3));
    const m = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ vertexColors: true, side: THREE.BackSide, fog: false, depthWrite: false })); m.renderOrder = -10; g.add(m);
    m.userData.set = (top, hor) => { const p = geo.attributes.position, c = geo.attributes.color; const T = col(top), H = col(hor); for (let i = 0; i < n; i++) { const y = clamp(p.getY(i) / R * 1.6 + 0.1); const k = Math.pow(y, 0.7); c.setXYZ(i, lerp(H.r, T.r, k), lerp(H.g, T.g, k), lerp(H.b, T.b, k)); } c.needsUpdate = true; };
    m.frustumCulled = false; return m; };
  const hex = (c) => '#' + col(c).getHexString();
  const winTex = (base, lit, seed, rows = 18, cols = 6, glass = 0x8fb4d9) => cvs(128, 256, (x, w, h) => { const R = rng(seed); x.fillStyle = hex(base); x.fillRect(0, 0, w, h);
    const cw = w / cols, ch = h / rows; for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) { if (lit <= 0) x.fillStyle = hex(col(glass).multiplyScalar(0.8 + R() * 0.3)); else x.fillStyle = R() < lit ? '#ffd98a' : hex(col(base).multiplyScalar(0.35)); x.fillRect(c * cw + 3, r * ch + 3, cw - 6, ch - 6); } });

  // ================= RUA (Paulista) =================
  mkEnv('street', (g) => {
    const R = rng(7); const skyM = sky(g);
    // chão
    const roadTex = cvs(256, 512, (x, w, h) => { x.fillStyle = '#44474c'; x.fillRect(0, 0, w, h); for (let i = 0; i < 1400; i++) { x.fillStyle = `rgba(${R() < .5 ? 255 : 0},${R() < .5 ? 255 : 0},${R() < .5 ? 255 : 0},0.05)`; x.fillRect(R() * w, R() * h, 3, 3); }
      x.fillStyle = '#f2c230'; x.fillRect(w / 2 - 9, 0, 5, h); x.fillRect(w / 2 + 4, 0, 5, h); x.fillStyle = '#e8e8e8'; for (const px of [w * 0.22, w * 0.78]) for (let k = 0; k < 2; k++) x.fillRect(px - 3, k * h / 2 + 20, 6, h / 4); x.fillRect(4, 0, 4, h); x.fillRect(w - 8, 0, 4, h); });
    roadTex.wrapS = roadTex.wrapT = THREE.RepeatWrapping; roadTex.repeat.set(1, 60);
    const road = Pl(g, 18, 720, new THREE.MeshLambertMaterial({ map: roadTex }), 0, 0, -330, [-Math.PI / 2, 0, 0]);
    const swTex = cvs(128, 128, (x, w, h) => { x.fillStyle = '#d9d6cf'; x.fillRect(0, 0, w, h); x.strokeStyle = '#2a2a2a'; x.lineWidth = 6; for (let i = 0; i < 4; i++) { x.beginPath(); for (let k = 0; k <= 32; k++) { const xx = k * 4, yy = i * 32 + 16 + Math.sin(k * 0.8 + i) * 8; k ? x.lineTo(xx, yy) : x.moveTo(xx, yy); } x.stroke(); } });
    swTex.wrapS = swTex.wrapT = THREE.RepeatWrapping; swTex.repeat.set(3, 120);
    for (const sx of [-1, 1]) Pl(g, 6, 720, new THREE.MeshLambertMaterial({ map: swTex }), sx * 12, 0.12, -330, [-Math.PI / 2, 0, 0]);
    for (const sx of [-1, 1]) B(g, 0.4, 0.14, 720, 0xbbbbbb, sx * 9.2, 0.07, -330);
    // prédios
    const palettes = [0xd8cfc0, 0xb9c3cc, 0xc9a98b, 0xe9e4da, 0x9fb4c7, 0xcdd6dd, 0xd6b8a3, 0xa9b7a0];
    const bl = [];
    for (const sx of [-1, 1]) { let z = 60; while (z > -420) { const w = 16 + R() * 18, h = 20 + R() * 70, c = palettes[(R() * palettes.length) | 0]; const dp = 24;
        const tex = winTex(c, 0.0, (z * 7 + sx) | 0, Math.round(h / 3.4), 6, 0x7fa6c9); tex.wrapS = tex.wrapT = THREE.RepeatWrapping; tex.repeat.set(Math.max(1, Math.round(w / 8)), 1);
        const mats = [0, 1, 2, 3, 4, 5].map(i => (i === (sx > 0 ? 1 : 0)) ? new THREE.MeshLambertMaterial({ map: tex }) : lam(c));
        const m = new THREE.Mesh(new THREE.BoxGeometry(dp, h, w), mats); m.position.set(sx * (15 + dp / 2 + 0.5), h / 2, z - w / 2); m.userData = { h, sx, z, w }; g.add(m); bl.push(m); z -= w + 0.5 + R() * 3; } }
    g.userData.buildings = bl;
    // postes + semáforo
    const lamps = []; for (const sx of [-1, 1]) for (let z = 40; z > -400; z -= 28) { const gg = new THREE.Group(); gg.position.set(sx * 9.5, 0, z); Cy(gg, 0.07, 0.09, 8, 0x555a60, 0, 4, 0); B(gg, 0.1, 0.1, 2.6, 0x555a60, 0, 8, 0).position.x = -sx * 1.2; const head = B(gg, 0.5, 0.18, 0.9, 0xffe9a8, -sx * 2.4, 7.95, 0, { basic: true }); lamps.push(head); g.add(gg); }
    g.userData.lamps = lamps;
    // semáforo principal
    const tl = new THREE.Group(); tl.position.set(9.6, 0, -8); Cy(tl, 0.1, 0.12, 6, 0x303338, 0, 3, 0); B(tl, 9.6, 0.14, 0.14, 0x303338, -4.8, 5.8, 0); B(tl, 0.55, 1.5, 0.45, 0x222428, -8.6, 5.2, 0);
    const lights = [0xff2a2a, 0xffc82a, 0x2aff5a].map((c, i) => { const m = new THREE.Mesh(new THREE.CircleGeometry(0.17, 14), new THREE.MeshBasicMaterial({ color: c })); m.position.set(-8.6, 5.65 - i * 0.45, 0.24); m.userData.c = c; tl.add(m); return m; }); g.add(tl); g.userData.tl = lights;
    // faixa de pedestre
    for (let i = -7; i <= 7; i++) B(g, 0.8, 0.02, 3.2, 0xf4f4f4, i * 1.15, 0.02, -2.0);
    // árvores laterais
    const trees = []; const addTree = (x, z, s, tint) => { const t = new THREE.Group(); t.position.set(x, 0, z); Cy(t, 0.14, 0.2, 2.6 * s, 0x6b4a2f, 0, 1.3 * s, 0); const cc = new THREE.Mesh(new THREE.IcosahedronGeometry(1.6 * s, 1), lam(tint)); cc.position.y = 3.4 * s; cc.scale.set(1, 0.85, 1); t.add(cc); g.add(t); return t; };
    for (const sx of [-1, 1]) for (let z = 30; z > -400; z -= 16) addTree(sx * 14.3, z + R() * 3, 0.9 + R() * 0.3, [0x3f9d4a, 0x4aa655, 0x2f8a3e][(R() * 3) | 0]);
    // overgrowth
    const wild = []; for (let i = 0; i < 160; i++) { const sx = R() < 0.5 ? -1 : 1; const x = (R() - 0.5) * 30, z = 50 - R() * 380; const t = addTree(x, z, 1.0, [0x2f7d3a, 0x3d9a48, 0x5aa83a, 0x2c6e32][(R() * 4) | 0]); t.userData.base = 0.8 + R() * 2.2; t.userData.th = R(); wild.push(t); }
    const grass = []; for (let i = 0; i < 150; i++) { const m = new THREE.Mesh(new THREE.CircleGeometry(1, 8), lam([0x4f9a3d, 0x3f8a37, 0x6aae44][i % 3])); m.rotation.x = -Math.PI / 2; m.position.set((R() - 0.5) * 20, 0.05 + R() * 0.02, 40 - R() * 380); m.userData.base = 1.5 + R() * 4; m.userData.th = R(); grass.push(m); g.add(m); }
    g.userData.wild = wild; g.userData.grass = grass;
    // carros
    const cars = new THREE.Group(); g.add(cars); const carCols = [0xc0392b, 0x2980b9, 0xecf0f1, 0x2c3e50, 0xf39c12, 0x7f8c8d, 0x27ae60];
    const mkCar = (c) => { const k = new THREE.Group(); B(k, 1.9, 0.7, 4.4, c, 0, 0.65, 0); B(k, 1.7, 0.6, 2.3, c, 0, 1.25, -0.1); B(k, 1.72, 0.45, 2.0, 0x233446, 0, 1.28, -0.1); for (const [x, z] of [[-0.9, 1.4], [0.9, 1.4], [-0.9, -1.4], [0.9, -1.4]]) Cy(k, 0.36, 0.36, 0.25, 0x151515, x, 0.36, z, { r: [0, 0, Math.PI / 2] }); return k; };
    for (let i = 0; i < 46; i++) { const k = mkCar(carCols[(R() * carCols.length) | 0]); const lane = [-6, -2.4, 2.4, 6, 7.6][(R() * 5) | 0]; k.position.set(lane + (R() - 0.5) * 0.6, 0, 22 - i * 9 - R() * 6); if (Math.abs(k.position.x) < 4.5 && k.position.z < 4 && k.position.z > -16) k.position.z -= 20; k.rotation.y = (R() < 0.5 ? 0 : Math.PI) + (R() - 0.5) * 0.3; k.userData.ruin = R(); cars.add(k); }
    g.userData.cars = cars;
    // rachaduras e entulho
    const ruin = new THREE.Group(); g.add(ruin);
    for (let i = 0; i < 70; i++) { const cr = B(ruin, 0.14 + R() * 0.2, 0.03, 3 + R() * 9, 0x15171a, (R() - 0.5) * 16, 0.05, 30 - R() * 340, { r: [0, (R() - 0.5) * 1.6, 0] }); }
    for (let i = 0; i < 26; i++) { const sgn = i % 2 ? 1 : -1; const lg = Cy(ruin, 0.28, 0.34, 7 + R() * 5, 0x5d4129, sgn * (5.4 + R() * 3), 0.4, 10 - i * 12, { r: [Math.PI / 2, 0, 0] }); const lf = new THREE.Mesh(new THREE.IcosahedronGeometry(1.7, 1), lam(0x3b8c45)); lf.position.set(lg.position.x, 1.2, lg.position.z + 3); ruin.add(lf); }
    g.userData.ruin = ruin;
    return { bg: 0x9fb8cf, fog: [0xaec4d6, 60, 330], hemi: [0xdfeaff, 0x8a8f96, 1.05], sun: [0xfff2dd, 1.1, [30, 60, 20]],
      apply(p, t, ctx) { const tod = p.tod || 'day'; const T = { day: [0x4f8fd6, 0xcfe0f0, 0xaec4d6, 1.05, 0xfff2dd, 1.1], dawn: [0x6a88c9, 0xffc9a0, 0xe9c3ad, 0.9, 0xffd2a0, 0.9], dusk: [0x2e3a78, 0xff9a62, 0xd78d6e, 0.7, 0xffa070, 0.7], night: [0x070a1c, 0x1a2250, 0x131a3c, 0.35, 0x6f86d8, 0.3], gray: [0x7a8794, 0xb6bec6, 0x9aa5ae, 0.85, 0xdde3ea, 0.6] }[tod];
        skyM.userData.set(T[0], T[1]); this.fog = [T[2], p.fogN || 60, p.fogF || 330]; this.bg = T[2]; this.hemi = [0xdfeaff, 0x70757c, T[3]]; this.sun = [T[4], T[5], [30, 60, 20]];
        const gr = clamp(p.grow || 0); for (const t of g.userData.wild) { const s = gr > t.userData.th * 0.9 ? Math.max(0.01, (gr - t.userData.th * 0.9) / (1.1 - t.userData.th * 0.9)) * t.userData.base : 0.0001; t.scale.setScalar(Math.min(s, t.userData.base)); }
        for (const m of g.userData.grass) { const s = gr > m.userData.th * 0.8 ? clamp((gr - m.userData.th * 0.8) / 0.4) * m.userData.base : 0.0001; m.scale.setScalar(s); }
        g.userData.ruin.visible = !!p.ruin; g.userData.cars.visible = p.cars !== false;
        for (const c of g.userData.cars.children) { /* ruína dos carros fica estática */ }
        const L = p.light || 'red'; g.userData.tl.forEach((m, i) => { m.material.color.set(['red', 'yellow', 'green'][i] === L ? m.userData.c : 0x2a2a2a); });
        const fl = p.flick === undefined ? 1 : p.flick; const night = tod === 'night' || tod === 'dusk'; for (const h of g.userData.lamps) h.material.color.set(night ? mix(0x222222, 0xffe9a8, fl) : 0x777766);
        const kill = p.collapse || 0; for (const b of g.userData.buildings) { const k = (b.userData.z * 13.37 % 1 + 1) % 1; const f = clamp((kill - k * 0.6) / 0.4); b.scale.y = 1 - f * 0.65 * (k > 0.45 ? 1 : 0.5); b.position.y = b.userData.h * b.scale.y / 2; b.rotation.z = b.userData.sx * f * 0.08 * (k > 0.45 ? 1 : 0); }
        g.userData.cars.children.forEach(k => { k.userData.rr = k.userData.ruin; }); } };
  });

  // ================= LABORATÓRIO / CRIOBANCO =================
  mkEnv('lab', (g) => {
    const R = rng(11);
    const floorTex = cvs(256, 256, (x, w, h) => { x.fillStyle = '#d7dde2'; x.fillRect(0, 0, w, h); x.strokeStyle = '#aab3bb'; x.lineWidth = 3; for (let i = 0; i <= 4; i++) { x.beginPath(); x.moveTo(i * 64, 0); x.lineTo(i * 64, h); x.stroke(); x.beginPath(); x.moveTo(0, i * 64); x.lineTo(w, i * 64); x.stroke(); } });
    floorTex.wrapS = floorTex.wrapT = THREE.RepeatWrapping; floorTex.repeat.set(5, 4);
    Pl(g, 20, 16, new THREE.MeshLambertMaterial({ map: floorTex }), 0, 0, 0, [-Math.PI / 2, 0, 0]);
    const wallC = 0xe4ebf0; B(g, 20, 5, 0.3, wallC, 0, 2.5, -8); B(g, 0.3, 5, 16, wallC, -10, 2.5, 0); B(g, 0.3, 5, 16, wallC, 10, 2.5, 0); B(g, 20, 5, 0.3, wallC, 0, 2.5, 8); B(g, 20, 0.3, 16, 0xf2f5f7, 0, 5, 0);
    B(g, 20, 0.9, 0.35, 0x2e6fb5, 0, 0.45, -7.85); B(g, 0.35, 0.9, 16, 0x2e6fb5, -9.85, 0.45, 0); B(g, 0.35, 0.9, 16, 0x2e6fb5, 9.85, 0.45, 0);
    const lights = []; for (let i = -2; i <= 2; i++) for (let j = -1; j <= 1; j++) { lights.push(B(g, 2.8, 0.06, 0.6, 0xffffff, i * 3.6, 4.93, j * 4.5, { basic: true })); }
    g.userData.lights = lights;
    // tanques
    const tanks = new THREE.Group(); g.add(tanks);
    const lab = cvs(128, 64, (x, w, h) => { x.fillStyle = '#c8ced4'; x.fillRect(0, 0, w, h); x.fillStyle = '#d62828'; x.fillRect(8, 8, 112, 20); x.fillStyle = '#fff'; x.font = '800 16px Inter'; x.fillText('-196 °C  LN2', 14, 24); });
    for (let r = 0; r < 2; r++) for (let c = 0; c < 4; c++) { const tg = new THREE.Group(); tg.position.set(-4.5 + c * 3, 0, -4.2 + r * 3.4); Cy(tg, 0.85, 0.85, 1.7, 0xb9c2ca, 0, 0.95, 0); Cy(tg, 0.88, 0.88, 0.14, 0x4a5a6a, 0, 1.85, 0); Cy(tg, 0.6, 0.6, 0.1, 0x222a33, 0, 1.97, 0); Cy(tg, 0.9, 0.9, 0.25, 0x2e6fb5, 0, 0.9, 0); Cy(tg, 0.92, 0.92, 0.1, 0xeaf6ff, 0, 1.78, 0);
      Pl(tg, 0.9, 0.45, new THREE.MeshLambertMaterial({ map: lab }), 0, 1.3, 0.87); const mist = new THREE.Group(); for (let k = 0; k < 5; k++) { const s = new THREE.Mesh(new THREE.SphereGeometry(0.28, 8, 6), new THREE.MeshBasicMaterial({ color: 0xf4fbff, transparent: true, opacity: 0.35, depthWrite: false })); s.userData.k = k; mist.add(s); } mist.position.y = 2.1; tg.add(mist); tg.userData.mist = mist; tanks.add(tg); }
    g.userData.tanks = tanks;
    // display
    const dc = document.createElement('canvas'); dc.width = 1024; dc.height = 512; const dx = dc.getContext('2d'); const dt = new THREE.CanvasTexture(dc); dt.colorSpace = THREE.SRGBColorSpace;
    B(g, 6.4, 3.4, 0.3, 0x15181c, 0, 3.0, -7.7); const scr = Pl(g, 6.0, 3.0, new THREE.MeshBasicMaterial({ map: dt }), 0, 3.0, -7.53); g.userData.disp = { dc, dx, dt };
    // porta do gerador (esquerda) e entrada (direita)
    const gd = new THREE.Group(); gd.position.set(-9.8, 0, 3.5); B(gd, 0.3, 3.6, 3.2, 0x3a4048, 0, 1.8, 0); B(gd, 0.34, 0.5, 2.2, 0xf6c90e, 0, 3.0, 0); B(gd, 0.4, 0.5, 0.5, 0xd62828, 0, 1.6, 1.0); g.add(gd); g.userData.gd = gd;
    const sg = cvs(256, 64, (x, w, h) => { x.fillStyle = '#f6c90e'; x.fillRect(0, 0, w, h); x.fillStyle = '#111'; x.font = '900 40px Inter'; x.textAlign = 'center'; x.fillText('GERADOR', 128, 46); }); Pl(g, 2.2, 0.55, new THREE.MeshBasicMaterial({ map: sg }), -9.62, 3.0, 3.5, [0, Math.PI / 2, 0]);
    B(g, 0.3, 3.6, 3.4, 0x2a3a4a, 9.8, 1.8, 3.5);
    // mesas
    B(g, 4, 0.12, 1.4, 0x8a929a, 4.5, 1.0, 2.5); B(g, 0.15, 1.0, 1.2, 0x666d75, 2.7, 0.5, 2.5); B(g, 0.15, 1.0, 1.2, 0x666d75, 6.3, 0.5, 2.5);
    // alarme
    const beacon = new THREE.Mesh(new THREE.ConeGeometry(0.35, 0.4, 12), new THREE.MeshBasicMaterial({ color: 0xff2020 })); beacon.position.set(0, 4.6, 0); g.add(beacon); const rl = new THREE.PointLight(0xff2020, 0, 22); rl.position.set(0, 4.3, 0); g.add(rl); g.userData.rl = rl; g.userData.beacon = beacon;
    return { bg: 0x1c2026, fog: null, hemi: [0xffffff, 0x9aa3ad, 1.0], sun: [0xffffff, 0.5, [0, 20, 10]],
      apply(p, t, ctx) { const pw = p.power === undefined ? 1 : p.power; this.hemi = [0xffffff, 0x9aa3ad, 0.25 + 0.8 * pw]; this.sun = [0xffffff, 0.15 + 0.4 * pw, [0, 20, 10]];
        g.userData.lights.forEach((l, i) => l.material.color.set(pw > 0.5 ? 0xffffff : (pw > 0.05 ? (Math.sin(t * 40 + i) > 0 ? 0xffffff : 0x333333) : 0x1a1a1a)));
        const al = p.alarm || 0; const ph = (Math.sin(t * 9) * 0.5 + 0.5) * al; g.userData.rl.intensity = ph * 30; g.userData.beacon.material.color.set(mix(0x400000, 0xff3030, ph)); g.userData.beacon.rotation.y = t * 6;
        if (al) this.hemi = [mix(0xffffff, 0xff6a6a, ph * 0.5), 0x9a8a8a, this.hemi[2]];
        g.userData.tanks.children.forEach((tg, i) => tg.userData.mist.children.forEach(s => { const k = s.userData.k; const ph2 = (t * 0.5 + k * 0.2 + i * 0.13) % 1; s.position.set(Math.sin(k * 2 + i) * 0.5, ph2 * 0.9, Math.cos(k * 3) * 0.5); s.scale.setScalar(0.5 + ph2 * 1.3); s.material.opacity = (1 - ph2) * 0.35 * (p.mist === undefined ? 1 : p.mist); }));
        // display
        const D = g.userData.disp, x = D.dx; x.fillStyle = '#05121c'; x.fillRect(0, 0, 1024, 512); x.fillStyle = '#0a2a3d'; x.fillRect(0, 0, 1024, 70); x.fillStyle = '#7fd8ff'; x.font = '800 38px Inter'; x.fillText('CRIOBANCO · TANQUE 07', 30, 50);
        const ok = p.dispOk; x.fillStyle = ok ? '#3ddc6a' : '#ff4b3e'; x.font = '900 40px Inter'; x.textAlign = 'right'; x.fillText(ok ? 'ENERGIA OK' : 'BATERIA', 994, 50); x.textAlign = 'left';
        x.fillStyle = ok ? '#3ddc6a' : '#ff4b3e'; x.font = '900 230px Inter'; x.textAlign = 'center'; x.fillText(p.timer || '00:11:00', 512, 330); x.textAlign = 'left';
        const lvl = p.level === undefined ? 0.1 : p.level; x.strokeStyle = '#7fd8ff'; x.lineWidth = 6; x.strokeRect(60, 400, 904, 56); x.fillStyle = ok ? '#3ddc6a' : '#ff4b3e'; x.fillRect(66, 406, 892 * lvl, 44);
        D.dt.needsUpdate = true;
        g.userData.gd.visible = true; g.userData.gd.rotation.y = (p.doorOpen || 0); g.userData.gd.position.z = 3.5; } };
  });

  // marcador p/ outros módulos
  extraEnvs({ THREE, B, Cy, Sp, Pl, cvs, mkEnv, rng, sky, winTex, mix, clamp, lerp, col, lam, hex });
  moreEnvs({ THREE, B, Cy, Sp, Pl, cvs, mkEnv, rng, sky, winTex, mix, clamp, lerp, col, lam, hex });
  caveEnvs({ THREE, B, Cy, Sp, Pl, cvs, mkEnv, rng, sky, winTex, mix, clamp, lerp, col, lam, hex });
  islandEnvs({ THREE, B, Cy, Sp, Pl, cvs, mkEnv, rng, sky, winTex, mix, clamp, lerp, col, lam, hex });
  return envs;
}
