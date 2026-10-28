# Thresholds in the tools: what they are, why, and where to change them

Written on 27 October 2026, after the audit of that day. A threshold decides what a tool calls a signal, a pass, a
leading cause or enough data. Each one is listed here with its value, its reason and whether it may be changed.

Two kinds:
- **Set by the operation.** These depend on the scale of a workplace and live in a data file. Change them there; the
  same value goes into the English, German and Albanian file (a test checks they agree).
- **Fixed by the method.** These are statistical rules with a published source. Loosening one would make the tool
  report signals that are noise, so they stay in the code. A change needs a reason and its test changed with it.

## Set by the operation (data files)

| Tool | Threshold | Value | Where | Test |
| --- | --- | --- | --- | --- |
| Site Compare | Minimum number behind a rate before a site is ranked: units handled (damage, incomplete), routes, OEE shifts, PM tasks due, 5S audits, first inspections, room nights | 1,000 · 1,000 · 30 · 5 · 5 · 2 · 30 · 300 | `src/_data/siteCompare.json` → `minimums` (and `de/`, `sq/`) | tests/owner-decisions.test.cjs, tests/site-compare.test.cjs |
| Room Inspection | Score a room needs to pass, when every item is judged | 90 % | `src/_data/roomInspection.json` → `threshold`; the visitor can set it on the page | tests/room-inspection.test.cjs |
| Every log (Damage, Incomplete, Delay, Night Audit, Waste, Energy …) | Targets | none by default: a figure without a target the visitor set gets no colour | the visitor's workplace profile, or the tool's own target box | tests/examples-never-mix.test.cjs |
| Daily Board | Amber band | a rate within 20 % below its target; on time within 5 points above its target | `src/js/daily-board.js` (`rateState`, `onTimeState`) | tests/daily-board.test.cjs |

## Fixed by the method (code)

| Tool | Rule | Value | Source | Where | Test |
| --- | --- | --- | --- | --- | --- |
| Signals, Sigma chart | A point beyond the control limits | 3 sigma (two-sided 0.27 %) | Shewhart; Western Electric rule 1 | `signals.js`, `sigma-chart.js` | tests/signals.test.cjs |
| Signals, Sigma chart | A run on one side of the centre line | 8 points | Western Electric / Nelson rule 2 | `signals.js` (`RUN`) | tests/signals.test.cjs |
| Signals | A trend | 6 points rising or falling | Nelson rule 3 | `signals.js` (`TREND`) | tests/signals.test.cjs |
| Signals | Fewest points for a control chart | 8 | below this the limits describe days, not the process | `signals.js` (`MIN_POINTS`) | tests/signals.test.cjs |
| Signals | Counts with fewer than 5 expected per point are judged by their own distribution (Poisson, binomial); a point beyond a limit must be as rare as 3 sigma (≤ 0.135 % on its side); a "better" point needs a lower limit above 0; a run must be as unlikely as 8 coin tosses | 5 · 0.135 % | the normal approximation of counts fails below about 5 expected (a standard rule of thumb); measured false-signal rates in the test | `signals.js` (`LOW_COUNT`, `TAIL`) | tests/signals-low-counts.test.cjs (seeded Monte Carlo: fewer than 2 % of days flagged on stable data) |
| Sigma chart | "A lasting improvement" | only after a run of 8 on the better side; one point or a trend is "a signal to investigate" | as above | `sigma-chart.js` | tests/sigma-chart.test.cjs |
| Sigma chart | Short series caveat | fewer than 12 points | the limits are estimated from the series itself | `sigma-chart.js` | tests/sigma-chart.test.cjs |
| Sigma level | A sample with no defect | a bound (≥ …) from 3 ÷ n, never "6+" | rule of three (95 %) | `tool-kit.js` (`sigmaText`) | tests/sigma-chart.test.cjs, tests/log-integrity.test.cjs |
| KPI Diagnostic | A cause is named | above half the maximum (4 of 6) and 2 points ahead of every cause left out; causes 1 point apart are named together | one notch on one self-rated statement is not a difference | `kpi-diagnostic.js` (`topCauses`) | tests/kpi-diagnostic.test.cjs |
| 5S Audit and every tool that reads it | A complete audit | at least 80 % of its questions scored, and every S scored | a partial audit would weigh one S as the whole | `tool-kit.js` (`FIVE_S_COMPLETE`), used by `five-s-audit.js`, Daily Board, Shift Pulse, Ops Report, Signals, Site Compare | tests/handoffs-real.test.cjs, tests/five-s-partial.test.cjs |
| Process Lab | Small sample note | fewer than 20 values | control limits and capability need about 20 to 25 subgroups or values (AIAG SPC) | `process-lab.js` | tests/process-lab.test.cjs |
| Time Study | Few cycles note | fewer than 3 cycles of an element | a median of one or two cycles says little | `time-study.js` | tests/time-study.test.cjs |
| Inventory ABC | Safety stock note | fewer than 6 periods (better 12 months or 26 weeks) | a variation estimated from few periods is unreliable | `inventory-abc.js` | tests/inventory-abc.test.cjs |

## Limits that protect the page (not judgements)

| What | Limit | Where |
| --- | --- | --- |
| Heijunka | 10,000 containers a day, 1,440 minutes a day; 300 columns and runs drawn | `heijunka.js` |
| Word and Excel files read | 5,000 entries, 50 MB per entry, 100 MB per file | `cv-import.js` (`unzip`) |
| Files opened | ATS CV and CV Builder 5 MB, coaching backup 5 MB, template pack 2 MB, work file 40 MB | each tool; tests/import-size.test.cjs |
| Team sync | deletions remembered 90 days, at most 20,000 | `team-sync.js` (`TOMBSTONE_DAYS`, `MAX_DELETED`) |
| Search | the first 30 results listed, all counted | `search.js` |

Changing a fixed threshold: change the constant, its test and this table together, and say why in the commit.
