# Management Review Nr. 30 · Cilësia e të dhënave

Blloku: AI. Të dhënat janë te `lib/weekly/issues/30.js`.

Në punën e parë faqet e Harvard Business Review, MIT Sloan Management Review, Gartner, Google Research, ACM, NeurIPS,
arXiv, Elsevier (Business Horizons), DAMA UK, ISO/IEC, Destatis dhe INSTAT nuk u hapën nga ambienti i punës; çdo fakt u
kontrollua te teksti që kthenin kërkimet, te abstraktet dhe te burime të pavarura.
Studimi i Nagle, Redman & Sammon mbështetet te 75 matje që 75 drejtues bënë vetë në njësitë e tyre gjatë dy
vjetëve: mostër e vogël dhe jo përfaqësuese, dhe pragun e asaj që quhet "e pranueshme" e vendosën vetë drejtuesit.
Shifrat e kostos (3,1 trilionë dollarë për SHBA-në në 2016, vlerësim i IBM; 12,9 milionë dollarë në vit për
organizatë, Gartner 2021) janë vlerësime pa metodë të dukshme; nuk mblidhen dhe nuk krahasohen me njëra-tjetrën.
Rregulli i dhjetës është heuristikë e Redman-it, jo matje. Nga Gartner për AI-në kemi një vetëdeklarim (anketa e
korrikut 2024) dhe një parashikim deri në 2026, që ende nuk mund të kontrollohet. Sambasivan et al. është studim me
intervista (53 veta); Northcutt et al. mat gabimet në grupe publike testimi, jo në të dhënat e kompanive. Për
Gjermaninë, Destatis jep arsyet që ndërmarrjet deklarojnë vetë kundër AI-së, jo një matje të cilësisë së të dhënave.
Për Shqipërinë nuk gjetëm shifër të krahasueshme. Rregulli "1-10-100" nuk hyri, sepse burimi i tij parësor nuk u
gjet. Kostoja e cilësisë (ASQ, Crosby) është te Nr. 22, vendimet me të dhëna (Wavestone 2024) te Nr. 20 dhe AI-ja në
punën e menaxherit te Nr. 10; këtu nuk përsëriten.

Kontrolli i dytë, te tekstet e plota (12 tetor 2026). U lexuan të plota: Nagle, Redman & Sammon (2017) dhe Redman (2016)
te hbr.org (teksti i artikullit në faqen e HBR); njoftimi i Gartner i 26 shkurtit 2025 (në serverin e Gartner
gcom.pdo.aws.gartner.com, sepse gartner.com kthen 403); tabela e Destatis (destatis.de, gjendja 24 nëntor 2025);
Sambasivan et al. (2021), versioni përfundimtar i autorëve me shënimin e ACM-së dhe DOI-n, te Google Research (ACM kthen
403); Northcutt et al., PDF-ja e botuesit te NeurIPS Datasets and Benchmarks dhe arXiv v4; dokumenti i DAMA UK, "Final
version", tetor 2013, në një kopje te codeberg.page, sepse te dama-uk.org është vetëm për anëtarët; dhe UK Government Data
Quality Framework (gov.uk, 3 dhjetor 2020). Nuk u hapën: artikulli i Gartner i 2021-s (gartner.com 403; në serverin e
Gartner adresa ridrejtohet te faqja e përgjithshme "Insights", ndaj artikulli mund të jetë hequr) dhe ribotimi i Redman-it
në SAP Community me përditësimin e 2023-s (403); këto mbeten sipas copave të kërkimit. Asnjë shifër e shtypur nuk doli
ndryshe. U ndreqën, në të tri gjuhët: (1) HBR thotë "the last 100 units of work completed by their departments —
essentially 100 data records", jo regjistrimet e "krijuara ose përdorura": faqet 3 dhe 7 thonë tani "që kishin
plotësuar"; (2) për industritë autorët shkruajnë "have yielded no meaningful insights": anglishtja thotë "meaningful",
jo "significant"; (3) shënimi i faqes 5 nuk thotë më se përkufizimet ndjekin përmbledhjet, sepse dokumenti u lexua. Tabela
e Destatis e zgjidh mospërputhjen e shënuar më poshtë: tabela e arsyeve ka bazë "Anteil in % an allen Unternehmen die
Nutzung der Technologien der künstlichen Intelligenz in Betracht gezogen haben, bisher aber nicht nutzen".

