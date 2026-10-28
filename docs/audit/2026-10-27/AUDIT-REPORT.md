# Stiven Catalyst: independent full-site audit, October 2026

Website: https://stivencatalyst.com · Repository: `catalyst-al/stiven-catalyst` · Report date: 27 October 2026
Mode: **read-only**. Nothing in the repository, the live site, GitHub, Cloudflare or Google Search Console was changed.
There are no commits, pushes, pull requests or deployments. One empty stray file that an audit worker accidentally
created in the checkout (`stats_expected.json`) was moved out again; the working tree is clean.

Evidence tags used throughout:
- **REPRODUCED**: run and observed in this audit.
- **SOURCE**: read in code or data, not executed.
- **SAMPLED**: checked on a stated sample.
- **INFERRED**: reasoned from indirect evidence.
- **OPINION**: an editorial or aesthetic judgment, always with the exact text.
- **NOT VERIFIED**: the check could not be made.

The eight phase reports, with full reproduction scripts and raw outputs, are listed in the appendix. This document
consolidates them. I re-checked these P1 findings myself, by my own run or in the source: T-05, T-06, T-07, E-01 and E-02.
I also re-checked the P2 findings A-01, CI-01, M-04, P-02 and E-04. The other P1 findings (T-01 to T-04, T-08, E-03,
M-01) rest on the workers' reproduction scripts, which are listed in the appendix and can be re-run.

---

## A. Executive assessment

**Overall: 70/100.** This score was computed bottom-up from the weighted section scores in part C. It lands close to
the earlier "70" that you told me not to anchor on. That is a coincidence of the arithmetic, not a target. The
composition is very different from what a 70 usually means: some parts are close to professional grade, and others
fall well short of it.

Stiven Catalyst is no longer a personal blog. It is a trilingual publishing platform:
- 776 generated pages;
- 40 essays, 33 reflections and 289 field notes per language;
- 80 magazine issues, 13 treatise volumes and a special edition;
- a book in three editions;
- six podcast episodes;
- 58 offline browser tools.

The platform rests on a disciplined static build and a large automated test suite (1,078 unit tests, all passing).
Technically it is very clean where a search engine or a casual reader looks: 0 broken links across 776 pages, perfect
hreflang, an exact sitemap, CLS 0–0.002 on reading pages, and complete reduced-motion support. The core statistical
formulas are textbook-correct, and so are the FMEA action-priority table and the Process Lab statistics, which agree
with scipy to 1e-6.

### Strongest achievements
1. **Evidentiary apparatus in Management Review.** About 100 sampled numbers were checked against their sources and
   none was contradicted. The labels "via", "our reading" and "made-up numbers" are rare discipline for a one-person
   publication. No. 50 (*Just culture*) matches a 60-page NHS briefing to the decimal.
2. **Formula correctness and robustness of the tools.** Across about 190 independent numeric checks the core formulas
   were exact. Loading 99 examples and 165 damaged-storage cases produced zero script errors. CSV export is protected
   against formula injection.
3. **A real literary voice, and translation work that respects it.** The book's two translations lose no meaning in the
   body, across 207 text blocks read side by side. The best Albanian reflections (*Fantazma në dhomën plot me pasqyra*,
   *Paradoksi i madh shqiptar*) are literature, not content.

### The three most serious weaknesses
1. **Data integrity between tools.** Example data still leaks into real data. This was re-verified as **not fixed** in
   three separate paths: Damage Control and its family, the Action Tracker, and a Daily Board demo profile that becomes
   "your" targets. Some tool hand-offs silently fail: Cost of Quality never receives Waste Log costs, because of a
   field-name mismatch that the unit test also uses. The English Process Lab reads "47,2" as 2. These are the defects
   a manager would act on, and the test suite does not catch them.
2. **Trust signals undermined by process and velocity.**
   - Management Review states "64 issues changed, each says so", but issues 75–77 were changed without any note.
   - 80 "monthly" issues went online in four days, half of them dated a month in the future.
   - The author's career timeline contradicts itself across essays, including a correction of a correction.
   - 31 polemical reflections in eight days share one rhetorical template, and the German ones mix "Sie" and "du"
     within a paragraph.
3. **Motion cost on the home page and a narrow motion control.**
   - The planet canvas covers 1,945 CSS px of hero on a phone and keeps the main thread at 60–100% busy. At 4× CPU
     throttle that means 13–20 fps and taps taking about 0.6 s.
   - "Pause" exists only on the home hero, is not remembered, and leaves several repaint-heavy loops running.
   - All of this can be fixed **without removing the motion**.

Separately, **Cloudflare Web Analytics is still not collecting anything.** A read-only API query shows 0 page loads
since 1 September. The site is still registered as "automatic setup" for a domain that is DNS-only on GitHub Pages:
the cause the 16 October audit identified, and still unfixed. Readers are not harmed, but the owner has no audience
data.

---

## B. Evidence and coverage

### Audited build and deployment

