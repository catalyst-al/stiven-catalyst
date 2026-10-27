# Status of the 27 October 2026 audit findings

Branch `claude/gifted-pasteur-v7n2dw`, built on the preserved checkpoint `605d0df` (branch `claude/busy-cannon-mq0sqy`,
left untouched). Nothing is merged into `main`, no pull request is open, nothing is deployed.

Status values:
- **fixed**: reproduced by a test first (the test failed), the cause corrected, the test passes. The commit and the
  test are named.
- **pending (phase 2/3)**: belongs to a later phase the author has not opened yet.
- **needs author approval**: a fact, a wording of the author's own text, an account setting or a deployment.
- **not verified**: could not be checked in this environment.

## Verification of phase 1 (state at `d6408501` + wave 2, see the end)

| Check | Result |
| --- | --- |
| Build | `npm run build` from an empty `_site`: 838 files, 58 s, no error |
| Unit tests | `npm test`: **1207 tests, 1207 pass, 0 fail, 0 skipped, 0 todo** (baseline at `605d0df`: 1092) |
| Coaching build check | `scripts/check-coaching-build.mjs`: 54 pages, 9 journeys pass |
| Browser tests, current Chrome (153) | 32 tests, 26 pass, 0 skipped, **6 fail: the keyboard search journey** (CI-01, a view-transition error on current Chrome; phase 3). The same 6 failed at the audit. |
| Flows between tools in real Chromium | `verification/phase1-flows-chromium.cjs`: 11 of 11 pass (examples, readers, Waste Log → Cost of Quality in 3 languages, Kaizen Board → Action Tracker, Daily Board profile), no script error |
| Fixes of the workers in real Chromium | Process Lab (3 languages), Room Inspection, Heijunka, Hotel KPIs (3 languages), Andon across the clock change: 22 of 22 pass |
| Files in 3 languages | `verification/phase1-exports-chromium.cjs`: Excel opens in openpyxl and keeps "00123" as text, CSV has its BOM and the separator of its language, the ATS CV PDF has extractable text with the "+", every XML part of the Word file parses: 18 of 18 pass |
| Existing data | Every changed format reads the old one: examples saved by shape, the Action Tracker's old example ids (even a list the old code had mixed), the Daily Board's old demo profile, team copies of version 1, the old team address, Andon rows without time stamps, inspections saved before. Each has a test with the old format, several produced by the old scripts from the checkpoint. |
| Motion and visual identity | No CSS, layout, planet or motion script changed in phase 1 (`git diff 605d0df -- src/css src/styles.css src/js/cosmos.js src/js/family-sky.js src/script.js src/_includes/layouts` is empty). Result areas whose content changed were looked at in Chromium at 390 and 1440 px. |

## P1 findings

| ID | Finding | Status | Commit · test |
| --- | --- | --- | --- |
| T-01 | Example rows become real data after one is removed | fixed | `45f617fe` · tests/examples-never-mix.test.cjs |
| T-02 | Readers report a stored example as real figures | fixed | `45f617fe` · tests/examples-never-mix.test.cjs |
| T-03 | Action Tracker example merges into the shared list | fixed | `3cda431d` · tests/actions-integrity.test.cjs |
| T-04 | Daily Board writes a demo profile; hidden default targets | fixed | `76803d47` · tests/examples-never-mix.test.cjs |
| T-05 | Cost of Quality never brings in the Waste Log | fixed | `779e05b4` · tests/handoffs-real.test.cjs |
| T-06 | Process Lab (EN) misreads decimal commas | fixed | `756b433f` · tests/process-lab*.test.cjs |
| T-07 | ATS match rewards filler, misses skills | fixed | `0f80fffa` · tests/ats-match.test.cjs (9 real ads, 3 languages). The 60 % "pass" claim is removed. |
| T-08 | CV import corrupts the CV Builder's own PDF | fixed | `9a72c2de` · tests/cv-import-pdf.test.cjs (PDFs printed by the real CV Builder, ATS PDF, JSON Resume, Word) |
| E-01 | Management Review: undisclosed changes, "64 issues, each says so" | pending (phase 2) | |
| E-02 | German reflections mix Sie and du | pending (phase 2) | |
| E-03 | Career timeline contradicts itself | needs author approval (phase 2) | |
| M-01 | Home planets saturate the main thread | pending (phase 3) | |

