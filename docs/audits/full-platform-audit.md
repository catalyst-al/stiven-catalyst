# Full platform audit, 28 November 2026

Branch `claude/kind-mayer-nj0dll`, from `main` at `198b83b4` (after the merge of
catalyst-al/stiven-catalyst#423). Nothing here is merged into `main`, deployed to GitHub Pages, or deployed to
Cloudflare. No live team copy was read or written; every test uses fictional data.

This file is the register of the audit: the baseline, every confirmed finding with its status, what was verified and
how, and what stays open. The earlier audits (`docs/AUDIT-*.md`, `docs/audit/`) were read first; a finding they
record as a decision is not repeated here unless this audit changes it, and then it says so.

Status values, as in `docs/audit/2026-10-27/STATUS.md`:
- **fixed**: reproduced first (a script or a test that failed), the cause corrected, a test passes. The test is named.
- **open**: confirmed, not changed here; the reason is given.
- **needs the author**: a wording, a product decision, an account setting or a deployment.

## 1. Baseline (`main` at `198b83b4`, before any change)

| Check | Result |
| --- | --- |
| `npm ci` | clean, 0 vulnerabilities (`npm audit`: 0 at every severity; all packages are devDependencies) |
| `npm run build` | passes: 5 785 files, 911 HTML pages, 78 s |
| `npm test` | 1 514 tests: 1 513 pass, **1 fail**, 0 skipped. The failure is `tests/zip-limits.test.cjs:185`, an assertion on wall-clock time ("refused within 2 s", it took 2.49 s) while the machine was running a browser crawl and four reviews. Alone it passes (see CI-01). |
| `node scripts/check-coaching-build.mjs` | 54 pages, 9 journeys pass |
| `node scripts/seo-audit.mjs` | 911 pages, 894 indexable, 894 in the sitemap, 17 intentional exclusions; 0 errors, 0 warnings |
| CI on `main` | run 938 (push of #423): success |
| Internal links (own script over `_site`: every `href`, `src`, `srcset`, `action` and every `#anchor`) | 911 pages, **0** missing targets, **0** missing anchors, 0 links to a folder without its slash |
| Chromium crawl of all 911 pages at 390 px, dark theme (console errors, script errors, failed requests, requests leaving the site, sideways overflow, axe WCAG 2.2 A/AA) | 0 console errors, 0 script errors, 0 failed requests, 0 requests to another host; 4 pages overflow sideways (UX-01); axe findings on 90 tool pages (A11Y-01 to A11Y-04) |
| Production, read-only (`curl`) | `/` 200; `http://` → `https://` 301; `www.` → apex 301; `/tools/lost-found` → `/tools/lost-found/` 301; unknown address 404; `/sitemap.xml` identical to the build (894 addresses); `robots.txt` allows all and names the sitemap |
| Open pull requests | #414 and #415 (team sync: consent before the first sync), #418 (a browser test). None is touched; the changes below stay out of the lines #414 and #415 change (the box and its flow), so they can merge in either order. |

## 2. Findings

Severity: P0 data loss or a critical security fault; P1 an essential workflow broken or unreliable; P2 a functional,
accessibility, privacy or maintainability fault; P3 minor.

### 2.1 Team sync and storage

| ID | Sev. | Finding | Status |
| --- | --- | --- | --- |
| TS-01 | P1 | **A correction or a removal in a log without row ids came back at the device's own next sync.** Safety Cross, Damage Control, Incomplete Control, Night Audit Log and Delay Analyzer keep rows without an id; the merge told them by their whole content, so the corrected row and the old row both stayed, and a removed row returned. One device alone in its team was enough. | **fixed**: rows without an id are compared with what was last synced (`base.c`). `tests/team-sync-integrity.test.cjs` (3 tests). A device that has not synced since this change brings such a row back once. |
| TS-02 | P1 | **Two devices that changed two rooms of one board lost one change**, on both devices, with its history event (Room Status, and every tool kept as one object): the merge was per top-level field. **A joining device replaced the team's board** on every device (also with its example). | **fixed**: a field both changed is merged inside (`mergeInside`: entries of an object one by one, a list both only added records to keeps both). A device that has never synced a tool takes the team's value of a field both hold; what it held goes to the restore point first. `tests/team-sync-integrity.test.cjs` (3 tests). **This changes a recorded rule** ("never synced: this device's fields win", `tests/team-sync.test.cjs`); the test is updated and says why. |
| TS-03 | P1 | **A read-only code could plant a copy once the team's was gone.** The Worker let any token create a space that did not exist; a read-only code carries the address and the key. After "Change the team code" or the 180 days, a member that had been away merged the planted copy in and dropped its own rows as "deleted on the team". | **fixed in the code, needs a deployment**. Device: a copy with a lower revision than last seen counts as gone and nothing is merged (`tests/team-sync-integrity.test.cjs`). Worker: a deleted or expired space keeps the hash of its token and its last revision for 180 days; only that token writes there again, and revisions go on (`tests/sync-worker.test.cjs`, 2 tests). The device check alone can be passed by writing many times; **the Worker must be deployed** (`node workers/sync/deploy.mjs`, the author's step) for the fault to be closed. |
| TS-04 | P2 | **A deleted row put back from a restore point or a saved file was deleted again by the next sync**, so the restore point made before a sync could not undo a deletion for 90 days. | **fixed**: `rebase` marks the row as revived; the team's copy carries `revived` beside the tombstones and a tombstone older than the revival no longer counts on any device. `tests/team-sync-integrity.test.cjs`. |
| WL-01 | P2 | **Unlock deleted the encrypted record even when the photos or the restore points could not be written back** (a full device): "unlocked", and both were lost for good. | **fixed**: restore points and photos are written first; if one fails the tools stay locked and the record keeps everything. Proof: `scratch e6` (before: photos 0, record 0; after: "failed", record kept). The existing lock tests pass (19). |
| TS-06 | P3 | **The team copy never settled**: two devices with the same rows in another order, or another setting of a log, each uploaded "their" version at every sync, for ever. | **fixed**: a log this device has not changed since its last sync takes the team's as it is. `tests/team-sync-integrity.test.cjs`. Two existing tests asserted the row order of the device; they now compare the rows. |
| TS-07 | P3 | A move from the old address whose upload answer is lost leaves the old copy on the server (up to 180 days, at the address a guesser can test with one hash). | **open**. The obvious fix (delete the old address at a later sync) contradicts three existing tests that say a device that finds the copy at the new address makes no request to the old one. Needs the author's decision. |
| TS-08 | — | On `main`, "Start a team" and "Join" still sync at once, before the list of tools is shown. | **open, already in review**: #414 / #415. Not duplicated here. |

Verified as working (by test or by a script against the real Worker code): a wrong token gets 403, a read-only code
cannot write to an existing space, a stale revision gets 409, the rate limit comes after the token check; offline,
invalid JSON, 401/403/413/429 and a double 409 return a status without throwing; a read-only device never sends PUT
or DELETE; no personal or unticked key is uploaded; lock writes the record before it removes the plain copies.

### 2.2 The operational tools

| ID | Sev. | Finding | Status |
| --- | --- | --- | --- |
| TL-01 | P2 | **A tool counted another tool's example as the visitor's own figures** (four readers the tests of October did not cover): Guest Complaints read the Hotel KPIs example as the hotel's room nights; the Housekeeping Planner planned from the example board of Room Status; Shift Pulse and the reminders counted the Action Tracker's example as open and overdue. | **fixed** (`readOwn`, and the example's actions left out). `tests/audit-tools-2026-11-28.test.cjs` (3 tests). |
| TL-02 | P2 | **The same paste imported twice doubled Lost & Found and Guest Complaints**: the comparison included the id each pasted row is newly given. | **fixed** (`ToolKit.rowKey` leaves the id out). Same file. |
| TL-03 | P2 | **A filter on a value that no longer exists hid the whole list while the select said "All"**, across reloads (Room Status: an attendant taken off the list, also synced to the team; Action Tracker: a renamed owner). | **fixed**: the saved filter is cleared with the select. Same file (2 tests). |
| TL-04 | P2 | **A new complaint or found item was stamped with the minute the page was opened.** A complaint taken at 14:30 on a page opened at 08:00 was logged at 08:00 and shown at once as open for 6.5 hours, past its target. Lost & Found never refreshed the time at all. | **fixed** (`ToolKit.keepNow`: date and time follow the clock until someone sets them). Same file. |
| TL-05 | P3 | A second tap on Save logged a maintenance task done twice (a phantom on-time completion). | **fixed** (`ToolKit.doubleTap`). Same file. |
| TL-06 | P3 | A second tap on Add logged a phantom entry of one unit in Damage Control, Night Audit Log and Incomplete Control. | **fixed**, same guard; an entry typed right after is still logged. Same file. |
| TL-07 | P3 | The Action Tracker said "Added." and cleared the title when the action was refused as already open; an edit that emptied the result of a verified action closed the form and dropped the other changes without a word. | **fixed**. Same file (2 tests). |
| TL-08 | P3 | A handover written on a page in one language and opened on another (a handover file, a change of language) lost its shift and its priorities (every one became early shift, medium). | **fixed**: the page knows the names in the three languages and maps by position. Same file. |

Verified correct: local-day handling in Los Angeles, Berlin and Auckland (today, created, overdue, form defaults);
the statistics kit on empty, constant and zero inputs (no NaN, no Infinity). By reading: decimal comma and point per
language, CSV quoting, BOM, separator and formula guard, the closed-date rules of the action list, ratios on a zero
base in Hotel KPIs, month ends in the Maintenance Planner.

### 2.3 Security and privacy

| ID | Sev. | Finding | Status |
| --- | --- | --- | --- |
| SEC-01 | P2 | **A locked tab kept the key of the lock** in its session storage: anyone at the desk could open the record without the PIN from the browser's console. | **fixed**: the key goes with the lock; the next unlock keeps it again. Proof: `scratch lock-session-key`. |
| SEC-02 | P2 | **"Forget everything" left typed words behind**: the offline copy of the pages keeps every address visited, with its query (a tool opened from another carries the problem text in `?problem=`), and the tab kept hand-off notes. `docs/audit/2026-10-31-phase-5a-proposal.md` says the copy is cleared by Forget everything; no script did. | **fixed** for Forget everything (the offline copy and the tab's `sc-` keys are cleared). **Open**: the service worker still stores one document per query and never evicts them (SEC-05). |
| SEC-03 | P3 | Team sync unpacked the team's copy without a limit: a 500 KB copy written by anyone with the team code inflated to hundreds of megabytes on every device at every sync. | **fixed** (64 MB cap). `tests/team-sync-integrity.test.cjs`. |
| SEC-04 | P3 | **Crafted Word and Excel files froze the page** (ATS CV, Pareto, Inventory ABC, CX Control Tower): patterns that looked ahead to the end of the text for every element left open (0.5 MB of XML, 1 KB zipped: 11.5 s, growing with the square), and a sheet's relationship id used as a pattern (seconds at 30 characters, doubling per character). Inside the limits of the zip-bomb fix. | **fixed**: one-pass scans, the ids looked up in a map. Proof: `scratch redos` (11.5 s → 25 ms), `scratch xlsx-regex-injection` (3.9 s → 0 ms). The import tests pass. |
| SEC-05 | P3 | The service worker stores every navigated address with its query as its own document and never evicts one: the cache grows without bound, and typed words in an address stay in it while the tools are locked. | **open**. Phase 5A designed "one document per address"; changing the key touches its whole bookkeeping and its offline tests. Recommended: key documents by path, and clear the cache at lock. Needs its own change. |
| SEC-06 | P3 | `.gitignore` does not cover `.env`, `.dev.vars`, `*.pem` or a saved work file (`stiven-catalyst-work*.json`). No such file is tracked. | **fixed** (added). |
| SEC-07 | P3 | `partials/home-continue.njk` writes JSON into a script with `dump \| safe`, without the `<` escape `scriptJson` applies. Today's data has no `<`. | **fixed** (`scriptJson`). |

Verified safe: no exposed secret in the tree or in history for the patterns searched; no analytics (the Cloudflare
token is empty) and no external script, image, font or frame on any of the 911 pages; the hosts contacted at runtime
are MailerLite (the newsletter form, on submit), the sync Worker (opt-in, ciphertext only), Google's favicon service
(CV Builder, after a company website is typed) and LinkedIn (the share window, on click); every inline script
matches its hash in the Content Security Policy, no inline handler; the lock and the sealed backup use PBKDF2-SHA-256
at 310 000 rounds, a random salt, a fresh IV, AES-GCM; workflow actions are pinned by commit, `contents: read`.
Not available on GitHub Pages, and so not fixable here: `frame-ancestors`, HSTS control, `nosniff`,
Permissions-Policy, COOP/CORP (headers only).

### 2.4 Languages

| ID | Sev. | Finding | Status |
| --- | --- | --- | --- |
| L-01 | P2 | German "du" in one UI string of the Writing page ("vor dem du stehst"), against the register the site keeps. | **fixed** ("vor dem Sie stehen"). |
| L-02 | P3 | Counts of one in the plural ("1 Audits", "seit 1 Tagen hier", "1 Fehlerarten", "1 Kontrollen", "1 Elemente", "1 Verschwendungen", and the English and Albanian of each). | **fixed**: singular forms in six tools, six new strings in German and Albanian. |
| L-03 | P3 | Albanian: 119 "N %" with the German space where the tools' own numbers write "N%"; 38 German quotation marks „…“ where the site's rule for Albanian is “…”; "auditë" beside "audite". | **fixed** (70 and 38 strings; the rest of the 119 were English keys, left as they are). Example texts and notes only; no option name changed. |
| L-04 | P3 | German glossary: "Feedback" where `docs/FJALORI.md` sets "Rückmeldung" (2 strings). | **fixed**. |
| L-05 | P3 | The CX Control Tower's summary printed the stage and the state of the root cause in English on the German and Albanian pages; the Lean Assessment sent "3.4 / 5" to the Action Tracker in every language. | **fixed**. |
| L-06 | P2 | The CX Control Tower's example (zones, incident types, causes, actions: about 40 strings) is English on the German and Albanian pages; every other tool has a translated example. | **needs the author**: the texts are operational vocabulary the author sets (`docs/FJALORI.md`). Not translated here. |
| L-07 | P3 | Albanian "ju" where the glossary sets "ti": 49 strings (15 in the Andon advice, the team sync box, several hints). | **needs the author**: listed with their places in `docs/audits/2026-11-28-sq-ju-forms.txt`. The team sync strings among them are also changed by #414 / #415. |
| L-08 | P3 | Smaller: the placeholder "YYYY-MM" and one Excel sheet name are not translated; Albanian apostrophes are mixed (183 straight, 22 curly). | **open**. |

Verified clean: `de/ui.json` and `sq/ui.json` hold the same 7 959 keys (7 965 now); the 54 per-tool data files match in
structure; every literal `tx("…")` and `"…" | t(lang)` has a German and an Albanian entry; no broken placeholder or
tag; every tool, essay, reflection, note, project, magazine page and role exists in the three languages; all
hreflang and switcher targets exist and are reciprocal; no `toLocale*` / `Intl` call lacks a locale.

### 2.5 Layout and accessibility

| ID | Sev. | Finding | Status |
| --- | --- | --- | --- |
| UX-01 | P2 | **Time Study scrolled sideways on a phone** in the three languages (the page 464 to 571 px wide at 390 px), and the Albanian Process Lab by 3 px: a hint kept on one line beside a label widened its column. | **fixed** (`06-tools.css`: a field never wider than its column, the hint wraps). Verified in Chromium at 320 to 1920 px (section 4). |
| A11Y-01 | P2 | **Charts and wide tables that scroll sideways could not be scrolled by keyboard** (21 pages: Fishbone, Lean Assessment, Kaizen Event, Site Compare, Spaghetti Diagram, Value Stream Map, the sheets of the Print Pack). WCAG 2.1.1. | **fixed**: a box that scrolls and holds nothing a key can reach gets a place in the tab order and a name (`script.js`). |
| A11Y-02 | P2 | **Buttons whose spoken name did not contain their visible text** ("Open it" named "Open item LF-…", "Remove meter", "Insert below", "Add to actions"): Lost & Found, Guest Complaints, Energy & Water, Standard Work, Kaizen Board. WCAG 2.5.3. | **fixed** ("Open it: LF-…"). The room tiles of Room Status ("Room 310, CO Departed…" for the visible "310 CO") were reviewed and left: the name holds every visible word. |
| A11Y-03 | P3 | Two targets under 24 px: the "All tools" link under a tool (22.8 px) and "More" in the restore box (18.6 px). WCAG 2.5.8. | **fixed**. |
| A11Y-04 | P3 | Small checkboxes outside floor mode (13 to 20 px) where another target is close: the seal box of the backup, the Skills Matrix, the floor-check list of the logs. | **open**: larger boxes change the look of five tools; floor mode already gives 26 px. The author's choice. |
| A11Y-05 | — | axe also reported 21 contrast failures "against #ffffff" and about 40 targets "partially obscured" on the dark theme. | **not defects**: measured in the page, the text is #f6f7f4 on the dark page background; axe judged them while the sticky header or the share button lay over the element during its scan. The project's own axe checks (78 in CI) pass. |

### 2.6 Build and CI

| ID | Sev. | Finding | Status |
| --- | --- | --- | --- |
| BUILD-01 | P3 | **32 of the build's 72 to 78 seconds went to one filter**: finding which of the 8 000 interface texts the scripts use looked for each text three times in 4 MB of source, once per language. | **fixed** (`eleventy.config.js`: the starts of everything that follows a quote are gathered once, and the answer is shared by the two languages). The build takes 46 s; the texts chosen are the same 5 653 as before (compared one by one with the earlier code on the same source). |
| CI-01 | P3 | `tests/zip-limits.test.cjs` asserts wall-clock time ("refused within 2 s"). On a machine that was also running a browser crawl it took 2.49 s and the run failed; alone, and in CI, it passes (measured again here, section 4). | **open, by intent**: the two seconds are the acceptance criterion of the zip-bomb fix, not a timeout to raise. Run the suite on a machine that is not saturated. |
| CI-02 | — | The workflow: actions pinned by commit, `contents: read`, pages and id-token rights on the deploy job only, no test may fail or be skipped, the SEO audit fails on an error. `workflow_dispatch` from a branch other than `main` would reach the deploy job unless the `github-pages` environment restricts its branches. | **needs the author**: check the environment's branch rule in the repository settings (not readable from here). |

## 3. Not changed, and why

- Nothing in the motion, the planets, the brand mark, the typography or the page design.
- No essay, reflection, note or publication text.
- No dependency: `npm audit` is clean and `docs/DEPENDENCIES.md` is current.
- The service worker (SEC-05) and the legacy-address clean-up (TS-07): each contradicts a recorded design and needs
  its own decision.
