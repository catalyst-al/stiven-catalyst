# Auditim i hapit 1 (pjesët 1a dhe 1b)

Material për auditim para hapit 2 të `PLANI.md`. Përgatitur më 12 nëntor 2026.
Nuk ka ndryshime funksionale pas commit-it të audituar. Hapi 1c mbetet në pritje: asnjë faqe nuk krijon `id` dhe fshirja nuk ka ndryshuar.

---

## 1. Commit-i, push-i dhe skedarët

| | |
| --- | --- |
| Commit-i i audituar | `834f4e3eabdaf390d184c62aed795e08a532b640` |
| Dega | `claude/vigilant-pascal-bf9nhn` |
| Baza e punës | `b70bd8f541fa31959182ffce6111edddd98b2efa` (`origin/main`, e njëjtë me `git merge-base`) |
| Push | `git ls-remote origin refs/heads/claude/vigilant-pascal-bf9nhn` ktheu të njëjtën SHA |
| PR, merge, publikim | Asnjë |

Tre commit-e mbi bazën:

| SHA | Çfarë është |
| --- | --- |
| `ab421f6569bf09302fb0d660f35504e4c8940486` | Dokumentim: plani dhe prototipi i ngrirë. |
| `ec257a46a97fa6eebe042f4b9ac412e8927d43f5` | Dokumentim: kufizimi i pilotit dhe kriteret e hapit 3. |
| `834f4e3eabdaf390d184c62aed795e08a532b640` | Implementimi i 1a dhe 1b, me testet dhe dokumentimin e tyre. |

**Dokumentimi i mëparshëm** (`git diff --name-status origin/main..ec257a4`): tetë skedarë të rinj, të gjithë nën `docs/plan-sot-2026-11-11/`. Asnjë skedar nën `src/` ose `tests/`.

```
A docs/plan-sot-2026-11-11/PLANI.md
A docs/plan-sot-2026-11-11/prototip-sot.html
A docs/plan-sot-2026-11-11/prova/dy-drafte-njekohesisht.cjs
A docs/plan-sot-2026-11-11/prova/dy-pajisje.cjs
A docs/plan-sot-2026-11-11/prova/dy-turne-mesnata-burimi.cjs
A docs/plan-sot-2026-11-11/prova/rikthimi-nga-backup.cjs
A docs/plan-sot-2026-11-11/prova/sinkronizimi-pa-dorezimin.cjs
A docs/plan-sot-2026-11-11/prova/skenari-i-plote.cjs
```

**Implementimi** (`git diff --name-status ec257a4..834f4e3`): 8 skedarë, 553 rreshta të shtuar, 19 të hequr.

| Skedari | Lloji | Çfarë ndryshon |
| --- | --- | --- |
| `src/js/actions-store.js` | kod | `originOf`, `origin` te `clean`, `update`, `link`, `fromParams`. |
| `src/js/tool-kit.js` | kod | `origin` te shënimi i kalimit (`trackerUrl`); `rowAside` te `newRows` dhe `logBook`. |
| `src/js/defect-log.js` | kod | `rowIdOf`; `id` mbahet kur rreshtat lexohen; `rowAside: ["id"]`. |
| `tests/action-origin.test.cjs` | test i ri | 9 teste për `origin`. |
| `tests/log-row-ids.test.cjs` | test i ri | 6 teste për `id` e rreshtit. |
| `docs/DATA-FORMATS.md` | dokumentim | Forma e `origin` dhe rregulli i `id`-së së rreshtit. |
| `docs/plan-sot-2026-11-11/PLANI.md` | dokumentim | Ndarja e hapit 1 dhe pjesa 5.1. |
| `docs/plan-sot-2026-11-11/prova/id-e-rreshtave.cjs` | skript prove | Shtatë raste sinkronizimi. |

Tre skedarë kodi, dy skedarë testesh, tre skedarë dokumentimi.

---

## 2. Testet dhe build-i

Të gjitha u nisën përsëri për këtë auditim, mbi një pemë pune të pastër te commit-i i audituar. Skripti e shkroi SHA-në dhe numrin e skedarëve të ndryshuar para dhe pas: `834f4e3eabdaf390d184c62aed795e08a532b640`, `dirty=0` në të dy rastet. Node `v22.23.4`, Playwright `1.64.1`, 12 nëntor 2026, 18:59–19:16 UTC.

