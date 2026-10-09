# Management Review Nr. 27 · OTIF dhe Perfect Order në logjistikë

Blloku: KPI. Të dhënat janë te `lib/weekly/issues/27.js`.

Faqet e ASCM (modeli SCOR), APQC, McKinsey, IndustryWeek, Supply Chain Dive, Talk Business & Politics, The Wall Street
Journal dhe Emerald nuk hapen nga ambienti i punës. Çdo fakt u kontrollua te teksti i faqes së botuesit që kthejnë
kërkimet, te abstraktet dhe te burime të pavarura; kjo shënohet në kolonën e fundit. Teksti i plotë i standardit SCOR
dhe tabelat e plota të APQC (vetëm për anëtarët) nuk u panë. Rregullat e Walmart nuk u panë te faqet e vetë Walmart:
vijnë nga shtypi i specializuar dhe nga një përmbledhje e një artikulli të WSJ. Pragjet e Walmart janë rregulla të
njoftuara, jo rezultate të matura; shifrat e anketave të McKinsey janë vetëraportime të kompanive; benchmark-u i APQC
nuk e tregon mostrën. Artikulli i McKinsey për përkufizimin e OTIF mban datën qershor 2019, jo 2014. SCOR dhe APQC e
llogaritin porosinë perfekte ndryshe (numërim porosish kundrejt shumëzimit të përqindjeve); kjo shënohet te rreshtat
përkatës. Shumëzimi i rendimenteve të hapave (First Pass Yield, Rolled Throughput Yield) është te Nr. 22 dhe këtu nuk
përsëritet.

## Tabela e fakteve

