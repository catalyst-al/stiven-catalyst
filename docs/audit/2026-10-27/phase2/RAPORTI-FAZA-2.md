# Raporti i Fazës 2: besueshmëria editoriale dhe botimet

27 tetor 2026. Dega `claude/gifted-pasteur-v7n2dw` (vazhdim i Fazës 1, nga `80ec8052` deri te commit-i i këtij
raporti). Asnjë PR, asnjë merge në `main`, asnjë deploy. Dega `claude/busy-cannon-mq0sqy` dhe checkpoint-i `605d0df`
të paprekura. Faza 3 nuk ka nisur.

## 1. Përmbledhje

| Kontroll | Rezultati |
| --- | --- |
| Build | `npx eleventy`: pa gabim |
| Testet | `npm test`: **1318 teste, 1318 kalojnë, 0 dështojnë, 0 të anashkaluara** (në fund të Fazës 1: 1269) |
| Shfletuesi (Chrome 153) | 32 udhëtime: 26 kalojnë, 6 dështojnë, po ato 6 të kërkimit me tastierë (CI-01, Faza 3), si në auditim dhe në Fazën 1 |
| PDF ↔ HTML | testi i ri `pdf-matches-html`: 294 PDF kundrejt faqeve të tyre, 0 mospërputhje |
| Identiteti vizual | asnjë CSS, planet, animacion apo skript lëvizjeje i ndryshuar (`git diff 80ec8052 --name-only` pa asnjë skedar të tillë) |
| Origjinalet shqip dhe libri | asnjë skedar nën `src/content/sq/`, asnjë tekst i librit i ndryshuar; vetëm propozime |
| Fakte biografike | asnjë i ndryshuar; vetëm lista e kontradiktave |

## 2. Vendimet e tua nga Faza 1, të zbatuara

| Vendimi | Çfarë u bë | Commit · test |
| --- | --- | --- |
| Room Inspection: pika kritike jep Fail menjëherë, kontrolli i paplotë kurrë Pass | Kodi e bënte tashmë; u shtua test që e mban rregullin. Udhëzuesi i mjeteve (ed. 8) e thotë njësoj në 3 gjuhë | `82bf4eaa`, `78fd1268` · owner-decisions, tools-guide-describes-tools |
| Coaching: kopje me etiketë kur përmbajtja ndryshon | Projekti nga backup-i shtohet si "{titulli} (versioni nga kopja e {data})", EN/DE/SQ | `68bd1260` · coaching-import, owner-decisions |
| Hoshin Kanri: butonat e dyfishtë | Butonat CSV/Excel të zonës së rezultateve u hoqën; mbeten ata të shiritit, që shkruajnë të njëjtin skedar | `de7fa091` · owner-decisions |
| Pragjet statistikore | `docs/THRESHOLDS.md`: çdo prag me vlerën, arsyen dhe testin. Minimumet e Site Compare tani në skedarin e të dhënave (3 gjuhë, test që përputhen); një konstante e vetme për 5S | `576834c4` |
| PIN-i | Minimumi 6 karaktere për PIN të ri. Pajisja e kyçur me PIN 4-shifror hapet ende me të; pas kësaj tab-i nuk e mban çelësin dhe kërkon PIN të ri, me shënim në 3 gjuhë | `e6617ab1` · work-lock-storage, work-lock, shfletuesi 2/2 |
| Team Sync Worker: mos e publiko | I papublikuar. Plani i migrimit, verifikimi i përputhshmërisë dhe kthimi mbrapsht: `docs/SYNC-WORKER-MIGRATION.md`. Worker-i në prodhim u lexua nga Cloudflare (vetëm lexim): është ai i `main` (versioni `cc107fc4`). Testi `sync-compat` ekzekuton kodin e prodhimit kundrejt atij të ri në çdo rend: 6/6, tri herë radhazi | `83b770ba` |

## 3. Management Review: regjistri i korrigjimeve, datat, metoda

**Gjetja kryesore, e verifikuar nga unë në historinë e git-it:** numrat 73–80 nuk ishin në `main` para merge-it
të 11 tetorit (`7b43e7c3`, ora 20:33). Kontrolli i tyre (`6e50b937`, `3565e02a`, `a8c070b3`) ishte në degën e PR-së
dhe hyri në `main` bashkë me ta. Pra versioni i parë online i nr. 74–77 dhe 79 ishte tashmë i kontrolluari: lexuesit
nuk panë kurrë tekstin e mëparshëm dhe nuk duhet shënim korrigjimi. Premisa e auditimit (E-01/P5-01) për këta numra
ishte e gabuar.

Çfarë ndryshoi (detajet, para → pas në 3 gjuhë: `management-review.md`):
- **Një burim i vetëm për korrigjimet** (`checked.issues`): numri "64" dhe lista e numrave të korrigjuar nuk shkruhen
  më me dorë. 11 numra ku shifra, viti ose baza ndryshoi më 12 tetor kanë tani shënim me datë që thotë çfarë
  ndryshoi, në faqe dhe në PDF: nr. 6, 8, 12, 14, 24, 25, 26, 29, 40, 59, 60.
