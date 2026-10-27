# Phase 2b: technical reliability and data integrity of the lean, planning and hotel-operations tools

Auditor: p2b-tools-lean-planning · Clone: `audit-src` @ 3cb88a244c9337b8957a31d9fe499a4827f56c08 · Built `_site` served locally on port 8103
Harness, fixtures, downloads, PDFs and screenshots: `$AUDIT_WORK/p2b-tools-lean-planning/`
(`lib.js` is the shared Playwright harness. The test scripts are `t1-math.js` … `t21-misc.js`, the export validator is `validate.py` and the scipy reference is `stats_expected.py`.)

## 1. Scope and method

- **Real code, real pages.** Every numeric check ran inside Chromium (Playwright) on the built page, e.g. `http://localhost:8103/tools/fmea/`. It called the tool's own `window.*Math` object or drove the UI. I computed the expected values separately, by hand in the harness or with scipy/numpy for the statistics (`stats_expected.py`, venv in the work dir). The repository's unit tests were not used as evidence.
- **Exhaustive coverage:**
  - The FMEA AP table and RPN for all 1,000 S/O/D combinations.
  - The risk matrix for all 25 L×S cells.
  - Page load with damaged storage for all 33 tool pages × 5 damage variants (165 loads).
  - Example load in EN/DE/SQ for all 33 tool pages (99 loads).
  - A scan of all 66 DE/SQ pages for untranslated English.
- **Sampled coverage:**
  - Exports: 30 tools × EN+DE, giving 166 files (plus 2 round-trip XLSX). Every XLSX/DOCX was unzipped and every XML part parsed. XLSX files were opened with openpyxl. Four files were opened in LibreOffice headless (converted to PDF). ICS line lengths and CSV shape were checked.
  - Print: 17 print paths × EN+SQ through `page.pdf()` with print media.
- **Not verified:**
  - Real printers and Safari/Firefox print engines (Chromium only).
  - Real Excel/Word (LibreOffice and openpyxl only).
  - Team-sync interaction.
  - IndexedDB quota exhaustion for photos.
  - Mobile camera capture (a file-input upload was used instead).
  - The Tools Guide has no calculations. I only checked its formula claims against the tools.
- **Evidence tags** follow the brief: REPRODUCED / SOURCE / SAMPLED / INFERRED / OPINION / NOT VERIFIED.

## 2. Coverage and per-tool verdicts

