const { chromium } = require('$SRC/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  const page = await b.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto('http://localhost:8105/magazine/management-review-nr-80.html', { waitUntil: 'load' }); await page.waitForTimeout(1000);
  const q = () => page.evaluate(() => { const charts = [...document.querySelectorAll('.wk-anim')]; return { charts: charts.length, notIn: charts.filter((c) => !c.classList.contains('is-in')).length, hiddenParts: charts.flatMap((c) => [...c.querySelectorAll('.wk-path,.wk-area,.wk-pop,.wk-legend li,.wk-grow,.wk-rise,.wk-arc')]).filter((e) => { const cs = getComputedStyle(e); return cs.opacity === '0' || cs.strokeDashoffset === '1' || cs.strokeDashoffset === '1px' || /matrix\(0|matrix\(1, 0, 0, 0/.test(cs.transform) || cs.strokeDasharray === '0px, 100px'; }).length }; });
  console.log('screen at load', JSON.stringify(await q()));
  await page.emulateMedia({ media: 'print' }); await page.waitForTimeout(300);
  console.log('print at load', JSON.stringify(await q()));
  await page.pdf({ path: 'mr80-print.pdf' });
  await b.close();
})();
