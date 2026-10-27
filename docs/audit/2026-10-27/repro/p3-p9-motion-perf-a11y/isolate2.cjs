// Isolates the cost of the home hero animation: control page vs running vs paused vs reduced motion, interleaved, 3 rounds.
const path = require('path');
const SRC = '$SRC';
const { chromium } = require(path.join(SRC, 'node_modules/playwright'));
const BASE = process.argv[2] || 'http://localhost:8105';
const PAGE = process.argv[3] || '/';
const ROUNDS = Number(process.env.ROUNDS || 3);
const SAMPLE = (ms) => new Promise((res) => { const t = []; let last = performance.now(); const s = last; const tick = (now) => { t.push(now - last); last = now; if (now - s < ms) requestAnimationFrame(tick); else res(t); }; requestAnimationFrame(tick); });
const stats = (arr) => { const s = [...arr].sort((a, b) => a - b); const q = (p) => s[Math.min(s.length - 1, Math.floor(p * s.length))]; return `n=${s.length} med=${q(.5).toFixed(1)} p95=${q(.95).toFixed(1)} >50ms=${s.filter((x) => x > 50).length} fps=${(1000 / (arr.reduce((a, b) => a + b, 0) / arr.length)).toFixed(1)}`; };
const mm = (m) => Object.fromEntries(m.metrics.map((x) => [x.name, x.value]));
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  const profiles = (process.env.PROFILES || 'desktop,mobile4x').split(',');
  for (let round = 0; round < ROUNDS; round++) {
    for (const prof of profiles) {
      for (const mode of (process.env.MODES || 'control,running,paused,reduced').split(',')) {
        const mobile = prof.startsWith('mobile');
        const ctx = await browser.newContext({ ...(mobile ? { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true } : { viewport: { width: 1440, height: 900 } }), reducedMotion: mode === 'reduced' ? 'reduce' : 'no-preference' });
        const page = await ctx.newPage();
        const cdp = await ctx.newCDPSession(page);
        await cdp.send('Performance.enable');
        if (prof.endsWith('4x')) await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
        if (mode === 'control') await page.setContent('<html><body style="background:#070a0d;color:#fff"><h1>control</h1></body></html>');
        else await page.goto(BASE + PAGE, { waitUntil: 'load' });
        await page.waitForTimeout(3000);
        if (mode === 'noanim') await page.addStyleTag({ content: '*,*::before,*::after{animation:none!important;transition:none!important}' });
        if (mode === 'paused') { const b = page.locator('[data-cosmos-pause]'); if (await b.isVisible()) await b.click(); await page.waitForTimeout(500); }
        const a = mm(await cdp.send('Performance.getMetrics'));
        const t = await page.evaluate(SAMPLE, 5000);
        const b = mm(await cdp.send('Performance.getMetrics'));
        const d = (k) => (b[k] - a[k]).toFixed(2);
        console.log(`${PAGE} r${round} ${prof.padEnd(8)} ${mode.padEnd(8)} ${stats(t)}  Task=${d('TaskDuration')}s Script=${d('ScriptDuration')}s Style=${d('RecalcStyleDuration')}s Layout=${d('LayoutDuration')}s`);
        await ctx.close();
      }
    }
  }
  await browser.close();
})();
