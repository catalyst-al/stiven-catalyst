// Management Review, No. 18: The rhythm of management: the day, the week, the month. Block: Strategy.
// Facts and their sources: docs/revista/management-review-nr-18.md.
import { x, pc } from "../common.js";

export default {
  number: 18,
  block: "strategy",
  date: x("October 2026", "Tetor 2026", "Oktober 2026"),
  theme: [x("The rhythm of management:", "Ritmi i menaxhimit:", "Der Rhythmus der Führung:"), x("the day, the week, the month", "dita, java, muaji", "Tag, Woche, Monat")],
  sub: x(
    "How fragmented a manager's day is, where chief executives' time goes, the daily, weekly and monthly routines that give it a shape, and a card for your own rhythm.",
    "Sa e copëtuar është dita e një menaxheri, ku shkon koha e drejtuesve të lartë, rutinat ditore, javore dhe mujore që i japin formë, dhe një kartë për ritmin tënd.",
    "Wie zerstückelt der Tag einer Führungskraft ist, wohin die Zeit von Vorstandschefs geht, welche täglichen, wöchentlichen und monatlichen Routinen ihm Form geben, und eine Karte für Ihren eigenen Rhythmus."),
  seo: x(
    "The rhythm of management: Mintzberg's nine minutes, how 27 CEOs spent 60,000 hours, leader standard work, daily huddles and a card for your own rhythm.",
    "Ritmi i menaxhimit: nëntë minutat e Mintzberg-ut, 60.000 orët e 27 CEO-ve, puna standarde e drejtuesit, takimet ditore dhe karta e ritmit tënd.",
    "Der Rhythmus der Führung: Mintzbergs neun Minuten, die 60.000 Stunden von 27 CEOs, Standardarbeit für Führungskräfte, tägliche Runden und eine Karte."),
  feature: x(
    "Half of what the chief executives Henry Mintzberg watched lasted less than nine minutes; decades later, the time of 27 CEOs was logged across 60,000 hours. Issue 18 sets out the daily, weekly and monthly routines that Lean and Andy Grove propose and looks at what daily huddles showed in one hospital. A card for your own rhythm closes it.",
    "Te drejtuesit e lartë që vëzhgoi Henry Mintzberg, gjysma e asaj që bënin zgjaste më pak se nëntë minuta; dekada më vonë, u regjistruan 60.000 orë nga koha e 27 CEO-ve. Numri 18 shtjellon rutinat ditore, javore dhe mujore që propozojnë Lean-i dhe Andy Grove, dhe shikon çfarë treguan takimet e shkurtra ditore në një spital. Në fund vjen një kartë për ritmin tënd.",
    "Die Hälfte dessen, was die von Henry Mintzberg beobachteten Vorstandschefs taten, dauerte keine neun Minuten; Jahrzehnte später wurde die Zeit von 27 CEOs über 60.000 Stunden erfasst. Ausgabe 18 stellt die täglichen, wöchentlichen und monatlichen Routinen vor, die Lean und Andy Grove vorschlagen, und zeigt, was kurze tägliche Runden in einer Klinik gebracht haben. Zum Schluss eine Karte für Ihren eigenen Rhythmus."),
  figure: { n: x("< 9 min", "< 9 min", "< 9 Min."), by: "Mintzberg, 1975", t: x(
    "was how long half of the activities of the chief executives Mintzberg observed lasted; one in ten went past an hour.",
    "zgjati gjysma e aktiviteteve të drejtuesve të lartë që vëzhgoi Mintzberg; një në dhjetë kaloi një orë.",
    "dauerte die Hälfte der Tätigkeiten der Vorstandschefs, die Mintzberg beobachtete; jede zehnte ging über eine Stunde hinaus.") },
  teasers: [
    { page: "story", kicker: x("Cover story", "Tema kryesore", "Titelthema"),
      title: x("Nine minutes", "Nëntë minuta", "Neun Minuten") },
    { page: "model", kicker: x("The model", "Modeli", "Das Modell"),
      title: x("A rhythm in three beats", "Një ritëm në tri kohë", "Ein Rhythmus aus drei Takten") },
    { page: "tool", kicker: x("Tool of the issue", "Mjeti i numrit", "Werkzeug der Ausgabe"),
      title: x("The rhythm card", "Karta e ritmit", "Die Rhythmuskarte") },
  ],
  sources: ["mintzberg-1975", "porter-nohria-2018", "mann-2005", "mann-2006", "grove-1983", "goldenhar-2013", "brady-2013"],
  pages: [
    { id: "cover", type: "cover" },
    {
      id: "intro", type: "intro",
      why: x(
        "A manager's week fills itself: calls, questions, problems that cannot wait. A few fixed routines keep the important things from being crowded out: a short daily check, a weekly conversation, a monthly look back.",
        "Java e një menaxheri mbushet vetë: telefonata, pyetje, probleme që s'presin. Pak rutina të fiksuara nuk i lënë gjërat e rëndësishme të mbyten: një kontroll i shkurtër ditor, një bisedë javore, një vështrim mujor pas.",
        "Die Woche einer Führungskraft füllt sich von selbst: Anrufe, Fragen, Probleme, die nicht warten können. Einige wenige feste Routinen verhindern, dass das Wichtige dabei untergeht: ein kurzer täglicher Check, ein wöchentliches Gespräch, ein monatlicher Rückblick."),
      body: x(
        "Henry Mintzberg found that most of what chief executives did lasted minutes, not hours. Decades later, 27 CEOs spent 72% of their working time in meetings. Lean answers with standard work for leaders and short daily meetings in tiers; Andy Grove with a one-to-one of at least an hour. In a children's hospital, daily huddles were part of an effort that almost halved one kind of serious event, though never on their own.",
        "Henry Mintzberg gjeti se shumica e asaj që bënin drejtuesit e lartë zgjaste minuta, jo orë. Dekada më vonë, 27 CEO kaluan 72% të kohës së punës në takime. Lean-i përgjigjet me punë standarde për drejtuesit dhe me takime të shkurtra ditore në nivele; Andy Grove me një bisedë një me një që zgjat të paktën një orë. Në një spital pediatrik, takimet ditore ishin pjesë e një përpjekjeje që pothuajse përgjysmoi një lloj ngjarjeje të rëndë, por gjithmonë bashkë me masa të tjera.",
        "Henry Mintzberg stellte fest, dass das meiste, was Vorstandschefs taten, Minuten dauerte, nicht Stunden. Jahrzehnte später verbrachten 27 CEOs 72 % ihrer Arbeitszeit in Besprechungen. Lean antwortet mit Standardarbeit für Führungskräfte und kurzen täglichen Runden in Stufen, Andy Grove mit einem Einzelgespräch von mindestens einer Stunde. In einer Kinderklinik gehörten tägliche Runden zu einer Initiative, die eine Art schwerer Ereignisse fast halbierte; allein standen sie dabei nie."),
    },
    {
      id: "story",
      kicker: x("Cover story", "Tema kryesore", "Titelthema"),
      title: [x("Nine", "Nëntë", "Neun"), x("minutes", "minuta", "Minuten")],
      lead: x(
        "Henry Mintzberg spent a week with each of five chief executives and recorded everything they did. In 1975 he summed up what he had seen in Harvard Business Review.",
        "Henry Mintzberg kaloi nga një javë me secilin prej pesë drejtuesve të lartë dhe shënoi gjithçka që bënë. Në vitin 1975 e përmblodhi atë që kishte parë në Harvard Business Review.",
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
          "Mintzberg e vuri mitin e planifikuesit të qetë dhe sistematik përballë asaj që pa: punë të shkurtër, të larmishme dhe të ndërprerë pa pushim, që anonte më shumë nga veprimi se nga reflektimi.",
          "Mintzberg stellte der Legende vom ruhigen, systematischen Planer gegenüber, was er tatsächlich sah: kurze, vielfältige, ständig unterbrochene Arbeit, die eher zum Handeln als zum Nachdenken neigte.") },
        { type: "callout", reading: true, text: x(
          "When the day is cut into nine-minute pieces, the important things need fixed places, or the urgent ones take every slot.",
          "Kur dita pritet në copa nëntëminutëshe, gjërat e rëndësishme kanë nevojë për vende të fiksuara, përndryshe gjërat urgjente i zënë të gjitha.",
          "Wenn der Tag in Neun-Minuten-Stücke zerfällt, braucht das Wichtige feste Plätze, sonst belegt das Dringende sie alle.") },
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
        "Michael Porter und Nitin Nohria ließen die Assistenzen von 27 CEOs deren Zeit 13 Wochen lang rund um die Uhr in 15-Minuten-Blöcken erfassen: fast 60.000 Stunden. Die CEOs arbeiteten im Schnitt 62,5 Stunden pro Woche."),
      blocks: [
        { type: "hbars", max: 30, source: ["porter-nohria-2018"],
          label: x("Share of the CEOs' working time", "Pjesa e kohës së punës së CEO-ve", "Anteil an der Arbeitszeit der CEOs"),
          items: [
            { k: x("Reviews of units and functions", "Rishikime të njësive dhe funksioneve", "Überprüfung von Einheiten und Funktionen"), v: 25, n: pc(25), alert: true },
            { k: x("People and relationships", "Njerëzit dhe marrëdhëniet", "Menschen und Beziehungen"), v: 25, n: pc(25), alert: true },
            { k: x("Strategy", "Strategjia", "Strategie"), v: 21, n: pc(21) },
            { k: x("Organisation and culture", "Organizata dhe kultura", "Organisation und Kultur"), v: 16, n: pc(16) },
          ] },
        { type: "figures", compact: true, items: [
          { n: pc(72), t: x("of working time in meetings", "e kohës së punës në takime", "der Arbeitszeit in Besprechungen") },
          { n: pc(43), t: x("on work that advanced their own agenda", "në punë që çonte përpara axhendën e tyre", "für Arbeit an der eigenen Agenda") },
          { n: pc(36), t: x("reacting to issues as they came up", "duke reaguar ndaj çështjeve që lindnin", "als Reaktion auf aufkommende Themen") },
        ] },
        { type: "callout", reading: true, text: x(
          "Even at the top, more than a third of the time goes on reacting. A fixed rhythm keeps the rest from going the same way.",
          "Edhe në majë, mbi një e treta e kohës shkon në reagim. Një ritëm i fiksuar nuk e lë pjesën tjetër të marrë të njëjtën rrugë.",
          "Selbst an der Spitze geht mehr als ein Drittel der Zeit ins Reagieren. Ein fester Rhythmus verhindert, dass der Rest denselben Weg nimmt.") },
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
      title: [x("A rhythm in", "Një ritëm", "Ein Rhythmus"), x("three beats", "në tri kohë", "aus drei Takten")],
      lead: x(
        "In Creating a Lean Culture, David Mann names four elements of lean management: standard work for leaders, visual controls, a daily accountability process and discipline. Andy Grove adds the weekly conversation.",
        "Te Creating a Lean Culture, David Mann përmend katër elemente të menaxhimit lean: punën standarde për drejtuesit, kontrollet vizuale, procesin e përgjegjshmërisë ditore dhe disiplinën. Andy Grove shton bisedën javore.",
        "In Creating a Lean Culture nennt David Mann vier Elemente des Lean Managements: Standardarbeit für Führungskräfte, visuelle Steuerung, einen täglichen Rechenschaftsprozess und Disziplin. Andy Grove ergänzt das wöchentliche Gespräch."),
      blocks: [
        { type: "rows", compact: true, items: [
          { h: x("The day: short meetings in tiers", "Dita: takime të shkurtra në nivele", "Der Tag: kurze Runden in Stufen"), p: x("The team at the start of the shift, then the supervisors, then the managers: a problem travels up the same morning.", "Ekipi në fillim të turnit, pastaj mbikëqyrësit, pastaj menaxherët: problemi ngjitet lart po atë mëngjes.", "Erst das Team zu Schichtbeginn, dann die Vorgesetzten, dann die Leitung: Ein Problem wandert noch am selben Morgen nach oben.") },
          { h: x("The week: one-to-ones", "Java: biseda një me një", "Die Woche: Einzelgespräche"), p: x("At least an hour, with an agenda the employee prepares; more often with someone new to the task, less often with a veteran.", "Të paktën një orë, me rend dite që e përgatit punonjësi; më shpesh me dikë të ri në detyrë, më rrallë me dikë me përvojë.", "Mindestens eine Stunde, mit einer Agenda, die der Mitarbeiter oder die Mitarbeiterin vorbereitet; häufiger mit jemandem, der neu in der Aufgabe ist, seltener mit Erfahrenen.") },
          { h: x("The month: a look back", "Muaji: një vështrim pas", "Der Monat: ein Rückblick"), p: x("The numbers of the month, what the daily meetings kept bringing up, and one change for the next month.", "Shifrat e muajit, çfarë dilte vazhdimisht në takimet ditore, dhe një ndryshim për muajin tjetër.", "Die Zahlen des Monats, was in den täglichen Runden immer wieder hochkam, und eine Änderung für den nächsten Monat.") },
        ] },
        { type: "p", text: x(
          "Mann estimated that standard work fills about 80% of a team leader's day. Higher up it fills less, and consists mostly of following up the level below.",
          "Mann-i vlerësoi se puna standarde mbush rreth 80% të ditës së një drejtuesi ekipi. Më lart mbush më pak dhe ka të bëjë kryesisht me ndjekjen e nivelit më poshtë.",
          "Mann schätzte, dass Standardarbeit etwa 80 % des Tages einer Teamleitung ausfüllt. Weiter oben ist es weniger, und sie besteht vor allem darin, die Ebene darunter nachzuhalten.") },
        { type: "callout", reading: true, text: x(
          "A rhythm means fewer meetings: at fixed times, each with one job.",
          "Ritmi do të thotë më pak takime: në orë të fiksuara, secili me një punë.",
          "Ein Rhythmus bedeutet weniger Besprechungen: zu festen Zeiten, jede mit einer Aufgabe.") },
      ],
      note: x(
        "The day follows Mann, the week Grove; the monthly look back is the editors' addition.",
        "Dita ndjek Mann-in, java Grove-in; vështrimi mujor është shtesë e redaksisë.",
        "Der Tag folgt Mann, die Woche Grove; der monatliche Rückblick ist eine Ergänzung der Redaktion."),
      source: ["mann-2005", "mann-2006", "grove-1983"],
    },
    {
      id: "research",
      kicker: x("What the research says", "Çfarë thotë kërkimi", "Was die Forschung sagt"),
      title: [x("What a daily", "Çfarë mund të bëjë", "Was eine tägliche"), x("huddle can do", "takimi ditor", "Runde leisten kann")],
      lead: x(
        "A children's hospital with 539 beds introduced short daily meetings in three tiers: on the wards, among charge nurses and among leaders. They looked ahead at risks, reported safety events and moved resources to where they were needed.",
        "Një spital pediatrik me 539 shtretër futi takime të shkurtra ditore në tri nivele: në pavijone, mes kryeinfermierëve dhe mes drejtuesve. Në to shiheshin rreziqet që vinin, raportoheshin ngjarjet e sigurisë dhe burimet çoheshin aty ku duheshin.",
        "Eine Kinderklinik mit 539 Betten führte kurze tägliche Runden in drei Stufen ein: auf den Stationen, unter den Stationsleitungen und in der Klinikleitung. Dort ging der Blick auf kommende Risiken, Sicherheitsereignisse wurden gemeldet und Ressourcen dorthin verlagert, wo sie gebraucht wurden."),
      blocks: [
        { type: "columns", max: 5, height: 90, source: ["brady-2013"],
          label: x("Unrecognised deterioration ending in intensive care, per 10,000 patient days", "Përkeqësime të pavëna re që përfunduan në terapi intensive, për 10.000 ditë shtrimi", "Unerkannte Verschlechterungen mit Verlegung auf die Intensivstation, je 10.000 Patiententage"),
          items: [
            { k: x("Before", "Para", "Vorher"), v: 4.4, n: x("4.4", "4,4", "4,4"), alert: true },
            { k: x("After", "Pas", "Nachher"), v: 2.4, n: x("2.4", "2,4", "2,4") },
          ] },
        { type: "p", text: x(
          "The fall came with a bundle of measures: spotting risk early, frequent huddles on the wards, and ways of learning from each event. There was no control group, so the share of the huddles cannot be separated out. A second study of the same hospital, based on 10 interviews and 6 focus groups, described how the huddles worked but measured no outcome.",
          "Rënia erdhi bashkë me një paketë masash: dallimi i hershëm i rrezikut, takime të shpeshta në pavijone, dhe mënyra për të mësuar nga çdo ngjarje. Grup kontrolli nuk pati, prandaj kontributi i takimeve nuk mund të veçohet. Një studim i dytë në të njëjtin spital, me 10 intervista dhe 6 grupe diskutimi, përshkroi si funksiononin takimet, por nuk mati asnjë rezultat.",
          "Der Rückgang kam mit einem Bündel von Maßnahmen: Risiken früh erkennen, häufige Runden auf den Stationen und Wege, aus jedem Ereignis zu lernen. Eine Kontrollgruppe gab es nicht, daher lässt sich der Anteil der Runden nicht herausrechnen. Eine zweite Studie derselben Klinik, gestützt auf 10 Interviews und 6 Fokusgruppen, beschrieb, wie die Runden abliefen, maß aber kein Ergebnis.") },
        { type: "callout", reading: true, text: x(
          "A daily huddle costs little. What it is worth depends on what follows: the problem someone takes away and closes.",
          "Takimi ditor kushton pak. Vlera e tij varet nga ajo që vjen pas: problemi që dikush e merr me vete dhe e mbyll.",
          "Eine tägliche Runde kostet wenig. Was sie wert ist, entscheidet sich danach: an dem Problem, das jemand mitnimmt und abschließt.") },
      ],
      source: ["brady-2013", "goldenhar-2013"],
    },
    {
      id: "measure",
      kicker: x("How it is measured", "Si matet", "Wie es gemessen wird"),
      title: [x("Check the rhythm,", "Kontrollo ritmin,", "Den Rhythmus prüfen,"), x("not the calendar", "jo kalendarin", "nicht den Kalender")],
      lead: x(
        "In Mann's system, standard work is written down and the level above checks whether it happened. The same works for your own routines.",
        "Në sistemin e Mann-it, puna standarde shkruhet dhe niveli sipër kontrollon nëse u bë. E njëjta gjë vlen për rutinat e tua.",
        "In Manns System wird Standardarbeit aufgeschrieben, und die Ebene darüber prüft, ob sie stattgefunden hat. Für Ihre eigenen Routinen funktioniert das genauso."),
      blocks: [
        { type: "steps", items: [
          { h: x("Write the routines down", "Shkruaji rutinat", "Die Routinen aufschreiben"), p: x("Each one with a time, a place and an owner.", "Secila me orë, vend dhe përgjegjës.", "Jede mit Zeit, Ort und verantwortlicher Person.") },
          { h: x("Mark each one, every day", "Shëno secilën, çdo ditë", "Jede abhaken, jeden Tag"), p: x("Held or not, in one line.", "U mbajt apo jo, në një rresht.", "Stattgefunden oder nicht, in einer Zeile.") },
          { h: x("Count once a month", "Numëro një herë në muaj", "Einmal im Monat zählen"), p: x("The share held, and why the others fell away.", "Sa u mbajtën, dhe pse ranë të tjerat.", "Den Anteil, der stattfand, und warum der Rest ausfiel.") },
          { h: x("Change one thing", "Ndrysho një gjë", "Eine Sache ändern"), p: x("Move, shorten or drop the routine that keeps failing.", "Zhvendose, shkurtoje ose hiqe rutinën që dështon vazhdimisht.", "Verschieben, kürzen oder streichen Sie die Routine, die immer wieder ausfällt.") },
        ] },
        { type: "example", label: x("Hypothetical example, a shift lead's month", "Shembull hipotetik, muaji i një shefi turni", "Hypothetisches Beispiel, der Monat einer Schichtleitung"), rows: [
          { k: x("Daily", "Ditore", "Täglich"), v: x("19 of 22 meetings held", "19 nga 22 takime u mbajtën", "19 von 22 Runden fanden statt") },
          { k: x("Weekly", "Javore", "Wöchentlich"), v: x("5 of 8 one-to-ones held", "5 nga 8 biseda u mbajtën", "5 von 8 Einzelgesprächen fanden statt") },
          { k: x("Monthly", "Mujore", "Monatlich"), v: x("1 of 1 review held", "1 nga 1 rishikim u mbajt", "1 von 1 Rückblick fand statt") },
        ], text: x("The weekly routine is the one that breaks, so that is where the change goes. The numbers are made up.", "Rutina javore është ajo që çalon, prandaj aty shkon ndryshimi. Numrat janë të sajuar.", "Es hakt bei den wöchentlichen Gesprächen, also setzt dort die Änderung an. Die Zahlen sind erfunden.") },
      ],
      note: x("The editors wrote the steps and the example.", "Hapat dhe shembullin i shkroi redaksia.", "Schritte und Beispiel hat die Redaktion geschrieben."),
      source: ["mann-2006"],
    },
    {
      id: "tool", tool: "/tools/shift-pulse/",
      kicker: x("Tool of the issue", "Mjeti i numrit", "Werkzeug der Ausgabe"),
      title: [x("The", "Karta", "Die"), x("rhythm card", "e ritmit", "Rhythmuskarte")],
      lead: x(
        "One card for the routines of your role. Fill it in once, keep it where you work, and check it at the end of each week.",
        "Një kartë për rutinat e rolit tënd. Plotësoje një herë, mbaje aty ku punon, dhe kontrolloje në fund të çdo jave.",
        "Eine Karte für die Routinen Ihrer Rolle. Füllen Sie sie einmal aus, bewahren Sie sie am Arbeitsplatz auf und prüfen Sie sie am Ende jeder Woche."),
      blocks: [
        { type: "form", items: [
          { h: x("Every day", "Çdo ditë", "Jeden Tag"), hint: x("time, place, ten minutes, who attends", "ora, vendi, dhjetë minuta, kush merr pjesë", "Zeit, Ort, zehn Minuten, wer teilnimmt") },
          { h: x("What the daily meeting looks at", "Çfarë shikon takimi ditor", "Worauf die tägliche Runde schaut"), hint: x("safety, yesterday's numbers, today's risks", "siguria, shifrat e djeshme, rreziqet e sotme", "Sicherheit, die Zahlen von gestern, die Risiken von heute") },
          { h: x("Every week", "Çdo javë", "Jede Woche"), hint: x("one-to-ones: with whom, how long, who brings the agenda", "biseda një me një: me kë, sa gjatë, kush sjell rendin e ditës", "Einzelgespräche: mit wem, wie lange, wer die Agenda mitbringt"), lines: 2 },
          { h: x("Every month", "Çdo muaj", "Jeden Monat"), hint: x("the review: which numbers, which question", "rishikimi: cilat shifra, cila pyetje", "der Rückblick: welche Zahlen, welche Frage") },
          { h: x("What I stop doing", "Çfarë nuk bëj më", "Was ich nicht mehr tue"), hint: x("to make room for the routines", "që t'u bëj vend rutinave", "um Platz für die Routinen zu schaffen") },
          { h: x("Who checks me", "Kush më kontrollon", "Wer mich prüft"), hint: x("the person who sees whether the routines happened", "personi që sheh nëse rutinat u mbajtën", "die Person, die sieht, ob die Routinen stattfanden") },
        ] },
      ],
      note: x(
        "Proposed by the editors, after Mann's daily accountability and Grove's one-to-ones.",
        "Praktikë që e propozon redaksia, sipas përgjegjshmërisë ditore të Mann-it dhe bisedave një me një të Grove-it.",
        "Ein Vorschlag der Redaktion, angelehnt an Manns tägliche Rechenschaft und Groves Einzelgespräche."),
      source: ["mann-2005", "grove-1983"],
    },
    { id: "sources", type: "sources" },
    { id: "back", type: "back" },
  ],
};
