# STIVEN CATALYST | SITEWIDE QUALITY & UX AUDIT

Date: 31 October 2026, revised the same day after the independent review (ChatGPT, round 1): see §12 for what the
review changed. Audited state: `main` at `0b995e82` (Phase 4B merged and deployed, CI run 807) and the
published site https://stivencatalyst.com as served that day. Audit only: no code, content, data or infrastructure was
changed. All browser work used a headless Chromium with its own empty storage and fictional data (room 412, a dripping
tap); nothing was written to the site or to any real user's browser. Prepared for the owner and the independent
architect/auditor (ChatGPT), who decide what is justified.

## 0. How the evidence was gathered

| Method | What it covered | Where |
| --- | --- | --- |
| HTTP crawl of the live sitemap | 804 pages: status, size, `lang`, title, `h1` count, meta description, every internal link (1 206 distinct targets) | `crawl.mjs` (audit scratch), results in §2 and §7 |
| Headless Chromium, 36 representative pages × 3 widths (390, 768, 1 440) × 2 themes = 216 page loads | screenshots, console and page errors, axe-core WCAG 2.0/2.1 A+AA (serious and critical), horizontal overflow, bytes transferred, first twelve tab stops and their focus indicator, landmarks, unlabeled fields, nameless buttons | §3, §6, §7 |
| Cold first-visit weight, fresh browser context per page | 12 key pages: bytes transferred by resource type, largest resources, request count | §5 |
| Interaction checks at 390 px | mobile menu by keyboard, theme and language controls, search, Tools page anchors and length, typography metrics, interactive target sizes, Action Tracker empty state and feedback, a German 404 | §1, §2, §3 |
| Repository reading | navigation (`base.njk`), home, Start here, Tools, search, planets (`families.json`, `tools.json`), hand-offs (`tool-kit.js`, `actions-store.js`), the service worker, storage, Team Sync client, CSP, tests, build | §1, §5 |
| Translation coverage | every `tx("…")` in `src/js` and every `"…" \| t(lang)` in templates against `de/ui.json` and `sq/ui.json` (7 207 texts) | §6 |
| Prior audits | `docs/audit/2026-10-27/*`, `docs/AUDIT-*.md`, the phase reports: accepted limitations and open decisions were read first and are **not** raised again here except where a regression or new evidence appears | §9 |

Not measured and not claimed: Lighthouse scores, field timings on real phones or networks (the container sits in a
datacenter), Firefox and Safari, screen-reader output, the Team Sync worker, real user data of any kind.

### 0.1 Coverage: 804 crawled pages against the build

Eleventy reports "Wrote 838 files". That count is files, not pages: the build at `0b995e82` writes **818 HTML pages**
and 20 non-HTML outputs (three Atom feeds, three podcast feeds, three search indexes, `sitemap.xml`, `robots.txt`,
`manifest.webmanifest`, `sw.js`, the string and data scripts). The sitemap lists 804 of the 818 pages; the crawl
followed the sitemap. The 14 pages outside it, checked one by one (`comm` of the built file list against the sitemap):

| Page | EN | DE | SQ | Why it is out |
| --- | --- | --- | --- | --- |
| Search | `/search.html` | `/de/search.html` | `/sq/search.html` | `noindex: true` in the template |
| My shelf | `/shelf.html` | `/de/shelf.html` | `/sq/shelf.html` | `noindex: true` (personal, per browser) |
| Legal notice | `/impressum.html` | `/de/impressum.html` | `/sq/impressum.html` | `noindex: true` |
| Privacy | `/datenschutz.html` | `/de/datenschutz.html` | `/sq/datenschutz.html` | `noindex: true` |
| Not found | `/404.html` | — | — | error page, `noindex` |
| Offline | `/offline.html` | — | — | the service worker's fallback, not a destination |

All 14 are excluded on purpose (the 27 October audit recorded "keep the intentional `noindex` pages"); no page was
missed by accident, and nothing in the sitemap is missing from the build. The 14 were not HTTP-crawled, but `/search.html`
and the 404 page were loaded in the browser capture (see §3), and the legal pages are linked from every footer, so they
were reached by the link check (every footer link answered 200).

## 1. Executive summary

The platform is in good technical and editorial health. The crawl found **no broken internal link in 1 206 targets,
no page without one `h1`, a description and the right `lang`**, and **no missing translation in 7 207 interface texts**
across English, German and Albanian. The security posture is unusual for a static site: a Content Security Policy with
script hashes on every page, no third-party script on any tool page, no tool work leaving the device except through
the hand-offs P1-02 documents (the Action Tracker address until Phase 5B; the `?problem=` and `?issue=` links still) and the CV Builder's disclosed logo lookup,
backups and a PIN lock that encrypt locally. The four planets give the 59 tools a navigable order by role, the
operations tools hand work to each other through the Action Tracker and in-browser notes rather than URLs, every one
of the 40 essays links to its tools, and the mobile menu, theme and motion controls work by keyboard.

Three findings are rated P1. One is a confirmed functional defect: the **offline copies of tool pages lose their
scripts after a deploy** until each page is reopened online, because the service worker evicts old asset versions
that cached pages still reference (reproducible across two deployments, §3 P1-01; no test covers it). One is a
confirmed privacy gap against the platform's own promise: the **generic "Add to actions" hand-off places the action's
title, detail and owner in the address** of the request to the Action Tracker (confirmed in code and in the browser;
whether any log retains it is not proven, §3 P1-02). The third is usability, measured: the **Tools page is thirty phone
screens long with no way to narrow 59 tools** (§3 P1-03; the smallest fix is a filter field). The remaining weaknesses
are **weight and length** (a tool page is seventeen phone screens of which the tool is the first third; every German
or Albanian tool page downloads a 146 KB compressed dictionary meant for all 59 tools; every tool page carries an 81 KB
stylesheet meant for all of them) and one terminology inconsistency, now P2: the **German Action Tracker calls the
Verified status "Bestätigt" while Room Inspection and the tracker's own explanations call it "Geprüft"**, which blurs
the distinction Phase 4B was built to make without breaking it. Two accessibility leftovers (the filter field of the writing lists
shows no focus state; the "Sheet" button of Room Inspection fails label-in-name in German and Albanian), the analytics
beacon that loads and fails on every writing page while collecting nothing (the known A-01 state, now with a console
error on 126 of 216 loads), and several maintainability items (duplicated helpers, implicit storage contracts between
aggregator tools, a vendored pdf.js outside dependency tracking) complete the picture. **No P0 finding.**

## 2. What works exceptionally well and should be preserved

- **Integrity of the published site.** 804/804 pages answer 200; 0 of 1 206 internal link targets fail; every page has
  exactly one `h1`, a meta description, canonical and hreflang links, and the correct `lang` (crawl, 31 Oct).
- **Complete trilingual interface.** 7 207 interface texts, 0 missing in German, 0 in Albanian; the repository's own
  `scripts/check-tool.mjs` and the per-tool translation tests keep it so.
- **Privacy by construction, with one open exception.** CSP with hashed inline scripts
  (`src/_includes/layouts/base.njk:89`), no analytics or third-party script on tool and role pages, newsletter and
  feedback only on writing pages, Google's icon service only in the CV Builder and said so on the Tools page. The
  claim "nothing you type leaves your device" is true of tool data at rest and of every hand-off that uses a browser
  note; since Phase 5B (PR of `feature/phase-5b-private-action-handoff`, November 2026) the generic "Add to actions"
  hand-off uses a note too and its address carries only a random token (P1-02 corrected; the other tool-to-tool
  links that carry typed text are listed under P1-02 and remain open). Backups, sealed files and the PIN lock use AES-GCM with PBKDF2
  (310 000 rounds). Team Sync is end-to-end encrypted.
