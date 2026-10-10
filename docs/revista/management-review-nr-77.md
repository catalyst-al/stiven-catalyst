# Management Review Nr. 77 · Parashikimi i kërkesës: çfarë ndryshoi mësimi i makinës dhe çfarë jo

Blloku: AI. Të dhënat janë te `lib/weekly/issues/77.js`.

Gjatë punës për këtë numër, WebFetch nuk hapi asnjë faqe (çdo domen ktheu `getaddrinfo ENOTFOUND`: ScienceDirect,
ResearchGate, IDEAS/RePEc, Wikipedia, otexts.com, statmodeling.stat.columbia.edu), curl u ndal nga proxy-ja (403), dhe
depot në GitHub të M Competitions nuk ishin të arritshme nga kjo seancë. I vetmi mjet që funksionoi ishte WebSearch.
Prandaj asnjë burim nuk u lexua i plotë: çdo shifër më poshtë u kontrollua te fragmentet (snippets) që kërkimi nxori nga
artikulli i botuar, nga preprint-i i autorëve (PDF te statmodeling.stat.columbia.edu dhe ResearchGate), nga post-print-i
i Universitetit të Bath-it, nga regjistrat e bibliotekave (UNIC, Open University, Lancaster, Manchester, Durham) dhe nga
faqet e otexts.com. Kjo shënohet te fusha `via` e çdo burimi dhe te shënimet e faqeve ("read only in excerpts").
Shifrat për nivelet e hierarkisë te M5 (~40%, ~23%, ~3%) dolën njësoj në dy kërkime të ndryshme, por fjalia e plotë nuk
u pa; janë mesatare të rrumbullakuara. Në fund të punës u mbarua edhe kufiri i kërkimeve (200 për seancë), ndaj disa
pika (emri i fituesit të M4, metoda e dytë te M4) nuk u kontrolluan dhe nuk hynë. Numri 59 (S&OP) mbulon takimin mujor
të planifikimit dhe parashikimin me konsensus te Leitax; këtu nuk përsëritet, vetëm përmendet te shënimi i faqes 8. Për
Shqipërinë dhe Gjermaninë nuk u kërkua dhe nuk hyri asnjë shifër.

## Tabela e fakteve

