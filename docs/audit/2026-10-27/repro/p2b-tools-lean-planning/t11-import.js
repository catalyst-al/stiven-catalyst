// ABC import from CSV (EN with quoted decimal comma, DE), leading-zero SKUs, then its Excel export re-imported, then Kanban reads ABC.
const fs = require('fs'); const path = require('path');
const { open, close } = require('./lib');
(async () => {
  const fx = path.join(__dirname, 'fixtures');
  for (const [lang, file] of [['', 'abc-en-comma.csv'], ['/de', 'abc-de.csv']]) {
    const { page, ctx, errors } = await open(`${lang}/tools/inventory-abc/`);
    await page.evaluate(() => Object.keys(localStorage).filter((k) => k.startsWith('sc-inventory')).forEach((k) => localStorage.removeItem(k)));
    await page.setInputFiles('#ia-file', path.join(fx, file));
    await page.waitForTimeout(1200);
    const key = lang ? 'sc-inventory-abc-de' : 'sc-inventory-abc';
    const st = await page.evaluate((k) => JSON.parse(localStorage.getItem(k) || 'null'), key);
    const status = await page.evaluate(() => document.querySelector('#ia-file')?.closest('.dl-box, section, div')?.innerText.slice(0, 300));
    console.log(lang || '/en', file, '-> rows', st && st.rows.map((r) => [r.sku, r.cost, r.demand.join('|')]), '| example?', st && st.example, errors.slice(0, 1));
    // export xlsx and re-import it
    const [dl] = await Promise.all([page.waitForEvent('download'), page.click('[data-xlsx]')]);
    const out = path.join(__dirname, 'downloads', `roundtrip${lang.replace('/', '-')}.xlsx`); await dl.saveAs(out);
    await page.evaluate((k) => localStorage.removeItem(k), key);
    await page.setInputFiles('#ia-file', out); await page.waitForTimeout(1200);
    const st2 = await page.evaluate((k) => JSON.parse(localStorage.getItem(k) || 'null'), key);
    console.log('  re-import of own Excel export ->', st2 ? st2.rows.map((r) => [r.sku, r.cost, r.demand.join('|')]) : null);
    // Kanban reading ABC (restore the CSV import first)
    await page.evaluate((k) => localStorage.removeItem(k), key);
    await page.setInputFiles('#ia-file', path.join(fx, file)); await page.waitForTimeout(1000);
    const kb = await ctx.newPage(); await kb.goto(`http://localhost:8103${lang}/tools/kanban-sizing/`); await kb.waitForTimeout(800);
    const loops = await kb.evaluate((k) => window.KanbanSizingMath.abcLoops(JSON.parse(localStorage.getItem(k)), window.ToolKit.parseNumber).map((l) => [l.part, +l.demand.toFixed(4), l.sd && +l.sd.toFixed(4), l.lead, l.cost]), key);
    console.log('  kanban sees ABC loops:', JSON.stringify(loops));
    await ctx.close();
  }
  await close();
})();
