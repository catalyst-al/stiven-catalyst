// The Kaizen Board (src/js/kaizen-board.js): the arithmetic in window.KaizenMath, the three data files, and the page
// itself: the example on a first visit, a card moved with the arrows, edited and dropped inline, an idea added from the
// form, the next step handed to the Action Tracker and the A3 and 5 Whys links in the page's language.
process.env.TZ = 'Europe/Berlin';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const nunjucks = require('nunjucks');
const { JSDOM } = require('jsdom');

const plain = (value) => JSON.parse(JSON.stringify(value));
const read = (file) => JSON.parse(fs.readFileSync(file, 'utf8'));
const DATA = { en: 'src/_data/kaizenBoard.json', de: 'src/_data/de/kaizenBoard.json', sq: 'src/_data/sq/kaizenBoard.json' };
const KEYS = { en: 'sc-kaizen-board', de: 'sc-kaizen-board-de', sq: 'sc-kaizen-board-sq' };

// The partial rendered the way the site does it, with the filters stubbed (English text, no asset hashes).
const env = new nunjucks.Environment(new nunjucks.FileSystemLoader('src/_includes'), { autoescape: false });
env.addFilter('t', (text) => text);
env.addFilter('local', (url, lang) => (lang && lang !== 'en' ? `/${lang}${url}` : url));
env.addFilter('assetUrl', (url) => url);
env.addFilter('scriptJson', (value) => JSON.stringify(value).replace(/</g, '\\u003c'));
const partial = (lang) => env.render('partials/kaizen-board.njk', { cfg: read(DATA[lang]), lang: lang === 'en' ? undefined : lang })
  .replace(/<script src=[^>]*><\/script>/g, '');

const load = ({ lang = 'sq', page = true, now = '2026-10-23T10:00:00Z', storage = {} } = {}) => {
  const base = lang === 'en' ? '' : `/${lang}`;
  const html = `<html lang="${lang}"><body><main id="main">${page ? partial(lang) : ''}</main></body></html>`;
  const dom = new JSDOM(html, { url: `https://example.test${base}/tools/kaizen-board/`, runScripts: 'outside-only', pretendToBeVisual: true });
  const w = dom.window;
  w.eval(`(() => { const Real = Date; const fixed = new Real(${JSON.stringify(now)}); Date = class extends Real { constructor(...args) { super(...(args.length ? args : [fixed])); } static now() { return fixed.getTime(); } }; })();`);
  w.confirm = () => true;
  w.print = () => {};
  w.HTMLElement.prototype.scrollIntoView = () => {};
  Object.entries(storage).forEach(([key, value]) => w.localStorage.setItem(key, JSON.stringify(value)));
  for (const file of ['tool-kit', 'chart-kit', 'workplace', 'actions-store', 'kaizen-board']) w.eval(fs.readFileSync(`src/js/${file}.js`, 'utf8'));
  return w;
};
const saved = (w, key) => JSON.parse(w.localStorage.getItem(key));
const click = (w, node) => node.dispatchEvent(new w.MouseEvent('click', { bubbles: true }));
const submit = (w, form) => form.dispatchEvent(new w.Event('submit', { bubbles: true, cancelable: true }));
const cardOf = (w, title) => [...w.document.querySelectorAll('.kb-card')].find((card) => card.querySelector('.kb-card-title').textContent === title);
const columnOf = (w, card) => [...card.closest('.kb-column').classList].find((name) => name.startsWith('is-')).slice(3);

// The shape of a value: object keys and array lengths, not the words (they are translated).
const shape = (value) => (Array.isArray(value) ? value.map(shape) : value && typeof value === 'object'
  ? Object.fromEntries(Object.keys(value).sort().map((key) => [key, shape(value[key])])) : typeof value);

