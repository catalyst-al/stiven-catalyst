# SEO program: Phase 1 findings and backlog (2026-11-14)

Phase 1 measures. It changes no titles, descriptions, canonicals, pages or tools. Each proposed change below says
what evidence it rests on and how to tell whether it worked, so Phase 2 is judged in Search Console, not on opinion.

**Privacy.** This repository is public. The Search Console figures behind this backlog (clicks, impressions, CTR,
positions, exported queries, countries, devices) are kept out of it, in the owner's own exports and in a local,
git-ignored copy (`docs/seo/private/`, see `.gitignore`). This file keeps only what is public anyway (the site's
addresses and pages), what the audit measures on the built site, and qualitative descriptions of the evidence.

## 1. What the Search Console data shows (qualitative)

Source: the owner's Search Console exports of 2026-11-14 (Performance on Search, web; coverage validation
"Crawled – currently not indexed"). The property has less than a month of data, so every reading is early and
should be repeated once it has three full months.

- Most clicks so far are on the English homepage, i.e. people looking for the site by name.
- **Tools** are shown in results but rank too low to be clicked (mostly beyond page three). That is a ranking
  (relevance/authority) problem, not a snippet problem.
- **Magazine issues** already rank on page one and are hardly clicked. That is a snippet/intent problem: the title
  and description do not answer what the searcher typed.
- Most impressions come from queries that Search Console anonymises, so the export cannot tie a query to a page
  with certainty. Where this backlog connects a search term to a page, that is an inference from the page's own
  text and is marked as such.

## 2. What the Phase 1 audit found on the built site

`node scripts/seo-audit.mjs` (in CI; snapshot: `docs/seo/audit-2026-11-14.md`). Statuses are modelled from the built
files the way GitHub Pages serves them (folder with slash → 200, without → 301, `a` → `a.html` 200, otherwise
404.html with 404). Nothing was fetched from the live site.

- 908 HTML pages; 894 indexable; 894 addresses in the sitemap: exactly the indexable pages, no more, no less.
- **0 errors.** Every sitemap address resolves to a built page (modelled 200); every indexable page has one
  self-referencing canonical and an og:url equal to it; EN/DE/SQ hreflang is reciprocal everywhere, with x-default
  on English; JSON-LD parses; no internal link resolves to 404; robots.txt allows everything and names the sitemap.
- **0 warnings.** No internal link goes through a 301 or an alias, no duplicate titles or descriptions between pages
  that are not translations of each other, no orphan pages.
- **14 intentional exclusions**, all noindex and all outside the sitemap: 404, offline, search ×3, shelf ×3,
  impressum ×3, datenschutz ×3.

The technical base is sound. Clicks are not lost to a crawl or indexing defect that code can fix; they are lost to
ranking and to snippets. Phase 2 is content and snippet work, measured page by page.

## 3. Backlog, in order

Order: Search Console impressions and position first (read from the private exports), then how directly the
evidence ties the problem to the page, then effort. No third-party "SEO score" is used. "Measure" says what to read
in Search Console 28 days after a change (Pages → filter on the address → compare with the previous 28 days).

### P1. Management Review No. 61 (EN): `/magazine/management-review-nr-61.html`

- Evidence: the most impressions of any single page, ranking at the foot of page one, without clicks. Topic, from
  the page: the EU platform work directive (due 2 December 2026) and algorithmic management.
- Current title: "Management Review No. 61: Algorithmic management of work". It leads with the publication's name
  and issue number; "platform work directive" is in the description only.
- Phase 2 first step: export this page's queries (Performance → Pages → this address → Queries). Then rewrite the
  title around the query with most impressions, e.g. "EU Platform Work Directive: algorithmic management at work
  · No. 61", keeping the issue number at the end like No. 04 and No. 96 already do. Do not change the address or
  the canonical.
