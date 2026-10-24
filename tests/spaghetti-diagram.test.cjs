// Spaghetti Diagram (src/js/spaghetti-diagram.js): the arithmetic in window.SpaghettiMath (scale from two points,
// path lengths, cycles, visits per stop, legs, the heat grid, before and after), the page on its example with taps on
// the plan, and the data files in the three languages.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const { JSDOM } = require('jsdom');

const plain = (value) => JSON.parse(JSON.stringify(value));
const near = (a, b, eps = 1e-6) => assert.ok(Math.abs(a - b) < eps, `${a} ≈ ${b}`);
const read = (lang) => JSON.parse(fs.readFileSync(`src/_data/${lang === 'en' ? '' : `${lang}/`}spaghettiDiagram.json`, 'utf8'));
const keysOf = (value, prefix = '') => (value && typeof value === 'object' && !Array.isArray(value)
  ? Object.keys(value).flatMap((key) => [`${prefix}${key}`, ...keysOf(value[key], `${prefix}${key}.`)])
  : []);
const scripts = ['src/js/tool-kit.js', 'src/js/chart-kit.js', 'src/js/actions-store.js', 'src/js/media-store.js', 'src/js/spaghetti-diagram.js'];
const load = (lang = 'en', body = '') => {
  const dom = new JSDOM(`<html lang="${lang}"><body>${body}</body></html>`, { url: `https://example.test/${lang === 'en' ? '' : `${lang}/`}tools/spaghetti-diagram/`, runScripts: 'outside-only' });
  dom.window.matchMedia = () => ({ matches: true, addEventListener() {}, removeEventListener() {} });
  dom.window.HTMLElement.prototype.scrollIntoView = () => {};
  for (const file of scripts) dom.window.eval(fs.readFileSync(file, 'utf8'));
  return dom.window;
};
const exampleResults = (M, example) => {
  const state = M.fromExample(example);
  const options = { plan: state.plan, speed: state.speed, shift: state.shift };
  return { state, now: M.analyse(state.current, options), next: M.analyse(state.after, options) };
};
const P = (x, y, stop = '') => ({ x, y, stop });

test('the scale comes from two points and the real distance between them; the grid is in metres', () => {
  const { SpaghettiMath: M } = load();
  assert.equal(M.scaleFrom(P(0, 0), P(100, 0), 10), 0.1);
  near(M.scaleFrom(P(0, 0), P(30, 40), '5'), 0.1);
  assert.equal(M.scaleFrom(P(0, 0), P(0, 0), 10), null, 'two taps on the same spot set nothing');
  assert.equal(M.scaleFrom(P(0, 0), P(10, 0), 0), null);
  assert.equal(M.planScale({ kind: 'grid' }), 1);
  assert.equal(M.planScale({ kind: 'image', imageW: 1000, imageH: 600 }), null, 'an image needs its scale');
  assert.equal(M.planScale({ kind: 'image', cal: { ax: 100, ay: 50, bx: 300, by: 50, metres: '10' } }), 0.05);
  assert.deepEqual(plain(M.extent({ kind: 'grid', gridW: '30', gridH: '' })), { w: 30, h: 14 });
  assert.deepEqual(plain(M.extent({ kind: 'image', imageW: 1280, imageH: 720 })), { w: 1280, h: 720 });
  assert.deepEqual(plain(M.extent({ kind: 'grid', gridW: '0.5', gridH: '9999' })), { w: 2, h: 500 });
});

test('path lengths, cycles and walking time', () => {
  const { SpaghettiMath: M } = load();
  const points = [P(0, 0), P(3, 4), P(3, 10)];
  assert.equal(M.pathUnits(points), 11);
  near(M.pathLength(points, 0.1), 1.1);
  assert.equal(M.pathLength(points, null), null);
  assert.equal(M.pathUnits([P(1, 1)]), 0);
  assert.equal(M.cyclesOf({ cycles: '3' }), 3);
  assert.equal(M.cyclesOf({ cycles: '' }), 1);
  assert.equal(M.cyclesOf({ cycles: '0' }), 1, 'a walk is at least one cycle');
  assert.equal(M.walkingSeconds(12, 1.2), 10);
  const study = { walks: [
    { name: 'A', cycles: '2', points: [P(0, 0), P(10, 0), P(10, 10)] },
    { name: 'B', cycles: '1', points: [P(0, 0), P(0, 10)] },
    { name: 'C', cycles: '5', points: [P(4, 4)] },
  ] };
  const result = M.analyse(study, { plan: { kind: 'grid', gridW: 20, gridH: 20 }, speed: '1', shift: '100' });
  assert.equal(result.metres, 30);
  assert.equal(result.cycles, 3, 'a walk of one point counts no cycles');
  assert.equal(result.drawn, 2);
  assert.equal(result.perCycle, 10);
  assert.equal(result.secondsPerCycle, 10);
  assert.equal(result.perShift, 1000);
  near(result.minutesPerShift, 1000 / 60);
  assert.deepEqual(plain(result.walks.map((w) => [w.metres, w.perCycle])), [[20, 10], [10, 10], [0, 0]]);
  const noScale = M.analyse(study, { plan: { kind: 'image', imageW: 800, imageH: 600 }, shift: '100' });
  assert.equal(noScale.metres, null);
  assert.equal(noScale.perShift, null);
  assert.equal(noScale.speed, 1.2, 'the default walking speed');
  assert.equal(M.analyse(study, { plan: {}, speed: '-3' }).speed, 1.2);
});

