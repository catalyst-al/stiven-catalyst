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

test('every tool a role or module links to has a name, and Shift Pulse is on the Pulse and Zenith paths', async () => {
  const data = await content;
  const linked = new Set([...Object.values(data.roles).flatMap(role => role.tools), ...data.modules.flatMap(m => m.tools)]);
  for (const slug of linked) assert.ok(data.toolNames[slug], `no display name for ${slug}`);
  for (const role of ['pulse', 'zenith']) assert.ok(data.roles[role].tools.includes('shift-pulse'), role);
  assert.deepEqual(data.modules.filter(m => m.tools.includes('shift-pulse')).map(m => m.id), ['pulse-brief', 'pulse-handover', 'zenith-review']);
  // The assignments that send the lead to Shift Pulse say so in every language.
  for (const id of ['pulse-brief', 'pulse-handover']) {
    for (const lang of ['en', 'de', 'sq']) assert.match(data.modules.find(m => m.id === id).assignment[lang], /Shift Pulse/, `${id} ${lang}`);
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
  const padded = JSON.parse(C.exportBackup(s));
  padded.state.projects[0].extra = 'x'.repeat(1000);
  padded.state.projects[0].brief.junk = 'y';
  padded.state.projects[0].actions.push({ id: 'a1b2c3d4-0000-4000-8000-000000000001', text: 'Check', owner: 'SM', due: '2026-10-10', done: false, note: 'unknown' });
  const stripped = C.importBackup(s, JSON.stringify(padded)).projects.at(-1);
  assert.equal(stripped.extra, undefined);
  assert.equal(stripped.brief.junk, undefined);
  assert.equal(stripped.actions.at(-1).note, undefined);
  assert.equal(stripped.actions.at(-1).text, 'Check');
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
    b => b.version = 999,
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
  dom.window.eval(coreSource); dom.window.eval(fs.readFileSync('src/js/coaching-results.js', 'utf8')); dom.window.eval(uiSource);
  return dom;
}
const formValues = (w, name, values) => {
  const form = w.document.querySelector(`[data-form="${name}"]`);
  assert.ok(form, `form ${name}`);
  for (const [key, value] of Object.entries(values)) { const el = form.elements.namedItem(key); assert.ok(el, key); el.value = value; }
  if ('mode' in values) form.elements.mode.dispatchEvent(new w.Event('change', { bubbles: true }));
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

const paretoSnapshot = () => ({ version: 1, tool: 'pareto', captured: '2026-09-30T10:00:00.000Z', payload: { measure: 'count', unit: 'cases', source: 'Observation log', filter: '', from: '2026-09-20', to: '2026-09-29', total: 10, used: 10, skipped: 1, items: [{ name: 'Handoff', amount: 8, share: .8, cumulative: .8, cls: 'A' }, { name: 'Other', amount: 2, share: .2, cumulative: 1, cls: 'B' }] } });

test('v1 work and backups migrate without a read-time write or changing historical records', () => {
  const legacy = stateWithProject(); legacy.version = 1; legacy.profile.sector = 'hospitality';
  const p = legacy.projects[0];
  for (const key of ['context', 'workflow', 'delegations', 'simulations']) delete p[key];
  p.measurements.push({ id: C.id(), date: '2026-09-25', phase: 'before', units: 120, failed: 12 });
  p.evidence.push({ id: C.id(), date: '2026-09-25', summary: 'Observed', source: 'Shift log', tool: 'five-whys' });
  const raw = JSON.stringify(legacy), store = memory(); store.setItem(C.KEY, raw);
  const loaded = C.load(store); assert.equal(loaded.error, null); assert.equal(loaded.state.version, 2);
  assert.equal(store.getItem(C.KEY), raw); assert.equal(loaded.state.projects[0].id, p.id);
  assert.deepEqual(clone(loaded.state.projects[0].measurements), clone(p.measurements));
  assert.equal(loaded.state.projects[0].context.sector, 'hospitality');
  const copy = C.importBackup(C.empty(), JSON.stringify({ format: 'stiven-catalyst-coaching', version: 1, state: legacy }));
  assert.equal(copy.version, 2); assert.equal(copy.projects[0].measurements[0].units, 120);
  assert.equal(C.save(store, loaded.state), null); assert.equal(JSON.parse(store.getItem(C.KEY)).version, 2);
  const invalid = clone(legacy); invalid.projects[0].deadline = '2026-02-31'; store.setItem(C.KEY, JSON.stringify(invalid));
  assert.equal(C.load(store).error, 'corrupt'); assert.equal(C.save(store, loaded.state), 'corrupt');
});

test('typed results preserve exact totals, require a reviewed conclusion and add actions atomically', () => {
  const s = stateWithProject(), p = s.projects[0], result = paretoSnapshot();
  assert.ok(C.validSnapshot(result));
  C.addResult(p, result, { summary: 'Investigate handoff first', source: 'Weekly log', action: 'Observe two handoffs', owner: 'Lead', due: '2026-10-02' });
  assert.equal(p.evidence[0].snapshot.payload.items[0].share, .8); assert.equal(p.actions.length, 1);
  result.payload.items[0].name = 'Changed elsewhere'; assert.equal(p.evidence[0].snapshot.payload.items[0].name, 'Handoff');
  const original = JSON.stringify(p);
  assert.throws(() => C.addResult(p, paretoSnapshot(), { summary: 'Review', source: '', action: 'Check', owner: '', due: '2026-10-01' }), /invalidResult/);
  assert.equal(JSON.stringify(p), original);
  const invalid = paretoSnapshot(); invalid.payload.total = 11; assert.equal(C.validSnapshot(invalid), false);
  invalid.payload.total = 10; invalid.payload.items[0].share = .7; assert.equal(C.validSnapshot(invalid), false);
  const whys = { version: 1, tool: 'five-whys', captured: result.captured, payload: { problem: 'Lost requests', whys: ['No acceptance'], hypothesis: 'No receiving owner', action: '', owner: '', due: '', check: '' } };
  C.addResult(p, whys, { summary: 'Still a hypothesis', source: 'One observed case', useHypothesis: true });
  assert.equal(p.brief.hypothesis, 'No receiving owner'); assert.ok(C.validState(s));
});

test('LUMEN next step is based on records, distinguishes evidence from a hypothesis and handles comparability', () => {
  const p = stateWithProject().projects[0], day = '2026-09-30';
  const next = () => C.nextStep(p, day).key;
  assert.equal(next(), 'stepDefine'); p.brief.scope = 'One handoff'; p.brief.target = 'Reduce miss rate';
  assert.equal(next(), 'stepBaseline'); C.addMeasurement(p, { date: day, phase: 'before', units: 100, failed: 10, definition: 'Missed / all' });
  assert.equal(next(), 'stepInvestigate'); C.addResult(p, paretoSnapshot(), { summary: 'Priority', source: '' });
  assert.equal(next(), 'stepHypothesis'); p.brief.hypothesis = 'Ownership unclear'; p.workflow.supportingEvidence = 'Two observed handoffs; other cases untested'; p.workflow.test = 'Check whether accepted requests are still missed';
  assert.equal(next(), 'stepPilot'); p.brief.pilot = 'Explicit acceptance in one shift'; Object.assign(p.workflow, { pilotOwner: 'Lead', reviewDate: '2026-10-02', criterion: 'Fewer misses in five shifts', guardrail: 'No longer response time' });
  assert.equal(next(), 'stepAfter'); C.addMeasurement(p, { date: '2026-10-02', phase: 'after', units: 100, failed: 5, definition: 'Different definition' });
  assert.equal(next(), 'stepComparable'); p.measurements[1].definition = 'Missed / all'; assert.equal(next(), 'stepReview');
  p.workflow.verdict = 'adapt'; p.workflow.reviewResult = 'Response time worsened'; assert.equal(next(), 'stepReplan');
  p.workflow.verdict = 'adopt'; assert.equal(next(), 'stepControl'); p.brief.control = 'Accepted requests log'; Object.assign(p.workflow, { controlOwner: 'Lead', cadence: 'Weekly', reaction: 'Observe drift and investigate' });
  assert.equal(next(), 'stepComplete'); p.actions.push({ id: C.id(), text: 'Review', owner: 'Lead', due: day, done: false }); assert.equal(next(), 'stepAction');
});

test('all simulation branches are translated, valid, distinct and terminate after three decisions', async () => {
  const data = await content;
  for (const [role, scenario] of Object.entries(data.simulations)) {
    for (const lang of ['en', 'de', 'sq']) {
      assert.ok(scenario.title[lang]); for (const c of Object.values(scenario.cases)) assert.ok(c[lang]);
      for (const node of Object.values(scenario.nodes)) { assert.ok(node.prompt[lang]); for (const c of node.choices) assert.ok(c.label[lang] && c.feedback[lang]); }
    }
    const visit = path => {
      const id = C.simulationNode(scenario, path), node = scenario.nodes[id];
      if (!node.choices.length) { assert.equal(path.length, 3, role); return; }
      node.choices.forEach((c, choice) => visit([...path, { node: id, choice }]));
    }; visit([]);
    assert.notEqual(C.simulationNode(scenario, [{ node: 'start', choice: 0 }]), C.simulationNode(scenario, [{ node: 'start', choice: 1 }]));
    assert.throws(() => C.simulationNode(scenario, [{ node: 'rush', choice: 0 }]), /invalidSimulation/);
  }
});

test('1:1 follows a previous commitment and backup remaps the complete chain and delegation action', async () => {
  const s = stateWithProject('zenith'); s.profile.ready = true;
  const dom = await workspace('sq', s, 'zenith'), w = dom.window; click(w, '[data-view="sessions"]');
  const values = { mode: 'one-to-one', participant: 'Lead A', goal: 'Better handoffs', reality: 'No owner', options: 'Log or call', way: 'Pilot log', support: 'Provide overlap time', action: 'Test one shift', owner: 'Lead A', due: '2026-10-02', nextReview: '2026-10-05' };
  formValues(w, 'session', values);
  let p = saved(w).projects[0]; assert.equal(p.sessions.length, 1); const first = p.sessions[0].id;
  const previous = w.document.querySelector('[name="previousSession"]'); previous.value = first; previous.dispatchEvent(new w.Event('change', { bubbles: true }));
  assert.match(w.document.querySelector('[data-previous-commitment]').textContent, /Provide overlap time/);
  formValues(w, 'session', { ...values, previousSession: first, previousReview: 'Pilot complete; overlap helped', nextReview: '2026-10-12' });
  p = saved(w).projects[0]; assert.equal(p.sessions.length, 2); assert.equal(p.sessions[1].previousId, first);
  click(w, '[data-view="project"]');
  const delegation = { outcome: 'Accepted handoff log', owner: 'Lead A', checkpoint: '2026-10-02', due: '2026-10-04', resources: '15 minutes overlap', authority: 'Choose channel', boundary: 'Escalate system changes', success: 'All items acknowledged', acceptance: 'Lead A repeated scope and agreed review' };
  formValues(w, 'delegation', { ...delegation, checkpoint: '2026-10-05' }); assert.equal(saved(w).projects[0].delegations.length, 0);
  formValues(w, 'delegation', delegation); assert.equal(saved(w).projects[0].delegations.length, 1);
  formValues(w, 'delegation-review', { result: 'Owner chose the channel; overlap time provided' });
  assert.match(saved(w).projects[0].delegations[0].review.result, /overlap time/);
  formValues(w, 'action-review', { result: 'One shift tested; all requests acknowledged' });
  assert.equal(saved(w).projects[0].actions[0].done, true);
  assert.match(saved(w).projects[0].actions[0].review.result, /acknowledged/);
  const imported = C.importBackup(C.empty(), C.exportBackup(saved(w))), cp = imported.projects[0];
  assert.equal(cp.sessions[1].previousId, cp.sessions[0].id); assert.notEqual(cp.sessions[0].id, first);
  assert.ok(cp.actions.some(a => a.id === cp.delegations[0].actionId)); assert.equal(cp.delegations[0].authority, 'Choose channel');
  assert.equal(C.nextStep(cp, '2026-10-06').key, 'stepAction'); cp.actions.forEach(a => a.done = true);
  assert.notEqual(C.nextStep(cp, '2026-10-06').key, 'stepSession', 'a later 1:1 supersedes the older review date');
  w.print = () => {}; click(w, '[data-action="print"]'); assert.match(w.document.querySelector('.coaching-print').textContent, /Choose channel/);
  dom.window.close();
});

test('simulations resume across languages, preserve project context and never count as workplace practice', async () => {
  const s = stateWithProject(); s.profile.ready = true; s.projects[0].context.sector = 'hospitality'; s.profile.sector = 'logistics';
  let dom = await workspace('en', s), w = dom.window; click(w, '[data-view="pathway"]');
  assert.match(w.document.body.textContent, /guest requests went unconfirmed/);
  click(w, '[data-action="simulation"][data-choice="1"]');
  const intermediate = saved(w); assert.equal(intermediate.projects[0].simulations.lumen.path.length, 1); assert.equal(C.progress(intermediate.projects[0]).practised, 0);
  dom.window.close(); dom = await workspace('de', intermediate); w = dom.window; click(w, '[data-view="pathway"]');
  assert.ok(w.document.querySelector('[data-node="rush"]'));
  click(w, '[data-action="simulation"][data-choice="0"]'); click(w, '[data-action="simulation"][data-choice="0"]');
  formValues(w, 'simulation-reflection', { reflection: 'Test ownership and response time' }); assert.ok(C.validState(saved(w)));
  const projectId = saved(w).projects[0].id; click(w, '[data-action="restart-simulation"]');
  assert.equal(saved(w).projects[0].id, projectId); assert.equal(saved(w).projects[0].simulations.lumen, undefined);
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
