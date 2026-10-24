// Leader Standard Work (src/js/leader-standard-work.js): the due tasks per frequency in window.LeaderStandardWorkMath
// (daily at a time, every shift after its start, weekly on a weekday, monthly on a day with the rule for shorter months
// and days off), the adherence with its exclusions, "not recorded" once a day is over, the share of the day in
// standard work against Mann's guide, the repeat-miss rule, the calendar file, the three data files and the page: the
// example on a first visit, checking off a day, a leader of one's own, the hand-offs and the translations.
process.env.TZ = 'Europe/Berlin';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const nunjucks = require('nunjucks');
const { JSDOM } = require('jsdom');

const plain = (value) => JSON.parse(JSON.stringify(value));
const read = (file) => JSON.parse(fs.readFileSync(file, 'utf8'));
const DATA = { en: 'src/_data/leaderStandardWork.json', de: 'src/_data/de/leaderStandardWork.json', sq: 'src/_data/sq/leaderStandardWork.json' };
const KEY = { en: 'sc-leader-standard-work', de: 'sc-leader-standard-work-de', sq: 'sc-leader-standard-work-sq' };

const env = new nunjucks.Environment(new nunjucks.FileSystemLoader('src/_includes'), { autoescape: false });
env.addFilter('t', (text) => text);
env.addFilter('local', (url, lang) => (lang && lang !== 'en' ? `/${lang}${url}` : url));
env.addFilter('assetUrl', (url) => url);
env.addFilter('scriptJson', (value) => JSON.stringify(value).replace(/</g, '\\u003c'));
const partial = (lang) => env.render('partials/leader-standard-work.njk', { cfg: read(DATA[lang]), lang: lang === 'en' ? undefined : lang })
  .replace(/<script src=[^>]*><\/script>/g, '');

// Saturday 24 October 2026, 11:30 in Berlin.
const NOW = '2026-10-24T09:30:00Z';
// German and Albanian pages carry their translations (ui.json and this tool's part, as the integrator merges them).
const strings = (lang) => (lang === 'en' ? '' : `<script type="application/json" id="ui-strings">${JSON.stringify({ ...read(`src/_data/${lang}/ui.json`), ...read('src/_data/i18n-parts/leader-standard-work.json')[lang] }).replace(/</g, '\\u003c')}</script>`);
const load = ({ lang = 'en', page = true, now = NOW, storage = {} } = {}) => {
  const base = lang === 'en' ? '' : `/${lang}`;
  const html = `<html lang="${lang}"><body>${strings(lang)}<main id="main">${page ? partial(lang) : ''}</main></body></html>`;
  const dom = new JSDOM(html, { url: `https://example.test${base}/tools/leader-standard-work/`, runScripts: 'outside-only', pretendToBeVisual: true });
  const w = dom.window;
  w.eval(`(() => { const Real = Date; const fixed = new Real(${JSON.stringify(now)}); Date = class extends Real { constructor(...args) { super(...(args.length ? args : [fixed])); } static now() { return fixed.getTime(); } }; })();`);
  w.confirm = () => true;
  w.print = () => {};
  w.HTMLElement.prototype.scrollIntoView = () => {};
  w.blobs = [];
  w.URL.createObjectURL = (blob) => { w.blobs.push(blob); return 'blob:test'; };
  w.URL.revokeObjectURL = () => {};
  Object.entries(storage).forEach(([key, value]) => w.localStorage.setItem(key, JSON.stringify(value)));
  for (const file of ['tool-kit', 'chart-kit', 'workplace', 'actions-store', 'template-pack', 'leader-standard-work']) w.eval(fs.readFileSync(`src/js/${file}.js`, 'utf8'));
  return w;
};
const math = () => load({ page: false }).LeaderStandardWorkMath;
const saved = (w, key = KEY.en) => JSON.parse(w.localStorage.getItem(key));
const click = (w, node) => node.dispatchEvent(new w.MouseEvent('click', { bubbles: true }));
const type = (w, input, value) => { input.value = value; input.dispatchEvent(new w.Event('input', { bubbles: true })); input.dispatchEvent(new w.Event('change', { bubbles: true })); };
const shape = (value) => (Array.isArray(value) ? value.map(shape) : value && typeof value === 'object'
  ? Object.fromEntries(Object.keys(value).sort().map((key) => [key, shape(value[key])])) : typeof value);

// A leader for the hand-worked cases: early shift 06:00 for 8 hours, Monday to Friday.
const LEADER = {
  id: 'a', name: 'Lena', level: 'team', start: '06:00', hours: 8, days: [1, 2, 3, 4, 5], since: '2026-01-01',
  tasks: [
    { id: 'd', title: 'Daily check', freq: 'daily', time: '09:30', offset: 0, weekday: 1, monthDay: 1, minutes: 20, done: '', tool: '', since: '' },
    { id: 's', title: 'Huddle', freq: 'shift', time: '', offset: 15, weekday: 1, monthDay: 1, minutes: 10, done: '', tool: 'daily-board', since: '' },
    { id: 'w', title: 'Kaizen, review', freq: 'weekly', time: '10:00', offset: 0, weekday: 3, monthDay: 1, minutes: 30, done: 'One idea decided', tool: 'kaizen-board', since: '' },
    { id: 'w2', title: 'Skills', freq: 'weekly', time: '10:00', offset: 0, weekday: 6, monthDay: 1, minutes: 30, done: '', tool: '', since: '' },
    { id: 'm', title: 'Safety audit', freq: 'monthly', time: '11:00', offset: 0, weekday: 1, monthDay: 31, minutes: 60, done: '', tool: 'safety-cross', since: '' },
  ],
};
const dates = (list, taskId) => list.filter((o) => o.taskId === taskId).map((o) => o.date);

