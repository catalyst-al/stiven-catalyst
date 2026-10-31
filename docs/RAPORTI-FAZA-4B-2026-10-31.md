# Stiven Catalyst Tools, Faza 4B: riinspektimi dhe verifikimi me provë (Room Inspection → Action Tracker → Done → Reinspection → Verified / Reopened)

Data: 31 tetor 2026. Dega `feature/room-inspection-recheck-verification`, nga `main` `171f8b7a` (pas PR #369, Faza 4A).
Draft PR, pa merge, pa deploy. Team Sync Worker, Cloudflare, planetët dhe përmbajtja editoriale të paprekura. Çdo
dhomë, defekt dhe emër në teste është i shpikur.

Parimi: një veprim i shënuar **Done** është një punë e raportuar e kryer; **Verified** është defekti i parë i rregulluar
në dhomë. Verified vjen vetëm nga një riinspektim real i defektit origjinal.

## 1. PARA (kodi i `main` pas 4A)

- Defekti kishte identitet (`ref`, id deterministike) dhe lidhje inspektim → veprim, por **asnjë rrugë verifikimi**:
  veprimi i Room Inspection shënohej Verified me dorë në Action Tracker, me një rezultat të shkruar, pa asnjë
  kontroll në dhomë.
- "Re-check" ekzistonte vetëm si rregull i llogaritjes (e njëjta dhomë sërish ditën që dështoi), jo si veprim i
  supervizorit: s'kishte buton, s'kishte lidhje me inspektimin origjinal, s'kishte provë.
- Një riinspektim i bërë si inspektim i ri ditën tjetër numërohej si **inspektim i parë** (fryrje e First-Time Pass)
  dhe, me të njëjtin defekt të dështuar, krijonte një veprim të dytë me identitet tjetër.

## 2. PAS

| Pika | Zgjidhja |
| --- | --- |
| Riinspektimi | Butoni **Reinspect** te çdo rresht me defekt mirëmbajtjeje **të vetin** në tracker (open, done ose verified), përfshirë një riinspektim për defektet e reja që gjeti (§10, rasti 2). Drafti bëhet riinspektim i **atij rreshti**: `kind: "recheck"`, `recheckOf: <row.id>`, e njëjta dhomë, kat, tip dhe checklist (fushat e kyçura), data sot, **asgjë e shënuar pass vetvetiu**. Shënimi mbi draft emërton inspektimin dhe defektet për kontroll; çdo artikull për kontroll mban shenjën e gjendjes së veprimit (done / still open / verified / not in tracker / cannot be matched). Riinspektimi në vazhdim ruhet në draft dhe mbijeton rifreskimin |
| Identiteti dhe përputhja | Para çdo shkrimi në veprim: veprimi gjendet sipas id/`ref` (4A) dhe duhet të ketë `source: "room-inspection"`, `ref === "<origin.id>|<qid>"` dhe titull që mbaron me tekstin **aktual** të artikullit të checklist-it. Checklist i ndryshuar, artikull i zhdukur, id e mbajtur nga referencë/mjet tjetër, veprim pa `ref` → **asnjë ndryshim**, arsyeja në log |
| Rasti A: Done + Pass | `ActionsStore.update(id, { status: "verified", closed: <data e riinspektimit>, result: <rezultati i mëparshëm> · "Verified by the re-inspection of room 412 on …: <artikulli> passes.", proof }, { byRecheck: true })` |
| Rasti B: Done + Fail | `{ status: "open", result: … · "Re-inspection …: <artikulli> fails again; reopened.", proof }`; asnjë veprim i dytë për të njëjtin defekt (gabimi i riinspektimit nuk dërgohet si defekt i ri) |
| Rasti C: Open / Doing | Asgjë nuk verifikohet (puna s'është raportuar Done), **as më vonë** kur veprimi bëhet Done: gjendja e veprimit në çastin e kontrollit ruhet me rreshtin (`checks`, §10 rasti 1); fail = i njëjti defekt, pa kopje; arsyeja "the action was not done when checked" |
| Rasti D: Verified | Prova e vjetër **nuk preket**. Pass → "verified before, passes". Fail → **defekt i ri** me identitetin e riinspektimit (`ri-<recheck.id>-<qid>`, `ref "<recheck.id>|<qid>"`), i dërguar si çdo defekt i 4A; veprimi i vjetër mbetet Verified me provën e tij |
| Rasti E: i pakontrolluar / N/A | Statusi i pandryshuar; arsyeja "not checked" |
| Prova | `proof: { recheck, date, time, qid, item, answer }` mbi veprim, e pastruar e plotë ose aspak (`proofOf`), e shkruar vetëm me `byRecheck`; çdo thirrës tjetër e ruan atë ekzistuese. Tracker-i e shfaq ("Checked in the room on …: … passes / fails again") |
| Mbrojtja e Verified | `ActionsStore.update`: për veprim me `source: "room-inspection"` dhe `ref` të vlefshëm (`byRecheckOnly`), kalimi në Verified pa `byRecheck` refuzohet (`lastUpdate = "recheck-verifies"`). Tracker-i e çaktivizon opsionin dhe e thotë. `byCase` (Pilot 1), verifikimi manual i veprimeve të zakonshme dhe i veprimeve të vjetra pa `ref` **të pandryshuara**. Rihapja me dorë e një veprimi të verifikuar lejohet (mirëmbajtja thotë s'u rregullua); prova mbetet si histori |
| Logu | Rreshti i riinspektimit: "re-inspection of {datë}" + shenja `Re-inspection: n verified · n reopened · n to apply · n unchanged` (`data-recheck="v/r/p/u"`, arsyet në `title`) dhe butoni **Apply to actions** kur ka verdikte të pashkruara. Rreshti origjinal: shenja e 4A tregon verified/open |
| KPI | `annotate`: `recheck = e njëjta dhomë sërish ditën që dështoi (si më parë) OSE row.kind === "recheck"`; vetëm një inspektim i zakonshëm që dështon e shënon dhomën për rregullin e ditës (§10 rasti 3). `rateBy` e pandryshuar: riinspektimi as në numerues as në emërues të First-Time Pass; mesatarja merr çdo inspektim me rezultat të plotë (riinspektim i plotë përfshirë); i paploti në asnjërën. Mjetet e tjera (Shift Pulse, Daily Board, Operations Report, Site Compare, Print Pack) lexojnë përmes `RoomInspectionMath.annotate/rateBy`, kështu përjashtimi vlen edhe atje pa ndryshuar përkufizimet e tyre |
| Gjuhët | 47 tekste të reja EN me përkthim DE dhe SQ (`ui.json`); lloji "Re-inspection / Nachkontrolle / Riinspektim" në tri skedarët e të dhënave; testi ekzistues i mbulimit të përkthimeve kalon |

## 3. Integriteti i ruajtjes (renditja e shkrimeve)

Room Inspection (`sc-room-inspection`) dhe Action Tracker (`sc-actions`) janë dy çelësa; dy shkrime nuk janë një
transaksion. Renditja e zgjedhur e bën çdo gjendje të ndërmjetme **të rikuperueshme pa dublikata**:

1. **Rreshti i riinspektimit + drafti i zbrazur, një shkrim** (si 4A §7b). Nëse dështon (quota, PIN): rreshti hiqet,
   drafti rikthehet (mbetet riinspektim, me `recheckOf`), asnjë veprim nuk preket, mesazh.
2. **Çdo verdikt = një `update` i tracker-it me provën brenda** (status + `proof` + `result` + `closed` në të njëjtin
   shkrim të `sc-actions`). Nuk ka shkrim të dytë te Room Inspection për verifikimin: rreshti i riinspektimit është
   tashmë prova e ruajtur, dhe veprimi mban referencën e saj (`proof.recheck`).
3. **Defektet e reja** të riinspektimit shkojnë me `sendMaintenance` + `saveLinks` të 4A (lidhja `sent`, me
   çshënim kur shkrimi dështon).

| Situata | Çfarë ndodh | Rikuperimi |
| --- | --- | --- |
| Ruajtja e riinspektimit dështon | asgjë e dërguar, drafti i paprekur, mesazh "could not save the inspection" | ruaj sërish |
| Përditësimi i veprimit dështon (quota / PIN) | riinspektimi i ruajtur, veprimi i paprekur, mesazh "n could not be written … apply it again from the log"; logu: "n to apply" + **Apply to actions** | klikimi e shkruan; `proof.recheck === row.id` e bën idempotent |
| Përditësimi i veprimit kalon, ruajtja e riinspektimit dështon | **nuk ndodh**: rreshti ruhet para çdo update-i të veprimit | — |
| Rollback dështon | s'ka rollback të nevojshëm: asnjë shkrim i dytë i detyrueshëm pas update-it | — |
| Rifreskim në mes | ose rreshti s'u ruajt (drafti riinspektim i plotë, me `recheckOf`) ose u ruajt dhe verdiktet llogariten live nga prova mbi veprim: të pashkruarat dalin "to apply" | Apply |
| I njëjti riinspektim përpunohet sërish | `recheckOutcomes` sheh `action.proof.recheck === row.id` → "verified/reopened", asgjë për të shkruar; rezultati nuk shtohet dy herë | — |
| Veprimi ndryshon pas kontrollit (riparim i ribërë: open → done me `closed` tjetër) para se verdikti të shkruhet | verdikti i vjetër **nuk** shkruhet mbi riparimin e ri: "the action changed since the check" (`checks[qid]` krahasohet me status + `closed` aktual) | riinspektim i ri |
| Kontroll kur veprimi ishte Open, veprimi bëhet Done më vonë | asgjë, as atëherë as më vonë: "the action was not done when checked" | riinspektim i ri |
| PIN Lock / quota | `ActionsStore.write` kthen false → si "përditësimi dështon" | Apply pas zhbllokimit |

"Verified" shfaqet si sukses **vetëm** kur `update` ktheu veprimin (prova e ruajtur në `sc-actions`); mesazhet e
dështimit nuk përmbajnë fjalën verified.

## 4. Team Sync (provuar, jo supozuar)

`mergeRows` sipas `id`; `pickRow` mban një version (ai që nuk ndryshoi nga baza e sync-ut, përndryshe më i riu sipas
`updated/closed/created`, përndryshe ai i ekipit). ID-të deterministike të 4A dhe `pickRow` të paprekura.

- Riinspektim nga pajisja tjetër: rreshti i ri (id e vet) udhëton; veprimi i verifikuar ka `closed = data e
  riinspektimit` (më e re se `closed` e done) → fiton bashkimin; prova udhëton me veprimin; pajisja tjetër e sheh
  "1 verified", asgjë për Apply (test sync a).
- Status i vjetër që fiton: e njëjta ditë dhe pa vulë dalluese → `pickRow` mban një version të plotë; nëse fiton kopja
  "done", faqja **nuk e fsheh**: riinspektimi me pass pranë një veprimi done del "1 to apply", Apply e rishkruan një
  herë (test sync b).
- **Kufizim i pashmangshëm pa ndryshuar `pickRow`**: rihapja (Rasti B) zbraz `closed`; `newer()` e lexon rreshtin pa
  `closed` si më të vjetër se ai me datë → një kopje e vjetër "done" **fiton** mbi rihapjen. Faqja e tregon si "to
  apply" dhe Apply e rihap sërish (test sync c). Zgjidhja e plotë do kërkonte një vulë `updated` mbi veprimet ose
  ndryshim të `pickRow`, jashtë kufijve të kësaj faze.
- Nuk pretendohet që Team Sync zgjidh ndryshimet e njëkohshme mbi të njëjtin veprim.

## 5. PWA e vjetër dhe të dhënat e mëparshme

| Skenar | Çfarë ndodh |
| --- | --- |
| Rresht `kind: "recheck"` i hapur në faqe të vjetër (pa këtë kod) | `KINDS` i vjetër s'e njeh: lexohet si lloji i parë (checkout) dhe `recheckOf` hiqet **në ruajtjen e radhës të asaj faqeje**; deri atëherë s'preket. Pas përditësimit të PWA-së, rreshti ka humbur lidhjen dhe llojin (del si inspektim i zakonshëm, dhe hyn në First-Time Pass si çdo inspektim i parë). Kufizim i dritares së përditësimit; nuk prish të dhëna |
| Veprim me `proof` në tracker të vjetër | shfaqet dhe punon; `clean()` i vjetër e heq `proof` në update-in e radhës; statusi Verified mbetet; faqja e re e sheh si "verified before" pa provë |
| Tracker i vjetër shënon Verified me dorë një defekt | lejohet atje (s'ka `byRecheckOnly`); faqja e re e trajton si Verified pa provë (Rasti D) |
| Të dhëna të vjetra (pa `kind: "recheck"`, pa `recheckOf`, veprime pa `ref`) | hapen si më parë (test 11); `recheckOf` mbi lloj tjetër ose i dëmtuar hiqet; draft me `recheckOf` drejt rreshti të munguar bëhet draft i zakonshëm |
| Work Backup | `sc-room-inspection` dhe `sc-actions` udhëtojnë të plota me fushat e reja |

## 6. Ndryshimet

- `src/js/actions-store.js`: `proof` (`proofOf`), `byRecheckOnly`, `update(id, patch, { byRecheck })`, refuzimi
  `recheck-verifies`, prova e shkruar vetëm nga riinspektimi.
- `src/js/room-inspection.js`: `recheckOf` në rreshta dhe draft, `blankDraft` pa lloj recheck, `annotate` sipas
  llojit, `recheckTargets / recheckOutcomes / applyRecheck / recheckSummary / sameDefect / isVerifiedBefore`,
  mënyra riinspektim në draft (fushat e kyçura, shënimi, shenjat e artikujve), butonat Reinspect dhe Apply, shenja e
  logut, mesazhet, CSV me kolonën "Re-inspection of", fleta ditore pa "re-check" të dyfishtë.
- `src/js/action-tracker.js`: opsioni Verified i çaktivizuar për veprim defekti, mesazhi, rreshti i provës.
- `src/_includes/partials/room-inspection.njk` (`[data-recheck-note]`), `src/css/37-room-inspection.css`.
- `src/_data/roomInspection.json`, `de/`, `sq/` (lloji recheck); `src/_data/de/ui.json`, `sq/ui.json` (47 tekste).
- `docs/DATA-FORMATS.md`, `README.md`, ky raport.
- Teste: `tests/room-inspection-recheck.test.cjs` (13), `tests/browser/room-inspection-recheck.spec.mjs` (3: EN, DE,
  SQ), `tests/browser/playwright.config.mjs` (spec vetëm në 1440 light), `tests/room-inspection-identity.test.cjs`
  (testi 2 verifikon me `byRecheck`, siç e kërkon rregulli i ri).

Pa prekje: Cloudflare Worker, deploy, planetët, modulet editoriale, CX Tower, `byCase`, `pickRow`, Work Backup,
media-store, work-lock.

## 7. Testet e pranimit

`tests/room-inspection-recheck.test.cjs` (jsdom, faqja e vërtetë):

1. Defekt → Action → Done → Reinspect Pass → Verified: drafti i kyçur, asgjë pass vetvetiu, rreshti recheck me
   `recheckOf`, veprimi verified me `proof` të plotë, `closed` = data e provës, rezultati i mëparshëm i ruajtur, logu
   `1/0/0/0`, pas rifreskimit njësoj.
2. Done → Reinspect Fail → Open: rezultati i dështuar i ruajtur, asnjë veprim i dytë, pastaj riparim + riinspektim i
   dytë → Verified nga i dyti; i pari mbetet histori ("verified by a later re-inspection").
3. I njëjti riinspektim s'verifikon dy herë: tracker që s'ruhet → "to apply" + Apply, dështim i përsëritur i sinqertë,
   rifreskim në mes, Apply i suksesshëm një herë, Apply/rifreskim i dytë pa ndryshim; PIN Lock: ruajtja e
   riinspektimit refuzohet, drafti mbetet riinspektim.
4. Dy defekte me tekst identik: riinspektimi i njërit verifikon vetëm veprimin e tij; dhomë jashtë listës merr
   dhomën/katin e inspektimit.
5. Lidhja me inspektimin e saktë: `recheckOf` = rreshti i klikuar (test 4).
6. I pakontrolluar / N/A / artikull tjetër i përgjigjur → asgjë; veprim open: pass nuk verifikon, fail nuk kopjon;
   defekt i padërguar: asnjë Reinspect.
7. Checklist i ndryshuar (checklist i ekipit me artikullin e riformuluar), id e mbajtur nga mjet/referencë tjetër,
   veprim pa `ref` → asnjë verifikim i gabuar; veprimi pa `ref` verifikohet me dorë si më parë.
8. Verified historik: kontroll i mëvonshëm fail → defekt i ri me identitetin e riinspektimit, prova e vjetër identike;
   pass i mëvonshëm → prova e vjetër identike, asnjë veprim i ri.
9. Dështimet e ruajtjes dhe rikuperimi (test 3) + dyshkrimi i renditjes (ruaj → update → dërgo).
10. KPI First-Time Pass: `annotate/rateBy/overall/weekly` me riinspektime ndër ditë, i plotë dhe i paplotë, rregulli i
    së njëjtës ditë i ruajtur; total, punonjës, kat, javë; "pa riinspektime" jep të njëjtën normë; faqja: figura
    "a of b rooms passed at the first inspection" e pandryshuar pas një riinspektimi pass.
11. Average Score: riinspektimi i plotë në mesatare, i paploti jo (test 10).
12. Të dhëna të vjetra hapen; rreshti recheck lexohet i plotë ose pa lidhje.
13. Pilot 1 (`case-*`, 21 teste) dhe 4A (`room-inspection-identity`, 10 teste) kalojnë pa ndryshim përveç `byRecheck`
    në testin 2.
14. EN/DE/SQ: butoni, shënimi, lloji, mesazhet, rreshti i provës (unit, me `ui-de.js`/`ui-sq.js` të ndërtuara) dhe
    në shfletues (`room-inspection-recheck.spec.mjs`: EN i plotë me tracker, DE dhe SQ).
- Dyqani (test "the store"): `recheck-verifies`, `byRecheck`, prova e hedhur kur shkruhet me dorë, `byCase` dhe
  veprimet e zakonshme si më parë, `proofOf` e plotë ose aspak.
- Tracker-i (faqja): opsioni Verified i çaktivizuar me `title`, refuzimi me mesazh, rreshti i provës pas verifikimit,
  veprimi i zakonshëm verifikohet me dorë.
- Team Sync (test "two devices"): §4 a–c.
- Auditimi i `28d3a357` (§10), teste 14–17, që dështojnë në `28d3a357` (provuar në worktree) dhe kalojnë pas korrigjimeve.

## 8. Rezultatet

Çdo provë me ndërtim të plotë (838 faqe), mbi dy kokat e degës:

| Provë | `28d3a357` (Draft PR i hapur) | korrigjimet e §10 (ky commit) |
| --- | --- | --- |
| `npm test` | 1 402 kalojnë, 0 dështojnë (1 389 të `main` + 13) | **1 406 kalojnë, 0 dështojnë** (+ testet 14–17) |
| Gjithë suita e shfletuesit (6 projekte) | 216 kalojnë, 0 dështojnë, 17,1 min | **216 kalojnë, 0 dështojnë**, 15,8 min (spec-i EN i zgjeruar me bulk pass dhe `checks`) |
| CI e PR-it | run 804: jeshile | shih përshkrimin e PR-it: raportohet vetëm kur ka përfunduar |
| Pilot 1 (`case-thread`, `case-integrity`, `case-kpi`) | 21 teste, pa ndryshim | pa ndryshim |
| Faza 4A (`room-inspection-identity`) | 10 teste; testi 2 verifikon me `byRecheck` (rregulli i ri) | pa ndryshim |
| Mbulimi i përkthimeve (`room-inspection.test`) | kalon me 47 tekstet e reja | kalon me 49 (2 të zëvendësuara, 4 të reja) |

Numrat e testeve janë ata të daljes reale të `node --test` dhe `playwright test` (`# tests 1406 / # pass 1406 / # fail 0`;
`216 passed`). Testet 14–17 dështojnë në `28d3a357` (4/4, provuar në worktree me të njëjtin skedar testesh).

## 9. Rreziqet e mbetura

- Team Sync: rihapja humbet ndaj një kopjeje të vjetër "done" (`pickRow`, §4); faqja e rikthen me Apply, por kërkon
  një klik të supervizorit.
- PWA e vjetër: humbja e `recheckOf`/llojit në ruajtjen e radhës të faqes së vjetër (§5), deri në përditësim.
- Veprim i verifikuar me dorë para 4B ose nga tracker i vjetër: Verified pa provë; faqja e trajton si "verified
  before".
- Riinspektimi nuk kufizon kohën: një kontroll i datuar para provës ekzistuese lexohet si histori, jo si defekt i ri;
  supervizori mund ta ndryshojë datën para ruajtjes.
- Gjendja e ruajtur në `checks` është ajo e pajisjes që bëri kontrollin: një ndryshim i njëkohshëm i veprimit në një
  pajisje tjetër (Done i ribërë atje) nuk shihet derisa sync-u ta sjellë; pas sync-ut krahasimi status + `closed` e
  kap si "changed since" vetëm nëse `closed` ndryshoi (riparim i ribërë ditë tjetër); dy riparime të raportuara Done
  **të njëjtën ditë** në dy pajisje nuk dallohen (§10 rasti 1, kufizim i vulës ditore).
- Mbetet jashtë: fotografi e detyrueshme si provë, nënshkrim, kufi kohor Done → Verified, raport i verifikimeve.

## 10. Auditimi i autorit mbi `28d3a357`: katër zbrazëti, katër teste, korrigjime minimale

| # | Rasti | PARA (`28d3a357`) | PAS |
| --- | --- | --- | --- |
| 1 | Kontroll historik mbi riparim të mëvonshëm | `recheckOutcomes` nxirrte pranueshmërinë nga **statusi aktual** i veprimit: kontroll pass bërë kur veprimi ishte Open → asgjë atëherë, por sapo veprimi bëhej Done, kontrolli i vjetër dilte "to apply" dhe Apply e verifikonte riparimin e ri; po kështu një fail i vjetër mund ta rihapte një riparim të ri. Riprodhuar nga testi 14 | Rreshti i riinspektimit ruan, **në të njëjtin shkrim** me veten, `checks[qid] = { id, status, closed }` të veprimit në çastin e kontrollit (`checksOf(origin)`). Verdikti pranohet vetëm nga ky regjistrim: `status` i ruajtur `done` → verify/reopen, **nëse** veprimi është ende i njëjti (status `done` dhe `closed` e njëjtë), përndryshe "the action changed since the check"; i ruajtur open/doing → "the action was not done when checked", përgjithmonë; pa regjistrim (`unrecorded`) → asgjë. Rikuperimi ruhet: Done në çastin e kontrollit + shkrim i dështuar i `sc-actions` → "to apply" dhe Apply e shkruan, derisa riparimi të mos ribëhet. Kufizimi i Team Sync: shih §9 |
| 2 | Cikli i defektit të ri | `renderLog` kërkonte `row.kind !== "recheck"` për butonin Reinspect: rreshti i riinspektimit që zotëronte defektin e ri (Rasti D) s'kishte si të riinspektohej, dhe veprimi i tij s'arrinte kurrë Verified. Riprodhuar nga testi 15 | `defectsOf(row)` kthen vetëm defektet **e veta** të rreshtit (për një riinspektim: artikujt që nuk janë defekti i inspektimit të kontrolluar, me rojë kundër cikleve); butoni Reinspect del për çdo rresht me defekt të vetin në tracker, edhe një riinspektim. Riinspektimi i një riinspektimi kontrollon vetëm defektet e veta të tij, jo ato që ai kontrolloi. Testi 15 kalon dy gjenerata: origjinali Verified me provën e paprekur, defekti i ri Done → Verified nga kontrolli i vet, asnjë veprim i tretë |
| 3 | Klasifikimi i First-Time Pass | `annotate` shtonte dhomën te `failedRooms` edhe për një riinspektim që dështonte: inspektimi i zakonshëm i radhës i së njëjtës dhomë atë ditë dilte "re-check" dhe binte nga norma. Riprodhuar nga testi 16 | `if (v.pass === false && row.kind !== "recheck") failedRooms.add(key)`: vetëm inspektimi i zakonshëm që dështon shënon dhomën. Riinspektimet mbeten jashtë First-Time Pass dhe në mesatare vetëm kur janë të plota; rregulli i ditës për inspektimet e zakonshme i pandryshuar. Testi 16: total, punonjës, kat, javë, dhe figura e faqes |
| 4 | Përgjigje e detyrueshme për defektet nën kontroll | "Mark the rest as pass" shënonte pass **edhe defektin që verifikohej**: Reinspect → rest pass → Save e verifikonte një defekt që askush s'e pa. Riprodhuar nga testi 17 | `bulkItems()` përjashton artikujt në `verifyMap` (defektet për kontroll): ata presin pass/fail/N/A të supervizorit; mesazhi e thotë; butoni çaktivizohet kur mbeten vetëm ata. Inspektimi i zakonshëm ruan sjelljen e vjetër. Testi 17 + spec i shfletuesit |

Ndryshimet e §10: `src/js/room-inspection.js` (annotate, `cleanChecks`, `defectsOf/sameDefect` me rojë, `checksOf`,
`recheckOutcomes` nga `checks`, `bulkItems`, butoni Reinspect), 4 tekste DE/SQ (2 të zëvendësuara), `docs/DATA-FORMATS.md`,
README, testet 14–17, spec-i i shfletuesit (bulk pass dhe `checks` në rrjedhën EN). Pa prekje të 4A, `byCase`,
tracker-it për veprimet e zakonshme, `pickRow`, Worker, deploy.
