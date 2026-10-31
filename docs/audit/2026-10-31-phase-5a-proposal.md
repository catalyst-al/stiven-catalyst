# Phase 5A proposal: offline copies that survive a deploy (service worker asset eviction)

Status: approved for a Draft PR after review round 2 (31 October 2026), with the ten corrections of that round
worked into §3; implementation results are appended in §10 when they exist. Source of
the finding: `docs/audit/2026-10-31-sitewide-ux-review.md`, P1-01. Code read at `main` `0b995e82`.

## 1. The defect in one paragraph

`src/sw.js` caches each tool page a device "keeps" together with its versioned assets (`?v=<hash>`). When a newer
version of a versioned file is cached, `put` (`sw.js:28-37`) deletes every other version of the same path. Pages are
refreshed only when visited online (`networkFirst`, `sw.js:40-50`), and the `keep` message skips pages already in the
cache (`sw.js:96-106`). After a deploy, opening one kept page online evicts the old asset versions that every other
kept page still references; offline, those pages open without scripts and styles until each is reopened online.

## 2. Goal and non-goals

Goal: after any deploy, every page a device kept offline keeps opening whole offline, whether or not it was reopened
online since; the first online visit of any page updates what it can without breaking the rest.

Non-goals: no change to what is cached (pages and their assets only; tool work stays out of the cache), no change to
the precache list, to the manifest, to `offline.js`'s keep list, to the `skipWaiting`/`clients.claim` update policy, to
the CSP, to Team Sync, to the worker on Cloudflare, or to any tool. No new library. No "new version available" UI
(a separate decision, not needed for this fix).

## 3. Design (revised after review round 2)

The review's ten corrections (31 October 2026) change the design from "reference-counted eviction in `put`" to a
**reference index with batched collection, atomic page refresh and a single lock**. The principles, each tied to a
review point:

1. **Reference-aware retention (R1).** A versioned asset (`?v=`) is deleted only when no cached HTML document
   references it. References are kept in an index entry inside the same cache (`/__sw/refs`, a JSON map
   `pathname → [asset URLs]`), written whenever a document is cached, and rebuilt from the cached HTML for any
   document that has no entry (migration, or a worker stopped between two writes).
2. **All cached HTML counts (R2, R3).** The index is not bounded to the kept list: `networkFirst` caches ordinary
   navigations too, and they are indexed the same way. A cached entry is treated as a document by its address (a
   path ending in `/` or `.html`) and, when in doubt, by the `Content-Type` of the cached response, never by
   `Request.destination`, which is empty for requests stored from URL strings.
3. **No eviction in `put` (R9).** `put` only stores. Collection runs as one batched job after a document is cached
   or refreshed and once on `activate`: read the index, list the cache's keys, delete the versioned assets no
   document references. Cost per run: one `keys()`, one index read, set arithmetic, and the parse of documents that
   have no index entry (none in steady state). Individual asset requests (`cacheFirst`, `staleWhileRevalidate`)
   never scan the cache.
4. **Selective repair, controlled refresh (R4).** The `keep` message no longer skips cached pages blindly, nor
   refreshes them all: a kept page that is not cached is fetched; one that is cached but **incomplete** (an asset of
   its index entry missing) is re-fetched whole; one that is cached and complete is left alone, even if newer HTML
   exists, because it still works offline with the assets it references. Stale pages are refreshed when they are
   visited online (see 6), one page per visit, nothing else.
5. **Never repair with old addresses (R5).** A repair never fetches an asset address taken from an old cached page
   (`?v=D1` fetched after D2 returns D2 bytes). Repair and refresh always start from freshly fetched HTML and fetch
   the asset addresses that HTML names, so HTML and assets match.
6. **Atomic refresh of a cached page (R6).** When a page that is already cached is visited online, the network
   response is returned to the browser at once (as today), but the cached document is **not** overwritten inline.
   A refresh job then collects every asset the new HTML names: from the cache if the browser's own requests already
   stored it, else fetched. Only when all assets are present is the new document written and indexed; if any asset
   fails, the previous complete document and its assets stay untouched (the assets already stored are harmless and
   are collected later if nothing references them). A page with no cached copy is stored at once, as today: there
   is nothing complete to protect.
