// Management Review, No. 18: The rhythm of management: the day, the week, the month. Block: Strategy.
// Facts and their sources: docs/revista/management-review-nr-18.md.
import { x, pc } from "../common.js";

export default {
  number: 18,
  block: "strategy",
  date: x("October 2026", "Tetor 2026", "Oktober 2026"),
  theme: [x("The rhythm of management:", "Ritmi i menaxhimit:", "Der Takt der Führung:"), x("the day, the week, the month", "dita, java, muaji", "Tag, Woche, Monat")],
  sub: x(
    "How fragmented a manager's day is, where the time of chief executives goes, the daily, weekly and monthly routines that give it a shape, and a card for your own rhythm.",
    "Sa e copëtuar është dita e një menaxheri, ku shkon koha e drejtuesve të lartë, rutinat ditore, javore dhe mujore që i japin formë, dhe një kartë për ritmin tënd.",
    "Wie zerstückelt der Tag einer Führungskraft ist, wohin die Zeit von Vorstandschefs geht, die täglichen, wöchentlichen und monatlichen Routinen, die ihm Form geben, und eine Karte für den eigenen Takt."),
  seo: x(
    "The rhythm of management: Mintzberg's nine minutes, how 27 CEOs spent 60,000 hours, leader standard work, daily huddles and a card for your own rhythm.",
    "Ritmi i menaxhimit: nëntë minutat e Mintzberg, 60.000 orët e 27 CEO-ve, puna standarde e drejtuesit, takimet ditore dhe karta e ritmit tënd.",
    "Der Takt der Führung: Mintzbergs neun Minuten, die 60.000 Stunden von 27 CEOs, Standardarbeit für Führungskräfte, Huddles und eine Karte für den Takt."),
  feature: x(
    "Issue 18 starts with Henry Mintzberg's finding that half of what chief executives did lasted less than nine minutes, follows 27 CEOs through 60,000 hours, describes the daily, weekly and monthly routines that Lean and Andy Grove propose, looks at what daily huddles have shown in a hospital, and ends with a card for your own rhythm.",
    "Numri 18 nis me gjetjen e Henry Mintzberg se gjysma e asaj që bënin drejtuesit e lartë zgjaste më pak se nëntë minuta, ndjek 27 CEO nëpër 60.000 orë, përshkruan rutinat ditore, javore dhe mujore që propozojnë Lean-i dhe Andy Grove, shikon çfarë treguan takimet e shkurtra ditore në një spital, dhe mbyllet me një kartë për ritmin tënd.",
    "Ausgabe 18 beginnt mit Henry Mintzbergs Befund, dass die Hälfte dessen, was Vorstandschefs taten, weniger als neun Minuten dauerte, begleitet 27 CEOs durch 60.000 Stunden, beschreibt die täglichen, wöchentlichen und monatlichen Routinen, die Lean und Andy Grove vorschlagen, betrachtet, was kurze tägliche Runden in einer Klinik gezeigt haben, und endet mit einer Karte für den eigenen Takt."),
  figure: { n: x("< 9 min", "< 9 min", "< 9 Min."), by: "Mintzberg, 1975", t: x(
    "was how long half of the activities of the chief executives Mintzberg observed lasted; one in ten went past an hour.",
    "zgjati gjysma e aktiviteteve të drejtuesve të lartë që vëzhgoi Mintzberg; vetëm një në dhjetë kaloi një orë.",
    "dauerte die Hälfte der Tätigkeiten der Vorstandschefs, die Mintzberg beobachtete; nur jede zehnte über eine Stunde.") },
  teasers: [
    { page: "story", kicker: x("Cover story", "Tema kryesore", "Titelthema"),
      title: x("Nine minutes", "Nëntë minuta", "Neun Minuten") },
    { page: "model", kicker: x("The model", "Modeli", "Das Modell"),
      title: x("A rhythm in three beats", "Një ritëm në tri kohë", "Ein Takt in drei Schlägen") },
    { page: "tool", kicker: x("Tool of the week", "Mjeti i javës", "Werkzeug der Woche"),
      title: x("The rhythm card", "Karta e ritmit", "Die Taktkarte") },
  ],
  sources: ["mintzberg-1975", "porter-nohria-2018", "mann-2005", "mann-2006", "grove-1983", "goldenhar-2013", "brady-2013"],
  pages: [
    { id: "cover", type: "cover" },
    {
      id: "intro", type: "intro",
      why: x(
        "A manager's week fills itself: calls, questions, problems that cannot wait. This issue is about the few fixed routines that keep the important things from being crowded out: a short daily check, a weekly conversation, a monthly look back.",
        "Java e një menaxheri mbushet vetë: telefonata, pyetje, probleme që s'presin. Ky numër flet për pak rutina të fiksuara që nuk i lënë gjërat e rëndësishme të mbyten: një kontroll i shkurtër ditor, një bisedë javore, një vështrim mujor pas.",
        "Die Woche einer Führungskraft füllt sich von selbst: Anrufe, Fragen, Probleme, die nicht warten. Diese Ausgabe handelt von den wenigen festen Routinen, die verhindern, dass das Wichtige verdrängt wird: ein kurzer täglicher Check, ein wöchentliches Gespräch, ein monatlicher Rückblick."),
      body: x(
        "Henry Mintzberg found that most of what chief executives did lasted minutes, not hours. Decades later, 27 CEOs spent 72% of their working time in meetings. Lean answers with standard work for leaders and short daily meetings in tiers; Andy Grove with a one-to-one of at least an hour. In a children's hospital, daily huddles were part of an effort that almost halved one kind of serious event, though never on their own.",
        "Henry Mintzberg gjeti se shumica e asaj që bënin drejtuesit e lartë zgjaste minuta, jo orë. Dekada më vonë, 27 CEO kaluan 72% të kohës së punës në takime. Lean-i përgjigjet me punë standarde për drejtuesit dhe me takime të shkurtra ditore në nivele; Andy Grove me një bisedë një me një që zgjat të paktën një orë. Në një spital pediatrik, takimet ditore ishin pjesë e një përpjekjeje që pothuajse përgjysmoi një lloj ngjarjeje të rëndë, por kurrë vetëm me to.",
        "Henry Mintzberg fand, dass das meiste, was Vorstandschefs taten, Minuten dauerte, nicht Stunden. Jahrzehnte später verbrachten 27 CEOs 72 % ihrer Arbeitszeit in Meetings. Lean antwortet mit Standardarbeit für Führungskräfte und kurzen täglichen Runden in Stufen, Andy Grove mit einem Einzelgespräch von mindestens einer Stunde. In einer Kinderklinik waren tägliche Runden Teil einer Initiative, die eine Art schwerer Ereignisse fast halbierte; eingesetzt wurden sie nie allein."),
    },
    {
      id: "story",
      kicker: x("Cover story", "Tema kryesore", "Titelthema"),
      title: [x("Nine", "Nëntë", "Neun"), x("minutes", "minuta", "Minuten")],
      lead: x(
        "Henry Mintzberg followed five chief executives for a week each and recorded everything they did. In 1975 he summed up what he had seen in Harvard Business Review.",
        "Henry Mintzberg ndoqi pesë drejtues të lartë për një javë secilin dhe shënoi gjithçka që bënë. Në 1975 e përmblodhi atë që kishte parë te Harvard Business Review.",
        "Henry Mintzberg begleitete fünf Vorstandschefs je eine Woche lang und hielt alles fest, was sie taten. 1975 fasste er in der Harvard Business Review zusammen, was er gesehen hatte."),
      blocks: [
        { type: "quote", text: x(
          "Half the activities engaged in by the five chief executives of my study lasted less than nine minutes, and only 10% exceeded one hour.",
          "Gjysma e aktiviteteve të pesë drejtuesve të studimit tim zgjati më pak se nëntë minuta, dhe vetëm 10% kaluan një orë.",
          "Die Hälfte der Tätigkeiten der fünf Vorstandschefs meiner Studie dauerte weniger als neun Minuten, und nur 10 % länger als eine Stunde.") },
        { type: "figures", compact: true, items: [
          { n: "5", t: x("chief executives, one week each", "drejtues të lartë, një javë secili", "Vorstandschefs, je eine Woche") },
          { n: x("½", "½", "½"), t: x("of their activities lasted less than nine minutes", "e aktiviteteve të tyre zgjati më pak se nëntë minuta", "ihrer Tätigkeiten dauerte weniger als neun Minuten") },
          { n: pc(10), t: x("lasted more than an hour", "zgjatën më shumë se një orë", "dauerten länger als eine Stunde") },
        ] },
        { type: "p", text: x(
          "Mintzberg set the folklore of the calm, systematic planner against what he saw: work that was brief, varied and constantly interrupted, and that leaned towards action rather than reflection.",
          "Mintzberg e vuri përballë mitit të planifikuesit të qetë dhe sistematik atë që pa: punë të shkurtër, të larmishme dhe të ndërprerë vazhdimisht, që anonte nga veprimi më shumë se nga reflektimi.",
          "Mintzberg stellte der Legende vom ruhigen, systematischen Planer gegenüber, was er sah: kurze, vielfältige, ständig unterbrochene Arbeit, die eher zum Handeln als zum Nachdenken neigte.") },
        { type: "callout", reading: true, text: x(
          "If the day is cut into nine-minute pieces, the important things need fixed places. Otherwise the urgent ones take them all.",
          "Nëse dita pritet në copa nëntëminutëshe, gjërat e rëndësishme kanë nevojë për vende të fiksuara. Përndryshe i zënë të gjitha gjërat urgjente.",
          "Wenn der Tag in Neun-Minuten-Stücke zerfällt, braucht das Wichtige feste Plätze. Sonst nimmt das Dringende sie alle.") },
      ],
      source: ["mintzberg-1975"],
    },
    {
      id: "numbers",
      kicker: x("The numbers", "Shifrat", "Die Zahlen"),
      title: [x("Where 60,000 hours", "Ku shkuan", "Wohin 60.000 Stunden"), x("went", "60.000 orë", "gingen")],
      lead: x(
        "Michael Porter and Nitin Nohria had the assistants of 27 CEOs log their time, around the clock, in 15-minute blocks, for 13 weeks: nearly 60,000 hours. The CEOs worked 62.5 hours a week on average.",
        "Michael Porter dhe Nitin Nohria u kërkuan asistentëve të 27 CEO-ve të regjistronin kohën e tyre, ditë e natë, në blloqe 15-minutëshe, për 13 javë: afro 60.000 orë. CEO-të punuan mesatarisht 62,5 orë në javë.",
        "Michael Porter und Nitin Nohria ließen die Assistenzen von 27 CEOs deren Zeit rund um die Uhr in 15-Minuten-Blöcken erfassen, 13 Wochen lang: fast 60.000 Stunden. Die CEOs arbeiteten im Schnitt 62,5 Stunden pro Woche."),
      blocks: [
        { type: "hbars", max: 30, source: ["porter-nohria-2018"],
          label: x("Share of the CEOs' working time", "Pjesa e kohës së punës së CEO-ve", "Anteil an der Arbeitszeit der CEOs"),
          items: [
            { k: x("Reviews of units and functions", "Rishikime të njësive dhe funksioneve", "Reviews von Einheiten und Funktionen"), v: 25, n: pc(25), alert: true },
            { k: x("People and relationships", "Njerëzit dhe marrëdhëniet", "Menschen und Beziehungen"), v: 25, n: pc(25), alert: true },
            { k: x("Strategy", "Strategjia", "Strategie"), v: 21, n: pc(21) },
            { k: x("Organisation and culture", "Organizata dhe kultura", "Organisation und Kultur"), v: 16, n: pc(16) },
          ] },
        { type: "figures", compact: true, items: [
          { n: pc(72), t: x("of working time in meetings", "e kohës së punës në takime", "der Arbeitszeit in Meetings") },
          { n: pc(43), t: x("on work that advanced their own agenda", "në punë që çonte përpara axhendën e tyre", "für Arbeit an der eigenen Agenda") },
          { n: pc(36), t: x("reacting to issues as they came up", "duke reaguar ndaj çështjeve që lindnin", "als Reaktion auf aufkommende Themen") },
        ] },
        { type: "callout", reading: true, text: x(
          "Even at the top, more than a third of the time goes to reacting. A fixed rhythm is what keeps the rest from going the same way.",
          "Edhe në krye, mbi një e treta e kohës shkon në reagim. Ritmi i fiksuar është ai që nuk e lë pjesën tjetër të shkojë po njësoj.",
          "Selbst an der Spitze geht mehr als ein Drittel der Zeit ins Reagieren. Ein fester Takt verhindert, dass der Rest denselben Weg geht.") },
      ],
      note: x(
        "The four areas are shares of all working time and do not add up to 100%.",
        "Katër fushat janë pjesë të gjithë kohës së punës dhe nuk mblidhen në 100%.",
        "Die vier Bereiche sind Anteile an der gesamten Arbeitszeit und ergeben zusammen nicht 100 %."),
      source: ["porter-nohria-2018"],
    },
    {
      id: "model", more: "ten-minutes-before-the-shift",
      kicker: x("The model", "Modeli", "Das Modell"),
      title: [x("A rhythm in", "Një ritëm", "Ein Takt in"), x("three beats", "në tri kohë", "drei Schlägen")],
      lead: x(
        "In Creating a Lean Culture, David Mann names four elements of lean management: standard work for leaders, visual controls, a daily accountability process and discipline. Andy Grove adds the weekly conversation.",
        "Te Creating a Lean Culture, David Mann përmend katër elemente të menaxhimit lean: punën standarde për drejtuesit, kontrollet vizuale, procesin e përgjegjshmërisë ditore dhe disiplinën. Andy Grove shton bisedën javore.",
        "In Creating a Lean Culture nennt David Mann vier Elemente des Lean Managements: Standardarbeit für Führungskräfte, visuelle Steuerung, einen täglichen Rechenschaftsprozess und Disziplin. Andy Grove ergänzt das wöchentliche Gespräch."),
      blocks: [
        { type: "rows", compact: true, items: [
          { h: x("The day: short meetings in tiers", "Dita: takime të shkurtra në nivele", "Der Tag: kurze Runden in Stufen"), p: x("The team at the start of the shift, then the supervisors, then the managers: a problem travels up the same morning.", "Ekipi në fillim të turnit, pastaj mbikëqyrësit, pastaj menaxherët: problemi ngjitet lart po atë mëngjes.", "Das Team zu Schichtbeginn, dann die Vorgesetzten, dann die Leitung: Ein Problem wandert noch am selben Morgen nach oben.") },
          { h: x("The week: one-to-ones", "Java: biseda një me një", "Die Woche: Einzelgespräche"), p: x("At least an hour, with an agenda the employee prepares; more often with someone new to the task, less often with a veteran.", "Të paktën një orë, me rend dite që e përgatit punonjësi; më shpesh me dikë të ri në detyrë, më rrallë me dikë me përvojë.", "Mindestens eine Stunde, mit einer Agenda, die die Person vorbereitet; öfter mit jemandem, der neu in der Aufgabe ist, seltener mit Erfahrenen.") },
          { h: x("The month: a look back", "Muaji: një vështrim pas", "Der Monat: ein Rückblick"), p: x("The numbers of the month, what the daily meetings kept bringing up, and one change for the next month.", "Shifrat e muajit, çfarë sillnin vazhdimisht takimet ditore, dhe një ndryshim për muajin tjetër.", "Die Zahlen des Monats, was in den täglichen Runden immer wieder auftauchte, und eine Änderung für den nächsten Monat.") },
        ] },
        { type: "p", text: x(
          "Mann estimated that standard work fills about 80% of a team leader's day. Higher up it fills less, and more of the time goes to following up the level below.",
          "Mann vlerësoi se puna standarde mbush rreth 80% të ditës së një drejtuesi ekipi. Më lart mbush më pak, dhe më shumë kohë shkon për të ndjekur nivelin poshtë.",
          "Mann schätzte, dass Standardarbeit etwa 80 % des Tages einer Teamleitung ausfüllt. Weiter oben ist es weniger, und mehr Zeit geht in die Nachverfolgung der Ebene darunter.") },
        { type: "callout", reading: true, text: x(
          "A rhythm is not more meetings. It is fewer, at fixed times, each with one job.",
          "Ritmi nuk është më shumë takime. Është më pak, në orë të fiksuara, secili me një punë.",
          "Ein Takt heißt nicht mehr Meetings, sondern weniger: zu festen Zeiten, jedes mit einer Aufgabe.") },
      ],
      note: x(
        "The day follows Mann, the week Grove; the monthly look back is the editors'.",
        "Dita ndjek Mann, java Grove; vështrimi mujor është i redaksisë.",
        "Der Tag folgt Mann, die Woche Grove; der monatliche Rückblick stammt von der Redaktion."),
      source: ["mann-2005", "mann-2006", "grove-1983"],
    },
    {
      id: "research",
      kicker: x("What the research says", "Çfarë thotë kërkimi", "Was die Forschung sagt"),
      title: [x("What a daily", "Çfarë mund të bëjë", "Was eine tägliche"), x("huddle can do", "takimi ditor", "Runde leisten kann")],
      lead: x(
        "A children's hospital with 539 beds introduced short daily meetings in three tiers: on the wards, among managers and among leaders. They looked ahead at risks, reported safety events and moved resources where they were needed.",
        "Një spital pediatrik me 539 shtretër futi takime të shkurtra ditore në tri nivele: në pavijone, mes menaxherëve dhe mes drejtuesve. Shikonin rreziqet përpara, raportonin ngjarjet e sigurisë dhe lëviznin burimet aty ku duheshin.",
        "Eine Kinderklinik mit 539 Betten führte kurze tägliche Runden in drei Stufen ein: auf den Stationen, unter den Leitungen und in der Klinikleitung. Sie schauten auf Risiken voraus, meldeten Sicherheitsereignisse und verlagerten Ressourcen dorthin, wo sie gebraucht wurden."),
      blocks: [
        { type: "columns", max: 5, height: 90, source: ["brady-2013"],
          label: x("Unrecognised deterioration ending in intensive care, per 10,000 patient days", "Përkeqësime të pavëna re që përfunduan në terapi intensive, për 10.000 ditë shtrimi", "Unerkannte Verschlechterungen mit Verlegung auf die Intensivstation, je 10.000 Patiententage"),
          items: [
            { k: x("Before", "Para", "Vorher"), v: 4.4, n: x("4.4", "4,4", "4,4"), alert: true },
            { k: x("After", "Pas", "Nachher"), v: 2.4, n: x("2.4", "2,4", "2,4") },
          ] },
        { type: "p", text: x(
          "The fall came from a bundle of measures: spotting risk early, frequent huddles of the whole care team, and ways of learning from each event. There was no control group, so the share of the huddles cannot be separated. A second study of the same hospital, based on 10 interviews and 6 focus groups, described how the huddles worked but measured no outcome.",
          "Rënia erdhi nga një paketë masash: dallimi i hershëm i rrezikut, takime të shpeshta të gjithë ekipit të kujdesit, dhe mënyra për të mësuar nga çdo ngjarje. Nuk pati grup kontrolli, prandaj kontributi i takimeve nuk mund të veçohet. Një studim i dytë në të njëjtin spital, me 10 intervista dhe 6 grupe diskutimi, përshkroi si funksiononin takimet, por nuk mati asnjë rezultat.",
          "Der Rückgang kam aus einem Bündel von Maßnahmen: Risiken früh erkennen, häufige Runden des ganzen Behandlungsteams und Wege, aus jedem Ereignis zu lernen. Eine Kontrollgruppe gab es nicht, daher lässt sich der Anteil der Runden nicht herausrechnen. Eine zweite Studie derselben Klinik, mit 10 Interviews und 6 Fokusgruppen, beschrieb, wie die Runden funktionierten, maß aber kein Ergebnis.") },
        { type: "callout", reading: true, text: x(
          "A daily huddle is cheap. Its value is in what happens after it: the problem that someone takes away and closes.",
          "Takimi ditor kushton pak. Vlera e tij është te ajo që ndodh pas tij: problemi që dikush e merr me vete dhe e mbyll.",
          "Eine tägliche Runde kostet wenig. Ihr Wert liegt in dem, was danach geschieht: dem Problem, das jemand mitnimmt und abschließt.") },
      ],
      source: ["brady-2013", "goldenhar-2013"],
    },
    {
      id: "measure",
      kicker: x("How it is measured", "Si matet", "Wie man es misst"),
      title: [x("Check the rhythm,", "Kontrollo ritmin,", "Den Takt prüfen,"), x("not the calendar", "jo kalendarin", "nicht den Kalender")],
      lead: x(
        "In Mann's system, standard work is written down and the level above checks whether it happened. The same works for your own routines.",
        "Në sistemin e Mann, puna standarde shkruhet dhe niveli sipër kontrollon nëse u bë. E njëjta gjë vlen për rutinat e tua.",
        "In Manns System wird Standardarbeit aufgeschrieben, und die Ebene darüber prüft, ob sie stattfand. Dasselbe funktioniert für die eigenen Routinen."),
      blocks: [
        { type: "steps", items: [
          { h: x("Write the routines down", "Shkruaji rutinat", "Die Routinen aufschreiben"), p: x("Each beat with a time, a place and an owner.", "Secila me orë, vend dhe përgjegjës.", "Jeder Schlag mit Zeit, Ort und Verantwortung.") },
          { h: x("Mark each one, every day", "Shëno secilën, çdo ditë", "Jede abhaken, jeden Tag"), p: x("Held or not, in one line.", "U bë apo jo, në një rresht.", "Stattgefunden oder nicht, in einer Zeile.") },
          { h: x("Count once a month", "Numëro një herë në muaj", "Einmal im Monat zählen"), p: x("The share held, and why the others fell away.", "Sa u mbajtën, dhe pse jo të tjerat.", "Den Anteil, der stattfand, und warum der Rest ausfiel.") },
          { h: x("Change one thing", "Ndrysho një gjë", "Eine Sache ändern"), p: x("Move, shorten or drop the routine that keeps failing.", "Zhvendos, shkurto ose hiq rutinën që dështon vazhdimisht.", "Die Routine, die ständig ausfällt, verschieben, kürzen oder streichen.") },
        ] },
        { type: "example", label: x("Hypothetical example, a shift lead's month", "Shembull hipotetik, muaji i një drejtuesi turni", "Hypothetisches Beispiel, der Monat einer Schichtleitung"), rows: [
          { k: x("Daily", "Ditore", "Täglich"), v: x("19 of 22 meetings held", "19 nga 22 takime u mbajtën", "19 von 22 Runden fanden statt") },
          { k: x("Weekly", "Javore", "Wöchentlich"), v: x("5 of 8 one-to-ones held", "5 nga 8 biseda u mbajtën", "5 von 8 Einzelgesprächen fanden statt") },
          { k: x("Monthly", "Mujore", "Monatlich"), v: x("1 of 1 review held", "1 nga 1 rishikim u mbajt", "1 von 1 Rückblick fand statt") },
        ], text: x("The weekly beat is the one that breaks, so that is where the change goes. The numbers are invented.", "Rutina javore është ajo që prishet, prandaj aty shkon ndryshimi. Numrat janë të shpikur.", "Der wöchentliche Schlag ist der, der hakt, also setzt dort die Änderung an. Die Zahlen sind erfunden.") },
      ],
      note: x("The steps and the example are the editors'.", "Hapat dhe shembulli janë të redaksisë.", "Schritte und Beispiel stammen von der Redaktion."),
      source: ["mann-2006"],
    },
    {
      id: "tool", tool: "/tools/shift-pulse/",
      kicker: x("Tool of the week", "Mjeti i javës", "Werkzeug der Woche"),
      title: [x("The", "Karta", "Die"), x("rhythm card", "e ritmit", "Taktkarte")],
      lead: x(
        "One card for the routines of your role. Fill it in once, keep it where you work, and check it at the end of each week.",
        "Një kartë për rutinat e rolit tënd. Plotësoje një herë, mbaje aty ku punon, dhe kontrolloje në fund të çdo jave.",
        "Eine Karte für die Routinen der eigenen Rolle. Einmal ausfüllen, am Arbeitsplatz aufbewahren und am Ende jeder Woche prüfen."),
      blocks: [
        { type: "form", items: [
          { h: x("Every day", "Çdo ditë", "Jeden Tag"), hint: x("time, place, ten minutes, who attends", "ora, vendi, dhjetë minuta, kush merr pjesë", "Zeit, Ort, zehn Minuten, wer teilnimmt") },
          { h: x("What the daily meeting looks at", "Çfarë shikon takimi ditor", "Worauf die tägliche Runde schaut"), hint: x("safety, yesterday's numbers, today's risks", "siguria, shifrat e djeshme, rreziqet e sotme", "Sicherheit, die Zahlen von gestern, die Risiken von heute") },
          { h: x("Every week", "Çdo javë", "Jede Woche"), hint: x("one-to-ones: with whom, how long, who brings the agenda", "biseda një me një: me kë, sa gjatë, kush sjell rendin e ditës", "Einzelgespräche: mit wem, wie lange, wer die Agenda mitbringt"), lines: 2 },
          { h: x("Every month", "Çdo muaj", "Jeden Monat"), hint: x("the review: which numbers, which question", "rishikimi: cilat shifra, cila pyetje", "der Rückblick: welche Zahlen, welche Frage") },
          { h: x("What I stop doing", "Çfarë nuk bëj më", "Was ich nicht mehr tue"), hint: x("to make room for the routines", "që t'u bëj vend rutinave", "um Platz für die Routinen zu schaffen") },
          { h: x("Who checks me", "Kush më kontrollon", "Wer mich prüft"), hint: x("the person who sees whether the routines happened", "personi që sheh nëse rutinat u bënë", "die Person, die sieht, ob die Routinen stattfanden") },
        ] },
      ],
      note: x(
        "A practice proposed by the editors, after Mann's daily accountability and Grove's one-to-ones.",
        "Praktikë e propozuar nga redaksia, sipas përgjegjshmërisë ditore të Mann dhe bisedave një me një të Grove.",
        "Eine Praxis, die die Redaktion vorschlägt, nach Manns täglicher Rechenschaft und Groves Einzelgesprächen."),
      source: ["mann-2005", "grove-1983"],
    },
    { id: "sources", type: "sources" },
    { id: "back", type: "back" },
  ],
};
