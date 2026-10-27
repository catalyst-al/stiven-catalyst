const { chromium } = require('playwright');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
(async () => {
  const b = await chromium.launch();
  for (const vp of [{ width: 1280, height: 900 }, { width: 390, height: 844 }]) {
    const ctx = await b.newContext({ viewport: vp }); const p = await ctx.newPage();
    const errs = []; p.on('pageerror', (e) => errs.push(e.message)); p.on('console', (m) => m.type() === 'error' && errs.push(m.text()));
    await p.goto('http://localhost:8108/books/mall-per-durresin.html'); await sleep(400);
    const where = () => p.evaluate(() => (document.querySelector('[data-book-where]')?.textContent || '') + ' ' + (document.querySelector('[data-book-total]')?.textContent || '') + ' | ' + (document.querySelector('[data-book-chapter]')?.textContent || ''));
    const r = { vp: vp.width, start: await where() };
    await p.click('[data-book-next]'); await sleep(500); r.next1 = await where();
    await p.click('[data-book-toc]'); await sleep(200);
    await p.click('[data-book-goto="13"]'); await sleep(600); r.toc13 = await where();
    await p.keyboard.press('ArrowRight'); await sleep(500); r.arrow = await where();
    r.stored = await p.evaluate(() => Object.entries(localStorage).filter(([k]) => k.startsWith('sc-book')));
    await p.goto('http://localhost:8108/de/books/mall-per-durresin.html'); await sleep(500);
    r.deResume = await p.evaluate(() => { const b = document.querySelector('[data-book-resume]'); return b && !b.hidden ? b.textContent : 'hidden'; });
    r.hscroll = await p.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
    r.imgsBroken = await p.evaluate(() => [...document.images].filter((i) => i.complete && i.naturalWidth === 0 && i.loading !== 'lazy').map((i) => i.src));
    r.errs = errs;
    await p.screenshot({ path: `${process.argv[2]}/book-de-${vp.width}.png` });
    console.log(JSON.stringify(r));
    await ctx.close();
  }
  await b.close();
})();
