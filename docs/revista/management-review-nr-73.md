# Management Review Nr. 73 · Kostoja për njësi: Time-Driven ABC

Blloku: KPI. Të dhënat janë te `lib/weekly/issues/73.js`.

Kontrolli i dytë, te tekstet e plota (11 tetor 2026). Në punën e parë asnjë burim nuk u hap (WebFetch ktheu gabim DNS,
curl u ndal nga proxy-ja) dhe çdo fakt u kontrollua te copat e kërkimit. Në kontrollin e dytë curl kaloi dhe u hapën të
plota katër burime: Cooper & Kaplan (1988), Kaplan & Anderson (2004) dhe Kaplan & Porter (2011), teksti i artikujve brenda
faqeve të hbr.org (pa numra faqesh të shtypit; tabelat e shembullit të 2004 u lexuan te pjesa e HBS Working Knowledge
"Rethinking Activity-Based Costing"); dhe punimi 04-045 (PDF-ja e HBS, 37 faqe, "November 2003", përmes Wayback Machine).
Këtyre katërve iu hoq `via`. Ittner et al. (2002) dhe Keel et al. (2017) nuk u hapën (Wiley dhe ScienceDirect 403); u
lexuan drejtpërdrejt abstraktet (IDEAS/RePEc; PubMed dhe ScienceDirect përmes Wayback), dhe `via` mbetet.

Teksti i plotë ndryshoi këto, të riprintuara në të tri gjuhët: (1) Kaplan & Anderson shkruajnë "many managers who have
tried to implement ABC… on any significant scale have abandoned the attempt"; faqja 3 thoshte "shumë drejtues" (sipas
përmbledhjes së HBR Store): tani "menaxherë që e kishin provuar"; (2) tarifat Time-Driven (6,40 $, 35,20 $, 40 $) janë të
shtypura në artikull, jo llogaritje jona: shënimi i faqes 4 u ndreq; (3) kapaciteti i papërdorur (121.400 minuta, 97.120
$) është te punimi 04-045 (f. 8, ku "hours" është gabim shtypi për minuta): shënimi i faqes 7 u ndreq, dhe vetëm pjesët e
700.000 minutave mbeten llogaritje jona; (4) shtatë hapat e Kaplan-it dhe Porter-it mbarojnë te kostoja e plotë e
kujdesit, jo te tarifa e burimit: hyrja e faqes 6 u plotësua; (5) shënimet e faqeve 3 dhe 6 nuk thonë më se burimet u panë
vetëm përmes abstrakteve. Shifrat e shembullit u konfirmuan të gjitha te teksti dhe përputhen aritmetikisht (49.000 × 8 +
1.400 × 44 + 2.500 × 50 = 578.600 minuta; 578.600 × 0,80 $ = 462.880 $; 560.000 $ × 70% / 49.000 = 8 $). Shembulli është
ilustrim i autorëve, jo një kompani e matur; kjo thuhet në faqe. Për Shqipërinë dhe Gjermaninë nuk u kërkua dhe nuk hyn
asnjë shifër.

Kontrolli i dytë, te tekstet e plota (12 tetor 2026), për dy burimet që mbanin `via`. Asnjëri nuk u hap: Ittner et al.
(2002) nuk ka kopje të hapur (Unpaywall, OpenAlex, Semantic Scholar: "closed"; Wiley 403); Keel et al. (2017) është me
qasje të hapur te ScienceDirect, por ScienceDirect, ScienceOpen dhe arkivi i Karolinska kthyen 403 ose faqe sfide, dhe
Europe PMC nuk e ka tekstin. U lexua e plotë teza e doktoraturës e autorit të parë (George Keel, "Counting what counts",
Karolinska Institutet 2020, PDF te openarchive.ki.se), ku studimi I është ky rishikim, i përmbledhur (f. 29–31), por pa
artikullin e ribotuar. Teza konfirmon: 25 artikuj në analizë (nga 780 regjistrime); "none of the 25 applications reported
a tight adherence to the seven-step … approach to TDABC. However, all applications reflected the seven-step approach in
some way"; "no article reported cases where TDABC influenced reimbursement schemes". Kjo e mbështet fjalinë e faqes 6.
`via` e Keel-it bëhet "Abstract and the first author's thesis (2020)"; Ittner mban të vetën. Shënimi i faqes 6 thotë tani
"nuk u lexuan të plotë" në vend të "vetëm te abstraktet". Asnjë shifër e shtypur nuk doli ndryshe.

