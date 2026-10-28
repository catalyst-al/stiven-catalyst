// Cost of Quality "bring in": Waste Log and Guest Complaints entries made through their real forms (real Chromium).
const { launch, newPage, BASE } = require('./pw.cjs');
const { check, note } = require('./lib.cjs');
(async () => {
  const browser = await launch();
  const { page } = await newPage(browser);
  // Mark first visits done so no example loads (empty logs).
  await page.goto(`${BASE}/tools/waste-log/`);
  await page.evaluate(() => { localStorage.setItem('sc-waste-log', JSON.stringify({ rows: [], covers: {}, example: {} })); });
  await page.reload(); await page.waitForTimeout(500);
  const f = page.locator('form[data-entry]');
  await f.locator('[name=product]').fill('Bread rolls');
  await f.locator('[name=qty]').fill('10');
  await f.locator('[name=cost]').fill('2.50');
  await f.locator('button[type=submit]').click();
  await page.waitForTimeout(400);
  const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('sc-waste-log')).rows);
  note('waste-log stored row', saved[0]);
  // Independent: 10 x 2.50 = 25.00 EUR in the last 30 days
  await page.goto(`${BASE}/tools/cost-of-quality/`); await page.waitForTimeout(600);
  // clear example if any
  await page.evaluate(() => { localStorage.setItem('sc-cost-of-quality', JSON.stringify({ lines: [], example: false })); });
  await page.reload(); await page.waitForTimeout(500);
  await page.locator('[data-import]').click(); await page.waitForTimeout(400);
  const status = await page.locator('[data-import]').evaluate((b) => (b.closest('section,form,div').parentElement.innerText));
  const lines = await page.evaluate(() => JSON.parse(localStorage.getItem('sc-cost-of-quality') || '{}').lines);
  note('CoQ status text after bring-in', status.replace(/\s+/g, ' ').match(/Nothing to bring in[^.]*\.|Brought in[^.]*\./)?.[0] || status.slice(0, 200));
  note('CoQ lines after bring-in', lines);
  check('CoQ brings in the 25.00 EUR of the Waste Log entry', '25', (lines || []).find((l) => l.source === 'waste-log')?.amount ?? null);
  await browser.close();
})();
