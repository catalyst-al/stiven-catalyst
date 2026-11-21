# Plani i integrimit: “Sot” dhe “Kontrolli i dëmeve”

**Gjendja:** plan i miratuar si bazë e integrimit më 11 nëntor 2026. Bërë deri tani: pjesët 1a dhe 1b të hapit 1 (12 nëntor), hapi 2 (14 nëntor) dhe hapi 3 (15 nëntor). Hapi 3 e ndryshon faqen e Dorëzimit; pjesa 3.7 thotë si u plotësua çdo kriter dhe çfarë mbetet e hapur. Hapi 1c pret. Hapat 4–7 nuk kanë nisur (pjesa 7).
**Saktësimi i fundit:** kufizimi i pilotit dhe garancia “vetëm një herë” (pjesët 3.3–3.6), me kriteret e pranimit për hapin 3.
**Fusha:** piloti për Shefin e turnit. Ndërfaqja e re ndizet fillimisht vetëm te Kontrolli i dëmeve, me hapat dhe shkaqet e magazinës.

Çfarë ka kjo dosje:

| Skedari | Çfarë është |
| --- | --- |
| `PLANI.md` | Ky dokument. |
| `prototip-sot.html` | Prototipi i ngrirë. Një skedar i vetëm, pa lidhje me kodin e faqes, vetëm me të dhëna shembull. Hapet në çdo shfletues. `#panel=0&scen=empty` e hap pa panelin e demonstrimit, në skenarin bosh. |
| `prova/skenari-i-plote.cjs` | Bosh → turni → regjistrim → veprim → kthim te burimi → dorëzim → mbyllje. |
| `prova/dy-turne-mesnata-burimi.cjs` | Dy turne radhazi, mesnata, ndryshim turni me formë të papërfunduar, “Hap burimin”. |
| `prova/dy-drafte-njekohesisht.cjs` | Dy turne me drafte njëkohësisht dhe bllokimi i “Sille këtu”. |
| `prova/dy-pajisje.cjs` | Dy pajisje të pasinkronizuara që nisin të njëjtin turn, me bashkimin e vërtetë të sinkronizimit (`src/js/team-sync.js`). |
| `prova/sinkronizimi-pa-dorezimin.cjs` | Sinkronizim i plotë mes dy pajisjeve, me dorëzimin jashtë dhe dëmet brenda. Kodi i vërtetë, server i rremë. |
| `prova/id-e-rreshtave.cjs` | Çfarë ndryshon te sinkronizimi kur rreshtat e dëmeve kanë `id`, në shtatë raste. Kodi i vërtetë, server i rremë. |
| `prova/rikthimi-nga-backup.cjs` | Rikthimi nga kopja rezervë para dhe pas mbartjes. Kopja rezervë është kodi i vërtetë; mbartja është model i planit. |

Të gjitha nisen nga rrënja e repo-s, pas `npm ci`, me `node docs/plan-sot-2026-11-11/prova/<emri>.cjs`. Tri të parat hapin prototipin në shfletues me Playwright; tri të tjerat lexojnë kodin e repo-s pa e ndryshuar dhe nuk kanë nevojë për shfletues.

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

Të gjitha u bënë duke lexuar kodin e repo-s më 11 nëntor 2026 (commit `b70bd8f`). Pjesët 3.3–3.5 u provuan edhe me skripte që e nisin atë kod pa e ndryshuar.

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

- Dorëzimi **nuk sinkronizohet vetë**. Nuk është te mjetet e ndezura që në fillim (`DEFAULT_ON` te `team-sync.js`); Kontrolli i dëmeve është. Dorëzimi sinkronizohet vetëm kur dikush e ndez me dorë te lista e mjeteve të ekipit, në atë pajisje.
- Kur është i ndezur, vlera bashkohet **fushë për fushë në nivelin e sipërm**: `current`, `history` dhe `received` secila si një e tërë (`mergeValue`). Dorëzimi aktiv dhe historiku janë fusha të ndara, prandaj mund të vijnë nga pajisje të ndryshme.
- Kur të dyja pajisjet e kanë ndryshuar të njëjtën fushë, secila mban të vetën. Pajisja që sinkronizon e fundit fiton, dhe tjetra e merr atë në sinkronizimin e saj të radhës.
- Çështjet e dorëzimit **nuk kanë `id`**. Për dorëzimet e marra nga një pajisje tjetër mjeti i njeh nga teksti, përgjegjësi dhe afati, dhe i shënon rastet e paqarta (`mergeIssues`).

Simulimi me dorëzimin të ndezur (`prova/dy-pajisje.cjs`): pajisjet A dhe B nisin të dyja turnin pasues dhe mbartin të njëjtën çështje. A e shënon të zgjidhur dhe shton një çështje të vetën; B shton një tjetër. Rendi: A, B, A.

| Pyetja | Rezultati |
| --- | --- |
| A dyfishohet çështja e mbartur? | Jo. Mbetet një kopje. |
| A mbijeton puna e A-së? | Jo. Dorëzimi i A-së zëvendësohet i tëri nga ai i B-së. |
| A përfundojnë njësoj të dyja? | Po. |

Përfundimi: **rreziku nuk është dyfishimi, por zëvendësimi i heshtur i dorëzimit.** I njëjti rrezik ekziston sot, pa asnjë ndryshim, për çdo ekip që e ka ndezur dorëzimin në dy pajisje. Sinkronizimi bën një pikë rikthimi para çdo zëvendësimi, prandaj puna e humbur mund të nxirret me dorë.

Nga kjo dalin dy gjëra që rregulli “një pajisje nis dhe mbyll turnin” nuk i zgjidh vetë:

- Edhe pajisja e vetme që nis dhe mbyll turnin e humbet dorëzimin, nëse një pajisje tjetër ka një dorëzim të vetin dhe sinkronizon pas saj.
- Meqë `current` dhe `history` bashkohen veçmas, një pajisje mund të përfundojë me dorëzimin aktiv të njërës dhe historikun e tjetrës. Kjo e prish kontrollin e mbartjes (rasti R6 te 3.5).

### 3.4 Kufizimi i pilotit

Kufizimi ka dy pjesë. E para është teknike dhe duhet të jetë në kod para se hapi 3 të ndizet. E dyta është rregull pune.

**Pjesa 1: dorëzimi dhe historiku jashtë sinkronizimit automatik.**

> Sa kohë mbyllja e re është e ndezur, çelësat e dorëzimit (`sc-shift-handover`, `-de`, `-sq`), që mbajnë dorëzimin aktiv dhe historikun, **nuk ofrohen për sinkronizim**: nuk shfaqen te lista e mjeteve të ekipit, një zgjedhje e ndezur më parë nuk merret parasysh, dhe pajisja as nuk i dërgon te kopja e ekipit, as nuk i lexon prej saj.
> Regjistri i dëmeve, lista e veprimeve dhe mjetet e tjera sinkronizohen si sot.

Vendi i ndryshimit është rregulli që thotë çfarë mund të ndahet (`offerable` te `team-sync.js`), në PR-in e hapit 3. Nuk mjafton të mbështetemi te fakti që dorëzimi është i fikur në fillim, sepse çdo pajisje mund ta ndezë.

E provuar me sinkronizimin e vërtetë (`prova/sinkronizimi-pa-dorezimin.cjs`): dy pajisje, secila me një rresht dëmi të vetin dhe me një dorëzim të ndryshëm për të njëjtin turn; katër sinkronizime.

| Rasti | Dëmet te të dyja | Dorëzimet | Kopja e ekipit |
| --- | --- | --- | --- |
| 1. Sot, dorëzimi i pandezur | 3 rreshta, të bashkuar | Asnjë nuk preket. | Vetëm dëmet. |
| 2. Dorëzimi i ndezur te të dyja | 3 rreshta, të bashkuar | Njëra pajisje e humbet të vetin. | Dëmet dhe dorëzimi. |
| 3. Rregulli i pilotit, me kutinë e ndezur te të dyja | 3 rreshta, të bashkuar | Asnjë nuk preket. | Vetëm dëmet. |
| 4. Njëra nën rregull, tjetra me dorëzimin të ndezur | 3 rreshta, të bashkuar | Asnjë nuk preket. | Dëmet dhe dorëzimi i pajisjes së dytë, i palexuar nga e para. |

Rasti 3 modelon rregullin te funksioni që i jepet sinkronizimit (`selected`); kodi i `team-sync.js` nuk është ndryshuar. Rasti 4 tregon që një dorëzim i mbetur në kopjen e ekipit nga më parë, ose nga një pajisje me faqe të vjetër, nuk hyn te pajisja e pilotit.

**Pjesa 2: një pajisje nis dhe mbyll turnin për një vend pune.**

