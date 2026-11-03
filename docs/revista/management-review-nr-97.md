# Management Review Nr. 97 · Sa i sigurt është menaxheri?

Blloku: Roli. Seria e tretë, Nëntor 2026. Të dhënat janë te `lib/weekly/issues/97.js`.

Çfarë u lexua dhe si (3 nëntor 2026):

- **Ben-David, Graham & Harvey, "Managerial Miscalibration"**, NBER Working Paper 16215 (korrik 2010, i rishikuar
  shtator 2013), PDF në nber.org (39 faqe): lexuar i plotë me pymupdf (teksti, seksionet I–VII, tabelat dhe shënimet).
  Versioni i botuar në revistë nuk u hap; burimi citohet si punim i NBER-it. Pa `via`.
- **Moore & Healy (2008), "The Trouble With Overconfidence"**, Psychological Review 115(2):502–517, kopja e botuar
  (16 faqe) në faqen e autorit Healy (healy.econ.ohio-state.edu): lexuar e plotë. Pa `via`.
- **Moore, Swift, Minster, Mellers, Ungar, Tetlock, Yang & Tenney, "Confidence Calibration in a Multiyear Geopolitical
  Forecasting Competition"**, Management Science, versioni "Articles in Advance" (botuar online më 22 gusht 2016,
  f. 1–15), kopje PDF në stat.berkeley.edu: lexuar e plotë. Citohet me vitin 2016 të kopjes së lexuar; vëllimi dhe
  numri i revistës nuk u panë në tekst dhe nuk hynë. Pa `via`.
- **Chang, Chen, Mellers & Tetlock (2016), "Developing expert political judgment"**, Judgment and Decision Making
  11(5):509–526, akses i hapur (journal.sjdm.org): lexuar i plotë. Pa `via`.

Nuk u hap dhe nuk hyri: **Mellers et al. (2014)**, Psychological Science (escholarship ktheu 403/kopje me fjalëkalim).
Asnjë shifër e tij nuk është në numër; Chang et al. (2016) dhe Moore et al. (2016) e përmendin, por shifrat e numrit
merren vetëm nga tekstet e tyre. **Lichtenstein, Fischhoff & Phillips (1982)** nuk u përdor (DTIC ktheu 403). Murphy &
Winkler (1977) për parashikuesit e motit hyn vetëm si krahasim cilësor siç e bëjnë Moore et al.; shifra Brier 0,13 nuk
hyri.

Nuk përsëritet: intuita dhe vendimet nën presion (Nr. 62), pamja nga jashtë dhe vonesat e projekteve (Nr. 74),
vlerësimet e pavarura (Nr. 83), zhurma mes gjykuesve (Nr. 20, burimi kahneman-2021). Shënimi i faqes 7 çon te Nr. 74 dhe
Nr. 83.