test('the three data files share one shape, the numbers of the example and their own storage key', () => {
  const en = read(DATA.en);
  assert.equal(en.storageKey, KEYS.en);
  for (const lang of ['de', 'sq']) {
    const other = read(DATA[lang]);
    assert.equal(other.storageKey, KEYS[lang], `${lang} keeps its own work`);
    const { example: a, quadrantAdvice: qa, ...restEn } = en;
    const { example: b, quadrantAdvice: qb, ...restOther } = other;
    assert.deepEqual(shape(restOther), shape(restEn), `${lang} shape`);
    assert.deepEqual(Object.keys(other.statuses), Object.keys(en.statuses), `${lang}: the status keys are not translated`);
    assert.deepEqual(Object.keys(qb), other.quadrants, `${lang}: advice for every quadrant, in order`);
    assert.equal(other.wastes.length, 10, 'the eight wastes, safety and customer');
    assert.equal(b.rows.length, a.rows.length);
    b.rows.forEach((row, i) => {
      const ref = a.rows[i];
      for (const name of ['by', 'date', 'effort', 'impact', 'saving', 'status', 'owner', 'moved', 'adopted', 'due']) assert.equal(row[name], ref[name], `${lang} row ${i} ${name}`);
      assert.equal(other.wastes.indexOf(row.waste), en.wastes.indexOf(ref.waste), `${lang} row ${i} waste`);
      assert.equal(other.areas.indexOf(row.area), en.areas.indexOf(ref.area), `${lang} row ${i} area`);
      for (const name of ['result', 'reason', 'next']) assert.equal(Boolean(row[name]), Boolean(ref[name]), `${lang} row ${i} ${name}`);
    });
  }
  assert.deepEqual(Object.keys(en.quadrantAdvice), en.quadrants);
  for (const cfg of Object.values(DATA).map(read)) {
    assert.equal(cfg.scales.effort.length, 5);
    assert.equal(cfg.scales.impact.length, 5);
    assert.equal(cfg.quadrants.length, 4);
  }
});

test('the example: 14 ideas over three months, several people, every column filled', () => {
  const ex = read(DATA.en).example.rows;
  assert.equal(ex.length, 14);
  assert.ok(new Set(ex.map((row) => row.by)).size >= 5, 'several people');
  const dates = ex.map((row) => row.date);
  assert.ok(Math.min(...dates) >= -92 && Math.min(...dates) <= -60, 'about three months back');
  assert.ok(Math.max(...dates) <= 0, 'nothing in the future');
  assert.deepEqual([...new Set(ex.map((row) => row.status))].sort(), ['act', 'check', 'do', 'dropped', 'idea', 'plan']);
  ex.filter((row) => row.status === 'dropped').forEach((row) => assert.ok(row.reason, 'a dropped idea says why'));
  ex.filter((row) => row.status === 'act').forEach((row) => assert.ok(row.result && row.adopted >= row.date, 'an adopted idea has a result'));
});

test('priority, the quadrants and the ranking of the open ideas', () => {
  const M = load({ page: false }).KaizenMath;
  assert.equal(M.priority(5, 1), 9);
  assert.equal(M.priority(1, 5), -3);
  assert.equal(M.priority(4, 3), 5);
  assert.equal(M.priority('9', 0), 9, 'the scales are clamped to 1–5');
  assert.deepEqual([[1, 5], [5, 5], [1, 1], [5, 1]].map(([e, i]) => M.quadrant(e, i)), [0, 1, 2, 3], 'quick wins, projects, fill-ins, thankless');
  assert.equal(M.quadrant(3, 3), 0, 'the middle counts as low effort and high impact');
  assert.equal(M.quadrant(4, 2), 3);
  assert.deepEqual([1, 3, 5].map(M.matrixPos), [0, 5, 10]);
  const seen = new Map();
  assert.deepEqual(plain(M.spread(2, 4, seen)), { x: 2.5, y: 7.5 });
  assert.deepEqual(plain(M.spread(2, 4, seen)), { x: 2.95, y: 7.05 }, 'a second idea on the same scores moves aside');
  const rows = [
    { title: 'a', status: 'idea', impact: 4, effort: 3, saving: 100 },
    { title: 'b', status: 'plan', impact: 3, effort: 1, saving: '' },
    { title: 'c', status: 'act', impact: 5, effort: 1, saving: 900 },
    { title: 'd', status: 'check', impact: 4, effort: 3, saving: 300 },
    { title: 'e', status: 'dropped', impact: 5, effort: 1 },
    { title: 'f', status: 'do', impact: 2, effort: 4 },
  ];
  const ranking = plain(M.ranking(rows));
  assert.deepEqual(ranking.map((r) => `${r.row.title}${r.score}`), ['d5', 'a5', 'b5', 'f0'], 'open only; ties go to impact, then saving');
});

