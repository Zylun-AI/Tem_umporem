import * as THREE from 'three';

export const lam = (c, o = {}) => new THREE.MeshLambertMaterial({ color: c, ...o });
const BLACK = 0x0d0d12;
const geoCache = {};
const G = (k, f) => (geoCache[k] ||= f());
const lerp = (a, b, t) => a + (b - a) * t;

// ---------------- POSES ----------------
// campos: hipY lean roll twist hx hy hz  lsx lsz lel  rsx rsz rel  lhx lkn rhx rkn  (L = lado +x, R = lado -x)
const BASE = () => ({ hipY: 0.92, lean: 0, roll: 0, twist: 0, hx: 0, hy: 0, hz: 0,
  lsx: 0.05, lsz: 0.13, lel: 0.1, rsx: 0.05, rsz: 0.13, rel: 0.1, lhx: 0, lkn: 0.02, rhx: 0, rkn: 0.02, yaw: 0, px: 0, py: 0 });
const S = Math.sin, C = Math.cos;
export const ANIMS = {
  idle: (t, ph) => { const p = BASE(); const b = S(t * 2.2); p.hipY += b * 0.006; p.lsx += b * 0.03; p.rsx -= b * 0.03; p.hy = S(t * 0.7) * 0.15; return p; },
  walk: (t, ph) => { const p = BASE(); const A = 0.55;
    p.lhx = A * S(ph); p.rhx = -A * S(ph);
    p.lkn = 1.0 * Math.max(0, C(ph)) ; p.rkn = 1.0 * Math.max(0, -C(ph));
    p.lsx = -0.5 * S(ph); p.rsx = 0.5 * S(ph); p.lel = 0.25; p.rel = 0.25;
    p.hipY = 0.92 - 0.035 * Math.abs(C(ph)) ; p.lean = 0.06; p.twist = 0.1 * S(ph); p.roll = 0.03 * S(ph); return p; },
  run: (t, ph) => { const p = BASE(); const A = 1.0;
    p.lhx = A * S(ph); p.rhx = -A * S(ph);
    p.lkn = 1.9 * Math.max(0, C(ph)) ; p.rkn = 1.9 * Math.max(0, -C(ph));
    p.lsx = -0.9 * S(ph); p.rsx = 0.9 * S(ph); p.lel = 1.5; p.rel = 1.5; p.lsz = 0.2; p.rsz = 0.2;
    p.hipY = 0.88 - 0.07 * Math.abs(S(ph)); p.lean = 0.3; p.twist = 0.2 * S(ph); return p; },
  sit: (t, ph) => { const p = BASE(); p.hipY = 0.5; p.lhx = 1.5; p.rhx = 1.5; p.lkn = 1.5; p.rkn = 1.5; p.lsx = 0.5; p.rsx = 0.5; p.lel = 0.8; p.rel = 0.8;
    const b = S(t * 2.2); p.hipY += b * 0.004; p.hy = S(t * 0.6) * 0.2; return p; },
  sitleg: (t, ph) => { const p = ANIMS.sit(t, ph); p.lhx = 1.2; p.rhx = 1.4; p.lkn = 0.4; p.rkn = 0.5; return p; },
  crouch: (t, ph) => { const p = BASE(); p.hipY = 0.55; p.lhx = 1.3; p.rhx = 1.3; p.lkn = 2.2; p.rkn = 2.2; p.lean = 0.5; p.lsx = 0.8; p.rsx = 0.8; p.lel = 0.6; p.rel = 0.6; return p; },
  point: (t, ph) => { const p = ANIMS.idle(t, ph); p.rsx = 1.55; p.rsz = 0.12; p.rel = 0.0; p.hy = -0.2; return p; },
  pointup: (t, ph) => { const p = ANIMS.idle(t, ph); p.rsx = 2.7; p.rsz = 0.15; p.rel = 0; p.hx = -0.3; return p; },
  shrug: (t, ph) => { const p = ANIMS.idle(t, ph); p.lsx = 0.5; p.rsx = 0.5; p.lsz = 0.7; p.rsz = 0.7; p.lel = 1.3; p.rel = 1.3; p.hz = 0.2; return p; },
  cheer: (t, ph) => { const p = BASE(); const j = Math.abs(S(t * 7)); p.hipY = 0.92 + j * 0.15; p.lsx = 2.8; p.rsx = 2.8; p.lsz = 0.5 + 0.2 * S(t * 14); p.rsz = 0.5 - 0.2 * S(t * 14); p.lel = 0.2; p.rel = 0.2; p.lhx = -0.2 * j; p.rhx = 0.2 * j; p.lkn = 0.5 * j; p.rkn = 0.5 * j; p.hx = -0.2; return p; },
  dance: (t, ph) => { const p = BASE(); const s = S(t * 8); p.hipY = 0.88 + 0.04 * Math.abs(s); p.lsx = 2.4 * Math.max(0, s) ; p.rsx = 2.4 * Math.max(0, -s); p.lsz = 0.3; p.rsz = 0.3; p.lel = 0.8; p.rel = 0.8; p.roll = 0.15 * s; p.lhx = 0.3 * s; p.rhx = -0.3 * s; p.lkn = 0.5 * Math.max(0, s); p.rkn = 0.5 * Math.max(0, -s); return p; },
  hurt: (t, ph) => { const p = BASE(); p.lean = 0.35; p.hx = 0.4; p.rsx = 1.0; p.rsz = -0.4; p.rel = 2.2; p.lsx = 0.2; p.lel = 0.5; p.hipY = 0.88; return p; },
  think: (t, ph) => { const p = ANIMS.idle(t, ph); p.rsx = 1.0; p.rsz = -0.3; p.rel = 2.4; p.hx = 0.1; p.hz = 0.1; return p; },
  lookup: (t, ph) => { const p = ANIMS.idle(t, ph); p.hx = -0.55; p.lean = -0.08; return p; },
  lookdown: (t, ph) => { const p = ANIMS.idle(t, ph); p.hx = 0.55; p.lean = 0.12; return p; },
  panic: (t, ph) => { const p = BASE(); const s = S(t * 18); p.lsx = 2.2 + 0.4 * s; p.rsx = 2.2 - 0.4 * s; p.lsz = 0.6; p.rsz = 0.6; p.lel = 0.7; p.rel = 0.7; p.hipY = 0.9 + 0.03 * Math.abs(s); p.lhx = 0.2 * s; p.rhx = -0.2 * s; p.hy = 0.3 * S(t * 11); return p; },
  talk: (t, ph) => { const p = ANIMS.idle(t, ph); const s = S(t * 5.5), c = C(t * 4.3); p.rsx = 0.9 + 0.4 * s; p.rel = 1.2 + 0.4 * c; p.rsz = 0.1; p.lsx = 0.5 + 0.2 * c; p.lel = 1.0; p.hy = 0.15 * S(t * 1.7); return p; },
  write: (t, ph) => { const p = ANIMS.idle(t, ph); const s = S(t * 9); p.rsx = 2.1 + 0.08 * s; p.rsz = 0.1; p.rel = 0.5 + 0.1 * C(t * 6); p.hx = -0.1; p.hy = 0.2; p.lean = 0.04; return p; },
  wipe: (t, ph) => { const p = ANIMS.write(t, ph); p.rsx = 2.0 + 0.15 * S(t * 10); p.rsz = 0.2 + 0.4 * S(t * 10); return p; },
  carry: (t, ph) => { const p = ANIMS.walk(t, ph); p.lsx = 1.6; p.rsx = 1.6; p.lel = 1.2; p.rel = 1.2; p.lsz = -0.25; p.rsz = -0.25; p.lean = -0.1; return p; },
  carryidle: (t, ph) => { const p = ANIMS.idle(t, ph); p.lsx = 1.6; p.rsx = 1.6; p.lel = 1.2; p.rel = 1.2; p.lsz = -0.25; p.rsz = -0.25; return p; },
  drive: (t, ph) => { const p = ANIMS.sit(t, ph); p.lsx = 1.4; p.rsx = 1.4; p.lel = 0.3; p.rel = 0.3; p.lsz = 0.05; p.rsz = 0.05; p.lhx = 1.2; p.rhx = 1.2; p.lkn = 1.0; p.rkn = 1.0; return p; },
  ride: (t, ph) => { const p = ANIMS.sit(t, ph); p.lsx = 1.2; p.rsx = 1.2; p.lel = 0.5; p.rel = 0.5; p.lsz = 0.25; p.rsz = 0.25; p.lean = 0.35; p.lhx = 1.0; p.rhx = 1.0; p.lkn = 1.3; p.rkn = 1.3; p.hx = -0.25; return p; },
  hug: (t, ph) => { const p = ANIMS.ride(t, ph); p.lsx = 1.4; p.rsx = 1.4; p.lsz = -0.5; p.rsz = -0.5; p.lel = 0.8; p.rel = 0.8; p.lean = 0.15; return p; },
  shoulder: (t, ph) => { const p = ANIMS.run(t, ph); return p; },
  fall: (t, ph) => { const p = BASE(); p.lean = 0.2; p.roll = 0.0; p.lsx = 2.0; p.rsx = 2.2; p.lsz = 0.8; p.rsz = 0.8; p.lhx = 0.4; p.rhx = -0.3; p.lkn = 0.9; p.rkn = 0.2; return p; },
  lie: (t, ph) => { const p = ANIMS.idle(t, ph); return p; },
  wave: (t, ph) => { const p = ANIMS.idle(t, ph); p.rsx = 2.5; p.rsz = 0.5; p.rel = 0.6 + 0.5 * S(t * 9); return p; },
  clap: (t, ph) => { const p = ANIMS.idle(t, ph); const s = 0.5 + 0.5 * S(t * 12); p.lsx = 1.4; p.rsx = 1.4; p.lel = 1.4; p.rel = 1.4; p.lsz = -0.1 - 0.35 * (1 - s); p.rsz = -0.1 - 0.35 * (1 - s); return p; },
  sleep: (t, ph) => { const p = ANIMS.idle(t, ph); p.hz = 0.4; p.hx = 0.3; return p; },
  tired: (t, ph) => { const p = ANIMS.idle(t, ph); const b = S(t * 6); p.lean = 0.5 + 0.03 * b; p.hx = 0.2; p.lsx = 0.1; p.rsx = 0.1; p.lkn = 0.25; p.rkn = 0.25; p.lhx = 0.2; p.rhx = 0.2; p.hipY = 0.86; p.lel = 0.0; return p; },
  sprint: (t, ph) => ANIMS.run(t, ph),
  turn: (t, ph) => ANIMS.idle(t, ph),
  crank: (t, ph) => { const p = BASE(); p.lean = 0.3; p.rsx = 1.0 + 0.9 * S(t * 7); p.rel = 0.6; p.lsx = 0.5; p.lel = 0.5; p.lhx = 0.3; p.rhx = -0.2; p.lkn = 0.4; p.rkn = 0.3; p.hipY = 0.85; p.twist = 0.2 * S(t * 7); return p; },
  tinker: (t, ph) => { const p = ANIMS.crouch(t, ph); p.rsx = 1.3 + 0.2 * S(t * 8); p.rel = 0.9 + 0.3 * C(t * 8); p.lsx = 1.1; p.lel = 1.0; return p; },
  hold: (t, ph) => ANIMS.idle(t, ph),
  surf: (t, ph) => { const p = ANIMS.idle(t, ph); p.lsz = 1.3; p.rsz = 1.3; p.lsx = 0.05; p.rsx = 0.05; p.lel = 0; p.rel = 0; p.lean = -0.08; p.lkn = 0.3; p.rkn = 0.3; p.hipY = 0.86; p.roll = 0.08 * Math.sin(t * 5); return p; },
  floor: (t, ph) => { const p = ANIMS.idle(t, ph); p.hipY = 0.27; p.lhx = 1.5; p.rhx = 1.5; p.lkn = 0.12; p.rkn = 0.12; p.lean = -0.04; p.lsx = 0.3; p.rsx = 0.3; p.lel = 0.8; p.rel = 0.8; return p; },
  floorEat: (t, ph) => { const p = ANIMS.floor(t, ph); const s = 0.5 + 0.5 * Math.sin(t * 3); p.rsx = 0.9 + 0.4 * s; p.rel = 2.2 + 0.3 * s; p.rsz = -0.1; return p; },
  eat: (t, ph) => { const p = ANIMS.idle(t, ph); const s = 0.5 + 0.5 * Math.sin(t * 3); p.rsx = 0.9 + 0.4 * s; p.rel = 2.2 + 0.3 * s; p.rsz = -0.1; p.hx = 0.1 * s; return p; },
  shout: (t, ph) => { const p = ANIMS.idle(t, ph); p.lsx = 1.5; p.rsx = 1.5; p.lel = 2.4; p.rel = 2.4; p.lsz = -0.35; p.rsz = -0.35; p.hx = -0.35; p.lean = -0.06; return p; },
  phone: (t, ph) => { const p = ANIMS.idle(t, ph); p.rsx = 0.5; p.rel = 2.6; p.rsz = -0.35; p.hz = 0.1; return p; },
  ridephone: (t, ph) => { const p = ANIMS.ride(t, ph); p.rsx = 0.5; p.rel = 2.6; p.rsz = -0.35; p.lean = 0.1; p.hx = 0; return p; },
  ridelookphone: (t, ph) => ANIMS.ridephone(t, ph),
  kneel: (t, ph) => { const p = BASE(); p.hipY = 0.5; p.lhx = 1.5; p.lkn = 1.5; p.rhx = 0.2; p.rkn = 2.5; p.lean = 0.3; p.lsx = 1.0; p.rsx = 1.0; p.lel = 0.9; p.rel = 0.9; return p; },
  lookaround: (t, ph) => { const p = ANIMS.idle(t, ph); p.hy = 0.9 * Math.sin(t * 1.4); p.hx = 0.05; return p; },
  ridelook: (t, ph) => { const p = ANIMS.ride(t, ph); p.hy = 0.9 * Math.sin(t * 1.3); p.lean = 0.1; return p; },
  ridestop: (t, ph) => { const p = ANIMS.ride(t, ph); p.lean = 0.1; p.hx = 0; return p; },
};
const POSEKEYS = Object.keys(BASE());
export function blendPose(a, b, w) { const o = {}; for (const k of POSEKEYS) o[k] = lerp(a[k], b[k], w); return o; }

