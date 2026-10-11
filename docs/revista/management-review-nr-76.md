# Management Review Nr. 76 · Diagrama Ishikawa

Blloku: Operacioni. Të dhënat janë te `lib/weekly/issues/76.js`.

Kontrolli i dytë, te tekstet e plota (11 tetor 2026). Në punën e parë WebFetch nuk arriti asnjë faqe botuesi dhe curl
u ndal nga proxy-ja; çdo fakt u kontrollua te copat e kërkimit. Në kontrollin e dytë u hapën të plota pesë nga gjashtë
burimet, kryesisht përmes kopjeve të Wayback Machine (asq.org, bmj.com dhe repozitoret universitare kthyen ende 403): faqja
e ASQ për diagramën (kopja e 5 tetorit 2026, "Reviewed October 2024"; edhe versionet e dhjetorit 2024 dhe të 2019);
artikulli i Doggett-it (2005), PDF-ja origjinale e ASQ (QMJ 12(4), 34–45); Antony, McDermott & Sony, versioni "Early
Access" i IEEE në repozitorin e University of Galway ("Content is final as presented, with the exception of pagination");
Peerally et al. (2017), versioni i botuesit në PubMed Central (PMC5530340); Kellogg et al. (2017), PDF-ja e botuesit.
Këtyre pesëve iu hoq `via`. Udhëzuesi i Ishikawa-s nuk u hap (archive.org 403) dhe mban `via`; tri llojet jepen tani
siç i përmbledh Doggett-i (f. 36), që citon botimin e dytë të vitit 1982 (Asian Productivity Organization).

