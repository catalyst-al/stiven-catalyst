// FMEA (src/js/fmea.js): the RPN, the AIAG-VDA action priority table, the order of the sheet, the hand-offs, and the
// data files in the three languages.
process.env.TZ = 'Europe/Berlin';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const { JSDOM } = require('jsdom');

const plain = (value) => JSON.parse(JSON.stringify(value));
const readData = (lang = 'en') => JSON.parse(fs.readFileSync(`src/_data/${lang === 'en' ? '' : `${lang}/`}fmea.json`, 'utf8'));
const keysOf = (value, prefix = '') => (value && typeof value === 'object' && !Array.isArray(value)
  ? Object.keys(value).flatMap((key) => [`${prefix}${key}`, ...keysOf(value[key], `${prefix}${key}.`)])
  : []);

// The partial with its Nunjucks stripped, enough for the script to find its elements.
const pageHtml = (lang) => fs.readFileSync('src/_includes/partials/fmea.njk', 'utf8')
  .replace(/\{#[\s\S]*?#\}/g, '')
  .replace(/\{%-?[\s\S]*?-?%\}/g, '')
  .replace(/\{\{ *"([^"]+)" *\| *t\(lang\)[^}]*\}\}/g, '$1').replace(/\{\{ *'([^']+)' *\| *t\(lang\)[^}]*\}\}/g, '$1')
  .replace(/\{\{ *'(\/tools\/[^']+)' *\| *local\(lang\) *\}\}/g, (m, path) => (lang === 'en' ? path : `/${lang}${path}`))
  .replace(/\{\{ *cfg *\| *scriptJson *\| *safe *\}\}/, JSON.stringify(readData(lang)).replace(/</g, '\\u003c'))
  .replace(/\{\{[^}]*\}\}/g, '')
  .replace(/<script src=[^>]*><\/script>/g, '');

const load = (lang = 'en', { page = false, now = '2026-10-23T10:00:00Z' } = {}) => {
  const html = `<html lang="${lang}"><body>${page ? pageHtml(lang) : ''}</body></html>`;
  const dom = new JSDOM(html, { url: `https://example.test/${lang === 'en' ? '' : `${lang}/`}tools/fmea/`, runScripts: 'outside-only', pretendToBeVisual: true });
  const w = dom.window;
  w.eval(`(() => { const Real = Date; const fixed = new Real(${JSON.stringify(now)}); Date = class extends Real { constructor(...args) { super(...(args.length ? args : [fixed])); } static now() { return fixed.getTime(); } }; })();`);
  w.confirm = () => true;
  w.HTMLElement.prototype.scrollIntoView = () => {};
  for (const file of ['tool-kit', 'chart-kit', 'actions-store', 'fmea']) w.eval(fs.readFileSync(`src/js/${file}.js`, 'utf8'));
  return w;
};

test('RPN is S × O × D, only with all three rated', () => {
  const { FmeaMath: M } = load();
  assert.equal(M.rpn(6, 8, 7), 336);
  assert.equal(M.rpn(10, 10, 10), 1000);
  assert.equal(M.rpn('3', '4', '5'), 60, 'a rating from a select is text');
  assert.equal(M.rpn(6, null, 7), null);
  assert.equal(M.rpn(0, 5, 5), null, 'a rating runs from 1 to 10');
  assert.equal(M.rpn(11, 5, 5), null);
  assert.equal(M.rpn(5.5, 5, 5), null);
  assert.equal(M.rating(''), null);
  assert.ok(Math.abs(M.reduction(336, 72) - 264 / 336) < 1e-12);
  assert.equal(M.reduction(0, 10), null);
  assert.equal(M.reduction(100, null), null);
});

test('action priority follows the AIAG-VDA 2019 table, band by band', () => {
  const { FmeaMath: M } = load();
  const cases = [
    // S 9–10
    [10, 10, 1, 'H'], [9, 6, 1, 'H'], [9, 5, 2, 'H'], [9, 4, 1, 'M'], [9, 3, 7, 'H'], [9, 3, 5, 'M'], [9, 2, 4, 'L'], [9, 3, 1, 'L'], [10, 1, 10, 'L'],
    // S 7–8
    [8, 8, 1, 'H'], [7, 7, 2, 'H'], [7, 6, 1, 'M'], [8, 5, 7, 'H'], [8, 4, 6, 'M'], [7, 4, 1, 'M'], [7, 3, 7, 'M'], [8, 2, 5, 'M'], [8, 3, 4, 'L'], [7, 1, 10, 'L'],
    // S 4–6
    [6, 8, 7, 'H'], [4, 9, 5, 'H'], [6, 10, 4, 'M'], [5, 8, 1, 'M'], [5, 7, 6, 'M'], [6, 6, 2, 'M'], [6, 6, 1, 'L'], [5, 5, 8, 'M'], [6, 4, 6, 'L'], [6, 3, 10, 'L'],
    // S 2–3
    [3, 9, 6, 'M'], [2, 8, 5, 'M'], [3, 10, 4, 'L'], [3, 7, 10, 'L'], [2, 2, 10, 'L'],
    // S 1
    [1, 10, 10, 'L'],
  ];
  for (const [s, o, d, expected] of cases) assert.equal(M.ap(s, o, d), expected, `S ${s} O ${o} D ${d}`);
  assert.equal(M.ap(9, 9, null), null);
  // The priority never falls when a rating gets worse.
  const rank = (s, o, d) => M.RANK[M.ap(s, o, d)];
  for (let s = 1; s <= 10; s++) for (let o = 1; o <= 10; o++) for (let d = 1; d <= 10; d++) {
    if (s < 10) assert.ok(rank(s + 1, o, d) >= rank(s, o, d), `S up from ${s},${o},${d}`);
    if (o < 10) assert.ok(rank(s, o + 1, d) >= rank(s, o, d), `O up from ${s},${o},${d}`);
    if (d < 10) assert.ok(rank(s, o, d + 1) >= rank(s, o, d), `D up from ${s},${o},${d}`);
  }
  // How the 1,000 combinations fall.
  const tally = { H: 0, M: 0, L: 0 };
  for (let s = 1; s <= 10; s++) for (let o = 1; o <= 10; o++) for (let d = 1; d <= 10; d++) tally[M.ap(s, o, d)] += 1;
  assert.equal(tally.H + tally.M + tally.L, 1000);
  assert.ok(tally.L > tally.M && tally.H > 0, JSON.stringify(tally));
});

test('the example: 12 modes, 2 high, 3 medium, 7 low, 8 open actions, RPN 1,644 down to 1,159', () => {
  const { FmeaMath: M } = load();
  const sheet = M.fromExample(readData().example, '2026-10-23');
  assert.equal(sheet.rows.length, 12);
  assert.equal(sheet.date, '2026-10-17', 'six days ago');
  assert.equal(sheet.rows[0].due, '2026-11-02', 'due in ten days');
  assert.equal(sheet.rows[5].due, '', 'no action, no date');
  const sum = M.summarize(sheet.rows, '2026-10-23');
  assert.deepEqual([sum.modes, sum.H, sum.M, sum.L, sum.unrated], [12, 2, 3, 7, 0]);
  assert.equal(sum.openActions, 8);
  assert.equal(sum.doneActions, 2);
  assert.equal(sum.withoutAction, 0);
  assert.equal(sum.reRated, 4);
  assert.equal(sum.rpnBefore, 1644);
  assert.equal(sum.rpnAfter, 1159);
  assert.ok(Math.abs(sum.reduction - 485 / 1644) < 1e-12);
  assert.equal(sum.top.mode, 'Parcels crushed in loading');
  // Action priority first, then RPN: the injury risk (189) comes before the medium rows of RPN 216 and 210.
  const order = M.sortRows(sheet.rows, 'ap').map((row) => [row.ap, row.rpn]);
  assert.deepEqual(plain(order.slice(0, 5)), [['H', 336], ['H', 189], ['M', 216], ['M', 210], ['M', 200]]);
  assert.deepEqual(plain(M.sortRows(sheet.rows, 'rpn').slice(0, 3).map((row) => row.rpn)), [336, 216, 210]);
  // By step: the four loading rows together, where loading first appears.
  const steps = M.sortRows(sheet.rows, 'step').map((row) => row.step);
  assert.deepEqual(plain(steps.slice(0, 5)), ['Loading', 'Loading', 'Loading', 'Loading', 'Labelling']);
  const injury = M.enrich(sheet.rows[7]);
  assert.equal(injury.ap, 'H');
  assert.equal(injury.rpn2, 90);
  assert.equal(injury.ap2, 'M', 'severity 9 stays: the re-rated row is still medium');
});

test('the heat map counts each S × O cell with its highest priority; the Pareto table is the modes by RPN', () => {
  const { FmeaMath: M } = load();
  const rows = M.fromExample(readData().example, '2026-10-23').rows;
  const cells = M.heatCells(rows);
  assert.equal([...cells.values()].reduce((s, c) => s + c.count, 0), 12);
  assert.deepEqual(plain({ count: cells.get('6-8').count, ap: cells.get('6-8').ap }), { count: 1, ap: 'H' });
  assert.equal(cells.get('5-4').count, 2, 'wrong label and inbound scan');
  assert.equal(cells.get('5-4').ap, 'L');
  const pareto = plain(M.paretoTable(rows, { source: 'FMEA', headers: ['Failure mode', 'Step', 'RPN'] }));
  assert.deepEqual(pareto.headers, ['Failure mode', 'Step', 'RPN']);
  assert.equal(pareto.rows.length, 12);
  assert.deepEqual(pareto.rows[0], ['Parcels crushed in loading', 'Loading', '336']);
  assert.deepEqual(pareto.map, { category: 0, count: -1, value: 2, date: -1, filter: 1 });
  assert.equal(pareto.measure, 'value');
});

test('a sheet from a file or from storage is rebuilt field by field', () => {
  const { FmeaMath: M } = load();
  assert.equal(M.cleanSheet(null), null);
  assert.equal(M.cleanSheet({ rows: 'x' }), null);
  const sheet = plain(M.cleanSheet({ process: 'Hub', date: '23.10.2026', rows: [{ id: 'a', mode: 'Late', s: 7, o: '4', d: 12, status: 'weird', due: '2026-11-01' }, 'junk', { id: 'a', mode: 'Twin' }] }));
  assert.equal(sheet.process, 'Hub');
  assert.equal(sheet.date, '', 'only ISO dates');
  assert.equal(sheet.rows.length, 2);
  assert.deepEqual([sheet.rows[0].s, sheet.rows[0].o, sheet.rows[0].d, sheet.rows[0].status, sheet.rows[0].due], [7, 4, null, 'open', '2026-11-01']);
  assert.notEqual(sheet.rows[1].id, 'a', 'a repeated id is replaced');
  const rows = plain(M.fromTemplate(readData().templates.find((t) => t.id === 'hotel')));
  assert.deepEqual(rows.map((row) => row.step), ['Check-in', 'Payment guarantee', 'Posting', 'Night audit']);
  assert.ok(rows.every((row) => row.s === null && row.mode === ''));
});

test('the data files share one shape, each language keeps its own saved work, and the example loads', () => {
  const en = readData('en');
  assert.equal(en.storageKey, 'sc-fmea');
  for (const lang of ['de', 'sq']) {
    const other = readData(lang);
    assert.equal(other.storageKey, `sc-fmea-${lang}`);
    assert.deepEqual(keysOf(other).sort(), keysOf(en).sort(), `${lang}: keys`);
    for (const scale of ['S', 'O', 'D']) assert.equal(other.scales[scale].levels.length, 10, `${lang}: ${scale}`);
    assert.deepEqual(other.templates.map((t) => [t.id, t.steps.length]), en.templates.map((t) => [t.id, t.steps.length]));
    assert.deepEqual(other.example.rows.map((r) => [r.s, r.o, r.d, r.s2, r.o2, r.d2, r.status, r.dueIn]), en.example.rows.map((r) => [r.s, r.o, r.d, r.s2, r.o2, r.d2, r.status, r.dueIn]), `${lang}: the example's numbers`);
    assert.equal(other.tips.length, en.tips.length);
    const { FmeaMath: M } = load(lang);
    const sum = M.summarize(M.fromExample(other.example, '2026-10-23').rows, '2026-10-23');
    assert.deepEqual([sum.H, sum.M, sum.L, sum.openActions], [2, 3, 7, 8], lang);
  }
  assert.match(JSON.stringify(readData('sq')), /[ëç]/);
  assert.match(JSON.stringify(readData('de')), /Sie /);
});

test('every text of the page and the script has a German and an Albanian translation in the parts file', () => {
  const parts = JSON.parse(fs.readFileSync('src/_data/i18n-parts/fmea.json', 'utf8'));
  const partial = fs.readFileSync('src/_includes/partials/fmea.njk', 'utf8');
  const script = fs.readFileSync('src/js/fmea.js', 'utf8');
  const texts = new Set();
  for (const match of partial.matchAll(/(["'])((?:(?!\1).)+)\1 \| t\(lang\)/g)) texts.add(match[2]);
  for (const match of script.matchAll(/\btx\(\s*(["'])((?:\\.|(?!\1).)+)\1/g)) texts.add(match[2].replace(/\\(["'])/g, '$1'));
  const ui = { de: JSON.parse(fs.readFileSync('src/_data/de/ui.json', 'utf8')), sq: JSON.parse(fs.readFileSync('src/_data/sq/ui.json', 'utf8')) };
  for (const lang of ['de', 'sq']) {
    for (const text of texts) assert.ok(parts[lang][text] || ui[lang][text], `${lang}: ${text}`);
    for (const [text, translation] of Object.entries(parts[lang])) {
      assert.ok(translation && (translation !== text || /^(Template|Status|Revision)$/.test(text)), `${lang}: "${text}" is not translated`);
      for (const name of text.match(/\{\w+\}/g) || []) assert.ok(translation.includes(name), `${lang}: "${text}" loses ${name}`);
    }
  }
  const cards = JSON.parse(fs.readFileSync('src/_data/i18n-parts/fmea.cards.json', 'utf8'));
  assert.equal(cards.family, 'lumen');
  assert.deepEqual(['en', 'de', 'sq'].map((lang) => cards.cards[lang].url), ['/tools/fmea/', '/de/tools/fmea/', '/sq/tools/fmea/']);
});

test('the page: the example on a first visit, the grid edits, removes with undo, and hands over', () => {
  const w = load('sq', { page: true });
  const doc = w.document;
  const results = doc.querySelector('[data-results]');
  assert.ok(!results.hidden, 'results on the example');
  assert.ok(!doc.querySelector('.dl-example-note').hidden);
  assert.equal(doc.querySelectorAll('[data-grid] tr').length, 12);
  assert.ok(results.querySelector('svg.ck-chart'), 'a chart');
  assert.equal(results.querySelectorAll('.ck-figure').length, 2, 'heat map and top 10');
  assert.match(results.querySelector('h2').textContent, /^2 /);
  // The first row of the grid is the high priority with the highest RPN; a rating changes its RPN in place.
  const first = doc.querySelector('[data-grid] tr');
  const selects = first.querySelectorAll('select.fm-rate');
  selects[2].value = '4';
  selects[2].dispatchEvent(new w.Event('change', { bubbles: true }));
  assert.equal(first.querySelector('[data-rpn]').textContent.trim(), '192', '6 × 8 × 4');
  assert.match(first.querySelector('[data-ap]').textContent, /^M /);
  assert.ok(doc.querySelector('.dl-example-note').hidden, 'an own change ends the example note');
  const saved = JSON.parse(w.localStorage.getItem('sc-fmea-sq'));
  assert.equal(saved.rows.find((r) => r.mode.length && r.d === 4 && r.o === 8).s, 6);
  // Filter by AP: one high row left.
  const apFilter = doc.querySelector('[data-filter-ap]');
  apFilter.innerHTML = '<option value=""></option><option value="H">H</option><option value="M">M</option><option value="L">L</option>';
  apFilter.value = 'H';
  apFilter.dispatchEvent(new w.Event('change', { bubbles: true }));
  assert.equal(doc.querySelectorAll('[data-grid] tr').length, 1);
  apFilter.value = '';
  apFilter.dispatchEvent(new w.Event('change', { bubbles: true }));
  // Duplicate, then remove and undo.
  doc.querySelector('[data-grid] tr .fm-dup').click();
  assert.equal(JSON.parse(w.localStorage.getItem('sc-fmea-sq')).rows.length, 13);
  doc.querySelector('[data-grid] tr .dl-remove').click();
  assert.equal(JSON.parse(w.localStorage.getItem('sc-fmea-sq')).rows.length, 12);
  doc.querySelector('[data-log-status] .dl-undo').click();
  assert.equal(JSON.parse(w.localStorage.getItem('sc-fmea-sq')).rows.length, 13);
  // Add a row.
  doc.querySelector('[data-add]').click();
  assert.equal(JSON.parse(w.localStorage.getItem('sc-fmea-sq')).rows.length, 14);
  // Hand-offs: the open actions to the tracker (once), the modes to Pareto.
  const button = [...results.querySelectorAll('button')].find((b) => /Action Tracker|Listën e veprimeve|veprime/i.test(b.textContent) && !/PNG|SVG/.test(b.textContent));
  assert.ok(button, 'the tracker button');
  button.click();
  const actions = plain(w.ActionsStore.list());
  assert.equal(actions.length, 8, 'the eight open actions; the duplicate repeats one title');
  assert.ok(actions.every((a) => a.source === 'fmea'));
  assert.equal(actions.filter((a) => a.priority === 'High').length, 1, 'the injury row; the crushed parcels row is now medium');
  assert.equal(actions.find((a) => a.priority === 'High').title, readData('sq').example.rows[7].action, 'the high one is the injury row\'s action');
  button.click();
  assert.equal(w.ActionsStore.list().length, 8, 'not twice');
  const pareto = [...results.querySelectorAll('a')].find((a) => a.href.endsWith('/sq/tools/pareto/'));
  assert.ok(pareto, 'the Pareto link stays in Albanian');
  pareto.dispatchEvent(new w.MouseEvent('click', { bubbles: true, cancelable: true }));
  const handoff = JSON.parse(w.sessionStorage.getItem('sc-pareto-handoff'));
  assert.equal(handoff.headers.length, 3);
  assert.equal(handoff.measure, 'value');
  assert.equal(handoff.rows.length, 13, 'every rated row; the new one has no RPN');
  const whys = [...results.querySelectorAll('a')].find((a) => a.pathname === '/sq/tools/five-whys/');
  assert.ok(whys && new w.URL(whys.href).searchParams.get('problem'), 'the top risk goes to 5 Whys');
});

test('the page with nothing stored and a coaching link opens empty', () => {
  const dom = new JSDOM(`<html lang="en"><body>${pageHtml('en')}</body></html>`, { url: 'https://example.test/tools/fmea/?coaching=p1', runScripts: 'outside-only', pretendToBeVisual: true });
  for (const file of ['tool-kit', 'chart-kit', 'actions-store', 'fmea']) dom.window.eval(fs.readFileSync(`src/js/${file}.js`, 'utf8'));
  assert.ok(dom.window.document.querySelector('[data-results]').hidden);
  assert.ok(!dom.window.document.querySelector('[data-log-empty]').hidden);
});
