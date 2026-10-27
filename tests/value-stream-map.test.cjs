// Value Stream Map (src/js/value-stream-map.js): the arithmetic in window.VsmMath (takt, inventories as time, lead
// time, PCE, rolled yield, effective cycle time, bottleneck, capacity, reordering), the page on its example, and the
// data files in the three languages.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const { JSDOM } = require('jsdom');

const plain = (value) => JSON.parse(JSON.stringify(value));
const near = (a, b, eps = 1e-6) => assert.ok(Math.abs(a - b) < eps, `${a} ≈ ${b}`);
const read = (lang) => JSON.parse(fs.readFileSync(`src/_data/${lang === 'en' ? '' : `${lang}/`}valueStreamMap.json`, 'utf8'));
const keysOf = (value, prefix = '') => (value && typeof value === 'object' && !Array.isArray(value)
  ? Object.keys(value).flatMap((key) => [`${prefix}${key}`, ...keysOf(value[key], `${prefix}${key}.`)])
  : []);
const scripts = ['src/js/tool-kit.js', 'src/js/chart-kit.js', 'src/js/actions-store.js', 'src/js/value-stream-map.js'];
const load = (lang = 'en', body = '') => {
  const dom = new JSDOM(`<html lang="${lang}"><body>${body}</body></html>`, { url: `https://example.test/${lang === 'en' ? '' : `${lang}/`}tools/value-stream-map/`, runScripts: 'outside-only' });
  dom.window.matchMedia = () => ({ matches: true, addEventListener() {}, removeEventListener() {} });
  for (const file of scripts) dom.window.eval(fs.readFileSync(file, 'utf8'));
  return dom.window;
};
const exampleResults = (VsmMath, example) => {
  const state = VsmMath.fromExample(example);
  const run = (map) => VsmMath.analyse({ demand: state.demand, minutes: state.minutes, steps: map.steps, finished: map.finished });
  return { state, now: run(state.current), next: run(state.future) };
};

test('takt, inventory time and effective cycle time', () => {
  const { VsmMath } = load();
  assert.equal(VsmMath.takt(900, 4800), 11.25);
  assert.equal(VsmMath.takt(0, 4800), null);
  assert.equal(VsmMath.takt(900, 0), null);
  // pieces / demand × working minutes
  assert.equal(VsmMath.inventoryTime(1400, 4800, 900), 262.5);
  assert.equal(VsmMath.inventoryTime(4800, 4800, 900), 900, 'one day of demand is one working day');
  assert.equal(VsmMath.inventoryTime(100, 0, 900), 0);
  assert.equal(VsmMath.effectiveCt(48, 4), 12);
  assert.equal(VsmMath.effectiveCt(16, 0), 16, 'a step without an operator runs at its CT');
  assert.equal(VsmMath.taktGap({ ct: 48, operators: 4 }, 11.25), 0.75);
  assert.equal(VsmMath.taktGap({ ct: 48, operators: 4 }, null), null);
});

test('blank fields take the values that change nothing', () => {
  const { VsmMath } = load();
  assert.deepEqual(plain(VsmMath.stepNumbers({ name: ' Pack ', ct: '30' })), { name: 'Pack', operators: 1, ct: 30, co: 0, uptime: 100, batch: 1, fpy: 100, shifts: 1, inv: 0, va: false, kaizen: '' });
  assert.equal(VsmMath.stepNumbers({ uptime: '140', fpy: '-3', batch: '0' }).uptime, 100);
  assert.equal(VsmMath.stepNumbers({ fpy: '-3' }).fpy, 0);
  assert.equal(VsmMath.stepNumbers({ batch: '0' }).batch, 1);
  assert.equal(VsmMath.stepNumbers({ ct: 'abc' }).ct, 0);
});

