// The Skills Matrix (src/js/skills-matrix.js): the arithmetic in window.SkillsMath (cover, single points of failure,
// versatility, the flexibility index, training needs and the suggested plan), the three data files, and the page:
// the example on a first visit, the grid by mouse and keyboard, the plan sent to the Action Tracker, snapshots and
// the anonymous view.
process.env.TZ = 'Europe/Berlin';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const nunjucks = require('nunjucks');
const { JSDOM } = require('jsdom');

const plain = (value) => JSON.parse(JSON.stringify(value));
const read = (file) => JSON.parse(fs.readFileSync(file, 'utf8'));
const DATA = { en: 'src/_data/skillsMatrix.json', de: 'src/_data/de/skillsMatrix.json', sq: 'src/_data/sq/skillsMatrix.json' };

// The partial rendered the way the site does it, with the filters stubbed (English text, no asset hashes).
const env = new nunjucks.Environment(new nunjucks.FileSystemLoader('src/_includes'), { autoescape: false });
env.addFilter('t', (text) => text);
env.addFilter('local', (url, lang) => (lang && lang !== 'en' ? `/${lang}${url}` : url));
env.addFilter('assetUrl', (url) => url);
env.addFilter('scriptJson', (value) => JSON.stringify(value).replace(/</g, '\\u003c'));
const partial = (lang) => env.render('partials/skills-matrix.njk', { cfg: read(DATA[lang]), lang: lang === 'en' ? undefined : lang })
  .replace(/<script src=[^>]*><\/script>/g, '');

const load = ({ lang = 'en', page = true, now = '2026-10-23T10:00:00Z', storage = {} } = {}) => {
  const base = lang === 'en' ? '' : `/${lang}`;
  const html = `<html lang="${lang}"><body><main id="main">${page ? partial(lang) : ''}</main></body></html>`;
  const dom = new JSDOM(html, { url: `https://example.test${base}/tools/skills-matrix/`, runScripts: 'outside-only', pretendToBeVisual: true });
  const w = dom.window;
  w.eval(`(() => { const Real = Date; const fixed = new Real(${JSON.stringify(now)}); Date = class extends Real { constructor(...args) { super(...(args.length ? args : [fixed])); } static now() { return fixed.getTime(); } }; })();`);
  w.confirm = () => true;
  w.print = () => {};
  w.HTMLElement.prototype.scrollIntoView = () => {};
  Object.entries(storage).forEach(([key, value]) => w.localStorage.setItem(key, JSON.stringify(value)));
  for (const file of ['tool-kit', 'chart-kit', 'workplace', 'actions-store', 'skills-matrix']) w.eval(fs.readFileSync(`src/js/${file}.js`, 'utf8'));
  return w;
};
const saved = (w, key) => JSON.parse(w.localStorage.getItem(key));
const click = (w, node) => node.dispatchEvent(new w.MouseEvent('click', { bubbles: true }));
const key = (w, node, k) => node.dispatchEvent(new w.KeyboardEvent('keydown', { key: k, bubbles: true }));

// The example of a data file as the model the arithmetic takes.
const exampleModel = (lang = 'en') => {
  const cfg = read(DATA[lang]);
  const tasks = cfg.templates[cfg.example.template].tasks.map((t, i) => ({ id: `t${i}`, ...t }));
  const people = cfg.example.people.map((p, i) => ({ id: `p${i}`, name: p.name, role: p.role, shift: p.shift }));
  const levels = Object.fromEntries(cfg.example.people.map((p, i) => [`p${i}`, Object.fromEntries(p.levels.map((v, j) => [`t${j}`, v]))]));
  return { cfg, model: { people, tasks, levels } };
};
const shape = (value) => (Array.isArray(value) ? value.map(shape) : value && typeof value === 'object'
  ? Object.fromEntries(Object.keys(value).sort().map((k) => [k, shape(value[k])])) : typeof value);

