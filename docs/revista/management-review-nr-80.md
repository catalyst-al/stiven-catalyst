# Management Review Nr. 80 · PDCA: cikli që nuk mbaron

Blloku: Operacioni. Të dhënat janë te `lib/weekly/issues/80.js`. Ky numër mbyll serinë e dytë (41–80); hyrja e thotë me
një fjali.

Kufizim i rëndësishëm i kërkimit: gjatë punës për këtë numër WebFetch nuk hapi asnjë faqe (çdo adresë ktheu
`getaddrinfo ENOTFOUND`: qualitysafety.bmj.com, pmc.ncbi.nlm.nih.gov, europepmc.org, bmchealthservres.biomedcentral.com,
pcics.org, courses.ucsf.edu, apiweb.org, qi.elft.nhs.uk, madje edhe wikipedia.org), curl u ndal nga proxy-ja (403), dhe
buxheti i përbashkët i kërkimeve në web u mbarua para fundit të kontrollit. Prandaj **asnjë burim nuk u lexua i plotë**.
Çdo shifër dhe çdo fakt më poshtë u kontrollua vetëm te pjesët që kthente motori i kërkimit nga faqet e burimeve
(abstrakti i botuar, copa të tekstit të plotë nga kopjet PDF, faqe institucionesh), dhe hyri vetëm kur e njëjta gjë
dilte në të paktën dy kërkime të ndryshme ose ishte citim i drejtpërdrejtë i abstraktit. Kjo shënohet në kolonën e
statusit, në shënimet e faqeve dhe me `via` te çdo burim. Para botimit, ia vlen që dikush me qasje t'i hapë Taylor et
al. (2014, PMC3963536) dhe Knudsen et al. (2019, PMC6778385) dhe të konfirmojë shifrat e faqeve 4 dhe 6.

Historia e ciklit (Shewhart 1939, Deming 1950, PDCA japoneze 1951, PDSA 1993) ndjek artikullin e Moen-it dhe Norman-it,
"Circling Back" (Quality Progress, nëntor 2010), që nuk u pa: e njohim nga përmbledhjet te Quality Digest, te podcast-i
i Deming Institute me Cliff Norman-in dhe Ron Moen-in, te një dokument i Business Wales për historinë e ciklit dhe te
faqe të tjera dytësore. Libri i Shewhart-it (1939), Out of the Crisis (1986), The New Economics (1993) dhe libri i
Ishikawa-s (1985) nuk u panë. Modeli i Përmirësimit dhe tri pyetjet e tij janë te Nr. 69; puna standarde dhe kaizen te
Nr. 35; After Action Review te Nr. 49; variacioni dhe karta e kontrollit të Shewhart-it te Nr. 25. Nuk përsëriten.

## Tabela e fakteve

