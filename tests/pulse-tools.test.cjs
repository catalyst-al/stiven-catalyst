// The Pulse tools (Damage Control, Incomplete Control, Delay Analyzer, Shift Handover) share
// src/js/tool-kit.js; the Delay Analyzer's route arithmetic is in window.DelayMath.
process.env.TZ = 'Europe/Berlin';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const { JSDOM } = require('jsdom');

// Objects made inside the page have the page's own prototypes; compare them as plain data.
const plain = (value) => JSON.parse(JSON.stringify(value, (key, v) => (v === Infinity ? 'Infinity' : v)));

const load = (lang = 'sq', now = null) => {
  const dom = new JSDOM(`<html lang="${lang}"><body></body></html>`, { url: 'https://example.test/sq/tools/delay-analyzer/', runScripts: 'outside-only' });
  // The page's clock, fixed when a test needs a given moment.
  if (now) dom.window.eval(`(() => { const Real = Date; const fixed = new Real(${JSON.stringify(now)}); Date = class extends Real { constructor(...args) { super(...(args.length ? args : [fixed])); } static now() { return fixed.getTime(); } }; })();`);
  dom.window.eval(fs.readFileSync('src/js/tool-kit.js', 'utf8'));
  dom.window.eval(fs.readFileSync('src/js/delay-analyzer.js', 'utf8'));
  return dom.window;
};

test('today is the date on the device clock, so a night shift after midnight logs the new day', () => {
  // 00:30 in Frankfurt is still the day before in UTC.
  const { ToolKit } = load('sq', '2026-10-01T22:30:00Z');
  assert.equal(ToolKit.today(), '2026-10-02');
  assert.deepEqual(plain(ToolKit.rangePreset('week')), { from: '2026-09-26', to: '2026-10-02' });
  assert.deepEqual(plain(ToolKit.rangePreset('today')), { from: '2026-10-02', to: '2026-10-02' });
  assert.deepEqual(plain(ToolKit.rangePreset('all')), { from: '', to: '' });
});

test('a period keeps only the rows dated inside it', () => {
  const { ToolKit } = load();
  const rows = [{ date: '2026-09-01' }, { date: '2026-09-05' }, { date: '2026-09-09' }, { date: '' }];
  assert.equal(ToolKit.inRange(rows, '', '').length, 4, 'no period: every row, dated or not');
  assert.deepEqual(ToolKit.inRange(rows, '2026-09-02', '2026-09-09').map((row) => row.date), ['2026-09-05', '2026-09-09']);
  assert.deepEqual(ToolKit.inRange(rows, '2026-09-05', '').map((row) => row.date), ['2026-09-05', '2026-09-09']);
  assert.deepEqual(plain(ToolKit.dateSpan(rows)), { from: '2026-09-01', to: '2026-09-09', days: 3 });
  assert.equal(ToolKit.dateSpan([{ date: '' }]), null);
  assert.equal(ToolKit.spanText({ from: '2026-09-01', to: '2026-09-09' }), '01.09.2026 – 09.09.2026');
});

test('the sigma level stays between 0 and 6', () => {
  const { ToolKit } = load('en');
  assert.equal(ToolKit.sigma(0), 6);
  assert.equal(ToolKit.sigma(1), 0);
  assert.equal(ToolKit.sigmaText(1), '0.00');
  assert.ok(Math.abs(ToolKit.sigma(0.0668) - 3) < 0.01);
  assert.equal(ToolKit.sigma(0.99), 0);
});

test('a late route is split between dock and road without counting a departure inside its grace', () => {
  const { DelayMath } = load();
  const classify = (...args) => plain(DelayMath.classify(...args));
  // Arrival within the grace: not late, however the departure went.
  assert.deepEqual(classify(30, 15, 10, 15), { late: false, dock: null, side: null });
  // No departure time: late, but the delay cannot be split.
  assert.deepEqual(classify(null, 40, 10, 15), { late: true, dock: null, side: 'Not known' });
  // Left 8 minutes late with a 10-minute grace: it left on time, so no minute is the dock's.
  assert.deepEqual(classify(8, 40, 10, 15), { late: true, dock: 0, side: 'Road' });
  // Left 30 late, arrived 35 late: the dock carries most of it.
  assert.deepEqual(classify(30, 35, 10, 15), { late: true, dock: 30, side: 'Dock' });
  // Left 12 late, arrived 60 late: most grew on the road after a late start.
  assert.deepEqual(classify(12, 60, 10, 15), { late: true, dock: 12, side: 'Dock and road' });
  // Left 50 late but made up time: the dock owns at most the arrival delay.
  assert.deepEqual(classify(50, 20, 10, 15), { late: true, dock: 20, side: 'Dock' });
});

