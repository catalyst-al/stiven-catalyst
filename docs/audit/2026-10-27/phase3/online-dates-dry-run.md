# The dates `online-dates.mjs` will write after the merge (dry run of 27 October 2026)

Method: a detached copy of `main` (`f34b1c4b`), the work branch merged into it with a merge commit (dated 27 October 2026), then `node scripts/online-dates.mjs HEAD` run **inside that copy** (the script writes next to itself); compared with the files committed on `main` today (what the live site shows) and with the script run on `main`'s own history. Nothing was pushed. If the merge happens on another day, every "merge day" below becomes that day.

## Summary

| File | Entries on main today | After | Changed | Moved earlier | First-publication dates moved |
|---|---|---|---|---|---|
| `src/_data/edited.json` (essays and reflections: "edited" byline, dateModified, feed, sitemap) | 126 | 261 | 162 | 0 | — |
| `src/_data/online.json` (publications: "Online since", datePublished/dateModified) | 96 | 96 | 54 | 0 | 0 |

Of the 162 essay and reflection changes:

- **48 come from this branch** and get the merge day: German and English reflections and essays edited in phase 2 (register, calques, quotation marks). **No Albanian text** is among them (none was changed).
- **114 come from `main` itself**, where the file was not regenerated after recent publications: 91 reflections added since 18 October get their first entry, the others their real day from `main`'s history (18–27 October). They would change in the same way with the next run of the script on `main` alone.

All 54 publication changes are `modified` = the merge day for the Management Review issues, the special edition, From the Floor and the treatise volumes reprinted in phase 2; their `published` day does not move.

## The 48 essays and reflections dated by the merge

- `src/content/de/insights/2026-10-10-the-angry-guest-at-2am.md`: 2026-10-17 → 2026-10-27
- `src/content/de/insights/2026-10-13-when-the-dashboard-turns-red-before-you.md`: 2026-10-17 → 2026-10-27
- `src/content/de/reflections/2026-09-27-ghost-in-a-room-of-mirrors.md`: 2026-10-16 → 2026-10-27
- `src/content/de/reflections/2026-10-20-architects-of-smoke.md`: (no entry) → 2026-10-27
- `src/content/de/reflections/2026-10-20-five-questions.md`: (no entry) → 2026-10-27
- `src/content/de/reflections/2026-10-20-the-bloodline-org-chart.md`: (no entry) → 2026-10-27
- `src/content/de/reflections/2026-10-20-the-false-alms.md`: (no entry) → 2026-10-27
- `src/content/de/reflections/2026-10-22-the-arithmetic-of-the-sun.md`: (no entry) → 2026-10-27
- `src/content/de/reflections/2026-10-22-the-bargain-with-a-year-of-life.md`: (no entry) → 2026-10-27
- `src/content/de/reflections/2026-10-22-the-killed-authority.md`: (no entry) → 2026-10-27
- `src/content/de/reflections/2026-10-22-the-myth-of-blind-sweat.md`: (no entry) → 2026-10-27
- `src/content/de/reflections/2026-10-22-the-tyranny-of-the-wall-clock.md`: (no entry) → 2026-10-27
- `src/content/de/reflections/2026-10-25-one-sided-availability.md`: (no entry) → 2026-10-27
- `src/content/de/reflections/2026-10-25-the-blood-trap.md`: (no entry) → 2026-10-27
- `src/content/de/reflections/2026-10-25-the-divine-mission.md`: (no entry) → 2026-10-27
- `src/content/de/reflections/2026-10-25-the-perfect-alibi.md`: (no entry) → 2026-10-27
- `src/content/de/reflections/2026-10-25-the-two-day-ultimatum.md`: (no entry) → 2026-10-27
- `src/content/de/reflections/2026-10-26-integrity-in-the-dark.md`: (no entry) → 2026-10-27
- `src/content/de/reflections/2026-10-26-the-art-of-saying-no.md`: (no entry) → 2026-10-27
- `src/content/de/reflections/2026-10-26-the-complicity-of-the-honest.md`: (no entry) → 2026-10-27
- `src/content/de/reflections/2026-10-26-the-isolated-castle.md`: (no entry) → 2026-10-27
- `src/content/de/reflections/2026-10-26-the-pedestal-complex.md`: (no entry) → 2026-10-27
- `src/content/de/reflections/2026-10-26-the-poison-paradox.md`: (no entry) → 2026-10-27
- `src/content/de/reflections/2026-10-26-the-theatre-of-haste.md`: (no entry) → 2026-10-27
- `src/content/de/reflections/2026-10-26-the-tyranny-of-the-small-man.md`: (no entry) → 2026-10-27
- `src/content/de/reflections/2026-10-26-the-victimhood-trap.md`: (no entry) → 2026-10-27
- `src/content/de/reflections/2026-10-26-two-leaders-one-floor.md`: (no entry) → 2026-10-27
- `src/content/insights/2026-10-13-when-the-dashboard-turns-red-before-you.md`: 2026-10-17 → 2026-10-27
- `src/content/reflections/2026-10-20-architects-of-smoke.md`: (no entry) → 2026-10-27
- `src/content/reflections/2026-10-20-five-questions.md`: (no entry) → 2026-10-27
- `src/content/reflections/2026-10-20-the-bloodline-org-chart.md`: (no entry) → 2026-10-27
- `src/content/reflections/2026-10-20-the-false-alms.md`: (no entry) → 2026-10-27
- `src/content/reflections/2026-10-20-the-imaginary-queue.md`: (no entry) → 2026-10-27
- `src/content/reflections/2026-10-20-the-keeper-of-the-stamp.md`: (no entry) → 2026-10-27
- `src/content/reflections/2026-10-22-the-bargain-with-a-year-of-life.md`: (no entry) → 2026-10-27
- `src/content/reflections/2026-10-22-the-killed-authority.md`: (no entry) → 2026-10-27
- `src/content/reflections/2026-10-22-the-tyranny-of-the-wall-clock.md`: (no entry) → 2026-10-27
- `src/content/reflections/2026-10-25-one-sided-availability.md`: (no entry) → 2026-10-27
- `src/content/reflections/2026-10-25-the-blood-trap.md`: (no entry) → 2026-10-27
- `src/content/reflections/2026-10-25-the-divine-mission.md`: (no entry) → 2026-10-27
- `src/content/reflections/2026-10-25-the-perfect-alibi.md`: (no entry) → 2026-10-27
- `src/content/reflections/2026-10-26-the-art-of-saying-no.md`: (no entry) → 2026-10-27
- `src/content/reflections/2026-10-26-the-complicity-of-the-honest.md`: (no entry) → 2026-10-27
- `src/content/reflections/2026-10-26-the-obedient-notary.md`: (no entry) → 2026-10-27
- `src/content/reflections/2026-10-26-the-poison-paradox.md`: (no entry) → 2026-10-27
- `src/content/reflections/2026-10-26-the-theatre-of-haste.md`: (no entry) → 2026-10-27
- `src/content/reflections/2026-10-26-the-tyranny-of-the-small-man.md`: (no entry) → 2026-10-27
- `src/content/reflections/2026-10-26-the-victimhood-trap.md`: (no entry) → 2026-10-27

