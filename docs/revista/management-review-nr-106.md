# Management Review Nr. 106 · AI që shqyrton CV-të: testi dhe ligji

Blloku: AI. Seria e tretë, Nëntor 2026. Të dhënat janë te `lib/weekly/issues/106.js`.

Çfarë u lexua dhe si (6 nëntor 2026):

- **Wilson & Caliskan (2024)**, "Gender, Race, and Intersectional Bias in Resume Screening via Language Model
  Retrieval", Proceedings of the AAAI/ACM Conference on AI, Ethics, and Society 7(1): 1578–1590 (të dhënat e faqes së
  AAAI-së, DOI 10.1609/aies.v7i1.31748). U lexua i plotë versioni 3 në arXiv (2407.20371v3, 30 gusht 2026, 25 faqe me
  shtojcën), i cili ka në krye **shënimin e korrigjimit të autorëve, datë 29 gusht 2026**: një gabim në kod i kishte
  përmbysur rezultatet e testeve vetëm sipas gjinisë; rezultatet për racën dhe ato të kryqëzuara nuk u prekën dhe u
  përsëritën nga një ekip i Universitetit të Salzburgut. Teksti i artikullit poshtë shënimit nuk është ndryshuar
  (abstrakti dhe figura 5 thonë ende "male names preferred"); prandaj numri nuk e përdor asnjë rezultat vetëm sipas
  gjinisë si të vërtetë, përveç atij që korrigjimi e thotë qartë. Pa `via`.
- **Rregullorja (BE) 2024/1689** (AI Act): teksti i plotë XHTML i Gazetës Zyrtare nga Zyra e Botimeve
  (publications.europa.eu, CELEX 32024R1689; EUR-Lex me curl kthen 202 bosh). U lexuan nenet 6, 10, 13, 14, 16, 25, 26,
  27, 86 dhe Aneksi III. Burimi `aiact-reg-2024` ripërdoret nga Nr. 41.
- **Rregullorja (BE) 2026/1744** (Digital Omnibus për AI), e plotë nga e njëjta zyrë (CELEX 32026R1744): neni 4a i ri,
  ndryshimet e neneve 10, 25, 27 dhe 113. U kontrollua që nuk prek nenet 13, 14, 26 dhe 86, as pikën 4 të Aneksit III, as
  nenin 25(1) dhe nenin 10(2). Burimi `aiact-omnibus-2026` ripërdoret nga Nr. 41.

Nuk përsëritet: AI Act në përgjithësi, katër nivelet, afatet, neni 26 (udhëzimet, mbikëqyrja, informimi i punonjësve,
regjistrat, njoftimi i personave) dhe neni 6(3) janë te Nr. 41; menaxhimi algoritmik te Nr. 61; intervista e
strukturuar te Nr. 65; monitorimi te Nr. 71. Shënimet e faqeve 5, 7 dhe 8 çojnë atje. Mjeti: `/tools/ats-cv/` (ana e
kandidatit: si e lexon një CV programi i aplikimeve). Eseja "the-system-is-faster-than-you" në faqen 5: eseja pyet çfarë
i mbetet njeriut kur sistemi vendos i pari dhe kush vendos çfarë, gjë që përputhet me mbikëqyrjen njerëzore të nenit 14.

Pohime dhe burime që u lanë jashtë:

