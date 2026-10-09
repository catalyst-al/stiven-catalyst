// Management Review, No. 7: Few goals, clear ones. Block: KPIs.
// Facts and their sources: docs/revista/management-review-nr-07.md.
import { x, pc } from "../common.js";

export default {
  number: 7,
  block: "kpi",
  date: x("October 2026", "Tetor 2026", "Oktober 2026"),
  theme: [x("Few goals,", "Pak qëllime,", "Wenige Ziele,"), x("clear ones", "të qarta", "klare Ziele")],
  sub: x(
    "Why a clear, difficult goal works better than \"do your best\", what happens when there are too many, and when goals do harm.",
    "Pse një qëllim i qartë dhe i vështirë punon më mirë se \"bëj më të mirën\", çfarë ndodh kur janë shumë, dhe kur qëllimet bëjnë dëm.",
    "Warum ein klares, anspruchsvolles Ziel besser wirkt als „Gib dein Bestes“, was passiert, wenn es zu viele sind, und wann Ziele schaden."),
  seo: x(
    "Few, clear goals: Locke and Latham's research, SMART from 1981, the side effects of goals, Gallup on expectations and a one-page goal card.",
    "Pak qëllime, të qarta: kërkimi i Locke dhe Latham, SMART-i i 1981, efektet anësore të qëllimeve, Gallup për pritjet dhe një kartë qëllimi.",
    "Wenige, klare Ziele: Locke und Latham, SMART von 1981, Nebenwirkungen von Zielen, Gallup zu Erwartungen und eine Zielkarte auf einer Seite."),
  feature: x(
    "Issue 7 starts with 35 years of research on goals, takes SMART apart letter by letter, looks at the side effects researchers warned about in 2009, and ends with a count of how many goals your team really has.",
    "Numri 7 nis me 35 vjet kërkime për qëllimet, e zbërthen SMART-in shkronjë për shkronjë, shikon efektet anësore për të cilat paralajmëruan studiuesit në 2009, dhe mbyllet me një numërim të qëllimeve që ka vërtet ekipi yt.",
    "Ausgabe 7 beginnt mit 35 Jahren Zielforschung, nimmt SMART Buchstabe für Buchstabe auseinander, betrachtet die Nebenwirkungen, vor denen Forschende 2009 warnten, und endet damit, die Ziele zu zählen, die Ihr Team wirklich hat."),
  figure: { n: pc(49), by: "Gallup, 2026", t: x(
    "of US employees strongly agree that they know what is expected of them at work. The item has fallen nine points since 2020.",
    "e punonjësve në SHBA thonë fuqishëm se e dinë çfarë pritet prej tyre në punë. Pyetja ka rënë 9 pikë që nga 2020.",
    "der Beschäftigten in den USA stimmen voll zu, dass sie wissen, was bei der Arbeit von ihnen erwartet wird. Der Wert ist seit 2020 um neun Punkte gefallen.") },
  teasers: [
    { page: "story", kicker: x("Cover story", "Tema kryesore", "Titelthema"),
      title: x("\"Do your best\" is not a goal", "\"Bëj më të mirën\" nuk është qëllim", "„Gib dein Bestes“ ist kein Ziel") },
    { page: "risk", kicker: x("The risk", "Rreziku", "Das Risiko"),
      title: x("When goals do harm", "Kur qëllimet bëjnë dëm", "Wenn Ziele schaden") },
    { page: "tool", kicker: x("Tool of the issue", "Mjeti i numrit", "Werkzeug der Ausgabe"),
      title: x("The goal card", "Karta e qëllimit", "Die Zielkarte") },
  ],
  sources: ["locke-latham-2002", "doran-1981", "ordonez-2009", "locke-latham-2009", "mcchesney-2012", "gallup-indicator", "gallup-us-2026", "gallup-q12"],
  pages: [
    { id: "cover", type: "cover" },
    {
      id: "intro", type: "intro",
      why: x(
        "A team with many goals in fact has few. This issue is about goals that work: specific, difficult and few, and about the harm they do when they are set badly.",
        "Një ekip me shumë qëllime ka në fakt pak. Ky numër flet për qëllimet që punojnë: specifike, të vështira dhe të pakta, dhe për dëmin që bëjnë kur vendosen keq.",
        "Ein Team mit vielen Zielen hat in Wahrheit wenige. Diese Ausgabe handelt von Zielen, die wirken: konkret, anspruchsvoll und wenige, und vom Schaden, den sie anrichten, wenn sie schlecht gesetzt werden."),
      body: x(
        "In 2002 Edwin Locke and Gary Latham summed up three and a half decades of research on goals. George Doran gave managers SMART in 1981. In 2009 four researchers warned about the side effects of goals. And Gallup finds that only about half of US employees clearly know what is expected of them.",
        "Në 2002, Edwin Locke dhe Gary Latham përmblodhën tre dekada e gjysmë kërkime për qëllimet. George Doran u dha menaxherëve SMART-in në 1981. Në 2009, katër studiues paralajmëruan për efektet anësore të qëllimeve. Dhe Gallup gjen se vetëm rreth gjysma e punonjësve në SHBA e dinë qartë çfarë pritet prej tyre.",
        "2002 fassten Edwin Locke und Gary Latham dreieinhalb Jahrzehnte Zielforschung zusammen. George Doran gab Führungskräften 1981 SMART an die Hand. 2009 warnten vier Forschende vor den Nebenwirkungen von Zielen. Und Gallup stellt fest, dass nur etwa die Hälfte der Beschäftigten in den USA klar weiß, was von ihnen erwartet wird."),
    },
    {
      id: "story",
      kicker: x("Cover story", "Tema kryesore", "Titelthema"),
      title: [x("\"Do your best\"", "\"Bëj më të mirën\"", "„Gib dein Bestes“"), x("is not a goal", "nuk është qëllim", "ist kein Ziel")],
      lead: x(
        "In 2002 Edwin Locke and Gary Latham summed up 35 years of research. The central finding: specific, difficult goals lead to better results than the call to \"do your best\".",
        "Në 2002, Edwin Locke dhe Gary Latham përmblodhën 35 vjet kërkime. Gjetja qendrore: qëllimet specifike dhe të vështira çojnë në rezultate më të mira se thirrja \"bëj më të mirën\".",
        "2002 fassten Edwin Locke und Gary Latham 35 Jahre Forschung zusammen. Der zentrale Befund: Konkrete, anspruchsvolle Ziele führen zu besseren Ergebnissen als der Aufruf „Gib dein Bestes“."),
      blocks: [
        { type: "p", text: x(
          "The reason: \"do your best\" has no reference point, so everyone measures it for themselves. Performance rose with the difficulty of the goal until it reached the limits of ability or commitment fell. Three things strengthen or weaken the effect: commitment to the goal, feedback on progress and the complexity of the task. On new, complex tasks a learning goal can work better than a number.",
          "Arsyeja: \"bëj më të mirën\" nuk ka pikë reference, dhe secili e mat vetë. Rezultati rritej bashkë me vështirësinë e qëllimit, derisa arrinte kufijtë e aftësisë ose binte angazhimi. Tri gjëra e forcojnë ose e dobësojnë efektin: angazhimi ndaj qëllimit, feedback-u për ecurinë dhe kompleksiteti i detyrës. Te detyrat e reja dhe të ndërlikuara, një qëllim për të mësuar mund të punojë më mirë se një shifër.",
          "Der Grund: „Gib dein Bestes“ hat keinen Bezugspunkt, also misst es jeder für sich. Die Leistung stieg mit der Schwierigkeit des Ziels, bis die Grenzen der Fähigkeit erreicht waren oder die Bindung an das Ziel nachließ. Drei Dinge verstärken oder schwächen den Effekt: die Bindung an das Ziel, Rückmeldung zum Fortschritt und die Komplexität der Aufgabe. Bei neuen, komplexen Aufgaben kann ein Lernziel besser wirken als eine Zahl.") },
        { type: "lists", cols: [
          { h: x("\"Do your best\"", "\"Bëj më të mirën\"", "„Gib dein Bestes“"), accent: true, items: [
            x("No reference point", "Pa pikë reference", "Kein Bezugspunkt"),
            x("Everyone measures it alone", "Secili e mat vetë", "Jeder misst für sich"),
            x("Nobody knows when it is enough", "Askush nuk e di kur mjafton", "Niemand weiß, wann es genug ist"),
          ] },
          { h: x("Clear and difficult", "I qartë dhe i vështirë", "Klar und schwer"), items: [
            x("A number and a date", "Një shifër dhe një afat", "Eine Zahl und ein Termin"),
            x("The same for everyone", "I njëjti për të gjithë", "Für alle gleich"),
            x("Feedback shows where you stand", "Feedback-u tregon ku je", "Rückmeldung zeigt, wo man steht"),
          ] },
        ] },
        { type: "timeline", items: [
          { k: "1981", t: x("Doran: SMART, five criteria for an objective.", "Doran: SMART, pesë kritere për një objektiv.", "Doran: SMART, fünf Kriterien für ein Ziel.") },
          { k: "2002", t: x("Locke and Latham: 35 years of research on goals.", "Locke dhe Latham: 35 vjet kërkime për qëllimet.", "Locke und Latham: 35 Jahre Zielforschung.") },
          { k: "2009", t: x("\"Goals Gone Wild\": goals have side effects.", "\"Goals Gone Wild\": qëllimet kanë efekte anësore.", "„Goals Gone Wild“: Ziele haben Nebenwirkungen.") },
          { k: "2012", t: x("4DX: one or two wildly important goals per team.", "4DX: një ose dy qëllime shumë të rëndësishme për ekip.", "4DX: ein oder zwei äußerst wichtige Ziele pro Team.") },
        ] },
        { type: "callout", reading: true, text: x(
          "A vague goal does not lower the pressure. It moves it to each person, who decides alone what \"enough\" means.",
          "Një qëllim i paqartë nuk e ul presionin. E zhvendos te çdo njeri, që vendos vetë çfarë do të thotë \"mjaft\".",
          "Ein vages Ziel senkt den Druck nicht. Es verlagert ihn auf jede einzelne Person, die allein entscheidet, was „genug“ heißt.") },
      ],
      source: ["locke-latham-2002", "doran-1981", "ordonez-2009", "mcchesney-2012"],
    },
    {
      id: "numbers",
      kicker: x("The numbers", "Shifrat", "Die Zahlen"),
      title: [x("Only half know", "Vetëm gjysma", "Nur die Hälfte weiß,"), x("what is expected", "e di çfarë pritet", "was erwartet wird")],
      lead: x(
        "Gallup asks employees whether they know what is expected of them at work. In the US this item has fallen more than any other since 2020.",
        "Gallup pyet punonjësit nëse e dinë çfarë pritet prej tyre në punë. Në SHBA, kjo pyetje ka rënë më shumë se çdo tjetër që nga 2020.",
        "Gallup fragt Beschäftigte, ob sie wissen, was bei der Arbeit von ihnen erwartet wird. In den USA ist dieser Wert seit 2020 stärker gefallen als jeder andere."),
      blocks: [
        { type: "donut", v: 49, n: pc(49), source: ["gallup-indicator"], t: x(
          "of US employees strongly agree that they know what is expected of them (Gallup, 2026).",
          "e punonjësve në SHBA thonë fuqishëm se e dinë çfarë pritet prej tyre (Gallup, 2026).",
          "der Beschäftigten in den USA stimmen voll zu, dass sie wissen, was von ihnen erwartet wird (Gallup, 2026).") },
        { type: "figures", compact: true, items: [
          { n: x("−9 points", "−9 pikë", "−9 Punkte"), t: x("since 2020, the largest drop among Gallup's twelve items in the US", "që nga 2020, rënia më e madhe mes dymbëdhjetë pyetjeve të Gallup në SHBA", "seit 2020, der größte Rückgang unter Gallups zwölf Fragen in den USA") },
          { n: x("0.42–0.80", "0,42–0,80", "0,42–0,80"), t: x("effect size of specific, difficult goals over \"do your best\" in earlier reviews (Locke & Latham)", "madhësia e efektit të qëllimeve specifike e të vështira kundrejt \"bëj më të mirën\" te përmbledhjet e mëparshme (Locke & Latham)", "Effektstärke konkreter, schwerer Ziele gegenüber „Gib dein Bestes“ in früheren Übersichten (Locke & Latham)") },
          { n: x("1–2", "1–2", "1–2"), t: x("wildly important goals per team, as 4DX advises", "qëllime shumë të rëndësishme për ekip, siç këshillon 4DX", "äußerst wichtige Ziele pro Team, wie 4DX rät") },
        ] },
        { type: "p", text: x(
          "Gallup places this item at the base of engagement: among its twelve elements, knowing what is expected is one of the two basic needs on which the others rest.",
          "Gallup e vendos këtë pyetje në bazë të angazhimit: mes dymbëdhjetë elementeve të saj, të dish çfarë pritet është një nga dy nevojat bazë mbi të cilat mbështeten të tjerat.",
          "Gallup stellt diese Frage an die Basis des Engagements: Unter den zwölf Elementen ist das Wissen um die Erwartungen eines der zwei Grundbedürfnisse, auf denen die anderen ruhen.") },
        { type: "callout", reading: true, text: x(
          "The question \"do you know what is expected of you?\" costs a minute. Not having the answer costs a shift.",
          "Pyetja \"a e di çfarë pritet prej teje?\" kushton një minutë. Mungesa e përgjigjes kushton një turn.",
          "Die Frage „Weißt du, was von dir erwartet wird?“ kostet eine Minute. Keine Antwort darauf kostet eine Schicht.") },
      ],
      source: ["gallup-indicator", "gallup-us-2026", "gallup-q12", "locke-latham-2002", "mcchesney-2012"],
    },
    {
      id: "model",
      kicker: x("The model", "Modeli", "Das Modell"),
      title: [x("SMART,", "SMART,", "SMART"), x("and what it lacks", "dhe çfarë i mungon", "und was fehlt")],
      lead: x(
        "George Doran wrote SMART in 1981, in a two-page article. In the original, A stood for \"assignable\" and R for \"realistic\"; later versions changed them.",
        "George Doran e shkroi SMART-in në 1981, në një artikull dy faqesh. Në origjinal, A-ja ishte \"me përgjegjës\" dhe R-ja \"realist\"; versionet e mëvonshme i ndryshuan.",
        "George Doran schrieb SMART 1981 in einem zweiseitigen Artikel. Im Original stand A für „zuordenbar“ und R für „realistisch“; spätere Fassungen änderten das."),
      blocks: [
        { type: "chain", items: [
          { h: x("Specific", "Specifik", "Spezifisch"), p: x("One area, named clearly.", "Një fushë, e emërtuar qartë.", "Ein Bereich, klar benannt.") },
          { h: x("Measurable", "I matshëm", "Messbar"), p: x("A number or a clear sign of progress.", "Një shifër ose një shenjë e qartë ecurie.", "Eine Zahl oder ein klares Zeichen für Fortschritt.") },
          { h: x("Assignable", "Me përgjegjës", "Zuordenbar"), p: x("Who owns it.", "Kush e mban.", "Wer es verantwortet.") },
          { h: x("Realistic", "Realist", "Realistisch"), p: x("Achievable with the resources at hand.", "I arritshëm me burimet që ke.", "Mit den vorhandenen Mitteln erreichbar.") },
          { h: x("Time-related", "Me afat", "Terminiert"), p: x("When the result is due.", "Kur duhet parë rezultati.", "Wann das Ergebnis fällig ist.") },
        ] },
        { type: "example", label: x("Hypothetical example, one goal before and after", "Shembull hipotetik, një qëllim para dhe pas", "Hypothetisches Beispiel, ein Ziel vorher und nachher"), rows: [
          { k: x("Before", "Para", "Vorher"), v: x("Improve the service.", "Përmirëso shërbimin.", "Den Service verbessern.") },
          { k: x("After", "Pas", "Nachher"), v: x("Cut delay complaints from 40 to 25 a week by 30 November; owned by the evening shift lead.", "Ul ankesat për vonesë nga 40 në 25 në javë deri më 30 nëntor; e mban shefi i turnit të mbrëmjes.", "Verspätungsbeschwerden bis 30. November von 40 auf 25 pro Woche senken; verantwortlich ist die Leitung der Abendschicht.") },
        ], text: x("The numbers are invented.", "Numrat janë të shpikur.", "Die Zahlen sind erfunden.") },
        { type: "lists", cols: [
          { h: x("SMART asks for", "SMART kërkon", "SMART verlangt"), items: [
            x("A clear, measurable goal", "Qëllim të qartë e të matshëm", "Ein klares, messbares Ziel"),
            x("An owner, a deadline, a realistic target", "Përgjegjës, afat, objektiv realist", "Verantwortung, Termin, realistisches Ziel"),
          ] },
          { h: x("The research adds", "Kërkimi shton", "Die Forschung ergänzt"), accent: true, items: [
            x("Difficulty: hard goals do more", "Vështirësi: qëllimet e vështira japin më shumë", "Schwierigkeit: schwere Ziele bewirken mehr"),
            x("Commitment, and feedback on progress", "Angazhim, dhe feedback për ecurinë", "Bindung und Rückmeldung zum Fortschritt"),
          ] },
        ] },
        { type: "callout", reading: true, text: x(
          "SMART makes a goal clear. It does not tell you whether it is the right goal, or how many goals a team can carry.",
          "SMART e bën qëllimin të qartë. Nuk të thotë nëse është qëllimi i duhur, as sa qëllime mund të mbajë një ekip.",
          "SMART macht ein Ziel klar. Es sagt nicht, ob es das richtige Ziel ist und wie viele Ziele ein Team tragen kann.") },
      ],
      note: x(
        "Doran himself wrote that not every objective has to be measured in numbers.",
        "Doran vetë shkroi se jo çdo objektiv duhet matur me numra.",
        "Doran schrieb selbst, dass nicht jedes Ziel in Zahlen gemessen werden muss."),
      source: ["doran-1981", "locke-latham-2002"],
    },
    {
      id: "risk",
      kicker: x("The risk", "Rreziku", "Das Risiko"),
      title: [x("When goals", "Kur qëllimet", "Wenn Ziele"), x("do harm", "bëjnë dëm", "schaden")],
      lead: x(
        "In 2009 four researchers wrote that goals are like a prescription drug: they work, but they have side effects and need careful dosing.",
        "Në 2009, katër studiues shkruan se qëllimet janë si një ilaç me recetë: punojnë, por kanë efekte anësore dhe duan dozë të kujdesshme.",
        "2009 schrieben vier Forschende, Ziele seien wie ein verschreibungspflichtiges Medikament: Sie wirken, haben aber Nebenwirkungen und brauchen eine sorgfältige Dosierung."),
      blocks: [
        { type: "rows", items: [
          { h: x("Narrow focus", "Fokus i ngushtë", "Enger Fokus"), p: x("What is not measured is neglected, even when it matters.", "Ajo që nuk matet lihet pas dore, edhe kur ka rëndësi.", "Was nicht gemessen wird, wird vernachlässigt, auch wenn es wichtig ist.") },
          { h: x("Unethical behaviour", "Sjellje joetike", "Unethisches Verhalten"), p: x("When the number is all that counts, some reach it by any means.", "Kur shifra është e vetmja gjë që ka rëndësi, disa e arrijnë me çdo mjet.", "Wenn nur die Zahl zählt, erreichen manche sie mit allen Mitteln.") },
          { h: x("Excess risk", "Rrezik i tepërt", "Übermäßiges Risiko"), p: x("Goals that are too hard push people towards risks nobody would otherwise accept.", "Qëllimet shumë të vështira shtyjnë drejt rreziqeve që askush nuk do t'i pranonte ndryshe.", "Zu schwere Ziele treiben Menschen zu Risiken, die sonst niemand eingehen würde.") },
        ] },
        { type: "example", label: x("Hypothetical example, a call centre", "Shembull hipotetik, një qendër thirrjesh", "Hypothetisches Beispiel, ein Callcenter"), text: x(
          "The team is measured only on call length. Agents close calls quickly, and customers call again. The number improves; the problem does not.",
          "Ekipi matet vetëm me kohëzgjatjen e bisedës. Operatorët i mbyllin thirrjet shpejt, dhe klientët telefonojnë sërish. Numri përmirësohet, problemi jo.",
          "Das Team wird nur an der Gesprächsdauer gemessen. Die Beschäftigten beenden Anrufe schnell, und die Kunden rufen erneut an. Die Zahl wird besser, das Problem nicht.") },
        { type: "p", text: x(
          "Locke and Latham contested the critique the same year. The authors of The 4 Disciplines of Execution (2012) add a practical limit: one or two wildly important goals per team, because the more goals at once, the fewer are achieved well.",
          "Locke dhe Latham e kundërshtuan kritikën po atë vit. Autorët e The 4 Disciplines of Execution (2012) shtojnë një kufi praktik: një ose dy qëllime shumë të rëndësishme për ekip, sepse sa më shumë qëllime njëherësh, aq më pak arrihen mirë.",
          "Locke und Latham widersprachen der Kritik noch im selben Jahr. Die Autoren von The 4 Disciplines of Execution (2012) ergänzen eine praktische Grenze: ein oder zwei äußerst wichtige Ziele pro Team, denn je mehr Ziele gleichzeitig, desto weniger werden gut erreicht.") },
        { type: "callout", reading: true, text: x(
          "The second question after \"what is the goal?\" is \"what are we neglecting to reach it?\"",
          "Pyetja e dytë pas \"cili është qëllimi?\" është \"çfarë po lëmë pas dore për ta arritur?\"",
          "Die zweite Frage nach „Was ist das Ziel?“ lautet: „Was vernachlässigen wir, um es zu erreichen?“") },
      ],
      source: ["ordonez-2009", "locke-latham-2009", "mcchesney-2012"],
    },
    {
      id: "measure", more: "ten-minutes-before-the-shift",
      kicker: x("How it is measured", "Si matet", "Wie man es misst"),
      title: [x("How many goals", "Sa qëllime", "Wie viele Ziele"), x("does your team have?", "ka ekipi yt?", "hat Ihr Team?")],
      lead: x(
        "Goals arrive from many directions: the company, the boss, the customer, the audit. Counting them is the first step to making them few and clear.",
        "Qëllimet vijnë nga shumë drejtime: kompania, shefi, klienti, auditimi. Numërimi i tyre është hapi i parë për t'i bërë të pakta dhe të qarta.",
        "Ziele kommen aus vielen Richtungen: vom Unternehmen, vom Chef, vom Kunden, aus dem Audit. Sie zu zählen ist der erste Schritt, sie wenige und klar zu machen."),
      blocks: [
        { type: "steps", items: [
          { h: x("Count", "Numëro", "Zählen"), p: x("Write down every goal, target or threshold the team is asked to hit, from every source.", "Shkruaj çdo qëllim, objektiv ose prag që ekipit i kërkohet të arrijë, nga çdo burim.", "Jedes Ziel, jede Vorgabe und jede Schwelle notieren, die das Team erreichen soll, aus jeder Quelle.") },
          { h: x("Ask the team", "Pyet ekipin", "Das Team fragen"), p: x("Ask the team to name the goals without notes. Mark which ones they mention.", "Kërkoji ekipit t'i thotë qëllimet pa letër. Shëno cilat përmenden.", "Das Team die Ziele ohne Notizen nennen lassen. Markieren, welche genannt werden.") },
          { h: x("Choose", "Zgjidh", "Auswählen"), p: x("One or two for the quarter, with the reason why.", "Një ose dy për tremujorin, me arsyen pse.", "Ein oder zwei für das Quartal, mit Begründung.") },
          { h: x("Say it openly", "Thuaje hapur", "Offen sagen"), p: x("What moves to second place, and who knows it.", "Çfarë kalon në plan të dytë, dhe kush e di këtë.", "Was auf den zweiten Platz rückt, und wer das weiß.") },
        ] },
        { type: "example", label: x("Hypothetical example, a warehouse team", "Shembull hipotetik, një ekip magazine", "Hypothetisches Beispiel, ein Lagerteam"), text: x(
          "The team has nine targets from three sources. Without notes, people name three. The lead picks two for the quarter and writes them on the board; the others are kept but not discussed every day. The numbers are invented.",
          "Ekipi ka nëntë objektiva nga tre burime. Pa letër, njerëzit përmendin tre. Shefi zgjedh dy për tremujorin dhe i shkruan te tabela; të tjerët mbahen, por nuk diskutohen çdo ditë. Numrat janë të shpikur.",
          "Das Team hat neun Vorgaben aus drei Quellen. Ohne Notizen nennen die Leute drei. Die Leitung wählt zwei für das Quartal und schreibt sie an die Tafel; die anderen bleiben, werden aber nicht täglich besprochen. Die Zahlen sind erfunden.") },
        { type: "callout", reading: true, text: x(
          "A team with nine goals has, in practice, one: the one the boss asked about last.",
          "Ekipi që ka nëntë qëllime ka në praktikë një: atë për të cilin shefi pyeti i fundit.",
          "Ein Team mit neun Zielen hat in der Praxis eines: das, nach dem der Chef zuletzt gefragt hat.") },
      ],
      note: x("The steps and the example are the editors'.", "Hapat dhe shembulli janë të redaksisë.", "Schritte und Beispiel stammen von der Redaktion."),
    },
    {
      id: "tool", tool: "/tools/kpi-diagnostic/",
      kicker: x("Tool of the issue", "Mjeti i numrit", "Werkzeug der Ausgabe"),
      title: [x("The", "Karta", "Die"), x("goal card", "e qëllimit", "Zielkarte")],
      lead: x(
        "One goal, one page. Fill it in with the team and put it where every shift sees it.",
        "Një qëllim, një faqe. Plotësoje me ekipin dhe vare aty ku e sheh çdo turn.",
        "Ein Ziel, eine Seite. Mit dem Team ausfüllen und dort aufhängen, wo jede Schicht sie sieht."),
      blocks: [
        { type: "form", items: [
          { h: x("The goal, in one sentence", "Qëllimi, me një fjali", "Das Ziel in einem Satz"), hint: x("from X to Y, by when", "nga X në Y, deri kur", "von X auf Y, bis wann"), lines: 2 },
          { h: x("Why it matters", "Pse ka rëndësi", "Warum es wichtig ist"), hint: x("for the customer or the team", "për klientin ose për ekipin", "für Kunden oder Team") },
          { h: x("What we do every week", "Çfarë bëjmë çdo javë", "Was wir jede Woche tun"), hint: x("the signal that moves the goal", "sinjali që e lëviz qëllimin", "das Signal, das das Ziel bewegt"), lines: 2 },
          { h: x("Who owns it", "Kush e mban", "Wer es verantwortet"), hint: x("one role, not a group", "një rol, jo një grup", "eine Rolle, keine Gruppe") },
          { h: x("What we set aside", "Çfarë lëmë pas dore", "Was wir zurückstellen"), hint: x("so that this goal can happen", "që ky qëllim të ndodhë", "damit dieses Ziel gelingt") },
          { h: x("Review", "Rishikimi", "Überprüfung"), hint: x("date, and where we are", "data, dhe ku jemi", "Datum, und wo wir stehen") },
        ] },
      ],
      note: x(
        "A practice proposed by the editors, after Locke and Latham and Doran. Do not write confidential figures on the card.",
        "Praktikë e propozuar nga redaksia, mbi idetë e Locke dhe Latham dhe të Doran. Mos shkruaj shifra konfidenciale në kartë.",
        "Eine Praxis, die die Redaktion nach Locke und Latham sowie Doran vorschlägt. Keine vertraulichen Zahlen auf die Karte schreiben."),
    },
    { id: "sources", type: "sources" },
    { id: "back", type: "back" },
  ],
};