| Shifra ose fakti | Burimi | Statusi |
|---|---|---|
| Te modeli SCOR, Perfect Order Fulfillment (RL.1.1) është metrika e nivelit të parë për besueshmërinë (Reliability): përqindja e porosive që plotësojnë pritjet e dorëzimit, me dokumentacion të plotë e të saktë dhe pa dëmtime gjatë dorëzimit ("The percentage of orders meeting delivery performance expectations, including complete and accurate documentation and no delivery damage") | ASCM, SCOR Digital Standard, metrika RL.1.1 | U konfirmua te teksti i faqes së ASCM siç e kthen kërkimi; kodi RL.1.1 edhe te një listë e metrikave SCOR (Scribd). Fjalia angleze u pa një herë; emri i saktë i metrikës në versionin dixhital të SCOR nuk u pa |
| Llogaritja: porositë perfekte pjesëtuar me gjithë porositë, × 100%. Një porosi është perfekte vetëm kur të gjithë rreshtat (artikujt) e saj janë perfektë; një gabim në një përbërës e nxjerr gjithë porosinë jashtë | ASCM, SCOR Digital Standard, metrika RL.1.1 | Fjalia për rreshtat u konfirmua te teksti i ASCM siç e kthen kërkimi ("An order is perfect if the individual line items making up that order are all perfect"). Formula si numërim porosish u pa te përmbledhja e kërkimit, jo fjalë për fjalë; e njëjta formulë te dy burime dytësore (DCL Logistics, Racklify) |
| Katër përbërësit në nivelin e dytë: RL.2.1, përqindja e porosive të dorëzuara të plota (produkti dhe sasia e porositur); RL.2.2, dorëzimi në datën e premtuar fillimisht klientit ("Delivery Performance to Original Customer Commit Date": koha, vendi, klienti); RL.2.3, saktësia e dokumentacionit; RL.2.4, gjendja perfekte e porosisë ("Customer Order Perfect Condition") | ASCM, SCOR Digital Standard | RL.2.1, RL.2.2 dhe RL.2.4 u konfirmuan te teksti i ASCM siç e kthen kërkimi; emri i RL.2.2 edhe te një tezë që zbaton SCOR (Universitas Islam Indonesia). Dokumentacioni si përbërës u konfirmua te lista e metrikave SCOR (Scribd) dhe te një artikull në International Journal of Modelling in Operations Management (2014); kodi RL.2.3 vetëm te lista në Scribd. Vini re: koha matet kundrejt datës së premtuar (commit date), jo datës së kërkuar |
| SCOR e mbështet porosinë perfekte te "shtatë R-të" e APICS: produkti, sasia, gjendja, vendi, koha, klienti dhe kostoja e duhur. Kostoja nuk hyn te kjo metrikë; matet te atributi i kostos | ASCM, SCOR Digital Standard | U konfirmua te teksti i ASCM siç e kthen kërkimi; burim i dytë nuk u kërkua |
| APQC e llogarit ndryshe: shumëzon katër përqindje, % e dorëzimeve në kohë × % e porosive të plota × % pa dëmtime × % me dokumentacion të saktë, × 100. Shembulli i APQC: 0,98 × 0,97 × 0,99 × 0,82 = 0,7716, pra 77,16 | APQC, Open Standards Benchmarking, masa "Perfect order performance" | Formula dhe shembulli u konfirmuan te teksti i faqes së APQC siç e kthen kërkimi (dy herë); i njëjti shumëzim del edhe te IndustryWeek (2018). Llogaria jep 0,77170; APQC e shkurton në 0,7716. Faqja nuk ka datë. SCOR numëron porositë, APQC shumëzon përqindjet: nuk janë e njëjta llogari |
| Me të dhënat e APQC (Open Standards Benchmarking), kompania mediane ka indeks të porosisë perfekte 90: 10% e porosive që dërgon kanë ndonjë dështim ose defekt. Kuartili i sipërm arrin 95 ose më shumë. Kush arrin 99% në secilin nga katër përbërësit, del vetëm 96% në total | APQC, "Achieving the Impossible Dream: Perfect Order Performance", IndustryWeek, 4 dhjetor 2018 | U konfirmua te teksti i IndustryWeek siç e kthen kërkimi; mediana 90 edhe te "Metric of the Month: Perfect Order Performance" i APQC në Supply & Demand Chain Executive. Mostra, viti i mbledhjes së të dhënave dhe kuartili i poshtëm nuk shihen. 96% është llogari (0,99⁴ = 0,9606) |
| OTIF mat sa dërgesa arrijnë në destinacion me sasinë dhe në orarin e shkruar në porosi; mallrat e konsumit kaluan nga "case fill rate" (pjesa e kutive të dorëzuara) te OTIF, një matës më i rreptë. Nuk ka përkufizim standard: "në kohë" mund të jetë data që kërkon shitësi me pakicë ose data që premton prodhuesi, një orar i caktuar (slot) ose një dritare e rënë dakord; "të plota" mund të matet te porosia, te rreshti ose te kutia | McKinsey & Company, "Defining 'on-time, in-full' in the consumer sector", 13 qershor 2019 | U konfirmua te teksti i McKinsey (faqja dhe PDF) siç e kthen kërkimi dhe te ribotimi në Supply Chain 24/7 (2020). Faqja dhe PDF mbajnë datën qershor 2019; viti 2014 nuk u gjet |
| Anketë e Trading Partner Alliance dhe McKinsey me 24 shitës të mëdhenj me pakicë dhe prodhues të mallrave të konsumit në Amerikën e Veriut: 92% thanë se një standard i industrisë për OTIF do të krijonte vlerë; 79% preferojnë ta matin "të plotë" te kutia, jo te porosia ose te rreshti; 67% preferojnë datën e kërkuar të dorëzimit (ose "must arrive by") ndaj datës së takimit të caktuar ose datës së premtuar nga prodhuesi | Po aty | 92% u konfirmua te teksti i McKinsey dhe te Supply Chain 24/7; 79% dhe 67% vetëm te teksti i McKinsey siç e kthen kërkimi. Mostër e vogël (24 kompani); data e anketës nuk shihet. Janë preferenca, jo performancë e matur |
| Përkufizimi që McKinsey propozon për diskutim: sasia në kuti e dorëzuar në destinacion deri në datën e kërkuar, si përqindje e sasisë së porositur; pranohet dorëzimi një ditë më herët; dritarja është e gjithë dita e datës së kërkuar. Anketa nuk gjeti konsensus për gjatësinë e dritares. Edhe dorëzimi i hershëm ka kosto: prish punën e qendrës së shpërndarjes, ndërsa kamioni që pret orarin e vet rri bosh dhe paguan kosto pritjeje | Po aty | U konfirmua te teksti i McKinsey (faqja dhe PDF) siç e kthen kërkimi; burim i dytë nuk u gjet. Është propozim, jo standard i miratuar |
| Anketë me 35 drejtues të lartë në 28 kompani të mallrave të konsumit në Amerikën e Veriut: 85% thanë se në 12 muajt e fundit të paktën një klient kryesor me pakicë kaloi nga data e kërkuar e dorëzimit te data e planifikuar ose e premtuar; më shumë se gjysma thanë se shitësit i shtrënguan kërkesat OTIF, me dritare më të ngushta dhe gjoba më të larta; disa shitës po e matin "të plotë" te porosia ose te rreshti në vend të kutive. Vetëm 17% thanë se rikuperojnë më shumë se 75% të kostos reale të shërbimit | Shruti Lal & Colin Regnier, "Great service—but who's paying?", McKinsey & Company, 18 nëntor 2022 | 85% u konfirmua te teksti i McKinsey dhe te Consumer Goods Technology (që shkruan "deri në 85%"); pjesa tjetër vetëm te teksti i McKinsey siç e kthen kërkimi. Vetëraportime, 28 kompani |
| Walmart (SHBA): nga gushti 2017 gjobit furnitorët kur dërgesat nuk arrijnë në kohë dhe të plota. Pragu: 75% për dërgesat me kamion të plotë (FTL) dhe 33% për ngarkesat e pjesshme (LTL). Gjoba: 3% e kostos së mallrave të prekur. Gjobitet edhe dorëzimi para kohe. Objektivi i njoftuar ishte 95% deri në shkurt 2018, me dritare njëditore | Talk Business & Politics, "Wal-Mart updates suppliers on new OTIF requirements", janar 2018; Supply Chain Dive, 2019 | 75% dhe 33% u konfirmuan te Talk Business & Politics dhe te përmbledhja e Enterra Solutions për një artikull të WSJ; burimet i quajnë dy grupet herë FTL/LTL, herë furnitorë të mëdhenj/të vegjël. 3% e kostos te Supply Chain Dive (sipas zëdhënësit të Walmart), te Enterra dhe te McKinsey (2018, "çmimi i blerjes"); 95% dhe dritarja njëditore te Talk Business dhe Enterra; gjoba për dorëzimin e hershëm te Enterra, McKinsey (2018) dhe Supply Chain Dive (2017). Teksti i WSJ dhe faqet e Walmart nuk u panë. Janë rregulla, jo rezultate |
| Në janar 2018 Walmart hoqi dorë nga 95%: pragu për FTL u ngrit nga 75% në 85% nga prilli 2018 dhe për LTL nga 33% në 50%. Dritarja u zgjerua nga një në dy ditë (dorëzimi lejohet një ditë më herët) | Talk Business & Politics, janar 2018 | 85% dhe 50% u konfirmuan te Talk Business & Politics dhe te përmbledhja e Enterra Solutions për WSJ; 85% edhe te Supply Chain Dive (2019). Dritarja dyditore te Talk Business dhe Supply Chain Dive (2019). Detajet vijnë nga disa artikuj të Talk Business (janar dhe prill 2018); nuk u pa cili artikull jep secilin |
| Në mars 2019 pragu për FTL u ngrit në 87%, brenda dritares dyditore; gjoba mbetet 3% e kostos së mallrave. Walmart njoftoi se OTIF do të ndahet në dy matje, "në kohë" dhe "të plota", që furnitorët të përqendrohen te plotësia, të cilën e sheh si çelës për mallrat në raft | Supply Chain Dive, "Walmart tightens on-time, in-full rate for suppliers to 87%", 8 mars 2019 | U konfirmua te Supply Chain Dive (edhe te Retail Dive, i njëjti botues) dhe te Talk Business & Politics (prill 2019) |
| Studim rastesh me gjashtë çifte klient–furnitor në industrinë prodhuese: mungesa e përkufizimeve të përbashkëta të metrikave dhe mangësitë e sistemeve ERP ishin pengesat kryesore për ta menaxhuar performancën bashkë; problemet praktike dolën veçanërisht te matja e dorëzimit në kohë | Helena Forslund & Patrik Jonsson, "Dyadic integration of the performance management process: A delivery service case study", International Journal of Physical Distribution & Logistics Management 37(7), 2007 | U konfirmua te abstrakti (Emerald) dhe te regjistri i publikimeve të Chalmers. Studim rastesh, jo mostër statistikore; abstrakti nuk jep shifra |

## Çfarë nuk hyri

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
