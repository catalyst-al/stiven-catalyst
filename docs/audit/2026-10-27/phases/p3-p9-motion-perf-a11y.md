# Phase 3 + Phase 9 (motion, performance, accessibility, CSP/analytics) — audit report

Auditor phase: `p3-p9-motion-perf-a11y` · Source: isolated clone at commit `3cb88a2` (= origin/main) · Local build served by
`node tests/browser/server.mjs 8105` · Live spot checks on https://stivencatalyst.com (about 90 GET requests plus the
site's own beacon POSTs; no forms submitted).
All scripts, raw outputs and screenshots: `$AUDIT_WORK/p3-p9-motion-perf-a11y/`.

## 1. Scope and method

**Environment and its limits (read this before reading any number).**
- Headless Chrome for Testing 153 (`/opt/pw-browsers/chromium`) through Playwright 1.56.1. The container has 4 Xeon
  2.1 GHz vCPUs, **no GPU**, so canvas and paint are rasterised in software. That makes the absolute paint costs
  pessimistic compared with a real device that has a GPU. It is **not a real phone**. "Mobile" means 390×844, DPR 2,
  touch and a mobile UA. "mobile4x" adds CDP `Emulation.setCPUThrottlingRate {rate: 4}` as a rough stand-in for a
  mid-range phone. Every mobile figure below is an emulation.
- Other auditors were running browsers on the same host at the same time (load average went from 2 to 17). The
  single-pass sweep numbers (perf.json) are therefore noisy. Every conclusion about cause is drawn from **interleaved
  A/B runs** in the same browser within minutes of each other (control page vs running vs paused vs CSS-animations-off
  vs reduced motion, 2–3 rounds). I report those, and I mark the single-pass numbers as indicative only.
- Local server sends no compression. Byte counts are uncompressed unless marked gz. The gz figures come from
  `gzip -9` locally, plus a live `curl` with Accept-Encoding for the home page.
- The headless "native" wheel scroll jumps instantly, so it has no smooth-scroll animation. Real Chrome animates
  native wheel scrolling over about 100–200 ms, and I take that into account in GL-6.

**Pages (14 + extras):** `/`, `/de/`, `/sq/`, essay `/insights/pareto-and-5-why-in-practice/`, reflection
`/reflections/the-information-monopoly/`, `/field-notes.html`, issue `/magazine/management-review-nr-80.html`, magazine
index `/magazine/management-review.html`, book `/books/mall-per-durresin.html`, `/tools.html`,
`/tools/cx-control-tower/`, `/tools/shift-pulse/`, `/podcast.html`, `/search.html`. For a11y I also tested
`/datenschutz.html` and `/contact.html`. Extra pages for CSP/animation checks: `/start.html`, `/about.html`,
`/roles/shift-lead/`, `/tools/cv-builder/`.

