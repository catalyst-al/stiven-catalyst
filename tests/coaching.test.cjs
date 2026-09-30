const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const { JSDOM } = require('jsdom');

const coreSource = fs.readFileSync('src/js/coaching-core.js', 'utf8');
const uiSource = fs.readFileSync('src/js/coaching-workspace.js', 'utf8');
const bridgeSource = fs.readFileSync('src/js/coaching-bridge.js', 'utf8');
const context = { window: {}, Date, Math, Map, Set, JSON, Number };
vm.createContext(context); vm.runInContext(coreSource, context);
const C = context.window.CoachingCore;
const content = import('../src/_data/coaching.js').then(m => m.default);
const stateWithProject = (role = 'lumen') => {
  const s = C.empty();
  const p = C.createProject(role, { title: 'One handoff', goal: 'Fewer missed requests', measure: 'Missed requests / all requests, weekly', deadline: '2026-10-15' });
  s.projects.push(p); s.active[role] = p.id;
  return s;
};
const memory = () => {
  const data = new Map();
  return { getItem: key => data.get(key) ?? null, setItem: (key, value) => data.set(key, value), data };
};
const clone = v => JSON.parse(JSON.stringify(v));

test('coaching curriculum covers current roles, languages and existing tools', async () => {
  const data = await content;
  const families = JSON.parse(fs.readFileSync('src/_data/families.json'));
  const tools = new Set(JSON.parse(fs.readFileSync('src/_data/tools.json')).map(t => t.url.split('/')[2]));
  assert.equal(data.modules.length, 13);
  assert.equal(new Set(data.modules.map(m => m.id)).size, 13);
  for (const family of families) {
    const role = data.roles[family.id];
    assert.equal(role.slug, family.slug);
    assert.deepEqual(role.modules, Array.from(C.MODULES[family.id]));
    for (const slug of role.tools) assert.ok(tools.has(slug), slug);
  }
  const localized = value => {
    for (const lang of ['en', 'de', 'sq']) assert.ok(typeof value[lang] === 'string' && value[lang].trim(), `${lang}: ${JSON.stringify(value)}`);
  };
  Object.values(data.labels).forEach(localized);
  for (const role of Object.values(data.roles)) ['name', 'aim', 'suggested', 'prompt'].forEach(k => localized(role[k]));
  for (const m of data.modules) {
    ['title', 'lesson', 'question', 'explanation', 'reflection', 'assignment'].forEach(k => localized(m[k]));
    Object.values(m.cases).forEach(localized); m.choices.forEach(localized);
    assert.ok(Number.isInteger(m.correct) && m.correct >= 0 && m.correct < m.choices.length);
    for (const slug of m.tools) assert.ok(tools.has(slug), slug);
  }
});

test('state persists with revision checking and blocks stale tab writes', () => {
  const store = memory(), s = stateWithProject();
  assert.ok(C.validState(s)); assert.equal(C.save(store, s), null);
  const first = C.load(store).state, stale = C.load(store).state;
  first.projects[0].title = 'Newer work'; assert.equal(C.save(store, first), null);
  stale.projects[0].title = 'Stale work'; assert.equal(C.save(store, stale), 'conflict');
  assert.equal(C.load(store).state.projects[0].title, 'Newer work');
});

test('unreadable storage is not overwritten and blocked storage can work in memory', () => {
  const store = memory(); store.setItem(C.KEY, '{cut off');
  assert.equal(C.load(store).error, 'corrupt'); assert.equal(C.save(store, stateWithProject()), 'corrupt');
  assert.equal(store.getItem(C.KEY), '{cut off');
  const unavailable = { getItem() { throw new Error('blocked'); }, setItem() { throw new Error('blocked'); } };
  assert.equal(C.load(unavailable).error, 'notSaved');
  const s = stateWithProject(); assert.equal(C.save(unavailable, s), 'notSaved'); assert.equal(s.revision, 0);
  assert.ok(JSON.parse(C.exportBackup(s)).state.projects.length === 1);
});

