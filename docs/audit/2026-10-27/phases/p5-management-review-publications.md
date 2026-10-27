# Phase 5: Management Review and the other publications (audit report)

Auditor phase: `p5-management-review-publications`. Clone: `audit-src` at 3cb88a2 (origin/main). Local server: port 8107.
Working files (scripts, extracted text, screenshots, downloaded sources): `$AUDIT_WORK/p5-management-review-publications/`.
Nothing was written to the production checkout. `git status` there was clean at the end.

## 1. Scope and method

**What I covered**
- **Inventory, checked in full.** I checked 80 Management Review (MR) issues × 3 languages (HTML and PDF), the special edition (2026-09), From the Floor Nos. 1–2, Operational Treatise Vols 1–13, and the Tools Guide (edition 7 plus the 6 archived editions).
- **PDF metadata, checked in full.** I ran `pdfinfo` on all 309 magazine and guide PDFs. `pypdf` checked /Lang, Author, outline and link annotations on 291 of them. `pdffonts` checked font embedding on all MR PDFs, and `pdftotext -bbox` checked for text outside the page on all of them.
- **Cross-language number fidelity, checked in full.** This was automated: every leaf text of the 80 MR issues, 2 Floor issues and 13 treatise volumes, compared EN vs DE vs SQ (`scripts/xlang.mjs`).
- **Cover vs inside, checked in full (automated).** For each issue and language I checked that the cover figure appears inside, that each teaser's page exists and that the page numbers match.
- **PDF vs source data, checked in full (automated).** I compared the numeric tokens of each MR issue and language against the `pdftotext` output (`scripts/pdfvsdata.mjs`).
- **Mobile at 390 px, checked in full for chart overflow.** I scanned 285 publication pages (MR, treatise, Floor × 3 languages) with Playwright for chart text that overflows its SVG and for horizontal scroll (`scripts/clip.cjs`). I took visual screenshots of 12 pages and 6 chart figures.
- **Claims verification, sampled.** I extracted every number from 23 issues (01, 05, 06, 09, 10, 15, 20, 21, 23, 25, 29, 30, 35, 39, 40, 45, 50, 55, 60, 65, 70, 75, 80), then checked against the source on the web about 100 numeric claims. They fall into 45 claim rows, in 20 MR issues plus treatise Vols 5 and 13, the special edition and From the Floor No. 2. The method is in §1a.
- **Charts.** I counted the base/unit notes on all 156 MR charts and 30 treatise charts, and read a seeded random sample of 12 page-level notes.
- **Tools Guide count, checked in full.** I compared `tools.json`, the `/tools` pages in 3 languages and the Tools Guide PDF.

**What I could not verify**
- **Commit `de0466bb`** (the "second check" commit) is not in the shallow clone, which holds only 50 commits. I could not check it.
- **Several primary sources were blocked:** SSRN, HBS, the WEF report PDF (504), Wiley/SMJ and McKinsey (403/503). Some of these claims are marked SNIPPET or NOT VERIFIED.
- **Issue files before 22 October.** I could not confirm whether they changed between the PDF build (17 October) and 22 October. History older than that is not in the clone. No later commit touches `lib/weekly/issues`.

### 1a. Verification levels used in the claims table

| Level | Meaning |
|---|---|
| PRIMARY-VERIFIED | I read the source document, or the publisher's own page or PDF. |
| SNIPPET/SECONDARY | Confirmed only by a search summary or a third party quoting the source. |
| NOT FOUND | The cited source was opened, and the number is not in it. |
| CONTRADICTED | The source says something else. |
| NOT VERIFIED | Not checked successfully. |

## 2. Coverage table

