// The 5S Audit (src/js/five-s-audit.js): the scoring arithmetic in window.FiveSMath, the three data files, and the
// page itself: the example on a first visit, a walk scored and saved, findings handed to the Action Tracker, the
// log's undo and the red tag register.
process.env.TZ = 'Europe/Berlin';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const nunjucks = require('nunjucks');
const { JSDOM } = require('jsdom');

const plain = (value) => JSON.parse(JSON.stringify(value));
const read = (file) => JSON.parse(fs.readFileSync(file, 'utf8'));
const DATA = { en: 'src/_data/fiveSAudit.json', de: 'src/_data/de/fiveSAudit.json', sq: 'src/_data/sq/fiveSAudit.json' };

// The partial rendered the way the site does it, with the filters stubbed (English text, no asset hashes).
const env = new nunjucks.Environment(new nunjucks.FileSystemLoader('src/_includes'), { autoescape: false });
env.addFilter('t', (text) => text);
env.addFilter('local', (url, lang) => (lang && lang !== 'en' ? `/${lang}${url}` : url));
env.addFilter('assetUrl', (url) => url);
env.addFilter('scriptJson', (value) => JSON.stringify(value).replace(/</g, '\\u003c'));
const partial = (lang) => env.render('partials/five-s-audit.njk', { cfg: read(DATA[lang]), lang: lang === 'en' ? undefined : lang })
  .replace(/<script src=[^>]*><\/script>/g, '');

const load = ({ lang = 'sq', page = true, now = '2026-10-23T10:00:00Z', storage = {} } = {}) => {
  const base = lang === 'en' ? '' : `/${lang}`;
  const html = `<html lang="${lang}"><body><main id="main">${page ? partial(lang) : ''}</main></body></html>`;
  const dom = new JSDOM(html, { url: `https://example.test${base}/tools/five-s-audit/`, runScripts: 'outside-only', pretendToBeVisual: true });
  const w = dom.window;
  w.eval(`(() => { const Real = Date; const fixed = new Real(${JSON.stringify(now)}); Date = class extends Real { constructor(...args) { super(...(args.length ? args : [fixed])); } static now() { return fixed.getTime(); } }; })();`);
  w.confirm = () => true;
  w.print = () => {};
  w.HTMLElement.prototype.scrollIntoView = () => {};
  Object.entries(storage).forEach(([key, value]) => w.localStorage.setItem(key, JSON.stringify(value)));
  for (const file of ['tool-kit', 'chart-kit', 'workplace', 'actions-store', 'five-s-audit']) w.eval(fs.readFileSync(`src/js/${file}.js`, 'utf8'));
  return w;
};
const saved = (w, key) => JSON.parse(w.localStorage.getItem(key));
const click = (w, node) => node.dispatchEvent(new w.MouseEvent('click', { bubbles: true }));
const choose = (w, input) => { input.checked = true; input.dispatchEvent(new w.Event('change', { bubbles: true })); };

// The shape of a value: object keys and array lengths, not the words (they are translated).
const shape = (value) => (Array.isArray(value) ? value.map(shape) : value && typeof value === 'object'
  ? Object.fromEntries(Object.keys(value).sort().map((key) => [key, shape(value[key])])) : typeof value);

test('the three data files share one shape, the scores of the example and their own storage key', () => {
  const en = read(DATA.en);
  assert.equal(en.storageKey, 'sc-five-s-audit');
  for (const lang of ['de', 'sq']) {
    const other = read(DATA[lang]);
    assert.equal(other.storageKey, `sc-five-s-audit-${lang}`, `${lang} keeps its own work`);
    const { example: a, ...restEn } = en;
    const { example: b, ...restOther } = other;
    assert.deepEqual(shape(restOther), shape(restEn), `${lang} shape`);
    assert.deepEqual(other.scopes, en.scopes, `${lang}: the scope keys are not translated`);
    assert.deepEqual(other.pillars.map((p) => p.key), en.pillars.map((p) => p.key));
    assert.equal(b.scope, a.scope);
    assert.equal(b.template, a.template);
    assert.equal(b.audits.length, a.audits.length);
    b.audits.forEach((audit, i) => {
      assert.equal(audit.date, a.audits[i].date, `${lang} audit ${i} date`);
      assert.deepEqual(audit.scores, a.audits[i].scores, `${lang} audit ${i} scores`);
      assert.deepEqual(Object.keys(audit.notes), Object.keys(a.audits[i].notes), `${lang} audit ${i} notes`);
    });
    assert.equal(b.tags.length, a.tags.length);
    b.tags.forEach((tag, i) => {
      assert.equal(other.reasons.indexOf(tag.reason), en.reasons.indexOf(a.tags[i].reason), `${lang} tag ${i} reason`);
      assert.equal(other.decisions.indexOf(tag.decision), en.decisions.indexOf(a.tags[i].decision), `${lang} tag ${i} decision`);
      assert.equal(tag.done, a.tags[i].done);
    });
  }
});

