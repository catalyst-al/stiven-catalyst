const path = require('path');
const SRC = '$SRC';
const { chromium } = require(path.join(SRC, 'node_modules/playwright'));
const SAMPLE = (ms) => new Promise((res) => { const t = []; let last = performance.now(); const s = last; const tick = (now) => { t.push(now - last); last = now; if (now - s < ms) requestAnimationFrame(tick); else res(t); }; requestAnimationFrame(tick); });
const mm = (m) => Object.fromEntries(m.metrics.map((x) => [x.name, x.value]));
const variants = {
  paused: '',
  'paused-no-bulb': '.hero-bulb{animation:none!important}',
  'paused-no-go': '.hero-go,.hero-go::after{animation:none!important}',
  'paused-no-share': '.share-orbit-ring{animation:none!important}',
  'paused-none': '*,*::before,*::after{animation:none!important;transition:none!important}',
};
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  for (let r = 0; r < 2; r++) for (const prof of ['desktop', 'mobile4x']) for (const [name, css] of Object.entries(variants)) {
    const mobile = prof !== 'desktop';
    const ctx = await browser.newContext(mobile ? { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true } : { viewport: { width: 1440, height: 900 } });
    const page = await ctx.newPage(); const cdp = await ctx.newCDPSession(page); await cdp.send('Performance.enable');
    if (mobile) await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
    await page.goto('http://localhost:8105/', { waitUntil: 'load' }); await page.waitForTimeout(2500);
    await page.locator('[data-cosmos-pause]').click(); if (css) await page.addStyleTag({ content: css }); await page.waitForTimeout(800);
    const a = mm(await cdp.send('Performance.getMetrics')); const t = await page.evaluate(SAMPLE, 5000); const b = mm(await cdp.send('Performance.getMetrics'));
    const s = [...t].sort((x, y) => x - y);
    console.log(`r${r} ${prof} ${name.padEnd(16)} Task=${(b.TaskDuration - a.TaskDuration).toFixed(2)}s Script=${(b.ScriptDuration - a.ScriptDuration).toFixed(2)} frames=${t.length} p95=${s[Math.floor(.95 * s.length)].toFixed(1)}`);
    await ctx.close();
  }
  await browser.close();
})();
