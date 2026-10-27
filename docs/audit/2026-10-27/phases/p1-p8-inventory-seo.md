# Phase 1 (site inventory & architecture) + Phase 8 (technical SEO) — independent audit

Auditor phase: `p1-p8-inventory-seo` · Build audited: `$SRC/_site` at commit 3cb88a2 · Date: 26 Oct 2026 (UTC)
Work dir (scripts + raw outputs): `$AUDIT_WORK/p1-p8-inventory-seo/`

Key artefacts there:
- `pages.csv` — every generated HTML page (776 rows): path, URL, lang, title, canonical, robots, hreflang set, main-text word count, meta refresh.
- `pages.json` — full parse (links, resources, ids, JSON-LD, OG, feeds, language switcher).
- `checks.json` — canonical / hreflang / switcher / broken links / sitemap / orphan results.
- `pdfs.csv` — all 312 PDFs with bytes, page count, PDF title, number of linking pages.
- `neardup.json`, `words_main.json`, `langbody.json`, `graph.json` (internal link graph), `sitemap_urls.json`, `live/` (live fetches), `live_sample_result.txt`.
- Scripts: `inventory.py`, `checks.py`, `depth.py`, `dup.py`, `uniq.py`, `langbody.py`.

---

## 1. Scope & method

**Exhaustive (all 776 HTML files in `_site`)** — parsed with lxml (`inventory.py`): `<html lang>`, title, meta description, canonical, robots, hreflang, OG, JSON-LD (json.loads on every block), language switcher, every `<a href>`, every `src/srcset/poster/link href/form action`, every `id`. `checks.py` resolves every internal URL with GitHub-Pages semantics (`/x/` → `x/index.html`; `/x` → file, else `x.html`, else 301 to `x/`), checks `#fragment` targets against ids of the target page, hreflang reciprocity, switcher equivalence, sitemap ↔ pages, noindex ↔ sitemap, orphans. `depth.py` runs a BFS over the internal link graph from each language home. `dup.py` computes 6-word-shingle Jaccard/containment for every same-language page pair (≈100k pairs). `uniq.py` estimates per-tool unique text. All 312 PDFs were opened with `pdfinfo`.

**Live (GET/HEAD only, ~110 requests total):** redirect behaviour (http→https, www→apex, `/about`, `/about/`, `/about.html`, slash-less folders, `/index.html`, 404s); 22 representative files fetched and compared with the build (whitespace-normalised md5); a random sample of 60 sitemap URLs (seed 7) + 3 PDFs + 1 MP3 HEAD-checked.

**Not verified:** Google Search Console (no access — the only evidence is the historical 22 Oct 2026 snapshot: 322 indexed / 51 not indexed / 9 noindex / 3 redirect / 39 crawled-not-indexed, **with no URL list**; any mapping of those numbers to URLs below is INFERRED, never known). External (off-site) links were not checked (another phase). Rendering-dependent links created by JavaScript were not crawled (static HTML only). Rich-result eligibility in Google's own validator was not run (offline JSON parse + field checks only).

## 2. Coverage table

| Item | Status |
|---|---|
| Page inventory, languages, per-section counts | Fully tested (776/776) |
| Internal links + resources + fragments (GitHub Pages resolution) | Fully tested (static HTML) |
| Language switcher → equivalent page exists | Fully tested |
| hreflang reciprocity / x-default / codes | Fully tested |
| Canonicals (presence, absolute, self, og:url) | Fully tested |
| Sitemap well-formed, every URL exists locally, noindex/canonical consistency | Fully tested |
| Sitemap URLs 200 on live | Sampled (60/762 random) |
| robots.txt build + live | Fully tested |
| noindex / meta refresh inventory | Fully tested |
| JSON-LD parse + Article fields | Fully tested (parse); visible-vs-structured dates Sampled (5 pages + all MR issue dates from source) |
| Titles / descriptions (missing, duplicate, length, language) | Fully tested (heuristic stop-word language check) |
| Near-duplicate / thin pages | Fully tested (shingle similarity, word counts) |
| Click depth / inlinks | Fully tested (static link graph) |
| Feeds (Atom ×3, podcast RSS ×3) well-formed, item URLs | Fully tested |
| Search index freshness | Fully tested (3 languages) |
| PDFs (exist, readable, linked) | Fully tested (312) |
| Live = build parity | Sampled (22 files, all identical) |
| Date files freshness (edited.json / online.json vs git) | Source-inspected, limited by shallow clone (history starts 22 Oct) |
| Reasons for GSC "not indexed" | **NOT VERIFIED** (no GSC access, no URL list) |

