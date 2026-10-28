# Management Review Nr. 75 · Shëndeti mendor në punë

Blloku: Njerëzit. Të dhënat janë te `lib/weekly/issues/75.js`.

Kontrolli i dytë, te tekstet e plota (11 tetor 2026). Në punën e parë WebFetch nuk hapi asnjë faqe dhe curl u ndal nga
proxy-ja; çdo fakt u kontrollua te copat e kërkimit, dhe teksti i ligjit gjerman te pasqyra në GitHub. Në kontrollin e
dytë u hapën të plota të gjashtë burimet: njoftimi i OBSH-së dhe ILO-s i 28 shtatorit 2022 (who.int); PDF-ja e plotë e
udhëzimeve (WHO IRIS, ISBN 978-92-4-005305-2); fleta informative "Mental health at work", versioni aktual i 15 shtatorit
2026 në who.int dhe versioni i 2 shtatorit 2024 përmes Wayback Machine; PDF-ja e plotë e World mental health report (WHO
IRIS, 296 faqe); artikulli i Malik et al. (2023) në PubMed Central (PMC10168149, përmes E-utilities të NCBI); dhe §§ 3–6
të Arbeitsschutzgesetz te gesetze-im-internet.de (me XML-në zyrtare). Të gjashtëve iu hoq `via`.