const plainBands = (grace) => plain(load().DelayMath.delayBands(grace));

test('"How late" bands start after the arrival grace, so none is always empty', () => {
  const { DelayMath } = load();
  assert.deepEqual(plainBands(15), [[16, 30], [31, 60], [61, 120], [121, 'Infinity']]);
  assert.deepEqual(plainBands(0), [[1, 15], [16, 30], [31, 60], [61, 120], [121, 'Infinity']]);
  assert.deepEqual(plainBands(5), [[6, 15], [16, 30], [31, 60], [61, 120], [121, 'Infinity']]);
  assert.deepEqual(plainBands(150), [[151, 'Infinity']]);
});

test('the new Pulse texts are translated', () => {
  const keys = [
    'No entries in this period. Choose another period or All.', 'All {n} entries', '{n} of {total} entries',
    'Any volume you enter must cover the same days.', 'Undo', 'Show results for', 'Today', 'Last 7 days', 'Last 30 days', 'All', 'From', 'To',
    'Removed {count} at {stage}.', 'Removed route {route}.', '{min} late in total', 'Departure {n} min.',
    'Arrival {n} min: late ({side}). Choose the reason.', 'Arrival {n} min: on time.', 'All details', 'Show {n} more', 'Your log in {language} has {n} entries.', 'Open it',
    'Only some routes of the period are in the log, so hours and shifts show counts, not shares.',
    'Only some routes of the period are in the log, so this counts late routes. Log every route to see the share that was late.',
  ];
  for (const lang of ['de', 'sq']) {
    const ui = JSON.parse(fs.readFileSync(`src/_data/${lang}/ui.json`, 'utf8'));
    for (const key of keys) assert.ok(ui[key], `${lang}: ${key}`);
  }
});

test('an empty log points to the same log kept in another language', () => {
  const dom = new JSDOM('<html lang="de"><body></body></html>', { url: 'https://example.test/de/tools/damage-control/', runScripts: 'outside-only' });
  dom.window.localStorage.setItem('sc-damage-control-sq', JSON.stringify({ rows: [{}, {}, {}] }));
  dom.window.localStorage.setItem('sc-damage-control', JSON.stringify({ rows: [] }));
  dom.window.localStorage.setItem('sc-damage-control-de', JSON.stringify({ rows: [{}] }));
  dom.window.eval(fs.readFileSync('src/js/tool-kit.js', 'utf8'));
  // From the German page: the Albanian log has three entries, the English one none; German is this page.
  assert.deepEqual(plain(dom.window.ToolKit.otherLogs('sc-damage-control-de')), [{ code: 'sq', count: 3, name: 'Shqip', url: '/sq/tools/damage-control/' }]);
});

test('trend buckets group a log by day or by week and fill the quiet days', () => {
  const { ToolKit } = load();
  const rows = (dates) => dates.map((date) => ({ date, units: 2 }));
  const daily = ToolKit.trendBuckets(rows(['2026-09-01', '2026-09-01', '2026-09-04', '']), (row) => row.units);
  assert.equal(daily.unit, 'day');
  assert.equal(daily.undated, 1);
  assert.deepEqual(plain(daily.buckets.map((b) => [b.key, b.value])), [['2026-09-01', 4], ['2026-09-02', 0], ['2026-09-03', 0], ['2026-09-04', 2]]);
  // More than 31 days: weeks starting on Monday (2026-09-07 is a Monday).
  const weekly = ToolKit.trendBuckets(rows(['2026-09-09', '2026-09-13', '2026-10-20']), (row) => row.units);
  assert.equal(weekly.unit, 'week');
  assert.deepEqual(plain(weekly.buckets.slice(0, 2).map((b) => [b.key, b.to, b.value])), [['2026-09-07', '2026-09-13', 4], ['2026-09-14', '2026-09-20', 0]]);
  assert.equal(weekly.buckets.at(-1).key, '2026-10-19');
  assert.equal(ToolKit.trendBuckets([{ date: '' }], () => 1).buckets.length, 0);
});

test('the trend chart draws one column per day, marks the highest and exports a white SVG', () => {
  const { ToolKit, document } = load();
  const trend = ToolKit.trendBuckets([{ date: '2026-09-01', u: 1 }, { date: '2026-09-02', u: 5 }, { date: '2026-09-03', u: 2 }], (row) => row.u);
  const figure = ToolKit.trendFigure(trend, { title: 'Damage: trend', unit: 'Damages', average: 'Average' }, 'damage-control');
  document.body.append(figure);
  assert.equal(figure.querySelectorAll('svg g[role=img]').length, 3);
  assert.equal(figure.querySelectorAll('button').length, 2);
  assert.match(figure.querySelector('svg').textContent, /Average/);
});

