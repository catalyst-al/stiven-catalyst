// Time Study's standard time (audit of 27 October 2026, T-23 / P2B-09): the tool called the observed median "the
// standard time" with no performance rating and no allowance, so the operators it counted were short by the allowance
// and by the pace of the observed operator. Standard time = observed median × rating × (1 + allowance), rating 100 % and
// allowance 0 % by default, and the page says which it is. Shift Capacity, which takes a rate from the Time Study,
// uses the rated (normal) time and adds its own PF&D allowance, as before.
process.env.TZ = 'Europe/Berlin';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const { openTool, keep, type, click, settle } = require('./helpers/tool-page.cjs');

const near = (a, b, eps = 1e-9) => assert.ok(Math.abs(a - b) < eps, `${a} ≈ ${b}`);
const read = (lang) => JSON.parse(fs.readFileSync(`src/_data/${lang === 'en' ? '' : `${lang}/`}timeStudy.json`, 'utf8'));

test('the arithmetic: standard = median × rating × (1 + allowance); the defaults leave the median', () => {
  const w = openTool('time-study');
  const M = w.TimeStudyMath;
  near(M.standardTime(20, 1.1, 0.15), 20 * 1.1 * 1.15);
  assert.equal(M.standardTime(20), 20, 'rating 100 % and allowance 0 %');
  const example = M.fromExample(read('en').example);
  const takt = M.takt(432 * 60, 540);
  const plain = M.analyse({ stations: example.stations, rows: example.rows, takt });
  near(plain.sum, 106.1, 1e-9);
  assert.equal(plain.operators, 3);
  assert.ok(plain.stations.every((s) => s.elements.every((e) => e.standard === e.median)));
  // Rated at 120 % with 15 % allowance: 106.1 × 1.2 × 1.15 = 146.418 s of work per unit, four operators at 48 s.
  const rated = M.analyse({ stations: example.stations, rows: example.rows, takt, rating: 1.2, allowance: 0.15 });
  near(rated.sum, 106.1 * 1.2 * 1.15, 1e-9);
  assert.equal(rated.operators, 4);
  const pack = rated.stations[1];
  assert.equal(pack.elements[0].median, 6.1, 'the observed median stays');
  near(pack.elements[0].standard, 6.1 * 1.38, 1e-9);
  near(pack.total, 49.9 * 1.38, 1e-9);
  assert.deepEqual([...rated.over.map((s) => s.index)], [1], 'Pack; Pick and scan stays under takt at 34.5 × 1.38 = 47.6 s');
});

for (const lang of ['en', 'de', 'sq']) {
  test(`${lang}: the page takes a rating and an allowance, and says what its standard time is`, async () => {
    const w = openTool('time-study', { lang });
    const d = w.document;
    const results = d.querySelector('[data-results]');
    const rating = d.querySelector('[data-setting][name="rating"]');
    const allowance = d.querySelector('[data-setting][name="allowance"]');
    assert.ok(rating && allowance, 'two inputs');
    // The defaults: the page says the standard times are the observed medians.
    const note = () => results.querySelector('.ts-standard-note')?.textContent || '';
    assert.match(note(), /100\s?%/);
    assert.match(note(), /0\s?%/);
    const operators = () => [...results.querySelectorAll('.dl-stat')].find((node) => node.querySelector('.dl-stat-note')?.textContent.includes('÷'))?.querySelector('.dl-stat-value').textContent;
    assert.equal(operators(), '3');
    type(w, rating, '120');
    type(w, allowance, '15');
    await settle(w, 400);
    assert.equal(operators(), '4', 'staffing counts the rating and the allowance');
    assert.match(note(), /120\s?%/);
    assert.match(note(), /15\s?%/);
    // The element table has the observed median and the standard time side by side.
    const packRow = [...results.querySelectorAll('.ts-table tbody tr')].find((tr) => /6[.,]1/.test(tr.children[4]?.textContent || ''));
    assert.ok(packRow, 'the Fetch box row');
    assert.match(packRow.children[5].textContent, /8[.,]4/, '6.1 × 1.2 × 1.15 = 8.4');
    const saved = keep(w)[read(lang).storageKey];
    assert.equal(saved.rating, '120');
    assert.equal(saved.allowance, '15');
  });
}

