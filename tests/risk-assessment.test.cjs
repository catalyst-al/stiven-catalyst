// The Risk Assessment (src/js/risk-assessment.js): the arithmetic in window.RiskAssessmentMath (risk = likelihood ×
// severity on the 5 × 5 matrix and its bands with their boundaries, the residual risk, the STOP order warning, when a
// review is due, the cross-check against the Safety Cross log in its real shape), the three data files, the example of a
// parcel warehouse with its numbers worked by hand, and the page: the example on a first visit, a hazard added, the
// hand-offs to the Action Tracker in every language, the template file and the exports.
process.env.TZ = 'Europe/Berlin';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const nunjucks = require('nunjucks');
const { JSDOM } = require('jsdom');

const plain = (value) => JSON.parse(JSON.stringify(value));
const read = (file) => JSON.parse(fs.readFileSync(file, 'utf8'));
const DATA = { en: 'src/_data/riskAssessment.json', de: 'src/_data/de/riskAssessment.json', sq: 'src/_data/sq/riskAssessment.json' };
const SX = { en: 'src/_data/safetyCross.json', de: 'src/_data/de/safetyCross.json', sq: 'src/_data/sq/safetyCross.json' };
const TODAY = '2026-10-24';

const env = new nunjucks.Environment(new nunjucks.FileSystemLoader('src/_includes'), { autoescape: false });
env.addFilter('t', (text) => text);
env.addFilter('local', (url, lang) => (lang && lang !== 'en' ? `/${lang}${url}` : url));
env.addFilter('assetUrl', (url) => url);
env.addFilter('scriptJson', (value) => JSON.stringify(value).replace(/</g, '\\u003c'));
const partial = (lang) => env.render('partials/risk-assessment.njk', { cfg: read(DATA[lang]), lang: lang === 'en' ? undefined : lang, safetyCross: read(SX.en), de: { safetyCross: read(SX.de) }, sq: { safetyCross: read(SX.sq) } })
  .replace(/<script src=[^>]*><\/script>/g, '');

const load = ({ lang = 'en', page = true, now = `${TODAY}T09:30:00Z`, storage = {}, extra = [] } = {}) => {
  const base = lang === 'en' ? '' : `/${lang}`;
  const html = `<html lang="${lang}"><body><main id="main">${page ? partial(lang) : ''}</main></body></html>`;
  const dom = new JSDOM(html, { url: `https://example.test${base}/tools/risk-assessment/`, runScripts: 'outside-only', pretendToBeVisual: true });
  const w = dom.window;
  w.eval(`(() => { const Real = Date; const fixed = new Real(${JSON.stringify(now)}); Date = class extends Real { constructor(...args) { super(...(args.length ? args : [fixed])); } static now() { return fixed.getTime(); } }; })();`);
  w.confirm = () => true;
  w.print = () => {};
  w.HTMLElement.prototype.scrollIntoView = () => {};
  w.URL.createObjectURL = () => 'blob:test';
  w.URL.revokeObjectURL = () => {};
  Object.entries(storage).forEach(([key, value]) => w.localStorage.setItem(key, JSON.stringify(value)));
  // A followed link (a hand-off) stays on the page: the test reads its address.
  w.document.addEventListener('click', (event) => { if (event.target.closest?.('a')) event.preventDefault(); });
  for (const file of ['tool-kit', 'chart-kit', 'workplace', 'actions-store', 'template-pack', ...extra, 'risk-assessment']) w.eval(fs.readFileSync(`src/js/${file}.js`, 'utf8'));
  return w;
};
const math = () => load({ page: false }).RiskAssessmentMath;
const click = (w, node) => node.dispatchEvent(new w.MouseEvent('click', { bubbles: true }));
const type = (w, input, value) => { input.value = value; input.dispatchEvent(new w.Event('input', { bubbles: true })); input.dispatchEvent(new w.Event('change', { bubbles: true })); };
const saved = (w, key = 'sc-risk-assessment') => JSON.parse(w.localStorage.getItem(key));
const shape = (value) => (Array.isArray(value) ? value.map(shape) : value && typeof value === 'object'
  ? Object.fromEntries(Object.keys(value).sort().map((key) => [key, shape(value[key])])) : typeof value);
const numbers = (value) => (Array.isArray(value) ? value.map(numbers) : value && typeof value === 'object'
  ? Object.fromEntries(Object.keys(value).sort().map((key) => [key, numbers(value[key])])) : typeof value === 'string' ? 'text' : value);
const cfg = read(DATA.en);

