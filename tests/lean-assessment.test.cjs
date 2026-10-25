// The Lean Assessment (src/js/lean-assessment.js): the arithmetic in window.LeanAssessmentMath (statement mean and
// spread with N/A left out, dimension mean, overall score, level name, change against the previous assessment of the
// same area, the weakest three with a stable tie-break), the example worked by hand, the three data files, and the
// page in jsdom: the example on a first visit, the result, the hand-off to the Action Tracker and the exports.
process.env.TZ = 'Europe/Berlin';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const nunjucks = require('nunjucks');
const { JSDOM } = require('jsdom');

const plain = (value) => JSON.parse(JSON.stringify(value));
const close = (a, b, message) => assert.ok(Math.abs(a - b) < 1e-9, `${message}: ${a} vs ${b}`);
const read = (file) => JSON.parse(fs.readFileSync(file, 'utf8'));
const DATA = { en: 'src/_data/leanAssessment.json', de: 'src/_data/de/leanAssessment.json', sq: 'src/_data/sq/leanAssessment.json' };
const TODAY = '2026-10-24';

const env = new nunjucks.Environment(new nunjucks.FileSystemLoader('src/_includes'), { autoescape: true });
env.addFilter('t', (text) => text);
env.addFilter('local', (url, lang) => (lang && lang !== 'en' ? `/${lang}${url}` : url));
env.addFilter('assetUrl', (url) => url);
env.addFilter('scriptJson', (value) => new nunjucks.runtime.SafeString(JSON.stringify(value).replace(/</g, '\\u003c')));
const partial = (lang) => env.render('partials/lean-assessment.njk', { cfg: read(DATA[lang]), lang: lang === 'en' ? undefined : lang })
  .replace(/<script src=[^>]*><\/script>/g, '');

const load = ({ lang = 'en', page = true, now = `${TODAY}T09:30:00Z`, storage = {} } = {}) => {
  const base = lang === 'en' ? '' : `/${lang}`;
  const html = `<html lang="${lang}"><body><main id="main">${page ? partial(lang) : ''}</main></body></html>`;
  const dom = new JSDOM(html, { url: `https://example.test${base}/tools/lean-assessment/`, runScripts: 'outside-only', pretendToBeVisual: true });
  const w = dom.window;
  w.eval(`(() => { const Real = Date; const fixed = new Real(${JSON.stringify(now)}); Date = class extends Real { constructor(...args) { super(...(args.length ? args : [fixed])); } static now() { return fixed.getTime(); } }; })();`);
  w.confirm = () => true;
  w.print = () => {};
  w.HTMLElement.prototype.scrollIntoView = () => {};
  w.URL.createObjectURL = () => 'blob:test';
  w.URL.revokeObjectURL = () => {};
  Object.entries(storage).forEach(([key, value]) => w.localStorage.setItem(key, JSON.stringify(value)));
  for (const file of ['tool-kit', 'chart-kit', 'workplace', 'actions-store', 'lean-assessment']) w.eval(fs.readFileSync(`src/js/${file}.js`, 'utf8'));
  return w;
};
const math = () => load({ page: false }).LeanAssessmentMath;
const click = (w, node) => node.dispatchEvent(new w.MouseEvent('click', { bubbles: true, cancelable: true }));
const shape = (value) => (Array.isArray(value) ? value.map(shape) : value && typeof value === 'object'
  ? Object.fromEntries(Object.keys(value).sort().map((key) => [key, shape(value[key])])) : typeof value);

