# Albanian: proposals for the author (nothing applied)

Phase 2, branch `phase2-language`. Rule 2 of the brief: the Albanian reflections are the author's originals and the
Albanian book is authoritative. Nothing under `src/content/sq/` or in the book was edited. Each item gives the place,
the original sentence, the problem, one or more proposed wordings, why, and what would follow in EN and DE if the
author takes the proposal. Line numbers are those of the files at commit `80ec8052`.

Sources opened for this file (all on 27 October 2026):

- **[KP-IK]** Inspektorati Shtetëror i Punës, *Kushtet e punës* (11.3.2025),
  <https://inspektoriatipunes.gov.al/wp-content/uploads/2025/04/WORKING-CONDITIONS-11.3.2025.pdf>, text extracted with
  `pdftotext`: "Kohëzgjatja e pushimeve vjetore është jo më pak se 22 ditë pune gjatë vitit të punës në vazhdim. […]
  (neni 92, paragrafi 2 i KP)."
- **[KP-EF]** Eurofast, *Albania boosts vacation benefits*, <https://eurofast.eu/albania-boosts-vacation-benefits/>:
  Law no. 91/2024 amends the Labour Code (Law no. 7961, 12.07.1995); in Art. 92(2) "4 calendar weeks" is replaced by
  "22 working days"; published in the Official Gazette no. 143 on 9 August 2024, in force 15 days later.
- **[KP-CZ]** Citizens.al, 30 July 2024,
  <https://citizens.al/en/2024/07/30/gjashte-dite-me-pak-pushime-vjetore-levizja-bashke-denoncon-kushtet-e-punes-gjate-veres/>:
  the Assembly voted the change on 25 July 2024; it quotes the *draft* as "22 calendar days". The enacted wording, per
  [KP-IK] (the state labour inspectorate) and [KP-EF], is **working** days.
- **[INSTAT-25]** INSTAT, *Indeksi i Çmimeve të Konsumit, Dhjetor 2025* (9 January 2026),
  <https://www.instat.gov.al/media/btzbw2hq/ick_dhjetor_2025.pdf>, text extracted with `pdftotext`: "Rritja mesatare
  vjetore e çmimeve të konsumit në vitin 2025 është 2,2 %, njësoj si një vit më parë." Food and non-alcoholic
  beverages +1.6 % (December 2025 on December 2024); within food, "Qumësht, djathë dhe vezë" +4.4 %, "Vajra dhe
  yndyrna" +3.8 %.
- **[INSTAT-24]** INSTAT, *ICK Dhjetor 2024*, <https://instat.gov.al/media/14759/ick_dhjetor_2024.pdf>: "Rritja
  mesatare vjetore e çmimeve në vitin 2024 është 2,2 % nga 4,8 % që ishte në vitin 2023." **Quoted from the search
  engine's extract only**; the PDF returned 503 and then 404 when opened. The 2024 figure is confirmed by [INSTAT-25];
  the 2023 figure (4.8 %) is NOT VERIFIED at the source.
- **[TR-125]** Këshilli Bashkiak Tiranë, Vendim nr. 125, 19.11.2024, *Për përcaktimin e tarifave të transportit
  publik*, <https://tirana.al/uploads/2024/11/20241127102414_vendim-nr125-date-19112024-percaktimi-i-tarifave-te-transportit-publik.doc>,
  converted with LibreOffice: point 1.1, "Tarifa e biletës njëpërdorimshëm për një udhëtim […] është 40 (dyzetë) lekë,
  përfshirë tvsh." Whether a later decision changed the fare is NOT VERIFIED.

---

## 1. Register: "ju" and "ti" in the reflections (P4-08)

**The problem.** FJALORI ("Regjistri"): "lexuesit i drejtohemi me 'ti'". Most reflections address the reader with a
generic "ti" (*Kur ti punëson…*, *ti nuk ke ndrequr asgjë*), and in the same text use the polite plural: the formula
"Më lejoni…", and imperatives such as "Shikoni", "Përfytyroni", "Vëzhgojeni", "Zbrisni".

**Two rules the author can choose.**

- **Option A (smallest change).** Keep "Më lejoni ta them / të jem…" as a fixed rhetorical formula, as one says
  "zonja dhe zotërinj" to a room, and write that exception into FJALORI. Every other "ju" form addressed to the reader
  becomes "ti". Proposed line for FJALORI, "Regjistri", after the first point: *"Përjashtim: formula retorike 'Më
  lejoni ta them…' te reflektimet mbetet me 'ju'; çdo thirrje tjetër e lexuesit është me 'ti'."*
- **Option B (one register).** Also the formula goes to "ti": "Më lër ta them…", "Më lër të jem i qartë…". Or, to
  avoid addressing anyone, "Po e them hapur…", "Do të jem i qartë…" (this also answers P4-03, the repeated formula).

