// After a first Daily Board visit, the visitor clears the Damage Control example and logs own data.
const { launch, newPage, BASE } = require('./pw.cjs');
const { check, note } = require('./lib.cjs');
(async () => {
  const browser = await launch();
  const { page } = await newPage(browser);
  await page.goto(`${BASE}/tools/daily-board/`); await page.waitForTimeout(800);
  await page.goto(`${BASE}/tools/damage-control/`); await page.waitForTimeout(600);
  await page.locator('.dl-example-note button').click(); await page.waitForTimeout(300);
  await page.locator('[data-entry] [name=units]').fill('5').catch(() => {});
  await page.locator('[data-entry] button[type=submit]').click(); await page.waitForTimeout(300);
  await page.locator('[name=volume]').fill('1000'); await page.waitForTimeout(800);
  const r = await page.evaluate(() => ({ note: document.querySelector('[data-profile-target]')?.hidden === false ? document.querySelector('[data-profile-target]').textContent.trim() : null, placeholder: document.querySelector('[name=target]').placeholder, result: document.querySelector('[data-results]').textContent.replace(/\s+/g, ' ').slice(0, 400) }));
  note('own log after demo profile', r);
  check('own damage log is judged against a target the visitor never set', false, /Target/.test(r.result) && /0\.30%/.test(r.result));
  await browser.close();
})();
