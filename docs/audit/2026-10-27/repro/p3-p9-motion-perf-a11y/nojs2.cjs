const { chromium } = require('$SRC/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  for (const js of [false, true]) {
    const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, javaScriptEnabled: js });
    if (js) await ctx.addInitScript(() => { window.IntersectionObserver = class { observe() {} unobserve() {} disconnect() {} takeRecords() { return []; } }; });
    for (const p of ['/', '/insights/pareto-and-5-why-in-practice/', '/field-notes.html', '/magazine/management-review.html', '/tools/shift-pulse/', '/magazine/management-review-nr-80.html', '/search.html']) {
      const page = await ctx.newPage();
      await page.goto('http://localhost:8105' + p, { waitUntil: 'load' }); await page.waitForTimeout(600);
      // scroll through page; count text-bearing elements that remain transparent once on screen
      const H = await page.evaluate(() => document.documentElement.scrollHeight);
      const hidden = new Set(); let checked = 0;
      for (let y = 0; y < H; y += 650) {
        await page.evaluate((yy) => scrollTo(0, yy), y); await page.waitForTimeout(150);
        const r = await page.evaluate(() => { const out = []; let c = 0; for (const el of document.querySelectorAll('main p, main h1, main h2, main h3, main li, main img')) { const r = el.getBoundingClientRect(); if (r.bottom < 0 || r.top > innerHeight || !r.width) continue; c++; let o = 1; for (let n = el; n && n !== document.body; n = n.parentElement) o *= parseFloat(getComputedStyle(n).opacity); if (o < 0.5 && r.top > 0 && r.bottom < innerHeight * 0.7) out.push(el.tagName + '.' + (el.className || '').toString().slice(0, 25) + ' "' + (el.textContent || '').trim().slice(0, 25) + '"'); } return { c, out }; });
        checked += r.c; r.out.forEach((x) => hidden.add(x));
      }
      const res = { checked, nHidden: hidden.size, hidden: [...hidden].slice(0, 6), mainText: await page.evaluate(() => (document.querySelector('main') || document.body).innerText.length) };
      console.log(js ? 'JS+noIO' : 'noJS', p, JSON.stringify(res));
      await page.close();
    }
    await ctx.close();
  }
  await b.close();
})();