test('every template asks 4 to 5 questions per S, and the example fits its template', () => {
  for (const lang of Object.keys(DATA)) {
    const cfg = read(DATA[lang]);
    assert.deepEqual(Object.keys(cfg.templates), ['warehouse', 'hotel', 'delivery-station']);
    assert.equal(cfg.levels.length, 5, 'scores 0 to 4');
    assert.equal(cfg.bands.length, 4);
    for (const [name, tpl] of Object.entries(cfg.templates)) {
      for (const key of cfg.scopes['8S']) {
        const n = tpl.questions[key]?.length || 0;
        assert.ok(n >= 4 && n <= 5, `${lang} ${name} ${key}: ${n} questions`);
      }
    }
    const ex = cfg.example;
    const tpl = cfg.templates[ex.template];
    assert.equal(new Set(ex.audits.map((a) => a.area)).size, 3, 'three areas');
    assert.equal(ex.tags.length, 5, 'five red tags');
    ex.audits.forEach((audit) => {
      assert.ok(tpl.areas.includes(audit.area), `${lang}: ${audit.area} is an area of the template`);
      for (const key of cfg.scopes[ex.scope]) assert.equal(audit.scores[key].length, tpl.questions[key].length, `${lang} ${audit.date} ${key}`);
      Object.keys(audit.notes).forEach((name) => assert.match(name, /^[a-z]+-\d+$/));
    });
  }
});

test('the arithmetic: per-S averages, the overall share with each S weighing one, and the bands', () => {
  const M = load({ page: false }).FiveSMath;
  const keys = ['sort', 'set', 'shine'];
  const r = plain(M.score({ sort: [4, 4, 4, 4], set: [2, 0, null, 2], shine: [] }, keys));
  assert.equal(r.perS.sort.avg, 4);
  assert.equal(r.perS.set.avg, 4 / 3, 'unanswered questions do not count');
  assert.equal(r.perS.set.findings, 3);
  assert.equal(r.perS.shine.n, 0);
  assert.equal(r.rated, 2);
  assert.equal(r.overall, (1 + 1 / 3) / 2, 'an S without answers is left out of the overall');
  assert.equal(r.answered, 7);
  assert.equal(r.total, 8);
  assert.equal(M.score({}, keys).overall, 0);
  assert.equal(M.score({ sort: [5, -1, 2.5, '3'] }, ['sort']).perS.sort.n, 0, 'only 0 to 4 are scores');
  // The first walk of the example: 6S, the inbound dock.
  const first = read(DATA.en).example.audits[0];
  const six = read(DATA.en).scopes['6S'];
  assert.equal(M.score(first.scores, six).overall, 0.34375);
  assert.deepEqual([0, 0.49, 0.5, 0.74, 0.75, 0.89, 0.9, 1].map(M.bandIndex), [0, 0, 1, 1, 2, 2, 3, 3]);
  assert.deepEqual(plain(M.pillarsFor('8S', read(DATA.en).scopes)).length, 8);
  assert.deepEqual(plain(M.pillarsFor('nope', { '5S': ['sort'] })), ['sort'], 'an unknown scope falls back to 5S');
});

