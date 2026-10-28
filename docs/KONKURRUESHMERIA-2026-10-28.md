# Stiven Catalyst Tools përballë alternativave: ku qëndrojmë, ku jo, çfarë vlen më shumë

Data: 28 tetor 2026. Baza: `main` pas PR #364 dhe dega `feature/tools-reliability-reports`. Vlerësim i punës, jo
reklamë: çdo "po" më poshtë ka një skedar pas vetes, çdo "jo" është një kufi strukturor që pranohet, jo fshihet.
Krahasimi është me kategoritë e mjeteve që një drejtues operacionesh, një shift lead ose një kërkues pune has
realisht, jo me produkte të caktuara në versione të caktuara, që ndryshojnë çdo muaj.

## 1. Çfarë jemi dhe çfarë nuk jemi

Stiven Catalyst Tools është një koleksion prej 59 mjetesh që hapen në shfletues, pa llogari, pa server për të dhënat,
në tri gjuhë, të lidhura me ese dhe një udhëzues të shtypur. Nuk është ERP, nuk është sistem me shumë përdorues dhe
role, nuk ka bazë të dhënash qendrore. Këto nuk janë mangësi për të mbushur, por kufiri që e bën të mundur çmimin
zero, privatësinë dhe shpejtësinë.

## 2. Krahasimi sipas kritereve të autorit

| Kriter | Stiven Catalyst Tools | Excel / Google Sheets | SaaS operacionale (inspektime, Lean, CMMS të lehta) | Platforma CV / ATS-check | Shabllone (Notion, Word) |
| --- | --- | --- | --- | --- | --- |
| Shpejtësia e kryerjes së punës | Mjeti hapet në 1–2 s, shembull me një klik, ruajtje automatike në çdo shtypje | E shpejtë për njohësin, e ngadaltë për të tjerët; pa strukturë | Hyrje, projekt, formular; më e ngadaltë për një rast të vetëm | Ngarko CV, prit analizën; shpesh pas regjistrimit | Kopjo, plotëso me dorë |
| Klikime dhe hapa | Një faqe për mjet; kalimet mes mjeteve me një buton (log → Pareto → 5 Why → handover) | Shumë, të gjitha me dorë | Të ndërtuara mirë brenda produktit | Pak, por me regjistrim | Shumë |
| Siguria e të dhënave | Vetëm në pajisje; PIN me AES-GCM; skedar i vulosur me fjalëkalim; transferim i vulosur; pika rikthimi; asgjë në server pa enkriptim nga pajisja | Në cloud (Google) ose në skedar të hapur | Në serverin e ofruesit, me kontrata | Në serverin e ofruesit; CV-ja me të dhëna personale ngarkohet | Në cloud |
| Puna offline | Plotë: PWA, service worker, çdo mjet pasi është hapur një herë | Pjesërisht (Sheets offline me cilësim) | Pjesërisht, me sync kur ka rrjet | Jo | Dobët |
| Kalimi mes pajisjeve | Skedar pune (edhe i vulosur), team sync me kod ekipi, dorëzim me link/QR të vulosur dhe kod konfirmimi | Automatik në cloud | Automatik | Në llogari | Automatik |
| Historiku dhe gjurmueshmëria | Historik 30 turnesh te Handover, pika rikthimi, "kush ndau / kush konfirmoi" te transferimi; **pa autor për çdo rresht** | Pa historik strukturor | Audit trail i plotë për përdorues | Jo | Versione të faqes |
| Përgjegjësia për çdo detyrë | Përgjegjës, afat, bartje te çështjet; Action Tracker me kujtesa lokale | Me dorë | Po, me njoftime | Jo | Me dorë |
| Verifikimi i mbylljes | Konfirmim lokal + kod konfirmimi manual te Handover; "verifikuar" si hap i ardhshëm i rrjedhës | Jo | Po, shpesh me foto dhe nënshkrim | Jo | Jo |
| Celulari | Floor mode, 390 px testuar në CI, QR për dorëzimin | Aplikacion i mirë, formularë të vështirë | Aplikacione native të mira | Mesatar | Mesatar |
| Gjuhët dhe aksesueshmëria | EN / DE / SQ në të njëjtën thellësi; axe në CI; vetëm me tastierë testuar | Ndërfaqe e përkthyer, përmbajtja jo | EN kryesisht, pak DE | EN | EN |
| Eksporti dhe kontrolli mbi të dhënat | CSV, XLSX, PDF i vetin (ATS CV, Shift Handover), DOCX, PNG/SVG, JSON Resume, skedar pune; përdoruesi ka gjithçka në dorë | I plotë | Eksport i kufizuar, varësi nga abonimi | PDF | Eksport i faqes |