// ---------------- EMOTES ----------------
// eye: abertura (0..1.3), lid: cobertura superior (0..0.9), tilt: inclinação (+ = bravo), pr: tamanho pupila, mouth: tipo
export const EMOTES = {
  neutral: { eye: 1, lid: 0.12, tilt: 0, pr: 1, mouth: 'flat', mw: 1 },
  happy: { eye: 1, lid: 0.1, tilt: -0.1, pr: 1.1, mouth: 'grin', mw: 1 },
  smirk: { eye: 0.9, lid: 0.35, tilt: 0.25, pr: 1, mouth: 'smile', mw: 1 },
  sad: { eye: 0.95, lid: 0.3, tilt: -0.5, pr: 0.9, mouth: 'frown', mw: 1 },
  angry: { eye: 0.85, lid: 0.4, tilt: 0.55, pr: 0.85, mouth: 'gritt', mw: 1 },
  surprised: { eye: 1.3, lid: 0.0, tilt: 0, pr: 0.55, mouth: 'o', mw: 1 },
  scared: { eye: 1.25, lid: 0.0, tilt: -0.25, pr: 0.5, mouth: 'wide', mw: 1 },
  worried: { eye: 1, lid: 0.15, tilt: -0.4, pr: 0.9, mouth: 'frown', mw: 0.8 },
  tired: { eye: 0.7, lid: 0.55, tilt: -0.15, pr: 0.9, mouth: 'flat', mw: 0.8 },
  cry: { eye: 0.9, lid: 0.25, tilt: -0.55, pr: 1.0, mouth: 'wide', mw: 1 },
  deadpan: { eye: 1, lid: 0.45, tilt: 0, pr: 0.9, mouth: 'flat', mw: 1 },
};

