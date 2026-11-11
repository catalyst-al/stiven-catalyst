# Plani i integrimit: “Sot” dhe “Kontrolli i dëmeve”

**Gjendja:** plan i miratuar si bazë e integrimit më 11 nëntor 2026. Integrimi në repo nuk ka nisur.
**Fusha:** piloti për Shefin e turnit. Ndërfaqja e re ndizet fillimisht vetëm te Kontrolli i dëmeve, me hapat dhe shkaqet e magazinës.

Çfarë ka kjo dosje:

| Skedari | Çfarë është |
| --- | --- |
| `PLANI.md` | Ky dokument. |
| `prototip-sot.html` | Prototipi i ngrirë. Një skedar i vetëm, pa lidhje me kodin e faqes, vetëm me të dhëna shembull. Hapet në çdo shfletues. `#panel=0&scen=empty` e hap pa panelin e demonstrimit, në skenarin bosh. |
| `prova/skenari-i-plote.cjs` | Bosh → turni → regjistrim → veprim → kthim te burimi → dorëzim → mbyllje. |
| `prova/dy-turne-mesnata-burimi.cjs` | Dy turne radhazi, mesnata, ndryshim turni me formë të papërfunduar, “Hap burimin”. |
| `prova/dy-drafte-njekohesisht.cjs` | Dy turne me drafte njëkohësisht dhe bllokimi i “Sille këtu”. |
| `prova/dy-pajisje.cjs` | Simulim i dy pajisjeve të pasinkronizuara me kodin e vërtetë të sinkronizimit (lexon `src/js/team-sync.js`, nuk ndryshon asgjë). |

Të katërta nisen nga rrënja e repo-s, pas `npm ci`, me `node docs/plan-sot-2026-11-11/prova/<emri>.cjs`. Tri të parat hapin prototipin në shfletues me Playwright; e katërta nuk ka nevojë për shfletues.

---

## 1. Vendimet e miratuara

1. **Një mekanizëm mbylljeje**, ai i Dorëzimit të turnit, për të gjithë faqen.
2. **Pas mbylljes nuk ka turn aktiv.** Turni pasues niset shprehimisht.
3. **Mbartja e çështjeve të hapura** ndodh vetëm kur përdoruesi nis turnin pasues në të njëjtin vend pune, vetëm një herë. Hapja e historikut nuk mbart. Rrjedha punon edhe nga faqja e Dorëzimit, pa “Sot”.
4. **Turni dhe data operative** zgjidhen shprehimisht dhe nuk ndryshojnë në mesnatë.
5. **Turni aktiv është cilësim i pajisjes:** jashtë sinkronizimit të ekipit dhe jashtë kopjes rezervë.
6. **Draftet** nuk sinkronizohen, por hyjnë në kopjen rezervë dhe rikthehen pa aktivizuar turn.
7. **Një draft për turn.** Asnjë draft nuk kalon vetë te një turn tjetër. “Sille këtu” bllokohet kur forma aktuale ka punë të papërfunduar dhe të dy draftet mbeten.
8. **Mbyllja pa dorëzim lejohet** me paralajmërim dhe e ruan draftin. Mbyllja nuk dërgon dhe nuk e shënon dorëzimin si të dërguar.
9. **Një filtër në të njëjtën kohë** gjatë pilotit.
10. **Ndërfaqja e re vetëm te Kontrolli i dëmeve.** Kontrolli i plotësisë dhe Regjistri i Night Audit përdorin të njëjtin `defect-log.njk`, por mbeten siç janë.
11. **Hoteli te dëmet shtyhet.** Hapat dhe shkaqet e hotelit në prototip janë shembull, jo vendim.

---

## 2. Struktura e ngrirë e ndërfaqes

Prototipi është referenca. Në pak rreshta:

- **Gjithmonë të dukshme:** Sot · + Regjistro · Veprime (me numër) · Dorëzimi · Catalyst, dhe çipi i turnit me datën operative.
- **“Sot”:** Tani (faza zgjidhet nga përdoruesi: Fillim, Gjatë, Fund) · Kërkon vëmendje · Turni deri tani · Vazhdo · turnet e mbyllura.
- **Kontrolli i dëmeve:** kokë kompakte, forma e para, “Fillo këtu” me fjalinë që ndjek filtrin, shiriti “Hapi tjetër” me gjashtë dalje jo të detyrueshme, regjistri me veprim për një rresht, skedat Puno · Mëso · Të dhënat.
- **Çdo kalim** tregon çfarë mbart dhe ka kthim te burimi.

---

## 3. Verifikimet para hapit 3

Të tria u bënë duke lexuar kodin e repo-s më 11 nëntor 2026 (commit `b70bd8f`). E treta u provua edhe me simulim.

### 3.1 Identiteti i vendit të punës

Çfarë ka sot:

- Dorëzimi mban **një dorëzim aktiv për shfletues dhe gjuhë** (`current` te `sc-shift-handover`, `-de`, `-sq`). Nuk ka dy vende pune njëkohësisht.
- Çdo dorëzim ka `template` (`warehouse`, `hotel`, `delivery`; vlerë e kontrolluar) dhe `area` (tekst i lirë, opsional, pa normalizim).
- Profili i vendit të punës (`sc-workplace`, `workplace.js`) ka një `site` me tekst të lirë. **Dorëzimi nuk e lexon profilin.** Nga dy mjetet e pilotit, vetëm Kontrolli i dëmeve e lexon, për turnet dhe objektivin.

Përfundimi: **sot nuk ekziston një identitet i qëndrueshëm i vendit të punës.** `area` mund të jetë bosh ose e shkruar ndryshe (“Dock A”, “dock a”).

Rregulli për pilotin:

- Vendi i punës = kopja e dorëzimit në atë gjuhë + `template` + `area` e normalizuar (shkronja të vogla, hapësira të mbledhura, si `issueKey` që mjeti e ka tashmë).
- `area` bosh përputhet vetëm me `area` bosh.
- Kur vendi nuk përputhet, asgjë nuk mbartet dhe çështjet mbeten në pritje.
- Dritarja e nisjes së turnit tregon cilat çështje do të mbarten, para se të konfirmohet.

### 3.2 Renditja e turneve

Çfarë ka sot:

- Dorëzimi ka **listë të ngulitur prej tri turnesh për gjuhë** (`shiftHandover.json`): Early, Late, Night · Früh, Spät, Nacht · Mëngjes, Pasdite, Natë. Një turn i panjohur kthehet me forcë te i pari (`clean`).
- Renditja është renditja e listës. `nextShift` merr turnin tjetër dhe kalon te data pasuese vetëm pas të fundit. Pra **turni i natës mban datën kur nis**, njësoj si data operative e prototipit.
- Kontrolli i dëmeve përdor **turnet e profilit kur ka** (tekst i lirë, në rendin e shkruar), përndryshe listën e vet.
- Dorëzimi i mbush numrat nga regjistri vetëm kur emri i turnit përputhet shkronjë për shkronjë (`row.shift === h.shift`).
- Askund nuk ruhen orët e turneve.

Përfundimi: **dy mjetet e pilotit mund të kenë lista të ndryshme turnesh.** Me turne të personalizuara te profili, regjistri dhe dorëzimi nuk përputhen dhe numrat nuk mbushen.

Rregulli për pilotin:

- Turni aktiv përdor **tri turnet e dorëzimit në gjuhën e faqes**.
- Piloti kërkon që profili të mos ketë turne të personalizuara, ose t'i ketë të njëjta me këto tri. Përndryshe ndërfaqja e re te Kontrolli i dëmeve nuk ndizet dhe faqja thotë pse.
- “Pasues” = datë operative dhe pozicion në listë më të vonë se turni i mbyllur. Kapërcimi i një turni lejohet; çështjet shkojnë te pasuesi i parë që niset.
- Një turn më i hershëm se i mbylluri nuk merr asgjë.

### 3.3 Dy pajisje pa u sinkronizuar

Çfarë ka sot:

