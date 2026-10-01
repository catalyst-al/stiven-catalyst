// "All your work in one file" (src/js/work-backup.js): which keys are work, which tool they belong
// to, and that only a sound file of this site can replace anything.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const { JSDOM } = require('jsdom');

const load = () => {
  const dom = new JSDOM('<html lang="sq"><body></body></html>', { url: 'https://example.test/sq/tools.html', runScripts: 'outside-only' });
  dom.window.eval(fs.readFileSync('src/js/work-backup.js', 'utf8'));
  return dom.window;
};
const plain = (value) => JSON.parse(JSON.stringify(value));

test('every tool log is work; the theme and page settings are not', () => {
  const { WorkBackup } = load();
  for (const key of ['sc-damage-control-sq', 'sc-five-whys', 'sc-coaching-v1', 'sc-sigma-chart-de-calc', 'sc-delay-analyzer-check']) assert.ok(WorkBackup.isWork(key), key);
  for (const key of ['sc-theme', 'sc-print-guide-hidden', 'other-site', '']) assert.ok(!WorkBackup.isWork(key), key);
});

test('keys are named after the tool they belong to', () => {
  const { WorkBackup } = load();
  assert.equal(WorkBackup.toolSlug('sc-damage-control-sq-check'), 'damage-control');
  assert.equal(WorkBackup.toolSlug('sc-sigma-chart-de-calc'), 'sigma-control-chart');
  assert.equal(WorkBackup.toolSlug('sc-dmaic'), 'six-sigma-dmaic');
  assert.equal(WorkBackup.toolSlug('sc-cx-tower'), 'cx-control-tower');
  assert.equal(WorkBackup.toolSlug('sc-shift-handover-de'), 'shift-handover');
});

test('a saved file holds the work and nothing else, and reads back the same', () => {
  const window = load();
  const { WorkBackup, localStorage } = window;
  localStorage.setItem('sc-theme', 'light');
  localStorage.setItem('sc-damage-control-sq', '{"rows":[{"units":3}]}');
  localStorage.setItem('sc-shift-handover-sq', '{"current":{}}');
  localStorage.setItem('someone-else', 'x');
  const backup = plain(WorkBackup.makeBackup(localStorage, new window.Date('2026-10-01T06:00:00Z')));
  assert.equal(backup.format, 'stiven-catalyst-work');
  assert.equal(backup.version, 1);
  assert.equal(backup.exported, '2026-10-01T06:00:00.000Z');
  assert.deepEqual(Object.keys(backup.items).sort(), ['sc-damage-control-sq', 'sc-shift-handover-sq']);
  assert.deepEqual(plain(WorkBackup.readBackup(JSON.stringify(backup))).items, backup.items);
});

test('a damaged or foreign file replaces nothing', () => {
  const { WorkBackup } = load();
  const good = { format: 'stiven-catalyst-work', version: 1, exported: '', items: { 'sc-pareto': '{}' } };
  assert.ok(WorkBackup.readBackup(JSON.stringify(good)));
  for (const bad of [
    'not json', '{}', JSON.stringify({ ...good, format: 'other' }), JSON.stringify({ ...good, version: 2 }),
    JSON.stringify({ ...good, items: {} }), JSON.stringify({ ...good, items: [] }),
    JSON.stringify({ ...good, items: { 'sc-theme': 'dark' } }), JSON.stringify({ ...good, items: { 'evil-key': '1' } }),
    JSON.stringify({ ...good, items: { 'sc-pareto': 42 } }),
  ]) assert.equal(WorkBackup.readBackup(bad), null, bad);
});

test('the backup and handover texts are translated', () => {
  const keys = [
    'Coaching workspace', 'Saved in this browser: {tools}.', 'No saved work in this browser yet.', 'Your work', 'All your work in one file',
    'Save all my work', 'Open a saved file', 'Opened. The page reloads to show your work.',
    'This is not a Stiven Catalyst work file, or it is damaged. Nothing was changed.',
    'Fill in from the logs', 'from the log', 'damaged units', 'incomplete orders', '{a} of {b} routes',
    'Filled {n} number from the logs.', 'Filled {n} numbers from the logs.', 'These numbers are already filled in. What you typed stays as it is.',
  ];
  for (const lang of ['de', 'sq']) {
    const ui = JSON.parse(fs.readFileSync(`src/_data/${lang}/ui.json`, 'utf8'));
    for (const key of keys) assert.ok(ui[key], `${lang}: ${key}`);
  }
});

test('handover numbers the logs fill exist in every language, in the same places', () => {
  const read = (lang) => JSON.parse(fs.readFileSync(`src/_data/${lang ? `${lang}/` : ''}shiftHandover.json`, 'utf8'));
  const en = read('');
  for (const lang of ['de', 'sq']) {
    const other = read(lang);
    for (const [key, template] of Object.entries(en.templates)) {
      assert.deepEqual(other.templates[key].sources || null, template.sources || null, `${lang}: ${key}`);
      if (template.sources) assert.equal(template.sources.length, template.metrics.length);
    }
    // Shifts match the logs, so a handover finds the log rows of its own shift.
    const damage = JSON.parse(fs.readFileSync(`src/_data/${lang}/damageControl.json`, 'utf8'));
    assert.deepEqual(damage.fields.find((f) => f.name === 'shift').options, other.shifts);
    assert.deepEqual(JSON.parse(fs.readFileSync(`src/_data/${lang}/delayAnalyzer.json`, 'utf8')).shifts, other.shifts);
  }
});
