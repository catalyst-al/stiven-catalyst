# Vendimet e autorit: të marra dhe të hapura

Përditësuar më 27 tetor 2026. Këtu janë vetëm vendimet që kërkojnë fakte ose miratim nga autori. Asnjë fakt, asnjë
origjinal shqip, asnjë tekst i librit dhe asnjë tekst ligjor nuk ndryshon pa përgjigjen e tij. Detajet janë në
skedarët e treguar; numrat e gjetjeve janë ato të `RAPORTI-I-KONSOLIDUAR.md`.

## A. Të vendosura më 27 tetor 2026

| Çështja | Vendimi | Ku është zbatuar |
| --- | --- | --- |
| Radari i Zenith-it (M-04) | Miratohet rikthimi i radarit dhe korrigjimi i animacioneve të lidhura | `22edfaff` |
| Rrota e mausit (M-06) | Miratohet lëvizja natyrale e shfletuesit, me kusht që të ruhen animacionet, tranzicionet dhe lëvizjet e tjera të buta | `2d9f9906`: hiqet vetëm "glide" i rrotës; lidhjet brenda faqes rrëshqasin ende, asnjë animacion apo tranzicion nuk preket |
| Ari i Lumen-it, tema e çelët | Miratohet përmirësimi i kontrastit | `5dd8dfc5`: #9c824a → #7b683e, 3.18:1 → 4.67:1 |
| Pause | Miratohet vendi (kryefaqja dhe footer-i) dhe ruajtja e zgjedhjes | në degë që në Fazën 3 |
| Planetët në celular (rezolucioni 1.5) | Patch-i mbetet veçmas; krahasim vizual dhe provë në telefon real para çdo vendimi; mprehtësia, ndriçimi dhe identiteti nuk sakrifikohen për FPS | Jo në degë. Krahasimi (`phase3/planets-touch.md`): ndriçimi dhe ngjyrat ruhen, por detajet e imëta humbasin rreth gjysmën (−41 deri −55 % për planet dhe emrat), pra patch-i 1.5 **nuk** e plotëson kushtin tënd. Alternativa që pret ty: `planets-touch-dpr-adaptive.patch` (densiteti 2 si sot; ulet në 1.5 vetëm kur telefoni nuk arrin 30 fps; në telefonat që e mbajnë ritmin, 0 piksele ndryshim). Telefoni real: procedura në po atë dokument |
| SEO-02, lidhjet mes reflektimeve | Shtyhet për një ndryshim editorial më vete; lidhjet e rekomanduara duhet të jenë kuptimplota | asgjë e ndryshuar |
| Team Sync Worker, Cloudflare | Mos publiko; mos ndrysho konfigurimin | asgjë e publikuar; plani: `docs/SYNC-WORKER-MIGRATION.md` |
| Publikimi | Draft PR për shqyrtim; asnjë merge pa miratimin përfundimtar | `docs/RELEASE.md` |

## B. Të hapura: kërkojnë fakte ose miratim

### 1. Kronologjia e karrierës (E-03, E-12)
Burimi: `phase2/timeline-contradictions.md` (119 pohime, 7 kontradikta, me citat dhe rresht). Gjashtë pyetje:
1. Për cilat "javët e para në hotel" flet shënimi te *The tools you build yourself*?
2. Kur dhe ku ishte nata kur ra sistemi, dhe në cilin rol? (tregohet tri herë, në vite e role të ndryshme)
3. Cili është titulli yt sot në hotel? ("Nga terreni" thotë Night Auditor, "Rreth meje" Night Manager që nga nëntori 2025)
4. A ndërrove hotel në shtator 2026?
5. Ku u ndërtua *Front Desk Control*, dhe a e ka përdorur dikush tjetër?
6. Kur mbaroi roli Area Manager, dhe a ishte para apo pas rolit të dispeçerit?

Pas përgjigjeve: korrigjim me shënim me datë në tre gjuhët; titulli i *The night the system went down* (E-12);
postimet e LinkedIn të planifikuara në `docs/`, që përsërisin versionet e korrigjuara.

