# Management Review Nr. 107 · Lodhja nga vendimet: gjyqtarët e uritur

Blloku: Roli. Seria e tretë, Nëntor 2026. Të dhënat janë te `lib/weekly/issues/107.js`.

Çfarë u lexua dhe si (6 nëntor 2026):

- **Danziger, Levav & Avnaim-Pesso (2011)**, "Extraneous factors in judicial decisions", PNAS 108(17):6889–6892:
  teksti i plotë në PubMed Central (PMC3084045), shkarkuar me curl dhe lexuar i tëri, me tabelën 1 dhe shënimet e
  figurave. Materiali suplementar (SI) nuk u lexua; asnjë shifër e numrit nuk vjen prej tij. Pa `via`.
- **Weinshall-Margel & Shapard (2011)**, "Overlooked factors in the analysis of parole decisions", PNAS 108(42):E833
  (letër): faqja e PubMed Central (PMC3198355) nuk u shkarkua dot me curl (kontroll shfletuesi). U lexua e plotë përmes
  mjetit WebFetch, që e hap faqen dhe kthen tekstin; citimet më poshtë janë ato që ktheu mjeti, fjalë për fjalë. Pa `via`.
- **Danziger, Levav & Avnaim-Pesso (2011)**, "Reply to Weinshall-Margel and Shapard: Extraneous factors in judicial
  decisions persist", PNAS 108(42):E834: njësoj, PMC3198336 përmes WebFetch. Pa `via`.
- **Glöckner (2016)**, "The irrational hungry judge effect revisited", Judgment and Decision Making 11(6):601–610:
  PDF i hapur (CC BY 3.0) nga journal.sjdm.org, 10 faqe, lexuar i plotë me pymupdf. Pa `via`.

Nuk u lexua dhe nuk hyri si burim: Hagger & Chatzisarantis (2016), replikimi në 23 laboratorë. Rezultati i tij jepet
vetëm siç e raporton Glöckner (2016), dhe faqja 7 e thotë në shënim. Meta-analiza e Carter & McCullough (2013), që
Glöckner e citon, nuk hyri fare.

Nuk përsëritet: vendimet nën presion dhe intuita janë te Nr. 62, orët pa gjumë dhe lodhja e vërtetë te Nr. 89, opsioni i
paracaktuar te Nr. 93, mbivetëbesimi te Nr. 97, zhurma mes gjyqtarëve (noise audit) te Nr. 20. Shënimet e faqeve 3, 7 dhe
8 çojnë te këta numra.

Lidhjet: mjeti `/tools/shift-handover/` (çdo çështje e hapur merr pronar dhe kalon te turni tjetër) dhe eseja
"solve-it-or-escalate-it", ku matrica e autorit pyet "Can the decision be reversed?" dhe "What happens if I wait?".
Shënimi i faqes 8 e quan "pyetjet e autorit", jo praktikë të provuar.

Pohime që u hoqën ose u ndryshuan gjatë kontrollit: grafiku me minuta "×10" bashkë me fjalët u hoq (shkallë e
përzier) dhe u bë dy shifra; "një rënie rreth 15% pa asnjë planifikim" u bë "me një lidhje të lehtë mes vendimeve ... pa
parashikim" (Glöckner e merr këtë rezultat vetëm me censurim dhe autokorrelacion); "efekti jo i munguar" u bë "nuk e
përjashton" (Glöckner shkruan "if existing at all"); "kurba nuk rivizatohet" mbeti, sepse të dhënat nuk u ndanë kurrë
dhe pikat e Figurës 1 nuk janë në tekst.

