# Independent audit of 27 October 2026

Read-only audit of `main` at `3cb88a2` (deployed 26 Oct 2026, 23:50 UTC). Nothing was changed during the audit.

**Where things stand now.** The fixes that followed the audit (phases 1–3) were merged into `main` with
catalyst-al/stiven-catalyst#363 (`5371dec8`) and published on 28 October 2026, with the dates written after the merge
(`669b34d3`). The current documents are:

| File | Content |
| --- | --- |
| `RAPORTI-I-PUBLIKIMIT.md` | The short release report: what goes out, the checks, the risks that remain, the steps. |
| `publikimi-2026-10-28/` | The release of 28 October 2026: the merge, the dates, and the checks on the live site, with their scripts and results. |
| `RAPORTI-I-KONSOLIDUAR.md` | Every finding of the three phases with its status, commit and test. |
| `VENDIMET-E-HAPURA.md` | The author's decisions, taken and still open. |
| `../../RELEASE.md` | How to merge, the dates after the merge, the checks on the live site and the way back. |

The files below, `STATUS.md`, `phase2/` and `phase3/` record the state at the time they were written.

| File | Content |
| --- | --- |
| `AUDIT-REPORT.md` | The consolidated report: executive assessment, coverage, scores, defect register (T-, E-, M-, P-, A-, CI- ids), comparison with earlier audits, editorial review, benchmark, roadmap, verdict. |
| `phases/` | The eight phase reports the consolidated report draws on, with the worker ids (P2A-…, P2B-…, P2C-…, PM-…, P4-…, P5-…, P6-/P7-…, SEO-/ARCH-…). |
| `repro/` | The reproduction scripts of each phase, as they were run, plus the test logs of the audited commit. |
| `STATUS.md` | What happened to each finding afterwards: fixed (with the test that proves it), pending, not verified, or waiting for the author. |

## Running the reproduction scripts

They were written against an isolated clone of the audited commit with its `_site` built. In the scripts and reports:

- `$SRC` is that clone (any checkout of `3cb88a2` with `npm ci` and `npm run build` done);
- `$AUDIT_WORK` is the folder the script and its outputs lived in (`repro/` here);
- `$AUDIT_DIR` is the parent of both.

Most browser scripts start `node tests/browser/server.mjs <port>` from `$SRC` and use Chromium through Playwright.
Outputs (screenshots, PDFs, JSON) were not archived; the scripts recreate them.

The findings that were fixed are guarded by tests in `tests/`, which use the real tools instead of these scripts.

No secrets and no personal data are stored here. The phone numbers, names and guests in the scripts are the
tools' own example data or invented test values.