test('the review numbers on the example board', () => {
  const w = load({ lang: 'en', page: false });
  const M = w.KaizenMath;
  const today = '2026-10-23';
  const rows = read(DATA.en).example.rows.map((row) => {
    const copy = { ...row };
    ['date', 'moved', 'adopted', 'due'].forEach((name) => { if (typeof copy[name] === 'number') copy[name] = w.ToolKit.addDays(today, copy[name]); });
    return copy;
  });
  assert.deepEqual(plain(M.adoption(rows)), { adopted: 6, total: 14, rate: 6 / 14 });
  assert.equal(M.averageLead(rows), 27.5);
  assert.equal(M.averageLead([{ status: 'idea', date: today }]), null);
  assert.deepEqual(plain(M.savings(rows)), { month: 1240, year: 14880 });
  assert.equal(M.thisMonth(rows, today), 4);
  assert.deepEqual(plain(M.lastMonths(today)), ['2026-05', '2026-06', '2026-07', '2026-08', '2026-09', '2026-10']);
  assert.deepEqual(plain(M.lastMonths('2026-02-10', 3)), ['2025-12', '2026-01', '2026-02'], 'across the new year');
  assert.deepEqual(plain(M.adoptedPerMonth(rows, today)).map((m) => m.value), [0, 0, 0, 2, 3, 1]);
  assert.deepEqual(plain(M.perPerson(rows)).map((p) => `${p.key}${p.value}`), ['Jonas3', 'Marco3', 'Anna2', 'Dritan2', 'Elena2', 'Fatima2']);
  const waste = plain(M.byWaste(rows, read(DATA.en).wastes));
  assert.equal(waste.length, 10);
  assert.deepEqual(waste.find((item) => item.waste === 'Defects'), { waste: 'Defects', open: 0, act: 1, dropped: 1 });
  assert.deepEqual(waste.find((item) => item.waste === 'Waiting'), { waste: 'Waiting', open: 2, act: 1, dropped: 0 });
  assert.equal(M.ideaOfMonth(rows).title, 'Second scanner at the returns bench', 'the only idea adopted in the latest month');
  assert.equal(M.ideaOfMonth(rows.filter((row) => row.status !== 'act')), null);
  assert.equal(M.daysInColumn({ moved: '2026-10-20' }, today), 3);
  assert.equal(M.ranking(rows)[0].row.title, 'Standard work for truck check-in');
});

test('a first visit opens on the example: six columns, the matrix, the numbers and the idea of the month', () => {
  const w = load({ lang: 'sq' });
  const d = w.document;
  const cfg = read(DATA.sq);
  const results = d.querySelector('[data-results]');
  assert.equal(results.hidden, false);
  assert.equal(d.querySelectorAll('.kb-column').length, 6);
  assert.equal(d.querySelectorAll('.kb-card').length, 14);
  assert.equal(d.querySelector('.kb-column.is-act .kb-column-count').textContent, '6');
  assert.equal(d.querySelector('.dl-example-note').hidden, false, 'the note says it is an example');
  assert.equal(w.localStorage.getItem(KEYS.sq), null, 'nothing is saved until the visitor acts');
  assert.ok(d.querySelectorAll('.ck-figure svg').length >= 3, 'matrix, months and wastes');
  const matrix = d.querySelector('.ck-figure svg');
  assert.equal(matrix.querySelectorAll('circle').length, 7, 'one dot per open idea');
  assert.ok(matrix.textContent.includes(cfg.quadrants[0].toUpperCase()));
  assert.match(d.querySelector('.kb-focus').textContent, /Skaner i dytë/);
  assert.equal(d.querySelectorAll('.dl-stat').length, 4);
  assert.match(d.querySelector('.dl-stats').textContent, /1\.240,00\s€/);
  assert.equal(d.querySelector('[data-areas]').children.length, cfg.areas.length, 'the tool areas without a workplace profile');
});

