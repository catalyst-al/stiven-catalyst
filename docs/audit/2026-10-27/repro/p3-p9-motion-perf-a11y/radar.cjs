const { chromium } = require('$SRC/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  const page = await b.newPage({ viewport: { width: 1440, height: 900 } });
  for (const p of ['/tools/cx-control-tower/', '/tools.html', '/']) {
    await page.goto('http://localhost:8105' + p, { waitUntil: 'load' }); await page.waitForTimeout(1500);
    const r = await page.evaluate(() => [...document.querySelectorAll('.zenith-radar')].map((el) => { const a = el.getAnimations(); return { cls: el.getAttribute('class'), anims: a.map((x) => ({ name: x.animationName, state: x.playState, kf: x.effect.getKeyframes().map((k) => Object.keys(k).filter((q) => !['offset', 'easing', 'composite', 'computedOffset'].includes(q)).map((q) => q + '=' + k[q]).join(',')) })), transform: getComputedStyle(el).transform }; }));
    console.log(p, JSON.stringify(r).slice(0, 700));
    if (r.length) { await page.waitForTimeout(1500); console.log('  after 1.5s transform:', await page.evaluate(() => getComputedStyle(document.querySelector('.zenith-radar')).transform), 'opacity', await page.evaluate(() => getComputedStyle(document.querySelector('.zenith-radar')).opacity)); }
  }
  await b.close();
})();
