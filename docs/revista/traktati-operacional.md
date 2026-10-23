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
  2 ka 30, Vëllimi 3 ka 31, Vëllimi 4 ka 30, Vëllimi 5 ka 32, Vëllimi 6 ka 32, Vëllimi 7 ka 32, Vëllimi 8 ka 31, Vëllimi 9 ka 33, Vëllimi 10 ka 32. Të njëjtat faqe printohen (`node scripts/treatise.mjs`) dhe shfaqen të gjalla te lexuesi; vetëm kopertina
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

## Vëllimi 4: Kur përmirësimi zbehet, pse zhduken standardet e mira (21 tetor 2026)

Burimi është PDF-ja e autorit "Stiven Catalyst, Operational Treatise, Volume 4, EN" (30 faqe, anglisht), e rishkruar
për faqen në tri gjuhët (`lib/treatise/volumes/04.js`). Blloku: Operacioni. 30 faqe, si PDF-ja: kopertina, editoriali,
përmbajtja, shënimi kërkimor, gjashtë kapituj (I–III me tri faqe, IV–VI me katër), karta, eseja e mbylljes, metoda,
burimet, kopertina e pasme.

### Vendimet

- **Grafikët.** Dy, të dy me burim: Tucker & Edmondson 93% / 7% (përgjigjet e rendit të parë dhe të dytë, të
  konfirmuara te teksti i plotë i CMR për Nr. 15, `docs/revista/management-review-nr-15.md`) te Kap. IV, dhe Doyle et
  al. 6 / 6 / 7 nga 19 ekipe (të angazhuara, pjesërisht, të paangazhuara, nga abstrakti) te Kap. V. PDF-ja e autorit nuk
  i kishte këto grafikë; i kishte dhjetë faktorët e NHS-së si tabelë (mbeten si rreshta) dhe 125 / 2012 si kuti shifrash.
- **Burimet.** Spear & Bowen (1999) dhe Tucker & Edmondson (2003) ekzistonin tashmë te `lib/weekly/sources.js`
  (Nr. 15); u shtuan gjashtë: May & Finch 2009, May et al. 2009, Wiltsey Stirman et al. 2012, IHI Sustaining
  Improvement 2016, Doyle et al. 2013, Williams/IHI 2018. Të tetë adresat u hapën (DOI 302 te botuesi, IHI dhe HBR 200).
- **Lidhjet me faqen.** Esetë: when-improvement-fades (Kap. I), a-good-sop-is-not-a-document (Kap. II),
  how-i-built-front-desk-control (Kap. III), solve-it-or-escalate-it (Kap. IV), watch-how-i-do-it-is-not-training
  (Kap. V), why-the-handover-is-underrated (Kap. VI). Mjeti: Sigma & Control Chart (faqja e matjes citon grafikët e
  ecurisë dhe të Shewhart-it).
- **Çfarë u ndryshua nga PDF-ja.** "The editor" u bë "the author"; tekstet e protokolleve dhe disa paragrafë u
  shkurtuan dukshëm që të hyjnë në A5 në gjermanisht (faqet 4, 7, 10, 13, 17, 21, 25 në DE dhe 25 në EN/SQ janë me
  fit-3); frazat "Alex knows" mbetën si shembull i përgjithshëm. Mesazhi mbyllës mbetet i njëjti.

### Tabela e fakteve

| Shifra ose fakti | Burimi | Statusi |
|---|---|---|
| Wiltsey Stirman et al., Implementation Science 7:17, 2012: "Two coders identified 125 studies on sustainability that met eligibility criteria"; shumica retrospektive, rreth gjysma me vetëraportime, jo të gjitha me përkufizim | `wiltsey-stirman-2012`, DOI 10.1186/1748-5908-7-17 | U konfirmua te abstrakti (Europe PMC, 21 tetor 2026) |
| Doyle et al., Implementation Science 8:127, 2013: 19 ekipe, "six engaged, six partially engaged, seven non-engaged"; 12 e gjetën të pranueshëm | `doyle-2013`, DOI 10.1186/1748-5908-8-127 | U konfirmua te abstrakti. Dhjetë faktorët (4 proces, 4 staf, 2 organizatë) janë të modelit të NHS Institute, siç i përshkruan PDF-ja e autorit |
| Tucker & Edmondson, CMR 45(2), 2003: 239 orë, 26 infermiere, nëntë spitale; 93% rendi i parë, 7% rendi i dytë | `tucker-edmondson-2003` | Si te Nr. 15, teksti i plotë i CMR |
| Spear & Bowen, HBR shtator–tetor 1999: katër rregullat | `spear-bowen-1999` | Si te Nr. 15 |
| May et al. 2009 (Implementation Science 4:29) dhe May & Finch 2009 (Sociology 43(3), 535–554): NPT, katër ndërtimet | `may-2009`, `may-finch-2009` | U konfirmuan te abstrakti dhe te DOI |
| IHI, Sustaining Improvement (Scoville, Little, Rakover, Luther, Mate, 2016); Williams, Shewhart chart (IHI, 2018) | `ihi-sustaining-2016`, `ihi-williams-2018` | Faqet u hapën (200) |
| Ritmi 30/60/90 ditë; katër raportet e matjes; karta | editoriale | Të shënuara si propozime, jo si rezultate |

## Vëllimi 5: Kurthi i kapacitetit, pse operacionet e zëna prishen para se të duken plot (22 tetor 2026)

