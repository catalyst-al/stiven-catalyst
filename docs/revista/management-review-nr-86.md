# Management Review Nr. 86 · Ta përdorësh AI-në pa e humbur aftësinë

Blloku: AI. Seria e tretë, data "Nëntor 2026". Të dhënat janë te `lib/weekly/issues/86.js`.

Shkruar më 1 nëntor 2026. Çdo shifër dhe çdo fakt u kontrollua te teksti i plotë i burimit të vet:

- **Budzyń et al. (2025)**, The Lancet Gastroenterology & Hepatology 10: 896–903 (botuar online më 12 gusht 2025).
  Faqja e Lancet-it ktheu 403 (Cloudflare). U lexua i plotë PDF-ja e artikullit të botuar (tetor 2025, f. 896–903, me
  tabelat 1–3, diskutimin dhe kufizimet), një kopje te `rivista.ai`. Shtojca (appendix) nuk u pa. Pa `via`.
- **Bastani et al. (2025)**, PNAS 122(26), e2422633122. Lexuar i plotë te PubMed Central (PMC12232635, XML-ja përmes
  E-utilities të NCBI), licencë CC BY-NC-ND; edhe korrigjimi (PMC12403119), që ndreq vetëm afiliacionin e Osbert
  Bastani-t. Shtojca SI nuk u pa. Burimi ekziston tashmë si `genai-bastani-2025` (Nr. 51) dhe ripërdoret; rezultatet e
  tij kryesore (48%, 127%, 17%) janë te Nr. 51 dhe nuk përsëriten.
- **Macnamara et al. (2024)**, Cognitive Research: Principles and Implications 9, 46. Lexuar i plotë te PubMed Central
  (PMC11239631), licencë CC BY 4.0.
- **Bainbridge (1983)**, "Ironies of Automation", Automatica 19(6): 775–779. Lexuar i plotë te një kopje e faqeve të
  revistës (PDF me 5 faqe, `ckrybus.com/static/papers/Bainbridge_1983_Automatica.pdf`). Burimi ekziston tashmë si
  `bainbridge-1983` (Vëllimi 3 i traktatit) dhe ripërdoret.
- **FAA (2013)**, Safety Alert for Operators SAFO 13002, "Manual Flight Operations", 4 janar 2013. Lexuar i plotë te
  faa.gov (PDF me një faqe).

Nuk u lexua dhe nuk hyri: Casner et al. (2014) për pilotët (vetëm siç e përshkruan Macnamara); udhëzimi i FAA-s i 2022
që përmend Macnamara; studimi i mamografisë që citon Budzyń. Studimet e METR-it dhe të Humlum-it janë te Nr. 51 dhe 10.

Temat e afërta: AI gjenerative në punë te Nr. 51 (Bastani, Brynjolfsson et al.), "kufiri i dhëmbëzuar" te Nr. 10,
automatizimi dhe rolet te Nr. 39, menaxhimi algoritmik te Nr. 61, monitorimi te Nr. 71, parashikimi te Nr. 77;
paragjykimi i automatizimit, ironitë e Bainbridge-it dhe ndërhyrja njerëzore te Vëllimi 3 i traktatit operacional. Ky
numër trajton vetëm humbjen dhe ruajtjen e aftësisë; shënimet e faqeve 4, 5 dhe 6 çojnë te to.

## Tabela e fakteve