| Item | Status | Evidence |
|---|---|---|
| Issue inventory: 80 MR × 3 languages HTML + PDF, special edition, Floor 1–2, Treatise 1–13, Tools Guide (current + 6 editions) | Fully tested | REPRODUCED: 240 MR PDFs plus 3 special edition, 6 Floor, 39 treatise, 3 + 18 guide, 3 book = 312 PDFs. No PDF or HTML missing. |
| PDF metadata (pages, title, tags, Lang, Author, fonts, sizes) | Fully tested | REPRODUCED (`pdfinfo.tsv`) |
| PDF text vs data | Fully tested (numbers) | REPRODUCED. All gaps were false positives: letter-spaced labels, for example "2024/25", are present visually (`png/nr15-en-07.png`). |
| PDF render or layout | Sampled (5 pages) and automated bbox (all) | REPRODUCED |
| Cross-language numbers | Fully tested (automated) | REPRODUCED. 0 substantive mismatches in MR or Floor. One garbled caveat in treatise DE. |
| Cover vs inside, teasers | Fully tested | REPRODUCED. 0 teaser or page mismatches. Every cover figure appears inside, some in other wording ("3 h" vs "three hours"). |
| JSON-LD / sitemap / feed dates | Sampled JSON-LD (6 pages); sitemap and feed in full | REPRODUCED |
| Corrections | Source and HTML inspected for all 80 MR issues; 80 fact records cross-checked | SOURCE + REPRODUCED |
| Claims vs sources | About 100 numeric claims (45 rows) across 20 MR issues + 2 treatise volumes + special edition + Floor 2 | SAMPLED |
| Charts (notes, scales) | Fully counted; notes sampled | REPRODUCED |
| Mobile 390 px | Fully scanned (overflow); 12 pages viewed | REPRODUCED |
| Treatise evidentiary checks | Vols 5, 9 (cover only), 13 deep; 1–13 numbers cross-language | SAMPLED |
| Tools Guide "fifty-eight tools" | Fully tested | REPRODUCED |
| Corrections commit history | Not verified | Shallow clone |

## 3. Defect register (most severe first)

### P5-01: Corrections made in the second check are not disclosed on issues 75, 76 and 77 (and the "64 issues changed, each says so" claim is false)
- **Severity:** P1 (credibility of a publication that advertises its corrections policy)
- **URL:** /magazine/management-review-nr-75.html, -76.html, -77.html (all 3 languages). Also /magazine/management-review.html#checked and /how-this-is-made.html#dates.
- **Source:** `lib/weekly/common.js` (`checked.issues`, 64 numbers, which exclude 74–77 and 79). The issue records are `docs/revista/management-review-nr-75.md:13-20`, `-76.md:15-22` and `-77.md:14-19`.
- **Evidence (SOURCE + REPRODUCED):**
  - The project's own fact records say the full-text check "changed these, reprinted in all three languages" for Nos. 74, 75, 76, 77 and 79. None of these is in the 64-issue list.
  - **No. 76** changed a figure's base: "731 solutions" became 499. It also changed the denominator of its cover figure, "< 25%" of 456 to "< 25%" of 397. It removed a category group that "is not in any version of the ASQ page" and reworded "95% in the factory".
  - **No. 75** changed a chart label and its intro to follow the source, and made 6 fixes in all.
  - **No. 77** reworded 4 statements.
  - Built pages for 75, 76 and 77 show **0 correction markers and no "checked" link**. I grepped `is-correction|Correction` and `#checked`. Nos. 74 and 79 have dated notes for other changes only.
- **Expected vs actual:**
  - Expected: archive says "64 issues changed … Each changed issue says so under its summary". How this is made says that changed 64 issues, each says so.
  - Actual: at least 69 issues changed, and 3 changed silently, including numeric and denominator changes.
- **User impact:** readers who cited the earlier text (for example 731 solutions, or the 456 base) have no way to know it changed. This undermines the strongest part of the publication, its correction discipline.
- **Confidence:** high
- **Suggested correction:** Add 74–77 and 79 to `checked.issues`, or give each a dated correction that names what changed. Update the count "64" in three languages, both on the archive and on How this is made. Add a test that cross-checks each `docs/revista/*.md` record containing "ndryshoi"/"U ndreq" against the list.
- **Regression risk:** low

### P5-02: Dating model: a "monthly edition" of 80 issues published in 4 days, forward-dated issues, and a back-dated special edition
- **Severity:** P2
- **URL:** /magazine/management-review.html; /magazine/management-review-nr-41.html … -80.html; /magazine/management-review-2026-09.html; /magazine/nga-terreni-02.html
- **Source:** `src/_data/online.json`, `lib/weekly/common.js:39-43,121-126`, `src/_data/review.js`
- **Evidence (REPRODUCED):**
  - Per `online.json`, the 80 issues went online between 8 and 11 October 2026: 13, 20, 39 and 8 issues per day.
  - Issues 41–80 carry the date "November 2026" but were online from 10–11 October. JSON-LD `datePublished` correctly says 2026-10-10.
  - Floor No. 2 is dated "November 2026" and went online 12 October.
  - The special edition is labelled "September 2026" but went online **4 October 2026**. Its own page shows "Online since 4 October 2026". Neither the archive nor How this is made explains the back-dating. They explain only the forward-dating of 41–80.
  - The homepage reads "The monthly edition · No. 1–80".
