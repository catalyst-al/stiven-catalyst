// The Fishbone (src/js/fishbone.js): the arithmetic and the geometry in window.FishboneMath, the three data files, and
// the page itself: the example on a first visit, causes typed, voted and marked likely, several diagrams kept, the
// effect taken from ?problem=, and the hand-offs to 5 Whys, Pareto and the Action Tracker.
process.env.TZ = 'Europe/Berlin';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const nunjucks = require('nunjucks');
const { JSDOM } = require('jsdom');

const plain = (value) => JSON.parse(JSON.stringify(value));
const read = (file) => JSON.parse(fs.readFileSync(file, 'utf8'));
const DATA = { en: 'src/_data/fishbone.json', de: 'src/_data/de/fishbone.json', sq: 'src/_data/sq/fishbone.json' };

// The partial rendered the way the site does it, with the filters stubbed (English text, no asset hashes).
const env = new nunjucks.Environment(new nunjucks.FileSystemLoader('src/_includes'), { autoescape: false });
env.addFilter('t', (text) => text);
env.addFilter('local', (url, lang) => (lang && lang !== 'en' ? `/${lang}${url}` : url));
env.addFilter('assetUrl', (url) => url);
env.addFilter('scriptJson', (value) => JSON.stringify(value).replace(/</g, '\\u003c'));
const partial = (lang) => env.render('partials/fishbone.njk', { cfg: read(DATA[lang]), lang: lang === 'en' ? undefined : lang })
  .replace(/<script src=[^>]*><\/script>/g, '');

const load = ({ lang = 'en', page = true, now = '2026-10-23T10:00:00Z', storage = {}, search = '' } = {}) => {
  const base = lang === 'en' ? '' : `/${lang}`;
  const html = `<html lang="${lang}"><body><main id="main">${page ? partial(lang) : ''}</main></body></html>`;
  const dom = new JSDOM(html, { url: `https://example.test${base}/tools/fishbone/${search}`, runScripts: 'outside-only', pretendToBeVisual: true });
  const w = dom.window;
  w.eval(`(() => { const Real = Date; const fixed = new Real(${JSON.stringify(now)}); Date = class extends Real { constructor(...args) { super(...(args.length ? args : [fixed])); } static now() { return fixed.getTime(); } }; })();`);
  w.confirm = () => true;
  w.print = () => {};
  w.HTMLElement.prototype.scrollIntoView = () => {};
  Object.entries(storage).forEach(([key, value]) => w.localStorage.setItem(key, JSON.stringify(value)));
  for (const file of ['tool-kit', 'chart-kit', 'actions-store', 'fishbone']) w.eval(fs.readFileSync(`src/js/${file}.js`, 'utf8'));
  return w;
};
const saved = (w, key) => JSON.parse(w.localStorage.getItem(key));
const click = (w, node) => node.dispatchEvent(new w.MouseEvent('click', { bubbles: true, cancelable: true }));
const type = (w, input, value) => { input.value = value; input.dispatchEvent(new w.Event('input', { bubbles: true })); };

// The shape of a value: object keys and array lengths, not the words (they are translated).
const shape = (value) => (Array.isArray(value) ? value.map(shape) : value && typeof value === 'object'
  ? Object.fromEntries(Object.keys(value).sort().map((key) => [key, shape(value[key])])) : typeof value);

const SIX = ['People', 'Machine', 'Method', 'Material', 'Measurement', 'Environment'];
const cause = (text, votes = 0, likely = false, subs = []) => ({ text, votes, likely, subs });

test('the three data files share one shape, the same example and their own storage key', () => {
  const en = read(DATA.en);
  assert.equal(en.storageKey, 'sc-fishbone');
  assert.deepEqual(en.sets.map((s) => s.key), ['6m', '4p', 'service5']);
  assert.deepEqual(en.sets.map((s) => s.categories.length), [6, 4, 5]);
  assert.deepEqual(en.sets[0].categories, SIX);
  const ex = en.example;
  const all = ex.causes.flat();
  assert.equal(ex.set, '6m');
  assert.equal(all.length, 14, 'fourteen causes');
  assert.equal(all.filter((c) => c.likely).length, 3, 'three likely');
  assert.ok(ex.causes.every((list) => list.length > 0), 'every bone of 6M has a cause');
  assert.ok(all.some((c) => c.votes > 0) && all.some((c) => c.subs.length));
  for (const lang of ['de', 'sq']) {
    const other = read(DATA[lang]);
    assert.equal(other.storageKey, `sc-fishbone-${lang}`, `${lang} keeps its own work`);
    assert.deepEqual(shape(other), shape(en), `${lang} shape`);
    assert.deepEqual(other.sets.map((s) => s.key), en.sets.map((s) => s.key), `${lang}: the set keys are not translated`);
    other.example.causes.forEach((list, i) => list.forEach((c, j) => {
      assert.equal(c.votes, ex.causes[i][j].votes, `${lang} ${i}.${j} votes`);
      assert.equal(c.likely, ex.causes[i][j].likely, `${lang} ${i}.${j} likely`);
      assert.ok(c.text.length > 5);
    }));
    assert.notEqual(other.example.effect, ex.effect, `${lang}: the example is translated`);
  }
});

