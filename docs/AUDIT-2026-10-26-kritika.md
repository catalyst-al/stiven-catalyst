# Kritika e jashtme e 26 tetorit 2026: çfarë qëndron, çfarë u bë, ku jemi konkurrues

Data: 26 tetor 2026. Baza: `main` pas PR #358 (`1644e43`). Autori solli një analizë të jashtme me pesë "dobësi" të
mjeteve (gjendja që humbet, ATS-ja me rregulla, mungesa e bashkëpunimit, offline-i, eksporti PDF) dhe pyeti: qëndrojnë
këto, dhe si shkojmë më tej se vetë kritika, në nivel "powertool end to end", që të jemi më konkurrues.

## 1. Vlerësimi: pesë kritika, dy qëndrojnë pjesërisht

Çdo pikë u kontrollua kundrejt kodit, jo kundrejt faqes së udhëzuesit.

| # | Kritika | Qëndron? | Prova në kod |
| --- | --- | --- | --- |
| 1 | Të dhënat humbasin me refresh; duhen LocalStorage dhe eksport JSON | **Jo.** | Çdo mjet ruan në `localStorage` (çelësat `sc-`) në çdo shtypje. "All your work in one file" (`js/work-backup.js`) eksporton dhe rihap një `.json` me kontroll formati para se të zëvendësojë gjë. `js/storage-guard.js` mban pika rikthimi në IndexedDB (`sc-restore`: një në ditë, para çdo importi, para çdo sync-u, 14 ditore + 5 + 5), kërkon `navigator.storage.persist()` dhe tregon hapësirën. Kjo është përtej propozimit. |
| 2 | ATS-ja është heuristikë statike me regex; duhen SLM në WebGPU ose taksonomi ESCO/O*NET | **Pjesërisht.** | Përputhja me njoftimin ekzistonte (`keywords`, `hasTerm`: fjalë të plota, shumës, ndajfjalë gjermane, "front office" = "frontoffice"), por pa sinonime dhe pa peshë për kërkesat. Një SLM prej 2 GB në WebGPU nuk është zgjidhje për një telefon pune në magazinë; një taksonomi e vogël, e lexueshme dhe e testuar është. **U bë** (seksioni 2). |
| 3 | S'ka bashkëpunim; duhet QR ose WebRTC | **Jo si kritikë, po si ide.** | Team sync (`js/team-sync.js`, `workers/sync/worker.js`) sinkronizon mjetet e një ekipi me enkriptim AES-GCM nga kodi i ekipit (serveri sheh vetëm shifër), me kode vetëm-lexim, me QR për kodin e ekipit. Ajo që mungonte: një dorëzim i vetëm që kalon nga një pajisje te tjetra pa llogari, pa ekip, pa server. **U bë** (seksioni 2). WebRTC nuk u zgjodh: edhe ai kërkon një kanal sinjalizimi, pra server ose shkëmbim manual. |
| 4 | S'punon offline; duhet PWA | **Jo.** | `src/sw.js`, `src/manifest.webmanifest`, `js/offline.js`: mjetet instalohen si aplikacion, worker-i mban faqet e rolit dhe `offline.html`; testuar në `tests/offline.test.cjs`. |
| 5 | PDF-ja varet nga `window.print()` dhe del ndryshe sipas shfletuesit | **Po, për CV-të.** | ATS CV dhe Cover Letter printonin me `window.print()` dhe me një udhëzues (`js/print-guide.js`) për "Save as PDF". Word-i shkruhej vetë (`js/docx-kit.js`), PDF-ja jo. **U bë për ATS CV** (seksioni 2). |

Përfundim: analiza e jashtme përshkruan një faqe statike tipike, jo këtë. Tri nga pesë pikat ishin të zgjidhura prej
kohësh, dhe në dy raste zgjidhja në kod është më e fortë se ajo që propozohej. Dy pika kishin një bërthamë të vërtetë.

## 2. Çfarë u bë në këtë degë

Të gjitha pa asnjë librari të re, pa server, në stilin e kodit ekzistues (një skript, një test, tekste në tri gjuhë).

### 2.1 PDF i vërtetë për ATS CV (`src/js/pdf-kit.js`, `AtsCv.pdf`)

- Një shkrues PDF pa varësi, si `docx-kit.js` për Word: objektet, tabela xref, fontet standarde (Helvetica, Times,
  Courier) në WinAnsi, me gjerësitë e tyre të verifikuara kundrejt Liberation Sans/Serif (metrikisht identike me
  Arial dhe Times New Roman: 0 ndryshime në 95 karaktere për 4 fonte).
