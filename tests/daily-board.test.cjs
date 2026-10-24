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
  const ui = lang === 'en' ? {} : { ...read(`src/_data/${lang}/ui.json`), ...read('src/_data/i18n-parts/daily-board.json')[lang], ...read('src/_data/i18n-parts/pulse-board-3.json')[lang] };
  const env = new nunjucks.Environment(new nunjucks.FileSystemLoader(['src/_includes']), { autoescape: false });
  env.addFilter('t', (text) => ui[text] ?? text);
  env.addFilter('local', (url) => (lang === 'en' ? url : `/${lang}${url}`));
  env.addFilter('assetUrl', (url) => url);
  env.addFilter('scriptJson', (value) => JSON.stringify(value).replace(/[<>&]/g, (c) => `\\u${c.charCodeAt(0).toString(16).padStart(4, '0')}`));
  // The partial takes Room Inspection's data of its language itself, as the site gives it every data file.
  const rooms = { en: read('src/_data/roomInspection.json'), de: read('src/_data/de/roomInspection.json'), sq: read('src/_data/sq/roomInspection.json') };
  const body = env.render('partials/daily-board.njk', { cfg: data[lang], lang: lang === 'en' ? undefined : lang, roomInspection: rooms.en, de: { roomInspection: rooms.de }, sq: { roomInspection: rooms.sq } });
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
  if (lang !== 'en') w.UiStrings = { ...read(`src/_data/${lang}/ui.json`), ...read('src/_data/i18n-parts/daily-board.json')[lang], ...read('src/_data/i18n-parts/pulse-board-3.json')[lang] };
  for (const file of ['tool-kit', 'chart-kit', 'workplace', 'actions-store', 'room-inspection', 'maintenance-planner', 'daily-board']) w.eval(fs.readFileSync(`src/js/${file}.js`, 'utf8'));
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

// Room Inspection and the Maintenance Planner on the board.
const roomCfg = {
  threshold: 0.9,
  zones: [{ key: 'bathroom' }, { key: 'bed' }],
  templates: { standard: { questions: {
    bathroom: [{ text: 'No hair', weight: 3, critical: true }, { text: 'Mirror polished', weight: 1 }],
    bed: [{ text: 'Linen clean', weight: 2 }, { text: 'Lamp works', weight: 1, fix: 'maintenance' }],
  } } },
};
const RULES = data.en.rules;
const pass = { 'bathroom-0': 'pass', 'bathroom-1': 'pass', 'bed-0': 'pass', 'bed-1': 'pass' };
// n rooms inspected on a day, the first `fails` of them with the mirror failed (6 of 7, below the 90 % pass mark).
const roomsOn = (date, n, fails, extra = {}) => Array.from({ length: n }, (_, i) => ({ date, time: `08:${String(i).padStart(2, '0')}`, room: `${date.slice(8)}${String(i).padStart(2, '0')}`, template: 'standard', answers: i < fails ? { ...pass, 'bathroom-1': 'fail', ...extra } : pass }));

test('the board\'s own lines are in its data file, the same in every language, and its texts say them', () => {
  assert.deepEqual(RULES, { roomRed: 75, downtimeRed: 60 });
  for (const lang of ['en', 'de', 'sq']) {
    const d = data[lang];
    assert.deepEqual(d.rules, RULES, `${lang} rules`);
    const q = d.letters.find((l) => l.key === 'Q');
    const dl = d.letters.find((l) => l.key === 'D');
    assert.match(q.red, new RegExp(`${RULES.roomRed} %`), `${lang}: the red line of Room Inspection is written out`);
    assert.match(dl.red, new RegExp(`${RULES.downtimeRed} `), `${lang}: the downtime line is written out`);
    const tips = d.tips.map((tip) => tip.join(' ')).join(' ');
    assert.match(tips, new RegExp(`${RULES.roomRed} %`), `${lang}: the tips explain the room line`);
    assert.match(tips, new RegExp(`${RULES.downtimeRed} `), `${lang}: and the downtime line`);
  }
  assert.match(data.en.letters[1].sources, /Room Inspection/);
  assert.match(data.en.letters[2].sources, /Maintenance Planner/);
  assert.match(data.de.letters[1].sources, /Zimmerkontrolle/);
  assert.match(data.de.letters[2].sources, /Wartungsplaner/);
  assert.match(data.sq.letters[1].sources, /Inspektimi i dhomës/);
  assert.match(data.sq.letters[2].sources, /Planifikuesi i mirëmbajtjes/);
});

