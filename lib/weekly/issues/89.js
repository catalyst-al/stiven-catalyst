// Management Review, No. 89: Hours awake, and why a tired shift performs like an impaired one. Block: People.
// Facts and their sources: docs/revista/management-review-nr-89.md. Barger et al. (2006, PLoS Medicine) and Tefft
// (2016, AAA Foundation) were read in full. The laboratory studies of Dawson & Reid (1997) and Williamson & Feyer (2000)
// and the two NEJM trials of 2004 could not be opened in full: their figures are from the abstracts and from the two
// full texts that report them, and they carry "via". Shift and night work are in No. 45, burnout in No. 29.
import { x, pc } from "../common.js";

// "0.05" in English, "0,05" in Albanian and German.
const dec = (n) => x(n, n.replace(".", ","), n.replace(".", ","));
const bac = (n) => x(`${n}%`, `${n.replace(".", ",")}%`, `${n.replace(".", ",")} %`);

export default {
  number: 89,
  block: "people",
  date: x("November 2026", "Nëntor 2026", "November 2026"),
  theme: [x("Hours awake:", "Orët pa gjumë:", "Stunden wach:"), x("the tired shift", "turni i lodhur", "die müde Schicht")],
  sub: x(
    "What 17 and 24 hours awake did to performance in the laboratory, how errors rose with the number of 24-hour shifts, what changed when the long shifts went, why sleep in the last 24 hours matters, and a card for the roster.",
    "Çfarë i bënë performancës 17 dhe 24 orë pa gjumë në laborator, si u rritën gabimet me numrin e turneve 24-orëshe, çfarë ndryshoi kur u hoqën turnet e gjata, pse ka rëndësi gjumi i 24 orëve të fundit, dhe një kartë për turnet.",
    "Was 17 und 24 Stunden ohne Schlaf im Labor mit der Leistung machten, wie Fehler mit der Zahl der 24-Stunden-Dienste stiegen, was sich ohne lange Dienste änderte, warum der Schlaf der letzten 24 Stunden zählt, und eine Karte für den Dienstplan."),
  seo: x(
    "Fatigue at work: hours awake compared with alcohol, interns' extended shifts and errors, a trial that removed them, sleep and crash risk, and a card.",
    "Lodhja në punë: orët pa gjumë krahasuar me alkoolin, turnet e gjata dhe gabimet, një provë që i hoqi, gjumi dhe rreziku i aksidentit, dhe një kartë.",
    "Müdigkeit bei der Arbeit: Wachstunden im Vergleich mit Alkohol, lange Dienste und Fehler, ein Versuch ohne sie, Schlaf und Unfallrisiko, und eine Karte."),
  feature: x(
    "In the laboratory, people kept awake for 17 to 19 hours performed on some tests as they did with a blood alcohol level of 0.05%. Issue 89 follows the hours awake from the laboratory to the hospital ward and the road: fatigue-related errors in months with many 24-hour shifts, a trial that removed those shifts, and a study of crashes by sleep in the last 24 hours. It ends with three things a roster can count and a card to check a shift before it starts.",
    "Në laborator, njerëzit që qëndruan zgjuar 17 deri në 19 orë bënë në disa prova aq sa me një nivel alkooli në gjak prej 0,05%. Numri 89 i ndjek orët pa gjumë nga laboratori te reparti i spitalit dhe te rruga: gabimet nga lodhja në muajt me shumë turne 24-orëshe, një provë që i hoqi këto turne, dhe një studim i aksidenteve sipas gjumit në 24 orët e fundit. Mbyllet me tri gjëra që turnet mund t'i numërojnë dhe me një kartë për ta kontrolluar një turn para se të nisë.",
    "Im Labor schnitten Menschen nach 17 bis 19 Stunden ohne Schlaf in einigen Tests so ab wie mit 0,05 % Blutalkohol. Ausgabe 89 folgt den Wachstunden vom Labor auf die Klinikstation und die Straße: Fehler aus Müdigkeit in Monaten mit vielen 24-Stunden-Diensten, ein Versuch ohne diese Dienste und eine Studie zu Unfällen nach dem Schlaf der letzten 24 Stunden. Am Ende stehen drei Dinge, die ein Dienstplan zählen kann, und eine Karte, um eine Schicht vor Beginn zu prüfen."),
  figure: { n: x("4.3×", "4,3×", "4,3×"), by: "Tefft, 2016", t: x(
    "the crash rate of drivers who had slept 4 to 5 hours in the past 24, against those who had slept 7 or more.",
    "shkalla e aksidenteve te shoferët që kishin fjetur 4 deri në 5 orë në 24 orët e fundit, kundrejt atyre që kishin fjetur 7 ose më shumë.",
    "die Unfallrate von Fahrern mit 4 bis 5 Stunden Schlaf in den letzten 24 Stunden, gegenüber 7 Stunden oder mehr.") },
  teasers: [
    { page: "story", kicker: x("Cover story", "Tema kryesore", "Titelthema"),
      title: x("Seventeen hours awake", "Shtatëmbëdhjetë orë zgjuar", "Siebzehn Stunden wach") },
    { page: "research", kicker: x("What the research says", "Çfarë thotë kërkimi", "Was die Forschung sagt"),
      title: x("When the long shifts went", "Kur u hoqën turnet e gjata", "Als die langen Dienste wegfielen") },
    { page: "tool", kicker: x("Tool of the issue", "Mjeti i numrit", "Werkzeug der Ausgabe"),
      title: x("The fit-for-shift card", "Karta e gatishmërisë për turn", "Die Karte vor der Schicht") },
  ],
  sources: ["fatigue-dawson-reid-1997", "fatigue-williamson-2000", "fatigue-barger-2006", "fatigue-landrigan-2004", "fatigue-lockley-2004", "fatigue-tefft-2016"],
  pages: [
    { id: "cover", type: "cover" },
    {
      id: "intro", type: "intro",
      why: x(
        "A roster counts hours on duty. It rarely counts how long a person has been awake when the hardest task of the shift arrives. This issue asks what the research says about that second number, and how a manager can see it before the shift starts.",
        "Turnet numërojnë orët në punë. Rrallë numërojnë sa kohë ka që është zgjuar njeriu kur vjen detyra më e vështirë e turnit. Ky numër pyet çfarë thotë kërkimi për këtë shifër të dytë, dhe si mund ta shohë menaxheri para se të nisë turni.",
        "Ein Dienstplan zählt Stunden im Dienst. Selten zählt er, wie lange jemand schon wach ist, wenn die schwierigste Aufgabe der Schicht kommt. Diese Ausgabe fragt, was die Forschung über diese zweite Zahl sagt und wie eine Führungskraft sie vor Schichtbeginn sieht."),
      body: x(
        "Two laboratory studies matched hours awake against measured doses of alcohol: around 17 hours awake looked like 0.05%, around 24 hours like 0.10%. In 2,737 US interns, fatigue-related errors were reported in 3.8% of months without 24-hour shifts and in 16% of months with five or more. A trial found 36% more serious errors on the schedule with those shifts. On the road, drivers with 4 to 5 hours' sleep had 4.3 times the crash rate. Three counts and a card close the issue.",
        "Dy studime laboratorike i krahasuan orët pa gjumë me doza alkooli të matura: rreth 17 orë zgjuar u ngjanë 0,05%, rreth 24 orë 0,10%. Te 2.737 mjekë të vitit të parë në SHBA, gabimet nga lodhja u raportuan në 3,8% të muajve pa turne 24-orëshe dhe në 16% të muajve me pesë ose më shumë. Një provë gjeti 36% më shumë gabime serioze në planin me këto turne. Në rrugë, shoferët me 4 deri në 5 orë gjumë kishin 4,3 herë më shumë aksidente. Tri numërime dhe një kartë e mbyllin numrin.",
        "Zwei Laborstudien stellten Wachstunden gemessenen Alkoholdosen gegenüber: Rund 17 Stunden wach glichen 0,05 %, rund 24 Stunden 0,10 %. Bei 2.737 US-Assistenzärzten im ersten Jahr wurden Müdigkeitsfehler in 3,8 % der Monate ohne 24-Stunden-Dienste gemeldet und in 16 % der Monate mit fünf oder mehr. Ein Versuch fand im Plan mit diesen Diensten 36 % mehr schwere Fehler. Auf der Straße hatten Fahrer mit 4 bis 5 Stunden Schlaf die 4,3-fache Unfallrate. Drei Zählungen und eine Karte schließen die Ausgabe."),
    },
    {
      id: "story",
      kicker: x("Cover story", "Tema kryesore", "Titelthema"),
      title: [x("Seventeen", "Shtatëmbëdhjetë", "Siebzehn"), x("hours awake", "orë zgjuar", "Stunden wach")],
      lead: x(
        "In 1997 Drew Dawson and Kathryn Reid in Adelaide set out to put a familiar measure on fatigue. They compared performance on a hand-eye coordination test after a long time awake with performance on the same test after drinking alcohol.",
        "Më 1997, Drew Dawson dhe Kathryn Reid në Adelaide deshën ta matnin lodhjen me një masë të njohur. Krahasuan rezultatin në një provë koordinimi dorë-sy pas shumë orësh pa gjumë me rezultatin në të njëjtën provë pas pijes.",
        "1997 wollten Drew Dawson und Kathryn Reid in Adelaide Müdigkeit mit einem bekannten Maß messen. Sie verglichen die Leistung in einem Test der Hand-Auge-Koordination nach langer Wachzeit mit der Leistung im selben Test nach Alkohol."),
      blocks: [
        { type: "columns", max: 10, height: 100, source: ["fatigue-dawson-reid-1997"],
          label: x("Hours awake and the blood alcohol level with similar performance (1997)", "Orët zgjuar dhe niveli i alkoolit në gjak me performancë të ngjashme (1997)", "Wachstunden und Blutalkohol mit ähnlicher Leistung (1997)"),
          items: [
            { k: x("17 hours awake", "17 orë zgjuar", "17 Stunden wach"), v: 5, n: bac("0.05") },
            { k: x("24 hours awake", "24 orë zgjuar", "24 Stunden wach"), v: 10, n: bac("0.10"), alert: true },
          ] },
        { type: "p", text: x(
          "Williamson and Feyer repeated the comparison in 2000 with 39 people, 30 from the transport industry and nine from the army, kept awake for 28 hours. After 17 to 19 hours, between 22:30 and 01:00, some tests were as bad as at 0.05% or worse; responses were up to 50% slower.",
          "Williamson dhe Feyer e përsëritën krahasimin më 2000 me 39 veta, 30 nga transporti dhe nëntë nga ushtria, të mbajtur zgjuar për 28 orë. Pas 17 deri në 19 orësh, mes orës 22:30 dhe 01:00, disa prova ishin aq keq sa me 0,05% ose më keq; reagimet ishin deri në 50% më të ngadalta.",
          "Williamson und Feyer wiederholten den Vergleich 2000 mit 39 Personen, 30 aus dem Transportgewerbe und neun aus der Armee, 28 Stunden lang wach gehalten. Nach 17 bis 19 Stunden, zwischen 22:30 und 1:00 Uhr, waren einige Tests so schlecht wie bei 0,05 % oder schlechter; Reaktionen waren bis zu 50 % langsamer.") },
        { type: "callout", reading: true, text: x(
          "Someone who woke at 6:00 reaches hour 17 at 23:00. On a double shift, that is the middle of the work, not the end.",
          "Kush zgjohet në 6:00, e arrin orën e 17-të në 23:00. Në një turn të dyfishtë, kjo është mesi i punës, jo fundi.",
          "Wer um 6 Uhr aufsteht, erreicht Stunde 17 um 23 Uhr. In einer Doppelschicht ist das die Mitte der Arbeit, nicht ihr Ende.") },
      ],
      note: x(
        "Neither paper could be opened in full. Dawson & Reid's figures as Tefft (2016) and Barger et al. (2006) report them; Williamson & Feyer's from their abstract. The bars show the alcohol level matched, not a risk.",
        "Asnjë nga dy artikujt nuk u hap i plotë. Shifrat e Dawson-it dhe Reid-it siç i japin Tefft (2016) dhe Barger et al. (2006); ato të Williamson-it dhe Feyer-it nga abstrakti i tyre. Shtyllat tregojnë nivelin e alkoolit që u përputh, jo një rrezik.",
        "Keiner der zwei Artikel war im Volltext zugänglich. Dawson & Reid nach Tefft (2016) und Barger et al. (2006), Williamson & Feyer nach ihrem Abstract. Die Säulen zeigen den entsprechenden Alkoholwert, kein Risiko."),
      source: ["fatigue-dawson-reid-1997", "fatigue-williamson-2000"],
    },
    {
      id: "numbers",
      kicker: x("The numbers", "Shifrat", "Die Zahlen"),
      title: [x("Month by", "Muaj pas", "Monat für"), x("month", "muaji", "Monat")],
      lead: x(
        "Laura Barger and colleagues at Harvard followed 2,737 first-year doctors across the US in 2002–2003. Each month the interns reported their hours, their shifts of 24 hours or more, and any significant medical error. Each intern was compared with himself or herself.",
        "Laura Barger dhe kolegët në Harvard ndoqën 2.737 mjekë të vitit të parë në gjithë SHBA-në më 2002–2003. Çdo muaj, mjekët raportonin orët, turnet prej 24 orësh e më shumë dhe çdo gabim mjekësor të rëndësishëm. Çdo mjek u krahasua me veten.",
        "Laura Barger und Kollegen in Harvard begleiteten 2002–2003 in den ganzen USA 2.737 Ärztinnen und Ärzte im ersten Berufsjahr. Jeden Monat meldeten sie ihre Stunden, ihre Dienste von 24 Stunden und mehr und jeden bedeutsamen Behandlungsfehler. Jede Person wurde mit sich selbst verglichen."),
      blocks: [
        { type: "columns", max: 16, height: 110, source: ["fatigue-barger-2006"],
          label: x("Months with at least one fatigue-related significant error (2006)", "Muajt me të paktën një gabim të rëndësishëm nga lodhja (2006)", "Monate mit mindestens einem bedeutsamen Müdigkeitsfehler (2006)"),
          items: [
            { k: x("No 24-hour shifts", "Pa turne 24-orëshe", "Keine 24-Stunden-Dienste"), v: 3.8, n: x("3.8%", "3,8%", "3,8 %") },
            { k: x("1 to 4 such shifts", "1 deri në 4 të tilla", "1 bis 4 solche Dienste"), v: 9.8, n: x("9.8%", "9,8%", "9,8 %") },
            { k: x("5 or more", "5 ose më shumë", "5 oder mehr"), v: 16, n: pc(16), alert: true },
          ] },
        { type: "figures", compact: true, items: [
          { n: x("0.2% → 1.6%", "0,2% → 1,6%", "0,2 % → 1,6 %"), t: x("of months with a fatigue-related error that harmed a patient, from no to 5+ long shifts", "e muajve me një gabim nga lodhja që dëmtoi pacientin, nga asnjë te 5+ turne të gjata", "der Monate mit einem Müdigkeitsfehler, der einem Patienten schadete, von keinem zu 5+ langen Diensten") },
          { n: pc(70), t: x("of months with 5+ long shifts had a report of falling asleep in lectures; 46% with none", "e muajve me 5+ turne të gjata kishin raport për gjumë gjatë leksioneve; 46% pa asnjë", "der Monate mit 5+ langen Diensten mit Einschlafen in Vorlesungen; 46 % ohne") },
        ] },
        { type: "callout", reading: true, text: x(
          "The errors the interns blamed on fatigue rose with the long shifts. The errors they blamed on other causes rose far less.",
          "Gabimet që mjekët ia vunë lodhjes u rritën me turnet e gjata. Gabimet që ia vunë shkaqeve të tjera u rritën shumë më pak.",
          "Die Fehler, die die Ärzte der Müdigkeit zuschrieben, stiegen mit den langen Diensten. Fehler aus anderen Gründen stiegen viel weniger.") },
      ],
      note: x(
        "Self-reports, 17,003 monthly surveys; the question named fatigue, which may inflate the link. Bars are shares of intern-months. Read in the full text.",
        "Vetëraportime, 17.003 anketa mujore; pyetja e përmendte lodhjen, gjë që mund ta fryjë lidhjen. Shtyllat janë pjesë të muajve të mjekëve. Lexuar te teksti i plotë.",
        "Selbstauskünfte, 17.003 Monatsbögen; die Frage nannte die Müdigkeit, was den Zusammenhang überzeichnen kann. Die Säulen sind Anteile der Arztmonate. Im Volltext gelesen."),
      source: ["fatigue-barger-2006"],
    },
    {
      id: "model",
      kicker: x("The model", "Modeli", "Das Modell"),
      title: [x("Three clocks", "Tri ora", "Drei Uhren"), x("in one shift", "në një turn", "in einer Schicht")],
      lead: x(
        "The studies in this issue measure fatigue in three ways. Each is a clock a roster can read, and none of them is the number of hours on the timesheet.",
        "Studimet e këtij numri e masin lodhjen në tri mënyra. Secila është një orë që turnet mund ta lexojnë, dhe asnjëra nuk është numri i orëve në fletën e punës.",
        "Die Studien dieser Ausgabe messen Müdigkeit auf drei Arten. Jede ist eine Uhr, die ein Dienstplan ablesen kann, und keine ist die Zahl der Stunden auf dem Stundenzettel."),
      blocks: [
        { type: "cards", cols: 3, items: [
          { h: x("Hours awake", "Orët zgjuar", "Wachstunden"), p: x("from waking, not from clocking in; 17 to 19 hours matched 0.05% on some tests", "nga zgjimi, jo nga hyrja në punë; 17 deri në 19 orë u ngjanë 0,05% në disa prova", "ab dem Aufwachen, nicht ab Dienstbeginn; 17 bis 19 Stunden glichen in einigen Tests 0,05 %") },
          { h: x("Sleep in the last 24", "Gjumi në 24 orët e fundit", "Schlaf der letzten 24"), p: x("below 7 hours, the crash rate rose step by step; 4 to 5 hours, 4.3 times", "nën 7 orë, shkalla e aksidenteve u rrit shkallë-shkallë; 4 deri në 5 orë, 4,3 herë", "unter 7 Stunden stieg die Unfallrate Stufe um Stufe; 4 bis 5 Stunden: 4,3-fach") },
          { h: x("Long shifts in a month", "Turnet e gjata në muaj", "Lange Dienste im Monat"), p: x("1 to 4 and 5+ shifts of 24 hours: odds of a fatigue-related error 3.5 and 7.5 times", "1 deri në 4 dhe 5+ turne 24-orëshe: gjasat e një gabimi nga lodhja 3,5 dhe 7,5 herë", "1 bis 4 und 5+ Dienste von 24 Stunden: Chance eines Müdigkeitsfehlers 3,5- und 7,5-fach") },
        ] },
        { type: "p", text: x(
          "The clocks add up. A long shift raises the hours awake and cuts the sleep before the next one. The clock of the day matters too: in Williamson & Feyer, hours 17 to 19 fell between 22:30 and 01:00, and Tefft notes that the effects of lost sleep are greatest in the early morning, the hours his data left out.",
          "Orët mblidhen. Një turn i gjatë i shton orët zgjuar dhe e shkurton gjumin para turnit tjetër. Ka rëndësi edhe ora e ditës: te Williamson dhe Feyer, orët 17 deri në 19 ranë mes 22:30 dhe 01:00, dhe Tefft shënon se efektet e gjumit të humbur janë më të mëdha në orët e para të mëngjesit, orët që mungonin te të dhënat e tij.",
          "Die Uhren addieren sich. Ein langer Dienst erhöht die Wachstunden und kürzt den Schlaf vor dem nächsten. Auch die Tageszeit zählt: Bei Williamson & Feyer fielen die Stunden 17 bis 19 zwischen 22:30 und 1:00 Uhr, und Tefft vermerkt, dass verlorener Schlaf am frühen Morgen am stärksten wirkt, in den Stunden, die seinen Daten fehlten.") },
        { type: "callout", reading: true, text: x(
          "A roster that is legal on hours can still put a person at hour 20 for the hardest task of the night.",
          "Një plan turnesh që është i ligjshëm për orët, mund ta vërë prapë dikë në orën e 20-të zgjuar për detyrën më të vështirë të natës.",
          "Ein Dienstplan, der bei den Stunden rechtmäßig ist, kann trotzdem jemanden in Wachstunde 20 an die schwierigste Aufgabe der Nacht setzen.") },
      ],
      note: x(
        "The three clocks are the editors' grouping of the measures used by Williamson & Feyer (2000), Tefft (2016) and Barger et al. (2006). Roster rules, rest and rotation are in No. 45, burnout in No. 29.",
        "Tri orët janë grupimi i redaksisë për masat që përdorën Williamson & Feyer (2000), Tefft (2016) dhe Barger et al. (2006). Rregullat e turneve, pushimi dhe rotacioni janë te Nr. 45, burnout-i te Nr. 29.",
        "Die drei Uhren sind die Gruppierung der Redaktion für die Maße bei Williamson & Feyer (2000), Tefft (2016) und Barger et al. (2006). Dienstplanregeln, Ruhezeit und Rotation stehen in Nr. 45, Burnout in Nr. 29."),
      source: ["fatigue-williamson-2000", "fatigue-tefft-2016", "fatigue-barger-2006"],
    },
    {
      id: "research",
      kicker: x("What the research says", "Çfarë thotë kërkimi", "Was die Forschung sagt"),
      title: [x("When the long", "Kur u hoqën", "Als die langen"), x("shifts went", "turnet e gjata", "Dienste wegfielen")],
      lead: x(
        "In intensive care units, interns worked three-week rotations on two schedules: the traditional one, with shifts of 24 hours or more every other shift, and one that capped shifts at 16 hours. Physicians who did not know the schedule rated every incident.",
        "Në reparte të terapisë intensive, mjekët e vitit të parë punuan me rotacione tri-javore në dy plane: në atë tradicional, me turne prej 24 orësh e më shumë çdo dy turne, dhe në një plan që i kufizoi turnet në 16 orë. Çdo incident e vlerësuan mjekë që nuk e dinin planin.",
        "Auf Intensivstationen arbeiteten Assistenzärzte im ersten Jahr in dreiwöchigen Rotationen nach zwei Plänen: dem traditionellen mit Diensten von 24 Stunden und mehr in jedem zweiten Dienst und einem, der Dienste auf 16 Stunden begrenzte. Ärzte, die den Plan nicht kannten, bewerteten jeden Vorfall."),
      blocks: [
        { type: "pairs", from: x("16-hour cap", "Kufiri 16 orë", "16-Stunden-Grenze"), to: x("24-hour shifts", "Turne 24-orëshe", "24-Stunden-Dienste"), max: 140, source: ["fatigue-landrigan-2004"],
          label: x("Serious errors by interns per 1,000 patient-days (2004)", "Gabime serioze të mjekëve për 1.000 ditë-pacient (2004)", "Schwere Fehler je 1.000 Patiententage (2004)"),
          rows: [
            { k: x("All serious errors", "Të gjitha gabimet serioze", "Alle schweren Fehler"), a: 100.1, an: dec("100.1"), b: 136.0, bn: dec("136.0"), alert: true },
            { k: x("Serious medication errors", "Gabime serioze me barnat", "Schwere Medikationsfehler"), a: 82.5, an: dec("82.5"), b: 99.7, bn: dec("99.7") },
            { k: x("Serious diagnostic errors", "Gabime serioze diagnostikimi", "Schwere Diagnosefehler"), a: 3.3, an: dec("3.3"), b: 18.6, bn: dec("18.6") },
          ] },
        { type: "p", text: x(
          "On the long-shift schedule, interns made 35.9% more serious errors and 5.6 times as many serious diagnostic errors. A companion study of the same programme found that, with the cap, they worked 19.5 hours a week less, slept 5.8 hours a week more, and had less than half the attentional failures on night duty.",
          "Me turnet e gjata, mjekët bënë 35,9% më shumë gabime serioze dhe 5,6 herë më shumë gabime serioze diagnostikimi. Një studim shoqërues i të njëjtit program gjeti se, me kufirin, ata punuan 19,5 orë në javë më pak, fjetën 5,8 orë në javë më shumë dhe kishin më pak se gjysmën e rënieve të vëmendjes në kujdestarinë e natës.",
          "Mit den langen Diensten machten die Ärzte 35,9 % mehr schwere Fehler und 5,6-mal so viele schwere Diagnosefehler. Eine Begleitstudie desselben Programms fand, dass sie mit der Grenze 19,5 Stunden pro Woche weniger arbeiteten, 5,8 Stunden mehr schliefen und im Nachtdienst weniger als halb so viele Aufmerksamkeitsaussetzer hatten.") },
        { type: "callout", reading: true, text: x(
          "The same people, in the same units, made fewer errors when the schedule changed. The fix was in the roster, not in the people.",
          "Të njëjtët njerëz, në të njëjtat reparte, bënë më pak gabime kur ndryshoi plani. Zgjidhja ishte te turnet, jo te njerëzit.",
          "Dieselben Menschen auf denselben Stationen machten weniger Fehler, als sich der Plan änderte. Die Lösung lag im Dienstplan, nicht bei den Menschen.") },
      ],
      note: x(
        "Landrigan et al. and Lockley et al. (2004), from their abstracts; the NEJM full texts could not be opened. Barger et al. (2006) confirm the 36% and the doubled failures. 2,203 patient-days, 634 admissions; 20 interns.",
        "Landrigan et al. dhe Lockley et al. (2004), nga abstraktet; tekstet e plota të NEJM-it nuk u hapën. Barger et al. (2006) i konfirmojnë 36%-shin dhe rëniet e dyfishta. 2.203 ditë-pacient, 634 shtrime; 20 mjekë.",
        "Landrigan et al. und Lockley et al. (2004), nach ihren Abstracts; die NEJM-Volltexte waren nicht zugänglich. Barger et al. (2006) bestätigen die 36 % und die doppelten Aussetzer. 2.203 Patiententage, 634 Aufnahmen; 20 Ärzte."),
      source: ["fatigue-landrigan-2004", "fatigue-lockley-2004", "fatigue-barger-2006"],
    },
    {
      id: "measure",
      kicker: x("How it is measured", "Si matet", "Wie es gemessen wird"),
      title: [x("Count the sleep,", "Numëro gjumin,", "Den Schlaf zählen,"), x("not only the hours", "jo vetëm orët", "nicht nur die Stunden")],
      lead: x(
        "Brian Tefft of the AAA Foundation used US crash investigations of 2005–2007 that asked drivers how long they had slept in the past 24 hours. He compared 7,234 drivers in 4,571 crashes: those who caused the crash against those who did not.",
        "Brian Tefft i AAA Foundation përdori hetimet e aksidenteve në SHBA të viteve 2005–2007, që i pyetën shoferët sa kishin fjetur në 24 orët e fundit. Krahasoi 7.234 shoferë në 4.571 aksidente: ata që e shkaktuan aksidentin me ata që nuk e shkaktuan.",
        "Brian Tefft von der AAA Foundation nutzte US-Unfallerhebungen von 2005–2007, die Fahrer nach ihrem Schlaf in den letzten 24 Stunden fragten. Er verglich 7.234 Fahrer in 4.571 Unfällen: wer den Unfall verursachte, mit wem nicht."),
      blocks: [
        { type: "hbars", max: 12, source: ["fatigue-tefft-2016"],
          label: x("Crash rate against 7+ hours of sleep in the past 24 hours (2016)", "Shkalla e aksidenteve kundrejt 7+ orë gjumë në 24 orët e fundit (2016)", "Unfallrate gegenüber 7+ Stunden Schlaf in den letzten 24 Stunden (2016)"),
          items: [
            { k: x("6 to 7 hours", "6 deri në 7 orë", "6 bis 7 Stunden"), v: 1.3, n: x("1.3×", "1,3×", "1,3×") },
            { k: x("5 to 6 hours", "5 deri në 6 orë", "5 bis 6 Stunden"), v: 1.9, n: x("1.9×", "1,9×", "1,9×") },
            { k: x("4 to 5 hours", "4 deri në 5 orë", "4 bis 5 Stunden"), v: 4.3, n: x("4.3×", "4,3×", "4,3×") },
            { k: x("Under 4 hours", "Nën 4 orë", "Unter 4 Stunden"), v: 11.5, n: x("11.5×", "11,5×", "11,5×"), alert: true },
          ] },
        { type: "rows", compact: true, items: [
          { h: x("Hours awake at the end", "Orët zgjuar në fund", "Wachstunden am Ende"), p: x("from the usual waking time to the end of the shift, overtime included", "nga ora e zakonshme e zgjimit deri në fund të turnit, me orët shtesë", "von der üblichen Aufstehzeit bis Schichtende, mit Überstunden") },
          { h: x("Rest before the shift", "Pushimi para turnit", "Ruhe vor der Schicht"), p: x("the time between shifts, which caps the sleep that fits", "koha mes dy turneve, që e kufizon gjumin që mund të bëhet", "die Zeit zwischen zwei Schichten, die den möglichen Schlaf begrenzt") },
          { h: x("Long shifts this month", "Turnet e gjata këtë muaj", "Lange Dienste im Monat"), p: x("doubles and 24-hour stretches, per person", "turnet e dyfishta dhe vargjet 24-orëshe, për çdo person", "Doppelschichten und 24-Stunden-Strecken, je Person") },
        ] },
      ],
      note: x(
        "Against drivers with 7+ hours, adjusted for age, hour, location and changed sleep. Under 4 hours: 80 drivers, 95% CI 2.9–45.7. No crashes from midnight to 6:00. The three counts are the editors' proposal.",
        "Shkallët kundrejt shoferëve me 7+ orë, të rregulluara për moshën, orën, vendin dhe gjumin e ndryshuar. Nën 4 orë: 80 shoferë, intervali i besimit 2,9–45,7. Pa aksidente nga mesnata te 6:00. Tri numërimet janë propozim i redaksisë.",
        "Gegenüber Fahrern mit 7+ Stunden, bereinigt um Alter, Uhrzeit, Ort und veränderten Schlaf. Unter 4 Stunden: 80 Fahrer, 95-%-KI 2,9–45,7. Keine Unfälle zwischen Mitternacht und 6 Uhr. Die drei Zählungen schlägt die Redaktion vor."),
      source: ["fatigue-tefft-2016"],
    },
    {
      id: "tool", tool: "/tools/shift-capacity/",
      kicker: x("Tool of the issue", "Mjeti i numrit", "Werkzeug der Ausgabe"),
      title: [x("The fit-for-shift", "Karta e gatishmërisë", "Die Karte"), x("card", "për turn", "vor der Schicht")],
      lead: x(
        "One card per shift, filled in by the shift lead before the work starts. Long shifts often begin as a gap in the plan: the capacity tool shows the gap, the overtime and the cover before the day arrives.",
        "Një kartë për çdo turn, e plotësuar nga drejtuesi i turnit para se të nisë puna. Turnet e gjata shpesh nisin si një boshllëk në plan: mjeti i kapacitetit e tregon boshllëkun, orët shtesë dhe zëvendësimin para se të vijë dita.",
        "Eine Karte pro Schicht, ausgefüllt von der Schichtleitung vor Arbeitsbeginn. Lange Dienste beginnen oft als Lücke im Plan: Das Kapazitätswerkzeug zeigt die Lücke, die Überstunden und die Vertretung, bevor der Tag kommt."),
      blocks: [
        { type: "form", items: [
          { h: x("Shift and team", "Turni dhe ekipi", "Schicht und Team"), hint: x("date, hours, who is on, who is covering a gap", "data, orët, kush është në turn, kush mbulon një boshllëk", "Datum, Zeiten, wer da ist, wer eine Lücke deckt") },
          { h: x("Longest day", "Dita më e gjatë", "Längster Tag"), hint: x("who will have been awake longest at the end, and how long", "kush do të ketë qenë zgjuar më gjatë në fund, dhe sa", "wer am Ende am längsten wach ist, und wie lange") },
          { h: x("Short rest", "Pushim i shkurtër", "Kurze Ruhe"), hint: x("who comes from a double, a late finish or a night", "kush vjen nga një turn i dyfishtë, një mbarim vonë ose një natë", "wer aus einer Doppelschicht, einem späten Ende oder einer Nacht kommt") },
          { h: x("The hardest task", "Detyra më e vështirë", "Die schwierigste Aufgabe"), hint: x("when it falls, and whether it can move earlier or to someone rested", "kur bie, dhe a mund të zhvendoset më herët ose te dikush i pushuar", "wann sie anfällt, und ob sie früher oder an jemand Ausgeruhten gehen kann") },
          { h: x("Second check", "Kontrolli i dytë", "Zweite Prüfung"), hint: x("which steps get a second pair of eyes after midnight", "cilët hapa marrin një palë sy të dytë pas mesnate", "welche Schritte nach Mitternacht ein zweites Paar Augen bekommen") },
          { h: x("Decision", "Vendimi", "Entscheidung"), hint: x("what changes today; what goes into the next roster", "çfarë ndryshon sot; çfarë shkon te plani i radhës i turneve", "was sich heute ändert; was in den nächsten Dienstplan geht"), lines: 2 },
        ] },
      ],
      note: x(
        "The card is the editors' proposal, built on the three clocks of this issue; it is a planning aid, not a medical or legal test of fitness for work.",
        "Karta është propozim i redaksisë, i ndërtuar mbi tri orët e këtij numri; është ndihmë për planifikim, jo provë mjekësore ose ligjore e aftësisë për punë.",
        "Die Karte ist ein Vorschlag der Redaktion, gestützt auf die drei Uhren dieser Ausgabe; eine Planungshilfe, keine medizinische oder rechtliche Prüfung der Arbeitsfähigkeit."),
      source: ["fatigue-williamson-2000", "fatigue-barger-2006", "fatigue-tefft-2016"],
    },
    { id: "sources", type: "sources" },
    { id: "back", type: "back" },
  ],
};