- **Local-first with real recovery.** Restore points in IndexedDB (daily, before a file replaces anything, every 15
  minutes while working, before a sync), all-or-nothing restores with rollback, "All your work in one file" under every
  tool, a 40 MB cap and shape validation on import.
- **Navigation that explains itself.** Seven places in the header, each with a hover/focus sub-menu that shows what is
  inside; "Start here" for a newcomer; the same three recommended essays on the homepage and on Start here; the mobile
  menu opens with Enter, puts focus inside, closes with Escape, and lists 28 destinations; theme and motion have
  switches that remember the choice; a skip link on every page.
- **Connected operations tools.** Every tool's results offer the same four moves (copy, print, 5 Whys, Pareto or
  control chart where it applies) through one shared function (`tool-kit.js:869`); 48 tools write to one Action
  Tracker through one store API; hand-offs with user text travel inside the browser (`sessionStorage` notes for Pareto,
  the control chart and the CX case), not in addresses; Phase 4A/4B give defects identity, proof and idempotent
  recovery.
- **Writing and tools are tied together both ways.** All 40 essays carry a "Tools for this essay" aside; every tool
  page ends with the essays and field notes behind it; the Challenges page offers a way in by problem.
- **Examples that never masquerade as data.** Tools open on a named example that disappears at the first own entry;
  empty states say what to do ("No actions yet. Add the first one above, send one from any tool, or load an example
  list."); feedback after each save.
- **Testing discipline.** 1 407 unit tests and 216 browser tests (three widths, two themes, axe on 13 pages in three
  languages) run on every pull request; CI fails on any skipped test; every fix of the last phases started with a test
  that failed on the previous commit; formats and thresholds are documented (`docs/DATA-FORMATS.md`,
  `docs/THRESHOLDS.md`).
- **Readable typography.** Body text 19–20 px with 1.5–1.55 line height; 63–72 characters per line on desktop in
  essays, review issues and tools; no horizontal overflow on any of the 216 loads.

## 3. Findings

Severity: **P0** critical security, data integrity or availability; **P1** high-impact usability or functional;
**P2** important improvement; **P3** optional refinement. Complexity: S (hours), M (a day or two, one PR), L (several
PRs). "Confirmed" means reproduced in the browser or shown in code; "Concern" means a risk or a usability judgement
without a reproduced failure; "Idea" means an improvement with no defect behind it.

### P0

None found.

### P1

**P1-01 · Offline copies of tool pages lose their scripts after a deploy** · Confirmed defect · M
- Where: `src/sw.js:28-37` (`put`), `:40-50` (`networkFirst`), `:96-106` (the `keep` message).
- What happens: assets are versioned (`?v=<hash>`). When a newer version of a versioned file is cached, `put` deletes
  every other version of the same path. Pages are refreshed only when visited online, and the `keep` handler skips
  pages that are already cached. So: a shift lead keeps the eight tools of a role offline; a deploy happens; she opens
  one tool online, which caches `tool-kit.js?v=new` and evicts `?v=old`; offline, the other seven cached pages still
  ask for `?v=old`, `cacheFirst` misses, the fetch fails, and the tool page opens without its scripts.
- Reproduction across two deployments (code reading of `sw.js` at `0b995e82`; not run against an installed app, to
  touch no real browser):
  1. Deployment D1 is live. On a phone, open `/tools/room-inspection/` online. `offline.js` asks the worker to keep
     this tool, the other tools of its role and the Tools page (`tests/offline.test.cjs:87` documents the list); the
     worker caches each page and its assets, all at `?v=D1`.
  2. Go offline. Every kept page opens whole. (Expected, and what the feature promises.)
  3. Deployment D2 ships a change to any shared script, say `tool-kit.js`. Back online, open one kept page, say
     `/tools/shift-handover/`. `networkFirst` fetches the new HTML, whose `<script src="/js/tool-kit.js?v=D2">`
     triggers `cacheFirst` → miss → fetch → `put`, and `put` deletes `tool-kit.js?v=D1` (`sw.js:33-36`: same
     pathname, different search). The other kept pages were **not** refreshed: `keep` skips any page already in the
     cache (`sw.js:102`, `cache.match(href, { ignoreSearch: true })`), and nothing re-fetches them.
  4. Go offline again. Open `/tools/room-inspection/`: the cached HTML of D1 asks for `tool-kit.js?v=D1`;
     `cacheFirst` misses (deleted in step 3), `fetch` fails offline, the script request errors, and the page renders
     without its tool (the checklist never appears; `room-inspection.js` returns at `if (!window.ToolKit) return`).
     The same for every shared script and for `styles-tool.css?v=D1`, so the page is also unstyled.
  5. The state heals only when each kept page is opened online once (or the cache is cleared). Nothing tells the user
     why; the page simply opens empty offline.
- Regression-test coverage, as it stands: `tests/offline.test.cjs` checks the manifest, the registration call, the
  `keep` list, `isVersioned`, `KEPT`, `PRECACHE` and `assetsOf`. **Nothing exercises `put`'s eviction, `cacheFirst`'s
  miss path, `networkFirst`'s offline fallback or `keep` against an already cached page.** No browser spec installs
  the worker (the fixtures abort outside requests and the test server runs one build, so a two-deployment scenario
  needs a second build directory). This is the gap Phase 5A must close first (see the proposal).
- Impact: exactly the offline use the worker exists for, on the day after every release, for every tool page a device
  kept but did not reopen online. Severity kept at P1 by the review: an availability defect of the offline feature,
  not of the live site.
- Correction (candidates, decided in Phase 5A): evict an old asset version only when no cached document still
  references it; or on each `keep` and on `activate` re-fetch the cached documents (`ignoreSearch`) before evicting;
  or keep the last two versions of each path. Each needs the regression test above and a migration note for caches
  built by today's worker.
- **Status (Phase 5A, Draft PR [catalyst-al/stiven-catalyst#371](https://github.com/catalyst-al/stiven-catalyst/pull/371), commits `b0887a0b`, after the round-3 audit `27046d52`, after the round-4 audit `27dd6231`, after the round-5 audit `e601345d` and after the round-6 audit `aa98f487`):** implemented as reference-aware retention with an index,
  batched collection, atomic refresh and one lock (`docs/audit/2026-10-31-phase-5a-proposal.md` §3 and §10). The
  regression tests fail on `0b995e82` (5 of 10 unit scenarios; the browser spec at the first offline check after D2)
  and pass on the branch. Awaiting the independent code audit and the owner's approval; not merged.

**P1-02 · The generic "Add to actions" hand-off carries user-entered text in the address** · Confirmed code
behaviour · privacy · S (ID was P2-04 in the first version; promoted by the review)
- Where: `src/js/tool-kit.js:851-868` (`trackerUrl`, `trackerLink`) and `src/js/actions-store.js:222-230` (`link`)
  build `/tools/action-tracker/?action=<title>&source=…&detail=…&owner=…&due=…&check=…&area=…&priority=…`; the
  tracker reads the parameters once and cleans the address with `history.replaceState` (`actions-store.js`,
  `fromParams`). Callers: 37 scripts, among them every tool's shared "Add to actions" button
  (`tool-kit.js:886`), Shift Handover's "To actions" on each open issue (`shift-handover.js:526-530`), Signals,
  Site Compare, the Daily Board. The CX case hand-off was moved to a `sessionStorage` note in Phase 3 for this
  reason (`sc-case-handoff`); the Pareto and control-chart hand-offs use notes too (`tool-kit.js:891, 899`). The
  generic path still uses the address.
- **Confirmed:** the address of the navigation to the tracker contains the action title (up to 300 characters),
  detail, owner, due date, check, area and priority as typed. Verified in code and by opening a hand-off in the
  browser capture (the request line of the navigation carries the text; the address is cleaned after load).
- **Not proven, and not claimed:** that GitHub Pages or its CDN logs query strings or how long it keeps them (the
  owner has no access to those logs; GitHub's documentation does not say); that the browser's global history keeps
  the pre-`replaceState` address (browsers differ; session history is rewritten, the history database may keep the
  first address); that anyone has read such a log. No real-world disclosure was observed or reproduced.
- Why P1 nevertheless: the site promises on the Tools page and in the privacy text that "nothing you type leaves your
  device". A free-text action title ("Guest in 412 complained about …") leaving the device inside an HTTPS request
  line to a third-party host is a breach of that promise by construction, independent of what the host does with
  it. Operational text (room numbers, names of colleagues as owners) is exactly what these fields hold.
- Correction: write the action into a `sessionStorage` note (as `sc-case-handoff` does) and keep only a short,
  meaningless token in the address; keep the address form as a fallback for a link opened later or in another tab,
  with the text omitted when a note exists. Extend `tests/action-tracker.test.cjs` (hand-off arrives through the
  note; the address carries no title) and the 37 callers' tests where they check the link.
- **Status (Phase 5B, `feature/phase-5b-private-action-handoff`, commit `6ab09816`):** corrected. `ToolKit.trackerUrl`,
  `ToolKit.trackerLink`, `ActionsStore.link` and `ActionsStore.linkButton` write the action into one sessionStorage
  note of the tab (`sc-action-handoff`, the last twelve kept) and put a random 16-character token in the address's
  fragment (`#handoff=<token>`), which the browser never sends (no request line, log, referrer or service-worker cache
  key carries it); `ActionsStore.fromParams` reads the note once, removes it, adds the action under the existing
  duplicate rules and cleans the address; a token with no note (a copied link, another browser, storage refused) makes
  the tracker say the action did not arrive instead of opening in silence; a link of the older `?action=` shape is
  still read. No caller changed: every tool goes through the two helpers. Tests: `tests/action-tracker.test.cjs`
  (the privacy proof with fictional operational text in EN/DE/SQ, several pending hand-offs, missing and refused
  notes, the older shape), `tests/tracker-links.test.cjs`, `tests/browser/action-handoff.spec.mjs` (the real
  navigation requests and the offline copy hold no typed word; a tab opened with Ctrl-click or a middle click gets the
  "did not arrive" message, nothing added, nothing leaked; a reload; DE and SQ). The
  unavoidable limitation: links of the older shape that already exist (bookmarks, history, logs written before the
  change) still carry their text; nothing can recall them. **Other links that still carry typed text, out of this
  phase's scope and recorded for a decision:** 5 Whys → Shift Handover (`?issue=&owner=&due=`), the result buttons,
  the Daily Board, the A3 Report, Andon, the CX Control Tower, 8D and Hoshin Kanri → 5 Whys (`?problem=`), the
  Action Tracker → 5 Whys (`?problem=`), Hoshin Kanri → A3 (`?problem=`), and the `?q=` of Search.
- Phase 5A implication (recorded for 5B, PR #371 round 4): the service worker's reference index keys cached pages by
  their full address, query included, so a tracker page kept under a hand-off address holds that address, text and
  all, in its cache key (as before Phase 5A) and in the index entry. Both go with the page's cached copy and with
  "Forget everything on this device"; nothing leaves the device through them. The 5B note hand-off removes the text
  from both at once (proposal §12).

**P1-03 · The Tools page cannot be searched or narrowed, and is thirty phone screens long** · Confirmed (measured) ·
usability · M
- Evidence: `/tools.html` at 390 px is 24 914 px tall (≈30 screens); 59 tools in four role sections; the only
  navigation is four role cards that scroll to their section (works, measured `scrollY 4790` after the Zenith card);
  no filter or search field on the page; the header search covers tools but lives on another page; the Challenges
  page offers 14 of the 59 tools by problem.
- Impact: a new visitor who does not yet think in roles must scroll; an experienced user looking for one tool by name
  scrolls or opens Search and comes back. Desktop is better (four columns) but the list is the same length.
- Recommendation (review decision: smallest effective improvement first, no structural redesign): **(a) only** as
  the first step: a filter field at the top of the Tools page that narrows the existing cards by name, type and
  summary, the same mechanism `js/filter.js` already gives Field Notes and Reflections; no new page, no change to the
  four role sections, measurable by the time to reach a named tool. Only if the owner still finds the page long after
  (a): (b) role sections collapsed on phones with the count and the first three tools behind "Show all", S/M; and
  only after that (c) a "By problem" strip reusing the Challenges mapping, M.
- **Status (Phase 5C, `feature/phase-5c-tools-filter`):** (a) implemented; (b) and (c) not started. A filter field at
  the top of the Tools page in EN, DE and SQ (`partials/tool-filter.njk`, `js/tool-filter.js`; `js/filter.js` and the
  Field Notes filter unchanged): name, type and description, capitals, accents, hyphens and ß not counting, every
  word required, a tool named by the words first, empty roles hidden, the count announced, Escape and a clear button,
  nothing sent, stored or put in the address, the page unchanged without scripts. Measured at 390 px: the CV Builder
  from 56 cards and 21 390 px down (25.3 screens) to the first of three cards after two keystrokes, its card starting
  at 746 px; Night Audit and Pareto 80/20 first after two and three keystrokes in every language. Measurements, tests
  and limitations: `docs/audit/2026-11-03-phase-5c-report.md`.

### P2

**P2-01 · German and Albanian tool pages download the whole interface dictionary** · Confirmed (measured) · M
- Evidence: `/de/tools/room-inspection/` cold first visit transfers 379 KB in 26 requests, of which `js/ui-de.js` is
  146 KB compressed (454 253 B raw); the same page in English is 230 KB. `ui-sq.js` is 149 KB compressed. The file is
  loaded on all 59 DE and 59 SQ tool pages (`base.njk:147-149`) and holds the 7 910 keys that appear in any script
  (`eleventy.config.js:131-144`), although each page needs a fraction. It is hash-versioned and cached, so the cost is
  paid once per release per device, but on a hotel phone on mobile data that first visit after each release is the
  largest single asset of the site.
- Correction: emit one strings file per tool page (the build already knows which scripts a page loads; filter the
  keys by those scripts) and keep a small shared file for `tool-kit.js`. No change to how `tx()` reads them.

**P2-02 · One stylesheet for all 59 tools on every tool page** · Known (PM-14, decision pending) · measured · M
- Evidence: `styles-tool.css` 449 665 B raw, 81–82 KB compressed, linked by every tool page and role page; the
  splitter (`lib/css-split.js`) already produces one sheet per page kind (home 25 KB, essay 25 KB, page 33 KB,
  reader 28 KB compressed), so the mechanism for a per-tool sheet exists. Listed here only with the measured numbers;
  the decision is the owner's.

**P2-03 · A tool page is seventeen phone screens long; the tool is the first third** · Confirmed (measured) ·
usability · M
- Evidence: `/tools/room-inspection/` at 390 px is 14 015 px tall; `/roles/shift-lead/` 15 282 px; the sequence
  below the tool is coaching bridge, "From the essays", the tool guide, feedback, "All your work in one file", "More
  from this orbit" (`base.njk:230-236`). `js/tool-fold.js` folds some of it; the measured height is after that.
- Impact: a daily user who scrolls to the log or the results passes the tool, not the tail; but the "Send … to
  actions" button and the maintenance tags live in the results, far below the checklist on a phone, and the tail
  doubles the page for anyone reaching the footer or the backup box.
- Correction: on phones, collapse the tail into one "More: essays, guide, feedback, backup" accordion closed by
  default (open on desktop), and give long tools a sticky "Results" / "Log" jump on phones. Measure before and after.

**P2-04 · The German tracker names the Verified status differently from everything around it** · Confirmed
inconsistency, not a functional failure · S (ID was P1-02 in the first version; downgraded by the review)
- Where: `src/_data/de/actionTracker.json` → `statuses.verified: "Bestätigt"`; `src/_data/de/ui.json` uses
  "Geprüft" in 15 places for the same state (the Room Inspection log tags "n geprüft", the tracker's own sentence
  "Geprüft kommt aus einer Nachkontrolle des Zimmers…", the proof line "Im Zimmer geprüft am …").
- What a German user sees on `/de/tools/action-tracker/`: a status select reading *Offen · In Arbeit · Erledigt ·
  Bestätigt*, under it the sentence "Geprüft kommt aus einer Nachkontrolle…", and in Room Inspection "1 geprüft".
  Two words for one state, on the one workflow (Phase 4B) whose whole point is that *Done* and *Verified* differ.
- Albanian is consistent ("Verifikuar" in both files); English is consistent ("Verified").
- Correction: one word in German. "Geprüft" matches the 4B texts and the sense (checked in the room); change
  `statuses.verified` and the four review texts of `de/actionTracker.json` that may use "bestätigt", then the German
  browser spec. Owner's call on the word; the fix is a data change.


**P2-05 · Aggregator tools read other tools' storage by convention, and a renamed field would fail silently** ·
Potential risk, **not reproduced** · M
- Where: Shift Pulse (`src/js/shift-pulse.js:229, 259-262, 449, 454, 509`), Signals (`signals.js:34, 523-530, 543`),
  Operations Report (`ops-report.js:424, 914, 921`), Daily Board, Print Pack, Site Compare build keys as
  `sc-<tool><suffix>` and assume row shapes; rows that fail a filter vanish without a word; the slug lists are repeated
  in `signals.js:34`, `ops-report.js:424` and the `OBJECT`/`LOG` regexes of `work-backup.js:37-39`.
- What was and was not observed: no aggregator showed a wrong number in this audit; no field has been renamed in
  the phases of October; the risk is structural (the contract is implicit) and would surface only after a change in a
  source tool. Mitigation already present: `tests/helpers/tool-page.cjs` runs the real writer and the real reader in
  tests of Shift Pulse, Signals and the Operations Report, so a renamed field in a tool those tests cover would fail
  CI; tools outside those tests would not.
- Correction: one manifest in `src/_data` (key → owning tool, shape version) read by the backup, the aggregators and
  the tests, plus one line in an aggregator's result when entries of a tool could not be read ("3 entries of Room
  Inspection were skipped").

**P2-06 · Accessibility leftovers found by axe and by the keyboard pass** · Confirmed · S each
- **Filter field without a visible focus state** (WCAG 2.4.7): `#filter-search` on `/reflections.html`,
  `/writing.html` and `/field-notes.html` (`[data-filter-search]`, `js/filter.js`). Measured on focus: border colour
  unchanged (`rgb(246,247,244)`), `box-shadow: none`, `outline: none`, at 390, 768 and 1 440 px in both themes (12
  of 12 loads). A keyboard user tabbing into the field sees nothing move. The tools' inputs do change (the CX Tower
  date field turns its border blue on focus); the search page's field has its own style. Correction: the same
  `:focus-visible` rule the tool inputs use (`06-tools.css`), one selector.
- **Label in name on the Room Inspection "Sheet" button in German and Albanian** (WCAG 2.5.3, axe
  `label-content-name-mismatch`, serious, 12 of 12 DE/SQ loads): visible text "Blatt" / "Fleta", accessible name
  "Prüfblatt von Zimmer 110 am 31.10.2026 drucken" / the Albanian equivalent (`src/js/room-inspection.js`, the
  `aria-label` of `[data-print-row]`). English passes because "Sheet" is inside "Print the sheet of room…". This is
  one instance of the accepted "label-content-name mismatch on 7 tools" leftover; it is listed because it sits in
  the tool the hotel uses daily. Correction: start the label with the visible word, or show "Prüfblatt" / "Fletë" as
  the button text.
- **Everything else in the sample passed:** 0 serious or critical axe violations on the other 34 pages in both
  themes at all three widths (204 loads), 0 moderate or minor ones, no horizontal overflow, a skip link and one
  `main`/`header`/`footer` on every page, every visible field labelled, every visible button named (the two
  unlabelled or nameless elements found were a hidden file input and a hidden "resume" chip), the mobile menu button
  present with `aria-expanded` on every page at 390 px.

**P2-09 · The analytics beacon loads and fails on every writing page** · Reproduced failure; cause consistent
with A-01 but not proven · S
- Evidence: on 126 of 216 loads (every page outside the tools and roles, both themes, all widths) the console shows
  `Access to XMLHttpRequest at 'https://cloudflareinsights.com/cdn-cgi/rum' … blocked by CORS policy` followed by
  `net::ERR_FAILED`. The beacon script (`base.njk:258`) loads from Cloudflare, then its measurement request is
  refused because the token is not registered for this hostname, the state A-01 describes ("collects nothing until
  the owner adds a manual site and a new token").
- Reproduced outside the browser, from this container: an `OPTIONS` preflight to `https://cloudflareinsights.com/
  cdn-cgi/rum` with `Origin: https://stivencatalyst.com` answers 200 with `access-control-allow-origin:
  https://stivencatalyst.com`, so Cloudflare does serve CORS for this origin; a `POST` with a synthetic payload
  answers **404 without CORS headers**, which the browser reports as the CORS error seen. The 404 is consistent with
  an unregistered site or token (A-01); it could also be the answer to a payload the endpoint did not recognise (the
  synthetic one was empty), so the cause is **consistent with A-01, not proven** by this audit. Environment caveat:
  the requests left a datacenter through a proxy; the preflight's success shows the path itself is not what fails.
- Impact: no analytics (known), plus a third-party request and a console error on every essay, reflection and
  publication page, and a CSP that allows `static.cloudflareinsights.com` for nothing.
- Correction: the owner's decision, either way one line: register the site in Cloudflare Web Analytics and set the
  new token in `src/_data/site.json`, or empty `analytics.cloudflareToken` until then (the template already drops the
  script and the CSP entries when the token is empty).

**P2-07 · Team Sync: three client-side behaviours a team will meet without warning** · Concern · S/M
- Where: `src/js/team-sync.js:27-32` (deletions beat edits; tombstones 90 days; a device away longer than 90 days
  drops rows the team deleted meanwhile, and keeps nothing it changed itself in between), `:57` (4 MB payload cap →
  status `too-large` with no hint which tool to untick), `:402-486` (`pickRow` keeps one version of a row changed on
  two devices; documented and accepted in Phases 4A/4B).
- Impact: a seasonal device (a winter hotel) that returns after three months; a team whose photos push the payload
  over 4 MB.
- Correction: after a sync, one line "N rows yielded to the team's copy" with a link to the pre-sync restore point;
  on `too-large`, name the two largest tools in the payload. No change to the merge algorithm or the worker.

**P2-08 · Pages longer than 320 KB of HTML** · Confirmed (measured) · S/M
- Evidence: `/guides/tools-guide.html` 373 KB (DE 401 KB, SQ 384 KB) and `/field-notes.html` 325–339 KB of HTML;
  the median page is 70 KB. Field Notes loads 327 KB on a phone every visit (the filter is client-side over the full
  list).
- Impact: slow first paint on a phone on mobile data for two pages a newcomer is sent to ("keep up with a field
  note").
- Correction: Field Notes as a short page plus the full list fetched on demand, or paginated by year; the tools guide
  split per planet (it already has chapters).

### P3

**P3-01 · Helpers re-implemented beside `tool-kit.js`** · Confirmed · S each
- `pad` (two digits) in 12 files (`andon.js:20`, `leader-standard-work.js:21`, `maintenance-planner.js:12`,
  `print-pack.js:16`, `reminders.js:28`, `risk-assessment.js:22`, `site-compare.js:552`, `storage-guard.js:25`,
  `team-sync.js:1135`, `work-backup.js:361`, `pdf-kit.js:198`, `coaching-results.js:14`); `download(name, content,
  type)` in 10 files although `ToolKit.saveBlob` exists (`tool-kit.js:686`); `el()` in 7 files; a whole-euro
  `Intl.NumberFormat` in 9 files while tool-kit exports only the two-decimal `euro` (`tool-kit.js:153`); `clamp`
  twice. No duplicate `debounce` or date helpers were found. Correction: export `pad`, `euroWhole`, `clamp` from
  tool-kit and replace file by file, each behind the existing tests.

**P3-02 · Two dialog styles** · Concern · M
- 8 scripts use `<dialog>.showModal()`; 51 use native `confirm`/`alert`/`prompt` (including the restore confirm,
  `work-backup.js:366`). Native dialogs are keyboard-safe but cannot be styled, translated beyond their text, or
  tested the same way. Not a defect; a consistency choice for the owner.

**P3-03 · Scripts loaded only for their arithmetic** · Confirmed · M
- Shift Pulse loads `room-inspection.js` (52.8 KB raw), `maintenance-planner.js` (54.3 KB) and `lost-found.js` for
  their `*Math` objects (`partials/shift-pulse.njk:56-59`); Print Pack loads nine tool scripts, about 400 KB raw
  (`partials/print-pack.njk:71-80`). Each returns early without its page, so the cost is download and parse only.
  Correction: split each `window.<Name>Math` into its own small file that the tool page and the aggregators share.

**P3-04 · Vendored pdf.js outside dependency tracking** · Confirmed · S
- `src/js/vendor/pdfjs` (4.10.38, 1.8 MB, loaded only on PDF import in `ats-cv.js:638-639`) is not in
  `package.json`, so `npm audit` and Dependabot never see it. Correction: a pinned `pdfjs-dist` devDependency copied
  at build, with `docs/DEPENDENCIES.md` updated.

**P3-05 · Builds are not reproducible and the clock leaks into tests** · Confirmed · S
- `eleventy.config.js:242` (`dayOfCycle`) uses `Date.now()`; 12 test files use the real clock
  (`chart-interaction.test.cjs:20`, `period-totals.test.cjs:21`, `reminders.test.cjs:18`, `note-of-the-day.test.cjs:55`,
  `coaching.test.cjs:273`, …), a midnight or DST run can flake. Correction: a `SOURCE_DATE`/fixed-clock option for
  the build and the `fixClock` helper of `tests/helpers/tool-page.cjs` in those tests.

**P3-06 · `MediaStore.add` has no quota handling** · Concern · S
- `src/js/media-store.js:113-117`: a photo that does not fit throws to the caller; each tool must catch. Photos are
  outside the 4 MB localStorage estimate of `storage-guard.js:20`. Correction: catch once in the store and return a
  result the callers can show, as `ToolKit.write` does for localStorage.

**P3-07 · The company logo lookup is disclosed but not opt-in** · Confirmed · S
- `src/js/cv-builder.js:212` fetches `https://www.google.com/s2/favicons?sz=128&domain=<employer>` while the website
  is typed (with a pause for half-typed hosts); the Tools page and the privacy text say so. Correction, if wanted: a
  "Fetch the logo" button instead of fetching on input, and `img-src https://www.google.com` only on the CV pages'
  CSP.

**P3-08 · Native checkboxes of 13–18 px inside their labels** · Measured · S
- The "Protect the file with a password" checkbox under every tool (13 × 13 px, `work-backup.njk`), the "You may
  quote me" checkbox of the essay feedback (18 × 18 px), and the review reader's page slider (18 px high). The label
  is the target in the first two cases, so WCAG 2.5.8 is met through it; a larger box helps a gloved thumb in floor
  mode. Every other measured control (327 on Room Inspection) is 24 px or larger.

**P3-09 · The homepage is twelve phone screens** · Measured · usability idea · M
- `/` at 390 px is 10 266 px tall (DE 10 660 px): hero and planets, Start here, note of the day, four principles,
  three essays, publications, featured tools, CV, philosophy, newsletter. Each section earns its place on desktop;
  on a phone the second half is rarely reached. Idea: on phones, show the publications and featured tools as one
  row each with "See all", keep the rest.

**P3-10 · The Tools page, Search and Field Notes load a 58 KB decorative image** · Measured · S
- `.page-hero:not(.tool-hero)::after` draws `stiven-catalyst-coaching-hero.jpg` (58 KB) as a masked background
  on every page with a page hero (`src/css/11-reading-and-motion.css:1607-1615`); on `/search.html` it is the largest
  resource of a 124 KB page. Idea: a smaller rendition (the mask hides most of it) or `content-visibility` with a
  lighter placeholder on phones.

**P3-11 · Terminology: "re-check" and "Re-inspection" side by side** · Concern · S
- Room Inspection keeps the older same-day rule's tag "re-check" (DE "Nachkontrolle", SQ "rikontroll") beside the
  new kind "Re-inspection" (DE also "Nachkontrolle", SQ "Riinspektim"). In German both are one word, in Albanian two
  (`de/ui.json`: "Nachkontrolle" 23 places; `sq/ui.json`: "rikontroll" 1, "riinspektim…" 20). Idea: one term per
  language, decided with the owner; the CSV header "Re-check" is part of the export format and should stay.

**P3-12 · The 404 page is English on German and Albanian addresses** · Known (ARCH-01, decision pending) · S
- `/de/diese-seite-gibt-es-nicht/` answers 404 with `lang="en"` and "That page is not here." Listed only to record
  that it is unchanged.

**P3-13 · Each tool partial repeats its own `<script defer>` list** · Concern · S
- 59 partials end with four to nine `<script src=…>` lines (`partials/pareto.njk:156-158`, `room-inspection.njk:
  174-180`, …); a shared macro would make the common set (`tool-kit`, `chart-kit`, `actions-store`, `work-backup`)
  one line and one place to change.

## 4. Area notes (what was looked at, with the judgement)

### 4.1 Structure and navigation (Pulse, Zenith, Lumen, Atlas)
- The planets are real structure, not decoration: `families.json` assigns 16 + 18 + 21 + 3 tools, each tool to one
  planet, three "also" tools visible from a second planet, and the course under Lumen; `/roles/<slug>/` pages give
  each planet its routine, tools and next orbit. The Tools page, the header sub-menu and the homepage all use the same
  four.
- The first-time path is clear and consistent: hero → "Try the tools" / "Read the essays" → Start here (three essays,
  one tool, one field note, the same three essays as the homepage). The Start here page says who writes this before
  asking for anything.
- Where a newcomer can get lost: the Tools page without a filter (P1-03); the difference between "Writing"
  (Insights, Challenges, Reflections, Field Notes) and "Publications" (Management Review, Operational Treatise, From
  the Floor, the book, the tools guide, Downloads) is explained only by the sub-menus; a visitor who lands on a
  Management Review issue sees no "what is this series" line above the issue (the archive page has it).
- Where an experienced user wastes time: reaching a tool's log or results on a phone (P2-03); finding a tool by name
  (P1-03); the search page opens empty with no recent or suggested queries (the placeholder helps).
- Search: one field over essays, reflections, notes, tools, pages and publications of the language; "handover"
  returned 30 results led by the essay, the tool and three field notes in a sensible order; results keep the question
  in the address; the first 30 are shown (documented threshold). The index is 225 KB compressed in English and
  251 KB in German, fetched once per visit of the search page.
- Mobile navigation: measured at 390 px, the menu button is visible, opens by Enter, lists 28 links with sub-pages,
  Tab lands inside, Escape closes; no horizontal scroll on any of the 216 loads.

### 4.2 User experience and visual quality
- Layout and hierarchy are consistent across page kinds: kicker, title, lede, then sections with a kicker and a
  heading; cards share one grammar; the planets' colours carry into the tool pages (`--family`).
- Dark and light themes both pass the serious/critical axe rules on the 36 sampled pages, except the finding in
  P2-06; the light-theme Zenith contrast of 4.28:1 remains the accepted leftover of the 27 October audit.
- Typography: 19–20 px body with 1.5–1.55 line height; 63–72 characters per line on desktop; 36–38 on a phone, which
  is the width, not a fault.
- Forms and feedback: every visible field labelled and every visible button named on the 36 sampled pages (P2-06),
  a status line under each form, undo for removals, examples named as examples; the one focus defect is the filter
  field of the three writing lists (P2-06).
- Loading: no spinner is needed on static pages; tools that fetch nothing render at once; the search index and the
  coaching data are the only client fetches.

### 4.3 Operational tools
- Workflows are connected through one store and shared result actions; the Phase 3 and 4 chains (case → 5 Whys →
  tracker → handover; inspection → defect → tracker → re-inspection → proof) were re-run on the live site on 31
  October (53/53 checks) and are not reopened here.
- Overlap worth a decision, not a defect: five overview tools read the same logs for different audiences (Shift
  Pulse: one shift at a glance; Daily Board: the month in SQDCP calendars and a huddle; Operations Report: the weekly
  or monthly report for a manager; Signals: a ranked morning list of statistical and overdue signals; Print Pack: the
  paper of the team board). Their summaries in `tools.json` state the difference, but the Tools page shows them as
  five cards with similar words. Idea (P3): one "Read your week" card on the Tools page that names the five by the
  question each answers.
- Terminology: statuses are consistent in English and Albanian; German has the "Bestätigt"/"Geprüft" split (P2-04);
  "re-check" and "Re-inspection" coexist (P3-11). Period selectors, example banners, CSV and Excel buttons, and the
  "Copy summary / Print / 5 Whys" row look and behave the same across the tools sampled.
- Night Audit, Damage Control and Incomplete Control share one engine; Shift Handover fills its numbers from them and
  offers "To actions" on each open issue; nothing found here that an earlier audit had not already settled.

### 4.4 Career and editorial experience
- Identity is consistent: the same voice on the homepage, Start here, About and the essays; the author's photo and
  one-paragraph biography on Start here; "Clarity into action." in the footer; the planets and the lamp motif on
  every page kind.
- Discovery of the original work: three recommended essays in two places; every essay links its tools and its field
  notes; the Management Review archive and issue pages, the Operational Treatise volumes and From the Floor are under
  Publications with text versions and a reader; the book has its own page with corrections register. The 47
  reflections are listed as one long page; a reader arriving from an essay has "Reflections" one click away but no
  "if you liked this essay" link to a reflection (SEO-02, deferred editorial decision).
- CV tools: three tools under one "CV" place in the header, one page (`/cv.html`) that explains the three; the
  example CVs are fictional; PDF export is the tools' own. No editorial text was reviewed for content, by instruction.

### 4.5 Technical quality
- Architecture: Eleventy 3, five devDependencies, no runtime library except vendored pdf.js (P3-04), no bundler;
  111 built scripts totalling 5.4 MB raw, each tool page loading a baseline of 18 shared scripts (about 160 KB raw,
  roughly 60 KB compressed) plus its own; CSS split per page kind at build.
- Storage: quota errors caught and reported once (`tool-kit.js:74-99`); unreadable JSON parked, not destroyed;
  16 direct `localStorage.setItem` calls all inside `try` or behind the lock flag; restore points bounded (30 in all);
  `navigator.storage.persist` requested once.
- PWA: pages network-first with an offline page, versioned assets cache-first, `skipWaiting` + `clients.claim`; the
  eviction defect is P1-01; no tool work is cached by the worker, so stale data is not a risk.
- Security: CSP as a `<meta>` tag with script hashes; `style-src 'unsafe-inline'` and `form-action https:` are the
  broad spots (PM-15, pending); no `eval`, `new Function` or `document.write`; `innerHTML` with user data only in the
  coaching workspace, escaped; `postMessage` only page → worker, origin-checked. Team code in plain `localStorage`
  while unlocked is documented.
- Build and tests: 1 407 unit and 216 browser tests; the build scans 4.1 MB of concatenated scripts per key for the
  string tables and rewrites 818 HTML files for the CSS split, which is why a build takes 70–150 s here (P3-05 notes
  the clock).

### 4.6 Multilingual consistency
- 0 missing texts in 7 207; `lang` correct on all 804 pages; the German and Albanian homepages, Tools pages and tool
  pages render the same structure as English at all three widths (screenshots `dark-390-de.png`, `dark-390-sq.png`,
  `*-de_tools_room_inspection.png`, `*-sq_tools_shift_handover.png`).
- Differences found: P2-04 (German status word), P3-11 (two Albanian words for re-inspection), P3-12 (English 404),
  the German and Albanian Room Inspection axe finding in P2-06, and the DE/SQ dictionary weight (P2-01). The English
  search page answers a German word with nothing, which is correct for a per-language index but worth one line in
  the empty result ("Try the German site" when the browser's language is German).

## 5. Measurements (as served on 31 October 2026, compressed bytes as the browser reports them)

| Page (cold, 390 px, dark) | Transferred | Requests | Largest resource |
| --- | --- | --- | --- |
| `/` | 132 KB | 19 | `styles-home.css` 24 KB |
| `/tools.html` | 180 KB | 16 | `stiven-catalyst-coaching-hero.jpg` 58 KB |
| `/tools/room-inspection/` | 230 KB | 25 | `styles-tool.css` 81 KB |
| `/de/tools/room-inspection/` | 379 KB | 26 | `js/ui-de.js` 146 KB |
| `/tools/cx-control-tower/` | 258 KB | 23 | `styles-tool.css` 81 KB, `cx-tower.js` 41 KB |
| `/tools/action-tracker/` | 203 KB | 23 | `styles-tool.css` 81 KB |
| `/insights/the-tools-you-build-yourself/` | 102 KB | 17 | `stiven-headshot.jpg` 29 KB |
| `/search.html` | 124 KB | 11 | `stiven-catalyst-coaching-hero.jpg` 58 KB (index fetched on first query: 225 KB) |
| `/field-notes.html` | 157 KB | 12 | HTML 38 KB compressed (325 KB raw) |
| `/guides/tools-guide.html` | 255 KB | 16 | four Inter weights 95 KB, HTML 87 KB |
| `/roles/shift-lead/` | 194 KB | 16 | `styles-tool.css` 81 KB, `coaching-data.js` 39 KB |
| `/tools/cv-builder/` | 198 KB | 21 | `styles-tool.css` 81 KB |

Page heights at 390 px (full page, after the fold scripts): home 10 266 px, DE home 10 660 px, Tools 24 914 px,
Room Inspection 14 015 px, Shift Lead role 15 282 px.

## 6. Top 10 improvement shortlist (prioritised)

1. **P1-01** Service worker: never evict an asset version a cached page still needs, with the regression test that
   is missing today (Phase 5A proposal). M.
2. **P1-02** Action hand-off through a browser note instead of the address (privacy promise). S.
3. **P1-03** Tools page: a filter field first; collapsed sections only if still needed. S.
4. **P2-04** German: one word for Verified across the tracker and Room Inspection. S.
5. **P2-01** One strings file per German and Albanian tool page instead of the whole dictionary. M.
6. **P2-03** Tool pages: fold the tail on phones and give long tools a results jump. M.
7. **P2-06 + P2-09** The filter field's focus state, the German/Albanian "Sheet" label, and the analytics beacon
   decision. S.
8. **P2-05** A storage manifest shared by backup, aggregators and tests, plus "N entries skipped" lines. M.
9. **P2-08** Field Notes and the tools guide as lighter pages. S/M.
10. **P3-01 + P3-04** Helpers back into tool-kit; pdf.js under dependency tracking. S.

## 7. Roadmap (dependency-aware)

**Quick fixes (one PR each, no architectural change, days):** P1-02 (note hand-off), P1-03a (filter field), P2-04
(German status word, data), P2-06 (axe/focus), P2-09 (beacon, once the owner decides), P3-01 (helpers), P3-04 (pdf.js), P3-05 (fixed clock), P3-06 (MediaStore quota), P3-08
(checkbox size), P3-10 (image rendition). Order: P1-02 (privacy promise) and P2-04 with P2-06 (user-facing, trivial)
in the first week, then the rest as capacity allows.

**Focused functional fixes (one PR, with a failing test first):** P1-01 (service worker eviction). Independent of
everything else; do it before the next release so the next deploy is the first that does not strand offline copies.

**Build and weight work (architectural but incremental, each its own PR, measurable before/after):** P2-01 (per-page
strings) → P2-02 (per-tool CSS, if the owner decides for it; the splitter is the same mechanism) → P3-03 (`*Math`
split, which also shrinks Shift Pulse and Print Pack) → P2-08 (Field Notes / tools guide). P2-01 and P2-02 touch
`eleventy.config.js` and `lib/css-split.js`; do them one after the other, not together.

**Experience work (needs a design decision from the owner before code):** P2-03 (tool page tail), P3-09 (homepage on
phones), the "Read your week" card (4.3), P3-11 (one term for re-inspection), P3-12 (404 in three languages, ARCH-01),
P3-02 (one dialog style).

**Data and sync (small UI, no algorithm change):** P2-05 (manifest + skipped-entries line), P2-07 (post-sync summary,
`too-large` hint).

What not to do, with the earlier audits: no framework, bundler or backend; no change to the planets' rendering; no
change to the merge algorithm or the worker; no rewrite of `cx-tower.js` in one go.

## 8. Quick fixes versus architectural changes

| Quick fix (S, behind existing tests) | Architectural (M/L, new mechanism or build step) |
| --- | --- |
| P1-02 hand-off through a browser note | P1-01 service-worker eviction rule (Phase 5A) |
| P1-03a Tools page filter field | P1-03b/c collapsed sections, "by problem" strip |
| P2-04 German status word | P2-01 per-page string files |
| P2-06 axe and focus leftovers, P2-09 beacon | P2-02 per-tool CSS (pending decision) |
| P3-01 helpers into tool-kit | P2-03 tool page tail on phones |
| P3-04 pdf.js dependency | P2-05 storage manifest |
| P3-05 fixed clock in build and tests | P2-08 Field Notes / tools guide pages |
| P3-06, P3-07, P3-08, P3-10 | P3-03 `*Math` split, P3-02 dialogs |

## 9. Known and accepted items not raised again

Read before this audit and left as the owner decided: the home planets on phones (M-01, final); mouse wheel and
motion (M-06, kept); the rollback limits of the old live site; Team Sync `pickRow` and the 90-day tombstones as
documented in Phases 4A/4B; the old-PWA window after each release; Firefox, Safari and real phones not verified;
Cloudflare Web Analytics collecting nothing until the owner adds a site (A-01); the editorial and Albanian-language
decisions (E-03 … P4-16); PM-13 typography, PM-14 one tool stylesheet, PM-15 CSP/HSTS, ARCH-01 English 404, SEO-02
reflections links, the a11y leftovers of `phase3/ci-a11y.md` (label-content-name mismatch on 7 tools, 7 heading-order
skips, Zenith light 4.28:1, SMED/CoQ dark contrast). Where this audit measured one of them, the number is given with
the reference, nothing more.

## 10. Risks, uncertainties and what was not tested

- **Not tested:** Firefox, Safari, iOS and Android on real devices; screen readers; printing from the live site;
  Team Sync against the live worker; the PWA install and offline behaviour on a real device (P1-01 is a code-level
  finding, reproduced by reading `sw.js`, not by an installed app); Lighthouse or field performance; PDF exports
  beyond the existing tests; the coaching workspace; the newsletter form's provider response.
- **Measured in a datacenter:** bytes and request counts are exact; DOMContentLoaded/load timings were recorded but
  are not reported because they say nothing about a phone on mobile data.
- **Sampling:** 36 pages of 804 in the browser; the crawl covered all 804 by HTTP only. A page kind not in the sample
  (the podcast page, the downloads page, the shelf, the coaching project pages) may hold a finding this audit did not
  see.
- **Judgement calls:** P1-03 and P2-03 are usability judgements backed by measured lengths, not failures; the owner
  may decide the length is the design. P2-04 is a confirmed inconsistency; the right German word is the owner's.
  P1-02 is confirmed as code behaviour; no real-world disclosure was shown, and the report says so.
- **Dependencies between findings:** P2-01 and P2-02 change the build; a mistake there affects every page, so each
  needs the full browser suite and a `diff -r` of `_site` before and after, as `docs/DEPENDENCIES.md` prescribes.
- **Scratch files:** the crawl, capture and interaction scripts and their outputs live outside the repository
  (`/home/user/live-check`, `/home/user/audit-shots`) and are not committed; the screenshots named in this report can
  be reproduced by running the capture script against the live site.

## 11. Working tree and generated files

Checked after the report was written, on `main` at `0b995e82`:

At the time of the audit (before Phase 5A), on `main` at `0b995e82`:

```
$ git status --short
?? docs/audit/2026-10-31-phase-5a-proposal.md
?? docs/audit/2026-10-31-sitewide-ux-review.md
$ git diff --stat
(empty)
$ git status --short --ignored | grep -v "node_modules\|_site"
?? docs/audit/2026-10-31-phase-5a-proposal.md
?? docs/audit/2026-10-31-sitewide-ux-review.md
!! test-results/        (Playwright's ignored output folder from the Phase 4B test runs)
```

**No application source file was changed by the audit**: `git diff` was empty and the only untracked files were the
two audit documents. Nothing was committed, pushed or deployed by the audit. The two documents entered the repository
afterwards with the Phase 5A branch (`feature/phase-5a-offline-reliability`, commit `b0887a0b`, Draft PR
[catalyst-al/stiven-catalyst#371](https://github.com/catalyst-al/stiven-catalyst/pull/371)), together with the one
source change that phase makes (`src/sw.js`) and its tests.

Files this audit generated, all outside the repository except the two documents:

| File | Location | What it is |
| --- | --- | --- |
| Audit report | `docs/audit/2026-10-31-sitewide-ux-review.md` (repository, untracked) | this document |
| Phase 5A proposal | `docs/audit/2026-10-31-phase-5a-proposal.md` (repository, untracked) | the service-worker proposal |
| `crawl.mjs`, `crawl.json` (974 KB), `crawl.out`, `sitemap-urls.txt` | `/home/user/live-check/` | the HTTP crawl of 804 pages and 1 206 link targets |
| `ux-capture.mjs`, `ux.json` (557 KB), `ux.out` | `/home/user/live-check/` | the 216 browser loads: axe, focus, console, weights |
| `cold-weight.mjs` | `/home/user/live-check/` | the cold first-visit weights of §5 |
| `interactions.mjs` | `/home/user/live-check/` | the mobile menu, search, Tools page, typography and target checks |
| `built.txt`, `sitemap-paths.txt`, `not-in-sitemap.txt` | `/home/user/live-check/` | the 818-versus-804 reconciliation of §0.1 |
| 216 screenshots (130 MB) | `/home/user/audit-shots/<theme>-<width>-<page>.png` | one per page, width and theme |

The same folder also holds the Phase 4A/4B build, unit and browser logs and the live-check scripts of those releases
(`chain14-16.*`, `unit*.log`, `browser*.log`, `live-check*.mjs`); they predate this audit and are listed here only so
nothing is hidden. The container is ephemeral: anyone who wants the scratch files kept should say so, and they can be
copied into `docs/audit/2026-10-31/` in the implementation phase.

## 12. Review log

Round 1 (31 October 2026, ChatGPT as independent architect, with the owner):
- P1-01 (service worker) kept at P1; the two-deployment reproduction and the test-coverage gap were added, and the
  Phase 5A proposal written.
- The generic Action Tracker hand-off promoted from P2-04 to **P1-02** (privacy); confirmed code behaviour separated
  from unproven real-world disclosure.
- The German "Bestätigt"/"Geprüft" inconsistency downgraded from P1-02 to **P2-04**: important, not a functional
  failure.
- Tools discovery (P1-03) kept high; the recommendation now names the smallest effective improvement before any
  structural change.
- P2-05 relabelled "potential risk, not reproduced"; P2-09 relabelled "reproduced failure, cause consistent with A-01
  but not proven", with the independent `curl` check and the environment caveat.
- §0.1 added: 804 crawled pages reconciled against 818 built HTML pages (838 written files); the 14 excluded pages
  are intentional.
- §11 added: the working tree, the generated files and the confirmation that no source file changed.
All measurements, screenshots and evidence of the first version are unchanged.

Round 2 (31 October 2026, ChatGPT with the owner): Phase 5A approved for a Draft PR with ten corrections to the
proposal (reference-aware retention over all cached HTML, no `destination` check, no blanket refresh, no repair
through old addresses, atomic refresh, one lock, the message origin test described as it is, collection without a
version limit, and the privacy claims of this report corrected). The proposal's §3 holds the design; its §10 the
results; §1 and §2 of this report now state the Action Tracker exception where they spoke of "nothing leaving the
device" (P1-02 stays open for Phase 5B).

Round 3 (31 October 2026, ChatGPT's independent code audit of PR #371 at `05f26949`): two further offline-integrity
defects reproduced against the worker's code (query variants sharing one index entry; an interrupted index write
leaving stale references) and the lifetime of the loose-record write; all three fixed with the tests that failed on
`05f26949` (proposal §11). P1-01's status line names the corrected commit.

Round 4 (1 November 2026, ChatGPT's independent audit of PR #371 at `6ee3ea4d`): two further problems reproduced
(the upgrade from the production worker deleting a versioned file a script fetched itself, the search index; a keep
for a plain address cached only under a query variant fetching nothing); both fixed with the tests that failed on
`6ee3ea4d`, the first of them an actual old-worker-to-new-worker upgrade (proposal §12). The index's query-bearing
addresses recorded under P1-02 for Phase 5B. P1-01's status line names the corrected commit.

Round 5 (1 November 2026, ChatGPT's independent audit of PR #371 at `5a3343ba`): one regression reproduced with the
production worker followed by the PR's (a cached Search page losing the index version its `data-index` names once a
later build had fetched a newer one); fixed with a reference-only table for lazily fetched files and the test that
fails on `5a3343ba` (proposal §13). P1-01's status line names the corrected commit.

Round 6 (1 November 2026, ChatGPT's independent audit of PR #371 at `6244ce11`): one concurrency regression
reproduced with controlled timing (the index a reopened Search page fetched during its refresh's grace period
collected by another page's visit before the refresh stored the page); fixed by holding the lazy references of a
refresh in flight, with the test that fails on `6244ce11` (proposal §14). P1-01's status line names the corrected
commit.

Release preflight (1 November 2026): CI run 813 on `b4df8961` failed in one browser test of the new offline spec,
whose setup could race the worker's first keep on a slow runner (the worker behaved correctly); the test fixed in
`92bce18e`, no worker change (proposal §14). The dates step dry-run on the merge changes nothing: this branch touches
no essay or publication.

Phase 5B (2 November 2026): P1-02 corrected on `feature/phase-5b-private-action-handoff` (commit `6ab09816`): the Action
Tracker hand-off through a sessionStorage note and a token in the address fragment; the remaining links that carry
typed text listed under P1-02 for a separate decision.

Phase 5C (3 November 2026): P1-03 (a) implemented on `feature/phase-5c-tools-filter` from `main` `41726227`: the Tools
page filter field, with before and after measurements of the time to a named tool
(`docs/audit/2026-11-03-phase-5c-report.md`); (b) collapsed sections and (c) the "By problem" strip left for the
owner's decision after (a), as recommended.
