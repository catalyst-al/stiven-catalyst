// Hand-offs between tools, followed through both tools' real code: the source tool is opened as a reader opens it
// (tests/helpers/tool-page.cjs), its own form writes the data, and the reading tool is opened on what the source left
// in the browser. The audit of 27 October 2026 found a hand-off whose unit test passed with a fixture in the shape the
// reader expected while the real writer used other field names (Cost of Quality ← Waste Log, finding T-05); these
// tests exist so that cannot happen again.
process.env.TZ = 'Europe/Berlin';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { openTool, keep, click, submit } = require('./helpers/tool-page.cjs');

const NOW = '2026-10-25T11:00:00Z';
const SUFFIX = { en: '', de: '-de', sq: '-sq' };

// One entry typed into the Waste Log form: 10 units at 2.50 € (2,50 in German and Albanian).
const logWaste = (lang, storage = {}) => {
  const w = openTool('waste-log', { lang, storage, now: NOW });
  const form = w.document.querySelector('[data-entry]');
  form.elements.product.value = 'Croissants';
  form.elements.qty.value = '10';
  form.elements.cost.value = lang === 'en' ? '2.50' : '2,50';
  submit(w, form);
  return keep(w);
};

for (const lang of ['en', 'de', 'sq']) {
  test(`Waste Log → Cost of Quality (${lang}): an entry typed in the Waste Log is brought in at its value`, () => {
    const storage = logWaste(lang);
    const log = storage[`sc-waste-log${SUFFIX[lang]}`];
    assert.ok(log && Array.isArray(log.rows), 'the Waste Log saved its log');
    const own = log.rows.filter((row) => row.item === 'Croissants');
    assert.equal(own.length, 1, 'the typed entry is in the log');

    const w = openTool('cost-of-quality', { lang, storage, now: NOW });
    click(w, w.document.querySelector('[data-import]'));
    const status = w.document.querySelector('.coq [data-status], [data-status]')?.textContent ?? '';
    const saved = keep(w)[`sc-cost-of-quality${SUFFIX[lang]}`];
    const line = saved?.lines?.find((item) => item.source === 'waste-log');
    assert.ok(line, `a Waste Log line is brought in (the page said: "${status}")`);
    assert.equal(Number(line.amount), 25, 'the line is worth 10 × 2.50 = 25 €');
    assert.equal(line.period, 'month');
  });
}
