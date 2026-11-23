// Cenário "island": ilha deserta no meio do oceano (longo "numa ilha deserta").
// Chão (areia) y=0. Ilha = disco de areia centrado em (0,0,-18), raio ~30 → a praia/mar começa em z≈11 (frente) e |x|≈29.
//  - morro de mata no fundo (z≈-40), rochedo com CAVERNA em (-15,0,-22) (boca virada p/ +z, em z≈-19)
//  - fogueira em (0,0,-4) — p.fire 0..1 (0 = apagada/fumaça)
//  - caixa d'água (barril grande) em (6,0,3), tampa: p.lid 0..1 (0 fechada, 1 solta/levantada), p.rope 0..2 voltas de corda, p.tarp (lona azul que pega chuva)
//  - p.tank false esconde a caixa principal; p.tanks 3 → mais duas caixas em (-12,0,-9) e (13,0,-15)
//  - cabanas: HUTS (abaixo) — p.huts 0..6 (quantas existem), p.roofs 0..1 (vento arranca os tetos), p.houses (casas de madeira pintadas, anos depois), p.cross (cruz vermelha na cabana 0 = hospital)
//  - horta x 8..14, z -20..-16 — p.plant 0..1
//  - navio encalhado no recife em (24,0,14) — p.wreck (padrão true); navio de resgate no mar p.ship {x,z} (de frente p/ ilha)
//  - p.storm 0..1 (céu de chumbo, ondas, palmeiras dobrando), p.rain 0..1, p.surge 0..1 (ondas invadem a areia até z≈3), p.tod 'day'|'dusk'|'night', p.stars, p.aurora
// Câmera: fique dentro de |x|<26, z<16, y>0.4 (na praia ou na vila); para planos aéreos, de cima (y>10).
export const HUTS = [[-8, -8, 0.5], [-4, -13, 0.2], [-12, -14, 0.8], [4.5, -12, -0.3], [9, -8, -0.6], [-13, -3, 1.2]];
export function islandEnvs(U) {
  const { THREE, B, Cy, Sp, Pl, cvs, mkEnv, rng, sky, lam } = U;
  const T = THREE;
  mkEnv('island', (g) => {
    const R = rng(505); const sk = sky(g);
    // mar
    const W = new T.PlaneGeometry(700, 700, 90, 90); const wm = new T.MeshLambertMaterial({ color: 0x1fa3d6 }); const water = new T.Mesh(W, wm); water.rotation.x = -Math.PI / 2; water.position.y = -0.25; g.add(water); const base = W.attributes.position.array.slice();
    const lag = new T.Mesh(new T.CircleGeometry(40, 48), new T.MeshLambertMaterial({ color: 0x4fd6d0, transparent: true, opacity: 0.55, depthWrite: false })); lag.rotation.x = -Math.PI / 2; lag.position.set(0, -0.18, -18); g.add(lag);
    for (let i = 0; i < 18; i++) { const a = R() * Math.PI * 2, r = 33 + R() * 6; const m = new T.Mesh(new T.CircleGeometry(1.5 + R() * 2.5, 10), new T.MeshBasicMaterial({ color: 0x2a7a8a, transparent: true, opacity: 0.45, depthWrite: false })); m.rotation.x = -Math.PI / 2; m.position.set(Math.cos(a) * r, -0.17, -18 + Math.sin(a) * r); g.add(m); }
    // areia
    const st = cvs(256, 256, (x, w, h) => { x.fillStyle = '#f0d9a0'; x.fillRect(0, 0, w, h); const r2 = rng(3); for (let i = 0; i < 700; i++) { x.fillStyle = r2() < 0.5 ? 'rgba(180,140,80,.18)' : 'rgba(255,255,240,.25)'; x.fillRect(r2() * w, r2() * h, 2 + r2() * 3, 2 + r2() * 3); } }); st.wrapS = st.wrapT = T.RepeatWrapping; st.repeat.set(14, 14);
    const sand = new T.Mesh(new T.CylinderGeometry(30, 33, 0.6, 64), new T.MeshLambertMaterial({ map: st })); sand.position.set(0, -0.3, -18); g.add(sand);
    const wet = new T.Mesh(new T.RingGeometry(29.2, 31.5, 64), lam(0xc9b27a)); wet.rotation.x = -Math.PI / 2; wet.position.set(0, -0.19, -18); g.add(wet);
    const grass = new T.Mesh(new T.CircleGeometry(22, 48), lam(0x6aa83a)); grass.rotation.x = -Math.PI / 2; grass.scale.set(1, 0.55, 1); grass.position.set(0, 0.02, -30); g.add(grass);
    // morro de mata + rochedo com caverna
    const hill = new T.Mesh(new T.SphereGeometry(24, 32, 16), lam(0x2f8a3a)); hill.scale.set(1.1, 0.5, 0.6); hill.position.set(4, -2, -44); g.add(hill);
    for (let i = 0; i < 40; i++) { const a = R() * Math.PI, x = -22 + R() * 50, z = -34 - R() * 16; const s = 2 + R() * 3; const m = new T.Mesh(new T.IcosahedronGeometry(s, 1), lam([0x2a7a32, 0x36964a, 0x24692c][i % 3])); m.position.set(x, 2 + R() * 6 - (z + 34) * -0.2, z); g.add(m); }
    const rock = new T.Group(); rock.position.set(-15, 0, -23); g.add(rock);
    for (const [x, y, z, s] of [[-3, 2.5, -1, 3.6], [3, 2.2, -1, 3.4], [0, 5.0, -1.5, 3.4], [-5, 1.4, 0.5, 2.2], [5, 1.3, 0.4, 2.0], [0, 7.0, -3, 3]]) { const m = new T.Mesh(new T.DodecahedronGeometry(s, 0), lam(0x7a7068)); m.position.set(x, y, z); m.rotation.set(x, y, z); rock.add(m); }
    const mouth = new T.Mesh(new T.CircleGeometry(1.7, 16, 0, Math.PI), new T.MeshBasicMaterial({ color: 0x0a0806 })); mouth.position.set(0, 0.02, 2.75); rock.add(mouth);
    B(rock, 3.4, 0.05, 1.2, 0x0a0806, 0, 0.03, 2.4, { basic: true });
    // palmeiras
    const palms = [];
    const palm = (x, z, s, lean) => { const p = new T.Group(); p.position.set(x, 0, z); p.rotation.y = R() * 6.28; g.add(p); const tr = new T.Group(); p.add(tr); let px = 0, py = 0; const segs = 7;
      for (let i = 0; i < segs; i++) { const h = 0.9 * s; const m = Cy(tr, 0.16 * s, 0.2 * s, h, i % 2 ? 0x8a6a45 : 0x7a5a38, px, py + h / 2, 0); m.rotation.z = -lean * (i / segs); px += Math.sin(lean * (i / segs)) * h; py += Math.cos(lean * (i / segs)) * h * 0.98; }
      const crown = new T.Group(); crown.position.set(px, py, 0); tr.add(crown); const leaves = [];
      for (let k = 0; k < 7; k++) { const lf = new T.Group(); lf.rotation.y = k / 7 * Math.PI * 2; crown.add(lf); const piv = new T.Group(); lf.add(piv); piv.rotation.z = -0.45; const m = B(piv, 2.6 * s, 0.05, 0.6 * s, k % 2 ? 0x3aa843 : 0x2f9a3a, 1.3 * s, 0, 0); leaves.push(piv); }
      for (let k = 0; k < 3; k++) Sp(crown, 0.17 * s, 0x6b4a1e, Math.cos(k * 2.1) * 0.2, -0.2, Math.sin(k * 2.1) * 0.2);
      palms.push({ tr, leaves, ph: R() * 6 }); };
    const spots = [[-20, 2], [-24, -6], [-18, 8], [16, 6], [21, 0], [-6, 6], [14, -4], [-17, -15], [18, -22], [24, -12], [-24, -18], [-3, -22], [7, -26], [-10, -28], [12, -30], [-22, -26], [26, -6], [-27, 0], [2, -30], [20, 8]];
    for (const [x, z] of spots) palm(x, z, 0.9 + R() * 0.4, 0.25 + R() * 0.35);
    for (let i = 0; i < 26; i++) { const a = R() * Math.PI * 2, r = 4 + R() * 24; const x = Math.cos(a) * r, z = -18 + Math.sin(a) * r * 0.9; if (z > -2 && Math.abs(x) < 10) continue; const m = Sp(g, 0.5 + R() * 0.7, 0x3f9a3a, x, 0.25, z, { s: [1.3, 0.6, 1.2] }); }
    // fogueira
    const fire = new T.Group(); fire.position.set(0, 0, -4); g.add(fire);
    for (let i = 0; i < 9; i++) { const a = i / 9 * Math.PI * 2; const m = new T.Mesh(new T.DodecahedronGeometry(0.2, 0), lam(0x6a6460)); m.position.set(Math.cos(a) * 0.7, 0.1, Math.sin(a) * 0.7); fire.add(m); }
    for (let i = 0; i < 5; i++) { const a = i / 5 * Math.PI * 2; Cy(fire, 0.06, 0.06, 0.9, 0x5d4129, Math.cos(a) * 0.25, 0.25, Math.sin(a) * 0.25, { r: [Math.sin(a) * 0.9, 0, -Math.cos(a) * 0.9] }); }
    const flames = []; for (const [c, s] of [[0xff7a1a, 0.38], [0xffc21a, 0.27], [0xfff2a0, 0.15]]) { const m = new T.Mesh(new T.ConeGeometry(s, s * 3, 10), new T.MeshBasicMaterial({ color: c, transparent: true, opacity: 0.92 })); m.position.y = s * 1.5 + 0.2; fire.add(m); flames.push(m); }
    const ember = Sp(fire, 0.22, 0xff4a1a, 0, 0.12, 0, { basic: true, s: [1.4, 0.5, 1.4] });
    const fl = new T.PointLight(0xff8a2a, 0, 16); fl.position.y = 1.0; fire.add(fl);
    // caixa d'água + lona
    const tank = (x, z) => { const t = new T.Group(); t.position.set(x, 0, z); g.add(t); Cy(t, 1.15, 1.2, 1.7, 0x9a6a3a, 0, 0.85, 0, { seg: 20 }); for (const y of [0.3, 0.85, 1.4]) Cy(t, 1.22, 1.22, 0.1, 0x3a3a3a, 0, y, 0, { seg: 20 }); return t; };
    const T1 = tank(6, 3); const lid = new T.Group(); lid.position.set(-1.15, 1.72, 0); T1.add(lid); Cy(lid, 1.2, 1.2, 0.12, 0x7a5030, 1.15, 0, 0, { seg: 20 }); B(lid, 0.5, 0.12, 0.14, 0x5a3820, 1.15, 0.1, 0);
    const ropes = []; for (let i = 0; i < 2; i++) { const r = B(T1, 0.07, 1.9, 2.5, 0xd8c08a, 0, 0.95, 0); r.rotation.y = i * Math.PI / 2 + 0.3; ropes.push(r); }
    const T2 = tank(-12, -9), T3 = tank(13, -15);
    const tarp = new T.Group(); tarp.position.set(6, 0, 3); g.add(tarp); for (const [x, z, h] of [[-1.8, -1.6, 3.2], [1.8, -1.6, 3.2], [-1.8, 1.6, 2.4], [1.8, 1.6, 2.4]]) Cy(tarp, 0.06, 0.06, h, 0x6b4a2f, x, h / 2, z);
    const tp = B(tarp, 3.8, 0.04, 3.4, 0x2a6ad6, 0, 2.8, 0); tp.rotation.x = 0.24;
    // cabanas
    const huts = []; const wallM = lam(0xc9a46a), roofM = lam(0xc8a64a);
    for (const [x, z, ry] of HUTS) { const h = new T.Group(); h.position.set(x, 0, z); h.rotation.y = ry; g.add(h); const w = B(h, 2.8, 1.8, 2.4, 0xc9a46a, 0, 0.9, 0); B(h, 0.8, 1.3, 0.06, 0x3a2412, 0, 0.65, 1.22); const rf = new T.Mesh(new T.ConeGeometry(2.4, 1.6, 4), lam(0xc8a64a)); rf.rotation.y = Math.PI / 4; rf.position.y = 2.6; h.add(rf); huts.push({ h, w, rf }); }
    const cross = new T.Group(); cross.position.set(0, 1.4, 1.24); huts[0].h.add(cross); B(cross, 0.6, 0.6, 0.04, 0xffffff, 0, 0, 0); B(cross, 0.4, 0.12, 0.05, 0xd62828, 0, 0, 0.01); B(cross, 0.12, 0.4, 0.05, 0xd62828, 0, 0, 0.01);
    // horta
    const plants = []; for (let r = 0; r < 4; r++) { B(g, 6, 0.12, 0.7, 0x6b4a2f, 11, 0.06, -20 + r * 1.3); for (let k = 0; k < 8; k++) { const m = Sp(g, 0.28, k % 3 ? 0x3fbf4a : 0xe89a2a, 8.4 + k * 0.75, 0.25, -20 + r * 1.3); plants.push(m); } }
    // navio encalhado
    const wreck = new T.Group(); wreck.position.set(25, -0.6, 15); wreck.rotation.set(0.08, -0.9, 0.18); g.add(wreck);
    B(wreck, 4.4, 3.4, 22, 0xf2f2f2, 0, 1.2, 0); B(wreck, 4.45, 0.9, 22.1, 0x1d4f8a, 0, -0.2, 0); B(wreck, 3.6, 2.4, 7, 0xf8f8f8, 0, 4.1, -3); for (let i = 0; i < 6; i++) B(wreck, 0.05, 0.5, 0.7, 0x2a3a4a, 2.24, 4.2, -5.5 + i, { basic: true }); Cy(wreck, 0.5, 0.55, 2.2, 0xd62828, 0, 6.2, -2);
    B(wreck, 3.0, 3.0, 3.0, 0xf2f2f2, 0, 1.4, 11.6, { r: [0, Math.PI / 4, 0] });
    // navio de resgate
    const ship = new T.Group(); g.add(ship); B(ship, 8, 5, 46, 0x1d1d22, 0, 1.5, 0); B(ship, 8.05, 1.2, 46.1, 0xb3261e, 0, -0.6, 0); B(ship, 7, 4, 14, 0xf4f4f4, 0, 6, -12); Cy(ship, 1.3, 1.3, 4, 0xf0b23a, 0, 9.5, -14); for (let z = -18; z < 20; z += 2) B(ship, 0.05, 0.4, 0.8, 0xfff2b0, 4.03, 2.4, z, { basic: true });
    // chuva
    const NR = 1400; const rp = new Float32Array(NR * 3); for (let i = 0; i < NR; i++) rp.set([(R() - 0.5) * 60, R() * 22, (R() - 0.5) * 50 - 6], i * 3); const rg = new T.BufferGeometry(); rg.setAttribute('position', new T.BufferAttribute(rp, 3)); const rain = new T.Points(rg, new T.PointsMaterial({ color: 0xcfe6ff, size: 3, sizeAttenuation: false, transparent: true, opacity: 0.7 })); g.add(rain); const rp0 = rp.slice();
    // espuma das ondas que invadem a praia
    const surge = new T.Mesh(new T.PlaneGeometry(64, 30, 32, 6), new T.MeshLambertMaterial({ color: 0x3aa0d8, transparent: true, opacity: 0.8 })); surge.rotation.x = -Math.PI / 2; g.add(surge); const foam = new T.Mesh(new T.PlaneGeometry(64, 1.4), new T.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.75, depthWrite: false })); foam.rotation.x = -Math.PI / 2; g.add(foam);
    // estrelas e aurora
    const N = 900; const sp = new Float32Array(N * 3); for (let i = 0; i < N; i++) { const v = new T.Vector3(R() * 2 - 1, R() * 0.9 + 0.08, R() * 2 - 1).normalize().multiplyScalar(560); sp.set([v.x, v.y, v.z], i * 3); } const sg = new T.BufferGeometry(); sg.setAttribute('position', new T.BufferAttribute(sp, 3)); const stars = new T.Points(sg, new T.PointsMaterial({ color: 0xffffff, size: 2.2, sizeAttenuation: false, fog: false, transparent: true })); stars.frustumCulled = false; g.add(stars);
    const aurT = cvs(256, 128, (x, w, h) => { const gr = x.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, 'rgba(255,255,255,0)'); gr.addColorStop(0.55, 'rgba(255,255,255,.9)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); x.fillStyle = gr; x.fillRect(0, 0, w, h); const g2 = x.createLinearGradient(0, 0, w, 0); g2.addColorStop(0, 'rgba(0,0,0,1)'); g2.addColorStop(0.2, 'rgba(0,0,0,0)'); g2.addColorStop(0.8, 'rgba(0,0,0,0)'); g2.addColorStop(1, 'rgba(0,0,0,1)'); x.globalCompositeOperation = 'destination-out'; x.fillStyle = g2; x.fillRect(0, 0, w, h); });
    const aur = new T.Group(); g.add(aur); for (let i = 0; i < 5; i++) { const m = new T.Mesh(new T.PlaneGeometry(260, 70), new T.MeshBasicMaterial({ map: aurT, color: i % 2 ? 0x3affa0 : 0x5affd0, transparent: true, opacity: 0.18, depthWrite: false, fog: false, blending: T.AdditiveBlending, side: T.DoubleSide })); m.position.set(-120 + i * 60, 150 + i * 8, -380 + i * 20); m.rotation.y = 0.3 - i * 0.15; aur.add(m); }
    return { bg: 0x9fd8ff, fog: [0xbfe6ff, 90, 520], hemi: [0xffffff, 0xc8a870, 1.1], sun: [0xfff4e0, 0.95, [30, 50, 25]],
      apply(p, t) { const s = p.storm || 0; const tod = p.tod || 'day'; const night = tod === 'night', dusk = tod === 'dusk';
        const top = night ? 0x050a1e : dusk ? 0x2a2f6e : 0x2f86e0, hor = night ? 0x16224a : dusk ? 0xff9a62 : 0xcfeeff;
        const mixC = (a, b, k) => new T.Color(a).lerp(new T.Color(b), k).getHex();
        sk.userData.set(mixC(top, night ? 0x05060a : 0x3a4048, s), mixC(hor, night ? 0x14161c : 0x6a7078, s));
        const bg = mixC(night ? 0x0b1430 : dusk ? 0x8a5a66 : 0x9fd8ff, night ? 0x0a0c10 : 0x5a6068, s); this.bg = bg; this.fog = [bg, 70 - s * 30, 520 - s * 360];
        this.hemi = [night ? 0x8aa0ff : dusk ? 0xffc0a0 : 0xffffff, night ? 0x1a2a3a : 0xc8a870, (night ? 0.55 : dusk ? 0.85 : 1.1) * (1 - 0.35 * s)];
        this.sun = [night ? 0x8fa6ff : dusk ? 0xff9a62 : 0xfff4e0, (night ? 0.2 : dusk ? 0.7 : 0.95) * (1 - 0.7 * s), dusk ? [-40, 14, -20] : [30, 50, 25]];
        wm.color.set(mixC(night ? 0x0e2a50 : 0x1fa3d6, 0x2a4a5a, s)); lag.material.opacity = 0.55 * (1 - s) * (night ? 0.3 : 1);
        const A = 0.25 + s * 1.1; const a = W.attributes.position.array; for (let i = 0; i < a.length; i += 3) { const x = base[i], y = base[i + 1]; a[i + 2] = (Math.sin(x * 0.15 + t * (1.3 + s)) + Math.cos(y * 0.18 + t * (1.1 + s))) * A * 0.5; } W.attributes.position.needsUpdate = true; W.computeVertexNormals();
        palms.forEach((pm, i) => { const bend = Math.sin(t * (1.2 + s * 3) + pm.ph) * (0.03 + s * 0.12) + s * 0.25; pm.tr.rotation.z = -bend * 0.4; pm.leaves.forEach((l, k) => l.rotation.z = -0.45 - bend * 0.6 + Math.sin(t * (2 + s * 6) + k + pm.ph) * (0.05 + s * 0.15)); });
        const f = p.fire ?? 0; flames.forEach((m, i) => { m.visible = f > 0.02; m.scale.set(f, f * (1 + 0.2 * Math.sin(t * 12 + i * 2)), f); m.position.y = (0.2 + [0.38, 0.27, 0.15][i] * 1.5) * Math.max(f, 0.3); }); ember.visible = true; ember.material.color.set(f > 0.02 ? 0xff4a1a : 0x3a2a22); fl.intensity = 22 * f * (night ? 1.5 : 0.6);
        lid.rotation.z = -(p.lid || 0) * (0.5 + 0.15 * Math.sin(t * 9)); const rope = p.rope || 0; ropes.forEach((r, i) => r.visible = rope > i); tarp.visible = !!p.tarp; T1.visible = p.tank !== false;
        T2.visible = T3.visible = (p.tanks || 1) >= 3;
        const nh = p.huts ?? HUTS.length; const roofs = p.roofs || 0; huts.forEach((H, i) => { H.h.visible = i < nh; H.rf.position.set(roofs * (2 + i) * 1.5, 2.6 + roofs * (3 + i), 0); H.rf.rotation.set(roofs * 2.2, Math.PI / 4 + roofs * i, roofs * 1.3); H.rf.visible = roofs < 0.95; H.w.material.color.set(p.houses ? [0xf4efe0, 0xa0c4d9, 0xf0e0b0, 0xe0b0c0, 0xc9d3a0, 0xf4efe0][i] : 0xc9a46a); H.rf.material.color.set(p.houses ? 0xb3502a : 0xc8a64a); }); cross.visible = !!p.cross;
        const pl = p.plant ?? 0.8; plants.forEach((m, i) => { const k = Math.max(0.05, Math.min(1, pl * 1.2 - (i % 5) * 0.04)); m.scale.set(k, k * 1.1, k); });
        wreck.visible = p.wreck !== false; const sh = p.ship; ship.visible = !!sh; if (sh) { ship.position.set(sh.x ?? 0, Math.sin(t * 0.7) * 0.2, sh.z ?? 120); ship.rotation.y = sh.ry ?? Math.PI / 2; }
        const rn = p.rain || 0; rain.visible = rn > 0.01; rain.material.opacity = 0.7 * rn; if (rn > 0.01) { for (let i = 0; i < NR; i++) { rp[i * 3 + 1] = ((rp0[i * 3 + 1] - t * 30) % 22 + 22) % 22; rp[i * 3] = rp0[i * 3] - (rp[i * 3 + 1] - 11) * 0.3 * s; } rg.attributes.position.needsUpdate = true; }
        const su = p.surge || 0; surge.visible = foam.visible = su > 0.01; const zEdge = 13 - su * 10 + Math.sin(t * 1.6) * 0.8 * su; surge.position.set(0, 0.05 + su * 0.2, zEdge + 15); foam.position.set(0, 0.1 + su * 0.2, zEdge);
        stars.visible = night || !!p.stars; stars.material.opacity = night ? 1 - s : 0.6; aur.visible = !!p.aurora; aur.children.forEach((m, i) => { m.material.opacity = 0.14 + 0.08 * Math.sin(t * 0.8 + i); m.position.y = 150 + i * 8 + Math.sin(t * 0.5 + i) * 6; }); } };
  });
}