> Me dorëzimin jashtë sinkronizimit, çdo pajisje ka dorëzimin dhe historikun e vet. Dy pajisje që nisin të njëjtin turn nuk e zëvendësojnë më njëra-tjetrën, por krijojnë dy dorëzime paralele, secili me çështjet e mbartura.
> Prandaj gjatë pilotit **nisja dhe mbyllja e turnit për një vend pune bëhen nga një pajisje e vetme.** Pajisjet e tjera regjistrojnë dëme, që bashkohen pa humbje.
> Dorëzimi kalon te një pajisje tjetër vetëm me transferimin që mjeti e ka tashmë: lidhje e koduar, kod QR ose skedar.
> Kjo pjesë nuk zbatohet teknikisht, sepse nuk ka server që ta dijë cila pajisje e nisi turnin.

Kufizimi hiqet vetëm kur dorëzimi të bashkohet për hyrje dhe për çështje, jo si e tërë. Kjo është punë te sinkronizimi dhe nuk është pjesë e këtij plani.

### 3.5 “Vetëm një herë”: çfarë garantohet dhe çfarë jo

**Shenja në historik nuk e garanton.** Ajo kthehet mbrapsht me çdo kopje rezervë të bërë para mbartjes, dhe me dorëzimin të sinkronizuar zëvendësohet bashkë me historikun.

Mekanizmi ka dy shtresa në kod:

1. **Identiteti i mbylljes.** Çdo mbyllje merr një `closeId`. Dorëzimi që mbart shënon `carriedFrom` me atë `closeId`. Para mbartjes kontrollohet nëse dorëzimi aktiv ose ndonjë hyrje e historikut e ka tashmë.
2. **Krahasimi i çështjeve.** Çdo çështje krahasohet me ato që janë tashmë te dorëzimi, me rregullin ekzistues të `mergeIssues`. E njëjta nuk shtohet; rasti i paqartë tregohet dhe nuk shtohet vetë.

Hyrjet e historikut pa `closeId` vijnë nga mbyllja e vjetër, që i mbartte çështjet menjëherë. Ato nuk janë kurrë në pritje.

Pas çdo rikthimi, turni aktiv i pajisjes mbahet vetëm nëse përputhet me dorëzimin aktiv të rikthyer. Përndryshe pajisja mbetet pa turn aktiv dhe përdoruesi e nis shprehimisht.

**Garancia, e kufizuar:**

> Në një pajisje, me dorëzimin jashtë sinkronizimit: **asnjë dorëzim nuk e mban dy herë një çështje të mbartur nga e njëjta mbyllje.**
> **Nuk garantohet** që mbartja ndodh një herë në kohë. Pas rikthimit të një kopjeje të bërë para mbartjes, gjendja është kthyer mbrapa dhe nisja e turnit mbart përsëri, në një dorëzim që nuk i ka ende çështjet.
> **Nuk garantohet** asgjë ndërmjet pajisjeve; atë e mbulon vetëm kufizimi i pilotit (3.4).

E provuar me kopjen rezervë të vërtetë (`prova/rikthimi-nga-backup.cjs`). Skedari bëhet dhe lexohet me `makeBackup` dhe `readBackup`; rikthimi shkruan çdo çelës të skedarit të tërë dhe nuk prek çelësat që skedari nuk i ka. Mbyllja, nisja dhe mbartja janë model i rregullave të këtij plani, sepse në repo nuk ekzistojnë ende.

| Kopja rezervë | Çfarë ndodh pas rikthimit | Kopje të çështjes |
| --- | --- | --- |
| R1. Bërë **pas** mbartjes | Dorëzimi e ka `carriedFrom`. Nisja e përsëritur nuk shton asgjë. | 1 |
| R2. Bërë **para** mbartjes, pas mbylljes | Dorëzimi i turnit pasues zhduket; pajisja mbetet pa turn aktiv. Nisja e re mbart përsëri. | 1 |
| R3. Bërë para mbylljes | Turni i mbyllur kthehet i hapur dhe mbyllja zhduket nga historiku. Pa turn aktiv. Mbyllja e re merr `closeId` të ri dhe nisja mbart. | 1 |
| R4. Pa çelësin e dorëzimit | Dorëzimi nuk preket. Nisja e përsëritur nuk shton asgjë. | 1 |
| R5. E vjetër, nga para hapit 3 | Hyrja pa `closeId` nuk është në pritje. Nisja nuk shton asgjë. | 1 |
| R6. Kufiri: destinacioni pa `carriedFrom` dhe teksti i çështjes i ndryshuar | Shtresa 2 nuk e njeh çështjen dhe e shton përsëri. | 2 |

Çfarë tregojnë:

- **R1 kundrejt R2:** kopja që e përmban mbartjen e ndalon përsëritjen; kopja e bërë para saj e lejon, pa dyfishim. Në R2 dhe R3 puna e bërë pas kopjes humbet nga vetë rikthimi, dhe gjendet te pika e rikthimit.
- **R3:** rikthimi mund ta hapë përsëri një turn të mbyllur. Rregulli “turni i mbyllur nuk rihapet” vlen për ndërfaqen, jo kundër një rikthimi.
- **R6:** gjendja ku historiku thotë “në pritje” dhe dorëzimi i ka tashmë çështjet nuk lind nga një kopje rezervë, sepse dorëzimi dhe historiku janë në të njëjtin çelës dhe rikthehen bashkë. Lind kur fushat bashkohen veçmas, pra kur dorëzimi sinkronizohet. **Përjashtimi i 3.4 është kusht i garancisë, jo vetëm mbrojtje e punës.**

Pikat e rikthimit (`storage-guard.js`) e mbajnë punën në të njëjtën formë si skedari i kopjes rezervë. Rikthimi prej tyre nuk është provuar këtu.

### 3.6 Kriteret e pranimit për hapin 3

Hapi 3 nuk pranohet pa teste në repo që tregojnë secilën nga këto.

Sinkronizimi:

| Nr. | Kriteri |
| --- | --- |
| K1 | Me kutinë e dorëzimit të ndezur te dy pajisje dhe dorëzime të ndryshme për të njëjtin turn, pas katër sinkronizimesh dorëzimi dhe historiku i secilës janë bajt për bajt si para. |
| K2 | Në të njëjtën provë, rreshtat e dëmeve të të dyjave janë te të dyja. |
| K3 | Kopja e ekipit nuk merr asnjë çelës dorëzimi nga një pajisje e pilotit, në asnjë nga tri gjuhët. |
| K4 | Lista e mjeteve të ekipit nuk e ofron dorëzimin sa kohë mbyllja e re është e ndezur. |
| K5 | Një dorëzim që është tashmë në kopjen e ekipit nuk lexohet nga pajisja e pilotit. |
| K6 | Turni aktiv dhe draftet nuk dalin kurrë te kopja e ekipit. |

Kopja rezervë:

| Nr. | Kriteri |
| --- | --- |
| K7 | Kopje e bërë pas mbartjes (R1): nisja e përsëritur e të njëjtit turn nuk shton asnjë çështje. |
| K8 | Kopje e bërë para mbartjes (R2): pas rikthimit nuk ka turn aktiv; nisja mbart dhe dorëzimi ka një kopje të çdo çështjeje. |
| K9 | Kopje e bërë para mbylljes (R3): pas rikthimit nuk ka turn aktiv; mbyllja e re merr `closeId` të ri. |
| K10 | Kopje pa çelësin e dorëzimit (R4): dorëzimi dhe historiku nuk preken. |
| K11 | Kopje e vjetër, pa `closeId` (R5): asnjë hyrje e vjetër nuk mbartet. |
| K12 | Pas çdo rikthimi, turni aktiv mbahet vetëm kur përputhet me dorëzimin aktiv të rikthyer. |
| K13 | Në K7–K11, asnjë dorëzim nuk e mban dy herë një çështje nga e njëjta mbyllje. |
| K14 | Rikthimi nga një pikë rikthimi sillet si rikthimi nga skedari, për K7–K13. |

Dokumentimi:

| Nr. | Kriteri |
| --- | --- |
| K15 | Faqja e Dorëzimit dhe udhëzuesi thonë që gjatë pilotit dorëzimi nuk sinkronizohet dhe kalon mes pajisjeve vetëm me transferim. |
| K16 | Teksti i garancisë te 3.5 është në `docs/DATA-FORMATS.md`, me të dy “nuk garantohet”. |

Aktivizimi dhe auditimi i hapit 3 (shtuar më 15 nëntor 2026, pas auditimit):

