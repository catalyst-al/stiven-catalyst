# Management Review Nr. 27 · OTIF dhe Perfect Order në logjistikë

Blloku: KPI. Të dhënat janë te `lib/weekly/issues/27.js`.

Në punën e parë faqet e ASCM (modeli SCOR), APQC, McKinsey, IndustryWeek, Supply Chain Dive, Talk Business & Politics,
The Wall Street Journal dhe Emerald nuk u hapën nga ambienti i punës; çdo fakt u kontrollua te teksti i faqes së botuesit
që kthenin kërkimet, te abstraktet dhe te burime të pavarura. Tabelat e plota të APQC (vetëm për anëtarët) nuk u panë. Rregullat e Walmart nuk u panë te faqet e vetë Walmart:
vijnë nga shtypi i specializuar dhe nga një përmbledhje e një artikulli të WSJ. Pragjet e Walmart janë rregulla të
njoftuara, jo rezultate të matura; shifrat e anketave të McKinsey janë vetëraportime të kompanive; benchmark-u i APQC
nuk e tregon mostrën. Artikulli i McKinsey për përkufizimin e OTIF mban datën qershor 2019, jo 2014. SCOR dhe APQC e
llogaritin porosinë perfekte ndryshe (numërim porosish kundrejt shumëzimit të përqindjeve); kjo shënohet te rreshtat
përkatës. Shumëzimi i rendimenteve të hapave (First Pass Yield, Rolled Throughput Yield) është te Nr. 22 dhe këtu nuk
përsëritet.

Kontrolli i dytë, te tekstet e plota (12 tetor 2026). U lexuan të plota: përmbajtja e metrikave RL.1.1 dhe RL.2.1–RL.2.4
të SCOR Digital Standard (nga API-ja publike e vetë scor.ascm.org, që ushqen faqen); faqja e masës së APQC (përmes
shërbimit lexues r.jina.ai, sepse apqc.org kthen 403); artikulli i IndustryWeek (Marisa Brown, APQC, 4 dhjetor 2018);
PDF-ja e McKinsey për përkufizimin e OTIF (qershor 2019, përmes r.jina.ai); Talk Business & Politics (30 janar 2018) dhe
Supply Chain Dive (8 mars 2019), faqet e botuesve; Forslund & Jonsson (2007), versioni i autorëve i pranuar për botim te
Chalmers Publication Library. Nuk u hap artikulli i McKinsey i 2022 (mckinsey.com nuk u përgjigj, shërbimi lexues u
bllokua): 85% dhe 17% u konfirmuan te Consumer Goods Technology, pjesa tjetër mbetet te copat e kërkimit, dhe burimi merr
`via`. U ndreqën, në të tri gjuhët: (1) faqja 4: "edhe mbërritja para kohe numërohej si dështim" nuk është te asnjëri nga
dy burimet e faqes dhe u hoq; (2) objektivi 95% ishte njoftuar "this year" (2018), jo "për shkurtin 2018"; në janar 2018
Walmart e shtyu ("the 95% goal is still in play"), nuk hoqi dorë; dritarja dyditore lidhet tani me pragun 87% të 2019,
ku e jep Supply Chain Dive (për prillin 2018 Talk Business shkruan "one or two days"); (3) faqja 6: Forslund & Jonsson e
quajnë mungesën e përkufizimeve të përbashkëta dhe mangësitë e ERP "important obstacles", jo pengesat kryesore. Asnjë
shifër e shtypur nuk doli ndryshe. Emri i sotëm i RL.1.1 në SCOR DS është "Perfect Customer Order Fulfillment".

## Tabela e fakteve