- Contextual links in (audit): 4 (the archive, the downloads page, issues 60 and 62). Add links from essays that
  already talk about software directing work ("when the dashboard turns red before you", "the system is faster
  than you").
- Measure: CTR at a similar position, before and after.

### P2. Management Review No. 04 (EN): `/magazine/management-review-nr-04.html`

- Evidence: ranks high on page one without clicks. Inference: people look up the meta-analysis the issue cites
  (Frazier et al. 2017, psychological safety, 136 samples). Inference: "136 samples" appears on this
  page only (the authors are also cited in Operational Treatise vol. 07), and its description says "a
  meta-analysis of 136 samples". Confirm with the per-page query export.
- Reading: the searcher wants the paper. The page cannot become the paper, but it can be the best summary of it.
- Phase 2: (a) give the full citation with the DOI link near the top, so the snippet can show it; (b) test a
  description that names the authors and year ("Frazier et al. 2017: the meta-analysis of 136 samples on
  psychological safety, what it found, and seven questions for your team"). Leave the title, which already leads
  with the topic.
- Same pattern in No. 60 (a look-up of a study the issue cites), where the **PDF** of No. 60 is shown rather than
  its HTML page (see P6).
- Measure: CTR for the citation queries.

### P3. German Damage Control: `/de/tools/damage-control/`

- Evidence: shown without clicks, on page two to three. Target term: "Schadenskontrolle", the page's own H1.
- Finding (built site): the rendered title is "Schadensquote berechnen | Stiven Catalyst". The seo_title in
  `src/de/tools/damage-control.njk` is "Schadensquote berechnen: Schadensprotokoll für Lager und Zustellung", but
  `fitTitle` cuts it at the colon, so "Schadensprotokoll für Lager und Zustellung" never reaches the result page.
  "Schadenskontrolle" is in neither the title nor the description.
- Phase 2: one title change, e.g. "Schadenskontrolle: Schadensquote und Schadensprotokoll für Lager", checked against
  `fitTitle` so the part after the colon survives (the build's title tests will say). Caveat: "Schadenskontrolle"
  also means damage control in insurance and the navy; check this page's queries before changing.
- Contextual links in (audit): 26. Do not add more links for their own sake.
- Measure: position for the target term; first clicks.

### P4. English Damage Control: `/tools/damage-control/`

- Evidence: the best-ranked tool, near the top of page two, without clicks. Target term: "damage rate", the first
  words of its title.
- Title: "Damage rate calculator and damage log for warehouse and delivery": already query-led. No title change
  yet: the sample is too small.
- Phase 2: add the short answer the query implies to the visible text above the tool (the formula: damaged units ÷
  units handled × 100, with one worked example), so the page can answer "damage rate formula" / "how to calculate
  damage rate". Measure impressions for "damage rate" queries.

### P5. German Shift Handover: `/de/tools/shift-handover/` (and English `/tools/shift-handover/`)

- Evidence: both shown far down the results (around page eight). Target terms: "Schichtübergabe" and
  "shift handover", the pages' own H1s.
- Finding (built site): the page is not weakly linked (57 contextual links in, DE) and its title is already
  query-led ("Schichtübergabe-Vorlage: Zahlen, offene Punkte, Hinweise"). So neither internal links nor the title
  explain the position; the export cannot say why. Hypothesis to check by looking at the live results: the head
  terms are served by software vendors and downloadable templates.
- Phase 2: (a) aim at the longer, more specific searches the site can win (template, protocol, production); the
  per-page query export will name them. The tool already has Print and Save as PDF; make the empty printable template prominent; (b) a short
  German section "Schichtübergabe in der Produktion" with the fields a production handover needs; (c) do not
  rename the title until this page's queries are exported.
- Measure: any query for this page reaching the first three pages.

### P6. The 13 HTML addresses "Crawled – currently not indexed" (validation of 2026-11-14)

Addresses: `/de/magazine/management-review-nr-96.html`, `/sq/magazine/management-review-nr-25.html`,
`/de/magazine/management-review-nr-79.html`, `/de/magazine/management-review-nr-21.html`,
`/sq/magazine/operational-treatise-vol-01.html`, `/sq/magazine/operational-treatise-vol-02.html`,
`/de/magazine/management-review-nr-77.html`, `/magazine/management-review-nr-15.html`,
`/de/magazine/management-review-nr-74.html`, `/de/magazine/management-review-nr-07.html`,
`/insights/61-resellers/`, `/de/magazine/management-review-nr-80.html`,
`/de/magazine/management-review-2026-09.html`.

- Technical check (audit, priority table): all 13 resolve to a built page (modelled 200), are indexable, in the
  sitemap, self-canonical, with reciprocal de/en/sq hreflang; titles 44–60 chars; descriptions 134–158 chars;
  about 2,000–16,000 words of text in the page's own language (checked for No. 96 DE). **No technical defect to
  fix.**
- What the evidence points to instead (hypotheses; Search Console gives no reason for this status):
  - **Volume and speed.** `src/_data/online.json`: 84 publications went online between 8 and 12 October, in three
    languages, each also as a PDF: roughly 250 HTML pages and 250 PDFs from a new domain. A burst that size is a
    plausible reason for part of it to wait.
  - **Few links into each issue.** An issue has 4–5 contextual links in (the archive, the downloads page, the issue
    before and after).
  - **PDF duplicates.** Every issue also exists as PDFs with the same text. The PDFs are crawled and sometimes are
    shown instead of the HTML page (No. 60, see P2). GitHub Pages cannot send an `X-Robots-Tag` or
    `Link: rel=canonical` header for PDFs, so this cannot be fixed by configuration on the current host.
  - The non-HTML addresses in the same export (`/feed.xml`, `/de/feed.xml`, `/sq/feed.xml`, `/js/coaching-data.js`,
    the No. 87 SQ PDF) are expected not to be indexed. Feeds and scripts are not pages; nothing to do.
- Phase 2: (a) let the validation run instead of requesting indexing page by page; (b) add contextual links from
  essays and tools to the issues they relate to, starting with issues already shown in results; (c) publish new
  issues at a steady rate rather than in bursts; (d) decide on the PDFs (see risks).
- Measure: the count in "Crawled – currently not indexed" in four and eight weeks.

### P7. Measurement itself

- Export the queries per page (Performance → Pages → page → Queries) for P1–P5 before changing anything, and keep
  the exports out of the repository (`docs/seo/private/` is git-ignored).
- Re-export the same report once the property has three full months.
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
- Less than a month of data: every reading above can change within a month.

## 5. Recommended Phase 2 changes (each one a small PR, measured separately)

1. Export per-page queries for P1–P5 (no code; kept private).
2. P1: retitle No. 61 around the directive (one line in the issue's data). Measure 28 days.
3. P3: German Damage Control title with "Schadenskontrolle", checked against `fitTitle`.
4. P2: citation and DOI near the top of No. 04 and No. 60; description test for No. 04.
5. P4: the damage-rate formula and a worked example above the English tool.
6. P5: printable empty handover template made prominent; a short production section in German.
7. P6: links from the most relevant essays and tools to 10–20 issues that already show in results.
8. Decide whether the PDFs should stay crawlable (`/media/` is not in robots.txt; disallowing it would also stop
   Google from reading the PDFs at all, so this is an editorial decision, not a fix).
9. Extend the audit with a "title contains the H1's main term" check, once P3 shows whether that matters.
