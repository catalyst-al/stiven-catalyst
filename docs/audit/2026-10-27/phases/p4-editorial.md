# Phase 4: Editorial quality of the essays, reflections, field notes and projects (EN / DE / SQ)

Auditor: p4-editorial · Source: `$SRC` at 3cb88a2 (read-only) · Work files: `.../scratchpad/work/p4-editorial/`
(scripts in `scripts/`, outputs in `out/`, side-by-side trilingual texts in `tri/`, full git history in `hist/`, cloned blobless from GitHub because the audit clone and production checkout are both shallow (50 commits)).

---

## 1. Scope and method

**Corpus (counted, REPRODUCED by `scripts/corpus.py`):** 40 insights, 33 reflections, 289 field notes and 3 projects per language. The brief said 41/34/290/4; each folder also holds one `*.11tydata.js` data file, which is not a text. So the corpus is 1,095 texts. Body word counts: EN insights 37.9k, reflections 24.8k. Notes are one front-matter `quote:` each, 7–37 words. Projects are front-matter cards only (title, tag, one-sentence summary).

**Provenance (REPRODUCED from full history in `work/p4-editorial/hist`, `git log --diff-filter=A`; table in `work/p4-editorial/creation.txt`):**
- **Insights:** in 22 of 40 essays the Albanian file came first, 2–25 minutes before EN and DE, which were committed together. Commits 1e45f6f (16 Oct) and 7d7ecdc (17 Oct) then rewrote all 40 essays in all three languages "as native prose", including the removal of "not X, it is Y" turns. The essays as published are therefore an AI-edited text in all three languages, not an author original with translations.
- **Reflections:** every commit message from #334 on says "The Albanian original, unchanged, its English and German versions". The SQ reflections are the author's text (OPINION, based on the commit messages: I cannot verify authorship beyond what they say). EN and DE are translations. Fourteen reflections were committed on 26–27 Oct between 19:54 and 00:32, and 31 of 33 between 20 and 27 Oct.
- **Disclosure:** `_site/how-this-is-made.html` says "the German and Albanian versions" are made with Claude. For reflections, the direction is the reverse: Albanian is the original. This is a small disclosure inaccuracy, P4-15.

**Full-text reading:** every paragraph in all three languages, aligned paragraph by paragraph (`scripts/tri.py`, outputs in `tri/`), with sentence-level comparison for fidelity.
- **Insights, 12 × 3:**
  - oldest: *Starting from zero* (also a home-page pick)
  - home-page picks: *Pareto and 5 Why in practice*, *The tools you build yourself*
  - documented cases: *How we worked with damage*, *How I built Front Desk Control*, *The night the system went down*
  - newest: *The report a machine wrote*, *When the dashboard turns red before you*
  - mid-period: *Leading people without losing the person*, *The angry guest at 2am*, *Teams with many languages*, *61 resellers*
- **Reflections, 12 × 3:**
  - oldest: *Ghost in a room of mirrors*, *The great Albanian paradox*
  - *Architects of smoke*, *Five questions*, *Authority, killed*, *Haggling over a year of life*, *The blood trap*, *The perfect alibi*, *The poison paradox*, *Cut off from the ground*
  - newest three: *Divide and rule in the corridors*, *The blame culture*, *The information monopoly*
- **Field notes:** a random sample of 40 (Python `random.seed(42)`, list in `out/notes_sample.json`), read in all three languages.
- **Projects:** all 3 × 3, plus the rendered `_site/projects.html`.

**Corpus-wide automated scans (REPRODUCED; scripts `scan.py`, `ngrams.py`, `notes.py` plus inline scripts):**
- sentence-length distribution
- one-sentence paragraphs
- closing formulas
- rhetorical patterns, matched with regular expressions per language
- caveat density
- cross-document 5-gram and 8-gram overlap
- du/Sie and ju/ti register
- glossary compliance against `docs/FJALORI.md`
- quotation marks, title capitalisation, number and date formats

The regex counts are approximations: they undercount paraphrased templates and may overcount a few literal matches. Treat them as orders of magnitude.

**Not verified:**
- No automated grammar checker was run (LanguageTool is not available offline). The grammar findings below come from reading, so a full grammar sweep of the unread 28 insights and 21 reflections is **NOT VERIFIED**.
- Three external facts are flagged **NOT VERIFIED**: Albanian annual-leave law, Tirana bus fare, and Albanian CPI.
- The rendered HTML was checked only for the projects page and the disclosure page.

---

## 2. Coverage table

| Item | Status |
|---|---|
| 12 insights × 3 languages, complete text, paragraph-aligned fidelity check | **Fully read** (SAMPLED: 12 of 40) |
| 12 reflections × 3 languages, complete text, fidelity check | **Fully read** (SAMPLED: 12 of 33) |
| 40 field notes × 3 languages | **Fully read** (SAMPLED: 40 of 289, seeded random) |
| 3 projects × 3 languages and the rendered page | **Fully read** (exhaustive) |
| Pattern, n-gram, register, glossary and quote scans across all 1,095 texts | **Fully tested** (automated; regex precision limits stated) |
| Creation order per language for all 76 essays, reflections and projects | **Fully tested** (git, full history) |
| Remaining 28 insights and 21 reflections | **Scan-covered only**, not read in full |
| Grammar in unread texts | **NOT VERIFIED** |
| External facts (labour law, prices, CPI) | **NOT VERIFIED** (flagged INFERRED where used) |

