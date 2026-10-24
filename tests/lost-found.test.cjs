// Lost & Found (src/js/lost-found.js): the keep-until rules, the flags of an item, the numbers of the register, the
// rows pasted from a spreadsheet, the reply to the guest and the page that shows them.
process.env.TZ = 'Europe/Berlin';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const { JSDOM } = require('jsdom');
const nunjucks = require('nunjucks');

const plain = (value) => JSON.parse(JSON.stringify(value));
const read = (file) => JSON.parse(fs.readFileSync(file, 'utf8'));
const data = { en: read('src/_data/lostFound.json'), de: read('src/_data/de/lostFound.json'), sq: read('src/_data/sq/lostFound.json') };
const part = read('src/_data/i18n-parts/lost-found.json');
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
  const body = env.render('partials/lost-found.njk', { cfg: data[lang], lang: lang === 'en' ? undefined : lang });
  return `<html lang="${lang}"><body>${body.replace(/<script src=[^>]*><\/script>/g, '')}</body></html>`;
};

const load = ({ lang = 'en', page = false, now = '2026-10-23T10:00:00Z', storage = {} } = {}) => {
  const url = `https://example.test${lang === 'en' ? '' : `/${lang}`}/tools/lost-found/`;
  const dom = new JSDOM(page ? pageHtml(lang) : `<html lang="${lang}"><body></body></html>`, { url, runScripts: 'outside-only', pretendToBeVisual: true });
  const w = dom.window;
  w.eval(`(() => { const Real = Date; const fixed = new Real(${JSON.stringify(now)}); Date = class extends Real { constructor(...args) { super(...(args.length ? args : [fixed])); } static now() { return fixed.getTime(); } }; })();`);
  w.confirm = () => true;
  w.print = () => { w.printed = (w.printed || 0) + 1; w.printedLabel = w.document.querySelector('.lf-label-sheet')?.textContent || ''; };
  w.HTMLElement.prototype.scrollIntoView = () => {};
  Object.entries(storage).forEach(([key, value]) => w.localStorage.setItem(key, JSON.stringify(value)));
  if (lang !== 'en') w.UiStrings = strings(lang);
  for (const file of ['tool-kit', 'chart-kit', 'workplace', 'actions-store', 'media-store', 'floor-capture', 'lost-found']) w.eval(fs.readFileSync(`src/js/${file}.js`, 'utf8'));
  return w;
};
// The log writes itself a moment after a change (ToolKit.logBook): a hidden page writes at once.
const flush = (w) => w.dispatchEvent(new w.Event('pagehide'));
const shape = (value) => (Array.isArray(value) ? value.length : value && typeof value === 'object' ? Object.keys(value).sort() : typeof value);

test('the three data files share their shape, and each language keeps its own register', () => {
  for (const lang of ['de', 'sq']) {
    const other = data[lang];
    assert.deepEqual(Object.keys(other).sort(), Object.keys(data.en).sort(), lang);
    assert.equal(other.storageKey, `sc-lost-found-${lang}`);
    for (const key of ['text', 'values', 'statuses', 'short', 'stepButtons', 'returnHow', 'paidBy', 'retention']) assert.deepEqual(shape(other[key]), shape(data.en[key]), `${lang} ${key}`);
    for (const key of ['areas', 'places', 'categories', 'tips']) assert.equal(other[key].length, data.en[key].length, `${lang} ${key}`);
    assert.deepEqual(other.categories.map((c) => [c.key, c.value, c.decision, Boolean(c.days)]), data.en.categories.map((c) => [c.key, c.value, c.decision, Boolean(c.days)]), `${lang} categories`);
    for (const channel of ['email', 'whatsapp']) assert.deepEqual(shape(other.replies[channel]), shape(data.en.replies[channel]), `${lang} ${channel}`);
    assert.equal(Object.keys(other.advice).length, Object.keys(data.en.advice).length, `${lang} advice`);
    assert.ok(other.places.includes(other.safe), `${lang}: the safe is a place`);
    assert.deepEqual(other.example.rows.map((row) => [row.date, row.time, row.category, row.value, row.tag, row.steps.map((s) => [s[0], s[1]]), row.delivery?.how || '']), data.en.example.rows.map((row) => [row.date, row.time, row.category, row.value, row.tag, row.steps.map((s) => [s[0], s[1]]), row.delivery?.how || '']), `${lang}: the same example`);
  }
  for (const lang of ['en', 'de', 'sq']) {
    const cfg = data[lang];
    Object.values(cfg.advice).forEach((advice) => assert.deepEqual(Object.keys(advice).sort(), ['meaning', 'moves', 'question']));
    Object.keys(cfg.advice).forEach((key) => assert.ok(key === 'default' || cfg.areas.includes(key), `${lang}: advice for ${key}`));
    cfg.example.rows.forEach((row, i) => {
      assert.ok(cfg.areas.includes(row.area), `${lang} row ${i} area ${row.area}`);
      assert.ok(cfg.places.includes(row.place), `${lang} row ${i} place ${row.place}`);
      if (row.value === 'high') assert.equal(row.place, cfg.safe, `${lang} row ${i}: high value is in the safe`);
    });
  }
  assert.equal(data.en.storageKey, 'sc-lost-found');
  assert.equal(data.en.example.rows.length, 25);
  assert.deepEqual(data.en.categories.map((c) => c.key), ['phone', 'documents', 'wallet', 'keys', 'jewellery', 'clothing', 'bag', 'glasses', 'toy', 'other']);
  const cards = read('src/_data/i18n-parts/lost-found.cards.json');
  assert.equal(cards.family, 'pulse');
  assert.equal(cards.cards.de.url, '/de/tools/lost-found/');
});

