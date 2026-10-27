const { launch } = require('./pw.cjs');
const B='http://localhost:8104'; const F=__dirname+'/files/';
(async () => {
  const b = await launch();
  for (const f of ['notjson.json','wrongversion.json','nonsc.json','team-key.json','bad-actions.json','proto.json','cv-garbage.json','crafted-shelf.json']) {
    const ctx = await b.newContext(); const p = await ctx.newPage();
    p.on('dialog', d=>d.accept());
    const errs=[]; p.on('pageerror', e=>errs.push(e.message));
    await p.goto(`${B}/tools.html`); await p.waitForTimeout(400);
    await p.evaluate(()=>localStorage.setItem('sc-shelf', JSON.stringify({v:1,items:[{u:'/insights/',t:'mine',k:'page',l:'en',at:5}]})));
    await p.setInputFiles('[data-work-open]', F+f);
    await p.waitForTimeout(1500);
    const status = await p.locator('[data-work-status]').innerText().catch(()=>'' );
    const keys = await p.evaluate(()=>Object.keys(localStorage).sort());
    const proto = await p.evaluate(()=>({polluted: ({}).polluted, x: ({}).x, isAdmin: ({}).isAdmin}));
    console.log('==',f,'|',status.slice(0,140),'|',keys.join(','), JSON.stringify(proto), errs.join(';'));
    if (f==='crafted-shelf.json' || f==='cv-garbage.json') {
      if (f==='crafted-shelf.json') {
        await p.goto(`${B}/shelf.html`); await p.waitForTimeout(800);
        const links = await p.locator('[data-shelf-saved] a').evaluateAll(a=>a.map(x=>[x.getAttribute('href'), x.href, x.textContent.slice(0,50)]));
        console.log(' shelf links', JSON.stringify(links), 'xss', await p.evaluate(()=>window.__xss||0));
      } else {
        for (const t of ['cv-builder','ats-cv','cover-letter']) {
          await p.goto(`${B}/tools/${t}/`); await p.waitForTimeout(700);
          console.log(' ',t, 'stored now:', (await p.evaluate((t)=>localStorage.getItem('sc-'+t),t)||'').slice(0,80), 'xss', await p.evaluate(()=>window.__xss||0), errs.join(';'));
        }
      }
    }
    await ctx.close();
  }
  await b.close();
})();
