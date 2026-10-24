// The Gemba Walk (src/js/gemba-walk.js): the arithmetic in window.GembaMath (compliance, the schedule, the weeks, the
// vital few), the three data files, and the page itself: the example on a first visit, an LPA answered and saved,
// findings handed to the Action Tracker, a waste walk counted, the log's undo and the hand-off to Pareto.
process.env.TZ = 'Europe/Berlin';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const nunjucks = require('nunjucks');
const { JSDOM } = require('jsdom');

const plain = (value) => JSON.parse(JSON.stringify(value));
const read = (file) => JSON.parse(fs.readFileSync(file, 'utf8'));
const DATA = { en: 'src/_data/gembaWalk.json', de: 'src/_data/de/gembaWalk.json', sq: 'src/_data/sq/gembaWalk.json' };

// The partial rendered the way the site does it, with the filters stubbed (English text, no asset hashes).
const env = new nunjucks.Environment(new nunjucks.FileSystemLoader('src/_includes'), { autoescape: false });
env.addFilter('t', (text) => text);
env.addFilter('local', (url, lang) => (lang && lang !== 'en' ? `/${lang}${url}` : url));
env.addFilter('assetUrl', (url) => url);
env.addFilter('scriptJson', (value) => JSON.stringify(value).replace(/</g, '\\u003c'));
const partial = (lang) => env.render('partials/gemba-walk.njk', { cfg: read(DATA[lang]), lang: lang === 'en' ? undefined : lang })
  .replace(/<script src=[^>]*><\/script>/g, '');

const load = ({ lang = 'sq', page = true, now = '2026-10-23T10:00:00Z', storage = {} } = {}) => {
  const base = lang === 'en' ? '' : `/${lang}`;
  const html = `<html lang="${lang}"><body><main id="main">${page ? partial(lang) : ''}</main></body></html>`;
  const dom = new JSDOM(html, { url: `https://example.test${base}/tools/gemba-walk/`, runScripts: 'outside-only', pretendToBeVisual: true });
  const w = dom.window;
  w.eval(`(() => { const Real = Date; const fixed = new Real(${JSON.stringify(now)}); Date = class extends Real { constructor(...args) { super(...(args.length ? args : [fixed])); } static now() { return fixed.getTime(); } }; })();`);
  w.confirm = () => true;
  w.print = () => {};
  w.HTMLElement.prototype.scrollIntoView = () => {};
  Object.entries(storage).forEach(([key, value]) => w.localStorage.setItem(key, JSON.stringify(value)));
  for (const file of ['tool-kit', 'chart-kit', 'workplace', 'actions-store', 'gemba-walk']) w.eval(fs.readFileSync(`src/js/${file}.js`, 'utf8'));
  return w;
};
const saved = (w, key) => JSON.parse(w.localStorage.getItem(key));
const click = (w, node) => node.dispatchEvent(new w.MouseEvent('click', { bubbles: true }));
const choose = (w, input) => { input.checked = true; input.dispatchEvent(new w.Event('change', { bubbles: true })); };

// The shape of a value: object keys and array lengths, not the words (they are translated).
const shape = (value) => (Array.isArray(value) ? value.map(shape) : value && typeof value === 'object'
  ? Object.fromEntries(Object.keys(value).sort().map((key) => [key, shape(value[key])])) : typeof value);

test('the three data files share one shape, the example and their own storage key', () => {
  const en = read(DATA.en);
  assert.equal(en.storageKey, 'sc-gemba-walk');
  for (const lang of ['de', 'sq']) {
    const other = read(DATA[lang]);
    assert.equal(other.storageKey, `sc-gemba-walk-${lang}`, `${lang} keeps its own work`);
    assert.deepEqual(shape(other), shape({ ...en, storageKey: other.storageKey }), `${lang} shape`);
    for (const list of ['types', 'layers', 'cadences', 'answers', 'wastes']) assert.deepEqual(other[list].map((x) => x.key), en[list].map((x) => x.key), `${lang} ${list} keys`);
    assert.deepEqual(other.layers.map((l) => l.cadence), en.layers.map((l) => l.cadence));
    assert.deepEqual(Object.keys(other.topics), Object.keys(en.topics));
    other.example.walks.forEach((walk, i) => {
      const a = en.example.walks[i];
      for (const field of ['day', 'type', 'layer', 'walker', 'minutes', 'answers', 'acts', 'tallies']) assert.deepEqual(walk[field], a[field], `${lang} walk ${i} ${field}`);
      assert.equal(other.templates.warehouse.areas.indexOf(walk.area), en.templates.warehouse.areas.indexOf(a.area), `${lang} walk ${i} area`);
      assert.equal(other.shifts.indexOf(walk.shift), en.shifts.indexOf(a.shift), `${lang} walk ${i} shift`);
    });
  }
});

