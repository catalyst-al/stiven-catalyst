# Phase 3, motion and performance: review (branch `phase3-motion`)

Findings: PM-1, PM-2, PM-3, PM-4, PM-6, PM-8, PM-16 (and CI-03) of `phases/p3-p9-motion-perf-a11y.md`.
Scripts, raw results and pictures: `docs/audit/2026-10-27/phase3/motion/`.

## How it was measured

- Machine: the same container as the audit: 4 vCPU Xeon 2.1 GHz, **no GPU** (canvas and compositing rasterised in
  software, so canvas costs are pessimistic against a real phone), headless Chrome for Testing 153 at
  `/opt/pw-browsers/chromium`, Playwright 1.56.1. Other workers ran browsers at the same time (load average 3 to 28);
  every before/after figure is therefore **interleaved** (a, b, b, a, ... in the same minutes) and a **median of 5 runs**.
- "Before" = the build of `77b1ba9b` served from a copy (`node tests/browser/server.mjs 8321`), "after" = this branch
  (`... 8322`).
- Profiles: `desktop` 1440x900 DPR 1 unthrottled; `desktop4x` the same at CDP `Emulation.setCPUThrottlingRate 4`;
  `phone4x` 390x844 DPR 2, touch, mobile UA, throttle 4.
- `perf.cjs`: main-thread busy time (CDP `Performance.getMetrics` TaskDuration) over 5 s after a 3 s settle, frames
  per second in which the page ran animation-frame callbacks, p95 frame interval, long tasks and their blocking time,
  then one tap (Event Timing: first-input delay and the longest event duration).
