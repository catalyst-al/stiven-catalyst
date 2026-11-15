# SEO program: Phase 1 findings and backlog (2026-11-14)

Phase 1 measures. It changes no titles, descriptions, canonicals, pages or tools. Every proposed change below names
the evidence behind it and how to tell whether it worked, so Phase 2 can be judged in Search Console and not on
opinion.

## 1. The data

Sources: the Search Console exports of 2026-11-14 (Performance on Search, "last 3 months", web) and the coverage
validation export of the same day ("Crawled - currently not indexed", sitemap "All known pages"). The four
performance zip files that were uploaded are byte-for-byte identical, so they are one data set.

The export covers **17 Oct – 11 Nov 2026 (26 days)**. Search Console shows nothing earlier for this property, so the
site is about four weeks old in Google's eyes. All conclusions below are early and should be read again at 90 days.

| Metric | Value |
|---|---|
| Clicks | 24 |
| Impressions | 1,534 |
| CTR | 1.6 % |
| Average position | 20.5 (impression-weighted, from Chart.csv) |
| Clicks to the English homepage | 14 of 24 (58 %): mostly brand/navigational |
| Clicks from Germany | 18 of 24 (321 impressions, CTR 5.6 %) |
| United States | 458 impressions, 1 click (position 23.5) |
| Mobile vs desktop | mobile CTR 3.4 % at position 14; desktop 1.2 % at position 21.6 |
| Queries shown in the export | 124 queries, 351 impressions, 0 clicks: 77 % of impressions are anonymised long-tail |

By page type (from Pages.csv, which aggregates by page, so totals differ slightly from the chart):

| Type | Pages | Impressions | Clicks | CTR | Avg. position |
|---|---|---|---|---|---|
| Tools (EN/DE/SQ) | 82 | 570 | 0 | 0 % | 38.6 |
| Magazine issues and volumes (HTML) | 151 | 709 | 5 | 0.7 % | 9.8 |
| ...of them English | 97 | 609 | 2 | 0.3 % | 9.3 |
| Essays and reflections | 54 | 173 | 4 | 2.3 % | 14.1 |
| Homepages | 2 | 37 | 14 | 37.8 % | 3.8 |
| PDF editions | 19 | 68 | 0 | 0 % | 7.8 |

Two different problems, then:

1. **Tools are found but rank too low to be clicked** (position ~39; "schichtübergabe" 83, "kaizen board" 71,
   "5 whys worksheet" 83). That is a ranking (relevance/authority) problem, not a snippet problem.
2. **Magazine issues already rank on page one (~9) and still get no clicks** (English: 609 impressions, 2 clicks).
   That is a snippet/intent problem: the title and description do not answer what the searcher typed.

## 2. What the Phase 1 audit found on the built site

`node scripts/seo-audit.mjs` (in CI since this change; report: `docs/seo/audit-2026-11-14.md`):

Statuses below are modelled from the built files the way GitHub Pages serves them (folder with slash → 200, without
→ 301, `a` → `a.html` 200, otherwise 404.html with 404). Nothing was fetched from the live site.

- 908 HTML pages; 894 indexable; 894 addresses in the sitemap; exactly the indexable pages, no more, no less.
- **0 errors.** Every sitemap address resolves to a built page (modelled 200); every indexable page has one self-referencing canonical and an
  og:url equal to it; EN/DE/SQ hreflang is reciprocal everywhere, with x-default on English; JSON-LD parses; no
  internal link answers 404; robots.txt allows everything and names the sitemap.
- **0 warnings.** No internal link goes through a 301 or an alias, no duplicate titles or descriptions between pages
  that are not translations of each other, no orphan pages.
- **14 intentional exclusions**, all noindex and all outside the sitemap: 404, offline, search ×3, shelf ×3,
  impressum ×3, datenschutz ×3.

So the technical base is sound. The site does not lose clicks to a crawl or indexing defect that code can fix; it
loses them to ranking and to snippets. Phase 2 is therefore content and snippet work, measured page by page.

## 3. Backlog, in order

Order: Search Console impressions and position first, then how directly the evidence ties the problem to the page,
then effort. No third-party "SEO score" is used. The export lists queries and pages separately, so where a query is
tied to a page below, that link is an inference from the page's text and is marked as such. "Measure" says what to read in Search Console
28 days after the change (Pages → filter on the address → compare with the previous 28 days).

### P1. Management Review No. 61 (EN): `/magazine/management-review-nr-61.html`

- Evidence: 85 impressions, 0 clicks, position 10.3: the most impressions of any single page in the export (the
  homepage has 31). Topic, from the page: the EU platform work directive (due 2 December 2026) and algorithmic
  management. No query in the export can be tied to this page with certainty.
- Current title: "Management Review No. 61: Algorithmic management of work" (56 chars). It leads with the
  publication's name and issue number, which no one searches for; "platform work directive" is in the description
  only.
