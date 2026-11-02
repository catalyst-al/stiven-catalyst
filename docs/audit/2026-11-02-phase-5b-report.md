# Phase 5B: private Action Tracker hand-offs (P1-02)

Date: 2 November 2026. Branch `feature/phase-5b-private-action-handoff` from `main` `ff7f9c12` (after Phase 5A,
`8ceba71b`). Finding: `docs/audit/2026-10-31-sitewide-ux-review.md` P1-02. Scope: the hand-off of an action from any
tool to the Action Tracker; nothing else.

## 1. The contract before the change (production, `main` at `ff7f9c12`)

Two shared helpers build every hand-off link; no tool builds its own (checked: 45 scripts call them, none sets a
tracker address by hand).

| Helper | Address it built | Used by |
| --- | --- | --- |
| `ToolKit.trackerUrl(action)` / `trackerLink(label, action\|fn)` (`src/js/tool-kit.js`) | `../action-tracker/?action=<title>&source=<slug>&detail&owner&due&check&area&priority` | the tools without the store: the result buttons of the logs, 5 Whys, Shift Handover, Night Audit, KPI Diagnostic and others |
| `ActionsStore.link(action)` / `linkButton(label, getAction)` (`src/js/actions-store.js`) | `/<lang>/tools/action-tracker/?action&detail&owner&due&source&check&area&priority&case` | the tools with the store: Room Inspection, Signals, Daily Board, Gemba Walk, 5S Audit and the rest |

The receiver, `ActionsStore.fromParams(location)` (called once by `src/js/action-tracker.js`), read the parameters,
refused the same open title from the same source and case, added the action through `ActionsStore.add` (its own
rules: id, source and ref, example replacement), deleted the parameters with `history.replaceState` and kept any other
parameter (`?coaching=`). Confirmed: the action's title (up to 300 characters), detail, owner, due date, check, area,
priority and case id travelled in the request line of the navigation, so they reached the host's logs, the browser's
history, any referrer and, since Phase 5A, the service worker's offline copy as the document's cache key.

## 2. The change

- **Note and token.** `ToolKit.actionHandoff` (`src/js/tool-kit.js`, loaded on every tool page before the store):
  the action is written into one sessionStorage note of the tab (`sc-action-handoff`: `{ "<token>": { action, at } }`,
  the last twelve kept) under a random 16-character token (`crypto.getRandomValues`), and the address carries only
  `#handoff=<token>` in its fragment. The fragment never leaves the browser: no request line, log, referrer or cache
  key holds it, so the Phase 5A worker caches the tracker under its plain address. The same action asked for again on
  a page keeps its token, so a link rebuilt at every keystroke does not fill the note.
- **Both helpers** build the link this way; `ActionsStore.link` delegates to `ToolKit.actionHandoff`. No caller changed.
  `trackerLink` and `linkButton` with a function also refresh the link on `mousedown`, so a middle click, which fires
  no click, carries the current action.
- **The receiver** (`fromParams`) reads the token, takes the note once (removing it), adds the action under the
  existing duplicate rules, cleans the fragment and the older parameters from the address, and reports `missing` when a
  token arrives with no note or says `unsaved`; the tracker then says "The action did not arrive. Go back to the tool
  and press "Add to actions" again in this tab." (EN, DE, SQ). A link of the older `?action=` shape is still read.
- **Failure modes.** Storage refused (blocked, full): the address says `#handoff=unsaved`, never the text; the tracker
  says the action did not arrive. Navigation failed or the page reloaded before arrival: the note stays until taken
  (or until twelve newer ones push it out); a second click rewrites it under the same token. Reload after arrival:
  the fragment is gone, nothing is read, nothing is added twice. A copied link, or one opened in another browser: the
  tracker says the action did not arrive and adds nothing.
- **New tab.** The hand-off is made by following the link in the same tab. A tab opened from it with Ctrl/Cmd-click,
  a middle click or Shift-click has no copy of the tab's sessionStorage in Chromium (measured: no opener, no note),
  so the tracker there says the action did not arrive, adds nothing and leaks nothing; the tool still holds the
  action and a normal click hands it over. The function-form links refresh their token on mousedown, so even a
  middle click opens the tracker with the message rather than with nothing. Before this change a new tab worked
  because the address carried the text; that convenience is given up for the privacy of the address.

## 2a. Independent review of `c893c23c` (round 2): two reliability gaps, fixed