Burimi është PDF-ja e autorit "Stiven Catalyst, Operational Treatise, Volume 5, EN" (30 faqe, anglisht), e rishkruar
për faqen në tri gjuhët (`lib/treatise/volumes/05.js`). Blloku: Operacioni. 32 faqe në faqe (PDF-ja ka 30).

### Vendimet

- **Dy faqe më shumë se PDF-ja.** Kapitulli III i PDF-së (skena, Kingman, kurba, Whitt) nuk ka protokoll; testi kërkon
  që çdo kapitull të mbyllet me një. U shtua "Lexo kurbën, pastaj provo bashkimin", me hapat që PDF-ja i mban në
  paragrafin e fundit të faqes së Whitt-it. U shtua edhe faqja e metodës (PDF-ja e mban metodën te faqja e burimeve),
  si te vëllimet e tjera.
- **Grafikët.** Tre, të gjithë hipotetikë me flamur: dy profilet e mbërritjes 10 / 24 (Kap. I), pritja M/M/1 11,7 / 20 /
  45 / 95 min (Kap. III) dhe zinxhiri 75 / 70 / 55 / 90 (Kap. IV). Tabelat e PDF-së (Little 24 × 0,5, gjendjet A–D,
  pranimi pa ripunim 100/94 dhe 110/97) janë rreshta.
- **Aritmetika u rikontrollua.** ρ/(1−ρ): 2,33 / 4 / 9 / 19; × 5 min: 11,7 / 20 / 45 / 95; 95/20 = 4,75. 24 × 0,5 = 12,
  24 × 0,75 = 18. min(75, 70, 55) = 55; C: min(90, 70, 72) = 70; D: min(90, 52, 72) = 52. 94/100 = 94%, 97/110 = 88,2%.
  (12 − 10) × 2 = 4. Të gjitha të sakta.
- **Burimet.** Little 1961 dhe 2011 ekzistonin (Nr. 59, `littlelaw-little-1961`, `littlelaw-little-2011`); u shtuan
  shtatë: Kingman 1961 dhe 1962, Whitt 1992 dhe 1993, Eick, Massey & Whitt 1993, Factory Physics bot. 3 (Waveland,
  2011; faqja ekzistuese `littlelaw-hopp-spearman-2000` është botimi i dytë, "përmes") dhe modelet e NHS England.
  Të nëntë adresat u kontrolluan: DOI-të kthejnë 302 te botuesi, factoryphysics.com 200, faqja e NHS England 202 (pas
  një kontrolli WAF; nuk tregon datë, prandaj viti i burimit është viti i konsultimit, 2026).
- **Një korrigjim titulli.** PDF-ja e autorit e quan punimin e Whitt-it të 1992-shit "Understanding Multi-Server
  Service Systems"; titulli i vërtetë është "Understanding the Efficiency of Multi-Server Service Systems"
  (Management Science 38(5), 708–723). Faqja mban titullin e saktë.
- **Lidhjet me faqen.** Esetë: high-volume-days (Kap. I), the-angry-guest-at-2am (Kap. II), 80-vehicles-you-cannot-see
  (Kap. III), mistakes-get-lost-between-departments (Kap. IV), how-we-worked-with-damage (Kap. V),
  ten-minutes-before-the-shift (Kap. VI). Mjeti: Last-Mile CX Control Tower.
- **Çfarë u ndryshua nga PDF-ja.** "The editor" u bë "the author"; tekstet u shkurtuan që të hyjnë në A5 (faqet 26
  dhe 27 janë me fit-3 në të tri gjuhët).

### Tabela e fakteve

| Shifra ose fakti | Burimi | Statusi |
|---|---|---|
| L = λ × W; 24 × 0,5 = 12 | Little, Operations Research 9(3), 1961; 59(3), 2011 | Si te Nr. 59; shembulli hipotetik |
| Wq ≈ [(ca² + cs²)/2] × [ρ/(1−ρ)] × te (forma VUT); M/M/1: 11,7 / 20 / 45 / 95 min; 4,75× | Kingman 1961, 1962; Factory Physics | Përafrimi i Kingman-it te DOI-ja; llogaria M/M/1 e rikontrolluar |
| Bashkimi i shërbyesve rrit efikasitetin, luhatshmëria ul shfrytëzimin e pajtueshëm me një standard shërbimi | Whitt, Management Science 38(5), 1992 | DOI hapet; pohimi përputhet me abstraktin e njohur |
| Përafrime për GI/G/m | Whitt, Production and Operations Management 2(2), 1993 | DOI hapet |
| Numri i burimeve të zëna varet nga shpërndarja e kohës së shërbimit dhe historia e mbërritjeve (Mt/G/∞) | Eick, Massey & Whitt, Operations Research 41(4), 731–742, 1993 | DOI hapet |
| Kapaciteti i kërkuar kundrejt të disponueshmit; modele të përditësueshme | NHS England, Demand and capacity models | Faqja ekziston (202, WAF); e padatuar |
| Zinxhiri 75/70/55, 100/94 dhe 110/97, (12 − 10) × 2 = 4 | të shpikura | Flamur "sintetik" në faqe |

## Vëllimi 6: Kurthi i KPI-ve, kur numrat përmirësohen, por puna keqësohet (22 tetor 2026)

Burimi është PDF-ja e autorit "Stiven Catalyst, Operational Treatise, Volume 6, EN" (30 faqe, anglisht), e rishkruar
për faqen në tri gjuhët (`lib/treatise/volumes/06.js`). Blloku: Operacioni. 32 faqe në faqe (PDF-ja ka 30).