test('every checklist asks 6 to 8 questions per layer, each with a standard and a topic that has first moves', () => {
  for (const lang of Object.keys(DATA)) {
    const cfg = read(DATA[lang]);
    assert.deepEqual(Object.keys(cfg.templates), ['warehouse', 'hotel', 'delivery-station']);
    assert.deepEqual(cfg.layers.map((l) => l.key), ['team-lead', 'area-manager', 'site-lead']);
    assert.deepEqual(cfg.layers.map((l) => l.cadence), ['daily', 'weekly', 'monthly']);
    assert.equal(cfg.wastes.length, 10, 'the eight wastes, Mura and Muri');
    cfg.wastes.forEach((w) => assert.ok(w.name && w.definition && w.example, `${lang} ${w.key}`));
    for (const [name, tpl] of Object.entries(cfg.templates)) {
      assert.ok(tpl.areas.length >= 3, `${lang} ${name} areas`);
      for (const layer of cfg.layers) {
        const list = tpl.questions[layer.key];
        assert.ok(list.length >= 6 && list.length <= 8, `${lang} ${name} ${layer.key}: ${list.length}`);
        list.forEach((q) => {
          assert.ok(q.text && q.standard, `${lang} ${name} ${layer.key}`);
          assert.equal(cfg.topics[q.topic]?.moves.length, 3, `${lang} topic ${q.topic}`);
        });
      }
    }
    const ex = cfg.example;
    ex.walks.forEach((walk) => {
      assert.ok(cfg.templates[ex.template].areas.includes(walk.area), `${lang}: ${walk.area}`);
      if (walk.type === 'lpa') {
        assert.equal(walk.answers.length, cfg.templates[ex.template].questions[walk.layer].length);
        assert.match(walk.answers, /^[yna]+$/);
        Object.keys(walk.findings).forEach((i) => assert.equal(walk.answers[i], 'n', `${lang}: a finding sits on a no`));
        walk.acts.forEach((i) => assert.equal(walk.answers[i], 'n'));
      } else {
        assert.deepEqual(Object.keys(walk.tallies), cfg.wastes.map((w) => w.key));
      }
    });
    assert.equal(ex.walks.filter((w) => w.type === 'waste').length, 2, 'two waste walks');
    assert.equal(new Set(ex.walks.map((w) => w.layer)).size, 3, 'three layers');
    assert.ok(Math.min(...ex.walks.map((w) => w.day)) >= -28, 'four weeks');
  }
});