---

## 3. Key measurements (REPRODUCED, `out/agg.json`, `out/ngrams.txt`)

### 3.1 Sentence rhythm (insight and reflection bodies)

| | Sentences | Mean words | Median | SD | CV | ≤6 words | ≥30 words | 1-sentence paragraphs | Ends on a 1-sentence paragraph |
|---|---|---|---|---|---|---|---|---|---|
| EN insights | 2418 | 15.6 | 14 | 9.2 | 0.59 | 14.1% | 7.7% | 26.0% | 20% |
| DE insights | 2428 | 14.9 | 13 | 8.8 | 0.59 | 16.5% | 5.8% | 25.5% | 20% |
| SQ insights | 2417 | 15.0 | 13 | 9.1 | 0.61 | 16.8% | 7.0% | 25.8% | 20% |
| EN reflections | 1257 | 19.7 | 18 | 11.6 | 0.59 | 9.9% | 19.5% | 26.9% | 36.4% |
| DE reflections | 1258 | 18.7 | 17 | 10.9 | 0.58 | 11.5% | 15.9% | 26.9% | 36.4% |
| SQ reflections | 1257 | 19.6 | 17 | 11.7 | 0.60 | 10.5% | 17.7% | 26.9% | 36.4% |

What this shows:
- **Rhythm is healthy.** Variation is healthy (CV around 0.6). There are no em dashes at all: 0 per 1k words in every language.
- **The three languages are structurally identical.** Sentence and paragraph counts match almost exactly (2418/2428/2417; 937 paragraphs each). The versions are paragraph-for-paragraph mirrors: no language has been allowed its own paragraphing.
- **About a quarter of all paragraphs are one sentence long.** That is high for essay prose and gives a "LinkedIn cadence".
- **Field notes:** mean 19.7 words in EN. 156 of 289 are exactly two sentences, and 56% contain a negation.

### 3.2 Rhetorical templates

Format: count (rate per 1k words; documents containing it / total).

| Pattern | EN insights | EN reflections | SQ reflections (original) | DE reflections |
|---|---|---|---|---|
| "X is not A. It is B." | 28 (0.74/1k; 22/40) | 34 (1.37; 21/33) | 29 (1.18; 19/33) | 10 |
| "not A, but B" / "nuk…, por" / "nicht…, sondern" | 13 (9/40) | 43 (24/33) | 42 (24/33) | 46 (24/33) |
| "Let me be clear / Më lejoni / Lassen Sie mich" | 0 | **25 (25/33)** | **25 (25/33)** | **25 (25/33)** |
| …followed directly by a **bold** thesis | — | 21 of 25 | 21 of 25 | 21 of 25 |
| "Because…" / "Sepse…" sentence opener | 3 | 33 (23/33) | 33 (23/33) | 30 |
| "True/Real leadership" / "Udhëheqja/Lidershipi i vërtetë" | 0 | 14 (11/33) | 16 (14/33) | 17 (14/33) |
| "at the end of the day" / "në fund të ditës" | 1 | 8 (8/33) | 8 (8/33) | 8 |
| Field notes "is not X. It is Y." | 45/289 (15.6%) | | 31/289 | 21/289 |

**Cross-document repetition (5-grams found in at least 3 documents):**
- Reflections: SQ 24, EN 25, DE 23.
- The top items are all the thesis formula: "më lejoni ta them këtë me të gjithë qartësinë që meriton/kërkon e vërteta" appears near-verbatim in 4 reflections, plus 10 further variants of "Më lejoni…".
- Insights: EN 86, mostly harmless shared terminology ("Front Office and Night Audit", "Damage, Incomplete, Delay and Loading Time") and cross-link titles.

**Structural template in insights (EN, 40 essays):**
- by design in all 40: a deck naming the series, a "Three moves" block (`firstMove`) and a checklist card
- 17 have a "What I would do differently today" section
- 18 have a 5-item bold numbered list
- 18 have a "Five/Four/Three …" heading
- 16 point to "the card/sheet below"
- 17 link to a tool in the body

The essays read as one well-made series. They also read as one template.

**Field notes reuse (REPRODUCED, `out/ngrams.txt`):** 152 of 289 EN notes (53%) appear word-for-word inside an essay or reflection. Over half the "field notes" are excerpts, not independent observations. Only 77 SQ and 83 DE notes match their essays verbatim. In SQ and DE, the same sentence is often worded differently in the note and in the essay it quotes (example in P4-12, note 191). That is a terminology and consistency gap that does not exist in EN.

### 3.3 Caveats and hedging (EN insights)

- 55 caveat phrases in 37.9k words (1.45 per 1k); 26 of 40 essays have at least one, only 3 have four or more.
- The pass of 16–17 October has largely removed the earlier "what I have and what I do not" boilerplate.
- What remains is concentrated:

| Essay | Caveat phrases | Per 1k words | Notes |
|---|---|---|---|
| *The night the system went down* | 6 | 5.8 | plus two correction notes |
| *How we worked with damage* | 5 | 5.4 | mostly necessary |
| *When improvement fades* | 4 | 4.7 | the one in L55 is good |
| *DMAIC without a black belt* | 3 | 4.2 | undermining |

Necessary and unnecessary qualifications are distinguished in P4-14.

### 3.4 Register and glossary (REPRODUCED)

- **DE reflections, narrator's du/Sie** (quoted speech excluded): 23 of 33 mix both, 4 use du only, 5 use Sie only. `docs/FJALORI.md` requires "Sie"; "du" is allowed only in quotations and the motto. DE insights comply: 29 use Sie only, and the only du uses are self-address or quoted speech.
- **SQ reflections, ju/ti:** 25 of 33 mix the polite plural ("Më lejoni", "Shikoni", "Përfytyroni") with generic "ti". FJALORI: "lexuesit i drejtohemi me 'ti'".
- **SQ terms:**
  - "lidership*" 9× in 8 reflections against "udhëheqj*" 10× in 7: two words for the same thing
  - calque "procedurë standarde (e) operimi(t)" 5× in 4 reflections
  - "eskalimi" 3× in the summary and description of *Kur ta zgjidhësh vetë…* (FJALORI says no "eskaloj")
  - untranslated "fishbone" in a note
- **DE terms:** "Fläche" 8× in 4 reflections, meaning "the work floor/the front line". FJALORI restricts "Fläche" to the surface of a shop or warehouse.
- **Title capitals after the colon:**
  - SQ reflections 20/20 capitalised ("Gracka e gjakut: Kur firma…"); SQ insights 0/9. Albanian orthography uses lower case after a colon.
  - DE reflections 20/20 capitalised, DE insights 4/9.
  - EN is consistently sentence case.
- **Quotation marks:**
  - EN and SQ insights use curly “…”; EN and SQ reflection bodies use straight "…" (EN reflections: 112 straight double quotes in bodies, 0 curly).
  - DE uses „…“ correctly in both sections.
  - Stray mixed „…” in `src/content/sq/reflections/2026-10-20-architects-of-smoke.md:30`.
  - EN note `2026-10-04-13-reported` uses single ‘…’.
- **Numbers and dates are locale-correct:** EN "1.06%", DE "1,06 %", SQ "1,06%"; "15 October 2026 / 15. Oktober 2026 / 15 tetor 2026". Minor: SQ "1 janari 2026" sits alongside "15 tetor 2026".

---

## 4. Defect register (most severe first)

