// The author's decisions on the phase 1 findings (27 October 2026), each held by a test.
process.env.TZ = 'Europe/Berlin';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { openTool, settle } = require('./helpers/tool-page.cjs');

const NOW = '2026-10-25T11:00:00Z';

// Hoshin Kanri offered the same bowling-chart table twice (in the results and under the plan), byte for byte: one
// CSV and one Excel button remain.
test('Hoshin Kanri: one CSV and one Excel button, the same table as before', async () => {
  const w = openTool('hoshin-kanri', { now: NOW });
  await settle(w, 50);
  const buttons = [...w.document.querySelectorAll('main button')].map((b) => b.textContent.trim());
  assert.equal(buttons.filter((t) => t === 'Download CSV').length, 1, buttons.join(' | '));
  assert.equal(buttons.filter((t) => t === 'Download Excel').length, 1);
});

// Coaching: a project the workspace changed since a backup keeps the current work, and the backup's version is added
// beside it as a copy with a clear label (the author's choice: copies with other content are kept, labelled). Opening
// the same backup again adds nothing, the label notwithstanding.
test('Coaching: the backup\'s version of a changed project is added once, labelled as a copy', () => {
  const fs = require('node:fs');
  const vm = require('node:vm');
  const context = { window: {}, Date, Math, Map, Set, JSON, Number };
  vm.createContext(context);
  vm.runInContext(fs.readFileSync('src/js/coaching-core.js', 'utf8'), context);
  const C = context.window.CoachingCore;
  const s = C.empty();
  s.projects.push(C.createProject('pulse', { title: 'Fewer missed pick-ups', goal: 'Fewer missed requests', measure: 'Missed / all, weekly', deadline: '2026-12-31' }));
  const backup = C.exportBackup(s);
  s.projects[0].brief.goal = 'No missed requests';
  const label = (title, date) => `${title} (version from the backup of ${date})`;
  let t = C.importBackup(s, backup, { copyTitle: label });
  const titles = [...t.projects.map((p) => p.title)];
  assert.equal(titles.length, 2);
  assert.equal(titles[0], 'Fewer missed pick-ups', 'the current work stays as it is');
  assert.match(titles[1], /^Fewer missed pick-ups \(version from the backup of \d{4}-\d{2}-\d{2}\)$/, 'the copy says what it is');
  t = C.importBackup(t, backup, { copyTitle: label });
  assert.equal(t.projects.length, 2, 'opened again: nothing added');
  assert.ok(C.validState(t));
});
