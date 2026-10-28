# Phase 6 (book) and Phase 7 (podcast and narration): audit report

Auditor phase: `p6-p7-book-audio`. Clone: `audit-src` at 3cb88a2. Local server on port 8108.
Scripts and outputs are in `$AUDIT_WORK/p6-p7-book-audio/`:
`sbs.py` (side-by-side text), `pdfcmp.py`, `render/` and `sheet-*.png` (every PDF page at 50 dpi, SQ|EN|DE), `hi-*.png`,
`listen-audit.cjs` and `listen-out*.json`, `listen-controls.cjs` and `.out`, `split-scan.cjs`, `book-smoke.cjs`, `cover-*.png`.

## 1. Scope and method

**Phase 6, the book.** I read the whole text in all three editions, paragraph by paragraph and side by side: cover, title page, dedication, the note on the narrative, contents, prologue, chapters I–VII with their sections, epilogue, closing quote and back cover. That is 33 pages and 207 text blocks per edition. The source was `scripts/book/{sq,en,de}.txt`, printed together by `sbs.py`. These files are the text of the PDFs. I proved this by extracting each PDF with `pdftotext` and comparing word multisets with `pdfcmp.py`: no word of the source is missing from any PDF. `src/_data/books/*.json` is identical to the txt files (all 207/207 blocks found). The book has **no image captions**. The photographs carry none (`[image]` only), so captions could not be compared. Alt text on the page images is "Page N".

For the PDFs I ran `pdfinfo`, `pdffonts` and `pdfimages -list`, inspected each page's content stream for its fonts and body size (pypdf), and checked text extents with `pdftotext -bbox`. I rendered all 99 pages with `pdftoppm` and looked at them as contact sheets, plus a few pages at 110 dpi. For the web reader I ran a Playwright smoke test at 1280 px and 390 px (next page, contents → page 13, arrow key, saved page carried over to the DE edition, horizontal scroll, broken images) and `node --test tests/book-editions.test.cjs`.

**Phase 7, the podcast.** For all 6 MP3s I compared `ffprobe` metadata, a full decode (true duration), EBU R128 loudness and true peak, and the embedded cover art against `audio.json`. I parsed all 3 RSS feeds with Python ElementTree and checked each enclosure length against the real file, the pubDates as RFC 2822, the GUIDs, the images and the language. On the live site I sent HEAD requests to the 3 feeds, 3 pages, 6 MP3s, the cover, 3 book pages and 3 PDFs (19 requests), one Range request and one GET of `podcast.xml`, which I diffed against the local build.

**Phase 7, narration.** `src/js/listen.js` was run on built pages in real Chromium (Playwright), with `window.speechSynthesis` replaced by a recording stub. I tested the EN, DE and SQ versions of `/insights/pareto-and-5-why-in-practice/` and `/reflections/the-tyranny-of-the-small-man/` with three voice sets: all voices, no Albanian voice, and online-only voices. I tested Pause, Resume, "Start again" and speed under three cancel semantics: error "interrupted" async, error sync, and "end" event 5 ms later. I also extracted the real `sentences()` function and ran it over all 219 narrated pages (18,412 utterances).

**Not verified**
- Spoken content of the 6 episodes: no whisper or vosk is installed, and I installed no models. That covers factual claims, faithfulness to the issue, translation and pronunciation. **NOT VERIFIED**. I did not invent a transcription.
- That the "cut" corrections were really applied (24 s / 6 s): no pre-cut original exists in the repo. **NOT VERIFIED**.
- Real voices, pronunciation and real browser event order (Safari, Firefox, Edge): headless only, with a stub. **NOT VERIFIED**.
- Whether the snow photograph really shows Durrës, and photo rights: **NOT VERIFIED**.

## 2. Coverage table

