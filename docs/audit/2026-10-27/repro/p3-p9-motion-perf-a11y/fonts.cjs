const path = require('path');
const { chromium } = require('$SRC/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  for (const p of ['/insights/pareto-and-5-why-in-practice/', '/']) {
    const page = await b.newPage();
    await page.goto('http://localhost:8105' + p, { waitUntil: 'load' }); await page.evaluate(() => document.fonts.ready);
    console.log(p, await page.evaluate(() => ({ h1: getComputedStyle(document.querySelector('h1')).fontFamily, body: getComputedStyle(document.body).fontFamily, faces: [...document.fonts].map((f) => `${f.family} ${f.weight} ${f.status}`) })));
    const cdp = await page.context().newCDPSession(page); await cdp.send('DOM.enable'); await cdp.send('CSS.enable');
    const { root } = await cdp.send('DOM.getDocument'); const { nodeId } = await cdp.send('DOM.querySelector', { nodeId: root.nodeId, selector: 'h1' });
    console.log(' rendered h1 fonts:', JSON.stringify((await cdp.send('CSS.getPlatformFontsForNode', { nodeId })).fonts));
    await page.close();
  }
  await b.close();
})();