| # | Finding | Cause in `c893c23c` | Correction (commit `d463d1a1`) |
| --- | --- | --- | --- |
| F5B-01 | The note was taken before the action was saved: a save the browser refused (storage full or blocked, the tools locked with the PIN) lost the hand-off (note gone, token cleaned) with no specific word | `fromParams` called `take()` first, then `add()` | `fromParams` reads the note, adds, and only then takes it; when the save is refused it leaves the note and the address as they are and reports `failed`; the tracker says "The action from the tool could not be saved: this browser's storage is full, blocked or locked. Unlock the tools or free space, then reload this page: the action is still waiting." (EN, DE, SQ). A reload once the tools are unlocked, or there is room, hands the action over (the lock's own reload after the PIN does it). Duplicate, example, case and ref rules unchanged; nothing is ever put back into the address |
| F5B-02 | A link built early could lose its note: the handover builds one "To actions" link per open issue when it draws, and the store keeps twelve notes, so the fourteenth link's note pushed the first one's out before it was clicked | the note was written when the link was built, and only then | the page keeps what each of its tokens stands for in memory (`handoffActions`, the last 1 000), and a document-level `click`/`auxclick` listener (bubbling, so a link that builds its address in its own handler is read after that) writes the note again just before the navigation when the store no longer holds it (`actionHandoff.ensure`). The store stays bounded at twelve; a normal click, Enter on the focused link and a middle click all pass through it; the new-tab limitation stands |

Regression tests (`tests/action-tracker.test.cjs`): **F5B-01** (storage refused and the PIN lock: nothing added, the note
and the token kept, `failed: "unsaved"`, the page's message; then the save allowed, the same address adds the action,
consumes the note and cleans the address), **F5B-02** (thirteen links from `trackerUrl`; the first, followed last,
has its note; the seventh by keyboard) and **F5B-02 on the Shift Handover page** (fourteen open issues in the built
page, fourteen links, the first followed last hands its issue over; the store stays bounded). In the browser
(`tests/browser/action-handoff.spec.mjs`): the handover with fourteen issues in Chromium, the first link followed last
arrives and no request carries a word of it; the PIN-locked tracker keeps the note and the token and says so.
Before-proof: the three unit tests fail on `c893c23c` (worktree, same file).

## 3. Evidence

Commit `6ab09816` (code and tests). Results on this machine, full production build:

| Step | Result |
| --- | --- |
| `npm run build` | 868 files written, no error |
| `npm test` | **1 427 pass, 0 fail, 0 skipped** |
| Six browser projects (390/768/1 440 × dark/light) | **223 pass, 0 fail**, 15.2 min (the 5 new hand-off tests among them; the Phase 5A offline spec, the case thread and the Room Inspection actions pass unchanged) |
| Focused: the 29 unit files that touch the hand-off (`action-tracker`, `tracker-links`, `case-thread`, `signals` and the 25 tool tests) | 343 pass |
| `src/sw.js` | unchanged |

**Before-proofs against the code of `main` (`ff7f9c12`), same test files:**
- Unit, in a throwaway worktree: 10 of 34 tests fail in `action-tracker`, `tracker-links`, `case-thread` and `signals`; among them the privacy proof ("realistic operational text never appears in a generated tracker address, in EN, DE and SQ, from both helpers") and the note contract.
- Browser, against a build of `main` in a worktree: `tests/browser/action-handoff.spec.mjs` fails at its first assertion with the address visibly carrying the fictional text: `…/tools/action-tracker/?action=Move+the+night+cycle+of+the+ice+machine+to+the+afternoon&source=five-whys&detail=Root+cause%3A+Ice+machine+compressor…&owner=Arta+B.&due=2026-11-20&check=No+noise+complaint…&priority=High`.

**On the branch, in Chromium with the Phase 5A worker in charge (the same spec):** no request the browser makes carries a typed word; the action arrives once with title, detail, owner, due date, check, source and priority; the address is cleaned; a reload adds nothing; the same hand-off again is refused as a duplicate; the offline copy's addresses and its reference index hold no typed word and no `?action=` address; a tab opened with Ctrl-click or a middle click shows "did not arrive" and adds nothing, and no request of either tab carries a word; a token with no note says so; a link of the older shape still arrives and is cleaned; German and Albanian the same.

CI: run 823 on `c893c23c` (round 1): success.

### Results after round 2 (`d463d1a1`, full production build, this machine)

| Step | Result |
| --- | --- |
| `npm run build` | 868 files written, no error |
| `npm test` | **1 430 pass, 0 fail, 0 skipped** |
| Six browser projects | **225 pass, 0 fail**, 14.6 min (the 7 hand-off tests and the Phase 5A offline spec among them) |
| Before-proof, unit: the final `tests/action-tracker.test.cjs` against `c893c23c` (worktree) | **F5B-01, F5B-02 and F5B-02 on the Shift Handover page fail**, the other 10 pass (one earlier test also fails there only because the result of `fromParams` gained a `failed` field) |
| Browser, on the branch | the handover with fourteen issues: the first link followed last arrives, no request carries a word; the refused save keeps the note and the token, says "still waiting", and the reload once writes work again adds the action |

The first full run of this code ended with one browser failure in a spec this change does not touch
(`handover-transfer.spec.mjs` at 390 px dark: the "wrong code" message after a sealed-link unlock did not appear within
its 20-second budget while four browser workers ran in parallel); the test passed twice in isolated reruns and in the
complete rerun above. Recorded here as a load-dependent timeout of that spec, not changed in this PR.

CI: the run on the round-2 head is reported in the Draft PR once finished.

## 4. Limitations and what stays open

- Links of the older shape that already exist outside the site (bookmarks, history entries, host logs written before
  this change) keep their text; nothing can recall them. New pages generate none.
- Other tool-to-tool links still carry typed text and are **not** changed here (a separate decision): 5 Whys → Shift
  Handover (`?issue=&owner=&due=`); the result buttons, the Daily Board, the A3 Report, Andon, the CX Control Tower,
  8D and Hoshin Kanri → 5 Whys (`?problem=`); the Action Tracker → 5 Whys (`?problem=`); Hoshin Kanri → A3
  (`?problem=`); Search (`?q=`). Until they change, the Tools page's "nothing you type leaves your device" stays true
  of tool data at rest and of the Action Tracker hand-off, not of those links.
- A hand-off into a new tab or window is not supported (above); the tracker says so.
- The note lives in the tab's sessionStorage: it is cleared when the tab closes, as intended, and is not part of the
  work file, the restore points, the PIN lock or team sync (it holds nothing that is not also on the tool's page).

## 5. Rollback

Revert the merge commit of the PR on `main` (`git revert -m 1 <merge>`): the older address returns. Actions already
added are ordinary rows of `sc-actions` and are unaffected; a note left in a tab's sessionStorage is ignored by the
older tracker and disappears with the tab. No storage format changed.
