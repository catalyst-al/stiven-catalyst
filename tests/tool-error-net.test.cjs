// tool-kit.js, the error notice: a script error of the site's own on a tool page shows one notice at the top of the
// main content (the saved work untouched, save a file, reload); a second error adds no second notice; an error from
// another origin (an extension) shows none; a page without a tool shows none.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const { JSDOM } = require('jsdom');

const load = (html) => {
  const dom = new JSDOM(html, { url: 'https://example.test/tools/five-whys/', runScripts: 'outside-only', pretendToBeVisual: true });
  const w = dom.window;
  w.eval(fs.readFileSync('src/js/tool-kit.js', 'utf8'));
  return w;
};
const fire = (w, filename, type = 'error') => {
  if (type === 'error') w.dispatchEvent(new w.ErrorEvent('error', { message: 'boom', filename }));
  else w.dispatchEvent(new w.Event('unhandledrejection'));
};
const TOOL = '<html lang="en"><body><main><h1>5 Whys</h1><div class="tool-panel"></div></main></body></html>';

test('one notice for the first error of the site\'s own script on a tool page, none for a second', () => {
  const w = load(TOOL);
  fire(w, 'https://example.test/js/five-whys.js?v=abc');
  const notices = w.document.querySelectorAll('[data-tool-error]');
  assert.equal(notices.length, 1);
  assert.equal(notices[0].getAttribute('role'), 'alert');
  assert.match(notices[0].textContent, /saved work is untouched/);
  assert.equal(w.document.querySelector('main').firstElementChild, notices[0], 'at the top of the main content');
  assert.ok(notices[0].querySelector('button'), 'with a reload button');
  fire(w, 'https://example.test/js/tool-kit.js');
  fire(w, '', 'unhandledrejection');
  assert.equal(w.document.querySelectorAll('[data-tool-error]').length, 1);
});

test('an unhandled promise rejection counts too; an error from another origin does not; a page without a tool shows nothing', () => {
  const w1 = load(TOOL);
  fire(w1, '', 'unhandledrejection');
  assert.equal(w1.document.querySelectorAll('[data-tool-error]').length, 1);
  const w2 = load(TOOL);
  fire(w2, 'chrome-extension://abcdef/content.js');
  fire(w2, 'https://other.example/widget.js');
  assert.equal(w2.document.querySelectorAll('[data-tool-error]').length, 0);
  const w3 = load('<html lang="en"><body><main><h1>An essay</h1><article></article></main></body></html>');
  fire(w3, 'https://example.test/js/article.js');
  assert.equal(w3.document.querySelectorAll('[data-tool-error]').length, 0);
});
