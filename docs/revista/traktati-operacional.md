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
  2 ka 30, Vëllimi 3 ka 31, Vëllimi 4 ka 30, Vëllimi 5 ka 32. Të njëjtat faqe printohen (`node scripts/treatise.mjs`) dhe shfaqen të gjalla te lexuesi; vetëm kopertina
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

## Si shtohet një vëllim

`lib/treatise/volumes/NN.js` me `number`, `numeral`, kapitujt si faqe të tipit `chapter` me faqet e tyre (`layer`:
`scene`, `concept`, `protocol`), burimet te `lib/weekly/sources.js`, pastaj `node scripts/treatise.mjs NN` dhe
`node scripts/thumbnails.mjs`. Çdo faqe kontrollohet në tri gjuhët që të mos kalojë kutinë e poshtme (DE del ~15% më e
gjatë se EN).
