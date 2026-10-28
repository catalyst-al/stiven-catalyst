const { chromium } = require('$SRC/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  for (const w of [390, 1440]) {
    const ctx = await b.newContext({ viewport: { width: w, height: w < 600 ? 844 : 900 }, isMobile: w < 600, hasTouch: w < 600 });
    const page = await ctx.newPage();
    await page.goto('http://localhost:8105/', { waitUntil: 'load' }); await page.waitForTimeout(2500);
    const btn = page.locator('[data-cosmos-pause]');
    const bb = await btn.boundingBox();
    const info = await btn.evaluate((e) => { const cs = getComputedStyle(e); return { text: e.textContent, fs: cs.fontSize, color: cs.color, bg: cs.backgroundColor, border: cs.borderColor, ariaPressed: e.getAttribute('aria-pressed') }; });
    console.log(w, 'pause box', JSON.stringify(bb), JSON.stringify(info), 'scrollY to reach:', Math.round(bb.y));
    await page.screenshot({ path: `home-running-${w}.png`, fullPage: false });
    // keyboard: tab until pause focused
    let n = 0; for (; n < 80; n++) { await page.keyboard.press('Tab'); if (await page.evaluate(() => document.activeElement.matches('[data-cosmos-pause]'))) break; }
    console.log(w, 'tab presses to reach pause:', n + 1);
    await page.keyboard.press('Enter'); await page.waitForTimeout(300);
    console.log(w, 'after Enter:', await btn.textContent(), 'is-paused', await page.evaluate(() => document.querySelector('[data-cosmos]').classList.contains('is-paused')));
    await page.reload({ waitUntil: 'load' }); await page.waitForTimeout(800);
    console.log(w, 'after reload:', await btn.textContent(), 'is-paused', await page.evaluate(() => document.querySelector('[data-cosmos]').classList.contains('is-paused')));
    await ctx.close();
  }
  await b.close();
})();
