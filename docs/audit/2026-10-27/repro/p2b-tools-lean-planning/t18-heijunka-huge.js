// Heijunka UI: the example, then the first product's demand typed as 1000000000 (a slip of the finger).
const { open, close } = require('./lib');
(async () => {
  const { page, errors } = await open('/tools/heijunka/');
  const ex = page.locator('button[data-example]:visible'); if (await ex.count()) { await ex.first().click(); await page.waitForTimeout(500); }
  const inputs = await page.$$eval('input', (els) => els.map((e) => [e.id, e.name, e.dataset.field || e.dataset.f || '', e.value].join('|')).filter((s) => /demand|dem/i.test(s)).slice(0, 5));
  console.log('demand inputs:', inputs);
  const loc = page.locator('input[data-field="demand"], input[name*="demand"], input[id*="demand"]').first();
  const before = await page.evaluate(() => document.querySelector('[data-results]')?.innerText.slice(0, 120));
  const t0 = Date.now();
  page.evaluate(() => { const i = document.getElementById('hj-demand-0'); i.value = '1000000000'; i.dispatchEvent(new Event('input', { bubbles: true })); i.dispatchEvent(new Event('change', { bubbles: true })); }).catch((e) => console.log('evaluate error', String(e).slice(0, 200)));
  await page.waitForTimeout(3000);
  const after = await page.evaluate(() => document.querySelector('[data-results]')?.innerText.slice(0, 200)).catch((e) => 'eval failed ' + e);
  console.log({ before, after, ms: Date.now() - t0, errors: errors.slice(0, 3) });
  await page.context().close(); await close();
})();
