# Management Review Nr. 68 · Saktësia e stokut dhe numërimi ciklik

Blloku: KPI. Të dhënat janë te `lib/weekly/issues/68.js`.

Udhëzuesi i GAO (GAO-02-447G, mars 2002) u lexua i plotë te versioni HTML në govinfo.gov; prej tij vijnë përkufizimi i
numërimit ciklik, segmentet dhe shpeshtësia, numërimi pa e ditur sasinë, toleranca dhe masa e saktësisë. Për pesë
artikujt shkencorë u panë vetëm abstraktet (OpenAlex, IDEAS/RePEc, faqja e California Management Review, DSpace@MIT për
tezën e Kang-ut) dhe të dhënat bibliografike te Crossref; teksti i plotë është pas pagese dhe në punën e parë nuk u hap
(INFORMS, ScienceDirect, SSRN, ResearchGate, SciELO/Redalyc dhe PDF-ja e MIT u bllokuan ose dhanë gabim). Prandaj në revistë hyjnë
vetëm gjetjet që thuhen në abstrakte. Studimi i DeHoratius & Raman (2008) dhe artikulli i 2001 flasin për një shitës me
pakicë të paemërtuar; 65% mund të jetë i njëjti grup të dhënash, ndaj e numërojmë një herë. Kang & Gershwin (2005) është
studim me modele, jo me të dhëna nga terreni. Plani editorial e jepte Kang & Gershwin si artikull te Production and
Operations Management; në të vërtetë është botuar te IIE Transactions 37(9), 2005 (Crossref, OpenAlex). Përkufizimi i
numërimit ciklik në fjalorin e ASCM/APICS nuk u konfirmua te burimi; përdorim përkufizimin e GAO. Për Shqipërinë dhe
Gjermaninë nuk u gjet asnjë shifër për saktësinë e stokut.

Kontrolli i dytë, te tekstet e plota (12 tetor 2026). U lexuan të plota: udhëzuesi i GAO (GAO-02-447G), versioni HTML te
govinfo.gov (gao.gov kthen 403); teza e doktoratës së Yun Kang-ut (MIT, shkurt 2004, 129 faqe), PDF te DSpace@MIT, mbi
të cilën bazohet artikulli i 2005; dhe teksti i Chuang & Oliva në formën e dorëshkrimit të autorëve, brenda raportit
përfundimtar të një projekti të Këshillit Kombëtar të Shkencës së Tajvanit (repozitori i National Chengchi University,
ah.lib.nccu.edu.tw). Abstrakti i Raman et al. (2001) u rilexua te faqja e CMR dhe ai i Rinehart-it (1960) te OpenAlex.
Nuk u hapën: DeHoratius & Raman (2008) dhe Rinehart (1960) (INFORMS pas pagese, asnjë kopje e hapur te Unpaywall,
OpenAlex ose CiteSeerX), Raman et al. (2001) (CMR, vetëm abstrakti; një kopje te Scribd nuk u përdor), Hardgrave et
al. (2013) (Wiley; versioni i punës ITRI-WP154 te Arkansas/Auburn nuk hapet më) dhe artikulli i botuar i Kang &
Gershwin te IIE Transactions (Taylor & Francis). Të gjithë mbajnë `via`. Asnjë shifër e shtypur nuk doli ndryshe.

## Tabela e fakteve