test('clip and wrap: long text ends in an ellipsis, words wrap into the head', () => {
  const M = load({ page: false }).FishboneMath;
  assert.equal(M.clip('Short', 10), 'Short');
  assert.equal(M.clip('  Scanners   not charged ', 40), 'Scanners not charged');
  const cut = M.clip('Scanners not charged at shift start', 12);
  assert.equal(cut.length, 12);
  assert.ok(cut.endsWith('…'));
  assert.deepEqual(plain(M.wrap('Routes leave the dock late', 18, 4)), ['Routes leave the', 'dock late']);
  const many = plain(M.wrap('one two three four five six seven eight nine ten eleven twelve', 9, 2));
  assert.equal(many.length, 2);
  assert.ok(many[1].endsWith('…') && many[1].length <= 9);
  assert.deepEqual(plain(M.wrap('', 18, 4)), []);
});

test('rank, stats, outline and the Pareto table', () => {
  const M = load({ page: false }).FishboneMath;
  const d = { effect: 'Late routes', causes: [
    [cause('A', 2), cause('B', 5, true, ['why B']), cause('  ', 9)],
    [cause('C', 5)],
    [],
    [cause('D', 0, true)],
  ] };
  const cats = ['People', 'Machine', 'Method', 'Material'];
  const ranked = plain(M.rank(d, cats));
  assert.deepEqual(ranked.map((c) => c.text), ['B', 'C', 'A', 'D'], 'most votes first; on a tie the likely one; an empty row is no cause');
  assert.deepEqual([ranked[0].category, ranked[0].subs], ['People', ['why B']]);
  const s = plain(M.stats(d, cats));
  assert.deepEqual([s.total, s.likely, s.votes, s.subs, s.touched, s.categories], [4, 2, 12, 1, 3, 4]);
  assert.deepEqual(s.empty, ['Method']);
  assert.equal(M.hidden(d, cats.slice(0, 2)), 1, 'causes of the bones a smaller set does not have are kept, not lost');
  assert.equal(M.hidden(d, cats), 0);
  const text = M.outline(d, cats, { title: 'Fishbone' });
  assert.equal(text.split('\n')[0], 'Fishbone: Late routes');
  assert.match(text, /\nPeople\n {2}- A \(2 votes\)\n {2}- B \(likely, 5 votes\)\n {6}- why B\n/);
  assert.match(text, /\nMethod\n {2}–\n/);
  const table = plain(M.paretoTable(M.rank(d, cats), { source: 'Fishbone: Late routes' }));
  assert.deepEqual(table.headers, ['Cause', 'Category', 'Votes']);
  assert.deepEqual(table.rows, [['B', 'People', '5'], ['C', 'Machine', '5'], ['A', 'People', '2']], 'only causes with votes');
  assert.deepEqual(table.map, { category: 0, count: 2, value: -1, date: -1, filter: 1 });
  assert.equal(table.measure, 'count');
});

