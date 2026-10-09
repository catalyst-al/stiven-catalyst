// Management Review, No. 19: Feedback that changes behaviour. Block: People.
// Facts and their sources: docs/revista/management-review-nr-19.md.
import { x, pc } from "../common.js";

export default {
  number: 19,
  block: "people",
  date: x("October 2026", "Tetor 2026", "Oktober 2026"),
  theme: [x("Feedback that", "Feedback-u që", "Feedback, das"), x("changes behaviour", "ndryshon sjelljen", "Verhalten ändert")],
  sub: x(
    "Why over a third of feedback made performance worse, how much of a rating is about the rater, the situation-behaviour-impact model, and a card for your next conversation.",
    "Pse mbi një e treta e feedback-ut e përkeqësoi performancën, sa nga një vlerësim flet për vlerësuesin, modeli situatë–sjellje–ndikim, dhe një kartë për bisedën e radhës.",
    "Warum über ein Drittel des Feedbacks die Leistung verschlechterte, wie viel einer Bewertung von den Beurteilenden handelt, das Modell Situation–Verhalten–Wirkung und eine Karte fürs nächste Gespräch."),
  seo: x(
    "Feedback that changes behaviour: why over a third of feedback lowered performance, what ratings measure, the SBI model and a card for your next talk.",
    "Feedback-u që ndryshon sjelljen: pse mbi një e treta e feedback-ut e uli performancën, çfarë matin vlerësimet, modeli SBI dhe një kartë për bisedën.",
    "Feedback, das Verhalten ändert: warum über ein Drittel des Feedbacks die Leistung senkte, was Bewertungen messen, das SBI-Modell und eine Karte."),
  feature: x(
    "Issue 19 starts with a meta-analysis of 607 effects in which more than a third of feedback interventions lowered performance, shows how much of a rating says more about the rater than about the person rated, sets out the situation-behaviour-impact model, looks at what makes feedback useful, and ends with a card for your next conversation.",
    "Numri 19 nis me një meta-analizë me 607 efekte ku mbi një e treta e ndërhyrjeve me feedback e ulën performancën, tregon sa nga një vlerësim flet më shumë për vlerësuesin se për të vlerësuarin, shtjellon modelin situatë–sjellje–ndikim, shikon çfarë e bën feedback-un të dobishëm, dhe mbyllet me një kartë për bisedën tënde të radhës.",
    "Ausgabe 19 beginnt mit einer Metaanalyse von 607 Effekten, in der mehr als ein Drittel der Feedback-Interventionen die Leistung senkte, zeigt, wie viel einer Bewertung mehr über die Beurteilenden sagt als über die beurteilte Person, stellt das Modell Situation–Verhalten–Wirkung vor, betrachtet, was Feedback nützlich macht, und endet mit einer Karte für das nächste Gespräch."),
  figure: { n: x("> 1/3", "> 1/3", "> 1/3"), by: "Kluger & DeNisi, 1996", t: x(
    "of feedback interventions lowered performance instead of raising it, in a meta-analysis of 607 effects.",
    "e ndërhyrjeve me feedback e ulën performancën në vend që ta rritnin, në një meta-analizë me 607 efekte.",
    "der Feedback-Interventionen senkten die Leistung, statt sie zu steigern, in einer Metaanalyse von 607 Effekten.") },
  teasers: [
    { page: "story", kicker: x("Cover story", "Tema kryesore", "Titelthema"),
      title: x("When feedback backfires", "Kur feedback-u kthehet kundër", "Wenn Feedback nach hinten losgeht") },
    { page: "model", kicker: x("The model", "Modeli", "Das Modell"),
      title: x("Situation, behaviour, impact", "Situata, sjellja, ndikimi", "Situation, Verhalten, Wirkung") },
    { page: "tool", kicker: x("Tool of the week", "Mjeti i javës", "Werkzeug der Woche"),
      title: x("The feedback card", "Karta e feedback-ut", "Die Feedbackkarte") },
  ],
  sources: ["kluger-denisi-1996", "scullen-2000", "gallup-reviews-2019", "buckingham-goodall-2015", "ccl-sbi", "wisniewski-2020", "anseel-2015"],
  pages: [
    { id: "cover", type: "cover" },
    {
      id: "intro", type: "intro",
      why: x(
        "Most managers give feedback every week, in a sentence at the door or in the annual review. This issue asks which feedback changes what people do, and which quietly makes things worse.",
        "Shumica e menaxherëve japin feedback çdo javë, me një fjali te dera ose në vlerësimin vjetor. Ky numër pyet cili feedback ndryshon atë që bëjnë njerëzit, dhe cili e përkeqëson punën pa u vënë re.",
        "Die meisten Führungskräfte geben jede Woche Feedback, mit einem Satz an der Tür oder im Jahresgespräch. Diese Ausgabe fragt, welches Feedback ändert, was Menschen tun, und welches die Dinge still verschlechtert."),
      body: x(
        "Across 607 effects, feedback raised performance on average, yet more than a third of the interventions lowered it. In two large samples of 360-degree ratings, the raters' own tendencies explained more of the ratings than the performance of the managers rated. The Center for Creative Leadership proposes describing the situation, the behaviour and its impact. And research on learning finds that feedback helps more the more information it carries.",
        "Në 607 efekte, feedback-u e rriti performancën mesatarisht, por mbi një e treta e ndërhyrjeve e ulën atë. Në dy mostra të mëdha vlerësimesh 360°, prirjet e vetë vlerësuesve shpjeguan më shumë nga vlerësimet se performanca e menaxherëve të vlerësuar. Center for Creative Leadership propozon të përshkruash situatën, sjelljen dhe ndikimin e saj. Dhe kërkimi për të mësuarit gjen se feedback-u ndihmon aq më shumë sa më shumë informacion mban.",
        "Über 607 Effekte hinweg steigerte Feedback die Leistung im Schnitt, doch mehr als ein Drittel der Interventionen senkte sie. In zwei großen Stichproben von 360-Grad-Beurteilungen erklärten die Eigenheiten der Beurteilenden mehr von den Bewertungen als die Leistung der beurteilten Führungskräfte. Das Center for Creative Leadership schlägt vor, Situation, Verhalten und Wirkung zu beschreiben. Und die Lernforschung findet, dass Feedback umso mehr hilft, je mehr Information es trägt."),
    },
    {
      id: "story",
      kicker: x("Cover story", "Tema kryesore", "Titelthema"),
      title: [x("When feedback", "Kur feedback-u", "Wenn Feedback"), x("backfires", "kthehet kundër", "nach hinten losgeht")],
      lead: x(
        "In 1996 Avraham Kluger and Angelo DeNisi brought together decades of studies in which people were told how they had performed: 607 effects, 23,663 observations.",
        "Në 1996, Avraham Kluger dhe Angelo DeNisi mblodhën studime të disa dekadave ku njerëzve u thuhej si kishin punuar: 607 efekte, 23.663 vëzhgime.",
        "1996 trugen Avraham Kluger und Angelo DeNisi Studien aus Jahrzehnten zusammen, in denen Menschen erfuhren, wie gut sie gearbeitet hatten: 607 Effekte, 23.663 Beobachtungen."),
      blocks: [
        { type: "figures", compact: true, items: [
          { n: "607", t: x("effects from studies of feedback", "efekte nga studime për feedback-un", "Effekte aus Studien zu Feedback") },
          { n: x("0.41", "0,41", "0,41"), t: x("average gain, in standard deviations", "përmirësimi mesatar, në devijime standarde", "durchschnittlicher Gewinn, in Standardabweichungen") },
          { n: x("> 1/3", "> 1/3", "> 1/3"), t: x("of the interventions lowered performance", "e ndërhyrjeve e ulën performancën", "der Interventionen senkten die Leistung") },
        ] },
        { type: "p", text: x(
          "The losses could not be explained by chance, by whether the feedback was positive or negative, or by the theories of the time. Kluger and DeNisi proposed that feedback works through attention: the further it moves attention away from the task and towards the self, the less it helps.",
          "Humbjet nuk shpjegoheshin nga rastësia, nga fakti nëse feedback-u ishte pozitiv apo negativ, as nga teoritë e kohës. Kluger dhe DeNisi propozuan se feedback-u vepron përmes vëmendjes: sa më shumë e largon vëmendjen nga detyra dhe e çon te vetja, aq më pak ndihmon.",
          "Die Verluste ließen sich weder durch Zufall erklären noch dadurch, ob das Feedback positiv oder negativ war, noch durch die Theorien der Zeit. Kluger und DeNisi schlugen vor, dass Feedback über die Aufmerksamkeit wirkt: Je weiter es sie von der Aufgabe weg und zur eigenen Person lenkt, desto weniger hilft es.") },
        { type: "callout", reading: true, text: x(
          "Feedback is not good by default. A sentence about the person pulls attention to the self; a sentence about the task keeps it on the work.",
          "Feedback-u nuk është i mirë vetvetiu. Një fjali për personin e tërheq vëmendjen te vetja; një fjali për detyrën e mban te puna.",
          "Feedback ist nicht von sich aus gut. Ein Satz über die Person lenkt die Aufmerksamkeit auf sie selbst; ein Satz über die Aufgabe hält sie bei der Arbeit.") },
      ],
      source: ["kluger-denisi-1996"],
    },
    {
      id: "numbers",
      kicker: x("The numbers", "Shifrat", "Die Zahlen"),
      title: [x("What a rating", "Çfarë mat", "Was eine Bewertung"), x("measures", "një vlerësim", "misst")],
      lead: x(
        "Steven Scullen, Michael Mount and Maynard Goff studied two groups of managers, 2,350 and 2,142, each rated by two bosses, two peers, two subordinates and themselves.",
        "Steven Scullen, Michael Mount dhe Maynard Goff studiuan dy grupe menaxherësh, 2.350 dhe 2.142, secili i vlerësuar nga dy eprorë, dy kolegë, dy vartës dhe vetja.",
        "Steven Scullen, Michael Mount und Maynard Goff untersuchten zwei Gruppen von Führungskräften, 2.350 und 2.142, jede beurteilt von zwei Vorgesetzten, zwei Kollegen, zwei Mitarbeitenden und sich selbst."),
      blocks: [
        { type: "pairs", from: x("Group 1", "Grupi 1", "Gruppe 1"), to: x("Group 2", "Grupi 2", "Gruppe 2"), max: 70, source: ["scullen-2000"],
          label: x("Share of the variance in the ratings explained by", "Pjesa e variancës së vlerësimeve që shpjegon", "Anteil der Varianz der Bewertungen, erklärt durch"),
          rows: [
            { k: x("The rater's own tendencies", "Prirjet e vetë vlerësuesit", "Eigenheiten der Beurteilenden"), a: 62, an: pc(62), b: 53, bn: pc(53), alert: true },
            { k: x("The performance of the person rated", "Performanca e të vlerësuarit", "Leistung der beurteilten Person"), a: 21, an: pc(21), b: 25, bn: pc(25) },
            { k: x("Random error", "Gabimi rastësor", "Zufallsfehler"), a: 11, an: pc(11), b: 18, bn: pc(18) },
          ] },
        { type: "figures", compact: true, items: [
          { n: pc(14), t: x("of employees strongly agree that their reviews inspire them to improve (Gallup)", "e punonjësve pajtohen fuqishëm se vlerësimet i frymëzojnë të përmirësohen (Gallup)", "der Beschäftigten stimmen voll zu, dass Beurteilungen sie zur Verbesserung anspornen (Gallup)") },
          { n: x("≈2 million", "≈2 milionë", "≈2 Mio."), t: x("hours a year on forms, meetings and ratings, by Deloitte's own count", "orë në vit për formularë, takime dhe vlerësime, sipas numërimit të vetë Deloitte", "Stunden im Jahr für Formulare, Gespräche und Bewertungen, nach Deloittes eigener Zählung") },
        ] },
        { type: "callout", reading: true, text: x(
          "If more of a rating is about the rater than about the person, it is a weak basis for a talk about behaviour. Behaviour both sides saw is a better one.",
          "Nëse një vlerësim flet më shumë për vlerësuesin se për personin, është bazë e dobët për një bisedë për sjelljen. Një sjellje që e panë të dyja palët është bazë më e mirë.",
          "Sagt eine Bewertung mehr über die Beurteilenden als über die Person, taugt sie kaum für ein Gespräch über Verhalten. Besser ist, was beide gesehen haben.") },
      ],
      note: x(
        "The ratings were 360-degree ratings for development, not for pay. The three parts do not add up to 100%.",
        "Vlerësimet ishin 360° për zhvillim, jo për pagën. Tri pjesët nuk mblidhen në 100%.",
        "Es waren 360-Grad-Beurteilungen zur Entwicklung, nicht zur Vergütung. Die drei Teile ergeben zusammen nicht 100 %."),
      source: ["scullen-2000", "gallup-reviews-2019", "buckingham-goodall-2015"],
    },
    {
      id: "model", more: "talking-to-someone-who-made-a-mistake",
      kicker: x("The model", "Modeli", "Das Modell"),
      title: [x("Situation, behaviour,", "Situata, sjellja,", "Situation, Verhalten,"), x("impact", "ndikimi", "Wirkung")],
      lead: x(
        "The Center for Creative Leadership teaches a simple form for feedback, situation-behaviour-impact: say when and where, what the person did, and what it caused.",
        "Center for Creative Leadership mëson një formë të thjeshtë për feedback-un, situatë–sjellje–ndikim: thua kur dhe ku, çfarë bëri personi, dhe çfarë shkaktoi.",
        "Das Center for Creative Leadership lehrt eine einfache Form für Feedback, Situation–Verhalten–Wirkung: sagen, wann und wo, was die Person tat und was es bewirkte."),
      blocks: [
        { type: "chain", items: [
          { h: x("Situation", "Situata", "Situation"), p: x("When and where: the meeting, the shift, the hour.", "Kur dhe ku: takimi, turni, ora.", "Wann und wo: das Meeting, die Schicht, die Uhrzeit.") },
          { h: x("Behaviour", "Sjellja", "Verhalten"), p: x("What the person did or said, as anyone could have seen it.", "Çfarë bëri ose tha personi, ashtu si mund ta shihte kushdo.", "Was die Person tat oder sagte, so wie es jeder hätte sehen können.") },
          { h: x("Impact", "Ndikimi", "Wirkung"), p: x("What it caused for you, the team or the customer.", "Çfarë shkaktoi për ty, ekipin ose klientin.", "Was es für dich, das Team oder Kunden bewirkte.") },
        ] },
        { type: "example", label: x("Hypothetical example, after a handover", "Shembull hipotetik, pas një dorëzimi turni", "Hypothetisches Beispiel, nach einer Übergabe"), rows: [
          { k: x("Situation", "Situata", "Situation"), v: x("At this morning's 6:00 handover", "Në dorëzimin e turnit sot në 6:00", "Bei der Übergabe heute um 6:00 Uhr") },
          { k: x("Behaviour", "Sjellja", "Verhalten"), v: x("you read out the three open orders and who owns each", "lexove tri porositë e hapura dhe kush e ka secilën", "hast du die drei offenen Aufträge vorgelesen und wer jeden verantwortet") },
          { k: x("Impact", "Ndikimi", "Wirkung"), v: x("the early shift started without one call to the night lead", "turni i mëngjesit nisi pa asnjë telefonatë te drejtuesi i natës", "die Frühschicht begann ohne einen Anruf bei der Nachtleitung") },
        ], text: x("The same form works for what should change. The situation is invented.", "E njëjta formë vlen edhe për atë që duhet të ndryshojë. Situata është e shpikur.", "Dieselbe Form funktioniert für das, was sich ändern soll. Die Situation ist erfunden.") },
        { type: "callout", reading: true, text: x(
          "SBI keeps feedback on what can be seen and changed. It works for praise too: precise praise tells a person what to repeat.",
          "SBI e mban feedback-un te ajo që shihet dhe mund të ndryshohet. Vlen edhe për lavdërimin: një lavdërim i saktë i tregon njeriut çfarë të përsërisë.",
          "SBI hält Feedback bei dem, was sichtbar ist und sich ändern lässt. Das gilt auch für Lob: Genaues Lob sagt einer Person, was sie wiederholen soll.") },
      ],
      note: x("The three parts follow CCL; the example is the editors'.", "Tri pjesët ndjekin CCL; shembulli është i redaksisë.", "Die drei Teile folgen CCL; das Beispiel stammt von der Redaktion."),
      source: ["ccl-sbi"],
    },
    {
      id: "research",
      kicker: x("What the research says", "Çfarë thotë kërkimi", "Was die Forschung sagt"),
      title: [x("Information,", "Informacion,", "Information,"), x("not verdicts", "jo gjykime", "keine Urteile")],
      lead: x(
        "In 2020 Benedikt Wisniewski, Klaus Zierer and John Hattie pooled 435 studies with 994 effects and more than 61,000 participants. The average effect of feedback was 0.48 standard deviations.",
        "Në 2020, Benedikt Wisniewski, Klaus Zierer dhe John Hattie bashkuan 435 studime me 994 efekte dhe mbi 61.000 pjesëmarrës. Efekti mesatar i feedback-ut ishte 0,48 devijime standarde.",
        "2020 fassten Benedikt Wisniewski, Klaus Zierer und John Hattie 435 Studien mit 994 Effekten und mehr als 61.000 Teilnehmenden zusammen. Der mittlere Effekt von Feedback lag bei 0,48 Standardabweichungen."),
      blocks: [
        { type: "rows", compact: true, items: [
          { h: x("More information, more effect", "Më shumë informacion, më shumë efekt", "Mehr Information, mehr Wirkung"), p: x("Feedback helped more the more information it contained.", "Feedback-u ndihmonte aq më shumë sa më shumë informacion përmbante.", "Feedback half umso mehr, je mehr Information es enthielt.") },
          { h: x("Praise or punishment alone do little", "Lavdërimi ose ndëshkimi vetëm bëjnë pak", "Lob oder Strafe allein bewirken wenig"), p: x("Simple praise or punishment had low effects.", "Lavdërimi i thjeshtë ose ndëshkimi patën efekt të ulët.", "Einfaches Lob oder Strafe hatten geringe Effekte.") },
          { h: x("Who asks for it", "Kush e kërkon", "Wer danach fragt"), p: x("In a review of 30 years of research, Frederik Anseel and colleagues found that people who seek feedback tend to want to learn, get on well with their leader and often hear positive feedback. Seeking falls with tenure, and its direct link to performance is small.", "Në një rishikim të 30 viteve kërkime, Frederik Anseel dhe kolegët gjetën se ata që kërkojnë feedback zakonisht duan të mësojnë, kanë marrëdhënie të mirë me drejtuesin dhe dëgjojnë shpesh feedback pozitiv. Kërkimi bie me vjetërsinë në punë, dhe lidhja e drejtpërdrejtë me performancën është e vogël.", "In einem Überblick über 30 Jahre Forschung fanden Frederik Anseel und Kollegen, dass Menschen, die Feedback suchen, meist lernen wollen, gut mit ihrer Führungskraft auskommen und oft positives Feedback hören. Das Suchen nimmt mit der Betriebszugehörigkeit ab, und der direkte Zusammenhang mit der Leistung ist klein.") },
        ] },
        { type: "callout", reading: true, text: x(
          "A verdict tells people where they stand. Information tells them what to do next. Only the second can be used on the next shift.",
          "Një gjykim i thotë njeriut ku qëndron. Informacioni i thotë çfarë të bëjë më pas. Vetëm i dyti përdoret në turnin e radhës.",
          "Ein Urteil sagt Menschen, wo sie stehen. Information sagt ihnen, was als Nächstes zu tun ist. Nur Letztere lässt sich in der nächsten Schicht nutzen.") },
      ],
      note: x(
        "The 2020 participants were pupils and students, not employees; the data on seeking feedback are correlational.",
        "Pjesëmarrësit e 2020 ishin nxënës dhe studentë, jo punonjës; të dhënat për kërkimin e feedback-ut janë korrelacionale.",
        "Die Teilnehmenden von 2020 waren Schüler und Studierende, keine Beschäftigten; die Daten zum Feedback-Suchen sind korrelativ."),
      source: ["wisniewski-2020", "anseel-2015"],
    },
    {
      id: "measure",
      kicker: x("How it is measured", "Si matet", "Wie man es misst"),
      title: [x("Count the behaviour,", "Numëro sjelljen,", "Das Verhalten zählen,"), x("not the talks", "jo bisedat", "nicht die Gespräche")],
      lead: x(
        "Whether feedback worked shows in what people do afterwards, not in how the conversation felt. One behaviour, counted before and after, is enough.",
        "Nëse feedback-u funksionoi, duket te ajo që bëjnë njerëzit pas tij, jo te si u ndie biseda. Mjafton një sjellje, e numëruar para dhe pas.",
        "Ob Feedback gewirkt hat, zeigt sich in dem, was Menschen danach tun, nicht darin, wie sich das Gespräch anfühlte. Ein Verhalten, vorher und nachher gezählt, genügt."),
      blocks: [
        { type: "steps", items: [
          { h: x("Pick one behaviour", "Zgjidh një sjellje", "Ein Verhalten wählen"), p: x("Something you can see: the checklist at handover, the call before a delay.", "Diçka që shihet: lista në dorëzimin e turnit, telefonata para një vonese.", "Etwas Sichtbares: die Checkliste bei der Übergabe, der Anruf vor einer Verspätung.") },
          { h: x("Count it for two weeks", "Numëroje për dy javë", "Zwei Wochen lang zählen"), p: x("Before saying anything, so you know where it starts.", "Para se të thuash diçka, që ta dish nga nis.", "Bevor man etwas sagt, damit man weiß, wo es beginnt.") },
          { h: x("Give the feedback once, with SBI", "Jep feedback-un një herë, me SBI", "Das Feedback einmal geben, mit SBI"), p: x("Then ask what would make it easier.", "Pastaj pyet çfarë do ta lehtësonte.", "Dann fragen, was es leichter machen würde.") },
          { h: x("Count again for four weeks", "Numëro sërish për katër javë", "Vier Wochen weiter zählen"), p: x("If nothing moves, change the conditions, not the speech.", "Nëse s'lëviz asgjë, ndrysho kushtet, jo fjalimin.", "Wenn sich nichts bewegt, die Bedingungen ändern, nicht die Rede.") },
        ] },
        { type: "example", label: x("Hypothetical example, handovers with the checklist", "Shembull hipotetik, dorëzime me listën", "Hypothetisches Beispiel, Übergaben mit Checkliste"), rows: [
          { k: x("Before", "Para", "Vorher"), v: x("4 of 10 handovers", "4 nga 10 dorëzime", "4 von 10 Übergaben") },
          { k: x("Week 2", "Java 2", "Woche 2"), v: x("7 of 10", "7 nga 10", "7 von 10") },
          { k: x("Week 4", "Java 4", "Woche 4"), v: x("9 of 10", "9 nga 10", "9 von 10") },
        ], text: x("The change held weeks after the conversation, which is the test. The numbers are invented.", "Ndryshimi qëndroi disa javë pas bisedës, dhe ky është testi. Numrat janë të shpikur.", "Die Änderung hielt Wochen nach dem Gespräch, und das ist der Test. Die Zahlen sind erfunden.") },
      ],
      note: x("The steps and the example are the editors'.", "Hapat dhe shembulli janë të redaksisë.", "Schritte und Beispiel stammen von der Redaktion."),
    },
    {
      id: "tool",
      kicker: x("Tool of the week", "Mjeti i javës", "Werkzeug der Woche"),
      title: [x("The feedback", "Karta e", "Die Feedback-"), x("card", "feedback-ut", "karte")],
      lead: x(
        "One card before a feedback conversation. Fill in the first three lines from what you saw, not from what you think of the person.",
        "Një kartë para një bisede feedback-u. Plotëso tri rreshtat e parë nga ajo që pe, jo nga ajo që mendon për personin.",
        "Eine Karte vor einem Feedbackgespräch. Die ersten drei Zeilen aus dem ausfüllen, was man gesehen hat, nicht aus dem, was man von der Person hält."),
      blocks: [
        { type: "form", items: [
          { h: x("Situation", "Situata", "Situation"), hint: x("when and where", "kur dhe ku", "wann und wo") },
          { h: x("Behaviour", "Sjellja", "Verhalten"), hint: x("what I saw or heard, without adjectives", "çfarë pashë ose dëgjova, pa mbiemra", "was ich gesehen oder gehört habe, ohne Adjektive"), lines: 2 },
          { h: x("Impact", "Ndikimi", "Wirkung"), hint: x("what it caused, and for whom", "çfarë shkaktoi, dhe për kë", "was es bewirkt hat, und für wen") },
          { h: x("My question", "Pyetja ime", "Meine Frage"), hint: x("how do you see it?", "si e sheh ti?", "wie siehst du es?") },
          { h: x("Next time", "Herën tjetër", "Beim nächsten Mal"), hint: x("one thing, agreed between us", "një gjë, e rënë dakord mes nesh", "eine Sache, zwischen uns vereinbart") },
          { h: x("Check", "Kontrolli", "Prüfung"), hint: x("the date I look at the behaviour again", "data kur e shikoj sërish sjelljen", "das Datum, an dem ich das Verhalten wieder ansehe") },
        ] },
      ],
      note: x(
        "A practice proposed by the editors; the first three lines follow CCL's situation-behaviour-impact model.",
        "Praktikë e propozuar nga redaksia; tri rreshtat e parë ndjekin modelin situatë–sjellje–ndikim të CCL.",
        "Eine Praxis, die die Redaktion vorschlägt; die ersten drei Zeilen folgen dem Modell Situation–Verhalten–Wirkung von CCL."),
      source: ["ccl-sbi"],
    },
    { id: "sources", type: "sources" },
    { id: "back", type: "back" },
  ],
};
