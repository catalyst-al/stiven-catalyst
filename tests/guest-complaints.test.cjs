// Guest Complaints (src/js/guest-complaints.js): complaints per 100 occupied room nights, the time to resolve and its
// median, the share resolved within target, repeat rooms, the cost of recovery, satisfaction, the Pareto, guest names
// removed, the reply to the guest and the page that shows them. The numbers are worked out by hand from the example
// of the data file (25 complaints in two weeks of a 150-room airport hotel, 1,813 occupied room nights).
process.env.TZ = 'Europe/Berlin';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const { JSDOM } = require('jsdom');
const nunjucks = require('nunjucks');

const plain = (value) => JSON.parse(JSON.stringify(value));
const read = (file) => JSON.parse(fs.readFileSync(file, 'utf8'));
const data = { en: read('src/_data/guestComplaints.json'), de: read('src/_data/de/guestComplaints.json'), sq: read('src/_data/sq/guestComplaints.json') };
const part = read('src/_data/i18n-parts/guest-complaints.json');
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
  const body = env.render('partials/guest-complaints.njk', { cfg: data[lang], lang: lang === 'en' ? undefined : lang });
  return `<html lang="${lang}"><body>${body.replace(/<script src=[^>]*><\/script>/g, '')}</body></html>`;
};

// 2026-10-23 12:00 in Frankfurt: five days after the last day of the example, which therefore stays where it is.
const NOW = '2026-10-23T10:00:00Z';
const load = ({ lang = 'en', page = false, now = NOW, storage = {} } = {}) => {
  const url = `https://example.test${lang === 'en' ? '' : `/${lang}`}/tools/guest-complaints/`;
  const dom = new JSDOM(page ? pageHtml(lang) : `<html lang="${lang}"><body></body></html>`, { url, runScripts: 'outside-only', pretendToBeVisual: true });
  const w = dom.window;
  w.eval(`(() => { const Real = Date; const fixed = new Real(${JSON.stringify(now)}); Date = class extends Real { constructor(...args) { super(...(args.length ? args : [fixed])); } static now() { return fixed.getTime(); } }; })();`);
  w.confirm = () => true;
  w.print = () => {};
  w.HTMLElement.prototype.scrollIntoView = () => {};
  Object.entries(storage).forEach(([key, value]) => w.localStorage.setItem(key, JSON.stringify(value)));
  if (lang !== 'en') w.UiStrings = strings(lang);
  for (const file of ['tool-kit', 'chart-kit', 'workplace', 'actions-store', 'guest-complaints']) w.eval(fs.readFileSync(`src/js/${file}.js`, 'utf8'));
  return w;
};
// The log writes itself a moment after a change (ToolKit.logBook): a hidden page writes at once.
const flush = (w) => w.dispatchEvent(new w.Event('pagehide'));
const keys = (value) => (Array.isArray(value) ? value.length : value && typeof value === 'object' ? Object.keys(value).sort() : typeof value);
const near = (actual, expected, digits = 9) => assert.ok(Math.abs(actual - expected) < 10 ** -digits, `${actual} ≈ ${expected}`);