- **Expected vs actual:** a management periodical's issue date should not precede or follow publication without a clear reason. Here, "monthly" in practice means 40 issues per labelled month, all written in days.
- **User impact:** readers and citers get wrong temporal context. "September 2026" implies the edition predates October data it may use. The velocity (about 2,400 pages in 3 languages in 4 days, then 64+ issues changed within 4 days) signals that drafting preceded verification.
- **Confidence:** high
- **Suggested correction:** date issues by actual publication, or label them "Edition: November 2026 (published 10 October 2026)" on the cover and in the PDF. Explain or re-label the special edition as "October 2026".
- **Regression risk:** low (labels only)

### P5-03: The method statement overclaims ("Figures that could not be confirmed are not in the issue")
- **Severity:** P2
- **URL:** sources page of every issue and PDF; /how-this-is-made.html
- **Source:** `lib/weekly/common.js` `sourcesPage.methodText`; `docs/revista/management-review-nr-01.md:36`, `-21.md` (Bloomberg row)
- **Evidence (SOURCE + SAMPLED):**
  - **No. 1, chart "lowest-scoring managers 70% → 77%".** The record says the book was not read and WEF returned 403. The figure "remains only at the secondary source", and the period was assumed to be 2010–2012. My own check: Garvin (HBR 2013) gives only 83%→88%, and no 70/77. The figure is **NOT FOUND** in the primary source the issue cites. It is still printed as a fact.
  - **No. 21** states "in 2023 they made up almost a third of the US layoffs". Its record says "the year 2023 is not visible in the opened part".
  - 13 sources are labelled "Excerpts, through web search": 6 McKinsey items, ASQ ×3, Gartner, ISO 31000, Dixon 2013 and Klau 2013.
  - Overall, 207 of 648 sources (32%) carry "via": 89 "abstract", 13 web-search excerpts.
  - 73 of 80 fact records contain "nuk u hap" (could not be opened), 341 times in total.
- **Expected vs actual:**
  - Expected: "Each figure was checked … Figures that could not be confirmed are not in the issue."
  - Actual: some figures rest on search snippets or unread books, flagged only at source level ("via"), not at figure level.
- **Confidence:** high
- **Suggested correction:** Reword the method box: "Where we could not read the source itself, the figure is marked 'via' with what we read instead." Drop 70→77 or mark it "reported by Bock (2015), not seen".
- **Regression risk:** none

### P5-04: The PDFs (the shareable artefact) carry no AI-production disclosure and speak of "the editors" for a one-person-plus-AI process
- **Severity:** P2
- **URL:** all `/media/magazine/**.pdf`
- **Evidence (REPRODUCED):**
  - I grepped the `pdftotext` output of 240 MR, 39 treatise, 6 Floor and 3 special-edition PDFs for `Claude|Anthropic|made with AI|How this is made`. Only Nos. 10 and 41 match, and only as subject matter.
  - The site page /how-this-is-made.html discloses it clearly: "Texts, translations and code are made in working sessions with Claude…; 'the editors' … means me."
- **User impact:** a downloaded PDF reads as a staffed editorial product, which is the source of its implied authority.
- **Confidence:** high
- **Suggested correction:** Add one line to the sources/method page of every PDF: "Edited by Stiven Janaqi, written and checked with AI assistance: stivencatalyst.com/how-this-is-made".
- **Regression risk:** low

### P5-05: Mobile: chart labels overflow their SVG on 61 of 285 publication pages; definitional qualifiers are cut in German No. 45
- **Severity:** P2. The DE 45 case hides "at least monthly"; the others are P3.
- **URL:** for example /de/magazine/management-review-nr-45.html ("Arbeiteten 2+ Stunden zwischen 22 und 5 Uhr, mindestens m…"), -03, -06, -10, -12, -24, -56, nga-terreni-02
- **Evidence (REPRODUCED):**
  - `scripts/clip.cjs` at 390×844 found 105 overflowing chart labels on 61 pages: EN 18, DE 23, SQ 20.
  - Screenshots: `shots/fig-no-preference_de_magazine_management-review-nr-45.html.png` (truncated) and `shots/clip_de_magazine_management-review-nr-56.html.png` (values touch the card edge).
  - There is no page-level horizontal scroll (0 of 285).
  - The printed-page facsimile shows text down to 6.3 px on 48 pages. This is acceptable as a facsimile, because a text version exists.