test('the arithmetic: compliance, next due, the schedule and the weeks', () => {
  const M = load({ page: false }).GembaMath;
  assert.deepEqual(plain(M.compliance(['yes', 'yes', 'no', 'na', null])), { yes: 2, no: 1, na: 1, answered: 4, total: 5, pct: 2 / 3 });
  assert.equal(M.compliance(['na', 'na']).pct, null, 'n.a. only: no compliance');
  assert.equal(M.compliance(undefined).total, 0);
  assert.equal(M.combined([{ type: 'lpa', answers: ['yes', 'no'] }, { type: 'lpa', answers: ['yes', 'yes', 'yes', 'yes'] }, { type: 'waste', answers: ['no'] }]).pct, 5 / 6, 'every answer weighs one; waste walks do not count');
  assert.equal(M.nextDue('2026-10-23', 'daily'), '2026-10-24');
  assert.equal(M.nextDue('2026-10-23', 'weekly'), '2026-10-30');
  assert.equal(M.nextDue('2026-10-23', 'monthly'), '2026-11-23');
  assert.equal(M.nextDue('2026-01-31', 'monthly'), '2026-02-28', 'the last day of a shorter month');
  assert.equal(M.nextDue('2026-03-28', 'daily'), '2026-03-29', 'no daylight saving slip');
  assert.equal(M.nextDue('', 'daily'), '');
  const rows = [
    { layer: 'team-lead', date: '2026-10-22', type: 'lpa' },
    { layer: 'team-lead', date: '2026-10-20', type: 'lpa' },
    { layer: 'area-manager', date: '2026-10-14', type: 'waste' },
    { layer: 'site-lead', date: '2026-10-30', type: 'lpa' },
  ];
  const s = plain(M.schedule(rows, ['team-lead', 'area-manager', 'site-lead'], { 'team-lead': 'daily', 'area-manager': 'weekly', 'site-lead': 'monthly' }, '2026-10-23'));
  assert.deepEqual(s.map((x) => [x.layer, x.last, x.due, x.status, x.late]), [
    ['team-lead', '2026-10-22', '2026-10-23', 'due', 0],
    ['area-manager', '2026-10-14', '2026-10-21', 'overdue', 2],
    ['site-lead', '', '', 'never', 0],
  ], 'a walk in the future does not count; a waste walk does');
  assert.equal(M.schedule([{ layer: 'x', date: '2026-10-20' }], ['x'], {}, '2026-10-23')[0].cadence, 'weekly', 'an unknown cadence is weekly');
  assert.equal(M.mondayOf('2026-10-25'), '2026-10-19');
  const wk = plain(M.weekly([
    { type: 'lpa', layer: 'a', date: '2026-10-05', answers: ['yes', 'no'] },
    { type: 'lpa', layer: 'a', date: '2026-10-07', answers: ['yes', 'yes'] },
    { type: 'lpa', layer: 'b', date: '2026-10-13', answers: ['no'] },
  ], ['a', 'b']));
  assert.deepEqual(wk.weeks, ['2026-10-05', '2026-10-12']);
  assert.deepEqual(wk.series, { a: [0.75, null], b: [null, 0] });
});

test('the wastes, the vital few, the most failed questions and the open findings', () => {
  const M = load({ page: false }).GembaMath;
  const keys = ['a', 'b', 'c', 'd'];
  const rows = [
    { type: 'waste', area: 'Dock', tallies: { a: 5, b: 1, c: 0, d: 2 } },
    { type: 'waste', area: 'Pack', tallies: { a: 3, b: 1, c: 0, d: 8 } },
    { type: 'lpa', area: 'Dock', tallies: { a: 99 } },
  ];
  assert.deepEqual(plain(M.wasteTotals(rows, keys)), { a: 8, b: 2, c: 0, d: 10 });
  assert.deepEqual(plain(M.areaWaste(rows, keys)), { Dock: { a: 5, b: 1, c: 0, d: 2 }, Pack: { a: 3, b: 1, c: 0, d: 8 } });
  assert.deepEqual(plain(M.vitalFew([{ key: 'a', value: 8 }, { key: 'b', value: 2 }, { key: 'c', value: 0 }, { key: 'd', value: 10 }])), ['d', 'a'], '18 of 20 is past 80 %');
  assert.deepEqual(plain(M.vitalFew([{ key: 'a', value: 1 }, { key: 'b', value: 1 }, { key: 'c', value: 1 }, { key: 'd', value: 1 }, { key: 'e', value: 1 }])), ['a', 'b', 'c', 'd']);
  assert.deepEqual(plain(M.vitalFew([])), []);
  const lpa = [
    { type: 'lpa', template: 't', layer: 'l', area: 'Dock', answers: ['no', 'yes', 'no'], acts: { 0: true, 2: true }, sent: { 2: true } },
    { type: 'lpa', template: 't', layer: 'l', area: 'Pack', answers: ['no', 'na', 'yes'], acts: { 1: true } },
  ];
  const fails = plain(M.failCounts(lpa));
  assert.deepEqual(fails.map((f) => [f.key, f.no, f.asked]), [['t|l|0', 2, 2], ['t|l|2', 1, 2], ['t|l|1', 0, 1]]);
  assert.deepEqual(fails[0].areas, { Dock: 1, Pack: 1 });
  const open = M.openFindings(lpa);
  assert.deepEqual(open.map((o) => o.index), [0], 'ticked, a no, and not handed over yet');
  assert.equal(M.clock(65000), '01:05');
  assert.equal(M.clock(3725000), '1:02:05');
  assert.equal(M.elapsed({ started: 1000, elapsed: 500 }, 3000), 2500);
});