test('the default guide shares follow Mann: 80 % team leader, 50 % shift lead, 25 % area manager, 10 % site manager', () => {
  const M = math();
  assert.deepEqual(plain(M.LEVEL_SHARE), { team: 0.8, shift: 0.5, area: 0.25, site: 0.1 });
  assert.deepEqual(plain(M.FREQS), ['daily', 'shift', 'weekly', 'monthly']);
  assert.equal(M.REPEAT_COUNT, 3);
  assert.equal(M.REPEAT_DAYS, 14);
});

test('due tasks: daily and per shift on working days, weekly on its weekday, a day off moves it to the next working day', () => {
  const M = math();
  // Monday 26 January to Sunday 1 February 2026.
  const week = plain(M.schedule(LEADER, '2026-01-26', '2026-02-01'));
  assert.deepEqual(dates(week, 'd'), ['2026-01-26', '2026-01-27', '2026-01-28', '2026-01-29', '2026-01-30'], 'daily: Monday to Friday, not the weekend');
  assert.deepEqual(dates(week, 's'), dates(week, 'd'), 'per shift: once in every shift the leader works');
  assert.deepEqual(dates(week, 'w'), ['2026-01-28'], 'weekly on Wednesday');
  assert.deepEqual(dates(week, 'w2'), ['2026-01-26'], 'Saturday 24 January is a day off: Monday 26');
  assert.deepEqual(dates(week, 'm'), [], 'Saturday 31 January moves to Monday 2 February, outside this week');
  assert.equal(week.length, 12);
  // Time order within a day: the huddle (06:15), the daily check (09:30), the moved weekly task (10:00).
  assert.deepEqual(week.filter((o) => o.date === '2026-01-26').map((o) => [o.taskId, o.minute]), [['s', 375], ['d', 570], ['w2', 600]]);
  assert.equal(week[0].key, 'a|s|2026-01-26');
  assert.deepEqual(plain(M.dueOn(LEADER, '2026-01-31')), [], 'nothing on a Saturday');
  // Nothing before the standard started, nor before a task was added.
  assert.deepEqual(plain(M.schedule({ ...LEADER, since: '2026-01-29' }, '2026-01-26', '2026-02-01')).map((o) => o.date).filter((d, i, a) => a.indexOf(d) === i), ['2026-01-29', '2026-01-30']);
  const late = { ...LEADER, tasks: [{ ...LEADER.tasks[0], since: '2026-01-30' }] };
  assert.deepEqual(dates(plain(M.schedule(late, '2026-01-26', '2026-02-01')), 'd'), ['2026-01-30']);
});

test('monthly on a day: day 31 is the last day of a shorter month, and a day off moves it to the next working day', () => {
  const M = math();
  assert.equal(M.monthDate(2026, 2, 31), '2026-02-28');
  assert.equal(M.monthDate(2028, 2, 31), '2028-02-29', 'a leap year');
  assert.equal(M.monthDate(2026, 4, 31), '2026-04-30');
  assert.equal(M.monthDate(2026, 4, 15), '2026-04-15');
  assert.equal(M.lastDayOfMonth(2026, 2), 28);
  // 31 Jan (Sat) → Mon 2 Feb; 28 Feb (Sat) → Mon 2 Mar; 31 Mar (Tue); 30 Apr (Thu); 31 May (Sun) → Mon 1 Jun, after the period.
  assert.deepEqual(dates(plain(M.schedule(LEADER, '2026-01-01', '2026-05-31')), 'm'), ['2026-02-02', '2026-03-02', '2026-03-31', '2026-04-30']);
  const every = { ...LEADER, days: [1, 2, 3, 4, 5, 6, 7] };
  assert.deepEqual(dates(plain(M.schedule(every, '2026-01-01', '2026-05-31')), 'm'), ['2026-01-31', '2026-02-28', '2026-03-31', '2026-04-30', '2026-05-31'], 'a leader who works every day keeps the dates');
  assert.equal(M.nextWorkingDay('2026-01-31', [1, 2, 3, 4, 5]), '2026-02-02');
  assert.equal(M.weekday('2026-10-24'), 6);
  assert.equal(M.mondayOf('2026-10-25'), '2026-10-19');
});

test('times: a per-shift task after its start, and a night shift that runs past midnight', () => {
  const M = math();
  const night = { ...LEADER, id: 'n', start: '22:00', hours: 8, tasks: [
    { ...LEADER.tasks[1], id: 'o', offset: 180 },
    { ...LEADER.tasks[0], id: 'e', time: '02:00' },
    { ...LEADER.tasks[0], id: 'f', time: '23:00' },
  ] };
  assert.equal(M.minuteOf(night, night.tasks[0]), 1500, '22:00 + 180 min is 01:00 of the same shift');
  assert.equal(M.minuteOf(night, night.tasks[1]), 1560, '02:00 is after midnight inside the shift');
  assert.equal(M.minuteOf(night, night.tasks[2]), 1380);
  assert.equal(M.clock(1500), '01:00');
  assert.deepEqual(plain(M.dueOn(night, '2026-01-26')).map((o) => o.taskId), ['f', 'o', 'e'], 'time order through midnight');
  // At 01:00 on Tuesday the night shift that started on Monday is still the one to check off.
  assert.equal(M.shiftDay(night, '2026-01-27', 60), '2026-01-26');
  assert.equal(M.shiftDay(night, '2026-01-27', 400), '2026-01-27', 'after 06:00 the shift is over');
  assert.equal(M.shiftDay(LEADER, '2026-01-27', 60), '2026-01-27', 'a day shift never looks back');
  assert.equal(M.shiftDay(night, '2026-01-26', 60), '2026-01-26', 'no night shift started on Sunday, a day off');
});

