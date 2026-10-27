# Publishing the audit work (phases 1 to 3)

Prepared on 27 October 2026. Nothing here has been run against `main`, GitHub Pages or Cloudflare. **Every step that
changes `main` or the live site waits for the author's final review and approval.** The Team Sync Worker is not part
of this release: it has its own plan, `docs/SYNC-WORKER-MIGRATION.md`.

## 0. How the site is published

- `.github/workflows/deploy.yml` runs on every push to `main` (and on pull requests, without deploying): `npm ci`,
  `npm run build`, `npm test` (must end with `# fail 0` and `# skipped 0`), `scripts/check-coaching-build.mjs`, the
  browser journeys (`npm run test:browser`), then GitHub Pages deploys `_site`.
- The build runs in a shallow clone, so the dates of the publications and essays are not computed there: they are
  kept in `src/_data/online.json` and `src/_data/edited.json`, written by `scripts/online-dates.mjs` from the
  **first-parent history of `main`** (a branch counts from the day it is merged). These two files must therefore be
  written again **after** the work branch is merged, from `main`'s full history.

## 1. Before the merge

1. The author has reviewed the work and decided which open items wait (they stay documented in
   `docs/audit/2026-10-27/STATUS.md` and the phase reports; nothing waits silently).
2. Bring `main` into the work branch (a merge commit, never a rebase or force push), resolve, test:
   ```
   git fetch origin main
   git checkout claude/gifted-pasteur-v7n2dw
   git merge --no-ff origin/main
   npm ci && npm run build && npm test && node scripts/check-coaching-build.mjs && npm run test:browser
   ```
   Done on 27 October 2026 at `f34b1c4b` (one conflict, the German deck of "Die Wahrheit, die nicht in die
   Chefetage steigt": the phase 2 "Sie" kept). Repeat if `main` has moved.
3. Optional dry run of the whole release, without touching `main` (done on 27 October 2026, see section 5):
   ```
   git worktree add --detach ../release-dry origin/main && cd ../release-dry
   git merge --no-ff claude/gifted-pasteur-v7n2dw -m "dry run"
   node scripts/online-dates.mjs HEAD && npm run build && npm test
   ```

## 2. The merge (author's approval)

Open the pull request `claude/gifted-pasteur-v7n2dw` → `main` and merge it with **"Create a merge commit"**, not
squash and not rebase:
- the audit reports cite the commits of the branch by hash; a squash or a rebase would leave those references
  pointing nowhere;
- `online-dates.mjs` follows the first parent, so with a merge commit every changed essay and publication is dated by
  the day of the merge, which is the day readers see the change.

The pull request runs CI (build, unit tests, browser journeys) without deploying. Do not merge while it is red.

## 3. The dates, right after the merge (author's approval)

From a full clone (in a shallow one run `git fetch --unshallow` first):
```
git fetch origin main
git checkout -B release-dates origin/main
node scripts/online-dates.mjs
npm run build && npm test
git add src/_data/online.json src/_data/edited.json
git commit -m "Online dates after the merge of the audit work"
git push origin release-dates:main      # or as a small pull request, if main is protected
```
Between the merge's deploy and this one (a few minutes) the pages show the dates of before; nothing else differs.

What the dates step changes (measured on the dry run of 27 October 2026, merge dated that day):
- `edited.json`: 48 essays and reflections changed by the branch get the merge day; essays changed on `main` since
  the file was last written (18 to 26 October) get their own days from `main`'s history, as they should have already.
- `online.json`: 54 publications reprinted in phase 2 get `modified` = the merge day; no `published` day moves.

**Alternative with one deploy**: do the merge locally (`git checkout -B release origin/main && git merge --no-ff
claude/gifted-pasteur-v7n2dw`), run `node scripts/online-dates.mjs HEAD`, commit, test, and push both commits to
`main` together. This bypasses the pull request, so only if the author prefers it.

## 4. After the deploy: checks on the live site

In a current Chrome, EN, DE and SQ:
- the home page: the four planets move as before; the motion control pauses everything, is remembered after a reload
  and on other pages; with "reduce motion" set in the system the motion starts paused;
- search by keyboard: type, arrow down, Enter opens the result (CI-01);
- a Management Review issue and its PDF: the month (October 2026 for issues 41 to 80), the colophon, a dated
  correction note (e.g. No. 6), the corrections register at the foot of the archive;
- "How this is made": the AI paragraph (reflections and the book are Albanian originals);
- the Tools Guide: edition 8, its PDF opens;
- printing a tool with a wide table (Andon) and an issue with charts: no column cut, no blank chart;
- read aloud on an essay: stops at the end of the text, the privacy note;
- the sitemap (`/sitemap.xml`): `lastmod` of an issue;
- the browser console: no error on these pages.

## 5. If something goes wrong: the way back

- Revert the merge on `main`: `git revert -m 1 <merge commit>` (and the dates commit), push; Pages deploys the
  previous site within minutes. No reader data lives on the server: the tools keep their work in each browser.
- Data written by the new code and read by the old one after a revert:
  - work lock: a PIN of 6 or more characters is accepted by the old code (it asked for 4); checked in the code;
  - coaching: the new optional `copyOf` field of a labelled copy is ignored by the old validation; checked in the
    code (`validProject` does not reject unknown fields);
  - team sync: a team already moved to its new address is not found by the old page ("gone"), which writes nothing;
    the work stays on every device, and the new page finds the team again (tests/sync-compat.test.cjs); details in
    `docs/SYNC-WORKER-MIGRATION.md`;
  - other changed formats (examples marked as such, the Action Tracker, restore points with photos): **not verified**
    against the old code; their new fields are additions, and each reads the old format (phase 1 tests).

## 6. Not in this release

- The Team Sync Worker (`workers/sync/worker.js`): only after its own approval, by `docs/SYNC-WORKER-MIGRATION.md`.
  The site of this release works with the Worker deployed today (tests/sync-compat.test.cjs).
- The decisions that wait for the author (career timeline, Albanian proposals, the book's edition line and back
  cover, editorial choices of the Management Review): listed in `docs/audit/2026-10-27/STATUS.md`.
