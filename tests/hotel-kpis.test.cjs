// Hotel KPIs (src/js/hotel-kpis.js): occupancy, ADR, RevPAR and the rest of the arithmetic, the rows pasted from a PMS
// export, the example in three languages and the page that shows them.
process.env.TZ = 'Europe/Berlin';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const { JSDOM } = require('jsdom');
const nunjucks = require('nunjucks');

const plain = (value) => JSON.parse(JSON.stringify(value));
const read = (file) => JSON.parse(fs.readFileSync(file, 'utf8'));
const data = { en: read('src/_data/hotelKpis.json'), de: read('src/_data/de/hotelKpis.json'), sq: read('src/_data/sq/hotelKpis.json') };
const part = read('src/_data/i18n-parts/hotel-kpis.json');
const strings = (lang) => (lang === 'en' ? {} : { ...read(`src/_data/${lang}/ui.json`), ...part[lang] });
const close = (actual, expected, digits = 6) => assert.ok(Math.abs(actual - expected) < 10 ** -digits, `${actual} ≠ ${expected}`);

// The partial rendered the way the site renders it (the filters stubbed as in scripts/check-tool.mjs), without its
// <script src> tags: the test loads the scripts itself.
const pageHtml = (lang) => {
  const ui = strings(lang);
  const env = new nunjucks.Environment(new nunjucks.FileSystemLoader(['src/_includes']), { autoescape: false });
  env.addFilter('t', (text) => ui[text] ?? text);
  env.addFilter('local', (url) => (lang === 'en' ? url : `/${lang}${url}`));
  env.addFilter('assetUrl', (url) => url);
  env.addFilter('scriptJson', (value) => JSON.stringify(value).replace(/[<>&]/g, (c) => `\\u${c.charCodeAt(0).toString(16).padStart(4, '0')}`));
  const body = env.render('partials/hotel-kpis.njk', { cfg: data[lang], lang: lang === 'en' ? undefined : lang });
  return `<html lang="${lang}"><body>${body.replace(/<script src=[^>]*><\/script>/g, '')}</body></html>`;
};

const load = ({ lang = 'en', page = false, now = '2026-10-24T08:00:00Z', storage = {} } = {}) => {
  const url = `https://example.test${lang === 'en' ? '' : `/${lang}`}/tools/hotel-kpis/`;
  const dom = new JSDOM(page ? pageHtml(lang) : `<html lang="${lang}"><body></body></html>`, { url, runScripts: 'outside-only', pretendToBeVisual: true });
  const w = dom.window;
  w.eval(`(() => { const Real = Date; const fixed = new Real(${JSON.stringify(now)}); Date = class extends Real { constructor(...args) { super(...(args.length ? args : [fixed])); } static now() { return fixed.getTime(); } }; })();`);
  w.confirm = () => true;
  w.HTMLElement.prototype.scrollIntoView = () => {};
  Object.entries(storage).forEach(([key, value]) => w.localStorage.setItem(key, JSON.stringify(value)));
  if (lang !== 'en') w.UiStrings = strings(lang);
  for (const file of ['tool-kit', 'chart-kit', 'actions-store', 'hotel-kpis']) w.eval(fs.readFileSync(`src/js/${file}.js`, 'utf8'));
  return w;
};
// The log writes itself a moment after a change (ToolKit.logBook): a hidden page writes at once.
const flush = (w) => w.dispatchEvent(new w.Event('pagehide'));

const night = (date, sold, roomRev, extra = {}) => ({ date, available: 100, sold, roomRev, otherRev: 0, arrivals: 0, departures: 0, noShows: 0, walkIns: 0, ooo: 0, complaints: 0, covers: 0, cause: '', ...extra });