**Scripts (all in the work dir):**
| Script | What it measures |
|---|---|
| `perf.cjs` → `perf.json`, `perf-table.txt` | per page × {desktop 1440, mobile 390, mobile4x}, cold cache (CDP `Network.setCacheDisabled`): LCP entry+element, CLS (layout-shift PO), long tasks (PO), rAF frame times over 5 s idle and 5 s scroll (desktop: 25 real wheel events, which exercise the site's own wheel glide; mobile: `scrollBy` each frame), CDP `Performance.getMetrics` deltas (TaskDuration/ScriptDuration/LayoutDuration/RecalcStyleDuration), rAF calls/s with the hero scrolled away, running infinite animations off-screen, bytes by resource type (`Network.loadingFinished.encodedDataLength`), external hosts, render-blocking resources |
| `isolate.cjs`, `isolate2.cjs` → `isolate-home.txt`, `isolate-home2.txt`, `isolate-tools.txt` | interleaved A/B: control page / running / Pause pressed / all CSS animations off (`noanim`) / `reducedMotion: 'reduce'` |
| `culprit.cjs`, `culprit2.cjs` → `culprit*.txt` | which CSS animations keep the main thread busy after "Pause the motion" |
| `longrun.cjs` | 30 s of the home hero: frame rate per 5 s window, canvas backing-store size, adaptive quality steps |
| `inp.cjs`, `inp2.cjs` | Event Timing API (`type:'event'`, threshold 16 ms) for taps on planet chips, menu and theme buttons at mobile4x |
| `glide.cjs` | site wheel glide vs glide blocked (capture-phase `stopImmediatePropagation`): ms until scroll reaches 90 % of one 300 px wheel notch |
| `anims.cjs` → `anims-reduced.txt`, `anims-running.txt` | `document.getAnimations()` inventory (running/infinite/visible, animated properties) |
| `radar.cjs` | keyframes actually applied to `.zenith-radar` |
| `shots.cjs` → `shots/` (154 PNG), `shots.json` | frozen screenshots (reduced motion) at 320/390/768/1024/1440 × dark/light; overflow (`scrollWidth>clientWidth`), off-canvas elements, clipped text, covered interactive elements |
| `a11y.cjs` → `a11y.json`, `a11y.log` | @axe-core/playwright 4.14 (tags wcag2a/aa, 21a/aa, 22aa, best-practice) on 16 pages × {390,1440} × {dark,light} = 64 runs; target size < 24 px with the spacing exception |
| `kb.cjs` → `kb.txt`, `focusshots.cjs`, `rss.cjs`, `pause.cjs` | 60 Tab presses per page at 1440 and 390: focus ring, obscured focus, skip link; Pause control by keyboard and after reload |
| `nojs2.cjs` | content visible with JS disabled, and with JS on but IntersectionObserver stubbed to never fire |
| `printchart*.cjs` → `mr80-print-*.pdf` | print output of an issue page |
| `csp.cjs` | `securitypolicyviolation` events, JS errors, external requests (blocked locally) on 18 pages |
| `live.cjs`, `live-rum.cjs`, `live-rum-ua.cjs` → `live.txt` | live site: beacon load, RUM POST status and CORS (CDP `responseReceivedExtraInfo`) |
| `hidden.cjs` | rAF loop with a real background tab, then with simulated `document.hidden` + `visibilitychange` |

**Not verified:** real devices (iOS Safari, Android Chrome with GPU), Firefox/WebKit, screen readers (NVDA/JAWS/
VoiceOver; semantics checked only through the DOM and axe), 200 % text-only zoom, Windows High Contrast / forced
colours, the Cloudflare dashboard (whether analytics actually record visits), and long-session battery use.

## 2. Coverage table

| Area | Status | Notes |
|---|---|---|
| Frame times idle/scroll, 14 pages × 3 profiles | Fully tested (noisy; see §1) | perf.json |
| Cause isolation home hero / heavy tools | Fully tested, interleaved A/B | isolate*.txt, culprit*.txt |
| LCP / CLS / long tasks / bytes / render-blocking | Fully tested on 14 pages × 3 profiles | local, cold cache |
| Interaction latency (INP proxy) | Sampled: home, 5 controls, mobile4x | inp2.cjs |
| Wheel glide | Sampled: home + field notes, 1× and 4× | glide.cjs |
| Reduced motion completeness | Fully tested on 15 pages at load; hover transitions source-inspected | anims-reduced.txt |
| Off-screen / hidden-tab pausing | Tested (IO: real; hidden tab: real background tab + simulated visibilitychange) | hidden.cjs |
| JS-off / IO-never-fires content visibility | Tested on 7 pages | nojs2.cjs |
| Layout at 320–1440, both themes | Fully tested (14 pages × 5 widths × 2 themes = 140), automated + visual sample of ~10 screenshots | shots/ |
| axe WCAG 2.2 AA | Fully tested, 64 runs | a11y.json |
| Keyboard / focus / skip link | Sampled: 8 pages × 2 widths, 60 tab stops each | kb.txt |
| Target size 2.5.8 | Automated heuristic on 64 runs; footer cases checked by hand | |
| Screen-reader semantics | Source + axe only; NOT VERIFIED with a real SR | |
| CSP | All 776 built HTML files parsed; runtime violations checked on 18 pages | |
| External requests / third parties | Fully tested locally (18 pages); live on 4 pages | |
| Cloudflare analytics delivery | Live, REPRODUCED request outcome; actual data collection NOT VERIFIED | |
| Privacy disclosure (3 languages) | Source-inspected (built HTML) | |
| Print | Sampled: one MR issue | |

## 3. Defect register (most severe first)

### PM-1 — Home hero: the canvas loop occupies 60–75 % of the main thread on an unthrottled CPU and saturates it at 4× (13–20 fps, 0.6 s taps)
- Severity: **P1** (motion is the brand's main home-page feature, and on a mid-range phone it is the thing that makes the site feel slow)
- URL: `/`, `/de/`, `/sq/` - Source: `src/js/cosmos.js:196-215` (resize: canvas = whole `.cosmos` section × DPR ≤ 2), `:963-1013` (loop), `:968-976` (quality step-down)
- Evidence (REPRODUCED, `isolate2.cjs`, interleaved, 2 rounds, lower host load). Main-thread TaskDuration per 5 s window:

  | profile | control page | hero running | Pause pressed | CSS anims off, canvas on | reduced motion |
  |---|---|---|---|---|---|
  | desktop 1440 | 0.04 s | 3.4–4.1 s | 0.85–1.0 s | 2.9–3.2 s | 0.05 s |
  | mobile 390 (no throttle) | 0.05 s | 3.75–3.83 s | 1.1–1.2 s | 3.3–3.5 s | 0.06 s |
  | mobile4x | 0.11 s | 5.06–5.16 s (fps 18–20, 31–47 frames > 50 ms) | 3.9 s | 5.1 s (fps 22–25) | 0.12–0.18 s |

  - The perf sweep at mobile4x shows the same picture: 135–156 long tasks over about 16 s, TBT 3.5–3.9 s, median frame 66.7 ms, p95 100–117 ms (all three home pages).
  - `longrun.cjs` (mobile4x): the canvas backing store is **780×3892 px** (CSS 390×1945; the canvas covers the full stacked hero, about 2.3 viewports). The adaptive quality steps down to DPR 1 only after about 15–20 s. Frame rate then rises from 17 to about 40 fps, but TaskDuration stays at 4.8–5.3 s per 5 s.
  - Interaction (`inp2.cjs`, mobile4x, Event Timing duration):

    | tap | hero running | paused | reduced motion |
    |---|---|---|---|
    | planet chip | 584–608 ms | 336–344 ms | 320 ms |
    | menu button | 232–272 ms | 96–112 ms | 56–80 ms |
    | theme button | 312 ms | 232 ms | 176 ms |
- Steps: run `isolate2.cjs` / `inp2.cjs` / `longrun.cjs` from the work dir.
- Expected vs actual: a decorative hero should leave headroom for input, i.e. well under 50 % main thread and taps under 200 ms on a mid-range phone. Actual: saturated at 4×, and every tap is 2–4× slower.
- User impact: on mid-range Android, the first screen of the site (the one most visitors land on) janks. Taps on the menu or planets feel sluggish. Battery drains while the hero is in view. Desktops with a GPU will do much better than this software-raster number. **NOT VERIFIED on real hardware.**
- Confidence: high for the relative effect, medium for absolute real-device impact.
- Suggested correction (keeps the motion):
  - On narrow screens, size the canvas to the planet system (the `anchor`'s box plus margin), not to the whole `.cosmos` section, or clip drawing to the visible part. That alone cuts the pixels about 2–4×.
  - Start at `quality = 0.75` when `navigator.hardwareConcurrency <= 4` or `devicePixelRatio >= 2`, and step down after about 1 s, not after 60 frames at time > 2 s.
  - Cap the particle count lower on phones. The current 900 minimum is a lot for 390 px.
  - Optionally render the static star "sky" once to an offscreen canvas.
  - None of this changes the look at normal viewing distance.
- Regression risk: low to medium (visual density of particles; test the four planet identities).

### PM-2 — "Pause the motion" does not stop all motion; the remaining box-shadow "breathing" costs 0.9–1.2 s per 5 s (3.9 s at 4×)
- Severity: **P2**
- URL: `/` (+ `/de/`, `/sq/`) - Source: `src/css/02-homepage.css:474-478` (`.hero-go` breathe + shine, infinite), `:545-549` (`.hero-bulb` box-shadow breathe ×4, infinite), `src/css/11-reading-and-motion.css:40-60` (`.share-orbit-ring` 12 s spin on every page). The paused list at `src/css/02-homepage.css:206-210` covers only chips and shelf books.
- Evidence (REPRODUCED):
  - `anims.cjs` after clicking Pause still shows these running: `hero-bulb-breathe` ×4 (box-shadow), `hero-go-breathe` (box-shadow), `hero-go-shine`, `share-turn`.
  - `culprit2.cjs`: paused → 1.29–1.76 s desktop, 4.69–4.83 s mobile4x. Paused with only these animations disabled → 0.24–0.32 s and 0.49–0.57 s.
  - box-shadow animation is not compositor-accelerated, so it repaints every frame.
  - `tests/cosmos-pause.test.cjs` asserts "pausing stops what reduced motion stops", but it checks only CSS selector strings, not behaviour.
- Expected vs actual: after Pause, nothing on the hero moves and the page is idle. Actual: three CTA/bulb glows and the share ring keep animating and repainting.
- User impact: the Pause button looks broken to users who need it (vestibular, attention). Battery and CPU stay busy.
- Confidence: high.
- Suggested correction:
  - Add `.cosmos.is-paused ~ * .hero-go`, `.is-paused .hero-bulb` etc. (or a `html.motion-paused` class) to the paused list.
  - Re-implement the breathing as `opacity` of a pre-blurred `::after` glow layer (compositor-only). That keeps the same look at a fraction of the cost.
- Regression risk: low.

### PM-3 — Pause/stop exists only on the home hero and is not remembered; elsewhere infinite decorative motion has no control (WCAG 2.2.2)
- Severity: **P2**
- URL: every page with the share orbit (all pages); tool pages; book and issue pages; `/tools.html`.
- Source:
  - `src/js/cosmos.js:1155-1166`: `paused` is a local variable, with no storage.
  - The family-sky planet animations (`src/css/04-essay-extras-and-tools-page.css:505-516`, `src/css/10-families-and-roles.css:205`).
  - `cover-float` / `cover-glow`: `src/css/11-reading-and-motion.css:760-765`.
- Evidence (REPRODUCED):
  - `pause.cjs`: Pause is reachable by keyboard (12 Tab presses at 390, 20 at 1440). Enter toggles the label and the state. After reload it is "Pause the motion" again, `is-paused=false`.
  - `anims-running.txt`: running infinite animations by page:

    | page | infinite animations |
    |---|---|
    | cx-control-tower | 15 (13 visible) |
    | shift-pulse | 7 |
    | book | 3 |
    | MR issue | 3 |
    | tools.html | 10 |
    | home | 25 + the canvas |
    | essays | 0 |
  - No control on any of these pages. The only off-switch is the OS-level `prefers-reduced-motion`, which is honoured completely (see §4).
- Expected vs actual: SC 2.2.2 requires a mechanism to pause, stop or hide auto-starting motion that lasts > 5 s and runs in parallel with content. Most interpretations do not accept an OS setting as the page's mechanism. Actual: home hero only, not persisted.
- User impact: users who cannot or do not set OS reduced motion get perpetual motion next to tool forms and reading.
- Confidence: medium (2.2.2's application to purely decorative motion is debated).
- Suggested correction: a site-wide "Motion: on/off" toggle beside the theme toggle. It would set `html[data-motion=off]` (persisted in `localStorage` like `sc-theme`), stop the canvas, and set `animation-play-state: paused` on the infinite animations. Keep the motion on by default.
- Regression risk: low.

### PM-4 — Zenith radar is broken: duplicate `@keyframes family-sweep` turns the rotating radar into a 6-second fade-and-pop
- Severity: **P2** (part of the visual identity of one of the four planets; it also produces an abrupt 0→1 opacity jump every 6 s)
- URL: `/tools/cx-control-tower/` and every Zenith tool page, `/tools.html`, the home family cards.
- Source: `src/css/04-essay-extras-and-tools-page.css:509-514`: `.zenith-radar { animation: family-sweep 6s linear infinite }` + `@keyframes family-sweep { to { transform: rotate(360deg) } }`. This is overridden by the later `src/css/10-families-and-roles.css:426-429`, `@keyframes family-sweep { from {background-position:120% 0; opacity:1} to {background-position:-20% 0; opacity:0} }`, which was written for the chip shine. Both definitions are present in `_site/styles-tool.css`, `styles-home.css` and `styles-page.css`. The last one wins.
- Evidence (REPRODUCED, `radar.cjs`):
  - `getAnimations()` on `.zenith-radar` returns keyframes `backgroundPositionX 120%→-20%, opacity 1→0`.
  - The computed transform stays constant across 1.5 s, while opacity goes 0.43 → 0.47 → … and back to 1.
  - `step-reach` is also defined twice (`11-reading-and-motion.css:839` blue, `:1690` gold). The gold one silently replaces the blue one for `.podcast-steps li b` too.
- Expected vs actual: the radar sweep should rotate. Actual: it fades out over 6 s and pops back.
- User impact: Zenith's "contour map under a radar" identity is lost, and the pop is a small but visible glitch. No test catches keyframe-name collisions.
- Confidence: high.
- Suggested correction:
  - Rename one of them (for example `chip-sweep` for the shine).
  - Add a build test that fails on duplicate `@keyframes` names in the concatenated CSS.
  - Decide whether podcast steps should be gold or blue.
- Regression risk: very low.

### PM-5 — Management Review issue pages print the charts blank unless the reader has scrolled past them first
- Severity: **P2** (printed figures with their sources vanish; issues are a publication people print)
- URL: `/magazine/management-review-nr-80.html` (any issue with `.weekly-chart`)
- Source: `src/js/weekly.js:27-40` adds `.wk-anim` at load and `.is-in` only on IntersectionObserver entry. `src/css/08-readers-and-publications.css:816-822` hides `.wk-path/.wk-pop/.wk-legend li…` (opacity 0, scale 0, dashoffset 1). There is no print override.
- Evidence (REPRODUCED, `printchart2.cjs`):
  - Opening the page and printing straight away (`page.pdf`) gives page 2 = "The figures of the issue" heading with an empty area (`mr80p-2.png`). 21 chart parts are still hidden in print media.
  - After scrolling through, the same print shows the bars (`mr80s-2.png`).
- Expected vs actual: charts print. Actual: blank until seen on screen.
- User impact: an empty figures section on paper or in "Save as PDF".
- Confidence: high.
- Suggested correction: `@media print { .wk-anim .wk-path{stroke-dashoffset:0} .wk-anim :is(.wk-area,.wk-pop,.wk-legend li){opacity:1;transform:none} … }`, or add `.is-in` to all charts on `beforeprint`.
- Regression risk: very low.

### PM-6 — Desktop wheel "glide" puts scrolling on the main thread: a 300 px wheel notch takes about 0.37–0.40 s to settle (1.1 s on the home page at 4×)
- Severity: **P2** (usability/perceived performance on desktop; it is the brand's intended "smoothness", but it is measurably slower than the browser)
- URL: all pages with a fine pointer - Source: `src/script.js:185-215` (non-passive `wheel` listener on `window`, `preventDefault`, lerp 0.11 per rAF, `getComputedStyle` walk on each wheel event)
- Evidence (REPRODUCED for the site glide, INFERRED for the native comparison):
  - `glide.cjs`, time until 90 % of one 300 px notch: site glide 360–398 ms at 1× (39 scroll steps); on the home page at 4×, 1,078–1,129 ms, because every step waits for a main thread the canvas is saturating.
  - With the glide blocked, headless scrolls in one step at 40–68 ms (223 ms at 4× on home).
  - Real Chrome's own smooth wheel animation is about 100–200 ms and runs on the compositor, which is not blocked by main-thread work.
  - Sweep: desktop wheel-scroll frame p95 116–133 ms on field-notes/tools.html/home under load, while the compositor-driven mobile scroll of the same pages stayed at 16.7 ms.
- Expected vs actual: scrolling should respond at the compositor's pace. Actual: it lags and is coupled to page JS load. Wheel events also cannot be handled off-thread, because the listener is non-passive.
- User impact: "floaty", delayed scrolling on laptops; worst on the home page; precision trackpads already have inertia.
- Confidence: medium.
- Suggested correction: drop the wheel hijack and rely on native smooth scrolling plus the existing scroll-driven reveals, which already "move with" the scroll on the compositor. If the owner insists, at least disable it on the home page while the canvas runs, and raise the lerp to about 0.2.
- Regression risk: low (feel changes; no layout effect).

### PM-7 — Cloudflare Web Analytics: the beacon loads, but its RUM POST is answered with HTTP 404 (collection NOT VERIFIED and likely failing)
- Severity: **P2** (no user harm, but the owner may be making decisions on analytics that are not recording; the privacy policy describes processing that may not be happening)
- URL: live writing pages (beacon present on 586 of 776 built pages; absent by design on 177 tool pages, 12 role pages and offline.html) - Source: `src/_includes/layouts/base.njk:64,84,243-244`; token `51fb88e35e624e8bb98d558b7293a446` (the same on all pages)
- Evidence (REPRODUCED, live, `live.cjs`, `live-rum.cjs`, `live-rum-ua.cjs`, 2026-10-27 about 00:13 UTC, through the sandbox egress proxy):
  - `GET https://static.cloudflareinsights.com/beacon.min.js` → 200. `window.__cfBeacon = {"token":"51fb…","load":"single"}` on `/`, the essay and `/de/datenschutz.html`. Not present on `/tools/shift-pulse/` (as designed).
  - CORS preflight `OPTIONS https://cloudflareinsights.com/cdn-cgi/rum` → 200 with `access-control-allow-origin: https://stivencatalyst.com`.
  - The actual `POST /cdn-cgi/rum` (808–814 bytes) → **HTTP 404**, `server: cloudflare`, a cf-ray header, no ACAO. So Chrome logs "blocked by CORS policy" and `net::ERR_FAILED`.
  - Same result with the headless UA and with a normal Windows Chrome UA; 3 pages × 2 runs.
  - The final `sendBeacon` ping is aborted by navigation (expected).
  - A 404 at this endpoint usually means the token or site is not recognised by Cloudflare (deleted or never activated, or hostname not matching). I cannot exclude bot or egress-IP filtering of the container's traffic.
- Expected vs actual: 2xx from the RUM endpoint. Actual: 404.
- User impact: none for readers. For the owner, the analytics dashboard may be empty or incomplete.
- Confidence: medium.
- Suggested correction:
  - Open Cloudflare dashboard → Web Analytics and check that the site `stivencatalyst.com` exists, uses this exact token and shows visits from today.
  - In a normal browser, DevTools → Network → `rum` should return 204.
  - If the site was recreated, update `site.analytics.cloudflareToken`.
- Regression risk: none.

### PM-8 — Tool pages: decorative CSS animations keep 28–50 % of a throttled main thread busy while the user fills a form
- Severity: **P3**
- URL: `/tools/cx-control-tower/`, `/tools/shift-pulse/` (and family pages) - Source: `src/css/10-families-and-roles.css:205` (`pulse-run` stroke-dashoffset, infinite), `src/css/04-essay-extras-and-tools-page.css:508` (`.pulse-ring` drop-shadow filter), zenith blips ×7, badge breathe/glow
- Evidence (REPRODUCED, `isolate-tools.txt`, idle 5 s TaskDuration):

  | page | profile | running | CSS animations off | reduced motion |
  |---|---|---|---|---|
  | cx-control-tower | mobile4x | 2.39–2.51 s | 0.28–0.30 s | 0.14–0.20 s |
  | shift-pulse | mobile4x | 1.39–1.61 s | 0.22–0.25 s | 0.12–0.14 s |
  | cx-control-tower | desktop | 0.37–0.54 s, 42–43 fps | — | — |

  - Mobile4x frame rate stays about 59–60 fps on both tool pages (the motion is light enough not to drop frames).
- User impact: battery and CPU cost on the pages people keep open longest (shift tools on a phone on the floor). No visible jank was measured.
- Suggested correction:
  - Replace the stroke-dashoffset and drop-shadow loops with transform/opacity equivalents, or pre-render the glow.
  - Pause the family-sky drawing once the hero has scrolled out of view (`.is-offscreen` already exists).
  - "Floor mode" could also switch motion off.
- Regression risk: low.

### PM-9 — Chart data points on CX Control Tower: 32 extra tab stops with a weak focus indicator and no role/name on the element
- Severity: **P3**
- URL: `/tools/cx-control-tower/` - Source: `src/js/cx-tower.js:1052` (`circle … tabindex: 0`), `:2037` (`rect … tabindex: 0`); `src/css/09-career-and-data-tools.css:847` (`circle:focus { outline: none; stroke-width: 4 }`)
- Evidence (REPRODUCED):
  - `kb.cjs` at 390 px: 29 of 60 tab stops are 8×8 px SVG circles with no outline.
  - `focusshots.cjs`: focus changes the stroke from 2 to 4 px in the same blue (`focus-circle.png`), which is barely distinguishable. `role`/`aria-label` are null on the circle (the label comes from a child `<title>`).
- Expected vs actual: either one focusable chart with a data table, or points with a clear focus ring and `role="img"` + label. Actual: a long tab trap-like run with a weak indicator.
- User impact: keyboard users must tab through every point to reach the next control. SC 2.4.7 is met only marginally, and 2.4.13 (AAA) is not met.
- Suggested correction: make the chart a single tab stop (arrow keys move between points) or remove `tabindex` and rely on the existing table/text. Use a 2 px contrasting outline ring.
- Regression risk: low.

### PM-10 — Floating share button covers content and focused links at the bottom-right of mobile screens
- Severity: **P3**
- URL: all pages at 390 px (example: `/magazine/management-review-nr-80.html`) - Source: `.share-orbit` (fixed), `src/js/share-orbit.js`, `src/css/11-reading-and-motion.css:40-60`
- Evidence (REPRODUCED, `rss.cjs`, `focus-rss.png`): Tab-focused footer "RSS" link at (316–340, 809–826) lies under the fixed share button (328–372, 782–826). The focus ring is partly hidden. 2.4.11 (AA) still passes because the link is not entirely hidden; 2.4.12 (AAA) fails. The same button also covers the last line of text at the bottom-right corner while reading.
- Suggested correction: `html { scroll-padding-bottom: 72px }` on narrow screens plus bottom padding on the footer; consider hiding the orbit while the footer is in view.
- Regression risk: very low.

### PM-11 — Light theme: month-filter counters fail contrast (3.6:1)
- Severity: **P3** - URL: `/field-notes.html`, `/magazine/management-review.html` (light theme, 390 and 1440)
- Evidence (REPRODUCED, axe `color-contrast`): `.weekly-n` inside the pressed month button: #b6d2e7 on #0a6ab0 = 3.6:1 at 15 px normal weight (needs 4.5:1). This is 1 node per page and the only colour-contrast violation in 64 axe runs.
- Suggested correction: use `--on-blue` (white) at about 0.85 opacity, or increase the weight to 700 and size ≥ 18.66 px.
- Regression risk: none.

### PM-12 — Heading order skips a level in issue chart legends
- Severity: **P3** - URL: `/magazine/management-review-nr-80.html` (all widths/themes) - Evidence (REPRODUCED, axe `heading-order`): `.wk-legend-box > div > h4` "Figure" follows an h2.
- Suggested correction: use `<p class="wk-legend-title">` or h3. - Regression risk: none.

### PM-13 — Typography differs by platform: display face is Arial Black first, essay and book titles use system Georgia/Liberation Serif, and body "Inter" is never loaded on screen pages
- Severity: **P3** (brand consistency; performance-motivated, so it may be intentional)
- Source: `src/css/01-foundation.css:3-10,51` (`--display: "Arial Black", "Archivo Black", …`). Essay h1 is `Georgia, "Times New Roman", serif`. `inter-latin-*.woff2` is shipped in `_site/fonts` but used only by `src/_includes/print/*.css`.
- Evidence (REPRODUCED, `fonts.cjs`, CDP `getPlatformFontsForNode`): the essay h1 renders in **Liberation Serif** in Linux Chromium. The home h1 renders in Archivo Black only because Arial Black is absent there. On Windows/macOS the headings will be Arial Black and Georgia, and body text will be Segoe UI / SF / Roboto.
- User impact: the brand looks different on Android vs iPhone vs Windows. Archivo Black (18.7 KB) is downloaded even where Arial Black wins. **NOT VERIFIED on real Windows/macOS.**
- Suggested correction: decide deliberately. Either self-host one display face and one text face for all screens (≈ 50–70 KB woff2, `font-display: swap`, the existing size-adjust fallback already prevents CLS), or document the system-font choice in BRAND.md.
- Regression risk: medium (metrics change; re-check CLS).

### PM-14 — Every tool page ships all 63 tools' CSS as one render-blocking file (436 KB raw / 76 KB gz) and 270–280 KB of JS
- Severity: **P3** - Source: build bundle `_site/styles-tool.css`; script list in `_site/tools/shift-pulse/index.html` (19 deferred scripts, including other tools' modules)
- Evidence (REPRODUCED, perf.json): tool pages have CSS 431 KB vs 125 KB on home. LCP was still 236–284 ms (mobile) / 436–920 ms (desktop, noisy) locally, and there were no render-blocking scripts (all `defer`).
- User impact: about 50 KB more gz CSS than needed on slow mobile networks before first paint. Measured locally only; live network NOT VERIFIED.
- Suggested correction: split per tool family or per tool, or at least move the tool-specific parts into a second, non-blocking stylesheet per page.
- Regression risk: medium (CSS ordering).

### PM-15 — Security headers and CSP gaps that GitHub Pages cannot fix with a meta tag
- Severity: **P3**
- Evidence (SOURCE + REPRODUCED live `curl -I`):
  - The meta CSP is good: no `'unsafe-inline'` for scripts, inline scripts hashed, `object-src 'none'`, `base-uri 'self'`, `frame-src 'none'`.
  - **But:** `style-src 'unsafe-inline'`. `form-action 'self' https:` allows any HTTPS target. `img-src https://www.google.com` is on all 776 pages although only the CV Builder (`src/_data/cvBuilder.json:3`, Google s2 favicons) needs it. `frame-ancestors` cannot be delivered in a meta tag, so clickjacking protection is absent.
  - Live response headers show no `Strict-Transport-Security`, `X-Frame-Options`, `X-Content-Type-Options` or `Referrer-Policy`. GitHub Pages does redirect http→https (301).
  - `/offline.html` has no CSP.
- Suggested correction:
  - Scope `img-src https://www.google.com` to the CV Builder page and narrow `form-action` to the MailerLite origin.
  - Add `<meta name="referrer" content="strict-origin-when-cross-origin">`.
  - HSTS and frame-ancestors need a proxy (e.g. Cloudflare in front of Pages) or the owner accepts the risk. Document the decision.
- Regression risk: low.

### PM-16 — Smaller motion/UX notes
- **P3** — 42 JS files call `scrollIntoView({behavior:"smooth"})` with no reduced-motion check (SOURCE, `grep -rn 'behavior: "smooth"' src/js`). Chromium does not suppress them, so users who asked for reduced motion still get animated jumps after "Show result". Fix: `behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'` in one helper.
- **P3** — The wheel glide overrides programmatic scrolls made while it is running. Its `scroll` handler resets the target only when no frame is running (SOURCE, `src/script.js:213`). Observed as residual rAF activity after a scripted scroll in the perf sweep (INFERRED).
- **P3** — Form status regions (`role="status"`, newsletter / tool feedback) are `hidden` and are un-hidden in the same tick the text is set (`src/js/newsletter.js:9-21`). Some screen readers do not announce live regions that were `display:none`. INFERRED, NOT VERIFIED with an SR. Keep the region rendered and empty, and set text only.
- **P3 / OPINION** — Essay page at 390 px: the "Save for later" pill wraps to three lines inside a round button next to the byline (`shots/insights_pareto-and-5-why-in-practice-390-dark.png`). It looks cramped.

## 4. What is genuinely good (with evidence), and what must NOT be changed

- **Reduced motion is complete.** With `reducedMotion:'reduce'`, `document.getAnimations()` returns **0 running animations** on all 15 pages tested, including home (`anims-reduced.txt`). The canvas draws once, the Pause button is hidden, view transitions are gated (`src/css/01-foundation.css:444-446`), the wheel glide is off and transitions are killed globally (`07-lists-and-pages.css:1107-1110`). Keep this.
- **Off-screen and hidden-tab pausing works.** With the hero scrolled away, rAF calls/s = **0** on every page (perf.json `offscreenRafPerSec`). A real background tab dropped the loop to about 1 call/s. A simulated `visibilitychange` gave 0, then 60 again on return (`hidden.cjs`). `.is-offscreen` pauses CSS loops (`10-families-and-roles.css:38`).
- **Reading pages are excellent.** Essay, reflection, field notes, MR issue and index, book, podcast and search all sit at **60 fps idle and scroll even at mobile4x**, with 0–2 long tasks, CLS 0–0.002 and local LCP 150–630 ms (mobile/mobile4x). No layout shift from the Archivo Black fallback (`size-adjust` metrics, `01-foundation.css:11-19`): CLS 0 on home.
- **No reveal hides content.** Scroll-reveals are CSS scroll-driven animations inside `@supports (animation-timeline: view())` + `no-preference`, with no JS gate. With JS disabled, and with JS on but IntersectionObserver never firing, **0 text elements stayed transparent** on 7 pages (`nojs2.cjs`). The one JS-gated reveal (`.wk-anim`) is PM-5.
- **Layout is robust.** 140 page × width × theme combinations show no horizontal scroll, no off-canvas elements, no clipped text and no covered controls by the automated checks (`shots.log`). 320 px (= 1280 px at 400 % zoom) reflows.
- **axe:** 64 runs, 0 critical violations; only PM-11 (1 node) and PM-12 (1 node). Landmarks, `html[lang]`, labels, names and duplicate IDs are clean. The skip link is first in tab order, visible on focus (fixed, z-index 999) and moves focus into `<main>` on all 8 pages tested. A visible 2 px focus outline was present on every non-input stop (inputs use border + glow). The 2.5.8 heuristics found no confirmed failure.
- **Pause control is a real `<button>`.** It is keyboard-operable, labelled in 3 languages, and absent under reduced motion. Planet chips are buttons with `aria-expanded`/`aria-controls`, and the canvas is `aria-hidden`, so the planets have a full non-canvas equivalent.
- **No third parties beyond the analytics beacon.** Tool and role pages load nothing external (`csp.cjs`: the only external host requested on 18 pages is `static.cloudflareinsights.com`, and only on writing pages). There are no runtime CSP violations or JS errors on the 17 existing pages. The analytics use is disclosed consistently in EN/DE/SQ privacy pages (provider, address, data categories, IP note, legal basis Art. 6(1)(f), DPF transfer, "not on tools and role pages"), and that matches the CSP exactly.
- **Visual identity (OPINION, based on screenshots `home-running-1440.png`, `books_…-1440-dark.png`, `tools_shift-pulse-1440-light.png`):**
  - The dark, cinematic home with the hanging bulb and four distinct planets (Pulse violet crackle, Zenith blue, Lumen gold dust ring, Atlas silver globe) is distinctive, coherent and well crafted.
  - Restraint is applied where it matters: essays run 0 infinite animations.
  - The light theme is complete and legible.
  - Do **not** remove the planets, the scroll-driven reveals, the page transitions or the planet identities. The fixes above (PM-1/2/6/8) keep the look and remove the cost.

**Design notes (OPINION, not defects).**
- The bulb motif now appears on every nav item, both hero buttons, three hero cards, series dots and start-page numbers. Gold also carries the Reflections card. BRAND.md says gold is "only the brass base of the light-bulb mark and its warm light" and that the bulb "should not overwhelm content". The motif is close to that line on the home page.
- Home runs 25 simultaneous infinite CSS loops plus the canvas. The essay pages show the restraint the brand claims; the home page and tool heroes are busier than "cinematic but restrained".

## 5. Proposed scores (0–100)

**Visual design and user experience: 80**
- Criteria: identity and coherence (25), layout robustness across widths/themes (25), typography (15), interaction UX (20), polish and defects (15).
- Strong identity and flawless reflow (140/140 clean) earn most points. Deductions:
  - broken Zenith radar (PM-4)
  - blank printed figures (PM-5)
  - laggy wheel glide (PM-6)
  - platform-dependent typography (PM-13)
  - share button overlap (PM-10)
  - bulb/gold proliferation against BRAND.md (opinion)

**Motion and performance: 62**
- Criteria: frame stability on reading pages (25), cost of signature animations on mid-range hardware (25), interaction latency (15), pausing / off-screen / reduced-motion behaviour (20), payload and loading (15).
- Reading pages and reduced-motion/off-screen handling are near-perfect (about 40/45).
- The home hero saturates a 4×-throttled CPU, triples tap latency, and Pause leaves repaint-heavy loops (PM-1/2). Tool heroes idle at 28–50 % main thread (PM-8). Wheel glide couples scrolling to JS (PM-6). Tool CSS is a 76 KB gz blocking bundle (PM-14).
- All of these are fixable without removing motion. Real-GPU devices will score better than this software-raster environment shows (not verified).

**Accessibility and privacy (a11y + CSP/analytics part): 76**
- Criteria: automated WCAG 2.2 AA (20), keyboard/focus (20), motion controls 2.2.2 / 2.3.3 (15), reflow / zoom / target size (15), semantics and live regions (10), CSP / third parties / disclosure (20).
- axe is nearly clean, the skip link and focus are good, reflow is clean and reduced motion is complete.
- Deductions:
  - no site-wide, persisted motion control (PM-3) and an incomplete Pause (PM-2)
  - chart-point tab run (PM-9)
  - focus under the share button (PM-10)
  - one contrast failure and one heading-order failure
  - live-region pattern (PM-16)
  - analytics RUM returning 404, so collection is unverified (PM-7)
  - CSP `style-src 'unsafe-inline'`, broad `form-action`, a site-wide Google image origin and the missing hosting headers (PM-15)
