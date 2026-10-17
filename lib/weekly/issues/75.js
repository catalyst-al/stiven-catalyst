// Management Review, No. 75: Mental health at work. Block: People.
// Facts and their sources: docs/revista/management-review-nr-75.md. The issue describes the WHO guidelines of 2022,
// the strength of their evidence and the German duty to assess psychological strain; it gives no medical advice.
// Burnout is No. 29, psychological safety No. 4; neither is repeated here.
import { x, pc } from "../common.js";

export default {
  number: 75,
  block: "people",
  date: x("November 2026", "Nëntor 2026", "November 2026"),
  theme: [x("Mental health", "Shëndeti mendor", "Psychische Gesundheit"), x("at work", "në punë", "bei der Arbeit")],
  sub: x(
    "What the WHO guidelines of 2022 put first, how many working-age adults live with a mental disorder, six places to act, how strong the evidence is, what German law asks, and a card for one strain.",
    "Çfarë vënë në vend të parë udhëzimet e OBSH-së të vitit 2022, sa të rritur në moshë pune jetojnë me një çrregullim mendor, gjashtë vende ku veprohet, sa e fortë është prova, çfarë kërkon ligji gjerman, dhe një kartë për një ngarkesë.",
    "Was die WHO-Leitlinien von 2022 an den Anfang stellen, wie viele Erwerbsfähige mit einer psychischen Störung leben, sechs Ansatzpunkte, wie stark die Belege sind, was das deutsche Gesetz verlangt, und eine Karte."),
  seo: x(
    "Mental health at work: the WHO guidelines of 2022, 12 billion lost working days, manager training, the strength of the evidence, German law and a card.",
    "Shëndeti mendor në punë: udhëzimet e OBSH-së të vitit 2022, 12 miliardë ditë pune të humbura, trajnimi i menaxherëve, prova, ligji gjerman dhe një kartë.",
    "Psychische Gesundheit bei der Arbeit: WHO-Leitlinien 2022, 12 Mrd. verlorene Arbeitstage, Führungskräfteschulung, Evidenz, deutsches Recht, eine Karte."),
  feature: x(
    "The WHO's guidelines on mental health at work, published in 2022, begin with the conditions of work, and so does Issue 75. It follows the estimates of how many working-age adults live with a mental disorder and how many working days are lost, sets out where the guidelines recommend action, and weighs how strong and how certain each recommendation is. Then it reads what the German Occupational Safety and Health Act asks of employers, and closes with a card for one strain at work.",
    "Udhëzimet e OBSH-së për shëndetin mendor në punë, të botuara më 2022, nisin nga kushtet e punës, dhe po aty nis edhe Numri 75. Ai ndjek vlerësimet se sa të rritur në moshë pune jetojnë me një çrregullim mendor dhe sa ditë pune humbasin, shtjellon ku rekomandojnë veprim udhëzimet, dhe peshon sa i fortë dhe sa i sigurt është secili rekomandim. Pastaj lexon çfarë u kërkon punëdhënësve ligji gjerman për mbrojtjen në punë, dhe mbyllet me një kartë për një ngarkesë në punë.",
    "Die WHO-Leitlinien zur psychischen Gesundheit bei der Arbeit von 2022 setzen bei den Arbeitsbedingungen an, und dort beginnt auch Ausgabe 75. Sie folgt den Schätzungen, wie viele Erwerbsfähige mit einer psychischen Störung leben und wie viele Arbeitstage verloren gehen, zeigt, wo die Leitlinien Maßnahmen empfehlen, und wägt ab, wie stark und wie sicher jede Empfehlung ist. Danach liest sie, was das Arbeitsschutzgesetz von Arbeitgebern verlangt, und schließt mit einer Karte für eine Belastung bei der Arbeit."),
  figure: { n: x("12 bn", "12 mld.", "12 Mrd."), by: "WHO & ILO, 2022", t: x(
    "working days are lost every year to depression and anxiety, costing the global economy nearly US$1 trillion.",
    "ditë pune humbasin çdo vit nga depresioni dhe ankthi, me një kosto prej gati 1.000 miliardë dollarësh për ekonominë botërore.",
    "Arbeitstage gehen jedes Jahr durch Depressionen und Angststörungen verloren, was die Weltwirtschaft fast 1 Billion US-Dollar kostet.") },
  teasers: [
    { page: "story", kicker: x("Cover story", "Tema kryesore", "Titelthema"),
      title: x("From the person to the work", "Nga njeriu te puna", "Vom Menschen zur Arbeit") },
    { page: "research", kicker: x("What the research says", "Çfarë thotë kërkimi", "Was die Forschung sagt"),
      title: x("How strong the evidence is", "Sa e fortë është prova", "Wie stark die Belege sind") },
    { page: "tool", kicker: x("Tool of the issue", "Mjeti i numrit", "Werkzeug der Ausgabe"),
      title: x("One strain, one measure", "Një ngarkesë, një masë", "Eine Belastung, eine Maßnahme") },
  ],
  sources: ["mhw-who-guidelines-2022", "mhw-who-ilo-2022", "mhw-who-factsheet-2024", "mhw-who-wmhr-2022", "mhw-malik-2023", "mhw-arbschg-2021"],
  pages: [
    { id: "cover", type: "cover" },
    {
      id: "intro", type: "intro",
      why: x(
        "Mental health at work is often handled as a matter for the individual: an app, a course, a hotline. The WHO guidelines of 2022 start somewhere else, with workload, control and how people treat each other. What does that mean for a manager?",
        "Shëndeti mendor në punë shpesh trajtohet si çështje e individit: një aplikacion, një kurs, një linjë telefonike. Udhëzimet e OBSH-së të vitit 2022 nisin diku tjetër, te ngarkesa, kontrolli dhe mënyra si sillen njerëzit me njëri-tjetrin. Çfarë do të thotë kjo për një menaxher?",
        "Psychische Gesundheit bei der Arbeit wird oft als Sache des Einzelnen behandelt: eine App, ein Kurs, eine Hotline. Die WHO-Leitlinien von 2022 setzen anders an, bei Arbeitslast, Handlungsspielraum und dem Umgang miteinander. Was bedeutet das für eine Führungskraft?"),
      body: x(
        "In 2022 the WHO estimated that 15% of working-age adults had a mental disorder in 2019, and that depression and anxiety cost about 12 billion working days a year. Its guidelines recommend changing the work to reduce psychosocial risks and, for the first time, training managers. The evidence for manager training is the strongest; for changing the work it is very uncertain, probably because such changes are hard to study. German law already asks employers to assess psychological strain. The issue describes evidence; it is not medical advice.",
        "Më 2022, OBSH vlerësoi se 15% e të rriturve në moshë pune kishin një çrregullim mendor më 2019, dhe se depresioni dhe ankthi kushtojnë rreth 12 miliardë ditë pune në vit. Udhëzimet e saj rekomandojnë ndryshimin e punës për të ulur rreziqet psikosociale dhe, për herë të parë, trajnimin e menaxherëve. Prova për trajnimin e menaxherëve është më e forta; për ndryshimin e punës është shumë e pasigurt, ndoshta sepse ndryshime të tilla studiohen me vështirësi. Ligji gjerman u kërkon tashmë punëdhënësve të vlerësojnë ngarkesën psikike. Numri përshkruan prova; nuk është këshillë mjekësore.",
        "Laut WHO hatten 15 % der Erwachsenen im erwerbsfähigen Alter 2019 eine psychische Störung; Depressionen und Angststörungen kosten jährlich rund 12 Milliarden Arbeitstage. Die Leitlinien empfehlen, psychosoziale Risiken in der Arbeit zu senken, und erstmals, Führungskräfte zu schulen. Für die Schulung sind die Belege am stärksten, für Änderungen der Arbeit sehr unsicher, wohl weil sie schwer zu untersuchen sind. Das deutsche Recht verlangt schon die Beurteilung psychischer Belastung. Kein medizinischer Rat."),
    },
    {
      id: "story",
      kicker: x("Cover story", "Tema kryesore", "Titelthema"),
      title: [x("From the person", "Nga njeriu", "Vom Menschen"), x("to the work", "te puna", "zur Arbeit")],
      lead: x(
        "On 28 September 2022 the WHO published its guidelines on mental health at work, together with a policy brief written with the International Labour Organization. They begin with the conditions of work.",
        "Më 28 shtator 2022, OBSH botoi udhëzimet e saj për shëndetin mendor në punë, bashkë me një përmbledhje politikash të shkruar me Organizatën Ndërkombëtare të Punës. Ato nisin nga kushtet e punës.",
        "Am 28. September 2022 veröffentlichte die WHO ihre Leitlinien zur psychischen Gesundheit bei der Arbeit, zusammen mit einem Policy Brief, den sie mit der Internationalen Arbeitsorganisation verfasste. Sie setzen bei den Arbeitsbedingungen an."),
      blocks: [
        { type: "box", title: x("Risks at work the WHO names", "Rreziqet në punë që përmend OBSH", "Risiken bei der Arbeit, die die WHO nennt"), items: [
          x("excessive workload or work pace, understaffing", "ngarkesa ose ritmi i tepruar, mungesa e stafit", "zu hohe Arbeitslast oder Arbeitstempo, Personalmangel"),
          x("little control over job design or workload", "kontroll i pakët mbi mënyrën e punës ose ngarkesën", "wenig Einfluss auf Arbeitsgestaltung oder Arbeitsmenge"),
          x("violence, harassment or bullying", "dhuna, ngacmimi ose bullizmi", "Gewalt, Belästigung oder Mobbing"),
          x("discrimination and exclusion", "diskriminimi dhe përjashtimi", "Diskriminierung und Ausgrenzung"),
          x("job insecurity", "pasiguria e vendit të punës", "unsichere Arbeitsplätze"),
        ] },
        { type: "p", text: x(
          "The launch named what was new in them:",
          "Njoftimi i botimit tregoi çfarë kishin të re:",
          "Die Mitteilung zur Veröffentlichung nannte, was neu war:") },
        { type: "quote", text: x(
          "For the first time WHO recommends manager training, to build their capacity to prevent stressful work environments and respond to workers in distress.",
          "Për herë të parë OBSH rekomandon trajnimin e menaxherëve, për t'u dhënë aftësinë të parandalojnë mjediset stresuese të punës dhe t'u përgjigjen punonjësve në vështirësi.",
          "Erstmals empfiehlt die WHO die Schulung von Führungskräften, damit sie belastende Arbeitsumfelder verhindern und auf Beschäftigte in Not reagieren können.") },
        { type: "callout", reading: true, text: x(
          "Workload, control and behaviour are decided at work, often by the manager. That is where the WHO starts.",
          "Ngarkesa, kontrolli dhe sjellja vendosen në punë, shpesh nga menaxheri. Aty nis OBSH.",
          "Arbeitslast, Spielraum und Verhalten entstehen bei der Arbeit, oft durch die Führungskraft. Dort setzt die WHO an.") },
      ],
      note: x(
        "The list shortens the WHO fact sheet; translations are ours. Burnout is No. 29, psychological safety No. 4. This issue describes guidelines and evidence; it is not medical advice.",
        "Lista shkurton fletën informative të OBSH-së; përkthimet janë tonat. Rraskapitja është Nr. 29, siguria psikologjike Nr. 4. Ky numër përshkruan udhëzime dhe prova; nuk është këshillë mjekësore.",
        "Die Liste kürzt das WHO-Faktenblatt; Übersetzungen von uns. Burnout ist Nr. 29, psychologische Sicherheit Nr. 4. Die Ausgabe beschreibt Leitlinien und Belege, keinen medizinischen Rat."),
      source: ["mhw-who-guidelines-2022", "mhw-who-ilo-2022", "mhw-who-factsheet-2024"],
    },
    {
      id: "numbers",
      kicker: x("The numbers", "Shifrat", "Die Zahlen"),
      title: [x("Three", "Tre", "Drei"), x("in twenty", "në njëzet", "von zwanzig")],
      lead: x(
        "The WHO's World Mental Health Report of 2022 estimated that nearly a billion people lived with a mental disorder in 2019, and that close to 15% of the world's working population has one at any given time.",
        "Raporti Botëror i OBSH-së për Shëndetin Mendor i vitit 2022 vlerësoi se gati një miliard njerëz jetonin me një çrregullim mendor më 2019, dhe se afro 15% e popullsisë që punon në botë ka një të tillë në çdo kohë.",
        "Der Weltbericht der WHO zur psychischen Gesundheit von 2022 schätzte, dass 2019 fast eine Milliarde Menschen mit einer psychischen Störung lebten und dass zu jedem Zeitpunkt fast 15 % der arbeitenden Bevölkerung weltweit eine haben."),
      blocks: [
        { type: "people", source: ["mhw-who-wmhr-2022"],
          label: x("The working population worldwide, out of 20", "Popullsia që punon në botë, nga 20", "Arbeitende Bevölkerung weltweit, von 20"),
          groups: [
            { v: 3, tone: "red", n: x("3 in 20", "3 në 20", "3 von 20"), t: x("have a mental disorder (≈ 15%)", "kanë një çrregullim mendor (≈ 15%)", "haben eine psychische Störung (≈ 15 %)") },
            { v: 17, tone: "dim", n: x("17 in 20", "17 në 20", "17 von 20"), t: x("the rest", "të tjerët", "die übrigen") },
          ] },
        { type: "figures", compact: true, items: [
          { n: x("≈ 12 bn", "≈ 12 mld.", "≈ 12 Mrd."), t: x("working days lost each year to depression and anxiety", "ditë pune të humbura në vit nga depresioni dhe ankthi", "Arbeitstage pro Jahr durch Depressionen und Angststörungen verloren") },
          { n: x("≈ $1 tn", "≈ 1 tril. $", "≈ 1 Bio. $"), t: x("the yearly cost to the global economy", "kostoja vjetore për ekonominë botërore", "jährliche Kosten für die Weltwirtschaft") },
          { n: pc(35), t: x("of countries reported national programmes to promote mental health at work", "e vendeve raportuan programe kombëtare për promovimin e shëndetit mendor në punë", "der Länder meldeten nationale Programme zur Förderung psychischer Gesundheit bei der Arbeit") },
        ] },
        { type: "callout", reading: true, text: x(
          "In a team of twenty, the average predicts three people living with a mental disorder. That is the ordinary case.",
          "Në një ekip me njëzet vetë, mesatarja parashikon tre njerëz që jetojnë me një çrregullim mendor. Ky është rasti i zakonshëm.",
          "In einem Team von zwanzig lässt der Durchschnitt drei Menschen mit einer psychischen Störung erwarten. Das ist der Normalfall.") },
      ],
      note: x(
        "Global estimates, not counts. A disorder is a diagnosis, not the stress of a hard week. Days, cost and the 35% are as the WHO and ILO gave them in 2022; the WHO's fact sheet of 2026 gives 16% for 2023.",
        "Vlerësime globale, jo numërime. Çrregullimi është diagnozë, jo stresi i një jave të rëndë. Ditët, kostoja dhe 35% janë siç i dhanë OBSH dhe ILO më 2022; fleta informative e OBSH-së e vitit 2026 jep 16% për 2023.",
        "Weltweite Schätzungen, keine Zählungen. Eine Störung ist eine Diagnose, nicht der Stress einer harten Woche. Tage, Kosten und 35 % wie von WHO und ILO 2022 angegeben; das WHO-Faktenblatt von 2026 nennt 16 % für 2023."),
      source: ["mhw-who-wmhr-2022", "mhw-who-ilo-2022"],
    },
    {
      id: "model", more: "leadership-without-a-title",
      kicker: x("The model", "Modeli", "Das Modell"),
      title: [x("Where", "Ku", "Wo"), x("to act", "veprohet", "ansetzen")],
      lead: x(
        "The guidelines recommend action in these areas. They run from the work itself, through the people who lead it, to workers who live with a mental health condition.",
        "Udhëzimet rekomandojnë veprim në këto fusha. Ato shkojnë nga vetë puna, te njerëzit që e drejtojnë, deri te punonjësit që jetojnë me një gjendje të shëndetit mendor.",
        "Die Leitlinien empfehlen Maßnahmen in diesen Bereichen. Sie reichen von der Arbeit selbst über die Menschen, die sie führen, bis zu Beschäftigten mit einer psychischen Erkrankung."),
      blocks: [
        { type: "rows", compact: true, items: [
          { h: x("Organisational interventions", "Ndërhyrjet organizative", "Organisatorische Maßnahmen"), p: x("reduce psychosocial risks such as bullying or low job control", "ulin rreziqet psikosociale si bullizmi ose kontrolli i ulët mbi punën", "senken psychosoziale Risiken wie Mobbing oder geringen Spielraum") },
          { h: x("Manager training", "Trajnimi i menaxherëve", "Schulung von Führungskräften"), p: x("knowledge, attitudes and skills; not meant to turn managers into therapists", "njohuri, qëndrime dhe aftësi; nuk synon t'i bëjë menaxherët terapistë", "Wissen, Haltung, Fertigkeiten; Führungskräfte werden keine Therapeuten") },
          { h: x("Worker training", "Trajnimi i punonjësve", "Schulung der Beschäftigten"), p: x("mental health literacy and awareness", "njohuri dhe ndërgjegjësim për shëndetin mendor", "Wissen und Bewusstsein über psychische Gesundheit") },
          { h: x("Individual interventions", "Ndërhyrjet individuale", "Individuelle Maßnahmen"), p: x("psychosocial support or physical activity, as one part of a wider programme", "mbështetje psikosociale ose aktivitet fizik, si një pjesë e një programi më të gjerë", "psychosoziale Angebote oder Bewegung, als Teil eines größeren Programms") },
          { h: x("Return to work", "Kthimi në punë", "Rückkehr an die Arbeit"), p: x("work-directed care, such as a phased return, with ongoing clinical care", "kujdes i lidhur me punën, si kthimi gradual, bashkë me kujdesin klinik", "arbeitsbezogene Hilfe wie stufenweise Rückkehr, mit klinischer Behandlung") },
          { h: x("Gaining employment", "Gjetja e punës", "Zugang zu Arbeit"), p: x("supported employment for people with severe conditions", "punësim i mbështetur për njerëzit me gjendje të rënda", "unterstützte Beschäftigung bei schweren Erkrankungen") },
        ] },
        { type: "callout", reading: true, text: x(
          "Help for the individual is on the list, as one part of it. The work that strains everyone still has to change.",
          "Ndihma për individin është në listë, si një pjesë e saj. Puna që i rëndon të gjithë duhet të ndryshojë gjithsesi.",
          "Hilfe für den Einzelnen steht auf der Liste, als ein Teil davon. Die Arbeit, die alle belastet, muss sich trotzdem ändern.") },
      ],
      note: x(
        "Rows shortened from the guidelines and Malik et al. (2023). The guidelines also recommend reasonable accommodations, such as flexible hours or extra time for tasks. On screening workers, the WHO made no recommendation.",
        "Rreshtat shkurtojnë udhëzimet dhe Malik et al. (2023). Udhëzimet rekomandojnë edhe përshtatjet e arsyeshme, si orari fleksibël ose më shumë kohë për detyrat. Për depistimin e punonjësve, OBSH nuk dha rekomandim.",
        "Zeilen gekürzt nach den Leitlinien und Malik et al. (2023). Die Leitlinien empfehlen auch angemessene Vorkehrungen wie flexible Zeiten oder mehr Zeit für Aufgaben. Zum Screening Beschäftigter gab die WHO keine Empfehlung."),
      source: ["mhw-who-guidelines-2022", "mhw-malik-2023", "mhw-who-factsheet-2024"],
    },
    {
      id: "research",
      kicker: x("What the research says", "Çfarë thotë kërkimi", "Was die Forschung sagt"),
      title: [x("How strong", "Sa e fortë", "Wie stark"), x("the evidence is", "është prova", "die Belege sind")],
      lead: x(
        "With the GRADE method the WHO rates each recommendation twice: how strong it is, and how certain the evidence behind it is.",
        "Me metodën GRADE, OBSH e vlerëson çdo rekomandim dy herë: sa i fortë është, dhe sa e sigurt është prova pas tij.",
        "Mit der GRADE-Methode bewertet die WHO jede Empfehlung zweimal: wie stark sie ist und wie sicher die Evidenz dahinter."),
      blocks: [
        { type: "rows", compact: true, items: [
          { h: x("Manager training", "Trajnimi i menaxherëve", "Schulung von Führungskräften"), p: x("strong recommendation, moderate certainty", "rekomandim i fortë, siguri mesatare", "starke Empfehlung, mittlere Sicherheit") },
          { h: x("Organisational interventions for all", "Ndërhyrjet organizative për të gjithë", "Organisatorische Maßnahmen für alle"), p: x("“may be considered”: conditional, very low certainty", "“mund të merren në konsideratë”: i kushtëzuar, siguri shumë e ulët", "„können erwogen werden“: bedingt, sehr geringe Sicherheit") },
          { h: x("Mental health training for workers", "Trajnimi i punonjësve për shëndetin mendor", "Schulung der Beschäftigten"), p: x("conditional, very low certainty", "i kushtëzuar, siguri shumë e ulët", "bedingt, sehr geringe Sicherheit") },
          { h: x("Leadership-oriented training", "Trajnimi për udhëheqjen", "Allgemeines Führungstraining"), p: x("no recommendation: no clear effect on health", "pa rekomandim: pa efekt të qartë te shëndeti", "keine Empfehlung: keine klare Wirkung auf Gesundheit") },
          { h: x("Screening workers", "Depistimi i punonjësve", "Screening der Beschäftigten"), p: x("no recommendation: unclear if benefits outweigh harms", "pa rekomandim: s'është e qartë nëse dobitë i tejkalojnë dëmet", "keine Empfehlung: Nutzen gegenüber Schaden unklar") },
        ] },
        { type: "callout", reading: true, text: x(
          "Weak evidence for changing the work is not proof that it fails. Such changes are hard to study, and the law does not wait for the trials.",
          "Prova e dobët për ndryshimin e punës nuk është provë se ai dështon. Ndryshime të tilla studiohen me vështirësi, dhe ligji nuk pret studimet.",
          "Schwache Belege für Änderungen der Arbeit beweisen nicht, dass sie scheitern. Solche Änderungen sind schwer zu untersuchen, und das Gesetz wartet nicht auf Studien.") },
      ],
      note: x(
        "Low certainty means more research could change the estimate. Malik et al. (2023) trace the weak evidence to how hard complex interventions are to evaluate. The grades are as printed in the guidelines.",
        "Siguri e ulët do të thotë se kërkime të tjera mund ta ndryshojnë vlerësimin. Malik et al. (2023) e lidhin provën e dobët me vështirësinë e vlerësimit të ndërhyrjeve komplekse. Notat janë siç janë shtypur te udhëzimet.",
        "Geringe Sicherheit heißt: Weitere Forschung kann die Schätzung ändern. Malik et al. (2023) führen die schwache Evidenz darauf zurück, dass komplexe Maßnahmen schwer zu bewerten sind. Die Bewertungen stehen so in den Leitlinien."),
      source: ["mhw-who-guidelines-2022", "mhw-malik-2023"],
    },
    {
      id: "measure",
      kicker: x("How it is measured", "Si matet", "Wie es gemessen wird"),
      title: [x("What German", "Çfarë kërkon", "Was das deutsche"), x("law asks", "ligji gjerman", "Gesetz verlangt")],
      lead: x(
        "Germany's Occupational Safety and Health Act (Arbeitsschutzgesetz) lists psychological strain at work among the sources of hazard for the employer's risk assessment (§ 5(3) no. 6). Read together, four steps:",
        "Ligji gjerman për mbrojtjen në punë (Arbeitsschutzgesetz) e rendit ngarkesën psikike në punë ndër burimet e rrezikut për vlerësimin që bën punëdhënësi (§ 5(3) nr. 6). Të lexuara bashkë, paragrafët japin katër hapa:",
        "Das Arbeitsschutzgesetz nennt psychische Belastungen bei der Arbeit als eine Quelle von Gefährdungen für die Gefährdungsbeurteilung des Arbeitgebers (§ 5 Abs. 3 Nr. 6). Zusammen gelesen, vier Schritte:"),
      blocks: [
        { type: "steps", items: [
          { h: x("Assess (§ 5)", "Vlerëso (§ 5)", "Beurteilen (§ 5)"), p: x("which hazards come with the work, by type of activity; where conditions are alike, one assessment will do", "cilat rreziqe vijnë me punën, sipas llojit të veprimtarisë; kur kushtet janë të njëjta, mjafton një vlerësim", "welche Gefährdungen die Arbeit mit sich bringt, je nach Tätigkeit; bei gleichartigen Bedingungen genügt eine Beurteilung") },
          { h: x("Act at the source (§ 4)", "Vepro te burimi (§ 4)", "An der Quelle handeln (§ 4)"), p: x("design work to spare physical and mental health; individual measures come after the others", "projektoje punën që të ruajë shëndetin fizik dhe psikik; masat individuale vijnë pas të tjerave", "Arbeit so gestalten, dass physische und psychische Gesundheit geschont werden; individuelle Maßnahmen sind nachrangig") },
          { h: x("Check (§ 3)", "Kontrollo (§ 3)", "Prüfen (§ 3)"), p: x("whether the measures work, and adapt them when conditions change", "nëse masat funksionojnë, dhe përshtati kur ndryshojnë kushtet", "ob die Maßnahmen wirken, und sie anpassen, wenn sich etwas ändert") },
          { h: x("Document (§ 6)", "Dokumento (§ 6)", "Dokumentieren (§ 6)"), p: x("the result of the assessment, the measures and the result of their review", "rezultatin e vlerësimit, masat dhe rezultatin e rishikimit të tyre", "Ergebnis der Beurteilung, Maßnahmen und Ergebnis ihrer Überprüfung") },
        ] },
        { type: "callout", reading: true, text: x(
          "The law and the WHO point the same way: the work first, the person after. A questionnaire only starts an assessment; the measures and their review complete it.",
          "Ligji dhe OBSH tregojnë në të njëjtin drejtim: puna e para, njeriu pas. Një pyetësor vetëm e nis vlerësimin; masat dhe rishikimi i tyre e plotësojnë.",
          "Gesetz und WHO weisen in dieselbe Richtung: erst die Arbeit, dann der Mensch. Ein Fragebogen eröffnet die Beurteilung nur; vollständig wird sie mit den Maßnahmen und ihrer Überprüfung.") },
      ],
      note: x(
        "Our summary of §§ 3–6, not legal advice. The Act prescribes no method for the assessment. We did not check the law in Albania.",
        "Përmbledhja jonë e §§ 3–6, jo këshillë ligjore. Ligji nuk përcakton metodë për vlerësimin. Ligjin në Shqipëri nuk e kontrolluam.",
        "Unsere Zusammenfassung der §§ 3–6, keine Rechtsberatung. Eine Methode schreibt das Gesetz nicht vor. Das albanische Recht haben wir nicht geprüft."),
      source: ["mhw-arbschg-2021"],
    },
    {
      id: "tool", tool: "/tools/five-whys/",
      kicker: x("Tool of the issue", "Mjeti i numrit", "Werkzeug der Ausgabe"),
      title: [x("One strain,", "Një ngarkesë,", "Eine Belastung,"), x("one measure", "një masë", "eine Maßnahme")],
      lead: x(
        "One card per task or team. It asks about the work, not about anyone's health: what strains, where it comes from, what changes at the source, and when you check. Five Whys helps with the third line.",
        "Një kartë për çdo detyrë ose ekip. Pyet për punën, jo për shëndetin e dikujt: çfarë rëndon, nga vjen, çfarë ndryshon te burimi, dhe kur kontrollon. Fleta Five Whys ndihmon te rreshti i tretë.",
        "Eine Karte pro Aufgabe oder Team. Sie fragt nach der Arbeit, nicht nach der Gesundheit einzelner Menschen: was belastet, woher, was sich an der Quelle ändert und wann Sie prüfen. Five Whys hilft bei Zeile drei."),
      blocks: [
        { type: "form", items: [
          { h: x("Task or team", "Detyra ose ekipi", "Aufgabe oder Team"), hint: x("where, which shift, how many people", "ku, cili turn, sa njerëz", "wo, welche Schicht, wie viele Menschen") },
          { h: x("The strain", "Ngarkesa", "Die Belastung"), hint: x("load or pace, control, staffing, behaviour, insecurity: which, how often", "ngarkesa ose ritmi, kontrolli, stafi, sjellja, pasiguria: cila, sa shpesh", "Menge oder Tempo, Spielraum, Besetzung, Verhalten, Unsicherheit: was, wie oft") },
          { h: x("Where it comes from", "Nga vjen", "Woher sie kommt"), hint: x("ask why until you reach something in the work", "pyet pse derisa të arrish te diçka në punë", "nach dem Warum fragen, bis Sie bei der Arbeit ankommen") },
          { h: x("Measure at the source", "Masa te burimi", "Maßnahme an der Quelle"), hint: x("what changes in the work, before training or individual help", "çfarë ndryshon te puna, para trajnimit ose ndihmës individuale", "was sich an der Arbeit ändert, vor Schulung oder Einzelhilfe") },
          { h: x("Who and by when", "Kush dhe deri kur", "Wer und bis wann"), hint: x("one owner, one date; ask the team what they would change", "një përgjegjës, një datë; pyet ekipin çfarë do të ndryshonte", "eine Person, ein Datum; das Team fragen, was es ändern würde") },
          { h: x("Check and record", "Kontrollo dhe shëno", "Prüfen und festhalten"), hint: x("did the strain go down; where it is written down", "a u ul ngarkesa; ku është shënuar", "ist die Belastung gesunken; wo steht es") },
        ] },
      ],
      note: x(
        "The editors propose this card, following the WHO's order and §§ 3–6 of the Arbeitsschutzgesetz. It makes no diagnosis and replaces neither the formal risk assessment nor medical help.",
        "Këtë kartë e propozon redaksia, sipas rendit të OBSH-së dhe §§ 3–6 të Arbeitsschutzgesetz. Nuk bën diagnozë dhe nuk zëvendëson as vlerësimin formal të rrezikut, as ndihmën mjekësore.",
        "Praxisvorschlag der Redaktion, nach der Reihenfolge der WHO und §§ 3–6 ArbSchG. Keine Diagnose; ersetzt weder die Gefährdungsbeurteilung noch ärztliche Hilfe."),
      source: ["mhw-who-guidelines-2022", "mhw-arbschg-2021"],
    },
    { id: "sources", type: "sources" },
    { id: "back", type: "back" },
  ],
};