test('a first visit opens on the example: four weeks, three layers, two waste walks and a rich result', () => {
  const w = load();
  const doc = w.document;
  const results = doc.querySelector('[data-results]');
  assert.ok(!results.hidden);
  assert.ok(!doc.querySelector('.dl-example-note').hidden, 'the example says so');
  const cfg = read(DATA.sq);
  assert.equal(doc.querySelectorAll('[data-log] tr').length, cfg.example.walks.length);
  assert.equal(saved(w, 'sc-gemba-walk-sq'), null, 'nothing is written until the visitor acts');
  assert.equal(doc.querySelectorAll('[data-questions] .gw-q').length, 6);
  assert.equal(doc.querySelectorAll('[data-wastes] .gw-waste').length, 10);
  assert.ok(results.querySelector('.dl-focus'), 'a Start here card');
  assert.equal(results.querySelectorAll('svg.ck-chart').length, 4, 'line, bars and two heat maps');
  assert.equal(results.querySelectorAll('.gw-schedule tbody tr').length, 3);
  // The newest walk is yesterday (the example is dated back from today); the manager's last walk was eight days ago.
  assert.equal(doc.querySelector('[data-log] td').textContent, '22.10.2026');
  const chips = [...results.querySelectorAll('.gw-schedule .ck-chip')].map((c) => c.className);
  assert.deepEqual(chips, ['ck-chip is-warn', 'ck-chip is-danger', 'ck-chip is-ok'], 'the team lead is due today, the manager is late');
  // The most failed question is the team lead's walkway check.
  const top = cfg.templates.warehouse.questions['team-lead'][1].text;
  assert.equal(results.querySelector('.dl-focus h3').firstChild.textContent, top);
  const whys = [...results.querySelectorAll('a')].find((a) => a.href.includes('five-whys'));
  assert.equal(new w.URL(whys.href).pathname, '/sq/tools/five-whys/');
  assert.match(new w.URL(whys.href).searchParams.get('problem'), new RegExp(top.slice(0, 20)));
  const links = [...results.querySelectorAll('a')].map((a) => new w.URL(a.href).pathname);
  assert.ok(links.includes('/sq/tools/five-s-audit/') && links.includes('/sq/tools/standard-work/'));
});

test('the compliance of the example: the team lead between 85 and 95 %, the manager between 70 and 80 %', () => {
  const w = load({ lang: 'en' });
  const M = w.GembaMath;
  const cfg = read(DATA.en);
  const rows = cfg.example.walks.filter((x) => x.type === 'lpa').map((x) => ({ type: 'lpa', layer: x.layer, answers: [...x.answers].map((c) => ({ y: 'yes', n: 'no', a: 'na' })[c]) }));
  const tl = M.combined(rows.filter((r) => r.layer === 'team-lead')).pct;
  const am = M.combined(rows.filter((r) => r.layer === 'area-manager')).pct;
  assert.ok(tl >= 0.85 && tl <= 0.95, `team lead ${tl}`);
  assert.ok(am >= 0.7 && am <= 0.8, `area manager ${am}`);
});