### Vendimet

- **Dy faqe më shumë se PDF-ja.** Kapitulli II i PDF-së (skena, Goodhart, Holmström & Milgrom, Bevan & Hood) nuk ka
  protokoll; u shtua "Mbaje objektivin pa e gllabëruar matjen" me pesë mbrojtje, nga paragrafi i fundit i faqes së
  kërkimit. U shtua edhe faqja e metodës, si te vëllimet e tjera.
- **Grafikët.** Tre, hipotetikë me flamur: të vonuarat / të paplotat 80 / 60 / 10 / 30 për 1.000 (Kap. III, si te
  PDF-ja), objektivi / p₀ / dita / UCL 1,0 / 1,5 / 2,3 / 2,65% (Kap. IV) dhe çiftet A→B 90→100, 40→80, 85,5→83,3
  (Kap. V, grafik "pairs").
- **Një korrigjim llogarie.** PDF-ja thotë te faqja 18 se kufiri i poshtëm i p-grafikut "clips to 0%". Me p₀ = 0,015 dhe
  n = 1.000, 3√[p₀(1−p₀)/n] = 3√(0,000014775) ≈ 0,01153; UCL ≈ 0,02653 (2,65%, si te PDF-ja), por LCL = 0,015 − 0,0115
  ≈ 0,0035, pra 0,35%, pozitiv, nuk pritet në zero. Faqja jep 0,35% dhe e shënon korrigjimin te metoda.
- **Një korrigjim citimi.** PDF-ja e citon seksionin 6.3.2 të e-Handbook-ut të NIST si "Control Limits vs.
  Specification Limits"; seksioni 6.3.2 është "What are Variables Control Charts?". Dallimi kufij kontrolli / kufij
  specifikimi është te 6.3.1. Faqja citon vetëm 6.3.1 dhe 6.3.3.2 (p-grafikët).
- **Aritmetika tjetër u rikontrollua.** 80/1.000 = 8%, 60 = 6%, 10 = 1%, 30 = 3%; 90/100, 20/20, 4/10, 80/100; 94/110 =
  85,45%, 100/120 = 83,33% (paradoksi i Simpson-it, i saktë); 23/1.000 = 2,3% < 2,65%.
- **Burimet.** Pesë ekzistonin (`kaplan-norton-1992`, `goodhart-1975` përmes Bevan & Hood, `strathern-1997`,
  `gl-campbell-1979`, `gl-bevan-hood-2006`); u shtuan pesë: Holmström & Milgrom 1991, van Thiel & Leeuw 2002, IHI
  Establishing Measures, NIST 6.3.1 dhe 6.3.3.2 (faqet e NIST dhe të IHI-së pa datë, viti i konsultimit, si te
  `nist-ehandbook-arl`). Të dhjetë adresat e PDF-së hapen (DOI 302 te botuesi, NIST/IHI/DAMTP 200, PubMed 203).
  Shënimi i DAMTP Cambridge për Goodhart (faqja e Michael McIntyre) nuk u shtua si burim: faqja e ka Goodhart-in
  përmes Bevan & Hood dhe Strathern-in drejtpërdrejt.
- **Lidhjet me faqen.** Esetë: the-report-a-machine-wrote (Kap. I), kpis-the-team-trusts (Kap. II),
  where-part-of-the-order-goes-missing (Kap. III), a-bad-day-or-a-problem (Kap. IV), kpis-do-not-improve-in-excel
  (Kap. V), talking-to-someone-who-made-a-mistake (Kap. VI). Mjeti: KPI Diagnostic.
- **Çfarë u ndryshua nga PDF-ja.** "The editor" u bë "the author"; tekstet u shkurtuan që të hyjnë në A5.

### Tabela e fakteve

| Shifra ose fakti | Burimi | Statusi |
|---|---|---|
| Goodhart: rregullsia e përdorur për kontroll pushon së silluri si më parë; parafraza "matje → objektiv" është e Strathern-it | `goodhart-1975` (përmes Bevan & Hood), `strathern-1997` | Si te Nr. 1 dhe Nr. 3 |
| Campbell 1979: treguesit mund të mos zbulojnë nëse ndërhyrja e shkaktoi përmirësimin | `gl-campbell-1979`, DOI 10.1016/0149-7189(79)90048-X | Si te Nr. 3 |
| Holmström & Milgrom 1991: stimujt e fortë mbi detyrat e matshme largojnë mundimin nga të tjerat | `holmstrom-milgrom-1991`, DOI 10.1093/jleo/7.special_issue.24 | DOI hapet; pohimi përputhet me punimin |
| Kaplan & Norton 1992: Balanced Scorecard | `kaplan-norton-1992` | Si te Nr. 1 |
| Bevan & Hood 2006: objektiva dhe manipulim në NHS-në angleze | `gl-bevan-hood-2006` | Si te Nr. 3 |
| van Thiel & Leeuw 2002: paradoksi i performancës | `van-thiel-leeuw-2002`, DOI 10.1080/15309576.2002.11643661 | DOI hapet |
| IHI: matje rezultati, procesi, balancimi | `ihi-establishing-measures` | Faqja hapet (200) |
| NIST 6.3.1 (grafikët e kontrollit), 6.3.3.2 (p-grafikët); UCL = p₀ + 3√[p₀(1−p₀)/n] | `nist-control-charts`, `nist-p-chart` | Faqet hapen (200); formula si te 6.3.3.2 |
| 80/60/10/30; p-grafiku 1,5% / 2,65% / 0,35% / 2,3%; 90→100, 40→80, 85,5→83,3 | të shpikura | Flamur "sintetik"; llogaritë të rikontrolluara |