- Dorëzimi sinkronizohet kur mjeti është i ndezur për ekipin. Vlera bashkohet **fushë për fushë në nivelin e sipërm**: `current`, `history` dhe `received` secila si një e tërë (`mergeValue` te `team-sync.js`).
- Kur të dyja pajisjet e kanë ndryshuar të njëjtën fushë, secila mban të vetën. Pajisja që sinkronizon e fundit fiton, dhe tjetra e merr atë në sinkronizimin e saj të radhës.
- Çështjet e dorëzimit **nuk kanë `id`**. Për dorëzimet e marra nga një pajisje tjetër mjeti i njeh nga teksti, përgjegjësi dhe afati, dhe i shënon rastet e paqarta (`mergeIssues`).

Simulimi (`prova/dy-pajisje.cjs`): pajisjet A dhe B nisin të dyja turnin pasues dhe mbartin të njëjtën çështje. A e shënon të zgjidhur dhe shton një çështje të vetën; B shton një tjetër. Rendi i sinkronizimit: A, B, A.

| Pyetja | Rezultati |
| --- | --- |
| A dyfishohet çështja e mbartur? | Jo. Mbetet një kopje. |
| A mbijeton puna e A-së? | Jo. Dorëzimi i A-së zëvendësohet i tëri nga ai i B-së. |
| A përfundojnë njësoj të dyja? | Po. |

Përfundimi: **rreziku i vërtetë nuk është dyfishimi, por humbja e heshtur e punës së njërës pajisje.** I njëjti rrezik ekziston sot, pa asnjë ndryshim, kur dy pajisje mbyllin të njëjtin turn. Sinkronizimi bën një pikë rikthimi para çdo zëvendësimi, prandaj puna e humbur mund të nxirret me dorë.

**“Vetëm një herë” nuk garantohet nga shenja në historik.** Ajo dështon në tri raste:

1. Pajisja e dytë nuk ka sinkronizuar dhe e sheh ende hyrjen “në pritje”.
2. Një kopje rezervë ose pikë rikthimi e sjell mbrapsht hyrjen “në pritje”.
3. Sinkronizimi e zëvendëson `history` të tërë, bashkë me shenjën.

Garancia ndërtohet në tri shtresa:

1. **Identiteti i mbylljes.** Çdo mbyllje merr një `closeId`. Dorëzimi i ri shënon `carriedFrom: closeId`.
2. **Kontrolli te destinacioni.** Para mbartjes, mjeti kontrollon nëse dorëzimi aktiv ose ndonjë hyrje e historikut e ka tashmë atë `closeId`. Pastaj çdo çështje krahasohet me ato që janë aty, me rregullin ekzistues të `mergeIssues`: e njëjta çështje nuk shtohet, rasti i paqartë tregohet dhe nuk shtohet vetë.
3. **Kufizimi i pilotit, më poshtë.**

Shtresat 1 dhe 2 e mbajnë “vetëm një herë” në një pajisje, edhe pas rikthimit nga kopja rezervë. Nuk e mbajnë ndërmjet dy pajisjeve të pasinkronizuara.

### 3.4 Kufizimi i pilotit: një pajisje për nisjen dhe mbylljen e turnit

> Gjatë pilotit, **nisja dhe mbyllja e turnit për një vend pune bëhen nga një pajisje e vetme.**
> Pajisjet e tjera mund të regjistrojnë dëme; rreshtat e regjistrit bashkohen pa humbje.
> Kufizimi nuk mund të zbatohet teknikisht, sepse nuk ka server që ta dijë cila pajisje e nisi turnin. Është rregull pune.
> Nëse dy pajisje e nisin ose e mbyllin të njëjtin turn pa u sinkronizuar, dorëzimi i njërës zëvendësohet nga ai i tjetrës në sinkronizimin e radhës. Çështjet nuk dyfishohen. Puna e zëvendësuar gjendet te pika e rikthimit e bërë para atij sinkronizimi.

Kufizimi hiqet vetëm nëse dorëzimi bashkohet për hyrje dhe për çështje, jo si e tërë. Kjo është punë te sinkronizimi dhe nuk është pjesë e këtij plani.

---

## 4. Mbyllja dhe mbartja

Ndryshimet te `shift-handover.js` kundrejt sjelljes së sotme:

| Sot | Pas hapit 3 |
| --- | --- |
| Refuzon mbylljen kur dorëzimi është bosh. | E lejon, me paralajmërim. Historiku merr hyrjen me gjendjen “nuk është shkruar”. |
| Pas mbylljes krijon vetë dorëzimin e turnit pasues dhe i mbart çështjet. | Pas mbylljes nuk ka turn aktiv. Çështjet presin. |
| Turni dhe data pasuese llogariten dhe vendosen. | Llogaritja mbetet si propozim në dritaren e nisjes; përdoruesi e konfirmon ose e ndryshon. |

Mbyllja:

- **Ruan:** përmbajtjen e dorëzimit ashtu siç është, gjendjen e tij, datën operative, turnin, orën e vërtetë të mbylljes dhe `closeId`.
- **Gjendjet:** ato që mjeti ka (draft, gati, ndarë, marrë, konfirmuar), plus shenja “ndryshuar pas ndarjes”.
- **Nuk bën:** nuk dërgon, nuk e shënon si të dërguar, nuk nis turnin pasues.
- **Drafti i formës** mbetet draft i turnit të mbyllur.
- **Turni i mbyllur** nuk rihapet.

Nisja e turnit pasues:

- Bëhet nga faqja e Dorëzimit ose nga “Sot”; të dyja thërrasin të njëjtin funksion dhe vendosin turnin aktiv të pajisjes.
- Mbart vetëm kur vendi i punës përputhet (3.1) dhe turni është pasues (3.2).
- Mbart një herë, sipas tri shtresave të 3.3.
- Hapja e historikut është vetëm lexim.

---

## 5. Struktura e burimit të veprimeve (`origin`)

Vendoset në hapin 1, para çdo ndryshimi të ndërfaqes. Fusha ekzistuese `source` mbetet.

| Fusha | Vlera | Shënim |
| --- | --- | --- |
| `v` | `1` | versioni i strukturës |
| `tool` | `damage-control` | e njëjta si `source` |
| `lang` | `en`, `de`, `sq` | çdo gjuhë mban regjistrin e vet; vlerat e filtrit janë fjalë të asaj gjuhe |
| `kind` | `period`, `filter`, `row` | një nga tri |
| `from`, `to` | `2026-11-05`, `2026-11-11` | gjithmonë të dyja, ISO |
| `filter` | `{ field, value }` | vetëm për `filter`; `field` është `cause`, `stage` ose `shift` |
| `row` | `{ id, date, shift, stage, cause, units, twins }` | vetëm për `row`; kopje e rreshtit |

Rregullat:

- **Vlefshmëria:** `actions-store.js` e pranon `origin` vetëm të plotë. Një `origin` i dëmtuar hidhet; veprimi mbetet.
- **Udhëtimi:** me shënimin e fshehur të skedës (`ToolKit.actionHandoff`), kurrë në adresë. “Hap burimin” mbart vetëm `id`-në e veprimit.
- **Dublikatat:** për një rresht me `id`, `id` përdoret si `ref`, mekanizëm që lista e ka.
- **Burimi që mungon:** kur regjistri është pastruar ose veprimi vjen nga një pajisje pa atë regjistër, mjeti hapet me shënimin “burimi nuk gjendet në këtë pajisje”.

### Rreshtat e vjetër të dykuptimtë

Rreshtat e regjistrit sot nuk kanë `id`, dhe sinkronizimi i njeh rreshtat pa `id` nga përmbajtja e plotë (`mergeRows`).

- **Rreshtat e vjetër nuk marrin `id` me vonesë.** Një `id` e shtuar në një pajisje e ndryshon përmbajtjen; sinkronizimi do ta shihte si rresht të ri dhe do ta dyfishonte.
- **Rreshtat e rinj** marrin `id` në krijim.
- **Veprim nga një rresht pa `id`:** `origin.row` ruan kopjen e fushave, `id` bosh dhe `twins`, numrin e rreshtave identikë në çastin e krijimit.

“Hap burimin” për një rresht pa `id` kërkon sipas fushave:

| Gjen | Tregon |
| --- | --- |
| Një rresht | E shënon si burimin. |
| Disa rreshta identikë | I shënon të gjithë si “një nga këta n rreshta”. Nuk zgjedh asnjërin. |
| Asnjë | Hap periudhën e ruajtur me “rreshti nuk gjendet më”. |