test('trend buckets can hold a share: late routes over all routes of each day', () => {
  const { ToolKit } = load();
  const rows = [
    { date: '2026-09-01', late: true }, { date: '2026-09-01', late: false }, { date: '2026-09-01', late: false }, { date: '2026-09-01', late: false },
    { date: '2026-09-03', late: true },
  ];
  const trend = ToolKit.trendBuckets(rows, (row) => (row.late ? 1 : 0), 60, () => 1);
  assert.deepEqual(plain(trend.buckets.map((b) => [b.key, b.count, b.total, b.value])), [['2026-09-01', 1, 4, 0.25], ['2026-09-02', 0, 0, 0], ['2026-09-03', 1, 1, 1]]);
  const figure = ToolKit.trendFigure(trend, { title: 'Late', unit: 'Late (%)', average: 'Average', format: (v) => `${Math.round(v * 100)}%` }, 'delay-analyzer');
  assert.match(figure.querySelector('svg').textContent, /Average 40%/, 'the average counts routes, not days');
});

test('Shift Pulse counts each log per day and flags a latest day that is clearly above the usual', () => {
  const dom = new JSDOM('<html lang="en"><body></body></html>', { url: 'https://example.test/tools/shift-pulse/', runScripts: 'outside-only' });
  dom.window.eval(fs.readFileSync('src/js/tool-kit.js', 'utf8'));
  dom.window.eval(fs.readFileSync('src/js/shift-pulse.js', 'utf8'));
  const { PulseMath } = dom.window;
  assert.equal(PulseMath.minutesLate('23:50', '00:20'), 30, 'a route that arrives after midnight');
  assert.equal(PulseMath.minutesLate('10:00', ''), null);
  const logs = {
    damage: { rows: [
      { date: '2026-09-01', shift: 'Early', units: 1 }, { date: '2026-09-02', shift: 'Early', units: 2 }, { date: '2026-09-03', shift: 'Early', units: 6 },
      { date: '2026-09-03', shift: 'Late', units: 2 }, { date: '2026-08-01', shift: 'Early', units: 9 }, { date: '2026-09-03', shift: 'Early' },
    ] },
    incomplete: { rows: [] },
    delay: { arrivalGrace: '15', rows: [
      { date: '2026-09-02', shift: 'Early', planArr: '10:00', actArr: '10:05' }, { date: '2026-09-02', shift: 'Early', planArr: '11:00', actArr: '11:40' },
      { date: '2026-09-03', shift: 'Early', planArr: '10:00', actArr: '10:30' }, { date: '2026-09-03', shift: 'Early', planArr: '11:00', actArr: '11:50' }, { date: '2026-09-03', shift: 'Early', planArr: '12:00', actArr: '' },
    ] },
  };
  const all = plain(PulseMath.compute(logs, { from: '2026-09-01', to: '2026-09-03', shift: '' }));
  assert.deepEqual(all.days, ['2026-09-01', '2026-09-02', '2026-09-03']);
  assert.deepEqual(all.damage.byDay, [1, 2, 9], 'a row without units counts one; rows outside the period do not count');
  assert.equal(all.damage.total, 12);
  assert.equal(all.damage.above, true, '9 on the latest day against a usual 1.5');
  assert.equal(all.incomplete.latest, null);
  assert.deepEqual([all.delay.routes, all.delay.late, all.delay.onTime], [4, 3, 0.25], 'the route without an arrival time is left out');
  assert.equal(all.delay.above, true);
  const early = plain(PulseMath.compute(logs, { from: '2026-09-01', to: '2026-09-03', shift: 'Early' }));
  assert.deepEqual(early.damage.byDay, [1, 2, 7]);
  const quiet = plain(PulseMath.compute({ damage: { rows: [{ date: '2026-09-03', shift: 'Early', units: 3 }] } }, { from: '2026-09-01', to: '2026-09-03' }));
  assert.equal(quiet.damage.above, false, 'no earlier day to compare with is not a flag');
});

const loadDefectLog = () => {
  const dom = new JSDOM('<html lang="en"><body></body></html>', { url: 'https://example.test/tools/damage-control/', runScripts: 'outside-only' });
  dom.window.eval(fs.readFileSync('src/js/tool-kit.js', 'utf8'));
  dom.window.eval(fs.readFileSync('src/js/defect-log.js', 'utf8'));
  return dom.window;
};

