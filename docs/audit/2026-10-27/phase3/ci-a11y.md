# Phase 3 · CI and accessibility (branch `phase3-ci-a11y`)

Findings: CI-01, CI-02, PM-9, PM-10, PM-11, PM-12, and what the new accessibility suite found on the way. Machine: the
development container (4 cores, shared with other workers, load average 15-28 during the runs), Chrome for Testing
153.0.8010.12 at `/opt/pw-browsers/chromium`, Playwright 1.64.1 driving it. Scripts and outputs:
`docs/audit/2026-10-27/phase3/ci-a11y/`. Each script takes the port of a running `node tests/browser/server.mjs <port>`.

## CI-01 · the search journey failed on Chrome 153 (fixed)

**What was wrong.** `search → a result, by keyboard only` failed in all six projects (26/32 before) with an uncaught
`InvalidStateError: Transition was aborted because of invalid state. Page already revealed`.

**The real cause, not `history.replaceState`.** A probe navigated home → search with motion and did one thing on the
new page as soon as `pagereveal` fired: `replaceState`, `pushState`, a hash change, a DOM change and `focus()` all left
the cross-document view transition running to its end, with no error. A key press did not: a key that reaches the new
page after it commits and before its first frame (the test types "handover" at once) makes Chrome reveal the page
immediately; the transition it had prepared is given up, `pagereveal` then carries no `viewTransition`, and the
rejected promise has no handler anywhere: an uncaught error. A key pressed 100 ms later causes nothing. Seen in the
logs: `keydown` at 64 ms, `unhandledrejection` at 126 ms, `pagereveal (viewTransition: no)` at 480 ms. Also seen once:
"ViewTransition opt-in disabled", the same class.

**A second fault in the test config.** The light projects were meant to run with reduced motion, but `reducedMotion`
under a project's `use` is not a Playwright test option and was silently ignored: `matchMedia('(prefers-reduced-motion:
reduce)')` was `false` in every project, so every project had the transitions (which is why the light ones failed
too). It is `contextOptions.reducedMotion` now (commit e7128db1).

**Fix (2fb68d18).** The inline head script of `layouts/base.njk` (its CSP hash is computed by the build) handles an
`unhandledrejection` whose reason is an `InvalidStateError`, `AbortError` or `TimeoutError` naming a transition, with
`preventDefault()`. This covers every place a view transition can be rejected, since the site starts none from script
(no `startViewTransition`; only `@view-transition { navigation: auto }` under `prefers-reduced-motion:
no-preference`). The page simply appears without the movement, as the browser intends.

**Test.** `tests/browser/transitions.spec.mjs`: with motion forced on, three routes, a key pressed on arrival, two
rounds each. Before: failed in 6/6 projects (`ci-a11y/ci-01-before.txt`); after: 6/6 pass. Console errors over all
journeys after the fix: only the analytics beacon that the tests block on purpose (`net::ERR_FAILED`), no other.

## CI-02 · CI ran a year-old Chromium (fixed)

- `@playwright/test` 1.56.1 → **1.64.1** (latest stable, released 2026-10-14; bundles Chrome for Testing **156.0.8078.4**).
  `@axe-core/playwright` 4.14.0 now uses playwright-core 1.64.1 too. No separate `playwright` dependency exists.
- `.github/workflows/deploy.yml`: `npx playwright install --with-deps chromium` now installs that Chrome 156; the step
  prints the browser version, and fails when no test passed or any was skipped, flaky or did not run (beside
  `pipefail`). `npm test` keeps `# fail 0` and `# skipped 0`. Build job timeout 15 → 25 min (946eb02e) for the 90 new
  browser tests. Validated: YAML parsed with PyYAML; the step's commands run locally with `CI=1` (gates evaluated on
  the log). The bundled Chrome 156 could not be run here (no `playwright install`): the suite was run with 1.64.1
  driving Chrome 153.