| Nr. | Kriteri |
| --- | --- |
| K17 | Mbyllja e re dhe përjashtimi i dorëzimit nga sinkronizimi ndizen bashkë, vetëm nga një cilësim i pajisjes. Pa cilësimin, ose me një cilësim të dëmtuar, faqja mbyll si më parë dhe sinkronizimi e trajton dorëzimin si më parë. Asgjë tjetër nuk e ndez: as një skedar i rikthyer, as sinkronizimi. |
| K18 | Një çështje që mbërrin kur nuk ka turn ruhet derisa përdoruesi të nisë turnin ose ta hedhë poshtë shprehimisht. Nuk konsumohet para ruajtjes; rifreskimi dhe vazhdimi nuk e dyfishojnë. Asnjë përmbajtje e re nuk vihet në URL. |
| K19 | Kufiri i historikut nuk fshin kurrë një mbyllje që ende pret mbartje, as pas më shumë se 30 mbylljesh. “Fshi historikun” e thotë kur fshihen edhe çështje në pritje; anulimi nuk ndryshon asgjë. |
| K20 | Pas rikthimit, turni aktiv mbahet vetëm kur përputhja provohet; kur nuk përputhet ose është e paqartë pastrohet, me arsyen. Turni nga profili pastrohet sepse përputhja nuk provohet dot, jo për shkak të origjinës. |
| K22 | Gjendja që la mbyllja e re (asnjë turn i hapur, mbyllje në pritje, çështje hyrëse të ruajtura), në një pajisje me cilësimin të fikur, nuk përpunohet nga asnjëra rrjedhë dhe nuk ndahet nga sinkronizimi, derisa përdoruesi të vendosë shprehimisht. Skedari i rikthyer nuk e ndez cilësimin. Fikja refuzohet sa kohë diçka pret. Pajisjet pa një gjendje të tillë sillen si më parë. |
| K23 | Çështja e 51-të në pritje nuk ruhet, nuk konsumohet dhe nuk humbet: pas rifreskimit provohet sërish, dhe pasi lirohet vend ruhet një herë, edhe kur ruajtja dështon ndërkohë. |
| K21 | Para se një dorëzim i mbërritur të zëvendësojë një të hapur, faqja thotë çfarë mbyllet. Anulimi ose dështimi i ruajtjes nuk e mbyll dorëzimin, nuk humb përmbajtje dhe nuk shënon çështje si të mbartura. |

### 3.7 Hapi 3: si u plotësuan kriteret

Bërë më 15 nëntor 2026 dhe korrigjuar po atë ditë pas auditimit (pjesa 3.8). Çdo kriter ka provë me implementimin e vërtetë: faqja e ndërtuar e Dorëzimit me skriptet e veta, kutia e vërtetë e skedarit, sinkronizimi i vërtetë kundër një serveri të rremë, dhe pikat e rikthimit në shfletues të vërtetë. Modelet e pjesëve 3.4 dhe 3.5 (`prova/`) mbeten si shënim i projektimit; nuk përdoren si provë.

| Nr. | Gjendja | Ku është prova |
| --- | --- | --- |
| K1 | Plotësuar | `tests/shift-close.test.cjs`, në të tria gjuhët, në pajisje me mbylljen e re të ndezur |
| K2 | Plotësuar | po aty |
| K3 | Plotësuar | po aty |
| K4 | Plotësuar | `tests/shift-close.test.cjs` dhe `tests/team-sync.test.cjs`: me cilësimin e ndezur lista nuk e ofron, edhe me zgjedhje të ruajtur; pa të e ofron si më parë |
| K5 | Plotësuar | `tests/shift-close.test.cjs` |
| K6 | Plotësuar | po aty; edhe `tests/shift-context.test.cjs` |
| K7–K11 | Plotësuar | `tests/shift-close.test.cjs`, me skedarin e vërtetë |
| K12 | Plotësuar | po aty; shih edhe K20 |
| K13 | Plotësuar | po aty, në çdo provë të K7–K11 |
| K14 | Plotësuar | `tests/browser/shift-close.spec.mjs`, me pikat e vërteta të rikthimit |
| K15 | Plotësuar në degën e punës | Faqja e thotë në tri gjuhët aty ku mbyllja e re është e ndezur. Udhëzuesi e thotë që nga botimi 9, në tekst, në lexues dhe në PDF (faqja 18). Botimi nuk është publikuar: shih 3.8, pika 6. |
| K16 | Plotësuar | `docs/DATA-FORMATS.md`, me testin që e kontrollon |
| K17 | Plotësuar | `tests/shift-close.test.cjs`, pjesa 0 (katër teste); `tests/browser/shift-close.spec.mjs` (ndezja dhe fikja në shfletues); `tests/browser/handover-transfer.spec.mjs` i pandryshuar nga para hapit 3 |
| K18 | Plotësuar | `tests/shift-close.test.cjs` (pesë teste, me memorie që refuzon ruajtjen); `tests/browser/shift-close.spec.mjs` (rifreskim i vërtetë) |
| K19 | Plotësuar | `tests/shift-close.test.cjs`: 35 mbyllje nëpërmjet faqes, 36 mbyllje që presin të gjitha, dhe pyetja e “Fshi historikun” |
| K20 | Plotësuar | `tests/shift-close.test.cjs`: çdo pjesë e provës që mungon, me arsyen e vet, dhe turni i profilit |
| K21 | Plotësuar | `tests/shift-close.test.cjs`: teksti i pyetjes, anulimi dhe dështimi i ruajtjes, bajt për bajt |
| K22 | Plotësuar | `tests/shift-close.test.cjs`, pjesa “Held” (katër teste, me kutinë e vërtetë të skedarit dhe sinkronizimin e vërtetë); `tests/browser/shift-close.spec.mjs` |
| K23 | Plotësuar | `tests/shift-close.test.cjs` (50 mbërritje të vërteta, pastaj e 51-ta nga CX Control Tower dhe nga 5 Whys); `tests/browser/shift-close.spec.mjs` (rifreskim i vërtetë) |

**Çfarë mbetet e hapur.** Asnjë kriter. Botimi 9 i udhëzuesit është vetëm në degën e punës; del në faqe kur të publikohet dega.

**Ku implementimi ndryshon nga teksti i mëparshëm i planit.**

- **Çështja e paqartë nuk shtohet.** Kur dy mbyllje që presin kanë të njëjtin tekst me përgjegjës ose afat tjetër, e dyta nuk mbartet vetë; faqja e thotë dhe ajo mbetet në historik.
- **Turni aktiv pastrohet pas çdo rikthimi kur përputhja nuk provohet**, edhe kur skedari nuk ka dorëzim (3.8, pika 4).
- **Një dorëzim që mbërrin me transferim** e mbyll dorëzimin e hapur me `closeId` dhe e emërton, që çështjet e tij të mos mbarten dy herë (3.8, pika 5).

**Kufizimet.**

- Garancia është ajo e 3.5: në një pajisje, pa dyfishim brenda një dorëzimi. Jo ndërmjet pajisjeve, dhe jo “një herë në kohë” pas një skedari të vjetër.
- “Fshi historikun” fshin edhe mbylljet që presin, pasi e ka thënë dhe përdoruesi ka pranuar.
- Historiku mban 30 mbyllje, plus ato që ende presin. Mbylljet që presin për një zonë ku nuk niset më asnjë turn mbeten aty derisa të fshihet historiku.
- Shenja “ndryshuar pas ndarjes” punon vetëm për ndarjet e bëra pas këtij hapi.
- Marrja e një dorëzimi me transferim nuk e vendos turnin aktiv të pajisjes.
- Deri në 50 çështje mund të presin për turnin që niset; e 51-ta nuk ruhet dhe faqja e thotë, pa e konsumuar (3.8, pika 8). Mesazhi i refuzimit shfaqet për pak sekonda; adresa e faqes e mban kërkesën derisa të ruhet.
- Cilësimi i mbylljes së re nuk është në kopjen rezervë: pas kalimit në një pajisje tjetër ndizet sërish me dorë.
- Një pajisje me cilësimin të fikur që merr gjendjen e një pajisjeje me të ndezur (nga një skedar) nuk bën asgjë me të derisa përdoruesi ta ndezë cilësimin (3.8, pika 7). Rruga e daljes kalon nga mbyllja e re: ndiz, nis turnin ose fshi atë që pret, pastaj fik.
- Butoni që fik cilësimin është pranë dorëzimit, ndaj nuk shfaqet kur nuk ka turn të hapur; aty fikja do të refuzohej gjithsesi.
- Faqja 18 e udhëzuesit në gjermanisht është në shkallën më të ngushtë që lejon procedura (fit-3); një tekst më i gjatë aty do të kërkonte shkurtim.
- “Sot” nuk ekziston ende. Mekanizmi është në `shift-close.js`, pa lidhje me faqen, që “Sot” ta thërrasë në hapin 6.

### 3.8 Korrigjimet e auditimit të hapit 3

