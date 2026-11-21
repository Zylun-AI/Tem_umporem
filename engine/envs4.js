// Cenário "cave": cidade subterrânea dentro de uma caverna (longo "debaixo da terra").
// Chão y=0. Caverna: domo de rocha centrado em (0,0,-10), raio 26, altura ~12 no meio.
//  - "sol de mentira" no teto em (0, 11.2, -10) — p.sun 0..1 (dia artificial), p.power 0..1 (energia geral)
//  - casas escavadas: anel de casinhas em x=±15 (z −24..−2) e no fundo (z≈−27)
//  - fazenda de LED: canteiros x 4..12, z −16..−6, barras rosa a y=2.6; p.plant 0..1, p.dead 0..1
//  - poço do elevador (luz vertical) em (−11, 0, −20); poço geotérmico (vapor) em (9, 0, −22)
//  - p.water 0..1 = água cobrindo o chão (até ~1,2 m); p.alarm = luz vermelha piscando; p.lights = luzinhas de festa
//  - p.lamp 0..1 = painel de lâmpadas especiais (vitamina D) em (−4, 0, −14)
// Câmera: fique com |x|<18 e z<12 (dentro do domo).
export function caveEnvs(U) {
  const { THREE, B, Cy, Sp, Pl, cvs, mkEnv, rng, mix, clamp, lerp, lam } = U;
  const T = THREE;
  mkEnv('cave', (g) => {
    const R = rng(404);
    // domo de rocha
    const dg = new T.SphereGeometry(26, 48, 24, 0, Math.PI * 2, 0, Math.PI / 2); const pa = dg.attributes.position; const cols = new Float32Array(pa.count * 3);
    for (let i = 0; i < pa.count; i++) { const x = pa.getX(i), y = pa.getY(i), z = pa.getZ(i); const n = 1 + 0.06 * Math.sin(x * 0.7 + z * 0.3) + 0.05 * Math.sin(y * 1.3 + x * 0.4) + (R() - 0.5) * 0.05; pa.setXYZ(i, x * n, y * n, z * n); const s = 0.75 + R() * 0.35; cols.set([0.42 * s, 0.35 * s, 0.29 * s], i * 3); }
    dg.setAttribute('color', new T.BufferAttribute(cols, 3)); dg.computeVertexNormals();
    const dome = new T.Mesh(dg, new T.MeshLambertMaterial({ vertexColors: true, side: T.BackSide, flatShading: true })); dome.scale.set(1, 0.46, 1); dome.position.set(0, 0, -10); g.add(dome);
    // chão
    const fl = cvs(256, 256, (x, w, h) => { x.fillStyle = '#6b5a48'; x.fillRect(0, 0, w, h); const r2 = rng(9); for (let i = 0; i < 400; i++) { x.fillStyle = r2() < 0.5 ? 'rgba(0,0,0,.08)' : 'rgba(255,255,255,.05)'; x.fillRect(r2() * w, r2() * h, 3 + r2() * 8, 3 + r2() * 8); } }); fl.wrapS = fl.wrapT = T.RepeatWrapping; fl.repeat.set(10, 10);
    Pl(g, 60, 60, new T.MeshLambertMaterial({ map: fl }), 0, 0, -10, [-Math.PI / 2, 0, 0]);
    const plaza = new T.Mesh(new T.CircleGeometry(5, 32), lam(0x8a7a66)); plaza.rotation.x = -Math.PI / 2; plaza.position.set(0, 0.01, -8); g.add(plaza);
    // pedras soltas e estalactites
    for (let i = 0; i < 40; i++) { const a = R() * Math.PI * 2, r = 16 + R() * 7; const s = 0.4 + R() * 1.2; const m = new T.Mesh(new T.DodecahedronGeometry(s, 0), lam(0x5a4a3e)); m.position.set(Math.cos(a) * r, s * 0.4, -10 + Math.sin(a) * r); m.rotation.set(R(), R(), R()); g.add(m); }
    for (let i = 0; i < 26; i++) { const a = R() * Math.PI * 2, r = 6 + R() * 14; const h = 0.8 + R() * 1.8; const m = new T.Mesh(new T.ConeGeometry(0.25 + R() * 0.3, h, 6), lam(0x5e4e42)); const x = Math.cos(a) * r, z = -10 + Math.sin(a) * r; const top = 0.46 * Math.sqrt(Math.max(0, 26 * 26 - x * x - (z + 10) * (z + 10))); m.position.set(x, top - h / 2 + 0.3, z); m.rotation.x = Math.PI; g.add(m); }
    // casinhas escavadas
    const winM = new T.MeshBasicMaterial({ color: 0xffd98a }); const houseCols = [0xe8c9a0, 0xd9a07a, 0xc9d3a0, 0xa0c4d9, 0xe0b0c0, 0xf0e0b0];
    const house = (x, z, ry, k) => { const h = new T.Group(); h.position.set(x, 0, z); h.rotation.y = ry; B(h, 3.4, 2.6, 2.6, houseCols[k % 6], 0, 1.3, 0); B(h, 3.6, 0.25, 2.8, 0x6b5a48, 0, 2.7, 0); B(h, 0.8, 1.5, 0.08, 0x5a3b26, -0.7, 0.75, 1.31); const w = B(h, 0.8, 0.6, 0.08, 0xffd98a, 0.8, 1.5, 1.31); w.material = winM; g.add(h); return h; };
    let k = 0; for (const sx of [-1, 1]) for (let z = -24; z <= -2; z += 4.4) { if (sx > 0 && z > -17 && z < -4) continue; house(sx * 15.2, z, -sx * Math.PI / 2, k++); }
    for (let x = -9; x <= 9; x += 4.5) house(x, -27.5, 0, k++);
    // segundo andar (casinhas mais altas no fundo)
    for (let x = -6.75; x <= 6.75; x += 4.5) { const h = house(x, -29.5, 0, k++); h.position.y = 2.9; }
    // poço do elevador
    Cy(g, 1.3, 1.3, 0.2, 0x3a3f45, -11, 0.1, -20); for (const [dx, dz] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) Cy(g, 0.08, 0.08, 14, 0x6d727a, -11 + dx, 7, -20 + dz);
    const cage = new T.Group(); cage.position.set(-11, 0, -20); B(cage, 1.8, 0.1, 1.8, 0x8a8f96, 0, 0.15, 0); B(cage, 1.8, 0.1, 1.8, 0x8a8f96, 0, 2.4, 0); for (const [dx, dz] of [[-0.85, -0.85], [0.85, -0.85], [-0.85, 0.85], [0.85, 0.85]]) B(cage, 0.06, 2.3, 0.06, 0xf2b705, dx, 1.25, dz); g.add(cage); g.userData.cage = cage;
    const beam = new T.Mesh(new T.CylinderGeometry(1.1, 1.1, 14, 16, 1, true), new T.MeshBasicMaterial({ color: 0xbfe6ff, transparent: true, opacity: 0.12, depthWrite: false, blending: T.AdditiveBlending, side: T.DoubleSide })); beam.position.set(-11, 7, -20); g.add(beam);
    // poço geotérmico (vapor)
    Cy(g, 1.0, 1.2, 1.0, 0x7a6a5a, 9, 0.5, -22); Cy(g, 0.25, 0.25, 4, 0xb06a3a, 9, 2.5, -22); Cy(g, 0.15, 0.15, 6, 0xb06a3a, 6, 4.4, -22, { r: [0, 0, Math.PI / 2] });
    const steam = []; for (let i = 0; i < 10; i++) { const s = new T.Mesh(new T.SphereGeometry(0.4, 8, 6), new T.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.4, depthWrite: false })); g.add(s); steam.push(s); }
    // fazenda de LED
    const ledM = new T.MeshBasicMaterial({ color: 0xff5ad0 }); const leafM = new T.MeshLambertMaterial({ color: 0x3fbf4a }); const leafM2 = new T.MeshLambertMaterial({ color: 0x6ad65a }); const plants = [];
    for (let r = 0; r < 3; r++) { const z = -7 - r * 4; B(g, 8, 0.5, 1.6, 0x8a929e, 8, 0.25, z); B(g, 7.8, 0.06, 1.45, 0x5a3b26, 8, 0.52, z); const bar = B(g, 8, 0.08, 0.5, 0xffffff, 8, 2.6, z); bar.material = ledM; for (const x of [4.2, 11.8]) Cy(g, 0.04, 0.04, 2.6, 0x777c83, x, 1.3, z);
      for (let i = 0; i < 10; i++) { const p = Sp(g, 0.32, i % 2 ? 0x3fbf4a : 0x6ad65a, 4.6 + i * 0.75, 0.75, z); p.material = i % 2 ? leafM : leafM2; p.scale.set(1, 0.8, 1); plants.push(p); } }
    const ledL = new T.PointLight(0xff5ad0, 0, 14); ledL.position.set(8, 2.4, -11); g.add(ledL);
    // painel de lâmpadas especiais (vitamina D)
    const lampG = new T.Group(); lampG.position.set(-4, 0, -14); for (const x of [-1.6, 1.6]) Cy(lampG, 0.06, 0.06, 3, 0x777c83, x, 1.5, 0); const lp = B(lampG, 3.6, 0.3, 1.2, 0xffffff, 0, 3.0, 0.4); const lampM = new T.MeshBasicMaterial({ color: 0xb8e0ff }); lp.material = lampM; g.add(lampG); g.userData.lampG = lampG;
    const lampL = new T.PointLight(0xb8e0ff, 0, 10); lampL.position.set(-4, 2.6, -13.2); g.add(lampL);
    // sol de mentira
    const sunM = new T.MeshBasicMaterial({ color: 0xfff3c0 }); const sunD = new T.Mesh(new T.CircleGeometry(2.4, 32), sunM); sunD.rotation.x = Math.PI / 2; sunD.position.set(0, 11.6, -10); g.add(sunD);
    const halo = new T.Mesh(new T.CircleGeometry(5.5, 32), new T.MeshBasicMaterial({ color: 0xfff0b0, transparent: true, opacity: 0.35, depthWrite: false, blending: T.AdditiveBlending })); halo.rotation.x = Math.PI / 2; halo.position.set(0, 11.5, -10); g.add(halo);
    Cy(g, 2.7, 2.7, 0.3, 0x3a3f45, 0, 11.8, -10);
    const sunL = new T.PointLight(0xfff0c8, 0, 60, 1.2); sunL.position.set(0, 10.5, -10); g.add(sunL);
    // luzinhas de festa
    const bulbs = []; for (let i = 0; i < 48; i++) { const a = i / 48 * Math.PI * 2; const r = 9 + Math.sin(i * 1.7) * 0.6; const m = new T.Mesh(new T.SphereGeometry(0.12, 8, 6), new T.MeshBasicMaterial({ color: [0xffd98a, 0xff7a7a, 0x7affc0, 0x7ab8ff][i % 4] })); m.position.set(Math.cos(a) * r, 5.4 + Math.sin(i * 0.5) * 0.4, -10 + Math.sin(a) * r); g.add(m); bulbs.push(m); }
    // postes de luz
    const poleM = new T.MeshBasicMaterial({ color: 0xffe9a8 }); for (const [x, z] of [[-6, -3], [6, -3], [-6, -14], [-9, -9], [3, -18], [-3, -22]]) { Cy(g, 0.07, 0.07, 3.2, 0x333840, x, 1.6, z); const b = Sp(g, 0.22, 0xffe9a8, x, 3.25, z); b.material = poleM; }
    const poleL = new T.PointLight(0xffe0a0, 0, 40); poleL.position.set(0, 6, -6); g.add(poleL);
    // alarme
    const alarmL = new T.PointLight(0xff2020, 0, 50); alarmL.position.set(0, 6, -4); g.add(alarmL);
    // água
    const water = new T.Mesh(new T.PlaneGeometry(60, 60), new T.MeshLambertMaterial({ color: 0x2f7fb0, transparent: true, opacity: 0.75 })); water.rotation.x = -Math.PI / 2; water.position.set(0, 0, -10); g.add(water);
    return { bg: 0x120d0a, fog: [0x120d0a, 30, 70], hemi: [0xffe6c0, 0x3a2a20, 0.8], sun: [0xfff0c8, 0.5, [0, 12, -6]],
      apply(p, t) { const pw = p.power === undefined ? 1 : clamp(p.power); const sn = (p.sun === undefined ? 1 : clamp(p.sun)) * pw;
        sunM.color.copy(mix(0x2a2622, 0xfff3c0, sn)); halo.material.opacity = 0.35 * sn; sunL.intensity = 260 * sn; poleL.intensity = 40 * pw * (1 - 0.5 * sn) + 8 * pw;
        this.hemi = [mix(0x8a7aa0, 0xffe6c0, sn).getHex(), 0x3a2a20, 0.12 + 0.35 * pw + 0.55 * sn]; this.sun = [0xfff0c8, 0.6 * sn, [0, 12, -6]];
        winM.color.copy(mix(0x2a2622, 0xffd98a, pw)); poleM.color.copy(mix(0x2a2622, 0xffe9a8, pw));
        ledM.color.copy(mix(0x2a2230, 0xff5ad0, pw)); ledL.intensity = 30 * pw;
        const lm = clamp(p.lamp || 0) * pw; lampM.color.copy(mix(0x2a3038, 0xd8f0ff, lm)); lampL.intensity = 40 * lm;
        const al = clamp(p.alarm || 0); alarmL.intensity = al * (Math.sin(t * 7) > 0 ? 120 : 10);
        const li = !!p.lights; bulbs.forEach((b, i) => { b.visible = li; if (li) b.scale.setScalar(0.8 + 0.3 * Math.sin(t * 4 + i)); });
        const gr = p.plant === undefined ? 1 : clamp(p.plant), dead = clamp(p.dead || 0); leafM.color.copy(mix(0x3fbf4a, 0x8a6a2a, dead)); leafM2.color.copy(mix(0x6ad65a, 0x9a7a3a, dead)); plants.forEach(pl => { pl.visible = gr > 0.02; pl.scale.set(gr, gr * 0.8, gr); pl.position.y = 0.55 + 0.2 * gr; });
        const w = clamp(p.water || 0); water.visible = w > 0.001; water.position.y = w * 1.2 + Math.sin(t * 2) * 0.01;
        steam.forEach((s, i) => { const ph = (t * 0.5 + i / 10) % 1; s.position.set(9 + Math.sin(i * 2 + t) * 0.3, 1.1 + ph * 4, -22 + Math.cos(i) * 0.3); s.scale.setScalar(0.4 + ph * 1.4); s.material.opacity = (1 - ph) * 0.45; });
        g.userData.cage.position.y = p.cage || 0;
        this.fog = [0x120d0a, 30 + 20 * sn, 70 + 20 * sn]; } };
  });
}