test('the three data files have the same keys, and each language keeps its own log', () => {
  const structure = (cfg) => ({
    top: Object.keys(cfg).sort(),
    text: Object.keys(cfg.text).sort(),
    channels: cfg.channels.map((c) => [c.key, c.inHouse]),
    categories: cfg.categories.map((c) => [c.key, Boolean(c.roomFix), Object.keys(c).sort()]),
    severities: cfg.severities.map((s) => [s.key, Object.keys(s).sort()]),
    learn: cfg.learn.map((s) => s.key),
    compensation: cfg.compensation.map((c) => [c.key, c.value, Boolean(c.phrase)]),
    statuses: Object.keys(cfg.statuses), satisfied: Object.keys(cfg.satisfied),
    targets: cfg.targets, repeatDays: cfg.repeatDays,
    replies: Object.fromEntries(Object.entries(cfg.replies).map(([k, v]) => [k, keys(v)])),
    advice: Object.fromEntries(Object.entries(cfg.advice).map(([k, v]) => [k, [keys(v), v.moves.length]])),
    tips: cfg.tips.map((tip) => tip.length),
    example: { top: Object.keys(cfg.example).sort(), rooms: cfg.example.rooms, nights: cfg.example.nights, rows: cfg.example.rows.map((r) => [Object.keys(r).sort().join(), r.date, r.time, r.room, r.channel, r.category, r.severity, r.learn, r.comp, r.value, r.resolved, r.followed, r.satisfied, Boolean(r.guest), Boolean(r.action)]) },
  });
  for (const lang of ['de', 'sq']) {
    assert.deepEqual(structure(data[lang]), structure(data.en), lang);
    assert.equal(data[lang].storageKey, `sc-guest-complaints-${lang}`);
  }
  assert.equal(data.en.storageKey, 'sc-guest-complaints');
  assert.deepEqual(data.en.categories.map((c) => c.key), ['cleanliness', 'noise', 'maintenance', 'temperature', 'wifi', 'fnb', 'staff', 'billing', 'booking', 'checkin', 'other']);
  assert.deepEqual(data.en.channels.map((c) => c.key), ['person', 'phone', 'chat', 'email', 'review', 'survey']);
  assert.deepEqual(data.en.compensation.map((c) => c.key), ['none', 'apology', 'amenity', 'upgrade', 'voucher', 'discount', 'refund', 'points']);
  assert.deepEqual(data.en.learn.map((s) => s.name), ['Listen', 'Empathise', 'Apologise', 'Resolve', 'Notify']);
  for (const lang of ['en', 'de', 'sq']) {
    Object.keys(data[lang].advice).forEach((key) => assert.ok(key === 'default' || data[lang].categories.some((c) => c.key === key), `${lang}: advice for ${key}`));
    assert.ok(data[lang].severities.find((s) => s.key === 'critical').means.length > 80, `${lang}: critical is defined`);
  }
  const cards = read('src/_data/i18n-parts/guest-complaints.cards.json');
  assert.equal(cards.family, 'pulse');
  assert.deepEqual(['en', 'de', 'sq'].map((l) => cards.cards[l].url), ['/tools/guest-complaints/', '/de/tools/guest-complaints/', '/sq/tools/guest-complaints/']);
  assert.equal(cards.routine.when, 'During the shift');
  // The Pareto tool already has a guest complaints template, which the hand-off names.
  assert.ok(read('src/_data/pareto.json').templates.some((t) => t.id === 'guest-complaints'));
});

test('complaints per 100 occupied room nights, from the nights of the period', () => {
  const M = load().GuestComplaintsMath;
  const nights = plain(M.exampleNights(data.en, '2026-10-23'));
  assert.equal(Object.keys(nights).length, 14);
  assert.equal(nights['2026-10-05'], 138);
  assert.equal(nights['2026-10-18'], 124);
  // Week 1: 138 + 144 + 146 + 139 + 121 + 98 + 117 = 903; week 2: 141 + 147 + 145 + 136 + 115 + 102 + 124 = 910.
  assert.deepEqual(plain(M.nightsTotal(nights, '2026-10-05', '2026-10-11')), { sold: 903, have: 7, days: 7, complete: true });
  assert.deepEqual(plain(M.nightsTotal(nights, '2026-10-12', '2026-10-18')), { sold: 910, have: 7, days: 7, complete: true });
  const all = plain(M.nightsTotal(nights, '2026-10-05', '2026-10-18'));
  assert.deepEqual(all, { sold: 1813, have: 14, days: 14, complete: true });
  // 25 complaints ÷ 1,813 room nights × 100 = 1.3789…; 12 ÷ 903 × 100 = 1.3289…; 13 ÷ 910 × 100 = 1.4286…
  near(M.per100(25, 1813), 1.37893, 5);
  assert.equal(M.per100(25, 1813).toFixed(2), '1.38');
  assert.equal(M.per100(12, 903).toFixed(2), '1.33');
  assert.equal(M.per100(13, 910).toFixed(2), '1.43');
  assert.equal(M.per100(4, 0), null, 'no room nights, no rate');
  assert.deepEqual(plain(M.nightsTotal(nights, '2026-10-17', '2026-10-20')), { sold: 226, have: 2, days: 4, complete: false }, 'a period beyond the nights is not complete');
  // The nights of Hotel KPIs: one row per night, the latest row of a night wins.
  const kpis = plain(M.hotelNights({ rows: [{ date: '2026-10-05', available: 150, sold: 130 }, { date: '2026-10-05', available: 150, sold: 138 }, { date: '06.10.2026', available: 150, sold: '144' }, { date: 'x', sold: 3 }, null] }));
  assert.deepEqual(kpis, { '2026-10-05': 138, '2026-10-06': 144 });
  assert.deepEqual(plain(M.hotelNights(null)), {});
});