| Tool | Coverage | Verdict | Reproducible test (input → expected (independent) → actual) |
|---|---|---|---|
| fmea | Fully tested | **Correct** (print P3) | All 1000 S/O/D: AP vs transcribed AIAG-VDA 2019 table, RPN=S×O×D → 0 mismatches (t1). `summarize` of 3 rows → rated 2/unrated 1/H 1/overdue 1/RPN 197 → same. Ratings "", 0, 7.5, "7,0" → null |
| kanban-sizing | Fully tested | **Correct** | D=400, L=0.5+1, α=10 %, C=50 → ⌈13.2⌉=14 → 14. Exact 10.0 → 10 (no over-rounding). Stat: z95·30·√3=85.469; ⌈(360+85.469)/25⌉=18 → 18. Two-bin ⌈10·3·1.1⌉=33 → 33, flagged "short" for C=20. z table 1.2816/1.6449/1.96/2.0537/2.3263 → exact |
| heijunka | Fully tested | **Defective (performance)**, math correct | 2×(480−30)=900 min, daily 400/200/100 → takt 77.143 s, pitch ×20/×10, load 0.5, EPEI 45/(900−450)=0.1 d → all match. Sequence covers 700 units/900 min. **Freeze:** demand 20,000/week with pack-out 1 → analyse() 4.6 s per keystroke; demand 1e9 → tab hung >2 min and closed (P2B-04). Product without pack-out drops out of the takt (P2B-13) |
| time-study | Fully tested | **Minor issues** | Median [10,12,11,30,11]=11, sample SD 8.526, 30 flagged as outlier, line efficiency 77/(2·52), operators ⌈77/45⌉=2 → all match. "Standard time" has no rating or allowance (P2B-09) |
| value-stream-map | Fully tested | **Minor issues** | Takt 460·60/460=60 s. Lead = (4600+1100+1600+920)/460 d × 460·60 + 102 s = 493,302 working s → same. PCE 102/493,302 → same. Bottleneck by CT only (P2B-14) |
| smed | Fully tested | **Defective (hand-off)**, math correct | parseDuration "4:30"=270, "1:02:30"=3750, "4,5"=270, "90 s"=90, "-3"/"4:75"/"1.5h"=NaN → match. Span 1800 s incl. 300 s unrecorded gap, parallel lanes 600 s, freed 200 min/week → match. Duplicate and silently-lost actions (P2B-03) |
| inventory-abc | Fully tested | **Minor issues** | μ=100, s=9.770, SS=1.6449·(s/√30.42)·√10=9.2145, ROP=42.091, EOQ √(2·1200·50/0.5)=489.9 → match. 100/50/10 → A,A,B (crossing rule). Ties 70/10/10/10 → A,A,A,A (documented, P2B-15). XLSX loses leading zeros of SKU (P2B-07) |
| risk-assessment | Fully tested (math) | **Correct** | 25 cells L×S, bands ≤4/≤9/≤16/>16 → 0 mismatches. PPE-only high risk → "only-p"; medium without measure → "no-measure" |
| lean-assessment | Fully tested (math) | **Correct** | dim A (4,2)→3.0, dim B (NA, 4, 1)→2.5, overall 2.75, spread 2 flagged → match |
| skills-matrix | Fully tested (math) | **Correct** | Coverage at level ≥3, SPOF on count 1, flexibility (15/9)/4=0.4167 → match. Invalid level 9 → 0 |
| project-portfolio | Fully tested (math) | **Correct** (terminology OPINION) | DPMO 25/(1000·5)=5000 → σ(1.5 shift)=4.0758 → match. 66,807 DPMO → 3.00. RTY 0.95·0.90 (blank step skipped)=0.855. Kano table, RACI → match. COPQ includes prevention (OPINION) |
| five-s-audit (+photos) | Fully tested (math, photos) | **Minor issues** | Overall = mean of answered-S shares → (10/12+0.75+0.125+1)/4=0.677 → same. 4000×3000 JPEG stored as 1280×960, 11 kB (t15). Partial audits count fully (P2B-11) |
| shift-capacity | Fully tested (math) | **Correct** | ph=(8−0.5−0.25)·0.85=6.1625. 2000 orders×2.4=4800 lines/120=40 h → 7 heads → ⌈7/0.92⌉=8. Gap −5.983 h. Pooled 12. UPH 3600/(30·1.15)=104.35 → match |
| housekeeping-planner | Fully tested (math + Room Status read) | **Correct** | Total 3195 min, 408 productive min, ⌈3195/408⌉=8, min/occupied room 23.87, diff hours 17.35, sections sum = room minutes, credits 133.147→7 → match. Room Status codes→cleans as documented |
| process-lab (+2) | Fully tested | **Defective (input parsing, EN)**, statistics exact | vs scipy: I-MR limits, Cp/Cpk/Pp/Ppk, PPM, Anderson–Darling A², χ² (p 0.010117), Welch t/p, regression p, Gage R&R %SV/ndc → all within 1e-6. EN page misreads "47,2" as 2 (P2B-01). Gage interaction alpha 0.05 vs Minitab 0.25 (P2B-16) |
| room-inspection | UI tested | **Defective (verdict)** | 1 of 34 items answered "pass" → saved "100 %, Pass", first-time pass 100 % (P2B-05) |
| action-tracker / actions-store | UI + source | **Defective (data integrity)** | First visit writes 12 example actions to shared `sc-actions`. One real hand-over → 13 rows, example note gone (P2B-02). Write failures are swallowed (P2B-03). ICS (P2B-10) |
| leader-standard-work | Sampled math, ICS, print | **Correct** | tally done 2/missed 1/excluded 1/na/open → adherence 2/3 → match. ICS lines ≤75 octets |
| gemba-walk | Sampled math | **Correct** | compliance yes/(yes+no)=2/3. Vital few 50/30/15/5 → a,b |
| maintenance-planner | Sampled math, ICS | **Minor issues** | 31 Jan+1 month → 28 Feb. MTTR 90. MTBF (30−0.125)/2=14.94. Weekly grace 0 → on-time [T,F,F]. Compliance 1/3 → match. ICS folds at 60 UTF-16 units → 108-octet line in SQ (P2B-10) |
| poka-yoke | Sampled math | **Correct** | effectiveness (10−2)/10=0.8. Total (15−7)/15 → match |
| kaizen-event | Sampled math, DOCX | **Correct** | improvement 0.3, gap closed 0.75, target miss, baseline 0 → null → match. DOCX opens |
| spaghetti-diagram | Sampled math | **Correct** | Path 5+4=9 m, 2 cycles → 4.5 m, 3.75 s at "1,2" m/s, 450 m/shift → match |
| standard-work | Sampled parse, DOCX, print | **Correct** (minor parse) | "45", "45 s", "7,5", "1:30" → 45/45/7.5/90. "1:02:30" → NaN (shown as missing). DOCX opens in LibreOffice (2 pages) |
| eight-d | Source + exports + print | **Correct (not independently computed beyond day counts)** | daysTo = opened→done date (SOURCE). Report DOCX 6 pages in LibreOffice. Print 5 pages, nothing overflows |
| a3-report | Source + exports + print | **Minor issues** | Print of example: box 5 "Countermeasures" keeps only column WHAT; the other columns are cut at the page edge (P2B-06) |
| hoshin-kanri | Source + exports | **Correct** (export naming P3) | Bowling rules: two misses in a row; spreadTargets linear (SOURCE). Two different CSV/XLSX exports share one file name (P2B-17) |
| kaizen-board | Source | **Minor issues** | "Add to actions" has no duplicate check; failure undetectable (SOURCE, same pattern as P2B-03) |
| fishbone | Source + exports | **Not verified (math)** | No numeric output beyond vote counts. Exports valid |
| room-status | Source + exports + read by Housekeeping | **Correct (sampled)** | Read path verified in t20. Turnaround math SOURCE only |
| five-whys | UI | **Minor issues** | Writes `localStorage` directly; under a full store there is no warning (REPRODUCED t8) |
| six-sigma-dmaic (dmaic.js) | Content | **Correct** | 15 quiz answers checked. DPMO question 104/18,400 → 5,652 ✓. Pareto 56+14=70 ✓ |
| print-pack | Print | **Correct (sampled)** | 20-page pack, no blank pages, no overflow, EN and SQ |
| Tools Guide | Claims only | **Minor issue** | Calls Time Study output "the standard time of each element" (see P2B-09). Other formula claims (kanban N, pitch, AIAG-VDA) match the code |

