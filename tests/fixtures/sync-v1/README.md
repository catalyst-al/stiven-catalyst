# Team sync as it runs in production on 27 October 2026

The two files the sync-compat test (`tests/sync-compat.test.cjs`) runs the new code against. Both are copied
unchanged from `main` at 1644e434 (still identical at f34b1c4b, the head of `main` on 27 October 2026):

- `worker.js` = `workers/sync/worker.js` on `main`, the Worker deployed on Cloudflare as `stiven-catalyst-sync`
  (version cc107fc4, 24 October 2026). The deployed script was read back through the Cloudflare API on 27 October
  2026 and differs from this file only by the final newline. SHA-256 of this file:
  `eaa12eb7b8618d5b9903b6513de21aba4252a6745eb03179f20189bd5ea28492`.
- `team-sync.js` = `src/js/team-sync.js` on `main`, the box the published site runs (space id and token from one
  SHA-256 of the team code, payload version 1, no tombstones).

They are frozen on purpose: do not update them when the code changes. After the new Worker and the new site are both
live and the rollback window is over (see `docs/SYNC-WORKER-MIGRATION.md`), the test and this folder can be removed
together.
