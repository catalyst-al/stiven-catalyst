# Phase 5C: Tools page discovery and filtering (P1-03)

Date: 3 November 2026. Branch `feature/phase-5c-tools-filter` from `main` `41726227` (after Phase 5B). Finding:
`docs/audit/2026-10-31-sitewide-ux-review.md` P1-03, recommendation (a) only: a filter field at the top of the Tools
page. Not in scope, and not done: collapsed role sections (b), a "By problem" strip (c), any change to the service
worker, the Action Tracker hand-off, PIN, Team Sync, backup or restore, the Field Notes filter, or the ATS CV page.

## 1. The page before the change (`main` at `41726227`)

- `src/tools.njk`, `src/de/tools.njk`, `src/sq/tools.njk`: the hero, then `partials/tool-families.njk` (four role
  cards in `nav.family-index` that scroll to their section, then one `section.family-section` per role with its tools
  as `partials/tool-card.njk`), then the guide and "All your work in one file". The cards come from
  `src/_data/tools.json` and its German and Albanian copies: 59 tools each, with `name`, `type`, `time`, `summary`,
  `url`, `cta`.
- No filter or search on the page. `js/filter.js` filters Field Notes, Reflections and Insights only; it writes the
  query into the address (`?q=`), which this phase was asked not to do, so it is not reused here.
- Measured in Chromium (the built site, `tests/browser/server.mjs`), page height and the position of three tools a
  visitor might look for:

| Width | Lang | Page height | Night Audit | Pareto 80/20 | CV Builder / Lebenslauf / Krijuesi i CV |
| --- | --- | --- | --- | --- | --- |
| 390 × 844 | EN | 24 914 px (29.5 screens) | card 5 of 59, y 2 337 (2.8 screens) | card 19, y 7 505 (8.9) | card 57, y 21 390 (25.3) |
| 390 × 844 | DE | 26 756 px (31.7) | card 5, y ≈ 2 556 (3.0) ¹ | card 19, y 8 089 (9.6) | card 57, y 23 087 (27.4) |
| 390 × 844 | SQ | 25 342 px (30.0) | card 5, y 2 367 (2.8) | card 19, y 7 635 (9.0) | card 57, y 21 768 (25.8) |
| 1440 × 900 | EN | 15 594 px (17.3) | card 5, y 1 845 (2.0) | card 19, y 4 173 (4.6) | card 57, y 12 488 (13.9) |
| 1440 × 900 | DE | 16 666 px (18.5) | card 5 ¹ | card 19, y 4 406 (4.9) | card 57, y 13 488 (15.0) |
| 1440 × 900 | SQ | 16 298 px (18.1) | card 5, y 1 914 (2.1) | card 19, y 4 340 (4.8) | card 57, y 13 168 (14.6) |

¹ The German name is "Night-Audit-Protokoll"; the first baseline script looked for "Night Audit" and missed it. Its
place (card 5) is the same in every language; at 390 px the y is the value measured on this branch at rest (2 629 px)
less the 72 px the field adds above it.

Without a filter, reaching the CV Builder on a phone means scrolling past 56 cards, about 25 screens.

## 2. The change

- **`partials/tool-filter.njk`** (included at the top of `partials/tool-families.njk`, so in all three languages):
  a `role="search"` block with a labelled `type="search"` field ("Find a tool: name, topic or task"), a clear button
  (44 × 44 px, `aria-label`), and the count ("59 tools") written at build time in an `aria-live="polite"` line the
  field points to with `aria-describedby`; below it, hidden, the message for no match. Without scripts both are hidden
  by `html:not(.js)` (the class the head script sets before the first paint), so the page is exactly as before and
  nothing moves on load.