## Vëllimi 7: Kostoja e heshtjes, pse ekipet e vijës së parë pushojnë së foluri (23 tetor 2026)

Burimi është PDF-ja e autorit "Stiven Catalyst, Operational Treatise, Volume 7, EN" (30 faqe, anglisht), e rishkruar
për faqen në tri gjuhët (`lib/treatise/volumes/07.js`). Blloku: Operacioni. 32 faqe në faqe (PDF-ja ka 30).

### Vendimet

- **Dy faqe më shumë se PDF-ja.** Të gjashtë kapitujt e PDF-së kanë skenë, shpjegim dhe protokoll, prandaj struktura
  e kapitujve është e njëjtë. U shtua një faqe modeli te Kapitulli I ("Ku humbet dija rrugës për lart"), grafik
  hipotetik me 20 → 14 → 9 → 6 → 5 → 3, që e vizaton zinxhirin pesëfazësh të Morrison & Milliken-it të cilin PDF-ja
  vetëm e përshkruan (faqja e vet ka vetëm hinkën e Kapitullit V); dhe faqja e metodës, si te vëllimet e tjera.
- **Grafikët.** Dy, hipotetikë me flamur: zinxhiri i sipërm 20/14/9/6/5/3 (Kap. I, i ri) dhe hinka e PDF-së
  12/9/7/5/3/2 (Kap. V, "Raised / Acknowledged / Assigned / Action started / Told back / Verified closed"). Numrat e
  studimeve (51, 40, 89, 9) janë blloqe `stat`/`stats` me burim, jo grafikë.
- **Rrjedha pesëfazëshe** (Vër re, Vlerëso, Fol, Merr, Vepro) e Kapitullit I dhe kuadri pesëhapësh (Fto, Mbro,
  Verifiko, Vendos, Kthe) i Kapitullit VI mbeten si te PDF-ja, si `chain` dhe `rows`.
- **Një mospërputhje citimi.** PDF-ja (faqja 5) e citon ilustrimin si "informed by Tucker & Edmondson (2003) and
  Tucker (2004)", por Tucker (2004) nuk është në listën e dhjetë burimeve të PDF-së. Faqja citon vetëm Tucker &
  Edmondson (2003) dhe e shënon te metoda.
- **Faktet e studimeve u rikontrolluan** kundrejt Crossref dhe abstrakteve: Edmondson 1999, 51 ekipe në një kompani
  prodhimi; Milliken, Morrison & Hewlin 2003, 40 intervista; Tucker & Edmondson 2003, infermierë në 9 spitale; Nembhard &
  Edmondson 2006, 23 NICU (shifra 1.440 e të anketuarve qarkullon vetëm në burime dytësore, nuk u përdor); Detert &
  Burris 2007, 3.149 punonjës dhe 223 menaxherë në një zinxhir restorantesh, hapja menaxheriale më e qëndrueshme se
  drejtimi transformues, siguria psikologjike ndërmjetëson; Detert & Treviño 2010, 89 intervista në një kompani
  teknologjike shumëkombëshe (njësi prodhimi dhe R&D); Liang, Farh & Farh 2012, 239 punonjës, dy valë, siguria
  psikologjike parashikon zërin ndalues; Frazier et al. 2017, 136 mostra, mbi 22.000 individë, afro 5.000 grupe
  (online 2016, vëll. 70 i 2017). Asnjë gabim faktik në PDF.
- **Burimet.** Katër ekzistonin (`edmondson-1999`, `boss-milliken-2003` që është Milliken, Morrison & Hewlin 2003,
  `tucker-edmondson-2003`, `frazier-2017`); u shtuan gjashtë: Morrison & Milliken 2000, Nembhard & Edmondson 2006,
  Detert & Burris 2007, Detert & Treviño 2010, Liang, Farh & Farh 2012, Morrison 2014. Të dhjetë DOI-të e PDF-së
  zgjidhen në Crossref me të njëjtët autorë, revista dhe vite.
- **Lidhjet me faqen.** Esetë: gemba (Kap. I), teams-with-many-languages (Kap. II),
  leading-people-without-losing-the-person (Kap. III), why-the-handover-is-underrated (Kap. IV),
  solve-it-or-escalate-it (Kap. V), the-operations-manager-i-want-to-be (Kap. VI). Mjeti: Shift Handover (Karta e
  sinjalit ndan strukturën "e vëzhguar / e raportuar / përgjegjësi / e kthyer si përgjigje").
- **Çfarë u ndryshua nga PDF-ja.** Vija kohore e provës (2 javë / 1 muaj) e Kapitullit VI u fut në paragraf, se
  protokolli me gjashtë hapa plus vijën kohore nuk hynte në A5; tekstet u shkurtuan që të hyjnë në A5 (DE del ~15% më
  e gjatë). "The editor" u bë "the author".

### Tabela e fakteve

