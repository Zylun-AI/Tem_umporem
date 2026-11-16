import * as THREE from 'three';
import { lam } from './chars.js';
const B = (g, w, h, d, c, x = 0, y = 0, z = 0, o = {}) => { const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), o.basic ? new THREE.MeshBasicMaterial({ color: c }) : lam(c)); m.position.set(x, y, z); if (o.r) m.rotation.set(...o.r); g.add(m); return m; };
const Cy = (g, rt, rb, h, c, x = 0, y = 0, z = 0, o = {}) => { const m = new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, o.seg || 18), lam(c)); m.position.set(x, y, z); if (o.r) m.rotation.set(...o.r); g.add(m); return m; };

export function makeMoto(body = 0xd62828) {
  const g = new THREE.Group(); g.userData.wheels = [];
  for (const z of [0.75, -0.75]) { const w = new THREE.Group(); w.position.set(0, 0.36, z); Cy(w, 0.36, 0.36, 0.16, 0x151515, 0, 0, 0, { r: [0, 0, Math.PI / 2] }); Cy(w, 0.2, 0.2, 0.18, 0x9aa0a6, 0, 0, 0, { r: [0, 0, Math.PI / 2] }); B(w, 0.04, 0.5, 0.04, 0x9aa0a6, 0, 0, 0); g.add(w); g.userData.wheels.push(w); }
  B(g, 0.3, 0.35, 1.2, body, 0, 0.62, 0.15); Cy(g, 0.22, 0.22, 0.5, body, 0, 0.9, 0.35, { r: [0, 0, Math.PI / 2] });
  B(g, 0.34, 0.12, 0.8, 0x1d1d22, 0, 0.88, -0.35); B(g, 0.1, 0.8, 0.1, 0x777c83, 0, 0.75, 0.72, { r: [-0.35, 0, 0] }); B(g, 0.7, 0.06, 0.06, 0x222222, 0, 1.12, 0.62);
  const hl = B(g, 0.2, 0.2, 0.1, 0xfff4c2, 0, 1.0, 0.82, { basic: true });
  const box = B(g, 0.72, 0.62, 0.72, 0xffc21a, 0, 1.12, -0.95); B(g, 0.74, 0.1, 0.74, 0xd62828, 0, 1.38, -0.95);
  return g;
}
export function makeCar(body = 0xd01818) {
  const g = new THREE.Group(); g.userData.wheels = [];
  B(g, 1.95, 0.5, 4.5, body, 0, 0.55, 0); B(g, 1.7, 0.35, 1.3, body, 0, 0.78, 1.6); B(g, 1.7, 0.3, 1.6, body, 0, 0.82, -1.6);
  B(g, 1.5, 0.12, 0.9, 0x1d1d22, 0.0, 0.8, 0.1); B(g, 0.5, 0.5, 0.15, 0x1d1d22, 0.45, 1.05, -0.45); B(g, 0.5, 0.5, 0.15, 0x1d1d22, -0.45, 1.05, -0.45);
  const wsh = B(g, 1.6, 0.55, 0.05, 0x9fd4ff, 0, 1.1, 0.75, { r: [-0.6, 0, 0], m: { transparent: true, opacity: 0.45 } });
  Cy(g, 0.22, 0.22, 0.04, 0x222222, 0.45, 1.0, 0.45, { r: [1.0, 0, 0] });
  B(g, 1.96, 0.1, 0.5, 0x222222, 0, 0.3, 2.15); B(g, 1.96, 0.2, 0.4, 0x222222, 0, 0.9, -2.2); B(g, 0.5, 0.12, 0.1, 0xfff4c2, -0.6, 0.65, 2.26, { basic: true }); B(g, 0.5, 0.12, 0.1, 0xfff4c2, 0.6, 0.65, 2.26, { basic: true });
  B(g, 0.5, 0.1, 0.1, 0xff2020, -0.6, 0.8, -2.26, { basic: true }); B(g, 0.5, 0.1, 0.1, 0xff2020, 0.6, 0.8, -2.26, { basic: true });
  for (const [x, z] of [[-0.95, 1.45], [0.95, 1.45], [-0.95, -1.45], [0.95, -1.45]]) { const w = new THREE.Group(); w.position.set(x, 0.38, z); Cy(w, 0.4, 0.4, 0.3, 0x141414, 0, 0, 0, { r: [0, 0, Math.PI / 2] }); Cy(w, 0.24, 0.24, 0.32, 0xc7ccd1, 0, 0, 0, { r: [0, 0, Math.PI / 2] }); B(w, 0.34, 0.04, 0.5, 0x777777, 0, 0, 0); g.add(w); g.userData.wheels.push(w); }
  return g;
}
export function makeCart() {
  const g = new THREE.Group(); const m = lam(0xb7bcc2);
  B(g, 0.7, 0.05, 1.0, 0xb7bcc2, 0, 0.45, 0); B(g, 0.7, 0.5, 0.04, 0xb7bcc2, 0, 0.72, 0.5); B(g, 0.04, 0.5, 1.0, 0xb7bcc2, 0.34, 0.72, 0); B(g, 0.04, 0.5, 1.0, 0xb7bcc2, -0.34, 0.72, 0); B(g, 0.7, 0.05, 0.05, 0xd62828, 0, 1.05, -0.5);
  for (const [x, z] of [[-0.3, 0.4], [0.3, 0.4], [-0.3, -0.4], [0.3, -0.4]]) Cy(g, 0.07, 0.07, 0.06, 0x222222, x, 0.07, z, { r: [0, 0, Math.PI / 2] });
  return g;
}
export function makePanel() { // painel solar
  const g = new THREE.Group(); B(g, 2.0, 0.08, 1.2, 0x1d3f8a, 0, 0, 0); for (let i = 1; i < 6; i++) B(g, 0.015, 0.09, 1.2, 0xbfd3ff, -1 + i * 2 / 6, 0, 0); for (let j = 1; j < 4; j++) B(g, 2.0, 0.09, 0.015, 0xbfd3ff, 0, 0, -0.6 + j * 1.2 / 4); B(g, 2.06, 0.06, 1.26, 0xcfd3d8, 0, -0.04, 0); return g;
}
export function makeFire() {
  const g = new THREE.Group(); for (let i = 0; i < 6; i++) { const a = i / 6 * Math.PI * 2; Cy(g, 0.06, 0.06, 0.7, 0x5d4129, Math.cos(a) * 0.28, 0.15, Math.sin(a) * 0.28, { r: [Math.sin(a) * 0.8, 0, -Math.cos(a) * 0.8] }); }
  const flames = []; for (const [c, s] of [[0xff7a1a, 0.34], [0xffc21a, 0.24], [0xfff2a0, 0.14]]) { const m = new THREE.Mesh(new THREE.ConeGeometry(s, s * 3, 10), new THREE.MeshBasicMaterial({ color: c, transparent: true, opacity: 0.92 })); m.position.y = s * 1.5 + 0.2; g.add(m); flames.push(m); } g.userData.flames = flames;
  const l = new THREE.PointLight(0xff8a2a, 14, 14); l.position.y = 0.8; g.add(l); g.userData.light = l; return g;
}
