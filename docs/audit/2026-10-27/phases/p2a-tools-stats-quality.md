# Phase 2a: technical reliability and data integrity of the statistics, quality and KPI tools

Auditor phase: `p2a-tools-stats-quality`. Clone audited: `audit-src` @ `3cb88a244c9337b8957a31d9fe499a4827f56c08` (read-only).
Harness and outputs: `$AUDIT_WORK/p2a-tools-stats-quality/`
(each `tNN-*.cjs` script can be re-run with `node <script>`; its saved output is in `tNN.out`; the PDFs are in `pdf/`).
Local server: `node tests/browser/server.mjs 8102`, run from `audit-src`.

## 1. Scope and method

- **Real code, real pages.** Each tool was run in one of two ways:
  - The built page from `_site/tools/<slug>/` loaded in jsdom. My harness (`lib.cjs`) strips the `<script src>` tags, seeds localStorage and then evals the real `src/js/*.js`. The language files `ui-de.js` and `ui-sq.js` come from `_site/js`.
  - The built site in real Chromium through Playwright (`pw.cjs`, port 8102, timezone Europe/Berlin).
- **Independent expectations.** Expected values were worked out by hand or in separate code inside each script (the comments show the arithmetic). They were never taken from the tool's own tests. The only exception is `existing-tests.txt`, which records the repo's own tests as a baseline: 125/125 passed on the second run. The first run had 1 failure that did not recur, so one test is **flaky**. I did not identify which test (NOT VERIFIED).
- **Covered:**
  - All 23 tools in my group, in EN, plus DE and SQ for print, language and number formats.
  - The shared code: `tool-kit.js` (parsing, `logBook`, example handling, CSV, sigma), `stats-kit.js` (I-MR, Nelson rules, control charts through Signals), `chart-kit.js` (rendering only, through print), `storage-guard.js` (source), `actions-store.js` (source).
- **Not verified:**
  - Work Backup JSON round-trip (`work-backup.js`, SOURCE only).
  - XLSX export content (the code path exists; I did not open the files).
  - A real quota-exceeded browser write. My jsdom override did not trigger it; `write()` catches the error and shows `.tk-save-warning` (SOURCE).
  - Team Sync and Site Compare network reads.
  - Lost & Found legal retention periods.
- **Production checkout.** I wrote nothing there. Every output above went under the scratchpad. The stray `stats_expected.json` the coordinator found does not come from my scripts (`grep` finds no reference) and I never created it. `git status` in production was clean when I checked.

## 2. Coverage and verdicts (one row per tool)

The "Test case" column gives the reproducible case with expected vs actual values. All test cases are REPRODUCED unless marked otherwise.

