// The charts of the logs as something to work with: a cause, stage, shift or reason picked in the result filters the log
// and the trend; the trend goes by day, week or month and can show the period before; changes marked on the timeline
// (js/annotations.js) are lines in the charts, and the Sigma & Control Chart can split its limits at one.
// The partials are rendered from src (not _site) with the filters stubbed the way scripts/check-tool.mjs stubs them.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const nunjucks = require('nunjucks');
const { JSDOM } = require('jsdom');

const read = (file) => JSON.parse(fs.readFileSync(file, 'utf8'));
const plain = (value) => JSON.parse(JSON.stringify(value));
const env = new nunjucks.Environment(new nunjucks.FileSystemLoader(['src/_includes']), { autoescape: false });
env.addFilter('t', (text) => text);
env.addFilter('local', (url, lang) => (lang === 'de' || lang === 'sq' ? `/${lang}${url}` : url));
env.addFilter('assetUrl', (url) => url);
env.addFilter('scriptJson', (value) => JSON.stringify(value).replace(/[<>&\u2028\u2029]/g, (char) => `\\u${char.charCodeAt(0).toString(16).padStart(4, '0')}`));
env.addFilter('lc', (text, lang) => (lang === 'de' ? String(text) : String(text).toLowerCase()));

const now = new Date();
const daysAgo = (k) => new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate() - k)).toISOString().slice(0, 10);

// A bare window with the kit (and the annotations), for the arithmetic.
const bare = (lang = 'en') => {
  const { window } = new JSDOM(`<!doctype html><html lang="${lang}"><body></body></html>`, { url: 'https://example.test/tools/damage-control/', runScripts: 'outside-only' });
  window.eval(fs.readFileSync('src/js/tool-kit.js', 'utf8'));
  window.eval(fs.readFileSync('src/js/annotations.js', 'utf8'));
  return window;
};
// A tool page: its partial, then the scripts in the order the partial loads them.
const page = ({ partial, scripts, cfg, slug, saved = {} }) => {
  const body = env.render(`partials/${partial}.njk`, { cfg });
  const html = `<!doctype html><html lang="en"><body>${body.replace(/<script\b[^>]*\bsrc=[^>]*><\/script>/g, '')}</body></html>`;
  const { window } = new JSDOM(html, { url: `https://example.test/tools/${slug}/`, runScripts: 'outside-only', pretendToBeVisual: true });
  window.confirm = () => true;
  window.scrollTo = () => {};
  window.HTMLElement.prototype.scrollIntoView = () => {};
  for (const [key, value] of Object.entries(saved)) window.localStorage.setItem(key, JSON.stringify(value));
  for (const file of scripts) window.eval(fs.readFileSync(`src/js/${file}.js`, 'utf8'));
  return window;
};

test('trend buckets go by month: the key is the first day, the label the month in the page language', () => {
  const window = bare();
  const { ToolKit } = window;
  const rows = [{ date: '2026-09-30', u: 2 }, { date: '2026-10-01', u: 1 }, { date: '2026-10-31', u: 4 }, { date: '2026-12-02', u: 3 }];
  const months = ToolKit.trendBuckets(rows, (row) => row.u, 60, null, { unit: 'month' });
  assert.equal(months.unit, 'month');
  assert.deepEqual(plain(months.buckets.map((b) => [b.key, b.to, b.value])), [
    ['2026-09-01', '2026-09-30', 2], ['2026-10-01', '2026-10-31', 5], ['2026-11-01', '2026-11-30', 0], ['2026-12-01', '2026-12-31', 3],
  ], 'a quiet month is 0, and each month ends on its own last day');
  assert.equal(ToolKit.trendBuckets(rows, (row) => row.u, 60, null, { unit: 'month', from: '2026-08-15' }).buckets[0].key, '2026-08-01');
  // February in a leap year, and shares by month.
  const leap = ToolKit.trendBuckets([{ date: '2028-02-10', late: 1 }, { date: '2028-02-29', late: 0 }], (row) => row.late, 60, () => 1, { unit: 'month' });
  assert.deepEqual(plain(leap.buckets), [{ key: '2028-02-01', to: '2028-02-29', count: 1, total: 2, value: 0.5 }]);
  // Without a unit the choice stays as it was: days up to 31 days, then weeks.
  assert.equal(ToolKit.trendBuckets(rows, (row) => row.u).unit, 'week');
  const svg = ToolKit.trendFigure(months, { title: 'Damage', unit: 'Damages', average: 'Average' }, 'damage-control').querySelector('svg');
  assert.match(svg.textContent, /Oct 2026/);
  assert.equal(ToolKit.monthYear(new Date('2026-10-01T00:00:00Z')), 'Oct 2026');
  assert.equal(bare('sq').ToolKit.monthYear(new Date('2026-10-01T00:00:00Z')), 'Tet 2026');
  assert.match(bare('de').ToolKit.monthYear(new Date('2026-10-01T00:00:00Z')), /^Okt\.? 2026$/);
});

