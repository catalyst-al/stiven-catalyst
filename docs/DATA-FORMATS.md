# What the tools keep, and in what shape

Written 28 October 2026. The site runs in the browser alone: every tool keeps its work on the visitor's device. This
page lists where and how, so a change, a rollback or a migration never has to guess. Every fact here is read from the
code named beside it; when the code changes, this page changes with it (the test `tests/data-formats.test.cjs` checks
the storage keys against the data files).

## 1. The browser's storage, key by key

**`localStorage`, keys `sc-*`.** One key per tool, named in its data file (`src/_data/<tool>.json`, field
`storageKey`): `sc-a3-report`, `sc-actions` (the Action Tracker), `sc-andon`, `sc-ats-cv`, `sc-cost-of-quality`,
`sc-cover-letter`, `sc-cv-builder`, `sc-cx-tower`, `sc-daily-board`, `sc-damage-control`, `sc-delay-analyzer`,
`sc-dmaic`, `sc-eight-d`, `sc-energy-tracker`, `sc-fishbone`, `sc-five-s-audit`, `sc-fmea`, `sc-gemba-walk`,
`sc-guest-complaints`, `sc-heijunka`, `sc-hoshin-kanri`, `sc-hotel-kpis`, `sc-housekeeping-planner`,
`sc-incomplete-control`, `sc-inventory-abc`, `sc-kaizen-board`, `sc-kaizen-event`, `sc-kanban-sizing`,
`sc-leader-standard-work`, `sc-lean-assessment`, `sc-lost-found`, `sc-maintenance-planner`, `sc-night-audit`,
`sc-oee`, `sc-ops-report`, `sc-pareto`, `sc-poka-yoke`, `sc-print-pack`, `sc-process-lab`, `sc-project-portfolio`,
`sc-risk-assessment`, `sc-room-inspection`, `sc-room-status`, `sc-safety-cross`, `sc-shift-capacity`,
`sc-shift-handover`, `sc-sigma-chart`, `sc-signals`, `sc-site-compare`, `sc-skills-matrix`, `sc-smed`,
`sc-spaghetti-diagram`, `sc-standard-work`, `sc-time-study`, `sc-value-stream-map`, `sc-waste-log`; the 5 Whys and
the KPI Diagnostic keep theirs under `sc-five-whys` and `sc-kpi-diagnostic`. A translated page of a tool may keep its
own log under `<key>-de` / `<key>-sq`, and a tool's settings under `<key>-check`, `<key>-calc`, `<key>-ui`
(`WorkBackup.toolSlug` in `js/work-backup.js` maps them back to the tool).

The value is JSON. Every tool rebuilds what it reads field by field (`clean` or `loadState` in its script), so a value
from an older version, a damaged one or one made by hand never breaks the page: unknown fields are dropped, missing
ones get their defaults. Nothing is written back on a plain load; the first change saves the whole state.

Keys that are the reader's, not a tool's: `sc-workplace` (the workplace profile), `sc-annotations` (timeline events),
`sc-shelf` and `sc-reading` (My shelf and the reading progress), `sc-checklists`, `sc-import-maps` (column mappings
of imports), `sc-seen-writing` / `sc-seen-publications` (the "new" marks of the menu).

Keys that are settings of the page and never travel in a file or a lock: `sc-theme`, `sc-motion`, `sc-floor-mode-ui`,
`sc-print-guide-hidden`, `sc-persist-asked`, `sc-locked`, `sc-lock-idle` (the list `SKIP` in `js/work-backup.js` and
`OPEN` in `js/work-lock.js`). `sc-team` (the team code) and `sc-team-state` stay on the device and out of files, but
go into the locked record so team sync pauses while locked.

