// Work a visitor saved with the version of the site before the tool fixes of October 2026 (fixtures/saved-before.json,
// captured from that version in Chromium: every tool opened in English, German and Albanian, the form tools typed in,
// two entries added to each log with the total of the period typed, an essay saved to the shelf; the chart, Pareto and
// the Control Tower hold the example a first visit saved then). Opened by the tools now, nothing of it is lost or
// changed: every stored value is still there, a log the visitor made their own shows its rows, and the "Save all your
// work" file of that version still opens. The pages are the built ones (_site), with the scripts of each page from src/js.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const { JSDOM } = require('jsdom');

const hasSite = fs.existsSync('_site/tools/damage-control/index.html');
const before = JSON.parse(fs.readFileSync('tests/fixtures/saved-before.json', 'utf8'));
const TOOLS = ['ats-cv', 'cover-letter', 'cv-builder', 'cx-control-tower', 'damage-control', 'delay-analyzer', 'five-whys', 'incomplete-control',
  'kpi-diagnostic', 'pareto', 'shift-handover', 'shift-pulse', 'sigma-control-chart', 'six-sigma-dmaic'];
// The page's own scripts, not the ones every page carries (they need a real browser and keep no work of a tool).
const SHARED = new Set(['feedback', 'work-backup', 'share-orbit', 'shelf', 'family-sky']);
// What the tools add to a log's state now: the days a typed total belongs to.
const ADDED = new Set(['totalsFor']);

const parse = (value) => { try { return JSON.parse(value); } catch { return value; } };
// The same logs as the visitor's own work: the example stamp cleared and every note their own.
const ownWork = (storage) => Object.fromEntries(Object.entries(storage).map(([key, value]) => {
  const state = parse(value);
  if (!state || typeof state !== 'object' || !Array.isArray(state.rows)) return [key, value];
  if ('example' in state) state.example = {};
  state.rows = state.rows.map((row, i) => (row && typeof row === 'object' && 'note' in row ? { ...row, note: `Own note ${i}` } : row));
  return [key, JSON.stringify(state)];
}));

const open = (path, storage) => {
  const raw = fs.readFileSync(`_site${path}index.html`, 'utf8');
  const files = [...raw.matchAll(/<script\b[^>]*\bsrc="\/js\/([a-z0-9-]+)\.js[^"]*"/g)].map((m) => m[1]).filter((name) => !SHARED.has(name));
  const html = raw.replace(/<script\b[^>]*\bsrc=[^>]*><\/script>/g, '');
  const { window } = new JSDOM(html, { url: `https://example.test${path}`, runScripts: 'outside-only', pretendToBeVisual: true });
  window.confirm = () => true;
  window.scrollTo = () => {};
  window.HTMLElement.prototype.scrollIntoView = () => {};
  for (const [key, value] of Object.entries(storage)) window.localStorage.setItem(key, value);
  for (const file of files) window.eval(fs.readFileSync(fs.existsSync(`src/js/${file}.js`) ? `src/js/${file}.js` : `_site/js/${file}.js`, 'utf8'));
  window.dispatchEvent(new window.Event('pagehide'));
  return window;
};

// Every value stored before is still stored, the same; a log may only gain the keys in ADDED.
const changes = (was, now, path = '') => {
  if (was === now) return [];
  if (was && now && typeof was === 'object' && typeof now === 'object' && Array.isArray(was) === Array.isArray(now)) {
    return [
      ...Object.keys(was).flatMap((key) => changes(was[key], now[key], `${path}.${key}`)),
      ...Object.keys(now).filter((key) => !(key in was) && !(path.split('.').length === 2 && ADDED.has(key))).map((key) => `${path}.${key} added`),
    ];
  }
  return [`${path}: ${JSON.stringify(was)?.slice(0, 60)} became ${JSON.stringify(now)?.slice(0, 60)}`];
};
const unchanged = (storage, window, label) => {
  for (const [key, value] of Object.entries(storage)) {
    const now = window.localStorage.getItem(key);
    assert.notEqual(now, null, `${label}: ${key} was removed`);
    assert.deepEqual(changes(parse(value), parse(now), `.${key}`), [], `${label}: ${key}`);
  }
};

test('the fixture is what that version stored: the logs of all three languages, the form tools, the shelf', () => {
  const keys = Object.keys(before.storage);
  for (const tool of ['damage-control', 'incomplete-control', 'delay-analyzer', 'sigma-chart', 'shift-handover', 'dmaic']) {
    for (const key of [`sc-${tool}`, `sc-${tool}-de`, `sc-${tool}-sq`]) assert.ok(keys.includes(key), key);
  }
  for (const key of ['sc-pareto', 'sc-cx-tower', 'sc-cv-builder', 'sc-cover-letter', 'sc-ats-cv', 'sc-five-whys', 'sc-shelf']) assert.ok(keys.includes(key), key);
  assert.equal(before.backup.format, 'stiven-catalyst-work');
});

for (const [name, storage] of [['as that version stored it', before.storage], ['as the visitor\'s own work', ownWork(before.storage)]]) {
  test(`work saved before, ${name}, is kept by every tool page in every language`, { skip: !hasSite }, () => {
    for (const lang of ['', '/de', '/sq']) {
      for (const tool of TOOLS) unchanged(storage, open(`${lang}/tools/${tool}/`, storage), `${lang || '/en'}/tools/${tool}/`);
    }
  });
}

test('a log made the visitor\'s own still shows its rows, in each language', { skip: !hasSite }, () => {
  const own = ownWork(before.storage);
  for (const lang of ['', '/de', '/sq']) {
    for (const tool of ['damage-control', 'incomplete-control', 'delay-analyzer']) {
      const window = open(`${lang}/tools/${tool}/`, own);
      assert.match(window.document.body.textContent, /Own note/, `${lang || '/en'}/tools/${tool}/`);
      assert.equal(window.document.querySelector('.dl-example-note')?.hidden ?? true, true, `${lang || '/en'}/tools/${tool}/: no example note on own work`);
    }
  }
});

test('the "Save all your work" file of that version still opens, with every item', { skip: !hasSite }, () => {
  const window = new JSDOM('<!doctype html><body></body>', { url: 'https://example.test/', runScripts: 'outside-only' }).window;
  window.eval(fs.readFileSync('src/js/work-backup.js', 'utf8'));
  // The file of that version held exactly the stored items (fixture: backup is the file's own fields).
  for (const items of [before.storage, ownWork(before.storage)]) {
    const opened = window.WorkBackup.readBackup(JSON.stringify({ ...before.backup, items }));
    assert.ok(opened, 'the file is accepted');
    assert.deepEqual(Object.keys(opened.items).sort(), Object.keys(items).sort());
  }
});
