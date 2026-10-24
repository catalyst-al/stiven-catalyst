// Project Portfolio (src/js/project-portfolio.js): DPMO and sigma, RTY, COPQ, the RACI check, the Kano evaluation
// table, tollgate readiness and closing, days in a phase, savings by month, the example portfolio, the hand-offs and
// the data files in the three languages.
process.env.TZ = 'Europe/Berlin';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const { JSDOM } = require('jsdom');

const plain = (value) => JSON.parse(JSON.stringify(value));
const readData = (lang = 'en') => JSON.parse(fs.readFileSync(`src/_data/${lang === 'en' ? '' : `${lang}/`}projectPortfolio.json`, 'utf8'));
const shape = (value) => (Array.isArray(value) ? 'list'
  : value && typeof value === 'object' ? Object.fromEntries(Object.keys(value).sort().map((key) => [key, shape(value[key])])) : typeof value);

// The partial with its Nunjucks stripped, enough for the script to find its elements. The loops over the data file
// (belts, phases, statuses, SIPOC, COPQ, tollgates) are unrolled here the way Nunjucks renders them.
const pageHtml = (lang) => {
  const cfg = readData(lang);
  let html = fs.readFileSync('src/_includes/partials/project-portfolio.njk', 'utf8').replace(/\{#[\s\S]*?#\}/g, '');
  const options = (obj, label = (v) => v) => Object.entries(obj).map(([key, value]) => `<option value="${key}">${label(value)}</option>`).join('');
  html = html
    .replace(/(<select id="pp-belt"[^>]*>)[\s\S]*?(<\/select>)/, `$1${options(cfg.belts)}$2`)
    .replace(/(<select id="pp-phase"[^>]*>)[\s\S]*?(<\/select>)/, `$1${options(cfg.phases, (p) => p.name)}$2`)
    .replace(/(<select id="pp-state"[^>]*>)[\s\S]*?(<\/select>)/, `$1${options(cfg.statuses)}$2`)
    .replace(/<div class="pp-sipoc">[\s\S]*?\{%- endfor %\}/, `<div class="pp-sipoc">${cfg.sipoc.map(([k, name]) => `<label for="pp-sipoc-${k}">${name}</label><textarea id="pp-sipoc-${k}" data-f="sipoc.${k}" data-kind="lines"></textarea>`).join('')}`)
    .replace(/<div class="dl-grid pp-copq">[\s\S]*?\{%- endfor %\}/, `<div class="dl-grid pp-copq">${cfg.copq.map(([k, name]) => `<label for="pp-copq-${k}">${name}</label><input id="pp-copq-${k}" type="number" data-f="copq.${k}" data-kind="number">`).join('')}`)
    .replace(/\{%- for key, items in cfg\.tollgates %\}([\s\S]*?)\{%- endfor %\}\s*<\/fieldset>/, (m, gate) => `${Object.entries(cfg.tollgates).map(([key, items]) => gate
      .replace(/\{\{ key \}\}/g, key)
      .replace(/\{%- for item in items %\}[\s\S]*?\{%- endfor %\}/, items.map((item, i) => `<li><label><input type="checkbox" data-gate-check="${key}" data-index="${i}"><span>${item}</span></label></li>`).join(''))).join('')}</fieldset>`)
    .replace(/\{%-?[\s\S]*?-?%\}/g, '')
    .replace(/\{\{ *"([^"]+)" *\| *t\(lang\)[^}]*\}\}/g, '$1').replace(/\{\{ *'([^']+)' *\| *t\(lang\)[^}]*\}\}/g, '$1')
    .replace(/\{\{ *'(\/tools\/[^']+)' *\| *local\(lang\) *\}\}/g, (m, path) => (lang === 'en' ? path : `/${lang}${path}`))
    .replace(/\{\{ *cfg *\| *scriptJson *\| *safe *\}\}/, JSON.stringify(cfg).replace(/</g, '\\u003c'))
    .replace(/\{\{[^}]*\}\}/g, '')
    .replace(/<script src=[^>]*><\/script>/g, '');
  return html;
};

const load = (lang = 'en', { page = false, now = '2026-10-23T10:00:00Z', storage = {} } = {}) => {
  const html = `<html lang="${lang}"><body><main>${page ? pageHtml(lang) : ''}</main></body></html>`;
  const dom = new JSDOM(html, { url: `https://example.test/${lang === 'en' ? '' : `${lang}/`}tools/project-portfolio/`, runScripts: 'outside-only', pretendToBeVisual: true });
  const w = dom.window;
  w.eval(`(() => { const Real = Date; const fixed = new Real(${JSON.stringify(now)}); Date = class extends Real { constructor(...args) { super(...(args.length ? args : [fixed])); } static now() { return fixed.getTime(); } }; })();`);
  w.confirm = () => true;
  w.print = () => {};
  w.TextEncoder = TextEncoder; // jsdom has none; the Word file needs it.
  w.HTMLElement.prototype.scrollIntoView = () => {};
  Object.entries(storage).forEach(([key, value]) => w.localStorage.setItem(key, JSON.stringify(value)));
  for (const file of ['tool-kit', 'chart-kit', 'workplace', 'actions-store', 'docx-kit', 'project-portfolio']) w.eval(fs.readFileSync(`src/js/${file}.js`, 'utf8'));
  return w;
};
const saved = (w, key = 'sc-project-portfolio') => JSON.parse(w.localStorage.getItem(key));
const counts = (cfg) => Object.fromEntries(Object.entries(cfg.tollgates).map(([k, v]) => [k, v.length]));

test('DPMO and sigma: the parcel-hub baseline of the DMAIC course', () => {
  const { PortfolioMath: M } = load();
  assert.ok(Math.abs(M.dpmo(104, 18400, 1) - 5652.17) < 0.01);
  assert.equal(M.sigma(M.dpmo(104, 18400, 1)).toFixed(2), '4.03', 'the course says sigma 4.03');
  assert.equal(M.dpmo(10, 1000, 5), 2000, 'five chances per unit');
  assert.equal(M.dpmo(0, 1000), 0);
  assert.equal(M.sigma(0), 6);
  assert.equal(M.dpmo(null, 1000), null, 'no defects typed is no DPMO');
  assert.equal(M.dpmo(5, 0), null);
  assert.equal(M.dpmo(-1, 100), null);
  assert.equal(M.dpmo(101, 100, 1), null, 'more defects than opportunities');
  assert.equal(M.dpmo('104', '18400', '1').toFixed(0), '5652', 'saved text still counts');
  assert.equal(M.sigma(null), null);
  assert.ok(M.sigma(M.dpmo(57, 18400)) > M.sigma(M.dpmo(104, 18400)), 'fewer defects, higher sigma');
});

test('RTY multiplies the first-pass yields; a step without a yield is left out', () => {
  const { PortfolioMath: M } = load();
  const r = M.rty([{ step: 'Pick', fpy: 99 }, { step: 'Pack', fpy: 95 }, { step: 'Load', fpy: 98 }, { step: 'Empty', fpy: null }, { step: 'Wrong', fpy: 140 }]);
  assert.ok(Math.abs(r.value - 0.99 * 0.95 * 0.98) < 1e-12);
  assert.equal(r.steps, 3);
  assert.equal(r.weakest.step, 'Pack');
  assert.ok(Math.abs(r.loss - (1 - r.value)) < 1e-12);
  assert.equal(M.rty([]), null);
  assert.equal(M.rty(undefined), null);
});

test('COPQ: failure, appraisal and prevention a month and a year, for one project and the portfolio', () => {
  const { PortfolioMath: M } = load();
  const c = M.copq({ internal: 1200, external: 4980, appraisal: 600, prevention: 300 });
  assert.equal(c.failure, 6180);
  assert.equal(c.month, 7080);
  assert.equal(c.year, 84960);
  assert.ok(Math.abs(c.failureShare - 6180 / 7080) < 1e-12);
  assert.equal(M.copq({}).failureShare, null);
  assert.equal(M.copq({ internal: -50, external: '' }).month, 0, 'a negative or blank cost is no cost');
  const t = M.copqTotals([{ copq: { internal: 100, external: 50 } }, { copq: { appraisal: 25, prevention: 25 } }]);
  assert.deepEqual(plain(t), { internal: 100, external: 50, appraisal: 25, prevention: 25, failure: 150, month: 200, year: 2400 });
});

test('RACI check: exactly one A per activity and at least one R; A/R counts as both', () => {
  const { PortfolioMath: M } = load();
  const check = M.raciCheck({ people: ['Sponsor', 'Lead', 'Team'], rows: [
    { activity: 'Approve', cells: ['A', 'R', 'I'] },
    { activity: 'Two owners', cells: ['A', 'A', 'R'] },
    { activity: 'Nobody accountable', cells: ['', 'R', 'C'] },
    { activity: 'Nobody does it', cells: ['A', 'C', 'I'] },
    { activity: 'One person both', cells: ['I', 'AR', ''] },
    { activity: '', cells: ['', '', ''] },
  ] });
  assert.equal(check.rows.length, 5, 'an empty row is not checked');
  assert.deepEqual(plain(check.rows.map((r) => r.problems)), [[], ['manyA'], ['noA'], ['noR'], []]);
  assert.equal(check.ok, false);
  assert.equal(check.problems, 3);
  assert.deepEqual(plain(check.load[1]), { person: 'Lead', a: 2, r: 3 });
  assert.equal(M.raciCheck({ people: ['A'], rows: [{ activity: 'x', cells: ['X'] }] }).rows[0].problems.length, 2, 'an unknown letter is no letter');
  assert.equal(M.raciCheck({}).ok, true);
});

test('Kano: the standard evaluation table, and a category set directly wins', () => {
  const { PortfolioMath: M } = load();
  // Answers: 0 like, 1 expect, 2 neutral, 3 live with, 4 dislike.
  assert.equal(M.kanoClass(0, 4), 'O', 'like it there, dislike it missing: one-dimensional');
  assert.equal(M.kanoClass(1, 4), 'M', 'expect it, dislike it missing: must-be');
  assert.equal(M.kanoClass(3, 4), 'M');
  assert.equal(M.kanoClass(0, 2), 'A', 'like it, neutral without: attractive');
  assert.equal(M.kanoClass(0, 1), 'A');
  assert.equal(M.kanoClass(0, 3), 'A');
  assert.equal(M.kanoClass(2, 2), 'I');
  assert.equal(M.kanoClass(1, 3), 'I');
  assert.equal(M.kanoClass(4, 0), 'R', 'dislike it there, like it missing: reverse');
  assert.equal(M.kanoClass(2, 0), 'R');
  assert.equal(M.kanoClass(4, 2), 'R');
  assert.equal(M.kanoClass(0, 0), 'Q', 'like it both ways: questionable');
  assert.equal(M.kanoClass(4, 4), 'Q');
  assert.equal(M.kanoClass(null, 2), null);
  assert.equal(M.kanoClass(5, 2), null);
  assert.equal(M.kanoClass('1', '4'), 'M', 'a value from a select is text');
  assert.equal(M.kanoOf({ functional: 2, dysfunctional: 2, set: 'A' }), 'A');
  assert.equal(M.kanoOf({ functional: 2, dysfunctional: 2, set: 'X' }), 'I');
  assert.deepEqual(plain(M.kanoCounts([{ functional: 1, dysfunctional: 4 }, { functional: 0, dysfunctional: 4 }, { set: 'M' }, {}])), { M: 2, O: 1, A: 0, I: 0, R: 0, Q: 0 });
});

test('a tollgate closes with a complete checklist or a written reason, and only with the sponsor\'s name and date', () => {
  const { PortfolioMath: M } = load();
  const gate = (over) => ({ checks: [true, true, true, true, true, true], sponsor: 'Jonas', date: '2026-10-01', reason: '', closed: false, ...over });
  assert.equal(M.readiness(gate(), 6).canClose, true);
  assert.deepEqual(plain(M.readiness(gate({ sponsor: '' }), 6).missing), ['sponsor']);
  assert.deepEqual(plain(M.readiness(gate({ date: '' }), 6).missing), ['date']);
  const partial = gate({ checks: [true, true, false, true] });
  assert.equal(M.readiness(partial, 6).done, 3);
  assert.deepEqual(plain(M.readiness(partial, 6).missing), ['checks']);
  assert.equal(M.readiness({ ...partial, reason: 'ok' }, 6).canClose, false, 'a reason of a word is not a reason');
  assert.equal(M.readiness({ ...partial, reason: 'Checked on the late shift only; early shift follows.' }, 6).canClose, true);
  assert.equal(M.readiness({}, 6).share, 0);

  const project = M.blankProject('2026-09-01', 'Test');
  assert.equal(M.nextGate(project), 'define');
  assert.equal(M.closeGate(project, 'measure', 6).why, 'order', 'Measure cannot close before Define');
  assert.equal(M.closeGate(project, 'define', 6).why, 'missing');
  project.gates.define = gate({ date: '2026-09-20' });
  const closed = M.closeGate(project, 'define', 6);
  assert.equal(closed.ok, true);
  assert.equal(closed.project.phase, 'measure');
  assert.equal(closed.project.phaseDates.measure, '2026-09-20', 'the next phase starts on the day of the sign-off');
  assert.equal(project.phase, 'define', 'the project given is not changed');
  assert.equal(M.nextGate(closed.project), 'measure');
  let p = closed.project;
  for (const phase of ['measure', 'analyze', 'improve', 'control']) {
    p.gates[phase] = gate({ date: '2026-10-10' });
    p = M.closeGate(p, phase, 6).project;
  }
  assert.equal(p.status, 'closed', 'closing Control closes the project');
  assert.equal(M.nextGate(p), null);
});

test('days in a phase, and savings planned and realised by month', () => {
  const { PortfolioMath: M } = load();
  assert.equal(M.daysInPhase({ phase: 'analyze', phaseDates: { analyze: '2026-09-01' }, start: '2026-06-01' }, '2026-10-23'), 52);
  assert.equal(M.daysInPhase({ phase: 'measure', phaseDates: {}, start: '2026-10-13' }, '2026-10-23'), 10, 'without a phase date the start counts');
  assert.equal(M.daysInPhase({ phase: 'define', phaseDates: {} }, '2026-10-23'), null);
  assert.equal(M.addMonths('2026-11', 3), '2027-02');
  assert.equal(M.addMonths('2026-01', -1), '2025-12');
  const project = { savings: { hard: 12000, from: '2026-10-15', realised: [{ month: '2026-10', amount: 400 }, { month: '2026-11', amount: 1100 }, { month: '2025-12', amount: 999 }] } };
  const planned = M.plannedMonths(project);
  assert.equal(planned.length, 12);
  assert.equal(planned[0].month, '2026-10');
  assert.equal(planned.at(-1).month, '2027-09');
  const months = M.savingsByMonth([project], 2026);
  assert.equal(months.length, 12);
  assert.deepEqual(plain(months.slice(9)), [{ month: '2026-10', planned: 1000, realised: 400 }, { month: '2026-11', planned: 1000, realised: 1100 }, { month: '2026-12', planned: 1000, realised: 0 }]);
  const year = M.savingsYear([project, { savings: { hard: null, from: '2026-01-01', realised: [] } }], 2026);
  assert.equal(year.planned, 3000);
  assert.equal(year.realised, 1500, 'a month of another year is not counted');
});

test('the example: four projects in four phases, dates moved to recent days, and the portfolio in numbers', () => {
  for (const lang of ['en', 'de', 'sq']) {
    const w = load(lang);
    const M = w.PortfolioMath;
    const cfg = readData(lang);
    const projects = M.fromExample(cfg.example, '2026-10-23', counts(cfg));
    assert.equal(projects.length, 4, lang);
    assert.deepEqual(plain(projects.map((p) => p.phase)), ['control', 'analyze', 'measure', 'define'], lang);
    const [hub, routes, hotel, picking] = projects;
    assert.equal(hub.start, '2026-05-26');
    assert.equal(hub.phaseDates.control, '2026-09-13');
    assert.equal(hub.gates.define.checks.length, 6);
    assert.equal(hub.gates.improve.checks.filter(Boolean).length, 5);
    assert.equal(hub.savings.realised[0].month, '2026-07');
    assert.equal(M.sigma(M.dpmo(hub.base.defects, hub.base.units)).toFixed(2), '4.03');
    assert.equal(hub.sipoc.p.length, 7, `${lang}: the SIPOC has seven steps`);
    assert.equal(M.raciCheck(hub.raci).ok, true, `${lang}: the hub RACI is clean`);
    assert.deepEqual(plain(hub.kano.map((row) => M.kanoOf(row))), ['M', 'O', 'A', 'A', 'I', 'R'], lang);
    assert.ok(hub.ctq.length >= 3 && hub.control.length >= 3);
    assert.equal(M.raciCheck(picking.raci).problems, 3, `${lang}: the picking RACI has three rows to fix`);
    assert.equal(M.daysInPhase(routes, '2026-10-23'), 52);
    assert.equal(hotel.status, 'on-track');
    const sum = M.summary(projects, '2026-10-23', { limit: cfg.limits.daysInPhase, counts: counts(cfg) });
    assert.equal(sum.open, 4);
    assert.deepEqual(plain(sum.byPhase), { define: 1, measure: 1, analyze: 1, improve: 0, control: 1 });
    assert.equal(sum.atRisk, 2);
    assert.equal(sum.long, 1, 'the late-route project is 52 days in Analyze');
    assert.equal(sum.overdue, 2, 'two tollgates are past their date');
    assert.equal(sum.savings.realised, 6870);
    assert.ok(Math.abs(sum.savings.planned - (26000 / 12) * 6 - 18000 / 12) < 1e-6, `${lang}: planned this year ${sum.savings.planned}`);
  }
});

test('the three data files share one shape and keep their own saved work', () => {
  const en = readData('en');
  assert.equal(en.storageKey, 'sc-project-portfolio');
  for (const lang of ['de', 'sq']) {
    const other = readData(lang);
    assert.deepEqual(shape(other), shape(en), lang);
    assert.equal(other.storageKey, `sc-project-portfolio-${lang}`);
    assert.deepEqual(Object.keys(other.tollgates), Object.keys(en.tollgates));
    for (const [phase, items] of Object.entries(en.tollgates)) {
      assert.equal(other.tollgates[phase].length, items.length, `${lang} ${phase}`);
      assert.ok(items.length >= 5 && items.length <= 7, `${phase} has 5 to 7 points`);
    }
    assert.equal(other.tips.length, en.tips.length);
    assert.equal(other.kano.answers.length, 5);
    assert.deepEqual(Object.keys(other.kano.categories), Object.keys(en.kano.categories));
    other.example.projects.forEach((p, i) => {
      const e = en.example.projects[i];
      assert.deepEqual(shape(p), shape(e), `${lang} project ${i}`);
      assert.deepEqual([p.start, p.end, p.phase, p.status, p.belt, p.base, p.after, p.copq, p.savings.hard], [e.start, e.end, e.phase, e.status, e.belt, e.base, e.after, e.copq, e.savings.hard], `${lang} project ${i} numbers`);
      assert.deepEqual(p.kano.map((k) => [k.functional, k.dysfunctional]), e.kano.map((k) => [k.functional, k.dysfunctional]));
      assert.deepEqual(p.raci.rows.map((r) => r.cells), e.raci.rows.map((r) => r.cells));
      assert.equal(p.sipoc.p.length, e.sipoc.p.length);
    });
  }
});

test('the page opens on the example, closes a tollgate, and hands over to the A3, 5 Whys and the Action Tracker', () => {
  for (const lang of ['en', 'de', 'sq']) {
    const w = load(lang, { page: true });
    const doc = w.document;
    const results = doc.querySelector('[data-results]');
    assert.equal(results.hidden, false, lang);
    assert.equal(doc.querySelectorAll('[data-tabs] button').length, 4);
    assert.equal(doc.querySelector('.dl-example-note').hidden, false, `${lang}: the example note shows`);
    assert.equal(doc.querySelectorAll('.pp-portfolio tbody tr').length, 4);
    assert.ok(results.querySelectorAll('svg.ck-chart').length >= 3, `${lang}: phase bars, savings and Kano`);
    assert.ok(results.querySelector('.pp-onepage'), 'the one page of the selected project');
    const prefix = lang === 'en' ? '' : `/${lang}`;
    const links = [...results.querySelectorAll('a')].map((a) => a.href);
    assert.ok(links.some((href) => href.startsWith(`https://example.test${prefix}/tools/a3-report/?problem=`)), `${lang}: A3`);
    assert.ok(links.some((href) => href.startsWith(`https://example.test${prefix}/tools/five-whys/?problem=`)), `${lang}: 5 Whys`);
    assert.ok(links.includes(`https://example.test${prefix}/tools/process-lab/`), `${lang}: Process Lab`);
    // The first project's control plan goes to the Action Tracker once.
    const toTracker = [...results.querySelectorAll('button')].find((b) => /Action Tracker|Maßnahmenliste|veprimeve/i.test(b.textContent));
    assert.ok(toTracker, `${lang}: control plan button`);
    toTracker.click();
    toTracker.click();
    const actions = JSON.parse(w.localStorage.getItem('sc-actions')).rows;
    assert.equal(actions.length, 3, `${lang}: three control plan lines, added once`);
    assert.ok(actions.every((a) => a.source === 'project-portfolio' && a.owner));
    // The Word file of the project is a zip.
    const bytes = w.PortfolioMath.wordFile();
    assert.equal(String.fromCharCode(bytes[0], bytes[1]), 'PK');
    // Open the picking project and close its Define tollgate: first refused, then with all points and a sign-off.
    doc.querySelectorAll('[data-tabs] button')[3].click();
    assert.equal(doc.querySelector('#pp-phase').value, 'define');
    const close = doc.querySelector('[data-close-gate="define"]');
    close.click();
    assert.equal(saved(w, lang === 'en' ? 'sc-project-portfolio' : `sc-project-portfolio-${lang}`).projects[3].phase, 'define', 'not closed yet');
    doc.querySelectorAll('[data-gate-check="define"]').forEach((box) => { box.checked = true; box.dispatchEvent(new w.Event('change', { bubbles: true })); });
    const sponsor = doc.querySelector('#pp-gate-define-sponsor');
    sponsor.value = 'Nora Albers';
    sponsor.dispatchEvent(new w.Event('input', { bubbles: true }));
    const date = doc.querySelector('#pp-gate-define-date');
    date.value = '2026-10-22';
    date.dispatchEvent(new w.Event('change', { bubbles: true }));
    close.click();
    const after = saved(w, lang === 'en' ? 'sc-project-portfolio' : `sc-project-portfolio-${lang}`);
    assert.equal(after.projects[3].phase, 'measure', `${lang}: the project moved to Measure`);
    assert.equal(after.projects[3].phaseDates.measure, '2026-10-22');
    assert.equal(after.example, false, 'own work ends the example');
    // The CSV of the portfolio: a header and one row per project.
    const rows = w.PortfolioMath.sheetRows();
    assert.equal(rows.length, 5);
    assert.equal(rows[0].length, rows[1].length);
    assert.match(w.PortfolioMath.summaryText(), /6[.,]870/);
  }
});

test('a saved portfolio is rebuilt field by field and a new project starts in Define', () => {
  const w = load('en', { page: true, storage: { 'sc-project-portfolio': { projects: [{ title: 'Mine', phase: 'nonsense', status: 'closed', base: { defects: '12', units: 'x' }, raci: { people: ['A', 'B'], rows: [{ activity: 'Do', cells: ['A', 'Z', 'R'] }] }, gates: { define: { checks: [true, 'yes'] } } }, 'junk'], current: 'none' } } });
  assert.equal(w.document.querySelector('.dl-example-note').hidden, true, 'saved work is not the example');
  w.document.querySelector('[data-new]').click();
  const s = saved(w);
  assert.equal(s.projects.length, 2);
  const p = s.projects[0];
  assert.equal(p.phase, 'define');
  assert.equal(p.status, 'closed');
  assert.equal(p.base.defects, 12);
  assert.equal(p.base.units, null);
  assert.deepEqual(p.raci.rows[0].cells, ['A', '']);
  assert.deepEqual(p.gates.define.checks, [true, false]);
  assert.equal(s.projects[1].phase, 'define', 'a new project starts in Define');
  assert.equal(s.projects[1].start, '2026-10-23');
  assert.equal(s.current, s.projects[1].id);
});
