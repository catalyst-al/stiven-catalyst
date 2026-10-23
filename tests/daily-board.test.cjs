// The Daily Board (src/js/daily-board.js): the colour of a day for each SQDCP letter, from the logs of the other
// tools and the entries typed by hand, and the page that shows a month of it.
process.env.TZ = 'Europe/Berlin';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const { JSDOM } = require('jsdom');
const nunjucks = require('nunjucks');

const plain = (value) => JSON.parse(JSON.stringify(value));
const read = (file) => JSON.parse(fs.readFileSync(file, 'utf8'));
const data = { en: read('src/_data/dailyBoard.json'), de: read('src/_data/de/dailyBoard.json'), sq: read('src/_data/sq/dailyBoard.json') };

// The partial rendered the way the site renders it (the filters stubbed as in scripts/check-tool.mjs), without its
// <script src> tags: the test loads the scripts itself.
const pageHtml = (lang) => {
  const ui = lang === 'en' ? {} : { ...read(`src/_data/${lang}/ui.json`), ...read('src/_data/i18n-parts/daily-board.json')[lang] };
  const env = new nunjucks.Environment(new nunjucks.FileSystemLoader(['src/_includes']), { autoescape: false });
  env.addFilter('t', (text) => ui[text] ?? text);
  env.addFilter('local', (url) => (lang === 'en' ? url : `/${lang}${url}`));
  env.addFilter('assetUrl', (url) => url);
  env.addFilter('scriptJson', (value) => JSON.stringify(value).replace(/[<>&]/g, (c) => `\\u${c.charCodeAt(0).toString(16).padStart(4, '0')}`));
  const body = env.render('partials/daily-board.njk', { cfg: data[lang], lang: lang === 'en' ? undefined : lang });
  return `<html lang="${lang}"><body>${body.replace(/<script src=[^>]*><\/script>/g, '')}</body></html>`;
};

const load = ({ lang = 'sq', page = false, now = '2026-10-23T10:00:00Z', storage = {} } = {}) => {
  const url = `https://example.test${lang === 'en' ? '' : `/${lang}`}/tools/daily-board/`;
  const dom = new JSDOM(page ? pageHtml(lang) : `<html lang="${lang}"><body></body></html>`, { url, runScripts: 'outside-only', pretendToBeVisual: true });
  const w = dom.window;
  w.eval(`(() => { const Real = Date; const fixed = new Real(${JSON.stringify(now)}); Date = class extends Real { constructor(...args) { super(...(args.length ? args : [fixed])); } static now() { return fixed.getTime(); } }; })();`);
  w.confirm = () => true;
  w.HTMLElement.prototype.scrollIntoView = () => {};
  Object.entries(storage).forEach(([key, value]) => w.localStorage.setItem(key, JSON.stringify(value)));
  // The page's translations, as js/ui-de.js and js/ui-sq.js give them (ui.json and this tool's part, not yet merged).
  if (lang !== 'en') w.UiStrings = { ...read(`src/_data/${lang}/ui.json`), ...read('src/_data/i18n-parts/daily-board.json')[lang] };
  for (const file of ['tool-kit', 'chart-kit', 'workplace', 'actions-store', 'daily-board']) w.eval(fs.readFileSync(`src/js/${file}.js`, 'utf8'));
  return w;
};

test('the three data files share their shape, and each language keeps its own board', () => {
  const shape = (value) => (Array.isArray(value) ? 'array' : value && typeof value === 'object' ? Object.keys(value).sort() : typeof value);
  for (const lang of ['de', 'sq']) {
    const other = data[lang];
    assert.deepEqual(Object.keys(other).sort(), Object.keys(data.en).sort(), lang);
    assert.equal(other.storageKey, `sc-daily-board-${lang}`);
    assert.deepEqual(other.letters.map((l) => l.key), ['S', 'Q', 'D', 'C', 'P'], `${lang} letters`);
    other.letters.forEach((letter, i) => assert.deepEqual(shape(letter), shape(data.en.letters[i]), `${lang} letter ${i}`));
    assert.deepEqual(Object.keys(other.states).sort(), ['amber', 'green', 'red']);
    assert.deepEqual(other.targets.map((t) => [t.key, t.unit, t.default]), data.en.targets.map((t) => [t.key, t.unit, t.default]), `${lang} targets`);
    assert.equal(other.months.length, 12);
    assert.equal(other.safetyMessages.length, data.en.safetyMessages.length, `${lang} messages`);
    assert.equal(other.tips.length, data.en.tips.length, `${lang} tips`);
    assert.deepEqual(Object.keys(other.example).sort(), Object.keys(data.en.example).sort());
    assert.deepEqual(other.example.profile.targets, data.en.example.profile.targets);
    assert.equal(other.example.profile.areas.length, data.en.example.profile.areas.length);
    other.example.rows.forEach((row, i) => {
      const en = data.en.example.rows[i];
      assert.deepEqual([row.ago, row.letter, row.state], [en.ago, en.letter, en.state], `${lang} example row ${i}`);
      assert.ok(other.shifts.includes(row.shift), `${lang} example row ${i} shift`);
    });
  }
  assert.equal(data.en.storageKey, 'sc-daily-board');
  assert.deepEqual(data.en.targets.map((t) => t.key), ['damage', 'incomplete', 'ontime', 'fives', 'cost', 'absence']);
});

