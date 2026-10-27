// Example data vs real data: Action Tracker example, then a real action handed over from 5 Whys' link (?action=...).
const { open, close } = require('./lib');
(async () => {
  const { page, ctx } = await open('/tools/action-tracker/');
  const before = await page.evaluate(() => JSON.parse(localStorage.getItem('sc-actions') || '{"rows":[]}').rows.length);
  const note1 = await page.evaluate(() => !!document.querySelector('.dl-example-note:not([hidden]), [data-example-note]:not([hidden])'));
  // a real hand-over from another tool (the way ActionsStore.link works)
  await page.goto('http://localhost:8103/tools/action-tracker/?action=Real%20fix%20at%20dock%203&owner=Me&source=five-whys');
  await page.waitForTimeout(800);
  const rows = await page.evaluate(() => JSON.parse(localStorage.getItem('sc-actions')).rows.map((r) => r.title));
  const note2 = await page.evaluate(() => [...document.querySelectorAll('.dl-example-note, [data-example-note]')].filter((e) => !e.hidden && e.offsetParent).map((e) => e.textContent.trim().slice(0, 120)));
  const kpi = await page.evaluate(() => document.querySelector('[data-results]')?.innerText.slice(0, 250));
  console.log({ exampleRowsOnFirstVisit: before, exampleNoteShown: note1, rowsAfterRealHandover: rows.length, containsReal: rows.includes('Real fix at dock 3'), exampleNoteAfter: note2, kpi });
  await ctx.close(); await close();
})();
