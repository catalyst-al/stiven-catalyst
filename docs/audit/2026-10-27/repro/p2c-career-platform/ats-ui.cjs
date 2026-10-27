const { launch } = require('./pw.cjs');
const adEN = `Operations Manager – Logistics. You will lead a team of 40 associates across two shifts, own KPIs such as on-time delivery and cost per parcel, drive continuous improvement using Lean and Six Sigma, and report weekly to the site leader. Requirements: 5+ years in logistics operations, people leadership, Excel, SQL, Power BI, WMS experience (SAP EWM preferred). You will also coach team leads and ensure safety compliance.`;
const cvA = { person:{name:'Ana Test',email:'a@b.de',phone:'+49 170 1234567'}, summary:'Logistics operations manager with Lean Six Sigma Green Belt, SQL, Power BI, SAP EWM and WMS. Led 60 people, KPIs, safety.', experience:[{title:'Operations Manager',company:'DHL',from:'01.2020',to:'',bullets:'Cut cost per parcel 12% with Lean and Six Sigma\nBuilt SQL and Power BI KPI dashboards\nRan SAP EWM WMS go-live'}], skills:[{title:'Tools',text:'Excel, SQL, Power BI, SAP EWM, WMS'}]};
const cvB = { person:{name:'Bob Noise'}, summary:'I ensure weekly using drive people report leader shifts parcel delivery on-time associates continuous improvement compliance safety coach power sigma excel manager leadership logistics operations.' };
(async () => {
  const b = await launch();
  for (const [label, cv] of [['A hard skills', cvA], ['B noise words only', cvB]]) {
    const ctx = await b.newContext(); const p = await ctx.newPage();
    await p.goto('http://localhost:8104/tools/ats-cv/');
    await p.evaluate(([cv, ad]) => localStorage.setItem('sc-ats-cv', JSON.stringify({ ...cv, jobAd: ad })), [cv, adEN]);
    await p.reload(); await p.waitForTimeout(800);
    const t = await p.locator('[data-match]').innerText();
    const badge = await p.locator('[data-check-badge]').innerText();
    console.log('==', label, '\n', t.replace(/\n+/g,' | '), '\n', badge);
    await ctx.close();
  }
  await b.close();
})();