| Shifra ose fakti | Burimi | Statusi |
|---|---|---|
| Walter A. Shewhart, Statistical Method from the Viewpoint of Quality Control, Graduate School, US Department of Agriculture, Washington, 1939; libri bazohet te leksionet e 1938 në atë shkollë; W. Edwards Deming si ndihmës redaktor ("with the editorial assistance of") | Shewhart (1939); skanimi te AgEcon Search (record 327285); MacTutor (St Andrews), biografia e Shewhart-it | U konfirmua te pjesët e kërkimit (titulli, viti, leksionet e 1938, Deming si ndihmës redaktor). Libri dhe skanimi nuk u hapën (prandaj `via`) |
| Shewhart punonte te Western Electric dhe Bell Telephone Laboratories (deri në 1956) | Encyclopedia of Mathematics (sipas Denis Bayart, StatProb); MacTutor | U konfirmua te pjesët e kërkimit |
| Kapitulli i parë i librit: tri hapat e kontrollit të cilësisë janë specifikimi, prodhimi dhe inspektimi | Shewhart (1939), përmbledhja e kapitullit 1 te WorldCat dhe te katalogë librash | U konfirmua te pjesët e kërkimit |
| Shewhart-i i vizatoi tri hapat si rreth, jo si vijë e drejtë (f. 45 e librit); kjo është "Shewhart cycle" e 1939, e quajtur edhe cikli specifikim-prodhim-inspektim (SPI) | Moen & Norman (2010) sipas përmbledhjeve; diskutimi te forumi i ASQ (cit. f. 45); diagrama te allaboutlean.com | U konfirmua vetëm te burime dytësore; formulimi i Shewhart-it nuk u pa. Fjalia "kur bëhen si vijë, hapat mbarojnë te inspektimi, me një vendim për produktin" është shpjegimi ynë i vijës |
| Në 1950, Deming-u e ndryshoi ciklin e Shewhart-it në një seminar tetëditor për kontrollin statistikor të cilësisë për menaxherë dhe inxhinierë, të organizuar nga JUSE. Hapat: projekto produktin (me provat e duhura); prodhoje dhe provoje në linjë dhe në laborator; nxirre në treg; provoje në përdorim me kërkime tregu; pastaj riprojektoje. Japonezët e quajtën "rrota e Deming-ut" | Moen & Norman (2010), sipas përmbledhjeve (Business Wales, shmula.com, oventhal.com) | U konfirmua vetëm te përmbledhjet. Në faqe hapat janë të shkurtuar ("projekto, prodho, shit, provo në përdorim, riprojekto") |
| PDCA japoneze e 1951: pjesëmarrësit japonezë (JUSE / drejtuesit japonezë sipas Imai-t) e rishkruan rrotën si Plan-Do-Check-Act; sipas Moen-it dhe Norman-it, PDCA ishte "interpretim i mëtejshëm i leksionit nga pjesëmarrësit japonezë" | Moen & Norman (2010), sipas përmbledhjeve | U konfirmua vetëm te përmbledhjet. Burimet dytësore nuk pajtohen plotësisht kush e bëri (JUSE, "drejtuesit japonezë"); në faqe shkruajmë "pjesëmarrësit japonezë" |
| Më 17 nëntor 1990, Deming-u i shkroi Ronald Moen-it për dorëshkrimin e Improving Quality Through Planned Experimentation: "Be sure to call it PDSA, not the corruption PDCA." | Moen & Norman (2010) dhe Cliff Norman te podcast-i i Deming Institute, sipas përmbledhjeve; e njëjta te Process Street | U konfirmua te disa burime dytësore. Një version më i gjatë fillon "If it speaks of the PDSA cycle, ..."; në faqe japim vetëm pjesën që përputhet në të gjitha. Përkthimet janë tonat |
| Në 1986 Deming-u e rishikoi sërish ciklin e Shewhart-it; në 1993 e bëri PDSA, që e quajti "Shewhart cycle for learning and improvement" | Moen & Norman (2010) sipas përmbledhjeve; The Deming Institute | U konfirmua te pjesët e kërkimit. 1986 nuk hyri në kronologji për vend |
| Hapat e PDSA te The New Economics: Plan (një ndryshim ose provë, me një teori); Do: "Carry out the test, comparison, or experiment, preferably on a small scale"; Study: "Study the results. Do they correspond with hopes and expectations? If not, what went wrong?"; Act: "Adopt the change, or abandon it, or run through the cycle again, possibly under different environmental conditions…" | Deming, The New Economics (1993), sipas një ribotimi të pjesës dhe faqes së Deming Institute | U konfirmua te pjesët e kërkimit, jo te libri. Faqja e librit nuk u pa. Në faqe hapat janë të shkurtuar me fjalët tona |
| Deming Institute: Deming-u theksonte PDSA, jo PDCA, me hapin e tretë Study, jo Check; "focus on Check is more about the implementation of a change, with success or failure"; fokusi i tij ishte parashikimi i rezultateve, studimi i rezultateve të vërteta dhe krahasimi për ta rishikuar teorinë | The W. Edwards Deming Institute, "PDSA Cycle" (deming.org) | U konfirmua te pjesët e kërkimit nga faqja e Institutit (e njëjta fjali edhe te faqe që e citojnë). Faqja u përdor si `via` e The New Economics; nuk e numëruam si burim më vete |
| Ishikawa i zgjeroi katër hapat e Deming-ut në gjashtë: cakto qëllimet dhe objektivat; cakto metodat për t'i arritur; edukim dhe trajnim; kryej punën; kontrollo efektet; merr masat e duhura. Plan dhe Do u ndanë secili në dy | University of Cambridge, Institute for Manufacturing, "Deming Cycle – PDCA", duke cituar Ishikawa, What Is Total Quality Control? The Japanese Way, përkth. D. J. Lu, Prentice-Hall, 1985; Friedli et al. (Universiteti i St. Gallen-it) | U konfirmua te pjesët e kërkimit; libri nuk u pa |
| Taylor, McNicholas, Nicolay, Darzi, Bell & Reed, "Systematic review of the application of the plan–do–study–act method to improve quality in healthcare", BMJ Quality & Safety 23(4), 2014, 290–298 | Abstrakti (PubMed 24025320; qualitysafety.bmj.com); kopje PDF (pcics.org, ucsf.edu, crohnscolitisfoundation.org) | Titulli, revista dhe faqet u konfirmuan te disa kërkime. Teksti i plotë nuk u hap |
| U shqyrtuan 409 artikuj; 73 plotësuan kriteret; 47 i dokumentuan ciklet aq hollësisht sa të analizoheshin kundrejt gjithë kornizës | Taylor et al. (2014), abstrakti dhe rezultatet | U konfirmua (73/409 te abstrakti; 47 te pjesët e rezultateve, në disa kërkime) |
| "Less than 20% (14/73) fully documented the application of a sequence of iterative cycles"; "only 15% (7/47) reported the use of quantitative data at monthly or more frequent data intervals" | Taylor et al. (2014), abstrakti | U konfirmua si citim i abstraktit në disa kërkime (grafiku i faqes 4: 14 dhe 7) |
| Nga 33 artikujt me cikle jo të përsëritura, 29 raportuan një cikël të vetëm dhe 4 disa cikle të veçuara, jo të lidhura (14 + 33 = 47) | Taylor et al. (2014), rezultatet | U konfirmua te pjesët e tekstit të plotë në dy kërkime të ndryshme; një kopje e formulon ndryshe ("isolated cycles"), por ndarja 29/4 përsëritet. Grafiku i faqes 4 |
| Përfundimi: shumica e studimeve nuk raportojnë tiparet kryesore metodologjike: ciklet e përsëritura, provat e ndryshimit dhe përdorimi i të dhënave në kohë reale; mungon respektimi i idesë së ndryshimit në shkallë të vogël. Kriteret e kornizës: ciklet e përsëritura, prova e bazuar në parashikim, prova fillestare në shkallë të vogël ("start small in scale and build in scale as confidence grows"), të dhënat në kohë, dokumentimi | Taylor et al. (2014), abstrakti dhe korniza | U konfirmua te pjesët e kërkimit. Pjesa e artikujve me parashikim të shprehur nuk u gjet dhe nuk hyn |
| Søren Valgreen Knudsen, Henrik Vitus Bering Laursen, Søren Paaske Johnsen, Paul Daniel Bartels, Lars Holger Ehlers & Jan Mainz, "Can quality improvement improve the quality of care? A systematic review of reported effects and methodological rigor in plan-do-study-act projects", BMC Health Services Research 19 (683), 2019; Universiteti i Aalborgut | Abstrakti (PubMed 31585540, DOAJ, portali i AAU) | U konfirmua te pjesët e kërkimit. Lista e plotë e autorëve nuk u konfirmua, prandaj "Knudsen et al." |
| 120 projekte përmirësimi me PDSA, të botuara në revista me rishikim nga kolegët në 2015 dhe 2016; pothuajse të gjitha raportuan përmirësim (98%); vetëm 32 (27%) përshkruan një qëllim specifik sasior dhe e arritën; 72 projekte (60%) i dokumentuan ciklet mjaftueshëm për analizën e plotë; prej tyre vetëm tri (4%) respektuan të katër tiparet kryesore metodologjike | Knudsen et al. (2019), abstrakti | U konfirmua si citim i abstraktit në disa kërkime (grafiku i faqes 6, kopertina, hyrja). 98% dhe 27% janë nga 120; 4% nga 72: kështu thuhet në shënim |
| Kontroll i dytë (orkestruesi, pas printimit të parë): autorët, 98%, 32 (27%), 72 (60%) dhe 3 (4%) të 72-ve; kërkimi në PubMed, Embase dhe CINAHL; projektet e botuara në 2015 dhe 2016 | Abstrakti te BMC, DOAJ dhe repozitori i Universitetit të Aalborgut | U konfirmua te abstrakti, përmes kërkimit |
| Katër tiparet: cikli i përsëritur, mbledhja e vazhdueshme e të dhënave, provimi në shkallë të vogël, arsyetimi teorik | Knudsen et al. (2019), sipas pjesëve të tekstit | U konfirmua te pjesët e kërkimit. Në faqe "arsyetimi teorik" bëhet "arsyetim i shprehur për ndryshimin" |
| Autorët: respektimi i ulët i tipareve kryesore "pose a challenge for the legitimacy of PDSA-based QI" | Knudsen et al. (2019), abstrakti | U konfirmua |

