// The Safety Cross (src/js/safety-cross.js): the cross of the month, the rates, the Bird pyramid, the rows pasted from
// a spreadsheet and the page that shows them.
process.env.TZ = 'Europe/Berlin';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const { JSDOM } = require('jsdom');
const nunjucks = require('nunjucks');

const plain = (value) => JSON.parse(JSON.stringify(value));
const read = (file) => JSON.parse(fs.readFileSync(file, 'utf8'));
const data = { en: read('src/_data/safetyCross.json'), de: read('src/_data/de/safetyCross.json'), sq: read('src/_data/sq/safetyCross.json') };
const part = read('src/_data/i18n-parts/safety-cross.json');
const strings = (lang) => (lang === 'en' ? {} : { ...read(`src/_data/${lang}/ui.json`), ...part[lang] });

// The partial rendered the way the site renders it (the filters stubbed as in scripts/check-tool.mjs), without its
// <script src> tags: the test loads the scripts itself.
const pageHtml = (lang) => {
  const ui = strings(lang);
  const env = new nunjucks.Environment(new nunjucks.FileSystemLoader(['src/_includes']), { autoescape: false });
  env.addFilter('t', (text) => ui[text] ?? text);
  env.addFilter('local', (url) => (lang === 'en' ? url : `/${lang}${url}`));
  env.addFilter('assetUrl', (url) => url);
  env.addFilter('scriptJson', (value) => JSON.stringify(value).replace(/[<>&]/g, (c) => `\\u${c.charCodeAt(0).toString(16).padStart(4, '0')}`));
  const body = env.render('partials/safety-cross.njk', { cfg: data[lang], lang: lang === 'en' ? undefined : lang });
  return `<html lang="${lang}"><body>${body.replace(/<script src=[^>]*><\/script>/g, '')}</body></html>`;
};

const load = ({ lang = 'en', page = false, now = '2026-10-23T10:00:00Z', storage = {} } = {}) => {
  const url = `https://example.test${lang === 'en' ? '' : `/${lang}`}/tools/safety-cross/`;
  const dom = new JSDOM(page ? pageHtml(lang) : `<html lang="${lang}"><body></body></html>`, { url, runScripts: 'outside-only', pretendToBeVisual: true });
  const w = dom.window;
  w.eval(`(() => { const Real = Date; const fixed = new Real(${JSON.stringify(now)}); Date = class extends Real { constructor(...args) { super(...(args.length ? args : [fixed])); } static now() { return fixed.getTime(); } }; })();`);
  w.confirm = () => true;
  w.HTMLElement.prototype.scrollIntoView = () => {};
  Object.entries(storage).forEach(([key, value]) => w.localStorage.setItem(key, JSON.stringify(value)));
  if (lang !== 'en') w.UiStrings = strings(lang);
  for (const file of ['tool-kit', 'chart-kit', 'workplace', 'actions-store', 'safety-cross']) w.eval(fs.readFileSync(`src/js/${file}.js`, 'utf8'));
  return w;
};
// The log writes itself a moment after a change (ToolKit.logBook): a hidden page writes at once.
const flush = (w) => w.dispatchEvent(new w.Event('pagehide'));

