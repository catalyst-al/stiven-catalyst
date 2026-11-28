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

## Gate 1 · The Worker (waits for the author's authorization)

The candidate: `workers/sync/worker.js` at the head of #424 (SHA-256 above). Command, from a checkout of that head:
`node workers/sync/deploy.mjs`.

To record here when done: the time, the new version id, the output of each smoke test of section 7.5 of the
migration document, the published site still syncing, the test spaces deleted, the Worker's error count.

Way back: Cloudflare → Workers & Pages → `stiven-catalyst-sync` → Deployments → `cc107fc4-…` → Rollback.

## Gate 2 · Observation (24 hours after gate 1)

To record: when it began and ended, what was looked at (the Worker's requests and errors by status), what was seen.

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