test('the arrows move a card one column, keep focus on it and save', () => {
  const w = load({ lang: 'sq' });
  const title = 'Kufje në vend të radios për drejtuesin e portës';
  let card = cardOf(w, title);
  assert.equal(columnOf(w, card), 'idea');
  assert.equal(card.querySelector('[data-action="back"]').disabled, true, 'Idea is the first column');
  click(w, card.querySelector('[data-action="forward"]'));
  card = cardOf(w, title);
  assert.equal(columnOf(w, card), 'plan');
  assert.equal(w.document.activeElement, card.querySelector('[data-action="forward"]'), 'the keyboard stays on the card');
  const row = saved(w, KEYS.sq).rows.find((r) => r.title === title);
  assert.equal(row.status, 'plan');
  assert.equal(row.moved, '2026-10-23');
  click(w, card.querySelector('[data-action="back"]'));
  assert.equal(columnOf(w, cardOf(w, title)), 'idea');
  // Check to Adopted stamps the adoption date.
  const checking = 'Karrocat e mbledhjes të renditura paraprakisht sipas zonës';
  click(w, cardOf(w, checking).querySelector('[data-action="forward"]'));
  const adopted = saved(w, KEYS.sq).rows.find((r) => r.title === checking);
  assert.equal(adopted.status, 'act');
  assert.equal(adopted.adopted, '2026-10-23');
  assert.equal(cardOf(w, checking).querySelector('[data-action="forward"]').disabled, true, 'Adopted is the last column');
});

test('inline edit: change the scores and drop the idea with a reason, then reopen it', () => {
  const w = load({ lang: 'de' });
  const title = 'Headset statt Funkgerät für den Torleiter';
  click(w, cardOf(w, title).querySelector('[data-action="edit"]'));
  let form = cardOf(w, title).querySelector('.kb-edit');
  assert.ok(form, 'the form opens inside the card');
  assert.equal(cardOf(w, title).querySelector('[data-action="edit"]').getAttribute('aria-expanded'), 'true');
  form.elements.impact.value = '5';
  form.elements.effort.value = '1';
  submit(w, form);
  let row = saved(w, KEYS.de).rows.find((r) => r.title === title);
  assert.deepEqual([row.impact, row.effort, row.status], [5, 1, 'idea']);
  assert.equal(cardOf(w, title).querySelector('.kb-score').textContent, '9');
  // Drop: the card moves to Dropped and the reason field is open at once.
  click(w, cardOf(w, title).querySelector('[data-action="drop"]'));
  assert.equal(columnOf(w, cardOf(w, title)), 'dropped');
  form = cardOf(w, title).querySelector('.kb-edit');
  assert.equal(w.document.activeElement, form.elements.reason);
  form.elements.reason.value = 'Funk reicht nach dem neuen Dienstplan.';
  submit(w, form);
  row = saved(w, KEYS.de).rows.find((r) => r.title === title);
  assert.equal(row.status, 'dropped');
  assert.equal(row.reason, 'Funk reicht nach dem neuen Dienstplan.');
  assert.match(cardOf(w, title).textContent, /Funk reicht/);
  click(w, cardOf(w, title).querySelector('[data-action="forward"]'));
  row = saved(w, KEYS.de).rows.find((r) => r.title === title);
  assert.deepEqual([row.status, row.reason], ['idea', ''], 'reopened, the reason goes');
});

test('the A3 and 5 Whys links keep the language and carry the idea; the plan hands its next step to the tracker', () => {
  const w = load({ lang: 'sq' });
  const title = 'Kartë kanban për porosinë e filmit mbështjellës';
  click(w, cardOf(w, title).querySelector('[data-action="edit"]'));
  const links = [...cardOf(w, title).querySelectorAll('.kb-links a')].map((a) => new URL(a.href));
  assert.deepEqual(links.map((u) => u.pathname), ['/sq/tools/a3-report/', '/sq/tools/five-whys/']);
  links.forEach((u) => assert.equal(u.searchParams.get('problem'), title));
  const whys = [...w.document.querySelectorAll('.result-actions a')].map((a) => new URL(a.href)).find((u) => u.pathname.endsWith('/five-whys/'));
  assert.equal(whys.pathname, '/sq/tools/five-whys/');
  assert.equal(whys.searchParams.get('problem'), 'Puna standarde për regjistrimin e kamionëve', 'the top of the ranking');
  // Only planned ideas offer the hand-off.
  assert.equal(cardOf(w, 'Skaner i dytë në tavolinën e kthimeve').querySelector('[data-action="action"]'), null);
  click(w, cardOf(w, title).querySelector('[data-action="action"]'));
  const actions = saved(w, 'sc-actions').rows;
  assert.equal(actions.length, 1);
  const action = plain(actions[0]);
  assert.equal(action.title, 'Bie dakord me prokurimin për pikën e riporosisë.');
  assert.equal(action.source, 'kaizen-board');
  assert.equal(action.owner, 'Jonas');
  assert.equal(action.due, '2026-11-06');
  assert.equal(action.area, 'Ngarkimi');
  assert.match(action.detail, /Kartë kanban/);
  const status = w.document.querySelector('[data-status]');
  assert.equal(new URL(status.querySelector('a').href).pathname, '/sq/tools/action-tracker/');
});

