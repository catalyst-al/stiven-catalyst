// Playwright helper: real Chromium against the local static server on port 8102.
const path = require('node:path');
const SRC = path.resolve(__dirname, '../../audit-src');
const { chromium } = require(path.join(SRC, 'node_modules/playwright'));
const BASE = 'http://localhost:8102';
const launch = async () => {
  try { return await chromium.launch(); } catch { return chromium.launch({ executablePath: '/opt/pw-browsers/chromium' }); }
};
const newPage = async (browser, opts = {}) => {
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 }, acceptDownloads: true, timezoneId: opts.timezoneId || 'Europe/Berlin', locale: opts.locale || 'en-GB' });
  const page = await context.newPage();
  page.__errors = [];
  page.on('pageerror', (e) => page.__errors.push(String(e)));
  page.on('console', (m) => { if (m.type() === 'error') page.__errors.push(m.text()); });
  return { context, page };
};
module.exports = { launch, newPage, BASE, SRC };