test('process time, value-added time, PCE, rolled yield, capacity and bottleneck', () => {
  const { VsmMath } = load();
  const steps = [
    { name: 'A', ct: 10, operators: 1, va: true, fpy: 90, inv: 100 },
    { name: 'B', ct: 30, operators: 2, va: false, fpy: 80, inv: 200 },
    { name: 'C', ct: 12, operators: 1, va: true, uptime: 50, co: 10, batch: 60 },
  ];
  assert.equal(VsmMath.processTime(steps), 52);
  assert.equal(VsmMath.valueAddedTime(steps), 22);
  near(VsmMath.rolledYield(steps), 0.72);
  assert.equal(VsmMath.rolledYield([]), null);
  assert.equal(VsmMath.bottleneck(steps), 1, 'B releases a piece every 15 s');
  assert.equal(VsmMath.bottleneck([{ ct: '' }]), -1);
  // C: 600 min × 50 % = 18 000 s; per piece 12 s + 600 s / 60 = 22 s.
  near(VsmMath.capacity(steps[2], 600), 18000 / 22);
  assert.equal(VsmMath.capacity({ ct: 0 }, 600), null);
  assert.equal(VsmMath.pce(22, 0), null);
  // Demand 600 in 600 min: 100 pieces = 100 min, 200 pieces = 200 min.
  assert.equal(VsmMath.leadTime({ steps, finished: 60 }, 600, 600), (100 + 200 + 60) * 60 + 52);
  const result = VsmMath.analyse({ demand: '600', minutes: '600', steps, finished: '60' });
  assert.equal(result.takt, 60);
  assert.equal(result.lead, 360 * 60 + 52);
  near(result.pce, 22 / (360 * 60 + 52));
  assert.equal(result.pieces, 360);
  assert.equal(result.bottleneck.name, 'B');
  assert.deepEqual(plain(result.over), []);
  assert.deepEqual(plain(result.ladder.map((part) => [part.kind, part.seconds])), [['wait', 6000], ['process', 10], ['wait', 12000], ['process', 30], ['wait', 0], ['process', 12], ['wait', 3600]]);
  assert.equal(result.longestWait.step, 1);
  // C needs 600 × 22 s = 13 200 s of its 18 000 s.
  near(result.steps[2].utilisation, 600 / (18000 / 22));
});

test('the example: Pack above takt, Load overloaded by its changeovers, the future state cuts the lead time', () => {
  const { VsmMath } = load();
  const { state, now, next } = exampleResults(VsmMath, read('en').example);
  assert.equal(state.current.steps.length, 6);
  assert.equal(state.hasFuture, true);
  assert.equal(now.takt, 11.25);
  assert.deepEqual(plain(now.steps.map((s) => s.eff)), [8, 8, 9, 12, 7, 10]);
  assert.equal(now.bottleneck.name, 'Pack');
  assert.deepEqual(plain(now.over.map((s) => s.name)), ['Pack']);
  assert.deepEqual(plain(now.overloaded.map((s) => s.name)), ['Pack', 'Load']);
  assert.equal(now.process, 167);
  assert.equal(now.va, 109);
  near(now.wait, 984.375 * 60);
  near(now.lead, 984.375 * 60 + 167);
  near(now.pce, 109 / (984.375 * 60 + 167));
  near(now.yield, 0.996 * 0.992 * 0.99 * 0.985 * 0.998 * 0.997);
  assert.equal(now.pieces, 5250);
  assert.equal(now.longestWait.step, 5, 'the pile before Load');
  // Future: lower inventories, a fifth packer, a shorter trailer change.
  assert.deepEqual(plain(next.over), []);
  assert.deepEqual(plain(next.overloaded), []);
  near(next.lead, 431.25 * 60 + 163);
  const diff = VsmMath.compare(now, next);
  assert.ok(diff.leadShare > 0.55 && diff.leadShare < 0.57, `share ${diff.leadShare}`);
  assert.equal(diff.pieces, 2300 - 5250);
  assert.equal(state.future.steps.filter((s) => s.kaizen).length, 4);
});