| Shifra ose fakti | Burimi | Statusi |
|---|---|---|
| Krzysztof Budzyń et al., "Endoscopist deskilling risk after exposure to artificial intelligence in colonoscopy: a multicentre, observational study", Lancet Gastroenterol Hepatol 2025; 10: 896–903 | Budzyń et al. (2025) | U konfirmua te teksti i plotë: "Lancet Gastroenterol Hepatol 2025; 10: 896–903 Published Online August 12, 2025 https://doi.org/10.1016/S2468-1253(25)00133-5" |
| Katër qendra në Poloni nisën AI për polipet në fund të 2021; me apo pa AI sipas datës së ekzaminimit | Budzyń et al. (2025), abstrakti, "Study design" | U konfirmua: "These centres introduced AI tools for polyp detection at the end of 2021, after which colonoscopies had been randomly assigned to be conducted with or without AI assistance according to the date of examination." |
| Sistemi shënon në ekran polipet e mundshme | Budzyń et al. (2025), "Procedures" | U konfirmua: "the endoscopist could see the marked target on the screen during AI use" (sistemi ENDO-AID CADe) |
| Zbulimi i adenomave pa AI: 28,4% (226 nga 795) para, 22,4% (145 nga 648) pas; −6,0 pikë | Budzyń et al. (2025), abstrakti, "Results", tabela 2 | U konfirmua: "The ADR of standard colonoscopy decreased significantly from 28·4% (226 of 795) before to 22·4% (145 of 648) after exposure to AI, corresponding with an absolute difference of –6·0% (95% CI –10·5 to –1·6; p=0·0089)." Në kopertinë "pikë" (pikë përqindjeje) |
| Me AI në të njëjtën periudhë: 25,3% (186 nga 734) | Budzyń et al. (2025), "Results" | U konfirmua: "In the supplementary analysis of patients who did have AI-assisted colonoscopy, the ADR was 25·3% (186 of 734)." Krahasuar me para AI-së, "use of AI was not significantly associated with a change in ADR (OR 0·80 [95% CI 0·63–1·02])" |
| Tre muaj para dhe tre muaj pas | Budzyń et al. (2025), "Study design" | U konfirmua: "the period approximately 3 months before AI implementation in clinical practice versus the period 3 months after AI implementation" |
| 19 endoskopistë, secili mbi 2.000 kolonoskopi, mesatarisht 27,6 vjet përvojë | Budzyń et al. (2025), "Results" | U konfirmua: "The colonoscopies were performed by 19 endoscopists ... with experience of more than 2000 colonoscopies each and mean length of experience of 27·6 years (range 8–39)." |
| Pas ndryshimit: më shumë burra dhe më shumë sedacion, dy faktorë që zakonisht e rritin zbulimin | Budzyń et al. (2025), "Discussion" | U konfirmua: "colonoscopies involved more male patients than after AI introduction (38·0% vs 45·4%, p=0·0046) and greater sedation use (77·1% vs 81·9%, p=0·024)—both factors that would typically increase ADR". Tabela 1 tregon që 45,4% dhe 81,9% janë periudha pas AI-së; formulimi i artikullit është i ngatërruar, shifrat jo |
| Shpjegimi i autorëve: mbështetje e tepruar; më pak motivim, përqendrim dhe përgjegjësi pa AI | Budzyń et al. (2025), "Discussion" | U konfirmua: "We assume that continuous exposure to decision support systems such as AI might lead to the natural human tendency to over-rely on their recommendations, leading to clinicians becoming less motivated, less focused, and less responsible when making cognitive decisions without AI assistance." Në faqe: "autorët dyshojnë" |
| Studim vëzhgues; 1.443 kolonoskopi pa AI dhe 734 me AI | Budzyń et al. (2025), "Results" | U konfirmua: "a total of 2177 colonoscopies were conducted, including 1443 without AI use and 734 with AI" |
| Polonia e pezulloi programin e depistimit më 1 janar 2022; pacientët e mëvonshëm nga lista e pritjes | Budzyń et al. (2025), kufizimi i tetë | U konfirmua: "temporary suspension of the colonoscopy-based colorectal cancer screening programme in Poland on Jan 1, 2022 ... enabling them to accept more patients from the waiting list in the second phase, which is potentially a confounding factor" |
| Autorët kërkojnë prova të rastësishme | Budzyń et al. (2025), përfundimi | U konfirmua: "We emphasise the urgent need for robust prospective studies, such as randomised crossover trials" |
| Leximi i faqes 3: krahasuar me javët pa AI, AI dukej më mirë; krahasuar me ekipin tre muaj më parë, jo | Budzyń et al. (2025), "Discussion" | Mbështetet te: "Although AI-assisted colonoscopy appeared to increase ADR from 22·4% to 25·3% within the same timeframe ... the actual trend from a chronological perspective suggests a decline in ADR for non-AI-assisted colonoscopy after AI implementation". Fjalia është e redaksisë |
| Gati 1.000 nxënës në Turqi; GPT-4 pa kufizime ndihmoi në ushtrime dhe dëmtoi në provim | Bastani et al. (2025), abstrakti | U konfirmua: "we provide nearly a thousand high school math students with access to generative AI tutors"; "students actually perform worse than those who never had access". Shifrat janë te Nr. 51 |
| Mesazhi i parë kërkonte përgjigjen ose përsëriste pyetjen: GPT Base 56% (ndërveprimi i parë) dhe 67% (ndërveprimi i parë në çdo problem të seancës 1); GPT Tutor 42% dhe 37% | Bastani et al. (2025), "Student Engagement" | U konfirmua: "if we restrict to the very first interaction students have with our tool in the first session, 56% in the GPT Base arm and 42% in the GPT Tutor arm either repeat the question text or ask for the answer; in contrast, when considering the first interaction across all problems in the first session, this number increases to 67% for GPT Base but decreases to 37% for GPT Tutor." Grafiku i faqes 4 |
| GPT Base dha përgjigje të saktë vetëm 51% të herëve, i pyetur dhjetë herë për secilin nga 57 problemet | Bastani et al. (2025), "GPT Errors vs. Student Performance" | U konfirmua: "For each of the 57 total practice problems, we ask GPT Base for the answer ten times ... We find that GPT Base gives a correct answer only 51% of the time on average" |
| Nxënësit me GPT Base nuk menduan se mësuan më pak; ata me GPT Tutor menduan se dolën më mirë, megjithëse jo | Bastani et al. (2025), "Student Perception" | U konfirmua: "While students in the GPT Base arm performed worse on the exam (relative to the control arm), they did not perceive that they performed worse or learned less. Similarly, while students in the GPT Tutor arm did not perform better on the exam ..., they perceived that they performed significantly better." |
| Leximi i autorëve: GPT Base u përdor si "paterica" | Bastani et al. (2025), abstrakti dhe "Potential Mechanism" | U konfirmua: "Without guardrails, students attempt to use GPT-4 as a 'crutch' during practice problem sessions"; "students using GPT Base as a crutch is the main mechanism" |
| Një shkollë, matematikë, vjeshta 2023, GPT-4 | Bastani et al. (2025), "Experimental Design" dhe "Discussion" | U konfirmua: "a large high school in Turkey during the Fall semester of the 2023–2024 academic year"; "Our deployment was also carried out in Fall 2023" |
| Macnamara et al., Case Western Reserve University; dy rreziqe (zbehja e aftësisë te ekspertët, pengimi i zhvillimit te ata që mësojnë) dhe mungesa e vetëdijes | Macnamara et al. (2024), abstrakti dhe afiliacionet | U konfirmua: "we discuss how artificial intelligence assistants might accelerate skill decay among experts and hinder skill acquisition among learners. Further, we discuss how AI assistants might also prevent experts and learners from recognizing these deleterious effects." Shumica e autorëve: "Case Western Reserve University" (dy të tjerë nga Emory dhe Ohio State) |
| Aftësitë mendore zbehen më shpejt se ato fizike | Macnamara et al. (2024), "Potential AI-induced skill decay" | U konfirmua: "higher levels of skill decay are associated with tasks that require greater cognitive effort and fewer physical demands (i.e., controlled processes), as opposed to tasks that primarily rely on physical abilities" |
| Puna bëhet ende, prandaj humbja mbetet e fshehur | Macnamara et al. (2024) | U konfirmua: "AI-induced skill decay may operate outside the performer's awareness because the disuse is only at the level of cognitive skill engagement, not with engagement with the task" |
| Duket kur mjeti gabon, nuk punon ose s'e njeh rastin | Macnamara et al. (2024), përfundimet | U konfirmua: "or if the AI tool is biased, offline, or making errors"; "AI will have difficulty handling new viruses, unique injuries ..." |
| Te ata që mësojnë: rezultatet rriten shpejt, aftësia mund të mos formohet, duket vetëm kur mjeti hiqet | Macnamara et al. (2024), "Potential AI-induced skill development hindrance" | U konfirmua: "We would expect the learners with the AI assistant to improve their performance rapidly"; "high performance is observed in the AI-assisted group, but the limits on learning remain hidden until AI assistance is removed" |
| Paragjykimi i automatizimit largohet kur mjeti fiket; aftësia jo | Macnamara et al. (2024), "The use of automation and artificial intelligence" | U konfirmua: "Automation bias and automation-induced complacency are not the same concerns as automation affecting a person's skill. In other words, if the automation was removed, the user would no longer exhibit bias or automation-induced complacency. But what about the person's skill?" |
| Më 2024 nuk kishte kërkim për ndikimin e asistentëve AI te aftësia e përdoruesit | Macnamara et al. (2024) | U konfirmua: "To our awareness, no research has been conducted on AI assistants' effects on the user's skill." |
| Punim teorik me shembuj nga radiologjia dhe kirurgjia robotike | Macnamara et al. (2024), hyrja dhe "Open practices statement" | U konfirmua: "We use two subdisciplines within the field of medicine as examples: radiology ... and robotic surgery"; "We do not report on any studies or original data." |
| Bainbridge, University College London, 1983 | Bainbridge (1983), faqja e parë | U konfirmua: "Department of Psychology, University College London"; "Automatica, Vol. 19, No. 6. pp. 775–779, 1983" |
| Aftësitë fizike përkeqësohen kur nuk përdoren; operatori dikur me përvojë që ka mbikëqyrur mund të jetë tani pa përvojë | Bainbridge (1983), 1.1.1 | U konfirmua: "Unfortunately, physical skills deteriorate when they are not used, particularly the refinements of gain and timing. This means that a formerly experienced operator who has been monitoring an automated process may now be an inexperienced one." |
| Kontroll me dorë për pak kohë në çdo turn, ose simulator | Bainbridge (1983), 2.3 | U konfirmua: "One possibility is to allow the operator to use hands-on control for a short period in each shift. If this suggestion is laughable then simulator practice must be provided." |
| Citimi: sistemet më të suksesshme ... mund të kërkojnë investimin më të madh në trajnim | Bainbridge (1983), fundi i 2.3 | U konfirmua fjalë për fjalë: "Perhaps the final irony is that it is the most successful automated systems, with rare need for manual intervention, which may need the greatest investment in human operator training." Në faqe i shkurtuar me "…" në vend të "which"; përkthimet janë tonat |
| Bainbridge shkruante për impiantet e proceseve, me shembuj nga kabina | Bainbridge (1983), hyrja | U konfirmua: "This paper is particularly concerned with control in process industries, although examples will be drawn from flight-deck automation." |
| FAA, SAFO 13002, 4 janar 2013: një analizë gjeti rritje të gabimeve në pilotimin me dorë | FAA (2013) | U konfirmua: "A recent analysis of flight operations data (including normal flight operations, incidents, and accidents) identified an increase in manual handling errors." |
| Linjat t'i lënë pilotët të fluturojnë me dorë kur ngarkesa është e ulët | FAA (2013), "Discussion" | U konfirmua: "Operational policies should be developed or reviewed to ensure there are appropriate opportunities for pilots to exercise manual flying skills, such as in non-RVSM airspace and during low workload conditions." Njoftimi "encourages operators"; prandaj në shënim: udhëzim, jo rregull |
| Budzyń 2025: rezultati i parë i këtij lloji në mjekësi | Budzyń et al. (2025), "Research in context" | U konfirmua: "To our knowledge, this is the first study that suggests AI exposure might have a negative impact on patient-relevant endpoints in medicine in general." |