test('adherence = done ÷ due: not relevant, not due and open are left out; "not recorded" counts as missed', () => {
  const M = math();
  const items = [
    ...Array(6).fill({ s: 'done', r: '' }),
    { s: 'missed', r: 'firefighting' }, { s: 'missed', r: 'firefighting' },
    { s: 'missed', r: 'notrelevant' }, { s: 'na', r: '' }, { s: 'open', r: '' }, { s: 'missed', r: 'unrecorded' },
  ];
  assert.deepEqual(plain(M.tally(items)), { scheduled: 12, done: 6, missed: 3, excluded: 1, na: 1, open: 1, unrecorded: 1, due: 9, adherence: 6 / 9 });
  assert.equal(M.tally([]).adherence, null, 'nothing due: no adherence, not 0 %');
  assert.equal(M.tally([{ s: 'missed', r: 'notrelevant' }]).adherence, null);
  // Excluding no reason at all counts "not relevant" as a miss.
  assert.equal(M.tally(items, []).due, 10);
});

test('"not recorded": an unmarked task is open during its day and missed after it', () => {
  const M = math();
  assert.deepEqual(plain(M.statusOf(undefined, '2026-01-26', '2026-01-27')), { s: 'missed', r: 'unrecorded' });
  assert.deepEqual(plain(M.statusOf(undefined, '2026-01-27', '2026-01-27')), { s: 'open', r: '' });
  assert.deepEqual(plain(M.statusOf({ s: 'done' }, '2026-01-20', '2026-01-27')), { s: 'done', r: '' });
  assert.deepEqual(plain(M.statusOf({ s: 'missed', r: 'notime' }, '2026-01-27', '2026-01-27')), { s: 'missed', r: 'notime' });
  const marks = { 'a|s|2026-01-26': { s: 'done' }, 'a|d|2026-01-26': { s: 'missed', r: 'notime' } };
  const items = plain(M.entries([LEADER], marks, '2026-01-26', '2026-01-27', '2026-01-27'));
  const of = (key) => items.find((i) => i.key === key);
  assert.equal(of('a|w2|2026-01-26').r, 'unrecorded', 'Monday is over: the unmarked task is missed');
  assert.equal(of('a|s|2026-01-27').s, 'open', 'today is still open');
  const t = M.tally(items);
  assert.deepEqual([t.done, t.missed, t.unrecorded, t.open, t.due], [1, 2, 1, 2, 3]);
  // A night shift after midnight: Monday's shift is still running at 01:00 on Tuesday.
  const night = { ...LEADER, start: '22:00' };
  assert.equal(plain(M.entries([night], {}, '2026-01-26', '2026-01-26', '2026-01-27', 60))[0].s, 'open');
  assert.equal(plain(M.entries([night], {}, '2026-01-26', '2026-01-26', '2026-01-27', 400))[0].s, 'missed');
});

test('the share of the day in standard work: minutes per working day over the shift, against the guide', () => {
  const M = math();
  const leader = { ...LEADER, tasks: [
    { ...LEADER.tasks[0], minutes: 60 }, { ...LEADER.tasks[1], minutes: 120 }, { ...LEADER.tasks[2], minutes: 100 }, { ...LEADER.tasks[4], minutes: 130 },
  ] };
  // A week: 60 × 5 + 120 × 5 + 100 + 130 × 12 / 52 = 300 + 600 + 100 + 30 = 1030 min; per working day 1030 / 5 = 206 min.
  const p = plain(M.planned(leader));
  assert.equal(p.perWeek, 1030);
  assert.equal(p.perDay, 206);
  assert.equal(p.dayMinutes, 480);
  assert.equal(p.share, 206 / 480);
  assert.equal(p.guide, 0.8);
  // Six working days of nine hours: (60 × 6 + 120 × 6 + 100 + 30) / 6 = 201.67 min of 540.
  const six = plain(M.planned({ ...leader, days: [1, 2, 3, 4, 5, 6], hours: 9, level: 'area' }, { area: 0.3 }));
  assert.ok(Math.abs(six.perDay - 1210 / 6) < 1e-9);
  assert.ok(Math.abs(six.share - 1210 / 6 / 540) < 1e-9);
  assert.equal(six.guide, 0.3, 'an edited guide');
});