- **Suggested correction:** wrap or ellipsize chart labels in the narrow renderer (`lib/weekly/charts.js`, NARROW). Measure at build time and fail on overflow.
- **Regression risk:** low

### P5-06: Percentage bars drawn on truncated scales, with no visible axis
- **Severity:** P3
- **Evidence (REPRODUCED):**
  - 36 of 156 MR percentage charts use an axis maximum of 8–80, with no axis shown.
  - Examples: No. 15, where the HSE "30%" bar is three-quarters full (max 40); No. 45, where "21%" is more than half full; Treatise Vol 13, where "36.4%" is nearly full (max 40). Rendered: `png/nr15-en-07.png`, `png/montage1.png`.
- **User impact:** bar lengths read as larger shares than they are.
- **Suggested correction:** use max 100 for shares of a whole, or draw a labelled axis or tick.

### P5-07: German treatise Vol 4 garbles a caveat
- **Severity:** P3
- **Source:** `lib/treatise/volumes/04.js`, protocol-page note
- **Evidence (REPRODUCED, xlang):**
  - EN: "no study establishes 30, 60 and 90 days as the right interval".
  - SQ: faithful.
  - DE: "kein Studienintervall", which is meaningless and loses the caveat.
- **Suggested correction:** "keine Studie belegt 30, 60 und 90 Tage als richtigen Abstand."

### P5-08: PDF accessibility and metadata
- **Severity:** P3
- **Evidence (REPRODUCED):**
  - 291 of 291 magazine and guide PDFs are untagged, have no /Lang and no Author, and have 0 bookmarks.
  - The Creator field is a HeadlessChrome user-agent string.
  - URLs are printed on the sources pages but are not clickable: 0 Link annotations in No. 1 EN.
  - Positive: fonts are embedded and subset (Inter, Archivo Black, Liberation Serif), text is selectable, no text falls outside the page box, and ë/ç/ä/ö/ü/ß/„“ extract correctly.
- **Suggested correction:** set `lang` and the title in the print HTML, pass Chromium `tagged: true, outline: true` (Puppeteer/Playwright `page.pdf` options), and use `<a href>` for source URLs.

### P5-09: Sitemap has no `<lastmod>` for any of the 297 magazine URLs
- **Severity:** P3
- **Evidence (REPRODUCED):** essays carry lastmod; `/magazine/*` URLs do not. `online.json` already has a `modified` date for each of them.

### P5-10: The chart-note test does not test what the 17 October audit claims
- **Severity:** P3
- **Evidence (REPRODUCED + SOURCE):**
  - `tests/weekly.test.cjs:114` asserts only that `note.length > 20`, which a page note on any subject passes.
  - I count **28** MR charts with their own base/unit note, against the "29" claimed in `docs/AUDIT-2026-10-17.md:10`. Floor and treatise charts have 0 own notes; all treatise charts rely on page notes.
  - The sampled page notes were in fact specific and good (§4). The test does not guarantee this.

### P5-11: Minor citation inconsistencies
- **Severity:** P3
- **No. 75:** the source list says "Mental health at work (fact sheet), WHO, 2024", while its note says "the WHO's fact sheet of 2026 gives 16% for 2023". The current fact sheet does give 16% for 2023 (PRIMARY).
- **No. 21:** "In the same report, 73% … only 7%" is attributed to the Deloitte chapter page the issue cites, but that page does not contain 73% or 7%. They are in Deloitte's 2025 press release (SNIPPET). The 13% appears only in the chapter's figure (SNIPPET).
- **Special edition:** "40% higher productivity growth" (PwC 2026) is a ratio of growth rates (34% vs 24%), with exposure assigned by sector rather than by firm. The card states it as a simple figure.

### P5-12 (OPINION): Treatise and Floor cover figures are often study counts or model outputs, not findings
- Vol 5 "4.75×" (the label itself says "theoretical illustration, invented example"), Vol 9 "60 independent studies", Vol 13 "149 empirical studies".
- These are honest, but a cover figure that is a count of studies, or an invented model number, signals evidence weight it does not carry.

