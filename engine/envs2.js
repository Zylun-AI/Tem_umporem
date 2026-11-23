export function extraEnvs(U) {
  const { THREE, B, Cy, Sp, Pl, cvs, mkEnv, rng, sky, winTex, mix, clamp, lerp, col, lam, hex } = U;

  // ================= VAZIO (gancho) =================
  mkEnv('void', (g) => {
    const skyM = sky(g); skyM.userData.set(0x120a24, 0x05050c);
    const fl = new THREE.Mesh(new THREE.CircleGeometry(60, 48), new THREE.MeshLambertMaterial({ color: 0x0d0d1c })); fl.rotation.x = -Math.PI / 2; g.add(fl);
    for (let i = 1; i < 8; i++) { const r = new THREE.Mesh(new THREE.RingGeometry(i * 4 - 0.03, i * 4 + 0.03, 64), new THREE.MeshBasicMaterial({ color: 0x3b2a7a, transparent: true, opacity: 0.5 })); r.rotation.x = -Math.PI / 2; r.position.y = 0.01; g.add(r); }
    const cone = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 4.2, 14, 32, 1, true), new THREE.MeshBasicMaterial({ color: 0x9a8cff, transparent: true, opacity: 0.12, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide })); cone.position.y = 7; g.add(cone); g.userData.cone = cone;
    const R = rng(3); const pts = new Float32Array(600 * 3); for (let i = 0; i < 600; i++) { pts[i * 3] = (R() - 0.5) * 50; pts[i * 3 + 1] = R() * 14; pts[i * 3 + 2] = (R() - 0.5) * 50 - 6; }
    const pg = new THREE.BufferGeometry(); pg.setAttribute('position', new THREE.BufferAttribute(pts, 3)); g.add(new THREE.Points(pg, new THREE.PointsMaterial({ color: 0xb9a8ff, size: 0.08, transparent: true, opacity: 0.7 })));
    return { bg: 0x05050c, fog: [0x05050c, 20, 70], hemi: [0x6a5acd, 0x14142a, 0.55], sun: [0xb9a8ff, 0.9, [0, 14, 6]], apply(p) { cone.visible = p.cone !== false; } };
  });

  const T = THREE;
  const flat = (c, o = {}) => new T.MeshBasicMaterial({ color: c, ...o });
  const tile = (a, b, n = 8, px = 256) => cvs(px, px, (x, w, h) => { for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) { x.fillStyle = (i + j) % 2 ? hex(a) : hex(b); x.fillRect(i * w / n, j * h / n, w / n + 1, h / n + 1); } });
  const rep = (t, a, b) => { t.wrapS = t.wrapT = T.RepeatWrapping; t.repeat.set(a, b); return t; };
  const shelfTex = (seed) => cvs(256, 128, (x, w, h) => { const R = rng(seed); x.fillStyle = '#e8e8ea'; x.fillRect(0, 0, w, h); const cols = ['#e63946', '#f1c40f', '#2a9d8f', '#3a86ff', '#ff7f11', '#8338ec', '#ffffff', '#06d6a0', '#ef476f'];
    for (let r = 0; r < 4; r++) { let xx = 2; while (xx < w - 10) { const bw = 14 + R() * 20; x.fillStyle = cols[(R() * cols.length) | 0]; x.fillRect(xx, r * 32 + 4, bw, 26); x.fillStyle = 'rgba(255,255,255,.7)'; x.fillRect(xx + 3, r * 32 + 12, bw - 6, 6); xx += bw + 2; } x.fillStyle = '#9aa0a8'; x.fillRect(0, r * 32 + 30, w, 3); } });

  // ================= PADARIA =================
  mkEnv('bakery', (g) => {
    const R = rng(21);
    Pl(g, 12, 10, new T.MeshLambertMaterial({ map: rep(tile(0xb3322a, 0xf2e6cf, 8), 6, 5) }), 0, 0, 0, [-Math.PI / 2, 0, 0]);
    B(g, 12, 3.4, 0.2, 0xf6e3b4, 0, 1.7, -5); B(g, 0.2, 3.4, 10, 0xf6e3b4, -6, 1.7, 0); B(g, 0.2, 3.4, 10, 0xf6e3b4, 6, 1.7, 0); B(g, 12, 0.2, 10, 0xfff7e6, 0, 3.4, 0);
    B(g, 12, 3.4, 0.2, 0xf6e3b4, -4.5, 1.7, 5).scale.x = 0.4; B(g, 12, 3.4, 0.2, 0xf6e3b4, 4.5, 1.7, 5).scale.x = 0.4; B(g, 3.2, 1.0, 0.2, 0xf6e3b4, 0, 2.9, 5);
    B(g, 3.1, 2.4, 0.06, 0xaee0ff, 0, 1.2, 5, { m: { transparent: true, opacity: 0.4 } });
    B(g, 12, 1.1, 0.25, 0x2a8f5a, 0, 0.55, -4.85);
    // balcão
    B(g, 8, 1.05, 0.9, 0x7a4a2b, -1.5, 0.52, -1.4); B(g, 8.2, 0.1, 1.1, 0xe8e0d0, -1.5, 1.08, -1.4); const glass = B(g, 4, 0.8, 0.8, 0xbfe6ff, -3.0, 1.55, -1.4, { m: { transparent: true, opacity: 0.3 } });
    for (let i = 0; i < 9; i++) { const br = Sp(g, 0.2, [0xd9a441, 0xc98a2b, 0xe6b55a][i % 3], -4.5 + i * 0.45, 1.3, -1.4, { s: [1.4, 0.7, 1] }); }
    // prateleiras
    for (let r = 0; r < 3; r++) { B(g, 10, 0.08, 0.6, 0x7a4a2b, 0, 1.0 + r * 0.7, -4.6); for (let i = 0; i < 14; i++) Cy(g, 0.09, 0.09, 0.9, [0xd9a441, 0xc98a2b][i % 2], -4.7 + i * 0.72, 1.4 + r * 0.7, -4.6, { r: [0, 0, 1.4 + (i % 3) * 0.1] }); }
    // rádio
    const radio = new T.Group(); radio.position.set(-3.6, 1.2, -1.4); B(radio, 0.6, 0.35, 0.25, 0x222222, 0, 0.17, 0); Cy(radio, 0.1, 0.1, 0.02, 0x555555, -0.17, 0.17, 0.13, { r: [Math.PI / 2, 0, 0] }); Cy(radio, 0.01, 0.01, 0.6, 0xcccccc, 0.25, 0.6, 0, { r: [0, 0, -0.3] }); const led = B(radio, 0.12, 0.05, 0.02, 0x3dff6a, 0.17, 0.2, 0.13, { basic: true }); g.add(radio); g.userData.led = led;
    // mesinhas
    for (const x of [3.2, 4.6]) { Cy(g, 0.5, 0.5, 0.06, 0xf4f0e6, x, 0.8, 2.2); Cy(g, 0.05, 0.05, 0.8, 0x333333, x, 0.4, 2.2); }
    // placa
    const sg = cvs(512, 128, (x, w, h) => { x.fillStyle = '#2a8f5a'; x.fillRect(0, 0, w, h); x.fillStyle = '#ffe9a8'; x.font = '900 80px Inter'; x.textAlign = 'center'; x.fillText('PADARIA', 256, 92); }); Pl(g, 3.2, 0.8, new T.MeshBasicMaterial({ map: sg }), 0, 2.9, 4.88, [0, Math.PI, 0]);
    // rua lá fora
    B(g, 40, 0.1, 30, 0x44474c, 0, -0.05, 22);
    return { bg: 0xcfe0f0, fog: null, hemi: [0xfff3dd, 0xa08a70, 1.0], sun: [0xfff0d0, 0.8, [3, 10, 8]], apply(p, t) { g.userData.led.material.color.set(Math.sin(t * 6) > -0.3 ? 0x3dff6a : 0x0a4a1a); } };
  });

  // ================= SUPERMERCADO =================
  mkEnv('market', (g) => {
    const R = rng(31);
    Pl(g, 44, 80, new T.MeshLambertMaterial({ map: rep(tile(0xeeeae0, 0xd4cfc2, 8), 22, 40) }), 0, 0, -20, [-Math.PI / 2, 0, 0]);
    B(g, 44, 5, 0.3, 0xf1ece0, 0, 2.5, -60); B(g, 0.3, 5, 80, 0xf1ece0, -22, 2.5, -20); B(g, 0.3, 5, 80, 0xf1ece0, 22, 2.5, -20); B(g, 44, 0.3, 80, 0xfbf8f0, 0, 5, -20); B(g, 44, 5, 0.3, 0xf1ece0, 0, 2.5, 20);
    const lights = []; for (let j = 0; j < 14; j++) for (const x of [-18, -9, 0, 9, 18]) { lights.push(B(g, 0.5, 0.05, 3.2, 0xffffff, x, 4.93, 8 - j * 5, { basic: true })); } g.userData.lights = lights;
    const tx = [shelfTex(1), shelfTex(2), shelfTex(3)]; tx.forEach(t => rep(t, 5, 1));
    for (const x of [-15, -9, -3, 3, 9, 15]) { const sh = new T.Group(); sh.position.set(x, 0, -20);
      const mats = [0, 1, 2, 3, 4, 5].map(i => (i === 0 || i === 1) ? new T.MeshLambertMaterial({ map: tx[(Math.abs(x) / 3 | 0) % 3] }) : lam(0xcfd3d8)); const m = new T.Mesh(new T.BoxGeometry(0.8, 2.3, 50), mats); m.position.y = 1.15; sh.add(m); g.add(sh);
      const lab = ['BOLACHAS', 'ARROZ', 'LATICÍNIOS', 'BEBIDAS', 'LIMPEZA', 'PADARIA'][((Math.abs(x) / 3 + (x < 0 ? 3 : 0)) | 0) % 6]; const sc = cvs(256, 64, (c, w, h) => { c.fillStyle = '#d62828'; c.fillRect(0, 0, w, h); c.fillStyle = '#fff'; c.font = '900 40px Inter'; c.textAlign = 'center'; c.fillText(lab, 128, 46); }); Pl(g, 2.4, 0.6, new T.MeshBasicMaterial({ map: sc }), x, 3.8, 3); Pl(g, 2.4, 0.6, new T.MeshBasicMaterial({ map: sc }), x, 3.8, 2.99, [0, Math.PI, 0]); }
    // geladeiras fundo
    for (let i = 0; i < 9; i++) { B(g, 2.2, 2.3, 0.9, 0xdfe6ec, -17.6 + i * 4.4, 1.15, -59); B(g, 2.0, 2.0, 0.05, 0x9fd4ff, -17.6 + i * 4.4, 1.2, -58.5, { m: { transparent: true, opacity: 0.5 } }); }
    // caixas
    for (let i = 0; i < 5; i++) { B(g, 0.9, 1.0, 2.2, 0x555a60, -18 + i * 2.5, 0.5, 14); B(g, 0.7, 0.05, 1.8, 0x111111, -18 + i * 2.5, 1.02, 14); }
    return { bg: 0xe8e4da, fog: [0xe8e4da, 30, 90], hemi: [0xffffff, 0xaaa89c, 1.0], sun: [0xffffff, 0.35, [0, 20, 10]], apply(p, t) { const pw = p.power === undefined ? 1 : p.power; this.hemi = [0xffffff, 0x9a9a92, 0.12 + 0.9 * pw]; this.sun = [0xffffff, 0.35 * pw, [0, 20, 10]]; this.fog = [pw > 0.5 ? 0xe8e4da : 0x0a0b0e, 20, 80]; this.bg = pw > 0.5 ? 0xe8e4da : 0x0a0b0e; g.userData.lights.forEach(l => l.material.color.set(pw > 0.5 ? 0xffffff : 0x1a1a1a)); } };
  });

  // ================= ESTÁDIO =================
  mkEnv('stadium', (g) => {
    const R = rng(41); const skyM = sky(g);
    const pitch = cvs(512, 768, (x, w, h) => { for (let i = 0; i < 14; i++) { x.fillStyle = i % 2 ? '#2f9a49' : '#38a852'; x.fillRect(0, i * h / 14, w, h / 14 + 1); } x.strokeStyle = '#fff'; x.lineWidth = 5; x.strokeRect(20, 20, w - 40, h - 40); x.beginPath(); x.moveTo(20, h / 2); x.lineTo(w - 20, h / 2); x.stroke(); x.beginPath(); x.arc(w / 2, h / 2, 70, 0, 7); x.stroke(); x.strokeRect(w / 2 - 110, 20, 220, 90); x.strokeRect(w / 2 - 110, h - 110, 220, 90); });
    Pl(g, 70, 108, new T.MeshLambertMaterial({ map: pitch }), 0, 0.02, 0, [-Math.PI / 2, 0, 0]);
    B(g, 90, 0.1, 130, 0x4a4f55, 0, -0.04, 0);
    const seatT = (c1) => { const t = cvs(128, 128, (x, w, h) => { const Rr = rng(5); x.fillStyle = '#22252a'; x.fillRect(0, 0, w, h); for (let i = 0; i < 16; i++) for (let j = 0; j < 8; j++) { x.fillStyle = [c1, '#ffffff', '#222'][((i * 7 + j * 3 + (Rr() * 3 | 0)) % 5) % 3]; x.fillRect(i * 8 + 1, j * 16 + 2, 6, 11); } }); return t; };
    const mkStand = (len, rot, x, z, c1) => { const st = new T.Group(); st.position.set(x, 0, z); st.rotation.y = rot; for (let k = 0; k < 16; k++) { const t = seatT(c1); rep(t, len / 8, 1); const m = new T.Mesh(new T.BoxGeometry(len, 0.9, 2.0), [lam(0x777), lam(0x777), new T.MeshLambertMaterial({ map: t }), lam(0x777), lam(0x777), new T.MeshLambertMaterial({ map: t })]); m.position.set(0, 0.45 + k * 0.9, k * 1.8); st.add(m); } B(st, len, 17, 0.5, 0x8a8f95, 0, 8.5, 30.5); g.add(st); };
    mkStand(110, 0, 0, 56, '#d62828'); mkStand(110, Math.PI, 0, -56, '#d62828'); mkStand(76, Math.PI / 2, 38, 0, '#222'); mkStand(76, -Math.PI / 2, -38, 0, '#222');
    for (const z of [-54, 54]) { const gl = new T.Group(); gl.position.set(0, 0, z); B(gl, 0.12, 2.44, 0.12, 0xffffff, -3.66, 1.22, 0); B(gl, 0.12, 2.44, 0.12, 0xffffff, 3.66, 1.22, 0); B(gl, 7.32, 0.12, 0.12, 0xffffff, 0, 2.44, 0); g.add(gl); }
    for (const [x, z] of [[-48, -66], [48, -66], [-48, 66], [48, 66]]) { Cy(g, 0.5, 0.7, 34, 0x9aa0a6, x, 17, z); B(g, 7, 3, 0.6, 0xfff8d0, x, 34, z, { basic: true }); }
    return { bg: 0x9fc4ea, fog: [0xbcd6ee, 120, 420], hemi: [0xdfeaff, 0x7a8a6a, 1.0], sun: [0xfff2dd, 1.0, [30, 70, 20]], apply(p) { skyM.userData.set(0x4f8fd6, 0xdbe9f6); } };
  });

  // ================= SKYLINE NOITE =================
  mkEnv('citynight', (g) => {
    const R = rng(51); const skyM = sky(g); skyM.userData.set(0x070a1c, 0x1d2552);
    B(g, 800, 0.2, 800, 0x0c0e18, 0, -0.1, 0);
    const bs = []; const litT = [0, 1, 2, 3].map(i => winTex(0x1a2036, 0.55, 90 + i, 24, 6)), darkT = [0, 1, 2, 3].map(i => winTex(0x1a2036, 0.0001, 90 + i, 24, 6, 0x0d1220));
    for (let i = 0; i < 110; i++) { const x = -260 + R() * 520, z = -60 - R() * 300; const w = 14 + R() * 20, h = 30 + R() * 130; const k = (i % 4);
      const l = litT[k].clone(); l.needsUpdate = true; l.wrapS = l.wrapT = T.RepeatWrapping; l.repeat.set(Math.max(1, Math.round(w / 9)), Math.max(1, Math.round(h / 40)));
      const d = darkT[k].clone(); d.needsUpdate = true; d.wrapS = d.wrapT = T.RepeatWrapping; d.repeat.copy(l.repeat);
      const mL = new T.MeshBasicMaterial({ map: l }), mD = new T.MeshLambertMaterial({ map: d }); const m = new T.Mesh(new T.BoxGeometry(w, h, w), mL); m.position.set(x, h / 2, z); m.userData = { mL, mD, rank: (x + 260) / 520 + R() * 0.12 }; g.add(m); bs.push(m); if (h > 100) { const b = B(g, 1.2, 1.2, 1.2, 0xff2020, x, h + 1, z, { basic: true }); b.userData.beacon = 1; bs.push(b); } }
    g.userData.bs = bs;
    return { bg: 0x131a3c, fog: [0x131a3c, 120, 520], hemi: [0x6f86d8, 0x10131f, 0.5], sun: [0x8fa6ff, 0.35, [-30, 60, 20]], apply(p, t) { const k = p.black || 0; for (const m of g.userData.bs) { if (m.userData.beacon) { m.visible = Math.sin(t * 3 + m.position.x) > 0; continue; } const dark = k * 1.15 > m.userData.rank; m.material = dark ? m.userData.mD : m.userData.mL; } } };
  });

  // ================= METRÔ =================
  mkEnv('metro', (g) => {
    const R = rng(61);
    const wall = cvs(256, 256, (x, w, h) => { x.fillStyle = '#e9e6dc'; x.fillRect(0, 0, w, h); x.strokeStyle = '#c9c4b4'; x.lineWidth = 3; for (let i = 0; i <= 8; i++) { x.beginPath(); x.moveTo(i * 32, 0); x.lineTo(i * 32, h); x.stroke(); x.beginPath(); x.moveTo(0, i * 32); x.lineTo(w, i * 32); x.stroke(); } });
    rep(wall, 30, 2);
    B(g, 40, 0.5, 80, 0x8b8f94, 0, -1.8, -20); // fundo dos trilhos
    B(g, 40, 1.8, 1, 0x6e7378, 0, -0.9, 8.6).scale.z = 1; // borda plataforma
    B(g, 40, 0.4, 6, 0xb9b8b0, 0, 0.2, 12); B(g, 40, 0.06, 0.4, 0xf4c20d, 0, 0.42, 9.3);
    for (const z of [0.2, -1.0]) B(g, 40, 0.12, 0.12, 0x555555, 0, -1.5, z);
    for (let i = 0; i < 40; i++) B(g, 0.3, 0.1, 3, 0x4a3b2a, -20 + i, -1.6, -0.4);
    // túnel (arco simples)
    const tun = new T.Mesh(new T.CylinderGeometry(7, 7, 80, 24, 1, true, Math.PI, Math.PI), new T.MeshLambertMaterial({ map: wall, side: T.BackSide })); tun.rotation.z = Math.PI / 2; tun.position.set(0, -0.2, -1); g.add(tun);
    Pl(g, 40, 6, new T.MeshLambertMaterial({ map: wall }), 0, 2.5, 15, [0, Math.PI, 0]); B(g, 40, 0.4, 14, 0xdcd8cc, 0, 5.4, 9);
    for (let i = -3; i <= 3; i++) { Cy(g, 0.35, 0.35, 5.4, 0xd9d6cc, i * 6, 2.7, 10.5); const lt = B(g, 2.6, 0.08, 0.5, 0xffffff, i * 6, 5.15, 8.5, { basic: true }); lt.userData.l = 1; g.userData['l' + i] = lt; }
    const sc = cvs(512, 128, (x, w, h) => { x.fillStyle = '#f4c20d'; x.fillRect(0, 0, w, h); x.fillStyle = '#111'; x.font = '900 70px Inter'; x.textAlign = 'center'; x.fillText('ESTAÇÃO', 256, 90); }); for (const x of [-9, 9]) Pl(g, 4, 1, new T.MeshBasicMaterial({ map: sc }), x, 4.4, 14.6, [0, Math.PI, 0]);
    // bancos
    for (const x of [-12, -2, 8]) { B(g, 2.4, 0.1, 0.6, 0x555d66, x, 0.8, 13.5); B(g, 0.1, 0.5, 0.5, 0x333, x - 1, 0.55, 13.5); B(g, 0.1, 0.5, 0.5, 0x333, x + 1, 0.55, 13.5); }
    const water = new T.Mesh(new T.PlaneGeometry(40, 16), new T.MeshLambertMaterial({ color: 0x2f7fb0, transparent: true, opacity: 0.72 })); water.rotation.x = -Math.PI / 2; water.position.set(0, -1.4, 0); g.add(water); g.userData.water = water;
    const deb = []; for (let i = 0; i < 24; i++) { const d = B(g, 0.3 + R() * 0.3, 0.12, 0.3 + R() * 0.3, [0xffffff, 0xd62828, 0xf1c40f, 0x333][i % 4], (R() - 0.5) * 30, 0, (R() - 0.5) * 6); deb.push(d); } g.userData.deb = deb;
    return { bg: 0x1a1d22, fog: [0x1a1d22, 20, 70], hemi: [0xfff6e0, 0x6a6f75, 0.9], sun: [0xffffff, 0.2, [0, 10, 5]], apply(p, t) { const w = p.water === undefined ? 0 : p.water; g.userData.water.position.y = -1.4 + w * 1.7; g.userData.water.visible = w > 0.001; for (const d of g.userData.deb) { d.position.y = g.userData.water.position.y + 0.04 + Math.sin(t * 2 + d.position.x) * 0.02; d.visible = w > 0.001; }
        const pw = p.power === undefined ? 1 : p.power; this.hemi = [0xfff6e0, 0x6a6f75, 0.2 + 0.8 * pw]; for (let i = -3; i <= 3; i++) g.userData['l' + i].material.color.set(pw > 0.4 ? 0xffffff : (Math.sin(t * 25 + i * 3) > 0.2 ? 0xdddddd : 0x222222)); } };
  });

  // ================= TERRAÇO / ESTRELAS =================
  mkEnv('roof', (g) => {
    const R = rng(71); const skyM = sky(g, 700); skyM.userData.set(0x02030c, 0x0b1230);
    B(g, 22, 0.6, 16, 0x4a4e55, 0, -0.3, 0); for (const [w, d, x, z] of [[22, 0.4, 0, -8], [22, 0.4, 0, 8], [0.4, 16, -11, 0], [0.4, 16, 11, 0]]) B(g, w, 1.0, d, 0x5a5f66, x, 0.5, z);
    B(g, 0.9, 0.5, 0.9, 0x8a6a4a, -1.1, 0.25, 3.2); B(g, 0.9, 0.5, 0.9, 0x8a6a4a, 1.1, 0.25, 3.2);
    Cy(g, 1.4, 1.4, 2.6, 0x7a5a3a, -7, 1.3, -4.5); Cy(g, 1.5, 1.5, 0.3, 0x333, -7, 2.7, -4.5); Cy(g, 0.04, 0.04, 6, 0x888, 8, 3, -5.5); B(g, 0.8, 1, 0.8, 0x6d727a, 6, 0.5, -5);
    // cidade apagada
    for (let i = 0; i < 70; i++) { const a = R() * Math.PI * 2, r = 30 + R() * 160; const w = 8 + R() * 16, h = 5 + R() * 40; B(g, w, h, w, 0x0b0e18, Math.cos(a) * r, h / 2 - 12, Math.sin(a) * r); }
    // estrelas
    const N = 4200; const pos = new Float32Array(N * 3), colr = new Float32Array(N * 3); const R2 = 600;
    const nrm = new T.Vector3(0.35, 0.8, -0.5).normalize(); const u1 = new T.Vector3(1, 0, 0).cross(nrm).normalize(), u2 = nrm.clone().cross(u1).normalize();
    for (let i = 0; i < N; i++) { let v; const band = i > 1800; if (band) { const a = R() * Math.PI * 2, off = (R() + R() + R() - 1.5) * 0.22; v = u1.clone().multiplyScalar(Math.cos(a)).addScaledVector(u2, Math.sin(a)).addScaledVector(nrm, off).normalize(); } else { v = new T.Vector3(R() * 2 - 1, R() * 2 - 1, R() * 2 - 1).normalize(); } if (v.y < 0.02) v.y = Math.abs(v.y) + 0.02; v.multiplyScalar(R2);
      pos.set([v.x, v.y, v.z], i * 3); const b = band ? 0.35 + R() * 0.5 : 0.4 + R() * 0.6; colr.set(band ? [0.7 * b, 0.8 * b, b] : [b, b, b * (0.8 + R() * 0.2)], i * 3); }
    const sg = new T.BufferGeometry(); sg.setAttribute('position', new T.BufferAttribute(pos, 3)); sg.setAttribute('color', new T.BufferAttribute(colr, 3)); const stars = new T.Points(sg, new T.PointsMaterial({ size: 2.2, sizeAttenuation: false, vertexColors: true, fog: false })); stars.frustumCulled = false; g.add(stars);
    const sp = (u, v, az = 0, alt = 0.0) => new T.Vector3(Math.sin(az) * 560 + u * 40, 280 + alt * 100 + v * 40, -Math.cos(az) * 560);
    const bright = (v) => { const m = new T.Mesh(new T.CircleGeometry(4.5, 16), new T.MeshBasicMaterial({ color: 0xffffff, fog: false })); m.position.copy(v); m.lookAt(0, 0, 0); const h = new T.Mesh(new T.CircleGeometry(14, 20), new T.MeshBasicMaterial({ color: 0x9fc4ff, transparent: true, opacity: 0.25, fog: false, depthWrite: false, blending: T.AdditiveBlending })); h.position.copy(v); h.lookAt(0, 0, 0); g.add(m, h); };
    const cru = [sp(0.02, 0.9, 0.5), sp(0, -0.9, 0.5), sp(0.6, -0.1, 0.5), sp(-0.6, 0.2, 0.5), sp(-0.15, -0.35, 0.5)]; cru.forEach(bright); g.userData.crux = cru[0];
    const tres = [sp(-0.7, 0.2, -0.7, 0.3), sp(0, 0.1, -0.7, 0.3), sp(0.7, 0, -0.7, 0.3)]; tres.forEach(bright); g.userData.tres = tres[1];
    const sh = new T.Mesh(new T.PlaneGeometry(90, 1.4), new T.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0, fog: false, blending: T.AdditiveBlending, depthWrite: false })); g.add(sh); g.userData.sh = sh;
    return { bg: 0x02030c, fog: null, hemi: [0x5a6fb5, 0x14161f, 0.55], sun: [0x8fa6ff, 0.35, [-20, 40, 10]], apply(p, t) { const k = p.shoot || 0; sh.material.opacity = k > 0 && k < 1 ? Math.sin(k * Math.PI) : 0; sh.position.set(-200 + k * 300, 330 - k * 90, -520); sh.lookAt(0, 0, 0); sh.rotation.z = -0.5; } };
  });

  // ================= HOSPITAL =================
  mkEnv('hospital', (g) => {
    const R = rng(81);
    const floor = rep(tile(0x9bb0a6, 0x8aa196, 4), 2, 20);
    Pl(g, 4, 60, new T.MeshLambertMaterial({ map: floor }), 0, 0, -16, [-Math.PI / 2, 0, 0]); B(g, 4, 0.2, 60, 0xe9efec, 0, 3.0, -16);
    for (const sx of [-1, 1]) { B(g, 0.2, 3, 60, 0xe9efec, sx * 2, 1.5, -16); B(g, 0.22, 0.12, 60, 0x2aa198, sx * 2, 1.9, -16); for (let i = 0; i < 9; i++) { B(g, 0.1, 2.2, 1.2, 0x7aa6c2, sx * 1.93, 1.1, 2 - i * 6); B(g, 0.12, 0.6, 0.5, 0xbfe3ff, sx * 1.9, 1.5, 2 - i * 6); } }
    const lights = []; for (let i = 0; i < 12; i++) lights.push(B(g, 1.2, 0.05, 0.6, 0xffffff, 0, 2.93, 2 - i * 4.8, { basic: true })); g.userData.lights = lights;
    const sg = cvs(512, 128, (x, w, h) => { x.fillStyle = '#e8f6f1'; x.fillRect(0, 0, w, h); x.fillStyle = '#d62828'; x.fillRect(20, 24, 80, 80); x.fillRect(48, 8, 24, 112); x.fillStyle = '#16665b'; x.font = '900 52px Inter'; x.fillText('EMERGÊNCIA', 120, 84); }); Pl(g, 2.8, 0.7, new T.MeshBasicMaterial({ map: sg }), 0, 2.5, -4, [0, 0, 0]);
    for (let i = 0; i < 4; i++) { const bd = new T.Group(); bd.position.set(i % 2 ? 1.4 : -1.4, 0, -8 - i * 5); B(bd, 0.9, 0.12, 2.0, 0xdfe5e8, 0, 0.7, 0); B(bd, 0.8, 0.12, 1.9, 0xffffff, 0, 0.82, 0); for (const [x, z] of [[-0.4, -0.9], [0.4, -0.9], [-0.4, 0.9], [0.4, 0.9]]) Cy(bd, 0.04, 0.04, 0.6, 0x888, x, 0.35, z); g.add(bd); }
    // ala (quarto) a +x
    const W = new T.Group(); W.position.set(26, 0, 0); g.add(W);
    Pl(W, 12, 10, new T.MeshLambertMaterial({ map: rep(tile(0x9bb0a6, 0x8aa196, 4), 6, 5) }), 0, 0, 0, [-Math.PI / 2, 0, 0]); B(W, 12, 3.2, 0.2, 0xe9efec, 0, 1.6, -5); B(W, 0.2, 3.2, 10, 0xe9efec, -6, 1.6, 0); B(W, 0.2, 3.2, 10, 0xe9efec, 6, 1.6, 0); B(W, 12, 0.2, 10, 0xe9efec, 0, 3.2, 0); B(W, 12, 3.2, 0.2, 0xe9efec, 0, 1.6, 5);
    B(W, 3.6, 1.8, 0.1, 0x0c1530, -2.5, 1.9, -4.85); const wl = B(W, 3.4, 1.6, 0.05, 0x335588, -2.5, 1.9, -4.8, { basic: true });
    for (let i = 0; i < 3; i++) { const bd = new T.Group(); bd.position.set(-4 + i * 4, 0, -2.6); B(bd, 1.0, 0.1, 2.1, 0xdfe5e8, 0, 0.55, 0); B(bd, 0.95, 0.14, 2.0, 0xffffff, 0, 0.67, 0); B(bd, 1.0, 0.8, 0.1, 0xdfe5e8, 0, 0.9, -1.0); g.add(bd); bd.position.x += 26; }
    Cy(W, 0.03, 0.03, 1.8, 0xaaa, 3.0, 0.9, -1.0); B(W, 0.5, 0.6, 0.02, 0xcfe, 3.0, 1.7, -1.0); B(W, 1.6, 0.9, 0.6, 0xc8d0d4, 5, 0.45, -4.5);
    const tg = new T.Group(); tg.position.set(26, 0, 0); B(tg, 1.0, 0.8, 0.6, 0x555d66, 2.2, 0.4, 1.6);
    const spot = new T.SpotLight(0xfff2c0, 0, 22, 0.55, 0.6, 1.2); g.add(spot, spot.target); g.userData.spot = spot;
    const beamM = new T.Mesh(new T.ConeGeometry(2.4, 7, 20, 1, true), new T.MeshBasicMaterial({ color: 0xfff2c0, transparent: true, opacity: 0.09, depthWrite: false, blending: T.AdditiveBlending, side: T.DoubleSide })); beamM.geometry.translate(0, -3.5, 0); g.add(beamM); g.userData.beam = beamM;
    return { bg: 0x05070a, fog: [0x05070a, 8, 40], hemi: [0x5d77a6, 0x0c0e12, 0.35], sun: [0x6f86d8, 0.25, [0, 10, 20]], apply(p, t) { const pw = p.power === undefined ? 0 : p.power; this.hemi = [0x5d77a6, 0x0c0e12, 0.28 + 0.8 * pw];
        if (p.day) { this.hemi = [0xffffff, 0xa9b4b0, 1.55]; this.sun = [0xfff6e8, 0.9, [6, 20, 16]]; this.fog = [0xd9e6e2, 16, 70]; this.bg = 0xd9e6e2; } else { this.sun = [0x6f86d8, 0.25, [0, 10, 20]]; this.fog = [0x05070a, 8, 40]; this.bg = 0x05070a; }
        g.userData.lights.forEach((l, i) => l.material.color.set(pw > 0.5 ? 0xffffff : 0x151515));
        const to = p.torch; if (to) { spot.intensity = 90; spot.position.set(to[0], to[1], to[2]); spot.target.position.set(to[3], to[4], to[5]); beamM.visible = true; beamM.position.set(to[0], to[1], to[2]); beamM.lookAt(to[3], to[4], to[5]); beamM.rotateX(-Math.PI / 2); beamM.rotateX(Math.PI); } else { spot.intensity = 0; beamM.visible = false; } } };
  });

  // ================= QUINTAL / HORTA =================
  mkEnv('farm', (g) => {
    const R = rng(91); const skyM = sky(g);
    Pl(g, 300, 300, new T.MeshLambertMaterial({ color: 0x5aa84a }), 0, 0, 0, [-Math.PI / 2, 0, 0]); Pl(g, 22, 18, new T.MeshLambertMaterial({ color: 0xb08a5c }), 0, 0.02, 2, [-Math.PI / 2, 0, 0]);
    // casa
    const h = new T.Group(); h.position.set(0, 0, -12); B(h, 10, 4, 6, 0xf4efe1, 0, 2, 0); B(h, 1.6, 2.6, 0.1, 0x6b4a2f, -2, 1.3, 3.05); B(h, 1.8, 1.4, 0.1, 0x9fd4ff, 2, 2.2, 3.05); const roof = new T.Mesh(new T.CylinderGeometry(4.6, 4.6, 11, 3, 1), lam(0xc0502e)); roof.rotation.z = Math.PI / 2; roof.rotation.y = 0; roof.rotation.x = 0; roof.position.y = 5.5; roof.scale.set(1, 1, 1.4); roof.rotation.set(0, 0, Math.PI / 2); h.add(roof); roof.rotation.order = 'XYZ'; roof.rotation.x = Math.PI / 2 * 0; g.add(h);
    // cerca
    for (let i = -12; i <= 12; i++) { B(g, 0.2, 1.4, 0.12, 0x8a6a4a, i * 1.0, 0.7, 14); } B(g, 25, 0.12, 0.1, 0x8a6a4a, 0, 1.1, 14); B(g, 25, 0.12, 0.1, 0x8a6a4a, 0, 0.5, 14);
    // canteiros + plantas
    const plants = []; for (let r = 0; r < 2; r++) for (let c = 0; c < 4; c++) { const bx = -7.5 + c * 5, bz = -1 + r * 6; B(g, 4, 0.5, 2.4, 0x8a6a4a, bx, 0.25, bz); B(g, 3.8, 0.1, 2.2, 0x5a3b26, bx, 0.52, bz); for (let k = 0; k < 6; k++) { const pg = new T.Group(); pg.position.set(bx - 1.5 + (k % 3) * 1.5, 0.55, bz - 0.5 + ((k / 3) | 0) * 1.0); const st = Cy(pg, 0.04, 0.05, 1, 0x3fa34a, 0, 0.5, 0); const l1 = Sp(pg, 0.25, 0x3fa34a, 0.2, 0.9, 0, { s: [1, 0.2, 0.6] }); const l2 = Sp(pg, 0.25, 0x3fa34a, -0.2, 0.7, 0, { s: [1, 0.2, 0.6] }); pg.userData = { st, l1, l2, c, r, k }; g.add(pg); plants.push(pg); } }
    g.userData.plants = plants;
    for (const [x, z] of [[-18, -8], [18, -6], [24, 5], [-24, 6]]) { Cy(g, 0.3, 0.4, 4, 0x6b4a2f, x, 2, z); Sp(g, 3.2, 0x2f8a3e, x, 5.5, z, { s: [1, 0.85, 1] }); }
    const trunk = Cy(g, 0.05, 0.05, 14, 0x8a6a4a, -10, 3.5, 6); Cy(g, 0.05, 0.05, 14, 0x8a6a4a, 10, 3.5, 6);
    return { bg: 0x9fc4ea, fog: [0xbcd6ee, 80, 300], hemi: [0xdfeaff, 0x6a7a55, 1.0], sun: [0xfff2dd, 1.0, [30, 60, 20]], apply(p, t) { const cy = p.cycle === undefined ? 0.25 : p.cycle; const el = Math.sin(cy * Math.PI * 2); const day = clamp(el * 2 + 0.3);
        skyM.userData.set(mix(0x050818, 0x4f8fd6, day).getHex(), mix(0x0e1538, 0xdbe9f6, day).getHex()); this.bg = mix(0x0e1538, 0xbcd6ee, day).getHex(); this.fog = [this.bg, 80, 300]; this.hemi = [mix(0x3a4a8a, 0xdfeaff, day).getHex(), 0x4a5a40, 0.35 + 0.7 * day]; this.sun = [mix(0x8fa6ff, 0xfff2dd, day).getHex(), 0.2 + 0.9 * day, [Math.cos(cy * Math.PI * 2) * 60, Math.max(8, el * 70), 20]];
        const gr = p.plant || 0, dead = p.dead || 0, who = p.which === undefined ? -1 : p.which; for (const pg of g.userData.plants) { const U = pg.userData; const on = who < 0 || (U.r * 4 + U.c) === who || (who === 99); const s = on ? clamp(gr) : (p.dim ? 0.03 : 0); pg.scale.set(1, 0.05 + s * 1.0, 1); pg.visible = (gr > 0.01 || p.dim) && (on || p.dim); const col2 = mix(0x3fa34a, 0x7a5a2a, dead); U.st.material.color.copy(col2); U.l1.material.color.copy(col2); U.l2.material.color.copy(col2); U.l1.position.y = 0.9 - dead * 0.5; U.l2.position.y = 0.7 - dead * 0.4; } } };
  });

  // ================= COFRE DE SEMENTES =================
  mkEnv('vault', (g) => {
    const R = rng(101); const skyM = sky(g); skyM.userData.set(0x03071a, 0x0e2a4a);
    Pl(g, 600, 600, new T.MeshLambertMaterial({ color: 0xdfe9f2 }), 0, 0, 0, [-Math.PI / 2, 0, 0]);
    const mt = new T.Mesh(new T.ConeGeometry(70, 50, 7), lam(0xeaf2f8)); mt.position.set(0, 20, -60); mt.scale.set(1.6, 1, 1); g.add(mt); const mt2 = new T.Mesh(new T.ConeGeometry(50, 36, 6), lam(0xdde8f0)); mt2.position.set(-90, 12, -80); g.add(mt2); const mt3 = new T.Mesh(new T.ConeGeometry(60, 40, 6), lam(0xe4eef5)); mt3.position.set(100, 14, -90); g.add(mt3);
    const door = new T.Group(); door.position.set(0, 0, -34); B(door, 10, 5.5, 14, 0x8b9096, 0, 2.75, 0); const wedge = new T.Mesh(new T.CylinderGeometry(5.2, 5.2, 14, 3), lam(0x7d8389)); wedge.rotation.set(0, 0, Math.PI / 2); wedge.rotation.x = Math.PI / 2; wedge.position.set(0, 6.5, 0); wedge.rotation.set(Math.PI / 2, 0, 0); wedge.scale.set(1, 1, 0.8); wedge.position.set(0, 5.6, 0); door.add(wedge);
    B(door, 3, 4.2, 0.4, 0x2a2e33, 0, 2.2, 7.1); const glow = B(door, 0.3, 4.4, 0.2, 0x7fffd8, 0, 2.3, 7.3, { basic: true }); const sb = B(door, 6, 0.5, 0.3, 0x6fe0c2, 0, 5.6, 7.3, { basic: true }); g.add(door); g.userData.glow = glow;
    const au = cvs(512, 256, (x, w, h) => { const gr = x.createLinearGradient(0, h, 0, 0); gr.addColorStop(0, 'rgba(90,255,170,0.0)'); gr.addColorStop(0.3, 'rgba(90,255,170,0.65)'); gr.addColorStop(1, 'rgba(60,200,255,0.0)'); x.fillStyle = gr; x.fillRect(0, 0, w, h); });
    const aur = []; for (let i = 0; i < 3; i++) { const m = new T.Mesh(new T.PlaneGeometry(420, 120, 40, 1), new T.MeshBasicMaterial({ map: au, transparent: true, opacity: 0.55, depthWrite: false, blending: T.AdditiveBlending, side: T.DoubleSide, fog: false })); m.position.set(-40 + i * 40, 130 + i * 15, -300 - i * 40); g.add(m); aur.push(m); } g.userData.aur = aur;
    const N = 500; const sp = new Float32Array(N * 3); for (let i = 0; i < N; i++) { sp[i * 3] = (R() - 0.5) * 60; sp[i * 3 + 1] = R() * 30; sp[i * 3 + 2] = -20 + (R() - 0.5) * 80; } const snowG = new T.BufferGeometry(); snowG.setAttribute('position', new T.BufferAttribute(sp, 3)); const snow = new T.Points(snowG, new T.PointsMaterial({ color: 0xffffff, size: 0.18, transparent: true, opacity: 0.9 })); g.add(snow); g.userData.snow = snow; g.userData.sp0 = sp.slice();
    const stars = new Float32Array(900 * 3); for (let i = 0; i < 900; i++) { const v = new T.Vector3(R() * 2 - 1, R() + 0.05, R() * 2 - 1).normalize().multiplyScalar(560); stars.set([v.x, v.y, v.z], i * 3); } const stg = new T.BufferGeometry(); stg.setAttribute('position', new T.BufferAttribute(stars, 3)); const st = new T.Points(stg, new T.PointsMaterial({ color: 0xffffff, size: 2, sizeAttenuation: false, fog: false })); st.frustumCulled = false; g.add(st);
    const lp = new T.PointLight(0x7fffd8, 25, 30); lp.position.set(0, 4, -26); g.add(lp);
    return { bg: 0x0a1c33, fog: [0x0c2038, 60, 320], hemi: [0x6a8ac0, 0x9ab0c8, 0.8], sun: [0xbcd0ff, 0.5, [-20, 40, 30]], apply(p, t) { for (const [i, m] of g.userData.aur.entries()) { const a = m.geometry.attributes.position; for (let k = 0; k < a.count; k++) { const x = a.getX(k); a.setZ(k, Math.sin(x * 0.03 + t * 0.6 + i) * 18); a.setY(k, a.getY(k) * 1); } a.needsUpdate = true; m.material.opacity = 0.45 + 0.2 * Math.sin(t * 0.8 + i); }
        const a = g.userData.snow.geometry.attributes.position, s0 = g.userData.sp0; for (let i = 0; i < a.count; i++) { a.setY(i, ((s0[i * 3 + 1] - t * 2.2) % 30 + 30) % 30); a.setX(i, s0[i * 3] + Math.sin(t + i) * 0.4); } a.needsUpdate = true; } };
  });

  // ================= TELHADO / PAINÉIS SOLARES =================
  mkEnv('solar', (g) => {
    const R = rng(111); const skyM = sky(g); skyM.userData.set(0x4f8fd6, 0xdbe9f6);
    B(g, 46, 1.0, 34, 0x9a9da3, 0, -0.5, 0); for (const [w, d, x, z] of [[46, 0.5, 0, -17], [46, 0.5, 0, 17], [0.5, 34, -23, 0], [0.5, 34, 23, 0]]) B(g, w, 1.2, d, 0xb7bac0, x, 0.6, z);
    for (let i = 0; i < 90; i++) { const a = R() * Math.PI * 2, r = 50 + R() * 220; const w = 8 + R() * 22, h = 8 + R() * 70; B(g, w, h, w, [0xc9c4b8, 0xb2bcc6, 0xd6b8a3][i % 3], Math.cos(a) * r, h / 2 - 6, Math.sin(a) * r); }
    B(g, 2.4, 2.2, 3, 0x8e9299, 16, 1.1, -12); B(g, 3.4, 1.6, 2, 0x8e9299, -17, 0.8, -13); Cy(g, 0.5, 0.5, 3, 0x6d727a, 12, 1.5, 12);
    const panels = []; for (let r = 0; r < 3; r++) for (let c = 0; c < 5; c++) { const pg = new T.Group(); pg.position.set(-14 + c * 2.7, 0.9, -10 + r * 2.6); const pn = new T.Group(); pn.rotation.x = -0.45; B(pn, 2.2, 0.08, 1.2, 0x1d3f8a, 0, 0, 0); for (let i = 1; i < 6; i++) B(pn, 0.015, 0.09, 1.2, 0xbfd3ff, -1.1 + i * 2.2 / 6, 0, 0); for (let j = 1; j < 3; j++) B(pn, 2.2, 0.09, 0.015, 0xbfd3ff, 0, 0, -0.6 + j * 0.4); pg.add(pn); B(pg, 0.08, 0.7, 0.08, 0x777c83, -0.9, -0.4, 0.2); B(pg, 0.08, 0.7, 0.08, 0x777c83, 0.9, -0.4, 0.2); g.add(pg); panels.push(pg); } g.userData.panels = panels;
    const fr = new T.Group(); fr.position.set(7, 0, 4); B(fr, 1.1, 1.95, 0.95, 0xf0f2f4, 0, 0.98, 0); B(fr, 1.0, 0.04, 0.02, 0x999, 0, 1.3, 0.49); B(fr, 0.06, 0.5, 0.06, 0x888, 0.4, 1.6, 0.52); const inl = B(fr, 0.95, 1.8, 0.04, 0xfff3c0, 0, 0.98, 0.49, { basic: true }); inl.visible = false; g.userData.fridgeL = inl; const fl = new T.PointLight(0xfff0b0, 0, 6); fl.position.set(0, 1.2, 1.0); fr.add(fl); g.userData.fl = fl; g.add(fr);
    const cb = new T.Group(); const pts = [[-9.0, 0.2, -4.0], [-4, 0.05, -1], [2, 0.05, 2], [6.4, 0.05, 4.2]]; for (let i = 0; i < pts.length - 1; i++) { const a = new T.Vector3(...pts[i]), b = new T.Vector3(...pts[i + 1]); const d = a.distanceTo(b); const m = new T.Mesh(new T.CylinderGeometry(0.04, 0.04, d, 6), lam(0x111111)); m.position.copy(a).add(b).multiplyScalar(0.5); m.lookAt(b); m.rotateX(Math.PI / 2); cb.add(m); } g.add(cb);
    const spark = new T.Group(); spark.position.set(6.4, 0.6, 4.2); for (let i = 0; i < 3; i++) { const m = new T.Mesh(new T.PlaneGeometry(1.6, 0.2), new T.MeshBasicMaterial({ color: 0xffe066, transparent: true, depthWrite: false, blending: T.AdditiveBlending, side: T.DoubleSide })); m.rotation.z = i * Math.PI / 3; spark.add(m); } spark.add(new T.PointLight(0xffe066, 40, 8)); spark.visible = false; g.add(spark); g.userData.spark = spark;
    return { bg: 0xbcd6ee, fog: [0xbcd6ee, 120, 420], hemi: [0xdfeaff, 0x8a8f96, 1.05], sun: [0xfff2dd, 1.1, [30, 60, 20]], apply(p, t) { const rem = p.removed || 0; g.userData.panels.forEach((pg, i) => pg.visible = i < 15 - rem); g.userData.fridgeL.visible = !!p.on; g.userData.fl.intensity = p.on ? 8 : 0; const sk = p.spark || 0; g.userData.spark.visible = sk > 0; g.userData.spark.scale.setScalar(0.5 + sk * 1.2); g.userData.spark.rotation.z = t * 20; } };
  });

  // ================= BIBLIOTECA =================
  mkEnv('library', (g) => {
    const R = rng(121);
    const plank = cvs(256, 256, (x, w, h) => { x.fillStyle = '#9a6b3f'; x.fillRect(0, 0, w, h); for (let i = 0; i < 8; i++) { x.fillStyle = i % 2 ? '#8c5f36' : '#a67847'; x.fillRect(0, i * 32, w, 31); } }); rep(plank, 8, 10);
    Pl(g, 32, 44, new T.MeshLambertMaterial({ map: plank }), 0, 0, -8, [-Math.PI / 2, 0, 0]); B(g, 32, 0.3, 44, 0xe8dcc4, 0, 9, -8);
    B(g, 32, 9, 0.3, 0xd8c8a8, 0, 4.5, -30); B(g, 32, 9, 0.3, 0xd8c8a8, 0, 4.5, 14); B(g, 0.3, 9, 44, 0xd8c8a8, -16, 4.5, -8); B(g, 0.3, 9, 44, 0xd8c8a8, 16, 4.5, -8);
    const books = cvs(512, 512, (x, w, h) => { const cols = ['#7a2e2e', '#2e4a7a', '#2f6b4a', '#8a6a2a', '#5a2e7a', '#a04a2a', '#2a6a7a', '#c9b88a']; x.fillStyle = '#3a2412'; x.fillRect(0, 0, w, h); for (let r = 0; r < 8; r++) { let xx = 4; while (xx < w - 12) { const bw = 10 + R() * 14, bh = 48 + R() * 12; x.fillStyle = cols[(R() * cols.length) | 0]; x.fillRect(xx, r * 64 + 60 - bh, bw, bh); x.fillStyle = 'rgba(255,230,160,.5)'; x.fillRect(xx + 2, r * 64 + 60 - bh + 8, bw - 4, 3); xx += bw + 1; } x.fillStyle = '#5a3a1e'; x.fillRect(0, r * 64 + 60, w, 4); } });
    for (const sx of [-1, 1]) { const t = books.clone(); t.needsUpdate = true; rep(t, 5, 1); const m = Pl(g, 44, 8.4, new T.MeshLambertMaterial({ map: t }), sx * 15.7, 4.4, -8, [0, -sx * Math.PI / 2, 0]); }
    { const t = books.clone(); t.needsUpdate = true; rep(t, 3, 1); Pl(g, 32, 8.4, new T.MeshLambertMaterial({ map: t }), 0, 4.4, -29.8, [0, 0, 0]); }
    for (let i = 0; i < 3; i++) { B(g, 3, 0.12, 8, 0x6b4a2f, -9 + i * 9, 1.0, -6); for (const [x, z] of [[-1.4, -3.6], [1.4, -3.6], [-1.4, 3.6], [1.4, 3.6]]) B(g, 0.14, 1.0, 0.14, 0x4a3320, -9 + i * 9 + x, 0.5, -6 + z); B(g, 0.4, 0.5, 0.3, 0x1a6a3a, -9 + i * 9, 1.4, -8); Cy(g, 0.03, 0.03, 0.4, 0x333, -9 + i * 9, 1.25, -8); for (let k = 0; k < 4; k++) B(g, 0.7, 0.05, 0.5, [0xc0392b, 0xf4efe0, 0x2e6fb5][k % 3], -9 + i * 9 + 0.6, 1.1 + k * 0.05, -4 + k * 0.7, { r: [0, k * 0.5, 0] }); }
    // motor na mesa central
    const mo = new T.Group(); mo.position.set(0, 1.06, -6); B(mo, 1.3, 0.7, 0.8, 0x3a3f45, 0, 0.35, 0); for (let i = 0; i < 4; i++) Cy(mo, 0.14, 0.14, 0.5, 0x8a929a, -0.45 + i * 0.3, 0.9, 0); B(mo, 0.3, 0.5, 0.3, 0xd62828, 0.8, 0.3, 0.1); g.add(mo); g.userData.motor = mo;
    for (const x of [-11, 11]) { B(g, 2.6, 5.4, 0.2, 0x9fd4ff, x, 4.5, 13.7, { basic: true, m: { transparent: true, opacity: 0.9 } }); const bm = new T.Mesh(new T.PlaneGeometry(2.6, 18), new T.MeshBasicMaterial({ color: 0xffe9b0, transparent: true, opacity: 0.12, depthWrite: false, blending: T.AdditiveBlending, side: T.DoubleSide })); bm.position.set(x * 0.8, 4.5, 6); bm.rotation.set(-1.0, 0, 0); g.add(bm); }
    const bolts = []; for (let i = 0; i < 10; i++) { const b = Cy(g, 0.05, 0.05, 0.18, 0xb8bec6, 0, -9, 0); bolts.push(b); } g.userData.bolts = bolts;
    // p.desk: balcão de empréstimo em z=2 (tampo y=1.1, x −2.2..2.2), atendente atrás em z≈1.1 olhando +z, cliente em z≈2.9 olhando −z.
    // Gaveta (p.drawer 0..1) abre para o lado do atendente; carimbo + fichário em cima; esconde o motor da mesa central.
    const desk = new T.Group(); desk.position.set(0, 0, 2); g.add(desk);
    B(desk, 4.4, 1.04, 0.8, 0x7a4a2b, 0, 0.52, 0); B(desk, 4.6, 0.08, 1.0, 0x5a3820, 0, 1.08, 0); B(desk, 4.3, 0.06, 0.02, 0xd4af37, 0, 0.8, 0.41);
    B(desk, 0.5, 0.32, 0.35, 0x2e6fb5, -1.5, 1.28, -0.1); for (let k = 0; k < 3; k++) B(desk, 0.1, 0.26, 0.3, [0xf4efe0, 0xc0392b, 0xf4efe0][k], -1.65 + k * 0.12, 1.42, -0.1);
    Cy(desk, 0.07, 0.07, 0.14, 0x222222, 1.2, 1.19, -0.05); Cy(desk, 0.03, 0.03, 0.12, 0x8a5a32, 1.2, 1.32, -0.05); B(desk, 0.5, 0.03, 0.35, 0xe8dcc4, 1.7, 1.13, 0.05);
    const drw = B(desk, 1.0, 0.22, 0.7, 0x8a5a32, 0.6, 0.86, 0); B(drw, 0.25, 0.04, 0.04, 0xd4af37, 0, 0, -0.37); g.userData.drw = drw;
    return { bg: 0x2a1c10, fog: [0x2a1c10, 25, 70], hemi: [0xffe9c4, 0x6a4a2a, 0.95], sun: [0xffe0a0, 0.6, [10, 30, 20]], apply(p, t) { desk.visible = !!p.desk; g.userData.motor.visible = !p.desk; g.userData.drw.position.z = -(p.drawer || 0) * 0.5; const bl = p.bolts || []; g.userData.bolts.forEach((b, i) => { const q = bl[i]; if (q) { b.position.set(q[0], q[1], q[2]); b.rotation.set(t * 9 + i, 0, t * 7); b.visible = true; } else b.visible = false; }); } };
  });

  // ================= SALA DE AULA =================
  mkEnv('classroom', (g) => {
    const R = rng(131);
    Pl(g, 16, 12, new T.MeshLambertMaterial({ map: rep(tile(0xd9c9a3, 0xcbb68a, 4), 8, 6) }), 0, 0, 0, [-Math.PI / 2, 0, 0]);
    B(g, 16, 4, 0.2, 0xf4e8b5, 0, 2, -6); B(g, 0.2, 4, 12, 0xf4e8b5, -8, 2, 0); B(g, 0.2, 4, 12, 0xf4e8b5, 8, 2, 0); B(g, 16, 4, 0.2, 0xf4e8b5, 0, 2, 6); B(g, 16, 0.2, 12, 0xfff9e0, 0, 4, 0); B(g, 16, 1.3, 0.25, 0x2e6fb5, 0, 0.65, -5.9); B(g, 0.25, 1.3, 12, 0x2e6fb5, -7.9, 0.65, 0); B(g, 0.25, 1.3, 12, 0x2e6fb5, 7.9, 0.65, 0);
    const bc = document.createElement('canvas'); bc.width = 1536; bc.height = 576; const bx = bc.getContext('2d'); const bt = new T.CanvasTexture(bc); bt.colorSpace = T.SRGBColorSpace; bt.anisotropy = 4;
    B(g, 8.6, 3.2, 0.12, 0xb8bec6, -0.3, 2.2, -5.85); Pl(g, 8.2, 2.9, new T.MeshBasicMaterial({ map: bt }), -0.3, 2.2, -5.7); B(g, 8.4, 0.12, 0.3, 0xb8bec6, -0.3, 0.7, -5.75); g.userData.bc = { bc, bx, bt };
    for (let r = 0; r < 3; r++) for (let c = 0; c < 4; c++) { const x = -5.2 + c * 3.4, z = -1.6 + r * 2.6; B(g, 1.2, 0.08, 0.8, 0xe8d9b0, x, 0.78, z); B(g, 1.1, 0.04, 0.7, 0xb8a47a, x, 0.74, z); for (const [dx, dz] of [[-0.5, -0.3], [0.5, -0.3], [-0.5, 0.3], [0.5, 0.3]]) Cy(g, 0.03, 0.03, 0.74, 0x777, x + dx, 0.37, z + dz); B(g, 0.5, 0.06, 0.5, 0x2e6fb5, x, 0.5, z + 0.7); B(g, 0.5, 0.5, 0.06, 0x2e6fb5, x, 0.8, z + 0.95); Cy(g, 0.03, 0.03, 0.5, 0x777, x - 0.2, 0.25, z + 0.7); Cy(g, 0.03, 0.03, 0.5, 0x777, x + 0.2, 0.25, z + 0.7); }
    B(g, 2.2, 0.1, 1.0, 0x7a4a2b, 5.4, 0.95, -4.3); B(g, 2.0, 0.9, 0.9, 0x6a3f24, 5.4, 0.45, -4.3);
    Cy(g, 0.35, 0.35, 0.06, 0xffffff, 6, 3.2, -5.8, { r: [Math.PI / 2, 0, 0] }); B(g, 0.03, 0.25, 0.02, 0x111, 6, 3.28, -5.75); B(g, 0.2, 0.03, 0.02, 0x111, 6.08, 3.2, -5.75);
    for (let i = 0; i < 3; i++) { B(g, 2.4, 1.8, 0.1, 0x9fd4ff, -3 + i * 3, 2.4, 5.9, { basic: true }); B(g, 2.6, 0.12, 0.3, 0xfff, -3 + i * 3, 1.45, 5.8); }
    B(g, 1.4, 1.0, 0.06, 0xf5e6c8, -7.9, 2.3, -3.5, { r: [0, Math.PI / 2, 0] }); B(g, 1.0, 1.2, 0.06, 0x9a6a3a, -7.9, 2.3, -1.6, { r: [0, Math.PI / 2, 0] });
    // porta na parede da direita (x=8), vão z 1.6..2.8, dobradiça em z=1.6; p.door 0..1 abre para dentro
    B(g, 0.32, 0.14, 1.5, 0x6a3f24, 7.85, 2.42, 2.2); for (const z of [1.52, 2.88]) B(g, 0.32, 2.4, 0.14, 0x6a3f24, 7.85, 1.2, z);
    B(g, 0.12, 2.3, 1.2, 0x2a2016, 7.97, 1.15, 2.2, { basic: true });
    const dr = new T.Group(); dr.position.set(7.84, 0, 1.6); g.add(dr); B(dr, 0.07, 2.3, 1.2, 0x8a5a32, 0, 1.15, 0.6); B(dr, 0.06, 0.5, 0.4, 0xbfe3ff, -0.03, 1.7, 0.6, { basic: true }); Sp(dr, 0.05, 0xd4af37, -0.08, 1.05, 1.05);
    return { bg: 0xfff3d0, fog: null, hemi: [0xfff9e8, 0x9a8a6a, 1.05], sun: [0xfff0d0, 0.5, [5, 12, 10]], apply(p, t) { dr.rotation.y = -(p.door || 0) * 1.5; const D = g.userData.bc; D.bx.fillStyle = '#fbfbf8'; D.bx.fillRect(0, 0, 1536, 576); D.bx.strokeStyle = '#d5d9dd'; D.bx.lineWidth = 3; D.bx.strokeRect(6, 6, 1524, 564); if (p.board) p.board(D.bx, 1536, 576); D.bt.needsUpdate = true; } };
  });

  // ================= SALA DO GERADOR =================
  mkEnv('gen', (g) => {
    const R = rng(141);
    B(g, 14, 0.2, 12, 0x6a6e73, 0, -0.1, 0); B(g, 14, 4.5, 0.3, 0x8a8e93, 0, 2.25, -6); B(g, 0.3, 4.5, 12, 0x8a8e93, -7, 2.25, 0); B(g, 0.3, 4.5, 12, 0x8a8e93, 7, 2.25, 0); B(g, 14, 0.3, 12, 0x7a7e83, 0, 4.5, 0); B(g, 14, 4.5, 0.3, 0x8a8e93, 0, 2.25, 6);
    B(g, 14, 0.9, 0.35, 0xf6c90e, 0, 0.45, -5.8); B(g, 0.35, 0.9, 12, 0xf6c90e, -6.8, 0.45, 0);
    const gen = new T.Group(); gen.position.set(0, 0, -2.4); B(gen, 4.2, 1.9, 1.7, 0xe8a317, 0, 1.2, 0); B(gen, 4.3, 0.3, 1.8, 0x333, 0, 0.15, 0); B(gen, 3.6, 0.1, 1.5, 0xbf8212, 0, 2.2, 0); Cy(gen, 0.22, 0.22, 2.4, 0x555, 1.5, 3.3, -0.5); B(gen, 1.4, 1.0, 0.1, 0x222, -1.2, 1.4, 0.88); for (let i = 0; i < 3; i++) { Cy(gen, 0.18, 0.18, 0.05, 0xffffff, -1.6 + i * 0.4, 1.55, 0.95, { r: [Math.PI / 2, 0, 0] }); } const tm1 = B(gen, 0.25, 0.25, 0.3, 0xd62828, 1.3, 1.9, 0.85); const tm2 = B(gen, 0.25, 0.25, 0.3, 0x222, 1.8, 1.9, 0.85); const hand = B(gen, 0.1, 0.1, 0.8, 0x888, -2.4, 1.3, 0.1); g.add(gen); g.userData.gen = gen; g.userData.crank = hand;
    const smoke = []; for (let i = 0; i < 12; i++) { const s = new T.Mesh(new T.SphereGeometry(0.35, 8, 6), new T.MeshBasicMaterial({ color: 0x555555, transparent: true, opacity: 0.5, depthWrite: false })); s.userData.k = i; g.add(s); smoke.push(s); } g.userData.smoke = smoke;
    for (const [x, z] of [[-5.6, -4.8], [-4.8, -5.0]]) Cy(g, 0.45, 0.45, 1.1, 0x2a6ad6, x, 0.55, z); B(g, 1.4, 0.5, 0.6, 0xd62828, 5, 0.25, -3); B(g, 1.0, 0.04, 0.4, 0x999, 5.2, 0.52, -3);
    for (let i = 0; i < 3; i++) Cy(g, 0.06, 0.06, 12, [0x777, 0x999, 0x666][i], 0, 4.1 - i * 0.2, -5.7, { r: [0, 0, Math.PI / 2] });
    const bulb = new T.Mesh(new T.SphereGeometry(0.18, 10, 8), new T.MeshBasicMaterial({ color: 0xfff1b0 })); bulb.position.set(0, 3.9, 0); g.add(bulb); g.userData.bulb = bulb; const bl = new T.PointLight(0xfff1b0, 0, 18); bl.position.set(0, 3.8, 0); g.add(bl); g.userData.bl = bl;
    const gw = new T.Mesh(new T.PlaneGeometry(14, 12), new T.MeshLambertMaterial({ color: 0x2f6f90, transparent: true, opacity: 0.78 })); gw.rotation.x = -Math.PI / 2; g.add(gw); g.userData.gw = gw;
    const cab = []; for (const [c, z] of [[0xd62828, 1.2], [0x111111, 1.5]]) { const cp = new T.Mesh(new T.TubeGeometry(new T.CatmullRomCurve3([new T.Vector3(1.3 + (z - 1.2) * 1.6, 1.9, -1.5), new T.Vector3(1.5, 1.2, -0.4), new T.Vector3(2.3, 0.02, 0.5), new T.Vector3(3.5, 0.02, 1.8)]), 14, 0.05, 6), lam(c)); g.add(cp); }
    return { bg: 0x08090b, fog: [0x08090b, 12, 40], hemi: [0xb0c0d8, 0x30353a, 0.2], sun: [0xffe0a0, 0.0, [0, 10, 5]], apply(p, t) { const pw = p.power === undefined ? 0 : p.power; this.hemi = [0xb0c0d8, 0x30353a, 0.18 + 0.9 * pw]; g.userData.bl.intensity = 30 * pw; g.userData.bulb.material.color.set(pw > 0.1 ? 0xfff1b0 : 0x222222);
        const sh = p.shake || 0; g.userData.gen.position.set(Math.sin(t * 60) * 0.03 * sh, Math.abs(Math.sin(t * 50)) * 0.03 * sh, -2.4); g.userData.crank.rotation.x = p.crank || 0; const wl = p.water || 0; g.userData.gw.visible = wl > 0.001; g.userData.gw.position.y = wl * 0.9 + Math.sin(t * 2) * 0.01;
        const sm = p.smoke || 0; g.userData.smoke.forEach((s, i) => { const ph = (t * 0.8 + i / 12) % 1; s.position.set(1.5 + Math.sin(i * 2) * 0.3, 4.6 + ph * 2.6, -2.9 + Math.cos(i) * 0.3); s.scale.setScalar(0.4 + ph * 1.6); s.material.opacity = (1 - ph) * 0.6 * sm; s.visible = sm > 0.01; }); } };
  });

  // ================= COLINA FINAL =================
  mkEnv('final', (g) => {
    const R = rng(151); const skyM = sky(g);
    const hill = new T.Mesh(new T.SphereGeometry(90, 40, 20, 0, Math.PI * 2, 0, 0.5), lam(0x2d6a3a)); hill.position.y = -90.4; g.add(hill); Pl(g, 600, 600, new T.MeshLambertMaterial({ color: 0x24512f }), 0, -2, 0, [-Math.PI / 2, 0, 0]);
    for (const [x, z, r] of [[-9, -6, 0.3], [10, -9, -0.4], [-14, 4, 0.8], [13, 6, -0.9], [-4, -13, 0]]) { const h = new T.Group(); h.position.set(x, 0, z); h.rotation.y = r; B(h, 4, 2.2, 3.4, 0xc9a074, 0, 1.1, 0); const rf = new T.Mesh(new T.ConeGeometry(3.6, 2.2, 4), lam(0x8a4a2a)); rf.position.y = 3.3; rf.rotation.y = Math.PI / 4; h.add(rf); B(h, 0.9, 1.5, 0.1, 0x4a3320, 0, 0.75, 1.72); const w = B(h, 0.7, 0.7, 0.1, 0xffd98a, 1.2, 1.4, 1.72, { basic: true }); g.add(h); }
    for (let i = 0; i < 14; i++) { const a = i / 14 * Math.PI * 2; const l = new T.Mesh(new T.SphereGeometry(0.14, 8, 6), new T.MeshBasicMaterial({ color: [0xffd98a, 0xff9a62, 0xfff2c0][i % 3] })); l.position.set(Math.cos(a) * 8, 3.2 + Math.sin(i * 2) * 0.2, Math.sin(a) * 8); g.add(l); }
    // ruínas distantes cobertas de mato
    for (let i = 0; i < 40; i++) { const a = -Math.PI * 0.8 + R() * Math.PI * 0.6 - 0.2, r = 120 + R() * 120; const w = 10 + R() * 14, hh = 20 + R() * 70; const b = B(g, w, hh, w, 0x39414f, Math.sin(a) * r, hh / 2 - 8, -Math.cos(a) * r); b.rotation.z = (R() - 0.5) * 0.25; b.rotation.y = R(); const tr = new T.Mesh(new T.IcosahedronGeometry(w * 0.6, 1), lam(0x2d7a3a)); tr.position.set(b.position.x, hh - 8 + 3, b.position.z); g.add(tr); }
    for (let i = 0; i < 40; i++) { const a = R() * Math.PI * 2, r = 20 + R() * 60; const t2 = new T.Group(); t2.position.set(Math.cos(a) * r, 0, Math.sin(a) * r); Cy(t2, 0.3, 0.4, 5, 0x5a3f27, 0, 2.5, 0); const cc = new T.Mesh(new T.IcosahedronGeometry(3.2, 1), lam(0x2f8a3e)); cc.position.y = 6.5; t2.add(cc); g.add(t2); }
    const N = 60; const fp = new Float32Array(N * 3); for (let i = 0; i < N; i++) { fp[i * 3] = (R() - 0.5) * 40; fp[i * 3 + 1] = 0.5 + R() * 4; fp[i * 3 + 2] = (R() - 0.5) * 40; } const fg = new T.BufferGeometry(); fg.setAttribute('position', new T.BufferAttribute(fp, 3)); const ff = new T.Points(fg, new T.PointsMaterial({ color: 0xd8ff6a, size: 5, sizeAttenuation: false, transparent: true, opacity: 0.9 })); g.add(ff); g.userData.ff = ff; g.userData.fp0 = fp.slice();
    const st = new Float32Array(700 * 3); for (let i = 0; i < 700; i++) { const v = new T.Vector3(R() * 2 - 1, R() + 0.15, R() * 2 - 1).normalize().multiplyScalar(560); st.set([v.x, v.y, v.z], i * 3); } const sg = new T.BufferGeometry(); sg.setAttribute('position', new T.BufferAttribute(st, 3)); const sp = new T.Points(sg, new T.PointsMaterial({ color: 0xffffff, size: 2, sizeAttenuation: false, fog: false })); sp.frustumCulled = false; g.add(sp);
    return { bg: 0x3a2a55, fog: [0x4a3a66, 80, 400], hemi: [0xffb08a, 0x2a3a2a, 0.7], sun: [0xff9a62, 0.8, [-40, 18, -20]], apply(p, t) { skyM.userData.set(p.night ? 0x070a1c : 0x2a2f6e, p.night ? 0x1d2552 : 0xff9a62); this.bg = p.night ? 0x1d2552 : 0x6a4a66; this.fog = [p.night ? 0x1d2552 : 0x6a4a66, 80, 400]; this.hemi = [0xffb08a, 0x2a3a2a, p.night ? 0.35 : 0.75]; this.sun = [p.night ? 0x8fa6ff : 0xff9a62, p.night ? 0.25 : 0.8, [-40, 18, -20]];
        const a = g.userData.ff.geometry.attributes.position, s0 = g.userData.fp0; for (let i = 0; i < a.count; i++) { a.setXYZ(i, s0[i * 3] + Math.sin(t * 0.7 + i) * 1.5, s0[i * 3 + 1] + Math.sin(t * 1.3 + i * 2) * 0.5, s0[i * 3 + 2] + Math.cos(t * 0.6 + i) * 1.5); } a.needsUpdate = true; } };
  });

  // ================= OUTRO =================
  mkEnv('outro', (g) => {
    const R = rng(161); const skyM = sky(g); skyM.userData.set(0x2a0f6a, 0x5a2fd0);
    const fl = new T.Mesh(new T.CircleGeometry(80, 48), new T.MeshLambertMaterial({ color: 0x3a1a8a })); fl.rotation.x = -Math.PI / 2; g.add(fl);
    const rays = new T.Group(); for (let i = 0; i < 18; i++) { const m = new T.Mesh(new T.PlaneGeometry(3, 80), new T.MeshBasicMaterial({ color: i % 2 ? 0x7a4aff : 0x9a7aff, transparent: true, opacity: 0.22, depthWrite: false, side: T.DoubleSide, fog: false })); m.rotation.z = i / 18 * Math.PI * 2; m.position.set(0, 0, 0); const gg = new T.Group(); gg.rotation.z = i / 18 * Math.PI * 2; const mm = m.clone(); mm.rotation.z = 0; mm.position.y = 40; gg.add(mm); rays.add(gg); } rays.position.set(0, 3, -22); g.add(rays); g.userData.rays = rays;
    const N = 160; const sp = new Float32Array(N * 3); for (let i = 0; i < N; i++) { sp[i * 3] = (R() - 0.5) * 30; sp[i * 3 + 1] = R() * 14; sp[i * 3 + 2] = -10 - R() * 12; } const sg = new T.BufferGeometry(); sg.setAttribute('position', new T.BufferAttribute(sp, 3)); const spk = new T.Points(sg, new T.PointsMaterial({ color: 0xffe066, size: 7, sizeAttenuation: false, transparent: true, opacity: 0.9 })); g.add(spk); g.userData.spk = spk; g.userData.sp0 = sp.slice();
    return { bg: 0x2a0f6a, fog: null, hemi: [0xcbb8ff, 0x3a1a8a, 0.9], sun: [0xffffff, 0.9, [4, 10, 12]], apply(p, t) { g.userData.rays.rotation.z = t * 0.12; const a = g.userData.spk.geometry.attributes.position, s0 = g.userData.sp0; for (let i = 0; i < a.count; i++) { a.setY(i, (s0[i * 3 + 1] + t * (0.4 + (i % 5) * 0.2)) % 14); } a.needsUpdate = true; } };
  });
}
