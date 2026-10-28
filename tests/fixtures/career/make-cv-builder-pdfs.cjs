// Makes the CV Builder PDFs in this folder (cv-builder-en.pdf, cv-builder-de.pdf, cv-builder-sq.pdf) the way a visitor
// does: the built page /tools/cv-builder/ in each language, "Load an example CV", then the browser's print to PDF
// (Chromium, A4, print media: what "Download PDF" opens). tests/cv-import-pdf.test.cjs reads them back with the
// ATS CV's importer. Run after `npm run build`, with the static server running:
//   node tests/browser/server.mjs 8122 &   node tests/fixtures/career/make-cv-builder-pdfs.cjs 8122
const { chromium } = require('playwright');
const path = require('node:path');

const port = Number(process.argv[2]) || 8122;
(async () => {
  const browser = await chromium.launch({ executablePath: process.env.CHROMIUM || '/opt/pw-browsers/chromium' });
  for (const lang of ['en', 'de', 'sq']) {
    const context = await browser.newContext();
    const page = await context.newPage();
    page.on('dialog', (dialog) => dialog.accept());
    await page.goto(`http://localhost:${port}${lang === 'en' ? '' : `/${lang}`}/tools/cv-builder/`);
    await page.locator('[data-act="example"]').first().click();
    await page.waitForTimeout(800);
    await page.emulateMedia({ media: 'print' });
    const file = path.join(__dirname, `cv-builder-${lang}.pdf`);
    await page.pdf({ path: file, format: 'A4', printBackground: true, preferCSSPageSize: true });
    console.log(file);
    await context.close();
  }
  await browser.close();
})();