test('the layout: bones up and down, causes on their bone, all inside the 960 × 560 drawing', () => {
  const M = load({ page: false }).FishboneMath;
  const ex = read(DATA.en).example;
  const L = plain(M.layout(ex, SIX));
  assert.equal(L.W, 960);
  assert.equal(L.H, 560);
  assert.deepEqual(L.bones.map((b) => b.side), ['top', 'top', 'top', 'bottom', 'bottom', 'bottom']);
  assert.ok(L.head.x + L.head.w <= 960 && L.head.x > L.spine.x1);
  assert.equal(L.spine.x2, L.head.x, 'the spine ends at the head');
  assert.ok(L.head.lines.length >= 1 && L.head.lines.map((l) => l.text).join(' ') === ex.effect);
  let marks = 0;
  L.bones.forEach((bone) => {
    assert.equal(bone.joint.y, L.spine.y);
    assert.ok(bone.tip.x < bone.joint.x, 'bones slant back from the head');
    assert.ok(bone.side === 'top' ? bone.tip.y < L.spine.y : bone.tip.y > L.spine.y);
    assert.ok(bone.label.box.x >= 0 && bone.label.box.y >= 0 && bone.label.box.y + bone.label.box.h <= L.H);
    bone.causes.forEach((c) => {
      marks++;
      assert.ok(c.x1 >= 0 && c.x1 < c.x2 && c.x2 <= bone.joint.x + 0.001, `${c.text}: the line ends on its bone`);
      assert.ok(Math.min(bone.tip.y, bone.joint.y) < c.y && c.y < Math.max(bone.tip.y, bone.joint.y));
      // On the bone: the point (x2, y) lies on the line from the tip to the joint.
      const t = (c.y - bone.tip.y) / (bone.joint.y - bone.tip.y);
      assert.ok(Math.abs(bone.tip.x + t * (bone.joint.x - bone.tip.x) - c.x2) < 0.001);
      c.subs.forEach((s) => assert.ok(s.textX > 0 && s.y2 > 0 && s.y2 < L.H));
    });
  });
  assert.equal(marks, 14);
  // 4P: two up, two down; Service 5: three up, two down, the lower ones next to the head.
  assert.deepEqual(plain(M.layout(ex, ['a', 'b', 'c', 'd'])).bones.map((b) => b.side), ['top', 'top', 'bottom', 'bottom']);
  const five = plain(M.layout({ effect: 'x', causes: [] }, ['a', 'b', 'c', 'd', 'e']));
  assert.deepEqual(five.bones.map((b) => b.side), ['top', 'top', 'top', 'bottom', 'bottom']);
  assert.equal(five.bones[4].joint.x, five.bones[2].joint.x);
});

test('long texts are cut with an ellipsis, and a crowded bone makes the drawing taller', () => {
  const M = load({ page: false }).FishboneMath;
  const long = 'The loading sequence printed on the route sheet does not match the order in which the parcels arrive from the sorter';
  const crowded = { effect: 'Late', causes: [Array.from({ length: 12 }, (_, i) => cause(`${long} ${i}`, i, i % 4 === 0, ['why one', 'why two'])), [], [], [], [], []] };
  const L = plain(M.layout(crowded, SIX));
  assert.ok(L.H > 560, `taller: ${L.H}`);
  const bone = L.bones[0];
  assert.equal(bone.causes.length, 12);
  assert.ok(bone.causes.every((c) => c.label.endsWith('…') && c.label.length < c.text.length));
  assert.ok(bone.causes.every((c) => c.x1 >= 0 && c.textY > 0), 'nothing leaves the drawing');
  const ys = bone.causes.flatMap((c) => [c.y, ...c.subs.map((s) => s.y2)]);
  const gaps = ys.slice(1).map((y, i) => y - ys[i]);
  assert.ok(gaps.every((g) => g >= 17), 'each row keeps its height');
  assert.equal(plain(M.layout({ causes: [Array.from({ length: 20 }, (_, i) => cause(`c${i}`))] }, ['a'])).bones[0].causes.length, 12, 'twelve per bone at most');
});

test('a first visit opens on the example: the drawing, the stats and the likely causes', () => {
  const w = load();
  const doc = w.document;
  const results = doc.querySelector('[data-results]');
  assert.equal(results.hidden, false);
  assert.equal(doc.querySelector('.dl-example-note').hidden, false, 'the example says so');
  assert.equal(saved(w, 'sc-fishbone'), null, 'nothing is written until the visitor acts');
  const svg = results.querySelector('svg.fb-chart');
  assert.ok(svg, 'the diagram');
  assert.equal(svg.getAttribute('viewBox'), '0 0 960 560');
  assert.equal(svg.querySelectorAll('.fb-mark').length, 14);
  assert.equal(svg.querySelectorAll('.fb-mark.is-likely circle').length, 3, 'a dot on each likely cause');
  assert.ok([...svg.querySelectorAll('[data-tip]')].some((g) => g.getAttribute('data-tip').startsWith('All routes released to the dock at once, not in waves\nMethod · likely · 6 votes')));
  assert.equal(svg.querySelectorAll('.fb-bone').length, 6);
  assert.match(results.textContent, /3 likely causes to verify on the floor/);
  assert.match(results.querySelector('.dl-focus h3').textContent, /All routes released to the dock at once/);
  assert.ok(results.querySelector('.fb-panel-rank .dl-bar.is-top'), 'likely causes stand out in the ranking');
  assert.equal(doc.querySelectorAll('[data-categories] .fb-cat').length, 6);
  assert.equal(doc.querySelectorAll('[data-categories] .fb-cause').length, 14);
  assert.equal(doc.querySelector('#fb-effect').value, 'Routes leave the dock late');
  assert.equal(doc.querySelectorAll('[data-list] li').length, 1);
});