- `frames.cjs` (screenshots) and `canvas-frames.cjs` (the canvases' own pixels, put together) compare the home hero
  frame by frame with time frozen: seeded `Math.random`, a virtual clock behind `performance.now` and
  `requestAnimationFrame` (60 frames a second), CSS animations paused at the same time. Checked: comparing a build
  with itself gives 0 differing pixels in all 30 frames.
- Diagnosis only: `profile.cjs` (V8 profile), `trace.cjs` (trace self-time per event), `composited.cjs` (which CSS
  animations Chrome could not run on the compositor, and why), `anims.cjs` (`document.getAnimations()` inventory).

## PM-2, PM-3, CI-03: one switch for the motion of the whole site (commit 972b58e7)

**Was:** "Pause the motion" only in the home hero, not remembered; glows, shine and the share ring kept running; no
control on tool, book and issue pages; `tests/cosmos-pause.test.cjs` checked CSS text only.

**Now:**
- A "Pause the motion" / "Play the motion" switch at the foot of **every** page (footer, under the legal links, in the
  hero button's pill style), and the hero's own button is the same switch. EN/DE/SQ from the existing strings.
  Screenshots: `motion/shots/footer-1440-dark.png`, `footer-390-light-de.png`, `hero-390-dark.png`. **The place is an
  author decision**; the header was left alone (four buttons on a phone already).
- The choice is kept in `localStorage["sc-motion"]` (`paused` / `on`) and applied by the inline head script before the
  first paint (`<html data-motion="paused">`; the CSP hash follows the script automatically). Without a choice,
  `prefers-reduced-motion: reduce` starts paused; the reader can still press Play (then the planets turn; the CSS
  loops stay as the system asks). Other tabs and a change of the system setting are followed.
- Paused, `src/css/65-motion.css` stops all 48 endless CSS animations of the stylesheet in the still state reduced
  motion gives them (same static fallbacks), and `cosmos.js` stops its loop (light on, opened planet in front). The
  labels switch by CSS, so the button says the right thing from the first paint and never shifts the footer.
- `sc-motion` is a page setting: added to the work lock's `OPEN` set, and left out of the work backup and team sync
  (`work-backup.js` SKIP, the fallbacks in `storage-guard.js` and `team-sync.js`). The privacy page (EN/DE/SQ) names it.
- Tests (failing first, outputs in `motion/red/`): `tests/browser/motion.spec.mjs` in all 6 projects: with motion,
  loops run and the canvas draws; after Pause, `document.getAnimations()` has **0 running endless animations** and the
  canvas makes **0 drawing calls** in 600 ms; the attribute is set before `<body>` exists; kept after reload and on 5
  other pages; Play from another page restarts; reduced motion starts paused and can play; every language.
  `tests/cosmos-pause.test.cjs` (rewritten): built pages, the head script run in a VM for every case, the lock.
  `tests/motion-css.test.cjs`: every endless animation in the stylesheet is listed in the pause.
- Measured (`perf-home-paused.json`, 3 runs): home paused, main thread **0.006 s / 5 s desktop, 0.015 s phone4x**
  (audit: 0.85-1.0 s and 3.9 s after Pause).

## PM-1: the planets hero (commits ba1c7ee0, and 01014144 for approval)

**Diagnosis** (`trace.cjs`, `profile.cjs`): JavaScript is only 12-16 % of the hero's main-thread time; the rest is the
canvas raster (`LayerTreeHost::DoUpdateLayers`, ~21 ms a frame at phone4x) and copying the canvas resource every
frame (`Canvas2DResourceProvider::ProduceCanvasResource`). The raster cost is the drawn shapes at DPR 2 (the glow,
the halos, the planets), not the JS.

**Same look (ba1c7ee0):** the hero is drawn on three canvases: the planets' band (from the cable's top to 2.5 system
radii below the light, where nothing can reach beyond: computed bound 2.26 radii tilted and zoomed) and the stars above
and below it. Each is drawn only while it is within half a screen of the view; the band is 42 % of the phone hero.
The big glow is filled as its disc instead of its square (the corners added nothing). Proof that the drawing is the
same (`canvas-frames.json`, 14 frames x 3 widths): 1440: **0 differing pixels**; 768: <= 0.0009 %; 390: <= 1.5 % of
pixels by <= 5/255 (premultiplied), all inside the glow's disc (rounding of the disc fill vs the rect fill).
On screen (`frames/frames.json`, 30 frames x 3 widths x 2 themes) 10-13 % of pixels differ, most by <= 8/255: the old
canvas's backing store had the hero's border-box height but was shown in its padding box (1 px less), so it was
stretched by 0.06-0.09 % and resampled; the new canvases are placed 1:1. Reproducing the old stretch in a test variant
cuts the desktop difference to 1.5 % (max 27/255), which confirms the cause. Not visible; pictures:
`frames/diff-390-dark-planets-6.2s.jpg` (a | b | changed pixels). The motion is the same frame for frame (the 10-frame
sequences show the same difference profile as single frames, no drift).

Before/after, 5 interleaved runs (`perf-home.json`):

| profile | busy / 5 s | fps | long tasks | blocking | tap |
|---|---|---|---|---|---|
| desktop | 3.44 → 3.23 s | 58.8 → 59.8 | 0 → 0 | 0 → 0 | 256 → 240 ms |
| desktop4x | 5.02 → 5.03 s | 22.8 → 21.8 | 20 → 30 | 142 → 364 ms | 496 → 432 ms |
| phone4x (with 01014144) | 5.08 → 5.06 s | 22.2 → **32.0** | 27 → **2** | 124 → **13 ms** | 400 → 424 ms |

So the look-preserving part alone gains little under software raster (desktop ~6 % less main-thread time; 4x still
saturated). **01014144 (needs author approval):** on a touch screen the canvas is drawn at 1.5 device pixels per CSS
pixel instead of 2. Measured alone (`perf-dpr-cap.json`, 5 runs phone4x): fps 24.0 → 32.8, long tasks 7 → 1, blocking
39 → 0 ms. Look: the same scene, slightly softer at close range (`frames-dpr/diff-390-dark-planets-6.2s.jpg`; 13 % of
pixels differ, 0.75 % by more than 8/255). Drop the commit to keep DPR 2.

Not done (would change the look, so left for the author): fewer particles on phones, cached sprites for the halos and
the bulb's blurred glass, an earlier quality step-down. The adaptive quality (DPR 0.75/0.5 after 60 slow frames) is
unchanged. Off-screen and hidden-tab stopping existed and is kept (now per canvas).

## PM-4: Zenith's radar and the podcast steps (commit 9858edf5 + test 18b65fca, needs author approval)

**Was** (reproduced, `radar/radar-frames.json`): the radar's keyframes were replaced by the chips' shine (`family-sweep`
defined twice): the planet card's radar wedge and the tool page's radar faded out over 6 s and popped back. The gold
`step-reach` of Start here replaced the blue one of the podcast steps.
**Now:** the shine is `chip-sweep`; the turn applies to the planet drawing's radar (`.family-planet .zenith-radar`)
only, so the radar behind a Zenith tool stands still while its own sweep turns inside it (it no longer fades); Start
here uses `start-reach` (gold, unchanged), the podcast steps light in **blue** again. Frames 0-5 s, before (top) /
after (bottom): `radar/planet-card-radar.jpg`, `radar/tool-sky-radar.jpg`, `radar/podcast-steps.jpg`.
Test (failing first, `red/keyframes-before.txt`): no two `@keyframes` share a name. Reduced motion and pause still stop
the radar (selector updated in both).

## PM-6: wheel glide (commit fa50a0d4, a change of feel for the author to judge)

The script that cancelled each wheel event and eased the page there on the main thread is removed; anchor links still
glide (`html { scroll-behavior: smooth }`, off under reduced motion). `glide.json`, 5 runs, time to 90 % of a 300 px
notch: home 393 → 54 ms, home at 4x 1067 → 183 ms, field notes 361 → 31 ms (4x 366 → 40 ms); the page no longer cancels
the wheel. Headless Chrome scrolls a notch at once; real Chrome animates it on the compositor (~100-200 ms), whatever
the page is drawing. Test (failing first, `red/wheel-before.txt`): the wheel is not cancelled and the page has moved
>= 270 px within 120 ms. This also ends PM-16's "glide overrides programmatic scrolls".

## PM-8: tool pages (commit d8b9192f)

`composited.cjs` showed every endless animation on CX Control Tower was compositor-capable, yet the main thread drew
60 frames a second. Cause, isolated by switching animations off one group at a time: the family badge animates the dot
(`scale`) **and** the dot's own `::after` glow (`opacity`); an animation inside an animated element keeps the main
thread busy. The glow now lies on the badge (`.family-badge::before`, same place and size, swelling with the dot);
frames 0-5 s compared (`badge/`): <= 5.5 % of the badge's pixels differ by <= 21/255 (the glow on its own layer);
not visible. 5 runs (`perf-tools-*.json`): CX Control Tower phone4x **2.57 → 0.12 s** busy / 5 s, desktop 0.88 → 0.04 s.
Shift Pulse unchanged (1.6 s phone4x): its ECG trace animates `stroke-dashoffset` (SVG, main thread only) under a
drop-shadow; making it cheaper means changing how it moves — author decision. On Zenith pages the PM-4 fix also removes
a main-thread animation (the radar's background-position/opacity).

## PM-16

- Smooth `scrollIntoView` under reduced motion: first judged **not reproduced** (`red/scroll-not-reproduced.txt`), but
  that run did not really emulate reduced motion: `reducedMotion` written directly under a Playwright project's `use`
  is ignored, which the CI and accessibility work of phase 3 found and fixed (`contextOptions`). With reduced motion
  really applied, Chrome 153 **does** glide `scrollIntoView({ behavior: "smooth" })`: the browser test failed in the
  three light projects (`{"y":0,…}` two frames later). **Fixed by the coordinator**: `src/script.js` turns "smooth" into
  "auto" for scrollIntoView, scrollTo, scroll and scrollBy while reduced motion is asked for; the test passes in all
  six projects. Not verified in Firefox/Safari.
- Glide overriding programmatic scrolls: ends with PM-6, if the author approves it (below).
- Live regions un-hidden in the same tick: not motion; left for the accessibility worker. Essay "Save for later"
  pill: opinion, not touched.

## What is on the work branch, and what waits as a patch

On the work branch: the switch for the whole site (PM-2, PM-3, CI-03), the planets on three canvases with the same
look (PM-1, first part), the family badge's glow (PM-8), the PM-16 test with its fix, the measurement scripts and
results. The four commits that change how something looks or feels are **not** on the branch; each is kept as a patch
that applies on it with `git am`, in `phase3/proposals/`:

| Patch | What it changes | Measured |
| --- | --- | --- |
| `planets-touch-dpr-1.5.patch` | planets drawn at 1.5 device pixels per CSS pixel on touch screens (was 2): a little softer up close | phone at 4×: 22 → 32 fps, long tasks 27 → 2 |
| `zenith-radar-keyframes.patch` | Zenith's radar turns again (as written), the podcast steps light blue, Start here keeps its gold as `start-reach`; a test that no two `@keyframes` share a name | before/after frames in `motion/radar/` |
| `wheel-native-scroll.patch` | the mouse wheel scrolls the browser's own way, without the site's glide; links to a place on the page still glide | a notch: 393 → 54 ms (home), 1067 → 183 ms (home at 4×) |

The place of the switch (at the foot of every page, and beside the planets on the homepage) is on the branch, as a
default for the author to confirm.

The approval commits are named below by their patch: `01014144` = `planets-touch-dpr-1.5.patch`, `9858edf5` +
`18b65fca` = `zenith-radar-keyframes.patch`, `fa50a0d4` = `wheel-native-scroll.patch` (hashes of the worker's branch,
not of the work branch).

## Tests

`npm run build` OK. `npm test`: 1322 tests, 1322 pass after the last commit (one full run showed a timing flake in
`hoshin-kanri.test.cjs`, which passed 3 of 3 times alone). Browser suite (`playwright test`, own port): 56 tests,
**50 passed, 6 failed** = the 6 known search failures (CI-01); the 24 new motion tests pass in all 6 projects.

## Left / for the author

- Approve or drop the three patches above, and confirm the switch's place (footer + hero).
- Home on a slow phone stays heavy under software raster even after these; the remaining levers change the look.
- Shift Pulse's ECG trace (PM-8), the home shelf's `translate` float, which still costs a style recalculation every
  frame while the canvas runs (cause not found), and the box-shadow breathing of the hero buttons (main-thread paint
  while running; stopped when paused) are not changed.
- Not verified on real devices, GPUs, Firefox or Safari.
