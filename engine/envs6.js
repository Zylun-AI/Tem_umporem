// Cenário "ice": Antártida — estação de pesquisa "Aurora" na costa (longo "na Antártida").
// Chão (neve) y=0. Costa em z≈26 (mar e blocos de gelo para +z). Montanhas no fundo (z≈-130).
//  - ESTAÇÃO: 5 módulos sobre pernas (estilo Halley VI), centros x = -12, -6, 0 (vermelho, maior), 6, 12, em z=-14; piso dos módulos y=2.6,
//    frente (janelas) em z≈-11.8. Escada do módulo vermelho desce até (2.4, 0, -8.4). p.more = mais 2 módulos (x=±18) e 2ª estufa (anos depois).
//  - GERADOR: módulo laranja no chão em (24, 0, -12) (5 x 3 x 4); porta na face -x (x≈21.5, z=-12); entrada de ar (grade) na face +z em (25, 1.5, -9.95).
//    p.clog 0..1 = neve entupindo a entrada de ar; p.cap = telhadinho sobre a entrada; p.gen2 = 2º módulo de gerador em (24, 0, -20); p.exhaust 0..1 fumaça.
//  - CORDA GUIA: postes de (3.6, 0, -8.6) até (21, 0, -10.8), corda a y≈1.1 (p.rope false esconde).
//  - ESTUFA: contêiner em (-22, 0, -6) (6 x 2.6 x 2.6), janelas verdes p.glow 0..1. Painéis solares x -36..-27, z -22..-12 (p.panels false esconde).
//  - PINGUINS: colônia x -20..-4, z 15..24 (p.peng = quantos, padrão 40). Navio quebra-gelo p.ship {x,z,ry}.
//  - p.tod 'day'|'dusk'|'night', p.storm 0..1 (nevasca: neve de lado, neblina), p.snow 0..1 (neve caindo leve), p.power 0..1 (janelas/luzes), p.stars, p.aurora
// Câmera: fique fora dos módulos (módulos ocupam x -15..15, z -16.2..-11.8, y 2.6..6.2 — dá pra passar POR BAIXO deles, y<2.3), y>0.4.
export function iceEnvs(U) {
  const { THREE, B, Cy, Sp, Pl, cvs, mkEnv, rng, sky, lam } = U;
  const T = THREE;
  mkEnv('ice', (g) => {
    const R = rng(606); const sk = sky(g);
    // mar escuro
    const W = new T.PlaneGeometry(800, 500, 80, 50); const wm = new T.MeshLambertMaterial({ color: 0x1a3a5a }); const water = new T.Mesh(W, wm); water.rotation.x = -Math.PI / 2; water.position.set(0, -0.6, 220); g.add(water); const base = W.attributes.position.array.slice();
    // neve
    const st = cvs(256, 256, (x, w, h) => { x.fillStyle = '#f4f8fc'; x.fillRect(0, 0, w, h); const r2 = rng(9); for (let i = 0; i < 500; i++) { x.fillStyle = r2() < 0.6 ? 'rgba(170,195,225,.18)' : 'rgba(255,255,255,.6)'; x.beginPath(); x.ellipse(r2() * w, r2() * h, 3 + r2() * 10, 1 + r2() * 3, 0, 0, 7); x.fill(); } });
    st.wrapS = st.wrapT = T.RepeatWrapping; st.repeat.set(30, 30);
    const SG = new T.PlaneGeometry(600, 330, 60, 33); const sa = SG.attributes.position; for (let i = 0; i < sa.count; i++) { const x = sa.getX(i), y = sa.getY(i); const wz = -139 - y; const amp = (Math.abs(x) < 70 && wz > -50) ? 0.04 : 0.3 + Math.max(0, -wz - 50) / 30; sa.setZ(i, (Math.sin(x * 0.07) * Math.cos(y * 0.09) * 0.5 + Math.sin(x * 0.02 + 1) * 0.5 + 0.5) * amp); }
    SG.computeVertexNormals(); const snow = new T.Mesh(SG, new T.MeshLambertMaterial({ map: st })); snow.rotation.x = -Math.PI / 2; snow.position.set(0, 0, -139); g.add(snow);
    // borda de gelo na costa
    for (let x = -300; x < 300; x += 9) { const m = B(g, 9.4, 1.6 + R() * 0.8, 2.2, 0xe4eef8, x, -0.3, 26 + R() * 0.8); m.rotation.y = (R() - 0.5) * 0.1; }
    // blocos de gelo flutuando e icebergs
    const floes = []; for (let i = 0; i < 40; i++) { const m = new T.Mesh(new T.CylinderGeometry(1.5 + R() * 4, 1.5 + R() * 4, 0.6, 6 + Math.floor(R() * 3)), lam(0xf0f6fc)); m.position.set((R() - 0.5) * 220, -0.45, 32 + R() * 90); m.rotation.y = R() * 6; g.add(m); floes.push(m); }
    for (const [x, z, s] of [[-60, 90, 14], [40, 120, 18], [110, 80, 11], [-140, 140, 22]]) { const m = new T.Mesh(new T.IcosahedronGeometry(s, 0), lam(0xdfeefc)); m.scale.set(1.5, 0.75, 1); m.position.set(x, s * 0.3, z); g.add(m); B(g, s * 2.6, s * 0.7, s * 1.4, 0xeef6ff, x, s * 0.25, z); }
    // montanhas
    for (let i = 0; i < 14; i++) { const x = -260 + i * 40 + (R() - 0.5) * 20, z = -120 - R() * 70, h = 30 + R() * 45; const m = new T.Mesh(new T.ConeGeometry(28 + R() * 20, h, 6), lam(i % 3 ? 0xdde6f0 : 0xb8c4d2)); m.position.set(x, h / 2 - 3, z); m.rotation.y = R() * 3; g.add(m); const rk = new T.Mesh(new T.ConeGeometry(10 + R() * 6, h * 0.5, 5), lam(0x5a6270)); rk.position.set(x + 8, h * 0.25 - 3, z + 14); g.add(rk); }
    // ===== ESTAÇÃO =====
    const winMats = []; const winM = () => { const m = new T.MeshBasicMaterial({ color: 0xffd98a }); winMats.push(m); return m; };
    const module = (x, z, col, w = 5.2, d = 4.4, h = 3.2) => { const m = new T.Group(); m.position.set(x, 0, z); g.add(m);
      for (const sx of [-1, 1]) for (const sz of [-1, 1]) { Cy(m, 0.14, 0.14, 2.7, 0x3a3f48, sx * (w / 2 - 0.5), 1.3, sz * (d / 2 - 0.5)); B(m, 0.5, 0.18, 1.6, 0x2a2e35, sx * (w / 2 - 0.5), 0.09, sz * (d / 2 - 0.5)); }
      B(m, w, h, d, col, 0, 2.6 + h / 2, 0); B(m, w + 0.1, 0.25, d + 0.1, 0xf4f4f4, 0, 2.6 + h + 0.05, 0); B(m, w + 0.1, 0.18, d + 0.1, 0x2a2e35, 0, 2.62, 0);
      for (let i = 0; i < 3; i++) { const wn = new T.Mesh(new T.BoxGeometry(w / 4.2, 0.7, 0.06), winM()); wn.position.set(-w / 3 + i * w / 3, 2.6 + h * 0.58, d / 2 + 0.02); m.add(wn); }
      return m; };
    const mods = [module(-12, -14, 0x2a6ad6), module(-6, -14, 0x2a6ad6), module(0, -14, 0xd62828, 6.2, 5, 3.6), module(6, -14, 0x2a6ad6), module(12, -14, 0x2a6ad6)];
    const extra = [module(-18.4, -14, 0x2a6ad6), module(18.4, -14, 0x2fa35a)];
    // passarelas entre módulos
    for (const x of [-9, -3, 3, 9]) B(g, 1.2, 1.6, 1.6, 0xe8e8e8, x, 3.5, -14);
    const xb = [B(g, 1.6, 1.6, 1.6, 0xe8e8e8, -15.4, 3.5, -14), B(g, 1.6, 1.6, 1.6, 0xe8e8e8, 15.4, 3.5, -14)];
    // escada do módulo vermelho
    const stair = new T.Group(); g.add(stair); for (let i = 0; i < 9; i++) B(stair, 1.3, 0.12, 0.42, 0x8a8f98, 2.4, 2.45 - i * 0.29, -11.3 + i * 0.33); B(stair, 0.06, 3.4, 0.06, 0x555a62, 1.75, 1.7, -9.8, { r: [0.84, 0, 0] }); B(stair, 0.06, 3.4, 0.06, 0x555a62, 3.05, 1.7, -9.8, { r: [0.84, 0, 0] });
    // placa
    const signT = cvs(512, 128, (x, w, h) => { x.fillStyle = '#ffffff'; x.fillRect(0, 0, w, h); x.fillStyle = '#d62828'; x.font = 'bold 72px sans-serif'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText('AURORA', w / 2, h / 2 + 4); });
    const sign = new T.Mesh(new T.PlaneGeometry(3.6, 0.9), new T.MeshBasicMaterial({ map: signT })); sign.position.set(0, 5.75, -11.47); g.add(sign);
    // luzes da estação
    const sl = new T.PointLight(0xffd9a0, 0, 26); sl.position.set(0, 2.2, -9); g.add(sl);
    const lamps = []; for (const x of [-12, -6, 6, 12]) { const b = Sp(g, 0.16, 0xfff2c0, x, 2.35, -11.6, { basic: true }); lamps.push(b); }
    // antenas
    Cy(g, 0.08, 0.08, 6, 0x9aa0a8, -12, 8.8, -15); Sp(g, 0.6, 0xf4f4f4, 6, 7.0, -15, { s: [1, 0.5, 1] }); Cy(g, 0.05, 0.05, 1.2, 0x9aa0a8, 6, 6.6, -15);
    // ===== GERADOR =====
    const genM = (x, z) => { const m = new T.Group(); m.position.set(x, 0, z); g.add(m); B(m, 5, 3, 4, 0xf08a1a, 0, 1.75, 0); B(m, 5.2, 0.25, 4.2, 0x2a2e35, 0, 0.12, 0); B(m, 5.1, 0.2, 4.1, 0xf4f4f4, 0, 3.3, 0); Cy(m, 0.2, 0.2, 1.8, 0x555a62, 1.4, 4.1, -1); return m; };
    const G1 = genM(24, -12), G2 = genM(24, -20);
    B(G1, 0.08, 2.1, 1.1, 0x3a3f48, -2.52, 1.3, 0); Sp(G1, 0.06, 0xf2c94c, -2.58, 1.3, 0.35);
    const vent = new T.Group(); vent.position.set(1, 1.6, 2.02); G1.add(vent); B(vent, 1.4, 1.0, 0.1, 0x2a2e35, 0, 0, 0); for (let i = 0; i < 5; i++) B(vent, 1.3, 0.06, 0.12, 0x8a8f98, 0, -0.4 + i * 0.2, 0.02);
    const clogM = new T.Mesh(new T.SphereGeometry(1, 14, 10), lam(0xf8fbff)); clogM.position.set(1, 0, 2.1); G1.add(clogM);
    const capR = B(G1, 2.0, 0.12, 1.2, 0x3a3f48, 1, 2.45, 2.55, { r: [0.35, 0, 0] });
    const smoke = []; for (let i = 0; i < 10; i++) { const s = new T.Mesh(new T.SphereGeometry(0.35, 8, 6), new T.MeshBasicMaterial({ color: 0xbfc4cc, transparent: true, opacity: 0.5, depthWrite: false })); g.add(s); smoke.push(s); }
    // ===== CORDA GUIA =====
    const rope = new T.Group(); g.add(rope); const A = new T.Vector3(3.6, 0, -8.6), Bv = new T.Vector3(21.2, 0, -10.8); const NP = 7;
    const pts = []; for (let i = 0; i <= NP; i++) { const p = A.clone().lerp(Bv, i / NP); Cy(rope, 0.05, 0.05, 1.3, 0x2a2e35, p.x, 0.65, p.z); Sp(rope, 0.08, 0xff7a1a, p.x, 1.3, p.z); }
    for (let i = 0; i <= 40; i++) { const u = i / 40; const p = A.clone().lerp(Bv, u); pts.push(new T.Vector3(p.x, 1.15 - Math.abs(Math.sin(u * NP * Math.PI)) * 0.15, p.z)); }
    rope.add(new T.Mesh(new T.TubeGeometry(new T.CatmullRomCurve3(pts), 80, 0.03, 5), lam(0xffb21a)));
    // ===== ESTUFA =====
    const gh = (x, z) => { const m = new T.Group(); m.position.set(x, 0, z); g.add(m); B(m, 6, 2.6, 2.6, 0xf4f4f4, 0, 1.45, 0); B(m, 6.1, 0.15, 2.7, 0x2a2e35, 0, 0.08, 0); const ws = []; for (let i = 0; i < 4; i++) { const w = new T.Mesh(new T.BoxGeometry(1.0, 0.8, 0.06), new T.MeshBasicMaterial({ color: 0x9bff7a })); w.position.set(-2.1 + i * 1.4, 1.7, 1.32); m.add(w); ws.push(w); } return { m, ws }; };
    const GH1 = gh(-22, -6), GH2 = gh(-22, -1);
    // painéis solares
    const panels = new T.Group(); g.add(panels); for (let r = 0; r < 3; r++) for (let k = 0; k < 4; k++) { const x = -35.5 + k * 2.6, z = -20 + r * 3.4; Cy(panels, 0.06, 0.06, 1.1, 0x555a62, x, 0.55, z); const p = B(panels, 2.3, 0.06, 1.5, 0x1d3a7a, x, 1.15, z); p.rotation.x = -0.6; }
    // ===== PINGUINS =====
    const pengs = []; const P = new T.Group(); g.add(P);
    for (let i = 0; i < 70; i++) { const p = new T.Group(); const s = 0.7 + R() * 0.25; p.scale.setScalar(s); const body = new T.Mesh(new T.CapsuleGeometry(0.22, 0.42, 4, 10), lam(0x1a1c22)); body.position.y = 0.45; p.add(body);
      const belly = new T.Mesh(new T.SphereGeometry(0.2, 10, 8), lam(0xf8f8f4)); belly.scale.set(0.95, 1.6, 0.6); belly.position.set(0, 0.42, 0.1); p.add(belly);
      const cheek = new T.Mesh(new T.SphereGeometry(0.07, 8, 6), lam(0xffb21a)); cheek.position.set(0.12, 0.78, 0.12); p.add(cheek); const ch2 = cheek.clone(); ch2.position.x = -0.12; p.add(ch2);
      const beak = new T.Mesh(new T.ConeGeometry(0.04, 0.16, 6), lam(0xff7a1a)); beak.rotation.x = Math.PI / 2; beak.position.set(0, 0.8, 0.22); p.add(beak);
      for (const sx of [-1, 1]) { const f = B(p, 0.05, 0.36, 0.14, 0x1a1c22, sx * 0.24, 0.5, 0); f.rotation.z = sx * 0.25; }
      for (const sx of [-1, 1]) B(p, 0.1, 0.04, 0.16, 0xff8a2a, sx * 0.08, 0.02, 0.06);
      const x = -20 + R() * 16, z = 15 + R() * 9; p.position.set(x, 0, z); p.rotation.y = R() * 6.28; P.add(p); pengs.push({ p, x, z, ph: R() * 6, ry: p.rotation.y }); }
    // ===== NAVIO QUEBRA-GELO =====
    const ship = new T.Group(); g.add(ship); B(ship, 9, 5, 44, 0xd62828, 0, 1.5, 0); B(ship, 9.05, 1.4, 44.1, 0x1d1d22, 0, -0.6, 0); B(ship, 7.4, 4.6, 12, 0xf4f4f4, 0, 6.2, -8); B(ship, 7.5, 1.0, 12.1, 0x2a3a4a, 0, 7.4, -8); Cy(ship, 1.2, 1.2, 3, 0xf4f4f4, 0, 10, -10); B(ship, 9, 1.2, 1.2, 0xffd21f, 0, 4.3, 14);
    // ===== NEVE (partículas) =====
    const NS = 2400; const sp = new Float32Array(NS * 3); for (let i = 0; i < NS; i++) sp.set([(R() - 0.5) * 80, R() * 24, (R() - 0.5) * 70 - 6], i * 3); const sgeo = new T.BufferGeometry(); sgeo.setAttribute('position', new T.BufferAttribute(sp, 3)); const sp0 = sp.slice();
    const flakes = new T.Points(sgeo, new T.PointsMaterial({ color: 0xffffff, size: 3, sizeAttenuation: false, transparent: true, opacity: 0.9 })); flakes.frustumCulled = false; g.add(flakes);
    // ===== ESTRELAS E AURORA =====
    const N = 900; const stp = new Float32Array(N * 3); for (let i = 0; i < N; i++) { const v = new T.Vector3(R() * 2 - 1, R() * 0.9 + 0.08, R() * 2 - 1).normalize().multiplyScalar(560); stp.set([v.x, v.y, v.z], i * 3); } const stg = new T.BufferGeometry(); stg.setAttribute('position', new T.BufferAttribute(stp, 3)); const stars = new T.Points(stg, new T.PointsMaterial({ color: 0xffffff, size: 2.2, sizeAttenuation: false, fog: false, transparent: true })); stars.frustumCulled = false; g.add(stars);
    const aurT = cvs(256, 128, (x, w, h) => { const gr = x.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, 'rgba(255,255,255,0)'); gr.addColorStop(0.55, 'rgba(255,255,255,.9)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); x.fillStyle = gr; x.fillRect(0, 0, w, h); const g2 = x.createLinearGradient(0, 0, w, 0); g2.addColorStop(0, 'rgba(0,0,0,1)'); g2.addColorStop(0.2, 'rgba(0,0,0,0)'); g2.addColorStop(0.8, 'rgba(0,0,0,0)'); g2.addColorStop(1, 'rgba(0,0,0,1)'); x.globalCompositeOperation = 'destination-out'; x.fillStyle = g2; x.fillRect(0, 0, w, h); });
    const aur = new T.Group(); g.add(aur); for (let i = 0; i < 6; i++) { const m = new T.Mesh(new T.PlaneGeometry(260, 80), new T.MeshBasicMaterial({ map: aurT, color: i % 2 ? 0x3affa0 : 0x5affd0, transparent: true, opacity: 0.2, depthWrite: false, fog: false, blending: T.AdditiveBlending, side: T.DoubleSide })); m.position.set(-150 + i * 60, 120 + i * 8, -300 + i * 25); m.rotation.y = 0.3 - i * 0.12; aur.add(m); }
    const mixC = (a, b, k) => new T.Color(a).lerp(new T.Color(b), k).getHex();
    return { bg: 0xcfe4f6, fog: [0xdbe9f6, 120, 600], hemi: [0xffffff, 0xb8c8dc, 1.05], sun: [0xfff0dc, 0.9, [40, 30, 30]],
      apply(p, t) { const s = p.storm || 0; const tod = p.tod || 'day'; const night = tod === 'night', dusk = tod === 'dusk';
        const top = night ? 0x030818 : dusk ? 0x3a3f8a : 0x4a90d8, hor = night ? 0x0e1a3a : dusk ? 0xffb07a : 0xe4f2ff;
        sk.userData.set(mixC(top, night ? 0x0a0c12 : 0x8a96a6, s), mixC(hor, night ? 0x1a1e28 : 0xc4ccd6, s));
        const bg = mixC(night ? 0x0a1430 : dusk ? 0xb08a90 : 0xcfe4f6, night ? 0x141922 : 0xb8c0ca, s); this.bg = bg; this.fog = [bg, 90 - s * 82, 600 - s * 560];
        this.hemi = [night ? 0x7a90d0 : dusk ? 0xffd0b0 : 0xffffff, night ? 0x1a2238 : 0xb8c8dc, (night ? 0.5 : dusk ? 0.85 : 1.05) * (1 - 0.3 * s)];
        this.sun = [night ? 0x8fa6ff : dusk ? 0xff9a62 : 0xfff0dc, (night ? 0.22 : dusk ? 0.75 : 0.9) * (1 - 0.6 * s), dusk ? [-50, 10, 30] : [40, 30, 30]];
        wm.color.set(night ? 0x0a1a2e : 0x1a3a5a);
        const a = W.attributes.position.array; for (let i = 0; i < a.length; i += 3) { const x = base[i], y = base[i + 1]; a[i + 2] = (Math.sin(x * 0.12 + t * 1.1) + Math.cos(y * 0.15 + t)) * 0.2; } W.attributes.position.needsUpdate = true;
        floes.forEach((f, i) => { f.position.y = -0.45 + Math.sin(t * 0.8 + i) * 0.06; });
        const pw = p.power ?? 1; const flick = p.flick ? (Math.sin(t * 37) > 0.2 ? 1 : 0.15) : 1;
        winMats.forEach(m => m.color.set(mixC(0x1a1e26, night || s > 0.3 ? 0xffd98a : 0xfff0c8, pw * flick)));
        lamps.forEach(l => l.material.color.set(pw * flick > 0.3 ? 0xfff2c0 : 0x2a2e35)); sl.intensity = (night || s > 0.3 ? 40 : 0) * pw * flick;
        const more = !!p.more; extra.forEach(m => m.visible = more); xb.forEach(m => m.visible = more); GH2.m.visible = more;
        const gl = p.glow ?? 1; [GH1, GH2].forEach(G => G.ws.forEach(w => w.material.color.set(mixC(0x2a3a2a, 0x9bff7a, gl))));
        panels.visible = p.panels !== false; G2.visible = !!p.gen2; capR.visible = !!p.cap; rope.visible = p.rope !== false;
        const cl = p.clog || 0; clogM.visible = cl > 0.01; clogM.scale.set(0.2 + cl * 0.9, 0.2 + cl * 1.1, 0.25 + cl * 0.35); clogM.position.y = -1.5 + cl * 1.1;
        const ex = p.exhaust ?? 0; smoke.forEach((m, i) => { const ph = (t * 0.6 + i / 10) % 1; m.visible = ex > 0.01; m.position.set(25.4 + ph * 3 * (1 + s * 3), 5 + ph * 3, -13 + Math.sin(i) * 0.3); m.scale.setScalar(0.4 + ph * 1.4); m.material.opacity = (1 - ph) * 0.5 * ex; });
        const np = p.peng ?? 40; pengs.forEach((q, i) => { q.p.visible = i < np; if (!q.p.visible) return; const hud = p.huddle || 0; const ang = i * 2.39996, rr = 0.45 * Math.sqrt(i);
          const hx = -12 + Math.cos(ang + t * 0.05) * rr, hz = 19 + Math.sin(ang + t * 0.05) * rr; q.p.position.set(q.x + (hx - q.x) * hud + Math.sin(t * 0.6 + q.ph) * 0.15 * (1 - hud), 0, q.z + (hz - q.z) * hud);
          q.p.rotation.set(0, q.ry + (Math.atan2(-hx + 12, 1) * 0) , Math.sin(t * 6 + q.ph) * 0.06); });
        const sh = p.ship; ship.visible = !!sh; if (sh) { ship.position.set(sh.x ?? 0, Math.sin(t * 0.7) * 0.15, sh.z ?? 70); ship.rotation.y = sh.ry ?? Math.PI / 2; }
        const sn = Math.max(p.snow || 0, s); flakes.visible = sn > 0.01; flakes.material.opacity = 0.9 * Math.min(1, sn * 1.4); flakes.material.size = 2 + s * 2.5;
        if (sn > 0.01) { const wind = 1 + s * 26; for (let i = 0; i < NS; i++) { if (i > NS * (0.25 + 0.75 * sn)) { sp[i * 3 + 1] = -50; continue; } sp[i * 3 + 1] = ((sp0[i * 3 + 1] - t * (1.2 + s * 3)) % 24 + 24) % 24; sp[i * 3] = ((sp0[i * 3] + t * wind * (0.7 + (i % 5) * 0.15) + 40) % 80 + 80) % 80 - 40; } sgeo.attributes.position.needsUpdate = true; }
        stars.visible = (night && s < 0.5) || !!p.stars; stars.material.opacity = night ? 1 - s : 0.6; aur.visible = !!p.aurora; aur.children.forEach((m, i) => { m.material.opacity = 0.16 + 0.1 * Math.sin(t * 0.8 + i); m.position.y = 120 + i * 8 + Math.sin(t * 0.5 + i) * 6; }); } };
  });
}