test('the three data files share their shape, and each language keeps its own log', () => {
  for (const lang of ['de', 'sq']) {
    const other = data[lang];
    assert.deepEqual(Object.keys(other).sort(), Object.keys(data.en).sort(), lang);
    assert.equal(other.storageKey, `sc-safety-cross-${lang}`);
    assert.deepEqual(Object.keys(other.text).sort(), Object.keys(data.en.text).sort(), `${lang} text`);
    assert.deepEqual(Object.keys(other.types), Object.keys(data.en.types), `${lang} types`);
    assert.deepEqual(Object.keys(other.short), Object.keys(data.en.short), `${lang} short names`);
    assert.deepEqual(Object.keys(other.pyramid), Object.keys(data.en.pyramid), `${lang} pyramid`);
    for (const key of ['shifts', 'areas', 'causes', 'severities', 'talks', 'tips', 'months']) assert.equal(other[key].length, data.en[key].length, `${lang} ${key}`);
    assert.deepEqual(Object.keys(other.advice).sort(), [...other.causes].sort(), `${lang}: advice for every cause`);
    Object.values(other.advice).forEach((advice) => assert.deepEqual(Object.keys(advice).sort(), ['meaning', 'moves', 'question']));
    assert.equal(other.example.rows.length, data.en.example.rows.length, `${lang} example`);
    assert.equal(other.example.hours, data.en.example.hours);
  }
  assert.equal(data.en.storageKey, 'sc-safety-cross');
  assert.deepEqual(Object.keys(data.en.types), ['lost-time', 'no-lost-time', 'first-aid', 'near-miss', 'unsafe-condition', 'unsafe-act', 'positive']);
  assert.deepEqual(Object.keys(data.en.advice).sort(), [...data.en.causes].sort());
});

test('the cross has 31 cells in a plus sign, day 17 in the centre', () => {
  const M = load().SafetyMath;
  const cells = plain(M.crossLayout());
  assert.equal(cells.length, 31);
  assert.deepEqual(cells.map((c) => c.day), Array.from({ length: 31 }, (_, i) => i + 1));
  assert.deepEqual(cells.find((c) => c.day === 17), { day: 17, col: 3, row: 3 });
  assert.deepEqual(cells.find((c) => c.day === 31), { day: 31, col: 3, row: 6 });
  const taken = new Set(cells.map((c) => `${c.col},${c.row}`));
  assert.equal(taken.size, 31, 'no two days share a cell');
  cells.forEach((c) => {
    assert.ok(c.col >= 0 && c.col < 7 && c.row >= 0 && c.row < 7);
    // Outside the middle band only the three middle columns are used: a cross, not a square.
    if (c.row < 2 || c.row > 4) assert.ok(c.col >= 2 && c.col <= 4, `day ${c.day}`);
  });
  assert.equal(M.monthDays('2026-02'), 28);
  assert.equal(M.monthDays('2028-02'), 29);
  assert.equal(M.addMonths('2026-12', 1), '2027-01');
  assert.equal(M.addMonths('2026-01', -1), '2025-12');
});

test('a day is red for an injury, amber for a warning, green otherwise, and empty when still to come', () => {
  const M = load().SafetyMath;
  assert.equal(M.dayState([{ type: 'first-aid' }, { type: 'near-miss' }], '2026-10-02', '2026-10-23'), 'danger');
  assert.equal(M.dayState([{ type: 'lost-time' }], '2026-10-02'), 'danger');
  assert.equal(M.dayState([{ type: 'unsafe-act' }], '2026-10-02'), 'warn');
  assert.equal(M.dayState([{ type: 'positive' }], '2026-10-02'), 'ok');
  assert.equal(M.dayState([], '2026-10-02', '2026-10-23'), 'ok');
  assert.equal(M.dayState([{ type: 'lost-time' }], '2026-10-24', '2026-10-23'), 'future');
});

