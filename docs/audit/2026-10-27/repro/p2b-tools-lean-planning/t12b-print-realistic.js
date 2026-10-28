// Print output: load the example (or seeded long-text data), stub window.print, click the tool's print button,
// then render with print media to PDF. Report: pages, elements overflowing the printable width, long text kept?
const path = require('path');
const { execSync } = require('child_process');
const { open, close } = require('./lib');
const LONG = 'Wartung der Unterbrechungsfreiestromversorgungsanlage am Sorter'; // 222 chars, no spaces
const LONGTXT = 'Pallet wrap tension too low on the rear stack so the top layer slides during braking and the parcels arrive crushed at the depot; '.repeat(4);
const fmeaSheet = { process: 'Long test ' + LONG, owner: 'QA', date: '2026-10-20', revision: 'C', rows: Array.from({ length: 14 }, (_, i) => ({ id: 'r' + i, step: i === 0 ? LONG : 'Wrap pallet', function: LONGTXT, mode: 'Film tears 😀 ' + LONGTXT, effect: 'Damage', cause: LONGTXT, prevention: 'Std', detection: 'Visual', action: LONGTXT, owner: 'Ann', s: 8, o: 6, d: 5, status: 'open' })) };
const CASES = [ { tool: 'fmea', storage: { 'sc-fmea': JSON.stringify(fmeaSheet) }, button: /Print or save as PDF/ } ]; const _unused = [
  { tool: 'fmea', storage: { 'sc-fmea': JSON.stringify(fmeaSheet) }, button: /Print or save as PDF/ },
  { tool: 'a3-report', button: /Print or save as PDF/ },
  { tool: 'eight-d', button: /Print or save as PDF/ },
  { tool: 'risk-assessment', button: /Print the documentation/ },
  { tool: 'kanban-sizing', button: /Print cards/ },
  { tool: 'heijunka', button: /Print the heijunka box/ },
  { tool: 'value-stream-map', button: /Print or save as PDF/ },
  { tool: 'housekeeping-planner', button: /Print section sheets/ },
  { tool: 'leader-standard-work', button: /Print the week sheet/ },
  { tool: 'room-inspection', button: /Print inspection sheet/ },
  { tool: 'smed', button: /Print the changeover standard/ },
  { tool: 'print-pack', button: /Print the pack/ },
  { tool: 'project-portfolio', button: /Print this project/ },
  { tool: 'kaizen-event', button: /report|Report/ },
  { tool: 'standard-work', button: /Print|print/ },
  { tool: 'five-whys', button: /Print or save as PDF/ },
  { tool: 'six-sigma-dmaic', button: /Print or save as PDF/ },
];
(async () => {
  for (const lang of ['']) for (const c of CASES) {
    const { page, errors } = await open(`${lang}/tools/${c.tool}/`, { storage: c.storage || null });
    if (!c.storage) { const ex = page.locator('button[data-example]:visible'); if (await ex.count()) { await ex.first().click().catch(() => {}); await page.waitForTimeout(500); } }
    await page.evaluate(() => { window.__printed = 0; window.print = () => { window.__printed++; }; document.querySelectorAll('main details').forEach((d) => { d.open = true; }); });
    let clicked = 'none';
    if (!lang) { // EN labels only
      const b = page.locator('main button:visible', { hasText: c.button });
      if (await b.count()) { await b.first().click().catch(() => {}); clicked = 'yes'; await page.waitForTimeout(500); }
    } else {
      const b = page.locator('main button:visible', { hasText: /Printo|printo|Shtyp|shtyp/ });
      if (await b.count()) { await b.first().click().catch(() => {}); clicked = 'sq'; await page.waitForTimeout(500); }
    }
    await page.emulateMedia({ media: 'print' });
    const over = await page.evaluate(() => {
      const width = 794 - 2 * 38; // A4 at 96 dpi minus ~10 mm margins
      const out = [];
      document.querySelectorAll('body *').forEach((e) => {
        const cs = getComputedStyle(e); if (cs.display === 'none' || cs.visibility === 'hidden') return;
        const r = e.getBoundingClientRect(); if (!r.width) return;
        if (e.scrollWidth > e.clientWidth + 2 && cs.overflowX !== 'visible' && !/^(HTML|BODY)$/.test(e.tagName)) out.push(`${e.tagName}.${e.className}`.slice(0, 50) + ` scroll ${e.scrollWidth}>${e.clientWidth}`);
      });
      return [...new Set(out)].slice(0, 5);
    });
    const file = path.join(__dirname, 'pdf', `real-${(lang || '/en').slice(1)}-${c.tool}.pdf`);
    await page.pdf({ path: file, format: 'A4', printBackground: true, preferCSSPageSize: true });
    const pages = execSync(`pdfinfo "${file}" | grep Pages`).toString().trim();
    const txt = execSync(`pdftotext -layout "${file}" -`).toString();
    const blankPages = txt.split('\f').filter((p, i, a) => i < a.length - 1 && !p.trim()).length;
    const pageWidth = execSync(`pdftotext -bbox "${file}" - | grep -o 'xMax="[0-9.]*"' | sort -t'"' -k2 -n | tail -1`).toString().trim();
    const longKept = c.storage ? txt.replace(/\s|-/g, '').includes(LONG.slice(0, 60)) : null;
    console.log(`${lang || '/en'} ${c.tool}: printClicked=${clicked} printCalls=${await page.evaluate(() => window.__printed)} ${pages} blankPages=${blankPages} maxTextX=${pageWidth} (A4=595pt) overflowEls=${JSON.stringify(over)}${longKept !== null ? ' longTextKept=' + longKept : ''} ${errors.length ? 'ERR ' + errors[0] : ''}`);
    await page.context().close();
  }
  await close();
})();