test('the three data files share one shape, the numbers of the example and their own storage key', () => {
  const en = read(DATA.en);
  assert.equal(en.storageKey, 'sc-skills-matrix');
  for (const lang of ['de', 'sq']) {
    const other = read(DATA[lang]);
    assert.equal(other.storageKey, `sc-skills-matrix-${lang}`, `${lang} keeps its own work`);
    assert.deepEqual(shape(other), shape(en), `${lang} shape`);
    assert.deepEqual(Object.keys(other.templates), Object.keys(en.templates), `${lang}: template keys are not translated`);
    for (const name of Object.keys(en.templates)) {
      assert.deepEqual(other.templates[name].tasks.map((t) => [t.crit, t.min, t.target]), en.templates[name].tasks.map((t) => [t.crit, t.min, t.target]), `${lang} ${name}`);
    }
    assert.equal(other.example.template, en.example.template);
    other.example.people.forEach((p, i) => {
      assert.deepEqual(p.levels, en.example.people[i].levels, `${lang} person ${i}`);
      assert.equal(other.shifts.indexOf(p.shift), en.shifts.indexOf(en.example.people[i].shift), `${lang} person ${i} shift`);
    });
    assert.deepEqual(other.example.snapshots, en.example.snapshots);
  }
});

test('templates, levels and the example fit each other', () => {
  for (const lang of Object.keys(DATA)) {
    const cfg = read(DATA[lang]);
    assert.deepEqual(Object.keys(cfg.templates), ['warehouse', 'hotel', 'delivery-station']);
    assert.equal(cfg.levels.length, 5, 'levels 0 to 4');
    assert.equal(cfg.criticality.length, 3);
    assert.deepEqual(Object.keys(cfg.advice).sort(), ['below', 'none', 'ok', 'short', 'spof']);
    Object.values(cfg.advice).forEach((a) => assert.equal(a.moves.length, 3));
    for (const tpl of Object.values(cfg.templates)) {
      tpl.tasks.forEach((t) => {
        assert.ok([1, 2, 3].includes(t.crit) && t.min >= 0 && t.min <= 4 && t.target >= 1, `${lang} ${t.name}`);
      });
    }
    assert.equal(cfg.templates.warehouse.tasks.length, 9);
    assert.equal(cfg.templates.hotel.tasks.length, 8);
    const ex = cfg.example;
    assert.equal(ex.people.length, 8, 'eight people');
    ex.people.forEach((p) => {
      assert.equal(p.levels.length, cfg.templates[ex.template].tasks.length);
      assert.ok(cfg.shifts.includes(p.shift), `${lang}: ${p.shift} is a shift`);
    });
    assert.equal(ex.snapshots.length, 2, 'two snapshots');
    ex.snapshots.forEach((s) => assert.equal(s.means.length, 9));
    for (const page of [`src/${lang === 'en' ? '' : `${lang}/`}tools/skills-matrix.njk`]) {
      const front = fs.readFileSync(page, 'utf8').match(/^description: "(.*)"$/m)[1];
      assert.ok(front.length <= 160, `${page}: description ${front.length} characters`);
    }
  }
});

test('the arithmetic: cover, single points of failure, versatility and the flexibility index of the example', () => {
  const M = load({ page: false }).SkillsMath;
  const { model } = exampleModel();
  const cov = plain(M.coverage(model));
  assert.deepEqual(cov.map((c) => c.count), [3, 4, 5, 4, 5, 1, 1, 5, 7]);
  assert.deepEqual(cov.map((c) => c.state), ['ok', 'ok', 'ok', 'ok', 'ok', 'spof', 'spof', 'ok', 'ok']);
  assert.equal(cov[5].gap, 1);
  assert.deepEqual(cov[5].trainers, ['p2'], 'Marco is the only level 4 on the forklift');
  assert.equal(cov[8].mean, 26 / 8);
  assert.deepEqual(plain(M.spof(model)), [{ taskId: 't5', personId: 'p2' }, { taskId: 't6', personId: 'p3' }]);
  assert.deepEqual(plain(M.noCover(model)), []);
  assert.equal(M.flexibilityIndex(model), 166 / 288);
  const vers = plain(M.versatility(model));
  assert.deepEqual(vers.map((v) => v.count), [7, 5, 6, 5, 3, 4, 5, 0], 'the new starter does nothing alone yet');
  assert.equal(vers[0].sum, 29);
  const shifts = plain(M.shiftCoverage(model, ['Early', 'Late', 'Night']));
  assert.deepEqual(shifts.map((s) => s.people), [3, 3, 2]);
  assert.deepEqual(shifts.map((s) => s.counts[5]), [1, 0, 0], 'forklift: nobody on Late and Night');
  const needs = plain(M.trainingNeeds(model));
  assert.deepEqual(needs.gaps.map((g) => [g.taskId, g.need]), [['t5', 1], ['t6', 1]], 'the critical gap first');
  assert.deepEqual(needs.below.map((b) => `${b.personId}:${b.taskId}:${b.level}/${b.min}`), ['p7:t2:1/2', 'p7:t7:1/2', 'p7:t8:2/3']);
});

