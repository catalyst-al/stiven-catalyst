// Shared harness: load a BUILT page from audit-src/_site in jsdom, strip its <script src>, seed localStorage,
// then eval the real scripts from audit-src/src/js. Read-only on the clone.
const path = require('node:path');
const fs = require('node:fs');
const SRC = path.resolve(__dirname, '../../audit-src');
const { JSDOM } = require(path.join(SRC, 'node_modules/jsdom'));

const page = (urlPath, files, saved = {}, opts = {}) => {
  const html = fs.readFileSync(path.join(SRC, '_site', urlPath, 'index.html'), 'utf8').replace(/<script\b[^>]*\bsrc=[^>]*><\/script>/g, '');
  const errors = [];
  const vc = new (require(path.join(SRC, 'node_modules/jsdom')).VirtualConsole)();
  vc.on('jsdomError', (e) => errors.push(String(e && (e.stack || e.message || e))));
  vc.on('error', (e) => errors.push(String(e)));
  const { window } = new JSDOM(html, { url: `https://example.test${urlPath}`, runScripts: 'outside-only', pretendToBeVisual: true, virtualConsole: vc });
  window.confirm = () => true;
  window.alert = () => {};
  window.scrollTo = () => {};
  window.HTMLElement.prototype.scrollIntoView = () => {};
  window.__errors = errors;
  for (const [key, value] of Object.entries(saved)) window.localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
  if (opts.before) opts.before(window);
  for (const file of files) {
    const own = path.join(SRC, 'src/js', `${file}.js`); const built = path.join(SRC, '_site/js', `${file}.js`);
    try { window.eval(fs.readFileSync(fs.existsSync(own) ? own : built, 'utf8')); }
    catch (e) { errors.push(`${file}: ${e.stack || e}`); }
  }
  return window;
};
// Scripts a built page loads, in order, filtered to the tool scripts (no site chrome).
const CHROME = new Set(['feedback', 'storage-guard', 'work-backup', 'reminders', 'team-sync', 'tool-fold', 'offline', 'floor-mode', 'share-orbit', 'shelf', 'family-sky']);
const scriptsOf = (urlPath) => {
  const html = fs.readFileSync(path.join(SRC, '_site', urlPath, 'index.html'), 'utf8');
  return [...html.matchAll(/src="\/js\/([a-z0-9-]+)\.js/g)].map((m) => m[1]).filter((s) => !CHROME.has(s));
};
const tool = (urlPath, saved = {}, opts = {}) => page(urlPath, opts.files || scriptsOf(urlPath), saved, opts);
const text = (window, sel) => [...window.document.querySelectorAll(sel)].map((n) => n.textContent.replace(/\s+/g, ' ').trim()).join(' | ');
const type = (window, selector, value, ev = 'input') => {
  const input = window.document.querySelector(selector);
  if (!input) throw new Error(`no ${selector}`);
  input.value = value;
  input.dispatchEvent(new window.Event(ev, { bubbles: true }));
  return input;
};
const click = (window, selector) => {
  const node = window.document.querySelector(selector);
  if (!node) throw new Error(`no ${selector}`);
  node.dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
};
const isoDaysAgo = (k) => { const n = new Date(); return new Date(Date.UTC(n.getFullYear(), n.getMonth(), n.getDate() - k)).toISOString().slice(0, 10); };
let fails = 0;
const check = (label, expected, actual, ok = (e, a) => (typeof e === 'number' && typeof a === 'number' ? Math.abs(e - a) <= 1e-9 * Math.max(1, Math.abs(e)) : JSON.stringify(e) === JSON.stringify(a))) => {
  const pass = ok(expected, actual);
  if (!pass) fails++;
  console.log(`${pass ? 'PASS' : 'FAIL'} | ${label} | expected=${JSON.stringify(expected)} | actual=${JSON.stringify(actual)}`);
  return pass;
};
const note = (label, value) => console.log(`INFO | ${label} | ${typeof value === 'string' ? value : JSON.stringify(value)}`);
process.on('exit', () => console.log(`--- ${fails} check(s) failed`));
module.exports = { SRC, page, tool, scriptsOf, text, type, click, isoDaysAgo, check, note };