Gjashtë pikat e auditimit, secila me atë që u ndryshua.

**1. Aktivizimi i kufizuar.** Mbyllja e re nuk është më mbyllja e faqes për të gjithë. Është e ndezur vetëm aty ku pajisja ka cilësimin `sc-shift-close-ui` = `{ v: 1, on: true }`. I njëjti cilësim, i lexuar edhe nga `team-sync.js`, e nxjerr dorëzimin dhe historikun nga sinkronizimi: të dyja ndizen dhe fiken bashkë. Pa cilësimin (ose me çdo vlerë tjetër) faqja mbyll si para hapit 3, me të njëjtin tekst pyetjeje dhe të njëjtin format historiku, dhe sinkronizimi e ofron dorëzimin si më parë. Cilësimi ndizet vetëm duke hapur faqen e Dorëzimit me `?pilot=shift-close` dhe duke pranuar pyetjen; fiket me butonin pranë shënimit që thotë se është i ndezur. Nuk është në kopjen rezervë, as në pikat e rikthimit, as në kopjen e ekipit, dhe lexohet pa PIN.

**2. Çështja hyrëse kur nuk ka turn.** Ruhet te gjendja e dorëzimit (`waiting`), shfaqet te paneli i nisjes dhe bëhet çështje e hapur e turnit që nis përdoruesi, një herë; ose hidhet poshtë një nga një, pas pyetjes. Kalimi konsumohet (shënimi në `sessionStorage` hiqet, adresa pastrohet) vetëm pasi çështja është ruajtur. Kur memoria nuk e pranon, asgjë nuk konsumohet dhe hapja e sërishme e faqes e ofron përsëri. Mekanizmi i kalimit është ai ekzistues; asnjë përmbajtje e re nuk shkon në URL. E njëjta rregull vlen tani edhe kur ka turn të hapur.

**3. Kufiri i historikut.** Kufiri prej 30 fshin mbylljet më të vjetra që nuk presin asgjë; një mbyllje me çështje të pambartura nuk fshihet, dhe historiku rritet mbi 30 kur duhet. “Fshi historikun” thotë sa çështje të hapura në pritje do të fshihen; “jo” nuk ndryshon asgjë.

**4. Turni aktiv pas rikthimit.** Mbahet vetëm kur provohen tri gjëra: ka dorëzim të hapur nën çelësin e listës nga u zgjodh turni, me të njëjtën datë operative dhe me të njëjtën fjalë turni. Përndryshe pastrohet, dhe përgjigjja thotë pse (`idle`, `other-shift`, `unreadable`, `unprovable`). Turni nga lista e profilit pastrohet si `unprovable`, dhe arsyeja nuk është origjina: dorëzimi e mban turnin si fjalë të listës së faqes, ndërsa lista e profilit mund të ketë numër tjetër turnesh, renditje tjetër ose të njëjtën fjalë për një turn tjetër (“Late” i pari nga dy nuk është domosdo “Late” i dyti nga tre). Fjala e njëjtë është ngjashmëri, jo provë.

**5. Transferimi mbi një dorëzim të hapur.** Kutia e dorëzimit të mbërritur dhe pyetja e konfirmimit thonë: cili turn mbyllet, që kalon në historik siç është, që asgjë nuk dërgohet prej tij, sa çështje të hapura të tij mbeten te dorëzimi që merret dhe që nuk mbarten sërish. I gjithë ndryshimi ruhet njëherësh; kur përdoruesi thotë “jo” ose ruajtja dështon, gjendja kthehet si ishte, dorëzimi i mbërritur mbetet i ofruar dhe asgjë nuk shënohet si e mbartur. E njëjta mbrojtje (kthim kur ruajtja dështon) u shtua te mbyllja, nisja dhe fshirja e historikut.

**6. K15, udhëzuesi.** Botimi 9 i udhëzuesit (15 nëntor 2026) u përgatit sipas procedurës së projektit: botimi 8 u arkivua si PDF, teksti u ndryshua në tri gjuhët, `scripts/page-fit.mjs` e vendosi faqen 18 më ngushtë që teksti të hyjë në kutinë e faqes (shkalla 2 në anglisht dhe shqip, 3 në gjermanisht), dhe `scripts/tools-guide.mjs` printoi tri PDF-të dhe kopertinat. Udhëzuesi e përshkruan butonin me emrin që ka faqja kur asgjë nuk është ndezur, dhe shton që aty ku mbyllja e re është e ndezur dorëzimi nuk sinkronizohet. Nuk është bërë merge apo deploy.

**7. Gjendja e pilotit kur aktivizimi është i fikur.** Kur cilësimi është i fikur dhe gjendja e dorëzimit mban atë që la mbyllja e re (asnjë turn i hapur, një mbyllje me çështje të pambartura, ose çështje hyrëse të ruajtura), gjendja “mbahet”:

- Faqja e thotë në një kuti në krye, me atë që pret, dhe nuk mbyll, nuk nis dhe nuk merr dorëzim, as me rrjedhën e re, as me të vjetrën. Shkrimi në një dorëzim të hapur, historiku, hedhja poshtë dhe “Fshi historikun” (me paralajmërimin e vet) mbeten, sepse janë të njëjta në të dyja rrjedhat.
- Sinkronizimi nuk e ndan atë dorëzim, as për dërgim, as për lexim, edhe kur është zgjedhur (`closeHeld` te `team-sync.js`). Pjesa tjetër e sinkronizimit vazhdon.
- Vendimi i vetëm që e zhbllokon është ndezja e cilësimit nga përdoruesi, në atë kuti, pas pyetjes. Skedari i rikthyer nuk e ndez.
- Fikja e cilësimit refuzohet sa kohë nuk ka turn të hapur ose diçka pret, dhe thotë çfarë duhet zgjidhur. Me një dorëzim të hapur dhe asgjë në pritje lejohet pas pyetjes, që thotë se dorëzimi mbetet i hapur siç është; prej aty faqja është e gjitha rrjedha e vjetër.
- Një pajisje pa një gjendje të tillë nuk mbahet kurrë dhe sillet si para hapit 3.

**8. Çështja e 51-të.** Kur 50 çështje presin, e 51-ta nuk ruhet. Kalimi nuk konsumohet: shënimi në `sessionStorage` dhe adresa mbeten, asnjë nga 50-ta nuk shtyhet jashtë, dhe rifreskimi e provon sërish. Pasi përdoruesi liron vend, rifreskimi e ruan një herë dhe vetëm atëherë e konsumon; kur ruajtja dështon ndërkohë, mbetet e pakonsumuar. Kodi nuk ndryshoi për këtë pikë: sjellja ishte tashmë kjo, dhe tani ka provë.

**Teksti i botimit 9** u ndryshua që të thotë edhe sjelljen normale: “Without the pilot, team sync shares the handover only where it is ticked. With the new shift close turned on (a pilot, on one device), it shares neither the handover nor its history: the handover reaches another device only when you send it.” Tri PDF-të u printuan sërish.

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
- Mbart sipas 3.5; garancia është ajo e kufizuar aty.
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
- **Rreshtat e rinj** do të marrin `id` në krijim, por jo ende: shih 5.1 për kushtin.
- **Veprim nga një rresht pa `id`:** `origin.row` ruan kopjen e fushave, `id` bosh dhe `twins`, numrin e rreshtave identikë në çastin e krijimit.

“Hap burimin” për një rresht pa `id` kërkon sipas fushave:

| Gjen | Tregon |
| --- | --- |
| Një rresht | E shënon si burimin. |
| Disa rreshta identikë | I shënon të gjithë si “një nga këta n rreshta”. Nuk zgjedh asnjërin. |
| Asnjë | Hap periudhën e ruajtur me “rreshti nuk gjendet më”. |

Dublikatat e veprimeve për rreshta pa `id` ndjekin rregullin ekzistues: titull dhe burim i njëjtë.

### 5.1 `id` e rreshtave: çfarë nxori verifikimi

E provuar me sinkronizimin e vërtetë (`prova/id-e-rreshtave.cjs`), me dy pajisje:

| Rasti | Çfarë ndodh |
| --- | --- |
| 1. Pa `id`: dy dëme identike në një pajisje | Pajisja tjetër merr vetëm një. |
| 2. Pa `id`: një rresht fshihet në një pajisje | Kthehet me sinkronizimin tjetër. Fshirja nuk mban. |
| 3. Me `id`: dy dëme identike | Pajisja tjetër i merr të dy. |
| 4. Me `id`: një rresht fshihet | Fshihet edhe te pajisja tjetër. |
| 5. `id` e shtuar me vonesë te një rresht i vjetër | I njëjti dëm del dy herë te të dyja. |
| 6. Të vjetër pa `id` dhe të rinj me `id`, bashkë | Bashkohen pa dyfishim. |
| 7. Një pajisje me faqe të vjetër e heq `id`-në | Rreshti mbetet, por `id` humbet te të gjitha pajisjet. |