Shënim (27 tetor 2026), sipas historisë së git-it: kontrolli i dytë i 11 tetorit u bë para se numri të dilte online.
Ndryshimet e tij u bënë në degën e punës (commit 3565e02a, 11 tetor 2026) dhe numri hyri në main, nga ku botohet faqja,
vetëm me bashkimin #177 (7b43e7c3, 11 tetor 2026, ora 20:33): versioni i parë online i ka tashmë. Prandaj këto ndryshime
nuk kanë shënim korrigjimi dhe nuk e çojnë numrin te `checked.issues` (lib/weekly/common.js). Numri ndryshoi edhe më 12
tetor 2026, pasi kishte dalë online (de0466bb), dhe për këtë është te `checked.issues` dhe e thotë nën përmbledhjen e
vet.

## Tabela e fakteve

| Shifra ose fakti | Burimi | Statusi |
|---|---|---|
| Sistemet tradicionale të kostos e shtrembërojnë informacionin e kostos sepse u japin punës direkte dhe materialeve më shumë peshë se operacioneve mbështetëse të fabrikës; ABC i çon kostot e përgjithshme te aktivitetet mbështetëse dhe pastaj te produktet | Robin Cooper & Robert S. Kaplan, "Measure Costs Right: Make the Right Decisions", Harvard Business Review 66(5), shtator–tetor 1988, f. 96–103 | U konfirmua te teksti i plotë (hbr.org, "September 1988"): "most companies still allocate these rising overhead and support costs by their diminishing direct labor base"; "attributing factory overhead, corporate overhead, and other organizational resources, first to activities and then to the products". "U japin më shumë peshë" është formulimi ynë. Vëllimi 66(5) dhe f. 96–103 sipas të dhënave bibliografike (HBR Store: 8 faqe). Faqja 3 |
| Kaplan & Anderson, "Time-Driven Activity-Based Costing", HBR 82(11), nëntor 2004, f. 131–138 (PMID 15559451) | PubMed, HBR Store, SciRP | U konfirmua te teksti i plotë (hbr.org) dhe te PubMed ("82(11):131-8, 150") |
| Drejtuesit që provuan ABC në shkallë të gjerë shpesh e braktisën "in the face of rising costs and employee irritation"; qasja e re: drejtuesit vlerësojnë kërkesën për burime të çdo transaksioni, produkti ose klienti në vend të anketave të kushtueshme me punonjësit | Kaplan & Anderson (2004), abstrakti | U konfirmua te teksti i plotë dhe **u korrigjua**: artikulli thotë "many managers who have tried to implement ABC in their organizations on any significant scale have abandoned the attempt in the face of rising costs and employee irritation"; "executives" është vetëm te përmbledhja e HBR-së. Faqja 3 thotë tani "shumë menaxherë që e kishin provuar në shkallë të gjerë" |
| Kur pyeten për kohën në aktivitete, punonjësit "invariably report percentages that add up to 100"; koha bosh ose e papërdorur nuk shfaqet, dhe tarifat dalin më të larta | Kaplan & Anderson (2004), abstrakti; punimi 04-045 | U konfirmua te teksti i plotë ("they invariably report percentages that add up to 100") dhe te punimi 04-045, f. 5 ("add up to 100%"). Faqja 3, karta "Gjithmonë 100%" |
| Problemet e ABC-së tradicionale: kosto të larta për intervistat dhe anketat; ndarje subjektive të kohës, të kushtueshme për t'u verifikuar; vështirë të mbahet e përditësuar kur ndryshojnë proceset; teorikisht e pasaktë sepse e shtyp rolin e kapacitetit të papërdorur | Robert S. Kaplan & Steven R. Anderson, "Time-Driven Activity-Based Costing", HBS Working Paper 04-045 (SSRN 485443) | U konfirmua te PDF-ja e punimit (abstrakti; f. 5: "theoretically incorrect, by suppressing the role for unused capacity"). Viti 2003 sipas faqes së titullit ("November 2003"). Grupimi në tri karta është i redaksisë |
| Shembulli: departament i shërbimit të klientit me shpenzime 560.000 $ në tremujor (personeli, mbikëqyrja, IT, telekomunikacioni dhe burime të tjera fikse); 49.000 porosi, 1.400 pyetje klientësh, 2.500 kontrolle krediti | Kaplan & Anderson (2004) | U konfirmua te teksti i plotë: "total expenses (the cost of the personnel, management, IT, telecommunications, and other fixed resources) amount to $560,000"; "49,000 orders, 1,400 inquiries, and 2,500 credit checks". Punimi 04-045 përdor vëllime të tjera (f. 3: 9.800 porosi, 280 ankesa, 500 kontrolle), por të njëjtat totale (578.600 minuta, 462.880 $, 83%). Faqet 4, 5 dhe 7 |
| ABC me anketë: koha e stafit 70% porosi, 10% pyetje, 20% kontrolle krediti; tarifat 8,00 $ për porosi, 40 $ për pyetje, 44,80 $ për kontroll krediti | Po aty | U konfirmua te teksti i plotë (70%, 10%, 20%; 8 $, 40 $, 44,80 $; tabela: 392.000 $, 56.000 $, 112.000 $). 44 $ në disa kopje dytësore është gabim transkriptimi. Grafiku i faqes 4 |
| Kapaciteti praktik 700.000 minuta në tremujor; kostoja për minutë 560.000 $ / 700.000 = 0,80 $; kohët për njësi 8, 44 dhe 50 minuta | Po aty | U konfirmua te teksti i plotë ("28 reps… 31,680 minutes per quarter… about 80%… 700,000 minutes… ($0.80)"; 8, 44 dhe 50 minuta). Faqet 4 dhe 5 |
| Tarifat Time-Driven 6,40 $, 35,20 $ dhe 40,00 $ | Kaplan & Anderson (2004) | **U korrigjua statusi**: tarifat janë te artikulli, jo llogaritje jona: "$6.40 (8 multiplied by $0.80) for processing customer orders, $35.20 (44 by $0.80)…" dhe 40 $. Shënimi i faqes 4 thotë tani "edhe tarifat Time-Driven janë të burimit". Grafiku i faqes 4 |
| Minutat e përdorura 578.600, kostoja e ngarkuar 462.880 $ (313.600 $ porositë, 49.280 $ pyetjet, 100.000 $ kontrollet); vetëm 83% e kapacitetit praktik (578.600 nga 700.000) u përdor për punë produktive | Po aty | U konfirmua te teksti i plotë: "only 83% of the practical capacity (578,600 of the 700,000 minutes)"; tabela: 313.600 $, 49.280 $, 100.000 $, gjithsej 462.880 $. Kopertina, faqja 7 |
| Pjesët e 700.000 minutave: porositë 56%, kontrollet 17,9%, pyetjet 8,8%, të papërdorura 17,3% (121.400 minuta); kostoja e minutave të papërdorura rreth 97.120 $ | Punimi 04-045, f. 8 (121.400 minuta, 97.120 $); pjesët: llogaritje e redaksisë | 121.400 minutat dhe 97.120 $ janë te punimi 04-045, f. 8 ("the quantity (121,400 hours) and cost ($97,120) of the unused capacity"; "hours" është gabim shtypi): **u ndreq** shënimi i faqes 7. Pjesët (56% / 17,9% / 8,8% / 17,3%) mbeten llogaritje jona; shënohet në faqe. Grafiku i faqes 7 |
| Kapaciteti i papërdorur nuk u shpërndahet produkteve dhe klientëve, por raportohet, që drejtuesit të veprojnë mbi kapacitetin e tepërt (në vend që ta përditësojnë pafundësisht modelin) | Kaplan & Anderson (2004) | U konfirmua te teksti i plotë ("Managers can review the cost of the unused capacity and contemplate actions"); fjalët e revistës janë tonat |
| Rregull praktik: kapaciteti praktik shpesh vlerësohet si përqindje e kapacitetit teorik, "say 80% or 85%"; për njerëzit rreth 80%, me 20% për pushimet, ardhjen dhe ikjen, komunikimin dhe trajnimin; për makinat, rënie nga mirëmbajtja, riparimet dhe luhatjet e planifikimit; ose shqyrtim i niveleve të kaluara të aktivitetit | Punimi 04-045; përmbledhjet e Kaplan & Anderson (2004, 2007) | U konfirmua te të dy tekstet, me një mospërputhje për makinat: punimi 04-045 (f. 6) "say 80% or 85%", 20% për njerëzit dhe 20% për makinat; artikulli i 2004 "80% to 85%… say 80%—to people… breaks, arrival and departure, communication, and training. For machines… a 15% differential". Në revistë nuk japim shifër të veçantë për makinat. Faqja 5 |
| Ekuacioni i kohës: paketimi = 0,5 minuta + 6,5 nëse kërkon trajtim të veçantë + 0,2 nëse dërgohet me avion; të dhënat janë zakonisht në sistemin ERP ku është futur porosia | Punimi 04-045 | U konfirmua te PDF-ja e punimit, f. 9: "Packaging Time = 0.5 + 6.5 (if special handling required) + 0.2 (if shipping by air)… typically already in the company's ERP system". Artikulli i HBR-së ka të njëjtin ekuacion me 2,0 për dërgesën me avion; në faqe themi "te punimi" dhe japim 0,2. Faqja 5 |
| Kaplan & Porter, "How to Solve the Cost Crisis in Health Care", HBR 89(9), shtator 2011, f. 46–61: sistemet e kostimit në shëndetësi kanë të meta që e bëjnë të pamundur matjen e saktë të kostos në nivel pacienti dhe gjendjeje mjekësore; TDABC mat koston përgjatë gjithë ciklit të kujdesit | Abstrakti te HBS; copat e artikullit | U konfirmua te teksti i plotë (hbr.org): "there is an almost complete lack of understanding of how much it costs to deliver patient care"; "over their full cycle of care". Faqet sipas PubMed (21939127): 46–52, 54, 56–61, jo 47–64 si shkruhej këtu. Faqja 6 |
| Shtatë hapat: hapi 1 zgjedhja e gjendjes mjekësore (me komplikimet dhe sëmundjet shoqëruese), hapi 2 zinxhiri i vlerës së kujdesit; më tej hartat e procesit, vlerësimet e kohës dhe tarifa e kapacitetit për çdo burim (kostoja / kapaciteti praktik) | Kaplan & Porter (2011) | U konfirmua te teksti i plotë, seksioni "The Cost Measurement Process": 1 "Select the medical condition"; 2 "Define the care delivery value chain"; 3 "Develop process maps"; 4 "Obtain time estimates for each process"; 5 "Estimate the cost of supplying patient care resources"; 6 "Estimate the capacity of each resource, and calculate the capacity cost rate"; 7 "Calculate the total cost of patient care". **U plotësua** hyrja e faqes 6: "nga zgjedhja e gjendjes, përmes vlerësimeve të kohës dhe tarifës për çdo burim, te kostoja e plotë e kujdesit" |
| Përdorimi i gjerë i ABC-së lidhet me nivele më të larta cilësie dhe përmirësime më të mëdha të kohës së ciklit dhe cilësisë; kosto më të ulëta prodhimi në mënyrë indirekte, përmes këtyre; mesatarisht pa lidhje domethënëse me kthimin nga aktivet (ROA); prova të dobëta se lidhja me fitimin varet nga karakteristikat operacionale të fabrikës | Christopher D. Ittner, William N. Lanen & David F. Larcker, Journal of Accounting Research 40(3), 2002, f. 711–726 | Artikulli nuk u hap (Wiley 403); abstrakti u lexua drejtpërdrejt te IDEAS/RePEc ("higher quality levels and greater improvements in cycle time and quality… no significant association with return on assets… weak evidence… contingent on the plant's operational characteristics"). Crossref: 40(3), 711–726, qershor 2002. Mostër prerjeje tërthore: lidhje, jo shkak. Madhësia e mostrës nuk u pa. Faqja 6 |
| Dy anketa britanike (1994, 1999) te kompanitë më të mëdha: norma e adoptimit të ABC-së ra pak, dhe u rrit në mënyrë domethënëse pjesa e atyre që nuk po e shqyrtonin ABC-në | John Innes, Falconer Mitchell & Donald Sinclair, Management Accounting Research 11(3), 2000, f. 349–362 | U konfirmua vetëm si përmbledhje në rishikime të mëvonshme, përmes kërkimit; abstrakti origjinal nuk u pa. U hoq nga faqja 6 që burimet të mos kalojnë gjashtë (faqja e burimeve mban gjashtë karta); shih "Çfarë nuk hyri" |
| Keel, Savage, Rafiq & Mazzocato, Health Policy 121(7), korrik 2017, f. 755–763: rishikim sistematik sipas PRISMA; TDABC mund të ndihmojë të kostohen proceset me efikasitet; roli te pagesat e paketuara (bundled payments) dhe koordinimi i kujdesit ende nuk është treguar; zbatimet ndryshonin, por përgjithësisht ndiqnin modelin me shtatë hapa, me shumë devijime që mund ta dëmtojnë saktësinë | Abstrakti dhe "highlights" (ScienceDirect, IDEAS); rishikime të mëvonshme për devijimet | Artikulli nuk u hap (ScienceDirect 403); abstrakti dhe "highlights" u lexuan te PubMed (28535996) dhe te kopja e ScienceDirect në Wayback ("can help to efficiently cost processes"; "ability to inform bundled payment reimbursement systems… remains to be demonstrated"; "applications varied but generally reflected the seven-step model"). Crossref: 121(7), 755–763. "Shumë studime u larguan nga shtatë hapat" mbështetet te përmbledhjet e mëvonshme ("many deviations") dhe, në kontrollin e dytë, te teza e autorit të parë (Keel 2020, f. 30): "none of the 25 applications reported a tight adherence to the seven-step health-care-specific approach to TDABC. However, all applications reflected the seven-step approach in some way"; edhe "no article reported cases where TDABC influenced reimbursement schemes" (f. 30). Artikulli vetë nuk u hap; `via` e thotë |

