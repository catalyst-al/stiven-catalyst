// KPI Diagnostic (src/js/kpi-diagnostic.js) on its built page: which causes the answers name. Answers that do not
// separate the causes name none; a cause one point behind the leader is named with it.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const { JSDOM } = require('jsdom');

const hasSite = fs.existsSync('_site/tools/kpi-diagnostic/index.html');
const CAUSES = ['clarity', 'skill', 'capacity', 'design', 'ownership'];

// answers: the value of each statement (0–3), by cause, two statements per cause in the page's order.
const result = (answers) => {
  const html = fs.readFileSync('_site/tools/kpi-diagnostic/index.html', 'utf8').replace(/<script\b[^>]*\bsrc=[^>]*><\/script>/g, '');
  const { window } = new JSDOM(html, { url: 'https://example.test/tools/kpi-diagnostic/', runScripts: 'outside-only', pretendToBeVisual: true });
  window.HTMLElement.prototype.scrollIntoView = () => {};
  for (const file of ['tool-kit', 'kpi-diagnostic']) window.eval(fs.readFileSync(`src/js/${file}.js`, 'utf8'));
  const form = window.document.querySelector('[data-diagnostic]');
  const names = [...new Set([...form.querySelectorAll('input[type=radio]')].map((input) => input.name))];
  const seen = {};
  names.forEach((name) => {
    const cause = form.querySelector(`input[name="${name}"]`).dataset.cause;
    const value = answers[cause][seen[cause] = (seen[cause] ?? -1) + 1];
    form.querySelector(`input[name="${name}"][value="${value}"]`).checked = true;
  });
  form.dispatchEvent(new window.Event('submit', { bubbles: true, cancelable: true }));
  return window.document.querySelector('.result-head h2').textContent;
};
const same = (value) => Object.fromEntries(CAUSES.map((cause) => [cause, [value, value]]));

test('the page asks two statements for each of the five causes', { skip: !hasSite }, () => {
  const html = fs.readFileSync('_site/tools/kpi-diagnostic/index.html', 'utf8');
  for (const cause of CAUSES) assert.equal((html.match(new RegExp(`value="0" data-cause="${cause}"`, 'g')) || []).length, 2, cause);
});

test('answers that are all alike name no cause, rather than all five', { skip: !hasSite }, () => {
  assert.match(result(same(3)), /No single cause stands out/);
  assert.match(result(same(2)), /No single cause stands out/);
  assert.match(result({ ...same(2), skill: [2, 3] }), /No single cause stands out/, 'one notch on one statement is not a pattern');
});

test('a clear cause is named, with a cause one point behind it, and ties stay together', { skip: !hasSite }, () => {
  assert.equal(result({ ...same(0), capacity: [3, 3] }), 'Most likely: Capacity');
  assert.equal(result({ ...same(0), capacity: [3, 3], design: [3, 2] }), 'Most likely: Capacity + Process design');
  assert.equal(result({ ...same(0), capacity: [3, 3], design: [3, 3], skill: [1, 1] }), 'Most likely: Capacity + Process design');
});
