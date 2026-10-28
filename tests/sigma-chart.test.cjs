// Sigma & Control Chart (src/js/sigma-chart.js) on its built page: the sigma table marks the level a process reaches,
// perfect delivery needs two measures and names a box outside 0–100, and a chart with too few per day says so.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const { JSDOM } = require('jsdom');

const hasSite = fs.existsSync('_site/tools/sigma-control-chart/index.html');
const open = (saved = {}) => {
  const html = fs.readFileSync('_site/tools/sigma-control-chart/index.html', 'utf8').replace(/<script\b[^>]*\bsrc=[^>]*><\/script>/g, '');
  const { window } = new JSDOM(html, { url: 'https://example.test/tools/sigma-control-chart/', runScripts: 'outside-only', pretendToBeVisual: true });
  window.scrollTo = () => {};
  window.HTMLElement.prototype.scrollIntoView = () => {};
  for (const [key, value] of Object.entries(saved)) window.localStorage.setItem(key, JSON.stringify(value));
  for (const file of ['tool-kit', 'sigma-chart']) window.eval(fs.readFileSync(`src/js/${file}.js`, 'utf8'));
  return window;
};
const type = (window, name, value) => {
  const input = window.document.querySelector(`[data-calc][name="${name}"]`);
  input.value = value;
  input.dispatchEvent(new window.Event('input', { bubbles: true }));
};
const marked = (window) => window.document.querySelector('[data-sigma-table] tr.is-current th')?.firstChild.textContent;

test('the sigma table marks the level of its own reference points', { skip: !hasSite }, () => {
  const window = open();
  type(window, 'units', '1000000');
  for (const [defects, level] of [['233', '5.0'], ['6210', '4.0'], ['66807', '3.0'], ['234', '4.5']]) {
    type(window, 'defects', defects);
    assert.equal(marked(window), level, `${defects} DPMO`);
  }
  type(window, 'units', '1000');
  type(window, 'defects', '0');
  assert.match(window.document.querySelector('[data-sigma-out]').textContent, /≥ 4\.25/, 'none in 1,000 is a bound, not 6+');
});

test('perfect delivery needs two measures and names a box outside 0–100', { skip: !hasSite }, () => {
  const window = open();
  const out = () => window.document.querySelector('[data-perfect-out]').textContent;
  type(window, 'onTime', '96.5');
  assert.match(out(), /Enter at least two/);
  type(window, 'undamaged', '120');
  assert.match(out(), /A percentage is between 0 and 100\. Check: Undamaged/);
  type(window, 'undamaged', '99.4');
  type(window, 'complete', '99.1');
  assert.match(out(), /95[.,]06/, '96.5 % × 99.4 % × 99.1 %');
});

test('a chart with about one defect expected per day says that one day says little', { skip: !hasSite }, () => {
  const rows = ['2026-10-01', '2026-10-02', '2026-10-03', '2026-10-04', '2026-10-05', '2026-10-06'].map((date, i) => ({ date, n: 3, d: i % 2, note: '' }));
  const window = open({ 'sc-sigma-chart': { metric: 'Late routes', unit: 'Routes', baseline: '', grain: 'day', rows, example: {} } });
  assert.match(window.document.querySelector('[data-results]').textContent, /expected per day: with so few, the limits are wide/);
  const many = rows.map((row) => ({ ...row, n: 3000, d: 30 + (row.d ? 5 : 0) }));
  const busy = open({ 'sc-sigma-chart': { metric: 'Late routes', unit: 'Routes', baseline: '', grain: 'day', rows: many, example: {} } });
  assert.doesNotMatch(busy.document.querySelector('[data-results]').textContent, /with so few/);
});

// Audit P2A-09 and P2A-12 (T-12): one point beyond a limit is a signal to investigate, not a lasting improvement; a
// lasting change is the run rule's. A sample without defects shows the level it can prove, not "6+".
const chartOf = (rows, extra = {}) => open({ 'sc-sigma-chart': { metric: 'Damaged', unit: 'Units', baseline: '', grain: 'day', rows, example: {}, splits: [], ...extra } });
const day = (k) => new Date(Date.UTC(2026, 8, 1 + k)).toISOString().slice(0, 10);
const resultOf = (window) => {
  const box = window.document.querySelector('[data-results]');
  return { title: box.querySelector('.result-head h2').textContent, text: box.textContent.replace(/\s+/g, ' '), verdict: box.querySelector('.sc-verdict').textContent };
};

test('one day below the lower limit is a signal to investigate, not "a lasting improvement"', { skip: !hasSite }, () => {
  // The audit's case: 14 stable days, then one day with 0 of 5,000 (below its lower limit).
  const rows = [...Array(14)].map((_, i) => ({ date: day(i), n: 800 + 100 * (i % 5), d: [4, 6, 5, 3, 7, 5, 4, 6, 5, 4, 6, 5, 5, 4][i], note: '' }));
  const low = rows.map((row, i) => (i === 10 ? { ...row, d: 0, n: 5000 } : row));
  const r = resultOf(chartOf(low));
  assert.match(r.text, /Outside the limits \(better\)/, 'the point is a signal');
  assert.doesNotMatch(r.title, /A real improvement/);
  assert.doesNotMatch(r.text, /The chart shows a lasting improvement/);
  assert.equal(r.title, 'Better than usual: a signal to investigate');
  assert.match(r.verdict, /not yet a lasting change/);
});

test('eight days in a row on the better side is the lasting improvement', { skip: !hasSite }, () => {
  // Limits from the first 8 days at about 1 %, then 8 days at about 0.5 %: inside the limits, all below the centre.
  const d = [9, 11, 10, 12, 8, 11, 9, 10, 5, 6, 4, 5, 6, 5, 4, 5];
  const rows = d.map((count, i) => ({ date: day(i), n: 1000, d: count, note: '' }));
  const r = resultOf(chartOf(rows, { baseline: '8' }));
  assert.match(r.text, /Shift \(better\)/);
  assert.doesNotMatch(r.text, /Outside the limits/);
  assert.equal(r.title, 'A real improvement');
  assert.match(r.verdict, /The chart shows a lasting improvement/);
});

test('no defect in 250 units shows the level the data can prove (≥ 3.76), not 6+; a small sample shows its range', { skip: !hasSite }, () => {
  const zero = [...Array(5)].map((_, i) => ({ date: day(i), n: 50, d: 0, note: '' }));
  const r = resultOf(chartOf(zero));
  assert.doesNotMatch(r.text, /Sigma level\s*6\+/);
  // Rule of three: 3 / 250 = 1.2 % at most (95 %): sigma ≥ 2.257 + 1.5 = 3.76.
  assert.match(r.text, /Sigma level\s*≥ 3\.76/);
  assert.match(r.text, /no defect in 250 units: the data can show this level and no higher \(95% confidence, rule of three\)\. Collect more to show more\./);
  // The calculator, 1 defect in 5 units: 2.34, and the 95 % range (Wilson) 3.6 % to 62.4 %, sigma 1.18 to 3.30.
  const window = open();
  type(window, 'units', '5');
  type(window, 'defects', '1');
  const out = window.document.querySelector('[data-sigma-out]').textContent;
  assert.match(out, /2\.34/);
  assert.match(out, /a rough figure: with 5 chances the level could be anywhere from 1\.18 to 3\.30 \(95% range\)/);
  // Plenty of chances: no range.
  type(window, 'units', '1000000');
  type(window, 'defects', '233');
  assert.doesNotMatch(window.document.querySelector('[data-sigma-out]').textContent, /rough figure/);
});