test('time to resolve and its median, apart for the guests in the house and after the stay', () => {
  const M = load().GuestComplaintsMath;
  const rows = M.exampleRows(data.en, '2026-10-23');
  assert.equal(rows.length, 25);
  assert.equal(new Set(rows.map((r) => r.id)).size, 25);
  assert.equal(rows[0].id, 'GC-261005-001');
  assert.equal(M.ttr(rows[0]), 12, '07:40 → 07:52');
  assert.equal(M.ttr(rows[3]), 30, '23:40 → 00:10 the next day');
  assert.equal(M.ttr(rows[6]), 390, 'the email: 09:10 → 15:40');
  assert.equal(M.ttr(rows[24]), null, 'still open');
  assert.equal(M.median([3, 1, 2]), 2);
  assert.equal(M.median([4, 1, 3, 2]), 2.5);
  assert.equal(M.median([]), null);
  // In the house, 20 resolved: 8, 11, 11, 12 ×5, 13, 13 | 15, 20, 20, 30 ×5, 35, 40 → (13 + 15) ÷ 2 = 14 minutes.
  // After the stay: 270, 280, 330, 390 → (280 + 330) ÷ 2 = 305 minutes. All 24: the 12th and 13th are 20 and 20.
  assert.deepEqual(plain(M.resolveTimes(rows, data.en)), { inHouse: 14, postStay: 305, all: 20, nInHouse: 20, nPostStay: 4 });
  // A resolution typed before the complaint is no time at all.
  assert.equal(M.ttr(M.cleanRow({ date: '2026-10-05', time: '10:00', resolved: '2026-10-05 09:00' }, data.en)), null);
});

test('resolved within target: resolved in time out of every complaint whose target is decided', () => {
  const M = load().GuestComplaintsMath;
  const rows = M.exampleRows(data.en, '2026-10-23');
  const t = plain(M.targets(data.en));
  assert.deepEqual(t, { inHouse: 15, postStay: 24 });
  // In the house: 11 of 20 within 15 minutes (the one at exactly 15 counts); after the stay all 4 within 24 hours;
  // the open complaint of 18 Oct 21:40 is past its 15 minutes. 15 of 25 = 60 %.
  const now = { date: '2026-10-23', time: '12:00' };
  assert.deepEqual(plain(M.withinTarget(rows, data.en, t, now)), { within: 15, missed: 10, pending: 0, unknown: 0, decided: 25, share: 0.6 });
  // Ten minutes after the last complaint it is still inside its target: pending, not counted. 15 of 24.
  const early = plain(M.withinTarget(rows, data.en, t, { date: '2026-10-18', time: '21:50' }));
  assert.deepEqual([early.within, early.missed, early.pending, early.decided], [15, 9, 1, 24]);
  // With 30 minutes in the house: 18 of 20 (only 35 and 40 miss), 4 after the stay, the open one missed: 22 of 25.
  const wide = plain(M.withinTarget(rows, data.en, M.targets(data.en, { targetInHouse: '30', targetPostStay: 'x' }), now));
  assert.deepEqual([wide.within, wide.decided, wide.share], [22, 25, 0.88]);
  assert.equal(M.targets(data.en, { targetPostStay: '0' }).postStay, 24, 'a wrong setting falls back');
  assert.equal(M.targetMinutes(rows[6], data.en, t), 1440, 'an email is measured in hours');
});