test('the three data files share their shape, and each language keeps its own log', () => {
  for (const lang of ['de', 'sq']) {
    const other = data[lang];
    assert.deepEqual(Object.keys(other).sort(), Object.keys(data.en).sort(), lang);
    assert.equal(other.storageKey, `sc-hotel-kpis-${lang}`);
    assert.deepEqual(Object.keys(other.text).sort(), Object.keys(data.en.text).sort(), `${lang} text`);
    assert.deepEqual(Object.keys(other.causes), Object.keys(data.en.causes), `${lang} causes`);
    assert.deepEqual(Object.keys(other.kpis), Object.keys(data.en.kpis), `${lang} kpis`);
    for (const key of ['weekdays', 'weekdaysLong', 'months', 'tips']) assert.equal(other[key].length, data.en[key].length, `${lang} ${key}`);
    assert.deepEqual(other.limits, data.en.limits);
    assert.deepEqual(other.example, data.en.example, `${lang}: the same example nights`);
  }
  assert.equal(data.en.storageKey, 'sc-hotel-kpis');
  for (const lang of ['en', 'de', 'sq']) {
    assert.deepEqual(Object.keys(data[lang].advice).sort(), Object.keys(data[lang].kpis).sort(), `${lang}: advice for every KPI`);
    Object.values(data[lang].advice).forEach((advice) => {
      assert.deepEqual(Object.keys(advice).sort(), ['action', 'check', 'meaning', 'moves', 'question']);
      assert.equal(advice.moves.length, 3);
    });
  }
  const w = load();
  assert.deepEqual(Object.keys(data.en.causes), plain(w.HotelKpisMath.CAUSES));
  assert.equal(w.HotelMath, w.HotelKpisMath);
});

test('occupancy, ADR, RevPAR, TRevPAR and the rates, of a night and of a month', () => {
  const M = load().HotelKpisMath;
  close(M.occupancy(144, 180), 0.8);
  close(M.adr(16200, 144), 112.5);
  close(M.revpar(16200, 180), 90);
  close(M.trevpar(16200, 1800, 180), 100);
  close(M.noShowRate(5, 95), 0.05, 9);
  close(M.oooShare(9, 180), 0.05);
  close(M.complaintsPer100(3, 150), 2);
  assert.equal(M.adr(0, 0), null, 'no room sold: no ADR');
  assert.equal(M.occupancy(10, 0), null);
  assert.equal(M.noShowRate(0, 0), null);
  const rows = [night('2026-10-01', 80, 8000, { otherRev: 1000, arrivals: 40, noShows: 2, ooo: 1, complaints: 1 }), night('2026-10-02', 60, 5400, { arrivals: 30, noShows: 3, ooo: 3, complaints: 2 })];
  const t = plain(M.totals(rows));
  assert.equal(t.days, 2);
  assert.equal(t.sold, 140);
  assert.equal(t.available, 200);
  const k = plain(M.kpis(t));
  close(k.occ, 0.7);
  close(k.adr, 13400 / 140);
  close(k.revpar, 67);
  close(k.trevpar, 72);
  close(k.noShowRate, 5 / 75);
  close(k.oooShare, 0.02);
  close(k.complaintsPer100, 300 / 140);
});