## Tabela e fakteve

| Shifra ose fakti | Burimi | Statusi |
|---|---|---|
| Matja "e së premtes pasdite" (Friday Afternoon Measurement): një njësi merr 100 njësitë e fundit të punës që ka plotësuar, në thelb 100 regjistrime (records), dhe zgjedh 10–15 fushat (atributet) më të rëndësishme. Ekipi i kalon regjistrim pas regjistrimi, shënon gabimet e dukshme dhe numëron regjistrimet pa asnjë gabim. Ky numër, nga 0 deri në 100, është rezultati i cilësisë së të dhënave (DQ score) | Tadhg Nagle, Thomas C. Redman & David Sammon, "Only 3% of Companies' Data Meets Basic Quality Standards", Harvard Business Review, shtator 2017 | U konfirmua te teksti i plotë te hbr.org: "We instruct managers to assemble 10-15 critical data attributes for the last 100 units of work completed by their departments — essentially 100 data records. Managers and their teams work through each record, marking obvious errors. They then count up the total of error-free records. This number, which can range from 0 to 100, represents the percent of data created correctly — their Data Quality (DQ) Score." **U ndreq** "krijuar ose përdorur" (faqet 3 dhe 7): artikulli thotë "completed"; "ose përdorur" vinte nga artikulli i Redman-it i 2016-s, që nuk është burim i numrit |
| 75 drejtues e bënë matjen në njësitë e tyre gjatë dy vjetëve: 75 matje. Mesatarisht 47% e regjistrimeve të krijuara rishtazi kishin të paktën një gabim kritik, domethënë që ndikon në punë. Rezultatet shkonin nga 0 deri në 99 | Po aty | U konfirmua te teksti i plotë te hbr.org: "Over the past two years, we've taken 75 executives through this exercise. In so doing, we've collected 75 data quality measurements"; "On average, 47% of newly-created data records have at least one critical (e.g., work-impacting) error"; "Individual tallies range from 0% to 99%". Pjesëmarrësit ishin drejtues në programe ekzekutive në Irlandë, "from a wide range of companies and government agencies". Mostër e vogël, jo përfaqësuese; vitet e matjeve nuk thuhen |
| Të pyetur sa të mira duhet të jenë të dhënat, asnjë drejtues nuk e quajti të pranueshëm një rezultat nën "nëntëdhjetat e larta" (high nineties). Më pak se 3% e rezultateve e arritën këtë prag | Po aty | U konfirmua te teksti i plotë te hbr.org: "none has ever thought a score less than the 'high nineties' acceptable. Less than 3% in our sample meet this standard"; edhe "Only 3% of the DQ scores in our study can be rated 'acceptable' using the loosest-possible standard". Pyetja u bë "both in these classes and in consulting engagements". 3% janë matje, jo kompani |
| Autorët kontrolluan nëse disa industri dalin më mirë ose më keq dhe nuk gjetën dallime domethënëse | Po aty | U konfirmua te teksti i plotë te hbr.org: "Our deeper analyses (to see if, for instance, specific industries are better or worse) have yielded no meaningful insights." **U ndreq** anglishtja e faqes 3: "meaningful", jo "significant", që sugjeron test statistikor |
| Rregulli i dhjetës (Rule of Ten): një njësi pune kushton dhjetë herë më shumë kur të dhënat kanë qoftë edhe një gabim sesa kur janë të përsosura. Shembulli i autorëve: 100 njësi pune me 1 dollar secila; nëse 89 kanë të dhëna të përsosura dhe 11 me gabime, kostoja bëhet 89 × 1 + 11 × 10 = 199 dollarë në vend të 100 | Po aty | U konfirmua te teksti i plotë te hbr.org: "'rule of ten,' which states that 'it costs ten times as much to complete a unit of work when the data are flawed in any way as it does when they are perfect.'"; "If 89 are perfect and 11 are flawed, the total cost is 89 x $1 + 11 x $10 = $199". Artikulli i 2016-s e quan një nga "two simple tools" të Redman-it. Heuristikë, jo matje |
| Kostoja vjetore e të dhënave me cilësi të dobët vetëm në SHBA, në 2016: 3,1 trilionë dollarë, sipas një vlerësimi të IBM. Redman e vuri përballë vlerësimit të IDC për tregun botëror të big data në 2016 (136 miliardë dollarë) dhe shkroi vetë se shifrat nuk janë vërtet të krahasueshme dhe se rreth secilës ka luhatje të mëdha | Thomas C. Redman, "Bad Data Costs the U.S. $3 Trillion Per Year", Harvard Business Review, 22 shtator 2016 | U konfirmua te teksti i plotë te hbr.org: "$136 billion per year. That's the research firm IDC's estimate of the size of the big data market, worldwide, in 2016"; "$3.1 trillion, IBM's estimate of the yearly cost of poor quality data, in the US alone, in 2016"; "the numbers are not really comparable, and there is considerable variation around each". Metoda e IBM nuk jepet |
| Në një përditësim të 2023-s, Redman shkroi se shifra vinte nga një infografik i IBM për "katër V-të" e të dhënave, nën "veracity" (vërtetësia), që IBM e ka hequr më pas; se e shkroi artikullin për të tërhequr vëmendjen me "një numër jashtë mase të madh" dhe për të treguar ku shkojnë ato para; dhe se shifra mund të jetë gabim me një trilion dollarë, në njërin ose në tjetrin drejtim | Po aty, ribotimi me përditësimin e autorit (SAP Community, 2023) | Ribotimi në SAP Community nuk u hap (blogs.sap.com dhe community.sap.com kthejnë 403, edhe me WebFetch). Mbetet sipas copave të kërkimit: shifra nga një infografik i IBM për "veracity", i hequr më pas; artikulli për të tërhequr vëmendjen me një numër të madh; shifra mund të jetë 2 ose 4 trilionë. Teksti i HBR nuk e ka këtë përditësim |
| Sipas Redman-it, kostoja fshihet te "fabrikat e fshehura të të dhënave" (hidden data factories): njësia B, përveç punës së vet, shton hapa për të përballuar gabimet që krijoi njësia A; nën presionin e afateve, njerëzit i korrigjojnë vetë dhe rrallë ia kthejnë burimit që ta ndreqë shkakun. Vlerësimi i tij: 50% e kohës së punonjësve të dijes (knowledge workers) humbet në këto fabrika | Po aty (artikulli i 2016-s) | U konfirmua te teksti i plotë te hbr.org: "Department B, in addition to doing its own work, must add steps to accommodate errors created by Department A"; "many individuals simply make corrections themselves"; "I call the added steps the 'hidden data factory.'"; "50% — the amount of time that knowledge workers waste in hidden data factories, hunting for data, finding and correcting errors". Për 50% nuk jepet burim; e trajtojmë si vlerësim të autorit |
| Çdo vit, cilësia e dobët e të dhënave u kushton organizatave mesatarisht 12,9 milionë dollarë. Përtej ndikimit të menjëhershëm te të ardhurat, në afat të gjatë i bën ekosistemet e të dhënave më të ndërlikuara dhe çon në vendime të dobëta | Manasi Sakpal, "How to Improve Your Data Quality", Smarter With Gartner, Gartner, 14 korrik 2021 | Artikulli nuk u hap: gartner.com kthen 403; në serverin e Gartner (gcom.pdo.aws.gartner.com) adresa ridrejtohet (301) te gartner.com/en/insights, ndaj artikulli mund të jetë hequr. Mbetet sipas copave të kërkimit (kopja e faqes dhe ribotimi në CDO Trends). Mostra dhe mënyra e llogaritjes nuk shihen: vlerësim |
| Anketë me 1.203 drejtues të menaxhimit të të dhënave, korrik 2024: 63% e organizatave ose nuk i kanë, ose nuk janë të sigurta nëse i kanë praktikat e duhura të menaxhimit të të dhënave për AI. Parashikim: deri në 2026 (through 2026), organizatat do të braktisin 60% të projekteve të AI-së që nuk mbështeten nga të dhëna gati për AI (AI-ready data) | Gartner, "Lack of AI-Ready Data Puts AI Projects at Risk", njoftim për shtyp, 26 shkurt 2025 | U konfirmua te teksti i plotë i njoftimit (serveri i Gartner gcom.pdo.aws.gartner.com): "Sixty-three percent of organizations either do not have or are unsure if they have the right data management practices for AI, according to a survey by Gartner. A survey of 1,203 data management leaders in July 2024"; "Gartner predicts that through 2026, organizations will abandon 60% of AI projects unsupported by AI-ready data". 63% është vetëdeklarim |
| Sipas Gartner, të dhënat gati për AI duhet të përfaqësojnë rastin e përdorimit: çdo model (pattern), gabim, vlerë të skajshme (outlier) dhe shfaqje të papritur që duhet për të trajnuar ose për të përdorur modelin e AI-së për atë përdorim të caktuar | Po aty | U konfirmua te teksti i plotë i njoftimit: "The data must be representative of the use case, of every pattern, errors, outliers and unexpected emergence that is needed to train or run the AI model for the specific use." |
| Gjashtë dimensionet kryesore për të vlerësuar cilësinë e të dhënave: plotësia (completeness), veçantia, pra pa dublikata (uniqueness), aktualiteti (timeliness), vlefshmëria (validity), saktësia (accuracy) dhe konsistenca (consistency) | DAMA UK Working Group, "The Six Primary Dimensions for Data Quality Assessment", 2013 | U konfirmua te dokumenti i plotë i DAMA UK ("October 2013, FINAL VERSION", kopje te codeberg.page; te dama-uk.org vetëm për anëtarët): completeness, "the proportion of stored data against the potential of '100% complete'"; uniqueness, "No thing will be recorded more than once"; timeliness, "The degree to which data represent reality from the required point in time" (shembulli: një numër kontakti i futur 3 ditë pas ndryshimit, kundër marrëveshjes 2 ditë); validity, "conforms to the syntax (format, type, range) of its definition"; accuracy, "correctly describes the 'real world' object or event"; consistency, "The absence of difference, when comparing two or more representations of a thing", "It is possible to have consistency without validity or accuracy". Grupi i punës u thirr në maj 2012. UK Government Data Quality Framework (3 dhjetor 2020) i merr "as defined by DAMA UK". **U ndreq** shënimi i faqes 5: përkufizimet përmbledhin vetë dokumentin |
| Intervista me 53 praktikues të AI-së në Indi, në vende të Afrikës Lindore dhe Perëndimore dhe në SHBA, që ndërtojnë AI në fusha me rrezik të lartë (high-stakes). "Kaskadat e të dhënave" (data cascades) janë ngjarje që grumbullohen dhe sjellin efekte negative më poshtë në zinxhir, nga probleme të të dhënave, të nxitura nga praktika të zakonshme të AI-së që e nënvlerësojnë cilësinë e të dhënave. 92% e të intervistuarve kishin përjetuar të paktën një kaskadë; autorët i përshkruajnë si të përhapura, të padukshme, të vonuara, por shpesh të shmangshme | Nithya Sambasivan et al., ""Everyone wants to do the model work, not the data work": Data Cascades in High-Stakes AI", CHI 2021, ACM | U konfirmua te versioni përfundimtar i autorëve (PDF te Google Research, me shënimin e ACM-së, CHI '21): "interviews with 53 AI practitioners in India, East and West African countries, and USA"; "Data Cascades—compounding events causing negative, downstream effects from data issues"; "Data cascades are pervasive (92% prevalence), invisible, delayed, but often avoidable"; f. 2: "92% of AI practitioners reported experiencing one or more, and 45.3% reported two or more cascades in a given project". Studim cilësor, jo anketë përfaqësuese |
| Gabime te etiketat (labels) e grupeve të testimit të 10 grupeve të të dhënave nga më të përdorurat për imazhe, tekst dhe audio: mesatarisht të paktën 3,3%. Te grupi i validimit i ImageNet: 2.916 gabime, rreth 6%. Nga 0,15% (MNIST) deri në 10,12% (QuickDraw). Kandidatët për gabim i gjeti një algoritëm (confident learning) dhe i kontrolluan njerëz me crowdsourcing: 51% e tyre ishin vërtet të etiketuar gabim | Curtis G. Northcutt, Anish Athalye & Jonas Mueller, "Pervasive Label Errors in Test Sets Destabilize Machine Learning Benchmarks", NeurIPS 2021 (Datasets and Benchmarks Track) | U konfirmua te PDF-ja e botuesit (NeurIPS Datasets and Benchmarks 2021) dhe te arXiv v4: "we estimate an average of at least 3.3% errors across the 10 datasets, where for example label errors comprise at least 6% of the ImageNet validation set"; "2916 (6%) errors in the ImageNet validation set"; "from 0.15% (MNIST) to 10.12% (QuickDraw)"; Tabela 1: ImageNet 5,83; "51% of the algorithmically-flagged candidates are indeed erroneously labeled". 3,4% është te abstrakti i arXiv v1–v3 (2021), "2916 label errors comprise 6%" |
| Gabimet mund ta përmbysin renditjen e modeleve: te ImageNet me etiketa të korrigjuara, ResNet-18 del më mirë se ResNet-50 nëse pjesa e shembujve të testimit me etiketë fillimisht të gabuar rritet me vetëm 6% | Po aty | U konfirmua te PDF-ja e botuesit (NeurIPS) dhe arXiv v4: "on ImageNet with corrected labels: ResNet-18 outperforms ResNet-50 if the prevalence of originally mislabeled test examples increases by just 6%" |
| Gjermani, 2025: te ndërmarrjet që e kanë menduar përdorimin e AI-së, por nuk e përdorin, arsyet kundër janë mungesa e njohurive 72%, paqartësia për pasojat ligjore 62%, shqetësimet për mbrojtjen e të dhënave dhe privatësinë 60%, papërputhshmëria me sistemet ekzistuese 45%, vështirësitë me disponueshmërinë ose cilësinë e të dhënave të nevojshme 44%, kostot shumë të larta 32% dhe konsideratat etike 23%. Te të dhënat, madhësia e ndërmarrjes pothuajse nuk bën dallim: 44% (10–49 të punësuar), 45% (50–249), 43% (250 e më shumë). Në 2025 përdornin AI 26% e ndërmarrjeve me të paktën 10 të punësuar dhe 57% e atyre me 250 e më shumë | Statistisches Bundesamt (Destatis), "Gründe gegen die Nutzung von Technologien der künstlichen Intelligenz nach Beschäftigtengrößenklassen" dhe tabela shoqëruese për përdorimin e AI-së, anketa e TIK-ut në ndërmarrje 2025 | U konfirmua te teksti i plotë i tabelës së Destatis (gjendja 24 nëntor 2025): baza është "Anteil in % an allen Unternehmen die Nutzung der Technologien der künstlichen Intelligenz in Betracht gezogen haben, bisher aber nicht nutzen"; "Schwierigkeiten mit der Verfügbarkeit/Qualität der erforderlichen Daten 44" (44 / 45 / 43 sipas madhësisë); mungesa e njohurive 72, paqartësia ligjore 62, mbrojtja e të dhënave 60, papërputhshmëria 45, kostot 32, etika 23; "Nach EU-Unternehmensbegriff ab dem Berichtsjahr 2025". Mospërputhja që shënonim mes titullit dhe faqes nuk ekziston: tabela e parë jep pjesën e të gjitha ndërmarrjeve që e menduan AI-në pa e përdorur (20%), tabela e arsyeve jep pjesën brenda tyre. 26% dhe 57% (përdorimi i AI-së) nuk u rikontrolluan; nuk janë shtypur |

## Çfarë nuk hyri

- Redman, "Seizing Opportunity in Data Quality", MIT Sloan Management Review, 27 nëntor 2017: kostoja e të dhënave të
  këqija vlerësohet 15–25% e të ardhurave për shumicën e kompanive, sipas kërkimeve të Experian plc dhe të konsulentëve
  James Price (Experience Matters) dhe Martin Spratt (Clear Strategic IT Partners); sipas Redman-it, dy të tretat e
  këtyre kostove mund të identifikohen dhe të eliminohen. U konfirmua te teksti i MIT SMR siç e kthen kërkimi (një
  kërkim), 15–25% edhe te një burim dytësor; metoda nuk shihet. E lamë jashtë që burimet të mos kalojnë tetë; mund të
  zërë vendin e Redman-it (2016). Mos e ngatërroni me 15–20% të ASQ-së për koston e cilësisë (Nr. 22).
- Versioni akademik i studimit: Nagle, Redman & Sammon, "Assessing data quality: A managerial call to action", Business
  Horizons 63(3), 2020, f. 325–337, DOI 10.1016/j.bushor.2020.01.006. U përdor vetëm për kontroll (75 vlerësime gjatë dy
  vjetëve, 47%, pragu ≥97). Nëse numri shkruan "97 nga 100" në vend të "nëntëdhjetave të larta", duhet shtuar si burim.
- Shpërndarja e rezultateve ("gati gjysma nën 57", "një e katërta nën 30"): e para vetëm te Becker's Hospital Review, e
  dyta nuk u gjet te tekstet që kthyen kërkimet. Nuk e vizatojmë.
- Hapat e hollësishëm te Redman, "Assess Whether You Have a Data Quality Problem", HBR, korrik 2016 (dy ose tre veta që
  i njohin të dhënat, rreth dy orë, zakonisht jo më shumë se 30 sekonda për regjistrim; shembulli 67 regjistrime pa
  gabim nga 100): u konfirmuan te teksti i HBR siç e kthen kërkimi (një kërkim), por do të ishte burim i nëntë. Metoda
  në tabelë ndjek artikullin e 2017-s.
- Rregulli "1-10-100" (1 dollar për ta verifikuar një regjistrim kur hyn, 10 për ta korrigjuar më vonë, 100 nëse gabimi
  nuk korrigjohet): i atribuohet George Labovitz dhe Yu Sang Chang (1992), por këtë e gjetëm vetëm te faqe shitësish
  softueri për të dhënat dhe adresat (Vertafore, FSI, Loqate, Netum, Konsolidator); disa e shkruajnë emrin gabim
  ("Loabovitz"). Vetëm njëra prej tyre emërton librin, Making Quality Work: A Leadership Guide for the Results-Driven
  Manager. Libri ekziston (katalogë bibliotekash: 1992, ribotim te HarperBusiness në 1993; botuesi i parë ndryshon mes
  katalogëve), por faqja me rregullin nuk u pa. Asnjë studim nuk i mat shumëzuesit; vetë shitësit e quajnë kornizë të
  përgjithshme. Është heuristikë, jo e dhënë. Në vend të tij japim rregullin e dhjetës të Redman-it, që ka burim të
  dukshëm, por që është po ashtu heuristikë.
- ISO/IEC 25012:2008: modeli i cilësisë së të dhënave ka 15 karakteristika, të parë nga dy pikëpamje, e brendshme
  (inherent) dhe e varur nga sistemi (system dependent). U konfirmua te abstrakti i standardit në dyqanin e IEC dhe te
  dy faqe të tjera (një kërkim); u panë emrat e saktësisë, plotësisë, konsistencës, besueshmërisë (credibility) dhe
  aktualitetit (currentness), por jo lista e plotë dhe grupimi. E lamë jashtë që burimet të mos kalojnë tetë; gjashtë
  dimensionet e DAMA UK janë më të thjeshta për kartën.
- Gartner, 15 milionë dollarë kosto mesatare vjetore e cilësisë së dobët të të dhënave në 2017 (Data Quality Market
  Survey), dhe "gati 60% e organizatave nuk e matin koston financiare vjetore të të dhënave me cilësi të dobët": u panë
  te teksti i Gartner (Smarter With Gartner, 2018) siç e kthen kërkimi (një kërkim), por titulli, data e saktë dhe
  mostra nuk u konfirmuan. 15 milionë (2017) dhe 12,9 milionë (2021) nuk janë trend: baza e asnjërës nuk dihet.
- Parashikimi i Gartner te artikulli i 2021-s (deri në 2022, 70% e organizatave do ta ndjekin me rreptësi cilësinë e të
  dhënave me metrika dhe do ta përmirësojnë me 60%): parashikim i kaluar; nuk kemi të dhëna nëse u realizua.
- Roxane Edjlali e Gartner (nëntor 2024): të dhënat me cilësi të lartë sipas gjykimit të njeriut nuk janë të dhëna gati
  për AI; gatishmëria provohet me metadata për prejardhjen e burimit, me vëzhgim (observability) gjatë zhvillimit dhe
  përdorimit të modelit dhe me qeverisje. U konfirmua te teksti i Gartner, "Gartner IT Symposium/Xpo 2024 in Barcelona:
  Day 1 Highlights", 4 nëntor 2024, siç e kthen kërkimi (një kërkim), por do të ishte burim i nëntë.
- Shifra që blogjet ia atribuojnë Gartner (7,2 milionë dollarë kosto e humbur për çdo projekt AI të braktisur; 47%
  kundrejt 14% sukses me ose pa vlerësim të gatishmërisë së të dhënave): nuk janë te njoftimi i Gartner; nuk u
  konfirmuan. Raporti "12 Actions Data and Analytics Leaders Can Take to Improve Data Quality" (Saul Judah & Melody
  Chien, Gartner, 23 korrik 2024), që e citojnë faqe shitësish: nuk u pa nëse e përsërit 12,9 milionë.
- Destatis për 2024 dhe 2023: në 2024 (njoftimi nr. 444, 25 nëntor 2024) AI-në e përdornin 20% e ndërmarrjeve (12% në
  2023); arsyet: mungesa e njohurive 71%, paqartësia ligjore 58%, mbrojtja e të dhënave dhe privatësia 53%,
  disponueshmëria ose cilësia e të dhënave 45%. Në 2023 (njoftimi nr. 453, nëntor 2023) e njëjta arsye ishte 53%, e
  treta pas mungesës së njohurive dhe papërputhshmërisë me sistemet. U konfirmuan te teksti i Destatis (dy kërkime).
  Nuk i japim si trend (53% → 45% → 44%): çdo vit baza janë ndërmarrje të tjera, ato që e kanë menduar AI-në, në 2025
  ndryshoi njësia statistikore, dhe njoftimet do të ishin burime të tjera.
- BE: "6,51% e kompanive evropiane thonë se mungesa e të dhënave të nevojshme i pengon të përdorin AI; Gjermania 9,12%"
  (EU Tech Loop, përmes Euronews, të dhëna 2025): baza nuk është e qartë, një burim dytësor. Statistics Austria (2023):
  5,0% e ndërmarrjeve që nuk përdorin AI; bazë tjetër. Shifra e BE-së për të njëjtën pyetje si te Destatis nuk u gjet.
- Shqipëria: nuk gjetëm shifër të krahasueshme. Njoftimi i INSTAT për TIK-un në ndërmarrje 2025 (19 shtator 2025) jep
  99,4% të ndërmarrjeve me 10 e më shumë të punësuar që përdorin kompjuter me internet dhe 31,8% me specialistë të
  TIK-ut (29,7% në 2024), por AI-ja dhe cilësia e të dhënave nuk dalin te tekstet që pamë. Anketa ndjek rregulloret e
  BE-së (2019/2152; 2022/1344), ndaj tabelat e plota mund të kenë pyetje për AI-në; nuk u kontrolluan.
- Sambasivan et al.: 45,3% përjetuan dy ose më shumë kaskada në një projekt (f. 2), u konfirmua në kontrollin e dytë;
  nuk hyri për vend.
- Northcutt et al.: vlerat për grupet e tjera (CIFAR-10, CIFAR-100, Caltech-256, 20news, IMDB, AudioSet etj.) nuk u
  panë. Një artikull shtypi ia atribuon CIFAR-100 2.916 gabimet e ImageNet; ka gjasa të jetë gabim.
- Shifrat që qarkullojnë për kohën që shkencëtarët e të dhënave i kushtojnë pastrimit të tyre (60% ose 80%): nuk u
  kontrolluan.
- Neni 10 i Rregullores (BE) 2024/1689 (AI Act), për të dhënat e trajnimit, validimit dhe testimit: nuk u kontrollua; i
  takon Nr. 41.
- Wavestone 2024 (Nr. 20), kostoja e cilësisë me ASQ-në dhe Crosby-n (Nr. 22), Six Sigma (Nr. 25) dhe shifrat e AI-së te
  Nr. 10: nuk përsëriten.

## Çfarë është editoriale

- Leximet te kutitë "Leximi ynë": prova merr një pasdite dhe pjesa e vështirë është të shohësh punën e ekipit tënd; e
  pastër nuk do të thotë e përshtatshme për përdorim; një model gjykohet kundrejt të dhënave.
- Grafiku me kolona te faqja 4 ilustron rregullin e dhjetës me shembullin e autorëve (89 + 11 × 10 = 199); është
  heuristikë, jo matje.
- Hapat te faqja 7 ndjekin metodën e Nagle, Redman & Sammon; shembulli hipotetik i 100 porosive (24 me gabim, rezultati
  76, 76 + 24 × 10 = 316) është i shpikur dhe llogaritja është e jona.
- Përkufizimet e shkurtra të gjashtë dimensioneve te faqja 5 ndjekin përmbledhjet e dokumentit të DAMA UK; formulimi është
  i redaksisë.
- Karta e cilësisë së të dhënave te faqja 8 është e redaksisë; lidhja me mjetin Pareto të faqes është zgjedhje e jona.
- Renditja e burimeve te faqja 9 ndjek faqosjen, jo rëndësinë.
