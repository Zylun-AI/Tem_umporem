// Cenário "moon": Lua, polo sul — "Base Saudade" (longo "na Lua").
// Chão (regolito cinza) y=0, plano até r≈60; morros depois. Céu sempre preto com estrelas. A Terra fica PARADA no céu, a -x (≈ (-420, 120, -60), r=20).
//  - BASE: habitat principal = monte de regolito (domo achatado r=6) em (0,0,-12); módulo de entrada (caixa) com porta virada p/ +z em (0, 0, -5.6)
//    (porta 1.3 x 2.0, faixa de luz em cima). 2º monte (r=4.5) em (-10, 0, -14). Corredor-tubo entre eles.
//  - ESTUFA: domo de vidro em (11, 0, -9) r=3.6 com canteiros (p.green 0..1 plantas, p.glow 0..1 luz rosa). p.forest = árvores na estufa (anos depois).
//  - MÓDULO DE POUSO (lander) em (-16, 0, 4). p.lander {y} = altura (pousando), p.flame 0..1 fogo do motor.
//  - TORRE SOLAR no morro em (-34, 0, -78) (morro r≈16, topo y≈8); torre até y≈26 com painéis verticais; luz vermelha piscando.
//  - CABO (amarelo, no chão) da base (-1.2, 0, -6) até a torre. Ponto do corte em CUT=(-18, 0, -42). p.cut 0..1 (1 = cabo partido, ponta solta), p.rock 0..1
//    (pedra rolando do morro, passa pelo cabo e para logo ao lado, em (CUT.x-2.6, CUT.z+0.8)), p.spark 0..1 faíscas na emenda, p.cable2 = 2º cabo por outro caminho (x≈+12).
//  - MINA DE GELO: cratera escura em (30, 0, 14) (r 9), gelo brilhando no fundo e máquina com luz.
//  - TÚNEL DE LAVA: p.tube = buraco (poço) em (36, 0, -36) com luzes dentro (cidade nova).
//  - JIPE LUNAR: p.rover {x, z, ry, lights}. Frente do jipe = +z local.
//  - p.tod 'day' (sol rasante vindo de +x, sombras longas) | 'dark' (só a luz azulada da Terra), p.power 0..1 (janelas e postes),
//    p.alarm 0..1 (luz vermelha na entrada), p.more = mais montes/módulos (cidade, anos depois), p.earth (false esconde a Terra), p.ast 0..1 (asteroide indo pra Terra).
// Câmera: fique fora dos montes (domo r=6 em (0,-12), r=4.5 em (-10,-14)), da estufa e do lander; y>0.4.
export function moonEnvs(U) {
  const { THREE, B, Cy, Sp, cvs, mkEnv, rng, lam } = U;
  const T = THREE;
  mkEnv('moon', (g) => {
    const R = rng(808);
    // ===== CHÃO =====
    const gt = cvs(256, 256, (x, w, h) => { x.fillStyle = '#9a9a96'; x.fillRect(0, 0, w, h); const r2 = rng(5); for (let i = 0; i < 900; i++) { x.fillStyle = r2() < 0.5 ? 'rgba(60,60,60,.14)' : 'rgba(220,220,215,.16)'; x.beginPath(); x.arc(r2() * w, r2() * h, 1 + r2() * 5, 0, 7); x.fill(); }
      for (let i = 0; i < 18; i++) { const cx = r2() * w, cy = r2() * h, r = 3 + r2() * 9; x.strokeStyle = 'rgba(40,40,40,.25)'; x.lineWidth = 2; x.beginPath(); x.arc(cx, cy, r, 0, 7); x.stroke(); } });
    gt.wrapS = gt.wrapT = T.RepeatWrapping; gt.repeat.set(70, 70);
    const GG = new T.PlaneGeometry(1200, 1200, 120, 120); const ga = GG.attributes.position;
    for (let i = 0; i < ga.count; i++) { const x = ga.getX(i), y = ga.getY(i); const r = Math.hypot(x, y); const k = Math.max(0, Math.min(1, (r - 60) / 80));
      ga.setZ(i, k * ((Math.sin(x * 0.03) * Math.cos(y * 0.025) * 0.5 + 0.5) * 30 + Math.sin(x * 0.09 + y * 0.05) * 3)); }
    GG.computeVertexNormals(); const ground = new T.Mesh(GG, new T.MeshLambertMaterial({ map: gt })); ground.rotation.x = -Math.PI / 2; g.add(ground);
    // crateras (anel + fundo escuro)
    const crater = (x, z, r, dark = 0x6f6f6c) => { const ring = new T.Mesh(new T.TorusGeometry(r, r * 0.16, 8, 36), lam(0xa8a8a3)); ring.rotation.x = -Math.PI / 2; ring.scale.z = 0.4; ring.position.set(x, 0, z); g.add(ring);
      const fl = new T.Mesh(new T.CircleGeometry(r * 0.95, 32), lam(dark)); fl.rotation.x = -Math.PI / 2; fl.position.set(x, 0.02, z); g.add(fl); return fl; };
    for (const [x, z, r] of [[22, 30, 5], [-30, 24, 7], [44, -10, 6], [-48, -30, 8], [8, 44, 4], [-22, -22, 3], [52, 30, 9], [16, -40, 5]]) crater(x, z, r);
    for (let i = 0; i < 160; i++) { const a = R() * Math.PI * 2, r = 8 + R() * 110; const x = Math.cos(a) * r, z = Math.sin(a) * r; if (x > -22 && x < 18 && z > -22 && z < 10) continue;
      const m = new T.Mesh(new T.DodecahedronGeometry(0.15 + R() * (R() < 0.1 ? 1.2 : 0.5), 0), lam(R() < 0.5 ? 0x7a7a76 : 0x8e8e8a)); m.position.set(x, 0.05, z); m.rotation.set(R() * 3, R() * 3, R() * 3); g.add(m); }
    // ===== MINA DE GELO =====
    const mine = new T.Group(); mine.position.set(30, 0, 14); g.add(mine);
    { const ring = new T.Mesh(new T.TorusGeometry(9, 1.6, 8, 40), lam(0x9c9c98)); ring.rotation.x = -Math.PI / 2; ring.scale.z = 0.5; mine.add(ring); const fl = new T.Mesh(new T.CircleGeometry(8.6, 40), lam(0x34363c)); fl.rotation.x = -Math.PI / 2; fl.position.y = 0.03; mine.add(fl);
      for (let i = 0; i < 26; i++) { const a = R() * 6.28, r = R() * 6.5; const ice = new T.Mesh(new T.DodecahedronGeometry(0.25 + R() * 0.45, 0), new T.MeshBasicMaterial({ color: R() < 0.5 ? 0xbfe8ff : 0x8fd0ff })); ice.position.set(Math.cos(a) * r, 0.1, Math.sin(a) * r); ice.scale.y = 0.5; mine.add(ice); }
      B(mine, 2.2, 1.4, 1.6, 0xe6b422, -2, 0.9, 1, {}); B(mine, 0.3, 3.2, 0.3, 0x555555, -2, 2.4, 1); B(mine, 1.6, 0.2, 0.2, 0x555555, -1.2, 3.9, 1); B(mine, 0.12, 2.6, 0.12, 0x999999, -0.4, 2.6, 1);
      B(mine, 0.4, 0.25, 0.4, 0xfff4c0, -2, 2.0, 1.85, { basic: true }); }
    // ===== BASE =====
    const base = new T.Group(); g.add(base);
    const regMat = new T.MeshLambertMaterial({ map: gt.clone() }); regMat.map.repeat.set(3, 3);
    const mound = (x, z, r, h) => { const m = new T.Mesh(new T.SphereGeometry(r, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2), regMat); m.scale.y = h / r; m.position.set(x, 0, z); base.add(m); return m; };
    mound(0, -12, 6, 4.2); mound(-10, -14, 4.5, 3.2);
    Cy(base, 1.0, 1.0, 5, 0xd6d6d0, -5, 1.0, -13, { r: [0, 0, Math.PI / 2] });
    // módulo de entrada
    B(base, 3.2, 2.9, 3.2, 0xe6e6e0, 0, 1.45, -7.2); const door = B(base, 1.3, 2.0, 0.08, 0x3a4450, 0, 1.0, -5.56); const doorL = B(base, 1.7, 0.16, 0.12, 0xf2a33a, 0, 2.25, -5.56, { basic: true });
    B(base, 3.4, 0.25, 3.4, 0xbdbdb6, 0, 2.95, -7.2); for (const sx of [-1, 1]) B(base, 0.25, 2.9, 0.25, 0xf2a33a, sx * 1.62, 1.45, -5.6);
    const sign = cvs(256, 64, (x, w, h) => { x.fillStyle = '#1d2b3a'; x.fillRect(0, 0, w, h); x.fillStyle = '#ffd21f'; x.font = '900 34px Inter, sans-serif'; x.textAlign = 'center'; x.fillText('BASE SAUDADE', w / 2, 44); });
    const sg = new T.Mesh(new T.PlaneGeometry(2.6, 0.65), new T.MeshBasicMaterial({ map: sign })); sg.position.set(0, 3.45, -5.55); base.add(sg);
    // janelas (faixas) nos montes
    const winMat = new T.MeshBasicMaterial({ color: 0x1d2b3a }); const wins = [];
    for (const [x, z, r, n, sk] of [[0, -12, 6, 8, 1], [-10, -14, 4.5, 4, 0]]) for (let i = 0; i < n; i++) { const ang = (i - (n - 1) / 2) * 0.34; if (sk && Math.abs(ang) < 0.3) continue;
      const rr = r * 0.9; const w = new T.Mesh(new T.BoxGeometry(0.8, 0.45, 0.1), winMat); w.position.set(x + rr * Math.sin(ang), 1.6, z + rr * Math.cos(ang)); w.rotation.y = ang; base.add(w); wins.push(w); }
    // antena e bandeira
    Cy(base, 0.05, 0.05, 4, 0xcccccc, 3.2, 4.4, -12); const dish = new T.Mesh(new T.SphereGeometry(0.9, 16, 8, 0, Math.PI * 2, 0, 0.9), lam(0xeeeeee, { side: T.DoubleSide })); dish.position.set(3.2, 6.4, -12); dish.rotation.set(0.9, 0, 0.7); base.add(dish);
    const flag = new T.Group(); flag.position.set(-3.2, 0, -5.2); Cy(flag, 0.03, 0.03, 3.2, 0xcccccc, 0, 1.6, 0); B(flag, 1.2, 0.75, 0.02, 0x169b3a, 0.62, 2.8, 0); const fd = new T.Mesh(new T.CircleGeometry(0.2, 16), new T.MeshBasicMaterial({ color: 0x1c3f94 })); fd.position.set(0.62, 2.8, 0.02); flag.add(fd); B(flag, 1.2, 0.04, 0.03, 0xffd21f, 0.62, 3.15, 0); base.add(flag);
    // postes de luz
    const lamps = []; for (const [x, z] of [[-3.5, -3], [3.5, -3], [-8, 0], [8, -1], [-12, -6], [6, -16]]) { Cy(base, 0.05, 0.06, 2.6, 0x666666, x, 1.3, z); const hd = Sp(base, 0.2, 0xfff2c0, x, 2.7, z, { basic: true }); lamps.push(hd); }
    const pl1 = new T.PointLight(0xfff0c8, 0, 18); pl1.position.set(0, 3.2, -3.5); base.add(pl1);
    // estufa
    const gh = new T.Group(); gh.position.set(11, 0, -9); base.add(gh);
    Cy(gh, 3.65, 3.65, 0.4, 0xd8d6cf, 0, 0.2, 0, { seg: 32 });
    const glass = new T.Mesh(new T.SphereGeometry(3.6, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2), new T.MeshLambertMaterial({ color: 0xbfe6ff, transparent: true, opacity: 0.25, depthWrite: false, side: T.DoubleSide })); glass.renderOrder = 4; gh.add(glass);
    for (let i = 0; i < 6; i++) { const rib = new T.Mesh(new T.TorusGeometry(3.6, 0.04, 4, 32, Math.PI), lam(0xdadada)); rib.rotation.y = i * Math.PI / 6; gh.add(rib); }
    const plants = []; for (let r = 0; r < 3; r++) for (let k = 0; k < 7; k++) { const x = -2.4 + k * 0.8, z = -1.2 + r * 1.2; if (x * x + z * z > 8) continue; const pg = new T.Group(); pg.position.set(x, 0.55, z); Sp(pg, 0.3, 0x3fbf4a, 0, 0.25, 0, { s: [1, 0.7, 1] }); Sp(pg, 0.2, 0x2f9a3a, 0.16, 0.36, 0.08); gh.add(pg); plants.push(pg); }
    for (let r = 0; r < 3; r++) B(gh, 5.0, 0.3, 0.5, 0x6b4a2f, 0, 0.5, -1.2 + r * 1.2);
    const trees = []; for (const [x, z] of [[-1.4, -0.6], [1.2, 0.4], [0, 1.4], [-0.6, -1.8]]) { const tg = new T.Group(); tg.position.set(x, 0.4, z); Cy(tg, 0.1, 0.14, 1.4, 0x6b4a2f, 0, 0.7, 0); Sp(tg, 0.8, 0x2f9a3a, 0, 1.8, 0); gh.add(tg); trees.push(tg); }
    const ghL = new T.PointLight(0xff5ad8, 0, 12); ghL.position.set(0, 2.6, 0); gh.add(ghL);
    const ghGlow = new T.Mesh(new T.SphereGeometry(3.5, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2), new T.MeshBasicMaterial({ color: 0xff7ae0, transparent: true, opacity: 0, depthWrite: false, side: T.BackSide })); gh.add(ghGlow);
    // mais módulos (cidade)
    const more = new T.Group(); g.add(more);
    for (const [x, z, r] of [[-22, -8, 4], [-20, 6, 3.5], [20, -20, 4.5], [24, 2, 3.5], [-6, -26, 5], [10, -28, 4]]) { const m = new T.Mesh(new T.SphereGeometry(r, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2), regMat); m.scale.y = 0.7; m.position.set(x, 0, z); more.add(m);
      const lw = new T.Mesh(new T.BoxGeometry(r * 1.2, 0.35, 0.1), new T.MeshBasicMaterial({ color: 0xffd98a })); lw.position.set(x, r * 0.35, z + r * 0.86); more.add(lw); }
    for (const [x, z] of [[-14, 18], [14, 16]]) { const g2 = new T.Mesh(new T.SphereGeometry(3, 24, 12, 0, Math.PI * 2, 0, Math.PI / 2), new T.MeshLambertMaterial({ color: 0x9fe6a8, transparent: true, opacity: 0.55 })); g2.position.set(x, 0, z); more.add(g2); Sp(more, 1.6, 0x2f9a3a, x, 1.2, z); }
    // ===== LANDER =====
    const lander = new T.Group(); g.add(lander);
    B(lander, 3.2, 2.2, 3.2, 0xe9e9e4, 0, 3.2, 0); Cy(lander, 1.2, 1.7, 2.2, 0xd8d8d2, 0, 5.4, 0, { seg: 8 }); B(lander, 3.3, 0.3, 3.3, 0xd6a330, 0, 2.05, 0);
    for (let i = 0; i < 4; i++) { const a = i * Math.PI / 2 + Math.PI / 4; const leg = B(lander, 0.18, 3.0, 0.18, 0x888888, Math.cos(a) * 2.3, 1.3, Math.sin(a) * 2.3); leg.rotation.set(Math.sin(a) * 0.45, 0, -Math.cos(a) * 0.45); Cy(lander, 0.4, 0.4, 0.1, 0x888888, Math.cos(a) * 2.9, 0.05, Math.sin(a) * 2.9); }
    B(lander, 0.6, 0.6, 0.1, 0x1d2b3a, 0, 3.4, 1.62, { basic: true }); Cy(lander, 0.5, 0.8, 0.8, 0x444444, 0, 1.7, 0);
    const flame = new T.Mesh(new T.ConeGeometry(0.8, 3.2, 12), new T.MeshBasicMaterial({ color: 0xffb03a, transparent: true, opacity: 0.85 })); flame.rotation.x = Math.PI; flame.position.y = -0.1; lander.add(flame);
    // ===== TORRE SOLAR =====
    const TW = [-34, 0, -78];
    const hill = new T.Mesh(new T.ConeGeometry(18, 8, 24), regMat); hill.position.set(TW[0], 4, TW[2]); g.add(hill);
    const tower = new T.Group(); tower.position.set(TW[0], 7.6, TW[2]); g.add(tower);
    Cy(tower, 0.35, 0.5, 18, 0xdddddd, 0, 9, 0); for (let i = 0; i < 3; i++) { const pn = new T.Group(); pn.position.y = 12 + i * 4.2; pn.rotation.y = i * 0.9; tower.add(pn); for (const sx of [-1, 1]) { const p = B(pn, 3.6, 3.4, 0.12, 0x1d3f8a, sx * 2.1, 0, 0); B(pn, 3.7, 0.08, 0.14, 0xcccccc, sx * 2.1, 1.7, 0); } }
    const beacon = Sp(tower, 0.45, 0xff2a2a, 0, 25.6, 0, { basic: true });
    // ===== CABO =====
    const CUT = new T.Vector3(-18, 0, -42);
    const pts1 = [new T.Vector3(-1.2, 0.08, -5.6), new T.Vector3(-4, 0.08, -18), new T.Vector3(-9, 0.08, -30), new T.Vector3(-14.5, 0.08, -37.5), new T.Vector3(CUT.x + 1.4, 0.08, CUT.z + 1.6)];
    const pts2 = [new T.Vector3(CUT.x - 1.2, 0.08, CUT.z - 1.5), new T.Vector3(-23, 0.08, -50), new T.Vector3(-28, 0.4, -60), new T.Vector3(-32, 4.5, -71), new T.Vector3(TW[0], 7.8, TW[2] + 0.6)];
    const cabMat = lam(0xffb000); const cab1 = new T.Mesh(new T.TubeGeometry(new T.CatmullRomCurve3(pts1), 80, 0.07, 6), cabMat); const cab2 = new T.Mesh(new T.TubeGeometry(new T.CatmullRomCurve3(pts2), 80, 0.07, 6), cabMat); g.add(cab1, cab2);
    const midA = new T.Mesh(new T.TubeGeometry(new T.CatmullRomCurve3([pts1[4], CUT.clone().setY(0.08), pts2[0]]), 12, 0.07, 6), cabMat); g.add(midA);
    // pontas soltas quando o cabo parte
    const endA = new T.Mesh(new T.TubeGeometry(new T.CatmullRomCurve3([pts1[4], new T.Vector3(CUT.x + 0.7, 0.1, CUT.z + 0.3), new T.Vector3(CUT.x + 0.9, 0.12, CUT.z - 0.4)]), 10, 0.07, 6), cabMat); g.add(endA);
    const endB = new T.Mesh(new T.TubeGeometry(new T.CatmullRomCurve3([pts2[0], new T.Vector3(CUT.x - 1.4, 0.1, CUT.z - 0.4), new T.Vector3(CUT.x - 1.8, 0.12, CUT.z + 0.4)]), 10, 0.07, 6), cabMat); g.add(endB);
    const rock = new T.Mesh(new T.DodecahedronGeometry(1.1, 0), lam(0x7d7d79)); g.add(rock);
    const sparks = []; for (let i = 0; i < 14; i++) { const s = Sp(g, 0.05, 0xfff2a0, CUT.x, 0.3, CUT.z, { basic: true }); sparks.push(s); }
    const spL = new T.PointLight(0xfff0a0, 0, 8); spL.position.set(CUT.x, 0.6, CUT.z); g.add(spL);
    // 2º cabo
    const c2 = new T.Mesh(new T.TubeGeometry(new T.CatmullRomCurve3([new T.Vector3(1.2, 0.08, -5.6), new T.Vector3(8, 0.08, -24), new T.Vector3(2, 0.08, -50), new T.Vector3(-18, 0.08, -70), new T.Vector3(-30, 6, -76), new T.Vector3(TW[0], 7.8, TW[2] + 0.6)]), 100, 0.07, 6), lam(0x3ad0ff)); g.add(c2);
    // ===== TÚNEL DE LAVA (poço) =====
    const tube = new T.Group(); tube.position.set(36, 0, -36); g.add(tube);
    { const rim = new T.Mesh(new T.TorusGeometry(7, 1.2, 8, 36), lam(0x8e8e8a)); rim.rotation.x = -Math.PI / 2; rim.scale.z = 0.5; tube.add(rim); const hole = new T.Mesh(new T.CircleGeometry(6.6, 36), new T.MeshBasicMaterial({ color: 0x050507 })); hole.rotation.x = -Math.PI / 2; hole.position.y = 0.04; tube.add(hole);
      for (let i = 0; i < 16; i++) { const a = i / 16 * 6.28; const l = Sp(tube, 0.18, 0xffd98a, Math.cos(a) * (2 + (i % 3) * 1.3), 0.06, Math.sin(a) * (2 + (i % 3) * 1.3), { basic: true }); l.scale.y = 0.3; }
      B(tube, 0.4, 0.4, 7.5, 0xcccccc, -4.5, 0.25, 4, { r: [0, 0.5, 0] }); }
    // ===== JIPE LUNAR =====
    const rover = new T.Group(); g.add(rover);
    B(rover, 2.0, 0.25, 3.2, 0xd8d8d0, 0, 0.7, 0); B(rover, 1.9, 0.1, 1.0, 0x1d3f8a, 0, 1.5, -1.2); for (const sx of [-1, 1]) { B(rover, 0.08, 0.7, 0.08, 0xaaaaaa, sx * 0.9, 1.15, -1.2); }
    B(rover, 0.5, 0.5, 0.5, 0xbbbbbb, 0.5, 1.05, -0.2); B(rover, 0.5, 0.5, 0.5, 0xbbbbbb, -0.5, 1.05, -0.2); B(rover, 1.6, 0.4, 0.3, 0x444444, 0, 1.0, 1.4);
    Cy(rover, 0.03, 0.03, 1.4, 0xcccccc, -0.7, 1.6, 1.0); const rdish = new T.Mesh(new T.SphereGeometry(0.3, 12, 6, 0, Math.PI * 2, 0, 1.0), lam(0xeeeeee, { side: T.DoubleSide })); rdish.position.set(-0.7, 2.35, 1.0); rdish.rotation.x = -1; rover.add(rdish);
    const wheels = []; for (const sx of [-1, 1]) for (const z of [-1.1, 1.1]) { const w = Cy(rover, 0.42, 0.42, 0.3, 0x333333, sx * 1.1, 0.42, z, { r: [0, 0, Math.PI / 2] }); wheels.push(w); }
    const hl = []; for (const sx of [-0.5, 0.5]) hl.push(B(rover, 0.3, 0.2, 0.05, 0xfff6c0, sx, 0.95, 1.6, { basic: true }));
    const rLight = new T.SpotLight(0xfff2c8, 0, 40, 0.5, 0.5); rLight.position.set(0, 1.2, 1.7); rover.add(rLight); const rTgt = new T.Object3D(); rTgt.position.set(0, 0, 12); rover.add(rTgt); rLight.target = rTgt;
    // ===== CÉU =====
    const NS = 2000; const sp = new Float32Array(NS * 3); for (let i = 0; i < NS; i++) { const v = new T.Vector3(R() * 2 - 1, R() * 1.0 + 0.02, R() * 2 - 1).normalize().multiplyScalar(560); sp.set([v.x, v.y, v.z], i * 3); }
    const sgeo = new T.BufferGeometry(); sgeo.setAttribute('position', new T.BufferAttribute(sp, 3)); const stars = new T.Points(sgeo, new T.PointsMaterial({ color: 0xffffff, size: 1.6, sizeAttenuation: false, fog: false })); g.add(stars);
    const et = cvs(512, 256, (x, w, h) => { x.fillStyle = '#1f62c8'; x.fillRect(0, 0, w, h); const r2 = rng(3); x.fillStyle = '#3f9a4a'; for (let i = 0; i < 14; i++) { x.beginPath(); x.ellipse(r2() * w, h * 0.2 + r2() * h * 0.6, 20 + r2() * 50, 14 + r2() * 30, r2() * 3, 0, 7); x.fill(); }
      x.fillStyle = 'rgba(255,255,255,.85)'; for (let i = 0; i < 30; i++) { x.beginPath(); x.ellipse(r2() * w, r2() * h, 20 + r2() * 60, 4 + r2() * 8, r2() * 0.6, 0, 7); x.fill(); } x.fillRect(0, 0, w, 16); x.fillRect(0, h - 18, w, 18); });
    const earth = new T.Group(); earth.position.set(-420, 120, -60); g.add(earth);
    const eb = new T.Mesh(new T.SphereGeometry(20, 32, 20), new T.MeshLambertMaterial({ map: et, emissive: 0x0a1a40, fog: false })); eb.rotation.set(0.3, 1.2, 0); earth.add(eb);
    const eh = new T.Mesh(new T.SphereGeometry(23, 24, 16), new T.MeshBasicMaterial({ color: 0x6ab8ff, transparent: true, opacity: 0.22, depthWrite: false, fog: false })); earth.add(eh);
    const eLight = new T.DirectionalLight(0xffffff, 1.4); eLight.position.set(-60, 30, 80); eLight.target = earth; g.add(eLight);
    const ast = Sp(g, 3.2, 0x6a5a4a, 0, 0, 0); const astTail = new T.Mesh(new T.ConeGeometry(2.6, 22, 12), new T.MeshBasicMaterial({ color: 0xffb070, transparent: true, opacity: 0.45, depthWrite: false })); g.add(astTail);
    const sunM = new T.Mesh(new T.SphereGeometry(10, 16, 10), new T.MeshBasicMaterial({ color: 0xfffbe8, fog: false })); sunM.position.set(520, 26, 160); g.add(sunM);
    const sunH = new T.Mesh(new T.SphereGeometry(26, 16, 10), new T.MeshBasicMaterial({ color: 0xfff4c0, transparent: true, opacity: 0.3, depthWrite: false, fog: false })); sunH.position.copy(sunM.position); g.add(sunH);
    return { bg: 0x000000, fog: null, hemi: [0xbfc8e0, 0x2a2a2e, 0.55], sun: [0xfffbf0, 1.6, [60, 14, 20]],
      apply(p, t) { const dark = p.tod === 'dark'; const pw = p.power === undefined ? 1 : p.power;
        this.bg = 0x000000; this.fog = null;
        this.hemi = dark ? [0x7a9ad8, 0x10131c, 0.34] : [0xbfc8e0, 0x2a2a2e, 0.55]; this.sun = dark ? [0x9ab8ff, 0.32, [-60, 10, -10]] : [0xfffbf0, 1.6, [60, 14, 20]];
        sunM.visible = sunH.visible = !dark; earth.visible = p.earth !== false; eb.rotation.y = 1.2 + t * 0.02;
        winMat.color.set(pw > 0.5 ? (dark ? 0xffd98a : 0xffe6a8) : 0x1d2b3a); lamps.forEach(l => l.material.color.set(pw > 0.5 ? 0xfff2c0 : 0x333333)); pl1.intensity = pw > 0.5 ? (dark ? 30 : 8) : 0;
        const al = p.alarm || 0; doorL.material.color.set(al > 0 ? (Math.sin(t * 8) > 0 ? 0xff2a2a : 0x551010) : pw > 0.5 ? 0xf2a33a : 0x4a3a1a); door.rotation.y = 0;
        const gr = p.green ?? 1; plants.forEach((q, i) => q.scale.setScalar(Math.max(0.01, Math.min(1, gr * 1.4 - (i % 5) * 0.08))));
        trees.forEach(q => q.visible = !!p.forest); const gl = (p.glow ?? 1) * (pw > 0.5 ? 1 : 0); ghL.intensity = gl * 14; ghGlow.material.opacity = gl * 0.16;
        more.visible = !!p.more; c2.visible = !!p.cable2; tube.visible = !!p.tube;
        const L = p.lander; lander.position.set(-16, L ? (L.y ?? 0) : 0, 4); lander.visible = p.landerOff !== true; flame.visible = (p.flame || 0) > 0.01; flame.scale.set(1, (p.flame || 0) * (0.85 + 0.15 * Math.sin(t * 40)), 1);
        beacon.material.color.set(Math.sin(t * 3) > 0 ? 0xff2a2a : 0x401010);
        const cut = (p.cut || 0) > 0.5; midA.visible = !cut; endA.visible = endB.visible = cut;
        const rk = p.rock; rock.visible = rk !== undefined; if (rk !== undefined) { const k = Math.max(0, Math.min(1, rk)); rock.position.set(T.MathUtils.lerp(-30, CUT.x - 2.6, k), 0.9 + Math.abs(Math.sin(k * 9)) * 2.2 * (1 - k) + T.MathUtils.lerp(4.5, 0, k), T.MathUtils.lerp(-64, CUT.z + 0.8, k)); rock.rotation.set(k * 14, k * 6, 0); }
        const spk = p.spark || 0; spL.intensity = spk * (8 + 8 * Math.sin(t * 50)); sparks.forEach((s, i) => { s.visible = spk > 0.01; const ph = (t * 2.2 + i * 0.13) % 1, a = i * 2.4; s.position.set(CUT.x + Math.cos(a) * ph * 0.9, 0.35 + ph * 0.9 - ph * ph * 1.2, CUT.z + Math.sin(a) * ph * 0.9); });
        const rv = p.rover; rover.visible = !!rv; if (rv) { rover.position.set(rv.x ?? 0, Math.sin(t * 11) * 0.02, rv.z ?? 0); rover.rotation.y = rv.ry ?? 0; wheels.forEach(w => w.rotation.x = (rv.spin ?? 0)); const li = rv.lights ? 1 : 0; hl.forEach(h => h.material.color.set(li ? 0xfff6c0 : 0x555555)); rLight.intensity = li * 60; }
        const a = p.ast; ast.visible = astTail.visible = a !== undefined; if (a !== undefined) { const v = new T.Vector3(-380, 140, -220).lerp(earth.position, a); ast.position.copy(v); astTail.position.copy(v).add(new T.Vector3(8, 6, -6)); astTail.lookAt(earth.position); astTail.rotateX(-Math.PI / 2); }
      } };
  });
}
