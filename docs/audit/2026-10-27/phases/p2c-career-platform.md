# Phase p2c-career-platform: career tools, platform data and reader workflows, privacy/security of inputs and imports

Auditor: p2c worker. Commit audited: 3cb88a244c9337b8957a31d9fe499a4827f56c08 (isolated clone `audit-src`, built `_site`).
Local server: `node tests/browser/server.mjs 8104`. Browser: Playwright + Chromium (`/opt/pw-browsers/chromium`).
All scripts, inputs and outputs: `$AUDIT_WORK/p2c-career-platform/`
(the scripts named below live there; `out/` holds generated PDFs/DOCX/PNG, `files/` and `imp/` hold crafted inputs).

## 1. Scope and method

- **ATS CV matching**: I called `window.AtsCv.hasTerm` / `keywords` on the real built page with 54 hand-written cases
  (`ats-terms.cjs`). I then ran two realistic job ads through keyword extraction (`ats-ads.cjs`) and did an end-to-end UI
  scoring test with two CVs, one relevant and one word salad (`ats-ui.cjs`). Expected values are my own reading of what a
  recruiter or ATS would count, written before running.
- **CV Builder / ATS CV / Cover Letter**: For each tool and each language (9 runs) I loaded the example, reloaded the page,
  checked persistence, printed the page to an A4 PDF (`page.pdf`, print media), downloaded the DOCX and validated it with
  Python `zipfile` + `minidom` (`career.cjs`). I also ran a stress test with a very long name, emoji, Arabic RTL, a
  150-character title and 70 bullets, at 1280 px and 360 px wide (`career-stress.cjs`), and checked the PDFs with
  `pdfinfo`/`pdftotext`/`pdftoppm`.
- **CV import**: malformed files (fake PDF, truncated PDF, DOCX with no document.xml, random bytes, empty txt, a 195 KB
  zip bomb) plus the site's own outputs re-imported (ATS DOCX/PDF, CV Builder PDF EN/DE/SQ, cover letter DOCX)
  (`imports.cjs`, `imp2.cjs`).
- **Backup / restore**: crafted work-backup files (not JSON, wrong version, non-`sc-` key, `sc-team` key, malformed log,
  `__proto__`, garbage CV values, crafted shelf with `/\host`, `javascript:` and `//host` URLs, plus HTML payloads) were
  opened through the real file input on `/tools.html` (`backup-import.cjs`). I also ran a full round trip:
  crawl → export → `localStorage.clear()` → import → compare (`inventory.cjs`).
- **XSS**: I grepped `src/js` for every `innerHTML`/`insertAdjacentHTML`/`outerHTML`/`document.write`/`eval`/`new Function`
  and every `href`/`src` assignment. I also ran a payload fuzz of every coaching field across all 5 views and the tool
  bridge (`xss-coaching.cjs`), the shelf, the CV tools and the search query string.
- **Search**: newest content in all three languages, accent folding, NFD input, empty / 1-character / 5000-character
  queries, XSS in `?q=` (`search.cjs`).
- **Team sync**: I read the source of `team-sync.js` and `workers/sync/worker.js`, ran the merge logic in the browser
  (`merge.cjs`) and made 3 read-only GETs to the live worker (root, unknown space, foreign Origin). I sent **no** PUT or
  DELETE.
- **Source-read only**: `sw.js`, `offline.js`, `feedback.js`, `newsletter.js`, `share*.js`, `reminders.js`,
  `note-of-the-day.js`, `annotations.js`, `import-map.js`, `media-store.js`, `storage-guard.js`, the privacy page in
  3 languages.