**What follows in EN and DE.** Nothing, under either option. English has one "you". The German versions now use "Sie"
throughout, by FJALORI's rule for German (commit `6815aa42`), and keep "Lassen Sie mich…" for the formula, which is
right for both options. Only if the author takes the "Po e them hapur" variant of Option B would "Let me be clear" /
"Lassen Sie mich …" become "I will say it plainly" / „Ich sage es offen“; that is a stylistic choice, not a fix.

**Every affected sentence.** "Formula" = "Më lejoni…": unchanged under A, "Më lër…" under B. Plural forms inside
quotation marks (the reader speaking to an owner, the owner speaking to staff) are correct and are not listed: e.g.
`five-questions.md:22, 46, 54`, `the-divine-mission.md:22`. Also not listed: `the-poison-paradox.md:16` "pse uji po
ju sëmur fëmijët" (you and your neighbours, a real plural), and `the-divine-mission.md:18` "për t'ju dhënë bukë" (the
owner's voice towards his staff, free indirect speech).

| File:line | Original | Option A and B (non-formula) | Formula under B |
|---|---|---|---|
| architects-of-smoke.md:12 | Nëse hyni sot në një mbledhje […], do të shihni një spektakël të përkryer. Do të shihni kostume… | Nëse hyn sot në një mbledhje […], do të shohësh një spektakël të përkryer. Do të shohësh kostume… | |
| architects-of-smoke.md:14 | **Por më lejoni të jem i qartë. | (formula) | Por më lër të jem i qartë. |
| architects-of-smoke.md:18 | Shikoni se çfarë ndodh kur fiken dritat… | Shiko se çfarë ndodh kur fiken dritat… | |
| five-questions.md:14 | Më lejoni ta them hapur, pa asnjë zbukurim burokratik. | (formula) | Më lër ta them hapur, … |
| the-bloodline-org-chart.md:16 | **Më lejoni ta them pa doreza. Kur lidhja e gjakut vlen më shumë se rregullorja e punës, ju nuk keni ndërtuar një kompani. Ju keni ngritur thjesht një fis me nipt biznesi.** | …, ti nuk ke ndërtuar një kompani. Ke ngritur thjesht një fis me nipt biznesi. (If "ju" is meant as the owners as a group, keep it and say so; then the sentence is not reader address.) | Më lër ta them pa doreza. |
| the-bloodline-org-chart.md:18 | Shikoni se çfarë i bën kjo mendësi një operacioni të përditshëm. | Shiko se çfarë i bën … | |
| the-false-alms.md:14 | Më lejoni të jem fare i qartë për këtë pikë. | (formula) | Më lër të jem fare i qartë … |
| the-imaginary-queue.md:16 | **Më lejoni të jem i drejtpërdrejtë. Ju mund ta zëvendësoni një emër në listëpagesë brenda ditës, por nuk mund të zëvendësoni dot kurrë përvojën…** | Ti mund ta zëvendësosh një emër në listëpagesë brenda ditës, por nuk mund të zëvendësosh dot kurrë përvojën… | Më lër të jem i drejtpërdrejtë. |
| the-keeper-of-the-stamp.md:16 | **Më lejoni ta them ashtu siç është. | (formula) | Më lër ta them ashtu siç është. |
| the-keeper-of-the-stamp.md:18 | Shikoni se si funksionon ky mekanizëm çdo ditë. | Shiko se si funksionon … | |
| the-arithmetic-of-the-sun.md:12 | Përfytyroni për një çast një skenë… | Përfytyro për një çast një skenë… | |
| the-arithmetic-of-the-sun.md:18 | Më lejoni të jem fare i drejtpërdrejtë për këtë absurditet. | (formula) | Më lër të jem … |
| the-bargain-with-a-year-of-life.md:20 | Më lejoni të jem krejtësisht i qartë. | (formula) | Më lër të jem … |
| the-killed-authority.md:16 | Më lejoni të jem i prerë për këtë absurditet. | (formula) | Më lër të jem i prerë … |
| the-myth-of-blind-sweat.md:16 | Më lejoni të jem fare i qartë për këtë pikë. | (formula) | Më lër … |
| the-tyranny-of-the-wall-clock.md:16 | Më lejoni të jem krejtësisht i qartë. | (formula) | Më lër … |
| one-sided-availability.md:20 | Më lejoni ta them hapur, pa asnjë dorezë. | (formula) | Më lër … |
| the-blood-trap.md:14 | Përfytyroni një të ri që hyn në punë… | Përfytyro një të ri që hyn në punë… | |
| the-blood-trap.md:22 | Më lejoni të jem i drejtpërdrejtë. | (formula) | Më lër … |
| the-divine-mission.md:14 | Më lejoni të jem krejtësisht i qartë për këtë mitologji moderne. | (formula) | Më lër … |
| the-perfect-alibi.md:16 | Më lejoni të jem krejtësisht i qartë. | (formula) | Më lër … |
| the-perfect-alibi.md:20 | Shikoni se çfarë ndodh në sekondën që këta djem dhe vajza kalojnë kufirin. | Shiko se çfarë ndodh … | |
| the-two-day-ultimatum.md:10 | Përfytyroni për një çast tetë orë të plota në këmbë… | Përfytyro për një çast … | |
| the-two-day-ultimatum.md:22 | Më lejoni ta them hapur, pa asnjë fjalë të bukur… | (formula) | Më lër … |
| cut-off-from-the-ground.md:12 | Përfytyroni një sallë mbledhjesh në katin më të lartë… | Përfytyro një sallë mbledhjesh … | |
| cut-off-from-the-ground.md:22 | Më lejoni ta them këtë me të gjithë peshën e përvojës operacionale. | (formula) | Më lër … |
| divide-and-rule-in-the-corridors.md:12 | Aty do të shihni një dinamikë të çuditshme… | Aty do të shohësh një dinamikë të çuditshme… | |
| divide-and-rule-in-the-corridors.md:20 | Më lejoni ta them këtë me të gjithë qartësinë që meriton e vërteta. | (formula) | Më lër … |
| integrity-in-the-dark.md:16 | Më lejoni ta them këtë me bindje të plotë. | (formula) | Më lër … |
| the-art-of-saying-no.md:18 | Vëzhgojeni me vëmendje se si ndodh ky dorëzim i përditshëm. | Vëzhgoje me vëmendje … | |
| the-blame-culture.md:16 | Më lejoni ta them këtë me të gjithë qartësinë që kërkon e vërteta. | (formula) | Më lër … |
| the-blame-culture.md:18 | Shikoni se si funksionojnë ato industri… | Shiko se si funksionojnë ato industri… | |
| the-isolated-castle.md:12 | Përfytyroni për një çast katin më të lartë… | Përfytyro për një çast … | |
| the-isolated-castle.md:46 | Nëse doni të dini fatin e një kompanie […], mos numëroni paratë […]. Numëroni sa njerëz kanë mbetur… | Nëse do të dish fatin e një kompanie […], mos numëro paratë […]. Numëro sa njerëz kanë mbetur… | |
| the-obedient-notary.md:16 | Më lejoni ta them këtë me të gjithë qartësinë që kërkon e vërteta. | (formula) | Më lër … |
| the-obedient-notary.md:28 | Përfytyroni një punonjës të thjeshtë… | Përfytyro një punonjës të thjeshtë… | |
| the-obedient-notary.md:36 | Shikoni se me sa kujdes trajtohen makineritë… | Shiko se me sa kujdes … | |
| the-pedestal-complex.md:18 | Më lejoni ta them këtë pa asnjë zbukurim. | (formula) | Më lër … |
| the-pedestal-complex.md:20 | Shikoni se si shfaqet kjo luftë… | Shiko se si shfaqet … | |
| the-poison-paradox.md:16 | Më lejoni ta them këtë me të gjithë qartësinë që meriton e vërteta. | (formula) | Më lër … |
| the-theatre-of-haste.md:12 | Vëzhgojeni me vëmendje se si funksionon ky teatër… | Vëzhgoje me vëmendje … | |
| the-theatre-of-haste.md:28 | Përfytyroni një menaxher apo një punonjës që beson te rregulli. | Përfytyro një menaxher … | |
| the-tyranny-of-the-small-man.md:14 | Më lejoni ta them këtë me qartësi të plotë. | (formula) | Më lër … |
| the-tyranny-of-the-small-man.md:16 | Vëzhgojeni me kujdes këtë fenomen. | Vëzhgoje me kujdes … | |
| the-victimhood-trap.md:14 | Përfytyroni një bisedë të zakonshme në kafe… | Përfytyro një bisedë … | |
| the-victimhood-trap.md:16 | Më lejoni ta them këtë me të gjithë peshën e kujdesit njerëzor. | (formula) | Më lër … |
| two-leaders-one-floor.md:10 | Zbrisni në katin e punës, aty ku lëviz malli… | Zbrit në katin e punës, … | |
| two-leaders-one-floor.md:12 | Aty do të shihni shpesh një paradoks të jashtëzakonshëm… | Aty do të shohësh shpesh … | |
| two-leaders-one-floor.md:14 | Në njërën anë keni supervizorin që beson te sistemi. | Në njërën anë ke supervizorin … | |
| two-leaders-one-floor.md:16 | Në anën tjetër keni improvizuesin e përjetshëm. | Në anën tjetër ke improvizuesin … | |
| two-leaders-one-floor.md:24 | Më lejoni ta them këtë me të gjithë peshën e përvojës operacionale. | (formula) | Më lër … |