test('visits per stop, where the work happens and the legs between the stops', () => {
  const { SpaghettiMath: M } = load();
  const walks = [
    { points: [P(0, 0, 'Bench'), P(10, 0, 'Printer'), P(0, 0, 'bench '), P(0, 5, 'Cage'), P(0, 0, 'Bench')] },
    { points: [P(0, 0, 'Bench'), P(5, 0), P(10, 0, 'Printer'), P(0, 0, 'Bench')] },
  ];
  assert.deepEqual(plain(M.visits(walks).map((s) => [s.label, s.visits])), [['Bench', 5], ['Printer', 2], ['Cage', 1]], 'names match whatever the case');
  assert.deepEqual(plain(M.visits([{ points: [P(0, 0, 'Zone'), P(1, 0, 'Area')] }]).map((s) => s.label)), ['Zone', 'Area'], 'equal visits keep the walking order');
  assert.equal(M.topStopOf([{ key: 'a', visits: 2 }, { key: 'b', visits: 2 }], null, [{ key: 'a|x', units: 3 }, { key: 'b|x', units: 9 }]).key, 'b');
  assert.equal(M.baseStop(walks).label, 'Bench');
  assert.equal(M.baseStop([{ points: [P(0, 0), P(1, 1)] }]), null);
  const legs = M.legsOf(walks, 0.5);
  const printer = legs.find((leg) => leg.key === 'bench|printer');
  assert.equal(printer.count, 4, 'there and back is the same leg');
  assert.equal(printer.units, 40);
  assert.equal(printer.metres, 20);
  assert.equal(printer.each, 5);
  const cage = legs.find((leg) => leg.key === 'bench|cage');
  assert.equal(cage.count, 2);
  assert.equal(M.longestLeg(legs).key, 'bench|printer');
  assert.equal(M.longestLeg(legs).repeated, true);
  // A walk without stops is one leg of its own, never repeated.
  const lone = M.legsOf([{ points: [P(0, 0), P(3, 4)] }, { points: [P(0, 0), P(6, 8)] }]);
  assert.equal(lone.length, 2);
  assert.equal(M.longestLeg(lone).repeated, false);
  assert.equal(M.longestLeg(lone).units, 10);
  assert.equal(M.longestLeg([]), null);
  const result = M.analyse({ walks }, { plan: { kind: 'grid' } });
  assert.equal(result.base.label, 'Bench');
  assert.equal(result.topStop.label, 'Printer', 'the top stop is the most visited one away from where the work happens');
  assert.equal(result.stops.find((s) => s.label === 'Printer').perCycle, 1);
});

test('the heat grid holds the metres walked in each square, cut exactly at the borders', () => {
  const { SpaghettiMath: M } = load();
  const straight = M.heatGrid([{ points: [P(0.5, 0.5), P(2.5, 0.5)] }], { w: 4, h: 2, cell: 1 });
  assert.equal(straight.cols, 4);
  assert.equal(straight.rows, 2);
  assert.deepEqual(plain(straight.cells), [0.5, 1, 0.5, 0, 0, 0, 0, 0]);
  assert.equal(straight.max, 1);
  // A diagonal: the total stays the length of the path, whatever squares it crosses; the scale turns units into metres.
  const diagonal = M.heatGrid([{ points: [P(0, 0), P(30, 40)] }, { points: [P(0, 40), P(30, 0)] }], { w: 30, h: 40, cell: 10, scale: 0.1 });
  near(diagonal.total, 10);
  assert.equal(diagonal.cols, 3);
  assert.equal(diagonal.rows, 4);
  assert.ok(diagonal.cells.every((value) => value >= 0));
  // Where the two paths cross, the square holds both.
  const crossing = M.heatGrid([{ points: [P(0, 1.5), P(3, 1.5)] }, { points: [P(1.5, 0), P(1.5, 3)] }], { w: 3, h: 3, cell: 1 });
  assert.equal(crossing.cells[4], 2);
  assert.deepEqual(plain(crossing.hottest[0]), { col: 1, row: 1, value: 2 });
  // A point on the far border stays in the last square.
  const edge = M.heatGrid([{ points: [P(2, 0), P(2, 2)] }], { w: 2, h: 2, cell: 1 });
  near(edge.total, 2);
  assert.equal(edge.cells[1] + edge.cells[3], 2);
  assert.equal(M.heatCell(20), 1);
  assert.equal(M.heatCell(60), 2.5);
  assert.equal(M.heatCell(8), 0.5);
});