Shënim i redaktorit (6 nëntor 2026): dy letrat e PNAS (Weinshall-Margel & Shapard 2011 dhe përgjigjja e Danziger et
al. 2011) u lexuan vetëm si copa të kthyera nga WebFetch; teksti i plotë nuk u hap (PubMed Central ka vetëm PDF, pas
një kontrolli kundër robotëve, dhe PNAS ktheu 403). Prandaj të dy burimet mbajnë `via` ("përmes copave të faqes në
PubMed Central"), sipas metodës editoriale. Shifrat e tyre (15%, 35%, 67%, 39%, 227 vendime) mbeten ashtu siç janë
cituar fjalë për fjalë te copat.

## Tabela e fakteve

| Shifra ose fakti | Burimi | Statusi |
|---|---|---|
| Vendimet në favor bien nga ≈65% në gati zero brenda çdo seance dhe kthehen në ≈65% pas pushimit (kopertina, hyrja, faqja 3) | Danziger et al. (2011), abstrakti dhe rezultatet | U konfirmua te teksti i plotë: "We find that the percentage of favorable rulings drops gradually from ≈65% to nearly zero within each decision session and returns abruptly to ≈65% after a break." |
| 1.112 vendime, 50 ditë në 10 muaj, tetë gjyqtarë, dy komisione (kopertina, faqja 3) | Danziger et al. (2011), Materials and Methods | U konfirmua: "Our data consist of 1,112 judicial rulings, collected over 50 d in a 10-mo period, by eight Jewish-Israeli judges (two females) who preside over two different parole boards that serve four major prisons in Israel." |
| Dy komisionet trajtojnë ~40% të kërkesave të vendit (nuk hyri në faqe; vetëm kontekst) | Danziger et al. (2011) | U konfirmua: "The two parole boards process ∼40% of all parole requests in the country." |
| Përvoja mesatare 22,5 vjet (faqja 3) | Danziger et al. (2011), hyrja | U konfirmua: "experienced judges (mean experience = 22.5 y, SD = 2.5)" |
| 78,2% e kërkesave për lirim me kusht, të tjerat për ndryshim kushtesh (shënimi i faqes 3) | Danziger et al. (2011) | U konfirmua: "The majority of the decisions in our sample (78.2%) consist of parole requests; the remainder consist of parolee requests to change the terms of their parole ... or requests ... to change the terms of their incarceration" |
| 64,2% u refuzuan; shtyrjet 48,4% e refuzimeve; shtyrja numërohet refuzim (faqja 3 dhe shënimi) | Danziger et al. (2011) | U konfirmua: "Under the reject category, we include both final rejections as well as rejections that include a stipulation for review at a later date (such delay decisions constitute 48.4% of the reject category)"; "Overall, 64.2% of prisoner requests in our sample were rejected." |
| Zemra e mëngjesit dhe dreka ndajnë ditën në tri seanca (faqja 3, afati kohor i faqes 4) | Danziger et al. (2011) | U konfirmua: "a late morning snack and lunch—which serve to break up the day's deliberations into three distinct “decision sessions.”" |
| Rënia qëndron pas kontrollit për krimin, muajt, dënimet e mëparshme, rehabilitimin, gjininë, kombësinë; për çdo gjyqtar (faqja 3) | Danziger et al. (2011), Results | U konfirmua: "The covariates included all of the legal attributes of the case that were available in the case file (severity of crime, months served, previous incarcerations, and rehabilitation program), prisoner demographics (sex, nationality)"; "every judge in our sample was more likely to rule in favor of a prisoner at the beginning of a session than at the end of a session (Fig. S1)" |
| Leximi i autorëve: shterim; status quo-ja është jo (faqja 3, karta "Shterimi" e faqes 5) | Danziger et al. (2011) | U konfirmua: "they will be more likely to accept the default, status quo outcome: deny a prisoner's request"; "We have presented evidence suggesting that when judges make repeated rulings, they show an increased tendency to rule in favor of the status quo. This tendency can be overcome by taking a break to eat a meal" |
| Të dhënat nuk u publikuan (shënimi i faqes 3) | Glöckner (2016), f. 608, shënimi 10 | U konfirmua: "Although the authors were willing to share the data, they were prevented from doing so by those who initially gave them access." |
| Pranimet 7,37 min, refuzimet 5,21 min; 89,61 kundrejt 47,36 fjalë (faqja 4, hyrja e faqes 6) | Danziger et al. (2011) | U konfirmua: "favorable rulings took significantly longer (M = 7.37 min, SD = 5.11) than unfavorable rulings (M = 5.21, SD = 4.97)"; "written verdicts of favorable rulings were significantly longer (M = 89.61 words, SD = 65.46) than written verdicts of unfavorable rulings (M = 47.36 words, SD = 43.99)". Në faqe fjalët rrumbullakohen 90 : 47; shënimi jep shifrat e plota |
| Autorët i marrin refuzimet më të shkurtra si shenjë se jo-ja është më e lehtë (shënimi i faqes 4) | Danziger et al. (2011) | U konfirmua: "Two indicators support our view that rejecting requests is an easier decision—and, thus, a more likely outcome—when judges are mentally depleted" |
| Pushimet i cakton gjyqtari, në orë që ndryshojnë (faqja 4) | Danziger et al. (2011) | U konfirmua: "The meal is typically served to the judge at the bench and its timing, which is determined by the judge, varies by day." |
| Zemra nis 9:49–10:27, zgjat mesatarisht 38 min (38,48); dreka nis 12:46–14:10, 57 min (57,37); pas 7,8 dhe 11,4 rasteve (faqja 4) | Danziger et al. (2011) | U konfirmua: "the start time of the morning food break ranged between 9:49 and 10:27 AM ... and lasted an average of 38.48 min"; "the start time of the afternoon (lunch) break ranged between 12:46 and 2:10 PM and lasted an average of 57.37 min"; "The breaks were taken after an average of 7.8 cases ... in the morning session and 11.4 cases ... in the postsnack/prelunch session." |
| Rendi nuk ishte i rastësishëm; të burgosurit pa avokat zakonisht të fundit; komisioni mbaron rastet e një burgu para pushimit (faqja 5) | Weinshall-Margel & Shapard (2011) | U konfirmua (përmes WebFetch): "Within each session, unrepresented prisoners usually go last"; "The most important is that the board tries to complete all cases from one prison before it takes a break" |
| Afiliacioni: Israeli Courts Research Division (Supreme Court); Federal Judicial Center (faqja 5) | Weinshall-Margel & Shapard (2011), metadata e PMC | U konfirmua: "Israeli Courts Research Division, The Supreme Court, Jerusalem ... Federal Judicial Center, Washington, DC" |
| "Gjashtë muaj pas studimit" (faqja 5) | PMC: Danziger botuar online 11 prill 2011; letra 10 tetor 2011 | U konfirmua nga datat e botimit në të dy faqet e PMC ("2011 Apr 11"; "10 10 2011") |
| Pa avokat: rreth një e treta e rasteve, fitojnë 15%; me avokat 35%, me rregullat e Danziger (grafiku i faqes 5) | Weinshall-Margel & Shapard (2011) | U konfirmua (përmes WebFetch): "Using the same decision rules as Danziger et al., our data indicate that unrepresented prisoners ... account for about one-third of all cases ... but they prevail only 15% of the time, whereas prisoners with counsel prevail at a 35% rate." |
| Pa shtyrjet: 67% me avokat, 39% pa avokat (grafiku i faqes 5, faqja 7) | Weinshall-Margel & Shapard (2011) | U konfirmua (përmes WebFetch): "Excluding these deferred cases, our data indicate a success rate of 67% for prisoners with counsel and 39% for unrepresented prisoners." |
| Të dhënat e autorëve plus 12 ditë seancash, 227 vendime (shënimi i faqes 5) | Weinshall-Margel & Shapard (2011) | U konfirmua (përmes WebFetch): "We examined data provided by the authors and obtained additional data from 12 hearing days (n = 227 decisions)." |
| Përgjigjja: rendi dhe pushimi mbeten parashikues të qëndrueshëm me përfaqësimin; avokatët sipas radhës së ardhjes, që përjashton renditjen sipas burgut (faqja 5) | Danziger et al. (2011), reply | U konfirmua (përmes WebFetch): "case order and the meal break remain robust predictors of the parole decision"; "they validated our original report that attorneys represent clients on a first come, first served basis." "This precludes an ordering by prison." |
| Përgjigjja nuk thotë sa mbetet madhësia e efektit (shënimi i faqes 5) | Glöckner (2016), f. 603 | U konfirmua: "Danziger, Levav and Avnaim-Pesso (2011b) show that the downward trend also holds when controlling for representation by an attorney although they do not report whether the magnitude of the effect remains the same" |
| Kartat e faqes 5 (shterim, rend, kohë) | Redaksia | Përmbledhje e redaksisë e tri artikujve; shënimi e thotë |
| Simulimi: 10.000 raste të rastësishme, 36% në favor, 7,37 dhe 5,21 min, kufi 60 minuta, gjyqtari nuk nis rastin që kalon kufirin (faqja 6) | Glöckner (2016), f. 3–4, shënimi 5 dhe shtojca | U konfirmua: "I first generated 10,000 randomly ordered cases, taking into account the base rate of cases that should be decided positively (36%) or negatively (64%)"; "The decision time limit was 60 minutes."; "works on cases until recognizing that a case would go over this limit"; shtojca: "replace time = 5.21 + rnormal()*2 if favorable == 0 / replace time = 7.37 + rnormal()*2 if favorable == 1" |
| Me 5 minuta të mbetura: 12% e rasteve në favor dhe 46% e atyre kundër hyjnë ende (grafiku i faqes 6) | Glöckner (2016), f. 4–5 | U konfirmua: "For 5 minutes remaining, however, only 12% of the favorable cases could still be included in the session, whereas the respective proportion for unfavorable cases is much higher at 46%." |
| Kurba e gjyqtarit racional bie nga 36% drejt zeros (faqja 6) | Glöckner (2016), f. 5 | U konfirmua: "Hence, the probability can be expected to drop from 36% to zero percent for later rulings." |
| Heqja e 5% të fundit zmadhon rënien; pa parashikim, me censurim dhe autokorrelacion, rënie rreth 15% (faqja 6) | Glöckner (2016), f. 5–7 | U konfirmua: "Results remained largely the same, but censoring increased the magnitude of the drop"; "when including censoring and autocorrelation a downward sloping effect appears again"; "caused a drop of roughly 15% only." Autokorrelacioni: "(first-order) autocorrelation of r = .10" |
| Fillimi i simuluar ~45% kundrejt 65%; menaxhimi i kohës shpjegon 15%–45%; efekti i mbivlerësuar, jo i përjashtuar (shënimi i faqes 6) | Glöckner (2016), f. 7–8 | U konfirmua: "in the original data the percentage of favorable rulings started at a higher level than in the current simulations (i.e. 65% instead of 45%)"; "the remaining effects of rational time management could be estimated to account for a drop of 15% to 45% only"; "The analyses reported here indicates that the effect of serial order and mental depletion is overestimated"; "the analyses reported in this paper do not preclude that serial order and mental depletion might have affected the legal judgments" |
| Leximi "kurba nuk provon që nuk ishin" (thirrja e faqes 6) | Glöckner (2016), f. 7 | Lexim i redaksisë, mbështetur te: "Hence, the analyses by DLA do not provide conclusive evidence for the hypothesis that extraneous factors influence legal rulings." |
| Replikimi në 23 laboratorë, N = 2.142, d = 0,04, jo i ndryshëm nga zero (faqja 7) | Glöckner (2016), f. 2 | U konfirmua te Glöckner: "a recent multi-lab registered replication study involving 23 labs (N= 2,142) found an effect of d = 0.04 and not significantly different from zero (Hagger & Chatzisarantis, 2016)". Studimi origjinal nuk u lexua; shënimi e thotë |
| Fushat e faqes 7 dhe karta e faqes 8; thirrjet | Redaksia | Propozim dhe lexime të redaksisë mbi pikat e mosmarrëveshjes së tri artikujve; faqet e thonë |
