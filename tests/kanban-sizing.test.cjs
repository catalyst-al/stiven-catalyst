// Kanban Sizing (src/js/kanban-sizing.js): the arithmetic in window.KanbanSizingMath against hand-worked values (z for
// the service levels, Toyota's formula, the statistical safety stock, the two-bin quantity, the maximum inventory and
// its value), the SKUs brought in from ABC/XYZ Inventory, the three data files and their example, and the page itself:
// the example on a first visit, the cards, the hand-off to the Action Tracker and the exports, in English and German.
process.env.TZ = 'Europe/Berlin';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const nunjucks = require('nunjucks');
const { JSDOM } = require('jsdom');

const plain = (value) => JSON.parse(JSON.stringify(value));
const near = (a, b, tolerance, message) => assert.ok(Math.abs(a - b) <= tolerance, `${message}: ${a} vs ${b}`);
const read = (file) => JSON.parse(fs.readFileSync(file, 'utf8'));
const DATA = { en: 'src/_data/kanbanSizing.json', de: 'src/_data/de/kanbanSizing.json', sq: 'src/_data/sq/kanbanSizing.json' };
const data = { en: read(DATA.en), de: read(DATA.de), sq: read(DATA.sq) };
const part = read('src/_data/i18n-parts/kanban-sizing.json');
const strings = (lang) => (lang === 'en' ? {} : { ...read(`src/_data/${lang}/ui.json`), ...part[lang] });
const TODAY = '2026-10-24';

const pageHtml = (lang) => {
  const ui = strings(lang);
  const env = new nunjucks.Environment(new nunjucks.FileSystemLoader(['src/_includes']), { autoescape: false });
  env.addFilter('t', (text) => ui[text] ?? text);
  env.addFilter('local', (url) => (lang === 'en' ? url : `/${lang}${url}`));
  env.addFilter('assetUrl', (url) => url);
  env.addFilter('scriptJson', (value) => JSON.stringify(value).replace(/[<>&]/g, (c) => `\\u${c.charCodeAt(0).toString(16).padStart(4, '0')}`));
  const body = env.render('partials/kanban-sizing.njk', { cfg: data[lang], lang: lang === 'en' ? undefined : lang });
  return `<html lang="${lang}"><body><main><h1>Kanban</h1>${body.replace(/<script src=[^>]*><\/script>/g, '')}</main></body></html>`;
};
const load = ({ lang = 'en', page = false, storage = {}, now = `${TODAY}T09:30:00Z` } = {}) => {
  const url = `https://example.test${lang === 'en' ? '' : `/${lang}`}/tools/kanban-sizing/`;
  const dom = new JSDOM(page ? pageHtml(lang) : `<html lang="${lang}"><body></body></html>`, { url, runScripts: 'outside-only', pretendToBeVisual: true });
  const w = dom.window;
  w.eval(`(() => { const Real = Date; const fixed = new Real(${JSON.stringify(now)}); Date = class extends Real { constructor(...args) { super(...(args.length ? args : [fixed])); } static now() { return fixed.getTime(); } }; })();`);
  w.confirm = () => true;
  w.printed = 0;
  w.print = () => { w.printed++; };
  w.HTMLElement.prototype.scrollIntoView = () => {};
  w.URL.createObjectURL = () => 'blob:test';
  w.URL.revokeObjectURL = () => {};
  w.downloads = [];
  w.TextEncoder = TextEncoder; // jsdom has none; the Excel file needs it.
  w.HTMLAnchorElement.prototype.click = function () { w.downloads.push(this.download); };
  Object.entries(storage).forEach(([key, value]) => w.localStorage.setItem(key, JSON.stringify(value)));
  if (lang !== 'en') w.UiStrings = strings(lang);
  for (const file of ['tool-kit', 'chart-kit', 'actions-store', 'kanban-sizing']) w.eval(fs.readFileSync(`src/js/${file}.js`, 'utf8'));
  return w;
};
const M = load().KanbanSizingMath;
const click = (w, node) => node.dispatchEvent(new w.MouseEvent('click', { bubbles: true, cancelable: true }));
const loop = (fields) => ({ part: 'X', type: 'kanban', demand: 0, sd: null, alpha: null, interval: 0, lead: 0, container: null, cost: 0, cards: null, ...fields });
const TOYOTA = { method: 'toyota', alpha: 0.1, service: 0.95, z: M.zFor(0.95) };
const STAT = { ...TOYOTA, method: 'stat' };