| Komanda | Rezultati | Kohëzgjatja |
| --- | --- | --- |
| `npx eleventy --quiet` (build) | Dalje 0. 928 skedarë të shkruar, 4845 të kopjuar. | 114 s |
| `npm test` (`node --test tests/*.test.cjs`) | Dalje 0. **1503 teste, 1503 kaluan**, 0 dështuan, 0 u anashkaluan. | 202 s |
| `npx playwright test -c tests/browser/playwright.config.mjs --trace off` | Dalje 0. **298 teste, 298 kaluan**, në 17 skedarë. | 11,6 min |

**Korrigjim i raportit të mëparshëm.**

- Më parë raportova “1503 teste dhe 41 teste në shfletues”. Ato u nisën mbi pemën e punës para commit-it. Nuk ndryshova asnjë skedar mes atyre testeve dhe commit-it, por kjo nuk mund të provohet më pas. Prandaj rezultatet e mësipërme janë nga një nisje e re mbi commit-in.
- 41 testet në shfletues ishin vetëm 3 nga 17 skedarët (`tool-pages`, `action-handoff`, `journeys`). Tabela më lart ka gjithë grupin.

Testet e njësisë që hapin faqet e mjeteve i marrin faqet nga `_site` dhe skriptet nga `src/js` (`tests/helpers/tool-page.cjs`). Prandaj build-i u nis para tyre, mbi të njëjtin commit.

Skriptet e `prova/` nuk janë pjesë e `npm test`. Të shtata kaluan mbi të njëjtin commit; i teti (`fshirja-me-id.cjs`) u shtua për këtë auditim.

---

## 3. Ruajtja e `id`-së së rreshtit

Vlen për tri regjistrat që ndajnë `src/js/defect-log.js`: `sc-damage-control`, `sc-incomplete-control`, `sc-night-audit`, në të tria gjuhët.

**Asnjë faqe nuk krijon `id`.** Në kod nuk ka asnjë vend që i vë `id` një rreshti: `rowIdOf` (`defect-log.js:64`) vetëm e kontrollon një `id` që është tashmë aty. Hyrja nga forma (`defect-log.js:676`, `book.add(row)`) dhe rreshtat e ngjitur (`tool-kit.js:1308`) shkruhen pa `id`.

Rrugët që e prekin një rresht, dhe prova për secilën:

| Rruga | Ku është në kod | Prova |
| --- | --- | --- |
| **Leximi** kur hapet faqja | `defect-log.js:65–76`: rreshtat rindërtohen fushë për fushë; rreshti 74 e mban `id`-në e vlefshme, të fundit në rresht. | `tests/log-row-ids.test.cjs:29`, për secilën nga tri regjistrat: `id` mbijeton dy vizita me ruajtje. |
| `id` e pavlefshme | `defect-log.js:64`: vetëm shkronja, shifra, `_` dhe `-`, deri në 40. | `tests/log-row-ids.test.cjs:48`: shtatë forma të pavlefshme hidhen, rreshti mbetet. |
| **Redaktimi** | Regjistrat nuk kanë redaktim rreshti. Një rresht shtohet, ngjitet, hiqet ose pastrohet bashkë me regjistrin. | Nuk ka çfarë të provohet për redaktim. Rrugët e tjera janë më poshtë. |
| Heqja dhe “Zhbëj” | `tool-kit.js:1318` dhe `1322`: i njëjti objekt rikthehet në vendin e vet. | `tests/log-row-ids.test.cjs:101` (shtuar për auditimin): rreshti i hequr kthehet i njëjti, me `id`. |
| Ruajtja pas një cilësimi | `defect-log.js:77` (`save`): ruhet `state` siç është. | `tests/log-row-ids.test.cjs:116` (shtuar për auditimin): pas ndryshimit të vëllimit, rreshtat janë bajt për bajt si para. |
| **Importimi** (ngjitja) | `tool-kit.js:1156–1168`: `rowKey` e lë mënjanë `id`; `defect-log.js:537` e kërkon këtë. | `tests/log-row-ids.test.cjs:59`: rreshti i ngjitur njihet si i njëjti me atë që ka `id`; rreshtat ekzistues i mbajnë `id`-të. |
| **Kopja rezervë** | `work-backup.js:80–87` (`makeBackup`) dhe rikthimi: teksti i çelësit kopjohet i tërë, pa u lexuar. | `tests/log-row-ids.test.cjs:129` (shtuar për auditimin): skedari i bërë dhe i lexuar me kodin e vërtetë e mban `id`-në, dhe faqja që e hap nuk i jep `id` asnjë rreshti. |
| **Sinkronizimi** | `team-sync.js:402–429` (`mergeRows`): rreshtat me `id` bashkohen sipas `id`-së. | `tests/log-row-ids.test.cjs:73`: pajisja që e mban `id`-në ka rreshtin si ekipi dhe asgjë nuk merret për të fshirë. |

