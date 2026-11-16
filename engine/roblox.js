// Personagem estilo Roblox (R15 em blocos) — mesma interface do Char palito:
// root, shadow, pose(p, em), setHold(key), o.scale. Usa as mesmas ANIMS/EMOTES.
import * as THREE from 'three';
import { RoundedBoxGeometry } from '/node_modules/three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { makeProp, lam } from './chars.js';

const U = 0.46;                       // 1 "stud" em metros (pernas = 2 studs = 0,92 m, igual ao palito)
const gc = {};
const RB = (w, h, d, r = 0.035) => (gc[[w, h, d, r]] ||= new RoundedBoxGeometry(w, h, d, 2, r));
const SKINS = { light: 0xf3c9a0, tan: 0xd9a066, brown: 0x9c6a43, dark: 0x5e3d26, yellow: 0xf5cd30, white: 0xf2f2f2 };

// ---------- cabeça clássica (cilindro arredondado) e decal de rosto oficial ----------
const HR = 0.29, HH = 0.55, HB = 0.13;
function headProfile(r = HR, h = HH, b = HB) { const pts = [new THREE.Vector2(0, -h / 2)]; for (let i = 0; i <= 8; i++) { const a = -Math.PI / 2 + i / 8 * Math.PI / 2; pts.push(new THREE.Vector2(r - b + Math.cos(a) * b, -h / 2 + b + Math.sin(a) * b)); }
  for (let i = 0; i <= 8; i++) { const a = i / 8 * Math.PI / 2; pts.push(new THREE.Vector2(r - b + Math.cos(a) * b, h / 2 - b + Math.sin(a) * b)); } pts.push(new THREE.Vector2(0, h / 2)); return pts; }
const headGeo = () => (gc.head ||= new THREE.LatheGeometry(headProfile(), 40));
const faceGeo = () => { if (gc.face) return gc.face; const g = new THREE.LatheGeometry(headProfile(HR + 0.004, HH + 0.006, HB), 64); const p = g.attributes.position, uv = g.attributes.uv;
  for (let i = 0; i < p.count; i++) { const x = p.getX(i), y = p.getY(i), z = p.getZ(i); if (z < 0.02) uv.setXY(i, -1, -1); else uv.setXY(i, 0.5 + x / (2 * HR * 1.0), 0.5 + y / (HH * 1.0)); } uv.needsUpdate = true; return (gc.face = g); };
export const FACE_SETS = { neutral: ['smile', 'chill', 'classic-male-face', 'friendly-smile', 'f18151826'], blink: ['f15637848'], happy: ['joyful-smile', 'the-winning-smile', 'know-it-all-grin', 'laughing-fun', 'happy-d', 'friendly-grin', 'epic-face'],
  smirk: ['check-it', 'mr-chuckles', 'skeptic', 'winky'], sad: ['big-sad-eyes', 'concerned', 'hold-it-in'], angry: ['err', 'meanie', 'sinister'], surprised: ['o', 'o-o', 'anime-surprise', 'joyous-surprise', 'whistle'],
  scared: ['whaaaaaa', 'uh-oh', 'awkward'], worried: ['concerned', 'awkward', 'uh-oh'], tired: ['tired-face', 'f15637848', 'not-sure-if'], cry: ['anguished', 'big-sad-eyes'], deadpan: ['stare', 'f7075469', 'f15637848'] };
const FEMALE = { neutral: ['smiling-girl', 'classic-female-face'], happy: ['smiling-girl', 'joyful-smile', 'the-winning-smile'] };
const FTEX = {};
export async function loadRobloxFaces() { const L = new THREE.TextureLoader(); const names = new Set(Object.values(FACE_SETS).flat().concat(Object.values(FEMALE).flat()));
  await Promise.all([...names].map(n => new Promise(res => L.load('/assets/roblox-faces/' + n + '.png', t => { t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; t.wrapS = t.wrapT = THREE.ClampToEdgeWrapping; FTEX[n] = t; res(); }, undefined, () => { console.log('face? ' + n); res(); })))); }