test('z for the usual service levels (inverse normal), as a share or a percent', () => {
  const expected = { 90: 1.2816, 95: 1.6449, 97.5: 1.96, 98: 2.0537, 99: 2.3263 };
  for (const [level, z] of Object.entries(expected)) {
    near(M.zFor(Number(level) / 100), z, 5e-5, `z at ${level} %`);
    near(M.zFor(Number(level)), z, 5e-5, `z at ${level} typed as percent`);
  }
  near(M.zFor(0.5), 0, 1e-9, 'z at 50 %');
  assert.deepEqual(plain(M.SERVICE_LEVELS), [90, 95, 97.5, 98, 99]);
  assert.ok(Number.isNaN(M.zFor(0)) && Number.isNaN(M.zFor(1)));
});

test('Toyota formula N = D × L × (1 + α) ÷ C, rounded up to whole cards', () => {
  // P-1001: 400 a day, L = 1 + 2 = 3 days, α = 10 %, C = 200: 400 × 3 × 1.1 ÷ 200 = 6.6 → 7 cards.
  assert.equal(M.leadTime(1, 2), 3);
  near(M.toyotaRaw({ demand: 400, lead: 3, alpha: 0.1, container: 200 }), 6.6, 1e-12, 'P-1001 raw');
  assert.equal(M.toyotaCards({ demand: 400, lead: 3, alpha: 0.1, container: 200 }), 7);
  // P-1003: 120 × 3 × 1.1 ÷ 50 = 7.92 → 8.
  assert.equal(M.toyotaCards({ demand: 120, lead: 3, alpha: 0.1, container: 50 }), 8);
  // P-1004: 6 × 7 × 1.1 ÷ 6 = 7.7 → 8.
  assert.equal(M.toyotaCards({ demand: 6, lead: 7, alpha: 0.1, container: 6 }), 8);
  // P-1008: 2 × 15 × 1.1 ÷ 4 = 8.25 → 9.
  assert.equal(M.toyotaCards({ demand: 2, lead: 15, alpha: 0.1, container: 4 }), 9);
  // An exact whole number stays: 100 × 2 × 1.2 ÷ 30 = 8 (8.000000000000002 in floating point).
  assert.equal(M.toyotaCards({ demand: 100, lead: 2, alpha: 0.2, container: 30 }), 8);
  // Without a safety factor: 50 × 4 ÷ 25 = 8.
  assert.equal(M.toyotaCards({ demand: 50, lead: 4, alpha: 0, container: 25 }), 8);
  assert.ok(Number.isNaN(M.toyotaCards({ demand: 50, lead: 4, alpha: 0, container: 0 })), 'no container, no cards');
});