| Shifra ose fakti | Burimi | Statusi |
|---|---|---|
| Siguria psikologjike: bindje e përbashkët se ekipi është i sigurt për rreziqe ndërpersonale; 51 ekipe, një kompani prodhimi | `edmondson-1999`, DOI 10.2307/2666999 | Si te Nr. 1 |
| Heshtja organizative si fenomen kolektiv; kuadër konceptual | `morrison-milliken-2000`, DOI 10.2307/259200 | DOI hapet, AMR 25(4) |
| 40 punonjës të intervistuar; frika nga etiketat negative dhe marrëdhëniet e dëmtuara | `boss-milliken-2003`, DOI 10.1111/1467-6486.00387 | Ekzistonte |
| Infermierë në 9 spitale; rimëkëmbja nuk sjell vetvetiu të mësuar | `tucker-edmondson-2003` | Ekzistonte |
| 23 NICU; gjithëpërfshirja e drejtuesit, statusi profesional, siguria psikologjike | `nembhard-edmondson-2006`, DOI 10.1002/job.413 | DOI hapet, JOB 27(7) |
| 3.149 punonjës, 223 menaxherë; hapja menaxheriale, siguria ndërmjetësuese | `detert-burris-2007`, DOI 10.5465/amj.2007.26279183 | DOI hapet, AMJ 50(4); abstrakti përputhet |
| 89 intervista; mbikëqyrësit dhe drejtuesit disa nivele më lart | `detert-trevino-2010`, DOI 10.1287/orsc.1080.0405 | DOI hapet, Org. Sci. 21(1); abstrakti përputhet |
| 239 punonjës, dy valë; zëri promovues dhe ndalues | `liang-farh-farh-2012`, DOI 10.5465/amj.2010.0176 | DOI hapet, AMJ 55(1); abstrakti përputhet |
| Rishikimi i zërit dhe heshtjes; kotësia si rrezik më vete | `morrison-2014`, DOI 10.1146/annurev-orgpsych-031413-091328 | DOI hapet, ARIOP 1 |
| 136 mostra, >22.000 individë, ~5.000 grupe | `frazier-2017` | Ekzistonte; abstrakti përputhet |
| 20/14/9/6/5/3 dhe 12/9/7/5/3/2 | të shpikura | Flamur "sintetik" në faqe dhe te metoda |

## Vëllimi 8: Iluzioni i trajnimit, pse të shohësh punën nuk do të thotë të jesh gati ta bësh (23 tetor 2026)

Burimi është PDF-ja e autorit "Stiven Catalyst, Operational Treatise, Volume 8, EN" (30 faqe, anglisht), e rishkruar
për faqen në tri gjuhët (`lib/treatise/volumes/08.js`). Blloku: Operacioni. 31 faqe në faqe (PDF-ja ka 30).

### Vendimet

- **Një faqe më shumë se PDF-ja.** Të gjashtë kapitujt kanë skenë, shpjegim dhe protokoll si te PDF-ja; u shtua vetëm
  faqja e metodës, si te vëllimet e tjera. Shënimi kërkimor, mjeti, eseja e mbylljes dhe burimet mbeten faqe të veta.
- **Grafikët.** Dy, me të dhëna të botuara dhe me burim (jo hipotetikë): efektet e Keith & Frese 2008, d = 0,44 /
  0,56 / 0,80 (Kap. IV, shkallë deri në 0,80) dhe efektet e Arthur et al. 2003, d = 0,60 / 0,63 / 0,62 / 0,62 me k =
  15 / 234 / 122 / 26 (Kap. V, shkallë deri në 0,63), siç i vizaton PDF-ja. Të dyja faqet thonë se vlerat janë vlerësime
  të bashkuara nga nëngrupe të ndryshme, jo norma gatishmërie.
- **Faktet e studimeve u rikontrolluan** kundrejt Crossref dhe abstrakteve: Taylor, Russ-Eft & Chan 2005, 117 studime,
  gjashtë lloje rezultatesh, efektet më të mëdha te të mësuarit, më të vogla te sjellja dhe rezultatet, pikat e të
  mësuarit si rregulla dhe skenarët e të trajnuarve lidhen me transferim më të mirë; Keith & Frese 2008, 24 studime, N
  = 2.183, d = 0,44, transferimi pas trajnimit 0,56, adaptiv 0,80; Arthur et al. 2003, katër d dhe k-të siç më lart;
  Blume et al. 2010, 89 studime; Baldwin & Ford 1988, përgjithësim dhe ruajtje. Asnjë gabim faktik në PDF. Vitet:
  Blume 2010 (online 2009, vëll. 36(4) 2010) dhe Sitzmann & Weinhardt 2018 (online 2015, vëll. 44(2) 2018), si te
  PDF-ja.
- **Burimet.** Asnjëri nuk ekzistonte; u shtuan të dhjetë: Baldwin & Ford 1988, Arthur et al. 2003, Taylor et al.
  2005, Burke & Hutchins 2007, Keith & Frese 2008, Aguinis & Kraiger 2009, Blume et al. 2010, Grossman & Salas 2011,
  Salas et al. 2012, Sitzmann & Weinhardt 2018. Të dhjetë DOI-të zgjidhen në Crossref me të njëjtët autorë, revista,
  vëllime dhe faqe.
- **Konteksti i dokumentuar.** Skena e Kapitullit II (nata e trajnimit e kufizuar nga një përditësim sistemi) është e
  vetmja me kontekst të vërtetë; eseja the-night-the-system-went-down e tregon atë natë dhe lidhet aty. Front Desk
  Control përmendet si referencë e autorit, pa efekt të matur.
- **Lidhjet me faqen.** Esetë: watch-how-i-do-it-is-not-training (Kap. I), the-night-the-system-went-down (Kap. II),
  how-i-built-front-desk-control (Kap. III), high-volume-days (Kap. IV), when-a-new-system-arrives (Kap. V),
  a-good-sop-is-not-a-document (Kap. VI). Mjeti: 5 Whys Worksheet, për hapin "rishiko personin dhe sistemin".
