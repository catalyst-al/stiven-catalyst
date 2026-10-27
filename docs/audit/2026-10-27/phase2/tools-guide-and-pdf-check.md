# Phase 2: the Tools Guide, edition 8, and the PDF check (CI-04)

Branch `phase2-guide-pdf`, from `80ec8052`. Commits:

| Commit | Subject |
|---|---|
| `f43ca211` | KPI Diagnostic: the lede and the card promise a hypothesis to check, not where the process became unstable |
| `ab49d9ce` | Tools Guide, edition 8: Time Study, KPI Diagnostic and ATS CV as they work now |
| `7537b295` | Tests: every publication PDF says what its page says (audit CI-04) |

Tests: `npm run build`, then `npm test`: 1,283 tests, `# fail 0`, `# skipped 0` (before this review file; the final
run is in the report).

## 1. Tools Guide, edition 8

### How the text was checked against the tools

Every new sentence was read against the code at `80ec8052`, not against the commit messages alone:

- Time Study: `src/js/time-study.js:40` `standardTime = median * rating * (1 + allowance)`; the fields in
  `src/_includes/partials/time-study.njk:25-33` ("Performance rating (%)", blank = 100; "Allowance (%)", blank = 0);
  the element table and the file give the median and the standard time side by side (`time-study.js:598-600`).
- KPI Diagnostic: `src/js/kpi-diagnostic.js:44-50` (`best <= maxPerCause / 2` names nothing, so a cause needs at
  least 4 of 6; causes one point apart are near-ties named together; the named causes are 2 or more points ahead of
  every cause left out), `:161` "How sure is this?", `:209` the action "Check on the floor: … behind …" at Medium.
- ATS CV: `src/js/ats-cv.js:914-940` (the share of the ad's key words, the sentence "a guide …, not a prediction",
  required words weigh double, "≈" for a skill found under another word), `:1153-1276` (JSON Resume in and out),
  `src/_includes/partials/ats-cv.njk:11,185` (a `.json` file opens; "Download as JSON Resume (.json)"); folding of
  ä/ae, ß/ss, ë/e in `0f80fffa` (tests/ats-match.test.cjs).
- Room Inspection `fb3cdb26`, 5S Audit `6f04859b`/`8f9c4e25`, Site Compare `58178333`, Shift Handover `04f830d8`
  (the link after `#h=`, "Send to the next shift").

The other tools Phase 1 changed were read too; their entries are not wrong and were left as they are:
Value Stream Map (the entry names no bottleneck rule), Inventory ABC (no tie rule stated), Signals (the rules it
names still fire), Sigma & Control Chart, Process Lab (it says "paste", which now reads either decimal mark),
Heijunka (caps and products without pack-out not described), Hotel KPIs, Andon, Action Tracker ("added once"
already said), Daily Board, Cost of Quality, 5 Whys, CV Builder, Cover Letter. Their changes are named in the
web-only list "What changed in Edition 8".

### Changes (src/_data/toolsGuide.js, printed in the PDFs)