test('the three data files share one shape, the same keys and numbers, and their own storage key', () => {
  const en = read(DATA.en);
  assert.equal(en.storageKey, 'sc-risk-assessment');
  const groups = ['mechanical', 'electrical', 'substances', 'biological', 'fire', 'thermal', 'physical', 'environment', 'load', 'psych', 'other'];
  assert.deepEqual(en.groups.map((g) => g.key), groups, 'the eleven BAuA hazard-factor groups, in their order');
  assert.deepEqual(en.groups.map((g) => g.no), groups.map((_, i) => i + 1));
  const withoutCauses = ({ causeGroups, ...rest }) => rest;
  for (const lang of ['de', 'sq']) {
    const other = read(DATA[lang]);
    assert.equal(other.storageKey, `sc-risk-assessment-${lang}`, `${lang} keeps its own work`);
    assert.deepEqual(shape(withoutCauses(other)), shape(withoutCauses(en)), `${lang} shape`);
    assert.deepEqual(other.groups.map((g) => [g.key, g.no, Object.keys(g.examples), Object.values(g.examples).map((list) => list.length)]),
      en.groups.map((g) => [g.key, g.no, Object.keys(g.examples), Object.values(g.examples).map((list) => list.length)]), `${lang} groups and examples`);
    for (const name of ['sectors', 'exposed', 'special']) assert.deepEqual(other[name].map((x) => x.key), en[name].map((x) => x.key), `${lang} ${name}`);
    assert.deepEqual(Object.keys(other.bands), Object.keys(en.bands));
    assert.deepEqual(Object.keys(other.stop), ['S', 'T', 'O', 'P']);
    assert.deepEqual(Object.keys(other.statuses), Object.keys(en.statuses));
    assert.deepEqual(Object.keys(other.checks), Object.keys(en.checks));
    assert.deepEqual(other.reviewMonths, en.reviewMonths);
    assert.deepEqual(Object.values(other.causeGroups), Object.values(en.causeGroups), `${lang}: the causes map to the same groups`);
    assert.deepEqual(numbers(other.example), numbers(en.example), `${lang}: the example has the same numbers`);
    assert.equal(other.tips.length, en.tips.length);
    assert.equal(other.signatures.length, en.signatures.length);
    for (const [key, value] of Object.entries(other.text)) assert.ok(value.trim(), `${lang} text.${key}`);
  }
  for (const lang of ['en', 'de', 'sq']) {
    const d = read(DATA[lang]);
    const sx = read(SX[lang]);
    assert.equal(d.likelihood.length, 5);
    assert.equal(d.severity.length, 5);
    for (const g of d.groups) for (const sector of d.sectors) assert.ok(g.examples[sector.key].length >= 2, `${lang} ${g.key} ${sector.key}`);
    // The Safety Cross causes of the same language, each mapped to hazard groups (or "*").
    assert.deepEqual(Object.keys(d.causeGroups).sort(), [...sx.causes].sort(), `${lang}: every Safety Cross cause is mapped`);
    for (const list of Object.values(d.causeGroups)) assert.ok(list.every((key) => key === '*' || groups.includes(key)));
    // The areas offer every area of the Safety Cross, so the names match for the cross-check.
    assert.ok(sx.areas.every((area) => d.areas.includes(area)), `${lang}: Safety Cross areas`);
    assert.ok(d.example.assessments.every((a) => d.areas.includes(a.area)), `${lang}: example areas`);
    assert.match(d.text.legal, /ArbSchG/);
    assert.match(d.text.legal, /10237\/2010/);
  }
  assert.match(en.text.legal, /not legal advice/);
  assert.match(read(DATA.de).text.legal, /keine Rechtsberatung/);
  assert.match(read(DATA.sq).text.legal, /nuk është këshillë ligjore/);
});

test('risk is likelihood × severity on the 5 × 5 matrix, with the bands and their boundaries', () => {
  const M = math();
  assert.equal(M.risk(3, 4), 12);
  assert.equal(M.risk('5', '5'), 25);
  assert.equal(M.risk(1, 1), 1);
  assert.equal(M.risk(0, 3), null, 'a missing rating is not a 1');
  assert.equal(M.risk(6, 2), null);
  assert.equal(M.risk(2.5, 2), null);
  assert.equal(M.risk('', 4), null);
  assert.deepEqual(plain(M.PRODUCTS), [1, 2, 3, 4, 5, 6, 8, 9, 10, 12, 15, 16, 20, 25]);
  // Standard bands: low 1–4, medium 5–9, high 10–16, very high 20–25.
  const cases = { 1: 'low', 4: 'low', 5: 'medium', 9: 'medium', 10: 'high', 16: 'high', 17: 'very-high', 20: 'very-high', 25: 'very-high' };
  for (const [score, key] of Object.entries(cases)) assert.equal(M.band(Number(score)), key, `score ${score}`);
  assert.equal(M.band(0), null);
  assert.equal(M.band(null), null);
  assert.deepEqual(plain(M.bandRanges()), [
    { key: 'low', min: 1, max: 4, from: 1, to: 4 },
    { key: 'medium', min: 5, max: 9, from: 5, to: 9 },
    { key: 'high', min: 10, max: 16, from: 10, to: 16 },
    { key: 'very-high', min: 17, max: 25, from: 20, to: 25 },
  ]);
  // Bands edited to 3 · 8 · 12.
  const own = { low: 3, medium: 8, high: 12 };
  assert.equal(M.band(3, own), 'low');
  assert.equal(M.band(4, own), 'medium');
  assert.equal(M.band(8, own), 'medium');
  assert.equal(M.band(9, own), 'high');
  assert.equal(M.band(12, own), 'high');
  assert.equal(M.band(15, own), 'very-high');
  assert.deepEqual(plain(M.bandRanges(own)).map((r) => [r.key, r.from, r.to]), [['low', 1, 3], ['medium', 4, 8], ['high', 9, 12], ['very-high', 15, 25]]);
  // A set that does not rise, or reaches 25, falls back to the standard; validBands says so.
  assert.deepEqual(plain(M.cleanBands({ low: 9, medium: 5, high: 16 })), { low: 4, medium: 9, high: 16 });
  assert.deepEqual(plain(M.cleanBands({ low: 4, medium: 9, high: 25 })), { low: 4, medium: 9, high: 16 });
  assert.deepEqual(plain(M.cleanBands({ low: '3', medium: '8', high: '12' })), own);
  assert.equal(M.validBands({ low: 3, medium: 8, high: 12 }), true);
  assert.equal(M.validBands({ low: 3, medium: 3, high: 12 }), false);
  assert.equal(M.validBands({ low: 0, medium: 3, high: 12 }), false);
  assert.equal(M.validBands({ low: 2.5, medium: 8, high: 12 }), false);
  assert.equal(M.isHigh('high') && M.isHigh('very-high') && !M.isHigh('medium'), true);
});

