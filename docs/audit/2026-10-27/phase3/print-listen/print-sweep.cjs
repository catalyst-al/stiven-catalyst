// Print sweep (phase 3, T-09 / P2A-06): every tool page in EN, DE and SQ, with its example loaded (or what it opens
// with), printed as the reader's Ctrl+P would: print media, then page.pdf() on A4 with the page's own @page size when it
// sets one (preferCSSPageSize). For each page it reports
//   - wide: a visible table (or its wrapper) wider than the printable width of A4 portrait;
//   - clipped: a table whose right edge runs past a box that hides overflow (overflow auto/scroll/hidden), so the
//     columns past the edge are not on paper;
//   - missing: a header cell, or a cell of the last row, of a visible table that is not in the PDF's text (pdftotext):
//     each such cell is tagged first with a short unique word, and the tag is looked for.
// Usage: node print-sweep.cjs <port> [lang,lang] [slug,slug] [--landscape]   (the site served by tests/browser/server.mjs)
// Output: print-sweep-<orientation>.json next to this file, and one line per page on stdout.
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const { chromium } = require('playwright');

const ROOT = path.join(__dirname, '..', '..', '..', '..', '..');
const port = Number(process.argv[2]) || 8331;
const langs = (process.argv[3] && process.argv[3] !== 'all') ? process.argv[3].split(',') : ['en', 'de', 'sq'];
const only = (process.argv[4] && process.argv[4] !== 'all') ? process.argv[4].split(',') : null;
const landscape = process.argv.includes('--landscape');
const slugs = only || fs.readdirSync(path.join(ROOT, 'src', 'tools')).filter((f) => f.endsWith('.njk')).map((f) => f.replace(/\.njk$/, ''));
// KEEP=<folder> keeps the PDFs there.
const tmp = process.env.KEEP || fs.mkdtempSync(path.join(require('node:os').tmpdir(), 'print-sweep-'));
fs.mkdirSync(tmp, { recursive: true });
// A4 at 10 mm margins: 190 mm (portrait) or 277 mm (landscape) at 96 px per inch.
const WIDTH = Math.floor(((landscape ? 277 : 190) / 25.4) * 96);

