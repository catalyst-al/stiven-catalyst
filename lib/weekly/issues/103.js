// Management Review, No. 103: The learning curve, why cost and time fall with each repetition and where the
// learning is kept. Block: Strategy. Facts and their sources: docs/revista/management-review-nr-103.md. Wright (1936,
// an open scan of the journal pages), Nagy et al. (2013, PLOS ONE), Levitt, List & Syverson (2012, NBER working paper)
// and Benkard (1999, NBER working paper) were read in full. Argote & Epple (1990, Science) did not open and is not
// listed. Standard work is No. 35, Job Instruction No. 42, pilots No. 69 and the training illusion treatise volume 8;
// the notes point there and nothing of theirs is repeated.
import { x, pc } from "../common.js";

export default {
  number: 103,
  block: "strategy",
  date: x("November 2026", "Nëntor 2026", "November 2026"),
  theme: [x("The learning curve:", "Kurba e të mësuarit:", "Die Lernkurve:"), x("every repetition counts", "çdo përsëritje numëron", "jede Wiederholung zählt")],
  sub: x(
    "Wright's 80 percent, a car plant whose defects fell from about 70 to 20 a car in eight weeks, why the curve follows doublings and not the calendar, the second shift that did not start from zero, what an organisation forgets, and a card.",
    "80 përqindëshi i Wright-it, një fabrikë makinash ku defektet ranë nga rreth 70 në 20 për makinë në tetë javë, pse kurba ndjek dyfishimet e jo kalendarin, turni i dytë që nuk nisi nga zero, çfarë harron një organizatë, dhe një kartë.",
    "Wrights 80 Prozent, ein Autowerk, dessen Fehler in acht Wochen von etwa 70 auf 20 je Auto fielen, warum die Kurve Verdopplungen folgt und nicht dem Kalender, die zweite Schicht, die nicht bei null begann, was eine Organisation vergisst, und eine Karte."),
  seo: x(
    "The learning curve: Wright's law of 1936, a car plant's ramp-up, 62 technologies, the second shift, organisational forgetting and a card for a new process.",
    "Kurba e të mësuarit: ligji i Wright-it (1936), nisja e një fabrike makinash, 62 teknologji, turni i dytë, harresa e organizatës dhe një kartë.",
    "Die Lernkurve: Wrights Gesetz (1936), der Anlauf eines Autowerks, 62 Technologien, die zweite Schicht, organisationales Vergessen und eine Karte."),
  feature: x(
    "In 1936 an aircraft engineer wrote down a rule he had used since 1922: each time the quantity doubles, the average labour per aeroplane falls to about 80 percent. Issue 103 reads his paper, a test of six such laws on 62 technologies, a car plant whose defects fell by 70 percent in eight weeks and whose second shift began below the first, and an airliner whose labour hours rose again when experience was lost. It ends with a card for timing the first repetitions of a new process.",
    "Më 1936 një inxhinier avionësh shkroi një rregull që e përdorte që nga 1922: sa herë dyfishohet sasia, puna mesatare për avion bie në rreth 80 përqind. Numri 103 lexon artikullin e tij, një provë të gjashtë ligjeve të tilla mbi 62 teknologji, një fabrikë makinash ku defektet ranë me 70 përqind në tetë javë dhe ku turni i dytë nisi më poshtë se i pari, dhe një avion pasagjerësh ku orët e punës u rritën sërish kur humbi përvoja. Mbyllet me një kartë për të matur kohën e përsëritjeve të para të një procesi të ri.",
    "1936 schrieb ein Flugzeugingenieur eine Regel auf, die er seit 1922 nutzte: Jedes Mal, wenn sich die Menge verdoppelt, sinkt die durchschnittliche Arbeit je Flugzeug auf etwa 80 Prozent. Ausgabe 103 liest seinen Aufsatz, einen Test von sechs solchen Gesetzen an 62 Technologien, ein Autowerk, dessen Fehler in acht Wochen um 70 Prozent fielen und dessen zweite Schicht unter der ersten begann, und ein Verkehrsflugzeug, dessen Arbeitsstunden wieder stiegen, als Erfahrung verloren ging. Am Ende steht eine Karte, um die ersten Wiederholungen eines neuen Prozesses zu messen."),
  figure: { n: pc(80), by: "Wright, 1936", t: x(
    "of the average labour cost per aeroplane remained each time the quantity doubled, on Wright's curve.",
    "e kostos mesatare të punës për avion mbetej sa herë dyfishohej sasia, në kurbën e Wright-it.",
    "der durchschnittlichen Arbeitskosten je Flugzeug blieben auf Wrights Kurve bei jeder Verdopplung der Menge.") },
  teasers: [
    { page: "story", kicker: x("Cover story", "Tema kryesore", "Titelthema"),
      title: x("Wright's 80 percent", "80 përqindëshi i Wright-it", "Wrights 80 Prozent") },
    { page: "research", kicker: x("What the research says", "Çfarë thotë kërkimi", "Was die Forschung sagt"),
      title: x("The second shift", "Turni i dytë", "Die zweite Schicht") },
    { page: "tool", kicker: x("Tool of the issue", "Mjeti i numrit", "Werkzeug der Ausgabe"),
      title: x("The learning curve card", "Karta e kurbës së të mësuarit", "Die Lernkurven-Karte") },
  ],
  sources: ["curve-wright-1936", "curve-nagy-2013", "curve-levitt-2012", "curve-benkard-1999"],
  pages: [
    { id: "cover", type: "cover" },
    {
      id: "intro", type: "intro",
      why: x(
        "A new process, a new site, a new person: the first weeks are slow, and every plan has to guess how fast they will speed up. The guess decides staffing, targets and the patience a manager shows. This issue asks what is known about that speed, and where the learning is kept once it is made.",
        "Një proces i ri, një vend i ri, një person i ri: javët e para janë të ngadalta, dhe çdo plan duhet të hamendësojë sa shpejt do të përshpejtohen. Hamendja vendos stafin, objektivat dhe durimin e menaxherit. Ky numër pyet çfarë dihet për këtë shpejtësi, dhe ku ruhet të mësuarit pasi bëhet.",
        "Ein neuer Prozess, ein neuer Standort, ein neuer Mensch: Die ersten Wochen sind langsam, und jeder Plan muss schätzen, wie schnell es schneller wird. Die Schätzung bestimmt Besetzung, Ziele und die Geduld einer Führungskraft. Diese Ausgabe fragt, was über dieses Tempo bekannt ist und wo das Gelernte bleibt."),
      body: x(
        "Wright's rule of 1936 ties the fall in labour to doublings of the quantity made. A test on 62 technologies found it forecast best of six such laws. In a car plant, defects fell by about 70 percent in eight weeks, and the second shift began below the first. An airliner shows the other side: experience fades. A card closes the issue.",
        "Rregulli i Wright-it i 1936-s e lidh rënien e punës me dyfishimet e sasisë së prodhuar. Një provë mbi 62 teknologji gjeti se ai parashikonte më mirë nga gjashtë ligje të tilla. Në një fabrikë makinash, defektet ranë me rreth 70 përqind në tetë javë, dhe turni i dytë nisi më poshtë se i pari. Një avion pasagjerësh tregon anën tjetër: përvoja zbehet. Një kartë e mbyll numrin.",
        "Wrights Regel von 1936 knüpft den Rückgang der Arbeit an Verdopplungen der gefertigten Menge. Ein Test an 62 Technologien fand, dass sie von sechs solchen Gesetzen am besten vorhersagte. In einem Autowerk fielen die Fehler in acht Wochen um etwa 70 Prozent, und die zweite Schicht begann unter der ersten. Ein Verkehrsflugzeug zeigt die andere Seite: Erfahrung verblasst. Eine Karte schließt die Ausgabe."),
    },
    {
      id: "story",
      kicker: x("Cover story", "Tema kryesore", "Titelthema"),
      title: [x("Wright's", "80 përqindëshi", "Wrights"), x("80 percent", "i Wright-it", "80 Prozent")],
      lead: x(
        "T. P. Wright began to study how cost varies with quantity in 1922, from the two or three points his firm's production of one model allowed. The curve was corrected for years as new orders came in. In February 1936 he published it in the Journal of the Aeronautical Sciences.",
        "T. P. Wright nisi të studionte si ndryshon kostoja me sasinë më 1922, nga dy ose tri pikat që lejonte prodhimi i një modeli në firmën e tij. Kurba u korrigjua me vite, ndërsa vinin porosi të reja. Në shkurt 1936 e botoi në Journal of the Aeronautical Sciences.",
        "T. P. Wright begann 1922 zu untersuchen, wie sich Kosten mit der Menge ändern, aus zwei oder drei Punkten der Fertigung eines Modells. Die Kurve wurde jahrelang mit neuen Aufträgen korrigiert. Im Februar 1936 veröffentlichte er sie im Journal of the Aeronautical Sciences."),
      blocks: [
        { type: "hbars", max: 100, source: ["curve-wright-1936"],
          label: x("What remains of the cost at each doubling of the quantity, Wright's curves (1936)", "Çfarë mbetet nga kostoja në çdo dyfishim të sasisë, kurbat e Wright-it (1936)", "Was je Verdopplung der Menge von den Kosten bleibt (Wright, 1936)"),
          items: [
            { k: x("Labour", "Puna", "Arbeit"), v: 80, n: pc(80), alert: true },
            { k: x("Whole aeroplane, at first", "Avioni i tërë, në fillim", "Ganzes Flugzeug, anfangs"), v: 83, n: pc(83) },
            { k: x("Purchased material", "Materiali i blerë", "Zugekaufte Teile"), v: 88, n: pc(88) },
            { k: x("Raw material", "Lënda e parë", "Rohmaterial"), v: 95, n: pc(95) },
          ] },
        { type: "p", text: x(
          "On log-log paper the labour curve is a straight line. Its 80 percent is the factor by which the average labour cost for a quantity is multiplied to give the average for twice that quantity. Wright named where the fall comes from:",
          "Në letër logaritmike në të dy akset, kurba e punës është vijë e drejtë. 80 përqindëshi i saj është faktori me të cilin shumëzohet kostoja mesatare e punës për një sasi, për të dhënë mesataren për dyfishin e saj. Wright tregoi nga vjen rënia:",
          "Auf doppelt logarithmischem Papier ist die Arbeitskurve eine Gerade. Ihre 80 Prozent sind der Faktor, mit dem man die durchschnittlichen Arbeitskosten einer Menge malnimmt, um den Durchschnitt der doppelten Menge zu erhalten. Wright nannte, woher der Rückgang kommt:") },
        { type: "rows", compact: true, items: [
          { h: x("Practice", "Praktika", "Übung"), p: x("Workers grow more skilled with repetition, more so with time studies.", "Punëtorët bëhen më të aftë me përsëritjen, aq më tepër me studime kohe.", "Wiederholung macht geübter, Zeitstudien noch mehr.") },
          { h: x("Fewer changes", "Më pak ndryshime", "Weniger Änderungen"), p: x("Larger runs bring fewer changes to disturb the work.", "Seritë më të mëdha sjellin më pak ndryshime që e prishin punën.", "Größere Serien bringen weniger störende Änderungen.") },
          { h: x("Tools and set-ups", "Mjetet dhe përgatitjet", "Werkzeuge und Rüsten"), p: x("Set-up time is spread over more units, and more tooling pays.", "Koha e përgatitjes ndahet mbi më shumë njësi, dhe më shumë vegla ia vlejnë.", "Rüstzeit verteilt sich auf mehr Stück, Vorrichtungen lohnen sich.") },
        ] },
        { type: "callout", reading: true, text: x(
          "The rule counts units made, not weeks passed. A slow month teaches little; a busy one teaches more.",
          "Rregulli numëron njësitë e bëra, jo javët e kaluara. Një muaj i qetë mëson pak; një muaj i ngarkuar mëson më shumë.",
          "Die Regel zählt gefertigte Einheiten, nicht Wochen. Ein ruhiger Monat lehrt wenig, ein voller mehr.") },
      ],
      note: x(
        "Wright (1936), read in full. The bars are his factors per doubling; a lower bar means a steeper fall; the whole aeroplane's curve later flattens to 90%. Rows: his list for labour, shortened. Averages from one firm's estimating curves of the 1920s and 1930s, not measurements of today's work.",
        "Wright (1936), lexuar i plotë. Shiritat janë faktorët e tij për çdo dyfishim; shiriti më i shkurtër do të thotë rënie më e fortë; kurba e avionit të tërë më vonë rrafshohet deri në 90%. Rreshtat: lista e tij për punën, e shkurtuar. Mesatare nga kurbat e vlerësimit të një firme të viteve 1920 dhe 1930, jo matje të punës së sotme.",
        "Wright (1936), vollständig gelesen. Die Balken sind seine Faktoren je Verdopplung; ein kürzerer Balken heißt steilerer Rückgang; die Kurve des ganzen Flugzeugs flacht später auf 90 % ab. Zeilen: seine Liste für die Arbeit, gekürzt. Durchschnitte aus den Schätzkurven einer Firma der 1920er und 1930er Jahre, keine Messungen heutiger Arbeit."),
      source: ["curve-wright-1936"],
    },
    {
      id: "numbers",
      kicker: x("The numbers", "Shifrat", "Die Zahlen"),
      title: [x("Seventy defects,", "Shtatëdhjetë defekte,", "Siebzig Fehler,"), x("then twenty", "pastaj njëzet", "dann zwanzig")],
      lead: x(
        "Steven Levitt, John List and Chad Syverson followed nearly 200,000 cars through one assembly plant of a major carmaker over a model year. The model had just been redesigned and the line reorganised into teams, so the plant was, in effect, starting over.",
        "Steven Levitt, John List dhe Chad Syverson ndoqën gati 200.000 makina në një fabrikë montimi të një prodhuesi të madh, gjatë një viti modeli. Modeli sapo ishte riprojektuar dhe linja ishte riorganizuar në ekipe, ndaj fabrika në fakt po niste nga e para.",
        "Steven Levitt, John List und Chad Syverson verfolgten fast 200.000 Autos durch ein Montagewerk eines großen Herstellers über ein Modelljahr. Das Modell war gerade neu gestaltet und die Linie auf Teamarbeit umgestellt worden, das Werk fing also praktisch von vorn an."),
      blocks: [
        { type: "columns", max: 80, height: 110, source: ["curve-levitt-2012"],
          label: x("Average defects per car, one assembly plant, one model year (2012)", "Defekte mesatare për makinë, një fabrikë montimi, një vit modeli (2012)", "Durchschnittliche Fehler je Auto, ein Montagewerk, ein Modelljahr (2012)"),
          items: [
            { k: x("Start", "Nisja", "Start"), v: 70, n: x("about 70", "rreth 70", "etwa 70"), alert: true },
            { k: x("8 weeks on", "Pas 8 javësh", "Nach 8 Wochen"), v: 20, n: x("about 20", "rreth 20", "etwa 20") },
            { k: x("End of year", "Fundi i vitit", "Jahresende"), v: 10, n: x("about 10", "rreth 10", "etwa 10") },
          ] },
        { type: "figures", compact: true, items: [
          { n: "−0.3", t: x("learning rate: ten times the cars, about half the defects", "norma e të mësuarit: dhjetë herë më shumë makina, rreth gjysma e defekteve", "Lernrate: zehnmal so viele Autos, etwa halb so viele Fehler") },
          { n: x(">80%", ">80%", ">80 %"), t: x("of defects came from the fifth of stations with the most", "e defekteve erdhën nga një e pesta e stacioneve me më shumë defekte", "der Fehler stammten aus dem Fünftel der Stationen mit den meisten") },
        ] },
        { type: "callout", reading: true, text: x(
          "Most of the fall came early and from a few places. A ramp-up plan can say where to look first.",
          "Pjesa më e madhe e rënies erdhi herët dhe nga pak vende. Një plan nisjeje mund të thotë ku të shikosh së pari.",
          "Der größte Teil des Rückgangs kam früh und von wenigen Stellen. Ein Anlaufplan kann sagen, wo man zuerst hinschaut.") },
      ],
      note: x(
        "Levitt, List & Syverson (2012), NBER working paper, read in full; the plant and years are not named. Columns are rounded figures from their text; weeks with fewer than 100 cars are left out. The study counts defects, not cost, because line speed moved with demand.",
        "Levitt, List & Syverson (2012), punim pune i NBER, lexuar i plotë; fabrika dhe vitet nuk emërtohen. Kolonat janë shifrat e rrumbullakuara të tekstit të tyre; javët me më pak se 100 makina lihen jashtë. Studimi numëron defektet, jo koston, sepse shpejtësia e linjës ndryshonte me kërkesën.",
        "Levitt, List & Syverson (2012), NBER-Arbeitspapier, vollständig gelesen; Werk und Jahre werden nicht genannt. Die Säulen sind gerundete Zahlen aus ihrem Text; Wochen mit weniger als 100 Autos fehlen. Die Studie zählt Fehler, nicht Kosten, weil das Linientempo der Nachfrage folgte."),
      source: ["curve-levitt-2012"],
    },
    {
      id: "model",
      kicker: x("The model", "Modeli", "Das Modell"),
      title: [x("Doublings,", "Dyfishime,", "Verdopplungen,"), x("not the calendar", "jo kalendari", "nicht der Kalender")],
      lead: x(
        "Béla Nagy, Doyne Farmer, Quan Bui and Jessika Trancik tested six proposed laws of falling cost on 62 technologies, each followed for 10 to 39 years, by forecasting the past from earlier data. Wright's law, cost tied to cumulative production, gave the best forecasts; Moore's law, cost tied to time, was not far behind.",
        "Béla Nagy, Doyne Farmer, Quan Bui dhe Jessika Trancik provuan gjashtë ligje të propozuara të rënies së kostos mbi 62 teknologji, secila e ndjekur për 10 deri në 39 vjet, duke parashikuar të kaluarën nga të dhëna më të hershme. Ligji i Wright-it, kostoja e lidhur me prodhimin e grumbulluar, dha parashikimet më të mira; ligji i Moore-it, kostoja e lidhur me kohën, nuk ishte larg.",
        "Béla Nagy, Doyne Farmer, Quan Bui und Jessika Trancik testeten sechs vorgeschlagene Gesetze sinkender Kosten an 62 Technologien, jede über 10 bis 39 Jahre, indem sie die Vergangenheit aus früheren Daten vorhersagten. Wrights Gesetz, Kosten nach kumulierter Produktion, sagte am besten vorher; Moores Gesetz, Kosten nach Zeit, lag knapp dahinter."),
      blocks: [
        { type: "line", min: 0, max: 110, height: 110, source: ["curve-wright-1936"],
          label: x("An 80% curve: average labour per unit, first unit = 100, by units made (editors' arithmetic)", "Një kurbë 80%: puna mesatare për njësi, njësia e parë = 100, sipas njësive të bëra (llogari e redaksisë)", "Eine 80-%-Kurve: durchschnittliche Arbeit je Einheit, erste Einheit = 100, nach gefertigten Einheiten (Rechnung der Redaktion)"),
          points: [
            { k: "1", v: 100, n: "100" },
            { k: "2", v: 80, n: "80" },
            { k: "4", v: 64, n: "64" },
            { k: "8", v: 51, n: "51" },
            { k: "16", v: 41, n: "41" },
            { k: "32", v: 33, n: "33" },
          ] },
        { type: "p", text: x(
          "Each step needs as many units as all before it, so gains look fast at first and slow later, though the rate is the same. The authors found production tends to grow exponentially; then Wright's and Moore's laws become hard to tell apart.",
          "Çdo hap kërkon aq njësi sa të gjitha ato para tij, ndaj fitimet duken të shpejta në fillim dhe të ngadalta më pas, ndonëse norma është e njëjta. Autorët gjetën se prodhimi zakonisht rritet në mënyrë eksponenciale; atëherë ligjet e Wright-it dhe të Moore-it vështirë se dallohen.",
          "Jeder Schritt braucht so viele Einheiten wie alle davor, daher wirken die Gewinne zuerst schnell und später langsam, obwohl die Rate gleich bleibt. Die Autoren fanden, dass die Produktion meist exponentiell wächst; dann sind Wrights und Moores Gesetz kaum zu unterscheiden.") },
        { type: "callout", reading: true, text: x(
          "A team that has done a task 500 times needs 500 more for the next step. Expecting the early pace later is the mistake.",
          "Një ekip që e ka bërë një detyrë 500 herë, ka nevojë për 500 të tjera për hapin e radhës. Gabimi është të presësh ritmin e fillimit edhe më vonë.",
          "Ein Team, das eine Aufgabe 500-mal erledigt hat, braucht 500 weitere für den nächsten Schritt. Das frühe Tempo später zu erwarten, ist der Fehler.") },
      ],
      note: x(
        "The line is the editors' arithmetic from Wright's definition (exponent 0.322), not data. Nagy et al. (2013), PLOS ONE, read in full: unit cost after inflation; forecast errors grew with the horizon for every law. The first weeks of a new process are also the subject of pilots (No. 69).",
        "Vija është llogari e redaksisë nga përkufizimi i Wright-it (eksponenti 0,322), jo të dhëna. Nagy et al. (2013), PLOS ONE, lexuar i plotë: kostoja për njësi pas inflacionit; gabimet e parashikimit u rritën me horizontin për çdo ligj. Javët e para të një procesi të ri janë edhe tema e piloteve (Nr. 69).",
        "Die Linie ist die Rechnung der Redaktion nach Wrights Definition (Exponent 0,322), keine Daten. Nagy et al. (2013), PLOS ONE, vollständig gelesen: Stückkosten nach Inflation; die Prognosefehler wuchsen bei jedem Gesetz mit dem Horizont. Die ersten Wochen eines neuen Prozesses sind auch Thema der Piloten (Nr. 69)."),
      source: ["curve-wright-1936", "curve-nagy-2013"],
    },
    {
      id: "research", more: "when-improvement-fades",
      kicker: x("What the research says", "Çfarë thotë kërkimi", "Was die Forschung sagt"),
      title: [x("The second", "Turni", "Die zweite"), x("shift", "i dytë", "Schicht")],
      lead: x(
        "Seven weeks after the start, the plant added a second shift of new workers, trained by watching the stations for a week. It did not start at 70 defects a car. From the outset its rate was below the first shift's that same week, and over the year about 5 to 10 percent lower.",
        "Shtatë javë pas nisjes, fabrika shtoi një turn të dytë me punëtorë të rinj, të trajnuar duke parë stacionet për një javë. Ai nuk nisi me 70 defekte për makinë. Që në fillim, norma e tij ishte më poshtë se ajo e turnit të parë po atë javë, dhe gjatë vitit rreth 5 deri në 10 përqind më e ulët.",
        "Sieben Wochen nach dem Start nahm das Werk eine zweite Schicht mit neuen Beschäftigten auf, angelernt durch eine Woche Zusehen an den Stationen. Sie begann nicht bei 70 Fehlern je Auto. Von Anfang an lag ihre Rate unter der der ersten Schicht in derselben Woche, über das Jahr etwa 5 bis 10 Prozent niedriger."),
      blocks: [
        { type: "columns", max: 20, height: 100, source: ["curve-levitt-2012"],
          label: x("Defects per car in the last 12 weeks of the year, by model variant (2012)", "Defekte për makinë në 12 javët e fundit të vitit, sipas variantit (2012)", "Fehler je Auto in den letzten 12 Wochen des Jahres, nach Modellvariante (2012)"),
          items: [
            { k: x("Models 1 and 2", "Modelet 1 dhe 2", "Modelle 1 und 2"), v: 8, n: x("about 8", "rreth 8", "etwa 8") },
            { k: x("Model 3, started last", "Modeli 3, nisur i fundit", "Modell 3, zuletzt gestartet"), v: 16, n: x("about 16", "rreth 16", "etwa 16"), alert: true },
          ] },
        { type: "p", text: x(
          "A new variant did restart the learning, and while Model 3 ramped up, defects on its closest cousin rose by almost 30 percent. Absences of workers raised defects too, but only a little. The authors conclude that much of what was learned sat in the plant's physical and organisational capital rather than in particular workers.",
          "Një variant i ri e rinisi vërtet të mësuarit, dhe ndërsa nisej Modeli 3, defektet te kushëriri i tij më i afërt u rritën me gati 30 përqind. Mungesat e punëtorëve i shtuan defektet, por vetëm pak. Autorët përfundojnë se shumë nga ajo që u mësua ndodhej te kapitali fizik dhe organizativ i fabrikës, jo te punëtorë të caktuar.",
          "Eine neue Variante startete das Lernen tatsächlich neu, und während Modell 3 anlief, stiegen die Fehler beim nächsten Verwandten um fast 30 Prozent. Fehlzeiten erhöhten die Fehler auch, aber nur wenig. Die Autoren schließen, dass viel vom Gelernten im physischen und organisatorischen Kapital des Werks lag, nicht in bestimmten Beschäftigten.") },
        { type: "callout", reading: true, text: x(
          "A new person can start near the team's level if the learning is in the station. A new product starts the curve again.",
          "Një person i ri mund të nisë afër nivelit të ekipit, nëse të mësuarit është te stacioni. Një produkt i ri e nis kurbën nga e para.",
          "Ein neuer Mensch kann nahe am Niveau des Teams beginnen, wenn das Gelernte in der Station steckt. Ein neues Produkt startet die Kurve neu.") },
      ],
      note: x(
        "Levitt, List & Syverson (2012), one plant, one year. They cannot rule out that the first shift passed its knowledge on in the week of watching. The linked essay is the author's question whether results last once the manager leaves. How to teach a task is No. 42.",
        "Levitt, List & Syverson (2012), një fabrikë, një vit. Ata nuk e përjashtojnë dot që turni i parë ta ketë përcjellë dijen gjatë javës së vëzhgimit. Eseja e lidhur është pyetja e autorit nëse rezultatet zgjasin pasi largohet menaxheri. Si mësohet një detyrë është te Nr. 42.",
        "Levitt, List & Syverson (2012), ein Werk, ein Jahr. Sie können nicht ausschließen, dass die erste Schicht ihr Wissen in der Woche des Zusehens weitergab. Der verlinkte Essay ist die Frage des Autors, ob Ergebnisse bleiben, wenn die Führungskraft geht. Wie man eine Aufgabe lehrt, steht in Nr. 42."),
      source: ["curve-levitt-2012"],
    },
    {
      id: "measure",
      kicker: x("How it is measured", "Si matet", "Wie es gemessen wird"),
      title: [x("What an organisation", "Çfarë harron", "Was eine Organisation"), x("forgets", "një organizatë", "vergisst")],
      lead: x(
        "Lockheed built 250 L-1011 TriStars from 1970 to 1984, in four models, at 4 to 42 a year. Labour fell along a classic curve to unit 112, in the fifth year, at about one sixth of the first plane's hours. Then it rose. Lanier Benkard measured why.",
        "Lockheed ndërtoi 250 avionë L-1011 TriStar nga 1970 deri më 1984, në katër modele, me 4 deri në 42 në vit. Puna ra sipas një kurbe klasike deri te njësia 112, në vitin e pestë, me rreth një të gjashtën e orëve të avionit të parë. Pastaj u rrit. Lanier Benkard mati pse.",
        "Lockheed baute von 1970 bis 1984 250 L-1011 TriStar in vier Modellen, 4 bis 42 im Jahr. Die Arbeit fiel entlang einer klassischen Kurve bis zur Einheit 112 im fünften Jahr, auf etwa ein Sechstel der Stunden des ersten Flugzeugs. Dann stieg sie. Lanier Benkard maß, warum."),
      blocks: [
        { type: "figures", compact: true, items: [
          { n: pc(61), t: x("of the firm's stock of experience survived one year (0.96 a month)", "e stokut të përvojës së firmës mbijetonte një vit (0,96 në muaj)", "des Erfahrungsbestands der Firma überdauerten ein Jahr (0,96 je Monat)") },
          { n: x("up to 10", "deri në 10", "bis zu 10"), t: x("positions could change when one job opened, under the seniority rules", "vende pune mund të ndryshonin kur hapej një vend, sipas rregullave të vjetërsisë", "Stellen konnten sich nach den Senioritätsregeln ändern, wenn eine frei wurde") },
        ] },
        { type: "p", text: x(
          "Benkard links the loss to layoffs when output fell, to rehiring new people when it rose again, and to turnover. Wright had warned of the same in 1936: a repeat order after a break costs more, because of new set-ups and labour turnover between orders.",
          "Benkard e lidh humbjen me pushimet nga puna kur ra prodhimi, me marrjen e njerëzve të rinj kur u rrit sërish, dhe me largimet. Wright e kishte paralajmëruar më 1936: një porosi e përsëritur pas një pushimi kushton më shumë, për shkak të përgatitjeve të reja dhe ndërrimit të njerëzve mes porosive.",
          "Benkard führt den Verlust auf Entlassungen bei sinkender Produktion zurück, auf Neueinstellungen beim Wiederanstieg und auf Fluktuation. Wright hatte schon 1936 gewarnt: Ein Folgeauftrag nach einer Pause kostet mehr, wegen neuer Rüstungen und wechselnden Personals zwischen den Aufträgen.") },
        { type: "callout", reading: true, text: x(
          "Count repetitions and gaps together. A task done once a month is not on the curve of a task done daily.",
          "Numëro përsëritjet dhe pushimet bashkë. Një detyrë që bëhet një herë në muaj nuk është në kurbën e një detyre të përditshme.",
          "Zählen Sie Wiederholungen und Pausen zusammen. Eine Aufgabe, einmal im Monat erledigt, liegt nicht auf der Kurve einer täglichen.") },
      ],
      note: x(
        "Benkard (1999), NBER working paper, read in full; one aircraft, one firm. The 61% is his estimate for the firm's stock, not an individual's skill, and he links it partly to rarely repeated tasks. Wright estimated a repeat order between the cost for new plus 0.8 of the old quantity and that of the new order alone.",
        "Benkard (1999), punim pune i NBER, lexuar i plotë; një avion, një firmë. 61% është vlerësimi i tij për stokun e firmës, jo për aftësinë e një individi, dhe ai e lidh pjesërisht me detyra që përsëriten rrallë. Wright e vlerësonte një porosi të përsëritur mes kostos për sasinë e re plus 0,8 të së vjetrës dhe kostos së porosisë së re vetëm.",
        "Benkard (1999), NBER-Arbeitspapier, vollständig gelesen; ein Flugzeug, eine Firma. Die 61 % sind seine Schätzung für den Bestand der Firma, nicht für das Können eines Einzelnen, und er verbindet sie teils mit selten wiederholten Aufgaben. Wright schätzte einen Folgeauftrag zwischen den Kosten für die neue plus 0,8 der alten Menge und denen des neuen Auftrags allein."),
      source: ["curve-benkard-1999", "curve-wright-1936"],
    },
    {
      id: "tool", tool: "/tools/time-study/",
      kicker: x("Tool of the issue", "Mjeti i numrit", "Werkzeug der Ausgabe"),
      title: [x("The learning", "Karta e kurbës", "Die Lernkurven-"), x("curve card", "së të mësuarit", "Karte")],
      lead: x(
        "One card for each new process, site or person on a task. The Time Study tool records a task cycle after cycle; write down the times of the 1st, 2nd, 4th, 8th and 16th repetition and the curve shows itself.",
        "Një kartë për çdo proces, vend ose person të ri në një detyrë. Mjeti Time Study e regjistron një detyrë cikël pas cikli; shëno kohët e përsëritjes së 1-rë, 2-të, 4-t, 8-t dhe 16-t, dhe kurba duket vetë.",
        "Eine Karte für jeden neuen Prozess, Standort oder Menschen an einer Aufgabe. Das Werkzeug Time Study erfasst eine Aufgabe Zyklus für Zyklus; notieren Sie die Zeiten der 1., 2., 4., 8. und 16. Wiederholung, und die Kurve zeigt sich."),
      blocks: [
        { type: "form", items: [
          { h: x("The task and its unit", "Detyra dhe njësia e saj", "Aufgabe und ihre Einheit"), hint: x("one repetition counted the same way each time: an order, a room, a pallet", "një përsëritje e numëruar njësoj çdo herë: një porosi, një dhomë, një paletë", "eine Wiederholung, jedes Mal gleich gezählt: ein Auftrag, ein Zimmer, eine Palette") },
          { h: x("Times at 1, 2, 4, 8, 16", "Kohët në 1, 2, 4, 8, 16", "Zeiten bei 1, 2, 4, 8, 16"), hint: x("or errors per unit; the same measure every time", "ose gabimet për njësi; e njëjta masë çdo herë", "oder Fehler je Einheit; jedes Mal dieselbe Kennzahl") },
          { h: x("What remains per doubling", "Çfarë mbetet për çdo dyfishim", "Was je Verdopplung bleibt"), hint: x("time at 8 divided by time at 4; near 0.8 is Wright's curve, near 1 is a plateau", "koha te 8 pjesëtuar me kohën te 4; afër 0,8 është kurba e Wright-it, afër 1 është rrafshnaltë", "Zeit bei 8 geteilt durch Zeit bei 4; nahe 0,8 ist Wrights Kurve, nahe 1 ein Plateau") },
          { h: x("Where the learning is kept", "Ku ruhet të mësuarit", "Wo das Gelernte bleibt"), hint: x("in a fixture, a layout, a written method, or only in one person", "në një pajisje, një shtrirje, një metodë të shkruar, apo vetëm te një person", "in einer Vorrichtung, einem Layout, einer schriftlichen Methode oder nur in einem Menschen") },
          { h: x("Breaks and changes", "Pushimet dhe ndryshimet", "Pausen und Änderungen"), hint: x("weeks without the task, a new variant, new people: expect a step back", "javë pa detyrën, një variant i ri, njerëz të rinj: prit një hap prapa", "Wochen ohne die Aufgabe, eine neue Variante, neue Leute: mit einem Rückschritt rechnen") },
          { h: x("The target and when", "Objektivi dhe kur", "Ziel und wann"), hint: x("the time expected, at which repetition, set from the curve, not from the first day", "koha e pritur, në cilën përsëritje, e vendosur nga kurba, jo nga dita e parë", "die erwartete Zeit, bei welcher Wiederholung, aus der Kurve gesetzt, nicht aus dem ersten Tag") },
        ] },
      ],
      note: x(
        "The card is the editors' proposal, built on Wright's doublings, the plant study and Benkard's forgetting; it is not a tested instrument. How to write the method down is in No. 35; why watching is not yet being ready, in treatise volume 8.",
        "Karta është propozim i redaksisë, i ndërtuar mbi dyfishimet e Wright-it, studimin e fabrikës dhe harresën e Benkard-it; nuk është instrument i testuar. Si shkruhet metoda është te Nr. 35; pse të shohësh nuk do të thotë ende të jesh gati, te vëllimi 8 i traktatit.",
        "Die Karte ist ein Vorschlag der Redaktion, gestützt auf Wrights Verdopplungen, die Werksstudie und Benkards Vergessen; sie ist kein geprüftes Instrument. Wie man die Methode aufschreibt, steht in Nr. 35; warum Zusehen noch nicht Bereitschaft ist, in Band 8 des Traktats."),
      source: ["curve-wright-1936", "curve-levitt-2012", "curve-benkard-1999"],
    },
    { id: "sources", type: "sources" },
    { id: "back", type: "back" },
  ],
};
