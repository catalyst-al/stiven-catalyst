// Management Review, No. 24: Onboarding that keeps people. Block: People.
// Facts and their sources: docs/revista/management-review-nr-24.md.
import { x, pc } from "../common.js";

export default {
  number: 24,
  block: "people",
  date: x("October 2026", "Tetor 2026", "Oktober 2026"),
  theme: [x("Onboarding", "Onboarding-u", "Onboarding,"), x("that keeps people", "që i mban njerëzit", "das Menschen hält")],
  sub: x(
    "How few organisations onboard well, how early jobs end, Bauer's four C's, what a buddy and a manager change, and a card for the first weeks of a new person.",
    "Sa pak organizata e bëjnë mirë onboarding-un, sa herët mbarojnë punët, katër C-të e Bauer, çfarë ndryshojnë një buddy dhe një menaxher, dhe një kartë për javët e para të një të riu.",
    "Wie wenige Organisationen gut einarbeiten, wie früh Arbeitsverhältnisse enden, Bauers vier Cs, was ein Buddy und eine Führungskraft ändern, und eine Karte für die ersten Wochen."),
  seo: x(
    "Onboarding that keeps people: Gallup's 12%, how early jobs end, Bauer's four C's, Microsoft's buddies, Google's note to managers and a card for the first weeks.",
    "Onboarding-u që i mban njerëzit: 12% e Gallup, sa herët mbarojnë punët, katër C-të e Bauer, buddy-t e Microsoft, email-i i Google dhe një kartë.",
    "Onboarding, das Menschen hält: Gallups 12 %, wie früh Jobs enden, Bauers vier Cs, die Buddys von Microsoft, Googles Mail an Führungskräfte und eine Karte."),
  feature: x(
    "Issue 24 starts with Gallup's finding that only 12% of US employees think their organisation onboards new people well, shows how early jobs end in a US generation followed since 1979, sets out Talya Bauer's four C's, looks at what role clarity, confidence and a buddy change, and ends with a card for the first weeks of a new person.",
    "Numri 24 nis me gjetjen e Gallup se vetëm 12% e punonjësve në SHBA mendojnë se organizata e tyre e bën mirë onboarding-un, tregon sa herët mbarojnë punët te një brez amerikan i ndjekur që nga 1979, shtjellon katër C-të e Talya Bauer, shikon çfarë ndryshojnë qartësia e rolit, besimi dhe një buddy, dhe mbyllet me një kartë për javët e para të një të riu.",
    "Ausgabe 24 beginnt mit Gallups Befund, dass nur 12 % der Beschäftigten in den USA ihre Organisation für gut im Einarbeiten halten, zeigt, wie früh Arbeitsverhältnisse in einer seit 1979 begleiteten US-Generation enden, stellt Talya Bauers vier Cs vor, betrachtet, was Rollenklarheit, Zutrauen und ein Buddy ändern, und endet mit einer Karte für die ersten Wochen."),
  figure: { n: pc(12), by: "Gallup, 2018", t: x(
    "of US employees strongly agree that their organisation does a great job of onboarding new employees (2017 data).",
    "e punonjësve në SHBA pajtohen fuqishëm se organizata e tyre e bën shumë mirë onboarding-un e të rinjve (të dhëna të 2017).",
    "der Beschäftigten in den USA stimmen voll zu, dass ihre Organisation neue Mitarbeitende sehr gut einarbeitet (Daten von 2017).") },
  teasers: [
    { page: "story", kicker: x("Cover story", "Tema kryesore", "Titelthema"),
      title: x("Only 12%", "Vetëm 12%", "Nur 12 %") },
    { page: "model", kicker: x("The model", "Modeli", "Das Modell"),
      title: x("The four C's", "Katër C-të", "Die vier Cs") },
    { page: "tool", kicker: x("Tool of the issue", "Mjeti i numrit", "Werkzeug der Ausgabe"),
      title: x("The first-weeks card", "Karta e javëve të para", "Die Karte für die ersten Wochen") },
  ],
  sources: ["gallup-onboarding-2018", "gallup-onboarding-2019", "bls-nlsy79-2025", "bauer-2010", "bauer-2007", "klinghoffer-2019", "bock-onboarding-2015"],
  pages: [
    { id: "cover", type: "cover" },
    {
      id: "intro", type: "intro",
      why: x(
        "The first weeks in a job shape whether a new person settles in. This issue looks at what those weeks give them: the rules, a clear role, the culture and, above all, people.",
        "Javët e para në një punë ndikojnë nëse një i ri do të zërë vend. Ky numër shikon çfarë i japin këto javë: rregullat, një rol të qartë, kulturën dhe, mbi të gjitha, njerëzit.",
        "Die ersten Wochen in einer neuen Stelle entscheiden mit, ob jemand Neues ankommt. Diese Ausgabe betrachtet, was diese Wochen ihm geben: die Regeln, eine klare Rolle, die Kultur und vor allem Menschen."),
      body: x(
        "Only 12% of US employees strongly agree that their organisation onboards new people well, and only 29% of new hires feel fully prepared afterwards. Of the jobs that Americans born 1957–1964 started at 18–24, on average 61% ended within a year. Talya Bauer sums up onboarding in four C's. A meta-analysis of 70 samples finds that role clarity, confidence and acceptance by colleagues carry its effects, and at Microsoft new hires who met their buddy more often felt productive sooner.",
        "Vetëm 12% e punonjësve në SHBA pajtohen fuqishëm se organizata e tyre e bën mirë onboarding-un, dhe vetëm 29% e të rinjve ndihen plotësisht të përgatitur pas tij. Nga punët që amerikanët e lindur 1957–1964 i nisën në moshën 18–24 vjeç, mesatarisht 61% mbaruan brenda një viti. Talya Bauer e përmbledh onboarding-un në katër C. Një meta-analizë me 70 mostra gjen se qartësia e rolit, besimi te vetja dhe pranimi nga kolegët e bartin efektin e tij, dhe te Microsoft të rinjtë që u takuan më shpesh me buddy-n u ndien më shpejt produktivë.",
        "Nur 12 % der Beschäftigten in den USA stimmen voll zu, dass ihre Organisation Neue gut einarbeitet, und nur 29 % der Neuen fühlen sich danach voll vorbereitet. Von den Stellen, die US-Amerikaner der Jahrgänge 1957–1964 mit 18–24 antraten, endeten im Schnitt 61 % innerhalb eines Jahres. Talya Bauer fasst Onboarding in vier Cs zusammen. Eine Metaanalyse von 70 Stichproben findet, dass Rollenklarheit, Zutrauen und Akzeptanz durch Kollegen seine Wirkung vermitteln, und bei Microsoft fühlten sich Neue, die ihren Buddy öfter trafen, früher produktiv."),
    },
    {
      id: "story",
      kicker: x("Cover story", "Tema kryesore", "Titelthema"),
      title: [x("Only", "Vetëm", "Nur"), x("12%", "12%", "12 %")],
      lead: x(
        "Gallup asked US employees whether their organisation does a great job of onboarding new employees. The answer comes from its State of the American Workplace survey of 2017.",
        "Gallup i pyeti punonjësit në SHBA nëse organizata e tyre e bën shumë mirë onboarding-un e të rinjve. Përgjigja vjen nga anketa e raportit State of the American Workplace, 2017.",
        "Gallup fragte Beschäftigte in den USA, ob ihre Organisation neue Mitarbeitende sehr gut einarbeitet. Die Antwort stammt aus der Umfrage zum Bericht State of the American Workplace von 2017."),
      blocks: [
        { type: "donut", v: 12, n: pc(12), source: ["gallup-onboarding-2018"], t: x(
          "strongly agree that their organisation onboards new employees very well.",
          "pajtohen fuqishëm se organizata e tyre e bën shumë mirë onboarding-un e të rinjve.",
          "stimmen voll zu, dass ihre Organisation neue Mitarbeitende sehr gut einarbeitet.") },
        { type: "figures", compact: true, items: [
          { n: pc(29), t: x("of new hires feel fully prepared and supported to excel after onboarding", "e të rinjve ndihen plotësisht të përgatitur dhe të mbështetur pas onboarding-ut", "der Neuen fühlen sich nach dem Onboarding voll vorbereitet und unterstützt") },
          { n: x("2.6×", "2,6×", "2,6×"), t: x("as likely to be extremely satisfied at work, for those who call their onboarding exceptional", "më shumë gjasa të jenë tejet të kënaqur në punë, për ata që e quajnë onboarding-un të jashtëzakonshëm", "so häufig äußerst zufrieden bei der Arbeit, wer das eigene Onboarding als außergewöhnlich bezeichnet") },
        ] },
        { type: "callout", reading: true, text: x(
          "Onboarding is not a first day. It is the months in which a person learns the role, the place and the people.",
          "Onboarding-u nuk është dita e parë. Janë muajt kur një njeri mëson rolin, vendin dhe njerëzit.",
          "Onboarding ist nicht der erste Tag. Es sind die Monate, in denen ein Mensch die Rolle, den Ort und die Menschen kennenlernt.") },
      ],
      note: x(
        "The 29% and the 2.6 times come from a Gallup paper of 2019; the second is a correlation, and the method is not shown.",
        "29% dhe 2,6 herë vijnë nga një studim i Gallup i 2019; e dyta është korrelacion, dhe metoda nuk tregohet.",
        "Die 29 % und das 2,6-Fache stammen aus einem Gallup-Papier von 2019; Letzteres ist eine Korrelation, die Methode wird nicht offengelegt."),
      source: ["gallup-onboarding-2018", "gallup-onboarding-2019"],
    },
    {
      id: "numbers",
      kicker: x("The numbers", "Shifrat", "Die Zahlen"),
      title: [x("How early", "Sa herët", "Wie früh"), x("jobs end", "mbarojnë punët", "Jobs enden")],
      lead: x(
        "The US Bureau of Labor Statistics has followed Americans born 1957–1964 since 1979. For every job they started, it records how long the job lasted.",
        "Byroja e Statistikave të Punës e SHBA i ndjek amerikanët e lindur 1957–1964 që nga 1979. Për çdo punë që nisën, shënon sa zgjati.",
        "Das US Bureau of Labor Statistics begleitet US-Amerikaner der Jahrgänge 1957–1964 seit 1979. Für jede Stelle, die sie antraten, hält es fest, wie lange sie dauerte."),
      blocks: [
        { type: "dumbbell", from: x("Within 1 year", "Brenda 1 viti", "Binnen 1 Jahr"), to: x("Within 5 years", "Brenda 5 vjetëve", "Binnen 5 Jahren"), min: 0, max: 100, source: ["bls-nlsy79-2025"],
          label: x("Share of jobs that ended, by age at the start of the job", "Pjesa e punëve që mbaruan, sipas moshës kur nisi puna", "Anteil der beendeten Stellen, nach Alter bei Stellenantritt"),
          rows: [
            { k: x("Aged 18–24", "18–24 vjeç", "18–24 Jahre"), a: 61, an: pc(61), b: 87, bn: pc(87), alert: true },
            { k: x("Aged 25–34", "25–34 vjeç", "25–34 Jahre"), a: 41.7, an: x("41.7%", "41,7%", "41,7 %"), b: 74, bn: pc(74) },
            { k: x("Aged 45–54", "45–54 vjeç", "45–54 Jahre"), a: 21, an: pc(21), b: 56, bn: pc(56) },
          ] },
        { type: "p", text: x(
          "On average they held 12.9 jobs between the ages of 18 and 58. The figures count every way a job ends: people who quit, layoffs and contracts that run out.",
          "Mesatarisht patën 12,9 punë nga mosha 18 deri në 58 vjeç. Shifrat numërojnë çdo mënyrë si mbaron një punë: largimet vullnetare, pushimet nga puna dhe kontratat që mbarojnë.",
          "Im Schnitt hatten sie zwischen 18 und 58 Jahren 12,9 Stellen. Die Zahlen erfassen jede Art, wie eine Stelle endet: Kündigungen durch die Beschäftigten, Entlassungen und auslaufende Verträge.") },
        { type: "callout", reading: true, text: x(
          "A large share of jobs ends within the first year, above all for the young. That year is exactly where onboarding works.",
          "Një pjesë e madhe e punëve mbaron brenda vitit të parë, sidomos në moshë të re. Pikërisht në atë vit vepron onboarding-u.",
          "Ein großer Teil der Stellen endet im ersten Jahr, vor allem bei Jüngeren. Genau in diesem Jahr wirkt Onboarding.") },
      ],
      note: x(
        "One US generation; the shares are averages per person. For Albania and Germany we have no comparable data.",
        "Një brez amerikan; pjesët janë mesatare për person. Për Shqipërinë dhe Gjermaninë s'kam të dhëna të krahasueshme.",
        "Eine US-Generation; die Anteile sind Durchschnitte pro Person. Für Albanien und Deutschland liegen uns keine vergleichbaren Daten vor."),
      source: ["bls-nlsy79-2025"],
    },
    {
      id: "model", more: "watch-how-i-do-it-is-not-training",
      kicker: x("The model", "Modeli", "Das Modell"),
      title: [x("The four", "Katër", "Die vier"), x("C's", "C-të", "Cs")],
      lead: x(
        "In a guide for the SHRM Foundation, Talya Bauer describes onboarding in four building blocks, from the rules to the relationships.",
        "Në një udhëzues për SHRM Foundation, Talya Bauer e përshkruan onboarding-un në katër blloqe, nga rregullat te marrëdhëniet.",
        "In einem Leitfaden für die SHRM Foundation beschreibt Talya Bauer Onboarding in vier Bausteinen, von den Regeln bis zu den Beziehungen."),
      blocks: [
        { type: "rows", compact: true, items: [
          { h: x("Compliance", "Compliance", "Compliance"), p: x("The rules, policies and legal documents.", "Rregullat, politikat dhe dokumentet ligjore.", "Die Regeln, Richtlinien und rechtlichen Unterlagen.") },
          { h: x("Clarification", "Clarification", "Clarification"), p: x("The tasks and expectations of the role.", "Detyrat dhe pritshmëritë e rolit.", "Die Aufgaben und Erwartungen der Rolle.") },
          { h: x("Culture", "Culture", "Culture"), p: x("The norms and values of the organisation.", "Normat dhe vlerat e organizatës.", "Die Normen und Werte der Organisation.") },
          { h: x("Connection", "Connection", "Connection"), p: x("The relationships with people at work.", "Marrëdhëniet me njerëzit në punë.", "Die Beziehungen zu den Menschen bei der Arbeit.") },
        ] },
        { type: "example", label: x("Hypothetical example, a new shift lead's first week", "Shembull hipotetik, java e parë e një drejtuesi të ri turni", "Hypothetisches Beispiel, die erste Woche einer neuen Schichtleitung"), rows: [
          { k: x("Compliance", "Compliance", "Compliance"), v: x("Safety briefing and contract on day one", "Udhëzimi i sigurisë dhe kontrata ditën e parë", "Sicherheitsunterweisung und Vertrag am ersten Tag") },
          { k: x("Clarification", "Clarification", "Clarification"), v: x("The three numbers the shift is judged on", "Tre numrat me të cilët gjykohet turni", "Die drei Zahlen, an denen die Schicht gemessen wird") },
          { k: x("Culture", "Culture", "Culture"), v: x("How a mistake is reported here", "Si raportohet një gabim këtu", "Wie man hier einen Fehler meldet") },
          { k: x("Connection", "Connection", "Connection"), v: x("Lunch with the buddy, coffee with the night lead", "Drekë me buddy-n, kafe me drejtuesin e natës", "Mittagessen mit dem Buddy, Kaffee mit der Nachtleitung") },
        ], text: x("Each C has an owner and a day. The plan is invented.", "Çdo C ka një përgjegjës dhe një ditë. Plani është i shpikur.", "Jedes C hat eine verantwortliche Person und einen Tag. Der Plan ist erfunden.") },
        { type: "callout", reading: true, text: x(
          "The first two C's can be handed over on paper. The last two only happen between people.",
          "Dy C-të e para mund të jepen në letër. Dy të fundit ndodhin vetëm mes njerëzve.",
          "Die ersten beiden Cs lassen sich auf Papier übergeben. Die letzten beiden geschehen nur zwischen Menschen.") },
      ],
      note: x("The four C's follow Bauer (2010); the example is the editors'.", "Katër C-të ndjekin Bauer (2010); shembulli është i redaksisë.", "Die vier Cs folgen Bauer (2010); das Beispiel stammt von der Redaktion."),
      source: ["bauer-2010"],
    },
    {
      id: "research",
      kicker: x("What the research says", "Çfarë thotë kërkimi", "Was die Forschung sagt"),
      title: [x("Clarity, confidence,", "Qartësi, besim,", "Klarheit, Zutrauen,"), x("acceptance", "pranim", "Akzeptanz")],
      lead: x(
        "A meta-analysis of 70 samples of new employees, by Talya Bauer and colleagues, found three links between what an organisation does and how a new person fares: role clarity, confidence in one's own ability and acceptance by colleagues.",
        "Një meta-analizë me 70 mostra të sapopunësuarish, nga Talya Bauer dhe kolegët, gjeti tri lidhje mes asaj që bën organizata dhe si ecën një i ri: qartësinë e rolit, besimin te aftësia e vet dhe pranimin nga kolegët.",
        "Eine Metaanalyse von Talya Bauer und Kollegen mit 70 Stichproben neuer Beschäftigter fand drei Bindeglieder zwischen dem, was eine Organisation tut, und dem, wie es einer neuen Person ergeht: Rollenklarheit, Zutrauen in die eigene Fähigkeit und Akzeptanz durch Kollegen."),
      blocks: [
        { type: "p", text: x(
          "Through them, onboarding goes with job satisfaction, commitment, performance, the intention to stay and lower turnover. At Microsoft, a six-month pilot in 2018 with 600 participants gave new hires a buddy.",
          "Përmes tyre, onboarding-u lidhet me kënaqësinë në punë, angazhimin, performancën, synimin për të qëndruar dhe më pak largime. Te Microsoft, një projekt pilot gjashtëmujor në 2018 me 600 pjesëmarrës u dha të rinjve një buddy.",
          "Über sie geht Onboarding mit Arbeitszufriedenheit, Bindung, Leistung, der Absicht zu bleiben und weniger Fluktuation einher. Bei Microsoft bekamen Neue in einem sechsmonatigen Pilotprojekt 2018 mit 600 Teilnehmenden einen Buddy.") },
        { type: "hbars", max: 100, source: ["klinghoffer-2019"],
          label: x("New hires who said their buddy helped them become productive quickly, by meetings in the first 90 days", "Të rinjtë që thanë se buddy-u i ndihmoi të bëheshin shpejt produktivë, sipas takimeve në 90 ditët e para", "Neue, die sagten, ihr Buddy habe ihnen geholfen, schnell produktiv zu werden, nach Treffen in den ersten 90 Tagen"),
          items: [
            { k: x("At least once", "Të paktën një herë", "Mindestens einmal"), v: 56, n: pc(56) },
            { k: x("2–3 times", "2–3 herë", "2–3 Mal"), v: 73, n: pc(73) },
            { k: x("4–8 times", "4–8 herë", "4–8 Mal"), v: 86, n: pc(86) },
            { k: x("More than 8 times", "Më shumë se 8 herë", "Mehr als 8 Mal"), v: 97, n: pc(97), alert: true },
          ] },
        { type: "callout", reading: true, text: x(
          "A buddy is not a programme. It is a person with time in the calendar, and the meetings are what count.",
          "Buddy-u nuk është program. Është një njeri me kohë në kalendar, dhe ajo që vlen janë takimet.",
          "Ein Buddy ist kein Programm. Er ist ein Mensch mit Zeit im Kalender, und es zählen die Treffen.") },
      ],
      note: x(
        "Microsoft's figures are self-reports from one company, written up by its employees; the first group includes the others.",
        "Shifrat e Microsoft janë vetëvlerësime nga një kompani, të shkruara nga punonjësit e saj; grupi i parë i përfshin edhe të tjerët.",
        "Die Zahlen von Microsoft sind Selbstauskünfte aus einem Unternehmen, aufgeschrieben von dessen Beschäftigten; die erste Gruppe schließt die anderen ein."),
      source: ["bauer-2007", "klinghoffer-2019"],
    },
    {
      id: "measure",
      kicker: x("How it is measured", "Si matet", "Wie man es misst"),
      title: [x("Measure the", "Mat 90", "Die ersten 90 Tage"), x("first 90 days", "ditët e para", "messen")],
      lead: x(
        "Onboarding can be measured like any process: on fixed days, with the same few questions, for every new person.",
        "Onboarding-u mund të matet si çdo proces: në ditë të caktuara, me të njëjtat pak pyetje, për çdo të ri.",
        "Onboarding lässt sich messen wie jeder Prozess: an festen Tagen, mit denselben wenigen Fragen, für jede neue Person."),
      blocks: [
        { type: "steps", items: [
          { h: x("Day 30, 60 and 90", "Dita 30, 60 dhe 90", "Tag 30, 60 und 90"), p: x("A short conversation on fixed days, booked on day one.", "Një bisedë e shkurtër në ditë të caktuara, e rezervuar ditën e parë.", "Ein kurzes Gespräch an festen Tagen, am ersten Tag gebucht.") },
          { h: x("Three questions", "Tri pyetje", "Drei Fragen"), p: x("Is the role clear? Do you feel able to do it? Do you feel accepted by the team?", "A është i qartë roli? A ndihesh i aftë ta bësh? A ndihesh i pranuar nga ekipi?", "Ist die Rolle klar? Traust du sie dir zu? Fühlst du dich vom Team angenommen?") },
          { h: x("Count the buddy meetings", "Numëro takimet me buddy-n", "Die Buddy-Treffen zählen"), p: x("How often did the new person and the buddy actually meet?", "Sa herë u takuan vërtet i riu dhe buddy-u?", "Wie oft haben sich die neue Person und der Buddy wirklich getroffen?") },
          { h: x("See who stays", "Shiko kush qëndron", "Sehen, wer bleibt"), p: x("Of everyone who started, how many are still here after 6 and 12 months.", "Nga të gjithë ata që nisën, sa janë ende këtu pas 6 dhe 12 muajsh.", "Von allen, die angefangen haben: wie viele nach 6 und 12 Monaten noch da sind.") },
        ] },
        { type: "example", label: x("Hypothetical example, ten new hires in one quarter", "Shembull hipotetik, dhjetë të rinj në një tremujor", "Hypothetisches Beispiel, zehn Neue in einem Quartal"), rows: [
          { k: x("Day 30", "Dita 30", "Tag 30"), v: x("8 of 10 say the role is clear", "8 nga 10 thonë se roli është i qartë", "8 von 10 sagen, die Rolle sei klar") },
          { k: x("Day 90", "Dita 90", "Tag 90"), v: x("9 of 10 feel accepted by the team", "9 nga 10 ndihen të pranuar nga ekipi", "9 von 10 fühlen sich vom Team angenommen") },
          { k: x("12 months", "12 muaj", "12 Monate"), v: x("8 of 10 still here", "8 nga 10 ende këtu", "8 von 10 noch da") },
        ], text: x("The two who said the role was unclear on day 30 are the ones to talk to first. The numbers are invented.", "Dy që thanë në ditën 30 se roli nuk ishte i qartë janë të parët me të cilët duhet folur. Numrat janë të shpikur.", "Mit den beiden, die an Tag 30 sagten, die Rolle sei unklar, spricht man zuerst. Die Zahlen sind erfunden.") },
      ],
      note: x(
        "The steps and the example are the editors'; the three questions follow Bauer et al. (2007).",
        "Hapat dhe shembulli janë të redaksisë; tri pyetjet ndjekin Bauer et al. (2007).",
        "Schritte und Beispiel stammen von der Redaktion; die drei Fragen folgen Bauer et al. (2007)."),
      source: ["bauer-2007"],
    },
    {
      id: "tool",
      kicker: x("Tool of the issue", "Mjeti i numrit", "Werkzeug der Ausgabe"),
      title: [x("The first-weeks", "Karta e javëve", "Die Karte für die"), x("card", "të para", "ersten Wochen")],
      lead: x(
        "One card for one new person, filled in by the manager before the first day. At Google, managers got a similar list by email on the Sunday before a new person started.",
        "Një kartë për një të ri, e plotësuar nga menaxheri para ditës së parë. Te Google, menaxherët merrnin një listë të ngjashme me email të dielën para se të niste i riu.",
        "Eine Karte für eine neue Person, von der Führungskraft vor dem ersten Tag ausgefüllt. Bei Google bekamen Führungskräfte eine ähnliche Liste per Mail am Sonntag vor dem Start."),
      blocks: [
        { type: "form", items: [
          { h: x("Before day one", "Para ditës së parë", "Vor dem ersten Tag"), hint: x("documents ready; the talk about the role and its responsibilities booked", "dokumentet gati; biseda për rolin dhe përgjegjësitë e rezervuar", "Unterlagen bereit; das Gespräch über Rolle und Verantwortung gebucht") },
          { h: x("Buddy", "Buddy", "Buddy"), hint: x("name, and how often they meet in the first 90 days", "emri, dhe sa shpesh takohen në 90 ditët e para", "Name, und wie oft sie sich in den ersten 90 Tagen treffen") },
          { h: x("People to meet", "Njerëzit për t'u takuar", "Menschen zum Kennenlernen"), hint: x("five names, and why each one matters", "pesë emra, dhe pse ka rëndësi secili", "fünf Namen, und warum jeder zählt"), lines: 2 },
          { h: x("Check-ins", "Takimet e kontrollit", "Check-ins"), hint: x("once a month for the first six months: the dates", "një herë në muaj për gjashtë muajt e parë: datat", "einmal im Monat in den ersten sechs Monaten: die Termine") },
          { h: x("Open questions", "Pyetjet e hapura", "Offene Fragen"), hint: x("how and when the new person can ask anything", "si dhe kur mund të pyesë i riu për çdo gjë", "wie und wann die neue Person alles fragen kann") },
          { h: x("Day 90", "Dita 90", "Tag 90"), hint: x("role clear? able to do it? accepted by the team?", "roli i qartë? i aftë ta bëjë? i pranuar nga ekipi?", "Rolle klar? Zutrauen? Vom Team angenommen?") },
        ] },
      ],
      note: x(
        "A practice proposed by the editors, after Google's five actions for managers (Bock, 2015) and Bauer's four C's.",
        "Praktikë e propozuar nga redaksia, sipas pesë veprimeve të Google për menaxherët (Bock, 2015) dhe katër C-ve të Bauer.",
        "Eine Praxis, die die Redaktion vorschlägt, nach Googles fünf Schritten für Führungskräfte (Bock, 2015) und Bauers vier Cs."),
      source: ["bock-onboarding-2015", "bauer-2010"],
    },
    { id: "sources", type: "sources" },
    { id: "back", type: "back" },
  ],
};
