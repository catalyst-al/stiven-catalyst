const { chromium } = require('$SRC/node_modules/playwright');
const SAMPLE = (ms) => new Promise((res) => { const t = []; let last = performance.now(); const s = last; const tick = (now) => { t.push(now - last); last = now; if (now - s < ms) requestAnimationFrame(tick); else res(t); }; requestAnimationFrame(tick); });
const mm = (m) => Object.fromEntries(m.metrics.map((x) => [x.name, x.value]));
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  for (const prof of ['mobile4x', 'desktop']) {
    const ctx = await b.newContext(prof === 'desktop' ? { viewport: { width: 1440, height: 900 } } : { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
    const page = await ctx.newPage(); const cdp = await ctx.newCDPSession(page); await cdp.send('Performance.enable');
    if (prof !== 'desktop') await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
    await page.goto('http://localhost:8105/', { waitUntil: 'load' });
    for (let w = 0; w < 6; w++) {
      const a = mm(await cdp.send('Performance.getMetrics')); const t = await page.evaluate(SAMPLE, 5000); const c = mm(await cdp.send('Performance.getMetrics'));
      const canvas = await page.evaluate(() => { const c = document.querySelector('.cosmos-canvas'); return `${c.width}x${c.height} css ${c.clientWidth}x${c.clientHeight}`; });
      console.log(prof, `window ${w * 5}-${w * 5 + 5}s fps=${(t.length / 5).toFixed(1)} task=${(c.TaskDuration - a.TaskDuration).toFixed(2)}s canvas=${canvas}`);
    }
    await ctx.close();
  }
  await b.close();
})();
