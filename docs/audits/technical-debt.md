# Technical debt left by the audit of 28 November 2026

What the audit confirmed and deliberately did not change, kept apart from the register
(`docs/audits/full-platform-audit.md`) so it is not lost with the pull request. Each item says why it was left, what
a safe change would need, and what it costs meanwhile. Nothing here blocks the release.

## TD-01 · The offline copy keeps one document per address with its query, and never drops one (SEC-05)

- **Where**: `src/sw.js` (`navigation`, `storePage`, `keep`, `collect`; the bookkeeping in `/__sw/refs`).
- **What happens**: every address a visitor opens is kept as its own document, query included. A tool opened from
  another carries typed words in `?problem=`; search carries `?q=`. The copies are never evicted, so the cache grows
  with every distinct query, and the words stay readable in it while the tools are locked. "Forget everything" now
  clears the cache (SEC-02); a lock does not.
- **Why it was left**: phase 5A designed "a page kept under another query is another document" on purpose, with
  tests that open a page offline under the exact address it was kept (`tests/browser/sw-offline.spec.mjs`,
  `tests/offline.test.cjs`). Changing the key changes every function that reads `refs`, and a visitor's existing
  cache holds entries under the old keys.
- **A safe change needs**: (1) documents keyed by path only, with a lookup that still finds an entry stored under
  the old key (read both, write the new one), so nobody loses a page they kept offline; (2) the old entries removed
  by `collect` once their path has a new one; (3) the two query variants the tests use kept working
  (`?sw-variant=1`); (4) the cache cleared at lock as it now is at "Forget everything"; (5) a rollback note in
  `docs/RELEASE.md`, section 5a. No change of the cache's name: a new name would drop every visitor's offline copy.
- **Cost meanwhile**: storage growth for heavy users of tool-to-tool links; typed words in a place a lock does not
  cover, on that device only.

## TD-02 · A legacy team address is not cleaned up when the answer to its move is lost (TS-07)

- **Where**: `src/js/team-sync.js`, `syncOnce` (the move from the SHA-256 address).
- **What happens**: the copy is written to the new address, the answer is lost, and the old space is never added to
  the list to delete. It stays, at the address a guesser can test with one hash, until it expires (180 days).
- **Why it was left**: three tests say a device that finds the copy at the new address makes no request to the old
  one. The author confirmed on 28 November 2026 that this behaviour stays.
- **Cost meanwhile**: an encrypted copy nobody reads lives up to 180 days longer. It ends by itself: the last
  teams made before the move stop having an old space 180 days after their last write there.

## TD-03 · A whole tool cleared on one device comes back from the team (recorded in #415)

- The merge never drops a storage key one side lacks. Clearing a tool on one device does not clear it for the team,
  and the next sync brings it back. It needs a design of its own (a tombstone for a key), not a fix.

## TD-04 · Rows without an id in five floor logs

- Safety Cross, Damage Control, Incomplete Control, Night Audit Log and Delay Analyzer keep rows without an id. The
  sync now tells them by their content (TS-01), which fixes corrections and removals, with two limits: two rows
  identical in every field count as one for the team, and a device that has not synced since the change brings a
  removed row back once. Giving the rows ids (in `ToolKit.logBook`, with a migration at load) would remove both
  limits and let these logs use tombstones like the others.

## TD-05 · One stylesheet for all tools, one text file per language for all tools (PERF-02)

- A tool page loads 448 KB of CSS and, in German or Albanian, about 530 KB of interface texts, before compression;
  both are cached after the first tool. Measured LCP stays under 0.5 s in the laboratory. Splitting per tool family
  is possible (`lib/css-split.js` already splits by page kind) and worth doing only if field data shows a problem.

## TD-06 · The translation parts differ from `ui.json`

- `src/_data/i18n-parts/*.json` are the snippets tools were delivered with; `ui.json` is what the site uses. 57
  Albanian strings differ between the two today (earlier editorial corrections made in `ui.json` only). The tests
  read some parts. Either the parts are regenerated from `ui.json`, or the tests read `ui.json` and the parts go.

## TD-07 · What only a person or another machine can verify

- Safari on a Mac or an iPhone, and any physical phone: only the WebKit build of Playwright on Linux ran here, which
  is the same engine family, not the same browser.
- A screen reader, by ear.
- The Worker on Cloudflare: alarms after 180 days, the limits under real traffic.
- Field performance (Core Web Vitals from real visits): the site collects none, by its own decision.

## TD-08 · Small things

- `tests/zip-limits.test.cjs` asserts wall-clock time (2 s); it fails on a saturated machine (CI-01).
- The download template of the CX Control Tower (`TEMPLATE_ROWS`) and one Excel sheet name are English in every
  language; the placeholder "YYYY-MM" is not translated; Albanian apostrophes are mixed (straight and curly).
- An inline text link inside a sentence can be 16 px high (the WCAG exception for links in a sentence applies).
- `workers/sync/deploy.mjs` passes the API token on curl's command line, visible to other processes of the same
  machine while it runs.