## P2 findings

| ID | Finding | Status | Commit · test |
| --- | --- | --- | --- |
| T-09 | Print cuts table columns in 7 tools | pending (phase 3, print) | |
| T-10 | A3 print keeps only the WHAT column | pending (phase 3, print) | |
| T-11 | KPI Diagnostic names a cause from a 2-point gap | fixed | `9af944bb` · tests/kpi-diagnostic.test.cjs. **Author:** the thresholds (4 of 6, a 2-point margin). |
| T-12 | Sigma chart: one point is "lasting"; "6+" on 250 clean units | fixed | `b78a5f3d` · tests/sigma-chart.test.cjs |
| T-13 | Signals: false good-side signals on rare counts | fixed | `c8e6e67a` · tests/signals-low-counts.test.cjs (seeded Monte Carlo: 22.3 % → 0.05 % of days) |
| T-14 | Site Compare ranks a 2-route depot first | fixed | `58178333` · tests/site-compare.test.cjs. **Author:** the minimum volumes. |
| T-15 | Andon durations wrong across a clock change | fixed | `0c5ac635` · tests/andon.test.cjs |
| T-16 | Daily Board 5S score differs from the 5S Audit | fixed | `76803d47` · tests/handoffs-real.test.cjs |
| T-17 | The same paste doubles the log | fixed | `285c7af8` · tests/log-integrity.test.cjs |
| T-18 | Hotel KPIs accept 120 of 100 rooms | fixed | `d5b06062`, Signals `808b7706` · tests/hotel-kpis.test.cjs, tests/log-integrity.test.cjs |
| T-19 | Hand-offs duplicate; "Added 12" when nothing was saved | fixed | `3cda431d` · tests/actions-integrity.test.cjs |
| T-20 | Heijunka freezes the tab | fixed | `b9da1c6e`, `094b9c97`, `70fab809` · tests/heijunka.test.cjs |
| T-21 | Room Inspection passes after 1 of 34 items | fixed | `fb3cdb26` · tests/room-inspection.test.cjs. **Author:** a failed critical item still fails a room while other items are open, as before. |
| T-22 | Excel turns "00123" into 123 | fixed | `285c7af8` · tests/log-integrity.test.cjs, verification/phase1-exports-chromium.cjs |
| T-23 | Time Study's "standard time" has no rating or allowance | see wave 2 | |
| T-24 | CV and ATS PDFs cut long blocks | ATS CV: fixed by the PDF writer of `605d0df` (70 bullets checked, `822faca1`); CV Builder print: pending (phase 3, print) | |
| T-25 | Team sync never propagates deletions | fixed | `4e69750f` · tests/team-sync-deletions.test.cjs |
| T-26 | Sync ids by plain SHA-256; no limits on the Worker | fixed in code | `697cbf95`, `9e64b36c` · tests/team-sync-keys.test.cjs, tests/sync-worker.test.cjs. **Needs author approval to deploy the Worker.** Read-only codes made before the move stop working once a team's copy moves. |
| T-27 | Backup file leaves out photos | fixed | `e8ea5a8f` · tests/work-backup-photos.test.cjs and a browser journey |
| T-28 | ATS matching not Unicode-normalised | fixed | `0f80fffa` · tests/ats-match.test.cjs |
| P-01 | Privacy page incomplete | needs author approval (legal text) | The facts to add are listed in phases/p2c-career-platform.md |
| P-02 | Narration reads the feedback form | pending (phase 3) | |
| P-03 | Narration skips the case box content | pending (phase 3) | |
| P-04 | Narration privacy note and online voices | pending (phase 3) | |
| P-05 | Albanian podcast No. 1 has no correction | needs author approval (phase 2) | |
| E-04 – E-12 | Management Review dating and method, PDF disclosure, chart labels, reflections | pending (phase 2) | E-09 and E-10 contain facts only the author can confirm |
| B-01 | Back-cover line translated in opposite directions | needs author approval | |
| M-02 – M-06 | Pause, motion control, Zenith radar, blank printed charts, wheel glide | pending (phase 3) | |
| A-01 | Cloudflare Web Analytics collects nothing | needs author approval (account setting) | |
| SEO-02 | Reflections linked from one page only | pending (phase 3) | |
| CI-01 | Search journey fails on current Chrome | pending (phase 3) | still 6 of 32 browser tests |
| CI-02 | CI's Chromium is a year old | pending (phase 3) | |
| CI-03 | Contract tests used invented fixtures | partly fixed | tests/helpers/tool-page.cjs opens the real built page; new hand-off tests use it. The cosmos-pause and chart-note tests: phase 3. |
| CI-04 | No check that PDFs match their sources | pending (phase 3) | |