---

## 3. Inventory (Phase 1 results)

### 3.1 Page counts (REPRODUCED, `inventory.py`)
776 HTML files: **en 260, de 258, sq 258** (`<html lang>` matches the `/de/`, `/sq/` prefix on all 776; 0 mismatches). The two extra EN files are `404.html` and `offline.html`.

| Section (per language) | EN | DE | SQ |
|---|---|---|---|
| Insights (essays) `/insights/<slug>/` | 40 | 40 | 40 |
| Reflections `/reflections/<slug>/` | 33 | 33 | 33 |
| Management Review issues (`nr-01…80` + special edition `2026-09`) | 81 | 81 | 81 |
| Operational Treatise volumes 1–13 | 13 | 13 | 13 |
| From the Floor issues (`nga-terreni-01/02`) | 2 | 2 | 2 |
| Magazine index pages (MR, Treatise, From the Floor) | 3 | 3 | 3 |
| Tools `/tools/<id>/` (58 tools + DMAIC training module) | 59 | 59 | 59 |
| Role pages `/roles/{shift-lead,area-manager,process-manager,career}/` | 4 | 4 | 4 |
| Tools Guide `/guides/tools-guide.html` | 1 | 1 | 1 |
| Book `/books/mall-per-durresin.html` | 1 | 1 | 1 |
| Top-level pages (home, about, contact, cv, podcast, writing, start, challenges, your-challenge, insights, reflections, field-notes, projects, publications, downloads, tools, how-this-is-made, search, shelf, impressum, datenschutz) | 21 | 21 | 21 |
| 404, offline | 2 | 0 | 0 |

**Source content vs pages (SOURCE + REPRODUCED):** the brief's "41 insights, 34 reflections, 290 notes, 4 projects per language" counts include each folder's `*.11tydata.js` file. Actual Markdown: **40 insights, 33 reflections, 289 notes, 3 projects per language**, filenames identical in all three languages (diff = empty). Insights and reflections each become a page (no `status: soon` items exist). Notes (`permalink: false`) are aggregated: 289 `<article class="note-card" id="note-…">` on each `field-notes.html` (EN/DE/SQ), and appear in the search index as `/field-notes.html#note-…`. Projects (`permalink: false`) are aggregated on `projects.html` (3 cards).

**Content parity across languages (REPRODUCED):** every non-EN page has an EN twin and vice-versa (except 404/offline). Main-text word-count ratio DE/EN median 0.963, SQ/EN median 1.013; only one page outside 0.8–1.3 (`sq/podcast.html` 0.74, because the SQ episode list text is shorter — not missing content). No content gaps found.

### 3.2 Navigation & IA (REPRODUCED)
- Main nav: 28 links (Home, Start here, Writing ▸ Insights/Challenges/Reflections/Field Notes, Tools ▸ All/Pulse/Zenith/Lumen/Atlas, CV ▸ 3 career tools, Publications ▸ MR/Treatise/From the Floor/Book/Tools Guide/Downloads, About ▸ Projects/Contact). Footer: 16 links. Nav and footer are structurally identical in EN/DE/SQ and on tool pages.
- Language switcher: present on 774 pages (absent on 404/offline by design). **All 1,548 switcher links resolve and point to the same page in the other language** (0 broken, 0 non-equivalent).
- Click depth (BFS from each home over static links): **max depth 2** for every indexable page. Book, Tools Guide, podcast, every tool, every role page: depth 1. Insights: 3 at depth 1, 37 at depth 2. MR issues: 1 at depth 1, 80 at depth 2. Reflections: all 33 at depth 2. Nothing reachable only via the sitemap; the only pages unreachable from home are `404.html` and `offline.html` (correct).
- **Inbound internal links per page (same language):** insights median 18, tools median 26, MR issues 4 (listing, prev, next, downloads), treatise volumes 4, **reflections exactly 1 (the `reflections.html` listing) for all 99 reflection pages** → see SEO-02.
- Planet families (`src/_data/families.json`, `familySky.js`): Pulse/Shift Lead 16 tools, Zenith/Area Manager 18, Lumen/Process Manager 21 (+ DMAIC as a `learn` module), Atlas/Career 3 = **58 tools**. Every one of the 59 `/tools/*/` directories belongs to exactly one family except `six-sigma-dmaic`, which is Lumen's `learn` item (schema `Course`, not `SoftwareApplication`). All `tools`, `also`, `learn` and `routine` references resolve. `tools.html` sections show 16/18/22/3 (Lumen's 22 includes DMAIC) and an ItemList of 59 — consistent with the data; the "five tool families" comment in `familySky.js:1` counts the DMAIC "learn" sky as a fifth backdrop (cosmetic comment only).