Teksti i plotë ndryshoi këto, të riprintuara në të tri gjuhët: (1) fleta informative e 2026 jep 16% për 2023 (versionet e
2022 dhe 2024 jepnin 15% për 2019); hyrja tani thotë "në 2022, OBSH vlerësoi se 15%… në 2019", dhe shënimi i faqes 4
shton 16% për 2023; (2) raporti i 2022 e formulon shifrën ndryshe nga njoftimi ("Close to 15% of the world's working
population is estimated to experience a mental disorder at any given time", f. 12; "970 million" në 2019, f. 39): hyrja,
etiketa dhe teksti i grafikut të faqes 4 ndjekin tani raportin; (3) te kutia e rreziqeve (faqja 3) "diskriminimi dhe
pabarazia" u bë "diskriminimi dhe përjashtimi", siç thotë lista e fletës; (4) shënimi i faqes 6 thoshte se notat e dy
trajnimeve vinin nga përmbledhje të pavarura: tani janë parë te udhëzimet; (5) përshtatjet e arsyeshme janë rekomandim i
udhëzimeve (rekomandimi 3), jo shtesë e fletës: shënimi i faqes 5 u ndreq; (6) hapi "Vlerëso" (faqja 7) thotë tani "kur
kushtet janë të njëjta, mjafton një vlerësim", sipas § 5 (2); (7) 35% e vendeve kanë programe kombëtare "për promovimin" e
shëndetit mendor në punë, siç thotë njoftimi. Ligji u ndryshua së fundi më 22.12.2025 (Art. 7 G v. 22.12.2025 I Nr. 369);
teksti i §§ 3–6 është i njëjtë me versionin e 2021, dhe titulli i burimit u përditësua. Numri përshkruan udhëzime, prova
dhe një ligj; nuk jep këshilla mjekësore dhe as ligjore, dhe e thotë në shënimet e faqeve 3, 7 dhe 8.

Shënim (27 tetor 2026), sipas historisë së git-it: kontrolli i dytë i 11 tetorit u bë para se numri të dilte online.
Ndryshimet e tij u bënë në degën e punës (commit 6e50b937, 11 tetor 2026) dhe numri hyri në main, nga ku botohet faqja,
vetëm me bashkimin #177 (7b43e7c3, 11 tetor 2026, ora 20:33): versioni i parë online i ka tashmë. Prandaj këto ndryshime
nuk kanë shënim korrigjimi dhe nuk e çojnë numrin te `checked.issues` (lib/weekly/common.js). Pas daljes online nuk
ndryshoi në kontrollin e dytë.

Korrigjim, 27 tetor 2026 (auditimi i 27 tetorit, P5-11). Burimi "Mental health at work (fact sheet)" datohej 2024,
ndërsa shënimi i faqes 4 përdor versionin e 15 shtatorit 2026 (16% për 2023). U rihap faqja e OBSH-së më 27 tetor: data
"15 September 2026"; jep 16% për 2023, 12 miliardë ditë, 1 trilion dollarë, listën e rreziqeve me "discrimination and
exclusion", të pesë përshtatjet e arsyeshme, kthimin në punë me "phased re-entry", punësimin e mbështetur dhe trajnimin
e menaxherëve. Burimi datohet tani 2026; numri ka një shënim korrigjimi me datë në tri gjuhët.

## Tabela e fakteve

| Shifra ose fakti | Burimi | Statusi |
|---|---|---|
| Më 28 shtator 2022 dolën dy botime: udhëzimet e OBSH-së për shëndetin mendor në punë dhe një përmbledhje politikash (policy brief) e OBSH-së dhe ILO-s që rrjedh prej tyre | OBSH & ILO, "WHO and ILO call for new measures to tackle mental health issues at work", njoftim, 28 shtator 2022 | U konfirmua te njoftimi në who.int, i hapur i plotë: "Two new publications … are published today - WHO Guidelines on mental health at work and a derivative WHO/ILO policy brief" |
| Udhëzimet rekomandojnë veprime kundër rreziqeve si ngarkesa e rëndë, sjelljet negative dhe faktorë të tjerë që krijojnë shqetësim në punë. Citimi: "For the first time WHO recommends manager training, to build their capacity to prevent stressful work environments and respond to workers in distress." | Po aty | U konfirmua fjalë për fjalë te njoftimi i hapur ("risks to mental health such as heavy workloads, negative behaviours, and other factors that create distress at work"; citimi, me presjen). Përkthimi në shqip dhe gjermanisht është yni |
| Rreth 12 miliardë ditë pune humbasin çdo vit nga depresioni dhe ankthi, me një kosto prej gati 1 trilion dollarësh amerikanë për ekonominë botërore | Po aty; edhe fleta informative e OBSH-së "Mental health at work" ("at a cost of US$ 1 trillion per year in lost productivity") | U konfirmua te njoftimi ("costing the global economy nearly US$ 1 trillion"), te fleta informative e 2024 dhe e 2026 ("at a cost of US$ 1 trillion per year", pa "nearly"), te udhëzimet dhe te raporti i 2022 (f. 99). Është vlerësim global, jo numërim (kopertina dhe faqja 4) |
| Vetëm 35% e vendeve raportuan se kishin programe kombëtare për promovimin e shëndetit mendor dhe parandalimin në lidhje me punën | Njoftimi i OBSH-së dhe ILO-s (2022), që e merr nga Atlasi i Shëndetit Mendor i OBSH-së | U konfirmua te njoftimi: "only 35% of countries reported having national programmes for work-related mental health promotion and prevention". Udhëzimet e citojnë nga "Mental health atlas 2020" (OBSH, 2021; referenca 17). **U saktësua** teksti i faqes 4: "programe kombëtare për promovimin e shëndetit mendor në punë" |
| Raporti Botëror i Shëndetit Mendor (qershor 2022): nga një miliard njerëz që jetonin me një çrregullim mendor në 2019, 15% e të rriturve në moshë pune kishin një çrregullim mendor | OBSH, World mental health report: Transforming mental health for all, 2022; njoftimi i OBSH-së dhe ILO-s (2022); fleta informative (2024, 2026) | Raporti u hap i plotë (WHO IRIS; faqja e botimit 16 qershor 2022). **Formulimi ndryshon** nga njoftimi: "in 2019, an estimated 970 million people in the world were living with a mental disorder" (f. 39; "nearly one billion" te parathënia); "Close to 15% of the world's working population is estimated to experience a mental disorder at any given time" (f. 12). "15% e të rriturve në moshë pune në 2019" është formulimi i njoftimit dhe i fletës së 2024. Hyrja e faqes 4, etiketa e grafikut ("Popullsia që punon në botë") dhe teksti ("≈ 15%") ndjekin tani raportin. Fleta e 15 shtatorit 2026: "16% of working-age adults were estimated to have a mental disorder in 2023"; shtohet në shënimin e faqes 4. Grafiku: 3 nga 20 = 15% |
| Rreziqet psikosociale që përmend OBSH: ngarkesa ose ritmi i tepruar i punës, mungesa e stafit, mungesa e kontrollit mbi mënyrën e punës ose ngarkesën; dhuna, ngacmimi ose bullizmi; diskriminimi dhe pabarazia; pasiguria e vendit të punës | OBSH, fleta informative "Mental health at work" | U konfirmua te fleta (2024 dhe 2026) dhe **u korrigjua** një pikë: lista e rreziqeve thotë "discrimination and exclusion"; "discrimination and inequality" del vetëm te "Key facts" dhe te paragrafi për çështjet më të gjera. Kutia e faqes 3 thotë tani "diskriminimi dhe përjashtimi". Revista shkurton listën në pesë pika |
| Për punonjësit me gjendje të shëndetit mendor, fleta rekomandon përshtatje të arsyeshme (p.sh. orar fleksibël, më shumë kohë për detyrat, detyra të ndryshuara për të ulur stresin, kohë e lirë për takime shëndetësore, takime mbështetëse me mbikëqyrësin), programe kthimi në punë që kombinojnë kujdesin e lidhur me punën (p.sh. kthimi gradual) me kujdesin klinik të vazhdueshëm, dhe punësim të mbështetur për njerëzit me gjendje të rënda | Po aty | U konfirmua fjalë për fjalë te fleta (të pesë shembujt, "phased re-entry to work", punësimi i mbështetur). Përshtatjet e arsyeshme janë edhe rekomandimi 3 i udhëzimeve ("Strong recommendation, very low-certainty of evidence", f. xi, 20): shënimi i faqes 5 thotë tani "udhëzimet rekomandojnë edhe" |
| Udhëzimet përdorin metodën GRADE për të vlerësuar sigurinë e provave; çdo rekomandim ka forcën e vet dhe sigurinë e provave | OBSH, WHO guidelines on mental health at work, 2022; Malik et al. (2023) | U konfirmua te udhëzimet (f. x; f. 116: "Each recommendation could be for or against a specific intervention, and either strong or conditional") dhe te Malik et al. |
| Fushat e udhëzimeve: ndërhyrjet organizative, trajnimi i menaxherëve dhe i punonjësve, ndërhyrjet individuale, kthimi në punë, strategjitë për gjetjen e punës (p.sh. punësimi i mbështetur), dhe programet e depistimit | Malik, Ayuso-Mateos, Baranyi, Barbui, Thornicroft, van Ommeren & Akhtar, "Mental health at work: WHO guidelines", World Psychiatry 22(2), 2023, f. 331–332 | U konfirmua te teksti i plotë në PMC: "address organizational interventions, manager and worker training, individual interventions, return to work, recovery-oriented strategies, and screening programmes". Udhëzimet kanë 12 rekomandime të numëruara dhe pyetjen 13 për depistimin, në gjashtë kapituj; "gjashtë vende ku veprohet" mbetet renditja jonë (faqja 5, depistimi në shënim) |
| Ndërhyrjet organizative synojnë të zbusin, ulin ose heqin faktorët e rrezikut psikosocial (p.sh. bullizmi, kontrolli i ulët mbi punën); ndihmojnë të ulet shqetësimi emocional dhe të përmirësohen rezultatet e punës, si mungesat, kënaqësia me punën dhe performanca | Malik et al. (2023) | U konfirmua te teksti i plotë ("mitigation, reduction or removal of psychosocial risk factors (e.g., bullying, low job control)… including absenteeism, job satisfaction and work performance") |
| Rekomandimi 1, ndërhyrjet organizative universale: "may be considered for workers to reduce emotional distress and improve work-related outcomes. Conditional recommendation, very low-certainty of evidence" | OBSH, WHO guidelines on mental health at work (2022), rekomandimi 1 | U konfirmua fjalë për fjalë te PDF-ja e udhëzimeve (f. xi, 12). Faqja 6 |
| Pjesa më e madhe e provave për ndërhyrjet organizative është me cilësi shumë të ulët, ka gjasa për shkak të vështirësisë së vlerësimit të ndërhyrjeve shumë komplekse | Malik et al. (2023) | U konfirmua te teksti i plotë: "most of the reviewed research evidence in this area has been found to be of very low quality, likely due to challenges of evaluating these highly complex interventions". Udhëzimet (f. 16) flasin për "the complexity of their implementation". Në revistë: "ndoshta sepse ndryshime të tilla studiohen me vështirësi" |
| Trajnimi i menaxherëve: synon të forcojë njohuritë, qëndrimet dhe aftësitë e menaxherëve për shëndetin mendor dhe të përmirësojë kërkimin e ndihmës nga punonjësit; "These trainings are not intended for managers to become mental health care providers" | Malik et al. (2023); fleta informative e OBSH-së (njohja e shqetësimit, dëgjimi aktiv) | U konfirmua te teksti i plotë i Malik et al. dhe i fletës; udhëzimet (f. 26): "Such training, however, is not designed for managers to become mental health-care providers" |
| Trajnimi i menaxherëve: rekomandim i fortë, siguri mesatare e provave | OBSH, WHO guidelines on mental health at work (2022) | U konfirmua te udhëzimet, rekomandimi 4 (f. xi, 26): "Training managers to support their workers' mental health should be delivered … Strong recommendation, moderate-certainty of evidence". Rekomandimi 5 (menaxherët e punonjësve të shëndetësisë dhe të emergjencave, f. 30) ka të njëjtën notë. Janë të vetmet me siguri mesatare; prandaj "prova për trajnimin e menaxherëve është më e forta" (hyrja) qëndron. Shënimi i faqes 6 u përditësua |
| Trajnimi i punonjësve për njohuritë dhe ndërgjegjësimin për shëndetin mendor: rekomandim i kushtëzuar, siguri shumë e ulët | OBSH, WHO guidelines on mental health at work (2022) | U konfirmua te udhëzimet, rekomandimi 6 (f. xi, 36): "Conditional recommendation, very low-certainty of evidence". Shënimi i faqes 6 u përditësua |
| Për trajnimin e orientuar te lidershipi nuk u dha rekomandim, sepse provat nuk treguan efekte të qarta te rezultatet shëndetësore | Malik et al. (2023) | U konfirmua te Malik et al. dhe te udhëzimet (f. 29: "No recommendation was made at this time for leadership-oriented training owing to there being no available desirable effects on health outcomes") |
| Për programet e depistimit gjatë punësimit (depistim plus mbështetje pas tij) nuk u dha rekomandim, për shkak të pasigurisë nëse dobitë i tejkalojnë dëmet | Malik et al. (2023) | U konfirmua te Malik et al. dhe te udhëzimet (f. xiii, 70: "the GDG did not make a recommendation for or against screening programmes during employment") |
| Ndërhyrjet individuale (ndërhyrje psikosociale ose aktivitet fizik) duhet të ofrohen si një pjesë e një programi të plotë që përfshin qasje organizative dhe menaxheriale | Malik et al. (2023) | U konfirmua te teksti i plotë ("psychosocial interventions or physical activity… one component of a comprehensive programme which includes organizational and managerial approaches"); "mbështetje psikosociale" në faqe është shkurtimi ynë |
| Kujdesi klinik i bazuar në prova, i kombinuar me kujdesin e lidhur me punën (p.sh. kthimi gradual) ose vetëm, ul simptomat dhe mungesat; punësimi i mbështetur ndihmon njerëzit me gjendje të rënda të gjejnë dhe të mbajnë punë | Malik et al. (2023) | U konfirmua te teksti i plotë. Në revistë vetëm si përshkrim i rreshtave "Kthimi në punë" dhe "Gjetja e punës"; pa pretendime klinike përtej kësaj |
| Arbeitsschutzgesetz § 5 (1): punëdhënësi ka për detyrë të përcaktojë, me një vlerësim të rrezikut që lidhet me punën, cilat masa mbrojtëse janë të nevojshme; (2) vlerësimi bëhet sipas llojit të veprimtarive, dhe për kushte të njëjta mjafton vlerësimi i një vendi pune; (3) nr. 6: rrezik mund të vijë veçanërisht nga "psychische Belastungen bei der Arbeit" | Arbeitsschutzgesetz (BGBl. I 1996, f. 1246), versioni pas ndryshimit të 22.12.2025 | U konfirmua te gesetze-im-internet.de (__5.html dhe XML-ja zyrtare). Versioni aktual: "Zuletzt geändert durch Art. 7 G v. 22.12.2025 I Nr. 369"; teksti i §§ 3–6 është i njëjtë me pasqyrën e 2021. § 5 (2): "Bei gleichartigen Arbeitsbedingungen ist die Beurteilung eines Arbeitsplatzes oder einer Tätigkeit ausreichend"; **u saktësua** hapi "Vlerëso" në të tri gjuhët (DE thoshte "gleichartige Arbeitsplätze genügen einmal") (faqja 7) |
| § 4 nr. 1: puna duhet projektuar që rreziku për jetën dhe për shëndetin fizik dhe psikik të shmanget sa më shumë; nr. 2: rreziqet luftohen te burimi i tyre; nr. 5: masat individuale të mbrojtjes vijnë pas masave të tjera | Po aty | U konfirmua te gesetze-im-internet.de (__4.html) (faqja 7) |
| § 3 (1): masat kontrollohen për efektshmërinë dhe përshtaten kur ndryshojnë rrethanat. § 6 (1): punëdhënësi duhet të ketë dokumentet ku duket rezultati i vlerësimit, masat e vendosura dhe rezultati i kontrollit të tyre | Po aty | U konfirmua te gesetze-im-internet.de (__3.html, __6.html) (faqja 7). Ligji nuk përcakton metodë për vlerësimin; kjo thuhet në shënim, sipas leximit tonë të §§ 3–6 |

## Çfarë nuk hyri

- Shifra e re e fletës informative (16% në 2023, versioni i 15 shtatorit 2026): tani u pa dhe hyn vetëm në shënimin e
  faqes 4; grafiku mbetet 3 nga 20 sipas raportit të 2022.
- Numri i rekomandimeve: te udhëzimet janë 12 të numëruara dhe pyetja 13 për depistimin, në gjashtë kapituj. Nuk e japim
  numrin për vend.
- Notat e rekomandimeve të tjera, tani të pa te udhëzimet: rek. 2 dhe 7 të kushtëzuara, siguri shumë e ulët; 8A, 9A, 9B
  dhe 11 të kushtëzuara, siguri e ulët; 8B, 10A dhe 10B të kushtëzuara, siguri shumë e ulët; rek. 3 (përshtatjet e
  arsyeshme) e fortë, siguri shumë e ulët; rek. 12 (punësimi i mbështetur) e fortë, siguri e ulët. Nuk hynë për vend.
- Burimi origjinal i 12 miliardë ditëve (zakonisht Chisholm et al., Lancet Psychiatry 2016): kërkimi konfirmoi artikullin
  (36 vende, 2016–2030, raporti kosto-përfitim 2,3–3,0 me 1 vetëm me përfitimet ekonomike), por jo shifrën e ditëve te
  teksti i tij. E japim vetëm siç e japin OBSH dhe ILO.
- EU-OSHA (OSH Pulse 2022, ESENER 2024): nuk u kontrollua në këtë numër, sepse kufiri i kërkimeve u shterua. Tabela e
  Nr. 29 shënon për ESENER 2024 se 43% e ndërmarrjeve raportojnë presionin e kohës si faktor rreziku dhe se pjesëmarrja e
  punonjësve në masat për rreziqet psikosociale ra nga 61% (2019) në 55% (2024); nuk i rikontrolluam vetë dhe nuk hynë.
- Gjermania: ditët e mungesës për shkak të çrregullimeve psikike (DAK, Psychreport; BAuA, Sicherheit und Gesundheit bei
  der Arbeit) dhe viti i ndryshimit që shtoi "psychische Belastungen" te § 5 (shpesh thuhet 2013): nuk u kontrolluan.
  Bashkëvendimi i këshillit të punonjësve për vlerësimin e rrezikut (BetrVG § 87 (1) nr. 7) gjithashtu jo.
- Presioni i afateve në Gjermani (BAuA) dhe në Evropë (OSH Pulse 2025) është te Nr. 29; nuk përsëritet.
- Shqipëria: as ligji për sigurinë dhe shëndetin në punë, as të dhëna të krahasueshme për shëndetin mendor në punë nuk u
  kontrolluan. Shënimi i faqes 7 e thotë.
- Burnout-i (Nr. 29), siguria psikologjike (Nr. 4), kultura e drejtë (Nr. 50) dhe puna me turne (Nr. 45): nuk përsëriten.

## Çfarë është editoriale

- Leximet te kutitë "Leximi ynë": ngarkesa, kontrolli dhe sjellja vendosen në punë, shpesh nga menaxheri; në një ekip me
  njëzet vetë, tre njerëz me një çrregullim mendor janë pritshmëria mesatare (lexim i 15%, jo shifër e re); ndihma për
  individin është një pjesë, nuk e zëvendëson ndryshimin e punës; prova e dobët nuk është provë dështimi dhe ligji nuk pret
  provat; ligji dhe OBSH tregojnë në të njëjtin drejtim, dhe një pyetësor nuk është ende vlerësim.
- Hyrja ("aplikacion, kurs, linjë telefonike") përshkruan një qasje të zakonshme me fjalët tona; nuk është shifër.
- Rreshtat e faqes 5 dhe 6 janë shkurtime tonat të udhëzimeve; katër hapat e faqes 7 janë leximi ynë i §§ 3–6, jo
  këshillë ligjore.
- Karta e faqes 8 është praktikë e redaksisë, sipas rendit të OBSH-së (puna para individit) dhe §§ 3–6 të
  Arbeitsschutzgesetz. Pyet për punën, jo për shëndetin e njeriut; nuk është diagnozë dhe nuk zëvendëson vlerësimin formal
  të rrezikut ose ndihmën mjekësore.
- Lidhja me esenë "Leadership without a title" (faqja 5): eseja nuk flet për shëndetin mendor. E zgjodhëm sepse thotë se
  çmimi më i dukshëm i marrjes së çdo problemi mbi vete është lodhja, dhe se kush mbulon vazhdimisht boshllëqet e një
  sistemi krijon përshtypjen se sistemi punon; autori do të ndante sot zgjidhjen e çastit nga zgjidhja strukturore. Kjo
  është e njëjta logjikë si radha e OBSH-së: ndrysho punën, mos e ngarko individin. "Leading people without losing the
  person" do të ishte afër, por u përdor te Nr. 29.
- Lidhja me mjetin Five Whys (faqja 8): rreshti i tretë i kartës kërkon të gjendet nga vjen ngarkesa derisa të arrihet te
  diçka në punë. Asnjë mjet i faqes nuk është për shëndetin mendor; ky është më i afërti dhe nuk mat asgjë për njerëzit.
- Përkthimet e citimit të OBSH-së dhe të teksteve të ligjit në anglisht dhe shqip janë tonat.
