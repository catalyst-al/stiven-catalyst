// Shared domain model: no network, DOM or tool-log writes.
window.CoachingCore = (() => {
  'use strict';
  const KEY = 'sc-coaching-v1';
  const ROLES = ['pulse', 'zenith', 'lumen', 'atlas'];
  const MODULES = {
    pulse: ['pulse-brief', 'pulse-feedback', 'pulse-handover'],
    zenith: ['zenith-review', 'zenith-gemba', 'zenith-pdca'],
    lumen: ['lumen-define', 'lumen-measure', 'lumen-analyse', 'lumen-control'],
    atlas: ['atlas-star', 'atlas-match', 'atlas-interview']
  };
  const FIELDS = ['goal', 'measure', 'scope', 'baseline', 'target', 'hypothesis', 'pilot', 'control'];
  const object = v => v !== null && typeof v === 'object' && !Array.isArray(v);
  const text = (v, max = 10000) => typeof v === 'string' && v.length <= max;
  const id = () => globalThis.crypto?.randomUUID?.() || `c-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
  const validId = v => typeof v === 'string' && /^[a-zA-Z0-9-]{1,100}$/.test(v);
  const date = v => {
    if (typeof v !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(v)) return false;
    const d = new Date(`${v}T00:00:00Z`);
    return Number.isFinite(d.valueOf()) && d.toISOString().slice(0, 10) === v;
  };
  const today = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };
  const WORKFLOW = ['test', 'supportingEvidence', 'pilotOwner', 'reviewDate', 'criterion', 'guardrail', 'verdict', 'reviewResult', 'controlOwner', 'cadence', 'reaction'];
  const workflow = () => Object.fromEntries(WORKFLOW.map(k => [k, '']));
  const empty = () => ({ version: 2, revision: 0, profile: { name: '', sector: 'logistics', experience: 'beginner', ready: false }, projects: [], active: {} });
  const createProject = (role, values) => ({
    id: id(), role, title: String(values.title).trim(), created: today(), updated: today(), deadline: values.deadline,
    archived: false, brief: Object.fromEntries(FIELDS.map(f => [f, String(values[f] || '').trim()])),
    context: { sector: values.sector || 'logistics', experience: values.experience || 'beginner' },
    workflow: workflow(), practice: {}, actions: [], evidence: [], measurements: [], sessions: [], delegations: [], simulations: {}
  });
  const list = (v, predicate, max = 2000) => Array.isArray(v) && v.length <= max && v.every(predicate);
  const validReview = v => object(v) && date(v.date) && text(v.result) && v.result.trim().length > 0 && text(v.reviewer, 200);
  const validPractice = v => object(v) && ['situation', 'facts', 'decision', 'verify'].every(k => text(v[k]) && v[k].trim()) && date(v.date) && (v.review === null || validReview(v.review));
  const validAction = v => object(v) && validId(v.id) && text(v.text, 2000) && v.text.trim() && text(v.owner, 200) && v.owner.trim() && date(v.due) && typeof v.done === 'boolean' && (v.review === undefined || validReview(v.review));
  const finite = v => Number.isFinite(v) && v >= 0;
  const validSnapshot = s => {
    if (!object(s) || s.version !== 1 || !['pareto', 'five-whys', 'kpi-diagnostic'].includes(s.tool) || !text(s.captured, 40) || !/^\d{4}-\d{2}-\d{2}T/.test(s.captured) || !Number.isFinite(Date.parse(s.captured)) || !object(s.payload)) return false;
    const p = s.payload;
    if (s.tool === 'five-whys') return ['problem', 'hypothesis', 'action', 'owner', 'due', 'check'].every(k => text(p[k])) && p.problem.trim() && p.hypothesis.trim() && (p.due === '' || date(p.due)) && list(p.whys, v => text(v) && v.trim(), 9) && p.whys.length > 0;
    if (s.tool === 'kpi-diagnostic') return text(p.kpi, 2000) && list(p.answers, v => object(v) && text(v.key, 100) && Number.isInteger(v.score) && v.score >= 0 && v.score <= 3, 10) && p.answers.length === 10 && list(p.scores, v => object(v) && text(v.key, 100) && text(v.label, 200) && Number.isInteger(v.score) && v.score >= 0 && v.score <= 6, 5) && p.scores.length === 5 && new Set(p.scores.map(v => v.key)).size === 5 && p.scores.every(r => p.answers.filter(a => a.key === r.key).length === 2 && p.answers.filter(a => a.key === r.key).reduce((sum, a) => sum + a.score, 0) === r.score);
    return ['count', 'value'].includes(p.measure) && text(p.unit, 200) && text(p.source, 2000) && ['filter', 'from', 'to'].every(k => text(p[k], 2000)) && finite(p.total) && p.total > 0 && Number.isSafeInteger(p.used) && p.used > 0 && Number.isSafeInteger(p.skipped) && p.skipped >= 0 && list(p.items, r => object(r) && text(r.name, 2000) && finite(r.amount) && finite(r.share) && r.share <= 1 && finite(r.cumulative) && r.cumulative <= 1 && ['A', 'B', 'C'].includes(r.cls)) && p.items.length > 0 && Math.abs(p.items.reduce((sum, r) => sum + r.amount, 0) - p.total) <= Math.max(1, p.total) * 1e-9 && p.items.every(r => Math.abs(r.share - r.amount / p.total) <= 1e-9);
  };
  const validEvidence = v => object(v) && validId(v.id) && text(v.summary) && v.summary.trim() && text(v.source, 2000) && date(v.date) && (v.tool === '' || /^[a-z0-9-]{1,100}$/.test(v.tool)) && (v.snapshot === undefined || (validSnapshot(v.snapshot) && v.snapshot.tool === v.tool));
  const validMeasurement = v => object(v) && validId(v.id) && date(v.date) && ['before', 'after'].includes(v.phase) && Number.isSafeInteger(v.units) && v.units > 0 && Number.isSafeInteger(v.failed) && v.failed >= 0 && v.failed <= v.units && (v.definition === undefined || text(v.definition)) && (v.source === undefined || text(v.source, 2000));
  const validSession = v => object(v) && validId(v.id) && date(v.date) && ['goal', 'reality', 'options', 'way'].every(k => text(v[k]) && v[k].trim()) && validId(v.actionId) && (v.mode === undefined || ['self', 'one-to-one'].includes(v.mode)) && ['participant', 'previousReview', 'support'].every(k => v[k] === undefined || text(v[k], k === 'participant' ? 200 : 10000)) && (v.nextReview === undefined || v.nextReview === '' || date(v.nextReview)) && (v.previousId === undefined || v.previousId === '' || validId(v.previousId)) && (v.mode !== 'one-to-one' || (v.participant?.trim() && date(v.nextReview) && v.nextReview >= v.date && v.support?.trim() && (!v.previousId || v.previousReview?.trim())));
  const validDelegation = v => object(v) && validId(v.id) && validId(v.actionId) && date(v.date) && date(v.due) && date(v.checkpoint) && v.checkpoint <= v.due && ['outcome', 'owner', 'resources', 'authority', 'boundary', 'success', 'acceptance'].every(k => text(v[k], k === 'owner' ? 200 : 10000) && v[k].trim()) && (v.review === undefined || validReview(v.review));
  const validWorkflow = v => object(v) && WORKFLOW.every(k => text(v[k])) && (v.reviewDate === '' || date(v.reviewDate)) && ['', 'adopt', 'adapt', 'stop'].includes(v.verdict);
  const uniqueIds = rows => new Set(rows.map(r => r.id)).size === rows.length;
  const validProject = (p, version = 2) => object(p) && validId(p.id) && ROLES.includes(p.role) && text(p.title, 200) && p.title.trim() && date(p.created) && date(p.updated) && date(p.deadline) && typeof p.archived === 'boolean'
    && object(p.brief) && FIELDS.every(k => text(p.brief[k])) && p.brief.goal.trim() && p.brief.measure.trim()
    && object(p.practice) && Object.entries(p.practice).every(([k, v]) => MODULES[p.role].includes(k) && validPractice(v))
    && list(p.actions, validAction) && uniqueIds(p.actions)
    && list(p.evidence, validEvidence) && uniqueIds(p.evidence)
    && list(p.measurements, validMeasurement) && uniqueIds(p.measurements) && new Set(p.measurements.map(r => `${r.phase}/${r.date}`)).size === p.measurements.length
    && ['before', 'after'].every(phase => Number.isSafeInteger(p.measurements.filter(r => r.phase === phase).reduce((sum, r) => sum + r.units, 0)))
    && list(p.sessions, validSession) && uniqueIds(p.sessions) && p.sessions.every((s, i) => !s.previousId || p.sessions.slice(0, i).some(previous => previous.id === s.previousId && previous.mode === 'one-to-one' && s.mode === 'one-to-one' && previous.participant.toLowerCase() === s.participant.toLowerCase()))
    && (version === 1 || (object(p.context) && ['logistics', 'hospitality'].includes(p.context.sector) && ['beginner', 'experienced'].includes(p.context.experience) && validWorkflow(p.workflow) && list(p.delegations, validDelegation) && uniqueIds(p.delegations) && object(p.simulations) && Object.entries(p.simulations).every(([k, v]) => k === p.role && object(v) && date(v.date) && (v.reflection === undefined || text(v.reflection)) && list(v.path, r => object(r) && validId(r.node) && Number.isInteger(r.choice) && r.choice >= 0 && r.choice <= 2, 20))));
  const validState = s => object(s) && [1, 2].includes(s.version) && Number.isSafeInteger(s.revision) && s.revision >= 0
    && object(s.profile) && text(s.profile.name, 200) && ['logistics', 'hospitality'].includes(s.profile.sector) && ['beginner', 'experienced'].includes(s.profile.experience) && typeof s.profile.ready === 'boolean'
    && list(s.projects, p => validProject(p, s.version), 100) && uniqueIds(s.projects)
    && object(s.active) && Object.entries(s.active).every(([role, value]) => ROLES.includes(role) && (value === '' || s.projects.some(p => p.id === value && p.role === role)));
  const clone = v => JSON.parse(JSON.stringify(v));
  // Only the fields the workspace knows survive an import; anything else a file carries is dropped,
  // so a backup cannot fill the browser's storage with data no screen shows.
  const pick = (v, keys) => (object(v) ? Object.fromEntries(keys.filter(k => v[k] !== undefined).map(k => [k, v[k]])) : v);
  const pickAll = (rows, keys) => (Array.isArray(rows) ? rows.map(r => pick(r, keys)) : rows);
  const REVIEW_KEYS = ['date', 'result', 'reviewer'];
  const withReview = (v, keys) => { const out = pick(v, keys); if (object(out.review)) out.review = pick(out.review, REVIEW_KEYS); return out; };
  const known = p => {
    const out = pick(p, ['id', 'role', 'title', 'created', 'updated', 'deadline', 'archived', 'brief', 'practice', 'actions', 'evidence', 'measurements', 'sessions', 'context', 'workflow', 'delegations', 'simulations']);
    out.brief = pick(out.brief, FIELDS);
    if (object(out.practice)) out.practice = Object.fromEntries(Object.entries(out.practice).map(([k, v]) => [k, withReview(v, ['situation', 'facts', 'decision', 'verify', 'date', 'review'])]));
    if (Array.isArray(out.actions)) out.actions = out.actions.map(a => withReview(a, ['id', 'text', 'owner', 'due', 'done', 'review']));
    out.evidence = pickAll(out.evidence, ['id', 'summary', 'source', 'date', 'tool', 'snapshot']);
    out.measurements = pickAll(out.measurements, ['id', 'date', 'phase', 'units', 'failed', 'definition', 'source']);
    out.sessions = pickAll(out.sessions, ['id', 'date', 'goal', 'reality', 'options', 'way', 'actionId', 'mode', 'participant', 'previousReview', 'support', 'nextReview', 'previousId']);
    if (out.context !== undefined) out.context = pick(out.context, ['sector', 'experience']);
    if (out.workflow !== undefined) out.workflow = pick(out.workflow, [...WORKFLOW, 'reviewDate', 'verdict']);
    if (Array.isArray(out.delegations)) out.delegations = out.delegations.map(d => withReview(d, ['id', 'actionId', 'date', 'due', 'checkpoint', 'outcome', 'owner', 'resources', 'authority', 'boundary', 'success', 'acceptance', 'review']));
    if (object(out.simulations)) out.simulations = Object.fromEntries(Object.entries(out.simulations).map(([k, v]) => [k, pick(v, ['date', 'reflection', 'path'])]));
    return out;
  };
  const migrate = s => {
    if (!validState(s)) throw new Error('invalidBackup');
    const next = clone(s);
    if (next.version === 1) {
      next.version = 2;
      for (const p of next.projects) {
        p.context = { sector: next.profile.sector, experience: next.profile.experience };
        p.workflow = workflow(); p.delegations = []; p.simulations = {};
      }
    }
    return next;
  };
  const load = storage => {
    let raw;
    try { raw = storage.getItem(KEY); } catch { return { state: empty(), error: 'notSaved' }; }
    try {
      if (!raw) return { state: empty(), error: null };
      const state = JSON.parse(raw);
      return validState(state) ? { state: migrate(state), error: null } : { state: empty(), error: 'corrupt' };
    } catch { return { state: empty(), error: 'corrupt' }; }
  };
  // Optimistic revision checking prevents a stale tab overwriting newer work.
  const save = (storage, state) => {
    if (!validState(state)) return 'invalid';
    try {
      const raw = storage.getItem(KEY);
      if (raw) {
        let previous;
        try { previous = JSON.parse(raw); } catch { return 'corrupt'; }
        if (!validState(previous)) return 'corrupt';
        if (previous.revision !== state.revision) return 'conflict';
      } else if (state.revision !== 0) return 'conflict';
      const next = { ...state, revision: state.revision + 1 };
      storage.setItem(KEY, JSON.stringify(next));
      state.revision = next.revision;
      return null;
    } catch { return 'notSaved'; }
  };
  const exportBackup = state => JSON.stringify({ format: 'stiven-catalyst-coaching', version: 2, exported: new Date().toISOString(), state: migrate(state) }, null, 2);
  const importBackup = (state, raw) => {
    if (!validState(state) || typeof raw !== 'string' || raw.length > 5 * 1024 * 1024) throw new Error('invalidBackup');
    let backup;
    try { backup = JSON.parse(raw); } catch { throw new Error('invalidBackup'); }
    if (!object(backup) || backup.format !== 'stiven-catalyst-coaching' || ![1, 2].includes(backup.version) || !validState(backup.state) || backup.version !== backup.state.version || state.projects.length + backup.state.projects.length > 100) throw new Error('invalidBackup');
    const next = migrate(state);
    // Always copy: a backup may be older than current work. Do not overwrite it.
    for (const original of migrate(backup.state).projects) {
      const p = known(clone(original));
      p.id = id();
      const actionIds = new Map();
      for (const a of p.actions) { const old = a.id; a.id = id(); actionIds.set(old, a.id); }
      for (const row of [...p.evidence, ...p.measurements]) row.id = id();
      const sessionIds = new Map(p.sessions.map(s => [s.id, id()]));
      for (const session of p.sessions) { session.id = sessionIds.get(session.id); session.actionId = actionIds.get(session.actionId) || id(); if (session.previousId) session.previousId = sessionIds.get(session.previousId) || id(); }
      for (const d of p.delegations) { d.id = id(); d.actionId = actionIds.get(d.actionId) || id(); }
      next.projects.push(p);
      if (!next.active[p.role]) next.active[p.role] = p.id;
    }
    return next;
  };
  const addMeasurement = (project, values) => {
    const row = { id: id(), ...values };
    if (!validMeasurement(row) || project.measurements.some(r => r.date === row.date && r.phase === row.phase)) throw new Error('invalidMeasurement');
    const total = project.measurements.filter(r => r.phase === row.phase).reduce((sum, r) => sum + r.units, row.units);
    if (!Number.isSafeInteger(total)) throw new Error('invalidMeasurement');
    project.measurements.push(row);
    return row;
  };
  const compare = rows => {
    const sum = phase => {
      const selected = rows.filter(r => r.phase === phase);
      const units = selected.reduce((v, r) => v + r.units, 0);
      const failed = selected.reduce((v, r) => v + r.failed, 0);
      return { units, failed, rate: units ? failed / units : null };
    };
    const before = sum('before'), after = sum('after');
    return { before, after, points: before.rate !== null && after.rate !== null ? (after.rate - before.rate) * 100 : null };
  };
  const progress = project => {
    const values = Object.values(project.practice);
    return { total: MODULES[project.role].length, practised: values.length, applied: values.filter(v => v.review).length, next: MODULES[project.role].find(m => !project.practice[m]) || null };
  };
  const actionStatus = (action, day = today()) => action.done ? 'done' : action.due < day ? 'overdue' : 'open';
  const comparable = rows => rows.every(r => typeof r.definition === 'string' && r.definition.trim()) && new Set(rows.map(r => r.definition)).size <= 1;
  const nextStep = (p, day = today()) => {
    if (p.archived) return { key: 'archived', view: 'project' };
    if (p.actions.some(a => !a.done && a.due <= day)) return { key: 'stepAction', view: 'project' };
    if (p.delegations.some(d => !d.review && d.checkpoint <= day && p.actions.some(a => a.id === d.actionId && !a.done))) return { key: 'stepDelegation', view: 'project' };
    const latest = new Map(); p.sessions.filter(s => s.mode === 'one-to-one').forEach(s => latest.set(s.participant.toLowerCase(), s));
    if ([...latest.values()].some(s => s.nextReview <= day)) return { key: 'stepSession', view: 'sessions' };
    if (p.role === 'lumen') {
      if (!p.brief.scope.trim() || !p.brief.target.trim()) return { key: 'stepDefine', view: 'project' };
      if (!p.measurements.some(r => r.phase === 'before')) return { key: 'stepBaseline', view: 'project' };
      if (!p.evidence.some(e => e.snapshot)) return { key: 'stepInvestigate', view: 'project', tool: 'pareto' };
      if (!p.brief.hypothesis.trim() || !p.workflow.supportingEvidence.trim() || !p.workflow.test.trim()) return { key: 'stepHypothesis', view: 'project' };
      if (!p.brief.pilot.trim() || !['pilotOwner', 'criterion', 'guardrail'].every(k => p.workflow[k].trim()) || !date(p.workflow.reviewDate)) return { key: 'stepPilot', view: 'project' };
      if (!p.measurements.some(r => r.phase === 'after')) return { key: 'stepAfter', view: 'project' };
      if (!comparable(p.measurements)) return { key: 'stepComparable', view: 'project' };
      if (!p.workflow.verdict || !p.workflow.reviewResult.trim()) return { key: 'stepReview', view: 'project' };
      if (p.workflow.verdict !== 'adopt') return { key: 'stepReplan', view: 'project' };
      if (!p.brief.control.trim() || !['controlOwner', 'cadence', 'reaction'].every(k => p.workflow[k].trim())) return { key: 'stepControl', view: 'project' };
      return { key: 'stepComplete', view: 'project' };
    }
    const next = progress(p).next;
    return next ? { key: 'next', view: 'pathway', module: next } : { key: 'allPractice', view: 'project' };
  };
  const addResult = (p, snapshot, values) => {
    if (!validSnapshot(snapshot)) throw new Error('invalidResult');
    const row = { id: id(), summary: values.summary, source: values.source, tool: snapshot.tool, date: today(), snapshot: clone(snapshot) };
    if (!validEvidence(row)) throw new Error('invalidResult');
    let action;
    if (values.action?.trim()) {
      action = { id: id(), text: values.action, owner: values.owner, due: values.due, done: false };
      if (!validAction(action)) throw new Error('invalidResult');
    }
    p.evidence.push(row); if (action) p.actions.push(action);
    if (values.useHypothesis && snapshot.tool === 'five-whys') p.brief.hypothesis = snapshot.payload.hypothesis;
    p.updated = today(); return row;
  };
  const simulationNode = (scenario, path) => {
    let node = scenario.start;
    for (const step of path) {
      if (step.node !== node || !scenario.nodes[node]?.choices?.[step.choice]) throw new Error('invalidSimulation');
      node = scenario.nodes[node].choices[step.choice].next;
    }
    if (!scenario.nodes[node]) throw new Error('invalidSimulation');
    return node;
  };
  return { KEY, ROLES, MODULES, FIELDS, WORKFLOW, id, date, today, empty, createProject, validState, migrate, load, save, exportBackup, importBackup, addMeasurement, compare, comparable, progress, nextStep, validSnapshot, addResult, simulationNode, actionStatus };
})();