- **Dastin (2018), Reuters**, për mjetin e rekrutimit që u braktis: teksti i Reuters-it u lexua i plotë në ribotimin e
  Euronews (Reuters.com ktheu 401), por nuk hyri. Arsyet: mbështetet te burime anonime ("people familiar with the
  matter"), kompania nuk komentoi, dhe emri i kompanisë mund të bjerë ndesh me rregullin për punëdhënësit e autorit; për
  këtë numër mjaftojnë testi i kontrolluar dhe ligji. Nëse redaksia e do, rasti mund të shtohet si "rrëfim i raportuar"
  me `via` të Euronews-it.
- Rezultatet vetëm sipas gjinisë te teksti (male 51,9%, female 11,1%; title-only "entirely attributable to ... female
  names"; "White and male defaults"): nuk hynë si shifra të gjinisë, sepse korrigjimi i 2026 i përmbys. Numri thotë vetëm
  atë që korrigjimi thotë: në 51,9% të atyre testeve u preferuan emrat e grave, jo të burrave.
- "99% e kompanive Fortune 500 përdorin AI në punësim" (Schellmann 2024, cituar në hyrje të artikullit): burim i dorës së
  dytë, nuk u kontrollua, nuk hyri.
- Shifrat e "title-only" për racën (96,2% kundrejt 93,7%) nuk hynë: 93,7% nuk përputhet me një numër të plotë testesh nga
  27, dhe teksti nuk e shpjegon. Po ashtu 85,1%, 8,6% dhe 6,3% te testi i racës nuk dalin si numra të plotë nga 27
  (23/27 = 85,2%); i japim siç i shkruajnë autorët, si "pjesë e testeve", pa i kthyer në "23 nga 27".
- Neni 27 (vlerësimi i ndikimit në të drejtat themelore): nuk hyri, sepse për rekrutimin vlen vetëm për organet publike
  dhe subjektet private që japin shërbime publike (neni 27(1)), jo për punëdhënësin e zakonshëm.

## Tabela e fakteve

| Shifra ose fakti | Burimi | Statusi |
|---|---|---|
| Autorët: Kyra Wilson dhe Aylin Caliskan, University of Washington Information School | Wilson & Caliskan (2024), f. 1 | U konfirmua: "Kyra Wilson, Aylin Caliskan, University of Washington Information School" |
| 554 CV dhe 571 njoftime pune, nëntë profesione (nga Chief Executives te Secondary School Teachers e të tjera); njoftimet nga shembuj të vërtetë | Wilson & Caliskan, seksioni Data, tabela 1 | U konfirmua: "the dataset contained 554 resumes and 571 job descriptions across nine occupations (Chief Executive, …, Secondary School Teacher, …)"; "collected from real-world examples of these documents" |
| Tri modele MTE të hapura (E5-mistral-7b-instruct, GritLM-7B, SFR-Embedding-Mistral), të ndërtuara për detyra si kërkimi i dokumenteve | Wilson & Caliskan, seksioni Data | U konfirmua: "they are the highest performing open-source MTEs with at least one billion parameters"; "trained for representational tasks such as document retrieval" |
| Emrat: 120 emra; mbiemri Williams; 20 emra për çdo grup të kryqëzuar; 40 për çdo grup race ose gjinie | Wilson & Caliskan, "Name-Augmented Resumes" dhe "Evaluating…" | U konfirmua: "we augment resumes with 120 frequency-controlled names"; "Williams was selected as a last name"; "Each group was comprised of 40 names"; "Using the 20 names with population proportional frequencies from each intersectional group" |
| 10% e para për çdo njoftim; test chi-katror; 27 teste (3 modele × 9 profesione); p < 0,05 | Wilson & Caliskan, "Evaluating Race and Gender Bias" | U konfirmua: "selecting the top 10% of most similar resumes for every job description"; "a total of 27 bias tests were conducted for both gender and race"; figurat: "(p<0.05)" |
| CV-të u prenë te 1.300 tokena | Wilson & Caliskan, "Resume Screening" | U konfirmua: "1,300 tokens was chosen as a length" |
| Pa emra, CV-të nga i njëjti profesion morën ngjashmëri më të lartë për çdo profesion dhe model | Wilson & Caliskan, figura 3, "Verification of Retrieval" | U konfirmua: "For each occupation and model, cosine similarities are significantly higher (p<0.001) for resumes which belong to the same occupation" |
| Raca: emrat e bardhë të preferuar në 85,1% të testeve, emrat e zezakëve në 8,6%, pa ndryshim të rëndësishëm 6,3% | Wilson & Caliskan, figura 4 dhe teksti | U konfirmua: "Resumes with White names are significantly preferred (p<0.05) in 85.1% of tests; those with Black names are preferred in 8.6% of tests. Gray regions … (6.3% of tests)". Korrigjimi: rezultatet e racës "are unaffected by this error and were replicated" |
| Rastet ku fituan emrat e zezakëve erdhën vetëm nga modeli e5 | Wilson & Caliskan, "White and Male Names are Preferred" | U konfirmua: "the only cases in which Black-associated names were preferred at any threshold were results from the e5 model". Në numër: "nga njëri prej tri modeleve" |
| Të kryqëzuarat: burra të bardhë ndaj burrave zezakë 100% (zezakët 0%); gra zezake ndaj burrave zezakë 66,7%, burrat zezakë 14,8%; gra të bardha ndaj grave zezake 48,1%, gratë zezake 25,9%; burra të bardhë ndaj grave të bardha 18,5%, gratë e bardha 25,9% (pa ndryshim 55,6%) | Wilson & Caliskan, figurat 6–9 | U konfirmua: "White male names are significantly preferred in all 27 tests"; "Black female names … 66.7% … Black male names … 14.8%"; "White female names in 48.1% … Black female names … 25.9%"; "White male names are preferred in 18.5% … White female names are preferred in 25.9%". Korrigjimi: të kryqëzuarat nuk u prekën |
| Ndryshimet më të vogla mes emrave të bardhë të gjinive të ndryshme; krahasimet me emra zezakësh më të mëdha | Wilson & Caliskan, "Nuances of Intersectional Identities" | U konfirmua: "the smallest disparities exist between White names of different genders. Comparisons between Black names of different genders or Black and White names of the same gender exhibit larger disparities" |
| Kjo ndjek gjetjet e studimeve në terren (burrat zezakë të disavantazhuar); paragjykimi i kryqëzuar nuk është shuma e efekteve | Wilson & Caliskan, Discussion | U konfirmua: "Intersectional results … correspond more strongly to real-world discrimination in resume screening. In this setting, Black males are consistently observed to be disadvantaged (Pager 2003)"; "intersectional biases are not explained by the sum of race and gender biases alone" |
| Emrat e bardhë rreth 5,5 herë më të shpeshtë në korpus, sipas popullsisë (75,5% / 13,6%); seti i dytë: emra të bardhë afërsisht po aq të shpeshtë sa emrat e burrave zezakë | Wilson & Caliskan, "Name-Augmented Resumes" | U konfirmua: "we selected White male and female names which were approximately 5.5 times more frequent in the corpus than corresponding Black male names"; "an additional set of 20 White male and 20 White female names which were also approximately equally frequent to Black male names" |
| Me emra me shpeshtësi të barabartë: emrat e zezakëve të preferuar në 51,9% të 27 testeve, të bardhët në 22,2%; modelet janë të ndjeshme ndaj shpeshtësisë së emrit | Wilson & Caliskan, "Frequency Effects Bias Measurements" | U konfirmua: "resumes with Black names are preferred to those with White names in 51.9% of 27 tests, while those with White names are preferred to those with Black names in only 22.2% of tests. This is the reverse pattern"; "exemplifying model sensitivity to low level features such as name frequency". Teste race, të paprekura nga korrigjimi |
| Korrigjimi i gushtit 2026: pas përpjekjes së Frank Pallas dhe Martin Wiesinger (Universiteti i Salzburgut) për ta përsëritur, u gjet një gabim në kod; rezultatet vetëm sipas gjinisë duhen përmbysur; raca dhe të kryqëzuarat të paprekura dhe të përsëritura | Wilson & Caliskan, arXiv v3, shënimi në krye | U konfirmua: "August 29, 2026: After attempting to replicate our study, Frank Pallas … and Martin Wiesinger … (Salzburg University) informed us that our published results are inaccurate due to a bug in our code. Specifically, the results of gender-only comparisons should be inverted…"; "The results for race-only and intersectional comparisons are unaffected by this error and were replicated by the Salzburg University team." Versioni v3: "Sun, 30 Aug 2026" |
| Pas korrigjimit: emrat e grave u preferuan në 51,9% të testeve vetëm sipas gjinisë | Wilson & Caliskan, figura 5 + shënimi i korrigjimit | Rrjedhim i drejtpërdrejtë: figura 5 shkruan "male names are significantly preferred (p<0.05) in 51.9% of tests"; korrigjimi: "measurements referring to the preference of men should actually refer to preference of women, and vice versa" |
| Gjatësia e CV-së i ndryshoi rezultatet | Wilson & Caliskan, "Shorter Resumes Result in More Bias", Discussion | U konfirmua: "resumes with names and title only (title-only) lead to more biased outcomes than those with names, titles, and content"; "low-level features such as document length and name frequency also significantly altered outcomes" |
| Emrat janë mënyrë e përafërt për të përfaqësuar racën dhe gjininë | Wilson & Caliskan, Ethical Considerations | U konfirmua: "names, which is a reductive and incomplete way of representing these facets of identity" |
| Aneksi III, pika 4(a): AI për rekrutim ose përzgjedhje, veçanërisht njoftime të synuara, analizë dhe filtrim i aplikimeve, vlerësim i kandidatëve | Rregullorja 2024/1689, Aneksi III | U konfirmua fjalë për fjalë: "AI systems intended to be used for the recruitment or selection of natural persons, in particular to place targeted job advertisements, to analyse and filter job applications, and to evaluate candidates" |
| Rregullat për sistemet e Aneksit III zbatohen nga 2 dhjetori 2027 | Neni 113(c) i ndryshuar me Rregulloren 2026/1744 | U konfirmua: "Chapter III, Sections 1, 2, and 3 … shall apply from: (i) 2 December 2027 as regards AI systems classified as high-risk pursuant to Article 6(2) and Annex III" |
| Ofruesi: shqyrtim për paragjykime të mundshme dhe masa për t'i zbuluar, parandaluar dhe zbutur | Neni 10(2)(f), (g) | U konfirmua: "(f) examination in view of possible biases that are likely to … lead to discrimination prohibited under Union law"; "(g) appropriate measures to detect, prevent and mitigate possible biases identified according to point (f)". Omnibus-i ndryshoi vetëm 10(1), 10(5) dhe 10(6) |
| Udhëzimet e përdorimit: niveli i saktësisë dhe, kur duhet, performanca për persona ose grupe të caktuara | Neni 13(3)(b)(ii) dhe (v) | U konfirmua: "the level of accuracy, including its metrics"; "(v) when appropriate, its performance regarding specific persons or groups of persons on which the system is intended to be used" |
| Mbikëqyrja: mbikëqyrësit të vetëdijshëm për prirjen për t'u mbështetur tepër (automation bias) dhe të aftë ta shpërfillin, anashkalojnë ose përmbysin rezultatin | Neni 14(4)(b), (d) | U konfirmua: "(b) to remain aware of the possible tendency of automatically relying or over-relying on the output … (automation bias)"; "(d) to decide … not to use the high-risk AI system or to otherwise disregard, override or reverse the output" |
| Punëdhënësi: të dhënat hyrëse që kontrollon, të përshtatshme dhe mjaftueshëm përfaqësuese | Neni 26(4) | U konfirmua: "to the extent the deployer exercises control over the input data, that deployer shall ensure that input data is relevant and sufficiently representative in view of the intended purpose" |
| E drejta për shpjegim: personi i prekur nga një vendim i marrë mbi bazën e rezultatit të një sistemi të Aneksit III ka të drejtë për shpjegime të qarta të rolit të AI-së dhe elementeve kryesore të vendimit | Neni 86(1) | U konfirmua: "shall have the right to obtain from the deployer clear and meaningful explanations of the role of the AI system in the decision-making procedure and the main elements of the decision taken". Kushtet (efekte ligjore ose të ngjashme të rëndësishme, të cilat personi i sheh si të dëmshme për të drejtat; neni 86(3): vetëm kur e drejta nuk jepet ndryshe në të drejtën e BE-së) nuk shkruhen në faqe për vend; "kandidat i prekur" e mbulon. Omnibus-i nuk e prek nenin 86 |
| Neni 25(1)(c): kush ndryshon qëllimin e një sistemi AI, përfshirë një sistem për qëllime të përgjithshme, që nuk ishte me rrezik të lartë, në mënyrë që të bëhet i tillë, konsiderohet ofrues dhe ka detyrat e nenit 16 | Neni 25(1)(c) | U konfirmua fjalë për fjalë. Omnibus-i ndryshoi vetëm paragrafët 2 dhe 4 të nenit 25. Zbatimi te "një chatbot i përgjithshëm i vënë të rendisë kandidatët" është leximi i redaksisë dhe në faqe shkruhet "mund të bëhet ofrues" |
| Neni 26(5): kur përdorimi mund të paraqesë rrezik, njoftohet ofruesi | Neni 26(5) | U konfirmua: "they shall, without undue delay, inform the provider or distributor and the relevant market surveillance authority" |
| Neni 4a(2): përdoruesit e sistemeve me rrezik të lartë mund të përpunojnë përjashtimisht kategori të veçanta të dhënash për zbulimin dhe korrigjimin e paragjykimeve, me kushtet e paragrafit 1; nuk krijon detyrim | Rregullorja 2026/1744, pika (6) | U konfirmua: "Providers and deployers of other AI systems and models and deployers of high-risk AI systems may exceptionally process special categories of personal data to the extent that: (a) such processing is strictly necessary to ensure bias detection and correction …"; "This paragraph does not create any obligation to conduct such bias detection and correction." Rregullorja hyri në fuqi më 27 korrik 2026 (Nr. 41); në faqe "që nga korriku 2026" |
| Neni 27 (FRIA) vlen për organet publike, subjektet private që japin shërbime publike dhe sistemet e Aneksit III 5(b), (c) | Neni 27(1) | U konfirmua; nuk hyri në faqe (shih më lart) |
| Shënimet e leximit (faqet 3–7), hapat e testit (faqja 7) dhe karta (faqja 8) | Redaksia | Interpretim dhe propozim, të shënuara si të tilla; hapat e testit ndjekin metodën e studimit, jo një standard |