// A study saved by the Time Study before the rating existed: its own old script, at the checkpoint before Phase 1.
// The Time Study before phase 1 (tests/fixtures/pre-phase1, a frozen copy of 605d0df: a shallow clone has no history).
const OLD_STUDY = fs.readFileSync('tests/fixtures/pre-phase1/time-study.js', 'utf8');
const oldSaved = async () => {
  const old = openTool('time-study', { code: { 'time-study': OLD_STUDY } });
  type(old, old.document.querySelector('[data-setting][name="process"]'), 'Packing');
  await settle(old, 400);
  const storage = keep(old);
  assert.ok(storage['sc-time-study'] && !('rating' in storage['sc-time-study']), 'the old format has no rating');
  return storage;
};

test('an older saved study without a rating or allowance loads with 100 % and 0 %', async () => {
  const w = openTool('time-study', { storage: await oldSaved() });
  assert.equal(w.document.querySelector('[data-setting][name="process"]').value, 'Packing', 'the old study is loaded');
  assert.equal(w.document.querySelector('[data-setting][name="rating"]').value, '');
  assert.equal(w.document.querySelector('[data-setting][name="allowance"]').value, '');
  const operators = [...w.document.querySelectorAll('[data-results] .dl-stat')].find((node) => node.querySelector('.dl-stat-note')?.textContent.includes('÷'))?.querySelector('.dl-stat-value').textContent;
  assert.equal(operators, '3');
});

test('hand-off: Shift Capacity takes the rated time from the real Time Study page and adds its own allowance', async () => {
  // The Time Study page, its example rated at 120 % with a 15 % allowance in the Time Study itself.
  const study = openTool('time-study');
  type(study, study.document.querySelector('[data-setting][name="rating"]'), '120');
  type(study, study.document.querySelector('[data-setting][name="allowance"]'), '15');
  const storage = keep(study);
  assert.equal(storage['sc-time-study'].rating, '120');
  const cap = openTool('shift-capacity', { storage });
  const box = cap.document.querySelector('[data-study]');
  assert.equal(box.hidden, false, 'Shift Capacity offers the stations of the study');
  const items = [...box.querySelectorAll('.cp-study-item')];
  assert.equal(items.length, 3);
  // Pick and scan: Σ medians 34.5 s × 120 % = 41.4 s; Shift Capacity's allowance (15 % by default) on top, once.
  assert.match(items[0].textContent, /41[.,]4\s?s/);
  assert.match(items[0].textContent, /120\s?%/);
  const formula = items[0].querySelector('.cp-formula').textContent;
  assert.match(formula, /41[.,]4 s × \(1 \+ 15\s?%\)/);
  const uph = 3600 / (34.5 * 1.2 * 1.15);
  assert.match(formula, new RegExp(`= ${uph.toFixed(1).replace('.', '[.,]')}$`));
  // Used for a process: the rate it writes is the same.
  const select = items[0].querySelector('select');
  const process = select.value;
  click(cap, items[0].querySelector('button'));
  const saved = keep(cap);
  const key = Object.keys(saved).find((k) => /^sc-shift-capacity/.test(k) && saved[k]?.processes);
  const row = saved[key].processes.find((p) => p.id === process);
  assert.equal(row.uph, String(Math.round(uph * 10) / 10));
});

test('hand-off: a study saved before the rating existed gives Shift Capacity the plain medians', async () => {
  const cap = openTool('shift-capacity', { storage: await oldSaved() });
  const items = [...cap.document.querySelectorAll('[data-study] .cp-study-item')];
  assert.equal(items.length, 3);
  assert.match(items[0].textContent, /34[.,]5\s?s/);
  assert.doesNotMatch(items[0].textContent, /rated|bewertet|vlerësuar/);
});