Çfarë del prej tyre:

- **Rastet 1 dhe 2 janë të meta që ekzistojnë sot**, për çdo ekip që sinkronizon regjistrin e dëmeve, të plotësisë ose të Night Audit. Nuk i shkaktoi ky plan; `id` për rreshtat e rinj i rregullon të dyja.
- **Rasti 4 është ndryshim sjelljeje**: me `id`, fshirja në një pajisje fshin rreshtin te gjithë ekipi. Është sjellja që kanë sot mjetet me `id` (p.sh. lista e veprimeve).
- **Rasti 5** është arsyeja pse rreshtat e vjetër nuk marrin `id` me vonesë.
- **Rasti 7** vendos rendin e daljes. Faqja e sotme e rindërton çdo rresht kur hapet dhe do ta hiqte një `id` që nuk e njeh. Sinkronizimi e lexon këtë si fshirje të `id`-së.

Prandaj shkrimi i `id`-ve del në dy kohë:

1. **Së pari, faqja e mban `id`-në që gjen** dhe nuk shkruan asnjë. Kjo është bërë (hapi 1b).
2. **Më vonë, faqja shkruan `id` për rreshtat e rinj** (hapi 1c). Vetëm pasi çdo pajisje e ekipit ka marrë versionin e pikës 1. Sa kohë duhet pritur varet nga sa shpejt pajisjet marrin faqen e re, edhe ato që punojnë pa internet; kjo nuk është matur.

Derisa të dalë hapi 1c, çdo veprim nga një rresht përdor rrugën e rreshtave pa `id`: kopjen e fushave dhe `twins`.

---

## 6. Turni aktiv, draftet dhe kopja rezervë

Kjo pjesë është bërë (hapi 2). Kodi është te `src/js/shift-context.js`; asnjë faqe nuk e përdor ende për të shfaqur diçka.

### 6.1 Çfarë u kontrollua para kodit

- **Mjeti dhe gjuha.** Çdo regjistër ka çelësin e vet për çdo gjuhë (`sc-damage-control`, `-de`, `-sq`). Prandaj një draft i takon çelësit ku forma do të shkruajë, jo vetëm mjetit.
- **Konteksti i punës.** Regjistri i dëmeve është një për shfletues dhe gjuhë; nuk ndahet sipas vendit të punës. Dorëzimi ka shabllon dhe zonë. Prandaj drafti ka edhe një `scope` të lirë, bosh për regjistrat, që dorëzimi ta përdorë në hapin 3.
- **Turni.** Fjalët e turneve ndryshojnë sipas gjuhës, por renditja është e njëjtë. Turni ruhet me katër pjesë: pozicioni në listë (`index`), gjatësia e listës (`of`), fjala (`label`) dhe lloji i listës (`list`). Shih 6.6 për arsyen. Kjo mbyll pyetjen e hapur te pjesa 8.
- **Kyçja me PIN.** Asgjë nuk shkruhet kur mjetet janë të kyçura, si te çdo mjet tjetër.

### 6.2 Çfarë ruhet

| Çelësi | Çfarë mban | Sinkronizim | Kopje rezervë dhe pika rikthimi |
| --- | --- | --- | --- |
| `sc-shift-ui` | Turni aktiv i pajisjes: data operative, pozicioni i turnit, fjala. | Jo | Jo (`SKIP` te `work-backup.js`) |
| `sc-drafts-ui` | Lista e drafteve. | Jo | Po |
| `sc-drafts-unreadable-ui` | Kopja e një liste draftesh që nuk u lexua dot, e mbajtur mënjanë një herë. | Jo | Po |

Sinkronizimi i anashkalon të tria sepse mbarojnë me `-ui` (`NOT_TOOL` te `team-sync.js`); `team-sync.js` nuk u prek.

Turnin aktiv e vendos vetëm `setActive()`. Nuk e ndryshon ora, as rikthimi i një skedari ose i një pike rikthimi.

### 6.3 Identiteti i një drafti

Një draft është i një forme në një turn. Identiteti është: çelësi i mjetit (me gjuhën), emri i formës, `scope`, data operative dhe turni i plotë (pozicioni, gjatësia e listës, fjala dhe lloji i listës).

- Dy forma me të njëjtën datë dhe turn janë dy drafte kur ndryshon çdo pjesë tjetër.
- Një identitet ka një draft. Drafti ekziston vetëm sa ka diçka të shkruar.
- Asnjë draft nuk lëviz vetë. `move()` e çon te një turn tjetër vetëm kur kërkohet, dhe refuzon kur caku ka punë: një draft të vetin, ose një formë që thirrësi thotë se ka punë të paruajtur. Të dy mbeten si ishin.
- Çdo ruajtje i jep draftit një `rev` të ri. Forma e kthen `rev`-in e draftit që ka ngarkuar; nëse ai në ruajtje ka ndryshuar ndërkohë, ruajtja refuzohet dhe forma merr draftin që është aty. Kështu një formë e hapur nuk shkruan mbi një draft që nuk e ka parë.

### 6.4 Rikthimi nga një skedar ose pikë rikthimi

- **Forma.** Skedari refuzohet i tëri kur lista e drafteve nuk është siç e shkruan faqja.
- **Turni aktiv.** Nuk është në skedar; edhe kur dikush e vë me dorë, lihet jashtë. Asnjë draft i rikthyer nuk aktivizon turn.
- **Draftet që skedari nuk i ka** mbeten. Draftet e skedarit që nuk janë këtu shtohen.
- **Përplasja.** Kur skedari dhe shfletuesi kanë draft për të njëjtin identitet me vlera të ndryshme, faqja pyet para se të ndryshojë ndonjë gjë: “Mbaj ato të këtij shfletuesi”, “Merr ato nga skedari” ose “Anulo”.
- **Anulimi** (edhe me Esc) nuk ndryshon asnjë çelës, as të tjerët që skedari mban, dhe nuk bën pikë rikthimi.
- **Përgjigjja vlen vetëm për draftet e treguara.** Nëse një formë ruhet në një skedë tjetër sa pyetja është e hapur, asgjë nuk shkruhet.
- **Drafti i marrë nga skedari** merr `rev` të ri, prandaj forma e hapur mbi draftin e vjetër nuk e mbishkruan dot.
- **Pika e rikthimit** bën të njëjtën pyetje, para se të bëhet pika e gjendjes së tanishme.

### 6.5 Të dhënat e dëmtuara

- Turni aktiv që nuk lexohet dot lexohet si “asnjë turn”.
- Lista e drafteve që nuk lexohet dot mbahet mënjanë e paprekur dhe lista lexohet si bosh. Një rekord që nuk është draft lihet jashtë në të njëjtën mënyrë.
- Ruajtja e bllokuar ose e mbushur kthen një përgjigje me arsyen; faqja nuk rrëzohet.

### 6.6 Kur lista e turneve ndryshon

Verifikim i bërë pas hapit 2, më 15 nëntor 2026. Turnet e profilit janë të përdoruesit: mund t'u ndryshojë rendin ose emrin.

**Çfarë doli.** Versioni i parë i hapit 2 (`021839f`) e njihte turnin vetëm nga pozicioni dhe gjatësia e listës. Me profilin e vërtetë (`workplace.js`):

| Ndryshimi i listës | Para korrigjimit |
| --- | --- |
| Rendi: A, B, C bëhet C, A, B | Turni aktiv C lexohej si B. Drafti i C-së dilte te forma e B-së. |
| Zëvendësimi: A, B, C bëhet A, B, D | Turni aktiv C lexohej si D. Drafti i C-së dilte te forma e D-së. |

**Korrigjimi.** Fjala dhe lloji i listës u bënë pjesë e detyrueshme e çdo turni të ruajtur dhe e identitetit të draftit. Lloji është `en`, `de` ose `sq` për listën e ngulitur të asaj gjuhe, dhe `profile` për turnet e profilit.

- Një turn i ruajtur nuk lexohet kurrë si “çfarëdo që është në atë pozicion tani”.
- `place()` thotë ku është sot një turn i ruajtur: “i njëjti” kur lista është e të njëjtit lloj dhe gjatësi dhe ka të njëjtën fjalë në të njëjtin pozicion; përndryshe “i paqartë”, me pozicionet ku gjendet fjala tani (një, asnjë ose disa).
- `activeOn()` e jep turnin aktiv për një faqe vetëm kur është “i njëjti”.
- Dy lista të ngulitura të gjuhëve të ndryshme merren si të njëjtat turne në të njëjtin rend. Një test kontrollon që regjistrat dhe dorëzimi i çdo gjuhe ofrojnë të njëjtat tri turne.
- Një listë e profilit dhe një e ngulitur nuk lidhen: kalimi nga njëra te tjetra është gjithmonë “i paqartë”.