test('steps move with their inventory, insert after a step, and saved junk is cleaned', () => {
  const { VsmMath } = load();
  const steps = ['a', 'b', 'c'].map((name, i) => VsmMath.cleanStep({ name, inv: i * 10 }));
  assert.deepEqual(plain(VsmMath.moveStep(steps, 2, -1).map((s) => [s.name, s.inv])), [['a', '0'], ['c', '20'], ['b', '10']]);
  assert.deepEqual(plain(VsmMath.moveStep(steps, 0, -1).map((s) => s.name)), ['a', 'b', 'c'], 'the first step cannot move up');
  assert.deepEqual(plain(VsmMath.insertStep(steps, 0).map((s) => s.name)), ['a', '', 'b', 'c']);
  assert.deepEqual(plain(VsmMath.insertStep(steps, 2).map((s) => s.name)), ['a', 'b', 'c', '']);
  const map = VsmMath.cleanMap({ steps: [null, 'x', { name: 7, ct: { a: 1 }, va: 'yes', kaizen: 'Fix' }], finished: 12 });
  assert.deepEqual(plain(map), { steps: [{ name: '', operators: '', ct: '', co: '', uptime: '', batch: '', fpy: '', shifts: '', inv: '', va: false, kaizen: 'Fix' }], finished: '12' });
  assert.deepEqual(plain(VsmMath.cleanMap('broken')), { steps: [], finished: '' });
  const template = VsmMath.fromTemplate(read('en').templates.find((t) => t.id === 'hotel'));
  assert.equal(template.steps.length, 6);
  assert.ok(template.steps.every((s) => s.inv === ''), 'templates leave the inventories to be counted');
});

test('the page opens on the example: the map with factories, triangles, ladder and totals, the charts and the hand-off', async () => {
  const nunjucks = require('nunjucks');
  const { localUrl } = await import('../lib/translations.js');
  const env = new nunjucks.Environment(new nunjucks.FileSystemLoader(['src/_includes']), { autoescape: false });
  env.addFilter('t', (value) => value);
  env.addFilter('local', (url, lang) => localUrl(url, lang));
  env.addFilter('assetUrl', (url) => url);
  env.addFilter('scriptJson', (value) => JSON.stringify(value).replace(/</g, '\\u003c'));
  const html = env.render('partials/value-stream-map.njk', { cfg: read('en'), lang: undefined }).replace(/<script src=[^>]*><\/script>/g, '');
  const window = load('en', html);
  const results = window.document.querySelector('[data-results]');
  assert.equal(results.hidden, false);
  const map = results.querySelector('.vs-map svg');
  assert.ok(map, 'the map is drawn');
  assert.equal(map.querySelectorAll('path[d*="V62"]').length, 2, 'supplier and customer factories');
  assert.equal(map.querySelectorAll('polygon[points*=",74 "]').length, 6, 'six inventory triangles');
  assert.ok(map.querySelectorAll('[data-tip]').length >= 6 + 6 + 2 + 1);
  assert.match(map.textContent, /Lead time/);
  assert.match(map.textContent, /Pack/);
  assert.ok(Number(map.getAttribute('viewBox').split(' ')[2]) > 1500, 'the map grows with its steps');
  assert.equal(results.querySelectorAll('.ck-figure').length, 4, 'map, cycle times, lead time by step, comparison');
  assert.match(results.querySelector('h2').textContent, /16[.,]5 h/);
  assert.ok(!window.document.querySelector('.dl-example-note').hidden, 'the example note shows');
  // The current state has no starbursts; the future state shows them and can send them to the tracker.
  assert.equal(map.querySelectorAll('polygon[points]').length, 6 + 7, 'six triangles and seven push-arrow heads, no starburst');
  window.document.querySelector('[data-view="future"]').click();
  const future = window.document.querySelector('.vs-map svg');
  assert.equal([...future.querySelectorAll('[data-tip]')].filter((node) => /^Kaizen burst ·/.test(node.getAttribute('data-tip'))).length, 4);
  assert.equal(window.document.querySelectorAll('.vs-kaizen').length, 6);
  const send = [...window.document.querySelectorAll('button')].find((b) => b.textContent === 'Send kaizen bursts to the Action Tracker');
  send.click();
  // From the example, the actions arrive as the example's (ActionsStore: example: true); no other tool counts them.
  assert.equal(window.ActionsStore.list().length, 0);
  const actions = window.ActionsStore.all();
  assert.ok(actions.every((a) => a.example === true));
  assert.equal(actions.length, 4);
  assert.ok(actions.every((a) => a.source === 'value-stream-map'));
  assert.equal(actions.find((a) => a.area === 'Pack').priority, 'High');
  send.click();
  assert.equal(window.ActionsStore.all().length, 4, 'the same open bursts are not added twice');
  // Moving and removing a step, with undo.
  window.document.querySelector('[data-view="current"]').click();
  window.document.querySelector('[data-act="down"][data-i="0"]').click();
  assert.equal(window.document.querySelector('[data-field="name"][data-i="1"]').value, 'Receive');
  window.document.querySelector('[data-act="remove"][data-i="1"]').click();
  assert.equal(window.document.querySelectorAll('.vs-step').length, 5);
  window.document.querySelector('[data-step-status] .dl-undo').click();
  assert.equal(window.document.querySelectorAll('.vs-step').length, 6);
  assert.equal(window.document.querySelector('[data-field="name"][data-i="1"]').value, 'Receive');
  window.close();
});