test('residual risk: rated again after the measures; a hazard not rated again counts at its first rating', () => {
  const M = math();
  const h = { l: 4, s: 5, l2: 1, s2: 5, measures: [] };
  assert.equal(M.residual(h), 5);
  assert.equal(M.current(h), 5);
  assert.equal(M.current({ l: 3, s: 4 }), 12, 'no residual rating: the risk before');
  const e = plain(M.enrich(h));
  assert.deepEqual([e.risk, e.band, e.residual, e.band2, e.now, e.bandNow, e.higher], [20, 'very-high', 5, 'medium', 5, 'medium', false]);
  assert.equal(M.enrich({ l: 2, s: 2, l2: 3, s2: 3 }).higher, true, 'a residual above the risk before is flagged');
  const list = [{ l: 4, s: 5, l2: 1, s2: 5 }, { l: 3, s: 4 }, { l: 2, s: 2, l2: 1, s2: 2 }, { l: null, s: 3 }];
  assert.deepEqual(plain(M.bandCounts(list, undefined, 'before')), { low: 1, medium: 0, high: 1, 'very-high': 1, unrated: 1 });
  assert.deepEqual(plain(M.bandCounts(list, undefined, 'after')), { low: 1, medium: 1, high: 1, 'very-high': 0, unrated: 1 });
  const before = M.matrix(list, 'before');
  const after = M.matrix(list, 'after');
  assert.deepEqual(Object.keys(before).sort(), ['2-2', '3-4', '4-5']);
  assert.deepEqual(Object.keys(after).sort(), ['1-2', '1-5', '3-4'], 'the matrix after puts the hazard not rated again at its first cell');
});

test('the STOP order: a high risk with only personal protective equipment is flagged, and so is a risk without a measure', () => {
  const M = math();
  const m = (type, text = 'x') => ({ type, text });
  assert.equal(M.stopCheck({ l: 3, s: 4, measures: [m('P')] }), 'only-p', 'high (12) with PPE only');
  assert.equal(M.stopCheck({ l: 4, s: 5, measures: [m('P'), m('P')] }), 'only-p', 'very high (20) with PPE only');
  assert.equal(M.stopCheck({ l: 3, s: 4, measures: [m('P'), m('O')] }), '', 'PPE plus an organisational measure');
  assert.equal(M.stopCheck({ l: 3, s: 4, measures: [m('P'), m('T', ' ')] }), 'only-p', 'an empty measure does not count');
  assert.equal(M.stopCheck({ l: 3, s: 3, measures: [m('P')] }), '', 'medium (9) with PPE only is not flagged');
  assert.equal(M.stopCheck({ l: 2, s: 5, measures: [m('P')] }), 'only-p', 'high starts at 10');
  assert.equal(M.stopCheck({ l: 3, s: 4, measures: [m('P')] }, { low: 4, medium: 12, high: 16 }), '', 'with bands moved, 12 is medium');
  assert.equal(M.stopCheck({ l: 3, s: 2, measures: [] }), 'no-measure', 'medium without a measure');
  assert.equal(M.stopCheck({ l: 2, s: 2, measures: [] }), '', 'low without a measure is fine');
  assert.equal(M.stopCheck({ l: null, s: 4, measures: [] }), '', 'not rated yet');
  assert.deepEqual(plain([m('P'), m('O'), m('S'), m('T')].sort(M.byStop).map((x) => x.type)), ['S', 'T', 'O', 'P']);
  // The effectiveness check of a measure.
  assert.equal(M.checkState({ status: 'open', checkDate: '', check: '' }, TODAY), '');
  assert.equal(M.checkState({ status: 'done', checkDate: '', check: '' }, TODAY), 'check-pending');
  assert.equal(M.checkState({ status: 'done', checkDate: '2026-11-01', check: '' }, TODAY), 'check-pending');
  assert.equal(M.checkState({ status: 'done', checkDate: '2026-10-23', check: '' }, TODAY), 'check-overdue');
  assert.equal(M.checkState({ status: 'done', checkDate: '2026-10-23', check: 'partly' }, TODAY), 'partly');
});