test('daily volumes keep one value per day, read pasted rows and say which days of a period they cover', () => {
  const { DefectMath } = loadDefectLog();
  assert.deepEqual(plain(DefectMath.cleanVolumes([
    { date: '2026-09-02', volume: 200 }, { date: '2026-09-01', volume: '100' }, { date: '2026-09-02', volume: 250 },
    { date: 'bad', volume: 5 }, { date: '2026-09-03', volume: 0 }, null, { date: '2026-09-04', volume: 12.4 },
  ])), [{ date: '2026-09-01', volume: 100 }, { date: '2026-09-02', volume: 250 }, { date: '2026-09-04', volume: 12 }]);

  const pasted = DefectMath.importVolumes('Date\tVolume\n2026-09-14\t2900\n15.09.2026\t3100\nnonsense\n2026-09-16\t0');
  assert.deepEqual(plain(pasted), { added: [{ date: '2026-09-14', volume: 2900 }, { date: '2026-09-15', volume: 3100 }], skipped: 2 });

  const rows = [{ date: '2026-09-14' }, { date: '2026-09-14' }, { date: '2026-09-16' }];
  const volumes = [13, 14, 15, 16, 17, 20].map((day) => ({ date: `2026-09-${day}`, volume: 100 }));
  const open = DefectMath.dayVolumes(volumes, rows, '', '');
  assert.deepEqual(open.items.map((item) => item.date), ['2026-09-14', '2026-09-15', '2026-09-16'], 'an open period runs from the first to the last day with entries');
  assert.deepEqual([open.missing.length, open.total, open.undated], [0, 300, false]);
  assert.deepEqual(DefectMath.dayVolumes(volumes, rows, '', '2026-09-17').items.map((item) => item.date), ['2026-09-14', '2026-09-15', '2026-09-16', '2026-09-17'], 'a period with its own end counts its quiet days');
  const gap = DefectMath.dayVolumes(volumes.filter((item) => item.date !== '2026-09-16'), rows, '', '');
  assert.deepEqual(plain(gap.missing), ['2026-09-16']);
  assert.equal(DefectMath.dayVolumes(volumes, [...rows, { date: '' }], '', '').undated, true);
  assert.deepEqual(plain(DefectMath.dayVolumes(volumes, [], '', '')), { items: [], missing: [], undated: false, total: 0 });
});

test('trend shares divide each day by its own volume and leave out days without one', () => {
  const { ToolKit } = load();
  const rows = [{ date: '2026-09-01', units: 2 }, { date: '2026-09-01', units: 1 }, { date: '2026-09-03', units: 4 }, { date: '2026-09-05', units: 9 }, { date: '', units: 1 }];
  const volumes = [['2026-09-01', 100], ['2026-09-02', 100], ['2026-09-03', 200], ['2026-09-04', 50]].map(([date, volume]) => ({ date, volume }));
  const trend = ToolKit.trendShares(rows, (row) => row.units, volumes);
  assert.deepEqual(plain(trend.buckets.map((b) => [b.key, b.count, b.total, b.value])), [['2026-09-01', 3, 100, 0.03], ['2026-09-02', 0, 100, 0], ['2026-09-03', 4, 200, 0.02], ['2026-09-04', 0, 50, 0]]);
  assert.deepEqual(plain(trend.skipped), ['2026-09-05'], 'a day with entries and no volume has no share');
  assert.equal(trend.undated, 1);
  // Over 31 days the shares are per week: the counts and the volumes of the week add up first.
  const long = ToolKit.trendShares([{ date: '2026-09-07', units: 1 }, { date: '2026-09-08', units: 3 }], (row) => row.units, [{ date: '2026-09-07', volume: 100 }, { date: '2026-09-08', volume: 100 }, { date: '2026-10-20', volume: 50 }]);
  assert.equal(long.unit, 'week');
  assert.deepEqual(plain(long.buckets[0]), { key: '2026-09-07', to: '2026-09-13', count: 4, total: 200, value: 0.02 });
});

