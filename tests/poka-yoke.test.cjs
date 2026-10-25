// Poka-Yoke Register (src/js/poka-yoke.js): next due, the status, the due dates met and missed, verification
// compliance, the failure rate of the tests, effectiveness, coverage and strength, the order of urgency, the days of
// the checklist, the example and the page. The small fixtures are worked out by hand below; the example of the data
// file (10 devices of a warehouse and a hotel) was counted device by device in the comment of its test.
process.env.TZ = 'Europe/Berlin';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const { JSDOM } = require('jsdom');
const nunjucks = require('nunjucks');

const plain = (value) => JSON.parse(JSON.stringify(value));
const read = (file) => JSON.parse(fs.readFileSync(file, 'utf8'));
const data = { en: read('src/_data/pokaYoke.json'), de: read('src/_data/de/pokaYoke.json'), sq: read('src/_data/sq/pokaYoke.json') };
const part = read('src/_data/i18n-parts/poka-yoke.json');
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
  const body = env.render('partials/poka-yoke.njk', { cfg: data[lang], lang: lang === 'en' ? undefined : lang });
  return `<html lang="${lang}"><body><main>${body.replace(/<script src=[^>]*><\/script>/g, '')}</main></body></html>`;
};

// Sunday 25 October 2026, noon in Frankfurt.
const NOW = '2026-10-25T11:00:00Z';
const TODAY = '2026-10-25';
const load = ({ lang = 'en', page = false, now = NOW, storage = {} } = {}) => {
  const url = `https://example.test${lang === 'en' ? '' : `/${lang}`}/tools/poka-yoke/`;
  const dom = new JSDOM(page ? pageHtml(lang) : `<html lang="${lang}"><body></body></html>`, { url, runScripts: 'outside-only', pretendToBeVisual: true });
  const w = dom.window;
  w.eval(`(() => { const Real = Date; const fixed = new Real(${JSON.stringify(now)}); Date = class extends Real { constructor(...args) { super(...(args.length ? args : [fixed])); } static now() { return fixed.getTime(); } }; })();`);
  w.confirm = () => true;
  w.print = () => {};
  w.HTMLElement.prototype.scrollIntoView = () => {};
  // Following a link is not part of these tests (jsdom cannot navigate).
  w.document.addEventListener('click', (event) => { if (event.target.closest?.('a')) event.preventDefault(); });
  Object.entries(storage).forEach(([key, value]) => w.localStorage.setItem(key, JSON.stringify(value)));
  if (lang !== 'en') w.UiStrings = strings(lang);
  for (const file of ['tool-kit', 'chart-kit', 'workplace', 'actions-store', 'poka-yoke']) w.eval(fs.readFileSync(`src/js/${file}.js`, 'utf8'));
  return w;
};
const near = (actual, expected, digits = 9) => assert.ok(Math.abs(actual - expected) < 10 ** -digits, `${actual} ≈ ${expected}`);
const ago = (n) => {
  const d = new Date(`${TODAY}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() - n);
  return d.toISOString().slice(0, 10);
};

test('the three data files have the same shape, and each language keeps its own register', () => {
  const shape = (cfg) => ({
    top: Object.keys(cfg).sort(),
    text: Object.keys(cfg.text).sort(),
    areas: cfg.areas.length, shifts: cfg.shifts.length,
    methods: cfg.methods.map((m) => [m.key, Object.keys(m).sort()]),
    functions: cfg.functions.map((m) => m.key), levels: cfg.levels.map((m) => m.key),
    frequencies: cfg.frequencies.map((f) => [f.key, f.days]),
    results: cfg.results.map((r) => r.key),
    statuses: Object.keys(cfg.statuses).sort(),
    strengths: cfg.strengths.length,
    advice: Object.fromEntries(Object.entries(cfg.advice).map(([k, v]) => [k, Object.keys(v).sort(), v.moves.length])),
    tips: cfg.tips.map((tip) => tip.length),
    example: cfg.example.devices.map((d) => ({
      keys: Object.keys(d).sort(), area: d.area, method: d.method, func: d.func, level: d.level, freq: d.freq, owner: d.owner,
      before: d.before, after: d.after, anchor: d.anchor, stop: d.stop, late: d.late, fails: d.fails,
      notes: d.notes.map((n) => n[0]), untested: d.untested.map((n) => n[0]), fmea: Boolean(d.fmea),
    })),
  });
  for (const lang of ['de', 'sq']) {
    assert.deepEqual(shape(data[lang]), shape(data.en), lang);
    assert.equal(data[lang].storageKey, `sc-poka-yoke-${lang}`);
  }
  assert.equal(data.en.storageKey, 'sc-poka-yoke');
  assert.deepEqual(data.en.frequencies.map((f) => f.days), [1, 1, 7, 30]);
  const cards = read('src/_data/i18n-parts/poka-yoke.cards.json');
  assert.equal(cards.family, 'lumen');
  assert.deepEqual(['en', 'de', 'sq'].map((l) => cards.cards[l].url), ['/tools/poka-yoke/', '/de/tools/poka-yoke/', '/sq/tools/poka-yoke/']);
  const css = fs.readFileSync('src/css/60-poka-yoke.css', 'utf8');
  assert.equal(css.split('{').length, css.split('}').length, 'braces balanced');
  assert.doesNotMatch(css, /--red|--gold/);
});

test('every text of the page and the script has its German and Albanian translation', () => {
  const njk = fs.readFileSync('src/_includes/partials/poka-yoke.njk', 'utf8');
  const js = fs.readFileSync('src/js/poka-yoke.js', 'utf8');
  const keys = new Set();
  for (const m of njk.matchAll(/"((?:[^"\\]|\\.)+?)"\s*\|\s*t\(lang\)/g)) keys.add(m[1]);
  for (const m of njk.matchAll(/'((?:[^'\\]|\\.)+?)'\s*\|\s*t\(lang\)/g)) keys.add(m[1]);
  for (const m of js.matchAll(/\btx\("((?:[^"\\]|\\.)*)"/g)) keys.add(JSON.parse(`"${m[1]}"`));
  assert.ok(keys.size > 100, `${keys.size} texts`);
  for (const lang of ['de', 'sq']) {
    const ui = strings(lang);
    const missing = [...keys].filter((key) => !(key in ui));
    assert.deepEqual(missing, [], lang);
    // A placeholder of the English text is kept in the translation.
    Object.entries(part[lang]).forEach(([en, text]) => (en.match(/\{\w+\}/g) || []).forEach((p) => assert.ok(text.includes(p), `${lang}: ${p} in ${text}`)));
  }
});

test('next due = last verified + interval; the status: failed, overdue, due today, ok, never verified', () => {
  const M = load().PokaYokeMath;
  assert.equal(M.nextDue('2026-10-25', 1), '2026-10-26');
  assert.equal(M.nextDue('2026-10-25', 7), '2026-11-01');
  assert.equal(M.nextDue('2026-10-25', 30), '2026-11-24');
  assert.equal(M.nextDue('2026-02-27', 7), '2026-03-06', 'across the end of February');
  assert.equal(M.nextDue('', 7), '');
  assert.equal(M.statusOf('2026-10-24', TODAY), 'overdue');
  assert.equal(M.statusOf('2026-10-25', TODAY), 'due');
  assert.equal(M.statusOf('2026-10-26', TODAY), 'ok');
  assert.equal(M.statusOf('', TODAY), 'new');
  assert.equal(M.statusOf('2026-11-30', TODAY, '2026-10-20'), 'failed', 'failed beats a date in the future');

  // Last verified: the latest test (works or failed), or the date before the register; "not tested" does not count.
  const device = { id: 'a', last: '2026-10-10' };
  const checks = [
    { device: 'a', date: '2026-10-18', result: 'failed' },
    { device: 'a', date: '2026-10-20', result: 'works' },
    { device: 'a', date: '2026-10-22', result: 'untested' },
    { device: 'b', date: '2026-10-24', result: 'works' },
  ];
  assert.equal(M.lastVerified(device, checks), '2026-10-20');
  assert.equal(M.lastVerified({ id: 'a', last: '2026-10-21' }, checks), '2026-10-21');
  assert.equal(M.lastVerified({ id: 'c', last: '' }, checks), '');
  // Failed until a later works; a later "not tested" leaves it failed; two on one day keep their order.
  assert.equal(M.failedOn(device, checks), '');
  assert.equal(M.failedOn(device, [...checks, { device: 'a', date: '2026-10-23', result: 'failed' }, { device: 'a', date: '2026-10-24', result: 'untested' }]), '2026-10-23');
  assert.equal(M.failedOn(device, [{ device: 'a', date: '2026-10-23', result: 'failed' }, { device: 'a', date: '2026-10-23', result: 'works' }]), '');
  const info = M.deviceInfo({ id: 'w', last: '2026-10-14' }, [], 7, TODAY);
  assert.deepEqual(plain(info), { id: 'w', last: '2026-10-14', next: '2026-10-21', failed: '', status: 'overdue', over: 4, left: 0 });
  assert.equal(M.deviceInfo({ id: 'w', last: '2026-10-20' }, [], 7, TODAY).left, 2);
});

test('the due dates met and missed, and verification compliance, by hand', () => {
  const M = load().PokaYokeMath;
  // Weekly, last verified 1 Oct. Tested 8 Oct (due 8 Oct: on time), then 17 Oct (due 15 Oct: missed; the late test
  // restarts the clock), so due 24 Oct (missed) and 31 Oct (missed).
  assert.deepEqual(plain(M.schedule('2026-10-01', ['2026-10-08', '2026-10-17'], 7, '2026-10-31')), [
    { due: '2026-10-08', done: '2026-10-08', onTime: true },
    { due: '2026-10-15', done: '', onTime: false },
    { due: '2026-10-24', done: '', onTime: false },
    { due: '2026-10-31', done: '', onTime: false },
  ]);
  // A weekly test done early meets its date and moves the next one: tested 5 Oct (due 8 Oct), next due 12 Oct.
  assert.deepEqual(plain(M.schedule('2026-10-01', ['2026-10-05', '2026-10-12'], 7, '2026-10-14')).map((s) => [s.due, s.onTime]), [['2026-10-08', true], ['2026-10-12', true]]);
  // Daily, last verified 1 Oct, tested 2, 3 and 6 Oct: 4 and 5 Oct missed, 6 Oct met (the test falls on that date),
  // 7 Oct missed.
  const daily = M.schedule('2026-10-01', ['2026-10-02', '2026-10-03', '2026-10-06'], 1, '2026-10-07');
  assert.deepEqual(plain(daily).map((s) => `${s.due.slice(8)}${s.onTime ? '✓' : '✗'}`), ['02✓', '03✓', '04✗', '05✗', '06✓', '07✗']);

  // Compliance on 7 Oct for 1–7 Oct: the daily device has 02 03 06 met, 04 05 missed, and 07 is due today and not
  // done yet, so it is not counted: 3 of 5. The weekly device (verified 30 Sep, tested 7 Oct) has 7 Oct met today.
  const devices = [{ device: { id: 'd', last: '2026-10-01' }, interval: 1 }, { device: { id: 'w', last: '2026-09-30' }, interval: 7 }];
  const checks = [
    ...['2026-10-02', '2026-10-03', '2026-10-06'].map((date) => ({ device: 'd', date, result: 'works' })),
    { device: 'd', date: '2026-10-05', result: 'untested', note: 'line running' },
    { device: 'w', date: '2026-10-07', result: 'failed' },
  ];
  const c = M.compliance(devices, checks, '2026-10-01', '2026-10-07', '2026-10-07');
  assert.equal(c.due, 6);
  assert.equal(c.onTime, 4);
  near(c.rate, 4 / 6);
  assert.deepEqual(plain(c.per).map((p) => [p.id, p.onTime, p.due]), [['d', 3, 5], ['w', 1, 1]]);
  // A period that ends before today counts its last day like any other.
  const before = M.compliance(devices, checks, '2026-10-01', '2026-10-05', '2026-10-07');
  assert.deepEqual([before.onTime, before.due], [2, 4]);
  assert.equal(M.compliance([], [], '2026-10-01', '2026-10-07', '2026-10-07').rate, null);
  // Without a date before the register, the first test is the anchor.
  assert.deepEqual(plain(M.compliance([{ device: { id: 'n', last: '' }, interval: 7 }], [{ device: 'n', date: '2026-10-01', result: 'works' }, { device: 'n', date: '2026-10-08', result: 'works' }], '2026-10-01', '2026-10-31', '2026-10-31')).per[0], { id: 'n', due: 4, onTime: 1, rate: 0.25 });
});

test('failure rate, effectiveness, coverage, strength, urgency and the checklist days', () => {
  const M = load().PokaYokeMath;
  const checks = [
    ...['2026-10-01', '2026-10-02', '2026-10-03', '2026-10-04'].map((date) => ({ device: 'a', date, result: 'works' })),
    { device: 'a', date: '2026-10-05', result: 'failed' },
    { device: 'a', date: '2026-10-06', result: 'untested' },
    { device: 'a', date: '2026-09-30', result: 'failed' },
  ];
  // 1 failed of 5 tests in 1–6 Oct = 20 %; the untested one is counted apart, the one of 30 Sep is outside.
  assert.deepEqual(plain(M.failureRate(checks, '2026-10-01', '2026-10-06')), { tested: 5, failed: 1, untested: 1, rate: 0.2 });
  assert.equal(M.failureRate([], '2026-10-01', '2026-10-06').rate, null);
  // (38 − 4) ÷ 38 = 89.47 %; an after above the before is a negative effectiveness; no before, no figure.
  near(M.effectiveness(38, 4), 34 / 38);
  near(M.effectiveness(10, 12), -0.2);
  assert.equal(M.effectiveness(0, 0), null);
  assert.equal(M.effectiveness(10, null), null);
  assert.equal(M.effectiveness(null, 3), null);
  const devices = [
    { name: 'A', method: 'contact', func: 'control', level: 'prevent', before: 38, after: 4 },
    { name: 'B', method: 'fixed', func: 'warning', level: 'detect', before: 22, after: 3 },
    { name: 'C', method: 'contact', func: 'warning', level: 'prevent', before: null, after: null },
    { name: 'D', method: 'motion', func: 'control', level: 'detect', before: 0, after: 0 },
  ];
  // (60 − 7) ÷ 60 over the two devices with both figures.
  assert.deepEqual(plain(M.totalEffect(devices)), { n: 2, before: 60, after: 7, rate: 53 / 60 });
  assert.deepEqual(plain(M.coverage(devices, 'method', M.METHODS)), [{ key: 'contact', n: 2, share: 0.5 }, { key: 'fixed', n: 1, share: 0.25 }, { key: 'motion', n: 1, share: 0.25 }]);
  assert.deepEqual(plain(devices.map(M.strength)), [1, 4, 2, 3], 'prevention + control strongest, detection + warning weakest');
  const list = [
    { name: 'ok later', status: 'ok', next: '2026-11-02', over: 0, failed: '' },
    { name: 'due', status: 'due', next: TODAY, over: 0, failed: '' },
    { name: 'over 2', status: 'overdue', next: '2026-10-23', over: 2, failed: '' },
    { name: 'failed new', status: 'failed', next: '2026-10-30', over: 0, failed: '2026-10-23' },
    { name: 'ok soon', status: 'ok', next: '2026-10-27', over: 0, failed: '' },
    { name: 'over 5', status: 'overdue', next: '2026-10-20', over: 5, failed: '' },
    { name: 'never', status: 'new', next: '', over: 0, failed: '' },
    { name: 'failed old', status: 'failed', next: '2026-10-25', over: 0, failed: '2026-10-11' },
  ];
  assert.deepEqual([...list].sort(M.byUrgency).map((i) => i.name), ['failed old', 'failed new', 'over 5', 'over 2', 'never', 'due', 'ok soon', 'ok later']);
  // The checklist covers today and the 6 days after (25–31 Oct).
  assert.deepEqual(plain(M.checklistDays({ status: 'ok', next: '2026-10-28' }, 7, TODAY)), ['2026-10-28']);
  assert.deepEqual(plain(M.checklistDays({ status: 'overdue', next: '2026-10-20' }, 7, TODAY)), [TODAY]);
  assert.equal(M.checklistDays({ status: 'ok', next: '2026-10-26' }, 1, TODAY).length, 6);
  assert.equal(M.checklistDays({ status: 'failed', next: '2026-10-30' }, 1, TODAY).length, 7);
  assert.deepEqual(plain(M.checklistDays({ status: 'ok', next: '2026-11-20' }, 30, TODAY)), []);
});

test('saved data is cleaned: unknown keys fall back, a check of a removed device goes', () => {
  const M = load().PokaYokeMath;
  const freqs = ['shift', 'daily', 'weekly', 'monthly'];
  assert.equal(M.cleanDevice({ name: '  ' }, freqs), null);
  const d = M.cleanDevice({ id: 'x', name: ' Scale ', method: 'magic', func: 'stop', level: 'x', freq: 'hourly', last: '25.10.2026', before: '12,5', after: -1 }, freqs);
  assert.deepEqual(plain(d), { id: 'x', name: 'Scale', error: '', step: '', area: '', method: 'contact', func: 'warning', level: 'detect', owner: '', freq: 'shift', last: '', test: '', fmea: '', before: 12.5, after: null });
  const ids = new Set(['x']);
  assert.equal(M.cleanCheck({ device: 'y', date: TODAY, result: 'works' }, ids), null);
  assert.equal(M.cleanCheck({ device: 'x', date: TODAY, result: 'maybe' }, ids), null);
  assert.equal(M.cleanCheck({ device: 'x', date: TODAY, result: 'failed', by: ' Ana ' }, ids).by, 'Ana');
});

test('the example: 10 devices, dated back from today, and the numbers they give', () => {
  const w = load();
  const M = w.PokaYokeMath;
  const ex = M.exampleState(data.en, TODAY);
  assert.equal(ex.devices.length, 10);
  const daysOf = (freq) => data.en.frequencies.find((f) => f.key === freq).days;
  const info = ex.devices.map((d) => M.deviceInfo(d, ex.checks, daysOf(d.freq), TODAY));
  // Scanner ok (tested today), weight check due today, totes overdue 2 days (last test 9 days ago, weekly), label
  // interlock failed 2 days ago, gauge ok, encoder overdue 3 days (last test 4 days ago, daily), the rest ok.
  assert.deepEqual(plain(info.map((i) => i.status)), ['ok', 'due', 'overdue', 'failed', 'ok', 'overdue', 'ok', 'ok', 'ok', 'ok']);
  assert.deepEqual([info[2].over, info[5].over], [2, 3]);
  assert.equal(info[3].failed, ago(2));
  assert.equal(info[6].last, ago(15), 'the minibar test due 18 days ago was done 3 days late');
  // Compliance over the 30 days 26 Sep – 25 Oct (29 to 0 days ago), device by device:
  //   scanner 29 of 30 (due 12 days ago missed, done the day after) · weight 29 of 29 (due today not counted yet) ·
  //   totes 3 of 4 (23, 16, 9 met, 2 missed) · label 4 of 4 · gauge 1 of 1 · encoder 26 of 29 (3, 2, 1 missed) ·
  //   minibar 0 of 1 (18 missed) · room lock 5 of 5 · breakfast 30 of 30 · amenity kit 3 of 4 (25 missed).
  // 130 of 137 = 94.9 %.
  const c = M.compliance(ex.devices.map((device) => ({ device, interval: daysOf(device.freq) })), ex.checks, ago(29), TODAY, TODAY);
  assert.deepEqual(plain(c.per).map((p) => [p.onTime, p.due]), [[29, 30], [29, 29], [3, 4], [4, 4], [1, 1], [26, 29], [0, 1], [5, 5], [30, 30], [3, 4]]);
  assert.deepEqual([c.onTime, c.due], [130, 137]);
  // Tests in the period: 29 + 29 + 3 + 4 + 1 + 26 + 1 + 5 + 30 + 4 = 132, of which 3 failed (weight, label,
  // breakfast); 2 not tested (encoder, minibar).
  assert.deepEqual(plain(M.failureRate(ex.checks, ago(29), TODAY)), { tested: 132, failed: 3, untested: 2, rate: 3 / 132 });
  // Errors per month on the 9 devices with both figures: 183 before, 39 after.
  assert.deepEqual(plain(M.totalEffect(ex.devices)), { n: 9, before: 183, after: 39, rate: 144 / 183 });
  assert.deepEqual(plain(M.coverage(ex.devices, 'method', M.METHODS)).map((c) => c.n), [6, 2, 2]);
  assert.deepEqual(plain(M.coverage(ex.devices, 'level', M.LEVELS)).map((c) => c.n), [5, 5]);
  assert.deepEqual(plain(M.coverage(ex.devices, 'func', M.FUNCS)).map((c) => c.n), [5, 5]);
  // The same in every language, and on another day the dates move with it.
  for (const lang of ['de', 'sq']) assert.deepEqual(plain(M.exampleState(data[lang], TODAY).checks).map((k) => [k.device, k.date, k.result]), plain(ex.checks).map((k) => [k.device, k.date, k.result]));
  const later = M.exampleState(data.en, '2027-01-05');
  assert.equal(later.devices[0].last, '2026-12-01');
});

test('a first visit opens on the example: the numbers, the due list, the hand-offs and the checklist (German)', () => {
  const w = load({ lang: 'de', page: true });
  const doc = w.document;
  const results = doc.querySelector('[data-results]');
  assert.equal(results.hidden, false);
  assert.equal(doc.querySelector('[data-example-note]').hidden, false);
  const saved = JSON.parse(w.localStorage.getItem('sc-poka-yoke-de'));
  assert.equal(saved.devices.length, 10);
  assert.equal(saved.example, true);
  const stats = [...results.querySelectorAll('.dl-stat')].map((s) => s.textContent);
  assert.ok(stats.some((s) => /^Sicherungen10Vermeidung 5 · Entdeckung 5 · Eingriff 5 · Warnung 5$/.test(s)), stats.join(' | '));
  assert.ok(stats.some((s) => /^Überfällig2/.test(s)), stats.join(' | '));
  assert.ok(stats.some((s) => /^Ausgefallen1Verriegelung des Etikettendruckers$/.test(s)), stats.join(' | '));
  assert.ok(stats.some((s) => /^Prüftreue94,9\s%130 von 137 fälligen Prüfungen rechtzeitig · 26\.09\.2026 – 25\.10\.2026$/.test(s)), stats.join(' | '));
  assert.ok(stats.some((s) => /^Ausfallquote der Prüfungen2,3\s%3 von 132 Prüfungen nicht bestanden · 2 nicht geprüft$/.test(s)), stats.join(' | '));
  assert.ok(stats.some((s) => /^Fehler pro Monat−79\s%183 → 39/.test(s)), stats.join(' | '));
  // Most urgent first, with words, not colour only.
  const due = [...results.querySelectorAll('.py-due-item')].map((li) => li.querySelector('.py-status').textContent + ' ' + li.querySelector('strong').textContent);
  assert.deepEqual(due.slice(0, 4), [
    `✕ Ausgefallen · 23.10.2026 Verriegelung des Etikettendruckers`,
    `! Überfällig · 3 Tage Rücklesen am Schlüsselkarten-Encoder`,
    `! Überfällig · 2 Tage Farbcodierte Behälter je Paketdienst`,
    `• Heute fällig Gewichtskontrolle beim Packen`,
  ]);
  // The focus is the failed device, with its hand-offs in German paths.
  const focus = results.querySelector('.dl-focus');
  assert.match(focus.querySelector('h3').textContent, /Verriegelung des Etikettendruckers · Ausgefallen/);
  const action = [...focus.querySelectorAll('a')].find((a) => a.textContent === 'Zu den Maßnahmen');
  action.dispatchEvent(new w.MouseEvent('click', { bubbles: true, cancelable: true }));
  const url = new URL(action.href);
  assert.equal(url.pathname, '/de/tools/action-tracker/');
  assert.equal(url.searchParams.get('priority'), 'High');
  assert.equal(url.searchParams.get('source'), 'poka-yoke');
  assert.equal(url.searchParams.get('action'), 'Reparieren und erneut prüfen: Verriegelung des Etikettendruckers');
  assert.equal(url.searchParams.get('owner'), 'A. Krasniqi');
  const whys = [...focus.querySelectorAll('a')].find((a) => a.textContent === 'Weiter mit 5 Whys');
  assert.equal(new URL(whys.href).pathname, '/de/tools/five-whys/');
  assert.match(new URL(whys.href).searchParams.get('problem'), /^Verriegelung des Etikettendruckers ist bei der Prüfung ausgefallen: Versandetikett auf dem falschen Paket$/);
  const fmea = [...focus.querySelectorAll('a')].find((a) => a.textContent === 'FMEA öffnen');
  assert.equal(new URL(fmea.href).pathname, '/de/tools/fmea/');
  // Charts, the effectiveness ranking (largest cut first: the gauge has no figures) and the checklist.
  assert.ok(results.querySelectorAll('svg').length >= 1);
  const ranking = [...results.querySelectorAll('.dl-panel')].find((p) => /Rangfolge der Wirksamkeit/.test(p.textContent));
  assert.match(ranking.querySelector('.dl-bar').textContent, /Checklisten-Sperre „Zimmer fertig“ im PMS−93\s%/);
  const rows = results.querySelectorAll('.py-checklist-table tbody tr');
  assert.ok(rows.length >= 6, `${rows.length} checklist rows`);
  const scanner = [...rows].find((tr) => /Scan-Prüfung/.test(tr.textContent));
  assert.equal(scanner.querySelectorAll('.py-box').length, 6 * 3, 'tested today: 6 days of 3 shifts');
  assert.equal(doc.querySelectorAll('.py-table tbody tr').length, 10);
});

test('verifying: a failure offers the hand-offs and marks the device failed until it works; an own device replaces the example', () => {
  const w = load({ page: true });
  const doc = w.document;
  const verify = doc.querySelector('[data-verify-form]');
  const v = verify.elements;
  v.device.value = 'ex0';
  v.date.value = TODAY;
  v.result.value = 'failed';
  v.note.value = 'Wrong location accepted';
  verify.dispatchEvent(new w.Event('submit', { cancelable: true }));
  const handoff = doc.querySelector('[data-handoff]');
  assert.equal(handoff.hidden, false);
  const action = [...handoff.querySelectorAll('a')].find((a) => a.textContent === 'Add to actions');
  action.dispatchEvent(new w.MouseEvent('click', { bubbles: true, cancelable: true }));
  assert.equal(new URL(action.href).searchParams.get('priority'), 'High');
  assert.ok([...handoff.querySelectorAll('a')].some((a) => new URL(a.href).pathname === '/tools/five-whys/'));
  assert.ok([...handoff.querySelectorAll('a')].some((a) => new URL(a.href).pathname === '/tools/fmea/'));
  let saved = JSON.parse(w.localStorage.getItem('sc-poka-yoke'));
  assert.equal(w.PokaYokeMath.failedOn(saved.devices[0], saved.checks), TODAY);
  // "Not tested" needs a reason and does not clear the failure; "works" does.
  v.device.value = 'ex0';
  v.result.value = 'untested';
  v.note.value = '';
  verify.dispatchEvent(new w.Event('submit', { cancelable: true }));
  assert.match(doc.querySelector('[data-verify-status]').textContent, /Write why it could not be tested/);
  v.result.value = 'works';
  verify.dispatchEvent(new w.Event('submit', { cancelable: true }));
  saved = JSON.parse(w.localStorage.getItem('sc-poka-yoke'));
  assert.equal(w.PokaYokeMath.failedOn(saved.devices[0], saved.checks), '');
  assert.equal(saved.example, true, 'a check on the example keeps it an example');

  // The first own device replaces the example.
  const form = doc.querySelector('[data-device-form]');
  const f = form.elements;
  f.name.value = 'Torque wrench click';
  f.error.value = 'Bolt under-tightened';
  f.freq.value = 'weekly';
  f.last.value = '2026-10-20';
  f.before.value = '5';
  f.after.value = '1';
  form.dispatchEvent(new w.Event('submit', { cancelable: true }));
  saved = JSON.parse(w.localStorage.getItem('sc-poka-yoke'));
  assert.equal(saved.example, false);
  assert.equal(saved.devices.length, 1);
  assert.deepEqual([saved.devices[0].last, saved.devices[0].before, saved.devices[0].after, saved.checks.length], ['2026-10-20', 5, 1, 0]);
  assert.equal(doc.querySelector('[data-example-note]').hidden, true);
  assert.match(doc.querySelector('[data-results] h2').textContent, /^1 poka-yoke device · all proven to work$/);
  assert.match(doc.querySelector('.py-table .py-status').textContent, /OK · due in 2 days/);
});

test('a damaged or foreign saved state never throws; Albanian renders', () => {
  const w = load({ lang: 'sq', page: true, storage: { 'sc-poka-yoke-sq': { devices: [{ name: 'X', freq: 'nope' }, 'junk', null], checks: [{ device: 'nobody' }], period: 'x', example: 'yes' } } });
  const saved = w.document.querySelectorAll('.py-table tbody tr');
  assert.equal(saved.length, 1);
  assert.match(w.document.querySelector('.py-table .py-status').textContent, /Asnjëherë e verifikuar/);
  const w2 = load({ lang: 'sq', page: true });
  assert.match(w2.document.querySelector('[data-results] h2').textContent, /10 pajisje poka-yoke · 3 pa provë funksionimi sot/);
});
