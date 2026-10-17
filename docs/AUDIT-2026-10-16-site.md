# Kontroll i faqes: funksionaliteti, gabimet, shpejtësia

Data: 16 tetor 2026. Baza: `main` pas PR #270 (`1e6f11a`). Kërkesa e autorit: një kontroll i faqes për funksionalitete,
gabime dhe shpejtësi, që faqja të qëndrojë në formën më të mirë, pa prishur asgjë nga ajo që është ndërtuar.

## 1. Përmbledhja

| Pjesa | Çfarë u kontrollua | Rezultati |
| --- | --- | --- |
| Faqet | 508 faqe HTML, 40 731 lidhje dhe burime, ankorat, id-të, hreflang, sitemap, feed-et, podcast-i | 0 lidhje të thyera, 0 ankora që mungojnë, 0 id të dyfishuara, hreflang reciprok, XML-et e vlefshme. Dy faqe mungonin në sitemap: u rregulluan. |
| Shfletuesi | 571 ngarkime në Chromium: të 508 faqet në telefon (390 px) dhe 63 faqe përfaqësuese në desktop (1400 px) | 0 gabime JavaScript, 0 shkelje të Content Security Policy, 0 faqe më të gjera se ekrani, asnjë kërkesë jashtë faqes përveç Cloudflare. Në desktop faqet e mjeteve lëviznin pas ngarkimit (CLS 0,11–0,14): u rregulluan (0,00). |
| Shpejtësia | Madhësia e çdo faqeje dhe burimi, pjesa e CSS-së dhe e skripteve që përdor çdo faqe, fontet, imazhet, animacionet | Ballina nga 28 KB në 13 KB (gzip). Titujt nuk lëvizin më kur arrin fonti. Asnjë burim i panevojshëm. |
| Analitika | Numërimi anonim i vizitave (Cloudflare Web Analytics) | **Nuk regjistron asnjë vizitë** që nga fillimi: beacon-i merr 404. Rregullohet në panelin e Cloudflare (pjesa 3). |
| Testet dhe ndërtimi | `npm test`, `npm run build`, `scripts/check-coaching-build.mjs` | 364/364 para, 370/370 pas (6 teste të reja); ndërtimi 48 s, 525 skedarë. |

## 2. Defektet dhe rregullimet

1. **Titujt lëviznin kur arrinte fonti.** Titujt e mëdhenj shkruhen me Archivo Black; derisa fonti të shkarkohet, shfaqet
   fonti i pajisjes i zgjeruar në masën e tij ("Archivo Black Fallback", `size-adjust: 113%`), me `ascent-override: 88%`
   dhe `descent-override: 21%`. Por shfletuesi i shumëzon edhe këto dy vlera me 113 %, kështu që vija bazë e tekstit
   rezervë ishte 4 % e madhësisë së fontit më poshtë se ajo e Archivo Black: kur arrinte fonti, çdo titull i madh
   kërcente 7–8 px (te një titull 120 px në desktop; 3 px në telefon). Në provë me fontin të vonuar me 600 ms, faqja e
   CV Builder matej me CLS 0,095 vetëm nga ky kërcim. Tani vlerat shkruhen të pjesëtuara me 1,13 (77,9 % dhe 18,6 %),
   dhe matja në Chromium tregon se teksti rezervë dhe Archivo Black kanë të njëjtën lartësi (88 + 21) dhe të njëjtën
   vijë bazë; me fontin të vonuar CLS është 0,000 në ballinë, ese, mjete, role, publikime. Prek çdo pajisje pa Arial
   Black (iPhone, Android, Linux). Testi: `tests/layout-stability.test.cjs`.