| Shifra ose fakti | Burimi | Statusi |
|---|---|---|
| Te modeli SCOR, Perfect Order Fulfillment (RL.1.1) është metrika e nivelit të parë për besueshmërinë (Reliability): përqindja e porosive që plotësojnë pritjet e dorëzimit, me dokumentacion të plotë e të saktë dhe pa dëmtime gjatë dorëzimit ("The percentage of orders meeting delivery performance expectations, including complete and accurate documentation and no delivery damage") | ASCM, SCOR Digital Standard, metrika RL.1.1 | U konfirmua te teksti i plotë i SCOR Digital Standard (përmbajtja e faqes RL.1.1, nga API-ja e vetë scor.ascm.org), "Definition": "The percentage of orders meeting delivery performance expectations, including complete and accurate documentation and no delivery damage." Emri i sotëm i metrikës: "Perfect Customer Order Fulfillment" |
| Llogaritja: porositë perfekte pjesëtuar me gjithë porositë, × 100%. Një porosi është perfekte vetëm kur të gjithë rreshtat (artikujt) e saj janë perfektë; një gabim në një përbërës e nxjerr gjithë porosinë jashtë | ASCM, SCOR Digital Standard, metrika RL.1.1 | U konfirmua te teksti i plotë i SCOR DS, "Calculation": "(Total perfect orders / Total number of orders) x 100%. Note: An order is perfect if the individual line items making up that order are all perfect."; për çdo rresht katër përbërës, secili 1 ose 0 |
| Katër përbërësit në nivelin e dytë: RL.2.1, përqindja e porosive të dorëzuara të plota (produkti dhe sasia e porositur); RL.2.2, dorëzimi në datën e premtuar fillimisht klientit ("Delivery Performance to Original Customer Commit Date": koha, vendi, klienti); RL.2.3, saktësia e dokumentacionit; RL.2.4, gjendja perfekte e porosisë ("Customer Order Perfect Condition") | ASCM, SCOR Digital Standard | U konfirmua te teksti i plotë i SCOR DS: RL.2.1 "Percentage of Orders Delivered In Full to the Customer"; RL.2.2 "Delivery Performance to Original Customer Commit Date" ("fulfilled to the customer's originally committed date"); RL.2.3 "Customer Order Documentation Accuracy"; RL.2.4 "Customer Order Perfect Condition" ("delivered in an undamaged state that meet specification …"). Koha matet kundrejt datës së premtuar fillimisht; ndryshimet e kërkuara nga klienti dhe të pranuara nga furnitori zënë vendin e premtimit fillestar |
| SCOR e mbështet porosinë perfekte te "shtatë R-të" e APICS: produkti, sasia, gjendja, vendi, koha, klienti dhe kostoja e duhur. Kostoja nuk hyn te kjo metrikë; matet te atributi i kostos | ASCM, SCOR Digital Standard | U konfirmua te teksti i plotë i SCOR DS: "According to the APICS Dictionary, a perfect order satisfies the seven R's … Right cost is measured by the overall Cost strategic attribute." |
| APQC e llogarit ndryshe: shumëzon katër përqindje, % e dorëzimeve në kohë × % e porosive të plota × % pa dëmtime × % me dokumentacion të saktë, × 100. Shembulli i APQC: 0,98 × 0,97 × 0,99 × 0,82 = 0,7716, pra 77,16 | APQC, Open Standards Benchmarking, masa "Perfect order performance" | U konfirmua te teksti i plotë i faqes së APQC (lexuar përmes shërbimit r.jina.ai, sepse apqc.org kthen 403 te curl): "(% on time delivery) multiplied by (% complete orders) multiplied by (% damage free) multiplied by (% accurate documentation) then multiplied by 100 … .98 x .97 x .99 x .82 = 0.7716 * 100 = 77.16". Llogaria jep 0,77170 |
| Me të dhënat e APQC (Open Standards Benchmarking), kompania mediane ka indeks të porosisë perfekte 90: 10% e porosive që dërgon kanë ndonjë dështim ose defekt. Kuartili i sipërm arrin 95 ose më shumë. Kush arrin 99% në secilin nga katër përbërësit, del vetëm 96% në total | APQC, "Achieving the Impossible Dream: Perfect Order Performance", IndustryWeek, 4 dhjetor 2018 | U konfirmua te teksti i plotë i IndustryWeek (Marisa Brown, APQC, 4 dhjetor 2018): "organizations that are median, or midpoint, performers on this measure have a perfect order index of 90 … 10% of orders being shipped by companies who are median performers have some form of failure or defect … Performers in the top quartile achieve a 95 or better"; "Organizations that achieve a 99% score in each of these areas still only score a 96%". Mostra nuk jepet |
| OTIF mat sa dërgesa arrijnë në destinacion me sasinë dhe në orarin e shkruar në porosi; mallrat e konsumit kaluan nga "case fill rate" (pjesa e kutive të dorëzuara) te OTIF, një matës më i rreptë. Nuk ka përkufizim standard: "në kohë" mund të jetë data që kërkon shitësi me pakicë ose data që premton prodhuesi, një orar i caktuar (slot) ose një dritare e rënë dakord; "të plota" mund të matet te porosia, te rreshti ose te kutia | McKinsey & Company, "Defining 'on-time, in-full' in the consumer sector", 13 qershor 2019 | U konfirmua te PDF-ja e McKinsey (qershor 2019, lexuar përmes r.jina.ai): "OTIF measures the extent to which shipments are delivered to their destination according to both the quantity and schedule specified on the order"; "there is no standard definition for OTIF … Does 'on-time' mean on the date requested by the retailer, or the date promised by the manufacturer? … within the specific delivery slot … or … a broader, agreed-upon time window? Should 'in-full' be measured at the level of complete orders, line-items or individual cases?" |
| Anketë e Trading Partner Alliance dhe McKinsey me 24 shitës të mëdhenj me pakicë dhe prodhues të mallrave të konsumit në Amerikën e Veriut: 92% thanë se një standard i industrisë për OTIF do të krijonte vlerë; 79% preferojnë ta matin "të plotë" te kutia, jo te porosia ose te rreshti; 67% preferojnë datën e kërkuar të dorëzimit (ose "must arrive by") ndaj datës së takimit të caktuar ose datës së premtuar nga prodhuesi | Po aty | U konfirmua te PDF-ja e McKinsey: "surveyed 24 major retailers and manufacturers of consumer packaged goods operating in North America. Of those companies, 92 percent agreed that an industry standard for OTIF would create value"; "79 percent of respondents also prefer to define 'in-full' at the 'case' rather the 'order' or 'line' level"; "67 percent of respondents said that they prefer to use the requested delivery date (or the 'must arrive by' date)". Edhe: 79% duan një metrikë të vetme, 17% dy të ndara. Data e anketës nuk jepet |
| Përkufizimi që McKinsey propozon për diskutim: sasia në kuti e dorëzuar në destinacion deri në datën e kërkuar, si përqindje e sasisë së porositur; pranohet dorëzimi një ditë më herët; dritarja është e gjithë dita e datës së kërkuar. Anketa nuk gjeti konsensus për gjatësinë e dritares. Edhe dorëzimi i hershëm ka kosto: prish punën e qendrës së shpërndarjes, ndërsa kamioni që pret orarin e vet rri bosh dhe paguan kosto pritjeje | Po aty | U konfirmua te PDF-ja e McKinsey: "Case quantity that is delivered to the destination by the requested delivery date, calculated as a percentage of the ordered quantity … measured to the end of the working day and with a one-day early allowance"; "the survey found no consensus regarding the window of time within which a delivery can be classified as on-time" |
| Anketë me 35 drejtues të lartë në 28 kompani të mallrave të konsumit në Amerikën e Veriut: 85% thanë se në 12 muajt e fundit të paktën një klient kryesor me pakicë kaloi nga data e kërkuar e dorëzimit te data e planifikuar ose e premtuar; më shumë se gjysma thanë se shitësit i shtrënguan kërkesat OTIF, me dritare më të ngushta dhe gjoba më të larta; disa shitës po e matin "të plotë" te porosia ose te rreshti në vend të kutive. Vetëm 17% thanë se rikuperojnë më shumë se 75% të kostos reale të shërbimit | Shruti Lal & Colin Regnier, "Great service—but who's paying?", McKinsey & Company, 18 nëntor 2022 | Artikulli nuk u hap (mckinsey.com nuk u përgjigj; shërbimi lexues u bllokua). 85% dhe 17% u konfirmuan te teksti i plotë i Consumer Goods Technology (22 nëntor 2022: "Up to 85 percent", "Just 17 percent … recovering more than 75 percent of the true cost to serve"); 35 drejtues, 28 kompani dhe "më shumë se gjysma" vetëm te copat e kërkimit të faqes së McKinsey. Vetëraportime |
| Walmart (SHBA): nga gushti 2017 gjobit furnitorët kur dërgesat nuk arrijnë në kohë dhe të plota. Pragu: 75% për dërgesat me kamion të plotë (FTL) dhe 33% për ngarkesat e pjesshme (LTL). Gjoba: 3% e kostos së mallrave të prekur. Gjobitet edhe dorëzimi para kohe. Objektivi i njoftuar ishte 95% deri në shkurt 2018, me dritare njëditore | Talk Business & Politics, "Wal-Mart updates suppliers on new OTIF requirements", janar 2018; Supply Chain Dive, 2019 | Talk Business & Politics (teksti i plotë, 30 janar 2018): fillimi i gjobave në gusht 2017 ("the fines going into effect in August"), FTL 75%, LTL "a 33% baseline set a year ago", objektivi 95% "this year" me "a one-day delivery window". 3% e kostos: Supply Chain Dive 2019 ("fined 3% of the cost of goods sold"). **U ndreq**: gjoba për mbërritjen para kohe nuk është te asnjëri nga dy burimet e faqes (vetëm te Enterra, McKinsey 2018 dhe Supply Chain Dive 2017) dhe u hoq nga faqja 4; "për shkurtin 2018" u bë "për vitin 2018", sepse artikulli thotë "this year" |
| Në janar 2018 Walmart hoqi dorë nga 95%: pragu për FTL u ngrit nga 75% në 85% nga prilli 2018 dhe për LTL nga 33% në 50%. Dritarja u zgjerua nga një në dy ditë (dorëzimi lejohet një ditë më herët) | Talk Business & Politics, janar 2018 | Talk Business & Politics (teksti i plotë): "moving from 75% to 85% by April. Less-than-truckload shipments will have a 50% threshold for compliance, up from a 33% baseline"; "Oldham said the 95% goal is still in play, but … will take longer than originally anticipated"; dritarja "has moved … to one or two days from four". **U ndreq** faqja 4: Walmart e "shtyu" objektivin, jo "hoqi dorë"; dhe dritarja dyditore lidhet tani me 2019, ku e thotë Supply Chain Dive, sepse për 2018 Talk Business shkruan "one or two days" |
| Në mars 2019 pragu për FTL u ngrit në 87%, brenda dritares dyditore; gjoba mbetet 3% e kostos së mallrave. Walmart njoftoi se OTIF do të ndahet në dy matje, "në kohë" dhe "të plota", që furnitorët të përqendrohen te plotësia, të cilën e sheh si çelës për mallrat në raft | Supply Chain Dive, "Walmart tightens on-time, in-full rate for suppliers to 87%", 8 mars 2019 | U konfirmua te teksti i plotë i Supply Chain Dive (8 mars 2019): "deliver full truckloads within a two-day window 87% of the time. This is up from a previous requirement of 85%"; "fined 3% of the cost of goods sold"; "plans to split this into two different measurements … 'The separate metrics will help suppliers increase their focus on delivering in-full, which we see as a key to continued improvement with in-stocks'" |
| Studim rastesh me gjashtë çifte klient–furnitor në industrinë prodhuese: mungesa e përkufizimeve të përbashkëta të metrikave dhe mangësitë e sistemeve ERP ishin pengesat kryesore për ta menaxhuar performancën bashkë; problemet praktike dolën veçanërisht te matja e dorëzimit në kohë | Helena Forslund & Patrik Jonsson, "Dyadic integration of the performance management process: A delivery service case study", International Journal of Physical Distribution & Logistics Management 37(7), 2007 | U konfirmua te versioni i autorëve i pranuar për botim (Chalmers Publication Library): "a multiple case study of six customer/supplier dyads of manufacturing companies"; "Lack of common metrics definitions and ERP deficiencies were important obstacles for integration"; "especially when measuring delivery service using the on-time delivery metric"; te përfundimet: "the lack of standardized metrics, inappropriate ERP functionality and lack of priorities could be obstacles". Kompanitë janë suedeze. **U ndreq** faqja 6: "pengesa të rëndësishme", jo "pengesat kryesore" |

