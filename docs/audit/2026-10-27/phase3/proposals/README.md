# Phase 3 changes that wait for the author

Each file is one change (or two commits that go together) as `git format-patch` output.

**27 October 2026, the author's decisions:** `zenith-radar-keyframes.patch`, `wheel-native-scroll.patch` and
`lumen-gold-light-theme.patch` are approved and applied on the work branch (`22edfaff`, `2d9f9906`, `5dd8dfc5`); the
files stay here as the record. `planets-touch-dpr-1.5.patch` stays separate: visual comparison first
(`../planets-touch.md`).
Each was checked on 27 October 2026 to apply on it (`git am --3way <file>`); after applying, run `npm run build`,
`npm test` and `npm run test:browser`.

| Patch | Finding | What it changes | Why it waits |
| --- | --- | --- | --- |
| `lumen-gold-light-theme.patch` | accessibility (axe) | the Lumen family's gold in the light theme, #9c824a → #7b683e: 3.18:1 → 4.67:1 on 9 Lumen tools (151 elements); it also takes the 8D entry out of the accepted list of `tests/browser/a11y-pages.spec.mjs` | a colour of the visual identity (review: `phase3/ci-a11y.md`) |
| `planets-touch-dpr-1.5.patch` | PM-1 | the planets drawn at 1.5 device pixels per CSS pixel on touch screens: a phone at 4× from 22 to 32 fps, long tasks 27 → 2; a little softer up close | the look of the planets (review: `phase3/motion.md`) |
| `planets-touch-dpr-adaptive.patch` | PM-1 (alternative) | on touch screens the planets stay at density 2 while the phone holds 30 fps, and step once to 1.5 when 30 frames average over 34 ms: pixel-identical to today on a phone that keeps up; mid-range phone profile 25 → 32 fps, long tasks 13 → 0 | the look of the planets on slow phones; proposed in place of the 1.5 patch, which loses about half the fine detail on every phone (review: `phase3/planets-touch.md`) |
| `zenith-radar-keyframes.patch` | PM-4 | Zenith's radar turns again, the podcast steps light blue, no two `@keyframes` share a name | restores the intended look, which readers have not seen so far |
| `wheel-native-scroll.patch` | PM-6 | the mouse wheel scrolls the browser's own way, without the site's glide (a notch 393 → 54 ms) | the feel of the "smooth motion" |
