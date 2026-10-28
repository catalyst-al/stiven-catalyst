// Perf harness: per page x profile, cold cache. Usage: node perf.cjs [baseUrl] [outfile] [pagesCsv]
const path = require('path');
const SRC = '$SRC';
const { chromium } = require(path.join(SRC, 'node_modules/playwright'));
const fs = require('fs');
const BASE = process.argv[2] || 'http://localhost:8105';
const OUT = process.argv[3] || path.join(__dirname, 'perf.json');
const PAGES = (process.argv[4] || [
  '/', '/de/', '/sq/', '/insights/pareto-and-5-why-in-practice/', '/reflections/the-information-monopoly/',
  '/field-notes.html', '/magazine/management-review-nr-80.html', '/magazine/management-review.html',
  '/books/mall-per-durresin.html', '/tools.html', '/tools/cx-control-tower/', '/tools/shift-pulse/',
  '/podcast.html', '/search.html',
].join(',')).split(',');
const PROFILES = (process.env.PROFILES || 'desktop,mobile,mobile4x').split(',');

const INIT = () => {
  window.__perf = { lcp: [], cls: [], long: [], raf: 0 };
  const origRaf = window.requestAnimationFrame.bind(window); window.__origRaf = origRaf;
  window.requestAnimationFrame = (cb) => { window.__perf.raf++; return origRaf(cb); };
  try {
    new PerformanceObserver((l) => { for (const e of l.getEntries()) window.__perf.lcp.push({ t: e.startTime, size: e.size, el: e.element ? (e.element.tagName + '.' + (e.element.className && e.element.className.baseVal === undefined ? e.element.className : '') ).slice(0, 80) : null, url: e.url || '' }); }).observe({ type: 'largest-contentful-paint', buffered: true });
    new PerformanceObserver((l) => { for (const e of l.getEntries()) if (!e.hadRecentInput) window.__perf.cls.push({ t: e.startTime, v: e.value, src: (e.sources || []).map((s) => s.node ? (s.node.nodeName + '.' + (typeof s.node.className === 'string' ? s.node.className : '')).slice(0, 60) : '?') }); }).observe({ type: 'layout-shift', buffered: true });
    new PerformanceObserver((l) => { for (const e of l.getEntries()) window.__perf.long.push({ t: e.startTime, d: e.duration }); }).observe({ type: 'longtask', buffered: true });
  } catch (e) {}
};

// Sample frame times for ms milliseconds using rAF (not counted in __perf.raf: uses saved original)
const SAMPLE = (ms) => new Promise((res) => {
  const times = [];
  let last = performance.now();
  const raf = window.__origRaf || window.requestAnimationFrame;
  const start = last;
  const tick = (now) => {
    times.push(now - last); last = now;
    if (now - start < ms) raf(tick); else res(times);
  };
  raf(tick);
});

const stats = (arr) => {
  if (!arr.length) return null;
  const s = [...arr].sort((a, b) => a - b);
  const q = (p) => s[Math.min(s.length - 1, Math.floor(p * s.length))];
  return { n: s.length, median: +q(0.5).toFixed(1), p95: +q(0.95).toFixed(1), max: +s[s.length - 1].toFixed(1), over50: s.filter((x) => x > 50).length, over34: s.filter((x) => x > 34).length, fps: +(1000 / (arr.reduce((a, b) => a + b, 0) / arr.length)).toFixed(1) };
};

const metricMap = (m) => Object.fromEntries(m.metrics.map((x) => [x.name, x.value]));
const pick = (a, b) => {
  const keys = ['TaskDuration', 'ScriptDuration', 'LayoutDuration', 'RecalcStyleDuration', 'LayoutCount', 'RecalcStyleCount'];
  return Object.fromEntries(keys.map((k) => [k, +((b[k] || 0) - (a[k] || 0)).toFixed(3)]));
};