test('backup import makes independent copies and preserves current context, active project and linked actions', () => {
  const s = stateWithProject(); s.profile.name = 'Current context';
  const p = s.projects[0], actionId = C.id();
  p.actions.push({ id: actionId, text: 'Review', owner: 'Lead', due: '2026-10-10', done: false });
  p.sessions.push({ id: C.id(), date: '2026-09-30', goal: 'Improve', reality: 'Gap', options: 'A or B', way: 'Test A', actionId });
  const imported = C.importBackup(s, C.exportBackup(s));
  assert.equal(imported.projects.length, 2); assert.equal(imported.profile.name, s.profile.name);
  assert.equal(imported.active.lumen, p.id); assert.notEqual(imported.projects[1].id, p.id);
  assert.notEqual(imported.projects[1].actions[0].id, actionId);
  assert.equal(imported.projects[1].sessions[0].actionId, imported.projects[1].actions[0].id);
  imported.projects[1].brief.goal = 'Independent'; assert.equal(p.brief.goal, 'Fewer missed requests');
  assert.ok(C.validState(imported));
});

test('invalid backups reject atomically: versions, shape, dates, measurement bounds, IDs and size', () => {
  const s = stateWithProject(), original = JSON.stringify(s);
  for (const mutate of [
    b => b.version = 2,
    b => b.state.projects[0].role = 'unknown',
    b => b.state.projects[0].deadline = '2026-02-30',
    b => b.state.projects.push(clone(b.state.projects[0])),
    b => b.state.projects[0].measurements.push({ id: C.id(), date: '2026-09-30', phase: 'before', units: 3, failed: 4 }),
    b => b.state.projects[0].practice['atlas-star'] = {},
    b => b.state.active.lumen = 'missing'
  ]) {
    const b = JSON.parse(C.exportBackup(s)); mutate(b);
    assert.throws(() => C.importBackup(s, JSON.stringify(b)), /invalidBackup/);
    assert.equal(JSON.stringify(s), original);
  }
  assert.throws(() => C.importBackup(s, 'x'.repeat(5 * 1024 * 1024 + 1)), /invalidBackup/);
});

test('before/after uses weighted counts and rejects impossible or duplicate observations', () => {
  const p = stateWithProject().projects[0];
  C.addMeasurement(p, { date: '2026-09-28', phase: 'before', units: 100, failed: 10 });
  C.addMeasurement(p, { date: '2026-09-29', phase: 'before', units: 900, failed: 9 });
  C.addMeasurement(p, { date: '2026-09-30', phase: 'after', units: 1000, failed: 10 });
  const r = C.compare(p.measurements);
  assert.equal(r.before.rate, 0.019); assert.equal(r.after.rate, 0.01); assert.ok(Math.abs(r.points + 0.9) < 1e-10);
  for (const values of [{ units: 0, failed: 0 }, { units: 5, failed: 6 }, { units: 5.5, failed: 1 }, { units: 5, failed: -1 }, { units: NaN, failed: 1 }]) {
    assert.throws(() => C.addMeasurement(p, { date: '2026-10-01', phase: 'after', ...values }), /invalidMeasurement/);
  }
  assert.throws(() => C.addMeasurement(p, { date: '2026-09-30', phase: 'after', units: 4, failed: 1 }), /invalidMeasurement/);
  assert.equal(C.compare([]).points, null);
});

test('practice and workplace review are separate progress stages', () => {
  const s = stateWithProject(), p = s.projects[0];
  assert.equal(C.progress(p).practised, 0);
  p.practice['lumen-define'] = { situation: 'Packing', facts: '19 misses', decision: 'Measure', verify: 'Monday review', date: '2026-09-30', review: null };
  assert.equal(C.progress(p).practised, 1); assert.equal(C.progress(p).applied, 0); assert.equal(C.progress(p).next, 'lumen-measure');
  p.practice['lumen-define'].review = { date: '2026-10-01', result: 'Brief checked with process owner', reviewer: 'Owner' };
  assert.equal(C.progress(p).applied, 1); assert.ok(C.validState(s));
});

test('action due dates compare calendar days and completion takes precedence', () => {
  const a = { due: '2026-09-30', done: false };
  assert.equal(C.actionStatus(a, '2026-09-30'), 'open'); assert.equal(C.actionStatus(a, '2026-10-01'), 'overdue');
  a.done = true; assert.equal(C.actionStatus(a, '2026-10-01'), 'done');
});

