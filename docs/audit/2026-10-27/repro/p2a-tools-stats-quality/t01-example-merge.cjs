// Regression 1: sample data merging with real data. Real Chromium, fresh profile.
// A) First visit to Damage Control opens on the example: is it written to storage? Does Shift Pulse / Shift Handover
//    then present it as this site's numbers (no "example" label)?
// B) Remove ONE example row in Damage Control, then add an own row: does the rest of the example stay as real data?
const { launch, newPage, BASE } = require('./pw.cjs');
const { check, note } = require('./lib.cjs');
(async () => {
  const browser = await launch();
  const { context, page } = await newPage(browser);
  await page.goto(`${BASE}/tools/damage-control/`, { waitUntil: 'load' });
  await page.waitForTimeout(800);
  const exampleShown = await page.locator('.dl-example-note:not([hidden])').count();
  note('A: damage-control example note visible on first visit', exampleShown);
  // leave page (pagehide flushes pending saves)
  await page.goto(`${BASE}/tools/shift-pulse/`, { waitUntil: 'load' });
  await page.waitForTimeout(800);
  const saved = await page.evaluate(() => localStorage.getItem('sc-damage-control'));
  const parsed = saved ? JSON.parse(saved) : null;
  note('A: sc-damage-control stored after a mere visit', parsed ? { rows: parsed.rows.length, example: parsed.example } : null);
  const pulse = await page.locator('[data-pulse-results]').innerText();
  note('A: Shift Pulse result text (first 400 chars)', pulse.slice(0, 400).replace(/\s+/g, ' '));
  check('A: Shift Pulse labels example-derived numbers as example', true, /example|Beispiel|shembull/i.test(pulse));
  // Delay analyzer + incomplete too
  for (const t of ['incomplete-control', 'delay-analyzer']) { await page.goto(`${BASE}/tools/${t}/`); await page.waitForTimeout(500); }
  await page.goto(`${BASE}/tools/shift-pulse/`); await page.waitForTimeout(800);
  const pulse2 = await page.locator('[data-pulse-results]').innerText();
  note('A2: Shift Pulse after visiting 3 logs once (no data typed)', pulse2.slice(0, 700).replace(/\s+/g, ' '));
  await page.goto(`${BASE}/tools/shift-handover/`); await page.waitForTimeout(800);
  const hoFill = await page.locator('[data-fill], button:has-text("Fill from the logs"), button:has-text("logs")').count();
  note('A3: shift-handover fill-from-logs buttons', hoFill);

  // B) delete one example row, then add own row
  const { page: p2 } = await newPage(browser);
  await p2.goto(`${BASE}/tools/damage-control/`); await p2.waitForTimeout(800);
  const before = await p2.evaluate(() => document.querySelectorAll('[data-log] tr').length);
  const totalBefore = await p2.evaluate(() => JSON.parse(localStorage.getItem('sc-damage-control') || 'null'));
  await p2.locator('[data-log] [data-remove]').first().click();
  await p2.waitForTimeout(400);
  const noteAfterDelete = await p2.locator('.dl-example-note:not([hidden])').count();
  note('B: example note visible after deleting one example row', noteAfterDelete);
  // add own row via the form
  const form = p2.locator('[data-entry]');
  await form.locator('[name=units]').fill('1').catch(() => {});
  await form.locator('button[type=submit]').click();
  await p2.waitForTimeout(400);
  const after = await p2.evaluate(() => { const s = JSON.parse(localStorage.getItem('sc-damage-control')); return { rows: s.rows.length, example: s.example }; });
  note('B: rows shown before', before);
  note('B: storage after delete-one + add-own', after);
  check('B: after delete+add, only the own row remains (example fully removed)', 1, after.rows);
  console.log('errors', page.__errors.slice(0, 5), p2.__errors.slice(0, 5));
  await browser.close();
})();