---

## 2. *Pazari me një vit jetë*: the arithmetic, the bus and coffee, the inflation (P4-04)

File: `src/content/sq/reflections/2026-10-22-the-bargain-with-a-year-of-life.md`.

### 2.1 The per-day sum, line 22

- **Original:** "Tridhjetë mijë lekë të vjetra janë një mijë lekë në ditë pune."
- **Arithmetic:** 30 000 old lek a month = 3 000 lek.
  - per calendar day (30 days): 30 000 / 30 = **1 000 old lek** (100 lek);
  - per working day, six-day week (26 days, the schedule of the sister piece *Five questions*): 30 000 / 26 =
    **1 153.8 old lek** (≈ 115 lek);
  - per working day, five-day week (22 days): 30 000 / 22 = **1 363.6 old lek** (≈ 136 lek).
  So "një mijë … në ditë pune" is wrong by 15 % or 36 %; "në ditë" (calendar) is exact.
- **Proposal A (smallest):** "Tridhjetë mijë lekë të vjetra në muaj janë një mijë lekë të vjetra në ditë."
- **Proposal B (keeps the working day):** "Tridhjetë mijë lekë të vjetra në muaj janë rreth një mijë e njëqind e
  pesëdhjetë lekë të vjetra për çdo ditë pune, në një javë me gjashtë ditë."