test('keep-until dates, flags and decisions follow the value and the category', () => {
  const M = load().LostFoundMath;
  const cfg = data.en;
  const r = plain(M.rules(cfg));
  assert.deepEqual(r, { low: 90, medium: 90, high: 180, docs: 7, followUp: 14, soon: 7 });
  assert.equal(M.rules(cfg, { retLow: '30', retHigh: 'x', retDocs: '0' }).low, 30, 'a typed setting wins');
  assert.equal(M.rules(cfg, { retHigh: 'x' }).high, 180, 'a wrong one falls back');
  assert.equal(M.rules(cfg, { retDocs: '0' }).docs, 7);
  const item = (patch) => M.cleanRow({ date: '2026-10-01', category: 'clothing', what: 'Jacket', steps: [], ...patch }, cfg);
  assert.equal(M.keepUntil(item({}), cfg, r), '2026-12-30', 'low value: 90 days');
  assert.equal(M.keepUntil(item({ category: 'jewellery' }), cfg, r), '2027-03-30', 'high value: 180 days');
  assert.equal(M.keepUntil(item({ category: 'documents' }), cfg, r), '2026-10-08', 'documents: 7 days');
  assert.equal(M.flagOf(item({ category: 'documents' }), '2026-10-09', cfg, r), 'over');
  assert.equal(M.flagOf(item({ category: 'documents' }), '2026-10-02', cfg, r), 'due', 'within the 7 days before the date');
  assert.equal(M.flagOf(item({}), '2026-10-20', cfg, r), 'ok');
  assert.equal(M.flagOf(item({ steps: [{ status: 'contacted', date: '2026-10-02' }] }), '2026-10-16', cfg, r), 'follow', 'contacted 14 days ago');
  assert.equal(M.flagOf(item({ steps: [{ status: 'returned', date: '2026-10-02' }] }), '2027-10-16', cfg, r), 'closed');
  assert.equal(M.decisionOf(item({ category: 'documents' }), 'over', cfg), 'police');
  assert.equal(M.decisionOf(item({}), 'over', cfg), 'charity');
  assert.equal(M.decisionOf(item({}), 'follow', cfg), 'contacted');
  // A value class of its own, a category unknown, steps out of order.
  const row = plain(M.cleanRow({ date: '2026-10-01', category: 'spaceship', value: 'priceless', steps: [{ status: 'returned', date: '2026-10-05' }, { status: 'contacted', date: '2026-10-02', by: ' Elena ' }, { status: 'stored', date: '2026-10-01' }], delivery: { how: 'post', postage: '6,99', paidBy: 'guest' } }, cfg));
  assert.equal(row.category, 'other');
  assert.equal(row.value, 'low', 'the category\'s own value');
  assert.deepEqual(row.steps, [{ status: 'contacted', date: '2026-10-02', by: 'Elena' }, { status: 'returned', date: '2026-10-05', by: '' }]);
  assert.equal(row.delivery.postage, 6.99);
  assert.equal(M.statusOf(row), 'returned');
  assert.equal(M.cleanRow({ category: 'keys' }, cfg), null, 'no date, no item');
});

