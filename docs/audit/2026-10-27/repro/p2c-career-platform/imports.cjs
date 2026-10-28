const { launch } = require('./pw.cjs');
const B='http://localhost:8104'; const D=__dirname+'/';
(async () => {
  const b = await launch();
  const files = ['imp/fake.pdf','imp/trunc.pdf','imp/nodoc.docx','imp/garbage.docx','imp/empty.txt','out/ats-cv-en.docx','out/ats-cv-en.pdf','out/cv-builder-en.pdf','out/cv-builder-de.pdf','out/cover-letter-en.docx'];
  // reference: example CV in ats
  let ctx = await b.newContext(); let p = await ctx.newPage(); p.on('dialog', d=>d.accept());
  await p.goto(`${B}/tools/ats-cv/`); await p.locator('[data-act="example"]').first().click(); await p.waitForTimeout(500);
  const ref = JSON.parse(await p.evaluate(()=>localStorage.getItem('sc-ats-cv')));
  await ctx.close();
  for (const f of files) {
    ctx = await b.newContext(); p = await ctx.newPage(); p.on('dialog', d=>d.accept());
    const errs=[]; p.on('pageerror', e=>errs.push(e.message)); p.on('crash', ()=>errs.push('CRASH'));
    await p.goto(`${B}/tools/ats-cv/`); await p.waitForTimeout(300);
    const t0 = Date.now();
    await p.setInputFiles('[data-import-file]', D+f);
    let note='';
    for (let i=0;i<60;i++){ await p.waitForTimeout(250); note = await p.locator('[data-import-note]').innerText().catch(()=>'?'); if (note && !/^Reading/.test(note)) break; }
    const ms = Date.now()-t0;
    const cv = JSON.parse(await p.evaluate(()=>localStorage.getItem('sc-ats-cv'))||'null');
    let cmp='';
    if (cv && /ats-cv-en/.test(f)) {
      const jt = (c)=>c.experience.map(j=>[j.title,j.company,j.location,j.from,j.to,j.bullets.split('\n').length].join('|'));
      cmp = JSON.stringify({ name: cv.person.name===ref.person.name, email: cv.person.email===ref.person.email, phone: cv.person.phone===ref.person.phone, summary: cv.summary===ref.summary, jobs: [jt(cv).length, jt(ref).length], jobsEqual: JSON.stringify(jt(cv))===JSON.stringify(jt(ref)), edu: [cv.education.length, ref.education.length], skills: [cv.skills.length, ref.skills.length], langs: [cv.languages.length, ref.languages.length], extras: cv.extras.map(e=>e.title) , highlights: cv.highlights.split('\n').length+' vs '+ref.highlights.split('\n').length});
      if (!JSON.parse(cmp).jobsEqual) console.log('   got jobs', JSON.stringify(jt(cv)), '\n   ref jobs', JSON.stringify(jt(ref)));
    } else if (cv) cmp = JSON.stringify({name: cv.person.name, jobs: cv.experience.length, title0: cv.experience[0]?.title, company0: cv.experience[0]?.company});
    console.log(f.padEnd(26), ms+'ms', '|', note.slice(0,150).replace(/\n/g,' '), '|', cmp, errs.join(';'));
    await ctx.close();
  }
  await b.close();
})();