## Çfarë nuk hyri

- Gjoba e Walmart edhe për dorëzimin para kohe (nga 2017): u hoq nga faqja 4 në kontrollin e dytë, sepse nuk është te
  Talk Business & Politics as te Supply Chain Dive 2019, burimet e faqes; e japin Enterra, McKinsey (2018) dhe Supply
  Chain Dive (2017).
- Viti 2014 për artikullin e McKinsey "Defining 'on-time, in-full' in the consumer sector": faqja dhe PDF e McKinsey mbajnë
  datën 13 qershor 2019; Supply Chain 24/7 e ribotoi në gusht 2020. E japim si 2019.
- Mediana e sotme e APQC për porosinë perfekte (88,0%, me "mostër 13.590"): shihet te faqja e masës, por viti i të
  dhënave nuk shihet, nuk dihet nëse 13.590 janë kompani apo të dhëna, dhe nuk përputhet me 90 të vitit 2018.
- Mediana e APQC për OTIF (90%, mostra 1.781) dhe për porositë e nisura të plota e në kohë (93% ose 94%, mostra 584 ose
  316): u panë vetëm në përmbledhjet e kërkimit, mostrat ndryshojnë nga një lexim te tjetri dhe viti nuk shihet. Raporti
  i APQC "Measuring Order Management Performance" (2026, N=200) tregon 85%, 90% dhe 95% për OTIF, por nuk u konfirmua
  cila vlerë është mediana.