- **`js/tool-filter.js`** (new, 95 lines, no dependency; `js/filter.js` untouched):
  - Each card is read once: its name (`h3`), its type (the first label of `.card-meta`) and its description.
  - Folding: Unicode NFD without combining marks, lower case, `ß` → `ss`, every run of other signs → one space. So
    "mysafireve" finds "Ankesat e mysafirëve", "gastebeschwerden" finds "Gästebeschwerden", "massnahmen" finds
    "Maßnahmen", "night audit" finds "Night-Audit-Protokoll", "80/20" finds "Pareto 80/20".
  - Every word must occur (multiword, any order); a word may be part of a word ("leb", "nigh aud").
  - A card shows when it matches; a role with no match is hidden; the role cards (`nav.family-index`) step aside while
    the field holds words, so the matches come right under the field.
  - Ranking: a tool whose name holds every word comes first in its role, and its role first among the roles ("pareto"
    puts Pareto 80/20 above the five tools that only mention Pareto). The cards and sections are moved in the
    document, not only drawn elsewhere, so the order read and tabbed through is the order seen; at rest the original
    order is restored exactly (tested by comparing every card's link before and after).
  - Count "{a} of {b} tools" / "1 of {b} tools" / "59 tools" at rest, in EN, DE ("von", "Tools") and SQ ("nga",
    "mjete").
  - Escape (when the field has text) and the clear button empty the field and restore the page; the clear button
    gives the focus back to the field. Enter moves the focus to the first match's link (a phone's "search" key then
    closes the keyboard so the result can be seen); with an empty field it does nothing.
  - `pageshow` re-applies the field's value, so a page restored by Back with text in the field shows a consistent list.
  - No storage, network, address or cookie API is used (tested by reading the script and by watching the page).
- **CSS** (`src/css/04-essay-extras-and-tools-page.css`, reusing `.filter-search` of the writing lists, so the field
  looks and focuses like the other filter fields): 52 px high field, 17 px text (no zoom on focus in iOS), the clear
  button 44 px, the count in tabular numbers. While filtering, each shown role keeps its planet, colour, kicker and
  name, but its descriptive line and "Open the planet" link are hidden and its top padding is smaller, so the first
  match sits near the field; one or two matches keep a card's width (`auto-fill` instead of `auto-fit`). At ≤ 620 px
  the field takes the whole width and the space under it is 16 px. Print hides the field
  (`src/css/06-tools.css`).
- **Strings**: six new keys in `src/_data/de/ui.json` and `src/_data/sq/ui.json`; the English text is the key.

## 3. Evidence

### Time to a named tool (Chromium, built site; measurement scripts in the session's scratch space)

| Width | Lang | Typed | Keystrokes | Shown | Target's place | Target card's top | Page while filtered |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 390 | EN | `night audit` | 11 | 1 of 59 | 1st | y 746 (first screen: 844) | 3 953 px |
| 390 | EN | `pareto` | 6 | 6 of 59 | 1st | y 780 | 5 981 px |
| 390 | EN | `cv` | 2 | 3 of 59 | 1st | y 746 | 4 450 px |
| 390 | DE | `night audit` | 11 | 1 of 59 | 1st | y 812 | 4 268 px |
| 390 | DE | `pareto` | 6 | 6 of 59 | 1st | y 829 | 6 461 px |
| 390 | DE | `lebenslauf` | 10 | 3 of 59 | 1st | y 762 | 4 791 px |
| 390 | SQ | `night audit` | 11 | 1 of 59 | 1st | y 752 | 4 002 px |
| 390 | SQ | `pareto` | 6 | 6 of 59 | 1st | y 787 | 6 079 px |
| 390 | SQ | `cv` | 2 | 3 of 59 | 1st | y 752 | 4 549 px |
| 1440 | EN/DE/SQ | the same | the same | the same | 1st | y 770 (first screen: 900) | 3 762–5 980 px |

Fewest keystrokes until the target is the first card (390 px): Night Audit 2 ("ni") in EN, DE and SQ; Pareto 80/20 3
("par"); CV Builder 2 ("cv"), Lebenslauf-Generator 3 ("leb"), Krijuesi i CV-së 3 ("kri").

Before: the CV Builder was 21 390 px and 56 cards down on a phone (25.3 screens of scrolling). After: two keystrokes,
three cards shown, the CV Builder first, its card starting 746 px from the top of the page, inside the first screen.
At 1440 px the card's top (its preview picture) is in the first screen; its name is under the picture, about 190 px
below the fold, and Enter scrolls the focused link into view.

The field itself is in the first screen at every width: its top at 551 px (EN), 577 px (DE), 556 px (SQ) at 390 px,
and 480 px at 1440 px. At rest the page is 72–73 px longer than before (the field and its count); no horizontal
scrolling at 390, 768 or 1440 px, at rest, filtered or with no match.

### Tests

- `tests/tool-filter.test.cjs` (7 tests, jsdom on the built EN, DE and SQ pages with the script from `src/js`): every
  tool listed in the HTML itself, the field before the role cards and labelled, the count at rest; 25 searches in
  three languages, each checked card by card against the folding rule, the ranking, the hidden roles and the count;
  the no-match message in each language; Escape and the clear button restore every card and role in their original
  order and the role cards; Enter focuses the first match's link; with fictional saved work in `localStorage` and a
  fictional hand-off note in `sessionStorage`, typing sends no request, writes no storage, rewrites no address, and
  leaves both unchanged; the script uses no storage, network, address or cookie API; the six strings translated.
