(() => {
  'use strict';
  const root = document.querySelector('[data-coaching]');
  if (!root || !window.CoachingCore) return;
  const C = window.CoachingCore;
  const data = JSON.parse(document.getElementById('coaching-data').textContent);
  const lang = ['en', 'de', 'sq'].includes(document.documentElement.lang) ? document.documentElement.lang : 'en';
  const tr = v => v?.[lang] || v?.en || '';
  const tx = key => tr(data.labels[key]);
  const E = v => String(v ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
  const roleId = root.dataset.role, role = data.roles[roleId];
  const app = root.querySelector('[data-coaching-app]'), status = root.querySelector('[data-coaching-status]');
  const storage = { getItem: key => window.localStorage.getItem(key), setItem: (key, value) => window.localStorage.setItem(key, value) };
  const loaded = C.load(storage);
  let state = loaded.state, blocked = loaded.error === 'corrupt' ? 'corrupt' : null, view = blocked ? 'backup' : 'today', moduleId = role.modules[0], dirty = false, fieldIndex = 0, volatile = false;
  const dirtyForms = new Set();
  const current = (s = state) => s.projects.find(p => p.id === s.active[roleId] && p.role === roleId);
  const urlPrefix = (() => {
    const path = location.pathname, marker = '/roles/';
    const base = path.slice(0, path.indexOf(marker));
    return base.endsWith('/de') || base.endsWith('/sq') ? base.slice(0, -3) : base;
  })();
  const toolUrl = slug => `${urlPrefix}${lang === 'en' ? '' : `/${lang}`}/tools/${slug}/?coaching=${encodeURIComponent(current()?.id || '')}`;
  const notice = key => { status.textContent = tx(key); status.dataset.error = key === 'saved' || key === 'imported' ? 'false' : 'true'; };
  if (loaded.error) notice(loaded.error);
  const update = fn => {
    if (blocked) { notice(blocked); return false; }
    const next = JSON.parse(JSON.stringify(state));
    try { fn(next); } catch (error) { notice(error.message in data.labels ? error.message : 'limit'); return false; }
    if (!C.validState(next)) { notice('limit'); return false; }
    const result = C.save(storage, next);
    if (result === 'conflict' || result === 'corrupt') { blocked = result; notice(result); return false; }
    state = next;
    dirty = false;
    dirtyForms.clear();
    volatile = result === 'notSaved';
    notice(result || 'saved');
    return true;
  };
  const leave = () => !dirty || window.confirm(tx('unsaved'));
  const field = (key, value = '', options = {}) => {
    const fieldId = `cw-${key}-${fieldIndex++}`;
    return `<div class="field"><label for="${fieldId}">${E(tx(options.label || key))}</label>${options.area ? `<textarea id="${fieldId}" name="${E(key)}" rows="3" maxlength="${options.max || 10000}" ${options.required ? 'required' : ''}>${E(value)}</textarea>` : `<input id="${fieldId}" name="${E(key)}" type="${options.type || 'text'}" value="${E(value)}" maxlength="${options.max || 200}" ${options.type === 'number' ? 'min="0" step="1" max="9007199254740991"' : ''} ${options.required ? 'required' : ''}>`}</div>`;
  };
  const button = (action, label, cls = 'button-secondary', extra = '') => `<button type="button" class="${cls}" data-action="${action}" ${extra}>${E(tx(label))}</button>`;
  const submit = label => `<button class="button-primary" type="submit">${E(tx(label))}</button>`;
  const fields = (keys, values = {}, required = true) => keys.map(k => field(k, values[k] || '', { area: true, required })).join('');
  const tools = slugs => `<div class="coaching-tools">${slugs.map(slug => `<a class="text-link" href="${E(toolUrl(slug))}">${E(data.toolNames[slug] || slug)} →</a>`).join('')}</div><p class="form-note">${E(tx('toolNote'))}</p>`;
  const moduleById = id => data.modules.find(m => m.id === id);
  const profile = () => `<details ${state.profile.ready ? '' : 'open'} class="coaching-box"><summary>${E(tx(state.profile.ready ? 'editProfile' : 'start'))}</summary><form data-form="profile" class="coaching-form">${field('name', state.profile.name)}<div class="field"><label for="cw-sector">${E(tx('sector'))}</label><select id="cw-sector" name="sector">${['logistics', 'hospitality'].map(v => `<option value="${v}" ${state.profile.sector === v ? 'selected' : ''}>${E(tx(v))}</option>`).join('')}</select></div><div class="field"><label for="cw-experience">${E(tx('experience'))}</label><select id="cw-experience" name="experience">${['beginner', 'experienced'].map(v => `<option value="${v}" ${state.profile.experience === v ? 'selected' : ''}>${E(tx(v))}</option>`).join('')}</select></div>${submit('saveProfile')}</form></details>`;
  const create = () => `<form data-form="create" class="coaching-form coaching-box"><h3>${E(tx('create'))}</h3><p>${E(tr(role.prompt))}</p>${field('title', tr(role.suggested), { required: true })}${fields(['goal', 'measure'])}${field('deadline', C.today(), { type: 'date', required: true })}${submit('create')}</form>`;
  const actionList = p => p.actions.length ? `<ul class="coaching-list">${p.actions.map(a => `<li><div><strong>${E(a.text)}</strong><p>${E(a.owner)} · ${E(a.due)} · ${E(tx(C.actionStatus(a)))}</p></div>${button('toggle-action', a.done ? 'reopen' : 'done', 'button-secondary', `data-id="${E(a.id)}"`)}${button('delete-action', 'delete', 'button-ghost', `data-id="${E(a.id)}"`)}</li>`).join('')}</ul>` : `<p class="form-note">${E(tx('empty'))}</p>`;
  const evidenceList = p => p.evidence.length ? `<ul class="coaching-list">${p.evidence.map(e => `<li><div><strong>${E(e.summary)}</strong><p>${E(e.date)} · ${E(e.source)}${e.tool ? ` · ${E(e.tool)}` : ''}</p></div>${button('delete-evidence', 'delete', 'button-ghost', `data-id="${E(e.id)}"`)}</li>`).join('')}</ul>` : `<p class="form-note">${E(tx('empty'))}</p>`;
  const today = p => `${profile()}${!state.profile.ready ? `<p>${E(tr(role.prompt))}</p>` : p ? (() => {
    const progress = C.progress(p), next = moduleById(progress.next || role.modules[0]);
    const nextAction = progress.next ? button('module', 'next', 'button-primary', `data-id="${E(next.id)}"`) : `<p>${E(tx('allPractice'))}</p>${button('view', 'project', 'button-primary', 'data-view="project"')}`;
    return `<div class="coaching-box"><p class="kicker">${E(tx('outcomes'))}</p><h3>${E(p.title)}</h3><p>${E(p.brief.goal)}</p><p>${E(tx('completed'))}: ${progress.practised}/${progress.total} · ${E(tx('applied'))}: ${progress.applied}/${progress.total}</p><progress max="${progress.total}" value="${progress.practised}" aria-label="${E(tx('completed'))}"></progress><p class="form-note">${E(tx('progressNote'))}</p><p>${E(tx(state.profile.experience === 'experienced' ? 'nextExperienced' : 'nextBeginner'))}</p>${nextAction}<p>${E(tx('deadline'))}: ${E(p.deadline)}${p.archived ? ` · ${E(tx('archived'))}` : ''}</p></div><div class="coaching-box"><h3>${E(tx('actions'))}</h3>${actionList(p)}</div>`;
  })() : create()}`;
  const training = p => {
    const m = moduleById(moduleId), practice = p?.practice[m.id];
    return `<div class="coaching-modules" aria-label="${E(tx('pathway'))}">${role.modules.map(id => `<button type="button" class="button-secondary" data-action="module" data-id="${id}" ${id === moduleId ? 'aria-current="step"' : ''}>${E(tr(moduleById(id).title))}${p?.practice[id] ? ` · ${E(tx(p.practice[id].review ? 'applied' : 'completed'))}` : ''}</button>`).join('')}</div><article class="coaching-box"><p class="kicker">${E(m.method)} · ${E(tx('lessonMinutes'))}</p><h3>${E(tr(m.title))}</h3><h4>${E(tx('lesson'))}</h4><p>${E(tr(m.lesson))}</p><form data-form="quiz"><fieldset><legend>${E(tx('case'))}</legend><p>${E(tr(m.cases[state.profile.sector]))}</p><p><strong>${E(tr(m.question))}</strong></p>${m.choices.map((c, i) => `<label class="coaching-choice"><input type="radio" name="answer" value="${i}" required> <span>${E(tr(c))}</span></label>`).join('')}</fieldset>${submit('check')}<p data-quiz-feedback role="status" aria-live="polite"></p></form><h4>${E(tx('reflection'))}</h4><p>${E(tr(m.reflection))}</p></article>${p ? `<article class="coaching-box"><h3>${E(tx('exercise'))}</h3><p>${E(tr(m.assignment))}</p><p class="form-note">${E(p.title)}</p><form data-form="practice" class="coaching-form">${fields(['situation', 'facts', 'decision', 'verify'], practice)}${submit('savePractice')}</form>${practice ? `<details class="coaching-review" ${practice.review ? '' : 'open'}><summary>${E(tx('reviewPractice'))}</summary><form data-form="review" class="coaching-form">${field('result', practice.review?.result || '', { label: 'observation', area: true, required: true })}${field('date', practice.review?.date || C.today(), { type: 'date', required: true })}${field('reviewer', practice.review?.reviewer || '')}${submit('save')}</form></details>` : ''}<h4>${E(tx('tools'))}</h4>${tools(m.tools)}</article>` : `<div class="coaching-box"><p>${E(tx('noProject'))}</p>${button('view', 'create', 'button-primary', 'data-view="today"')}</div>`}`;
  };
  const project = p => {
    if (!p) return create();
    const comparison = C.compare(p.measurements);
    const percent = rate => rate === null ? '—' : new Intl.NumberFormat(lang === 'en' ? 'en-GB' : 'de-DE', { style: 'percent', maximumFractionDigits: 2 }).format(rate);
    return `<div class="coaching-box"><h3>${E(p.title)}</h3><form data-form="brief" class="coaching-form">${field('title', p.title, { required: true })}${fields(['goal', 'measure'], p.brief)}${field('deadline', p.deadline, { type: 'date', required: true })}<details><summary>${E(tx('charter'))}</summary><div class="coaching-form">${fields(['scope', 'baseline', 'target', 'hypothesis', 'pilot', 'control'], p.brief, false)}</div></details>${submit('save')}</form><div class="tool-actions">${button('print', 'print')}${button('archive', p.archived ? 'unarchive' : 'archive')}</div></div><details class="coaching-box" open><summary>${E(tx('actions'))}</summary>${actionList(p)}<form data-form="action" class="coaching-form">${field('action', '', { area: true, required: true, max: 2000 })}<div class="coaching-row">${field('owner', '', { required: true })}${field('due', C.today(), { type: 'date', required: true })}</div>${submit('addAction')}</form></details><details class="coaching-box"><summary>${E(tx('evidence'))} (${p.evidence.length})</summary>${evidenceList(p)}<form data-form="evidence" class="coaching-form">${field('summary', '', { area: true, required: true })}${field('source', '', { max: 2000 })}${field('date', C.today(), { type: 'date', required: true })}${submit('addEvidence')}</form></details>${roleId !== 'atlas' ? `<details class="coaching-box"><summary>${E(tx('measurements'))} (${p.measurements.length})</summary><p class="form-note">${E(tx('measurementNote'))}</p><div class="coaching-row"><p>${E(tx('before'))}: <strong>${percent(comparison.before.rate)}</strong> (${comparison.before.failed}/${comparison.before.units})</p><p>${E(tx('after'))}: <strong>${percent(comparison.after.rate)}</strong> (${comparison.after.failed}/${comparison.after.units})</p></div><p>${E(tx('change'))}: <strong>${comparison.points === null ? '—' : E(new Intl.NumberFormat(lang === 'en' ? 'en-GB' : 'de-DE', { maximumFractionDigits: 2, signDisplay: 'always' }).format(comparison.points))}</strong></p>${p.measurements.length ? `<div class="coaching-table"><table><thead><tr>${['date', 'phase', 'units', 'failed'].map(k => `<th scope="col">${E(tx(k))}</th>`).join('')}<th scope="col">${E(tx('delete'))}</th></tr></thead><tbody>${p.measurements.map(r => `<tr><td>${E(r.date)}</td><td>${E(tx(r.phase))}</td><td>${r.units}</td><td>${r.failed}</td><td>${button('delete-measurement', 'delete', 'button-ghost', `data-id="${E(r.id)}"`)}</td></tr>`).join('')}</tbody></table></div>` : ''}<form data-form="measurement" class="coaching-form"><div class="coaching-row">${field('date', C.today(), { type: 'date', required: true })}<div class="field"><label for="cw-phase">${E(tx('phase'))}</label><select id="cw-phase" name="phase"><option value="before">${E(tx('before'))}</option><option value="after">${E(tx('after'))}</option></select></div></div><div class="coaching-row">${field('units', '', { type: 'number', required: true })}${field('failed', '', { type: 'number', required: true })}</div>${submit('addMeasurement')}</form></details>` : ''}<details class="coaching-box"><summary>${E(tx('tools'))}</summary>${tools(role.tools)}</details>`;
  };
  const sessions = p => !p ? create() : `<article class="coaching-box"><h3>${E(tx('grow'))}</h3><p>${E(tx('growNote'))}</p><form data-form="session" class="coaching-form">${field('goal', '', { label: 'growGoal', area: true, required: true })}${fields(['reality', 'options', 'way'])}${field('action', '', { area: true, required: true, max: 2000 })}<div class="coaching-row">${field('owner', state.profile.name, { required: true })}${field('due', C.today(), { type: 'date', required: true })}</div>${submit('saveSession')}</form></article><article class="coaching-box"><h3>${E(tx('coachReview'))}</h3><p>${E(tx('coachReviewNote'))}</p><div class="tool-actions">${button('print', 'print')}<a class="text-link" href="${E(`${urlPrefix}${lang === 'en' ? '' : `/${lang}`}/contact.html`)}">${E(tx('contact'))} →</a></div></article><details class="coaching-box"><summary>${E(tx('sessionHistory'))} (${p.sessions.length})</summary>${p.sessions.length ? p.sessions.map(s => `<article class="coaching-entry"><h4>${E(s.date)}</h4>${['goal', 'reality', 'options', 'way'].map(k => `<p><strong>${E(tx(k === 'goal' ? 'growGoal' : k))}</strong><br>${E(s[k])}</p>`).join('')}</article>`).join('') : `<p>${E(tx('empty'))}</p>`}</details>`;
  const backup = () => `<div class="coaching-box"><h3>${E(tx('backup'))}</h3><p>${E(tx('privacy'))}</p><p class="form-note">${E(tx('restoreNote'))}</p>${button('export', 'export', 'button-primary')}<form data-form="import" class="coaching-form"><div class="field"><label for="cw-backup">${E(tx('restore'))}</label><input id="cw-backup" type="file" name="backup" accept=".json,application/json" required></div>${submit('restore')}</form></div><div class="coaching-box"><h3>${E(tx('project'))}</h3>${state.projects.length ? `<ul class="coaching-list">${state.projects.map(p => `<li><div><strong>${E(p.title)}</strong><p>${E(tr(data.roles[p.role].name))} · ${E(p.updated)} ${p.archived ? `· ${E(tx('archived'))}` : ''}</p></div><a class="text-link" href="${E(`${urlPrefix}${lang === 'en' ? '' : `/${lang}`}/roles/${data.roles[p.role].slug}/?project=${p.id}#coaching`)}">${E(tx('open'))} →</a>${p.role === roleId ? button('delete-project', 'delete', 'button-ghost', `data-id="${E(p.id)}"`) : ''}</li>`).join('')}</ul>` : `<p>${E(tx('empty'))}</p>`}</div>`;
  const render = (focus = false) => {
    fieldIndex = 0;
    const p = current(), projects = state.projects.filter(p => p.role === roleId);
    app.innerHTML = `<nav class="coaching-nav" aria-label="${E(tx('coaching'))}">${['today', 'pathway', 'project', 'sessions', 'backup'].map(v => button('view', v, 'button-secondary', `data-view="${v}" ${view === v ? 'aria-current="page"' : ''}`)).join('')}</nav>${projects.length ? `<div class="coaching-project-picker"><div class="field"><label for="cw-active">${E(tx('chooseProject'))}</label><select id="cw-active" data-project-select>${projects.map(pr => `<option value="${E(pr.id)}" ${p?.id === pr.id ? 'selected' : ''}>${E(pr.title)}${pr.archived ? ` · ${E(tx('archived'))}` : ''}</option>`).join('')}</select></div>${button('new', 'newProject')}</div>` : ''}<div class="coaching-content" tabindex="-1">${({ today, pathway: training, project, sessions, backup })[view](p)}</div>`;
    if (blocked) app.querySelectorAll('form:not([data-form="import"]) input, form:not([data-form="import"]) textarea, form:not([data-form="import"]) select, form:not([data-form="import"]) button, [data-project-select], [data-action="new"], [data-action^="delete"], [data-action="toggle-action"], [data-action="archive"]').forEach(el => el.disabled = true);
    if (focus) app.querySelector('.coaching-content').focus({ preventScroll: true });
  };
  const download = (content, filename) => {
    const url = URL.createObjectURL(new Blob([content], { type: 'application/json' }));
    const link = document.createElement('a'); link.href = url; link.download = filename; document.body.append(link); link.click(); link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  const print = p => {
    const report = document.createElement('article'); report.className = 'coaching-print';
    const group = (heading, content) => `<section><h2>${E(tx(heading))}</h2>${content}</section>`;
    const paragraphs = entries => entries.map(([key, value]) => `<p><strong>${E(tx(key))}</strong><br>${E(value)}</p>`).join('');
    const comparison = C.compare(p.measurements);
    report.innerHTML = `<h1>${E(tx('report'))}</h1><p>Stiven Catalyst · ${E(tr(role.name))}</p><h2>${E(p.title)}</h2><p>${E(tx('deadline'))}: ${E(p.deadline)}</p>${group('charter', paragraphs(C.FIELDS.map(k => [k, p.brief[k]])))}${group('actions', p.actions.map(a => `<p>${E(a.text)} · ${E(a.owner)} · ${E(a.due)} · ${E(tx(C.actionStatus(a)))}</p>`).join(''))}${group('evidence', p.evidence.map(e => `<p>${E(e.date)} · ${E(e.summary)}<br>${E(e.source)} ${E(e.tool)}</p>`).join(''))}${group('pathway', Object.entries(p.practice).map(([id, practice]) => `<h3>${E(tr(moduleById(id).title))}</h3>${paragraphs(['situation', 'facts', 'decision', 'verify'].map(k => [k, practice[k]]))}${practice.review ? `<p>${E(tx('applied'))} · ${E(practice.review.date)} · ${E(practice.review.reviewer)}<br>${E(practice.review.result)}</p>` : ''}`).join(''))}${group('sessions', p.sessions.map(s => `<h3>${E(s.date)}</h3>${paragraphs(['goal', 'reality', 'options', 'way'].map(k => [k === 'goal' ? 'growGoal' : k, s[k]]))}`).join(''))}${p.measurements.length ? group('measurements', `<p>${E(tx('measurementNote'))}</p><p>${E(tx('before'))}: ${comparison.before.failed}/${comparison.before.units} · ${E(tx('after'))}: ${comparison.after.failed}/${comparison.after.units}</p>${p.measurements.map(r => `<p>${E(r.date)} · ${E(tx(r.phase))} · ${r.failed}/${r.units}</p>`).join('')}`) : ''}<p>${E(tx('progressNote'))}</p>`;
    document.querySelector('.coaching-print')?.remove(); document.body.append(report); document.body.classList.add('coaching-printing');
    window.print();
  };
  window.addEventListener('afterprint', () => { document.body.classList.remove('coaching-printing'); document.querySelector('.coaching-print')?.remove(); });
  app.addEventListener('input', event => {
    const form = event.target.closest('form');
    if (form && event.target.type !== 'radio' && event.target.type !== 'file') { dirty = true; dirtyForms.add(form.dataset.form); }
  });
  window.addEventListener('beforeunload', event => { if (dirty || volatile) { event.preventDefault(); event.returnValue = ''; } });
  window.addEventListener('storage', event => { if (event.key === C.KEY) { blocked = 'conflict'; notice('conflict'); } });
  app.addEventListener('change', event => {
    if (!event.target.matches('[data-project-select]')) return;
    if (!leave()) { event.target.value = current()?.id || ''; return; }
    if (update(s => { s.active[roleId] = event.target.value; })) render();
  });
  app.addEventListener('click', event => {
    const el = event.target.closest('[data-action]'); if (!el) return;
    const action = el.dataset.action, p = current();
    if (['view', 'module', 'new', 'print', 'delete-project', 'archive', 'toggle-action'].includes(action) && !leave()) return;
    if (action === 'view') { view = el.dataset.view; dirty = false; dirtyForms.clear(); render(true); }
    else if (action === 'module') { moduleId = el.dataset.id; view = 'pathway'; dirty = false; dirtyForms.clear(); render(true); }
    else if (action === 'new') { dirty = false; dirtyForms.clear(); app.querySelector('.coaching-content').innerHTML = create(); app.querySelector('[name="title"]').focus(); }
    else if (action === 'export') download(C.exportBackup(state), `stiven-coaching-${C.today()}.json`);
    else if (action === 'print' && p) print(p);
    else if (action === 'archive') { if (update(s => { current(s).archived = !p.archived; })) render(); }
    else if (action === 'toggle-action') { if (update(s => { const a = current(s).actions.find(a => a.id === el.dataset.id); a.done = !a.done; })) render(); }
    else if (action.startsWith('delete-') && window.confirm(tx('confirmDelete'))) {
      if (!leave()) return;
      if (update(s => {
        if (action === 'delete-project') {
          s.projects = s.projects.filter(pr => pr.id !== el.dataset.id);
          if (s.active[roleId] === el.dataset.id) s.active[roleId] = s.projects.find(pr => pr.role === roleId)?.id || '';
        } else {
          const project = current(s);
          const key = { 'delete-action': 'actions', 'delete-evidence': 'evidence', 'delete-measurement': 'measurements' }[action];
          project[key] = project[key].filter(row => row.id !== el.dataset.id);
        }
      })) render();
    }
  });
  app.addEventListener('submit', async event => {
    const form = event.target.closest('form[data-form]'); if (!form) return;
    event.preventDefault();
    if (!form.reportValidity()) return;
    const values = Object.fromEntries(new FormData(form));
    for (const key in values) if (typeof values[key] === 'string') values[key] = values[key].trim();
    const kind = form.dataset.form;
    if (kind !== 'quiz' && [...dirtyForms].some(name => name !== kind) && !leave()) return;
    if (kind === 'quiz') {
      const m = moduleById(moduleId), feedback = form.querySelector('[data-quiz-feedback]');
      feedback.textContent = `${tx(Number(values.answer) === m.correct ? 'correct' : 'reconsider')} ${tr(m.explanation)}`;
      return;
    }
    if (kind === 'import') {
      const file = values.backup;
      if (!file || file.size > 5 * 1024 * 1024) { notice('invalidBackup'); return; }
      try {
        const next = C.importBackup(state, await file.text());
        if (blocked === 'corrupt') {
          if (!window.confirm(tx('recover'))) return;
          const old = storage.getItem(C.KEY);
          if (old) download(old, `stiven-coaching-unreadable-${C.today()}.json`);
          // Explicit recovery only after backup validation and confirmation.
          next.revision = 1;
          storage.setItem(C.KEY, JSON.stringify(next));
          state = next; blocked = null;
        } else if (blocked || !update(s => { s.projects = next.projects; s.active = next.active; })) return;
        notice('imported'); dirty = false; render();
      } catch { notice('invalidBackup'); }
      return;
    }
    const ok = update(s => {
      if (kind === 'profile') { s.profile = { name: values.name, sector: values.sector, experience: values.experience, ready: true }; return; }
      if (kind === 'create') { const p = C.createProject(roleId, values); s.projects.push(p); s.active[roleId] = p.id; s.profile.ready = true; view = 'today'; return; }
      const p = current(s); if (!p) throw new Error('noProject'); p.updated = C.today();
      if (kind === 'brief') { p.title = values.title; p.deadline = values.deadline; C.FIELDS.forEach(k => p.brief[k] = values[k]); }
      if (kind === 'practice') p.practice[moduleId] = { ...values, date: C.today(), review: null };
      if (kind === 'review') p.practice[moduleId].review = { ...values };
      if (kind === 'action') p.actions.push({ id: C.id(), text: values.action, owner: values.owner, due: values.due, done: false });
      if (kind === 'evidence') p.evidence.push({ id: C.id(), ...values, tool: '' });
      if (kind === 'measurement') C.addMeasurement(p, { date: values.date, phase: values.phase, units: Number(values.units), failed: Number(values.failed) });
      if (kind === 'session') {
        const action = { id: C.id(), text: values.action, owner: values.owner, due: values.due, done: false };
        p.actions.push(action); p.sessions.push({ id: C.id(), date: C.today(), goal: values.goal, reality: values.reality, options: values.options, way: values.way, actionId: action.id });
      }
    });
    if (ok) render();
  });
  const query = new URLSearchParams(location.search);
  const requestedProject = query.get('project');
  if (requestedProject) {
    if (state.projects.some(p => p.id === requestedProject && p.role === roleId)) update(s => { s.active[roleId] = requestedProject; });
    else notice('unavailable');
    view = 'project';
  } else if (!current() && state.projects.some(p => p.role === roleId) && !blocked) update(s => { s.active[roleId] = s.projects.find(p => p.role === roleId).id; });
  if (role.modules.includes(query.get('module'))) { moduleId = query.get('module'); view = 'pathway'; }
  render();
})();