test('the period before has the same length, and the change is a share of before', () => {
  const { ToolKit } = bare();
  assert.deepEqual(plain(ToolKit.previousRange({ from: '2026-10-08', to: '2026-10-14' })), { from: '2026-10-01', to: '2026-10-07', days: 7 });
  assert.deepEqual(plain(ToolKit.previousRange({ from: '2026-03-01', to: '2026-03-31' })), { from: '2026-01-29', to: '2026-02-28', days: 31 });
  assert.equal(ToolKit.previousRange({ from: '2026-10-08', to: '' }), null);
  assert.equal(ToolKit.previousRange({ from: '2026-10-08', to: '2026-10-01' }), null);
  // Totals: a share is all counts over all totals (not the mean of the days), a count is the sum.
  const shares = { buckets: [{ count: 3, total: 1000, value: 0.003 }, { count: 9, total: 1000, value: 0.009 }, { count: 0, total: 0, value: 0 }] };
  assert.deepEqual(plain(ToolKit.trendTotal(shares)), { value: 0.006, count: 12, total: 2000 });
  assert.equal(ToolKit.trendTotal({ buckets: [{ value: 4 }, { value: 6 }] }).value, 10);
  assert.equal(ToolKit.trendTotal({ buckets: [{ count: 0, total: 0, value: 0 }] }).value, null);
  assert.ok(Math.abs(ToolKit.periodChange(0.0042, 0.0057) - (-0.26316)) < 1e-4);
  assert.equal(ToolKit.periodChange(5, 0), null, 'nothing before: no percentage');
  assert.equal(ToolKit.compareText(0.0042, 0.0057, ToolKit.shareText), 'This period 0.42% · before 0.57% · −26%');
  assert.equal(ToolKit.compareText(12, 10, (v) => String(v)), 'This period 12 · before 10 · +20%');
  assert.equal(ToolKit.compareText(3, 0, (v) => String(v)), 'This period 3 · before 0');
});

test('the trend chart draws the period before and the events on the timeline', () => {
  const window = bare();
  const { ToolKit } = window;
  const trend = ToolKit.trendBuckets([{ date: '2026-10-12', u: 2 }, { date: '2026-10-13', u: 5 }, { date: '2026-10-14', u: 1 }], (row) => row.u);
  const previous = ToolKit.trendBuckets([{ date: '2026-10-09', u: 4 }], (row) => row.u, 60, null, { from: '2026-10-09', to: '2026-10-11' });
  const figure = ToolKit.trendFigure(trend, { title: 'Damage', unit: 'Damages', average: 'Average', previous: previous.buckets, events: [{ date: '2026-10-13', text: 'New stacking standard' }, { date: '2026-11-30', text: 'Outside' }] }, 'damage-control');
  const svg = figure.querySelector('svg');
  assert.equal(svg.querySelectorAll('path.tr-before').length, 1);
  assert.equal(svg.querySelectorAll('g.tr-event').length, 1, 'an event outside the chart is not drawn');
  assert.match(svg.querySelector('g.tr-event').getAttribute('data-tip'), /New stacking standard/);
  const tips = [...svg.querySelectorAll('g.tr-col')].map((g) => g.getAttribute('data-tip'));
  assert.match(tips[0], /\nBefore \(9 Oct\): 4 Damages|\nBefore \(9 Oct\): 4/);
});

