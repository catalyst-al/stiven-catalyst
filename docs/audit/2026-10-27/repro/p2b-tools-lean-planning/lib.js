// Shared harness: opens a built tool page on the local server (port 8103) in Chromium and returns {browser, page}.
const path = require('path');
const SRC = '$SRC';
const { chromium } = require(path.join(SRC, 'node_modules', 'playwright'));
const BASE = 'http://localhost:8103';
let browser;
async function launch() {
  if (browser) return browser;
  try { browser = await chromium.launch(); } catch (e) { browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' }); }
  return browser;
}
async function open(url, { storage = null, viewport = { width: 1280, height: 900 }, acceptDownloads = true } = {}) {
  const b = await launch();
  const ctx = await b.newContext({ viewport, acceptDownloads, locale: 'en-GB' });
  if (storage) await ctx.addInitScript((s) => { if (!sessionStorage.__seeded) { for (const [k, v] of Object.entries(s)) localStorage.setItem(k, v); sessionStorage.__seeded = 1; } }, storage);
  const page = await ctx.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  page.on('console', (m) => { if (m.type() === 'error') errors.push('console: ' + m.text()); });
  page.on('dialog', (d) => d.accept());
  await page.goto(BASE + url, { waitUntil: 'load' });
  await page.waitForTimeout(300);
  return { ctx, page, errors };
}
const results = [];
function check(name, expected, actual, tol = 1e-6) {
  let ok;
  if (typeof expected === 'number' && typeof actual === 'number') ok = Math.abs(expected - actual) <= tol * Math.max(1, Math.abs(expected));
  else ok = JSON.stringify(expected) === JSON.stringify(actual);
  results.push({ name, ok, expected, actual });
  console.log(`${ok ? 'PASS' : 'FAIL'} ${name} :: expected=${JSON.stringify(expected)} actual=${JSON.stringify(actual)}`);
  return ok;
}
async function close() { if (browser) await browser.close(); browser = null; }
module.exports = { open, check, close, results, SRC, BASE };