| Place | Lang | Before → after | Reason | Evidence |
|---|---|---|---|---|
| `EDITION`, `EDITION_DATE` | all | 7, 2026-10-25 → 8, 2026-10-27 | three tools changed | STATUS.md decision 5 |
| "What could come next" kicker | all | "Edition 7" (literal) → `Edition ${EDITION}` | it would have said 7 in edition 8 | — |
| editions list | all | new entry 8 (7 items, three languages); entry 7 gets its archived PDF | the guide's own rule: a changed tool gives a new edition, the earlier one stays as printed | `editions/tools-guide-7-*.pdf` = the edition 7 PDFs as committed at `80ec8052` |
| Time Study, how 1 | EN | "…the tool gives the takt." → + "Fill in “Performance rating (%)” and “Allowance (%)” too." | the fields are new | time-study.njk:25-33 |
| | DE | + "Füllen Sie auch „Leistungsgrad (%)“ und „Zuschlag (%)“ aus." | | |
| | SQ | + "Plotëso edhe fushat “Vlerësimi i ritmit (%)” dhe “Shtesa (%)”." | | |
| Time Study, get | EN | "The standard time of each element with its spread, a Yamazumi…" → "The observed median of each element with its spread, and its standard time: the median × the rating × (1 + the allowance), the median itself at 100 % and 0 %. A Yamazumi…" | T-23/P2B-09: the median was called the standard time | time-study.js:40 |
| | DE | "Die Standardzeit jedes Elements mit ihrer Streuung, …" → "Der beobachtete Median jedes Elements mit seiner Streuung und seine Standardzeit: Median × Leistungsgrad × (1 + Zuschlag), bei 100 % und 0 % der Median selbst. …" | | |
| | SQ | "Koha standarde e çdo elementi me shpërndarjen e saj, …" → "Mediana e vëzhguar e çdo elementi me shpërndarjen e saj, dhe koha e tij standarde: mediana × vlerësimi i ritmit × (1 + shtesa), vetë mediana me 100 % dhe 0 %. …" | | |
| KPI Diagnostic, when | EN | "…find out where the cause sits." → "…see where the cause may sit." | the tool gives a hypothesis | kpi-diagnostic.js:39-72 |
| | DE | "…finden Sie heraus, wo die Ursache liegt." → "…sehen Sie nach, wo die Ursache liegen könnte." | | |
| | SQ | "…gjej ku është shkaku." → "…shiko ku mund të jetë shkaku." | | |
| KPI Diagnostic, how 4 (new) | EN | "Check it on the floor before you act: watch the work, ask the people who do it, look at the data." | the tool's own "How sure is this?" text | kpi-diagnostic.js:71 (CAVEAT) |
| | DE | "Prüfen Sie das Ergebnis vor Ort, bevor Sie handeln: …" | | |
| | SQ | "Verifikoje në terren para se të veprosh: …" | | |
| KPI Diagnostic, get | EN | "The cause that fits best (…), with three first moves …; when no single cause stands out, …" → "A leading hypothesis to check, not a verdict: the cause your answers point to (…), named only at 4 of 6 or more and 2 points ahead of the rest, with its margin, three first moves and a “Question for the floor”. Causes one point apart are named together; when no single cause stands out, the advice to go and see the work. Every result says how sure it can be, with a score for each cause, to take on to 5 Whys or to the Action Tracker as a check on the floor." | P2A-08 | kpi-diagnostic.js:44-50, 161, 209 |
| | DE | "Die Ursache, die am besten passt …" → "Eine führende Hypothese zum Prüfen, kein Urteil: … nur ab 4 von 6 Punkten und mit 2 Punkten Vorsprung …" | | |
| | SQ | "Shkaku që përputhet më mirë …" → "Një hipotezë kryesore për ta verifikuar, jo një vendim: … vetëm me 4 nga 6 pikë ose më shumë dhe 2 pikë para të tjerëve …" | | |
| ATS CV, how 1 | all | "PDF or Word file" → "PDF, Word or JSON Resume file" (DE "PDF-, Word- oder JSON-Resume-Datei", SQ "PDF, Word ose JSON Resume") | JSON Resume import | ats-cv.njk:11; `77157234` |
| ATS CV, how 4 | EN | "…paste the ad and read the ATS check." → "…paste the ad. Its skills and terms are found in any spelling (ä or ae, ë or e) and under other words for the same skill (marked ≈); those from the part that lists what is required weigh double." | the match changed | `0f80fffa`, ats-cv.js:924-930 |
| | DE/SQ | the same, "(ä oder ae, ß oder ss)" / "(ë ose e, ä ose ae)" | | |
| ATS CV, get | EN | "Your CV as PDF, Word (.docx) and plain text." → "…, plain text and JSON Resume (.json); the ATS check; and how many of the ad's key words your CV uses, with the missing ones: a guide, not a prediction of what software or a recruiter will decide." | the score is a guide, no pass mark | ats-cv.js:914-916 |
| | DE/SQ | the same in German and Albanian, the tool's own words ("Anhaltspunkt", "tregues") | | ui.json |
| Room Inspection, get | EN | + "; an inspection with items still open is never a pass: it has no verdict and stays out of the pass rate, unless a critical item failed, which fails the room at once." | P2B-05: a half-done inspection was counted; the author's rule of 27 October 2026 (a critical failure fails at once, an incomplete check never passes), corrected by the coordinator after review; DE/SQ alike ("besteht nie … ein kritischer Mangel lässt das Zimmer sofort durchfallen", "nuk kalon kurrë … përveç kur ka rënë një pikë kritike") | `fb3cdb26`, `src/js/room-inspection.js` `verdict` |
| | DE | + "; eine Kontrolle mit noch offenen Punkten hat kein Ergebnis und zählt in der Quote nicht mit." | | |
| | SQ | + "; një inspektim me pika ende të pagjykuara nuk ka verdikt dhe mbetet jashtë kësaj përqindjeje." | | |
| 5S Audit, get | EN/DE/SQ | "the trend and a league table of the areas" → "… without partial audits" ("ohne unvollständige Audits", "pa auditet e pjesshme") | P2B-11 | `6f04859b` |
| Site Compare, get | EN | "a score per site by a rule you can see" → "…, with the number behind each rate, for the sites with enough data" | P2A-13: a site with 2 routes ranked first | `58178333` |
| | DE/SQ | "…, mit der Zahl hinter jeder Quote, für Standorte mit genug Daten" / "…, me numrin pas çdo treguesi, për objektet me të dhëna të mjaftueshme" | | |
| Shift Handover, get | EN/DE/SQ | + "or with “Send to the next shift”, as a link or a QR code" | the feature since edition 7 | `04f830d8` |
| Shift Handover, data | EN | "The handover stays in this browser. Nothing is sent." → "The handover stays in this browser and goes only where you send it: a link holds it after the #, which no server receives." | "Nothing is sent" no longer covers the link | `04f830d8` (hash after `#h=`) |
| | DE/SQ | the same ("Ein Link trägt sie hinter dem Zeichen #, das kein Server erhält." / "një link e mban pas shenjës #, që nuk e merr asnjë server.") | | |

