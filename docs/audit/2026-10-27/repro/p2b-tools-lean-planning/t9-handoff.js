// SMED -> Action Tracker: click "Add the n countermeasures", reload, click again. Then the same with sc-actions full.
const { open, close } = require('./lib');
(async () => {
  for (const full of [false, true]) {
    const { page } = await open('/tools/smed/');
    const ex = page.locator('button[data-example]:visible'); if (await ex.count()) await ex.first().click(); await page.waitForTimeout(500);
    const block = () => page.evaluate(() => { const o = Storage.prototype.setItem; Storage.prototype.setItem = function (k, v) { if (k === 'sc-actions') throw new DOMException('full', 'QuotaExceededError'); return o.call(this, k, v); }; });
    if (full) await block();
    const btn = () => page.locator('button', { hasText: /countermeasures to actions/ }).first();
    await btn().click(); await page.waitForTimeout(300);
    const msg1 = await page.evaluate(() => document.querySelector('[data-actions-status]')?.textContent);
    const warn = await page.evaluate(() => document.querySelectorAll('.tk-save-warning').length);
    let rows;
    if (!full) {
      await page.reload(); await page.waitForTimeout(600);
      await btn().click(); await page.waitForTimeout(300);
      const list = await page.evaluate(() => JSON.parse(localStorage.getItem('sc-actions')).rows.map((r) => r.title));
      rows = `${list.length} stored, ${new Set(list).size} unique`;
    } else rows = await page.evaluate(() => localStorage.getItem('sc-actions'));
    console.log(full ? 'STORAGE FULL' : 'normal', '| message:', msg1, '| warning boxes:', warn, '| sc-actions:', rows);
    await page.context().close();
  }
  // Action Tracker itself under quota: add an action through the form
  const { page } = await open('/tools/action-tracker/');
  await page.evaluate(() => { const o = Storage.prototype.setItem; Storage.prototype.setItem = function (k, v) { if (k === 'sc-actions') throw new DOMException('full', 'QuotaExceededError'); return o.call(this, k, v); }; });
  const title = page.locator('main form input[type=text], main form input:not([type])').first();
  await title.fill('Fix the dock door');
  await page.locator('main form button[type=submit], main form button.button-primary').first().click().catch((e) => console.log('submit fail', String(e).slice(0, 80)));
  await page.waitForTimeout(500);
  const shown = await page.evaluate(() => document.querySelector('main').innerText.includes('Fix the dock door'));
  const warn = await page.evaluate(() => [...document.querySelectorAll('.tk-save-warning,[role=alert]')].map((e) => e.textContent.trim().slice(0, 80)));
  console.log('Action Tracker under quota: action visible on page:', shown, '| warning:', JSON.stringify(warn), '| stored:', await page.evaluate(() => localStorage.getItem('sc-actions')));
  await page.context().close();
  await close();
})();
