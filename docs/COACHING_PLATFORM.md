# Coaching platform

## What changed for a visitor

The existing light, planets, homepage, navigation and visual language remain in place. Opening a planet's role page now opens a practical coaching workspace above its existing tools, routine, learning and growth sections.

1. Choose a context: logistics/warehouse or hotel/service; new or experienced in the role. A name or alias is optional.
2. Create a project with a goal, measurement definition and review date.
3. Follow a role-specific learning path. Each original module has a short method, a contextual case, a decision with feedback, a specific workplace assignment, a reflection question and relevant tools.
4. Save a practical exercise into the project. A separate dated workplace review records observed evidence; answering a quiz alone never counts as applied skill.
5. Use the project brief, accountable action plan, evidence journal and before/after observations to run the work.
6. Reflect using GROW. Each session creates a linked action with owner and due date.
7. Print a project report for a conversation with a human coach, or contact Stiven through the existing contact page. No project data is automatically sent.
8. Export a coaching backup for safekeeping or transfer to another browser. Import creates independent project copies instead of replacing newer work.

All interface and original module content is available in English, German and Albanian. Project IDs and storage keys are independent of the language; visitor-entered text is not automatically translated.

## Role paths

| Planet | Role | Practical learning path | Project outcome |
| --- | --- | --- | --- |
| PULSE | Shift Lead | Shift briefing; SBI feedback; accepted handover | Clear priorities, feedback and accountable shift transitions |
| ZENITH | Area Manager | KPI definitions/denominators; observation and coaching; weekly PDCA review | One evidence-led area improvement with follow-through |
| LUMEN | Process Manager | Define/SIPOC; measurement baseline; hypotheses/5 Whys; pilot and control | A bounded DMAIC project with measurement, test and control plan |
| ATLAS | Career | STAR evidence; requirement/gap mapping; managerial interview practice | Truthful career evidence and concrete development assignments |

## Review of the existing architecture

The Eleventy architecture is a sound foundation for this release: role ownership is centralized in `families.json`, templates are shared across languages, the calculation tools are separate browser scripts, and the repository has meaningful import/calculation tests. It does not require a framework migration to add a working coaching layer.

Before this release the role pages mainly organized links to tools, routines and reading. There was no shared role workspace connecting goals, practical training, projects, evidence and review. This release adds that workflow and retains the original tools and their storage.

The current site is a static application. It has no server, account system, shared team database, coach inbox or automatic cross-device synchronization. This release is therefore a working individual coaching platform, not a multi-user company management system. Workspace copy and privacy text describe this explicitly.

## Implementation

- `src/_data/coaching.js`: 13 original modules, case choices, specific assignments and role configuration; `coaching-workflows.js`: sector project templates, branching scenarios and three-language workflow text.
- `partials/coaching-workspace.njk`: role workspace shell and safely embedded JSON.
- `js/coaching-core.js`: schema validation, shared state, storage revision checks, backup import/export, weighted measurements and progress.
- `js/coaching-workspace.js`: context, next step, training, project, self-coaching, reporting and saved-work views.
- `partials/coaching-bridge.njk` / `js/coaching-bridge.js`: optional project panel on an existing tool page. Opening a tool from a project carries only a random project ID. Pareto, 5 Whys and KPI Diagnostic expose explicit read-only result providers. The visitor reviews the current result, writes a conclusion and optionally adds an accountable action. Submission reloads the latest project state first. Other tools retain manual summary/source capture (for Shift Pulse that is its “Copy summary” text: the period, the three numbers, what needs attention and the open issues). Tool inputs and logs are not overwritten.
- `js/coaching-results.js`: safe display of validated, dated result snapshots in the tool panel, project journal and printable report. Pareto keeps the complete category distribution, totals, filter, period and skipped-row count; 5 Whys keeps the reasoning chain as a hypothesis; KPI Diagnostic keeps the ten ratings and their consistent cause scores. Raw imported Pareto rows are not copied into coaching backups.
- `src/coaching.css`: scoped additions using existing colors, buttons, form controls and typography; supports the existing dark/light themes, narrow screens and a dedicated printable report.
- `tests/coaching.test.cjs`: state, backup, weighted rate, curriculum and DOM workflow tests.
- `scripts/check-coaching-build.mjs`: generated-page integration checks across all 12 role pages and 42 tool pages.