## 4. Claims table (sampled)

### Management Review issues

| # | Issue | Claim (as printed) | Cited source | Check | Status |
|---|---|---|---|---|---|
| 1 | 01 | Manager explains ≥70% of variance in engagement between business units | Gallup 2015 | Gallup page: "at least 70% of variance … across business units" | PRIMARY-VERIFIED |
| 2 | 01 | Managers engaged 31% (2022) → 22% (2025); non-managers 20% → 19%; world 20% (2025) | Gallup SOGW 2026 | Gallup SOGW page | PRIMARY-VERIFIED |
| 3 | 01 | Managers 30% in 2023 | SOGW 2026 | Not on the web page; record cites the report PDF p.7 | NOT VERIFIED |
| 4 | 01 | 1 in 10 high talent, 2 in 10 basic, 82% wrong choice | Beck & Harter 2014 | Gallup article | PRIMARY-VERIFIED |
| 5 | 01 | >10,000 data points; better results, happier, lower turnover | Google re:Work | re:Work page | PRIMARY-VERIFIED |
| 6 | 01 | Google managers 83% → 88% (2010–2012) | Garvin 2013 / Bock | HBR | PRIMARY-VERIFIED |
| 7 | 01 | Lowest-scoring managers 70% → 77% | Garvin 2013; Bock 2015 via WEF | Garvin has no such figure; WEF 403; own record says secondary only | NOT FOUND (in Garvin) / NOT VERIFIED |
| 8 | 05 | Cola can 319 days, 3 h value-adding, 9 facilities, 6 companies, 4 countries; 0.04% | Womack & Jones via LEI | LEI PDF; arithmetic 3/(319×24) = 0.039% | PRIMARY-VERIFIED + REPRODUCED |
| 9 | 06 | Doubling pre-promotion sales → each subordinate's sales −6.1% (QJE 2019) | Benson, Li & Shue | OUP QJE text: "decline by 6.1%" (working paper said 7.5%) | PRIMARY-VERIFIED |
| 10 | 06 | 65% promoted for performance/tenure, 30% for skill; engaged 31% vs 42%; 45% trained past year; 23% never; 79% more likely engaged | Gallup (Tatel & Stewart) 2026 | Gallup article (n = 1,214) | PRIMARY-VERIFIED |
| 11 | 09 | Albania 32% (3-year average to 2025), Europe 12%, world 20%; Albania 11% in 2012; job climate 63 / 57 / 52 | Gallup country page | Gallup Albania page | PRIMARY-VERIFIED |
| 12 | 09 | Germany 11% (3-year average) | Gallup Germany page | Gallup page | PRIMARY-VERIFIED |
| 13 | 09 | US 31% engaged 2025; peak 36% 2020 | Harter, Gallup 2026 | Gallup article | PRIMARY-VERIFIED |
| 14 | 09 | US 17% actively disengaged 2025 | same | Not in article text (chart only) | NOT VERIFIED |
| 15 | 10 | METR: 16 developers, 246 tasks, 19% slower; expected 24%, believed 20% | METR 2025 | METR page | PRIMARY-VERIFIED |
| 16 | 10 | Experts forecast ≈40% shorter | METR 2025 | Chart only | NOT VERIFIED |
| 17 | 10 | 5,179 agents; +14% average; +34% novices | Brynjolfsson et al. NBER | NBER abstract | PRIMARY-VERIFIED |
| 18 | 10 | 758 consultants; 12.2% / 25.1% / >40% / −19 pp | Dell'Acqua et al. 2023 | SSRN and HBS 403 | NOT VERIFIED (matches my background knowledge only) |
| 19 | 15 | HSE RIDDOR 2024/25: slips 30, handling 17, struck 10, violence 10, height 8; top 2 = 47%, top 5 = 75% | HSE 2025 | Search summary of HSE page; sums recomputed | SNIPPET + REPRODUCED |
| 20 | 20 | Underwriters' median gap 55%, executives expected ≈10%; claims adjusters 43% | Kahneman et al. 2021 via strategy+business | Search summaries | SNIPPET |
| 21 | 21 | Producers 22.3% of revenue variance, designers just over 7% | Mollick 2012 via Knowledge@Wharton | Wharton URL now 404; SMJ closed | NOT VERIFIED |
| 22 | 21 | Middle-manager postings −42% (October 2024 vs April 2022) | Business Insider / Revelio | Deloitte page quotes 42% | SECONDARY |
| 23 | 21 | Gartner: by 2026, 20% of organisations will flatten, cutting >½ of middle-manager roles | Gartner 2024 via quotes | Deloitte page quotes it verbatim | SECONDARY |
| 24 | 21 | Managers ≈40% of time on firefighting/admin; 36% unprepared | Deloitte 2025 | Deloitte chapter page | PRIMARY-VERIFIED |
| 25 | 21 | 13% of time on developing people; 73% / 7% | Deloitte 2025 | Figure only, and press release (see P5-11) | SNIPPET |
| 26 | 21 | Almost a third of US layoffs in 2023 (20% in 2018) | Bloomberg / Live Data | Bloomberg Law snippet; year not shown | SNIPPET (year unconfirmed) |
| 27 | 23 | McKinsey 2015: 26% succeeded and sustained (20% in 2012); 79% for rigorous | McKinsey 2015 | Search summaries | SNIPPET |
| 28 | 23 | Value lost: 22 / 23 / 35 / 20 by phase | McKinsey 2021 | "Nearly one quarter" at target setting, 20% after: SNIPPET; planning and implementation not seen | Partly SNIPPET / NOT VERIFIED |
| 29 | 29 | 28% burned out very often/always (n = 12,658, 2019); distribution 7 / 21 / 48 / 20 / 4; 63% sick days; 2.6× job search; 2.3× unfair treatment; ≈70% less with manager support | Gallup 2020 | Gallup PDF (downloaded) | PRIMARY-VERIFIED |
| 30 | 30 | 44% of German firms that considered AI but do not use it cite data availability/quality (2025) | Destatis | Destatis table (base: firms ≥10 employees that considered AI) | PRIMARY-VERIFIED |
| 31 | 30 | 47% of new records with ≥1 critical error; <3% of scores acceptable | Nagle, Redman & Sammon 2017 | HBR page truncated (title only states 3%) | SNIPPET (3% only) / NOT VERIFIED (47%) |
| 32 | 39 | WEF: 170 m created, 92 m displaced, 22% churn, net 78 m, >1,000 employers, 14 m workers | WEF 2025 | Search summaries (PDF fetch 504) | SNIPPET |
| 33 | 39 | Task shares 47 / 30 / 22 → ~⅓ each; 59 of 100 need training (29 / 19 / 11) | WEF 2025 | Not seen | NOT VERIFIED |
| 34 | 39 | IAB substitution potential 87.9 / 68.0 / 61.2 / 49.5 / 26.5; 38% (2022) vs 34% (2019) in high-potential jobs; hotel management assistant 50 → 67 | IAB 2024 | IAB Kurzbericht PDF (downloaded) | PRIMARY-VERIFIED |
| 35 | 45 | Night 2: +6%, night 3: +17%, night 4: +36%; mornings +2 / +7 / +17; afternoon +18%, night +30%; 10 h +13%, 12 h +27%; 7 studies | Folkard, Lombardi & Tucker 2005 | J-STAGE PDF (downloaded) | PRIMARY-VERIFIED |
| 36 | 50 | NHS 2025: 766,285 respondents, 49% response, 206 trusts; 86.2 / 67.3 / 61.0 / 59.3; 58.2% in 2022; 33.7% saw an incident | NHS Staff Survey briefing | 60-page PDF (downloaded) | PRIMARY-VERIFIED |
| 37 | 75 | 12 bn working days, ≈US$1 tn; 16% for 2023 | WHO / ILO, WHO fact sheet | WHO fact sheet | PRIMARY-VERIFIED |
| 38 | 75 | 35% of countries with national programmes | WHO / ILO 2022 | Not on fact sheet | NOT VERIFIED |
| 39 | 80 | 4% of analysable PDSA projects applied all 4 features (3/72); 98% reported improvement | Knudsen et al. 2019 | Search summary of abstract | SNIPPET (denominator stated correctly) |
| 40 | 40, 60 | 49% unsure whether walkrounds took place (Sexton 2014); intrinsic motivation R² 0.42 (Van den Broeck 2016) | — | BMJ 403; Lirias failed | NOT VERIFIED (records claim primary reading) |