- **Regjistër publik i korrigjimeve** në fund të arkivit (`#corrections`), më i riu i pari, me datë dhe lidhje.
- **Gabime citimi, të kontrolluara te burimi:** nr. 75 (WHO, viti i burimit 2024 → 2026), nr. 21 (shifrat 73 % / 7 %
  janë te njoftimi për shtyp i Deloitte, jo te kapitulli; "2023" i paverifikuar u hoq), edicioni special (PwC 34 %
  kundrejt 24 %, 2018–2025). Secili me shënim të 27 tetorit.
- **Datat reale:** nr. 41–80 dhe Nga terreni nr. 2 (ishin "nëntor 2026") dhe edicioni special (ishte "shtator 2026")
  tani mbajnë tetor 2026, muajin kur dolën online (nga `online.json`). Shënim me datë në arkiv dhe te "Si bëhet".
  - Origjinali (EN): "Issues 41 to 80 are the November 2026 edition, online since October: that is why 80 issues are
    here before November."
  - Tani: "Numbered issues in series of 40, each dated by the month it went online. Issues 1 to 80 … went online
    between 8 and 11 October 2026."
- **Metoda:** origjinali thoshte "Figures that could not be confirmed are not in the issue", por nr. 1 dhe 21 kishin
  shifra të tilla. Tani: "A figure not confirmed in what was read is marked so on its page, or left out." Nr. 1
  (70 → 77 %) shënohet si shifër e Bock-ut e cituar nga WEF, që nuk e pamë.
- **Kolofon** në kopertinën e pasme dhe në fund të tekstit të çdo botimi (MR, edicioni special, Nga terreni,
  traktati): "Redaktuar nga Stiven Janaqi, që përgjigjet për të; “redaksia” në këtë botim është ai. Tekstet,
  përkthimet, faqosja dhe kontrolli i shifrave … bëhen në seanca pune me Claude …"
- **PDF:** 288 PDF u printuan sërish me skriptet e repos, me autor dhe gjuhë në metadata; numri i faqeve i
  pandryshuar; pdftotext: 0 ndryshime nga të dhënat.
- **Traktati vëll. 4 (DE):** shënimi për 30/60/90 ditët tani "von keiner Studie belegt".

## 4. Deklarata se si bëhen botimet ("Si bëhet")

- Origjinali (EN): "… drafting and editing, the German and Albanian versions, checking figures …"
- Problemi: të nënkupton se çdo origjinal është anglisht; reflektimet dhe libri janë origjinale shqip (rreshti i
  botimit "Translated from the Albanian"; commit-et e reflektimeve "The Albanian original, unchanged").
- Tani (3 gjuhë): "… the versions in the other two languages (the reflections and the book are written in Albanian;
  their English and German versions are made this way) …". Commit `b4e59ecd` · test ai-disclosure.
- Rreshti i botimit të librit nuk u prek (propozim në §9).

## 5. Gjermanisht (Sie/du) dhe anglisht

Para → pas, rresht për rresht (229 rreshta): `german-english-edits.md`. Asnjë fakt nuk ndryshoi, prandaj pa shënim
publik.
- **36 reflektime gjermanisht:** narratori i thotë lexuesit "Sie"; ku "ti" shqip është i përgjithshëm, "man"; "du"
  mbetet vetëm në fjalë të cituara (8 përjashtime të listuara). Çdo ndryshim u krahasua me rreshtin shqip. Testi
  `register` dështon për çdo "du" tjetër. Shembull: "Stell dir eine Organisation vor" → "Stellen Sie sich eine
  Organisation vor".
- **Gramatikë dhe kalke gjermane:** "Fläche" për dyshemenë e punës, "Kleine Menschen" → "Kleingeister", etj.
- **Anglisht:** kalket e P4-10, thonjëzat tipografike, shënimi 173 rikthehet te "to jump to the solution" si në SQ/DE.
- 11 imazhe parapamjeje gjermane u bënë sërish (tituj me "Sie").

## 6. Shqip (ju/ti): vetëm propozime

Asnjë tekst shqip nuk u prek. Çdo propozim ka fjalinë origjinale, skedarin:rreshtin, problemin dhe dy opsione:
`albanian-proposals.md`. Kryesoret:
- **ju/ti** në rreth 50 fjali: opsioni A mban "Më lejoni…" si formulë; opsioni B "Më lër…"; në të dyja "Shikoni,
  Përfytyroni…" bëhen ti.
- **Pazari me një vit jetë:** "1.000 lekë të vjetra në ditë pune" nuk del (30.000 në muaj janë rreth 1.154 për ditë pune
  në javë 6-ditore); bileta e autobusit në Tiranë është 40 lekë; "je më i varfër se ditën e parë" nuk qëndron për
  pagën e pjesës motër. EN dhe DE e kanë korrigjuar në heshtje dhe e kanë hequr "të vjetra".