- Phase 2 first step: in Search Console, Performance → Pages → this address → Queries, export the queries. Then
  rewrite the title around the query that has most impressions, e.g. "EU Platform Work Directive: algorithmic
  management at work · No. 61", keeping the issue number at the end like No. 04 and No. 96 already do. Do not
  change the address or the canonical.
- Contextual links in: 4 (the archive, the downloads page, issues 60 and 62). Add a link from the essays on
  dashboards/systems ("when the dashboard turns red before you", "the system is faster than you") where the text
  already talks about software directing work.
- Measure: CTR from 0 % to ≥ 3 % at similar position.

### P2. Management Review No. 04 (EN): `/magazine/management-review-nr-04.html`

- Evidence: 44 impressions, 0 clicks, position 7.4. Inferred queries: citation look-ups of the meta-analysis the
  issue cites, e.g. "frazier fainshmidt klinger pezeshkan vracheva 2017 psychological safety meta analytic review 136
  samples": 8 impressions across five variants, positions 3.5–9. Inference: "136 samples" appears on this page only
  (the authors are also cited in Operational Treatise vol. 07), and its description says "a meta-analysis of 136
  samples". Confirm with the per-page query export.
- Reading: the searcher wants the paper. The page cannot become the paper, but it can be the best summary of it.
- Phase 2: (a) make sure the issue gives the full citation with the DOI link near the top, so the snippet can show
  it; (b) test a description that names the authors and year ("Frazier et al. 2017: the meta-analysis of 136
  samples on psychological safety, what it found, and seven questions for your team"). Leave the title, which
  already leads with the topic.
- Same pattern in No. 60 (query "slemp kern patrick ryan 2018 leader autonomy support", position 9.5, served by the
  **PDF** of No. 60 rather than its HTML page, see P6).
- Measure: CTR ≥ 5 % for the citation queries.

### P3. German Damage Control: `/de/tools/damage-control/`

- Evidence: 57 impressions, 0 clicks, position 23.4. Inferred queries (the German H1 is "Schadenskontrolle"):
  "schadenskontrolle" 46 impressions at 26.0,
  "schadenkontrolle" 3 at 10.0, "vollständigkeitskontrolle" (the sister tool) 2 at 21.5.
- Finding: the rendered title is "Schadensquote berechnen | Stiven Catalyst". The seo_title in
  `src/de/tools/damage-control.njk` is "Schadensquote berechnen: Schadensprotokoll für Lager und Zustellung", but
  `fitTitle` cuts it at the colon, so "Schadensprotokoll für Lager und Zustellung" never reaches the result page. The
  page's H1 is "Schadenskontrolle", the word people search, and it is in neither the title nor the description.
- Phase 2: one title change, e.g. "Schadenskontrolle: Schadensquote und Schadensprotokoll für Lager", checked against
  `fitTitle` so the part after the colon survives (the build's title tests will say). Caveat: "Schadenskontrolle"
  also means damage control in insurance and the navy; check the query list for this page before changing.
- Contextual links in: 26 (healthy). Do not add more links for their own sake.
- Measure: position for "schadenskontrolle" from 26 to < 15; first clicks.

### P4. English Damage Control: `/tools/damage-control/`

- Evidence: 22 impressions, 0 clicks, position 10.5: the best-ranked tool. Query "damage rate" at position 2
  (1 impression).
- Title: "Damage rate calculator and damage log for warehouse and delivery" (64 chars, without the site name) —
  already query-led. No title change yet: the sample is too small.
- Phase 2: add the short answer the query implies to the visible text above the tool (the formula: damaged units ÷
  units handled × 100, with one worked example), so the page can win a featured answer for "damage rate formula" /
  "how to calculate damage rate". Measure impressions for "damage rate" queries.

### P5. German Shift Handover: `/de/tools/shift-handover/` (and English `/tools/shift-handover/`)

- Evidence: DE 57 impressions at position 76.8; EN 47 at 70.0. Inferred queries: "schichtübergabe" 40 at 83.0,
  "schichtübergabe produktion" 11 at 80.6, "schichtübergabe protokoll" 88, "digitale schichtübergabe" 83, "software
  zur schichtübergabe" 43; EN "shift handover software" 84, "shift handover template" 71, "shift turnover" 80.
- Finding: the page is not weakly linked (57 contextual links in, DE) and its title is already query-led
  ("Schichtübergabe-Vorlage: Zahlen, offene Punkte, Hinweise"). So neither internal links nor the title explain
  position ~80; the export cannot say why. Hypothesis to check by looking at the live results: the head terms
  are served by software vendors and downloadable templates.
- Phase 2: (a) target the long tail where the site can win: "Schichtübergabe Protokoll Vorlage" / "shift handover
  template" — offer the printable/PDF version of the empty template prominently (the print pack already exists);
  (b) a short German section "Schichtübergabe in der Produktion" with the fields a production handover needs, since
  that query has 11 impressions; (c) do not rename the title until the queries for this page are exported.
- Measure: any query for this page reaching positions < 30.

### P6. The 13 HTML addresses "Crawled – currently not indexed" (validation of 2026-11-14)

Addresses: `/de/magazine/management-review-nr-96.html`, `/sq/magazine/management-review-nr-25.html`,
`/de/magazine/management-review-nr-79.html`, `/de/magazine/management-review-nr-21.html`,
`/sq/magazine/operational-treatise-vol-01.html`, `/sq/magazine/operational-treatise-vol-02.html`,
`/de/magazine/management-review-nr-77.html`, `/magazine/management-review-nr-15.html`,
`/de/magazine/management-review-nr-74.html`, `/de/magazine/management-review-nr-07.html`,
`/insights/61-resellers/`, `/de/magazine/management-review-nr-80.html`,
`/de/magazine/management-review-2026-09.html`.

- Technical check (audit, priority table): all 13 resolve to a built page (modelled 200), are indexable, in the sitemap, self-canonical, with
  reciprocal de/en/sq hreflang; titles 44–60 chars; descriptions 134–158 chars; 2,000–16,000 words of real text in
  the page's own language (checked for No. 96 DE). **There is no technical defect to fix.**
- What the evidence points to instead (hypotheses; Search Console does not give a reason for this status):
  - **Volume and speed.** `src/_data/online.json`: 84 publications went online between 8 and 12 October, in three
    languages, each also as a PDF: roughly 250 HTML pages and 250 PDFs from a domain Google first saw in October.
    A burst that size on a new domain is a plausible reason for part of it to wait.
  - **Few links into each issue.** An issue has 4–5 contextual links in (the archive, the downloads page, the issue
    before and after). An issue with nothing pointing at it from an essay or a tool looks less important.
  - **PDF duplicates.** Every issue also exists as three PDFs with the same text. The PDFs are crawled and sometimes
    rank instead of the HTML (No. 60 EN PDF: 37 impressions at 8.1, more than most issue pages). GitHub Pages
    cannot send an `X-Robots-Tag` or `Link: rel=canonical` header for PDFs, so this cannot be fixed by
    configuration on the current host.
  - **The 4 non-HTML addresses** in the same export (`/feed.xml`, `/de/feed.xml`, `/sq/feed.xml`,
    `/js/coaching-data.js`, the No. 87 SQ PDF) are expected not to be indexed. Feeds and scripts are not pages;
    nothing to do.
- Phase 2: (a) do not resubmit or "request indexing" page by page; let the validation run; (b) add contextual links
  from essays and tools to the issues they relate to (start with issues already getting impressions); (c) publish
  new issues at a steady rate rather than in bursts; (d) decide on the PDFs (see risks).
- Measure: the count in "Crawled – currently not indexed" in four and eight weeks.

### P7. Measurement itself

- Export the queries per page (Performance → Pages → page → Queries) for P1–P5 before changing anything; the export
  used here has queries and pages separately, so no query can be tied to a page with certainty.
- Re-export the same report at 90 days, when the property has three full months.
- Analytics: `site.json` has `analytics.cloudflareToken` empty, so there are no visit counts besides Search
  Console. If wanted, set the token (Cloudflare Web Analytics: no cookies; writing pages only, never tool pages,
  as the layout already arranges).

## 4. Remaining risks

- The audit reads the built files and models GitHub Pages' answers (200 / 301 / 404). It does not fetch the live
  site, so a DNS, HTTPS or host-level redirect problem (www → apex, http → https) is outside its view. Check those
  once with `curl -I` after each host change.
- The contextual-link count treats every link inside `<main>` as contextual, including prev/next and archive lists;
  it overstates editorial links slightly.
- PDFs compete with their HTML pages and cannot carry a canonical on GitHub Pages.
- 26 days of data, 24 clicks: every number above can move a lot in a month.

## 5. Recommended Phase 2 changes (each one a small PR, measured separately)

1. Export per-page queries for P1–P5 (no code).
2. P1: retitle No. 61 around the directive (one line in the issue's data). Measure 28 days.
3. P3: German Damage Control title with "Schadenskontrolle", checked against `fitTitle`.
4. P2: citation and DOI near the top of No. 04 and No. 60; description test for No. 04.
5. P4: the damage-rate formula and a worked example above the English tool.
6. P5: printable empty handover template made prominent; a short production section in German.
7. P6: links from the most relevant essays and tools to 10–20 issues that already get impressions.
8. Decide whether the PDFs should stay crawlable (`/media/` is not in robots.txt; disallowing it would also stop
   Google from reading the PDFs at all, so this is an editorial decision, not a fix).
9. Extend the audit with a "title contains the H1's main term" check, once P3 shows whether that matters.