- Ndryshimet e Walmart pas marsit 2019: 70% për LTL dhe pragjet e plotësisë 95% (mallra të përgjithshme) dhe 97,5%
  (ushqime dhe konsum) në 2019; rregulli "98%" nga 15 shtatori 2020; përjashtimi për COVID-19 që mbaroi më 17 gusht 2020;
  programi i ri i furnitorëve në fillim të 2021. Të gjitha vetëm te Talk Business & Politics, dhe te 98% nuk është e
  qartë nëse vlen për gjithë OTIF-in apo vetëm për plotësinë.
- "OTIF i 75 furnitorëve më të mëdhenj të Walmart ishte deri në 10%" (2017): vetëm te një burim.
- Gjoba e Kroger (500 dollarë): McKinsey (2018) e jep për porosinë që vonohet më shumë se dy ditë, Grocery Dive dhe Food
  Dive për çdo ditë pas dritares dyditore; nuk përputhen.
- McKinsey, "Deliver on time or pay the fine: Speed and precision as the new supply-chain drivers", shtator 2018: u
  konfirmua te teksti i McKinsey (Walmart dhe Kroger e ngushtuan dritaren për kamionët e plotë nga katër ditë në një ose
  dy; vlerësim: pa përmirësim, gjobat mund të kalojnë 5 miliardë dollarë në vit në SHBA dhe t'u marrin disa prodhuesve
  deri në një pikë përqindjeje të marzhit; OTIF bie ndjeshëm kur rritet numri i artikujve të ndryshëm në porosi), por e
  lamë jashtë që burimet të mos kalojnë tetë. Mund të zërë vendin e Forslund & Jonsson.