| Item | Level |
|---|---|
| Full text SQ/EN/DE, every page and paragraph | Fully tested (read in full) |
| PDF text = source text (word-level, 3 editions) | Fully tested (REPRODUCED) |
| PDF fonts, embedding, diacritics, metadata, images, margins, body size | Fully tested |
| Page correspondence (text blocks, images per page) | Fully tested (block counts per page identical; images identical by page and dimension) |
| Visual check of every page | Fully tested at 50 dpi; SAMPLED at 110 dpi (pages 2, 23, 33) |
| Book web reader (book.js) | SAMPLED (smoke test, 2 viewports) |
| MP3 duration, size, tags, cover, loudness | Fully tested (6/6) |
| RSS validity, enclosure, GUID, dates, images | Fully tested (3/3 feeds) |
| Live audio, feed and PDF availability | Fully tested (HEAD) |
| Spoken content of the episodes | NOT VERIFIED |
| listen.js reading scope | SAMPLED (2 pages × 3 languages × 3 voice sets); the scope defect generalises by template (219/219 pages) |
| listen.js controls | REPRODUCED with a stub |
| listen.js sentence splitting | Fully tested (all 219 pages) |
| Real voice output | NOT VERIFIED |

## 3. Defect register (most severe first)

No P0 or P1 found.

### P7-01 — Narration reads past the essay into the feedback form, the privacy line and the "Join in" box, on every narrated page
- Severity: P2
- URL: e.g. /insights/pareto-and-5-why-in-practice/, /de/…, /sq/…, /reflections/the-tyranny-of-the-small-man/
- Source: src/js/listen.js:28 (`SKIP` list) and :35; src/_includes/layouts/article.njk:277–282 (feedback partial and `aside.essay-join` inside `[data-article]`)
- Evidence (REPRODUCED, `listen-audit.cjs`, `listen-out2.json`): the last 7 utterances on the EN essay are "Did you try it?", "If you took something from this essay into your shift, tell me what happened.", "The answers that help others are published under the essay, anonymised.", "Nothing is sent from this page.", "The button opens your email program with the message, and you send it from there.", "Privacy policy." and "Join in". The same happens in DE ("Haben Sie es ausprobiert?" … "Datenschutzerklärung." "Mitreden") and SQ ("A e provove?" … "Politika e privatësisë." "Merr pjesë"). Template: `essay-feedback-form` and `essay-join` sit inside the article on 219/219 narrated pages.
- Expected vs actual: reading should stop at the last paragraph of the essay. Instead it reads UI text and form notes, then ends on a dangling kicker.
- User impact: the listener hears form boilerplate, and "Read to the end" is announced after "Join in". Looks unfinished.
- Confidence: high
- Suggested correction: add `.essay-feedback, .essay-join, form` to `SKIP`.
- Regression risk: very low.

### P7-02 — Case box: its heading is read aloud, its content (including "What cannot be confirmed") is silently skipped
- Severity: P2
- URL: /insights/pareto-and-5-why-in-practice/ (EN, DE, SQ); 9 narrated pages have `section.essay-case`
- Source: src/js/listen.js:35 (selector `h2, h3, p, li, blockquote`; the case uses `dl/dt/dd`); article.njk:142–144
- Evidence (REPRODUCED): utterances 52–53 are "The case on record" and "August 2025, last mile", then the voice jumps to the feedback form. Not read: the 5 `dt`/`dd` pairs ("The problem", "What I knew", "What I did", "What happened", "What cannot be confirmed: The original Pareto distribution, verified before-and-after results … ").
- Expected vs actual: either read the box completely, or leave it out (heading included). Actual: half of it.
- User impact: a listener misses the essay's own evidence limits. These are the honesty statements the site relies on for credibility.
- Confidence: high
- Suggested correction: add `dt, dd` to the selector (read the box), or put `.essay-case` in SKIP. Reading is preferable.
- Regression risk: low.

