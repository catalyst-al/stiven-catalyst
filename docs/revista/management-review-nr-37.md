# Management Review Nr. 37 · Dashboard-et që përdoren

Blloku: KPI. Të dhënat janë te `lib/weekly/issues/37.js`.

Dy burime u lexuan të plota: artikulli i Velcu-Laitinen-it dhe Yigitbasioglu-s (2012, PDF-ja e revistës, 20 faqe) dhe
specifikimi i grafikut bullet i Stephen Few-t (Perceptual Edge, rishikimi i 10 tetorit 2013). Postimi i Few-t i 2017 te
blogu i tij u lexua drejtpërdrejt; aty ai citon edhe përkufizimin e vet të 2004, ndaj artikulli origjinal i Intelligent
Enterprise nuk u hap. Libri i Few-t (Information Dashboard Design, 2006; botimi i dytë 2013) nuk u pa: mbështetemi te
recensioni i UXmatters (2007), te përmbledhjet e The Data School dhe te katalogët e bibliotekave. Për Accenture dhe Qlik
u hap njoftimi për shtyp i Qlik-ut; raporti i plotë jo. Raporti i Forrester-it për Tableau (PDF) dhe faqet e Tableau-s
nuk hapen nga ambienti i punës (403): shifrat u konfirmuan te Help Net Security, WorkLife dhe te teksti i njoftimit për
shtyp në PR Newswire (riprodhuar nga StockTitan). Abstrakti i rishikimit të Dowding-ut dhe të tjerëve (2015) u lexua
te depoja White Rose. Të dyja anketat për aftësitë me të dhënat janë porositur nga firma që shesin programe analitike
(Qlik, Tableau) dhe mbështeten te vetëdeklarimet. Studimi finlandez është i vogël (145 përgjigje, 36 përdorues) dhe
jep lidhje, jo shkaqe. Për Shqipërinë nuk u gjet asnjë shifër për përdorimin e dashboard-eve ose për aftësitë me të dhënat
në punë.

## Tabela e fakteve

