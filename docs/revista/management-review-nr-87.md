# Management Review Nr. 87 · Norma e lëndimeve: si bëhet një shifër sigurie

Blloku: KPI. Seria e tretë, Nëntor 2026. Të dhënat janë te `lib/weekly/issues/87.js`.

Shkruar më 1 nëntor 2026. Të gjashtë burimet u lexuan të plota, asnjë nuk mban `via`:

- **BLS, "How To Compute Your Firm's Incidence Rate for Safety Management"** (bls.gov, faqja e ndryshuar së fundi më
  10 mars 2025). bls.gov e bllokon curl-in ("Access Denied" për robotët); faqja u lexua me WebFetch, që e ngarkon të
  plotë, dhe fjalitë e cituara më poshtë u nxorën fjalë për fjalë prej saj, në dy kalime të ndara që dhanë të njëjtat
  shifra.
- **BLS, Survey of Occupational Injuries and Illnesses, tabela 1, 2024** ("TABLE 1. Incidence rates of nonfatal
  occupational injuries and illnesses by industry and case types, 2024"), lexuar po ashtu me WebFetch; rreshtat e
  përdorur u kërkuan dy herë, njëherë "character for character", dhe dolën njësoj. Njoftimi për shtyp që e shoqëron
  ("Employer-Reported Workplace Injuries and Illnesses--2023-2024", 22 janar 2026) u lexua për kontekst; shifrat e tij
  (2,5 milionë raste, 2,4 më 2023) nuk hynë në numër, që burimet të mbeten gjashtë.
- **29 CFR Part 1904**, Code of Federal Regulations, botimi vjetor 2024 (govinfo, PDF CFR-2024-title29-vol5-part1904),
  10 faqe, teksti i plotë me curl dhe pymupdf.
- **ILO, Resolution concerning statistics of occupational injuries**, 16th ICLS, tetor 1998 (PDF wcms_087528), 6 faqe,
  teksti i plotë.
- **Eurostat, Statistics Explained, "Accidents at work statistics"**, të dhënat e nxjerra në shtator 2026 (të dhënat e
  2024), faqja e plotë me curl.
- **GAO, GAO-10-10** (tetor 2009), 75 faqe; gao.gov e bllokon curl-in, PDF-ja u shkarkua me WebFetch dhe u lexua e plotë
  me pymupdf.

Nuk u përdorën: OSHA.gov (CloudFront ktheu 403 për çdo faqe, edhe për formularët 300/300A), web.archive.org (lidhja u
ndërpre). Formula e OSHA-s merret prandaj nga BLS-ja, që e jep njësoj. "Për një milion orë në Evropë", siç ishte te
propozimi i temës, nuk u gjet te asnjë burim i lexuar: Eurostat numëron për 100.000 të punësuar, dhe "për një milion orë"
është norma e shpeshtësisë e ILO-s (1998). Numri e thotë kështu.

Treguesit paraprijës dhe vonues janë te Nr. 2, near miss-et dhe paralajmërimi i NSC-së kundër shpërblimit për norma të
ulëta te Nr. 63: këtu vetëm përmenden në shënime. Lidhja me esenë "A bad day or a problem?" (faqja 7) mbështetet te
eseja: një numër i vetëm pa histori nuk tregon nëse procesi ka ndryshuar, dhe rezultati krahasohet me vëllimin dhe ditët
e mëparshme. Mjeti `/tools/safety-cross/` llogarit TRIR (× 200.000 ÷ orë) dhe LTIFR (× 1.000.000 ÷ orë) nga orët e
punuara (`src/js/safety-cross.js`).

## Tabela e fakteve

| Shifra ose fakti | Burimi | Statusi |
|---|---|---|
| Formula: (numri i lëndimeve dhe sëmundjeve × 200.000) ÷ orët e punuara nga të gjithë punonjësit | BLS (2025) | U konfirmua te teksti i plotë: "(Number of injuries and illnesses X 200,000) / Employee hours worked = Incidence rate" |
| 200.000 = 100 punonjës × 40 orë në javë × 50 javë në vit; baza standarde | BLS (2025) | U konfirmua te teksti i plotë: "The 200,000 hours in the formula represents the equivalent of 100 employees working 40 hours per week, 50 weeks per year, and provides the standard base for the incidence rates." |
| Shembulli: ABC Company, prodhues fiktiv me 200 punonjës, 7 raste, 400.000 orë → 3,5; 3 raste me ditë larg, transferim ose kufizim → 1,5 | BLS (2025) | U konfirmua te teksti i plotë: "ABC Company-a fictitious construction machinery manufacturer with 200 employees"; "The ABC Company has 7 injuries and illnesses logged and 400,000 hours worked by all employees during the year"; "(7 x 200,000) / 400,000 = 3.5"; "ABC Company had 3 such cases"; "(3 x 200,000) / 400,000 = 1.5" |
| Orët e punuara nuk përfshijnë kohën e paguar pa punë; kur mungojnë, vlerësohen nga orët e planifikuara ose 8 orë në ditë pune | BLS (2025) | U konfirmua te teksti i plotë: "'Hours worked' should not include any nonwork time, even though paid, such as vacation, sick leave, holidays, etc."; "hours worked may be estimated on the basis of scheduled hours or 8 hours per workday" |
| Rastet merren nga regjistri (OSHA Form 300) ose përmbledhja (Form 300A) | BLS (2025) | U konfirmua te teksti i plotë: "From your Log of Work-Related Injuries and Illnesses (Log), OSHA's Form 300"; "From your Summary of Work-Related Injuries and Illnesses (Summary), OSHA's Form 300A" |
| Faqja e ndryshuar së fundi në mars 2025 | BLS (2025) | U konfirmua: data e ndryshimit të fundit që jep faqja është 10 mars 2025 |
| 2024, gjithë sektori privat: 2,3 raste për 100 punonjës me kohë të plotë (DART 1,4; ditë larg 0,8; transferim/kufizim 0,5; të tjera 1,0) | BLS, SOII, tabela 1 (2026) | U konfirmua te tabela: "Private industry … 2.3 1.4 0.8 0.5 1.0". Njoftimi për shtyp (22 janar 2026) e jep njësoj: "the incidence rate of total recordable cases (TRC) in private industry was 2.3 cases per 100 full-time equivalent (FTE) workers" |
| Korrierët (NAICS 492): 8,0; DART 6,6; ditë larg 4,2; transferim/kufizim 2,4; të tjera 1,4 | BLS, tabela 1 | U konfirmua te tabela: "Couriers and messengers 492 8.0 6.6 4.2 2.4 1.4" |
| Shtëpitë e kujdesit (NAICS 623, "Nursing and residential care facilities"): 5,5 | BLS, tabela 1 | U konfirmua te tabela: "623 5.5 3.6 2.4 1.2 1.9" |
| Magazinimi (NAICS 493): 4,8; DART 4,1; ditë larg 1,5; transferim/kufizim 2,6; të tjera 0,6 | BLS, tabela 1 | U konfirmua te tabela: "Warehousing and storage 493 4.8 4.1 1.5 2.6 0.6". Kopertina: 4,8 është "rreth dyfishi" i 2,3 (2,09 herë, llogari e redaksisë) |
| Prodhimi (31-33): 2,7 · Ndërtimi (23): 2,2 · Financat dhe sigurimet (52): 0,3 | BLS, tabela 1 | U konfirmua te tabela: "Manufacturing 31-33 2.7 1.7 0.8 0.8 1.0"; "Construction 23 2.2 1.3 0.9 0.4 0.9"; "Finance and insurance 52 0.3 0.1 - (7)0.0 0.2" |
| Spitalet (622): 5,1 | BLS, tabela 1 | U konfirmua ("Hospitals 622 5.1 2.1 1.3 0.8 3.0"), por **u hoq** nga grafiku që faqja 4 të mbajë në gjermanisht |
| Raste "siç i raportuan punëdhënësit sipas rregullave të OSHA-s" | Njoftimi i BLS-së, 22 janar 2026 | U konfirmua: titulli "Employer-Reported Workplace Injuries and Illnesses"; SOII "relies on OSHA recordkeeping requirements, which mandate employers record certain work-related injuries and illnesses" |
| Kriteret e regjistrimit: vdekja, ditë larg punës, punë e kufizuar ose transferim, trajtim mjekësor përtej ndihmës së parë, humbja e vetëdijes, ose lëndim/sëmundje e rëndësishme e diagnostikuar nga mjeku ose profesionist tjetër i licencuar | 29 CFR 1904.7(a) | U konfirmua te teksti i plotë: "if it results in any of the following: death, days away from work, restricted work or transfer to another job, medical treatment beyond first aid, or loss of consciousness … if it involves a significant injury or illness diagnosed by a physician or other licensed health care professional" |
| Ndihma e parë: ilaç pa recetë në dozë pa recetë; vaksina e tetanozit; pastrimi i plagëve; fasha, leukoplast, butterfly/Steri-Strips; terapi e nxehtë ose e ftohtë; mbështetje jo e ngurtë (fasha elastike); masazh; lëngje për stresin nga nxehtësia | 29 CFR 1904.7(b)(5)(ii) | U konfirmua te teksti i plotë, pikat (A), (B), (C), (D), (E), (F), (M), (N). Lista ka 14 pika, (A) deri (N) |
| Trajtim mjekësor: i njëjti ilaç në dozë me recetë; vaksina të tjera (hepatit B, tërbim); qepje, kapëse; pajisje të ngurta për palëvizshmëri; fizioterapi ose kiropraktikë | 29 CFR 1904.7(b)(5)(ii) | U konfirmua: "a recommendation … to use a non-prescription medication at prescription strength is considered medical treatment"; "other immunizations, such as Hepatitis B vaccine or rabies vaccine, are considered medical treatment"; "other wound closing devices such as sutures, staples, etc., are considered medical treatment"; "devices with rigid stays or other systems designed to immobilize parts of the body are considered medical treatment"; "physical therapy or chiropractic treatment are considered medical treatment" |
| Lista e ndihmës së parë është e plotë | 29 CFR 1904.7(b)(5)(iii) | U konfirmua: "No, this is a complete list of all treatments considered first aid for part 1904 purposes." |
| Regjistrimi i një rasti nuk do të thotë faj i punëdhënësit ose punonjësit, as shkelje rregulli | 29 CFR 1904.0, shënimi | U konfirmua: "Recording or reporting a work-related injury, illness, or fatality does not mean that the employer or employee was at fault, that an OSHA rule has been violated, or that the employee is eligible for workers' compensation or other benefits." |
| "E njëjta prerje është ndihmë e parë me shirita ngjitës dhe rast i regjistrueshëm me qepje" | 29 CFR 1904.7 | Leximi i redaksisë (callout), i nxjerrë nga pikat (D) e ndihmës së parë dhe nga qepjet si trajtim mjekësor |
| ILO: norma e shpeshtësisë = rastet e reja × 1.000.000 ÷ orët e punuara; numëruesi dhe emëruesi me të njëjtën mbulim | ILO (1998), paragrafi 19(a) | U konfirmua te teksti i plotë: "The frequency rate of new cases of occupational injury: Number of new cases … x 1,000,000 / Total number of hours worked by workers in the reference group". 1.000.000 ÷ 200.000 = 5 ("pesë herë baza amerikane") është llogari e redaksisë |
| Eurostat: aksidentet jo fatale janë ato me të paktën 4 ditë të plota kalendarike mungesë | Eurostat (2026) | U konfirmua: "Non-fatal accidents at work are defined as those that cause at least 4 full calendar days of absence from work" |
| BE 2024: 1.359 aksidente jo fatale për 100.000 të punësuar; Rumania 65, Bullgaria 87; Franca 2.622, Portugalia 2.489 | Eurostat (2026) | U konfirmua: "Across the EU, there were 1 359 non-fatal accidents per 100 000 employed people in 2024 … Romania (65) and Bulgaria (87) to more than 2 000 per 100 000 employed people in France (2 622), Portugal (2 489) and Spain (2 241)". Spanja nuk hyri në grafik për vend |
| Normat shumë të ulëta mund të vijnë nga nënraportimi; sistemet e mirëngritura shpjegojnë shpesh normat e larta | Eurostat (2026) | U konfirmua: "Particularly low incidence rates for non-fatal accidents may reflect under-reporting … In the same way, well-established reporting/recognition systems may often explain high incidence rates in some countries." |
| Normat e grafikut janë të thjeshta, jo të standardizuara për përbërjen e industrive; të dhënat e nxjerra në shtator 2026 | Eurostat (2026) | U konfirmua: "simple incidence rates are shown relating the number of accidents to the overall number of employed people"; "Data extracted in September 2026" |
| GAO: 67% e mjekëve dhe profesionistëve të shëndetit në punë kishin parë frikë nga ndëshkimi për raportimin e një lëndimi | GAO-10-10 (2009), f. 17 | U konfirmua te teksti i plotë: "67 percent reported observing worker fear of disciplinary action for reporting an injury or illness" |
| GAO: mbi një e treta u pyetën për trajtim që e mbante rastin jashtë regjistrit, por nuk mjaftonte për ta trajtuar | GAO-10-10, f. 2 dhe 18 | U konfirmua: "more than one-third of health practitioners were asked by company officials or workers to provide treatment that resulted in an injury or illness not being recorded, but also was not sufficient to properly treat the injury or illness" |
| GAO: kampioni 1.131, u përgjigjën 504 (45%); pyetjet për vendet ku trajtuan punonjës më 2008 | GAO-10-10, shtojca | U konfirmua: "Out of the sample of 1,131 health practitioners, 504 completed the questionnaires, for a total response rate of 45 percent"; "at the worksites where they treated workers in 2008". Të anketuarit ishin mjekë, ndihmës mjekë (physician assistants) dhe infermierë praktikues të mjekësisë së punës; në faqe "mjekë dhe profesionistë të tjerë të shëndetit në punë" |
| Shembulli i dy vendeve (25 vetë, 50.000 orë; 1.000 vetë, 2.000.000 orë; 4,0, 8,0, 0,1, 20) dhe tri kontrollet e faqes 7 | Redaksia | Shembull i shpikur, i shënuar si i tillë; llogaritë me formulën e BLS-së dhe të ILO-s. 2.000 orë në vit = 40 × 50, baza e BLS-së për një punonjës |
| Karta e faqes 8 | Redaksia | Propozim, jo kërkim; shënimi e thotë |
