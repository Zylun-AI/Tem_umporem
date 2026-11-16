// Cenários extras pensados para os shorts (estilo jogos de Roblox): casa, avião (cabine e céu),
// oceano com navio, parque, baseplate. Todos centrados na origem, chão em y=0.
export function moreEnvs(U) {
  const { THREE, B, Cy, Sp, Pl, cvs, mkEnv, rng, sky, lam, hex } = U;
  const T = THREE;
  const rep = (t, a, b) => { t.wrapS = t.wrapT = T.RepeatWrapping; t.repeat.set(a, b); return t; };
  const plank = (c1, c2) => cvs(256, 256, (x, w, h) => { x.fillStyle = hex(c1); x.fillRect(0, 0, w, h); x.strokeStyle = hex(c2); x.lineWidth = 3; for (let i = 0; i <= 8; i++) { x.beginPath(); x.moveTo(0, i * 32); x.lineTo(w, i * 32); x.stroke(); for (let j = 0; j < 2; j++) { const xx = ((i * 97 + j * 131) % 256); x.beginPath(); x.moveTo(xx, i * 32); x.lineTo(xx, i * 32 + 32); x.stroke(); } } });
  const studs = (c) => cvs(128, 128, (x, w, h) => { x.fillStyle = hex(c); x.fillRect(0, 0, w, h); x.strokeStyle = 'rgba(0,0,0,.12)'; x.lineWidth = 2; x.strokeRect(1, 1, w - 2, h - 2); x.fillStyle = 'rgba(255,255,255,.10)'; x.beginPath(); x.arc(64, 64, 26, 0, 7); x.fill(); });
  const tree = (g, x, z, s = 1, c = 0x3f9b3a) => { Cy(g, 0.18 * s, 0.24 * s, 2.2 * s, 0x7a4f2a, x, 1.1 * s, z); Sp(g, 1.3 * s, c, x, 2.9 * s, z, { s: [1, 0.9, 1] }); Sp(g, 0.9 * s, c, x + 0.6 * s, 2.4 * s, z + 0.3 * s); };
  const cloud = (g, x, y, z, s = 1) => { for (let i = 0; i < 5; i++) Sp(g, (1.2 + (i % 2) * 0.6) * s, 0xffffff, x + (i - 2) * 1.3 * s, y + (i % 2) * 0.5 * s, z, { m: { emissive: 0x888888 } }); };

  // ================= CASA (sala + cozinha) =================
  mkEnv('house', (g) => {
    Pl(g, 16, 12, new T.MeshLambertMaterial({ map: rep(plank(0xb07a4a, 0x8a5a32), 4, 3) }), 0, 0, 0, [-Math.PI / 2, 0, 0]);
    const wall = 0xe9dfcf; B(g, 16, 3.6, 0.2, wall, 0, 1.8, -6); B(g, 0.2, 3.6, 12, wall, -8, 1.8, 0); B(g, 0.2, 3.6, 12, wall, 8, 1.8, 0); B(g, 16, 0.2, 12, 0xf7f3ec, 0, 3.6, 0);
    B(g, 16, 0.25, 0.25, 0xffffff, 0, 0.12, -5.85);                                           // rodapé
    // janela
    B(g, 3.2, 2.0, 0.08, 0x9fd6ff, -3, 2.0, -5.88, { basic: true }); B(g, 3.4, 0.12, 0.15, 0xffffff, -3, 3.0, -5.85); B(g, 3.4, 0.12, 0.15, 0xffffff, -3, 1.0, -5.85); B(g, 0.12, 2.0, 0.15, 0xffffff, -3, 2.0, -5.85);
    // porta
    const door = new T.Group(); door.position.set(7.88, 0, 2.5); g.add(door); B(door, 0.1, 2.6, 1.3, 0x7a4a26, 0, 1.3, 0.65); Sp(door, 0.07, 0xf2c94c, -0.1, 1.25, 1.15);
    // sofá
    B(g, 3.6, 0.5, 1.2, 0x3e6fb0, 0, 0.45, 2.2); B(g, 3.6, 0.9, 0.3, 0x355f99, 0, 0.9, 2.75); B(g, 0.3, 0.7, 1.2, 0x355f99, -1.95, 0.6, 2.2); B(g, 0.3, 0.7, 1.2, 0x355f99, 1.95, 0.6, 2.2);
    B(g, 1.6, 0.06, 0.8, 0x6b4423, 0, 0.45, 0.6); for (const sx of [-0.7, 0.7]) for (const sz of [0.25, 0.95]) B(g, 0.06, 0.42, 0.06, 0x6b4423, sx, 0.21, sz);   // mesa de centro
    // TV
    B(g, 2.8, 0.6, 0.6, 0x5b3a22, 0, 0.3, -5.4); const tv = B(g, 2.4, 1.4, 0.08, 0x111111, 0, 1.4, -5.55); const scr = B(g, 2.25, 1.25, 0.02, 0x2a6fd6, 0, 1.4, -5.5, { basic: true });
    // tapete, quadro, luminária
    Pl(g, 4, 2.6, new T.MeshLambertMaterial({ color: 0xc94f4f }), 0, 0.01, 1.2, [-Math.PI / 2, 0, 0]); B(g, 1.4, 1.0, 0.05, 0xf2c94c, 3.5, 2.2, -5.88); B(g, 1.2, 0.8, 0.06, 0x58a55c, 3.5, 2.2, -5.85, { basic: true });
    Cy(g, 0.05, 0.05, 1.6, 0x333333, -3.2, 0.8, 2.6); Cy(g, 0.3, 0.45, 0.4, 0xfff2c0, -3.2, 1.75, 2.6);
    // cozinha (lado esquerdo)
    B(g, 0.8, 1.0, 4.5, 0xffffff, -7.5, 0.5, -2.5); B(g, 0.85, 0.08, 4.5, 0x444444, -7.5, 1.02, -2.5); B(g, 0.9, 2.1, 1.0, 0xdadfe6, -7.45, 1.05, 0.6); B(g, 0.05, 0.6, 0.05, 0x888888, -7.0, 1.4, 0.3);
    B(g, 1.4, 0.06, 1.0, 0xffffff, -5, 0.95, -2.8); for (const sx of [-0.6, 0.6]) for (const sz of [-0.4, 0.4]) B(g, 0.06, 0.92, 0.06, 0x999999, -5 + sx, 0.46, -2.8 + sz);
    // cadeira
    B(g, 0.6, 0.06, 0.6, 0x6b4423, -5, 0.5, -1.9); B(g, 0.6, 0.6, 0.06, 0x6b4423, -5, 0.8, -1.6); for (const sx of [-0.25, 0.25]) for (const sz of [-0.25, 0.25]) B(g, 0.05, 0.5, 0.05, 0x6b4423, -5 + sx, 0.25, -1.9 + sz);
    return { bg: 0xcfe8ff, hemi: [0xffffff, 0x9a8a78, 1.15], sun: [0xfff4e0, 0.75, [-6, 12, 8]], apply(p) { door.rotation.y = -(p.door || 0) * 1.4; scr.material.color.set(p.tv === false ? 0x111111 : (p.tvColor || 0x2a6fd6)); } };
  });

  // ================= AVIÃO: CABINE =================
  // Corredor ao longo de z (frente = -z), largo para personagens Roblox.
  // Assentos (exportados em userData): x = ±1.15 e ±2.0; fileiras z = 6 - r*1.4 (r = 0..12). Cabine do piloto atrás da porta em z ≈ -13.
  mkEnv('plane', (g) => {
    const L = 26, RAD = 3.6; const cab = new T.Mesh(new T.CylinderGeometry(RAD, RAD, L, 32, 1, true), new T.MeshLambertMaterial({ color: 0xf2f2f0, side: T.BackSide })); cab.rotation.x = Math.PI / 2; cab.position.set(0, 1.9, -3); g.add(cab);
    B(g, 6.8, 0.1, L, 0x3c4a6b, 0, -0.05, -3); B(g, 1.3, 0.02, L, 0x8a2433, 0, 0.01, -3);
    B(g, 5.5, 0.3, L, 0xe8e8e8, 0, 4.0, -3); for (const sx of [-1, 1]) B(g, 1.2, 0.6, L, 0xdcdcdc, sx * 2.3, 3.45, -3);
    const win = cvs(64, 64, (x, w, h) => { x.fillStyle = '#e8e8e8'; x.fillRect(0, 0, w, h); x.fillStyle = '#8fd0ff'; x.beginPath(); x.roundRect(14, 8, 36, 48, 14); x.fill(); });
    const rows = []; for (let r = 0; r < 13; r++) rows.push(6 - r * 1.4);
    for (const z of rows) for (const sx of [-1, 1]) Pl(g, 0.6, 0.6, new T.MeshBasicMaterial({ map: win }), sx * 3.2, 2.0, z, [0, -sx * Math.PI / 2, 0]);
    const seat = (x, z, c) => { B(g, 0.8, 0.15, 0.75, c, x, 0.5, z); B(g, 0.8, 1.1, 0.16, c, x, 1.05, z + 0.4, { r: [-0.12, 0, 0] }); B(g, 0.6, 0.2, 0.12, 0xdddddd, x, 1.6, z + 0.47); B(g, 0.1, 0.4, 0.6, 0x555555, x - 0.43, 0.4, z); };
    for (const z of rows) for (const x of [-2.0, -1.15, 1.15, 2.0]) seat(x, z, 0x24407a);
    const zw = 6 - 13 * 1.4 + 0.4;   // parede da cabine do piloto
    B(g, 2.6, 4, 0.15, 0xd8d8d8, -2.1, 2, zw); B(g, 2.6, 4, 0.15, 0xd8d8d8, 2.1, 2, zw); B(g, 1.6, 1.2, 0.15, 0xd8d8d8, 0, 3.4, zw); const cd = B(g, 1.3, 2.8, 0.08, 0xbfbfbf, 0, 1.4, zw + 0.05);
    B(g, 4.4, 1.1, 0.9, 0x2b2f38, 0, 1.0, zw - 3.0); for (let i = 0; i < 6; i++) B(g, 0.45, 0.3, 0.02, i % 2 ? 0x3ddc6a : 0x38a0ff, -1.4 + i * 0.56, 1.35, zw - 2.54, { basic: true });
    B(g, 4.6, 1.5, 0.05, 0x9fd6ff, 0, 2.3, zw - 3.6, { basic: true }); B(g, 6.6, 4, 0.1, 0xdcdcdc, 0, 2, zw - 3.7);
    for (const sx of [-1.0, 1.0]) { B(g, 0.8, 0.15, 0.75, 0x3a3a3a, sx, 0.5, zw - 1.8); B(g, 0.8, 1.1, 0.16, 0x3a3a3a, sx, 1.05, zw - 1.4); }
    B(g, 6.8, 0.1, 4, 0x2b2b2b, 0, -0.04, zw - 2); B(g, 6.8, 0.2, 4, 0xe0e0e0, 0, 3.9, zw - 2); B(g, 0.15, 4, 4, 0xd0d0d0, -3.3, 2, zw - 2); B(g, 0.15, 4, 4, 0xd0d0d0, 3.3, 2, zw - 2);
    g.userData = { rows, seatsX: [-2.0, -1.15, 1.15, 2.0], seatY: 0.5, cockpitZ: zw - 1.8, doorZ: zw };
    return { bg: 0xffffff, hemi: [0xffffff, 0x8a8f9a, 1.2], sun: [0xffffff, 0.6, [4, 10, 6]], apply(p, t) { cd.position.x = (p.cockpitOpen || 0) * 1.25; g.rotation.z = (p.tilt || 0) + (p.shake ? Math.sin(t * 23) * 0.012 * p.shake : 0); g.rotation.x = p.pitch || 0; } };
  });

  // ================= CÉU (avião voando por fora) =================
  // avião em userData.plane; mova com p.plane = {x,y,z,ry,rz,rx}
  mkEnv('sky', (g) => {
    const sk = sky(g); sk.userData.set(0x2f86e8, 0xcfe9ff);
    const ground = new T.Mesh(new T.PlaneGeometry(4000, 4000), new T.MeshLambertMaterial({ color: 0x6aa84f })); ground.rotation.x = -Math.PI / 2; ground.position.y = -400; g.add(ground);
    const R = rng(5); const clouds = new T.Group(); g.add(clouds); for (let i = 0; i < 40; i++) cloud(clouds, (R() - 0.5) * 400, -40 + R() * 80, -R() * 400 + 60, 2 + R() * 4);
    const P = new T.Group(); g.add(P);
    const body = new T.Mesh(new T.CapsuleGeometry(1.6, 16, 8, 20), lam(0xffffff)); body.rotation.x = Math.PI / 2; P.add(body);
    B(P, 0.2, 0.6, 15.5, 0x1f5fbf, 0, -0.9, 0); const nose = new T.Mesh(new T.SphereGeometry(1.0, 12, 8), lam(0x2a2a2a)); nose.position.set(0, 0.55, -9.2); nose.scale.set(1.2, 0.5, 0.6); P.add(nose);
    B(P, 24, 0.25, 3.2, 0xe6e6e6, 0, -0.5, 0.5); B(P, 8, 0.2, 1.8, 0xe6e6e6, 0, 0.3, 8.3); B(P, 0.25, 3.4, 2.4, 0x1f5fbf, 0, 1.9, 8.3);
    for (const sx of [-5.5, 5.5]) { const e = new T.Mesh(new T.CylinderGeometry(0.75, 0.75, 2.6, 14), lam(0xb8b8b8)); e.rotation.x = Math.PI / 2; e.position.set(sx, -1.4, -0.4); P.add(e); }
    for (let z = -7; z < 7; z += 1.1) for (const sx of [-1, 1]) { const w = B(P, 0.05, 0.35, 0.3, 0x234466, sx * 1.58, 0.35, z); }
    g.userData.plane = P;
    return { bg: 0x8ec8ff, fog: [0xcfe9ff, 200, 900], hemi: [0xffffff, 0x88aacc, 1.15], sun: [0xffffff, 0.9, [30, 60, 20]], apply(p, t) { const q = p.plane || {}; P.position.set(q.x || 0, q.y || 0, q.z || 0); P.rotation.set(q.rx || 0, q.ry || 0, q.rz || 0, 'YXZ'); clouds.position.z = (t * (p.cloudSpeed ?? 30)) % 400; } };
  });

  // ================= OCEANO + NAVIO =================
  // p.night (bool), p.sink 0..1 (inclina e afunda o navio), p.ship (bool), p.ice (bool), p.boat {x,z} bote salva-vidas
  mkEnv('ocean', (g) => {
    const sk = sky(g); const W = new T.PlaneGeometry(400, 400, 70, 70); const wm = new T.MeshLambertMaterial({ color: 0x1f8fe0 }); const water = new T.Mesh(W, wm); water.rotation.x = -Math.PI / 2; g.add(water);
    const base = W.attributes.position.array.slice();
    const ship = new T.Group(); ship.position.set(0, 0, -40); g.add(ship); const S = new T.Group(); ship.add(S);
    B(S, 7, 6, 60, 0x141414, 0, 1, 0); B(S, 7.05, 1.2, 60.1, 0xb3261e, 0, -1.6, 0); B(S, 6.6, 0.3, 58, 0xc8a26b, 0, 4.15, 0);
    B(S, 6, 2.6, 40, 0xf2f2f2, 0, 5.5, 2); B(S, 5, 2.2, 30, 0xf2f2f2, 0, 7.9, 3);
    for (let i = 0; i < 4; i++) { Cy(S, 1.1, 1.2, 5.5, 0xf0b23a, 0, 11.5, -10 + i * 8); Cy(S, 1.12, 1.12, 1.2, 0x141414, 0, 13.7, -10 + i * 8); }
    for (let z = -26; z < 28; z += 2) for (const sx of [-1, 1]) B(S, 0.05, 0.4, 0.5, 0xffe9a0, sx * 3.53, 2.5, z, { basic: true });
    const ice = new T.Mesh(new T.IcosahedronGeometry(12, 0), lam(0xeef6ff)); ice.scale.set(1.4, 1.1, 1); ice.position.set(-16, 2, -62); g.add(ice);
    const pier = new T.Group(); g.add(pier); B(pier, 3.2, 0.25, 26, 0x9a6a3a, 0, 0.35, 14); for (let z = 2; z < 27; z += 3) for (const sx of [-1.5, 1.5]) Cy(pier, 0.14, 0.14, 2.4, 0x6b4423, sx, -0.6, z);
    for (let z = 1.5; z < 27; z += 0.6) B(pier, 3.2, 0.02, 0.04, 0x6b4423, 0, 0.48, z);
    const boat = new T.Group(); g.add(boat); B(boat, 1.8, 0.6, 4.2, 0x8a5a32, 0, 0.1, 0); B(boat, 1.5, 0.1, 3.8, 0xb07a4a, 0, 0.35, 0); for (const z of [-1, 0, 1]) B(boat, 1.5, 0.1, 0.3, 0x6b4423, 0, 0.45, z);
    return { bg: 0x9fd8ff, fog: [0x9fd8ff, 60, 380], hemi: [0xffffff, 0x2266aa, 1.1], sun: [0xffffff, 0.9, [20, 40, 20]],
      apply(p, t) { const n = !!p.night; sk.userData.set(n ? 0x070b1e : 0x3a8de0, n ? 0x1b2740 : 0xcfe9ff); wm.color.set(n ? 0x123a66 : 0x1f8fe0); this.bg = n ? 0x070b1e : 0x9fd8ff; this.fog = [n ? 0x0b1226 : 0x9fd8ff, 60, 380]; this.hemi = n ? [0x8aa0ff, 0x0a1a33, 0.75] : [0xffffff, 0x2266aa, 1.1];
        const a = W.attributes.position.array; for (let i = 0; i < a.length; i += 3) { const x = base[i], y = base[i + 1]; a[i + 2] = Math.sin(x * 0.15 + t * 1.3) * 0.25 + Math.cos(y * 0.18 + t * 1.1) * 0.25; } W.attributes.position.needsUpdate = true; W.computeVertexNormals();
        ship.visible = p.ship !== false; const sk2 = p.sink || 0; S.rotation.x = -sk2 * 0.9; ship.position.y = -sk2 * 14 + Math.sin(t * 0.8) * 0.15; ice.visible = !!p.ice; pier.visible = !!p.pier;
        const b = p.boat; boat.visible = !!b; if (b) { boat.position.set(b.x || 0, Math.sin(t * 1.7) * 0.12, b.z || 0); boat.rotation.set(Math.sin(t * 1.3) * 0.05, b.ry || 0, b.flip ? Math.PI : Math.sin(t) * 0.05); } } };
  });

  // ================= PARQUE =================
  mkEnv('park', (g) => {
    const sk = sky(g); sk.userData.set(0x3a8de0, 0xd8f0ff);
    Pl(g, 120, 120, new T.MeshLambertMaterial({ color: 0x5cb34a }), 0, 0, 0, [-Math.PI / 2, 0, 0]);
    Pl(g, 3, 120, new T.MeshLambertMaterial({ color: 0xd9c89c }), 0, 0.01, 0, [-Math.PI / 2, 0, 0]);
    Pl(g, 14, 10, new T.MeshLambertMaterial({ color: 0xe8c07a }), 7.5, 0.012, -4, [-Math.PI / 2, 0, 0]);     // areia do playground
    // escorregador
    B(g, 1.6, 0.12, 1.6, 0xe74c3c, 6, 2.2, -6); for (const sx of [-0.7, 0.7]) for (const sz of [-0.7, 0.7]) Cy(g, 0.07, 0.07, 2.2, 0x3a86ff, 6 + sx, 1.1, -6 + sz);
    B(g, 1.0, 0.1, 3.6, 0xf1c40f, 6, 1.2, -3.6, { r: [-0.62, 0, 0] }); for (let i = 0; i < 6; i++) B(g, 0.9, 0.06, 0.12, 0x3a86ff, 6, 0.3 + i * 0.36, -7.2);
    // balanço
    for (const sx of [-1.8, 1.8]) { B(g, 0.12, 2.8, 0.12, 0x3a86ff, 10.5 + sx, 1.4, -2.5, { r: [0, 0, 0] }); }
    B(g, 3.8, 0.12, 0.12, 0x3a86ff, 10.5, 2.8, -2.5); const sw = new T.Group(); sw.position.set(10.5, 2.75, -2.5); g.add(sw); B(sw, 0.03, 2.1, 0.03, 0x555555, -0.35, -1.05, 0); B(sw, 0.03, 2.1, 0.03, 0x555555, 0.35, -1.05, 0); B(sw, 0.8, 0.06, 0.35, 0xe74c3c, 0, -2.1, 0);
    // bancos, árvores, cerca, poste
    const bench = (x, z, ry) => { const b = new T.Group(); b.position.set(x, 0, z); b.rotation.y = ry; g.add(b); B(b, 1.8, 0.08, 0.5, 0x8a5a32, 0, 0.5, 0); B(b, 1.8, 0.4, 0.06, 0x8a5a32, 0, 0.8, -0.24); for (const sx of [-0.8, 0.8]) B(b, 0.08, 0.5, 0.45, 0x333333, sx, 0.25, 0); };
    bench(-2.6, 0, Math.PI / 2); bench(-2.6, -6, Math.PI / 2); bench(2.6, 4, -Math.PI / 2);
    const R = rng(9); for (let i = 0; i < 22; i++) { const x = (R() < 0.5 ? -1 : 1) * (6 + R() * 30), z = 10 - R() * 60; if (x > 2 && x < 16 && z > -10 && z < 2) continue; tree(g, x, z, 0.9 + R() * 0.6); }
    for (let x = 1.5; x < 16; x += 1.2) { B(g, 0.08, 0.9, 0.08, 0xffffff, x, 0.45, 1.5); } B(g, 14.5, 0.07, 0.05, 0xffffff, 8.75, 0.8, 1.5); B(g, 14.5, 0.07, 0.05, 0xffffff, 8.75, 0.45, 1.5);
    Cy(g, 0.07, 0.09, 4, 0x333333, -2, 2, 3); Sp(g, 0.25, 0xfff2c0, -2, 4.1, 3, { basic: true });
    return { bg: 0xbfe6ff, fog: [0xd8f0ff, 40, 140], hemi: [0xffffff, 0x6a8a4a, 1.1], sun: [0xfff4e0, 0.95, [10, 25, 12]], apply(p, t) { sw.rotation.x = Math.sin(t * 2.4) * (p.swing ?? 0.5); } };
  });

  // ================= BASEPLATE (o clássico do Roblox) =================
  mkEnv('baseplate', (g) => {
    const sk = sky(g); sk.userData.set(0x4a9be8, 0xdff1ff);
    Pl(g, 200, 200, new T.MeshLambertMaterial({ map: rep(studs(0x8a8f96), 100, 100) }), 0, 0, 0, [-Math.PI / 2, 0, 0]);
    const spawn = B(g, 2.4, 0.3, 2.4, 0x6a6f76, 0, 0.15, 0); Pl(g, 1.6, 1.6, new T.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.25 }), 0, 0.31, 0, [-Math.PI / 2, 0, 0]);
    return { bg: 0xbfe2ff, fog: [0xdff1ff, 60, 180], hemi: [0xffffff, 0x777777, 1.1], sun: [0xffffff, 0.9, [12, 30, 10]], apply(p) { spawn.visible = p.spawn !== false; } };
  });
}
