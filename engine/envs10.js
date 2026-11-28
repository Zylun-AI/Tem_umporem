// Cenário "mountain": vila nos Andes a ~4.200 m (longo "nas montanhas"). Chão da vila (praça) em y=0 em volta da origem.
//  - TERRENO: platô plano em x -30..30, z -38..28. Atrás (z<-38) uma rampa íngreme sobe até a crista da morena (barragem natural) em z≈-60, y≈21.
//    Atrás dela o LAGO DO GLACIAR (superfície em y=lakeY, x -32..32, z -100..-60; centro (0, lakeY, -80)). Mais atrás (z<-100) o paredão de gelo
//    do glaciar (frente em z≈-98, y 15..45) e as montanhas nevadas. Na frente (z>28) o terreno despenca até as planícies quentes lá embaixo (y≈-220).
//    Use H(x,z) exportado em g.userData.H para pôr coisas no chão fora do platô.
//  - CASAS de pedra (telhado de zinco) em MOUNT_HOUSES (abaixo); praça livre em raio 6 em volta da origem. p.more = mais casas (anos depois).
//  - ESTUFAS: 2 túneis translúcidos em (-21, 0, 5) e (-21, 0, 13) (eixo ao longo de x, 8 m de comprimento, 3 de largura, porta em x=-17).
//  - TERRAÇOS (andenes) descendo na frente: 6 degraus, z 30..51, x -25..25, topo do degrau k em y=-0.2-2.2k, centro z=31.75+3.5k.
//  - CURRAL DAS LHAMAS em (15, 0, 12) (cerca 8x6). p.llamas = quantas (0..6, padrão 4).
//  - SIFÕES (p.siphon 0..1): 4 mangueiras pretas do lago, por cima da crista (y≈21.5, z=-60), descendo a rampa até z≈-44 (x=-6,-2,2,6), com jato d'água na ponta.
//  - p.lake 0..1 nível do lago (1 = cheio, y 18.6; 0 = baixo, y 13.5). p.calve 0..1 bloco de gelo despencando do glaciar no lago em (6, *, -92).
//    p.wave 0..1 onda em anel saindo do ponto da queda. p.spill 0..1 água transbordando da crista e descendo a rampa até a vila (1 = chega na praça).
//  - p.tod 'day'|'dusk'|'night'|'storm', p.snow 0..1 neve caindo, p.frost 0..1 geada (plantas morrem/ficam brancas), p.plant 0..1 plantações,
//    p.power 0..1 janelas acesas, p.heat 0..1 planícies lá embaixo vermelhas/laranja (calor), p.sea 0..1 mar subindo e cobrindo as planícies lá embaixo, p.stars (noite).
// Câmera: dentro do platô fique a >2 m das casas (MOUNT_HOUSES) e fora das estufas; o lago é visto de cima da crista (y>23) ou do platô.
export const MOUNT_HOUSES = [[-9, -7, 0.2], [-2.5, -11, 0], [5, -10, -0.15], [11, -5, -0.5], [-12, 3, 0.6], [11, 2, -0.9], [-7, 13, 2.8], [4, 15, 3.3]];
export const MOUNT_MORE = [[-17, -10, 0.3], [17, -9, -0.6], [-16, 21, 2.6], [10, 22, 3.6], [0, -17, 0], [20, 20, -2.4], [-24, -4, 1.2]];
export function mountainEnvs(U) {
  const { THREE, B, Cy, Sp, cvs, mkEnv, rng, lam, sky, clamp, lerp } = U;
  const T = THREE;
  const H = (x, z) => {
    let h = 0; const ax = Math.abs(x);
    if (ax > 32) { const w = ax - 32; h += w < 40 ? w * w * 0.02 + w * 0.3 : 44 + (w - 40) * 0.15; }
    if (z < -38) { const u = -38 - z; h += u < 22 ? u * 0.95 : u < 62 ? 20.9 - 9 * Math.sin(Math.PI * (u - 22) / 40) : 20.9 + Math.min(50, (u - 62) * 0.8) + Math.max(0, u - 125) * 0.12; }
    if (z > 28) { const u = z - 28; h -= u < 120 ? u * u * 0.012 + u * 0.4 : 220.8 + (u - 120) * 0.05; }
    const plat = (ax < 28 && z > -36 && z < 26) ? 0.08 : 1;
    h += (Math.sin(x * 0.13) * Math.cos(z * 0.11) + Math.sin(x * 0.05 + z * 0.07)) * 0.7 * plat;
    return h;
  };
  mkEnv('mountain', (g) => {
    const R = rng(1010); const skyM = sky(g); g.userData.H = H;
    // ===== TERRENO =====
    const TG = new T.PlaneGeometry(900, 900, 220, 220); TG.rotateX(-Math.PI / 2); const tp = TG.attributes.position; const tc = new Float32Array(tp.count * 3); TG.setAttribute('color', new T.BufferAttribute(tc, 3));
    const cA = new T.Color(0xa89a5c), cB = new T.Color(0x7d8a4a), cRock = new T.Color(0x7a7066), cSnow = new T.Color(0xf4f7fb), cLow = new T.Color(0xb88a5a), cHot = new T.Color(0xd8642a);
    const lowIdx = [];
    for (let i = 0; i < tp.count; i++) { const x = tp.getX(i), z = tp.getZ(i); const y = H(x, z); tp.setY(i, y); let c;
      const n = (Math.sin(x * 0.7) * Math.cos(z * 0.6) + 1) * 0.5;
      if (y < -60) { c = cLow.clone(); lowIdx.push(i); }
      else if (y < 26) c = cA.clone().lerp(cB, n * 0.6).lerp(cRock, clamp((y - 8) / 18) * 0.7 + clamp((-y - 8) / 40) * 0.6);
      else c = cRock.clone().lerp(cSnow, clamp((y - 24) / 10 + n * 0.3 + (z < -100 ? 0.8 : 0)));
      tc[i * 3] = c.r; tc[i * 3 + 1] = c.g; tc[i * 3 + 2] = c.b; }
    TG.computeVertexNormals(); const terrain = new T.Mesh(TG, new T.MeshLambertMaterial({ vertexColors: true })); g.add(terrain);
    // trilha de terra na praça
    const plaza = new T.Mesh(new T.CircleGeometry(6.5, 32), lam(0x9a8a6a)); plaza.rotation.x = -Math.PI / 2; plaza.position.y = 0.03; g.add(plaza);
    // pedras soltas
    for (let i = 0; i < 160; i++) { const x = (R() - 0.5) * 120, z = -36 + R() * 64; if (Math.abs(x) < 26 && z > -30 && z < 26 && R() < 0.85) continue; const m = new T.Mesh(new T.DodecahedronGeometry(0.2 + R() * 0.7, 0), lam(R() < 0.5 ? 0x6e655c : 0x8a8178)); m.position.set(x, H(x, z), z); m.rotation.set(R() * 3, R() * 3, 0); m.scale.y = 0.6; g.add(m); }
    // ===== MONTANHAS AO FUNDO =====
    const peaks = [[-170, -420, 150, 80], [-40, -460, 190, 90], [100, -430, 165, 80], [230, -360, 130, 70], [-290, -300, 125, 70], [340, -180, 110, 65], [-360, -100, 105, 60], [380, 40, 90, 60], [-380, 60, 95, 60]];
    for (const [x, z, h, r] of peaks) { const m = new T.Mesh(new T.ConeGeometry(r, h, 7), lam(0x766c64)); m.position.set(x, h / 2 - 10, z); m.rotation.y = R() * 3; g.add(m);
      const s = new T.Mesh(new T.ConeGeometry(r * 0.42, h * 0.42, 7), lam(0xf6f8fb)); s.position.set(x, h - 10 - h * 0.21 + 0.5, z); s.rotation.y = m.rotation.y; g.add(s); }
    // ===== GLACIAR =====
    const ice = new T.Group(); g.add(ice);
    const iceM = new T.MeshLambertMaterial({ color: 0xdff0ff, emissive: 0x1a3048 });
    const cliff = new T.Mesh(new T.BoxGeometry(64, 30, 14, 16, 6, 2), iceM); { const a = cliff.geometry.attributes.position; for (let i = 0; i < a.count; i++) { if (a.getZ(i) > 0) { a.setZ(i, a.getZ(i) + Math.sin(a.getX(i) * 1.3 + a.getY(i)) * 0.9); } } cliff.geometry.computeVertexNormals(); }
    cliff.position.set(0, 27, -106); ice.add(cliff);
    for (let i = 0; i < 14; i++) B(ice, 0.25, 6 + R() * 14, 0.3, 0x9cc8e8, -28 + i * 4.2 + R(), 26, -98.6, { m: { emissive: 0x16304a } });
    const top = new T.Mesh(new T.PlaneGeometry(80, 60), lam(0xf4f8fc)); top.rotation.x = -Math.PI / 2 + 0.5; top.position.set(0, 48, -125); ice.add(top);
    // bloco que despenca
    const blk = B(g, 9, 11, 6, 0xd6ecff, 6, 34, -96, { m: { emissive: 0x1a3048 } });
    // ===== LAGO =====
    const lakeM = new T.MeshLambertMaterial({ color: 0x3fa0b8, emissive: 0x0d3340, transparent: true, opacity: 0.93 });
    const LG = new T.PlaneGeometry(70, 40, 60, 34); LG.rotateX(-Math.PI / 2); const lb = LG.attributes.position.array.slice(); const lake = new T.Mesh(LG, lakeM); lake.position.set(0, 18.6, -80); g.add(lake);
    const ringM = new T.MeshBasicMaterial({ color: 0xf2fbff, transparent: true, opacity: 0.85 }); const ring = new T.Mesh(new T.TorusGeometry(1, 0.6, 6, 48), ringM); ring.rotation.x = -Math.PI / 2; g.add(ring);
    const splash = []; for (let i = 0; i < 40; i++) splash.push([Sp(g, 0.6 + R() * 0.9, 0xeaf6ff, 0, 0, 0, { seg: 6 }), R() * Math.PI * 2, 0.4 + R() * 0.6, 0.5 + R() * 0.5]);
    // transbordo descendo a rampa
    const SPG = new T.PlaneGeometry(14, 1, 10, 60); const spA = SPG.attributes.position; const spB = spA.array.slice(); const spill = new T.Mesh(SPG, new T.MeshLambertMaterial({ color: 0x9fc8d4, emissive: 0x2a4a55, side: T.DoubleSide })); spill.frustumCulled = false; g.add(spill);
    // ===== SIFÕES =====
    const hoses = new T.Group(); g.add(hoses); const jets = [];
    for (const x of [-6, -2, 2, 6]) { const pts = [new T.Vector3(x, 14, -68), new T.Vector3(x, 19.5, -63), new T.Vector3(x, 21.6, -60), new T.Vector3(x, H(x, -52) + 0.35, -52), new T.Vector3(x, H(x, -45) + 0.3, -45)];
      const tube = new T.Mesh(new T.TubeGeometry(new T.CatmullRomCurve3(pts), 40, 0.22, 8, false), lam(0x202326)); hoses.add(tube);
      const jg = new T.Group(); jg.position.set(x, H(x, -45) + 0.3, -44.8); hoses.add(jg); const dr = []; for (let k = 0; k < 10; k++) dr.push(Sp(jg, 0.16, 0x9fd8ff, 0, 0, 0, { seg: 6, basic: true })); jets.push(dr); }
    // ===== CASAS =====
    const roofC = [0xa83a2a, 0x8a9aa6, 0x2f6a8a, 0xa83a2a, 0x8a9aa6, 0x6a8a3a, 0xa83a2a, 0x2f6a8a];
    const winM = []; const mkHouse = (x, z, ry, k, grp) => { const h = new T.Group(); h.position.set(x, H(x, z) * (Math.abs(x) < 28 && z > -36 && z < 26 ? 0 : 1), z); h.rotation.y = ry; grp.add(h);
      B(h, 4.2, 2.5, 3.4, k % 3 ? 0x8d8478 : 0xa09583, 0, 1.25, 0); for (let i = 0; i < 6; i++) B(h, 0.5 + R() * 0.7, 0.3, 0.05, 0x6e665c, -1.6 + R() * 3.2, 0.3 + R() * 1.9, 1.71);
      const rf = new T.Mesh(new T.CylinderGeometry(0.01, 3.2, 1.3, 4, 1), lam(roofC[k % roofC.length])); rf.rotation.y = Math.PI / 4; rf.scale.set(1.0, 1, 0.82); rf.position.y = 3.1; h.add(rf);
      B(h, 0.9, 1.7, 0.08, 0x5a3b26, -0.9, 0.85, 1.72); const w = B(h, 0.8, 0.6, 0.08, 0x2a3440, 0.9, 1.5, 1.72, { basic: true }); winM.push(w); Cy(h, 0.18, 0.2, 1.2, 0x6e665c, 1.4, 3.3, -0.8); return h; };
    MOUNT_HOUSES.forEach(([x, z, ry], i) => mkHouse(x, z, ry, i, g));
    const more = new T.Group(); g.add(more); MOUNT_MORE.forEach(([x, z, ry], i) => mkHouse(x, z, ry, i + 3, more));
    // ===== ESTUFAS =====
    const plants = []; const ghM = new T.MeshLambertMaterial({ color: 0xe8f6ff, transparent: true, opacity: 0.45, side: T.DoubleSide, depthWrite: false });
    for (const z of [5, 13]) { const gh = new T.Group(); gh.position.set(-21, 0, z); g.add(gh); const tun = new T.Mesh(new T.CylinderGeometry(1.6, 1.6, 8, 20, 1, true, -Math.PI / 2, Math.PI), ghM); tun.rotation.z = Math.PI / 2; gh.add(tun);
      for (let i = -4; i <= 4; i += 2) { const arc = new T.Mesh(new T.TorusGeometry(1.6, 0.04, 4, 20, Math.PI), lam(0xdddddd)); arc.rotation.y = Math.PI / 2; arc.position.x = i; gh.add(arc); }
      B(gh, 7.6, 0.25, 2.4, 0x5a3e28, 0, 0.12, 0); for (let i = 0; i < 12; i++) { const p = Sp(gh, 0.3, 0x3fae4a, -3.3 + (i % 6) * 1.3, 0.4, i < 6 ? -0.6 : 0.6, { seg: 8 }); plants.push(p); } }
    // ===== TERRAÇOS =====
    const crops = []; for (let k = 0; k < 6; k++) { const y = -0.2 - k * 2.2, z = 31.75 + k * 3.5; B(g, 50, 30, 3.5, 0x8a7a5c, 0, y - 15, z); B(g, 50, 0.12, 3.5, 0x6a5238, 0, y + 0.02, z); B(g, 50, 2.3, 0.4, 0x7a7066, 0, y - 1.1 + 0.05, z + 1.75);
      for (let i = 0; i < 16; i++) { const p = Sp(g, 0.42, 0x3c8a3a, -23 + i * 3.05, y + 0.3, z - 0.6 + (i % 2) * 1.2, { seg: 7, s: [1, 0.7, 1] }); crops.push(p); } }
    // ===== LHAMAS =====
    for (const [a, b, L, r] of [[11, 12, 8, 0], [19, 12, 8, 0], [15, 9, 6, Math.PI / 2], [15, 15, 6, Math.PI / 2]]) { const f = new T.Group(); f.position.set(a, 0, b); f.rotation.y = r; g.add(f); B(f, 0.08, 0.08, L, 0x7a5a3a, 0, 0.9, 0); B(f, 0.08, 0.08, L, 0x7a5a3a, 0, 0.5, 0); for (let s = -L / 2; s <= L / 2; s += 2) B(f, 0.12, 1.1, 0.12, 0x6a4a2a, 0, 0.55, s); }
    const llamas = []; const LC = [0xf2ede2, 0x8a5a3a, 0xe8e0d0, 0x3a2a22, 0xc9a77a, 0xf2ede2];
    for (let i = 0; i < 6; i++) { const l = new T.Group(); g.add(l); const c = LC[i]; B(l, 0.5, 0.5, 1.2, c, 0, 1.0, 0); B(l, 0.26, 0.9, 0.26, c, 0, 1.55, 0.55); B(l, 0.28, 0.26, 0.45, c, 0, 2.05, 0.7); B(l, 0.07, 0.22, 0.07, c, -0.08, 2.28, 0.6); B(l, 0.07, 0.22, 0.07, c, 0.08, 2.28, 0.6);
      B(l, 0.04, 0.05, 0.02, 0x111111, -0.1, 2.1, 0.93); B(l, 0.04, 0.05, 0.02, 0x111111, 0.1, 2.1, 0.93); for (const [lx, lz] of [[-0.16, -0.45], [0.16, -0.45], [-0.16, 0.45], [0.16, 0.45]]) B(l, 0.13, 0.78, 0.13, c, lx, 0.39, lz); B(l, 0.16, 0.2, 0.16, c, 0, 1.15, -0.65);
      llamas.push([l, 13 + (i % 3) * 2.1 + R() * 0.4, 10.2 + Math.floor(i / 3) * 3.2 + R() * 0.4, R() * 6, R()]); }
    // ===== CIDADE LÁ EMBAIXO (planície quente) =====
    const low = new T.Group(); g.add(low); for (let i = 0; i < 60; i++) { const x = (R() - 0.5) * 360, z = 250 + R() * 150; const hh = 4 + R() * 22; B(low, 6 + R() * 8, hh, 6 + R() * 8, 0x9a8a80, x, -221 + hh / 2, z); }
    const haze = new T.Mesh(new T.PlaneGeometry(900, 90), new T.MeshBasicMaterial({ color: 0xff7a30, transparent: true, opacity: 0, depthWrite: false, fog: false })); haze.position.set(0, -190, 330); haze.rotation.y = Math.PI; g.add(haze);
    const seaM = new T.MeshLambertMaterial({ color: 0x2a6a9a, emissive: 0x0a2236 }); const sea = new T.Mesh(new T.PlaneGeometry(1400, 700), seaM); sea.rotation.x = -Math.PI / 2; sea.position.set(0, -221, 420); g.add(sea);
    // ===== NEVE / ESTRELAS =====
    const NS = 1500; const sp = new Float32Array(NS * 3); const ss = []; for (let i = 0; i < NS; i++) ss.push([R() * 90 - 45, R() * 30, R() * 90 - 55, R()]);
    const sgm = new T.BufferGeometry(); sgm.setAttribute('position', new T.BufferAttribute(sp, 3)); const snow = new T.Points(sgm, new T.PointsMaterial({ color: 0xffffff, size: 0.18 })); snow.frustumCulled = false; g.add(snow);
    const stp = new Float32Array(900 * 3); for (let i = 0; i < 900; i++) { const a = R() * Math.PI * 2, e = 0.1 + R() * 1.3; stp[i * 3] = Math.cos(a) * Math.cos(e) * 500; stp[i * 3 + 1] = Math.sin(e) * 500; stp[i * 3 + 2] = Math.sin(a) * Math.cos(e) * 500; }
    const stg = new T.BufferGeometry(); stg.setAttribute('position', new T.BufferAttribute(stp, 3)); const stars = new T.Points(stg, new T.PointsMaterial({ color: 0xffffff, size: 2.2, sizeAttenuation: false, fog: false })); g.add(stars);

    return { bg: 0x9fc8ee, fog: [0xc8dcf0, 150, 950], hemi: [0xffffff, 0x8a7a60, 1.05], sun: [0xfff4e0, 1.05, [60, 80, 30]],
      apply(p, t) {
        const tod = p.tod || 'day'; const st = tod === 'storm', ni = tod === 'night', du = tod === 'dusk';
        const topc = st ? 0x4a5560 : ni ? 0x040818 : du ? 0x3a3a7a : 0x2a6fd0, hor = st ? 0x8a949c : ni ? 0x121c3a : du ? 0xff9a5a : 0xcfe4f6; skyM.userData.set(topc, hor);
        this.bg = hor; this.fog = st ? [0x8a949c, 40, 320] : ni ? [0x0c1430, 120, 800] : du ? [0xd8987a, 150, 900] : [0xc8dcf0, 150, 950];
        this.hemi = st ? [0xc8d4dc, 0x4a4a50, 0.85] : ni ? [0x7a90d8, 0x101830, 0.55] : du ? [0xffd0b0, 0x3a3050, 0.9] : [0xffffff, 0x8a7a60, 1.05];
        this.sun = st ? [0xd0dce4, 0.35, [20, 60, -40]] : ni ? [0x9ab4ff, 0.3, [-30, 60, 20]] : du ? [0xffa060, 0.85, [80, 25, 60]] : [0xfff4e0, 1.05, [60, 80, 30]];
        stars.visible = ni && p.stars !== false;
        // calor lá embaixo
        const hk = p.heat || 0; haze.material.opacity = hk * 0.45; for (const i of lowIdx) { const c = cLow.clone().lerp(cHot, hk); tc[i * 3] = c.r; tc[i * 3 + 1] = c.g; tc[i * 3 + 2] = c.b; } TG.attributes.color.needsUpdate = true;
        const sk2 = p.sea || 0; sea.visible = sk2 > 0; sea.position.y = lerp(-223, -170, sk2);
        // lago
        const ly = lerp(13.5, 18.6, p.lake ?? 1); lake.position.y = ly; const la = LG.attributes.position.array; const wv = p.wave || 0;
        for (let i = 0; i < la.length; i += 3) { const x = lb[i], z = lb[i + 2] - 80; const dx = x - 6, dz = z + 92; const r = Math.hypot(dx, dz); const R0 = wv * 42; la[i + 1] = Math.sin(x * 0.4 + t * 1.3) * 0.08 + (wv > 0 && wv < 1 ? Math.exp(-Math.pow((r - R0) / 3, 2)) * 3.2 * (1 - wv * 0.5) : 0); }
        LG.attributes.position.needsUpdate = true; LG.computeVertexNormals(); lakeM.color.set(st || ni ? 0x2a6a80 : 0x3fa0b8);
        ring.visible = wv > 0.01 && wv < 1; if (ring.visible) { const R0 = Math.max(0.5, wv * 42); ring.position.set(6, ly + 0.4, -92); ring.scale.set(R0, R0, 1); ringM.opacity = 0.8 * (1 - wv); }
        // bloco de gelo
        const cv = p.calve || 0; blk.visible = cv > 0 || p.block === true; { const f = clamp(cv * 1.4); blk.position.set(6, lerp(34, ly - 2, f * f), lerp(-96, -91, f)); blk.rotation.set(f * 0.9, 0, f * 0.4); if (cv >= 1) blk.visible = false; }
        const sk = clamp((cv - 0.68) * 3); splash.forEach(([m, a, s, v]) => { m.visible = sk > 0 && sk < 1; if (!m.visible) return; const r = sk * 14 * s; m.position.set(6 + Math.cos(a) * r, ly + Math.sin(sk * Math.PI) * 18 * v, -91 + Math.sin(a) * r * 0.7); m.scale.setScalar(1 - sk * 0.6); });
        // transbordo
        const sp2 = p.spill || 0; spill.visible = sp2 > 0.01; if (spill.visible) { const zEnd = lerp(-60, -2, sp2); for (let i = 0; i < spA.count; i++) { const u = spB[i * 3] / 14 + 0.5, v = clamp(0.5 - spB[i * 3 + 1]); const z = lerp(-61, zEnd, v); const x = lerp(-7, 7, u) * (1 + v * 0.9); spA.setXYZ(i, x, H(x, z) + 0.35 + Math.sin(x * 2 + t * 9 + z) * 0.12, z); } spA.needsUpdate = true; SPG.computeVertexNormals(); }
        // sifões
        const sf = p.siphon || 0; hoses.visible = sf > 0.01; jets.forEach((dr, j) => dr.forEach((d, k) => { const u = ((t * 1.6 + k / 10 + j * 0.13) % 1); d.position.set(0, 0.3 * Math.sin(u * Math.PI) * 1.4 - u * 0.4, u * 2.2); d.visible = sf > 0.5; }));
        // casas, luzes
        more.visible = !!p.more; const pw = p.power ?? (ni || st ? 1 : 0); winM.forEach((w, i) => w.material.color.set(pw > 0.5 && (ni || du || st) ? (i % 3 ? 0xffd98a : 0xffc070) : 0x2a3440));
        // plantas
        const pl = p.plant ?? 1, fr = p.frost || 0; const gc = new T.Color(0x3fae4a).lerp(new T.Color(0xe8eef2), fr); const cc = new T.Color(0x3c8a3a).lerp(new T.Color(0xdfe6ea), fr);
        plants.forEach((m, i) => { const s = clamp(pl * 1.4 - (i % 4) * 0.08); m.visible = s > 0.03; m.scale.setScalar(Math.max(0.01, s)); m.material.color.copy(gc); });
        crops.forEach((m, i) => { const s = clamp(pl * 1.3 - (i % 5) * 0.06); m.visible = s > 0.03; m.scale.set(s, s * 0.7, s); m.material.color.copy(cc); });
        // lhamas
        const nl = p.llamas ?? 4; llamas.forEach(([l, x, z, ph, k], i) => { l.visible = i < nl; l.position.set(x + Math.sin(t * 0.3 + ph) * 0.5, 0, z + Math.cos(t * 0.25 + ph) * 0.3); l.rotation.y = ph + Math.sin(t * 0.2 + k * 6) * 0.6; l.children[1].rotation.x = Math.sin(t * 0.8 + ph) * 0.1; });
        // neve
        const sn = p.snow ?? (st ? 1 : 0); snow.visible = sn > 0; if (sn > 0) { const n = Math.floor(NS * sn); for (let i = 0; i < NS; i++) { const s = ss[i]; const o = i * 3; if (i >= n) { sp.fill(0, o, o + 3); continue; } sp[o] = s[0] + Math.sin(t * 0.7 + s[3] * 9) * 1.2 + (st ? t * 6 % 90 : 0); sp[o + 1] = ((s[1] - t * (st ? 5 : 1.6)) % 30 + 30) % 30; sp[o + 2] = s[2]; if (sp[o] > 45) sp[o] -= 90; } sgm.attributes.position.needsUpdate = true; }
      } };
  });
}