**Rreshtat e vjetër nuk marrin `id`.** `tests/log-row-ids.test.cjs:29` hap secilën regjistër me një rresht me `id` dhe një pa, shton një hyrje, rihap faqen dhe shton një tjetër. Në fund: `['r-8f3k2', '', '', '']`. Rreshti i vjetër dhe dy hyrjet e reja janë pa `id`.

**Importimi i përsëritur nuk krijon dublikata.**

- Pa `id`, si sot: `tests/log-integrity.test.cjs:18` (test ekzistues, i pandryshuar) ngjit të njëjtat rreshta dy herë dhe pas rifreskimit; mbeten dy.
- Me `id` te rreshtat ekzistues: `tests/log-row-ids.test.cjs:59`.

**Kufiri i provës.** Testet e mësipërme hapin faqet e vërteta nga `_site` me skriptet nga `src/js`, në jsdom. Sinkronizimi provohet te funksioni i bashkimit (`TeamSyncMath.merge`) dhe, te skriptet e `prova/`, me `TeamSync.syncOnce` kundër një serveri të rremë. Asnjë provë nuk është bërë me dy shfletues të vërtetë kundër serverit të vërtetë.

---

## 4. Mekanizmi ekzistues i fshirjes

Ky mekanizëm është në repo para këtij plani (`team-sync.js:24–34` e përshkruan) dhe nuk është ndryshuar. Sot vlen për mjetet që kanë `id` te rreshtat, si lista e veprimeve.

Si punon:

1. **Baza.** Pas çdo sinkronizimi pajisja mban, për çdo regjistër, `id`-të e rreshtave që ishin në kopjen e ekipit (`baseOf`, `team-sync.js:538–551`).
2. **Zbulimi.** Një `id` që ishte te baza dhe nuk është më te pajisja merret për rresht të fshirë këtu (`goneHere`, `team-sync.js:442`; `deletedHere`, `499`).
3. **Guri i varrit.** Sinkronizimi e heq rreshtin nga kopja e ekipit dhe lë te `deleted` çelësin, `id`-në dhe kohën.
4. **Përhapja.** Çdo pajisje që e lexon gurin e heq rreshtin, çfarëdo që mban prej tij (`mergeRows`, `team-sync.js:422`; `dropDead`, `431`).
5. **Skadimi.** Gurët mbahen 90 ditë (`TOMBSTONE_DAYS`, `team-sync.js:48`; `purgeDeleted`, `517`).
6. **Pas skadimit.** Një pajisje që ende e mban rreshtin e heq gjithsesi nëse nuk e ka ndryshuar që nga sinkronizimi i saj i fundit (`team-sync.js:423`).
7. **Rikthimi nuk është fshirje.** Pas një skedari ose pike rikthimi, `rebase` (`team-sync.js:1096`) i heq nga baza `id`-të që rikthimi nuk i ka, që të mos merren për të fshira.

**Pse `id` e mundëson.** Çdo hap i mësipërm punon me `id`: baza i mban rreshtat sipas `id`-së, guri i varrit është një `id`, dhe heqja kërkon `id`. Një rresht pa `id` njihet vetëm nga përmbajtja e plotë, prandaj kur mungon te një pajisje, sinkronizimi nuk dallon dot “u fshi” nga “nuk ka mbërritur ende” dhe e sjell përsëri. Kodi e thotë vetë: “Rows without an id, and a whole tool's key, are never deleted by a sync” (`team-sync.js:32`).

Kjo korrigjon atë që shkrova më parë: kthimi i një rreshti të fshirë pa `id` është kufi i njohur dhe i dokumentuar i mekanizmit, jo e metë e fshehur. Humbja e rreshtit të dytë identik (rasti 1 te `prova/id-e-rreshtave.cjs`) nuk e gjeta të dokumentuar.

**Çfarë provojnë testet ekzistuese** (`tests/team-sync-deletions.test.cjs`, të pandryshuara, mbi listën e veprimeve dhe Sendet e gjetura):

