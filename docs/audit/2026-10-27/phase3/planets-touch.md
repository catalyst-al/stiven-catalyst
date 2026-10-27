# Planets on phones: the 1.5 density patch, measured (PM-1, for the author's decision)

The question (the author, 27 October 2026): keep the resolution change separate, compare it visually, try it on a real
phone if possible; the four planets must not lose sharpness, brightness or identity just to gain frames per second.

The patch under review is `proposals/planets-touch-dpr-1.5.patch`: on a touch screen (`pointer: coarse`) the hero's
canvas is drawn at 1.5 device pixels per CSS pixel instead of 2. It is **not** on the work branch and this review does
not apply it. Scripts, raw results and pictures: `phase3/planets-touch/`.

**Verdict: B (the patch) loses visible sharpness; it keeps brightness and identity.** Every planet, the light and the
four names lose about half of their fine detail (variance of the Laplacian −41 to −55 %), at both phone densities.
Brightness moves by ≤ 1.2 % and the colours of the planets by ≤ 0.7° of hue. Under the author's rule the patch should
not go in as it is. The proposed alternative, `proposals/planets-touch-dpr-adaptive.patch`, keeps density 2 (the
pixels are identical to today's) on any phone that holds 30 frames a second, and steps down to 1.5 only on a phone that
cannot. On a mid-range phone profile it gains most of what the patch gains: 25 → 32 fps, long tasks 13 → 0.

## How it was measured

- Sides: **A** = the work branch (`claude/gifted-pasteur-v7n2dw` at 5dd8dfc5, this review's base). **B** = A with the
  patch's `src/js/cosmos.js` change. **C** = the same patch with 1.75 instead of 1.5. **D** = A with the adaptive
  alternative. Each side is a full `npm run build` (with the CSS split and the script minification). The patched
  source was copied into `src/`, built, and put back with `git checkout -- src/js/cosmos.js`. The home page's files
  were then served from a copy (`tests/browser/server.mjs`, ports 8351–8354). The four builds differ only in
  `js/cosmos.js` and its `?v=` hash.
- Headless Chrome for Testing at `/opt/pw-browsers/chromium`, Playwright 1.64.1, same container as the audit (4 vCPU,
  no GPU, so the canvas is rasterised in software).
- **Pictures and pixel measures** (`compare.cjs`): every context is a phone with `isMobile`, `hasTouch` and a mobile
  UA, so `(pointer: coarse)` matches as on a real phone. Viewports 390×844 and 412×915, deviceScaleFactor 2 and 3
  (today's phones are 2.6 to 3.5; Chrome's density is capped at 2 in A and at 1.5 in B either way), dark and light
  theme, EN home. Time is frozen as in `motion/frames.cjs`: seeded `Math.random`, a virtual 60 fps clock,
  CSS animations paused at the same time. The page is scrolled to the planets and stepped to 6.2 s and 12 s.
  - Where the planets are: `arc` and `fillText` are wrapped (they still draw) to find each planet's name and its
    centre in the last frame. The planet's box is a square around the centre reaching to its name, which holds the
    ring, the dust and the halo. The light's box is 2.2 bulb sizes around the bulb. The names have their own boxes.
  - The boxes are taken from A and used unchanged for B, C and D. B's own positions coincide (offset ≤ 0.01 px).
  - Measures are taken on the screenshot's device pixels, i.e. what the phone's screen shows:
    - sharpness: variance of the Laplacian of luminance, plus edge energy (mean squared Sobel gradient);
    - brightness: mean and 99th-percentile luminance;
    - colour: CIE L\*C\*h of the coloured pixels, as the chroma-weighted mean hue and the mean chroma;
    - change: share of pixels that differ at all and by more than 8/255, mean ΔE76 and SSIM.
  - Check: D against A with the clock frozen (every frame on time) gives **0 differing pixels** in all 16
    configurations. That is the expected result, since D changes nothing on a phone that keeps up, and it also shows
    the method is exact.
- **Speed** (`motion/perf.cjs`, the existing script): phone4x = 390×844, DPR 2, touch, CPU throttle 4. Five
  interleaved runs (a, b, b, a, ...), medians. It reports frames per second, main-thread busy time over 5 s after a
  3 s settle, long tasks with their blocking time, and one tap. Two options were added for this review, with the
  defaults unchanged: `--settle` (a later window) and the `phone2x` profile (the same phone at throttle 2, a mid-range
  phone). `density.cjs` records, on a real clock, the density the canvas is actually drawn at. That matters because
  `cosmos.js` already lowers its quality by itself on slow frames (`quality` 1 → 0.75 → 0.5, which also means fewer
  particles).

## 1. What B changes in the picture (median of 2 viewports × 2 themes × 2 moments)

The hero keeps its dark sky in the light theme. In light, only the page around the hero changes, so every planet,
the light and the names have **identical pixels in both themes** (`summary.json`: `planetsSameInBothThemes: true`).

Phone at deviceScaleFactor 3 (the common case):

| object | sharpness A → B | edge energy | mean luminance A → B | p99 | hue Δ | chroma | pixels differ / > 8/255 | SSIM |
|---|---|---|---|---|---|---|---|---|
| Pulse | 242.6 → 110.2 (**−54.6 %**) | −21.2 % | 104.5 → 104.7 (0 %) | 238.6 → 241.4 | +0.3° | −1.8 % | 85.7 % / 13.3 % | 0.953 |
| Zenith | 271.8 → 129.6 (**−51.1 %**) | −19.9 % | 93.8 → 93.7 (−0.2 %) | 250.8 → 250.2 | +0.1° | −0.5 % | 88.7 % / 13.0 % | 0.950 |
| Lumen | 181.1 → 91.1 (**−47.6 %**) | −20.9 % | 61.7 → 61.8 (+0.1 %) | 241.3 → 241.2 | +0.4° | +0.5 % | 72.7 % / 7.8 % | 0.973 |
| Atlas | 154.8 → 77.3 (**−50.1 %**) | −13.0 % | 33.1 → 33.6 (+1.2 %) | 231.6 → 232.6 | −2.2°\* | −4.4 %\* | 65.8 % / 5.7 % | 0.975 |
| the light | 103.1 → 54.7 (**−46.0 %**) | −18.4 % | 189.8 → 189.6 (0 %) | 253.6 → 253.6 | +0.2° | −1.1 % | 82.7 % / 8.8 % | 0.970 |
| names (4) | −48.7 to −50.6 % | −20.6 to −21.9 % | ≤ ±0.5 % | ≤ 1 level | ≤ 0.2° | ≤ 0.3 % | 44–92 % / 17–24 % | 0.90–0.96 |
| whole screen | | | | | | | 11.0 % / 0.89 % | 0.9945 |

At deviceScaleFactor 2: Pulse −46.2 %, Zenith −44.8 %, Lumen −45.9 %, Atlas −41.5 %, the light −47.4 %, the names
−44 to −52 % sharpness. Brightness stays within ±0.9 % and hue within 0.7° (Atlas −2.8°\*). Whole screen: 13.4 %
of pixels differ, 0.95 % by more than 8/255.

\* Atlas is a grey globe (chroma about 10, almost no coloured pixels), so its hue is nearly undefined; a shift of 2°
at that chroma cannot be seen.

What this means:
- **Sharpness: lost, and the loss is visible.** Half of the fine-detail energy goes, on every object and at both
  densities. On a 3× phone A is already upscaled (2 → 3), so the remaining detail is fine. At 100 % the change shows
  on thin lines: Pulse's cracks and its ECG dots, Zenith's contour lines, Atlas's meridians and constellation, the
  bulb's filament wave, and the letters of the names. At 200 % it is obvious (`crops-…-A-B.jpg`,
  `names-…-A-B.jpg`).
- **Brightness and glow: kept.** Mean luminance changes by ≤ 1.2 % and the peaks by ≤ 3 levels out of 255, including
  the light's glow.
- **Identity (colour): kept.** Purple Pulse, blue Zenith, gold Lumen, grey Atlas and the white-gold light keep their
  hue within 0.7° and their chroma within 2 %. The shapes are the same scene at the same place (SSIM 0.95–0.98 per
  planet).

C (1.75) halves the loss but does not remove it: sharpness −18 to −30 % on the planets and the light, and −9 to −29 %
on the names (`summary.json`, `crops-390x844-dpr3-dark-6_2s-A-C.jpg`). Brightness and colour are as kept as in B.

## 2. Speed: the trade-off on one table

Medians of 5 interleaved runs. Busy is main-thread time per 5 s; blocking is the sum of (long task − 50 ms).

| profile, window | side | fps | busy | long tasks | blocking | tap | file |
|---|---|---|---|---|---|---|---|
| phone4x, 3–8 s | A → **B (1.5)** | 13.0 → **17.6** | 5.18 → 5.13 s | 60 → 61 | 1700 → **859 ms** | 680 → 568 ms | `perf-A-B.json` |
| phone4x, 3–8 s | A → C (1.75) | 13.4 → 16.2 | 5.20 → 5.13 s | 60 → 64 | 1671 → 1026 ms | 696 → 656 ms | `perf-A-C.json` |
| phone4x, 3–8 s | A → D (adaptive) | 11.8 → 13.8 | 5.20 → 5.19 s | 59 → 65 | 2015 → 1535 ms | 728 → 608 ms | `perf-A-D.json` |
| phone4x, 12–17 s | A → B | 22.4 → 21.6 | 5.13 → 5.08 s | 35 → 34 | 464 → 279 ms | 536 → 496 ms | `perf-A-B-settled.json` |
| phone4x, 12–17 s | A → D | 21.6 → 22.0 | 5.14 → 5.10 s | 31 → 20 | 343 → 149 ms | 568 → 520 ms | `perf-A-D-settled.json` |
| **phone2x**, 3–8 s | A → **B** | 26.0 → **35.2** | 5.10 → 5.06 s | 15 → **0** | 60 → **0 ms** | 448 → 360 ms | `perf2x-A-B.json` |
| **phone2x**, 3–8 s | A → **D** | 25.0 → **32.4** | 5.07 → 5.07 s | 13 → **0** | 63 → **0 ms** | 488 → 424 ms | `perf2x-A-D.json` |

The density each side actually draws at (`density.json`, `density-rate2.json`, 2–3 runs each, seconds after load):

| | phone4x | phone2x |
|---|---|---|
| A | 2 → 1.5 at ~10.3 s → 1 at ~14.5 s (each step also cuts particles) | 2 throughout, at 25–26 fps |
| B | 1.5 → 1.13 at ~8.3 s → 1 at ~11.5 s | 1.5 throughout |
| C | 1.75 → 1.31 at ~9.4 s → 1 at ~13 s | (not run) |
| D | 2 → 1.5 at ~6.9 s → 1.13 at ~11 s → 1 at ~14.5 s | 2 → 1.5 at ~3.4 s |

What this shows:
- **On the 4× phone** (very slow under this machine's software raster) B helps only in the first seconds
  (13 → 17.6 fps, half the blocking). After about 15 s **every side ends at density 1 with half the particles**,
  because the existing quality step catches all of them. The fps is then the same (21.6–22.4).
- **On the mid-range profile (2×)** B's gain is real and lasting: 26 → 35 fps, no long tasks. This is the case
  B exists for. The existing quality rule never fires here: frames of 33 ms do not count as slow, so A stays at
  density 2 at 25–26 fps.
- **D** gets most of that gain (25 → 32.4 fps, long tasks 13 → 0) by stepping to 1.5 after ~3 s, only on that phone.
- On a phone that holds 30 fps or more at density 2, B buys nothing and still costs the sharpness above. Real phones
  rasterise canvas on the GPU, unlike this container, and recent ones are likely in this group.
- The 4× figures are slower than the audit's earlier run (A 22 fps then, 12–13 now in the 3–8 s window). The machine
  was shared and its state differs between the two runs, so only the interleaved A/B comparisons are meaningful.

## 3. The alternative: `proposals/planets-touch-dpr-adaptive.patch` (not applied)

On a touch screen the canvas starts at density 2, as today. After the warm-up, the frame intervals are checked over
each run of 30 frames, with a single long frame counted as at most 100 ms. If they average more than 34 ms (under
30 fps), the cap drops once to 1.5 and the particles are left unchanged. The existing quality steps still follow if
that is not enough. 17 lines in `src/js/cosmos.js`. It applies with `git am` on the work branch. `npm test` gives the
same result with it as without it in this container: 1085 pass, and the 120 failures come from the missing `_site`.

- Fast phone: **pixel-identical to today** (0 px differ in all 16 frozen configurations).
- Mid-range phone (2×): 25 → 32.4 fps, long tasks 13 → 0, the look of B after ~3 s.
- Slow phone (4×): steps to 1.5 at ~7 s, earlier than A's own step at ~10 s, and without halving the particles at
  that first step; it ends where A ends.
- Open points for the author: it changes the look only on phones that miss 30 fps, and only after a few seconds,
  so a one-time softening may be noticed there. It never steps back up.

If the author prefers a fixed value, 1.75 (C) costs about half of B's sharpness for about 60 % of its gain on the
4× profile. That is still a visible loss by the rule above, and it is not proposed as a patch: it is the 1.5 patch
with `1.5` replaced by `1.75`.

## 4. Real phone: not done here, a procedure for the author

No real phone can be reached from this container, and the site has no per-PR preview: `deploy.yml` builds pull
requests but deploys only `main`. The site code is not to be changed for the test (no query flag), so the two
versions are built on a computer and opened from the phone over the local network.

On the computer, in the repository, with the phone on the same Wi-Fi:

```
git worktree add --detach ../sc-a claude/gifted-pasteur-v7n2dw
git worktree add --detach ../sc-b claude/gifted-pasteur-v7n2dw
git -C ../sc-b am "$PWD/docs/audit/2026-10-27/phase3/proposals/planets-touch-dpr-1.5.patch"
# optional, the alternative: a third copy ../sc-d with planets-touch-dpr-adaptive.patch
cd ../sc-a && npm ci && npm run build && python3 -m http.server 8081 --bind 0.0.0.0 --directory _site
cd ../sc-b && npm ci && npm run build && python3 -m http.server 8082 --bind 0.0.0.0 --directory _site   # another terminal
```

(`tests/browser/server.mjs` listens on 127.0.0.1 only, hence Python's server; on Windows use `py`. Find the computer's
address with `ipconfig getifaddr en0` on a Mac, `ipconfig` on Windows or `hostname -I` on Linux, and allow the
connection if the firewall asks.)

On the phone (Chrome on Android or Safari on iPhone), open `http://<address>:8081/` and `http://<address>:8082/` in
two tabs. If possible, let someone else open them so you do not know which tab is which. Then, for each tab:

1. Reload, scroll until the planets are in the middle of the screen, and wait 5 s (the light warms up). If the
   planets stand still, press the motion switch beside them (with "reduce motion" on, the site starts paused).
2. At normal reading distance, look at:
   - **Pulse** (purple): the bright cracks and the dots of its heartbeat ring;
   - **Zenith** (blue): the contour lines and the radar;
   - **Lumen** (gold): the five-part dust ring;
   - **Atlas** (grey globe): its grid and the constellation on the lit side;
   - **the light**: the orange filament wave and the cap's edges;
   - **the four names**: their letters.

   Write down which tab looks sharper, if either.
3. Pinch-zoom to about 2× on each planet and on a name. This magnifies the canvas as drawn, like `crops-*.jpg` at 200 %.
4. Switch the theme with the moon button. The hero stays dark in both themes, so only the page around it changes.
   Check that the planets look the same in light as in dark.
5. Smoothness: drag the system around for 5 s, open a planet and close it, and scroll past the hero and back.
   Note any stutter in either tab.
6. If there is an older or cheaper phone in the house, repeat steps 1–5 on it. That is where B (or D) can make a
   difference in smoothness.

The decision: if no difference in sharpness shows at normal distance and the old phone stutters in A, B is
acceptable. If the sharper tab can be told at normal distance, take D, which keeps that tab's picture wherever the
phone keeps up, or neither.

## Files (`phase3/planets-touch/`)

| file | what |
|---|---|
| `compare.cjs` | the frozen-time pictures and the pixel measures (all sides, all configurations) |
| `compare.json` | every object × configuration × side: boxes, measures, differences against A (8 configurations × 2 moments) |
| `summary.cjs`, `summary.json` | the medians in the tables above, per side and density |
| `crops-390x844-dpr3-dark-6_2s-A-B.jpg` | Pulse, Zenith, Lumen, Atlas and the light: A \| B at 100 %, then A \| B at 200 % (nearest neighbour), 3× phone |
| `crops-412x915-dpr2-dark-6_2s-A-B.jpg` | the same at 412×915, 2× phone |
| `crops-390x844-dpr3-dark-6_2s-A-C.jpg` | A \| C (1.75), 3× phone |
| `names-…-A-B.jpg`, `names-…-A-C.jpg` | the four names, A \| B (or C) at 100 % and 200 % |
| `hero-390x844-dpr3-{dark,light}-6_2s-A-B.jpg`, `hero-412x915-dpr2-dark-6_2s-A-B.jpg` | the whole screen with the planets in view, A \| B, shown at CSS pixels |
| `density.cjs`, `density.json`, `density-rate2.json` | the density actually drawn over 21 s, phone at 4× and 2× |
| `perf-*.json`, `perf2x-*.json` | `motion/perf.cjs` results (raw runs and medians) |

The pictures are JPEG (4:4:4, quality 86–92) to stay under 200 KB each. The measures are taken from the lossless
screenshots, not from the JPEGs.