Counts: **116 scripted pass/fail checks**: t1 43, t2 41, t3 20, t20 2, t21 10. There are 2 FAILs. One was my own wrong expectation for the risk fallback band (10 is "high" under the default bands, so the code is right). The other is P2B-13. Zero JS errors in 99 example loads and 165 damaged-storage loads (REPRODUCED t4, t7).

## 3. Defect register (most severe first)

### P2B-01: Process Lab (English page) silently misreads decimal-comma data and draws wrong conclusions
- Severity: **P1**
- URL: /tools/process-lab/
- Source: src/js/process-lab.js:8-31 (`commaColumn` only when `DECIMAL_COMMA`) and tool-kit.js:178-189 (`parseRows` picks "," as the separator when the first line has a comma)
- Evidence (REPRODUCED, `t5-pl-comma.js`): pasting `47,2 48,1 46,9 47,5 48,0 47,7 46,8 47,9` (one per line) into the EN page shows **"Mean 5"**, **"Cpk -2.42 … Expect about 1,000,000 per million outside (100.0%)"** and "The values follow a normal curve". The same data on /de/ gives mean 47.5, Cpk 1.19. Every line is split at the comma and the last cell ("2", "1", "9" …) is kept. No warning is shown.
- Expected vs actual: either read 47.2, or refuse with a message. Actual: plausible-looking wrong statistics.
- User impact: anyone using the English page with data from a German or Albanian Excel gets false capability verdicts. This is the site's core audience.
- Confidence: high
- Suggested correction: when a single-column paste has exactly one comma per line and nothing else, treat it as a decimal comma on every language. Also warn whenever the parsed values have fewer digits than the text.
- Regression risk: low. CSV pastes with several columns keep their path. The same parse feeds the "compare two means" tab.

