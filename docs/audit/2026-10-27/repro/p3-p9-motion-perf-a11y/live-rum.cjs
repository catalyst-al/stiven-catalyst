const { chromium } = require('$SRC/node_modules/playwright');
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', proxy: { server: process.env.HTTPS_PROXY } });
  const page = await browser.newPage();
  const cdp = await page.context().newCDPSession(page);
  await cdp.send('Network.enable');
  const ids = new Set();
  cdp.on('Network.requestWillBeSent', (e) => { if (/cloudflareinsights\.com\/cdn-cgi/.test(e.request.url)) { ids.add(e.requestId); console.log('SEND', e.request.method, e.type, e.request.url, 'body bytes', (e.request.postData || '').length, 'ct', e.request.headers['Content-Type']); } });
  cdp.on('Network.responseReceivedExtraInfo', (e) => { if (ids.has(e.requestId)) console.log('EXTRA status', e.statusCode, JSON.stringify(Object.fromEntries(Object.entries(e.headers).filter(([k]) => /access|content-type|server|cf-/i.test(k))))); });
  cdp.on('Network.responseReceived', (e) => { if (ids.has(e.requestId)) console.log('RESP', e.response.status, e.response.url); });
  cdp.on('Network.loadingFailed', (e) => { if (ids.has(e.requestId)) console.log('FAILED', e.errorText, JSON.stringify(e.corsErrorStatus || {}), e.blockedReason || ''); });
  await page.goto('https://stivencatalyst.com/', { waitUntil: 'load' });
  await page.waitForTimeout(7000);
  await page.goto('about:blank'); await page.waitForTimeout(2000);
  await browser.close();
})();