## Çfarë nuk hyri

- Te Budzyń et al.: rënia më e madhe te endoskopistet femra (−15,1 pikë) dhe në qendrat me zbulim fillestar më të
  lartë; autorët vetë thonë se mund të jetë kthim drejt mesatares dhe kërkojnë më shumë kërkim. U konfirmuan te teksti;
  nuk hynë, sepse janë analiza nëngrupesh me pak raste.
- Te Budzyń et al.: hipoteza se provat e rastësishme të AI-së në kolonoskopi e mbivlerësojnë përfitimin. Mbështetet te
  diskutimi; në faqe hyn vetëm si "leximi ynë" i kujdesshëm, pa pretendim për provat e tjera.
- Te Bastani et al.: koeficientët e regresionit dhe analiza e gabimeve logjike dhe aritmetike. Jashtë për vend.
- Te Macnamara et al.: Casner et al. (2014) për pilotët dhe udhëzimi i FAA-s i 2022: burime dytësore, nuk u lexuan.
- Te Bainbridge: vigjilenca "rreth gjysmë ore" dhe ironia e mbikëqyrjes: janë te Vëllimi 3 i traktatit; nuk
  përsëriten.

## Çfarë është editoriale

- Leximet te kutitë "Leximi ynë": masa e krahasimit ishte zhvendosur; si ndihen njerëzit për një mjet nuk mat çfarë
  bëjnë pa të; gabimet e mjetit ikin me mjetin, aftësia e humbur mbetet; sa më i mirë mjeti, aq më shumë duhet
  planifikuar praktika (mbështetet te citimi i Bainbridge-it); një ekip që s'punon kurrë pa mjetin nuk e di çfarë do
  të bënte.