### Other publications

| # | Publication | Claim (as printed) | Cited source | Check | Status |
|---|---|---|---|---|---|
| 41 | Treatise Vol 13 | 149 studies, 33,051 relationships | Cao & Lumineau 2015 | HKU PDF summary | SNIPPET |
| 42 | Treatise Vol 13 | 128 files → 99 disputes, 96 European; 36.4 / 28.3 / 26.2 / 9.1%; ≈46% cross-border; ≈150,000 pages; French law, 1991–2005 | Lumineau & Henderson 2012 (MPRA 38510) | Working paper PDF (downloaded) | PRIMARY-VERIFIED |
| 43 | Treatise Vol 5 | ρ/(1−ρ) = 2.33 / 4 / 9 / 19 → 4.75×; 97/110 = 88.2% | Model arithmetic | Recomputed | REPRODUCED |
| 44 | Special edition | Microsoft WTI 2026: 66% more time for high-value work, 58% work not possible a year ago | Microsoft 2026 | Search summaries (AI users, 20,000 in 10 markets) | SNIPPET |
| 45 | Special edition / Floor 2 | PwC: 40% higher productivity growth; BPEX: ≈750 m shipments November–December 2025 | PwC 2026; BPEX 2025 | Search summaries | SNIPPET |

**Tally:** 45 claim rows, covering about 100 individual numbers.

