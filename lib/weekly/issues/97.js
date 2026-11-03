// Management Review, No. 97: How sure is the manager? Overconfidence, and how forecasters learned to be calibrated.
// Block: Role. Facts and their sources: docs/revista/management-review-nr-97.md. All four sources were read in full:
// Ben-David, Graham & Harvey (NBER working paper, revised 2013), Moore & Healy (2008, Psychological Review), Moore et al.
// (Management Science, Articles in Advance 2016) and Chang et al. (2016, Judgment and Decision Making, open access).
// Mellers et al. (2014) could not be opened and is not used. Intuition is No. 62, the outside view No. 74, independent
// estimates No. 83, noise between judges No. 20: not repeated.
import { x } from "../common.js";

// "73.1%" in English, "73,1%" in Albanian, "73,1 %" in German.
const pcd = (s) => x(`${s}%`, `${s.replace(".", ",")}%`, `${s.replace(".", ",")} %`);
// "0.81" in English, "0,81" in Albanian and German.
const dec = (s) => x(s, s.replace(".", ","), s.replace(".", ","));

export default {
  number: 97,
  block: "role",
  date: x("November 2026", "Nëntor 2026", "November 2026"),
  theme: [x("How sure", "Sa i sigurt", "Wie sicher"), x("is the manager?", "është menaxheri?", "ist die Führungskraft?")],
  sub: x(
    "Finance chiefs' 80% ranges that held a third of the time, three ways of being too sure, 90% that came true 73% of the time, forecasters who learned calibration, and a card for keeping score.",
    "Intervalet 80% të drejtuesve të financave që qëndruan një herë në tri, tri mënyra për të qenë tepër i sigurt, 90% që doli e vërtetë 73% të herëve, parashikuesit që mësuan kalibrimin, dhe një kartë për të mbajtur rezultatin.",
    "80-%-Spannen von Finanzchefs, die in einem Drittel der Fälle hielten, drei Arten, zu sicher zu sein, 90 %, die zu 73 % eintrafen, Prognostiker, die Kalibrierung lernten, und eine Karte zum Mitzählen."),
  seo: x(
    "Overconfidence and calibration: CFOs' too-narrow forecast ranges, the three kinds of overconfidence, how forecasters learned calibration, and a card.",
    "Mbivlerësimi dhe kalibrimi: intervalet tepër të ngushta të CFO-ve, tri llojet e mbivlerësimit, si mësuan kalibrimin parashikuesit, dhe një kartë.",
    "Selbstüberschätzung und Kalibrierung: zu enge Prognosespannen von CFOs, drei Arten der Überschätzung, wie Prognostiker Kalibrierung lernten, und eine Karte."),
  feature: x(
    "For ten years, finance chiefs of US companies gave a forecast for the stock market with a range they were 80% sure of; the market landed inside it about a third of the time. Issue 97 starts there. It separates three ways of being too sure, follows students whose 90% ranges were right 73% of the time, and turns to a forecasting tournament in which thousands of volunteers became almost as well calibrated as weather forecasters. It ends with a way to keep score of your own certainty, and a card.",
    "Për dhjetë vjet, drejtuesit e financave të kompanive amerikane dhanë një parashikim për bursën me një interval për të cilin ishin 80% të sigurt; tregu ra brenda tij rreth një herë në tri. Numri 97 nis aty. Ndan tri mënyra për të qenë tepër i sigurt, ndjek studentë intervalet 90% të të cilëve dolën të sakta 73% të herëve, dhe kthehet te një garë parashikimi ku mijëra vullnetarë u kalibruan pothuajse si parashikuesit e motit. Mbyllet me një mënyrë për të mbajtur rezultatin e sigurisë tënde, dhe me një kartë.",
    "Zehn Jahre lang gaben Finanzchefs von US-Unternehmen eine Börsenprognose mit einer Spanne ab, bei der sie sich zu 80 % sicher waren; der Markt landete etwa in einem Drittel der Fälle darin. Dort beginnt Ausgabe 97. Sie unterscheidet drei Arten, zu sicher zu sein, folgt Studierenden, deren 90-%-Spannen zu 73 % stimmten, und wendet sich einem Prognosewettbewerb zu, in dem Tausende Freiwillige fast so gut kalibriert wurden wie Wetterprognostiker. Am Ende steht ein Weg, die eigene Sicherheit nachzuzählen, und eine Karte."),
  figure: { n: x("36%", "36%", "36 %"), by: "Ben-David, Graham & Harvey, 2013", t: x(
    "of one-year stock market forecasts by US finance chiefs, 2001–2011, fell inside the range they gave as 80% likely.",
    "e parashikimeve njëvjeçare për bursën nga drejtues financash në SHBA, 2001–2011, ranë brenda intervalit që e dhanë si 80% të mundshëm.",
    "der einjährigen Börsenprognosen von US-Finanzchefs, 2001–2011, lagen in der Spanne, die sie als zu 80 % wahrscheinlich angaben.") },
  teasers: [
    { page: "story", kicker: x("Cover story", "Tema kryesore", "Titelthema"),
      title: x("Eighty percent sure", "Tetëdhjetë për qind i sigurt", "Zu achtzig Prozent sicher") },
    { page: "research", kicker: x("What the research says", "Çfarë thotë kërkimi", "Was die Forschung sagt"),
      title: x("How forecasters got calibrated", "Si u kalibruan parashikuesit", "Wie Prognostiker kalibriert wurden") },
    { page: "tool", kicker: x("Tool of the issue", "Mjeti i numrit", "Werkzeug der Ausgabe"),
      title: x("The forecast log", "Regjistri i parashikimeve", "Das Prognosebuch") },
  ],
  sources: ["calib-ben-david-2013", "calib-moore-healy-2008", "calib-moore-2016", "calib-chang-2016"],
  pages: [
    { id: "cover", type: "cover" },
    {
      id: "intro", type: "intro",
      why: x(
        "A manager forecasts all the time: next week's volume, when a repair will be done, whether a new hire will make it. Each forecast carries a feeling of how sure it is. This issue asks how often that feeling is right, and what made some forecasters right about it.",
        "Një menaxher parashikon gjatë gjithë kohës: volumin e javës tjetër, kur do të mbarojë një riparim, nëse një i ri do t'ia dalë. Çdo parashikim mbart një ndjesi se sa i sigurt është. Ky numër pyet sa shpesh del e drejtë kjo ndjesi, dhe çfarë i bëri disa parashikues ta kenë të drejtë.",
        "Eine Führungskraft prognostiziert ständig: das Volumen der nächsten Woche, wann eine Reparatur fertig ist, ob eine neue Kraft es schafft. Jede Prognose trägt ein Gefühl, wie sicher sie ist. Diese Ausgabe fragt, wie oft dieses Gefühl stimmt und was manche Prognostiker darin treffsicher machte."),
      body: x(
        "Finance chiefs' 80% ranges for the stock market held the result about 36% of the time. Psychologists separate three ways of being too sure; the one in a forecast is a range that is too narrow. Students' 90% ranges held their real score 73.1% of the time. In a forecasting tournament, volunteers were 65.4% sure and right 63.3% of the time; an hour of training and work in teams cut the gap further. A way to keep score and a card close the issue.",
        "Intervalet 80% të drejtuesve të financave për bursën e mbajtën rezultatin rreth 36% të herëve. Psikologët ndajnë tri mënyra për të qenë tepër i sigurt; ajo që shfaqet në një parashikim është një interval tepër i ngushtë. Intervalet 90% të studentëve e mbajtën rezultatin e tyre të vërtetë 73,1% të herëve. Në një garë parashikimi, vullnetarët ishin 65,4% të sigurt dhe kishin të drejtë 63,3% të herëve; një orë trajnim dhe puna në ekip e ngushtuan më tej diferencën. Një mënyrë për të mbajtur rezultatin dhe një kartë e mbyllin numrin.",
        "Die 80-%-Spannen von Finanzchefs für die Börse enthielten das Ergebnis in etwa 36 % der Fälle. Die Psychologie unterscheidet drei Arten, zu sicher zu sein; die in einer Prognose ist eine zu enge Spanne. Die 90-%-Spannen von Studierenden enthielten ihr echtes Ergebnis zu 73,1 %. In einem Prognosewettbewerb waren Freiwillige zu 65,4 % sicher und lagen zu 63,3 % richtig; eine Stunde Training und Arbeit im Team verkleinerten die Lücke weiter. Ein Weg zum Mitzählen und eine Karte schließen die Ausgabe."),
    },
    {
      id: "story",
      kicker: x("Cover story", "Tema kryesore", "Titelthema"),
      title: [x("Eighty percent", "Tetëdhjetë për qind", "Zu achtzig Prozent"), x("sure", "i sigurt", "sicher")],
      lead: x(
        "From 2001 to 2011, Duke University asked US financial executives, most of them CFOs, every quarter for next year's S&P 500 return, with a low figure it had a 1-in-10 chance of falling below and a high one it had a 1-in-10 chance of beating. A well-calibrated range would hold the result 80% of the time.",
        "Nga 2001 deri më 2011, Universiteti Duke i pyeti çdo tremujor drejtuesit financiarë amerikanë, shumica CFO, për kthimin e S&P 500 të vitit tjetër, me një shifër të ulët ku kishte 1 në 10 mundësi të binte më poshtë dhe një të lartë ku kishte 1 në 10 mundësi ta kalonte. Një interval i kalibruar mirë do ta mbante rezultatin 80% të herëve.",
        "Von 2001 bis 2011 fragte die Duke University US-Finanzvorstände, meist CFOs, jedes Quartal nach der S&P-500-Rendite des nächsten Jahres, mit einem unteren Wert, den sie mit 1 zu 10 unterschreiten, und einem oberen, den sie mit 1 zu 10 übertreffen würde. Eine gut kalibrierte Spanne enthielte das Ergebnis in 80 % der Fälle."),
      blocks: [
        { type: "hbars", max: 100, source: ["calib-ben-david-2013"],
          label: x("One-year forecasts whose 80% range held the actual return, 2001–2011", "Parashikime njëvjeçare ku intervali 80% e mbajti kthimin e vërtetë, 2001–2011", "Einjahresprognosen, deren 80-%-Spanne die tatsächliche Rendite enthielt, 2001–2011"),
          items: [
            { k: x("What a calibrated range would reach", "Ku do të arrinte një interval i kalibruar", "Was eine kalibrierte Spanne erreichte"), v: 80, n: x("80%", "80%", "80 %") },
            { k: x("All quarters", "Të gjithë tremujorët", "Alle Quartale"), v: 36, n: x("36%", "36%", "36 %"), alert: true },
            { k: x("Quarters with high market uncertainty", "Tremujorët me pasiguri të lartë në treg", "Quartale mit hoher Marktunsicherheit"), v: 24.1, n: pcd("24.1") },
          ] },
        { type: "p", text: x(
          "The ranges were far too narrow. On average they spanned 14.5 percentage points; from 1950 to 2011, the middle 80% of one-year returns spanned 42.2. The forecasts in the middle of the ranges did not predict the market either.",
          "Intervalet ishin shumë më të ngushta se ç'duhej. Mesatarisht shtriheshin në 14,5 pikë përqindjeje; nga 1950 deri më 2011, 80% e mesme e kthimeve njëvjeçare shtrihej në 42,2. As parashikimet në mes të intervaleve nuk e parashikuan tregun.",
          "Die Spannen waren viel zu eng. Im Schnitt umfassten sie 14,5 Prozentpunkte; von 1950 bis 2011 umfassten die mittleren 80 % der Einjahresrenditen 42,2. Auch die Werte in der Mitte der Spannen sagten den Markt nicht voraus.") },
        { type: "callout", reading: true, text: x(
          "When the market was most uncertain, the ranges widened, but not enough: the gap was largest exactly when caution mattered.",
          "Kur tregu ishte më i pasigurt, intervalet u zgjeruan, por jo sa duhej: diferenca ishte më e madhe pikërisht kur kujdesi kishte më shumë rëndësi.",
          "Als der Markt am unsichersten war, wurden die Spannen breiter, aber nicht genug: Die Lücke war genau dann am größten, als Vorsicht am meisten zählte.") },
      ],
      note: x(
        "13,346 one-year forecasts from 40 quarterly surveys; 5–8% of those asked answered. The paper gives 36.3% and 36.6% in different sections, its abstract 36%. High uncertainty: quarters with the VIX above its median. NBER working paper, revised 2013.",
        "13.346 parashikime njëvjeçare nga 40 anketa tremujore; u përgjigjën 5–8% e të pyeturve. Studimi jep 36,3% dhe 36,6% në pjesë të ndryshme, abstrakti 36%. Pasiguri e lartë: tremujorët me VIX mbi medianën. Punim i NBER-it, i rishikuar më 2013.",
        "13.346 Einjahresprognosen aus 40 Quartalsumfragen; 5–8 % der Befragten antworteten. Die Studie nennt in verschiedenen Abschnitten 36,3 % und 36,6 %, ihr Abstract 36 %. Hohe Unsicherheit: Quartale mit VIX über dem Median. NBER-Arbeitspapier, überarbeitet 2013."),
      source: ["calib-ben-david-2013"],
    },
    {
      id: "model",
      kicker: x("The model", "Modeli", "Das Modell"),
      title: [x("Three ways", "Tri mënyra", "Drei Arten,"), x("to be too sure", "për të qenë tepër i sigurt", "zu sicher zu sein")],
      lead: x(
        "Don Moore and Paul Healy found that research had used one word, overconfidence, for three different errors, and that they often point in opposite directions. Their count of studies in 2008 shows how each was studied.",
        "Don Moore dhe Paul Healy gjetën se kërkimi kishte përdorur një fjalë, mbivlerësim, për tri gabime të ndryshme, dhe se ato shpesh shkojnë në drejtime të kundërta. Numërimi i tyre i studimeve më 2008 tregon sa u studiua secili.",
        "Don Moore und Paul Healy stellten fest, dass die Forschung ein Wort, Selbstüberschätzung, für drei verschiedene Fehler benutzt hatte, die oft in entgegengesetzte Richtungen weisen. Ihre Zählung der Studien von 2008 zeigt, wie oft jeder untersucht wurde."),
      blocks: [
        { type: "cards", cols: 3, items: [
          { n: x("64%", "64%", "64 %"), h: x("Overestimation", "Mbivlerësimi", "Überschätzung"),
            p: x("thinking you did, or will do, better than you actually do", "të mendosh se ia dole, ose do t'ia dalësh, më mirë se ç'ia del në të vërtetë", "zu glauben, man sei besser gewesen oder werde besser sein, als man tatsächlich ist") },
          { n: x("5%", "5%", "5 %"), h: x("Overplacement", "Mbivendosja", "Überplatzierung"),
            p: x("thinking you are better than others when you are not", "të mendosh se je më i mirë se të tjerët kur nuk je", "zu glauben, man sei besser als andere, wenn man es nicht ist") },
          { n: x("31%", "31%", "31 %"), h: x("Overprecision", "Mbisaktësia", "Überpräzision"),
            p: x("being too sure you know the answer: a range drawn too narrow", "të jesh tepër i sigurt se e di përgjigjen: një interval i vizatuar tepër ngushtë", "zu sicher zu sein, die Antwort zu kennen: eine zu eng gezogene Spanne") },
        ] },
        { type: "p", text: x(
          "On hard tasks people overestimate their score but believe they did worse than others; on easy tasks the reverse. Overprecision, Moore and Healy write, is the most persistent of the three.",
          "Në detyrat e vështira njerëzit e mbivlerësojnë rezultatin e tyre, por besojnë se dolën më keq se të tjerët; në detyrat e lehta ndodh e kundërta. Mbisaktësia, shkruajnë Moore dhe Healy, është më këmbëngulësja nga të tria.",
          "Bei schweren Aufgaben überschätzen Menschen ihr Ergebnis, glauben aber, schlechter als andere zu sein; bei leichten umgekehrt. Die Überpräzision, schreiben Moore und Healy, ist die hartnäckigste der drei.") },
        { type: "callout", reading: true, text: x(
          "A manager's forecast can be right in the middle and still too sure: the third error lives in the width of the range.",
          "Parashikimi i një menaxheri mund të jetë i saktë në mes dhe prapë tepër i sigurt: gabimi i tretë qëndron te gjerësia e intervalit.",
          "Die Prognose einer Führungskraft kann in der Mitte stimmen und trotzdem zu sicher sein: Der dritte Fehler steckt in der Breite der Spanne.") },
      ],
      note: x(
        "Shares of the empirical studies found by a database search for overconfidence (365 hits, 72% empirical), as Moore and Healy counted them in 2008; the three shares add to 100. The manager's reading is the editors'.",
        "Pjesë të studimeve empirike që gjeti një kërkim në bazën e të dhënave për “overconfidence” (365 rezultate, 72% empirike), siç i numëruan Moore dhe Healy më 2008; tri pjesët japin 100. Leximi për menaxherin është i redaksisë.",
        "Anteile der empirischen Studien aus einer Datenbanksuche nach „overconfidence“ (365 Treffer, 72 % empirisch), wie Moore und Healy sie 2008 zählten; die drei Anteile ergeben 100. Die Deutung für Führungskräfte stammt von der Redaktion."),
      source: ["calib-moore-healy-2008"],
    },
    {
      id: "numbers",
      kicker: x("The numbers", "Shifrat", "Die Zahlen"),
      title: [x("Ninety percent", "Nëntëdhjetë për qind", "Neunzig Prozent"), x("sure, and the score", "i sigurt, dhe rezultati", "sicher, und das Ergebnis")],
      lead: x(
        "82 students at Carnegie Mellon took 18 ten-question quizzes and, each time, spread 100% of probability over the scores they might get. Moore and Healy took from each spread the range closest to 90% and checked how often it held the real score.",
        "82 studentë në Carnegie Mellon bënë 18 kuize me dhjetë pyetje dhe çdo herë e shpërndanë 100% të probabilitetit mbi rezultatet që mund të merrnin. Moore dhe Healy morën nga çdo shpërndarje intervalin më afër 90% dhe panë sa shpesh e mbajti rezultatin e vërtetë.",
        "82 Studierende der Carnegie Mellon University lösten 18 Quiz mit je zehn Fragen und verteilten jedes Mal 100 % Wahrscheinlichkeit auf die möglichen Ergebnisse. Moore und Healy nahmen aus jeder Verteilung die Spanne, die 90 % am nächsten kam, und prüften, wie oft sie das echte Ergebnis enthielt."),
      blocks: [
        { type: "columns", max: 100, height: 110, source: ["calib-moore-healy-2008"],
          label: x("How often the 90% ranges held the real score (2008)", "Sa shpesh intervalet 90% e mbajtën rezultatin e vërtetë (2008)", "Wie oft die 90-%-Spannen das echte Ergebnis enthielten (2008)"),
          items: [
            { k: x("Stated", "E deklaruar", "Angegeben"), v: 90.5, n: pcd("90.5") },
            { k: x("All", "Gjithsej", "Alle"), v: 73.1, n: pcd("73.1"), alert: true },
            { k: x("Before the quiz", "Para kuizit", "Vor dem Quiz"), v: 55.1, n: pcd("55.1") },
            { k: x("Just after it", "Sapo mbaroi", "Gleich danach"), v: 85.6, n: pcd("85.6") },
          ] },
        { type: "p", text: x(
          "Earlier studies, they note, found that 90% ranges held the answer 30% to 50% of the time. After hard quizzes the students put their own score 0.79 points too high, after easy ones 0.22 too low, and over 18 rounds these errors did not shrink.",
          "Studimet e mëparshme, shënojnë ata, gjetën se intervalet 90% e mbanin përgjigjen 30% deri 50% të herëve. Pas kuizeve të vështira studentët e vunë rezultatin e tyre 0,79 pikë më lart, pas atyre të lehta 0,22 më poshtë, dhe gjatë 18 raundeve këto gabime nuk u zvogëluan.",
          "Frühere Studien, so die Autoren, fanden, dass 90-%-Spannen die Antwort in 30 % bis 50 % der Fälle enthielten. Nach schweren Quiz schätzten die Studierenden ihr Ergebnis 0,79 Punkte zu hoch, nach leichten 0,22 zu niedrig, und über 18 Runden wurden diese Fehler nicht kleiner.") },
        { type: "callout", reading: true, text: x(
          "Knowing more narrowed the gap but did not close it. Being sure is not the same as being informed.",
          "Të dish më shumë e ngushtoi diferencën, por nuk e mbylli. Të jesh i sigurt nuk është njësoj si të jesh i informuar.",
          "Mehr Wissen verkleinerte die Lücke, schloss sie aber nicht. Sicher sein ist nicht dasselbe wie informiert sein.") },
      ],
      note: x(
        "“Stated” is above 90% because 20% of estimates were given as 100% sure. Students paid by a scoring rule that rewards honest estimates; one experiment, which the authors call illustrative.",
        "“E deklaruar” është mbi 90% sepse 20% e vlerësimeve u dhanë 100% të sigurta. Studentët u paguan me një rregull pikëzimi që shpërblen vlerësimet e sinqerta; një eksperiment i vetëm, që autorët e quajnë ilustrues.",
        "„Angegeben“ liegt über 90 %, weil 20 % der Schätzungen als zu 100 % sicher abgegeben wurden. Bezahlt nach einer Bewertungsregel, die ehrliche Schätzungen belohnt; ein einzelnes Experiment, von den Autoren als illustrativ bezeichnet."),
      source: ["calib-moore-healy-2008"],
    },
    {
      id: "research",
      kicker: x("What the research says", "Çfarë thotë kërkimi", "Was die Forschung sagt"),
      title: [x("How forecasters", "Si u kalibruan", "Wie Prognostiker"), x("got calibrated", "parashikuesit", "kalibriert wurden")],
      lead: x(
        "From 2011, a US intelligence research agency ran a tournament on world events. In the Good Judgment Project, 2,860 volunteers made 494,552 forecasts on 344 questions over three years, scored by the Brier rule. On average they were 65.4% sure and right 63.3% of the time.",
        "Nga 2011, një agjenci kërkimore e inteligjencës amerikane organizoi një garë për ngjarjet botërore. Në Good Judgment Project, 2.860 vullnetarë bënë 494.552 parashikime për 344 pyetje në tre vjet, të pikëzuara me rregullin Brier. Mesatarisht ishin 65,4% të sigurt dhe kishin të drejtë 63,3% të herëve.",
        "Ab 2011 veranstaltete eine US-Forschungsbehörde der Nachrichtendienste einen Wettbewerb zu Weltereignissen. Im Good Judgment Project gaben 2.860 Freiwillige in drei Jahren 494.552 Prognosen zu 344 Fragen ab, bewertet nach der Brier-Regel. Im Schnitt waren sie zu 65,4 % sicher und lagen zu 63,3 % richtig."),
      blocks: [
        { type: "hbars", max: 5, source: ["calib-moore-2016"],
          label: x("Overconfidence: confidence minus hit rate, in points, three years", "Mbivlerësimi: siguria minus përqindja e qëllimeve, në pikë, tre vjet", "Überschätzung: Sicherheit minus Trefferquote, in Punkten, drei Jahre"),
          items: [
            { k: x("Alone, no training", "Vetëm, pa trajnim", "Allein, ohne Training"), v: 4.3, n: dec("4.3"), alert: true },
            { k: x("In a team, no training", "Në ekip, pa trajnim", "Im Team, ohne Training"), v: 2.8, n: dec("2.8") },
            { k: x("Alone, trained", "Vetëm, i trajnuar", "Allein, trainiert"), v: 2.0, n: dec("2.0") },
            { k: x("In a team, trained", "Në ekip, i trajnuar", "Im Team, trainiert"), v: 0.7, n: dec("0.7") },
          ] },
        { type: "p", text: x(
          "The training took under an hour. In all four tournament years trained forecasters scored 6% to 12% better than untrained ones; of the principles taught, thinking in comparison classes was the one most linked to accuracy. More years in the tournament alone did not improve calibration.",
          "Trajnimi zgjati më pak se një orë. Në të katër vitet e garës, parashikuesit e trajnuar morën 6% deri 12% pikë më të mira se të patrajnuarit; nga parimet e mësuara, të menduarit me klasa krahasimi ishte ai më i lidhur me saktësinë. Vetëm vitet më shumë në garë nuk e përmirësuan kalibrimin.",
          "Das Training dauerte unter einer Stunde. In allen vier Wettbewerbsjahren schnitten Trainierte um 6 % bis 12 % besser ab als Untrainierte; von den gelehrten Grundsätzen war das Denken in Vergleichsklassen am stärksten mit Treffsicherheit verbunden. Mehr Jahre im Wettbewerb allein verbesserten die Kalibrierung nicht.") },
        { type: "callout", reading: true, text: x(
          "The authors compare them to weather forecasters, long the model of calibration. What both had was a clear score and prompt feedback.",
          "Autorët i krahasojnë me parashikuesit e motit, prej kohësh modeli i kalibrimit. Ajo që kishin të dy ishte një pikëzim i qartë dhe kthim i shpejtë i rezultatit.",
          "Die Autoren vergleichen sie mit Wetterprognostikern, dem langjährigen Vorbild der Kalibrierung. Beide hatten eine klare Bewertung und schnelle Rückmeldung.") },
      ],
      note: x(
        "Moore et al. (2016), three years, Table 1; the questions were chosen to be hard. Training gains by Brier score, years 1–4, Chang et al. (2016). Forecasters were self-selected volunteers, mostly men with degrees.",
        "Moore et al. (2016), tre vjet, tabela 1; pyetjet u zgjodhën të vështira. Përmirësimi nga trajnimi sipas pikëve Brier, vitet 1–4, Chang et al. (2016). Parashikuesit ishin vullnetarë të vetëzgjedhur, kryesisht burra me arsim të lartë.",
        "Moore et al. (2016), drei Jahre, Tabelle 1; die Fragen waren bewusst schwer gewählt. Trainingsgewinne nach Brier-Wert, Jahre 1–4, Chang et al. (2016). Die Prognostiker waren selbst gemeldete Freiwillige, meist Männer mit Hochschulabschluss."),
      source: ["calib-moore-2016", "calib-chang-2016"],
    },
    {
      id: "measure",
      kicker: x("How it is measured", "Si matet", "Wie es gemessen wird"),
      title: [x("Keep score", "Mbaj rezultatin", "Die eigene Sicherheit"), x("of your own “sure”", "e “sigurisë” tënde", "nachzählen")],
      lead: x(
        "The tournament's forecasters were calibrated where they were scored. A manager can score himself: write each forecast as a probability, or as a range with a low and a high, before the outcome is known, then count.",
        "Parashikuesit e garës u kalibruan aty ku u pikëzuan. Një menaxher mund ta pikëzojë veten: ta shkruajë çdo parashikim si probabilitet, ose si interval me një shifër të ulët dhe një të lartë, para se të dihet rezultati, dhe pastaj të numërojë.",
        "Die Prognostiker des Wettbewerbs wurden kalibriert, weil sie bewertet wurden. Eine Führungskraft kann sich selbst bewerten: jede Prognose vor dem Ergebnis als Wahrscheinlichkeit oder als Spanne mit unterem und oberem Wert aufschreiben, dann zählen."),
      blocks: [
        { type: "example", label: x("Invented example, one quarter's log", "Shembull i sajuar, regjistri i një tremujori", "Erfundenes Beispiel, das Buch eines Quartals"), rows: [
          { k: x("Hit rate", "Përqindja e qëllimeve", "Trefferquote"), v: x("20 forecasts made at 90%; 14 came true: 70%, 20 points too sure", "20 parashikime të bëra me 90%; 14 dolën: 70%, 20 pikë tepër i sigurt", "20 Prognosen mit 90 %; 14 trafen ein: 70 %, 20 Punkte zu sicher") },
          { k: x("Brier, one forecast", "Brier, një parashikim", "Brier, eine Prognose"), v: x("90%, did not happen: (0.9 − 0)² = 0.81; did happen: (0.9 − 1)² = 0.01", "90%, nuk ndodhi: (0,9 − 0)² = 0,81; ndodhi: (0,9 − 1)² = 0,01", "90 %, trat nicht ein: (0,9 − 0)² = 0,81; trat ein: (0,9 − 1)² = 0,01") },
        ], text: x("The log and its figures are invented by the editors to show the counting. Lower Brier scores are better.", "Regjistri dhe shifrat e tij janë sajuar nga redaksia për të treguar numërimin. Pikët Brier më të ulëta janë më të mira.", "Buch und Zahlen sind von der Redaktion erfunden, um das Zählen zu zeigen. Niedrigere Brier-Werte sind besser.") },
        { type: "rows", compact: true, items: [
          { h: x("Before, in writing", "Më parë, me shkrim", "Vorher, schriftlich"), p: x("with the date the question will be settled", "me datën kur do të zgjidhet pyetja", "mit dem Datum, an dem die Frage entschieden ist") },
          { h: x("A number, not a word", "Një numër, jo një fjalë", "Eine Zahl, kein Wort"), p: x("“70%”, not “probably”; a low and a high for quantities", "“70%”, jo “ndoshta”; një shifër e ulët dhe një e lartë për sasitë", "„70 %“, nicht „wahrscheinlich“; unterer und oberer Wert bei Mengen") },
          { h: x("Count by level", "Numëro sipas nivelit", "Nach Stufe zählen"), p: x("the 90% forecasts together, the 70% ones together", "parashikimet 90% bashkë, ato 70% bashkë", "die 90-%-Prognosen zusammen, die 70-%-Prognosen zusammen") },
        ] },
      ],
      note: x(
        "The log is the editors' proposal; a hit rate means little until there are many forecasts at one level. The simple Brier square is for one outcome; the tournament used the original version, from 0 to 2. The outside view is in No. 74, independent estimates in No. 83.",
        "Regjistri është propozim i redaksisë; përqindja e qëllimeve thotë pak derisa të ketë shumë parashikime në një nivel. Katrori i thjeshtë Brier është për një rezultat; gara përdori versionin origjinal, nga 0 në 2. Pamja nga jashtë është te Nr. 74, vlerësimet e pavarura te Nr. 83.",
        "Das Buch ist ein Vorschlag der Redaktion; eine Trefferquote sagt wenig, solange es nicht viele Prognosen auf einer Stufe gibt. Das einfache Brier-Quadrat gilt für ein Ergebnis; der Wettbewerb nutzte die Originalform von 0 bis 2. Die Außensicht steht in Nr. 74, unabhängige Schätzungen in Nr. 83."),
      source: ["calib-chang-2016", "calib-moore-2016"],
    },
    {
      id: "tool", tool: "/tools/sigma-control-chart/", more: "high-volume-days",
      kicker: x("Tool of the issue", "Mjeti i numrit", "Werkzeug der Ausgabe"),
      title: [x("The forecast", "Regjistri i", "Das Prognose-"), x("log", "parashikimeve", "buch")],
      lead: x(
        "One line per forecast, kept for a quarter and scored when each question is settled. Before setting a range for a rate, the Sigma & Control Chart tool shows how widely it has actually varied: a range much narrower than that is likely too sure.",
        "Një rresht për çdo parashikim, i mbajtur për një tremujor dhe i pikëzuar kur zgjidhet çdo pyetje. Para se të vendosësh një interval për një normë, mjeti Sigma & Control Chart tregon sa ka ndryshuar ajo në të vërtetë: një interval shumë më i ngushtë se kaq ka të ngjarë të jetë tepër i sigurt.",
        "Eine Zeile pro Prognose, ein Quartal lang geführt und bewertet, wenn jede Frage entschieden ist. Bevor Sie eine Spanne für eine Quote setzen, zeigt das Werkzeug Sigma & Control Chart, wie stark sie tatsächlich schwankte: Eine viel engere Spanne ist wahrscheinlich zu sicher."),
      blocks: [
        { type: "form", items: [
          { h: x("The question", "Pyetja", "Die Frage"), hint: x("what exactly will happen, and the date it is settled", "çfarë saktësisht do të ndodhë, dhe data kur zgjidhet", "was genau eintreten soll, und wann es entschieden ist") },
          { h: x("Comparison class", "Klasa e krahasimit", "Vergleichsklasse"), hint: x("how often something like this happened before", "sa shpesh ka ndodhur më parë diçka e tillë", "wie oft so etwas früher eintrat") },
          { h: x("My forecast", "Parashikimi im", "Meine Prognose"), hint: x("a probability, or a low and a high with 1 in 10 beyond each", "një probabilitet, ose një shifër e ulët dhe një e lartë me 1 në 10 përtej secilës", "eine Wahrscheinlichkeit, oder unterer und oberer Wert mit je 1 zu 10 darüber hinaus") },
          { h: x("What would change it", "Çfarë do ta ndryshonte", "Was sie ändern würde"), hint: x("the news that would move the number, and which way", "lajmi që do ta lëvizte shifrën, dhe në cilin drejtim", "die Nachricht, die die Zahl bewegen würde, und in welche Richtung") },
          { h: x("Outcome", "Rezultati", "Ergebnis"), hint: x("what happened; inside the range or not", "çfarë ndodhi; brenda intervalit apo jo", "was eintrat; innerhalb der Spanne oder nicht") },
          { h: x("Score", "Pikët", "Bewertung"), hint: x("hit or miss, and the Brier square", "qëllim ose jo, dhe katrori Brier", "Treffer oder nicht, und das Brier-Quadrat") },
        ] },
      ],
      note: x(
        "The log is the editors' proposal, built on the tournament's scoring and its comparison classes; the essay linked below tells of days when demand outran the forecast.",
        "Regjistri është propozim i redaksisë, i ndërtuar mbi pikëzimin e garës dhe klasat e saj të krahasimit; eseja e lidhur më poshtë tregon ditët kur kërkesa e kaloi parashikimin.",
        "Das Buch ist ein Vorschlag der Redaktion, gestützt auf die Bewertung des Wettbewerbs und seine Vergleichsklassen; der unten verlinkte Essay erzählt von Tagen, an denen die Nachfrage die Prognose übertraf."),
      source: ["calib-chang-2016", "calib-moore-2016"],
    },
    { id: "sources", type: "sources" },
    { id: "back", type: "back" },
  ],
};