**Pas korrigjimit**, në të dy rastet e tabelës:

- Turni aktiv del “i paqartë”; forma e turnit që zuri vendin është bosh.
- Drafti mbetet i plotë, si draft i turnit ku u shkrua.
- Asgjë nuk shkruhet nga leximi: as turni aktiv, as draftet, as profili.
- Zgjidhja është e shprehur: përdoruesi e zgjedh përsëri turnin, dhe drafti çohet me `move()` ose hidhet.

Edhe një listë më e gjatë, dy turne me të njëjtin emër dhe një listë e ngulitur që ndryshon dalin “të paqarta”.

Ky është ndryshim i formës së ruajtur. Nuk kërkon migrim, sepse asnjë faqe nuk shkruan ende turn aktiv ose draft.

### 6.7 Kyçja me PIN

Verifikim i bërë pas hapit 2, pa ndryshim kodi. Në shfletues të vërtetë, me kontrollet e vetë faqes:

- Me dy drafte, turnin aktiv dhe një kopje të mbajtur mënjanë, kyçja i heq të tria nga ruajtja e lexueshme.
- Sa janë të kyçura, edhe pas rifreskimit, asgjë nuk lexohet dhe asgjë nuk shkruhet. PIN-i i gabuar nuk hap asgjë.
- PIN-i i saktë i kthen të tria bajt për bajt: çdo draft me vlerat dhe `rev`-in, kopja mënjanë, turni aktiv.
- Skedari i ruajtur më pas mban draftet dhe kopjen mënjanë, jo turnin aktiv.
- Në një shfletues bosh skedari hapet: draftet kthehen me vlerat e tyre, kopja mënjanë vjen, asnjë turn nuk aktivizohet.
- Ku ka tashmë një kopje mënjanë, ajo e skedarit nuk e zëvendëson.

### 6.8 Çfarë pret hapin 3 dhe hapin 4

Këto nuk janë implementuar, sepse varen nga mbyllja e përbashkët ose nga ndërfaqja:

| Sjellja | Pse pret |
| --- | --- |
| Drafti i një turni të mbyllur nuk ofron “Kthehu”. | **Bërë në hapin 4** (7.1), me gjendjen që thotë dorëzimi. |
| Mbyllja paralajmëron për formën e papërfunduar të turnit. | Është pjesë e mbylljes (hapi 3). |
| Pas rikthimit, turni aktiv mbahet vetëm kur përputhet me dorëzimin e rikthyer (K12). | Kërkon dorëzimin me `closeId` (hapi 3). |
| Drafti i dorëzimit, me shabllonin dhe zonën si `scope`. | Dorëzimi nis ta përdorë modulin në hapin 3. |
| Njoftimi “formë e papërfunduar nga…” me “Kthehu”, “Sille”, “Hidhe”. | **Bërë në hapin 4** (7.1). |
| Forma e Kontrollit të dëmeve i ruan vlerat si draft. | **Bërë në hapin 4** (7.1). |
| Profili me turne të personalizuara e ndal ndërfaqen e re. | **Bërë në hapin 4** (7.1). |

---

## 7. Hapat

Çdo hap është një PR, në tri gjuhët, me testet e veta.

| Hapi | Çfarë sjell | Skedarët kryesorë |
| --- | --- | --- |
| 1a. Burimi i veprimeve · **bërë** | `origin` te lista e veprimeve dhe te shënimi i kalimit, me rregullat e rreshtave pa `id`. Asnjë mjet nuk e dërgon ende. | `actions-store.js`, `tool-kit.js`, `docs/DATA-FORMATS.md`, `tests/action-origin.test.cjs` |
| 1b. Mbajtja e `id`-së së rreshtit · **bërë** | Tri regjistrat e `defect-log.js` e mbajnë `id`-në që gjejnë dhe nuk shkruajnë asnjë. Rreshti i ngjitur krahasohet pa `id`. | `defect-log.js`, `tool-kit.js`, `tests/log-row-ids.test.cjs` |
| 1c. Shkrimi i `id`-ve · pret | Rreshtat e rinj marrin `id`. Vetëm pasi çdo pajisje ka versionin e 1b (5.1). | `defect-log.js` |
| 2. Turni aktiv dhe draftet · **bërë** | Ruajtja e turnit aktiv dhe e drafteve, rregullat e kopjes rezervë dhe pyetja për përplasjet (pjesa 6). Asnjë faqe nuk i shfaq ende. | `shift-context.js`, `work-backup.js`, `storage-guard.js`, `partials/work-backup.njk`, `tests/shift-context.test.cjs`, `tests/browser/work-backup-drafts.spec.mjs` |
| 3. Mbyllja e përbashkët · **bërë, K15 pjesërisht** | Mbyllje pa dorëzim, pa turn aktiv pas saj, nisje e shprehur, mbartje sipas 3.5, “ndryshuar pas ndarjes”, dorëzimi jashtë sinkronizimit. Gjendja e kritereve te 3.7. | `shift-close.js`, `shift-handover.js`, `partials/shift-handover.njk`, `team-sync.js`, `shift-context.js`, `work-backup.js`, `storage-guard.js`, `tests/shift-close.test.cjs`, `tests/browser/shift-close.spec.mjs` |
| 4. Kontrolli i dëmeve · **bërë** | Pamja e punës vetëm për këtë mjet, vetëm magazina, vetëm me pilotin të ndezur (7.1). | `defect-work.js`, `defect-log.njk`, `defect-log.js`, `tool-kit.js`, `shift-close.js`, `damageControl.json`, `tests/defect-work.test.cjs`, `tests/browser/damage-work.spec.mjs` |
| 5. “Hap burimin” · **bërë** | Lista e veprimeve hap Kontrollin e dëmeve te periudha, filtri ose rreshti i ruajtur, vetëm për lexim (7.2). | `defect-source.js`, `action-tracker.js`, `defect-log.js`, `defect-work.js`, `partials/defect-log.njk`, `tests/open-source.test.cjs`, `tests/browser/open-source.spec.mjs` |
| 6. Faqja “Sot” | Faqja e punës, mbi të njëjtën mbyllje. Hyrja te Catalyst. | faqe e re, `families.json`, `signals.js` |
| 7. Verifikimi para/pas | Krahasimi i periudhës së ruajtur me atë pas veprimit, me vëllimet e vërteta. | `action-tracker.js`, `defect-log.js` |

### 7.1 Hapi 4: pamja e punës e Kontrollit të dëmeve

Bërë më 15 nëntor 2026. Pamja është një shtresë mbi faqen ekzistuese: i njëjti regjistër, të njëjtët rreshta, të njëjtat rezultate. Nuk ka ruajtje të vetën dhe asnjë mekanizëm paralel: turni është turni aktiv i pajisjes dhe formulari i papërfunduar është drafti i tij (`shift-context.js`); nëse një turn është i hapur apo i mbyllur e thotë dorëzimi (`shift-close.js`, `shiftStatus`).

**Kur ndizet.** Vetëm kur vlejnë të tria: faqja e kërkon (`workUi` te `damageControl.json`, në tri gjuhët; Kontrolli i plotësisë dhe Regjistri i Night Audit nuk e kanë dhe nuk marrin as skriptin, as shënjimin); pajisja ka pilotin të ndezur (i njëjti cilësim `sc-shift-close-ui` i hapit 3: një çelës për pilotin, sepse draftet dhe turni aktiv varen nga nisja e shprehur e turnit); dhe turnet përputhen: profili i vendit të punës nuk ka turne të vetat, ose ka pikërisht turnet e faqes në të njëjtin rend. Me turne të tjera pamja nuk ndizet dhe një shënim thotë pse. Jashtë këtyre kushteve faqja është ajo që ishte.

**Krahasimi me prototipin e ngrirë.**

