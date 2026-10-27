// PM-10: on phone widths, which links does the fixed share button cover when the reader Tabs to them? For each page,
// language and width, every link and button is focused with the keyboard's scrolling (Chrome scrolls a focused element
// into view only when it is off screen), and its box (with its 2 px focus ring) is compared with the share button.
// Usage: node tests/browser/server.mjs 8312 & node docs/audit/2026-10-27/phase3/ci-a11y/share-overlap.cjs [port]
const path = require('node:path');
const fs = require('node:fs');
const root = path.resolve(__dirname, '../../../../..');
const { chromium } = require(path.join(root, 'node_modules/playwright'));
const port = Number(process.argv[2]) || 8312;
const PAGES = ['/magazine/management-review-nr-80.html', '/field-notes.html', '/insights/the-tools-you-build-yourself/', '/tools/damage-control/', '/'];
const executablePath = fs.existsSync('/opt/pw-browsers/chromium') ? '/opt/pw-browsers/chromium' : undefined;

(async () => {
  const browser = await chromium.launch({ executablePath });
  let total = 0;
  for (const width of [360, 390, 412]) {
    const page = await browser.newPage({ viewport: { width, height: 800 }, reducedMotion: 'reduce' });
    await page.route(/^(?!http:\/\/127\.0\.0\.1[:/])[a-z]+:\/\//, (r) => r.abort());
    for (const lang of ['', '/de', '/sq']) {
      for (const p of PAGES) {
        await page.goto(`http://127.0.0.1:${port}${lang}${p}`);
        await page.waitForLoadState('networkidle');
        // Tab through the whole page from the top, as a keyboard reader does.
        const hits = [];
        await page.evaluate(() => document.activeElement?.blur());
        for (let i = 0; i < 400; i++) {
          await page.keyboard.press('Tab');
          const r = await page.evaluate(() => {
            const a = document.activeElement;
            if (!a || a === document.body) return { end: true };
            if (a.closest('.share-orbit')) return { end: true };
            const b = document.querySelector('.share-orbit-button');
            if (!b || b.closest('.share-orbit').classList.contains('is-resting')) return {};
            const r = a.getBoundingClientRect();
            const s = b.getBoundingClientRect();
            const overlap = r.width > 0 && r.right + 2 > s.left && r.left - 2 < s.right && r.bottom + 2 > s.top && r.top - 2 < s.bottom;
            return overlap ? { hit: `${a.tagName.toLowerCase()} "${(a.textContent || a.getAttribute('aria-label') || '').trim().slice(0, 30)}" y${Math.round(r.top)}-${Math.round(r.bottom)}` } : {};
          });
          if (r.end) break;
          if (r.hit) hits.push(r.hit);
        }
        total += hits.length;
        if (hits.length) console.log(`${width} ${lang}${p}: ${hits.length} under the share button: ${hits.join('; ')}`);
      }
    }
    await page.close();
  }
  console.log(`focused controls under the share button: ${total}`);
  await browser.close();
})();