test('Quality: the first-time pass rate of the day against the pass mark, red below the board\'s line', () => {
  const w = load();
  const M = w.DailyBoardMath;
  assert.equal(M.roomState(0.9, 0.9, 0.75), 'green', 'at the pass mark');
  assert.equal(M.roomState(0.8, 0.9, 0.75), 'amber');
  assert.equal(M.roomState(0.75, 0.9, 0.75), 'amber', 'at the line is not below it');
  assert.equal(M.roomState(0.7, 0.9, 0.75), 'red');
  assert.equal(M.roomState(0.72, 0.7, 0.75), 'green', 'a pass mark set below the line: at or above it is green first');
  const rows = [
    ...roomsOn('2026-10-10', 10, 1), // 9 of 10: 90 %, green
    ...roomsOn('2026-10-11', 10, 2), // 8 of 10: 80 %, amber
    ...roomsOn('2026-10-12', 4, 2), // 2 of 4: 50 %, red
    // A critical item fails the room whatever the score; a room seen again the same day is a re-check, not counted.
    { date: '2026-10-13', time: '09:00', room: '501', template: 'standard', answers: { ...pass, 'bathroom-0': 'fail' } },
    { date: '2026-10-13', time: '10:00', room: '501', template: 'standard', answers: pass },
    { date: '2026-10-13', time: '11:00', room: '502', template: 'standard', answers: pass },
    { date: '2026-10-13', time: '11:30', room: '503', template: 'standard', answers: pass },
    { date: '2026-10-13', time: '12:00', room: '504', template: 'standard', answers: pass },
  ];
  const f = M.facts({ rooms: { rows } }, {}, {}, { rooms: roomCfg, rules: RULES });
  const q = (date) => M.dayState('Q', date, f, { today: '2026-10-23' });
  assert.equal(q('2026-10-10').state, 'green');
  assert.deepEqual(plain(q('2026-10-10').reasons), [{ code: 'rooms', rate: 0.9, mark: 0.9, red: 0.75, n: 9, first: 10 }]);
  assert.equal(q('2026-10-11').state, 'amber');
  assert.equal(q('2026-10-12').state, 'red');
  const critical = q('2026-10-13');
  assert.equal(critical.reasons[0].first, 4, 'the re-check of 501 is left out');
  assert.equal(critical.reasons[0].rate, 0.75);
  assert.equal(critical.state, 'amber');
  assert.equal(q('2026-10-14').state, 'none', 'a day without inspections says nothing');
  // The per-day rate is the tool's own: RoomInspectionMath.rateBy by date.
  const RI = w.RoomInspectionMath;
  const byDay = RI.rateBy(RI.annotate(rows, (row) => RI.itemsOf(roomCfg.templates[row.template], ['bathroom', 'bed']), 0.9), (row) => row.date);
  byDay.forEach((g) => assert.equal(q(g.key).reasons[0].rate, g.rate, g.key));
  // The pass mark the team saved in Room Inspection wins: at 80 %, 6 of 7 passes, so 11 October is green.
  const easy = M.facts({ rooms: { threshold: 0.8, rows } }, {}, {}, { rooms: roomCfg, rules: RULES });
  assert.equal(M.dayState('Q', '2026-10-11', easy).state, 'green');
  // With the other Quality logs the worst wins, and an entry by hand still overrules.
  const both = M.facts({ rooms: { rows }, damage: { rows: [{ date: '2026-10-10', units: 2 }], volumes: [{ date: '2026-10-10', volume: 100 }] } }, { damage: 0.003 }, {}, { rooms: roomCfg, rules: RULES });
  assert.equal(M.dayState('Q', '2026-10-10', both).state, 'red', '2 % damage against 0.3 %');
  assert.equal(M.dayState('Q', '2026-10-12', f, { manual: { state: 'green', note: 'checked' } }).state, 'green');
  // Without the tool's script, the rooms are left out rather than counted another way.
  assert.equal(M.roomDays({ rows }, roomCfg, null).byDate.size, 0);
});

