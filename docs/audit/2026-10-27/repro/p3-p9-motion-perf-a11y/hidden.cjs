const { chromium } = require('$SRC/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
  await ctx.addInitScript(() => { window.__raf = 0; const o = window.requestAnimationFrame.bind(window); window.requestAnimationFrame = (cb) => { window.__raf++; return o(cb); }; });
  const page = await ctx.newPage();
  await page.goto('http://localhost:8105/', { waitUntil: 'load' }); await page.waitForTimeout(2000);
  const count = async () => { const a = await page.evaluate(() => window.__raf); await page.waitForTimeout(2000); return ((await page.evaluate(() => window.__raf)) - a) / 2; };
  console.log('visible rAF/s', await count(), 'document.hidden', await page.evaluate(() => document.hidden));
  // real background: open another tab and bring it to front
  const other = await ctx.newPage(); await other.goto('about:blank'); await other.bringToFront(); await page.waitForTimeout(500);
  console.log('after other tab front: hidden=', await page.evaluate(() => document.hidden), 'rAF/s', await count());
  await page.bringToFront();
  await page.evaluate(() => { Object.defineProperty(document, 'hidden', { configurable: true, get: () => true }); document.dispatchEvent(new Event('visibilitychange')); });
  console.log('simulated hidden rAF/s', await count());
  await page.evaluate(() => { Object.defineProperty(document, 'hidden', { configurable: true, get: () => false }); document.dispatchEvent(new Event('visibilitychange')); });
  console.log('simulated visible again rAF/s', await count());
  await b.close();
})();
