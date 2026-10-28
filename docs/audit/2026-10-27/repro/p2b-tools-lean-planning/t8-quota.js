// Storage full: setItem throws QuotaExceededError for sc- keys. Load the example (which writes) and look for the warning.
const path = require('path');
const { open, close } = require('./lib');
(async () => {
  for (const tool of ['fmea', 'time-study', 'kanban-sizing', 'five-whys', 'room-status', 'standard-work', 'action-tracker']) {
    const { page, errors } = await open(`/tools/${tool}/`);
    await page.evaluate(() => { const orig = Storage.prototype.setItem; Storage.prototype.setItem = function (k, v) { if (String(k).startsWith('sc-') && !String(k).startsWith('sc-seen')) { const e = new DOMException('full', 'QuotaExceededError'); throw e; } return orig.call(this, k, v); }; });
    const ex = await page.$('button[data-example], [data-example] button');
    if (ex) await ex.click().catch(() => {});
    // also type into the first text input of the tool
    const inp = await page.$('main input[type=text]:visible, main textarea:visible, main input:not([type]):visible');
    if (inp) { await inp.fill('Test 123').catch(() => {}); await inp.dispatchEvent('input').catch(() => {}); await inp.dispatchEvent('change').catch(() => {}); }
    await page.waitForTimeout(700);
    const warn = await page.evaluate(() => [...document.querySelectorAll('.tk-save-warning,[role=alert]')].map((e) => e.textContent.trim().slice(0, 120)));
    console.log(tool, 'warning:', JSON.stringify(warn), 'errors:', errors.slice(0, 2).join(' / ').slice(0, 200));
    await page.context().close();
  }
  await close();
})();