test('the budget, the calendar colour, the weekday averages, the best and worst night and the pickup', () => {
  const M = load().HotelKpisMath;
  assert.deepEqual(plain(M.budgetOf({ budgetOcc: '78', budgetAdr: '112', budgetRevpar: '' })), { occ: 0.78, adr: 112, revpar: 0.78 * 112, derived: true });
  assert.deepEqual(plain(M.budgetOf({ budgetOcc: '0.8', budgetAdr: '', budgetRevpar: '90' })), { occ: 0.8, adr: null, revpar: 90, derived: false });
  assert.deepEqual(plain(M.budgetOf({ budgetOcc: '78 %', budgetAdr: 'x', budgetRevpar: '' })), { occ: 0.78, adr: null, revpar: null, derived: false });
  assert.equal(M.dayState(0.78, 0.78), 'ok');
  assert.equal(M.dayState(0.70, 0.78), 'warn', 'within 10 points');
  assert.equal(M.dayState(0.67, 0.78), 'danger');
  assert.equal(M.dayState(0.5, null), 'muted', 'no budget, no verdict');
  assert.equal(M.dayState(null, 0.78), 'none');
  // 2026-10-05 is a Monday.
  assert.equal(M.weekday('2026-10-05'), 0);
  assert.equal(M.weekday('2026-10-11'), 6);
  const rows = [night('2026-10-05', 90, 10800), night('2026-10-06', 95, 11400), night('2026-10-12', 70, 7700), night('2026-10-10', 40, 3600)];
  const week = plain(M.weekdayAverages(rows));
  assert.equal(week.length, 7);
  assert.equal(week[0].n, 2);
  close(week[0].occ, 0.8, 9);
  close(week[0].adr, 18500 / 160);
  assert.equal(week[2].n, 0);
  assert.equal(week[2].occ, null);
  const bw = plain(M.bestWorst(rows));
  assert.equal(bw.best.row.date, '2026-10-06');
  assert.equal(bw.worst.row.date, '2026-10-10');
  close(bw.worst.revpar, 36);
  const pick = plain(M.pickup(rows, '2026-10-12'));
  assert.equal(pick.prevDate, '2026-10-05');
  assert.equal(pick.diff, -20);
  close(pick.revparDiff, 77 - 108);
  assert.equal(plain(M.pickup(rows, '2026-10-06')).diff, null, 'no night a week before');
  assert.equal(M.pickup(rows, '2026-10-20'), null);
});

test('the forecast fills the nights still to come with their weekday, and the leaks and gaps are priced in euros', () => {
  const M = load().HotelKpisMath;
  // October 2026 has 31 nights; logged: Monday 5th to Sunday 11th, every night 80 sold of 100 at €100, but Saturday 50.
  const rows = [];
  for (let d = 5; d <= 11; d++) rows.push(night(`2026-10-${String(d).padStart(2, '0')}`, d === 10 ? 50 : 80, (d === 10 ? 50 : 80) * 100));
  const fc = plain(M.forecast(rows, '2026-10', 100));
  assert.equal(fc.days, 31);
  assert.equal(fc.logged, 7);
  assert.equal(fc.filled, 24);
  assert.equal(fc.byWeekday, 24, 'every weekday has a night to copy');
  // 31 nights: 5 Saturdays (3, 10, 17, 24, 31) at 50, the other 26 at 80.
  close(fc.sold, 5 * 50 + 26 * 80);
  close(fc.available, 3100);
  close(fc.roomRev, fc.sold * 100);
  close(fc.adr, 100);
  assert.equal(M.forecast(rows, '2026-11', 100), null, 'nothing logged in November');
  // A night pasted twice keeps its latest figures, and counts once.
  const twice = [...rows, night('2026-10-05', 90, 9000)];
  assert.equal(M.dailyRows(twice).length, 7);
  assert.equal(M.dailyRows(twice)[0].sold, 90);

  const leak = plain(M.leaks([night('2026-10-01', 80, 8000, { noShows: 3, ooo: 2 }), night('2026-10-02', 0, 0, { noShows: 1, ooo: 4 })], 90));
  close(leak.noShows, 3 * 100 + 1 * 90, 9);
  close(leak.ooo, 2 * 100 + 4 * 90, 9);
  assert.equal(leak.noShowNights, 4);
  assert.equal(leak.oooNights, 6);

  assert.deepEqual(plain(M.causeTally([night('2026-10-01', 1, 1, { complaints: 2, cause: 'noise' }), night('2026-10-02', 1, 1, { complaints: 3, cause: 'noise' }), night('2026-10-03', 1, 1, { complaints: 1 })])), [{ key: 'noise', value: 5 }, { key: '', value: 1 }]);

  const limits = data.en.limits;
  // 1,000 rooms available, 700 sold at €100: 80 room nights short of a 78% budget, and 20 no-shows of 100 expected.
  const t = { available: 1000, sold: 700, roomRev: 70000, otherRev: 0, arrivals: 80, noShows: 20, ooo: 10, complaints: 7, days: 10 };
  const gaps = plain(M.gaps(t, { occ: 0.78, adr: 95, revpar: 74.1 }, limits));
  assert.equal(gaps[0].key, 'occupancy');
  close(gaps[0].euros, 8000);
  close(gaps.find((g) => g.key === 'noShows').euros, 1500, 6);
  assert.equal(gaps.find((g) => g.key === 'adr').euros, 0, 'ADR above budget');
  assert.equal(gaps.find((g) => g.key === 'ooo').euros, 0, '1% out of order is within the limit');
  assert.equal(gaps.find((g) => g.key === 'complaints').euros, 0);
});

