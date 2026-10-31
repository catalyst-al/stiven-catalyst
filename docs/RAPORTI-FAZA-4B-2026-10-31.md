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
| Riinspektimi | Butoni **Reinspect** te çdo inspektim me defekt mirëmbajtjeje në tracker (open, done ose verified). Drafti bëhet riinspektim i **atij rreshti**: `kind: "recheck"`, `recheckOf: <row.id>`, e njëjta dhomë, kat, tip dhe checklist (fushat e kyçura), data sot, **asgjë e shënuar pass vetvetiu**. Shënimi mbi draft emërton inspektimin dhe defektet për kontroll; çdo artikull për kontroll mban shenjën e gjendjes së veprimit (done / still open / verified / not in tracker / cannot be matched). Riinspektimi në vazhdim ruhet në draft dhe mbijeton rifreskimin |
| Identiteti dhe përputhja | Para çdo shkrimi në veprim: veprimi gjendet sipas id/`ref` (4A) dhe duhet të ketë `source: "room-inspection"`, `ref === "<origin.id>|<qid>"` dhe titull që mbaron me tekstin **aktual** të artikullit të checklist-it. Checklist i ndryshuar, artikull i zhdukur, id e mbajtur nga referencë/mjet tjetër, veprim pa `ref` → **asnjë ndryshim**, arsyeja në log |
| Rasti A: Done + Pass | `ActionsStore.update(id, { status: "verified", closed: <data e riinspektimit>, result: <rezultati i mëparshëm> · "Verified by the re-inspection of room 412 on …: <artikulli> passes.", proof }, { byRecheck: true })` |
| Rasti B: Done + Fail | `{ status: "open", result: … · "Re-inspection …: <artikulli> fails again; reopened.", proof }`; asnjë veprim i dytë për të njëjtin defekt (gabimi i riinspektimit nuk dërgohet si defekt i ri) |
| Rasti C: Open / Doing | Asgjë nuk verifikohet (puna s'është raportuar Done); fail = i njëjti defekt, pa kopje; arsyeja "the action is not done yet" |
| Rasti D: Verified | Prova e vjetër **nuk preket**. Pass → "verified before, passes". Fail → **defekt i ri** me identitetin e riinspektimit (`ri-<recheck.id>-<qid>`, `ref "<recheck.id>|<qid>"`), i dërguar si çdo defekt i 4A; veprimi i vjetër mbetet Verified me provën e tij |
| Rasti E: i pakontrolluar / N/A | Statusi i pandryshuar; arsyeja "not checked" |
| Prova | `proof: { recheck, date, time, qid, item, answer }` mbi veprim, e pastruar e plotë ose aspak (`proofOf`), e shkruar vetëm me `byRecheck`; çdo thirrës tjetër e ruan atë ekzistuese. Tracker-i e shfaq ("Checked in the room on …: … passes / fails again") |
| Mbrojtja e Verified | `ActionsStore.update`: për veprim me `source: "room-inspection"` dhe `ref` të vlefshëm (`byRecheckOnly`), kalimi në Verified pa `byRecheck` refuzohet (`lastUpdate = "recheck-verifies"`). Tracker-i e çaktivizon opsionin dhe e thotë. `byCase` (Pilot 1), verifikimi manual i veprimeve të zakonshme dhe i veprimeve të vjetra pa `ref` **të pandryshuara**. Rihapja me dorë e një veprimi të verifikuar lejohet (mirëmbajtja thotë s'u rregullua); prova mbetet si histori |
| Logu | Rreshti i riinspektimit: "re-inspection of {datë}" + shenja `Re-inspection: n verified · n reopened · n to apply · n unchanged` (`data-recheck="v/r/p/u"`, arsyet në `title`) dhe butoni **Apply to actions** kur ka verdikte të pashkruara. Rreshti origjinal: shenja e 4A tregon verified/open |
| KPI | `annotate`: `recheck = e njëjta dhomë sërish ditën që dështoi (si më parë) OSE row.kind === "recheck"`. `rateBy` e pandryshuar: riinspektimi as në numerues as në emërues të First-Time Pass; mesatarja merr çdo inspektim me rezultat të plotë (riinspektim i plotë përfshirë); i paploti në asnjërën. Mjetet e tjera (Shift Pulse, Daily Board, Operations Report, Site Compare, Print Pack) lexojnë përmes `RoomInspectionMath.annotate/rateBy`, kështu përjashtimi vlen edhe atje pa ndryshuar përkufizimet e tyre |
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

## 8. Rezultatet

Çdo provë me ndërtim të plotë, mbi gjendjen përfundimtare të degës (ky commit):

| Provë | Rezultati |
| --- | --- |
| `npm run build` | 838 faqe, pa gabim |
| `npm test` | **1 402 kalojnë, 0 dështojnë** (1 389 të `main` + 13 të `room-inspection-recheck`) |
| Gjithë suita e shfletuesit (6 projekte) | **216 kalojnë, 0 dështojnë**, 17,1 min (213 të `main` + 3 të `room-inspection-recheck.spec`: EN, DE, SQ) |
| Pilot 1 (`case-thread`, `case-integrity`, `case-kpi`) | 21 teste, pa ndryshim |
| Faza 4A (`room-inspection-identity`) | 10 teste, kalojnë; testi 2 verifikon me `byRecheck` (rregulli i ri) |
| Mbulimi i përkthimeve (`room-inspection.test`, "every text … has a German and an Albanian translation") | kalon me 47 tekstet e reja |
| CI e PR-it | shih përshkrimin e PR-it: raportohet vetëm kur ka përfunduar |

Numrat e testeve janë ata të daljes reale të `node --test` dhe `playwright test` (`# tests 1402 / # pass 1402 / # fail 0`;
`216 passed`).

## 9. Rreziqet e mbetura

- Team Sync: rihapja humbet ndaj një kopjeje të vjetër "done" (`pickRow`, §4); faqja e rikthen me Apply, por kërkon
  një klik të supervizorit.
- PWA e vjetër: humbja e `recheckOf`/llojit në ruajtjen e radhës të faqes së vjetër (§5), deri në përditësim.
- Veprim i verifikuar me dorë para 4B ose nga tracker i vjetër: Verified pa provë; faqja e trajton si "verified
  before".
- Riinspektimi nuk kufizon kohën: një kontroll i datuar para provës ekzistuese lexohet si histori ("later"), jo si
  defekt i ri; supervizori mund ta ndryshojë datën para ruajtjes.
- Mbetet jashtë: fotografi e detyrueshme si provë, nënshkrim, kufi kohor Done → Verified, raport i verifikimeve.
