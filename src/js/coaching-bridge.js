(() => {
  'use strict';
  const root = document.querySelector('[data-coaching-bridge]');
  const projectId = new URLSearchParams(location.search).get('coaching');
  if (!root || !projectId || !window.CoachingCore) return;
  root.hidden = false;
  const C = window.CoachingCore;
  const storage = { getItem: key => window.localStorage.getItem(key), setItem: (key, value) => window.localStorage.setItem(key, value) };
  const loaded = C.load(storage);
  const p = loaded.state.projects.find(p => p.id === projectId);
  const data = JSON.parse(document.getElementById('coaching-data').textContent);
  const lang = ['en', 'de', 'sq'].includes(document.documentElement.lang) ? document.documentElement.lang : 'en';
  const tx = key => data.labels[key][lang];
  const E = v => String(v ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
  const app = root.querySelector('[data-coaching-bridge-app]'), status = root.querySelector('[data-coaching-bridge-status]');
  if (!p) { app.innerHTML = `<p>${E(tx('unavailable'))}</p>`; return; }
  const base = location.pathname.slice(0, location.pathname.indexOf('/tools/'));
  const returnUrl = `${base}/roles/${data.roles[p.role].slug}/?project=${encodeURIComponent(p.id)}#coaching`;
  const slug = location.pathname.match(/\/tools\/([a-z0-9-]+)\//)?.[1] || '';
  const structured = window.CoachingToolResult?.tool === slug;
  app.innerHTML = `<header class="role-ring-head"><p class="kicker">${E(tx('bridge'))}</p><h2 id="coaching-bridge-title">${E(p.title)}</h2></header><p class="form-note">${E(tx(structured ? 'resultReady' : 'toolNote'))}</p>${structured ? `<p>${E(tx('resultMeaning'))}</p><details open><summary>${E(tx('resultSnapshot'))}</summary><div data-result-preview></div></details>` : ''}<form class="coaching-form"><div class="field"><label for="cb-summary">${E(tx(structured ? 'conclusion' : 'summary'))}</label><textarea id="cb-summary" name="summary" rows="3" maxlength="10000" required></textarea></div><div class="field"><label for="cb-source">${E(tx('source'))}</label><input id="cb-source" name="source" maxlength="2000"></div>${structured ? `<div class="field"><label for="cb-action">${E(tx('optionalAction'))}</label><textarea id="cb-action" name="action" maxlength="2000" rows="2"></textarea></div><div class="coaching-row"><div class="field"><label for="cb-owner">${E(tx('owner'))}</label><input id="cb-owner" name="owner" maxlength="200"></div><div class="field"><label for="cb-due">${E(tx('due'))}</label><input id="cb-due" name="due" type="date"></div></div>${slug === 'five-whys' ? `<label class="coaching-choice"><input type="checkbox" name="useHypothesis"><span>${E(tx('useHypothesis'))}</span></label>` : ''}` : ''}<button class="button-primary" type="submit">${E(tx(structured ? 'attachResult' : 'addEvidence'))}</button></form><p><a class="text-link" href="${E(returnUrl)}">${E(tx('returnProject'))} →</a></p>`;
  const preview = () => {
    if (!structured) return;
    const snapshot = window.CoachingToolResult.get(), valid = C.validSnapshot(snapshot);
    app.querySelector('[data-result-preview]').innerHTML = valid ? window.CoachingResults.html(snapshot, tx, E, lang) : `<p>${E(tx('noResult'))}</p>`;
    app.querySelector('button[type="submit"]').disabled = !valid;
  };
  window.addEventListener('coaching:result', preview); preview();
  app.querySelector('form').addEventListener('input', event => {
    if (!structured || event.target.name !== 'action') return;
    const form = event.currentTarget;
    form.elements.owner.required = form.elements.due.required = !!form.elements.action.value.trim();
  });
  app.querySelector('form').addEventListener('submit', event => {
    event.preventDefault();
    const form = event.target;
    if (!form.reportValidity()) return;
    // Read at submission time, so recent work in another tab is retained.
    const loaded = C.load(storage);
    const project = loaded.state.projects.find(p => p.id === projectId);
    if (loaded.error || !project) { status.textContent = tx(loaded.error || 'unavailable'); return; }
    const values = Object.fromEntries(new FormData(form));
    const summary = values.summary.trim();
    if (!summary) { status.textContent = tx('limit'); return; }
    try {
      if (structured) C.addResult(project, window.CoachingToolResult.get(), { ...values, summary, source: values.source.trim(), useHypothesis: values.useHypothesis === 'on' });
      else project.evidence.push({ id: C.id(), summary, source: values.source.trim(), tool: slug, date: C.today() });
    } catch { status.textContent = tx('invalidResult'); preview(); return; }
    project.updated = C.today();
    const error = C.save(storage, loaded.state);
    status.textContent = tx(error === 'invalid' ? 'limit' : error || 'bridgeSaved');
    if (!error) { form.reset(); if (structured) form.elements.owner.required = form.elements.due.required = false; }
  });
})();
