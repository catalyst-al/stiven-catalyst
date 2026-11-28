// The interface texts the build hands to the tool scripts (src/ui-strings.njk → /js/ui-de.js, /js/ui-sq.js). The
// build gathers once which English texts the scripts use and shares that answer between the two languages
// (eleventy.config.js, scriptIndex): the answer is about the English key only, so the files must hold the same keys,
// and each value must be the one of its own language, never the other's.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const built = fs.existsSync('_site/js/ui-de.js') && fs.existsSync('_site/js/ui-sq.js');
const read = (lang) => {
  const window = {};
  vm.runInNewContext(fs.readFileSync(`_site/js/ui-${lang}.js`, 'utf8'), { window, JSON });
  return window.UiStrings;
};
const source = (lang) => JSON.parse(fs.readFileSync(`src/_data/${lang}/ui.json`, 'utf8'));

test('the German and the Albanian text files hold the same keys, and each its own language\'s values', { skip: !built }, () => {
  const de = read('de');
  const sq = read('sq');
  const [deSource, sqSource] = [source('de'), source('sq')];
  assert.ok(Object.keys(de).length > 4000, `${Object.keys(de).length} texts`);
  assert.deepEqual(Object.keys(de), Object.keys(sq), 'the same texts, in the same order');
  for (const key of Object.keys(de)) {
    assert.equal(de[key], deSource[key], `de: ${key}`);
    assert.equal(sq[key], sqSource[key], `sq: ${key}`);
  }
  // Where the two languages differ, the files differ: no value of one stands in the other.
  const differing = Object.keys(de).filter((key) => deSource[key] !== sqSource[key]);
  assert.ok(differing.length > 4000);
  assert.equal(differing.filter((key) => de[key] === sqSource[key] || sq[key] === deSource[key]).length, 0);
});

test('a text is handed over exactly when the scripts hold it between quotes, as before the index', { skip: !built }, () => {
  const scripts = fs.readdirSync('src/js').filter((file) => file.endsWith('.js')).map((file) => fs.readFileSync(`src/js/${file}`, 'utf8')).join('\n');
  // The rule as it was written before the index (one search per text and kind of quote).
  const inScripts = (text) => scripts.includes(JSON.stringify(text))
    || scripts.includes(`'${text.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`)
    || scripts.includes(`\`${text}\``);
  const all = Object.keys(source('de'));
  const handed = new Set(Object.keys(read('de')));
  // Every fortieth text keeps the test quick; the first and the last few are always checked.
  const sample = all.filter((_, i) => i % 40 === 0 || i < 20 || i > all.length - 80);
  for (const key of sample) assert.equal(handed.has(key), inScripts(key), key);
});