## The 54 publications

- `management-review-2026-09`: published 2026-10-04 (unchanged), modified 2026-10-17 → 2026-10-27
- `management-review-nr-01`: published 2026-10-08 (unchanged), modified 2026-10-17 → 2026-10-27
- `management-review-nr-06`: published 2026-10-08 (unchanged), modified 2026-10-17 → 2026-10-27
- `management-review-nr-08`: published 2026-10-08 (unchanged), modified 2026-10-17 → 2026-10-27
- `management-review-nr-12`: published 2026-10-08 (unchanged), modified 2026-10-17 → 2026-10-27
- `management-review-nr-14`: published 2026-10-09 (unchanged), modified 2026-10-17 → 2026-10-27
- `management-review-nr-21`: published 2026-10-09 (unchanged), modified 2026-10-17 → 2026-10-27
- `management-review-nr-24`: published 2026-10-09 (unchanged), modified 2026-10-17 → 2026-10-27
- `management-review-nr-25`: published 2026-10-09 (unchanged), modified 2026-10-17 → 2026-10-27
- `management-review-nr-26`: published 2026-10-09 (unchanged), modified 2026-10-17 → 2026-10-27
- `management-review-nr-29`: published 2026-10-09 (unchanged), modified 2026-10-17 → 2026-10-27
- `management-review-nr-40`: published 2026-10-10 (unchanged), modified 2026-10-17 → 2026-10-27
- `management-review-nr-41`: published 2026-10-10 (unchanged), modified 2026-10-17 → 2026-10-27
- `management-review-nr-42`: published 2026-10-10 (unchanged), modified 2026-10-17 → 2026-10-27
- `management-review-nr-43`: published 2026-10-10 (unchanged), modified 2026-10-17 → 2026-10-27
- `management-review-nr-44`: published 2026-10-10 (unchanged), modified 2026-10-17 → 2026-10-27
- `management-review-nr-45`: published 2026-10-10 (unchanged), modified 2026-10-17 → 2026-10-27
- `management-review-nr-46`: published 2026-10-10 (unchanged), modified 2026-10-17 → 2026-10-27
- `management-review-nr-47`: published 2026-10-10 (unchanged), modified 2026-10-17 → 2026-10-27
- `management-review-nr-48`: published 2026-10-10 (unchanged), modified 2026-10-17 → 2026-10-27
- `management-review-nr-49`: published 2026-10-10 (unchanged), modified 2026-10-17 → 2026-10-27
- `management-review-nr-50`: published 2026-10-10 (unchanged), modified 2026-10-17 → 2026-10-27
- `management-review-nr-51`: published 2026-10-10 (unchanged), modified 2026-10-17 → 2026-10-27
- `management-review-nr-52`: published 2026-10-10 (unchanged), modified 2026-10-17 → 2026-10-27
- `management-review-nr-53`: published 2026-10-10 (unchanged), modified 2026-10-17 → 2026-10-27
- `management-review-nr-54`: published 2026-10-10 (unchanged), modified 2026-10-17 → 2026-10-27
- `management-review-nr-55`: published 2026-10-10 (unchanged), modified 2026-10-17 → 2026-10-27
- `management-review-nr-56`: published 2026-10-10 (unchanged), modified 2026-10-17 → 2026-10-27
- `management-review-nr-57`: published 2026-10-10 (unchanged), modified 2026-10-17 → 2026-10-27
- `management-review-nr-58`: published 2026-10-10 (unchanged), modified 2026-10-17 → 2026-10-27
- `management-review-nr-59`: published 2026-10-10 (unchanged), modified 2026-10-17 → 2026-10-27
- `management-review-nr-60`: published 2026-10-10 (unchanged), modified 2026-10-17 → 2026-10-27
- `management-review-nr-61`: published 2026-10-10 (unchanged), modified 2026-10-17 → 2026-10-27
- `management-review-nr-62`: published 2026-10-10 (unchanged), modified 2026-10-17 → 2026-10-27
- `management-review-nr-63`: published 2026-10-10 (unchanged), modified 2026-10-17 → 2026-10-27
- `management-review-nr-64`: published 2026-10-10 (unchanged), modified 2026-10-17 → 2026-10-27
- `management-review-nr-65`: published 2026-10-10 (unchanged), modified 2026-10-17 → 2026-10-27
- `management-review-nr-66`: published 2026-10-10 (unchanged), modified 2026-10-17 → 2026-10-27
- `management-review-nr-67`: published 2026-10-10 (unchanged), modified 2026-10-17 → 2026-10-27
- `management-review-nr-68`: published 2026-10-10 (unchanged), modified 2026-10-17 → 2026-10-27
- `management-review-nr-69`: published 2026-10-10 (unchanged), modified 2026-10-17 → 2026-10-27
- `management-review-nr-70`: published 2026-10-10 (unchanged), modified 2026-10-17 → 2026-10-27
- `management-review-nr-71`: published 2026-10-10 (unchanged), modified 2026-10-17 → 2026-10-27
- `management-review-nr-72`: published 2026-10-10 (unchanged), modified 2026-10-17 → 2026-10-27
- `management-review-nr-73`: published 2026-10-11 (unchanged), modified 2026-10-17 → 2026-10-27
- `management-review-nr-74`: published 2026-10-11 (unchanged), modified 2026-10-17 → 2026-10-27
- `management-review-nr-75`: published 2026-10-11 (unchanged), modified 2026-10-17 → 2026-10-27
- `management-review-nr-76`: published 2026-10-11 (unchanged), modified 2026-10-17 → 2026-10-27
- `management-review-nr-77`: published 2026-10-11 (unchanged), modified 2026-10-17 → 2026-10-27
- `management-review-nr-78`: published 2026-10-11 (unchanged), modified 2026-10-17 → 2026-10-27
- `management-review-nr-79`: published 2026-10-11 (unchanged), modified 2026-10-17 → 2026-10-27
- `management-review-nr-80`: published 2026-10-11 (unchanged), modified 2026-10-17 → 2026-10-27
- `nga-terreni-02`: published 2026-10-12 (unchanged), modified 2026-10-17 → 2026-10-27
- `operational-treatise-vol-04`: published 2026-10-21 (unchanged), modified 2026-10-21 → 2026-10-27
