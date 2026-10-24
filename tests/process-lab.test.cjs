// Process Lab (src/js/process-lab.js) and the statistics behind it (src/js/stats-kit.js): the distributions against
// their table values, capability of a sample worked by hand, the before/after tests, pasting, the example and the
// three data files.
process.env.TZ = 'Europe/Berlin';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const { JSDOM } = require('jsdom');

const read = (file) => JSON.parse(fs.readFileSync(file, 'utf8'));
const plain = (value) => JSON.parse(JSON.stringify(value));
const dataFile = (lang) => (lang === 'en' ? 'src/_data/processLab.json' : `src/_data/${lang}/processLab.json`);
const near = (actual, expected, tolerance, label) => assert.ok(Math.abs(actual - expected) <= tolerance, `${label}: ${actual} is not within ${tolerance} of ${expected}`);

// The partial with its template tags taken out, so the script finds the page it expects.
const pageHtml = (lang) => fs.readFileSync('src/_includes/partials/process-lab.njk', 'utf8')
  .replace(/\{#[\s\S]*?#\}/g, '').replace(/\{%-?[\s\S]*?-?%\}/g, '')
  .replace(/\{\{ *"([^"]+)" *\| *t\(lang\)[^}]*\}\}/g, '$1')
  .replace(/\{\{ *'([^']+)' *\| *local\(lang\) *\}\}/g, (match, url) => (lang === 'en' ? url : `/${lang}${url}`))
  .replace(/\{\{ *cfg *\| *scriptJson *\| *safe *\}\}/, JSON.stringify(read(dataFile(lang))))
  .replace(/\{\{[^}]*\}\}/g, '').replace(/<script src=[^>]*><\/script>/g, '');

const load = (lang = 'en', { page = false, now = '2026-10-23T10:00:00Z' } = {}) => {
  const html = `<html lang="${lang}"><body>${page ? pageHtml(lang) : ''}</body></html>`;
  const dom = new JSDOM(html, { url: `https://example.test${lang === 'en' ? '' : `/${lang}`}/tools/process-lab/`, runScripts: 'outside-only', pretendToBeVisual: true });
  const w = dom.window;
  w.eval(`(() => { const Real = Date; const fixed = new Real(${JSON.stringify(now)}); Date = class extends Real { constructor(...args) { super(...(args.length ? args : [fixed])); } static now() { return fixed.getTime(); } }; })();`);
  w.confirm = () => true;
  w.HTMLElement.prototype.scrollIntoView = () => {};
  // The translated pages load their texts from ui.json; until the integrator merges them, the part file adds its own.
  if (lang !== 'en') w.UiStrings = { ...read(`src/_data/${lang}/ui.json`), ...read('src/_data/i18n-parts/process-lab.json')[lang] };
  for (const file of ['tool-kit', 'chart-kit', 'actions-store', 'stats-kit', 'process-lab']) w.eval(fs.readFileSync(`src/js/${file}.js`, 'utf8'));
  return w;
};

test('the distributions match their table values', () => {
  const { StatsKit: S } = load();
  near(S.normalCdf(1.96), 0.975, 1e-4, 'normalCdf(1.96)');
  near(S.normalCdf(0), 0.5, 1e-9, 'normalCdf(0)');
  near(S.normalCdf(-1.645), 0.05, 1e-4, 'normalCdf(-1.645)');
  near(S.normInv(0.975), 1.959964, 1e-4, 'normInv(0.975)');
  near(S.normInv(0.8), 0.841621, 1e-4, 'normInv(0.8)');
  near(S.tCdf(2.228, 10), 0.975, 5e-4, 'tCdf(2.228, 10)');
  near(S.tCdf(0, 7), 0.5, 1e-9, 'tCdf(0, 7)');
  near(S.tInv(0.975, 10), 2.228, 2e-3, 'tInv(0.975, 10)');
  near(S.chi2Cdf(3.841, 1), 0.95, 5e-4, 'chi2Cdf(3.841, 1)');
  near(S.chi2Cdf(18.307, 10), 0.95, 5e-4, 'chi2Cdf(18.307, 10)');
});

test('capability of a sample worked by hand', () => {
  const { StatsKit: S } = load();
  // Mean 10, sd √(4/7) = 0.7559; moving ranges 1,1,1,1,2,1,0 → MR̄ 1, σ within 1/1.128.
  const cap = S.capability([9, 10, 11, 10, 9, 11, 10, 10], 7, 13);
  near(cap.mean, 10, 1e-12, 'mean');
  near(cap.sd, Math.sqrt(4 / 7), 1e-12, 'sd');
  near(cap.sigmaWithin, 1 / 1.128, 1e-12, 'sigma within');
  near(cap.cp, 1.128, 1e-9, 'Cp');
  near(cap.cpk, 1.128, 1e-9, 'Cpk (centred)');
  near(cap.pp, 1 / Math.sqrt(4 / 7), 1e-9, 'Pp');
  near(cap.ppk, cap.pp, 1e-12, 'Ppk (centred)');
  near(cap.pBelow, 1 - S.normalCdf(3 / Math.sqrt(4 / 7)), 1e-12, 'share below LSL');
  near(cap.ppmTotal, 2 * cap.pBelow * 1e6, 1e-6, 'PPM both sides');
  assert.equal(cap.outBelow + cap.outAbove, 0);
  // One-sided: only USL, the mean off centre.
  const upper = S.capability([9, 10, 11, 10, 9, 11, 10, 10], NaN, 12);
  assert.equal(upper.cp, null, 'Cp needs both limits');
  near(upper.cpk, 2 / (3 / 1.128), 1e-9, 'Cpk to USL');
  const none = S.capability([1, 2, 3], NaN, NaN);
  assert.equal(none.cpk, null);
});

test('two proportions: 104 of 18,400 against 61 of 18,200 is a real drop', () => {
  const { StatsKit: S, ProcessLabMath: M } = load();
  const r = S.twoProportion(104, 18400, 61, 18200);
  near(r.p1, 104 / 18400, 1e-12, 'p1');
  near(r.p2, 61 / 18200, 1e-12, 'p2');
  const pooled = 165 / 36600;
  const z = (61 / 18200 - 104 / 18400) / Math.sqrt(pooled * (1 - pooled) * (1 / 18400 + 1 / 18200));
  near(r.z, z, 1e-9, 'z');
  near(r.z, -3.28, 0.01, 'z rounded');
  near(r.p, 0.00102, 0.00005, 'two-sided p');
  assert.ok(r.ci95[0] < r.diff && r.diff < r.ci95[1] && r.ci95[1] < 0, 'the interval lies below zero');
  assert.equal(M.verdictOf(r.p), 'real');
  assert.equal(M.oneIn(r.p), 1000, 'about 1 in 1,000');
  assert.equal(S.twoProportion(5, 4, 1, 10), null, 'more defects than units');
});

test('Welch t, sample sizes and the drift line', () => {
  const { StatsKit: S } = load();
  const w = S.welch([1, 2, 3, 4, 5], [2, 4, 6, 8, 10]);
  near(w.diff, 3, 1e-12, 'difference');
  near(w.t, 3 / Math.sqrt(2.5), 1e-9, 't');
  near(w.df, 6.25 / 1.0625, 1e-9, 'Welch df');
  assert.ok(w.p > 0.05 && w.p < 0.15, `p ${w.p}`);
  assert.equal(S.welch([1], [2, 3]), null);
  const za = 1.959964, zb = 0.841621;
  const p0 = 0.0057, p1 = 0.0034, bar = (p0 + p1) / 2;
  const expected = Math.ceil((za * Math.sqrt(2 * bar * (1 - bar)) + zb * Math.sqrt(p0 * (1 - p0) + p1 * (1 - p1))) ** 2 / (p1 - p0) ** 2);
  near(S.sampleSizeProportion(p0, p1), expected, 1, 'per group for a rate');
  assert.equal(S.sampleSizeMean(4, 2), 63, '2 × ((1.96 + 0.84) × 4 / 2)², rounded up');
  assert.equal(S.sampleSizeProportion(0.01, 0.01), null);
  const line = S.regression([1, 2, 3, 4], [2, 4, 6, 8]);
  near(line.slope, 2, 1e-12, 'slope');
  near(line.r, 1, 1e-12, 'r');
});

test('the Nelson rules find a point beyond 3σ and a shift of nine', () => {
  const { StatsKit: S } = load();
  const values = [10, 11, 9, 10, 10, 11, 9, 10, 25, 10];
  const chart = S.imr(values);
  const events = S.nelsonEvents(S.nelson(values, 10, 1));
  assert.deepEqual(plain(events.filter((e) => e.rule === 1).map((e) => e.from)), [8]);
  assert.ok(chart.ucl > chart.mean && chart.lcl < chart.mean);
  const shifted = [...Array(9)].map((_, i) => 11 + (i % 2) * 0.1);
  assert.ok(S.nelsonEvents(S.nelson(shifted, 10, 1)).some((e) => e.rule === 2 && e.from === 0 && e.to === 8));
});

test('verdict bands: under 1 not capable, to 1.33 marginal, from 1.33 capable, from 2 six sigma', () => {
  const { ProcessLabMath: M } = load();
  assert.equal(M.band(0.99), 'low');
  assert.equal(M.band(1), 'marginal');
  assert.equal(M.band(1.329), 'marginal');
  assert.equal(M.band(1.33), 'capable');
  assert.equal(M.band(2), 'six');
  assert.equal(M.band(null), 'none');
  assert.equal(M.verdictOf(0.07), 'borderline');
  assert.equal(M.verdictOf(0.3), 'noise');
  assert.equal(M.oneIn(0.3), null, 'a large chance is said as a percentage');
});

test('pasting: dates and values, a header, a single line, and a decimal-comma column', () => {
  const en = load('en').ProcessLabMath;
  assert.deepEqual(plain(en.parseValues('Date\tMinutes\n2026-10-01\t42.4\n2026-10-02\t39.9\n')), [{ date: '2026-10-01', value: 42.4 }, { date: '2026-10-02', value: 39.9 }]);
  assert.deepEqual(plain(en.parseValues('42.4 39.9 43.6').map((p) => p.value)), [42.4, 39.9, 43.6]);
  assert.deepEqual(plain(en.parseValues('1;42.5\n2;43').map((p) => p.value)), [42.5, 43], 'the last number of a row is the measurement');
  const de = load('de').ProcessLabMath;
  assert.deepEqual(plain(de.parseValues('47,2\n44,1\n1.049,5').map((p) => p.value)), [47.2, 44.1, 1049.5], 'a German column is one value per line');
  assert.deepEqual(plain(de.parseValues('14.09.2026\t42,4')), [{ date: '2026-09-14', value: 42.4 }]);
  assert.equal(en.decimals([42, 42.4, 39.95]), 2);
});

test('the example sample: 60 loading times around 42, two outliers, a slight drift, not capable', () => {
  const { ProcessLabMath: M } = load();
  const data = read(dataFile('en'));
  const points = data.example.rows.map((row) => ({ date: row.split('|')[0], value: Number(row.split('|')[1]) }));
  assert.equal(points.length, 60);
  const r = M.analyse(points, { lsl: Number(data.example.lsl), usl: Number(data.example.usl) });
  near(r.mean, 42, 1, 'mean');
  near(r.sd, 4, 0.5, 'sd');
  assert.deepEqual(plain(r.events.filter((e) => e.rule === 1).map((e) => e.from + 1)), [23, 47], 'the two outliers');
  assert.ok(r.drift.slope > 0 && r.drift.p < 0.1, 'a slight upward drift');
  assert.equal(r.band, 'low');
  assert.ok(r.cap.cp > r.cap.cpk, 'off centre');
  assert.ok(r.without && r.without.normal, 'normal once the two outliers are set aside');
});

test('the page opens on the example in Albanian, with charts and the hand-offs', () => {
  const w = load('sq', { page: true });
  const results = w.document.querySelector('[data-results]');
  assert.equal(results.hidden, false);
  assert.ok(results.querySelectorAll('svg').length >= 4, 'I chart, MR chart, histogram, box plot');
  assert.match(results.textContent, /Jo i aftë/);
  assert.equal(w.localStorage.getItem('sc-process-lab-sq'), null, 'nothing is saved until the visitor acts');
  const action = [...results.querySelectorAll('a')].find((a) => /action-tracker/.test(a.href));
  assert.ok(action, 'an Action Tracker hand-off');
  action.dispatchEvent(new w.MouseEvent('click', { cancelable: true }));
  const handed = new w.URL(action.href);
  assert.equal(handed.pathname, '/sq/tools/action-tracker/');
  assert.equal(handed.searchParams.get('source'), 'process-lab');
  assert.match(handed.searchParams.get('action'), /Pika 23/, 'the first signal, in words');
  const whys = [...results.querySelectorAll('a')].find((a) => /five-whys/.test(a.href));
  assert.match(new w.URL(whys.href).pathname, /^\/sq\/tools\/five-whys\/$/);
  // The before/after tab shows the default rates and their verdict.
  assert.match(w.document.querySelector('[data-prop-out]').textContent, /Ndryshim real/);
  assert.match(w.document.querySelector('[data-means-out]').textContent, /45,87/);
  // Clearing the example empties the measurements and hides the results.
  w.document.querySelector('.pl-example-note button').click();
  assert.equal(results.hidden, true);
  assert.equal(JSON.parse(w.localStorage.getItem('sc-process-lab-sq')).values, '');
});

test('the three data files share their shape, their placeholders and the storage key convention', () => {
  const shape = (value) => (Array.isArray(value) ? value.map(shape) : value && typeof value === 'object' ? Object.fromEntries(Object.keys(value).sort().map((k) => [k, shape(value[k])])) : typeof value);
  const holes = (value, path = '', out = {}) => {
    if (typeof value === 'string') out[path] = (value.match(/\{\w+\}/g) || []).sort().join(' ');
    else if (value && typeof value === 'object') Object.entries(value).forEach(([k, v]) => holes(v, `${path}.${k}`, out));
    return out;
  };
  const en = read(dataFile('en'));
  assert.equal(en.storageKey, 'sc-process-lab');
  for (const lang of ['de', 'sq']) {
    const other = read(dataFile(lang));
    assert.deepEqual(shape(other), shape(en), `${lang} has the same shape`);
    assert.equal(other.storageKey, `sc-process-lab-${lang}`);
    assert.deepEqual(holes({ ...other, example: null, placeholders: null }), holes({ ...en, example: null, placeholders: null }), `${lang} keeps every {placeholder}`);
    assert.deepEqual(other.example.rows, en.example.rows, `${lang} example rows`);
    assert.deepEqual(other.rules.map((r) => r.id), [1, 2, 3, 4, 5, 6, 7, 8]);
  }
});

test('every text of the page and the script has a German and an Albanian translation', () => {
  const part = read('src/_data/i18n-parts/process-lab.json');
  const partial = fs.readFileSync('src/_includes/partials/process-lab.njk', 'utf8');
  const script = fs.readFileSync('src/js/process-lab.js', 'utf8');
  const texts = [...partial.matchAll(/\{\{ *"([^"]+)" *\| *t\(lang\)/g), ...script.matchAll(/tx\("((?:[^"\\]|\\.)*)"/g)].map((m) => m[1]);
  for (const lang of ['de', 'sq']) {
    const ui = { ...read(`src/_data/${lang}/ui.json`), ...part[lang] };
    const missing = [...new Set(texts)].filter((text) => !(text in ui));
    assert.deepEqual(missing, [], `${lang}: untranslated`);
  }
  assert.deepEqual(Object.keys(part.de).sort(), Object.keys(part.sq).sort());
  const cards = read('src/_data/i18n-parts/process-lab.cards.json');
  assert.equal(cards.family, 'lumen');
  for (const lang of ['en', 'de', 'sq']) {
    assert.equal(cards.cards[lang].url, `${lang === 'en' ? '' : `/${lang}`}/tools/process-lab/`);
    assert.equal(cards.cards[lang].type, 'Six Sigma');
    assert.equal(cards.cards[lang].time, '10 min');
  }
});
