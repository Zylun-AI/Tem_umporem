// Cenários extras pensados para os shorts (estilo jogos de Roblox): casa, avião (cabine e céu),
// oceano com navio, parque, baseplate. Todos centrados na origem, chão em y=0.
export function moreEnvs(U) {
  const { THREE, B, Cy, Sp, Pl, cvs, mkEnv, rng, sky, lam, hex, mix, clamp, lerp } = U;
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
    const winH = B(g, 3.2, 2.0, 0.08, 0x9fd6ff, -3, 2.0, -5.88, { basic: true }); B(g, 3.4, 0.12, 0.15, 0xffffff, -3, 3.0, -5.85); B(g, 3.4, 0.12, 0.15, 0xffffff, -3, 1.0, -5.85); B(g, 0.12, 2.0, 0.15, 0xffffff, -3, 2.0, -5.85);
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
    // buraco na parede da direita (x=+8, z=-2.5): p.hole 0 = sem buraco, ~0.05 = buraquinho no pé da parede, 1 = buraco grande (1,1 x 0,9 m)
    const hole = B(g, 0.04, 1, 1, 0x1a120c, 7.88, 0.5, -2.5); const rim = B(g, 0.03, 1, 1, 0xb9ab95, 7.89, 0.5, -2.5);
    // p.night: sala de madrugada (luz azulada, janela escura, TV desligada se tv não for dado)
    return { bg: 0xcfe8ff, hemi: [0xffffff, 0x9a8a78, 1.15], sun: [0xfff4e0, 0.75, [-6, 12, 8]], apply(p) { door.rotation.y = -(p.door || 0) * 1.4; scr.material.color.set(p.tv === false || (p.night && p.tv === undefined) ? 0x111111 : (p.tvColor || 0x2a6fd6));
      const n = !!p.night; this.bg = n ? 0x0b1430 : 0xcfe8ff; this.hemi = n ? [0x8aa6ff, 0x2a2440, 0.62] : [0xffffff, 0x9a8a78, 1.15]; this.sun = n ? [0x9ab4ff, 0.32, [-6, 12, 8]] : [0xfff4e0, 0.75, [-6, 12, 8]]; winH.material.color.set(n ? 0x16234a : 0x9fd6ff);
      const h = p.hole || 0; hole.visible = rim.visible = h > 0; if (h > 0) { const w = lerp(0.18, 1.1, h), hh = lerp(0.13, 0.9, h); hole.scale.set(1, hh, w); hole.position.y = hh / 2 + 0.01; rim.scale.set(1, hh + 0.08 * h, w + 0.12 * h); rim.position.y = (hh + 0.08 * h) / 2; } } };
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
    const winSpace = cvs(64, 64, (x, w, h) => { x.fillStyle = '#e8e8e8'; x.fillRect(0, 0, w, h); x.fillStyle = '#05070f'; x.beginPath(); x.roundRect(14, 8, 36, 48, 14); x.fill(); x.fillStyle = '#fff'; for (const [a, b] of [[22, 18], [40, 30], [28, 44], [34, 14]]) x.fillRect(a, b, 2, 2); });
    const winMs = []; for (const z of rows) for (const sx of [-1, 1]) winMs.push(Pl(g, 0.6, 0.6, new T.MeshBasicMaterial({ map: win }), sx * 3.2, 2.0, z, [0, -sx * Math.PI / 2, 0]));
    const seat = (x, z, c) => { B(g, 0.8, 0.15, 0.75, c, x, 0.5, z); B(g, 0.8, 1.1, 0.16, c, x, 1.05, z + 0.4, { r: [-0.12, 0, 0] }); B(g, 0.6, 0.2, 0.12, 0xdddddd, x, 1.6, z + 0.47); B(g, 0.1, 0.4, 0.6, 0x555555, x - 0.43, 0.4, z); };
    for (const z of rows) for (const x of [-2.0, -1.15, 1.15, 2.0]) seat(x, z, 0x24407a);
    const zw = 6 - 13 * 1.4 + 0.4;   // parede da cabine do piloto
    B(g, 2.6, 4, 0.15, 0xd8d8d8, -2.1, 2, zw); B(g, 2.6, 4, 0.15, 0xd8d8d8, 2.1, 2, zw); B(g, 1.6, 1.2, 0.15, 0xd8d8d8, 0, 3.4, zw); const cd = B(g, 1.3, 2.8, 0.08, 0xbfbfbf, 0, 1.4, zw + 0.05);
    B(g, 4.4, 1.1, 0.9, 0x2b2f38, 0, 1.0, zw - 3.0); for (let i = 0; i < 6; i++) B(g, 0.45, 0.3, 0.02, i % 2 ? 0x3ddc6a : 0x38a0ff, -1.4 + i * 0.56, 1.35, zw - 2.54, { basic: true });
    B(g, 4.6, 1.5, 0.05, 0x9fd6ff, 0, 2.3, zw - 3.6, { basic: true }); B(g, 6.6, 4, 0.1, 0xdcdcdc, 0, 2, zw - 3.7);
    for (const sx of [-1.0, 1.0]) { B(g, 0.8, 0.15, 0.75, 0x3a3a3a, sx, 0.5, zw - 1.8); B(g, 0.8, 1.1, 0.16, 0x3a3a3a, sx, 1.05, zw - 1.4); }
    B(g, 6.8, 0.1, 4, 0x2b2b2b, 0, -0.04, zw - 2); B(g, 6.8, 0.2, 4, 0xe0e0e0, 0, 3.9, zw - 2); B(g, 0.15, 4, 4, 0xd0d0d0, -3.3, 2, zw - 2); B(g, 0.15, 4, 4, 0xd0d0d0, 3.3, 2, zw - 2);
    g.userData = { rows, seatsX: [-2.0, -1.15, 1.15, 2.0], seatY: 0.5, cockpitZ: zw - 1.8, doorZ: zw };
    return { bg: 0xffffff, hemi: [0xffffff, 0x8a8f9a, 1.2], sun: [0xffffff, 0.6, [4, 10, 6]], apply(p, t) { winMs.forEach(m => m.material.map = p.space ? winSpace : win); cd.position.x = (p.cockpitOpen || 0) * 1.25; g.rotation.z = (p.tilt || 0) + (p.shake ? Math.sin(t * 23) * 0.012 * p.shake : 0); g.rotation.x = p.pitch || 0; } };
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

  // ================= MARTE (base "Nova Esperança") =================
  // Domo principal em (0,0,-12) r=5, porta virada p/ +z em z≈-7. Estufa (domo de vidro) em (12,0,-12) r=4. Painéis solares x -20..-8, z -4..6.
  // Foguete em (-16,0,-30). p: tod 'day'|'dusk'|'night', storm 0..1, dust 0..1 (poeira nos painéis), green 0..1 (plantas), glow 0..1 (luz da estufa),
  // power 0..1 (janelas), earth (bool, pontinho azul no céu), cable 0..1 (cabo da base até o foguete), base (false esconde a base), rocket (false esconde)
  mkEnv('mars', (g) => {
    const R = rng(77); const sk = sky(g);
    const groundTex = cvs(256, 256, (x, w, h) => { x.fillStyle = '#b4572c'; x.fillRect(0, 0, w, h); for (let i = 0; i < 900; i++) { x.fillStyle = `rgba(${R() < 0.5 ? '90,30,10' : '230,140,90'},${0.08 + R() * 0.12})`; const r = 1 + R() * 6; x.beginPath(); x.arc(R() * w, R() * h, r, 0, 7); x.fill(); } });
    groundTex.wrapS = groundTex.wrapT = T.RepeatWrapping; groundTex.repeat.set(60, 60);
    Pl(g, 800, 800, new T.MeshLambertMaterial({ map: groundTex }), 0, 0, 0, [-Math.PI / 2, 0, 0]);
    for (let i = 0; i < 18; i++) { const a = R() * Math.PI * 2, r = 60 + R() * 200; const d = Sp(g, 14 + R() * 26, i % 2 ? 0xa9502a : 0xc0683a, Math.cos(a) * r, -6, Math.sin(a) * r, { s: [1.6, 0.35 + R() * 0.3, 1] }); }
    for (let i = 0; i < 8; i++) { const a = -Math.PI * 0.9 + R() * Math.PI * 0.8, r = 180 + R() * 120; const m = new T.Mesh(new T.CylinderGeometry(18 + R() * 20, 30 + R() * 25, 18 + R() * 30, 7), lam(0x9a4526)); m.position.set(Math.cos(a) * r, 8, Math.sin(a) * r); g.add(m); }
    for (let i = 0; i < 140; i++) { const a = R() * Math.PI * 2, r = 9 + R() * 120; const x = Math.cos(a) * r, z = Math.sin(a) * r; if (x > -24 && x < 18 && z > -18 && z < 10) continue; const m = new T.Mesh(new T.DodecahedronGeometry(0.2 + R() * (R() < 0.1 ? 1.6 : 0.6), 0), lam(R() < 0.5 ? 0x7a3418 : 0x5e2a14)); m.position.set(x, 0.05, z); m.rotation.set(R() * 3, R() * 3, 0); m.scale.y = 0.6; g.add(m); }
    for (const [x, z, r] of [[26, 18, 6], [-34, 22, 9], [40, -40, 12]]) { const c = new T.Mesh(new T.TorusGeometry(r, r * 0.18, 8, 32), lam(0x9e4a24)); c.rotation.x = -Math.PI / 2; c.scale.z = 0.35; c.position.set(x, 0, z); g.add(c); }
    const base = new T.Group(); g.add(base);
    const dome = new T.Mesh(new T.SphereGeometry(5, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2), lam(0xf0efe9)); dome.position.set(0, 0, -12); base.add(dome);
    for (let i = 0; i < 3; i++) { const rr = new T.Mesh(new T.TorusGeometry(5 * Math.cos(0.25 + i * 0.4), 0.06, 6, 40), lam(0xbdbdb6)); rr.rotation.x = Math.PI / 2; rr.position.set(0, 5 * Math.sin(0.25 + i * 0.4), -12); base.add(rr); }
    const winMat = new T.MeshBasicMaterial({ color: 0x1d2b3a }); const wins = [];
    for (let i = 0; i < 8; i++) { const a = -Math.PI / 2 + (i - 3.5) * 0.32; if (Math.abs(i - 3.5) < 0.6) continue; const w = new T.Mesh(new T.BoxGeometry(0.9, 0.55, 0.1), winMat); w.position.set(Math.cos(a + Math.PI) * -4.7 * 0 + Math.sin(a + Math.PI / 2) * 0 + 4.62 * Math.cos(a), 2.0, -12 - 4.62 * Math.sin(a)); w.lookAt(0, 2.0, -12); w.rotateY(Math.PI); base.add(w); wins.push(w); }
    B(base, 2.4, 2.6, 2.6, 0xe2e1da, 0, 1.3, -6.9); const door = B(base, 1.3, 2.0, 0.08, 0x3a4450, 0, 1.0, -5.56); B(base, 1.6, 0.18, 0.12, 0xf2a33a, 0, 2.2, -5.55, { basic: true });
    const flag = new T.Group(); flag.position.set(3.4, 0, -6.4); Cy(flag, 0.03, 0.03, 3.4, 0xcccccc, 0, 1.7, 0); B(flag, 1.2, 0.7, 0.02, 0x2a6ad6, 0.62, 3.0, 0); B(flag, 0.6, 0.12, 0.03, 0xffd21f, 0.62, 3.0, 0, { basic: true }); base.add(flag);
    const tun = Cy(base, 1.1, 1.1, 3.4, 0xe2e1da, 6.4, 1.1, -12, { r: [0, 0, Math.PI / 2] });
    const gh = new T.Group(); gh.position.set(12, 0, -12); base.add(gh);
    Cy(gh, 4.05, 4.05, 0.4, 0xd8d6cf, 0, 0.2, 0, { seg: 32 });
    const glass = new T.Mesh(new T.SphereGeometry(4, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2), new T.MeshLambertMaterial({ color: 0xbfe6ff, transparent: true, opacity: 0.28, depthWrite: false, side: T.DoubleSide })); glass.renderOrder = 4; gh.add(glass);
    for (let i = 0; i < 6; i++) { const rib = new T.Mesh(new T.TorusGeometry(4, 0.04, 4, 32, Math.PI), lam(0xdadada)); rib.rotation.y = i * Math.PI / 6; gh.add(rib); }
    const plants = []; for (let r = 0; r < 3; r++) for (let k = 0; k < 7; k++) { const x = -2.4 + k * 0.8, z = -1.4 + r * 1.4; if (x * x + z * z > 10) continue; const pg = new T.Group(); pg.position.set(x, 0.4, z); Sp(pg, 0.32, 0x3fbf4a, 0, 0.3, 0, { s: [1, 0.7, 1] }); Sp(pg, 0.22, 0x2f9a3a, 0.18, 0.5, 0.05); gh.add(pg); plants.push(pg); }
    B(gh, 5.6, 0.3, 0.5, 0x6b4a2f, 0, 0.45, -1.4); B(gh, 5.6, 0.3, 0.5, 0x6b4a2f, 0, 0.45, 0); B(gh, 5.6, 0.3, 0.5, 0x6b4a2f, 0, 0.45, 1.4);
    const ghL = new T.PointLight(0xff5ad8, 0, 14); ghL.position.set(0, 3, 0); gh.add(ghL); const ghGlow = new T.Mesh(new T.SphereGeometry(3.9, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2), new T.MeshBasicMaterial({ color: 0xff7ae0, transparent: true, opacity: 0, depthWrite: false, side: T.BackSide })); gh.add(ghGlow);
    const panels = []; for (let r = 0; r < 3; r++) for (let c = 0; c < 5; c++) { const pg = new T.Group(); pg.position.set(-20 + c * 2.8, 0.9, -3 + r * 3.2); const pn = new T.Group(); pn.rotation.x = -0.4; const top = B(pn, 2.4, 0.08, 1.4, 0x1d3f8a, 0, 0, 0); for (let i = 1; i < 6; i++) B(pn, 0.015, 0.09, 1.4, 0xbfd3ff, -1.2 + i * 0.4, 0, 0); pg.add(pn); B(pg, 0.08, 0.8, 0.08, 0x777c83, -1, -0.45, 0.2); B(pg, 0.08, 0.8, 0.08, 0x777c83, 1, -0.45, 0.2); base.add(pg); panels.push(top); }
    const rocket = new T.Group(); rocket.position.set(-16, 0, -30); g.add(rocket);
    Cy(rocket, 2.2, 2.2, 16, 0xe9e9e9, 0, 9, 0, { seg: 24 }); const cone = new T.Mesh(new T.ConeGeometry(2.2, 5, 24), lam(0xe9e9e9)); cone.position.y = 19.5; rocket.add(cone); Cy(rocket, 2.25, 2.25, 1.2, 0x222222, 0, 14, 0, { seg: 24 });
    for (let i = 0; i < 4; i++) { const a = i * Math.PI / 2 + 0.4; const leg = B(rocket, 0.3, 4, 0.3, 0x555555, Math.cos(a) * 2.8, 1.6, Math.sin(a) * 2.8); leg.rotation.set(Math.sin(a) * 0.35, 0, -Math.cos(a) * 0.35); }
    for (let i = 0; i < 5; i++) B(rocket, 0.05, 0.4, 0.4, 0x1d2b3a, Math.cos(i * 0.5 - 1) * 2.22, 15.5, Math.sin(i * 0.5 - 1) * 2.22, { basic: true });
    const rocket2 = rocket.clone(); rocket2.position.set(-34, 0, -44); g.add(rocket2); const rocket3 = rocket.clone(); rocket3.position.set(-4, 0, -52); g.add(rocket3);
    // robô solar (tipo Opportunity) em p.rover {x,z,ry,dust}
    const rover = new T.Group(); g.add(rover); B(rover, 1.2, 0.35, 1.6, 0xd8d0c0, 0, 0.75, 0); const rpan = []; for (const sx of [-1, 1]) rpan.push(B(rover, 1.1, 0.05, 1.5, 0x1d3f8a, sx * 1.15, 0.95, 0)); rpan.push(B(rover, 1.1, 0.05, 0.9, 0x1d3f8a, 0, 0.97, -1.15));
    Cy(rover, 0.04, 0.04, 1.2, 0xbbbbbb, 0.3, 1.5, 0.6); B(rover, 0.35, 0.2, 0.2, 0xeeeeee, 0.3, 2.1, 0.6); const reye = B(rover, 0.22, 0.1, 0.05, 0x40c0ff, 0.3, 2.1, 0.71, { basic: true });
    for (const sx of [-1, 1]) for (const z of [-0.7, 0, 0.7]) Cy(rover, 0.22, 0.22, 0.18, 0x333333, sx * 0.75, 0.22, z, { r: [0, 0, Math.PI / 2] }); g.userData.rover = rover;
    const cpts = [new T.Vector3(-1.2, 0.08, -6), new T.Vector3(-5, 0.08, -10), new T.Vector3(-9, 0.08, -18), new T.Vector3(-13, 0.08, -25), new T.Vector3(-15.2, 0.3, -27.6)];
    const cableG = new T.TubeGeometry(new T.CatmullRomCurve3(cpts), 80, 0.06, 6); const cable = new T.Mesh(cableG, lam(0xffb000)); g.add(cable); const cableN = cableG.index ? cableG.index.count : cableG.attributes.position.count;
    const N = 1500; const dp = new Float32Array(N * 3); for (let i = 0; i < N; i++) { dp[i * 3] = (R() - 0.5) * 80; dp[i * 3 + 1] = R() * 12; dp[i * 3 + 2] = (R() - 0.5) * 80 - 6; } const dg = new T.BufferGeometry(); dg.setAttribute('position', new T.BufferAttribute(dp, 3)); const dust = new T.Points(dg, new T.PointsMaterial({ color: 0xd88a55, size: 0.12, transparent: true, opacity: 0.8 })); g.add(dust); const dp0 = dp.slice();
    const stars = new Float32Array(900 * 3); for (let i = 0; i < 900; i++) { const v = new T.Vector3(R() * 2 - 1, R() + 0.1, R() * 2 - 1).normalize().multiplyScalar(560); stars.set([v.x, v.y, v.z], i * 3); } const stg = new T.BufferGeometry(); stg.setAttribute('position', new T.BufferAttribute(stars, 3)); const st = new T.Points(stg, new T.PointsMaterial({ color: 0xffffff, size: 2, sizeAttenuation: false, fog: false, transparent: true })); st.frustumCulled = false; g.add(st);
    const earth = new T.Group(); earth.position.set(-20, 110, -380); const ec = new T.Mesh(new T.SphereGeometry(4, 12, 8), new T.MeshBasicMaterial({ color: 0x9fd0ff, fog: false })); earth.add(ec); const eh = new T.Mesh(new T.SphereGeometry(11, 12, 8), new T.MeshBasicMaterial({ color: 0x4aa3ff, transparent: true, opacity: 0.3, fog: false, depthWrite: false })); earth.add(eh); g.add(earth);
    const sunM = new T.Mesh(new T.SphereGeometry(9, 16, 10), new T.MeshBasicMaterial({ color: 0xfff4e0, fog: false })); g.add(sunM); const sunH = new T.Mesh(new T.SphereGeometry(30, 16, 10), new T.MeshBasicMaterial({ color: 0x9fd0ff, transparent: true, opacity: 0.35, fog: false, depthWrite: false })); sunM.add(sunH);
    return { bg: 0xe0a578, fog: [0xd99a6a, 120, 500], hemi: [0xffe2c8, 0x7a3a1a, 1.0], sun: [0xffe8d0, 0.9, [30, 40, 20]],
      apply(p, t) { const tod = p.tod || 'day'; const stm = clamp(p.storm || 0);
        let top = 0xb7774f, hor = 0xe9b88c, bg = 0xe0a578, fogC = 0xd99a6a, hemi = [0xffe2c8, 0x7a3a1a, 1.0], sunC = [0xffe8d0, 0.9, [30, 40, 20]];
        if (tod === 'dusk') { top = 0x2a2440; hor = 0x7fb0e0; bg = 0x5a6a90; fogC = 0x6a5a70; hemi = [0x9ab4ff, 0x4a2418, 0.7]; sunC = [0xbcd6ff, 0.6, [-60, 8, -200]]; }
        if (tod === 'night') { top = 0x05060e; hor = 0x1c1420; bg = 0x0a0910; fogC = 0x120d14; hemi = [0x6a7aa8, 0x2a1410, 0.38]; sunC = [0x8fa6ff, 0.12, [-20, 40, 10]]; }
        top = mix(top, 0x5a2a14, stm).getHex(); hor = mix(hor, 0xa0582c, stm).getHex(); bg = mix(bg, 0x8a4a28, stm).getHex(); fogC = mix(fogC, 0x9a5a32, stm).getHex();
        sk.userData.set(top, hor); this.bg = bg; this.fog = [fogC, lerp(120, 2, stm), lerp(500, 38, stm)]; this.hemi = [hemi[0], hemi[1], hemi[2] * (1 - 0.45 * stm)]; this.sun = [sunC[0], sunC[1] * (1 - 0.8 * stm), sunC[2]];
        st.visible = tod !== 'day' && stm < 0.3; st.material.opacity = tod === 'night' ? 1 : 0.5; earth.visible = !!p.earth && stm < 0.3;
        sunM.visible = tod === 'dusk' && stm < 0.3; sunM.position.set(-60, 42, -320);
        base.visible = p.base !== false; rocket.visible = p.rocket !== false;
        rocket2.visible = (p.ships || 1) >= 2; rocket3.visible = (p.ships || 1) >= 3; const rv = p.rover; rover.visible = !!rv; if (rv) { rover.position.set(rv.x || 0, 0, rv.z || 0); rover.rotation.y = rv.ry || 0; rpan.forEach(m => m.material.color.copy(mix(0x1d3f8a, 0xb4572c, rv.dust || 0))); reye.material.color.set(rv.off ? 0x111111 : 0x40c0ff); }
        const du = clamp(p.dust || 0); panels.forEach(m => m.material.color.copy(mix(0x1d3f8a, 0xb4572c, du)));
        const pw = p.power === undefined ? 1 : p.power; winMat.color.set(tod === 'day' ? mix(0x1d2b3a, 0x3a5a7a, pw).getHex() : mix(0x1d2b3a, 0xffd98a, pw).getHex());
        const gr = p.green === undefined ? 1 : p.green; plants.forEach(pg => { pg.scale.setScalar(0.05 + 0.95 * gr); pg.visible = gr > 0.01; });
        const gl = p.glow || 0; ghL.intensity = gl * 30; ghGlow.material.opacity = gl * 0.25;
        const cb = p.cable || 0; cable.visible = cb > 0.001; cableG.setDrawRange(0, Math.floor(cableN * cb / 3) * 3);
        dust.visible = stm > 0.02; dust.material.opacity = 0.9 * stm; const a = dust.geometry.attributes.position; for (let i = 0; i < a.count; i++) { a.setX(i, ((dp0[i * 3] + t * (14 + (i % 7) * 3) * stm + 40) % 80 + 80) % 80 - 40); a.setY(i, dp0[i * 3 + 1] + Math.sin(t * 2 + i) * 0.3); } a.needsUpdate = true; } };
  });

  // ================= BASEPLATE (o clássico do Roblox) =================
  mkEnv('baseplate', (g) => {
    const sk = sky(g); sk.userData.set(0x4a9be8, 0xdff1ff);
    Pl(g, 200, 200, new T.MeshLambertMaterial({ map: rep(studs(0x8a8f96), 100, 100) }), 0, 0, 0, [-Math.PI / 2, 0, 0]);
    const spawn = B(g, 2.4, 0.3, 2.4, 0x6a6f76, 0, 0.15, 0); Pl(g, 1.6, 1.6, new T.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.25 }), 0, 0.31, 0, [-Math.PI / 2, 0, 0]);
    return { bg: 0xbfe2ff, fog: [0xdff1ff, 60, 180], hemi: [0xffffff, 0x777777, 1.1], sun: [0xffffff, 0.9, [12, 30, 10]], apply(p) { spawn.visible = p.spawn !== false; } };
  });

  // ================= FUNDO DO MAR (base "Atlântida") =================
  // Módulo principal: cilindro deitado ao longo de x, centro (0, 2.6, -10), r=2.2, x -6..6; janelas na face +z (z≈-7.8).
  // Porta molhada (entrada) em (7.4, 0, -10). Domo (escola) em (-11, 0, -10) r=3.5. Fazenda de kelp x 8..18, z -1..8. Recife x -18..-6, z 0..9.
  // Turbina de maré em (16, 0, -28). Cabo da boia sobe do topo do módulo (0, 4.8, -10) até a superfície (y=40).
  // p: night, power 0..1 (janelas), alarm 0..1, storm 0..1, light 0..1 (raios de sol; padrão 1 de dia), kelp 0..1, buoy (cabo da boia: true|'broken'|false),
  //    cable 0..1 (cabo novo até a turbina), spin (velocidade da turbina), fish {x,y,z,r,n} (cardume), glowy 0..1 (bioluminescência), more (módulos extras), base (false esconde)
  mkEnv('sea', (g) => {
    const R = rng(55);
    const sandTex = cvs(256, 256, (x, w, h) => { x.fillStyle = '#c9b48a'; x.fillRect(0, 0, w, h); for (let i = 0; i < 700; i++) { x.fillStyle = `rgba(${R() < 0.5 ? '120,100,70' : '240,225,190'},${0.08 + R() * 0.12})`; x.beginPath(); x.arc(R() * w, R() * h, 1 + R() * 4, 0, 7); x.fill(); } x.strokeStyle = 'rgba(140,120,80,.25)'; x.lineWidth = 3; for (let i = 0; i < 10; i++) { x.beginPath(); for (let k = 0; k <= 32; k++) { const xx = k * 8; x.lineTo(xx, i * 26 + Math.sin(k * 0.6 + i) * 5); } x.stroke(); } });
    sandTex.wrapS = sandTex.wrapT = T.RepeatWrapping; sandTex.repeat.set(70, 70);
    const floorM = new T.MeshLambertMaterial({ map: sandTex }); Pl(g, 600, 600, floorM, 0, 0, 0, [-Math.PI / 2, 0, 0]);
    for (let i = 0; i < 14; i++) { const a = R() * Math.PI * 2, r = 50 + R() * 120; Sp(g, 12 + R() * 22, 0x8f8466, Math.cos(a) * r, -5, Math.sin(a) * r, { s: [1.6, 0.45 + R() * 0.3, 1] }); }
    for (let i = 0; i < 120; i++) { const a = R() * Math.PI * 2, r = 8 + R() * 70; const x = Math.cos(a) * r, z = Math.sin(a) * r; if (x > -16 && x < 19 && z > -16 && z < 9) continue; if (x > 8 && x < 20 && z > -30 && z < -6) continue; const m = new T.Mesh(new T.DodecahedronGeometry(0.3 + R() * (R() < 0.15 ? 1.8 : 0.7), 0), lam(R() < 0.5 ? 0x6e6a5c : 0x5a5850)); m.position.set(x, 0.1, z); m.rotation.set(R() * 3, R() * 3, 0); m.scale.y = 0.6; g.add(m); }
    // recife de coral
    const CC = [0xff6f91, 0xff9f43, 0xa66bff, 0xffd166, 0x4ecdc4, 0xff5e5b, 0xf78fb3];
    const coral = (x, z, s = 1) => { const k = Math.floor(R() * 4), c = CC[Math.floor(R() * CC.length)];
      if (k === 0) { for (let i = 0; i < 5; i++) Cy(g, 0.06 * s, 0.1 * s, (0.6 + R() * 0.8) * s, c, x + (R() - 0.5) * 0.6 * s, 0.4 * s, z + (R() - 0.5) * 0.6 * s, { r: [(R() - 0.5) * 0.7, 0, (R() - 0.5) * 0.7] }); }
      else if (k === 1) Sp(g, 0.5 * s, c, x, 0.3 * s, z, { s: [1, 0.7, 1] });
      else if (k === 2) { const m = new T.Mesh(new T.ConeGeometry(0.45 * s, 1.2 * s, 7, 1, true), new T.MeshLambertMaterial({ color: c, side: T.DoubleSide })); m.position.set(x, 0.6 * s, z); m.rotation.x = Math.PI; g.add(m); }
      else { const m = new T.Mesh(new T.CircleGeometry(0.7 * s, 12, 0, Math.PI), new T.MeshLambertMaterial({ color: c, side: T.DoubleSide })); m.position.set(x, 0.05, z); m.rotation.y = R() * 3; g.add(m); } };
    for (let i = 0; i < 70; i++) coral(-18 + R() * 12, 0 + R() * 9, 0.7 + R() * 0.8);
    for (let i = 0; i < 40; i++) { const a = R() * Math.PI * 2, r = 16 + R() * 30; const x = Math.cos(a) * r, z = Math.sin(a) * r; if (x > 6 && x < 20 && z > -30 && z < 9) continue; coral(x, z, 0.7 + R() * 0.9); }
    // base
    const base = new T.Group(); g.add(base); const hullC = 0xf2efe4;
    Cy(base, 2.2, 2.2, 12, hullC, 0, 2.6, -10, { r: [0, 0, Math.PI / 2], seg: 28 }); for (const x of [-6, 6]) Sp(base, 2.2, hullC, x, 2.6, -10, { s: [0.35, 1, 1] });
    for (let x = -5; x <= 5; x += 2.5) Cy(base, 2.26, 2.26, 0.18, 0xf2b705, x, 2.6, -10, { r: [0, 0, Math.PI / 2], seg: 28 });
    for (const x of [-4.5, 0, 4.5]) for (const z of [-11.4, -8.6]) B(base, 0.35, 0.9, 0.35, 0x7d7f84, x, 0.45, z);
    B(base, 13, 0.25, 3.4, 0x8a8d92, 0, 0.6, -10);
    const winM = new T.MeshBasicMaterial({ color: 0xffd98a }); const wins = [];
    for (let x = -4.5; x <= 4.6; x += 1.5) { const w = new T.Mesh(new T.CircleGeometry(0.42, 18), winM); w.position.set(x, 2.7, -7.79); base.add(w); wins.push(w); const fr = new T.Mesh(new T.TorusGeometry(0.44, 0.06, 6, 20), lam(0x55585e)); fr.position.set(x, 2.7, -7.78); base.add(fr); }
    const sg = cvs(512, 96, (x, w, h) => { x.fillStyle = '#0d3b66'; x.fillRect(0, 0, w, h); x.fillStyle = '#ffd21f'; x.font = '900 66px Inter'; x.textAlign = 'center'; x.fillText('ATLÂNTIDA', w / 2, 72); });
    Pl(base, 3.2, 0.6, new T.MeshBasicMaterial({ map: sg }), 0, 4.15, -8.35, [-0.55, 0, 0]);
    // porta molhada (entrada com piscina por baixo)
    B(base, 2.6, 3.2, 2.6, 0xe6e2d4, 7.4, 2.2, -10); B(base, 2.7, 0.2, 2.7, 0xf2b705, 7.4, 3.85, -10); B(base, 1.6, 0.05, 1.6, 0x0a2a3a, 7.4, 0.59, -10, { basic: true });
    for (let i = 0; i < 5; i++) B(base, 0.9, 0.05, 0.08, 0x9a9da2, 7.4, 0.15 + i * 0.12, -8.75 + 0 * i);
    for (const [x, z] of [[6.3, -8.9], [8.5, -8.9], [6.3, -11.1], [8.5, -11.1]]) B(base, 0.25, 0.65, 0.25, 0x7d7f84, x, 0.32, z);
    // domo (escola)
    const dome = new T.Mesh(new T.SphereGeometry(3.5, 28, 14, 0, Math.PI * 2, 0, Math.PI / 2), lam(hullC)); dome.position.set(-11, 0, -10); base.add(dome);
    for (let i = 0; i < 5; i++) { const a = -0.9 + i * 0.45; const w = new T.Mesh(new T.CircleGeometry(0.35, 14), winM); w.position.set(-11 + Math.sin(a) * 3.36, 1.4, -10 + Math.cos(a) * 3.36); w.lookAt(-11 + Math.sin(a) * 9, 1.4, -10 + Math.cos(a) * 9); base.add(w); wins.push(w); }
    Cy(base, 0.9, 0.9, 3.0, hullC, -7.3, 1.6, -10, { r: [0, 0, Math.PI / 2] });
    // módulos extras (anos depois)
    const more = new T.Group(); g.add(more);
    Cy(more, 2.0, 2.0, 10, hullC, 2, 2.4, -22, { r: [0, 0, Math.PI / 2], seg: 24 }); for (const x of [-3, 7]) Sp(more, 2.0, hullC, x, 2.4, -22, { s: [0.35, 1, 1] });
    for (let x = -1.5; x <= 5.6; x += 1.5) { const w = new T.Mesh(new T.CircleGeometry(0.38, 16), winM); w.position.set(x, 2.5, -19.98); more.add(w); }
    Cy(more, 0.8, 0.8, 9.6, hullC, 1.5, 1.6, -16, { r: [Math.PI / 2, 0, 0] });
    const dome2 = new T.Mesh(new T.SphereGeometry(3, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2), lam(hullC)); dome2.position.set(-12, 0, -24); more.add(dome2);
    // fazenda de kelp
    const kelps = []; const kelpM = new T.MeshLambertMaterial({ color: 0x5a8f2a, side: T.DoubleSide });
    for (let i = 0; i < 44; i++) { const col = i % 11, row = Math.floor(i / 11); const x = 8.5 + col * 0.9 + (R() - 0.5) * 0.3, z = -1 + row * 2.4 + (R() - 0.5) * 0.4; const k = new T.Group(); k.position.set(x, 0, z); g.add(k); const segs = []; let parent = k; const n = 7 + Math.floor(R() * 4);
      for (let j = 0; j < n; j++) { const sgp = new T.Group(); sgp.position.y = j === 0 ? 0 : 0.7; parent.add(sgp); const leaf = new T.Mesh(new T.PlaneGeometry(0.32, 0.75), kelpM); leaf.position.y = 0.37; leaf.rotation.y = R() * 3; sgp.add(leaf); segs.push(sgp); parent = sgp; }
      kelps.push({ k, segs, ph: R() * 6 }); }
    for (let row = 0; row < 4; row++) B(g, 10.5, 0.05, 0.05, 0xd9c27a, 13, 0.3, -1 + row * 2.4);
    // turbina de maré
    const tur = new T.Group(); tur.position.set(16, 0, -28); g.add(tur); Cy(tur, 0.5, 0.8, 6, 0x9aa0a8, 0, 3, 0); B(tur, 1.2, 1.2, 3.0, 0xf2b705, 0, 6.2, 0); const rotor = new T.Group(); rotor.position.set(0, 6.2, 1.7); tur.add(rotor);
    Sp(rotor, 0.45, 0xdddddd, 0, 0, 0); for (let i = 0; i < 3; i++) { const bl = new T.Group(); bl.rotation.z = i * Math.PI * 2 / 3; B(bl, 0.5, 4.2, 0.12, 0xf0f0f0, 0, 2.1, 0); rotor.add(bl); }
    B(tur, 3, 0.4, 3, 0x6e7177, 0, 0.2, 0);
    // cabo da boia
    const buoyC = Cy(g, 0.07, 0.07, 36, 0x222222, 0, 22.8, -10); const buoy = new T.Group(); buoy.position.set(0, 39.6, -10); g.add(buoy); Cy(buoy, 1.3, 1.0, 1.4, 0xf2b705, 0, 0, 0, { seg: 20 }); Cy(buoy, 0.15, 0.15, 3, 0x777, 0, 1.5, 0); B(buoy, 2.4, 0.08, 1.4, 0x1d3f8a, 0, 1.2, 0); const buoyBroken = Cy(g, 0.07, 0.07, 6, 0x222222, 0, 7.8, -10);
    // superfície vista de baixo
    const SW = new T.PlaneGeometry(260, 260, 50, 50); const surfM = new T.MeshBasicMaterial({ color: 0x8fdcff, side: T.DoubleSide, transparent: true, opacity: 0.9, fog: false }); const surf = new T.Mesh(SW, surfM); surf.rotation.x = Math.PI / 2; surf.position.y = 40; g.add(surf); const sbase = SW.attributes.position.array.slice();
    // raios de sol
    const shafts = []; for (let i = 0; i < 10; i++) { const m = new T.Mesh(new T.CylinderGeometry(1.2 + R() * 1.5, 0.2, 44, 10, 1, true), new T.MeshBasicMaterial({ color: 0xcff4ff, transparent: true, opacity: 0.06, depthWrite: false, blending: T.AdditiveBlending, side: T.DoubleSide, fog: false })); m.position.set(-30 + R() * 60, 20, -40 + R() * 50); m.rotation.z = 0.15; g.add(m); shafts.push(m); }
    // neve marinha
    const N = 1600; const sp = new Float32Array(N * 3); for (let i = 0; i < N; i++) { sp[i * 3] = (R() - 0.5) * 70; sp[i * 3 + 1] = R() * 16; sp[i * 3 + 2] = (R() - 0.5) * 70 - 8; } const sgeo = new T.BufferGeometry(); sgeo.setAttribute('position', new T.BufferAttribute(sp, 3)); const snow = new T.Points(sgeo, new T.PointsMaterial({ color: 0xe8f6ff, size: 0.06, transparent: true, opacity: 0.55 })); g.add(snow); const sp0 = sp.slice();
    // bioluminescência
    const NB = 2200; const bp = new Float32Array(NB * 3); for (let i = 0; i < NB; i++) { bp[i * 3] = (R() - 0.5) * 60; bp[i * 3 + 1] = 0.3 + R() * 12; bp[i * 3 + 2] = (R() - 0.5) * 60 - 6; } const bgeo = new T.BufferGeometry(); bgeo.setAttribute('position', new T.BufferAttribute(bp, 3)); const bio = new T.Points(bgeo, new T.PointsMaterial({ color: 0x4ff3ff, size: 0.16, transparent: true, opacity: 0, depthWrite: false, blending: T.AdditiveBlending, fog: false })); g.add(bio);
    // cardume
    const fishG = new T.Group(); g.add(fishG); const fish = []; const FC = [0xffb000, 0x2fd0ff, 0xffe066, 0xff7a45];
    for (let i = 0; i < 48; i++) { const f = new T.Group(); Sp(f, 0.16, FC[i % 4], 0, 0, 0, { s: [0.55, 0.9, 1.6] }); const tail = new T.Mesh(new T.ConeGeometry(0.13, 0.2, 4), lam(FC[i % 4])); tail.rotation.x = -Math.PI / 2; tail.position.z = -0.3; f.add(tail); fishG.add(f); fish.push({ f, a: R() * Math.PI * 2, r: R(), y: R(), sp: 0.85 + R() * 0.3 }); }
    // cabo novo até a turbina
    const cpts = [new T.Vector3(7.4, 0.5, -11.3), new T.Vector3(8.6, 0.08, -14), new T.Vector3(11, 0.08, -19), new T.Vector3(14, 0.08, -24), new T.Vector3(15.6, 0.5, -27)];
    const cableG = new T.TubeGeometry(new T.CatmullRomCurve3(cpts), 80, 0.07, 6); const cable = new T.Mesh(cableG, lam(0xffb000)); g.add(cable); const cableN = cableG.index ? cableG.index.count : cableG.attributes.position.count;
    const alarmL = new T.PointLight(0xff2020, 0, 30); alarmL.position.set(0, 6, -6); g.add(alarmL);
    const winL = new T.PointLight(0xffd98a, 0, 14); winL.position.set(0, 2.7, -6.5); g.add(winL);
    return { bg: 0x0a5a86, fog: [0x0b5f8a, 3, 55], hemi: [0x9fdcff, 0x1a3a4a, 1.0], sun: [0xbfe8ff, 0.8, [5, 40, 8]],
      apply(p, t) { const n = !!p.night; const stm = clamp(p.storm || 0);
        let bg = n ? 0x02121f : 0x0a5a86; bg = mix(bg, 0x0a2f3e, stm).getHex(); this.bg = bg; this.fog = [bg, n ? 2 : 3, lerp(n ? 32 : 55, 40, stm)];
        this.hemi = n ? [0x4a78a8, 0x05121a, 0.55] : [0x9fdcff, 0x1a3a4a, 1.0 - 0.35 * stm]; this.sun = n ? [0x6a8ab8, 0.15, [5, 40, 8]] : [0xbfe8ff, 0.8 * (1 - 0.6 * stm), [5, 40, 8]];
        base.visible = p.base !== false; more.visible = !!p.more;
        const pw = p.power === undefined ? 1 : p.power; const al = clamp(p.alarm || 0); const blink = al > 0 ? (Math.sin(t * 7) > 0 ? 1 : 0.25) : 0;
        winM.color.copy(mix(mix(0x1d3a4a, 0xffd98a, pw), 0xff3030, al * blink)); winL.intensity = pw * (n ? 10 : 4); alarmL.intensity = al * blink * 40;
        const kg = p.kelp === undefined ? 1 : p.kelp; kelps.forEach((o, i) => { o.k.scale.set(1, Math.max(0.03, kg), 1); o.k.visible = kg > 0.02; o.segs.forEach((s2, j) => { s2.rotation.x = Math.sin(t * 0.9 + o.ph + j * 0.5) * 0.12 * (1 + stm); s2.rotation.z = Math.cos(t * 0.7 + o.ph + j * 0.4) * 0.06; }); });
        rotor.rotation.z = -t * (p.spin || 0) * 1.6;
        const bu = p.buoy === undefined ? true : p.buoy; buoyC.visible = bu === true; buoy.visible = bu === true; buoy.position.y = 39.6 + Math.sin(t * (1.2 + stm * 2)) * (0.3 + stm * 2.5); buoy.rotation.z = Math.sin(t * 1.7) * 0.1 * (1 + stm * 3); buoyBroken.visible = bu === 'broken'; if (bu === 'broken') { buoyBroken.rotation.z = Math.sin(t * 1.3) * 0.25; buoyBroken.rotation.x = Math.cos(t * 1.1) * 0.2; }
        const a = SW.attributes.position.array; const amp = 0.4 + stm * 3.5; for (let i = 0; i < a.length; i += 3) { const x = sbase[i], y = sbase[i + 1]; a[i + 2] = Math.sin(x * 0.12 + t * (1.2 + stm * 2)) * amp + Math.cos(y * 0.15 + t * (1 + stm * 2)) * amp; } SW.attributes.position.needsUpdate = true;
        surfM.color.set(n ? 0x14324a : mix(0x8fdcff, 0x3a5a66, stm).getHex());
        const li = n ? 0 : (p.light === undefined ? 1 : p.light) * (1 - stm); shafts.forEach((m, i) => { m.visible = li > 0.01; m.material.opacity = 0.05 * li * (0.7 + 0.3 * Math.sin(t * 0.8 + i)); });
        const sa = snow.geometry.attributes.position; const drift = 0.3 + stm * 4; for (let i = 0; i < sa.count; i++) { sa.setX(i, ((sp0[i * 3] + t * drift * (0.6 + (i % 5) * 0.2) + 35) % 70 + 70) % 70 - 35); sa.setY(i, ((sp0[i * 3 + 1] - t * 0.15 + 16) % 16 + 16) % 16); } sa.needsUpdate = true; snow.material.opacity = 0.45 + 0.4 * stm;
        const gw = clamp(p.glowy || 0); bio.visible = gw > 0.01; bio.material.opacity = gw * (0.75 + 0.25 * Math.sin(t * 2)); bio.rotation.y = t * 0.01;
        const fo = p.fish; fishG.visible = !!fo; if (fo) { const cx = fo.x ?? 4, cy = fo.y ?? 2.2, cz = fo.z ?? 3, rr = fo.r ?? 5, nn = fo.n ?? 48, spd = fo.speed ?? 0.35; fish.forEach((q, i) => { q.f.visible = i < nn; const an = q.a + t * spd * q.sp; const r2 = rr * (0.6 + 0.4 * q.r); q.f.position.set(cx + Math.cos(an) * r2, cy + (q.y - 0.5) * 1.6 + Math.sin(t * 2 + i) * 0.1, cz + Math.sin(an) * r2); q.f.rotation.y = -an + (spd > 0 ? Math.PI : 0); q.f.children[1].rotation.y = Math.sin(t * 12 + i) * 0.5; }); }
        const cb = p.cable || 0; cable.visible = cb > 0.001; cableG.setDrawRange(0, Math.floor(cableN * cb / 3) * 3); } };
  });

  // ================= INTERIOR DE ATLÂNTIDA =================
  // Sala 12 x 7 (x -6..6, z -3.5..3.5), teto 3.2. Janela redonda grande na parede do fundo (0, 1.7, -3.5) r=1.3; janelinhas em x=±3.6.
  // Piscina de entrada (porta molhada) no chão em (3.6, 0, 1.4) r=1. Mesa em (-2.4, 0, 0.9) (tampo y=0.75; bancos z≈0.1 e 1.7, assento 0,45 m).
  // Console na parede x=-6 (telas em y≈1.6, z -2..0). Tanques do ar (máquinas) em (-5.1, 0, 2.6) e (-4.0, 0, 2.9). Beliches em x=5.5, z -3..-1.2.
  // p: power 0..1, alarm 0..1, sun (lâmpada de sol 0..1), night (janela escura), glowy 0..1 (pontos brilhando na janela), fish (bool), screen 'ok'|'red'|'off', haze 0..1 (ar pesado)
  mkEnv('seahab', (g) => {
    const R = rng(66);
    const tileT = cvs(128, 128, (x, w, h) => { x.fillStyle = '#9aa3a8'; x.fillRect(0, 0, w, h); x.strokeStyle = '#7d868b'; x.lineWidth = 4; x.strokeRect(2, 2, w - 4, h - 4); x.fillStyle = '#868f94'; for (const [a, b] of [[12, 12], [116, 12], [12, 116], [116, 116]]) { x.beginPath(); x.arc(a, b, 4, 0, 7); x.fill(); } });
    tileT.wrapS = tileT.wrapT = T.RepeatWrapping; tileT.repeat.set(12, 7); Pl(g, 12, 7, new T.MeshLambertMaterial({ map: tileT }), 0, 0, 0, [-Math.PI / 2, 0, 0]);
    const wallC = 0xe4e6e2; B(g, 12, 3.2, 0.2, wallC, 0, 1.6, -3.6); B(g, 12, 3.2, 0.2, wallC, 0, 1.6, 3.6); B(g, 0.2, 3.2, 7.4, wallC, -6.1, 1.6, 0); B(g, 0.2, 3.2, 7.4, wallC, 6.1, 1.6, 0); B(g, 12.4, 0.2, 7.4, 0xd6d9d6, 0, 3.3, 0);
    for (const z of [-3.45, 3.45]) B(g, 12, 0.14, 0.06, 0xf2b705, 0, 0.9, z); for (const x of [-5.95, 5.95]) B(g, 0.06, 0.14, 7, 0xf2b705, x, 0.9, 0);
    for (let x = -5; x <= 5; x += 2.5) Cy(g, 0.08, 0.08, 7, 0xa8adb0, x, 3.05, 0, { r: [Math.PI / 2, 0, 0] });
    const lightM = new T.MeshBasicMaterial({ color: 0xffffff }); for (let x = -4.5; x <= 4.5; x += 3) B(g, 1.8, 0.05, 0.4, 0xffffff, x, 3.19, 0, { basic: true }).material = lightM;
    // janela grande + janelinhas
    const waterM = new T.MeshBasicMaterial({ color: 0x0f6d9e }); const win = new T.Mesh(new T.CircleGeometry(1.3, 40), waterM); win.position.set(0, 1.7, -3.48); g.add(win);
    const ring = new T.Mesh(new T.TorusGeometry(1.32, 0.1, 8, 40), lam(0x55585e)); ring.position.set(0, 1.7, -3.46); g.add(ring);
    for (const x of [-3.6, 3.6]) { const w = new T.Mesh(new T.CircleGeometry(0.45, 24), waterM); w.position.set(x, 1.8, -3.48); g.add(w); const r2 = new T.Mesh(new T.TorusGeometry(0.47, 0.06, 6, 24), lam(0x55585e)); r2.position.set(x, 1.8, -3.46); g.add(r2); }
    const wfish = []; for (let i = 0; i < 9; i++) { const f = new T.Mesh(new T.CircleGeometry(0.09, 3), new T.MeshBasicMaterial({ color: [0xffb000, 0x9fe8ff, 0xffe066][i % 3] })); f.scale.set(1.8, 0.8, 1); f.position.z = -3.46; g.add(f); wfish.push({ f, y: 1.7 + (R() - 0.5) * 1.6, ph: R() * 10, sp: 0.25 + R() * 0.25 }); }
    const wdots = []; for (let i = 0; i < 40; i++) { const d = new T.Mesh(new T.CircleGeometry(0.025 + R() * 0.02, 6), new T.MeshBasicMaterial({ color: 0x5ff6ff, transparent: true })); let x, y; do { x = (R() - 0.5) * 2.5; y = (R() - 0.5) * 2.5; } while (x * x + y * y > 1.2 * 1.2); d.position.set(x, 1.7 + y, -3.455); g.add(d); wdots.push({ d, ph: R() * 6 }); }
    // piscina de entrada
    const pool = new T.Mesh(new T.CircleGeometry(1.0, 32), new T.MeshBasicMaterial({ color: 0x1aa3d6 })); pool.rotation.x = -Math.PI / 2; pool.position.set(3.6, 0.012, 1.4); g.add(pool);
    const prim = new T.Mesh(new T.TorusGeometry(1.02, 0.07, 6, 32), lam(0xf2b705)); prim.rotation.x = Math.PI / 2; prim.position.set(3.6, 0.05, 1.4); g.add(prim); const ripple = new T.Mesh(new T.RingGeometry(0.3, 0.34, 32), new T.MeshBasicMaterial({ color: 0xbff0ff, transparent: true, opacity: 0.6 })); ripple.rotation.x = -Math.PI / 2; ripple.position.set(3.6, 0.02, 1.4); g.add(ripple);
    // mesa e bancos
    B(g, 2.4, 0.08, 1.1, 0x8a6a4a, -2.4, 0.75, 0.9); for (const [x, z] of [[-3.4, 0.5], [-1.4, 0.5], [-3.4, 1.3], [-1.4, 1.3]]) B(g, 0.08, 0.72, 0.08, 0x555, x, 0.36, z);
    for (const z of [0.1, 1.7]) { B(g, 2.2, 0.08, 0.38, 0x6a6f76, -2.4, 0.45, z); B(g, 0.08, 0.45, 0.3, 0x555, -3.3, 0.22, z); B(g, 0.08, 0.45, 0.3, 0x555, -1.5, 0.22, z); }
    // console
    B(g, 0.7, 1.0, 2.6, 0x5a6068, -5.65, 0.5, -1.0); const scrM = new T.MeshBasicMaterial({ color: 0x1fd36b }); const scrs = []; for (const z of [-1.8, -1.0, -0.2]) { const s = new T.Mesh(new T.PlaneGeometry(0.66, 0.42), scrM); s.position.set(-5.98, 1.6, z); s.rotation.y = Math.PI / 2; g.add(s); scrs.push(s); B(g, 0.04, 0.48, 0.74, 0x222, -6.0, 1.6, z); }
    for (let i = 0; i < 6; i++) B(g, 0.05, 0.05, 0.12, [0xff3030, 0x3ddc6a, 0xffd21f][i % 3], -5.3, 1.02, -2 + i * 0.4, { basic: true });
    // máquinas do ar
    const fans = []; for (const [x, z] of [[-5.1, 2.6], [-4.0, 2.95]]) { Cy(g, 0.42, 0.42, 2.2, 0xb8c2c8, x, 1.1, z); Cy(g, 0.44, 0.44, 0.1, 0x2a6ad6, x, 1.6, z); const f = new T.Group(); f.position.set(x, 2.25, z); B(f, 0.7, 0.03, 0.1, 0x333, 0, 0, 0); B(f, 0.1, 0.03, 0.7, 0x333, 0, 0, 0); g.add(f); fans.push(f); }
    Cy(g, 0.06, 0.06, 3, 0x9aa0a8, -4.5, 2.6, 2.95, { r: [0, 0, Math.PI / 2] });
    // beliches
    for (const y of [0.45, 1.5]) { B(g, 0.9, 0.12, 1.9, 0x2a3a5a, 5.5, y, -2.2); B(g, 0.85, 0.1, 1.8, 0xf4f4f4, 5.5, y + 0.11, -2.2); } for (const z of [-3.1, -1.3]) B(g, 0.06, 1.9, 0.06, 0x555, 5.0, 0.95, z);
    // lâmpada de sol
    const sunM = new T.MeshBasicMaterial({ color: 0x444444 }); const sunP = new T.Mesh(new T.PlaneGeometry(2.0, 1.0), sunM); sunP.rotation.x = Math.PI / 2; sunP.position.set(0.6, 3.18, 1.2); g.add(sunP);
    const sunL = new T.PointLight(0xffd27a, 0, 9); sunL.position.set(0.6, 2.8, 1.2); g.add(sunL); const roomL = new T.PointLight(0xffffff, 0, 16); roomL.position.set(0, 2.9, 0); g.add(roomL); const alarmL = new T.PointLight(0xff2020, 0, 16); alarmL.position.set(0, 2.9, 0.5); g.add(alarmL);
    const hz = new T.Mesh(new T.BoxGeometry(11.8, 3.1, 7), new T.MeshBasicMaterial({ color: 0x6a7a50, transparent: true, opacity: 0, depthWrite: false, side: T.BackSide })); hz.position.set(0, 1.6, 0); g.add(hz);
    return { bg: 0x0d1a24, fog: null, hemi: [0xffffff, 0x8a9096, 1.2], sun: [0xffffff, 0.5, [3, 10, 6]],
      apply(p, t) { const pw = p.power === undefined ? 1 : p.power; const al = clamp(p.alarm || 0); const blink = al > 0 ? (Math.sin(t * 7) > 0 ? 1 : 0.2) : 0;
        this.hemi = [mix(0x6a9ac8, 0xffffff, pw).getHex(), 0x6a7076, 0.35 + 0.95 * pw]; this.sun = [0xffffff, 0.15 + 0.4 * pw, [3, 10, 6]];
        lightM.color.copy(mix(0x2a2a2a, 0xffffff, pw)); roomL.intensity = 6 * pw; alarmL.intensity = 18 * al * blink;
        waterM.color.set(p.night ? 0x041c2c : 0x0f6d9e); wfish.forEach((o, i) => { const x = ((t * o.sp + o.ph) % 3) - 1.5; const dy = o.y - 1.7; const ok = !!p.fish && !p.night && x * x + dy * dy < 1.1 * 1.1; o.f.visible = ok; o.f.position.x = x; o.f.position.y = o.y + Math.sin(t * 2 + i) * 0.03; });
        const gw = clamp(p.glowy || 0); wdots.forEach((o, i) => { o.d.visible = gw > 0.01; o.d.material.opacity = gw * (0.5 + 0.5 * Math.sin(t * 2.5 + o.ph)); });
        const sc = p.screen || (pw > 0.3 ? 'ok' : 'off'); scrM.color.set(sc === 'red' ? (Math.sin(t * 6) > 0 ? 0xff3030 : 0x6a1010) : sc === 'off' ? 0x111418 : 0x1fd36b);
        fans.forEach(f => f.rotation.y = t * 12 * pw); ripple.scale.setScalar(1 + ((t * 0.6) % 1) * 1.8); ripple.material.opacity = 0.6 * (1 - ((t * 0.6) % 1));
        const sn = clamp(p.sun || 0); sunM.color.copy(mix(0x444444, 0xfff1b0, sn)); sunL.intensity = sn * 25;
        hz.material.opacity = 0.18 * clamp(p.haze || 0); } };
  });
}