Lidhjet: mjeti `/tools/sigma-control-chart/` (p-chart: sa ndryshon zakonisht një normë; faqja 8 e përdor për të krahasuar
gjerësinë e intervalit me ndryshimin e vërtetë) dhe eseja "high-volume-days" ("A plan that only works when everything
goes as forecast describes an ordinary day"), që i përgjigjet regjistrit të parashikimeve.

Pohime që u hoqën ose u ndryshuan gjatë kontrollit: shifra e kopertinës mbetet "36%" e abstraktit, sepse studimi jep
36,3% (hyrja) dhe 36,6% (seksioni III dhe përfundimi); shënimi i faqes 3 i jep të dyja. "Vetëm 3,4% e CFO-ve dhanë
interval më të gjerë se ai historik" u la jashtë, sepse teksti e lidh një herë me 42,2% dhe një herë me 40,3%. "Në
tremujorët e qetë jo më shumë se 59%/60%" u la jashtë (dy shifra të ndryshme në tekst). Vitet 1–4 të trajnimit nuk u
dhanë veç e veç, sepse tabela 4 dhe teksti i Chang et al. nuk përputhen për N-të e vitit 4; hyri vetëm intervali 6%–12%
që përputhet në të dyja.

## Tabela e fakteve

| Shifra ose fakti | Burimi | Statusi |
|---|---|---|
| Panel 10-vjeçar, 13.346 parashikime njëvjeçare, 40 anketa tremujore qershor 2001 – mars 2011 nga Duke University; shumica CFO | Ben-David et al., abstrakti, I, II.A | U konfirmua: "Using a unique 10-year panel that includes more than 13,300 expected stock market return probability distributions"; "The data were collected in 40 quarterly surveys conducted by Duke University between June 2001 and March 2011"; "our sample includes 13,346 one-year expected returns"; "the majority of whom are CFOs" |
| Pyetja: kthimi i S&P 500 vitin tjetër, 1 në 10 mundësi më poshtë, 1 në 10 më lart; intervali 80% | Ben-David et al., II.A, I | U konfirmua: "There is a 1-in-10 chance the actual return will be less than ___%"; "... greater than ___%"; "provide an 80% confidence interval for their predictions" |
| Përgjigjet 5–8% (shënimi i faqes 3) | Ben-David et al., II.A | U konfirmua: "The usual response rate for the quarterly survey is 5% to 8%" |
| Kthimi ra brenda intervalit 80% rreth 36% të herëve (kopertina, faqja 3) | Ben-David et al., abstrakti, I, III.A, VII | U konfirmua: "realized market returns are within the executives' 80% confidence intervals only 36% of the time" (abstrakti); "only 36.3% of the time" (hyrja); "only 36.6% of the stock market return realizations are within the 80% confidence bounds" (III.A, VII) |
| Tremujorët me VIX mbi medianën: 24,1% | Ben-David et al., IV.B | U konfirmua: "in quarters with an above-median VIX, only 24.1% of the time do one-year-ahead S&P 500 realizations fall within the 80% confidence interval that CFOs provide" |
| Intervalet u zgjeruan kur pasiguria ishte e lartë, por mbikalibrimi ishte më i keq atëherë (thirrja e faqes 3) | Ben-David et al., abstrakti, IV.B | U konfirmua: "executives reduce the lower bound of the forecast confidence interval during times of high market uncertainty; however, ex post miscalibration is worst during periods of high uncertainty"; "widening the confidence interval during times of high market stress does not improve calibration" |
| Intervali mesatar 14,5 pikë; 10–90 përqindëshi historik i kthimeve njëvjeçare 1950–2011: 42,2 | Ben-David et al., III.B | U konfirmua: "For the one-year returns, the 10th and 90th percentiles are -13.4% and 28.8%, respectively. Thus, the confidence interval based on historical returns is 42.2%. In contrast, the average confidence interval across responses is only 14.5%" |
| Parashikimet në mes nuk e parashikuan tregun | Ben-David et al., IV.A | U konfirmua: "The table shows no significant relation between S&P 500 future one-year realizations and CFOs' forecasts" |
| Tri llojet: overestimation, overplacement, overprecision; rreth 64%, 5%, 31% e studimeve empirike; 365 rezultate, 72% empirike | Moore & Healy (2008), f. 502 | U konfirmua: "A search of the PsycINFO database using the word overconfidence yielded 365 hits, 72% of which are empirical studies"; "Roughly 64% of empirical studies on overconfidence examined overestimation"; "Roughly 5% ... examined this phenomenon" (overplacement); "Roughly 31% ... examined overprecision" |
| Detyrat e vështira: mbivlerësim i rezultatit, por besim se je më keq se të tjerët; të lehtat e kundërta; overprecision më këmbëngulëse | Moore & Healy (2008), abstrakti | U konfirmua: "On difficult tasks, people overestimate their actual performances but also mistakenly believe that they are worse than others; on easy tasks, people underestimate their actual performances but mistakenly believe they are better than others"; "Overprecision appears to be more persistent than either of the other 2 types" |
| 82 studentë të Carnegie Mellon, 18 kuize me 10 pyetje, probabiliteti i shpërndarë mbi 11 rezultatet; rregull pikëzimi kuadratik | Moore & Healy (2008), Metoda | U konfirmua: "Participants were 82 students from Carnegie Mellon University"; "In each of 18 rounds, each participant took a 10-item trivia quiz"; "predict the probability (p) that they would obtain each of the 11 possible scores"; "This quadratic scoring rule maximizes participants' expected payoffs if they accurately report their best estimate" |
| Intervali më afër 90%: siguria 90,5%, rezultati brenda 73,1%; para kuizit 55,1%, sapo mbaroi (interim) 85,6%; 20% e vlerësimeve 100% të sigurta | Moore & Healy (2008), Overprecision dhe shënimi 10 | U konfirmua: "On average, this interval covered 3.11 of the 11 possible scores and represented 90.5% confidence. The actual score fell within this range 73.1% of the time"; "hit rates were lowest at the prior phase (55.1%) ... substantially higher at the interim (85.6%) and posterior (84.4%) phases"; "This figure is above 90% due to the 20% of estimates on which people reported that they were 100% sure". Faza "prior" është para kuizit, "interim" pas kuizit para se ta dinin rezultatin |
| Studimet e mëparshme: intervalet 90% e mbajnë përgjigjen 30%–50% | Moore & Healy (2008) | U konfirmua: "prior findings, which documented hit rates of 30% to 50% for 90% confidence intervals (Teigen & Jorgensen, 2005)" |
| Pas kuizeve të vështira +0,79, pas të lehtave −0,22; nuk mësuan gjatë 18 raundeve | Moore & Healy (2008), Overestimation | U konfirmua: "Participants underestimated their performances on easy quizzes (M [] 0.22), overestimated them on difficult quizzes (M [] 0.79)" (shenjat e barazimit/minusit humbën në nxjerrjen e tekstit; drejtimi del nga fjalët "underestimated"/"overestimated" dhe tabela 1); "participants were not learning to make fewer errors estimating their scores over the 18 rounds" |
| Eksperimenti "ilustrues" | Moore & Healy (2008), Limitations | U konfirmua: "The new data we present are illustrative, not definitive." |
| Gara e IARPA-s; Good Judgment Project; 2.860 parashikues, 494.552 parashikime, 344 pyetje, tre vjet; pikëzimi Brier; pyetje të vështira | Moore et al. (2016), Hyrja dhe Metoda | U konfirmua: "Our data comprise 494,552 forecasts on 344 individual forecasting questions over a period of three years from 2,860 forecasters"; "The IARPA scored each research team's forecasts using the Brier score"; "They were, in short, the tough calls." Turnetë nisën në shtator 2011 (Chang et al.: "Four geopolitical forecasting tournaments were conducted between September 2011–April 2012 ...") |
| Mesatarisht 65,4% të sigurt, të saktë 63,3% | Moore et al. (2016), Rezultatet | U konfirmua: "On average, our forecasters reported being 65.4% sure that they had correctly predicted what would happen. In fact, they were correct 63.3% of the time" |
| Mbivlerësimi sipas kushtit: vetëm pa trajnim 4,3; vetëm i trajnuar 2,0; ekip pa trajnim 2,8; ekip i trajnuar 0,7 (grafiku i faqes 6) | Moore et al. (2016), tabela 1 | U konfirmua te tabela 1: Overconfidence (%) 4.3, 2.0, 2.8, 0.7. Në grafik shprehet në pikë përqindjeje (diferenca siguri − qëllime) |
| Trajnimi më pak se një orë | Moore et al. (2016); Chang et al. (2016) | U konfirmua: "Participants in this condition completed the one-hour training online"; Chang: "Training ... was never designed to take more than an hour" |
| Përvoja (më shumë vite) nuk e përmirësoi kalibrimin | Moore et al. (2016) | U konfirmua: "we do not find that having more years of forecasting experience (forecasting tenure) led to an improvement in calibration" |
| Krahasimi me parashikuesit e motit; pikëzim i qartë dhe kthim i shpejtë (thirrja e faqes 6) | Moore et al. (2016), Diskutimi | U konfirmua: "the performance of our forecasters rivals that of the legendary weather forecasters that scholars routinely hold up as the paragons of disciplined calibration"; "The fact that their forecasts would be scored against a clear standard for accuracy was, as with weather forecasters, undoubtedly crucial"; "the quality and regularity of feedback is likely to have been important ... as it is for weather forecasters" |
| Vullnetarë, kryesisht burra me arsim të lartë (shënimi i faqes 6) | Moore et al. (2016), Participants | U konfirmua: "83% of them were male; 26% had Ph.D.s, 37% had master's degrees, 36% had only an undergraduate education, and less than 1% had not graduated from college" |
| Në të katër vitet trajnimi përmirësoi pikët Brier 6%–12% | Chang et al. (2016), 3.1 dhe tabela 4 | U konfirmua: viti 1 "10% and 11%", viti 2 "a 12% score improvement", viti 3 "a 6% score improvement", viti 4 "a 7% score improvement". Abstrakti thotë "by 6 to 11%"; numri ndjek shifrat e vitit në tekst |
| Klasat e krahasimit, parimi më i lidhur me saktësinë | Chang et al. (2016), Përmbledhja | U konfirmua: "The CHAMPS KNOW principle most associated with boosts in accuracy was the use of comparison classes and base-rates" |
| Brier origjinal 0 deri 2 (shënimi i faqes 7) | Chang et al. (2016), 2.2 | U konfirmua: "Brier scores, based on their original formulation, can thus range from 0 to 2"; "Lower Brier scores represent higher levels of accuracy" |
| Shembulli i regjistrit (20 parashikime me 90%, 14 të sakta), katrori Brier për një parashikim, rreshtat e faqes 7 dhe karta e faqes 8 | Redaksia | Të sajuara ose propozim i redaksisë; faqet e thonë. Katrori (p − rezultati)² është forma e thjeshtë për një rezultat; aritmetika: (0,9 − 0)² = 0,81, (0,9 − 1)² = 0,01 |
