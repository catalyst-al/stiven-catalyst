const { launch } = require('./pw.cjs');
(async () => {
  const b = await launch(); const p = await b.newPage();
  await p.goto('http://localhost:8104/roles/shift-lead/'); await p.waitForTimeout(400);
  const r = await p.evaluate(() => {
    const C = window.CoachingCore; let s = C.empty();
    s.projects.push(C.createProject('pulse', { title: 'P1', deadline: '2026-12-31', goal: 'g', measure: 'm' }));
    const backup = C.exportBackup(s);
    let t = C.importBackup(s, backup); t = C.importBackup(t, backup);
    let err=''; try { const big = C.empty(); for (let i=0;i<60;i++) big.projects.push(C.createProject('pulse',{title:'x'+i,deadline:'2026-12-31',goal:'g',measure:'m'})); const bk=C.exportBackup(big); C.importBackup(big, bk);} catch(e){ err=e.message; }
    return { after2imports: t.projects.map(p=>p.title), overLimit: err };
  });
  console.log(JSON.stringify(r)); await b.close();
})();
