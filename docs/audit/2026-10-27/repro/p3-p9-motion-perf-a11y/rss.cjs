const { chromium } = require('$SRC/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  await page.goto('http://localhost:8105/magazine/management-review-nr-80.html', { waitUntil: 'load' }); await page.waitForTimeout(800);
  for (let i = 0; i < 60; i++) { await page.keyboard.press('Tab'); const t = await page.evaluate(() => document.activeElement.textContent.trim()); if (t === 'RSS') break; }
  const info = await page.evaluate(() => { const e = document.activeElement, r = e.getBoundingClientRect(); const so = document.querySelector('.share-orbit'); const s = so.getBoundingClientRect(); return { rss: [r.left, r.top, r.right, r.bottom].map(Math.round), share: [s.left, s.top, s.right, s.bottom].map(Math.round), pos: getComputedStyle(so).position }; });
  console.log(JSON.stringify(info));
  await page.screenshot({ path: 'focus-rss.png', clip: { x: 200, y: Math.max(0, info.rss[1] - 80), width: 190, height: 160 } });
  await b.close();
})();
