// Time Study (src/js/time-study.js): the arithmetic in window.TimeStudyMath (takt, element statistics, the
// balancing moves, pasted rows) and the data files in the three languages.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const { JSDOM } = require('jsdom');

const plain = (value) => JSON.parse(JSON.stringify(value));
const load = (lang = 'en') => {
  const dom = new JSDOM(`<html lang="${lang}"><body></body></html>`, { url: `https://example.test/${lang === 'en' ? '' : `${lang}/`}tools/time-study/`, runScripts: 'outside-only' });
  dom.window.eval(fs.readFileSync('src/js/tool-kit.js', 'utf8'));
  dom.window.eval(fs.readFileSync('src/js/chart-kit.js', 'utf8'));
  dom.window.eval(fs.readFileSync('src/js/time-study.js', 'utf8'));
  return dom.window;
};
const read = (lang) => JSON.parse(fs.readFileSync(`src/_data/${lang === 'en' ? '' : `${lang}/`}timeStudy.json`, 'utf8'));
const keysOf = (value, prefix = '') => (value && typeof value === 'object' && !Array.isArray(value)
  ? Object.keys(value).flatMap((key) => [`${prefix}${key}`, ...keysOf(value[key], `${prefix}${key}.`)])
  : []);

test('takt is the available seconds over the demand', () => {
  const { TimeStudyMath } = load();
  assert.equal(TimeStudyMath.takt(432 * 60, 540), 48);
  assert.equal(TimeStudyMath.takt(0, 540), null);
  assert.equal(TimeStudyMath.takt(1000, 0), null);
  assert.equal(TimeStudyMath.takt(NaN, 10), null);
});

test('element statistics: the median holds, the outlier is flagged beyond 1.5 IQR', () => {
  const { TimeStudyMath } = load();
  const st = TimeStudyMath.stats([6.1, 5.8, 6.4, 6.0, 9.8]);
  assert.equal(st.n, 5);
  assert.equal(st.median, 6.1);
  assert.equal(st.min, 5.8);
  assert.equal(st.max, 9.8);
  assert.ok(Math.abs(st.mean - 6.82) < 1e-9);
  assert.deepEqual(st.outliers, [9.8]);
  assert.ok(st.cv > 0.2 && st.cv < 0.3, `cv ${st.cv}`);
  assert.equal(TimeStudyMath.median([3, 1, 2]), 2);
  assert.equal(TimeStudyMath.median([1, 2, 3, 4]), 2.5);
  assert.equal(TimeStudyMath.median([]), null);
  assert.deepEqual(plain(TimeStudyMath.stats([])).n, 0);
  assert.deepEqual(plain(TimeStudyMath.stats([7]).outliers), []);
});

test('the example: three stations, takt 48 s, Pack above takt, one move that keeps the order', () => {
  const { TimeStudyMath } = load();
  const example = TimeStudyMath.fromExample(read('en').example);
  assert.equal(example.stations.length, 3);
  assert.equal(example.stations.flatMap((s) => s.elements).length, 10);
  assert.equal(example.rows.length, 50, '10 elements × 5 cycles');
  assert.equal(example.stations.flatMap((s) => s.elements).filter((e) => e.type === 'W').length, 2);
  const takt = TimeStudyMath.takt(Number(example.available) * 60, Number(example.demand));
  assert.equal(takt, 48);
  const result = TimeStudyMath.analyse({ stations: example.stations, rows: example.rows, takt });
  assert.deepEqual(plain(result.stations.map((s) => Math.round(s.total * 10) / 10)), [34.5, 49.9, 21.7]);
  assert.equal(result.bottleneck.name, 'Pack');
  assert.deepEqual(plain(result.over.map((s) => s.name)), ['Pack']);
  assert.equal(result.operators, 3, 'ceil(106.1 / 48)');
  assert.ok(Math.abs(result.efficiency - 106.1 / (3 * 49.9)) < 1e-9);
  assert.deepEqual(plain(result.cycles), { min: 5, max: 5 });
  assert.equal(result.outliers.length, 1);
  assert.equal(result.outliers[0].element, 'Fetch box');
  // Waste: Walk to shelf 7.2 + Search for tape 9.5 of 106.1.
  assert.ok(Math.abs(result.types.W - 16.7) < 1e-9);
  assert.ok(Math.abs(result.shares.W - 16.7 / 106.1) < 1e-9);
  // One move: the last element of Pack goes to the station after it, which has the most slack.
  assert.equal(result.moves.length, 1);
  assert.deepEqual(plain(result.moves[0]), { from: 1, to: 2, element: 'Seal box', seconds: 8.1, inOrder: true, fromTotal: 41.8, toTotal: 29.8 });
  // Whole cycles per station feed the box plot: five per station.
  assert.deepEqual(plain(result.stations.map((s) => s.cycleTotals.length)), [5, 5, 5]);
  assert.deepEqual(plain(result.unobserved), []);
});