test('the annotations store keeps one list for every tool and language', () => {
  const window = bare();
  const { Annotations } = window;
  let changes = 0;
  window.addEventListener('annotations:changed', () => { changes++; });
  const first = Annotations.add({ date: '2026-10-12', text: '  New stacking standard  ', tools: ['damage-control'] });
  Annotations.add({ date: '2026-10-01', text: 'New WMS release', tools: [] });
  Annotations.add({ date: '2026-10-20', text: 'Second loader on nights', tools: ['delay-analyzer'] });
  assert.equal(Annotations.add({ date: '12.10.2026', text: 'x' }), null, 'a date must be YYYY-MM-DD');
  assert.equal(Annotations.add({ date: '2026-10-12', text: '   ' }), null, 'and there must be a text');
  assert.equal(changes, 3);
  assert.equal(first.text, 'New stacking standard');
  const saved = JSON.parse(window.localStorage.getItem('sc-annotations'));
  assert.ok(Array.isArray(saved.rows) && saved.rows.length === 3, 'stored as { rows: [...] }');
  assert.deepEqual(plain(Annotations.list('', '', 'damage-control').map((row) => row.text)), ['New WMS release', 'New stacking standard'], 'the tool sees its own and the ones for all');
  assert.deepEqual(plain(Annotations.list('2026-10-05', '2026-10-31', 'delay-analyzer').map((row) => row.text)), ['Second loader on nights']);
  assert.equal(Annotations.list().length, 3);
  assert.equal(Annotations.remove(first.id), true);
  assert.equal(Annotations.remove('nope'), false);
  assert.deepEqual(plain(Annotations.list('', '', 'damage-control').map((row) => row.text)), ['New WMS release']);
  // A damaged store loads what it can and never throws.
  window.localStorage.setItem('sc-annotations', JSON.stringify({ rows: [null, { date: 'x', text: 'y' }, { id: 'a', date: '2026-09-01', text: 'Ok', tools: ['damage-control', 5] }] }));
  assert.deepEqual(plain(Annotations.all()), [{ id: 'a', date: '2026-09-01', text: 'Ok', tools: ['damage-control'] }]);
  window.localStorage.setItem('sc-annotations', '{broken');
  assert.deepEqual(plain(Annotations.all()), []);
  // The work backup carries it as a list of rows.
  window.eval(fs.readFileSync('src/js/work-backup.js', 'utf8'));
  const file = (value) => JSON.stringify({ format: 'stiven-catalyst-work', version: 1, items: { 'sc-annotations': value } });
  assert.ok(window.WorkBackup.readBackup(file(JSON.stringify({ rows: [] }))));
  assert.equal(window.WorkBackup.readBackup(file(JSON.stringify([]))), null, 'a list without { rows } is refused');
  assert.equal(window.WorkBackup.toolSlug('sc-annotations'), 'annotations');
});