test('statistical: SS = z × σd × √L and N = ⌈(D × L + SS) ÷ C⌉', () => {
  const z = M.zFor(0.95);
  // P-1001: SS = 1.64485 × 80 × √3 = 227.92; (1200 + 227.92) ÷ 200 = 7.14 → 8 cards.
  near(M.safetyStock({ z, sd: 80, lead: 3 }), 227.9178, 1e-3, 'P-1001 SS');
  near(M.statRaw({ demand: 400, lead: 3, sd: 80, z, container: 200 }), 7.1396, 1e-4, 'P-1001 raw');
  assert.equal(M.statCards({ demand: 400, lead: 3, sd: 80, z, container: 200 }), 8);
  // P-1002: SS = 1.64485 × 40 × √5 = 147.12; (750 + 147.12) ÷ 500 = 1.79 → 2.
  near(M.safetyStock({ z, sd: 40, lead: 5 }), 147.1198, 1e-3, 'P-1002 SS');
  assert.equal(M.statCards({ demand: 150, lead: 5, sd: 40, z, container: 500 }), 2);
  // At 99 %: SS = 2.32635 × 10 × √4 = 46.53; (100 + 46.53) ÷ 50 = 2.93 → 3.
  near(M.safetyStock({ z: M.zFor(0.99), sd: 10, lead: 4 }), 46.527, 1e-3, '99 % SS');
  assert.equal(M.statCards({ demand: 25, lead: 4, sd: 10, z: M.zFor(0.99), container: 50 }), 3);
  assert.equal(M.safetyStock({ z, sd: 0, lead: 9 }), 0, 'no spread, no safety stock');
});

test('two-bin quantity, maximum inventory and its value', () => {
  // P-1006: 25 a day, L = 3: Toyota SS = 0.1 × 75 = 7.5, each bin ≥ 82.5 → 83 units.
  assert.equal(M.twoBinQty({ demand: 25, lead: 3, ss: 7.5 }), 83);
  // Statistical: SS = 1.64485 × 6 × √3 = 17.09; 75 + 17.09 = 92.09 → 93.
  assert.equal(M.twoBinQty({ demand: 25, lead: 3, ss: M.safetyStock({ z: M.zFor(0.95), sd: 6, lead: 3 }) }), 93);
  assert.equal(M.twoBinQty({ demand: 10, lead: 2 }), 20);
  assert.equal(M.maxInventory(7, 200), 1400);
  near(M.inventoryValue(1400, 0.06), 84, 1e-9, '7 × 200 × 0.06 €');
  near(M.inventoryValue(M.maxInventory(8, 6), 14.9), 715.2, 1e-9, '8 × 6 × 14.90 €');
});

test('one loop sized: the change against the cards now, the status, the two-bin bin and the fallback to α', () => {
  const p1001 = plain(M.sizeLoop(loop({ part: 'P-1001', demand: 400, sd: 80, interval: 1, lead: 2, container: 200, cost: 0.06, cards: 6 }), TOYOTA));
  assert.equal(p1001.cards, 7);
  assert.equal(p1001.change, 1);
  assert.equal(p1001.maxUnits, 1400);
  near(p1001.value, 84, 1e-9, 'value');
  near(p1001.changeValue, 12, 1e-9, '+1 card × 200 × 0.06 €');
  assert.equal(p1001.status, 'short');
  assert.equal(plain(M.sizeLoop(loop({ demand: 150, interval: 1, lead: 4, container: 500, cost: 0.03, cards: 4 }), TOYOTA)).status, 'excess');
  assert.equal(plain(M.sizeLoop(loop({ demand: 120, interval: 1, lead: 2, container: 50, cards: 8 }), TOYOTA)).status, 'ok');
  assert.equal(plain(M.sizeLoop(loop({ demand: 2, interval: 5, lead: 10, container: 4 }), TOYOTA)).status, 'new');
  // The loop's own α wins: 400 × 3 × 1.25 ÷ 200 = 7.5 → 8.
  assert.equal(M.sizeLoop(loop({ demand: 400, alpha: 25, interval: 1, lead: 2, container: 200 }), TOYOTA).cards, 8);
  // Statistical with σd, and without it (back to α, and flagged).
  const stat = plain(M.sizeLoop(loop({ demand: 400, sd: 80, interval: 1, lead: 2, container: 200 }), STAT));
  assert.equal(stat.basis, 'stat');
  assert.equal(stat.cards, 8);
  const noSd = plain(M.sizeLoop(loop({ demand: 400, interval: 1, lead: 2, container: 200 }), STAT));
  assert.equal(noSd.basis, 'toyota');
  assert.equal(noSd.fallback, true);
  assert.equal(noSd.cards, 7);
  // Two-bin: bins of 100 hold the 83 needed; bins of 60 do not.
  const bin = plain(M.sizeLoop(loop({ type: 'twobin', demand: 25, interval: 1, lead: 2, container: 100, cost: 0.45, cards: 2 }), TOYOTA));
  assert.deepEqual([bin.cards, bin.binQty, bin.binUsed, bin.maxUnits, bin.status], [2, 83, 100, 200, 'ok']);
  near(bin.value, 90, 1e-9, '2 × 100 × 0.45 €');
  const small = plain(M.sizeLoop(loop({ type: 'twobin', demand: 25, interval: 1, lead: 2, container: 60, cost: 0.45, cards: 2 }), TOYOTA));
  assert.deepEqual([small.tooSmall, small.binUsed, small.maxUnits, small.status], [true, 83, 166, 'short']);
  // Missing figures: not sized, and not counted.
  const missing = plain(M.sizeLoop(loop({ demand: 10, lead: 3 }), TOYOTA));
  assert.equal(missing.status, 'incomplete');
  assert.equal(missing.cards, null);
});

