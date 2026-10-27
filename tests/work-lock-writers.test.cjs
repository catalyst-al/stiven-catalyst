// While the tools are locked with a PIN (js/work-lock.js), nothing of the visitor's work is written in plain text: the
// CV tools, 5 Whys and the workplace profile used to write straight to localStorage, past the lock. Each page runs with
// WorkLock.locked and its own input; afterwards the browser holds none of its keys.
process.env.TZ = 'Europe/Berlin';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { openTool, keep, type, settle } = require('./helpers/tool-page.cjs');

const NOW = '2026-10-25T11:00:00Z';
const locked = (w) => { w.WorkLock = { locked: true }; };
// Preferences of the page, not work: they may be written while locked.
const PREFERENCES = /^(sc-theme|sc-seen-|sc-print-guide|sc-floor|sc-listen)/;

for (const slug of ['cv-builder', 'ats-cv', 'cover-letter', 'five-whys']) {
  test(`${slug}: typing while the tools are locked writes nothing`, async () => {
    const w = openTool(slug, { now: NOW, before: locked });
    const field = [...w.document.querySelectorAll('main input[type=text], main input:not([type]), main textarea')].find((input) => !input.disabled);
    assert.ok(field, 'a field to type into');
    type(w, field, 'Mira Hoxha, +49 170 0000000');
    await settle(w, 50);
    const written = Object.keys(keep(w)).filter((key) => !PREFERENCES.test(key));
    assert.deepEqual(written, [], `written while locked: ${written.join(', ')}`);
  });
}

test('the workplace profile is not written while locked', () => {
  const w = openTool('daily-board', { now: NOW, before: locked });
  w.Workplace.set({ site: 'Lager Nord' });
  assert.equal(w.localStorage.getItem('sc-workplace'), null);
});