test('the example: about 38 m per cycle at the packing station, about 14 m after the printer moved', () => {
  const { SpaghettiMath: M } = load();
  const { state, now, next } = exampleResults(M, read('en').example);
  assert.equal(state.current.walks.length, 6);
  assert.equal(state.after.walks.length, 6);
  assert.equal(now.cycles, 6);
  near(now.perCycle, 38.411, 0.01);
  near(next.perCycle, 14.002, 0.01);
  assert.equal(now.stops.find((s) => s.label === 'Label printer').visits, 6);
  assert.equal(now.stops.find((s) => s.label === 'Tape').visits, 3);
  assert.equal(now.base.label, 'Packing bench');
  assert.equal(now.topStop.label, 'Label printer', 'six visits like the cage, but its legs carry more metres');
  assert.equal(now.stops.find((s) => s.label === 'Outbound cage').visits, 6);
  assert.equal(now.longest.key, 'label printer|packing bench');
  assert.equal(now.longest.count, 12);
  const diff = M.compare(now, next);
  near(diff.perCycle, 38.411 - 14.002, 0.01);
  near(diff.share, (38.411 - 14.002) / 38.411, 0.001);
  near(diff.metresPerShift, (38.411 - 14.002) * 180, 1);
  near(diff.minutesPerShift, ((38.411 - 14.002) * 180) / 1.2 / 60, 0.05);
  assert.equal(M.compare(now, M.analyse({ walks: [] }, { plan: state.plan })), null);
  // The busiest square is the bench, where every walk starts and ends.
  const heat = M.heatGrid(state.current.walks, { ...M.extent(state.plan), cell: 1 });
  near(heat.total, now.metres, 1e-6);
  assert.ok(heat.hottest[0].col >= 5 && heat.hottest[0].col <= 6 && heat.hottest[0].row >= 6 && heat.hottest[0].row <= 7, JSON.stringify(heat.hottest[0]));
});

test('saved junk is cleaned, the plan can change size, and a tap near a stop snaps to it', () => {
  const { SpaghettiMath: M } = load();
  const walk = M.cleanWalk({ id: 'w1', name: 7, cycles: 2, color: 3, points: [[1, 2, 'Bin'], { x: 'a', y: 1 }, null, { x: 3.14159, y: 2, stop: 9 }] });
  assert.deepEqual(plain(walk), { id: 'w1', name: '', cycles: '2', color: 3, points: [{ x: 1, y: 2, stop: 'Bin' }, { x: 3.142, y: 2, stop: '' }] });
  assert.deepEqual(plain(M.cleanStudy('broken')), { walks: [], change: '' });
  assert.equal(M.cleanStudy({ walks: Array.from({ length: 20 }, () => ({})) }).walks.length, 12);
  assert.deepEqual(plain(M.cleanPlan({ kind: 'image' })), { kind: 'grid', gridW: '20', gridH: '14', imageId: '', imageW: 0, imageH: 0, cal: null }, 'an image without its id falls back to the grid');
  const image = M.cleanPlan({ kind: 'image', imageId: 'abc', imageW: 1280, imageH: 720, cal: { ax: 0, ay: 0, bx: 128, by: 0, metres: 10 } });
  assert.equal(image.kind, 'image');
  assert.equal(M.planScale(image), 10 / 128);
  assert.equal(M.cleanPlan({ kind: 'image', imageId: 'abc', imageW: 10, imageH: 10, cal: { ax: 'x' } }).cal, null);
  const studies = [{ walks: [{ points: [P(10, 7, 'Bench')] }] }];
  M.rescale(studies, { w: 20, h: 14 }, { w: 1000, h: 700 });
  assert.deepEqual(plain(studies[0].walks[0].points), [{ x: 500, y: 350, stop: 'Bench' }]);
  const walks = [{ points: [P(0, 0, 'Bench'), P(10, 0)] }];
  assert.deepEqual(plain(M.snapStop(walks, P(0.3, 0.4), 1)), { x: 0, y: 0, stop: 'Bench' });
  assert.equal(M.snapStop(walks, P(9.9, 0), 1), null, 'only stops attract a tap');
  assert.equal(M.snapStop(walks, P(3, 0), 1), null);
});