test('the small rules: minutes late, the 5S score, counts, rates and on time against their targets', () => {
  const M = load().DailyBoardMath;
  assert.equal(M.minutesLate('23:50', '00:20'), 30, 'a night route across midnight');
  assert.equal(M.minutesLate('10:00', ''), null);
  assert.equal(M.fivesScore({ scores: { S: [4, 2], Q: [null, 3, null] } }), 9 / 12, 'an unscored question is no zero');
  assert.equal(M.fivesScore({ scores: {} }), null);
  assert.equal(M.countState(0, 2), 'green');
  assert.equal(M.countState(3, null), 'amber', 'no usual day yet: a question for the huddle');
  assert.equal(M.countState(3, 2), 'amber');
  assert.equal(M.countState(8, 2), 'red', 'beyond usual + 3 √usual');
  assert.equal(M.countState(1, 0), 'amber', 'one entry alone is never red');
  assert.equal(M.rateState(0.004, 0.003), 'red');
  assert.equal(M.rateState(0.0025, 0.003), 'amber');
  assert.equal(M.rateState(0.001, 0.003), 'green');
  assert.equal(M.onTimeState(0.9, 0.95), 'red');
  assert.equal(M.onTimeState(0.97, 0.95), 'amber');
  assert.equal(M.onTimeState(1, 0.95), 'green');
  assert.deepEqual(plain(M.monthDays('2028-02')).length, 29, 'a leap year');
  assert.equal(M.addMonths('2026-01', -1), '2025-12');
  assert.equal(M.addMonths('2026-12', 1), '2027-01');
});

test('Safety: the Safety Cross types and the 5S audit colour the day', () => {
  const M = load().DailyBoardMath;
  const f = M.facts({
    safety: { rows: [
      { date: '2026-10-01', type: 'positive' },
      { date: '2026-10-03', type: 'near-miss' },
      { date: '2026-10-03', type: 'unsafe-act' },
      { date: '2026-10-05', type: 'lost-time' },
      { date: '2026-10-06', type: 'first-aid' },
      { date: '2026-10-07', type: 'unsafe-condition' },
    ] },
    fives: { rows: [{ date: '2026-10-08', area: 'Dock 1', scores: { S: [4, 4] } }, { date: '2026-10-08', area: 'Picking', scores: { S: [2, 2] } }] },
  }, { fives: 0.8 });
  const at = (date) => M.dayState('S', date, f, { today: '2026-10-23' });
  assert.equal(at('2026-09-30').state, 'none', 'before the cross was kept: no data');
  assert.equal(at('2026-10-01').state, 'green', 'a positive observation: the cross was kept, nothing happened');
  assert.equal(at('2026-10-02').state, 'green', 'a quiet day once the cross is in use');
  const amber = at('2026-10-03');
  assert.equal(amber.state, 'amber');
  assert.deepEqual(plain(amber.reasons.map((r) => [r.code, r.n])), [['nearMiss', 1], ['unsafe', 1]]);
  assert.equal(at('2026-10-05').state, 'red', 'an accident with lost time');
  assert.equal(at('2026-10-06').state, 'red', 'first aid');
  assert.equal(at('2026-10-07').state, 'amber');
  const fives = at('2026-10-08');
  assert.equal(fives.state, 'amber', 'the worst area of the day is below the 5S target');
  assert.equal(fives.reasons.find((r) => r.code === 'fives').pct, 0.5);
  assert.equal(at('2026-10-24').state, 'future');
});

