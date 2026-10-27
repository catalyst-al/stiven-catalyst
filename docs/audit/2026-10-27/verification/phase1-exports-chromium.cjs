// Phase 1 verification: the files the tools write, downloaded from the built pages in real Chromium in English, German
// and Albanian, then opened by independent readers (openpyxl for Excel, a zip/XML parse for Word, pdftotext for PDF).
// Run from the repository root after `npm run build`: node tests/browser/server.mjs 8132 & node <this file> <outdir>
const path = require('node:path');
const fs = require('node:fs');
const { execFileSync } = require('node:child_process');
const { chromium } = require(path.join(process.cwd(), 'node_modules', 'playwright'));
const BASE = process.env.BASE || 'http://127.0.0.1:8132';
const OUT = process.argv[2] || fs.mkdtempSync('/tmp/exports-');
fs.mkdirSync(OUT, { recursive: true });
const fails = [];
const check = (label, ok, detail = '') => { console.log(`${ok ? 'PASS' : 'FAIL'} ${label}${detail ? ` | ${detail}` : ''}`); if (!ok) fails.push(label); };
const py = (code, file) => execFileSync('python3', ['-I', '-c', code, file], { encoding: 'utf8' }).trim();

(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' }).catch(() => chromium.launch());
  for (const lang of ['', 'de', 'sq']) {
    const pre = lang ? `/${lang}` : '';
    const context = await browser.newContext({ acceptDownloads: true, timezoneId: 'Europe/Berlin' });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', (e) => errors.push(e.message));
    const save = async (click, name) => {
      const [download] = await Promise.all([page.waitForEvent('download', { timeout: 15000 }), click()]);
      const file = path.join(OUT, `${lang || 'en'}-${name}`);
      await download.saveAs(file);
      return file;
    };
    // Damage Control with own rows, one of them carrying a code with leading zeros in its note.
    await page.goto(`${BASE}${pre}/tools/damage-control/`);
    await page.click('.dl-example-note button');
    // The paste box sits in a closed section: its text is set the way the page reads it.
    await page.evaluate((text) => { const box = document.querySelector('#dl-paste'); box.value = text; box.dispatchEvent(new Event('input', { bubbles: true })); }, ['2026-10-20\t\t\t\t\t3\t\t00123', '2026-10-21\t\t\t\t\t2\t4.5\tdock'].join('\n'));
    await page.evaluate(() => document.querySelector('[data-import]').click());
    const xlsx = await save(() => page.evaluate(() => document.querySelector('[data-xlsx]').click()), 'damage.xlsx');
    const cells = py("import sys, openpyxl; ws = openpyxl.load_workbook(sys.argv[1]).active; print(repr([[c.value for c in r] for r in ws.iter_rows(min_row=1, max_row=3)]))", xlsx);
    check(`${lang || 'en'} Damage Control Excel opens in openpyxl, 3 rows`, cells.split('], [').length === 3, cells.slice(0, 160));
    check(`${lang || 'en'} Damage Control Excel keeps "00123" as text`, cells.includes("'00123'"));
    const csv = await save(() => page.evaluate(() => document.querySelector('[data-csv]').click()), 'damage.csv');
    const csvText = fs.readFileSync(csv, 'utf8');
    check(`${lang || 'en'} Damage Control CSV: BOM, separator of the language`, csvText.charCodeAt(0) === 0xfeff && (lang ? csvText.includes(';') : csvText.split('\n')[0].includes(',')));
    // ATS CV: the example CV as PDF and as Word.
    await page.goto(`${BASE}${pre}/tools/ats-cv/`);
    await page.click('[data-act="example"] >> nth=0');
    await page.waitForTimeout(300);
    const pdf = await save(() => page.click('[data-act="pdf"]'), 'cv.pdf');
    const text = execFileSync('pdftotext', ['-layout', pdf, '-'], { encoding: 'utf8' });
    check(`${lang || 'en'} ATS CV PDF: text extractable, phone with "+"`, /\+\d{2}/.test(text) && text.length > 500, `${text.length} chars`);
    const docx = await save(() => page.click('[data-act="word"]'), 'cv.docx');
    const parts = py("import sys, zipfile, xml.dom.minidom as m\nz = zipfile.ZipFile(sys.argv[1]); n = 0\nfor name in z.namelist():\n    if name.endswith('.xml') or name.endswith('.rels'):\n        m.parseString(z.read(name)); n += 1\nprint(n)", docx);
    check(`${lang || 'en'} ATS CV Word: every XML part parses`, Number(parts) > 3, `${parts} parts`);
    check(`${lang || 'en'} no script error`, errors.length === 0, errors.slice(0, 2).join(' · '));
    await context.close();
  }
  await browser.close();
  console.log(fails.length ? `${fails.length} failed` : 'all passed');
  process.exit(fails.length ? 1 : 0);
})();
