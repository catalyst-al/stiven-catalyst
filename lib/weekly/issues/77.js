// Management Review, No. 77: Demand forecasting, what machine learning changed and what it did not. Block: AI.
// Facts and their sources: docs/revista/management-review-nr-77.md. The M5 figures come from the organisers' papers in
// the International Journal of Forecasting 38(4), 2022: the results paper was read in the authors' 2020 preprint, the
// background paper only in its abstract.
// The planning meeting itself is No. 59 (S&OP) and is not repeated.
import { x } from "../common.js";

// A decimal percentage: "22.4%", "22,4%", "22,4 %".
const dpc = (s) => x(`${s}%`, `${s.replace(".", ",")}%`, `${s.replace(".", ",")} %`);

export default {
  number: 77,
  block: "ai",
  date: x("November 2026", "Nëntor 2026", "November 2026"),
  theme: [x("Demand forecasting:", "Parashikimi i kërkesës:", "Bedarfsprognose:"), x("what machine learning changed", "çfarë ndryshoi mësimi i makinës", "was maschinelles Lernen änderte")],
  sub: x(
    "A forecasting competition on Walmart's sales, most teams behind the simple benchmarks, what won twice, where the gains end, how a forecast and a hand adjustment are measured, and a review card.",
    "Një konkurs parashikimi me shitjet e Walmart-it, shumica e ekipeve pas pikave të thjeshta të krahasimit, çfarë fitoi dy herë, ku mbarojnë fitimet, si maten një parashikim dhe një ndryshim me dorë, dhe një kartë rishikimi.",
    "Ein Prognosewettbewerb mit Walmart-Absätzen, die meisten Teams hinter einfachen Vergleichsmethoden, was zweimal gewann, wo die Gewinne enden, wie Prognose und Handkorrektur gemessen werden, und eine Karte."),
  seo: x(
    "Demand forecasting: the M5 and M4 competitions, machine learning against simple benchmarks, gains by level, MAE, MAPE and MASE, hand adjustments and a card.",
    "Parashikimi i kërkesës: konkurset M5 dhe M4, mësimi i makinës kundrejt metodave të thjeshta, fitimet sipas nivelit, MASE, ndryshimet me dorë dhe një kartë.",
    "Bedarfsprognose: M5- und M4-Wettbewerb, maschinelles Lernen gegen einfache Methoden, Gewinne je Ebene, MAE, MAPE, MASE, Handkorrekturen und eine Karte."),
  feature: x(
    "In the M5 competition, thousands of teams forecast the daily sales of 3,049 Walmart products in ten stores, and most of them failed to beat the simple benchmarks. Issue 77 compares what won in M5 with what won in M4 two years earlier, then follows the gains of machine learning down to one product in one store, where they almost disappear. It explains how forecasts and hand adjustments are measured, and ends with a card for a monthly forecast review.",
    "Te konkursi M5, mijëra ekipe parashikuan shitjet ditore të 3.049 produkteve të Walmart-it në dhjetë dyqane, dhe shumica e tyre nuk arritën t'i mundnin metodat e thjeshta të krahasimit. Numri 77 krahason çfarë fitoi te M5 me atë që fitoi te M4 dy vjet më parë, pastaj i ndjek fitimet e mësimit të makinës deri te një produkt në një dyqan, ku gati zhduken. Shpjegon si maten parashikimet dhe ndryshimet me dorë, dhe mbyllet me një kartë për rishikimin mujor të parashikimit.",
    "Im M5-Wettbewerb prognostizierten Tausende Teams die Tagesabsätze von 3.049 Walmart-Produkten in zehn Filialen, und die meisten schlugen die einfachen Vergleichsmethoden nicht. Ausgabe 77 vergleicht, was in M5 gewann, mit dem, was zwei Jahre zuvor in M4 gewann, und verfolgt die Gewinne des maschinellen Lernens bis zu einem Produkt in einer Filiale, wo sie fast verschwinden. Sie erklärt, wie Prognosen und Handkorrekturen gemessen werden, und endet mit einer Karte für die monatliche Prognoseprüfung."),
  figure: { n: dpc("22.4"), by: "Makridakis et al., 2022", t: x(
    "more accurate than the best statistical benchmark: the winner of the M5 competition on Walmart's sales, 2020.",
    "më i saktë se metoda statistikore më e mirë e krahasimit: fituesi i konkursit M5 me shitjet e Walmart-it, 2020.",
    "genauer als die beste statistische Vergleichsmethode: der Sieger des M5-Wettbewerbs mit Walmart-Absätzen, 2020.") },
  teasers: [
    { page: "story", kicker: x("Cover story", "Tema kryesore", "Titelthema"),
      title: x("Ten stores, 42,840 series", "Dhjetë dyqane, 42.840 seri", "Zehn Filialen, 42.840 Reihen") },
    { page: "research", kicker: x("What the research says", "Çfarë thotë kërkimi", "Was die Forschung sagt"),
      title: x("Where the gains end", "Ku mbarojnë fitimet", "Wo die Gewinne enden") },
    { page: "tool", kicker: x("Tool of the issue", "Mjeti i numrit", "Werkzeug der Ausgabe"),
      title: x("The forecast review card", "Karta e rishikimit të parashikimit", "Die Karte zur Prognoseprüfung") },
  ],
  sources: ["fcst-m5-accuracy-2022", "fcst-m5-background-2022", "fcst-m4-2018", "fcst-fpp3-2021", "fcst-fildes-2009", "fcst-fildes-goodwin-2007"],
  pages: [
    { id: "cover", type: "cover" },
    {
      id: "intro", type: "intro",
      why: x(
        "A demand forecast decides what is ordered, how many people are on the roster and how much stock waits on the shelf. Machine learning promises better forecasts. What did the largest open forecasting competitions find it changed, and what did it leave as it was?",
        "Një parashikim i kërkesës vendos çfarë porositet, sa njerëz janë në turn dhe sa stok pret në raft. Mësimi i makinës premton parashikime më të mira. Çfarë gjetën konkurset më të mëdha të hapura të parashikimit për atë që ndryshoi mësimi i makinës dhe për atë që la siç ishte?",
        "Eine Bedarfsprognose entscheidet, was bestellt wird, wie viele Leute im Dienstplan stehen und wie viel Bestand im Regal wartet. Maschinelles Lernen verspricht bessere Prognosen. Was haben die größten offenen Prognosewettbewerbe gefunden: Was hat es geändert, und was blieb, wie es war?"),
      body: x(
        "In the M5 competition of 2020, the winner forecast Walmart's sales 22.4% more accurately than exponential smoothing, yet only 7.5% of the teams beat that benchmark. In M4 and M5 alike, combinations won; machine learning won when it learned across many related series. The gains were large for total sales and small for one product in one store. Simple benchmarks tell whether a method helped, and four companies show when a planner's hand adjustment helped.",
        "Te konkursi M5 i vitit 2020, fituesi i parashikoi shitjet e Walmart-it 22,4% më saktë se zbutja eksponenciale, por vetëm 7,5% e ekipeve e mundën këtë metodë. Si te M4, ashtu edhe te M5, fituan kombinimet; mësimi i makinës fitoi kur mësoi njëherësh nga shumë seri të lidhura. Fitimet ishin të mëdha për shitjet totale dhe të vogla për një produkt në një dyqan. Metodat e thjeshta tregojnë nëse një metodë ndihmoi, dhe katër kompani tregojnë kur ndihmoi ndryshimi me dorë i planifikuesit.",
        "Im M5-Wettbewerb 2020 prognostizierte der Sieger Walmarts Absätze um 22,4 % genauer als die exponentielle Glättung, doch nur 7,5 % der Teams schlugen diese Vergleichsmethode. In M4 wie in M5 gewannen Kombinationen; maschinelles Lernen gewann, wenn es über viele verwandte Reihen zugleich lernte. Für den Gesamtabsatz waren die Gewinne groß, für ein Produkt in einer Filiale klein. Einfache Vergleichsmethoden zeigen, ob eine Methode half, und vier Unternehmen zeigen, wann die Handkorrektur eines Planers half."),
    },
    {
      id: "story",
      kicker: x("Cover story", "Tema kryesore", "Titelthema"),
      title: [x("Ten stores,", "Dhjetë dyqane,", "Zehn Filialen,"), x("42,840 series", "42.840 seri", "42.840 Reihen")],
      lead: x(
        "In 2020 the M5 competition gave forecasters more than five years of daily unit sales from Walmart: 3,049 products in ten stores in California, Texas and Wisconsin. The task was to forecast the next 28 days.",
        "Më 2020, konkursi M5 u dha parashikuesve më shumë se pesë vjet shitje ditore në copë nga Walmart-i: 3.049 produkte në dhjetë dyqane në Kaliforni, Teksas dhe Uiskonsin. Detyra ishte të parashikoheshin 28 ditët e ardhshme.",
        "2020 gab der M5-Wettbewerb Prognostikern mehr als fünf Jahre tägliche Stückabsätze von Walmart: 3.049 Produkte in zehn Filialen in Kalifornien, Texas und Wisconsin. Aufgabe war, die nächsten 28 Tage vorherzusagen."),
      blocks: [
        { type: "figures", compact: true, items: [
          { n: x("42,840", "42.840", "42.840"), t: x("series in 12 levels: each product in each store, summed by department, category, store and state", "seri në 12 nivele: çdo produkt në çdo dyqan, i mbledhur sipas repartit, kategorisë, dyqanit dhe shtetit", "Reihen auf 12 Ebenen: jedes Produkt je Filiale, summiert nach Abteilung, Kategorie, Filiale und Bundesstaat") },
          { n: x("30,490", "30.490", "30.490"), t: x("forecasts asked for at the lowest level, one product in one store; the rest summed up from them", "parashikime të kërkuara në nivelin më të ulët, një produkt në një dyqan; të tjerat mblidhen prej tyre", "Prognosen auf der untersten Ebene, ein Produkt je Filiale; der Rest daraus summiert") },
        ] },
        { type: "p", text: x(
          "The winning team was 22.4% more accurate than the best statistical benchmark, exponential smoothing. Only the top five passed 20%; all of the top 50 passed 14%. The winner averaged, with equal weights, many LightGBM models, a method built from decision trees, each trained across all the series of a store, a store category or a store department.",
          "Ekipi fitues ishte 22,4% më i saktë se metoda statistikore më e mirë e krahasimit, zbutja eksponenciale. Vetëm pesë të parët kaluan 20%; të 50 të parët kaluan 14%. Fituesi bëri mesataren, me pesha të barabarta, të shumë modeleve LightGBM, një metodë e ndërtuar nga pemë vendimesh, secili i trajnuar mbi të gjitha seritë e një dyqani, të një kategorie ose të një reparti në dyqan.",
          "Das Siegerteam war 22,4 % genauer als die beste statistische Vergleichsmethode, die exponentielle Glättung. Nur die ersten fünf kamen über 20 %, alle 50 besten über 14 %. Der Sieger mittelte gleich gewichtet viele LightGBM-Modelle, ein Verfahren aus Entscheidungsbäumen, jedes über alle Reihen einer Filiale, Filialkategorie oder Filialabteilung trainiert.") },
        { type: "callout", reading: true, text: x(
          "Part of the gain came from modelling seasonality and using outside information such as prices; the rest, the organisers think, from learning across thousands of related series at once.",
          "Një pjesë e fitimit erdhi nga modelimi i sezonalitetit dhe nga informacioni i jashtëm, si çmimet; pjesa tjetër, mendojnë organizatorët, nga të mësuarit njëherësh nga mijëra seri të lidhura.",
          "Ein Teil des Gewinns kam von der Saisonmodellierung und äußeren Informationen wie Preisen; der Rest, meinen die Veranstalter, vom Lernen über Tausende verwandter Reihen zugleich.") },
      ],
      note: x(
        "Accuracy as WRMSSE: each series' error scaled by that of a naive forecast and weighted by its dollar sales. The results paper was read in the authors' 2020 preprint; the background paper only in its abstract.",
        "Saktësia si WRMSSE: gabimi i çdo serie i shkallëzuar me atë të një parashikimi naiv dhe i peshuar me shitjet e saj në dollarë. Punimi me rezultatet u lexua në versionin paraprak të autorëve (2020); punimi për të dhënat vetëm te abstrakti.",
        "Genauigkeit als WRMSSE: Fehler jeder Reihe skaliert am Fehler einer naiven Prognose und gewichtet nach ihrem Umsatz in Dollar. Die Ergebnisarbeit lag als Vorabfassung der Autoren (2020) vor, die Arbeit zu den Daten nur als Abstract."),
      source: ["fcst-m5-background-2022", "fcst-m5-accuracy-2022"],
    },
    {
      id: "numbers",
      kicker: x("The numbers", "Shifrat", "Die Zahlen"),
      title: [x("Most did not beat", "Shumica nuk i mundi", "Die meisten schlugen"), x("the simple ones", "të thjeshtat", "die einfachen nicht")],
      lead: x(
        "Next to the entries, the organisers ran benchmarks, from the naive forecast, which repeats the last value, to exponential smoothing. Of the teams in the final ranking, the share that beat each one:",
        "Pranë pjesëmarrësve, organizatorët vunë metoda krahasimi, nga parashikimi naiv, që përsërit vlerën e fundit, deri te zbutja eksponenciale. Nga ekipet në renditjen përfundimtare, pjesa që e mundi secilën:",
        "Neben den Einsendungen ließen die Veranstalter Vergleichsmethoden laufen, von der naiven Prognose, die den letzten Wert wiederholt, bis zur exponentiellen Glättung. Der Anteil der Teams in der Schlusswertung, der jede davon schlug:"),
      blocks: [
        { type: "hbars", source: ["fcst-m5-accuracy-2022"],
          label: x("Teams that beat each benchmark, M5 accuracy, 2020", "Ekipet që e mundën secilën metodë krahasimi, M5, 2020", "Teams, die jede Vergleichsmethode schlugen, M5, 2020"),
          items: [
            { k: x("Naive forecast", "Parashikimi naiv", "Naive Prognose"), v: 48.4, n: dpc("48.4") },
            { k: x("Seasonal naive forecast", "Parashikimi naiv sezonal", "Saisonal naive Prognose"), v: 35.8, n: dpc("35.8") },
            { k: x("Exponential smoothing, the best benchmark", "Zbutja eksponenciale, metoda më e mirë", "Exponentielle Glättung, die beste Methode"), v: 7.5, n: dpc("7.5"), alert: true },
          ] },
        { type: "p", text: x(
          "Had each team submitted its best attempt, 63.7%, 48.8% and 12.2% would have beaten them. The organisers suspect misleading validation scores: many teams did not pick the best method they had built.",
          "Nëse çdo ekip do të kishte dorëzuar përpjekjen e vet më të mirë, 63,7%, 48,8% dhe 12,2% do t'i kishin mundur. Organizatorët dyshojnë te rezultatet e vlerësimit paraprak që çorientuan: shumë ekipe nuk zgjodhën metodën më të mirë që kishin ndërtuar.",
          "Hätte jedes Team seinen besten Versuch eingereicht, hätten 63,7 %, 48,8 % und 12,2 % sie geschlagen. Die Veranstalter vermuten irreführende Validierungswerte: Viele Teams wählten nicht die beste Methode, die sie gebaut hatten.") },
        { type: "callout", reading: true, text: x(
          "A complex model is easy to build and hard to check. Without a simple benchmark next to it, nobody knows whether it helped.",
          "Një model i ndërlikuar ndërtohet lehtë dhe kontrollohet me vështirësi. Pa një metodë të thjeshtë pranë, askush nuk e di nëse ndihmoi.",
          "Ein komplexes Modell ist leicht gebaut und schwer geprüft. Ohne einfache Vergleichsmethode daneben weiß niemand, ob es half.") },
      ],
      note: x(
        "Final submissions. The organisers add that many teams behind exponential smoothing may have lost interest and stopped, so the 7.5% may be somewhat biased.",
        "Dorëzimet përfundimtare. Organizatorët shtojnë se shumë ekipe pas zbutjes eksponenciale mund të kenë humbur interesin dhe të jenë ndalur, ndaj 7,5% mund të jetë disi i anshëm.",
        "Endgültige Einsendungen. Die Veranstalter fügen an, dass viele Teams hinter der exponentiellen Glättung das Interesse verloren haben könnten; die 7,5 % sind daher womöglich etwas verzerrt."),
      source: ["fcst-m5-accuracy-2022"],
    },
    {
      id: "model",
      kicker: x("The model", "Modeli", "Das Modell"),
      title: [x("What won,", "Çfarë fitoi,", "Was gewann,"), x("twice", "dy herë", "zweimal")],
      lead: x(
        "Two years before M5, the M4 competition asked for forecasts of 100,000 time series. Its lessons and those of M5 point the same way, with one change.",
        "Dy vjet para M5, konkursi M4 kërkoi parashikime për 100.000 seri kohore. Mësimet e tij dhe ato të M5 tregojnë në të njëjtin drejtim, me një ndryshim.",
        "Zwei Jahre vor M5 verlangte der M4-Wettbewerb Prognosen für 100.000 Zeitreihen. Seine Lehren und die von M5 weisen in dieselbe Richtung, mit einer Änderung."),
      blocks: [
        { type: "lists", cols: [
          { h: x("M4, 2018", "M4, 2018", "M4, 2018"), items: [
            x("12 of the 17 most accurate methods were combinations", "12 nga 17 metodat më të sakta ishin kombinime", "12 der 17 genauesten Methoden waren Kombinationen"),
            x("the winner, a hybrid of statistics and a neural network, about 10% better than a combination benchmark", "fituesi, një hibrid statistike dhe rrjeti nervor, rreth 10% më i mirë se një kombinim krahasimi", "der Sieger, ein Hybrid aus Statistik und neuronalem Netz, rund 10 % besser als eine Vergleichskombination"),
            x("six pure machine learning methods: none beat the combination, one beat the naive", "gjashtë metoda të pastra të mësimit të makinës: asnjë nuk e mundi kombinimin, një mundi naiven", "sechs reine Methoden des maschinellen Lernens: keine schlug die Kombination, eine die naive"),
          ] },
          { h: x("M5, 2020", "M5, 2020", "M5, 2020"), accent: true, items: [
            x("LightGBM in most of the leading entries", "LightGBM te shumica e pjesëmarrësve në krye", "LightGBM in den meisten Spitzenbeiträgen"),
            x("combinations of many models", "kombinime të shumë modeleve", "Kombinationen vieler Modelle"),
            x("one model learning across many series", "një model që mëson nga shumë seri", "ein Modell, das über viele Reihen lernt"),
            x("prices, promotions and events as inputs", "çmimet, promocionet dhe ngjarjet si të dhëna", "Preise, Aktionen und Ereignisse als Eingaben"),
          ] },
        ] },
        { type: "callout", reading: true, text: x(
          "Machine learning won where it had many related series and information beyond past sales, as in M5. Pure machine learning in M4 had not.",
          "Mësimi i makinës fitoi aty ku kishte shumë seri të lidhura dhe informacion përtej shitjeve të kaluara, si te M5. Te M4, metodat që ishin vetëm mësim i makinës nuk kishin fituar.",
          "Maschinelles Lernen gewann, wo es viele verwandte Reihen und Informationen über die Absatzhistorie hinaus gab, wie in M5. Reines maschinelles Lernen in M4 hatte nicht gewonnen.") },
      ],
      note: x(
        "The 10% in M4 is by sMAPE, a percentage error. In M5, exponential smoothing with promotions and special days was 6% more accurate than without; ARIMA with such inputs, 13%.",
        "10% te M4 është sipas sMAPE, një gabim në përqindje. Te M5, zbutja eksponenciale me promocionet dhe ditët e veçanta ishte 6% më e saktë se pa to; ARIMA me të dhëna të tilla, 13%.",
        "Die 10 % in M4 beziehen sich auf sMAPE, einen prozentualen Fehler. In M5 war exponentielle Glättung mit Aktionen und Sondertagen 6 % genauer als ohne, ARIMA mit solchen Eingaben 13 %."),
      source: ["fcst-m4-2018", "fcst-m5-accuracy-2022"],
    },
    {
      id: "research", more: "high-volume-days",
      kicker: x("What the research says", "Çfarë thotë kërkimi", "Was die Forschung sagt"),
      title: [x("Where the", "Ku mbarojnë", "Wo die"), x("gains end", "fitimet", "Gewinne enden")],
      lead: x(
        "The 42,840 series sit on 12 levels, from all of Walmart's sales in the data down to one product in one store. The organisers compared the top methods with the best benchmark at each level.",
        "42.840 seritë ndodhen në 12 nivele, nga të gjitha shitjet e Walmart-it në të dhëna deri te një produkt në një dyqan. Organizatorët i krahasuan metodat më të mira me metodën më të mirë të krahasimit në çdo nivel.",
        "Die 42.840 Reihen liegen auf 12 Ebenen, vom gesamten Walmart-Absatz in den Daten bis zu einem Produkt in einer Filiale. Die Veranstalter verglichen die besten Methoden auf jeder Ebene mit der besten Vergleichsmethode."),
      blocks: [
        { type: "columns", max: 45, height: 110, source: ["fcst-m5-accuracy-2022"],
          label: x("Average gain of the top methods over the best benchmark, by level (2020)", "Fitimi mesatar i metodave më të mira kundrejt metodës më të mirë të krahasimit, sipas nivelit (2020)", "Durchschnittlicher Gewinn der besten Methoden gegenüber der besten Vergleichsmethode, nach Ebene (2020)"),
          items: [
            { k: x("Total (1)", "Totali (1)", "Gesamt (1)"), v: 40, n: x("~40%", "~40%", "~40 %") },
            { k: x("Levels 5–7", "Nivelet 5–7", "Ebenen 5–7"), v: 23, n: x("~23%", "~23%", "~23 %") },
            { k: x("Product, store (10–12)", "Produkt, dyqan (10–12)", "Produkt, Filiale (10–12)"), v: 3, n: x("~3%", "~3%", "~3 %"), alert: true },
          ] },
        { type: "p", text: x(
          "For one product in one store, 73% of the 30,490 series were intermittent: days with no sale, then a few. There, the organisers note, the standard methods for intermittent demand still held some value.",
          "Për një produkt në një dyqan, 73% e 30.490 serive ishin me kërkesë të ndërprerë: ditë pa asnjë shitje, pastaj disa. Aty, vërejnë organizatorët, metodat standarde për kërkesën e ndërprerë kishin ende njëfarë vlere.",
          "Für ein Produkt in einer Filiale waren 73 % der 30.490 Reihen sporadisch: Tage ohne Verkauf, dann ein paar. Dort, so die Veranstalter, hatten die üblichen Methoden für sporadischen Bedarf noch einen gewissen Wert.") },
        { type: "callout", reading: true, text: x(
          "The forecast that fills the shelf is still the uncertain one. Plan stock, people and capacity for the error, not only for the number.",
          "Parashikimi që mbush raftin mbetet ai i pasigurti. Planifiko stokun, njerëzit dhe kapacitetin për gabimin, jo vetëm për numrin.",
          "Die Prognose, die das Regal füllt, bleibt die unsichere. Planen Sie Bestand, Personal und Kapazität für den Fehler, nicht nur für die Zahl.") },
      ],
      note: x(
        "Rounded averages, read in the authors' preprint of the results paper. At the three lowest levels the overall winner ranked 11th to 13th of the top 50.",
        "Mesatare të rrumbullakuara, të lexuara në versionin paraprak të autorëve të punimit me rezultatet. Në tri nivelet më të ulëta, fituesi i përgjithshëm doli i 11-ti deri i 13-ti nga 50 të parët.",
        "Gerundete Durchschnitte, gelesen in der Vorabfassung der Ergebnisarbeit. Auf den drei untersten Ebenen lag der Gesamtsieger unter den besten 50 auf Platz 11 bis 13."),
      source: ["fcst-m5-accuracy-2022", "fcst-m5-background-2022"],
    },
    {
      id: "measure",
      kicker: x("How it is measured", "Si matet", "Wie es gemessen wird"),
      title: [x("Measure against", "Mate kundrejt", "Messen gegen"), x("the naive", "parashikimit naiv", "die naive Prognose")],
      lead: x(
        "Rob Hyndman and George Athanasopoulos use four simple methods as benchmarks throughout their textbook; the simplest, the naive forecast, repeats the last value. Other methods are compared with them.",
        "Rob Hyndman dhe George Athanasopoulos përdorin katër metoda të thjeshta si pika krahasimi në të gjithë tekstin e tyre; më e thjeshta, parashikimi naiv, përsërit vlerën e fundit. Metodat e tjera krahasohen me to.",
        "Rob Hyndman und George Athanasopoulos nutzen im ganzen Lehrbuch vier einfache Methoden als Vergleich; die einfachste, die naive Prognose, wiederholt den letzten Wert. Andere Methoden werden mit ihnen verglichen."),
      blocks: [
        { type: "rows", compact: true, label: x("Three measures of error", "Tri masa të gabimit", "Drei Fehlermaße"), items: [
          { h: x("MAE, mean absolute error", "MAE, gabimi mesatar absolut", "MAE, mittlerer absoluter Fehler"), p: x("In units. Minimising it leads to the median; minimising RMSE, to the mean.", "Në copë. Minimizimi i tij çon te mediana; minimizimi i RMSE-së, te mesatarja.", "In Stück. Ihn zu minimieren führt zum Median, RMSE zu minimieren zum Mittelwert.") },
          { h: x("MAPE, mean absolute percentage error", "MAPE, gabimi mesatar absolut në përqindje", "MAPE, mittlerer absoluter prozentualer Fehler"), p: x("Infinite or undefined on a day with zero sales, extreme near zero.", "I pafund ose i papërcaktuar në një ditë pa shitje, ekstrem afër zeros.", "Unendlich oder undefiniert an einem Tag ohne Absatz, extrem nahe null.") },
          { h: x("MASE, mean absolute scaled error", "MASE, gabimi mesatar absolut i shkallëzuar", "MASE, mittlerer absoluter skalierter Fehler"), p: x("Below 1 when the forecast beats the naive forecast on past data.", "Nën 1 kur parashikimi e mund parashikimin naiv mbi të dhënat e kaluara.", "Unter 1, wenn die Prognose die naive auf vergangenen Daten schlägt.") },
        ] },
        { type: "p", text: x(
          "In four supply-chain companies, over 60,000 forecasts, planners adjusted on average 75% of the system's forecasts. Large adjustments helped more; small ones often did harm. Upward ones helped far less often and more often went the wrong way.",
          "Në katër kompani të zinxhirit të furnizimit, mbi 60.000 parashikime, planifikuesit ndryshuan mesatarisht 75% të parashikimeve të sistemit. Ndryshimet e mëdha ndihmuan më shumë; të voglat shpesh dëmtuan. Ndryshimet për lart ndihmonin shumë më rrallë dhe më shpesh shkonin në drejtimin e gabuar.",
          "In vier Unternehmen der Lieferkette, bei über 60.000 Prognosen, änderten Planer im Schnitt 75 % der Systemprognosen. Große Korrekturen halfen mehr, kleine schadeten oft. Korrekturen nach oben halfen viel seltener und gingen öfter in die falsche Richtung.") },
        { type: "callout", reading: true, text: x(
          "Measure every hand on the forecast: the system against the naive, the adjustment against the system.",
          "Mate çdo ndërhyrje në parashikim: sistemin kundrejt parashikimit naiv, ndryshimin me dorë kundrejt sistemit.",
          "Messen Sie jede Hand an der Prognose: das System an der naiven, die Korrektur am System.") },
      ],
      note: x(
        "Measures as in Hyndman & Athanasopoulos (2021). Fildes et al.: three manufacturers forecasting monthly, one retailer weekly; the authors see optimism in the upward lean.",
        "Masat siç i japin Hyndman & Athanasopoulos (2021). Fildes et al.: tre prodhues me parashikime mujore, një shitës me pakicë me javore; autorët shohin optimizëm te animi për lart.",
        "Maße wie bei Hyndman & Athanasopoulos (2021). Fildes et al.: drei Hersteller mit Monats-, ein Händler mit Wochenprognosen; die Autoren sehen im Hang nach oben Optimismus."),
      source: ["fcst-fpp3-2021", "fcst-fildes-2009", "fcst-fildes-goodwin-2007"],
    },
    {
      id: "tool", tool: "/tools/sigma-control-chart/",
      kicker: x("Tool of the issue", "Mjeti i numrit", "Werkzeug der Ausgabe"),
      title: [x("The forecast", "Karta e rishikimit", "Die Karte zur"), x("review card", "të parashikimit", "Prognoseprüfung")],
      lead: x(
        "One card per product family and month. The naive forecast next to the system's, every hand adjustment with its reason, and a look at whether the error leans one way.",
        "Një kartë për çdo familje produktesh dhe muaj. Parashikimi naiv pranë atij të sistemit, çdo ndryshim me dorë me arsyen e vet, dhe një vështrim nëse gabimi anon nga një anë.",
        "Eine Karte pro Produktfamilie und Monat: die naive Prognose neben der des Systems, jede Handkorrektur mit Grund, und ob der Fehler zu einer Seite neigt."),
      blocks: [
        { type: "form", items: [
          { h: x("Series and level", "Seria dhe niveli", "Reihe und Ebene"), hint: x("product family, store or region; how many days had no sales", "familja e produkteve, dyqani ose rajoni; sa ditë ishin pa shitje", "Produktfamilie, Filiale oder Region; wie viele Tage ohne Absatz") },
          { h: x("Benchmark", "Pika e krahasimit", "Vergleich"), hint: x("naive or seasonal naive: its error over the same period", "naiv ose naiv sezonal: gabimi i tij për të njëjtën periudhë", "naiv oder saisonal naiv: sein Fehler im selben Zeitraum") },
          { h: x("System forecast", "Parashikimi i sistemit", "Systemprognose"), hint: x("error in units (MAE) and against the benchmark (MASE)", "gabimi në copë (MAE) dhe kundrejt pikës së krahasimit (MASE)", "Fehler in Stück (MAE) und gegen den Vergleich (MASE)") },
          { h: x("Hand adjustments", "Ndryshimet me dorë", "Handkorrekturen"), hint: x("who changed what, up or down, by how much, and why", "kush ndryshoi çfarë, për lart apo për poshtë, sa, dhe pse", "wer was änderte, nach oben oder unten, um wie viel, und warum") },
          { h: x("Value of the adjustment", "Vlera e ndryshimit", "Wert der Korrektur"), hint: x("error after the adjustment against the system forecast before it", "gabimi pas ndryshimit kundrejt parashikimit të sistemit para tij", "Fehler nach der Korrektur gegen die Systemprognose davor") },
          { h: x("Lean of the error", "Animi i gabimit", "Fehlerneigung"), hint: x("months above sales against months below; the errors on a control chart", "muajt mbi shitjet kundrejt muajve nën to; gabimet në një kartë kontrolli", "Monate über gegen unter dem Absatz; die Fehler in einer Regelkarte") },
          { h: x("Next month", "Muaji tjetër", "Nächster Monat"), hint: x("keep, change the method or the data, or stop the adjustments that did not help", "mbaje, ndrysho metodën ose të dhënat, ose ndalo ndryshimet që nuk ndihmuan", "behalten, Methode oder Daten ändern, nutzlose Korrekturen lassen") },
        ] },
      ],
      note: x(
        "The editors propose this review, built on Hyndman & Athanasopoulos (2021) and Fildes et al. (2009). For the monthly plan itself, see No. 59.",
        "Këtë rishikim e propozon redaksia, mbi bazën e Hyndman & Athanasopoulos (2021) dhe Fildes et al. (2009). Për vetë planin mujor, shih Nr. 59.",
        "Diese Prüfung schlägt die Redaktion vor, gestützt auf Hyndman & Athanasopoulos (2021) und Fildes et al. (2009). Zum Monatsplan selbst siehe Nr. 59."),
      source: ["fcst-fpp3-2021", "fcst-fildes-2009"],
    },
    { id: "sources", type: "sources" },
    { id: "back", type: "back" },
  ],
};