export function addFace(name, url) { return new Promise(res => new THREE.TextureLoader().load(url, t => { t.colorSpace = THREE.SRGBColorSpace; FTEX[name] = t; res(); }, undefined, () => res())); }
let SEQ = 0;
function robloxFace(ch, emo) { const o = ch.o; ch._seed ??= (o.seed ?? SEQ++);
  const want = (o.faces && o.faces[emo]) || (emo === 'neutral' && o.face) || null; if (want && FTEX[want]) return FTEX[want];
  const set = (o.female && FEMALE[emo]) || FACE_SETS[emo] || FACE_SETS.neutral; const n = set[ch._seed % set.length]; return FTEX[n] || FTEX.smile; }

// ---------- acessórios ----------
function hat(kind, col) {
  const g = new THREE.Group(); const m = (geo, c, p, r = [0, 0, 0]) => { const me = new THREE.Mesh(geo, lam(c)); me.position.set(...p); me.rotation.set(...r); g.add(me); return me; };
  const H = 0.56; // largura da cabeça
  switch (kind) {
    case 'cap': m(new THREE.SphereGeometry(H * 0.56, 20, 10, 0, 7, 0, Math.PI / 2), col, [0, 0.12, 0]).scale.set(1, 0.65, 1); m(RB(H * 0.9, 0.04, 0.3, 0.015), col, [0, 0.13, 0.36]); break;
    case 'police': case 'captain': case 'pilot': {
      const top = kind === 'police' ? 0x1b2a4a : kind === 'pilot' ? 0x15233f : 0x111111;
      m(new THREE.CylinderGeometry(H * 0.62, H * 0.55, 0.16, 20), top, [0, 0.2, -0.01]); m(new THREE.CylinderGeometry(H * 0.53, H * 0.53, 0.1, 20), 0x111111, [0, 0.1, 0]);
      m(RB(H * 0.75, 0.035, 0.22, 0.012), 0x111111, [0, 0.08, 0.3], [0.25, 0, 0]); m(new THREE.BoxGeometry(0.12, 0.08, 0.02), 0xf0c040, [0, 0.19, H * 0.55]); break; }
    case 'tophat': m(new THREE.CylinderGeometry(H * 0.42, H * 0.42, 0.42, 20), col, [0, 0.36, 0]); m(new THREE.CylinderGeometry(H * 0.68, H * 0.68, 0.03, 20), col, [0, 0.15, 0]); m(new THREE.CylinderGeometry(H * 0.43, H * 0.43, 0.06, 20), 0xaa2222, [0, 0.2, 0]); break;
    case 'fedora': m(new THREE.CylinderGeometry(H * 0.42, H * 0.5, 0.22, 20), col, [0, 0.25, 0]); m(new THREE.CylinderGeometry(H * 0.8, H * 0.8, 0.03, 24), col, [0, 0.14, 0]); m(new THREE.CylinderGeometry(H * 0.51, H * 0.51, 0.05, 20), 0x111111, [0, 0.17, 0]); break;
    case 'beanie': m(new THREE.SphereGeometry(H * 0.58, 18, 10, 0, 7, 0, Math.PI / 2), col, [0, 0.1, 0]).scale.set(1, 0.9, 1); m(new THREE.CylinderGeometry(H * 0.59, H * 0.59, 0.1, 18), col, [0, 0.1, 0]); break;
    case 'hard': m(new THREE.SphereGeometry(H * 0.6, 18, 10, 0, 7, 0, Math.PI / 2), col || 0xf2c200, [0, 0.12, 0]).scale.set(1, 0.75, 1.05); m(new THREE.CylinderGeometry(H * 0.7, H * 0.7, 0.03, 20), col || 0xf2c200, [0, 0.12, 0.03]); break;
    case 'chef': m(new THREE.CylinderGeometry(H * 0.5, H * 0.45, 0.3, 18), 0xffffff, [0, 0.3, 0]); m(new THREE.SphereGeometry(H * 0.58, 16, 10), 0xffffff, [0, 0.5, 0]).scale.set(1, 0.6, 1); break;
    case 'nurse': m(RB(H * 0.8, 0.14, 0.3, 0.03), 0xffffff, [0, 0.2, 0.05]); m(new THREE.BoxGeometry(0.1, 0.03, 0.02), 0xdd2222, [0, 0.2, 0.21]); m(new THREE.BoxGeometry(0.03, 0.1, 0.02), 0xdd2222, [0, 0.2, 0.21]); break;
    case 'crown': m(new THREE.CylinderGeometry(H * 0.5, H * 0.5, 0.16, 8, 1, true), 0xf5c518, [0, 0.24, 0]); break;
    case 'bandana': m(new THREE.CylinderGeometry(H * 0.53, H * 0.53, 0.08, 18), col, [0, 0.12, 0]); break;
  }
  return g;
}
function hair(kind, col) {
  const g = new THREE.Group(); const m = (geo, p, s = [1, 1, 1]) => { const me = new THREE.Mesh(geo, lam(col)); me.position.set(...p); me.scale.set(...s); g.add(me); return me; };
  const H = 0.56;
  if (!kind) return g;
  if (kind === 'bald') return g;
  m(RB(H * 1.04, 0.12, H * 1.04, 0.05), [0, 0.07, -0.01]);                      // topo
  if (kind === 'short' || kind === 'spiky') { m(RB(H * 1.04, 0.2, 0.08, 0.03), [0, -0.05, -H * 0.5]); if (kind === 'spiky') for (let i = -2; i <= 2; i++) m(new THREE.ConeGeometry(0.06, 0.14, 4), [i * 0.1, 0.18, 0.02 * Math.abs(i)]); }
  if (kind === 'long' || kind === 'pony' || kind === 'bun' || kind === 'curly') { m(RB(H * 1.06, 0.38, 0.12, 0.04), [0, -0.12, -H * 0.5]); }
  if (kind === 'long') { m(RB(0.1, 0.62, H * 0.9, 0.04), [H * 0.53, -0.22, -0.04]); m(RB(0.1, 0.62, H * 0.9, 0.04), [-H * 0.53, -0.22, -0.04]); m(RB(H * 1.06, 0.7, 0.12, 0.04), [0, -0.38, -H * 0.5]); }
  if (kind === 'pony') m(RB(0.14, 0.4, 0.14, 0.05), [0, -0.15, -H * 0.62]);
  if (kind === 'bun') m(new THREE.SphereGeometry(0.12, 12, 10), [0, 0.12, -H * 0.5]);
  if (kind === 'curly') for (let i = 0; i < 14; i++) { const a = i / 14 * Math.PI * 2; m(new THREE.SphereGeometry(0.1, 8, 6), [Math.cos(a) * H * 0.48, 0.05 + Math.sin(i) * 0.04, Math.sin(a) * H * 0.48 - 0.03]); }
  if (kind !== 'curly') m(RB(H * 1.04, 0.07, 0.07, 0.02), [0, 0.0, H * 0.5]);        // franja
  return g;
}