| Tool | Verdict | Test case (expected vs actual) | Evidence |
|---|---|---|---|
| shift-pulse | Minor issues (math correct; shows persisted example as real, see P2A-01) | 10 routes, grace 15, one with no arrival time: judged 9, late 4 (+16, +45, 23:50→00:20, +120), on-time 5/9 = 55.6%. Exp 55.6% = act 55.6%. Week vs day totals: 65 = 65 across the DST week | t02, t10, t01b |
| shift-handover | Correct (P3: "Incomplete %" row filled with a count) | Same log, delivery template "Fill from the logs": exp 55.6% "5 of 9 routes" = act | t02 |
| damage-control | Math correct; example handling and import defective (P2A-01, -07, -10) | 6 units / 4,000: exp 0.15%, DPMO 1,500, σ 4.47, "On target" vs 0.3%; act identical in EN and DE (0,15 %, 1.500, 4,47, "Im Ziel") | t06 |
| incomplete-control | Math correct (shares defect-log.js) | Example: 0.90%, DPMO 9,032, σ 3.86, 25 over 0.5%. Recomputed: 56/6,200; floor(31) → 25 over | t19 |
| night-audit | Math correct | Example: 3.65%, DPMO 36,508, σ 3.29 (z(0.9635)=1.793+1.5), 21 over 2% (floor 25.2=25; 46−25) | t19 |
| delay-analyzer | Correct (P3: sigma level on very small n, no caveat) | Same 10 routes: 55.6%; "σ 1.64, short term, with 1.5 shift" is declared. An empty grace box gives 0 consistently in the Analyzer, Pulse, Handover and Ops Report | t02 |
| cx-control-tower | Minor issues | Fixture of 10 orders: on-time 6/8 (unknown excluded), Perfect 3/8, incomplete 1/9, first attempt 8/10 over all orders, notification 1/2, complaints 100/1,000, cold 1/2: all = act. ISO weeks incl. 2026-W53, 2020-W53, 25/26 Oct 2026 = act. Target "0.8" for Incomplete is read as 80% | t08 |
| kpi-diagnostic | **Defective** (P2A-08) | Clarity 3/6 vs every other cause 1/6 gives the headline "Most likely: Clarity" and a High-priority action, with no caveat | t07 |
| sigma-control-chart | Minor issues (P2A-09, P2A-12, P2A-06 print) | UCL_i = p̄+3√(p̄(1−p̄)/n_i) exact for n=800/900/1000. Run of 8 yes / 7 no; trend of 6 yes / 5 no; ties break a trend. A single low day gives "A real improvement / lasting improvement". A zero-defect chart (250 units) gives σ "6+" | t03 |
| pareto | Correct | 130 causes: cumulative 40/130 = 30.77%, "Other" kept last at 100%, "Café"/"Cafe" folded **and reported** as merged, negative/text counts listed as skipped | t16 |
| oee | Correct math; print clipped | 480 planned, 30 break, 45 breakdown, 15 setup, 350 pcs at 60/h, 14 rejects: A = 390/450, P = 350/390, Q = 336/350, OEE 0.7467 = act. Combine is time-weighted and A×P×Q = OEE holds. Over-speed is capped and flagged | t16, t15 |
| signals | Minor issues (P2A-11) | I-MR UCL = x̄+(3/1.128)·MR̄ exact; p-chart limits per n exact; fewer than 8 points gives no alarm. Monte Carlo of stable Poisson(0.2): 19.3% of days carry a "good side" signal | t04 |
| site-compare | **Defective ranking** (P2A-13) | A depot with 2 routes and nothing else ranks #1 (100) above a 2,000-route hub (87.5) | t13 |
| cost-of-quality | **Defective handoff** (P2A-02); math correct | Waste Log row 10 × €2.50: expected €25 brought in; actual "Nothing to bring in". Monthly: week×52/12 and quarter/3 correct; scenario net/yr correct | t05, t16 |
| daily-board | **Defective** (P2A-03, P2A-04, P2A-05) | One first visit writes a demo profile into `sc-workplace`. A 0.40% damage day is red against an unset "target 0.30%". 5S pooled 80% vs 50% per-S | t21, t21b, t12 |
| ops-report | Minor issues (inherits P2A-01; P3 censoring) | "Damage Control 30 entries" in the report came only from an example that a range-button click had persisted | t01b |
| hotel-kpis | Minor issues (P2A-14) | Occupancy 290/300, ADR 29,900/290, RevPAR 29,900/300, no-show 7/127 = act. Sold 120 > available 100 accepted (occupancy 120%) | t09 |
| energy-tracker | Correct; print clipped | Readings 1,000 / 1,700 / 2,600: October 1,550 = sum of weeks; DST week 19–25 Oct = 350 (7 days) | t10, t15 |
| andon | **Defective** at DST (P2A-05b); print clipped | 30-minute live call 02:40 CEST → 02:10 CET on 25 Oct 2026: exp 30 min, act **1,410 min**. Spring-forward 20 min → 80. Medians, within-target and midnight crossing correct | t11, t20 |
| safety-cross | Minor (P3 Bird mapping) | LTIFR 1×1e6/160,000 = 6.25, TRIR 2×2e5/160,000 = 2.5, days-since across DST = 3 | t20 |
| waste-log | Correct; print clipped | Total €201.66 = sum of weekly; first partial week counts 6 days | t10, t15 |
| guest-complaints | Correct; print badly clipped | Within target 1/3 (open past target = missed, no time = unknown), per 100 = 2.5. The DST limitation is declared in source | t20, t15 |
| lost-found | Correct; print clipped | Keep-until high +180 d = 2027-04-23, documents +7 d, "over" on the day after | t20, t15 |

