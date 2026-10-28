// One switch for the motion of the whole site (audit PM-2, PM-3, CI-03): "Pause the motion" in the footer of every page
// and beside the planets on the homepage, shown only with scripts, each with both its words. The choice is kept in "sc-motion" and set on
// <html data-motion="paused"> by the inline script in the head, before the first paint; reduced motion starts paused.
// What pausing does in a real browser (no endless animation running, nothing drawn on the canvas, the choice kept
// across pages) is checked in tests/browser/motion.spec.mjs; here the built pages, the head script run as it is, and
// the lock of a shared computer, which must leave the choice readable.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const hasSite = fs.existsSync('_site/index.html');
const LABELS = { en: ['Pause the motion', 'Play the motion'], de: ['Bewegung anhalten', 'Bewegung fortsetzen'], sq: ['Ndalo lëvizjen', 'Vazhdo lëvizjen'] };
const toggles = (html) => html.match(/<button[^>]*data-motion-toggle[^>]*>.*?<\/button>/g) || [];
// Both words are there; which one shows follows <html data-motion> (65-motion.css), so the switch is right from the first paint.
const words = (button, lang) => {
  assert.match(button, new RegExp(`<span class="motion-pause">${LABELS[lang][0]}</span>`));
  assert.match(button, new RegExp(`<span class="motion-play">${LABELS[lang][1]}</span>`));
};
const footer = (html) => {
  const at = html.indexOf('<footer class="site-footer">');
  return html.slice(at, html.indexOf('</footer>', at));
};

test('every page has the switch in its footer, in its language', { skip: !hasSite }, () => {
  const pages = [['en', 'index.html'], ['de', 'de/index.html'], ['sq', 'sq/index.html'], ['en', 'tools/cx-control-tower/index.html'], ['de', 'de/tools/shift-pulse/index.html'],
    ['sq', 'sq/books/mall-per-durresin.html'], ['en', 'magazine/management-review-nr-80.html'], ['en', 'insights/pareto-and-5-why-in-practice/index.html'], ['en', 'tools.html']];
  for (const [lang, path] of pages) {
    const html = fs.readFileSync(`_site/${path}`, 'utf8');
    const [button] = toggles(footer(html));
    assert.ok(button, `${path}: a switch in the footer`);
    assert.match(button, /class="motion-toggle"/, path);
    words(button, lang);
  }
});

test('on the homepage the switch beside the planets is the same switch', { skip: !hasSite }, () => {
  for (const [lang, path] of [['en', 'index.html'], ['de', 'de/index.html'], ['sq', 'sq/index.html']]) {
    const html = fs.readFileSync(`_site/${path}`, 'utf8');
    const hero = html.slice(html.indexOf('data-cosmos'), html.indexOf('</section>', html.indexOf('data-cosmos')));
    const [button] = toggles(hero);
    assert.ok(button, path);
    assert.match(button, /class="cosmos-pause"/, `${path}: in the hero's own style`);
    words(button, lang);
  }
});

// The head script of a built page, run as the browser runs it, with a given stored choice and system setting.
const headScript = () => {
  const html = fs.readFileSync('_site/index.html', 'utf8');
  return html.match(/<script>([^<]*)<\/script>/)[1];
};
const runHead = (stored, reduce, path = '/') => {
  const html = { dataset: {}, classList: { add: () => {} } };
  const context = {
    document: { documentElement: html },
    localStorage: { getItem: (k) => (k === 'sc-motion' ? stored : null) },
    matchMedia: (q) => ({ matches: q === '(prefers-reduced-motion: reduce)' && reduce }),
    location: { pathname: path },
    // The same script quiets a page transition the browser gives up (audit CI-01, tests/browser/transitions.spec.mjs).
    addEventListener: () => {},
  };
  vm.runInNewContext(headScript(), context);
  return html.dataset.motion;
};

test('the head script pauses before the first paint: by choice, or by reduced motion unless the reader chose the motion', { skip: !hasSite }, () => {
  assert.equal(runHead(null, false), undefined, 'motion by default');
  assert.equal(runHead('paused', false), 'paused');
  assert.equal(runHead(null, true), 'paused', 'reduced motion starts paused');
  assert.equal(runHead('on', true), undefined, 'the reader chose the motion');
  assert.equal(runHead('paused', true), 'paused');
  // Storage refused (private mode): the page still works, with motion unless the system asks for less.
  const html = { dataset: {}, classList: { add: () => {} } };
  vm.runInNewContext(headScript(), { document: { documentElement: html }, localStorage: { getItem: () => { throw new Error('denied'); } }, matchMedia: () => ({ matches: true }), location: { pathname: '/' }, addEventListener: () => {} });
  assert.equal(html.dataset.theme, 'dark');
  assert.equal(html.dataset.motion, 'paused');
});

test('the choice is a setting of the page: readable while a shared computer is locked', () => {
  const store = new Map([['sc-motion', 'paused'], ['sc-damage-control', '{}']]);
  const storage = { get length() { return store.size; }, key: (i) => [...store.keys()][i] ?? null, getItem: (k) => store.get(k) ?? null };
  const context = { window: {}, document: { querySelector: () => null, addEventListener: () => {}, readyState: 'complete' }, localStorage: storage, sessionStorage: storage, crypto: globalThis.crypto, TextEncoder, TextDecoder, btoa, atob, setTimeout, clearTimeout, setInterval, location: { reload: () => {} } };
  context.window.localStorage = storage;
  context.window.sessionStorage = storage;
  vm.runInNewContext(fs.readFileSync('src/js/work-lock.js', 'utf8'), context);
  const M = context.window.WorkLockMath;
  assert.equal(M.lockable('sc-motion'), false);
  assert.deepEqual(Object.keys(M.gather(storage)), ['sc-damage-control']);
});