test('the suggested plan pairs a level 4 with a trainee, the most critical gaps first, due in 30 days', () => {
  const M = load({ page: false }).SkillsMath;
  const { model } = exampleModel();
  const plan = plain(M.planSuggestions(model, { today: '2026-10-23' }));
  assert.deepEqual(plan.map((s) => [s.taskId, s.traineeId, s.trainerId, s.from, s.target, s.reason]), [
    ['t5', 'p4', 'p2', 2, 3, 'gap'], // forklift: Arben (level 2, Late has no cover) with Marco
    ['t2', 'p7', 'p0', 1, 2, 'min'],
    ['t7', 'p7', 'p1', 1, 2, 'min'], // the trainer who trains least so far
    ['t8', 'p7', 'p0', 2, 3, 'min'],
    ['t6', 'p1', 'p3', 2, 3, 'gap'], // returns, low criticality, last
  ]);
  assert.ok(plan.every((s) => s.due === '2026-11-22'));
  // No level 4 on a task: the trainer stays empty. Nobody at all: both a second and a first person are needed.
  const bare = { people: [{ id: 'a', shift: 'X' }, { id: 'b', shift: 'X' }, { id: 'c', shift: 'Y' }], tasks: [{ id: 'k', crit: 3, min: 0, target: 2 }], levels: { a: { k: 2 }, b: { k: 1 } } };
  assert.equal(M.coverage(bare)[0].state, 'none');
  const out = plain(M.planSuggestions(bare, { today: '2026-01-31' }));
  assert.deepEqual(out.map((s) => [s.traineeId, s.trainerId]), [['a', ''], ['b', '']]);
  assert.equal(out[0].due, '2026-03-02');
  // A single holder with a target of one is still a single point of failure and wants a second person.
  const one = { people: [{ id: 'a' }, { id: 'b' }], tasks: [{ id: 'k', crit: 1, min: 0, target: 1 }], levels: { a: { k: 4 }, b: { k: 0 } } };
  assert.equal(M.coverage(one)[0].state, 'spof');
  assert.deepEqual(plain(M.planSuggestions(one)).map((s) => [s.traineeId, s.trainerId]), [['b', 'a']]);
});

test('levels, the cycle, snapshots and an empty matrix', () => {
  const M = load({ page: false }).SkillsMath;
  assert.deepEqual([0, 1, 2, 3, 4].map(M.cycle), [1, 2, 3, 4, 0]);
  assert.equal(M.level({ a: { k: 9 } }, 'a', 'k'), 0, 'only 0 to 4 are levels');
  assert.equal(M.level({}, 'a', 'k'), 0, 'an empty cell is not trained');
  assert.equal(M.flexibilityIndex({ people: [], tasks: [], levels: {} }), 0);
  assert.deepEqual(plain(M.coverage({})), []);
  const { model } = exampleModel();
  const snap = plain(M.snapshot(model, '2026-10-23'));
  assert.equal(snap.flex, 166 / 288);
  assert.deepEqual([snap.spof, snap.nocover, snap.below], [2, 0, 3]);
  assert.equal(snap.means.t5, 9 / 8);
  assert.equal(M.addDays('2026-03-28', 2), '2026-03-30', 'no daylight saving slip');
});