test('the numbers of the example register on its last day', () => {
  const w = load();
  const M = w.LostFoundMath;
  const cfg = data.en;
  const rows = M.exampleRows(cfg, '2026-10-23');
  assert.equal(rows.length, 25);
  assert.equal(new Set(rows.map((row) => row.id)).size, 25, 'every id once');
  assert.match(rows[3].id, /^LF-261002-004$/);
  const r = M.rules(cfg);
  const s = plain(M.stats(rows, '2026-10-23', cfg, r));
  assert.equal(s.total, 25);
  assert.equal(s.open, 14);
  assert.equal(s.inSafe, 4);
  assert.equal(s.highOutside, 0);
  assert.equal(s.contacted, 3);
  assert.equal(s.over, 4, 'two old shelf items, an ID card and a wallet');
  assert.equal(s.due, 1, 'the card holder of today');
  assert.equal(s.follow, 1, 'the rain jacket, contacted 20 days ago');
  assert.equal(s.monthFound, 22);
  assert.equal(s.monthReturned, 8);
  const due = plain(M.dueList(rows, '2026-10-23', cfg, r));
  assert.deepEqual(due.map((item) => item.flag), ['over', 'over', 'over', 'over', 'due', 'follow']);
  assert.equal(due[0].row.what, 'Grey wool cardigan, size M', 'the longest over first');
  assert.deepEqual(plain(M.tally(rows, (row) => row.area))[0], { key: 'Guest room', value: 11 });
  const weeks = plain(M.weekly(rows, '2026-10-23'));
  assert.equal(weeks.length, 8, 'at most eight weeks');
  assert.equal(weeks.at(-1).week, '2026-10-19');
  assert.deepEqual(weeks.slice(-4).map((week) => [week.found, week.returned]), [[4, 1], [7, 3], [6, 3], [5, 1]]);
  assert.equal(M.mondayOf('2026-10-25'), '2026-10-19');
  // A later day moves the example forward by whole weeks.
  const later = M.exampleRows(cfg, '2026-11-12');
  assert.equal(later.at(-1).date, '2026-11-06');
  assert.equal(later[0].steps[0].date, '2026-10-29', 'the steps move with it');
});

test('rows pasted from Excel: names in the language or in English, status as one step, header skipped', () => {
  const w = load({ lang: 'de' });
  const M = w.LostFoundMath;
  const cfg = data.de;
  const text = [
    'Datum\tUhrzeit\tBereich\tZimmer\tKategorie\tBeschreibung\tWert\tGefunden von\tAufbewahrt in\tEtikett\tGast\tStatus',
    '20.10.2026\t13:10\tgästezimmer\t512\tKleidung\tTurnschuhe\tniedrig\tMaria\tregal b\t120\tFrau K. Weber\tGast kontaktiert',
    '2026-10-21\t9:05\tLobby / Rezeption\t\tphone\tPowerbank\t\tTomasz\tSafe\t121\t\tReturned',
    '2026-10-22\t\tShuttlebus\t\tDokumente\tReisepass\thoch\tAhmet\tSafe\t122\t\tirgendwas',
    'kein Datum\t\tHof',
  ].join('\n');
  const { added, skipped } = plain(M.importRows(text, cfg));
  assert.equal(added.length, 3);
  assert.equal(skipped, 1);
  assert.equal(added[0].area, 'Gästezimmer', 'known names keep their spelling');
  assert.equal(added[0].place, 'Regal B');
  assert.equal(added[0].category, 'clothing');
  assert.equal(added[0].value, 'low');
  assert.deepEqual(added[0].steps, [{ status: 'contacted', date: '2026-10-20', by: '' }]);
  assert.equal(added[1].time, '09:05');
  assert.equal(added[1].category, 'phone', 'the English key works on every page');
  assert.equal(added[1].value, 'high', 'no value: the category\'s');
  assert.equal(added[1].steps[0].status, 'returned');
  assert.equal(added[2].category, 'documents');
  assert.deepEqual(added[2].steps, [], 'an unknown status stays stored');
  assert.match(added[0].id, /^LF-261020-[A-Z2-9]{3}$/);
  assert.equal(M.newId('2026-10-20', new Set(), () => 0), 'LF-261020-AAA');
  assert.equal(M.newId('2026-10-20', new Set(['LF-261020-AAA']), () => 0), 'LF-261020-2', 'a taken id is never given twice');
});

