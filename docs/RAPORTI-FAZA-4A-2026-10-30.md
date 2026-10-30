# Stiven Catalyst Tools, Faza 4A: identiteti i defektit dhe integriteti i dërgimit (Room Inspection → Action Tracker)

Data: 30 tetor 2026. Dega `feature/room-inspection-defect-identity`, nga `main` `90f7d524` (pas PR #367). Draft PR,
pa merge, pa deploy. Team Sync Worker, Cloudflare, planetët dhe përmbajtja editoriale të paprekura. Çdo dhomë, defekt
dhe emër në teste është i shpikur.

## 1. PARA (kodi i `main`)

- `sendMaintenance()` shënonte `sent[qid] = true` **pavarësisht** nga rezultati i `Actions.add()`: një shfletues që
  nuk ruante (hapësirë e plotë, PIN i kyçur) ose një dublikatë e një veprimi tjetër e hiqnin artikullin nga "Open
  maintenance" përgjithmonë, pa mesazh.
- Identiteti i veprimit ishte teksti: dublikatë = i njëjti titull i hapur + burim. Dy defekte të ndara me të njëjtat
  fjalë (e njëjta dhomë, i njëjti artikull, inspektime të ndryshme) bashkoheshin në një veprim; i dyti shënohej i
  dërguar dhe humbiste.
- Asnjë lidhje nga inspektimi te veprimi: `sent[qid]` ishte vetëm `true`; logu nuk tregonte gjendjen e veprimit.
- Inspektimi dërgohej te tracker-i **para** se të ruhej vetë: nëse ruajtja e tij dështonte, veprimet mbeteshin pa
  inspektim, dhe një ruajtje e dytë bënte inspektim (dhe veprim) të dytë.

## 2. PAS

| Pika | Zgjidhja |
| --- | --- |
| Identiteti | Një defekt = `(row.id, qid)`. Veprimi mban `ref: "<row.id>|<qid>"` dhe `id: "ri-<row.id>-<qid>"` (i njëjti në çdo pajisje). `ActionsStore.add`: me `ref`, dublikatë = i njëjti `source + ref` **në çdo status**; pa `ref`, rregulli i vjetër saktësisht (titull i hapur + burim + rast). `byRef(source, ref)`, `byId(id)` |
| `sent` | Mbetet **boolean** `true`, formati ekzistues; veprimi gjendet sipas id-së deterministike, pastaj sipas `ref`. Asnjë fushë e re në rresht, asnjë ndryshim i `clean()`; versionet e vjetra e lexojnë si më parë. Zgjedhur sepse id-ja deterministike e bën lidhjen të rillogaritshme nga vetë rreshti, pa e mbajtur dy herë |
| Dërgimi | `sendMaintenance` kthen `{ added, linked, failed }`: `sent = true` vetëm kur `add` kthen veprim ose `lastAdd === "duplicate"` (veprimi është aty, në çfarëdo statusi); "unsaved"/"invalid" lënë artikullin te `unsent`, mesazhi e thotë ("n nuk u shtuan … dërgoji sërish"), butoni ekzistues "Send … to actions" e riprovon |
| Renditja e ruajtjes | Rreshti ruhet **para** dërgimit; nëse `write` kthen `false`, rreshti hiqet nga kujtesa, drafti mbetet, mesazh "nuk u ruajt, asgjë nuk u dërgua". Pastaj dërgimi, pastaj ruajtja e lidhjes; nëse kjo e fundit dështon, në ngarkimin tjetër `unsent` e ridërgon, `add` e njeh si dublikatë sipas id/ref dhe e rilidh, pa kopje |
| Logu | Te çdo inspektim me mirëmbajtje: `Maintenance: n open · n done · n verified · n sent · n not sent` (shenjë `is-unsent` kur ka të padërguara); "sent" është rasti i një faqeje më të vjetër që dërgoi pa id/ref |
| Verified | **I pandryshuar** (4B): veprimet e Room Inspection verifikohen si sot; `byCase` dhe rregullat e Pilotit 1 të paprekura |

## 3. Team Sync (provuar, jo supozuar)

`TeamSyncMath.mergeRows()` bashkon sipas `id`; `pickRow()` zgjedh **një** version të rreshtit (atë që nuk ndryshoi
nga baza e sync-ut, përndryshe atë më të ri sipas `updated/closed/created`, përndryshe atë të ekipit).

- Dy pajisje që dërgojnë të njëjtin defekt → i njëjti `id` → **një** rresht pas bashkimit (test 6a).
- Dy ndryshime të njëkohshme mbi të njëjtin veprim (p.sh. rezultat i shkruar në njërën, asgjë në tjetrën, pa vulë
  kohe që i dallon) → njëra humbet; kodi nuk e parandalon dhe raporti nuk pretendon të kundërtën (test 6b).
- `sent` është fushë brenda rreshtit të inspektimit: po të zgjidhet versioni pa flamur, flamuri humbet; faqja e tregon
  si "not sent", ridërgimi e gjen veprimin sipas id dhe e rilidh, **pa kopje** (test 6c).

## 4. PWA e vjetër përballë versionit të ri (analizë konkrete)

Versioni i vjetër: s'njeh `ref`, lexon vetëm `sent[qid] === true`, dublikatë vetëm për veprime të hapura.

| Skenar | Çfarë ndodh | Pasoja |
| --- | --- | --- |
| Rresht i ri (`sent: true`) i hapur në faqe të vjetër | lexohet si i dërguar | asnjë ridërgim; formati i `sent` nuk ndryshoi |
| Veprim i ri (me `id` deterministik dhe `ref`) i hapur në tracker të vjetër | shfaqet dhe punon; në përditësimin e radhës të atij veprimi `clean()` i vjetër e heq `ref` | id-ja mbetet, kështu faqja e re e gjen prapë sipas id; `byRef` dështon vetëm për të |
| Faqe e vjetër dërgon një defekt që faqja e re e ka dërguar tashmë (pas sync) | tracker i vjetër: dublikatë vetëm nëse veprimi me të njëjtin titull është **i hapur**; nëse është done/verified, krijon veprim të ri me id të rastit | **kufizim i pashmangshëm**: një kopje me id të rastit nga pajisja e vjetër; faqja e re e tregon si veprim më vete (pa ref) dhe nuk e lidh |
| Faqe e vjetër ruan inspektimin me ruajtje që dështon | sjellja e vjetër (dërgon para se të ruajë) | si sot, deri në përditësimin e service worker-it |

Dritarja është koha derisa PWA-ja e pajisjes të marrë JavaScript-in e ri; asnjë nga këto nuk prish të dhëna, vetëm
mund të lërë një kopje ose një lidhje të munguar që faqja e re e trajton si "sent".

## 5. Ndryshimet

`src/js/actions-store.js` (`ref`, dublikatë sipas id dhe `source + ref`, `byRef`, `byId`), `src/js/room-inspection.js`
(`actionIdFor`, `refFor`, `linkedAction`, `sendMaintenance` me `{ added, linked, failed }`, renditja ruaj → dërgo →
ruaj, mesazhet, shenja e mirëmbajtjes në log), 6 tekste DE/SQ, `docs/DATA-FORMATS.md`, README, teste. Pa prekje të
`media-store.js`, `floor-capture.js`, `work-backup.js`, `work-lock.js`, Signals, Worker, Cloudflare.

## 6. Testet e pranimit

`tests/room-inspection-identity.test.cjs` (7 teste; që të shtatë dështojnë në `90f7d524`, provuar në worktree: 1–4
janë defektet, 5–7 sjellje që kodi i vjetër s'e kishte):

1. Dy defekte me tekst identik → dy veprime, id `ri-<row.id>-bathroom-5` dhe `ref` të vetat, `sent` boolean.
2. Ridërgim i të njëjtit defekt (lidhje e humbur) → asnjë kopje, rilidhur, mesazh "already in the Action Tracker";
   e njëjta pas `Done` dhe pas `Verified`; rregulli pa `ref` i pandryshuar (titull i hapur = dublikatë, pas done = i ri).
3. `sc-actions` nuk ruhet → rreshti i ruajtur, `sent` bosh, "1 not in the Action Tracker yet", mesazh pa sukses të
   rremë; dështim i përsëritur → njësoj; pas rikthimit → një veprim.
4. `sc-room-inspection` nuk ruhet → asnjë veprim, drafti i mbajtur, mesazhi i saktë; veprimi i ruajtur por lidhja jo →
   pas rifreskimit "not sent", ridërgimi e gjen sipas id, pa kopje.
5. Të dhëna të vjetra: `sent: true` lexohet si i dërguar, veprimi i vjetër pa `ref`/id i paprekur, asgjë për të dërguar.
6. Team Sync me dy pajisje (shih §3).
7. DE/SQ: titulli "Zimmer 412: …" / "Dhoma 412: …", mesazhet dhe shenja e logut në gjuhën e faqes.

`tests/browser/room-inspection-actions.spec.mjs` (Chromium): inspektim real me defekt mirëmbajtje → veprim me
identitet → inspektim i dytë me të njëjtat fjalë → dy veprime në tracker → lidhje e humbur → ridërgim pa kopje.

## 7. Rezultatet

Dega pas bashkimit të `origin/main` `e22f3bdd` (PR #368, dy skedarë CSS të logos, identikë me `main` pas bashkimit;
commit-i `02ca5aa2` i ruajtur, merge commit `d7bc0225`, pa rebase, pa force-push), me ndërtim të plotë (838 faqe):

| Provë | Para bashkimit (`02ca5aa2`) | Pas bashkimit (`d7bc0225`) |
| --- | --- | --- |
| `npm test` (1 386 teste; 7 të reja në `room-inspection-identity.test.cjs`) | 1 386 kalojnë, 0 dështojnë | 1 386 kalojnë, 0 dështojnë |
| Gjithë suita e shfletuesit (6 projekte, 213 teste; `room-inspection-actions.spec.mjs` i ri) | 213 kalojnë, 0 dështojnë, 18,3 min | 213 kalojnë, 0 dështojnë, 17,4 min |

Kontrollet e kërkuara, me testin që i provon: dublikatë `source + ref` në çdo status (identity 2, store-i: open, done,
verified); `sent` boolean i përputhshëm (identity 1, 5); asnjë detyrë e humbur kur ruajtja dështon (identity 3, 4);
rregullat `byCase` të Pilotit 1 të paprekura (`case-thread`, `case-integrity`, `case-kpi`, 21 teste, kalojnë pa
ndryshim); procesi i ri i verifikimit (4B) **nuk** është aktivizuar: asnjë `bySource`, asnjë thirrje `Actions.update`
nga Room Inspection.

## 8. Rreziqet e mbetura

- Pajisje me PWA të vjetër (§4): një kopje me id të rastit kur ridërgon një defekt tashmë done/verified në pajisjen e re.
- Team Sync: humbje e një ndryshimi të njëkohshëm mbi të njëjtin veprim (`pickRow` mban një version); flamuri `sent`
  rikuperohet, rezultati i shkruar jo.
- Veprimet e vjetra pa `ref` nuk lidhen me rreshtin e tyre; shfaqen si "sent" dhe mbyllen me dorë, si sot.
- Riinspektimi, Verified nga prova dhe `bySource`: Faza 4B.