| Shifra ose fakti | Burimi | Statusi |
|---|---|---|
| Shitësit me pakicë kishin investuar shumë në sisteme planifikimi, por ngecnin te dy probleme zbatimi: pasaktësia e regjistrimeve të stokut dhe artikujt në vend të gabuar (misplaced SKUs). Te një shitës i madh, 65% e regjistrimeve ishin të pasakta ("recorded inventory levels did not reflect actual inventory levels") | Ananth Raman, Nicole DeHoratius & Zeynep Ton, "Execution: The Missing Link in Retail Operations", California Management Review 43(3), 2001, 136–152 | U konfirmua sërish te abstrakti në faqen e CMR: "sixty-five percent of their inventory records were inaccurate (i.e., recorded inventory levels did not reflect actual inventory levels)". Teksti i plotë nuk u hap |
| Te një shitës tjetër i madh, artikujt në vend të gabuar e penguan një në gjashtë klientë që kërkuan ndihmë nga stafi të gjente produkte që ishin në dyqan. Këto probleme "reduce profits by more than 10%". Performanca ndryshon shumë mes dyqaneve të të njëjtit rrjet që përdorin të njëjtin IT | Po aty | U konfirmua sërish te abstrakti i CMR: "prevented one in six customers who requested help from a sales associate from finding the products"; "reduce profits by more than 10%"; "varies substantially among stores within the same chain that use identical information technology". Si llogaritet 10% nuk u pa (teksti i plotë jo) |
| Gati 370.000 regjistrime stoku në 37 dyqane të një shitësi; 65% të pasakta. Me modelim hierarkik linear (HLM): 26,4% e variancës së përgjithshme të pasaktësisë qëndron mes kategorive të produkteve, 2,7% mes dyqaneve. Praktikat e kontrollit të stokut (inventory auditing) e ulin pasaktësinë; ndërlikimi i mjedisit të dyqanit dhe struktura e shpërndarjes e rritin | Nicole DeHoratius & Ananth Raman, "Inventory Record Inaccuracy: An Empirical Analysis", Management Science 54(4), 2008, 627–641 | U konfirmua te abstrakti në IDEAS/RePEc dhe OpenAlex. "Gati dhjetë herë" është llogaritje e redaksisë (26,4 / 2,7 ≈ 9,8). Kopertina dhe faqja 4 |
| Përkufizimi "i pasaktë" = sasia e regjistruar ndryshon nga sasia fizike | Raman et al. (2001), abstrakti; DeHoratius & Raman (2008) | Përkufizimi i saktë në artikullin e 2008 nuk u pa; në shënim themi "çdo diferencë" sipas abstraktit të 2001. Madhësia e diferencave nuk jepet |
| Tri llojet e gabimit (humbja e paregjistruar, regjistrimi, vendi i gabuar) | Raman et al. (2001) për vendin e gabuar; Chuang & Oliva (2015) për humbjen ("backroom and shelf shrinkage") dhe gabimet e regjistrimit dhe vendosjes | Grupimi dhe shembujt në kartat e faqes 3 janë të redaksisë; kjo thuhet në shënim |
| GAO studioi 7 kompani me praktika të përparuara të numërimit, 12 vende gjithsej. Dy qasje: numërimi ciklik ("a portion of the inventory is counted either daily, weekly, or monthly until the entire inventory has been counted over a period of time") dhe "wall to wall" (gjithë stoku në një moment). Shumica e kompanive përdornin numërimin ciklik; 8 vende numëronin ciklikisht, 4 me numërim të plotë. Për numërimin ciklik nevojitet sistem i përhershëm (perpetual); të gjitha kompanitë e kishin | US General Accounting Office, Executive Guide: Best Practices in Achieving Consistent, Accurate Physical Counts of Inventory and Related Property, GAO-02-447G, 1 mars 2002 | U konfirmua sërish te teksti i plotë (govinfo.gov): "A total of 12 separate locations (from the seven companies) were reviewed"; "a portion of the inventory is counted either daily, weekly, or monthly"; "all of the leading-edge companies had perpetual inventory systems". Emrat e kompanive janë në shtojcën e udhëzuesit; nuk i japim |
| Një vend prodhimi (mbi 11 milionë komponentë elektronikë në vit) e ndante punën në proces sipas vlerës shumëzuar me lëvizjen: A 10% e parë, B 20% e radhës, C 30% e radhës, D 40% e mbetura; A numërohej 4 herë në vit, B 3, C 2, D 1 | Po aty, Key Factor 4, rast studimi | U konfirmua sërish te teksti: "over 11 million electronic components"; "dollar value multiplied by activity or turnover"; "Segment A was counted four times, segment B was counted three times, segment C was counted two times, and segment D was counted once per year". Grafiku i faqes 5 është rivizatim i yni |
| Shpeshtësia te 12 vendet shkonte nga çdo ditë deri në më pak se një herë në vit (disa segmente nuk numëroheshin fare) | Po aty | U konfirmua sërish te teksti: "segments that were not counted at all, or less than once a year, to segments that were counted daily" |
| Një kompani me rreth 80 objekte: një vend kalonte te numërimi ciklik vetëm pas një numërimi të plotë vjetor dhe me saktësi mbi 95%; fillonte me katër cikle të plota në vit; zbritja nga katër në një cikël në vit zgjati rreth 6 vjet; nën 95%: plan korrigjues dhe numërim i plotë vjetor deri sa të rikthehej 95% | Po aty, Key Factor 3, rast studimi | U konfirmua sërish te teksti: "approximately 80 different facilities"; "maintaining record accuracy rates above 95 percent"; "cycling through its entire inventory four times per year"; "the reduction from four cycles to one cycle per year took approximately 6 years". Në revistë e shkurtuam: "duhej sërish një numërim i plotë" |
| Saktësia e regjistrimeve = regjistrimet e sakta / regjistrimet e numëruara × 100; toleranca: kufiri brenda të cilit sasia mund të ndryshojë nga regjistrimi dhe të quhet e saktë | Po aty, Key Factor 12 | U konfirmua sërish te teksti: "Number of accurate items or records x 100% = record accuracy rate" / "Number of items or records counted" |
| Ekspertët: objektivi i saktësisë 95% ose më shumë; 6 nga 8 vendet me numërim ciklik kishin objektiva 95–98%; tolerancat 0–5%, 4 nga 6 vendet që matnin saktësinë kishin tolerancë zero | Po aty, Key Factor 1 dhe 12; GAO citon Brooks & Wilson, Inventory Record Accuracy, f. 22 | U konfirmua sërish te teksti i GAO: "accuracy goals should be set at 95 percent or higher" (shënimi: Brooks and Wilson, p. 22); "Six of the eight … ranged from 95 percent to 98 percent"; "Established tolerances ranged from 0 to 5 percent; however, four of the six locations had a zero quantity tolerance". Libri i Brooks & Wilson nuk u pa; e japim "sipas GAO" |
| Numërimi pa e ditur sasinë (blind count): numëruesi merr artikullin dhe vendin, jo sasinë; e bënin 10 nga 12 vende (6 nga 8 me numërim ciklik, 4 nga 4 me numërim të plotë). Shembulli i GAO: kutia me 20 copë që regjistri e tregon si 1 | Po aty, Key Factor 8 | U konfirmua sërish te teksti: "blind counts … at 10 of the 12 leading-edge locations"; "there is a box of 20 items and the record on-hand shows the quantity as 1" |
| Rinumërimi: zakonisht dy ose tre numërime; një vend përdorte një ekip tjetër për numërimin e dytë. Kërkimi i shkakut (transaksionet, pranimet, dërgesat) zakonisht po atë ditë ose të nesërmen. 4 vende me numërim ciklik i kodonin shkaqet, mesatarisht 22 kode (p.sh. regjistrim i gabuar, vend i gabuar, gabim pranimi, gabim mbledhjeje, gabim dërgimi). Korrigjimet miratoheshin nga menaxhmenti. Korrigjimet maten bruto (shuma e vlerave absolute) dhe neto | Po aty, Key Factor 10, 11, 12 | U konfirmua sërish te teksti: "Typically, two or three counts were performed"; "the same day as the original count or by the end of the following day"; "The number of error codes … averaged 22"; "gross (sum of the absolute value of adjustments) and net" |
| Edhe një normë e vogël humbjesh që sistemi nuk i zbulon sjell pasaktësi që prish rimbushjen dhe krijon mungesa të rënda në raft; humbjet nga shitjet e munguara mund t'i tejkalojnë shumë vetë humbjet e mallit; ndjeshmëria është edhe më e madhe në sisteme lean; në disa raste problemi trajtohet edhe pa teknologji identifikimi automatik | Yun Kang & Stanley B. Gershwin, "Information inaccuracy in inventory systems: stock loss and stockout", IIE Transactions 37(9), 2005, 843–859 | U konfirmua te teksti i plotë i tezës së Kang-ut (DSpace@MIT, 2004): "even a small level of stock loss accumulated over time can lead to inventory inaccuracy that disrupts the replenishment process and creates severe out-of-stocks"; "revenue losses due to out-of-stocks can far outweigh the property losses"; "severe consequences of inventory inaccuracy on lean systems"; "can be effectively treated even without automatic identification technology in some situations". Artikulli i IIE Transactions nuk u hap. Modele analitike dhe simulim. "Me pak stok" për lean është parafrazim i yni |
| Simulim: humbjet në magazinë dhe në raft janë shkaku kryesor i pasaktësisë; tri gabimet e regjistrimit dhe vendosjes kanë ndikim të papërfillshëm. Të dhëna nga pesë dyqane të një rrjeti global: stafi me kohë të plotë e ul pasaktësinë, ai me kohë të pjesshme jo | Howard Hao-Chun Chuang & Rogelio Oliva, "Inventory record inaccuracy: Causes and labor effects", Journal of Operations Management 39–40, 2015, 63–78 | U konfirmua te dorëshkrimi i plotë i autorëve (raporti i NCCU): "backroom and shelf shrinkage are found to be predominant drivers of IRI, the other three errors related to recording and shelving have negligible impacts"; "from five stores in a global retail chain"; "full-time labor reduces IRI whereas part-time labor fails to alleviate it". Versioni i botuar (ScienceDirect) nuk u hap. Ekziston një erratum (2016); nuk u pa çfarë korrigjon |
| RFID: studimi 1, numërim fizik çdo ditë i të gjitha produkteve të një kategorie në 13 dyqane (8 me RFID, 5 kontroll) të një shitësi të madh global, 23 javë: pasaktësia ra rreth 26%. Studimi 2: pesë kategori, 62 dyqane (31 + 31): efekti nga asnjë përmirësim domethënës deri në 81% | Bill C. Hardgrave, John A. Aloysius & Sandeep Goyal, "RFID-Enabled Visibility and Retail Inventory Record Inaccuracy: Experiments in the Field", Production and Operations Management 22(4), 2013, 843–856 | U konfirmua te abstrakti (OpenAlex, edhe te përmbledhjet e SUFE). Në faqe: "deri 81%; te disa, pa efekt domethënës". "~26%" është "approximately 26%" i abstraktit |
| Rast studimi në një depo furnizimi të një agjencie të qeverisë federale të SHBA: rreth 80% e mospërputhjeve mes stokut fizik dhe atij të regjistruar vinin nga vetë procedurat për korrigjimin e mospërputhjeve; dy objektivat: procesi i inventarizimit dhe procedurat e korrigjimit të gjendjeve | R. F. Rinehart, "Effects and Causes of Discrepancies in Supply Operations", Operations Research 8(4), 1960, 543–564 | U konfirmua sërish te abstrakti (OpenAlex): "about 80 per cent of the discrepancies were caused by the discrepancy-correcting procedures themselves"; "(1) the inventorying process and (2) the stock balance adjustment procedures". Artikulli nuk u hap (INFORMS) |