test('the repeat-miss rule: 3 misses of a task in the 14 days that end today; not relevant does not count, not recorded does', () => {
  const M = math();
  const leader = { ...LEADER, tasks: [LEADER.tasks[0], LEADER.tasks[1], { ...LEADER.tasks[0], id: 'x', time: '12:00' }] };
  const today = '2026-02-13';
  const marks = {};
  M.schedule(leader, '2026-01-26', today).forEach((o) => { marks[o.key] = { s: 'done' }; });
  // d: three firefights in the window (2, 9 and 13 February) and one before it (30 January).
  ['2026-01-30', '2026-02-02', '2026-02-09', '2026-02-13'].forEach((d) => { marks[`a|d|${d}`] = { s: 'missed', r: 'firefighting' }; });
  // s: forgotten once, not marked twice.
  marks['a|s|2026-02-03'] = { s: 'missed', r: 'forgot' };
  delete marks['a|s|2026-02-04'];
  delete marks['a|s|2026-02-05'];
  // x: three times not relevant and one forgotten: one miss.
  ['2026-02-03', '2026-02-04', '2026-02-05'].forEach((d) => { marks[`a|x|${d}`] = { s: 'missed', r: 'notrelevant' }; });
  marks['a|x|2026-02-06'] = { s: 'missed', r: 'forgot' };
  const repeats = plain(M.repeatMisses([leader], marks, today));
  assert.deepEqual(repeats.map((g) => [g.taskId, g.misses, g.top]), [['d', 3, 'firefighting'], ['s', 3, 'unrecorded']]);
  assert.deepEqual(repeats[0].dates, ['2026-02-02', '2026-02-09', '2026-02-13']);
  assert.deepEqual(repeats[1].reasons, { forgot: 1, unrecorded: 2 });
  // The day after, 2 February leaves the window: only two misses of d remain.
  assert.deepEqual(plain(M.repeatMisses([leader], marks, '2026-02-16')).map((g) => g.taskId), ['s']);
  // Most missed first, over any period.
  const all = plain(M.missesByTask(M.entries([leader], marks, '2026-01-26', today, today)));
  assert.deepEqual(all.map((g) => [g.taskId, g.misses]), [['d', 4], ['s', 3], ['x', 1]]);
  assert.equal(all.find((g) => g.taskId === 'x').excluded, 3);
});

test('the calendar file: weekly rules for the working days, monthly dates one by one, folded and escaped', () => {
  const M = math();
  const text = M.ics(LEADER, { from: '2026-01-26', stamp: new Date('2026-01-25T08:00:00Z'), labels: { calendar: 'Leader Standard Work · Lena', done: 'Done when', toolLabel: 'Tool', tool: (key) => ({ 'kaizen-board': 'Kaizen Board' }[key] || key) } });
  const lines = text.split('\r\n');
  assert.ok(text.startsWith('BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//Stiven Catalyst//Leader Standard Work//EN\r\n'));
  assert.ok(text.endsWith('END:VCALENDAR\r\n'));
  assert.equal(lines.filter((l) => l === 'BEGIN:VEVENT').length, 16, '4 repeating tasks and 12 monthly dates');
  const block = (uid) => { const at = lines.indexOf(`UID:${uid}@stivencatalyst.com`); return lines.slice(at, lines.indexOf('END:VEVENT', at)); };
  assert.deepEqual(block('lsw-a-d').slice(2, 5), ['DTSTART:20260126T093000', 'DTEND:20260126T095000', 'RRULE:FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR']);
  assert.deepEqual(block('lsw-a-s').slice(2, 5), ['DTSTART:20260126T061500', 'DTEND:20260126T062500', 'RRULE:FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR']);
  assert.deepEqual(block('lsw-a-w').slice(2, 6), ['DTSTART:20260128T100000', 'DTEND:20260128T103000', 'RRULE:FREQ=WEEKLY;BYDAY=WE', 'SUMMARY:Kaizen\\, review']);
  assert.equal(block('lsw-a-w2')[4], 'RRULE:FREQ=WEEKLY;BYDAY=MO', 'Saturday moves to Monday');
  assert.match(block('lsw-a-w').join(''), /DESCRIPTION:Done when: One idea decided\\nTool: Kaizen Board\\nLena/);
  const monthly = lines.filter((l) => /^UID:lsw-a-m-/.test(l)).map((l) => l.slice(12, 20));
  assert.deepEqual(monthly, ['20260202', '20260302', '20260331', '20260430', '20260601', '20260630', '20260731', '20260831', '20260930', '20261102', '20261130', '20261231']);
  assert.ok(!lines.some((l) => /^RRULE/.test(l) && /MONTHLY/.test(l)), 'no monthly rule: the moved dates are listed');
  assert.ok(lines.every((l) => Buffer.byteLength(l, 'utf8') <= 75), 'lines folded at 75 bytes');
  // A night shift: 22:00 + 180 min lands on the next day, so the weekdays move with it.
  const night = { ...LEADER, id: 'n', start: '22:00', tasks: [{ ...LEADER.tasks[1], id: 'o', offset: 180 }] };
  const nightLines = M.ics(night, { from: '2026-01-26', stamp: new Date('2026-01-25T08:00:00Z') }).split('\r\n');
  assert.ok(nightLines.includes('DTSTART:20260127T010000'));
  assert.ok(nightLines.includes('RRULE:FREQ=WEEKLY;BYDAY=TU,WE,TH,FR,SA'));
  assert.equal(M.icsText('a,b;c\\d\ne'), 'a\\,b\\;c\\\\d\\ne');
});