test('reviews: the date set, at once after an injury or a change, and whole months to the end of a month', () => {
  const M = math();
  assert.equal(M.addMonths('2026-01-31', 1), '2026-02-28');
  assert.equal(M.addMonths('2024-02-29', 12), '2025-02-28');
  assert.equal(M.addMonths('2025-11-13', 12), '2026-11-13');
  assert.equal(M.addMonths('2026-10-24', 6), '2027-04-24');
  assert.equal(M.addMonths('2026-12-15', 24), '2028-12-15');
  assert.equal(M.addMonths('nope', 12), '');
  const a = { id: 'a1', area: 'Picking', date: '2026-08-10', nextReview: '2027-08-10', changed: false };
  assert.deepEqual(plain(M.reviewState(a, TODAY)), { state: 'ok', due: '2027-08-10', next: '2027-08-10', days: 290, overdue: false });
  assert.equal(M.reviewState({ ...a, nextReview: '2026-11-13' }, TODAY).state, 'soon', '20 days ahead');
  assert.equal(M.reviewState({ ...a, nextReview: '2026-11-23' }, TODAY).state, 'soon', '30 days ahead is still soon');
  assert.equal(M.reviewState({ ...a, nextReview: '2026-11-24' }, TODAY).state, 'ok', '31 days ahead');
  assert.equal(M.reviewState({ ...a, nextReview: TODAY }, TODAY).days, 0);
  const late = plain(M.reviewState({ ...a, nextReview: '2026-09-19' }, TODAY));
  assert.deepEqual([late.state, late.days, late.overdue], ['overdue', 35, true]);
  assert.equal(M.reviewState({ ...a, nextReview: '' }, TODAY).state, 'none');
  assert.equal(M.reviewState({ ...a, changed: true }, TODAY).state, 'change');
  assert.equal(M.reviewDue({ state: 'overdue' }) && M.reviewDue({ state: 'change' }) && M.reviewDue({ state: 'event' }) && !M.reviewDue({ state: 'soon' }), true);
  // An injury in the same area after the assessment date makes the review due now; one before it, elsewhere, or a
  // near miss of severity 3 does not; a near miss that could have killed (4) does.
  const ev = (date, type, area = 'Picking', severity = 2) => ({ date, type, area, severity });
  assert.equal(M.reviewState(a, TODAY, { events: [ev('2026-09-16', 'lost-time')] }).state, 'event');
  assert.equal(M.reviewState(a, TODAY, { events: [ev('2026-09-16', 'first-aid', ' picking ')] }).state, 'event', 'area names match without case and spaces');
  assert.equal(M.reviewState(a, TODAY, { events: [ev('2026-08-01', 'lost-time')] }).state, 'ok', 'before the assessment');
  assert.equal(M.reviewState(a, TODAY, { events: [ev('2026-09-16', 'lost-time', 'Yard')] }).state, 'ok', 'another area');
  assert.equal(M.reviewState(a, TODAY, { events: [ev('2026-09-16', 'near-miss', 'Picking', 3)] }).state, 'ok');
  assert.equal(M.reviewState(a, TODAY, { events: [ev('2026-09-16', 'near-miss', 'Picking', 4)] }).state, 'event');
  assert.equal(M.reviewState(a, TODAY, { events: [ev('2026-10-30', 'lost-time')] }).state, 'ok', 'a date still to come');
  const hit = plain(M.reviewState({ ...a, nextReview: '2026-09-01' }, TODAY, { events: [ev('2026-10-02', 'no-lost-time'), ev('2026-09-16', 'lost-time')] }));
  assert.deepEqual([hit.state, hit.overdue, hit.events.map((e) => e.date)], ['event', true, ['2026-09-16', '2026-10-02']]);
});