### P7-03 — Privacy note says "a voice of your own browser … sends nothing" without saying that online voices send the text to Google or Microsoft; the no-voice message recommends Edge, whose Albanian voices are cloud voices
- Severity: P2 (privacy disclosure accuracy)
- URL: every narrated page, 3 languages
- Source: article.njk:85 and :98; de/ui.json, sq/ui.json; listen.js:185–189 (prefers `localService`, but silently uses an online voice when no local one exists)
- Evidence: REPRODUCED: with voices `[en local, "Google Deutsch" localService:false, "Microsoft Anila Online (Natural) – sq-AL" localService:false]`, DE and SQ pages pick the online voice. The note still reads "Read aloud by a voice of your own browser. This site records and sends nothing." / "Vorgelesen von einer Stimme Ihres eigenen Browsers. Diese Seite zeichnet nichts auf und sendet nichts." / "Lexohet nga një zë i shfletuesit tënd. Kjo faqe nuk regjistron dhe nuk dërgon asgjë." INFERRED (not tested here): Chrome's "Google …" voices and Edge's "… Online (Natural)" voices are synthesised on vendor servers. For Albanian, Edge's voices are online ones.
- Expected vs actual: "This site sends nothing" is literally true. But "a voice of your own browser" implies local processing, and when the chosen voice has `localService === false` the text leaves the device. The no-voice note ("Another browser, such as Microsoft Edge, may have one") steers Albanian readers to exactly that case.
- User impact: a misleading privacy impression; low harm, because the essays are public text.
- Confidence: medium (vendor behaviour inferred)
- Suggested correction: when `voice.localService === false`, add one sentence to the note: "This voice is an online voice of your browser's maker; your browser sends the text to it." The same in DE and SQ. Optionally name the voice.
- Regression risk: very low.