test('causes are added, voted and marked likely; the example becomes the visitor\'s own', () => {
  const w = load({ lang: 'de' });
  const doc = w.document;
  const input = doc.querySelector('[data-new="4"]');
  input.value = 'Keine Uhr an der Rampe';
  input.dispatchEvent(new w.KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true }));
  let state = saved(w, 'sc-fishbone-de');
  assert.equal(state.diagrams[0].causes[4].length, 3);
  assert.equal(state.example, '', 'an edit makes the example the visitor\'s');
  assert.equal(doc.querySelector('.dl-example-note').hidden, true);
  assert.equal(doc.activeElement, doc.querySelector('[data-new="4"]'), 'ready for the next cause');
  const row = doc.querySelectorAll('[data-cat="4"] .fb-cause')[2];
  click(w, row.querySelector('[data-act="up"]'));
  click(w, row.querySelector('[data-act="up"]'));
  click(w, row.querySelector('[data-act="likely"]'));
  assert.equal(row.querySelector('.fb-vote-count').textContent, '2');
  assert.equal(row.querySelector('[data-act="likely"]').getAttribute('aria-pressed'), 'true');
  state = saved(w, 'sc-fishbone-de');
  assert.deepEqual(plain(state.diagrams[0].causes[4][2]).votes, 2);
  assert.equal(state.diagrams[0].causes[4][2].likely, true);
  assert.match(doc.querySelector('[data-results]').textContent, /4 likely causes to verify on the floor/);
  // A why under the new cause.
  click(w, row.querySelector('[data-act="add-sub"]'));
  const sub = doc.querySelector('[data-cat="4"] .fb-cause:nth-child(3) [data-sub="0"]');
  type(w, sub, 'Uhr seit dem Umbau entfernt');
  assert.deepEqual(saved(w, 'sc-fishbone-de').diagrams[0].causes[4][2].subs, ['Uhr seit dem Umbau entfernt']);
  // Removing a cause can be undone.
  click(w, doc.querySelector('[data-cat="0"] .fb-cause [data-act="remove"]'));
  assert.equal(saved(w, 'sc-fishbone-de').diagrams[0].causes[0].length, 2);
  click(w, doc.querySelector('[data-cause-status] .dl-undo'));
  assert.equal(saved(w, 'sc-fishbone-de').diagrams[0].causes[0].length, 3);
});

test('switching the set keeps the causes by position, and the bones beyond it come back', () => {
  const w = load();
  const doc = w.document;
  const select = doc.querySelector('#fb-set');
  select.value = '4p';
  select.dispatchEvent(new w.Event('change', { bubbles: true }));
  assert.deepEqual([...doc.querySelectorAll('.fb-cat-name')].map((n) => n.textContent), ['Policies', 'Procedures', 'People', 'Place']);
  assert.equal(doc.querySelectorAll('[data-cat="0"] .fb-cause').length, 3, 'the first bone keeps the causes of the first');
  assert.match(doc.querySelector('[data-set-note]').textContent, /^4 causes sit in categories this set does not have/);
  assert.equal(doc.querySelectorAll('svg.fb-chart .fb-mark').length, 10);
  select.value = '6m';
  select.dispatchEvent(new w.Event('change', { bubbles: true }));
  assert.equal(doc.querySelectorAll('svg.fb-chart .fb-mark').length, 14, 'back with all fourteen');
  assert.equal(doc.querySelector('[data-set-note]').textContent, '');
});