test('balancing moves the edge element that faces the target, else the largest that fits, and stops when nothing fits', () => {
  const { TimeStudyMath } = load();
  const station = (name, ...medians) => ({ name, elements: medians.map((median, i) => ({ name: `${name}${i + 1}`, median })) });
  // Upstream target: the first element moves.
  let moves = plain(TimeStudyMath.balance([station('A', 5, 5), station('B', 9, 20, 30)], 50));
  assert.deepEqual(moves.map((m) => [m.element, m.to, m.inOrder]), [['B1', 0, true]]);
  // The edge element is too big for the slack; the largest that fits goes, out of order.
  moves = plain(TimeStudyMath.balance([station('A', 40), station('B', 12, 30, 9)], 50));
  assert.deepEqual(moves.map((m) => [m.element, m.to, m.inOrder]), [['B3', 0, false]]);
  // Nothing fits anywhere: no move, no endless loop.
  assert.deepEqual(plain(TimeStudyMath.balance([station('A', 45), station('B', 30, 30)], 50)), []);
  // Two stations over takt are both relieved, one after the other.
  moves = plain(TimeStudyMath.balance([station('A', 30, 22), station('B', 5), station('C', 12, 40)], 50));
  assert.deepEqual(moves.map((m) => [m.element, m.from, m.to, m.inOrder]), [['A2', 0, 1, true], ['C1', 2, 1, true]]);
  assert.deepEqual(plain(TimeStudyMath.balance([station('A', 60)], 50)), [], 'one station cannot be balanced');
  assert.deepEqual(plain(TimeStudyMath.balance([station('A', 60), station('B', 10)], null)), [], 'no takt, no moves');
});

test('pasted rows name the station and element by name, start of name or number', () => {
  const { TimeStudyMath } = load('de');
  const stations = TimeStudyMath.fromExample(read('de').example).stations;
  const { added, skipped } = TimeStudyMath.parseObservations('Station\tElement\tZyklus\tSekunden\nPacken\tKarton verschließen\t1\t8,1\n2\t4\t2\t8.3\npack\tklebe\t\t9\nNirgends\tx\t1\t5\nPacken\tKarton holen\t3\tabc', stations);
  assert.deepEqual(plain(added), [{ s: 1, e: 3, c: 1, t: 8.1 }, { s: 1, e: 3, c: 2, t: 8.3 }, { s: 1, e: 1, c: 1, t: 9 }]);
  assert.equal(skipped, 2, 'the header is not counted');
  assert.equal(TimeStudyMath.nextCycle(added, 1), 3);
  assert.equal(TimeStudyMath.nextCycle(added, 0), 1);
});