test('repeat rooms: the same room and category again within 30 days', () => {
  const M = load().GuestComplaintsMath;
  const rows = M.exampleRows(data.en, '2026-10-23');
  const found = plain(M.repeats(rows, 30));
  // 318 noise on 5 and 13 Oct; 412 temperature on 6 and 12 Oct (the latest run first). 318 also had a cleanliness
  // complaint: another category, no repeat.
  assert.deepEqual(found.map((r) => [r.room, r.category, r.count, r.first, r.last]), [['318', 'noise', 2, '2026-10-05', '2026-10-13'], ['412', 'temperature', 2, '2026-10-06', '2026-10-12']]);
  assert.deepEqual(found[1].ids, ['GC-261006-003', 'GC-261012-013']);
  assert.deepEqual(plain(M.repeats(rows, 7)).map((r) => r.room), ['412'], 'eight days apart is not within seven');
  const row = (date, room = '210', category = 'maintenance') => M.cleanRow({ date, room, category }, data.en);
  assert.equal(M.repeats([row('2026-09-01'), row('2026-09-26'), row('2026-10-21')], 30)[0].count, 3, 'each within 30 days of the one before');
  assert.equal(M.repeats([row('2026-09-01'), row('2026-10-11')], 30).length, 0, '40 days apart');
  assert.equal(M.repeats([row('2026-09-01', ''), row('2026-09-02', '')], 30).length, 0, 'no room, no repeat room');
  assert.equal(M.repeats([row('2026-09-01', '210 '), row('2026-09-02', '210')], 30).length, 1, 'the same room however typed');
});

test('the cost of recovery, satisfaction, the Pareto, the weeks and LEARN add up', () => {
  const M = load().GuestComplaintsMath;
  const rows = M.exampleRows(data.en, '2026-10-23');
  // 12 + 18 + 18 + 30 + 40 + 20 + 129 + 129 = €396 over 25 complaints = €15.84; 8 compensated = €49.50 each.
  const cost = plain(M.costs(rows));
  assert.equal(cost.total, 396);
  assert.equal(cost.perComplaint, 15.84);
  assert.equal(cost.compensated, 8);
  assert.equal(cost.perCompensated, 49.5);
  assert.deepEqual(cost.byType, [{ key: 'refund', value: 258 }, { key: 'discount', value: 70 }, { key: 'voucher', value: 36 }, { key: 'points', value: 20 }, { key: 'amenity', value: 12 }]);
  assert.equal(cost.byType.reduce((s, item) => s + item.value, 0), cost.total);
  // Satisfied: 16 yes, 2 no of the 24 resolved; 6 not known; the open one is not counted. 16 ÷ 18.
  const sat = plain(M.satisfaction(rows));
  assert.deepEqual([sat.yes, sat.no, sat.unknown, sat.answered], [16, 2, 6, 18]);
  near(sat.share, 16 / 18);
  // Pareto: noise 7, temperature 5, cleanliness 4, maintenance 4 = 20 of 25 = 80 % (class A: each starts below 80 %),
  // the rest one each (B while they start below 95 %; the last starts at 24 of 25 = 96 %, C).
  const p = plain(M.pareto(rows, data.en));
  assert.deepEqual(p.map((i) => [i.key, i.value, i.cls]), [['noise', 7, 'A'], ['temperature', 5, 'A'], ['cleanliness', 4, 'A'], ['maintenance', 4, 'A'], ['billing', 1, 'B'], ['checkin', 1, 'B'], ['fnb', 1, 'B'], ['staff', 1, 'B'], ['wifi', 1, 'C']]);
  near(p[3].cumulative, 0.8);
  near(p.at(-1).cumulative, 1);
  const weeks = plain(M.weekly(rows, '2026-10-05', '2026-10-18'));
  assert.deepEqual(weeks.map((w) => [w.week, w.minor, w.major, w.critical, w.total]), [['2026-10-05', 7, 5, 0, 12], ['2026-10-12', 9, 2, 2, 13]]);
  assert.deepEqual(plain(M.learnCounts(rows)).map((s) => s.value), [25, 25, 24, 24, 22]);
  assert.deepEqual(rows.map(M.statusOf).reduce((n, s) => ({ ...n, [s]: (n[s] || 0) + 1 }), {}), { resolved: 16, followed: 8, open: 1 });
});