## Çfarë nuk hyri

- Pjesët për secilin tipar te Knudsen et al. (iterative 79%, të dhëna të vazhdueshme 67%, arsyetim teorik 36%, shkallë e
  vogël 14%): një përmbledhje i dha me emërues që nuk përputhen (75 projekte = 79%); nuk u konfirmuan.
- Te Taylor et al., "vetëm 2 nga 14 nisën në të vogël dhe e rritën shkallën": e dha vetëm një përmbledhje; një kërkim i
  dytë nuk e gjeti. Nuk hyri. As pjesa e artikujve me parashikim të shprehur nuk u gjet.
- Përkufizimet e Knudsen-it (shkallë e vogël = më pak se një departament; të dhëna të vazhdueshme = të paktën tri pika
  radhazi): vetëm në një përmbledhje; te faqja 7 shkruajmë "në pika të rregullta, jo një para dhe një pas".
- Shënimi i Deming-ut i 1991 ("How the PDCA ever came into existence I know not"): vetëm në burime dytësore; jashtë për vend.
- Cikli i Shewhart-it si hipotezë, eksperiment, provë, dhe fraza "dynamic scientific process of acquiring knowledge":
  nuk u gjetën te një burim i lexueshëm.
- Rrënjët te Galileo, Bacon dhe C. I. Lewis (Moen & Norman): vetëm në përmbledhje; jashtë për vend.
- Mizuno (1959) si burim i PDCA-së me qëllime dhe metoda: vetëm te përmbledhje dhe Wikipedia; nuk hyri.
- Imai, Kaizen (1986) dhe lidhja e rrotës së Deming-ut me PDCA: vetëm te një blog; burimi `imai-1986` mbetet te Nr. 35.
- Hapat e ciklit te Out of the Crisis (1986, f. 88: planifiko, bëj, vëzhgo, studio, përsërit): vetëm te përmbledhje;
  burimi ekzistues `deming-1986` nuk përdoret këtu.
