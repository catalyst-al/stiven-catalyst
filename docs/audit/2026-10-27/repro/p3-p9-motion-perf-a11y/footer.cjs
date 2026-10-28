const { chromium } = require('$SRC/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  for (const p of ['/tools.html', '/podcast.html']) {
    const page = await b.newPage({ viewport: { width: 390, height: 844 } });
    await page.goto('http://localhost:8105' + p, { waitUntil: 'load' });
    console.log(p, JSON.stringify(await page.evaluate(() => [...document.querySelectorAll('footer a')].slice(0, 14).map((a) => { const r = a.getBoundingClientRect(); return `${a.textContent.trim().slice(0, 12)}@${Math.round(r.left)},${Math.round(r.top + scrollY)} ${Math.round(r.width)}x${Math.round(r.height)}`; }))));
    await page.close();
  }
  await b.close();
})();