test('the Safety Cross cross-check reads the log in its real shape and flags missing assessments and causes not covered', () => {
  const M = math();
  // A Safety Cross state as safety-cross.js saves it.
  const sxState = {
    hours: '160000', nearMissTarget: '8', freeDaysTarget: '365', month: '', view: 'cross', talks: [], example: {}, totalsFor: {}, from: '', to: '',
    rows: [
      { date: '2026-09-08', shift: 'Early', type: 'near-miss', area: 'Loading dock', what: 'Pallet slid off the forks', cause: 'Forklift / vehicle', severity: 3, action: '', owner: 'Marco', done: true },
      { date: '2026-10-13', shift: 'Early', type: 'unsafe-act', area: 'Loading dock', what: 'Phone while driving', cause: 'Procedure not followed', severity: 4, action: '', owner: 'Anna', done: false },
      { date: '2026-09-16', shift: 'Early', type: 'lost-time', area: 'Picking', what: 'Slipped on a wet floor', cause: 'Falls / slips', severity: 3, action: '', owner: 'Anna', done: true },
      { date: '2026-10-06', shift: 'Early', type: 'first-aid', area: 'picking', what: 'Cut finger on a broken tote', cause: 'Equipment', severity: 2, action: '', owner: 'Sofia', done: false },
      { date: '2026-10-07', shift: 'Late', type: 'near-miss', area: 'Picking', what: 'Heavy parcel nearly dropped', cause: 'Manual handling', severity: 2, action: '', owner: 'Sofia', done: false },
      { date: '2026-10-20', shift: 'Late', type: 'positive', area: 'Picking', what: 'Asked before crossing', cause: 'Forklift / vehicle', severity: 1, action: '', owner: 'Marco', done: true },
      { date: '2026-09-19', shift: 'Night', type: 'near-miss', area: 'Yard', what: 'Reversed towards a colleague', cause: 'Forklift / vehicle', severity: 4, action: '', owner: 'Luca', done: false },
      { date: '2025-06-01', shift: 'Night', type: 'near-miss', area: 'Office', what: 'Old event', cause: 'Other', severity: 1, action: '', owner: '', done: true },
      { date: '2026-10-01', shift: 'Late', type: 'near-miss', area: '', what: 'No area', cause: 'Other', severity: 1, action: '', owner: '', done: true },
      { date: 'yesterday', type: 'near-miss', area: 'Yard' },
    ],
  };
  const events = M.readEvents(sxState);
  assert.equal(events.length, 9, 'a row without a valid date is dropped');
  assert.equal(M.readEvents(null).length, 0);
  assert.equal(M.readEvents({ rows: 'x' }).length, 0);
  const assessments = [
    { id: 'dock', area: 'Loading dock', hazards: [{ group: 'mechanical' }, { group: 'load' }] },
    { id: 'pick', area: 'Picking', hazards: [{ group: 'load' }, { group: 'psych' }, { group: 'environment' }] },
    { id: 'store', area: 'Storage', hazards: [{ group: 'mechanical' }] },
  ];
  const rows = plain(M.crossCheck(assessments, events, { causeGroups: cfg.causeGroups, from: '2025-10-24', to: TODAY }));
  const by = Object.fromEntries(rows.map((r) => [r.area, r]));
  assert.deepEqual(rows.map((r) => r.area), ['Picking', 'Yard', 'Loading dock'], 'flagged first, then by events; the old event and the one without an area are out');
  assert.deepEqual([by.Picking.events, by.Picking.accidents, by.Picking.flag], [3, 2, 'not-covered'], 'the positive observation is not an event');
  assert.deepEqual(by.Picking.uncovered.map((u) => [u.cause, u.n]), [['Falls / slips', 1], ['Equipment', 1]], 'slips and equipment need a mechanical (or electrical) hazard; manual handling is covered by the load hazards');
  assert.deepEqual([by.Yard.events, by.Yard.assessed, by.Yard.flag], [1, false, 'no-assessment']);
  assert.deepEqual([by['Loading dock'].events, by['Loading dock'].flag, by['Loading dock'].assessments], [2, '', ['dock']], 'forklift is covered by the mechanical hazard; a procedure not followed by any assessment');
  assert.equal(by.Storage, undefined, 'an area without events is not listed');

  // The example of the Safety Cross itself, made by safety-cross.js, against the example of this tool.
  const w = load({ page: false, extra: ['safety-cross'] });
  const sxRows = plain(w.SafetyMath.exampleRows(read(SX.en)));
  const R = w.RiskAssessmentMath;
  const mine = plain(R.fromExample(cfg.example, TODAY, cfg));
  const check = plain(R.crossCheck(mine, R.readEvents({ rows: sxRows }), { causeGroups: cfg.causeGroups, from: R.addDays(TODAY, -365), to: TODAY }));
  assert.deepEqual(check.map((r) => [r.area, r.events, r.flag]), [
    ['Picking', 2, 'not-covered'], ['Receiving', 2, 'no-assessment'], ['Yard', 2, 'no-assessment'], ['Packing', 1, 'no-assessment'],
    ['Loading dock', 3, ''], ['Storage', 1, ''],
  ]);
  // The lost-time accident in picking (16 Sept) came after its assessment (75 days ago): review now. So does the near
  // miss of fatal potential at the dock (2 Oct, 120 days after the dock's assessment).
  const states = mine.map((a) => [a.area, R.reviewState(a, TODAY, { events: R.readEvents({ rows: sxRows }) }).state]);
  assert.deepEqual(states, [['Loading dock', 'event'], ['Storage', 'soon'], ['Picking', 'event'], ['Charging room', 'overdue']]);
});