| Item | Value |
|---|---|
| Commit audited | `3cb88a244c9337b8957a31d9fe499a4827f56c08` (= `origin/main`, "Reflections: The information monopoly, in three languages (#360)") |
| Deployment | GitHub Actions "Build and deploy" run #754 (id 40420483668) for that SHA. Hosting: **GitHub Pages** (`server: GitHub.com`, Fastly); DNS points to GitHub's 185.199.108–111.153, with no Cloudflare proxy |
| Live parity | REPRODUCED: at 23:40–23:45 UTC on 26 Oct the live site still served `abf7f81` (run #748; runs for `1644e43` and `b0d3c00` were cancelled). From **23:50:33 GMT** it served `3cb88a2`: 22 of 22 sampled files are byte-identical to the local build after whitespace normalisation, including the sitemap, feeds and search index |
| Build environment | Isolated clone in the scratchpad. Node 22.22.0, npm 10.9.4, Eleventy 3.1.7. `npm ci` then `npx eleventy`: **66 s, 776 HTML files, 4,877 files, 679 MB `_site`** |
| Unit tests | REPRODUCED: `npm test` gives **1,078 tests, 1,078 pass, 0 fail, 0 skipped, 0 todo** in 110 s. One worker saw one test fail once and pass on re-run (flaky) |
| Browser tests | REPRODUCED: `npm run test:browser` on Chrome for Testing **153.0.8010.12** gives **24 passed, 6 failed** (detail in CI-01/CI-02) |
| CI history | REPRODUCED via the GitHub API: of the last 60 completed `main` runs since 21 Oct, 55 succeeded, 5 were cancelled, 0 failed |
| Browsers used | Headless Chromium 153 only (software raster, no GPU), at widths 320/390/768/1024/1440 in both themes, with and without reduced motion and CPU throttling. **Firefox, Safari/WebKit, real phones, screen readers: NOT VERIFIED** |
| Other tools | Playwright, @axe-core/playwright, jsdom, poppler `pdftotext`/`pdfinfo`/`pdftoppm`, `ffprobe`, pypdf 6.17, scipy/numpy, openpyxl, LibreOffice (for DOCX/XLSX opening), curl, the GitHub Actions API and the Cloudflare API (both read-only) |
| Not available | Google Search Console (no access, no URL list), the Cloudflare dashboard UI, audio transcription (no whisper/vosk), offline grammar checkers |

### Page counts (REPRODUCED from the current build)

**776 HTML pages:** 260 EN, 258 DE, 258 SQ. The two extra EN pages are `404.html` and `offline.html`. `<html lang>` is
correct on all 776.

| Class (per language) | Count | Notes |
|---|---|---|
| Insights (essays) | 40 | the brief's 41 included a `*.11tydata.js` data file |
| Reflections | 33 | 31 of them published 20–27 Oct |
| Field notes | 289 | collected on `field-notes.html` with anchors; no page of their own |
| Projects | 3 | cards on `projects.html` |
| Management Review issues | 80 + special edition (2026-09) | each with HTML and PDF in 3 languages |
| Operational treatise | 13 volumes | |
| From the Floor | 2 issues | |
| Tools Guide | edition 7 (plus 6 archived PDFs) | "fifty-eight tools" is correct: 58 tools plus the DMAIC course |
| Tool pages | 59 | 58 tools in 4 families: Pulse 16, Zenith 18, Lumen 21 plus DMAIC, Atlas 3 |
| Role pages | 4 | |
| Book | 1 page | 3 PDF editions |
| Podcast | 6 episodes | 3 RSS feeds |
| PDFs | 312 files, 259 MB | all linked, all readable |
| Indexable URLs | 762 | in the sitemap exactly; 14 pages are `noindex`, all intentional |

### Coverage matrix

| Area | Fully tested | Sampled | Source-inspected | Inferred | Not verified |
|---|---|---|---|---|---|
| Inventory, links, IA, parity | All 776 pages, all internal links/anchors, the language switcher, click depth | Live parity on 22 files | | | |
| Technical SEO | robots, sitemap, canonicals, hreflang, noindex, JSON-LD parse, feeds | 60 live sitemap URLs | | GSC causes | GSC data and Google's indexing reasons |
| Tools: statistics/quality (23) | 13 tools formula plus UI | 7 tools via their maths objects | work-backup, storage-guard | | Real quota exhaustion; XLSX contents in Excel |
| Tools: lean/planning (33) | 116 scripted checks; FMEA AP all 1,000 combinations; 168 export files; 34 print paths | | eight-d, fishbone, hoshin, kaizen-board, room-status | | Real printers; Excel/Word themselves |
| Career tools and platform data | ATS, CV import, round-trips of 20 keys, 8 crafted backups, XSS payloads | | team-sync worker | | Real ATS products; live sync writes |
| Motion and performance | 15 pages × 5 widths × themes; A/B runs paused/running/reduced | | | Real-device frame rate | GPU devices, Firefox, WebKit |
| Accessibility | axe (64 runs), keyboard, reflow 140 combinations, target size | | | | Screen readers; WCAG items that need human judgment beyond the stated checks |
| Privacy and security | CSP, external requests, storage inventory, XSS, import hardening | | | | Legal (GDPR/TDDDG) conclusions |
| Analytics | **Cloudflare API: 0 page loads since 1 Sep** (REPRODUCED by me); beacon POST gives 404 (REPRODUCED by a worker) | | | | Dashboard UI |
| Editorial | Pattern, n-gram and register scans across all 1,095 texts | 12 insights + 12 reflections × 3 languages read in full; 40 notes × 3 | | | Grammar in the 49 unread long texts |
| Management Review and publications | Inventory, cover/inside consistency, number parity across languages, all PDFs | About 100 numbers (45 claim rows) across 20 issues + treatise + special edition | | | 11 claim rows (sources behind 403/404/504) |
| Book | Full text in 3 languages (207 blocks), all PDFs | | | | Photo locations |
| Podcast | Feeds, enclosures, durations, loudness, artwork | | | | **Spoken content of all 6 episodes** (no transcription) |
| Narration | speechSynthesis stubbed: 219 pages × 3 languages, controls | | | | Real voices, pronunciation, Safari/Firefox |
| CI and maintainability | Unit and browser runs, CI log history, npm audit, test-style census | | Test assertions of key suites | | |

---

## C. Scored assessment

The scores below are my own independent figures. They draw on the workers' proposed scores but are not their
averages. Each criterion is stated so that you can rescore it.

| Area | Weight | Score | Main reasons |
|---|---|---|---|
| Architecture and technical reliability | 10 | **70** | + flawless link/IA integrity, reproducible build, strict CI gates. − example status guessed from data shape, cross-tool contracts tested with invented fixtures, no duplicate detection, sync never deletes, browser journeys fail on current Chrome |
| Mathematical and tool accuracy | 12 | **65** | + formulas exact across about 190 checks. − sample-data merge (P1), CoQ hand-off dead (P1), Process Lab EN decimal comma (P1), ATS score (P1), KPI Diagnostic overclaim, print clipping in 8 tools |
| Visual design and user experience | 8 | **80** | + distinctive, coherent identity; 140 width × theme combinations with no overflow. − broken Zenith radar, blank printed charts, laggy wheel glide, platform-dependent typography |
| Motion and performance | 7 | **62** | + reading pages at 60 fps even at 4× throttle; reduced motion complete; off-screen pausing. − home hero saturates the main thread; Pause incomplete; tool heroes idle at 28–50% of the main thread at 4×; 76 KB gz blocking CSS on tools |
| Accessibility and privacy | 8 | **73** | + axe nearly clean, skip link, focus, complete reduced motion, no third parties on tools, no XSS found. − no persistent site-wide motion control (WCAG 2.2.2), privacy page incomplete, guest data cannot be erased from team sync, sync key design |
| English editorial quality | 9 | **70** | essays 75–80; reflections about 62 (template, calques) |
| German editorial quality | 7 | **64** | essays about 78 and idiomatic; reflections about 52 (Sie/du in 23 of 33, "Fläche", calques) |
| Albanian editorial quality | 8 | **69** | the liveliest prose on the site, but formulaic reflections, ju/ti mix and one arithmetic error that originates in Albanian |
| Books, magazines and publication credibility | 10 | **78** | book 86 (fidelity, layout); magazines 75 (0 contradicted claims, but undisclosed changes, dating model, an overclaiming method box, no AI note in the PDFs) |
| Podcast and narration | 4 | **64** | podcast technically excellent but spoken content unverifiable, and only 2 of 80 issues have episodes; narration reads the feedback form and skips case-box content |
| SEO and discoverability | 7 | **80** | technical eligibility about 95; deductions for content signals (one inbound link per reflection, bulk-dated issues, PDF duplicates, missing lastmod, no specialised schema) |
| Professional identity and long-term value | 10 | **68** | distinctive and honest method; credibility dented by timeline contradictions, silent corrections, velocity, and generalisations in the reflections |
| **Overall (weighted)** | 100 | **70** | Σ(weight × score)/100 = 70.4 |

**How the weights were chosen.** The tools and the publications carry the most weight (12 and 10) because readers
act on their numbers. The editorial areas together carry 24, split by the size of each audience and corpus. Podcast
carries 4 because it is six episodes. A score of 90 or more means "would pass a professional editor's or QA lead's
review with only polish". 75–89 means "professional with notable fixes". 60–74 means "credible, with defects a careful
reader or user will hit". Below 60 means "unreliable for its stated purpose".

---

## D. Defect register

No defect was rated **P0**: no data loss on the normal path, no security hole and no legal breach were found. The
register below lists P1 and P2 in full and summarises P3. The worker report named in brackets holds the exact
reproduction scripts.

### P1 (serious: wrong numbers users act on, or a visible credibility break)

| ID | Problem | URL / source | Evidence and steps | Expected vs actual | Impact | Confidence | Suggested correction | Regression risk |
|---|---|---|---|---|---|---|---|---|
| **T-01** | Example rows become real data in Damage Control and every `logBook` tool [p2a P2A-01] | `/tools/damage-control/` and incomplete-control, night-audit, delay-analyzer, daily-board; `src/js/tool-kit.js:943-958, 1037-1048, 1160-1167` | REPRODUCED (`t01-example-merge.cjs`). Open the tool (example loads), delete 1 example row, add 1 own entry | Exp: the example is removed or stays labelled. Act: 29 example rows stay, unlabelled, as the user's data | Rates, DPMO and Pareto mix fictional and real data | High | Track example rows by ID/flag, not by shape; on the first real entry, offer "remove the example" | Medium: touches every log tool; needs migration of saved state |
| **T-02** | A persisted example is shown as real by the aggregators [P2A-01b] | `/tools/shift-pulse/`, `/tools/ops-report/`, `/tools/signals/` | REPRODUCED (`t01b`). Visit three logs and click only the "week" and "all" range buttons | Exp: nothing saved, or labelled "example". Act: "Damage rate 0.55% · On-time 79.5%", "Damage Control 30 entries" | A manager's report contains invented numbers | High | Do not persist on view changes; carry an `example:true` stamp that every consumer honours | Medium |
| **T-03** | Action Tracker example merges into the shared action list [p2b P2B-02] | `/tools/action-tracker/`; `action-tracker.js:81-91, 490ff`; `actions-store.js` | REPRODUCED (`t14`). First visit writes 12 example actions ("Anna", "Besnik") to `sc-actions`; then one real hand-over from any tool | Exp: the example is kept separate. Act: 13 rows, the note disappears, "Clear the example" no longer works; fake actions count as overdue and go into exports and `.ics` files | The cross-tool action list is polluted | High | Keep examples in memory (the pattern Signals, Ops Report and Site Compare already use) | Medium |
| **T-04** | Daily Board writes a demo workplace profile on the first visit [P2A-03, P2A-04] | `/tools/daily-board/`; `daily-board.js:654-670` | REPRODUCED (`t21`, `t21b`) | Exp: no targets until the user sets them. Act: `sc-workplace` holds "Frankfurt hub", targets 0.3/0.5/95/80, and the user's own Damage log is judged "against the workplace profile". Days turn red against hidden defaults with the target box empty | Undeclared KPI targets (previously reported as fixed) | High | Never write the profile from an example; show "no target set" | Low |
| **T-05** | Cost of Quality "Bring in" never imports Waste Log costs [P2A-02] | `/tools/cost-of-quality/`; `cost-of-quality.js:163-170` reads `quantity`/`unitCost`; `waste-log.js:4, 26` saves `qty`/`cost`; `tests/cost-of-quality.test.cjs:146` uses the wrong names | REPRODUCED by the worker; source mismatch confirmed by me | Exp: €25 brought in. Act: "Nothing to bring in" | Cost of quality is understated | High | Read `qty`/`cost`; build the test fixture from the real Waste Log store | Low |
| **T-06** | Process Lab (EN page) misreads decimal commas [P2B-01] | `/tools/process-lab/`; `process-lab.js:8-31`, `tool-kit.js:178-189` | **REPRODUCED by me** (`work/p10/pl.cjs`): `parseValues("47,2\n48,1\n46,9\n47,5\n48,0")` gives `2,1,9,5,0` on EN and `47.2…48` on DE | Exp: 47.2… or a warning. Act: "Mean 5", "Cpk −2.42 … 1,000,000 per million outside", "follows a normal curve" | A capability study from German or Albanian Excel data is silently wrong | High | Detect a single-column comma-decimal pattern on every language, or warn | Low |
| **T-07** | ATS CV match score rewards filler and drops hard skills [p2c P2C-01] | `/tools/ats-cv/`; `ats-cv.js:83-101, 520-560` | REPRODUCED (`ats-ads.cjs`, `ats-ui.cjs`); keyword selection by frequency confirmed by me at `:84-99` | Ad asking for Lean, SQL, WMS, SAP EWM, Power BI, KPIs: the 24 "key words" contain none of them but do contain "using/ensure/drive/weekly". A CV of filler words scores 100%; a CV with the real skills scores 38% | Job seekers get advice that is the wrong way round | High | Weight capitalised/acronym and multi-word skill terms; keep 2-letter acronyms; a domain stop-list; drop the unsourced 60% "pass" | Medium |
| **T-08** | CV import corrupts the site's own CV Builder PDF [P2C-02] (P1/P2) | `/tools/ats-cv/` "Drop in your CV"; `cv-import.js` | REPRODUCED (`imp2.cjs`) | "+49…" loses "+"; dashes lost; 4 jobs land as raw text; one date range reversed. `pdftotext` reads the same PDF correctly | A wrong phone number on a CV | High | Fix the PDF line reconstruction; add a round-trip test from CV Builder output | Low |
| **E-01** | Management Review: undisclosed changes, and a false claim that each changed issue says so [p5 P5-01] | `/magazine/management-review-nr-75.html`, `-76`, `-77` (3 languages); `lib/weekly/common.js` (`checked.issues`); `docs/revista/management-review-nr-76.md:15-22` | SOURCE + REPRODUCED. No. 76's record documents 731→499 and the denominator 456→397; the EN page has no correction note (verified by me). The archive and How-this-is-made say "64 issues changed, each says so" | Exp: every change is noted. Act: Nos. 75–77 are silent; 74 and 79 are missing from the list | The corrections promise, the publication's core trust device, is untrue | High | Add dated notes to 74–77 and 79, correct the count, and generate the list from the records | Low |
| **E-02** | German reflections mix "Sie" and "du" in the narrator's voice [p4 P4-01] | `/de/reflections/*` (23 of 33); e.g. `src/content/de/reflections/2026-10-26-the-blame-culture.md:16` | REPRODUCED (scan); line verified by me: „Lassen Sie mich das mit aller Klarheit sagen … hast du nichts behoben; du hast nur dafür gesorgt …“ | Exp: Sie or "man" throughout (FJALORI requires Sie). Act: mixed within a paragraph | Reads as careless to the German audience the site courts | High | Render generic "ti" as "man" or "Sie" | Low (text) |
| **E-03** | The career timeline contradicts itself [P4-02] | `src/content/insights/2026-10-13-the-tools-you-build-yourself.md:44-52`; `…night-the-system-went-down.md:42-45`; `…when-a-new-system-arrives.md:45-48`; `…starting-from-zero.md:46`; `…the-first-30-days.md:43` | SOURCE | One essay keeps the 15 Oct correction that two sister essays call "itself inexact" (17 Oct), and its body still says "September 2026 … at the hotel". The home-page pick *Starting from zero* stops at June 2025. The same night is told as fact twice, and one telling calls itself "the only scene … that is not a picture" | Credibility on exactly the first-person facts an employer checks | High | Apply the 17 Oct wording in 3 languages; add one dated line of 2025–26 roles; make one career-timeline source of truth | Low |
| **M-01** | Home hero saturates the main thread [p3 PM-1] | `/`, `/de/`, `/sq/`; `src/js/cosmos.js:196-215, 963-1013` | REPRODUCED (interleaved A/B). Main-thread time per 5 s: desktop 3.4–4.1 s running vs 0.05 s reduced; mobile at 4× 5.1 s (18–20 fps) vs 0.12–0.18 s. Canvas 780×3,892 backing pixels on a phone; quality steps down only after 15–20 s; tap latency about 600 ms vs 320 ms | Exp: under about 30% of the main thread on a mid-range phone. Act: saturated | Sluggish first impression on mid-range phones; battery | Medium (software raster overstates GPU devices) | Size the canvas to the planet system, not the whole hero; start at DPR 1 on weak devices; fewer particles on phones. **Keep the motion** | Medium (visual identity: needs side-by-side review) |

### P2 (moderate)

| ID | Problem | Location | Evidence | Suggested correction |
|---|---|---|---|---|
| T-09 | Print/PDF cuts off table columns in 7 statistics tools (EN, DE, SQ) | guest-complaints, waste-log, lost-found, andon, oee, energy-tracker, sigma-control-chart [P2A-06] | REPRODUCED (`t15-print.cjs`, `page.pdf`): e.g. Andon loses the Respond, Solve and Line-stop columns | Print stylesheet: wrap, landscape option, or column priority |
| T-10 | A3 print keeps only the WHAT column of the countermeasures table | `/tools/a3-report/` [P2B-06] | REPRODUCED (PDF crop) | as T-09 |
| T-11 | KPI Diagnostic names a "most likely" cause from a 2-point gap on self-ratings, with no caveat | `kpi-diagnostic.js:43-48` [P2A-08] | REPRODUCED (`t07`) | "Leading hypothesis" wording; require a margin; show the tie |
| T-12 | Sigma chart calls one low point "a lasting improvement"; σ "6+" on 250 zero-defect units | [P2A-09, P2A-12] | REPRODUCED (`t03`) | Require a rule (run, trend) before "lasting"; show a confidence caveat for small n |
| T-13 | Signals: about 19% of days on rare-event counts show a "good side" signal from noise | [P2A-11] | REPRODUCED (Monte Carlo, 3,000 runs) | Suppress lower-side signals when the LCL is 0 or the mean is below about 1 |
| T-14 | Site Compare ranks a 2-route depot first, above a 2,000-route hub | [P2A-13] | REPRODUCED (`t13`) | Minimum volume or coverage before ranking; show n |
| T-15 | Andon duration wrong across DST: 30 min shows as 1,410 min (25 Oct fall-back) | [P2A-05b] | REPRODUCED (`t11`) | Use timestamps (epoch) for live calls |
| T-16 | Daily Board 5S score 80% vs 50% in four other tools for the same audit | [P2A-05] | REPRODUCED | One shared 5S scoring function |
| T-17 | Same CSV imported twice doubles the log silently | [P2A-07] | REPRODUCED | Duplicate detection or a warning |
| T-18 | Hotel KPIs accept 120 rooms sold of 100 available (120% occupancy) | [P2A-14] | REPRODUCED | Validate sold ≤ available |
| T-19 | Hand-offs to Action Tracker duplicate actions or report "Added 12" when storage is full and nothing was saved | SMED, Time Study, Kaizen Board [P2B-03] | REPRODUCED | Reuse VSM's de-duplication; surface `actions-store` failures |
| T-20 | Heijunka freezes the tab (4.6 s per keystroke at 20,000 units/week; a 1e9 demand hangs the tab) | [P2B-04] | REPRODUCED | Input caps; a non-quadratic sequence |
| T-21 | Room Inspection passes a room after 1 of 34 items ("100%, Pass") | [P2B-05] | REPRODUCED | No verdict until all items are judged or explicitly N/A |
| T-22 | XLSX export turns "00123" into 123, in all tools | [P2B-07] | REPRODUCED | Write text cells as strings |
| T-23 | Time Study calls the median observed time the "standard time" (no rating or allowance); the Tools Guide repeats it | [P2B-09] | REPRODUCED | Rename to "observed (median) time", or add rating and allowance |
| T-24 | CV/ATS PDF cuts blocks longer than a page (46 of 70 bullets survive) | [P2C-03] | REPRODUCED | Allow page breaks inside blocks |
| T-25 | Team sync never propagates deletions, so guest names and phones (Lost & Found, Guest Complaints) cannot be erased | `team-sync.js:345-372` [P2C-04] | REPRODUCED (`merge.cjs`) | Tombstones with expiry |
| T-26 | Sync key: space ID and write token are unsalted SHA-256 of the 6-word code (about 62 bits), bypassing the 310k-iteration PBKDF2; no rate limit on creating spaces; `localhost:8080` is an allowed origin in production | [P2C-05] | SOURCE + 3 live GETs | Derive the IDs through the KDF with salt; rate-limit; remove the dev origin |
| T-27 | "All your work in one file" omits photos (IndexedDB) and restore points | [P2C-08] | REPRODUCED | Include them or change the claim |
| T-28 | ATS matching is not Unicode-normalised: NFD "Führung" becomes the keyword "hrung"; "përgjegjës" ≠ "pergjegjes" | [P2C-09] | REPRODUCED | NFC plus diacritic folding (as search already does) |
| P-01 | Privacy page incomplete: the IndexedDB photo store, `sc-seen-*` keys on first visit, most tools with personal data; analytics location stated wrongly | `/datenschutz.html` (3 languages) [P2C-07] | REPRODUCED inventory | Generate the storage list from the code |
| P-02 | Narration reads past the essay into the feedback form, privacy line and "Join in" box, on all 219 narrated pages | `listen.js:28` (SKIP lacks `.essay-feedback, .essay-join, form`) [P7-01] | REPRODUCED by the worker; SKIP list confirmed by me | Add those selectors |
| P-03 | Narration reads the case box heading but skips its content, including "What cannot be confirmed" | `listen.js` [P7-02] | REPRODUCED | Include `dt/dd` |
| P-04 | Narration privacy note says "a voice of your own browser … sends nothing" but online voices (Google, Microsoft Natural) are used when no local voice exists, and the note recommends Edge for Albanian | [P7-03] | SOURCE + INFERRED | State that online voices send text to the vendor; prefer local voices |
| P-05 | Albanian podcast No. 1 has no correction, although EN (4 cuts) and DE (3 cuts) needed them | [P7-04] | SOURCE | Check SQ, or state that it was checked |
| E-04 | Management Review dating model: 80 "monthly" issues online in 4 days; Nos. 41–80 say "November 2026" but "Online since 10 October"; the special edition says "September" but went online 4 Oct | `lib/weekly/issues/41.js:8` … `80.js` [P5-02, SEO-01] | REPRODUCED (verified by me in `_site/magazine/management-review-nr-80.html`) | Date issues by real publication, or call them "No. 41 of a series published October 2026" |
| E-05 | Method box overclaims: "Figures that could not be confirmed are not in the issue" | e.g. No. 1 (Garvin 70→77% not in the cited book), No. 21 ("in 2023" unseen); 207 of 648 sources (32%) are "via" [P5-03] | SOURCE + SAMPLED | Reword to what was done; flag second-hand figures in the text |
| E-06 | PDFs carry no AI-production disclosure and speak of "the editors" | all 291 publication PDFs [P5-04] | REPRODUCED | One colophon line + a link to How-this-is-made |
| E-07 | Chart labels overflow on phones: 105 labels on 61 of 285 pages; DE No. 45 hides "mindestens monatlich" | [P5-05] | REPRODUCED (390 px) | Wrap labels; measure in a test |
| E-08 | Reflections run on one template: "Let me be clear" in 25 of 33, followed by a bold "X is not A; it is B" in 21; a verbatim long sentence shared by two pieces of 26 Oct; 8 close "at the end of the day" | [P4-03] | REPRODUCED (n-gram scan) | Author decision; vary the openings and closings, with fewer pieces |
| E-09 | Arithmetic in *Haggling over a year of life* (SQ original): 30,000 old lek a month is "a thousand per working day" (it is per calendar day); the bus/coffee comparison is off by about 4× | `src/content/sq/reflections/2026-10-22-the-bargain-with-a-year-of-life.md:6, 22` [P4-04] | SOURCE (arithmetic); prices INFERRED | Fix "ditë pune"; verify or drop the comparison |
| E-10 | *Five questions* builds on "fourteen days of leave, as the law says"; old lek is not glossed for EN/DE readers | `src/content/*/reflections/2026-10-20-five-questions.md:12, 36-40` [P4-05] | SOURCE; the legal point is **NOT VERIFIED** (my understanding: the Albanian Labour Code sets a minimum of four weeks) | Author to check the statute; gloss "≈ €500" |
| E-11 | Opinion presented as established fact in reflections ("world history knows not a single case…", "a fact no one can deny", the aviation/surgery "investigating board") | [P4-06] | SOURCE | Mark as conviction or cite |
| E-12 | *The night the system went down* disowns its own title (6 caveats in about 1,000 words plus two correction notes) | [P4-07] | REPRODUCED count | Retitle or merge into *The first 30 days* |
| B-01 | Back cover: SQ "çfarë ka mbetur brenda tij" is translated "within **it**" (EN, the city) but "in **ihm**" (DE, the person, matching the book's own "Qyteti brenda nesh") | `scripts/book/{sq,en,de}.txt:451`; `src/_data/books/*.json` blurb[1] [P6-01] | SOURCE | **Author decides** the intended reading; if the inversion is meant, EN becomes "within him" |
| M-02 | "Pause the motion" leaves the box-shadow glows, shine and share-ring spin running (0.9–1.8 s per 5 s; 3.9–4.8 s at 4×) | [PM-2] | REPRODUCED A/B | Pause all decorative loops; test behaviour, not CSS text |
| M-03 | Pause exists only on the home hero and is not remembered; tool, book and issue pages run 3–15 endless animations with no control (likely WCAG 2.2.2 failure) | [PM-3] | REPRODUCED | One persisted site-wide motion toggle |
| M-04 | Zenith radar broken: two `@keyframes family-sweep`, the later one wins (fade-and-pop instead of rotation); `step-reach` defined twice | `src/css/04-…css:514` vs `10-…css:426`; `11-…css:839` vs `:1690` | REPRODUCED by the worker; **duplicates confirmed by me** | Rename one keyframe |
| M-05 | Printing an issue before scrolling gives blank figures | `weekly.js:27-40`; `08-…css:816-822` [PM-5] | REPRODUCED | `@media print` override |
| M-06 | Desktop wheel "glide" makes scrolling slow (0.36–0.40 s per notch; 1.1 s on the home page at 4×) | `src/script.js:185-215` [PM-6] | REPRODUCED | Remove or restrict to anchors; native scrolling |
| A-01 | **Cloudflare Web Analytics collects nothing** | `src/_data/site.json` token `51fb88e3…`; Cloudflare RUM site `auto_install: true` for a DNS-only domain | **REPRODUCED by me** (read-only API): `rum/site_info/list` shows the auto-install site created 5 Oct; GraphQL `rumPageloadEventsAdaptiveGroups` returns **0 rows from 1 Sep to 26 Oct and 0 in the last 7 days**. The worker saw the live beacon's RUM POST answered with 404 | Owner action in the Cloudflare dashboard: add a **manual** (non-proxied) site and put the new token into `site.json` (as already documented on 16 Oct) |
| SEO-02 | Each of the 99 reflection pages is linked from only one page (the reflections index) | [SEO-02] | REPRODUCED (link graph) | Previous/next and related links |
| CI-01 | The browser journey "search → a result, by keyboard only" fails on current Chrome with an uncaught "Transition was aborted because of invalid state. Page already revealed" | `tests/browser/journeys.spec.mjs:38`; likely cause `search.js:85` `history.replaceState` during an incoming cross-document view transition (`01-foundation.css:445`) | **REPRODUCED by me**: 11 of 12 serial runs failed on Chrome 153; isolated in `work/p10/vt3.cjs` (keyboard Enter on the header link, then type at once). Mechanism INFERRED | Defer `replaceState` until `pagereveal`/transition `finished`, or catch the rejection |
| CI-02 | CI's browser tests run on Playwright 1.56.1's bundled Chromium (about a year older than current stable), so they cannot see failures current browsers produce | `package.json` `@playwright/test 1.56.1`, `deploy.yml` | REPRODUCED (CI green on the same commit where Chrome 153 fails 6 of 30) | Bump Playwright regularly; run one job on the current Chrome channel |
| CI-03 | Cross-tool contracts are tested with invented fixtures (T-05 passed its unit test); `cosmos-pause.test.cjs` checks CSS text only; the chart-note test only checks that a note is longer than 20 characters | `tests/cost-of-quality.test.cjs:146`; `tests/cosmos-pause.test.cjs`; `tests/weekly.test.cjs` | SOURCE + REPRODUCED | Contract tests that write with tool A's real store and read with tool B |
| CI-04 | No test checks that the 312 committed PDFs match their HTML/source text; PDFs are built offline and committed | `tests/weekly.test.cjs:144, 166` (existence only) | SOURCE | A text-diff check with `pdftotext` for a sample on every build |

### P3 (minor or polish), summarised

- **Tools:**
  - Damaged saved data is silently replaced by the example, and six tools overwrite damaged data before the restore point can capture it (P2A-10, P2B-08).
  - `.ics` files: unfolded lines and English labels in DE/SQ (P2B-10).
  - Partial 5S audits count as full audits (P2B-11).
  - 5 Whys gives no save-failure warning (P2B-12).
  - Heijunka takt drops a product without pack-out (P2B-13).
  - VSM bottleneck chosen by cycle time (P2B-14).
  - ABC ties (P2B-15).
  - Gage R&R interaction α = 0.05 against a comment claiming Minitab parity (P2B-16, Minitab default NOT VERIFIED).
  - Hoshin export file names (P2B-17).
  - Per-language storage silos work (P2B-19).
  - A zip-bomb DOCX freezes the tab for more than 4 minutes (P2C-06).
  - The shelf accepts a `/\host` link from a crafted backup (P2C-11).
  - Search caps the count at 30 and misses "fuehrung" and "C#" (P2C-12).
  - Coaching import is not idempotent (P2C-13).
  - The cover-letter example fails its own word check (P2C-14).
  - The coaching doc is stale (P2C-15).
  - Occupancy and Lost & Found ratio details.
- **Performance and accessibility:**
  - Tool idle animations use 28–50% of the main thread at 4× (PM-8).
  - The CX Control Tower has 32 tabbable chart dots (PM-9).
  - The share button covers focused footer links at 390 px (PM-10).
  - One light-theme contrast failure (3.6:1, PM-11).
  - One heading-order skip (PM-12).
  - Platform-dependent typography: Inter never loaded on screen pages (PM-13).
  - A 436 KB raw / 76 KB gz render-blocking CSS file on tool pages (PM-14).
  - CSP `style-src 'unsafe-inline'`, `form-action https:`; no HSTS or frame-ancestors, which GitHub Pages cannot set (PM-15).
  - 42 smooth `scrollIntoView` calls ignore reduced motion.
- **SEO:**
  - About 71% of tool-page text is template (SEO-03).
  - Each publication exists as HTML plus 3 indexable PDFs (SEO-04).
  - 543 sitemap URLs lack `lastmod` (SEO-05).
  - No `og:locale`, and English WebSite descriptions on the DE/SQ home pages (SEO-06).
  - No Book, PodcastSeries or Periodical schema (SEO-07).
  - 260 titles longer than 70 characters (SEO-08).
  - English-only 404 (ARCH-01).
  - Thin hubs (ARCH-02).
  - Field notes have no addressable URLs (ARCH-03).
- **Editorial:**
  - Albanian ju/ti mixed in 25 of 33 reflections, colon capitals, "lidershipi" vs "udhëheqja", "procedurë standarde operimi", "eskalimi" against FJALORI (P4-08).
  - German "schwachen Wasserdruck", "verlange", "mit zu wenig", "Fläche" (P4-09).
  - English calques such as "the insecurity of his own chair" (P4-10).
  - Straight vs curly quotes between sections (P4-11).
  - Albanian slips "në treg modern", "Venedik", "fishbone" (P4-12).
  - The projects page overstates ("Operational Runbooks" has no runbook) (P4-13).
  - Self-undermining caveats (P4-14).
  - The disclosure states the translation direction wrongly for reflections and the book (P4-15, P6-05).
  - Ethnic generalisations, e.g. "the Albanian would try to bribe the binary code itself" (P4-16, OPINION).
- **Publications:**
  - Truncated percentage axes in 36 of 156 charts (P5-06).
  - Garbled German caveat in Treatise Vol 4 (P5-07).
  - PDFs untagged, with no `/Lang`, author or links (P5-08, P6-04).
  - Citation slips in Nos. 21 and 75 and the special edition (P5-11).
- **Audio:**
  - Loudness of −16.9 to −18.1 LUFS against a stated −16, and one file at +0.6 dBTP (P7-06).
  - `audio.mjs` deletes corrections on re-encode (P7-07).
  - The three feeds share one title (P7-08).
  - The live MP3 MIME type is `audio/mp3` (P7-09).
  - German book: "bei Gjergj Kastrioti Skënderbeu" reads as a person (P6-02).
  - The snow photograph on p. 23 is soft (P6-06).
- **Maintenance:**
  - `npm audit` reports **1 high** advisory (markdown-it ≤ 14.3.2, two quadratic-time DoS advisories; build-time only, fix available). `docs/DEPENDENCIES.md` still says 0.
  - The `.git` directory is 533 MB and `_site` is 679 MB, driven by committed PDFs and media.
  - One flaky unit test.
  - The "shelf restore" browser journey timed out once in 30 runs under load.

---

## E. Comparison with previous audits

None of these comparisons relies on a commit message. Every "fixed" was re-tested on `3cb88a2`.

### Confirmed fixed (independently re-verified)
- **On-time % in Shift Pulse / Shift Handover:** fixed. All three tools give 55.6% on a fixture with grace, unknowns and a midnight crossing; the definition is consistent (REPRODUCED).
- **Period totals:** fixed. Day vs week and month vs week agree, including across the 25 Oct DST change (REPRODUCED).
- **Unicode handling in CSV:** fixed. "Ünïcödé 🚚 Çelës", quotes and semicolons round-trip in 3 languages (REPRODUCED).
- **ATS substring matching:** fixed. "Java" no longer matches "JavaScript", "SQL" not "MySQL", "lean" not "clean" (REPRODUCED). However, ATS **scoring** is now the larger problem (T-07).
- **CSV formula injection:** fixed (`csvSafe`, REPRODUCED).
- **Header overflow on phones (13 Oct audit):** fixed. 140 width × theme combinations at 320–1440 px show no overflow (REPRODUCED).
- **Font-swap and family-sky CLS (16 Oct):** fixed. CLS 0–0.002 on reading pages (REPRODUCED).
- **Shelf and other noindex pages in the sitemap (13 Oct):** fixed. The sitemap equals exactly the indexable pages (REPRODUCED).
- **CI gates (17 Oct A01):** in place. `pipefail`, `# fail 0` and `# skipped 0` in `deploy.yml`; 0 failed main runs in the last 60 (REPRODUCED via API).
- **Notes list moved out of the home HTML; search index versioned:** confirmed (SOURCE + REPRODUCED by a worker).

### Still open
- **Sample data merging with real data:** **not fixed** (T-01 to T-04).
- **Undeclared KPI targets:** **not fixed** (T-04, Daily Board; OEE 85% and the CX 20-min fallback are P3).
- **Unsupported diagnostic conclusions:** **not fixed** (T-11, T-12, T-14).
- **False statistical alarms:** **partly** fixed. Limits and rules are exact, but there are low-count false signals (T-13).
- **Print clipping:** **not fixed** (T-09, T-10, T-24, plus blank printed charts M-05).
- **Incorrect denominators:** mostly fixed; occupancy above 100% is accepted (T-18), and the Daily Board 5S score is pooled (T-16).
- **Cloudflare analytics (16 Oct):** still collecting **nothing**. Same token, same auto-install site, 0 page loads (A-01).
- **Infinite box-shadow animations, CSS bundle size, titles over 70 characters (16 Oct "for the author"):** still as before (M-02, PM-14, SEO-08).
- **Large monolithic scripts (17 Oct "remaining"):** still `cx-tower.js` with 2,457 lines; `cosmos.js` is the main performance hotspot (M-01).
- **The Listen bar shifting text on appearance (16 Oct):** not re-measured; NOT VERIFIED.

### Regressed, or claims that do not hold
- **`npm audit` "0 vulnerabilities" (17 Oct A05):** now **1 high** (markdown-it). `docs/DEPENDENCIES.md` is stale.
- **"29 charts got base/unit notes" (17 Oct A02):** a worker counts **28** charts with their own note. The guarding test only checks that a note is longer than 20 characters (CI-03).
- **"64 issues changed, each says so":** false. Nos. 74–77 and 79 were changed outside that list, and 75–77 carry no note (E-01).
- **Register rules in FJALORI (16–17 Oct editing pass):** the 31 reflections added after that pass do not follow them (German Sie/du, Albanian ju/ti). This is a process regression rather than a code one.
- **Browser journeys (17 Oct A07):** green in CI, red on current Chrome (CI-01/CI-02). This is environment drift exposed, not new code.

### New findings in this audit
All of section D except the items listed above. The largest are T-05, T-06, T-07, T-08, E-01, E-03, M-01, M-03, M-04,
P-02 to P-04, T-25 and T-26.

---

## F. Editorial review

### Method
- **Read in full:** 12 insights and 12 reflections, in all three languages, aligned paragraph by paragraph, plus 40
  seeded-random field notes per language.
- **Machine scans:** register, template, n-gram and glossary scans across all 1,095 texts.
- **Book:** the full text, all 207 blocks, in 3 languages.
- **Management Review:** about 100 numbers checked against sources.

### Strongest representative samples
- ***Pareto and 5 Why in practice*** (EN/DE/SQ) refuses to invent the missing third to fifth "why": "The record stops
  at the second why. I could fill in the third… now with sentences that sound good." This is "management without
  theatre" enacted. The German („ob auch eine Ursache, steht auf einem anderen Blatt“) is idiomatic, not translated.
- ***Fantazma në dhomën plot me pasqyra*** (SQ original) has a real scene (Lorenzo in Venice), self-irony ("E di. Po e
  shkruaj këtë në një faqe publike, nën emrin tim. Ironinë e shoh edhe vetë.") and an earned ending. It is literature,
  and should not be turned into a case study.
- ***The report a machine wrote*** is the best piece on AI on the site: a concrete case of two conflicting breakfast
  numbers, and a clear five-point standard.
- **Management Review No. 50 (*Just culture*)** matches every sampled number in the 60-page NHS 2025 briefing to the
  decimal, states the base (206 trusts, weighted) and the study's limits.

### Weakest representative samples
- ***The blame culture*** (reflection, DE): „Lassen Sie mich das mit aller Klarheit sagen … hast du nichts behoben“
  (`de/reflections/2026-10-26-the-blame-culture.md:16`) mixes the register in one paragraph. It also follows the shared
  template, and in English "Look at how the industries work that carry human lives on their shoulders" (`:18`) is a
  calque. The claim of an "investigating board" in surgery is unsourced and doubtful.
- ***Haggling over a year of life*** (SQ original): "Tridhjetë mijë lekë të vjetra janë një mijë lekë në ditë pune"
  (`:22`) is wrong arithmetic: per calendar day, not per working day. The translations silently correct it.
- ***The night the system went down***: "In the first essay of this series I promised an essay about 'the night the
  system went down…'. I did not see that." Six caveats in about 1,000 words plus two correction notes. Honest, but the
  essay is told three times what it cannot say.
- **Management Review No. 21 (*The middle manager*)**: its cover figure rests on a Wharton summary that now returns
  404, it relies on press excerpts, gives a year that was never confirmed, and credits Deloitte figures to the wrong
  page. Nothing in it is contradicted, but it is the weakest-sourced issue in the sample.

### By body of work
- **Management Review.** It has a stronger evidentiary system than most corporate newsletters. Its weaknesses are
  process ones:
  - publication velocity: 80 issues in 4 days;
  - an artificial dating model;
  - a method statement that promises more checking than was done;
  - a corrections record that is not complete;
  - no AI disclosure in the PDF, which is the artefact people share.

  These are fixable with metadata and wording, not rewriting.
- **Personal essays (insights).** Coherent, honest and practical. The reader can tell a first-hand incident, a
  recollection and a "what I would do today" apart, and research claims are essentially absent. Two weaknesses:
  - One template runs through them: a "Three moves" block, a checklist, and "What I would do differently" in 17 of 40.
  - About 26% of paragraphs are a single sentence, which gives a "LinkedIn cadence".

  The 16–17 Oct pass rewrote all 40 essays in all three languages with AI. The published essays are therefore an
  AI-edited text, which the disclosure page should describe precisely.
- **Reflections.** The liveliest and most original writing on the site, and the most formulaic:
  - 25 of 33 use the "Let me be clear" device;
  - 14 invoke "true leadership";
  - 17 of 33 invoke Albania or Albanians, some as generalisations that read as stereotype once translated into German.

  The volume (31 in 8 days) dilutes the voice.
- **The book.** The quality is high. Both translations keep the chiasmus and the "city within us" inversion in the
  body (sections 08.5, 07.3, 15.7, 31.5 and 32.7). There is one real open question, on the back cover (B-01), and two
  small German nuance shifts. Page N of each edition carries the same passage, the same 10 photos and identical
  margins. **Neither translation has genuinely lost meaning** in the body. Do not rewrite it.
- **Podcast.** Technically clean (feeds, enclosures, artwork, durations), and the AI voice is disclosed. **What the
  episodes say is NOT VERIFIED**, because no transcription was possible. Only 2 of 80 issues have episodes.

### By language
- **English (70):** grammatical and controlled. The reflections carry translation calques.
- **German (64):** the essays are near-native (about 78). The reflections are pulled to about 52 by the Sie/du mix,
  "Fläche" and literal calques ("die Unsicherheit seines eigenen Stuhls").
- **Albanian (69):** native and vivid, and the strongest voice. It is also where the template and the arithmetic error
  originate, and it has register (ju/ti) and FJALORI inconsistencies.

---

## G. Professional benchmark

- **Personal blog or professional platform?** A professional publishing and management platform, by scope and
  engineering. Evidence: 776 trilingual pages with perfect hreflang and link integrity; a magazine with source records
  per issue; 58 tools with exact formulas; a CI pipeline that refuses to deploy on any failed or skipped test. Its
  editorial operation, though, is still that of one person moving very fast with an AI assistant, and that shows in
  velocity, templates and record-keeping.
- **Does it resemble a premium independent publication?** In design and identity, yes: the planet families, motion,
  typography and the book's layout are distinctive and consistent. In editorial process, not yet. Premium publications
  date honestly, disclose every correction, and do not publish 80 issues in four days or 31 opinion pieces in eight.
- **Areas that approach professional standards:**
  - technical SEO and information architecture (about 95 technical eligibility);
  - the core formulas of the tools;
  - Management Review's sourcing and labelling;
  - the book's translations and layout;
  - reduced-motion and reflow accessibility;
  - the German and Albanian of the essays.
- **Areas below that level:**
  - cross-tool data integrity (examples, hand-offs, decimal parsing);
  - the ATS scorer;
  - print output of tables;
  - the corrections record and dating model;
  - the career timeline;
  - the German reflections;
  - home-page motion cost on phones;
  - analytics (non-functional);
  - narration scope.
- **Would a serious operations leader, editor or employer find it credible?**
  - **An operations leader** would trust the formulas but could be misled by T-01 to T-06 if they use the tools on
    real data. They would notice a Daily Board judging their numbers against targets they never set.
  - **An editor** would respect the source apparatus and flag the dating model, the silent corrections and the
    reflections' template.
  - **A prospective employer** would be impressed by the range, and might then find the timeline contradictions
    (E-03), which is the most damaging finding for the site's career purpose because it is cheap to fix and sits
    exactly where trust is asked for.
- **What is genuinely distinctive?** An operations practitioner's method, written down and turned into working
  instruments, in three languages, under one visual identity:
  - "check the category, separate the process from the person, write what you would do today";
  - refusal to invent data (Pareto, Damage);
  - the "via" and "our reading" labels;
  - a literary Albanian voice that also writes a book about Durrës.

  Very few independent sites combine a usable toolset, a sourced magazine and literature.

---

## H. Prioritised improvement roadmap

Effort is S (< 1 day), M (1–3 days) or L (> 3 days). "Approval" means an author decision is needed before
implementation.

### Critical fixes (do first)

| # | Recommendation | Effort | Benefit | Risk | Approval |
|---|---|---|---|---|---|
| 1 | Example data: never persist examples; keep them in memory; stamp-and-honour across Pulse, Ops Report and Signals; migrate stored examples (T-01 to T-04) | M | Very high | Medium (state migration; test with real saved data) | No |
| 2 | Fix the broken hand-off and parsing bugs: CoQ ← Waste Log fields (T-05); Process Lab decimal comma on EN (T-06); CV import "+" and jobs (T-08); a contract test per hand-off built from the real writer (CI-03) | S–M | High | Low | No |
| 3 | Management Review corrections: add the missing notes to Nos. 74–77 and 79, generate the "changed" list from the records, correct the count (E-01) | S | High (trust) | Low | Yes (wording) |
| 4 | Career timeline: one source of truth; apply the 17 Oct wording to *The tools you build yourself* in 3 languages; one dated line in *Starting from zero* (E-03) | S | High | Low | **Yes** |
| 5 | Cloudflare analytics: add a manual site and update the token (A-01) | S (owner) | Medium | None | **Yes** (account) |

### High-value improvements

| # | Recommendation | Effort | Benefit | Risk | Approval |
|---|---|---|---|---|---|
| 6 | ATS scorer: skill-aware keyword extraction, acronyms, Unicode normalisation; drop the "60% passes" claim (T-07, T-28) | M | High for job seekers | Medium | No |
| 7 | Print: a print stylesheet for wide tables in 8 tools and A3; force chart reveal in print; page breaks inside long CV blocks (T-09, T-10, T-24, M-05) | M | High | Low | No |
| 8 | Home hero performance **keeping the motion**: canvas sized to the planet system; DPR 1 start on weak devices; fewer particles on phones; side-by-side visual comparison before merge (M-01) | M | High on phones | Medium (identity) | **Yes** (visual sign-off) |
| 9 | One persisted site-wide motion toggle that stops every decorative loop; behaviour tests (M-02, M-03) | S–M | Accessibility (WCAG 2.2.2) | Low | Yes (placement) |
| 10 | German reflections register to Sie/"man"; Albanian ju/ti per FJALORI (E-02, P4-08) | S–M | High for DE credibility | Low | Yes |
| 11 | Narration: skip the feedback and "Join in" boxes, read the case-box content, give an accurate online-voice privacy note (P-02 to P-04) | S | Medium | Low | No |
| 12 | Diagnostics wording and thresholds: KPI Diagnostic "leading hypothesis"; sigma "lasting"; low-count signal suppression; Site Compare minimum n; Room Inspection completeness (T-11 to T-14, T-21) | M | Medium-high | Low | No |
| 13 | Team sync: deletion tombstones, a salted KDF for IDs, rate limits, remove the dev origin; update the privacy page from a generated storage list (T-25, T-26, P-01) | M | Privacy | Medium (server) | Yes (privacy text) |
| 14 | Dating model and method box: real publication dates; reword "Figures that could not be confirmed are not in the issue"; one AI line in each PDF colophon (E-04 to E-06) | S–M | Trust | Low (requires reprinting PDFs) | **Yes** |
| 15 | CI realism: bump Playwright, add a current-Chrome job, fix the view-transition rejection; a PDF-vs-source text check; `npm audit fix` (markdown-it) (CI-01, CI-02, CI-04) | S–M | Prevents silent drift | Low | No |

### Optional refinements
- Previous/next and related links on reflections (SEO-02).
- `lastmod` on dated pages, `og:locale`, and Book/PodcastSeries/Periodical schema (SEO-05 to SEO-07).
- Shorter tool-page titles.
- Per-family CSS splitting for tool pages (PM-14).
- Fix the duplicate `@keyframes` (M-04, S).
- Wrap chart labels on phones (E-07).
- Untruncated percentage axes (P5-06).
- Tagged PDFs with `/Lang` (P5-08, P6-04).
- Podcast loudness normalisation to the stated −16 LUFS, with a true-peak limit (P7-06).
- Localised 404 pages.
- Gloss "old lek" for EN/DE readers.
- Correct the disclosure page on translation direction (P4-15, P6-05).

### Keep unchanged
- The planet identities and families, the page transitions, the scroll reveals and the reduced-motion implementation.
- The evidentiary labels: "via", "our reading", "made-up numbers", "The case, as documented".
- The per-language dated corrections, and the one-source structure that keeps numbers identical across languages.
- The necessary qualifications in *Pareto*, *Damage* and *When improvement fades*.
- The book's text and layout, apart from the single back-cover decision.
- *Fantazma në dhomën plot me pasqyra* and *Paradoksi i madh shqiptar* as literature.
- The offline-first tools with local storage, the CSV injection guard, the import hardening and the restore points.
- The CI gates: no failed and no skipped test may deploy.

### Reject (benefit too small or identity risk too high)
- Removing or flattening the motion to raise synthetic performance scores.
- Removing intentional `noindex` from search, shelf, legal, 404 and offline pages.
- "Professionalising" the reflections into case studies.
- Adding numbers to honest personal essays for their own sake.
- Removing the necessary caveats.
- Rewriting the book.
- Moving the domain behind the Cloudflare proxy only for analytics. A manual Web Analytics site is enough.
- A bundler or framework rewrite to split `cx-tower.js` or `cosmos.js` all at once. Do it gradually, behind browser
  tests, as already planned.

---

## I. Final verdict

**What Stiven Catalyst does exceptionally well.** It turns an operations practitioner's method into three things that
rarely coexist on one independent site:
- working tools, whose formulas are correct;
- a sourced magazine, where none of about 100 checked numbers was contradicted;
- a literary voice, whose book translations lose nothing.

All of it is in three languages, under a coherent and memorable visual identity, on a build that is technically
cleaner than most commercial sites.

**What still holds it back.** It is not the craft. It is **integrity at the seams**:
- example data that turns into real data;
- hand-offs between tools that silently drop data;
- a corrections promise the record does not keep;
- dates that are not real publication dates;
- a career timeline that contradicts itself;
- a velocity of publishing that turns a strong voice into a template.

These are exactly the things the motto, "Management without theatre", warns against. That is why they matter more
here than they would elsewhere.

**Has the recent development effort materially improved the platform?** Yes, measurably:
- the on-time %, period totals, Unicode handling and ATS substring matching are fixed;
- mobile overflow and CLS are gone;
- the SEO and hreflang hygiene is excellent;
- CI now refuses failed or skipped tests.

But the effort has gone disproportionately into **adding** (dozens of tools in October, 80 issues, 31 reflections)
rather than **closing** the defects already reported. Sample-data merging, undeclared targets, unsupported conclusions,
print clipping and broken analytics were all on earlier lists and are still open.

**The next most valuable investment of effort:** a short "seams" sprint, with no new content and no new tools, that
does roadmap items 1–5:
1. Examples are never persisted.
2. Every hand-off gets a contract test built from the real writer.
3. The corrections record is completed and generated.
4. The career timeline is made coherent.
5. Analytics is fixed, so that future decisions rest on real readership.

This is roughly one to two weeks of focused work. It would move the platform from "credible, with defects a careful
user will hit" toward "professional with notable fixes", without touching the identity that makes it worth reading.

---

## Appendix: evidence files

All under `$AUDIT_DIR/`:

| Report | Scope | Work directory (scripts, outputs) |
|---|---|---|
| `findings/p1-p8-inventory-seo.md` | Inventory, IA, SEO | `work/p1-p8-inventory-seo/` (pages.csv, pdfs.csv, graph.json) |
| `findings/p2a-tools-stats-quality.md` | 23 statistics/quality tools | `work/p2a-tools-stats-quality/` (t01–t21) |
| `findings/p2b-tools-lean-planning.md` | 33 lean/planning tools | `work/p2b-tools-lean-planning/` |
| `findings/p2c-career-platform.md` | Career tools, data, privacy and security | `work/p2c-career-platform/` |
| `findings/p3-p9-motion-perf-a11y.md` | Motion, performance, accessibility, CSP, analytics | `work/p3-p9-motion-perf-a11y/` (154 screenshots) |
| `findings/p4-editorial.md` | Editorial in EN/DE/SQ | `work/p4-editorial/` (tri/, out/, scripts/) |
| `findings/p5-management-review-publications.md` | Management Review and publications | `work/p5-management-review-publications/` |
| `findings/p6-p7-book-audio.md` | Book, podcast, narration | `work/p6-p7-book-audio/` |
| `unit-tests.log`, `browser-tests.log`, `work/p10/` | CI, test runs, view-transition and Process Lab reproductions | |
| `audit-src/` | The isolated clone at `3cb88a2` with `_site/` | |