No homepage or planet asset was edited. The English, German and Albanian built homepages and `src/styles.css` were compared with the baseline and remained byte-for-byte identical.

## Persistence and data rules

- Browser storage key: `sc-coaching-v1`. It is shared across the site's languages, isolated from existing tool keys.
- State and backup schema are now version 2. Valid version 1 records migrate in memory on load; storage is written only on the next explicit save. Old backups are accepted and copied. Invalid legacy records remain untouched. Each project retains the sector/experience context present at creation or migration.
- A storage error keeps new work in page memory and offers backup export. Closing the page can lose that unsaved work.
- Unreadable stored data is never silently overwritten. Explicit recovery requires a valid backup and confirmation; the unreadable original is downloaded first.
- Revision checks prevent common stale-tab overwrites. These are not a distributed or transactional database; use one editing tab for a project.
- Restore validates the whole backup before changing state, copies project/action/evidence/session IDs and preserves current context and active projects. Maximum backup size is 5 MiB, 100 projects and 2,000 items per project collection.
- User text is escaped when displayed. Embedded configuration escapes HTML script terminators.
- Failed-unit observations require valid dates, whole nonnegative counts, a positive denominator and failed units no greater than total. Duplicate date/period entries are rejected. Rates use summed failed units divided by summed units, not an average of daily percentages.
- Before/after changes are descriptive, in percentage points. They are not presented as proof of causation or significance. The visitor must keep definitions and conditions comparable and check a guardrail.
- New measurements retain their metric definition and source. Missing historical definitions or changed definitions suppress percentage comparisons and request a source review; the original counts remain visible and unchanged.
- Module progress distinguishes saved practice from self-reported workplace review. Neither is a professional certification.
- Coaching backups contain coaching work only. Existing tool logs still require their own exports.

## Validation

Run:

```sh
npm ci
npm test
npm run build
node scripts/check-coaching-build.mjs
```

The new DOM tests exercise context → project → case feedback → practical exercise → workplace review → GROW action → measurement, and the tool-to-project evidence connection. They also check all role/language combinations and safe rendering of imported text.

## Connected managerial workflows

LUMEN starts with a hotel handoff or warehouse incomplete-order brief without fabricated baseline data. Next-step guidance checks scope and target → before observations → reviewed tool snapshot → working hypothesis, supporting facts and falsification test → bounded pilot with owner/date/criterion/guardrail → comparable after observations → adopt/adapt/stop decision with reason → standard owner/cadence/drift response. Due actions and 1:1 reviews take priority. Documentation is self-reported, not independent validation. Adapt/stop keeps a replan prompt instead of declaring success.

Recurring 1:1 sessions use a colleague alias, reference the previous session and show the previous action and manager support. The new record requires review of that commitment, GROW reasoning, renewed support, a linked action and next review date. Only the latest session for an alias drives reminders. Backups remap the full session chain and linked action IDs.

PULSE and ZENITH include delegation agreements: expected outcome, owner, resources, decision authority, escalation boundaries, checkpoint, due date, acceptance criteria and the recorded agreement. Saving creates a linked action. A dated checkpoint observation clears its reminder; completing an action requires an observed outcome. Print includes the agreement and reviews. There are no invitations, notifications or automatic proof of acceptance.

Each planet has an original fictional simulation with three successive decisions. The first decision branches to a different situation; every choice records its consequence. Attempts resume across languages, can be restarted and end with a workplace-transfer reflection. Simulations never increment practical-assignment or workplace-review progress.

## Next architectural boundary

If the product needs shared coach/client accounts or company teams, add an explicitly designed backend with authentication, access control, tenant isolation, backups and data-retention controls. Keep calculation engines deterministic and keep this individual workflow as the core. Do not describe local storage as cloud backup or pretend a saved reflection is a session with a real coach.
