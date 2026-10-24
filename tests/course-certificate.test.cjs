// The certificate of the Six Sigma course (src/js/dmaic.js): hidden until every question is right, then shown with the
// day it was first completed and the name typed for it.
process.env.TZ = 'Europe/Berlin';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const { JSDOM } = require('jsdom');

const hasSite = fs.existsSync('_site/sq/tools/six-sigma-dmaic/index.html');
const open = (answers, extra = {}) => {
  const html = fs.readFileSync('_site/sq/tools/six-sigma-dmaic/index.html', 'utf8').replace(/<script\b[^>]*\bsrc=[^>]*><\/script>/g, '');
  const { window } = new JSDOM(html, { url: 'https://example.test/sq/tools/six-sigma-dmaic/', runScripts: 'outside-only', pretendToBeVisual: true });
  window.eval(`(() => { const Real = Date; const fixed = new Real("2026-10-24T10:00:00Z"); Date = class extends Real { constructor(...a) { super(...(a.length ? a : [fixed])); } static now() { return fixed.getTime(); } }; })();`);
  window.localStorage.setItem('sc-dmaic-sq', JSON.stringify({ answers, checks: {}, charter: {}, ...extra }));
  window.print = () => {};
  for (const file of ['tool-kit', 'dmaic']) window.eval(fs.readFileSync(`src/js/${file}.js`, 'utf8'));
  return window;
};

test('the certificate waits for every right answer, then keeps the first day and the name', { skip: !hasSite }, () => {
  const data = JSON.parse(fs.readFileSync('src/_data/sq/dmaic.json', 'utf8'));
  const all = Object.fromEntries(data.modules.flatMap((m) => m.quiz.map((q, i) => [`${m.id}-${i}`, q.answer])));
  const partial = { ...all, [`${data.modules[0].id}-0`]: (data.modules[0].quiz[0].answer + 1) % data.modules[0].quiz[0].options.length };
  const notYet = open(partial);
  assert.ok(notYet.document.querySelector('[data-certificate]').hidden, 'one wrong answer: no certificate');
  const done = open(all);
  const section = done.document.querySelector('[data-certificate]');
  assert.ok(!section.hidden);
  assert.equal(JSON.parse(done.localStorage.getItem('sc-dmaic-sq')).completed, '2026-10-24');
  assert.equal(section.querySelector('[data-cert-sheet-date]').textContent, '24.10.2026');
  const name = section.querySelector('[data-cert-name]');
  name.value = 'Stiven Janaqi';
  name.dispatchEvent(new done.Event('input', { bubbles: true }));
  assert.equal(section.querySelector('[data-cert-sheet-name]').textContent, 'Stiven Janaqi');
  // A later visit keeps the day it was first completed.
  const later = open(all, { completed: '2026-09-01', certName: 'Stiven Janaqi' });
  assert.equal(JSON.parse(later.localStorage.getItem('sc-dmaic-sq')).completed, '2026-09-01');
  assert.equal(later.document.querySelector('[data-cert-name]').value, 'Stiven Janaqi');
  // The link to the portfolio stays in Albanian.
  assert.match(later.document.querySelector('.dm-certificate a').getAttribute('href'), /^\/sq\/tools\/project-portfolio\/$/);
});