(async () => {
  const browser = await chromium.launch({ executablePath: fs.existsSync('/opt/pw-browsers/chromium') ? '/opt/pw-browsers/chromium' : undefined });
  const out = [];
  for (const lang of langs) {
    for (const slug of slugs) {
      const context = await browser.newContext({ viewport: { width: 1200, height: 900 } });
      await context.route(/^(?!http:\/\/127\.0\.0\.1[:/])[a-z]+:\/\//, (r) => r.abort());
      const page = await context.newPage();
      page.on('dialog', (d) => d.accept().catch(() => {}));
      // A tool that builds its paper version on beforeprint (risk assessment, shift capacity…) builds it once, before the
      // measuring; the print itself then does not build it again, so the tags put in below stay in the cells.
      await page.addInitScript(() => {
        window.print = () => {};
        const add = window.addEventListener.bind(window);
        window.addEventListener = (type, fn, options) => add(type, type === 'beforeprint' && typeof fn === 'function' ? (e) => { if (!window.__holdPrint) fn(e); } : fn, options);
      });
      const url = `http://127.0.0.1:${port}${lang === 'en' ? '' : `/${lang}`}/tools/${slug}/`;
      await page.goto(url, { waitUntil: 'load' });
      await page.waitForTimeout(500);
      // Load the example when the tool offers one and does not show it already.
      const shown = await page.evaluate(() => !!document.querySelector('.dl-example-note'));
      const example = page.locator('main [data-example]:visible').first();
      if (!shown && await example.count()) {
        try { await example.click({ timeout: 2000 }); await page.waitForTimeout(600); } catch { /* not clickable */ }
      }
      await page.emulateMedia({ media: 'print' });
      // The paper the page asks for (a tool may print landscape or on A3 with @page): a first print says which, and the
      // tables are measured at the printable width of that paper.
      const probe = path.join(tmp, 'probe.pdf');
      await page.pdf({ path: probe, format: 'A4', landscape, preferCSSPageSize: true, pageRanges: '1', margin: { top: '10mm', bottom: '10mm', left: '10mm', right: '10mm' } });
      const size = /Page size:\s+([\d.]+) x ([\d.]+) pts/.exec(execFileSync('pdfinfo', [probe]).toString());
      const paperWidth = size ? Math.floor(((Number(size[1]) / 72) * 25.4 - 20) / 25.4 * 96) : WIDTH;
      await page.setViewportSize({ width: paperWidth, height: 1000 });
      await page.evaluate(() => { window.__holdPrint = false; window.dispatchEvent(new Event('beforeprint')); window.__holdPrint = true; });
      await page.waitForTimeout(300);
      const dom = await page.evaluate((W) => {
        const visible = (e) => { const s = getComputedStyle(e); return s.display !== 'none' && s.visibility !== 'hidden' && e.getClientRects().length > 0; };
        const tables = [...document.querySelectorAll('main table')].filter(visible);
        const report = { tables: tables.length, wide: [], clipped: [], headers: [] };
        for (const t of tables) {
          const name = `${t.className || 'table'}`.split(' ')[0];
          const r = t.getBoundingClientRect();
          if (r.right > W + 2) report.wide.push(`${name} ${Math.round(r.width)}px`);
          for (let a = t.parentElement; a && a !== document.body; a = a.parentElement) {
            const s = getComputedStyle(a);
            if (s.overflowX !== 'visible' && a.getBoundingClientRect().right + 2 < r.right) { report.clipped.push(`${name} in ${a.tagName.toLowerCase()}.${String(a.className).split(' ')[0]} ${Math.round(r.width)}>${Math.round(a.clientWidth)}`); break; }
          }
          // Each header cell, and each cell of the last row, gets a short unique tag ("zq12x"): the PDF's text either has
          // the tag (the cell is on paper) or it does not (cut off), whatever other text on the page shares its words.
          const lastRow = t.querySelector('tbody tr:last-child');
          const cells = [...t.querySelectorAll('thead th'), ...(lastRow ? lastRow.children : [])].filter(visible);
          for (const cell of cells) {
            const label = cell.innerText.trim().replace(/\s+/g, ' ').slice(0, 40);
            if (!label) continue;
            const tag = `zq${report.headers.length}x`;
            const mark = document.createElement('span');
            // Out of the flow, so it neither widens a column nor wraps: it sits in the cell's top right corner, and is cut
            // with the cell.
            mark.textContent = tag;
            mark.style.cssText = 'position:absolute;right:1px;top:0;font:7px/1 monospace;white-space:nowrap;letter-spacing:0;text-transform:none';
            if (getComputedStyle(cell).position === 'static') cell.style.position = 'relative';
            cell.append(mark);
            report.headers.push([tag, `${cell.tagName === 'TH' ? 'th' : 'td'} ${label}`]);
          }
        }
        return report;
      }, paperWidth);
      const file = path.join(tmp, `${lang}-${slug}.pdf`);
      let pages = 0; let missing = [];
      try {
        await page.pdf({ path: file, format: 'A4', landscape, preferCSSPageSize: true, printBackground: true, margin: { top: '10mm', bottom: '10mm', left: '10mm', right: '10mm' } });
        pages = Number(/Pages:\s+(\d+)/.exec(execFileSync('pdfinfo', [file]).toString())[1]);
        // Without spaces and in lower case: a tag split over two lines, or set in capitals by the header style, still counts.
        const text = execFileSync('pdftotext', ['-enc', 'UTF-8', file, '-']).toString().replace(/\s+/g, '').toLowerCase();
        missing = dom.headers.filter(([tag]) => !text.includes(tag)).map(([, label]) => label);
      } catch (e) { missing = [`pdf error ${e.message.slice(0, 80)}`]; }
      const row = { lang, slug, paper: size ? `${Math.round(Number(size[1]) / 72 * 25.4)}x${Math.round(Number(size[2]) / 72 * 25.4)}mm` : '?', pages, tables: dom.tables, wide: [...new Set(dom.wide)], clipped: [...new Set(dom.clipped)], missing };
      out.push(row);
      const bad = row.wide.length || row.clipped.length || row.missing.length;
      console.log(`${bad ? 'FAIL' : 'ok  '} ${lang} ${slug} pages=${pages} tables=${dom.tables}${row.wide.length ? ` wide=${JSON.stringify(row.wide)}` : ''}${row.clipped.length ? ` clipped=${JSON.stringify(row.clipped)}` : ''}${row.missing.length ? ` missing=${JSON.stringify(row.missing)}` : ''}`);
      await context.close();
    }
  }
  await browser.close();
  const name = `print-sweep-${landscape ? 'landscape' : 'portrait'}${only ? '-subset' : ''}.json`;
  fs.writeFileSync(path.join(__dirname, name), JSON.stringify(out, null, 1));
  const fails = out.filter((r) => r.wide.length || r.clipped.length || r.missing.length);
  console.log(`${fails.length} of ${out.length} pages with a cut table (${name})`);
  if (!process.env.KEEP) fs.rmSync(tmp, { recursive: true, force: true });
})();