test('the three data files share one shape, the same templates and example numbers, and their own storage key', () => {
  const en = read(DATA.en);
  const M = math();
  assert.equal(en.storageKey, KEY.en);
  for (const lang of ['de', 'sq']) {
    const other = read(DATA[lang]);
    assert.equal(other.storageKey, KEY[lang], `${lang} keeps its own work`);
    assert.deepEqual(shape(other), shape(en), `${lang}: the same keys and lengths`);
    for (const list of ['levels', 'frequencies', 'reasons', 'sectors', 'tools']) assert.deepEqual(other[list].map((x) => x.key), en[list].map((x) => x.key), `${lang} ${list}`);
    assert.deepEqual(other.reasons.map((r) => r.excluded), en.reasons.map((r) => r.excluded));
    assert.deepEqual(Object.keys(other.templates), Object.keys(en.templates));
    for (const [key, tpl] of Object.entries(en.templates)) {
      const mine = other.templates[key];
      assert.deepEqual([mine.sector, mine.level, mine.start, mine.hours], [tpl.sector, tpl.level, tpl.start, tpl.hours], `${lang} ${key}`);
      assert.deepEqual(mine.tasks.map(({ freq, at, day, minutes, tool }) => ({ freq, at, day, minutes, tool })), tpl.tasks.map(({ freq, at, day, minutes, tool }) => ({ freq, at, day, minutes, tool })), `${lang} ${key}: the same tasks`);
      mine.tasks.forEach((t, i) => { assert.ok(t.title.trim() && t.done.trim(), `${lang} ${key} ${i}: a title and a done text`); assert.notEqual(t.title, tpl.tasks[i].title, `${lang} ${key} ${i}: translated`); });
    }
    const numbers = (ex) => ({ ...ex, leaders: ex.leaders.map(({ area, shift, ...rest }) => rest), reviews: ex.reviews.map(({ note, ...rest }) => rest) });
    assert.deepEqual(numbers(other.example), numbers(en.example), `${lang}: the example's numbers are the same`);
    assert.equal(other.weekdays.long.length, 7);
    assert.equal(other.tips.length, en.tips.length);
  }
  assert.deepEqual(en.levels.map((l) => l.key), plain(M.LEVELS));
  assert.deepEqual(en.frequencies.map((f) => f.key), plain(M.FREQS));
  assert.deepEqual(en.reasons.filter((r) => r.excluded).map((r) => r.key), plain(M.EXCLUDED));
  assert.deepEqual(en.reasons.map((r) => r.key), ['firefighting', 'absent', 'notime', 'notrelevant', 'forgot']);
  const tools = new Set(en.tools.map((t) => t.key));
  // Every tool of the list is a page of the site, and every template task uses one of them.
  en.tools.forEach((t) => assert.ok(fs.existsSync(`src/tools/${t.key}.njk`), `src/tools/${t.key}.njk`));
  for (const [key, tpl] of Object.entries(en.templates)) {
    assert.ok(tpl.tasks.length >= 6, key);
    tpl.tasks.forEach((t) => {
      assert.ok(tools.has(t.tool), `${key}: ${t.tool}`);
      assert.ok(M.FREQS.includes(t.freq));
      if (t.freq === 'weekly') assert.ok(t.day >= 1 && t.day <= 7);
      if (t.freq === 'monthly') assert.ok(t.day >= 1 && t.day <= 31);
    });
  }
  // A template per level for each sector.
  for (const sector of ['warehouse', 'hotel', 'delivery']) assert.deepEqual(Object.values(en.templates).filter((t) => t.sector === sector).map((t) => t.level), ['team', 'shift', 'area', 'site']);
});

test('the templates land near the guide of their level, and their times follow the leader’s shift', () => {
  const M = math();
  const cfg = read(DATA.en);
  for (const [key, tpl] of Object.entries(cfg.templates)) {
    const leader = M.cleanLeader({ id: 'x', name: 'X', level: tpl.level, start: tpl.start, hours: tpl.hours, days: [1, 2, 3, 4, 5] });
    leader.tasks = M.fromTemplate(tpl, leader, '2026-01-01', (i) => `t${i}`);
    const p = M.planned(leader);
    assert.ok(Math.abs(p.share - p.guide) <= 0.17, `${key}: ${p.share.toFixed(2)} against ${p.guide}`);
  }
  const tpl = cfg.templates['warehouse-team'];
  const late = M.cleanLeader({ id: 'l', name: 'Jonas', level: 'team', start: '14:00', hours: 8 });
  const tasks = M.fromTemplate(tpl, late, '2026-01-01', (i) => `t${i}`);
  assert.equal(tasks[1].freq, 'shift');
  assert.equal(tasks[1].offset, 15);
  assert.equal(M.minuteOf(late, tasks[1]), 14 * 60 + 15, 'the huddle at 14:15 in the late shift');
  const weekly = tasks.find((t) => t.freq === 'weekly');
  assert.equal(weekly.time, '18:00', '240 minutes after a 14:00 start');
  assert.equal(weekly.weekday, 3);
});

