// Renderizador headless (Chromium + SwiftShader).
// Uso (na raiz do repo, com `python3 -m http.server $PORT` rodando na raiz):
//   EP=episodes/<slug> FMT=long|short node tools/render.js frames <outdir> <t1> <t2> ...   (segundos absolutos)
//   EP=... node tools/render.js beats <outdir> <frac,frac> [beatId ...]                    (amostras por beat; sem ids = todos)
//   EP=... node tools/render.js sfx <out.json>
//   EP=... node tools/render.js range <f0> <f1> <fps> <out.mp4>
// TL=caminho do timeline.json (padrão: work/<slug>/timeline.json)
const { chromium } = require('playwright');
const { spawn } = require('child_process');
const fs = require('fs'); const path = require('path');
const args = process.argv.slice(2); const mode = args[0];
const EP = (process.env.EP || '').replace(/\/$/, ''); if (!EP) { console.error('defina EP=episodes/<slug>'); process.exit(1); }
const slug = path.basename(EP);
const FMT = process.env.FMT || 'long';
const TLP = process.env.TL || `work/${slug}/timeline.json`;
const W = FMT === 'short' ? 1080 : 1920, H = FMT === 'short' ? 1920 : 1080;
const SCALE = +(process.env.SCALE || 1);
const PORT = process.env.PORT || 8765;
(async () => {
  const b = await chromium.launch({ args: ['--use-angle=swiftshader', '--use-gl=angle', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--disable-dev-shm-usage'] });
  const p = await b.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
  let errors = 0;
  p.on('console', m => { const t = m.text(); if (!t.includes('GPU stall') && !t.includes('Automatic fallback')) console.log('[page]', t); });
  p.on('pageerror', e => { errors++; console.log('[pageerror]', e.message); });
  await p.goto(`http://localhost:${PORT}/engine/index.html?ep=/${EP}&fmt=${FMT}&tl=/${TLP}&scale=${SCALE}`);
  await p.waitForFunction('window.ready === true', null, { timeout: 180000 });
  const shot = async (T, file, q = 90) => { const r = await p.evaluate(T => window.renderAt(T), T); await p.screenshot({ path: file, type: 'jpeg', quality: q }); return r; };
  if (mode === 'frames') {
    const out = args[1]; fs.mkdirSync(out, { recursive: true });
    for (const t of args.slice(2)) console.log(t, await shot(parseFloat(t), `${out}/t${String(t).padStart(7, '0')}.jpg`));
  } else if (mode === 'beats') {
    const out = args[1]; fs.mkdirSync(out, { recursive: true }); const fr = args[2].split(',').map(parseFloat);
    const TL = JSON.parse(fs.readFileSync(TLP)); const ids = args.length > 3 ? args.slice(3) : TL.beats.map(x => x.id);
    for (const id of ids) { const bt = TL.beats.find(x => x.id === id); if (!bt) { console.log('beat?', id); continue; }
      for (const f of fr) { try { await shot(bt.start + bt.dur * f, `${out}/${id}_${String(Math.round(f * 100)).padStart(3, '0')}.jpg`); } catch (e) { errors++; console.log('ERRO', id, f, e.message); } } }
  } else if (mode === 'thumb') { // thumb <out.jpg> <youtube.json>  (usa m.thumb = {t, text, text2})
    const th = JSON.parse(fs.readFileSync(args[2])).thumb; args[3] = th.text || ''; args[4] = th.text2 || '';
    await p.evaluate(T => window.renderAt(T), parseFloat(th.t));
    await p.evaluate(([l1, l2]) => { document.getElementById('cap').innerHTML = ''; const ov = document.getElementById('ov');
      ov.insertAdjacentHTML('beforeend', `<div style="position:absolute;left:60px;right:60px;bottom:70px;text-align:left;font-weight:900;line-height:1.0;text-transform:uppercase">
        <div style="font-size:150px;color:#ffd21f;-webkit-text-stroke:10px #000;paint-order:stroke fill;text-shadow:0 12px 0 #000">${l1}</div>
        ${l2 ? `<div style="font-size:96px;color:#fff;-webkit-text-stroke:8px #000;paint-order:stroke fill;text-shadow:0 10px 0 #000;margin-top:10px">${l2}</div>` : ''}</div>`); }, [args[3] || '', args[4] || '']);
    await p.screenshot({ path: args[1], type: 'jpeg', quality: 92 });
  } else if (mode === 'sfx') {
    const s = await p.evaluate(() => window.getSfx()); fs.writeFileSync(args[1], JSON.stringify(s)); console.log('sfx', s.length);
  } else if (mode === 'range') {
    const [f0, f1, fps, out] = [parseInt(args[1]), parseInt(args[2]), parseInt(args[3]), args[4]];
    const ff = spawn('ffmpeg', ['-y', '-v', 'error', '-f', 'image2pipe', '-framerate', String(fps), '-c:v', 'mjpeg', '-i', '-', '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '17', '-pix_fmt', 'yuv420p', '-r', String(fps), out], { stdio: ['pipe', 'inherit', 'inherit'] });
    const t00 = Date.now();
    for (let f = f0; f < f1; f++) {
      await p.evaluate(T => window.renderAt(T), f / fps);
      const buf = await p.screenshot({ type: 'jpeg', quality: 93 });
      if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
      if ((f - f0) % 150 === 0) console.log('frame', f, 'de', f1, ((Date.now() - t00) / 1000 / (f - f0 + 1)).toFixed(2), 's/quadro');
    }
    ff.stdin.end(); await new Promise(r => ff.on('close', r));
  }
  await b.close();
  if (errors) { console.log('ERROS NA PÁGINA:', errors); process.exit(2); }
})();