test('days since the last accident, LTIFR, TRIR, near misses per accident and the pyramid', () => {
  const M = load().SafetyMath;
  const rows = [
    { date: '2026-09-16', type: 'lost-time' },
    { date: '2026-10-02', type: 'no-lost-time' },
    { date: '2026-10-06', type: 'first-aid' },
    { date: '2026-10-08', type: 'near-miss' },
    { date: '2026-10-10', type: 'near-miss' },
    { date: '2026-10-13', type: 'unsafe-act' },
    { date: '2026-10-14', type: 'unsafe-condition' },
    { date: '2026-10-15', type: 'positive' },
  ];
  assert.equal(M.daysSince(rows, '2026-10-23'), 21, 'first aid is no accident');
  assert.equal(M.daysSince(rows, '2026-10-01'), 15, 'only accidents up to that day');
  assert.equal(M.daysSince([{ date: '2026-10-06', type: 'first-aid' }], '2026-10-23'), null);
  const all = plain(M.rates(rows, 160000));
  assert.equal(all.lostTime, 1);
  assert.equal(all.recordable, 2);
  assert.equal(all.ltifr, 6.25, '1 × 1,000,000 / 160,000');
  assert.equal(all.trir, 2.5, '2 × 200,000 / 160,000');
  assert.equal(all.nearMissPerAccident, 1);
  const none = plain(M.rates(rows, NaN));
  assert.equal(none.ltifr, null);
  assert.equal(none.trir, null);
  assert.equal(plain(M.rates([{ type: 'near-miss' }], 1000)).nearMissPerAccident, null);
  assert.deepEqual(plain(M.pyramid(rows)).map((level) => [level.key, level.n, level.bird]), [['lost-time', 1, 1], ['recordable', 2, 10], ['near-miss', 2, 30], ['unsafe', 2, 600]]);
  assert.equal(M.monthRows(rows, '2026-09').length, 1);
  assert.equal(M.talkIndex('2026-10-23', 20), M.talkIndex('2026-10-23', 20));
  assert.notEqual(M.talkIndex('2026-10-23', 20), M.talkIndex('2026-10-24', 20));
  assert.ok(M.talkIndex('2026-10-23', 20) < 20);
});

test('rows pasted from Excel: types by key, name or short name in the language, done words, header skipped', () => {
  const w = load({ lang: 'de' });
  const M = w.SafetyMath;
  const cfg = data.de;
  const text = [
    'Datum\tSchicht\tArt\tBereich\tWas\tUrsache\tSchwere\tMaßnahme\tVerantwortlich\tErledigt',
    '06.10.2026\tSpät\tBeinahe-Unfall\tVerladetor\tPalette gerutscht\tStapler / Fahrzeug\t3\tSpur markieren\tAnna\tja',
    '2026-10-07\tFrüh\tfirst-aid\tlager\tSchnitt\tArbeitsmittel\t9\t\t\tnein',
    '2026-10-08\tNacht\tUnsicherer\tHof\tLampe aus\tArbeitsmittel\t\tLampe tauschen\tInstandhaltung\t',
    '2026-10-09\tNacht\tirgendwas\tHof\t\t\t\t\t\t',
    '\tFrüh\tErste Hilfe\tHof',
  ].join('\n');
  const { added, skipped } = plain(M.importRows(text, cfg));
  assert.equal(added.length, 3);
  assert.equal(skipped, 2, 'an unknown type and a row without a date');
  assert.deepEqual(added[0], { date: '2026-10-06', shift: 'Spät', type: 'near-miss', area: 'Verladetor', what: 'Palette gerutscht', cause: 'Stapler / Fahrzeug', severity: 3, action: 'Spur markieren', owner: 'Anna', done: true });
  assert.equal(added[1].type, 'first-aid');
  assert.equal(added[1].area, 'Lager', 'known names keep their spelling');
  assert.equal(added[1].severity, 1, 'a severity outside 1–4 falls back to 1');
  assert.equal(added[1].done, false);
  assert.equal(added[2].type, 'unsafe-condition', 'the start of a name is enough');
  assert.equal(M.typeOf('Near miss', data.en), 'near-miss');
  assert.equal(M.typeOf('Rrezik i shmangur', data.sq), 'near-miss');
  assert.equal(M.typeOf('Positive', data.sq), 'positive', 'the English words work on every page');
  assert.equal(M.cleanRow({ date: '2026-10-01', type: 'accident' }), null, 'a saved row of an unknown type is dropped');
  assert.deepEqual(plain(M.cleanRow({ date: '2026-10-01', type: 'positive', severity: '2', done: 'yes' })), { date: '2026-10-01', shift: '', type: 'positive', area: '', what: '', cause: '', severity: 2, action: '', owner: '', done: false });
});

