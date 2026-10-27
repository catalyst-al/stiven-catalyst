const { launch } = require('./pw.cjs');
const B='http://localhost:8104';
const X = '"><img src=x onerror="window.__xss=(window.__xss||0)+1"><svg onload="window.__xss=(window.__xss||0)+1">\'';
(async () => {
  const b = await launch(); const ctx = await b.newContext(); const p = await ctx.newPage();
  let dialogs=0; p.on('dialog', d=>{dialogs++; d.dismiss();});
  const errs=[]; p.on('pageerror', e=>errs.push(e.message));
  await p.goto(`${B}/roles/process-manager/`); await p.waitForTimeout(500);
  const ok = await p.evaluate((X) => {
    const C = window.CoachingCore;
    const s = C.empty(); s.profile = { name: X, sector: 'logistics', experience: 'beginner', ready: true };
    const roleId = document.querySelector('[data-coaching]').dataset.role;
    const pr = C.createProject(roleId, { title: X.slice(0,190), deadline: '2026-12-31', goal: X, measure: X, scope: X, baseline: X, target: X, hypothesis: X, pilot: X, control: X });
    pr.actions.push({ id: 'a1', text: X, owner: X.slice(0,190), due: '2026-10-01', done: false });
    pr.evidence.push({ id: 'e1', summary: X, source: X, date: '2026-10-01', tool: '' });
    pr.sessions.push({ id: 's1', date: '2026-10-01', goal: X, reality: X, options: X, way: X, actionId: 'a1', mode: 'self' });
    pr.measurements.push({ id: 'm1', date: '2026-10-01', phase: 'before', units: 10, failed: 1, definition: X, source: X });
    for (const k of Object.keys(pr.workflow)) if (k!=='reviewDate' && k!=='verdict') pr.workflow[k] = X;
    pr.delegations.push({ id:'d1', actionId:'a1', date:'2026-10-01', due:'2026-10-20', checkpoint:'2026-10-10', outcome:X, owner:X.slice(0,190), resources:X, authority:X, boundary:X, success:X, acceptance:X });
    s.projects.push(pr); s.active[roleId] = pr.id;
    const valid = C.validState(s);
    localStorage.setItem(C.KEY, JSON.stringify(s));
    return { valid, roleId, id: pr.id };
  }, X);
  console.log('state valid', ok);
  await p.reload(); await p.waitForTimeout(800);
  for (const view of ['today','pathway','project','sessions','backup']) {
    await p.click(`.coaching-nav button[data-view="${view}"]`).catch(e=>console.log('nav fail', view));
    await p.waitForTimeout(300);
    // open all details
    await p.evaluate(()=>document.querySelectorAll('details').forEach(d=>d.open=true));
    await p.waitForTimeout(200);
    const r = await p.evaluate(()=>({xss: window.__xss||0, imgs: document.querySelectorAll('img[src="x"]').length, textHits: document.body.innerText.split('onerror').length-1}));
    console.log(view, JSON.stringify(r));
  }
  // bridge page
  await p.goto(`${B}/tools/five-whys/?coaching=${ok.id}`); await p.waitForTimeout(800);
  console.log('bridge', JSON.stringify(await p.evaluate(()=>({xss: window.__xss||0, imgs: document.querySelectorAll('img[src="x"]').length, shown: !!document.querySelector('#coaching-bridge-title')}))));
  console.log('dialogs',dialogs,'errors',errs.slice(0,5));
  await b.close();
})();