Në pesë nga njëmbëdhjetë kriteret (siguria e të dhënave, offline, gjuhët, eksporti, shpejtësia e nisjes) qëndrojmë
para alternativave për përdoruesin tonë. Në dy (gjurmueshmëria për përdorues, verifikimi me foto/nënshkrim) SaaS-et
janë më përpara, dhe kjo ka një shkak strukturor: pa server dhe pa identitet, "kush" mbetet ajo që shkruan vetë
përdoruesi.

## 3. Avantazhi ynë real, me prova

1. **Përdorim i menjëhershëm, pa regjistrim.** Faqja e mjetit është gjithçka; nuk ka onboarding, nuk ka email.
2. **Privatësia si arkitekturë, jo si premtim.** Të dhënat nuk dalin nga pajisja; kur dalin (team sync, dorëzim),
   dalin të enkriptuara me çelës që serveri s'e ka. Teksti i privatësisë është shkruar nga kodi.
3. **Shumëgjuhësi e vërtetë.** 7 600+ tekste ndërfaqeje në DE dhe SQ, teste që dështojnë për një tekst të
   papërkthyer; shqipja në nivel të barabartë, që asnjë alternativë s'e ka.
4. **Rrjedha të lidhura, jo mjete të shkëputura.** Log → Pareto → 5 Why → veprim → handover → Signals, me kalime të
   testuara (auditimi i 27 tetorit, faza 1).
5. **Eksport që i përket përdoruesit.** PDF i vetin për CV-në dhe dorëzimin, Word, Excel, JSON Resume: asgjë e
   mbyllur në platformë.
6. **Metodë pas çdo mjeti.** Esetë, udhëzuesi i shtypur (botimi 8), kursi: mjeti vjen me arsyen e vet.

## 4. Kufijtë strukturorë (pa backend)

- **Identiteti.** Pa llogari, "kush bëri çfarë" është ajo që shkruhet; kodi i konfirmimit vërteton hapjen me kodin,
  jo personin. E thënë në faqe, në README dhe në raport.
- **Shumë përdorues njëkohësisht në të njëjtat të dhëna.** Team sync bashkon gjendje; nuk ka rreshta me autor dhe
  kohë. Një ekip prej 3–5 vetash punon; 30 veta mbi një log kërkojnë server.
- **Njoftime push dhe automatizim jashtë faqes.** Kujtesat janë lokale; asnjë email, asnjë integrim me PMS/WMS të
  drejtpërdrejtë. Importi është skedar ose ngjitje.
- **Backup-i varet nga përdoruesi.** Pikat e rikthimit dhe skedari janë në pajisje; humbja e pajisjes pa skedar të
  ruajtur është humbje. Team sync e zbut, nuk e heq.

## 5. Përmirësimet me ndikimin më të madh dhe koston më të ulët (në radhë)

| # | Përmirësim | Përfitimi për përdoruesin | Kosto mirëmbajtjeje | Gjendja |
| --- | --- | --- | --- | --- |
| 1 | Prova në shfletues për çdo mjet (177 faqe) në CI | Një regresion nuk del më te përdoruesi | E ulët: një spec që lexon `tools.json` | Në këtë degë |
| 2 | Raportet si PDF të vetë faqes, me tabela | E njëjta fletë në çdo pajisje, pa dialogun e printimit | E ulët: `pdf-kit.js` ekziston, tabelat u shtuan | Shift Handover në këtë degë; Night Audit, Ops Report, Print Pack radhën tjetër |
| 3 | Skedar pune i vulosur | Skedari në Downloads ose email s'lexohet | E ulët: e njëjta kriptografi si PIN-i | Në këtë degë |
| 4 | Rrjetë gabimesh | Dështimi s'është më i heshtur; përdoruesi di çfarë të bëjë | Shumë e ulët | Në këtë degë |
| 5 | CSS sipas faqes së mjetit (434 KB → ~150 KB) | Hapje më e shpejtë në telefon me rrjet të dobët | E mesme: `lib/css-split.js` ekziston, duhet matje vizuale | PR më vete |
| 6 | Rrjedha Problem → Evidence → … → KPI mbi strukturat e Handover-it | Platforma operacionale që autori synon | E mesme-lartë | Faza tjetër, me miratim |
| 7 | Autor dhe kohë në rreshtat e logeve (lokal) | Gjurmueshmëri pa server, brenda një pajisjeje ose ekipi | E ulët-mesme | Pas 6 |
| 8 | Njoftim "kopja e ekipit lëvizi" + Worker-i i ri | Ekipet ekzistuese s'mbeten pa sync | E ulët kod, vendim i autorit për Worker-in | Pret autorin |

Të lëna jashtë me arsye: SLM/WebGPU (asnjë përfitim i provuar, pajisjet e dyshemesë s'e mbajnë), WebRTC (QR +
link i vulosur e mbulojnë), ESCO/O\*NET i plotë (MB, pa lidhje me rolet tona), framework ose gjenerues PDF të jashtëm
(`pdf-kit.js` bën tabela dhe tekst; grafikët në PDF kërkojnë imazhe, hap i vogël kur të duhen).