test('the example: a warehouse with 1 area manager, 2 shift leads and 3 team leaders over three weeks, the same in every language', () => {
  const M = math();
  const run = (lang) => { const cfg = read(DATA[lang]); return plain(M.exampleData(cfg.example, cfg.templates, '2026-10-24', 11 * 60 + 30)); };
  const ex = run('en');
  assert.equal(ex.from, '2026-10-05', 'the Monday two weeks before this one');
  assert.deepEqual(ex.leaders.map((l) => l.level), ['area', 'shift', 'shift', 'team', 'team', 'team']);
  assert.deepEqual(ex.leaders.map((l) => l.reportsTo), ['', 'ex-sabine', 'ex-sabine', 'ex-arben', 'ex-arben', 'ex-marco']);
  for (const lang of ['de', 'sq']) {
    const other = run(lang);
    assert.deepEqual(other.marks, ex.marks, `${lang}: the same check-offs`);
    assert.deepEqual(Object.keys(other.reviews), Object.keys(ex.reviews));
  }
  assert.deepEqual(Object.keys(ex.reviews).map((k) => k.split('|')[1]), ['2026-10-12', '2026-10-12', '2026-10-12'], 'notes on last week');
  const items = M.entries(ex.leaders, ex.marks, ex.from, '2026-10-24', '2026-10-24', 11 * 60 + 30);
  const total = M.tally(items);
  assert.equal(total.done + total.missed + total.excluded + total.na + total.open, total.scheduled, 'every due task is in one state');
  assert.ok(total.adherence > 0.8 && total.adherence < 0.95, `adherence ${total.adherence}`);
  assert.ok(total.unrecorded > 0 && total.excluded > 0 && total.na > 0, 'some not recorded, not relevant and not due');
  assert.ok(items.some((i) => i.date === '2026-10-24' && i.s === 'open'), 'the rest of today is still open');
  assert.ok(!items.some((i) => i.date === '2026-10-24' && i.minute > 690 && i.s !== 'open'), 'nothing after 11:30 is marked yet');
  // Jonas was away on Thursday and Friday of last week, and nobody covered.
  const jonas = items.filter((i) => i.leaderId === 'ex-jonas' && (i.date === '2026-10-15' || i.date === '2026-10-16'));
  assert.ok(jonas.length > 10 && jonas.every((i) => i.s === 'missed' && i.r === 'absent'));
  const repeats = plain(M.repeatMisses(ex.leaders, ex.marks, '2026-10-24', M.EXCLUDED, 690));
  const named = repeats.map((g) => `${g.leaderId}|${ex.leaders.find((l) => l.id === g.leaderId).tasks.find((t) => t.id === g.taskId).title}`);
  assert.ok(named.includes('ex-dritan|Quality check: 10 orders against the pick list'), named.join(', '));
  assert.ok(named.includes('ex-marco|Gemba walk with one team leader'), named.join(', '));
  // The weekly adherence of the example gets better after the reviews.
  const weeks = plain(M.byWeek(items));
  assert.deepEqual(weeks.map((w) => w.week), ['2026-10-05', '2026-10-12', '2026-10-19']);
  assert.ok(weeks[2].adherence > weeks[0].adherence);
  const shares = ex.leaders.map((l) => M.planned(l).share);
  assert.ok(shares[0] > 0.2 && shares[0] < 0.3 && shares[1] > 0.4 && shares[1] < 0.55 && shares[3] > 0.65 && shares[3] < 0.85, shares.join(', '));
});

test('a first visit opens on the example with a rich result; clearing it leaves an empty page', () => {
  const w = load();
  const d = w.document;
  const results = d.querySelector('[data-results]');
  assert.equal(results.hidden, false);
  assert.match(results.querySelector('h2').textContent, /^\d+ ?% · adherence$/);
  assert.equal(results.querySelectorAll('.dl-stat').length, 5);
  assert.ok(results.querySelectorAll('svg').length >= 4, 'adherence per leader, per week, reasons and the heat map');
  assert.ok(results.querySelectorAll('.lw-repeat-list li').length >= 2, 'the repeat misses');
  assert.match(results.querySelector('.dl-focus h3').textContent, /Quality check: 10 orders/);
  assert.match(results.querySelector('.lw-share-table').textContent, /Lena Vogel.*Team leader.*80/);
  const note = d.querySelector('.dl-example-note');
  assert.equal(note.hidden, false);
  assert.match(note.textContent, /one area manager, two shift leads and three team leaders/);
  assert.equal(w.localStorage.getItem(KEY.en), null, 'nothing is written until the visitor acts');
  assert.equal(d.querySelector('#lw-leader').value, 'ex-dritan');
  assert.match(d.querySelector('[data-day-head]').textContent, /^Saturday, 2026-10-24 · Dritan Kola · Early 06:00–14:00$/);
  assert.equal(d.querySelectorAll('[data-day-list] li').length, 11, 'the tasks of a Saturday, Wednesday and Friday tasks left out');
  assert.match(d.querySelector('[data-planned]').textContent, /Planned: 341 min .* 71 ?% of a day of 8 hours\. Guide for a team leader: about 80 ?%/);
  click(w, note.querySelector('button'));
  assert.equal(results.hidden, true);
  assert.equal(saved(w).leaders.length, 0);
  assert.deepEqual(saved(w).marks, {});
});

