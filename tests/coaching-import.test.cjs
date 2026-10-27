const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const { JSDOM } = require('jsdom');

// Opening the same coaching backup twice must not fill the workspace with copies of the same project (audit P2C-13),
// and a valid backup that would pass the 100-project limit, or a file over 5 MB, is told apart from a damaged one.
// The rule: a project from the file is added as a copy (fresh ids, current work never overwritten) unless the
// workspace already holds the same project, ids aside.
const coreSource = fs.readFileSync('src/js/coaching-core.js', 'utf8');
const uiSource = fs.readFileSync('src/js/coaching-workspace.js', 'utf8');
const context = { window: {}, Date, Math, Map, Set, JSON, Number };
vm.createContext(context); vm.runInContext(coreSource, context);
const C = context.window.CoachingCore;
const content = import('../src/_data/coaching.js').then((m) => m.default);
const project = (title, role = 'pulse') => C.createProject(role, { title, goal: 'Fewer missed requests', measure: 'Missed / all, weekly', deadline: '2026-12-31' });
// Plain host arrays: the core's clone() makes arrays of this realm, createProject() of the vm's.
const titles = (s) => [...s.projects.map((p) => p.title)];

test('the same backup opened twice adds its projects once', () => {
  const s = C.empty();
  s.projects.push(project('P1'));
  const backup = C.exportBackup(s);
  // Into the workspace it came from: nothing new.
  let t = C.importBackup(s, backup);
  t = C.importBackup(t, backup);
  assert.deepEqual(titles(t), ['P1']);
  // Into an empty workspace: one copy, however often.
  let other = C.importBackup(C.empty(), backup);
  other = C.importBackup(other, backup);
  assert.deepEqual(titles(other), ['P1']);
  assert.ok(C.validState(other));
});

test('a project changed since the backup keeps the current work and gets the backup as one copy', () => {
  const s = C.empty();
  s.projects.push(project('P1'));
  const backup = C.exportBackup(s);
  s.projects[0].title = 'P1 renamed';
  let t = C.importBackup(s, backup);
  assert.deepEqual(titles(t), ['P1 renamed', 'P1']);
  assert.equal(t.projects[0].id, s.projects[0].id);
  assert.notEqual(t.projects[1].id, s.projects[0].id);
  t = C.importBackup(t, backup);
  assert.deepEqual(titles(t), ['P1 renamed', 'P1']);
});

test('a valid backup that would pass 100 projects has its own error, not "invalid backup"', () => {
  const big = C.empty();
  for (let i = 0; i < 60; i++) big.projects.push(project(`x${i}`));
  const other = C.empty();
  for (let i = 0; i < 60; i++) other.projects.push(project(`y${i}`));
  assert.throws(() => C.importBackup(big, C.exportBackup(other)), /tooManyProjects/);
  // The same 60 projects again are not new, so they do not count against the limit.
  assert.deepEqual(titles(C.importBackup(big, C.exportBackup(big))), titles(big));
  assert.throws(() => C.importBackup(big, 'x'.repeat(5 * 1024 * 1024 + 1)), /backupTooLarge/);
});

async function workspace(lang, saved) {
  const data = await content;
  const dom = new JSDOM(`<html lang="${lang}"><body><section data-coaching data-role="pulse"><div data-coaching-app></div><p data-coaching-status></p></section><script type="application/json" id="coaching-data"></script></body></html>`, { url: `https://example.test/${lang === 'en' ? '' : `${lang}/`}roles/${data.roles.pulse.slug}/`, runScripts: 'outside-only' });
  dom.window.document.getElementById('coaching-data').textContent = JSON.stringify(data);
  dom.window.localStorage.setItem(C.KEY, JSON.stringify(saved));
  dom.window.confirm = () => true;
  dom.window.eval(coreSource); dom.window.eval(fs.readFileSync('src/js/coaching-results.js', 'utf8')); dom.window.eval(uiSource);
  return dom.window;
}
// The import form with a chosen file, as the page reads it through FormData.
const importFile = async (w, file) => {
  w.document.querySelector('[data-view="backup"]').click();
  const Original = w.FormData;
  w.FormData = class extends Original { *[Symbol.iterator]() { yield ['backup', file]; } };
  const form = w.document.querySelector('[data-form="import"]');
  form.reportValidity = () => true;
  form.dispatchEvent(new w.Event('submit', { bubbles: true, cancelable: true }));
  await new Promise((resolve) => setImmediate(resolve));
  w.FormData = Original;
  return w.document.querySelector('[data-coaching-status]').textContent;
};

const MESSAGES = {
  en: ['Every project in this backup is already in your workspace. Nothing was changed.', 'This backup would take the workspace past 100 projects. Delete projects you no longer need and open it again. Nothing was changed.', 'This file is larger than 5 MB, too large for a coaching backup. Nothing was changed.'],
  de: ['Alle Projekte dieses Backups sind bereits in Ihrem Arbeitsbereich. Es wurde nichts geändert.', 'Mit diesem Backup hätte der Arbeitsbereich mehr als 100 Projekte. Löschen Sie Projekte, die Sie nicht mehr brauchen, und öffnen Sie es erneut. Es wurde nichts geändert.', 'Diese Datei ist größer als 5 MB und damit zu groß für ein Coaching-Backup. Es wurde nichts geändert.'],
  sq: ['Të gjitha projektet e kësaj kopjeje janë tashmë në hapësirën tënde. Asgjë nuk ndryshoi.', 'Me këtë kopje hapësira do të kalonte 100 projekte. Fshi projektet që nuk të duhen më dhe hape sërish. Asgjë nuk ndryshoi.', 'Ky skedar është më i madh se 5 MB, tepër i madh për një kopje coaching-u. Asgjë nuk ndryshoi.'],
};

for (const lang of ['en', 'de', 'sq']) {
  test(`the workspace (${lang}) says why a backup added nothing: already here, over 100 projects, over 5 MB`, async () => {
    const s = C.empty();
    s.profile.ready = true;
    for (let i = 0; i < 60; i++) s.projects.push(project(`x${i}`));
    s.active.pulse = s.projects[0].id;
    const w = await workspace(lang, s);
    const stored = () => w.localStorage.getItem(C.KEY);
    const before = stored();
    assert.equal(await importFile(w, { size: 1000, text: async () => C.exportBackup(s) }), MESSAGES[lang][0]);
    assert.equal(stored(), before);
    const other = C.empty();
    for (let i = 0; i < 60; i++) other.projects.push(project(`y${i}`));
    assert.equal(await importFile(w, { size: 1000, text: async () => C.exportBackup(other) }), MESSAGES[lang][1]);
    assert.equal(stored(), before);
    let read = false;
    assert.equal(await importFile(w, { size: 5 * 1024 * 1024 + 1, text: async () => { read = true; return ''; } }), MESSAGES[lang][2]);
    assert.equal(read, false, 'a file over the limit is not read');
    assert.equal(stored(), before);
  });
}