### P4-01: German reflections switch between "Sie" and "du" inside the same text
- **Severity:** P1 (credibility and readability for the German audience the site is courting; breaks the site's own glossary)
- **URL:** /de/reflections/* (23 of 33). **Source:** e.g. `src/content/de/reflections/2026-10-26-the-blame-culture.md:16`
- **Evidence (REPRODUCED, scan; OPINION on effect):** In one paragraph: „Lassen Sie mich das mit aller Klarheit sagen, die die Wahrheit verlangt. **… hast du nichts behoben; du hast nur dafür gesorgt …**“
  - `divide-and-rule…:12` „Dort sehen Sie …“ vs `:46` „Wenn du heute an einem Ort arbeitest … lass dich nicht …“
  - `five-questions` du 15× vs Sie 1×
  - `the-information-monopoly:34` makes its bold thesis a du-sentence: „Dein wahrer Wert bemisst sich nicht daran …“
- **Cause (INFERRED):** the Albanian original mixes the formula "Më lejoni" (ju) with generic "ti". The translation maps generic "ti" to "du", but German would use "man" or a consistent "Sie".
- **Expected vs actual:** expected Sie (or impersonal "man") throughout; actual is mixed in 23 texts.
- **User impact:** to a German reader the voice lurches between formal address and a pub-table tone. In professional prose this reads as careless.
- **Confidence:** high.
- **Suggested correction:** keep "Lassen Sie mich …" or drop it (see P4-03), and render generic "ti" as "man" or "Sie". Example: „Wenn persönliche Strafe die Ursachenanalyse ersetzt, ist nichts behoben; es ist nur sichergestellt, dass derselbe Fehler morgen wiederkommt.“
- **Regression risk:** low (text only).

### P4-02: The author's career timeline contradicts itself across essays and correction notes
- **Severity:** P1 (credibility of a professional-identity site; the facts are first-person biography)
- **Source:**
  - `src/content/insights/2026-10-13-the-tools-you-build-yourself.md:44-45` (correction) vs `:50` and `:52` (body)
  - `…/2026-10-13-the-night-the-system-went-down.md:42-45`
  - `…/2026-10-13-when-a-new-system-arrives.md:45-48`
  - `…/2026-10-01-starting-from-zero.md:46`
  - `…/2026-10-05-the-first-30-days.md:43`
- **Evidence (SOURCE):**
  - *The tools you build yourself* carries only the 15 Oct correction: "An earlier version dated the first weeks at the hotel to September 2026. I have been the hotel's Night Manager since November 2025, so the date is removed." Its body still says "which I developed in September 2026" and "drawn from my first weeks at the hotel".
  - Two sister essays carry a second note (17 Oct): "The correction of 15 October was itself inexact … another hotel in Frankfurt, in September 2026". That note was never applied to *The tools you build yourself*, in any language.
  - *Starting from zero*, a home-page pick, ends the career at "June 2025 … Area Manager". Night Manager since November 2025 appears only inside correction notes. The part-time remote dispatcher role since January 2026 appears in two other essays.
  - The same system-outage night is told as fact in *The first 30 days* ("On my first night at the new hotel, I could not work…") and again in *The night the system went down*, which calls itself "the only scene in this series that is not a picture".
- **Expected vs actual:** expected one coherent, dated career line; actual is a reader who meets a correction of a correction, and a third essay where the retracted wording stays.
- **User impact:** an employer or reader checking the CV-type facts finds contradictions in exactly the place where the site asks to be trusted.
- **Confidence:** high.
- **Suggested correction:**
  1. Apply the 17 Oct wording to *The tools you build yourself* in EN, DE and SQ, and replace its 15 Oct note.
  2. Add one dated sentence on the 2025–2026 roles to *Starting from zero*, or link a single "career timeline" source of truth.
  3. Let *The night the system went down* acknowledge that *The first 30 days* told the same night.
- **Regression risk:** low.

### P4-03: The reflections run on one rhetorical template, in all three languages
- **Severity:** P2 (literary quality; reads as mass-produced, the classic marker of AI-assisted opinion writing)
- **Source:** 25 of 33 reflections, e.g. `src/content/sq/reflections/2026-10-26-the-poison-paradox.md:16`, `…divide-and-rule…:20`, `…the-blame-culture.md:16`, `…cut-off-from-the-ground.md:22`, `…the-killed-authority.md:16`, `…the-perfect-alibi.md:16`, `…the-bargain…:20`, `…the-blood-trap.md:22`, `…architects-of-smoke.md:14`, `…five-questions.md:14`
- **Evidence (REPRODUCED, §3.2):**
  - At a median 23% of the way through the text, a "Më lejoni ta them / të jem i qartë…" sentence introduces a bold "X nuk është A; është B" thesis (21 of 25 cases).
  - "Më lejoni ta them këtë me të gjithë qartësinë që meriton e vërteta" appears verbatim in *Paradoksi i helmit* and *Përça dhe sundo* (both published 26 Oct), and with "kërkon" in *Kultura e fajtorit*.
  - The texts close with "Sepse në fund të ditës…" (8 of 33) or "Udhëheqja/Lidershipi i vërtetë…" (14 of 33).
  - Subtitles follow "Titulli: Kur …/Pse …" (16 of 20 colon titles).
  - Antithesis and tricolon example: "**Lëvizja nuk është përparim. Zhurma nuk është rezultat. Dhe teatri nuk është menaxhim.**" (`sq/reflections/2026-10-20-architects-of-smoke.md:14`).
- **Expected vs actual:** expected each reflection to find its own entry and turn; actual is that read in sequence, the reader can predict the move, and later pieces feel generated from the first.
- **User impact:** dilutes the strongest original voice on the site (see §5). A reader who reads three in a row stops trusting the fourth.
- **Confidence:** high.
- **Suggested correction (suggestion, not a rewrite):** keep "Më lejoni…" in at most a handful of pieces. In the others, state the thesis without the throat-clearing, or let a scene carry it, as *Fantazma në dhomën plot me pasqyra* does. Vary or remove the "Sepse në fund të ditës" closer.
- **Regression risk:** none technical. Editorial work requires the author.

### P4-04: Arithmetic and factual errors in *Haggling over a year of life*
- **Severity:** P2 (wrong numbers presented as "doing the arithmetic as it is")
- **Source:** `src/content/sq/reflections/2026-10-22-the-bargain-with-a-year-of-life.md:22` and front-matter `deck` (`:6`); same in EN and DE
- **Evidence:**
  - SOURCE: "Tridhjetë mijë lekë të vjetra janë një mijë lekë në ditë pune." 30,000 old lek a month is 1,000 per *calendar* day. Per working day it is about 1,150 (26-day month) or about 1,360 (22 days). EN and DE silently drop "pune" ("a thousand lek a day"), so the translations are more correct than the original. That is a fidelity divergence.
  - INFERRED, NOT VERIFIED: the deck equates 30,000 old lek (3,000 lek, about €30) with "three bus tickets and a pack of coffee". At Tirana's urban fare of about 40 lek, that comparison is off by a factor of about 4.
  - INFERRED: "kur një kompani të rrit rrogën me tridhjetë mijë lekë … ti në të vërtetë je më i varfër se ditën e parë". For the 500,000-old-lek wage used in the sister reflection *Five questions*, 30,000 is a 6% rise, which likely exceeds Albanian CPI inflation in 2023–2024 (NOT VERIFIED).
- **User impact:** an operations author whose brand is "check the numbers" publishes numbers that do not check.
- **Confidence:** high on the per-day arithmetic, medium on the price comparisons.
- **Suggested correction:** "një mijë lekë të vjetra në ditë"; drop or verify the bus and coffee comparison; make the inflation sentence conditional ("mund të jesh më i varfër…") or cite a CPI figure.
- **Regression risk:** none.

### P4-05: Legal claim, and an amount that foreign readers cannot interpret, in *Five questions*
- **Severity:** P2
- **Source:** `src/content/reflections/2026-10-20-five-questions.md:12, 36-38` (and SQ/DE)
- **Evidence:**
  - INFERRED, NOT VERIFIED against the statute: the owner says "You get fourteen days of leave a year, as the law says", and the text builds on it ("Why do you apply the law only when…"). My understanding is that the Albanian Labour Code (Art. 92 as amended in 2015) sets a minimum of four calendar weeks. If so, the essay endorses a wrong legal premise.
  - SOURCE: "five hundred thousand old lek" is never glossed. EN and DE readers cannot know this is 50,000 lek, about €500.
- **Suggested correction:** check the statute; if the minimum is 4 weeks, make it the owner's falsehood ("…sipas ligjit", which is not true) — a stronger point. Add one bracketed gloss in EN and DE ("about €500").
- **Confidence:** medium (legal point), high (gloss).

### P4-06: Sweeping, unsourced "research-like" claims in the reflections
- **Severity:** P2 (fact and interpretation are blurred in pieces under a professional byline)
- **Evidence (SOURCE):**
  - "But world history knows not a single case of a country that reached lasting prosperity through enlightened thievery." (`reflections/2026-10-26-the-poison-paradox.md:34`). This is contested in development economics, for example by the literature on East Asian growth with corruption.
  - "the history of management teaches us one unshakeable rule: the problems of an organisation always flow from the top down" (`reflections/2026-10-25-the-perfect-alibi.md:34`).
  - "The history of leadership and management teaches us that no real battle has ever been won…" (`cut-off-from-the-ground.md:24`).
  - "In modern aviation or in surgery … The first question the investigating board asks…" (`the-blame-culture.md:20`). Surgery has no "investigating board" in that sense, and its blame culture is a known problem.
  - "Let us set this myth against one simple fact that no one can deny" (`the-perfect-alibi.md:18`), followed by an unsourced generalisation about Albanian workers abroad.
- **Not a demand for sources in a reflective genre.** The issue is that "history teaches" and "a fact no one can deny" present opinion as established fact.
- **Suggested correction:** mark these as conviction ("Besoj se…", "Në përvojën time…"), or cite one source where a factual claim is made.
- **Confidence:** high.

### P4-07: *The night the system went down* disowns its own title and promise
- **Severity:** P2 (weak documented case; credibility)
- **Source:** `src/content/insights/2026-10-13-the-night-the-system-went-down.md:52, 66-70`
- **Evidence (SOURCE, REPRODUCED caveat count 6 in 1,026 words plus two correction notes):**
  - "The title says 'went down', but what happened that night was more ordinary than a breakdown"
  - "In the first essay of this series I promised an essay about 'the night the system went down and we saw what the team really knew'. I did not see that."
  - The case is a trainee waiting in a back office for five hours.
- **Effect:** honest, but the reader is told three times what the essay cannot say. The useful content (five things to know before the shift) is generic.
- **Suggested correction:** retitle, for example "The night the screen was not there", or merge into *The first 30 days*, which already tells the same night (P4-02).
- **Confidence:** high.

### P4-08: Albanian editorial consistency
- **Severity:** P3 (cumulatively P2)
- **Evidence (REPRODUCED, SOURCE):**
  - Register: 25 of 33 SQ reflections mix ju and ti (e.g. `the-blame-culture.md:16` "Më lejoni…" then "ti nuk ke ndrequr asgjë"; `:18` "Shikoni"), against FJALORI's "ti".
  - Colon capitals: 20 of 20 reflection titles are capitalised after the colon; insight titles never are.
  - "Lidershipi i vërtetë" (`divide-and-rule…:40`, `the-perfect-alibi.md:34`, `the-bargain…:38`) alongside "Udhëheqja e vërtetë" in sister pieces.
  - Calque "procedurë standarde operimi", in Albanian primarily a surgical "operim", even inside the surgery paragraph (`the-blame-culture.md:20`); natural forms are "procedurë standarde pune" or "SOP".
  - Glossary breach: "Një sistem i mirë eskalimi…", "Eskalimi si sistem…" (`src/content/sq/insights/2026-10-08-solve-it-or-escalate-it.md:8-9`). These lines are shown on cards and in meta descriptions.
  - Progressive calque: "Nëse je duke punuar sot…" (`divide-and-rule…:46`); "po punon" is the standard form.
- **Suggested correction:**
  - adopt "ti", or else keep "Më lejoni" deliberately as a fixed formula and say so in FJALORI
  - put titles in lower case after the colon
  - choose "udhëheqja"
  - "Një sistem i mirë për t'i çuar problemet lart…"
- **Confidence:** high.

### P4-09: German grammar slips and glossary breaches
- **Severity:** P3
- **Evidence (SOURCE):**
  - `src/content/de/insights/2026-10-10-the-angry-guest-at-2am.md:40`: "Aus diesen Nächten sind folgende Zimmerprobleme festgehalten: **schwachen** Wasserdruck in der Dusche" should be "schwacher" (nominative).
  - `de/reflections/2026-10-22-the-bargain-with-a-year-of-life.md:32`: "als hätte ihm jemand … genommen … und **verlange** obendrein" should be "verlangte" (consistent Konjunktiv II).
  - Note `de/notes/2026-10-25-226-count-all-stock.md`: "…zählt den Bestand, auf den es ankommt, **mit zu wenig**." The noun is missing ("mit zu wenig Sorgfalt").
  - "Fläche" for "the floor" in 4 reflections (e.g. `cut-off-from-the-ground.md:28` "Sie erklären die Fläche für schuldig"), against FJALORI.
  - Literal calques: "um die Unsicherheit seines eigenen Stuhls zu schützen" (`the-information-monopoly.md:16`; better "um den eigenen wackligen Posten zu sichern"); "mit trüben Anweisungen" (`:12`; better "mit vagen Anweisungen"); "Kleine Menschen spalten" (`divide-and-rule…:50`; better "Kleingeister"); "ihre Würde senken" (`:34`; better "sich erniedrigen").
  - Title capitalisation after the colon: 4 of 9 in insights vs 20 of 20 in reflections.
- **Confidence:** high.

### P4-10: English calques and slips, mostly in the reflection translations
- **Severity:** P3
- **Evidence (SOURCE):**
  - "the insecurity of his own chair" (`reflections/2026-10-26-the-information-monopoly.md:16`)
  - "Look at how the industries work that carry human lives on their shoulders" (`the-blame-culture.md:18`; better "Look at how industries that carry human lives work")
  - "small people divide so they can rule over ruins" (`divide-and-rule…:50`; better "small minds" or "petty men")
  - "grown adults lower their dignity" (`:34`)
  - "the letter of the rise", "leaves the job empty" (`the-bargain…:32, :34`)
  - "staff turnover list" (`five-questions.md:54`)
  - "a quiet line to the office upstairs … They become a master of victimhood" (`the-killed-authority.md:24`: number disagreement)
  - "That is four steps" (`insights/2026-10-13-when-the-dashboard-turns-red-before-you.md:58`)
  - Note `notes/2026-10-13-173-operations-temptation-always.md`: "In operations, the temptation is always the jump." The EN loses "to the solution", which SQ and DE keep. This is a fidelity loss.
  - "[Shift Pulse] shows the week's numbers side by side, so that a red day has ten days of history next to it" (`when-the-dashboard…:103`): a week against ten days, internally inconsistent.
- **Confidence:** high.

### P4-11: Inconsistent quotation marks across sections
- **Severity:** P3
- **Evidence (REPRODUCED, §3.4):**
  - EN and SQ reflection bodies use straight "…"; EN and SQ insights use curly “…”.
  - Mixed „fasadës që shkëlqen” in `sq/reflections/2026-10-20-architects-of-smoke.md:30`.
  - EN note `2026-10-04-13-reported` uses ‘…’ while other notes use “…”.
- **Suggested correction:** run the same typographic-quote pass that was applied to insights on 4 Oct (commit f935c80).
- **Confidence:** high.

### P4-12: Albanian grammar and wording slips (sample)
- **Severity:** P3
- **Evidence (SOURCE):**
  - "nëse operacionet e saj varen… në **treg modern**" (`sq/reflections/2026-10-26-the-information-monopoly.md:38`; should be "në një treg modern")
  - Note `sq/notes/2026-10-25-276-fixing-fast-learning.md`: "Ndreqja e shpejtë nuk është **të mësuar i shpejtë**" (the substantivised infinitive needs "të mësuarit shpejt")
  - "një mik i vjetër në **Venedik**" (`sq/reflections/2026-09-27-ghost-in-a-room-of-mirrors.md:18`; standard "Venecia")
  - "Një **fishbone** i plotësuar…" (`sq/notes/2026-10-25-255-fishbone-filled-by.md`; "diagrami kockë peshku / Ishikawa", as DE does with "Fischgrätdiagramm")
  - The note `2026-10-13-191-where-to-look` ("Largësia … ta dish atë është detyra jote") differs from the essay sentence it quotes ("Distanca … ta njohësh atë është puna jote", `sq/insights/2026-10-13-when-the-dashboard…:99`)
  - "Pyetja … 'i/e gatshëm'" in spoken dialogue (`sq/reflections/2026-10-20-five-questions.md:44`) is an administrative form inside speech
- **Confidence:** high (first four), medium (dialogue form).

### P4-13: The projects page overstates what exists
- **Severity:** P3
- **Source:** `src/content/projects/operational-runbooks.md`, `front-desk-control.md`; `_site/projects.html`
- **Evidence (SOURCE):**
  - "Operational Runbooks — Turning complex shift knowledge into simple, repeatable systems that teams can use under pressure" has no runbook behind it, only a link to the Shift Handover tool.
  - "Front Desk Control — An operations hub for front-office and night-audit work…" sits against the essay's own statement: "It is not a system approved or run by a hotel, and I have no measurement of the time it saves."
  - The section has 3 projects, not 4.
- **Suggested correction:** reword to what exists ("A personal SOP workspace, built while learning Night Audit; public version anonymised"); either give Runbooks content or call it "Planned".
- **Confidence:** high.

### P4-14: Caveats that undercut authority without adding information
- **Severity:** P3
- **Evidence (SOURCE):**
  - "for the system I work with now I do not know whether the data is updated in seconds, in minutes or later" (`insights/2026-10-13-when-the-dashboard-turns-red-before-you.md:58`). From a dispatcher on that system, it invites "why not?".
  - "I do not know exactly how every part of it works without internet, or whether all the data stays on the device" (`the-tools-you-build-yourself.md:82`), said by the tool's builder.
  - "**Improve.** Which measures I put in place myself, and what they achieved, I cannot say precisely." (`dmaic-without-a-black-belt.md:62`)
  - "The operational materials I used tell me that last mile had instructions…" (`teams-with-many-languages.md:60`), as if the author needed documents to know his own workplace.
  - "how many there were when I took it on, and how long it took to reach 61, I do not have in figures" (`61-resellers.md:43`).
- **Keep (necessary qualifications, do NOT remove):**
  - Pareto's "I cannot give you a sentence like '42% …'" (`pareto…:46`)
  - Damage's "Two reports are not a series" (`how-we-worked-with-damage.md:55`)
  - the 30–40% revenue growth "though I cannot prove that one caused the other" (`61-resellers.md:43`)
  - *When improvement fades*: "I do not know. I never measured whether the results continued after I changed roles." (L55). This one is the essay's point, and it is moving.
  - the three `caseRecord` boxes ("The case, as documented")
- **Suggested correction:** in the cases listed above, either find out (the dashboard latency, the tool's storage), or turn the sentence into a general instruction ("check how old your dashboard's data is"), without a confession.
- **Confidence:** medium (OPINION on tone).

### P4-15: The disclosure page states the translation direction wrongly for reflections
- **Severity:** P3
- **Evidence (SOURCE):**
  - `_site/how-this-is-made.html`: "Texts, translations and code are made in working sessions with Claude… the German and Albanian versions".
  - Reflection commits: "The Albanian original, unchanged, its English and German versions".
- **Suggested correction:** "Reflections are written in Albanian; the English and German versions are made with Claude."
- **Confidence:** high.

### P4-16: Ethnic generalisation in the reflections
- **Severity:** P3, OPINION (reputational risk for a site aimed at German employers and readers)
- **Evidence (SOURCE):**
  - "Given the chance, the Albanian would try to bribe the binary code itself." (`reflections/2026-10-01-the-great-albanian-paradox.md:18`)
  - "Albanians refuse to accept humiliation as a condition of employment." (`the-perfect-alibi.md:16`)
  - 17 of 33 SQ reflections invoke "shqiptar/Shqipëri". The same paradox piece also says the young man "was training that colossal neural network" (`:12`). A user prompting a chatbot does not train it; this is a small technical error in an essay about AI.
- These are satire or indictment by an Albanian author, and that is legitimate. Out of context, quoted in German, they read as stereotype.
- **Suggestion:** an author's note or tag ("polemic", "satire") on these pieces would help; "was training" should become "was using / coaching".

---

## 5. What is genuinely good, and must not be changed

1. **The documented-case discipline in the professional essays.**
   - *Pareto and 5 Why in practice* refuses to invent the Pareto table or the third to fifth whys ("The record stops at the second why. I could fill in the third… now with sentences that sound good"). This is rare and valuable: it is the site's motto enacted.
   - The `caseRecord` boxes (Pareto, Damage, Front Desk Control) separate known from unconfirmed cleanly.
   - *How we worked with damage* opens on two hard numbers (1.06% against a target of 0.8%) and refuses to claim the move to 0.97%.
   - Keep all of these.
2. **Claim types are mostly readable in the insights.**
   - First-hand incidents: dated, specific.
   - Recollections: "In last mile we…".
   - Hypotheticals: flagged with "Imagine", "Suppose", "What I would do today" (17 of 40), or "a hypothetical instruction" (*Teams with many languages*).
   - Research claims are essentially absent from the insights; the scan found none.
   - A reader can tell which is which. Since the 16–17 Oct pass, the prose is no longer constantly interrupted, with the exceptions in P4-07 and P4-14.
3. **The German of the insights is idiomatic, not translated:**
   - „ob auch eine Ursache, steht auf einem anderen Blatt“ (*Pareto*)
   - „Wer beides in einen Topf wirft…“ (*Teams*)
   - „Ein Unternehmen mit eigenem Kopf“ (*61 resellers*)
   - Glossary terms are correct ("Schadensquote", "Unvollständigkeitsquote", "Schichtübergabe", "Kennzahl"); "Sie" is consistent in all insights; "1,06 %" and „…“ are correct.
4. **The Albanian of the insights reads as native prose:** "nëse ke gjetur edhe shkakun, kjo është tjetër punë", "Përqindja nuk ka adresë". FJALORI is followed for foreign names (Pareto-s, Team Leader-i) and KPI forms (KPI-të).
5. **The strongest original voice is the Albanian reflections at their best.**
   - *Fantazma në dhomën plot me pasqyra* has a real scene (Lorenzo in Venice), self-irony ("E di. Po e shkruaj këtë në një faqe publike, nën emrin tim. Ironinë e shoh edhe vetë.") and an earned ending.
   - *Paradoksi i madh shqiptar* has a sharply observed Durrës café and an unexpected, affectionate last turn.
   - These are literature, not content. Do not "professionalise" them into case studies.
6. **No em-dash tics** (0 in about 185k words); healthy sentence-length variance in every language.
7. **Translation fidelity in the sample is high.** In 24 pieces × 2 translations, I found one meaning loss (note 173), one silent arithmetic correction (P4-04), and no added claims.

---

## 6. Strongest and weakest pieces per language (from the full-text sample)

**English**
- **Strongest:**
  - *Pareto and 5 Why in practice*: precise, honest, practical close
  - *The report a machine wrote*: timely, a concrete case of two breakfast numbers, a clear five-point standard; the best piece on AI on the site
  - *Ghost in a room of mirrors* (reflection): the only reflection whose English reads like literature, not translation
- **Weakest:**
  - *The night the system went down* (P4-07)
  - *Haggling over a year of life*: P4-04 arithmetic, calques "letter of the rise" and "leaves the job empty", a rant without a turn
  - *The blame culture*: template thesis (P4-03), awkward "Look at how the industries work that…", the unsourced aviation and surgery claim

**German**
- **Strongest:**
  - *Pareto und 5 Why in der Praxis*
  - *Der Bericht, den eine Maschine geschrieben hat*: „dranbleiben“, „Kehrseite“ are natural
  - *Teams mit vielen Sprachen*: idiomatic and consistent register
- **Weakest:**
  - *Die Kultur des Schuldigen*: Sie and du in one paragraph
  - *Fünf Fragen für fünfhunderttausend Lek…*: du 15× against "Lassen Sie es mich", an unexplained "alte Lek", „Liste der Personalfluktuation“
  - *Ohne Bodenhaftung*: "Fläche" misuse, „Sie erklären die Fläche für schuldig“

**Albanian**
- **Strongest:**
  - *Fantazma në dhomën plot me pasqyra*
  - *Të fillosh nga zero…*: clean, factual, dignified
  - *Pareto dhe 5 Why në praktikë*: also a very good *Raporti që e shkroi një makinë*
- **Weakest:**
  - *Monopoli i informacionit*: the template, "procedurë standarde operimi", "në treg modern", ju/ti
  - *Pazari me një vit jetë*: the arithmetic error originates in the Albanian
  - *Përça dhe sundo në korridore*: verbatim formula shared with *Paradoksi i helmit*, "Lidershipi", "je duke punuar"

---

## 7. Proposed scores

**Criteria (weights):**

| Criterion | Weight |
|---|---|
| Grammar and fluency | 20 |
| Idiomatic naturalness, including glossary compliance | 15 |
| Editorial consistency (register, quotes, titles, terms, facts across pieces) | 15 |
| Originality and structural variety (absence of templates and formulae) | 15 |
| Authority and fact discipline (claims typed, numbers correct, caveats proportionate) | 20 |
| Literary quality and rhythm | 15 |

| | Grammar /20 | Idiom /15 | Consistency /15 | Originality /15 | Authority /20 | Literary /15 | **Total** |
|---|---|---|---|---|---|---|---|
| **English** | 17 | 11 | 10 | 8 | 13 | 11 | **70** |
| **German** | 16 | 11 | 6 | 8 | 13 | 10 | **64** |
| **Albanian** | 16 | 12 | 8 | 8 | 12 | 13 | **69** |

How the scores split:
- **English:** essays 75–80, reflections around 62.
- **German:** essays around 78; the reflections are pulled to about 52 by P4-01 and the calques.
- **Albanian:** essays around 78. The reflections are the most alive writing on the site but the most formulaic, and they carry the arithmetic error.

**Input on "Professional identity and long-term value": about 66/100.**
- **Asset:** the insights form a coherent, honest, practical body of work with a recognisable method: check the category, separate process from person, write what you would do today. The motto is enacted, not just stated.
- **Risks to long-term value:**
  1. the contradictory career timeline and correction-of-correction notes (P4-02), on a site whose currency is trust
  2. a burst of 31 polemical reflections in 8 days that share one template (P4-03) and generalise about "the Albanian owner" or "Albanians" (P4-16). Volume is diluting voice.
  3. pockets of hedging that make an experienced manager sound unsure of his own systems (P4-14)
  4. paragraph-for-paragraph mirroring, so that no language version is allowed to be better than the others
- **To raise it:** fix P4-01 and P4-02 first (cheap, high impact), then curate the reflections: fewer, and each with its own shape.
