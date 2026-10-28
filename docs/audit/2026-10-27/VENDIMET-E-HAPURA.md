# Vendimet e autorit: të marra dhe të hapura

Përditësuar më 27 tetor 2026. Këtu janë vetëm vendimet që kërkojnë fakte ose miratim nga autori. Asnjë fakt, asnjë
origjinal shqip, asnjë tekst i librit dhe asnjë tekst ligjor nuk ndryshon pa përgjigjen e tij. Detajet janë në
skedarët e treguar; numrat e gjetjeve janë ato të `RAPORTI-I-KONSOLIDUAR.md`.

## A. Të vendosura më 27 tetor 2026 (përfshirë vendimet përfundimtare të mbrëmjes)

| Çështja | Vendimi | Ku është zbatuar |
| --- | --- | --- |
| Radari i Zenith-it (M-04) | Miratohet rikthimi i radarit dhe korrigjimi i animacioneve të lidhura | `22edfaff` |
| Rrota e mausit (M-06) | Miratohet lëvizja natyrale e shfletuesit, me kusht që të ruhen animacionet, tranzicionet dhe lëvizjet e tjera të buta | `2d9f9906`: hiqet vetëm "glide" i rrotës; lidhjet brenda faqes rrëshqasin ende, asnjë animacion apo tranzicion nuk preket |
| Ari i Lumen-it, tema e çelët | Miratohet përmirësimi i kontrastit | `5dd8dfc5`: #9c824a → #7b683e, 3.18:1 → 4.67:1 |
| Pause | Miratohet vendi (kryefaqja dhe footer-i) dhe ruajtja e zgjedhjes | në degë që në Fazën 3 |
| Planetët në celular | Vendim përfundimtar: as patch-i 1.5, as versioni adaptiv. Mprehtësia dhe identiteti i katër planetëve mbeten si sot; propozimet e optimizimit mbeten vetëm të dokumentuara | Asgjë e aplikuar. Krahasimi dhe dy patch-et: `phase3/planets-touch.md`, `phase3/proposals/` |
| Rollback me PIN të kyçur | Asgjë të mos mbishkruhet pa mundësi rikthimi | `e6203a47`: puna e shkruar gjatë kyçjes ruhet si pikë rikthimi "Para hapjes" para se të kthehet puna e kyçur |
| Shembulli i Action Tracker gjatë rollback-ut | Të mos shndërrohet në veprime reale | `17f737ad`: shembulli mbetet shembull në faqen e vjetër dhe pas kthimit |
| SEO-02, lidhjet mes reflektimeve | Shtyhet për një ndryshim editorial më vete; lidhjet e rekomanduara duhet të jenë kuptimplota | asgjë e ndryshuar |
| Team Sync Worker, Cloudflare | Mos publiko; mos ndrysho konfigurimin | asgjë e publikuar; plani: `docs/SYNC-WORKER-MIGRATION.md` |
| Publikimi | Draft PR për shqyrtim; asnjë merge pa miratimin përfundimtar | `docs/RELEASE.md` |
| Kufizimet e njohura | Pranohen siç janë | `RAPORTI-I-PUBLIKIMIT.md` §3 |
| Teksti i privatësisë (P-01) | Shtesë faktike nga kodi, në tri gjuhët, para merge-it; pa vlerësim ligjor. Saktësimet e 28 tetorit: baza ligjore vetëm për ruajtjen që nis lexuesi; analytics pa pretenduar matje | `f5701ab4`, `53cf44bc`; teksti përfundimtar pret miratimin tënd (B.5) |

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

### 5. Teksti i privatësisë (P-01): teksti përfundimtar pret miratimin tënd
Shtesa faktike (`f5701ab4`) dhe dy saktësimet e tua të 28 tetorit (`53cf44bc`) janë në degë, te `src/datenschutz.njk`,
në EN/DE/SQ:
- **Baza ligjore:** § 25(2) nr. 2 TDDDG përmendet vetëm për ruajtjen që lexuesi e nis vetë. Ruajtja automatike
  (shenjat "e re" të menysë `sc-seen-*`, progresi i leximit, kopjet e service worker-it) përshkruhet pa asnjë bazë
  ligjore. Asnjë bazë e re nuk u shtua.
- **Analytics:** faqja thotë cilat faqe e ngarkojnë skriptin, për çfarë shërben dhe çfarë është ndërtuar të dërgojë.
  Nuk thotë që vizitat po numërohen, sepse konfigurimi nuk është rregulluar ende (A-01).

**Kërkon verifikim më vete, jashtë këtij publikimi:** klasifikimi ligjor i ruajtjes automatike (`sc-seen-*`, progresi
i leximit, kopjet e service worker-it) sipas § 25 TDDDG, dhe nëse nevojitet pëlqim. Kjo është pyetje për ty ose për
një jurist. Faqja nuk pretendon asgjë për të. Kur të rregullohet Analytics (A-01), paragrafi i saj mund të rishikohet.

Faktet e auditimit: `phases/p2c-career-platform.md` (P2C-07).

### 6. Të tjera
- Përshkrimet e KPI Diagnostic (titulli SEO) dhe ATS CV ("fehlerfrei", "shumica e punëdhënësve…" pa burim).
- Cloudflare Web Analytics nuk mbledh asgjë (A-01): cilësim llogarie, nuk preket pa ty.
- Podcast-i shqip nr. 1 (P-05): të kontrollohet kundrejt numrit; zhurma e podcast-it (P7-06 – P7-08): do të thotë rikodim i audios së publikuar.
- Kërkimi i një "a" të vetme (vendimi 8 i Fazës 1).
- Team Sync Worker: hapi 1 i planit, kur ta vendosësh.