test('rows pasted from a PMS export: any date format, decimal commas, the room total of the settings, causes by name', () => {
  const w = load({ lang: 'de' });
  const M = w.HotelKpisMath;
  const text = [
    'Datum\tVerfügbar\tVerkauft\tLogis\tSonstige\tAnreisen\tAbreisen\tNo-Shows\tWalk-ins\tOOO\tBeschwerden\tFrühstück\tUrsache',
    '22.10.2026\t180\t155\t17.386,67\t2.540,31\t96\t78\t4\t1\t2\t1\t118\tLärm',
    '2026-10-21\t\t172\t20971,65\t\t104\t103\t3\t0\t3\t2\t120\tsauber',
    '23.10.26\t180\t126\t12653,11\t2258,65\t66\t71\t3\t4\t3\t1\t102\tirgendwas',
    '24.10.2026\t180\t\t100\t\t\t\t\t\t\t\t\t',
  ].join('\n');
  const { added, skipped } = plain(M.importRows(text, data.de, 180));
  assert.equal(added.length, 3);
  assert.equal(skipped, 1, 'a night without rooms sold');
  assert.deepEqual(added[0], { date: '2026-10-22', available: 180, sold: 155, roomRev: 17386.67, otherRev: 2540.31, arrivals: 96, departures: 78, noShows: 4, walkIns: 1, ooo: 2, complaints: 1, covers: 118, cause: 'noise' });
  assert.equal(added[1].available, 180, 'empty: the rooms of the settings');
  assert.equal(added[1].otherRev, 0);
  assert.equal(added[1].cause, 'cleanliness', 'the start of a name is enough');
  assert.equal(added[2].date, '2026-10-23');
  assert.equal(added[2].cause, 'other', 'an unknown cause is other');
  assert.equal(plain(M.importRows('2026-10-21\t\t172\t100', data.de, 0)).added.length, 0, 'no rooms available and none in the settings');
  assert.equal(M.causeOf('Noise', data.sq), 'noise', 'the English names work on every page');
  assert.equal(M.causeOf('Pastërtia', data.sq), 'cleanliness');
  assert.equal(M.causeOf('', data.sq), '');
  assert.equal(M.cleanRow({ date: '2026-10-01', available: 180 }), null, 'a saved night without rooms sold is dropped');
  assert.equal(plain(M.cleanRow({ date: '2026-10-01', available: 180, sold: 120, roomRev: 1234.5, cause: 'gossip' })).cause, '');
  assert.equal(plain(M.cleanRow({ date: '2026-10-01', available: 180, sold: 120, roomRev: 1234.5 })).roomRev, 1234.5, 'a saved number stays a number on a German page');
});

test('the example in every language: six weeks of a 180-room hotel, the last night yesterday', () => {
  const en = plain(load().HotelKpisMath.exampleRows(data.en));
  assert.equal(en.length, 42);
  assert.equal(en.at(-1).date, '2026-10-23');
  assert.ok(en.every((row) => row.available === 180));
  for (const lang of ['de', 'sq']) {
    const rows = plain(load({ lang }).HotelKpisMath.exampleRows(data[lang]));
    assert.deepEqual(rows, en, lang);
  }
  // A visit weeks later moves the example forward by whole weeks.
  const later = plain(load({ now: '2026-12-02T08:00:00Z' }).HotelKpisMath.exampleRows(data.en));
  assert.equal(later.at(-1).date, '2026-11-27');
  assert.equal(load().HotelKpisMath.weekday(later.at(-1).date), load().HotelKpisMath.weekday('2026-10-23'), 'the weekdays stay');
  // The pattern the example is made to show: business weekdays above the weekend, a conference midweek.
  const M = load().HotelKpisMath;
  const week = plain(M.weekdayAverages(en));
  assert.ok(week[1].occ > 0.85 && week[5].occ < 0.6, 'Tuesday full, Saturday low');
  const best = plain(M.bestWorst(en)).best;
  assert.ok(['2026-10-06', '2026-10-07', '2026-10-08'].includes(best.row.date), 'the conference nights are the best');
});