test('Quality and Delivery: rates with a volume, counts against the usual day, on time against the target', () => {
  const M = load().DailyBoardMath;
  const damage = { rows: [], volumes: [{ date: '2026-10-10', volume: 1000 }, { date: '2026-10-11', volume: 1000 }] };
  for (let d = 1; d <= 9; d++) damage.rows.push({ date: `2026-10-0${d}`, units: 1 });
  damage.rows.push({ date: '2026-10-10', units: 5 }, { date: '2026-10-11', units: 2 }, { date: '2026-10-12', units: 9 });
  const delay = { arrivalGrace: '10', rows: [
    { date: '2026-10-10', planArr: '08:00', actArr: '08:05' }, { date: '2026-10-10', planArr: '09:00', actArr: '09:30' },
    { date: '2026-10-11', planArr: '08:00', actArr: '08:00' },
  ] };
  for (let i = 0; i < 19; i++) delay.rows.push({ date: '2026-10-12', planArr: '08:00', actArr: '08:00' });
  delay.rows.push({ date: '2026-10-12', planArr: '08:00', actArr: '08:45' });
  const f = M.facts({ damage, delay }, { damage: 0.003, ontime: 0.95 });
  const q = (date) => M.dayState('Q', date, f, { today: '2026-10-23' });
  assert.equal(q('2026-10-10').state, 'red', '0.5 % against 0.3 %');
  assert.equal(q('2026-10-10').reasons[0].code, 'rate');
  assert.equal(q('2026-10-11').state, 'green', '0.2 % against 0.3 %');
  assert.equal(q('2026-10-12').state, 'red', 'no volume: 9 against a usual day of about 1.7');
  assert.equal(q('2026-10-12').reasons[0].code, 'count');
  assert.equal(q('2026-10-13').state, 'green', 'nothing logged once the log is in use');
  const d = (date) => M.dayState('D', date, f, { today: '2026-10-23' });
  assert.equal(d('2026-10-10').state, 'red', 'one of two late: 50 % on time');
  assert.equal(d('2026-10-11').state, 'green');
  assert.equal(d('2026-10-12').state, 'amber', '95 % on time is within 5 points of the target');
  assert.equal(d('2026-10-13').state, 'none', 'no routes logged that day');
  // Without a saved grace, 15 minutes.
  const g = M.facts({ delay: { rows: [{ date: '2026-10-10', planArr: '08:00', actArr: '08:12' }] } }, { ontime: 0.95 });
  assert.equal(M.dayState('D', '2026-10-10', g).state, 'green');
});

test('an entry by hand wins over the logs, the worst entry of a day wins, and a month is counted', () => {
  const M = load().DailyBoardMath;
  const rows = [
    { date: '2026-10-05', letter: 'S', state: 'green', note: 'checked' },
    { date: '2026-10-05', letter: 'C', state: 'amber' },
    { date: '2026-10-05', letter: 'C', state: 'red', note: 'Overtime 14 h' },
    { date: '2026-10-06', letter: 'X', state: 'red' },
    { date: '2026-10-07', letter: 'P', state: 'purple' },
  ];
  assert.equal(M.manualMap(rows).size, 2, 'unknown letters and states are dropped');
  assert.equal(M.manualMap(rows).get('2026-10-05|C').state, 'red');
  const model = M.board('2026-10', { safety: { rows: [{ date: '2026-10-05', type: 'lost-time' }] } }, rows, { today: '2026-10-23' });
  const day = model.days.find((x) => x.date === '2026-10-05');
  assert.equal(day.letters.S.state, 'green', 'the hand overrules the cross');
  assert.ok(day.letters.S.manual);
  assert.equal(day.letters.C.reasons[0].note, 'Overtime 14 h');
  assert.equal(model.days.length, 31);
  assert.deepEqual(plain(model.counts.C), { red: 1, amber: 0, green: 0, none: 22, future: 8 });
  assert.equal(model.counts.S.green, 19, 'from the 5th to the 23rd');
  assert.equal(M.safetyIndex('2026-10-23', 12), M.safetyIndex('2026-10-23', 12), 'the same message all day');
  assert.notEqual(M.safetyIndex('2026-10-23', 12), M.safetyIndex('2026-10-24', 12));
});

