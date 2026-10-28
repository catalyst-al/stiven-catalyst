// Live-site check: external requests, Cloudflare beacon load and RUM POST, CSP violations. Read-only GETs (beacon POST is the site's own analytics).
const { chromium } = require('$SRC/node_modules/playwright');
const PAGES = (process.argv[2] || '/,/insights/pareto-and-5-why-in-practice/,/tools/shift-pulse/,/de/datenschutz.html').split(',');
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', proxy: { server: process.env.HTTPS_PROXY || 'http://127.0.0.1:45903' } });
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const log = [];
  ctx.on('request', (r) => log.push({ t: Date.now(), ev: 'req', method: r.method(), url: r.url(), type: r.resourceType(), page: r.frame()?.url?.() }));
  ctx.on('requestfinished', async (r) => { const resp = await r.response(); log.push({ t: Date.now(), ev: 'done', method: r.method(), url: r.url(), status: resp ? resp.status() : null }); });
  ctx.on('requestfailed', (r) => log.push({ t: Date.now(), ev: 'fail', method: r.method(), url: r.url(), err: r.failure()?.errorText }));
  const page = await ctx.newPage();
  const consoleMsgs = [];
  page.on('console', (m) => { if (/Content Security Policy|Refused|cloudflare|beacon/i.test(m.text())) consoleMsgs.push(m.text().slice(0, 300)); });
  page.on('pageerror', (e) => consoleMsgs.push('pageerror: ' + String(e).slice(0, 200)));
  for (const p of PAGES) {
    await page.goto('https://stivencatalyst.com' + p, { waitUntil: 'load', timeout: 60000 }).catch((e) => log.push({ ev: 'gotoerr', url: p, err: String(e).slice(0, 200) }));
    await page.waitForTimeout(6000);
    const cf = await page.evaluate(() => ({ hasScript: !!document.querySelector('script[src*="cloudflareinsights"]'), hasGlobal: typeof window.__cfBeacon !== 'undefined', cfg: window.__cfBeacon ? JSON.stringify(window.__cfBeacon).slice(0, 200) : null }));
    console.log('PAGE', p, JSON.stringify(cf));
  }
  // trigger pagehide on the last page to flush the beacon
  await page.goto('about:blank');
  await page.waitForTimeout(3000);
  await ctx.close();
  await browser.close();
  const hosts = {};
  for (const e of log) { if (!e.url || !e.url.startsWith('http')) continue; const h = new URL(e.url).hostname; hosts[h] = (hosts[h] || 0) + (e.ev === 'req' ? 1 : 0); }
  console.log('HOSTS', JSON.stringify(hosts));
  for (const e of log.filter((x) => /cloudflareinsights/.test(x.url || ''))) console.log(e.ev, e.method || '', e.type || '', e.status || e.err || '', e.url.slice(0, 120));
  console.log('FAILS (non-cf):', JSON.stringify(log.filter((x) => x.ev === 'fail' && !/cloudflareinsights/.test(x.url)).map((x) => x.url.slice(0, 100) + ' ' + x.err).slice(0, 10)));
  console.log('CONSOLE:', JSON.stringify(consoleMsgs.slice(0, 10)));
  console.log('TOTAL requests', log.filter((x) => x.ev === 'req').length);
})();
