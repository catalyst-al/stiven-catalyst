# Management Review Nr. 45 · Puna me turne dhe natën

Blloku: Njerëzit. Të dhënat janë te `lib/weekly/issues/45.js`.

U hapën nga ambienti i punës: përmbledhja "Questions and Answers" e IARC për Vëllimin 124 (PDF), faqja e botimit të
Vëllimit 124 te publications.iarc.who.int, abstrakti i Lancet Oncology dhe i rishikimit Cochrane te PubMed, artikulli i
Folkard-it, Lombardi-t dhe Tucker-it te J-STAGE (PDF i plotë), udhëzuesi HSG256 i HSE-së (PDF i plotë), teksti i
Direktivës 2003/88/KE në Gazetën Zyrtare (PDF te legislation.gov.uk), pikat kryesore të EWCS 2024 te faqja "shorthand" e
Eurofound dhe faqja "Working time" e OSHwiki (EU-OSHA). Nuk u hapën: faqet e eurofound.europa.eu (kontroll sigurie i
Vercel, HTTP 429), EUR-Lex (HTTP 202 pa përmbajtje), teksti i plotë i rishikimit Cochrane (403) dhe artikulli i
Folkard-it dhe Tucker-it te Occupational Medicine (2003, 403). Shifra e Eurofound për 2021 u konfirmua vetëm te OSHwiki,
që e citon raportin e Eurofound; kjo shënohet me `via` te burimi. Data e botimit të pikave kryesore të EWCS 2024 (14 prill
2026) u pa vetëm te rezultatet e kërkimit për faqen e Eurofound. Klasifikimi i IARC jepet me fjalët e IARC ("probably
carcinogenic", Grupi 2A, "limited evidence" te njerëzit) dhe me shënimin e IARC se klasa tregon forcën e provës për një
rrezikshmëri, jo madhësinë e rrezikut; numri nuk jep këshilla mjekësore dhe as ligjore. Për drejtimin e rotacionit, HSE
flet për "limited evidence" dhe Cochrane për prova "very uncertain"; teksti e thotë këtë. Për Shqipërinë: vendi është në
EWCS 2024 (pikat kryesore japin për të shifra për përfaqësimin e punonjësve), por nuk gjetëm shifër për punën natën ose
me turne.

## Tabela e fakteve

| Shifra ose fakti | Burimi | Statusi |
|---|---|---|
| EWCS 2024: 36.644 intervista ballë për ballë në 35 vende. "Shift work: In 2024, 21% of workers worked shifts." "Nights: Some 17% of workers reported working two or more hours between 22:00 and 05:00 at least once a month." "1 out of every 5 workers reported not having 11 hours rest between 2 working days at least once over the month prior to the survey." | Eurofound, "European Working Conditions Survey 2024 – Highlights" (histori dixhitale, 14 prill 2026) | U konfirmua te teksti i faqes eurofound.shorthandstories.com (lexuar me WebFetch dhe me curl). Pikat kryesore nuk thonë qartë nëse 21% dhe 17% janë për BE-27 apo për 35 vendet; prandaj në tekst shkruajmë "në Evropë" dhe jo "në BE". "1 në 5" vizatohet si 20 në grafik, me etiketën "1 në 5" |
| Shqipëria është ndër vendet e EWCS 2024 | Po aty | U konfirmua te teksti: pikat kryesore japin për Shqipërinë rreth 25% përfaqësim të punonjësve në vendin e punës. Lista e 35 vendeve (BE-27, Norvegjia, Zvicra, Shqipëria, Bosnja e Hercegovina, Mali i Zi, Maqedonia e Veriut, Kosova, Serbia) u pa vetëm te rezultati i kërkimit për faqen e Eurofound |
| "The share of workers on 'atypical' schedules, such as weekends or nights, has been decreasing since 2015. However, the share of people doing shift work has remained stable." | Po aty | U konfirmua te teksti i faqes; hyn në shënimin e faqes 3 |
| EWCTS 2021 (anketë telefonike): "A fifth of workers (21%) in the EU27 reported doing night work in 2021"; më e shpeshtë te burrat (25%) se te gratë (17%); tabela: "Working at night (sometimes or more often)" 21 / 25 / 17. Puna natën më e shpeshtë në profesionet e sigurisë (forcat e armatosura, shërbimet e mbrojtjes) dhe në kujdes, si personeli mjekësor | Eurofound, "Working conditions in the time of COVID-19: Implications for the future" (2022), sipas EU-OSHA, OSHwiki, "Working time" (përditësuar 13 shtator 2023) | U konfirmua te teksti i OSHwiki (curl), që citon raportin e Eurofound si referencën [6]. Raporti i Eurofound nuk u hap (HTTP 429). Pyetja ndryshon nga ajo e 2024, ndaj shifrat nuk krahasohen si trend |
| Disa studime me numër të madh incidentesh, me frekuencat e bashkuara: rreziku i incidenteve (lëndime dhe/ose aksidente) rritet 18% në turnin e pasdites dhe 30% në turnin e natës, krahasuar me turnin e mëngjesit, në sisteme me turne 8-orëshe | Simon Folkard, David A. Lombardi & Philip T. Tucker, "Shiftwork: Safety, Sleepiness and Sleep", Industrial Health 43, 2005, f. 20–23 | U konfirmua te PDF-ja e plotë në J-STAGE. Artikull rishikues; studimet bazë janë te Folkard & Tucker (2003) dhe Folkard & Åkerstedt (2004) |
| Shtatë studime raportuan incidentet për çdo natë në të paktën katër net radhazi: rreziku rreth 6% më i lartë natën e dytë, 17% të tretën, 36% të katërtën, krahasuar me natën e parë. Pesë nga shtatë raportuan edhe turnet e mëngjesit/ditës: rreth 2%, 7% dhe 17% më i lartë në të dytin, të tretin dhe të katërtin | Po aty | U konfirmua te PDF-ja. Grafiku "pairs" i faqes 4 dhe shifra e kopertinës (+36%) vijnë nga këtu |
| Krahasuar me turnet 8-orëshe, turnet 10-orëshe kanë rreth 13% rrezik më të lartë dhe ato 12-orëshe 27% (nga katër studime për rrezikun orë pas ore) | Po aty | U konfirmua te PDF-ja. Vlerësim nga një model mbi trendin orë pas ore, jo matje e drejtpërdrejtë e turneve të gjata |
| Autorët: tiparet (gjatësia e turnit, numri i turneve radhazi, pushimet) duhen marrë parasysh "in combination rather than in isolation" | Po aty | U konfirmua te PDF-ja; hyn në shënimin e faqes 4 |
| HSE, Managing shiftwork (HSG256, 2006): "There is limited evidence that the internal body clock adapts more quickly to forward-rotating schedules", nga mëngjesi te pasditja te nata; këshilla: "adopt a forward-rotating schedule … rather than a backward-rotating schedule"; "Either rotate shifts very quickly, eg every 2-3 days or slowly, eg every 3-4 weeks and avoid weekly/fortnightly rotating shift schedules" | Health and Safety Executive, "Managing shiftwork: Health and safety guidance" (HSG256), 2006, versioni falas në internet | U konfirmua te PDF-ja e HSE-së |
| HSE: deri në 12 orë me orët shtesë; turnet e natës dhe puna e rëndë, monotone, e rrezikshme ose kritike për sigurinë deri në 8 orë; për turne të gjata (> 8 orë), netë dhe fillime herët "it may be better to set a limit of 2-3 consecutive shifts", pas tyre 2–3 ditë pushim; 11 orë mes turneve (sipas Working Time Regulations); kur kalohet nga dita te nata ose anasjelltas, të paktën 2 net gjumë të plotë; pa fillime para 7:00 nëse nuk janë rreptësisht të nevojshme; puna e rëndë ose kritike për sigurinë jo natën, në mëngjes herët, në fund të turneve të gjata ose në periudha të tjera me vëmendje të ulët | Po aty, tabelat 3, 4 dhe 7 dhe përmbledhja e këshillave | U konfirmua te PDF-ja. Kartat e faqes 5 janë përmbledhje e redaksisë; "8 për netët dhe punën kritike për sigurinë" e shkurton listën e HSE-së |
| Rishikim Cochrane: 11 studime, 2.125 pjesëmarrës. Përpara kundrejt prapa: tri prova CBA (561 pjesëmarrës), vetëm një me të dhëna të mjaftueshme (62 pjesëmarrës); prova "very low-certainty" se rotacioni përpara nuk e ndryshoi cilësinë e gjumit dhe e uli përgjumjen gjatë turnit. Përfundimi: "Forward and faster rotation may reduce sleepiness during shifts, and may make no difference to sleep quality, but the evidence is very uncertain." | G. Hulsegge et al., "Adapting shift work schedules for sleep quality, sleep duration, and sleepiness in shift workers", Cochrane Database of Systematic Reviews 2023, CD010639.pub2 | U konfirmua te abstrakti në PubMed (PMID 37694838, me eutils). Teksti i plotë nuk u hap (403); prandaj `via: "PubMed"` |
| IARC, takimi 124 (Lion, 4–11 qershor 2019): "night shift work is probably carcinogenic to humans (Group 2A)"; "limited evidence in humans"; lidhje pozitive me kancerin e gjirit, të prostatës, të zorrës së trashë dhe të rektumit; "sufficient evidence in experimental animals for the carcinogenicity of alteration in the light–dark schedule"; "strong mechanistic evidence in experimental systems" (immunosupresion, inflamacion kronik, shumim qelizor). "Limited evidence" do të thotë se rastësia, anshmëria ose faktorët ngatërrues nuk u përjashtuan | IARC, "IARC Monographs Meeting 124: Night Shift Work (4–11 June 2019). Questions and Answers", 5 korrik 2019 | U konfirmua te teksti i PDF-së së IARC (nxjerrë me pdftotext). Përmbledhja te Lancet Oncology 20(8), 2019, f. 1058–1059 (PMID 31281097) u konfirmua te PubMed vetëm si referencë bibliografike |
| Grupi i punës: 27 ekspertë të pavarur nga 16 vende. Përkufizimi: "work, including transmeridian air travel, during the regular sleeping hours of the general population" | Po aty | U konfirmua te PDF-ja. Në tekst e lëmë jashtë fluturimin mes zonave orare, për vend |
| Klasa tregon forcën e provës që një faktor shkakton kancer (rrezikshmërinë), jo nivelin e rrezikut; faktorët e së njëjtës klasë mund të kenë rreziqe shumë të ndryshme. Vlerësimi e vendos punën me turne nate në të njëjtën kategori me punën si parukier ose berber. IARC nuk jep rekomandime për individët: kush shqetësohet "may consult your physician" | Po aty | U konfirmua te PDF-ja |
| Vlerësimi i mëparshëm: në 2007, "shift work that involves circadian disruption", Grupi 2A (Vëllimi 98, botuar 2010); në 2019 faktori u riemërtua "night shift work" | Po aty | U konfirmua te PDF-ja |
| Vëllimi 124, "Night Shift Work", botuar 2020 | IARC Monographs on the Identification of Carcinogenic Hazards to Humans, Vëllimi 124, 2020 | U konfirmua te faqja e botimit në publications.iarc.who.int (WebFetch) |
| Direktiva 2003/88/KE e 4 nëntorit 2003. Neni 2(3): koha e natës, "any period of not less than seven hours, as defined by national law, and which must include, in any case, the period between midnight and 5.00". Neni 2(4)(a): punonjës nate, kush "during night time, works at least three hours of his daily working time as a normal course" (pika (b) i lë shtetet të përcaktojnë edhe një pjesë të kohës vjetore) | Direktiva 2003/88/KE e Parlamentit Evropian dhe e Këshillit, OJ L 299, 18.11.2003 | U konfirmua te teksti i Gazetës Zyrtare (PDF te legislation.gov.uk, versioni "as adopted"). EUR-Lex nuk u hap; prandaj `via: "legislation.gov.uk"` |
| Neni 8: "normal hours of work for night workers do not exceed an average of eight hours in any 24-hour period"; punonjësit e natës me "special hazards or heavy physical or mental strain" jo më shumë se tetë orë "in any period of 24 hours during which they perform night work" | Po aty | U konfirmua te teksti |
| Neni 9: kontroll shëndetësor falas para caktimit dhe "thereafter at regular intervals"; i nënshtrohet fshehtësisë mjekësore; punonjësit me probleme shëndetësore të njohura si të lidhura me punën natën transferohen "whenever possible to day work to which they are suited". Neni 12: mbrojtje e sigurisë dhe shëndetit "appropriate to the nature of their work", shërbime të barasvlershme "available at all times". Neni 13: "the general principle of adapting work to the worker", veçanërisht për "alleviating monotonous work and work at a predetermined work-rate". Neni 3: pushim ditor minimal prej 11 orësh radhazi në çdo 24 orë | Po aty | U konfirmua te teksti. Nenet 10 (garanci) dhe 11 (njoftimi i autoriteteve) nuk hyjnë në faqe për vend |

## Çfarë nuk hyri

- Folkard & Tucker, "Shift work, safety and productivity", Occupational Medicine 53(2), 2003, f. 95–101: abstrakti u pa
  te PubMed, teksti jo (403). Shifrat i marrim nga artikulli i 2005 i të njëjtëve autorë, që i përmbledh.
- Rreziku që dyfishohet mes dy pushimeve (një studim në një fabrikë, Tucker, Folkard & Macdonald, Lancet 2003): u
  konfirmua vetëm si përmbledhje te Folkard et al. (2005); e hoqëm nga faqja për vend.
- Rreziku gjatë natës: sipas Folkard et al. (2005) bie ndjeshëm pas orës 23:00, me vetëm një shenjë të lehtë rritjeje
  mes 03:00 dhe 05:00 (u konfirmua te teksti; shifrat janë vetëm në figurë). E lamë jashtë për vend.
- IARC dhe HSE: "rreth 20% e punonjësve në Amerikën e Veriut, Evropë dhe gjetkë punojnë jashtë turnit standard të
  ditës" (IARC, 2019) dhe "rreth 14% e popullsisë punuese të Britanisë" (HSE, 2006): të konfirmuara, por të vjetra ose
  pa vit të qartë; përdorim EWCS 2024.
- Efektet e tjera shëndetësore që përmend HSE (probleme gastrointestinale, kardiovaskulare, sëmundje të lehta) dhe
  OSHwiki (lodhje, imunitet): HSE i quan "some evidence"; nuk i përfshimë që numri të mos duket si këshillë mjekësore.
- Gjumi: 21% e punonjësve në EWCS 2024 kanë vështirësi gjumi çdo ditë ose disa herë në javë (gra 23%, burra 18%). Shifra
  vlen për të gjithë punonjësit, jo për punën natën, ndaj e lamë jashtë që të mos lexohet si pasojë e turneve.
- Cochrane: rotacioni më i shpejtë lidhej me 0,38 orë më pak gjumë në ditë (prova "very low-certainty"); kufiri prej 16
  orësh në turnet e mjekëve rezidentë: jashtë temës së faqes.
- OSHwiki: Bambra et al. (2008), Knauth & Hornberger (2003, "jo më shumë se tri turne radhazi"), Garde et al. (2020),
  kufiri për gratë shtatzëna: vetëm si citime te OSHwiki, burimet nuk u panë.
- Ligji kombëtar (Gjermania, Shqipëria) dhe përjashtimet e Direktivës (nenet 17–22): nuk u kontrolluan; teksti thotë se
  ligji kombëtar dhe kontratat kolektive caktojnë hollësitë.
- Të dhënat e Eurofound për ditët e punës natën në muaj, 2005–2024 (EF25007_F65): faqja nuk u hap.
- Rastet e njohura (Three Mile Island, Chernobyl, Bhopal, Exxon Valdez) që HSE dhe Folkard et al. i lidhin me lodhjen:
  nuk hyjnë; janë rrëfime dhe jo matje.

## Çfarë është editoriale

- Leximet te kutitë "Leximi ynë": puna natën nuk është rast i veçantë; nata e katërt kushton më shumë se e para dhe sa net
  radhazi vendoset te grafiku; rotacioni përpara është këshillë e arsyeshme, jo ilaç i provuar; për menaxherin mësimi i
  IARC është detyrë kujdesi, jo diagnozë.
- Përmbledhja e këshillave të HSE-së në gjashtë karta te faqja 5.
- Shembulli hipotetik i katër javëve të një ekipi nate te faqja 7: numrat janë të shpikur.
- Karta e kontrollit të turneve te faqja 8 është praktikë e redaksisë, sipas Folkard et al. (2005), HSE (2006) dhe
  Direktivës 2003/88/KE.
- Lidhja me esenë "What a Night Auditor learns about a business that most managers never see" (faqja 3) dhe me mjetin
  Shift Handover (faqja 8).