test('settings: the method, α and the service level, with the defaults for what cannot be used', () => {
  const defaults = data.en.defaults;
  const s = plain(M.settingsOf({ method: 'stat', alpha: '15', service: '97.5' }, defaults));
  assert.equal(s.method, 'stat');
  near(s.alpha, 0.15, 1e-12, 'α');
  near(s.z, 1.96, 5e-5, 'z at 97.5 %');
  const bad = plain(M.settingsOf({ method: 'x', alpha: 'abc', service: '93' }, defaults));
  assert.equal(bad.method, 'toyota');
  near(bad.alpha, 0.1, 1e-12, 'default α');
  near(bad.service, 0.95, 1e-12, 'default service level');
  assert.deepEqual(bad.fixed, ['alpha', 'service']);
});

test('the example: 8 parts of a warehouse supermarket whose numbers add up', () => {
  const s = plain(M.settingsOf(data.en.example.settings, data.en.defaults));
  const r = plain(M.analyse(data.en.example.loops, s));
  assert.equal(r.items.length, 8);
  assert.deepEqual(r.items.map((item) => item.cards), [7, 2, 8, 8, 4, 2, 9, 9]);
  assert.deepEqual(r.items.map((item) => item.status), ['short', 'excess', 'ok', 'short', 'excess', 'ok', 'ok', 'new']);
  assert.equal(r.cards, 49);
  near(r.value, 84 + 30 + 552 + 715.2 + 153.6 + 90 + 855 + 792, 1e-6, 'value at maximum');
  // Seven loops have their cards now: 40 now and 40 needed, but +1 (P-1001) +2 (P-1004) −2 (P-1002) −1 (P-1005).
  assert.equal(r.compared, 7);
  assert.equal(r.currentCards, 40);
  assert.equal(r.change, 0);
  // +12 € (P-1001) −30 € (P-1002) +178.80 € (P-1004) −38.40 € (P-1005).
  near(r.changeValue, 122.4, 1e-6, 'value change');
  assert.equal(r.short.length, 2);
  assert.equal(r.excess.length, 2);
  // Statistical at 95 %: P-1001 8, P-1002 2, P-1003 9, P-1004 9, P-1005 5, P-1007 10, P-1008 10; the two-bin needs 93 a bin.
  const st = plain(M.analyse(data.en.example.loops, M.settingsOf({ ...data.en.example.settings, method: 'stat' }, data.en.defaults)));
  assert.deepEqual(st.items.map((item) => item.cards), [8, 2, 9, 9, 5, 2, 10, 10]);
  assert.equal(st.items[5].binQty, 93);
  // The cards: 49, seven A4 sheets of eight.
  const cards = plain(M.cardList(r.items));
  assert.equal(cards.length, 49);
  assert.deepEqual([cards[0].i, cards[0].n, cards[6].i, cards[7].item.part], [1, 7, 7, 'P-1002']);
  assert.deepEqual(plain(M.sheets(cards).map((sheet) => sheet.length)), [8, 8, 8, 8, 8, 8, 1]);
});