test('the example: a parcel warehouse with four areas, every number worked by hand', () => {
  const M = math();
  for (const lang of ['en', 'de', 'sq']) {
    const d = read(DATA[lang]);
    const list = plain(M.fromExample(d.example, TODAY, d));
    assert.equal(list.length, 4, lang);
    assert.deepEqual(list.map((a) => [a.date, a.nextReview]), [['2026-06-26', '2027-06-26'], ['2025-11-13', '2026-11-13'], ['2026-08-10', '2027-08-10'], ['2025-09-19', '2026-09-19']], lang);
    const sum = plain(M.summarize(list, TODAY));
    assert.equal(sum.hazards, 17);
    assert.deepEqual(sum.before, { low: 1, medium: 8, high: 7, 'very-high': 1, unrated: 0 }, `${lang} before`);
    assert.deepEqual(sum.after, { low: 8, medium: 8, high: 1, 'very-high': 0, unrated: 0 }, `${lang} after`);
    assert.deepEqual([sum.highBefore, sum.highAfter], [8, 1]);
    assert.deepEqual([sum.measures, sum.open, sum.overdue], [33, 14, 2], `${lang} measures`);
    assert.deepEqual([sum.checksPending, sum.checksOverdue, sum.partly, sum.notEffective], [2, 1, 3, 0], `${lang} checks`);
    assert.deepEqual([sum.onlyP, sum.noMeasure, sum.notReRated], [1, 0, 0]);
    assert.equal(sum.stopWarnings[0].text, d.example.assessments[3].hazards[1].text, 'the acid splashes: PPE only for a high risk');
    assert.deepEqual(sum.highResidual.map((h) => h.text), [d.example.assessments[1].hazards[0].text], 'forklift and pedestrian stays high (2 × 5 = 10)');
    assert.deepEqual(sum.reviews.map((r) => r.state), ['ok', 'soon', 'ok', 'overdue']);
    assert.equal(sum.reviewsDue, 1);
    assert.equal(sum.top.text, d.example.assessments[1].hazards[0].text, 'the highest risk now');
    const open = plain(M.openMeasures(list, TODAY));
    assert.deepEqual(open.slice(0, 2).map((m) => [m.due, m.overdue]), [['2026-10-19', true], ['2026-10-21', true]], 'by due date, overdue first');
    // Luca 4 (1 overdue), Anna 2 (1 overdue), Maintenance 4, Marco 2, Sofia 2: the overdue first, then the most open.
    const owners = plain(M.byOwner(open));
    assert.deepEqual(owners.map((o) => [o.open, o.overdue]), [[4, 1], [2, 1], [4, 0], [2, 0], [2, 0]], lang);
    if (lang === 'en') assert.deepEqual(owners.map((o) => o.owner), ['Luca', 'Anna', 'Maintenance', 'Marco', 'Sofia']);
    assert.deepEqual(owners.map((o) => o.next), ['2026-10-19', '2026-10-21', '2026-11-07', '2026-12-23', '2026-11-03']);
  }
});

test('template files: what is assessed travels, the people, dates and progress of the site do not', () => {
  const w = load({ page: false });
  const M = w.RiskAssessmentMath;
  const [dock] = M.fromExample(cfg.example, TODAY, cfg);
  const tpl = plain(M.toTemplate(dock));
  assert.equal(tpl.area, 'Loading dock');
  assert.equal(tpl.hazards.length, 4);
  assert.deepEqual(Object.keys(tpl.hazards[0].measures[0]).sort(), ['text', 'type']);
  assert.equal(JSON.stringify(tpl).includes('Maintenance'), false, 'no owners');
  const packed = w.TemplatePack.pack({ tool: 'risk-assessment', kind: 'risk-assessment', name: 'Loading dock', data: tpl });
  const opened = w.TemplatePack.read(packed.text, { tool: 'risk-assessment', kind: 'risk-assessment', validate: (raw) => M.fromTemplate(raw, '2027-01-15', cfg) });
  assert.equal(opened.ok, true);
  const a = plain(opened.data);
  assert.deepEqual([a.date, a.reviewMonths, a.nextReview, a.assessor], ['2027-01-15', 12, '2028-01-15', '']);
  assert.ok(a.hazards[0].measures.every((m) => m.status === 'open' && !m.owner && !m.due && !m.check));
  assert.deepEqual(a.hazards.map((h) => [h.l, h.s, h.l2, h.s2]), dock.hazards.map((h) => [h.l, h.s, h.l2, h.s2]));
  assert.equal(w.TemplatePack.read(packed.text, { tool: 'fmea' }).ok, false, 'another tool does not open it');
  assert.equal(M.fromTemplate({ hazards: 'x' }, TODAY, cfg), null);
  // Saved state with damage is rebuilt field by field.
  const state = plain(M.cleanState({ assessments: [{ id: 'a', area: 'X', hazards: [{ group: 'nope', l: 9, s: '3', measures: [{ type: 'Z', status: 'gone', due: '31.12.2026' }] }] }, 'junk'], bands: { low: 30 }, sector: 'mars' }, cfg));
  assert.equal(state.assessments.length, 1);
  assert.deepEqual([state.assessments[0].hazards[0].group, state.assessments[0].hazards[0].l, state.assessments[0].hazards[0].s], ['other', null, 3]);
  assert.deepEqual([state.assessments[0].hazards[0].measures[0].type, state.assessments[0].hazards[0].measures[0].status, state.assessments[0].hazards[0].measures[0].due], ['O', 'open', '']);
  assert.deepEqual([state.bands, state.sector, state.current], [{ low: 4, medium: 9, high: 16 }, 'warehouse', 'a']);
});