7. **One lock (R7).** Every job that deletes or writes in several steps (first-time document store, refresh, keep,
   collection, the `activate` reconciliation) runs through one promise chain in the worker, so two refreshes, or a
   refresh and a collection, never interleave. Asset stores from `cacheFirst` run outside the lock; they delete
   nothing. The one race that remains, a collection running between the moment the browser receives new HTML and
   the moment the refresh job has read it, is closed by reading the HTML and recording its assets as *pending*
   before the response is handed to the browser; collection spares pending assets.
8. **Garbage collection without a version limit (R9).** No "keep two versions" rule: an old version lives exactly
   as long as a cached document names it, and is deleted at the next collection after the last such document is
   refreshed or dropped.
9. **The message handler's origin check (R8).** Today the worker checks the **origin of each requested URL** in the
   `keep` message against its own, not `event.origin`. That stays; the tests describe it as it is.

What does not change: the cache name `sc-offline-v1`; the precache; `networkFirst` for navigations with the offline
page as the last fallback; `cacheFirst` for versioned and `staleWhileRevalidate` for unversioned files; the
`skipWaiting` + `clients.claim` update policy; the registration and keep list in `offline.js`; the reminders part of
the worker; anything outside the worker (tool data, PIN lock, backups, Team Sync, CSP).

Options considered and not taken: eviction inside `put` with a reference check (a cache scan on every asset
request; rejected by R9); "keep the last two versions" (breaks after two deploys; rejected by R9); a cache per build
(a new layout and a migration; out of proportion).

## 4. Acceptance criteria

1. **D1 → D2:** after D2 and after reopening one kept page online, every other kept page opens offline with its
   scripts running (`window.ToolKit` and the tool's own `*Math` object defined, the tool's first field present) and
   its stylesheet applied (the tool stylesheet is among `document.styleSheets` with rules, and a rule only it sets is
   in effect), with no failed request for a `?v=` asset.
2. **D1 → D2 → D3:** the same holds after a second deploy that changes another shared asset.
3. **Two pages, one asset:** refreshing one of two cached pages that share an asset version keeps that version
   until the other is refreshed too; then it is collected.
4. **Partial failure:** a refresh whose asset download fails leaves the previously complete document and its
   assets untouched and serves them offline.
5. **Offline keep:** a `keep` message while offline deletes nothing and changes nothing.
6. **Concurrency:** two refreshes and a collection started together end with every cached document complete.
7. **Cleanup:** after the last document naming an old version is refreshed, that version is gone at the next
   collection; versions still named stay.
8. **Migration:** a cache built by today's worker (documents whose assets were evicted) is indexed on `activate`,
   serves its documents offline as before, and is repaired on the next `keep` (kept pages) or the next online visit
   (any page) without fetching old asset addresses.
9. **Overhead:** per online navigation, the extra network requests are only the assets of that page the browser
   did not request itself (normally none); per `keep`, only incomplete or missing pages are fetched; collection does
   one `keys()` per document update. Measured in the tests and reported.
10. Today's four `tests/offline.test.cjs` tests pass with their wording updated where behaviour changed (a kept page
    that is cached and complete is still not fetched again); the full unit suite and the six browser projects pass.

## 5. Regression scenarios and the tests that encode them

Unit tests (`tests/sw-eviction.test.cjs`) run the worker's functions against a fake Cache API and a fake network
that serves "builds": each build is a map of address → body, versioned assets by their `?v=`, pages naming them.