test('a first visit opens on the example: grid, rich result, plan and snapshots, nothing written', () => {
  const w = load({ lang: 'sq' });
  const doc = w.document;
  const results = doc.querySelector('[data-results]');
  assert.equal(results.hidden, false);
  assert.ok(!doc.querySelector('.dl-example-note').hidden, 'the example says so');
  assert.equal(results.querySelectorAll('.sm-cell').length, 72, '8 people × 9 tasks');
  assert.equal(results.querySelectorAll('.sm-cell[tabindex="0"]').length, 1, 'one cell in the tab order');
  assert.equal(results.querySelectorAll('.sm-cell svg.sm-icon').length, 72);
  assert.ok(results.querySelector('.sm-cell .visually-hidden').textContent.includes('Besnik'), 'the level as text for screen readers');
  assert.equal(results.querySelectorAll('.sm-cell.is-below').length, 3);
  assert.equal(results.querySelectorAll('.sm-cov.is-spof').length, 2);
  assert.equal(results.querySelectorAll('tfoot .sm-shift').length, 3, 'cover per shift');
  assert.equal(results.querySelectorAll('.sm-icon .sm-dot').length >= 1, true, 'level 4 has its dot');
  assert.ok(results.querySelector('.dl-focus'), 'a Start here card');
  assert.equal(results.querySelectorAll('[data-summary] svg.ck-chart').length, 4, 'heat map, cover, radar, levels');
  assert.equal(results.querySelectorAll('[data-snap-chart] svg.ck-chart').length, 2, 'flexibility and SPOF over time');
  assert.ok(results.querySelector('.sm-panel-radar polygon[stroke-dasharray]'), 'the last snapshot is dashed');
  assert.equal(results.querySelectorAll('[data-plan] tr').length, 5);
  assert.equal(results.querySelectorAll('[data-snaps] tr').length, 2);
  assert.equal(results.querySelector('[data-snaps] td').textContent, '25.09.2026', 'newest snapshot 28 days ago, first');
  assert.equal(doc.querySelectorAll('[data-people] tr').length, 8);
  assert.equal(doc.querySelectorAll('[data-tasks] tr').length, 9);
  assert.equal(saved(w, 'sc-skills-matrix-sq'), null, 'nothing is written until the visitor acts');
});

test('the grid: a click cycles the level, digits set it, arrow keys move the focus', () => {
  const w = load();
  const doc = w.document;
  const cellAt = (r, c) => doc.querySelector(`.sm-cell[data-r="${r}"][data-c="${c}"]`);
  click(w, cellAt(7, 0));
  assert.equal(saved(w, 'sc-skills-matrix').levels['ex-p7']['ex-t0'], 2, 'Elira on receiving: 1 to 2');
  click(w, cellAt(0, 0));
  assert.equal(saved(w, 'sc-skills-matrix').levels['ex-p0']['ex-t0'], 0, 'after 4 comes 0');
  cellAt(0, 0).focus();
  key(w, cellAt(0, 0), 'ArrowRight');
  assert.equal(doc.activeElement, cellAt(0, 1));
  key(w, doc.activeElement, 'ArrowDown');
  assert.equal(doc.activeElement, cellAt(1, 1));
  assert.equal(cellAt(1, 1).tabIndex, 0);
  assert.equal(cellAt(0, 0).tabIndex, -1);
  key(w, cellAt(1, 1), 'End');
  assert.equal(doc.activeElement, cellAt(1, 8));
  // Forklift for Arben (row 4, column 5): a 4 makes it covered by two, the SPOF goes.
  cellAt(4, 5).focus();
  key(w, cellAt(4, 5), '4');
  assert.equal(saved(w, 'sc-skills-matrix').levels['ex-p4']['ex-t5'], 4);
  assert.equal(doc.activeElement, cellAt(4, 5), 'the focus stays on the cell after the redraw');
  assert.equal(doc.querySelectorAll('.sm-cov.is-spof').length, 1);
  assert.match(cellAt(4, 5).textContent, /Arben, Forklift: 4/);
  assert.ok(!doc.querySelector('.dl-example-note').hidden, 'playing with the example keeps it an example');
});