test('the three data files share one shape, the same keys, tools and example, and their own storage key', () => {
  const en = read(DATA.en);
  assert.equal(en.storageKey, 'sc-lean-assessment');
  for (const lang of ['de', 'sq']) {
    const other = read(DATA[lang]);
    assert.equal(other.storageKey, `sc-lean-assessment-${lang}`);
    assert.deepEqual(shape(other), shape(en), `${lang}: same shape`);
    assert.deepEqual(other.dimensions.map((d) => d.key), en.dimensions.map((d) => d.key), `${lang}: dimension keys`);
    assert.deepEqual(other.dimensions.map((d) => d.statements.length), en.dimensions.map((d) => d.statements.length), `${lang}: statements per dimension`);
    assert.deepEqual(other.dimensions.map((d) => d.tools.map((t) => t.slug)), en.dimensions.map((d) => d.tools.map((t) => t.slug)), `${lang}: tool links`);
    assert.deepEqual(plain(other.example.scores), plain(en.example.scores), `${lang}: example scores`);
    assert.deepEqual(plain(other.example.previous.scores), plain(en.example.previous.scores), `${lang}: previous scores`);
    assert.deepEqual(other.example.assessors, en.example.assessors);
    other.dimensions.forEach((d) => assert.ok(d.action.includes('{area}'), `${lang} ${d.key}: action names the area`));
  }
  for (const lang of ['en', 'de', 'sq']) {
    const cfg = read(DATA[lang]);
    assert.equal(cfg.levels.length, 5);
    assert.equal(cfg.dimensions.length, 10);
    cfg.dimensions.forEach((d) => {
      assert.equal(d.levels.length, 5, `${lang} ${d.key}: five level descriptors`);
      assert.ok(d.statements.length >= 3 && d.statements.length <= 5, `${lang} ${d.key}: 3–5 statements`);
      assert.equal(cfg.example.scores[d.key].length, d.statements.length, `${lang} ${d.key}: example has every statement`);
      assert.equal(cfg.example.previous.scores[d.key].length, d.statements.length, `${lang} ${d.key}: previous has every statement`);
    });
  }
});

test('a statement: mean and spread of the numeric scores, N/A and blanks left out', () => {
  const M = math();
  let s = M.statementStats([1, 3]);
  assert.equal(s.mean, 2);
  assert.equal(s.spread, 2);
  assert.equal(s.disagree, true);
  s = M.statementStats([4, 3, 5]);
  close(s.mean, 4, 'three assessors');
  assert.equal(s.spread, 2);
  s = M.statementStats([3, 4]);
  assert.equal(s.mean, 3.5);
  assert.equal(s.spread, 1);
  assert.equal(s.disagree, false);
  // One N/A: the other score stands alone, with nothing to disagree with.
  s = M.statementStats(['na', 2]);
  assert.equal(s.mean, 2);
  assert.equal(s.n, 1);
  assert.equal(s.spread, 0);
  assert.equal(s.applicable, true);
  // All N/A: out of the averages.
  s = M.statementStats(['na', 'na']);
  assert.equal(s.mean, null);
  assert.equal(s.applicable, false);
  assert.equal(s.notApplicable, true);
  s = M.statementStats([null, null]);
  assert.equal(s.applicable, false);
  assert.equal(s.notApplicable, false);
  assert.equal(s.blank, 2);
  // Values outside 1–5 are not scores.
  assert.deepEqual(plain(M.statementStats([0, 6, 2.5, '4']).scores), [4]);
});

test('dimension mean, overall score and level name', () => {
  const M = math();
  const dims = [{ key: 'a', name: 'A', statements: ['1', '2', '3'] }, { key: 'b', name: 'B', statements: ['1', '2'] }, { key: 'c', name: 'C', statements: ['1'] }];
  // a: (2 + 4 + N/A) → (2 + 4) / 2 = 3; b: (1.5 + 2) / 2 = 1.75; c: all N/A → no mean. Overall (3 + 1.75) / 2 = 2.375.
  const r = M.assess({ scores: { 'a.0': [2, 2], 'a.1': [4, 4], 'a.2': ['na', 'na'], 'b.0': [1, 2], 'b.1': [2, 2], 'c.0': ['na'] } }, dims);
  assert.equal(r.dims[0].mean, 3);
  assert.equal(r.dims[0].scored, 2);
  assert.equal(r.dims[0].na, 1);
  assert.equal(r.dims[1].mean, 1.75);
  assert.equal(r.dims[2].mean, null);
  close(r.overall, 2.375, 'overall');
  assert.equal(M.round1(r.overall), 2.4);
  assert.equal(r.level, 2);
  // Levels follow the score as shown with one decimal.
  assert.deepEqual([1, 1.44, 1.45, 2.44, 2.45, 2.5, 3.44, 3.49, 4.44, 4.45, 5].map(M.levelOf), [1, 1, 2, 2, 3, 3, 3, 4, 4, 5, 5]);
  assert.equal(M.levelOf(null), 0);
  assert.deepEqual([2.25, 1.15, -0.25, 0.04].map(M.round1), [2.3, 1.2, -0.3, 0]);
});

