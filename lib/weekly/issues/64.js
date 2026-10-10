// Management Review, No. 64: Scenarios: a plan for more than one future. Block: Strategy.
// Facts and their sources: docs/revista/management-review-nr-64.md.
import { x, pc } from "../common.js";

export default {
  number: 64,
  block: "strategy",
  date: x("November 2026", "Nëntor 2026", "November 2026"),
  theme: [x("Scenarios:", "Skenarët:", "Szenarien:"), x("a plan for more than one future", "plani për më shumë se një të ardhme", "ein Plan für mehr als eine Zukunft")],
  sub: x(
    "Why Wack called accurate forecasts dangerous, how use of the tool rose and fell, two uncertainties and four worlds, what scenarios changed in experts, how prepared firms fared, and a card for your own scenarios.",
    "Pse Wack-u i quajti të rrezikshme parashikimet e sakta, si u ngrit dhe ra përdorimi i mjetit, dy pasiguri dhe katër botë, çfarë ndryshuan skenarët te ekspertët, si u shkoi firmave të përgatitura, dhe një kartë për skenarët e tu.",
    "Warum Wack genaue Prognosen gefährlich nannte, wie die Nutzung des Werkzeugs stieg und fiel, zwei Unsicherheiten und vier Welten, was Szenarien bei Fachleuten änderten, wie es vorbereiteten Firmen erging, und eine Karte für eigene Szenarien."),
  seo: x(
    "Scenario planning: Wack on forecasts, Bain's usage figures, Schoemaker's two uncertainties, a field study with experts, Rohrbeck on foresight, and a card.",
    "Skenarët: Wack-u për parashikimet, shifrat e Bain-it, dy pasiguritë e Schoemaker-it, një studim me ekspertë, Rohrbeck-u për largpamësinë dhe një kartë.",
    "Szenarioplanung: Wack über Prognosen, Bains Nutzungszahlen, Schoemakers zwei Unsicherheiten, eine Feldstudie mit Fachleuten, Rohrbeck und eine Karte."),
  feature: x(
    "Issue 64 starts with Pierre Wack's warning that forecasts are dangerous precisely because they are often right, follows the use of scenario planning in Bain's surveys from 1993 to 2017, crosses two uncertainties into four worlds with Paul Schoemaker, looks at a field study in which scenarios changed experts' judgments but not their confidence, asks how firms prepared for the future fared seven years later, and ends with a card for building your own scenarios.",
    "Numri 64 nis me paralajmërimin e Pierre Wack-ut se parashikimet janë të rrezikshme pikërisht sepse shpesh dalin të sakta, ndjek përdorimin e planifikimit me skenarë në anketat e Bain-it nga 1993 deri në 2017, kryqëzon dy pasiguri në katër botë me Paul Schoemaker-in, shikon një studim në terren ku skenarët ndryshuan gjykimet e ekspertëve, por jo sigurinë e tyre, pyet si u shkoi pas shtatë vjetësh firmave të përgatitura për të ardhmen, dhe mbyllet me një kartë për të ndërtuar skenarët e tu.",
    "Ausgabe 64 beginnt mit Pierre Wacks Warnung, Prognosen seien gerade deshalb gefährlich, weil sie oft stimmen, verfolgt die Nutzung der Szenarioplanung in Bains Umfragen von 1993 bis 2017, kreuzt mit Paul Schoemaker zwei Unsicherheiten zu vier Welten, betrachtet eine Feldstudie, in der Szenarien das Urteil von Fachleuten änderten, nicht aber ihre Sicherheit, fragt, wie es auf die Zukunft vorbereiteten Firmen sieben Jahre später erging, und endet mit einer Karte für eigene Szenarien."),
  figure: { n: x("1 in 3", "1 nga 3", "1 von 3"), by: "Wack, 1985", t: x(
    "of Shell's critical decision centres, at most, were acting on its 1972 scenarios a few months later. The rest found them interesting and carried on as before.",
    "qendra kyçe të vendimeve të Shell-it, në rastin më të mirë, vepronin sipas skenarëve të 1972 disa muaj më vonë. Të tjerat i gjetën interesantë dhe vazhduan si më parë.",
    "wichtigen Entscheidungszentren von Shell handelte einige Monate später nach den Szenarien von 1972, und nicht mehr. Die übrigen fanden sie interessant und machten weiter wie bisher.") },
  teasers: [
    { page: "story", kicker: x("Cover story", "Tema kryesore", "Titelthema"),
      title: x("Water on a stone", "Ujë mbi gur", "Wasser auf Stein") },
    { page: "model", kicker: x("The model", "Modeli", "Das Modell"),
      title: x("Two uncertainties, four worlds", "Dy pasiguri, katër botë", "Zwei Unsicherheiten, vier Welten") },
    { page: "tool", kicker: x("Tool of the issue", "Mjeti i numrit", "Werkzeug der Ausgabe"),
      title: x("The scenario card", "Karta e skenarëve", "Die Szenario-Karte") },
  ],
  sources: ["scen-wack-1985", "scen-rigby-2007", "bain-2007", "scen-bain-2017", "scen-schoemaker-1995", "scen-phadnis-2015", "scen-meissner-wulf-2013", "scen-rohrbeck-kum-2018"],
  pages: [
    { id: "cover", type: "cover" },
    {
      id: "intro", type: "intro",
      why: x(
        "Most plans rest on one forecast, and most of the time that is enough. This issue is about the times it is not: how to plan for several futures at once, without pretending to know which one will come.",
        "Shumica e planeve mbështeten te një parashikim i vetëm, dhe shumicën e kohës kjo mjafton. Ky numër flet për rastet kur nuk mjafton: si planifikon për disa të ardhme njëherësh, pa u shtirur se e di cila do të vijë.",
        "Die meisten Pläne beruhen auf einer einzigen Prognose, und meistens reicht das. Diese Ausgabe handelt von den Fällen, in denen es nicht reicht: wie man für mehrere Zukünfte zugleich plant, ohne so zu tun, als wüsste man, welche kommt."),
      body: x(
        "Pierre Wack, who headed Shell's business environment division from 1971, found that good scenarios were not enough: they had to change how managers saw the world. In Bain's surveys, the tool's use rose to 70% in 2002 and fell to 19% by 2017. Paul Schoemaker shows how to cross two uncertainties into four worlds. In field studies by MIT researchers, experts changed most of their judgments but not their confidence, and leaned more towards flexible options. A longitudinal study links preparing for the future with better results.",
        "Pierre Wack-u, që drejtoi divizionin e mjedisit të biznesit te Shell-i nga 1971, zbuloi se skenarët e mirë nuk mjaftonin: duhej të ndryshonin mënyrën si e shihnin botën drejtuesit. Në anketat e Bain-it, përdorimi i mjetit u ngrit në 70% në 2002 dhe ra në 19% deri në 2017. Paul Schoemaker-i tregon si kryqëzohen dy pasiguri në katër botë. Në studimet në terren të studiuesve të MIT-it, ekspertët ndryshuan shumicën e gjykimeve, por jo sigurinë e tyre, dhe anuan më shumë nga zgjedhjet fleksibile. Një studim shumëvjeçar e lidh përgatitjen për të ardhmen me rezultate më të mira.",
        "Pierre Wack, der ab 1971 bei Shell die Abteilung für das Geschäftsumfeld leitete, stellte fest, dass gute Szenarien nicht genügten: Sie mussten verändern, wie Führungskräfte die Welt sahen. In Bains Umfragen stieg die Nutzung des Werkzeugs 2002 auf 70 % und fiel bis 2017 auf 19 %. Paul Schoemaker zeigt, wie man zwei Unsicherheiten zu vier Welten kreuzt. In Feldstudien von MIT-Forschern änderten Fachleute die meisten Urteile, nicht aber ihre Sicherheit, und neigten stärker zu flexiblen Optionen. Eine Langzeitstudie verbindet Vorbereitung auf die Zukunft mit besseren Ergebnissen."),
    },
    {
      id: "story", more: "high-volume-days",
      kicker: x("Cover story", "Tema kryesore", "Titelthema"),
      title: [x("Water", "Ujë", "Wasser"), x("on a stone", "mbi gur", "auf Stein")],
      lead: x(
        "Pierre Wack headed the business environment division of Shell's planning department from 1971 to 1981. In 1985 he opened his account in Harvard Business Review with a warning about forecasts:",
        "Pierre Wack-u drejtoi divizionin e mjedisit të biznesit në departamentin e planifikimit të Shell-it nga 1971 deri në 1981. Në 1985 e hapi rrëfimin e tij te Harvard Business Review me një paralajmërim për parashikimet:",
        "Pierre Wack leitete von 1971 bis 1981 die Abteilung für das Geschäftsumfeld in der Planung von Shell. 1985 eröffnete er seinen Bericht in der Harvard Business Review mit einer Warnung vor Prognosen:"),
      blocks: [
        { type: "quote", text: x(
          "Forecasts are not always wrong; more often than not, they can be reasonably accurate. And that is what makes them so dangerous.",
          "Parashikimet nuk janë gjithmonë të gabuara; më shpesh se jo, mund të jenë mjaft të sakta. Dhe kjo është ajo që i bën kaq të rrezikshme.",
          "Prognosen sind nicht immer falsch; meistens sind sie recht genau. Und genau das macht sie so gefährlich.") },
        { type: "p", text: x(
          "They fail, he wrote, when they are needed most: when the environment shifts. Shell's first scenarios only combined obvious uncertainties and gave managers nothing to act on. Those of 1972 caught top management's attention, yet months later no more than a third of the critical decision centres were acting on them. Without changing the picture of reality in managers' heads, scenarios were like water on a stone.",
          "Dështojnë, shkroi ai, pikërisht kur duhen më shumë: kur mjedisi ndryshon. Skenarët e parë të Shell-it vetëm kombinonin pasiguritë e dukshme dhe drejtuesve nuk u jepnin asgjë për të vepruar. Ata të 1972 i tërhoqën vëmendjen drejtimit të lartë, por disa muaj më vonë jo më shumë se një e treta e qendrave kyçe të vendimeve vepronin sipas tyre. Pa ndryshuar pamjen e realitetit në kokën e drejtuesve, skenarët ishin si ujë mbi gur.",
          "Sie versagen, schrieb er, wenn man sie am meisten braucht: wenn sich das Umfeld verschiebt. Shells erste Szenarien kombinierten nur offensichtliche Unsicherheiten und boten der Führung nichts, wonach sie handeln konnte. Die von 1972 weckten die Aufmerksamkeit der Konzernspitze, doch Monate später handelte nicht mehr als ein Drittel der wichtigen Entscheidungszentren danach. Ohne das Bild der Wirklichkeit in den Köpfen der Führungskräfte zu ändern, waren Szenarien wie Wasser auf Stein.") },
        { type: "cards", cols: 3, items: [
          { h: x("First generation", "Brezi i parë", "Erste Generation"), p: x("the obvious uncertainties, quantified: good for questions, not for decisions", "pasiguritë e dukshme, të matura: për pyetje, jo për vendime", "die offensichtlichen Unsicherheiten, beziffert: für Fragen, nicht für Entscheidungen") },
          { h: x("Predetermined", "Të paracaktuarat", "Vorbestimmtes"), p: x("events that have happened, whose consequences have not yet unfolded", "ngjarje që kanë ndodhur, me pasoja ende të pashpalosura", "Ereignisse, die eingetreten sind, deren Folgen noch ausstehen") },
          { h: x("Microcosm", "Mikrokozmosi", "Mikrokosmos"), p: x("the decision maker's mental model, the real target of a scenario", "modeli mendor i vendimmarrësit, objektivi i vërtetë i skenarit", "das Denkmodell der Entscheider, das eigentliche Ziel eines Szenarios") },
        ] },
        { type: "callout", reading: true, text: x(
          "A scenario that nobody acts on is a report. Its test is whether someone decides differently.",
          "Një skenar sipas të cilit nuk vepron askush është një raport. Prova e tij është nëse dikush vendos ndryshe.",
          "Ein Szenario, nach dem niemand handelt, ist ein Bericht. Sein Test ist, ob jemand anders entscheidet.") },
      ],
      note: x(
        "All of this is Wack's own account. Of 1973 the article says only that Shell was prepared for the eventuality, if not the timing, of the oil crisis.",
        "E gjitha është rrëfimi i vetë Wack-ut. Për 1973-shin artikulli thotë vetëm se Shell-i ishte gati për mundësinë, jo për kohën, e krizës së naftës.",
        "All das ist Wacks eigene Darstellung. Zu 1973 sagt der Artikel nur, Shell sei auf die Möglichkeit, nicht auf den Zeitpunkt der Ölkrise vorbereitet gewesen."),
      source: ["scen-wack-1985"],
    },
    {
      id: "numbers",
      kicker: x("The numbers", "Shifrat", "Die Zahlen"),
      title: [x("In fashion", "Në modë", "In Mode"), x("after the shock", "pas tronditjes", "nach dem Schock")],
      lead: x(
        "Since 1993 Bain & Company has asked executives around the world which management tools they used in the past year. Scenario and contingency planning counts as one tool. The share of respondents who used it:",
        "Që nga 1993, Bain & Company i pyet drejtuesit anembanë botës cilat mjete menaxhimi kanë përdorur gjatë vitit. Planifikimi me skenarë dhe me plane rezervë numërohet si një mjet i vetëm. Pjesa e të anketuarve që e përdorën:",
        "Seit 1993 fragt Bain & Company Führungskräfte weltweit, welche Managementwerkzeuge sie im vergangenen Jahr genutzt haben. Szenario- und Notfallplanung zählt dabei als ein Werkzeug. Der Anteil der Befragten, die es nutzten:"),
      blocks: [
        { type: "columns", max: 80, height: 110, source: ["scen-rigby-2007", "bain-2007", "scen-bain-2017"],
          label: x("Executives using scenario and contingency planning, Bain surveys", "Drejtues që përdorin planifikimin me skenarë dhe plane rezervë, anketat e Bain-it", "Führungskräfte, die Szenario- und Notfallplanung nutzen, Bain-Umfragen"),
          items: [
            { k: "1993", v: 38, n: pc(38) },
            { k: "2002", v: 70, n: pc(70) },
            { k: "2006", v: 69, n: pc(69) },
            { k: "2017", v: 19, n: pc(19), alert: true },
          ] },
        { type: "p", text: x(
          "Bain links the rise after 2001 to the attacks of 11 September; in 2007 Darrell Rigby added Hurricane Katrina. In 2017 managers named it one of the two tools whose use would grow most. They had said the same in 2014, Bain notes, and neither tool then made the top ten.",
          "Bain-i e lidh rritjen pas 2001 me sulmet e 11 shtatorit; në 2007 Darrell Rigby shtoi edhe uraganin Katrina. Në 2017 drejtuesit e përmendën si një nga dy mjetet, përdorimi i të cilëve do të rritej më shumë. Të njëjtën gjë kishin thënë edhe në 2014, shënon Bain-i, dhe asnjëri nga të dy mjetet nuk hyri pastaj te dhjetë të parët.",
          "Bain verbindet den Anstieg nach 2001 mit den Anschlägen vom 11. September; 2007 nannte Darrell Rigby auch den Hurrikan Katrina. 2017 zählten die Führungskräfte es zu den zwei Werkzeugen, deren Nutzung am stärksten wachsen werde. Dasselbe hatten sie 2014 gesagt, merkt Bain an, und keines der beiden kam danach unter die ersten zehn.") },
        { type: "callout", reading: true, text: x(
          "A tool picked up after a shock and put away in calm years is being used as insurance, not as a way of thinking.",
          "Një mjet që merret në dorë pas një tronditjeje dhe lihet mënjanë në vitet e qeta përdoret si sigurim, jo si mënyrë të menduari.",
          "Ein Werkzeug, das man nach einem Schock hervorholt und in ruhigen Jahren weglegt, dient als Versicherung, nicht als Denkweise.") },
      ],
      note: x(
        "Self-reports, with a different sample each time (1,268 managers in 2017). The tool joins scenarios with contingency plans, which Schoemaker keeps apart: a contingency plan looks at one uncertainty, scenarios at several together.",
        "Vetëdeklarime, me mostër të ndryshme çdo herë (1.268 drejtues në 2017). Mjeti bashkon skenarët me planet rezervë, që Schoemaker-i i mban të ndara: plani rezervë shikon një pasiguri, skenarët disa bashkë.",
        "Selbstauskünfte, jedes Mal mit einer anderen Stichprobe (1.268 Führungskräfte 2017). Das Werkzeug fasst Szenarien und Notfallpläne zusammen, die Schoemaker trennt: Ein Notfallplan betrachtet eine Unsicherheit, Szenarien mehrere zugleich."),
      source: ["scen-rigby-2007", "bain-2007", "scen-bain-2017", "scen-schoemaker-1995"],
    },
    {
      id: "model",
      kicker: x("The model", "Modeli", "Das Modell"),
      title: [x("Two uncertainties,", "Dy pasiguri,", "Zwei Unsicherheiten,"), x("four worlds", "katër botë", "vier Welten")],
      lead: x(
        "Paul Schoemaker of the Wharton School sets out ten steps, from the scope to the trends and uncertainties to decision scenarios. One shortcut: cross the two most important uncertainties. Anglo American did so in South Africa in 1984:",
        "Paul Schoemaker-i i Wharton School shtjellon dhjetë hapa, nga fusha te prirjet dhe pasiguritë e deri te skenarët për vendime. Një rrugë e shkurtër: kryqëzo dy pasiguritë më të rëndësishme. Kështu bëri Anglo American në Afrikën e Jugut në 1984:",
        "Paul Schoemaker von der Wharton School beschreibt zehn Schritte, vom Rahmen über Trends und Unsicherheiten bis zu Entscheidungsszenarien. Eine Abkürzung: die zwei wichtigsten Unsicherheiten kreuzen. So machte es Anglo American 1984 in Südafrika:"),
      blocks: [
        { type: "matrix", y: x("US and USSR", "SHBA dhe BRSS", "USA und UdSSR"), x: x("US and Japan", "SHBA dhe Japonia", "USA und Japan"), cells: [
          { h: x("Imperial Twilight", "Muzgu perandorak", "Imperiale Dämmerung"), tone: "dim", where: x("arms race · trade accommodation", "garë armatimesh · marrëveshje tregtare", "Wettrüsten · Handelseinigung"), p: x("Unrest in the Middle East and the spread of AIDS fitted this world better than the others.", "Trazirat në Lindjen e Mesme dhe përhapja e AIDS-it i përshtateshin kësaj bote më mirë se të tjerave.", "Unruhen im Nahen Osten und die Ausbreitung von Aids passten besser in diese Welt als in die anderen.") },
          { h: x("Dropped", "U hoq", "Gestrichen"), tone: "red", where: x("arms race · trade conflict", "garë armatimesh · konflikt tregtar", "Wettrüsten · Handelskonflikt"), p: x("Judged implausible: the US would not take on both at once.", "U gjykua e pabesueshme: SHBA nuk do t'i merrte përsipër të dyja njëherësh.", "Als unplausibel beurteilt: Die USA würden nicht beides zugleich eingehen.") },
          { h: x("Industrial Renaissance", "Rilindja industriale", "Industrielle Renaissance"), tone: "blue", where: x("détente · trade accommodation", "zbutje · marrëveshje tregtare", "Entspannung · Handelseinigung"), p: x("A name captures the essence of a world and makes the story easy to remember.", "Një emër e kap thelbin e një bote dhe e bën historinë të lehtë për t'u mbajtur mend.", "Ein Name fasst das Wesen einer Welt und macht die Geschichte leicht zu merken.") },
          { h: x("Protracted Transition", "Tranzicioni i zgjatur", "Verschleppter Übergang"), tone: "dim", where: x("détente · trade conflict", "zbutje · konflikt tregtar", "Entspannung · Handelskonflikt"), p: x("For each world, Anglo estimated growth and which countries would succeed.", "Për secilën botë, Anglo vlerësoi rritjen dhe cilat vende do të kishin sukses.", "Für jede Welt schätzte Anglo das Wachstum und welche Länder Erfolg hätten.") },
        ] },
        { type: "box", title: x("Schoemaker's four tests of a scenario set", "Katër provat e Schoemaker-it për një grup skenarësh", "Schoemakers vier Prüfungen für Szenarien"), items: [
          x("relevant: it connects with the users' mental maps and concerns", "i rëndësishëm: lidhet me hartat mendore dhe shqetësimet e atyre që e përdorin", "relevant: Es knüpft an die Denkmuster und Sorgen der Nutzer an"),
          x("internally consistent, and seen to be so", "i qëndrueshëm brenda vetes, dhe që shihet si i tillë", "in sich stimmig, und als stimmig erkennbar"),
          x("archetypal: generically different futures, not variations on one theme", "arketipal: të ardhme thelbësisht të ndryshme, jo variante të një teme", "archetypisch: grundlegend verschiedene Zukünfte, keine Varianten eines Themas"),
          x("each a state that can last for some time, not a passing moment", "secili një gjendje që mund të zgjasë, jo një çast kalimtar", "jedes ein Zustand, der eine Weile hält, kein flüchtiger Moment"),
        ] },
      ],
      note: x(
        "The steps, the tests and the Anglo American case are as Schoemaker reports them (1995); the short notes in the cells are the editors' summary.",
        "Hapat, provat dhe rasti i Anglo American janë siç i jep Schoemaker-i (1995); shënimet e shkurtra në kuti janë përmbledhje e redaksisë.",
        "Schritte, Prüfungen und der Fall Anglo American folgen Schoemakers Darstellung (1995); die kurzen Notizen in den Feldern fasst die Redaktion zusammen."),
      source: ["scen-schoemaker-1995"],
    },
    {
      id: "research",
      kicker: x("What the research says", "Çfarë thotë kërkimi", "Was die Forschung sagt"),
      title: [x("Not more sure,", "Jo më të sigurt,", "Nicht sicherer,"), x("more flexible", "më fleksibël", "flexibler")],
      lead: x(
        "Shardul Phadnis and colleagues at MIT tested scenarios with field experts, from carrier owners to state planners, judging real US transport investments 30 years ahead. In one workshop, 27 experts chose how flexibly to invest:",
        "Shardul Phadnis dhe kolegët në MIT i provuan skenarët me ekspertë nga terreni, nga pronarë transportuesish te planifikues shtetërorë, që gjykonin investime të vërteta në transportin e SHBA 30 vjet përpara. Në një seminar, 27 ekspertë zgjodhën sa fleksibël të investohej:",
        "Shardul Phadnis und Kollegen am MIT testeten Szenarien mit Fachleuten aus der Praxis, von Transportunternehmern bis zu Landesplanern, die echte US-Verkehrsinvestitionen 30 Jahre voraus beurteilten. In einem Workshop wählten 27 von ihnen, wie flexibel investiert werden sollte:"),
      blocks: [
        { type: "pairs", from: x("Before", "Para", "Vorher"), to: x("After the scenarios", "Pas skenarëve", "Nach den Szenarien"), max: 70, source: ["scen-phadnis-2015"],
          label: x("Share of 351 recommendations, by option", "Pjesa e 351 rekomandimeve, sipas zgjedhjes", "Anteil an 351 Empfehlungen, nach Option"),
          rows: [
            { k: x("Specific projects (least flexible)", "Projekte të caktuara (më pak fleksibël)", "Bestimmte Projekte (am starrsten)"), a: 65.2, an: x("65.2%", "65,2%", "65,2 %"), b: 50.1, bn: x("50.1%", "50,1%", "50,1 %"), alert: true },
            { k: x("Option 3", "Zgjedhja 3", "Option 3"), a: 12.3, an: x("12.3%", "12,3%", "12,3 %"), b: 23.1, bn: x("23.1%", "23,1%", "23,1 %") },
            { k: x("Funds only (most flexible)", "Vetëm fonde (më fleksibël)", "Nur Mittel (am flexibelsten)"), a: 7.4, an: x("7.4%", "7,4%", "7,4 %"), b: 11.4, bn: x("11.4%", "11,4%", "11,4 %") },
          ] },
        { type: "p", text: x(
          "In another workshop, 71.3% of judgments changed after one scenario, yet after all of them average confidence was the same (0.811 and 0.814). Earlier tests used students: Schoemaker's 68 MBA students widened their ranges by about half; Meissner and Wulf found less framing bias among 252.",
          "Në një seminar tjetër, pas një skenari ndryshuan 71,3% e gjykimeve, por pas të gjithëve siguria mesatare ishte e njëjtë (0,811 dhe 0,814). Provat e mëparshme ishin me studentë: 68 studentët MBA të Schoemaker-it i zgjeruan intervalet afërsisht me gjysmën; Meissner-i dhe Wulf-i gjetën më pak paragjykim kornizimi te 252.",
          "In einem anderen Workshop änderten sich nach einem Szenario 71,3 % der Urteile, nach allen blieb die Sicherheit im Schnitt gleich (0,811 und 0,814). Frühere Tests nutzten Studierende: Schoemakers 68 MBA-Studierende weiteten ihre Spannen um etwa die Hälfte; Meissner und Wulf fanden bei 252 weniger Framing-Effekt.") },
        { type: "callout", reading: true, text: x(
          "Scenarios made the experts neither surer nor less sure. They kept more doors open.",
          "Skenarët nuk i bënë ekspertët as më të sigurt, as më të pasigurt. I bënë të mbanin më shumë dyer hapur.",
          "Szenarien machten die Fachleute weder sicherer noch unsicherer. Sie hielten mehr Türen offen.") },
      ],
      note: x(
        "No control group: the workshop was the treatment. The shifts were significant except for the most flexible option (p = 0.056).",
        "Pa grup kontrolli: vetë seminari ishte trajtimi. Zhvendosjet ishin domethënëse, përveç asaj për zgjedhjen më fleksibël (p = 0,056).",
        "Keine Kontrollgruppe: Der Workshop war die Intervention. Die Verschiebungen waren signifikant, außer bei der flexibelsten Option (p = 0,056)."),
      source: ["scen-phadnis-2015", "scen-schoemaker-1995", "scen-meissner-wulf-2013"],
    },
    {
      id: "measure",
      kicker: x("How it is measured", "Si matet", "Wie man es misst"),
      title: [x("Prepared", "Gati", "Vorbereitet"), x("or not", "apo jo", "oder nicht")],
      lead: x(
        "René Rohrbeck and Menes Etingue Kum measured in 2008 how prepared 83 large European firms were for the future: how much foresight their environment called for, against how mature their practices were. In 2015 they looked at the results.",
        "René Rohrbeck-u dhe Menes Etingue Kum-i matën në 2008 sa të përgatitura për të ardhmen ishin 83 firma të mëdha europiane: sa largpamësi kërkonte mjedisi i tyre, kundrejt sa të pjekura ishin praktikat e tyre. Në 2015 panë rezultatet.",
        "René Rohrbeck und Menes Etingue Kum maßen 2008, wie gut 83 große europäische Firmen auf die Zukunft vorbereitet waren: wie viel Vorausschau ihr Umfeld verlangte, verglichen mit der Reife ihrer Praktiken. 2015 sahen sie sich die Ergebnisse an."),
      blocks: [
        { type: "hbars", source: ["scen-rohrbeck-kum-2018"],
          label: x("83 European firms, 2008", "83 firma europiane, 2008", "83 europäische Firmen, 2008"),
          items: [
            { k: x("Vigilant: practice matches need", "Vigjilente: praktika i përgjigjet nevojës", "Wachsam: Praxis passt zum Bedarf"), v: 36, n: pc(36) },
            { k: x("More practice than needed", "Më shumë praktikë se ç'duhet", "Mehr Praxis als nötig"), v: 16, n: pc(16) },
            { k: x("Vulnerable or in danger: too little", "Të cenueshme ose në rrezik: shumë pak", "Verwundbar oder gefährdet: zu wenig"), v: 48, n: pc(48), alert: true },
          ] },
        { type: "p", text: x(
          "The vigilant firms averaged 16% profitability, against 12% for their industries. Their market value grew by 75% from 2008 to 2015, against 25% for the sample; the firms with more practice than they needed shrank by 6%.",
          "Firmat vigjilente patën mesatarisht 16% përfitueshmëri, kundrejt 12% të industrive të tyre. Vlera e tyre e tregut u rrit me 75% nga 2008 deri në 2015, kundrejt 25% të mostrës; firmat me më shumë praktikë se ç'u duhej u tkurrën me 6%.",
          "Die wachsamen Firmen erreichten im Schnitt 16 % Rentabilität, ihre Branchen 12 %. Ihr Börsenwert wuchs von 2008 bis 2015 um 75 %, der der Stichprobe um 25 %; die Firmen mit mehr Praxis als nötig schrumpften um 6 %.") },
        { type: "example", label: x("Hypothetical example, a parcel depot, one year ahead", "Shembull hipotetik, një depo pakosh, një vit përpara", "Hypothetisches Beispiel, ein Paketdepot, ein Jahr voraus"), rows: [
          { k: x("World", "Bota", "Welt"), v: x("“Busy and short-handed”: volume up, drivers hard to find", "“Plot dhe pa njerëz”: vëllimi lart, shoferë që gjenden me vështirësi", "„Voll und knapp besetzt“: mehr Volumen, Fahrer schwer zu finden") },
          { k: x("Signal", "Sinjali", "Signal"), v: x("applicants per opening, checked every month", "kandidatë për çdo vend të lirë, të kontrolluar çdo muaj", "Bewerbungen je offene Stelle, jeden Monat geprüft") },
          { k: x("Trigger", "Pragu", "Auslöser"), v: x("below 2 for two months: start training reserves", "nën 2 për dy muaj: nis trajnimin e rezervave", "zwei Monate unter 2: Reserven schulen") },
        ], text: x("The case and the numbers are invented.", "Rasti dhe numrat janë të shpikur.", "Fall und Zahlen sind erfunden.") },
      ],
      note: x(
        "Profitability for 70 firms, market value for 42 listed ones; foresight is wider than scenarios. A signal per scenario follows Schoemaker.",
        "Përfitueshmëria për 70 firma, vlera e tregut për 42 të listuara; largpamësia është më e gjerë se skenarët. Një sinjal për çdo skenar ndjek Schoemaker-in.",
        "Rentabilität für 70 Firmen, Börsenwert für 42 börsennotierte; Vorausschau ist breiter als Szenarien. Ein Signal je Szenario folgt Schoemaker."),
      source: ["scen-rohrbeck-kum-2018", "scen-schoemaker-1995"],
    },
    {
      id: "tool", tool: "/tools/sigma-control-chart/",
      kicker: x("Tool of the issue", "Mjeti i numrit", "Werkzeug der Ausgabe"),
      title: [x("The scenario", "Karta", "Die Szenario-"), x("card", "e skenarëve", "Karte")],
      lead: x(
        "One decision, one horizon. Write down what is already certain before what is not, give each world a name, and decide now which signal will tell you that it is coming.",
        "Një vendim, një horizont. Shkruaj atë që është tashmë e sigurt para asaj që nuk është, jepi secilës botë një emër, dhe vendos qysh tani cili sinjal do të të tregojë se po vjen.",
        "Eine Entscheidung, ein Horizont. Erst aufschreiben, was schon feststeht, dann, was offen ist, jeder Welt einen Namen geben und jetzt festlegen, welches Signal zeigt, dass sie kommt."),
      blocks: [
        { type: "form", items: [
          { h: x("Decision and horizon", "Vendimi dhe horizonti", "Entscheidung und Horizont"), hint: x("what we must decide, and how far ahead we look", "çfarë duhet të vendosim, dhe sa larg shohim", "was wir entscheiden müssen und wie weit wir vorausschauen") },
          { h: x("What is already certain", "Çfarë është tashmë e sigurt", "Was schon feststeht"), hint: x("trends everyone in the room accepts; the rest goes below", "prirje që i pranojnë të gjithë në sallë; pjesa tjetër shkon më poshtë", "Trends, die alle im Raum akzeptieren; der Rest gehört nach unten") },
          { h: x("Two uncertainties", "Dy pasiguri", "Zwei Unsicherheiten"), hint: x("the two that matter most, each with two plausible outcomes", "dy më të rëndësishmet, secila me dy përfundime të besueshme", "die zwei wichtigsten, jede mit zwei plausiblen Ausgängen") },
          { h: x("Four worlds", "Katër botë", "Vier Welten"), hint: x("a name for each; strike one out only if it cannot happen", "një emër për secilën; hiq një vetëm nëse nuk mund të ndodhë", "ein Name für jede; eine nur streichen, wenn sie nicht eintreten kann"), lines: 2 },
          { h: x("Moves", "Lëvizjet", "Schritte"), hint: x("useful in every world and wasteful in none; then those for one world only", "të dobishme në çdo botë dhe të kota në asnjë; pastaj ato vetëm për një botë", "nützlich in jeder Welt und in keiner vergeudet; dann die für nur eine Welt") },
          { h: x("Signals and review", "Sinjalet dhe rishikimi", "Signale und Überprüfung"), hint: x("one early sign per world, who watches it, the date we look again", "një shenjë e hershme për çdo botë, kush e ndjek, data kur shohim përsëri", "ein frühes Zeichen je Welt, wer es beobachtet, wann wir wieder hinsehen") },
        ] },
      ],
      note: x(
        "A practice proposed by the editors, after Wack's predetermined elements, Schoemaker's two uncertainties and early indicators, and the robust investments of Phadnis et al. The control chart helps tell a real signal from noise.",
        "Praktikë e propozuar nga redaksia, sipas elementeve të paracaktuara të Wack-ut, dy pasigurive dhe treguesve të hershëm të Schoemaker-it, dhe investimeve të qëndrueshme te Phadnis et al. Grafiku i kontrollit ndihmon të dallosh një sinjal të vërtetë nga zhurma.",
        "Eine Praxis, die die Redaktion vorschlägt, nach Wacks vorbestimmten Elementen, Schoemakers zwei Unsicherheiten und frühen Indikatoren sowie den robusten Investitionen bei Phadnis et al. Die Regelkarte hilft, ein echtes Signal von Rauschen zu unterscheiden."),
      source: ["scen-wack-1985", "scen-schoemaker-1995", "scen-phadnis-2015"],
    },
    { id: "sources", type: "sources" },
    { id: "back", type: "back" },
  ],
};