test('the data files share one shape, each language keeps its own saved work, and the example loads', () => {
  const en = read('en');
  assert.equal(en.storageKey, 'sc-value-stream-map');
  for (const lang of ['de', 'sq']) {
    const other = read(lang);
    assert.equal(other.storageKey, `sc-value-stream-map-${lang}`);
    assert.deepEqual(keysOf(other).sort(), keysOf(en).sort(), `${lang}: keys`);
    assert.equal(other.tips.length, en.tips.length);
    assert.deepEqual(other.templates.map((t) => t.id), en.templates.map((t) => t.id));
    const numbers = (map) => map.steps.map((s) => [s.operators, s.ct, s.co, s.uptime, s.batch, s.fpy, s.shifts, s.va, s.inv]);
    assert.deepEqual(numbers(other.example.current), numbers(en.example.current), `${lang}: the example's numbers`);
    assert.deepEqual(numbers(other.example.future), numbers(en.example.future));
    const { VsmMath } = load(lang);
    const { now, next } = exampleResults(VsmMath, other.example);
    assert.equal(now.over.length, 1, `${lang}: one step above takt`);
    near(now.lead, 984.375 * 60 + 167);
    near(next.lead, 431.25 * 60 + 163);
  }
  assert.match(JSON.stringify(read('sq')), /[ëç]/);
  assert.match(JSON.stringify(read('de')), /Sie /);
});

test('every text of the page and the script has a German and an Albanian translation', () => {
  const parts = JSON.parse(fs.readFileSync('src/_data/i18n-parts/value-stream-map.json', 'utf8'));
  const partial = fs.readFileSync('src/_includes/partials/value-stream-map.njk', 'utf8');
  const script = fs.readFileSync('src/js/value-stream-map.js', 'utf8');
  const texts = new Set();
  for (const match of partial.matchAll(/(["'])((?:(?!\1).)+)\1 \| t\(lang\)/g)) texts.add(match[2]);
  for (const match of script.matchAll(/\btx\(\s*(["'])((?:\\.|(?!\1).)+)\1/g)) texts.add(match[2].replace(/\\(["'])/g, '$1'));
  const ui = { de: JSON.parse(fs.readFileSync('src/_data/de/ui.json', 'utf8')), sq: JSON.parse(fs.readFileSync('src/_data/sq/ui.json', 'utf8')) };
  for (const lang of ['de', 'sq']) {
    for (const text of texts) assert.ok(parts[lang][text] || ui[lang][text], `${lang}: ${text}`);
    for (const [text, translation] of Object.entries(parts[lang])) {
      // Abbreviations and a few words are the same in the other language.
      assert.ok((translation && translation !== text) || /^(CT|C\/O|CT\/op|FPY|FPY %|CT \(s\)|C\/O \(min\)|Takt|\{n\} min)$/.test(text), `${lang}: "${text}" is not translated`);
      for (const name of text.match(/\{\w+\}/g) || []) assert.ok(translation.includes(name), `${lang}: "${text}" loses ${name}`);
    }
  }
  const cards = JSON.parse(fs.readFileSync('src/_data/i18n-parts/value-stream-map.cards.json', 'utf8'));
  assert.equal(cards.family, 'lumen');
  assert.deepEqual(Object.keys(cards.cards), ['en', 'de', 'sq']);
  assert.equal(cards.cards.sq.url, '/sq/tools/value-stream-map/');
});