test('the page opens on the example: the plan with six paths, the stops, the charts, before and after and the hand-offs; taps draw a walk', async () => {
  const nunjucks = require('nunjucks');
  const { localUrl } = await import('../lib/translations.js');
  const env = new nunjucks.Environment(new nunjucks.FileSystemLoader(['src/_includes']), { autoescape: false });
  env.addFilter('t', (value) => value);
  env.addFilter('local', (url, lang) => localUrl(url, lang));
  env.addFilter('assetUrl', (url) => url);
  env.addFilter('scriptJson', (value) => JSON.stringify(value).replace(/</g, '\\u003c'));
  const html = env.render('partials/spaghetti-diagram.njk', { cfg: read('en'), lang: undefined }).replace(/<script src=[^>]*><\/script>/g, '');
  const window = load('en', html);
  const doc = window.document;
  const results = doc.querySelector('[data-results]');
  assert.equal(results.hidden, false);
  assert.ok(!doc.querySelector('.dl-example-note').hidden, 'the example note shows');
  assert.match(results.querySelector('h2').textContent, /24[.,]4 m/, 'the headline is the saving per cycle');
  assert.match(results.querySelector('h2').textContent, /61 min/);
  const plan = results.querySelector('.sp2-result-plan svg');
  assert.equal(plan.querySelectorAll('polyline[stroke-opacity]').length, 6, 'six walks drawn');
  assert.match(plan.textContent, /Label printer · 6×/);
  assert.ok(plan.querySelectorAll('[data-tip]').length >= 6 + 4);
  assert.equal(results.querySelectorAll('.ck-figure').length, 4, 'plan, heat grid, metres per walk, before and after');
  assert.match(results.textContent, /38[.,]4 m/);
  assert.match(results.querySelector('.dl-focus h3').textContent, /Packing bench ↔ Label printer/);
  const action = [...results.querySelectorAll('a')].find((a) => a.textContent === 'Add the change to the actions');
  action.dispatchEvent(new window.MouseEvent('click', { bubbles: true, cancelable: true }));
  const url = new URL(action.href);
  assert.equal(url.pathname, '/tools/action-tracker/');
  assert.equal(url.searchParams.get('source'), 'spaghetti-diagram');
  assert.equal(url.searchParams.get('action'), 'Label printer and tape moved onto the packing bench');
  assert.equal(new URL([...results.querySelectorAll('a')].find((a) => a.textContent === 'Take to the Kaizen Board').href).pathname, '/tools/kaizen-board/');
  assert.equal(new URL([...results.querySelectorAll('a')].find((a) => a.textContent === 'Time it with the Time Study').href).pathname, '/tools/time-study/');
  // The current study is drawn on the canvas: six walks in the list.
  assert.equal(doc.querySelectorAll('.sp2-walk').length, 6);
  // Taps on the plan draw a new walk; a tap near a stop snaps to it.
  const tap = (x, y) => {
    const svg = doc.querySelector('[data-canvas] svg');
    svg.getBoundingClientRect = () => ({ left: 0, top: 0, width: 800, height: 560 });
    svg.dispatchEvent(new window.MouseEvent('pointerdown', { bubbles: true, clientX: x, clientY: y }));
    svg.dispatchEvent(new window.MouseEvent('pointerup', { bubbles: true, clientX: x, clientY: y }));
  };
  doc.querySelector('[data-new-walk]').click();
  assert.equal(doc.querySelectorAll('.sp2-walk').length, 7);
  tap(242, 278); // near the bench at 6 m, 7 m (40 px per metre)
  tap(400, 280);
  tap(400, 400);
  const saved = JSON.parse(window.localStorage.getItem('sc-spaghetti-diagram'));
  const drawn = saved.current.walks.at(-1).points;
  assert.equal(drawn.length, 3);
  assert.deepEqual(drawn[0], { x: 6, y: 7, stop: 'Packing bench' }, 'the first tap snapped to the bench');
  near(drawn[1].x, 10);
  near(drawn[2].y, 10);
  assert.equal(saved.example, false, 'own work ends the example');
  doc.querySelector('[data-undo]').click();
  assert.equal(JSON.parse(window.localStorage.getItem('sc-spaghetti-diagram')).current.walks.at(-1).points.length, 2);
  // The points table edits the walk in metres.
  const x = doc.querySelector('[data-points] [data-field="x"][data-i="1"]');
  x.value = '12';
  x.dispatchEvent(new window.Event('input', { bubbles: true }));
  assert.equal(JSON.parse(window.localStorage.getItem('sc-spaghetti-diagram')).current.walks.at(-1).points[1].x, 12);
  // The after study.
  doc.querySelector('[data-study="after"]').click();
  assert.equal(doc.querySelector('[data-change-field]').hidden, false);
  assert.equal(doc.querySelectorAll('.sp2-walk').length, 6);
  window.close();
});

