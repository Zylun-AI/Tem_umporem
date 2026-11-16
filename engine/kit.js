// Kit de helpers para shots dos episódios (import * as K from '/engine/kit.js')
export const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
export const lerp = (a, b, t) => a + (b - a) * t;
export const ease = { io: x => x * x * (3 - 2 * x), o: x => 1 - (1 - x) * (1 - x), i: x => x * x, oo: x => 1 - Math.pow(1 - x, 3), lin: x => x };
export const dots = (n) => String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
export const mmss = (s) => { s = Math.max(0, s); return '00:' + String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(Math.floor(s % 60)).padStart(2, '0'); };
export const PI = Math.PI;
export const prog = (t, a, b) => clamp((t - a) / (b - a));
export const abs = (html) => `<div class="abs" style="left:0;top:0;width:${window.W}px;height:${window.H}px">${html}</div>`;
export const center = (txt, o = {}) => `<div class="abs" style="left:0;right:0;top:${o.top ?? 400}px;text-align:center;font-weight:900;font-size:${o.size ?? 120}px;color:${o.color ?? '#fff'};opacity:${o.a ?? 1};transform:scale(${o.s ?? 1});letter-spacing:${o.ls ?? 0}px;text-shadow:0 6px 0 rgba(0,0,0,.55),0 0 40px ${o.glow ?? 'rgba(0,0,0,0)'};${o.extra ?? ''}">${txt}</div>`;

// ---------------- helpers extra ----------------
export const lerpA = (a, b, u) => a.map((v, i) => lerp(v, b[i], u));
export const rotY = (v, a) => [v[0] * Math.cos(a) + v[2] * Math.sin(a), v[1], -v[0] * Math.sin(a) + v[2] * Math.cos(a)];
export const stamp = (txt, o = {}) => `<div class="abs" style="left:0;right:0;top:${o.top ?? 380}px;text-align:center;transform:rotate(${o.rot ?? -4}deg) scale(${o.s ?? 1});opacity:${o.a ?? 1}"><span style="display:inline-block;padding:10px 50px;border:10px solid ${o.color ?? '#ff3b30'};border-radius:20px;color:${o.color ?? '#ff3b30'};font-weight:900;font-size:${o.size ?? 120}px;background:rgba(0,0,0,.55);letter-spacing:4px">${txt}</span></div>`;
export const bigNum = (txt, x, y, o = {}) => `<div class="abs" style="left:${x}px;top:${y}px;transform:translate(-50%,-50%) scale(${o.s ?? 1});opacity:${o.a ?? 1};font-weight:900;font-size:${o.size ?? 110}px;color:${o.color ?? '#fff'};text-shadow:0 6px 0 rgba(0,0,0,.6),0 0 30px ${o.glow ?? 'rgba(0,0,0,0)'};white-space:nowrap">${txt}</div>`;
export const pop = (t, t0, d = 0.25) => { const k = clamp((t - t0) / d); return k <= 0 ? 0 : (1 + 0.35 * (1 - k)) * (k > 0 ? 1 : 0); };
export const phoneUI = (t, t0, t1, rows) => { if (t < t0 || t > t1) return ''; const a = clamp((t - t0) / 0.2) * clamp((t1 - t) / 0.2);
  let h = `<div class="abs" style="left:1230px;top:120px;width:430px;height:720px;border-radius:50px;background:#0f1218;border:9px solid #2b303a;transform:rotate(4deg);opacity:${a};box-shadow:0 30px 80px rgba(0,0,0,.55);overflow:hidden"><div style="padding:34px 30px;font-weight:800;color:#8fb4ff;font-size:30px;letter-spacing:3px">CONTATOS</div><div style="text-align:center;font-weight:900;font-size:150px;color:#fff;line-height:1">200</div>`;
  rows.forEach((r, i) => { const on = t > t0 + 0.4 + i * 0.7; if (!on) return; const done = t > t0 + 0.4 + i * 0.7 + 0.55; h += `<div style="margin:16px 26px 0;padding:14px 20px;border-radius:16px;background:#1a1f2a;display:flex;justify-content:space-between;font-weight:800;font-size:30px;color:#fff"><span>${r}</span><span style="color:${done ? '#ff6a5e' : '#7fd8ff'};font-size:24px">${done ? 'SEM RESPOSTA' : 'chamando' + '.'.repeat(1 + Math.floor(t * 4) % 3)}</span></div>`; });
  return h + '</div>'; };
export const wheelsSpin = (M, d, r = 0.36) => M.userData.wheels.forEach(w => w.rotation.x = d / r);


// ================= helpers finais =================
export const seeded = (n) => { let x = n * 9301 + 49297; return () => { x = (x * 9301 + 49297) % 233280; return x / 233280; }; };
export const subBtn = (c, tS) => { const t = c.t; if (t < tS - 0.1) return; const a = clamp((t - (tS - 0.1)) / 0.3); const cl = t > tS + 1.1; const k = ease.io(clamp((t - tS) / 0.9)); const cx = lerp(1700, 1470, k), cy = lerp(520, 345, k);
  c.ui(`<div class="abs" style="left:1280px;top:290px;opacity:${a};transform:scale(${0.8 + 0.2 * a})"><div style="display:flex;gap:18px;align-items:center"><div style="padding:18px 46px;border-radius:60px;background:${cl ? '#3a3a3a' : '#ff0033'};color:#fff;font-weight:900;font-size:44px;box-shadow:0 8px 0 rgba(0,0,0,.4)">${cl ? 'INSCRITO' : 'INSCREVER'}</div></div></div>`);
  if (!cl || t < tS + 1.6) c.ui(`<div class="abs" style="left:${cx}px;top:${cy}px;transform:scale(${cl && t < tS + 1.25 ? 0.8 : 1})"><svg width="70" height="70" viewBox="0 0 24 24"><path fill="#fff" stroke="#000" stroke-width="1.2" d="M4 3l16 9-7 1.6L9.5 20z"/></svg></div>`); };
export const boardCam = (c, t0, t1, z0 = 1.8, z1 = 0.8) => c.cam([{ t: t0, p: [0, 2.1, z0], l: [-0.2, 2.0, -5.8], f: 50 }, { t: t1, p: [0, 2.1, z1], l: [-0.2, 2.0, -5.8], f: 50 }]);
export const dotsGrid = (x, n, cx, cy, cols, sp, r, col) => { for (let i = 0; i < n; i++) { const cc = i % cols, rr = Math.floor(i / cols); x.fillStyle = col; x.beginPath(); x.arc(cx + (cc - (cols - 1) / 2) * sp, cy + rr * sp, r, 0, 7); x.fill(); } };