The shift a device is working in and the forms left unfinished in it (`js/shift-context.js`; no page shows either yet).
`sc-shift-ui` is the active shift, `{ v: 1, date, index, of, label, list, set }`: `date` the operative date the visitor
chose (ISO; a night shift keeps the date it started on), then the shift as it was when it was chosen, all four parts
required: `index` its place in the list it was chosen from, `of` the length of that list, `label` the word it was
shown as, and `list` which list that was (`en`, `de` or `sq` for the list built into the pages of that language,
`profile` for the shifts of the workplace profile), and `set` when. Only `ShiftContext.setActive()` writes it: not the
clock, not a file, not a restore point. A stored shift is never read as whatever is in its place now: the visitor may
put the profile's shifts in another order or name another shift in the same place. `ShiftContext.place(shift, shifts,
list)` says where a stored shift is in a list as it is today: `same` when the list is of the same kind and length and
has the same word in the same place, or when both lists are built into the pages of two languages (the same shifts in
the same order, in other words; the logs and the handover of a language offer the same three); otherwise `unclear`,
with the places that hold its word now (one, none or several). `ShiftContext.activeOn(shifts, list)` gives the active
shift for a page only when it is `same`, and `"shift-unclear"` otherwise; nothing in the file changes a stored shift
or the profile by itself. It is a
setting of the device: it is in the list `SKIP`, so it is in no saved file and no restore point; like `sc-team` it goes
into the locked record. `sc-drafts-ui` is `{ v: 1, drafts: [draft] }`, a draft being `{ tool, form, scope, date, index,
of, label, list, values, updated, rev }`. Its identity is `tool` (the storage key the form writes to, so the tool and
the language), `form` (the form's name on the page), `scope` (what else sets two forms of the page apart; `""` when
nothing does), `date` and the shift whole (`index`, `of`, `label`, `list`): one draft for each identity, and a draft
only while its `values` hold something. Because the word and the kind of list are part of the identity, a draft of a
shift whose place now holds another shift is not found for that other shift: it stays the draft of the shift it was
written in, until the visitor has it moved or dropped. `rev` changes at every save; a save names the `rev` it loaded (`base`) and is refused with `"changed"` when
the stored draft has another, so an open form never writes over a draft it has not seen. A draft moves to another
identity only through `move()`, which refuses (`"target-has-work"`) when the target has a draft or the caller says its
form has work. The drafts are work: they are in the saved file and the restore points. Team sync shares none of these
keys (they end in `-ui`). A file whose `sc-drafts-ui` is not as the site writes it is refused whole. A file or a
restore point put back never sets the active shift and never replaces a draft unasked: the drafts it does not have
stay, the ones that are new here are added, and where both hold a draft of one identity with other values the page
asks which to keep before anything is changed (`WorkBackup.settleDrafts`); leaving the question changes nothing. A
draft taken from the file gets a new `rev`. A list of drafts that cannot be read is kept aside unchanged, once, under
`sc-drafts-unreadable-ui`, and reads as empty; a record in it that is not a draft is left out the same way.

Two shapes worth naming, because other tools read them. `sc-actions` is `{ rows: [action] }`, an action being `{ id, title,
detail, owner, due, source, check, area, priority, status (open | doing | done | verified), created, closed, result }`
and, when it belongs to an investigation of the CX Control Tower, `caseId` (`INV-…`); `verified` is never written
without a `result`, and on an action with a `caseId` it is set or unset by the case alone (`ActionsStore.update(id,
patch, { byCase: true })`; by hand the store refuses it, `lastUpdate = "case-verifies"`). The same open title from the
same tool is a duplicate only within the same case. An update the browser could not save returns null (`"unsaved"`).
An action may name what it is about with `ref` (Room Inspection: `"<inspection id>|<item id>"`, e.g.
`rm3k9x1ab|bathroom-5`); with a `ref`, the same `source` and `ref` is the same action in any status, so a defect sent
again is never a second action and two defects with the same words are two. Room Inspection also gives its actions
their id, `ri-<inspection id>-<item id>`, the same on every device, so team sync merges two devices' copies of one
defect into one row. In `sc-room-inspection` a row's `sent[qid] = true` stays the record that the fault left the page;
the action is found again by that id, then by its `ref`; a row from an older page (`true` without an action to find)
reads as sent. A re-inspection (phase 4B) is a row of its own with `kind: "recheck"` and `recheckOf: <the inspection's
id>` (kept only together: a `recheckOf` on another kind, or one that is not a plain id, is dropped); it takes the room,
floor, type and `template` of that inspection, and its `answers` hold what was judged (nothing is marked pass by
itself; the bulk "mark the rest as pass" skips the defects it checks). With it travel `checks: { [qid]: { id, status,
closed } }`, the defect's action as it stood when the check was made (kept whole or not at all). A verdict is eligible
by that record, not by the action's later state: it verifies a defect's action when the action was `done` at the check
and the item passes, reopens it when the item fails, and leaves it as it is otherwise; a verdict waiting to be written
(the browser could not save the tracker) is written only while the action is still the one checked (same status, same
`closed` date), never over a repair redone since; a check made while the action was open says nothing about a repair
reported later; a row without `checks` applies nothing by itself. A re-inspection's own defects (items the checked
inspection had not failed, or found failed again after they were verified) can be re-inspected in turn from its row. On such an action (`source: "room-inspection"` with a `ref`) `verified` is written by
the re-inspection alone (`ActionsStore.update(id, patch, { byRecheck: true })`; by hand the store refuses it,
`lastUpdate = "recheck-verifies"`), with the proof on the action: `proof: { recheck: <the re-inspection's id>, date,
time, qid, item, answer: pass | fail }`, kept whole or not at all and written by the re-inspection only (another
caller's `proof` is dropped). A verification sets `closed` to the re-inspection's date; a reopening clears it. A
re-inspection's fault that is the checked inspection's own defect (still open, or done and now reopened) is never sent
as a second action; an item the inspection had not failed, or a defect verified before the check, is a new defect
sent under the re-inspection's identity (`ri-<re-inspection id>-<item id>`). Actions of older pages without a `ref`
are verified by hand as before.

An action may also say where in a log it came from, `origin` (`ActionsStore.originOf`; no tool sends one yet, the shape
is settled before the pages that will): `{ v: 1, tool, lang, kind, from, to }`, `tool` the slug of the log and the same
as the action's `source` (an origin of another tool is not kept), `lang` the language whose copy of the log it is (`en`,
`de`, `sq`: each language keeps its own log, and the words of a filter are that language's), `from` and `to` the period
as two ISO dates, always both, and `kind` one of three. `period`: the whole period, nothing more. `filter`: with
`filter: { field: "cause" | "stage" | "shift", value }`, the one filter that was on. `row`: with `row: { id, date, shift,
stage, cause, units, twins }`, a copy of the one row, `twins` how many rows of the log read the same when the action was
made (1 when the row was alone). An origin is kept whole or not at all: one with another `v`, a date that is not ISO, a
period backwards, an unknown kind, field or language, or a kind without its part is dropped, and the action stays. It
is written when the action is made and `update()` never changes it. It travels in the hand-off note with the other
fields (`sc-action-handoff`), never in an address: a link of the older shape (`?action=…`) carries none. A row with an
`id` is the action's `ref`, so the same row sent again is the same action in any status. The rows of the logs have no
`id` today, and a row that has none is never given one later: team sync knows a row without an `id` by its whole
content, so an `id` added on one device would make it a second row on the others. The three logs of `js/defect-log.js`
(`sc-damage-control`, `sc-incomplete-control`, `sc-night-audit`) keep the `id` a row already has (letters, digits, `_`
and `-`, up to 40; anything else is dropped and the row stays), last on the row, and write none yet. The order
matters: a page that rebuilt a row without its `id` would have team sync read the `id` as deleted on that device, and
the row would lose it on every device, so pages write ids only once every device of a team runs a version that keeps
them. A pasted row has no `id` and is the row already in the log when everything else on it is the same. For such a row `row.id` is `""`, no
`ref` is set and the rule without a `ref` holds (the same open title from the same tool). Opened again from the action,
a row without an `id` is looked for by the copy of its fields: one match is the row; several are shown as "one of
these", none chosen; no match opens the period and says the row is no longer there.

In `sc-cx-tower` the saved investigations are `cases: [{ id, updated, the
case fields (title, status, problem, evidence, where, rootStatus, why1–why5, root, containment, corrective, preventive,
owner, deadline, verifyMetric, verifyResult), actionId (the row of the station's own actions table), snapshot (metric,
label, from, to, DSP, Shift, Zone, dim, segment, k, n, source), trackerId (the action in `sc-actions`), verifyFrom (the
day the change took effect), verification ({ status: effective | not-effective, decided, before: { from, to, k, n },
after: { from, to, k, n }, text, minN, target }) }]`; the snapshot also keeps `minN`, the sample floor in force when the
evidence was saved, which the verification uses whatever the deep dive's floor is later, and `baseK` / `baseN`, the
failure counted on the case's own rows over its before period when the evidence was recorded; a case saved before
October 2026 loads with these fields empty. A new case id is never one that a case, a tracker action or a register row
still names. The before period is the snapshot's period, or, for a case started from a week segment, that week inside
it; the after window begins strictly after its last day and, for a week segment, is not filtered by the week. Both
windows must reach the floor for a verdict. A decision keeps its own numbers and the approved maximum of its day
(`verification.target`); when the rows or the maximum change later, the page shows the difference and the decision
stands until it is made again.

Hand-offs between tools through `sessionStorage`: `sc-pareto-handoff` (a log opened in Pareto), `sc-sigma-handoff`
(days opened as a control chart); read once and cleared. Hand-offs through the address, read once and cleaned:
`?action=…&owner=&due=&source=&check=&area=&priority=&case=` (the Action Tracker), `?problem=&case=` (5 Whys),
`?issue=&owner=&due=` (Shift Handover, from 5 Whys), `?case=INV-…` (the CX Control Tower opens the investigation; 5 Whys
and the Shift Handover name it). From the tower to 5 Whys and back, and from the tower to the handover, the texts never
enter the address: `sessionStorage` `sc-case-handoff`, one note `{ caseId, from: "cx-control-tower" | "five-whys",
problem, whys, root | issue, owner, due, at }`, written on the click and read once by the page it is for (a note for
another case is dropped, and the page says nothing arrived).

**IndexedDB.** `sc-restore` (store `points`): the restore points of `js/storage-guard.js`, `{ id, created, reason,
items, bytes }`, `id` = `<ISO time> <reason>[ n]`, reasons `daily`, `before-open`, `before-restore`, `manual`,
`before-sync`, `recent`; kept 14 daily, 5 before a sync, 6 recent, 5 others. `sc-media` (`js/media-store.js`): the
photos of the 5S audit and the safety cross, `{ id, created, tool, ref, width, height, blob }`. `sc-reminders`
(`js/reminders.js`, store `kv`): the due-action reminders, on this device only. `sc-lock` (store `blob`, one record
`work`): the locked copy of everything above while the PIN is on (§3).

## 2. The files a visitor saves and opens

| File | `format` | `version` | Written by | Holds |
| --- | --- | --- | --- | --- |
| Work file | `stiven-catalyst-work` | 1 | `js/work-backup.js`, `makeBackup` | `exported`, `items` (every work key with its JSON text), `media` (the photos, base64) |
| Work file, sealed | `stiven-catalyst-work-sealed` | 1 | `js/work-backup.js`, `sealBackupText` | `exported`, `salt`, `iv`, `data` (base64): the work file above, gzipped (first byte 1) or plain (0), AES-GCM 256 under PBKDF2-SHA-256 (310 000 rounds) of the password, the format and version as additional data |
| Handover, link | fragment `#h2=` | 2 | `js/shift-handover.js`, `packHandover` | base64url of `[2, salt16, iv12, ciphertext]`; inside, `{ format: "stiven-catalyst-handover", version: 2, id, sent, handover }`, gzipped or plain, AES-GCM under PBKDF2 of the transfer code. `#h=` (gzip) and `#h0=` (plain) are version 1, read but no longer made |
| Handover, file | `stiven-catalyst-handover-file` | 2 | `fileText` | `date`, `shift`, `sent`, `data` (the same sealed bytes, base64url) |
| Handover, confirmation | fragment `#a=` | — | `ackFragment` | `<transfer id>.<6 base32 chars>[.<base64url name>]` |
| Team code, read-only | `scr1.` + base64url | 1 | `js/team-sync.js`, `viewerCode` | the space id and the AES key, not the write token |
| Exports | CSV, XLSX, PDF, DOCX, PNG, SVG, JSON Resume | — | `ToolKit.downloadCsv`, `downloadXlsx`, `js/pdf-kit.js`, `js/docx-kit.js`, `js/chart-kit.js`, `AtsCv.toJsonResume` | the tool's rows or document; plain, for other programs |