## P3 findings (tools and data, phase 1)

| ID | Finding | Status |
| --- | --- | --- |
| P2A-10, P2B-08 | Damaged saved data replaced silently by the example | fixed `285c7af8` (kept under `<key>.unreadable`, a warning, no example over it) |
| P2B-13 | Heijunka drops a product without pack-out from the takt | fixed `b9da1c6e` |
| P2C-11 | Shelf accepts "/\host" links from a backup | fixed `52b56020` |
| Flaky test | template-pack waited 30 ms for a file reader | fixed `b36db424` |
| P2B-10, P2B-11, P2B-12, P2B-14, P2B-15, P2B-16, P2B-17 | ics files, partial 5S audits, 5 Whys save warning, VSM bottleneck, ABC ties, Gage R&R alpha, Hoshin file names | see wave 2 |
| P2C-06, P2C-12, P2C-13, P2C-14, P2C-15 | zip bomb, search, coaching import, cover-letter example, coaching doc | see wave 2 |

## Found and fixed during phase 1 (not in the audit)

| What | Commit |
| --- | --- |
| A tool's example could hand its actions to the shared list as the visitor's (Safety Cross and 14 others) | `3cda431d` |
| 5S, Gemba, Skills Matrix and Maintenance marked a finding as sent when its action was not saved | `3cda431d` |
| An own volume, covers or units typed while the example was shown were mixed into it and cleared with it later | `45f617fe` |
| The Daily Board opened on its example even when the visitor's own logs held data | `76803d47` |
| While locked with a PIN, CV Builder, ATS CV, Cover Letter, 5 Whys, the workplace profile, annotations and coaching still wrote plain text; photos and restore points too | `9f6e4584`, `127bc450` |
| A handover link could carry a gzip bomb | `7e10b4bd` |
| The PDF writer printed "?" for thin spaces, minus and some letters; a long date ran into the title | `822faca1` |
| A JSON Resume or backup with docLang "__proto__" broke the CV tools on every load | `822faca1` |
| Floor Capture said photos are not in the saved file | `e69eaf01` |
| The photo journeys skipped themselves in five browser projects | `d6408501` |

## Decisions for the author (phase 1)

1. Deploy the sync Worker with the new limits (10 new spaces per IP per hour, 1,000 per day, 4 MB bodies), and accept
   that read-only codes made before the move must be made again.
2. A minimum PIN length for the work lock: today 4 characters are accepted; 6 or more would make an offline guess far
   slower.
3. The thresholds chosen for KPI Diagnostic, Signals (5 expected per day) and Site Compare.
4. A failed critical item fails a room even while other items are open (Room Inspection).
5. The Tools Guide (printed edition 7) still describes Time Study, KPI Diagnostic and the ATS CV the old way; a new
   edition needs its PDF printed again (phase 2).
