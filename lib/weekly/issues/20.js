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
    "Sa ndryshojnë dy ekspertë për të njëjtin rast, sa vlen vendimi me të dhëna, kur formula e mund ekspertin, pse njerëzit e braktisin algoritmin, dhe një kartë për vendimin.",
    "Wie weit zwei Fachleute beim selben Fall auseinanderliegen, was Entscheiden mit Daten bringt, wann die Formel den Experten schlägt, warum Menschen Algorithmen verlassen, und eine Karte."),
  seo: x(
    "Decisions with data: a 55% gap between experts on the same case, what data-driven firms gain, formula versus expert, algorithm aversion and a card.",
    "Vendime me të dhëna: 55% diferencë mes ekspertëve për të njëjtin rast, çfarë fitojnë firmat, formula kundër ekspertit, frika nga algoritmi dhe një kartë.",
    "Entscheidungen mit Daten: 55 % Abstand zwischen Fachleuten beim selben Fall, was Firmen gewinnen, Formel gegen Experte, Algorithmus-Aversion, eine Karte."),
  feature: x(
    "Issue 20 starts with a noise audit in which two underwriters priced the same case a median 55% apart, looks at what deciding with data has been worth to firms, weighs formulas against experts, shows why people drop an algorithm after one mistake and what brings them back, and ends with a card for a decision with data.",
    "Numri 20 nis me një auditim zhurme ku dy vlerësues rreziku e vlerësuan të njëjtin rast me një diferencë mediane 55%, shikon sa u ka vlejtur firmave vendimi me të dhëna, peshon formulat kundrejt ekspertëve, tregon pse njerëzit e braktisin algoritmin pas një gabimi dhe çfarë i kthen, dhe mbyllet me një kartë për një vendim me të dhëna.",
    "Ausgabe 20 beginnt mit einem Noise-Audit, in dem zwei Underwriter denselben Fall im Median 55 % auseinander bepreisten, betrachtet, was Entscheiden mit Daten Firmen gebracht hat, wägt Formeln gegen Fachleute ab, zeigt, warum Menschen einen Algorithmus nach einem Fehler verlassen und was sie zurückholt, und endet mit einer Karte für eine Entscheidung mit Daten."),
  figure: { n: pc(55), by: "Kahneman et al., 2021", t: x(
    "was the median gap between the premiums two underwriters set for the same case; the executives had expected about 10%.",
    "ishte diferenca mediane mes primeve që dy vlerësues rreziku caktuan për të njëjtin rast; drejtuesit prisnin rreth 10%.",
    "betrug der mittlere Abstand zwischen den Prämien, die zwei Underwriter für denselben Fall festlegten; die Führung hatte etwa 10 % erwartet.") },
  teasers: [
    { page: "story", kicker: x("Cover story", "Tema kryesore", "Titelthema"),
      title: x("The noise audit", "Auditimi i zhurmës", "Das Noise-Audit") },
    { page: "model", kicker: x("The model", "Modeli", "Das Modell"),
      title: x("Rule, judgment, or both", "Rregull, gjykim apo të dyja", "Regel, Urteil oder beides") },
    { page: "tool", kicker: x("Tool of the week", "Mjeti i javës", "Werkzeug der Woche"),
      title: x("The data decision card", "Karta e vendimit me të dhëna", "Die Karte für Datenentscheidungen") },
  ],
  sources: ["kahneman-2021", "kahneman-2016", "bhk-2011", "brynjolfsson-mcelheran-2016", "wavestone-2024", "grove-2000", "dietvorst-2015", "dietvorst-2018"],
  pages: [
    { id: "cover", type: "cover" },
    {
      id: "intro", type: "intro",
      why: x(
        "Managers get more data every year than they can read. This issue asks where data actually improves a decision: where it replaces noise, where it informs judgment, and where people stop trusting it.",
        "Çdo vit menaxherëve u vijnë më shumë të dhëna nga sa mund të lexojnë. Ky numër pyet ku i përmirësojnë vërtet të dhënat vendimet: ku zëvendësojnë zhurmën, ku e informojnë gjykimin, dhe ku njerëzit nuk u besojnë më.",
        "Jedes Jahr erreichen Führungskräfte mehr Daten, als sie lesen können. Diese Ausgabe fragt, wo Daten eine Entscheidung wirklich verbessern: wo sie die Streuung ersetzen, wo sie das Urteil informieren und wo Menschen ihnen nicht mehr trauen."),
      body: x(
        "In one insurer, the median gap between two underwriters pricing the same case was 55%. Among 179 large firms, those that decided with data had output and productivity 5–6% higher than their other investments and IT would predict. In studies of prediction, formulas were more accurate than experts on average, yet people abandon an algorithm once they see it err, unless they may adjust it a little.",
        "Në një kompani sigurimesh, diferenca mediane mes dy vlerësuesve të rrezikut për të njëjtin rast ishte 55%. Në 179 firma të mëdha, ato që vendosnin me të dhëna kishin prodhim dhe produktivitet 5–6% më të lartë nga sa parashikonin investimet e tjera dhe IT-ja. Në studimet e parashikimit, formulat ishin mesatarisht më të sakta se ekspertët, por njerëzit e braktisin algoritmin sapo e shohin të gabojë, përveç kur mund ta ndryshojnë pak.",
        "In einem Versicherer lagen zwei Underwriter beim selben Fall im Median 55 % auseinander. Unter 179 großen Firmen hatten jene, die mit Daten entschieden, eine um 5–6 % höhere Produktion und Produktivität, als ihre übrigen Investitionen und ihre IT erwarten ließen. In Vorhersagestudien waren Formeln im Schnitt genauer als Fachleute, doch Menschen verlassen einen Algorithmus, sobald sie ihn irren sehen, außer sie dürfen ihn ein wenig anpassen."),
    },
    {
      id: "story",
      kicker: x("Cover story", "Tema kryesore", "Titelthema"),
      title: [x("The noise", "Auditimi", "Das Noise-"), x("audit", "i zhurmës", "Audit")],
      lead: x(
        "In a noise audit at an insurance company, described by Daniel Kahneman, Olivier Sibony and Cass Sunstein, underwriters priced the same cases, each on their own, and claims adjusters valued the same claims.",
        "Në një auditim zhurme në një kompani sigurimesh, të përshkruar nga Daniel Kahneman, Olivier Sibony dhe Cass Sunstein, vlerësuesit e rrezikut caktuan primin për të njëjtat raste, secili më vete, dhe vlerësuesit e dëmeve vlerësuan të njëjtat dëme.",
        "In einem Noise-Audit bei einem Versicherer, beschrieben von Daniel Kahneman, Olivier Sibony und Cass Sunstein, bepreisten Underwriter dieselben Fälle, jeder für sich, und Schadenregulierer bewerteten dieselben Schäden."),
      blocks: [
        { type: "columns", max: 60, height: 110, source: ["kahneman-2021"],
          label: x("Median gap between two professionals judging the same case", "Diferenca mediane mes dy profesionistëve që gjykojnë të njëjtin rast", "Mittlerer Abstand zwischen zwei Fachleuten beim selben Fall"),
          items: [
            { k: x("Expected", "E pritur", "Erwartet"), v: 10, n: x("≈10%", "≈10%", "≈10 %") },
            { k: x("Premiums", "Primet", "Prämien"), v: 55, n: pc(55), alert: true },
            { k: x("Claims", "Dëmet", "Schäden"), v: 43, n: pc(43), alert: true },
          ] },
        { type: "p", text: x(
          "Kahneman and his co-authors call the method a noise audit: people in the same unit judge the same cases, and how far their answers differ is the measure of noise. Their remedies are algorithms, or procedures that push judgments towards consistency.",
          "Kahneman dhe bashkautorët e quajnë metodën auditim zhurme: njerëzit e së njëjtës njësi gjykojnë të njëjtat raste, dhe sa ndryshojnë përgjigjet e tyre është masa e zhurmës. Zgjidhjet e tyre janë algoritmet, ose procedurat që i shtyjnë gjykimet drejt konsistencës.",
          "Kahneman und seine Mitautoren nennen die Methode Noise-Audit: Menschen derselben Einheit beurteilen dieselben Fälle, und wie weit ihre Antworten auseinanderliegen, ist das Maß der Streuung. Ihre Abhilfen sind Algorithmen oder Verfahren, die Urteile zu mehr Einheitlichkeit führen.") },
        { type: "callout", reading: true, text: x(
          "Noise is invisible until two people judge the same case. Most teams never do that, so they never see it.",
          "Zhurma nuk duket derisa dy njerëz gjykojnë të njëjtin rast. Shumica e ekipeve nuk e bëjnë kurrë këtë, prandaj nuk e shohin kurrë.",
          "Noise bleibt unsichtbar, bis zwei Menschen denselben Fall beurteilen. Die meisten Teams tun das nie, also sehen sie es nie.") },
      ],
      source: ["kahneman-2021", "kahneman-2016"],
    },
    {
      id: "numbers",
      kicker: x("The numbers", "Shifrat", "Die Zahlen"),
      title: [x("What deciding with", "Sa vlen vendimi", "Was Entscheiden"), x("data is worth", "me të dhëna", "mit Daten bringt")],
      lead: x(
        "Erik Brynjolfsson, Lorin Hitt and Heekyung Kim studied how 179 large listed firms make decisions. Those that decided with data had output and productivity 5–6% higher than their other investments and use of IT would predict.",
        "Erik Brynjolfsson, Lorin Hitt dhe Heekyung Kim studiuan si marrin vendime 179 firma të mëdha të listuara. Ato që vendosnin me të dhëna kishin prodhim dhe produktivitet 5–6% më të lartë nga sa do të pritej prej investimeve të tjera dhe përdorimit të IT-së.",
        "Erik Brynjolfsson, Lorin Hitt und Heekyung Kim untersuchten, wie 179 große börsennotierte Firmen entscheiden. Wer mit Daten entschied, hatte eine um 5–6 % höhere Produktion und Produktivität, als ihre übrigen Investitionen und ihre IT-Nutzung erwarten ließen."),
      blocks: [
        { type: "columns", max: 35, height: 100, source: ["brynjolfsson-mcelheran-2016"],
          label: x("US manufacturing plants that decide with data", "Fabrikat e SHBA që vendosin me të dhëna", "US-Fabriken, die mit Daten entscheiden"),
          items: [
            { k: "2005", v: 11, n: pc(11) },
            { k: "2010", v: 30, n: pc(30), alert: true },
          ] },
        { type: "p", text: x(
          "In US manufacturing, Brynjolfsson and Kristina McElheran found that the share of plants deciding with data almost tripled in five years. Among the data leaders of large firms surveyed by Wavestone, 48.1% called their organisation data-driven in 2024, up from 23.9% a year earlier.",
          "Në industrinë e SHBA, Brynjolfsson dhe Kristina McElheran gjetën se pjesa e fabrikave që vendosin me të dhëna pothuajse u trefishua në pesë vjet. Mes drejtuesve të të dhënave në firma të mëdha që pyeti Wavestone, 48,1% e quajtën organizatën e tyre të drejtuar nga të dhënat në 2024, nga 23,9% një vit më parë.",
          "In der US-Industrie fanden Brynjolfsson und Kristina McElheran, dass sich der Anteil der Fabriken, die mit Daten entscheiden, in fünf Jahren fast verdreifachte. Unter den Datenverantwortlichen großer Firmen, die Wavestone befragte, nannten 48,1 % ihre Organisation 2024 datengetrieben, nach 23,9 % ein Jahr zuvor.") },
        { type: "callout", reading: true, text: x(
          "Data pays when it changes how decisions are made, not when it fills more reports.",
          "Të dhënat shpërblejnë kur ndryshojnë mënyrën si merren vendimet, jo kur mbushin më shumë raporte.",
          "Daten zahlen sich aus, wenn sie ändern, wie entschieden wird, nicht wenn sie mehr Berichte füllen.") },
      ],
      note: x(
        "The firm study shows a link, not a cause. The second study counts plants, not firms. Wavestone's figures are data leaders' own view, not a representative sample.",
        "Studimi i firmave tregon një lidhje, jo një shkak. Studimi i dytë numëron fabrika, jo firma. Shifrat e Wavestone janë vlerësimi i vetë drejtuesve të të dhënave, jo mostër përfaqësuese.",
        "Die Firmenstudie zeigt einen Zusammenhang, keine Ursache. Die zweite Studie zählt Fabriken, nicht Firmen. Die Wavestone-Zahlen sind die Sicht der Datenverantwortlichen, keine repräsentative Stichprobe."),
      source: ["bhk-2011", "brynjolfsson-mcelheran-2016", "wavestone-2024"],
    },
    {
      id: "model", more: "kpis-do-not-improve-in-excel",
      kicker: x("The model", "Modeli", "Das Modell"),
      title: [x("Rule, judgment,", "Rregull, gjykim,", "Regel, Urteil"), x("or both", "apo të dyja", "oder beides")],
      lead: x(
        "Data can enter a decision in three ways. Which one fits depends on how often the decision repeats and how differently people answer the same case.",
        "Të dhënat mund të hyjnë në një vendim në tri mënyra. Cila përshtatet varet nga sa shpesh përsëritet vendimi dhe sa ndryshe përgjigjen njerëzit për të njëjtin rast.",
        "Daten können auf drei Arten in eine Entscheidung eingehen. Welche passt, hängt davon ab, wie oft sich die Entscheidung wiederholt und wie verschieden Menschen denselben Fall beantworten."),
      blocks: [
        { type: "rows", compact: true, items: [
          { h: x("A rule decides", "Vendos rregulli", "Eine Regel entscheidet"), p: x("For frequent, similar cases with a clear outcome: the formula gives the answer, people handle the exceptions.", "Për raste të shpeshta e të ngjashme me rezultat të qartë: formula jep përgjigjen, njerëzit merren me përjashtimet.", "Für häufige, ähnliche Fälle mit klarem Ergebnis: Die Formel gibt die Antwort, Menschen kümmern sich um die Ausnahmen.") },
          { h: x("A rule proposes, a person adjusts", "Rregulli propozon, njeriu rregullon", "Eine Regel schlägt vor, ein Mensch passt an"), p: x("The formula gives a figure; the person may move it within a set range and writes down why.", "Formula jep një shifër; njeriu mund ta lëvizë brenda një kufiri të caktuar dhe shkruan pse.", "Die Formel liefert einen Wert; die Person darf ihn in einem festen Rahmen verschieben und notiert, warum.") },
          { h: x("A person decides, with data in front", "Vendos njeriu, me të dhënat përpara", "Ein Mensch entscheidet, mit Daten vor sich"), p: x("For rare or new decisions: the data is evidence, the judgment is the person's, and it is written down so it can be checked later.", "Për vendime të rralla ose të reja: të dhënat janë prova, gjykimi është i njeriut, dhe shkruhet që të kontrollohet më vonë.", "Für seltene oder neue Entscheidungen: Die Daten sind Belege, das Urteil gehört der Person und wird festgehalten, damit man es später prüfen kann.") },
        ] },
        { type: "example", label: x("Hypothetical example, a weekly staffing call", "Shembull hipotetik, vendimi javor për stafin", "Hypothetisches Beispiel, die wöchentliche Personalplanung"), rows: [
          { k: x("Rule", "Rregulli", "Regel"), v: x("Staff = forecast orders ÷ 120 per person", "Stafi = porositë e parashikuara ÷ 120 për person", "Personal = Auftragsprognose ÷ 120 pro Person") },
          { k: x("Adjust", "Ndryshimi", "Anpassung"), v: x("The shift lead may add or remove up to 2 people", "Drejtuesi i turnit mund të shtojë ose heqë deri në 2 veta", "Die Schichtleitung darf bis zu 2 Personen dazu- oder abziehen") },
          { k: x("Record", "Shënimi", "Notiz"), v: x("Each change, with one line on why", "Çdo ndryshim, me një rresht pse", "Jede Änderung, mit einer Zeile zum Grund") },
        ], text: x("After a month, the record shows whether the changes helped. The figures are invented.", "Pas një muaji, shënimet tregojnë nëse ndryshimet ndihmuan. Shifrat janë të shpikura.", "Nach einem Monat zeigen die Notizen, ob die Änderungen geholfen haben. Die Zahlen sind erfunden.") },
        { type: "callout", reading: true, text: x(
          "Data does not replace judgment. It replaces the noise in it: the part that depends on who decides, and on which day.",
          "Të dhënat nuk e zëvendësojnë gjykimin. Zëvendësojnë zhurmën në të: pjesën që varet nga kush vendos, dhe në cilën ditë.",
          "Daten ersetzen das Urteil nicht. Sie ersetzen die Streuung darin: den Teil, der davon abhängt, wer entscheidet, und an welchem Tag.") },
      ],
      note: x(
        "The three ways are the editors' summary; the second follows Dietvorst, Simmons and Massey (2018).",
        "Tri mënyrat janë përmbledhje e redaksisë; e dyta ndjek Dietvorst, Simmons dhe Massey (2018).",
        "Die drei Wege sind eine Zusammenfassung der Redaktion; der zweite folgt Dietvorst, Simmons und Massey (2018)."),
      source: ["dietvorst-2018"],
    },
    {
      id: "research",
      kicker: x("What the research says", "Çfarë thotë kërkimi", "Was die Forschung sagt"),
      title: [x("The formula", "Formula", "Die Formel"), x("and the expert", "dhe eksperti", "und der Experte")],
      lead: x(
        "William Grove and colleagues compared the judgment of experts with mechanical, statistical prediction across studies of prediction in health and human behaviour.",
        "William Grove dhe kolegët krahasuan gjykimin e ekspertëve me parashikimin mekanik, statistikor, në studime parashikimi për shëndetin dhe sjelljen njerëzore.",
        "William Grove und Kollegen verglichen das Urteil von Fachleuten mit mechanischer, statistischer Vorhersage, über Vorhersagestudien zu Gesundheit und menschlichem Verhalten hinweg."),
      blocks: [
        { type: "figures", compact: true, items: [
          { n: x("≈10%", "≈10%", "≈10 %"), t: x("more accurate on average: the formula", "më e saktë mesatarisht: formula", "genauer im Schnitt: die Formel") },
          { n: x("33–47%", "33–47%", "33–47 %"), t: x("of studies: the formula clearly better", "e studimeve: formula qartë më e mirë", "der Studien: die Formel klar besser") },
          { n: x("6–16%", "6–16%", "6–16 %"), t: x("of studies: the expert clearly better", "e studimeve: eksperti qartë më i mirë", "der Studien: der Experte klar besser") },
        ] },
        { type: "p", text: x(
          "Yet people are reluctant to use formulas. In five studies, Berkeley Dietvorst, Joseph Simmons and Cade Massey found that people who saw an algorithm err trusted it less and chose it less often than a worse human forecaster, even when it had done better. They lost faith in it faster than in a person after the same mistake.",
          "Megjithatë njerëzit hezitojnë t'i përdorin formulat. Në pesë studime, Berkeley Dietvorst, Joseph Simmons dhe Cade Massey gjetën se ata që e panë një algoritëm të gabonte i besuan më pak dhe e zgjodhën më rrallë se një njeri më të dobët, edhe kur algoritmi kishte dalë më mirë. Besimin te algoritmi e humbën më shpejt se te njeriu pas të njëjtit gabim.",
          "Dennoch nutzen Menschen Formeln ungern. In fünf Studien fanden Berkeley Dietvorst, Joseph Simmons und Cade Massey, dass Menschen, die einen Algorithmus irren sahen, ihm weniger trauten und ihn seltener wählten als einen schwächeren Menschen, selbst wenn er besser abgeschnitten hatte. Sie verloren das Vertrauen in ihn schneller als in einen Menschen nach demselben Fehler.") },
        { type: "p", text: x(
          "When people could change the algorithm's forecast a little, they used it much more often and did better, even when the change allowed was very small.",
          "Kur njerëzit mund ta ndryshonin pak parashikimin e algoritmit, e përdornin shumë më shpesh dhe dilnin më mirë, edhe kur ndryshimi i lejuar ishte shumë i vogël.",
          "Wenn Menschen die Prognose des Algorithmus ein wenig ändern durften, nutzten sie ihn viel öfter und schnitten besser ab, selbst wenn die erlaubte Änderung sehr klein war.") },
        { type: "callout", reading: true, text: x(
          "Let people adjust the formula a little and write down why. The formula stays in use, and the adjustments stay visible.",
          "Lëri njerëzit ta ndryshojnë pak formulën dhe të shkruajnë pse. Kështu formula mbetet në përdorim, dhe ndryshimet duken.",
          "Menschen die Formel ein wenig anpassen und den Grund notieren lassen. So bleibt die Formel in Gebrauch, und die Anpassungen bleiben sichtbar.") },
      ],
      note: x(
        "In many studies the two were about as accurate. The ranges depend on how a clear difference is counted.",
        "Në shumë studime të dyja ishin pothuajse njësoj të sakta. Kufijtë varen nga si numërohet një ndryshim i qartë.",
        "In vielen Studien waren beide etwa gleich genau. Die Spannen hängen davon ab, wie ein klarer Unterschied gezählt wird."),
      source: ["grove-2000", "dietvorst-2015", "dietvorst-2018"],
    },
    {
      id: "measure",
      kicker: x("How it is measured", "Si matet", "Wie man es misst"),
      title: [x("A noise audit", "Një auditim zhurme", "Ein Noise-Audit"), x("in your team", "në ekipin tënd", "im eigenen Team")],
      lead: x(
        "The audit can be run on a small scale: the same cases, judged separately by the people who usually decide them.",
        "Auditimi mund të bëhet në shkallë të vogël: të njëjtat raste, të gjykuara veçmas nga njerëzit që zakonisht vendosin për to.",
        "Das Audit lässt sich im Kleinen durchführen: dieselben Fälle, getrennt beurteilt von den Menschen, die sonst darüber entscheiden."),
      blocks: [
        { type: "steps", items: [
          { h: x("Choose a repeated decision", "Zgjidh një vendim që përsëritet", "Eine wiederkehrende Entscheidung wählen"), p: x("One that several people make: a priority, an estimate, a grade.", "Një që e marrin disa njerëz: një përparësi, një vlerësim, një notë.", "Eine, die mehrere Menschen treffen: eine Priorität, eine Schätzung, eine Einstufung.") },
          { h: x("Prepare five real cases", "Përgatit pesë raste të vërteta", "Fünf echte Fälle vorbereiten"), p: x("Written up the same way, without names.", "Të shkruara njësoj, pa emra.", "Gleich aufbereitet, ohne Namen.") },
          { h: x("Let each person judge alone", "Secili gjykon vetëm", "Jede Person urteilt allein"), p: x("No discussion until all the answers are in.", "Pa diskutim derisa të vijnë të gjitha përgjigjet.", "Keine Diskussion, bis alle Antworten vorliegen.") },
          { h: x("Look at the spread", "Shiko shpërndarjen", "Die Streuung ansehen"), p: x("For each case, the gap between the highest and the lowest answer.", "Për çdo rast, diferenca mes përgjigjes më të lartë dhe më të ulët.", "Für jeden Fall den Abstand zwischen höchster und niedrigster Antwort.") },
          { h: x("Agree a rule where it is widest", "Vendosni një rregull ku është më e gjerë", "Eine Regel vereinbaren, wo sie am größten ist"), p: x("Write down how such a case is decided, and test again in three months.", "Shkruani si vendoset një rast i tillë, dhe provoni sërish pas tre muajsh.", "Festhalten, wie ein solcher Fall entschieden wird, und in drei Monaten erneut testen.") },
        ] },
        { type: "example", label: x("Hypothetical example, five shift leads estimate the same delays", "Shembull hipotetik, pesë drejtues turni vlerësojnë të njëjtat vonesa", "Hypothetisches Beispiel, fünf Schichtleitungen schätzen dieselben Verspätungen"), rows: [
          { k: x("Case 1", "Rasti 1", "Fall 1"), v: x("from 20 to 45 minutes", "nga 20 në 45 minuta", "von 20 bis 45 Minuten") },
          { k: x("Case 2", "Rasti 2", "Fall 2"), v: x("from 10 to 15 minutes", "nga 10 në 15 minuta", "von 10 bis 15 Minuten") },
          { k: x("Case 3", "Rasti 3", "Fall 3"), v: x("from 30 to 90 minutes", "nga 30 në 90 minuta", "von 30 bis 90 Minuten") },
        ], text: x("Case 3 needs a rule first. The cases and numbers are invented.", "Rasti 3 ka nevojë i pari për një rregull. Rastet dhe numrat janë të shpikur.", "Fall 3 braucht zuerst eine Regel. Fälle und Zahlen sind erfunden.") },
      ],
      note: x(
        "The steps and the example are the editors', after the noise audit described by Kahneman and colleagues.",
        "Hapat dhe shembulli janë të redaksisë, sipas auditimit të zhurmës që përshkruajnë Kahneman dhe kolegët.",
        "Schritte und Beispiel stammen von der Redaktion, nach dem Noise-Audit, das Kahneman und Kollegen beschreiben."),
      source: ["kahneman-2016"],
    },
    {
      id: "tool",
      kicker: x("Tool of the week", "Mjeti i javës", "Werkzeug der Woche"),
      title: [x("The data", "Karta e vendimit", "Die Karte für"), x("decision card", "me të dhëna", "Datenentscheidungen")],
      lead: x(
        "One card for a decision that repeats. Fill it in with the people who make it, and look at it again after a month.",
        "Një kartë për një vendim që përsëritet. Plotësoje me njerëzit që e marrin, dhe shikoje sërish pas një muaji.",
        "Eine Karte für eine Entscheidung, die sich wiederholt. Mit den Menschen ausfüllen, die sie treffen, und nach einem Monat wieder ansehen."),
      blocks: [
        { type: "form", items: [
          { h: x("The decision", "Vendimi", "Die Entscheidung"), hint: x("what is decided, how often, by whom", "çfarë vendoset, sa shpesh, nga kush", "was entschieden wird, wie oft, von wem") },
          { h: x("The data", "Të dhënat", "Die Daten"), hint: x("which figures, from where, how fresh", "cilat shifra, nga ku, sa të freskëta", "welche Zahlen, woher, wie aktuell") },
          { h: x("The rule", "Rregulli", "Die Regel"), hint: x("how the data becomes an answer", "si bëhen të dhënat përgjigje", "wie aus den Daten eine Antwort wird"), lines: 2 },
          { h: x("What a person may change", "Çfarë mund të ndryshojë njeriu", "Was ein Mensch ändern darf"), hint: x("by how much, with the reason written down", "sa, me arsyen të shkruar", "wie viel, mit notiertem Grund") },
          { h: x("Noise test", "Testi i zhurmës", "Streuungstest"), hint: x("date, five cases, who judges them", "data, pesë raste, kush i gjykon", "Datum, fünf Fälle, wer sie beurteilt") },
          { h: x("Review", "Rishikimi", "Review"), hint: x("after a month: did the changes help?", "pas një muaji: a ndihmuan ndryshimet?", "nach einem Monat: Haben die Änderungen geholfen?") },
        ] },
      ],
      note: x(
        "A practice proposed by the editors, after the noise audit of Kahneman and colleagues and the adjustable algorithms of Dietvorst, Simmons and Massey.",
        "Praktikë e propozuar nga redaksia, sipas auditimit të zhurmës të Kahneman dhe kolegëve dhe algoritmeve që ndryshohen të Dietvorst, Simmons dhe Massey.",
        "Eine Praxis, die die Redaktion vorschlägt, nach dem Noise-Audit von Kahneman und Kollegen und den anpassbaren Algorithmen von Dietvorst, Simmons und Massey."),
      source: ["kahneman-2016", "dietvorst-2018"],
    },
    { id: "sources", type: "sources" },
    { id: "back", type: "back" },
  ],
};
