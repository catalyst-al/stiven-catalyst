# Rollback proof: a visitor's work when the release goes back and comes forward again

27 October 2026. Branch `rollback-proof` (= `claude/gifted-pasteur-v7n2dw` at `5dd8dfc5`, the **new** site) against
`origin/main` at `f34b1c4b` (the **old** site, live today). Nothing was pushed, merged or deployed; no site code was
changed. Everything below was run in a real Chromium (Chrome for Testing 153) on the two builds.

Files: `rollback/rollback.cjs` (the proof), `rollback/results.json` (87 checks, every snapshot of the browser's storage),
`rollback/run.log`, `rollback/open-file.cjs` + `open-file.log` (the cause check of the refused files),
`rollback/files/` (the files the pages saved), `rollback/build.sh` + `build-light.config.mjs` (the two builds).

## Update, 27 October 2026, after the author's decision: the three risks are fixed

- Risk 1 (a file saved by the old site refused by the new one): fixed in `197d840d` (tests/work-backup.test.cjs).
- Risk 2 (work typed on the old site while locked, overwritten at the unlock): fixed in `e6203a47`. It is kept as a
  restore point, "Before the unlock", before the locked work returns, and the page says so; if the point cannot be
  kept, nothing is overwritten (tests/work-lock-storage.test.cjs).
- Risk 3 (the Action Tracker's example turned into real actions): fixed in `17f737ad`. The tracker keeps the
  example's ids where the old site looks for them (tests/actions-integrity.test.cjs, new → live → new).

The proof was run again on the fixed branch with the same two builds' method (`run.log`, `results.json`): **90
checks, 2 failed, 0 page errors.** The two are limits of the live site, which this version cannot change: it reads
no photos from a file (they stay in the file), and having no lock it cannot show the locked work during a rollback
(the work is safe and comes back with the PIN). New checks: the row typed while locked is in the "Before the unlock"
point; restored from it, it is back in the log; the locked rows are kept in turn; after that restore, nothing of the
old site's example counts as the visitor's. The account below is the first run, before the fixes.

## In short, for the author (first run, before the fixes)

A rollback of the site, done today, **keeps the work** of a visitor who has used the new site: every tool tested
shows its work on the old site, can be edited there, and nothing is lost or doubled when the new site comes back.
Three situations are not safe, each narrow but real:

1. **A file saved on the old site during the rollback cannot be opened by the new site.** "Save all my work" on the old
   site writes the motion setting the new site left in the browser (`sc-motion`); when the new site is back, it
   refuses the whole file ("This is not a Stiven Catalyst work file, or it is damaged. Nothing was changed."). The
   work in the browser is not touched, but that file is useless on the new site, e.g. to move to a new phone.
2. **A browser that is locked with a PIN when the site goes back.** The old site has no lock: the visitor sees the
   tools empty, with their examples, as if the work were gone. Whatever they type there is **overwritten** when the
   new site returns and they unlock: the locked copy replaces it. The locked work itself is safe and comes back.
3. **A browser whose Action Tracker holds only the example when the site goes back.** The old tracker does not
   recognise the new site's example: it shows the 12 example actions as real ones, and once the visitor adds an
   action there they lose their example mark for good. Back on the new site they count as the visitor's own actions
   (13 instead of 1).

What a reader would notice otherwise, without loss: the planets move again on the old site (it does not keep the
pause); an incomplete room inspection reads "✓ Pass"; the Daily Board opens on its example month; a photo inside a
file saved by the new site is not brought into an empty browser by the old site (it stays in the file).

Team sync is covered by `tests/sync-compat.test.cjs` (run again today: 6 of 6 pass): a team already moved is "gone"
for the old page, which writes nothing; the new page finds it again.

`docs/RELEASE.md` §5 said the old code accepts a 6-character PIN: **origin/main has no work lock at all**
(`src/js/work-lock.js` does not exist there); that sentence described an earlier state of the work branch. §5 is
corrected in the same commit as this review.

## Method

- **Two builds, one origin.** `build.sh` builds each checkout with its own `node_modules` (`npm ci` there: the old one
  keeps Playwright 1.56.1 and markdown-it 14.3.2, the new one 1.64.1 and 14.3.3) into its own folder. The machine's
  disk was full at the time, so `build-light.config.mjs` wraps the site's own Eleventy configuration and links
  `src/media` (600 MB of images and PDFs, never read by a tool's script) instead of copying it; nothing else differs
  from `npm run build`. Local `main` (`1644e434`) and `origin/main` (`f34b1c4b`) have the same scripts and partials
  (`git diff 1644e434 f34b1c4b -- src/js src/script.js src/sw.js src/_includes/partials` is empty); the old build is
  `origin/main`, what is live.
- `rollback.cjs` serves both builds from **one address** (`http://127.0.0.1:8361`) and swaps the folder between steps,
  as a deploy does; the browser is one **persistent** Chromium profile, so localStorage, IndexedDB and the service
  worker (registered, `sw.js`, the same file in both versions) carry over. Requests to other hosts (the analytics
  beacon) are blocked.
- All work is made **through the pages** (forms, buttons, the photo picker, the file pickers); storage is only read,
  to report. After each step the script snapshots localStorage and the four IndexedDB stores (`sc-media`,
  `sc-restore`, `sc-lock`, `sc-reminders`) into `results.json`.
- Page errors and console errors were collected on every page: **none**, on either site, in any step.
- The disk was full for a while during development; the runs reported here (`run.log`, `results.json`) were made
  after it was freed (17 GB free), and gave the same results as the run before them.

Reproduce: `bash rollback/build.sh <checkout of origin/main> <tmp>/site-old`, `bash rollback/build.sh . <tmp>/site-new`,
then `SITE_OLD=<tmp>/site-old SITE_NEW=<tmp>/site-new OUT=<tmp>/out node rollback/rollback.cjs` (about 3 minutes).

## The scenarios

**Rollback** (one browser): on the new site the theme is switched and the motion paused; the Action Tracker opens on
its example, then gets an own action and a finding handed off by the 5S Audit; Damage Control gets 2 rows (its example
leaves); a 5S audit of 24 questions is saved with a photo of its finding; Room Inspection gets room 214 with 3 of 34
items judged (incomplete) and room 215 complete; Coaching gets a project, its coaching backup, a change, and the
backup opened again (a labelled copy); CV Builder and ATS CV get a name, headline and profile; the Daily Board's
workplace profile is filled. "Save all my work" (with the photo), then lock with the PIN `482915` and unlock. Then
the **old** site: every tool opened, checked and edited (a status set to done, one action, one damage row, an action
on the coaching copy, the CV headline); the new site's file opened by the old site in an empty browser; "Save all my
work" on the old site.

**Forward again**: the new site back on the same browser; every tool checked; the coaching backup opened once more;
the old site's file opened by the new site in an empty browser.

**Rollback while locked** (second browser): Action Tracker and Damage Control work on the new site, locked with the
PIN; old site: Damage Control and the tracker opened, a row typed, "Save all my work"; new site: unlocked.

**Rollback with the example** (third browser): the Action Tracker and Damage Control opened once on the new site
(their examples only); old site: one action and one damage row of the visitor's own; new site.

## Results per tool

K = kept, L = lost, C = changed, D = duplicated. "–" = nothing of that kind.

| Tool | Rollback (new → old) | Forward (old → new) |
| --- | --- | --- |
| Action Tracker: own action, 5S hand-off | K: both shown, stored list unchanged by the old page; editable (status, new action). L, C, D: – | K: 3 actions, the status set on the old site kept; no example, no double. |
| Action Tracker, only the example stored | **C**: the 12 example actions shown as real, no example note; the old tracker's counts include them (12). After one own action they lose `example: true`. | **C**: 13 actions counted as the visitor's (the example stays as real work). L, D: – |
| Damage Control (log rows) | K: 2 own rows, no example; a third row added; rows keep their fields. | K: 3 rows, none an example, none doubled. |
| Damage Control, only the example stored | K: the old site reads the new example as an example (its note shown); the own row replaces it. | – (1 own row) |
| 5S Audit with a photo | K: the audit and its photo (the old page reads it from `sc-media`, the photo button is there). | K: 1 audit, 1 photo. |
| Room Inspection (incomplete + complete) | K: both. **C**: the incomplete room 214 reads "100 % ✓ Pass" (old verdict; it also counts in the old pass rate). | K: both; 214 reads "Incomplete" again. |
| Coaching (project + labelled copy) | K: both projects, the copy with its label; an action added to the copy on the old site; its `copyOf` mark survives the old site's save. | K: both, the old site's action kept; the same coaching backup opened again adds nothing (no duplicate). |
| CV Builder, ATS CV | K: shown and editable. | K: the headline edited on the old site. |
| Daily Board profile | K: the profile shown, not replaced by the demo profile. **C**: the board opens on its example month (the old rule, T-04). | K: the profile. |
| Theme | K. | K. |
| Motion pause | **C**: ignored by the old site (it keeps no motion choice): the planets move; `sc-motion` stays stored. | K: paused again. |
| "Save all my work", new file → old site (empty browser) | K: all 10 keys restored, the tracker shows the 2 actions. **L (on that path)**: the photo in the file is not restored; it stays in the file. | – |
| "Save all my work", old file → new site (empty browser) | – | **L (the file)**: refused whole, nothing restored (`sc-motion` in the file). The browser's own work is not touched. |
| Work lock, locked and unlocked before the rollback | K: nothing of the lock is left; the work is in plain storage as before. The old site has no lock. | K: every key as before. |
| Work lock, **locked at the rollback** | **C**: the work is hidden (in the `sc-lock` record, untouched); the tools open empty, on their examples (Damage Control 25 example rows, the tracker 8). The old site writes `sc-actions`, `sc-actions-ui`, `sc-damage-control`. | **L**: the PIN still unlocks and the locked work comes back, but the row typed on the old site is overwritten. The old site's file made meanwhile is refused (`sc-locked` in it). |
| Restore points (code reading, not run) | **C**: a "recent" point (new: one every 15 minutes of typing) shows as "recent", untranslated, and the old pruning counts it with the points made by hand (keeps 5 of all of them), so a hand-made point can go sooner. | – |
| Team sync | `tests/sync-compat.test.cjs`, 6 of 6: "gone", writes nothing. | The new page finds the team again. |

## Every failure, with its cause

The six failed checks of `results.json`, and the three changes found by reading the pages:

1. **The old site's file is refused by the new site** (forward; and the file saved while locked).
   The old site counts every `sc-` key as work except its own settings list: `origin/main:src/js/work-backup.js:10`
   (`SKIP` has no `sc-motion`, `sc-locked`, `sc-lock-idle`, which the new site writes). The new site refuses a file
   that holds any key it does not count as work: `src/js/work-backup.js:75-76`
   (`entries.some(([key]) => !isWork(key) …) → return null`, then "This is not a Stiven Catalyst work file"). Cause
   check (`open-file.log`): the same two files with only `sc-motion` / `sc-locked` taken out open and restore every
   key. A file saved by the live site **today** has none of these keys and opens; only files saved by the old site
   after the visitor used the new one are hit.
2. **Rollback while locked: the old site's row is overwritten at the unlock.**
   The old site has no lock (no `work-lock.js` on origin/main): with the plain copies removed by the lock
   (`src/js/work-lock.js:221`), its tools find nothing stored and open on their examples
   (`origin/main:src/js/tool-kit.js:942` and `:1145`, `origin/main:src/js/action-tracker.js:401-402`), and the visitor's
   entries are saved under the same keys. The unlock writes the locked copy over them without looking:
   `src/js/work-lock.js:240` (`Object.entries(payload.items).forEach(([k, v]) => storage.setItem(k, v))`). No restore
   point holds the overwritten row (the old site's daily point was made before it was typed).
3. **Rollback while locked: the work is not shown on the old site.** Same cause as 2; the work is safe in IndexedDB
   `sc-lock` (the old site never opens it) and comes back with the PIN.
4. **The example of the Action Tracker becomes real work.**
   The new tracker marks the example in the rows (`example: true`) and clears the old list of example ids:
   `src/js/action-tracker.js:23-26` and `:90-92`. The old tracker knows the example only by those ids
   (`origin/main:src/js/action-tracker.js:81`), and the old store drops every field it does not know when it saves
   (`origin/main:src/js/actions-store.js:21-37`, `clean`), so the first save on the old site removes the mark.
5. **The photo of a new file is not restored by the old site.** The old file reader knows no photos:
   `origin/main:src/js/work-backup.js:34-41` reads `items` only. A file with many photos (over 20 MB) is refused whole
   by the old site (`origin/main:src/js/work-backup.js:7` and `:114-115`, "invalid"); the new site accepts 40 MB
   (`src/js/work-backup.js:14`). The work in the browser is not affected.
6. **The incomplete inspection reads "Pass" on the old site.** `origin/main:src/js/room-inspection.js:51-56` gives a
   verdict whatever is left open (T-21). Nothing stored changes.
7. **The motion pause is not honoured on the old site.** `origin/main:src/script.js` keeps no motion choice
   (`sc-motion` is read only by the new `src/script.js:48`). The old team sync would also offer `sc-motion` as a tool
   to share (`origin/main:src/js/team-sync.js:262` and `:269`): code reading, not run.
8. **Restore points** (code reading): `origin/main:src/js/storage-guard.js:34-40` (prune: "recent" counted with the
   others) and `:316` (the label falls back to the raw reason).

## Proposals (not applied)

**P1, the file refused (risk 1). Applied by the coordinator on 27 October 2026** (the commit after this review; test: tests/work-backup.test.cjs with the two files below as fixtures in tests/fixtures/old-site-backups/). As proposed: In `readBackup`
(`src/js/work-backup.js:75`), leave the page's settings out instead of refusing the file:
`const entries = Object.entries(items).filter(([key]) => !SKIP.has(key));` (`SKIP` already lists `sc-motion`,
`sc-locked`, `sc-lock-idle`, `sc-theme`, the team keys). A key that is not `sc-` at all still refuses the file.
Test (`tests/work-backup.test.cjs`): `rollback/files/work-saved-by-old.json` and
`work-saved-by-old-while-locked.json` as fixtures: `readBackup` returns their work keys and neither `sc-motion` nor
`sc-locked`; a file with `{"foo": "x"}` is still `null`. The same rule in team sync's reader if it applies one.

**P2, the overwrite at the unlock (risk 2).** In `unlock()` (`src/js/work-lock.js`, before line 240): when a lockable
key already holds a value different from the locked one (only a page without the lock can have written it), keep the
current work as a restore point first: add `{ id: pointId(now, "before-restore"), created, reason: "before-restore",
items: gather(storage), bytes }` to `payload.points` (they are written at line 244), and say "Work written while the
tools were locked is kept as a restore point". Nothing is lost, the visitor restores what they need from the list.
Test (`tests/work-lock-storage.test.cjs`): lock, then set `sc-damage-control` as the old page does, unlock: the key
holds the locked value and `sc-restore` holds a point with the other value. Without code: say in the release note
that a locked browser shows its tools empty during a rollback and that its work comes back with the PIN.

**P3, the example (risk 3).** Keep writing the old mark beside the new one: the tracker stores the ids of the rows
marked `example: true` in `sc-actions-ui.exampleIds` (set in `loadExample`, emptied when the example leaves), and the
migration at `src/js/action-tracker.js:23-26` stops clearing them. The old tracker then shows the example as one and
drops it at the first own action (`origin/main:src/js/action-tracker.js:356`, `:397`). Test: a frozen copy of
origin/main's `actions-store.js` and `action-tracker.js` (as `tests/fixtures/sync-v1/` does for sync) opened on the
list the new tracker writes for its example: the example note is shown, and one own action leaves one action.
A hand-off made by another tool on the old site (`ActionsStore.add` there) still joins the example: that is the old
site's own behaviour (T-03), which no change here can reach.

P1 is the one that matters most: it also protects a visitor who never meets a rollback but opens, on the new site, a
file saved by the old one after a first visit to the new one. P2 and P3 need a locked browser or an untouched
example at the very moment of a rollback.

## What was not covered

Other tools than the eleven above (their formats are the same `sc-` keys read by the same `ToolKit`); the German and
Albanian pages; a phone; restore points made by typing for 15 minutes (read in the code only); reminders
(`sc-reminders`, same schema in both); a real deploy (GitHub Pages caching, a service worker update while a page is
open); team sync in a browser (covered by the compatibility test).
