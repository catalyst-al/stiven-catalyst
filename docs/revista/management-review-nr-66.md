# Management Review Nr. 66 · Kanban dhe kufiri i punës në proces

Blloku: Operacioni. Të dhënat janë te `lib/weekly/issues/66.js`.

Faqja e historisë 75-vjeçare të Toyota-s (metoda e supermarketit), faqja e Toyota-s për Toyota Production System, versioni
i pranuar i artikullit të Middleton-it dhe Joyce-it (portali i Queen's University Belfast, PDF), artikulli i punës i Bray-t
et al. (mars 2016, PDF), Kanban Guide (maj 2025), historia e Anderson-it te djaa.com, fjalori i LEI për kanban-in dhe
përmbledhja e rastit XIT nga Kanban University u hapën dhe u lexuan. Faqet e INFORMS (M&SOM) nuk u hapën (403); abstraktet
e Hopp & Spearman (2004) dhe Bray et al. (2016) u lexuan te Crossref, abstrakti i Coviello et al. (2015) te RePEc/IDEAS dhe
ai i versionit të punës (2010) te NBER. Libri i Ohno-s (1988) dhe libri i Anderson-it (2010) nuk u panë: për Anderson-in
mbështetemi te rrëfimi i tij (2014) dhe te të dhënat bibliografike të katalogëve. Rasti i BBC Worldwide është një rast i
vetëm, ku ndryshuan edhe gjëra të tjera (punë më të vogla, aftësi më të mëdha); studimi i Romës nuk ka caktim të
rastësishëm. Të dyja thuhen në faqe. Për Shqipërinë nuk u gjet asnjë shifër.

## Tabela e fakteve

| Shifra ose fakti | Burimi | Statusi |
|---|---|---|
| Para metodës së supermarketit, në repartin e përpunimit çdo pjese i ngjitej një fletë shoqëruese dhe ekipi i transportit e çonte te montimi i makinerive, qoftë kur nevojitej, qoftë kur jo; pjesët grumbulloheshin. Në fillim të muajit montimi ishte afërsisht gjysma e vëllimit të planifikuar; në fund të muajit bëhej "end of month catch-up production", me transportuesin më të shpejtë dhe me të njëjtin numër punëtorësh si në fillim, kur kishte punëtorë të tepërt që prisnin pjesët | Toyota Motor Corporation, 75 Years of Toyota, Part 1, Chapter 2, Section 7, Item 4, "Supermarket Method" (2012) | U konfirmua te teksti i faqes (curl). Viti 2012 si te burimi ekzistues `toyota-tbp` i së njëjtës histori. Parafrazë e jona |
| Në 1954, bashkë me rritjen e vëllimeve, u fut "supermarket method". Ideja erdhi nga një reportazh për një fabrikë avionësh të Lockheed-it në SHBA, në një botim të industrisë në pranverë 1954; supermarketet nuk ishin të zakonshme në Japoni. Toyota nxori se "the subsequent process is the 'customer' and the prior process is the 'supermarket'"; procesi pasardhës merr pjesët nga paraardhësi | Po aty | U konfirmua te teksti. Citimi i shkurtër është i Toyota-s; përkthimi është i yni. Kursimet e Lockheed-it sipas reportazhit (250.000 dollarë në vit, 60.000 këmbë katrore) nuk hynë (shih "Çfarë nuk hyri") |
| Metoda e supermarketit u bë sistemi Kanban me shtimin e një flete udhëzimi prodhimi, kanban-it (kartë ose tabelë me emrin e produktit, numrin e produktit dhe sasinë); pastaj u zhvillua në Just-in-Time, "producing only what is needed, when it is needed, and in the amount needed" | Po aty | U konfirmua te teksti. Te kartat e faqes 3 përshkrimet e "supermarketit" dhe të "klientit" janë parafrazë e jona e të njëjtit paragraf |
| BBC Worldwide: ekip softueri prej nëntë vetash në Londër; në prill 2008 të gjitha fazat u vizatuan në tabela kanban dhe çdo punë u vu në karta; "more WIP and more bottlenecks of work than previously realized". Kufijtë e WIP u caktuan duke nisur nga pikat e ngushta (më pak testues dhe analistë biznesi se programues) dhe u rishikuan kur lëvizën pikat e ngushta | Peter Middleton & David Joyce, "Lean Software Management: BBC Worldwide Case Study", IEEE Transactions on Engineering Management 59(1), 2012, 20–32 | U konfirmua te versioni i pranuar (peer reviewed) në portalin e Queen's University Belfast (PDF). Abstrakti u pa edhe te katalogu i Loughborough |
| Gjatë 12 muajve: koha e kalimit mesatare nga 22,8 në 14,4 ditë pune (−37%); kufiri i sipërm i kontrollit të kohës së kalimit nga 70,7 në 37,3 ditë pune (−47%, "consistency of delivery"); koha e zhvillimit mesatare nga 9,2 në 2,5 ditë pune gjatë nëntë muajve (−73%); ditët mesatare kur punët ishin të bllokuara nga 25,8 në 4,9 në muaj (−81%); defektet ende të hapura dhe të raportuara në javë nga 2,9 në 2,2 (−24%) | Po aty, seksioni i analizës dhe abstrakti | U konfirmua te teksti. 37%, 47% dhe 24% janë edhe në abstrakt. Grafiku i faqes 4 i rivizaton katër palë vlerash; nuk kopjojmë grafikët SPC të artikullit. Te shënimi themi që koha e zhvillimit mbulon nëntë muaj |
| Kufizimet: ekip i qëndrueshëm, me mjete më të mira dhe aftësi në rritje gjatë 12 muajve; punët u ndanë në njësi më të vogla (MMF); praktikat inxhinierike u përmirësuan, shumica ishin në vend që nga tetori 2008; numri i defekteve ishte i ulët dhe autorët do të preferonin të dhëna më të gjata; hipoteza u mbështet "by this single case study" | Po aty | U konfirmua te teksti. Prandaj te shënimi: "Një rast i vetëm" |
| Takimi ditor në këmbë: rreth 15 minuta, para tabelës B; së pari secili kontrollon nëse statusi i punës së vet shfaqet saktë, pastaj kush është i bllokuar, pastaj grumbujt e kartave që tregojnë një pikë të ngushtë, në fund nëse kanë ndryshuar përparësitë | Po aty, seksioni "Daily Standup" | U konfirmua te teksti. Te faqja 7 e përmbledhim në katër hapa |
| "Pull is essentially a mechanism for limiting WIP"; literatura e praktikës i ka thjeshtuar termat pull dhe lean deri në keqkuptime | Wallace J. Hopp & Mark L. Spearman, "To Pull or Not to Pull: What Is the Question?", Manufacturing & Service Operations Management 6(2), 2004, 133–148 | Abstrakti u konfirmua te Crossref (DOI 10.1287/msom.1030.0028). Artikulli i plotë nuk u pa. "Pa kartë të lirë, nuk ka fillim të ri" është shpjegimi ynë |
| Tetor 2004: Dragos Dumitriu, menaxher i XIT Sustaining Engineering në Microsoft, i kërkon ndihmë Anderson-it; ai projekton një sistem tërheqës, pa tabelë fizike, të frymëzuar nga Drum-Buffer-Rope; dimër 2005: e quan "virtual kanban system". Corbis: shtator 2006 sistemi kanban për mirëmbajtjen; janar 2007 Darren Davis propozon një mur kartash në një tabelë të bardhë, ide që erdhi nga një anëtar i ekipit të tij; libri Kanban u botua nga Blue Hole Press | David J. Anderson, "A Brief History of Kanban for Knowledge Work", djaa.com, 21 korrik 2014 | U konfirmua te teksti i faqes (data nga meta-të dhënat e faqes). Është rrëfimi i vetë Anderson-it, që e shkruan për t'iu kundërvënë versioneve të tjera; prandaj në faqe "sipas rrëfimit të tij". Viti 2010 i librit (Kanban: Successful Evolutionary Change for Your Technology Business) u konfirmua te katalogu i TUM dhe te biblio.com |
| Kanban Guide: "Kanban is a strategy for optimizing the flow of value through a process"; tri praktika; elementet minimale të "Definition of Workflow": njësitë e punës, pika e fillimit dhe e mbarimit, fazat, si kontrollohet WIP, politikat, pritshmëria e nivelit të shërbimit (SLE), p.sh. "85% of work items will be finished in eight days or less". Kontrolli i WIP "should create a pull system"; punë e re niset vetëm kur ka sinjal kapaciteti. Katër matjet e detyrueshme: WIP (të nisura por të pambaruara), throughput (të mbaruara për njësi kohe), work item age (koha nga fillimi deri sot), cycle time (nga fillimi te mbarimi) | John Coleman & Daniel Vacanti (krijuesit; me kontribues të tjerë), The Kanban Guide, versioni 2025.5, 1 maj 2025 | U konfirmua te faqja kanbanguides.org (curl). Udhëzuesi është i shkollës së Vacanti-t, jo i Kanban University të Anderson-it; e emërtojmë me autorët e tij. Përkthimet janë tonat |
| Gjyqtarët italianë që marrin të njëjtën ngarkesë, por mbajnë më shumë gjykime njëkohësisht në vend që të punojnë me radhë për pak prej tyre, i mbarojnë çështjet më vonë; efekti është shkakësor (efekte fikse për gjyqtarin, shorti që ua cakton çështjet); cilësia e vendimeve (përqindja e apelimeve) nuk dëmtohet | Decio Coviello, Andrea Ichino & Nicola Persico, "The Inefficiency of Worker Time Use", Journal of the European Economic Association 13(5), 2015, 906–947 | Abstrakti u konfirmua te RePEc/IDEAS; versioni i punës NBER 16502 (2010) te NBER. Që të dhënat vijnë nga gjykata e punës e Milanos e thotë Bray et al. (2016); nuk e shkruajmë në faqe |
| Gjykata e Apelit për çështjet e punës në Romë: gjashtë gjyqtarë të një seksioni ("collegio") kaluan më 1 janar 2011 nga FIFO sipas seancës në FIFO sipas çështjes (në formë të lehtësuar: vlerësojnë sa seanca do t'i duhen një çështjeje të re dhe i caktojnë që në fillim, të paktën gjashtë javë larg njëra-tjetrës); 44 gjyqtarë në katër seksionet e tjera si kontroll. Të dhënat: çështjet e depozituara nga 7 korrik 2005 deri më 31 dhjetor 2014. Ndërhyrja zvogëlon numrin e çështjeve të hapura që gjyqtarët mbajnë njëkohësisht | Robert L. Bray, Decio Coviello, Andrea Ichino & Nicola Persico, "Multitasking, Multiarmed Bandits, and the Italian Judiciary", Manufacturing & Service Operations Management 18(4), 2016, 545–558 | Abstrakti i botimit u konfirmua te Crossref; detajet te versioni i punës i 23 marsit 2016 (PDF, faqja e Pietro Ichino-s; SSRN 2631929). Faqja e INFORMS nuk u hap |
| Kohëzgjatja mesatare e çështjeve −12% krahasuar me grupin e kontrollit; −111 ditë për çështje (48 ditë për seancë × 2,3 seanca); vendimet u apeluan më rrallë (−3,8 sipas abstraktit; koeficienti është në pikë përqindjeje, kur vetëm 8,7% e çështjeve të gjyqtarëve të trajtuar apeloheshin) | Po aty | 12% te abstrakti dhe te teksti; 111 ditë vetëm te versioni i punës. Te faqja shkruajmë vetëm "u apeluan më rrallë", pa shifër |
| Gjyqtarët nuk u zgjodhën rastësisht: kryetarja e seksionit, pas një seminari në tetor 2009, u shkroi autorëve për mundësinë e ndryshimit dhe bindi pesë gjyqtarët e tjerë. Studim me diferencë në diferenca; test placebo me 10.000 caktime të rastësishme të gjyqtarëve; në atë periudhë i gjithë sistemi gjyqësor italian u ngadalësua, prandaj krahasimi bëhet me grupin e kontrollit | Po aty, seksionet 4.1, 5 dhe 6 | U konfirmua te versioni i punës. Prandaj te shënimi: "Nuk është caktim i rastësishëm" |
| Sjøberg (2018): më shumë WIP lidhej edhe me produktivitet më të lartë | Nr. 58, burimi `littlelaw-sjoberg-2018` | Vetëm si referencë te shënimi i faqes 6 ("shih Nr. 58"); nuk e përsërisim |

## Çfarë nuk hyri

- Taiichi Ohno, Toyota Production System (1988): libri nuk u pa (as te Internet Archive). Rrëfimi që ia atribuon idenë e
  kanban-it supermarketeve amerikane dhe "gjashtë rregullat e kanban-it" qarkullojnë vetëm te blogje dhe përmbledhje,
  me formulime që nuk përputhen. Në shënimin e faqes 3 themi që nuk e pamë dhe ndjekim historinë e Toyota-s.
- Përhapja e kanban-it në gjithë Toyota-n në 1962: vetëm te burime dytësore (një kapitull libri që citon Tolliday-n, një
  artikull gjerman me përkthim të fjalëve të Ohno-s); faqja e Toyota-s nuk u gjet.
- Sugimori et al., "Toyota production system and Kanban system", International Journal of Production Research (1977):
  u konfirmuan vetëm të dhënat bibliografike dhe abstrakti sipas përmbledhjeve; teksti nuk u pa.
- Kursimet e Lockheed-it (250.000 dollarë në vit, 60.000 këmbë katrore magazinë): Toyota i jep sipas reportazhit të 1954,
  jo si matje; i lamë jashtë.
- Rasti i Microsoft XIT me shifrat (koha e kalimit nga 5,5 muaj në 12 ditë, ritmi +230%, 98% në kohë): vjen nga
  përmbledhja e Kanban University (2023), organizata e Anderson-it, pa studim të cituar; një recension i librit jep 14
  ditë. Sipas mësimit (1) nuk hynë; në faqe mbetet vetëm historia sipas Anderson-it.
- Pesë "core properties" ose gjashtë praktikat e metodës së Anderson-it: vetëm te përmbledhje (Xebia); libri nuk u pa.
  Për elementet e një sistemi kanban përdorëm Kanban Guide.
- Fjalori i LEI për kanban-in (kanban prodhimi dhe tërheqjeje, "6 rules" vetëm në figurë): u lexua, por nuk hyri për vend.
- Diwas KC, "Does Multitasking Improve Performance?", M&SOM 16(2), 2014 (mjekët e urgjencës): u konfirmua vetëm abstrakti;
  e lamë jashtë për vend.
- Shifrat e Bray et al. për stokun e çështjeve (87, 88 ose 217 çështje më pak, sipas metodës) dhe +0,07 çështje në ditë:
  versioni i punës jep vlera të ndryshme në vende të ndryshme; nuk hynë. Edhe "nga nëntë muaj në gjashtë javë mes
  seancave" (pohim i autorëve) mbeti jashtë, sepse mesataret e tabelës 4 (264–356 ditë) matin edhe pritjen deri te
  seanca e parë dhe do ta ngatërronin lexuesin.
- Bray et al.: "+1% juggling, +2% kohë" si përmbledhje e punës së Coviello et al. për Milanon: vetëm në përmbledhjen e
  Bray-t; abstrakti i Coviello et al. nuk e jep shifrën.
- Sjøberg, Johnsen & Solberg (2012) dhe Sjøberg (2018), ligji i Little-it dhe CONWIP: janë te Nr. 58; nuk përsëriten.
  Takt-i (Nr. 53), VSM (Nr. 56) dhe tetë humbjet (Nr. 5) po ashtu.
- Shqipëria: nuk u gjet asnjë shifër për kanban-in ose kufijtë e punës në proces.

## Çfarë është editoriale

- Leximet te kutitë "Leximi ynë": shtytja e çon punën tutje sepse ka mbaruar, tërheqja e nis sepse ka vend; kufiri nuk e
  bëri askënd më të shpejtë, por e bëri radhën të dukshme; një tabelë pa kufij është fotografi e mbingarkesës; askush nuk
  punoi më shumë, gjyqtarët nisën më pak njëkohësisht.
- Zinxhiri i faqes 5 është përmbledhje e jona e elementeve të Kanban Guide.
- Shembulli hipotetik i tabelës së një sporteli kthimesh te faqja 7: numrat janë të shpikur.
- Karta te faqja 8 është praktikë e redaksisë, sipas Kanban Guide, Hopp & Spearman dhe ekipit të BBC Worldwide; këshilla
  "nise kufirin afër numrit të sotëm dhe uleje pas një rishikimi" është e jona, e frymëzuar nga ekipi që i caktoi kufijtë
  sipas pikave të ngushta dhe i ndryshoi.
- Lidhja me esenë "Dhjetë minuta para turnit" (faqja 7, `ten-minutes-before-the-shift`): eseja flet për takimin para
  turnit, për punët e hapura që trashëgohen, për "dy ose tri përparësi, jo dhjetë" dhe për emrin te çdo punë e hapur; kjo
  i përgjigjet takimit ditor para tabelës te BBC Worldwide. Nuk ka të dhëna për kanban.
- Lidhja me mjetin Shift Handover (faqja 8, `/tools/shift-handover/`): asnjë mjet i faqes nuk është tabelë kanban; mjeti
  më i afërt është ky, sepse mban punët e hapura me pronar dhe afat dhe i kalon vetë te turni tjetër, si kartat e
  bllokuara dhe punët e hapura të kartës.