- **Çfarë u ndryshua nga PDF-ja.** Tekstet e protokolleve V dhe VI u shkurtuan që të hyjnë në A5; "the editors" u
  bë "editorial". Asgjë tjetër.

### Tabela e fakteve

| Shifra ose fakti | Burimi | Statusi |
|---|---|---|
| Transferimi = përgjithësim + ruajtje; karakteristikat e të trajnuarit, projektimi, mjedisi | `baldwin-ford-1988`, DOI 10.1111/j.1744-6570.1988.tb00632.x | DOI hapet, PP 41(1) |
| d = 0,60 (k = 15), 0,63 (k = 234), 0,62 (k = 122), 0,62 (k = 26) | `arthur-2003`, DOI 10.1037/0021-9010.88.2.234 | Abstrakti përputhet |
| 117 studime; efektet më të mëdha te të mësuarit, pastaj sjellja, pastaj rezultatet | `taylor-russ-eft-chan-2005`, DOI 10.1037/0021-9010.90.4.692 | Abstrakti përputhet |
| Rishikim integrues i transferimit | `burke-hutchins-2007`, DOI 10.1177/1534484307303035 | DOI hapet, HRDR 6(3) |
| 24 studime, N = 2.183, d = 0,44 / 0,56 / 0,80 | `keith-frese-2008`, DOI 10.1037/0021-9010.93.1.59 | Abstrakti përputhet |
| Dobitë e trajnimit për individë, ekipe, organizata, shoqëri | `aguinis-kraiger-2009`, DOI 10.1146/annurev.psych.60.110707.163505 | DOI hapet, ARP 60 |
| 89 studime empirike; motivimi dhe mjedisi mbështetës | `blume-2010`, DOI 10.1177/0149206309352880 | DOI hapet, JOM 36(4) |
| Mbështetja, mundësia për të performuar, ndjekja | `grossman-salas-2011`, DOI 10.1111/j.1468-2419.2011.00373.x | DOI hapet, IJTD 15(2) |
| Para / gjatë / pas programit | `salas-2012`, DOI 10.1177/1529100612436661 | DOI hapet, PSPI 13(2) |
| Angazhimi në trajnim në shumë nivele dhe në kohë | `sitzmann-weinhardt-2018`, DOI 10.1177/0149206315574596 | DOI hapet, JOM 44(2) |
| "Dhjetë vëzhgime" te piloti | editoriale | Thuhet shprehimisht ilustrim, jo madhësi mostre |

## Vëllimi 9: Hendeku i rikuperimit, pse ndreqja e dështimit nuk është rikthim i besimit (23 tetor 2026)

Burimi është PDF-ja e autorit "Stiven Catalyst, Operational Treatise, Volume 9, EN" (30 faqe, anglisht), e rishkruar
për faqen në tri gjuhët (`lib/treatise/volumes/09.js`). Blloku: Operacioni. 33 faqe në faqe (PDF-ja ka 30).

### Vendimet

- **Tri faqe më shumë se PDF-ja.** Të gjashtë kapitujt kanë skenë, shpjegim dhe protokoll si te PDF-ja. PDF-ja nuk ka
  asnjë grafik numerik (vetëm numra studimesh dhe lista cilësore), kurse sistemi kërkon dy grafikë; u shtuan dy faqe
  modeli, hipotetike me flamur, që vizatojnë dy ide që PDF-ja i përshkruan me fjalë: "Dy orë në një rast të shpikur"
  (Kap. I: ndreqja teknike 2 h, rasti i brendshëm i mbyllur 3 h, klienti i përditësuar 14 h, marrja e konfirmuar 26
  h, zgjidhja e verifikuar 38 h) dhe "Dyzet raste të shënuara të mbyllura" (Kap. III: 40 / 36 / 28 / 19 / 14 / 6).
  Edhe faqja e metodës, si te vëllimet e tjera.
- **Katër rezultatet e de Matos** (kënaqësia pozitive; riblerja, fjala gojore, imazhi pa efekt domethënës) mbeten
  rreshta cilësorë, jo grafik: PDF-ja nuk jep madhësi efekti dhe nuk duhen shpikur.
- **Faktet e studimeve u rikontrolluan** kundrejt Crossref, abstrakteve dhe tekstit të plotë: Orsingher et al. 2010,
  60 studime, shpërndarëse > ndërvepruese > procedurale, kënaqësia me trajtimin nuk ndërmjetëson për kënaqësinë e
  përgjithshme dhe qëllimin e kthimit; de Matos et al. 2007 siç më lart; Maxham & Netemeyer 2002, dy studime në
  terren (bankë me 116 degë, tri pyetësorë; ndërtues shtëpish), kënaqësia me rikuperimin parashikon më fort fjalën
  gojore, kënaqësia e përgjithshme parashikon më fort qëllimin e blerjes (teksti i plotë i shkarkuar); Das et al.
  2026, 147 studime, 82.901 pjesëmarrës, 24 vende, JBR 202, 115752; Bitner et al. 1990, 700 incidente kritike;
  Van Vaerenbergh et al. 2014, kontrollueshmëria → emocione negative më të forta, qëndrueshmëria → kënaqësia e
  transaksionit dhe e përgjithshme; Homburg & Fürst 2005, mekanike / organike, plotësuese, dallime B2B/B2C dhe
  shërbime/prodhim. Asnjë gabim faktik në PDF.