test('the page: the example opens on a first visit with a demo profile, and leaves with it', () => {
  const w = load({ page: true });
  const doc = w.document;
  const results = doc.querySelector('[data-results]');
  assert.ok(!results.hidden, 'the result is shown');
  assert.ok(!doc.querySelector('.dl-example-note').hidden, 'the note says it is an example');
  assert.equal(doc.querySelectorAll('.db-cal').length, 5, 'five calendars');
  assert.equal(doc.querySelectorAll('.db-chip').length, 5, 'one chip per letter today');
  assert.match(doc.querySelector('.db-chip').textContent, /Siguria/);
  assert.equal(w.Workplace.get().site, data.sq.example.profile.site, 'the demo profile');
  assert.equal(doc.querySelectorAll('.db-agenda > li').length, 5, 'five agenda steps');
  assert.match(doc.querySelector('.db-agenda').textContent, /Tabela e djeshme/);
  assert.match(results.textContent, /Kostoja e kuqe|Cilësia/, 'yesterday’s red is on the agenda');
  assert.equal(doc.querySelectorAll('[data-log] tr').length, 25, 'the newest 25 rows of the example');
  assert.ok(doc.querySelector('.db-results a[href*="/sq/tools/action-tracker/"]'), 'a hand-off to the tracker in the page’s language');
  assert.ok(doc.querySelector('.db-results a[href*="/sq/tools/five-whys/?problem="]'), 'and to 5 Whys');
  // The month before has a calendar too; the next month after today is not offered.
  const [back, forward] = doc.querySelectorAll('.db-month-nav button');
  assert.ok(forward.disabled);
  back.click();
  assert.match(doc.querySelector('.db-month').textContent, /Shtator 2026/);
  // An entry of one's own replaces the example, and the demo profile goes with it.
  const form = doc.querySelector('[data-entry]');
  form.elements.letter.value = 'P';
  form.elements.state.value = 'red';
  form.elements.note.value = 'Katër mungesa';
  form.dispatchEvent(new w.Event('submit', { bubbles: true, cancelable: true }));
  assert.ok(doc.querySelector('.dl-example-note').hidden);
  assert.equal(w.Workplace.get().site, '', 'the demo profile left with the example');
  assert.equal(doc.querySelectorAll('[data-log] tr').length, 1);
  assert.equal(doc.querySelector('[data-log] tr').children[3].textContent.trim(), 'E kuqe');
});

test('the page: a real profile stays, logs of this language are read, pasted rows are imported', () => {
  const w = load({
    lang: 'de',
    page: true,
    storage: {
      'sc-workplace': { site: 'Lager Nord', areas: [{ name: 'Tor 1', owner: 'Anna' }], targets: { ontime: 95 } },
      'sc-safety-cross-de': { rows: [{ date: '2026-10-22', type: 'first-aid' }] },
      'sc-safety-cross': { rows: [{ date: '2026-10-22', type: 'lost-time' }] },
      'sc-shift-handover-de': { current: { issues: [{ text: 'Tor 4 klemmt', owner: 'Emir', carried: 2 }, { text: 'Erledigt', done: true }] } },
      'sc-actions': { rows: [{ id: 'a1', title: 'Gehweg markieren', owner: 'Anna', due: '2026-10-20', status: 'open' }] },
      'sc-daily-board-de': { rows: [] },
    },
  });
  const doc = w.document;
  assert.equal(w.Workplace.get().site, 'Lager Nord', 'a real profile is never replaced');
  assert.ok(!doc.querySelector('[data-results]').hidden, 'the logs alone are enough for a board');
  const chip = doc.querySelector('.db-chip');
  assert.ok(chip.classList.contains('is-ok'), 'today is quiet once the cross is in use');
  assert.match(doc.querySelector('.db-agenda').textContent, /Sicherheit: Rot · 1 Erste-Hilfe-Fall/, 'yesterday’s first aid, from the German cross');
  assert.match(doc.querySelector('.db-results').textContent, /Tor 4 klemmt/);
  assert.match(doc.querySelector('.db-results').textContent, /Gehweg markieren/);
  assert.match(doc.querySelector('.db-agenda').textContent, /Tor 1 · Anna/);
  const paste = doc.querySelector('#db-paste');
  paste.value = 'Datum;Schicht;Buchstabe;Status;Notiz\n21.10.2026;Spät;Kosten;Gelb;Überstunden 9 h\n2026-10-20;Früh;P;red;\nkein Datum;Früh;C;rot;';
  doc.querySelector('[data-import]').click();
  assert.equal(doc.querySelectorAll('[data-log] tr').length, 2);
  assert.match(doc.querySelector('[data-import-status]').textContent, /2 Zeilen/);
});
