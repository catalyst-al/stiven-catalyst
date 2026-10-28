// WCAG 2.x contrast ratios for the colour changes of this review (relative luminance, sRGB), and the colours that
// color-mix(in srgb, A p%, B) gives (the per-channel mix of the encoded values, as Chromium computes it).
// Usage: node docs/audit/2026-10-27/phase3/ci-a11y/contrast.cjs
const lin = (c) => { c /= 255; return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const lum = (h) => { const [r, g, b] = hex(h).map(lin); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
const ratio = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m); return (x + 0.05) / (y + 0.05); };
const mix = (a, b, p) => '#' + hex(a).map((v, i) => Math.round(p * v + (1 - p) * hex(b)[i]).toString(16).padStart(2, '0')).join('');
// Alpha over a background: color-mix(in srgb, fg a%, transparent) drawn on bg.
const over = (fg, bg, a) => mix(fg, bg, a);
const show = (label, fg, bg) => console.log(`${label.padEnd(58)} ${fg} on ${bg}: ${ratio(fg, bg).toFixed(2)}:1`);

module.exports = { ratio, mix, over };
if (require.main === module) {
  console.log('PM-11, the counter in the pressed month button (light theme):');
  show('  before: .weekly-n #b6d2e7', '#b6d2e7', '#0a6ab0');
  for (const a of [0.85, 0.88, 0.9, 0.92]) show(`  white at ${a} over the button`, over('#ffffff', '#0a6ab0', a), '#0a6ab0');
  show('  white', '#ffffff', '#0a6ab0');
  console.log('Light theme accent on Lumen (gold) tool pages, --sky-ink = color-mix(--family p%, #0b1015):');
  for (const p of [0.62, 0.6, 0.58, 0.56, 0.55, 0.54, 0.52, 0.5]) {
    const c = mix('#f5c86a', '#0b1015', p);
    console.log(`  p=${p}: ${c}  on #ffffff ${ratio(c, '#ffffff').toFixed(2)}:1, on #eceff0 ${ratio(c, '#eceff0').toFixed(2)}:1`);
  }
}