- **Burimet.** Asnjëri nuk ekzistonte; u shtuan të dhjetë. Nëntë DOI zgjidhen në Crossref me të njëjtët autorë,
  revista, vëllime dhe faqe; Hart, Heskett & Sasser 1990 (HBR) nuk ka DOI dhe citohet me faqen e HBR-së, si te
  PDF-ja. Vitet sipas vëllimit të shtypur: Orsingher 2010 (online 2009), Gelbrich & Roschk 2011 (online 2010), Das
  2026 (online 2025). Emrat e autorëve të Das et al. sipas Crossref (Jinal Sameer Shah, jo "Shah" i panjohur).
- **Lidhjet me faqen.** Esetë: the-angry-guest-at-2am (Kap. I), 61-resellers (Kap. II), the-scanner-is-a-witness
  (Kap. III), a-bad-day-or-a-problem (Kap. IV), how-we-worked-with-damage (Kap. V),
  mistakes-get-lost-between-departments (Kap. VI). Mjeti: Last-Mile CX Control Tower.
- **Çfarë u ndryshua nga PDF-ja.** Protokollet e Kapitujve I, V dhe VI dhe faqet e modelit u shkurtuan që të hyjnë në
  A5 (DE); "the editors" u bë "editorial". Asgjë tjetër.

### Tabela e fakteve

| Shifra ose fakti | Burimi | Statusi |
|---|---|---|
| Argument menaxherial për rikuperimin; HBR 68(4), 148–156 | `hart-heskett-sasser-1990` | Faqja e HBR-së; pa DOI |
| 700 incidente kritike nga linja ajrore, hotele, restorante | `bitner-booms-tetreault-1990`, DOI 10.1177/002224299005400105 | Abstrakti përputhet |
| Rezultati, procedura, trajtimi ndërpersonal; pa renditje universale | `tax-brown-chandrashekaran-1998`, DOI 10.1177/002224299806200205 | DOI hapet, JM 62(2) |
| Dy studime në terren; kënaqësia me rikuperimin → fjala gojore, kënaqësia e përgjithshme → blerja | `maxham-netemeyer-2002`, DOI 10.1016/S0022-4359(02)00100-8 | Abstrakti dhe teksti i plotë përputhen |
| Mekanike / organike, kryesisht plotësuese; dallime B2B/B2C, shërbime/prodhim | `homburg-furst-2005`, DOI 10.1509/jmkg.69.3.95.66367 | DOI hapet, JM 69(3) |
| Paradoksi: kënaqësia pozitive; riblerja, fjala gojore, imazhi jo domethënëse | `de-matos-2007`, DOI 10.1177/1094670507303012 | Abstrakti përputhet |
| 60 studime; shpërndarëse > ndërvepruese > procedurale; pa ndërmjetësim për kënaqësinë e përgjithshme dhe kthimin | `orsingher-2010`, DOI 10.1007/s11747-009-0155-z | Abstrakti përputhet |
| Përgjigjet → drejtësia → kënaqësia → qëllimet | `gelbrich-roschk-2011`, DOI 10.1177/1094670510387914 | DOI hapet, JSR 14(1) |
| Kontrollueshmëria dhe qëndrueshmëria; emocione, kënaqësi, besnikëri | `van-vaerenbergh-2014`, DOI 10.1177/1094670514538321 | Abstrakti përputhet |
| 147 studime, 82.901 pjesëmarrës, 24 vende, shërbime online | `das-2026`, DOI 10.1016/j.jbusres.2025.115752 | Abstrakti përputhet |
| 2 / 3 / 14 / 26 / 38 orë dhe 40 / 36 / 28 / 19 / 14 / 6 | të shpikura | Flamur "sintetik" në faqe dhe te metoda |

## Vëllimi 10: Ora e vendimit, kur problemi dihet, por askush nuk mund të veprojë (23 tetor 2026)

Burimi është PDF-ja e autorit "Stiven Catalyst, Operational Treatise, Volume 10, EN" (30 faqe, anglisht), e rishkruar
për faqen në tri gjuhët (`lib/treatise/volumes/10.js`). Blloku: Operacioni. 32 faqe në faqe (PDF-ja ka 30).

### Vendimet

- **Dy faqe më shumë se PDF-ja.** Të gjashtë kapitujt kanë skenë, shpjegim dhe protokoll si te PDF-ja; Kapitujt II
  deri V kanë edhe faqen e provave. PDF-ja nuk ka asnjë grafik numerik, kurse sistemi kërkon dy; u shtuan dy faqe
  modeli, hipotetike me flamur, që vizatojnë dy ide që PDF-ja i përshkruan me fjalë, të dyja në Kapitullin V:
  "Dymbëdhjetë përjashtime të hapura sipas gjendjes" (të vëna re 3, të verifikuara me përgjegjës 2, të verifikuara
  pa përgjegjës 4, të vendosura 1, të ekzekutuara 2) dhe "Një vendim i shpikur, 36 minuta" (verifikimi 11, pritja e
  vendimit 17, ekzekutimi 8; 17/36 = 47,2 %, siç e llogarit PDF-ja). Edhe faqja e metodës, si te vëllimet e tjera.
  Përmbyllja mban listën e dhjetë vëllimeve të PDF-së (faqja 28 e saj) si bllok `lists` me dy kolona.