| # | Scenario | On `0b995e82` | After |
| --- | --- | --- | --- |
| T1 | P1 and P2 cached naming `a.js?v=1`; P2 refreshed to a build naming `?v=2` | `?v=1` deleted while P1 names it | `?v=1` kept |
| T2 | then P1 refreshed too | — | `?v=1` collected |
| T3 | D1 → D2 → D3, three shared assets, one kept page reopened online per deploy | other kept pages broken offline | every kept page complete offline after each deploy |
| T4 | `keep` with a cached but incomplete page | skipped | re-fetched from fresh HTML; no old `?v=` address fetched |
| T5 | `keep` with a cached complete page | skipped | skipped (no network) |
| T6 | `keep` while offline (fetch rejects) | — | nothing deleted, nothing changed |
| T7 | refresh with one asset failing | — | old document and assets intact |
| T8 | two refreshes and a collection started together | — | both documents complete, no shared asset lost |
| T9 | migration: cache of the old worker with evicted assets | — | indexed on activate; repaired on keep from fresh HTML |
| T10 | `keep` message: a URL of another origin | ignored | ignored (the URL's origin is checked, not `event.origin`) |
| T11 | cost: counts of `keys()`, `match()` and `fetch()` per operation | — | reported, bounded as in criterion 9 |

Browser spec (`tests/browser/sw-offline.spec.mjs`, the 1 440 px light project): a spec-local static server with a
switchable overlay serves build D1 (the real `_site`), then D2 (an overlay with a changed `tool-kit.js` and the
pages that name it rewritten to its new version), then D3 (a changed `styles-tool.css`). Each test runs in its own
browser context with its own storage. It registers the real worker from `/tools/room-inspection/`, waits for the
keep, goes offline and checks the kept pages; switches to D2, goes online, opens one kept page, goes offline and
checks the others (criterion 1); the same for D3 (criterion 2); and counts the requests the server saw in each step
(criterion 9). The same spec, pointed at the worker of `0b995e82` through an environment variable, fails at
criterion 1: that is the proof the defect was reproduced in a real browser before the change.

## 6. Backward compatibility

- Cache name unchanged; nothing dropped on update. The first `activate` of the new worker indexes the cached
  documents and collects only versions no document names. Documents the old worker left incomplete keep serving
  offline as they do today and are repaired at the next keep or online visit.
- The index entry is an ordinary cache entry under a path no page requests; an old worker that is reinstalled by a
  rollback ignores it.
- No change to the versioning scheme, the build, the deploy, `offline.js`, or any page.
- Storage grows only while two cached pages name different versions of an asset; it shrinks at the next collection
  after a refresh.

## 7. Rollback

- Reverting the merge commit restores today's worker at the next online load (`skipWaiting`). The cache stays
  valid for either worker; the index entry is ignored by the old one.
- The failure mode of the new worker is the same as today's when the cache misses online: the page comes from the
  network. There is no clear-cache button; the browser's site-data clearing remains the last resort and also removes
  tool work unless backed up, which is why the browser spec and the manual phone check run before the merge.

## 8. Effort, order and what is out of scope

- Effort: M. One PR, with the failing tests first (T1, T3, T4 and T9 fail on `0b995e82`; the others guard
  behaviour that must stay), then the change, then the browser spec, then the docs (`README.md` offline paragraph,
  `docs/DATA-FORMATS.md` is not affected, the release note).
- Order inside Phase 5: 5A (this) first, because every later deploy strands offline copies until it ships. The
  privacy hand-off (P1-02) is independent and can run in parallel as 5B; the Tools filter (P1-03a) as 5C.
- Out of scope, deliberately: a "new version available" prompt, caching tool work, a cache-size display, a clear-cache
  button, any change to the Team Sync worker or Cloudflare. Each would be its own decision.

## 9. Open questions for the owner

1. Should the `keep` refresh (option B element) run on every tool visit, or only once per day per device, to spare
   mobile data? (Proposal: once per worker lifetime per page, which in practice is once per visit to the site.)
2. Is the two-build browser spec worth the test-server change, or is the unit-level fetch-handler test enough for the
   first release? (Proposal: the spec, because the defect is in the interaction of real cache semantics.)
3. Is a visible line on the Tools page ("Offline copies: N pages, updated …") wanted later? Not part of 5A.

## 10. Implementation results (branch `feature/phase-5a-offline-reliability`, Draft PR __PR__)

Commit __SHA__ on `main` `0b995e82`. Files: `src/sw.js` (the offline part rewritten between the `PHASE5A` markers;
the reminders part, the precache, the fetch routing and the message shape unchanged), `tests/sw-eviction.test.cjs`
(new, 10 tests, 11 scenarios), `tests/browser/sw-offline.spec.mjs` (new, 2 tests), `tests/browser/playwright.config.mjs`
(the spec in the 1 440 px light project only), `README.md`, `docs/RELEASE.md` (§5a), this proposal and the audit
report (P1-01 status, §11, §12). No change to `offline.js`, any tool, the CSP, Team Sync, the PIN lock or the backups.

### Regression evidence

- **Unit, before:** the final `tests/sw-eviction.test.cjs` run in a worktree at `0b995e82` (the old `src/sw.js`):
  **5 of 10 fail**: T1/T2 (the shared version is evicted while a page names it), T3 (kept pages broken offline after
  D2), T4/T5 (an incomplete kept page is skipped), T7 (a failed download does not protect the complete copy), T9 (no
  index, no repair). T6, T8, T10, T11 and the precache test pass on both and guard what must stay.
- **Unit, after:** 10 of 10 pass; with `tests/offline.test.cjs` and `tests/reminders.test.cjs`, 25 of 25.
- **Browser, before:** `tests/browser/sw-offline.spec.mjs` with `SW_JS` pointing at the worker of `0b995e82` fails
  at the first offline check after D2: `/tools/room-inspection/: tool-kit.js ran · expected true, received false`
  (the page served from the copy, its script evicted). The run is in `/home/user/live-check/sw-spec-before.log`.
- **Browser, after:** both tests pass (D1 → D2 → D3 with one page reopened per deploy; repair of a damaged kept page
  from fresh HTML with the complete page not fetched again), 2 of 2, about 18 s.

### What the browser spec checked, exactly

A spec-local server serves `_site` as D1, then an overlay with `js/tool-kit.js` changed (a marker appended, a new
hash in every page that names it) as D2, then an overlay with `styles-tool.css` changed (a marker rule) as D3;
"offline" is the server closed, so the worker's own fetches fail. In one fresh browser context: register the real
worker from Room Inspection, wait for the keep (the index names the page and the role's tools), go offline, open the
page and three kept tools: `window.ToolKit` present, the tool stylesheet in `document.styleSheets` with its rules,
the tool's first field and heading drawn, no failed `?v=` request. Online with D2, reopen one kept tool (it runs the
D2 script), wait for its refresh to be indexed, go offline: the two pages never reopened open whole with their D1
files, the reopened one with D2. Online with D3, reopen another (it has the D3 rule), go offline: three pages, three
sets of files, each whole; the D3 rule is in effect only on the D3 page. The cache then holds exactly two versions of
`tool-kit.js` (D1 for the pages never reopened, D2 for the reopened ones): nothing leaked, nothing lost.

### Measured overhead

- Unit (`T11`): one `keys()` per page update; `keep` over four complete pages makes **0** network requests;
  100 served file requests list the cache **0** times. At scale, with 212 entries in the copy (200 ordinary pages),
  one page update costs 1 `keys()`, 9 `match()` and 0.8 ms of logic in the fake (no I/O).
- Browser (one run): D1 first visit 80 requests (60 versioned files, 12 pages: the page, the keep of 10 tools and the
  Tools page; the page itself is fetched twice on the very first visit, once by the browser before the worker
  exists and once by the keep that stores it). D2 with one page reopened: 22 requests, of which the reopened page,
  its one new file (`tool-kit.js` D2) and 8 pages of its own "More from this orbit" list that had not been kept
  before (a keep from another tool of the role names other tools); **no complete kept page was fetched again**. D3
  with one page reopened: 4 requests (the page, its one new file, two unversioned files). The refresh adds no request
  for a file the browser already asked for: the job waits 1.5 s and takes those from the copy.
- Storage: two versions of a shared file coexist only while two cached pages name different builds.

### Known limitations

- A page the old worker left incomplete opens offline with what it has (as today) until its next keep or online
  visit; the first `activate` of the new worker fetches nothing, by design (no network cost at install).
- A kept page that is complete but stale is not refreshed by a keep; it is refreshed when visited online. A device
  that only ever opens one tool keeps the others at the build it kept them, whole.
- Files a script loads itself (pdf.js in the ATS CV, `media-store.js` from the backup) are not named by any page:
  the latest version fetched is kept, older ones collected. Offline, such a file is there only if it was fetched
  online before, as today.
- The index is one JSON entry; a worker stopped between a page store and the index write leaves a page the index
  does not know, which the next reconciliation parses once. The cost of that parse is bounded by the cached HTML.
- Playwright's offline switch does not reach a worker, so the spec closes its server instead; CI runs the spec in
  one project (1 440 px light).

### Build and test results

On the final code of the branch, full production build:

| Step | Result |
| --- | --- |
| `npm run build` | 838 files written (818 HTML pages), no error |
| `npm test` | **1 417 pass, 0 fail** (1 407 of `main` + the 10 worker tests) |
| Six browser projects (390/768/1 440 × dark/light) | **218 pass, 0 fail**, 17.5 min (216 of `main` + the 2 offline tests) |
| Focused: `tests/sw-eviction.test.cjs` + `tests/offline.test.cjs` + `tests/reminders.test.cjs` | 25 pass |
| Focused: `tests/browser/sw-offline.spec.mjs` (1 440 px light) | 2 pass; with `SW_JS` at the worker of `0b995e82`: fails at the first offline check after D2 |
| CI | see the Draft PR: reported only once it has finished |