- **Pesë pyetje:** "katërmbëdhjetë ditë, sipas ligjit": Kodi i Punës, neni 92(2), si ndryshoi me ligjin 91/2024, jep të
  paktën 22 ditë pune.
- Terma: "lidershipi"/"udhëheqja", "procedurë standarde operimi", "eskalimi", shkronja e madhe pas dy pikave.

## 7. Udhëzuesi i mjeteve, botimi 8, dhe kontrolli HTML ↔ PDF

- Botimi 8 në 3 gjuhë, me "Çfarë ndryshoi në botimin 8": Time Study (koha standarde = mediana × vlerësimi × (1 +
  shtesa)), KPI Diagnostic (hipotezë kryesore për ta verifikuar, emërtohet vetëm me 4 nga 6 dhe 2 pikë para), ATS CV
  (JSON Resume, përputhja sipas kuptimit, "një tregues, jo një parashikim"). Plus Room Inspection, 5S, Site Compare,
  Shift Handover. Botimi 7 ruhet si u printua. Testi `tools-guide-describes-tools` e mban tekstin te kodi.
- Gjatë rishikimit korrigjova një fjali që binte ndesh me vendimin tënd për Room Inspection (shih §2).
- Faqja dhe karta e KPI Diagnostic nuk premtojnë më "ku u bë procesi i paqëndrueshëm".
- `pdf-matches-html`: 294 PDF (240 numra, edicioni special, Nga terreni, 39 traktat, udhëzuesi, libri) dhe 21
  botime të arkivuara të udhëzuesit; titulli, numri, muaji, faqet, korrigjimet, çdo bllok teksti. 0 mospërputhje. U
  provua që kap gabimet: një shifër dhe numri i faqeve të nr. 80 të ndryshuara e rrëzuan testin.

## 8. Kronologjia profesionale: lista, pa ndryshime

`timeline-contradictions.md`: 119 pohime në 13 grupe me citat të saktë dhe rresht, 7 kontradikta, 4 mospërputhje
gjuhe, 13 vende të paqarta. Citimet i kontrollova me mostër. Përveç P4-02:
- nata kur ra sistemi tregohet tri herë, në vite dhe role të ndryshme;
- revista Nga terreni thotë se sot je Night Auditor, faqja "Rreth meje" thotë Night Manager që nga nëntori 2025;
- postimet e LinkedIn të planifikuara për dhjetor në `docs/` përsërisin versionet e korrigjuara.

Pyetjet për ty janë në fund të §2 të atij skedari (gjashtë).

## 9. Vendime që presin ty

1. Kronologjia: përgjigjet e gjashtë pyetjeve; pastaj korrigjohen vendet me shënim me datë në 3 gjuhë.
2. Shqip: ju/ti (A ose B); *Pazari*; *Pesë pyetje*; termat; titujt pas dy pikave.
3. Libri: rreshti i botimit (p.sh. "Përkthyer me ndihmën e AI, rishikuar nga autori", nëse është e vërtetë);
   kopertina e pasme B-01/P6-01 ("brenda tij": njeriu apo qyteti?).
4. Edicioni special: "tetor 2026" (tani) apo emri "shtator 2026" me rreshtin "online që nga 4 tetori".
5. "Redaksia/the editors" brenda numrave (184 vende EN): mbetet, e shpjegon kolofoni; apo rishkruhet "unë/redaktori".
6. Shënimi "çdo shifër u kontrollua sërish më 12 tetor" (64 numra) të printohet edhe në PDF?
7. Përshkrimet e KPI Diagnostic (titulli SEO) dhe ATS CV ("fehlerfrei", "shumica e punëdhënësve…" pa burim).
8. Team Sync: miratimi i hapit 1 (Worker-i) sipas planit.
9. Pas merge-it në `main`: `node scripts/online-dates.mjs` (datat "edited/modified" llogariten nga historia e `main`;
   e provova në degë dhe e ktheva mbrapsht, sepse do jepte data të pavërteta për faqen live).

## 10. Mbetet për Fazën 3 (e pa nisur)

Printimi (T-09, T-10, T-24), animacionet dhe planetët (M-01 – M-06), leximi me zë (P-02 – P-04), 6 dështimet e
kërkimit në Chrome (CI-01), Chromium i vjetër në CI (CI-02).

## 11. Commit-et e Fazës 2

`git log --oneline 80ec8052..HEAD` (31 commit). Puna e tre agjentëve u mor me cherry-pick nga degët e tyre lokale
pa konflikte dhe u rishikua para se të pranohej (mostra e ndryshimeve gjermane, verifikimi i historisë për nr.
73–80, fjalia e Room Inspection te udhëzuesi, kontroll që asnjë skedar shqip, libër, CSS apo animacion nuk u prek).