(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  const results = [];
  for (const prof of PROFILES) {
    for (const p of PAGES) {
      const mobile = prof.startsWith('mobile');
      const ctx = await browser.newContext(mobile
        ? { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, userAgent: 'Mozilla/5.0 (Linux; Android 14; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Mobile Safari/537.36' }
        : { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
      await ctx.addInitScript(INIT);
      const page = await ctx.newPage();
      const cdp = await ctx.newCDPSession(page);
      await cdp.send('Network.enable');
      await cdp.send('Network.setCacheDisabled', { cacheDisabled: true });
      await cdp.send('Performance.enable');
      if (prof === 'mobile4x') await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
      const reqs = new Map();
      cdp.on('Network.responseReceived', (e) => { reqs.set(e.requestId, { url: e.response.url, type: e.type, mime: e.response.mimeType, status: e.response.status }); });
      cdp.on('Network.loadingFinished', (e) => { const r = reqs.get(e.requestId); if (r) r.bytes = e.encodedDataLength; });
      cdp.on('Network.loadingFailed', (e) => { const r = reqs.get(e.requestId) || {}; r.failed = e.errorText; reqs.set(e.requestId, r); });
      const ext = new Set();
      page.on('request', (r) => { const u = new URL(r.url()); if (!/localhost|127\.0\.0\.1/.test(u.hostname) && u.protocol.startsWith('http')) ext.add(u.hostname); });
      const t0 = Date.now();
      let ok = true;
      try { await page.goto(BASE + p, { waitUntil: 'load', timeout: 60000 }); } catch (e) { ok = false; }
      const loadMs = Date.now() - t0;
      await page.waitForTimeout(1500);
      const nav = await page.evaluate(() => { const n = performance.getEntriesByType('navigation')[0]; const fcp = performance.getEntriesByName('first-contentful-paint')[0]; return { dcl: n && n.domContentLoadedEventEnd, load: n && n.loadEventEnd, fcp: fcp && fcp.startTime }; });
      // Idle animation sample at top
      const m0 = metricMap(await cdp.send('Performance.getMetrics'));
      const raf0 = await page.evaluate(() => window.__perf.raf);
      const idle = await page.evaluate(SAMPLE, 5000);
      const m1 = metricMap(await cdp.send('Performance.getMetrics'));
      const raf1 = await page.evaluate(() => window.__perf.raf);
      const idleWork = pick(m0, m1);
      // Scroll sample: desktop via wheel (exercises site's glide), mobile via scrollBy per frame
      const sH = await page.evaluate(() => document.documentElement.scrollHeight - innerHeight);
      let scroll;
      const m2 = metricMap(await cdp.send('Performance.getMetrics'));
      if (!mobile) {
        await page.mouse.move(700, 450);
        const sp = page.evaluate(SAMPLE, 5000);
        for (let i = 0; i < 25; i++) { await page.mouse.wheel(0, 300); await page.waitForTimeout(180); }
        scroll = await sp;
      } else {
        scroll = await page.evaluate((ms) => new Promise((res) => {
          const times = []; let last = performance.now(); const start = last;
          const raf = window.__origRaf || window.requestAnimationFrame;
          const tick = (now) => { times.push(now - last); last = now; window.scrollBy(0, 12); if (now - start < ms) raf(tick); else res(times); };
          raf(tick);
        }), 5000);
      }
      const m3 = metricMap(await cdp.send('Performance.getMetrics'));
      const scrollWork = pick(m2, m3);
      // Offscreen: hero scrolled away (bottom of page), measure rAF calls/s and running infinite animations
      await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
      await page.waitForTimeout(800);
      const m4 = metricMap(await cdp.send('Performance.getMetrics'));
      const r4 = await page.evaluate(() => window.__perf.raf);
      await page.waitForTimeout(3000);
      const m5 = metricMap(await cdp.send('Performance.getMetrics'));
      const r5 = await page.evaluate(() => window.__perf.raf);
      const offAnims = await page.evaluate(() => {
        const vis = (el) => { if (!el || !el.getBoundingClientRect) return null; const r = el.getBoundingClientRect(); return r.bottom > 0 && r.top < innerHeight && r.right > 0 && r.left < innerWidth; };
        const list = document.getAnimations().filter((a) => a.playState === 'running');
        const infinite = list.filter((a) => { try { return a.effect.getComputedTiming().iterations === Infinity; } catch { return false; } });
        const tgt = (a) => a.effect && a.effect.target;
        return { running: list.length, runningInfinite: infinite.length, infiniteOffscreen: infinite.filter((a) => vis(tgt(a)) === false).length, sample: infinite.filter((a) => vis(tgt(a)) === false).slice(0, 6).map((a) => (a.animationName || a.constructor.name) + '@' + (tgt(a) ? (tgt(a).className && typeof tgt(a).className === 'string' ? tgt(a).className : tgt(a).nodeName).slice(0, 40) : '')) };
      });
      const offWork = pick(m4, m5);
      const perf = await page.evaluate(() => window.__perf);
      const byType = {};
      let total = 0;
      for (const r of reqs.values()) {
        if (!r.url || r.url.startsWith('data:')) continue;
        const t = r.type || 'Other';
        byType[t] = (byType[t] || 0) + (r.bytes || 0);
        total += r.bytes || 0;
      }
      const blocking = await page.evaluate(() => {
        const head = document.head;
        const css = [...head.querySelectorAll('link[rel=stylesheet]')].filter((l) => !l.media || l.media === 'all' || l.media === 'screen').map((l) => l.getAttribute('href'));
        const js = [...document.querySelectorAll('script[src]')].filter((s) => !s.defer && !s.async && s.type !== 'module').map((s) => s.getAttribute('src'));
        return { css, js };
      });
      const lcp = perf.lcp[perf.lcp.length - 1] || null;
      const res = {
        page: p, profile: prof, ok, loadMs, nav, lcp, cls: +perf.cls.reduce((a, b) => a + b.v, 0).toFixed(4), clsEntries: perf.cls.slice(0, 8),
        longTasks: { n: perf.long.length, total: Math.round(perf.long.reduce((a, b) => a + b.d, 0)), max: Math.round(Math.max(0, ...perf.long.map((x) => x.d))), tbt: Math.round(perf.long.reduce((a, b) => a + Math.max(0, b.d - 50), 0)) },
        idleFrames: stats(idle), idleWork, idleRafPerSec: +((raf1 - raf0) / 5).toFixed(1),
        scrollFrames: stats(scroll), scrollWork, scrollHeight: sH,
        offscreenRafPerSec: +((r5 - r4) / 3).toFixed(1), offWork, offAnims,
        bytes: byType, totalBytes: total, requests: reqs.size, external: [...ext], blocking,
      };
      results.push(res);
      console.log(prof, p, 'LCP', lcp && Math.round(lcp.t), 'CLS', res.cls, 'idle', JSON.stringify(res.idleFrames), 'scroll', JSON.stringify(res.scrollFrames), 'rafIdle', res.idleRafPerSec, 'rafOff', res.offscreenRafPerSec, 'KB', Math.round(total / 1024));
      await ctx.close();
    }
  }
  fs.writeFileSync(OUT, JSON.stringify(results, null, 1));
  await browser.close();
})();