test('the example in every language: two months, every row parsed, every cause and area known', () => {
  for (const lang of ['en', 'de', 'sq']) {
    const w = load({ lang });
    const rows = plain(w.SafetyMath.exampleRows(data[lang]));
    assert.equal(rows.length, data[lang].example.rows.length, lang);
    assert.equal(new Set(rows.map((row) => row.date.slice(0, 7))).size, 2, `${lang}: two months`);
    rows.forEach((row, i) => {
      assert.ok(data[lang].causes.includes(row.cause), `${lang} row ${i} cause ${row.cause}`);
      assert.ok(data[lang].areas.includes(row.area), `${lang} row ${i} area ${row.area}`);
      assert.ok(data[lang].shifts.includes(row.shift), `${lang} row ${i} shift ${row.shift}`);
      assert.ok(row.date <= '2026-10-23', `${lang} row ${i} not in the future`);
    });
    // The same events in every language.
    if (lang !== 'en') assert.deepEqual(rows.map((row) => [row.date, row.type, row.severity, row.done]), plain(load().SafetyMath.exampleRows(data.en)).map((row) => [row.date, row.type, row.severity, row.done]), lang);
  }
});

test('a first visit opens on the example: the cross, the stats, the pyramid and the talk of the day', () => {
  const w = load({ lang: 'sq', page: true });
  const doc = w.document;
  const results = doc.querySelector('[data-results]');
  assert.equal(results.hidden, false);
  assert.equal(doc.querySelector('.dl-example-note').hidden, false, 'the note says it is an example');
  const cells = results.querySelectorAll('.sx-cross-chart .sx-cell');
  assert.equal(cells.length, 31);
  assert.equal(results.querySelectorAll('.sx-cell.is-danger').length, 1, 'first aid on the 6th');
  assert.equal(results.querySelectorAll('.sx-cell.is-warn').length, 5);
  assert.equal(results.querySelectorAll('.sx-cell.is-future').length, 8, 'the 24th to the 31st');
  assert.match(cells[5].getAttribute('data-tip'), /Ndihmë e parë/);
  assert.match(results.querySelector('h2').textContent, /17 nga 23 ditë pa incident/);
  const stats = [...results.querySelectorAll('.dl-stat')].map((s) => s.textContent);
  assert.ok(stats.some((s) => /Ditë që nga aksidenti i fundit37/.test(s)), stats.join(' | '));
  assert.ok(stats.some((s) => /^LTIFR0,00/.test(s)), 'no lost time in October');
  assert.ok(stats.some((s) => /Rreziqe të shmangura të raportuara3 nga 8/.test(s)));
  assert.ok(results.querySelector('.sx-pyramid'), 'the pyramid is drawn');
  assert.ok(results.querySelector('.sx-talk h3').textContent.length > 3);
  assert.ok(results.querySelector('.dl-focus'), 'a start-here card');
  assert.match(results.querySelector('.dl-focus h3').textContent, /^Pajisje/, 'equipment: four of the eleven hazards');
  const whys = [...results.querySelectorAll('a')].find((a) => a.href.includes('/five-whys/'));
  assert.ok(whys.href.startsWith('https://example.test/sq/tools/five-whys/?problem='), whys.href);
});