| Status | Rows | Rows involved |
|---|---|---|
| PRIMARY-VERIFIED or REPRODUCED arithmetic | 21 | 1, 2, 4, 5, 6, 8, 9, 10, 11, 12, 13, 15, 17, 24, 29, 30, 34, 35, 36, 37, 42 |
| REPRODUCED arithmetic only | 1 | 43 |
| SNIPPET / SECONDARY (incl. partial) | 13 | 19, 20, 22, 23, 25, 26, 27, 28, 32, 39, 41, 44, 45 |
| NOT VERIFIED (incl. partial) | 11 | 3, 7, 14, 16, 18, 21, 28, 31, 33, 38, 40 |
| NOT FOUND | 1 | 7: the 70→77 figure is not in its cited primary (Garvin) |
| **CONTRADICTED** | **0** | — |

Rows 7 and 28 are counted in two status rows each (partial status), so the counts add to 47.

Geography, year and denominator were consistent wherever I checked:
- No. 9 explicitly notes three-year averages vs single year.
- No. 80 states "of the projects that could be judged".
- No. 30 states the 3% is "a share of measurements".
- No. 6 states the 79% is relative.
- No. 75's "working population" wording follows the WHO 2022 report (per its record), while the body uses the fact sheet's "working-age adults". The two are mixed, but both are WHO wordings.

## 5. Inventory and consistency results (REPRODUCED)

- **Management Review:** 80 issues (Nos. 01–80) × EN/DE/SQ, each with HTML and PDF.
  - All PDFs are 10 pages, A5 (420 × 595 pt), 475–640 KB.
  - PDF titles are language-correct ("No. 41 · AI and the rules at work" / "Nr. 41 · KI und die Regeln …").
  - All PDFs were created 17 October 2026, after the 12 October check and the 13–16 October corrections; the corrections are printed on the sources page (No. 6 verified).
