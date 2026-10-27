const { chromium } = require('playwright');
const fs = require('fs');
const src = fs.readFileSync(process.argv[2], 'utf8');
const stubFn = src.slice(src.indexOf('const stub = '), src.indexOf('const V = {'));
const stub = eval('(' + stubFn.replace('const stub = ', '').trim().replace(/;$/, '') + ')');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
(async () => {
  const browser = await chromium.launch();
  for (const mode of ['async', 'sync', 'async-end']) {
    const page = await browser.newPage();
    await page.addInitScript(stub, { voices: [{ lang: 'en-US', name: 'L', localService: true, default: true }], endOnCancel: mode, manual: true });
    await page.goto('http://localhost:8108/insights/pareto-and-5-why-in-practice/');
    await sleep(200);
    const S = () => page.evaluate(() => ({ n: window.__log.spoken.length, last: window.__log.spoken.at(-1)?.text.slice(0, 50), rate: window.__log.spoken.at(-1)?.rate, cancels: window.__log.cancels,
      label: document.querySelector('[data-listen-label]').textContent, pressed: document.querySelector('[data-listen-toggle]').getAttribute('aria-pressed'),
      stopHidden: document.querySelector('[data-listen-stop]').hidden, status: document.querySelector('[data-listen-status]').textContent, speaking: document.querySelector('.is-speaking')?.textContent.slice(0, 30) }));
    const steps = [];
    await page.click('[data-listen-toggle]'); await sleep(50); steps.push(['play', await S()]);
    for (let i = 0; i < 3; i++) { await page.evaluate(() => window.__finish()); await sleep(30); }
    steps.push(['after 3 sentences', await S()]);
    await page.click('[data-listen-toggle]'); await sleep(50); steps.push(['pause', await S()]);
    await page.click('[data-listen-toggle]'); await sleep(50); steps.push(['resume', await S()]);
    await page.selectOption('[data-listen-rate]', '1.4'); await sleep(50); steps.push(['rate 1.4', await S()]);
    await page.evaluate(() => window.__finish()); await sleep(30); steps.push(['next sentence', await S()]);
    await page.click('[data-listen-stop]'); await sleep(50); steps.push(['start again (while playing)', await S()]);
    await page.click('[data-listen-toggle]'); await sleep(50); steps.push(['pause', await S()]);
    await page.click('[data-listen-stop]'); await sleep(50); steps.push(['start again (while paused)', await S()]);
    const stored = await page.evaluate(() => localStorage.getItem('sc-listen-rate'));
    console.log('==== cancel mode', mode, 'stored rate', stored);
    for (const [k, v] of steps) console.log(k.padEnd(28), JSON.stringify(v));
    await page.close();
  }
  await browser.close();
})();