test('weakest three: lowest first, equal means in the order of the data file', () => {
  const M = math();
  const rows = [{ key: 'a', order: 0, mean: 2.5 }, { key: 'b', order: 1, mean: 2 }, { key: 'c', order: 2, mean: 3 }, { key: 'd', order: 3, mean: 2 }, { key: 'e', order: 4, mean: null }, { key: 'f', order: 5, mean: 1 }];
  assert.deepEqual(M.weakest(rows).map((r) => r.key), ['f', 'b', 'd']);
  assert.deepEqual(M.weakest(rows.slice().reverse()).map((r) => r.key), ['f', 'b', 'd'], 'the input order does not matter');
  // 0.1 + 0.2 and 0.3 count as equal.
  assert.deepEqual(M.weakest([{ key: 'x', order: 1, mean: 0.1 + 0.2 }, { key: 'y', order: 0, mean: 0.3 }], 2).map((r) => r.key), ['y', 'x']);
});

test('the previous assessment is the latest earlier one of the same area', () => {
  const M = math();
  const list = [
    { id: '1', area: 'Picking', date: '2026-04-20' },
    { id: '2', area: ' picking ', date: '2026-07-20' },
    { id: '3', area: 'Packing', date: '2026-08-01' },
    { id: '4', area: 'Picking', date: '2026-10-20' },
    { id: '5', area: 'Picking', date: '2026-11-01' },
  ];
  assert.equal(M.previousOf(list, list[3]).id, '2');
  assert.equal(M.previousOf(list, list[0]), null);
  assert.equal(M.previousOf(list, list[2]), null);
  const dims = [{ key: 'a', statements: ['x'] }, { key: 'b', statements: ['y'] }];
  const now = M.assess({ scores: { 'a.0': [3], 'b.0': [2] } }, dims);
  const before = M.assess({ scores: { 'a.0': [2], 'b.0': ['na'] } }, dims);
  const c = M.compare(now, before);
  assert.equal(c.dims[0].change, 1);
  assert.equal(c.dims[1].change, null, 'no previous mean, no change');
  close(c.overall, 2.5 - 2, 'overall change');
  assert.equal(M.compare(now, null).overall, null);
});

test('the example, worked by hand: 2.4 now (Started), 2.1 a quarter ago, two disagreements', () => {
  const M = math();
  const cfg = read(DATA.en);
  const { current, previous } = M.exampleAssessments(cfg, TODAY);
  assert.equal(current.date, '2026-10-21');
  assert.equal(previous.date, '2026-07-22');
  assert.equal(current.area, previous.area);
  const r = M.assess(current, cfg.dimensions);
  // Statement means per dimension, then the dimension mean:
  //   5S (3, 3.5, 2.5, 3, 2) = 14 / 5 = 2.8           standard work (2.5, 2, 2, 2) = 8.5 / 4 = 2.125
  //   daily (4, 3.5, 3, 2.5) = 13 / 4 = 3.25          problem solving (2, 1.5, 2, 1) = 6.5 / 4 = 1.625
  //   flow (2, 2.5, N/A, 2) = 6.5 / 3 = 2.1667        quality (3, 2.5, 2, 3) = 10.5 / 4 = 2.625
  //   maintenance (3, 3, 2, 2: N/A and 2) = 2.5       leadership (2, 2.5, 2, 2) = 8.5 / 4 = 2.125
  //   people (3, 2, 2.5, 3.5) = 11 / 4 = 2.75         kaizen (2.5, 2, 1, 2) = 7.5 / 4 = 1.875
  const expected = [2.8, 2.125, 3.25, 1.625, 6.5 / 3, 2.625, 2.5, 2.125, 2.75, 1.875];
  r.dims.forEach((d, i) => close(d.mean, expected[i], d.key));
  // Overall = 23.841667 / 10 = 2.384 → 2.4, level 2 (Started).
  close(r.overall, expected.reduce((a, b) => a + b, 0) / 10, 'overall');
  close(r.overall, 2.3841666666666668, 'overall by hand');
  assert.equal(M.round1(r.overall), 2.4);
  assert.equal(cfg.levels[r.level - 1].name, 'Started');
  assert.equal(r.total, 41);
  assert.equal(r.na, 1, 'the flow statement both marked N/A');
  assert.equal(r.scored, 40);
  // Spread ≥ 2: standard work 3 (1 and 3) and quality 4 (4 and 2).
  assert.deepEqual(r.disagreements.map((s) => s.id), ['standardWork.2', 'quality.3']);
  // Weakest: problem solving 1.625, kaizen 1.875, then standard work and leadership tie at 2.125: standard work comes first.
  assert.deepEqual(M.weakest(r.dims).map((d) => d.key), ['problemSolving', 'ci', 'standardWork']);

  const p = M.assess(previous, cfg.dimensions);
  // 2.4, 1.875, 2.375, 1.5, 1.8333, 2.5, 2.375, 2, 2.5, 1.625 → 20.98333 / 10 = 2.098 → 2.1
  const before = [2.4, 1.875, 2.375, 1.5, 5.5 / 3, 2.5, 2.375, 2, 2.5, 1.625];
  p.dims.forEach((d, i) => close(d.mean, before[i], `previous ${d.key}`));
  assert.equal(M.round1(p.overall), 2.1);
  const c = M.compare(r, p);
  close(c.overall, 2.3841666666666668 - 2.0983333333333336, 'overall change');
  assert.equal(M.round1(c.overall), 0.3);
  close(c.dims.find((d) => d.key === 'dailyMgmt').change, 0.875, 'daily management moved most');
  close(c.dims.find((d) => d.key === 'fiveS').change, 0.4, '5S');
});

