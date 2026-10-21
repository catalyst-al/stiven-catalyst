# Analizë e thelluar narrative dhe traktat teoriko-praktik operacional

Botimi i ri te Botimet, i kërkuar nga autori më 12 tetor 2026: një traktat operacional në vëllime, i ndërtuar mbi një
formulë me tri shtresa, **Skena e gjallë → Zbërthimi konceptual dhe shkencor → Protokolli operativ i veprimit**. Burimi
janë dy PDF-të e autorit (Management Review, Volume 1 dhe Volume 2, anglisht), të rishkruara për faqen në tri gjuhët,
me shifrat e verifikuara të numrave 40 dhe 56 të Management Review dhe me grafikët e tyre.

## Vendimet

- **Emri.** Botimi quhet siç e kërkoi autori: "Analizë e thelluar narrative dhe traktat teoriko-praktik operacional"
  (EN "In-depth narrative analysis and theoretical-practical operational treatise", DE "Vertiefte narrative Analyse und
  theoretisch-praktischer operativer Traktat"). Emri i shkurtër për kokat e faqeve dhe kartat: "Traktati operacional".
  Kopertina mban kokën "Management Review" dhe në cep dy rreshtat e emrit, si te PDF-të; numërimi është me **vëllime**
  (Vëllimi 1, 2 …), jo me numra.
- **Formula.** Çdo kapitull ka tri shtresa, në këtë radhë: skena (e ndërtuar nga kategori të vërteta pune, me një flamur
  që e thotë), zbërthimi (modeli që e shpjegon dhe kërkimi që e provon, me popullatën, vitin dhe kufijtë) dhe protokolli
  (fusha, pyetje, ritëm, numërim, me pronar dhe kthim informacioni). Një shtresë mund të zërë më shumë se një faqe
  (zbërthimi me dy studime). Testi (`tests/treatise.test.cjs`) kërkon që skena të hapë kapitullin dhe protokolli ta mbyllë.
  Çdo faqe kapitulli mban sipër një shirit me tri shtresat, ku ndriçohet e veta (e kuqe skena, blu zbërthimi, e bardhë
  protokolli).
- **Faqet.** Kopertina, editoriali (me tri shtresat dhe kontratën e leximit), përmbajtja (kapitujt me faqet e tyre në tri
  kolona), kapitujt, mjeti i vëllimit, eseja e mbylljes, metoda, burimet, kopertina e pasme. Vëllimi 1 ka 18 faqe, Vëllimi
  2 ka 30, Vëllimi 3 ka 31. Të njëjtat faqe printohen (`node scripts/treatise.mjs`) dhe shfaqen të gjalla te lexuesi; vetëm kopertina
  ruhet si fotografi.
- **Shifrat.** Vijnë nga Nr. 40 (gemba: Teresko 2004, fjalori i LEI, Womack 2011, Mann 2005 dhe 2014, Tucker & Singer
  2015, Sexton et al. 2014) dhe Nr. 56 (VSM: Rother & Shook 1999, fjalori i LEI, Martin & Osterling 2014, Martin 2009,
  Vidal-Carreras et al. 2022, Marin-Garcia et al. 2021), të kontrolluara te tekstet e plota siç thuhet te
  `docs/revista/management-review-nr-40.md` dhe `nr-56.md`. Burim i ri: James P. Womack, "Purpose, Process, People",
  kolonë e 12 qershorit 2006 te The Lean Post (lean.org), lexuar e plotë: pyetjet qëllimi, procesi, njerëzit.
- **Çfarë u ndryshua nga PDF-të.** Teksti u shkurtua që të hyjë në faqet A5 të faqes (çdo faqe u kontrollua në tri gjuhët
  që të mos kalojë kutinë e poshtme); kapitujt u rindërtuan që çdo kapitull të ketë të tri shtresat të emërtuara; dy
  grafikët e Vëllimit 1 (Tucker & Singer 19/11; Sexton 49,1/20,9/18,4) dhe katër të Vëllimit 2 (të njëjtët, plus
  Vidal-Carreras 38,12/57,43/75,22 dhe Marin-Garcia 80/60/38/20/19) vizatohen nga `lib/weekly/charts.js` dhe dalin edhe te
  "Shifrat e vëllimit" në faqen e lexuesit. Shembulli i shpikur 18 min / 145 min / 12,4% mbetet si kuti shifrash me
  flamurin "shembull hipotetik", jo si grafik me burim. Kartat "dorëzim i dobët / i veprueshëm" janë te Vëllimi 2 (Kapitulli
  I), jo dy herë. Te Vëllimi 1, "Çfarë mund dhe nuk mund të pohojmë" u bë faqja e metodës; te Vëllimi 2 shënimi kërkimor
  "Çfarë lejohet të thotë prova" hyri para kapitujve. PDF-ja e Vëllimit 2 shkruan "the editor" për autorin; faqja shkruan
  "the author", si kudo tjetër.
- **Lidhjet me faqen.** Esetë: gemba (Vëll. 1, Kap. I), why-the-handover-is-underrated (Vëll. 1, Kap. II),
  mistakes-get-lost-between-departments (Vëll. 1, Kap. III), what-a-night-auditor-learns (Vëll. 2, Kap. I),
  where-part-of-the-order-goes-missing (Vëll. 2, Kap. II), 61-resellers (Vëll. 2, Kap. III). Mjetet: 5 Whys (Vëll. 1),
  Delay Analyzer (Vëll. 2). Te Botimet traktati del pas Management Review, me vëllimin më të ri dhe lidhjen "Të gjitha
  vëllimet"; te rafti i ballinës del vëllimi më i ri; lista e vëllimeve është `/magazine/operational-treatise.html`.

## Tabela e fakteve

Shifrat e dy vëllimeve janë të njëjtat me ato të Nr. 40 dhe Nr. 56; tabelat e plota janë aty. Këtu vetëm ato që
përdoren dhe burimi i ri.

| Shifra ose fakti | Burimi | Statusi |
|---|---|---|
| Womack, "Purpose, Process, People" (12 qershor 2006, The Lean Post): shqyrto qëllimin, pastaj procesin, pastaj njerëzit; "What do your customers want that you are not currently able to supply?"; "processes can only produce what they are designed to produce"; "Does every important process in your company have someone responsible" për ta vlerësuar rrjedhën kundrejt qëllimit | lean.org, The Lean Post | U konfirmua te teksti i plotë (WebFetch, 12 tetor 2026). Tri pyetjet në faqe ndjekin edhe fjalorin e LEI ("Gemba Walk"), si te Nr. 40 |
| Tucker & Singer: 18 muaj, 56 reparte, 138 reparte kontrolli, efekt mesatar negativ, më mirë ku problemet zgjidheshin brenda ~30 ditëve dhe ku një drejtues i lartë mbante përgjegjësi; 19 probleme të gjetura dhe 11 të trajtuara për repart (versioni i punës 2013) | `management-review-nr-40.md` | Si te Nr. 40 |
| Sexton et al.: 44 NICU, 3.294 pyetësorë, 2.073 të kthyer (62,9%), 49,1% të pasigurt, 20,9% pjesëmarrje, 18,4% përgjigje (mesatare të njësive), anketë e 2011 | `management-review-nr-40.md` | Si te Nr. 40; etiketa e grafikut mban 2011 |
| Ohno dhe rrethi (Minoura te Teresko 2004); gemba, genchi genbutsu, ecja në gemba (LEI); Mann: katër pyetjet (2014), "not a box checking exercise" | `management-review-nr-40.md` | Si te Nr. 40 |
| Vidal-Carreras et al.: 300 min pritje, 306 min pa vlerë, mediana e qëndrimit 446 min, VAR 38,12% / 57,43% / 75,22% (gjendjet e ardhshme të parashikuara), laboratori <15 min dhe takimi pas 1 ore, doza 15 min dhe farmacia 3 orë | `management-review-nr-56.md` | Si te Nr. 56 |
| Marin-Garcia et al.: 80 botime (2015–2019), 20 pa hartë, nga 60: 38 me pritje, 20 me gjendje të ardhshme, 19 me rrjedhë informacioni (teksti; figura 21 dhe 18); asnjë rezultat negativ | `management-review-nr-56.md` | Si te Nr. 56; grafiku i Vëllimit 2 i jep të katër shiritat mbi 80 |
| Martin & Osterling: process time, lead time, %C&A; Activity Ratio = PT ÷ LT; shembulli 18 / 145 = 12,4% | `management-review-nr-56.md` (përkufizimet); shembulli është i shpikur | Përkufizimet si te Nr. 56; 18 dhe 145 janë të PDF-së së autorit, të shënuara si hipotetike |
| Rrjeti me 61 rishitës aktivë në Shqipëri | Faqja "Rreth meje" e faqes dhe eseja "61 resellers" | Sfond i autorit, jo mostër; faqja e thotë |

## Çfarë nuk hyri

- "LEI Gemba Walk lexicon" si burim i veçantë për "genchi genbutsu": është e njëjta faqe `lei-gemba-walk`.
- Shook, "How to Go to the Gemba: Go See, Ask Why, Show Respect" (PDF-ja e Vëllimit 2 e rendit): nuk u hap; fjalët e
  Cho-s janë te Nr. 40 përmes parathënies së Shook-ut te Gemba Walks dhe nuk përsëriten këtu.
- Jones & Womack, Seeing the Whole (2011) dhe Shou et al. (2017): janë te Nr. 56; nuk u deshën për argumentin.
- Numrat e spitaleve te Tucker & Singer (19, 20 ose 24 sipas burimit): si te Nr. 40, nuk jepen.

## Çfarë është editoriale

- Të gjitha skenat (03:00 në hotel, nisja e vonuar, porosia e ndjekur, çanta që mungon, premtimi me shumicë, vizita që nuk
  ndryshon asgjë, laku 30-ditor): të ndërtuara, me flamur në faqe.
- Protokollet: katër pyetjet e vëzhgimit, dorëzimi me katër fusha, numërimi i ndjekjes deri në fund me ritmin 0/3/10/30,
  karta e ecjes në gemba, dorëzimi me pesë fusha, katër pyetjet te pika e ngarkimit (shënimet nën pyetjet e Mann-it),
  dorëzimi i premtimit me gjashtë fusha, pronësia para duartrokitjes, hartë/mat/projekto/provo, tridhjetë ditë pa ritual,
  karta e rrjedhës dhe e mbylljes. Të gjitha propozime të redaksisë, me burimet e tyre në shënimin e faqes.
- Zinxhiri vëzhgo → verifiko → cakto → vepro → trego: hipotezë editoriale, jo vlerësim i botuar.
- Leximet te "Leximi ynë".

## Vëllimi 3: Ndërhyrja njerëzore, kur automatizimi gabon (21 tetor 2026)

Burimi është PDF-ja e autorit "Stiven Catalyst, Operational Treatise, Volume 3, EN" (30 faqe, anglisht), e rishkruar
për faqen në tri gjuhët me të njëjtin sistem si dy vëllimet e para (`lib/treatise/volumes/03.js`). Blloku: Operacioni.

### Vendimet

- **Faqet.** 31 faqe në faqe (PDF-ja e autorit ka 30): kopertina, editoriali, përmbajtja, shënimi kërkimor, gjashtë
  kapituj (I–III me tri faqe, IV–VI me katër), karta, eseja e mbylljes, metoda, burimet, kopertina e pasme. Faqja e
  shtuar është "Dy numra, një dizajn" (Kap. III): shembulli me 100 raste ndahet në dy faqe, që të dalin dy grafikë
  (testi kërkon të paktën dy për vëllim) dhe formula e PPV-së të mos ngjeshet mes tyre.
- **Grafikët.** Të dy janë nga shembulli i shpikur me 100 raste (5 përjashtime të vërteta, 19 alarme, 4 të sakta,
  15 të rreme): kolonat 5/19/4/15 dhe shiritat 21,1% / 80% / 78,9%, me flamurin "shembull hipotetik" dhe pa burim.
  Shifrat e studimeve (13.821 / 74; 35 / 2015–25) dalin si kuti shifrash me burimin e tyre, jo si grafik: 74 nga
  13.821 nuk vizatohet dot në mënyrë të dobishme.
- **Skena e Kapitullit V** (turni i trajnimit pa sistem) është përvojë e dokumentuar e autorit, jo skenë e shpikur; flamuri
  i saj e thotë ("Përvojë e dokumentuar, me hollësi të kufizuara për sigurinë operacionale") dhe teksti thotë shprehimisht
  çfarë nuk mbështet prova (të dhëna të dëmtuara, faturime, pasoja për mysafirët, rikuperim). Front Desk Control
  përmendet si projekt i faqes.
- **Lidhjet me faqen.** Esetë: the-report-a-machine-wrote (Kap. I), the-system-is-faster-than-you (Kap. II),
  when-the-dashboard-turns-red-before-you (Kap. III), the-tour-the-driver-does-not-understand (Kap. IV),
  the-night-the-system-went-down (Kap. V), the-scanner-is-a-witness (Kap. VI). Mjeti: Shift Handover (karta e
  ndërhyrjes ka të njëjtat fusha: çfarë u raportua, çfarë u verifikua, kush vendos, veprimi, kthimi i informacionit).
- **Çfarë u ndryshua nga PDF-ja.** "The editor" u bë "the author", si kudo në faqe; disa paragrafë të protokolleve u
  shkurtuan që të hyjnë në faqet A5 në gjermanisht (faqet 14, 18 dhe 26 në DE janë me fit-3); përplasjet e tekstit me
  fundin e faqes që kishte PDF-ja e autorit (faqet 3, 16, 19) nuk ekzistojnë në printimin e faqes, sepse çdo faqe matet
  (`node scripts/page-fit.mjs`). Mesazhi mbyllës mbetet i njëjti: "The system can recommend the decision. It cannot
  inherit the responsibility."

### Tabela e fakteve

Të shtatë burimet u kontrolluan te DOI-ja e tyre (të gjitha hapen, 21 tetor 2026); dy numrat e rishikimeve u lexuan
në abstraktet.

| Shifra ose fakti | Burimi | Statusi |
|---|---|---|
| Bainbridge, "Ironies of Automation", Automatica 19(6), 1983: automatizimi mund t'i zgjerojë vështirësitë që i mbeten operatorit, sidomos në gjendje të panormalme | `bainbridge-1983`, DOI 10.1016/0005-1098(83)90046-8 | Punim konceptual, jo eksperiment; faqja e thotë |
| Endsley & Kiris, Human Factors 37(2), 1995: pamje më e ulët e situatës nën automatizim, vendime më të ngadalta pas dështimit të sistemit ekspert, niveli i kontrollit e zbut efektin | `endsley-kiris-1995`, DOI 10.1518/001872095779064555 | Eksperiment navigimi në laborator; nuk jepen shifra të tij |
| Parasuraman & Riley, Human Factors 39(2), 1997: përdorim, keqpërdorim, braktisje, abuzim; alarmet e rreme nxisin braktisjen | `parasuraman-riley-1997`, DOI 10.1518/001872097778543886 | Kornizë interpretuese |
| Parasuraman, Sheridan & Wickens, IEEE SMC-A 30(3), 2000: katër klasat (marrja, analiza, zgjedhja, zbatimi) | `parasuraman-sheridan-wickens-2000`, DOI 10.1109/3468.844354 | Model |
| Lee & See, Human Factors 46(1), 2004: besimi te automatizimi, mbështetja e përshtatshme | `lee-see-2004`, DOI 10.1518/hfes.46.1.50_30392 | Kornizë interpretuese |
| Goddard, Roudsari & Wyatt, JAMIA 19(1), 2012: "Of 13 821 retrieved papers, 74 met the inclusion criteria"; ndërmjetësues besimi dhe vetëbesimi, përvoja në detyrë, ngarkesa, kompleksiteti, koha; zbutës trajnimi, llogaridhënia, dizajni | `goddard-2012`, DOI 10.1136/amiajnl-2011-000089 | U konfirmua te abstrakti (Europe PMC, 21 tetor 2026); në internet 16 qershor 2011, numri i revistës 2012 |
| Romeo & Conti, AI & Society, në internet 2025 (vëllimi 41, 2026): 35 studime të recensuara, janar 2015 – prill 2025, PRISMA 2020; shpjegimet vetëm nuk e heqin anshmërinë | `romeo-conti-2025`, DOI 10.1007/s00146-025-02422-7 | U konfirmua te abstrakti (regjistri IRIS i Universitetit të Katanias); vëllimi 41 sipas PDF-së së autorit, i pakonfirmuar te Springer |
| Shembulli 100 / 5 / 19 / 4 / 15; PPV 4 ÷ 19 = 21,1%; ndjeshmëria 4 ÷ 5 = 80% | i shpikur | Llogaria u kontrollua; flamur hipotetik në faqe |

### Çfarë është editoriale

- Skenat e kapitujve I, II, III, IV dhe VI: të ndërtuara, me flamur. Kapitulli V: përvojë e dokumentuar, e kufizuar.
- Regjistruar / verifikuar / zgjidhur; vëzhgim / interpretim / vendim; vëre / kupto / parashiko; shpjegim / verifikim /
  autoritet / rikuperim; cikli sinjalizo → verifiko → autorizo → vepro → mëso; katër matjet e pilotit; karta e
  ndërhyrjes: të gjitha propozime të redaksisë, me burimet në shënimin e faqes.

## Si shtohet një vëllim

`lib/treatise/volumes/NN.js` me `number`, `numeral`, kapitujt si faqe të tipit `chapter` me faqet e tyre (`layer`:
`scene`, `concept`, `protocol`), burimet te `lib/weekly/sources.js`, pastaj `node scripts/treatise.mjs NN` dhe
`node scripts/thumbnails.mjs`. Çdo faqe kontrollohet në tri gjuhët që të mos kalojë kutinë e poshtme (DE del ~15% më e
gjatë se EN).
