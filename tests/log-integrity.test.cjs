// What a log keeps, through the real pages: the same rows pasted twice are not counted twice (audit finding T-17),
// saved data the browser cannot read any more is kept aside and never silently replaced by the example (P2A-10,
// P2B-08), and an Excel export keeps a code with leading zeros as text (T-22).
process.env.TZ = 'Europe/Berlin';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { openTool, keep, click, settle } = require('./helpers/tool-page.cjs');

const NOW = '2026-10-25T11:00:00Z';
const PASTE = ['2026-10-20\tEarly\tLoading\tCrushed\tStacking\t3\t\t', '2026-10-21\tLate\tPicking\tTorn\tHandling\t2\t4.5\tdock 2'].join('\n');

const paste = (w, text) => {
  w.document.querySelector('#dl-paste').value = text;
  click(w, w.document.querySelector('[data-import]'));
  return w.document.querySelector('[data-import-status]').textContent;
};

test('the same rows pasted twice into a log are added once, and the page says so', async () => {
  const w = openTool('damage-control', { now: NOW });
  click(w, w.querySelector?.('.dl-example-note button') || w.document.querySelector('.dl-example-note button'));
  await settle(w);
  paste(w, PASTE);
  await settle(w);
  const again = paste(w, PASTE);
  await settle(w);
  const rows = keep(w)['sc-damage-control'].rows;
  assert.equal(rows.length, 2, `two rows, not ${rows.length}`);
  assert.match(again, /already in the log/i);
  // After a reload too.
  const reloaded = openTool('damage-control', { storage: keep(w), now: NOW });
  paste(reloaded, PASTE);
  await settle(reloaded);
  assert.equal(keep(reloaded)['sc-damage-control'].rows.length, 2);
});

test('saved data the browser cannot read is kept aside and not replaced by the example', async () => {
  const damaged = '{"rows":[{"date":"2026-10-20","shift":"Early","stage":"Loading","type":"Crushed","units":3},{"date":"2026-10-2';
  const w = openTool('damage-control', { storage: { 'sc-damage-control': damaged }, now: NOW });
  await settle(w);
  const note = w.document.querySelector('.dl-example-note');
  assert.ok(!note || note.hidden, 'the example does not open over damaged data');
  const kept = Object.entries(keep(w)).find(([key, value]) => key !== 'sc-damage-control' && typeof value === 'string' && value === damaged);
  assert.ok(kept, 'the damaged text is kept under its own key');
  assert.match(w.document.body.textContent, /could not be read/i, 'and the page says so');
});

test('an Excel export keeps codes with leading zeros as text, and numbers as numbers', () => {
  const w = openTool('inventory-abc', { now: NOW });
  const bytes = w.ToolKit.xlsxFile([['SKU', 'Qty', 'Share'], ['00123', '42', '0.5'], ['0', '-7', '+5']]);
  const xml = Buffer.from(bytes).toString('latin1');
  assert.match(xml, /r="A2" t="inlineStr"><is><t xml:space="preserve">00123</, '00123 stays text');
  assert.match(xml, /<c r="B2"><v>42<\/v>/, '42 is a number');
  assert.match(xml, /<c r="C2"><v>0.5<\/v>/);
  assert.match(xml, /<c r="A3"><v>0<\/v>/);
  assert.match(xml, /<c r="B3"><v>-7<\/v>/);
});