- **Why:** the paragraph says "Le ta bëjmë llogarinë ashtu siç është"; the sum that follows must be exact.

**Divergence in EN and DE (silent correction).** EN `reflections/…:22` "Thirty thousand old lek is a thousand lek a
day." DE `de/reflections/…:22` „Dreißigtausend alte Lek sind tausend Lek am Tag.“ Both dropped "pune", so they are
correct per calendar day while the original is not. Both also drop "old" in the result, so a foreign reader, who knows
only today's lek, reads 1 000 lek (≈ 30 000 lek a month, ten times the raise). If the author takes A, EN and DE
should read "…is a thousand old lek a day (a hundred lek in today's money)" / „…sind tausend alte Lek am Tag (hundert
Lek in heutigem Geld)“; with B, "about 1,150 old lek for every working day of a six-day week" / „rund 1 150 alte Lek
für jeden Arbeitstag einer Sechstagewoche“. Not applied, because the translations must follow the original.

### 2.2 Three bus tickets and a pack of coffee, deck (line 6)

- **Original:** "Kur treqind e gjashtëdhjetë e pesë ditë mundi, stresi dhe sakrificë maten me vlerën e tre biletave
  urbani dhe një pakoje kafeje, …"
- **Facts:** a single urban ticket in Tirana costs **40 lek** [TR-125]. The raise is 3 000 lek a month (= 75 tickets),
  or 100 lek a calendar day (= two and a half tickets). Three tickets are 120 lek. The comparison holds only if "a pack
  of coffee" costs about 2 880 lek (a monthly reading), which a usual pack does not; coffee prices NOT VERIFIED.
- **Proposal A (per day, verifiable):** "Kur treqind e gjashtëdhjetë e pesë ditë mundi, stresi dhe sakrificë maten me
  njëqind lekë në ditë, as sa tri bileta autobusi, kompania nuk po të jep një mundësi."
- **Proposal B:** drop the comparison: "…maten me tridhjetë mijë lekë të vjetra në muaj, …"
- **Also** the grammar of the original: "treqind e gjashtëdhjetë e pesë ditë mundi, stresi dhe sakrificë" mixes
  genitive forms; "…ditë mundi, stresi dhe sakrifice" (genitive) reads more naturally. OPINION.
- **EN/DE would follow:** "…are measured at a hundred lek a day, not even three bus tickets…" / „…mit hundert Lek am
  Tag bemessen werden, nicht einmal drei Busfahrkarten…“. The DE link-preview card (`src/media/social/de/
  reflection-the-bargain-with-a-year-of-life.jpg`) shows the summary, not the deck, so it would not need remaking.

### 2.3 "Ti je më i varfër se ditën e parë", line 22

- **Original:** "Nuk mjaftojnë as për të mbuluar rritjen e çmimit të vajit, vezëve dhe bukës gjatë atij viti që lamë
  pas. Është një shumë aq e papërfillshme, saqë nuk arrin as të mbajë ritmin me zhvlerësimin e parave në xhepin tënd.
  Në fakt, kur një kompani të rrit rrogën me tridhjetë mijë lekë pas një viti pune të pandërprerë, ti në të vërtetë je
  më i varfër se ditën e parë që hyre në atë derë."
- **Facts:** average CPI inflation 2.2 % in 2025 and 2.2 % in 2024 [INSTAT-25]; 4.8 % in 2023 [INSTAT-24, extract
  only]. A raise of 30 000 old lek keeps pace with 2.2 % only up to a monthly wage of 30 000 / 0.022 = **1 363 636 old
  lek** (≈ 136 400 lek), and with 4.8 % up to 30 000 / 0.048 = **625 000 old lek**. For the 500 000-old-lek wage of the
  sister reflection *Five questions*, the raise is 6.0 %: 1.060 / 1.022 = **+3.7 % in real terms** in 2024 or 2025,
  +1.1 % even in 2023 (1.060 / 1.048). So "ti je më i varfër se ditën e parë" is false for such a wage; it is true only
  for wages above roughly 1.36 million old lek. Food prices: +1.6 % in a year for the food group, +4.4 % for milk,
  cheese and eggs, +3.8 % for oils and fats (December 2025 on December 2024) [INSTAT-25]; whether 3 000 lek covers a
  household's extra spending on oil, eggs and bread depends on what it buys, so the first sentence is NOT VERIFIABLE as
  a general claim. The reflection itself does not state the wage. (Gross figures; tax and contributions not counted.)