| Prototipi | Në repo |
| --- | --- |
| Kokë kompakte: periudha, shkalla kundrejt objektivit, filtri | Po. Titulli i faqes zvogëlohet, hyrja fshihet. |
| Skedat Puno · Mëso · Të dhënat | Po, me tastierë (shigjetat, Home, End). Mëso mban “Si përdoret”; Të dhënat mban ngjitjen nga Excel, periudhën, vëllimet, ngjarjet, eksportin dhe pastrimin. |
| Formulari i pari, i lidhur me turnin | Po. Data dhe turni nuk pyeten: regjistrimi merr datën operative dhe turnin e turnit aktiv. Lloji dhe kostoja hapen me një buton. |
| “Formë e papërfunduar nga…” me Kthehu, Sille, Hidhe | Po, me rregullat e mëposhtme. |
| “Në këtë turn” | Po: njësitë, regjistrimet dhe tre të fundit. |
| “Fillo këtu”, fjalia ndjek filtrin | Po, me listat e shkaqeve, hapave dhe turneve që filtrojnë. Një filtër njëherësh. |
| “Hapi tjetër” me gjashtë dalje, “Mbart:” | Po. Me filtër, shiriti del para formularit, si në prototip. |
| Regjistri me “Veprim” për një rresht | Po. |
| Faza e turnit (Fillim, Gjatë, Fund) për sugjerimin | Jo: është e “Sot” (hapi 6). Sugjerimi ndjek vetëm filtrin. |
| Banderola “Erdhe nga… / Kthehu te burimi” | Jo: është hapi 5. |

**Rregullat e drafteve.**

- Çdo gjë që shkruhet ruhet menjëherë si draft i turnit aktiv dhe kthehet pas rifreskimit. Kur drafti nuk ruhet dot, faqja e thotë dhe ajo që u shkrua mbetet në formular.
- Regjistrimi shkruhet i pari, në çast; drafti pastrohet vetëm pasi rreshti është në memorien e shfletuesit. Kur rreshti nuk ruhet, ai hiqet nga faqja, dhe formulari me draftin mbeten për riprovim.
- **Një regjistrim bëhet një herë.** Para se të shkruhet rreshti, drafti i ruajtur shënohet “po regjistrohet”, bashkë me numrin e rreshtave identikë që regjistri ka në atë çast (`values.entering`). Kur rreshti ruhet dhe drafti pastaj nuk pastrohet dot, faqja shkruan mbi të “u regjistrua”. Ajo që mbetet është një nga tri gjërat, dhe faqja thotë cila:
  - **E konfirmuar** (faqja ka shkruar “u regjistrua”, ose e ka ruajtur vetë rreshtin në atë vizitë): “Tashmë në regjistër”. Formulari del i pastër, kopja nuk është punë që pret, dhe faqja e pastron vetë sapo memoria e pranon.
  - **E pakonfirmuar, por regjistri ka më shumë rreshta identikë se kur u shënua** (rreshti mund të jetë ruajtur, ose një rresht me të njëjtat fusha mund të ketë ardhur nga një pajisje tjetër me sinkronizim): faqja thotë që u gjet një rresht me të njëjtat fusha dhe që nuk mund të konfirmojë ruajtjen e këtij formulari. Asgjë nuk regjistrohet dhe asgjë nuk fshihet: përmbajtja tregohet, formulari i regjistrimit fiket, dhe operatori sheh regjistrin e pastaj e kthen formularin për ta regjistruar, ose e heq.
  - **E shënuar, pa rreshta të rinj identikë:** rreshti nuk u ruajt dhe formulari pret si ishte.

  Rifreskimi nuk shton kurrë rresht. Kur shenja nuk shkruhet dot, regjistrimi nuk bëhet dhe faqja e thotë. Dy dëme reale me të njëjtat fusha mbeten të mundshme: i dyti shkruhet dhe regjistrohet si formular më vete.
- “Kthehu te” ofrohet vetëm për turnin që dorëzimi e ka të hapur. Për një turn të mbyllur faqja thotë që është mbyllur; për një turn që dorëzimi nuk e ka, që nuk është i hapur aty.
- “Sille te” nuk ofrohet kur formulari aktual ka punë, dhe funksioni vetë e refuzon; të dy draftet mbeten. Zhvendosja bëhet me një shkrim të vetëm: drafti është te turni tjetër derisa të jetë te ky, kurrë te asnjëri. Kur shkrimi dështon mbetet ku ishte.
- “Hidhe” pyet më parë.
- Kur drafti ndryshon diku tjetër (skedë tjetër, skedar i rikthyer) ndërsa formulari është i hapur, asgjë nuk mbishkruhet: faqja pyet cilin të mbajë.

**Pa turn aktiv**, ose me një turn që nuk është me siguri i kësaj faqeje (6.6: p.sh. i zgjedhur nga lista e profilit), nuk ka formular; faqja e thotë dhe çon te Dorëzimi, ku nisen turnet. Kjo është mënyra si i tregohet përdoruesit turni “i paqartë”.

**Burimi i veprimeve.** Tri daljet drejt listës së veprimeve dërgojnë `origin` sipas pjesës 5: `period` nga “Veprim për periudhën”, `filter` nga “Veprim për {vlera}”, `row` nga “Veprim” i një rreshti. Për një rresht pa `id` shkon kopja e fushave dhe `twins`, numri i rreshtave identikë në atë çast; për një rresht që ka `id`, `id`-ja. Asnjë rresht nuk merr `id` (1c mbetet në pritje). Asgjë nga burimi nuk është në adresë.

**Çfarë nuk ndryshoi.** Formati i rreshtit (të njëjtat fusha, në të njëjtin rend), formati i sinkronizimit, krijimi i `id`-ve, fshirja. “Hap burimin”, “Sot” dhe para/pas nuk janë nisur.

**Ndryshime jashtë pamjes.** Çipi i përbashkët i filtrit (“Filtruar: …”) kishte një emër për lexuesit e ekranit që nuk përmbante tekstin e dukshëm; kontrolli i aksesueshmërisë e kapi dhe emri u plotësua. Vlen për çdo mjet që e përdor çipin; sjellja nuk ndryshon.

**Kufizimet.**

- Dalja “Te dorëzimi” është lidhje që hap faqen e Dorëzimit, pa mbartur asgjë; numrat i merr dorëzimi vetë nga regjistri. Kështu mbetet (vendim i 21 nëntorit 2026). Kalimi i çështjes së propozuar është te pjesa 9, si përmirësim i mundshëm pas pilotit.
- Formulari i pakonfirmuar e mban të fikur formularin e regjistrimit derisa operatori të vendosë. Është zgjedhur kështu që ajo që shkruhet ndërkohë të mos e mbishkruajë përmbajtjen që pret vendimin.
- Kur ekziston një draft i ruajtur dhe memoria nuk pranon as shenjën, regjistrimi refuzohet derisa memoria të punojë: zgjedhja është bërë që të mos ketë kurrë rresht të dyfishtë.
- Gjendja e një turni lexohet nga dorëzimi i gjuhës së faqes ku u shkrua drafti. Kur e njëjta pajisje përdor faqe të dy gjuhëve, drafti i gjuhës tjetër nuk ofron “Kthehu”.
- Kur lloji dhe kostoja nuk hapen, lloji shkruhet “Pa regjistruar” dhe kostoja mbetet bosh.
- Pamja vendoset kur hapet faqja: ndezja ose fikja e pilotit në një skedë tjetër shihet pas rifreskimit. Ndryshimi i turnit aktiv dhe i drafteve shihet menjëherë.
- Kopja rezervë, pikat e rikthimit dhe kyçja me PIN mbeten në vendin e tyre, më poshtë në faqe; skeda Të dhënat ka një lidhje drejt tyre.
- Listat e “Fillo këtu” dhe ato të rezultatit më poshtë filtrojnë njësoj; pas një klikimi në listën e poshtme fokusi kalon te e njëjta vlerë në listën e sipërme.
- Rezultati i plotë ekzistues (trendi, matrica, përmbledhja) mbetet në skedën Puno, poshtë regjistrit; prototipi nuk e tregonte.
- Një rresht pa datë (i importuar dikur) dërgon veprimin pa `origin`.

### 7.2 Hapi 5: “Hap burimin”

Bërë më 21 nëntor 2026.

**Rruga.** Një veprim që ka `origin` të Kontrollit të dëmeve merr te lista e veprimeve lidhjen “Hap burimin”. Lidhja çon te Kontrolli i dëmeve i gjuhës së ruajtur te `origin.lang`, me `?source=<id e veprimit>` dhe asgjë tjetër në adresë. Faqja e dëmeve e lexon veprimin nga lista e ruajtur në shfletues (`sc-actions`) dhe prej tij `origin`, me të njëjtat rregulla vlefshmërie si lista (një test i krahason të dyja). Lista e veprimeve është një për tri gjuhët, ndaj edhe faqja angleze e listës çon te regjistri shqip kur veprimi erdhi prej tij.

**Çfarë hapet.**

| Burimi | Çfarë tregon faqja |
| --- | --- |
| Periudhë | Datat e ruajtura. |
| Filtër | Datat e ruajtura dhe filtri i ruajtur. |
| Rresht me `id` | Rreshti me atë `id`. Kur nuk është këtu: periudha, me fjalët që rreshti nuk gjendet në këtë pajisje. |
| Rresht pa `id`, një përputhje | Rreshti, si burimi. |
| Rresht pa `id`, disa përputhje | Të gjithë, si kandidatë; asnjë nuk zgjidhet. |
| Rresht pa `id`, në krijim disa identikë, tani një | Ai që ka mbetur, si “kandidati i mbetur”: mund të jetë ai vetë, ose jo. |
| Rresht pa `id`, asnjë përputhje | Periudha, me fjalët që rreshti nuk gjendet më. |