test('checking off the day: done, missed with a reason, not due, and a second tap takes the mark away', () => {
  const w = load();
  const d = w.document;
  const first = d.querySelector('[data-day-list] li');
  const key = first.querySelector('[data-mark]').dataset.key;
  assert.equal(key, 'ex-dritan|t1|2026-10-24');
  const press = (s) => click(w, d.querySelector(`[data-key="${key}"][data-mark="${s}"]`));
  press('missed');
  assert.deepEqual(saved(w).marks[key], { s: 'missed', r: 'firefighting' });
  const select = d.querySelector(`[data-reason-key="${key}"]`);
  assert.ok(select, 'the reason opens');
  assert.equal(d.querySelector(`label[for="${select.id}"]`).textContent, 'Reason');
  type(w, select, 'notrelevant');
  assert.deepEqual(saved(w).marks[key], { s: 'missed', r: 'notrelevant' });
  press('na');
  assert.deepEqual(saved(w).marks[key], { s: 'na' });
  press('na');
  assert.equal(saved(w).marks[key], undefined, 'a second tap removes the mark');
  press('done');
  assert.equal(d.querySelector(`[data-key="${key}"][data-mark="done"]`).getAttribute('aria-pressed'), 'true');
  // Yesterday (Friday) has an unmarked task: it shows as not recorded.
  const marks = saved(w).marks;
  const fridayKey = Object.keys(marks).find((k) => k.startsWith('ex-dritan|') && k.endsWith('|2026-10-23'));
  delete marks[fridayKey];
  const w2 = load({ storage: { [KEY.en]: { ...saved(w), marks } } });
  type(w2, w2.document.querySelector('#lw-day'), '2026-10-23');
  const li = w2.document.querySelector(`[data-key="${fridayKey}"]`).closest('li');
  assert.equal(li.dataset.state, 'missed');
  assert.match(li.textContent, /not recorded/);
});