test('SigmaMath splits the limits into phases with their own centre line', () => {
  const window = bare();
  window.eval(fs.readFileSync('src/js/sigma-chart.js', 'utf8'));
  const { SigmaMath } = window;
  // Five days at 1 %, then five at 0.5 %, 1,000 handled each day; the change starts on day six.
  const rows = [...Array(10)].map((_, i) => ({ date: `2026-10-${String(i + 1).padStart(2, '0')}`, n: 1000, d: i < 5 ? 10 : 5 }));
  const parts = plain(SigmaMath.phases(rows, ['2026-10-06']));
  assert.deepEqual(parts.map((p) => [p.start, p.end, p.from, p.to, p.n, p.d, p.pBar]), [
    [0, 5, '2026-10-01', '2026-10-05', 5000, 50, 0.01], [5, 10, '2026-10-06', '2026-10-10', 5000, 25, 0.005],
  ]);
  // A cut on a day without a point starts the phase at the next day; one on the first day or after the last splits nothing.
  rows.splice(5, 1);
  assert.deepEqual(plain(SigmaMath.phases(rows, ['2026-10-06'])).map((p) => [p.start, p.from]), [[0, '2026-10-01'], [5, '2026-10-07']]);
  assert.equal(SigmaMath.phases(rows, ['2026-10-01', '2026-11-30']).length, 1);
  assert.equal(SigmaMath.phases(rows).length, 1);
  // 3 standard errors: 3 × √(0.01 × 0.99 / 1000) = 0.0094393.
  const limits = SigmaMath.limitsFor(1000, 0.01);
  assert.ok(Math.abs(limits.ucl - 0.0194393) < 1e-6);
  assert.ok(Math.abs(limits.lcl - 0.0005607) < 1e-6);
  assert.equal(SigmaMath.limitsFor(100, 0.01).lcl, 0, 'the lower limit stops at 0');
  const changes = plain(SigmaMath.levelChanges(parts));
  assert.deepEqual(changes, [{ at: '2026-10-06', before: 0.01, after: 0.005, change: -0.5 }]);
  // The rules within a phase: eight in a row above its centre line, and a point beyond its limit.
  const points = [0.012, 0.011, 0.013, 0.012, 0.011, 0.012, 0.013, 0.011, 0.005, 0.03].map((p) => ({ p, ...SigmaMath.limitsFor(1000, 0.01) }));
  assert.deepEqual(plain(SigmaMath.signalRules(points, 0.01)), [
    { rule: 'beyond', worse: true, from: 9, to: 9 }, { rule: 'run', worse: true, from: 0, to: 7 },
  ]);
  const rising = [0.001, 0.002, 0.003, 0.004, 0.005, 0.006].map((p) => ({ p, ucl: 1, lcl: 0 }));
  assert.deepEqual(plain(SigmaMath.signalRules(rising, 0.0035)), [{ rule: 'trend', worse: true, from: 0, to: 5 }]);
});

// Damage Control with a week of entries: loading and picking damage on several days and shifts.
const damageCfg = read('src/_data/damageControl.json');
const damageRows = [
  [1, 'Early', 'Loading', 'Crushed', 'Stacking', 3], [1, 'Late', 'Picking', 'Torn', 'Handling', 1], [2, 'Early', 'Loading', 'Crushed', 'Stacking', 2],
  [3, 'Late', 'Picking', 'Torn', 'Handling', 2], [4, 'Early', 'Loading', 'Dented', 'Forklift', 1], [5, 'Night', 'Storage', 'Wet', 'Unknown', 1],
  [12, 'Early', 'Loading', 'Crushed', 'Stacking', 4],
].map(([ago, shift, stage, type, cause, units]) => ({ date: daysAgo(ago), shift, stage, type, cause, units, cost: null, note: '' }));
const damageState = (extra = {}) => ({ 'sc-damage-control': { period: '', volume: '', target: '', from: daysAgo(6), to: daysAgo(0), volumes: [], example: {}, totalsFor: {}, rows: damageRows, ...extra } });
const damage = (saved) => page({ partial: 'defect-log', scripts: ['tool-kit', 'annotations', 'workplace', 'defect-log'], cfg: damageCfg, slug: 'damage-control', saved });
const logRows = (window) => [...window.document.querySelectorAll('[data-log] tr')].map((tr) => tr.children[2].textContent);
const pickButton = (window, field, value) => [...window.document.querySelectorAll('[data-results] button.dl-bar')].find((b) => b.dataset.focusKey === `pick:${field}:${value}`);

