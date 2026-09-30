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
  const empty = () => ({ version: 1, revision: 0, profile: { name: '', sector: 'logistics', experience: 'beginner', ready: false }, projects: [], active: {} });
  const createProject = (role, values) => ({
    id: id(), role, title: String(values.title).trim(), created: today(), updated: today(), deadline: values.deadline,
    archived: false, brief: Object.fromEntries(FIELDS.map(f => [f, String(values[f] || '').trim()])),
    practice: {}, actions: [], evidence: [], measurements: [], sessions: []
  });
  const list = (v, predicate, max = 2000) => Array.isArray(v) && v.length <= max && v.every(predicate);
  const validReview = v => object(v) && date(v.date) && text(v.result) && v.result.trim().length > 0 && text(v.reviewer, 200);
  const validPractice = v => object(v) && ['situation', 'facts', 'decision', 'verify'].every(k => text(v[k]) && v[k].trim()) && date(v.date) && (v.review === null || validReview(v.review));
  const validAction = v => object(v) && validId(v.id) && text(v.text, 2000) && v.text.trim() && text(v.owner, 200) && v.owner.trim() && date(v.due) && typeof v.done === 'boolean';
  const validEvidence = v => object(v) && validId(v.id) && text(v.summary) && v.summary.trim() && text(v.source, 2000) && date(v.date) && (v.tool === '' || /^[a-z0-9-]{1,100}$/.test(v.tool));
  const validMeasurement = v => object(v) && validId(v.id) && date(v.date) && ['before', 'after'].includes(v.phase) && Number.isSafeInteger(v.units) && v.units > 0 && Number.isSafeInteger(v.failed) && v.failed >= 0 && v.failed <= v.units;
  const validSession = v => object(v) && validId(v.id) && date(v.date) && ['goal', 'reality', 'options', 'way'].every(k => text(v[k]) && v[k].trim()) && validId(v.actionId);
  const uniqueIds = rows => new Set(rows.map(r => r.id)).size === rows.length;
  const validProject = p => object(p) && validId(p.id) && ROLES.includes(p.role) && text(p.title, 200) && p.title.trim() && date(p.created) && date(p.updated) && date(p.deadline) && typeof p.archived === 'boolean'
    && object(p.brief) && FIELDS.every(k => text(p.brief[k])) && p.brief.goal.trim() && p.brief.measure.trim()
    && object(p.practice) && Object.entries(p.practice).every(([k, v]) => MODULES[p.role].includes(k) && validPractice(v))
    && list(p.actions, validAction) && uniqueIds(p.actions)
    && list(p.evidence, validEvidence) && uniqueIds(p.evidence)
    && list(p.measurements, validMeasurement) && uniqueIds(p.measurements) && new Set(p.measurements.map(r => `${r.phase}/${r.date}`)).size === p.measurements.length
    && ['before', 'after'].every(phase => Number.isSafeInteger(p.measurements.filter(r => r.phase === phase).reduce((sum, r) => sum + r.units, 0)))
    && list(p.sessions, validSession) && uniqueIds(p.sessions);
  const validState = s => object(s) && s.version === 1 && Number.isSafeInteger(s.revision) && s.revision >= 0
    && object(s.profile) && text(s.profile.name, 200) && ['logistics', 'hospitality'].includes(s.profile.sector) && ['beginner', 'experienced'].includes(s.profile.experience) && typeof s.profile.ready === 'boolean'
    && list(s.projects, validProject, 100) && uniqueIds(s.projects)
    && object(s.active) && Object.entries(s.active).every(([role, value]) => ROLES.includes(role) && (value === '' || s.projects.some(p => p.id === value && p.role === role)));
  const clone = v => JSON.parse(JSON.stringify(v));
  const load = storage => {
    let raw;
    try { raw = storage.getItem(KEY); } catch { return { state: empty(), error: 'notSaved' }; }
    try {
      if (!raw) return { state: empty(), error: null };
      const state = JSON.parse(raw);
      return validState(state) ? { state, error: null } : { state: empty(), error: 'corrupt' };
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
  const exportBackup = state => JSON.stringify({ format: 'stiven-catalyst-coaching', version: 1, exported: new Date().toISOString(), state }, null, 2);
  const importBackup = (state, raw) => {
    if (!validState(state) || typeof raw !== 'string' || raw.length > 5 * 1024 * 1024) throw new Error('invalidBackup');
    let backup;
    try { backup = JSON.parse(raw); } catch { throw new Error('invalidBackup'); }
    if (!object(backup) || backup.format !== 'stiven-catalyst-coaching' || backup.version !== 1 || !validState(backup.state) || state.projects.length + backup.state.projects.length > 100) throw new Error('invalidBackup');
    const next = clone(state);
    // Always copy: a backup may be older than current work. Do not overwrite it.
    for (const original of backup.state.projects) {
      const p = clone(original);
      p.id = id();
      const actionIds = new Map();
      for (const a of p.actions) { const old = a.id; a.id = id(); actionIds.set(old, a.id); }
      for (const row of [...p.evidence, ...p.measurements]) row.id = id();
      for (const session of p.sessions) { session.id = id(); session.actionId = actionIds.get(session.actionId) || id(); }
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
  return { KEY, ROLES, MODULES, FIELDS, id, date, today, empty, createProject, validState, load, save, exportBackup, importBackup, addMeasurement, compare, progress, actionStatus };
})();