test('bring in from ABC/XYZ: demand per day, σd and the lead time from that tool\'s saved state', () => {
  const saved = {
    rows: [
      { sku: 'T-1', name: 'Tape', cost: 2, lt: 5, demand: [70, 84, 56, 70] },
      { sku: 'T-2', name: 'Film', cost: 10, lt: null, demand: [7, 7, 7, 7] },
      { sku: 'T-3', name: 'Dead', cost: 1, lt: 3, demand: [0, 0, 0, 0] },
    ],
    settings: { unit: 'week', leadTime: '14' },
  };
  const out = plain(M.abcLoops(saved, Number));
  // Weekly 70, 84, 56, 70: μ = 70 → D = 10 a day; s = √(392 ÷ 3) = 11.431 → σd = 11.431 ÷ √7 = 4.3205.
  assert.deepEqual(out.map((item) => item.part), ['T-1', 'T-2'], 'largest annual value first, no SKU without demand');
  near(out[0].demand, 10, 1e-12, 'D');
  near(out[0].sd, 4.3205, 1e-4, 'σd');
  assert.equal(out[0].lead, 5);
  assert.equal(out[1].lead, 14, 'the ABC default lead time');
  assert.equal(out[1].sd, 0);
  // Monthly columns: 365 ÷ 12 days each.
  near(plain(M.abcLoops({ rows: [{ sku: 'M', cost: 1, demand: [365, 365] }], settings: { unit: 'month' } }))[0].demand, 12, 1e-9, 'D from months');
  assert.deepEqual(plain(M.abcLoops(null)), []);
  assert.deepEqual(plain(M.abcLoops({ rows: 'x' })), []);
});