test('Delivery: a breakdown is amber, more downtime than the board\'s line is red, and the routes still count', () => {
  const M = load().DailyBoardMath;
  assert.equal(M.breakdownState(0, 0, 60), 'none');
  assert.equal(M.breakdownState(1, 20, 60), 'amber');
  assert.equal(M.breakdownState(2, 60, 60), 'amber', '60 minutes is not more than 60');
  assert.equal(M.breakdownState(1, 61, 60), 'red');
  const maintenance = {
    assets: [{ id: 'a1', tag: 'SRT-1', crit: 'A', tasks: [] }, { id: 'a2', tag: 'FLT-2', crit: 'B', tasks: [] }],
    rows: [
      { kind: 'breakdown', asset: 'a1', date: '2026-10-10', minutes: 25 },
      { kind: 'breakdown', asset: 'a1', date: '2026-10-11', minutes: 40 },
      { kind: 'breakdown', asset: 'a2', date: '2026-10-11', minutes: 30 },
      { kind: 'breakdown', asset: 'gone', date: '2026-10-12', minutes: 500 },
      { kind: 'done', asset: 'a1', date: '2026-10-12', task: 't1', minutes: 90 },
    ],
  };
  const delay = { rows: [{ date: '2026-10-10', planArr: '08:00', actArr: '08:00' }, { date: '2026-10-13', planArr: '08:00', actArr: '09:00' }] };
  const f = M.facts({ maintenance, delay }, { ontime: 0.95 }, {}, { rules: RULES });
  const d = (date) => M.dayState('D', date, f, { today: '2026-10-23' });
  assert.equal(d('2026-10-10').state, 'amber', 'on time, but a breakdown of 25 minutes');
  assert.deepEqual(plain(d('2026-10-10').reasons.map((r) => r.code)), ['ontime', 'breakdown']);
  assert.equal(d('2026-10-11').state, 'red', '40 + 30 = 70 minutes of downtime');
  assert.deepEqual(plain(d('2026-10-11').reasons), [{ code: 'breakdown', n: 2, minutes: 70, red: 60 }]);
  assert.equal(d('2026-10-12').state, 'none', 'an asset no longer in the plan, and a task done, are no breakdowns');
  assert.equal(d('2026-10-13').state, 'red', 'the late route alone');
  assert.equal(M.dayState('D', '2026-10-11', f, { manual: { state: 'green' } }).state, 'green', 'the hand overrules');
});