- **Faktet e studimeve u rikontrolluan** kundrejt Crossref dhe abstrakteve: Mintzberg, Raisinghani & Théorêt 1976,
  25 procese vendimi (shifra e kopertinës); Klein, Calderwood & Clinton-Cirocco 1986, krahasimi i opsioneve në më
  pak se 12 % të pikave të vendimit (abstrakti në Crossref: "in less than 12% of the decision points"); Eisenhardt
  1989, tetë firma kompjuterike, vendimmarrësit e shpejtë përdorin më shumë informacion në kohë reale, më shumë
  alternativa njëkohësisht dhe këshillë me dy nivele; Faraj & Xiao 2006, koordinim i ekspertizës dhe koordinim
  dialogjik në një qendër traume; Okhuysen & Bechky 2009, llogaridhënia, parashikueshmëria dhe kuptimi i
  përbashkët (Annals 3(1), 463–502); Bigley & Roberts 2001, sistemi i komandës së incidenteve, AMJ 44(6); Weick &
  Sutcliffe 2015, kapitulli 7, parimi i pestë, deferenca ndaj ekspertizës; Simon 1955, racionaliteti i kufizuar;
  Rudolph, Morrison & Carroll 2009, zgjidhja e problemeve e orientuar nga veprimi, AMR 34(4). Asnjë gabim faktik
  në PDF.
- **Burimet.** Dy ekzistonin (`tucker-edmondson-2003`, `pressure-kahneman-klein-2009`); u shtuan nëntë. Të
  njëmbëdhjetë DOI-të zgjidhen; tre prej tyre (10.5465/256434, 10.5465/3069401, 10.1080/19416520903047533) nuk
  kthejnë JSON në Crossref, por doi.org i ridrejton te faqja e botuesit me të njëjtin artikull. Vitet sipas vëllimit
  të shtypur.
- **Lidhjet me faqen.** Esetë: when-the-dashboard-turns-red-before-you (Kap. I), 61-resellers (Kap. II),
  the-tour-the-driver-does-not-understand (Kap. III), what-last-mile-taught-me (Kap. IV), solve-it-or-escalate-it
  (Kap. V), the-industry-changes-management-problems-do-not (Kap. VI). Mjeti: Delay Analyzer (`/tools/delay-analyzer/`).
- **Çfarë u ndryshua nga PDF-ja.** Editoriali (DE), protokollet e Kapitujve I, III, IV dhe VI dhe disa tituj u
  shkurtuan që të hyjnë në A5; protokolli i Kapitullit IV citon dy burime në vend të tre dhe ai i Kapitullit VI dy
  në vend të katër (burimet e hequra mbeten te faqet e tjera të vëllimit). Përshkrimi i kërkimit u shkurtua nën 160
  shenja. Asgjë tjetër.

### Tabela e fakteve

| Shifra ose fakti | Burimi | Statusi |
|---|---|---|
| Racionaliteti i kufizuar, "mjaftueshëm i mirë" në vend të optimumit | `simon-1955`, DOI 10.2307/1884852 | DOI hapet, QJE 69(1) |
| 25 procese vendimi strategjik; identifikim, zhvillim, përzgjedhje | `mintzberg-raisinghani-theoret-1976`, DOI 10.2307/2392045 | Abstrakti përputhet |
| Komandantët e zjarrit krahasuan opsione në < 12 % të pikave të vendimit | `klein-calderwood-clinton-cirocco-1986`, DOI 10.1177/154193128603000616 | Abstrakti përputhet |
| 8 firma; më shumë informacion në kohë reale, më shumë alternativa, këshillë me dy nivele | `eisenhardt-1989`, DOI 10.5465/256434 | doi.org ridrejton te AMJ 32(3) |
| Sistemi i komandës së incidenteve si organizim me besueshmëri të lartë | `bigley-roberts-2001`, DOI 10.5465/3069401 | doi.org ridrejton te AMJ 44(6) |
| Koordinim i ekspertizës dhe dialogjik në një qendër traume | `faraj-xiao-2006`, DOI 10.1287/mnsc.1060.0526 | Abstrakti përputhet |
| Llogaridhënia, parashikueshmëria, kuptimi i përbashkët | `okhuysen-bechky-2009`, DOI 10.1080/19416520903047533 | doi.org ridrejton te Annals 3(1) |
| Interpretimi dhe zgjedhja të lidhura në zgjidhjen e problemeve | `rudolph-morrison-carroll-2009`, DOI 10.5465/amr.34.4.zok733 | DOI hapet, AMR 34(4) |
| Deferenca ndaj ekspertizës, parimi i pestë | `weick-sutcliffe-2015`, DOI 10.1002/9781119175834.ch07 | DOI hapet, kap. 7 |
| Intuita e ekspertit kërkon mjedis të rregullt dhe reagim | `pressure-kahneman-klein-2009` | Ekzistonte |
| Zgjidhjet e nivelit të parë që nuk mësojnë | `tucker-edmondson-2003` | Ekzistonte |
| 3 / 2 / 4 / 1 / 2 përjashtime dhe 11 / 17 / 8 minuta | të shpikura | Flamur "sintetik" në faqe dhe te metoda |

## Si shtohet një vëllim

`lib/treatise/volumes/NN.js` me `number`, `numeral`, kapitujt si faqe të tipit `chapter` me faqet e tyre (`layer`:
`scene`, `concept`, `protocol`), burimet te `lib/weekly/sources.js`, pastaj `node scripts/treatise.mjs NN` dhe
`node scripts/thumbnails.mjs`. Çdo faqe kontrollohet në tri gjuhët që të mos kalojë kutinë e poshtme (DE del ~15% më e
gjatë se EN).