### P2B-02: The Action Tracker example merges into the real, shared action list
- Severity: **P1**
- URL: /tools/action-tracker/ (all languages share `sc-actions`)
- Source: action-tracker.js:81-91 and 490ff (first-visit example). actions-store.js is shared by every tool.
- Evidence (REPRODUCED, `t14-example-mix.js`):
  - The first visit writes 12 realistic example actions to `sc-actions`: names "Anna", "Besnik", due dates relative to today, sources "five-whys", "fmea".
  - A real hand-over then arrives via `?action=Real fix at dock 3&source=five-whys`. Result: 13 rows, and the example note is gone.
  - `exampleOn()` requires *all* rows to be example rows, so "Clear the example" no longer applies. The only ways out are deleting 12 rows one by one or "Clear every action".
- Expected vs actual: either example rows stay marked and removable, or the example is never written to the shared store. Actual: fictional overdue actions become indistinguishable from real ones and feed the tracker's KPIs, its CSV/XLSX/ICS and other tools that read `sc-actions`.
- User impact: wrong overdue counts and owners, and fictional tasks pushed into phone calendars.
- Confidence: high
- Suggested correction: keep `exampleIds` visible as a filter or chip with "Remove example actions" while any example row exists. Or render the example from memory without writing it.
- Regression risk: low.

### P2B-03: Hand-overs to the Action Tracker duplicate actions and lose them silently when storage fails
- Severity: **P2**
- URL: /tools/smed/, /tools/time-study/, /tools/kaizen-board/ → /tools/action-tracker/
- Source: actions-store.js:44-48 (`write` sets `failed = true`; nobody reads `failed`), smed.js:923-936, time-study.js:695-705, kaizen-board.js:367-373
- Evidence (REPRODUCED, `t9-handoff.js`):
  - (a) SMED example → "Add the 12 countermeasures to actions" → reload → click again. `sc-actions` holds **24 rows, 12 unique**.
  - (b) `sc-actions` setItem throws QuotaExceededError. SMED still says **"Added 12 actions. Open the Action Tracker"**, nothing is stored and no warning appears.
  - Also, as SOURCE: the Action Tracker's own edits go through the same `write`, so a full store loses them without the `tk-save-warning` other tools show (t8: no warning on the tracker).
  - The VSM hand-off de-duplicates (value-stream-map.js:712-718), so the codebase already has the fix.
  - Note that (a) also turns *example* countermeasures into real actions.
- User impact: duplicate or phantom actions, and the false belief that actions were recorded.
- Confidence: high
- Suggested correction: a de-duplicating `ActionsStore.add` (same open title and source), a return value that reports failure, and the ToolKit save warning on failure.
- Regression risk: low.

### P2B-04: Heijunka freezes the tab on large but plausible volumes
- Severity: **P2**
- URL: /tools/heijunka/
- Source: heijunka.js:119-127 (`maxRuns` calls `sequence()` for every m up to the container count), 46-50 (`containers` allocates one array element per container), and analyse runs on every input
- Evidence (REPRODUCED, `t19*.js`, `t18-heijunka-huge.js`):
  - analyse() takes 0.23 s at 800 containers/day.
  - With pack-out 1: 0.37 s at 5,000 units/week, 1.1 s at 10,000 and **4.6 s at 20,000 units/week**, growing roughly quadratically.
  - Typing demand 1000000000 in the UI blocked the page for over 2 minutes, then the Playwright target closed. Direct analyse() threw `RangeError: Invalid array length`.
- User impact: the page freezes or crashes for unit-level levelling (pack-out 1) at warehouse volumes. There is no input cap and no message.
- Confidence: high
- Suggested correction: cap containers per product, for example 2,000 a day with a message. Compute `maxRuns` by bisection or incrementally, and debounce analyse.
- Regression risk: low.