test('the reply to the guest: email with a subject, WhatsApp in one paragraph, in the page language', () => {
  const M = load().LostFoundMath;
  const row = M.cleanRow({ id: 'LF-261020-K7Q', date: '2026-10-20', area: 'Guest room', room: '512', category: 'clothing', what: 'Pair of trainers, size 43', guest: 'Ms K. Weber', steps: [] }, data.en);
  const email = M.replyText(row, data.en, { channel: 'email', postage: 6.99, hotel: 'Airport Hotel', me: 'Elena', until: '2027-01-18', money: (n) => `€${n.toFixed(2)}` });
  const lines = email.split('\n');
  assert.equal(lines[0], 'Subject: An item found at Airport Hotel (LF-261020-K7Q)');
  assert.equal(lines[2], 'Dear Ms K. Weber,');
  assert.match(email, /found an item in room 512 on 2026-10-20 that may be yours: pair of trainers, size 43\./);
  assert.match(email, /tracked post for €6\.99/);
  assert.match(email, /until 2027-01-18\./);
  assert.deepEqual(lines.slice(-3), ['Kind regards,', 'Elena', 'Airport Hotel']);
  const anon = M.replyText({ ...row, guest: '', room: '', area: 'Lobby / reception' }, data.en, { channel: 'whatsapp' });
  assert.match(anon.split('\n')[0], /^Hello, this is the hotel\. We found an item in the lobby \/ reception on/);
  assert.match(anon, /tell you the postage first/, 'no postage: ask for the address first');
  const de = M.replyText(M.cleanRow({ ...row, area: 'Gästezimmer' }, data.de), data.de, { channel: 'email', postage: 6.99, lang: 'de', money: (n) => `${n.toFixed(2).replace('.', ',')} €` });
  assert.match(de, /^Betreff: Eine Fundsache – Ihr Hotel \(LF-261020-K7Q\)\n/);
  assert.ok(!de.trimEnd().endsWith('Ihr Hotel'), 'no hotel name, no hotel line under the greeting');
  assert.match(de, /hat am 2026-10-20 in Zimmer 512 einen Gegenstand gefunden, der Ihnen gehören könnte: Pair of trainers/);
  assert.match(de, /für 6,99 €/);
});

test('a first visit opens on the example: stats, the decision list, charts, focus and the register for print', () => {
  const w = load({ lang: 'sq', page: true });
  const doc = w.document;
  const results = doc.querySelector('[data-results]');
  assert.equal(results.hidden, false);
  assert.equal(doc.querySelector('.dl-example-note').hidden, false, 'the note says it is an example');
  assert.match(results.querySelector('h2').textContent, /^14 sende të hapura · 6 presin një vendim/);
  const stats = [...results.querySelectorAll('.dl-stat')].map((s) => s.textContent);
  assert.ok(stats.some((s) => /^Në kasafortë4/.test(s)), stats.join(' | '));
  assert.ok(stats.some((s) => /^Me afat të kaluar4/.test(s)));
  assert.ok(stats.some((s) => /^Kthyer këtë muaj36%8 nga 22/.test(s)), stats.join(' | '));
  assert.equal(results.querySelectorAll('.lf-due-list li').length, 6);
  assert.equal(results.querySelectorAll('.lf-due-list li.is-danger').length, 4);
  assert.ok(results.querySelectorAll('svg.ck-chart').length >= 3, 'two bar charts and the weekly line');
  assert.match(results.querySelector('.dl-focus h3').textContent, /^Dhoma e mysafirit/);
  assert.equal(results.querySelectorAll('.lf-register tbody tr').length, 25, 'the whole register for print');
  const tracker = [...results.querySelectorAll('.dl-focus a')].find((a) => a.textContent === 'Shto te veprimet');
  assert.ok(tracker);
  tracker.addEventListener('click', (event) => event.preventDefault());
  tracker.dispatchEvent(new w.MouseEvent('click', { bubbles: true, cancelable: true }));
  const url = new URL(tracker.href);
  assert.equal(url.pathname, '/sq/tools/action-tracker/');
  assert.equal(url.searchParams.get('source'), 'lost-found');
  assert.equal(url.searchParams.get('area'), 'Dhoma e mysafirit');
  assert.equal(url.searchParams.get('priority'), 'High');
  const whys = [...results.querySelectorAll('a')].find((a) => a.href.includes('/five-whys/'));
  assert.ok(whys.href.startsWith('https://example.test/sq/tools/five-whys/?problem='), whys.href);
  // The register on the page: 25 rows, flags in words.
  assert.equal(doc.querySelectorAll('[data-log] tr').length, 25);
  assert.match(doc.querySelector('[data-log]').textContent, /afati i kaluar/);
  // An item is chosen: its reply is in Albanian, with the hotel of the example.
  const reply = doc.querySelector('#lf-reply').value;
  assert.match(reply, /Airport Hotel \(shembull\)/);
  assert.match(reply, /^Subjekti: /);
});

