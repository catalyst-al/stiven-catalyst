const { chromium } = require('$SRC/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  for (const mode of ['running', 'paused', 'reduced']) for (let round = 0; round < 2; round++) {
    const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, reducedMotion: mode === 'reduced' ? 'reduce' : 'no-preference' });
    await ctx.addInitScript(() => { window.__ev = []; new PerformanceObserver((l) => { for (const e of l.getEntries()) window.__ev.push({ n: e.name, d: e.duration, delay: e.processingStart - e.startTime }); }).observe({ type: 'event', durationThreshold: 16, buffered: true }); });
    const page = await ctx.newPage(); const cdp = await ctx.newCDPSession(page);
    await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
    await page.goto('http://localhost:8105/', { waitUntil: 'load' }); await page.waitForTimeout(3000);
    if (mode === 'paused') { await page.locator('[data-cosmos-pause]').tap(); await page.waitForTimeout(500); }
    await page.evaluate(() => { window.__ev = []; });
    for (const sel of ['.cosmos-chip >> nth=0', '.cosmos-chip >> nth=1', '[data-menu-toggle]', '[data-menu-toggle]', '[data-theme-toggle]']) { await page.locator(sel).tap(); await page.waitForTimeout(700); }
    const ev = await page.evaluate(() => window.__ev.filter((e) => /pointerup|click|pointerdown|touchend/.test(e.n)));
    const max = Math.max(0, ...ev.map((e) => e.d)); const maxDelay = Math.max(0, ...ev.map((e) => e.delay));
    console.log(`mobile4x ${mode} r${round}: events>16ms=${ev.length} worst duration=${Math.round(max)}ms worst input delay=${Math.round(maxDelay)}ms`);
    await ctx.close();
  }
  await b.close();
})();