| Shifra ose fakti | Burimi | Statusi |
|---|---|---|
| Përkufizimi i 2004: "A dashboard is a visual display of the most important information needed to achieve one or more objectives that has been consolidated on a single computer screen so it can be monitored at a glance." (Dashboard-i është një paraqitje vizuale e informacionit më të rëndësishëm që duhet për të arritur një ose më shumë objektiva, e përmbledhur në një ekran të vetëm kompjuteri që të ndiqet me një shikim.) Artikulli: "Dashboard Confusion", Intelligent Enterprise, 20 mars 2004 | Stephen Few, "There's Nothing Mere About Semantics", Perceptual Edge (blog), 13 dhjetor 2017 | U lexua te postimi i vetë Few-t, që e citon përkufizimin e 2004. Data e artikullit te Intelligent Enterprise vetëm te rezultatet e kërkimit (InformationWeek, Dundas); artikulli nuk u hap. Përkthimi është i yni |
| Përkufizimi i mprehur, që Few e përdor në kursin e tij: "A dashboard is a predominantly visual information display that people use to rapidly monitor current conditions that require a timely response to fulfill a specific role." (paraqitje kryesisht vizuale që njerëzit e përdorin për të ndjekur shpejt gjendjen e çastit, që kërkon përgjigje në kohë për të përmbushur një rol të caktuar) | Po aty | U lexua te postimi |
| "Only 2 of the 28 examples of displays that appear in the book qualify as rapid-monitoring displays." Libri: The Big Book of Dashboards (Steve Wexler, Jeffrey Shaffer, Andy Cotgreave). Few shkruan se projektimi duhet të ndryshojë sipas mënyrës dhe qëllimit të përdorimit të informacionit, dhe se zgjedhja e asaj që shkon në dashboard dhe jo në raporte të tjera, si raportet mujore, është sfidë kryesore | Po aty | U lexua te postimi. Është gjykimi i Few-t për një libër tjetër, jo matje; e themi kështu te shënimi |
| Libri: Stephen Few, Information Dashboard Design: The Effective Visual Communication of Data, O'Reilly Media, janar 2006, 211 faqe; kapitulli 3: "Thirteen Common Mistakes in Dashboard Design"; kapitulli 6 paraqet grafikët bullet dhe sparklines. Botimi i dytë: Information Dashboard Design: Displaying Data for At-a-Glance Monitoring, Analytics Press, 2013, me kapituj të rinj për vlerësimin e kërkesave, grafikët bullet dhe sparklines, dhe procesin e dizajnit | Few, 2006 dhe 2013 | Botimi i parë te recensioni i UXmatters (Pabini Gabriel-Petit, 9 prill 2007); botimi i dytë te katalogë bibliotekash dhe shitës librash (ISBN 9781938377006). Libri nuk u pa |
| Dashboard-i duhet të mos kërkojë lëvizje poshtë ose ndërrim ekrani, sepse kujtesa afatshkurtër është e kufizuar dhe të parët e gjithçkaje njëherësh është një nga përfitimet kryesore; ndiqet me një shikim, me përmbledhje dhe përjashtime | Po aty | Te recensioni i UXmatters dhe te përmbledhja e The Data School (Anh Vu); formulimi i librit nuk u pa |
| Trembëdhjetë gabimet: kalimi i kufijve të një ekrani; kontekst i pamjaftueshëm për të dhënat; detaje ose saktësi e tepruar; masë e mangët (deficient measure); mjete paraqitjeje të papërshtatshme; larmi pa kuptim; mjete paraqitjeje të projektuara keq; kodim i pasaktë i sasive; renditje e keqe; theksim i dobët ose aspak i asaj që ka rëndësi; rrëmujë me efekte vizuale; ngjyra të keqpërdorura ose të tepërta; pamje jotërheqëse | Po aty | Lista te The Data School (dy postime) dhe te recensioni i UXmatters, që i grupon gabimet e dizajnit vizual. Emërtimet ndryshojnë pak. Te numri japim pesë; shpjegimi "pa objektiv, pa krahasim" për kontekstin është i yni |
| Grafiku bullet u zhvillua për të zëvendësuar matësit dhe kadranët që përdoren shpesh në dashboard-e; forma lineare jep shumë informacion në pak hapësirë dhe lexohet më me efikasitet se matësit radialë. Pesë pjesë: etiketa; shkalla sasiore në një bosht linear; masa kryesore; një ose dy masa krahasuese (opsionale); dy deri në pesë zona që tregojnë gjendjen cilësore (opsionale) | Stephen Few, Bullet Graph Design Specification, Perceptual Edge, rishikimi i fundit 10 tetor 2013 (© 2006–2013) | U lexua PDF-ja e plotë |
| Shkalla zakonisht nis nga zero; masa kryesore është shirit, i zi, me trashësi rreth 1/3 e hapësirës; masa krahasuese është vijë e shkurtër pingul me grafikun; zonat cilësore të paktën dy, maksimumi pesë, "ideally" tri; zonat kodohen me intensitete të një ngjyre, nga e errët (gjendje e dobët) te e çelët (gjendje e mirë), në vend të ngjyrave të ndryshme që mund të mos dallohen nga njerëzit me daltonizëm | Po aty | U lexua PDF-ja. Është rekomandim i autorit, jo standard i provuar me eksperiment |
| Anketa: 9.000 punonjës me kohë të plotë në organizata me 50+ punonjës, në Mbretërinë e Bashkuar, SHBA, Gjermani, Francë, Singapor, Suedi, Japoni, Australi dhe Indi; nga Opinium për The Data Literacy Project, shtator 2019. 87% i shohin të dhënat si pasuri; 25% ndihen plotësisht të përgatitur për t'i përdorur; 21% janë të sigurt në aftësitë e tyre me të dhënat; 37% u besojnë më shumë vendimeve kur mbështeten te të dhënat; 48% shpesh mbështeten te "ndjesia" në vend të të dhënave; 74% ndihen të rënduar ose të pakënaqur kur punojnë me të dhëna; 36% do të gjenin një mënyrë tjetër për ta kryer detyrën pa të dhëna; 61% thonë se mbingarkesa me të dhëna ka shtuar stresin | Accenture & Qlik, The Human Impact of Data Literacy, njoftimi për shtyp i Qlik-ut; data 22 janar 2020 sipas Accenture Newsroom | U lexua njoftimi i Qlik-ut. 21%, 87%, 37% dhe "tre të katërtat" edhe te faqja e The Data Literacy Project (Jordan Morrow, Qlik); data te rezultati i kërkimit për Accenture Newsroom. Vetëdeklarime; porositur nga Qlik, që shet programe analitike. Raporti i plotë nuk u pa. Te grafiku japim katër shifra (87%, 74%, 48%, 21%); 25%, 37%, 36% dhe 61% nuk hynë te numri |
| Mbi 2.000 drejtues, vendimmarrës dhe kontribues individualë në 10 vende (Australi, Brazil, Kanada, Francë, Gjermani, Japoni, Meksikë, Singapor, Mbretëri e Bashkuar, SHBA), në kompani globale me 500+ punonjës. 82% e vendimmarrësve presin aftësi bazë me të dhënat nga punonjësit në çdo departament; vetëm 39% e organizatave ua ofrojnë trajnimin për të dhënat të gjithë punonjësve | Forrester Consulting, me porosi të Tableau, "Building Data Literacy: The Key To Better Decisions, Greater Productivity, And Data-Driven Organizations", 2022; njoftimi i Tableau, 15 mars 2022 | Te Help Net Security (17 mars 2022), WorkLife (25 mars 2022) dhe te teksti i njoftimit në PR Newswire (StockTitan). PDF-ja e Forrester-it dhe faqet e Tableau-s japin 403. Datat e anketës nuk jepen. Porositur nga Tableau |
| Anketa: kompani finlandeze me qarkullim të paktën 1 milion euro (viti financiar 2010) dhe të paktën 50 punonjës, nga baza Fonecta ProfinderB2B: 941 kompani; 90 email-e u kthyen, mbetën 851. Të anketuarit: "Sales Manager" ose "Sales Vice President"; email-et në fund të 2010; 145 përgjigje (17%), 120 nga zëvendëspresidentë të shitjeve dhe 25 nga menaxherë shitjesh | Oana Velcu-Laitinen & Ogan M. Yigitbasioglu, "The Use of Dashboards in Performance Management: Evidence from Sales Managers", The International Journal of Digital Accounting Research 12, 2012, 39–58 | U lexua PDF-ja e plotë (DOI 10.4192/1577-8517-v12_2). Mostër e vogël; autorët e quajnë vetë kufizim kryesor |
| Nga 145, vetëm 36 përdornin dashboard, prej tyre 7 të ndërtuar në Excel; nga 109 jopërdoruesit, 62 përdornin "mjete të tjera raportimi" që e bëjnë dashboard-in të panevojshëm. "Rreth një e katërta" | Po aty | U lexua. 47 (109 − 62) është llogaritja jonë: jopërdoruesit që nuk përmendën mjete të tjera; e themi te shënimi |
| Katër qëllime: ndjekja, zgjidhja e problemeve, justifikimi (rationalizing) i vendimeve, komunikimi dhe njëtrajtshmëria. Mesataret në shkallën 1–7: komunikimi dhe njëtrajtshmëria 5,28; ndjekja 5,15; justifikimi 5,04; zgjidhja e problemeve 4,81. Cilësia e të dhënave kishte lidhje pozitive dhe domethënëse me përdorimet (N = 36); autorët e quajnë "critical driver" të përdorimit | Po aty | U lexua (tabelat 2 dhe 3). Lidhje, jo shkaqe |
| Rishikim i literaturës për 1996–2012 në shtatë baza të dhënash: 122 artikuj të plotë, 11 të përfshirë; dallime të mëdha në mjedis, përdorues dhe tregues. Aty ku dashboard-et ishin lehtësisht të arritshme për klinicistët (p.sh. si mbrojtës ekrani), përdorimi i tyre lidhej me procese më të mira kujdesi dhe rezultate më të mira për pacientët. Autorët kërkojnë studime më të mira | Dawn Dowding et al., "Dashboards for improving patient care: Review of the literature", International Journal of Medical Informatics 84(2), 2015, 87–100 | U lexua abstrakti te depoja White Rose (eprints.whiterose.ac.uk/84905). Lidhje; provat janë të kufizuara |