test('a decision, a step with the post, the label, guest names forgotten, and a new item replaces the example', () => {
  const w = load({ page: true });
  const doc = w.document;
  const results = doc.querySelector('[data-results]');
  // The first due item is the cardigan: given to charity, with today and the name of the settings.
  const decide = results.querySelector('[data-decide]');
  assert.equal(decide.dataset.status, 'charity');
  const id = decide.dataset.decide;
  decide.click();
  flush(w);
  let saved = JSON.parse(w.localStorage.getItem('sc-lost-found'));
  const cardigan = saved.rows.find((row) => row.id === id);
  assert.deepEqual(cardigan.steps, [{ status: 'charity', date: '2026-10-23', by: 'Elena · Front office' }]);
  assert.equal(results.querySelectorAll('.lf-due-list li').length, 5);
  // Open the trainers of room 512 and send them by post.
  const trainers = saved.rows.find((row) => row.room === '512');
  doc.querySelector(`[data-log] [data-pick="${trainers.id}"]`).click();
  assert.equal(doc.querySelector('#lf-pick').value, trainers.id);
  const step = doc.querySelector('[data-step]');
  assert.equal(step.elements.step.value, 'returned', 'a contacted item goes back next');
  step.elements.how.value = 'post';
  step.elements.how.dispatchEvent(new w.Event('change', { bubbles: true }));
  assert.equal(doc.querySelector('[data-post-field]').hidden, false);
  step.elements.tracking.value = 'DHL 123';
  step.elements.stepPostage.value = '5.49';
  step.dispatchEvent(new w.Event('submit', { cancelable: true }));
  saved = JSON.parse(w.localStorage.getItem('sc-lost-found'));
  const sent = saved.rows.find((row) => row.id === trainers.id);
  assert.deepEqual(sent.steps.at(-1), { status: 'returned', date: '2026-10-23', by: 'Elena · Front office' });
  assert.deepEqual(sent.delivery, { how: 'post', tracking: 'DHL 123', postage: 5.49, paidBy: 'guest' });
  assert.match(doc.querySelector('[data-item-card]').textContent, /Sent by post · DHL 123/);
  // The reply on WhatsApp, and the label printed on its own.
  const channel = doc.querySelector('#lf-channel');
  channel.value = 'whatsapp';
  channel.dispatchEvent(new w.Event('change', { bubbles: true }));
  assert.match(doc.querySelector('#lf-reply').value, /^Hello Ms K\. Weber, this is Airport Hotel \(example\)\./);
  doc.querySelector('[data-label]').click();
  assert.equal(w.printed, 1);
  assert.match(w.printedLabel, /#120/);
  assert.match(w.printedLabel, new RegExp(trainers.id));
  w.dispatchEvent(new w.Event('afterprint'));
  assert.equal(doc.querySelector('.lf-label-sheet'), null, 'the label leaves after printing');
  // Guest names of closed items go; open ones stay.
  doc.querySelector('[data-forget]').click();
  flush(w);
  saved = JSON.parse(w.localStorage.getItem('sc-lost-found'));
  assert.ok(saved.rows.filter((row) => ['returned', 'police', 'charity', 'destroyed'].includes(row.steps.at(-1)?.status)).every((row) => !row.guest));
  assert.ok(saved.rows.some((row) => row.guest === 'Mr D. Okafor'), 'the wallet is still open');
  // CSV rows: a header and every item.
  // A new item while the example is shown replaces the example.
  const form = doc.querySelector('[data-entry]');
  form.elements.category.value = 'documents';
  form.elements.category.dispatchEvent(new w.Event('change'));
  assert.equal(form.elements.valueClass.value, 'high');
  assert.equal(form.elements.place.value, 'Safe', 'high value goes to the safe');
  form.elements.what.value = 'Swiss passport';
  form.elements.tag.value = '124';
  const pending = doc.querySelector('[data-new-id]').textContent;
  form.dispatchEvent(new w.Event('submit', { cancelable: true }));
  flush(w);
  saved = JSON.parse(w.localStorage.getItem('sc-lost-found'));
  assert.equal(saved.rows.length, 1);
  assert.equal(saved.rows[0].id, pending, 'the id shown in the form, so its photos stay with it');
  assert.equal(saved.rows[0].category, 'documents');
  assert.equal(saved.me, '', 'the example leaves with its settings');
  assert.notEqual(doc.querySelector('[data-new-id]').textContent, pending, 'the next item gets a new id');
  assert.equal(doc.querySelector('.dl-example-note').hidden, true);
  assert.match(results.querySelector('h2').textContent, /1 open item · 1 due for a decision/);
});