test('a first visit opens on the example: the headline against budget, the calendar, the charts and where to start', () => {
  const w = load({ lang: 'sq', page: true });
  const doc = w.document;
  const results = doc.querySelector('[data-results]');
  assert.equal(results.hidden, false);
  assert.equal(doc.querySelector('.dl-example-note').hidden, false, 'the note says it is an example');
  assert.match(results.querySelector('.hk-month').textContent, /tetor 2026/);
  assert.match(results.querySelector('h2').textContent, /23 net në tetor 2026: RevPAR 91,57/);
  const stats = [...results.querySelectorAll('.dl-stat')].map((s) => s.textContent);
  assert.ok(stats.some((s) => /^Zënia78,8%/.test(s) && /▲ 0,8 pikë mbi buxhet/.test(s)), stats.join(' | '));
  assert.ok(stats.some((s) => /^ADR116,19/.test(s) && /▲/.test(s)), stats.join(' | '));
  assert.ok(stats.some((s) => /^RevPAR91,57/.test(s) && /buxheti = zënia × ADR/.test(s)));
  assert.ok(stats.some((s) => /^Shkalla e no-show5,8%/.test(s)));
  // The calendar: 23 nights logged, coloured against the budget of 78%.
  const calendar = results.querySelector('.hk-calendar .ck-chart');
  const cells = [...calendar.querySelectorAll('g.ck-hit')];
  assert.equal(cells.length, 31);
  assert.equal(cells.filter((g) => /e paregjistruar/.test(g.getAttribute('data-tip'))).length, 8, 'the 24th to the 31st');
  assert.match(cells[16].getAttribute('data-tip'), /Zënia 41,7%/, 'the 17th, the holiday weekend');
  assert.equal(cells[16].querySelector('text:last-child').textContent, '42 ✕');
  // The charts of the details: two lines, the weekdays, the revenue per night.
  assert.equal(results.querySelectorAll('.dl-details .ck-chart').length, 4);
  assert.ok(results.querySelector('.hk-night dl'), 'last night');
  assert.match(results.querySelector('.hk-pickup').textContent, /^▲ 1 dhomë më shumë se një javë më parë Pre, 16 tet: RevPAR 66,88\s€, tani 70,30\s€\.$/, '126 rooms against 125 the Friday before');
  // Where to start: the no-shows of the strike week.
  const focus = results.querySelector('.dl-focus');
  assert.match(focus.querySelector('h3').textContent, /^Shumë no-show/);
  const action = [...focus.querySelectorAll('a')].find((a) => /Shto te veprimet/.test(a.textContent));
  assert.ok(action, 'a countermeasure for the Action Tracker');
  action.addEventListener('click', (event) => event.preventDefault());
  action.dispatchEvent(new w.MouseEvent('click', { bubbles: true, cancelable: true }));
  const url = new URL(action.href);
  assert.equal(url.pathname, '/sq/tools/action-tracker/');
  assert.equal(url.searchParams.get('source'), 'hotel-kpis');
  assert.equal(url.searchParams.get('action'), data.sq.advice.noShows.action);
  const links = [...results.querySelectorAll('.result-actions a')].map((a) => a.href);
  assert.ok(links.some((href) => href.startsWith('https://example.test/sq/tools/five-whys/?problem=')), links.join(' '));
  assert.ok(links.includes('https://example.test/sq/tools/night-audit/'));
  assert.match(new URL(links.find((href) => href.includes('five-whys'))).searchParams.get('problem'), /nata më e dobët/);
  assert.equal(results.querySelector('.result-actions button').textContent, 'Kopjo raportin e mëngjesit');
});