- Reed & Card, "The problem with Plan-Do-Study-Act cycles" (BMJ Quality & Safety, 2016) dhe McNicholas, Bell & Reed,
  "Opening the 'black box'" (2014): nuk u kontrolluan para se të mbaronte buxheti i kërkimeve.
- Langley et al., The Improvement Guide (2009): tri pyetjet dhe PDSA janë te Nr. 69 (`pilot-langley-2009`); këtu vetëm
  referenca "Nr. 69" në shënim.
- Shifra për PDCA jashtë shëndetësisë (prodhim, logjistikë, hoteleri) ose për Shqipërinë dhe Gjermaninë: nuk u gjet
  asnjë rishikim i krahasueshëm. Të dy rishikimet janë nga shëndetësia; kështu thuhet në tekst.

## Çfarë është editoriale

- Leximet te kutitë "Leximi ynë": vija mbaron me vendim, rrethi me pyetje; një rrotullim është provë, jo cikël; kontrolli
  pyet "a e bëmë?", studimi "a kishim të drejtë?"; kur çdo projekt ia del në letër, suksesi thotë pak; cikli mbyllet kur
  veprimi e ndryshon standardin dhe dikush vazhdon ta kontrollojë.
- Fjalia për vijën që "mbaron te inspektimi, me një vendim për produktin" (faqja 3) është shpjegimi ynë.
- Shkurtimi i hapave të Deming-ut dhe të Ishikawa-s (faqet 3 dhe 5) është me fjalët tona.
- Pesë shenjat e faqes 7: katër të parat janë përzgjedhja jonë nga kriteret e Taylor et al. (2014) dhe Knudsen et al.
  (2019); e pesta ("veprimi i shënuar", kush kontrollon që standardi mban) është e redaksisë.
- Karta e ciklit PDSA (faqja 8) është praktikë e redaksisë, sipas hapave të Deming-ut dhe kritereve të dy rishikimeve.
- Lidhja me esenë "Kur përmirësimi shuhet" (`when-improvement-fades`, faqja 7): eseja flet për përmirësimin që mbetet
  vetëm sa zgjat vëmendja e menaxherit, dhe rendit dokumentimin, trajnimin, përgjegjësinë, kontrollin dhe përditësimin si
  ato që e mbajnë gjallë një standard. Kjo është pikërisht shenja e fundit e faqes 7 dhe hapi Act i ciklit. Autori shkruan
  aty se nuk ka një rast të dokumentuar të një përmirësimi që u shua; faqja nuk pretendon një të tillë. Eseja u lidh edhe
  te Nr. 49, në një faqe tjetër dhe për një arsye tjetër (mësimi që zbatohet).
- Lidhja me mjetin Sigma & Control Chart (`/tools/sigma-control-chart/`, faqja 8): hapi Study kërkon të dhëna në kohë,
  dhe mjeti tregon nëse ndryshimi i një shifre është sinjal apo zhurmë, me kartën e kontrollit që vjen nga Shewhart-i.
  Nuk është mjet për PDSA; është më i afërti nga mjetet e faqes. U përdor edhe te Nr. 69.