- Shkronjat shqipe (ë, ç), gjermane (ä ö ü ß), euro, pikat, vizat dhe thonjëzat janë një bajt; një shkronjë jashtë
  WinAnsi humb theksin, nuk prish skedarin.
- `PdfKit.flow`: kolona që rrjedh nëpër faqe, titull që nuk mbetet vetëm në fund të faqes, paragraf i gjatë që ndahet
  mes dy rreshtave, titull me datë djathtas, fusnotë "Faqja n nga m".
- Teksti shkruhet si rreshta të plotë (jo fjalë më fjalë), prandaj kopjohet dhe lexohet nga ATS-të me hapësirat e
  veta; titulli dhe autori në UTF-16, gjuha në katalog.
- "Download PDF" tani shkarkon këtë skedar (rreth 35 KB për dy faqe). Printimi i shfletuesit mbeti nën "More" si
  "Print the preview".
- Verifikuar me `pypdf` (strict) dhe `pdftotext`: tre gjuhë, dy faqe, teksti i plotë.

### 2.2 Përputhja me njoftimin: sinonime dhe peshë për kërkesat (`src/_data/atsSkills.json`)

- 80 grupe fjalësh që janë e njëjta aftësi në anglisht, gjermanisht dhe shqip (logjistikë, magazinë, hoteleri,
  shërbim klienti, zyrë, IT, drejtim). "Forklift" në njoftim gjendet kur CV-ja thotë "Staplerschein"; çipi tregon
  "forklift ≈ staplerschein" dhe këshillon ta shkruash si njoftimi, nëse është e vërtetë.
- Pjesët e njoftimit: një rresht i shkurtër si "Ihr Profil", "Requirements", "Kërkesat" hap pjesën e kërkesave;
  "Nice to have" hap të dëshirueshmet; "Ihre Aufgaben", "Wir bieten", "Kontakt" i mbyllin. Fjala nga pjesa e kërkesave
  peshon dyfish në rezultat dhe shënohet.
- Pa skedarin e aftësive gjithçka punon si më parë (testuar).

### 2.3 "Dërgoja turnit tjetër" te Shift Handover (`window.ShiftHandoverLink`)

- Dorëzimi paketohet në adresën e faqes pas `#h=`: JSON, gzip (`CompressionStream`), base64url. Pjesa pas `#` nuk
  i dërgohet kurrë serverit, as atij të faqes. Në shfletues pa gzip: `#h0=` me JSON të thjeshtë.
- Dialogu jep QR-në për skanim nga telefoni i turnit tjetër, butonin "Share" (fleta e sistemit: WhatsApp, email) dhe
  kopjimin e linkut.
- Faqja që hap linkun e ofron dorëzimin në një kuti dhe nuk zëvendëson asgjë pa pyetur: ajo që ishte kalon te
  historiku, `ackAt` fshihet që marrësi të konfirmojë vetë marrjen.
- Një linku të huaj ose të dëmtuar i thuhet "nuk përmban dorëzim" (format, version, formë kontrollohen).

### 2.4 QR deri në versionin 40 (`team-sync.js`)

- Koduesi mbante versionet 1–10 (213 bajt). Tabela e fjalëkodeve dhe qendrat e modeleve të rreshtimit tani llogariten
  nga versioni (me përjashtimin e standardit për versionin 32), deri në versionin 40: 2331 bajt, mjaft për një
  dorëzim me dhjetë çështje të gjata.
- Verifikuar me një dekodues të pavarur (jsQR) në 7 gjatësi, nga versioni 1 deri në 40: të gjitha dekodohen në
  tekstin e njëjtë. Rreshtat 1–10 të tabelës së llogaritur janë identike me ato që ishin shkruar me dorë.

### 2.5 Teste dhe tekste

- Të reja: `tests/pdf-kit.test.cjs`, `tests/handover-link.test.cjs`; të zgjeruara: `tests/career-tools.test.cjs`
  (sinonimet, pjesët e njoftimit, PDF-ja), `tests/team-sync.test.cjs` (kapaciteti dhe rreshtimi i QR-së).
- 27 tekste të reja në gjermanisht dhe shqip (`src/_data/de/ui.json`, `src/_data/sq/ui.json`).

## 3. Përtej kritikës: ku jemi konkurrues dhe ku jo

### Çfarë kemi që të tjerët s'e kanë bashkë