test('hand-offs and the log: complaints to Pareto, the month moves, a night is added, replaced and saved', () => {
  const w = load({ lang: 'de', page: true });
  const doc = w.document;
  const results = doc.querySelector('[data-results]');
  const pareto = [...results.querySelectorAll('a')].find((a) => a.href.includes('/pareto/'));
  assert.ok(pareto.href.startsWith('https://example.test/de/tools/pareto/'));
  pareto.addEventListener('click', (event) => event.preventDefault());
  pareto.dispatchEvent(new w.MouseEvent('click', { bubbles: true, cancelable: true }));
  const handoff = JSON.parse(w.sessionStorage.getItem('sc-pareto-handoff'));
  assert.equal(handoff.template, 'guest-complaints');
  assert.equal(handoff.measure, 'count');
  assert.equal(handoff.headers[handoff.map.category], 'Ursache');
  assert.ok(handoff.rows.length > 10);
  assert.ok(handoff.rows.every((row) => row.length === 3 && Number(row[2]) > 0));
  assert.ok(handoff.rows.some((row) => row[1] === 'Lärm'));
  // The report is plain text with the KPIs of the month.
  results.querySelector('[data-month="-1"]').click();
  assert.match(results.querySelector('.hk-month').textContent, /September 2026/);
  assert.match(results.querySelector('h2').textContent, /19 Nächte im September 2026/);
  results.querySelector('[data-month="-1"]').click();
  assert.match(results.querySelector('h2').textContent, /Für August 2026 ist noch keine Nacht erfasst/);
  results.querySelector('[data-month="1"]').click();
  results.querySelector('[data-month="1"]').click();
  // A night of one's own replaces the example, with its settings.
  const form = doc.querySelector('[data-entry]');
  doc.querySelector('#hk-rooms').value = '120';
  doc.querySelector('#hk-rooms').dispatchEvent(new w.Event('input'));
  form.elements.date.value = '2026-10-23';
  form.elements.sold.value = '100';
  form.elements.roomRev.value = '10.500,50';
  form.elements.complaints.value = '2';
  form.elements.cause.value = 'billing';
  form.dispatchEvent(new w.Event('submit', { cancelable: true }));
  flush(w);
  let saved = JSON.parse(w.localStorage.getItem('sc-hotel-kpis-de'));
  assert.equal(saved.rows.length, 1);
  assert.equal(saved.rows[0].available, 120, 'the room total typed over the example');
  assert.equal(saved.rooms, '120', 'and it stays when the example leaves');
  assert.equal(saved.budgetOcc, '', 'the example budget leaves with the example');
  assert.equal(saved.rows[0].roomRev, 10500.5);
  assert.equal(doc.querySelector('.dl-example-note').hidden, true);
  // The same night again replaces it.
  form.elements.date.value = '2026-10-23';
  form.elements.sold.value = '90';
  form.elements.roomRev.value = '9000';
  form.dispatchEvent(new w.Event('submit', { cancelable: true }));
  flush(w);
  saved = JSON.parse(w.localStorage.getItem('sc-hotel-kpis-de'));
  assert.equal(saved.rows.length, 1);
  assert.deepEqual([saved.rows[0].sold, saved.rows[0].available, saved.rows[0].roomRev], [90, 120, 9000]);
  assert.match(doc.querySelector('[data-entry-status]').textContent, /ersetzt/);
  assert.deepEqual(Object.keys(saved.rows[0]).sort(), ['arrivals', 'available', 'cause', 'complaints', 'covers', 'date', 'departures', 'noShows', 'ooo', 'otherRev', 'roomRev', 'sold', 'walkIns']);
  assert.match(results.querySelector('h2').textContent, /1 Nacht im Oktober 2026: RevPAR 75,00/);
  assert.match(results.querySelector('.dl-warning').textContent, /Budget des Monats/, 'the example budget left with the example');
});
