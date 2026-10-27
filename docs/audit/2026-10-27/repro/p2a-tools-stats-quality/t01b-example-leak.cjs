// Regression 1, part C: the example is saved as soon as the visitor touches a setting (e.g. a range button or the
// target box). Do Shift Pulse / Shift Handover / Daily Board / Ops Report then show the example as this site's numbers?
const { launch, newPage, BASE } = require('./pw.cjs');
const { check, note } = require('./lib.cjs');
(async () => {
  const browser = await launch();
  const { page } = await newPage(browser);
  for (const t of ['damage-control', 'incomplete-control', 'delay-analyzer']) {
    await page.goto(`${BASE}/tools/${t}/`); await page.waitForTimeout(600);
    // click "Last 7 days"/"week" range preset – an innocent look-around
    const preset = page.locator('[data-preset="week"]').first();
    if (await preset.count()) await preset.click();
    await page.waitForTimeout(400);
    // click "all" back
    const all = page.locator('[data-preset="all"]').first();
    if (await all.count()) await all.click();
    await page.waitForTimeout(400);
  }
  const stored = await page.evaluate(() => ['sc-damage-control', 'sc-incomplete-control', 'sc-delay-analyzer'].map((k) => { const s = JSON.parse(localStorage.getItem(k) || 'null'); return s && { k, rows: s.rows.length, example: s.example }; }));
  note('C: stored after clicking range presets only', stored);
  await page.goto(`${BASE}/tools/shift-pulse/`); await page.waitForTimeout(800);
  const pulse = (await page.locator('[data-pulse-results]').innerText()).replace(/\s+/g, ' ');
  note('C: Shift Pulse', pulse.slice(0, 600));
  check('C: Shift Pulse marks example-derived numbers as example', true, /example|Beispiel/i.test(pulse));
  await page.goto(`${BASE}/tools/daily-board/`); await page.waitForTimeout(800);
  note('C: Daily Board text', (await page.locator('main').innerText()).replace(/\s+/g, ' ').slice(0, 300));
  await page.goto(`${BASE}/tools/ops-report/`); await page.waitForTimeout(1200);
  const ops = (await page.locator('main').innerText()).replace(/\s+/g, ' ');
  const i = ops.search(/Damage|damaged/i);
  note('C: Ops Report around damage', ops.slice(Math.max(0, i - 200), i + 400));
  await page.screenshot({ path: 't01b-ops.png', fullPage: false });
  await browser.close();
})();