async function workspace(lang = 'en', saved = null, role = 'lumen') {
  const data = await content;
  const dom = new JSDOM(`<html lang="${lang}"><body><section data-coaching data-role="${role}"><div data-coaching-app></div><p data-coaching-status></p></section><script type="application/json" id="coaching-data"></script></body></html>`, { url: `https://example.test/${lang === 'en' ? '' : `${lang}/`}roles/${data.roles[role].slug}/`, runScripts: 'outside-only' });
  dom.window.document.getElementById('coaching-data').textContent = JSON.stringify(data);
  if (saved) dom.window.localStorage.setItem(C.KEY, JSON.stringify(saved));
  dom.window.confirm = () => true;
  dom.window.eval(coreSource); dom.window.eval(uiSource);
  return dom;
}
const formValues = (w, name, values) => {
  const form = w.document.querySelector(`[data-form="${name}"]`);
  assert.ok(form, `form ${name}`);
  for (const [key, value] of Object.entries(values)) { const el = form.elements.namedItem(key); assert.ok(el, key); el.value = value; }
  form.dispatchEvent(new w.Event('submit', { bubbles: true, cancelable: true }));
};
const click = (w, selector) => { const el = w.document.querySelector(selector); assert.ok(el, selector); el.click(); };
const saved = w => JSON.parse(w.localStorage.getItem(C.KEY));

test('workspace journey: context → project → practice → workplace review → GROW action → weighted measurement', async () => {
  const dom = await workspace(), w = dom.window;
  formValues(w, 'profile', { name: 'Lead', sector: 'hospitality', experience: 'experienced' });
  formValues(w, 'create', { title: 'Guest request handoff', goal: 'Fewer lost requests', measure: 'Lost / all requests', deadline: '2026-10-15' });
  assert.equal(saved(w).profile.sector, 'hospitality'); assert.equal(saved(w).projects.length, 1);
  click(w, '[data-action="module"][data-id="lumen-define"]');
  assert.match(w.document.body.textContent, /room requests lost/);
  formValues(w, 'quiz', { answer: '1' }); assert.equal(Object.keys(saved(w).projects[0].practice).length, 0);
  assert.match(w.document.querySelector('[data-quiz-feedback]').textContent, /Good decision/);
  formValues(w, 'practice', { situation: 'Handoff at reception', facts: '5 missed requests', decision: 'Observe the transition', verify: 'Review with housekeeping on Friday' });
  assert.equal(C.progress(saved(w).projects[0]).applied, 0);
  formValues(w, 'review', { result: 'Owner confirmed scope and measure', date: '2026-10-01', reviewer: 'Team lead' });
  assert.equal(C.progress(saved(w).projects[0]).applied, 1);
  click(w, '[data-view="sessions"]');
  formValues(w, 'session', { goal: 'Choose a small pilot', reality: 'Requests disappear', options: 'Shared log or check-in call', way: 'Try shared log for a week', action: 'Start the log', owner: 'Lead', due: '2026-10-03' });
  assert.equal(saved(w).projects[0].sessions.length, 1); assert.equal(saved(w).projects[0].actions.length, 1);
  click(w, '[data-view="project"]');
  formValues(w, 'measurement', { date: '2026-09-28', phase: 'before', units: '100', failed: '10' });
  formValues(w, 'measurement', { date: '2026-09-29', phase: 'before', units: '900', failed: '9' });
  assert.equal(C.compare(saved(w).projects[0].measurements).before.rate, .019);
  const ids = [...w.document.querySelectorAll('[id]')].map(el => el.id);
  assert.equal(new Set(ids).size, ids.length, 'form labels have unique IDs');
  assert.ok(C.validState(saved(w)));
  dom.window.close();
});

test('each role renders its own translated pathway and reuses saved work across languages', async () => {
  for (const lang of ['en', 'de', 'sq']) for (const role of C.ROLES) {
    const s = stateWithProject(role), dom = await workspace(lang, s, role), w = dom.window;
    click(w, '[data-view="pathway"]');
    assert.equal(w.document.querySelectorAll('.coaching-modules button').length, C.MODULES[role].length);
    assert.equal(saved(w).projects[0].id, s.projects[0].id);
    assert.equal(w.document.querySelector('[data-form="practice"] [name="situation"]').value, '');
    dom.window.close();
  }
});