## Çfarë nuk hyri

- Lakorja e balenës: te rasti Kanthal (Kaplan, 1989) "20% e klientëve sollën 225% të fitimit, 10% humbën 125%"; dhe
  "20% më fitimprurës 150–300%" (Kaplan & Narayanan, 2001). Vetëm te burime dytësore; nuk u konfirmuan te origjinali.
- Cooper & Kaplan (1988): kostoja për njësi "from $4.39 to $77.64" te sistemi i ri (nga 5,34–8,88 $ te i vjetri), në një
  shembull me shtatë produkte: tani u konfirmua te teksti i plotë, por mbeti jashtë për vend.
- Kennedy & Affleck-Graves (2001), Journal of Management Accounting Research 13: firmat britanike që adoptuan ABC i
  kaluan firmat e krahasueshme me rreth 27% në tre vjet. Konfirmuar te abstrakti, por është kthim në bursë, dhe autorët
  vetë thonë se iniciativa të tjera të njëkohshme mund ta shpjegojnë; një rishikim i mëvonshëm e lexon ndryshe. U la
  jashtë që faqja 6 të mos japë një shkak që studimi nuk e provon.
- Innes, Mitchell & Sinclair (2000): rreshti për anketat britanike (adoptimi ra pak, më shumë firma nuk e shqyrtonin) u hoq nga faqja 6, sepse u pa vetëm te rishikime të mëvonshme dhe sepse faqja e burimeve mban gjashtë karta. Edhe "17,5% e 177 firmave përdornin ABC në 1999" dhe "36 firma prodhuese në 1994, vetëm 12 në 1999":
  vetëm te punime që e citojnë; nuk hynë.