- **Special edition (2026-09):** 26 pages × 3.
- **From the Floor:** No. 1 (12 pages) and No. 2 (10 pages) × 3.
- **Treatise:** Vols 1–13 × 3, 18–33 pages. Vol 13 was built 26 October 2026 at 20:06 UTC.
- **Tools Guide:** edition 7, 81 pages, dated 25 October 2026. Editions 1–6 are archived.
- **Corrections:** 9 dated per-issue corrections (Nos. 4, 6, 24, 47, 52, 66, 72, 74, 79), each shown in the languages it applies to (No. 72 EN + SQ only; No. 74 EN only, because DE and SQ never had the error). Plus the 64-issue "second check" notice with an anchor `#checked` in all 3 archives. Corrections are visible, dated and language-consistent, apart from P5-01.
- **Cross-language numbers:** 0 substantive differences across 80 MR + 2 Floor issues. 69 raw flags were all formatting (decades as '90, 13:00 vs 1 pm, 3,100 miliardë = 3.1 trillion, title split points). Treatise: 1 real defect (P5-07).
- **Tools Guide "fifty-eight tools":** consistent in all 3 languages.
  - `tools.json` has 59 entries = 58 tools + 1 Course.
  - `toolCount` in `toolsGuide.js` computes 58.
  - `/tools.html`, `/de/tools.html` and `/sq/tools.html` each link 59 tool directories.
  - The Tools Guide PDF names all 59 (59 unique `stivencatalyst.com/tools/*` URLs).
  - The wording "Fifty-eight / Achtundfünfzig / Pesëdhjetë e tetë mjete … and a course" is correct.
  - No tool file changed after edition 7's date.
- **JSON-LD:** Article with accurate `datePublished` (online date) and `dateModified` (2026-10-17) and correct `inLanguage`.

## 6. What is genuinely good (with evidence), and what must not change

- **Source traceability.** Every chart (156 MR + 30 treatise) carries a source line with year, plus a base/unit/limit note: 28 MR charts have their own note, and the rest use a page note. In the seeded sample of 12 page-level notes, all stated the base, sample, unit or limit specifically, for example "Shares of workplaces, not of workers … 15% is transport and storage" (No. 71).
- **Hedging survives into all 3 languages.** Correlation vs cause, self-report and single-firm caveats are present throughout. Numbers are identical across all 240 language editions.
- **No contradicted figure in the sample.** In particular:
  - No. 6 adopted the published 6.1% over the working paper's 7.5%.
  - No. 23 debunks the "70% of change fails" myth with the right sources.
  - No. 50 matches a 60-page NHS PDF to one decimal, including the 2022 comparator.
- **Editorial labels are used consistently.** "Our reading", "made-up numbers" and "hypothetical example" separate interpretation from evidence.
- **Correction system:** dated, per-language and printed into the PDFs. Do not remove it; complete it (P5-01).
- **PDFs:** embedded fonts, selectable text, correct Albanian and German glyphs, no overflow, consistent 10-page format.
- **Must not change:**
  - the "via" disclosure;
  - the "Our reading" and "Practice" legend;
  - the per-language correction mechanism;
  - the x(en, sq, de) single-source structure, which is why the numbers cannot drift between languages;
  - the explicit "made-up numbers" labels on worked examples.

**Strongest issue: No. 50 (Just culture).**
- All its sampled numbers are PRIMARY-VERIFIED against the NHS briefing, with correct base (206 trusts, weighted "agree / strongly agree").
- It discloses that 2 of 5 authors of the Mersey Care study worked there, and that the 90% figure comes from a 1997 paper "we did not see".
- It distinguishes essay from study. No. 50 is not in the 64-issue changed list, and its fact record shows no fixes.

**Weakest issue in the sample: No. 21 (The middle manager).**
- Its cover figure (Mollick 22.3%) rests on a Knowledge@Wharton summary that is now 404, not the paper.
- McKinsey's time split comes via Fortune.
- "In 2023" is asserted although the record says the year was not seen.
- Deloitte 73% / 7% are attributed to a page that does not contain them.
- It is the most secondary-dependent issue I checked, though nothing in it is contradicted.
- Runner-up: No. 1, whose 70→77 chart row is not in its cited primary.

## 7. Proposed score: "Books, magazines and publication credibility" (magazines and publications part)

| Criterion | Weight | Score | Basis |
|---|---|---|---|
| Accuracy of sampled numerical claims vs sources | 30 | 26 | 0 contradicted; 22 of 45 rows primary or reproduced; 1 not found in cited primary; 11 rows (partly) not verifiable |
| Source traceability and evidentiary labelling ("via", notes, our-reading) | 20 | 17 | Excellent apparatus. Method statement overclaims (P5-03); 32% of sources second-hand |
| Corrections and edition history integrity | 15 | 8 | Strong system, but silent changes in Nos. 75–77, a wrong "64" count, and 64+ of 80 issues needing changes within 4 days (P5-01) |
| Dating and metadata integrity | 10 | 5 | Forward- and back-dated issues (P5-02); no sitemap lastmod; no PDF Lang or Author |
| Translation fidelity | 10 | 9 | Numbers identical; one garbled DE caveat |
| Format, PDF and mobile readability | 15 | 10 | Clean PDFs, but untagged, unlinked, and no AI disclosure in the PDF; mobile label overflow on 61 pages; truncated scales |
| **Total** | **100** | **75** | |

**Proposed score: 75/100** for magazines and publications. The evidentiary apparatus is genuinely above the norm for a one-person publication. The score is held back by process signals: velocity, overclaimed verification, an incomplete correction record, and an artificial dating model.
