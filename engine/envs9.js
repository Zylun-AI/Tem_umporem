// Cenário "ship": navio cargueiro "Andorinhão" em alto-mar (longo "num navio que nunca pode parar").
// O NAVIO FICA PARADO no mundo; o mar, as ondas e a onda gigante se mexem em volta (para "girar", gire a onda gigante com p.rogue.ang).
//  - CONVÉS: piso em y=0, de z=-36 (início da proa) até z=+30 (popa); largura x -7..7. Proa em ponta até z=-46 (convés da proa estreita).
//    Grade (guarda-corpo, y 1.1) nas bordas x=±7. Água (calma) em y≈-4.5.
//  - CASARIO / PONTE DE COMANDO (branco) em x -6..6, z 16..28, 3 andares (até y=9). Porta (aberta, escura) em (0, 0, 16) virada p/ -z.
//    Janelas da ponte em y≈7.6 viradas p/ -z. Chaminé (vermelha/preta) em (0, 9..14, 24) — fumaça: use c.puffs([0,14.5,24], k) no shots.
//  - HORTA: 4 contêineres abertos (2.4 x 1.2 x 6) em x=±4.3, z=-6 e z=-14 (p.green 0..1 plantas).
//  - LONAS DA CHUVA (p.tarp): 2 lonas azuis em funil sobre tambores em x=±3.6, z=6 (topo y≈2.6). Corredor livre no centro x -1.8..1.8.
//  - DESSALINIZADOR: caixa cinza com canos em (5.2, 0, 12) (p.desal = luz verde ligada).
//  - MASTRO DA PROA em (0, 0, -38) (até y=7). PIPA (p.kite 0..1): parafoil vermelha bem à frente/alto (0, 34, -120) com cabo até a proa.
//  - ÂNCORA DE MAR (p.drogue 0..1): corda da proa (0,1,-45) até a lona azul aberta na água em (0,-5,-75).
//  - p.tod 'day'|'dusk'|'night'|'storm', p.waves 0..1 (altura das ondas), p.rain 0..1, p.power 0..1 (luzes do convés e janelas),
//    p.rogue {d, ang, h}: onda gigante; d = distância da crista até o meio do navio (z=0) medida na direção de onde ela vem (ang 0 = vem de -z, de frente pra proa;
//    ang PI/2 = vem de -x, de lado); h altura (padrão 25). d<0 = já passou (ela segue pra trás). p.fish 0..1 (peixes-voadores pulando), p.more (outros barcos = cidade flutuante),
//    p.rust 0..1 (manchas de ferrugem no casario), p.stars (no night), p.engine2 (2º motor/chaminé dupla).
// Câmera: fique fora do casario (x -6..6, z 16..28, y<9) e dos contêineres; dentro do convés use |x|<6.8.
export function shipEnvs(U) {
  const { THREE, B, Cy, Sp, cvs, mkEnv, rng, lam, sky, mix, clamp, lerp } = U;
  const T = THREE;
  mkEnv('ship', (g) => {
    const R = rng(909); const skyM = sky(g);
    // ===== MAR =====
    const OG = new T.PlaneGeometry(1600, 1600, 150, 150); const ob = OG.attributes.position.array.slice();
    const om = new T.MeshLambertMaterial({ color: 0x1f6fb0 }); const ocean = new T.Mesh(OG, om); ocean.rotation.x = -Math.PI / 2; ocean.position.y = -4.5; g.add(ocean);
    // estrelas
    const sp = new Float32Array(900 * 3); for (let i = 0; i < 900; i++) { const a = R() * Math.PI * 2, e = 0.08 + R() * 1.3; sp[i * 3] = Math.cos(a) * Math.cos(e) * 500; sp[i * 3 + 1] = Math.sin(e) * 500; sp[i * 3 + 2] = Math.sin(a) * Math.cos(e) * 500; }
    const sg = new T.BufferGeometry(); sg.setAttribute('position', new T.BufferAttribute(sp, 3)); const stars = new T.Points(sg, new T.PointsMaterial({ color: 0xffffff, size: 2.2, sizeAttenuation: false, fog: false })); g.add(stars);
    // ===== CASCO =====
    const S = new T.Group(); g.add(S);
    const hullC = 0x1d3557, deckC = 0x6f7b74;
    B(S, 14, 6.4, 66, hullC, 0, -3.0, -3); B(S, 14.05, 0.9, 66.05, 0xb3261e, 0, -5.0, -3);                 // casco + faixa vermelha (linha d'água)
    const bowShape = new T.Shape(); bowShape.moveTo(-7, 0); bowShape.lineTo(7, 0); bowShape.lineTo(0, -10); bowShape.lineTo(-7, 0);
    const bow = new T.Mesh(new T.ExtrudeGeometry(bowShape, { depth: 6.4, bevelEnabled: false }), lam(hullC)); bow.rotation.x = Math.PI / 2; bow.position.set(0, 0.2, -36); S.add(bow);
    const bowD = new T.Mesh(new T.ShapeGeometry(bowShape), new T.MeshLambertMaterial({ color: deckC, side: T.DoubleSide })); bowD.rotation.x = Math.PI / 2; bowD.position.set(0, 0.215, -36); S.add(bowD);
    const dt = cvs(128, 128, (x, w, h) => { x.fillStyle = '#6f7b74'; x.fillRect(0, 0, w, h); x.strokeStyle = 'rgba(0,0,0,.18)'; x.lineWidth = 2; for (let i = 0; i < w; i += 32) { x.beginPath(); x.moveTo(i, 0); x.lineTo(i, h); x.stroke(); } const r2 = rng(4); for (let i = 0; i < 60; i++) { x.fillStyle = 'rgba(120,70,30,.12)'; x.fillRect(r2() * w, r2() * h, 6, 3); } });
    dt.wrapS = dt.wrapT = T.RepeatWrapping; dt.repeat.set(4, 18);
    const deck = new T.Mesh(new T.PlaneGeometry(14, 66), new T.MeshLambertMaterial({ map: dt })); deck.rotation.x = -Math.PI / 2; deck.position.set(0, 0.21, -3); S.add(deck);
    // guarda-corpo
    for (const sx of [-1, 1]) { B(S, 0.08, 0.08, 66, 0xe8e8e8, sx * 6.95, 1.1, -3); B(S, 0.06, 0.06, 66, 0xe8e8e8, sx * 6.95, 0.65, -3); for (let z = 29; z > -36; z -= 2.2) B(S, 0.07, 1.1, 0.07, 0xe8e8e8, sx * 6.95, 0.65, z); }
    for (const sx of [-1, 1]) { const L = Math.hypot(7, 10); const m = B(S, 0.08, 0.08, L, 0xe8e8e8, sx * 3.5, 1.1, -41); m.rotation.y = -sx * Math.atan2(7, 10); }
    // ===== CASARIO =====
    const H = new T.Group(); H.position.set(0, 0.2, 22); S.add(H);
    const wt = cvs(256, 256, (x, w, h) => { x.fillStyle = '#f2f2ee'; x.fillRect(0, 0, w, h); x.fillStyle = '#2a3a4a'; for (let f = 0; f < 3; f++) for (let i = 0; i < 6; i++) x.fillRect(14 + i * 40, 26 + f * 84, 26, 30); });
    const hm = [lam(0xf2f2ee), lam(0xf2f2ee), lam(0xf2f2ee), lam(0xf2f2ee), lam(0xf2f2ee), new T.MeshLambertMaterial({ map: wt })];
    const hb = new T.Mesh(new T.BoxGeometry(12, 7, 12), [hm[0], hm[1], hm[2], hm[3], hm[4], hm[5]]); hb.position.set(0, 3.5, 0); H.add(hb);
    const front = new T.Mesh(new T.PlaneGeometry(12, 7), new T.MeshLambertMaterial({ map: wt })); front.position.set(0, 3.5, -6.01); front.rotation.y = Math.PI; H.add(front);
    B(H, 14, 2.2, 8, 0xf2f2ee, 0, 8.1, -1); const bwin = B(H, 13, 1.0, 0.05, 0x3a5a7a, 0, 8.2, -5.03, { basic: true });     // ponte
    B(H, 15, 0.2, 9, 0xd8d8d0, 0, 9.3, -1);
    B(H, 1.6, 2.4, 0.1, 0x1a1e24, 0, 1.2, -6.05);                                                                          // porta
    const rust = []; for (let i = 0; i < 9; i++) { const m = B(H, 0.6 + R() * 1.2, 0.3 + R() * 1.4, 0.03, 0x9a4a1c, -5.5 + R() * 11, 0.6 + R() * 5.5, -6.04); rust.push(m); }
    const fun = new T.Group(); fun.position.set(0, 9.3, 2.5); H.add(fun); B(fun, 3.4, 4.4, 4.0, 0xb3261e, 0, 2.2, 0); B(fun, 3.45, 0.9, 4.05, 0x111111, 0, 4.1, 0); B(fun, 3.46, 0.7, 4.06, 0xffffff, 0, 2.4, 0);
    const fun2 = new T.Group(); fun2.position.set(0, 9.3, 2.5); H.add(fun2); B(fun2, 1.6, 3.8, 2.0, 0xb3261e, 4.2, 1.9, 0); B(fun2, 1.62, 0.7, 2.02, 0x111111, 4.2, 3.5, 0);
    const lampsD = []; for (const [x, z] of [[-5.8, 10], [5.8, 10], [-5.8, -2], [5.8, -2], [-5.8, -18], [5.8, -18], [-5.8, -30], [5.8, -30]]) { Cy(S, 0.05, 0.05, 3, 0x777777, x, 1.7, z); lampsD.push(Sp(S, 0.18, 0xfff0b0, x, 3.25, z, { basic: true })); }
    // ===== HORTA (contêineres abertos) =====
    const plants = []; const CONT = [0x2f6db5, 0xc0392b, 0x2fa35a, 0xe67e22];
    [[-4.3, -6], [4.3, -6], [-4.3, -14], [4.3, -14]].forEach(([x, z], i) => { const c0 = CONT[i]; B(S, 2.4, 1.2, 6, c0, x, 0.8, z); B(S, 2.2, 0.1, 5.8, 0x4a3020, x, 1.35, z); for (let k = 0; k < 10; k++) { const pg = Sp(S, 0.32, 0x3fa34a, x - 0.6 + (k % 2) * 1.2, 1.5, z - 2.5 + Math.floor(k / 2) * 1.25, { s: [1, 0.8, 1] }); plants.push(pg); } });
    // lonas da chuva
    const tarps = []; for (const sx of [-1, 1]) { const tg = new T.Group(); tg.position.set(sx * 3.6, 0.2, 6); S.add(tg); Cy(tg, 0.45, 0.45, 1.1, 0x2a5aa8, 0, 0.55, 0);
      const cone = new T.Mesh(new T.ConeGeometry(1.9, 1.2, 4, 1, true), new T.MeshLambertMaterial({ color: 0x3a86ff, side: T.DoubleSide })); cone.rotation.x = Math.PI; cone.rotation.y = Math.PI / 4; cone.position.y = 2.1; tg.add(cone);
      for (const [a, b] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) Cy(tg, 0.04, 0.04, 2.7, 0x777777, a * 1.3, 1.35, b * 1.3); tarps.push(tg); }
    // dessalinizador
    const ds = new T.Group(); ds.position.set(5.0, 0.2, 12.2); S.add(ds); B(ds, 2.4, 2.0, 2.6, 0x9aa3ab, 0, 1.0, 0); for (let i = 0; i < 3; i++) Cy(ds, 0.1, 0.1, 2.3, 0x5a6670, -1.0 + i * 0.25, 1.1, 1.4, { r: [Math.PI / 2, 0, 0] });
    const dsl = B(ds, 0.3, 0.3, 0.05, 0x30ff6a, -0.6, 1.6, -1.32, { basic: true }); const dsS = cvs(128, 48, (x, w, h) => { x.fillStyle = '#1b2733'; x.fillRect(0, 0, w, h); x.fillStyle = '#9fe8ff'; x.font = '900 22px sans-serif'; x.textAlign = 'center'; x.fillText('ÁGUA DOCE', w / 2, 32); });
    const dsp = new T.Mesh(new T.PlaneGeometry(1.6, 0.6), new T.MeshBasicMaterial({ map: dsS })); dsp.position.set(0.3, 1.5, -1.32); dsp.rotation.y = Math.PI; ds.add(dsp);
    // mastro da proa
    Cy(S, 0.12, 0.15, 7, 0xd8d8d8, 0, 3.7, -38); const mastL = Sp(S, 0.2, 0xff3030, 0, 7.3, -38, { basic: true });
    // nome no casco (lado +x)
    const nm = cvs(512, 96, (x, w, h) => { x.fillStyle = '#ffffff'; x.font = '900 70px sans-serif'; x.textAlign = 'center'; x.fillText('ANDORINHÃO', w / 2, 72); });
    for (const sx of [-1, 1]) { const n = new T.Mesh(new T.PlaneGeometry(10, 1.9), new T.MeshBasicMaterial({ map: nm, transparent: true })); n.position.set(sx * 7.03, -1.6, -26); n.rotation.y = sx * Math.PI / 2; S.add(n); }
    // ===== PIPA =====
    const kite = new T.Group(); g.add(kite); const kc = cvs(256, 128, (x, w, h) => { for (let i = 0; i < 8; i++) { x.fillStyle = i % 2 ? '#ffffff' : '#e03030'; x.fillRect(i * w / 8, 0, w / 8, h); } x.fillStyle = '#ffd21f'; x.font = '900 46px sans-serif'; x.textAlign = 'center'; x.fillText('', w / 2, 80); });
    const kg = new T.CylinderGeometry(16, 16, 30, 24, 1, true, -0.7, 1.4); const km = new T.Mesh(kg, new T.MeshLambertMaterial({ map: kc, side: T.DoubleSide })); km.rotation.z = Math.PI / 2; kite.add(km);
    const kline = new T.Mesh(new T.CylinderGeometry(0.08, 0.08, 1, 6), lam(0x222222)); g.add(kline);
    // ===== ÂNCORA DE MAR =====
    const drog = new T.Group(); g.add(drog); const dc = new T.Mesh(new T.ConeGeometry(4.5, 5, 16, 1, true), new T.MeshLambertMaterial({ color: 0x4aa0ff, emissive: 0x1a4a90, side: T.DoubleSide, transparent: true, opacity: 0.9 })); dc.rotation.x = -Math.PI / 2; drog.add(dc);
    const dline = new T.Mesh(new T.CylinderGeometry(0.09, 0.09, 1, 6), lam(0xd9b36b)); g.add(dline);
    // ===== ONDA GIGANTE =====
    const RG = new T.PlaneGeometry(420, 90, 120, 40); const rb = RG.attributes.position.array.slice(); const rcol = new Float32Array(RG.attributes.position.count * 3); RG.setAttribute('color', new T.BufferAttribute(rcol, 3));
    const rogue = new T.Mesh(RG, new T.MeshLambertMaterial({ vertexColors: true, side: T.DoubleSide, emissive: 0x24504a })); rogue.rotation.order = 'YXZ'; g.add(rogue);
    const rogueY = (lx, ly, h) => { const u = ly; const prof = u < 0 ? Math.exp(-Math.pow(u / 9, 2)) : Math.exp(-Math.pow(u / 22, 2)); return h * prof * (0.85 + 0.15 * Math.cos(lx * 0.02)); };
    // ===== CHUVA =====
    const NR = 2200; const rp = new Float32Array(NR * 6); const rs = []; for (let i = 0; i < NR; i++) rs.push([R() * 120 - 60, R() * 40, R() * 140 - 90]);
    const rgm = new T.BufferGeometry(); rgm.setAttribute('position', new T.BufferAttribute(rp, 3)); const rain = new T.LineSegments(rgm, new T.LineBasicMaterial({ color: 0xbfd4ee, transparent: true, opacity: 0.5 })); rain.frustumCulled = false; g.add(rain);
    // ===== PEIXES-VOADORES =====
    const fishes = []; for (let i = 0; i < 18; i++) { const f = new T.Group(); B(f, 0.12, 0.12, 0.5, 0x9fc4e8, 0, 0, 0); B(f, 0.7, 0.02, 0.22, 0xcfe4ff, 0, 0.03, 0.02); g.add(f); fishes.push({ f, x: -30 + R() * 60, z: -40 + R() * 60, ph: R(), sp: 0.5 + R() * 0.4 }); }
    // ===== OUTROS BARCOS (cidade flutuante) =====
    const more = new T.Group(); g.add(more);
    [[-34, -10, 0.7, 0xe0e0e0], [32, 6, 0.8, 0x2a6ad6], [-26, 40, 0.6, 0x2fa35a], [40, -40, 0.9, 0xd6a31c], [-48, -55, 0.75, 0xc0392b], [22, 52, 0.55, 0xffffff]].forEach(([x, z, s, cc]) => { const b = new T.Group(); b.position.set(x, -4.5, z); b.scale.setScalar(s); more.add(b);
      B(b, 9, 4, 30, cc, 0, 1, 0); B(b, 7, 4, 7, 0xf2f2ee, 0, 5, 9); Cy(b, 0.1, 0.1, 9, 0xdddddd, 0, 7.5, -8); const sail = new T.Mesh(new T.PlaneGeometry(5, 7), new T.MeshLambertMaterial({ color: 0xffffff, side: T.DoubleSide })); sail.position.set(0, 7, -9.5); sail.rotation.y = Math.PI / 2; b.add(sail);
      for (let i = 0; i < 6; i++) B(b, 0.4, 0.4, 0.05, 0xffe9a8, -3 + i * 1.2, 5.5, 5.45, { basic: true }); });
    // ponte entre barcos (cordas com luzinhas)
    const ropes = []; for (const [a, b2] of [[[-7, 1.5, -6], [-30, 0, -10]], [[7, 1.5, 4], [27, 0, 6]]]) { const m = new T.Mesh(new T.CylinderGeometry(0.06, 0.06, 1, 6), lam(0xffd27a)); g.add(m); ropes.push([m, a, b2]); }
    const setLine = (m, a, b2) => { const va = new T.Vector3(...a), vb = new T.Vector3(...b2); m.position.copy(va).add(vb).multiplyScalar(0.5); m.scale.set(1, va.distanceTo(vb), 1); m.quaternion.setFromUnitVectors(new T.Vector3(0, 1, 0), vb.clone().sub(va).normalize()); };
    ropes.forEach(([m, a, b2]) => setLine(m, a, b2));

    return { bg: 0x9fd0f0, fog: [0xbcdcf2, 120, 900], hemi: [0xffffff, 0x335577, 1.05], sun: [0xfff2dd, 1.0, [40, 60, -30]],
      apply(p, t) {
        const tod = p.tod || 'day'; const st = tod === 'storm', ni = tod === 'night', du = tod === 'dusk';
        const top = st ? 0x1c2a26 : ni ? 0x040818 : du ? 0x3a3a7a : 0x2f7fd6, hor = st ? 0x3a4a44 : ni ? 0x101a38 : du ? 0xff9a5a : 0xcfe8ff; skyM.userData.set(top, hor);
        this.bg = hor; this.fog = st ? [0x2c3a36, 40, 380] : ni ? [0x0a1230, 100, 700] : du ? [0xd8907a, 120, 800] : [0xbcdcf2, 120, 900];
        this.hemi = st ? [0x9ab0a8, 0x1a2a2a, 0.75] : ni ? [0x7a90d8, 0x101830, 0.6] : du ? [0xffd0b0, 0x3a3050, 0.9] : [0xffffff, 0x335577, 1.05];
        this.sun = st ? [0xb8c8c0, 0.35, [20, 60, -40]] : ni ? [0x9ab4ff, 0.3, [-30, 60, 20]] : du ? [0xffa060, 0.8, [-60, 18, -80]] : [0xfff2dd, 1.0, [40, 60, -30]];
        om.color.set(st ? 0x1e3a3a : ni ? 0x0c2340 : du ? 0x2a4f80 : 0x1f6fb0); stars.visible = ni && p.stars !== false;
        // ondas
        const A = (p.waves ?? 0.25) * 3.2; const a = OG.attributes.position.array;
        for (let i = 0; i < a.length; i += 3) { const x = ob[i], y = ob[i + 1]; a[i + 2] = A * (Math.sin(x * 0.045 + t * 1.1) * 0.5 + Math.sin(y * 0.06 - t * 1.4) * 0.6 + Math.sin((x + y) * 0.11 + t * 2.1) * 0.25); }
        OG.attributes.position.needsUpdate = true; OG.computeVertexNormals();
        // luzes
        const pw = p.power ?? (ni || st ? 1 : 0); lampsD.forEach(l => l.material.color.set(pw > 0.5 ? 0xfff0b0 : 0x6a6a66)); bwin.material.color.set(pw > 0.5 && (ni || st || du) ? 0xffd98a : 0x3a5a7a); mastL.visible = Math.sin(t * 4) > 0;
        dsl.material.color.set(p.desal === false ? 0x552222 : 0x30ff6a);
        const gr = p.green ?? 0; plants.forEach((pl, i) => { const s = clamp(gr * 1.3 - (i % 5) * 0.06); pl.visible = s > 0.02; pl.scale.set(s, s * 0.8, s); pl.position.y = 1.4 + s * 0.2; });
        tarps.forEach(tg => tg.visible = !!p.tarp); fun2.visible = !!p.engine2; rust.forEach((m, i) => m.visible = (p.rust || 0) > i / 9);
        // pipa
        const kk = p.kite || 0; kite.visible = kline.visible = kk > 0; if (kk > 0) { const kp = new T.Vector3(Math.sin(t * 0.6) * 6, lerp(4, 36, kk) + Math.sin(t * 0.9) * 1.5, lerp(-50, -125, kk)); kite.position.copy(kp); kite.rotation.set(-0.35, 0, Math.sin(t * 0.6) * 0.1); setLine(kline, [0, 1.6, -44], [kp.x, kp.y - 8, kp.z + 4]); }
        // âncora de mar
        const dd = p.drogue || 0; drog.visible = dline.visible = dd > 0; if (dd > 0) { const dz = lerp(-48, -80, dd); drog.position.set(Math.sin(t * 0.7) * 0.8, -4.2, dz); drog.scale.setScalar(clamp(dd * 1.5)); setLine(dline, [0, 1.0, -45.5], [drog.position.x, -3.2, dz + 2.5]); }
        // onda gigante
        const rg = p.rogue; rogue.visible = !!rg; if (rg) { const h = rg.h ?? 30, ang = rg.ang ?? 0, d = rg.d ?? 200; const ra = RG.attributes.position.array; const cc = RG.attributes.color.array;
          const deep = col3(st ? 0x2f6662 : 0x2f7fb0), foam = col3(0xe8f4f4);
          for (let i = 0; i < ra.length; i += 3) { const lx = rb[i], ly = rb[i + 1]; const z = rogueY(lx, ly, h) + Math.sin(lx * 0.2 + t * 3) * 0.4; ra[i + 2] = z; const fk = clamp((z / h - 0.78) * 4.5); cc[i] = lerp(deep[0], foam[0], fk); cc[i + 1] = lerp(deep[1], foam[1], fk); cc[i + 2] = lerp(deep[2], foam[2], fk); }
          RG.attributes.position.needsUpdate = true; RG.attributes.color.needsUpdate = true; RG.computeVertexNormals();
          rogue.rotation.set(-Math.PI / 2, ang, 0); rogue.position.set(-Math.sin(ang) * d, -4.6, -Math.cos(ang) * d); }
        // chuva
        const rk = p.rain || 0; rain.visible = rk > 0; if (rk > 0) { const n = Math.floor(NR * rk); for (let i = 0; i < NR; i++) { const s = rs[i]; const y = ((s[1] - t * 22) % 40 + 40) % 40 - 2; const o = i * 6; if (i >= n) { rp.fill(0, o, o + 6); continue; } rp[o] = s[0]; rp[o + 1] = y; rp[o + 2] = s[2]; rp[o + 3] = s[0] + 0.25; rp[o + 4] = y + 1.1; rp[o + 5] = s[2]; } rgm.attributes.position.needsUpdate = true; }
        // peixes
        const fk2 = p.fish || 0; fishes.forEach((F, i) => { const on = i < fk2 * fishes.length; F.f.visible = on; if (!on) return; const u = ((t * F.sp + F.ph) % 1); F.f.position.set(F.x + u * 14, -4 + Math.sin(u * Math.PI) * (F.land ? 6 : 5.5), F.z); F.f.rotation.x = -Math.cos(u * Math.PI) * 0.6; });
        more.visible = !!p.more; ropes.forEach(([m]) => m.visible = !!p.more);
      } };
    function col3(h) { const c = new T.Color(h); return [c.r, c.g, c.b]; }
  });
}