test('guest names of closed complaints are removed; open ones keep theirs', () => {
  const M = load().GuestComplaintsMath;
  const rows = M.exampleRows(data.en, '2026-10-23');
  assert.equal(rows.filter((r) => r.guest).length, 7);
  const { rows: out, removed } = M.removeNames(rows);
  assert.equal(removed, 6);
  assert.deepEqual(out.filter((r) => r.guest).map((r) => [r.guest, M.statusOf(r)]), [['Mr R. Davies', 'open']]);
  assert.equal(rows.filter((r) => r.guest).length, 7, 'the rows given are not changed');
});

test('saved and pasted rows are cleaned: LEARN letters, the resolution, a follow-up only after it', () => {
  const M = load({ lang: 'de' }).GuestComplaintsMath;
  const row = plain(M.cleanRow({ date: '2026-10-06', time: '9:05', room: ' 412 ', channel: 'fax', category: 'spaceship', severity: 'huge', learn: 'nla', comp: 'refund', value: '129,00', resolved: '2026-10-06 9:35', followed: '2026-10-07', satisfied: 'maybe' }, data.de));
  assert.deepEqual([row.time, row.room, row.channel, row.category, row.severity, row.comp, row.value, row.resolvedDate, row.resolvedTime, row.followed, row.satisfied], ['09:05', '412', 'person', 'other', 'minor', 'refund', 129, '2026-10-06', '09:35', '2026-10-07', 'unknown']);
  assert.deepEqual(row.learn, ['listen', 'apologise', 'notify'], 'in the order of LEARN');
  assert.equal(M.statusOf(row), 'followed');
  assert.equal(M.cleanRow({ date: '2026-10-06', followed: '2026-10-07' }, data.de).followed, '', 'no follow-up without a resolution');
  assert.equal(M.cleanRow({ room: '1' }, data.de), null, 'no date, no complaint');
  const text = [
    'Datum\tUhrzeit\tZimmer\tKanal\tKategorie\tSchweregrad\tWas passiert ist\tGast\tAufgenommen von\tMaßnahme\tKompensation\tWert\tGelöst am\tUm\tNachgefasst\tZufrieden',
    '06.10.2026\t16:05\t412\tPersönlich\tTemperatur / Klimaanlage\tSchwer\tKlimaanlage bläst warm\tHerr A. Fischer\tJonas\tTechniker\tAufmerksamkeit\t12\t06.10.2026\t16:35\t07.10.2026\tJa',
    '2026-10-07\t06:10\t133\tphone\tWartezeit\tkritisch\tWarten\t\t\t\tvoucher\t18,50\t\t\t\t',
    'kein Datum\t\t1',
  ].join('\n');
  const { added, skipped } = plain(M.importRows(text, data.de));
  assert.equal(added.length, 2);
  assert.equal(skipped, 1);
  assert.deepEqual([added[0].channel, added[0].category, added[0].severity, added[0].comp, added[0].value, added[0].satisfied, M.ttr(added[0])], ['person', 'temperature', 'major', 'amenity', 12, 'yes', 30]);
  assert.deepEqual([added[1].channel, added[1].category, added[1].severity, added[1].comp, added[1].value, M.statusOf(added[1])], ['phone', 'checkin', 'critical', 'voucher', 18.5, 'open']);
  assert.match(added[0].id, /^GC-261006-[A-Z2-9]{3}$/);
  assert.equal(M.newId('2026-10-20', new Set(), () => 0), 'GC-261020-AAA');
  // A later day moves the example forward by whole weeks, the nights with it.
  // 2 Nov is 15 days after the last day (18 Oct): two whole weeks.
  const later = M.exampleRows(data.de, '2026-11-02');
  assert.equal(later[0].date, '2026-10-19');
  assert.equal(later[3].resolvedDate, '2026-10-21', 'the resolutions move with it');
  assert.equal(plain(M.exampleNights(data.de, '2026-11-02'))['2026-10-19'], 138);
});