2. **Sfondi i faqeve të mjeteve zhvendosej pas ngarkimit.** Vizatimi i familjes pas titullit (`partials/family-stage.njk`)
   vendoset nga `js/family-sky.js` pasi mat titullin: planeti dhe harta e saj lëviznin 13–28 px kur skripti ekzekutohej,
   dhe Chromium i numëronte si lëvizje të faqes (CLS 0,11–0,14 në desktop te KPI Diagnostic, CV Builder, ATS CV, rolet;
   pragu "i mirë" i Google-it është 0,10). Tani vizatimi është i padukshëm derisa të vendoset (`.js .family-sky:not(.is-ready)`)
   dhe shfaqet me një zbutje 0,6 s; pa skripte shfaqet si më parë. Matur pas rregullimit: 0,001–0,002.
3. **Shenja "CV check" rritej kur mbushej.** Në CV Builder, ATS CV dhe Cover Letter lidhja `.cv-badge` është bosh derisa
   skripti të shkruajë "CV check: 3 of 7", dhe shiriti i veglave rritej 20 px kur mbushej. Tani mban vendin e një rreshti
   edhe bosh, e padukshme (`.cv-badge:empty`).
4. **Sitemap-i pa dy faqe.** `/de/how-this-is-made.html` dhe `/sq/how-this-is-made.html` nuk hynin në `collections.all`
   (pagination pa `addAllPagesToCollections`), ndaj as në `sitemap.xml`; vetëm versioni anglisht ishte aty. Tani janë
   495 adresa, të trija brenda. Testi: `tests/layout-stability.test.cjs`.
5. **Ballina mbante gjithë listën e shënimeve.** "Shënimi i ditës" ka nevojë për listën e 218 shënimeve, dhe ajo ishte
   si atribut (`data-notes`, 77 KB) në HTML-in e ballinës në tri gjuhët: 60 % e faqes, 15 KB gzip nga 28. Tani lista
   është një skedar për çdo gjuhë (`/js/notes-en.js`, `-de`, `-sq`; `src/notes-data.njk`, `window.DayNotes`), i ngarkuar
   para skriptit me një vulë të përmbajtjes në adresë, që shfletuesi ta mbajë mes vizitave dhe ta marrë sërish vetëm kur
   shtohet një shënim. Ballina: 130 KB → 52 KB (28 KB → 13 KB gzip). Skripti e lexon listën nga skedari ose, si më parë,
   nga atributi, kështu që testet ekzistuese mbeten të vlefshme. Teste: `tests/note-of-the-day.test.cjs`,
   `tests/layout-stability.test.cjs`, `tests/start-and-note-cards.test.cjs`.
6. **Titulli i librit, i faqes Contact dhe i 404-ës rishkruhej gjatë animacionit.** Këta tituj "vijnë në fokus" me një
   animacion që ndryshonte `letter-spacing` (−0,02 em ose +0,06 em deri në vlerën e zakonshme). Hapësira mes shkronjave
   ndryshon gjerësinë e fjalëve, dhe një titull afër gjerësisë së kolonës kalonte nga dy rreshta në një gjatë sekondës
   së animacionit: në desktop, te libri anglisht, gjithçka nën titull kërcente 93 px lart (CLS 0,034) rreth një sekondë
   pas hapjes. Tani ngushtimi bëhet me `scale` horizontale (0,98 ose 1,06 → 1), që nuk prek faqosjen; pamja mbetet e
   njëjta. Matur pas rregullimit: 0,000 në tri gjuhët.

## 3. Analitika e vizitave nuk punon (duhet rregulluar në Cloudflare)

Faqja ngarkon beacon-in e Cloudflare Web Analytics me token-in `51fb88e3…` (`src/_data/site.json`), në faqet e shkrimeve.
Beacon-i dërgon të dhënat te `https://cloudflareinsights.com/cdn-cgi/rum`, dhe përgjigjja është **404** pa kokat CORS;
shfletuesi e tregon si gabim CORS dhe vizita nuk regjistrohet. U provua nga faqja e vërtetë (Chromium me
`https://stivencatalyst.com/about.html`), dhe duke ridërguar të njëjtin ngarkesë me curl: 404. Një token i trilluar merr
po 404, pra token-i nuk njihet nga ky shërbim.

