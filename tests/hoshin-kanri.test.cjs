// Hoshin Kanri (src/js/hoshin-kanri.js): the gaps of the X-matrix, the primary owner rule, the bowling chart month by
// month (also where lower is better), the rule of two misses in a row, the target path and the trend, reading the
// Project Portfolio in its real shape, the example, the page and its hand-offs, and the data files in three languages.
process.env.TZ = 'Europe/Berlin';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const { JSDOM } = require('jsdom');

const plain = (value) => JSON.parse(JSON.stringify(value));
const readJson = (file) => JSON.parse(fs.readFileSync(file, 'utf8'));
const readData = (lang = 'en', name = 'hoshinKanri') => readJson(`src/_data/${lang === 'en' ? '' : `${lang}/`}${name}.json`);
const shape = (value) => (Array.isArray(value) ? 'list'
  : value && typeof value === 'object' ? Object.fromEntries(Object.keys(value).sort().map((key) => [key, shape(value[key])])) : typeof value);
const DAY = '2026-10-23';

// The partial with its Nunjucks stripped, enough for the script to find its elements.
const pageHtml = (lang) => {
  const cfg = readData(lang);
  return fs.readFileSync('src/_includes/partials/hoshin-kanri.njk', 'utf8')
    .replace(/\{#[\s\S]*?#\}/g, '')
    .replace(/\{%-?[\s\S]*?-?%\}/g, '')
    .replace(/\{\{ *"([^"]+)" *\| *t\(lang\)[^}]*\}\}/g, '$1')
    .replace(/\{\{ *'(\/tools\/[^']+)' *\| *local\(lang\) *\}\}/g, (m, path) => (lang === 'en' ? path : `/${lang}${path}`))
    .replace(/\{\{ *cfg *\| *scriptJson *\| *safe *\}\}/, JSON.stringify(cfg).replace(/</g, '\\u003c'))
    .replace(/\{\{[^}]*\}\}/g, '')
    .replace(/<script src=[^>]*><\/script>/g, '');
};

const load = (lang = 'en', { page = false, now = `${DAY}T10:00:00Z`, storage = {}, portfolio = false } = {}) => {
  const html = `<html lang="${lang}"><body><main>${page ? pageHtml(lang) : ''}</main></body></html>`;
  const dom = new JSDOM(html, { url: `https://example.test/${lang === 'en' ? '' : `${lang}/`}tools/hoshin-kanri/`, runScripts: 'outside-only', pretendToBeVisual: true });
  const w = dom.window;
  w.eval(`(() => { const Real = Date; const fixed = new Real(${JSON.stringify(now)}); Date = class extends Real { constructor(...args) { super(...(args.length ? args : [fixed])); } static now() { return fixed.getTime(); } }; })();`);
  w.confirm = () => true;
  w.print = () => {};
  w.HTMLElement.prototype.scrollIntoView = () => {};
  Object.entries(storage).forEach(([key, value]) => w.localStorage.setItem(key, JSON.stringify(value)));
  const files = ['tool-kit', 'chart-kit', 'actions-store', 'template-pack', ...(portfolio ? ['project-portfolio'] : []), 'hoshin-kanri'];
  for (const file of files) w.eval(fs.readFileSync(`src/js/${file}.js`, 'utf8'));
  return w;
};
const example = (M, lang = 'en', day = DAY) => M.fromExample(readData(lang).example, day);
const byId = (plan, list, id) => plan[list].find((item) => item.id === id);

test('the gaps of the X-matrix: the example has one, and every kind of gap is found', () => {
  const { HoshinKanriMath: M } = load();
  assert.deepEqual(plain(M.gaps(example(M)).map((g) => [g.kind, g.code])), [['priority-no-primary', 'P6']], 'the example: the cartons have two secondaries and no primary owner');
  const plan = M.cleanPlan({
    breakthroughs: [{ id: 'b1', text: 'B one' }, { id: 'b2', text: 'B two' }],
    annual: [{ id: 'a1', text: 'A one' }, { id: 'a2', text: 'A two' }],
    priorities: [{ id: 'p1', text: 'P one' }, { id: 'p2', text: 'P two' }, { id: 'p3', text: 'P three' }],
    metrics: [{ id: 'm1', text: 'M one' }, { id: 'm2', text: 'M two' }],
    owners: [{ id: 'r1', text: 'Ann' }, { id: 'r2', text: 'Ben' }],
    links: {
      ba: { 'a1|b1': 'weak', 'a2|zz': 'strong' },
      pa: { 'p1|a1': 'strong', 'p3|a1': 'weak' },
      pm: { 'p1|m1': 'weak', 'p3|m1': 'strong' },
      po: { 'p1|r1': 'primary', 'p2|r1': 'primary', 'p2|r2': 'primary', 'p3|r2': 'secondary' },
    },
  }, '2026-01');
  assert.equal(plan.links.ba['a2|zz'], undefined, 'a link to an item that is not there is dropped');
  assert.deepEqual(plain(M.gaps(plan).map((g) => `${g.code} ${g.kind}`)), [
    'B2 breakthrough-no-annual',
    'A2 annual-no-breakthrough',
    'A2 annual-no-priority',
    'P2 priority-no-annual',
    'P2 priority-no-metric',
    'P2 priority-many-primary',
    'P3 priority-no-primary',
    'M2 metric-no-priority',
  ]);
  assert.equal(M.gaps(plan).find((g) => g.kind === 'priority-many-primary').count, 2);
  // A weak mark is a link too: closing each gap empties the list.
  Object.assign(plan.links.ba, { 'a2|b2': 'weak' });
  Object.assign(plan.links.pa, { 'p2|a2': 'weak' });
  Object.assign(plan.links.pm, { 'p2|m2': 'weak' });
  plan.links.po['p2|r2'] = 'secondary';
  plan.links.po['p3|r2'] = 'primary';
  assert.deepEqual(plain(M.gaps(plan)), []);
});

test('the primary owner rule: exactly one primary owner per priority, secondaries do not count', () => {
  const { HoshinKanriMath: M } = load();
  const plan = M.cleanPlan({ priorities: [{ id: 'p1' }], owners: [{ id: 'r1', text: 'Ann' }, { id: 'r2', text: 'Ben' }, { id: 'r3', text: 'Cem' }] }, '2026-01');
  assert.equal(M.ownerCheck(plan, 'p1'), 'none', 'nobody');
  plan.links.po = { 'p1|r1': 'secondary', 'p1|r2': 'secondary' };
  assert.equal(M.ownerCheck(plan, 'p1'), 'none', 'two secondaries are still no primary owner');
  plan.links.po['p1|r3'] = 'primary';
  assert.equal(M.ownerCheck(plan, 'p1'), 'ok');
  assert.deepEqual(plain(M.primaries(plan, 'p1').map((o) => o.text)), ['Cem']);
  plan.links.po['p1|r1'] = 'primary';
  assert.equal(M.ownerCheck(plan, 'p1'), 'many');
  assert.equal(M.primaries(plan, 'p1').length, 2);
  // A strength is not a role: the resources matrix keeps primary and secondary only.
  const cleaned = M.cleanPlan({ priorities: [{ id: 'p1' }], owners: [{ id: 'r1' }], links: { po: { 'p1|r1': 'strong' }, pa: { 'p1|r1': 'primary' } } }, '2026-01');
  assert.deepEqual(plain(cleaned.links.po), {});
  assert.equal(M.ownerCheck(cleaned, 'p1'), 'none');
  // The example: every priority but the cartons has one primary owner.
  const ex = example(M);
  assert.deepEqual(plain(ex.priorities.map((p) => M.ownerCheck(ex, p.id))), ['ok', 'ok', 'ok', 'ok', 'ok', 'none']);
});

test('the bowling chart: met or missed per month, with lower is better and an actual equal to its target', () => {
  const { HoshinKanriMath: M } = load();
  const higher = { better: 'higher', targets: [90, 90, 90, null, 90], actuals: [91, 90, 89.9, 95, null] };
  assert.deepEqual([0, 1, 2, 3, 4].map((i) => M.monthStatus(higher, i)), ['met', 'met', 'missed', 'no-target', 'open']);
  const lower = { better: 'lower', targets: [5, 5, 5, 5], actuals: [4.9, 5, 5.1, null] };
  assert.deepEqual([0, 1, 2, 3].map((i) => M.monthStatus(lower, i)), ['met', 'met', 'missed', 'open'], 'lower is better: at or below the target is met');
  assert.equal(M.monthStatus({ better: 'lower', targets: [3.2], actuals: [3.1 + 0.1] }, 0), 'met', 'binary noise is not a miss');
  const ex = example(M);
  const status = (id) => plain(Array.from({ length: 12 }, (_, i) => M.monthStatus(byId(ex, 'metrics', id), i)));
  const s = (text) => text.split(' ').map((c) => ({ y: 'met', n: 'missed', o: 'open' }[c]));
  assert.deepEqual(status('m1'), s('y y n y y n y y y o o o'), 'OTIF, higher is better');
  assert.deepEqual(status('m2'), s('n n y y y y y y y o o o'), 'dock to stock, lower is better');
  assert.deepEqual(status('m3'), s('n y y y n y y n n o o o'), 'cost per order, lower is better');
  assert.deepEqual(status('m4'), s('n y y y y y n y y o o o'));
  assert.deepEqual(status('m5'), s('n y y y n y n y y o o o'));
  assert.deepEqual(status('m6'), s('y y n n n n y n n o o o'));
  const b = M.bowling(byId(ex, 'metrics', 'm3'));
  assert.deepEqual([b.met, b.missed, b.reported], [5, 4, 9]);
  assert.deepEqual(plain(M.yearScore(ex, 11)), { met: 35, reported: 54 }, '35 of 54 metric-months met');
  assert.deepEqual(plain(M.monthScore(ex, 8)), { met: 4, missed: 2, reported: 6 }, 'September: OTIF, dock to stock, accuracy and LTIFR met');
});

test('two misses in a row ask for a countermeasure; the review month is the last full month', () => {
  const { HoshinKanriMath: M } = load();
  const ex = example(M);
  assert.equal(ex.start, '2026-01', 'the example year ends nine months in on September');
  assert.equal(M.reviewIndex(ex.start, DAY), 8);
  assert.deepEqual(plain(M.reviewFlags(ex, 8).map((m) => m.id)), ['m3', 'm6'], 'cost per order and turnover missed August and September');
  const m2 = byId(ex, 'metrics', 'm2');
  assert.equal(M.missedTwice(m2, 1), true, 'dock to stock missed January and February');
  assert.equal(M.missedTwice(m2, 8), false);
  assert.equal(M.missedTwice(byId(ex, 'metrics', 'm3'), 0), false, 'the first month has no month before it');
  assert.equal(M.missedTwice(byId(ex, 'metrics', 'm1'), 5), false, 'OTIF missed June only');
  assert.equal(M.missedInARow(byId(ex, 'metrics', 'm6'), 5), 4, 'turnover missed March to June');
  assert.equal(M.missedInARow(byId(ex, 'metrics', 'm6'), 6), 0);
  assert.deepEqual(plain(M.reviewFlags(ex, 1).map((m) => m.id)), ['m2']);
  assert.equal(M.reviewIndex('2026-11', DAY), -1, 'a plan year that has not started');
  assert.equal(M.reviewIndex('2025-01', DAY), 11, 'a plan year that is over');
  assert.equal(M.reviewIndex('2026-04', '2026-05-02'), 0);
  // A fiscal year: in January the example's year runs from April, still nine months in.
  assert.equal(M.exampleStart(readData().example, '2027-01-10'), '2026-04');
  const later = example(M, 'en', '2027-01-10');
  assert.equal(M.reviewIndex(later.start, '2027-01-10'), 8);
  assert.deepEqual(plain(M.reviewFlags(later, 8).map((m) => m.id)), ['m3', 'm6']);
});

test('the target path in twelve equal steps, and the trend by least squares', () => {
  const { HoshinKanriMath: M } = load();
  assert.deepEqual(plain(M.spreadTargets(3.4, 3.05, 2)), [3.37, 3.34, 3.31, 3.28, 3.25, 3.23, 3.2, 3.17, 3.14, 3.11, 3.08, 3.05], '3.225 rounds half up to 3.23');
  assert.deepEqual(plain(M.spreadTargets(0, 12, 0)), [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
  assert.equal(M.spreadTargets(null, 5), null);
  // Every target path of the example is the one the tool spreads.
  const ex = example(M);
  ex.metrics.forEach((m) => assert.deepEqual(plain(M.spreadTargets(m.baseline, m.target, Math.max(1, M.digitsOf(m)))), plain(m.targets), m.text));
  assert.equal(M.digitsOf(byId(ex, 'metrics', 'm3')), 2);
  assert.equal(M.digitsOf(byId(ex, 'metrics', 'm1')), 1);
  // Slope of 1, 2, 3 is 1 a month; lower is better reads a falling line as improving.
  const t = M.trend({ better: 'higher', baseline: 0, target: 12, actuals: [1, 2, 3, null] });
  assert.equal(t.slope, 1);
  assert.equal(t.direction, 'improving');
  assert.equal(M.trend({ better: 'lower', baseline: 0, target: 12, actuals: [1, 2, 3] }).direction, 'worsening');
  assert.equal(M.trend({ better: 'lower', baseline: 12, target: 0, actuals: [5, 5.05, 5] }).direction, 'steady', 'under a tenth of the planned monthly step');
  assert.equal(M.trend({ better: 'lower', baseline: 1, target: 0, actuals: [5] }).direction, null, 'one point has no trend');
  const m3 = M.trend(byId(ex, 'metrics', 'm3'));
  // x = 0…8, x̄ = 4: Σ(x − x̄)y = −1.43 and Σ(x − x̄)² = 60, so b = −0.0238 € a month.
  assert.ok(Math.abs(m3.slope - -1.43 / 60) < 1e-12, `cost per order falls about 2.4 cents a month (${m3.slope})`);
  assert.equal(m3.direction, 'improving', 'improving, though behind the target path');
});

test('the Project Portfolio is read in its real shape: phase, status and savings in the plan year', () => {
  const w = load('en', { portfolio: true });
  const { HoshinKanriMath: M, PortfolioMath: P } = w;
  const pcfg = readData('en', 'projectPortfolio');
  const counts = Object.fromEntries(Object.entries(pcfg.tollgates).map(([k, v]) => [k, v.length]));
  const projects = plain(P.fromExample(pcfg.example, DAY, counts));
  const saved = { projects, current: projects[0].id, example: false };
  const read = M.portfolioProjects(plain(saved));
  assert.equal(read.length, projects.length);
  read.forEach((p, i) => {
    assert.equal(p.id, projects[i].id);
    assert.equal(p.phase, projects[i].phase);
    assert.equal(p.status, projects[i].status);
    // A calendar plan year gives the portfolio's own savings of the year.
    const mine = M.projectSavings(p, '2026-01');
    const theirs = P.savingsYear([projects[i]], 2026);
    assert.ok(Math.abs(mine.planned - theirs.planned) < 1e-6, `${p.title}: planned ${mine.planned} = ${theirs.planned}`);
    assert.equal(mine.realised, theirs.realised, `${p.title}: realised`);
  });
  assert.deepEqual(plain(read.map((p) => p.phase)), ['control', 'analyze', 'measure', 'define']);
  // A fiscal year from July counts the months that fall in it only.
  const hub = read[0];
  const fromJuly = M.projectSavings(hub, '2026-07');
  const months = new Set(M.planMonths('2026-07'));
  assert.equal(fromJuly.realised, hub.savings.realised.filter((r) => months.has(r.month)).reduce((s, r) => s + r.amount, 0));
  // Damaged or foreign data gives nothing, not an error.
  assert.deepEqual(plain(M.portfolioProjects(null)), []);
  assert.deepEqual(plain(M.portfolioProjects({ projects: 'x' })), []);
  const odd = M.portfolioProjects({ projects: [{ title: 'no id' }, { id: 'p1', phase: 'nonsense', status: 'gone', savings: { hard: '1200', realised: [{ month: '2026-13', amount: 5 }, { month: '2026-02', amount: '7' }] } }] });
  assert.deepEqual(plain(odd.map((p) => [p.id, p.phase, p.status, p.savings.hard, p.savings.realised.length])), [['p1', 'define', 'on-track', 1200, 1]]);
  // The example's own projects: in memory, in the same shape.
  const ex = M.exampleProjects(readData().example, DAY);
  assert.deepEqual(plain(ex.map((p) => [p.id, p.phase, p.status])), [['hx-example-crossdock', 'improve', 'on-track'], ['hx-example-pickpath', 'analyze', 'at-risk']]);
  assert.deepEqual(plain(M.projectSavings(ex[0], '2026-01')), { hard: 64000, planned: 48000, realised: 32200 }, 'cross-dock: April to December planned, April to September realised');
  assert.deepEqual(plain(M.projectSavings(ex[1], '2026-01')), { hard: 96000, planned: 48000, realised: 13900 });
  const goals = M.objectiveSavings(example(M), ex, '2026-01');
  const a2 = goals.find((g) => g.id === 'a2');
  assert.deepEqual([a2.realised, a2.planned, a2.target, a2.projects.length], [46100, 96000, 180000, 2], 'both projects count once for the cost objective');
  assert.ok(Math.abs(a2.share - 46100 / 180000) < 1e-12);
  assert.equal(goals.find((g) => g.id === 'a3').projects.length, 0);
});

test('the three data files share one shape, the same numbers, and keep their own saved work', () => {
  const en = readData('en');
  assert.equal(en.storageKey, 'sc-hoshin-kanri');
  assert.equal(en.portfolioKey, readData('en', 'projectPortfolio').storageKey);
  const w = load();
  const M = w.HoshinKanriMath;
  for (const lang of ['de', 'sq']) {
    const other = readData(lang);
    assert.deepEqual(shape(other), shape(en), lang);
    assert.equal(other.storageKey, `sc-hoshin-kanri-${lang}`);
    assert.equal(other.portfolioKey, readData(lang, 'projectPortfolio').storageKey, `${lang}: the portfolio of the same language`);
    assert.equal(other.tips.length, en.tips.length);
    const p = other.example.plan, e = en.example.plan;
    for (const list of M.LISTS) {
      assert.deepEqual(p[list].map((x) => x.id), e[list].map((x) => x.id), `${lang} ${list}`);
      assert.deepEqual(shape(p[list]), shape(e[list]));
    }
    assert.deepEqual(p.metrics.map((m) => [m.unit, m.better, m.baseline, m.target, m.targets, m.actuals]), e.metrics.map((m) => [m.unit, m.better, m.baseline, m.target, m.targets, m.actuals]), `${lang}: the same numbers`);
    assert.deepEqual(p.annual.map((a) => a.savingsTarget), e.annual.map((a) => a.savingsTarget));
    assert.deepEqual(p.priorities.map((x) => x.project), e.priorities.map((x) => x.project));
    assert.deepEqual(p.owners.map((x) => x.text), e.owners.map((x) => x.text), 'names stay names');
    assert.deepEqual(p.links, e.links);
    assert.deepEqual(p.catchball.map((n) => [n.priority, n.date, n.kind]), e.catchball.map((n) => [n.priority, n.date, n.kind]));
    assert.deepEqual(Object.keys(p.review), Object.keys(e.review));
    assert.deepEqual(other.example.projects.map((x) => [x.id, x.phase, x.status, x.savings]), en.example.projects.map((x) => [x.id, x.phase, x.status, x.savings]));
    // The portfolio's words come from the portfolio's own data file.
    const pp = readData(lang, 'projectPortfolio');
    assert.deepEqual(other.portfolio.statuses, pp.statuses, `${lang}: status names as in the portfolio`);
    assert.deepEqual(Object.fromEntries(Object.entries(pp.phases).map(([k, v]) => [k, v.name])), other.portfolio.phases);
  }
  assert.deepEqual(Object.keys(en.portfolio.phases), plain(M.PHASES));
  assert.deepEqual(Object.keys(en.portfolio.statuses), plain(M.STATUSES));
  assert.deepEqual(Object.keys(en.catchball), plain(M.KINDS));
  // The translations of the page and the card exist in both languages.
  const part = readJson('src/_data/i18n-parts/hoshin-kanri.json');
  assert.deepEqual(Object.keys(part.de).sort(), Object.keys(part.sq).sort());
  const cards = readJson('src/_data/i18n-parts/hoshin-kanri.cards.json');
  assert.equal(cards.family, 'lumen');
  assert.deepEqual(Object.keys(cards.cards), ['en', 'de', 'sq']);
  assert.equal(cards.cards.de.url, '/de/tools/hoshin-kanri/');
  // The example in every language has the same gaps and flags.
  for (const lang of ['en', 'de', 'sq']) {
    const ex = M.fromExample(readData(lang).example, DAY);
    assert.deepEqual(plain(M.gaps(ex).map((g) => g.code)), ['P6'], lang);
    assert.deepEqual(plain(M.reviewFlags(ex, 8).map((m) => m.id)), ['m3', 'm6'], lang);
    assert.equal(ex.catchball.length, 7);
    assert.equal(ex.catchball[0].date, '2026-07-05', `${lang}: dates counted back from today`);
    assert.equal(ex.review.m3.due, '2026-11-06');
  }
});

test('the page opens on the example and hands over to the Action Tracker, the A3 and 5 Whys; the portfolio is never written', () => {
  for (const lang of ['en', 'de', 'sq']) {
    const portfolioKey = lang === 'en' ? 'sc-project-portfolio' : `sc-project-portfolio-${lang}`;
    const key = lang === 'en' ? 'sc-hoshin-kanri' : `sc-hoshin-kanri-${lang}`;
    const w = load(lang, { page: true });
    const doc = w.document;
    const results = doc.querySelector('[data-results]');
    assert.equal(results.hidden, false, lang);
    assert.equal(doc.querySelector('.dl-example-note').hidden, false, `${lang}: the example note shows`);
    const svg = results.querySelector('svg.hx-xm');
    assert.ok(svg, `${lang}: the X-matrix as on paper`);
    assert.equal(svg.querySelectorAll('circle').length, 5 + 9 + 10 + 11, 'one mark per correlation in the four corners');
    assert.equal(results.querySelectorAll('.hx-xm-list .hx-xm-items > li').length, 3 + 4 + 6 + 6 + 7, 'the list view holds every item');
    assert.equal(results.querySelectorAll('.hx-gap-list li').length, 1);
    assert.equal(results.querySelectorAll('.hx-bowl tbody tr').length, 12, 'a target and an actual row per metric');
    assert.equal(results.querySelectorAll('.hx-bowl-cell.is-missed').length, 19);
    assert.equal(results.querySelectorAll('.hx-bowl-cell.is-met').length, 35);
    assert.ok([...results.querySelectorAll('.hx-bowl-cell.is-missed')].every((td) => /missed/.test(td.textContent)), 'never colour alone');
    assert.ok(results.querySelectorAll('svg.ck-chart').length >= 7, `${lang}: the matrix and a trend per metric`);
    assert.equal(results.querySelectorAll('.hx-flag').length, 2, 'two metrics missed twice');
    // The links keep the language.
    const prefix = lang === 'en' ? '' : `/${lang}`;
    const links = [...results.querySelectorAll('.hx-flag a')].map((a) => a.href);
    assert.ok(links.some((href) => href.startsWith(`https://example.test${prefix}/tools/a3-report/?problem=`)), `${lang}: A3`);
    assert.ok(links.some((href) => href.startsWith(`https://example.test${prefix}/tools/five-whys/?problem=`)), `${lang}: 5 Whys`);
    // The countermeasure of the cost metric goes to the Action Tracker once.
    const add = results.querySelector('.hx-flag .button-primary');
    add.click();
    add.click();
    const actions = JSON.parse(w.localStorage.getItem('sc-actions')).rows;
    assert.equal(actions.length, 1, `${lang}: added once`);
    assert.equal(actions[0].source, 'hoshin-kanri');
    assert.equal(actions[0].owner, 'Mira Hoxha');
    assert.equal(actions[0].due, '2026-11-06');
    assert.equal(actions[0].priority, 'High');
    assert.equal(actions[0].title, readData(lang).example.plan.review.m3.countermeasure);
    assert.match(results.querySelector('.hx-review-status a').href, new RegExp(`${prefix}/tools/action-tracker/$`));
    // Turnover has no countermeasure yet: its action is named after the miss, its owner is the primary owner of P5.
    results.querySelectorAll('.hx-flag .button-primary')[1].click();
    const second = JSON.parse(w.localStorage.getItem('sc-actions')).rows[1];
    assert.equal(second.owner, 'Petra Lang');
    assert.match(second.detail, /16[.,]0|15[.,]9|15[.,]6/);
    assert.equal(w.localStorage.getItem(portfolioKey), null, `${lang}: the portfolio key is never written`);
    assert.equal(w.localStorage.getItem(key), null, 'looking at the example saves nothing');
    // Give the cartons a primary owner: R3 goes from secondary to none to primary. The gap closes, the example ends.
    const cell = doc.querySelector('[data-focus-key="cell:po:p6:r3"]');
    cell.click();
    doc.querySelector('[data-focus-key="cell:po:p6:r3"]').click();
    const saved = JSON.parse(w.localStorage.getItem(key));
    assert.equal(saved.links.po['p6|r3'], 'primary');
    assert.equal(saved.example, false, 'own work ends the example');
    assert.equal(doc.querySelector('.dl-example-note').hidden, true);
    assert.equal(results.querySelectorAll('.hx-gap-list li').length, 0);
    assert.equal(w.HoshinKanriMath.gaps(w.HoshinKanriMath.state()).length, 0);
    // The CSV: a header and one row per metric and month.
    const rows = w.HoshinKanriMath.sheetRows();
    assert.equal(rows.length, 1 + 6 * 12);
    assert.deepEqual(plain(rows[1].slice(0, 1).concat(rows[1].slice(6))), ['M1', '2026-01', 96.9, 97, 'met']);
    assert.equal(rows[12][8], '', 'December has no actual yet');
    const summary = w.HoshinKanriMath.summaryText();
    assert.match(summary, /P6/);
    assert.match(summary, /M3/);
    assert.equal(w.localStorage.getItem(portfolioKey), null);
  }
});

test('a priority links to a project of the portfolio in this browser, read only', () => {
  const pw = load('en', { portfolio: true });
  const pcfg = readData('en', 'projectPortfolio');
  const counts = Object.fromEntries(Object.entries(pcfg.tollgates).map(([k, v]) => [k, v.length]));
  const projects = plain(pw.PortfolioMath.fromExample(pcfg.example, DAY, counts));
  const portfolio = { projects, current: projects[0].id, example: false };
  const w = load('en', { page: true, storage: { 'sc-project-portfolio': portfolio } });
  const doc = w.document;
  assert.match(doc.querySelector('[data-portfolio-note]').textContent, /^4 projects/);
  const select = doc.querySelector('#hx-project-2');
  assert.equal(select.value, '', 'P3 starts standalone');
  assert.ok([...select.options].some((o) => o.value === projects[1].id));
  select.value = projects[1].id;
  select.dispatchEvent(new w.Event('change', { bubbles: true }));
  const info = doc.querySelectorAll('.hx-project-info')[2].textContent;
  assert.match(info, /Analyze/);
  assert.match(info, /At risk|Late|On track/);
  const saved = JSON.parse(w.localStorage.getItem('sc-hoshin-kanri'));
  assert.equal(saved.priorities[2].project, projects[1].id);
  assert.equal(saved.priorities[2].projectTitle, projects[1].title);
  assert.deepEqual(JSON.parse(w.localStorage.getItem('sc-project-portfolio')), portfolio, 'the portfolio is untouched');
  const table = [...doc.querySelectorAll('.hx-projects tbody tr')].map((tr) => tr.children[1].textContent);
  assert.equal(table[2], projects[1].title);
  // A project that has left the portfolio is named, not lost.
  w.localStorage.setItem('sc-project-portfolio', JSON.stringify({ projects: [] }));
  w.dispatchEvent(new w.StorageEvent('storage', { key: 'sc-project-portfolio' }));
  assert.match(doc.querySelectorAll('.hx-project-info')[2].textContent, /not in the portfolio/);
});

test('the matrix travels as a template file and opens cleaned', async () => {
  const w = load('en', { page: true });
  const doc = w.document;
  let packed = null;
  w.TemplatePack.download = (file) => { packed = file; };
  doc.querySelector('[data-pack-save]').click();
  assert.ok(packed, 'a file was made');
  assert.equal(packed.file.tool, 'hoshin-kanri');
  assert.equal(packed.file.kind, 'x-matrix');
  assert.equal(packed.file.data.example, false);
  assert.equal(packed.file.data.metrics.length, 6);
  // Open it again, with one damaged link added: it is dropped on the way in.
  const data = plain(packed.file.data);
  data.links.pa['p1|nobody'] = 'strong';
  data.title = 'Site Süd';
  const text = JSON.stringify({ ...packed.file, data });
  const input = doc.querySelector('[data-pack-open]');
  Object.defineProperty(input, 'files', { value: [new w.File([text], 'matrix.json', { type: 'application/json' })] });
  input.dispatchEvent(new w.Event('change'));
  await new Promise((resolve) => setTimeout(resolve, 50));
  const state = w.HoshinKanriMath.state();
  assert.equal(state.title, 'Site Süd');
  assert.equal(state.links.pa['p1|nobody'], undefined);
  assert.equal(state.example, false);
  assert.match(doc.querySelector('[data-pack-status]').textContent, /Opened/);
  assert.equal(JSON.parse(w.localStorage.getItem('sc-hoshin-kanri')).title, 'Site Süd');
});