test('the data files share one shape, each language keeps its own saved work, and the example loads', () => {
  const en = read('en');
  assert.equal(en.storageKey, 'sc-spaghetti-diagram');
  const coordinates = (walks) => walks.map((w) => w.points.map((p) => [p[0], p[1], p.length > 2]));
  for (const lang of ['de', 'sq']) {
    const other = read(lang);
    assert.equal(other.storageKey, `sc-spaghetti-diagram-${lang}`);
    assert.deepEqual(keysOf(other).sort(), keysOf(en).sort(), `${lang}: keys`);
    assert.equal(other.tips.length, en.tips.length);
    assert.equal(other.advice.leg.moves.length, en.advice.leg.moves.length);
    assert.deepEqual(coordinates(other.example.current), coordinates(en.example.current), `${lang}: the example's points`);
    assert.deepEqual(coordinates(other.example.after), coordinates(en.example.after));
    const { SpaghettiMath: M } = load(lang);
    const { now, next } = exampleResults(M, other.example);
    near(now.perCycle, 38.411, 0.01);
    near(next.perCycle, 14.002, 0.01);
    assert.equal(now.topStop.label, other.example.current[0].points[2][2], `${lang}: the label printer is the top stop`);
    assert.equal(now.topStop.visits, 6);
    assert.equal(now.longest.count, 12);
  }
  assert.match(JSON.stringify(read('sq')), /[ëç]/);
  assert.match(JSON.stringify(read('de')), /Sie /);
});

test('every text of the page and the script has a German and an Albanian translation', () => {
  const parts = JSON.parse(fs.readFileSync('src/_data/i18n-parts/spaghetti-diagram.json', 'utf8'));
  const partial = fs.readFileSync('src/_includes/partials/spaghetti-diagram.njk', 'utf8');
  const script = fs.readFileSync('src/js/spaghetti-diagram.js', 'utf8');
  const texts = new Set();
  for (const match of partial.matchAll(/(["'])((?:(?!\1).)+)\1 \| t\(lang\)/g)) texts.add(match[2]);
  for (const match of script.matchAll(/\btx\(\s*(["'])((?:\\.|(?!\1).)+)\1/g)) texts.add(match[2].replace(/\\(["'])/g, '$1'));
  const ui = { de: JSON.parse(fs.readFileSync('src/_data/de/ui.json', 'utf8')), sq: JSON.parse(fs.readFileSync('src/_data/sq/ui.json', 'utf8')) };
  for (const lang of ['de', 'sq']) {
    for (const text of texts) assert.ok(parts[lang][text] || ui[lang][text], `${lang}: ${text}`);
    for (const [text, translation] of Object.entries(parts[lang])) {
      assert.ok(translation && translation !== text, `${lang}: "${text}" is not translated`);
      for (const name of text.match(/\{\w+\}/g) || []) assert.ok(translation.includes(name), `${lang}: "${text}" loses ${name}`);
    }
  }
  const cards = JSON.parse(fs.readFileSync('src/_data/i18n-parts/spaghetti-diagram.cards.json', 'utf8'));
  assert.equal(cards.family, 'lumen');
  assert.deepEqual(Object.keys(cards.cards), ['en', 'de', 'sq']);
  assert.equal(cards.cards.en.url, '/tools/spaghetti-diagram/');
  assert.equal(cards.cards.de.url, '/de/tools/spaghetti-diagram/');
  assert.equal(cards.cards.sq.url, '/sq/tools/spaghetti-diagram/');
  assert.equal(cards.cards.en.type, 'Lean');
  assert.equal(cards.cards.en.time, '15 min');
});