test('a leader of one’s own: the example goes, a template gives the standard, the calendar file and the print card', () => {
  const w = load();
  const d = w.document;
  click(w, d.querySelector('[data-leader-new]'));
  assert.equal(d.querySelector('[data-leader-form]').hidden, false);
  type(w, d.querySelector('#lw-name'), 'Mira Shehu');
  type(w, d.querySelector('#lw-level'), 'shift');
  type(w, d.querySelector('#lw-area'), 'Front office');
  type(w, d.querySelector('#lw-start'), '07:00');
  click(w, d.querySelector('[data-leader-save]'));
  let state = saved(w);
  assert.equal(state.leaders.length, 1, 'the example left');
  assert.deepEqual(state.example, {});
  assert.equal(state.leaders[0].level, 'shift');
  assert.deepEqual(state.leaders[0].days, [1, 2, 3, 4, 5]);
  assert.equal(state.leaders[0].since, '2026-10-24');
  assert.equal(d.querySelector('#lw-template').value, 'warehouse-shift', 'the template of the level');
  type(w, d.querySelector('#lw-template'), 'hotel-shift');
  click(w, d.querySelector('[data-template-apply]'));
  state = saved(w);
  const tpl = read(DATA.en).templates['hotel-shift'];
  assert.equal(state.leaders[0].tasks.length, tpl.tasks.length);
  assert.equal(state.leaders[0].tasks[0].offset, 0);
  assert.equal(state.leaders[0].tasks.find((t) => t.freq === 'weekly').time, '12:00', '07:00 + 300 min');
  assert.match(d.querySelector('[data-planned]').textContent, /Guide for a shift lead: about 50 ?%/);
  // Saturday: nothing is due for a Monday-to-Friday leader.
  assert.match(d.querySelector('[data-day-progress]').textContent, /Nothing is due on this day/);
  // A task of one's own.
  click(w, d.querySelector('[data-task-new]'));
  type(w, d.querySelector('#lw-task-title'), 'Call the night auditor');
  type(w, d.querySelector('#lw-task-freq'), 'monthly');
  assert.equal(d.querySelector('#lw-task-day').closest('.field').hidden, false);
  assert.equal(d.querySelector('#lw-task-offset').closest('.field').hidden, true);
  type(w, d.querySelector('#lw-task-day'), '31');
  type(w, d.querySelector('#lw-task-time'), '08:15');
  click(w, d.querySelector('[data-task-save]'));
  const own = saved(w).leaders[0].tasks.at(-1);
  assert.deepEqual([own.title, own.freq, own.monthDay, own.time], ['Call the night auditor', 'monthly', 31, '08:15']);
  // The calendar file.
  click(w, d.querySelector('[data-ics]'));
  const blob = w.blobs.at(-1);
  assert.equal(blob.type, 'text/calendar;charset=utf-8');
  // The card to carry: every task, a box per working day.
  click(w, d.querySelector('[data-print-card]'));
  const print = d.querySelector('[data-print]');
  assert.match(print.textContent, /Mira Shehu/);
  assert.equal(print.querySelectorAll('tbody tr').length, tpl.tasks.length + 1);
  assert.deepEqual([...print.querySelector('thead').querySelectorAll('th.lw-box')].map((th) => th.textContent), ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']);
});

test('the hand-offs: a repeat miss goes to the Action Tracker with the leader as owner; tool links and 5 Whys keep the language', () => {
  for (const lang of ['en', 'de']) {
    const w = load({ lang });
    const d = w.document;
    const results = d.querySelector('[data-results]');
    const link = results.querySelector('.lw-repeat-list a');
    click(w, link);
    const url = new URL(link.href);
    assert.equal(url.pathname, lang === 'de' ? '/de/tools/action-tracker/' : '/tools/action-tracker/');
    assert.equal(url.searchParams.get('source'), 'leader-standard-work');
    assert.equal(url.searchParams.get('owner'), 'Dritan Kola');
    assert.equal(url.searchParams.get('due'), '2026-10-31');
    assert.match(url.searchParams.get('action'), lang === 'de' ? /Standardarbeit in 2 Wochen \d+-mal verpasst: Qualitätscheck/ : /Standard work missed \d+ times in 2 weeks: Quality check/);
    assert.equal(url.searchParams.get('area'), lang === 'de' ? 'Verladung' : 'Loading');
    const whys = [...results.querySelectorAll('a')].find((a) => /five-whys/.test(a.href));
    assert.equal(new URL(whys.href).pathname, lang === 'de' ? '/de/tools/five-whys/' : '/tools/five-whys/');
    const tool = d.querySelector('[data-day-list] .lw-item-tool');
    assert.equal(new URL(tool.href).pathname, lang === 'de' ? '/de/tools/skills-matrix/' : '/tools/skills-matrix/');
  }
});

test('the review: each leader of the reviewer with the adherence of the week, the task missed most and a note that is kept', () => {
  const w = load();
  const d = w.document;
  const results = d.querySelector('[data-results]');
  click(w, [...results.querySelectorAll('.lw-views button')].find((b) => b.textContent === 'Review'));
  assert.match(results.querySelector('h2').textContent, /Week of 2026-10-12/);
  assert.equal(results.querySelectorAll('.lw-review tbody tr').length, 6);
  type(w, d.querySelector('#lw-reviewer'), 'ex-arben');
  const rows = [...results.querySelectorAll('.lw-review tbody tr')];
  assert.deepEqual(rows.map((r) => r.querySelector('strong').textContent), ['Lena Vogel', 'Dritan Kola']);
  assert.match(rows[1].textContent, /Quality check: 10 orders against the pick list/);
  assert.match(rows[1].querySelector('textarea').value, /Move it to 09:30/);
  const area = rows[0].querySelector('textarea');
  type(w, area, 'Well done: keep the 06:15 huddle.');
  assert.equal(saved(w).reviews['ex-lena|2026-10-12'], 'Well done: keep the 06:15 huddle.');
  assert.equal(saved(w).view, 'review');
  click(w, [...results.querySelectorAll('button')].find((b) => b.textContent === 'Print the review'));
  assert.match(d.querySelector('[data-print]').textContent, /Well done: keep the 06:15 huddle/);
});

test('the log as CSV: every due task of every leader with its state, reason and whether it counts', async () => {
  const w = load();
  click(w, w.document.querySelector('[data-csv]'));
  const text = await new Promise((resolve) => { const reader = new w.FileReader(); reader.onload = () => resolve(String(reader.result)); reader.readAsText(w.blobs.at(-1)); });
  const lines = text.replace(/^﻿/, '').trim().split('\r\n');
  assert.equal(lines[0], 'Date,Weekday,Leader,Leadership level,Area,Shift,Task,Frequency,Time,Minutes,Tool,Status,Reason,Counted');
  const M = w.LeaderStandardWorkMath;
  const cfg = read(DATA.en);
  const ex = M.exampleData(cfg.example, cfg.templates, '2026-10-24', 690);
  assert.equal(lines.length - 1, M.entries(ex.leaders, ex.marks, ex.from, '2026-10-24', '2026-10-24', 690).length);
  assert.ok(lines.some((l) => /,Missed,Absent\\, not covered,yes$|,Missed,"Absent, not covered",yes$/.test(l)));
  assert.ok(lines.some((l) => /,Missed,Not relevant today,no$/.test(l)));
  assert.ok(lines.some((l) => /,Missed,Not recorded,yes$/.test(l)));
});

test('German and Albanian pages: the texts are translated and every text of the page and the script has a translation', () => {
  const de = load({ lang: 'de' });
  assert.equal(de.document.querySelector('[data-results]').hidden, false);
  assert.equal(de.localStorage.getItem(KEY.de), null);
  const sq = load({ lang: 'sq' });
  assert.match(sq.document.querySelector('.dl-example-note').textContent, /magazinë/);
  const ui = { de: read('src/_data/de/ui.json'), sq: read('src/_data/sq/ui.json') };
  const part = read('src/_data/i18n-parts/leader-standard-work.json');
  const njk = fs.readFileSync('src/_includes/partials/leader-standard-work.njk', 'utf8');
  const js = fs.readFileSync('src/js/leader-standard-work.js', 'utf8');
  const texts = new Set([...njk.matchAll(/\{\{\s*"((?:[^"\\]|\\.)*)"\s*\|\s*t\(lang\)/g)].map((m) => m[1]));
  for (const m of js.matchAll(/\btx\("((?:[^"\\]|\\.)*)"/g)) texts.add(JSON.parse(`"${m[1]}"`));
  assert.ok(texts.size > 150);
  for (const lang of ['de', 'sq']) {
    const missing = [...texts].filter((text) => (part[lang][text] ?? ui[lang][text]) === undefined);
    assert.deepEqual(missing, [], `${lang}: no translation`);
    Object.entries(part[lang]).forEach(([en, out]) => {
      const vars = (s) => [...s.matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort();
      assert.deepEqual(vars(out), vars(en), `${lang}: the placeholders of "${en}"`);
    });
  }
  const cards = read('src/_data/i18n-parts/leader-standard-work.cards.json');
  assert.equal(cards.family, 'zenith');
  assert.deepEqual(['en', 'de', 'sq'].map((lang) => cards.cards[lang].url), ['/tools/leader-standard-work/', '/de/tools/leader-standard-work/', '/sq/tools/leader-standard-work/']);
  assert.ok(['en', 'de', 'sq'].every((lang) => cards.cards[lang].type === 'Lean'));
  assert.equal(cards.routine.when, 'Start of shift');
});