test('assessors: cleaning keeps one to five, scores aligned to them; the action for the tracker', () => {
  const M = math();
  const a = M.cleanAssessment({ area: 'Picking', date: 'nope', assessors: ['A', 'B', 'C', 'D', 'E', 'F'], scores: { 'fiveS.0': [3, 'na', 9, null, '2', 4], 'bad key': [1] } });
  assert.equal(a.assessors.length, 5);
  assert.equal(a.date, TODAY);
  assert.deepEqual(plain(a.scores), { 'fiveS.0': [3, 'na', null, null, 2] });
  assert.deepEqual(plain(M.cleanAssessment({}).assessors), ['']);
  const cfg = read(DATA.en);
  const dim = cfg.dimensions.find((d) => d.key === 'problemSolving');
  const payload = M.actionPayload(dim, { mean: 1.625 }, { area: 'Goods-in and putaway', date: '2026-10-21' }, 0);
  assert.equal(payload.title, 'Take the most frequent recurring problem in Goods-in and putaway to its root cause');
  assert.equal(payload.detail, 'Problem solving: 1.6 / 5');
  assert.equal(payload.due, '2027-01-20', 'due at the next quarterly assessment');
  assert.equal(payload.source, 'lean-assessment');
  assert.equal(payload.priority, 'High');
  assert.equal(M.actionPayload(dim, { mean: 2 }, { area: '', date: '2026-10-21' }, 2).priority, 'Medium');
});

test('the page opens on the example, with the result, the radar and the next steps', () => {
  const w = load();
  const results = w.document.querySelector('[data-results]');
  assert.equal(results.hidden, false);
  const text = results.textContent;
  assert.match(text, /2\.4 \/ 5/);
  assert.match(text, /Started/);
  assert.match(text, /\+0\.3/);
  assert.ok(results.querySelector('svg.ck-chart'), 'radar drawn');
  assert.equal(results.querySelectorAll('svg.ck-chart polygon[stroke-dasharray]').length, 1, 'previous quarter on the radar');
  const cards = [...results.querySelectorAll('.la-weak-card')];
  assert.deepEqual(cards.map((c) => c.querySelector('h4').textContent.trim()), ['1 Problem solving', '2 Continuous improvement (kaizen)', '3 Standard work']);
  const links = [...cards[0].querySelectorAll('.la-tools a')].map((a) => new w.URL(a.href).pathname);
  assert.deepEqual(links, ['/tools/five-whys/', '/tools/a3-report/', '/tools/eight-d/']);
  const action = cards[0].querySelector('.tool-actions a');
  click(w, action);
  const url = new w.URL(action.href);
  assert.equal(url.pathname, '/tools/action-tracker/');
  assert.equal(url.searchParams.get('source'), 'lean-assessment');
  assert.match(url.searchParams.get('action'), /Goods-in and putaway/);
  assert.equal(results.querySelectorAll('.la-disagree-list li').length, 2);
  assert.equal(w.document.querySelector('.dl-example-note').hidden, false);
  const saved = JSON.parse(w.localStorage.getItem('sc-lean-assessment'));
  assert.equal(saved.assessments.length, 2);
  assert.equal(saved.example.length, 2);
  // The statement shows both assessors, the mean, the spread and the flag.
  const item = w.document.querySelector('[data-statement="standardWork.2"]');
  assert.match(item.textContent, /Elira 1 · Jonas 3 · mean 2\.0 · spread 2/);
  assert.match(item.textContent, /Discuss: assessors disagree/);
  assert.equal(w.document.querySelectorAll('[data-history] tr').length, 2);
});