test('a stage picked in the result filters the log and the trend, and the chip clears it', () => {
  const window = damage(damageState());
  const { document } = window;
  assert.equal(logRows(window).length, 7);
  const loading = pickButton(window, 'stage', 'Loading');
  assert.ok(loading, 'the stage rows are buttons');
  assert.equal(loading.tagName, 'BUTTON');
  assert.equal(loading.type, 'button');
  assert.equal(loading.getAttribute('aria-pressed'), 'false');
  assert.equal(loading.querySelectorAll('div').length, 0, 'only phrasing content inside the button');
  loading.focus();
  loading.click();
  assert.deepEqual([...new Set(logRows(window))], ['Loading'], 'the log shows only loading damage (the stage column)');
  assert.equal(logRows(window).length, 4, 'all four loading entries, not only those of the period');
  assert.match(document.querySelector('[data-log-wrap]').previousElementSibling.textContent, /Filtered: Loading/);
  const trendPanel = [...document.querySelectorAll('[data-results] .dl-panel')].find((p) => /Trend over time/.test(p.querySelector('.result-label').textContent));
  assert.match(trendPanel.querySelector('.result-label').textContent, /Trend over time · Loading/);
  assert.ok(trendPanel.querySelector('.ci-chip'), 'a chip at the trend');
  // The trend counts the loading units of each day only: 3, 2, 1 in the last seven days.
  const tips = [...trendPanel.querySelectorAll('g.tr-col')].map((g) => g.getAttribute('data-tip'));
  assert.equal(tips.length, 7, 'the whole period stays on the axis');
  assert.equal(tips.filter((tip) => /: [1-9]/.test(tip)).length, 3);
  // The pressed row keeps the focus after the redraw.
  assert.equal(document.activeElement, pickButton(window, 'stage', 'Loading'));
  assert.equal(document.activeElement.getAttribute('aria-pressed'), 'true');
  // A cause from the Pareto replaces the stage.
  pickButton(window, 'cause', 'Handling').click();
  assert.deepEqual([...new Set(logRows(window))], ['Picking']);
  // The chip clears it; the filter is never saved.
  document.querySelector('[data-log-wrap]').previousElementSibling.querySelector('.ci-chip').click();
  assert.equal(logRows(window).length, 7);
  assert.equal(document.querySelector('[data-results] .ci-chip'), null);
  const saved = JSON.parse(window.localStorage.getItem('sc-damage-control') || '{}');
  assert.equal(JSON.stringify(saved).includes('Handling"}'), false);
  assert.equal('picked' in saved, false);
});