Coverage levels:
- **Fully tested (formula plus page output):** shift-pulse, shift-handover, damage/incomplete/night (defect-log), delay-analyzer, sigma chart, signals, oee, pareto, CoQ, CX KPIs, hotel KPIs, andon, daily-board.
- **Sampled through Math objects plus example render:** energy, waste, guest complaints, lost & found, safety cross, site compare, ops report.
- **Source-inspected only:** storage-guard restore points, actions-store, work-backup.

## 3. Regression checks (re-verified independently)

| # | Check | Result | Evidence |
|---|---|---|---|
| 1 | Sample data merging with real data | **FAIL** (three paths) | P2A-01 (delete one example row, then add your own: 29 example rows stay as real data), P2A-01b (a persisted example is shown as real by Shift Pulse, Ops Report and Signals), P2A-03 (Daily Board demo profile) |
| 2 | On-time % in Shift Pulse / Shift Handover | **PASS** | Definition: on time = arrival ≤ grace among routes with both arrival times. Early counts as on time; unknown is excluded; partial logs give counts only. All three tools agree (t02) |
| 3 | Period totals | **PASS** (sampled) | Pulse day vs week, Energy month vs weeks, Waste weeks vs total, trendBuckets weekly sums, all across DST and month-end (t10). Note: trend charts keep only the last 60 buckets (420 of 490 rows over 70 weeks), P3 |
| 4 | False statistical alarms | **PARTIAL** | Rules and limits correct, 8-point gate in Signals, under-12-points caveat in Sigma. But: low-count c-charts give "good-side" signals on 19% of days (t04), and one low point is called a "lasting improvement" (t03) |
| 5 | Undeclared KPI targets | **FAIL** | Daily Board hidden defaults 0.3% / 0.5% / 95% / 80% (P2A-04). Demo profile targets (P2A-03). OEE 85% "target" in Pulse/Signals and the CX 20-min loading fallback (P3). CX main KPIs correctly have no target until one is approved |
| 6 | Incorrect denominators | **Mostly PASS** | CX (per delivered vs per order, declared), hotel no-show (arrivals + no-shows), Signals = Hotel tool, Guest Complaints, Andon all correct. Issues: occupancy > 100% accepted (P2A-14), Daily Board 5S pooled (P2A-05), L&F return rate compared across unequal ages (P3) |
| 7 | Unsupported diagnostic conclusions | **FAIL** | KPI Diagnostic (P2A-08), Sigma "lasting improvement" (P2A-09), Site Compare ranking (P2A-13) |
| 8 | Unicode handling | **PASS** | "Ünïcödé 🚚 Çelës", quotes and semicolons survive CSV export and import in EN, DE and SQ. The CSV has a BOM. The Pareto accent fold is disclosed (t06, t14, t16) |
| 9 | Print clipping | **FAIL** | 7 tools clip tables on A4 in all three languages (P2A-06) |

## 4. Defect register (most severe first)

### P2A-01 — Example rows become "real" data after deleting a single example row
- Severity: **P1** (wrong numbers users act on).
- URL: /tools/damage-control/ (and every `logBook` tool: incomplete-control, night-audit, delay-analyzer, daily-board…).
- Source: `src/js/tool-kit.js:943-958` (`exampleMatches` by row count and first/last date; `note.sync` sets `state.example = {}` once the shape changes) and `:1037-1048`, `:1160-1167`.
- Evidence (REPRODUCED, `t01-example-merge.cjs`, real Chromium):
  - Fresh profile, open Damage Control: the 30-row example loads.
  - Click × on one example row: the example note disappears.
  - Add one own entry: storage holds **30 rows, `example: {}`**.
