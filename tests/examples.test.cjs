// The examples a tool opens on (a first visit to the control chart, Pareto and the CX Control Tower): they are shown,
// never written to the browser until the visitor acts, and days handed over from a log never mix with them.
// The pages are the built ones (_site), with the scripts from src/js.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const { JSDOM } = require('jsdom');

const hasSite = fs.existsSync('_site/tools/sigma-control-chart/index.html');
const page = (path, files, setup) => {
  const html = fs.readFileSync(`_site${path}index.html`, 'utf8').replace(/<script\b[^>]*\bsrc=[^>]*><\/script>/g, '');
  const dom = new JSDOM(html, { url: `https://example.test${path}`, runScripts: 'outside-only', pretendToBeVisual: true });
  const { window } = dom;
  window.confirm = () => true;
  window.scrollTo = () => {};
  window.HTMLElement.prototype.scrollIntoView = () => {};
  setup?.(window);
  for (const file of files) window.eval(fs.readFileSync(`src/js/${file}.js`, 'utf8'));
  return window;
};
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

test('a first visit shows the example of the chart, Pareto and the Control Tower and writes nothing', { skip: !hasSite }, async () => {
  const chart = page('/tools/sigma-control-chart/', ['tool-kit', 'sigma-chart']);
  assert.ok(chart.document.querySelector('[data-results] .sc-chart-wrap'), 'the example chart is drawn');
  const pareto = page('/tools/pareto/', ['tool-kit', 'cv-import', 'pareto']);
  const tower = page('/tools/cx-control-tower/', ['tool-kit', 'docx-kit', 'cv-import', 'pareto', 'cx-tower']);
  assert.ok(!tower.document.querySelector('[data-cx-example-flag]').hidden, 'the example flag is shown');
  // Pareto and the Control Tower write a moment after a change, and at once when the page is hidden.
  await wait(400);
  tower.dispatchEvent(new tower.Event('pagehide'));
  assert.equal(chart.localStorage.getItem('sc-sigma-chart'), null);
  assert.equal(pareto.localStorage.getItem('sc-pareto'), null);
  assert.equal(tower.localStorage.getItem('sc-cx-tower'), null);
});

test('days handed over from a log replace an example still on the chart, and Undo brings it back', { skip: !hasSite }, () => {
  // The example, saved because the visitor asked for it (or by an earlier version of the page).
  const first = page('/tools/sigma-control-chart/', ['tool-kit', 'sigma-chart']);
  first.document.querySelector('[data-example]').dispatchEvent(new first.Event('click', { bubbles: true }));
  const saved = first.localStorage.getItem('sc-sigma-chart');
  assert.equal(JSON.parse(saved).baseline, '20');
  // A week from Damage Control: the same metric and unit as the example.
  const days = ['2026-10-05', '2026-10-06', '2026-10-07', '2026-10-08', '2026-10-09', '2026-10-10', '2026-10-11'];
  const handoff = { source: 'Damage Control', metric: 'Damaged units', unit: 'Units handled', rows: days.map((date) => ({ date, n: 2000, d: 28 })), skipped: 0 };
  const chart = page('/tools/sigma-control-chart/', ['tool-kit', 'sigma-chart'], (window) => {
    window.localStorage.setItem('sc-sigma-chart', saved);
    window.sessionStorage.setItem('sc-sigma-handoff', JSON.stringify(handoff));
  });
  let state = JSON.parse(chart.localStorage.getItem('sc-sigma-chart'));
  assert.deepEqual(state.rows.map((row) => row.date), days, 'only the handed-over days');
  assert.equal(state.baseline, '', 'the example baseline goes with it');
  assert.ok(chart.document.querySelector('.dl-example-note').hidden, 'no example note');
  assert.match(chart.document.querySelector('[data-handoff-status]').textContent, /They replace what was in the chart/);
  // Undo puts the example back as it was.
  const undo = [...chart.document.querySelectorAll('[data-handoff-status] button')].find((button) => /undo/i.test(button.textContent));
  undo.dispatchEvent(new chart.Event('click', { bubbles: true }));
  state = JSON.parse(chart.localStorage.getItem('sc-sigma-chart'));
  assert.equal(state.rows.length, JSON.parse(saved).rows.length);
  assert.equal(state.baseline, '20');
  assert.ok(!chart.document.querySelector('.dl-example-note').hidden, 'the note is back with the example');
});

test('days handed over to a chart of real days with the same metric are still added to it', { skip: !hasSite }, () => {
  const own = { metric: 'Damaged units', unit: 'Units handled', baseline: '', grain: 'day', example: {}, rows: [{ date: '2026-10-01', n: 1800, d: 20, note: '' }] };
  const handoff = { source: 'Damage Control', metric: 'Damaged units', unit: 'Units handled', rows: [{ date: '2026-10-02', n: 2000, d: 25 }], skipped: 0 };
  const chart = page('/tools/sigma-control-chart/', ['tool-kit', 'sigma-chart'], (window) => {
    window.localStorage.setItem('sc-sigma-chart', JSON.stringify(own));
    window.sessionStorage.setItem('sc-sigma-handoff', JSON.stringify(handoff));
  });
  const state = JSON.parse(chart.localStorage.getItem('sc-sigma-chart'));
  assert.deepEqual(state.rows.map((row) => row.date), ['2026-10-01', '2026-10-02']);
});
