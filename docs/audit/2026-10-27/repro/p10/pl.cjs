const { chromium } = require(process.cwd() + '/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  for (const path of ['/tools/process-lab/', '/de/tools/process-lab/']) {
    const p = await b.newPage(); await p.goto('http://127.0.0.1:8111' + path);
    const r = await p.evaluate(() => { const v = window.ProcessLabMath.parseValues("47,2\n48,1\n46,9\n47,5\n48,0"); return JSON.stringify(v).slice(0, 200); });
    console.log(path, r); await p.close();
  }
  await b.close();
})();