test('the three data files: one shape, the same numbers and keys, their own storage key', () => {
  const shape = (value) => (Array.isArray(value) ? value.map(shape) : value && typeof value === 'object'
    ? Object.fromEntries(Object.keys(value).sort().map((key) => [key, shape(value[key])])) : value === null ? 'null' : typeof value);
  assert.equal(data.en.storageKey, 'sc-kanban-sizing');
  for (const lang of ['de', 'sq']) {
    const other = data[lang];
    assert.equal(other.storageKey, `sc-kanban-sizing-${lang}`);
    assert.deepEqual(shape(other), shape(data.en), `${lang} shape`);
    assert.deepEqual(other.defaults, data.en.defaults);
    assert.deepEqual(other.example.settings, data.en.example.settings);
    assert.deepEqual(other.services.map((s) => s.value), data.en.services.map((s) => s.value));
    const numbers = (loops) => loops.map(({ name, location, source, ...rest }) => rest);
    assert.deepEqual(numbers(other.example.loops), numbers(data.en.example.loops), `${lang}: the example's numbers`);
    assert.ok(other.example.loops.filter((l, i) => l.name !== data.en.example.loops[i].name).length >= 7, `${lang}: names translated`);
    for (const key of ['short', 'excess', 'ok']) assert.equal(other.focus[key].moves.length, data.en.focus[key].moves.length);
    assert.equal(other.tips.length, data.en.tips.length);
    for (const [key, value] of Object.entries(other.text)) assert.ok(String(value).trim(), `${lang} text.${key}`);
  }
  assert.deepEqual(data.en.defaults, { method: 'toyota', alpha: 10, service: 95 });
  // Every string of the partial and the script has its translation.
  const js = fs.readFileSync('src/js/kanban-sizing.js', 'utf8');
  const njk = fs.readFileSync('src/_includes/partials/kanban-sizing.njk', 'utf8');
  const keys = new Set([...js.matchAll(/\btx\(\s*"((?:[^"\\]|\\.)*)"/g), ...njk.matchAll(/\{\{\s*"((?:[^"\\]|\\.)*)"\s*\|\s*t\(lang\)/g)].map((m) => JSON.parse(`"${m[1]}"`)));
  for (const lang of ['de', 'sq']) {
    const ui = strings(lang);
    assert.deepEqual([...keys].filter((key) => !(key in ui)), [], `${lang}: untranslated`);
  }
  const cards = read('src/_data/i18n-parts/kanban-sizing.cards.json');
  assert.equal(cards.family, 'lumen', 'the family of ABC/XYZ Inventory');
  assert.equal(cards.cards.de.url, '/de/tools/kanban-sizing/');
  assert.equal(cards.cards.sq.url, '/sq/tools/kanban-sizing/');
});

test('the page: a first visit opens on the example, with the result, the chart, the cards and the hand-offs', () => {
  const w = load({ page: true });
  const doc = w.document;
  const results = doc.querySelector('[data-results]');
  assert.equal(results.hidden, false);
  assert.equal(doc.querySelector('.dl-example-note').hidden, false, 'the example says so');
  assert.equal(w.localStorage.getItem('sc-kanban-sizing'), null, 'nothing saved before the visitor acts');
  assert.match(results.querySelector('.result-head h2').textContent, /49 kanban cards needed/);
  assert.ok(results.querySelector('svg.ck-chart'), 'the bar chart of the value');
  assert.equal(doc.querySelectorAll('[data-list] tr').length, 8);
  assert.match(doc.querySelector('[data-list] tr').textContent, /Too few cards/);
  // The cards: 49 in seven sheets, "Card 1 of 7" first.
  const cards = doc.querySelectorAll('[data-cards-preview] .ks-card');
  assert.equal(doc.querySelector('[data-cards]').hidden, false);
  assert.equal(cards.length, 49);
  assert.equal(doc.querySelectorAll('.ks-sheet').length, 7);
  assert.match(cards[0].textContent, /Card 1 of 7/);
  assert.match(cards[0].textContent, /P-1001/);
  const select = doc.querySelector('[data-cards-for]');
  select.value = 'ex4';
  select.dispatchEvent(new w.Event('change', { bubbles: true }));
  assert.equal(doc.querySelectorAll('[data-cards-preview] .ks-card').length, 8, 'only P-1004');
  click(w, doc.querySelector('[data-print-cards]'));
  assert.equal(w.printed, 1);
  // The Action Tracker gets the loops with too few cards.
  const action = [...results.querySelectorAll('.result-actions a')].find((a) => a.textContent === 'Add to actions');
  action.addEventListener('click', (event) => event.preventDefault());
  click(w, action);
  const url = new w.URL(action.href);
  assert.equal(url.pathname, '/tools/action-tracker/');
  assert.equal(url.searchParams.get('source'), 'kanban-sizing');
  assert.equal(url.searchParams.get('action'), 'Add kanban cards to 2 loops with too few');
  assert.match(url.searchParams.get('detail'), /P-1001.*6 cards now, 7 needed/);
  assert.match(url.searchParams.get('detail'), /P-1004/);
  click(w, doc.querySelector('[data-csv]'));
  click(w, doc.querySelector('[data-xlsx]'));
  assert.deepEqual(w.downloads, [`kanban-sizing-${TODAY}.csv`, `kanban-sizing-${TODAY}.xlsx`]);
  // The results are tall enough for the card preview.
  assert.ok(results.querySelectorAll('.dl-stat').length >= 6);
});

test('the page: a loop added by hand replaces nothing, saves, and ends the example; the method switch changes N', () => {
  const w = load({ page: true });
  const doc = w.document;
  const form = doc.querySelector('[data-form]');
  const set = (name, value) => { form.elements[name].value = value; };
  set('part', 'Z-9'); set('demand', '50'); set('interval', '1'); set('lead', '3'); set('container', '25'); set('cost', '2'); set('cards', '6');
  form.dispatchEvent(new w.Event('submit', { bubbles: true, cancelable: true }));
  const saved = JSON.parse(w.localStorage.getItem('sc-kanban-sizing'));
  assert.equal(saved.loops.length, 9);
  assert.equal(saved.example, '');
  assert.equal(doc.querySelector('.dl-example-note').hidden, true);
  // Z-9: 50 × 4 × 1.1 ÷ 25 = 8.8 → 9 cards, 3 more than the 6 now.
  const row = [...doc.querySelectorAll('[data-list] tr')].at(-1).textContent;
  assert.match(row, /Z-9/);
  assert.match(row, /9/);
  assert.match(row, /Too few cards/);
  const method = doc.querySelector('#ks-method');
  method.value = 'stat';
  method.dispatchEvent(new w.Event('change', { bubbles: true }));
  assert.match(doc.querySelector('[data-results] .result-head .kicker').textContent, /Statistical, 95 ?% service level/);
  assert.match(doc.querySelector('[data-results]').textContent, /without σd use Toyota's formula/, 'Z-9 has no σd');
  // A wrong entry is refused with a message.
  set('part', 'Z-10'); set('demand', '-3');
  form.dispatchEvent(new w.Event('submit', { bubbles: true, cancelable: true }));
  assert.equal(JSON.parse(w.localStorage.getItem('sc-kanban-sizing')).loops.length, 9);
  assert.match(doc.querySelector('[data-form-status]').textContent, /number of 0 or more/);
});

test('the page brings SKUs in from ABC/XYZ Inventory, read only', () => {
  const abc = { rows: [{ sku: 'T-1', name: 'Tape', cost: 2, lt: 5, ltSd: null, stock: null, picks: null, demand: [70, 84, 56, 70] }], periods: [], source: '', settings: { unit: 'week', leadTime: '14' }, example: {}, filter: 'all' };
  const w = load({ page: true, storage: { 'sc-inventory-abc': abc, 'sc-kanban-sizing': { loops: [], settings: {}, example: '', cardsFor: 'all' } } });
  const doc = w.document;
  const box = doc.querySelector('[data-abc]');
  assert.equal(box.hidden, false);
  const ticks = box.querySelectorAll('input[type=checkbox]');
  assert.equal(ticks.length, 1);
  ticks[0].checked = true;
  click(w, box.querySelector('[data-abc-add]'));
  const saved = JSON.parse(w.localStorage.getItem('sc-kanban-sizing'));
  assert.equal(saved.loops.length, 1);
  assert.equal(saved.loops[0].part, 'T-1');
  near(saved.loops[0].demand, 10, 1e-9, 'D');
  assert.equal(saved.loops[0].lead, 5);
  assert.equal(saved.loops[0].container, null, 'the container is for the visitor to enter');
  assert.match(doc.querySelector('[data-results]').textContent, /cannot be sized yet/);
  assert.deepEqual(JSON.parse(w.localStorage.getItem('sc-inventory-abc')), abc, 'the ABC/XYZ work is untouched');
  // Without ABC/XYZ work the box stays hidden.
  assert.equal(load({ page: true }).document.querySelector('[data-abc]').hidden, true);
});

test('the German page keeps its language in the hand-offs and its own storage', () => {
  const w = load({ lang: 'de', page: true });
  const results = w.document.querySelector('[data-results]');
  assert.match(results.querySelector('.result-head h2').textContent, /49 Kanban-Karten benötigt/);
  assert.match(w.document.querySelector('.ks-card').textContent, /Karte 1 von 7/);
  const action = [...results.querySelectorAll('.result-actions a')].find((a) => a.textContent === 'Zu den Maßnahmen');
  action.addEventListener('click', (event) => event.preventDefault());
  click(w, action);
  assert.equal(new w.URL(action.href).pathname, '/de/tools/action-tracker/');
  click(w, w.document.querySelector('[data-reset-settings]'));
  assert.ok(w.localStorage.getItem('sc-kanban-sizing-de'), 'the German work under its own key');
  assert.equal(w.localStorage.getItem('sc-kanban-sizing'), null);
});