test('the trend chart draws a target line and turns the columns above it red', () => {
  const { ToolKit, document } = load();
  const trend = ToolKit.trendShares([{ date: '2026-09-01', units: 3 }, { date: '2026-09-02', units: 1 }, { date: '2026-09-03', units: 2 }], (row) => row.units,
    [{ date: '2026-09-01', volume: 1000 }, { date: '2026-09-02', volume: 1000 }, { date: '2026-09-03', volume: 1000 }]);
  const labels = { title: 'Damage rate', unit: 'Damage rate', average: 'Average', format: (v) => `${(v * 100).toFixed(2)}%`, target: 0.0025, targetLabel: 'Target' };
  const figure = ToolKit.trendFigure(trend, labels, 'damage-control');
  document.body.append(figure);
  const text = figure.querySelector('svg').textContent;
  assert.match(text, /Target 0\.25%/);
  assert.match(text, /Average 0\.20%/);
  assert.equal(figure.querySelectorAll('rect[style*="--tr-top"]').length, 1, 'only 0.30% is above the 0.25% target');
  // Small shares get a small axis: the highest column is 0.30%, so the axis ends at 0.5% rather than 1%.
  assert.match(text, /0\.50%/);
  assert.doesNotMatch(text, /1\.00%/);
  // Without a target, the highest column is the red one.
  const plainFigure = ToolKit.trendFigure(trend, { ...labels, target: null }, 'damage-control');
  document.body.append(plainFigure);
  assert.equal(plainFigure.querySelectorAll('rect[style*="--tr-top"]').length, 1);
});

// Every text a tool shows through tx("…") in a script, or "…" | t(lang) in a page, must have a German and an Albanian text.
const textsOf = (file) => {
  const source = fs.readFileSync(file, 'utf8');
  const found = new Set();
  for (const match of source.matchAll(/\btx\("((?:[^"\\]|\\.)*)"/g)) found.add(match[1]);
  for (const match of source.matchAll(/\btx\(\s*[\w.]+(?: === \d)? \? "((?:[^"\\]|\\.)*)" : "((?:[^"\\]|\\.)*)"/g)) { found.add(match[1]); found.add(match[2]); }
  for (const match of source.matchAll(/"((?:[^"\\]|\\.)*)" \| t\(lang\)/g)) found.add(match[1]);
  return [...found].map((text) => text.replace(/\\"/g, '"'));
};
test('the texts of the Pulse tools and their pages are translated', () => {
  const files = ['src/js/tool-kit.js', 'src/js/defect-log.js', 'src/js/delay-analyzer.js', 'src/js/shift-pulse.js', 'src/js/sigma-chart.js',
    'src/_includes/partials/defect-log.njk', 'src/_includes/partials/shift-pulse.njk', 'src/_includes/partials/sigma-chart.njk'];
  for (const lang of ['de', 'sq']) {
    const ui = JSON.parse(fs.readFileSync(`src/_data/${lang}/ui.json`, 'utf8'));
    for (const file of files) {
      for (const text of textsOf(file)) assert.ok(ui[text], `${lang}: ${file}: ${text}`);
    }
  }
});

test('days handed to the control chart become points, and the same metric adds to the chart instead of replacing it', () => {
  const dom = new JSDOM('<html lang="en"><body></body></html>', { url: 'https://example.test/tools/sigma-control-chart/', runScripts: 'outside-only' });
  dom.window.eval(fs.readFileSync('src/js/tool-kit.js', 'utf8'));
  dom.window.eval(fs.readFileSync('src/js/sigma-chart.js', 'utf8'));
  const { SigmaMath } = dom.window;
  const given = { source: 'Damage Control', metric: 'Damaged units', unit: 'Units handled', rows: [
    { date: '2026-09-14', n: 3000, d: 20 }, { date: '14.09.2026', n: 100, d: 1 }, { date: '2026-09-15', n: 100, d: 101 },
    { date: '2026-09-16', n: 0, d: 0 }, { date: '2026-09-17', n: 100, d: 0 }, { date: 'soon', n: 100, d: 1 }, null,
  ] };
  const empty = { metric: '', unit: '', rows: [] };
  const first = plain(SigmaMath.takeOver(given, empty));
  assert.deepEqual(first.rows.map((row) => [row.date, row.n, row.d]), [['2026-09-14', 3000, 20], ['2026-09-14', 100, 1], ['2026-09-17', 100, 0]], 'more defects than handled, no volume and no date are not points');
  assert.equal(first.merge, false, 'an empty chart is filled, not merged');
  const chart = { metric: ' damaged UNITS ', unit: 'units handled', rows: [{ date: '2026-09-01', n: 10, d: 1 }] };
  assert.equal(SigmaMath.takeOver(given, chart).merge, true, 'the same metric and unit, whatever the case');
  assert.equal(SigmaMath.takeOver(given, { ...chart, metric: 'Incomplete orders' }).merge, false);
  assert.equal(SigmaMath.takeOver(given, { ...chart, unit: 'Orders shipped' }).merge, false);
});