test('trend, league table, the previous audit, the weakest questions and the red tag ages', () => {
  const M = load({ page: false }).FiveSMath;
  const scopes = { '5S': ['sort'] };
  const rows = [
    { id: 'a', date: '2026-10-01', area: 'Dock', scope: '5S', scores: { sort: [2] } },
    { id: 'b', date: '2026-10-08', area: 'Dock', scope: '5S', scores: { sort: [3] } },
    { id: 'c', date: '2026-10-05', area: 'Packing', scope: '5S', scores: { sort: [4] } },
    { id: 'd', date: '2026-10-08', area: 'Dock', scope: '5S', scores: { sort: [1] } },
  ];
  const trend = plain(M.trend(rows, scopes));
  assert.deepEqual(trend.map((s) => s.area), ['Dock', 'Packing'], 'most recently audited first');
  assert.deepEqual(trend[0].points.map((p) => p.pct), [0.5, 0.75, 0.25], 'oldest first');
  assert.deepEqual(plain(M.trend(rows, scopes, 'Packing')).map((s) => s.area), ['Packing']);
  const league = plain(M.latestByArea(rows, scopes));
  assert.deepEqual(league.map((x) => [x.area, x.pct]), [['Packing', 1], ['Dock', 0.25]], 'the latest of each area, best first');
  assert.equal(M.previous(rows, rows[1]).id, 'a');
  assert.equal(M.previous(rows, rows[3]).id, 'b', 'the same day: the one entered before');
  assert.equal(M.previous(rows, rows[0]), null);
  const weak = plain(M.weakest({ sort: [2, 4, 0], set: [1, 3] }, ['sort', 'set']));
  assert.deepEqual(weak.map((w) => `${w.key}${w.index}:${w.score}`), ['sort2:0', 'set0:1', 'sort0:2']);
  const tags = [
    { date: '2026-09-01', done: false, due: '2026-09-08' },
    { date: '2026-09-23', done: false, due: '2026-10-30' },
    { date: '2026-10-20', done: false },
    { date: '2026-08-01', done: true, due: '2026-08-08' },
  ];
  assert.deepEqual(plain(M.redTagStats(tags, '2026-10-23')), { total: 4, open: 3, old: 2, done: 1, overdue: 1 });
  assert.equal(M.addDays('2026-10-30', 3), '2026-11-02');
  assert.equal(M.addDays('2026-03-28', 2), '2026-03-30', 'no daylight saving slip');
});

test('a first visit opens on the example: six weeks, three areas, five red tags and a rich result', () => {
  const w = load();
  const doc = w.document;
  const results = doc.querySelector('[data-results]');
  assert.ok(!results.hidden);
  assert.ok(!doc.querySelector('.dl-example-note').hidden, 'the example says so');
  assert.equal(doc.querySelectorAll('[data-log] tr').length, 18);
  assert.equal(doc.querySelectorAll('[data-tags] tr').length, 5);
  assert.equal(doc.querySelector('[data-scope-value="6S"]').getAttribute('aria-pressed'), 'true');
  assert.equal(doc.querySelectorAll('[data-questions] .fs-pillar').length, 6);
  assert.equal(doc.querySelectorAll('[data-questions] .fs-q').length, 24);
  assert.ok(results.querySelector('.dl-focus'), 'a Start here card');
  assert.equal(results.querySelectorAll('svg.ck-chart').length, 3, 'radar, trend and league table');
  assert.ok(results.querySelector('.fs-panel-radar polygon[stroke-dasharray]'), 'the previous audit is dashed');
  assert.ok(results.querySelector('.fs-panel-tags li'));
  // The example sits in recent weeks: the newest walk is in the week before today.
  const state = saved(w, 'sc-five-s-audit-sq');
  assert.equal(state, null, 'nothing is written until the visitor acts');
  const dates = [...doc.querySelectorAll('[data-log] [data-show]')].map((b) => b.textContent);
  assert.equal(dates[0], '19.10.2026');
  assert.equal(doc.querySelector('#fs-area-list').children.length >= 3, true);
});