Përputhja për një rresht pa `id` bëhet me fushat që veprimi ka ruajtur (data, turni, hapi, shkaku, njësitë), vetëm mes rreshtave pa `id`.

**Vetëm për lexim.** Periudha e burimit i huazohet faqes: periudha e vetë përdoruesit mbetet ajo që është ruajtur, shkruhet e pandryshuar nga çdo ruajtje sa kohë pamja është e hapur, dhe kthehet kur pamja lihet. Hapja dhe mbyllja e pamjes nuk shkruajnë asgjë. Turni aktiv, draftet dhe cilësimi i pilotit nuk preken; pamja punon njësoj edhe aty ku piloti është i fikur. Kur përdoruesi zgjedh vetë një periudhë gjatë pamjes, pamja mbyllet dhe ajo zgjedhje është e tija.

**Kur burimi mungon.**

- Veprim i vjetër pa `origin`: lista nuk i jep lidhje. I hapur me dorë, faqja thotë që veprimi nuk e thotë nga erdhi dhe nuk huazon asgjë.
- Regjistër i pastruar, ose pajisje që ka listën e veprimeve por jo regjistrin: faqja hapet, emërton burimin dhe thotë “Burimi nuk gjendet në këtë pajisje”. Shembulli që faqja ngarkon vetë në një pajisje pa regjistër nuk merret kurrë për regjistër, dhe faqja e thotë.
- `id` që lista nuk e ka: faqja thotë që veprimi nuk është në listën e kësaj pajisjeje.
- Faqja e një gjuhe tjetër: thotë në cilën gjuhë është regjistri burim dhe çon atje.

**Ndryshim jashtë pamjes.** Pamja e punës (hapi 4) e rishkruante draftin e pandryshuar kur faqja largohej. Tani nuk shkruan kur drafti i ruajtur është i njëjtë me formularin, që një faqe që vetëm shihet të mos shkruajë asgjë.

**Kufizimet.**

- “Hap periudhën” ndryshon rezultatin dhe kokën e faqes. Tabela e regjistrit, si gjithmonë, tregon regjistrimet më të fundit pa i kufizuar sipas periudhës; ajo ngushtohet vetëm kur burimi është një rresht, te kandidatët.
- Vëllimi i shkruar për periudhën e vetë përdoruesit nuk vlen për periudhën e huazuar, ndaj shkalla mund të mos dalë në pamjen e burimit; faqja e thotë me shënimin e saj të zakonshëm.
- Kur lista e veprimeve është e kyçur me PIN, veprimi nuk lexohet dhe faqja thotë që nuk është në listë.
- Banderola “Erdhe nga…” e prototipit për kalimet e tjera (5 Whys, Pareto, karta) nuk është bërë: ky hap mbulon vetëm kthimin nga lista e veprimeve.
- Vetëm Kontrolli i dëmeve hap burimin; Kontrolli i plotësisë dhe Regjistri i Night Audit nuk dërgojnë `origin`.

Hapat 1 dhe 2 nuk varen nga njëri-tjetri. Hapi 3 kërkon hapin 2. Hapat 5 dhe 7 kërkojnë hapat 1a dhe 4. Hapi 1c nuk bllokon asnjë hap tjetër: pa të, veprimet nga një rresht përdorin kopjen e fushave.

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

### Bërë në repo

Në degën `claude/vigilant-pascal-bf9nhn`, pa PR. Të gjitha testet e repo-s kalojnë, bashkë me testet në shfletues për kalimin e veprimeve.

- **1a:** `origin` pranohet vetëm i plotë, shkruhet një herë, udhëton vetëm me shënimin e skedës dhe del i njëjtë pas kopjes rezervë dhe pas sinkronizimit. Një veprim pa `origin` ka formën që kishte.
- **1b:** `id` e një rreshti mbahet gjatë hapjes dhe ruajtjes në të tria regjistrat. Një `id` e pavlefshme hidhet dhe rreshti mbetet.

- **3:** mbyllja e përbashkët dhe mbartja në nisjen e shprehur, te faqja e Dorëzimit; dorëzimi jashtë sinkronizimit; turni aktiv pas rikthimit (3.7).
- **2:** turni aktiv dhe draftet ruhen dhe lexohen me rregullat e pjesës 6; skedari i punës i mban draftet dhe jo turnin aktiv; sinkronizimi nuk ndan asnjërin.

Asnjë mjet nuk dërgon `origin`, asnjë faqe nuk shkruan `id`, dhe asnjë faqe nuk shkruan draft. Turnin aktiv e vendos vetëm nisja e turnit te faqja e Dorëzimit. Ndërfaqja e re e Kontrollit të dëmeve dhe faqja “Sot” nuk janë ndezur. E vetmja gjë e re në faqe është pyetja për draftet që ndryshojnë, e cila hapet vetëm kur një skedar ose pikë rikthimi mban një draft të tillë, pra jo para hapit 4.

### Verifikuar në kodin e repo-s

- Identiteti i vendit të punës, renditja e turneve dhe sjellja e dy pajisjeve (pjesa 3).
- Me sinkronizimin e vërtetë: dorëzimi jashtë, dëmet brenda, në katër raste (3.4).
- Me kopjen rezervë të vërtetë dhe mbartjen si model: gjashtë raste rikthimi (3.5).
- Dorëzimi ka tashmë mbyllje, historik dhe gjendje transferimi.
- Rreshtat e regjistrit nuk kanë `id`; sinkronizimi i njeh nga përmbajtja.
- Kopja rezervë merr çdo çelës `sc-` që nuk është te `SKIP`; sinkronizimi anashkalon çelësat `-ui`.

### Pret verifikim gjatë integrimit

| Çfarë | Në cilin hap |
| --- | --- |
| Sa kohë duhet që çdo pajisje të marrë versionin që e mban `id`-në, para se të dalë 1c. | 1c |
| Rreshtat e rinj me `id` dhe të vjetrit pa `id` në faqet e vërteta, mes dy pajisjeve. | 1c |
| Tri përfundimet e “Hap burimin” për rreshta pa `id`. | 5 |
| Sjelljet e drafteve që varen nga mbyllja (6.8): turni i mbyllur, paralajmërimi i mbylljes, K12. | 3 |
| Ndërfaqja për një turn “të paqartë” (6.6): si i tregohet përdoruesit dhe si e zgjidh. | 4 |
| Mbyllja pa dorëzim dhe nisja e shprehur nga faqja e Dorëzimit, pa “Sot”. | 3 |
| K15 për udhëzuesin: botim i ri i udhëzuesit të shtypur, me emrin e ri të butonit dhe fjalinë për sinkronizimin. | botim |
| Profil me turne të personalizuara: ndërfaqja e re nuk ndizet dhe thotë pse. | 4 |
| Kontrolli i plotësisë dhe Regjistri i Night Audit nuk ndryshojnë. | 4 |
| Tri gjuhët, aksesueshmëria, puna pa internet, kyçja me PIN, modaliteti në terren. | 4, 5, 6 |
| Para/pas me vëllimet e ruajtura të çdo periudhe dhe me periudha pa vëllim. | 7 |

---

## 9. Jashtë këtij plani

- Bashkimi i dorëzimit për hyrje dhe për çështje te sinkronizimi, që do ta hiqte kufizimin e pilotit (3.4).
- Kontrolli i dëmeve për hotelin.
- Ndërfaqja e re te Kontrolli i plotësisë dhe Regjistri i Night Audit.
- Regjistrimi nga “+” pa e hapur mjetin.
- **Çështja e propozuar nga Kontrolli i dëmeve te Dorëzimi** (përmirësim i mundshëm pas pilotit). Prototipi e tregon: dalja “Te dorëzimi” mbart fjalinë e problemit si çështje të propozuar. Sot dalja vetëm hap faqen. Dorëzimi ka dy hyrje ekzistuese për një çështje: `?issue=` në adresë (5 Whys), që do ta vinte fjalinë në URL, dhe shënimi i skedës `sc-case-handoff`, që pranohet vetëm nga CX Control Tower me numër rasti. Për ta bërë pa përmbajtje në adresë, Dorëzimi duhet të pranojë shënimin edhe nga Kontrolli i dëmeve; rregullat e hapit 3 për çështjet hyrëse (ruajtja kur nuk ka turn, konsumimi vetëm pas ruajtjes) do të vlenin njësoj.
- Dy filtra njëkohësisht.
