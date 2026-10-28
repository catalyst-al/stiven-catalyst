// Planets on a touch screen: compare.json put in tables. For each side (B, C, D) against A, per object (the four
// planets, the light, the names) and per screen density (2, 3), the median over viewports, themes and moments of
// A's value, the side's value and the relative change; hue and chroma as differences. Prints Markdown, writes
// summary.json next to compare.json.
//
//   node docs/audit/2026-10-27/phase3/planets-touch/summary.cjs [docs/audit/2026-10-27/phase3/planets-touch/compare.json]
const fs = require("node:fs");
const path = require("node:path");

const file = process.argv[2] || path.join(__dirname, "compare.json");
const { results, sides } = JSON.parse(fs.readFileSync(file, "utf8"));
const median = (l) => { const s = l.filter(Number.isFinite).sort((a, b) => a - b); if (!s.length) return null; const m = s.length >> 1; return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2; };
const pct = (a, b) => (a ? (100 * (b - a)) / a : null);
const hueDiff = (a, b) => (a === null || b === null ? null : ((b - a + 540) % 360) - 180);
const r1 = (v, d = 1) => (v === null || v === undefined ? null : +v.toFixed(d));

const objects = ["Pulse", "Zenith", "Lumen", "Atlas", "Light", "Pulse name", "Zenith name", "Lumen name", "Atlas name"];
const out = {};
for (const side of Object.keys(sides).filter((s) => s !== "A")) {
  for (const dsf of [2, 3]) {
    for (const object of objects) {
      const rows = results.filter((r) => r.object === object && r.dsf === dsf && r[side]);
      if (!rows.length) continue;
      const m = (f) => median(rows.map(f));
      (out[side] ||= {})[`${object} @${dsf}`] = {
        n: rows.length,
        lapVar: [r1(m((r) => r.A.lapVar)), r1(m((r) => r[side].lapVar)), r1(m((r) => pct(r.A.lapVar, r[side].lapVar)))],
        tenengrad: [r1(m((r) => r.A.tenengrad), 0), r1(m((r) => r[side].tenengrad), 0), r1(m((r) => pct(r.A.tenengrad, r[side].tenengrad)))],
        meanY: [r1(m((r) => r.A.meanY)), r1(m((r) => r[side].meanY)), r1(m((r) => pct(r.A.meanY, r[side].meanY)), 2)],
        p99Y: [r1(m((r) => r.A.p99Y)), r1(m((r) => r[side].p99Y)), r1(m((r) => pct(r.A.p99Y, r[side].p99Y)), 2)],
        hue: [r1(m((r) => r.A.hue)), r1(m((r) => r[side].hue)), r1(m((r) => hueDiff(r.A.hue, r[side].hue)))],
        chroma: [r1(m((r) => r.A.chroma), 2), r1(m((r) => r[side].chroma), 2), r1(m((r) => pct(r.A.chroma, r[side].chroma)))],
        differ: r1(m((r) => r[side].vsA.differ)),
        differ8: r1(m((r) => r[side].vsA.differ8)),
        maxDelta: Math.max(...rows.map((r) => r[side].vsA.maxDelta)),
        dE: r1(m((r) => r[side].vsA.dE), 2),
        ssim: r1(m((r) => r[side].vsA.ssim), 3),
        lapVarWorst: r1(Math.min(...rows.map((r) => pct(r.A.lapVar, r[side].lapVar)))),
      };
    }
    const vp = results.filter((r) => r.object === "viewport" && r.dsf === dsf && r[`${side}vsA`]);
    if (vp.length) out[side][`viewport @${dsf}`] = { n: vp.length, differ: r1(median(vp.map((r) => r[`${side}vsA`].differ))), differ8: r1(median(vp.map((r) => r[`${side}vsA`].differ8)), 2), ssim: r1(median(vp.map((r) => r[`${side}vsA`].ssim)), 4) };
  }
}
// The themes: the hero's sky is dark in both; are the planets' pixels the same?
const themeSame = results.filter((r) => r.theme === "light" && r.object !== "viewport").every((r) => {
  const d = results.find((x) => x.theme === "dark" && x.object === r.object && x.viewport === r.viewport && x.dsf === r.dsf && x.t === r.t);
  return d && d.A.lapVar === r.A.lapVar && d.A.meanY === r.A.meanY;
});
fs.writeFileSync(path.join(path.dirname(file), "summary.json"), JSON.stringify({ from: path.basename(file), sides, planetsSameInBothThemes: themeSame, summary: out }, null, 1));
console.log(`planets' pixels identical in dark and light theme: ${themeSame}\n`);
for (const [side, rows] of Object.entries(out)) {
  console.log(`\n### ${side} vs A (${sides[side]})\n`);
  console.log("| object @density | sharpness (Laplacian var.) A → side | edge energy | mean Y | p99 Y | hue Δ° | chroma | differ / >8 | SSIM |");
  console.log("|---|---|---|---|---|---|---|---|---|");
  for (const [k, v] of Object.entries(rows)) {
    if (k.startsWith("viewport")) { console.log(`| ${k} | | | | | | | ${v.differ} % / ${v.differ8} % | ${v.ssim} |`); continue; }
    console.log(`| ${k} | ${v.lapVar[0]} → ${v.lapVar[1]} (${v.lapVar[2]} %) | ${v.tenengrad[2]} % | ${v.meanY[0]} → ${v.meanY[1]} (${v.meanY[2]} %) | ${v.p99Y[0]} → ${v.p99Y[1]} | ${v.hue[2]} | ${v.chroma[2]} % | ${v.differ} % / ${v.differ8} % | ${v.ssim} |`);
  }
}