## Çfarë nuk hyri

- Përkufizimi i "cycle counting" në fjalorin e ASCM/APICS ("an inventory accuracy audit technique where inventory is
  counted on a cyclic schedule rather than once a year"): u gjet vetëm te blogje, glosarë komercialë dhe një blog i një
  dege të APICS që nuk u hap. Nuk e përdorëm; përkufizimi i GAO e mbulon.
- DeHoratius & Raman (2008): "mesatarisht gati pesë copë diferencë për artikull, rreth 35% e stokut mesatar në raft":
  vetëm te një përmbledhje dytësore, jo te abstrakti. U la jashtë. Edhe shkaqet që i atribuohen studimit (vjedhje nga
  punonjësit, vjedhje nga klientët, gabime rimbushjeje etj.) vijnë nga një punim dytësor; nuk i japim si gjetje të tyre.
- DeHoratius & Raman (2008): faktorët shpjegojnë 67,6% të variancës mes dyqaneve dhe 69,0% mes kategorive: të
  konfirmuara te abstrakti, por u hoqën nga faqja për vend.
- "Saktësia e stokut te një shitës ishte pak mbi 50% (dyqanet më të mira 75–80%)", e atribuuar Kang-ut: vetëm te një tezë
  e Universitetit të Tennessee-së (2021) që e citon; nuk u konfirmua te Kang & Gershwin. U la jashtë. Edhe shembujt
  numerikë të simulimit (norma e humbjes, koha deri te mungesa) nuk u panë, sepse PDF-ja e MIT u bllokua.
- Brooks & Wilson, Inventory Record Accuracy (Oliver Wight): tolerancat dhe shpeshtësitë sipas ABC nuk u panë te libri;
  vetëm objektivi 95% hyn, përmes GAO.
- Shpeshtësitë "A çdo muaj, B çdo tremujor, C çdo gjashtë muaj" e të ngjashme: vetëm te faqe komerciale pa studim. U lanë
  jashtë.
- Fleisch & Tellkamp (2003/2005), simulim i zinxhirit të furnizimit me pasaktësi stoku: nuk u pa.
- Studimi i rastit në një qendër shpërndarjeje (Produção, SciELO) për numërimin ciklik: faqja nuk u hap.
- HGB § 241 (2) (Gjermani): lejon që inventari i fundvitit të bëhet pa numërim fizik në atë datë, nëse një procedurë
  tjetër sipas parimeve të kontabilitetit të rregullt e garanton gjendjen. Teksti u lexua te gesetze-im-internet.de, por
  lidhja me "permanente Inventur" dhe kushtet e saj nuk u konfirmuan te një burim zyrtar; e lamë jashtë.
- OTIF (Nr. 27), cilësia e të dhënave (Nr. 30) dhe poka-yoke (Nr. 46): nuk përsëriten.
- Shqipëria dhe Gjermania: nuk u gjet asnjë shifër për saktësinë e regjistrimeve të stokut.

## Çfarë është editoriale

- Leximet te kutitë "Leximi ynë": sistemi di vetëm atë që i është thënë; gabimet mblidhen te disa lloje produktesh, aty
  numëro së pari; numërimi ciklik fitohet; regjistrimi që tregon më shumë se ç'ka është ai i rrezikshmi (sistemi nuk
  porosit) dhe një numërim i pakujdesshëm shkruan gabim të ri. Mekanizmi "sistemi sheh stok dhe nuk porosit" është
  shpjegim i redaksisë për "prish rimbushjen" te Kang & Gershwin, jo citim.
- Grupimi i tri llojeve të gabimit te faqja 3.
- Shënimet nën katër hapat e faqes 7 janë përmbledhje e redaksisë nga GAO.
- Shembulli hipotetik i faqes 7 (184 nga 200, +40 dhe −36): numrat janë të shpikur.
- Karta e numërimit ciklik te faqja 8 është praktikë e redaksisë, sipas GAO (numërimi pa sasi, rinumërimi, kërkimi,
  kodet) dhe Rinehart-it (gabimi i numërimit si shkak). Kodet e shkaqeve në kartë janë shembuj të redaksisë, të afërt me
  ata që rendit GAO.
- Lidhja me esenë "Where part of the order goes missing" (faqja 7): eseja flet për porositë që arrijnë të paplota dhe
  për regjistrimin e çdo mungese me shkakun e saj, jo për numërimin e stokut. Është lidhja më e afërt e ndershme: si te
  numërimi ciklik, vlera është te gjetja e vendit ku humbi malli ose informacioni dhe te shënimi i shkakut.
- Lidhja me mjetin Pareto (faqja 8): për renditjen e kodeve të shkaqeve pas një muaji.