### 3.3 Downloadable publications (REPRODUCED, `pdfs.csv`)
312 PDFs, 259 MB total, all open in `pdfinfo` (0 unreadable), **all 312 linked from at least one page, 0 broken internal PDF links**, all 920 internal PDF anchors carry `download` (so the speculation-rules prefetch excludes them). Breakdown: 81 MR issues × 3 languages (243), 13 treatise volumes × 3 (39), 2 From the Floor × 3 (6), Tools Guide current × 3 + 6 editions × 3 (21), book × 3 (≈4.7 MB, 33 pages each). Live HEAD of 3 PDFs: 200 `application/pdf`.

### 3.4 Broken links, orphans, duplicates (REPRODUCED)
- **0 broken internal links/resources** across all `href/src/srcset/poster/action` in 776 pages; **0 internal links that rely on a redirect or on `.html`-less resolution** (every internal link points at the exact served file/folder); **0 broken `#fragment`s**. No absolute self-URL anywhere in HTML/XML/JSON/JS/CSS points to a non-200 form.
- Orphans (no inbound link and not in sitemap): only `404.html`, `offline.html` (intended).
- Duplicate titles within one language: **0**. The 9 duplicate-title groups are cross-language identical words (e.g. "Insights | Stiven Catalyst" EN=DE) — harmless with hreflang. Duplicate meta descriptions: **0**. Missing title/description: 0. Every indexable page has exactly one `<h1>`.
- Near-duplicates (≥0.5 Jaccard or ≥0.8 containment on 6-word shingles): 865 pairs, **856 are tool↔tool** (shared app chrome), 9 are role page ⊂ Tools Guide. No duplicate articles/issues.

