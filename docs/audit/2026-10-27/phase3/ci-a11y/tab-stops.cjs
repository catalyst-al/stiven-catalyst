// PM-9: how many Tab presses the CX Control Tower takes from the top of the page to the end, and how many of them land
// inside a chart (each control counted once). Usage: node tests/browser/server.mjs 8312 & node docs/audit/2026-10-27/phase3/ci-a11y/tab-stops.cjs [port]
const path = require('node:path');
const fs = require('node:fs');
const root = path.resolve(__dirname, '../../../../..');
const { chromium } = require(path.join(root, 'node_modules/playwright'));
const port = Number(process.argv[2]) || 8312;
const executablePath = fs.existsSync('/opt/pw-browsers/chromium') ? '/opt/pw-browsers/chromium' : undefined;
(async () => {
  const browser = await chromium.launch({ executablePath });
  for (const width of [390, 1440]) {
    const page = await browser.newPage({ viewport: { width, height: width < 600 ? 844 : 900 }, reducedMotion: 'reduce' });
    await page.route(/^(?!http:\/\/127\.0\.0\.1[:/])[a-z]+:\/\//, (r) => r.abort());
    await page.goto(`http://127.0.0.1:${port}/tools/cx-control-tower/`);
    await page.waitForLoadState('networkidle');
    let stops = 0;
    let inCharts = 0;
    const seen = new Set();
    for (let i = 0; i < 600; i++) {
      await page.keyboard.press('Tab');
      const where = await page.evaluate(() => {
        const a = document.activeElement;
        if (!a || a === document.body) return null;
        if (!a.dataset.tabProbe) a.dataset.tabProbe = String(Math.random());
        return { id: a.dataset.tabProbe, chart: Boolean(a.closest('.cx-mini-chart')), what: `${a.tagName} ${(a.textContent || a.getAttribute('aria-label') || '').trim().slice(0, 20)}` };
      });
      if (process.env.DEBUG) console.log(where && where.what);
      // The end: past the last control (the body, or the share button after the footer), or round to the first again.
      // A date field takes several presses (day, month, year) on one element: counted once.
      if (!where || where.what.startsWith('BUTTON Share') || (seen.size && where.id === [...seen][0])) break;
      if (seen.has(where.id)) continue;
      seen.add(where.id);
      stops++;
      if (where.chart) inCharts++;
    }
    console.log(`${width} px: ${stops} tab stops, ${inCharts} of them points of a chart`);
    await page.close();
  }
  await browser.close();
})();