| Shifra ose fakti | Burimi | Statusi |
|---|---|---|
| Të dhënat e M5: shitjet ditore në copë të 3.049 produkteve të Walmart-it në 10 dyqane në Kaliforni, Teksas dhe Uiskonsin; 3 kategori, 7 reparte; gjithsej 42.840 seri në 12 nivele agregimi (produkt, dyqan, repart, kategori, shtet) | Makridakis, Spiliotis & Assimakopoulos, "The M5 competition: Background, organization, and implementation", International Journal of Forecasting 38(4), 2022, 1325–1336 | U konfirmua te fragmentet e kërkimit (ScienceDirect, IDEAS) dhe te përshkrimet e të dhënave në Kaggle/GitHub. Faqja 3 |
| Horizonti 28 ditë; 30.490 parashikime të kërkuara në nivelin më të ulët (produkt-dyqan), të cilat mblidhen për nivelet e tjera | Makridakis, Spiliotis & Assimakopoulos, "M5 accuracy competition: Results, findings, and conclusions", IJF 38(4), 2022, 1346–1364, DOI 10.1016/j.ijforecast.2021.11.013, abstrakti | U konfirmua te fragmentet e abstraktit. Faqja 3 |
| "Më shumë se pesë vjet" të dhëna ditore | Skedari i Kaggle me 1.941 kolona ditore (d_1…d_1941); datat 29 janar 2011 – qershor 2016 | Fragmente dytësore; data e fundit ndryshon mes burimeve (22 maj ose 19 qershor 2016), ndaj themi vetëm "më shumë se pesë vjet" |
| Matja: WRMSSE; gabimi i çdo serie shkallëzohet me atë të një parashikimi naiv mbi historinë e vet (variant i MASE), peshat sipas shitjeve në dollarë të 28 ditëve të fundit të trajnimit | M5 accuracy (2022) | U konfirmua te fragmentet. Shënimi i faqes 3 |
| Ekipi fitues ishte 22,4% më i saktë se metoda më e mirë e krahasimit (ES_bu, zbutja eksponenciale nga poshtë lart); vetëm pesë fituesit kaluan 20%; të 50 të parët e kaluan 14% | M5 accuracy (2022) | U konfirmua te fragmentet e artikullit të botuar ("all of the top 50 submissions outperformed … by more than 14% … 22.4% for the winning team"). Kopertina, hyrja, faqja 3 |
| Fituesi: mesatare me pesha të barabarta e shumë modeleve LightGBM, të trajnuara në nivel dyqani, dyqan-kategorie dhe dyqan-reparti (në version rekursiv dhe jo-rekursiv) | M5 accuracy (2022) | U konfirmua te fragmentet. "Një metodë e ndërtuar nga pemë vendimesh" është shpjegim i redaksisë për LightGBM |
| Organizatorët ia atribuojnë pjesën tjetër të fitimit "cross-learning"-ut (një model mbi shumë seri të lidhura) dhe natyrës jolineare të modeleve | M5 accuracy (2022) | U konfirmua te fragmentet. Baza e leximit të faqes 3 |
| Nga ekipet në renditjen përfundimtare: 48,4% (2.666) mundën Naive, 35,8% (1.972) sNaive, 7,5% (415) ES_bu. Me dorëzimin më të mirë: 63,7%, 48,8%, 12,2%. Shkaku i dyshuar: rezultate vlerësimi (validation) që çorientuan. Rezervë e autorëve: shumë ekipe pas ES_bu mund të kenë humbur interesin, ndaj shifra mund të jetë disi e anshme | M5 accuracy (2022) | U konfirmua te fragmentet, me numrat absolutë. Grafiku i faqes 4. "Mijëra ekipe" te përmbledhja vjen nga 2.666 ekipe që mundën Naive |
| Përkufizimi i parashikimit naiv: të gjitha parashikimet = vlera e fundit e vëzhguar | Hyndman & Athanasopoulos, Forecasting: Principles and Practice, botimi i 3-të, OTexts, 2021, §5.2 | U konfirmua te fragmentet e otexts.com. Përdoret te hyrja e faqes 4 dhe te faqja 7 |
| Përdorimi i LightGBM te shumica e pjesëmarrësve në krye; kombinimet; informacioni i jashtëm (të gjitha dorëzimet fituese përdorën informacion të jashtëm; çmimet veçanërisht të dobishme) | M5 accuracy (2022) | U konfirmua te fragmentet. Një fragment thoshte "të 50 të parët"; nuk u konfirmua, ndaj themi "shumica" |
| ESX (zbutje eksponenciale me promocionet dhe ditët e veçanta si variabla të jashtme) 6% më e saktë se ES_td; ARIMAX 13% më e saktë se ARIMA_td | M5 accuracy (2022) | U konfirmua te fragmentet. Preprint-i flet për ditët SNAP; versioni i botuar për promocione dhe ditë të veçanta; ndjekim të botuarin. Shënimi i faqes 5 |
| M4: nga 17 metodat më të sakta, 12 ishin kombinime kryesisht të metodave statistikore; surpriza më e madhe ishte një metodë hibride me tipare statistikore dhe ML, rreth 10% më e saktë se kombinimi krahasues (Comb) sipas sMAPE; gjashtë metodat e pastra ML performuan dobët, asnjë nuk e mundi Comb dhe vetëm një e mundi Naïve2 | Makridakis, Spiliotis & Assimakopoulos, "The M4 Competition: Results, findings, conclusion and way forward", IJF 34(4), 2018, 802–808, DOI 10.1016/j.ijforecast.2018.06.001 | U konfirmua te abstrakti në regjistrat e UNIC dhe Open University dhe te fragmentet. "Hibrid statistike dhe rrjeti nervor" mbështetet te një përmbledhje që e quan "hybrid neural network (LSTM) statistical (ES) technique". Faqja 5. 100.000 seritë nga titulli i artikullit të vitit 2020 (IJF 36(1)) |
| Fitimi mesatar i metodave më të mira kundrejt ES_bu: rreth 40% në nivelin 1 (totali), rreth 23% në nivelet 5–7, rreth 3% në nivelet 10–12 (produkt, produkt-shtet, produkt-dyqan); përmirësimet kryesisht në pjesën e sipërme dhe të mesme të hierarkisë | M5 accuracy (2022) | U konfirmua te fragmentet në dy kërkime (e njëjta shifër). Një kërkim tjetër dha "54% në krye, 1,1% në fund" për një krahasim tjetër (CRO/ES); nuk e përdorëm. Grafiku i faqes 6, me "~" |
| Fituesi i përgjithshëm doli i 13-ti, i 12-ti dhe i 11-ti nga 50 të parët në tri nivelet më të ulëta; ishte i pari vetëm te nivelet 3, 7, 8 dhe 9 | M5 accuracy (2022) | U konfirmua te fragmentet. Shënimi i faqes 6 |
| Në nivelin produkt-dyqan: 22.339 seri me kërkesë të ndërprerë (intermittent, 73%), 5.206 "lumpy" (17%), 883 "erratic" (3%), 2.062 të rregullta (7%) | M5 Background (2022) | U konfirmua te fragmentet dhe te një artikull në arXiv (2111.14721) që jep të njëjtën ndarje. Faqja 6 |
| Metodat e thjeshta dhe të lira, si zbutja eksponenciale, ishin ende konkurruese, sidomos në nivelin produkt ose produkt-dyqan | M5 accuracy (2022) | U konfirmua te fragmentet. E njëjta gjë thuhet te "The M5 competition: Conclusions" (Makridakis, Petropoulos & Spiliotis, IJF 38(4), 2022, 1576–1582), por ky burim u hoq për vend |
| Katër metodat e thjeshta si pika krahasimi në gjithë librin (mesatarja, naive, naive sezonale, drift) | Hyndman & Athanasopoulos (2021), §5.2 | U konfirmua te fragmentet. Faqja 7 |
| MAE dhe RMSE; "a forecast method that minimises the MAE will lead to forecasts of the median, while minimising the RMSE will lead to forecasts of the mean"; masat në përqindje (MAPE) "infinite or undefined if y_t = 0 … and having extreme values if any y_t is close to zero"; gabimi i shkallëzuar është nën 1 kur parashikimi është më i mirë se parashikimi naiv mesatar me një hap në të dhënat e trajnimit | Hyndman & Athanasopoulos (2021), §5.8 | U konfirmua te fragmentet e otexts.com dhe te shënimet e kursit të Hyndman-it. Faqja 7 |
| Fildes, Goodwin, Lawrence & Nikolopoulos (2009): mbi 60.000 parashikime dhe rezultate nga katër kompani të zinxhirit të furnizimit (tre prodhues me parashikime mujore: farmaceutikë, ushqime, produkte shtëpiake; një shitës me pakicë me parashikime javore). Ndryshimet më të mëdha ishin më të dobishme; ato më të voglat shpesh e dëmtuan saktësinë. Ndryshimet për lart ishin shumë më pak të mundshme të përmirësonin saktësinë se ato për poshtë, dhe më shpesh në drejtimin e gabuar, që autorët e lidhin me optimizmin | IJF 25(1), 2009, 3–23, DOI 10.1016/j.ijforecast.2008.11.010 | U konfirmua te abstrakti dhe përmbledhjet (regjistrat e Lancaster, Manchester, Bath, Durham; fragmente). Faqja 7 |
| 75% e parashikimeve u ndryshuan me dorë | Fildes & Goodwin, "Good and Bad Judgment in Forecasting: Lessons from Four Companies", Foresight 8, 2007, 5–10 (PDF te forecasters.org) | U konfirmua te pikat kryesore të artikullit në fragmentin e PDF-së. Faqja 7 |

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