"100 % and 0 %" is written with a no-break space before "%", so a line never starts with "%" (the first print had
"100" and "%" on two lines).

The public note is the guide's own: "What changed in Edition 8" on `/guides/tools-guide.html` (and DE, SQ), with the
date, and edition 7 downloadable as printed.

### Cards and ledes

| File | Lang | Before → after | Reason |
|---|---|---|---|
| src/tools/kpi-diagnostic.njk (lede) | EN | "…find where the process first became unstable. Rate ten statements about the work behind the number." → "…see where your answers point. Rate ten statements about the work behind the number, then check the leading hypothesis on the floor." | the tool never found where a process became unstable (P2A-08) |
| src/de/tools/kpi-diagnostic.njk | DE | "…finden Sie heraus, wo der Prozess zuerst instabil wurde. …" → "…sehen Sie, wohin Ihre Antworten deuten. …, und prüfen Sie dann die führende Hypothese vor Ort." | |
| src/sq/tools/kpi-diagnostic.njk | SQ | "…zbulo ku u lëkund së pari procesi. …" → "…shiko nga anojnë përgjigjet e tua. …, pastaj verifiko në terren hipotezën kryesore." | |
| src/_data/tools.json (+de, sq), KPI card | all | "Ten statements show whether the cause is clarity, …, with first moves for each." → "Ten statements show which cause your answers point to, clarity, …, as a hypothesis to check on the floor, with first moves." | same |

