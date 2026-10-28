const { launch } = require('./pw.cjs');
const B='http://localhost:8104'; const OUT=__dirname+'/out/';
const longName = 'Maximiliana-Alexandrina-Konstantinopolitanische-Wolfeschlegelsteinhausenbergerdorff'+'X'.repeat(60);
const bullets = Array.from({length:70},(_,i)=>`Bullet number ${i+1} with 3 results and a measurable outcome ✅`).join('\n');
const cvAts = { person:{ name: longName+' 😀 مرحبا', headline:'مدير العمليات – Operations 👷', email:'a@b.de', phone:'+49 1', location:'Durrës' }, summary:'x', experience:[{title:'LASTJOB '+'Y'.repeat(150),company:'Firma',from:'01.2020',to:'',bullets: bullets+'\nFINAL-BULLET-MARKER'}] };
(async () => {
  const b = await launch();
  // ATS CV
  let ctx = await b.newContext({ acceptDownloads: true }); let p = await ctx.newPage(); p.on('dialog', d=>d.accept());
  await p.goto(`${B}/tools/ats-cv/`); await p.evaluate(cv=>localStorage.setItem('sc-ats-cv', JSON.stringify(cv)), cvAts); await p.reload(); await p.waitForTimeout(1000);
  const info = await p.evaluate(()=>({pages: document.querySelectorAll('[data-scale] .ats-page').length, over: document.querySelectorAll('.is-over').length, checks: document.querySelector('[data-check]').innerText, nameW: document.querySelector('.ats-name')?.scrollWidth, pageW: document.querySelector('.ats-page')?.clientWidth, docW: document.documentElement.scrollWidth, vw: innerWidth}));
  console.log('ATS', JSON.stringify(info));
  await p.emulateMedia({ media: 'print' }); await p.pdf({ path: OUT+'ats-stress.pdf', format:'A4', printBackground:true, preferCSSPageSize:true });
  const [dl] = await Promise.all([p.waitForEvent('download'), (await p.emulateMedia({media:'screen'}), p.locator('[data-act="word"]').first().click())]); await dl.saveAs(OUT+'ats-stress.docx'); console.log('docx name', dl.suggestedFilename());
  // mobile width
  await p.setViewportSize({ width: 360, height: 800 }); await p.waitForTimeout(500);
  console.log('ATS mobile docW', await p.evaluate(()=>[document.documentElement.scrollWidth, innerWidth]));
  await ctx.close();
  // CV builder
  ctx = await b.newContext({ acceptDownloads: true }); p = await ctx.newPage(); p.on('dialog', d=>d.accept());
  await p.goto(`${B}/tools/cv-builder/`); await p.locator('[data-act="example"]').first().click(); await p.waitForTimeout(500);
  await p.evaluate(([n, bl]) => { const cv = JSON.parse(localStorage.getItem('sc-cv-builder')); cv.person.name = n; cv.groups[0].entries[0].roles[0].bullets = bl + '\nFINAL-BULLET-MARKER'; localStorage.setItem('sc-cv-builder', JSON.stringify(cv)); }, [longName+' 😀 مرحبا', bullets]);
  await p.reload(); await p.waitForTimeout(1200);
  const info2 = await p.evaluate(()=>({pages: [...document.querySelectorAll('.cv-page, [class*="cv-sheet"], [data-pages] > *')].length, over: document.querySelectorAll('.is-over').length, checks: (document.querySelector('[data-check]')||{}).innerText, docW: document.documentElement.scrollWidth, vw: innerWidth}));
  console.log('CVB', JSON.stringify(info2));
  await p.emulateMedia({ media: 'print' }); await p.pdf({ path: OUT+'cvb-stress.pdf', format:'A4', printBackground:true, preferCSSPageSize:true });
  await ctx.close();
  await b.close();
})();