test('restored text renders safely, and corrupt storage remains recoverable', async () => {
  const s = stateWithProject(); s.projects[0].title = '<img src=x onerror="alert(1)">'; s.projects[0].brief.goal = '</p><script>alert(1)</script>';
  let dom = await workspace('en', s);
  assert.equal(dom.window.document.querySelector('[data-coaching-app] img'), null);
  assert.equal(dom.window.document.querySelectorAll('[data-coaching-app] script').length, 0);
  assert.match(dom.window.document.querySelector('[data-coaching-app]').textContent, /onerror/); dom.window.close();
  dom = await workspace(); dom.window.localStorage.setItem(C.KEY, '{bad'); dom.window.eval(uiSource);
  assert.match(dom.window.document.querySelector('[data-coaching-status]').textContent, /could not be read/);
  assert.equal(dom.window.localStorage.getItem(C.KEY), '{bad');
  dom.window.close();
});

test('contextual tool bridge saves evidence into the latest project without modifying tool logs', async () => {
  const data = await content, s = stateWithProject(), p = s.projects[0];
  const dom = new JSDOM('<html lang="de"><body><section data-coaching-bridge hidden><div data-coaching-bridge-app></div><p data-coaching-bridge-status></p></section><script id="coaching-data" type="application/json"></script></body></html>', { url: `https://example.test/de/tools/five-whys/?coaching=${p.id}`, runScripts: 'outside-only' });
  const w = dom.window; w.document.getElementById('coaching-data').textContent = JSON.stringify(data);
  w.localStorage.setItem(C.KEY, JSON.stringify(s)); w.localStorage.setItem('sc-five-whys', 'existing tool work');
  w.eval(coreSource); w.eval(bridgeSource);
  assert.equal(w.document.querySelector('[data-coaching-bridge]').hidden, false);
  // A newer project action is written after the tool page opens.
  const latest = saved(w); latest.projects[0].actions.push({ id: C.id(), text: 'New action', owner: 'Lead', due: '2026-10-01', done: false });
  assert.equal(w.CoachingCore.save(w.localStorage, latest), null);
  const form = w.document.querySelector('form'); form.elements.summary.value = 'Observed the handoff; cause still a hypothesis'; form.elements.source.value = 'Floor observation';
  form.dispatchEvent(new w.Event('submit', { bubbles: true, cancelable: true }));
  assert.equal(saved(w).projects[0].evidence[0].tool, 'five-whys'); assert.equal(saved(w).projects[0].actions.length, 1);
  assert.equal(w.localStorage.getItem('sc-five-whys'), 'existing tool work');
  assert.match(w.document.querySelector('a').href, /\/de\/roles\/process-manager\/\?project=/);
  dom.window.close();
});

test('submitting one form cannot silently discard edits in another form', async () => {
  const s = stateWithProject(); s.profile.ready = true;
  const dom = await workspace('en', s), w = dom.window;
  click(w, '[data-view="project"]');
  const title = w.document.querySelector('[data-form="brief"] [name="title"]');
  title.value = 'Unsaved project change'; title.dispatchEvent(new w.Event('input', { bubbles: true }));
  w.confirm = () => false;
  formValues(w, 'action', { action: 'Check source', owner: 'Lead', due: '2026-10-02' });
  assert.equal(saved(w).projects[0].actions.length, 0);
  assert.equal(title.value, 'Unsaved project change');
  dom.window.close();
});

test('UI restores valid backups as copies and produces a printable report with safe text', async () => {
  const s = stateWithProject(); s.profile.ready = true;
  const dom = await workspace('en', s), w = dom.window;
  click(w, '[data-view="backup"]');
  const OriginalFormData = w.FormData;
  w.FormData = class extends OriginalFormData {
    *[Symbol.iterator]() { yield ['backup', { size: 1000, text: async () => C.exportBackup(s) }]; }
  };
  const form = w.document.querySelector('[data-form="import"]');
  form.reportValidity = () => true;
  form.dispatchEvent(new w.Event('submit', { bubbles: true, cancelable: true }));
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(saved(w).projects.length, 2);
  assert.equal(saved(w).active.lumen, s.projects[0].id);
  assert.match(w.document.querySelector('[data-coaching-status]').textContent, /copies imported/);
  w.FormData = OriginalFormData;
  click(w, '[data-view="project"]');
  let printed = false;
  w.print = () => { printed = true; };
  click(w, '[data-action="print"]');
  assert.ok(printed); assert.ok(w.document.body.classList.contains('coaching-printing'));
  assert.match(w.document.querySelector('.coaching-print').textContent, /Fewer missed requests/);
  w.dispatchEvent(new w.Event('afterprint'));
  assert.equal(w.document.querySelector('.coaching-print'), null);
  dom.window.close();
});