- Expected vs actual: expected only the own row (the example dropped as a whole, as the code comment promises). Actual: 29 example rows merged with real data, with no label.
- User impact: rates, DPMO, Pareto, Shift Pulse, Signals, Ops Report and the CSV all include fabricated example events.
- Confidence: high.
- Suggested correction: mark example rows individually (e.g. `row.example = true`). Drop them all on the first own edit or delete. Never derive "example-ness" from the shape.
- Regression risk: low.

### P2A-01b — A persisted example is shown as this site's data by the aggregators
- Severity: **P1**.
- URL: /tools/shift-pulse/, /tools/ops-report/, /tools/signals/.
- Source:
  - `tool-kit.js:1160-1167`: the first visit loads the example into `state`, and any later change saves it to the real key.
  - `shift-pulse.js:450-453`: `logOf` ignores `example`. There is no "example" check in shift-pulse.js (0 matches); ops-report and signals do the same.
- Evidence (REPRODUCED, `t01b-example-leak.cjs`): visit the three logs and click only the "week" and "all" range buttons. Storage now holds the example with its stamp. Shift Pulse then shows "Damaged units 68 · Damage rate 0.55% · On-time routes 79.5%", and Ops Report shows "Damage Control 30 entries in the period". Neither says "example".
- Expected vs actual: expected the example to be excluded or labelled. Actual: presented as real.
- Confidence: high.
- Suggested correction: aggregators skip any log whose `exampleMatches` is true, or show it with an "Example" tag. Better, keep the example out of the persisted key entirely, as Signals, Ops Report and Site Compare already do for their own examples.

### P2A-02 — Cost of Quality "Bring in" never brings in Waste Log costs (field-name mismatch)
- Severity: **P1** (cross-tool handoff silently broken).
- URL: /tools/cost-of-quality/.
- Source:
  - `src/js/cost-of-quality.js:163-176` reads `row.quantity` and `row.unitCost`.
  - Waste Log saves `qty` and `cost` (`waste-log.js:4-5, 24, 163`).
  - The unit test `tests/cost-of-quality.test.cjs:146-148` uses an invented `{quantity, unitCost}` shape, so it passes.