test('the plan goes to the Action Tracker once, owned by the trainer, in the page language', () => {
  const w = load({ lang: 'de' });
  const doc = w.document;
  click(w, doc.querySelector('[data-send]'));
  const actions = w.ActionsStore.list();
  assert.equal(actions.length, 5);
  assert.ok(actions.every((a) => a.source === 'skills-matrix' && a.due === '2026-11-22'));
  assert.deepEqual([actions[0].title, actions[0].owner, actions[0].priority, actions[0].area], ['Train Arben on Stapler', 'Marco', 'High', 'Team Warenausgang']);
  assert.match(actions[0].check, /Arben erledigt Stapler selbstständig auf Stufe 3, bestätigt von Marco/);
  assert.equal(actions.at(-1).priority, 'Low', 'returns is of low criticality');
  assert.equal(new w.URL(doc.querySelector('[data-plan-status] a').href).pathname, '/de/tools/action-tracker/');
  assert.ok(saved(w, 'sc-skills-matrix-de').plan.every((r) => r.sent));
  click(w, doc.querySelector('[data-send]'));
  assert.equal(w.ActionsStore.list().length, 5, 'each row is sent once');
  // A row removed with undo, a suggestion that adds nothing new, a row added by hand.
  click(w, doc.querySelector('[data-plan] [data-remove-row]'));
  assert.equal(doc.querySelectorAll('[data-plan] tr').length, 4);
  click(w, doc.querySelector('[data-plan-status] .dl-undo'));
  assert.equal(doc.querySelectorAll('[data-plan] tr').length, 5);
  click(w, doc.querySelector('[data-suggest]'));
  assert.equal(doc.querySelectorAll('[data-plan] tr').length, 5);
  click(w, doc.querySelector('[data-add-row]'));
  const row = saved(w, 'sc-skills-matrix-de').plan.at(-1);
  assert.deepEqual([row.target, row.due, row.sent, row.trainer], [3, '2026-11-22', false, '']);
  const trainer = doc.querySelector('[data-plan] tr:last-child select[data-field="trainer"]');
  trainer.value = 'ex-p2';
  trainer.dispatchEvent(new w.Event('change', { bubbles: true }));
  assert.equal(saved(w, 'sc-skills-matrix-de').plan.at(-1).trainer, 'ex-p2');
});

test('snapshots, the anonymous view, and the first own person replaces the example', () => {
  const w = load();
  const doc = w.document;
  click(w, doc.querySelector('[data-snapshot]'));
  let state = saved(w, 'sc-skills-matrix');
  assert.equal(state.snapshots.length, 3);
  assert.equal(state.snapshots.at(-1).date, '2026-10-23');
  assert.equal(state.snapshots.at(-1).spof, 2);
  click(w, doc.querySelector('[data-snapshot]'));
  assert.equal(saved(w, 'sc-skills-matrix').snapshots.length, 3, 'one snapshot a day');
  const anon = doc.querySelector('[data-anon]');
  anon.checked = true;
  anon.dispatchEvent(new w.Event('change', { bubbles: true }));
  const names = [...doc.querySelectorAll('.sm-person strong')].map((n) => n.textContent);
  assert.deepEqual(names.slice(0, 2), ['Person 1', 'Person 2']);
  assert.ok(!doc.querySelector('[data-results]').textContent.includes('Besnik'), 'no name left in the results');
  const form = doc.querySelector('[data-person-form]');
  form.elements.name.value = 'Dritan';
  form.elements.role.value = 'Picker';
  form.dispatchEvent(new w.Event('submit', { bubbles: true, cancelable: true }));
  state = saved(w, 'sc-skills-matrix');
  assert.deepEqual(state.people.map((p) => [p.name, p.role, p.shift]), [['Dritan', 'Picker', 'Early']]);
  assert.deepEqual([state.tasks.length, state.plan.length, state.snapshots.length, state.example], [0, 0, 0, false], 'the example left as a whole');
  assert.equal(doc.querySelector('[data-results]').hidden, true, 'no tasks yet');
  doc.querySelector('#sm-template').value = 'hotel';
  click(w, doc.querySelector('[data-load-template]'));
  state = saved(w, 'sc-skills-matrix');
  assert.equal(state.tasks.length, 8);
  assert.equal(doc.querySelector('[data-results]').hidden, false);
  assert.equal(doc.querySelectorAll('.sm-cov.is-none').length, 8, 'nobody covers anything yet');
});

test('shifts and teams come from the workplace profile when it has them', () => {
  const w = load({ storage: { 'sc-workplace': { shifts: ['A', 'B'], teams: ['Inbound', 'Outbound'] }, 'sc-skills-matrix': { people: [], tasks: [] } } });
  const doc = w.document;
  assert.deepEqual([...doc.querySelector('#sm-person-shift').options].map((o) => o.value), ['A', 'B']);
  assert.deepEqual([...doc.querySelector('#sm-team-list').options].map((o) => o.value), ['Inbound', 'Outbound']);
  assert.equal(doc.querySelector('[data-results]').hidden, true, 'nothing saved but not a first visit: no example');
  assert.ok(doc.querySelector('.dl-example-note').hidden);
});