test('several diagrams: a new one, a duplicate, a delete with undo', () => {
  const w = load();
  const doc = w.document;
  click(w, doc.querySelector('[data-new]'));
  let state = saved(w, 'sc-fishbone');
  assert.equal(state.diagrams.length, 1, 'the example left when the visitor started their own');
  assert.equal(doc.querySelector('[data-results]').hidden, true, 'nothing to show yet');
  type(w, doc.querySelector('#fb-effect'), 'Guests wait at check-in');
  const select = doc.querySelector('#fb-set');
  select.value = 'service5';
  select.dispatchEvent(new w.Event('change', { bubbles: true }));
  const input = doc.querySelector('[data-new="0"]');
  input.value = 'One receptionist at 15:00';
  click(w, doc.querySelector('[data-cat="0"] [data-act="add"]'));
  assert.equal(doc.querySelector('[data-results]').hidden, false);
  click(w, doc.querySelector('[data-list] [data-duplicate]'));
  state = saved(w, 'sc-fishbone');
  assert.equal(state.diagrams.length, 2);
  assert.equal(state.diagrams[1].effect, 'Guests wait at check-in (copy)');
  assert.equal(state.current, state.diagrams[1].id, 'the copy is open');
  assert.notEqual(state.diagrams[1].causes[0][0].id, state.diagrams[0].causes[0][0].id);
  click(w, doc.querySelector('[data-list] li:nth-child(1) [data-remove]'));
  assert.equal(saved(w, 'sc-fishbone').diagrams.length, 1);
  assert.match(doc.querySelector('[data-list-status]').textContent, /Deleted Guests wait at check-in\./);
  click(w, doc.querySelector('[data-list-status] .dl-undo'));
  state = saved(w, 'sc-fishbone');
  assert.deepEqual(state.diagrams.map((d) => d.effect), ['Guests wait at check-in', 'Guests wait at check-in (copy)'], 'put back where it was');
  // Opening another one.
  click(w, doc.querySelector('[data-list] li:nth-child(1) [data-open]'));
  assert.equal(saved(w, 'sc-fishbone').current, state.diagrams[0].id);
  assert.equal(doc.querySelector('[data-list] li:nth-child(1)').getAttribute('aria-current'), 'true');
  // The example comes back on request, as a diagram of its own.
  click(w, doc.querySelector('[data-example]'));
  assert.equal(saved(w, 'sc-fishbone').diagrams.length, 3);
  assert.equal(doc.querySelector('.dl-example-note').hidden, false);
  click(w, doc.querySelector('.dl-example-note button'));
  assert.equal(saved(w, 'sc-fishbone').diagrams.length, 2);
});

test('?problem= fills the effect once and cleans the address', () => {
  const w = load({ lang: 'sq', search: '?problem=Ankesat%20p%C3%ABr%20zhurm%C3%ABn&coaching=1' });
  const doc = w.document;
  const state = saved(w, 'sc-fishbone-sq');
  assert.equal(state.diagrams.length, 1, 'no example under a problem that came from another tool');
  assert.equal(state.diagrams[0].effect, 'Ankesat për zhurmën');
  assert.equal(doc.querySelector('#fb-effect').value, 'Ankesat për zhurmën');
  assert.equal(w.location.search, '?coaching=1');
  // A second arrival with the same problem opens that diagram, it does not copy it.
  const again = load({ lang: 'sq', search: '?problem=Ankesat%20p%C3%ABr%20zhurm%C3%ABn', storage: { 'sc-fishbone-sq': state } });
  assert.equal(saved(again, 'sc-fishbone-sq').diagrams.length, 1);
});

test('hand-offs: the top cause to 5 Whys, the votes to Pareto, the likely causes to the Action Tracker', () => {
  const w = load({ lang: 'de' });
  const doc = w.document;
  const results = doc.querySelector('[data-results]');
  const whys = [...results.querySelectorAll('a')].find((a) => a.href.includes('five-whys'));
  const url = new w.URL(whys.href);
  assert.equal(url.pathname, '/de/tools/five-whys/', 'the hand-off keeps the language');
  assert.equal(url.searchParams.get('problem'), 'Touren verlassen die Rampe zu spät: Alle Touren auf einmal an die Rampe, nicht in Wellen');
  const pareto = [...results.querySelectorAll('a')].find((a) => a.href.includes('/pareto/'));
  assert.equal(new w.URL(pareto.href).pathname, '/de/tools/pareto/');
  click(w, pareto);
  const handoff = JSON.parse(w.sessionStorage.getItem('sc-pareto-handoff'));
  assert.deepEqual(handoff.headers, ['Cause', 'Category', 'Votes'], 'the page\'s own words (English without ui strings)');
  assert.equal(handoff.rows.length, 13, 'every cause with a vote');
  assert.deepEqual(handoff.rows[0], ['Alle Touren auf einmal an die Rampe, nicht in Wellen', 'Methode', '6']);
  assert.equal(handoff.map.count, 2);
  const send = [...results.querySelectorAll('button')].find((b) => /likely causes to actions \(3\)/.test(b.textContent));
  assert.ok(send);
  click(w, send);
  let actions = w.ActionsStore.list();
  assert.equal(actions.length, 3);
  assert.ok(actions.every((a) => a.source === 'fishbone' && a.title.startsWith('Verify: ') && a.due === '2026-10-30'));
  assert.equal(actions.find((a) => a.priority === 'High').title, 'Verify: Alle Touren auf einmal an die Rampe, nicht in Wellen');
  assert.equal(new w.URL(results.querySelector('.fb-action-status a').href).pathname, '/de/tools/action-tracker/');
  click(w, send);
  actions = w.ActionsStore.list();
  assert.equal(actions.length, 3, 'each likely cause is handed over once');
  // The outline copied and the CSV rows.
  const copyButton = results.querySelector('.result-actions button');
  assert.equal(copyButton.textContent, 'Copy as outline');
});