// ---------------- CHARACTER ----------------
const numTex = (txt, bg, fg) => { const c = document.createElement('canvas'); c.width = c.height = 128; const x = c.getContext('2d');
  x.clearRect(0, 0, 128, 128); x.fillStyle = fg; x.font = '900 100px Inter'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(txt, 64, 70);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t; };
const flagTex = () => { const c = document.createElement('canvas'); c.width = 96; c.height = 64; const x = c.getContext('2d');
  x.fillStyle = '#1a9b3c'; x.fillRect(0, 0, 96, 64); x.fillStyle = '#ffd400'; x.beginPath(); x.moveTo(48, 6); x.lineTo(90, 32); x.lineTo(48, 58); x.lineTo(6, 32); x.fill();
  x.fillStyle = '#1b3fa0'; x.beginPath(); x.arc(48, 32, 14, 0, 7); x.fill(); x.strokeStyle = '#fff'; x.lineWidth = 2; x.beginPath(); x.arc(48, 32, 14, 3.6, 5.4); x.stroke();
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t; };

function limb(len, r, color, grp, y0 = 0) {
  const m = new THREE.Mesh(G('cap' + len + '_' + r, () => new THREE.CapsuleGeometry(r, Math.max(0.001, len - 2 * r), 4, 10)), lam(color));
  m.position.y = y0 - len / 2; grp.add(m); return m;
}

