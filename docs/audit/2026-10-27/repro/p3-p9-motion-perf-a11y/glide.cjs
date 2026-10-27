const { chromium } = require('$SRC/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  for (const page_ of ['/', '/field-notes.html']) for (const thr of [1, 4]) for (const glide of [true, false]) {
    const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
    if (!glide) await ctx.addInitScript(() => window.addEventListener('wheel', (e) => e.stopImmediatePropagation(), { capture: true, passive: true }));
    await ctx.addInitScript(() => { window.__s = []; addEventListener('scroll', () => window.__s.push([performance.now(), scrollY]), { passive: true }); });
    const page = await ctx.newPage(); const cdp = await ctx.newCDPSession(page);
    if (thr > 1) await cdp.send('Emulation.setCPUThrottlingRate', { rate: thr });
    await page.goto('http://localhost:8105' + page_, { waitUntil: 'load' }); await page.waitForTimeout(2500);
    await page.mouse.move(720, 500);
    const res = [];
    for (let k = 0; k < 3; k++) {
      const y0 = await page.evaluate(() => { window.__s = []; window.__t0 = performance.now(); return scrollY; });
      await page.mouse.wheel(0, 300);
      await page.waitForTimeout(2000);
      const r = await page.evaluate((y0) => { const s = window.__s; const end = s.length ? s[s.length - 1][1] : y0; const d = end - y0; const t90 = s.find(([t, y]) => y - y0 >= 0.9 * d); const first = s[0]; return { moved: Math.round(d), firstMs: first ? Math.round(first[0] - window.__t0) : null, t90: t90 ? Math.round(t90[0] - window.__t0) : null, steps: s.length }; }, y0);
      res.push(r);
    }
    console.log(page_, `cpu${thr}x`, glide ? 'site-glide' : 'native   ', res.map((r) => `moved ${r.moved}px first ${r.firstMs}ms 90% ${r.t90}ms (${r.steps} scroll events)`).join(' | '));
    await ctx.close();
  }
  await b.close();
})();