test('an LPA is answered, its findings go to the Action Tracker, and saving it replaces the example', () => {
  const w = load({ lang: 'de' });
  const doc = w.document;
  const area = doc.querySelector('#gw-area');
  area.value = 'Packen';
  area.dispatchEvent(new w.Event('input', { bubbles: true }));
  choose(w, doc.querySelector('input[name="gw-q-0"][value="yes"]'));
  choose(w, doc.querySelector('input[name="gw-q-1"][value="no"]'));
  choose(w, doc.querySelector('input[name="gw-q-2"][value="na"]'));
  choose(w, doc.querySelector('input[name="gw-q-3"][value="no"]'));
  const row = doc.querySelector('input[name="gw-q-1"]').closest('.gw-q');
  assert.ok(row.classList.contains('is-no'));
  assert.ok(row.querySelector('[data-act]').checked, 'a no suggests an action');
  const note = doc.querySelector('[data-finding="1"]');
  note.value = 'Cage 7 in the walkway';
  note.dispatchEvent(new w.Event('input', { bubbles: true }));
  assert.match(doc.querySelector('[data-progress]').textContent, /4 of 6 .* 33/);
  // One finding is handed over now; the other stays ticked and is saved with the walk.
  const box = doc.querySelector('[data-act="3"]');
  box.checked = false;
  box.dispatchEvent(new w.Event('change', { bubbles: true }));
  const add = doc.querySelector('[data-add-actions]');
  assert.match(add.textContent, /1 findings/);
  click(w, add);
  const actions = w.ActionsStore.list();
  assert.equal(actions.length, 1);
  assert.equal(actions[0].source, 'gemba-walk');
  assert.equal(actions[0].area, 'Packen');
  assert.equal(actions[0].due, '2026-10-30');
  assert.ok(actions[0].detail.startsWith('Cage 7 in the walkway'));
  assert.equal(add.disabled, true, 'each finding is handed over once');
  assert.equal(new w.URL(doc.querySelector('[data-walk-status] a').href).pathname, '/de/tools/action-tracker/', 'the hand-off keeps the language');
  box.checked = true;
  box.dispatchEvent(new w.Event('change', { bubbles: true }));
  click(w, doc.querySelector('[data-save]'));
  const state = saved(w, 'sc-gemba-walk-de');
  assert.equal(state.rows.length, 1, 'the example left with the first own walk');
  assert.deepEqual(plain(state.rows[0].answers), ['yes', 'no', 'na', 'no', null, null]);
  assert.equal(state.rows[0].findings['1'], 'Cage 7 in the walkway');
  assert.deepEqual(plain(state.rows[0].acts), { 3: true });
  assert.ok(doc.querySelector('.dl-example-note').hidden);
  assert.equal(doc.querySelectorAll('[data-questions] input:checked[type="radio"]').length, 0, 'a fresh walk');
  // The ticked finding is open until it goes to the tracker from the results.
  const results = doc.querySelector('[data-results]');
  const send = [...results.querySelectorAll('button')].find((b) => /offene Befunde|open findings/.test(b.textContent));
  assert.ok(send);
  click(w, send);
  assert.equal(w.ActionsStore.list().length, 2);
  assert.equal(saved(w, 'sc-gemba-walk-de').rows[0].sent['3'], true);
  assert.ok(![...doc.querySelector('[data-results]').querySelectorAll('button')].some((b) => /open findings/.test(b.textContent)));
});

test('a waste walk is counted with the timer running and hands its wastes to Pareto', () => {
  const w = load({ lang: 'en', storage: { 'sc-gemba-walk': { rows: [] } } });
  const doc = w.document;
  click(w, doc.querySelector('[data-type-value="waste"]'));
  assert.equal(doc.querySelector('[data-waste]').hidden, false);
  assert.equal(doc.querySelector('[data-lpa]').hidden, true);
  const plus = (key, n) => { for (let i = 0; i < n; i += 1) click(w, doc.querySelector(`[data-key="${key}"][data-step="1"]`)); };
  plus('motion', 4);
  plus('waiting', 2);
  click(w, doc.querySelector('[data-key="waiting"][data-step="-1"]'));
  click(w, doc.querySelector('[data-key="defects"][data-step="-1"]'));
  assert.equal(doc.querySelector('[data-count="motion"]').textContent, '4');
  assert.equal(doc.querySelector('[data-count="defects"]').textContent, '0', 'never below zero');
  assert.ok(saved(w, 'sc-gemba-walk').draft.timer.started > 0, 'the first tally starts the timer');
  const area = doc.querySelector('#gw-area');
  area.value = 'Dock';
  area.dispatchEvent(new w.Event('input', { bubbles: true }));
  click(w, doc.querySelector('[data-save]'));
  const state = saved(w, 'sc-gemba-walk');
  assert.equal(state.rows.length, 1);
  assert.equal(state.rows[0].type, 'waste');
  assert.equal(state.rows[0].tallies.motion, 4);
  assert.equal(state.rows[0].tallies.waiting, 1);
  assert.equal(state.rows[0].minutes, 1, 'the timer fills the duration');
  const results = doc.querySelector('[data-results]');
  assert.equal(results.querySelectorAll('svg.ck-chart').length, 2, 'bars and the area heat map');
  const pareto = [...results.querySelectorAll('a')].find((a) => a.href.includes('/pareto/'));
  click(w, pareto);
  const handoff = JSON.parse(w.sessionStorage.getItem('sc-pareto-handoff'));
  assert.deepEqual(handoff.headers, ['Waste', 'Count']);
  assert.deepEqual(handoff.rows, [['Motion', '4'], ['Waiting', '1']]);
  assert.equal(handoff.measure, 'count');
  assert.equal(results.querySelector('.dl-focus h3').firstChild.textContent, 'Motion', 'no LPA yet: the largest waste leads');
});