## Çfarë nuk hyri

- Sarikaya, Correll, Bartram, Tory & Fisher, "What Do We Talk About When We Talk About Dashboards?", IEEE TVCG 25(1),
  2019: u konfirmuan autorët, revista dhe qëllimi (hapësira e dizajnit dhe llojet kryesore të dashboard-eve), por jo
  numri i dashboard-eve të analizuar (83 te disa përmbledhje) dhe as emrat e llojeve: PDF-ja te Tableau jep 403.
- Pauwels et al., "Dashboards as a Service", Journal of Service Research 12(2), 2009: vetëm abstrakti (pesë faza të
  ndërtimit të dashboard-it); katër qëllimet (njëtrajtshmëria, ndjekja, planifikimi, komunikimi) që i atribuohen nuk u
  panë te burimi, vetëm te Velcu-Laitinen & Yigitbasioglu që i konfirmojnë "qëllimet e Pauwels-it".
- Yigitbasioglu & Velcu, "A review of dashboards in performance management", International Journal of Accounting
  Information Systems 13(1), 2012: rishikim pa të dhëna empirike; e lamë që burimet të mos kalojnë tetë.
- TDWI 2004 (Eckerson, 2006): rreth gjysma e 473 profesionistëve të BI-së përdornin dashboard dhe 17% po ndërtonin një.
  E pamë vetëm si citim te Velcu-Laitinen & Yigitbasioglu; mostra është e profesionistëve të BI-së, jo e menaxherëve.