| Veçori | Stiven Catalyst Tools | Excel / Google Sheets | SaaS operacional (SafetyCulture, Lean apps) | Shabllone Notion / Word |
| --- | --- | --- | --- | --- |
| Çmimi dhe llogaria | Falas, pa llogari | Licencë ose llogari Google | Abonim për përdorues | Llogari |
| Të dhënat | Vetëm në pajisje; sync me enkriptim nga pajisja | Në cloud (Google) ose në skedar | Në serverin e tyre | Në cloud |
| Offline | Plotësisht, i instalueshëm | Pjesërisht | Pjesërisht, me sync | Dobët |
| Gjuhët | EN, DE, SQ, në të njëjtën thellësi | EN + përkthim ndërfaqe | EN kryesisht | EN |
| Përmbajtja metodike | 60+ mjete lidhur me ese, udhëzues të shtypur, kurs | Asgjë | Shabllone | Teksti i përdoruesit |
| Lidhja mes mjeteve | Logu i dëmeve → Pareto → 5 Why → Handover → Signals | Me dorë | Brenda produktit | Jo |
| Eksporti | PDF i vetin, Word, CSV, XLSX, PNG/SVG, QR, link | Vetë formati | PDF nga serveri | PDF i shfletuesit |

Pozicioni ynë real: **mjete pune për drejtuesin e dyshemesë që s'ka buxhet, s'ka IT dhe s'ka kohë**: shift lead,
night auditor, team lead në last mile, me gjuhën e vet. Askush nga të mësipërmit nuk e synon këtë person me këtë
thellësi metodike dhe me këtë politikë të dhënash.

### Ku jemi më të dobët se konkurrenca (dhe çfarë vlen të bëhet)

1. **Shumë përdorues në një ekip me role.** Team sync ka kod ekipi dhe kod vetëm-lexim, por jo "kush ndryshoi çfarë"
   në nivel rreshti. Një SaaS e ka. Hapi i radhës: autor dhe kohë në çdo rresht të logeve dhe një filtër "ndryshimet
   e sotme" te Signals. Pa server të ri.
2. **Analizë e thelluar e CV-së.** Sinonimet mbulojnë fushat tona (operacione, hoteleri, logjistikë). Për IT ose
   financë lista është e hollë. Hapi i radhës: grupe sipas industrisë në skedarë të veçantë që ngarkohen sipas
   njoftimit, dhe kontroll i formulimeve me numra (arritje të matshme) për çdo pikë të përvojës.
3. **PDF për Cover Letter dhe për raportet.** `pdf-kit.js` është gati; Cover Letter dhe Print Pack ende printojnë
   me shfletuesin. Hapi i radhës: `CoverLetter.pdf` me të njëjtin modul (një ditë punë), pastaj raporti i
   operacioneve.
4. **Importi nga sistemet.** `ImportMap.PRESETS` njeh kolona tipike të PMS dhe WMS, por nuk ka lidhje të drejtpërdrejtë.
   Pa server kjo mbetet import skedari; vlen të shtohet "ngjit nga clipboard" për çdo log, që tani e ka vetëm Pareto.
5. **Prova sociale.** Konkurrentët kanë raste klientësh. Ne kemi raste të dokumentuara në ese; vlen t'i lidhim te çdo
   mjet si "ku u përdor dhe çfarë ndryshoi", me numrat që autori ka prova.

### Çfarë nuk vlen të ndiqet nga propozimet e kritikës

- **SLM në WebGPU (Phi-3, Gemma, WebLLM):** 1,5–2,5 GB shkarkim, kërkon GPU dhe shfletues të ri, konsumon bateri,
  nuk punon në telefonat e dyshemesë. Një taksonomi 20 KB zgjidh 80 % të rastit dhe testohet.
- **WebRTC P2P:** kërkon sinjalizim; pa server do të thotë shkëmbim manual i ofertës, më i rëndë se QR-ja që sapo u bë.
- **ESCO/O\*NET i plotë:** 13 000+ aftësi në tri gjuhë janë disa MB dhe shumica s'kanë lidhje me rolet tona.

## 4. Mbeten për autorin

- Edicioni i udhëzuesit (`src/_data/toolsGuide.js`, `EDITION`) nuk u ngrit: ATS CV dhe Shift Handover ndryshuan
  sjellje, pra edicioni 8 i takon autorit kur ta shtypë.
- Kartat e mjeteve (`src/_data/tools.json` dhe përkthimet) nuk përmendin ende "PDF i vetin" dhe "dërgo me QR";
  teksti i tyre është zgjedhje editoriale.
- Testet në shfletues (`tests/browser/`) nuk kanë ende një rrugë për dialogun e dërgimit; testet Node e mbulojnë
  logjikën, jo klikimin.
