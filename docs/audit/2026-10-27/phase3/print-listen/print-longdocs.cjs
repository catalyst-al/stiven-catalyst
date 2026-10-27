// Print sweep of the long documents (phase 3, T-24 and the charts): the Tools Guide reader, Management Review issues,
// the special edition, the treatise, From the Floor, an essay with its case box, the longest reflections, in EN, DE
// and SQ. Each page is opened at the top (nothing scrolled into view), printed as Ctrl+P prints it (print media,
// page.pdf on A4 with the page's own @page size), and checked:
//   - lost: a text block of the page (paragraph, item, heading, term, cell, caption) whose start or end is not in the
//     PDF's text (pdftotext; compared without spaces, hyphens or case);
//   - clipped: a box that hides overflow and holds more text than it shows (vertical or horizontal);
//   - hiddenChart: a part of a chart (SVG mark, legend item) that is transparent or scaled to nothing on paper.
// Usage: node print-longdocs.cjs <port>   Output: print-longdocs.json next to this file.
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const { execFileSync } = require('node:child_process');
const { chromium } = require('playwright');

const port = Number(process.argv[2]) || 8331;
const PAGES = [
  'guides/tools-guide.html', 'magazine/management-review-nr-80.html', 'magazine/management-review-nr-01.html',
  'magazine/management-review-2026-09.html', 'magazine/operational-treatise-vol-01.html', 'magazine/from-the-floor.html',
  'insights/pareto-and-5-why-in-practice/', 'reflections/who-owns-the-hour-the-machine-saves/', 'reflections/the-courage-not-to-continue/',
];
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'print-longdocs-'));
const squash = (s) => s.toLowerCase().normalize('NFC').replace(/[\s­\-‐‑–—]+/g, '');

(async () => {
  const browser = await chromium.launch({ executablePath: fs.existsSync('/opt/pw-browsers/chromium') ? '/opt/pw-browsers/chromium' : undefined });
  const out = [];
  for (const lang of ['en', 'de', 'sq']) {
    for (const p of PAGES) {
      const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
      await context.route(/^(?!http:\/\/127\.0\.0\.1[:/])[a-z]+:\/\//, (r) => r.abort());
      const page = await context.newPage();
      const url = `http://127.0.0.1:${port}/${lang === 'en' ? '' : `${lang}/`}${p}`;
      const res = await page.goto(url, { waitUntil: 'load' });
      if (!res || res.status() !== 200) { console.log(`skip ${lang} ${p} (${res && res.status()})`); await context.close(); continue; }
      await page.waitForTimeout(600);
      await page.emulateMedia({ media: 'print' });
      await page.setViewportSize({ width: 718, height: 1000 });
      await page.waitForTimeout(200);
      const dom = await page.evaluate(() => {
        const visible = (e) => { const s = getComputedStyle(e); return s.display !== 'none' && s.visibility !== 'hidden' && e.getClientRects().length > 0 && Number(s.opacity) !== 0; };
        const root = document.querySelector('main') || document.body;
        const blocks = [...root.querySelectorAll('p, li, h1, h2, h3, h4, dt, dd, td, th, figcaption, blockquote')]
          .filter((e) => visible(e) && !e.querySelector('p, li, h2, h3, dd, td') && !e.closest('svg, [aria-hidden="true"]'))
          .map((e) => e.innerText.trim()).filter((t) => t.replace(/\s+/g, '').length >= 10);
        const clipped = [];
        root.querySelectorAll('*').forEach((e) => {
          if (!visible(e) || e.closest('svg')) return;
          const s = getComputedStyle(e);
          const hides = (v) => v === 'hidden' || v === 'clip' || v === 'auto' || v === 'scroll';
          if (!e.innerText || !e.innerText.trim()) return;
          if ((hides(s.overflowY) && e.scrollHeight > e.clientHeight + 4) || (hides(s.overflowX) && e.scrollWidth > e.clientWidth + 4)) clipped.push(`${e.tagName.toLowerCase()}.${String(e.className).split(' ')[0]} ${e.scrollWidth}x${e.scrollHeight}>${e.clientWidth}x${e.clientHeight}`);
        });
        const hiddenChart = [];  // scaled to nothing: a zero first or second column of its matrix (a rotation is not)
        root.querySelectorAll('svg *, .wk-legend li').forEach((e) => {
          if (!e.getClientRects().length) return;
          const host = e.closest('svg') || e;
          if (!visible(host.parentElement || host)) return;
          const s = getComputedStyle(e);
          const m = /matrix\(([^,]+), ([^,]+), ([^,]+), ([^,]+),/.exec(s.transform);
          const scaled = !!m && ((Number(m[1]) === 0 && Number(m[2]) === 0) || (Number(m[3]) === 0 && Number(m[4]) === 0));
          if (Number(s.opacity) === 0 || scaled) hiddenChart.push(String(e.getAttribute('class') || e.tagName));
        });
        return { blocks, clipped: [...new Set(clipped)].slice(0, 8), hiddenChart };
      });
      const file = path.join(tmp, 'doc.pdf');
      await page.pdf({ path: file, format: 'A4', preferCSSPageSize: true, printBackground: true, margin: { top: '10mm', bottom: '10mm', left: '10mm', right: '10mm' } });
      const pages = Number(/Pages:\s+(\d+)/.exec(execFileSync('pdfinfo', [file]).toString())[1]);
      const text = squash(execFileSync('pdftotext', ['-enc', 'UTF-8', file, '-']).toString());
      // Line by line: a block laid out in columns (a legend: "1 in 10" over "have high talent") is read by pdftotext
      // across the columns, so its lines are looked for one by one.
      const lost = dom.blocks.filter((b) => b.split('\n').map(squash).filter((s) => s.length >= 4).some((s) => !text.includes(s.slice(0, 24)) || !text.includes(s.slice(-24)))).map((b) => b.replace(/\s+/g, ' '));
      const row = { lang, page: p, pages, blocks: dom.blocks.length, lost: lost.length, lostSample: lost.slice(0, 4).map((t) => t.slice(0, 80)), clipped: dom.clipped, hiddenChart: dom.hiddenChart.length };
      out.push(row);
      const bad = row.lost || row.clipped.length || row.hiddenChart;
      console.log(`${bad ? 'FAIL' : 'ok  '} ${lang} ${p} pages=${pages} blocks=${row.blocks}${row.lost ? ` lost=${row.lost} ${JSON.stringify(row.lostSample)}` : ''}${row.clipped.length ? ` clipped=${JSON.stringify(row.clipped)}` : ''}${row.hiddenChart ? ` hiddenChart=${row.hiddenChart}` : ''}`);
      await context.close();
    }
  }
  await browser.close();
  fs.writeFileSync(path.join(__dirname, process.env.OUT || 'print-longdocs.json'), JSON.stringify(out, null, 1));
  fs.rmSync(tmp, { recursive: true, force: true });
})();