### 3.5 Live vs build parity (REPRODUCED)
- At ~23:45 UTC live `/` had `last-modified: Mon, 26 Oct 2026 23:25:34 GMT` (coordinator: = deploy of abf7f81, which lacked reflections #358–#360).
- At **23:52 UTC** every live file had `last-modified: 23:50:33–34 GMT`, and **22/22 sampled files are byte-identical (whitespace-normalised md5) to the local 3cb88a2 build**: `/`, `/de/`, `/sq/`, `reflections/the-information-monopoly/`, `de/reflections/the-blame-culture/`, `sq/reflections/divide-and-rule-in-the-corridors/`, `reflections.html`, an insight (EN, DE), MR nr-80, SQ treatise vol-13, book, two tools, Tools Guide, podcast, about, `sitemap.xml`, `feed.xml`, `search-index.json`, `de/podcast.xml`, `robots.txt`. **Conclusion: live = 3cb88a2 since 23:50:33 GMT 26 Oct 2026.**

---

## 4. Technical SEO (Phase 8 results)

### 4.1 Crawl & URL forms (REPRODUCED live, `curl -I`)
| Request | Result |
|---|---|
| `http://stivencatalyst.com/` | 301 → `https://stivencatalyst.com/` |
| `https://www.stivencatalyst.com/`, `http://www…/about.html` | 301 → apex https, path kept |
| `/about` | 200 (same bytes as `/about.html`) |
| `/about/` | 404 |
| `/insights/starting-from-zero` | 301 → `/insights/starting-from-zero/` |
| `/insights/starting-from-zero/index.html`, `/index.html` | 200 (duplicate form) |
| `/de` | 301 → `/de/` |
| `/nonexistent-xyz`, `/de/nonexistent-xyz` | 404 (English 404 body for both) |

Canonicals: present on all 762 indexable pages, absolute `https://stivencatalyst.com…`, **self-referencing on 762/762**, `og:url` = canonical everywhere; form = `.html` for top pages, trailing slash for folder pages — **identical to the sitemap `<loc>` and to every internal link**. The GitHub-Pages duplicate forms (`/about`, `/x/index.html`) are not linked anywhere and canonicalise correctly; no action needed.

robots.txt (build = live): `User-agent: * / Allow: / / Sitemap: https://stivencatalyst.com/sitemap.xml`. Nothing blocked.

### 4.2 Sitemap (REPRODUCED)
`sitemap.xml` well-formed (ElementTree), **762 unique URLs = exactly the 762 indexable pages** (776 − 14 noindex; 0 meta-refresh pages). 0 URLs missing locally, 0 noindex URLs in sitemap, 0 `<loc>`≠canonical, 0 non-exact forms. Live sample 60/60 → 200 `text/html`. Lastmod: 219 URLs carry one (2026-10-16 … 2026-10-26; none in the future), **543 have none** (incl. 288 Article pages) → SEO-05. `edited.json`: within the available history (shallow clone from 22 Oct) no entry is older than the file's last commit; the 66 reflections added since 22 Oct are absent from it and correctly fall back to their front-matter date.

### 4.3 hreflang & language targeting (REPRODUCED)
Every indexable page declares exactly `en`, `de`, `sq`, `x-default` (codes correct; no `al`), x-default = EN on all, each target exists (200 form), each is reciprocal, and the self-entry equals the canonical. Noindex pages carry no hreflang/canonical (consistent). `<html lang>` correct on 776/776. **No `og:locale` on any page** and no `content-language` meta (SEO-06). Title/description language: heuristic stop-word check found 0 real mismatches (one false positive: the book title *The Goal* in DE nr-54). DE/SQ magazine issues contain ~15–25% English stop-words — these are untranslated bibliographic source titles (legitimate; could carry `lang="en"` for screen readers).

### 4.4 noindex & redirects
14 noindex pages (REPRODUCED): `search.html`, `shelf.html`, `impressum.html`, `datenschutz.html` × 3 languages (12, all linked from header/footer, all deliberate per `noindex: true` in source, e.g. `src/impressum.njk:4`), plus `404.html` and `offline.html` (not linked). The historical GSC "9 excluded by noindex" is consistent with Google having discovered 9 of the 12 linked noindex pages at that time (INFERRED). **Do not remove these noindex tags** — they are intentional (search results, per-device shelf, legal pages).

Redirect pages: **0 meta-refresh/redirect stubs in the build, 0 internal links to redirecting URLs.** The historical "3 page with redirect" are most plausibly protocol/host/slash variants Google discovered (e.g. `http://`, `www.`, slash-less folder URLs — all 301s shown above) (INFERRED; URL list not available).

### 4.5 Structured data (REPRODUCED)
All JSON-LD blocks parse (0 errors). Every indexable page: `Person` (#author) + `Organization` (#publisher). `Article` on 507 pages (insights 120, reflections 99, MR issues 243, treatise 39, From the Floor 6) — every one has headline, description, image, datePublished, dateModified (never earlier than published), inLanguage (= page lang on all), author, publisher, mainEntityOfPage (= canonical). Tools: `SoftwareApplication+WebApplication` with free `Offer` (174), DMAIC `Course` (3); `tools.html` `ItemList` (59); about `ProfilePage`; home `WebSite`. Visible byline dates match JSON-LD on sampled insights/reflections. Gaps: no `Book`, `PodcastSeries`, `Periodical/PublicationIssue`, `BreadcrumbList` (SEO-07); MR edition dates conflict with datePublished (SEO-01).

### 4.6 Titles & descriptions (REPRODUCED)
No missing/duplicate (within language). Descriptions 70–160 chars on all but 2 (`projects.html` and `de/projects.html`, 66 chars each). Titles: 401/762 > 60 chars, **260 > 70** (128 of 177 tool pages, 40 MR, 40 treatise/floor, 40 reflections, 11 insights; max 163 chars `de/tools/kanban-sizing/`) → SEO-08.

### 4.7 Thin / near-duplicate classes and the 373-URL GSC total
Indexable inventory now: **762 HTML + 312 PDFs** (PDFs are crawlable and cannot be noindexed via headers on GitHub Pages). Page classes with weak uniqueness/length signals (REPRODUCED measurements, impact INFERRED):
- 177 tool pages: median 2,042 words but ~71% of 6-word shingles shared with ≥4 other tool pages; median unique ≈ 590 words, lowest `fishbone` ≈ 300 (all languages similar).
- 12 role pages: >80% of their text is contained in the Tools Guide.
- Thin top pages: contact (26–29 words), projects (79–118), CV hub (113–148), From-the-Floor index (116–124), writing hub (162–173), your-challenge (218–231), career role page (222–258).
- 243 MR issue pages, each also published as 3 PDFs with the same text; 81 issues have datePublished 8–11 Oct 2026.

Growth since the snapshot (SOURCE, `git diff --diff-filter=A 233e1e0..HEAD`): since 22 Oct 13:50 the site added 22 reflections (66 pages), treatise volumes 5–13 (27 pages) and 45 tools (135 pages, #324 etc.). So on 22 Oct roughly **~530 indexable HTML URLs** existed (INFERRED, ±10), and GSC knew 373 (322+51). The gap and the 39 "crawled – currently not indexed" are consistent with a site that is ~4 weeks old and published hundreds of URLs in days; which URLs, and why Google chose not to index them, is **NOT VERIFIED**. Technically, every indexable URL is eligible (200, self-canonical, in sitemap, linked, not blocked).

### 4.8 Feeds & freshness (REPRODUCED)
- Every page (775/776) has `<link rel="alternate">` for its language's Atom feed and podcast RSS.
- `feed.xml`, `de/feed.xml`, `sq/feed.xml`: well-formed Atom, 30 entries each (22 reflections, 7 magazine, 1 guide), all entry URLs exist; **0 insights in the 30-entry window** (they are older). `podcast.xml` ×3: well-formed RSS 2.0 with iTunes + podcast namespace, 2 episodes each, enclosure URLs exist and declared `length` equals file size; AI generation disclosed in the channel description. Live MP3 served as `audio/mp3` (GitHub Pages' type) vs declared `audio/mpeg` (cosmetic).
- Newest content ("The information monopoly", 3cb88a2): present in sitemap (3 URLs), all three Atom feeds, all three `search-index.json` (528 entries each: 40 essays, 33 reflections, 289 notes, 59 tools, 81 issues, 13 treatise, 2 floor, 1 guide, 1 podcast, 9 pages), and live (200, identical to build) since 23:50 UTC.

---

## 5. Defect register (most severe first)

### SEO-01 — Management Review issues 41–80 carry a future edition month ("November 2026") that contradicts their structured and visible publication dates
- Severity: P2
- URL: https://stivencatalyst.com/magazine/management-review-nr-41.html … nr-80 (×3 languages = 120 pages) and `/magazine/management-review.html` (month filter "November 2026 · 40")
- Source: `lib/weekly/issues/41.js:8` (`date: x("November 2026", …)`) … `lib/weekly/issues/80.js:10`; month derived in `lib/weekly/build.js:74` (`monthOf`)
- Evidence (REPRODUCED): `_site/magazine/management-review-nr-41.html` shows "Online since 10 October 2026" and, on every page of the issue, "Management Review · No. 41 · November 2026"; JSON-LD `datePublished: 2026-10-10`. Archive month buttons: `data-month="2026-11">November 2026 (40)`, `2026-10 October 2026 (40)`. Today is 26 Oct 2026. All 81 issues have datePublished 8–11 Oct 2026 while the source calls the magazine "monthly" (`src/_data/weekly.js:1`).
- Steps: open nr-41; compare page footer date, "Online since" and JSON-LD.
- Expected vs actual: one coherent date per issue, not in the future / actual: three different date claims, one a month ahead.
- User impact: a reader (and a search engine) sees an issue "from November" in October and 40 "monthly" issues in one month — undermines credibility of a publication that stresses evidence; conflicting date signals. Confidence: high.
- Suggested correction: label issues by their real online date (or call the grouping "Series/Volume", not a month); never show a future month. Regression risk: low (display + filter grouping only; PDFs would need re-rendering).

### SEO-02 — Reflections are linked from only one same-language page each
- Severity: P2
- URL: all 99 `/…/reflections/<slug>/` pages, e.g. https://stivencatalyst.com/reflections/the-information-monopoly/
- Source: link graph (`graph.json`); layout `src/_includes/layouts/article.njk` (no prev/next/related for reflections)
- Evidence (REPRODUCED, `depth.py`): inbound linking pages for `reflections/the-information-monopoly/index.html` = `reflections.html` + the DE and SQ twins (via switcher). Same for all 99 (min = median = max = 1 same-language inlink). Compare insights median 18, MR issues 4, tools 26.
- Expected vs actual: series content cross-linked / actual: a single listing link per reflection; not on the home page.
- User impact: weak discovery path and weak internal importance signal for 99 URLs — the class most added recently (66 since 22 Oct); readers finishing one reflection get no next one. Confidence: high (measurement); effect on Google INFERRED.
- Suggested correction: prev/next + 2–3 related reflections at the end of each, and a "latest reflections" block on home/writing hub. Regression risk: low.

### SEO-03 — Tool pages are ~70% shared template text
- Severity: P3
- URL: 177 `/…/tools/<id>/` pages (e.g. `/tools/fishbone/`, `/tools/standard-work/`, `/tools/action-tracker/`)
- Evidence (REPRODUCED, `uniq.py`, `dup.py`): median 29% of 6-word shingles unique to a tool (median ≈ 590 unique words); fishbone ≈ 300; fishbone↔standard-work Jaccard 0.68–0.69 in all three languages. Shared parts: feedback form, export/import, team sync, family block.
- User impact: none for users; plausible (INFERRED, unverifiable) contributor to "crawled – currently not indexed" for some tool URLs. Confidence: medium.
- Suggested correction: do not noindex; if indexing of tools matters, add a short tool-specific "when to use / worked example" section above the shared chrome. Regression risk: low.

### SEO-04 — Every publication exists twice-to-four-times (HTML + 3 indexable PDFs) and was published in bulk
- Severity: P3
- URL: e.g. `/magazine/management-review-nr-37.html` + `/media/magazine/management-review-nr-37/management-review-nr-37-{en,de,sq}.pdf`
- Evidence (REPRODUCED): 312 PDFs, all 200 on live sample, no way to send `X-Robots-Tag`/`Link: rel=canonical` on GitHub Pages; 81 MR issues with datePublished 8–11 Oct 2026, 13 treatise volumes in two weeks.
- User impact: Google may cluster HTML and PDF and pick either; bulk publication of similar-format issues is a pattern Google may index slowly (INFERRED; Google's reasons NOT VERIFIED). Confidence: low-medium.
- Suggested correction: none mandatory; keep HTML as primary (it is the only one in the sitemap and linked as a page). Regression risk: n/a.

### SEO-05 — 543 sitemap URLs have no `<lastmod>`, including 288 dated Article pages
- Severity: P3
- URL: https://stivencatalyst.com/sitemap.xml (e.g. all `management-review-nr-*.html`, `operational-treatise-vol-*.html`, tools, hubs)
- Source: `src/sitemap.njk` (lastmod only `if item.data.date or "/content/" in item.inputPath`)
- Evidence (REPRODUCED): 219 URLs with lastmod, 543 without; the 288 magazine/treatise/floor pages have `dateModified` in JSON-LD from `src/_data/online.json` but no lastmod.
- Suggested correction: use `online[slug].modified` for publication pages. Regression risk: low.

### SEO-06 — No og:locale; English WebSite description on DE/SQ homes; Person `url` varies under one @id
- Severity: P3
- URL: all pages; `/de/`, `/sq/`
- Evidence (REPRODUCED): `og:locale` absent on 776/776; `/de/` JSON-LD WebSite description "Stiven Catalyst is an independent publication…" (English); `#author` url = `/de/about.html` on DE pages, `/about.html` on EN.
- Suggested correction: add `og:locale` (en_GB/de_DE/sq_AL) + `og:locale:alternate`; localise WebSite description; keep one canonical Person url. Regression risk: low.

### SEO-07 — Specialised schema missing for book, podcast, magazine
- Severity: P3
- URL: `/books/mall-per-durresin.html` (og:type=book but JSON-LD only Person/Organization), `/podcast.html` (no PodcastSeries), MR issues (Article, no `isPartOf` Periodical/PublicationIssue), no BreadcrumbList anywhere.
- Evidence (REPRODUCED): JSON-LD type census in §4.5. Opportunity, not an error. Regression risk: low.

### SEO-08 — 260 titles exceed 70 characters
- Severity: P3
- URL: e.g. `/de/tools/kanban-sizing/` (163 chars), `/sq/tools/shift-capacity/` (140)
- Evidence (REPRODUCED): 128/177 tool titles > 70. Will be truncated in results; not an indexing defect. Suggested: front-load the tool name, ≤ 65 chars. Regression risk: low.

### ARCH-01 — English-only 404 for German/Albanian paths
- Severity: P3
- URL: https://stivencatalyst.com/de/nonexistent-xyz (live 404, 15,985 bytes = the EN 404)
- Source: `src/404.njk` (single page; GitHub Pages serves one `/404.html`)
- Evidence (REPRODUCED live). User impact: a DE/SQ reader hitting a dead link gets English, no switcher. Suggested: trilingual 404 body or JS redirect to `/de/`/`/sq/` help. Regression risk: low.

### ARCH-02 — Thin hub pages
- Severity: P3
- URL: `/contact.html` (28 words), `/projects.html` (91), `/cv.html` (130), `/magazine/from-the-floor.html` (122), `/writing.html` (164) ×3 languages
- Evidence (REPRODUCED, main-text word counts). Mostly by design (hubs); listed because they are indexable and in the sitemap. Suggested: none required; optionally enrich the From-the-Floor and Writing hubs. Regression risk: none.

### ARCH-03 — 289 field notes per language have no addressable page
- Severity: P3 (OPINION/design choice)
- URL: `/field-notes.html` (10,841 words EN, one page) — notes reachable only as `#note-…` anchors
- Evidence (REPRODUCED). Notes cannot rank or be shared as their own URLs; the page is very long. Not a defect if intended; do not split without a reason.

(No P0/P1 defects found in this phase.)

---

## 6. Genuinely good (with evidence) — and what must NOT be changed
- **Zero broken internal links/resources/fragments across 776 pages, zero links via redirects** (`checks.py`). Keep the link-building conventions (`.html` for pages, trailing slash for folders).
- **Canonical = sitemap loc = og:url = internal link form on 762/762 pages**; http/www/slash redirects are clean 301s. Do not switch URL style (e.g. dropping `.html`) — it would create redirects for every link.
- **hreflang perfect**: 4-way, reciprocal, x-default, `sq` code, self = canonical; language switcher always lands on the equivalent page. Do not change.
- **Sitemap exactly equals the indexable set** (noindex pages excluded via the same `noindex` flag). Keep that coupling.
- **Intentional noindex** on search, shelf, Impressum, Datenschutz (+404/offline) — keep.
- **Full EN/DE/SQ parity** of all content classes (identical filenames, similar lengths).
- Shallow architecture (max depth 2); all PDFs linked with `download` (so prefetch never pulls 4–5 MB files).
- JSON-LD valid everywhere; Article dates come from git history (`scripts/online-dates.mjs`) rather than build time; feeds valid with correct enclosure lengths; AI-made podcast disclosed.
- Deploy fidelity: live is byte-identical to the 3cb88a2 build (since 23:50:33 GMT).

## 7. Scores

**SEO and discoverability: 81 / 100**
| Criterion | Weight | Score | Basis |
|---|---|---|---|
| Crawl/index eligibility (status codes, robots, canonicals, redirects, noindex hygiene) | 30 | 29 | §4.1, §4.4 — flawless except GitHub-Pages duplicate forms (harmless) |
| Language targeting (hreflang, lang, switcher, og:locale) | 15 | 13 | perfect hreflang; no og:locale; English WebSite text on DE/SQ |
| Sitemap, feeds, freshness | 15 | 13 | exact sitemap, valid feeds, fresh index; 543 URLs without lastmod |
| Structured data & metadata | 15 | 11 | valid Article/App; date contradiction SEO-01; no Book/Podcast/Periodical; long titles |
| Content signals & internal linking | 25 | 15 | reflections 1 inlink; templated tools; bulk-dated issues; PDF duplicates; thin hubs |

Technical eligibility ≈ 95/100; the deductions are almost entirely content/linking signals that may influence Google's *choice* — which is not knowable without GSC.

**Architecture and technical reliability — IA input: 86 / 100**
Criteria: link integrity (25/25), language parity & switcher (20/20), click depth/reachability (15/15), consistency of families/nav/footer (14/15: DMAIC counted as a tool on tools.html but not in families), internal linking of content classes (6/15: reflections), error/edge pages (6/10: English-only 404, thin hubs).
