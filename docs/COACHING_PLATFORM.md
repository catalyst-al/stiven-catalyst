# Coaching platform, first release

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

- `src/_data/coaching.js`: 13 original modules, case choices, specific assignments, role configuration and three-language text.
- `partials/coaching-workspace.njk`: role workspace shell and safely embedded JSON.
- `js/coaching-core.js`: schema validation, shared state, storage revision checks, backup import/export, weighted measurements and progress.
- `js/coaching-workspace.js`: context, next step, training, project, self-coaching, reporting and saved-work views.
- `partials/coaching-bridge.njk` / `js/coaching-bridge.js`: optional project panel on an existing tool page. Opening a tool from a project carries only a random project ID. The visitor manually attaches a summary and source; tool inputs and logs are not scraped or overwritten. Submitting the summary reloads the latest project state first.
- `src/coaching.css`: scoped additions using existing colors, buttons, form controls and typography; supports the existing dark/light themes, narrow screens and a dedicated printable report.
- `tests/coaching.test.cjs`: state, backup, weighted rate, curriculum and DOM workflow tests.
- `scripts/check-coaching-build.mjs`: generated-page integration checks across all 12 role pages and 39 tool pages.

No homepage or planet asset was edited. The English, German and Albanian built homepages and `src/styles.css` were compared with the baseline and remained byte-for-byte identical.

## Persistence and data rules

- Browser storage key: `sc-coaching-v1`. It is shared across the site's languages, isolated from existing tool keys.
- A storage error keeps new work in page memory and offers backup export. Closing the page can lose that unsaved work.
- Unreadable stored data is never silently overwritten. Explicit recovery requires a valid backup and confirmation; the unreadable original is downloaded first.
- Revision checks prevent common stale-tab overwrites. These are not a distributed or transactional database; use one editing tab for a project.
- Restore validates the whole backup before changing state, copies project/action/evidence/session IDs and preserves current context and active projects. Maximum backup size is 5 MiB, 100 projects and 2,000 items per project collection.
- User text is escaped when displayed. Embedded configuration escapes HTML script terminators.
- Failed-unit observations require valid dates, whole nonnegative counts, a positive denominator and failed units no greater than total. Duplicate date/period entries are rejected. Rates use summed failed units divided by summed units, not an average of daily percentages.
- Before/after changes are descriptive, in percentage points. They are not presented as proof of causation or significance. The visitor must keep definitions and conditions comparable and check a guardrail.
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

## Next architectural boundary

If the product needs shared coach/client accounts or company teams, add an explicitly designed backend with authentication, access control, tenant isolation, backups and data-retention controls. Keep calculation engines deterministic and keep this individual workflow as the core. Do not describe local storage as cloud backup or pretend a saved reflection is a session with a real coach.
