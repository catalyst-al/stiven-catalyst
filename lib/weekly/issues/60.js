// Management Review, No. 60: Motivation: autonomy, competence, relatedness. Block: People.
// Facts and their sources: docs/revista/management-review-nr-60.md. The shares on the numbers page are the relative
// weights in Table 7 of Van den Broeck et al. (2016); the correlations on the model page are from Table 1 of Slemp et al. (2018).
import { x } from "../common.js";

// A share with one decimal in the three languages: "62.8%", "62,8%", "62,8 %".
const p1 = (n) => x(`${n}%`, `${String(n).replace(".", ",")}%`, `${String(n).replace(".", ",")} %`);
// A correlation in the three languages: "0.38", "0,38", "0,38".
const rho = (s) => x(s, s.replace(".", ","), s.replace(".", ","));

export default {
  number: 60,
  block: "people",
  // Page 2 is too full in German for the reading legend under the contents; it is left out there.
  tight: ["de"],
  date: x("November 2026", "Nëntor 2026", "November 2026"),
  theme: [x("Motivation:", "Motivimi:", "Motivation:"), x("autonomy, competence, relatedness", "autonomia, aftësia, lidhja", "Autonomie, Kompetenz, Verbundenheit")],
  sub: x(
    "Three needs behind motivation, what 99 studies show each one carries, the line from “have to” to “want to”, what pay buys, how support for autonomy is learned and a card for one role.",
    "Tri nevojat pas motivimit, çfarë mban secila sipas 99 studimeve, vija nga “duhet” te “dua”, çfarë blen paga, si mësohet mbështetja e autonomisë dhe një kartë për një rol.",
    "Drei Bedürfnisse hinter der Motivation, was jedes laut 99 Studien trägt, die Linie vom „Muss“ zum „Will“, was Geld kauft, wie sich Autonomieunterstützung lernen lässt, und eine Karte für eine Rolle."),
  seo: x(
    "Motivation at work: autonomy, competence and relatedness, a review of 99 studies, the line from “have to” to “want to”, what pay buys, and a card for one role.",
    "Motivimi në punë: autonomia, aftësia dhe lidhja, 99 studime, vija nga “duhet” te “dua”, çfarë blen paga, dhe një kartë për një rol.",
    "Motivation bei der Arbeit: Autonomie, Kompetenz und Verbundenheit, 99 Studien, vom „Muss“ zum „Will“, was Geld kauft, und eine Karte für eine Rolle."),
  feature: x(
    "Richard Ryan and Edward Deci placed three needs at the centre of motivation, and Issue 60 begins with them. A review of 99 studies shows which need carries engagement and which carries performance. The issue then follows the line from “have to” to “want to”, the part a manager's support for autonomy plays along it, and what 40 years of research say about pay, intrinsic motivation and quality. It closes with how the style is measured and learned, and a card for checking one role against the three needs.",
    "Richard Ryan dhe Edward Deci vunë tri nevoja në qendër të motivimit, dhe Numri 60 nis me to. Një përmbledhje e 99 studimeve tregon cila nevojë mban angazhimin dhe cila rezultatet në detyrë. Pastaj numri ndjek vijën nga “duhet” te “dua”, rolin që luan përgjatë saj mbështetja e menaxherit për autonominë, dhe atë që thonë 40 vjet kërkime për pagën, motivimin e brendshëm dhe cilësinë. Mbyllet me mënyrën si matet dhe si mësohet ky stil, dhe me një kartë për ta kontrolluar një rol sipas tri nevojave.",
    "Richard Ryan und Edward Deci stellten drei Bedürfnisse ins Zentrum der Motivation; mit ihnen beginnt Ausgabe 60. Eine Auswertung von 99 Studien zeigt, welches Bedürfnis das Engagement trägt und welches die Leistung. Danach folgt die Ausgabe der Linie vom „Muss“ zum „Will“, der Rolle, die die Autonomieunterstützung der Führungskraft dabei spielt, und dem, was 40 Jahre Forschung über Geld, intrinsische Motivation und Qualität sagen. Zum Schluss: wie sich dieser Stil messen und lernen lässt, und eine Karte, mit der Sie eine Rolle an den drei Bedürfnissen prüfen."),
  figure: { n: x("42%", "42%", "42 %"), by: "Van den Broeck et al., 2016", t: x(
    "of the variance in intrinsic motivation at work was explained by the three needs together, in a review of 99 studies.",
    "e variancës së motivimit të brendshëm në punë shpjegohej nga tri nevojat së bashku, në një përmbledhje të 99 studimeve.",
    "der Varianz der intrinsischen Motivation bei der Arbeit erklärten die drei Bedürfnisse zusammen, in einer Auswertung von 99 Studien.") },
  teasers: [
    { page: "story", kicker: x("Cover story", "Tema kryesore", "Titelthema"),
      title: x("Three needs, not one carrot", "Tri nevoja, jo një karotë", "Drei Bedürfnisse, nicht eine Karotte") },
    { page: "model", kicker: x("The model", "Modeli", "Das Modell"),
      title: x("From “have to” to “want to”", "Nga “duhet” te “dua”", "Vom „Muss“ zum „Will“") },
    { page: "tool", kicker: x("Tool of the issue", "Mjeti i numrit", "Werkzeug der Ausgabe"),
      title: x("The three-needs card", "Karta e tri nevojave", "Die Karte der drei Bedürfnisse") },
  ],
  sources: ["sdt-ryan-deci-2000", "sdt-van-den-broeck-2016", "sdt-slemp-2018", "sdt-cerasoli-2014", "sdt-olafsen-2015", "sdt-deci-olafsen-ryan-2017", "sdt-gagne-2015", "sdt-hardre-reeve-2009"],
  pages: [
    { id: "cover", type: "cover" },
    {
      id: "intro", type: "intro",
      why: x(
        "Most talk about motivation asks how much of it people have. Self-determination theory asks what kind: whether people work because they want to, because they see the point, or because they feel pushed. Three needs lie behind that difference, and a manager can do something about each.",
        "Shumica e bisedave për motivimin pyesin sa motivim kanë njerëzit. Teoria e vetëvendosjes pyet për llojin e tij: a punojnë njerëzit sepse duan, sepse e shohin kuptimin, apo sepse ndihen të shtyrë. Pas këtij dallimi qëndrojnë tri nevoja, dhe një menaxher mund të bëjë diçka për secilën.",
        "Meist fragt man bei Motivation, wie viel Menschen davon haben. Die Selbstbestimmungstheorie fragt nach der Art: ob Menschen arbeiten, weil sie wollen, weil sie den Sinn sehen oder weil sie sich gedrängt fühlen. Hinter diesem Unterschied stehen drei Bedürfnisse, und für jedes kann eine Führungskraft etwas tun."),
      body: x(
        "Richard Ryan and Edward Deci named three needs: autonomy, competence and relatedness. In 99 studies, autonomy carried most of what the needs explain in engagement, competence most of it in task performance. A manager's support for autonomy goes with wanting and valuing the work, and not with pressure. Over 40 years of research, intrinsic motivation predicted the quality of work, incentives its quantity. And the style can be learned: in one study, within five weeks.",
        "Richard Ryan dhe Edward Deci emërtuan tri nevoja: autonominë, aftësinë dhe lidhjen. Në 99 studime, autonomia mbante pjesën më të madhe të asaj që nevojat shpjegojnë te angazhimi, aftësia pjesën më të madhe te rezultatet në detyrë. Mbështetja e menaxherit për autonominë shkon bashkë me dëshirën për punën dhe vlerësimin e saj, dhe jo me presionin. Në 40 vjet kërkime, motivimi i brendshëm parashikonte cilësinë e punës, stimujt sasinë e saj. Dhe ky stil mësohet: në një studim, brenda pesë javëve.",
        "Richard Ryan und Edward Deci benannten drei Bedürfnisse: Autonomie, Kompetenz und Verbundenheit. In 99 Studien trug Autonomie den größten Teil dessen, was die Bedürfnisse beim Engagement erklären, Kompetenz den größten Teil bei der Aufgabenleistung. Autonomieunterstützung durch die Führungskraft geht damit einher, die Arbeit zu wollen und wertzuschätzen, nicht mit Druck. Über 40 Jahre Forschung sagte intrinsische Motivation die Qualität der Arbeit voraus, Anreize ihre Menge. Und der Stil lässt sich lernen: in einer Studie binnen fünf Wochen."),
    },
    {
      id: "story",
      kicker: x("Cover story", "Tema kryesore", "Titelthema"),
      title: [x("Three needs,", "Tri nevoja,", "Drei Bedürfnisse,"), x("not one carrot", "jo një karotë", "nicht eine Karotte")],
      lead: x(
        "In 2000 Richard Ryan and Edward Deci summed up their research: people can be curious and engaged, or like the many who “wait listlessly for the weekend as they go about their jobs”. The difference, they argued, lies in three needs.",
        "Më 2000, Richard Ryan dhe Edward Deci e përmblodhën kërkimin e tyre: njerëzit mund të jenë kureshtarë dhe të përfshirë, ose si të shumtët që “presin pa gjallëri fundjavën ndërsa bëjnë punën e tyre”. Dallimi, argumentuan ata, qëndron te tri nevoja.",
        "2000 fassten Richard Ryan und Edward Deci ihre Forschung zusammen: Menschen können neugierig und engagiert sein oder wie die vielen, die „bei ihrer Arbeit lustlos auf das Wochenende warten“. Der Unterschied, so ihre These, liegt in drei Bedürfnissen."),
      blocks: [
        { type: "cards", cols: 3, items: [
          { h: x("Autonomy", "Autonomia", "Autonomie"), p: x("acting with a sense of choice and ownership, not pushed and pulled from outside", "të veprosh duke ndier se ke zgjedhur dhe se e ke marrë përsipër, jo i shtyrë e i tërhequr nga jashtë", "mit dem Gefühl von Wahl und Eigenverantwortung handeln, nicht von außen geschoben und gezogen") },
          { h: x("Competence", "Aftësia", "Kompetenz"), p: x("feeling able to master the work and to grow new skills", "të ndihesh i aftë ta zotërosh punën dhe të fitosh aftësi të reja", "sich der Arbeit gewachsen fühlen und Neues dazulernen") },
          { h: x("Relatedness", "Lidhja", "Verbundenheit"), p: x("feeling connected to others: belonging, caring and being cared for", "të ndihesh i lidhur me të tjerët: të bësh pjesë, të kujdesesh dhe të kujdesen për ty", "sich mit anderen verbunden fühlen: dazugehören, sich kümmern und umsorgt werden") },
        ] },
        { type: "p", text: x(
          "Autonomy is the most misunderstood of the three, because it does not mean independence. Anja Van den Broeck and colleagues give an example: a manager asks someone to finish a task over lunch. If the person agrees willingly, the need is met; if they feel forced, it is thwarted. The task stays the same.",
          "Autonomia është më e keqkuptuara nga të treja, sepse nuk do të thotë pavarësi. Anja Van den Broeck dhe kolegët japin një shembull: një menaxher i kërkon dikujt ta mbarojë një detyrë gjatë drekës. Nëse personi pranon me dëshirë, nevoja plotësohet; nëse ndihet i detyruar, ajo pengohet. Detyra mbetet e njëjta.",
          "Autonomie ist das am häufigsten missverstandene der drei Bedürfnisse, denn sie bedeutet nicht Unabhängigkeit. Anja Van den Broeck und Kollegen nennen ein Beispiel: Eine Führungskraft bittet jemanden, eine Aufgabe in der Mittagspause fertigzustellen. Sagt die Person gern zu, ist das Bedürfnis erfüllt; fühlt sie sich gezwungen, wird es verletzt. Die Aufgabe bleibt dieselbe.") },
        { type: "callout", reading: true, text: x(
          "Autonomy is not the absence of a manager. It is the difference between “I agreed” and “I had no choice”.",
          "Autonomia nuk është mungesa e menaxherit. Është dallimi mes “pranova” dhe “s'kisha zgjidhje”.",
          "Autonomie ist nicht die Abwesenheit einer Führungskraft. Sie ist der Unterschied zwischen „Ich habe zugestimmt“ und „Ich hatte keine Wahl“.") },
      ],
      note: x(
        "The definitions follow Ryan & Deci (2000) and Van den Broeck et al. (2016), whose lunch example this is. The quotation is from the American Psychologist; the translation is ours.",
        "Përkufizimet ndjekin Ryan & Deci (2000) dhe Van den Broeck et al. (2016), të cilëve u përket shembulli i drekës. Citimi është nga American Psychologist; përkthimi është i yni.",
        "Die Definitionen folgen Ryan & Deci (2000) und Van den Broeck et al. (2016), von denen das Mittagsbeispiel stammt. Das Zitat stammt aus dem American Psychologist; die Übersetzung ist unsere."),
      source: ["sdt-ryan-deci-2000", "sdt-van-den-broeck-2016"],
    },
    {
      id: "numbers",
      kicker: x("The numbers", "Shifrat", "Die Zahlen"),
      title: [x("Which need", "Cila nevojë", "Welches Bedürfnis"), x("carries what", "mban çfarë", "was trägt")],
      lead: x(
        "Anja Van den Broeck and colleagues pooled 99 studies with 119 samples of adults at work. Each need predicted outcomes on its own, though not equally. This is how the three divided what they explain:",
        "Anja Van den Broeck dhe kolegët bashkuan 99 studime me 119 mostra të rriturish në punë. Secila nevojë i parashikonte rezultatet më vete, por jo në të njëjtën masë. Ja si e ndanë mes tyre të tria atë që shpjegojnë:",
        "Anja Van den Broeck und Kollegen fassten 99 Studien mit 119 Stichproben Erwachsener bei der Arbeit zusammen. Jedes Bedürfnis sagte Ergebnisse für sich voraus, wenn auch nicht gleich stark. So verteilte sich unter den dreien, was sie erklären:"),
      blocks: [
        { type: "pairs", from: x("Engagement", "Angazhimi", "Engagement"), to: x("Task performance", "Rezultatet në detyrë", "Aufgabenleistung"), max: 70, source: ["sdt-van-den-broeck-2016"],
          label: x("Share of what the three needs explain, by need", "Pjesa e asaj që shpjegojnë tri nevojat, sipas nevojës", "Anteil an dem, was die drei Bedürfnisse erklären, je Bedürfnis"),
          rows: [
            { k: x("Autonomy", "Autonomia", "Autonomie"), a: 62.8, an: p1(62.8), b: 19.6, bn: p1(19.6) },
            { k: x("Competence", "Aftësia", "Kompetenz"), a: 12.8, an: p1(12.8), b: 64.1, bn: p1(64.1), alert: true },
            { k: x("Relatedness", "Lidhja", "Verbundenheit"), a: 24.5, an: p1(24.5), b: 16.3, bn: p1(16.3) },
          ] },
        { type: "p", text: x(
          "Together the needs explained 43% of the variance in engagement and 17% in task performance. Of the three, autonomy was most closely related to job satisfaction (ρ = 0.69), competence to task performance (0.40).",
          "Së bashku, nevojat shpjegonin 43% të variancës së angazhimit dhe 17% të rezultateve në detyrë. Nga të treja, autonomia lidhej më fort me kënaqësinë në punë (ρ = 0,69), aftësia me rezultatet në detyrë (0,40).",
          "Zusammen erklärten die Bedürfnisse 43 % der Varianz beim Engagement und 17 % bei der Aufgabenleistung. Von den dreien hing Autonomie am stärksten mit der Arbeitszufriedenheit zusammen (ρ = 0,69), Kompetenz mit der Aufgabenleistung (0,40).") },
        { type: "callout", reading: true, text: x(
          "Choice keeps people engaged; feeling able shows in the work itself. A team needs both, and a manager feeds each in a different way.",
          "Zgjedhja i mban njerëzit të përfshirë; ndjenja se je i aftë duket te vetë puna. Një ekip ka nevojë për të dyja, dhe menaxheri i ushqen secilën në mënyrë tjetër.",
          "Wahlfreiheit hält Menschen bei der Sache; das Gefühl, es zu können, zeigt sich in der Arbeit selbst. Ein Team braucht beides, und eine Führungskraft fördert beides auf unterschiedliche Weise.") },
      ],
      note: x(
        "Relative weights from the authors' Table 7; ρ is a correlation corrected for measurement error. The studies measure needs and outcomes side by side, so they show association, not cause.",
        "Peshat relative vijnë nga tabela 7 e autorëve; ρ është korrelacion i korrigjuar për gabimin e matjes. Studimet i matin nevojat dhe rezultatet krah për krah, ndaj tregojnë lidhje, jo shkak.",
        "Relative Gewichte aus Tabelle 7 der Autoren; ρ ist eine um Messfehler korrigierte Korrelation. Die Studien messen Bedürfnisse und Ergebnisse nebeneinander und zeigen daher einen Zusammenhang, keine Ursache."),
      source: ["sdt-van-den-broeck-2016"],
    },
    {
      id: "model", more: "leading-people-without-losing-the-person",
      kicker: x("The model", "Modeli", "Das Modell"),
      title: [x("From “have to”", "Nga “duhet”", "Vom „Muss“"), x("to “want to”", "te “dua”", "zum „Will“")],
      lead: x(
        "Rather than setting intrinsic against extrinsic motivation, the theory places the reasons for working on a line, from none at all to the work itself. Along that line, a rule can be taken in until it becomes one's own.",
        "Në vend që ta vërë motivimin e brendshëm përballë atij të jashtëm, teoria i vendos arsyet për të punuar në një vijë, nga asnjë arsye deri te vetë puna. Përgjatë kësaj vije, një rregull mund të përvetësohet derisa të bëhet i yti.",
        "Statt intrinsische und extrinsische Motivation gegeneinanderzustellen, ordnet die Theorie die Gründe zu arbeiten auf einer Linie an, von gar keinem bis zur Arbeit selbst. Entlang dieser Linie kann eine Regel verinnerlicht werden, bis sie zur eigenen wird."),
      blocks: [
        { type: "chain", items: [
          { h: x("No motivation", "Pa motivim", "Keine Motivation"), p: x("going through the motions", "thjesht kalon kohën", "nur noch Routine") },
          { h: x("External", "E jashtme", "Extern"), p: x("for a reward, or to avoid a punishment", "për një shpërblim, ose për t'i shpëtuar ndëshkimit", "für Belohnung oder gegen Strafe") },
          { h: x("Introjected", "E përvetësuar pjesërisht", "Introjiziert"), p: x("to avoid guilt, or to feel worth something", "për t'i shpëtuar fajit, ose për t'u ndier me vlerë", "gegen Schuld oder für den Selbstwert") },
          { h: x("Identified", "E identifikuar", "Identifiziert"), p: x("because I see its value", "sepse ia shoh vlerën", "weil ich den Wert sehe") },
          { h: x("Intrinsic", "E brendshme", "Intrinsisch"), p: x("because the work itself satisfies", "sepse vetë puna të kënaq", "weil die Arbeit selbst erfüllt") },
        ] },
        { type: "hbars", max: 50, source: ["sdt-slemp-2018"],
          label: x("Manager's support for autonomy, correlation with each reason (12–22 studies)", "Mbështetja e menaxherit për autonominë: korrelacioni (12–22 studime)", "Autonomieunterstützung der Führungskraft, Korrelation mit jedem Grund (12–22 Studien)"),
          items: [
            { k: x("Intrinsic", "E brendshme", "Intrinsisch"), v: 38, n: rho("0.38"), alert: true },
            { k: x("Identified", "E identifikuar", "Identifiziert"), v: 31, n: rho("0.31") },
            { k: x("Introjected", "E përvetësuar pjesërisht", "Introjiziert"), v: 0, n: rho("−0.04") },
            { k: x("External", "E jashtme", "Extern"), v: 0, n: rho("0.00") },
          ] },
        { type: "callout", reading: true, text: x(
          "With the next new rule, say why it exists. The reason behind a rule is what moves it from “have to” towards “want to”.",
          "Kur të vendosësh rregullin e ardhshëm, thuaj pse ekziston. Arsyeja është ajo që e shtyn rregullin nga “duhet” drejt “dua”.",
          "Sagen Sie bei der nächsten neuen Regel dazu, warum es sie gibt. Erst der Grund hinter einer Regel bewegt sie vom „Muss“ in Richtung „Will“.") },
      ],
      note: x(
        "The line follows Ryan & Deci (2000), who also place integrated regulation before intrinsic motivation. Slemp et al. pooled 32,870 people; ρ is corrected for measurement error, and most of the studies are cross-sectional.",
        "Vija ndjek Ryan & Deci (2000), të cilët para motivimit të brendshëm vendosin edhe rregullimin e integruar. Slemp et al. bashkuan 32.870 vetë; ρ është i korrigjuar për gabimin e matjes, dhe shumica e studimeve janë bërë në një moment të vetëm.",
        "Die Linie folgt Ryan & Deci (2000), die vor der intrinsischen Motivation noch die integrierte Regulation einordnen. Slemp et al. fassten 32.870 Personen zusammen; ρ ist um Messfehler korrigiert, die Studien sind überwiegend Querschnittsstudien."),
      source: ["sdt-ryan-deci-2000", "sdt-slemp-2018"],
    },
    {
      id: "research",
      kicker: x("What the research says", "Çfarë thotë kërkimi", "Was die Forschung sagt"),
      title: [x("Pay buys", "Paga blen", "Geld kauft"), x("quantity", "sasinë", "Menge")],
      lead: x(
        "Christopher Cerasoli, Jessica Nicklin and Michael Ford pooled 40 years of research from school, work and sport. Intrinsic motivation predicted performance moderately to strongly, whether or not incentives were offered.",
        "Christopher Cerasoli, Jessica Nicklin dhe Michael Ford bashkuan 40 vjet kërkime nga shkolla, puna dhe sporti. Motivimi i brendshëm i parashikonte rezultatet mesatarisht deri fort, me ose pa stimuj.",
        "Christopher Cerasoli, Jessica Nicklin und Michael Ford fassten 40 Jahre Forschung aus Schule, Arbeit und Sport zusammen. Intrinsische Motivation sagte Leistung mittel bis stark voraus, ob Anreize geboten wurden oder nicht."),
      blocks: [
        { type: "figures", compact: true, items: [
          { n: x("212,468", "212.468", "212.468"), t: x("people, in 183 effect sizes", "vetë, në 183 madhësi efekti", "Personen, in 183 Effektgrößen") },
          { n: x("ρ = 0.21–0.45", "ρ = 0,21–0,45", "ρ = 0,21–0,45"), t: x("between intrinsic motivation and performance", "mes motivimit të brendshëm dhe rezultateve", "zwischen intrinsischer Motivation und Leistung") },
        ] },
        { type: "p", text: x(
          "Weighed together, intrinsic motivation explained more of the quality of performance, incentives more of its quantity. Where incentives were tied directly to performance, intrinsic motivation counted for less. In a study of 166 bank employees in Norway, the amount of pay did not predict need satisfaction or intrinsic motivation; the manager's support for employees' needs did.",
          "Kur peshoheshin së bashku, motivimi i brendshëm shpjegonte më shumë cilësinë e rezultateve, stimujt më shumë sasinë e tyre. Aty ku stimujt lidheshin drejtpërdrejt me rezultatet, motivimi i brendshëm peshonte më pak. Në një studim me 166 punonjës bankash në Norvegji, shuma e pagës nuk parashikonte as plotësimin e nevojave, as motivimin e brendshëm; mbështetja e menaxherit për nevojat e punonjësve, po.",
          "Gemeinsam betrachtet erklärte intrinsische Motivation mehr von der Qualität der Leistung, Anreize mehr von ihrer Menge. Wo Anreize direkt an die Leistung geknüpft waren, fiel intrinsische Motivation weniger ins Gewicht. In einer Studie mit 166 Bankangestellten in Norwegen sagte die Höhe des Gehalts weder Bedürfniserfüllung noch intrinsische Motivation voraus, wohl aber die Unterstützung der Bedürfnisse durch die Führungskraft.") },
        { type: "callout", reading: true, text: x(
          "A bonus can count pieces. Quality shows care for the work, and a bonus on every piece can crowd that care out.",
          "Një bonus mund të numërojë copat. Cilësia tregon kujdesin për punën, dhe një bonus për çdo copë mund ta zbehë këtë kujdes.",
          "Ein Bonus kann Stücke zählen. In der Qualität zeigt sich die Sorgfalt, und ein Bonus auf jedes Stück kann diese Sorgfalt verdrängen.") },
      ],
      note: x(
        "Cerasoli et al. as given in the abstract and in the summary by Deci, Olafsen & Ryan (2017); we could not obtain the full article. The bank study is a single survey (Olafsen et al., 2015).",
        "Cerasoli et al. sipas abstraktit dhe përmbledhjes së Deci, Olafsen & Ryan (2017); artikullin e plotë nuk mundëm ta siguronim. Studimi i bankave është një anketë e vetme (Olafsen et al., 2015).",
        "Cerasoli et al. nach dem Abstract und der Zusammenfassung von Deci, Olafsen & Ryan (2017); den vollständigen Artikel konnten wir nicht einsehen. Die Bankstudie ist eine einzelne Befragung (Olafsen et al., 2015)."),
      source: ["sdt-cerasoli-2014", "sdt-olafsen-2015", "sdt-deci-olafsen-ryan-2017"],
    },
    {
      id: "measure",
      kicker: x("How it is measured", "Si matet", "Wie es gemessen wird"),
      title: [x("Ask why,", "Pyet pse,", "Nach dem Warum,"), x("not how much", "jo sa", "nicht dem Wie viel")],
      lead: x(
        "The Multidimensional Work Motivation Scale was tested with 3,435 workers in seven languages and nine countries. Instead of asking how motivated someone is, its 19 items ask for the reasons behind their effort at work, from none at all to the work itself.",
        "Shkalla shumëdimensionale e motivimit në punë u provua me 3.435 punonjës në shtatë gjuhë dhe nëntë vende. Në vend që të pyesin sa i motivuar është dikush, 19 pyetjet e saj pyesin për arsyet pas përpjekjes në punë, nga asnjë arsye deri te vetë puna.",
        "Die Multidimensional Work Motivation Scale wurde mit 3.435 Beschäftigten in sieben Sprachen und neun Ländern erprobt. Statt zu fragen, wie motiviert jemand ist, fragen ihre 19 Aussagen nach den Gründen für die Anstrengung bei der Arbeit, von gar keinem bis zur Arbeit selbst."),
      blocks: [
        { type: "box", title: x("What employees are asked about their manager (Deci et al., 2017)", "Çfarë pyeten punonjësit për menaxherin (Deci et al., 2017)", "Was Beschäftigte über ihre Führungskraft gefragt werden (Deci et al., 2017)"), items: [
          x("acknowledges my point of view", "e pranon këndvështrimin tim", "erkennt meine Sicht an"),
          x("offers choices and encourages initiative", "më jep zgjedhje dhe më nxit të marr nismë", "lässt Wahl und ermutigt zur Eigeninitiative"),
          x("gives meaningful feedback and optimally challenging tasks", "jep komente me kuptim dhe detyra me sfidën e duhur", "gibt aussagekräftige Rückmeldung und passend fordernde Aufgaben"),
          x("gives a reason when asking for something", "jep një arsye kur kërkon diçka", "nennt einen Grund, wenn sie etwas verlangt"),
        ] },
        { type: "p", text: x(
          "The style can be learned. In a study published in 1989, Deci and colleagues trained the managers of one division of a large company; their employees later reported more job satisfaction and more trust in top management. Patricia Hardré and Johnmarshall Reeve trained 25 managers with 169 employees. Five weeks later the trained managers were more autonomy supportive, and their employees more autonomously motivated and engaged than a control group's.",
          "Ky stil mësohet. Në një studim të botuar më 1989, Deci dhe kolegët trajnuan menaxherët e një divizioni të një kompanie të madhe; punonjësit e tyre raportuan më pas më shumë kënaqësi në punë dhe më shumë besim te drejtimi i lartë. Patricia Hardré dhe Johnmarshall Reeve trajnuan 25 menaxherë me 169 punonjës. Pesë javë më vonë, menaxherët e trajnuar e mbështetnin më shumë autonominë, dhe punonjësit e tyre ishin më të motivuar nga brenda dhe më të përfshirë se ata të grupit të kontrollit.",
          "Der Stil lässt sich lernen. In einer 1989 veröffentlichten Studie schulten Deci und Kollegen die Führungskräfte einer Sparte eines großen Unternehmens; deren Beschäftigte berichteten danach von mehr Arbeitszufriedenheit und mehr Vertrauen in die oberste Leitung. Patricia Hardré und Johnmarshall Reeve schulten 25 Führungskräfte mit 169 Beschäftigten. Fünf Wochen später unterstützten die Geschulten Autonomie stärker, und ihre Beschäftigten waren autonomer motiviert und engagierter als die der Kontrollgruppe.") },
      ],
      note: x(
        "The scale is copyrighted, so we name what it measures rather than its items. The four lines summarise the behaviours listed by Deci et al. Slemp et al. (2018) note that both training studies had small samples.",
        "Shkalla ka të drejta autori, ndaj emërtojmë atë që mat dhe jo pyetjet e saj. Katër rreshtat përmbledhin sjelljet që rendisin Deci et al. Slemp et al. (2018) vërejnë se të dy studimet e trajnimit kishin mostra të vogla.",
        "Die Skala ist urheberrechtlich geschützt; deshalb nennen wir, was sie misst, nicht ihre Aussagen. Die vier Zeilen fassen die Verhaltensweisen zusammen, die Deci et al. aufzählen. Slemp et al. (2018) merken an, dass beide Trainingsstudien kleine Stichproben hatten."),
      source: ["sdt-gagne-2015", "sdt-deci-olafsen-ryan-2017", "sdt-hardre-reeve-2009", "sdt-slemp-2018"],
    },
    {
      id: "tool", tool: "/tools/kpi-diagnostic/",
      kicker: x("Tool of the issue", "Mjeti i numrit", "Werkzeug der Ausgabe"),
      title: [x("The three-needs", "Karta e tri", "Die Karte der drei"), x("card", "nevojave", "Bedürfnisse")],
      lead: x(
        "Take one role in your team rather than one person. For each need, write what the job gives today and one change you can make this month. Then ask the people in the role whether you got it right.",
        "Merr një rol në ekipin tënd, jo një person. Për secilën nevojë, shkruaj çfarë jep puna sot dhe një ndryshim që mund ta bësh këtë muaj. Pastaj pyet njerëzit në atë rol nëse e ke kuptuar drejt.",
        "Nehmen Sie eine Rolle in Ihrem Team, nicht eine Person. Notieren Sie für jedes Bedürfnis, was die Arbeit heute bietet, und eine Änderung, die Sie in diesem Monat umsetzen können. Fragen Sie dann die Menschen in dieser Rolle, ob Sie richtig liegen."),
      blocks: [
        { type: "form", items: [
          { h: x("Role", "Roli", "Rolle"), hint: x("which role, how many people, the main task", "cili rol, sa vetë, detyra kryesore", "welche Rolle, wie viele Personen, die Hauptaufgabe") },
          { h: x("Autonomy", "Autonomia", "Autonomie"), hint: x("where they can choose how; one rule to explain with its reason", "ku mund të zgjedhin si; një rregull për ta shpjeguar me arsyen e tij", "wo sie das Wie wählen können; eine Regel, die mit Grund erklärt wird") },
          { h: x("Competence", "Aftësia", "Kompetenz"), hint: x("how they see they do it well; one stretch task or piece of feedback", "si e kuptojnë që e bëjnë mirë; një detyrë sfiduese ose një koment", "woran sie merken, dass sie es gut machen; eine fordernde Aufgabe oder eine Rückmeldung") },
          { h: x("Relatedness", "Lidhja", "Verbundenheit"), hint: x("who they depend on and who notices their work; one moment together", "nga kush varen dhe kush e vë re punën e tyre; një moment bashkë", "von wem sie abhängen und wer ihre Arbeit bemerkt; ein gemeinsamer Moment") },
          { h: x("Changes", "Ndryshimet", "Änderungen"), hint: x("one per need, with an owner and a date", "një për çdo nevojë, me përgjegjës dhe datë", "eine je Bedürfnis, mit verantwortlicher Person und Datum"), lines: 2 },
          { h: x("Asked back", "Çfarë thanë ata", "Nachgefragt"), hint: x("what the people in the role said, in their words", "çfarë thanë njerëzit në atë rol, me fjalët e tyre", "was die Menschen in der Rolle gesagt haben, in ihren Worten") },
        ] },
      ],
      note: x(
        "A suggestion from the editors, drawing on the three needs of Ryan & Deci (2000) and the managerial behaviours listed by Deci, Olafsen & Ryan (2017). The card is not a measurement scale.",
        "Sugjerim i redaksisë, i mbështetur në tri nevojat e Ryan & Deci (2000) dhe në sjelljet e menaxherit që rendisin Deci, Olafsen & Ryan (2017). Karta nuk është shkallë matjeje.",
        "Eine Anregung der Redaktion, gestützt auf die drei Bedürfnisse bei Ryan & Deci (2000) und die Verhaltensweisen von Führungskräften, die Deci, Olafsen & Ryan (2017) aufzählen. Die Karte ist keine Messskala."),
      source: ["sdt-ryan-deci-2000", "sdt-deci-olafsen-ryan-2017"],
    },
    { id: "sources", type: "sources" },
    { id: "back", type: "back" },
  ],
};