- Forrester/Tableau: "40% e punonjësve thonë se u jepen aftësitë që u kërkohen" (faqja e Tableau) dhe "47% thanë se
  punëdhënësi u ofroi trajnim" (te një përmbledhje): shifrat ndryshojnë mes burimeve dhe faqja e Tableau nuk u hap.
  "Afro 70% e punonjësve do të përdorin shumë të dhëna deri në 2025, nga 40% në 2018" është parashikim; nuk na duhet.
- Accenture & Qlik: humbja prej 43 orësh (më shumë se pesë ditë pune) për punonjës në vit dhe humbjet sipas vendeve
  (p.sh. 23,7 miliardë dollarë në Gjermani) janë vlerësime të modeluara nga vetëdeklarimet, jo matje; 31% morën të paktën
  një ditë pushim mjekësor për stres nga informacioni, të dhënat ose teknologjia. I lamë jashtë.
- OECD, Survey of Adult Skills 2023 (PIAAC): mesatarisht 25% e të rriturve në vendet e OECD-së kanë aftësi të ulëta
  numerike (nga 10% në Japoni te 56% në Kili); Gjermania 273 pikë në numeracy, mbi mesataren. Faqja e OECD-së jep 403
  dhe përqindja për Gjermaninë nuk u konfirmua; Shqipëria nuk merr pjesë. Temë afër, por jo për dashboard-et.
- Few, "Dashboard Confusion Revisited" (2007) dhe termi "faceted analytical display": vetëm te një përmbledhje e kërkimit.
- Few për sparklines dhe për "preattentive attributes": nuk u panë te burimi; nuk i përdorëm.
- Shifra që qarkullojnë si "vetëm X% e dashboard-eve hapen pas muajit të parë" ose "Gartner: përdorimi i BI-së mbetet
  nën 30%": nuk u gjet burim origjinal me mostër dhe metodë.
- Shqipëria: nuk u gjet asnjë studim për përdorimin e dashboard-eve ose për aftësitë me të dhënat te punonjësit.
- Treguesit paraprijës (Nr. 2), pak qëllime (Nr. 7), OKR dhe KPI (Nr. 12), Balanced Scorecard (Nr. 17), vendimet me të
  dhëna dhe ndjesia kundrejt algoritmit (Nr. 20) dhe cilësia e të dhënave (Nr. 30): nuk përsëriten.

## Çfarë është editoriale

- Leximet te kutitë "Leximi ynë": një ekran plot grafikë nuk është ende dashboard; dashboard-et i lexojnë njerëzit, jo
  programet; një dashboard që duhet kërkuar rrallë shikohet.
- Shembulli hipotetik i nisjeve në kohë te faqja 5 është i shpikur (91%, objektivi 95%, zonat 85% dhe 95%).
- Tri hapat te faqja 7 (emërto përdoruesin dhe vendimin, numëro veprimet, hiq atë që nuk u përdor) janë propozim i
  redaksisë, jo metodë e provuar.
- Karta e dashboard-it te faqja 8 është praktikë e redaksisë, sipas përkufizimit të Few-t dhe librit të tij.
