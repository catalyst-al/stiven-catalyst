// Management Review, No. 20: Decisions with data. Block: AI.
// Facts and their sources: docs/revista/management-review-nr-20.md.
import { x, pc } from "../common.js";

export default {
  number: 20,
  block: "ai",
  date: x("October 2026", "Tetor 2026", "Oktober 2026"),
  theme: [x("Decisions", "Vendime", "Entscheidungen"), x("with data", "me të dhëna", "mit Daten")],
  sub: x(
    "How far two experts disagree on the same case, what deciding with data is worth, when a formula beats the expert, why people drop an algorithm, and a card for a decision with data.",
    "Sa larg njëri-tjetrit dalin dy ekspertë për të njëjtin rast, sa vlen vendimi me të dhëna, kur formula e mund ekspertin, pse njerëzit e braktisin algoritmin, dhe një kartë për vendimin.",
    "Wie weit zwei Fachleute beim selben Fall auseinanderliegen, was Entscheiden mit Daten bringt, wann die Formel den Experten schlägt, warum Menschen Algorithmen fallen lassen, und eine Karte."),
  seo: x(
    "Decisions with data: a 55% gap between experts on the same case, what data-driven firms gain, formula versus expert, algorithm aversion and a card.",
    "Vendime me të dhëna: 55% hendek mes ekspertëve për të njëjtin rast, çfarë fitojnë firmat, formula kundër ekspertit, mosbesimi te algoritmi dhe një kartë.",
    "Entscheidungen mit Daten: 55 % Abstand zwischen Fachleuten beim selben Fall, was Firmen gewinnen, Formel gegen Experte, Algorithmus-Aversion, eine Karte."),
  feature: x(
    "Two underwriters pricing the same case came out a median 55% apart. Issue 20 starts from that noise audit, looks at what deciding with data has been worth to firms and weighs formulas against experts. It shows why people drop an algorithm after one mistake, and what brings them back, before ending with a card for a decision with data.",
    "Dy vlerësues rreziku që çmuan të njëjtin rast dolën me një hendek median prej 55%. Numri 20 nis nga ky auditim zhurme, shikon sa u ka vlejtur firmave vendimi me të dhëna dhe i vë formulat përballë ekspertëve. Tregon pse njerëzit e braktisin algoritmin pas një gabimi të vetëm dhe çfarë i kthen, para se të mbyllet me një kartë për një vendim me të dhëna.",
    "Zwei Underwriter, die denselben Fall bepreisten, lagen im Median 55 % auseinander. Ausgabe 20 geht von diesem Noise-Audit aus, fragt, was Entscheiden mit Daten Firmen gebracht hat, und stellt Formeln gegen Fachleute. Sie zeigt, warum Menschen einen Algorithmus nach einem einzigen Fehler fallen lassen und was sie zurückholt, und schließt mit einer Karte für eine Entscheidung mit Daten."),
  figure: { n: pc(55), by: "Kahneman et al., 2021", t: x(
    "was the median gap between the premiums two underwriters set for the same case; the executives had expected about 10%.",
    "ishte hendeku median mes primeve që dy vlerësues rreziku caktuan për të njëjtin rast; drejtuesit prisnin rreth 10%.",
    "betrug der Medianabstand zwischen den Prämien, die zwei Underwriter für denselben Fall festlegten; die Führung hatte mit etwa 10 % gerechnet.") },
  teasers: [
    { page: "story", kicker: x("Cover story", "Tema kryesore", "Titelthema"),
      title: x("The noise audit", "Auditimi i zhurmës", "Das Noise-Audit") },
    { page: "model", kicker: x("The model", "Modeli", "Das Modell"),
      title: x("Rule, judgment, or both", "Rregull, gjykim apo të dyja", "Regel, Urteil oder beides") },
    { page: "tool", kicker: x("Tool of the issue", "Mjeti i numrit", "Werkzeug der Ausgabe"),
      title: x("The data decision card", "Karta e vendimit me të dhëna", "Die Karte für Datenentscheidungen") },
  ],
  sources: ["kahneman-2021", "kahneman-2016", "bhk-2011", "brynjolfsson-mcelheran-2016", "wavestone-2024", "grove-2000", "dietvorst-2015", "dietvorst-2018"],
  pages: [
    { id: "cover", type: "cover" },
    {
      id: "intro", type: "intro",
      why: x(
        "Every year managers receive more data than they can read. The useful question is where data actually improves a decision: where it replaces noise, where it informs judgment, and where people stop trusting it.",
        "Çdo vit menaxherëve u vijnë më shumë të dhëna nga sa mund të lexojnë. Pyetja që vlen është ku i përmirësojnë vërtet të dhënat vendimet: ku zëvendësojnë zhurmën, ku e ushqejnë gjykimin, dhe ku njerëzit pushojnë së besuari te to.",
        "Jedes Jahr bekommen Führungskräfte mehr Daten, als sie lesen können. Entscheidend ist, wo Daten eine Entscheidung tatsächlich verbessern: wo sie die Streuung ersetzen, wo sie ins Urteil einfließen und wo Menschen ihnen nicht mehr trauen."),
      body: x(
        "At one insurer, two underwriters pricing the same case were a median 55% apart. Among 179 large firms, those that decided with data had output and productivity 5–6% higher than their other investments and IT would predict. In studies of prediction, formulas were more accurate than experts on average, yet people abandon an algorithm once they see it err, unless they may adjust it a little.",
        "Në një kompani sigurimesh, dy vlerësues rreziku që çmuan të njëjtin rast dolën me një hendek median prej 55%. Në 179 firma të mëdha, ato që vendosnin me të dhëna kishin prodhim dhe produktivitet 5–6% më të lartë nga sa do të pritej prej investimeve të tjera dhe IT-së. Në studimet e parashikimit, formulat ishin mesatarisht më të sakta se ekspertët, por njerëzit e braktisin algoritmin sapo e shohin të gabojë, përveç kur u lejohet ta ndryshojnë pak.",
        "Bei einem Versicherer lagen zwei Underwriter beim selben Fall im Median 55 % auseinander. Unter 179 großen Firmen hatten jene, die mit Daten entschieden, eine um 5–6 % höhere Produktion und Produktivität, als ihre übrigen Investitionen und ihre IT erwarten ließen. In Vorhersagestudien waren Formeln im Schnitt genauer als Fachleute, doch Menschen lassen einen Algorithmus fallen, sobald sie ihn irren sehen, es sei denn, sie dürfen ihn ein wenig anpassen."),
    },
    {
      id: "story",
      kicker: x("Cover story", "Tema kryesore", "Titelthema"),
      title: [x("The noise", "Auditimi", "Das Noise-"), x("audit", "i zhurmës", "Audit")],
      lead: x(
        "In a noise audit at an insurance company, described by Daniel Kahneman, Olivier Sibony and Cass Sunstein, underwriters each priced the same cases on their own, and claims adjusters valued the same claims.",
        "Daniel Kahneman, Olivier Sibony dhe Cass Sunstein përshkruajnë një auditim zhurme në një kompani sigurimesh: vlerësuesit e rrezikut caktuan primin për të njëjtat raste, secili më vete, dhe vlerësuesit e dëmeve vlerësuan të njëjtat dëme.",
        "In einem Noise-Audit bei einem Versicherer, das Daniel Kahneman, Olivier Sibony und Cass Sunstein beschreiben, bepreisten Underwriter dieselben Fälle, jeder für sich, und Schadenregulierer bewerteten dieselben Schäden."),
      blocks: [
        { type: "columns", max: 60, height: 110, source: ["kahneman-2021"],
          label: x("Median gap between two professionals judging the same case", "Hendeku median mes dy profesionistëve që gjykojnë të njëjtin rast", "Medianabstand zwischen zwei Fachleuten beim selben Fall"),
          note: x(
            "Median gap between two professionals' answers on the same case, at one insurer; “Expected” is what its executives had expected. Read via secondary accounts.",
            "Hendeku median mes përgjigjeve të dy profesionistëve për të njëjtin rast, në një kompani sigurimesh; “I pritur” është ajo që prisnin drejtuesit. Lexuar përmes burimeve dytësore.",
            "Medianabstand zwischen den Antworten zweier Fachleute zum selben Fall bei einem Versicherer; „Erwartet“ ist, womit die Führung rechnete. Gelesen über Sekundärquellen."),
          items: [
            { k: x("Expected", "I pritur", "Erwartet"), v: 10, n: x("≈10%", "≈10%", "≈10 %") },
            { k: x("Premiums", "Primet", "Prämien"), v: 55, n: pc(55), alert: true },
            { k: x("Claims", "Dëmet", "Schäden"), v: 43, n: pc(43), alert: true },
          ] },
        { type: "p", text: x(
          "Kahneman and his co-authors call the method a noise audit: people in the same unit judge the same cases, and the distance between their answers is the measure of noise. Their remedies are algorithms, or procedures that push judgments towards consistency.",
          "Kahneman dhe bashkautorët e quajnë metodën auditim zhurme: njerëzit e së njëjtës njësi gjykojnë të njëjtat raste, dhe largësia mes përgjigjeve të tyre është masa e zhurmës. Ilaçet që propozojnë janë algoritmet, ose procedurat që i shtyjnë gjykimet drejt njëtrajtshmërisë.",
          "Kahneman und seine Mitautoren nennen die Methode Noise-Audit: Menschen derselben Einheit beurteilen dieselben Fälle, und der Abstand zwischen ihren Antworten ist das Maß der Streuung. Als Abhilfe nennen sie Algorithmen oder Verfahren, die Urteile einheitlicher machen.") },
        { type: "callout", reading: true, text: x(
          "Noise stays invisible until two people judge the same case. Most teams never try it, so they never see it.",
          "Zhurma mbetet e padukshme derisa dy njerëz të gjykojnë të njëjtin rast. Shumica e ekipeve nuk e provojnë kurrë, prandaj nuk e shohin kurrë.",
          "Streuung bleibt unsichtbar, bis zwei Menschen denselben Fall beurteilen. Die meisten Teams probieren das nie aus und sehen sie deshalb nie.") },
      ],
      source: ["kahneman-2021", "kahneman-2016"],
    },
    {
      id: "numbers",
      kicker: x("The numbers", "Shifrat", "Die Zahlen"),
      title: [x("What deciding with", "Sa vlen vendimi", "Was Entscheiden"), x("data is worth", "me të dhëna", "mit Daten bringt")],
      lead: x(
        "Erik Brynjolfsson, Lorin Hitt and Heekyung Kim studied how 179 large listed firms make decisions. Those that decided with data had output and productivity 5–6% higher than their other investments and use of IT would predict.",
        "Erik Brynjolfsson, Lorin Hitt dhe Heekyung Kim studiuan si marrin vendime 179 firma të mëdha të listuara në bursë. Ato që vendosnin me të dhëna kishin prodhim dhe produktivitet 5–6% më të lartë nga sa do të pritej prej investimeve të tjera dhe përdorimit të IT-së.",
        "Erik Brynjolfsson, Lorin Hitt und Heekyung Kim untersuchten, wie 179 große börsennotierte Firmen entscheiden. Wer mit Daten entschied, hatte eine um 5–6 % höhere Produktion und Produktivität, als die übrigen Investitionen und die IT-Nutzung erwarten ließen."),
      blocks: [
        { type: "columns", max: 35, height: 100, source: ["brynjolfsson-mcelheran-2016"],
          label: x("US manufacturing plants that decide with data", "Fabrikat e SHBA që vendosin me të dhëna", "US-Fabriken, die mit Daten entscheiden"),
          items: [
            { k: "2005", v: 11, n: pc(11) },
            { k: "2010", v: 30, n: pc(30), alert: true },
          ] },
        { type: "p", text: x(
          "In US manufacturing, Brynjolfsson and Kristina McElheran found that the share of plants deciding with data almost tripled in five years. Among the data leaders of large firms surveyed by Wavestone, 48.1% called their organisation data-driven in 2024, up from 23.9% a year earlier.",
          "Në industrinë e SHBA, Brynjolfsson dhe Kristina McElheran gjetën se pjesa e fabrikave që vendosin me të dhëna pothuajse u trefishua brenda pesë vjetësh. Mes drejtuesve të të dhënave në firma të mëdha që pyeti Wavestone, 48,1% e quajtën organizatën e tyre të drejtuar nga të dhënat në vitin 2024, nga 23,9% një vit më parë.",
          "In der US-Industrie stellten Brynjolfsson und Kristina McElheran fest, dass sich der Anteil der Fabriken, die mit Daten entscheiden, binnen fünf Jahren fast verdreifachte. Unter den Datenverantwortlichen großer Firmen, die Wavestone befragte, nannten 48,1 % ihre Organisation 2024 datengetrieben, nach 23,9 % ein Jahr zuvor.") },
        { type: "callout", reading: true, text: x(
          "Data pays when it changes how decisions are made. Filling more reports earns nothing by itself.",
          "Të dhënat japin fryt kur ndryshojnë mënyrën si merren vendimet. Më shumë raporte, vetëm për vete, nuk sjellin asgjë.",
          "Daten zahlen sich aus, wenn sie verändern, wie entschieden wird. Mehr Berichte allein bringen nichts.") },
      ],
      note: x(
        "The firm study is observational, with no experiment behind it. The second study counts plants rather than firms. Wavestone's figures reflect data leaders' own view and come from no representative sample.",
        "Studimi i firmave është vëzhgues, pa eksperiment pas tij. Studimi i dytë numëron fabrika në vend të firmave. Shifrat e Wavestone-it pasqyrojnë vlerësimin e vetë drejtuesve të të dhënave dhe nuk vijnë nga një mostër përfaqësuese.",
        "Die Firmenstudie beruht auf Beobachtung, ein Experiment liegt ihr nicht zugrunde. Die zweite Studie zählt Fabriken statt Firmen. Die Wavestone-Zahlen geben die Sicht der Datenverantwortlichen wieder und beruhen auf keiner repräsentativen Stichprobe."),
      source: ["bhk-2011", "brynjolfsson-mcelheran-2016", "wavestone-2024"],
    },
    {
      id: "model", more: "kpis-do-not-improve-in-excel",
      kicker: x("The model", "Modeli", "Das Modell"),
      title: [x("Rule, judgment,", "Rregull, gjykim,", "Regel, Urteil"), x("or both", "apo të dyja", "oder beides")],
      lead: x(
        "Data can enter a decision in three ways. Which one fits depends on how often the decision recurs and how differently people answer the same case.",
        "Të dhënat mund të hyjnë në një vendim në tri mënyra. Cila përshtatet varet nga sa shpesh përsëritet vendimi dhe sa ndryshe përgjigjen njerëzit për të njëjtin rast.",
        "Daten können auf drei Arten in eine Entscheidung eingehen. Welche passt, hängt davon ab, wie oft sich die Entscheidung wiederholt und wie unterschiedlich Menschen denselben Fall beurteilen."),
      blocks: [
        { type: "rows", compact: true, items: [
          { h: x("A rule decides", "Vendos rregulli", "Eine Regel entscheidet"), p: x("For frequent, similar cases with a clear outcome: the formula gives the answer, people handle the exceptions.", "Për raste të shpeshta e të ngjashme me rezultat të qartë: formula jep përgjigjen, njerëzit merren me përjashtimet.", "Für häufige, ähnliche Fälle mit klarem Ergebnis: Die Formel liefert die Antwort, Menschen kümmern sich um die Ausnahmen.") },
          { h: x("A rule proposes, a person adjusts", "Rregulli propozon, njeriu e rregullon", "Eine Regel schlägt vor, ein Mensch passt an"), p: x("The formula gives a figure; the person may move it within a set range and writes down why.", "Formula jep një shifër; njeriu mund ta lëvizë brenda një kufiri të caktuar dhe shkruan pse.", "Die Formel liefert einen Wert; die Person darf ihn in einem festen Rahmen verschieben und notiert, warum.") },
          { h: x("A person decides, with data in front", "Vendos njeriu, me të dhënat përpara", "Ein Mensch entscheidet, mit Daten vor sich"), p: x("For rare or new decisions: the data is evidence, the judgment is the person's, and it is written down so it can be checked later.", "Për vendime të rralla ose të reja: të dhënat janë prova, gjykimi është i njeriut, dhe shkruhet që të kontrollohet më vonë.", "Für seltene oder neue Entscheidungen: Die Daten sind Belege, das Urteil liegt bei der Person und wird festgehalten, damit es sich später prüfen lässt.") },
        ] },
        { type: "example", label: x("Hypothetical example, a weekly staffing call", "Shembull hipotetik, vendimi javor për stafin", "Hypothetisches Beispiel, die wöchentliche Personalplanung"), rows: [
          { k: x("Rule", "Rregulli", "Regel"), v: x("Staff = forecast orders ÷ 120 per person", "Stafi = porositë e parashikuara ÷ 120 për person", "Personal = Auftragsprognose ÷ 120 pro Person") },
          { k: x("Adjust", "Rregullimi", "Anpassung"), v: x("The shift lead may add or remove up to 2 people", "Shefi i turnit mund të shtojë ose të heqë deri në 2 veta", "Die Schichtleitung darf bis zu 2 Personen dazuholen oder abziehen") },
          { k: x("Record", "Shënimi", "Notiz"), v: x("Each change, with one line on why", "Çdo ndryshim, me një rresht për arsyen", "Jede Änderung, mit einer Zeile zum Grund") },
        ], text: x("After a month, the record shows whether the changes helped. The figures are made up.", "Pas një muaji, shënimet tregojnë nëse ndryshimet ndihmuan. Shifrat janë të sajuara.", "Nach einem Monat zeigen die Notizen, ob die Änderungen geholfen haben. Die Zahlen sind erfunden.") },
        { type: "callout", reading: true, text: x(
          "Data does not replace judgment. It replaces the noise in it: the part that depends on who decides, and on which day.",
          "Të dhënat nuk e zëvendësojnë gjykimin. Zëvendësojnë zhurmën brenda tij: pjesën që varet nga kush vendos, dhe në cilën ditë.",
          "Daten ersetzen nicht das Urteil, sondern die Streuung darin: den Teil, der davon abhängt, wer entscheidet und an welchem Tag.") },
      ],
      note: x(
        "The three ways are the editors' summary; the second follows Dietvorst, Simmons and Massey (2018).",
        "Tri mënyrat janë përmbledhje e redaksisë; e dyta ndjek Dietvorst-in, Simmons-in dhe Massey-n (2018).",
        "Die drei Wege fasst die Redaktion zusammen; der zweite folgt Dietvorst, Simmons und Massey (2018)."),
      source: ["dietvorst-2018"],
    },
    {
      id: "research",
      kicker: x("What the research says", "Çfarë thotë kërkimi", "Was die Forschung sagt"),
      title: [x("The formula", "Formula", "Die Formel"), x("and the expert", "dhe eksperti", "und der Experte")],
      lead: x(
        "William Grove and colleagues compared expert judgment with mechanical, statistical prediction across studies of prediction in health and human behaviour.",
        "William Grove dhe kolegët krahasuan gjykimin e ekspertëve me parashikimin mekanik, statistikor, në studime parashikimi për shëndetin dhe sjelljen njerëzore.",
        "William Grove und Kollegen verglichen das Urteil von Fachleuten mit mechanischer, statistischer Vorhersage, und zwar über Vorhersagestudien zu Gesundheit und menschlichem Verhalten hinweg."),
      blocks: [
        { type: "figures", compact: true, items: [
          { n: x("≈10%", "≈10%", "≈10 %"), t: x("more accurate on average: the formula", "më e saktë mesatarisht: formula", "genauer im Schnitt: die Formel") },
          { n: x("33–47%", "33–47%", "33–47 %"), t: x("of studies: the formula clearly better", "e studimeve: formula qartë më e mirë", "der Studien: die Formel klar besser") },
          { n: x("6–16%", "6–16%", "6–16 %"), t: x("of studies: the expert clearly better", "e studimeve: eksperti qartë më i mirë", "der Studien: der Experte klar besser") },
        ] },
        { type: "p", text: x(
          "Yet people are reluctant to use formulas. In five studies, Berkeley Dietvorst, Joseph Simmons and Cade Massey found that people who saw an algorithm err trusted it less and chose it less often than a worse human forecaster, even when it had done better. After the same mistake, they lost faith in the algorithm faster than in a person.",
          "Megjithatë njerëzit ngurrojnë t'i përdorin formulat. Në pesë studime, Berkeley Dietvorst, Joseph Simmons dhe Cade Massey gjetën se ata që e panë një algoritëm të gabonte i besuan më pak dhe e zgjodhën më rrallë se një parashikues njerëzor më të dobët, edhe kur algoritmi kishte dalë më mirë. Pas të njëjtit gabim, besimin te algoritmi e humbën më shpejt se te njeriu.",
          "Trotzdem nutzen Menschen Formeln nur ungern. In fünf Studien stellten Berkeley Dietvorst, Joseph Simmons und Cade Massey fest: Wer einen Algorithmus irren sah, vertraute ihm weniger und wählte ihn seltener als einen schwächeren menschlichen Prognostiker, selbst wenn der Algorithmus besser abgeschnitten hatte. Nach demselben Fehler verloren die Menschen das Vertrauen in ihn schneller als in einen Menschen.") },
        { type: "p", text: x(
          "When people could change the algorithm's forecast a little, they used it much more often and did better, even when the change allowed was very small.",
          "Kur njerëzit mund ta ndryshonin pak parashikimin e algoritmit, e përdornin shumë më shpesh dhe dilnin më mirë, edhe kur ndryshimi i lejuar ishte shumë i vogël.",
          "Durften Menschen die Prognose des Algorithmus ein wenig ändern, nutzten sie ihn viel öfter und schnitten besser ab, selbst wenn der erlaubte Spielraum sehr klein war.") },
        { type: "callout", reading: true, text: x(
          "Let people adjust the formula a little and write down why. The formula stays in use, and the adjustments stay in view.",
          "Lëri njerëzit ta ndryshojnë pak formulën dhe të shkruajnë pse. Kështu formula mbetet në përdorim, dhe ndryshimet mbeten në sy.",
          "Lassen Sie Menschen die Formel ein wenig anpassen und den Grund notieren. So bleibt die Formel in Gebrauch, und die Anpassungen bleiben sichtbar.") },
      ],
      note: x(
        "In many studies the two were about equally accurate. The ranges depend on how a clear difference is counted.",
        "Në shumë studime, të dyja ishin pothuajse njësoj të sakta. Kufijtë e intervaleve varen nga mënyra si numërohet një ndryshim i qartë.",
        "In vielen Studien waren beide etwa gleich genau. Die Spannen hängen davon ab, wie ein klarer Unterschied gezählt wird."),
      source: ["grove-2000", "dietvorst-2015", "dietvorst-2018"],
    },
    {
      id: "measure",
      kicker: x("How it is measured", "Si matet", "Wie es gemessen wird"),
      title: [x("A noise audit", "Një auditim zhurme", "Ein Noise-Audit"), x("in your team", "në ekipin tënd", "im eigenen Team")],
      lead: x(
        "The audit works on a small scale too: the same cases, judged separately by the people who usually decide them.",
        "Auditimi bëhet edhe në shkallë të vogël: të njëjtat raste, të gjykuara veçmas nga njerëzit që zakonisht vendosin për to.",
        "Das Audit funktioniert auch im Kleinen: dieselben Fälle, getrennt beurteilt von den Menschen, die sonst darüber entscheiden."),
      blocks: [
        { type: "steps", items: [
          { h: x("Choose a repeated decision", "Zgjidh një vendim që përsëritet", "Eine wiederkehrende Entscheidung wählen"), p: x("One that several people make: a priority, an estimate, a grade.", "Një që e marrin disa njerëz: një përparësi, një vlerësim, një notë.", "Eine, die mehrere Menschen treffen: eine Priorität, eine Schätzung, eine Einstufung.") },
          { h: x("Prepare five real cases", "Përgatit pesë raste të vërteta", "Fünf echte Fälle vorbereiten"), p: x("Written up the same way, without names.", "Të shkruara njësoj, pa emra.", "Gleich aufbereitet, ohne Namen.") },
          { h: x("Let each person judge alone", "Secili gjykon vetëm", "Einzeln urteilen lassen"), p: x("No discussion until all the answers are in.", "Asnjë diskutim derisa të vijnë të gjitha përgjigjet.", "Keine Diskussion, bis alle Antworten vorliegen.") },
          { h: x("Look at the spread", "Shiko shpërndarjen", "Die Streuung ansehen"), p: x("For each case, the gap between the highest and the lowest answer.", "Për çdo rast, largësia mes përgjigjes më të lartë dhe më të ulët.", "Für jeden Fall den Abstand zwischen höchster und niedrigster Antwort.") },
          { h: x("Agree a rule where it is widest", "Vendos një rregull aty ku është më e gjerë", "Bei der größten Streuung eine Regel vereinbaren"), p: x("Write down how such a case is decided, and test again in three months.", "Shkruaj si vendoset një rast i tillë, dhe provo sërish pas tre muajsh.", "Halten Sie fest, wie ein solcher Fall entschieden wird, und testen Sie in drei Monaten erneut.") },
        ] },
        { type: "example", label: x("Hypothetical example, five shift leads estimate the same delays", "Shembull hipotetik, pesë shefa turni vlerësojnë të njëjtat vonesa", "Hypothetisches Beispiel, fünf Schichtleitungen schätzen dieselben Verspätungen"), rows: [
          { k: x("Case 1", "Rasti 1", "Fall 1"), v: x("from 20 to 45 minutes", "nga 20 në 45 minuta", "von 20 bis 45 Minuten") },
          { k: x("Case 2", "Rasti 2", "Fall 2"), v: x("from 10 to 15 minutes", "nga 10 në 15 minuta", "von 10 bis 15 Minuten") },
          { k: x("Case 3", "Rasti 3", "Fall 3"), v: x("from 30 to 90 minutes", "nga 30 në 90 minuta", "von 30 bis 90 Minuten") },
        ], text: x("Case 3 needs a rule first. Cases and numbers are invented.", "Rasti 3 ka nevojë i pari për një rregull. Rastet dhe numrat janë të shpikur.", "Fall 3 braucht als Erster eine Regel. Fälle und Zahlen sind erfunden.") },
      ],
      note: x(
        "Steps and example: the editors, after the noise audit described by Kahneman and colleagues.",
        "Hapat dhe shembulli: redaksia, sipas auditimit të zhurmës që përshkruajnë Kahneman-i dhe kolegët.",
        "Schritte und Beispiel: die Redaktion, nach dem Noise-Audit, das Kahneman und Kollegen beschreiben."),
      source: ["kahneman-2016"],
    },
    {
      id: "tool",
      kicker: x("Tool of the issue", "Mjeti i numrit", "Werkzeug der Ausgabe"),
      title: [x("The data", "Karta e vendimit", "Die Karte für"), x("decision card", "me të dhëna", "Datenentscheidungen")],
      lead: x(
        "One card for a decision that recurs. Fill it in with the people who make it, and look at it again after a month.",
        "Një kartë për një vendim që përsëritet. Plotësoje me njerëzit që e marrin, dhe rishikoje pas një muaji.",
        "Eine Karte für eine Entscheidung, die sich wiederholt. Füllen Sie sie mit den Menschen aus, die sie treffen, und sehen Sie sie nach einem Monat wieder an."),
      blocks: [
        { type: "form", items: [
          { h: x("The decision", "Vendimi", "Die Entscheidung"), hint: x("what is decided, how often, by whom", "çfarë vendoset, sa shpesh, nga kush", "was entschieden wird, wie oft, von wem") },
          { h: x("The data", "Të dhënat", "Die Daten"), hint: x("which figures, from where, how fresh", "cilat shifra, nga ku, sa të freskëta", "welche Zahlen, woher, wie aktuell") },
          { h: x("The rule", "Rregulli", "Die Regel"), hint: x("how the data becomes an answer", "si kthehen të dhënat në përgjigje", "wie aus den Daten eine Antwort wird"), lines: 2 },
          { h: x("What a person may change", "Çfarë mund të ndryshojë njeriu", "Was ein Mensch ändern darf"), hint: x("by how much, with the reason written down", "sa, me arsyen të shkruar", "wie viel, mit notiertem Grund") },
          { h: x("Noise test", "Testi i zhurmës", "Streuungstest"), hint: x("date, five cases, who judges them", "data, pesë raste, kush i gjykon", "Datum, fünf Fälle, wer sie beurteilt") },
          { h: x("Review", "Rishikimi", "Überprüfung"), hint: x("after a month: did the changes help?", "pas një muaji: a ndihmuan ndryshimet?", "nach einem Monat: Haben die Änderungen geholfen?") },
        ] },
      ],
      note: x(
        "Proposed by the editors, drawing on the noise audit of Kahneman and colleagues and the adjustable algorithms of Dietvorst, Simmons and Massey.",
        "Praktikë që e propozon redaksia, e mbështetur në auditimin e zhurmës të Kahneman-it dhe kolegëve dhe në algoritmet e rregullueshme të Dietvorst-it, Simmons-it dhe Massey-t.",
        "Ein Vorschlag der Redaktion, gestützt auf das Noise-Audit von Kahneman und Kollegen und die anpassbaren Algorithmen von Dietvorst, Simmons und Massey."),
      source: ["kahneman-2016", "dietvorst-2018"],
    },
    { id: "sources", type: "sources" },
    { id: "back", type: "back" },
  ],
};