### 2. Origjinalet shqip (E-08 – E-11, P4-08, P4-12, P4-16)
Burimi: `phase2/albanian-proposals.md`. Çdo propozim ka fjalinë origjinale, skedarin dhe rreshtin, problemin dhe
opsionet:
- ju/ti në rreth 50 fjali: opsioni A ("Më lejoni…" si formulë) ose B ("Më lër…");
- *Pazari me një vit jetë*: llogaria për ditë pune, biletat e autobusit dhe kafeja, "më i varfër se ditën e parë";
- *Pesë pyetje*: "katërmbëdhjetë ditë, sipas ligjit" (Kodi i Punës jep të paktën 22 ditë pune që nga gushti 2024), dhe sqarimi i "lekëve të vjetra" për EN/DE;
- opinionet e paraqitura si fakte (E-11), modeli i përbashkët i reflektimeve (E-08), përgjithësimet për shqiptarët (P4-16);
- termat: "udhëheqja"/"lidershipi", "procedurë standarde pune", "eskalimi", shkronja pas dy pikave.

### 3. Libri (B-01, P6-02, P6-04, P6-05)
- Kopertina e pasme: "çfarë ka mbetur brenda tij": njeriu apo qyteti? (EN dhe DE e përkthejnë ndryshe)
- Rreshti i botimit: a shtohet "përkthyer me ndihmën e AI, rishikuar nga autori" (vetëm nëse është e vërtetë)?
- "bei Gjergj Kastrioti Skënderbeu" (P6-02), dhe metadata e PDF-ve të librit (P6-04, teknike, pret vendimin bashkë me tekstin).

### 4. Management Review (E-01, E-04, E-06, P5-06)
Burimi: `phase2/management-review.md` §9 dhe `phase2/tools-guide-and-pdf-check.md` §4:
- edicioni special: "tetor 2026" (tani) apo "shtator 2026" me rreshtin "online që nga 4 tetori";
- "redaksia / the editors" brenda numrave (184 vende në EN): mbetet, e shpjegon kolofoni, apo rishkruhet;
- shënimi "çdo shifër u kontrollua sërish më 12 tetor" (64 numra) të printohet edhe në PDF?
- emri "Monthly edition", kur 80 numra dolën online brenda katër ditëve;
- shtyllat mbi shkallë të shkurtuar pa bosht (P5-06): ndryshimi prek grafikët e publikuar dhe PDF-të.

### 5. Teksti i privatësisë (P-01)
Faqja e privatësisë në Fazën 3 mori vetëm dy përditësime faktike që burojnë nga kodi: zgjedhja e Pause-s dhe zërat
online të leximit me zë. Pjesa tjetër pret ty, sepse është tekst ligjor:
- fotot në IndexedDB (`sc-media`) për 5S, kryqin e sigurisë, Room Inspection, mirëmbajtjen dhe kapjen në terren;
- lista e mjeteve që ruajnë të dhëna personale (emra dhe telefona mysafirësh te Lost & Found dhe Guest Complaints, emra punonjësish te Skills Matrix dhe Shift Capacity, etj.);
- çelësat `sc-seen-*` që shkruhen në vizitën e parë pa veprim të lexuesit;
- vendndodhja e analytics.
Faktet: `phases/p2c-career-platform.md` (P2C-07).

### 6. Të tjera
- Përshkrimet e KPI Diagnostic (titulli SEO) dhe ATS CV ("fehlerfrei", "shumica e punëdhënësve…" pa burim).
- Cloudflare Web Analytics nuk mbledh asgjë (A-01): cilësim llogarie, nuk preket pa ty.
- Podcast-i shqip nr. 1 (P-05): të kontrollohet kundrejt numrit; zhurma e podcast-it (P7-06 – P7-08): do të thotë rikodim i audios së publikuar.
- Kërkimi i një "a" të vetme (vendimi 8 i Fazës 1).
- Team Sync Worker: hapi 1 i planit, kur ta vendosësh.
