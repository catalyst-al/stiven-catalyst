const { launch } = require('./pw.cjs');
const B='http://localhost:8104'; const D=__dirname+'/';
(async () => {
  const b = await launch();
  for (const f of ['out/ats-cv-en.pdf','out/cv-builder-en.pdf','out/cv-builder-sq.pdf']) {
    const ctx = await b.newContext(); const p = await ctx.newPage(); p.on('dialog', d=>d.accept());
    await p.goto(`${B}/tools/ats-cv/`); await p.waitForTimeout(300);
    await p.setInputFiles('[data-import-file]', D+f); await p.waitForTimeout(4000);
    const cv = JSON.parse(await p.evaluate(()=>localStorage.getItem('sc-ats-cv'))||'null');
    console.log('==', f, JSON.stringify({ person: cv.person, jobs: cv.experience.map(j=>[j.title,j.company,j.from,j.to,j.bullets.split('\n').length]), edu: cv.education.map(e=>e.title), extras: cv.extras.map(e=>[e.title, e.text.slice(0,200)]) }));
    await ctx.close();
  }
  await b.close();
})();