- Evidence (REPRODUCED, `t05-coq-handoff.cjs`, real Chromium): log "Bread rolls 10 kg × €2.50" through the Waste Log form. The stored row is `{qty:10, cost:2.5}`. In CoQ, "Bring in" answers: "Nothing to bring in: this browser holds no Waste Log entries…".
- Expected vs actual: expected €25.00 internal failure; actual none. Both tools came from the same commit (#345), so this was broken from the start.
- User impact: the cost of poor quality is understated by the whole waste cost, and the user is told there is no waste.
- Confidence: high.
- Suggested correction: read `qty × cost` (or reuse `WasteLogMath.value`), and test against a row produced by `WasteLogMath.cleanRow`.

### P2A-03 — Opening the Daily Board once writes a demo workplace profile that all tools then use as "your" targets
- Severity: **P1** (example data contaminates real data).
- URL: /tools/daily-board/.
- Source: `daily-board.js:654-670` (`loadExample` → `Workplace.set(ex.profile)`), run on a first visit through `logBook`.
- Evidence (REPRODUCED, `t21-demo-profile.cjs`, `t21b-demo-profile.cjs`): a fresh profile visits the Daily Board. `sc-workplace` now holds `{"site":"Frankfurt hub · Outbound","shifts":["Early","Late","Night"],…,"targets":{"damage":0.3,"incomplete":0.5,"ontime":95,"fives":80,…}}`. The visitor then clears the Damage Control example and logs 5 units out of 1,000. The result reads "Target: 2 over · 2 fewer damaged units reach 0.30%", with "From the workplace profile". The visitor never created a profile.
- Expected vs actual: expected no profile and no target. Actual: a demo profile and its targets are applied to real data in every tool. It is only removed if the visitor later adds their own Daily Board row.
- Confidence: high.
- Suggested correction: never write the shared `sc-workplace` key from an example. Hold the demo profile in memory only.

### P2A-04 — Daily Board colours real days red against hidden default targets
- Severity: P2.
- URL: /tools/daily-board/.
- Source:
  - `src/_data/dailyBoard.json` targets `default: 0.3 / 0.5 / 95 / 80`.
  - `daily-board.js:337`, `:144`, `:185`, `:188`.
  - The setup only passes placeholders ("e.g. 0.3", `:382`). The page never says an empty box means a default target.
- Evidence (REPRODUCED, `t12-daily-board.cjs`): damage log 4/1,000, target box empty, no profile. Huddle agenda: "Q Quality: Red · Damage rate 0.40% (target 0.30%)".
- User impact: red days and huddle items driven by a target nobody set.
- Suggested correction: no default target (state "none"), or label it "default 0.3% (not set)".

### P2A-05 — Daily Board 5S score uses a different formula from the 5S Audit, Shift Pulse, Signals and Ops Report
- Severity: P2.
- Source:
  - `daily-board.js:35-41` pools all answered questions.
  - `five-s-audit.js:21-37`, `shift-pulse.js:280-286` and `ops-report.js:210-214` take the mean per S, then the mean over the S.
- Evidence (REPRODUCED, t12): Sort [4,4,4,4], Set [0]. 5S Audit, Pulse and Signals give **50%**; Daily Board gives **80%**. That passes its 80% target while the audit says 50%.
- Suggested correction: reuse `FiveSMath` or the shared overall.

### P2A-05b — Andon durations are wrong at a DST change (25 Oct 2026)
- Severity: P2.
- URL: /tools/andon/.
- Source: `andon.js:41-46` (`span` on wall-clock HH:MM with a +1440 wrap) and `:262-281` (`closeCall` turns epoch ms into local HH:MM before measuring).
- Evidence (REPRODUCED, `t11-andon-dst.cjs`, TZ=Europe/Berlin):
  - Call 00:40Z → solved 01:10Z (30 real minutes): row "02:40 → 02:10", resolve = **1,410 min**.
  - 29 Mar 2026, 20 real minutes: recorded as **80**.
  - A real 25-hour call: recorded as **60 min**.
- User impact: one call in the DST hour dominates the mean, the "slowest calls" list and the escalation levels. Guest Complaints declares the same limitation in its source comment; Andon does not.
- Suggested correction: for live calls, store `calledAt` and `solvedAt` (ms) in the row and measure from them.

### P2A-06 — Print/PDF cuts off table columns in 7 tools (EN, DE, SQ)
- Severity: P2.
- URLs: /tools/{guest-complaints, waste-log, lost-found, andon, oee, energy-tracker, sigma-control-chart}/, plus the /de/ and /sq/ versions.
- Evidence (REPRODUCED, `t15-print.cjs`, print media at 718 px ≈ A4 with 1 cm margins, then `page.pdf()`):
  - Guest Complaints: a 2,670 px table (DE 3,063) printed at 718 px.
  - Waste Log: 1,242 (DE 1,548).
  - Lost & Found: 1,481.
  - `div.dl-table-wrap` with `overflow:auto` clips in Andon (1,150 > 631), OEE, Energy and Sigma.
  - `pdf/en-andon.pdf`: the slowest-calls table prints only "DATE CALLED STATION REASON". The Respond, Solve and Line-stop columns are missing (pdftotext).
  - `gc-p5-5.png`: the complaint log is cut at the right edge.
  - DE Site Compare overflows by 3 px.
- Suggested correction: a print stylesheet for `.dl-table-wrap` (`overflow:visible`, `table-layout:fixed`, wrap long cells, or landscape `@page`), or hide the full log in print and keep the summary tables.

### P2A-07 — Importing the same CSV twice doubles the log without warning
- Severity: P2.
- URL: every `logBook` tool.
- Source: `tool-kit.js:1028-1038` (`state.rows.push(...added)`, no duplicate check).
- Evidence (REPRODUCED, `t14-roundtrip.cjs`): export 2 rows, import, import again: 4 rows in EN, DE and SQ.
- User impact: rates and DPMO double. Re-importing an export is a natural "restore" action.
- Suggested correction: detect identical rows and ask before adding them.

### P2A-08 — KPI Diagnostic names a "Most likely" cause from a 2-point difference on two self-rated statements
- Severity: P2 (unsupported conclusion).
- URL: /tools/kpi-diagnostic/ (+ DE "Am wahrscheinlichsten", SQ "Më i mundshmi").
- Source: `kpi-diagnostic.js:43-48` (threshold: best > 2 of 6 and best − lowest ≥ 2).
- Evidence (REPRODUCED, `t07-kpi-diagnostic.cjs`):
  - Answers: Clarity "Mostly" + "Partly" (3/6), every other cause "Partly" + "Not true" (1/6).
  - Headline: "Most likely: Clarity".
  - 5 Whys link: "KPI is red; the diagnostic points to Clarity."
  - Action Tracker link: `priority=High`, "First move on KPI: Clarity".
  - No text on the page says this is a self-assessment hypothesis to check on the floor. The page claims it will "find where the process first became unstable" and that "the result shows which cause fits your situation best".
- Suggested correction: word it as "Your answers point most to…, a hypothesis to check", show the score margin, require a larger gap or ask more than 2 items per cause, and do not create High-priority actions from it.

### P2A-09 — Sigma chart calls one point below the lower limit "A real improvement… a lasting improvement"
- Severity: P2.
- URL: /tools/sigma-control-chart/.
- Source: `sigma-chart.js:466-474` and `src/_data/sigmaChart.json` `verdicts.goodSpecial`.
- Evidence (REPRODUCED, t03): 14 stable days plus one day with 0 of 5,000. Title "A real improvement"; text "The chart shows a lasting improvement… make it the standard, then recalculate the limits".
- Expected: a single point is a signal to investigate, not a lasting change. "Lasting" fits only the run rule.
- Suggested correction: separate the wording for a one-point "beyond (better)" signal from the wording for a "run (better)" signal.

### P2A-10 — Corrupted saved data is silently replaced by the example, with no warning
- Severity: P2.
- Source: `tool-kit.js:33-35` (`read` returns the fallback on a JSON error) and `:942` (`firstVisit` treats unreadable data as a first visit).
- Evidence (REPRODUCED, t06): with `sc-damage-control = '{"rows": [ {"date":'`, the page shows "Example week · Damage rate 0.57%". No error, no notice. The corrupt string stays until the next save overwrites it.
- Mitigation: the daily IndexedDB restore point in `storage-guard.js` (SOURCE) may hold it.
- Suggested correction: on a parse failure, keep the raw value under a backup key and tell the user.
- Positive: 19 tool pages × 7 corrupt or odd shapes load without a single script error (t18).

### P2A-11 — Signals: on rare-event counts, about one day in five shows a "good side" signal from pure noise
- Severity: P2 (false statistical signal).
- URL: /tools/signals/.
- Source: `signals.js:100-120` (run of 8 below the centre on a c-chart; c̄ < 1 makes zero-days fall below the centre).
- Evidence (REPRODUCED, `t04-signals.cjs`, 3,000 simulated stable series of 30 days each, real `SignalsMath.analyse`):

  | Stable process | Signal on latest day | Worse | Good side |
  |---|---|---|---|
  | Poisson λ = 0.2 | 21.1% | 1.8% | 19.3% |
  | Poisson λ = 0.5 | 3.5% | — | — |
  | Poisson λ = 2 | 1.0% | — | — |
  | p-chart, ~1 defect/day | — | 1.5% | 1.4% |

  The good-side signal says "find out what went right, and keep it". Normal-theory 3σ plus run and trend rules would be about 1%.
- Suggested correction: no run or trend rules when c̄ < ~1 or the expected count per day is under ~5 (the Sigma chart already warns about this). Use exact Poisson or binomial limits for small counts.

### P2A-12 — Sigma chart and sigma calculator overstate precision on small or zero-defect samples
- Severity: P3.
- Evidence (REPRODUCED, t03):
  - A chart of 5 days × 50 units with 0 defects shows "Sigma level 6+". The calculator, for the same data, correctly uses the rule of three (`tool-kit.js:245`). The chart calls `sigmaText(result.pBar)` without n (`sigma-chart.js:546`).
  - The calculator gives 1 defect in 5 units → "2.34" with no small-sample caveat.
  - Delay Analyzer gives σ 1.64 on 9 routes.
  - The defect-log copy summary uses `num(sigma(rate))` rather than `sigmaText` (`defect-log.js:280`, SOURCE).
- Suggested correction: pass n everywhere and add an "n < 30" caveat.

### P2A-13 — Site Compare ranking ignores sample size and coverage
- Severity: P2.
- Source: `site-compare.js:327-344`.
- Evidence (REPRODUCED, `t13-site-compare.cjs`): a "Tiny depot" with 2 routes (100% on time) and nothing else scores **100 and ranks first**, above a hub with 2,000 routes at 97% plus three other KPIs (87.5). A site only marginally worse on everything scores 0.
- Suggested correction: require a minimum n per KPI and a minimum number of KPIs before ranking; show the n.

### P2A-14 — Hotel KPIs accept rooms sold > rooms available (occupancy 120%)
- Severity: P2 (bad input passes into KPIs, Signals and forecasts).
- Source: `hotel-kpis.js:197-207` (`cleanRow` has no `sold ≤ available` check).
- Evidence (REPRODUCED, t09): the night 100 available / 120 sold is stored. The page shows 120%, and the Signals occupancy series gets 1.2.
- Suggested correction: reject the row or warn (unless day-use rooms are intended and declared).

### P2A-15 — Minor findings (P3)
- **CSV export prefixes formula-like text with `'`, and re-import keeps it.** "=SUM(A1)" becomes "'=SUM(A1)" after one round trip (t14). Injection protection itself works (t06).
- **CX Tower targets.**
  - `targetValue` reads "0.8" for the Incomplete Rate as **80%** and "1" as 100% (t08). This matches the documented rule ("0.98 = 98%") but invites errors on "down" KPIs.
  - The route-risk "late" threshold is fixed at > 10 min (`cx-tower.js:369`) while the Late Route KPI uses `lateMinutes` (default 5). Both are declared, but they disagree.
  - The deep-dive "loading" metric falls back to 20 min when no target exists (`:539`), which contradicts "the page never invents a threshold" (`:288`).
- **OEE "target 85%".** Shift Pulse and Signals flag "OEE is below the target (target 85%)" when no target is set. It is the world-class benchmark, but it is called a target.
- **Target of 100% is handled inconsistently.** Pulse, Signals and Ops Report ignore it (`share()` < 1, `percent()` < 100). Daily Board turns every day with one late route red.
- **Bird's pyramid mislabelled.** It pairs 30 with near misses and 600 with unsafe acts and conditions. Bird's 1969 ratio is 1 serious : 10 minor : 30 property damage : 600 no-injury incidents (`safety-cross.js:81-90`).
- **Lost & Found / Ops Report return rate.** "Returned" share is compared across periods without accounting for item age: recent items have had less time to be returned.
- **Trend charts keep only the last 60 buckets.** For more than 60 weeks the trend total covers only those (420 of 490 rows in t10). Head totals are unaffected.
- **Grammar.** DE "von 3 Tage" should be "von 3 Tagen" (t06).
- **Shift Handover label.** "Incomplete %" is filled with a count ("3 incomplete orders"). The note explains it, but the label is misleading.
- **Flaky test.** One test in the repo's own suite failed once and passed on re-run (`existing-tests.txt`).

## 5. What is genuinely good (evidence-backed) and must not be changed

- **Core formulas are right and match textbooks**, verified against independent values:
  - DPMO; sigma with the 1.5 shift, which the defect logs, Delay Analyzer and sigma calculator label "short term, with 1.5 shift".
  - Rule-of-three bound for zero defects in the calculator.
  - p-chart limits per subgroup; I-MR with 3/1.128; Nelson rule 3 and an 8-point run.
  - OEE = A×P×Q, time-weighted with the identity preserved.
  - Pareto cumulative %; CoQ week→month as 52/12.
  - LTIFR and TRIR; ADR, RevPAR and no-show rate.
  - ISO weeks including W53.
- **Denominators are explicit and consistent across tools:**
  - On-time is defined identically in Delay Analyzer, Shift Pulse, Shift Handover, Ops Report and Signals, including the empty-grace edge case.
  - Partial route logs yield counts, never shares.
  - A rate is shown only when every day with entries has a volume.
- **Date arithmetic is UTC-based everywhere except Andon live calls:** DST week = 7 days, month boundaries correct (t10, t20).
- **Robustness:** 19 tool pages × 7 corrupt or odd storage shapes gave 0 script errors. Null-not-NaN is used throughout.
- **CSV:** BOM, `;` and decimal comma in DE/SQ, formula-injection escaping, Unicode and emoji preserved, export→import round trip exact for dates, units, costs and times.
- **Example isolation done right** in Signals, Ops Report and Site Compare (in-memory examples) and in the Sigma handoff (never merges into an example; upserts by date). Keep this pattern.
- **Small-sample guards that exist:** Signals' 8-point minimum, the Sigma chart's under-12-points and under-5-expected caveats, CX `minSample` 50 for partner and driver comparisons, KPI Diagnostic's "no single cause" fallback.
- **Language:** DE and SQ results are fully translated in the tested result areas (t06, t17 heuristic, SAMPLED). Number formats follow the locale (1.500 / 0,15 %).

## 6. Proposed scores

### "Mathematical and tool accuracy" (stats, quality and KPI group): **62 / 100**

| Criterion | Weight | Score | Basis |
|---|---|---|---|
| Formula correctness against independent values | 40 | 36 | ~70 numeric checks pass; formula defects are at edges only (Andon DST, occupancy > 100%) |
| Data integrity and cross-tool handoffs | 20 | 8 | Three P1 issues: example→real merge, demo profile, CoQ waste handoff always zero; plus duplicate import |
| Statistical interpretation and conclusions | 20 | 10 | Rules correct but false good-side signals, "lasting improvement" from one point, KPI Diagnostic overclaim, ranking without n, hidden default targets |
| Output fidelity (print, CSV, languages) | 20 | 8 | CSV and languages good; 7 tools clip on print in all three languages |

### Input for "Architecture and technical reliability": about 65 / 100
- **For:** pure Math objects separate from page code, so they are testable; consistent null handling; a shared ToolKit; tolerant loading; restore points; UTC date math.
- **Against:**
  - Copy-pasted logic drifts: `minutesLate` exists in 5 files and 5S overall in 5, one of which diverges.
  - Example state is inferred from the shape of the data instead of being marked.
  - Examples are persisted to the same keys as real data.
  - Cross-tool contracts are untyped and tested with invented fixtures (CoQ).
  - There is no duplicate detection on import.
  - Corrupted data is replaced silently.
  - A flaky test exists in the suite.