test('the page opens on the example, draws both matrices and the cross-check, and hands measures to the Action Tracker', () => {
  const sxRows = (() => { const w = load({ page: false, extra: ['safety-cross'] }); return plain(w.SafetyMath.exampleRows(read(SX.en))); })();
  const w = load({ storage: { 'sc-safety-cross': { rows: sxRows } } });
  const doc = w.document;
  const results = doc.querySelector('[data-results]');
  assert.equal(results.hidden, false);
  assert.equal(doc.querySelector('.dl-example-note').hidden, false, 'the note says it is an example');
  assert.equal(w.localStorage.getItem('sc-risk-assessment'), null, 'nothing saved until the visitor acts');
  assert.match(results.querySelector('h2').textContent, /^8 high or very high risks → 1 after the measures/);
  assert.equal(results.querySelectorAll('.ck-figure svg').length, 2, 'the matrix before and after');
  const cells = [...results.querySelectorAll('.ck-figure svg')[0].querySelectorAll('[data-tip]')];
  assert.equal(cells.length, 25);
  assert.ok(cells.some((c) => /× Severity of harm 5 = 20 · Very high\nLoading dock: Pedestrians crossing/.test(c.getAttribute('data-tip'))));
  // 17 hazards in 10 cells: 2 × 4 and 3 × 2 hold three each, 3 × 5, 3 × 4 and 4 × 3 two each.
  assert.equal(cells.filter((c) => c.querySelector('text')).length, 10, 'ten cells hold hazards before the measures');
  assert.deepEqual(cells.map((c) => c.querySelector('text')?.textContent).filter(Boolean).map(Number).sort((a, b) => b - a), [3, 3, 2, 2, 2, 1, 1, 1, 1, 1]);
  assert.match(results.textContent, /Low 1–4 · Medium 5–9 · High 10–16 · Very high 20–25/, 'the bands are stated in text');
  assert.match(results.textContent, /Only personal protective equipment is planned for a high risk/);
  const cross = results.querySelector('.ra-cross-table');
  assert.ok(cross, 'the Safety Cross check');
  assert.match(cross.textContent, /No assessment for this area/);
  assert.match(cross.textContent, /Not covered: Falls \/ slips \(1\), Equipment \(1\)/);
  assert.match(results.querySelector('.ra-review-table').textContent, /Review now: Lost time on 2026-09-16 \(Safety Cross\)/);
  // The 5 Whys and FMEA links for the high residual risk.
  const whys = [...results.querySelectorAll('a')].find((a) => /5 Whys/.test(a.textContent));
  assert.match(new URL(whys.href).searchParams.get('problem'), /^Collision between forklift and pedestrian at blind aisle ends \(Storage · /);
  assert.ok([...results.querySelectorAll('a')].some((a) => a.textContent === 'Analyse it in FMEA' && a.href.endsWith('/tools/fmea/')));
  // One measure to the tracker: the link carries it, with the source.
  const link = [...results.querySelectorAll('.ra-open-table a')].find((a) => a.textContent === 'Add to actions');
  click(w, link);
  const url = new URL(link.href);
  assert.equal(url.pathname, '/tools/action-tracker/');
  assert.equal(url.searchParams.get('source'), 'risk-assessment');
  assert.equal(url.searchParams.get('action'), 'Lone-worker check-in with the shift lead every 30 minutes');
  assert.equal(url.searchParams.get('owner'), 'Luca');
  assert.equal(url.searchParams.get('due'), '2026-10-19');
  assert.equal(url.searchParams.get('area'), 'Charging room');
  // All open measures at once, each only once.
  const all = [...results.querySelectorAll('button')].find((b) => b.textContent === 'Add open measures to the Action Tracker');
  click(w, all);
  // From the example, the actions arrive as the example's (ActionsStore: example: true); no other tool counts them.
  assert.ok(w.ActionsStore.all().every((a) => a.example === true));
  assert.equal(w.ActionsStore.list().length, 0);
  assert.equal(w.ActionsStore.all().length, 14);
  assert.ok(w.ActionsStore.all().every((a) => a.source === 'risk-assessment'));
  click(w, [...doc.querySelector('[data-results]').querySelectorAll('button')].find((b) => b.textContent === 'Add open measures to the Action Tracker'));
  assert.equal(w.ActionsStore.all().length, 14, 'not twice');
  // The printed documentation: one page per assessment, with the signature lines.
  const print = doc.querySelector('[data-print]');
  assert.equal(print.querySelectorAll('.ra-print-page').length, 4);
  assert.equal(print.querySelectorAll('.ra-print-page')[0].querySelectorAll('.ra-sign').length, 4);
  assert.ok(print.classList.contains('is-ready'));
});

test('a visitor adds a hazard and a measure; the warnings follow the ratings; the work is saved', () => {
  const w = load();
  const doc = w.document;
  click(w, doc.querySelector('[data-new]'));
  assert.equal(doc.querySelector('.dl-example-note').hidden, true, 'a new assessment clears the example');
  const head = doc.querySelector('[data-header]');
  type(w, head.elements.area, 'Charging room');
  type(w, head.elements.date, '2026-10-01');
  assert.equal(head.elements.nextReview.value, '2027-10-01', 'twelve months on');
  type(w, head.elements.nextReview, '2027-03-31');
  assert.equal(head.elements.reviewMonths.value, '0', 'an own date');
  const young = doc.getElementById('ra-special-young');
  young.checked = true;
  young.dispatchEvent(new w.Event('input', { bubbles: true }));
  assert.equal(doc.querySelector('[data-special-notes]').hidden, false);
  const add = doc.querySelector('[data-add-form]');
  add.elements.group.value = 'substances';
  type(w, add.elements.text, 'Acid splashes when topping up water');
  type(w, add.elements.l, '3');
  type(w, add.elements.s, '4');
  assert.match(doc.querySelector('[data-add-risk]').textContent, /12 · High/);
  click(w, doc.querySelector('[data-add-hazard]'));
  const card = doc.querySelector('.ra-hazard');
  assert.ok(card);
  assert.match(card.querySelector('[data-warn]').textContent, /No measure yet for a high risk/);
  click(w, card.querySelector('[data-add-measure]'));
  const measure = doc.querySelector('.ra-measure');
  const [stopSelect] = measure.querySelectorAll('select');
  assert.equal(stopSelect.value, 'S', 'the first letter of STOP');
  stopSelect.value = 'P';
  stopSelect.dispatchEvent(new w.Event('change', { bubbles: true }));
  type(w, measure.querySelector('input[type=text]'), 'Face shield and acid-resistant gloves');
  assert.match(doc.querySelector('.ra-hazard [data-warn]').textContent, /Only personal protective equipment is planned for a high risk/);
  const state = saved(w);
  assert.equal(state.example, false);
  assert.equal(state.assessments.length, 1);
  assert.deepEqual([state.assessments[0].area, state.assessments[0].nextReview, state.assessments[0].special], ['Charging room', '2027-03-31', ['young']]);
  assert.deepEqual(plain(state.assessments[0].hazards[0]).measures.map((m) => [m.type, m.text]), [['P', 'Face shield and acid-resistant gloves']]);
  // Bands edited on the page change the band of the same score.
  const bands = doc.querySelector('[data-bands]');
  bands.elements.medium.value = '12';
  bands.elements.medium.dispatchEvent(new w.Event('change', { bubbles: true }));
  assert.deepEqual(saved(w).bands, { low: 4, medium: 12, high: 16 });
  assert.match(doc.querySelector('.ra-hazard [data-risk]').textContent, /12 · Medium/);
  assert.equal(doc.querySelector('.ra-hazard [data-warn]').hidden, true, 'a medium risk with PPE only is not flagged');
  bands.elements.low.value = '20';
  bands.elements.low.dispatchEvent(new w.Event('change', { bubbles: true }));
  assert.deepEqual(saved(w).bands, { low: 4, medium: 12, high: 16 }, 'a set that does not rise is refused');
});

test('the CSV has one row per measure (or per hazard without one), the header first', async () => {
  const w = load();
  let blob = null;
  w.URL.createObjectURL = (value) => { blob = value; return 'blob:test'; };
  w.HTMLAnchorElement.prototype.click = () => {};
  click(w, w.document.querySelector('[data-csv]'));
  const text = await new Promise((resolve) => { const reader = new w.FileReader(); reader.onload = () => resolve(String(reader.result)); reader.readAsText(blob); });
  const lines = text.replace(/^\uFEFF/, '').trim().split('\r\n');
  assert.equal(lines.length, 1 + 33, 'the header and the 33 measures');
  assert.match(lines[0], /^Area,Activity,Date,Assessor,Next review,Hazard factor,Hazard,Likelihood,Severity of harm,Risk,Risk band,STOP,Measure,Owner/);
  assert.match(lines[1], /^Loading dock,.*,1 · Mechanical hazards,.*,3,5,15,High,T,/);
});

test('German and Albanian pages keep their own work and hand over to the tracker of their language', () => {
  for (const lang of ['de', 'sq']) {
    const w = load({ lang });
    const d = read(DATA[lang]);
    const results = w.document.querySelector('[data-results]');
    assert.equal(results.hidden, false, lang);
    assert.match(results.textContent, new RegExp(d.bands.low.name));
    const link = [...results.querySelectorAll('.ra-open-table a')][0];
    click(w, link);
    const url = new URL(link.href);
    assert.equal(url.pathname, `/${lang}/tools/action-tracker/`, `${lang} keeps its language`);
    assert.equal(url.searchParams.get('source'), 'risk-assessment');
    click(w, w.document.querySelector('[data-new]'));
    assert.ok(w.localStorage.getItem(`sc-risk-assessment-${lang}`), `${lang} saves under its own key`);
    assert.equal(w.localStorage.getItem('sc-risk-assessment'), null);
    assert.ok(w.document.querySelector(`a[data-safety-cross-link]`).getAttribute('href').startsWith(`/${lang}/tools/safety-cross/`));
    assert.equal(JSON.parse(w.document.getElementById('risk-assessment-sx').textContent).key, `sc-safety-cross-${lang}`, 'the Safety Cross of the same language');
  }
});