test('the reply to the guest: apology and what was done, in the page language; a review reply names no room or gesture', () => {
  const M = load().GuestComplaintsMath;
  const rows = M.exampleRows(data.en, '2026-10-23');
  const fischer = rows[2];
  const email = M.replyText(fischer, data.en, { kind: 'email', hotel: 'Airport Hotel', me: 'Elena', money: (n) => `€${n.toFixed(2)}` });
  const lines = email.split('\n');
  assert.equal(lines[0], 'Subject: Your stay at Airport Hotel (GC-261006-003)');
  assert.equal(lines[2], 'Dear Mr A. Fischer,');
  assert.match(email, /Thank you for telling us about the temperature in your room on 2026-10-06\. I am sorry/);
  assert.match(email, /What we did: the engineer reset the fan coil and cleaned the filter; the room was at 21 °C by 16:35\./);
  assert.match(email, /As an apology, we sent a small amenity to your room\./);
  assert.match(email, /passed it on to the team concerned/, 'notify was done');
  assert.deepEqual(lines.slice(-3), ['Kind regards,', 'Elena', 'Airport Hotel']);
  const open = M.replyText(rows[24], data.en, { kind: 'message' });
  assert.match(open, /^Hello Mr R\. Davies, this is the hotel\. Thank you for telling us about the noise during your night, and I am sorry\.\nWe are on it/);
  assert.doesNotMatch(open, /team concerned/, 'notify not done yet');
  const review = M.replyText(rows[11], data.en, { kind: 'review', money: (n) => `€${n}` });
  assert.match(review, /^Dear guest,\n\nThank you for your review/);
  assert.match(review, /our Housekeeping team/);
  assert.doesNotMatch(review, /106|apology,|€/);
  const sq = M.replyText(M.exampleRows(data.sq, '2026-10-23')[18], data.sq, { kind: 'email', lang: 'sq', money: (n) => `${n.toFixed(2).replace('.', ',')} €` });
  assert.match(sq, /^Subjekti: Qëndrimi juaj – hoteli \(GC-261015-019\)\n\nI\/E nderuar znj\. L\. Moreau,/);
  assert.match(sq, /Si kërkim falje, ju rimbursuam një natë dhome \(129,00 €\)\./);
  assert.match(sq, /Çfarë bëmë: e kaluam mysafiren menjëherë/);
});

