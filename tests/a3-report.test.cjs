// The A3 Report (src/js/a3-report.js): the eight-point quality check, the gap, what it takes from 5 Whys and Pareto,
// the saved list of A3s, and what it hands to the Action Tracker and to Word.
process.env.TZ = 'Europe/Berlin';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const { JSDOM } = require('jsdom');

const plain = (value) => JSON.parse(JSON.stringify(value));
const read = (file) => JSON.parse(fs.readFileSync(file, 'utf8'));
const dataFile = (lang) => read(lang === 'en' ? 'src/_data/a3Report.json' : `src/_data/${lang}/a3Report.json`);

const load = (lang = 'en', { page = true, search = '', storage = {}, now = '2026-10-23T10:00:00Z' } = {}) => {
  const prefix = lang === 'en' ? '' : `/${lang}`;
  const body = page ? fs.readFileSync('src/_includes/partials/a3-report.njk', 'utf8')
    .replace(/\{#[\s\S]*?#\}/g, '').replace(/\{%-?[\s\S]*?-?%\}/g, '')
    .replace(/\{\{ *"([^"]+)" *\| *t\(lang\)[^}]*\}\}/g, '$1')
    .replace(/\{\{ *cfg *\| *scriptJson *\| *safe *\}\}/, JSON.stringify(dataFile(lang)).replace(/</g, '\\u003c'))
    .replace(/\{\{[^}]*\}\}/g, '').replace(/<script src=[^>]*><\/script>/g, '') : '';
  const dom = new JSDOM(`<html lang="${lang}"><body>${body}</body></html>`, { url: `https://example.test${prefix}/tools/a3-report/${search}`, runScripts: 'outside-only', pretendToBeVisual: true });
  const w = dom.window;
  w.eval(`(() => { const Real = Date; const fixed = new Real(${JSON.stringify(now)}); Date = class extends Real { constructor(...args) { super(...(args.length ? args : [fixed])); } static now() { return fixed.getTime(); } }; })();`);
  w.confirm = () => true;
  w.TextEncoder = TextEncoder; // jsdom has none; the Word file needs it.
  w.HTMLElement.prototype.scrollIntoView = () => {};
  Object.entries(storage).forEach(([key, value]) => w.localStorage.setItem(key, JSON.stringify(value)));
  for (const file of ['tool-kit', 'chart-kit', 'actions-store', 'docx-kit', 'a3-report']) w.eval(fs.readFileSync(`src/js/${file}.js`, 'utf8'));
  return w;
};
const saved = (w, key = 'sc-a3-report') => JSON.parse(w.localStorage.getItem(key));
const type = (w, selector, value) => {
  const node = w.document.querySelector(selector);
  node.value = value;
  node.dispatchEvent(new w.Event('input', { bubbles: true }));
};

test('the three data files share one shape and keep their own saved work', () => {
  const en = dataFile('en');
  const shape = (value) => (Array.isArray(value) ? (value.length && typeof value[0] === 'object' && !Array.isArray(value[0]) ? [shape(value[0])] : 'list')
    : value && typeof value === 'object' ? Object.fromEntries(Object.keys(value).sort().map((key) => [key, shape(value[key])])) : typeof value);
  assert.equal(en.storageKey, 'sc-a3-report');
  for (const lang of ['de', 'sq']) {
    const other = dataFile(lang);
    assert.deepEqual(shape(other), shape(en), lang);
    assert.equal(other.storageKey, `sc-a3-report-${lang}`);
    assert.equal(other.statuses.length, 4, `${lang} statuses`);
    assert.equal(other.tips.length, en.tips.length, `${lang} tips`);
    assert.equal(other.example.countermeasures.length, en.example.countermeasures.length, `${lang} countermeasures`);
    assert.equal(other.example.plan.length, en.example.plan.length, `${lang} plan`);
    other.example.countermeasures.forEach((c, i) => {
      assert.ok(other.statuses.includes(c.status), `${lang} status ${c.status}`);
      assert.equal(other.statuses.indexOf(c.status), en.statuses.indexOf(en.example.countermeasures[i].status), `${lang} status ${i}`);
      assert.equal(c.due, en.example.countermeasures[i].due);
    });
  }
});

test('the example passes all eight points in every language, with its dates moved to recent days', () => {
  for (const lang of ['en', 'de', 'sq']) {
    const w = load(lang, { page: false });
    const cfg = dataFile(lang);
    const r = w.A3Math.exampleReport(cfg.example, '2026-10-23', cfg.statuses);
    assert.equal(r.date, '2026-08-14', `${lang} date`);
    assert.equal(r.targetBy, '2026-10-09');
    assert.equal(r.countermeasures[0].due, '2026-08-28');
    const q = w.A3Math.check(r, cfg);
    assert.deepEqual(plain(q.items.filter((i) => !i.ok).map((i) => i.key)), [], `${lang}: every point passes`);
    assert.equal(q.score, 8);
  }
});

test('the quality check names what is missing: number, time frame, a person as the cause, owners, dates, a measure', () => {
  const w = load('en', { page: false });
  const cfg = dataFile('en');
  const M = w.A3Math;
  const failing = (r) => plain(M.check(r, cfg).items.filter((i) => !i.ok).map((i) => i.key));
  assert.deepEqual(failing({}), plain(M.CHECKS), 'an empty A3 misses all eight');
  const r = M.exampleReport(cfg.example, '2026-10-23', cfg.statuses);
  assert.deepEqual(failing({ ...r, current: 'Parcels are damaged at the dock.', baseline: '' }), ['number', 'time']);
  assert.deepEqual(failing({ ...r, current: 'Damage is high in KW 12.', baseline: '' }), [], 'a calendar week is a time frame');
  assert.deepEqual(failing({ ...r, target: 'Lower damage.', targetValue: '', targetBy: '' }), ['targetNumber', 'targetDate']);
  assert.deepEqual(failing({ ...r, rootCause: 'The loader forgot to check the wall. Human error.' }), ['cause']);
  assert.deepEqual(failing({ ...r, rootCause: 'Too short' }), ['cause'], 'one word is not a root cause');
  assert.ok(!M.hasWord('The bypass lane', ['by']), 'whole words only');
  assert.ok(M.hasWord('Over the last three weeks', ['weeks']));
  const noOwner = { ...r, countermeasures: [...r.countermeasures, { text: 'Locking bars', owner: '', due: '', status: 'Open' }] };
  assert.deepEqual(failing(noOwner), ['owners', 'dates']);
  assert.deepEqual(failing({ ...r, countermeasures: [] }), ['owners', 'dates'], 'no countermeasure at all fails both');
  assert.deepEqual(failing({ ...r, how: 'We will look at it.' }), ['measure']);
  assert.deepEqual(failing({ ...r, how: 'Damage per 1,000 units' }), []);
});

test('the gap: lower is better when the target is below the baseline, and the latest value closes part of it', () => {
  const w = load('en', { page: false });
  const g = plain(w.A3Math.gap('0.57', '0.30', '0.31'));
  assert.ok(g.down);
  assert.ok(Math.abs(g.size - 0.27) < 1e-9);
  assert.ok(Math.abs(g.closed - 0.26 / 0.27) < 1e-9);
  assert.ok(Math.abs(g.remaining - 0.01) < 1e-9);
  assert.equal(g.reached, false);
  assert.ok(Math.abs(g.relative + 0.27 / 0.57) < 1e-9);
  assert.equal(w.A3Math.gap('0.57', '0.30', '0.29').reached, true);
  const up = plain(w.A3Math.gap('92', '98', '96'));
  assert.equal(up.down, false);
  assert.ok(Math.abs(up.closed - 4 / 6) < 1e-9);
  assert.equal(up.remaining, 2);
  assert.equal(w.A3Math.gap('', '0.30', ''), null, 'no baseline, no gap');
  assert.equal(plain(w.A3Math.gap('0.57', '0.30', '')).latest, null);
  assert.equal(w.A3Math.digitsOf('0.57', '0.3', '12'), 2);
  // German pages read 0,57.
  const de = load('de', { page: false });
  assert.ok(Math.abs(de.A3Math.gap('0,57', '0,30').size - 0.27) < 1e-9);
});

test('5 Whys and Pareto: the chain of whys becomes box 4, the largest causes a sentence for box 2', () => {
  const w = load('en', { page: false });
  const found = plain(w.A3Math.fromWhys({ problem: 'Crushed parcels', why2: 'No stacking rule', why1: 'Heavy on light', why3: '', cause: 'No visible standard', action: 'Stacking picture', owner: 'Anna', due: '2026-10-30', check: 'Damage per week' }, { why: 'Why?', cause: 'Root cause' }));
  assert.equal(found.rootCause, 'Why? Heavy on light\nWhy? No stacking rule\nRoot cause: No visible standard');
  assert.deepEqual(found.countermeasure, { text: 'Stacking picture', owner: 'Anna', due: '2026-10-30' });
  assert.equal(found.problem, 'Crushed parcels');
  assert.equal(w.A3Math.fromWhys({}), null);
  const top = plain(w.A3Math.paretoTop({
    source: { name: 'damage.csv', headers: ['Cause', 'Count'], rows: [['Stacking', '56'], ['stacking ', '0'], ['Load securing', '14'], ['Handling', '11'], ['Other', '19'], ['', '5']] },
    map: { category: 0, count: 1, value: -1, date: -1, filter: -1 }, measure: 'count', merges: [['Other', 'Handling']],
  }));
  assert.equal(top.name, 'damage.csv');
  assert.equal(top.total, 100);
  assert.deepEqual(top.top.map((g) => g.name), ['Stacking', 'Handling', 'Load securing']);
  assert.ok(Math.abs(top.share - 1) < 1e-9);
  assert.equal(w.A3Math.paretoTop(null), null);
});

test('the page opens on the example on a first visit and draws the A3 sheet', () => {
  const w = load('sq');
  const doc = w.document;
  const state = saved(w, 'sc-a3-report-sq');
  assert.equal(state.reports.length, 1);
  assert.equal(state.example, state.reports[0].id);
  const results = doc.querySelector('[data-results]');
  assert.ok(!results.hidden);
  assert.ok(!doc.querySelector('.dl-example-note').hidden);
  assert.equal(results.querySelectorAll('.a3-left .a3-box').length, 4);
  assert.equal(results.querySelectorAll('.a3-right .a3-box').length, 3);
  assert.equal(results.querySelectorAll('.a3-table tbody tr').length, 4);
  assert.equal(results.querySelectorAll('.a3-steps li').length, 5);
  assert.equal(results.querySelectorAll('.a3-quality .ck-chip.is-ok').length, 8);
  assert.ok(results.querySelector('.ck-figure svg'), 'baseline, target and latest as a chart');
  assert.match(results.querySelector('.result-head p:last-child').textContent, /96%/);
  assert.equal(doc.querySelector('#a3-title').value, dataFile('sq').example.title);
  assert.equal(doc.querySelectorAll('[data-cms] .a3-row').length, 4);
  // Typing makes the example this person's A3: the note goes, the change is saved.
  type(w, '#a3-title', 'Dëmet në dalje, Hub 2');
  assert.ok(doc.querySelector('.dl-example-note').hidden);
  assert.equal(saved(w, 'sc-a3-report-sq').reports[0].title, 'Dëmet në dalje, Hub 2');
  assert.equal(saved(w, 'sc-a3-report-sq').example, '');
  // A countermeasure without an owner shows in the check and under box 5.
  type(w, '[data-cms] .a3-row [data-key="owner"]', '');
  assert.equal(doc.querySelectorAll('.a3-quality .ck-chip.is-ok').length, 7);
  assert.ok(!doc.querySelector('[data-cms]').closest('fieldset').querySelector('.a3-nudge').hidden);
});

test('several A3s: new, duplicate, delete with undo', () => {
  const w = load('en');
  const doc = w.document;
  doc.querySelector('[data-new]').click();
  assert.equal(saved(w).reports.length, 2);
  assert.ok(doc.querySelector('[data-results]').hidden, 'an empty A3 has no sheet yet');
  type(w, '#a3-title', 'Late trucks');
  type(w, '#a3-baseline', '12');
  assert.ok(!doc.querySelector('[data-results]').hidden);
  assert.equal(doc.querySelectorAll('.a3-item').length, 2);
  doc.querySelectorAll('.a3-item')[0].querySelector('.a3-item-tools button').click();
  assert.deepEqual(saved(w).reports.map((r) => r.title), ['Late trucks', 'Late trucks (copy)', 'Outbound damage below 0.30%']);
  const del = [...doc.querySelectorAll('.a3-item')][1].querySelectorAll('.a3-item-tools button')[1];
  del.click();
  assert.equal(saved(w).reports.length, 2);
  doc.querySelector('[data-list-status] .dl-undo').click();
  assert.equal(saved(w).reports.length, 3);
  assert.equal(saved(w).reports[1].title, 'Late trucks (copy)');
});

test('countermeasures go to the Action Tracker once, with owner, date, status and source', () => {
  const w = load('de');
  const doc = w.document;
  doc.querySelector('[data-send-actions]').click();
  // From the example, the actions arrive as the example's (ActionsStore: example: true); no other tool counts them.
  assert.equal(w.ActionsStore.list().length, 0);
  const actions = w.ActionsStore.all();
  assert.ok(actions.every((a) => a.example === true));
  assert.equal(actions.length, 4);
  assert.ok(actions.every((a) => a.source === 'a3-report'));
  assert.equal(actions[0].owner, 'Anna K. (Schichtleitung Früh)');
  assert.equal(actions[0].status, 'verified');
  assert.equal(actions[1].status, 'done');
  assert.equal(actions[0].due, '2026-08-28');
  assert.match(actions[0].detail, /^A3: /);
  doc.querySelector('[data-send-actions]').click();
  assert.equal(w.ActionsStore.all().length, 4, 'not twice');
});

test('Take from 5 Whys reads the worksheet of the page\'s language; ?problem= opens a new A3 once', () => {
  const whys = { problem: 'Kamionët vonohen', why1: 'Rampa është e zënë', why2: 'Nuk ka orar', cause: 'Mungon plani i rampave', action: 'Orar për rampat', owner: 'Besnik', due: '2026-11-02' };
  const w = load('sq', { storage: { 'sc-five-whys-sq': whys, 'sc-five-whys': { problem: 'English sheet', why1: 'x', cause: 'y' } } });
  w.document.querySelector('[data-new]').click();
  w.document.querySelector('[data-from-whys]').click();
  const r = saved(w, 'sc-a3-report-sq').reports[0];
  assert.equal(r.title, 'Kamionët vonohen');
  assert.match(r.rootCause, /^Why\? Rampa është e zënë|^Pse\? Rampa është e zënë/);
  assert.match(r.rootCause, /Mungon plani i rampave$/);
  assert.deepEqual(plain(r.countermeasures.map((c) => [c.text, c.owner, c.due])), [['Orar për rampat', 'Besnik', '2026-11-02']]);
  assert.equal(w.document.querySelector('#a3-cause').value, r.rootCause);

  const p = load('en', { search: '?problem=Damage%20rate%200.57%25&coaching=p1' });
  const state = saved(p);
  assert.equal(state.reports.length, 1, 'no example under a handed-over problem');
  assert.equal(state.reports[0].title, 'Damage rate 0.57%');
  assert.equal(p.location.search, '?coaching=p1', 'read once, the other parameters stay');
});

test('copy as text and the Word file carry all seven boxes and the countermeasure table', () => {
  const w = load('en');
  const r = w.A3Math.exampleReport(dataFile('en').example, '2026-10-23', dataFile('en').statuses);
  const text = w.A3Math.asText(r);
  ['1 · Background', '2 · Current condition', '3 · Target condition', '4 · Root-cause analysis', '5 · Countermeasures', '6 · Plan', '7 · Follow-up', 'Quality check: 8/8', 'Key number today: 0.57% damaged units'].forEach((line) => assert.ok(text.includes(line), line));
  const bytes = w.A3Math.wordFile(r);
  assert.equal(String.fromCharCode(bytes[0], bytes[1]), 'PK');
  const xml = Buffer.from(bytes).toString('utf8');
  assert.match(xml, /<w:tbl>/);
  assert.equal((xml.match(/<w:tr>/g) || []).length, 5, 'a header row and four countermeasures');
  assert.ok(xml.includes('Locking bars after the last wall'));
  assert.ok(xml.includes('7 · Follow-up'));
});
