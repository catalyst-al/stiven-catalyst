# Phase 2: Management Review and the other publications (review file)

Branch `phase2-review`, from `80ec8052`. Scope: E-01, E-04, E-05, E-06 and P5-01 to P5-04, P5-07, P5-09, P5-11 of
`docs/audit/2026-10-27/phases/p5-management-review-publications.md`. The clone was unshallowed (`git fetch
--unshallow`) to read the history of the second check.

## 1. The second check of 12 October (E-01, P5-01): what the history shows

**Finding: the audit's premise does not hold for Nos. 74–77 and 79.** Their records (`docs/revista/
management-review-nr-74.md` … `-77.md`, `-79.md`) describe the changes of their full-text check of **11 October**.
The git history shows that those changes were made before the issues went online:

| Step | Commit | Date (UTC) | What |
|---|---|---|---|
| Issues 73–80 written | `ab5cd1ff` | 10 Oct 21:12 | on branch `ccr-2eff20da-9lsfbo` (PR #177), not on main |
| No. 74 quote | `a776df19` | 11 Oct 07:24 | same branch |
| Full-text check 74, 75, 80 | `6e50b937` | 11 Oct 17:35 | same branch |
| Full-text check 73, 76, 78, 79 | `3565e02a` | 11 Oct 17:46 | same branch |
| Full-text check 77 | `a8c070b3` | 11 Oct 18:09 | same branch |
| **Issues 73–80 go online** | `7b43e7c3` (merge of #177) | 11 Oct 18:33 | first time on main; `.github/workflows/deploy.yml` deploys main only (also at that commit) |
| Second check of 1–80 | `de0466bb` (#178) | 12 Oct 00:08 | on main: changes 64 issue files |

The first online version of No. 76 (`git show 7b43e7c3:lib/weekly/issues/76.js`) already says 499 solutions and
"397 senior quality professionals"; 731 appears only in the note that explains the abstract's figure. No reader saw
731 as the base or 456 as the denominator. The same holds for the changes listed in the records of 74, 75, 77 and 79.

**The 64-issue list is exact**: it is the set of `lib/weekly/issues/*.js` files that `de0466bb` changed after the
issues were online (script: for every issue, the first-parent commits of main that touch its file after the one that
put it online). Other post-publication commits that touch the issues: `49e27837` (9 Oct, labels "monthly edition",
reprint), `dac4b16d` (13 Oct, language review; its three fact changes, Nos. 6, 72, 74, have dated notes since 14 Oct),
`dfe30b30`, `7d7ecdc9`, `259be4af` (17 Oct, edit for language; its five fact changes carry dated notes of 16 Oct),
`e36a0036` (17 Oct, chart notes and chart heights). A number-by-number comparison of every commit (EN strings, before
and after) found no other changed printed figure.

What `de0466bb` changed after publication, issue by issue, where a figure, a year or a base changed (from the
diff, checked against each record):

| No. | Before (online 8–11 Oct) | After (12 Oct) | Record |
|---|---|---|---|
| 6 | team member's sales "about 7.5% lower" (working paper) | "fell by about 6.1%" (QJE 2019) | nr-06 |
| 8 | page 4 figure "37% of working time goes into decisions" | "54% of respondents spend over 30% of their working time on decisions"; 37% is the assumption of McKinsey's calculation | nr-08 l. 12–16, 27 |
| 12 | 47 OKR studies, "most in software and IT" | "18 on software development" | nr-12 l. 14–15 |
| 14 | Gallup survey "In 2024" | "In late 2023" (8–20 Nov 2023) | nr-14 l. 16, 27 |
| 24 | Microsoft pilot "six-month … in 2018 with 600 participants" | "a pilot involving 600 employees" | nr-24 l. 19–20 |
| 25 | Bill Smith, Bob Galvin, launch in 1987 | removed; only Motorola's 1986 | nr-25 l. 21–25, 32 |
| 26 | Bidwell "six years", "18–20% more", "beyond two years" | "2003 to 2009", "around 18%", "those who stayed" | nr-26 l. 20–21 |
| 29 | Europe "> 40%", "≈ 1 in 3", "≈ 30%"; "over 20,000" | EU-OSHA 44%, 34%, 29%; 20,012 | nr-29 l. 23 |
| 40 | chart "…, 2014" | "…, 2011" (survey June–Sept 2011) | nr-40 l. 23–24 |
| 59 | "Until 2002"; 58% "a year earlier" | "Before 2001"; "in summer 2002" | nr-59 l. 25–26 |
| 60 | chart "(72 studies)" | "(12–22 studies)" | nr-60 l. 25–27 |

The other 53 issues of the list changed wording that said more than the source, the note on what was read, or (Nos.
36, 38, 41, 57 and parts of others) only shortened German or Albanian lines so the print fits; the generic note
("this issue changed with it") is true for them and stays.

### What changed (E-01)

| File | Before → after | Evidence |
|---|---|---|
| `lib/weekly/common.js` `checked` | comment rewritten: the list is the one place; why 74–77 and 79 are not in it | history above |
| `lib/weekly/common.js` `checked.archive` (EN/SQ/DE) | "… 64 issues changed …" → "…; issues 73 to 80 had their first such check on 11 October, before they went online. {count} issues changed after going online. … where a figure, a year or a base changed, a dated note names the change … All are listed in the corrections register at the foot of this page." | history above |
| `src/_data/weekly.js` | `{count}` filled from `checked.issues.length`; `checkedCount`, `corrected` (issues with dated notes) and `register` (all dated corrections of the issues and the special edition, the second check with links to its 64 issues, the dates note), newest first | — |
| `src/how-this-is-made.njk` (EN/DE/SQ) | hand-written "64" and the hand-written list of corrected issues → `weekly.checkedCount`, `weekly.corrected`; "changed 64 issues" → "changed {{ checkedCount }} issues after they went online"; + "Every correction is listed with its date in the corrections register" (link) | — |
| `src/_includes/pages/weekly-archive.njk` | new section `#corrections` (register), new box `#dates` | — |
| 11 issue files (table above) | a dated correction of 12 October in EN/SQ/DE, naming before and after, on the page and the PDF sources page | records, diff of `de0466bb` |
| `docs/revista/management-review-nr-73.md` … `-80.md` | a dated note: the 11 Oct check was before going online (commit, merge #177); 73, 78, 80 changed again on 12 Oct | history above |

The correction texts (EN; SQ and DE say the same, in the files):

- No. 6: "The fall in each team member's sales after a top seller's promotion is now 6.1%, from the study as published in 2019; the issue first gave 7.5%, from the earlier working paper."
- No. 8: "The large figure on the time spent on decisions is now 54% of respondents who spend over 30% of their working time on them, as McKinsey reports it; the issue first gave 37% of working time, a figure McKinsey uses only as an assumption in its cost calculation."
- No. 12: "The 2024 review of studies on OKRs is now described as it reports itself: 47 studies, 18 of them on software development. The issue first said most were in software and IT."
- No. 14: "Gallup's survey of 717 people who had left an employer is now dated late 2023, when it was carried out; the issue first said 2024, the year Gallup published it."
- No. 24: "Microsoft's buddy pilot is now given as the source gives it, with 600 employees; the issue first added “six months” and “2018”, which the source does not give."
- No. 25: "The history of Six Sigma now gives only what Motorola's own timeline says, that it was invented in 1986; the issue first also named Bill Smith, Bob Galvin and a launch in 1987, which the issue's sources do not give."
- No. 26: "Bidwell's study is now described as the article gives it: personnel data from 2003 to 2009, external hires paid around 18% more, and those who stayed promoted faster. The issue first said six years of data, 18–20% more pay, and faster promotion for those who stayed beyond two years."
- No. 29: "The European figures now come from EU-OSHA's full report: 44% report severe time pressure or overload, 34% a lack of rewards, 29% poor communication or cooperation. The issue first gave them rounded, as more than 40%, about 1 in 3 and about 30%, and the German survey as over 20,000 people, now 20,012."
- No. 40: "The survey of staff in 44 neonatal intensive care units is now dated 2011, when it was carried out; the chart first gave 2014, the year the study was published."
- No. 59: "Leitax's dates now follow the case study: demand planning was ill-defined before 2001, and the 58% forecast accuracy was measured in summer 2002. The issue first said until 2002 and a year earlier."
- No. 60: "The chart of the manager's support for autonomy now gives its base as 12 to 22 studies, the number behind each correlation; it first said 72, the studies of the whole meta-analysis."

## 2. Citation slips (P5-11), checked at the source on 27 October 2026

| Issue | Check | Result | Change |
|---|---|---|---|
| No. 75, WHO fact sheet 2024 vs 2026 | who.int fact sheet opened (WebFetch): dated **15 September 2026**; gives 16% for 2023, 12 bn days, US$ 1 tn, the risk list with "discrimination and exclusion", the five accommodations, phased re-entry, supported employment, manager training | VERIFIED: every point the issue takes from it is in the 2026 version | `lib/weekly/sources.js` `mhw-who-factsheet-2024`: year 2024 → 2026 (id kept); dated correction 27 Oct |
| No. 21, Deloitte 73% / 7% | chapter page opened: text has 40%, 36%, 42%, 20%, **not 73% or 7%** (figure 2 is an image). Deloitte press release of 24 March 2025 (deloitte.com): "Nearly three-quarters (73%) of organizations recognize the importance of reinventing the role of the manager, but just 7% are making great progress" | VERIFIED in the press release | text "In the same report" → "In the report's press release … in the report, 36% …"; note + "The 73% and 7% are from Deloitte's press release of 24 March 2025."; dated correction |
| Special edition, PwC 40% | pwc.com pages and the findings PDF: 403. PwC press release of 15 June 2026 on PR Newswire: "Companies operating in the most AI-exposed sectors recorded 34% productivity growth in 2025 relative to 2018 … compared to 24% for the companies least able to use AI" (34/24 ≈ 1.42) | VERIFIED (press release, PwC's own words) | both cards: "… 2018–2025, in companies of the most AI-exposed sectors: 34% against 24%"; dated correction 27 Oct |

Before → after (EN; SQ/DE in the files):

| File | Before | After |
|---|---|---|
| `lib/weekly/issues/21.js` intro | "In 2023 they made up almost a third of the US layoffs one data firm tracked" | "In an analysis published in 2024 they made up almost a third …" (SQ "Sipas një analize të botuar në 2024 …", DE "In einer 2024 veröffentlichten Analyse …") |
| `21.js` page 3 row | "… Live Data Technologies tracked in 2023, up from 20% in 2018, in an analysis for Bloomberg." | "… tracked, up from 20% in 2018, in an analysis for Bloomberg (2024)." |
| `21.js` page 5 | "In the same report, 73% … ; 36% of managers said …" | "In the report's press release, 73% … ; in the report, 36% of managers said …" |
| `src/_data/review.js` numbers card | "higher productivity growth in the companies most exposed to AI." | "higher productivity growth, 2018–2025, in companies of the most AI-exposed sectors: 34% against 24%." |
| `review.js` skills card | "… in the companies most exposed to AI than in the least exposed." | "… from 2018 to 2025 in companies of the sectors most exposed to AI than in the least exposed: 34% against 24%." |

## 3. Publication dates (E-04, P5-02, SEO-01)

Source: `src/_data/online.json` (first-parent history of main, `scripts/online-dates.mjs`).

| Publication | Label before | Online | Label now |
|---|---|---|---|
| MR 1–40 | October 2026 | 8–10 Oct 2026 | October 2026 (unchanged) |
| MR 41–80 | November 2026 | 10–11 Oct 2026 | October 2026 |
| From the Floor 1 | October 2026 | 12 Oct | unchanged |
| From the Floor 2 | November 2026 | 12 Oct | October 2026 |
| Special edition | September 2026 | 4 Oct | October 2026 (address `management-review-2026-09` kept) |
| Treatise 1–13 | October 2026 | 12–26 Oct | unchanged |

- `archive.modelText` EN before: "One edition a month, in numbered issues, each dated by the month of its edition. Issues 1 to 40 came out in October 2026. Issues 41 to 80 are the November 2026 edition, online since October: that is why 80 issues are here before November. The page of each issue gives the day it went online." → after: "Numbered issues in series of 40, each dated by the month it went online. Issues 1 to 80, the first two series, went online between 8 and 11 October 2026; the page of each issue gives the day." (SQ, DE likewise.)
- New dated note on the archive (`#dates`), EN: "Correction, 27 October 2026. Until this date, issues 41 to 80 and From the Floor No. 2 were dated November 2026, the month of the edition they had been planned for, and the special edition was dated September 2026. They went online on 10 and 11 October, on 12 October and on 4 October 2026, and are now dated October 2026, the month they went online."
- How this is made, "What the dates mean", EN before: "An issue of the Management Review carries the month of its edition, as a magazine cover does: issues 41 to 80 are the November 2026 edition, online since October." → after: "Every issue of the Management Review and of From the Floor, the special edition and every volume of the treatise is dated by the month it went online. Issues 1 to 80 … went online between 8 and 11 October 2026. Until 27 October 2026, issues 41 to 80 and From the Floor No. 2 were dated November 2026, … and the special edition, online since 4 October, was dated September 2026; the archive notes the change." "special edition of September 2026" → "of October 2026" (3 languages).
- Covers, running heads, back covers, cards, JSON-LD (`datePublished` was already the online day) and the month filter all read the one `date` field; with one month left, the month buttons disappear (they show from two months).
- Sitemap: `<lastmod>` for every issue, volume and edition page from `online.json` `modified` (P5-09).

## 4. Method statement (E-05, P5-03)

| Language | Before | After |
|---|---|---|
| EN | Each figure was checked for its year, its publisher and what exactly it measures. Where the publisher's page could not be opened, the figure was checked against independent summaries and is marked “via”. The editors' interpretation is marked “Our reading”. Figures that could not be confirmed are not in the issue. | Each figure was checked for its year, its publisher and what it measures, in the full text where it could be opened. A source read only in a summary, an abstract or excerpts is marked “via”. A figure not confirmed in what was read is marked so on its page, or left out. The editor's interpretation is marked “Our reading”. |
| SQ | Çdo shifër u kontrollua për vitin, botuesin dhe çfarë mat saktësisht. Kur faqja e botuesit nuk hapej, shifra u kontrollua te përmbledhje të pavarura dhe shënohet me “përmes”. Interpretimi i redaksisë shënohet “Leximi ynë”. Shifrat që nuk u konfirmuan nuk janë në numër. | Çdo shifër u kontrollua për vitin, botuesin dhe çfarë mat, te teksti i plotë kur u hap. Burimi i lexuar vetëm te një përmbledhje, një abstrakt ose copa shënohet me “përmes”. Shifra që nuk u konfirmua te ajo që u lexua shënohet si e tillë në faqen e vet, ose lihet jashtë. Interpretimi i redaktorit shënohet “Leximi ynë”. |
| DE | Jede Zahl wurde auf Jahr, Herausgeber und genaue Bedeutung geprüft. Wo die Seite des Herausgebers nicht erreichbar war, wurde die Zahl an unabhängigen Zusammenfassungen geprüft und mit „über“ markiert. Die Deutung der Redaktion ist als „Unsere Lesart“ markiert. Zahlen, die sich nicht bestätigen ließen, stehen nicht in der Ausgabe. | Jede Zahl wurde auf Jahr, Herausgeber und Bedeutung geprüft, am Volltext, wo er sich öffnen ließ. Eine nur in einer Zusammenfassung, einem Abstract oder Auszügen gelesene Quelle ist mit „über“ markiert. Eine Zahl, die sich im Gelesenen nicht bestätigen ließ, ist auf ihrer Seite so markiert oder fehlt. Die Deutung des Herausgebers ist als „Unsere Lesart“ markiert. |

How this is made, "What comes from research", last sentence: "A figure that cannot be confirmed is not published." → "A figure that could not be confirmed in what was read is marked so on its page, or left out." (DE "… ist auf ihrer Seite so markiert oder fehlt.", SQ "… shënohet si e tillë në faqen e vet, ose lihet jashtë.")

The issues now comply in the two cases the audit found:

- **No. 1** (Garvin 70 → 77 %): WEF still 403; a search summary repeats the WEF article's 70 % → 77 % (SNIPPET). Marked, not removed. Chart note EN before: "Bock presents this as a result of the programme. It was not a controlled experiment, so we take it as a sign of direction and nothing more." → after: "83% and 88% are in Garvin's article; 70% and 77% are Bock's, quoted from his book by the World Economic Forum (we did not see the book). Not a controlled experiment: a sign of direction, nothing more." + dated correction 27 Oct.
- **No. 21** ("in 2023"): year NOT VERIFIED (Bloomberg Law shows only the first paragraph; the analysis URL is dated 2024-03-15). Year removed, "published in 2024" given; dated correction 27 Oct (section 2).

The legend "Where the editors interpret …" → "Where the editor interprets …" (SQ "redaksia" → "redaktori", DE "die Redaktion" → "der Herausgeber"). The treatise method: "The editors' interpretation" → "The editor's interpretation" (3 languages). Not verified beyond the audit's sample: whether every other unconfirmed point in the 80 issues is marked on its page; the records (`docs/revista`) say figure by figure what was read.

## 5. Colophon (E-06, P5-04)

On the back cover of every MR issue, From the Floor issue, treatise volume and the special edition (so in every PDF and
in the readers), under the edition line, and at the end of the text version with a link to How this is made
(`common.colophon`, shown by `print/weekly-page.njk`, `print/review-page.njk`, `print/treatise-page.njk`,
`pages/weekly-issue.njk`, `pages/review.njk`, `pages/treatise-volume.njk`):

- EN: "Edited by Stiven Janaqi, who answers for it; “the editors” in this publication means him. Its texts, translations, layout and the checking of figures against their sources are done in working sessions with Claude, an AI model by Anthropic. stivencatalyst.com/how-this-is-made.html"
- SQ: "Redaktuar nga Stiven Janaqi, që përgjigjet për të; “redaksia” në këtë botim është ai. Tekstet, përkthimet, faqosja dhe kontrolli i shifrave te burimet e tyre bëhen në seanca pune me Claude, një model AI i Anthropic. stivencatalyst.com/sq/how-this-is-made.html"
- DE: "Herausgegeben von Stiven Janaqi, der sie verantwortet; „die Redaktion“ ist in dieser Publikation er. Texte, Übersetzungen, Layout und die Prüfung der Zahlen an ihren Quellen entstehen in Arbeitssitzungen mit Claude, einem KI-Modell von Anthropic. stivencatalyst.com/de/how-this-is-made.html"

The facts are those of `src/how-this-is-made.njk` ("Who answers for it", "Where AI is used"). "The editors" inside the
issues (184 places in English alone, e.g. "The reading is the editors'") is left as it is: the colophon of the same
publication now says who that is. Changing each would be a rewrite of the issues; the author may still decide to.

## 6. Treatise Vol 4, German caveat (P5-07)

`lib/treatise/volumes/04.js:761` DE before: "Redaktioneller Takt nach Wiltsey Stirman et al. (2012), dem IHI (2016) und Doyle et al. (2013); kein Studienintervall." → after: "…; von keiner Studie belegt." (the cadence is "supported by no study"; EN: "no study establishes 30, 60 and 90 days as the right interval"). The audit's longer wording ("keine Studie belegt 30, 60 und 90 Tage als richtigen Abstand") pushed page 25 8 px into its foot even at fit-3, so the shorter one keeps the caveat and the page. Translation fix, no public note.

## 7. PDFs

- `node scripts/page-fit.mjs` for every publication (`src/_data/pageFit.json`): every page fits. New steps on the
  sources pages with a new note (Nos. 1, 6, 21, 59, 60, 75 and others in German; special edition p. 25 fit-3) and a
  few unrelated German pages (Nos. 4, 15, 36, 39, 55, treatise Vol 9 p. 1), measured with this Chromium build.
- New `scripts/pdf-meta.py`, run by `weekly.mjs`, `review.mjs`, `treatise.mjs`, `magazine.mjs` after each print:
  Author "Stiven Janaqi", Creator "Stiven Catalyst" (was the HeadlessChrome user agent), `/Lang` of the edition;
  Chromium's Title (from the page) kept. Not done: tagged PDF, outline, clickable source links (P5-08 rest).
- Reprinted with the repository's scripts: 240 MR, 3 special edition, 6 From the Floor, 39 treatise = **288 PDFs**,
  plus the covers of Nos. 41–80, From the Floor 2 and the special edition (their date is on the cover). Page counts
  unchanged (288/288); total size 208.2 MB → 191.2 MB.
- Verified with `pdftotext` against the data, all 288: the month of the edition present and no former month; the
  colophon text and address; every dated correction of the issue on its sources page; the MR method text on every
  issue; Author and `/Lang`. Result: 0 differences. Back cover and sources page of No. 6 (DE) and the back cover of
  No. 1 (SQ) also checked as images.
- `src/_data/online.json` regenerated (`node scripts/online-dates.mjs HEAD`): `modified` = 2026-10-27 for the 54
  publications whose own file changed; no `published` day moved. `edited.json` was left as it was (the script would
  also have rewritten essay dates, outside this scope). The coordinator should run the script again on main after the
  merge.

## 8. Tests

`npm run build` and `npm test`: **1284 tests, 1284 pass, 0 fail, 0 skipped** (one earlier run had the timing test
"large volumes stay fast" at 329 ms against 300 ms while PDFs were printing; it passed in the final run).

## 9. Decisions for the author

1. **The special edition's month.** Its source, the author's own PDF, was called "September 2026"; it went online on
   4 October. It now says October 2026, as the brief asked. If the author wants "September 2026" as the name of the
   edition, it should come back with a line saying it went online on 4 October.
2. **"The editors" inside the issues** (184 places in English, the same in SQ "redaksia", DE "die Redaktion") is now
   explained by the colophon of each publication, not rewritten. Rewrite to "I"/"the editor" only if wanted.
3. **"Monthly edition"** stays as the label and the eyebrow although 80 issues went online within four days; the
   series text no longer claims one edition a month. A new name for the series is the author's choice.
4. **Nos. 74–77 and 79**: no reader note is added, because the history shows their check came before they went
   online. If the author nevertheless wants them noted (for example because preview links circulated), that would
   need evidence of an earlier public version, which the repository does not contain.


## Records and tests

- Records: `docs/revista/management-review-nr-01.md`, `-21.md`, `-75.md`, `-2026-09.md` (dated notes on the 27 Oct
  corrections and the sources opened), `-73.md` … `-80.md` (the check before going online).
- Tests: `tests/corrections-register.test.cjs` (the count comes from the list; every record that documents a change
  is in the list or says the change came before going online; the 11 named corrections; the register lists every
  correction and the built register links them, each page carries its note), `tests/publication-dates.test.cjs` (no
  publication dated after or before its online month; the three languages agree; pages, JSON-LD, sitemap),
  `tests/publication-colophon.test.cjs` (colophon on the back cover and in the text of 7 publications × 3 languages;
  the method; No. 1 and No. 21; Vol 4). Changed: `tests/weekly.test.cjs` (series: the month the issue went online;
  month buttons only from two months), `tests/corrections.test.cjs` (No. 6 now has its 12 Oct note first),
  `tests/page-transitions.test.cjs` (Publications: with one month, a kind choice turns the covers in).

## Files outside the listed ownership

`src/how-this-is-made.njk` (counts, dates and method sentence only), `src/_includes/pages/weekly-archive.njk`,
`weekly-issue.njk`, `review.njk`, `treatise-volume.njk`, `src/_includes/print/weekly-page.njk`, `review-page.njk`,
`treatise-page.njk` (colophon line, register), `lib/weekly/sources.js` (one source year), the three tests above.
No CSS changed: the register reuses `.book-corrections` and `.weekly-model`, the colophon sits in the existing
`.edition` line of the back cover.