- Consumer Goods Technology për anketën e McKinsey 2022 (63% panë dritare më të ngushta dhe gjoba më të larta, 80%
  ndryshime të tjera në OTIF): vetëm te ky burim; McKinsey shkruan "më shumë se gjysma".
- Novack & Thomas, "The challenges of implementing the perfect order concept", Transportation Journal 43(1), 2004: u
  konfirmua te abstrakti (Penn State: porosia perfekte është përqindja e porosive që plotësojnë saktësisht pritjet e
  klientit; matja kërkon bashkërendim mes transportit, shpërndarjes dhe kontabilitetit), por e lamë jashtë për vend.
- Forslund & Jonsson, International Journal of Logistics Research and Applications 13(3), 2010 (mbledhja, regjistrimi
  dhe raportimi i automatizuar i të dhënave lidhen më shumë me dorëzimin në kohë): u konfirmua te abstrakti, por e lamë
  jashtë për vend.
- Hierarkia e metrikave të Gartner-it (porosia perfekte në nivelin e sipërm, bashkë me saktësinë e parashikimit të
  kërkesës dhe koston e zinxhirit të furnizimit): vetëm te dy përmbledhje dytësore (Sourcing Innovation, 2009; Fluent
  Commerce); autori, viti dhe teksti i artikullit në Supply Chain Management Review nuk u panë. Gartner Supply Chain Top
  25 nuk u kontrollua.
- Ndryshimet mes versioneve të SCOR (te 12.0 përkufizimi i RL.1.1 u përshtat me APICS Dictionary; versioni 14.0 shton
  RL.1.3 për kthimet): vetëm te përmbledhja e kërkimit.
- Përkufizimi i WERC (me çmimin dhe faturën si kusht i pestë) dhe shembulli i një teze indoneziane (porosia perfekte 45%,
  të plota 99,9%, në kohë 45%): një burim dytësor dhe një tezë studentore për një kompani.

## Çfarë është editoriale

- Leximet te kutitë "Leximi ynë" dhe shembulli ilustrues "dy kompani mund të raportojnë të dyja 95%".
- Fjalia "porosia perfekte nuk mund të jetë kurrë më e lartë se më e dobëta" te faqja 3 rrjedh nga shumëzimi i
  përqindjeve; është shpjegim i redaksisë.
- Grafiku i faqes 3 riprodhon shembullin e APQC; 77,2 është rrumbullakimi ynë i 0,7717 (APQC shkruan 77,16).
- Grafiku i faqes 4 tregon pragjet e njoftuara për kamionët e plotë sipas datës kur u njoftuan ose hynë në fuqi (gusht
  2017, prill 2018, mars 2019); janë rregulla, jo rezultate.
- Shembulli hipotetik i faqes 7: 200 porosi dhe dështimet janë të shpikura; 188 / 200 = 94,0% dhe 0,97 × 0,98 × 0,99 ×
  0,985 = 0,927 janë llogaritë tona.
- Karta e porosisë perfekte te faqja 8 është e redaksisë, sipas SCOR (RL.1.1).
