// Cenário "desert": Saara — "Oásis Estrela" (longo "no deserto").
// Chão (areia) y=0, plano até r≈45; dunas grandes depois disso.
//  - LAGOA do oásis: elipse em (-12, 0, 3) (raio 6 x 4), grama em volta. Palmeiras (tamareiras) em volta da lagoa e da vila.
//  - POÇO: anel de pedra em (0, 0, -4) (raio 1). BOMBA azul em (1.9, 0, -4) (0.9 x 1.1 x 0.9); cano até a CAIXA D'ÁGUA na torre em (5, 0, -7.5) (tanque y≈3.4..5.2).
//    p.clog 0..1 = monte de areia enterrando a bomba; p.jet 0..1 = jato d'água saindo do poço (altura ~4 m); p.tank 0..1 nível (marcador na lateral do tanque).
//    p.well2 = 2º poço + bomba em (9, 0, 3).
//  - VILA: casas de adobe x 6..22, z -18..-8 (portas viradas p/ +z); TENDA grande (refeitório) em (14, 0, 6) (8 x 6), aberta p/ -x. p.more = mais casas (cidade, anos depois).
//  - PAINÉIS SOLARES: x -34..-20, z -20..-9 (p.panels false esconde). p.dust 0..1 = areia cobrindo; p.wet 0..1 = gotas de orvalho brilhando.
//  - REDES DE ORVALHO/NEBLINA: 4 molduras x -15..-4, z 9, viradas p/ +z, baldes embaixo (p.nets 0..1 sobe as redes).
//  - HORTA: canteiros x -4..6, z 7..13 (p.plant 0..1). ROCHA COM PINTURA rupestre em (-26, 0, 16), face p/ +z (≈4 m de largura).
//  - CAMINHÕES: p.trucks = {x} caravana de 3 caminhões andando ao longo de x na estrada z=22 (frente p/ +x).
//  - p.lush 0..1 = Saara verde (6 mil anos atrás): chão verde, lagoa grande, árvores. p.trees 0..1 = muralha de árvores em z≈-32 (x -45..45).
//  - p.wall 0..1 = parede de areia (haboob) vindo de -z (0 = longe, 1 = em cima do oásis); p.storm 0..1 = dentro da tempestade (céu marrom, areia voando).
//  - p.tod 'day'|'dawn'|'dusk'|'night', p.stars, p.power 0..1 (luzinhas nas casas / lâmpadas da tenda à noite).
// Câmera: fique fora das casas, da torre (x 4..6, z -8.5..-6.5) e da tenda; y>0.4.
export function desertEnvs(U) {
  const { THREE, B, Cy, Sp, cvs, mkEnv, rng, sky, lam } = U;
  const T = THREE;
  mkEnv('desert', (g) => {
    const R = rng(707); const sk = sky(g);
    // ===== CHÃO E DUNAS =====
    const st = cvs(256, 256, (x, w, h) => { x.fillStyle = '#e2b877'; x.fillRect(0, 0, w, h); const r2 = rng(11); for (let i = 0; i < 700; i++) { x.fillStyle = r2() < 0.5 ? 'rgba(190,140,80,.18)' : 'rgba(255,230,180,.25)'; x.beginPath(); x.ellipse(r2() * w, r2() * h, 4 + r2() * 14, 1 + r2() * 2, 0.2, 0, 7); x.fill(); } });
    st.wrapS = st.wrapT = T.RepeatWrapping; st.repeat.set(40, 40);
    const GG = new T.PlaneGeometry(1100, 1100, 110, 110); const ga = GG.attributes.position;
    for (let i = 0; i < ga.count; i++) { const x = ga.getX(i), y = ga.getY(i); const r = Math.hypot(x, y); const k = Math.max(0, Math.min(1, (r - 45) / 40));
      const d = (Math.sin(x * 0.045 + Math.sin(y * 0.02) * 2) * 0.5 + 0.5) * (Math.cos(y * 0.03 + x * 0.01) * 0.4 + 0.6); ga.setZ(i, k * (d * 16 + Math.sin(x * 0.11) * 1.2)); }
    GG.computeVertexNormals(); const gm = new T.MeshLambertMaterial({ map: st, color: 0xffffff }); const ground = new T.Mesh(GG, gm); ground.rotation.x = -Math.PI / 2; g.add(ground);
    // ===== LAGOA =====
    const grass = new T.Mesh(new T.CircleGeometry(1, 40), lam(0x7aa83a)); grass.rotation.x = -Math.PI / 2; grass.position.set(-12, 0.02, 3); grass.scale.set(9, 7, 1); g.add(grass);
    const wm = new T.MeshLambertMaterial({ color: 0x2a9ac8 }); const lake = new T.Mesh(new T.CircleGeometry(1, 40), wm); lake.rotation.x = -Math.PI / 2; lake.position.set(-12, 0.05, 3); lake.scale.set(6, 4, 1); g.add(lake);
    // ===== PALMEIRAS =====
    const palms = [];
    const palm = (x, z, s, lean, grp = g) => { const p = new T.Group(); p.position.set(x, 0, z); p.rotation.y = R() * 6.28; grp.add(p); const tr = new T.Group(); p.add(tr); let px = 0, py = 0; const segs = 7;
      for (let i = 0; i < segs; i++) { const h = 0.9 * s; const m = Cy(tr, 0.16 * s, 0.2 * s, h, i % 2 ? 0x8a6a45 : 0x7a5a38, px, py + h / 2, 0); m.rotation.z = -lean * (i / segs); px += Math.sin(lean * (i / segs)) * h; py += Math.cos(lean * (i / segs)) * h * 0.98; }
      const crown = new T.Group(); crown.position.set(px, py, 0); tr.add(crown); const leaves = [];
      for (let k = 0; k < 8; k++) { const lf = new T.Group(); lf.rotation.y = k / 8 * Math.PI * 2; crown.add(lf); const piv = new T.Group(); lf.add(piv); piv.rotation.z = -0.5; B(piv, 2.6 * s, 0.05, 0.55 * s, k % 2 ? 0x4a9a3a : 0x3a8a34, 1.3 * s, 0, 0); leaves.push(piv); }
      for (let k = 0; k < 4; k++) Sp(crown, 0.15 * s, 0xa0521e, Math.cos(k * 1.6) * 0.22, -0.25, Math.sin(k * 1.6) * 0.22);
      palms.push({ p, tr, leaves, ph: R() * 6 }); return p; };
    for (const [x, z, s, l] of [[-19, 1, 1.0, 0.25], [-17, 7, 1.1, -0.2], [-6, 6, 0.9, 0.15], [-8, -1, 1.05, -0.2], [-15, -2, 0.95, 0.1], [-11, 8.5, 0.85, 0.2], [-20, -4, 1.1, 0.0], [3, 14, 0.9, 0.2], [-3, -10, 1.0, 0.1], [24, -4, 1.0, -0.15], [23, 10, 1.05, 0.2], [-2, 16, 0.9, -0.2]]) palm(x, z, s, l);
    // ===== POÇO, BOMBA, CAIXA D'ÁGUA =====
    const well = (x, z) => { const m = new T.Group(); m.position.set(x, 0, z); g.add(m); const ring = new T.Mesh(new T.CylinderGeometry(1.05, 1.15, 0.8, 20, 1, true), lam(0x9a8a74, { side: T.DoubleSide })); ring.position.y = 0.4; m.add(ring);
      const top = new T.Mesh(new T.TorusGeometry(1.1, 0.12, 6, 24), lam(0x8a7a64)); top.rotation.x = Math.PI / 2; top.position.y = 0.8; m.add(top); const hole = new T.Mesh(new T.CircleGeometry(1.0, 20), new T.MeshBasicMaterial({ color: 0x111111 })); hole.rotation.x = -Math.PI / 2; hole.position.y = 0.3; m.add(hole);
      B(m, 0.12, 2.0, 0.12, 0x6b4a2a, -1.1, 1.0, 0); B(m, 0.12, 2.0, 0.12, 0x6b4a2a, 1.1, 1.0, 0); B(m, 2.4, 0.14, 0.14, 0x6b4a2a, 0, 2.0, 0);
      const pump = new T.Group(); pump.position.set(1.9, 0, 0); m.add(pump); B(pump, 0.9, 1.1, 0.9, 0x2a6ad6, 0, 0.55, 0); B(pump, 1.0, 0.12, 1.0, 0x1d3a7a, 0, 1.15, 0); Cy(pump, 0.22, 0.22, 0.25, 0xd0d0d0, 0, 0.6, 0.48, { r: [Math.PI / 2, 0, 0] }); Sp(pump, 0.07, 0x3ddc6a, 0.3, 0.9, 0.46, { basic: true });
      Cy(m, 0.09, 0.09, 1.6, 0x8a8f98, 1.05, 0.3, 0, { r: [0, 0, Math.PI / 2] }); return { m, pump }; };
    const W1 = well(0, -4), W2 = well(9, 3);
    const pipe = Cy(g, 0.1, 0.1, 6.2, 0x8a8f98, 3.6, 0.2, -5.8, { r: [Math.PI / 2, 0, 0.0] }); pipe.rotation.set(Math.PI / 2, 0, -0.78); pipe.position.set(3.6, 0.2, -5.6); pipe.scale.y = 0.75;
    const tower = new T.Group(); tower.position.set(5, 0, -7.5); g.add(tower); for (const sx of [-1, 1]) for (const sz of [-1, 1]) B(tower, 0.16, 3.4, 0.16, 0x6b4a2a, sx * 0.9, 1.7, sz * 0.9);
    B(tower, 2.1, 0.15, 2.1, 0x6b4a2a, 0, 3.35, 0); Cy(tower, 1.25, 1.25, 1.8, 0x3a3f48, 0, 4.3, 0); Cy(tower, 1.3, 1.3, 0.15, 0x2a2e35, 0, 5.25, 0); Cy(tower, 0.1, 0.1, 3.4, 0x8a8f98, 1.0, 1.7, 0.6);
    const lvlBg = B(tower, 0.25, 1.5, 0.06, 0x111111, 0, 4.3, 1.27); const lvl = B(tower, 0.18, 1.0, 0.07, 0x38d6ff, 0, 4.3, 1.28, { basic: true });
    // monte de areia na bomba
    const clogM = new T.Mesh(new T.SphereGeometry(1, 16, 10), lam(0xd8ac6a)); clogM.position.set(1.9, 0, -4); g.add(clogM);
    // jato d'água
    const jetMat = new T.MeshBasicMaterial({ color: 0xbfeaff, transparent: true, opacity: 0.75, depthWrite: false }); const jet = new T.Mesh(new T.CylinderGeometry(0.12, 0.3, 1, 10, 1, true), jetMat); g.add(jet);
    const drops = []; for (let i = 0; i < 40; i++) { const d = new T.Mesh(new T.SphereGeometry(0.09, 6, 5), jetMat); g.add(d); drops.push(d); }
    // ===== VILA =====
    const houses = [], moreH = [];
    const house = (x, z, w, d, h, col, arr) => { const m = new T.Group(); m.position.set(x, 0, z); g.add(m); B(m, w, h, d, col, 0, h / 2, 0); B(m, w + 0.2, 0.2, d + 0.2, 0xb88a58, 0, h + 0.05, 0);
      B(m, 0.9, 1.7, 0.06, 0x5a3a22, -w * 0.2, 0.85, d / 2 + 0.03); const win = new T.Mesh(new T.BoxGeometry(0.7, 0.6, 0.06), new T.MeshBasicMaterial({ color: 0x3a2a1a })); win.position.set(w * 0.25, h * 0.6, d / 2 + 0.03); m.add(win);
      for (let i = 0; i < 3; i++) Cy(m, 0.07, 0.07, 0.8, 0x7a5a38, -w / 2 + 0.5 + i * (w - 1) / 2, h * 0.85, d / 2 + 0.35, { r: [Math.PI / 2, 0, 0] });
      arr.push({ m, win }); return m; };
    const HC = [0xd9b080, 0xe0bc8c, 0xcfa070, 0xe6c49a];
    [[8, -10, 4, 3.6, 2.6], [13, -9, 3.6, 3.4, 2.4], [18, -10.5, 4.2, 3.8, 2.8], [9, -16, 3.6, 3.4, 2.5], [14.5, -15.5, 4, 3.6, 2.7], [20, -17, 3.6, 3.2, 2.4]].forEach((a, i) => house(...a, HC[i % 4], houses));
    [[26, -9, 4, 3.6, 2.6], [26, -16, 4, 3.6, 3.2], [8, -22, 4, 3.4, 2.6], [14, -22, 4.4, 3.6, 3.4], [20, -23, 4, 3.4, 2.6], [-6, -16, 4, 3.6, 2.8], [-1, -17, 3.6, 3.4, 2.5], [30, -1, 4, 3.6, 2.6]].forEach((a, i) => house(...a, HC[(i + 1) % 4], moreH));
    // tenda (refeitório)
    const tent = new T.Group(); tent.position.set(14, 0, 6); g.add(tent);
    for (const sx of [-1, 1]) for (const sz of [-1, 0, 1]) Cy(tent, 0.08, 0.08, 3.2, 0x6b4a2a, sx * 4, 1.6, sz * 3);
    const roofT = cvs(128, 64, (x, w, h) => { for (let i = 0; i < 8; i++) { x.fillStyle = i % 2 ? '#f4efe4' : '#c8402a'; x.fillRect(i * w / 8, 0, w / 8, h); } });
    for (const sz of [-1, 1]) { const r = new T.Mesh(new T.PlaneGeometry(8.6, 3.6), new T.MeshLambertMaterial({ map: roofT, side: T.DoubleSide })); r.position.set(0, 3.75, sz * 1.62); r.rotation.x = -Math.PI / 2 + sz * 0.42; tent.add(r); }
    B(tent, 0.06, 3.2, 6.2, 0xf4efe4, 4.03, 1.6, 0); B(tent, 8.2, 3.1, 0.06, 0xf4efe4, 0, 1.55, -3.05);
    B(tent, 5, 0.1, 1.2, 0x8a5a30, 0.5, 0.8, 0); for (const sx of [-2, 0, 2]) B(tent, 0.1, 0.8, 0.1, 0x6b4a2a, 0.5 + sx * 1.1, 0.4, 0);
    const bulbs = []; for (let i = 0; i < 6; i++) bulbs.push(Sp(tent, 0.1, 0xfff2c0, -3 + i * 1.2, 3.0, 0, { basic: true }));
    const tl = new T.PointLight(0xffc880, 0, 18); tl.position.set(14, 2.6, 6); g.add(tl);
    // ===== PAINÉIS SOLARES =====
    const panels = new T.Group(); g.add(panels); const pMat = new T.MeshLambertMaterial({ color: 0x1d3a7a }); const wetDots = [];
    for (let r = 0; r < 4; r++) for (let k = 0; k < 5; k++) { const x = -33 + k * 2.8, z = -19 + r * 3.0; Cy(panels, 0.06, 0.06, 1.1, 0x555a62, x, 0.55, z); const p = new T.Mesh(new T.BoxGeometry(2.5, 0.06, 1.6), pMat); p.position.set(x, 1.2, z); p.rotation.x = -0.5; panels.add(p);
      for (let j = 0; j < 6; j++) { const d = new T.Mesh(new T.SphereGeometry(0.05, 5, 4), new T.MeshBasicMaterial({ color: 0xdff6ff })); d.position.set(x - 1.1 + R() * 2.2, 1.2 + 0.05 + (R() - 0.5) * 0.4, z + (R() - 0.5) * 0.6); panels.add(d); wetDots.push(d); } }
    // ===== REDES DE ORVALHO =====
    const netT = cvs(128, 128, (x, w, h) => { x.clearRect(0, 0, w, h); x.strokeStyle = 'rgba(30,40,50,.85)'; x.lineWidth = 2; for (let i = 0; i <= 16; i++) { x.beginPath(); x.moveTo(i * 8, 0); x.lineTo(i * 8, h); x.stroke(); x.beginPath(); x.moveTo(0, i * 8); x.lineTo(w, i * 8); x.stroke(); } });
    netT.wrapS = netT.wrapT = T.RepeatWrapping; netT.repeat.set(3, 2);
    const nets = new T.Group(); g.add(nets); const netPl = [];
    for (let i = 0; i < 4; i++) { const x = -14 + i * 3.0; B(nets, 0.1, 2.6, 0.1, 0x6b4a2a, x - 1.25, 1.3, 9); B(nets, 0.1, 2.6, 0.1, 0x6b4a2a, x + 1.25, 1.3, 9);
      const pl = new T.Mesh(new T.PlaneGeometry(2.4, 1.6), new T.MeshBasicMaterial({ map: netT, transparent: true, side: T.DoubleSide, depthWrite: false })); pl.position.set(x, 1.6, 9); nets.add(pl); netPl.push(pl);
      Cy(nets, 0.25, 0.2, 0.4, 0x2a6ad6, x, 0.2, 9.25); B(nets, 2.4, 0.06, 0.12, 0x8a8f98, x, 0.78, 9.12); }
    // ===== HORTA =====
    const plants = []; for (let r = 0; r < 4; r++) { B(g, 9, 0.12, 0.9, 0x7a5232, 1, 0.06, 7.5 + r * 1.6); for (let k = 0; k < 10; k++) { const s = Sp(g, 0.28, k % 3 ? 0x3aa843 : 0x5ac24a, -3 + k * 0.9, 0.25, 7.5 + r * 1.6); plants.push(s); } }
    // ===== ROCHA COM PINTURA =====
    const artT = cvs(256, 128, (x, w, h) => { x.fillStyle = '#9a6a4a'; x.fillRect(0, 0, w, h); const r2 = rng(5); for (let i = 0; i < 200; i++) { x.fillStyle = `rgba(${r2() < .5 ? '60,35,25' : '190,150,120'},.15)`; x.fillRect(r2() * w, r2() * h, 6, 3); }
      x.fillStyle = '#f2e2c8'; x.strokeStyle = '#f2e2c8'; x.lineWidth = 3;
      const gir = (gx, gy) => { x.beginPath(); x.ellipse(gx, gy, 16, 8, 0, 0, 7); x.fill(); x.beginPath(); x.moveTo(gx + 12, gy - 4); x.lineTo(gx + 22, gy - 34); x.stroke(); x.beginPath(); x.ellipse(gx + 24, gy - 36, 5, 3, 0, 0, 7); x.fill(); for (const lx of [-10, -4, 6, 12]) { x.beginPath(); x.moveTo(gx + lx, gy + 4); x.lineTo(gx + lx, gy + 22); x.stroke(); } };
      gir(50, 70); gir(110, 60); x.fillStyle = '#c8402a'; x.strokeStyle = '#c8402a';
      for (let i = 0; i < 5; i++) { const px = 150 + i * 18, py = 92; x.beginPath(); x.arc(px, py - 22, 4, 0, 7); x.fill(); x.beginPath(); x.moveTo(px, py - 18); x.lineTo(px, py); x.lineTo(px - 5, py + 12); x.moveTo(px, py); x.lineTo(px + 5, py + 12); x.moveTo(px - 7, py - 12); x.lineTo(px + 7, py - 8); x.stroke(); }
      x.fillStyle = '#e8d0a0'; x.beginPath(); x.ellipse(200, 40, 22, 10, 0, 0, 7); x.fill(); for (const lx of [-12, 12]) { x.fillRect(200 + lx, 46, 4, 12); } x.fillRect(176, 34, 6, 6); });
    const rock = new T.Group(); rock.position.set(-26, 0, 16); g.add(rock); const rk = new T.Mesh(new T.DodecahedronGeometry(3, 0), lam(0x8a5a3a)); rk.scale.set(1.5, 0.9, 0.8); rk.position.y = 1.6; rock.add(rk);
    const face = new T.Mesh(new T.PlaneGeometry(4.2, 2.1), new T.MeshLambertMaterial({ map: artT })); face.position.set(0, 1.7, 2.05); rock.add(face);
    // ===== CAMINHÕES =====
    const trucks = new T.Group(); g.add(trucks); const TC = [0xd62828, 0xf2f2f2, 0x2a6ad6];
    for (let i = 0; i < 3; i++) { const tk = new T.Group(); tk.position.set(-i * 11, 0, 0); trucks.add(tk); B(tk, 2.2, 2.0, 2.3, TC[i], 3.4, 1.5, 0); B(tk, 0.06, 0.9, 1.9, 0x9fd6ff, 4.52, 1.9, 0, { basic: true }); B(tk, 5.6, 2.6, 2.4, 0xc8b48a, -0.6, 1.9, 0); B(tk, 8, 0.3, 2.2, 0x2a2e35, 0.4, 0.5, 0);
      for (const wx of [3.2, -1.0, -2.6]) for (const sz of [-1, 1]) Cy(tk, 0.5, 0.5, 0.35, 0x1a1a1a, wx, 0.5, sz * 1.15, { r: [Math.PI / 2, 0, 0] }); }
    // ===== SAARA VERDE (árvores extras) e MURALHA VERDE =====
    const lushG = new T.Group(); g.add(lushG); for (let i = 0; i < 40; i++) { const a = R() * 6.28, r = 14 + R() * 40; const x = Math.cos(a) * r, z = Math.sin(a) * r - 5; if (Math.abs(x) < 8 && Math.abs(z + 4) < 8) continue; const tr = new T.Group(); tr.position.set(x, 0, z); lushG.add(tr); Cy(tr, 0.15, 0.22, 2.2, 0x6b4a2a, 0, 1.1, 0); Sp(tr, 1.4 + R() * 0.8, i % 2 ? 0x4a8a2a : 0x5a9a3a, 0, 2.8, 0, { s: [1.3, 0.7, 1.3] }); }
    const wallT = new T.Group(); g.add(wallT); const wallTrees = []; for (let i = 0; i < 46; i++) { const x = -45 + i * 2 + (R() - 0.5), z = -32 + (i % 2) * 1.6; const tr = new T.Group(); tr.position.set(x, 0, z); wallT.add(tr); Cy(tr, 0.12, 0.18, 2.2, 0x6b4a2a, 0, 1.1, 0); Sp(tr, 1.2 + R() * 0.5, i % 3 ? 0x4a8a2a : 0x3a7a2a, 0, 2.7, 0, { s: [1.1, 0.9, 1.1] }); wallTrees.push(tr); }
    // ===== PAREDE DE AREIA (haboob) =====
    const wallTex = cvs(512, 256, (x, w, h) => { const gr = x.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, 'rgba(160,100,50,0)'); gr.addColorStop(0.25, 'rgba(170,110,60,.85)'); gr.addColorStop(1, 'rgba(140,85,40,1)'); x.fillStyle = gr; x.fillRect(0, 0, w, h);
      const r2 = rng(3); for (let i = 0; i < 60; i++) { const cx = r2() * w, cy = h * 0.2 + r2() * h * 0.25, rr = 20 + r2() * 40; const g2 = x.createRadialGradient(cx, cy, 0, cx, cy, rr); g2.addColorStop(0, 'rgba(185,125,70,.9)'); g2.addColorStop(1, 'rgba(185,125,70,0)'); x.fillStyle = g2; x.beginPath(); x.arc(cx, cy, rr, 0, 7); x.fill(); } });
    const haboob = new T.Group(); g.add(haboob); for (let i = 0; i < 3; i++) { const m = new T.Mesh(new T.PlaneGeometry(1600, 150), new T.MeshBasicMaterial({ map: wallTex, transparent: true, depthWrite: false, fog: false, side: T.DoubleSide })); m.position.set((i - 1) * 60, 62, -i * 25); haboob.add(m); }
    // ===== AREIA VOANDO =====
    const NS = 2200; const sp = new Float32Array(NS * 3); for (let i = 0; i < NS; i++) sp.set([(R() - 0.5) * 90, R() * 14, (R() - 0.5) * 70 - 4], i * 3); const sgeo = new T.BufferGeometry(); sgeo.setAttribute('position', new T.BufferAttribute(sp, 3)); const sp0 = sp.slice();
    const grains = new T.Points(sgeo, new T.PointsMaterial({ color: 0xc89058, size: 3, sizeAttenuation: false, transparent: true, opacity: 0.8 })); grains.frustumCulled = false; g.add(grains);
    // ===== ESTRELAS =====
    const N = 1400; const stp = new Float32Array(N * 3); for (let i = 0; i < N; i++) { const v = new T.Vector3(R() * 2 - 1, R() * 0.9 + 0.06, R() * 2 - 1).normalize().multiplyScalar(560); stp.set([v.x, v.y, v.z], i * 3); } const stg = new T.BufferGeometry(); stg.setAttribute('position', new T.BufferAttribute(stp, 3));
    const stars = new T.Points(stg, new T.PointsMaterial({ color: 0xffffff, size: 2.2, sizeAttenuation: false, fog: false, transparent: true })); stars.frustumCulled = false; g.add(stars);
    const winLit = []; houses.concat(moreH).forEach(h => winLit.push(h.win));
    const mixC = (a, b, k) => new T.Color(a).lerp(new T.Color(b), k).getHex();
    return { bg: 0xf0d9b0, fog: [0xf0d9b0, 120, 700], hemi: [0xffffff, 0xd8b890, 1.1], sun: [0xfff2dc, 1.0, [40, 50, 20]],
      apply(p, t) { const s = p.storm || 0; const tod = p.tod || 'day'; const night = tod === 'night', dusk = tod === 'dusk', dawn = tod === 'dawn'; const lush = p.lush || 0;
        const top = night ? 0x030818 : dusk ? 0x3a3f8a : dawn ? 0x5a78c0 : 0x3a8ae0, hor = night ? 0x10183a : dusk ? 0xff9a52 : dawn ? 0xffc9a0 : 0xf4e2c0;
        const stormC = 0xa8682e; sk.userData.set(mixC(top, night ? 0x2a1608 : stormC, s), mixC(hor, night ? 0x3a2410 : 0xc08040, s));
        const bg = mixC(night ? 0x0a1028 : dusk ? 0xc08a70 : dawn ? 0xe8c0a0 : 0xf0d9b0, night ? 0x2a1a0a : 0xb07438, s); this.bg = bg; this.fog = [bg, 120 - s * 112, 700 - s * 660];
        this.hemi = [night ? 0x7a90d0 : dusk ? 0xffc8a0 : dawn ? 0xffd8c0 : 0xffffff, night ? 0x1a2238 : mixC(0xd8b890, 0x8a5a30, s), (night ? 0.5 : dusk || dawn ? 0.85 : 1.1) * (1 - 0.35 * s)];
        this.sun = [night ? 0x8fa6ff : dusk ? 0xff9a62 : dawn ? 0xffb080 : 0xfff2dc, (night ? 0.2 : dusk || dawn ? 0.75 : 1.0) * (1 - 0.7 * s), dusk ? [-50, 12, 30] : dawn ? [50, 12, 20] : [40, 50, 20]];
        gm.color.set(mixC(0xffffff, 0x9ac070, lush)); grass.scale.set(9 + lush * 20, 7 + lush * 14, 1); lake.scale.set(6 + lush * 14, 4 + lush * 9, 1); lushG.visible = lush > 0.01; lushG.children.forEach(c => c.scale.setScalar(Math.max(0.01, lush)));
        wm.color.set(night ? 0x0a2a4a : 0x2a9ac8);
        const vil = p.village !== false; houses.forEach(h => h.m.visible = vil); tent.visible = vil; tower.visible = vil; W1.m.visible = vil; pipe.visible = vil; nets.visible = vil && (p.nets || 0) > 0.01; plants.forEach(pl => { pl.visible = vil && (p.plant ?? 1) > 0.01; pl.scale.setScalar(Math.max(0.01, p.plant ?? 1)); });
        nets.position.y = -2.7 * (1 - (p.nets || 0));
        moreH.forEach(h => h.m.visible = !!p.more); W2.m.visible = !!p.well2;
        const pw = p.power ?? 1; const lit = (night || dusk || s > 0.4) ? pw : 0; winLit.forEach(w => w.material.color.set(mixC(0x3a2a1a, 0xffc868, lit))); bulbs.forEach(b => b.material.color.set(lit > 0.3 ? 0xfff2c0 : 0x5a5040)); tl.intensity = 30 * lit;
        panels.visible = p.panels !== false; const du = p.dust || 0; pMat.color.set(mixC(0x1d3a7a, 0xd8ac6a, du)); const we = p.wet || 0; wetDots.forEach((d, i) => { d.visible = we > 0.01 && (i % 10) / 10 < we; d.material.color.set(0xdff6ff); d.scale.setScalar(0.8 + 0.4 * Math.sin(t * 3 + i)); });
        const cl = p.clog || 0; clogM.visible = cl > 0.01; clogM.scale.set(0.4 + cl * 1.1, 0.2 + cl * 1.3, 0.4 + cl * 1.1);
        const lv = p.tank ?? 0.8; lvl.scale.y = Math.max(0.02, lv * 1.4); lvl.position.y = 4.3 - 0.7 + lv * 0.7; lvl.material.color.set(lv < 0.25 ? 0xff3b30 : 0x38d6ff);
        const jt = p.jet || 0; jet.visible = jt > 0.01; const jh = 4 * jt + Math.sin(t * 20) * 0.15 * jt; jet.scale.set(1, jh, 1); jet.position.set(0, 0.6 + jh / 2, -4);
        drops.forEach((d, i) => { d.visible = jt > 0.01; const ph = (t * 0.9 + i / 40) % 1, a = i * 2.399; const r = ph * 2.2; d.position.set(Math.cos(a) * r, 0.6 + jh * (1 - Math.pow(ph * 2 - 1, 2)) * 0.95 + 0.2, -4 + Math.sin(a) * r); });
        const tk = p.trucks; trucks.visible = !!tk; if (tk) trucks.position.set(tk.x ?? 0, Math.sin(t * 9) * 0.03, tk.z ?? 22);
        const tw = p.trees || 0; wallT.visible = tw > 0.01; wallTrees.forEach((w, i) => w.scale.setScalar(Math.max(0.01, Math.min(1, tw * 1.6 - (i % 7) * 0.08))));
        const wl = p.wall || 0; haboob.visible = wl > 0.01 && wl < 0.999; haboob.position.set(0, 0, lerp(-650, -30, wl)); haboob.children.forEach((m, i) => { m.position.y = 62 + Math.sin(t * 0.7 + i) * 3; });
        palms.forEach(q => { q.tr.rotation.z = Math.sin(t * 1.3 + q.ph) * (0.015 + s * 0.12) + s * 0.12; q.leaves.forEach((l, k) => { l.rotation.z = -0.5 + Math.sin(t * (2 + s * 8) + k + q.ph) * (0.05 + s * 0.25); }); });
        grains.visible = s > 0.01; grains.material.opacity = 0.85 * Math.min(1, s * 1.3); grains.material.size = 2 + s * 3;
        if (s > 0.01) { const wind = 4 + s * 30; for (let i = 0; i < NS; i++) { if (i > NS * (0.2 + 0.8 * s)) { sp[i * 3 + 1] = -50; continue; } sp[i * 3 + 1] = ((sp0[i * 3 + 1] + Math.sin(t * 2 + i) * 0.3) % 14 + 14) % 14; sp[i * 3] = ((sp0[i * 3] + t * wind * (0.7 + (i % 5) * 0.15) + 45) % 90 + 90) % 90 - 45; } sgeo.attributes.position.needsUpdate = true; }
        stars.visible = (night && s < 0.5) || !!p.stars; stars.material.opacity = night ? 1 - s : 0.5; } };
  });
}
function lerp(a, b, t) { return a + (b - a) * t; }
