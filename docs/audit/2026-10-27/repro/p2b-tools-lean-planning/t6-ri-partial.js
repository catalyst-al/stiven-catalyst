// Room Inspection: answer ONE item "pass" out of the whole checklist, save, and read the stored verdict and the KPI.
const { open, close } = require('./lib');
(async () => {
  const { page, errors } = await open('/tools/room-inspection/');
  // start clean (no example)
  await page.evaluate(() => { Object.keys(localStorage).filter((k) => k.startsWith('sc-room')).forEach((k) => localStorage.removeItem(k)); });
  await page.reload(); await page.waitForTimeout(500);
  const ex = await page.$('[data-clear-example], button[data-clear-example]'); if (ex) { await ex.click().catch(() => {}); await page.waitForTimeout(300); }
  await page.fill('#ri-room', '412'); await page.dispatchEvent('#ri-room', 'input'); await page.dispatchEvent('#ri-room', 'change');
  await page.fill('#ri-attendant', 'Marta'); await page.dispatchEvent('#ri-attendant', 'input');
  const total = await page.$$eval('input[type=radio][value=pass]', (els) => els.length);
  await page.check('input[type=radio][value=pass] >> nth=0');
  await page.waitForTimeout(300);
  const saveDisabled = await page.$eval('[data-save]', (b) => b.disabled);
  await page.click('[data-save]'); await page.waitForTimeout(600);
  const status = await page.$eval('[data-walk-status]', (e) => e.textContent).catch(() => '');
  const flash = await page.evaluate(() => [...document.querySelectorAll('[role=status],.flash,.tk-flash')].map((e) => e.textContent.trim()).filter(Boolean).join(' | '));
  const stored = await page.evaluate(() => { const s = JSON.parse(localStorage.getItem('sc-room-inspection') || '{}'); return (s.rows || []).map((r) => ({ room: r.room, answers: Object.keys(r.answers || {}).length })); });
  const verdict = await page.evaluate(() => { const M = window.RoomInspectionMath; const s = JSON.parse(localStorage.getItem('sc-room-inspection')); const r = s.rows.at(-1); return M.verdict(M.score(r.answers, M.itemsOf((s.templates || {})[r.template] || null, ['bathroom','bedroom','windows','amenities','entry'])), 0.9); });
  const kpi = await page.evaluate(() => (document.querySelector('[data-results]') || {}).innerText?.slice(0, 600));
  console.log({ items: total, saveDisabled, status, flash: flash.slice(0, 300), stored, kpi });
  console.log('errors', errors);
  await page.screenshot({ path: __dirname + '/ri-partial.png', fullPage: false });
  await page.context().close(); await close();
})();