test('the huddle hears the overdue tasks on A assets, by the planner\'s own due dates', () => {
  const w = load();
  const M = w.DailyBoardMath;
  const saved = {
    assets: [
      { id: 'a1', tag: 'SRT-1', name: 'Sorter', crit: 'A', tasks: [
        { id: 't1', text: 'Belt check', every: 1, unit: 'months', hours: 0, last: '', lastHours: null, start: '' }, // done 15 August: due 15 September
        { id: 't2', text: 'Lubricate chain', every: 2, unit: 'weeks', hours: 0, last: '2026-10-01', lastHours: null, start: '' }, // due 15 October, postponed to 30th
        { id: 't3', text: 'Light curtain test', every: 1, unit: 'weeks', hours: 0, last: '2026-10-20', lastHours: null, start: '' }, // due 27 October
      ] },
      { id: 'a2', tag: 'FLT-2', name: 'Forklift', crit: 'B', tasks: [{ id: 't4', text: 'Brake test', every: 1, unit: 'years', hours: 0, last: '2025-09-10', lastHours: null, start: '' }] },
      { id: 'a3', tag: 'DOCK-1', name: 'Dock leveller', crit: 'A', tasks: [{ id: 't5', text: 'Statutory check', every: 1, unit: 'years', hours: 0, last: '', lastHours: null, start: '2026-10-20' }] },
    ],
    rows: [
      { kind: 'done', asset: 'a1', task: 't1', date: '2026-08-15' },
      { kind: 'postponed', asset: 'a1', task: 't2', date: '2026-10-14', until: '2026-10-30', reason: 'Part on order' },
    ],
  };
  const list = plain(M.overdueOnA(saved, '2026-10-23'));
  // The belt check: done 15 August, monthly, so due 15 September, 38 days ago. The chain is postponed to the 30th, the
  // light curtain due on the 27th, the forklift is a B asset. The dock leveller was never done: due on its start date.
  assert.deepEqual(list, [
    { task: 'Belt check', asset: 'SRT-1 · Sorter', due: '2026-09-15', late: 38 },
    { task: 'Statutory check', asset: 'DOCK-1 · Dock leveller', due: '2026-10-20', late: 3 },
  ]);
  assert.equal(list[0].due, w.MaintenancePlannerMath.nextDue(saved.assets[0].tasks[0], saved.rows).due);
  assert.deepEqual(plain(M.overdueOnA(saved, '2026-10-23', null)), [], 'without the planner\'s script, nothing is guessed');
});

test('the page: Room Inspection colours Quality, the planner Delivery, and the agenda reads the overdue A tasks', () => {
  const w = load({
    lang: 'de',
    page: true,
    storage: {
      'sc-workplace': { site: 'Hotel Nord', areas: [], targets: {} },
      'sc-room-inspection-de': { threshold: 0.9, rows: roomsOn('2026-10-22', 4, 2).map((row) => ({ ...row, template: 'standard' })) },
      'sc-maintenance-planner-de': {
        assets: [{ id: 'a1', tag: 'AUF-1', name: 'Aufzug', crit: 'A', tasks: [{ id: 't1', text: 'Seilprüfung', every: 1, unit: 'months', hours: 0, last: '2026-09-01', lastHours: null, start: '' }] }],
        rows: [{ kind: 'breakdown', asset: 'a1', date: '2026-10-22', minutes: 90, cause: 'other' }],
      },
      'sc-daily-board-de': { rows: [] },
    },
  });
  const doc = w.document;
  assert.ok(doc.getElementById('daily-board-rooms'), 'the checklists of the German Room Inspection go along');
  const agenda = doc.querySelector('.db-agenda').textContent;
  // On the real German checklist bathroom-1 is a critical item (the toilet): two of four rooms fail, 50 %, red.
  assert.match(agenda, /Qualität: Rot · Erstabnahme 50\s?% \(Bestehensgrenze 90\s?%\): 2 von 4 Zimmern/, 'yesterday\'s rooms on the agenda');
  assert.match(agenda, /Lieferung: Rot · 1 Störung, 90 Min\. Ausfallzeit/, 'yesterday\'s breakdown, over the 60-minute line');
  assert.match(agenda, /Überfällig an einer A-Anlage: Seilprüfung · AUF-1 · Aufzug · fällig am 01\.10\.2026/);
  assert.match(doc.querySelector('.db-rules').textContent, /Zimmerkontrolle/);
  assert.match(doc.querySelector('.db-rules').textContent, /Wartungsplaner/);
  assert.match(doc.querySelector('.tips').textContent, /unter 75 %/);
});

test('every text of the board\'s script has German and Albanian', () => {
  const source = fs.readFileSync('src/js/daily-board.js', 'utf8');
  const texts = new Set([...source.matchAll(/tx\("((?:[^"\\]|\\.)*)"/g)].map((m) => JSON.parse(`"${m[1]}"`)));
  for (const lang of ['de', 'sq']) {
    const ui = { ...read(`src/_data/${lang}/ui.json`), ...read('src/_data/i18n-parts/daily-board.json')[lang], ...read('src/_data/i18n-parts/pulse-board-3.json')[lang] };
    for (const text of texts) assert.ok(ui[text], `${lang}: ${text}`);
  }
});
