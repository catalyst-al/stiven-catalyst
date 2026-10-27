const { launch } = require('./pw.cjs');
const fs = require('fs');
const B='http://localhost:8104'; const OUT=__dirname+'/out/';
const KEYS = { 'cv-builder':'sc-cv-builder', 'ats-cv':'sc-ats-cv', 'cover-letter':'sc-cover-letter' };
(async () => {
  const b = await launch();
  for (const lang of ['en','de','sq']) for (const tool of Object.keys(KEYS)) {
    const ctx = await b.newContext({ acceptDownloads: true }); const p = await ctx.newPage();
    p.on('dialog', d=>d.accept());
    const errs=[]; p.on('pageerror', e=>errs.push(e.message));
    const url = `${B}${lang==='en'?'':'/'+lang}/tools/${tool}/`;
    await p.goto(url); await p.waitForTimeout(500);
    await p.locator('[data-act="example"]').first().click();
    await p.waitForTimeout(800);
    const before = await p.evaluate(k=>localStorage.getItem(k), KEYS[tool]);
    await p.reload(); await p.waitForTimeout(800);
    const after = await p.evaluate(k=>localStorage.getItem(k), KEYS[tool]);
    const pagesUi = await p.evaluate(()=>document.querySelectorAll('.ats-page:not(.ats-measure), .cv-page, .cl-page').length);
    const overs = await p.evaluate(()=>document.querySelectorAll('.is-over').length);
    const badge = await p.locator('[data-check-badge]').innerText().catch(()=> '');
    await p.emulateMedia({ media: 'print' });
    const pdf = `${OUT}${tool}-${lang}.pdf`;
    await p.pdf({ path: pdf, format: 'A4', printBackground: true, preferCSSPageSize: true });
    await p.emulateMedia({ media: 'screen' });
    let word = '';
    if (await p.locator('[data-act="word"]').count()) {
      const [dl] = await Promise.all([p.waitForEvent('download'), p.locator('[data-act="word"]').first().click()]);
      word = `${OUT}${tool}-${lang}.docx`; await dl.saveAs(word);
    }
    console.log(JSON.stringify({ tool, lang, persisted: !!before && before===after, len: (after||'').length, pagesUi, overs, badge, word: !!word, errs }));
    await ctx.close();
  }
  await b.close();
})();
