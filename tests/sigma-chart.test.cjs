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