test('scoring, a second assessor, a new assessment and clearing the example', () => {
  const w = load();
  const doc = w.document;
  // Clear the example: an empty assessment, no result.
  click(w, doc.querySelector('.dl-example-note button'));
  assert.equal(doc.querySelector('[data-results]').hidden, true);
  assert.equal(JSON.parse(w.localStorage.getItem('sc-lean-assessment')).example.length, 0);
  const area = doc.querySelector('#la-area');
  area.value = 'Picking';
  area.dispatchEvent(new w.Event('input', { bubbles: true }));
  const pressScore = (id, value) => click(w, doc.querySelector(`[data-statement="${id}"] [data-score="${value}"]`));
  pressScore('fiveS.0', 4);
  assert.equal(doc.querySelector('[data-results]').hidden, false);
  assert.match(doc.querySelector('[data-results]').textContent, /4\.0 \/ 5/);
  // A second tap takes the score back.
  pressScore('fiveS.0', 4);
  assert.equal(doc.querySelector('[data-results]').hidden, true);
  pressScore('fiveS.0', 4);
  click(w, doc.querySelector('[data-add-assessor]'));
  assert.equal(doc.querySelectorAll('[data-assessors] input').length, 2);
  assert.equal(doc.querySelector('[data-rater] [aria-pressed="true"]').textContent, 'Assessor 2');
  pressScore('fiveS.0', 2);
  const stored = JSON.parse(w.localStorage.getItem('sc-lean-assessment'));
  assert.deepEqual(stored.assessments[0].scores['fiveS.0'], [4, 2]);
  assert.match(doc.querySelector('[data-statement="fiveS.0"]').textContent, /mean 3\.0 · spread 2/);
  // An N/A and nothing else so far: the statement is out of the result.
  pressScore('fiveS.1', 'na');
  assert.match(doc.querySelector('[data-results]').textContent, /N\/A: 1/);
  // A score from the other assessor brings it back: (3 + 3) / 2 = 3.0 for 5S.
  click(w, doc.querySelectorAll('[data-rater] button')[0]);
  pressScore('fiveS.1', 3);
  assert.match(doc.querySelector('[data-results]').textContent, /none marked N\/A/);
  assert.match(doc.querySelector('[data-dim-score="fiveS"]').textContent, /Mean 3\.0 of 5 · 2 of 5 statements/);
  // A new assessment of the same area keeps the area and assessors; the history holds both.
  click(w, doc.querySelector('[data-new]'));
  assert.equal(area.value, 'Picking');
  assert.equal(doc.querySelectorAll('[data-history] tr').length, 2);
});

test('the exports: CSV rows per statement with the means and the change', () => {
  const w = load();
  let saved = null;
  const blobs = [];
  const RealBlob = w.Blob;
  w.Blob = class extends RealBlob { constructor(parts, options) { super(parts, options); blobs.push(parts.join('')); } };
  w.document.body.addEventListener('click', (event) => { if (event.target.download) saved = event.target.download; }, true);
  const csv = [...w.document.querySelectorAll('[data-results] button')].find((b) => b.textContent === 'Download CSV');
  assert.ok(csv);
  click(w, csv);
  assert.match(saved, /^lean-assessment-goods-in-and-putaway-2026-10-24\.csv$/);
  const lines = blobs.at(-1).replace(/^\uFEFF/, '').trim().split('\r\n');
  assert.equal(lines.length, 42, 'a header and 41 statements');
  assert.equal(lines[0], 'Date,Area,Dimension,Statement,Elira,Jonas,Mean,Spread,Discuss,Dimension mean,Previous assessment,Change');
  const row = lines.find((line) => line.includes('People work to the standard'));
  assert.match(row, /,1,3,2,2,yes,2\.1,1\.9,0\.3$/);
  assert.ok([...w.document.querySelectorAll('[data-results] button')].some((b) => b.textContent === 'Download Excel'));
  assert.ok([...w.document.querySelectorAll('[data-results] button')].some((b) => b.textContent === 'Print or save as PDF'));
});

test('German and Albanian pages open on their own example with their own key', () => {
  for (const lang of ['de', 'sq']) {
    const w = load({ lang });
    assert.ok(w.localStorage.getItem(`sc-lean-assessment-${lang}`), `${lang}: saved under its own key`);
    assert.equal(w.localStorage.getItem('sc-lean-assessment'), null);
    const results = w.document.querySelector('[data-results]');
    assert.match(results.textContent, /2,4 \/ 5/, `${lang}: decimal comma`);
    const link = results.querySelector('.la-weak-card .la-tools a');
    assert.equal(new w.URL(link.href).pathname, `/${lang}/tools/five-whys/`);
  }
});
