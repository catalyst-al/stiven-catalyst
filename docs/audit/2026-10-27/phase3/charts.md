# Phase 3: publication charts on a phone (E-07 / P5-05)

**Before** (reproduced on 27 October 2026 with the audit's own script, `phase3/charts/clip.cjs`, Chromium 153, 390×844,
reduced motion): 285 publication pages, **105 chart texts cut on 61 pages** (EN 18, DE 23, SQ 20), the same counts as
the audit. Of these, 53 were figures after a bar, 17 labels above a bar, 22 keys under columns or at the ends of a
line, 13 "from/to" keys above a chart. Example: German No. 45, "Arbeiteten 2+ Stunden zwischen 22 und 5 Uhr,
mindestens m…" (`clip-before.txt`).

**Change** (`lib/weekly/charts.js`, phone chart only, drawn 230 units wide): a label wider than the chart goes on two
lines; bars are shortened, all by the same scale, only as far as a figure after them needs; a key wider than its
column wraps; the keys at the ends of a line chart stay inside; a "from/to" key without room goes under the first.
The width of a text is estimated from its font size with the widest letter measured in Chromium (0.54 of the size
for labels and axes, 0.76 for figures), so the estimate errs on the safe side.

**Unchanged**: the wide chart, the one printed in the PDFs and shown on wider screens. Checked on all 507 charts of
the Management Review, the treatise and From the Floor in three languages: the wide markup is byte for byte the same
as before, so no PDF needs printing again. On a phone, 154 of 507 charts change (hbars 69, columns 29, dumbbell 16,
plus the line keys); the others are drawn exactly as before.

**After**: `clip-after.txt`: 285 pages, **0 cut texts**, no page scrolls sideways. Text under 8 px remains on 48
pages: the facsimile of the printed page, which the audit judged acceptable because the text version exists.

Pictures (`charts/*-before.png` from the live site, `*-after.png` from the build): German No. 45 shows the whole
"mindestens monatlich"; the bars are a little shorter so that "1 von 5" fits; colours, type and spacing as before.

**Test**: `tests/browser/chart-labels.spec.mjs` (phone projects): the 61 pages, no text past the edge of its chart.
It failed on the old `charts.js` (3 of 3, German No. 45 named) and passes now.
