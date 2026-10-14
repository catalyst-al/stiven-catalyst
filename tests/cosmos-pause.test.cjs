// "Pause the motion" in the planets hero (partials/cosmos-hero.njk, js/cosmos.js): a button in every language, hidden
// until the script shows it (never under reduced motion), that takes no room in the hero, so the planets, their chips
// and the heading stay where they were; while paused, the chips and the books stop as they do under reduced motion.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');

const hasSite = fs.existsSync('_site/index.html');
const css = fs.readFileSync('src/styles.css', 'utf8');
const rule = (selector) => {
  const at = css.indexOf(`${selector} {`);
  assert.notEqual(at, -1, selector);
  return css.slice(at, css.indexOf('}', at));
};

test('every home page has the pause button, hidden until the script shows it, with both labels translated', { skip: !hasSite }, () => {
  for (const [path, pause, play] of [['index.html', 'Pause the motion', 'Play the motion'], ['de/index.html', 'Bewegung anhalten', 'Bewegung fortsetzen'], ['sq/index.html', 'Ndalo lëvizjen', 'Vazhdo lëvizjen']]) {
    const html = fs.readFileSync(`_site/${path}`, 'utf8');
    const button = html.match(/<button class="cosmos-pause"[^>]*>[^<]*<\/button>/)?.[0];
    assert.ok(button, path);
    assert.match(button, / hidden>/, `${path}: hidden without the script`);
    assert.match(button, new RegExp(`data-play-label="${play}"`), path);
    assert.match(button, new RegExp(`>${pause}<`), path);
  }
});

test('the button takes no room in the hero, and pausing stops what reduced motion stops', () => {
  assert.match(rule('.cosmos-pause'), /position: absolute;/, 'out of the flow: nothing in the hero moves for it');
  assert.ok(css.includes('.cosmos-system { position: relative; }'), 'placed in the corner of the planets');
  const paused = css.slice(css.indexOf('.cosmos.is-paused .cosmos-chip,'), css.indexOf('{ animation: none; }', css.indexOf('.cosmos.is-paused .cosmos-chip,')));
  for (const selector of ['.cosmos.is-paused .cosmos-chip', '.cosmos.is-paused .cosmos-chip-dot', '.cosmos.is-paused .book-shelf-item .book-object']) assert.ok(paused.includes(selector), selector);
  const script = fs.readFileSync('src/js/cosmos.js', 'utf8');
  assert.match(script, /if \(pause && !still\)/, 'never shown under reduced motion');
  assert.match(script, /root\.classList\.toggle\("is-paused", paused\)/);
  assert.match(script, /if \(paused\) stop\(\); else start\(\);/, 'Play starts the drawing again');
});
