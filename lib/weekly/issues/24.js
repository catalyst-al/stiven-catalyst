// Management Review, No. 24: Onboarding that keeps people. Block: People.
// Facts and their sources: docs/revista/management-review-nr-24.md.
import { x, pc } from "../common.js";

export default {
  number: 24,
  block: "people",
  date: x("October 2026", "Tetor 2026", "Oktober 2026"),
  // Corrections made after publication, shown on the issue's page and its sources page.
  corrections: [
    {
      date: x("16 October 2026", "16 tetor 2026", "16. Oktober 2026"),
      t: x(
        "The introduction now says what the new hires reported: that their buddy helped them become productive quickly. It first said they felt productive sooner, which is more than the source says.",
        "Hyrja tani thotë atë që raportuan të sapopunësuarit: se shoqëruesi i ndihmoi të bëheshin shpejt produktivë. Fillimisht thoshte se u ndien produktivë më shpejt, që është më shumë nga ç'thotë burimi.",
        "Die Einleitung gibt jetzt wieder, was die Neuen angaben: dass ihr Pate ihnen half, schnell produktiv zu werden. Zuerst hieß es, sie hätten sich früher produktiv gefühlt; das sagt die Quelle nicht."),
    },
  ],
  theme: [x("Onboarding", "Hyrja në punë", "Onboarding,"), x("that keeps people", "që i mban njerëzit", "das Menschen hält")],
  sub: x(
    "How few organisations onboard well, how early jobs end, Bauer's four C's, what a buddy and a manager change, and a card for a new person's first weeks.",
    "Sa pak organizata ua bëjnë mirë hyrjen në punë të rinjve, sa herët mbarojnë punët, katër C-të e Bauer-it, çfarë ndryshojnë një koleg-shoqërues dhe një menaxher, dhe një kartë për javët e para të një të riu.",
    "Wie wenige Organisationen gut einarbeiten, wie früh Arbeitsverhältnisse enden, Bauers vier Cs, was ein Pate und eine Führungskraft bewirken, und eine Karte für die ersten Wochen."),
  seo: x(
    "Onboarding that keeps people: Gallup's 12%, how early jobs end, Bauer's four C's, Microsoft's buddies, Google's note to managers and a card for the first weeks.",
    "Hyrja në punë që i mban njerëzit: 12% e Gallup-it, sa herët mbarojnë punët, katër C-të, shoqëruesit e Microsoft-it, email-i i Google-it dhe një kartë.",
    "Onboarding, das Menschen hält: Gallups 12 %, wie früh Jobs enden, Bauers vier Cs, die Paten bei Microsoft, Googles Mail an Führungskräfte und eine Karte."),
  feature: x(
    "Only 12% of US employees think their organisation onboards new people well, and in a US generation followed since 1979 many jobs ended within the first year. Issue 24 sets out Talya Bauer's four C's and looks at what role clarity, confidence and a buddy change. It closes with a card for a new person's first weeks.",
    "Vetëm 12% e punonjësve në SHBA mendojnë se organizata e tyre ua bën mirë hyrjen në punë të rinjve, dhe te një brez amerikan i ndjekur që nga 1979 shumë punë mbaruan brenda vitit të parë. Numri 24 shtjellon katër C-të e Talya Bauer-it dhe shikon çfarë ndryshojnë qartësia e rolit, besimi dhe një koleg-shoqërues. Mbyllet me një kartë për javët e para të një të riu.",
    "Nur 12 % der Beschäftigten in den USA halten ihre Organisation für gut darin, Neue einzuarbeiten, und in einer seit 1979 begleiteten US-Generation endeten viele Stellen schon im ersten Jahr. Ausgabe 24 stellt Talya Bauers vier Cs vor und fragt, was Rollenklarheit, Zutrauen und ein Pate bewirken. Zum Schluss eine Karte für die ersten Wochen einer neuen Person."),
  figure: { n: pc(12), by: "Gallup, 2018", t: x(
    "of US employees strongly agree that their organisation does a great job of onboarding new employees (2017 report).",
    "e punonjësve në SHBA pajtohen fuqishëm se organizata e tyre ua bën shumë mirë hyrjen në punë të rinjve (raporti i vitit 2017).",
    "der Beschäftigten in den USA stimmen voll zu, dass ihre Organisation neue Mitarbeitende sehr gut einarbeitet (Bericht von 2017).") },
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
        "The first weeks in a job shape whether a new person settles in. What those weeks should give them is simple to list: the rules, a clear role, the culture and, above all, people.",
        "Javët e para në një punë ndikojnë nëse një i ri do të zërë vend. Çfarë duhet t'i japin këto javë renditet lehtë: rregullat, një rol të qartë, kulturën dhe, mbi të gjitha, njerëzit.",
        "Die ersten Wochen in einer neuen Stelle entscheiden mit, ob jemand ankommt. Was diese Wochen bieten sollten, ist schnell aufgezählt: die Regeln, eine klare Rolle, die Kultur und vor allem Menschen."),
      body: x(
        "Only 12% of US employees strongly agree that their organisation onboards new people well, and only 29% of new hires feel fully prepared afterwards. Of the jobs that Americans born 1957–1964 started at 18–24, on average 61% ended within a year. Talya Bauer sums up onboarding in four C's. A meta-analysis of 70 samples finds that role clarity, confidence and acceptance by colleagues carry its effects, and at Microsoft new hires who met their buddy more often were more likely to say it had helped them become productive quickly.",
        "Vetëm 12% e punonjësve në SHBA pajtohen fuqishëm se organizata e tyre ua bën mirë hyrjen në punë të rinjve, dhe vetëm 29% e të sapopunësuarve ndihen plotësisht të përgatitur pas saj. Nga punët që amerikanët e lindur 1957–1964 i nisën në moshën 18–24 vjeç, mesatarisht 61% mbaruan brenda një viti. Talya Bauer e përmbledh hyrjen në punë në katër C. Një meta-analizë me 70 mostra gjen se efektet e saj kalojnë përmes qartësisë së rolit, besimit te vetja dhe pranimit nga kolegët. Te Microsoft-i, të rinjtë që takoheshin më shpesh me shoqëruesin thoshin më shpesh se ai i kishte ndihmuar të bëheshin shpejt produktivë.",
        "Nur 12 % der Beschäftigten in den USA stimmen voll zu, dass ihre Organisation Neue gut einarbeitet, und nur 29 % der Neuen fühlen sich danach voll vorbereitet. Von den Stellen, die US-Amerikaner der Jahrgänge 1957–1964 mit 18–24 antraten, endeten im Schnitt 61 % innerhalb eines Jahres. Talya Bauer fasst Onboarding in vier Cs zusammen. Eine Metaanalyse von 70 Stichproben zeigt, dass Rollenklarheit, Zutrauen und Akzeptanz durch Kollegen seine Wirkung tragen, und bei Microsoft sagten Neue, die ihren Paten häufiger trafen, auch häufiger, er habe ihnen geholfen, schnell produktiv zu werden."),
    },
    {
      id: "story",
      kicker: x("Cover story", "Tema kryesore", "Titelthema"),
      title: [x("Only", "Vetëm", "Nur"), x("12%", "12%", "12 %")],
      lead: x(
        "Gallup asked US employees whether their organisation does a great job of onboarding new employees. The answer comes from the survey behind its State of the American Workplace report of 2017.",
        "Gallup-i i pyeti punonjësit në SHBA nëse organizata e tyre ua bën shumë mirë hyrjen në punë të rinjve. Përgjigjja vjen nga anketa e raportit State of the American Workplace, 2017.",
        "Gallup fragte Beschäftigte in den USA, ob ihre Organisation neue Mitarbeitende sehr gut einarbeitet. Die Antwort stammt aus der Umfrage zum Bericht State of the American Workplace von 2017."),
      blocks: [
        { type: "donut", v: 12, n: pc(12), source: ["gallup-onboarding-2018"], t: x(
          "strongly agree that their organisation onboards new employees very well.",
          "pajtohen fuqishëm se organizata e tyre ua bën shumë mirë hyrjen në punë të rinjve.",
          "stimmen voll zu, dass ihre Organisation neue Mitarbeitende sehr gut einarbeitet.") },
        { type: "figures", compact: true, items: [
          { n: pc(29), t: x("of new hires feel fully prepared and supported to excel after onboarding", "e të sapopunësuarve ndihen plotësisht të përgatitur dhe të mbështetur pas hyrjes në punë", "der Neuen fühlen sich nach der Einarbeitung voll vorbereitet und unterstützt") },
          { n: x("2.6×", "2,6×", "2,6×"), t: x("as likely to be extremely satisfied at work, for those who call their onboarding exceptional", "më shumë gjasa të jenë tejet të kënaqur në punë, për ata që e quajnë hyrjen e tyre në punë të jashtëzakonshme", "so häufig äußerst zufrieden bei der Arbeit, wer die eigene Einarbeitung als außergewöhnlich bezeichnet") },
        ] },
        { type: "callout", reading: true, text: x(
          "Onboarding takes months: the time in which a person learns the role, the place and the people. The first day only opens it.",
          "Hyrja në punë zgjat muaj: koha kur njeriu mëson rolin, vendin dhe njerëzit. Dita e parë vetëm e hap.",
          "Einarbeitung dauert Monate: die Zeit, in der ein Mensch die Rolle, den Ort und die Leute kennenlernt. Der erste Tag eröffnet sie nur.") },
      ],
      note: x(
        "The 29% and the 2.6 times come from a Gallup paper of 2019; the second is a correlation, and the method is not shown.",
        "29% dhe 2,6 herë vijnë nga një studim i Gallup-it i vitit 2019; e dyta është korrelacion, dhe metoda nuk tregohet.",
        "Die 29 % und das 2,6-Fache stammen aus einem Gallup-Papier von 2019; Letzteres ist eine Korrelation, und die Methode wird nicht offengelegt."),
      source: ["gallup-onboarding-2018", "gallup-onboarding-2019"],
    },
    {
      id: "numbers",
      kicker: x("The numbers", "Shifrat", "Die Zahlen"),
      title: [x("How early", "Sa herët", "Wie früh"), x("jobs end", "mbarojnë punët", "Jobs enden")],
      lead: x(
        "Since 1979 the US Bureau of Labor Statistics has followed Americans born 1957–1964. For every job they started, it records how long the job lasted.",
        "Që nga 1979, Byroja e Statistikave të Punës e SHBA-së i ndjek amerikanët e lindur 1957–1964. Për çdo punë që nisën, shënon sa zgjati.",
        "Seit 1979 begleitet das US Bureau of Labor Statistics US-Amerikaner der Jahrgänge 1957–1964. Für jede Stelle, die sie antraten, hält es fest, wie lange sie dauerte."),
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
          "Mesatarisht patën 12,9 punë nga mosha 18 deri në 58 vjeç. Shifrat numërojnë çdo mënyrë si mbaron një punë: largimet vullnetare, pushimet nga puna dhe kontratat që skadojnë.",
          "Im Schnitt hatten sie zwischen 18 und 58 Jahren 12,9 Stellen. Die Zahlen erfassen jede Art, wie eine Stelle endet: eigene Kündigungen, Entlassungen und auslaufende Verträge.") },
        { type: "callout", reading: true, text: x(
          "A large share of jobs ends within the first year, above all for the young. That first year is precisely where onboarding does its work.",
          "Një pjesë e madhe e punëve mbaron brenda vitit të parë, sidomos te të rinjtë. Pikërisht në atë vit të parë bën punën e vet hyrja në punë.",
          "Ein großer Teil der Stellen endet im ersten Jahr, vor allem bei Jüngeren. Genau in diesem ersten Jahr wirkt die Einarbeitung.") },
      ],
      note: x(
        "One US generation, and the shares are averages per person. For Albania and Germany we have no comparable data.",
        "Një brez amerikan, dhe pjesët janë mesatare për person. Për Shqipërinë dhe Gjermaninë nuk kemi të dhëna të krahasueshme.",
        "Eine US-Generation, und die Anteile sind Durchschnitte pro Person. Für Albanien und Deutschland liegen uns keine vergleichbaren Daten vor."),
      source: ["bls-nlsy79-2025"],
    },
    {
      id: "model", more: "watch-how-i-do-it-is-not-training",
      kicker: x("The model", "Modeli", "Das Modell"),
      title: [x("The four", "Katër", "Die vier"), x("C's", "C-të", "Cs")],
      lead: x(
        "In a guide for the SHRM Foundation, Talya Bauer describes onboarding in four building blocks, from the rules to the relationships.",
        "Në një udhëzues për SHRM Foundation, Talya Bauer e përshkruan hyrjen në punë në katër blloqe, nga rregullat te marrëdhëniet.",
        "In einem Leitfaden für die SHRM Foundation beschreibt Talya Bauer die Einarbeitung in vier Bausteinen, von den Regeln bis zu den Beziehungen."),
      blocks: [
        { type: "rows", compact: true, items: [
          { h: x("Compliance", "Compliance", "Compliance"), p: x("The basic legal and policy rules.", "Rregullat bazë ligjore dhe të brendshme.", "Die grundlegenden rechtlichen und internen Regeln.") },
          { h: x("Clarification", "Clarification", "Clarification"), p: x("The tasks and expectations of the role.", "Detyrat dhe pritshmëritë e rolit.", "Die Aufgaben und Erwartungen der Rolle.") },
          { h: x("Culture", "Culture", "Culture"), p: x("The organisation's norms, formal and informal.", "Normat formale dhe joformale të organizatës.", "Die formellen und informellen Normen im Haus.") },
          { h: x("Connection", "Connection", "Connection"), p: x("The relationships with people at work.", "Marrëdhëniet me njerëzit në punë.", "Die Beziehungen zu den Menschen bei der Arbeit.") },
        ] },
        { type: "example", label: x("Hypothetical example, a new shift lead's first week", "Shembull hipotetik, java e parë e një shefi turni të ri", "Hypothetisches Beispiel, die erste Woche einer neuen Schichtleitung"), rows: [
          { k: x("Compliance", "Compliance", "Compliance"), v: x("Safety briefing and contract on day one", "Udhëzimi i sigurisë dhe kontrata ditën e parë", "Sicherheitsunterweisung und Vertrag am ersten Tag") },
          { k: x("Clarification", "Clarification", "Clarification"), v: x("The three numbers the shift is judged on", "Tre numrat me të cilët gjykohet turni", "Die drei Zahlen, an denen die Schicht gemessen wird") },
          { k: x("Culture", "Culture", "Culture"), v: x("How a mistake is reported here", "Si raportohet një gabim këtu", "Wie hier ein Fehler gemeldet wird") },
          { k: x("Connection", "Connection", "Connection"), v: x("Lunch with the buddy, coffee with the night lead", "Drekë me shoqëruesin, kafe me shefin e natës", "Mittagessen mit dem Paten, Kaffee mit der Nachtleitung") },
        ], text: x("Each C gets an owner and a day. The plan is made up.", "Çdo C ka një përgjegjës dhe një ditë. Plani është i sajuar.", "Jedes C bekommt eine verantwortliche Person und einen Tag. Der Plan ist erfunden.") },
        { type: "callout", reading: true, text: x(
          "The first two C's can be handed over on paper. The last two only happen between people.",
          "Dy C-të e para mund të jepen në letër. Dy të fundit ndodhin vetëm mes njerëzve.",
          "Die ersten beiden Cs lassen sich auf Papier übergeben. Die letzten beiden entstehen nur zwischen Menschen.") },
      ],
      note: x("The four C's follow Bauer (2010); the example is the editors'.", "Katër C-të ndjekin Bauer-in (2010); shembulli është i redaksisë.", "Die vier Cs folgen Bauer (2010); das Beispiel stammt von der Redaktion."),
      source: ["bauer-2010"],
    },
    {
      id: "research",
      kicker: x("What the research says", "Çfarë thotë kërkimi", "Was die Forschung sagt"),
      title: [x("Clarity, confidence,", "Qartësi, besim,", "Klarheit, Zutrauen,"), x("acceptance", "pranim", "Akzeptanz")],
      lead: x(
        "A meta-analysis of 70 samples of new employees, by Talya Bauer and colleagues, found three links between what an organisation does and how a new person fares: role clarity, confidence in one's own ability and acceptance by colleagues.",
        "Një meta-analizë me 70 mostra të sapopunësuarish, nga Talya Bauer dhe kolegët, gjeti tri hallka mes asaj që bën organizata dhe si i shkon një të riu: qartësinë e rolit, besimin te aftësia e vet dhe pranimin nga kolegët.",
        "Eine Metaanalyse von Talya Bauer und Kollegen mit 70 Stichproben neuer Beschäftigter fand drei Bindeglieder zwischen dem, was eine Organisation tut, und dem, wie es einer neuen Person ergeht: Rollenklarheit, Zutrauen in die eigene Fähigkeit und Akzeptanz durch Kollegen."),
      blocks: [
        { type: "p", text: x(
          "Through them, onboarding goes with job satisfaction, commitment, performance, the intention to stay and lower turnover. At Microsoft, a pilot involving 600 employees gave new hires a buddy.",
          "Përmes tyre, hyrja në punë lidhet me kënaqësinë në punë, angazhimin, rendimentin, synimin për të qëndruar dhe më pak largime. Te Microsoft-i, një projekt pilot me 600 punonjës u caktoi të rinjve një koleg-shoqërues.",
          "Über sie geht die Einarbeitung mit Arbeitszufriedenheit, Bindung, Leistung, der Absicht zu bleiben und geringerer Fluktuation einher. Bei Microsoft bekamen Neue in einem Pilotprojekt mit 600 Beschäftigten einen Paten.") },
        { type: "hbars", max: 100, source: ["klinghoffer-2019"],
          label: x("New hires who said their buddy helped them become productive quickly, by meetings in the first 90 days", "Të rinjtë që thanë se shoqëruesi i ndihmoi të bëheshin shpejt produktivë, sipas takimeve në 90 ditët e para", "Neue, die sagten, ihr Pate habe ihnen geholfen, schnell produktiv zu werden, nach Treffen in den ersten 90 Tagen"),
          items: [
            { k: x("At least once", "Të paktën një herë", "Mindestens einmal"), v: 56, n: pc(56) },
            { k: x("2–3 times", "2–3 herë", "2–3 Mal"), v: 73, n: pc(73) },
            { k: x("4–8 times", "4–8 herë", "4–8 Mal"), v: 86, n: pc(86) },
            { k: x("More than 8 times", "Më shumë se 8 herë", "Mehr als 8 Mal"), v: 97, n: pc(97), alert: true },
          ] },
        { type: "callout", reading: true, text: x(
          "What makes a buddy work is a person with time in the calendar. The meetings are what count.",
          "Ajo që e bën shoqëruesin të funksionojë është një njeri me kohë në kalendar. Vlejnë takimet.",
          "Was einen Paten wirksam macht, ist ein Mensch mit Zeit im Kalender. Es zählen die Treffen.") },
      ],
      note: x(
        "Microsoft's figures are self-reports from one company, written up by its own employees; the first group includes the others.",
        "Shifrat e Microsoft-it janë vetëvlerësime nga një kompani e vetme, të shkruara nga punonjësit e saj; grupi i parë i përfshin edhe të tjerët.",
        "Die Zahlen von Microsoft sind Selbstauskünfte aus einem einzigen Unternehmen, aufgeschrieben von dessen eigenen Beschäftigten; die erste Gruppe schließt die anderen ein."),
      source: ["bauer-2007", "klinghoffer-2019"],
    },
    {
      id: "measure",
      kicker: x("How it is measured", "Si matet", "Wie es gemessen wird"),
      title: [x("Measure the", "Mat 90", "Die ersten 90 Tage"), x("first 90 days", "ditët e para", "messen")],
      lead: x(
        "Onboarding can be measured like any process: on fixed days, with the same few questions, for every new person.",
        "Hyrja në punë matet si çdo proces: në ditë të caktuara, me të njëjtat pak pyetje, për çdo të ri.",
        "Einarbeitung lässt sich messen wie jeder Prozess: an festen Tagen, mit denselben wenigen Fragen, für jede neue Person."),
      blocks: [
        { type: "steps", items: [
          { h: x("Day 30, 60 and 90", "Dita 30, 60 dhe 90", "Tag 30, 60 und 90"), p: x("A short conversation on fixed days, booked on day one.", "Një bisedë e shkurtër në ditë të caktuara, e caktuar që ditën e parë.", "Ein kurzes Gespräch an festen Tagen, schon am ersten Tag eingeplant.") },
          { h: x("Three questions", "Tri pyetje", "Drei Fragen"), p: x("Is the role clear? Do you feel able to do it? Do you feel accepted by the team?", "A është i qartë roli? A ndihesh i aftë ta bësh? A ndihesh i pranuar nga ekipi?", "Ist die Rolle klar? Trauen Sie sie sich zu? Fühlen Sie sich vom Team angenommen?") },
          { h: x("Count the buddy meetings", "Numëro takimet me shoqëruesin", "Die Treffen mit dem Paten zählen"), p: x("How often did the new person and the buddy actually meet?", "Sa herë u takuan vërtet i riu dhe shoqëruesi?", "Wie oft haben sich die neue Person und der Pate tatsächlich getroffen?") },
          { h: x("See who stays", "Shiko kush qëndron", "Sehen, wer bleibt"), p: x("Of everyone who started, how many are still here after 6 and 12 months.", "Nga të gjithë ata që nisën, sa janë ende këtu pas 6 dhe 12 muajsh.", "Von allen, die angefangen haben: wie viele nach 6 und 12 Monaten noch da sind.") },
        ] },
        { type: "example", label: x("Hypothetical example, ten new hires in one quarter", "Shembull hipotetik, dhjetë të rinj në një tremujor", "Hypothetisches Beispiel, zehn Neue in einem Quartal"), rows: [
          { k: x("Day 30", "Dita 30", "Tag 30"), v: x("8 of 10 say the role is clear", "8 nga 10 thonë se roli është i qartë", "8 von 10 sagen, die Rolle sei klar") },
          { k: x("Day 90", "Dita 90", "Tag 90"), v: x("9 of 10 feel accepted by the team", "9 nga 10 ndihen të pranuar nga ekipi", "9 von 10 fühlen sich vom Team angenommen") },
          { k: x("12 months", "12 muaj", "12 Monate"), v: x("8 of 10 still here", "8 nga 10 ende këtu", "8 von 10 noch da") },
        ], text: x("Talk first to the two who said on day 30 that the role was unclear. The numbers are invented.", "Fol së pari me ata dy që thanë në ditën 30 se roli nuk ishte i qartë. Numrat janë të shpikur.", "Sprechen Sie zuerst mit den beiden, die an Tag 30 sagten, die Rolle sei unklar. Die Zahlen sind erfunden.") },
      ],
      note: x(
        "The three questions follow Bauer et al. (2007); the steps and the example are ours.",
        "Tri pyetjet ndjekin Bauer et al. (2007); hapat dhe shembulli janë të redaksisë.",
        "Die drei Fragen folgen Bauer et al. (2007); Schritte und Beispiel stammen von uns."),
      source: ["bauer-2007"],
    },
    {
      id: "tool",
      kicker: x("Tool of the issue", "Mjeti i numrit", "Werkzeug der Ausgabe"),
      title: [x("The first-weeks", "Karta e javëve", "Die Karte für die"), x("card", "të para", "ersten Wochen")],
      lead: x(
        "One card for each new person, filled in by the manager before the first day. At Google, managers got a similar list by email on the Sunday before a new person started.",
        "Një kartë për çdo të ri, e plotësuar nga menaxheri para ditës së parë. Te Google-i, menaxherët merrnin një listë të ngjashme me email të dielën para se të fillonte i riu.",
        "Eine Karte für jede neue Person, von der Führungskraft vor dem ersten Tag ausgefüllt. Bei Google erhielten Führungskräfte eine ähnliche Liste per Mail am Sonntag vor dem Start."),
      blocks: [
        { type: "form", items: [
          { h: x("Before day one", "Para ditës së parë", "Vor dem ersten Tag"), hint: x("documents ready; the talk about the role and its responsibilities booked", "dokumentet gati; biseda për rolin dhe përgjegjësitë e caktuar", "Unterlagen bereit; das Gespräch über Rolle und Verantwortung eingeplant") },
          { h: x("Buddy", "Shoqëruesi", "Pate"), hint: x("name, and how often they meet in the first 90 days", "emri, dhe sa shpesh takohen në 90 ditët e para", "Name, und wie oft sie sich in den ersten 90 Tagen treffen") },
          { h: x("People to meet", "Njerëzit për t'u takuar", "Menschen zum Kennenlernen"), hint: x("five names, and why each one matters", "pesë emra, dhe pse ka rëndësi secili", "fünf Namen, und warum jeder zählt"), lines: 2 },
          { h: x("Check-ins", "Takimet e kontrollit", "Abstimmungstermine"), hint: x("once a month for the first six months: the dates", "një herë në muaj për gjashtë muajt e parë: datat", "einmal im Monat in den ersten sechs Monaten: die Termine") },
          { h: x("Open questions", "Pyetjet e hapura", "Offene Fragen"), hint: x("how and when the new person can ask anything", "si dhe kur mund të pyesë i riu për çdo gjë", "wie und wann die neue Person alles fragen kann") },
          { h: x("Day 90", "Dita 90", "Tag 90"), hint: x("role clear? able to do it? accepted by the team?", "roli i qartë? i aftë ta bëjë? i pranuar nga ekipi?", "Rolle klar? Zutrauen? Vom Team angenommen?") },
        ] },
      ],
      note: x(
        "Suggested by the editors, after Google's five actions for managers (Bock, 2015) and Bauer's four C's.",
        "Sugjerim i redaksisë, sipas pesë veprimeve të Google-it për menaxherët (Bock, 2015) dhe katër C-ve të Bauer-it.",
        "Von der Redaktion vorgeschlagen, angelehnt an Googles fünf Schritte für Führungskräfte (Bock, 2015) und Bauers vier Cs."),
      source: ["bock-onboarding-2015", "bauer-2010"],
    },
    { id: "sources", type: "sources" },
    { id: "back", type: "back" },
  ],
};