- **Existing checks** I ran (read-only): `node scripts/check-coaching-build.mjs` ("54 generated pages and 9 complete
  journeys passed") and `node --test` on 14 related test files (136 pass, 0 fail). Passing tests are **not** taken as
  proof of correctness.
- **npm audit** on a scratch lockfile with `pdfjs-dist@4.10.38`: 0 advisories. Latest pdfjs-dist is 6.4.299.
- **Not verified**: real ATS products (Workday, Greenhouse, Personio…); Word/LibreOffice actually opening the DOCX (I only
  validated the zip and XML); Safari/Firefox; real notifications or Periodic Background Sync; live team-sync writes;
  whether the Cloudflare beacon sends the `?q=` query; legal conclusions (TDDDG/GDPR), which are given only as risk
  flags.

## 2. Coverage table

| Area | Status |
|---|---|
| ATS `hasTerm` / keyword extraction / score | Fully tested (54 term cases, 2 real ads, end-to-end UI) |
| CV Builder / ATS CV / Cover Letter in 3 languages: persistence, PDF, DOCX | Fully tested (9 runs) + stress test |
| CV import (PDF/DOCX/TXT, malformed, own outputs) | Fully tested on 11 files; real third-party CVs not tested |
| Work backup export → wipe → import | Fully tested (20 keys) plus 8 crafted files |
| Restore points (storage-guard) | Source-inspected; created in IndexedDB (seen in inventory) |
| XSS through stored or imported data | Coaching fuzzed fully; shelf/search/CV tools sampled; other 50 tools source-inspected (all use `textContent` via `ToolKit.el`) |
| Search | Fully tested (19 queries, 3 languages) |
| Team sync client and worker | Source + in-browser merge test + 3 live GETs; no writes |
| Service worker / offline | Source-inspected |
| Feedback / your-challenge / newsletter | Source + built HTML inspected; nothing submitted |
| localStorage / IndexedDB inventory | Sampled: crawl of 66 pages (EN) with example buttons; + source grep |
| Privacy page EN/DE/SQ vs behaviour | Source/built text compared |
| Roles / challenges / CV landing page | Internal links and anchors checked on 11 pages (0 broken); 12 challenges confirmed |

## 3. Defect register (most severe first)

### P2C-01 — ATS "match" score rewards filler words and drops hard-skill acronyms
- Severity: **P1** (wrong numbers users act on; the advice is counter-productive)
- URL: /tools/ats-cv/ (and /de/, /sq/)   - Source: src/js/ats-cv.js:83-101 (`keywords`), 520-560
- Evidence (REPRODUCED, `ats-ads.cjs`, `ats-ui.cjs`):
  - Keywords are chosen by frequency, and ties are broken by **longer word first**. Words under 3 characters are dropped.
    In a normal ad almost every term appears once, so the 24 "key words" are simply the longest words.
  - English logistics ad (it asks for Lean, Six Sigma, SQL, Power BI, WMS, SAP EWM, KPIs). Extracted terms include
    `using, ensure, drive, weekly, people, report, leader, associates, parcel`. They include **none** of
    `lean, sql, wms, sap, ewm, kpis, bi`. They also split "Six Sigma"→`sigma` and "Power BI"→`power`.
  - German Night Manager ad: 24 terms include `werden, abgeschlossene, karriereportal, vertraulich, behandeln,
    unterlagen, erstellen, frankfurt` (boilerplate, about 10 of 24). They do **not** include "Night Audit" or "MS Office".
  - End-to-end: CV A lists Lean Six Sigma, SQL, Power BI, SAP EWM, WMS and KPIs, and scores **38% (9 of 24)**. It is
    told to add "using, ensure, drive, weekly, report…". CV B is a single sentence of the ad's filler words and scores
    **100% (24 of 24)**. The 60% check then passes for B and fails for A.
  - Single-letter or 2-letter skills (C, R, Go, C#, BI, QA, HR, IT) can never become keywords (`length >= 3`).
- Expected vs actual: hard skills and the role's nouns should be weighted. The relevant CV should score higher than the
  word salad. Actual: the opposite.
- User impact: job seekers pad CVs with meaningless words and believe a 100% score means they match. The UI wording
  ("{a} of {b} key words from the ad are in your CV", "At least 60% … key words") presents this as an objective measure.
  The ad-hoc 60% threshold has no source.
- Confidence: high. Suggested correction: weight by a skills/tools lexicon and by capitalised/acronym tokens; keep
  ≥2-letter acronyms; give frequency-1 words no length bonus; extend the DE stopwords (werden, Unterlagen, behandeln,
  Bewerbung…); show the score as guidance with a caveat, not a pass mark. Regression risk: medium (tests in
  career-tools.test.cjs assert the current lists).

### P2C-02 — CV import corrupts data from the site's own CV Builder PDF (phone "+" lost, dashes lost, jobs not recognised)
- Severity: **P1/P2** (silently wrong data that a user then sends to employers; phone number changed)
- URL: /tools/ats-cv/ "Drop in your CV"   - Source: src/js/cv-import.js (pdf path: readPdf → pdfLines → parse)
- Evidence (REPRODUCED, `imp2.cjs`): importing `out/cv-builder-en.pdf` (made by printing /tools/cv-builder/ example to
  PDF) gives:
  - `phone: "49 170 1234567"`. The PDF holds `+49 170 1234567`; `pdftotext` reads it correctly, so the importer drops it.
  - `"Opera PMS  Advanced User"` and `"03.2022  present"`: the en-dash is lost.
  - `experience: [ {title:"", company:"", …} ]`. **All 4 jobs are missing** and dumped as raw text into an extra section
    "Professional Experience".
  - Volunteer dates come out reversed, `2015 – 2017` → `"2017 | 2015"`.
  - The same happens with the SQ PDF.
  - By contrast, the ATS CV's own PDF and DOCX re-import losslessly (4/4 jobs, all fields equal). The DOCX path is solid.
- Cause (INFERRED): the CV Builder PDF uses Type 3 Inter fonts (`pdffonts`). Some glyph items probably get height 0 or
  zero-width positions and are filtered or split by `pageLines`.
- User impact: a user who follows "Drop in the CV you already have, as PDF" with a Chrome-made PDF loses the `+` country
  code and their whole work history. The message only says "check every field".
- Suggested correction: keep 0-height items (use the font size from the transform); add a regression fixture of the CV
  Builder PDF; warn when a section that looks like experience produced 0 jobs. Regression risk: medium.

### P2C-03 — Over-long blocks are cut off in the PDF of CV Builder and ATS CV
- Severity: P2 (data truncation in the deliverable, but it is warned on screen)
- URL: /tools/ats-cv/, /tools/cv-builder/   - Source: ats-cv.js:221-242, 449-452; same pattern in cv-builder.js
- Evidence (REPRODUCED, `career-stress.cjs`, `out/ats-stress.pdf`, `out/ats-stress2-2.png`): one job with 70 bullets plus
  the marker `FINAL-BULLET-MARKER`. The ATS PDF contains only 46 of 70 bullets, the CV Builder PDF only 50 of 70, and
  the marker is missing in both. In the rendered page the overflow runs over the footer. A long job title also squeezes
  the date column to "01.202 / 0 – / presen / t".
- Mitigation that exists: the check list shows "One block is longer than a page. Shorten it so nothing is cut off."
  Printing is not blocked, and the print guide does not repeat the warning.
- Suggested correction: let a long block break across pages (split bullet lists), or block print with an explicit
  dialog; give the date column `white-space: nowrap; min-width`.

### P2C-04 — Team sync never propagates deletions (deleted actions or guest data come back; erasure impossible)
- Severity: P2 (data integrity + GDPR erasure risk)
- Source: src/js/team-sync.js:345-372 ("A row one side lacks is kept: a sync never deletes")
- Evidence (REPRODUCED, `merge.cjs`): with `TeamSyncMath.merge`, local `{rows:[r1]}` after deleting r2, team copy
  `{rows:[r1,r2]}`, base = `baseOf(team copy)` → merged rows `["r1","r2"]`. The deleted row is resurrected.
  `actions-store.remove` uses `splice` (no tombstone).
- Lost & Found and Guest Complaints are **ticked by default** (`DEFAULT_ON`, team-sync.js:271). Their data hold guest
  names and phones (lostFound.json itself says "Guest names are personal data"). Deleting a guest's record on one device
  therefore does not remove it from the team copy or the other devices. The UI does not say so.
- Suggested correction: tombstones (`deleted: <ts>`) merged like updates, purged after N days; say in the UI that
  deletions sync. Regression risk: medium (merge tests).

### P2C-05 — Team-code key stretching is bypassed by the unsalted SHA-256 space id / write token
- Severity: P2 (security design)
- Source: team-sync.js:4-8, 136-141; workers/sync/worker.js
- Evidence (SOURCE): `spaceId = SHA-256("space:"+code)` and `writeToken = SHA-256("write:"+code)`. Both are sent to the
  server (URL path / Bearer header), so they appear in Cloudflare request handling. The encryption key uses PBKDF2 with
  310,000 iterations, but anyone holding a spaceId can brute-force the 6-word code (≈62 bits, EFF short list) with
  single SHA-256 operations. That removes the 310,000× work factor; the cost becomes GPU-years rather than infeasible.
  The privacy text says the server "cannot read the work". That is true today, but the margin is smaller than the
  design implies.
- Also (SOURCE): the worker has no global or per-IP limit on creating spaces. Any client without an Origin header can
  create unlimited 4 MB spaces (cost/abuse). `http://localhost:8080` is an allowed CORS origin in production.
- Live check (REPRODUCED, 3 GETs): `/v1` → service info; unknown space → `{"error":"empty"}`; foreign Origin → 403.
  Behaviour matches the source.
- Suggested correction: derive the spaceId and token from the PBKDF2 output (HKDF), or run them through PBKDF2/scrypt;
  add a rate limit on space creation; remove the localhost origin from production.

### P2C-06 — Zip bomb in a DOCX/XLSX freezes the tab (no decompressed-size limit)
- Severity: P3 (self-inflicted DoS only; nothing leaves the browser)
- Source: cv-import.js:218-248 (`unzip`), reused by pareto.js:573, inventory-abc.js:542, cx-tower.js:851
- Evidence (REPRODUCED, `imp/bomb.docx`, 195 KB → 200 MB document.xml): the ATS import never returned; the page was
  unresponsive for more than 4 minutes until it was killed. The other malformed files (fake/truncated PDF, random DOCX,
  DOCX without document.xml, empty TXT) were all refused cleanly with a sensible message within about 1 s.
- Suggested correction: check the central-directory uncompressed size (offset 24) against a cap (for example 20 MB) and
  stream with a byte counter.

### P2C-07 — Privacy page is incomplete compared with what the site stores
- Severity: P2 (legal/credibility; legal conclusions NOT VERIFIED)
- URL: /datenschutz.html, /de/…, /sq/…
- Evidence:
  - (REPRODUCED inventory) IndexedDB `sc-media` is created on tool visits and holds **photos** for 5S audit, safety
    cross, room inspection, maintenance and floor capture (media-store.js). The privacy page mentions photos only for
    the CV Builder and cover letter.
  - The localStorage paragraph reads as an exhaustive list ("Some features keep … : the 5 Whys worksheet, the logs in
    Damage Control…"). It omits most of the ~58 tools, including Action Tracker, Lost & Found and Guest Complaints
    (guest names/phones), Skills Matrix and Shift Capacity (employee names), annotations, kaizen and so on.
  - `sc-seen-*` keys are written on the **first visit to any page**, with no user action (script.js:78-87; reproduced:
    present after visiting `/`). They are not described. Claiming that all storage is "strictly necessary for the
    feature you asked for (§25(2) no. 2 TDDDG)" is doubtful for this key and for automatic reading-progress tracking
    (`sc-reading`). This is a legal risk flag (INFERRED), not a verdict.
  - Cache Storage `sc-offline-v1` (offline copies of pages) and the `navigator.storage.persist()` request are only
    hinted at.
  - Cloudflare Web Analytics: the page says the count happens "on the writing pages (not in the tools and not on the
    role pages)". The beacon is **absent** from all tools and roles pages (REPRODUCED by grep, 0 matches). It is
    **present** on `/tools.html`, `/search.html`, `/shelf.html`, `/cv.html`, `/your-challenge.html` and the privacy page
    itself (SOURCE grep of `_site`). On `/search.html?q=…` the URL carries the reader's query; whether the beacon
    transmits it is NOT VERIFIED.
- Suggested correction: replace the enumerated list with a category description plus a full key table (key, tool,
  personal data, retention); add the `sc-media` photos and `sc-seen-*`; correct the analytics scope sentence.

### P2C-08 — "All your work in one file" omits photos (IndexedDB) and restore points
- Severity: P2 (data loss on device change)
- Source: work-backup.js (localStorage only); media-store.js:4 says so in a code comment
- Evidence (REPRODUCED round trip): 20 localStorage keys exported, wiped and re-imported; **0 differences**, so the
  localStorage round trip is lossless. IndexedDB `sc-media` (photos) and `sc-restore` are not in the file. The box
  heading and copy ("All your work in one file … to carry on from another phone or computer") promise more. Only
  floor-capture.js shows "Photos stay on this device and are not in the saved file". The 5S audit, safety cross, room
  inspection and maintenance photo UIs do not (SOURCE grep).
- Suggested correction: add the photos (base64 in the file, optional) or state the limit in the box itself.

### P2C-09 — ATS matching is not Unicode-normalised and not transliteration-aware
- Severity: P2 (false "missing" keywords)
- Source: ats-cv.js:82, 104, 110-118
- Evidence (REPRODUCED, `ats-terms.cjs`):
  - NFD input fails completely. Ad `Führung Qualität` yields keywords `["qualita","hrung"]`. CV "café"
    (NFD) does not match ad "café" (NFC), and the reverse also fails.
  - `Führung`≠`Fuehrung`, `Straße`≠`Strasse`, `përgjegjës`≠`pergjegjes`, `çështje`≠`ceshtje` in both directions.
  - Compound words: `Personalführung` does not count for `Führung`, by design.
  - Asymmetric: CV `e-mail` does not count for ad `email`, but CV `email` counts for ad `e-mail`.
  - Small false positive: `operative` counts for `operations` (the 8+ letter stem rule).
  - The sibling tool search.js *does* fold accents ("pergjegjesi" finds "përgjegjësi"), so behaviour is inconsistent
    across the site.
- Suggested correction: `normalize("NFKC")` both sides, then fold diacritics and ß/ae/oe/ue/ë/ç the way search.js does.

### P2C-10 — Earlier "substring matching" bug: FIXED (re-verification)
- Evidence (REPRODUCED): `Java`↛`JavaScript`, `SQL`↛`MySQL/PostgreSQL`, `lean`↛`clean/cleaning`, `excel`↛`excellent`,
  `sap`↛`disappear` all return false. `SQL` alone, `Lean management`, `HACCP-Schulung`, `follow-up`↔`follow up`/
  `followup`, `Front-Office`↔`Frontoffice`, `C++`, `C#` all return true.
- The remaining short-term problem is P2C-01: `C`/`R`/`Go`/`C#` match but are never extracted as keywords. Status:
  original defect closed.

### P2C-11 — Shelf accepts `/\host` links from an imported backup (open redirect)
- Severity: P3 (requires the user to open an attacker's backup file)
- Source: shelf.js:17 `ownPage = /^\/(?!\/)/`
- Evidence (REPRODUCED, `files/crafted-shelf.json`): `javascript:` and `//host` are filtered correctly, but
  `"/\\evil.example/phish"` renders as a shelf link whose resolved href is `http://evil.example/phish`. HTML payloads in
  titles render as text (no XSS).
- Suggested correction: `new URL(u, location.origin).origin === location.origin`.

### P2C-12 — Search: count capped at 30, transliteration and 1-character queries
- Severity: P3   - Source: search.js:91-96, 25
- Evidence (REPRODUCED): "Führung" (DE) shows "30 Ergebnisse" because results are sliced to 30 before counting, so the
  count understates. "fuehrung" finds nothing. "C#" shows a blank state with no "nothing found" message (terms of 1
  character are dropped). The newest content is found in all 3 languages ("information monopoly" / "Informationsmonopol"
  / "monopoli"). Accents and NFD are folded correctly. XSS in `?q=` is inert (0 injected nodes, 0 dialogs). The index is
  versioned (`?v=hash`), so the service worker cannot serve a stale index.

### P2C-13 — Coaching backup import is not idempotent; the over-limit error is mislabelled
- Severity: P3   - Source: coaching-core.js:139-158
- Evidence (REPRODUCED, `coach-import.cjs`): importing the same backup twice gives projects `["P1","P1","P1"]`.
  Exceeding 100 projects throws `invalidBackup` ("not a valid backup") although the file is valid.

### P2C-14 — Cover-letter example fails its own check; minor wording
- Severity: P3   - Evidence (REPRODUCED, `cl.cjs`): in EN, DE and SQ the example shows "150–400 words (now 144)" as
  failed ("Letter check: 6 of 7").

### P2C-15 — docs/COACHING_PLATFORM.md is stale
- Severity: P3   - Source: docs/COACHING_PLATFORM.md:33 says "It has no server … or automatic cross-device
  synchronization". The team-sync Worker exists (coaching itself is excluded from it, correctly).

### P2C-16 — Smaller robustness items (SOURCE)
- No size limit on the CV Builder JSON import or on PDF/DOCX import (`file.arrayBuffer()` of any size); PDFs are capped at
  10 pages. P3.
- The service-worker cache `sc-offline-v1` never changes name and has no size cap. Every visited page and image is kept
  forever (network-first for pages, so no stale-content risk online). P3.
- Newsletter: `fetch(..., {mode:"no-cors"})` means a rejection by MailerLite is still shown as "sent". P3.
- mailto bodies from "Your challenge" can reach about 5,000 characters before encoding. Older mail clients truncate long
  mailto URLs (INFERRED); "Copy message" is the fallback. P3.
- Annotation id fallback `${date}-${text.length}` can collide, and sync dedups by id (annotations.js:20). P3.

## 4. Genuinely good (with evidence), and what must not change

- **No XSS found.** Nearly all DOM building goes through `ToolKit.el` (`textContent`). The only `innerHTML` sinks (coaching
  workspace/bridge/results, team-sync QR SVG, a static SVG in book.js) escape consistently. A payload in every coaching
  field across all 5 views and the bridge injected 0 nodes (REPRODUCED). The search query is inert. **Keep the `el()` /
  `E()` discipline.**
- **Backup validation is strict and atomic.** All 8 crafted files were refused or contained. The `sc-team` code cannot be
  imported or exported. `__proto__` did not pollute `Object.prototype`. Writes are all-or-nothing with rollback on quota.
  A restore point is made before replacement (REPRODUCED, SOURCE). The localStorage round trip is lossless (20/20 keys).
- **CV tools' persistence and outputs.** 9/9 runs persisted across reload; 6/6 DOCX files are valid zips with well-formed
  XML; ATS DOCX → import is lossless. `docx-kit` strips XML-illegal control characters. CSV/XLSX export defends against
  formula injection (tool-kit.js:1185).
- **pdf.js 4.10.38** is loaded locally with `isEvalSupported:false` (mitigates CVE-2024-4367); npm audit shows 0
  advisories.
- **Coaching model validation** (`validState`, `known()` whitelisting on import) is thorough; check-coaching-build passes.
- **Feedback and "Your challenge" never POST**: `site.contact.action` is empty, so they only build a mailto and send
  nothing on their own. The fields are role, situation, what was tried, a publish yes/no, optional email and the page
  URL. The form asks for "No names, no company". There is a honeypot.
- **Team sync** encrypts client-side (AES-GCM, fresh IV). The worker validates shape, size and revision. Career tools,
  shelf, reading, coaching and site-compare are excluded (`PERSONAL` regex).
- Privacy page is substantive in 3 languages: it covers Google favicons, MailerLite, Cloudflare sync and retention
  (180 days). The shortcomings are listed in P2C-07.

## 5. Proposed scores

**Mathematical and tool accuracy (career tools): 55/100.** Criteria: correctness of what the user acts on (40%), input
robustness (25%), output fidelity (20%), honesty of claims (15%). The ATS score, the tool's headline number, ranks a
filler-word CV above a relevant one (P2C-01). Import silently alters phone numbers and drops work history for common
PDFs (P2C-02). PDF output truncates long blocks (P2C-03). Normalisation is missing (P2C-09). On the positive side, the
substring defect is fixed, DOCX output is valid and the round trip is lossless, persistence is solid, and malformed files
fail gracefully apart from the zip bomb.

**Input to "Accessibility and privacy" (privacy/security part): 72/100.** XSS hygiene and backup validation are strong.
Local-first is real, and the forms do not transmit anything by themselves. Points lost for the incomplete or inaccurate
privacy page (P2C-07), deletions that never sync for guest PII (P2C-04), the KDF bypass and the unthrottled worker
(P2C-05), and the shelf open redirect (P2C-11).

**Input to "Architecture and technical reliability": 70/100.** Atomic writes, restore points, quota handling, a
versioned search index and optimistic revisions in coaching are good. Points lost for no tombstones in sync, a backup
that leaves out IndexedDB, no decompression or size caps, an unbounded SW cache, and stale architecture docs.
