// Management Review, No. 81: Predictable schedules, the roster as a management tool. Block: Role. It opens the third
// series. Facts and their sources: docs/revista/management-review-nr-81.md. The Gap experiment follows the report of
// Williams et al. (2018), read in full (PDF at WorkLife Law); the survey figures are from Schneider & Harknett (2019),
// read in full in the author manuscript at PubMed Central; the law is read in the text of Directive (EU) 2019/1152 and
// of § 12 TzBfG.
import { x, pc } from "../common.js";

export default {
  number: 81,
  block: "role",
  date: x("November 2026", "Nëntor 2026", "November 2026"),
  theme: [x("Predictable schedules:", "Turnet e parashikueshme:", "Planbare Dienstpläne:"), x("the roster as a management tool", "plani i turneve si mjet drejtimi", "der Dienstplan als Führungsinstrument")],
  sub: x(
    "An experiment in 28 stores, how little notice hourly workers get, why the hours weigh more than the pay, four sides of a stable roster, five numbers to watch, and a card for the next roster.",
    "Një eksperiment në 28 dyqane, sa pak paralajmërim marrin punonjësit me orë, pse oraret peshojnë më shumë se paga, katër anët e një plani të qëndrueshëm, pesë shifra për t'u ndjekur dhe një kartë për planin e radhës.",
    "Ein Experiment in 28 Filialen, wie kurzfristig Stundenkräfte ihre Pläne erfahren, warum die Zeiten schwerer wiegen als der Lohn, vier Seiten eines stabilen Plans, fünf Kennzahlen und eine Karte."),
  seo: x(
    "Predictable schedules: the Gap stable scheduling experiment, notice and on-call work in the Shift Project, EU Directive 2019/1152, and a roster card.",
    "Turnet e parashikueshme: eksperimenti i Gap-it, paralajmërimi dhe puna me thirrje te Shift Project, Direktiva (BE) 2019/1152 dhe një kartë.",
    "Planbare Dienstpläne: das Gap-Experiment, Vorlauf und Abrufarbeit im Shift Project, die Richtlinie (EU) 2019/1152 und eine Karte zum Plan."),
  feature: x(
    "In 2015 Gap required its US stores to publish schedules two weeks ahead and stopped on-call shifts; researchers then tested five more practices in 28 stores. Issue 81 follows that experiment, counts how much notice hourly workers in large US firms receive, and sets changes to the roster beside a raise in pay. It describes four sides of a stable roster, five numbers that show how stable it is, the legal floor in the EU and Germany, and a card for the next roster. It opens the third series.",
    "Më 2015, Gap-i u kërkoi dyqaneve të veta në SHBA t'i botonin turnet dy javë përpara dhe hoqi turnet me thirrje; pastaj studiuesit provuan pesë praktika të tjera në 28 dyqane. Numri 81 e ndjek atë eksperiment, numëron sa paralajmërim marrin punonjësit me orë në firmat e mëdha amerikane dhe i vë ndryshimet në plan pranë një rritjeje page. Përshkruan katër anët e një plani të qëndrueshëm, pesë shifra që tregojnë sa i qëndrueshëm është, minimumin ligjor në BE dhe në Gjermani, dhe një kartë për planin e radhës. Me të nis seria e tretë.",
    "2015 verpflichtete Gap seine US-Filialen, Dienstpläne zwei Wochen im Voraus zu veröffentlichen, und schaffte Abrufschichten ab; danach testeten Forschende in 28 Filialen fünf weitere Praktiken. Ausgabe 81 folgt diesem Experiment, zählt, wie viel Vorlauf Stundenkräfte in großen US-Firmen bekommen, und stellt Änderungen am Plan neben eine Lohnerhöhung. Sie beschreibt vier Seiten eines stabilen Plans, fünf Kennzahlen für seine Stabilität, die gesetzliche Untergrenze in der EU und in Deutschland und eine Karte für den nächsten Plan. Mit ihr beginnt die dritte Serie."),
  figure: { n: x("+7%", "+7%", "+7 %"), by: "Williams et al., 2018", t: x(
    "median sales in the Gap stores that moved to more stable schedules, in a randomised experiment in 28 stores (2015–2016).",
    "shitjet mesatare (mediana) në dyqanet e Gap-it që kaluan në turne më të qëndrueshme, në një eksperiment të rastësishëm në 28 dyqane (2015–2016).",
    "Medianumsatz in den Gap-Filialen, die zu stabileren Dienstplänen übergingen, in einem randomisierten Experiment in 28 Filialen (2015–2016).") },
  teasers: [
    { page: "story", kicker: x("Cover story", "Tema kryesore", "Titelthema"),
      title: x("Two weeks' notice", "Dy javë përpara", "Zwei Wochen Vorlauf") },
    { page: "numbers", kicker: x("The numbers", "Shifrat", "Die Zahlen"),
      title: x("Less than a week", "Më pak se një javë", "Weniger als eine Woche") },
    { page: "tool", kicker: x("Tool of the issue", "Mjeti i numrit", "Werkzeug der Ausgabe"),
      title: x("The roster card", "Karta e planit të turneve", "Die Dienstplankarte") },
  ],
  sources: ["sched-williams-2018", "sched-schneider-2019", "sched-eu-2019", "sched-tzbfg-12"],
  pages: [
    { id: "cover", type: "cover" },
    {
      id: "intro", type: "intro",
      why: x(
        "For people paid by the hour, the roster decides when they earn, sleep and see their families. It is usually treated as an output of the forecast. The research of the last decade treats it as a lever: on the health of the team and on the results of the site.",
        "Për njerëzit që paguhen me orë, plani i turneve vendos kur fitojnë, kur flenë dhe kur e shohin familjen. Zakonisht trajtohet si rezultat i parashikimit. Kërkimet e dhjetëvjeçarit të fundit e trajtojnë si levë: për shëndetin e ekipit dhe për rezultatet e vendit të punës.",
        "Für Menschen, die nach Stunden bezahlt werden, entscheidet der Dienstplan, wann sie verdienen, schlafen und ihre Familie sehen. Meist gilt er als Ergebnis der Prognose. Die Forschung des letzten Jahrzehnts behandelt ihn als Hebel: für die Gesundheit des Teams und für die Ergebnisse des Standorts."),
      body: x(
        "In a randomised experiment in 28 Gap stores, more stable schedules went with 7% higher median sales. In a survey of 27,792 hourly workers at 80 large US firms, a third had less than a week's notice of their schedule. Ending on-call shifts went with a fall in distress more than seven times larger than a raise of $4 an hour. Four sides of a stable roster, five numbers to watch, the legal floor and a card for the next roster close the issue.",
        "Në një eksperiment të rastësishëm në 28 dyqane të Gap-it, turnet më të qëndrueshme u shoqëruan me shitje mesatare 7% më të larta. Në një anketë me 27.792 punonjës me orë në 80 firma të mëdha amerikane, një e treta e merrnin vesh planin më pak se një javë përpara. Heqja e turneve me thirrje shoqërohej me një rënie të stresit më shumë se shtatë herë më të madhe se një rritje page prej 4 $ në orë. Katër anët e një plani të qëndrueshëm, pesë shifra për t'u ndjekur, minimumi ligjor dhe një kartë e mbyllin numrin.",
        "In einem randomisierten Experiment in 28 Gap-Filialen gingen stabilere Dienstpläne mit einem um 7 % höheren Medianumsatz einher. In einer Umfrage unter 27.792 Stundenkräften in 80 großen US-Firmen kannte ein Drittel den Plan weniger als eine Woche im Voraus. Der Verzicht auf Abrufschichten ging mit einem mehr als siebenmal stärkeren Rückgang psychischer Belastung einher als 4 $ mehr Stundenlohn. Vier Seiten eines stabilen Plans, fünf Kennzahlen, die gesetzliche Untergrenze und eine Karte beenden die Ausgabe."),
    },
    {
      id: "story",
      kicker: x("Cover story", "Tema kryesore", "Titelthema"),
      title: [x("Two weeks'", "Dy javë", "Zwei Wochen"), x("notice", "përpara", "Vorlauf")],
      lead: x(
        "On 1 October 2015 Gap required all its US stores to publish schedules two weeks ahead and stopped on-call shifts. Researchers from three universities then tested five more practices from November 2015 to August 2016: in 19 stores in San Francisco and Chicago, against 9 that kept the usual roster.",
        "Më 1 tetor 2015, Gap-i u kërkoi të gjitha dyqaneve në SHBA t'i botonin turnet dy javë përpara dhe hoqi turnet me thirrje. Pastaj studiues nga tri universitete provuan pesë praktika të tjera nga nëntori 2015 deri në gusht 2016: në 19 dyqane në San Francisko dhe Çikago, përballë 9 dyqaneve që e mbajtën planin e zakonshëm.",
        "Am 1. Oktober 2015 verpflichtete Gap alle US-Filialen, Dienstpläne zwei Wochen im Voraus zu veröffentlichen, und schaffte Abrufschichten ab. Forschende dreier Universitäten testeten dann von November 2015 bis August 2016 fünf weitere Praktiken: in 19 Filialen in San Francisco und Chicago, gegen 9, die beim üblichen Plan blieben."),
      blocks: [
        { type: "rows", compact: true, items: [
          { h: x("Shift swapping by app", "Ndërrimi i turneve me aplikacion", "Schichttausch per App"), p: x("Staff swap shifts without the manager; the manager posts extra shifts.", "Punonjësit i ndërrojnë turnet pa menaxherin; menaxheri poston turne shtesë.", "Beschäftigte tauschen ohne die Leitung; die Leitung stellt Zusatzschichten ein.") },
          { h: x("Stable shift structure", "Strukturë e qëndrueshme e turneve", "Feste Schichtstruktur"), p: x("Standard start and end times for the store.", "Orë standarde fillimi dhe mbarimi për dyqanin.", "Einheitliche Anfangs- und Endzeiten in der Filiale.") },
          { h: x("Core scheduling", "Turne bazë", "Kernschichten"), p: x("The same days and times for each person, week after week.", "Të njëjtat ditë dhe orë për secilin, javë pas jave.", "Für jede Person dieselben Tage und Zeiten, Woche für Woche.") },
          { h: x("Part-time Plus", "Part-time Plus", "Part-time Plus"), p: x("A core team promised, softly, 20 hours a week or more.", "Një ekipi bazë i premtohen, pa detyrim të fortë, 20 orë ose më shumë në javë.", "Einem Kernteam werden, ohne harte Garantie, 20 Wochenstunden oder mehr zugesagt.") },
          { h: x("Targeted extra staffing", "Staf shtesë i synuar", "Gezielte Zusatzbesetzung"), p: x("Extra hours at fixed times in 13 stores, paid by Gap.", "Orë shtesë në kohë të caktuara në 13 dyqane, të paguara nga Gap-i.", "Zusätzliche Stunden zu festen Zeiten in 13 Filialen, bezahlt von Gap.") },
        ] },
        { type: "figures", compact: true, source: ["sched-williams-2018"], items: [
          { n: x("+7%", "+7%", "+7 %"), t: x("median sales in the stores with the practices", "shitjet mesatare në dyqanet me praktikat", "Medianumsatz in den Filialen mit den Praktiken") },
          { n: x("+5%", "+5%", "+5 %"), t: x("sales per hour of labour", "shitjet për çdo orë pune", "Umsatz pro Arbeitsstunde") },
        ] },
        { type: "callout", reading: true, text: x(
          "The schedule was not a cost to cut here. Kept steady, it paid for itself.",
          "Këtu plani i turneve nuk ishte kosto për t'u prerë. I mbajtur i qëndrueshëm, e pagoi veten.",
          "Der Dienstplan war hier kein Kostenblock zum Kürzen. Stabil gehalten, hat er sich selbst bezahlt.") },
      ],
      note: x(
        "Results as the researchers estimated them (difference-in-differences, 35 weeks). Gap took part and gave a $50,000 seed grant. At the end Gap cut the notice from two weeks to ten days.",
        "Rezultatet siç i vlerësuan studiuesit (diferencë e diferencave, 35 javë). Gap-i mori pjesë dhe dha një grant fillestar prej 50.000 $. Në fund Gap-i e uli paralajmërimin nga dy javë në dhjetë ditë.",
        "Ergebnisse, wie die Forschenden sie schätzten (Differenz-von-Differenzen, 35 Wochen). Gap nahm teil und gab eine Anschubfinanzierung von 50.000 $. Am Ende verkürzte Gap den Vorlauf von zwei Wochen auf zehn Tage."),
      source: ["sched-williams-2018"],
    },
    {
      id: "numbers",
      kicker: x("The numbers", "Shifrat", "Die Zahlen"),
      title: [x("Less than", "Më pak se", "Weniger als"), x("a week", "një javë", "eine Woche")],
      lead: x(
        "The Shift Project surveyed 27,792 hourly workers at 80 large US retail and food-service firms in 2016 and 2017. They were recruited through Facebook advertisements and weighted to match the workforce.",
        "Shift Project anketoi 27.792 punonjës me orë në 80 firma të mëdha amerikane të tregtisë me pakicë dhe të ushqimit më 2016 dhe 2017. U rekrutuan përmes reklamave në Facebook dhe u peshuan që t'i përgjigjeshin fuqisë punëtore.",
        "Das Shift Project befragte 2016 und 2017 27.792 Stundenkräfte in 80 großen US-Firmen des Einzelhandels und der Gastronomie. Sie wurden über Facebook-Anzeigen gewonnen und auf die Beschäftigtenstruktur gewichtet."),
      blocks: [
        { type: "hbars", max: 40, source: ["sched-schneider-2019"],
          label: x("Notice of the weekly schedule, share of workers (2016–2017)", "Paralajmërimi për planin javor, pjesa e punonjësve (2016–2017)", "Vorlauf des Wochenplans, Anteil der Beschäftigten (2016–2017)"),
          items: [
            { k: x("0–2 days", "0–2 ditë", "0–2 Tage"), v: 16, n: pc(16), alert: true },
            { k: x("3–6 days", "3–6 ditë", "3–6 Tage"), v: 18, n: pc(18) },
            { k: x("1–2 weeks", "1–2 javë", "1–2 Wochen"), v: 30, n: pc(30) },
            { k: x("More than 2 weeks", "Më shumë se 2 javë", "Mehr als 2 Wochen"), v: 37, n: pc(37) },
          ] },
        { type: "figures", compact: true, items: [
          { n: pc(50), t: x("worked a “clopening”: a closing shift, then an opening one less than 11 hours later, in the past month", "punuan një “clopening”: turn mbylljeje, pastaj turn hapjeje pas më pak se 11 orësh, muajin e fundit", "arbeiteten ein „Clopening“: Spätschicht bis Ladenschluss, keine 11 Stunden später die Frühschicht, im letzten Monat") },
          { n: pc(26), t: x("worked on call in the past month", "punuan me thirrje muajin e fundit", "arbeiteten im letzten Monat auf Abruf") },
          { n: pc(14), t: x("had a shift cancelled with less than 24 hours' notice", "e panë një turn të anuluar me më pak se 24 orë paralajmërim", "hatten eine Schicht, die weniger als 24 Stunden vorher abgesagt wurde") },
        ] },
        { type: "p", text: x(
          "Half had no say at all in their schedule. Between the best and the worst week of the month, hours swung by 32% on average.",
          "Gjysma nuk kishin asnjë fjalë për planin e tyre. Mes javës më të mirë dhe më të keqe të muajit, orët luhateshin mesatarisht me 32%.",
          "Die Hälfte hatte keinerlei Einfluss auf den eigenen Plan. Zwischen der besten und der schlechtesten Woche des Monats schwankten die Stunden im Schnitt um 32 %.") },
        { type: "callout", reading: true, text: x(
          "Two weeks' notice was the exception, not the rule. For most, next week was still open.",
          "Paralajmërimi dy javë përpara ishte përjashtim, jo rregull. Për shumicën, java e ardhshme ishte ende e hapur.",
          "Zwei Wochen Vorlauf waren die Ausnahme, nicht die Regel. Für die meisten war die nächste Woche noch offen.") },
      ],
      note: x(
        "Workers' own reports; the bars count workers and add to 101% by rounding. US retail and food service, not a probability sample. Read in the full text of the article.",
        "Të dhëna të raportuara nga vetë punonjësit; shiritat numërojnë punonjës dhe japin 101% nga rrumbullakimi. Tregti me pakicë dhe ushqim në SHBA, jo mostër probabilitare. Lexuar te teksti i plotë i artikullit.",
        "Eigene Angaben der Beschäftigten; die Balken zählen Beschäftigte und ergeben durch Rundung 101 %. US-Einzelhandel und Gastronomie, keine Zufallsstichprobe. Gelesen im Volltext des Artikels."),
      source: ["sched-schneider-2019"],
    },
    {
      id: "research",
      kicker: x("What the research says", "Çfarë thotë kërkimi", "Was die Forschung sagt"),
      title: [x("Time weighs", "Koha peshon", "Zeit wiegt"), x("more than pay", "më shumë se paga", "schwerer als Lohn")],
      lead: x(
        "In the same data, every form of unstable scheduling went with more psychological distress, and most with worse sleep and less happiness. Schneider and Harknett then set changes to the schedule beside raises in the minimum wage.",
        "Në të njëjtat të dhëna, çdo formë e paqëndrueshmërisë së turneve shoqërohej me më shumë stres psikologjik, dhe shumica me gjumë më të keq dhe më pak lumturi. Pastaj Schneider-i dhe Harknett-i i vunë ndryshimet në plan pranë rritjeve të pagës minimale.",
        "In denselben Daten ging jede Form instabiler Dienstpläne mit mehr psychischer Belastung einher, die meisten auch mit schlechterem Schlaf und weniger Zufriedenheit. Schneider und Harknett stellten dann Änderungen am Plan neben Erhöhungen des Mindestlohns."),
      blocks: [
        { type: "hbars", max: 16, source: ["sched-schneider-2019"],
          label: x("Estimated fall in psychological distress for the workers affected, percentage points", "Rënia e vlerësuar e stresit psikologjik për punonjësit e prekur, pikë përqindjeje", "Geschätzter Rückgang psychischer Belastung bei den Betroffenen, Prozentpunkte"),
          items: [
            { k: x("No more on-call shifts", "Pa turne me thirrje", "Keine Abrufschichten mehr"), v: 15, n: "15", alert: true },
            { k: x("72 hours' notice, not 0–2 days", "72 orë paralajmërim, jo 0–2 ditë", "72 Stunden Vorlauf statt 0–2 Tage"), v: 4.5, n: x("4.5", "4,5", "4,5") },
            { k: x("$4 an hour more pay", "4 $ më shumë në orë", "4 $ mehr Stundenlohn"), v: 2, n: "2" },
          ] },
        { type: "p", text: x(
          "Of the workers who had a shift cancelled at short notice, 65% reported distress, against under 45% of the others. Work-life conflict accounted for 76% of the link between instability and distress, household economic insecurity for 42%, each measured on its own.",
          "Nga punonjësit që e panë një turn të anuluar në çast, 65% raportuan stres, përballë më pak se 45% të të tjerëve. Konflikti mes punës dhe jetës shpjegonte 76% të lidhjes mes paqëndrueshmërisë dhe stresit, pasiguria ekonomike e familjes 42%, secila e matur më vete.",
          "Von den Beschäftigten mit kurzfristig abgesagter Schicht berichteten 65 % von Belastung, von den übrigen unter 45 %. Der Konflikt zwischen Arbeit und Privatleben erklärte 76 % des Zusammenhangs zwischen Instabilität und Belastung, die wirtschaftliche Unsicherheit des Haushalts 42 %, jeweils für sich gemessen.") },
        { type: "callout", reading: true, text: x(
          "The hours hurt less through the money than through the life around them.",
          "Orët dëmtojnë më pak përmes parave sesa përmes jetës përreth tyre.",
          "Die Stunden schaden weniger über das Geld als über das Leben um sie herum.") },
      ],
      note: x(
        "A cross-sectional survey: associations, not proof of cause. The “effects” are differences in predicted shares, as the authors say; the wage base is $7.25. Read in the full text.",
        "Anketë në një moment të vetëm: lidhje, jo provë shkaku. “Efektet” janë dallime në pjesët e parashikuara, siç thonë autorët; paga bazë është 7,25 $. Lexuar te teksti i plotë.",
        "Eine Querschnittsbefragung: Zusammenhänge, kein Beweis für Ursachen. Die „Effekte“ sind Unterschiede vorhergesagter Anteile, wie die Autoren schreiben; Ausgangslohn 7,25 $. Gelesen im Volltext."),
      source: ["sched-schneider-2019"],
    },
    {
      id: "model", more: "high-volume-days",
      kicker: x("The model", "Modeli", "Das Modell"),
      title: [x("Four sides of", "Katër anët e", "Vier Seiten eines"), x("a stable roster", "një plani të qëndrueshëm", "stabilen Plans")],
      lead: x(
        "The Gap study measured stability on four sides, each with its own data: the published schedules, the time clock and two surveys of staff.",
        "Studimi i Gap-it e mati qëndrueshmërinë në katër anë, secila me të dhënat e veta: planet e botuara, regjistrimet e hyrje-daljeve dhe dy anketa me stafin.",
        "Die Gap-Studie maß Stabilität an vier Seiten, jede mit eigenen Daten: veröffentlichte Pläne, Zeiterfassung und zwei Befragungen des Personals."),
      blocks: [
        { type: "cards", cols: 2, items: [
          { h: x("Consistency", "Qëndrueshmëria", "Beständigkeit"), p: x("Same days, times and hours each week. Same start or end hour: under 3 in 10 shifts without the practices, over 3 in 9 with them.", "Të njëjtat ditë, orë dhe sasi orësh çdo javë. E njëjta orë fillimi ose mbarimi: më pak se 3 në 10 turne pa praktikat, mbi 3 në 9 me to.", "Gleiche Tage, Zeiten und Stunden jede Woche. Gleiche Anfangs- oder Endstunde: unter 3 von 10 Schichten ohne die Praktiken, über 3 von 9 mit ihnen.") },
          { h: x("Predictability", "Parashikueshmëria", "Planbarkeit"), p: x("The shift worked is the shift published. Changed by 15 minutes or more: 46% of shifts without the practices, 41% with them.", "Turni i punuar është turni i botuar. Të ndryshuar me 15 minuta ose më shumë: 46% e turneve pa praktikat, 41% me to.", "Gearbeitet wird, was veröffentlicht war. Um 15 Minuten oder mehr geändert: 46 % der Schichten ohne die Praktiken, 41 % mit ihnen.") },
          { h: x("Adequacy", "Mjaftueshmëria", "Auskömmlichkeit"), p: x("Enough hours for those who want them. Part-time Plus: 21 hours a week before, 26 after; the average did not rise.", "Orë të mjaftueshme për ata që i duan. Part-time Plus: 21 orë në javë para, 26 pas; mesatarja nuk u rrit.", "Genug Stunden für alle, die sie wollen. Part-time Plus: 21 Wochenstunden vorher, 26 danach; der Durchschnitt stieg nicht.") },
          { h: x("Input", "Fjala e punonjësit", "Mitsprache"), p: x("A say in when one works. Input into the days worked: 75% with the practices, 66% without.", "Një fjalë për kur punon. Fjalë për ditët e punës: 75% me praktikat, 66% pa to.", "Mitsprache, wann man arbeitet. Einfluss auf die Arbeitstage: 75 % mit den Praktiken, 66 % ohne.") },
        ] },
        { type: "p", text: x(
          "Demand was not the main cause of instability: week-to-week traffic explained only 30% of the swings in weekly payroll hours. Managers named three causes at headquarters: shipments, promotions changed at the last minute, and visits by leaders.",
          "Kërkesa nuk ishte shkaku kryesor i paqëndrueshmërisë: lëvizja e klientëve nga java në javë shpjegonte vetëm 30% të luhatjeve të orëve javore të pagave. Menaxherët përmendën tri shkaqe në qendër: dërgesat, promocionet e ndryshuara në minutën e fundit dhe vizitat e drejtuesve.",
          "Die Nachfrage war nicht die Hauptursache der Instabilität: Die Kundenfrequenz von Woche zu Woche erklärte nur 30 % der Schwankungen der wöchentlichen Lohnstunden. Die Leitungen nannten drei Ursachen in der Zentrale: Lieferungen, kurzfristig geänderte Aktionen und Besuche der Führung.") },
        { type: "callout", reading: true, text: x(
          "Much of a store's instability is made upstream. The roster is where it lands.",
          "Shumë nga paqëndrueshmëria e një dyqani prodhohet më lart. Plani i turneve është vendi ku bie.",
          "Viel Instabilität einer Filiale entsteht weiter oben. Im Dienstplan landet sie.") },
      ],
      note: x(
        "Definitions and results condensed from Williams et al. (2018): weeks with the practices against weeks without; survey answers for input. Demand and capacity in one plan are in No. 59.",
        "Përkufizimet dhe rezultatet të përmbledhura nga Williams et al. (2018): javët me praktikat përballë javëve pa to; përgjigjet e anketës për fjalën e punonjësit. Kërkesa dhe kapaciteti në një plan janë te Nr. 59.",
        "Definitionen und Ergebnisse gekürzt nach Williams et al. (2018): Wochen mit den Praktiken gegen Wochen ohne; für die Mitsprache Antworten der Befragung. Nachfrage und Kapazität in einem Plan stehen in Nr. 59."),
      source: ["sched-williams-2018"],
    },
    {
      id: "measure",
      kicker: x("How it is measured", "Si matet", "Wie es gemessen wird"),
      title: [x("Five numbers", "Pesë shifra", "Fünf Zahlen"), x("for a roster", "për një plan turnesh", "für einen Dienstplan")],
      lead: x(
        "The two studies measured stability with simple counts. A manager can take them from the published roster and the time clock, period after period.",
        "Dy studimet e matën qëndrueshmërinë me numërime të thjeshta. Një menaxher mund t'i nxjerrë nga plani i botuar dhe nga regjistrimet e hyrje-daljeve, periudhë pas periudhe.",
        "Die beiden Studien maßen Stabilität mit einfachen Zählungen. Eine Führungskraft kann sie aus dem veröffentlichten Plan und der Zeiterfassung ziehen, Periode für Periode."),
      blocks: [
        { type: "rows", compact: true, items: [
          { h: x("Notice", "Paralajmërimi", "Vorlauf"), p: x("Days from publishing the roster to its first shift.", "Ditët nga botimi i planit deri te turni i tij i parë.", "Tage von der Veröffentlichung bis zur ersten Schicht des Plans.") },
          { h: x("Changed shifts", "Turnet e ndryshuara", "Geänderte Schichten"), p: x("Share of shifts worked 15 minutes or more off the published start or end.", "Pjesa e turneve të punuara 15 minuta ose më shumë larg fillimit ose mbarimit të botuar.", "Anteil der Schichten, die 15 Minuten oder mehr vom veröffentlichten Beginn oder Ende abweichen.") },
          { h: x("Hours swing", "Luhatja e orëve", "Stundenschwankung"), p: x("Most minus fewest weekly hours in four weeks, divided by the most.", "Orët javore më të shumta minus më të paktat në katër javë, pjesëtuar me më të shumtat.", "Höchste minus niedrigste Wochenstunden in vier Wochen, geteilt durch die höchsten.") },
          { h: x("Late cancellations", "Anulimet në çast", "Kurzfristige Absagen"), p: x("Shifts cancelled with less than 24 hours' notice.", "Turnet e anuluara me më pak se 24 orë paralajmërim.", "Schichten, die weniger als 24 Stunden vorher abgesagt werden.") },
          { h: x("Clopenings", "Clopening", "Clopenings"), p: x("A closing shift followed by an opening one less than 11 hours later.", "Një turn mbylljeje i ndjekur nga një turn hapjeje pas më pak se 11 orësh.", "Eine Spätschicht, auf die keine 11 Stunden später eine Frühschicht folgt.") },
        ] },
        { type: "p", text: x(
          "The legal floor: under Directive (EU) 2019/1152, a worker whose pattern is mostly unpredictable may refuse work outside agreed reference hours and days, or without reasonable notice. In Germany, for work on call, the notice is at least four days.",
          "Minimumi ligjor: sipas Direktivës (BE) 2019/1152, punonjësi me orar kryesisht të paparashikueshëm mund ta refuzojë punën jashtë orëve dhe ditëve të referencës së rëna dakord, ose pa paralajmërim të arsyeshëm. Në Gjermani, për punën me thirrje, paralajmërimi është të paktën katër ditë.",
          "Die gesetzliche Untergrenze: Nach der Richtlinie (EU) 2019/1152 darf, wer ein überwiegend unvorhersehbares Arbeitsmuster hat, Arbeit außerhalb vereinbarter Referenzstunden und -tage oder ohne angemessene Frist ablehnen. In Deutschland beträgt die Frist bei Arbeit auf Abruf mindestens vier Tage.") },
      ],
      note: x(
        "Definitions from Williams et al. (2018) and Schneider & Harknett (2019); the selection is the editors'. Article 10 of the directive and § 12 TzBfG, summarised, not legal advice. Rest and the body clock are in No. 45.",
        "Përkufizimet nga Williams et al. (2018) dhe Schneider & Harknett (2019); përzgjedhja është e redaksisë. Neni 10 i direktivës dhe § 12 TzBfG, të përmbledhur, jo këshillë ligjore. Pushimi dhe ora biologjike janë te Nr. 45.",
        "Definitionen nach Williams et al. (2018) und Schneider & Harknett (2019); die Auswahl stammt von der Redaktion. Artikel 10 der Richtlinie und § 12 TzBfG, zusammengefasst, keine Rechtsberatung. Ruhezeit und innere Uhr stehen in Nr. 45."),
      source: ["sched-williams-2018", "sched-schneider-2019", "sched-eu-2019", "sched-tzbfg-12"],
    },
    {
      id: "tool", tool: "/tools/shift-capacity/",
      kicker: x("Tool of the issue", "Mjeti i numrit", "Werkzeug der Ausgabe"),
      title: [x("The roster", "Karta e planit", "Die Dienstplan-"), x("card", "të turneve", "karte")],
      lead: x(
        "One card per roster: filled in when it is published, checked when the period ends. Shift Capacity turns the volume forecast into heads per shift before the roster is written.",
        "Një kartë për çdo plan: plotësohet kur botohet, kontrollohet kur mbaron periudha. Shift Capacity e kthen parashikimin e volumit në numër njerëzish për turn, para se të shkruhet plani.",
        "Eine Karte pro Plan: ausgefüllt bei der Veröffentlichung, geprüft am Ende der Periode. Shift Capacity macht aus der Mengenprognose Köpfe pro Schicht, bevor der Plan entsteht."),
      blocks: [
        { type: "form", items: [
          { h: x("Published, first shift", "Botuar më, turni i parë", "Veröffentlicht, erste Schicht"), hint: x("the two dates, and the notice in days", "dy datat, dhe paralajmërimi në ditë", "beide Daten, und der Vorlauf in Tagen") },
          { h: x("Reference hours and days", "Orët dhe ditët e referencës", "Referenzstunden und -tage"), hint: x("the time frame in which work can be asked", "korniza kohore në të cilën mund të kërkohet puna", "der Zeitrahmen, in dem Arbeit verlangt werden kann") },
          { h: x("Core shifts", "Turnet bazë", "Kernschichten"), hint: x("who keeps the same days and times as last period", "kush i mban të njëjtat ditë dhe orë si periudhën e kaluar", "wer dieselben Tage und Zeiten wie zuletzt behält") },
          { h: x("Changes after publishing", "Ndryshimet pas botimit", "Änderungen nach Veröffentlichung"), hint: x("shifts moved 15 minutes or more; asked by the site or by the worker", "turne të zhvendosura 15 minuta ose më shumë; të kërkuara nga vendi i punës apo nga punonjësi", "Schichten um 15 Minuten oder mehr verschoben; vom Standort oder von der Person gewünscht") },
          { h: x("Late cancellations, clopenings", "Anulime në çast, clopening", "Kurzfristige Absagen, Clopenings"), hint: x("how many, and for whom", "sa, dhe për kë", "wie viele, und für wen") },
          { h: x("What drove the changes", "Çfarë i shkaktoi ndryshimet", "Was die Änderungen auslöste"), hint: x("demand, a delivery, a promotion, a visit, an absence; what to plan next time", "kërkesa, një dërgesë, një promocion, një vizitë, një mungesë; çfarë të planifikohet herën tjetër", "Nachfrage, Lieferung, Aktion, Besuch, Ausfall; was beim nächsten Mal einzuplanen ist"), lines: 2 },
        ] },
      ],
      note: x(
        "A card the editors propose, after Williams et al. (2018), Schneider & Harknett (2019) and Article 10 of Directive (EU) 2019/1152.",
        "Kartë që propozon redaksia, sipas Williams et al. (2018), Schneider & Harknett (2019) dhe nenit 10 të Direktivës (BE) 2019/1152.",
        "Eine Karte, die die Redaktion vorschlägt, nach Williams et al. (2018), Schneider & Harknett (2019) und Artikel 10 der Richtlinie (EU) 2019/1152."),
      source: ["sched-williams-2018", "sched-schneider-2019", "sched-eu-2019"],
    },
    { id: "sources", type: "sources" },
    { id: "back", type: "back" },
  ],
};