Dublikatat e veprimeve për rreshta pa `id` ndjekin rregullin ekzistues: titull dhe burim i njëjtë.

---

## 6. Turni aktiv, draftet dhe kopja rezervë

- **Turni aktiv:** çelës që mbaron me `-ui`. Sinkronizimi i anashkalon vetë këta çelësa (`NOT_TOOL` te `team-sync.js`). Shtohet te lista `SKIP` e `work-backup.js`, që të mos hyjë në kopjen rezervë.
- **Draftet:** çelës tjetër që mbaron me `-ui`, jashtë sinkronizimit. Nuk shtohet te `SKIP`, prandaj hyn në kopjen rezervë.
- **Çelësi i një drafti:** data operative dhe turni. Një draft për turn.

Kontrolli i drafteve gjatë rikthimit:

- **Forma:** skedari refuzohet kur hyrja e drafteve nuk ka formën e pritur, si për regjistrat sot.
- **Turni aktiv:** nuk është në skedar dhe nuk preket. Asnjë draft i rikthyer nuk e aktivizon turnin e vet.
- **Si shfaqen:** drafti i një turni tjetër del si “formë e papërfunduar nga…”, me “Kthehu”, “Sille” dhe “Hidhe”.
- **Turn i mbyllur:** drafti i tij nuk ofron “Kthehu”.
- **Përplasja:** kur drafti i rikthyer i takon turnit aktiv dhe forma në ekran ka punë, rikthimi nuk e mbishkruan. Përdoruesi i sheh të dy dhe zgjedh. Pika e rikthimit e mban gjendjen e mëparshme.

---

## 7. Hapat

Çdo hap është një PR, në tri gjuhët, me testet e veta.

| Hapi | Çfarë sjell | Skedarët kryesorë |
| --- | --- | --- |
| 1. Burimi i veprimeve | `origin`, `id` për rreshtat e rinj, rregullat e rreshtave të vjetër. Asnjë ndryshim i dukshëm. | `actions-store.js`, `tool-kit.js`, `docs/DATA-FORMATS.md` |
| 2. Turni aktiv dhe draftet | Dy çelësat e rinj, rregullat e kopjes rezervë dhe të rikthimit. | modul i ri, `work-backup.js` |
| 3. Mbyllja e përbashkët | Mbyllje pa dorëzim, pa turn aktiv pas saj, nisje e shprehur, mbartje një herë, “ndryshuar pas ndarjes”. | `shift-handover.js` |
| 4. Kontrolli i dëmeve | Ndërfaqja e re me çelës vetëm për këtë mjet, vetëm magazina. | `defect-log.njk`, `defect-log.js`, `tool-kit.js`, `damageControl.json` |
| 5. “Hap burimin” | Lista e veprimeve rikthen periudhën, filtrin ose rreshtin. | `action-tracker.js`, `defect-log.js` |
| 6. Faqja “Sot” | Faqja e punës, mbi të njëjtën mbyllje. Hyrja te Catalyst. | faqe e re, `families.json`, `signals.js` |
| 7. Verifikimi para/pas | Krahasimi i periudhës së ruajtur me atë pas veprimit, me vëllimet e vërteta. | `action-tracker.js`, `defect-log.js` |

Hapat 1 dhe 2 nuk varen nga njëri-tjetri. Hapi 3 kërkon hapin 2. Hapat 5 dhe 7 kërkojnë hapat 1 dhe 4.

---

## 8. Çfarë është provuar dhe çfarë pret

### Provuar në prototip

Me skriptet e dosjes `prova/`, në desktop (1366 px) dhe telefon (390 px), me panelin të fshehur, pa gabime:

- Skenari i plotë: bosh → turni → regjistrim → veprim → kthim te burimi → dorëzim → mbyllje.
- Forma e papërfunduar mbetet gjatë navigimit brenda të njëjtit turn.
- Burimi i veprimit ruhet saktë për tri rastet: pa filtër, me filtër, nga një rresht.
- Përmbledhja e filtrave nuk bie ndesh me veten për shkak, hap dhe turn.
- “Hap burimin” rikthen periudhën dhe filtrin e ruajtur, dhe çipi kthen te periudha e sotme.
- Para/pas llogaritet nga rreshtat e dy periudhave me të njëjtin filtër.
- Dy turne radhazi: dorëzimi i të parit ruhet i plotë dhe lexohet nga i dyti; dorëzimi i të dytit nis bosh.
- Mesnata: data operative dhe turni nuk ndryshojnë; regjistrimi merr datën operative; ora e mbylljes ruhet veçmas.
- Një turn i mbyllur nuk rihapet.
- Ndryshim turni me formë të papërfunduar: forma e turnit të ri del bosh, me njoftim.
- Dy turne me drafte njëkohësisht: asnjëri nuk mbishkruhet; “Sille” mungon derisa forma aktuale të pastrohet.
- Mbyllja pa dorëzim paralajmëron dhe nuk thotë askund që dorëzimi është dërguar.
- Shenja “ndryshuar pas demonstrimit të dërgimit” del sapo ndryshon një fushë.

Çfarë **nuk** tregon prototipi: ruajtjen në shfletues, sinkronizimin, kopjen rezervë, tri gjuhët, mbartjen e çështjeve, dhe mjetet e vërteta pas kalimeve (5 Whys, Pareto, karta e kontrollit, dorëzimi janë ekrane demonstrimi).

### Verifikuar në kodin e repo-s

- Identiteti i vendit të punës, renditja e turneve dhe sjellja e dy pajisjeve (pjesa 3).
- Dorëzimi ka tashmë mbyllje, historik dhe gjendje transferimi.
- Rreshtat e regjistrit nuk kanë `id`; sinkronizimi i njeh nga përmbajtja.
- Kopja rezervë merr çdo çelës `sc-` që nuk është te `SKIP`; sinkronizimi anashkalon çelësat `-ui`.

### Pret verifikim gjatë integrimit

| Çfarë | Në cilin hap |
| --- | --- |
| `origin` kalon i plotë nëpër shënimin e skedës, listën, sinkronizimin dhe kopjen rezervë. | 1 |
| Rreshtat e rinj me `id` dhe të vjetrit pa `id` bashkohen pa dyfishim mes dy pajisjeve. | 1 |
| Tri përfundimet e “Hap burimin” për rreshta pa `id`. | 1, 5 |
| Turni aktiv mungon vërtet në kopjen rezervë dhe në sinkronizim; draftet janë në kopjen rezervë dhe mungojnë në sinkronizim. | 2 |
| Rikthimi i drafteve: forma e gabuar, turni i mbyllur, përplasja me formën në ekran. | 2 |
| Turni aktiv mes gjuhëve: a ruhet si pozicion në listë apo si fjalë. | 2 |
| Mbyllja pa dorëzim dhe nisja e shprehur nga faqja e Dorëzimit, pa “Sot”. | 3 |
| Mbartja një herë: nisje e përsëritur, rikthim nga kopja rezervë, vend pune i ndryshëm, turn jo pasues, çështje e paqartë. | 3 |
| Test që dokumenton sjelljen e dy pajisjeve (3.3), që kufizimi i pilotit të mos mbetet vetëm në letër. | 3 |
| Profil me turne të personalizuara: ndërfaqja e re nuk ndizet dhe thotë pse. | 4 |
| Kontrolli i plotësisë dhe Regjistri i Night Audit nuk ndryshojnë. | 4 |
| Tri gjuhët, aksesueshmëria, puna pa internet, kyçja me PIN, modaliteti në terren. | 4, 5, 6 |
| Para/pas me vëllimet e ruajtura të çdo periudhe dhe me periudha pa vëllim. | 7 |

---

## 9. Jashtë këtij plani

- Bashkimi i dorëzimit për hyrje dhe për çështje te sinkronizimi, që do ta hiqte kufizimin e një pajisjeje.
- Kontrolli i dëmeve për hotelin.
- Ndërfaqja e re te Kontrolli i plotësisë dhe Regjistri i Night Audit.
- Regjistrimi nga “+” pa e hapur mjetin.
- Dy filtra njëkohësisht.
