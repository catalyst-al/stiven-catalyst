// 5 Whys says so when the browser cannot keep the worksheet (audit of 27 October 2026, P2B-12): under a full or
// blocked storage the other tools show ToolKit's "could not save" warning, 5 Whys swallowed the error. The work lock
// still writes nothing and warns about nothing while locked.
process.env.TZ = 'Europe/Berlin';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { openTool, type } = require('./helpers/tool-page.cjs');

const fullStorage = (w) => {
  const real = w.Storage.prototype.setItem;
  w.Storage.prototype.setItem = function (key, value) {
    if (String(key).startsWith('sc-five-whys')) throw new w.DOMException('full', 'QuotaExceededError');
    return real.call(this, key, value);
  };
};

for (const lang of ['en', 'de', 'sq']) {
  test(`${lang}: a worksheet that cannot be saved shows the not-saved warning once`, () => {
    const w = openTool('five-whys', { lang, before: fullStorage });
    const form = w.document.querySelector('[data-worksheet]');
    type(w, form.elements.problem, 'Parcels crushed at loading');
    const warnings = w.document.querySelectorAll('.tk-save-warning');
    assert.equal(warnings.length, 1, 'the warning is shown');
    assert.equal(warnings[0].getAttribute('role'), 'alert');
    if (lang !== 'en') assert.doesNotMatch(warnings[0].textContent, /This browser could not save/, 'in the page language');
    type(w, form.elements.problem, 'Parcels crushed at loading, dock 2');
    assert.equal(w.document.querySelectorAll('.tk-save-warning').length, 1, 'once, not on every keystroke');
  });
}

test('a worksheet that is saved shows no warning, and a locked one neither writes nor warns', () => {
  const w = openTool('five-whys');
  const form = w.document.querySelector('[data-worksheet]');
  type(w, form.elements.problem, 'Parcels crushed at loading');
  assert.equal(w.document.querySelectorAll('.tk-save-warning').length, 0);
  assert.match(w.localStorage.getItem(form.dataset.key || 'sc-five-whys'), /Parcels crushed/);
  const locked = openTool('five-whys', { before: (win) => { fullStorage(win); win.WorkLock = { locked: true }; } });
  const lockedForm = locked.document.querySelector('[data-worksheet]');
  type(locked, lockedForm.elements.problem, 'Secret problem');
  assert.equal(locked.document.querySelectorAll('.tk-save-warning').length, 0, 'locked: nothing written, nothing to warn about');
});