- `npm audit`: 1 high (markdown-it ≤ 14.3.2 under Eleventy, GHSA-vfgh-jcmw-g37q and GHSA-gfr2-rv44-r23c). `npm audit
  fix` → markdown-it 14.3.3; the built `_site` is byte for byte identical (`diff -r`); `npm audit`: **0
  vulnerabilities**, nothing residual.

## PM-9 · CX Control Tower chart points (fixed, 5bb2fe79)

Was: each point of the KPI charts (and each column of the deep-dive trend) a tab stop inside an `svg role="img"`, focus
shown only by a 2 → 4 px stroke. Now: no point is focusable; the chart is one image whose name reads every week's value
and adds "(off target)" / "(Ziel verfehlt)" / "(jashtë objektivit)" for those weeks; the mouse tooltips stay; the two
dead `:focus` rules are removed. Tab stops from top to end (`tab-stops.cjs`): **114 → 82 at 390 px, 150 → 118 at 1440
px; 32 → 0 inside charts.** Test: `a11y-pages.spec.mjs` "the charts are images with a name" (failed in both themes
before).

## PM-10 · share button over focused links on phones (fixed, 520796fe)

`share-overlap.cjs` Tabs through five pages × EN/DE/SQ × 360/390/412 px and compares each focused control (with its
2 px ring) with the share button: **234 controls partly or wholly under it before, 4 after** (all the lower edge of the
104 px paste box on Damage Control, whose top and caret are in view). Fix: `html { scroll-padding-bottom: 72px }` on
phones (18 px + 44 px button + ring); no visible change. Test: "phone: the share button never covers the focus" on
three pages at 412 × 800 (a field, link or button must be entirely clear; a control taller than 64 px must have its
top 24 px clear). Without the padding it fails in 4 of 6 runs, 36 controls (`ci-a11y/pm-10-without-fix.txt`). Not done: the
button still covers the corner of a line of text while reading mid-page (scrolling reveals it); hiding the planet
near the footer would be a visible change.

## PM-11 · month counter contrast, light theme (fixed, 0cbc1ad4)

`.weekly-n` in the pressed month button: white at opacity .70 on #0a6ab0 = #b6d2e7, **3.61:1** → opacity **.85** =
#dae9f3, **4.57:1** (`contrast.cjs`). Light theme, pressed button only. Before/after: `pm-11-before.png`,
`pm-11-after.png` (hardly distinguishable). Test: axe on Field Notes in the suite (failed in 3 languages × 2 widths).

## PM-12 · heading order in the issue legend (fixed, 01e81892)

The legend headings on an issue's first page (and the contract box of a treatise volume) were `h4` right after the
page's `h2`. Now `h3`, given exactly the rules the `h4` had (`print/review-base.css`, `print/weekly.css`): font, size
(10.13 px), weight, line height, margins and box size measured identical in the reader before and after. Test: axe
`heading-order` in the suite (failed on the issue in 3 languages × 2 widths × 2 themes).

## The accessibility suite (2bc4ecb8)

`tests/browser/a11y-pages.spec.mjs`, in the two 1440 px projects (dark with motion, light with reduced motion):
axe-core 4.14 with the `wcag2a/wcag2aa/wcag21a/wcag21aa` rules, every impact, plus `heading-order`, on 13 pages × EN, DE,
SQ, each at 1440 × 900 and 390 × 844: 78 tests, 156 axe checks. Pages: home, an essay, a reflection, Management Review
No. 80, the MR archive, Field Notes, CX Control Tower, CV Builder, 8D report (form-heavy), Damage Control, KPI
Diagnostic, the book, How this is made. Plus the PM-9, PM-10 and scrolling-table tests.

- **content-visibility artefacts.** Parts of a page not yet drawn (`content-visibility: auto`) are read by axe against
  white. On the raw pages axe reported 516 contrast nodes, of which **456 a reader never sees** (`axe-scan-reduce-raw.json`
  against `axe-scan-reduce.json`, both after the fixes). The suite draws everything first.
- **Before the fixes** (raw, 156 runs): 18 runs with violations: color-contrast 522 nodes (real: PM-11 6, 8D 60),
  scrollable-region-focusable 36 (8D at 390 px), plus heading-order (PM-12) when included.
