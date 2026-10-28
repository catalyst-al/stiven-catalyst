# Stiven Catalyst Tools, Faza 2: besueshmëri, raporte, siguri e të dhënave

Data: 28 tetor 2026. Dega `feature/tools-reliability-reports`, nga `main` `b2b1f84` (pas PR #364). Draft PR, pa
merge, pa deploy; Team Sync Worker, Cloudflare, planetët dhe përmbajtja editoriale të paprekura. Çdo e dhënë në teste
është fiktive.

## 1. Çfarë u verifikua para se të ndryshonte gjë

- `main` `b2b1f84` përmban checkpoint-in `605d0df` të degës `claude/busy-cannon-mq0sqy` (paraardhës i drejtpërdrejtë)
  dhe gjithë auditimin e 27 tetorit; shtatë skedarët e punës së Fable janë aty të forcuar nga auditimi (`pdf-kit.js`,
  `work-lock.js`, `ats-cv.js`, `team-sync.js`, `storage-guard.js`, `work-backup.js`, `atsSkills.json`). Asgjë nga dega
  e vjetër nuk u rikthye mbi korrigjimet.
- Pesë përmirësimet e planit të parë: ruajtja/rikthimi (localStorage, pika rikthimi çdo 15 min, backup me foto, PIN),
  ATS me sinonime dhe JSON Resume, Shift Handover me link/QR të vulosur, PWA me service worker, PDF i vetin për ATS CV:
  **të gjitha në `main`**. Mungesat reale: 46 mjete pa provë në shfletues real; raportet pa PDF të vetin (38 mjete me
  `window.print()`, `pdf-kit.js` pa tabela); skedari i punës në tekst të hapur; asnjë rrjetë kur një mjet dështon;
  asnjë dokument i formateve të të dhënave.

## 2. Çfarë u bë

| # | Ndryshim | Skedarë | Pse |
| --- | --- | --- | --- |
| 1 | **Çdo faqe mjeti në shfletues real**: 59 mjete × 3 gjuhë hapen, kanë panelin dhe kutinë e punës, pa gabim skripti; në anglisht shembulli i çdo mjeti ruhet dhe mbijeton rifreskimin | `tests/browser/tool-pages.spec.mjs`, `playwright.config.mjs` (vetëm projekti 1440 px i errët) | Deri tani 13 nga 59 mjete kishin provë në Chromium; një regresion i heshtur dilte te përdoruesi |
| 2 | **Tabela në `pdf-kit.js`**: qeliza që rreshtohen brenda kolonës, rresht që s'ndahet mes faqeve, kokë që përsëritet në çdo faqe, drejtim djathtas për numrat | `src/js/pdf-kit.js`, `tests/pdf-kit.test.cjs` | Raportet operacionale janë tabela; pa to PDF-ja e vetin mbetej vetëm për CV-në |
| 3 | **Shift Handover "Ruaje si PDF"**: fleta e dorëzimit si PDF A4 në gjuhën e faqes (numrat dhe çështjet e hapura si tabela, të zgjidhurat, paralajmërimet, siguria, kontrolli, marrja/konfirmimi); printimi i shfletuesit mbetet si "Print" | `src/js/shift-handover.js` (`ShiftHandoverPdf`), partial, `tests/handover-pdf.test.cjs` | I njëjti dokument në çdo shfletues dhe printer, pa dialogun që ndryshon sipas Chrome/Safari |
| 4 | **Skedar pune i vulosur me fjalëkalim**: kutia "Mbroje skedarin me fjalëkalim" te "Ruaj gjithë punën"; `…sealed.json` me AES-GCM 256 nën PBKDF2-SHA-256 (310 000 raunde, salt i rastit, formati si additional data), gzip brenda; "Hap një skedar të ruajtur" e njeh, kërkon fjalëkalimin dhe vazhdon si me skedarin e hapur | `src/js/work-backup.js`, `work-backup.njk`, `11-reading-and-motion.css`, `tests/work-backup-sealed.test.cjs`, `tests/browser/work-backup-sealed.spec.mjs` | Skedari në Downloads të një PC-je të përbashkët ose në email mbante emra në tekst të hapur |
| 5 | **Rrjeta e gabimeve**: një njoftim në krye të faqes kur një skript i vetë faqes dështon ose një premtim mbetet pa u kapur (puna e ruajtur e paprekur, ruaj skedarin, ringarko); gabimet e shtesave të shfletuesit dhe faqet pa mjet nuk e shfaqin | `src/js/tool-kit.js`, `06-tools.css`, `tests/tool-error-net.test.cjs` | Paneli i vdekur pa fjalë ishte dështimi më i keq i mundshëm për besimin |
| 6 | **`docs/DATA-FORMATS.md`**: çelësat `sc-*` mjet për mjet, bazat IndexedDB, çdo format skedari dhe linku me versionin, PIN-i, team sync, rregullat që çdo ndryshim mban; `tests/data-formats.test.cjs` e mban të vërtetë | docs, test | Rollback dhe migrime pa supozime |
| 7 | **`docs/KONKURRUESHMERIA-2026-10-28.md`**: vlerësimi i Fazës 4 | docs | Kërkesa e autorit |

Pa librari të reja, pa server, pa ndryshim të dizajnit. 22 tekste të reja ndërfaqeje në gjermanisht dhe shqip.

## 3. Çfarë nuk u bë, me arsye

- **Cover Letter si PDF i vetin:** dizajni "modern" ka foto dhe temë si CV Builder; `pdf-kit.js` nuk vizaton imazhe.
  Hapi është i vogël (JPEG në PDF) por meriton PR më vete me CV Builder.
- **CSS sipas faqes së mjetit:** 434 KB në çdo faqe mjeti është leva më e madhe e shpejtësisë, por prek pamjen e 59
  faqeve dhe duhet matur vizualisht; PR më vete.
- **Rrjedha Problem → Evidence → … → KPI:** faza tjetër, me miratim.
- **Team Sync Worker:** pret vendimin e autorit.

## 4. Testimi

Në degë, pas ndryshimit të fundit (`25d85b4f`), me ndërtimin e plotë (`npm run build`, 838 faqe):

| Provë | Rezultat |
| --- | --- |
| `npm test` (node --test, 1 355 teste, 9 të reja: tabelat e `pdf-kit`, fleta PDF e dorëzimit në EN/DE/SQ, skedari i vulosur, rrjeta e gabimeve, formatet e të dhënave) | 1 355 kalojnë, 0 dështojnë |
| `tool-pages.spec.mjs` (177 faqe mjetesh, 3 gjuhë, 1440 px i errët) + `work-backup-sealed.spec.mjs` + `handover-transfer.spec.mjs` (të gjitha projektet) | 35 kalojnë, 0 dështojnë, 6 min |
| Gjithë suita e shfletuesit (`npx playwright test`, 6 projekte: 390/768/1440 px × errët/çelët) | 211 kalojnë, 0 dështojnë, 19,5 min |

Çfarë u gjet dhe u ndreq gjatë provës: shembulli i Site Compare jeton vetëm në kujtesën e faqes (pa çelës `sc-*`), kështu
spec-i kontrollon mbijetesën e rifreskimit vetëm për atë që ruhet; dialogu i fjalëkalimit kishte `minlength` natyror që
fshihte mesazhet e vetë skriptit, hiqet (`novalidate`), mesazhet "të paktën 8" dhe "nuk përputhen" dalin tani në çdo
shfletues njësoj. Provat e para të skripteve në kontekste pa `window.addEventListener` (testet e vjetra në `vm`) kërkuan
një kontroll `typeof` te rrjeta e gabimeve; asnjë test i vjetër nuk u ndryshua.

Pa ndryshim në `main`, pa merge, pa deploy; CI e PR-it (build + unit + shfletues) është prova e fundit para shqyrtimit.

## 5. Tri kontrollet e autorit para miratimit (28 tetor, pasdite)

| # | Rasti | Çfarë gjeti testi në kodin e mëparshëm | Korrigjimi (vetëm shkaku) | Testi |
| --- | --- | --- | --- | --- |
| 1 | Dialogu i fjalëkalimit mbyllur me Esc | Esc zgjidhte premtimin, por dëgjuesit `submit` dhe `click` mbeteshin; edhe pas "Continue" mbetej dëgjuesi `close` (`once`, pa `removeEventListener`). Çdo hapje shtonte një palë të re | Një rrugëdalje e vetme `finish`: heq të tre dëgjuesit, mbyll dialogun nëse është hapur, zgjidh premtimin një herë, nga Continue, Cancel ose Esc | `work-backup-sealed.spec.mjs`: numëron dëgjuesit e gjallë të formës dhe dialogut; pas Cancel, pas Esc, pas fjalëkalimit të gabuar dhe pas të saktit janë 0; pas Esc dialogu rihapet me fushë dhe gabim bosh, "të paktën 8" dhe "Wrong password" dalin një herë. Në kodin e vjetër dështon (`close: 1`) |
| 2 | Kufiri i madhësisë te `openSealedText` | Gzip-i shpaketohej i tëri në memorie dhe vetëm pastaj krahasohej me 40 MB | `pipeThrough` lexon rrjedhën copë-copë dhe ndalon (`reader.cancel`) sapo dalja kalon kufirin; hapja kthen `invalid` | `work-backup-sealed.test.cjs`: 48 MB zero (gzip disa dhjetëra KB) të vulosura; `DecompressionStream` që numëron çfarë jep: ndalon mes 40 dhe 48 MB; në kodin e vjetër lexon të 48 MB |
| 3 | Rresht Shift Handover më i gjatë se faqja A4 | Një çështje me ~900 fjalë vizatohej si një rresht i vetëm që dilte nën kufirin e faqes (y 32,9 dhe 4,9 pt, pjesa tjetër jashtë faqes) | Në `pdf-kit.js` një rresht më i lartë se faqja (minus koka dhe kufijtë) vazhdon në pjesë faqe pas faqeje, me çdo rresht të çdo qelize; rreshtat normalë mbeten të pandarë | `pdf-kit.test.cjs` (1 200 fjalë në një qelizë) dhe `handover-pdf.test.cjs` (çështje me 900 fjalë): çdo fjalë e vizatuar, çdo pozicion teksti brenda faqes, koka dhe fusnota në çdo faqe, çështjet pas saj dhe seksionet e tjera të pranishme |

Rezultatet në `b618fa6f`: `npm run build` 838 faqe; `npm test` 1 358 kalojnë, 0 dështojnë; gjithë suita e shfletuesit 211
kalojnë, 0 dështojnë (18,3 min); CI e PR-it jeshile. Pa refactoring, pa librari, pa prekje të dizajnit.

## 6. Kufizimet që mbeten

- Skedari i vulosur mbron përmbajtjen; fjalëkalimi s'ruhet askund dhe humbja e tij është humbje e skedarit.
- Rrjeta e gabimeve njofton, nuk shëron: një mjet që dështon mbetet për t'u korrigjuar, dhe gabimi del tani në CI
  për çdo faqe.
- Prova në shfletues është Chromium në CI; Firefox, Safari dhe pajisjet reale mbeten për provën e autorit.