Teksti i plotë ndryshoi këto, të riprintuara në të tri gjuhët: (1) Kellogg: "731 zgjidhje" është vetëm te abstrakti;
teksti (f. 384: "499 total solutions") dhe tabela 3 ("n=499") numërojnë 499, dhe përqindjet e grafikut (20,0 / 19,6 / 15,2)
janë nga 499; hyrja dhe etiketa e faqes 7 thonë tani 499, dhe shënimi e shpjegon; (2) Antony: "< 25%" është nga 397 të
anketuarit e trajnuar për mjetet (90/397 = 22,6%; të tjerët u ndalën pas pyetjeve të para), jo nga 456: kopertina, hyrja
dhe faqja 4 u ndreqën; (3) "95% në fabrikë" nuk është te Antony (që shkruan "95% of workplace problems", "95% of problems in
processes"): tani "95% të problemeve në punë"; dhe "anketa e 2021" bëhet "anketë e botuar në 2021", sepse artikulli jep
vetëm "36 javë"; (4) grupi për shërbimet (Policies, Procedures, People, Plant) nuk është në asnjë version të faqes së ASQ:
u hoq nga faqja 5 dhe nga karta; në vend të tij kolona e djathtë shkurton shënimet e ASQ-së për kategoritë, me M-në e
shtatë (Money); "Machines" bëhet "Machinery", si te ASQ; (5) "më vonë profesor në Universitetin e Tokios" nuk është në asnjë
burim të hapur (Doggett-i shkruan vetëm "Professor"): u hoq nga faqja 3; (6) Peerally et al. flasin për "contexts of
origin" dhe për termin "root cause analysis": fjalia e faqes 6 u saktësua; (7) Doggett-i është A. Mark Doggett dhe historia
e 1943 është në f. 35, jo 34. Për Shqipërinë dhe Gjermaninë nuk u gjet asnjë shifër për përdorimin e diagramës.

## Tabela e fakteve

| Shifra ose fakti | Burimi | Statusi |
|---|---|---|
| Kaoru Ishikawa, profesor në fakultetin e inxhinierisë të Universitetit të Tokios (1915–1989) | Përmbledhje biografike te faqet e gjetura me WebSearch (ASQ, Wikipedia si fragment kërkimi) | Nuk u konfirmua në asnjë burim të hapur: Doggett-i (2005, f. 35) shkruan vetëm "Professor Kaoru Ishikawa", dhe faqja e ASQ nuk jep as universitetin as vitet. **U hoq** "më vonë profesor në Universitetin e Tokios" nga faqja 3 |
| Diagrama e parë shkak-pasojë u përdor nga Ishikawa në 1943 për t'u shpjeguar një grupi inxhinierësh në Kawasaki Steel Works si mund të renditen dhe të lidhen faktorët e ndryshëm ("how various manufacturing factors could be sorted and interrelated") | Anthony Mark Doggett, "Root Cause Analysis: A Framework for Tool Selection", Quality Management Journal 12(4), 2005, f. 34, siç citohet në burime dytësore | U konfirmua te PDF-ja e Doggett-it, f. 35 (jo f. 34): "Professor Kaoru Ishikawa developed this tool in 1943 to explain to a group of engineers at Kawasaki Steel Works how various manufacturing factors could be sorted and interrelated"; po aty: "it became known as the Ishikawa diagram, or more informally, the 'fishbone'" |
| Pjesët e diagramës: pasoja (problemi) në një kuti në të djathtë, shtylla horizontale, kategoritë kryesore si degë, shkaqet e gjetura me pyetjen "Why does this happen?" | ASQ, "What is a Fishbone Diagram?" dhe postimi myASQ "Seven Basic Quality Tools: The Fish Bone Diagram" | U konfirmua te faqja e ASQ (2026): "Draw a horizontal, right-facing arrow… write the problem statement… and draw a box around it"; "ask 'Why does this happen?'"; "Causes can be written in several places"; "writing subcauses as branches off the causes" |
| Emrat: fishbone, cause-and-effect diagram, Ishikawa diagram; një nga shtatë mjetet bazë të cilësisë | ASQ, faqja e diagramës | U konfirmua te faqja e ASQ: "sometimes referred to as a cause-and-effect diagram or an Ishikawa diagram"; "one of the Seven basic quality tools" |
| Shtatë mjetet bazë origjinale të Ishikawa-s: diagrama shkak-pasojë, fleta e kontrollit, diagrami Pareto, histogrami, diagrami i shpërndarjes, shtresëzimi, karta e kontrollit | Antony, McDermott & Sony (2021), titulli dhe abstrakti ("original seven basic tools"; Pareto, diagramet e shpërndarjes dhe shtresëzimi të përmendura); fragmente të tjera kërkimi | U konfirmua te teksti i plotë, f. 1: "check sheets, histograms, Pareto analysis, cause and effect diagrams, control charts, scatter diagrams, and stratification" |
| Ishikawa: "as much as 95 percent of all quality-related problems in the factory can be solved with seven fundamental quantitative tools" | Ishikawa, What Is Total Quality Control? (1985), siç citohet te burime dytësore; Antony et al. (2021) e testojnë këtë pohim | Fjalia me "in the factory" nuk është te Antony et al.; ata shkruajnë "95% of problems in processes can be solved using the 7 Quality Control (QC) tools" (abstrakti) dhe, sipas Introduction to Quality Control, "the tools, if used skilfully, will enable 95% of workplace problems to be solved" (f. 1). **U ndryshua** në faqe: "95% të problemeve në punë", "të përdorura me mjeshtëri". Libri i 1985 nuk u pa |
| Anketa në internet me 456 profesionistë të lartë të cilësisë nga pesë kontinente; më pak se 25% mendonin se shtatë mjetet "can solve above 95% of quality problems"; Pareto mjeti më i përdorur në të gjithë sektorët, diagramet e shpërndarjes dhe shtresëzimi më pak të përdorurit; mjetet më të përdorura në prodhim, më pak në IT dhe financë | Jiju Antony, Olivia McDermott & Michael Sony, "Revisiting Ishikawa's Original Seven Basic Tools of Quality Control: A Global Study and Some New Insights", IEEE Transactions on Engineering Management 70(11), 2023, 4005–4020 (online korrik 2021), DOI 10.1109/TEM.2021.3095245 | U konfirmua te teksti i plotë dhe **u korrigjua baza**: 456 përgjigje (abstrakti; f. 4: "response rate of 22.8%"), por pyetjen për 95% e morën vetëm të trajnuarit ("If NOT, please do not continue!"): "around 22.6% (90/397) of respondents are in favor" (f. 5), "less than 25% (90/397 or 22.6%)" (f. 12). Kopertina, hyrja dhe faqja 4 thonë tani "397 të trajnuar". Pareto më i përdoruri, shpërndarja dhe shtresëzimi më pak, prodhimi kundrejt IT-së dhe financës: u konfirmua te abstrakti; f. 7 shton se në prodhim dhe në shërbime më e përdorur ishte karta e kontrollit. Studimi zgjati "36 javë"; viti i anketës nuk jepet, ndaj "e botuar në 2021" |
| Te një organizatë prodhuese, profesionistët e cilësisë zgjodhën diagramën shkak-pasojë si mjetin më të përdorur gjatë analizës së shkaqeve rrënjë; vetëm një i anketuar nuk e zgjodhi | Matthew Barsalou, "Determining which of the classic seven quality tools are in the quality practitioner's RCA tool kit", Cogent Engineering 10(1), 2023, DOI 10.1080/23311916.2023.2199516 | U konfirmua te abstrakti (Taylor & Francis), përmes kërkimit. U hoq nga faqja 4 pas printimit të parë: faqja e burimeve mban gjashtë karta, dhe ky është studim i një organizate të vetme; shih "Çfarë nuk hyri" |
| Procedura e ASQ (sipas Tague, The Quality Toolbox): ekipi bie dakord për formulimin e problemit (pasojën), e shkruan në të djathtë në një kuti; zgjedh kategoritë kryesore, me tituj të përgjithshëm nëse s'ka të tjera: Methods, Machines (equipment), People (manpower), Materials, Measurement, Environment; për çdo kategori pyet "Why does this happen?"; një shkak mund të shkruhet në disa vende; pyetet sërish për nënshkaqet | ASQ, faqja e diagramës dhe postimi myASQ; fleta e punës që boton pjesën e ASQ nga Tague (projectacademy.org) | U konfirmua te faqja e ASQ (2026), me dy saktësime: faqja e sotme liston Tague, The Quality Toolbox (bot. 3, 2024) vetëm ndër referencat; shënimi "Excerpted from The Quality Toolbox, Second Edition" ishte në versionin para 2025. Në faqe tani "që citon Quality Toolbox". Lista e sotme e ASQ thotë "Machinery", jo "Machines" (u ndreq në EN) |
| Ishikawa i solli 6M-të si etiketa të përgjithshme për kategoritë, por nxiti krijimtari në emërtimin e tyre | ASQ, faqja e diagramës | U konfirmua te faqja e ASQ (2026): "Ishikawa introduced the '6 M's' as generic labels…, but he also encouraged creativity in naming these categories"; përshkrimet e kategorive dhe "a seventh M: Money" janë po aty dhe tani janë në kolonën e djathtë të faqes 5 |
| Kategoritë për shërbimet: Policies, Procedures, People, Plant/Technology | Tague, The Quality Toolbox, 2nd ed., te pjesa që boton ASQ (fleta e punës në projectacademy.org) | **Nuk u konfirmua dhe u hoq.** Grupi nuk është në asnjë version të faqes së ASQ (2026, 2024, 2019); libri i Tague-s nuk u hap. U hoq nga faqja 5 dhe nga karta e faqes 8 |
| Tri llojet e diagramës: analiza e shpërndarjes (dispersion analysis), klasifikimi sipas procesit të prodhimit (production process classification), numërimi i shkaqeve (cause enumeration) | Ishikawa, Guide to Quality Control, siç e përmbledhin University of Cambridge (Institute for Manufacturing, "TQM Tools"), njësia 10 e IGNOU dhe faqe të tjera | U konfirmua te Doggett (2005), f. 36: "The dispersion CED… why dispersions (or variations) in the problem occur"; "The process classification CED lists all the process steps on the main arrow"; "The cause enumeration CED simply lists all proposed possible causes… and organizes them". Doggett-i citon Ishikawa, Guide to Quality Control, bot. 2, 1982 (APO); libri nuk u pa (prandaj `via` te `ishikawa-guide-1968`). "Si 6M" te karta e parë është shembulli ynë |
| Peerally, Carr, Waring & Dixon-Woods, "The problem with root cause analysis", BMJ Quality & Safety 26(5), 2017, 417–422, DOI 10.1136/bmjqs-2016-005511; publikuar online 23 qershor 2016 | PubMed (27340202); portali i Universitetit të Birmingham-it | U konfirmua te versioni i botuesit në PMC (PMC5530340) |
| Autorët argumentojnë se RCA është zbatuar pa vëmendje të mjaftueshme për kontekstin ku funksionon, dhe se emri "root cause" mund të sugjerojë një shkak të vetëm, gjë që çon në rrëfime tepër të thjeshtuara | Përmbledhje e artikullit te SafetyInsights.org (2021) | U konfirmua te teksti i plotë dhe **u saktësua**: "widely applied without sufficient attention paid to what makes it work in its contexts of origin"; "The first problem with RCA is its name… the term 'root cause analysis' promotes a flawed reductionist view… too often results in a simple linear narrative". Faqja 6 thotë tani "çfarë e bënte të funksiononte aty ku lindi" dhe "termi 'shkak rrënjë'" |
| Kellogg, Hettinger, Shah et al., BMJ Quality & Safety 26(5), 2017, 381–387: 302 RCA në një qendër të madhe mjekësore universitare gjatë tetë vjetëve; 106 propozuan zgjidhje, 499 zgjidhje gjithsej (abstrakti: 731); më të shpeshtat: trajnimi 20%, ndryshimi i procesit 19,6%, përforcimi i rregullores 15,2% | Abstrakti te PubMed (27940638), në fragmente kërkimi; i njëjti tekst te Google Scholar dhe ResearchGate | U konfirmua te PDF-ja e botuesit (302 RCA, f. 383; figura 1: 106 në analizën e zgjidhjeve) dhe **u korrigjua**: "731" del vetëm te abstrakti; teksti (f. 384: "The average number of solutions proposed per RCA was 4.7, with 499 total solutions") dhe tabela 3 ("n=499") japin 499, dhe përqindjet janë nga 499 (trajnimi 100 = 20,0%, ndryshimi i procesit 98 = 19,6%, përforcimi i rregullores 76 = 15,2%). Faqja 7 thotë tani 499; shënimi përmend mospërputhjen |
| Ngjarjet më të shpeshta: komplikime procedurash, arrest kardiopulmonar, dëmtim neurologjik, trup i huaj i harruar; shumë lloje ngjarjesh u përsëritën gjatë periudhës pavarësisht RCA-ve të përsëritura; zgjidhjet më të shpeshta ishin veprime më të dobëta, me më pak gjasa të ulin përsëritjen; 38,7% e RCA-ve me zgjidhje kishin të bënin me vdekjen e pacientit | Po aty | U konfirmua te teksti i plotë (tabela 2: komplikime procedurash 20,7%, arrest kardiopulmonar 13,5%, dëmtim neurologjik 11,5%, trup i huaj 8,2%; "several event types were repeated multiple times"; "the most commonly proposed solutions were weaker actions") |

## Çfarë nuk hyri

- Barsalou (2023): te një prodhues, të gjithë përveç një të anketuari zgjodhën diagramën shkak-pasojë për analizën e
  shkaqeve rrënjë. U konfirmua te abstrakti, por u hoq që burimet të mbeten gjashtë; është një organizatë e vetme.
- Ishikawa, What Is Total Quality Control? The Japanese Way (Prentice-Hall, 1985): libri nuk u pa dhe titulli e faqja e
  citimit për 95% ndryshojnë nga një burim te tjetri. Pohimi hyn përmes Antony et al., që e testojnë.
- Doggett (2004), "A statistical comparison of three root cause analysis tools", Journal of Industrial Technology 20(2):
  grupe studentësh krahasuan diagramën shkak-pasojë, diagramin e ndërlidhjeve dhe pemën e realitetit aktual; sipas një
  rishikimi në bill-wilson.net, dallim domethënës vetëm te lehtësia e përdorimit. Nuk e pamë as abstraktin; nuk hyri.
- "40% e profesionistëve thanë se i kishin zbatuar gabim mjetet": tani u pa te teksti i plotë (f. 10), por me formulim
  të paqartë ("on average 40% of respondents… expressed the view that that the incorrect application of the basic QC tools
  for over 20%"); nuk hyri.
- Grupi për shërbimet (Policies, Procedures, People, Plant/Technology): u hoq në kontrollin e dytë, sepse nuk është në
  asnjë version të faqes së ASQ dhe libri i Tague-s nuk u hap.
- Adoptimi në të gjitha proceset në Fukiai Works të Kawasaki-t në 1952 dhe emri "Ishikawa diagram" që i dha Juran në
  1962: vetëm te faqe dytësore pa burim parësor; nuk hynë.
- Grupi "4S" për shërbimet dhe "8P": vetëm te faqe komerciale. "7M" (Money si M e shtatë) është te faqja e ASQ dhe
  tani përmendet në kolonën e djathtë të faqes 5.
- Watson & Spiridonova, "Fish(bone) Stories", Quality Progress 52(8), 2019 (diagrama në formë dixhitale, mind mapping):
  pamë vetëm përmbledhjen; jashtë argumentit.
- McDermott et al. për mjetet bazë në kujdesin shëndetësor në Evropë (diagrama shkak-pasojë mes më të përdorurave): vetëm
  në një fragment dytësor; nuk hyri.
- Hierarkia e veprimeve të RCA2 (NPSF, 2015) dhe e ISMP-së: veprimet më të forta dhe më të dobëta u trajtuan te Nr. 46;
  këtu vetëm "shih Nr. 46".
- Pareto (Nr. 15) dhe 5 Why: vetëm referencë në shënimin e faqes 8 dhe lidhja me mjetin, pa përsëritur përmbajtjen.
- Shqipëria dhe Gjermania: nuk u gjet asnjë shifër për përdorimin e diagramës Ishikawa.

## Çfarë është editoriale

- Leximet te kutitë "Leximi ynë": diagrama nuk e gjen shkakun, e ndalon ekipin të ndalet te i pari; profesionistët i
  përdorin mjetet gjerë dhe presin më pak se autori, mendësia e duhur; kocka e njerëzve është më e lehta, pyetja e radhës
  është pse procesi e la gabimin të kalonte; shumica e problemeve kanë disa shkaqe, një kockë e rrethuar është vendi ku
  nis kontrolli; gjykoje analizën nga rreshti i fundit (shkaku i kontrolluar me të dhëna, zgjidhja që ndryshon procesin).
- Kartat e faqes 3 (koka, kockat, kockat e vogla) dhe përshkrimet e tri llojeve te faqja 6 janë përmbledhje të redaksisë.
- Katër hapat e faqes 5 shkurtojnë procedurën e ASQ.
- Faqja 7 lidh diagramën me analizat e shkaqeve rrënjë në spital: studimi i Kellogg-ut nuk thotë cilat mjete u përdorën,
  dhe shënimi e thotë se ishin RCA në përgjithësi. E zgjodhëm sepse diagrama shkak-pasojë është mjeti kryesor i RCA-së
  (Barsalou, 2023, i konfirmuar te abstrakti, por jashtë numrit) dhe sepse studimi mat atë që del në fund të një analize.
- Karta e faqes 8 është praktikë e redaksisë, sipas procedurës së ASQ dhe llojeve të Ishikawa-s.
- Lidhja me esenë "Pareto and 5 Why in practice" (faqja 5): eseja thotë "Check the categories before you trust the chart"
  dhe "Do not stop the analysis at a person's name", dhe përshkruan si një vonesë e regjistruar si "driver delay" kishte
  nisur në magazinë. Kjo mbështet pikërisht kutinë e faqes 5 për kockën e njerëzve dhe zgjedhjen e kategorive. Eseja nuk
  flet për diagramën Ishikawa; nuk përsërisim përmbajtjen e saj për Pareto dhe 5 Why.
- Lidhja me mjetin 5 Whys (faqja 8): pasi diagrama jep shkaqet e mundshme dhe të dhënat konfirmojnë njërin, mjeti 5 Whys e
  çon atë degë më thellë. Asnjë mjet i faqes nuk vizaton diagramën kurriz peshku; ky është më i afërti dhe më i ndershmi.
  Mjeti Pareto përmendet vetëm si referencë për numërimin e shkaqeve (Nr. 15).