### P2B-05: Room Inspection passes a room after one item is checked, and counts it in the first-time pass rate
- Severity: **P2**
- URL: /tools/room-inspection/
- Source: room-inspection.js:41-56 (score over judged items only; verdict ignores `open`), :811-818 (save allowed; message only)
- Evidence (REPRODUCED, `t6-ri-partial.js`, screenshot `ri-partial.png`): room 412, 1 of 34 items set to Pass, Save. Status: **"Saved: room 412, 100%, Pass. 33 items were not checked."** KPIs: **first-time pass 100 %, average score 100 %**.
- Expected vs actual: an incomplete inspection should be "incomplete" (no verdict) or excluded from pass rates. Actual: it is a pass and lifts attendant and floor KPIs.
- User impact: inflated quality KPIs, and rooms released without inspection.
- Confidence: high
- Suggested correction: verdict `null` while `open > 0`, unless "Mark the rest as pass" was used. Exclude incomplete records from rates.
- Regression risk: low. The example data is complete.

### P2B-06: A3 print cuts off the countermeasure table
- Severity: **P2**
- URL: /tools/a3-report/ ("Print or save as PDF")
- Source: the `.a3-table-wrap` (`dl-table-wrap`) keeps horizontal scroll in print
- Evidence (REPRODUCED, `t12-print.js`, `pdf/en-a3-report.pdf`, crop `pdf/a3-crop-1.png`): box 5 "COUNTERMEASURES" shows only the WHAT column. The owner, due and status columns are clipped at the box edge (single letters "A", "B", "M" visible). Element measured as `scrollWidth 960 > clientWidth 597`. The header text is dark on a dark band. Same in SQ.
- User impact: the one-page A3, the artefact the tool exists to produce, loses who/when on paper.
- Confidence: high (Chromium print engine; other engines NOT VERIFIED)
- Suggested correction: in `@media print`, unset overflow on table wraps, use `table-layout: fixed` and wrap text.
- Regression risk: low.

### P2B-07: XLSX export turns code-like text into numbers (SKU "00123" → 123)
- Severity: **P2**
- Source: tool-kit.js `xlsxCell`: `/^-?\d+(?:\.\d+)?$/` text with fewer than 16 characters becomes a number. This affects every tool.
- Evidence (REPRODUCED, `t11-import.js`): ABC import of SKUs 00123/00124/00125 (kept correctly as "00123" in storage and in Kanban). The Excel export holds `123`, a numeric cell (openpyxl). Re-importing the tool's own Excel file gives SKU "123", and result columns are read as demand (`20|0.2|1200`).
- User impact: SKU, article, room or employee codes with leading zeros are corrupted in exports. Look-ups against the ERP fail.
- Confidence: high
- Suggested correction: keep strings as strings (numbers are already passed as `number`), or apply the conversion only to columns declared numeric.
- Regression risk: medium. Some tools pass numbers as formatted strings and rely on the conversion.