test('the month moves, the view switches, a talk is marked, an action is done, and the log is saved', () => {
  const w = load({ page: true });
  const doc = w.document;
  const results = doc.querySelector('[data-results]');
  results.querySelector('[data-month="-1"]').click();
  assert.match(results.querySelector('.sx-month').textContent, /September 2026/);
  assert.equal(results.querySelectorAll('.sx-cell.is-danger').length, 1, 'the lost-time accident of September');
  assert.equal(results.querySelectorAll('.sx-cell.is-none').length, 1, 'September has no 31st');
  results.querySelector('[data-month="1"]').click();
  results.querySelector('[data-view="calendar"]').click();
  assert.ok(!results.querySelector('.sx-cross-chart'));
  assert.equal(results.querySelector('[data-view="calendar"]').getAttribute('aria-pressed'), 'true');
  const held = results.querySelector('[data-talk-held]');
  const before = results.querySelector('.sx-talk .form-note').textContent;
  held.click();
  assert.equal(results.querySelector('[data-talk-held]').disabled, true);
  assert.notEqual(results.querySelector('.sx-talk .form-note').textContent, before);
  const box = results.querySelector('[data-done]');
  box.checked = true;
  box.dispatchEvent(new w.Event('change', { bubbles: true }));
  flush(w);
  const saved = JSON.parse(w.localStorage.getItem('sc-safety-cross'));
  assert.equal(saved.view, 'calendar');
  assert.equal(saved.rows.length, 14);
  assert.equal(saved.rows.filter((row) => row.action && !row.done).length, 5, 'one of six ticked');
  // The example's rows say they are the example (ToolKit exampleStamp, since 27 October 2026).
  assert.deepEqual(Object.keys(saved.rows[0]).sort(), ['action', 'area', 'cause', 'date', 'done', 'example', 'owner', 'severity', 'shift', 'type', 'what']);
  assert.ok(saved.talks.some((talk) => talk.date === '2026-10-23' && !talk.example));
});

test('hand-offs: open actions to the Action Tracker once, causes to Pareto, a new event to the log', () => {
  const w = load({ lang: 'de', page: true });
  const doc = w.document;
  const results = doc.querySelector('[data-results]');
  const send = [...results.querySelectorAll('button')].find((b) => /Maßnahmenliste übergeben/.test(b.textContent));
  send.click();
  const actions = plain(w.ActionsStore.list());
  assert.equal(actions.length, 6, 'the six open actions of the example');
  assert.ok(actions.every((a) => a.source === 'safety-cross'));
  assert.equal(actions.find((a) => a.detail.startsWith('Erste Hilfe')).priority, 'High', 'an injury is high');
  assert.equal(actions.find((a) => a.detail.startsWith('Unsicherer Zustand')).priority, 'Medium');
  [...results.querySelectorAll('button')].find((b) => /Maßnahmenliste übergeben/.test(b.textContent)).click();
  assert.equal(w.ActionsStore.list().length, 6, 'not added twice');
  assert.match(results.querySelector('.sx-actions').closest('.dl-panel').querySelector('a.inline-link').href, /\/de\/tools\/action-tracker\/$/);
  const pareto = [...results.querySelectorAll('a')].find((a) => a.href.includes('/pareto/'));
  assert.ok(pareto.href.startsWith('https://example.test/de/tools/pareto/'));
  pareto.addEventListener('click', (event) => event.preventDefault());
  pareto.dispatchEvent(new w.MouseEvent('click', { bubbles: true, cancelable: true }));
  const handoff = JSON.parse(w.sessionStorage.getItem('sc-pareto-handoff'));
  assert.equal(handoff.rows.length, 11, 'every event but the positive observations');
  assert.equal(handoff.headers[handoff.map.category], 'Ursache');
  assert.equal(handoff.measure, 'count');
  // A new event while the example is shown replaces the example.
  const form = doc.querySelector('[data-entry]');
  form.elements.date.value = '2026-10-22';
  form.elements.type.value = 'lost-time';
  form.elements.what.value = 'Fuß unter Hubwagen';
  form.elements.action.value = 'Sicherheitsschuhe prüfen';
  form.dispatchEvent(new w.Event('submit', { cancelable: true }));
  flush(w);
  const saved = JSON.parse(w.localStorage.getItem('sc-safety-cross-de'));
  assert.equal(saved.rows.length, 1);
  assert.equal(saved.rows[0].type, 'lost-time');
  assert.equal(saved.hours, '', 'the example leaves with its settings');
  assert.equal(doc.querySelector('.dl-example-note').hidden, true);
  assert.match(results.querySelector('h2').textContent, /von 23 Tagen ohne Vorfall/);
});
