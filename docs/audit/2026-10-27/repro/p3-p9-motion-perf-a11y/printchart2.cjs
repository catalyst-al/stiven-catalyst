const { chromium } = require('$SRC/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  for (const scrolled of [false, true]) {
    const page = await b.newPage({ viewport: { width: 1440, height: 900 } });
    await page.goto('http://localhost:8105/magazine/management-review-nr-80.html', { waitUntil: 'load' }); await page.waitForTimeout(800);
    if (scrolled) { for (let y = 0; y < 8000; y += 400) { await page.evaluate((yy) => scrollTo(0, yy), y); await page.waitForTimeout(100); } await page.waitForTimeout(2500); }
    await page.emulateMedia({ media: 'print' });
    console.log('scrolled', scrolled, JSON.stringify(await page.evaluate(() => [...document.querySelectorAll('.weekly-chart, .wk-anim')].map((c) => ({ cls: c.className.toString().slice(0, 40), disp: getComputedStyle(c).display, vis: getComputedStyle(c).visibility, h: Math.round(c.getBoundingClientRect().height), isIn: c.classList.contains('is-in') })))));
    await page.pdf({ path: `mr80-print-${scrolled ? 'scrolled' : 'top'}.pdf` });
    await page.close();
  }
  await b.close();
})();
