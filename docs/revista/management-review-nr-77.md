# Management Review Nr. 77 · Parashikimi i kërkesës: çfarë ndryshoi mësimi i makinës dhe çfarë jo

Blloku: AI. Të dhënat janë te `lib/weekly/issues/77.js`.

Kontrolli i dytë, te tekstet e plota (11 tetor 2026). Në punën e parë WebFetch nuk hapi asnjë faqe dhe curl u ndal nga
proxy-ja; çdo shifër u kontrollua te copat e kërkimit. Në kontrollin e dytë u hapën të plota tri burime: Hyndman &
Athanasopoulos, fpp3, kapitujt 5.2 dhe 5.8 (otexts.com, përmes Wayback Machine); Fildes & Goodwin (2007), PDF-ja e
botuesit te forecasters.org (Foresight, nr. 8, f. 5–10); dhe punimi për saktësinë e M5, por vetëm në versionin paraprak të
autorëve (tetor 2020, PDF te statmodeling.stat.columbia.edu, përmes Wayback). fpp3-së dhe Fildes & Goodwin-it iu hoq `via`;
punimi i M5 mban `via` "The authors' preprint, 2020", sepse versioni i botuar (IJF 38(4), 1346–1364) nuk u hap. Nuk u hapën
(ScienceDirect, Unpaywall, CORE, GitHub dhe Kaggle kthyen 403): punimi për të dhënat e M5 (vetëm abstrakti, nga një kopje
e ScienceDirect në Wayback), M4 (2018) dhe Fildes et al. (2009) (vetëm abstrakti, te portali i Bath-it); ata mbajnë `via`.

Asnjë shifër e shtypur nuk doli ndryshe. U ndreqën katër formulime, të riprintuara në të tri gjuhët: (1) "75% e
parashikimeve u ndryshuan" është mesatare mes kompanive ("On average 75%"; ushqimorja 91%, shitësi me pakicë rreth 8%):
faqja 7 thotë tani "mesatarisht 75%"; (2) te preprint-i, në nivelin produkt-dyqan vlerë kanë ende metodat për kërkesën e
ndërprerë (Croston), jo "zbutja eksponenciale": fjalia e faqes 6 u ndreq; (3) kutia "Leximi ynë" e faqes 3 ia jepte gjithë
fitimin "cross-learning"-ut, ndërsa autorët shkruajnë se "a notable part" erdhi nga sezonaliteti dhe variablat e jashtme dhe
vetëm "the rest" nga cross-learning dhe modelet jolineare: kutia u ndreq; (4) shënimet e faqeve 3 dhe 6 thonë tani çfarë u
lexua. Shënimi për ekipet që "mund të kenë humbur interesin" nuk është te preprint-i; mbetet siç e dhanë copat e versionit
të botuar. Numri 59 (S&OP) mbulon takimin mujor të planifikimit dhe parashikimin me konsensus te Leitax; këtu nuk
përsëritet, vetëm përmendet te shënimi i faqes 8. Për Shqipërinë dhe Gjermaninë nuk u kërkua dhe nuk hyri asnjë shifër.