- **Found and fixed on the way:** the 8D sheet's six tables could not take the focus on a phone (ba4b4e5d); the A3
  report's countermeasure table neither (9477a039, found by `tools-scan.cjs`, test added).
- **After:** 0 violations on all 156 checks with the Lumen commit below; without it, the exact known list in `KNOWN`
  (20 nodes per language on the 8D page, light theme), so any new violation fails.

## Needs author approval

**354e2b44 · Lumen tools, light theme: the gold accent.** The light-theme accent is the family colour mixed with near
black; for Lumen's gold at 62 % it is **#9c824a: 3.18:1** on a grey row (#eceff0) and **3.68:1** on white, failing for
small text on 9 Lumen tools (151 nodes: 8D, Kaizen Event, Standard Work, Kanban Sizing, SMED, Time Study, Lean
Assessment, Poka-Yoke, Hoshin Kanri). At 48 % it is **#7b683e: 4.67:1 and 5.40:1**; all 151 pass (`tools-scan.txt` →
`tools-scan-after-lumen.txt`). Planet, sky and dark theme unchanged; the gold text is a shade deeper
(`lumen-light-8d-row-*.png`, `lumen-light-8d-hero-*.jpg`). If dropped, put the 8D entry back into `KNOWN` (written in the
comment above it).

## Left open (counts from `tools-scan.cjs`: all 59 tools, EN, both themes, 1440 px)

| Rule | Nodes | Where | Note |
|---|---|---|---|
| label-content-name-mismatch (2.5.3) | 104 per theme | Energy Tracker, Guest Complaints, Kaizen Board, Lost & Found, Room Status, Shift Capacity, Standard Work | `aria-label` does not contain the visible text ("Remove meter" vs "Remove the meter Gas"; room tiles). Needs new UI strings in 3 languages per tool. |
| heading-order | 7 per theme | Cost of Quality, 5S Audit, Housekeeping Planner, Kaizen Event, Lean Assessment, Room Status, Standard Work | A heading that skips a level in a tool panel (e.g. `h3.cq-group-title`, `h3.rs-floor-head`). |
| color-contrast #3276a1 on #eceff0 (4.28:1) | 12 (light) | A3 Report, Energy Tracker | Zenith's light accent on grey rows; same kind of decision as Lumen. |
| color-contrast, dark | 6 | SMED (#fff on #f5c86a, 1.57:1), Cost of Quality split bar (1.28:1, 2.21:1) | Text on gold / light fills in the dark theme. |

## Tests

- `npm run build`: OK. `npm test`: **1318 tests, pass 1318, fail 0, skipped 0**.
- `npm run test:browser`: **128 passed, 0 failed, 0 skipped** (38 journeys and transitions + 78 axe + 12 keyboard/table;
  7.0 min, 3 workers). Before: 26 passed, 6 failed of 32. In CI mode with 4 workers on this loaded machine (load ~28),
  8 tests once timed out at 30 s (axe, goto, load); with 2-3 workers all pass; one journey failed once under load and
  passed on rerun.

## Shared files touched

`src/_includes/layouts/base.njk` (inline head script), `src/css/08-readers-and-publications.css`,
`09-career-and-data-tools.css`, `10-families-and-roles.css` (approval commit), `11-reading-and-motion.css` and the
generated `src/styles.css`; `src/_includes/print/review-base.css`, `print/weekly.css`, `print/weekly-page.njk`,
`print/treatise-page.njk` (PM-12, selectors only); `src/js/cx-tower.js`, `eight-d.js`, `a3-report.js`;
`tests/browser/playwright.config.mjs` (`BROWSER_TEST_PORT`, `contextOptions.reducedMotion`, `testIgnore` per project);
`package.json`, `package-lock.json`, `.github/workflows/deploy.yml`. Not touched: planets/cosmos/motion code, print
CSS beyond the PM-12 selectors, `listen.js`.