- `tests/browser/tool-filter.spec.mjs` (8 tests, all six projects: 390, 768 and 1440 px, dark with motion and light
  with reduced motion): a named tool found by typing in EN, DE and SQ, the field in the first screen, ≥ 44 px high,
  not moving while the list changes, the first match starting in the first screen, axe (WCAG 2.1 A/AA) clean while
  filtered; "pareto" puts Pareto 80/20 first; Escape restores 59 cards, 4 roles and the role cards; the no-match
  message in three languages, axe clean, the clear button a 44 px target that restores the page and focuses the
  field; the keyboard order field → clear → first match, Enter to the first match and Enter again into the tool; a
  filtered link opens its tool; the role cards still scroll to their role after a search is cleared; while typing,
  no request carries the typed text, every request is a GET for a file the page already names (the lazy previews of
  the cards shown), no storage, cookie or address changes; with scripts disabled the field is not drawn and all 59
  cards and links are listed.
- `tests/browser/sw-offline.spec.mjs`, one test added (1440 px light, like the rest of the file; `src/sw.js`
  unchanged): the Tools page kept by the worker opens offline with every file it names in the copy, its filter script
  among them, and finds a tool with nothing asked of the network.
- Before the change: run against a build of `main` at `41726227` (git worktree), the seven unit tests fail and seven
  of the eight browser tests fail (no field); the no-script test passes there as it must, since it asserts the page
  without scripts is the page as it was.

### Accessibility

The field has a label (visually hidden, as on the other filter fields) and a placeholder; `role="search"`; the clear
button has a name in each language and a 44 × 44 px target; the count is a polite live region the field describes
itself by; the focus order follows the visible order because cards are moved in the document; Escape and Enter are
handled only when they have something to do; axe finds no serious or critical violation on the filtered page and on
the no-match page, in both themes, at 1440 px and 390/768 px (the spec runs in every project).

## 4. Limitations

- Ranking is two-level (name, then anything else), not a relevance score; within each level the page's order holds.
- The words are matched as parts of words: "cv" also finds the Cover Letter (its description names the CV), and a
  very short query ("ni") shows many tools. Typos are not forgiven.
- Only the name, type and description are searched, as P1-03 recommends; the role name ("Shift Lead"), the time and
  the call to action are not.
- At 1440 px the first match's card starts in the first screen but its name is below its preview picture, under the
  fold; on a phone with the keyboard open the matches are under the keyboard until Enter or the "search" key.
- The filter covers the Tools page only; the site's Search page and the role pages are unchanged.
- The field's words stay in the field across a Back navigation only when the browser restores the form; the filter
  itself keeps nothing.

## 5. Rollback

Revert the merge commit; no stored data, address or service-worker format changed, so nothing on a device needs to be
cleaned up.

## 6. Final integration with `main` (3 November 2026)

After CI run 828 (success on `6c661bfe`), `main` moved to `ebae6e01` (PR #378, Management Review 91–100, after PR
#376, the CV tools' ResizeObserver correction; deploy run 830 success). `main` was merged into this branch with a
merge commit (`768400db`, no rebase, no force-push); git merged it without a conflict.

- The branch differs from `main` in the same 14 files as before and nothing else; every file #376 and #378 changed
  (`src/content`, the magazine pages and media, `tool-kit.js`, the CV scripts, `09-career-and-data-tools.css`) is
  byte-identical to `main`. The filter's script, partial and tests are identical to the reviewed `6c661bfe`.
- `src/styles.css` equals its parts joined in order (`lib/css-parts.js` `joinParts`), and `tests/css-parts.test.cjs`
  passes.
- No storage, service-worker, PIN, Team Sync, backup or Action Tracker file differs from `main`; no storage key or
  format is added or changed (the filter reads and writes no storage, tested).
- Full chain on `768400db`: `npm run build` 898 files; `npm test` 1 437 pass, 0 fail, 0 skipped; Playwright, six
  projects, 274 passed, 0 failed, 0 skipped, 0 flaky (18.2 min), among them the 48 filter tests (EN, DE, SQ,
  keyboard, 390/768/1440 px, axe, privacy, no scripts), the three offline tests of Phase 5A with the kept Tools page
  filtering offline, the seven Phase 5B hand-off tests and the 96 accessibility page checks.
