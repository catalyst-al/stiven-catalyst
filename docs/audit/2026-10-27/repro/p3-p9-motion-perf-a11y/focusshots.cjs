const { chromium } = require('$SRC/node_modules/playwright');
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  await page.goto('http://localhost:8105/tools/cx-control-tower/', { waitUntil: 'load' }); await page.waitForTimeout(800);
  await page.keyboard.press('Tab'); await page.screenshot({ path: 'focus-skip.png', clip: { x: 0, y: 0, width: 390, height: 120 } });
  console.log('skip', await page.evaluate(() => { const s = document.activeElement, h = document.querySelector('.site-header'); return { skipZ: getComputedStyle(s).zIndex, skipPos: getComputedStyle(s).position, rect: JSON.stringify(s.getBoundingClientRect()), headerZ: getComputedStyle(h).zIndex, headerPos: getComputedStyle(h).position, top: document.elementFromPoint(s.getBoundingClientRect().left + 10, s.getBoundingClientRect().top + 10).className }; }));
  // focus first text input
  const inp = page.locator('input:visible').first();
  await inp.focus(); await page.keyboard.press('Shift+Tab'); await page.keyboard.press('Tab');
  const box = await inp.boundingBox(); await page.screenshot({ path: 'focus-input.png', clip: { x: 0, y: Math.max(0, box.y - 30), width: 390, height: box.height + 60 } });
  console.log('input', await page.evaluate(() => { const e = document.activeElement; const cs = getComputedStyle(e); return { tag: e.tagName, type: e.type, outline: cs.outline, border: cs.borderColor, shadow: cs.boxShadow, bg: cs.backgroundColor }; }));
  await page.evaluate(() => document.activeElement.blur());
  console.log('input blurred', await inp.evaluate((e) => { const cs = getComputedStyle(e); return { border: cs.borderColor, shadow: cs.boxShadow, bg: cs.backgroundColor }; }));
  const circ = page.locator('svg circle[tabindex]').first();
  console.log('focusable circles', await page.locator('svg circle[tabindex="0"], svg [tabindex="0"]').count());
  if (await circ.count()) { await circ.focus(); const cb = await circ.boundingBox(); await page.screenshot({ path: 'focus-circle.png', clip: { x: 0, y: Math.max(0, cb.y - 60), width: 390, height: 140 } }); console.log('circle', await circ.evaluate((e) => ({ outline: getComputedStyle(e).outline, stroke: getComputedStyle(e).stroke, sw: getComputedStyle(e).strokeWidth, r: e.getAttribute('r'), role: e.getAttribute('role'), label: e.getAttribute('aria-label') }))); }
  await b.close();
})();