test('a first visit opens on the example: the numbers, the open complaint, repeat rooms, charts and the hand-offs', () => {
  const w = load({ lang: 'sq', page: true });
  const doc = w.document;
  const results = doc.querySelector('[data-results]');
  assert.equal(results.hidden, false);
  assert.equal(doc.querySelector('.dl-example-note').hidden, false, 'the note says it is an example');
  assert.match(results.querySelector('h2').textContent, /^25 ankesa · 1,38 për 100 net dhome të zëna/);
  const stats = [...results.querySelectorAll('.dl-stat')].map((s) => s.textContent);
  assert.ok(stats.some((s) => /^Zgjidhur brenda objektivit60%15 nga 25/.test(s)), stats.join(' | '));
  assert.ok(stats.some((s) => /^Koha mediane e zgjidhjes14 min/.test(s)), stats.join(' | '));
  assert.ok(stats.some((s) => /^Kostoja e rikuperimit396,00\s€15,84\s€ për ankesë/.test(s)), stats.join(' | '));
  assert.ok(stats.some((s) => /^Të kënaqur pas rikuperimit89%16 nga 18/.test(s)), stats.join(' | '));
  assert.ok(stats.some((s) => /^Dhoma që përsëriten2/.test(s)));
  assert.ok(stats.some((s) => /1\.813 net dhome të zëna të hotelit shembull/.test(s)), 'the nights of the example');
  assert.equal(results.querySelectorAll('.gc-open-card li').length, 1);
  assert.match(results.querySelector('.gc-open-card li').textContent, /Dhoma 308 · Zhurma · E rëndë/);
  assert.equal(results.querySelectorAll('.gc-repeat-card li').length, 2);
  assert.ok(results.querySelectorAll('svg.ck-chart').length >= 4, 'Pareto, weeks, cost and LEARN');
  assert.match(results.querySelector('.dl-focus h3').textContent, /^Zhurma/);
  assert.equal(results.querySelectorAll('.gc-register tbody tr').length, 25, 'the whole log for print');
  assert.match(results.textContent, /Java e 05\.10\.2026: 1,33 · Java e 12\.10\.2026: 1,43/, 'the rate of each week');
  // The repeat room with the air conditioning goes to the Action Tracker with the room as its area.
  const repeat = [...results.querySelectorAll('.gc-repeat-card li')].find((li) => /Dhoma 412/.test(li.textContent)).querySelector('a');
  repeat.addEventListener('click', (event) => event.preventDefault());
  repeat.dispatchEvent(new w.MouseEvent('click', { bubbles: true, cancelable: true }));
  const url = new URL(repeat.href);
  assert.equal(url.pathname, '/sq/tools/action-tracker/');
  assert.equal(url.searchParams.get('source'), 'guest-complaints');
  assert.equal(url.searchParams.get('area'), '412');
  assert.equal(url.searchParams.get('priority'), 'High');
  // Pareto gets the complaints of the period by category, the department as the filter.
  const pareto = [...results.querySelectorAll('a')].find((a) => a.textContent === 'Hape në Pareto 80/20');
  assert.equal(new URL(pareto.href).pathname, '/sq/tools/pareto/');
  pareto.addEventListener('click', (event) => event.preventDefault());
  pareto.dispatchEvent(new w.MouseEvent('click', { bubbles: true, cancelable: true }));
  const handoff = JSON.parse(w.sessionStorage.getItem('sc-pareto-handoff'));
  assert.equal(handoff.template, 'guest-complaints');
  assert.equal(handoff.rows.length, 25);
  assert.deepEqual(handoff.rows[2], ['2026-10-06', 'Mirëmbajtja', '412', 'Temperatura / kondicioneri', '1', '12', 'E rëndë']);
  assert.deepEqual(handoff.map, { date: 0, filter: 1, category: 3, count: 4, value: 5 });
  assert.equal(handoff.measure, 'count');
  const whys = [...results.querySelectorAll('a')].find((a) => a.href.includes('/five-whys/'));
  assert.ok(whys.href.startsWith('https://example.test/sq/tools/five-whys/?problem='), whys.href);
  // The log and the open complaint chosen in box 4, with its reply in Albanian.
  assert.equal(doc.querySelectorAll('[data-log] tr').length, 25);
  assert.equal(doc.querySelector('#gc-pick').value, 'GC-261018-025');
  assert.match(doc.querySelector('#gc-reply').value, /^Subjekti: Qëndrimi juaj – Airport Hotel \(shembull\)/);
  assert.match(doc.querySelector('#gc-reply').value, /Po merremi me të tani/);
});