test('day, week or month is remembered, and the period before is drawn with its total', () => {
  const window = damage(damageState({ from: '', to: '' }));
  const { document } = window;
  const grain = (value) => [...document.querySelectorAll('.ci-grain button')].find((b) => b.dataset.focusKey === `grain:${value}`);
  assert.equal(grain('day').getAttribute('aria-pressed'), 'true', 'automatic: 13 days go by day');
  assert.ok(document.querySelector('.ci-auto'));
  grain('week').click();
  assert.equal(JSON.parse(window.localStorage.getItem('sc-damage-control')).grain, 'week');
  assert.equal(grain('week').getAttribute('aria-pressed'), 'true');
  assert.equal(document.querySelector('.ci-auto'), null);
  grain('month').click();
  assert.match(document.querySelector('[data-results] .dl-panel-note').textContent, /per month/);
  grain('day').click();
  // Compare: the last seven days against the seven before.
  const later = damage(damageState());
  const box = later.document.querySelector('.ci-compare input');
  box.checked = true;
  box.dispatchEvent(new later.window.Event('change', { bubbles: true }));
  assert.equal(JSON.parse(later.localStorage.getItem('sc-damage-control')).compare, true);
  const line = later.document.querySelector('.ci-compare-line').textContent;
  assert.match(line, /^This period 10 · before 4 · \+150% \(/, 'ten units in the last seven days, four in the seven before');
  assert.equal(later.document.querySelectorAll('[data-results] path.tr-before').length, 1);
  assert.match(later.document.querySelector('[data-results] g.tr-col').getAttribute('data-tip'), /\nBefore/);
});

test('a change marked on the timeline is a flag in the trend', () => {
  const window = damage(damageState());
  const { document } = window;
  const form = document.querySelector('[data-annotation-form]');
  form.elements.andate.value = daysAgo(2);
  form.elements.antext.value = 'New stacking standard';
  form.dispatchEvent(new window.Event('submit', { bubbles: true, cancelable: true }));
  assert.deepEqual(plain(window.Annotations.list().map((row) => [row.text, row.tools])), [['New stacking standard', ['damage-control']]]);
  assert.match(document.querySelector('[data-results] g.tr-event').getAttribute('data-tip'), /New stacking standard/);
  assert.match(document.querySelector('[data-annotation-list]').textContent, /New stacking standard/);
  document.querySelector('[data-remove-annotation]').click();
  assert.equal(document.querySelector('[data-results] g.tr-event'), null);
});

test('a reason picked in the Delay Analyzer filters the late routes with that reason', () => {
  const rows = [...Array(12)].map((_, k) => ({ date: daysAgo(k % 4), shift: k % 2 ? 'Late' : 'Early', route: `R${k}`, planDep: '06:00', actDep: '06:00', planArr: '08:00', actArr: k < 5 ? '09:00' : '08:00', reason: k < 3 ? 'Traffic' : k < 5 ? 'Late loading' : '', note: '' }));
  const window = page({ partial: 'delay-analyzer', scripts: ['tool-kit', 'annotations', 'workplace', 'delay-analyzer'], cfg: read('src/_data/delayAnalyzer.json'), slug: 'delay-analyzer',
    saved: { 'sc-delay-analyzer': { period: '', routes: '', departureGrace: '10', arrivalGrace: '15', target: '', from: '', to: '', example: {}, totalsFor: {}, rows } } });
  const { document } = window;
  const traffic = [...document.querySelectorAll('[data-results] button.dl-bar')].find((b) => b.dataset.focusKey === 'pick:reason:Traffic');
  assert.ok(traffic);
  traffic.click();
  assert.equal(document.querySelectorAll('[data-log] tr').length, 3);
  const tips = [...document.querySelectorAll('[data-results] g.tr-col')].map((g) => g.getAttribute('data-tip'));
  // Three routes a day, and the late ones for traffic are a share of all of them.
  assert.ok(tips.some((tip) => /\(1\/3\)/.test(tip)), tips.join(' | '));
  const shift = [...document.querySelectorAll('[data-results] button.dl-bar')].find((b) => b.dataset.focusKey === 'pick:shift:Late');
  shift.click();
  assert.equal(document.querySelectorAll('[data-log] tr').length, 6);
});

test('the Sigma & Control Chart splits its limits at a change and says how the level moved', () => {
  const rows = [...Array(20)].map((_, i) => ({ date: daysAgo(19 - i), n: 1000, d: i < 10 ? 10 : 5, note: '' }));
  const window = page({ partial: 'sigma-chart', scripts: ['tool-kit', 'annotations', 'sigma-chart'], cfg: read('src/_data/sigmaChart.json'), slug: 'sigma-control-chart',
    saved: { 'sc-sigma-chart': { metric: 'Damaged units', unit: 'Units handled', baseline: '', grain: 'day', rows, example: {} },
      'sc-annotations': { rows: [{ id: 'x1', date: daysAgo(9), text: 'New stacking standard', tools: [] }] } } });
  const { document } = window;
  const results = document.querySelector('[data-results]');
  assert.equal(results.querySelectorAll('.sc-event').length, 1);
  const button = [...results.querySelectorAll('.sc-change-list button')].find((b) => /Split the limits/.test(b.textContent));
  assert.ok(button);
  button.click();
  assert.deepEqual(JSON.parse(window.localStorage.getItem('sc-sigma-chart')).splits, ['x1']);
  assert.match(results.textContent, /the level moved from 1\.00% to 0\.50% \(−50%\)/);
  assert.match(results.textContent, /Since the change/);
  assert.match(results.querySelector('.sc-change-list button').textContent, /Use one set of limits again/);
  assert.equal(results.querySelectorAll('.sc-chart .sc-divider').length, 1);
  // Before the split, ten days above and ten below one centre line were signals; split, each level is stable.
  assert.match(results.querySelector('h2').textContent, /Stable/);
  results.querySelector('.sc-change-list button').click();
  assert.deepEqual(JSON.parse(window.localStorage.getItem('sc-sigma-chart')).splits, []);
  assert.doesNotMatch(results.querySelector('h2').textContent, /Stable/);
});

test('every new text has a German and an Albanian translation', () => {
  const part = read('src/_data/i18n-parts/chart-interaction.json');
  assert.deepEqual(Object.keys(part.de), Object.keys(part.sq));
  const vars = (text) => [...text.matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort().join();
  for (const lang of ['de', 'sq']) {
    for (const [en, text] of Object.entries(part[lang])) assert.equal(vars(text), vars(en), `${lang}: ${en}`);
  }
});