Shkaku, sipas API-së së Cloudflare (`/accounts/…/rum/site_info/list`): faqja është regjistruar në Web Analytics si
**"automatic setup"** e lidhur me zonën `stivencatalyst.com` (`auto_install: true`, me ruleset në zonë). Ky lloj pret që
trafiku të kalojë nga proxy i Cloudflare (reja portokalli), ku Cloudflare e fut vetë skriptin dhe merr të dhënat te
`stivencatalyst.com/cdn-cgi/rum`. Por domain-i është vetëm DNS (faqja shërbehet drejtpërdrejt nga GitHub Pages: kokat
`server: GitHub.com`), ndaj skripti i futur me dorë nuk njihet. Dokumentacioni i Cloudflare e thotë: "automatic setup
nuk mund të përdoret me një domain DNS-only; duhet manual setup". Prova përfundimtare: analitika e llogarisë
(`rumPageloadEventsAdaptiveGroups`) nuk ka **asnjë** ngarkim faqeje të regjistruar që nga 14 shtatori, për asnjë faqe.

Si rregullohet (rreth 2 minuta, në https://dash.cloudflare.com → Analytics & Logs → Web Analytics):

1. **Add a site**, dhe te hostname-i shkruaj `stivencatalyst.com` me dorë (manual setup, "sites not proxied through
   Cloudflare"), jo duke zgjedhur zonën nga lista. Cloudflare jep një token të ri (snippet-i me `data-cf-beacon`).
2. Vendos token-in e ri te `src/_data/site.json` → `analytics.cloudflareToken`. Faqja, CSP-ja dhe Datenschutz-i
   (seksioni "Besuchszahlen") nuk kanë nevojë për ndryshim tjetër; testi `tests/analytics.test.cjs` e kontrollon.
3. Faqen e vjetër "automatic" mund ta fshish, që të mos ngatërrohen dy hyrje me të njëjtin emër.

Alternativa (të kalosh domain-in nën proxy-n e Cloudflare) do ta bënte të punonte edhe "automatic setup", por ndryshon
mënyrën si shërbehet faqja (GitHub Pages pas Cloudflare: certifikata, cache 10 minuta kundrejt cache-it të Cloudflare,
rregullat e ridrejtimit) dhe nuk është e nevojshme për numërimin e vizitave.

Deri sa të rregullohet, faqja nuk mbledh asgjë dhe nuk ka asnjë dëm për lexuesin; vetëm numrat mungojnë.

## 4. Kontrollet që dolën të pastra

- **Lidhjet dhe burimet:** çdo `href`, `src`, `srcset` dhe `url()` i 508 faqeve çon te një skedar që ekziston; çdo ankorë
  (`#…`) gjen id-në e vet; hreflang-u i çdo faqeje kthehet reciprokisht; sitemap-i përputhet me faqet (përjashtuar 13 faqet
  `noindex`: kërkimi, rafti, faqet ligjore, 404); feed-et e tri gjuhëve (30 hyrje secili) dhe tre feed-et e podcast-it janë
  XML i vlefshëm. Nëntë lidhjet `podcast://`, `overcast://`, `pktc://` në faqen e podcast-it janë skema aplikacionesh, me
  qëllim.
- **Shfletuesi:** të 508 faqet në Chromium si iPhone (390 px, 3×): 0 gabime JavaScript, 0 shkelje CSP, 0 faqe më të
  gjera se ekrani, CLS 0,00 kudo (maksimumi 0,01 te tre numra të Management Review), LCP mesatar 190 ms në server
  lokal. 63 faqe përfaqësuese në desktop (1400 px): njësoj, përveç lëvizjeve të pikës 2 që u rregulluan. Kërkesa të jashtme:
  vetëm `static.cloudflareinsights.com` (dhe asnjë në mjetet dhe rolet, siç premton Datenschutz-i).
- **HTML:** çdo faqe ka saktësisht një `h1`, `lang`, një `description`, `<main>`, asnjë `tabindex` pozitiv, asnjë
  `target="_blank"` pa `rel="noopener"`, asnjë iframe, asnjë figurë pa `alt`. Çdo fushë ka etiketë (edhe `select`-i i
  shpejtësisë së leximit dhe përgjigjet e listës së kontrollit janë brenda `<label>`).
- **Skriptet e përbashkëta** (`script.js`, `shelf.js`, `share-orbit.js`, `share.js`, `note-of-the-day.js`, `search.js`,
  `article.js`, `listen.js`, `cosmos.js`) u lexuan: trajtim i saktë i localStorage-it që mungon, dëgjues `passive` për
  `pointermove`, hero-i i planeteve ndalon kur del nga ekrani, kur fshihet skeda, me "Pause the motion" dhe me reduced
  motion, dhe ul cilësinë vetë nën 30 kuadro/s. Indeksi i kërkimit (113 KB gzip) merret vetëm kur lexuesi shkruan.
- **Shpejtësia e faqeve:** një ese tipike kërkon 16 burime dhe rreth 45 KB gzip pa fontin (CSS 39 KB është pjesa më e
  madhe); ballina pas rregullimit 13 KB HTML + 39 KB CSS + 9 KB skripti i planeteve + 18 KB fonti + 34 KB kopertinat e
  vogla (240 px). Imazhet e kopertinave vijnë në 240/480/720 px sipas vendit, me `width`/`height`, `loading="lazy"` nën
  palosje dhe `fetchpriority="high"` për kopertinën e madhe të një numri. Inter nuk shkarkohet në faqe (fonti i
  sistemit), siç është vendosur; Archivo Black (18 KB) vetëm ku mungon Arial Black.
- **Ndërtimi:** 525 skedarë në 48 s. Raporti i Eleventy-t ia ngarkon 25 % filtrit `imageSize`, por i matur veç ai zgjat
  35 ms për 412 figura: është një artefakt i matjes, jo kosto e vërtetë.
- **Hosti:** GitHub Pages shërben me gzip, HTTP/2 dhe `cache-control: max-age=600`; adresat me `?v=` të CSS-ve dhe
  skripteve e bëjnë çdo ndryshim të marrë adresë të re, ndaj asnjë lexues nuk mban një version të vjetër.

## 5. Vërejtje pa ndryshim (për t'u vendosur nga autori)

Pas vendimit të autorit, gjashtë pikat e para u zbatuan në raundin e dytë (pjesa 7); dy të fundit mbeten siç janë.

- **Shiriti "Listen" në ese** shfaqet vetëm kur shfletuesi ka një zë për gjuhën; në Chrome zërat vijnë pas 0,1–2 s, dhe
  shiriti hyn atëherë mbi tekst duke e shtyrë poshtë rreth 150 px në telefon (CLS 0,02–0,03, brenda pragut "i mirë").
  Mund të shfaqej menjëherë, me butonin në pritje, por kjo ndryshon sjelljen e vendosur ("shfaqet vetëm kur ka zë").
- **CSS-ja:** fleta e lehtë ka 220 KB (39 KB gzip) dhe çdo faqe përdor 8–17 % të saj. Një ndarje sipas llojit të faqes
  (ballina, esetë, lexuesit, faqet e tjera) do të jepte 20–27 KB gzip për faqe, por lexuesi që kalon nga njëra te tjetra
  do të shkarkonte dy-tri fleta në vend të njërës; nuk u bë.
- **Faqja e shënimeve** (358 KB, 36 KB gzip) e përsërit çdo citat tri herë (teksti, "Copy", "Share", kërkimi). Mund të
  nxirrej në shfletues nga vetë citati.
- **Titujt e dritares** mbi 70 shenja në 252 faqe (prapashtesa " | Stiven Catalyst" është 18): Google i pret në rezultate.
- **Animacionet e pafundme me `box-shadow`** (planetet e menysë kur ka të reja, rrethi i çipave në ballinë, portreti dhe
  llamba në About, shenja e familjes te mjetet, pika e esesë tjetër) rivizatohen çdo kuadër; sipërfaqet janë të vogla.
  Pjesa tjetër e animacioneve lëviz vetëm `transform` dhe `opacity`, që kushtojnë pak.
- **`search-index.json`** nuk ka vulë versioni në adresë; pas një botimi, deri në 10 minuta kërkimi mund të përdorë
  indeksin e vjetër.
- **Një mbetje te Cover Letter në desktop (Linux):** kur Archivo Black arrin pas vizatimit të parë, Chromium e numëron
  titullin si të lëvizur (CLS 0,09) edhe pse kuadri i tij nuk ndryshon asnjë piksel (matur para dhe pas fontit): vetëm
  në atë faqe, vetëm në gjerësi desktopi, dhe jo në Windows apo Mac, ku Arial Black është i instaluar dhe fonti nuk
  shkarkohet fare. Në telefon (390 px) të gjitha faqet janë 0,00. Një `<link rel="preload">` për fontin do ta hiqte edhe
  këtë, me 18 KB të tepërta për çdo lexues me Arial Black; nuk u bë.
- **Lexuesi i librit** ndryshon shkallën e faqeve kur bëhet gati (`book.js`, `--pg-scale`): 0,01–0,014 në desktop,
  brenda pragut.

## 6. Provat

| Kontroll | Para | Pas |
| --- | --- | --- |
| `npm test` | 364/364 | 370/370 (0 të anashkaluara) |
| `npm run build` | 525 skedarë, 48 s | 525 skedarë |
| `scripts/check-coaching-build.mjs` | 54 faqe, 9 udhëtime | 54 faqe, 9 udhëtime |
| Lidhjet (508 faqe, 40 731 lidhje) | 0 të thyera | 0 të thyera, sitemap 493 → 495 adresa |
| Chromium, telefon 390 px | 508 faqe: 0 gabime JS, 0 CSP, 0 overflow, CLS 0,00 | 63 faqe përfaqësuese: njësoj |
| Chromium, desktop 1400 px (63 faqe) | CLS 0,11–0,14 te mjetet dhe rolet, 0,034 te libri | 0,00–0,01 |
| Fonti i vonuar 600 ms (8 faqe, 390 dhe 1400 px) | CLS deri 0,095 | 0,000 |
| Ballina (gzip) | 27,8 KB | 12,7 KB |
| Pamja e 10 faqeve të prekura (kpi-diagnostic, cv-builder, ats-cv, cover-letter, area-manager, libri, Contact, 404, një ese, Publications), 1400 dhe 390 px | ndërtimi i mëparshëm | 20 pamje, 0 piksel ndryshim |

## 7. Raundi i dytë: vërejtjet e pjesës 5, të zbatuara

Kërkesa e autorit pas raportit: "Bëj dhe këto ndryshime, që çdo gjë të jetë profesionale dhe e mirë." U zbatuan gjashtë
pikat e para të pjesës 5 (shiriti "Listen", CSS-ja, faqja e shënimeve, titujt e dritares, animacionet, indeksi i
kërkimit) dhe një e gjetur gjatë punës (kopertinat pa përmasa), me të njëjtin kusht si raundi i parë: pamja dhe sjellja
për lexuesin mbeten të njëjtat, përveç asaj që thuhet këtu, dhe çdo ndryshim u mat para dhe pas.

1. **Shiriti "Listen" zë vendin që në hapje.** Shiriti shfaqet sapo shfletuesi di të flasë, para se të vijë lista e
   zërave, kështu që teksti nën të nuk lëviz më; butoni pret (`disabled`, `aria-busy`) derisa lista të arrijë (0,1–2 s
   në Chrome), dhe pa zë për gjuhën e faqes shiriti e thotë si më parë. Lëvizja e mëparshme (CLS 0,02–0,03 në telefon)
   nuk ndodh më. `src/js/listen.js`, testi `tests/listen.test.cjs`.
2. **Titujt e dritares brenda 60 shenjave ku mundet.** Emri i faqes (" | Stiven Catalyst") ndjek titullin vetëm kur e
   tëra mbetet brenda 60 shenjave, aq sa tregon një rezultat kërkimi; një titull më i gjatë qëndron vetëm, se emri do
   të ishte pikërisht pjesa që pritet (emri mbetet te të dhënat e strukturuara). Tituj mbi 60 shenja: 338 → 195; mbi 70:
   254 → 76. Ata që mbeten janë titujt e vetë shkrimeve (më i gjati, 106 shenja, është titulli gjermanisht i esesë
   "Nga retail-i te logjistika dhe hoteleria..."), që vetëm autori mund t'i shkurtojë. `layouts/base.njk`.
3. **Indeksi i kërkimit me vulë versioni.** Adresa e `search-index.json` mban tani vulën e përmbajtjes së tij
   (`?v=feaba9bd1c`, filtri `stamp`), si CSS-ja dhe skriptet: pas një botimi kërkimi merr indeksin e ri, jo atë që
   shfletuesi mund ta mbante deri në 10 minuta. `pages/search.njk`.
4. **Kopertinat e lexuesve me përmasa.** Faqet e shtypit të Management Review, From the Floor dhe traktatit shkruanin
   kopertinën pa `width`/`height`: 513 figura pa përmasa në faqen e ndërtuar. Tani 0; faqja e mban vendin e figurës edhe
   para se ajo të arrijë. `print/review-page.njk`, `weekly-page.njk`, `treatise-page.njk`.
5. **Faqja e shënimeve pa tekst të përsëritur.** Çdo kartë e mbante citatin katër herë (teksti, `data-search`, "Copy",
   "Share"). Tani një herë: `filter.js` kërkon te vetë citati dhe tema, `share.js` ndërton tekstin e "Copy" dhe të
   "Share" nga citati dhe adresa e kartës, fjalë për fjalë si më parë (testi `tests/lean-pages.test.cjs` i krahason me
   tekstet e mëparshme). Anglisht 361 → 261 KB (35,5 → 29,0 KB gzip), gjermanisht 381 → 270 KB (41,4 → 32,1), shqip
   375 → 269 KB (37,8 → 30,9).
6. **CSS-ja sipas llojit të faqes.** Më parë çdo faqe jashtë mjeteve merrte fletën e lehtë (220 KB, 39 KB gzip) dhe
   mjetet e rolet gjithë fletën (311 KB, 55 KB gzip). Tani `lib/css-split.js` shkruan pas ndërtimit një kopje për çdo
   lloj faqeje, me rregullat në radhën e tyre, pa ato që kërkojnë një klasë që nuk shfaqet në asnjë faqe të atij lloji
   as në skriptet që ato ngarkojnë, dhe pa `@keyframes` që asnjë rregull nuk i përdor:

   | Fleta | Faqet | gzip | Më parë |
   | --- | --- | --- | --- |
   | `styles-home.css` | ballina, në tri gjuhët | 20,0 KB | 39 KB |
   | `styles-essay.css` | esetë dhe reflektimet | 20,0 KB | 39 KB |
   | `styles-reader.css` | Management Review, revista, traktati, libri, udhëzuesi | 22,5 KB | 39 KB |
   | `styles-page.css` | listat, About, Contact, Search dhe të tjerat | 25,5 KB | 39 KB |
   | `styles-tool.css` | mjetet dhe rolet | 33,8 KB | 55 KB |

   Çdo faqe lidh fletën e llojit të vet me vulën e përmbajtjes në adresë. Lexuesi që kalon nga një ese te një mjet
   shkarkon një fletë të dytë (20 + 34 KB në vend të 39 + 55 KB), pra edhe atëherë më pak se më parë. Testet:
   `tests/css-split.test.cjs` (çdo faqe e ndërtuar ngarkon fletën e llojit të vet dhe asnjë tjetër; rregullat e
   ndarjes), `tests/page-transitions.test.cjs` (lexon fletën e secilës faqe).
7. **Animacionet e pafundme pa punë në fillin kryesor.** Pulset që ndryshonin `box-shadow` (planetet e menysë kur ka
   të reja, rrethi i çipave në ballinë, portreti dhe llamba në About, shenja e familjes te mjetet, pika e esesë tjetër,
   shenja "live" te Projects, butoni i podcast-it kur luan, planetet në Contact) lëvizin tani vetëm `scale` dhe
   `opacity`: unaza ose drita vizatohet një herë në një pseudo-element dhe compositor-i vetëm e zbeh, pa rivizatim.
   Kopertinat që notojnë lëvizin me `translate` në vetë kopertinën (drita poshtë saj mbetet te objekti), se me të dyja
   në një element Chromium e vinte notimin në fillin kryesor. Kuadrot e kulmit u krahasuan para dhe pas: e njëjta pamje.
   Veç kësaj, çdo gjë që lëviz pa fund ndalon sa është jashtë ekranit dhe rinis pak para se të rikthehet
   (`.is-offscreen`, një IntersectionObserver në `script.js` me 25 % hapësirë): çipat dhe rafti i planeteve, vizatimi
   pas titullit të mjetit, kartat e familjes, kopertinat, portreti. Puna në fillin kryesor me faqen të qetë pas
   ngarkimit (milisekonda për sekondë, Chromium): About 139 → 1,5; Insights 112 → 0,1; Publications 125 → 0,2; Projects
   70 → 0,1; mjetet dhe rolet 0,2–0,9 sapo lexuesi kalon vizatimin e planetit, që më parë vazhdonte edhe jashtë ekranit.
   Më parë këto faqe rillogarisnin stilet 60 herë në sekondë sa kohë rrinin hapur, pa asgjë të re në ekran: bateri në
   telefon dhe laptop. "Pause the motion" dhe reduced motion vlejnë si më parë (rregullat u shtrinë te pseudo-elementet
   dhe kopertinat).

Provat e raundit të dytë:

| Kontroll | Para | Pas |
| --- | --- | --- |
| `npm test` | 370/370 | 380/380 (0 të anashkaluara) |
| `npm run build`, `scripts/check-coaching-build.mjs` | 525 skedarë; 54 faqe, 9 udhëtime | 528 skedarë; 54 faqe, 9 udhëtime |
| Lidhjet, ankorat, sitemap-i (508 faqe) | 0 të thyera | 0 të thyera |
| Chromium, telefon 390 px, 508 faqe | 0 gabime JS, 0 CSP, 0 overflow, CLS 0,00 | 508 faqe: 0 gabime JS, 0 kërkesa të dështuara, 0 CSP, 0 overflow, CLS 0,000 në çdo faqe (edhe esetë, me shiritin "Listen" që tani zë vendin në hapje), LCP median 144 ms në server lokal |
| Chromium, desktop 1400 px, 63 faqe | 0 gabime JS, 0 CSP, 0 overflow, CLS 0,00–0,01 | 63 faqe: 0 gabime JS, 0 kërkesa të dështuara, 0 CSP, 0 overflow; CLS 0,000–0,017, të njëjtat mbetje të njohura të pjesës 5 (shkalla e lexuesit te udhëzuesi, Nr. 05 dhe libri shqip; 0,010 te Cover Letter nga fonti në Linux), LCP median 200 ms |
| Fonti i vonuar 600 ms (8 faqe) | CLS 0,000 | 0,000 |
| Pamja e 55 faqeve në 1400 dhe 390 px (110 çifte) kundrejt ndërtimit të mëparshëm | | 95 çifte 0 piksel; 15 me ndryshime që nuk vijnë nga kodi: kanavaca e rastësishme e ballinës (4), kopertinat `loading="lazy"` që herë hyjnë e herë jo në pamje (5, në të dy drejtimet), pjesët me `content-visibility: auto` ende të pavizatuara në çastin e pamjes (4; faqosja u mat element për element, 1 187 elemente të njëjtë), dhe drita e qëndrueshme e pikës "2026 – today" në About (2, e qëllimshme, 132 piksel) |

Mbetet për autorin: analitika në Cloudflare (pjesa 3) dhe dy vërejtjet e fundit të pjesës 5, që nuk kërkojnë veprim.