Kontrolli i dytë, vazhdim (12 tetor 2026), për katër burimet që mbanin `via`. Asnjëri nuk u hap i plotë. M4 (2018): sipas
Unpaywall, OpenAlex dhe Semantic Scholar artikulli është i mbyllur; ScienceDirect, ResearchGate dhe IIF kthyen 403, faqja e
UNIC lidh vetëm te ScienceDirect; kopja në Scribd nuk ka leje të qartë dhe nuk u përdor. Fildes et al. (2009): kopja te
Durham (Unpaywall: "submittedVersion") është pas Cloudflare (403), edhe përmes WebFetch; Lancaster, Bath, Bangor dhe
Manchester nuk kanë skedar. U lexua i plotë punimi paraprak i autorëve te Lancaster (2006, "Producing more efficient demand
forecasts", 37 f.), me më pak të dhëna (mbi 12.000 parashikime). Dy punimet e M5 (2022) janë me qasje të hapur (CC BY) te
ScienceDirect, por ScienceDirect dhe API-ja e Elsevier-it (pa çelës) nuk e japin tekstin, Pure i UNIC nuk ka skedar dhe
scholar.archive.org e CORE kthyen kufi kërkesash (429). Abstraktet e M4 dhe të Fildes et al. u lexuan drejtpërdrejt te
IDEAS/RePEc dhe i konfirmojnë fjalë për fjalë pretendimet e faqeve 5 dhe 7 (shih tabelën); punimi i 2006 konfirmon tre
prodhuesit me të dhëna mujore dhe shitësin me pakicë me parashikime javore. Asnjë shifër e shtypur nuk doli ndryshe dhe
asgjë nuk u ndryshua në faqe. `via` mbetet te të katërt: M4 "Abstract in library records"; Fildes et al. me `via` që
përmend tani abstraktin dhe punimin paraprak të 2006; M5 background dhe M5 accuracy si më parë.

Shënim (27 tetor 2026), sipas historisë së git-it: kontrolli i dytë i 11 tetorit u bë para se numri të dilte online.
Ndryshimet e tij u bënë në degën e punës (commit a8c070b3, 11 tetor 2026) dhe numri hyri në main, nga ku botohet faqja,
vetëm me bashkimin #177 (7b43e7c3, 11 tetor 2026, ora 20:33): versioni i parë online i ka tashmë. Prandaj këto ndryshime
nuk kanë shënim korrigjimi dhe nuk e çojnë numrin te `checked.issues` (lib/weekly/common.js). Pas daljes online nuk
ndryshoi në kontrollin e dytë.

## Tabela e fakteve

| Shifra ose fakti | Burimi | Statusi |
|---|---|---|
| Të dhënat e M5: shitjet ditore në copë të 3.049 produkteve të Walmart-it në 10 dyqane në Kaliforni, Teksas dhe Uiskonsin; 3 kategori, 7 reparte; gjithsej 42.840 seri në 12 nivele agregimi (produkt, dyqan, repart, kategori, shtet) | Makridakis, Spiliotis & Assimakopoulos, "The M5 competition: Background, organization, and implementation", International Journal of Forecasting 38(4), 2022, 1325–1336 | U konfirmua te preprint-i (f. 9, §3.2): "unit sales of 3,049 products, classified in 3 product categories (Hobbies, Foods, and Household), and 7 product departments … sold across 10 stores, located in 3 States (CA, TX, and WI)"; 42.840 seri gjithsej. Abstrakti i punimit për të dhënat (Wayback) jep po ashtu 42.840 seri |
| Horizonti 28 ditë; 30.490 parashikime të kërkuara në nivelin më të ulët (produkt-dyqan), të cilat mblidhen për nivelet e tjera | Makridakis, Spiliotis & Assimakopoulos, "M5 accuracy competition: Results, findings, and conclusions", IJF 38(4), 2022, 1346–1364, DOI 10.1016/j.ijforecast.2021.11.013, abstrakti | U konfirmua te preprint-i (f. 9–10): parashikime 28 ditë përpara; "The template … only referred to the 30,490 series that consist the lowest aggregation level", nivelet e tjera me "aggregating (summing up)" |
| "Më shumë se pesë vjet" të dhëna ditore | Skedari i Kaggle me 1.941 kolona ditore (d_1…d_1941); datat 29 janar 2011 – qershor 2016 | U konfirmua te preprint-i (f. 9): "from 2011-01-29 to 2016-06-19 (1,969 days or approximately 5.4 years)"; trajnimi deri më 2016-05-22 (dita 1.941), prova 2016-05-23 deri 06-19 |
| Matja: WRMSSE; gabimi i çdo serie shkallëzohet me atë të një parashikimi naiv mbi historinë e vet (variant i MASE), peshat sipas shitjeve në dollarë të 28 ditëve të fundit të trajnimit | M5 accuracy (2022) | U konfirmua te preprint-i (f. 11–12): emëruesi është "in-sample, one-step-ahead mean squared error of the Naive method", RMSSE "Like MASE"; peshat sipas shitjeve kumulative në dollarë të 28 vëzhgimeve të fundit |
| Ekipi fitues ishte 22,4% më i saktë se metoda më e mirë e krahasimit (ES_bu, zbutja eksponenciale nga poshtë lart); vetëm pesë fituesit kaluan 20%; të 50 të parët e kaluan 14% | M5 accuracy (2022) | U konfirmua te preprint-i (f. 16): "all top 50 submissions improve … by more than 14%, while the improvements are higher than 20% for the top five … and an impressive 22.4% for the winning team" |
| Fituesi: mesatare me pesha të barabarta e shumë modeleve LightGBM, të trajnuara në nivel dyqani, dyqan-kategorie dhe dyqan-reparti (në version rekursiv dhe jo-rekursiv) | M5 accuracy (2022) | U konfirmua te preprint-i (f. 22): "equal weighted combination (arithmetic mean) of various LightGBM models … per store (10 models), store-category (30 models), and store-department (70 models)"; LightGBM si "gradient boosted trees" (f. 21) |
| Organizatorët ia atribuojnë pjesën tjetër të fitimit "cross-learning"-ut (një model mbi shumë seri të lidhura) dhe natyrës jolineare të modeleve | M5 accuracy (2022) | U konfirmua te preprint-i (f. 29): "A notable part of these improvements is the proper modeling of seasonality and the exploitation of useful explanatory/exogenous variables. The rest of the improvements can probably be attributed to the 'cross-learning' approach adopted, as well as to the non-linear nature of the models". **U ndreq** kutia "Leximi ynë" e faqes 3, që ia jepte gjithë fitimin cross-learning-ut |
| Nga ekipet në renditjen përfundimtare: 48,4% (2.666) mundën Naive, 35,8% (1.972) sNaive, 7,5% (415) ES_bu. Me dorëzimin më të mirë: 63,7%, 48,8%, 12,2%. Shkaku i dyshuar: rezultate vlerësimi (validation) që çorientuan. Rezervë e autorëve: shumë ekipe pas ES_bu mund të kenë humbur interesin, ndaj shifra mund të jetë disi e anshme | M5 accuracy (2022) | U konfirmua te preprint-i (f. 14–15): "2,666 (48.4%) managed to outperform the Naive benchmark, 1,972 (35.8%) outperformed the sNaive benchmark, and 415 (7.5%) beat the top-performing benchmark (ES bu)"; me dorëzimin më të mirë 3.510 (63,7%), 2.685 (48,8%), 672 (12,2%). Aritmetika përputhet me 5.507 ekipe. Shënimi për ekipet që "mund të kenë humbur interesin" nuk është te preprint-i; mbetet sipas copave të versionit të botuar |
| Përkufizimi i parashikimit naiv: të gjitha parashikimet = vlera e fundit e vëzhguar | Hyndman & Athanasopoulos, Forecasting: Principles and Practice, botimi i 3-të, OTexts, 2021, §5.2 | U konfirmua te fpp3, §5.2: "For naïve forecasts, we simply set all forecasts to be the value of the last observation" |
| Përdorimi i LightGBM te shumica e pjesëmarrësve në krye; kombinimet; informacioni i jashtëm (të gjitha dorëzimet fituese përdorën informacion të jashtëm; çmimet veçanërisht të dobishme) | M5 accuracy (2022) | U konfirmua te preprint-i (f. 21: "most of the methods examined utilized LightGBM"; f. 27, gjetja 7: "all winning submissions utilized external information") |
| ESX (zbutje eksponenciale me promocionet dhe ditët e veçanta si variabla të jashtme) 6% më e saktë se ES_td; ARIMAX 13% më e saktë se ARIMA_td | M5 accuracy (2022) | U konfirmua te preprint-i (f. 27): "ESX, which used information about promotions and special events … was 6% better than ES td … ARIMAX was found to be 13% more accurate than ARIMA td". Shtojca (f. 41) e quan variablën e promocioneve ditët SNAP; teksti i preprint-it thotë tashmë "promotions" |
| M4: nga 17 metodat më të sakta, 12 ishin kombinime kryesisht të metodave statistikore; surpriza më e madhe ishte një metodë hibride me tipare statistikore dhe ML, rreth 10% më e saktë se kombinimi krahasues (Comb) sipas sMAPE; gjashtë metodat e pastra ML performuan dobët, asnjë nuk e mundi Comb dhe vetëm një e mundi Naïve2 | Makridakis, Spiliotis & Assimakopoulos, "The M4 Competition: Results, findings, conclusion and way forward", IJF 34(4), 2018, 802–808, DOI 10.1016/j.ijforecast.2018.06.001 | Artikulli nuk u hap (ScienceDirect 403; asnjë kopje e hapur). Të dhënat bibliografike u konfirmuan te Crossref. Mbetet vetëm abstrakti; preprint-i i M5 (f. 24) konfirmon që fituesi i M4 ishte "a hybrid approach that mixed recurrent NNs and exponential smoothing". Kontrolli i dytë (12 tetor): artikulli nuk u hap as tani (Unpaywall/OpenAlex/Semantic Scholar: i mbyllur); abstrakti u lexua drejtpërdrejt te IDEAS/RePEc dhe i mbulon fjalë për fjalë të katër pretendimet e faqes 5: "Out Of the 17 most accurate methods, 12 were 'combinations' of mostly statistical approaches"; "a 'hybrid' approach that utilized both statistical and ML features. This method's average sMAPE was close to 10% more accurate than the combination benchmark"; "The second most accurate method was …" (pra hibridi ishte i pari); "The six pure ML methods performed poorly, with none of them being more accurate than the combination benchmark and only one being more accurate than Naïve2" |
| Fitimi mesatar i metodave më të mira kundrejt ES_bu: rreth 40% në nivelin 1 (totali), rreth 23% në nivelet 5–7, rreth 3% në nivelet 10–12 (produkt, produkt-shtet, produkt-dyqan); përmirësimet kryesisht në pjesën e sipërme dhe të mesme të hierarkisë | M5 accuracy (2022) | U konfirmua te preprint-i (f. 18): "the average improvement of the methods over the benchmark is 40% at level 1, which drops to about 23% at levels 5, 6, and 7, and reaches 3% at levels 10, 11, and 12". Grafiku i faqes 6 |
| Fituesi i përgjithshëm doli i 13-ti, i 12-ti dhe i 11-ti nga 50 të parët në tri nivelet më të ulëta; ishte i pari vetëm te nivelet 3, 7, 8 dhe 9 | M5 accuracy (2022) | U konfirmua te preprint-i (f. 18): "it is the best approach at only levels 3, 7, 8, and 9 … ranked 13rd, 12th, and 11th" |
| Në nivelin produkt-dyqan: 22.339 seri me kërkesë të ndërprerë (intermittent, 73%), 5.206 "lumpy" (17%), 883 "erratic" (3%), 2.062 të rregullta (7%) | M5 Background (2022) | Punimi për të dhënat nuk u hap (vetëm abstrakti). Pjesët (73% / 17% / 7% / 3%) u konfirmuan te teksti i plotë i një punimi të mëvonshëm (arXiv 2111.14721, f. 3); numrat mblidhen në 30.490 (22.339 / 30.490 = 73,3%) |
| Metodat e thjeshta dhe të lira, si zbutja eksponenciale, ishin ende konkurruese, sidomos në nivelin produkt ose produkt-dyqan | M5 accuracy (2022) | **Nuk u gjet** te preprint-i. Më afër është f. 29: "CRO and other standards used for forecasting intermittent demand … seem to hold some value for low cross-sectional levels, especially at the product-store level"; dhe f. 30–31, standardet më të sakta janë "relatively simple to implement and computationally cheap". **U ndreq** fjalia e faqes 6: "metodat standarde për kërkesën e ndërprerë kishin ende njëfarë vlere" |
| Katër metodat e thjeshta si pika krahasimi në gjithë librin (mesatarja, naive, naive sezonale, drift) | Hyndman & Athanasopoulos (2021), §5.2 | U konfirmua te fpp3, §5.2: "We will use four simple forecasting methods as benchmarks throughout this book" (Mean, Naïve, Seasonal naïve, Drift) |
| MAE dhe RMSE; "a forecast method that minimises the MAE will lead to forecasts of the median, while minimising the RMSE will lead to forecasts of the mean"; masat në përqindje (MAPE) "infinite or undefined if y_t = 0 … and having extreme values if any y_t is close to zero"; gabimi i shkallëzuar është nën 1 kur parashikimi është më i mirë se parashikimi naiv mesatar me një hap në të dhënat e trajnimit | Hyndman & Athanasopoulos (2021), §5.8 | U konfirmua fjalë për fjalë te fpp3, §5.8 (edhe për MAPE-n: "infinite or undefined if y_t=0… extreme values if any y_t is close to zero"; dhe për gabimin e shkallëzuar: "less than one if it arises from a better forecast than the average one-step naïve forecast computed on the training data") |
| Fildes, Goodwin, Lawrence & Nikolopoulos (2009): mbi 60.000 parashikime dhe rezultate nga katër kompani të zinxhirit të furnizimit (tre prodhues me parashikime mujore: farmaceutikë, ushqime, produkte shtëpiake; një shitës me pakicë me parashikime javore). Ndryshimet më të mëdha ishin më të dobishme; ato më të voglat shpesh e dëmtuan saktësinë. Ndryshimet për lart ishin shumë më pak të mundshme të përmirësonin saktësinë se ato për poshtë, dhe më shpesh në drejtimin e gabuar, që autorët e lidhin me optimizmin | IJF 25(1), 2009, 3–23, DOI 10.1016/j.ijforecast.2008.11.010 | Artikulli nuk u hap (Lancaster: "Full text not available"; Durham pas Cloudflare; ScienceDirect 403). Abstrakti u lexua drejtpërdrejt te portali i Bath-it ("more than 60,000 forecasts and outcomes from four supply-chain companies"; ndryshimet e mëdha përmirësonin më shumë, të voglat shpesh dëmtonin; ato pozitive ndihmonin më rrallë dhe shkonin më shpesh në drejtim të gabuar, "a general bias towards optimism"). "Tre prodhues çdo muaj, një shitës me pakicë çdo javë" nuk u konfirmua te teksti i 2009; artikulli i Foresight e mbështet që shitësi parashikonte çdo javë. Kontrolli i dytë (12 tetor): artikulli nuk u hap as tani (Durham 403). Abstrakti te IDEAS: "more than 60,000 forecasts and outcomes from four supply-chain companies"; "the relatively larger adjustments tended to lead to greater average improvements in accuracy, the smaller adjustments often damaged accuracy"; "positive adjustments … were much less likely to improve accuracy than negative adjustments. They were also made in the wrong direction more frequently, suggesting a general bias towards optimism". Kompanitë u konfirmuan te punimi paraprak i autorëve (Lancaster 2006, f. 8 e PDF-së): "four companies, three in manufacturing with monthly data (pharmaceuticals (A), food (B), and household products (C)), and one retailer (D) forecasting weekly"; ky punim ka vetëm mbi 12.000 parashikime, ndaj 60.000 mbështetet te abstrakti i 2009 |
| 75% e parashikimeve u ndryshuan me dorë | Fildes & Goodwin, "Good and Bad Judgment in Forecasting: Lessons from Four Companies", Foresight 8, 2007, 5–10 (PDF te forecasters.org) | U konfirmua te PDF-ja e Foresight (f. 6: "On average 75% of the statistical forecasts in our companies were adjusted"; "75% of the forecasts were adjusted") dhe **u saktësua**: është mesatare mes kompanive (ushqimorja 91%, shitësi "only about 8%" nga mbi 26.000 parashikime në javë). Faqja 7 thotë tani "mesatarisht 75%". Edhe: "Large adjustments did tend to be beneficial, but small adjustments did not materially improve forecast accuracy"; "More than a third of the positive adjustments made by the non-retailers were in the wrong direction" (f. 8) |

## Çfarë nuk hyri

- 7.092 pjesëmarrës në 5.507 ekipe nga 101 vende (International Institute of Forecasters, 2020): u konfirmua te faqja e
  IIF, por me tetë burime faqja e burimeve nuk mbante në A5; u zëvendësua me 30.490 parashikimet. "Mbi 8.200
  konkurrentë" te Conclusions numëron të dy sfidat bashkë.
- Emri i ekipit fitues (YJ_STU, një student nga Koreja e Jugut) dhe rezultati i tij WRMSSE: emri u pa te fragmentet,
  rezultati 0,520 jo. ES_bu 0,671 u konfirmua, por nuk hyri.
- "54% në krye dhe 1,1% në nivelin produkt-dyqan", "negativ te nivelet 10–12": fragmente që kundërshtojnë njëra-tjetrën
  dhe i përkasin një krahasimi tjetër; nuk hynë.
- Sfida M5 Uncertainty (fitimet 53%, ~30%, 12% sipas niveleve; 22,6% e ekipeve mundën ARIMA): jashtë temës së saktësisë.
- 883 seri (~2%) me peshë zero në WRMSSE, me më pak se 1,3% të të ardhurave: u konfirmua, jashtë për vend.
- M4: metoda e dytë (kombinim me pesha nga një algoritëm ML) dhe saktësia e intervaleve 95%: nuk u konfirmuan para se të
  mbaronte kufiri i kërkimeve. Emri i fituesit (Slawek Smyl) nuk u kontrollua.
- Fildes & Goodwin (2007): te shitësi me pakicë, ndryshimet për lart "e dyfishuan MAPE nga 32% në 65%" dhe 83% ishin
  shumë të mëdha ose në drejtim të gabuar: vetëm te një blog që e përmbledh artikullin; nuk hyri.
- Hyndman & Koehler (2006), artikulli ku propozohet MASE: nuk u kontrollua veçmas. "MAPE ndëshkon më shumë gabimet
  negative": nuk u konfirmua te fragmentet; nuk hyri.
- Përkufizimi i benchmark-ut sNaive të M5 si "e njëjta ditë javën e kaluar": nuk u konfirmua; në grafik shkruajmë vetëm
  "parashikimi naiv sezonal".
- "The M5 competition: Conclusions" (2022): u konfirmua si botim dhe për pikën e metodave të thjeshta, por u hoq për vend.
- S&OP dhe parashikimi me konsensus (Nr. 59), cilësia e të dhënave (Nr. 30) dhe vendimet me të dhëna (Nr. 20): nuk
  përsëriten.

## Çfarë është editoriale

- Leximet te kutitë "Leximi ynë": fitimi erdhi nga të mësuarit njëherësh nga shumë seri, jo nga një hamendje më e mprehtë
  për çdo produkt (mbështetet te shpjegimi i organizatorëve për cross-learning); një model i ndërlikuar ndërtohet lehtë
  dhe kontrollohet me vështirësi; mësimi i makinës fitoi aty ku kishte shumë seri të lidhura dhe informacion të jashtëm;
  parashikimi që mbush raftin mbetet i pasiguri, planifiko për gabimin; mat çdo dorë mbi parashikimin.
- Dy listat e faqes 5 (M4, M5) janë përmbledhje e redaksisë nga abstrakti i M4 dhe gjetjet e M5.
- Etiketat e grafikut të faqes 6 ("Totali (1)", "Nivelet 5–7", "Produkt, dyqan (10–12)") dhe shenja "~" janë tonat.
- Karta e rishikimit të parashikimit te faqja 8 është praktikë e redaksisë, sipas pikave të krahasimit dhe masave te
  Hyndman & Athanasopoulos dhe ndryshimeve me dorë te Fildes et al. (2009).
- Lidhja me esenë "High-volume days: the standard under pressure" (faqja 6): eseja nis me ditët kur "demand was higher
  than the forecast" në last mile dhe thotë se një plan që funksionon vetëm kur gjithçka shkon sipas parashikimit nuk
  është plan për ditën e vështirë. Kjo mbështet leximin e faqes: parashikimi në nivelin më të ulët mbetet i pasigurt dhe
  stoku, njerëzit dhe kapaciteti planifikohen për gabimin. Eseja nuk flet për metoda parashikimi. E njëjta ese përdoret
  edhe te Nr. 59, por për kapacitetin, jo për gabimin e parashikimit.
- Lidhja me mjetin Sigma Control Chart (faqja 8): rreshti i fundit i kartës kërkon që gabimet mujore të vihen në një kartë
  kontrolli, për të parë nëse parashikimi anon vazhdimisht nga një anë (si ndryshimet optimiste për lart te Fildes et al.).
  Faqja nuk ka mjet për parashikimin; ky është më i afërti i ndershëm.