test('the recovery of the open complaint, a maintenance action with the room, names removed, Hotel KPIs as the base', () => {
  const w = load({ page: true });
  const doc = w.document;
  const results = doc.querySelector('[data-results]');
  // Resolve the open complaint: LEARN ticked, the action, a voucher, 22:05.
  const form = doc.querySelector('[data-recovery]');
  ['resolve', 'notify'].forEach((key) => {
    const box = form.querySelector(`input[name=learn][value=${key}]`);
    box.checked = true;
    box.dispatchEvent(new w.Event('change', { bubbles: true }));
  });
  form.elements.status.value = 'resolved';
  form.elements.status.dispatchEvent(new w.Event('change', { bubbles: true }));
  assert.equal(form.querySelector('[data-resolved-fields]').hidden, false);
  form.elements.resolvedDate.value = '2026-10-18';
  form.elements.resolvedTime.value = '21:30';
  form.dispatchEvent(new w.Event('submit', { cancelable: true }));
  assert.match(doc.querySelector('[data-recovery-status]').textContent, /before it was logged/);
  form.elements.resolvedTime.value = '22:05';
  form.dispatchEvent(new w.Event('submit', { cancelable: true }));
  assert.match(doc.querySelector('[data-recovery-status]').textContent, /what was done/, 'a resolution needs its action');
  form.elements.action.value = 'Security spoke to the team coach; quiet from 22:00.';
  form.elements.comp.value = 'voucher';
  form.elements.comp.dispatchEvent(new w.Event('change', { bubbles: true }));
  assert.equal(form.elements.compValue.value, '18.00', 'the gesture brings its usual value');
  form.elements.satisfied.value = 'yes';
  form.dispatchEvent(new w.Event('submit', { cancelable: true }));
  flush(w);
  let saved = JSON.parse(w.localStorage.getItem('sc-guest-complaints'));
  const davies = saved.rows.at(-1);
  assert.deepEqual([davies.resolvedDate, davies.resolvedTime, davies.comp, davies.value, davies.satisfied, davies.learn.join()], ['2026-10-18', '22:05', 'voucher', 18, 'yes', 'listen,empathise,apologise,resolve,notify']);
  assert.equal(results.querySelectorAll('.gc-open-card li').length, 0);
  // 25 minutes is past 15: still 15 within, now of 25 resolved; the cost is €414.
  assert.ok([...results.querySelectorAll('.dl-stat')].some((s) => /^Recovery cost€414\.00/.test(s.textContent)));
  // A maintenance complaint carries its room to the Action Tracker.
  const leak = saved.rows.find((r) => r.room === '518');
  doc.querySelector(`[data-log] [data-pick="${leak.id}"]`).click();
  const link = doc.querySelector('[data-case-actions] a');
  link.addEventListener('click', (event) => event.preventDefault());
  link.dispatchEvent(new w.MouseEvent('click', { bubbles: true, cancelable: true }));
  const action = new URL(link.href).searchParams;
  assert.equal(action.get('area'), '518');
  assert.equal(action.get('source'), 'guest-complaints');
  assert.match(action.get('action'), /^Maintenance \/ room defect in room 518/);
  // Names of closed complaints go; with the open one resolved, every name goes.
  doc.querySelector('[data-forget]').click();
  flush(w);
  saved = JSON.parse(w.localStorage.getItem('sc-guest-complaints'));
  assert.equal(saved.rows.filter((r) => r.guest).length, 0);
  // Own complaints and Hotel KPIs with every night: the rate comes from there.
  const kpis = { rows: [{ date: '2026-10-20', available: 150, sold: 140 }, { date: '2026-10-21', available: 150, sold: 60 }] };
  const own = { rows: [{ date: '2026-10-20', time: '20:00', room: '101', channel: 'person', category: 'noise', severity: 'minor', what: 'Noise' }, { date: '2026-10-21', time: '21:00', room: '102', channel: 'phone', category: 'wifi', severity: 'minor', what: 'Wi-Fi' }] };
  const w2 = load({ page: true, storage: { 'sc-hotel-kpis': kpis, 'sc-guest-complaints': own } });
  const r2 = w2.document.querySelector('[data-results]');
  // 2 complaints ÷ 200 room nights × 100 = 1.00.
  assert.match(r2.querySelector('h2').textContent, /^2 complaints · 1\.00 per 100 occupied room nights/);
  assert.match(r2.textContent, /200 occupied room nights from Hotel KPIs/);
  // Without Hotel KPIs, the number typed for the period.
  const w3 = load({ page: true, storage: { 'sc-guest-complaints': { ...own, roomNights: '400', totalsFor: { roomNights: '|' } } } });
  assert.match(w3.document.querySelector('[data-results] h2').textContent, /0\.50 per 100 occupied room nights/);
  const w4 = load({ page: true, storage: { 'sc-guest-complaints': own } });
  assert.match(w4.document.querySelector('[data-results] h2').textContent, /2 complaints · 0% resolved within target/);
});
