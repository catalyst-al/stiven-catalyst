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

---

# Shtesa e 27 tetorit 2026: pesë kritika të tjera

Autori solli një listë të dytë: analiza kohore, enkriptimi lokal, Undo/versionimi, ndërveprimi me programet, validimi.
Udhëzimi: zbato ato që qëndrojnë, injoro të tjerat. Çdo pikë u kontrolluar kundrejt kodit.

| # | Kritika | Qëndron? | Prova në kod dhe vendimi |
| --- | --- | --- | --- |
| 1 | S'ka analizë tendencash; duhen DuckDB-Wasm dhe Chart.js | **Jo.** | Signals (`js/signals.js`) lexon çdo mjet dhe nxjerr grafikë p, c, u dhe I-MR me rregullat e sinjalit (`StatsKit`); logjet e defekteve japin trend ditor/javor me objektivin si vijë; Delay Analyzer ndan vonesat sipas orës së planifikuar; Sigma & Control Chart lexon sipas ditës ose javës. Një bazë SQL në RAM për disa qindra rreshta nuk sjell gjë. Injorohet. |
| 2 | Rrezik privatësie në kompjuter të përbashkët; duhet AES me PIN dhe pastrim me një klik | **Po.** | Puna ishte në tekst të hapur në `localStorage`; team sync enkriptonte vetëm atë që dilte nga pajisja. Asnjë PIN, asnjë "harro gjithçka". **U bë** (më poshtë). |
| 3 | S'ka Undo/versionim; duhen CRDT (Yjs) ose 5–10 pika kthimi | **Pjesërisht.** | Pikat e rikthimit ekzistonin (ditore, para importit, para sync-ut, me dorë) dhe mbi dhjetë mjete kanë "Undo" për fshirjen e një rreshti. Mungonte pika automatike gjatë punës. **U bë**: një pikë çdo 15 minuta kur puna ka ndryshuar, gjashtë të fundit ruhen, pa shtyrë kurrë jashtë një pikë të bërë me dorë. CRDT nuk duhet për një përdorues të vetëm. |
| 4 | Ndërveprim i dobët; duhen SheetJS/PapaParse dhe JSON Resume | **Pjesërisht.** | CSV dhe XLSX lexohen në shfletues prej kohësh (`cv-import.js` zbërthen .xlsx, Pareto pranon CSV/Excel/qeliza të ngjitura, `ImportMap.PRESETS` njeh kolonat e PMS/WMS, volumet ngjiten nga Excel), pa librari. JSON Resume mungonte. **U bë** te ATS CV: eksport dhe import. |
| 5 | Validim i dobët; duhet Zod/Valibot | **Jo.** | `parseNumber` lexon "1.234,50 EUR" dhe "12,5-" (SAP); fushat numerike kanë `min="0"` (67 fusha); logjet refuzojnë sasi nën 1 ("Enter at least one…"); çdo gjendje e ruajtur rindërtohet fushë më fushë (`clean`) që një skedar i dëmtuar të mos prishë faqen; oraret kontrollohen ("Help arrived must be between the call and the solution"). Një librari skeme nuk shton rregull që s'është. Injorohet. |

## Çfarë u bë

### PIN për kompjuterin e përbashkët (`src/js/work-lock.js`, `partials/work-lock.njk`)

- "Kyç mjetet" merr punën e çdo mjeti (çelësat `sc-`, bashkë me kodin e ekipit që team sync të ndalojë) dhe pikat e
  rikthimit, i enkripton me çelës nga PIN-i (PBKDF2-SHA-256, 310 000 raunde, salt i rastit, AES-GCM 256) në një
  rekord në IndexedDB `sc-lock`, heq kopjet e hapura dhe ringarkon faqen. Mjetet hapen bosh pas një dialogu që kërkon
  PIN-in; `ToolKit.write` nuk shkruan gjë sa është kyçur.
- Pas hapjes çelësi mbetet në `sessionStorage` të skedës: skeda kyçet përsëri me një klik ose vetë pas 5/15/30/60
  minutash pa prekje. Me mbylljen e skedës çelësi humbet. PIN-i nuk ruhet askund; PIN i gabuar nuk ndryshon asgjë.
- "Harro gjithçka në këtë pajisje": puna, kyçja, pikat e rikthimit dhe kujtesat hiqen.
- Kufiri thuhet në faqe: kyçja është për kolegun në të njëjtin banak, jo për atë që lexon memorien e shfletuesit
  ndërsa mjetet janë të hapura.
- Verifikuar: `tests/work-lock.test.cjs` (çfarë kyçet dhe çfarë mbetet, rekordi hapet vetëm me PIN-in e vet, bajt i
  ndryshuar ose format i huaj kthen null) dhe në Chromium (kyçje, faqe bosh me dialog, PIN i gabuar, hapje me punën
  në vend).

### Pika rikthimi gjatë punës (`storage-guard.js`)

- Arsye e re "recent": shtypja ose një ndryshim armatos një kohëmatës 15-minutësh; kur bie, bëhet një pikë nëse puna
  ndryshoi. Gjashtë të fundit ruhen, më vete nga pikat ditore dhe nga ato me dorë. Pa prekje nuk ka kohëmatës.

### JSON Resume te ATS CV

- "Shkarko si JSON Resume (.json)" dhe hapja e një skedari `.json` nga çdo mjet tjetër: basics, work, education
  (certifikatat hyjnë te arsimi), skills, languages; datat `2022-03` atje, `03.2022` këtu. Arritjet kryesore, seksionet
  shtesë, titujt dhe gjuha e dokumentit udhëtojnë nën `meta.stivenCatalyst`, që skedari i ruajtur këtu të hapet
  përsëri i plotë. Volunteer, projects dhe awards nga mjete të tjera bëhen seksione.

### Tekste

- 35 tekste të reja në gjermanisht dhe shqip.

## Mbeten për autorin

- Kyçja automatike punon vetëm në skedën që ka kyçur ose hapur një herë; një skedë e re e hapur drejt një mjeti nuk e
  mban çelësin. Një kyçje "kur mbyllet skeda" nuk premtohet, sepse enkriptimi s'mund të garantohet në mbyllje.
- Kujtesat (`sc-reminders`) nuk hyjnë në rekordin e kyçur; mbajnë vetëm tekstin e veprimeve të afatuara.
- Testet në shfletues (`tests/browser/`) s'kanë ende rrugën e kyçjes; testet Node mbulojnë logjikën, prova në Chromium
  u bë me dorë në këtë degë.