test('no votes: no Pareto link; damaged storage loads without breaking', () => {
  const w = load({ storage: { 'sc-fishbone': { diagrams: [{ id: 'x', effect: 'Late', set: 'nope', causes: [[{ text: 'A', votes: -3, likely: 'yes', subs: 'no' }, 'junk', null]], updated: 'soon' }, 7], current: 'x' } } });
  const doc = w.document;
  const state = w.FishboneMath.cleanDiagram({ id: 'x', set: 'nope', causes: [[{ text: 'A', votes: -3 }]] }, ['6m', '4p']);
  assert.equal(state.set, '6m');
  assert.equal(state.causes.length, 6);
  assert.deepEqual(plain(state.causes[0][0]).votes, 0);
  const results = doc.querySelector('[data-results]');
  assert.equal(results.hidden, false);
  assert.equal(doc.querySelectorAll('[data-categories] .fb-cause').length, 1);
  assert.ok(![...results.querySelectorAll('a')].some((a) => a.href.includes('/pareto/')), 'a Pareto of no votes says nothing');
  assert.ok([...results.querySelectorAll('a')].some((a) => a.href.includes('five-whys')));
  assert.equal(doc.querySelector('.dl-example-note').hidden, true);
});

test('every text of the page and the script has a German and an Albanian translation', () => {
  const part = read('src/_data/i18n-parts/fishbone.json');
  const ui = { de: read('src/_data/de/ui.json'), sq: read('src/_data/sq/ui.json') };
  const js = fs.readFileSync('src/js/fishbone.js', 'utf8');
  const njk = fs.readFileSync('src/_includes/partials/fishbone.njk', 'utf8');
  const texts = new Set([
    ...[...js.matchAll(/\btx\(\s*"((?:[^"\\]|\\.)*)"/g)].map((m) => JSON.parse(`"${m[1]}"`)),
    ...[...njk.matchAll(/\{\{ *"([^"]+)" *\| *t\(lang\)/g)].map((m) => m[1]),
  ]);
  assert.ok(texts.size > 50);
  for (const lang of ['de', 'sq']) {
    const missing = [...texts].filter((text) => ui[lang][text] === undefined && part[lang][text] === undefined);
    assert.deepEqual(missing, [], `${lang}: untranslated`);
    for (const [en, local] of Object.entries(part[lang])) {
      assert.deepEqual((local.match(/\{\w+\}/g) || []).sort(), (en.match(/\{\w+\}/g) || []).sort(), `${lang}: placeholders of "${en}"`);
    }
  }
  const cards = read('src/_data/i18n-parts/fishbone.cards.json');
  assert.equal(cards.family, 'lumen');
  assert.deepEqual(['en', 'de', 'sq'].map((lang) => cards.cards[lang].url), ['/tools/fishbone/', '/de/tools/fishbone/', '/sq/tools/fishbone/']);
  assert.ok(['en', 'de', 'sq'].every((lang) => cards.cards[lang].time === '15 min'));
});

test('the stylesheet part opens and closes its rules and uses no brand-only colours', () => {
  const css = fs.readFileSync('src/css/16-fishbone.css', 'utf8');
  assert.equal((css.match(/\{/g) || []).length, (css.match(/\}/g) || []).length);
  assert.equal((css.match(/\/\*/g) || []).length, (css.match(/\*\//g) || []).length);
  assert.doesNotMatch(css, /--red|--gold/);
  assert.ok(css.split('\n').filter((line) => /^\.[a-z]/.test(line)).every((line) => /\.fb-/.test(line)), 'every rule names an .fb- class');
});