| Rreshti | Çfarë provon |
| --- | --- |
| 74, 106, 187 | Fshirja në një pajisje e heq rreshtin te tjetra dhe mbetet e hequr. |
| 135 | Fshirje në një pajisje dhe ndryshim në tjetrën njëkohësisht: fshirja fiton, në çdo rend. |
| 93, 233 | Gurët skadojnë pas 90 ditësh; pajisja që mungoi aq gjatë e heq gjithsesi rreshtin që nuk e ndryshoi. |
| 220 | Kopja e vjetër pa gurë varri (versioni 1) lexohet dhe bashkohet. |
| 268 | Skedari ose pika e rikthimit e vënë mbrapsht nuk është fshirje: ekipi i mban rreshtat që skedarit i mungojnë. |

**Çfarë provova shtesë, për një pajisje që kthehet me të dhëna të vjetra** (`prova/fshirja-me-id.cjs`). Rreshtat e dëmeve me `id` vihen me dorë, sepse asnjë faqe nuk i krijon; kodi i sinkronizimit është ai i repo-s.

| Rasti | Rezultati |
| --- | --- |
| F1. A fshin një rresht | Hiqet te të dyja; kopja e ekipit ka gurin e tij. |
| F2. B kthehet pas 10 ditësh me rreshtin ende te vetja | Guri e heq. |
| F3. B e ndryshon rreshtin para se të marrë vesh fshirjen | Fshirja fiton. |
| F4. B rikthen një kopje të vjetër që e ka rreshtin, brenda 90 ditëve | Rreshti del te B pas rikthimit dhe hiqet në sinkronizimin tjetër. Nuk kthehet te ekipi. |
| F5. E njëjta gjë pas 91 ditësh | Guri ka skaduar. **Rreshti i fshirë kthehet te të dyja pajisjet.** |
| F6. B mungon 91 ditë me rreshtin të pandryshuar | Rreshti hiqet gjithsesi. |
| F7. Sot, pa `id` | Fshirja nuk kalon dhe nuk lë gur. Sjellja e sotme është e pandryshuar. |

**Kufijtë.**

- F5 është kufi i mekanizmit ekzistues: një kopje rezervë më e vjetër se 90 ditë e ringjall një rresht të fshirë. Vlen sot për listën e veprimeve dhe do të vlente për dëmet pas 1c.
- F3 thotë që fshirja fiton. Që versioni i ndryshuar mbetet te pika e rikthimit e thotë kodi (`team-sync.js:27–29`); këtu nuk e kam provuar.
- F7 konfirmon që 1b nuk e ka ndryshuar fshirjen.

---

## 5. Kushti i propozuar për aktivizimin e 1c

**Koha nga publikimi nuk është provë.** Faqet merren nga rrjeti kur ka dhe nga kopja e ruajtur kur nuk ka (`src/sw.js:1–7`), dhe një faqe e hapur vazhdon me skriptet me të cilat u hap. Një pajisje mund të punojë me kod të vjetër pa kufi kohe. Kopja e ekipit mban për çdo pajisje vetëm `id`, emrin dhe kur u pa (`team-sync.js:343–345`), deri në dhjetë; nuk mban versionin e faqes. Pra sot nuk ka të dhënë nga e cila të provohet që një pajisje është përditësuar.

Prandaj kushti nuk mund të jetë “kanë kaluar N ditë”. Propozoj që 1c të ndizet vetëm kur plotësohen të gjitha këto, secila me test në repo:

| Nr. | Kushti | Prova e kërkuar |
| --- | --- | --- |
| C1 | **Mbyllje në format.** Një kopje ekipi që mban rreshta regjistri me `id` shkruhet në një version që faqet para 1b nuk e lexojnë. Sot faqja lexon versionet 1 dhe 2 (`READ_VERSIONS`, `team-sync.js:47`) dhe një version tjetër e ndal sinkronizimin si “unreadable”, pa shkruar asgjë (`team-sync.js:888`). | Test që nis skriptet e ngrira të para 1b (si `tests/fixtures/pre-phase1`) kundër një kopjeje të tillë dhe tregon: sinkronizimi ndalet, ruajtja e pajisjes nuk ndryshon, nuk dërgohet asgjë, nuk lihet gur varri. |
| C2 | **Leximi para shkrimit.** Versioni i ri i kopjes lexohet nga një publikim që ende nuk shkruan `id`. Commit-i i audituar nuk e lexon; kjo duhet shtuar para 1c. | Test që faqja pa shkrim `id`-sh e lexon dhe e bashkon kopjen e re. |
| C3 | **Pajisja shkruan `id` vetëm pasi e ka çuar vetë kopjen e ekipit në versionin e ri**, ose kur nuk është në ekip. | Test me dy pajisje: asnjë `id` nuk del nga një pajisje para se kopja të jetë në versionin e ri. |
| C4 | **Hyrja në ekip.** Një pajisje me rreshta me `id` hyn në një ekip që i ka të njëjtët rreshta pa `id`. Sot kjo jep dublikata (rasti 5 te `prova/id-e-rreshtave.cjs`). | Zgjidhje e përcaktuar dhe test që tregon zero dublikata. Pa këtë, 1c nuk ndizet. |
| C5 | **Skedari i punës.** Një skedar me `id` i hapur në një faqe të vjetër. | Test që tregon çfarë mbetet te ajo pajisje dhe që C1 e ndal të ndajë me ekipin. |
| C6 | **Fshirja pranohet shprehimisht.** Me `id`, fshirja kalon te gjithë ekipi (F1–F6), me kufirin e 90 ditëve (F5). | Vendim i shkruar i pronarit; teksti i faqes dhe i udhëzuesit në tri gjuhët. |
| C7 | **Kthimi mbrapsht.** 1c mund të fiket pa prishur `id`-të që ekzistojnë. | Test: me 1c të fikur faqja nuk shkruan `id` të reja dhe i mban ato që ka. |

C1 është ai që e bën kushtin të pavarur nga koha: një faqe e vjetër nuk përditësohet dot me detyrim, por mund të ndalet të bashkojë të dhëna që nuk i kupton.

**Çfarë nuk di.** C1 dhe C2 kërkojnë ndryshim te formati i sinkronizimit, që prek çdo ekip, jo vetëm pilotin. Nuk e kam vlerësuar çfarë sheh përdoruesi i një faqeje të vjetër kur sinkronizimi i saj ndalet, as nëse serveri i sinkronizimit (`workers/sync`) ka ndonjë rol. C4 nuk ka ende zgjidhje.

---

## 6. Varësitë e hapit 2

Hapi 2 është turni aktiv dhe draftet (`PLANI.md`, pjesa 6).

| Nga çfarë | A varet hapi 2 | Pse |
| --- | --- | --- |
| **1c** (shkrimi i `id`-ve) | Jo | Draftet mbajnë vlerat e formës (hapi, shkaku, njësitë, shënimi) para se të bëhen rresht. Çelësi i një drafti është data operative dhe turni. Asgjë te hapi 2 nuk lexon ose shkruan `id` rreshti. |
| **1a** (`origin`) | Jo | Hapi 2 nuk prek veprimet. |
| **1b** (mbajtja e `id`-së) | Jo | Hapi 2 nuk prek leximin e rreshtave. |

Dy pika takimi që nuk janë varësi, por duhen ditur:

- Hapi 2 shton një çelës te lista `SKIP` e `work-backup.js`. Testi `tests/data-formats.test.cjs:21` kërkon që çdo çelës i asaj liste të jetë te `docs/DATA-FORMATS.md`.
- Hapi 2 dhe 1c prekin të dy `defect-log.js` më vonë (forma në hapin 4, rreshtat në 1c), por jo të njëjtat rreshta kodi.

Pjesa e papërfunduar e hapit 1 që prek hapa të tjerë: vetëm hapi 5 (“Hap burimin”) për rreshta, që pa 1c përdor kopjen e fushave dhe `twins`. Kjo është rruga e parashikuar te `PLANI.md` 5.1.

---

## 7. Çfarë u shtua për këtë auditim

Pas commit-it të audituar u shtuan vetëm teste dhe dokumentim. Asnjë skedar nën `src/` nuk u prek.

| Skedari | Çfarë |
| --- | --- |
| `tests/log-row-ids.test.cjs` | Tri teste të reja (rreshtat 101, 116, 129), që mbyllin tri rrugë që më parë mbështeteshin vetëm te leximi i kodit: heqja me “Zhbëj”, ruajtja pas një cilësimi, kopja rezervë. |
| `docs/plan-sot-2026-11-11/prova/fshirja-me-id.cjs` | Shtatë rastet e pjesës 4. |
| `docs/plan-sot-2026-11-11/AUDITIM-HAPI-1.md` | Ky dokument. |

Rezultatet e testeve për commit-in që i mban këto shtesa janë te mesazhi që e shoqëron, jo këtu: dokumenti nuk mund të përmbajë SHA-në e commit-it ku ndodhet vetë.
