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

// A clear cause is named as a hypothesis, not as "most likely" (audit P2A-08): the answers are a self-assessment.
test('a clear cause is named, with a cause one point behind it, and ties stay together', { skip: !hasSite }, () => {
  assert.equal(result({ ...same(0), capacity: [3, 3] }), 'Leading hypothesis: Capacity');
  assert.equal(result({ ...same(0), capacity: [3, 3], design: [3, 2] }), 'Leading hypotheses: Capacity + Process design');
  assert.equal(result({ ...same(0), capacity: [3, 3], design: [3, 3], skill: [1, 1] }), 'Leading hypotheses: Capacity + Process design');
});

// The result is a self-assessment: ten statements, two per cause, rated by one person. It may name a leading
// hypothesis to check, never a "most likely" cause, and only with a clear margin over the next cause.
const UI = { de: JSON.parse(fs.readFileSync('src/_data/de/ui.json', 'utf8')), sq: JSON.parse(fs.readFileSync('src/_data/sq/ui.json', 'utf8')) };
const page = (lang, answers) => {
  const base = lang === 'en' ? '' : `/${lang}`;
  const html = fs.readFileSync(`_site${base}/tools/kpi-diagnostic/index.html`, 'utf8').replace(/<script\b[^>]*\bsrc=[^>]*><\/script>/g, '');
  const { window } = new JSDOM(html, { url: `https://example.test${base}/tools/kpi-diagnostic/`, runScripts: 'outside-only', pretendToBeVisual: true });
  window.HTMLElement.prototype.scrollIntoView = () => {};
  if (lang !== 'en') window.eval(fs.readFileSync(`_site/js/ui-${lang}.js`, 'utf8'));
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
  const box = window.document.querySelector('[data-result]');
  const links = [...box.querySelectorAll('a')].map((a) => decodeURIComponent(a.href.replace(/\+/g, ' ')));
  return { title: box.querySelector('.result-head h2').textContent, text: box.textContent.replace(/\s+/g, ' '), links };
};
const tr = (lang, text) => (lang === 'en' ? text : UI[lang][text]);
const CAVEAT = 'These are your own ratings, two statements per cause. They show where to look first, not the cause itself. Before you act, check it: watch the work for a shift, ask two or three people who do it to rate the same statements, and look at the data behind the KPI.';
const LEAN = 'Your answers lean towards {cause} ({score}/{max}), but not by enough to name it: one notch on one statement would change the picture.';

test('3 of 6 against 1 of 6 on two self-rated statements names no cause, in all three languages (audit P2A-08)', { skip: !hasSite }, () => {
  // Clarity "Mostly" + "Partly" (3/6), every other cause "Partly" + "Not true" (1/6): the audit's case.
  const answers = { clarity: [2, 1], skill: [1, 0], capacity: [1, 0], design: [1, 0], ownership: [1, 0] };
  const clarity = { en: 'Clarity', de: 'Klarheit', sq: 'Qartësia' };
  for (const lang of ['en', 'de', 'sq']) {
    const r = page(lang, answers);
    assert.ok(!r.title.includes(tr(lang, 'Most likely')), `${lang}: ${r.title}`);
    assert.equal(r.title.replace(/\s+/g, ' ').trim(), `${tr(lang, 'No single cause')} ${tr(lang, 'stands out.')}`, lang);
    // The lean is said, with its score, as too weak to name.
    assert.ok(tr(lang, LEAN), `${lang}: the lean is translated`);
    assert.ok(r.text.includes(tr(lang, LEAN).replace('{cause}', clarity[lang]).replace('{score}', 3).replace('{max}', 6)), `${lang}: lean`);
    assert.ok(tr(lang, CAVEAT) && r.text.includes(tr(lang, CAVEAT)), `${lang}: the self-assessment caveat`);
    const tracker = r.links.find((l) => /action-tracker/.test(l));
    assert.ok(tracker && !/priority=High/.test(tracker), `${lang}: no High-priority action from a self-assessment`);
  }
});

test('a clear margin names a leading hypothesis to check, with its margin; near-ties are named as such', { skip: !hasSite }, () => {
  const clear = page('en', { ...same(0), capacity: [3, 2], skill: [1, 1] });
  assert.equal(clear.title, 'Leading hypothesis: Capacity');
  assert.match(clear.text, /Capacity scores 5\/6, 3 points ahead of the next cause \(Skill, 2\/6\)\./);
  assert.ok(clear.text.includes(CAVEAT));
  const whys = clear.links.find((l) => /five-whys/.test(l));
  assert.match(whys, /problem=KPI is red; the self-assessment points to Capacity, a hypothesis to check\./);
  const tracker = clear.links.find((l) => /action-tracker/.test(l));
  assert.match(tracker, /priority=Medium/);
  assert.match(tracker, /Check on the floor: Capacity behind KPI/);
  // One point apart: both named, and the page says the answers do not separate them.
  const close = page('en', { ...same(0), capacity: [3, 3], design: [3, 2] });
  assert.equal(close.title, 'Leading hypotheses: Capacity + Process design');
  assert.match(close.text, /Capacity \(6\/6\) and Process design \(5\/6\) are within one point of each other: your answers do not separate them\./);
  // Two points over the next cause, from more than half the maximum: named. Less: not.
  assert.equal(page('en', { ...same(0), capacity: [3, 1], design: [1, 1] }).title, 'Leading hypothesis: Capacity');
  assert.match(page('en', { ...same(0), capacity: [2, 1], design: [1, 0] }).title, /No single cause stands out/);
  assert.match(page('en', { ...same(0), capacity: [3, 2], design: [2, 2] }).title, /Leading hypotheses: Capacity \+ Process design/);
});