export class RChar {
  constructor(o = {}) {
    this.o = Object.assign({ skin: 'light', shirt: 0x2f6fde, pants: 0x2b2b38, shoes: 0x222222, sleeves: 'short', hat: null, hatColor: 0x222222, hair: 'short', hairColor: 0x3a2412, scale: 0.82, lashes: false, glasses: null, beard: null, logo: null, tie: null, vest: null, belt: false }, o);
    const O = this.o; const skinC = SKINS[O.skin] ?? O.skin; this.skinC = skinC;
    const skin = lam(skinC), shirt = lam(O.shirt), pants = lam(O.pants), shoes = lam(O.shoes);
    this.root = new THREE.Group(); this.body = new THREE.Group(); this.root.add(this.body);
    this.torso = new THREE.Group(); this.body.add(this.torso);
    const TW = 2 * U * 0.98, TH = 2 * U, TD = U;
    const tm = new THREE.Mesh(RB(TW, TH, TD, 0.04), shirt); tm.position.y = TH / 2; this.torso.add(tm);
    if (O.vest) { const v = new THREE.Mesh(RB(TW + 0.02, TH * 0.82, TD + 0.03, 0.04), lam(O.vest)); v.position.y = TH * 0.55; this.torso.add(v); const sh2 = new THREE.Mesh(RB(TW * 0.36, TH * 0.82, TD + 0.05, 0.02), shirt); sh2.position.set(0, TH * 0.55, 0.0); this.torso.add(sh2); }
    if (O.tie) { const tie = new THREE.Mesh(new THREE.BoxGeometry(0.09, TH * 0.6, 0.02), lam(O.tie)); tie.position.set(0, TH * 0.62, TD / 2 + 0.03); this.torso.add(tie); }
    if (O.belt) { const b = new THREE.Mesh(RB(TW + 0.02, 0.07, TD + 0.02, 0.02), lam(0x1a1a1a)); b.position.y = 0.06; this.torso.add(b); }
    if (O.logo) { const c = document.createElement('canvas'); c.width = c.height = 128; const x = c.getContext('2d'); x.fillStyle = O.logoColor || '#fff'; x.font = '900 86px Inter, sans-serif'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(O.logo, 64, 68);
      const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; const pl = new THREE.Mesh(new THREE.PlaneGeometry(0.34, 0.34), new THREE.MeshBasicMaterial({ map: t, transparent: true })); pl.position.set(0.0, TH * 0.6, TD / 2 + 0.006); this.torso.add(pl); }
    // cabeça
    this.head = new THREE.Group(); this.head.position.y = TH + 0.02; this.torso.add(this.head);
    const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.08, 10), skin); neck.position.y = 0.0; this.head.add(neck);
    const HS = 0.56; const hm = new THREE.Mesh(headGeo(), skin); hm.position.y = HS * 0.5; this.head.add(hm);
    this.faceMat = new THREE.MeshBasicMaterial({ map: robloxFace(this, 'neutral'), transparent: true, alphaTest: 0.02, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -2 });
    this.facePl = new THREE.Mesh(faceGeo(), this.faceMat); this.facePl.position.y = HS * 0.5; this.head.add(this.facePl); this.faceName = 'neutral';
    if (O.glasses) { const gm = lam(O.glasses === 'sun' ? 0x111111 : 0x222222); for (const sx of [-1, 1]) { const l = new THREE.Mesh(O.glasses === 'sun' ? new THREE.BoxGeometry(0.15, 0.09, 0.02) : new THREE.TorusGeometry(0.06, 0.01, 6, 16), gm); l.position.set(sx * 0.09, HS * 0.56, 0.3); this.head.add(l); } const br = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.012, 0.01), gm); br.position.set(0, HS * 0.58, 0.305); this.head.add(br); }
    if (O.beard) { const bd = new THREE.Mesh(RB(HS * 0.9, HS * 0.32, 0.08, 0.04), lam(O.beard)); bd.position.set(0, HS * 0.15, HS / 2); this.head.add(bd); }
    const hg = new THREE.Group(); hg.position.y = HS * 0.95; this.head.add(hg);
    hg.add(hair(O.hair, O.hairColor)); if (O.hat) hg.add(hat(O.hat, O.hatColor));
    // braços R15 (braço + antebraço)
    this.arms = {}; const AW = U * 0.95, AL = U * 0.95;
    const sleeveUp = O.sleeves !== 'none', sleeveLow = O.sleeves === 'long';
    for (const [side, sx] of [['L', 1], ['R', -1]]) {
      const sh = new THREE.Group(); sh.position.set(sx * (TW / 2 + AW / 2 + 0.01), TH - 0.2, 0); this.torso.add(sh);
      const up = new THREE.Mesh(RB(AW, AL + 0.2, AW, 0.04), sleeveUp ? shirt : skin); up.position.y = -(AL + 0.2) / 2 + 0.2; sh.add(up);
      const el = new THREE.Group(); el.position.y = -AL; sh.add(el);
      const lo = new THREE.Mesh(RB(AW * 0.97, AL * 0.72, AW * 0.97, 0.04), sleeveLow ? shirt : skin); lo.position.y = -AL * 0.36; el.add(lo);
      const hand = new THREE.Mesh(RB(AW * 0.97, AL * 0.3, AW * 0.97, 0.05), skin); hand.position.y = -AL * 0.82; el.add(hand);
      const hold = new THREE.Group(); hold.position.y = -AL * 0.92; el.add(hold);
      this.arms[side] = { sh, el, hold, sx };
    }
    // pernas
    this.legs = {}; const LW = U * 0.97, LL = U;
    for (const [side, sx] of [['L', 1], ['R', -1]]) {
      const hp = new THREE.Group(); hp.position.set(sx * LW / 2, 0.02, 0); this.body.add(hp);
      const th = new THREE.Mesh(RB(LW, LL + 0.06, LW, 0.04), pants); th.position.y = -LL / 2 + 0.03; hp.add(th);
      const kn = new THREE.Group(); kn.position.y = -LL; hp.add(kn);
      const sn = new THREE.Mesh(RB(LW * 0.97, LL * 0.8, LW * 0.97, 0.04), pants); sn.position.y = -LL * 0.4; kn.add(sn);
      const ft = new THREE.Mesh(RB(LW * 0.98, LL * 0.2, LW * 1.08, 0.04), shoes); ft.position.set(0, -LL * 0.88, 0.02); kn.add(ft);
      this.legs[side] = { hp, kn, sx };
    }
    const sh = new THREE.Mesh(new THREE.CircleGeometry(0.6, 20), new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.25, depthWrite: false }));
    sh.rotation.x = -Math.PI / 2; sh.position.y = 0.012; this.shadow = sh; this.root.add(sh);
    this.root.scale.setScalar(O.scale); this.holdMesh = null; this.holdKey = null;
  }
  setHold(key) {
    if (key === this.holdKey) return; this.holdKey = key;
    const h = this.arms.R.hold; if (this.holdMesh) { h.remove(this.holdMesh); this.holdMesh = null; }
    if (!key) return; this.holdMesh = makeProp(key); this.holdMesh.scale.setScalar(1.15); h.add(this.holdMesh);
  }
  pose(p, em) {
    // ANIMS foram feitos p/ quadril a 0,92 m: mesma altura aqui (pernas = 2 studs)
    this.body.position.y = p.hipY; this.torso.rotation.set(p.lean, p.twist, p.roll); this.head.rotation.set(p.hx, p.hy, p.hz);
    for (const s of ['L', 'R']) { const a = this.arms[s]; const pre = s === 'L' ? 'l' : 'r';
      a.sh.rotation.set(-p[pre + 'sx'], 0, Math.max(0, p[pre + 'sz'] - 0.13) * a.sx); a.el.rotation.set(-p[pre + 'el'], 0, 0);
      const l = this.legs[s]; l.hp.rotation.set(-p[pre + 'hx'], 0, 0); l.kn.rotation.set(p[pre + 'kn'], 0, 0); }
    let n = (em && em.name) || 'neutral'; if (this._blink && (n === 'neutral' || n === 'happy')) n = 'blink';
    if (n !== this.faceName) { this.faceMat.map = robloxFace(this, n); this.faceMat.needsUpdate = true; this.faceName = n; }
  }
}