Left as they are: the Time Study card and lede ("the standard time" is now what the tool gives); the ATS CV card
and lede (they never stated the 60 % pass mark; "matched to the job ad" is the tool's own button "Match a job ad").

### Print

`node scripts/page-fit.mjs tools-guide` (five pages grew: EN/SQ p42, DE p33, p58, p67; only the `tools-guide`
entries of `src/_data/pageFit.json` changed), then `node scripts/tools-guide.mjs` (pymupdf installed with pip).
81 pages in each language, as before. Checked with `pdftotext`: the cover says "EDITION 8 · OCTOBER 2026" /
"AUSGABE 8 · OKTOBER 2026" / "BOTIMI 8 · TETOR 2026"; the new sentences of every changed entry are found in all three
PDFs; and `tests/pdf-matches-html.test.cjs` finds every block of the 81 reader pages on the same PDF page.

## 2. The PDF check (CI-04): tests/pdf-matches-html.test.cjs

What it compares, for each of the 294 PDFs offered by a page (240 MR issues, 3 special edition, 6 From the Floor,
39 treatise, 3 Tools Guide, 3 book) plus the 21 archived guide editions:

1. the h1 is printed, and the PDF's /Title names it or its series, with no other issue number in it;
2. every part of the eyebrow with a digit (No. 80, November 2026, Volume 6, Edition 8) is printed;
3. reader pages = PDF pages = the "Pages" fact;
4. every dated correction of the issue (date and text) is printed;
5. every block of text of each reader page is on the same PDF page, and no word is on a PDF page that its reader
   page lacks (catches a stale PDF in both directions, and the colophon line once it is on the print pages);
6. every number of "Read it as text" is in the PDF;
7. the book (its reader shows pictures) against `scripts/book/<lang>.txt`, page by page;
8. each archived guide edition has its number on its cover.

Normalisation on both sides: NFKC (ligatures), lower case and ß→ss (CSS capitals), soft hyphens and zero-width
marks dropped, hyphens and dashes dropped (hyphenation), quotes unified (pdf.js returns ʼ for some closing quotes),
white space removed (letter-spaced labels read "N O . 8 0"). Diacritics are kept. Elements the print CSS hides
(`display: none`, today `.src.many li i`, the source URLs of the treatise volumes with more than nine sources) are
left out. Runtime: about 18 s alone, 30 s inside the full suite (three worker threads).

**Found today: no mismatch.** Every PDF matches its page on all eight points. I checked that the test does find
mismatches: changing one figure of MR No. 80 in the built page ("73" → "74"), its page count, and one chapter title
of the English book text each failed with the file, page and text named. `KNOWN_MISMATCHES` is empty; an entry that
no longer matches fails, so the list can only shrink.

Not compared, on purpose: the series-wide note "Correction, 12 October 2026. After this issue went online, every
figure … was checked a second time …" (marked `data-series`, shown on 64 issues). It is the site's note about the
archive and links to it; no PDF prints it. The PDFs were printed on 17 October, after that check, so their figures
are the checked ones. If the author wants the PDF to say it too, that is a template change (decision below).

## 3. Proposals (not changed: outside "ledes only")

| File | Lang | Text | Problem | Proposed |
|---|---|---|---|---|
| src/tools/kpi-diagnostic.njk:4-5 | EN | seo_title "…cause and first moves"; description "…find out whether the cause is clarity, skill, …" | the same overclaim as the old lede | "KPI turned red? A two-minute diagnostic: where to look first"; "…see which cause your answers point to: clarity, skill, capacity, process design or ownership, as a hypothesis to check on the floor." |
| src/de/tools/kpi-diagnostic.njk:5-6 | DE | "…Ursache und erste Schritte"; "…Liegt die Ursache bei Klarheit, …?" | same | "…wo Sie zuerst hinschauen"; "…Auf welche Ursache deuten Ihre Antworten: …? Eine Hypothese, die Sie vor Ort prüfen." |
| src/sq/tools/kpi-diagnostic.njk:5 | SQ | "…a është shkaku te qartësia, …?" | same | "…nga cili shkak anojnë përgjigjet e tua: …? Një hipotezë për ta verifikuar në terren." |
| src/tools/ats-cv.njk:5 (+de) | EN/DE | "…that application software reads without mistakes" / "fehlerfrei liest" | no tool can promise that any ATS reads a CV without mistakes | "…laid out so that application software can read it in order" |
| src/tools/ats-cv.njk:12 (+de, sq), ats-cv.njk:206 | all | "Most large employers let software read your CV before a person does." | no source given | cite a source or say "Many employers…" (NOT VERIFIED) |

## 4. Decisions for the author

1. Print the series-wide second-check note in the PDFs too (sources page), or keep it on the site only.
2. The KPI and ATS descriptions above (search snippets).
3. Whether the "What changed in Edition 8" list should also name Inventory ABC ties, Hotel KPIs' oversold nights,
   Process Lab's decimal mark and Heijunka's caps (left out to keep the list short; their guide entries are not wrong).