test('a walk is scored, its findings go to the Action Tracker, and saving it replaces the example', () => {
  const w = load({ lang: 'de' });
  const doc = w.document;
  click(w, doc.querySelector('[data-scope-value="5S"]'));
  assert.equal(doc.querySelectorAll('[data-questions] .fs-pillar').length, 5);
  const area = doc.querySelector('#fs-area');
  area.value = 'Packing';
  area.dispatchEvent(new w.Event('input', { bubbles: true }));
  choose(w, doc.querySelector('input[name="fs-sort-0"][value="1"]'));
  choose(w, doc.querySelector('input[name="fs-sort-1"][value="4"]'));
  choose(w, doc.querySelector('input[name="fs-set-0"][value="0"]'));
  const row = doc.querySelector('input[name="fs-sort-0"]').closest('.fs-q');
  assert.ok(row.classList.contains('is-finding'));
  assert.ok(row.querySelector('[data-act]').checked, 'a 2 or lower suggests an action');
  const note = doc.querySelector('[data-note="set-0"]');
  note.value = 'Cage 7 in the walkway';
  note.dispatchEvent(new w.Event('input', { bubbles: true }));
  const results = doc.querySelector('[data-results]');
  assert.match(results.querySelector('.result-head .kicker').textContent, /Audit in progress/);
  const add = doc.querySelector('[data-add-actions]');
  assert.equal(add.disabled, false);
  assert.match(add.textContent, /2 findings/);
  click(w, add);
  const actions = w.ActionsStore.list();
  assert.equal(actions.length, 2);
  assert.ok(actions.every((a) => a.source === 'five-s-audit' && a.area === 'Packing' && a.due === '2026-10-30'));
  assert.equal(actions.find((a) => a.priority === 'High').detail.startsWith('Cage 7 in the walkway'), true, 'a 0 is high, the note leads');
  assert.equal(add.disabled, true, 'each finding is handed over once');
  assert.equal(new w.URL(doc.querySelector('[data-audit-status] a').href).pathname, '/de/tools/action-tracker/', 'the hand-off keeps the language');
  click(w, doc.querySelector('[data-save]'));
  const state = saved(w, 'sc-five-s-audit-de');
  assert.equal(state.rows.length, 1, 'the example left with the first own audit');
  assert.equal(state.tags.length, 0);
  assert.deepEqual(state.rows[0].scores.sort, [1, 4, null, null]);
  assert.equal(state.rows[0].notes['set-0'], 'Cage 7 in the walkway');
  assert.equal(state.rows[0].scope, '5S');
  assert.ok(doc.querySelector('.dl-example-note').hidden);
  assert.match(results.querySelector('.result-head .kicker').textContent, /Latest audit/);
  assert.equal(doc.querySelectorAll('[data-questions] input:checked[type="radio"]').length, 0, 'a fresh walk');
});

test('the log removes an audit with undo, and red tags are added, closed and exported', () => {
  const w = load({ lang: 'en' });
  const doc = w.document;
  click(w, doc.querySelector('[data-log] [data-remove]'));
  assert.equal(doc.querySelectorAll('[data-log] tr').length, 17);
  click(w, doc.querySelector('[data-log-status] .dl-undo'));
  assert.equal(doc.querySelectorAll('[data-log] tr').length, 18);
  assert.equal(saved(w, 'sc-five-s-audit').rows.length, 18, 'put back where it was');
  // A fresh visit for the register: the first own red tag replaces the example.
  const v = load({ lang: 'en' });
  const form = v.document.querySelector('[data-tag-form]');
  form.elements.tagItem.value = 'Old scanner holster';
  form.elements.tagArea.value = 'Returns';
  form.elements.tagReason.value = form.elements.tagReason.options[1].value;
  form.dispatchEvent(new v.Event('submit', { bubbles: true, cancelable: true }));
  const state = saved(v, 'sc-five-s-audit');
  assert.equal(state.tags.length, 1, 'the example left with the first own red tag');
  assert.equal(state.rows.length, 0);
  assert.deepEqual([state.tags[0].item, state.tags[0].area, state.tags[0].reason, state.tags[0].date], ['Old scanner holster', 'Returns', 'Broken', '2026-10-23']);
  const box = v.document.querySelector('[data-tags] [data-done]');
  box.checked = true;
  box.dispatchEvent(new v.Event('change', { bubbles: true }));
  assert.equal(saved(v, 'sc-five-s-audit').tags[0].done, true);
  assert.match(v.document.querySelector('[data-tag-stats]').textContent, /0 open .* 1 done/);
});

test('areas come from the workplace profile when it has them', () => {
  const w = load({ lang: 'en', storage: { 'sc-workplace': { areas: [{ name: 'Dock 1', owner: 'Besnik' }, 'Dock 2'], shifts: ['A', 'B'] }, 'sc-five-s-audit': { rows: [], tags: [] } } });
  const doc = w.document;
  const select = doc.querySelector('#fs-area-select');
  assert.equal(select.closest('.field').hidden, false);
  assert.equal(doc.querySelector('#fs-area').closest('.field').hidden, true);
  assert.deepEqual([...select.options].map((o) => o.value), ['Dock 1', 'Dock 2']);
  assert.deepEqual([...doc.querySelector('#fs-shift').options].map((o) => o.value), ['A', 'B']);
  choose(w, doc.querySelector('input[name="fs-sort-0"][value="2"]'));
  click(w, doc.querySelector('[data-add-actions]'));
  assert.equal(w.ActionsStore.list()[0].owner, 'Besnik', 'the owner of the area owns the action');
  assert.ok(doc.querySelector('[data-results]').hidden === false);
  assert.ok(doc.querySelector('.dl-example-note').hidden, 'nothing saved but not a first visit: no example');
});