Limits: a work file past 40 MB, a handover fragment past 64 KB, a handover file past 1 MB or a handover payload past
256 KB is refused before it is read in full; Word and Excel imports stop at 50 MB unpacked.

## 3. The PIN lock (`js/work-lock.js`)

`sc-locked = "1"` in `localStorage` says the device is locked; the record `work` in IndexedDB `sc-lock` holds
`{ format: "stiven-catalyst-lock", version: 1, locked, salt, iv, data }`: every lockable key of `localStorage`
(§1, all but the page settings), the restore points and the photos, gzipped and encrypted with AES-GCM 256 under
PBKDF2-SHA-256 (310 000 rounds) of the PIN. While locked the tools read nothing and write nothing (`ToolKit.write`);
what another page wrote meanwhile is kept as a restore point before the unlock. The derived key may sit in the tab's
`sessionStorage` (`sc-lock-key`) for a relock without the PIN.

## 4. Team sync (`js/team-sync.js`, `workers/sync/worker.js`)

One encrypted record per team on the sync Worker: `{ format: "stiven-catalyst-team", version: 1, sent, device,
devices, items, tombstones }`, gzipped where possible, AES-GCM 256 under PBKDF2 (310 000 rounds) of the six-word team
code, with the space id and the write token derived from the code by PBKDF2 too. The server stores ciphertext, a
revision and a hash of the token; deletions travel as tombstones kept 90 days. A space nobody writes to for 180 days
deletes itself.

## 5. Rules every change keeps

- A new field goes into the tool's `clean`/`loadState` with a default: an old saved state loads unchanged, a new one
  opens on an old page without harm (the field is dropped there, not kept half).
- A format gets a `version`; a reader refuses what it does not know rather than guessing.
- Nothing readable goes into an address, a QR code or a file meant for another device without a code or password;
  the code travels separately.
- Nothing is written to storage on a plain load, and nothing is replaced on the visitor's device without their act.
- A restore point is made before a file, a sync, a restore or an unlock replaces anything.