### P6-01 — Back-cover blurb: EN resolves the key "city within the person" line the other way from DE
- Severity: P2 (back cover, most-read text; touches the book's central metaphor)
- URL: /books/mall-per-durresin.html; PDF page 33 of each edition
- Source: scripts/book/{sq,en,de}.txt line 451; src/_data/books/*.json `blurb[1]`
- Evidence (SOURCE, rendered and checked in `hi-de-33.png`):
  - SQ: "Mall për Durrësin ndjek rininë, miqësitë, ikjet dhe kthimet e një njeriu në qytetin që e rriti. Jo për ta gjetur të paprekur, por për të njohur çfarë ka mbetur **brenda tij**."
  - EN: "… in the city that raised him. Not to find it untouched, but to recognise what remains **within it**."
  - DE: "… eines Menschen in seiner Heimatstadt. Nicht um sie unberührt zu finden, sondern um zu sehen, was **in ihm** blieb."
  - "tij" is ambiguous in Albanian: it can mean the man or the city (both masculine). DE reads it as the person ("ihm" ≠ "sie" for the Stadt), which keeps the inversion of section 32, "Qyteti brenda nesh / The City within Us / Die Stadt in uns". EN reads it as the city ("it" = the city of the previous sentence), the conventional direction. The two translations now say opposite things. The site lede (ui.json:673) also reads it as the city in all three languages: "what of it is still there / was von ihr geblieben ist / çfarë ka mbetur prej tij".
- Expected vs actual: one reading, chosen by the author, in all editions.
- User impact: an EN reader's first summary of the book contradicts its epilogue section title.
- Confidence: high that EN and DE diverge; the author's intent is unknown.
- Suggested correction: the author decides. If the inversion is meant (likely, given section 32 and 31.5 "I kam sjellë me vete"), change EN to "what remains within him". If the city reading is meant, change DE to "was von ihr blieb". Leave everything else as it is.
- Regression risk: none (one line; page 33 has room).

### P7-04 — Albanian episode of No. 1 carries no correction, although EN (4 cuts) and DE (3 cuts) of the same issue needed them; nothing says the SQ recording was checked
- Severity: P2 (credibility of the correction process)
- URL: /sq/podcast.html, /sq/podcast.xml, /sq/magazine/management-review-nr-01.html
- Source: src/_data/audio.json (`management-review-nr-01.sq` has no `corrections`); src/how-this-is-made.njk:56/87/118
- Evidence (SOURCE and INFERRED): the same NotebookLM process on the same issue produced 4 unsupported claims in EN and 3 in DE ("fired", "10,000 data points explain 2002", "19→20%"). SQ is the longest recording (23:42) and has no entry. Git history is shallow (50 commits), so I cannot tell whether SQ was reviewed. I could not transcribe it.
- Expected vs actual: either a correction, or a dated note that the SQ recording was checked and found clean.
- User impact: Albanian listeners may hear the same errors the site removed for EN and DE listeners.
- Confidence: medium (absence of evidence)
- Suggested correction: review the SQ (and No. 2 EN/SQ) recordings against the issue with a transcript, then record the result either way.
- Regression risk: none.

### P7-05 — "Start again" is the only stop; resume and speed change can skip a sentence on browsers that report a cancelled utterance as "end"
- Severity: P3
- Source: listen.js:144–149 (`stopping` reset after `setTimeout 0`), :133, :168–176, :180
- Evidence: REPRODUCED with the stub. With Chrome-like semantics (error "interrupted"), Pause, Resume, speed and Start again behave correctly: the same sentence resumes, the rate 1.4 applies from the current sentence, the speed is kept in `localStorage`, and Start again while paused resets to "Listen". INFERRED risk: if a browser delivers `end` for the cancelled utterance more than one macrotask later (stub mode `async-end`), a speed change jumps one sentence and queues two utterances (n 5→7), and "Start again" starts at paragraph 2 instead of the title. Whether Safari or Firefox do this is NOT VERIFIED.
- Suggested correction: give each utterance a generation id and ignore events from older generations, instead of the time-based `stopping` flag.
- Regression risk: low.

### P7-06 — Podcast loudness below the stated target; one file's true peak is above 0 dBFS
- Severity: P3
- Source: scripts/audio.mjs:7–8 (claims −16 LUFS)
- Evidence (REPRODUCED, `ffmpeg -af ebur128=peak=true`): integrated loudness is −16.9 to −18.1 LUFS (nr-01-de −18.0, nr-02-de −18.1). True peak of nr-01-de is +0.6 dBTP (the script limits sample peak, not true peak).
- User impact: slightly quieter than other podcasts; possible inter-sample clipping on some decoders.
- Suggested correction: re-run with the loudnorm second pass measured on the final cut, and a true-peak limiter (`alimiter` on 4× oversampling, or `loudnorm` TP checked after encoding).

### P7-07 — Re-encoding a recording silently deletes its corrections
- Severity: P3
- Source: scripts/audio.mjs:83–85 (the comment says so: "Its corrections do not [stay]")
- Impact: a later re-encode would erase the public record of what was cut, from the page, the feed and how-this-is-made.
- Suggested correction: keep the old corrections, or require a flag to drop them.

### P7-08 — Three feeds share one channel title; lastBuildDate does not move when an episode's notes change
- Severity: P3
- Evidence (REPRODUCED): `<title>Management Review · Stiven Catalyst</title>` in /podcast.xml, /de/podcast.xml and /sq/podcast.xml. lastBuildDate = newest pubDate (13 Oct), although the corrections were added on 14 Oct.
- Suggested correction: suffix the language ("· Deutsch" / "· Shqip"), and set lastBuildDate to the date of the latest change.

### P7-09 — Live MP3s are served as `audio/mp3` (feed says `audio/mpeg`)
- Severity: P3 (GitHub Pages decides it; podcast apps tolerate it). REPRODUCED by HEAD request. Note only.

### P6-02 — DE: Skanderbeg school reads as a person ("bei Gjergj Kastrioti Skënderbeu"); EN/DE readers are not told it is a school
- Severity: P3 (cultural context)
- Source: de.txt and en.txt page 13 (13.2); chapter III title
- Evidence (OPINION): SQ "Viti i parë te Gjergj Kastrioti Skënderbeu" works for Albanians, where "te" + school name is normal. EN "My first year at Gjergj Kastrioti Skënderbeu" is opaque but readable. In German, "bei" + a person's name means "at X's place", so the national hero becomes a host.
- Suggested correction: first mention only, DE "an der Gjergj-Kastrioti-Skënderbeu-Schule" and EN "at the Gjergj Kastrioti Skënderbeu school". Page 13 has room (body ends at y≈467 EN and 495 DE, versus ≈536 on full pages). Keep the chapter title.

### P6-03 — Small nuance shifts in DE (no loss of meaning; listed for completeness, no rewrite needed)
- Severity: P3 (OPINION)
- 20.1 chapter V: SQ "Qyteti që **ndërtohej** mbi kujtesën tonë" (was being built, ongoing). EN "The City Being Built over Our Memory" keeps the aspect. DE "Die Stadt, **gebaut** über unserer Erinnerung" makes it finished. Optional: "Die Stadt, die über unserer Erinnerung gebaut wurde".
- 05.5: SQ "një fjali e vjetër mjafton **për të më ulur** sërish në një tavolinë" (the sentence seats me). EN "is enough to sit me down again" keeps it. DE "genügt ein alter Satz, und ich sitze wieder …" drops the sentence's agency. Acceptable.
- 21.5: SQ "Në fund na mbetet të ecim përpara" is neutral. DE "Am Ende bleibt uns **nur**, weiterzugehen" adds resignation. EN "we are left to walk on" is neutral.
- 16.5: SQ "Më shumë se si ishte një mur" (more than how a wall looked). DE "Eher als an eine Wand" is slightly flattened.

### P6-04 — EN/DE PDFs lack the original's /Lang and bookmark; all three are untagged; an unembedded Helvetica is referenced
- Severity: P3
- Evidence (REPRODUCED, pypdf/pdffonts): the original has `/Lang sq-AL` and an outline. EN/DE have no `/Lang` and 0 outline entries. All three are `Tagged: no`. EN/DE list `Helvetica Type 1 emb no`. It is only ReportLab's canvas initialisation (`BT /F1 12 Tf 14.4 TL ET`, no glyphs drawn), so nothing renders in Helvetica, but strict print or PDF/A preflight will flag it.
- Suggested correction: in book-edition.py, set `canvas.setFont` to Noto before the first page (or `initialFontName`), set the catalog `/Lang`, and add chapter bookmarks.

### P6-05 — The translations' making is not credited in the book; the site's AI disclosure describes the wrong direction for the book
- Severity: P3
- Evidence: the edition lines read only "Translated from the Albanian / Aus dem Albanischen", with no translator. how-this-is-made says Claude helps with "the German and Albanian versions", which implies English originals. The book is Albanian → English/German. INFERRED that the EN/DE book texts were produced in Claude sessions, from the repo's commit attribution.
- Suggested correction: one line in the book page's facts or edition line: "Translated with AI assistance, revised by the author" (if true).

### P6-06 — Photograph quality
- Severity: P3 (OPINION)
- Evidence: page 23 (snow) is visibly soft and over-processed (`hi-en-23.png`), although stored at 1536×783 (336 ppi effective). Page 6 is 189 ppi and page 33 is 198 ppi: fine for screen, below 300 ppi if the A5 is ever printed. The note on page 2 honestly says the photos do not document the scene.

## 4. What is genuinely good (with evidence), and what must not be changed

**Translation (OPINION, after a full side-by-side reading).** Neither translation has genuinely lost meaning in the body text. I found no omission, addition or distortion of content in 207 blocks × 2. The only real divergence is P6-01 on the back cover. Both translations keep the book's restraint: short declaratives, no added emotion, no explanatory padding. Examples of fine solutions:
- 08.5: SQ "Monumentet i mbajnë hartat; njeriun e mbajnë detajet." EN "Maps hold the monuments; details hold the person." DE "Karten bewahren die Denkmäler; den Menschen bewahren die Details." The chiasmus is kept in both.
- 07.3: SQ "pritja nuk quhej më pritje". EN "waiting was no longer called waiting". DE "das Warten hieß nicht mehr Warten".
- 15.7: SQ "Mund të niseshe për një shtet në fillim të rrugës dhe të vendosje të qëndroje në fund të saj." EN "You could leave for one country at the start of the street and decide to stay by its end." DE "Man konnte am Anfang der Straße in ein Land aufbrechen und am Ende beschließen zu bleiben."
- Dialogue registers are idiomatic: "E di, mor." → "I know, man." / "Weiß ich doch, Mann."; "Ma prishe qejfin që tani." → "You've spoiled it already." / "Du verdirbst mir jetzt schon die Laune."
- Titles: "Mall" → "Longing" / "Sehnsucht" is the right word in each language. The DE subtitle "Eine Stadt, eine Jugend, ein Meer, das bleibt" is exact.

**The "city within the person" inversion, line by line:**
- 32.1 section title: "Qyteti brenda nesh" / "The City within Us" / "Die Stadt in uns". Kept.
- 05.2: "Tjetri më ecën përkrah pa u dukur" / "The other walks beside me unseen" / "Die andere geht unsichtbar neben mir her". Kept.
- 31.5: "I kam sjellë me vete në mënyrën si ndalem." / "I have brought them with me in the way I stop." / "Ich habe sie mitgebracht, in der Art, wie ich stehen bleibe." Kept.
- 32.7 and 33 quote: "Është qyteti ku rinia ime vazhdon të ecë pa mua." / "It is the city where my youth walks on without me." / "… in der meine Jugend ohne mich weitergeht." Kept. In DE, "weitergehen" carries both "walk on" and "go on".
- 29.6: "Ajo që kam këtu nuk është e gjitha e dukshme." / "What I have here isn't all visible." / "Nicht alles, was ich hier habe, ist sichtbar." Kept.
- The only weak point is the back-cover blurb in EN (P6-01).

**Consistency.** "Durrës" is spelled with ë everywhere, in the text, the running heads, the PDFs and the JSON (0 occurrences of "Durres" in the text). "Hen1" and "Gjergj Kastrioti Skënderbeu" are spelled the same in all editions. Quotation conventions are correct per language: “…” in SQ and EN, „…“ in DE.

**Layout correspondence.** Page N holds the same passage in all three editions: block counts per page are identical on all 33 pages. The same 10 photographs sit on the same pages at the same pixel sizes. Margins are identical (text x 41–379 of 419.5 pt), with no clipping or overflow. The DE edition is set at 10.55 pt on most pages (10.8 in SQ and EN), the documented fallback; the difference is not visible. Fonts are embedded subsets (Noto); ë/ç/ä/ö/ü/ß/„“ are all extractable with 0 replacement characters.

**Reader.** Page navigation, contents and the arrow key work, and the reading position carries across languages ("Weiterlesen ab Seite 14"). There is no horizontal scroll at 390 px. A "Read as text" version exists. The book tests pass (4/4).

**Podcast.** The metadata is exact: `seconds` and `bytes` match the real files (decoded durations 1213.0/1226.0/1422.5/1064.7/819.3/1574.8 s). The RSS is well-formed, every enclosure length equals the file size (live too), GUIDs are stable (`stivencatalyst-<slug>-<lang>`), and pubDates are valid RFC 2822. The 3000×3000 cover exists, and the episode images exist. Each MP3's embedded cover is the right issue in the right language. The language tag is set and ID3 tags are correct. AI is disclosed in three places: under every player, in every feed item, and on how-this-is-made ("the two voices are AI voices"). Corrections are dated, specific, shown under the player and in the feed. Live: everything returns 200, and Range returns 206. **Do not change** the corrections mechanism or the explicit AI disclosure.

**Narration.** Reading starts at the title, then the deck, then the first paragraph (never navigation). Notes, sources, toolboxes, checklists and the "Tomorrow on shift" box are correctly skipped. Chunking is sound: the longest utterance is 260 characters, and across 18,412 utterances there are no abbreviation splits (only "1." "2." in /reflections/five-questions, and real one-word sentences). Without a voice for the language, the button is disabled and an honest message is shown in all three languages. Speed is remembered. **Do not change** the sentence-level pause/resume design.

## 5. Proposed scores

**Book, part of "Books, magazines and publication credibility": 86/100.**
- Criteria and weights: translation faithfulness and literary quality (40) → 37; consistency of names and places (10) → 10; page and layout correspondence (15) → 15; PDF technical quality: font embedding, extractability, accessibility and metadata (20) → 15 (untagged, missing /Lang and outline in EN/DE, phantom Helvetica, two images under 200 ppi); transparency about authorship, translation and photos (15) → 9 (photo note good; translator and AI assistance not stated in the book; site disclosure states the wrong direction).
- Deductions for P6-01 and P6-02 are within the translation line.

**"Podcast and narration": 66/100.** Podcast 72 and narration 60, weighted equally.
- Podcast: technical feed and file correctness (35) → 34; disclosure and corrections (25) → 19 (SQ asymmetry P7-04; corrections erased on re-encode P7-07); verifiability of spoken content (20) → 8 (no transcripts published, no evidence of an SQ check); audio quality (10) → 7 (loudness and true peak); breadth (10) → 4 (2 of ~80 issues have episodes).
- Narration: correct reading scope (35) → 18 (P7-01 on 219/219 pages; P7-02); controls and robustness (25) → 20 (P7-05 risk); voice fallback (15) → 14; privacy explanation accuracy (15) → 6 (P7-03); chunking (10) → 10.
