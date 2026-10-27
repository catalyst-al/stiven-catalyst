const { launch } = require('./pw.cjs');
const fs=require('fs');
const B='http://localhost:8104';
const SITE='$SRC/_site';
(async () => {
  const b = await launch(); const ctx = await b.newContext(); const p = await ctx.newPage();
  p.on('dialog', d=>d.accept());
  const tools = fs.readdirSync(SITE+'/tools');
  const pages = ['/','/insights/','/shelf.html','/search.html','/tools.html','/roles/shift-lead/','/podcast.html', '/magazine/', ...tools.map(t=>`/tools/${t}/`)];
  const seen = new Map();
  for (const path of pages) {
    await p.goto(B+path).catch(()=>{}); await p.waitForTimeout(250);
    // click first "example" button if any
    const ex = p.locator('[data-act="example"], [data-example], button:has-text("Load the example"), button:has-text("Try the example")').first();
    if (await ex.count()) { await ex.click({ timeout: 1500 }).catch(()=>{}); await p.waitForTimeout(400); }
    const keys = await p.evaluate(()=>Object.keys(localStorage));
    for (const k of keys) if (!seen.has(k)) seen.set(k, path);
  }
  const idb = await p.evaluate(async()=> (await indexedDB.databases()).map(d=>d.name));
  const ss = await p.evaluate(()=>Object.keys(sessionStorage));
  const caches_ = await p.evaluate(async()=> await caches.keys());
  const backup = await p.evaluate(()=>Object.keys(window.WorkBackup.makeBackup(localStorage).items));
  console.log('localStorage keys:', seen.size); for (const [k,v] of [...seen].sort()) console.log(' ', k, '<-', v, backup.includes(k)?'':'  [NOT IN BACKUP]');
  console.log('IDB', idb, 'session', ss, 'caches', caches_);
  fs.writeFileSync(__dirname+'/inventory.json', JSON.stringify({ls:[...seen], idb, ss, caches_}, null, 1));
  // round trip: export, wipe, import
  const before = await p.evaluate(()=>Object.fromEntries(Object.keys(localStorage).map(k=>[k, localStorage.getItem(k)])));
  const file = JSON.stringify(await p.evaluate(()=>window.WorkBackup.makeBackup(localStorage)));
  fs.writeFileSync(__dirname+'/files/roundtrip.json', file);
  await p.evaluate(()=>localStorage.clear());
  await p.goto(B+'/tools.html'); await p.waitForTimeout(300);
  await p.setInputFiles('[data-work-open]', __dirname+'/files/roundtrip.json'); await p.waitForTimeout(2500);
  const after = await p.evaluate(()=>Object.fromEntries(Object.keys(localStorage).map(k=>[k, localStorage.getItem(k)])));
  const diff = Object.keys(before).filter(k=>before[k]!==after[k]);
  console.log('roundtrip keys before', Object.keys(before).length, 'after', Object.keys(after).length, 'differing:', diff);
  await b.close();
})();