- **Proposal A (keeps the anger, true for the 500 000 wage):** "Le ta bëjmë llogarinë ashtu siç është. Mbi një rrogë
  prej pesëqind mijë lekësh të vjetra, kur i heq rritjen e çmimeve, të mbeten rreth njëzet mijë lekë të vjetra më
  shumë në muaj: më pak se dy bileta autobusi në ditë." (Computation: 500 000 × 2.2 % = 11 000 old lek eaten by
  prices; 30 000 − 11 000 = 19 000 old lek ≈ 1 900 lek a month ≈ 63 lek a day; 40 lek a ticket.)
- **Proposal B (conditional):** "…Për shumë rroga, kjo shumë mezi e mbulon rritjen e çmimeve; për disa, as atë."
  and delete "Në fakt, … ti në të vërtetë je më i varfër se ditën e parë".
- **Proposal C:** cite a year: "Me inflacion 4,8 % si në vitin 2023, për një rrogë mbi gjashtëqind mijë lekë të
  vjetra kjo rritje nuk e mban dot ritmin e çmimeve."
- **EN/DE would follow** line 22 in each language, sentence for sentence.

---

## 3. *Pesë pyetje…*: "katërmbëdhjetë ditë pushim, sipas ligjit" (P4-05)

File: `src/content/sq/reflections/2026-10-20-five-questions.md`.

- **Original, line 36:** `Pronari të thotë: "Ke katërmbëdhjetë ditë pushim në vit, sipas ligjit."` and line 38:
  `Pyetja e vërtetë që duhet të bësh: "Pse ligjin e zbatoni vetëm kur bëhet fjalë për të numëruar ditët e mia të pakta
  të lirisë, …"` (also line 12: "pushimi vjetor matet me pikatore në vetëm katërmbëdhjetë ditë të numëruara").
- **What the law says.** Kodi i Punës, neni 92, paragrafi 2, as amended by Law no. 91/2024 (Official Gazette no. 143,
  9 August 2024, in force 15 days later): annual paid leave is **not less than 22 working days** a year [KP-IK],
  [KP-EF]. Before that amendment the minimum was **4 calendar weeks** [KP-EF]. The draft voted on 25 July 2024 was
  reported as "22 calendar days" [KP-CZ]; the enacted text and the inspectorate say working days. Under both texts,
  fourteen days is below the legal minimum. The official consolidated text on qbz.gov.al was not opened; the
  inspectorate's own guidance [KP-IK] is the official source used here.
