// Process Lab, English page: a column with decimal commas (as copied from a German/Albanian Excel).
const { open, close } = require('./lib');
(async () => {
  for (const lang of ['', '/de']) {
    const { page } = await open(`${lang}/tools/process-lab/`);
    await page.fill('#pl-values', '47,2\n48,1\n46,9\n47,5\n48,0\n47,7\n46,8\n47,9');
    await page.dispatchEvent('#pl-values', 'input');
    await page.waitForTimeout(800);
    const txt = await page.evaluate(() => (document.querySelector('[data-results]') || document.querySelector('main')).innerText);
    const stats = txt.split('\n').filter((l) => /mean|Mittel|Mesatar|n =|values|Werte|vlera|Cpk|warn|comma|Komma/i.test(l)).slice(0, 12);
    console.log(lang || '/en', JSON.stringify(stats));
    await page.screenshot({ path: `${__dirname}/pl-comma${lang.replace('/', '-') || '-en'}.png`, fullPage: false });
    await page.context().close();
  }
  await close();
})();