export class Char {
  constructor(o = {}) {
    this.o = Object.assign({ shirt: 0xf6c90e, trim: 0x1a8a3a, shorts: 0x1f4fb4, shoes: 0xffffff, cap: null, num: '10', hair: null, skin: BLACK, scale: 1, long: false, flag: true }, o);
    const O = this.o;
    this.root = new THREE.Group(); this.body = new THREE.Group(); this.root.add(this.body);
    this.torso = new THREE.Group(); this.torso.position.y = 0.08; this.body.add(this.torso);
    const skin = lam(O.skin);
    // pelvis / shorts
    const pel = new THREE.Mesh(G('pel', () => new THREE.CapsuleGeometry(0.15, 0.1, 4, 10)), lam(O.shorts)); pel.rotation.z = Math.PI / 2; pel.scale.set(1, 1.0, 0.82); pel.position.y = 0.02; this.body.add(pel);
    // torso
    const tm = new THREE.Mesh(G('torso', () => new THREE.CapsuleGeometry(0.2, 0.26, 6, 14)), lam(O.shirt)); tm.scale.set(1.18, 1, 0.72); tm.position.y = 0.33; this.torso.add(tm);
    const collar = new THREE.Mesh(G('collar', () => new THREE.TorusGeometry(0.115, 0.03, 8, 20)), lam(O.trim)); collar.rotation.x = Math.PI / 2; collar.position.y = 0.66; collar.scale.set(1.1, 1.1, 1); this.torso.add(collar);
    const neck = new THREE.Mesh(G('neck', () => new THREE.CylinderGeometry(0.07, 0.08, 0.14, 10)), skin); neck.position.y = 0.68; this.torso.add(neck);
    if (O.num) { const nb = new THREE.Mesh(G('plane', () => new THREE.PlaneGeometry(1, 1)), new THREE.MeshBasicMaterial({ map: numTex(O.num), transparent: true, depthWrite: false })); nb.scale.set(0.3, 0.3, 1); nb.position.set(0, 0.36, -0.158); nb.rotation.y = Math.PI; this.torso.add(nb); }
    if (O.flag) { const fl = new THREE.Mesh(G('plane', () => new THREE.PlaneGeometry(1, 1)), new THREE.MeshBasicMaterial({ map: flagTex() })); fl.scale.set(0.1, 0.066, 1); fl.position.set(0.1, 0.5, 0.156); this.torso.add(fl); }
    // head
    this.head = new THREE.Group(); this.head.position.y = 0.96; this.torso.add(this.head);
    const hm = new THREE.Mesh(G('head', () => new THREE.SphereGeometry(0.31, 28, 20)), skin); this.head.add(hm);
    this.buildFace(); this.buildHead();
    // arms
    this.arms = {};
    for (const [side, sx] of [['L', 1], ['R', -1]]) {
      const sh = new THREE.Group(); sh.position.set(0.272 * sx, 0.55, 0); this.torso.add(sh);
      const sj = new THREE.Mesh(G('shj', () => new THREE.SphereGeometry(0.108, 14, 10)), lam(O.shirt)); sh.add(sj);
      limb(0.34, 0.075, O.skin, sh); const sl = new THREE.Mesh(G('sleeve', () => new THREE.CylinderGeometry(0.1, 0.105, 0.16, 12)), lam(O.shirt)); sl.position.y = -0.07; sh.add(sl);
      const el = new THREE.Group(); el.position.y = -0.34; sh.add(el);
      const ej = new THREE.Mesh(G('elj', () => new THREE.SphereGeometry(0.074, 12, 8)), skin); el.add(ej);
      limb(0.32, 0.068, O.skin, el); const hand = new THREE.Mesh(G('hand', () => new THREE.SphereGeometry(0.09, 12, 10)), skin); hand.position.y = -0.34; el.add(hand);
      const hold = new THREE.Group(); hold.position.y = -0.36; el.add(hold);
      this.arms[side] = { sh, el, hold, sx };
    }
    // legs
    this.legs = {};
    for (const [side, sx] of [['L', 1], ['R', -1]]) {
      const hp = new THREE.Group(); hp.position.set(0.13 * sx, -0.02, 0); this.body.add(hp);
      limb(0.46, 0.09, O.skin, hp); const st = new THREE.Mesh(G('shortleg', () => new THREE.CylinderGeometry(0.115, 0.12, 0.2, 12)), lam(O.shorts)); st.position.y = -0.1; hp.add(st);
      const kn = new THREE.Group(); kn.position.y = -0.46; hp.add(kn);
      const kj = new THREE.Mesh(G('knj', () => new THREE.SphereGeometry(0.088, 12, 8)), skin); kn.add(kj);
      const hj = new THREE.Mesh(G('hpj', () => new THREE.SphereGeometry(0.118, 12, 8)), lam(O.shorts)); hp.add(hj);
      limb(0.46, 0.075, O.skin, kn);
      const shoe = new THREE.Mesh(G('shoe', () => new THREE.CapsuleGeometry(0.075, 0.14, 4, 10)), lam(O.shoes)); shoe.rotation.x = Math.PI / 2; shoe.scale.set(1, 1, 0.7); shoe.position.set(0, -0.47, 0.07); kn.add(shoe);
      const sole = new THREE.Mesh(G('sole', () => new THREE.BoxGeometry(0.15, 0.03, 0.3)), lam(0x222222)); sole.position.set(0, -0.535, 0.07); kn.add(sole);
      this.legs[side] = { hp, kn, sx };
    }
    // blob shadow
    const sh = new THREE.Mesh(G('shadow', () => new THREE.CircleGeometry(0.45, 20)), new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.28, depthWrite: false }));
    sh.rotation.x = -Math.PI / 2; sh.position.y = 0.012; this.shadow = sh; this.root.add(sh);
    this.root.scale.setScalar(O.scale); this.holdMesh = null; this.holdKey = null;
  }
  buildFace() {
    this.eyes = [];
    const R = 0.31;
    const curve = (geo, off) => { const p = geo.attributes.position; for (let i = 0; i < p.count; i++) { const x = p.getX(i), y = p.getY(i); p.setZ(i, -R + Math.sqrt(Math.max(0.0004, R * R - x * x - y * y)) + off); } geo.computeVertexNormals(); return geo; };
    const gw = curve(new THREE.RingGeometry(0.0005, 0.1, 32, 6), 0.012);
    const gp = curve(new THREE.RingGeometry(0.0005, 0.05, 24, 3), 0.015);
    const gh = curve(new THREE.RingGeometry(0.0005, 0.014, 10, 1), 0.018);
    for (const sx of [-1, 1]) {
      const g = new THREE.Group(); const ex = 0.118 * sx, ey = 0.05; const ez = Math.sqrt(R * R - ex * ex - ey * ey);
      g.position.set(ex, ey, ez); g.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), new THREE.Vector3(ex, ey, ez).normalize());
      const white = new THREE.Mesh(gw, new THREE.MeshBasicMaterial({ color: 0xffffff })); white.scale.set(1, 1.15, 1); g.add(white);
      const pupil = new THREE.Mesh(gp, new THREE.MeshBasicMaterial({ color: 0x050505 })); g.add(pupil);
      const hl = new THREE.Mesh(gh, new THREE.MeshBasicMaterial({ color: 0xffffff })); hl.position.set(0.018, 0.02, 0); pupil.add(hl);
      const lg = new THREE.PlaneGeometry(0.34, 0.34, 8, 8); const bx = Float32Array.from(lg.attributes.position.array.filter((_, i) => i % 3 === 0)), by = Float32Array.from(lg.attributes.position.array.filter((_, i) => i % 3 === 1));
      const lid = new THREE.Mesh(lg, new THREE.MeshBasicMaterial({ color: BLACK })); lid.frustumCulled = false; g.add(lid);
      this.head.add(g); this.eyes.push({ g, white, pupil, lid, lg, bx, by, sx, R });
    }
    const wm = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide });
    this.mouth = new THREE.Group(); this.mouth.position.set(0, -0.115, 0.3); this.mouth.rotation.x = 0.35; this.head.add(this.mouth);
    this.mf = {};
    this.mf.flat = new THREE.Mesh(new THREE.PlaneGeometry(0.11, 0.014), wm);
    this.mf.smile = new THREE.Mesh(new THREE.TorusGeometry(0.075, 0.011, 6, 20, Math.PI), wm); this.mf.smile.rotation.z = Math.PI; this.mf.smile.position.y = 0.04;
    this.mf.frown = new THREE.Mesh(new THREE.TorusGeometry(0.065, 0.011, 6, 20, Math.PI), wm); this.mf.frown.position.y = -0.04;
    this.mf.grin = new THREE.Mesh(new THREE.CircleGeometry(0.095, 20, Math.PI, Math.PI), wm); this.mf.grin.position.y = 0.035;
    this.mf.o = new THREE.Mesh(new THREE.CircleGeometry(0.04, 16), wm);
    this.mf.wide = new THREE.Mesh(new THREE.CircleGeometry(0.07, 18), wm); this.mf.wide.scale.set(1.1, 0.8, 1);
    this.mf.gritt = new THREE.Mesh(new THREE.PlaneGeometry(0.13, 0.045), wm);
    for (const k in this.mf) { this.mouth.add(this.mf[k]); this.mf[k].visible = false; }
  }
  buildHead() {
    const O = this.o;
    if (O.cap != null) {
      const cap = new THREE.Group(); const dome = new THREE.Mesh(G('capdome', () => new THREE.SphereGeometry(0.335, 24, 12, 0, Math.PI * 2, 0, Math.PI * 0.46)), lam(O.cap)); dome.position.y = 0.02; cap.add(dome);
      const vis = new THREE.Mesh(G('visor', () => new THREE.CylinderGeometry(0.3, 0.3, 0.025, 20, 1, false, -Math.PI * 0.5, Math.PI)), lam(O.cap)); vis.scale.set(1, 1, 0.9); vis.position.set(0, 0.07, 0.2); vis.rotation.x = 0.0; cap.add(vis);
      const btn = new THREE.Mesh(new THREE.SphereGeometry(0.03, 8, 8), lam(0xf6c90e)); btn.position.y = 0.355; cap.add(btn);
      cap.rotation.y = O.capYaw || 0; cap.rotation.x = -0.18; cap.position.set(0, 0.04, -0.01); this.head.add(cap); this.cap = cap;
    }
    if (O.hair === 'lia') {
      const band = new THREE.Mesh(G('band', () => new THREE.TorusGeometry(0.315, 0.022, 8, 28)), lam(0xffffff)); band.rotation.x = Math.PI / 2 - 0.25; band.position.y = 0.16; this.head.add(band);
      const bun = new THREE.Mesh(new THREE.SphereGeometry(0.11, 12, 10), lam(BLACK)); bun.position.set(0, 0.3, -0.18); this.head.add(bun);
      const tie = new THREE.Mesh(new THREE.TorusGeometry(0.09, 0.02, 6, 14), lam(0xe91e8c)); tie.position.set(0, 0.27, -0.2); tie.rotation.x = 0.7; this.head.add(tie);
    }
    if (O.hair === 'old') { // bigode + cabelo branco
      const st = new THREE.Mesh(new THREE.CapsuleGeometry(0.02, 0.13, 4, 8), lam(0xeeeeee)); st.rotation.z = Math.PI / 2; st.position.set(0, -0.045, 0.3); this.head.add(st);
      const tuft = new THREE.Mesh(new THREE.SphereGeometry(0.1, 10, 8), lam(0xdddddd)); tuft.position.set(0.0, 0.27, -0.1); tuft.scale.set(1.5, 0.5, 1); this.head.add(tuft);
    }
  }
  setHold(key) {
    if (key === this.holdKey) return; this.holdKey = key;
    const h = this.arms.R.hold; if (this.holdMesh) { h.remove(this.holdMesh); this.holdMesh = null; }
    if (!key) return; this.holdMesh = makeProp(key); h.add(this.holdMesh);
  }
  pose(p, em) {
    const b = this.body; b.position.y = p.hipY; this.torso.rotation.set(p.lean, p.twist, p.roll); this.head.rotation.set(p.hx, p.hy, p.hz);
    for (const s of ['L', 'R']) { const a = this.arms[s]; const pre = s === 'L' ? 'l' : 'r';
      a.sh.rotation.set(-p[pre + 'sx'], 0, p[pre + 'sz'] * a.sx); a.el.rotation.set(-p[pre + 'el'], 0, 0);
      const l = this.legs[s]; l.hp.rotation.set(-p[pre + 'hx'], 0, 0); l.kn.rotation.set(p[pre + 'kn'], 0, 0); }
    // face
    const e = em || EMOTES.neutral;
    for (const E of this.eyes) {
      E.white.scale.set(1, 1.15 * e.eye, 1);
      const cover = Math.min(1, e.lid + (this._blink || 0)); const top = 0.115 * e.eye; const c = top * (1 - 2 * cover) + 0.17; const th = e.tilt * E.sx; const ct = Math.cos(th), st = Math.sin(th);
      const pa = E.lg.attributes.position;
      for (let i = 0; i < pa.count; i++) { const lx = E.bx[i], ly = E.by[i] + c; const x = lx * ct - ly * st, y = lx * st + ly * ct; pa.setXYZ(i, x, y, -E.R + Math.sqrt(Math.max(0.0004, E.R * E.R - x * x - y * y)) + 0.02); }
      pa.needsUpdate = true;
      E.pupil.scale.setScalar(e.pr); E.pupil.position.set((this._gx || 0) * 0.035, (this._gy || 0) * 0.035, 0);
    }
    for (const k in this.mf) this.mf[k].visible = false; const m = this.mf[e.mouth]; if (m) { m.visible = true; m.scale.x = e.mw; }
    if (e.mouth === 'gritt') this.mf.gritt.visible = true;
  }
}