test('the log removes a walk with undo, the cadence changes the schedule, and the CSV has one row per answer', () => {
  const w = load({ lang: 'en' });
  const doc = w.document;
  const n = doc.querySelectorAll('[data-log] tr').length;
  click(w, doc.querySelector('[data-log] [data-remove]'));
  assert.equal(doc.querySelectorAll('[data-log] tr').length, n - 1);
  click(w, doc.querySelector('[data-log-status] .dl-undo'));
  assert.equal(doc.querySelectorAll('[data-log] tr').length, n);
  assert.equal(saved(w, 'sc-gemba-walk').rows.length, n, 'put back where it was');
  const select = doc.querySelector('[data-cadence="area-manager"]');
  select.value = 'monthly';
  select.dispatchEvent(new w.Event('change', { bubbles: true }));
  const chips = [...doc.querySelectorAll('.gw-schedule .ck-chip')].map((c) => c.className);
  assert.deepEqual(chips, ['ck-chip is-warn', 'ck-chip is-ok', 'ck-chip is-ok'], 'monthly: the manager is on time again');
  assert.equal(saved(w, 'sc-gemba-walk').cadence['area-manager'], 'monthly');
  let csv = '';
  const RealBlob = w.Blob;
  w.Blob = class extends RealBlob { constructor(parts, options) { super(parts, options); csv = parts.join(''); } };
  w.URL.createObjectURL = () => 'blob:x';
  w.URL.revokeObjectURL = () => {};
  click(w, doc.querySelector('[data-csv]'));
  const lines = csv.replace(/^\ufeff/, '').trim().split(/\r?\n/);
  assert.match(lines[0], /^Date[,;]Type[,;]Layer/);
  const cfg = read(DATA.en);
  const expected = cfg.example.walks.reduce((sum, x) => sum + (x.type === 'lpa' ? x.answers.length : Object.keys(x.tallies).filter((k) => x.tallies[k] || x.notes[k]).length), 0);
  assert.equal(lines.length - 1, expected);
});

test('areas and shifts come from the workplace profile, and the owner of the area owns the action', () => {
  const w = load({ lang: 'en', storage: { 'sc-workplace': { areas: [{ name: 'Dock 1', owner: 'Besnik' }, 'Dock 2'], shifts: ['A', 'B'] }, 'sc-gemba-walk': { rows: [] } } });
  const doc = w.document;
  const select = doc.querySelector('#gw-area-select');
  assert.equal(select.closest('.field').hidden, false);
  assert.equal(doc.querySelector('#gw-area').closest('.field').hidden, true);
  assert.deepEqual([...select.options].map((o) => o.value), ['Dock 1', 'Dock 2']);
  assert.deepEqual([...doc.querySelector('#gw-shift').options].map((o) => o.value), ['A', 'B']);
  choose(w, doc.querySelector('input[name="gw-q-0"][value="no"]'));
  click(w, doc.querySelector('[data-add-actions]'));
  assert.equal(w.ActionsStore.list()[0].owner, 'Besnik');
  assert.ok(doc.querySelector('.dl-example-note').hidden, 'nothing saved but not a first visit: no example');
  assert.ok(doc.querySelector('[data-results]').hidden, 'no walk saved yet: no results');
});

test('the walk sheet prints the questions of the layer with what is filled in', () => {
  const w = load({ lang: 'en', storage: { 'sc-gemba-walk': { rows: [] } } });
  const doc = w.document;
  let printed = null;
  w.print = () => { printed = doc.documentElement.classList.contains('gw-sheet-print'); };
  choose(w, doc.querySelector('input[name="gw-q-2"][value="no"]'));
  click(w, doc.querySelector('[data-sheet-print]'));
  assert.equal(printed, true);
  const sheet = doc.querySelector('[data-sheet]');
  assert.equal(sheet.querySelectorAll('tbody tr').length, 6);
  assert.equal(sheet.querySelectorAll('tbody tr')[2].querySelectorAll('.gw-box')[1].textContent, '✕');
});
