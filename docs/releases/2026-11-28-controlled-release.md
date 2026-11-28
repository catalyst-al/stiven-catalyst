# Controlled production release, November 2026: the log

The durable record of the release of pull request catalyst-al/stiven-catalyst#424 and of the Team Sync Worker. Each
gate is filled in when it is passed, with what was actually done and seen. Nothing below a gate happens before the
author says so for that gate. The plan this log follows: `docs/SYNC-WORKER-MIGRATION.md`, section 7.

Decisions of the author (28 November 2026):
- Team Sync consent: **#414** (every tool unticked, explicit selection). #415 is not merged, and is closed once
  #414 is confirmed.
- Albanian: "ti" in interfaces and practical instructions; "ju" in communications to guests, customers and
  institutions; authored articles and editorial prose stay; the Shift Handover's practical guide is harmonized.

## Gate 0 · Preflight (done, 28 November 2026; nothing was changed in production)

| What | Found | How |
| --- | --- | --- |
| `main` | `198b83b4` (the merge of #423), unchanged since the audit began | `git fetch` |
| #424 | open, not a draft, mergeable ("clean"), 0 commits behind `main` | GitHub |
| Open pull requests | #424; #418 (draft, test only); #414 (consent, chosen); #415 (draft, consent, not chosen) | GitHub |
| #418 against #424 | changes one file, `tests/browser/a11y-pages.spec.mjs`, which #424 does not touch; merges into #424's head without a conflict | `git merge-tree` |
| The repository's merge style | merge commits ("Merge pull request #…"), no squash, no rebase | `git log --merges`, `docs/RELEASE.md` |
| Cloudflare account | `6bf56de63354f2b14587870ee30941f9`, the one `workers/sync/deploy.mjs` names | read only, through the API |
| Worker name and address | `stiven-catalyst-sync`, `https://stiven-catalyst-sync.stivenjanaqi1.workers.dev` (the address in `src/_data/site.json` and in the pages' Content Security Policy) | the same; `GET /` answers `{"service":"stiven-catalyst-sync","version":1}` |
| Worker live now | version `cc107fc4-5863-49e6-af56-c17948fac8a7` (number 2), deployed 24 October 2026 17:33 UTC | `…/deployments` |
| Rollback target | the same version, still listed among the Worker's versions (with `a83f1476-…`, number 1) | `…/versions` |
| Worker settings | one binding, `SPACES` (Durable Object); no variables; compatibility date 2026-09-14 | `…/settings` |
| The Worker to deploy | `workers/sync/worker.js` as on #424, unchanged since commit `3bf589fa`; SHA-256 `de647fcb1b6c55f0c96ec1c484165c16fd2b283230006d3333b9825d7549ae0e` | `sha256sum` |
| That file in Cloudflare's runtime, locally | 25 of 25 again on 28 November (upgrade over storage of the live version, token rules, deleted-space rule, rollback and forward) | `workers/sync/local-check.mjs` |
| GitHub Pages deployment | the workflow publishes `refs/heads/main` only (in #424; on `main` today a manual run on another branch would still reach the deploy job, held only by the environment's own rule) | `.github/workflows/deploy.yml` |
| Branch protection, required checks, the `github-pages` environment's branch rule | **not readable from this session** | to check by hand, below |
| Working tree | clean, in step with the remote | `git status` |

The release candidate, verified from an empty `_site` at `3176953f`:

| Check | Result |
| --- | --- |
| `npm run build` | passes |
| `npm test` | 1 546 tests, 1 546 pass, 0 fail, 0 skipped |
| `node scripts/check-coaching-build.mjs` | 54 pages, 9 journeys pass |
| `node scripts/seo-audit.mjs` | 911 pages, 894 indexable, 0 errors, 0 warnings |
| `npm run test:browser` (Chromium) | 321 passed, 0 failed |
| CI on `3176953f` | `build` success, `deploy` skipped (a pull request never publishes) |
| The journeys that do not depend on Chromium, in Playwright's WebKit 27.2 and Firefox 157 (not Safari, not a phone) | 191 of 198 and 195 of 198 |

What still fails in the other engines, none of it a fault of the site that could be shown: the offline handover test
(Firefox, 3: the test switches the browser offline, which does not reach a service worker there); a turn of the wheel
and a programmatic scroll that these builds animate themselves (WebKit, 4); the footer-clearance test whose timing
#418 corrects (WebKit, 2); the team sync journey through the test's fake server, which WebKit does not hand over while
a service worker controls the page (1; the same path without the service worker passes in the three engines).
Corrected since the audit's closure: a focused field under the share button (WebKit, was 3), and the reason given
when a window without lasting storage refuses a photo.

To check by hand before the merges (GitHub, the repository's Settings):
1. **Environments → `github-pages` → Deployment branches and tags**: "Selected branches and tags", with `main` as
   the only entry.
2. **Branches** (or **Rules → Rulesets**), the rule for `main`: "Require a pull request before merging" on;
   "Require status checks to pass" on, with the check **`build`** required; "Allow force pushes" off; "Allow
   deletions" off.
3. **Actions → General → Workflow permissions**: "Read repository contents and packages permissions".

## Gate 1 · The Worker (done, 28 November 2026; authorized by the author for this gate only)

| Step | What happened |
| --- | --- |
| Before | `workers/sync/deploy.mjs` hardened as the author asked (commit `436f0172`): it uploads only when the Worker is confirmed to exist with its `SPACES` binding and nothing else an upload would remove; an unreadable answer stops it; a first install (the migration that creates the Durable Object class) needs Cloudflare's own "does not exist" and `SYNC_FIRST_INSTALL=1`. Both ways of stopping were run first (an account that cannot be read; a wrong expected hash): nothing uploaded, the live version unchanged. |
| A space for the proof | with the Worker of 24 October still live, a made-up space was written through the public address (revision 1, made-up bytes), to be read again after the upgrade. |
| Deployed | 16:03:35 UTC, from commit `436f0172`, `SYNC_EXPECT_SHA256=de647fcb…ae0e node workers/sync/deploy.mjs`. No migration was sent. |
| The version live now | **`eb696f36-eb10-42e7-b860-59a0ca402cfc`** (number 3), deployment `69c0e675-d182-4e5b-9867-df41e1a80f24`, at 100 %. The script read back equals `workers/sync/worker.js`. |
| Unchanged | the binding `SPACES` to the class `Space`, the same Durable Object namespace (`e7c5f649…bc2`), compatibility date 2026-09-14, the `workers.dev` address. |
| Way back kept | version `cc107fc4-5863-49e6-af56-c17948fac8a7` (number 2) is still listed; Cloudflare → Workers & Pages → `stiven-catalyst-sync` → Deployments → that version → Rollback. |

Smoke tests against production, 16:04 UTC, made-up ids and tokens (64 hex characters each), `Origin:
https://stivencatalyst.com` unless said: **25 of 25**.

| Check | Answer |
| --- | --- |
| `GET /` | `{"service":"stiven-catalyst-sync","version":1}` |
| The space written before the upgrade | 200, revision 1, the same bytes; CORS for the site |
| An unknown space | 404, with CORS |
| `Origin: http://localhost:8080`; another site | 403; 403 |
| `PUT` without a token | 401 |
| `PUT` with token 1 (create) | 200, revision 1 |
| `PUT` and `DELETE` with token 2 on that space | 403; 403 |
| A stale revision; a second write at once; 5 MB | 409; 429; 413 |
| `PUT` with token 1 again | 200, revision 2 |
| `DELETE` with token 1; `GET` | 204; 404 |
| **`PUT` with token 2 where the copy was deleted** | **403** (the Worker of before answered 200: the fault TS-03) |
| `DELETE` with token 2 on the deleted space | 403 |
| `PUT` with token 1 there | 200, **revision 3** (the revisions go on) |
| The space written before the upgrade: token 2; its own token | 403; 200, revision 2 |
| A space that never existed, `DELETE` with any token | 204 |
| Clean up | both test spaces deleted with their token; both read 404 |

The published site (`main` at `198b83b4`, unchanged) against the new Worker, in Chromium, 16:04 to 16:05 UTC: the
page's own sync code, a made-up team code, two browser contexts, two made-up actions.

| Step | Result |
| --- | --- |
| The address the live page calls | `https://stiven-catalyst-sync.stivenjanaqi1.workers.dev` |
| Device 1 starts the team; device 2 joins; device 1 syncs | synced (revisions 1, 2, 3); both hold both actions |
| Device 1 deletes the team's copy; device 2 syncs | deleted; "gone" |
| Device 2 sends again; device 1 syncs | synced, **revision 4** then 5 (with the Worker of before it would have begun at 1 again); both hold both actions |
| Clean up | the team's copy deleted; no script error on either page |

Error signals right after (Cloudflare's analytics, `workers/sync/signals.sh`, read only), 15:00 to 16:05 UTC: 26
requests on the new version and 4 on the old, all "success", **0 errors**.

What is left on the server by these tests: three `closed` records (the hash of a made-up token and a revision
number each), which go by themselves after 180 days; and the counters of new spaces, which empty after their hour
and day.

## Gate 2 · Observation (began 28 November 2026, 16:05 UTC; ends 29 November 2026, 16:05 UTC)

What is looked at: the Worker's requests by status and its errors (`workers/sync/signals.sh <since>`), and the live
address answering. Each look is written here with its time; a look that was not made is not written.

| Time (UTC) | Requests since 16:03 on the new version | Errors | The address |
| --- | --- | --- | --- |
| 28 Nov 16:05 | 26 | 0 | answers |

## Gate 3 · #418, then #424 (waits for the author's authorization)

1. #418 merged (test only). 2. `main` merged into #424; the tests again; CI on the exact new head. 3. #424 merged
with a merge commit. 4. The Pages deployment and the live checks (the list of section 7.5, and `docs/RELEASE.md`,
section 4). 5. `node scripts/online-dates.mjs` from `main`'s full history, as `docs/RELEASE.md` section 3 asks.

Way back: `git revert -m 1 <the merge commit of #424>` on `main` (and the dates commit), pushed; Pages publishes the
site of before within minutes.

## Gate 4 · #414 (waits for the author's authorization)

`main` merged into #414; the three translation files merged by key, its Albanian texts in the "ti" form; its
review text aligned with the approved rule (a device that has never synced a board takes the team's version; its
own is in the restore point); the consent, sync and privacy tests; CI; presented for approval. #415 closed only
after #414 is confirmed.

## Safari, by hand (no preview address exists)

The site has one hosting target, GitHub Pages from `main`; a preview address would need a new one, which is the
author's to set up. Until the release, the candidate can be opened on a Mac: `npm ci && npm run build && node
tests/browser/server.mjs 4173`, then Safari at `http://127.0.0.1:4173/`. After the release, the same list on the
live site, on a Mac and on an iPhone:

1. The homepage: Develop → Show JavaScript Console shows no error; the planets move; "Pause the motion" stops them.
2. `/tools/cx-control-tower/` → Root causes opens; the same in `/de/` and `/sq/`.
3. `/tools/five-s-audit/` → add a photo in a normal window, reload: the photo is there. In a private window: the
   page says a private window does not keep photos.
4. `/tools/damage-control/`, the window 400 px wide (or an iPhone with a keyboard): Tab through the form; no field
   rests under the round share button.
5. `/tools/shift-handover/`: fill a handover, "Send", open the link in another tab, type the code, take over.
6. The lock: set a PIN in "All your work in one file", lock, reload, unlock: the work is back.
7. Team sync, two devices or two browsers: start a team, join, change a row on each, sync both.