// ---------------- PROPS ----------------
export function makeProp(key) {
  const g = new THREE.Group();
  const add = (geo, c, p = [0, 0, 0], r = [0, 0, 0]) => { const m = new THREE.Mesh(geo, lam(c)); m.position.set(...p); m.rotation.set(...r); g.add(m); return m; };
  if (key === 'can') { add(new THREE.CylinderGeometry(0.05, 0.05, 0.12, 12), 0xcfd3d8, [0, -0.02, 0.04]); add(new THREE.CylinderGeometry(0.052, 0.052, 0.05, 12), 0xf6c90e, [0, -0.02, 0.04]); }
  else if (key === 'wrench') { add(new THREE.BoxGeometry(0.035, 0.34, 0.02), 0xb8bec6, [0, -0.1, 0.02]); add(new THREE.TorusGeometry(0.06, 0.02, 6, 12, Math.PI * 1.5), 0xb8bec6, [0, -0.28, 0.02]); }
  else if (key === 'book') { add(new THREE.BoxGeometry(0.2, 0.04, 0.28), 0xc0392b, [0, -0.03, 0.1], [0.0, 0, 0]); add(new THREE.BoxGeometry(0.19, 0.03, 0.27), 0xf4efe0, [0.0, -0.025, 0.1]); }
  else if (key === 'marker') { add(new THREE.CylinderGeometry(0.02, 0.02, 0.15, 8), 0xd62828, [0, -0.03, 0.02], [0.5, 0, 0]); }
  else if (key === 'phone') { add(new THREE.BoxGeometry(0.08, 0.15, 0.012), 0x222831, [0, -0.02, 0.06], [0.3, 0, 0]); add(new THREE.PlaneGeometry(0.07, 0.13), 0x69c9ff, [0, -0.02, 0.067], [0.3, 0, 0]); }
  else if (key === 'light') { add(new THREE.CylinderGeometry(0.035, 0.045, 0.18, 10), 0x333840, [0, -0.04, 0.1], [1.4, 0, 0]); const m = new THREE.Mesh(new THREE.CircleGeometry(0.04, 10), new THREE.MeshBasicMaterial({ color: 0xfff6c0 })); m.position.set(0, -0.04, 0.2); g.add(m); }
  else if (key === 'needle') { add(new THREE.CylinderGeometry(0.004, 0.004, 0.14, 4), 0xdddddd, [0, -0.02, 0.06], [1.2, 0, 0]); }
  else if (key === 'ball') { add(new THREE.SphereGeometry(0.11, 14, 12), 0xffffff, [0, -0.06, 0.08]); }
  else if (key === 'bean') { add(new THREE.BoxGeometry(0.12, 0.16, 0.05), 0xe8d9b0, [0, -0.04, 0.06]); }
  else if (key === 'pan') { add(new THREE.CylinderGeometry(0.13, 0.12, 0.03, 16), 0x2c2f33, [0, -0.04, 0.2]); add(new THREE.BoxGeometry(0.03, 0.03, 0.18), 0x2c2f33, [0, -0.04, 0.04]); }
  else if (key === 'bread') { add(new THREE.SphereGeometry(0.1, 10, 8), 0xd9a441, [0, -0.04, 0.1]); g.children[0].scale.set(1.5, 0.8, 0.8); }
  else if (key === 'bandage') { add(new THREE.SphereGeometry(0.14, 10, 8), 0xffffff, [0, -0.05, 0.02]); add(new THREE.SphereGeometry(0.06, 8, 6), 0xd62828, [0.08, -0.03, 0.12]); }
  else if (key === 'suitcase') { add(new THREE.BoxGeometry(0.5, 0.36, 0.18), 0x7a3b2e, [0, -0.22, 0.12]); add(new THREE.TorusGeometry(0.06, 0.015, 6, 12, Math.PI), 0x222222, [0, -0.02, 0.12]); add(new THREE.BoxGeometry(0.51, 0.03, 0.19), 0xc9a24a, [0, -0.22, 0.12]); }
  else if (key === 'dog' || key === 'dogbox') { const c = 0xe0b070; add(new THREE.BoxGeometry(0.22, 0.16, 0.36), c, [0, -0.1, 0.1]); add(new THREE.BoxGeometry(0.18, 0.16, 0.16), c, [0, 0.0, 0.32]); add(new THREE.BoxGeometry(0.1, 0.07, 0.08), 0xf0d0a0, [0, -0.04, 0.42]); add(new THREE.BoxGeometry(0.04, 0.04, 0.02), 0x111111, [0, -0.02, 0.465]);
    for (const sx of [-0.06, 0.06]) { add(new THREE.BoxGeometry(0.05, 0.08, 0.03), 0x8a5a2a, [sx, 0.1, 0.3]); add(new THREE.BoxGeometry(0.03, 0.03, 0.01), 0x111111, [sx, 0.02, 0.405]); } for (const sx of [-0.08, 0.08]) for (const sz of [-0.04, 0.24]) add(new THREE.BoxGeometry(0.05, 0.12, 0.05), c, [sx, -0.22, sz]); add(new THREE.BoxGeometry(0.03, 0.03, 0.12), c, [0, -0.04, -0.12], [0.6, 0, 0]); }
  else if (key === 'mic') { add(new THREE.CylinderGeometry(0.02, 0.025, 0.16, 8), 0x222222, [0, -0.03, 0.05], [0.4, 0, 0]); add(new THREE.SphereGeometry(0.04, 10, 8), 0x888888, [0, 0.04, 0.08]); }
  else if (key === 'cup') { add(new THREE.CylinderGeometry(0.045, 0.035, 0.1, 12), 0xffffff, [0, -0.03, 0.06]); }
  else if (key === 'bottle') { add(new THREE.CylinderGeometry(0.035, 0.035, 0.16, 10), 0x3a7d44, [0, -0.04, 0.06]); add(new THREE.CylinderGeometry(0.012, 0.03, 0.07, 8), 0x3a7d44, [0, 0.07, 0.06]); }
  else if (key === 'bag') { add(new THREE.BoxGeometry(0.26, 0.3, 0.12), 0xd2691e, [0, -0.25, 0.08]); add(new THREE.TorusGeometry(0.08, 0.012, 6, 12, Math.PI), 0x6b3410, [0, -0.1, 0.08]); }
  else if (key === 'paper') { add(new THREE.BoxGeometry(0.2, 0.28, 0.005), 0xffffff, [0, -0.05, 0.08], [0.4, 0, 0]); }
  else if (key === 'laptop') { add(new THREE.BoxGeometry(0.34, 0.02, 0.24), 0x333a44, [0, -0.06, 0.16]); add(new THREE.BoxGeometry(0.34, 0.22, 0.015), 0x333a44, [0, 0.05, 0.04], [-0.25, 0, 0]); }
  else if (key === 'money') { add(new THREE.BoxGeometry(0.16, 0.04, 0.08), 0x3aa655, [0, -0.04, 0.06]); }
  else if (key === 'key') { add(new THREE.TorusGeometry(0.025, 0.008, 6, 10), 0xd4af37, [0, -0.03, 0.05]); add(new THREE.BoxGeometry(0.012, 0.07, 0.006), 0xd4af37, [0, -0.08, 0.05]); }
  else if (key === 'flower') { add(new THREE.CylinderGeometry(0.006, 0.006, 0.25, 4), 0x2e8b3a, [0, 0.0, 0.05]); add(new THREE.SphereGeometry(0.05, 8, 6), 0xff4d88, [0, 0.13, 0.05]); }
  else if (key === 'baby') { add(new THREE.CapsuleGeometry(0.08, 0.16, 4, 8), 0xbfe3ff, [0, -0.08, 0.12], [1.4, 0, 0]); add(new THREE.SphereGeometry(0.07, 10, 8), 0xf3c9a0, [0, -0.02, 0.26]); }
  else if (key === 'umbrella') { add(new THREE.CylinderGeometry(0.01, 0.01, 0.8, 6), 0x333333, [0, 0.3, 0]); add(new THREE.ConeGeometry(0.5, 0.2, 10, 1, true), 0xd62828, [0, 0.72, 0]); }
  else if (key === 'bolt') { add(new THREE.CylinderGeometry(0.02, 0.02, 0.1, 6), 0x9aa0a6, [0, -0.04, 0.05], [1.5, 0, 0]); }
  return g;
}