test('an unobserved element counts 0 s and is listed; fewer than three cycles show in the count', () => {
  const { TimeStudyMath } = load();
  const stations = [{ name: 'A', elements: [{ name: 'a1', type: 'VA' }, { name: 'a2', type: 'W' }] }, { name: 'B', elements: [{ name: 'b1', type: 'NVA' }] }];
  const rows = [{ s: 0, e: 0, c: 1, t: 10 }, { s: 0, e: 0, c: 2, t: 12 }, { s: 1, e: 0, c: 1, t: 5 }];
  const result = TimeStudyMath.analyse({ stations, rows, takt: 20 });
  assert.deepEqual(plain(result.unobserved), ['A · a2']);
  assert.deepEqual(plain(result.cycles), { min: 1, max: 2 });
  assert.equal(result.stations[0].total, 11);
  assert.deepEqual(plain(result.stations[0].cycleTotals), [], 'no whole cycle while an element is untimed');
  assert.equal(result.bottleneck.name, 'A');
  assert.equal(result.operators, 1);
  assert.deepEqual(plain(result.over), []);
});

test('the data files share one shape, each language keeps its own saved work, and the example loads', () => {
  const en = read('en');
  assert.equal(en.storageKey, 'sc-time-study');
  for (const lang of ['de', 'sq']) {
    const other = read(lang);
    assert.equal(other.storageKey, `sc-time-study-${lang}`);
    assert.deepEqual(keysOf(other).sort(), keysOf(en).sort(), `${lang}: keys`);
    assert.equal(other.tips.length, en.tips.length);
    assert.equal(other.advice.over.moves.length, en.advice.over.moves.length);
    assert.equal(other.example.demand, en.example.demand);
    assert.equal(other.example.available, en.example.available);
    assert.deepEqual(other.example.stations.map((s) => s.elements.map((e) => [e.type, e.times])), en.example.stations.map((s) => s.elements.map((e) => [e.type, e.times])), `${lang}: the example's numbers`);
    const { TimeStudyMath } = load(lang);
    const example = TimeStudyMath.fromExample(other.example);
    assert.equal(example.rows.length, 50);
    const result = TimeStudyMath.analyse({ stations: example.stations, rows: example.rows, takt: TimeStudyMath.takt(Number(example.available) * 60, Number(example.demand)) });
    assert.equal(result.over.length, 1, `${lang}: one station above takt`);
    assert.equal(result.moves.length, 1);
  }
  // Albanian uses its own letters; German addresses the reader formally.
  assert.match(JSON.stringify(read('sq')), /[ëç]/);
  assert.match(JSON.stringify(read('de')), /Sie /);
});

test('every text of the page and the script has a German and an Albanian translation in the parts file', () => {
  const parts = JSON.parse(fs.readFileSync('src/_data/i18n-parts/time-study.json', 'utf8'));
  const partial = fs.readFileSync('src/_includes/partials/time-study.njk', 'utf8');
  const script = fs.readFileSync('src/js/time-study.js', 'utf8');
  const texts = new Set();
  for (const match of partial.matchAll(/(["'])((?:(?!\1).)+)\1 \| t\(lang\)/g)) texts.add(match[2]);
  for (const match of script.matchAll(/\btx\(\s*(["'])((?:\\.|(?!\1).)+)\1/g)) texts.add(match[2].replace(/\\(["'])/g, '$1'));
  const ui = { de: JSON.parse(fs.readFileSync('src/_data/de/ui.json', 'utf8')), sq: JSON.parse(fs.readFileSync('src/_data/sq/ui.json', 'utf8')) };
  for (const lang of ['de', 'sq']) {
    for (const text of texts) assert.ok(parts[lang][text] || ui[lang][text], `${lang}: ${text}`);
    for (const [text, translation] of Object.entries(parts[lang])) {
      // Station, Element and Median are the same word in German; everything else must differ from the English.
      assert.ok(translation && translation !== text || /^(n|CV|VA|NVA|W|s|Station|Element|Station \{n\}|Element \{n\}|Median|Median \(s\))$/.test(text), `${lang}: "${text}" is not translated`);
      for (const name of text.match(/\{\w+\}/g) || []) assert.ok(translation.includes(name), `${lang}: "${text}" loses ${name}`);
    }
  }
});
