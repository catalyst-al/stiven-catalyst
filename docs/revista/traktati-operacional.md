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
  2 ka 30. Të njëjtat faqe printohen (`node scripts/treatise.mjs`) dhe shfaqen të gjalla te lexuesi; vetëm kopertina
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

## Si shtohet një vëllim

`lib/treatise/volumes/NN.js` me `number`, `numeral`, kapitujt si faqe të tipit `chapter` me faqet e tyre (`layer`:
`scene`, `concept`, `protocol`), burimet te `lib/weekly/sources.js`, pastaj `node scripts/treatise.mjs NN` dhe
`node scripts/thumbnails.mjs`. Çdo faqe kontrollohet në tri gjuhët që të mos kalojë kutinë e poshtme (DE del ~15% më e
gjatë se EN).