test('a new idea from the form replaces the example; damaged saved data is cleaned; workplace areas are offered', () => {
  const w = load({ lang: 'en', storage: { 'sc-workplace': { areas: [{ name: 'Dock 7', owner: 'Anna' }] } } });
  const d = w.document;
  assert.deepEqual([...d.querySelectorAll('[data-areas] option')].map((o) => o.value), ['Dock 7']);
  const f = d.querySelector('[data-entry]').elements;
  submit(w, d.querySelector('[data-entry]'));
  assert.equal(d.querySelector('[data-entry-status]').textContent, 'Write the idea first.');
  f.title.value = 'Label the empty roll cages';
  f.waste.value = 'Motion';
  f.area.value = 'Dock 7';
  f.by.value = 'Sara';
  f.effort.value = '1';
  f.impact.value = '4';
  f.saving.value = '75';
  submit(w, d.querySelector('[data-entry]'));
  const state = saved(w, KEYS.en);
  assert.equal(state.rows.length, 1, 'the example is gone');
  assert.deepEqual(plain(state.rows[0]), { ...plain(state.rows[0]), title: 'Label the empty roll cages', waste: 'Motion', area: 'Dock 7', by: 'Sara', date: '2026-10-23', effort: 1, impact: 4, saving: 75, status: 'idea', moved: '2026-10-23', adopted: '' });
  assert.equal(d.querySelector('.dl-example-note').hidden, true);
  assert.equal(d.querySelectorAll('.kb-card').length, 1);

  const damaged = load({ lang: 'en', storage: { [KEYS.en]: { rows: [null, { title: '' }, { title: 'Keep', status: 'nope', effort: 9, impact: 'x', date: 'soon', saving: '-4' }, { title: 'Late', status: 'do', due: '2026-10-01', date: '2026-09-01' }], example: {} } } });
  const rows = [...damaged.document.querySelectorAll('.kb-card')];
  assert.equal(rows.length, 2);
  assert.match(cardOf(damaged, 'Late').querySelector('.ck-chip.is-warn').textContent, /Overdue/, 'a late card says so in words');
  assert.equal(columnOf(damaged, rows[0]), 'idea');
  assert.equal(rows[0].querySelector('.kb-score').textContent, String(3 * 2 - 5));
});

test('copy summary, CSV header first, and clearing the board', async () => {
  const w = load({ lang: 'en' });
  const d = w.document;
  let copied = '';
  Object.defineProperty(w.navigator, 'clipboard', { value: { writeText: async (text) => { copied = text; } }, configurable: true });
  click(w, d.querySelector('.result-actions .button-primary'));
  await new Promise((resolve) => setTimeout(resolve, 20));
  assert.match(copied, /^Kaizen Board \| Stiven Catalyst/);
  assert.match(copied, /Adopted: 6 \/ 14/);
  assert.match(copied, /Idea of the month: Second scanner at the returns bench \(Elena\)/);
  let blob = null;
  w.URL.createObjectURL = (made) => { blob = made; return 'blob:x'; };
  w.URL.revokeObjectURL = () => {};
  w.HTMLAnchorElement.prototype.click = () => {};
  click(w, d.querySelector('[data-csv]'));
  assert.ok(blob, 'a file was made');
  const csv = await new Promise((resolve) => { const reader = new w.FileReader(); reader.onload = () => resolve(reader.result); reader.readAsText(blob); });
  assert.match(csv.replace(/^﻿/, ''), /^Idea[;,]What it removes[;,]Area/);
  assert.equal(csv.trim().split(/\r?\n/).length, 15);
  click(w, d.querySelector('[data-clear]'));
  assert.equal(d.querySelector('[data-results]').hidden, true);
  assert.equal(d.querySelector('[data-empty]').hidden, false);
  assert.deepEqual(saved(w, KEYS.en).rows, []);
  click(w, d.querySelector('[data-example]'));
  assert.equal(d.querySelectorAll('.kb-card').length, 14);
});