- Keel et al. (2017): numri i studimeve të rishikuara (25, nga 780 regjistrime) u gjet në kontrollin e dytë vetëm te teza
  e autorit të parë (2020, f. 29), jo te artikulli; nuk hyn. Rishikimi i 2025 te Applied Health Economics and Health
  Policy (32 studime) është punim tjetër; nuk hyn.
- Kaplan & Porter (2011): rezultatet e pilotëve tani u panë te teksti (MD Anderson: "16% (11-minute) reduction in process
  time, a 12% decrease in costs for technical staff, and a 67% reduction in costs for professional staff"); nuk hynë për
  vend.
- Versioni i 2007 i shembullit (Cost Management dhe libri Time-Driven Activity-Based Costing, HBS Press, 2007): 567.000 $
  në tremujor, 22.500 minuta praktike për punonjës, 0,90 $ për minutë. E përmendim vetëm si "versionet e mëvonshme
  përdorin shifra pak të ndryshme". Libri nuk u pa dhe nuk hyn si burim.
- 28 punonjës dhe 31.680 minuta teorike për punonjës në tremujor te shembulli i 2004: tani u konfirmuan te teksti; në
  faqe themi vetëm "rreth 80% e kohës së paguar" (25.000 / 31.680 ≈ 79%).
- Tremujori i dytë i shembullit (51.000 porosi, 1.150 pyetje, 2.700 kontrolle; 408.000 minuta, 326.400 $; 106.400 minuta
  të papërdorura, 85.120 $): tani u konfirmua te teksti, por mbeti jashtë për vend.
- "Mjafton të jesh afërsisht i saktë, brenda 5–10%": tani u gjet te artikulli i 2004 ("within 5% to 10% of the actual
  number") dhe te punimi 04-045 (f. 7); nuk hyri për vend.
- Makinat: artikulli i 2004 jep 15% diferencë (85%), punimi 04-045 20% (80%); nuk hyri si shifër.
- OEE dhe kapaciteti (Nr. 48), teoria e kufizimeve (Nr. 54), ligji i Little-it (Nr. 58), kostoja e cilësisë (Nr. 22) dhe
  Balanced Scorecard (Nr. 17): nuk përsëriten.

## Çfarë është editoriale

- Leximet te kutitë "Leximi ynë": pyetja për ditën e mbush gjithmonë ditën, kurse një porosi mund ta shikosh; një tarifë
  me kohë bosh duket si fakt dhe e bën çdo porosi të duket më e shtrenjtë; kapaciteti në letër nuk është kapacitet; një
  kosto më e saktë ndihmon vetëm kur dikush vepron mbi të; kapaciteti i papërdorur është vendim: ta shkurtosh, ta
  mbushësh ose ta mbash qëllimisht për pikun. Tri mundësitë e fundit janë të redaksisë, jo të autorëve.
- Fjalia "të tria tarifat bien: ato nga anketa mbartin edhe koston e kohës që s'e përdori askush" është shpjegim i
  redaksisë, që e mbështet punimi 04-045 (f. 8: anketa "incorporates both the costs of resource capacity used and the
  costs of unused resources"); diferenca vjen edhe nga ndarja e anketës (70/10/20), që nuk përputhet saktësisht me
  minutat e përdorura.
- Grupimi i problemeve të ABC-së në tri karta (e kushtueshme, subjektive, gjithmonë 100%).
- Pjesët e 700.000 minutave janë llogaritje e redaksisë; shënohen në faqe. Tarifat Time-Driven dhe 97.120 $ janë te burimet
  (kontrolli i dytë).
- Emri "Time-Driven ABC" mbetet në anglisht në shqip dhe gjermanisht si emër i metodës; "ABC" për kostimin sipas
  aktiviteteve, gjermanisht "Prozesskostenrechnung".
- Karta e kostos për minutë te faqja 8 është praktikë e redaksisë, sipas Kaplan & Anderson (2004) dhe punimit 04-045:
  kapaciteti praktik, kostoja për minutë, ekuacioni i kohës dhe raporti i kapacitetit të përdorur e të papërdorur.
- Lidhja me esenë "High-volume days" (faqja 5): eseja thotë se kapaciteti nuk është numri i njerëzve në dispozicion, por
  i atyre që mund ta bëjnë punën sipas standardit, dhe se rezerva në letër ishte tashmë e planifikuar. Është e njëjta ide
  si dallimi mes kapacitetit teorik dhe atij praktik. Eseja nuk flet për kostimin.
- Lidhja me mjetin Pareto (faqja 8): pas llogaritjes, llojet e punëve (ose klientët) renditen sipas minutave që përdorin.
  Asnjë mjet i faqes nuk llogarit kosto; KPI Diagnostic (ku kapaciteti është një nga shkaqet) u shqyrtua, por Pareto i
  përshtatet më mirë hapit të fundit të kartës.
