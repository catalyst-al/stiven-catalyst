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
| TL-09 | P1 | **The Root causes tab of the CX Control Tower threw a script error** ("TK is not defined": a name of the script's first part used in its second) as soon as it had a cause to show, also on the example of a first visit. The panel was cut off after its chart and the hand-off of the top cause to the Action Tracker was never drawn. **Confirmed on the live site** (read-only, in Chromium). Found by clicking every button of every tool in a real browser; the unit tests never opened that tab. | **fixed**. `tests/audit-tools-2026-11-28.test.cjs` (the three languages). |

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
| L-06 | P2 | The CX Control Tower's example (zones, incident types, causes, actions: about 40 strings) is English on the German and Albanian pages; every other tool has a translated example. | **fixed** in the closure phase (section 5): 55 strings per language through the page's translator, in the vocabulary the site already uses. `tests/browser/audit-journeys.spec.mjs`. |
| L-07 | P3 | Albanian "ju" where the glossary sets "ti": 49 strings (15 in the Andon advice, the team sync box, several hints). | **fixed** in the closure phase (section 5): 52 strings addressed to the person using the tool say "ti"; replies written for a guest and words between colleagues in an example keep "ju". The list the review started from is `docs/audits/2026-11-28-sq-ju-forms.txt`. |
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
| A11Y-04 | P3 | Small checkboxes outside floor mode (13 to 20 px) where another target is close: the seal box of the backup, the Skills Matrix, the floor-check list of the logs. | **fixed** in the closure phase (section 5): the label is the target (32 px high, or the whole card) and the box keeps 24 px free around it; the boxes are drawn at the size they were, floor mode is unchanged. |
| A11Y-05 | — | axe also reported 21 contrast failures "against #ffffff" and about 40 targets "partially obscured" on the dark theme. | **not defects**: measured in the page, the text is #f6f7f4 on the dark page background; axe judged them while the sticky header or the share button lay over the element during its scan. The project's own axe checks (78 in CI) pass. |

### 2.6 Performance (laboratory measurements, not field data)

Chromium on the local build, 390 × 844, CPU slowed four times, the median of three loads. The local server sends
files uncompressed, so the sizes are larger than what GitHub Pages sends (gzip); no real-user data was available.

| Page | LCP | CLS | Blocking time | Requests | Bytes, uncompressed (scripts, styles) |
| --- | --- | --- | --- | --- | --- |
| `/` | 348 ms | **0.521 → 0.000** (PERF-01) | 154 ms | 18 | 392 KB (120, 129) |
| `/tools.html` | 492 ms | 0.000 | 40 ms | 15 | 540 KB (101, 183) |
| `/tools/lost-found/` | 388 ms | 0.000 | 237 ms | 26 | 802 KB (238, 448) |
| `/tools/room-status/` | 296 ms | 0.000 | 119 ms | 24 | 783 KB (227, 448) |
| `/tools/cx-control-tower/` | 396 ms | 0.000 | 218 ms | 23 | 897 KB (337, 448) |
| `/insights.html` | 488 ms | 0.000 | 0 ms | 11 | 401 KB (21, 183) |
| `/de/tools/shift-handover/` | 376 ms | 0.000 | 67 ms | 23 | 1 217 KB (656, 448) |
| `/magazine/management-review.html` | 316 ms | 0.000 | 12 ms | 13 | 490 KB (19, 149) |

| ID | Sev. | Finding | Status |
| --- | --- | --- | --- |
| PERF-01 | P2 | **The homepage counted a layout shift of 0.52 on a phone whose script runs after the first paint** (390 px, CPU slowed four times; 0 on a fast machine and at 1440 px): the hero's empty canvas, laid over the whole hero, was cut to its band by `cosmos.js`. Nothing visible moved, but the browser reports it, and 0.1 is the limit of "good" in the Core Web Vitals. | **fixed**: the canvas is out of sight until the script has placed it (`02-homepage.css`, one class in `cosmos.js`; the drawing and the motion are unchanged). Measured after: 0.000 in English, German and Albanian, with and without reduced motion. |
| PERF-02 | P3 | A tool page loads one stylesheet for all 59 tools (448 KB before compression) and a German or Albanian tool page the texts of all tools (about 530 KB before compression). Both are cached after the first tool. | **open**, by design (`lib/css-split.js`, `src/ui-strings.njk`); no measured problem (LCP under 0.5 s in the lab). |

### 2.7 Build and CI

| ID | Sev. | Finding | Status |
| --- | --- | --- | --- |
| BUILD-01 | P3 | **32 of the build's 72 to 78 seconds went to one filter**: finding which of the 8 000 interface texts the scripts use looked for each text three times in 4 MB of source, once per language. | **fixed** (`eleventy.config.js`: the starts of everything that follows a quote are gathered once, and the answer is shared by the two languages). The build takes 46 s; the texts chosen are the same 5 653 as before (compared one by one with the earlier code on the same source). |
| CI-01 | P3 | `tests/zip-limits.test.cjs` asserts wall-clock time ("refused within 2 s"). On a machine that was also running a browser crawl it took 2.49 s and the run failed; alone, and in CI, it passes (measured again here, section 4). | **open, by intent**: the two seconds are the acceptance criterion of the zip-bomb fix, not a timeout to raise. Run the suite on a machine that is not saturated. |
| CI-02 | — | The workflow: actions pinned by commit, `contents: read`, pages and id-token rights on the deploy job only, no test may fail or be skipped, the SEO audit fails on an error. `workflow_dispatch` from a branch other than `main` would reach the deploy job unless the `github-pages` environment restricts its branches. | **fixed in the workflow** (closure phase): the deploy job and the two upload steps run only for `refs/heads/main`. The environment's own branch rule is still worth checking by hand (section 5.6). |

## 3. Not changed, and why

- Nothing in the motion, the planets, the brand mark, the typography or the page design.
- No essay, reflection, note or publication text.
- No dependency: `npm audit` is clean and `docs/DEPENDENCIES.md` is current.
- The service worker (SEC-05) and the legacy-address clean-up (TS-07): each contradicts a recorded design and needs
  its own decision.

## 4. Final verification (branch at `42885713`)

| Check | Baseline (`198b83b4`) | This branch |
| --- | --- | --- |
| `npm run build` | passes, 78 s | passes, 46 to 50 s |
| `npm test` | 1 514 tests, 1 513 pass, 1 fail (CI-01, under load) | **1 538 tests, 1 538 pass, 0 fail, 0 skipped** |
| `node scripts/check-coaching-build.mjs` | 54 pages, 9 journeys | 54 pages, 9 journeys |
| `node scripts/seo-audit.mjs` | 911 / 894 / 894 / 17, 0 errors, 0 warnings | the same |
| `npm run test:browser` (Chromium, 3 widths, 2 themes) | not run locally (CI: green) | **311 passed**, 0 failed, 0 skipped |
| Sideways overflow, 212 pages (every tool in three languages, the main templates) at 320, 375, 768, 1024, 1440, 1920 px | 4 pages at 390 px | 0 at every width; no console error, script error or failed request |
| axe on the 177 tool pages at 390 px | 21 pages with a scroll box no key reaches; 17 with a button name without its visible text | 0 and 0, except the room tiles of Room Status (reviewed, A11Y-02). The contrast and "obscured" reports are A11Y-05. |
| Every button and input of the 59 tools (English, 390 px, a double click on each button, junk and markup typed into each field) | 1 script error (TL-09) | 0 script errors; no typed markup ran. 54 tools in one pass, the other five traced one by one. |
| Homepage layout shift, 390 px, CPU slowed four times | 0.521 | 0.000 |
| CI on the pull request (catalyst-al/stiven-catalyst#424) | — | success on `08c22576` and `dc307c3b` |

Not verified, and why:
- **Real devices and browsers other than Chromium** (Safari, Firefox, a real phone): only Chromium is installed here.
- **The Worker on Cloudflare** (alarms, real Durable Object storage): tested against a fake of its storage only; not
  deployed.
- **Screen readers**: the names and roles were checked in the accessibility tree by axe and by reading, not listened to.
- **Field performance**: no real-user data; the numbers of section 2.6 are laboratory numbers.
- **PDF, Word and Excel files the tools write**: covered by the existing tests, not opened again by hand.
- **The tools under German and Albanian in the click-through**: the click-through ran in English; the other languages
  were crawled, scanned by axe and covered by the tests named above.

## 5. Closure phase (28 November 2026, after the author's review)

The author approved the three Team Sync rules, asked for the remaining localization and accessibility work, for
other browser engines, for the order of the open pull requests, for the Worker's release plan and for the
protection of the production deployment. Nothing was merged or deployed.

### 5.1 The approved Team Sync rules, each with its test

| Rule | Test |
| --- | --- |
| A device that joins takes the team's value of a field both hold; what it held is in the restore point made first. | `tests/team-sync-integrity.test.cjs`, "TS-02: a device that joins…" (the restore point is asked for before anything is written, and holds the device's own board) |
| A log this device has not changed takes the team's order; one it has changed keeps its own, and no row is lost. | the same file, "approved rule 2" (added in this phase) |
| The Worker keeps the hash of a deleted space's token and its last revision for 180 days, nothing of the team's work, and lets it go by itself. | `tests/sync-worker.test.cjs` (what is stored after a deletion: `closed` only, with `tokenHash`, `rev`, `at`; gone after 180 days, the clock moved); `tests/sync-compat.test.cjs`, "release, step 1"; `workers/sync/local-check.mjs` in Cloudflare's runtime |

### 5.2 New findings of this phase

| ID | Sev. | Finding | Status |
| --- | --- | --- | --- |
| XB-01 | P2 | **Safari's engine threw a script error on every visit of the homepage** ("The provided value is non-finite"), also on the live site: WebKit draws a first frame while the hero still measures nothing, and the glow's ring was 0 / 0. Found by running the journeys in Playwright's WebKit. | **fixed** (`cosmos.js`: no glow before the hero has a size). After the fix the homepage, the search and the transition journeys pass in WebKit. |
| XB-02 | P2 | **The small text of the "Listen" button stood at 4.2 to 1 on the blue of the light theme** (4.5 is needed): its opacity of .8. Reported by axe in WebKit; in Chromium the check could not judge it, so CI never saw it. The number is the same in every browser. | **fixed** (.9: 4.9 to 1). |
| L-09 | P3 | A medium severity written in Albanian ("I mesëm") was ranked as low by the CX Control Tower (the pattern knew "mesatar" only). Found while translating the example. | **fixed**. |
| REL-01 | — | **The Worker live on Cloudflare is still the one of 24 October** (version `cc107fc4`): the Worker with limits prepared on 27 October was never deployed. Read back through the Cloudflare API, read only. | recorded; `docs/SYNC-WORKER-MIGRATION.md`, section 7. One deployment now brings both changes. |
| L-10 | P3 | The guide text under the Albanian Shift Handover (`src/sq/tools/shift-handover.njk`, eight sentences reviewed in SEO phase 2C) addresses the reader as "ju" throughout, while the tool's own texts now say "ti". | **needs the author**: it is the author's prose, consistent in itself, and a test pins one of its sentences. |

### 5.3 Localization

- **The CX Control Tower's example** speaks the page's language: zones, incident types, causes, owners, the status
  and the severity of its incidents, and the texts of its five actions (55 new strings in German and in Albanian,
  in the words the site already uses: Tour / linja, Tasche / çantë, Rampe / rampë, Welle / valë, Warenausgang /
  dalja e mallit). The values the tool itself reads stay as they are. Verified in the page in the three languages
  (`tests/browser/audit-journeys.spec.mjs`).
- **"ti" in Albanian**: 52 strings that speak to the person using the tool were changed (32 in `sq/ui.json`, 20 in
  four data files): those of the list of 49 that address the user, and others of the same kind found beyond it.
  (The commit message says 59; 52 is the count of the strings that differ.) Left as they
  are, on purpose: the replies a hotel writes to a guest in Guest Complaints and Lost & Found (a guest is "ju"),
  a question quoted to a guest, a sign for a buffet, a line between colleagues in the Hoshin example, and
  "Diskutoni" where it speaks to a group of raters.
- The three languages after the changes: the same 8 020 keys in `de/ui.json` and `sq/ui.json`; every literal text
  of the scripts has both entries; `tests/ui-strings-build.test.cjs` reads the built files.

### 5.4 Accessibility: the small boxes

- "Protect the file with a password" and "Anonymise names": the label is the target (32 px high) and the box, drawn
  at the size it was, keeps 24 px free around its centre.
- The floor-check cards of the logs: the whole card is the label; the box is drawn at 24 px (it was 20), because the
  automatic check still found 20 px too small beside its neighbours on some pages.
- Floor mode is unchanged (it draws its own, larger boxes).
- After: axe finds no undersized target on the 177 tool pages at 390 px; at 1440 px one text link inside a
  sentence (16 px high), which the criterion excepts.

### 5.5 Other browser engines (Playwright's builds on Linux; not Safari, not a phone)

Firefox 157 and WebKit 27.2 as Playwright ships them. **This is not a test in Safari on a Mac or an iPhone, nor on
any physical device**: the WebKit build shares Safari's engine, not its application, its settings or its storage
rules.

| Check | Chromium | Firefox | WebKit |
| --- | --- | --- | --- |
| The audit's journeys in English, German and Albanian (CX Control Tower, Action Tracker, Guest Complaints, Lost & Found, paste import) | 9 of 9 | 9 of 9 | 9 of 9 |
| Team sync between two devices, full key derivation (310 000 rounds), encryption, gzip, merge (own script, the service worker out of the way) | synced, sealed | synced, sealed | synced, sealed |
| The service worker keeps a tool's pages and opens one with the network refused | yes | yes | kept; opening could not be driven |
| The motion switch stops the drawing | at once | after one last frame | after one last frame |

What failed in the other engines and why (the repository's own journeys, written for Chromium):
- **Print (12 tests)**: they ask the browser for a PDF, which only Chromium offers to a test. Not run elsewhere.
- **Offline (handover link, action hand-off, deploy simulation)**: the tests switch the browser offline, or play
  three deployments through intercepted requests; neither reaches a service worker outside Chromium. The service
  worker itself works in both (row three).
- **Chart labels on a phone (Firefox, 3 tests)**: Firefox measures a label one pixel left of its chart's box, at the
  test's tolerance; nothing is cut (measured: the labels end 60 px inside the chart).
- **Motion (timing)**: both engines draw one more frame after the switch, inside the test's first measuring window;
  the drawing stops (measured over three seconds). WebKit on Linux animates a turn of the wheel and a programmatic
  scroll itself, which two tests take for the page's own motion.
- **Photos (WebKit, 2 tests)**: "Error preparing Blob/File data to be stored in object store". Playwright's WebKit
  runs every context without lasting storage, where WebKit refuses pictures in IndexedDB; the same is known of
  Safari's private windows. Whether a 5S or Safety Cross photo is kept in a normal Safari window was **not
  verified** (TD-07).
- **The share button over a focused field (WebKit, Damage Control at 412 px)**: fields reached by Tab sat under the
  floating share button in this build. Not reproduced in Chromium or Firefox; **not verified in Safari**, whose
  keyboard focus differs from this build's.

### 5.6 The open pull requests, and the order to merge

Checked on 28 November 2026 against `main` at 198b83b4.

- **#414 and #415 are two answers to the same question** (no sync before the person has confirmed). #414 adds a
  review step with every tool unticked and reads the team's copy to list its tools; #415 adds a consent flag and
  keeps the default ticks. They change the same lines and conflict in seven files. **Only one of them can be
  merged; the other is closed.** Which one is the author's product decision.
- **Each of them merges with this branch** apart from three translation files (`de/ui.json`, `sq/ui.json`,
  `i18n-parts/team-sync-2.json`), where both sides add texts at the same place; merged three-way by key, no text
  was changed by both sides. `src/js/team-sync.js` merges without a conflict: they change the box and its flow,
  this branch the merge and the sync.
- **Tested together**, in throwaway worktrees: this branch with #415: 75 of 75 sync tests pass (its own consent
  tests and this branch's integrity tests); with #414: 78 of 78.
- **Order**: 1. #424 (this branch): it fixes two faults that are live (the Root causes tab, the script error in
  Safari's engine) and changes the merge both consent branches are tested against. 2. The consent pull request the
  author chooses, after `main` is merged into it (a merge commit, the three translation files resolved by key) and
  its CI is green; its Albanian texts then follow the "ti" wording of this branch. 3. The other is closed.
- **One wording to align when the consent branch is updated**: #414's review says the team's work and this
  device's are "combined"; since this branch a device that has never synced a board takes the team's version of a
  field both hold (its own is in the restore point).

### 5.7 The production deployment

- `.github/workflows/deploy.yml` now publishes for `refs/heads/main` only (the deploy job and the two steps that
  prepare the Pages artifact). Before, a run started by hand on any branch went on to the deploy job.
- The other triggers: `push` to `main` (publishes), `pull_request` (never publishes), `workflow_dispatch` (now
  publishes from `main` only). There is no other workflow in the repository.
- **To check by hand**, since repository settings cannot be read from here: GitHub → the repository → Settings →
  Environments → `github-pages` → "Deployment branches and tags": it should read "Selected branches and tags" with
  `main` as the only entry (not "No restriction"). And Settings → Branches (or Rules → Rulesets): a rule for `main`
  that requires a pull request and the check `build` before merging, with "Allow force pushes" off.
- The Worker is not deployed by any workflow; `workers/sync/deploy.mjs` is run by hand with a Cloudflare token.
