# Phase 3: print and narration (branch `phase3-print-listen`)

Machine: development container, Chromium 153 (`/opt/pw-browsers/chromium`), headless, no CPU throttle. The site is
`_site` from `npm run build`, served by `node tests/browser/server.mjs 8331`. Print = `page.emulateMedia({ media:
'print' })` then `page.pdf({ format: 'A4', preferCSSPageSize: true, printBackground: true, margin: 10 mm })`, which is
what Ctrl+P makes; PDF text read with `pdftotext` (sweeps) or the site's own pdf.js (browser tests). Scripts and results
are in `docs/audit/2026-10-27/phase3/print-listen/`; failing-test outputs before each fix in `…/print-listen/evidence/`.

## Findings

| ID | What was wrong (how reproduced) | Commit | Test | Before → after |
|---|---|---|---|---|
| T-09 / P2A-06 | Tool tables cut in print: the scroll box around a table kept scrolling on paper and cells did not wrap. `print-sweep.cjs` prints all 59 tools in EN/DE/SQ with their example, tags every header cell and every cell of the last row with a unique word in its top-right corner and looks for the tags in the PDF text | `cc1b76fe` | `tests/browser/print.spec.mjs` (8 tools × 3 languages: no table wider than the page, none cut by a box, every tagged cell in the PDF) | Sweep: **83 of 177 pages in 29 tools** with a cut or too-wide table (`print-sweep-before.txt`; e.g. EN Andon lost Respond, Solve, Escalation; Guest Complaints 6 of 10 columns) → **3 of 177**, all FMEA, where the sheet prints on its own landscape pages and only the sweep's portrait width measure flags it (no cell missing, pages checked as images) (`print-sweep-after.txt`) |
| T-10 / P2B-06 | A3 report: box 5 kept only WHAT (960 px table in a 597 px scrolling box) | `cc1b76fe` (same generic rule) | same spec, `a3-report` in 3 languages | Owner, Due date, Status and the last row missing in EN/DE/SQ → all present |
| T-24 / P2C-03 | CV Builder pages hold whole blocks; a job of 70 bullets ran past its page. The ATS CV's **Print** button (HTML pages, not the phase-1 PDF writer) had the same | `d78da474` | spec: CV Builder and ATS CV with 70 bullets + marker | CV Builder **50/70**, ATS print **48/70**, marker missing (`evidence/print-spec-cv-before.txt`) → **70/70**, marker present, no page marked too full |
| M-05 / PM-5 | Management Review charts print blank unless scrolled into view (`.wk-anim` without `.is-in`) | `d5176306` | spec: issue No. 80, no chart part transparent or at scale 0 in print, and the page of the first chart has coloured ink (> 0.4 % saturated pixels, rendered with pdf.js) | 16 chart parts hidden (`evidence/print-spec-charts-before.txt`; sweep: 14 in No. 80, 35 in No. 1, 10 in treatise vol. 1) → 0 |
| (new) charts/reveals in general | Scroll-driven reveals (`animation-timeline: view()`) keep their start in print: the treatise's "How every chapter is built" printed as an empty box. Hero titles held at `blur(0)` print as a raster (not selectable); tool intros print with a grey `text-shadow`; the margins print dark in the dark theme with background graphics on | `d5176306` | spec: treatise vol. 1 in 3 languages, the three boxes opaque and their text in the PDF | long-document sweep (`print-longdocs-before.txt` → `-after.txt`): blocks lost on every issue, the special edition, the Tools Guide (title) and the treatise in all 3 languages → none, except the From the Floor list (see below) |
| P-02 / P7-01 | Narration read the feedback form, privacy line and "Join in" (all 261 narrated pages now carry them) | `536c4c50` | `tests/listen-real-pages.test.cjs` on the built essay with case box (EN/DE/SQ) and a reflection: no utterance from `.essay-feedback`, `.essay-join`, `.share-row`, `form` or any control; reading ends on the case box / the last paragraph | EN ended on "… Privacy policy." "Join in" (`evidence/listen-before.txt`) → ends on the text |
| P-03 / P7-02 | Case box: heading read, `dt/dd` skipped | `536c4c50` | same: all 10 terms/descriptions read, "What cannot be confirmed" included | 2 of 12 parts → 12 of 12 |
| P-04 / P7-03 | Privacy note implied local processing; no-voice note recommended Edge | `536c4c50` | same file: local voice preferred over an online default; note = local note; online-only → note names the voice and says the browser sends the text to its maker; no-voice note without "Edge" | Note now set from `voice.localService` in EN/DE/SQ; privacy page (3 languages) says the same. There is no voice picker on the site, so nothing to mark there |
| P7-05 (added by the coordinator) | Cancel handled by a time-based `stopping` flag: a late `end` after a cancel skipped a sentence and queued two | `ca4eee49` | same file, stub in two modes ("interrupted" error; `end` 25 ms late): speed change and resume repeat the cut sentence once, Start again starts at the title | late-end mode: 2 utterances queued, one sentence skipped (`evidence/listen-p7-05-before.txt`) → passes in both modes |

## What changed (all print rules inside `@media print`)
- `src/css/06-tools.css` (shared): tool tables on paper: wrap box unclipped, cells wrap, 8.5 pt, repeat header, no
  split rows; 8+ columns 7.5 pt; 12+ columns a long header word may break.
- Tool files, print blocks only: `21-skills-matrix.css`, `46-shift-capacity.css`, `51-hoshin-kanri.css`,
  `58-heijunka.css` (Ctrl+P draws the result's box like the box's own print; a named landscape page for it was tried
  and dropped: Chromium then laid out the following portrait pages at landscape width and cut them).
- `src/css/08-readers-and-publications.css`: `.wk-anim` charts drawn in print, no transitions.
- `src/css/11-reading-and-motion.css` (shared): print-wide `animation-timeline: auto`, `text-shadow: none`,
  `color-scheme: light`; the hero titles' focus animation off in print.
- `src/js/weekly.js`: a counting figure shows its value on `beforeprint`.
- `src/js/cv-builder.js`, `src/js/ats-cv.js`: over-long blocks split between bullets (screen preview and print).
- `src/js/listen.js`, `src/_includes/layouts/article.njk`, `src/_data/{de,sq}/ui.json`, `src/datenschutz.njk`.
- `tests/browser/playwright.config.mjs` (shared): print spec runs in the 1440 px dark project only; `PW_PORT` env for
  another port.

## Needs author approval
None on screen. Print only: tool tables are smaller type on paper, and the CV preview now shows a long job continued
on the next page instead of one red, overflowing page. Listen: the note under the player now changes once the voice is
known (new UI strings in EN/DE/SQ).

## Left / not verified
- From the Floor (list page): each card's excerpt is clamped to two lines on paper as on screen; by design, not changed.
- FMEA, and any tool that mixes portrait and landscape pages: Chromium only. Other engines NOT VERIFIED.
- Whether Safari or Firefox deliver a late `end` (P7-05) is still not verified; the code no longer depends on it.
- Coaching print (`coaching-workspace.js`): source-inspected only (plain flow, no clipping rule).

## Totals
`npm run build` ok; `npm test`: 1327 tests, 1327 pass, 0 fail, 0 skipped. `npm run test:browser` (PW_PORT=8331): 44
tests, 38 passed, 6 failed (the 6 known search journeys, CI-01); the 12 new print tests pass.