- Dy kolonat e faqes 5 shkurtojnë me fjalët tona dy pjesët e punimit të Macnamara-s.
- Pesë shenjat e faqes 7 janë të redaksisë, të nxjerra nga katër burimet; shënimi thotë se nuk janë provuar si tërësi.
- Karta e kontrollit pa mjetin (faqja 8) është propozim i redaksisë.
- Lidhja me esenë "Nata kur ra sistemi" (`the-night-the-system-went-down`, faqja 7): eseja tregon natën e parë të
  trajnimit të autorit në një hotel tjetër, kur sistemi nuk ishte i disponueshëm për rreth pesë orë, dhe sa pjesë e
  punës dhe e të mësuarit varej nga ekrani; propozon t'i shtohet trajnimit të çdo të riu çfarë bëhet ditën kur sistemi
  nuk është. Kjo është shenja e fundit e faqes 7 ("një emër për rastin pa sistem") dhe pyetja e faqes. Eseja flet për
  një sistem hoteli, jo për AI; faqja nuk pretendon më shumë.
- Lidhja me mjetin Skills Matrix (`/tools/skills-matrix/`, faqja 8): mjeti vlerëson çdo person në çdo detyrë, tregon
  mbulimin, pikat e vetme të dështimit dhe planin e trajnimit; pyetja "kush e bën detyrën pa mjetin" hyn aty si
  aftësi më vete.
