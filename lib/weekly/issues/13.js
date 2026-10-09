// Management Review, No. 13: Meetings that produce decisions. Block: Strategy.
// Facts and their sources: docs/revista/management-review-nr-13.md.
import { x, pc } from "../common.js";

export default {
  number: 13,
  block: "strategy",
  date: x("October 2026", "Tetor 2026", "Oktober 2026"),
  theme: [x("Meetings that produce", "Takimet që prodhojnë", "Meetings, die Entscheidungen"), x("decisions", "vendime", "hervorbringen")],
  sub: x(
    "How much time meetings take, why so many end without a decision, which formats change that, and a card that turns a meeting into a decision.",
    "Sa kohë marrin takimet, pse kaq shumë mbarojnë pa vendim, cilat forma e ndryshojnë këtë, dhe një kartë që e kthen takimin në vendim.",
    "Wie viel Zeit Meetings kosten, warum so viele ohne Entscheidung enden, welche Formen das ändern, und eine Karte, die aus einem Meeting eine Entscheidung macht."),
  seo: x(
    "Meetings that produce decisions: Perlow's survey of senior managers, Bain's 300,000 hours, Microsoft data, Lencioni's four meetings and a decision card.",
    "Takimet që prodhojnë vendime: anketa e Perlow me drejtues, 300.000 orët e Bain, të dhënat e Microsoft, katër takimet e Lencioni dhe karta e vendimit.",
    "Meetings, die Entscheidungen bringen: Perlows Umfrage, Bains 300.000 Stunden, Microsoft-Daten, Lencionis vier Meetingtypen und eine Entscheidungskarte."),
  feature: x(
    "Issue 13 counts what meetings cost, from 23 hours a week for executives to 300,000 hours for one weekly meeting, separates the four jobs a meeting can have, looks at two studies that change the format, and ends with a card for the meeting that has to decide.",
    "Numri 13 numëron sa kushtojnë takimet, nga 23 orë në javë për drejtuesit deri te 300.000 orë për një takim javor, ndan katër punët që mund të ketë një takim, shikon dy studime që ndryshojnë formën, dhe mbyllet me një kartë për takimin që duhet të vendosë.",
    "Ausgabe 13 rechnet vor, was Meetings kosten, von 23 Stunden pro Woche für Führungskräfte bis zu 300.000 Stunden für ein wöchentliches Meeting, trennt die vier Aufgaben, die ein Meeting haben kann, betrachtet zwei Studien, die die Form ändern, und endet mit einer Karte für das Meeting, das entscheiden muss."),
  figure: { n: pc(71), by: "Perlow et al., 2017", t: x(
    "of 182 senior managers said meetings are unproductive and inefficient.",
    "e 182 drejtuesve të lartë thanë se takimet janë joproduktive dhe joefikase.",
    "von 182 Führungskräften sagten, Meetings seien unproduktiv und ineffizient.") },
  teasers: [
    { page: "story", kicker: x("Cover story", "Tema kryesore", "Titelthema"),
      title: x("Twenty-three hours a week", "Njëzet e tre orë në javë", "Dreiundzwanzig Stunden pro Woche") },
    { page: "model", kicker: x("The model", "Modeli", "Das Modell"),
      title: x("Four meetings, not one", "Katër takime, jo një", "Vier Meetings, nicht eines") },
    { page: "tool", kicker: x("Tool of the issue", "Mjeti i numrit", "Werkzeug der Ausgabe"),
      title: x("The decision card", "Karta e vendimit", "Die Entscheidungskarte") },
  ],
  sources: ["perlow-2017", "mankins-2014", "microsoft-workday-2025", "lencioni-2004", "bluedorn-1999", "laker-2022"],
  pages: [
    { id: "cover", type: "cover" },
    {
      id: "intro", type: "intro",
      why: x(
        "Meetings are where most managers spend their week, and where many decisions should be made and are not. This issue is about the cost of that time, and about the meeting whose only job is to decide.",
        "Takimet janë vendi ku shumica e menaxherëve kalojnë javën, dhe ku shumë vendime duhet të merren e nuk merren. Ky numër flet për koston e asaj kohe, dhe për takimin që ka një punë të vetme: të vendosë.",
        "In Meetings verbringen die meisten Führungskräfte ihre Woche, und dort sollten viele Entscheidungen fallen, die nicht fallen. Diese Ausgabe handelt von den Kosten dieser Zeit und von dem Meeting, dessen einzige Aufgabe es ist zu entscheiden."),
      body: x(
        "Executives spend nearly 23 hours a week in meetings, and most of 182 senior managers called them unproductive. Bain found one weekly meeting of a top team that, with its preparation, took 300,000 hours a year. Microsoft's data show more and more meetings without an invite. Patrick Lencioni separates the meeting into four kinds, and two studies show that the format itself can save time without losing decisions.",
        "Drejtuesit kalojnë afro 23 orë në javë në takime, dhe shumica e 182 drejtuesve të lartë i quajtën joproduktive. Bain gjeti një takim javor të drejtuesve që, me përgatitjen e tij, merrte 300.000 orë në vit. Të dhënat e Microsoft tregojnë gjithnjë e më shumë takime pa ftesë. Patrick Lencioni e ndan takimin në katër lloje, dhe dy studime tregojnë se vetë forma mund të kursejë kohë pa humbur vendime.",
        "Führungskräfte verbringen fast 23 Stunden pro Woche in Meetings, und die meisten von 182 Führungskräften nannten sie unproduktiv. Bain fand ein wöchentliches Meeting einer Führungsrunde, das mit seiner Vorbereitung 300.000 Stunden im Jahr kostete. Microsofts Daten zeigen immer mehr Meetings ohne Einladung. Patrick Lencioni teilt das Meeting in vier Arten, und zwei Studien zeigen, dass schon die Form Zeit sparen kann, ohne Entscheidungen zu verlieren."),
    },
    {
      id: "story",
      kicker: x("Cover story", "Tema kryesore", "Titelthema"),
      title: [x("Twenty-three hours", "Njëzet e tre orë", "Dreiundzwanzig Stunden"), x("a week", "në javë", "pro Woche")],
      lead: x(
        "Executives spend nearly 23 hours a week in meetings on average, up from less than 10 hours in the 1960s. Leslie Perlow, Constance Noonan Hadley and Eunice Eun asked 182 senior managers what this costs.",
        "Drejtuesit kalojnë mesatarisht afro 23 orë në javë në takime, nga më pak se 10 orë në vitet '60. Leslie Perlow, Constance Noonan Hadley dhe Eunice Eun pyetën 182 drejtues të lartë sa kushton kjo.",
        "Führungskräfte verbringen im Schnitt fast 23 Stunden pro Woche in Meetings, gegenüber weniger als 10 Stunden in den 1960er-Jahren. Leslie Perlow, Constance Noonan Hadley und Eunice Eun fragten 182 Führungskräfte, was das kostet."),
      blocks: [
        { type: "hbars", max: 100, source: ["perlow-2017"],
          label: x("Senior managers who say meetings…", "Drejtues të lartë që thonë se takimet…", "Führungskräfte, die sagen, Meetings…"),
          items: [
            { k: x("are unproductive and inefficient", "janë joproduktive dhe joefikase", "sind unproduktiv und ineffizient"), v: 71, n: pc(71), alert: true },
            { k: x("keep them from completing their own work", "i pengojnë të mbarojnë punën e vet", "halten sie von der eigenen Arbeit ab"), v: 65, n: pc(65) },
            { k: x("come at the expense of deep thinking", "vijnë në kurriz të mendimit të thellë", "gehen zulasten des gründlichen Denkens"), v: 64, n: pc(64) },
          ] },
        { type: "p", text: x(
          "Bain studied how 17 large companies spend their time. In one of them, a single weekly meeting of the top team, together with the meetings that prepared it, took about 300,000 hours a year.",
          "Bain studioi si e kalojnë kohën 17 kompani të mëdha. Në njërën prej tyre, një takim i vetëm javor i drejtuesve, bashkë me takimet që e përgatisnin, merrte rreth 300.000 orë në vit.",
          "Bain untersuchte, wie 17 große Unternehmen ihre Zeit verbringen. In einem davon kostete ein einziges wöchentliches Meeting der Führungsrunde, zusammen mit den Meetings zu seiner Vorbereitung, rund 300.000 Stunden im Jahr.") },
        { type: "figures", compact: true, source: ["mankins-2014"], items: [
          { n: pc(15), t: x("of an organisation's collective time goes into meetings, more every year since 2008", "e kohës kolektive të organizatës shkon në takime, më shumë çdo vit që nga 2008", "der gemeinsamen Zeit einer Organisation gehen in Meetings, seit 2008 jedes Jahr mehr") },
          { n: x("300,000", "300.000", "300.000"), t: x("hours a year for one weekly meeting of the top team", "orë në vit për një takim javor të drejtuesve", "Stunden im Jahr für ein wöchentliches Meeting der Führungsrunde") },
          { n: x("Over half", "Mbi gjysma", "Über die Hälfte"), t: x("of their meetings were rated ineffective by senior executives", "e takimeve të tyre u vlerësuan joefektive nga drejtuesit", "ihrer Meetings bewerteten Führungskräfte als ineffektiv") },
        ] },
        { type: "callout", reading: true, text: x(
          "A meeting is never only the hour in the calendar. It is the hour times the people in the room, plus the meetings that prepare it.",
          "Takimi nuk është kurrë vetëm ora në kalendar. Është ora shumëzuar me njerëzit në sallë, plus takimet që e përgatisin.",
          "Ein Meeting ist nie nur die Stunde im Kalender. Es ist die Stunde mal die Menschen im Raum, plus die Meetings, die es vorbereiten.") },
      ],
      source: ["perlow-2017", "mankins-2014"],
    },
    {
      id: "numbers",
      kicker: x("The numbers", "Shifrat", "Die Zahlen"),
      title: [x("The meeting", "Takimi", "Das Meeting"), x("without an invite", "pa ftesë", "ohne Einladung")],
      lead: x(
        "Microsoft analysed anonymised data from its office software for the year to February 2025, with a survey of 31,000 workers. Customers in the EU are not included, so the figures describe workplaces outside it.",
        "Microsoft analizoi të dhëna anonime nga programet e veta të zyrës për vitin deri në shkurt 2025, me një anketë me 31.000 punonjës. Klientët në BE nuk përfshihen, prandaj shifrat përshkruajnë vende pune jashtë saj.",
        "Microsoft wertete anonymisierte Daten seiner Bürosoftware für das Jahr bis Februar 2025 aus, dazu eine Umfrage unter 31.000 Beschäftigten. EU-Kunden fehlen; die Zahlen beschreiben Arbeitsplätze außerhalb der EU."),
      blocks: [
        { type: "donut", v: 57, n: pc(57), t: x(
          "of meetings were ad hoc calls, without a calendar invite.",
          "e takimeve ishin thirrje të çastit, pa ftesë në kalendar.",
          "der Meetings waren spontane Anrufe ohne Kalendereinladung.") },
        { type: "columns", max: 30, height: 90, source: ["microsoft-workday-2025"],
          label: x("Share of the week's meetings", "Pjesa e takimeve të javës", "Anteil an den Meetings der Woche"),
          items: [
            { k: x("Tuesday", "E marta", "Dienstag"), v: 23, n: pc(23), alert: true },
            { k: x("Friday", "E premtja", "Freitag"), v: 16, n: pc(16) },
          ] },
        { type: "figures", compact: true, items: [
          { n: x("+16%", "+16%", "+16 %"), t: x("meetings that start after 8 p.m., in one year", "takime që nisin pas orës 20, brenda një viti", "Meetings, die nach 20 Uhr beginnen, in einem Jahr") },
          { n: "275", t: x("interruptions a day by meetings, emails or chats in core hours", "ndërprerje në ditë nga takime, email-e ose mesazhe, në orarin kryesor", "Unterbrechungen pro Tag durch Meetings, E-Mails oder Chats in der Kernzeit") },
        ] },
        { type: "callout", reading: true, text: x(
          "A meeting without an invite has no agenda, no list of who should be there and no note afterwards. It can be useful; it cannot be checked.",
          "Takimi pa ftesë nuk ka rend dite, as listë të atyre që duhet të jenë, as shënim pas tij. Mund të jetë i dobishëm; nuk mund të kontrollohet.",
          "Ein Meeting ohne Einladung hat keine Tagesordnung, keine Liste derer, die dabei sein sollten, und keine Notiz danach. Es kann nützlich sein; überprüfen lässt es sich nicht.") },
      ],
      source: ["microsoft-workday-2025"],
    },
    {
      id: "model", more: "ten-minutes-before-the-shift",
      kicker: x("The model", "Modeli", "Das Modell"),
      title: [x("Four meetings,", "Katër takime,", "Vier Meetings,"), x("not one", "jo një", "nicht eines")],
      lead: x(
        "In Death by Meeting (2004), Patrick Lencioni proposes four kinds of meetings, each with one purpose and its own length.",
        "Te Death by Meeting (2004), Patrick Lencioni propozon katër lloje takimesh, secili me një qëllim dhe me gjatësinë e vet.",
        "In Death by Meeting (2004) schlägt Patrick Lencioni vier Arten von Meetings vor, jede mit einem Zweck und eigener Länge."),
      blocks: [
        { type: "rows", compact: true, items: [
          { h: x("Daily check-in", "Kontrolli ditor", "Täglicher Check-in"), p: x("About five minutes, standing: who does what today. No problem-solving.", "Rreth pesë minuta, në këmbë: kush bën çfarë sot. Pa zgjidhur probleme.", "Etwa fünf Minuten, im Stehen: wer heute was macht. Keine Problemlösung.") },
          { h: x("Weekly tactical", "Takimi taktik javor", "Wöchentliches Taktik-Meeting"), p: x("45 to 90 minutes: a quick round, progress against the numbers, then an agenda built from what came up.", "45 deri në 90 minuta: një raund i shpejtë, ecuria kundrejt shifrave, pastaj rendi i ditës nga ajo që doli.", "45 bis 90 Minuten: kurze Runde, die Zahlen, dann eine Tagesordnung aus dem, was sich zeigt.") },
          { h: x("Monthly strategic", "Takimi strategjik mujor", "Monatliches Strategie-Meeting"), p: x("A few big issues, about two hours each, for debate and decision.", "Pak çështje të mëdha, rreth dy orë secila, për debat dhe vendim.", "Wenige große Themen, je etwa zwei Stunden, für Debatte und Entscheidung.") },
          { h: x("Quarterly review", "Rishikimi tremujor", "Quartalsrückblick"), p: x("One or two days away from daily work: strategy, the team and the direction.", "Një ose dy ditë larg punës së përditshme: strategjia, ekipi dhe drejtimi.", "Ein bis zwei Tage abseits des Alltags: Strategie, Team und Richtung.") },
        ] },
        { type: "example", label: x("Hypothetical example, a team's calendar", "Shembull hipotetik, kalendari i një ekipi", "Hypothetisches Beispiel, der Kalender eines Teams"), rows: [
          { k: x("Every day", "Çdo ditë", "Täglich"), v: x("Check-in at 8:55, five minutes", "Kontrolli në 8:55, pesë minuta", "Check-in um 8:55, fünf Minuten") },
          { k: x("Tuesday", "E marta", "Dienstag"), v: x("Tactical, one hour", "Taktiku, një orë", "Taktik, eine Stunde") },
          { k: x("First Thursday", "E enjtja e parë", "1. Donnerstag"), v: x("Strategic, one issue, two hours", "Strategjiku, një çështje, dy orë", "Strategie, ein Thema, zwei Stunden") },
        ], text: x("Three slots instead of one long Monday meeting: the decision that needs debate gets its own two hours, and the check-in solves nothing. The calendar is invented.", "Tri vende në kalendar në vend të një takimi të gjatë të hënën: vendimi që kërkon debat merr dy orët e veta, dhe kontrolli ditor nuk zgjidh asgjë. Kalendari është i shpikur.", "Drei Termine statt eines langen Montagsmeetings: Die Entscheidung, die Debatte braucht, bekommt eigene zwei Stunden, und der Check-in löst nichts. Der Kalender ist erfunden.") },
        { type: "callout", reading: true, text: x(
          "Many teams do not have too many meetings of one kind. They have one meeting doing four jobs.",
          "Shumë ekipe nuk kanë shumë takime të një lloji. Kanë një takim që bën katër punë.",
          "Viele Teams haben nicht zu viele Meetings einer Art, sondern ein Meeting für vier Aufgaben.") },
      ],
      note: x(
        "The four kinds are Lencioni's; the lengths follow summaries of the book.",
        "Katër llojet janë të Lencioni; gjatësitë ndjekin përmbledhjet e librit.",
        "Die vier Arten stammen von Lencioni; die Längen folgen Zusammenfassungen des Buchs."),
      source: ["lencioni-2004"],
    },
    {
      id: "format",
      kicker: x("What changes the meeting", "Çfarë e ndryshon takimin", "Was das Meeting verändert"),
      title: [x("Standing up,", "Në këmbë,", "Im Stehen,"), x("and days without", "dhe ditë pa takime", "und Tage ohne")],
      lead: x(
        "Two studies change the shape of the meeting rather than its agenda: one changed the chairs, the other the calendar.",
        "Dy studime ndryshojnë formën e takimit, jo rendin e ditës: njëri ndryshoi karriget, tjetri kalendarin.",
        "Zwei Studien verändern die Form des Meetings, nicht seine Tagesordnung: die eine die Stühle, die andere den Kalender."),
      blocks: [
        { type: "columns", max: 140, height: 90, source: ["bluedorn-1999"],
          label: x("Length of the meetings, standing = 100", "Gjatësia e takimeve, në këmbë = 100", "Länge der Meetings, im Stehen = 100"),
          items: [
            { k: x("Standing", "Në këmbë", "Im Stehen"), v: 100, n: "100" },
            { k: x("Sitting", "Ulur", "Im Sitzen"), v: 134, n: "134", alert: true },
          ] },
        { type: "p", text: x(
          "The groups that sat took 34% longer and did not make better decisions. In the 1999 experiment, 56 groups of five met standing and 55 sitting. They were students solving a well-defined problem in short meetings, and the authors asked for research on longer, less structured ones.",
          "Grupet që qëndruan ulur zgjatën 34% më shumë dhe nuk morën vendime më të mira. Te eksperimenti i 1999, 56 grupe me nga pesë veta u takuan në këmbë dhe 55 ulur. Ishin studentë që zgjidhnin një problem të përcaktuar qartë në takime të shkurtra, dhe autorët kërkuan kërkime për takime më të gjata dhe më pak të strukturuara.",
          "Die sitzenden Gruppen brauchten 34 % länger und trafen keine besseren Entscheidungen. Im Experiment von 1999 trafen sich 56 Gruppen zu je fünf Personen im Stehen und 55 im Sitzen. Es waren Studierende, die in kurzen Meetings ein klar umrissenes Problem lösten, und die Autoren forderten Forschung zu längeren, weniger strukturierten Meetings.") },
        { type: "p", text: x(
          "In 2022 researchers looked at 76 companies with more than 1,000 employees that had introduced between one and five meeting-free days a week. With one such day, employees reported more autonomy, communication, engagement and satisfaction, and less micromanagement and stress. These were their own ratings, not an experiment.",
          "Në 2022, studiuesit panë 76 kompani me mbi 1.000 punonjës që kishin futur nga një deri në pesë ditë pa takime në javë. Me një ditë të tillë, punonjësit raportuan më shumë autonomi, komunikim, angazhim dhe kënaqësi, dhe më pak mikromenaxhim dhe stres. Ishin vlerësimet e tyre, jo eksperiment.",
          "2022 untersuchten Forschende 76 Unternehmen mit mehr als 1.000 Beschäftigten, die zwischen einem und fünf meetingfreien Tagen pro Woche eingeführt hatten. Mit einem solchen Tag berichteten die Beschäftigten mehr Autonomie, Kommunikation, Engagement und Zufriedenheit sowie weniger Mikromanagement und Stress. Es waren ihre eigenen Einschätzungen, kein Experiment.") },
        { type: "callout", reading: true, text: x(
          "Both studies change the default, not the people: fewer chairs, fewer free slots. That is easier to keep than a promise to meet better.",
          "Të dyja studimet ndryshojnë rregullin e paracaktuar, jo njerëzit: më pak karrige, më pak vende të lira në kalendar. Kjo mbahet më lehtë se një premtim për takime më të mira.",
          "Beide Studien ändern die Voreinstellung, nicht die Menschen: weniger Stühle, weniger freie Termine. Das hält leichter als das Versprechen, besser zu tagen.") },
      ],
      source: ["bluedorn-1999", "laker-2022"],
    },
    {
      id: "measure",
      kicker: x("How it is measured", "Si matet", "Wie man es misst"),
      title: [x("What one meeting", "Sa kushton", "Was ein Meeting"), x("costs", "një takim", "kostet")],
      lead: x(
        "Bain's 300,000 hours came from a simple sum: people times hours times weeks, plus the meetings that prepare it. The same sum works for any team.",
        "300.000 orët e Bain dolën nga një llogari e thjeshtë: njerëzit herë orët herë javët, plus takimet që e përgatisin. E njëjta llogari vlen për çdo ekip.",
        "Bains 300.000 Stunden kamen aus einer einfachen Rechnung: Menschen mal Stunden mal Wochen, plus die Meetings zur Vorbereitung. Dieselbe Rechnung gilt für jedes Team."),
      blocks: [
        { type: "steps", items: [
          { h: x("List the recurring meetings", "Rendit takimet që përsëriten", "Die wiederkehrenden Meetings auflisten"), p: x("Name, length, how often, who attends.", "Emri, gjatësia, sa shpesh, kush merr pjesë.", "Name, Länge, wie oft, wer teilnimmt.") },
          { h: x("Multiply", "Shumëzo", "Multiplizieren"), p: x("People × hours × meetings a year.", "Njerëzit × orët × takimet në vit.", "Personen × Stunden × Meetings pro Jahr.") },
          { h: x("Ask what it decided", "Pyet çfarë vendosi", "Fragen, was es entschieden hat"), p: x("The decisions of the last four sessions. If there were none, send the update in writing.", "Vendimet e katër takimeve të fundit. Nëse s'pati asnjë, dërgoje informimin me shkrim.", "Die Entscheidungen der letzten vier Sitzungen. Gab es keine, das Update schriftlich schicken.") },
          { h: x("Change one meeting", "Ndrysho një takim", "Ein Meeting ändern"), p: x("Shorter, fewer people or standing, and check again in a month.", "Më i shkurtër, më pak njerëz ose në këmbë, dhe kontrollo sërish pas një muaji.", "Kürzer, weniger Personen oder im Stehen, und nach einem Monat erneut prüfen.") },
        ] },
        { type: "example", label: x("Hypothetical example, a weekly team meeting", "Shembull hipotetik, një takim javor ekipi", "Hypothetisches Beispiel, ein wöchentliches Teammeeting"), rows: [
          { k: x("People", "Njerëz", "Personen"), v: "8" },
          { k: x("Length", "Gjatësia", "Länge"), v: x("1.5 hours", "1,5 orë", "1,5 Stunden") },
          { k: x("Meetings a year", "Takime në vit", "Meetings pro Jahr"), v: "46" },
          { k: x("Total", "Gjithsej", "Insgesamt"), v: x("552 hours a year", "552 orë në vit", "552 Stunden pro Jahr") },
        ], text: x("About a third of one person's working year, before any preparation. The numbers are invented.", "Rreth një e treta e vitit të punës së një personi, pa llogaritur përgatitjen. Numrat janë të shpikur.", "Etwa ein Drittel des Arbeitsjahres einer Person, ohne Vorbereitung. Die Zahlen sind erfunden.") },
      ],
      note: x("The steps and the example are the editors'.", "Hapat dhe shembulli janë të redaksisë.", "Schritte und Beispiel stammen von der Redaktion."),
      source: ["mankins-2014"],
    },
    {
      id: "tool",
      kicker: x("Tool of the issue", "Mjeti i numrit", "Werkzeug der Ausgabe"),
      title: [x("The", "Karta", "Die"), x("decision card", "e vendimit", "Entscheidungskarte")],
      lead: x(
        "One card for a meeting that has to decide. Send it before the meeting; fill in the last lines before anyone leaves the room.",
        "Një kartë për takimin që duhet të vendosë. Dërgoje para takimit; plotëso rreshtat e fundit para se të dalë kushdo nga salla.",
        "Eine Karte für ein Meeting, das entscheiden muss. Vorher verschicken; die letzten Zeilen ausfüllen, bevor jemand den Raum verlässt."),
      blocks: [
        { type: "form", items: [
          { h: x("The question", "Pyetja", "Die Frage"), hint: x("one sentence that ends with a question mark", "një fjali që mbaron me pikëpyetje", "ein Satz, der mit einem Fragezeichen endet") },
          { h: x("Who decides", "Kush vendos", "Wer entscheidet"), hint: x("one name, as in No. 8", "një emër, si te Nr. 8", "ein Name, wie in Nr. 8") },
          { h: x("Who is heard first", "Kush dëgjohet më parë", "Wer vorher gehört wird"), hint: x("and who only needs the result", "dhe kujt i duhet vetëm rezultati", "und wer nur das Ergebnis braucht") },
          { h: x("Options on the table", "Mundësitë në tryezë", "Optionen auf dem Tisch"), lines: 2 },
          { h: x("The decision", "Vendimi", "Die Entscheidung"), hint: x("in one sentence, with the reason", "në një fjali, me arsyen", "in einem Satz, mit Begründung") },
          { h: x("Who does what, by when", "Kush bën çfarë, deri kur", "Wer macht was, bis wann"), lines: 2 },
        ] },
      ],
      note: x(
        "A practice proposed by the editors. The decision roles follow No. 8 of the Management Review.",
        "Praktikë e propozuar nga redaksia. Rolet e vendimit ndjekin Nr. 8 të Management Review.",
        "Eine Praxis, die die Redaktion vorschlägt. Die Entscheidungsrollen folgen Nr. 8 der Management Review."),
    },
    { id: "sources", type: "sources" },
    { id: "back", type: "back" },
  ],
};
