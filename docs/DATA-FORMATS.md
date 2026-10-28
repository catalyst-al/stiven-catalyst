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

Two shapes worth naming, because other tools read them. `sc-actions` is `{ rows: [action] }`, an action being `{ id, title,
detail, owner, due, source, check, area, priority, status (open | doing | done | verified), created, closed, result }`
and, when it belongs to an investigation of the CX Control Tower, `caseId` (`INV-…`); `verified` is never written
without a `result` (`ActionsStore.update`). In `sc-cx-tower` the saved investigations are `cases: [{ id, updated, the
case fields (title, status, problem, evidence, where, rootStatus, why1–why5, root, containment, corrective, preventive,
owner, deadline, verifyMetric, verifyResult), actionId (the row of the station's own actions table), snapshot (metric,
label, from, to, DSP, Shift, Zone, dim, segment, k, n, source), trackerId (the action in `sc-actions`), verifyFrom (the
day the change took effect), verification ({ status: effective | not-effective, decided, before: { from, to, k, n },
after: { from, to, k, n }, text }) }]`; a case saved before October 2026 loads with the three last fields empty.

Hand-offs between tools through `sessionStorage`: `sc-pareto-handoff` (a log opened in Pareto), `sc-sigma-handoff`
(days opened as a control chart); read once and cleared. Hand-offs through the address, read once and cleaned:
`?action=…&owner=&due=&source=&check=&area=&priority=&case=` (the Action Tracker), `?problem=&case=` (5 Whys),
`?issue=&owner=&due=` (Shift Handover), `?case=INV-…&problem=&why1=…&why5=&root=` (the CX Control Tower opens the
investigation and fills its empty fields).

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
