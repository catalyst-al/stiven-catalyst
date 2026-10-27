const path = require('path');
const SRC = '$SRC';
const { chromium } = require(path.join(SRC, 'node_modules/playwright'));
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  for (const p of (process.argv[2] || '/insights/pareto-and-5-why-in-practice/').split(',')) for (const w of [1440, 390]) {
    const ctx = await browser.newContext({ viewport: { width: w, height: 900 }, isMobile: w < 600, hasTouch: w < 600 });
    await ctx.addInitScript(() => { window.__src = {}; const o = window.requestAnimationFrame.bind(window); window.requestAnimationFrame = (cb) => { const s = (new Error().stack || '').split('\n').slice(2, 3).join('').replace(/\?v=\w+/, '').trim(); window.__src[s] = (window.__src[s] || 0) + 1; return o(cb); }; });
    const page = await ctx.newPage();
    await page.goto('http://localhost:8105' + p, { waitUntil: 'load' });
    await page.waitForTimeout(2000);
    await page.evaluate(() => { window.__src = {}; });
    await page.waitForTimeout(3000);
    const top = await page.evaluate(() => window.__src);
    await page.evaluate(() => scrollTo(0, document.documentElement.scrollHeight / 2));
    await page.waitForTimeout(800); await page.evaluate(() => { window.__src = {}; }); await page.waitForTimeout(3000);
    const mid = await page.evaluate(() => window.__src);
    console.log(p, w, 'top(3s):', JSON.stringify(top), '\n   mid(3s):', JSON.stringify(mid));
    await ctx.close();
  }
  await browser.close();
})();