- **Problem.** As written, the owner's claim stands unchallenged, and the reader's question ("Pse ligjin e zbatoni
  vetëm kur…") accepts it as the law. The essay therefore endorses a wrong legal premise.
- **Proposal A (stronger point, smallest change; the line stays the owner's):** line 38: `Pyetja e vërtetë që duhet të
  bësh: "Ligji thotë jo më pak se njëzet e dy ditë pune. Pse ligjin e kujtoni vetëm kur bëhet fjalë për të numëruar
  ditët e mia të pakta të lirisë, dhe e kujtoni gabim, ndërsa kur bëhet fjalë për orët shtesë, …"`
- **Proposal B (the narrator says it):** after line 36, a sentence: "Nuk është e vërtetë: Kodi i Punës kërkon jo më
  pak se njëzet e dy ditë pune pushim në vit."
- **Proposal C:** drop "sipas ligjit" from line 36; then nothing legal is claimed.
- **Why:** the reflection is dated 20 October 2026; the 2024 text applies. A wrong statement of the law, even in an
  owner's mouth, reads as the author's when nothing contradicts it.
- **EN/DE would follow:** EN line 38 "The law says no fewer than twenty-two working days. Why do you remember the law
  only when it comes to counting my few free days, and remember it wrongly, …"; DE „Das Gesetz sagt: mindestens
  zweiundzwanzig Arbeitstage. Warum erinnern Sie sich an das Gesetz nur, wenn …, und dann falsch, …“. Separately
  (P4-05, EN and DE only, not applied): "five hundred thousand old lek" is never glossed; a bracket "(fifty thousand
  lek in today's money)" / „(fünfzigtausend Lek in heutigem Geld)“ would make it readable. A euro amount is not
  proposed because the exchange rate was not checked.

---

## 4. Wording slips (P4-12)

| File:line | Original | Problem | Proposal | Why | EN/DE |
|---|---|---|---|---|---|
| `sq/reflections/2026-10-26-the-information-monopoly.md:38` | "…nuk mund të aspirojë të rritet në treg modern nëse…" | missing article | "…të rritet në një treg modern nëse…" | an indefinite singular noun needs "një" here | none |
| `sq/reflections/2026-09-27-ghost-in-a-room-of-mirrors.md:18` | "Më kujtohet një mik i vjetër në Venedik" | "Venedik" is the older/Turkish-derived form; standard Albanian is "Venecia" | "…në Venecia" (or keep "Venedik" deliberately as the narrator's voice and say so) | the best literary piece; the author decides whether the old form is a voice choice | none |
| `sq/notes/2026-10-25-255-fishbone-filled-by.md` | "Një fishbone i plotësuar nga një person i vetëm…" | untranslated English | "Një diagram kockë peshku (Ishikawa) i plotësuar nga një person i vetëm…" | DE already says „Fischgrätdiagramm“ | none; the SQ note card image would need `node scripts/note-cards.mjs 255-fishbone-filled-by` |
| `sq/notes/2026-10-25-276-fixing-fast-learning.md` | "Ndreqja e shpejtë nuk është të mësuar i shpejtë." | the substantivised infinitive needs the article and an adverb | "Ndreqja e shpejtë nuk është të mësuarit e shpejtë." or "Të ndreqësh shpejt nuk do të thotë të mësosh shpejt." | grammar | none; card image as above (`276-fixing-fast-learning`) |
| `sq/notes/2026-10-13-191-where-to-look.md` vs `sq/insights/2026-10-13-when-the-dashboard-turns-red-before-you.md:99` | note: "Largësia mes të dyjave … dhe ta dish atë është detyra jote." essay: "Distanca mes të dyjave … dhe ta njohësh atë është puna jote." | the note quotes the essay but words it differently | note = essay: "Distanca mes të dyjave është vjetërsia e numrit, dhe ta njohësh atë është puna jote." | a quotation should be the quoted words | none (EN/DE notes match their essays) |
| `sq/reflections/2026-10-20-five-questions.md:44` | `Pronari të thotë: "Duhet të jesh i/e gatshëm të qëndrosh edhe pak më gjatë kur ka ngarkesë."` | "i/e" is a form convention, not speech | `"Duhet të jesh gati të qëndrosh edhe pak më gjatë kur ka ngarkesë."` | spoken Albanian; "gati" has no gender | none |
| `sq/insights/2026-10-13-when-the-dashboard-turns-red-before-you.md` (Shift Pulse sentence, before the card) | "[Shift Pulse] i vendos numrat e javës krah njëri-tjetrit, që një ditë e kuqe të ketë pranë dhjetë ditë histori…" | a week against ten days; the tool shows the last 7, 14 or 30 days or 8/12 weeks (`src/_includes/partials/shift-pulse.njk:9-14`) | "…i vendos krah njëri-tjetrit numrat e ditëve të fundit, që një ditë e kuqe të ketë pranë dhjetë ditë histori…" | internal consistency (P4-10) | already applied in EN and DE (commit `d4e2ae19`): "the numbers of recent days" / „die Zahlen der letzten Tage“ |

---

## 5. Terms (P4-08)

### 5.1 "Lidershipi" and "udhëheqja"

Ten uses of "lidership-" in nine reflections, against "udhëheqj-" in others, for the same idea:
`architects-of-smoke.md:16` ("kemi ngatërruar autoritetin me lidershipin"), `the-arithmetic-of-the-sun.md:32`
("kanë humbur çdo kontakt me lidershipin"), `the-bargain-with-a-year-of-life.md:38`, `the-perfect-alibi.md:34`,
`divide-and-rule-in-the-corridors.md:40`, `the-theatre-of-haste.md:40`, `two-leaders-one-floor.md:36` and `:38` (all
"Lidershipi i vërtetë…"), `cut-off-from-the-ground.md:24` ("Historia e lidershipit dhe e menaxhimit"),
`rules-do-not-stop-at-the-managers-door.md:480` ("asnjë fjalim mbi lidershipin").

- **Proposal:** "udhëheqja" everywhere ("Udhëheqja e vërtetë…", "me udhëheqjen", "Historia e udhëheqjes dhe e
  menaxhimit", "asnjë fjalim mbi udhëheqjen"), and add a row to FJALORI: leadership | udhëheqja | Führung.
- **Why:** one term for one thing (FJALORI's title); "udhëheqja" is the established Albanian word.
- **EN/DE:** no change ("leadership", „Führung“).

### 5.2 "Procedurë standarde operimi"

`the-myth-of-blind-sweat.md:10` ("procedurë standarde operimi"), `the-two-day-ultimatum.md:24` ("standarde operimi"),
`the-blame-culture.md:20` ("procedurën standarde të operimit", in the paragraph on surgery, where "operim" reads as a
surgical operation), `the-information-monopoly.md:22`, `the-victimhood-trap.md:30` ("procedurë operimi"),
`two-leaders-one-floor.md:14`, `the-perfect-alibi.md:28` ("proces të qartë operimi").

- **Proposal:** "procedurë standarde pune" (or "SOP" at first use: "procedurë standarde pune (SOP)"); "standarde
  pune"; "proces të qartë pune". In the surgery paragraph: "procedurën standarde të punës".
- **Why:** calque of "standard operating procedure"; "operim" in Albanian is first of all surgery.
- **EN/DE:** no change ("standard operating procedure", „Standardarbeitsanweisung“).

### 5.3 "Eskalimi" in *Kur ta zgjidhësh vetë…* (`sq/insights/2026-10-08-solve-it-or-escalate-it.md`)

FJALORI: "escalate | e çoj lart, ia përcjell lart | … | Shqip: pa 'eskaloj'." The essay uses the noun throughout: the
summary (`:8` "Një sistem i mirë eskalimi…"), description (`:9` "Eskalimi si sistem…"), deck (`:11`), the card title
(`:18` "Matrica e eskalimit për turnin"), and the body (`:38` introduces it: "ta çuar një problem më lart (eskalimi)";
then `:56, 58, 64, 74, 76, 88, 104, 122, 124`).

- **Option A (follow FJALORI):** summary "Një sistem i mirë për t'i çuar problemet lart nuk i mëson njerëzit të
  kërkojnë leje për çdo gjë…"; description "Çuarja e problemit lart si sistem, jo si temperament: …, pesë gjërat e
  një njoftimi të mirë lart dhe matrica e turnit për çuarjen lart."; card "Matrica: kur e çoj lart"; in the body,
  "çuarja lart" where it is a noun.
- **Option B (adapt FJALORI):** keep the noun "eskalimi", which `:38` defines on first use, and change FJALORI to "pa
  foljen 'eskaloj'; emri 'eskalimi' lejohet vetëm pasi shpjegohet herën e parë". Then nothing in the essay changes
  except the summary and description, which are shown on cards before the definition: "Një sistem i mirë për t'i
  çuar problemet lart…".
- **EN/DE:** none.

### 5.4 "Je duke punuar"

`divide-and-rule-in-the-corridors.md:46` "Nëse je duke punuar sot në një ambient…" → **"Nëse po punon sot në një
ambient…"**. Why: "jam duke + participle" is a calque of the English progressive; "po + present" is the standard form.
EN/DE: none.

### 5.5 Capital letter after the colon in titles

All 32 SQ reflection titles that have a colon capitalise after it (e.g. "Kultura e fajtorit: Pse gjuetia…", "Gracka e gjakut:
Kur firma familjare…", "Integriteti në errësirë: Çfarë bën…"); the other 15 have no colon. SQ insight titles never
capitalise after the colon. Albanian
orthography writes lower case after a colon unless a quotation or a proper name follows.

- **Proposal:** lower case after the colon in all reflection titles ("Kultura e fajtorit: pse gjuetia…"). A
  mechanical change, which can be done by script and tested, once the author agrees.
- **EN/DE:** EN is already in sentence case. DE capitalises after the colon in all reflection titles; by Duden, a
  dependent clause after a colon ("Warum die Jagd … nicht heilt") takes lower case, a full sentence takes a capital.
  Not changed in this phase (not in the brief's list); it would be a separate decision for DE.

---

## 6. Opinion stated as fact (P4-06)

Not a request for footnotes. In each case the sentence presents a conviction as an established fact; the proposal
marks it as conviction or experience, keeping the force.

| File:line | Original | Proposal | Why |
|---|---|---|---|
| `the-poison-paradox.md:34` | "Por historia botërore nuk njeh asnjë rast të vetëm ku një vend të ketë arritur mirëqenie afatgjatë përmes hajdutërisë së ndriçuar." | "Por unë nuk njoh asnjë vend që të ketë arritur mirëqenie afatgjatë përmes hajdutërisë së ndriçuar." | the universal claim is contested in development economics (growth with corruption in East Asia); the personal form is unassailable |
| `the-perfect-alibi.md:34` | "Por historia e menaxhimit na mëson një rregull të palëkundur: problemet në një organizatë rrjedhin gjithmonë nga lart poshtë, jo nga poshtë lart." | "Por përvoja më ka mësuar një rregull që e mbaj si të palëkundur: problemet në një organizatë rrjedhin nga lart poshtë, jo nga poshtë lart." | "history teaches" + "always" |
| `cut-off-from-the-ground.md:24` | "Historia e lidershipit dhe e menaxhimit na mëson se asnjë betejë e vërtetë nuk është fituar kurrë duke parë hartën nga çadra e komandantit pa njohur baltën e fushës." | "Besoj se asnjë betejë e vërtetë nuk fitohet duke parë hartën nga çadra e komandantit pa njohur baltën e fushës." (also answers 5.1) | "history teaches … never" |
| `the-blame-culture.md:20` | "Në aviacionin modern apo në kirurgji, kur ndodh një incident, askush nuk humb sekonda të çmuara duke kërkuar fyerjen apo poshtërimin e teknikut. Pyetja e parë që bën komisioni i auditimit është krejt tjetër: …" | "Në aviacionin modern, kur ndodh një incident, hetimi nuk kërkon fajtorin, por shkakun. Pyetja e parë që bën komisioni i hetimit është krejt tjetër: …", and for surgery: "dhe gjithnjë e më shumë edhe në kirurgji" | aviation has independent investigation boards whose aim is prevention, not blame (general knowledge; no source opened for this file); surgery has no such board and its blame culture is a known problem, so the pairing overstates |
| `the-perfect-alibi.md:18` | "Le ta ballafaqojmë këtë mit me një fakt të thjeshtë që askush nuk mund ta mohojë." | "Le ta ballafaqojmë këtë mit me diçka që e kam parë vetë shumë herë." | what follows (`:20`, Albanian workers abroad) is an observation, not a fact "no one can deny" |

**EN/DE would follow** each sentence (e.g. EN `the-poison-paradox.md:34` "But I know of no country that…", DE „Aber
ich kenne kein Land, das…“).

---

## 7. Generalisations about Albanians (P4-16)

These are polemic by an Albanian author, and legitimate as such. The proposals are about how they read out of context,
quoted in German or English.

- `the-great-albanian-paradox.md:18`: "Po t'i jepej mundësia, shqiptari do të provonte t'i jepte ryshfet edhe vetë
  kodit binar." **Proposal:** keep, and tag the piece as satire (a line under the title or in the description:
  "Satirë" / "Satire" / „Satire“). The sentence is the satire's punchline.
- `the-great-albanian-paradox.md:12`: "Ai po e stërviste atë rrjet nervor kolosal…" **Problem:** a user prompting a
  chatbot does not train it (technical error, in a piece about AI). **Proposal:** "Ai po e ngacmonte atë rrjet nervor
  kolosal…" or "Ai po e vinte në punë atë rrjet nervor kolosal…". **EN/DE would follow:** "He was training" → "He was
  coaxing"; „Er trainierte“ → „Er bearbeitete“.
- `the-perfect-alibi.md:16`: "**Shqiptarët nuk janë një popull që urren punën. Shqiptarët refuzojnë të pranojnë
  poshtërimin si kusht punësimi.**" **Option A:** keep (it defends Albanians against the owners' myth; in context it
  is not a stereotype but its refutation). **Option B:** "Shqiptarët që njoh nuk e urrejnë punën. Ata refuzojnë të
  pranojnë poshtërimin si kusht punësimi." EN/DE would follow.

---

## 8. The book (P6-01, P6-02)

The Albanian book is authoritative and was not touched; the proposals concern the translations, with the choice left
to the author.

### 8.1 Back cover: "çfarë ka mbetur brenda tij" (P6-01)

- **Original** (`scripts/book/sq.txt:451`, blurb): "Mall për Durrësin ndjek rininë, miqësitë, ikjet dhe kthimet e një
  njeriu në qytetin që e rriti. Jo për ta gjetur të paprekur, por për të njohur çfarë ka mbetur brenda tij."
- **Problem:** "tij" can be the man or the city (both masculine). EN reads the city ("to recognise what remains
  **within it**"); DE reads the man ("was **in ihm** blieb"). The translations say opposite things. The book's section
  32 "Qyteti brenda nesh" and 31.5 "I kam sjellë me vete" support the man reading.
- **Option A (the man, as DE; likely the intent):** SQ unchanged, or made unambiguous with "brenda vetes"; EN "but to
  recognise what remains within him"; DE unchanged.
- **Option B (the city, as EN):** SQ "…çfarë ka mbetur prej tij" (as the site lede already says); DE "…was von ihr
  blieb"; EN unchanged.
- **Where it follows:** `scripts/book/{en,de}.txt:451`, `src/_data/books/*.json` `blurb[1]`, and the PDF page 33 of
  each edition (regenerate with the book scripts). Not in this worker's files.

### 8.2 "bei Gjergj Kastrioti Skënderbeu" (P6-02)

- **Original** (`scripts/book/sq.txt:156`): "Viti i parë te Gjergj Kastrioti Skënderbeu ishte hyrja ime në një botë
  më të madhe." Natural in Albanian, where "te" + a school's name is usual.
- **Problem:** DE `de.txt:156` „Das erste Jahr bei Gjergj Kastrioti Skënderbeu…“: "bei" + a person's name means "at
  X's place", so the national hero becomes the host. EN "My first year at Gjergj Kastrioti Skënderbeu" is opaque but
  readable.
- **Option A:** first mention only, DE „Das erste Jahr an der Gjergj-Kastrioti-Skënderbeu-Schule…“, EN "My first
  year at the Gjergj Kastrioti Skënderbeu school…". The chapter title stays.
- **Option B:** keep both; the Albanian is authoritative and the name is a proper noun.
- **SQ:** no change proposed.
