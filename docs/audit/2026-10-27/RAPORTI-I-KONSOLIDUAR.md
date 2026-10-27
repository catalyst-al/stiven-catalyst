# Raporti i konsoliduar: Fazat 1, 2 dhe 3 të auditimit të 27 tetorit 2026

27 tetor 2026. Dega `claude/gifted-pasteur-v7n2dw`, nga checkpoint-i `605d0df` (dega `claude/busy-cannon-mq0sqy` e
paprekur). **Asgjë nuk është në `main`, asnjë PR, asnjë deploy, Team Sync Worker i papublikuar.** Çdo "fixed" më
poshtë është vetëm në degë dhe pret shqyrtimin tënd përfundimtar.

## 1. Gjendja në fund të Fazës 3

| Kontroll | Rezultati (27 tetor 2026) |
| --- | --- |
| Build | `npx eleventy`: pa gabim |
| Testet unit | `npm test`: **1330 / 1330**, 0 të anashkaluara (checkpoint: 1092; fundi i Fazës 1: 1269; i Fazës 2: 1318) |
| Testet në shfletues | `npm run test:browser` me Chrome 153: **164 / 164**, 0 të dështuara, 0 të anashkaluara (në auditim dhe në Fazat 1–2: 26 / 32). Përfshijnë axe (13 faqe × 3 gjuhë × 2 tema), printimin, grafikët në celular, lëvizjen dhe Pause-n |
| Coaching | `scripts/check-coaching-build.mjs`: 54 faqe, 9 udhëtime |
| PDF ↔ HTML | 294 PDF kundrejt faqeve të tyre: 0 mospërputhje |
| `npm audit` | 0 dobësi (markdown-it 14.3.3) |
| `main` | `f34b1c4b` (më i fundit më 27 tetor) është i bashkuar në degë; një merge provë i degës në `main` kalon pa konflikt |
| Publikimi | procedura e saktë, përfshirë `online-dates.mjs`, e provuar "në thatë": `docs/RELEASE.md` |
| Nuk u verifikua | Firefox dhe Safari; pajisje reale me GPU; (Chrome 156 i CI-së **u verifikua** më 27 tetor në PR #363, `c7343fbf`: 1332/1332 unit, 176/176 në shfletues, 0 të anashkaluara) |

## 2. Çfarë u bë, me pak fjalë

- **Faza 1, integriteti i mjeteve:** shembujt nuk përzihen më me të dhënat reale; kalimet mes mjeteve (Waste Log → CoQ etj.); presja dhjetore në 3 gjuhë; ATS dhe importi i CV-së; Room Inspection; Action Tracker pa dublikata; Team Sync me fshirje dhe çelësa PBKDF2; pragjet statistikore. Raporti: `STATUS.md`.
- **Faza 2, besueshmëria editoriale:** regjistri i korrigjimeve dhe datat reale të Management Review; metoda dhe kolofoni; "Si bëhet" (reflektimet dhe libri janë origjinale shqip); gjermanishtja me "Sie"; Udhëzuesi i mjeteve, botimi 8; kontrolli PDF ↔ HTML; vendimet e tua nga Faza 1 (PIN 6, Coaching, Hoshin, pragjet, plani i Worker-it). Raporti: `phase2/RAPORTI-FAZA-2.md`.
- **Faza 3, sjellja në shfletues:**
  - **Kërkimi në Chrome (CI-01):** shkaku i vërtetë ishte një tast i shtypur ndërsa faqja e re po vjen, jo `replaceState`. U rregullua. CI tani përdor Playwright 1.64.1 dhe dështon edhe kur një test anashkalohet.
  - **Planetët (M-01):** vizatohen në tri kanavaca, secili vetëm kur është pranë pamjes, me të njëjtën pamje. Pikselët janë identikë në 1440 px dhe ndryshojnë ≤ 5/255 në 390 px. Fitimi i madh për celularin pret miratimin tënd (§3).
  - **Pause për gjithë faqen (M-02, M-03):** ndalon çdo animacion të pafund dhe planetët, mbahet mend nga faqja në faqe, dhe lëvizja e reduktuar fillon e ndalur. Me Pause, kryefaqja zë 0.006 s nga 5 s në desktop (ishte 0.85–1.0 s).
  - **Printimi:** asnjë qelizë tabele e humbur në 177 faqe të printuara (59 mjete × 3 gjuhë); CV-të e gjata 70/70 pika; grafikët plotë edhe pa scroll.
  - **Leximi me zë:** ndalet në fund të tekstit; lexon kutinë e rastit; shënimi i privatësisë thotë kur një zë online ia dërgon tekstin prodhuesit; asnjë fjali e kapërcyer.
  - **Celulari dhe aksesueshmëria:** grafikët e publikimeve në celular pa tekst të prerë (105 → 0), dhe korrigjimet PM-9 deri PM-12.
  - **Lëvizja e reduktuar:** kur emulohet vërtet, `scrollIntoView` i butë rrëshqiste ende. Tani është i menjëhershëm (PM-16).
  - Rishikimet: `phase3/*.md`, me skripte, matje dhe imazhe para/pas.

## 3. Vendimet e 27 tetorit dhe ato që presin

**Vendosur më 27 tetor** (shih `VENDIMET-E-HAPURA.md`): patch-et 2, 3 dhe 4 janë aplikuar në degë (`22edfaff`, `2d9f9906`, `5dd8dfc5`); Pause në fund të faqes dhe pranë planetëve, me ruajtjen e zgjedhjes, miratuar; SEO-02 shtyhet për një ndryshim editorial më vete; patch-i i planetëve në celular mbetet veçmas, me krahasim vizual.

### Gjendja para vendimeve (për histori)

Ndryshimet që prekin pamjen ose ndjesinë **nuk janë në degë**: secili është një patch që aplikohet pastër me
`git am`, në `phase3/proposals/` (README aty):

1. `planets-touch-dpr-1.5.patch`: planetët në ekranet me prekje me 1.5 piksel për piksel CSS (ishte 2): celulari në 4× nga 22 në 32 fps, detyrat e gjata 27 → 2; pak më i butë nga afër.
2. `zenith-radar-keyframes.patch`: radari i Zenith-it rrotullohet sërish si ishte shkruar; hapat e podcast-it blu.
3. `wheel-native-scroll.patch`: rrota e mausit lëviz me mënyrën e shfletuesit (një hap 393 → 54 ms); lidhjet brenda faqes rrëshqasin ende.
4. `lumen-gold-light-theme.patch`: ari i Lumen-it në temën e çelët, #9c824a → #7b683e (3.18:1 → 4.67:1, 151 elemente në 9 mjete).

Edhe:

5. Vendi i çelësit Pause: tani në fund të çdo faqeje dhe pranë planetëve në kryefaqe.
6. SEO-02: lidhje "e radhës / të ngjashme" në reflektime (bllok i ri në çdo faqe reflektimi).
7. Nga Fazat 1 dhe 2, ende të hapura:
   - Kronologjia e karrierës: gjashtë pyetje (`phase2/timeline-contradictions.md`).
   - Propozimet për origjinalet shqip: ju/ti, *Pazari*, *Pesë pyetje*, termat, opinione të paraqitura si fakte.
   - Libri: rreshti i botimit dhe kopertina e pasme (B-01).
   - Management Review: muaji i edicionit special, "redaksia", shënimi i 12 tetorit në PDF, emri "Monthly edition".
   - Përshkrimet e KPI Diagnostic dhe ATS CV.
   - Faqja e privatësisë (P-01).
   - Analytics e Cloudflare (A-01, cilësim llogarie).
   - Podcast-i shqip nr. 1 (P-05).
   - Publikimi i Team Sync Worker (hapi 1 i planit).
8. Publikimi: merge i degës me "Create a merge commit", pastaj `online-dates.mjs` menjëherë (`docs/RELEASE.md`).

## 4. Mbeten pa u bërë (pending), jashtë fokusit të fazave

16 gjetje të detajuara, kryesisht përmirësime opsionale të auditimit:
- **SEO:** faqet e mjeteve me ~70 % tekst të përbashkët (SEO-03), og:locale dhe teksti i WebSite në DE/SQ, skemat Book/Podcast/Periodical, 260 tituj të gjatë, 404 vetëm në anglisht.
- **Performanca dhe siguria:** CSS-ja e mjeteve në një skedar të vetëm; CSP dhe header-at që GitHub Pages nuk i lejon.
- **Grafikët e gjerë:** shtyllat mbi shkallë të shkurtuar (P5-06). Ndryshimi prek grafikët e publikuar dhe PDF-të, prandaj do kërkonte edhe vendimin tënd.
- **Testi i shënimeve të grafikëve** (P5-10).
- **Libri:** metadata e PDF-ve të librit (P6-04).
- **Audio:** zhurma dhe feed-et e podcast-it (P7-06 deri P7-08); kjo do të thotë rikodim i audios së publikuar.
- **Detaje eksporti** (P2A-15, P2B-18).
- **Një shënim arkitekture** (P2B-19).

Të gjitha janë në tabelat më poshtë, me arsyen.

## 5. Numrat

| Status | Table A (58 consolidated findings) | Table B (122 phase-level IDs, 123 rows) |
|---|---|---|
| fixed | 44 | 69 |
| partly fixed | 3 | 10 |
| needs author approval | 10 | 19 |
| pending | 1 | 17 |
| not verified | 0 | 0 |
| no change needed | 0 | 8 |
| **total** | **58** | **123** |

Tabelat (në anglisht, si `STATUS.md`; çdo commit i përmendur është në degë dhe çdo test ekziston):

## 6. Table A: the 58 consolidated findings

| ID | Finding (short) | Phase-level IDs | Status | Evidence | What the author must decide |
|---|---|---|---|---|---|
| T-01 | Example rows become real data after one is removed | P2A-01 | fixed | `45f617fe` · tests/examples-never-mix.test.cjs | — |
| T-02 | Aggregators report a stored example as real figures | P2A-01b | fixed | `45f617fe` · tests/examples-never-mix.test.cjs | — |
| T-03 | Action Tracker example merges into the shared list | P2B-02 | fixed | `3cda431d` · tests/actions-integrity.test.cjs | — |
| T-04 | Daily Board writes a demo profile; hidden default targets | P2A-03, P2A-04 | fixed | `76803d47` · tests/examples-never-mix.test.cjs | — |
| T-05 | Cost of Quality never brings in the Waste Log | P2A-02 | fixed | `779e05b4` · tests/handoffs-real.test.cjs | — |
| T-06 | Process Lab (EN) misreads decimal commas | P2B-01 | fixed | `756b433f` · tests/process-lab.test.cjs, tests/process-lab-2.test.cjs | — |
| T-07 | ATS match rewards filler, misses skills; unsourced 60 % "pass" | P2C-01 | fixed | `0f80fffa` · tests/ats-match.test.cjs; Tools Guide ed. 8 `ab49d9ce` · tests/tools-guide-describes-tools.test.cjs | Optional: the ATS CV page description ("fehlerfrei", "Most large employers…", no source): proposal in phase2/tools-guide-and-pdf-check.md §3, decision §4.2 |
| T-08 | CV import corrupts the CV Builder's own PDF | P2C-02 | fixed | `9a72c2de` · tests/cv-import-pdf.test.cjs | — |
| T-09 | Print cuts table columns in 7 tools | P2A-06 | fixed | `543968c6` · tests/browser/print.spec.mjs; sweep of all 59 tools × 3 languages: tables cut on 83 of 177 printed pages → 0 cells missing (3 FMEA pages flagged at portrait width print on landscape, checked as images) (phase3/print-listen.md) | Note: tables print in smaller type |
| T-10 | A3 print keeps only the WHAT column | P2B-06 | fixed | `543968c6` · tests/browser/print.spec.mjs (Owner, Due date, Status present in 3 languages); keyboard scroll `bb3c4333` | — |
| T-11 | KPI Diagnostic names a cause from a 2-point gap | P2A-08 | fixed | `9af944bb` · tests/kpi-diagnostic.test.cjs; ledes/cards `f43ca211`; guide ed. 8 `ab49d9ce` · tests/tools-guide-describes-tools.test.cjs; threshold documented `576834c4` (docs/THRESHOLDS.md) | Threshold decided (STATUS.md, answer 3). Open: the KPI Diagnostic seo_title/description (tools-guide-and-pdf-check.md §3, §4.2; RAPORTI §9.7) |
| T-12 | Sigma chart: one point is "lasting"; "6+" on 250 clean units | P2A-09, P2A-12 | fixed | `b78a5f3d` · tests/sigma-chart.test.cjs | — |
| T-13 | Signals: false good-side signals on rare counts | P2A-11 | fixed | `c8e6e67a` · tests/signals-low-counts.test.cjs; threshold in docs/THRESHOLDS.md (`576834c4`) | Decided (answer 3) |
| T-14 | Site Compare ranks a 2-route depot first | P2A-13 | fixed | `58178333` · tests/site-compare.test.cjs; minimums in data file `576834c4` · tests/owner-decisions.test.cjs | Decided (answer 3) |
| T-15 | Andon durations wrong across a clock change | P2A-05b | fixed | `0c5ac635` · tests/andon.test.cjs | — |
| T-16 | Daily Board 5S score differs from the 5S Audit | P2A-05 | fixed | `76803d47`, `8f9c4e25` · tests/handoffs-real.test.cjs, tests/five-s-partial.test.cjs | — |
| T-17 | The same paste doubles the log | P2A-07 | fixed | `285c7af8` · tests/log-integrity.test.cjs | — |
| T-18 | Hotel KPIs accept 120 of 100 rooms | P2A-14 | fixed | `d5b06062`, `808b7706` · tests/hotel-kpis.test.cjs, tests/log-integrity.test.cjs | — |
| T-19 | Hand-offs duplicate; "Added 12" when nothing saved | P2B-03 | fixed | `3cda431d` · tests/actions-integrity.test.cjs | — |
| T-20 | Heijunka freezes the tab | P2B-04 | fixed | `b9da1c6e`, `094b9c97`, `70fab809`, `9ad14120` · tests/heijunka.test.cjs | — |
| T-21 | Room Inspection passes after 1 of 34 items | P2B-05 | fixed | `fb3cdb26` · tests/room-inspection.test.cjs; author's rule `82bf4eaa` · tests/owner-decisions.test.cjs; guide `78fd1268` · tests/tools-guide-describes-tools.test.cjs | Decided (answer 4) |
| T-22 | Excel turns "00123" into 123 | P2B-07 | fixed | `285c7af8` · tests/log-integrity.test.cjs; verification/phase1-exports-chromium.cjs | — |
| T-23 | Time Study "standard time" without rating or allowance | P2B-09 | fixed | `bf3e2c51` · tests/time-study-standard.test.cjs; guide ed. 8 `ab49d9ce` · tests/tools-guide-describes-tools.test.cjs | Optional: name more tools in "What changed in Edition 8" (tools-guide-and-pdf-check.md §4.3) |
| T-24 | CV and ATS PDFs cut long blocks | P2C-03 | fixed | ATS PDF writer of `605d0df` (checked `822faca1`); print of CV Builder 50/70 → 70/70 bullets and ATS CV print 48/70 → 70/70: `1b91b7ff` · tests/browser/print.spec.mjs | Note: the previews continue a long job on the next page |
| T-25 | Team sync never propagates deletions | P2C-04 | fixed | `4e69750f` · tests/team-sync-deletions.test.cjs (client side, ships with the site) | — |
| T-26 | Sync ids by plain SHA-256; no limits on the Worker; dev origin | P2C-05 | partly fixed | Code: `697cbf95`, `9e64b36c` · tests/team-sync-keys.test.cjs, tests/sync-worker.test.cjs; plan and compatibility `83b770ba` · tests/sync-compat.test.cjs, docs/SYNC-WORKER-MIGRATION.md. Remains: the Worker (rate limits, 4 MB bodies, no localhost origin) is not deployed | Approve step 1 of docs/SYNC-WORKER-MIGRATION.md (Worker deployment) (RAPORTI §9.8) |
| T-27 | Backup file leaves out photos | P2C-08 | fixed | `e8ea5a8f` · tests/work-backup-photos.test.cjs, tests/browser/work-backup-photos.spec.mjs | — |
| T-28 | ATS matching not Unicode-normalised | P2C-09 | fixed | `0f80fffa` · tests/ats-match.test.cjs | — |
| E-01 | MR: undisclosed changes; false "64 issues, each says so" | P5-01 | fixed | `c9a75002` · tests/corrections-register.test.cjs; reprint `a1517ed5`. History check: the 74–77/79 notes the audit asked for are not needed (checked before going online, merge `7b43e7c3`, 11 Oct): phase2/management-review.md §1 | None required. Options: notes on 74–77/79 only with evidence of an earlier public version (management-review.md §9.4); print the series-wide 12 Oct note in the PDFs (tools-guide-and-pdf-check.md §4.1, RAPORTI §9.6) |
| E-02 | German reflections mix Sie and du | P4-01 | fixed | `593cb4f3` · tests/register.test.cjs; previews `ed88fc6f`; phase2/german-english-edits.md | — |
| E-03 | Career timeline contradicts itself | P4-02 | needs author approval | `a2e2812c`: phase2/timeline-contradictions.md (7 contradictions, 6 questions); no fact changed | Answer the six questions (timeline-contradictions.md §2; RAPORTI §9.1) |
| E-04 | MR dating model ("November 2026" online in October) | P5-02, SEO-01 | fixed | `c9a75002` · tests/publication-dates.test.cjs; reprint `a1517ed5`; online dates `c7ac2996` | The special edition's month name; the "monthly edition" label (management-review.md §9.1, §9.3; RAPORTI §9.4) |
| E-05 | Method box overclaims | P5-03 | fixed | `c9a75002` · tests/publication-colophon.test.cjs (method text, Nos. 1 and 21). Not verified beyond the audit's sample whether every other unconfirmed figure is marked (management-review.md §4) | — |
| E-06 | PDFs: no AI disclosure; "the editors" | P5-04 | fixed | `c9a75002` · tests/publication-colophon.test.cjs; reprint `a1517ed5`, `1ff8ed55` · tests/pdf-matches-html.test.cjs | Keep "the editors" (184 places in EN) or rewrite (management-review.md §9.2; RAPORTI §9.5) |
| E-07 | Chart labels overflow on phones | P5-05 | fixed | `5824bd06` (phase 3) · tests/browser/chart-labels.spec.mjs; phase3/charts.md (105 cut texts → 0; wide/PDF charts byte-identical) | None recorded (phone bars slightly shorter; before/after pictures in phase3/charts/) |
| E-08 | Reflections run on one template | P4-03 | needs author approval | Audit itself: "Author decision". Partly answered by phase2/albanian-proposals.md §1 option B | Vary openings/closings, or keep (albanian-proposals.md §1) |
| E-09 | Arithmetic in *Haggling over a year of life* | P4-04 | needs author approval | Proposals only, no SQ text touched: albanian-proposals.md §2 (sources opened: INSTAT, Tirana fare 40 lek) | Choose the wording (RAPORTI §9.2) |
| E-10 | *Five questions*: "fourteen days … as the law says"; old lek not glossed | P4-05 | needs author approval | albanian-proposals.md §3: the legal point is now checked (Labour Code Art. 92(2) as amended by Law 91/2024: at least 22 working days); nothing changed | The wording, and the EN/DE gloss (RAPORTI §9.2) |
| E-11 | Opinion presented as fact in reflections | P4-06 | needs author approval | albanian-proposals.md §6 (five proposals) | Accept or reject each |
| E-12 | *The night the system went down* disowns its title | P4-07 | needs author approval | Not taken up as a retitle; the facts of that night are question C2 of timeline-contradictions.md | Retitle or merge (audit), after the timeline answers |
| M-01 | Home planets saturate the main thread | PM-1 | partly fixed | Same look: `ba1c7ee0` (three canvases, each drawn only near the view; canvas pixels identical at 1440 px, ≤ 5/255 at 390 px); paused motion: main thread 0.006 s per 5 s (desktop), 0.015 s (phone 4×) against 0.85–3.9 s (`972b58e7`). With motion on, the gain under software raster is small (desktop busy 3.44 → 3.23 s). The large gain (phone 4×: 22 → 32 fps, long tasks 27 → 2) needs `phase3/proposals/planets-touch-dpr-1.5.patch` | Decided 27 Oct: the patch stays separate. Compared (phase3/planets-touch.md): brightness and colour kept, about half the fine detail lost, so not applied; an adaptive alternative (density 2 unless a phone misses 30 fps) waits for the author; a real-phone check is the author's |
| M-02 | Pause leaves glows/spins running | PM-2 | fixed | `972b58e7` · tests/browser/motion.spec.mjs (0 running endless animations, 0 canvas draws when paused), tests/motion-css.test.cjs | — |
| M-03 | Pause only on the home hero, not remembered (WCAG 2.2.2) | PM-3 | fixed | `972b58e7` · tests/browser/motion.spec.mjs, tests/cosmos-pause.test.cjs (kept in `sc-motion`, applied before first paint, on every page; reduced motion starts paused; readable while the tools are locked) | Decided 27 Oct: the place (foot of every page, beside the planets) and keeping the reader's choice approved |
| M-04 | Zenith radar broken (duplicate keyframes) | PM-4 | fixed | `22edfaff` (approved by the author on 27 Oct) · tests/motion-css.test.cjs (no two @keyframes share a name), tests/page-transitions.test.cjs; frames in phase3/motion/radar/ | — |
| M-05 | Printed issue before scrolling: blank charts | PM-5 | fixed | `eb4b4b8c` · tests/browser/print.spec.mjs (hidden chart parts 14/35/10 → 0; also scroll reveals, hero titles, dark margins on paper) | — |
| M-06 | Desktop wheel glide slows scrolling | PM-6 | fixed | `2d9f9906` (approved by the author on 27 Oct, on condition that the other smooth motion stays: only the wheel handler of script.js is removed; links to a place on the page still glide, every animation and transition unchanged) · tests/browser/motion.spec.mjs (a notch 393 → 54 ms on home) | — |
| P-01 | Privacy page incomplete | P2C-07 | needs author approval | Legal text; the facts to add are in phases/p2c-career-platform.md (P2C-07). No commit | The privacy text |
| P-02 | Narration reads the feedback form | P7-01 | fixed | `8bbf356f` · tests/listen-real-pages.test.cjs (built pages, 3 languages; reading stops at the end of the text on 261 narrated pages) | — |
| P-03 | Narration skips the case-box content | P7-02 | fixed | `8bbf356f` · tests/listen-real-pages.test.cjs ("What cannot be confirmed" read) | — |
| P-04 | Narration privacy note and online voices | P7-03 | fixed | `8bbf356f` · tests/listen-real-pages.test.cjs (local voice first; the note names an online voice and says the text goes to its maker; Edge no longer recommended; privacy page in 3 languages) | — |
| P-05 | Albanian podcast No. 1 has no correction | P7-04 | needs author approval | STATUS.md only ("needs author approval (phase 2)"); no phase 2 file mentions it; `src/_data/audio.json` unchanged since `605d0df` | Check the SQ recording against the issue, then record the result either way |
| A-01 | Cloudflare Web Analytics collects nothing | PM-7 | needs author approval | Account setting (STATUS.md); `src/_data/site.json` token unchanged | Add a manual Web Analytics site in Cloudflare and give the new token |
| B-01 | Back-cover line translated in opposite directions | P6-01 | needs author approval | albanian-proposals.md §8.1 (options A/B); book files unchanged | "brenda tij": the man or the city (RAPORTI §9.3) |
| SEO-02 | Reflections linked from one page only | SEO-02 | pending | Deferred by the author on 27 Oct to a separate editorial change: navigation between essays is useful, but recommended links must be meaningful. `src/_includes/layouts/article.njk` unchanged | The editorial change itself, later |
| CI-01 | Search journey fails on current Chrome | — | fixed | `be86a306`, `e40c5fe2` · tests/browser/transitions.spec.mjs (failed 6/6 before). Cause: a key pressed between the new page's commit and its first frame, not `replaceState` as the audit suspected | — |
| CI-02 | CI's Chromium is a year old | — | fixed | `d0ad3889` (@playwright/test 1.56.1 → 1.64.1; CI prints the browser and fails on skipped, flaky or not-run tests; markdown-it 14.3.3, `npm audit` 0), `00976354` (25 min). Verified on Chrome 156.0.8078.4 in CI of catalyst-al/stiven-catalyst#363 (`c7343fbf`): 176 / 176 browser tests | — |
| CI-03 | Contract tests used invented fixtures | P5-10 (chart-note test part) | partly fixed | Real built pages: tests/helpers/tool-page.cjs (`285c7af8`), `779e05b4` · tests/handoffs-real.test.cjs; the pause is tested by behaviour (`972b58e7` · tests/browser/motion.spec.mjs, tests/cosmos-pause.test.cjs rewritten). Remains: tests/weekly.test.cjs still checks only `note.length > 20` (P5-10) | — |
| CI-04 | No check that PDFs match their sources | — | fixed | `7537b295` · tests/pdf-matches-html.test.cjs (294 PDFs + 21 archived guide editions, 0 mismatches) | — |

---

## 7. Table B: every phase-level ID (122 IDs, 123 rows: P5-01 is split)

| ID | Finding (short) | Maps to | Status | Evidence |
|---|---|---|---|---|
| SEO-01 | MR 41–80 dated "November 2026" | E-04 | fixed | `c9a75002` · tests/publication-dates.test.cjs |
| SEO-02 | Reflections linked from one page | SEO-02 | pending | Deferred by the author (see Table A) |
| SEO-03 | Tool pages ~70 % template text | — | pending | Optional in the audit; not assigned to any phase; no commit |
| SEO-04 | Publications as HTML + 3 indexable PDFs | — | no change needed | The audit's own correction: "none mandatory; keep HTML as primary" (it is the only one in the sitemap) |
| SEO-05 | 543 sitemap URLs without lastmod | (P5-09) | partly fixed | `e204acc5` · tests/publication-dates.test.cjs (issue, volume and edition pages take `lastmod` from online.json). Remains: tool and hub pages still have none (the sitemap gives `lastmod` only to dated content, by design) |
| SEO-06 | No og:locale; English WebSite text on DE/SQ homes | — | pending | Not assigned; `base.njk` unchanged since `605d0df` |
| SEO-07 | No Book/PodcastSeries/Periodical schema | — | pending | Not assigned (optional refinement) |
| SEO-08 | 260 titles over 70 characters | — | pending | Not assigned. The KPI Diagnostic seo_title proposal waits for the author (tools-guide-and-pdf-check.md §3) |
| ARCH-01 | English-only 404 for DE/SQ paths | — | pending | Not assigned; `src/404.njk` unchanged |
| ARCH-02 | Thin hub pages | — | no change needed | Audit: "Mostly by design … Suggested: none required" |
| ARCH-03 | Field notes have no own URLs | — | no change needed | Audit: OPINION/design choice, "not a defect if intended; do not split without a reason" |
| P2A-01 | Example rows become real data | T-01 | fixed | `45f617fe` · tests/examples-never-mix.test.cjs |
| P2A-01b | Persisted example shown as data by aggregators | T-02 | fixed | `45f617fe` · tests/examples-never-mix.test.cjs |
| P2A-02 | CoQ "Bring in" ignores Waste Log | T-05 | fixed | `779e05b4` · tests/handoffs-real.test.cjs |
| P2A-03 | Daily Board writes a demo profile | T-04 | fixed | `76803d47` · tests/examples-never-mix.test.cjs |
| P2A-04 | Days red against hidden default targets | T-04 | fixed | `76803d47` · tests/examples-never-mix.test.cjs |
| P2A-05 | Daily Board 5S formula differs | T-16 | fixed | `76803d47`, `8f9c4e25` · tests/handoffs-real.test.cjs |
| P2A-05b | Andon durations wrong at DST | T-15 | fixed | `0c5ac635` · tests/andon.test.cjs |
| P2A-06 | Print cuts table columns in 7 tools | T-09 | fixed | `543968c6` · tests/browser/print.spec.mjs |
| P2A-07 | Same CSV twice doubles the log | T-17 | fixed | `285c7af8` · tests/log-integrity.test.cjs |
| P2A-08 | KPI Diagnostic "most likely" from 2 points | T-11 | fixed | `9af944bb` · tests/kpi-diagnostic.test.cjs; `f43ca211`; `ab49d9ce` |
| P2A-09 | Sigma chart "lasting improvement" from one point | T-12 | fixed | `b78a5f3d` · tests/sigma-chart.test.cjs |
| P2A-10 | Damaged saved data replaced by the example | (P3) | fixed | `285c7af8` · tests/log-integrity.test.cjs (kept under `<key>.unreadable`) |
| P2A-11 | Signals: noise "good side" signals | T-13 | fixed | `c8e6e67a` · tests/signals-low-counts.test.cjs |
| P2A-12 | Sigma precision overstated on small/zero-defect samples | T-12 | fixed | `b78a5f3d` · tests/sigma-chart.test.cjs |
| P2A-13 | Site Compare ignores sample size | T-14 | fixed | `58178333` · tests/site-compare.test.cjs; `576834c4` · tests/owner-decisions.test.cjs |
| P2A-14 | Hotel KPIs accept sold > available | T-18 | fixed | `d5b06062`, `808b7706` · tests/hotel-kpis.test.cjs |
| P2A-15 | Minor: CSV `'` prefix round trip, CX Tower targets/fallbacks, OEE "target 85 %", 100 % targets, Bird's pyramid, Lost & Found return rate, 60-bucket trends, DE "von 3 Tage", "Incomplete %" label, a flaky test | — | pending | No commit cites P2A-15; not assigned to a phase. Spot checks at HEAD: Shift Pulse/Signals still use 85 % when no OEE target (`signals.js:24, 259`); `shiftHandover.json` still labels "Incomplete %". Exception: the flaky-test item: two flaky tests were fixed (`b36db424` · tests/template-pack.test.cjs, `609aa28f` · tests/storage-guard.test.cjs); whether either is the audit's test is not verified |
| P2B-01 | Process Lab EN misreads decimal commas | T-06 | fixed | `756b433f` · tests/process-lab.test.cjs |
| P2B-02 | Action Tracker example merges | T-03 | fixed | `3cda431d` · tests/actions-integrity.test.cjs |
| P2B-03 | Hand-overs duplicate / lose actions silently | T-19 | fixed | `3cda431d` · tests/actions-integrity.test.cjs |
| P2B-04 | Heijunka freezes the tab | T-20 | fixed | `b9da1c6e`, `094b9c97`, `70fab809` · tests/heijunka.test.cjs |
| P2B-05 | Room Inspection passes after one item | T-21 | fixed | `fb3cdb26` · tests/room-inspection.test.cjs; `82bf4eaa` · tests/owner-decisions.test.cjs |
| P2B-06 | A3 print cuts the countermeasure table | T-10 | fixed | `543968c6` · tests/browser/print.spec.mjs |
| P2B-07 | XLSX turns "00123" into 123 | T-22 | fixed | `285c7af8` · tests/log-integrity.test.cjs |
| P2B-08 | Damaged data replaced before a restore point | (P3) | fixed | `285c7af8` · tests/log-integrity.test.cjs |
| P2B-09 | Time Study standard time = median | T-23 | fixed | `bf3e2c51` · tests/time-study-standard.test.cjs |
| P2B-10 | .ics unfolded, English labels in DE/SQ | (P3) | fixed | `81dfd587` · tests/ics-files.test.cjs |
| P2B-11 | Partial 5S audits counted as full | (P3) | fixed | `6f04859b`, `8f9c4e25` · tests/five-s-partial.test.cjs, tests/handoffs-real.test.cjs |
| P2B-12 | 5 Whys gives no save-failure warning | (P3) | fixed | `605e90e9` · tests/five-whys-save.test.cjs |
| P2B-13 | Heijunka takt drops a product without pack-out | (P3) | fixed | `b9da1c6e` · tests/heijunka.test.cjs |
| P2B-14 | VSM bottleneck by cycle time | (P3) | fixed | `62867c4b` · tests/vsm-bottleneck.test.cjs |
| P2B-15 | ABC ties put a tail into A | (P3) | fixed | `d45ba43d` · tests/inventory-abc-ties.test.cjs |
| P2B-16 | Gage R&R α 0.05 vs "Minitab parity" | (P3) | no change needed | STATUS.md: Minitab's documented default is 0.05; code and comment agree |
| P2B-17 | Two Hoshin exports, same file name | (P3) | fixed | Not a defect (same table byte for byte, STATUS.md); the author chose one set of buttons: `de7fa091` · tests/owner-decisions.test.cjs |
| P2B-18 | Export polish: DE Time Study CSV dot decimal; `'` in XLSX strings; long FMEA token prints past the page | — | pending | No commit cites P2B-18; not assigned. Whether `bf3e2c51` (new standard-time column) changed the CSV decimal mark is not verified |
| P2B-19 | Per-language storage keys silo the work | — | pending | Architecture note (OPINION); no decision recorded |
| P2C-01 | ATS score rewards filler | T-07 | fixed | `0f80fffa` · tests/ats-match.test.cjs |
| P2C-02 | CV import corrupts own PDF | T-08 | fixed | `9a72c2de` · tests/cv-import-pdf.test.cjs |
| P2C-03 | Long blocks cut in CV/ATS PDFs | T-24 | fixed | `1b91b7ff` · tests/browser/print.spec.mjs |
| P2C-04 | Team sync never propagates deletions | T-25 | fixed | `4e69750f` · tests/team-sync-deletions.test.cjs |
| P2C-05 | Key stretching bypassed by unsalted SHA-256 | T-26 | partly fixed | see T-26 (Worker not deployed) |
| P2C-06 | Zip bomb freezes the tab | (P3) | fixed | `19cf45d8` · tests/zip-limits.test.cjs |
| P2C-07 | Privacy page incomplete | P-01 | needs author approval | see P-01 |
| P2C-08 | "All your work in one file" omits photos | T-27 | fixed | `e8ea5a8f` · tests/work-backup-photos.test.cjs |
| P2C-09 | ATS not Unicode-normalised | T-28 | fixed | `0f80fffa` · tests/ats-match.test.cjs |
| P2C-10 | Earlier substring-matching bug | — | no change needed | Re-verification in the audit itself: "original defect closed" |
| P2C-11 | Shelf accepts `/\host` links | (P3) | fixed | `52b56020` · tests/shelf.test.cjs |
| P2C-12 | Search: count capped at 30, "fuehrung", "C#" | (P3) | fixed | `72145707` · tests/search-queries.test.cjs |
| P2C-13 | Coaching import not idempotent; wrong message | (P3) | fixed | `7fed9cfc`, `68bd1260` · tests/coaching-import.test.cjs, tests/owner-decisions.test.cjs |
| P2C-14 | Cover-letter example fails its own check | (P3) | fixed | `2309b507` · tests/cover-letter-example.test.cjs |
| P2C-15 | docs/COACHING_PLATFORM.md stale | (P3) | fixed | `ddd6b6cc` (a document; no test) |
| P2C-16 | Smaller robustness: import sizes, SW cache, newsletter no-cors, mailto length, annotation ids | — | partly fixed | JSON imports refused over the limit: `9e07002f`, `eb588d94` · tests/import-size.test.cjs; DOCX/XLSX by `19cf45d8`. Remains (no commit): PDF import read whole, service-worker cache without cap, newsletter "sent" on rejection, long mailto bodies, annotation id collisions |
| PM-1 | Home canvas saturates the main thread | M-01 | partly fixed | `ba1c7ee0`; the larger gain is the approval patch (see M-01) |
| PM-2 | Pause leaves box-shadow motion running | M-02 | fixed | `972b58e7` · tests/browser/motion.spec.mjs |
| PM-3 | Pause only on home, not remembered | M-03 | fixed | `972b58e7` · tests/browser/motion.spec.mjs |
| PM-4 | Zenith radar duplicate keyframes | M-04 | fixed | `22edfaff` · tests/motion-css.test.cjs |
| PM-5 | Issue charts print blank | M-05 | fixed | `eb4b4b8c` · tests/browser/print.spec.mjs |
| PM-6 | Wheel glide on the main thread | M-06 | fixed | `2d9f9906` · tests/browser/motion.spec.mjs |
| PM-7 | Cloudflare RUM POST answered 404 | A-01 | needs author approval | see A-01 |
| PM-8 | Tool pages: decorative CSS animations 28–50 % of main thread | (P3) | partly fixed | `d8b9192f` (family badge glow: CX Control Tower 2.57 → 0.12 s per 5 s at 4×, ≤ 5.5 % of the badge's pixels differ by ≤ 21/255); Shift Pulse's ECG trace unchanged (stroke-dashoffset runs on the main thread); everything stops when paused |
| PM-9 | CX Tower: 32 tabbable chart dots | (P3) | fixed | `bfff4bbc` · tests/browser/a11y-pages.spec.mjs (tab stops 114 → 82 at 390 px) |
| PM-10 | Share button covers focused links at 390 px | (P3) | fixed | `966b08fd` · tests/browser/a11y-pages.spec.mjs (234 → 4 covered focus positions, the 4 the lower edge of one tall box whose top is in view) |
| PM-11 | Light theme contrast 3.6:1 | (P3) | fixed | `a5c2ad0d` · tests/browser/a11y-pages.spec.mjs (3.61:1 → 4.57:1) |
| PM-12 | Heading order skip in chart legends | (P3) | fixed | `4f49f830` · tests/browser/a11y-pages.spec.mjs (same look, measured) |
| PM-13 | Typography differs by platform; Inter never loaded on screen | — | needs author approval | Design decision ("decide deliberately", audit); not taken up in any phase |
| PM-14 | All tools' CSS in one 436 KB render-blocking file | — | pending | Optional refinement; not assigned |
| PM-15 | CSP gaps; no HSTS/frame-ancestors on GitHub Pages | — | pending | Not assigned. The meta-tag parts (img-src scope, form-action, referrer) are code; HSTS and frame-ancestors need a proxy or the owner's acceptance of the risk |
| PM-16 | Smaller motion/UX notes (smooth scrollIntoView, glide override, hidden live regions, "Save for later" pill) | — | partly fixed | Smooth scrollIntoView under reduced motion: reproduced once reduced motion was really emulated, fixed `502f72df` · tests/browser/motion.spec.mjs; glide override ends with the M-06 patch; live regions and the pill: not changed |
| P4-01 | German reflections switch Sie/du | E-02 | fixed | `593cb4f3` · tests/register.test.cjs |
| P4-02 | Career timeline contradicts itself | E-03 | needs author approval | `a2e2812c`, timeline-contradictions.md |
| P4-03 | Reflections on one rhetorical template | E-08 | needs author approval | albanian-proposals.md §1 option B |
| P4-04 | Arithmetic in *Haggling over a year of life* | E-09 | needs author approval | albanian-proposals.md §2 |
| P4-05 | Legal claim and unglossed lek in *Five questions* | E-10 | needs author approval | albanian-proposals.md §3 |
| P4-06 | Unsourced "research-like" claims | E-11 | needs author approval | albanian-proposals.md §6 |
| P4-07 | *The night the system went down* disowns its title | E-12 | needs author approval | timeline-contradictions.md C2 |
| P4-08 | Albanian consistency: ju/ti, colon capitals, lidershipi/udhëheqja, "procedurë standarde operimi", eskalimi, "je duke punuar" | (P3) | needs author approval | albanian-proposals.md §1, §5 (nothing under src/content/sq/ changed) |
| P4-09 | German grammar slips and glossary breaches | (P3) | partly fixed | `c010f2ea` (plus 3 items in `593cb4f3`), before → after in german-english-edits.md; text, no test. Remains: capitals after the colon in DE reflection titles, left as a separate decision (albanian-proposals.md §5.5) |
| P4-10 | English calques and slips | (P3) | fixed | `04674954`, german-english-edits.md rows 215–229 (text; no test). The "week … ten days" line: EN/DE now "recent days"; the SQ line is a proposal |
| P4-11 | Inconsistent quotation marks | (P3) | partly fixed | EN reflection bodies curly (`04674954`, 222 marks), DE closing marks (`722b7324`, 57 marks); text, no test. Remains: SQ reflection bodies still use straight quotes (100 lines at HEAD), the mixed „…” in sq architects-of-smoke, and the EN note 13 with ‘…’ (still at HEAD); the SQ part waits on the author (Albanian originals are not edited) |
| P4-12 | Albanian grammar and wording slips | (P3) | needs author approval | albanian-proposals.md §4 |
| P4-13 | Projects page overstates | (P3) | needs author approval | The author's own wording; not taken up in phase 2, no proposal written; `src/content/projects/` unchanged |
| P4-14 | Caveats that undercut authority | (P3) | needs author approval | The author's own wording; not taken up, no proposal written |
| P4-15 | Disclosure states the translation direction wrongly | (P3) | fixed | `b4e59ecd` · tests/ai-disclosure.test.cjs |
| P4-16 | Ethnic generalisation in reflections | (P3) | needs author approval | albanian-proposals.md §7 |
| P5-01 (issues 74–77, 79) | Missing correction notes on 74–77 and 79 | E-01 | no change needed | The history shows their check (`6e50b937`, `3565e02a`, `a8c070b3`) came before they went online (merge `7b43e7c3`, 11 Oct 18:33); no reader saw the earlier text: management-review.md §1; tests/corrections-register.test.cjs accepts a record whose change came before going online |
| P5-01 (count, claim, register) | "64 issues changed, each says so"; hand-written count | E-01 | fixed | `c9a75002` · tests/corrections-register.test.cjs (count from the list; 11 dated notes; public register) |
| P5-02 | Dating model | E-04 | fixed | `c9a75002` · tests/publication-dates.test.cjs |
| P5-03 | Method statement overclaims | E-05 | fixed | `c9a75002` · tests/publication-colophon.test.cjs |
| P5-04 | PDFs carry no AI disclosure | E-06 | fixed | `c9a75002`, `a1517ed5` · tests/publication-colophon.test.cjs, tests/pdf-matches-html.test.cjs |
| P5-05 | Chart labels overflow on phones | E-07 | fixed | `5824bd06` · tests/browser/chart-labels.spec.mjs |
| P5-06 | Percentage bars on truncated scales | (P3) | pending | Not assigned; the wide charts are unchanged (phase3/charts.md) |
| P5-07 | DE treatise Vol 4 garbles a caveat | (P3) | fixed | `284fcdac`, `616cac0c` · tests/publication-colophon.test.cjs ("treatise Vol 4 in German keeps the caveat") |
| P5-08 | PDF accessibility and metadata | (P3) | partly fixed | `39666489` (Author, Creator, /Lang via scripts/pdf-meta.py), reprint `a1517ed5`; checked with pdftotext (management-review.md §7), no automated test. Remains: tagged PDF, outline, clickable source links |
| P5-09 | No lastmod for magazine URLs | (SEO-05) | fixed | `e204acc5` · tests/publication-dates.test.cjs |
| P5-10 | Chart-note test does not test the claim | CI-03 | pending | tests/weekly.test.cjs:114 unchanged (`note.length > 20`) |
| P5-11 | Citation slips: Nos. 21, 75, special edition | (P3) | fixed | `c9a75002` · tests/publication-colophon.test.cjs (No. 21), tests/corrections-register.test.cjs (register lists every dated correction); sources checked: management-review.md §2 |
| P5-12 | Cover figures are study counts or model outputs (OPINION) | — | needs author approval | Editorial choice; not taken up in any phase |
| P6-01 | Back-cover blurb EN vs DE | B-01 | needs author approval | albanian-proposals.md §8.1 |
| P6-02 | DE "bei Gjergj Kastrioti Skënderbeu" | (P3) | needs author approval | albanian-proposals.md §8.2 |
| P6-03 | Small DE nuance shifts in the book | — | no change needed | Audit: "no loss of meaning … no rewrite needed" |
| P6-04 | Book EN/DE PDFs lack /Lang, outline; untagged | (P3) | pending | `scripts/pdf-meta.py` (`39666489`) is run by the magazine/review/treatise/weekly scripts only; book scripts and PDFs unchanged since `605d0df` |
| P6-05 | Translations not credited; disclosure direction wrong for the book | (P3) | partly fixed | Site disclosure: `b4e59ecd` · tests/ai-disclosure.test.cjs. Remains: the book's edition line, an author decision (RAPORTI §4, §9.3) |
| P6-06 | Photograph quality (p. 23) | (P3) | needs author approval | Visual decision on the book; not taken up in any phase |
| P7-01 | Narration reads past the essay | P-02 | fixed | `8bbf356f` · tests/listen-real-pages.test.cjs |
| P7-02 | Case box content skipped | P-03 | fixed | `8bbf356f` · tests/listen-real-pages.test.cjs |
| P7-03 | Privacy note vs online voices | P-04 | fixed | `8bbf356f` · tests/listen-real-pages.test.cjs |
| P7-04 | Albanian episode No. 1 without correction | P-05 | needs author approval | see P-05 |
| P7-05 | "Start again" only stop; resume can skip a sentence | (P3) | fixed | `4eceb400` · tests/listen-real-pages.test.cjs (generation ids; Chrome-like and late-"end" stubs). Other engines not verified |
| P7-06 | Podcast loudness below −16 LUFS; +0.6 dBTP | (P3) | pending | Not assigned; `scripts/audio.mjs` and the MP3s unchanged |
| P7-07 | Re-encode deletes corrections | (P3) | pending | Not assigned; `scripts/audio.mjs` unchanged |
| P7-08 | Three feeds share one title; lastBuildDate | (P3) | pending | Not assigned |
| P7-09 | Live MP3s served as `audio/mp3` | (P3) | no change needed | Audit: "GitHub Pages decides it; podcast apps tolerate it … Note only" |

---

## 8. Items without an ID, and notes on the records

**Commit hashes in the records**: the phase 2 and phase 3 review files first cited the agents' own commits from before integration; all were replaced by the commits of the work branch (`76707b57`, `eb877413`, `7257ee12`, `c3a48a79`). The only hashes not on the branch are the three motion commits named in phase3/motion.md as patches, and `cc107fc4`, the Cloudflare version of the Worker.

**Findings in AUDIT-REPORT.md without an ID** (section D "P3, summarised" and section E):

| Item | Status | Evidence |
|---|---|---|
| `npm audit`: 1 high (markdown-it ≤ 14.3.2); docs/DEPENDENCIES.md says 0 | fixed | `d0ad3889`: markdown-it 14.3.3, `npm audit` 0 vulnerabilities, `_site` byte-identical |
| `.git` 533 MB, `_site` 679 MB (committed PDFs and media) | pending | No decision recorded |
| "One flaky unit test" | not verified | Flaky tests fixed: `b36db424` (template-pack) and `609aa28f` (storage-guard); the audit does not name its test |
| "Shelf restore" browser journey timed out once in 30 runs | not verified | Passed in every full run of phase 3 (last: 164 / 164); a rare timeout cannot be excluded |
| Listen bar shifting text on appearance (16 Oct) | not verified | The audit itself did not re-measure it |
| Large monolithic `cx-tower.js` (2,457 lines) | pending | Audit "Reject": no rewrite at once; do it gradually |
| JSON imports read whole whatever their size (STATUS.md row "—") | fixed | `9e07002f`, `eb588d94` · tests/import-size.test.cjs (counted under P2C-16) |
| Occupancy and Lost & Found ratio details; OEE 85 % and the CX 20-min fallback | pending | Part of P2A-15 |

**Phase 1 author decision without an audit ID:** decision 2, PIN length (6 characters for new PINs): done,
`e6617ab1` · tests/work-lock-storage.test.cjs, tests/work-lock.test.cjs.

**Open author decisions that are not tied to one finding:** search for a lone "a" (STATUS.md decision 8: no answer
recorded); the merge and the online-dates step (docs/RELEASE.md §2–3, RAPORTI §9.9).