### P2B-08: Damaged saved data is replaced on load before a restore point can capture it
- Severity: **P3**
- Source: a3-report, eight-d, kaizen-event, lean-assessment, poka-yoke and standard-work write on first load. storage-guard.js runs after the tool scripts (script order on /tools/a3-report/: tool-kit #1, a3-report #5, storage-guard #11).
- Evidence (REPRODUCED, `t7-corrupt.js`): `sc-a3-report` = truncated JSON → the value is "replaced" on load. The other 27 tools keep the damaged value. No JS errors in any of 165 damaged-storage loads.
- User impact: a truncated but hand-recoverable record is overwritten. Yesterday's restore point remains.
- Suggested correction: do not write on load when the stored value failed to parse. Or move the restore-point snapshot ahead of the tool scripts.

### P2B-09: Time Study's "standard time" is observed median time without performance rating or allowance
- Severity: **P2** (methodology and labelling)
- Source: time-study.js:24-38 (median as "the standard"). The export is named `time-study-standard`. The Tools Guide says "The standard time of each element". The tip reads "The standard describes the method at a normal pace", but there is no rating input.
- Evidence (SOURCE plus REPRODUCED numbers in t1): the operator count ⌈Σmedian/takt⌉ uses raw medians. Shift Capacity adds a PF&D allowance when it imports these times (shift-capacity.js:620-628, default allowance), which is correct. Time Study itself does not.
- User impact: staffing taken straight from Time Study is understated by the allowance (typically 10–15 %), and by the pace of the observed operator.
- Suggested correction: either call it "observed (median) time" or add a rating % and an allowance % with standard time = median × rating × (1+allowance).

### P2B-10: Calendar (.ics) files: unfolded long lines and English labels in German and Albanian
- Severity: **P3**
- Source: actions-store.js `ics` (no folding; "Check:", "Area:", "From: <slug>" hard-coded), maintenance-planner.js `ics` (folds every 60 UTF-16 units, not 75 octets)
- Evidence (REPRODUCED, `validate.py`, `t16-ics.js`): DE Action Tracker ICS has 7 lines longer than 75 octets (max 209), with `\nCheck: …\nArea: Tor 2\nFrom: five-whys`. The SQ Maintenance ICS has a 108-octet line. The 5S and LSW files fold correctly at 75 octets.
- Suggested correction: reuse the octet-based `fold` from five-s-audit.js and translate the labels.

### P2B-11: 5S audits with a few answers count as full audits in trend and league table
- Severity: **P3**
- Source: five-s-audit.js:21-37 and the save path at :206 (enabled at ≥1 answer)
- Evidence (REPRODUCED t2): a single answer "1" in one S gives overall 0.25 (or "100 %" from a single "4"). The result card shows "a of b questions scored", but the trend and league table do not.
- Suggested correction: mark partial audits in the trend and league table, or require a minimum share answered.

### P2B-12: 5 Whys does not warn when its data cannot be saved
- Severity: **P3**
- Source: five-whys.js:23-25
- Evidence (REPRODUCED t8): under a full store, no `tk-save-warning` appears, unlike FMEA, Time Study, Kanban and Standard Work.

### P2B-13: Heijunka takt silently drops the demand of a product without pack-out
- Severity: **P3**
- Source: heijunka.js:226-229
- Evidence (REPRODUCED t1): with a 4th product of 300/day and no pack-out, takt stays 77.14 s instead of 54 s. The page does say "{n} products without demand or pack-out are left out", but takt, pitch and EPEI change meaning.
- Suggested correction: compute the takt from all demand and leave only the sequencing to complete products.

### P2B-14: VSM names the bottleneck by cycle time while another step is the real constraint
- Severity: **P3**
- Source: value-stream-map.js:47-55 vs capacity at :42-46
- Evidence (REPRODUCED t1): Weld (CT 39 s) is called the bottleneck. Assy (62 s / 2 operators, 50 % uptime) has a capacity of 445/day against a demand of 460 and is the actual constraint. The focus card can then say "Every step keeps up with takt" while a warning below says Assy cannot meet the day (SOURCE :681-695).

### P2B-15: ABC ties can put a whole tail into class A
- Severity: **P3** (documented rule)
- Evidence (REPRODUCED t1): values 70/10/10/10 → A,A,A,A. All SKUs are A and class A carries 100 % of the value.
- Suggested correction: state the effect in the result when ties move the A/B boundary.

### P2B-16: Gage R&R pools the interaction at α = 0.05 although the comment claims Minitab parity
- Severity: **P3**
- Source: stats-kit.js:663-690 (default 0.05). Minitab's default "alpha to remove interaction" is 0.25 (from my knowledge; NOT VERIFIED against a Minitab install).
- Evidence (REPRODUCED, `gage_alpha.py`): a dataset with p_interaction = 0.096 gives %SV 16.32 % (pooled) vs 16.71 % (kept) at the same ndc.

### P2B-17: Two different Hoshin Kanri exports get the same file name
- Severity: **P3**
- Evidence (REPRODUCED t10): both CSV buttons download `hoshin-kanri-2026-10-27.csv` (same for XLSX), so the second arrives as "(1)".

### P2B-18: Minor export polish
- Severity: **P3**
- Evidence (REPRODUCED, `validate.py`):
  - The DE Time Study "standard" CSV has a dot decimal (`9.8`) next to comma decimals.
  - The `csvSafe` apostrophe is also applied inside XLSX inline strings (SOURCE), where formulas cannot run. Text starting with "-" (e.g. "- check door") would show a literal `'`. Not observed in the example files.
- A long unbroken token (222 characters) in an FMEA field pushes the printed sheet past the page edge (REPRODUCED, `pdf/fmea4-04.png`). Realistic long German compounds print correctly (`pdf/rf-04.png`).

### P2B-19: Per-language storage keys silo the work (architecture note)
- Severity: **P3** (OPINION/INFERRED)
- Evidence (SOURCE): most tools use `sc-<tool>-de` / `-sq` (e.g. `sc-fmea-de`), but the Action Tracker shares `sc-actions`. A visitor who switches language sees an empty tool. Their work is not lost but appears to be. Cross-tool reads respect the language consistently (kanban→ABC, housekeeping→room status, shift capacity→skills/time study: SOURCE).

## 4. Genuinely good (with evidence) and must-not-change

- **Core formulas are exact:**
  - AIAG-VDA AP: 1000/1000.
  - Kanban (Monden form plus statistical safety stock with correct ⌈ ⌉ tolerance).
  - Heijunka takt, pitch and EPEI (Rother & Shook), VSM lead time and PCE, SMED parallel-lane downtime.
  - ABC/XYZ with Bessel SD, √t scaling, ROP and EOQ.
  - Shift-capacity gross heads h/(1−a), UPH with PF&D.
  - Housekeeping credits and minutes, section balancing (gap ≤ largest room).
  - DPMO and σ with the 1.5 shift, Kano table, RACI rules.
  - Maintenance month-end arithmetic, MTTR/MTBF, ArbSchG-based STOP checks.
  - Process Lab statistics match scipy to 1e-6.
- **Robustness:** no page error in 99 example loads (3 languages) and 165 damaged-storage loads. A missing rating is never treated as 1 (FMEA, risk). Saved data is rebuilt field by field.
- **Export validity:** every XLSX and DOCX file (80 checked) is a valid zip whose XML parses. openpyxl opens all XLSX. LibreOffice opens 8D, A3, Standard Work and FMEA. DE CSVs use `;` and decimal commas. CSV formula injection is neutralised.
- **Small samples are stated:**
  - Time Study warns below 3 cycles.
  - ABC warns below 6 periods.
  - Process Lab warns below 20 values and below 8 for Anderson–Darling.
  - Maintenance MTBF needs ≥2 breakdowns.
  - Sigma uses the rule of three when there are 0 defects.
- **Photos:** resized on device to 1280 px JPEG at quality 0.7 (4000×3000 → 1280×960, 11 kB). They are not put in the backup, and the page says so.
- **DE/SQ translation of tool UI:** the heuristic scan of 66 pages found one English attribute string (DE poka-yoke). Numbers use de-DE formatting.
- **Must not change:** the "missing rating is not a 1" rule. The tolerance-aware `ceilUp`. The VSM hand-off de-duplication (copy it, don't remove it). The `tk-save-warning` mechanism. Field-by-field cleaning of saved state.

## 5. Proposed scores

**Mathematical and tool accuracy (lean / planning / hotel group): 80 / 100**

| Criterion | Points |
|---|---|
| Formula correctness against independent computation | 38/40. Only methodological labelling (Time Study "standard", VSM bottleneck) |
| Input validation and edge cases | 13/20. EN decimal-comma misparse with wrong verdicts (P1). Heijunka has no volume cap. Partial inspections and audits produce verdicts |
| Conclusions supported by the data and denominators | 15/20. Room "Pass" on 1/34 items. Contradictory VSM focus text. Takt excluding demand |
| Small-sample disclosure | 9/10 |
| Numerical fidelity of exports and prints | 5/10. Leading zeros lost. A3 table clipped. ICS issues |

**Input for "Architecture and technical reliability": 72 / 100**

| Criterion | Points |
|---|---|
| Resilience to damaged or old data | 18/20. No crashes. Six tools overwrite damaged values before the restore point |
| Storage-failure handling | 10/20. ToolKit warns, but `ActionsStore` and 5 Whys swallow failures. Hand-overs report success on failure |
| Cross-tool integration integrity | 12/20. Shared action store polluted by the auto-example. No de-duplication in 3 of 4 hand-offs. Per-language silos |
| Export/import formats | 16/20. Valid OOXML. Text-to-number coercion |
| Performance and scalability | 8/10. Heijunka quadratic freeze. Others fine at tested sizes |
| Print | 8/10 |
