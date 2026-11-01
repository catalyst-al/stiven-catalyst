# Management Review Nr. 85 · Listat e kontrollit: një listë, dy rezultate

Blloku: Operacioni. Seria e tretë, data "Nëntor 2026". Të dhënat janë te `lib/weekly/issues/85.js`.

Shkruar më 1 nëntor 2026. Çdo shifër dhe çdo fakt u kontrollua te teksti i plotë i burimit të vet; curl kaloi përmes
proxy-t, por faqet e NEJM-së kthyen 403 (Cloudflare), prandaj tri artikujt e NEJM-së u lexuan nga kopje të tjera:

- **Haynes et al. (2009)**, NEJM 360(5): 491–99. Lexuar i plotë te Harvard DASH (kopja e artikullit të botuar, f.
  491–499, me tabelat 1–6), `dash.harvard.edu/.../c5287a52-75bc-4131-9262-4c598fcde8cc/content`. Pa `via`.
- **Urbach et al. (2014)**, NEJM 370(11): 1029–38. Lexuar i plotë te PDF-ja e artikullit të botuar ("Downloaded from
  nejm.org at QUEENS UNIV on March 12, 2014"), e futur në paketën e journal club-it të Departamentit të Anesteziologjisë
  së Queen's University (`anesthesiology.queensu.ca/.../2014 April 23.pdf`, f. 1029–1038). Pa `via`.
- **de Vries et al. (2010)**, SURPASS, NEJM 363(20): 1928–37. Artikulli i NEJM-së nuk u hap. U lexua i plotë versioni i
  autorëve, kapitulli 4 i tezës së E. N. de Vries, "Surgical patient safety: analysis and interventions" (Universiteti
  i Amsterdamit, 2010; UvA-DARE, skedari `81308_08.pdf`), i shënuar "Submitted", me të njëjtët autorë, tabela dhe
  rezultate. Shifrat e abstraktit përputhen me abstraktin e NEJM-së te PubMed (27,3 → 16,7 për 100; 15,4% → 10,6%;
  1,5% → 0,8%). Meqë versioni i botuar nuk u pa, burimi mban `via` ("versioni i autorëve në tezën e de Vries").
- **Degani & Wiener (1990)**, NASA Contractor Report 177549, "Human Factors of Flight-Deck Checklists: The Normal
  Checklist", maj 1990. Lexuar i plotë te NASA NTRS (19910017830, PDF me OCR, 71 faqe), përfshirë shtojcën A.
  Artikulli i vitit 1993 te Human Factors ("Cockpit checklists: concepts, design, and use") nuk ka PDF të hapur te NTRS
  dhe nuk u përdor; raporti i 1990-s është burimi i tij.
- **OBSH (2009)**, "Implementation Manual: WHO Surgical Safety Checklist 2009". Lexuar i plotë te IRIS i OBSH-së (PDF,
  20 faqe), nga faqja e botimit `who.int/publications/i/item/9789241598590`.

Nuk u lexua: Dixon-Woods et al. (2011), "Explaining Michigan" (Milbank Quarterly): PMC dhe Wiley kthyen faqe kontrolli
ose 403, kopja te Leicester nuk u gjet. Pronovost et al. (2006, NEJM) nuk u hap. Asnjëri nuk hyri.

Poka-yoke është te Nr. 46 (aty ISMP i vë listat e kontrollit në mes të shkallës së masave); puna standarde te Nr. 35.
Nuk përsëriten; shënimet e faqeve 5 dhe 7 çojnë te to.

## Tabela e fakteve

| Shifra ose fakti | Burimi | Statusi |
|---|---|---|
| Lista e OBSH-së ka 19 pika; tetë spitale në tetë qytete (Toronto, Nju Delhi, Aman, Okland, Manila, Ifakara, Londër, Siatëll); periudha tetor 2007 – shtator 2008 | Haynes et al. (2009), abstrakti | U konfirmua te teksti i plotë: "a program to implement a 19-item surgical safety checklist"; "Between October 2007 and September 2008, eight hospitals in eight cities (Toronto, Canada; New Delhi, India; Amman, Jordan; Auckland, New Zealand; Manila, Philippines; Ifakara, Tanzania; London, England; and Seattle, WA)" |
| Lista konfirmohet me zë nga ekipi në tri momente: para anestezisë, para prerjes, para se pacienti të dalë nga salla | Haynes et al. (2009), "Intervention" dhe tabela 1 | U konfirmua: "The checklist consists of an oral confirmation by surgical teams ... It is used at three critical junctures in care: before anesthesia is administered, immediately before incision, and before the patient is taken out of the operating room." Përmbajtja e tri pjesëve (Sign in, Time out, Sign out) ndjek tabelën 1, e shkurtuar nga redaksia |
| 3.733 pacientë para dhe 3.955 pas | Haynes et al. (2009), "Results" | U konfirmua: "We enrolled 3733 patients during the baseline period and 3955 patients after implementation of the checklist." |
| Ndërlikimet 11,0% → 7,0%; vdekjet në spital 1,5% → 0,8% | Haynes et al. (2009), abstrakti dhe tabela 5 | U konfirmua: "The rate of any complication at all sites dropped from 11.0% at baseline to 7.0% after introduction of the checklist (P<0.001); the total in-hospital rate of death dropped from 1.5% to 0.8% (P = 0.003)" |
| Kopertina: ndërlikimet ranë mesatarisht 36% | Haynes et al. (2009), "Discussion" | U konfirmua: "Postoperative complication rates fell by 36% on average, and death rates fell by a similar amount." 36% është rënie relative; kështu thuhet në kopertinë ("rënia mesatare") |
| Të gjashtë hapat e matur u bënë për 34,2% të pacientëve para dhe 56,7% pas; antibiotikët në kohë nga 56% në 83% | Haynes et al. (2009), "Results", "Discussion" dhe tabela 6 | U konfirmua: "all six measured safety indicators were performed for 34.2% of the patients, with an increase to 56.7%"; "increasing the adherence rate from 56 to 83%" (tabela 6: 56,1 → 82,6) |
| Ekipet duhej të ndalnin, të prezantoheshin dhe të bënin briefing | Haynes et al. (2009), "Discussion" | U konfirmua: "all sites had to introduce a formal pause in care during surgery for preoperative team introductions and briefings and postoperative debriefings" |
| Efekti i vëzhgimit (Hawthorne) nuk u nda dot plotësisht | Haynes et al. (2009), "Discussion" | U konfirmua: "The contribution of the Hawthorne effect is difficult to disentangle in this study." Autorët shtojnë se prania e vëzhguesit në sallë nuk e shpjegoi ndryshimin; në faqe: "nuk e ndau dot plotësisht" |
| Studim para dhe pas, pa grup kontrolli; ndërlikimet në spital deri në 30 ditë | Haynes et al. (2009), "Methods", "Outcomes" | U konfirmua: "a prospective study of preintervention and postintervention periods"; "during the period of postoperative hospitalization, up to 30 days" |
| Nga korriku 2010, Ministria e Shëndetësisë e Ontarios kërkoi raportim publik të përdorimit të listës | Urbach et al. (2014), hyrja | U konfirmua: "the Ministry of Health and Long-Term Care mandated public reporting of adherence to surgical safety checklists for hospitals beginning in July 2010" |
| 101 spitale; 109.341 procedura para dhe 106.370 pas, në periudha tre-mujore | Urbach et al. (2014), abstrakti dhe "Study Periods" | U konfirmua: "During 3-month periods before and after adoption of a surgical safety checklist, a total of 101 hospitals performed 109,341 and 106,370 procedures, respectively." |
| Vdekjet e rregulluara 0,71% → 0,65%; ndërlikimet 3,86% → 3,82%; asnjë ndryshim i rëndësishëm | Urbach et al. (2014), abstrakti, tabela 2 | U konfirmua: "0.71% ... before implementation of a surgical checklist and 0.65% ... afterward (odds ratio, 0.91 ...; P = 0.13). The adjusted risk of surgical complications was 3.86% ... before implementation and 3.82% ... afterward (odds ratio, 0.97 ...; P = 0.29)"; përfundimi: "was not associated with significant reductions in operative mortality or complications" |
| Zbatimi i vetëraportuar: 98% e më shumë pas qershorit 2010 | Urbach et al. (2014), "Discussion" | U konfirmua: "Self-reported compliance by all hospitals in the province is high: 92% from April through June 2010 and never less than 98% after June 2010." |
| Nuk u kërkua trajnim formal i ekipeve; futja nuk u standardizua | Urbach et al. (2014), "Discussion" | U konfirmua: "no formal team training was required before public reporting, and implementation was not standardized" |
| Gjashtë spitale me ndjeshëm më pak ndërlikime, tre me ndjeshëm më shumë | Urbach et al. (2014), "Effect of Checklists in Individual Hospitals" | U konfirmua: "six hospitals had significantly fewer complications after introduction of a checklist, whereas three had significantly more complications" |
| Ontario përdori të dhëna administrative | Urbach et al. (2014), "Methods" dhe kufizimet | U konfirmua: "Using administrative health data"; "we used administrative data to assess surgical complications" |
| Grafiku i faqes 4: vdekjet para dhe pas, tri studime (1,5 → 0,8; 1,5 → 0,8; 0,71 → 0,65) | Haynes (tabela 5), de Vries (tabela 3a), Urbach (tabela 2, të rregulluara) | U konfirmua te të tria tekstet. Përkufizimet ndryshojnë (shënimi i faqes): Haynes "in-hospital rate of death" brenda 30 ditëve; de Vries "In-hospital mortality"; Urbach "death occurring in the hospital or within 30 days after surgery regardless of place", e rregulluar |
| SURPASS ndjek pacientin nga pranimi deri në dalje, jo vetëm në sallë | de Vries et al. (2010), hyrja | U konfirmua te versioni i autorëve: "a multidisciplinary checklist that covers the surgical pathway from admission to discharge" |
| Gjashtë spitale me standarde të larta; futja në nëntë muaj; pesë spitale kontrolli të ngjashme | de Vries et al. (2010), "Methods" | U konfirmua: "The checklist was implemented in six hospitals with high standards of care"; "After the checklist had been implemented in a nine-month period"; "five control hospitals were selected ... with comparable hospital characteristics" |
| Vdekjet në spital 1,5% → 0,8% | de Vries et al. (2010), abstrakti dhe "Results" | U konfirmua: "In-hospital mortality decreased from 1.5% (95% CI 1.2-2.0) to 0.8% (95% CI 0.6-1.1)" |
| Grafiku i faqes 5: ndërlikime për 100 pacientë sipas spitalit: 22,5 → 5,3; 24,9 → 14,0; 16,0 → 12,1; 9,6 → 8,2; 45,7 → 45,4; 37,6 → 18,1 | de Vries et al. (2010), tabela 3a, rreshti "Total" | U konfirmua te tabela 3a (rreshti "Total": "22.5 5.3 24.9 14.0 16.0 12.1 9.6 8.2 45.7 45.4 37.6 18.1 27.3 16.7"). "Hospitals 1 through 4 are regional hospitals; hospitals 5 and 6 are academic hospitals"; "In random order" |
| Diferenca mes spitaleve: ulja absolute nga 19,5 deri në 0,3 për 100 | de Vries et al. (2010), "Results" | U konfirmua: "the ARR in the number of complications per 100 patients ranged from 19.5 to 0.3". Nuk shkruhet në faqe; grafiku e tregon |
| Spitalet universitare kanë pacientë më të rënduar dhe operacione më të mëdha | de Vries et al. (2010), "Discussion" | U konfirmua: "In academic hospitals, patients with more comorbidities are treated and more extensive procedures are performed" |
| Spitalet e kontrollit: 30,4 → 31,2 për 100 pacientë | de Vries et al. (2010), "Results" | U konfirmua: "The number of complications per 100 patients went from 30.4 to 31.2" |
| Mostra 1.146 lista; mediana 80% e pikave e plotësuar; mbi medianë 7,1 për 100, nën të 18,8 | de Vries et al. (2010), "Results" | U konfirmua: "In these 1,146 checklists, a median of 80% (interquartile range 69%-91%) of items per checklist had been completed"; "In patients whose checklist had been completed below median (N=580), the complication rate was 18.8 per 100 patients, versus 7.1 per 100 in the 566 patients whose checklist had been completed above median" |
| Plotësimi u kontrollua në rreth 26% të procedurave | de Vries et al. (2010), "Results" | U konfirmua: "A random sample of approximately 26% (1,146 / 4,387) of checklists" |
| Leximi i faqes 5: autorët tregojnë plotësimin dhe sa ishte bërë lista pjesë e punës | de Vries et al. (2010), "Discussion" | U konfirmua: "there were inter-hospital differences in compliance with the checklist. In addition, there might have been hospitals where checklist integration was not yet optimal after nine months. This might be due both to the existing culture in a hospital or department and to different implementation strategies." |
| Degani & Wiener: 42 ekuipazhe, 72 fluturime; raportet e incidenteve (NTSB, ICAO, ASRS) | Degani & Wiener (1990), 1.3 "Methods" | U konfirmua: "A total of 42 different crews were observed to obtain the data; this amounted to 72 flights (legs) and totaled about 140 flight hours." Burimet: "NASA's Aviation Safety Reporting System (ASRS)", "National Transportation Safety Board (NTSB)", "International Civil Aviation Organization (ICAO)" |
| Raporti doli më 1990; për NASA-n (Ames Research Center) | Degani & Wiener (1990), faqja e titullit | U konfirmua: "NASA Contractor Report 177549 ... May 1990 ... Prepared for Ames Research Center". NTRS e jep datën e publikimit 1991-05; raporti mban "May 1990" |
| Një linjë ajrore me 81 pika për ndezjen, lëvizjen në tokë dhe ngritjen; pilotët shqetësoheshin për disiplinën e dobët | Degani & Wiener (1990), 3.1.6 | U konfirmua: "one company's DC-9-50 checklist ... contained 81 check items for the ENGINE START, TAXI and TAKEOFF task-checklists. Not surprisingly, pilots from this company expressed concern about poor checklist discipline in short-haul operations." |
| Pikat kritike në fillim | Degani & Wiener (1990), shtojca A, udhëzimi 10; 7.2.4 | U konfirmua: "The most critical items on the task-checklist should be listed as close as possible to the beginning of the task-checklist, in order to increase the likelihood of completing the task before interruptions may occur." |
| Përgjigja thotë vlerën, jo "kontrolluar" | Degani & Wiener (1990), shtojca A, udhëzimi 4; 6.2.3 | U konfirmua: "Checklist responses should portray the desired status or the value of the item being considered (not just 'checked' or 'set')." Shembulli "flapat 15" ndjek "flaps--15" të raportit |
| Lista nuk është "vend për hedhje" | Degani & Wiener (1990), shtojca A, udhëzimi 1; 3.2.3 | U konfirmua: "Every effort should be made to avoid using the checklist as a 'site' for resolving discipline problems"; "it becomes a 'dumping site,' to resolve discipline problems ... the importance attached to the procedure by the pilots is reduced" |
| Leximi i faqes 6: çdo pikë e shtuar merr vëmendje nga të tjerat | Degani & Wiener (1990), 7.2.5 | Mbështetet te: "overemphasis of items might diminish the crew's overall checklist performance". Fjalia është e redaksisë (kutia "Leximi ynë") |
| OBSH: pesë deri në nëntë pika për pjesë; jo më shumë se një minutë për pjesë | Manuali i OBSH-së (2009), "Modifying the Checklist" | U konfirmua: "Five to nine items in each Checklist section are ideal"; "The Checklist should take no more than a minute for each section to be completed." |
| OBSH: lista e përdorur vetëm si formular i shkruar do të jetë shumë më pak efektive | Manuali i OBSH-së (2009), "Verbal" | U konfirmua: "The function of the Checklist is to promote and guide a verbal interaction among team members. ... it will likely be far less effective if used solely as a written instrument." |
| OBSH: provë me një ekip për një ditë, ndrysho, provo sërish | Manuali i OBSH-së (2009), "Tested" | U konfirmua: "We also suggest using the Checklist for a single day by a single operating team and collecting feedback. Modify the Checklist ... and then try the Checklist again in a single operating room." |
| OBSH: në provën e saj, vendet që nisën në shumë salla njëherësh hasën rezistencën më të madhe | Manuali i OBSH-së (2009), "Start small, then expand" | U konfirmua: "During the original evaluation by WHO, sites that tried to implement the Checklist in multiple operating rooms simultaneously or hospital-wide faced the most resistance and had the most trouble convincing staff to use the Checklist effectively." |
| Delta 1141 u ngrit pa flapa; koha mes "flaps" dhe "fifteen fifteen green light" më pak se një sekondë | Degani & Wiener (1990), 6.1.1, duke cituar NTSB (1989, f. 61) | U konfirmua te raporti: "the flightcrew did not extend the airplane's flaps or slats for takeoff"; "the proper checklist callouts ... were made"; "the time between the checklist challenge and responses was less that one second". Raporti i NTSB-së nuk u lexua; shënimi i faqes 7 thotë "siç e japin Degani & Wiener". Viti i rrëzimit (1988) nuk është në raport dhe nuk hyri |
| "Sing-song": pilotët thanë se lista bëhet rutinë automatike | Degani & Wiener (1990), 6.1.1 | U konfirmua: "There was almost a consensus among the pilots interviewed that many times checklist procedures become an automatic routine ('sing-song' as some called it). The pilot would 'run' the checklist, but the reply would be done from memory" |

## Çfarë nuk hyri

- Vlerësimi i OBSH-së se 500.000 vdekje në vit mund të parandaloheshin (Urbach et al., hyrja): është vlerësim, jo
  matje; nuk hyri.
- Spitali holandez ku listat u plotësuan plotësisht vetëm në 39% të procedurave (van Klei et al., 2012, siç e citon
  Urbach): burimi primar nuk u lexua; nuk hyri.
- Meta-analiza e tre studimeve para dhe pas (RR 0,57 për vdekjet), siç e citon Urbach: burim dytësor; nuk hyri.
- Rritja e trombozës dhe e ventilimit pas listës në Ontario, dhe rreziku më i lartë i ndërlikimeve në procedurat
  ambulatore (OR 2,55): të konfirmuara te teksti, por jashtë për vend dhe sepse kërkojnë shpjegim.
- Te Degani & Wiener: 76 pika në listën e fluturimit të parë të ditës; krahasimi 50 kundrejt 13 pikave në B-757 mes dy
  linjave; probabiliteti i gabimit 1 në 100 pa shenjë kontrolli dhe 3 në 1.000 me të (Swain & Guttmann, siç i citon
  raporti). Të konfirmuara te raporti; jashtë për vend. E fundit është burim dytësor.
- Ferry Herald of Free Enterprise (1987): e përmendur te raporti; jashtë temës së faqes.
- Pronovost et al. (2006) dhe Dixon-Woods et al. (2011) për projektin e Michiganit: nuk u hapën të plotë.

## Çfarë është editoriale

- Leximet te kutitë "Leximi ynë": lista nuk solli mjekësi të re, por i bëri ekipet të thonë me zë hapat që i dinin dhe
  shpesh i anashkalonin (mbështetet te Haynes: "Both were available at all the sites ... although their use was
  inconsistent", dhe te manuali i OBSH-së: "Many of the individual steps are already accepted as routine practice ...
  though they are rarely followed in their entirety"); 98% numëron shenja, jo ndalesa; një listë, gjashtë rezultate;
  çdo pikë e shtuar merr vëmendje; një listë është në përdorim kur mund ta ndalë punën.
- Shkurtimi i tri ndalesave (faqja 3) dhe i rregullave të ndërtimit (faqja 6) është me fjalët tona.
- Pesë shenjat e faqes 7 ("e vëzhguar, jo vetëm e raportuar", "vlerat të thëna", "koha për pjesë", "ndalesa që
  ndodhin", "e ndryshuar nga përdoruesit") janë përzgjedhje e redaksisë nga Degani & Wiener, manuali i OBSH-së dhe
  studimi i Ontarios. Interpretimi i kohës ("shumë më pak mund të thotë se thuhet përmendsh") është i yni.
- Karta e rishikimit të listës (faqja 8) është propozim i redaksisë; e thotë shënimi.
- Lidhja me esenë "Një SOP e mirë nuk është dokument" (`a-good-sop-is-not-a-document`, faqja 7): eseja pyet nëse një
  procedurë "lexohet apo përdoret", rendit si provë nëse dikush tjetër arrin të njëjtin rezultat nën presion, dhe
  thotë se autori i do listat e kontrollit dhe proceset e ndara në pjesë. Kjo është pyetja e faqes 7 ("E shënuar apo e
  përdorur?"). Autori shkruan aty se provën formale nuk e bëri; faqja nuk pretendon një rast.
- Lidhja me mjetin Leader Standard Work (`/tools/leader-standard-work/`, faqja 8): mjeti e shkruan rutinën ditore të
  drejtuesit si standard, e shënon çdo ditë dhe tregon zbatimin dhe mungesat sipas arsyes; vëzhgimi i listës hyn aty si
  pikë e raundit ditor. Nuk është mjet për ndërtimin e listave; është më i afërti nga mjetet e faqes.
