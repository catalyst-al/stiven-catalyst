// Management Review, No. 104: Someone to talk to, why connection at work matters for health and for staying.
// Block: People. Facts and their sources: docs/revista/management-review-nr-104.md. Holt-Lunstad, Smith & Layton
// (2010, PLOS Medicine), Sasaki et al. (2025, Journal of Occupational Health, PubMed Central), Gallup's 2026 global
// data summary and two Gallup articles (2024, 2022) were read in full on their own sites. The Surgeon General's
// advisory (2023) did not open (hhs.gov returned 403) and is not listed. Psychological safety is No. 4, engagement
// No. 9, why people leave No. 14, onboarding No. 24, mental health No. 75 and incivility No. 79; not repeated here.
import { x, pc } from "../common.js";

// "6.7%" in English, "6,7%" in Albanian and "6,7 %" in German.
const pcd = (n) => x(`${n}%`, `${n.replace(".", ",")}%`, `${n.replace(".", ",")} %`);
// "1.46" in English, "1,46" in Albanian and German.
const dec = (n) => x(n, n.replace(".", ","), n.replace(".", ","));

export default {
  number: 104,
  block: "people",
  date: x("November 2026", "Nëntor 2026", "November 2026"),
  theme: [x("Someone to talk to:", "Dikush për të folur:", "Jemand zum Reden:"), x("connection at work", "lidhja në punë", "Verbundenheit bei der Arbeit")],
  sub: x(
    "One employee in five lonely on any given day, 148 studies of relationships and survival, the difference between people around you and people who support you, a study of loneliness and leaving, three questions, and a card.",
    "Një punonjës në pesë i vetmuar në një ditë të çfarëdoshme, 148 studime për marrëdhëniet dhe mbijetesën, dallimi mes njerëzve rreth teje dhe njerëzve që të mbështesin, një studim për vetminë dhe largimin, tri pyetje, dhe një kartë.",
    "Jeder fünfte Beschäftigte an einem beliebigen Tag einsam, 148 Studien zu Beziehungen und Überleben, der Unterschied zwischen Menschen um einen herum und Menschen, die einen stützen, eine Studie zu Einsamkeit und Kündigung, drei Fragen und eine Karte."),
  seo: x(
    "Connection at work: Gallup's daily loneliness data, 148 studies of relationships and mortality, loneliness and leaving, three questions and a card.",
    "Lidhja në punë: vetmia e përditshme sipas Gallup-it, 148 studime për marrëdhëniet dhe vdekshmërinë, vetmia dhe largimi, tri pyetje dhe një kartë.",
    "Verbundenheit bei der Arbeit: tägliche Einsamkeit nach Gallup, 148 Studien zu Beziehungen und Sterblichkeit, Einsamkeit und Kündigung, drei Fragen, eine Karte."),
  feature: x(
    "In Gallup's world survey, 22% of employees said they had felt lonely during a lot of the previous day. Issue 104 reads that data, a review of 148 studies that linked stronger relationships with 50% higher odds of survival, and the first study to follow workplace loneliness to people actually leaving their jobs. It separates being among people from being supported by them, offers three short questions a team can ask itself, and ends with a card for a leader's week.",
    "Në sondazhin botëror të Gallup-it, 22% e punonjësve thanë se ishin ndjerë të vetmuar gjatë një pjese të madhe të ditës së mëparshme. Numri 104 i lexon këto të dhëna, një rishikim të 148 studimeve që i lidhi marrëdhëniet më të forta me 50% shanse më të larta mbijetese, dhe studimin e parë që e ndoqi vetminë në punë deri te largimi i vërtetë nga puna. E ndan të qenit mes njerëzve nga të qenit i mbështetur prej tyre, jep tri pyetje të shkurtra që një ekip mund t'ia bëjë vetes, dhe mbyllet me një kartë për javën e një drejtuesi.",
    "In Gallups Weltumfrage sagten 22 % der Beschäftigten, sie hätten sich am Vortag einen großen Teil des Tages einsam gefühlt. Ausgabe 104 liest diese Daten, eine Übersicht von 148 Studien, die stärkere Beziehungen mit um 50 % höheren Überlebenschancen verband, und die erste Studie, die Einsamkeit bei der Arbeit bis zur tatsächlichen Kündigung verfolgte. Sie trennt das Zusammensein mit Menschen vom Rückhalt durch sie, bietet drei kurze Fragen, die sich ein Team stellen kann, und endet mit einer Karte für die Woche einer Führungskraft."),
  figure: { n: pc(22), by: "Gallup, 2026", t: x(
    "of employees worldwide felt lonely during a lot of the previous day, in Gallup's 2025 survey.",
    "e punonjësve në botë u ndjenë të vetmuar gjatë një pjese të madhe të ditës së mëparshme, në sondazhin e Gallup-it të 2025-s.",
    "der Beschäftigten weltweit fühlten sich in Gallups Umfrage 2025 am Vortag einen großen Teil des Tages einsam.") },
  teasers: [
    { page: "story", kicker: x("Cover story", "Tema kryesore", "Titelthema"),
      title: x("One in five, every day", "Një në pesë, çdo ditë", "Jeder Fünfte, jeden Tag") },
    { page: "research", kicker: x("What the research says", "Çfarë thotë kërkimi", "Was die Forschung sagt"),
      title: x("Lonely, then gone", "I vetmuar, pastaj i larguar", "Einsam, dann weg") },
    { page: "tool", kicker: x("Tool of the issue", "Mjeti i numrit", "Werkzeug der Ausgabe"),
      title: x("The connection card", "Karta e lidhjes", "Die Verbundenheitskarte") },
  ],
  sources: ["connect-gallup-sgw-2026", "connect-holt-lunstad-2010", "connect-gallup-pendell-2024", "connect-gallup-patel-2022", "connect-sasaki-2025"],
  pages: [
    { id: "cover", type: "cover" },
    {
      id: "intro", type: "intro",
      why: x(
        "Work is where many adults spend most of their waking hours with other people, and also where some spend them alone: on a night shift, at a remote desk, as the only one of their trade. Who a person can turn to rarely appears in a KPI. This issue asks what that costs in health and in people who leave.",
        "Puna është vendi ku shumë të rritur kalojnë pjesën më të madhe të orëve zgjuar me njerëz të tjerë, dhe ku disa i kalojnë vetëm: në turnin e natës, në një tavolinë në distancë, si të vetmit e zanatit të tyre. Te kush mund të drejtohet një person, rrallë del në një KPI. Ky numër pyet sa kushton kjo në shëndet dhe në njerëz që ikin.",
        "Bei der Arbeit verbringen viele Erwachsene die meisten wachen Stunden mit anderen Menschen, und manche verbringen sie allein: in der Nachtschicht, am entfernten Schreibtisch, als Einzige ihres Fachs. An wen sich jemand wenden kann, steht selten in einer Kennzahl. Diese Ausgabe fragt, was das an Gesundheit und an Menschen kostet, die gehen."),
      body: x(
        "Gallup finds 22% of employees lonely on a given day, more among those working remotely. Across 148 studies, people with stronger relationships had 50% higher odds of survival. Being among people and being supported are not the same, and Gallup's data hint at what helps. In Japan, lonelier employees were more likely to have left six months later. Three questions and a card close the issue.",
        "Gallup gjen 22% të punonjësve të vetmuar në një ditë të caktuar, më shumë mes atyre që punojnë në distancë. Në 148 studime, njerëzit me marrëdhënie më të forta kishin 50% shanse më të larta mbijetese. Të jesh mes njerëzve dhe të jesh i mbështetur nuk janë e njëjta gjë, dhe të dhënat e Gallup-it tregojnë çfarë ndihmon. Në Japoni, punonjësit më të vetmuar kishin më shumë gjasa të ishin larguar gjashtë muaj më vonë. Tri pyetje dhe një kartë e mbyllin numrin.",
        "Gallup findet 22 % der Beschäftigten an einem Tag einsam, mehr unter denen, die remote arbeiten. In 148 Studien hatten Menschen mit stärkeren Beziehungen um 50 % höhere Überlebenschancen. Unter Menschen zu sein und Rückhalt zu haben, ist nicht dasselbe, und Gallups Daten zeigen, was hilft. In Japan hatten einsamere Beschäftigte sechs Monate später eher gekündigt. Drei Fragen und eine Karte schließen die Ausgabe."),
    },
    {
      id: "story",
      kicker: x("Cover story", "Tema kryesore", "Titelthema"),
      title: [x("One in five,", "Një në pesë,", "Jeder Fünfte,"), x("every day", "çdo ditë", "jeden Tag")],
      lead: x(
        "Each year Gallup's World Poll asks employed adults whether they felt certain emotions during a lot of the day before. For 2025, with 141,444 employed respondents, 22% said they had felt lonely, as in 2024 and up from 20% in 2023. Where people work made the clearest difference.",
        "Çdo vit, World Poll i Gallup-it i pyet të rriturit që punojnë nëse kanë ndier disa emocione gjatë një pjese të madhe të ditës së mëparshme. Për 2025-n, me 141.444 të anketuar që punonin, 22% thanë se ishin ndjerë të vetmuar, si më 2024 dhe më shumë se 20% e 2023-s. Vendi ku punojnë njerëzit bëri dallimin më të qartë.",
        "Jedes Jahr fragt Gallups World Poll erwerbstätige Erwachsene, ob sie am Vortag einen großen Teil des Tages bestimmte Gefühle hatten. Für 2025, mit 141.444 erwerbstätigen Befragten, sagten 22 %, sie hätten sich einsam gefühlt, wie 2024 und mehr als 20 % im Jahr 2023. Der Arbeitsort machte den deutlichsten Unterschied."),
      blocks: [
        { type: "hbars", max: 30, source: ["connect-gallup-sgw-2026"],
          label: x("Employees who felt lonely a lot of the previous day, by place of work, world (2025 data)", "Punonjësit që u ndjenë të vetmuar një pjesë të madhe të ditës së mëparshme, sipas vendit të punës, bota (të dhënat e 2025-s)", "Beschäftigte, die sich am Vortag lange einsam fühlten, nach Arbeitsort, weltweit (Daten 2025)"),
          items: [
            { k: x("Fully remote", "Plotësisht në distancë", "Vollständig remote"), v: 24, n: pc(24), alert: true },
            { k: x("Hybrid", "Hibrid", "Hybrid"), v: 24, n: pc(24), alert: true },
            { k: x("On-site, job could be remote", "Në vend, puna mund të bëhej në distancë", "Vor Ort, Arbeit wäre remote möglich"), v: 18, n: pc(18) },
            { k: x("On-site, job cannot be remote", "Në vend, puna s'bëhet dot në distancë", "Vor Ort, Arbeit nicht remote möglich"), v: 21, n: pc(21) },
          ] },
        { type: "p", text: x(
          "Age, sex and rank mattered little: 23% of managers and 21% of other employees. Regions differed more, from 28% in South Asia and sub-Saharan Africa to 13% in Europe.",
          "Mosha, gjinia dhe pozicioni ndikuan pak: 23% e menaxherëve dhe 21% e punonjësve të tjerë. Rajonet ndryshonin më shumë, nga 28% në Azinë Jugore dhe në Afrikën Subsahariane deri në 13% në Evropë.",
          "Alter, Geschlecht und Position machten wenig aus: 23 % der Führungskräfte und 21 % der übrigen Beschäftigten. Die Regionen unterschieden sich stärker, von 28 % in Südasien und Afrika südlich der Sahara bis 13 % in Europa.") },
        { type: "callout", reading: true, text: x(
          "Managers were not spared. The person who checks on the team may be the one nobody checks on.",
          "Menaxherët nuk u kursyen. Personi që pyet për ekipin mund të jetë ai për të cilin nuk pyet askush.",
          "Führungskräfte blieben nicht verschont. Wer nach dem Team schaut, ist vielleicht der, nach dem niemand schaut.") },
      ],
      note: x(
        "Gallup, State of the Global Workplace 2026, global data summary, read in full: adults aged 15 and over in employment, surveyed in 2025 by phone or in person. Self-report about one day; hybrid and remote may differ in jobs as well as in place.",
        "Gallup, State of the Global Workplace 2026, përmbledhja e të dhënave globale, lexuar e plotë: të rritur 15 vjeç e lart që punojnë, të anketuar më 2025 me telefon ose ballë për ballë. Vetëraportim për një ditë; hibridët dhe ata në distancë mund të ndryshojnë edhe në punë, jo vetëm në vend.",
        "Gallup, State of the Global Workplace 2026, globale Datenübersicht, vollständig gelesen: Erwerbstätige ab 15 Jahren, 2025 telefonisch oder persönlich befragt. Selbstauskunft über einen Tag; Hybrid- und Remote-Beschäftigte können sich auch in der Arbeit unterscheiden, nicht nur im Ort."),
      source: ["connect-gallup-sgw-2026"],
    },
    {
      id: "numbers",
      kicker: x("The numbers", "Shifrat", "Die Zahlen"),
      title: [x("148 studies,", "148 studime,", "148 Studien,"), x("one direction", "një drejtim", "eine Richtung")],
      lead: x(
        "Julianne Holt-Lunstad, Timothy Smith and Bradley Layton pooled 148 studies with 308,849 people, followed for 7.5 years on average. Those with stronger social relationships had 50% higher odds of being alive at the end, across age, sex, initial health and cause of death.",
        "Julianne Holt-Lunstad, Timothy Smith dhe Bradley Layton bashkuan 148 studime me 308.849 njerëz, të ndjekur mesatarisht për 7,5 vjet. Ata me marrëdhënie shoqërore më të forta kishin 50% shanse më të larta të ishin gjallë në fund, pavarësisht moshës, gjinisë, shëndetit fillestar dhe shkakut të vdekjes.",
        "Julianne Holt-Lunstad, Timothy Smith und Bradley Layton fassten 148 Studien mit 308.849 Menschen zusammen, im Mittel 7,5 Jahre lang begleitet. Wer stärkere soziale Beziehungen hatte, hatte am Ende um 50 % höhere Chancen, noch zu leben, unabhängig von Alter, Geschlecht, anfänglicher Gesundheit und Todesursache."),
      blocks: [
        { type: "hbars", max: 100, source: ["connect-holt-lunstad-2010"],
          label: x("Higher odds of survival, by how relationships were measured (2010)", "Shanse më të larta mbijetese, sipas mënyrës si u matën marrëdhëniet (2010)", "Höhere Überlebenschancen, nach Messung der Beziehungen (2010)"),
          items: [
            { k: x("Complex measures of integration", "Masa të përbëra të integrimit", "Komplexe Maße der Einbindung"), v: 91, n: pc(91), alert: true },
            { k: x("Social integration", "Integrimi shoqëror", "Soziale Einbindung"), v: 52, n: pc(52) },
            { k: x("Social networks", "Rrjetet shoqërore", "Soziale Netzwerke"), v: 45, n: pc(45) },
            { k: x("Not lonely", "Jo i vetmuar", "Nicht einsam"), v: 45, n: pc(45) },
            { k: x("Feeling supported", "Ndjesia e mbështetjes", "Gefühlter Rückhalt"), v: 35, n: pc(35) },
            { k: x("Not living alone", "Nuk jeton vetëm", "Nicht allein lebend"), v: 19, n: pc(19) },
          ] },
        { type: "callout", reading: true, text: x(
          "The simplest measure, living with someone, said least. How embedded a person is said most.",
          "Masa më e thjeshtë, të jetosh me dikë, tregoi më pak. Sa e lidhur është një person me të tjerët tregoi më shumë.",
          "Das einfachste Maß, mit jemandem zu leben, sagte am wenigsten. Wie eingebunden jemand ist, sagte am meisten.") },
      ],
      note: x(
        "Holt-Lunstad et al. (2010), PLOS Medicine, read in full; bars are odds ratios from its Table 4 written as percent higher odds. For living alone the interval includes no effect. Observational studies, not trials; the authors call it comparable with quitting smoking. Mental health at work is No. 75.",
        "Holt-Lunstad et al. (2010), PLOS Medicine, lexuar i plotë; shiritat janë raportet e shanseve nga tabela 4, të shkruara si përqindje e shanseve më të larta. Për jetesën vetëm, intervali përfshin edhe mungesën e efektit. Studime vëzhguese, jo prova; autorët e quajnë të krahasueshme me lënien e duhanit. Shëndeti mendor në punë është te Nr. 75.",
        "Holt-Lunstad et al. (2010), PLOS Medicine, vollständig gelesen; die Balken sind Odds Ratios aus Tabelle 4, als Prozent höhere Chancen geschrieben. Beim Alleinleben schließt das Intervall keinen Effekt ein. Beobachtungsstudien, keine Versuche; die Autoren nennen es vergleichbar mit dem Rauchstopp. Psychische Gesundheit bei der Arbeit steht in Nr. 75."),
      source: ["connect-holt-lunstad-2010"],
    },
    {
      id: "model",
      kicker: x("The model", "Modeli", "Das Modell"),
      title: [x("Around people,", "Mes njerëzve,", "Unter Menschen,"), x("or held by them", "apo i mbajtur prej tyre", "oder getragen")],
      lead: x(
        "The review separates two sides of relationships. Structural: how many people a person is connected to and takes part with. Functional: the support received and the support a person believes is there. The two correlate only moderately, typically 0.20 to 0.30.",
        "Rishikimi ndan dy anë të marrëdhënieve. Ana strukturore: me sa njerëz është i lidhur një person dhe me sa merr pjesë në diçka. Ana funksionale: mbështetja që merr dhe mbështetja që beson se ekziston. Të dyja lidhen vetëm mesatarisht, zakonisht 0,20 deri në 0,30.",
        "Die Übersicht trennt zwei Seiten von Beziehungen. Strukturell: mit wie vielen Menschen jemand verbunden ist und woran er teilnimmt. Funktional: der erhaltene Rückhalt und der Rückhalt, den jemand für vorhanden hält. Beide hängen nur mäßig zusammen, meist 0,20 bis 0,30."),
      blocks: [
        { type: "lists", cols: [
          { h: x("Structural: who is around", "Strukturore: kush është përreth", "Strukturell: wer da ist"), items: [
            x("Size of the network", "Madhësia e rrjetit", "Größe des Netzwerks"),
            x("Taking part with others", "Pjesëmarrja me të tjerët", "Teilnahme mit anderen"),
            x("At work: a crew, a shift, a team", "Në punë: një grup, një turn, një ekip", "Bei der Arbeit: eine Crew, eine Schicht, ein Team"),
          ] },
          { h: x("Functional: who would help", "Funksionale: kush do të ndihmonte", "Funktional: wer helfen würde"), accent: true, items: [
            x("Support a person receives", "Mbështetja që merr një person", "Rückhalt, den jemand bekommt"),
            x("Support a person believes is there", "Mbështetja që beson se ekziston", "Rückhalt, den jemand für vorhanden hält"),
            x("At work: someone to ask, someone who notices", "Në punë: dikush për të pyetur, dikush që vëren", "Bei der Arbeit: jemand zum Fragen, jemand, der es merkt"),
          ] },
        ] },
        { type: "p", text: x(
          "In a US study reported in 2024, Gallup found employees with a best friend at work 21% less likely to be lonely, and engaged employees 64% less likely. Only about two in ten US employees report such a friend. Worldwide, actively disengaged workers were lonely almost as often as the unemployed: 31% against 32%.",
          "Në një studim amerikan të raportuar më 2024, Gallup gjeti se punonjësit me një mik të ngushtë në punë kishin 21% më pak gjasa të ishin të vetmuar, dhe punonjësit e angazhuar 64% më pak. Vetëm rreth dy në dhjetë punonjës amerikanë thonë se kanë një mik të tillë. Në botë, të çangazhuarit aktivë ishin të vetmuar pothuajse aq shpesh sa të papunët: 31% kundrejt 32%.",
          "In einer 2024 berichteten US-Studie fand Gallup Beschäftigte mit einem besten Freund bei der Arbeit um 21 % seltener einsam, engagierte Beschäftigte um 64 % seltener. Nur etwa zwei von zehn US-Beschäftigten nennen einen solchen Freund. Weltweit waren aktiv Unengagierte fast so oft einsam wie Arbeitslose: 31 % gegenüber 32 %.") },
        { type: "callout", reading: true, text: x(
          "Putting people in one room builds the left column. The right one grows from work done together and help that comes.",
          "Të vendosësh njerëzit në një dhomë ndërton kolonën e majtë. E djathta rritet nga puna e bërë bashkë dhe ndihma që vjen.",
          "Menschen in einen Raum zu setzen, baut die linke Spalte. Die rechte wächst aus gemeinsamer Arbeit und Hilfe, die kommt.") },
      ],
      note: x(
        "Columns: Holt-Lunstad et al. (2010); the work examples are the editors'. Gallup figures: Pendell (2024), whose 31% and 32% are from the 2024 world report, and Patel & Plowman (2022); associations, not effects. Engagement is No. 9, onboarding and buddies No. 24.",
        "Kolonat: Holt-Lunstad et al. (2010); shembujt nga puna janë të redaksisë. Shifrat e Gallup-it: Pendell (2024), te i cili 31% dhe 32% vijnë nga raporti botëror i 2024-s, dhe Patel & Plowman (2022); lidhje, jo efekte. Angazhimi është te Nr. 9, hyrja në punë dhe kolegët udhërrëfyes te Nr. 24.",
        "Spalten: Holt-Lunstad et al. (2010); die Beispiele aus der Arbeit stammen von der Redaktion. Gallup-Zahlen: Pendell (2024), dessen 31 % und 32 % aus dem Weltbericht 2024 stammen, und Patel & Plowman (2022); Zusammenhänge, keine Wirkungen. Engagement steht in Nr. 9, Einarbeitung und Paten in Nr. 24."),
      source: ["connect-holt-lunstad-2010", "connect-gallup-pendell-2024", "connect-gallup-patel-2022"],
    },
    {
      id: "research",
      kicker: x("What the research says", "Çfarë thotë kërkimi", "Was die Forschung sagt"),
      title: [x("Lonely,", "I vetmuar,", "Einsam,"), x("then gone", "pastaj i larguar", "dann weg")],
      lead: x(
        "Natsu Sasaki and colleagues at the University of Tokyo measured loneliness at work among 706 full-time employees in February 2024 and asked again in August. Within those six months, 47 had left their job or moved to another employer. Before, studies had linked such loneliness only to the wish to leave.",
        "Natsu Sasaki dhe kolegët në Universitetin e Tokios matën vetminë në punë te 706 punonjës me kohë të plotë në shkurt 2024 dhe i pyetën përsëri në gusht. Brenda atyre gjashtë muajve, 47 kishin lënë punën ose kishin kaluar te një punëdhënës tjetër. Më parë, studimet e kishin lidhur këtë vetmi vetëm me dëshirën për t'u larguar.",
        "Natsu Sasaki und Kollegen von der Universität Tokio maßen im Februar 2024 die Einsamkeit bei der Arbeit unter 706 Vollzeitbeschäftigten und fragten im August erneut. In diesen sechs Monaten hatten 47 ihre Stelle aufgegeben oder den Arbeitgeber gewechselt. Zuvor hatten Studien solche Einsamkeit nur mit dem Wunsch zu gehen verbunden."),
      blocks: [
        { type: "figures", compact: true, items: [
          { n: pcd("6.7"), t: x("of the 706 had left within six months", "nga 706 ishin larguar brenda gjashtë muajve", "der 706 waren binnen sechs Monaten gegangen") },
          { n: dec("1.46"), t: x("odds of leaving per standard deviation more loneliness, three-question scale", "shanset e largimit për çdo devijim standard më shumë vetmi, shkalla me tri pyetje", "Chance zu gehen je Standardabweichung mehr Einsamkeit, Skala mit drei Fragen") },
          { n: dec("1.42"), t: x("the same on a 16-item scale; 1.31 on a single question", "e njëjta në një shkallë me 16 pyetje; 1,31 me një pyetje të vetme", "dasselbe auf einer Skala mit 16 Aussagen; 1,31 bei einer einzigen Frage") },
        ] },
        { type: "p", text: x(
          "All three measures pointed the same way, after adjusting for sex, age, marital status, occupation and contract. Loneliness went with changing employer, not with ending up unemployed, though only 12 had. The link held when those near retirement age were left out.",
          "Të tri masat treguan në të njëjtin drejtim, pasi u morën parasysh gjinia, mosha, gjendja civile, profesioni dhe kontrata. Vetmia shkoi bashkë me ndërrimin e punëdhënësit, jo me mbetjen pa punë, ndonëse vetëm 12 kishin mbetur pa punë. Lidhja mbajti edhe kur u lanë jashtë ata afër moshës së pensionit.",
          "Alle drei Maße zeigten in dieselbe Richtung, bereinigt um Geschlecht, Alter, Familienstand, Beruf und Vertragsart. Einsamkeit ging mit dem Wechsel des Arbeitgebers einher, nicht mit Arbeitslosigkeit, die allerdings nur 12 betraf. Der Zusammenhang hielt auch ohne die Personen nahe dem Rentenalter.") },
        { type: "callout", reading: true, text: x(
          "The lonely did not drop out of work. They took their work somewhere else.",
          "Të vetmuarit nuk e lanë punën fare. E çuan punën e tyre diku tjetër.",
          "Die Einsamen schieden nicht aus dem Arbeitsleben aus. Sie nahmen ihre Arbeit woandershin mit.") },
      ],
      note: x(
        "Sasaki et al. (2025), Journal of Occupational Health, read in full in PubMed Central. An online panel in Japan, more graduates than average, only 47 leavers, turnover self-reported; workplace support and personality were not controlled. Why people leave in general is No. 14.",
        "Sasaki et al. (2025), Journal of Occupational Health, lexuar i plotë në PubMed Central. Një panel online në Japoni, më shumë të diplomuar se mesatarja, vetëm 47 të larguar, largimi i vetëraportuar; mbështetja në punë dhe personaliteti nuk u kontrolluan. Pse ikin njerëzit në përgjithësi është te Nr. 14.",
        "Sasaki et al. (2025), Journal of Occupational Health, vollständig in PubMed Central gelesen. Ein Online-Panel in Japan, mehr Hochschulabschlüsse als im Schnitt, nur 47 Gegangene, Kündigung selbst berichtet; Unterstützung bei der Arbeit und Persönlichkeit wurden nicht berücksichtigt. Warum Menschen generell gehen, steht in Nr. 14."),
      source: ["connect-sasaki-2025"],
    },
    {
      id: "measure",
      kicker: x("How it is measured", "Si matet", "Wie es gemessen wird"),
      title: [x("Three", "Tri", "Drei"), x("questions", "pyetje", "Fragen")],
      lead: x(
        "The shortest scale in the Tokyo study took three items from a standard loneliness scale and added “in your workplace or at work” to each. Each is answered hardly ever (1), some of the time (2) or often (3), so the total runs from 3 to 9.",
        "Shkalla më e shkurtër në studimin e Tokios mori tri pyetje nga një shkallë standarde e vetmisë dhe i shtoi secilës “në vendin e punës ose në punë”. Secila përgjigjet rrallë (1), nganjëherë (2) ose shpesh (3), ndaj totali shkon nga 3 në 9.",
        "Die kürzeste Skala der Tokioter Studie nahm drei Fragen aus einer Standardskala für Einsamkeit und setzte vor jede „an Ihrem Arbeitsplatz oder bei der Arbeit“. Geantwortet wird mit kaum je (1), manchmal (2) oder oft (3), die Summe reicht also von 3 bis 9."),
      blocks: [
        { type: "rows", compact: true, items: [
          { h: x("At work, how often do you feel…", "Në punë, sa shpesh ndihesh…", "Bei der Arbeit, wie oft fühlen Sie…"), p: x("…that you lack companionship?", "…se të mungon shoqëria?", "…, dass Ihnen Gesellschaft fehlt?") },
          { h: x("At work, how often do you feel…", "Në punë, sa shpesh ndihesh…", "Bei der Arbeit, wie oft fühlen Sie…"), p: x("…left out?", "…i lënë mënjanë?", "…sich ausgeschlossen?") },
          { h: x("At work, how often do you feel…", "Në punë, sa shpesh ndihesh…", "Bei der Arbeit, wie oft fühlen Sie…"), p: x("…isolated from others?", "…i izoluar nga të tjerët?", "…sich von anderen isoliert?") },
        ] },
        { type: "p", text: x(
          "In the study the average was 4.6. Those who stayed scored 4.59 at the start, those who later left 5.36. Gallup's one question works for a day: did you feel lonely during a lot of yesterday?",
          "Në studim mesatarja ishte 4,6. Ata që qëndruan kishin 4,59 në fillim, ata që u larguan më vonë 5,36. Pyetja e vetme e Gallup-it vlen për një ditë: a u ndjeve i vetmuar gjatë një pjese të madhe të së djeshmes?",
          "In der Studie lag der Mittelwert bei 4,6. Wer blieb, hatte zu Beginn 4,59, wer später ging, 5,36. Gallups eine Frage gilt für einen Tag: Haben Sie sich gestern einen großen Teil des Tages einsam gefühlt?") },
        { type: "callout", reading: true, text: x(
          "Ask without names and report only a team's total. A lonely person will not say so to a form that names them.",
          "Pyet pa emra dhe raporto vetëm totalin e ekipit. Një person i vetmuar nuk e thotë këtë në një formular që e emërton.",
          "Fragen Sie ohne Namen und berichten Sie nur die Summe des Teams. Wer einsam ist, sagt es keinem Formular mit Namen.") },
      ],
      note: x(
        "Items from Sasaki et al. (2025), who adapted a short form of the UCLA Loneliness Scale; the authors say this three-item version is not fully validated. The callout's advice is the editors'. Speaking up without fear is No. 4, incivility No. 79.",
        "Pyetjet nga Sasaki et al. (2025), që përshtatën një formë të shkurtër të Shkallës së Vetmisë UCLA; autorët thonë se ky version me tri pyetje nuk është i vlerësuar plotësisht. Këshilla e kutisë është e redaksisë. Të folurit pa frikë është te Nr. 4, mosrespekti te Nr. 79.",
        "Fragen aus Sasaki et al. (2025), die eine Kurzform der UCLA-Einsamkeitsskala anpassten; die Autoren sagen, diese Version mit drei Fragen sei nicht voll validiert. Der Rat im Kasten stammt von der Redaktion. Angstfreies Ansprechen steht in Nr. 4, Unhöflichkeit in Nr. 79."),
      source: ["connect-sasaki-2025", "connect-gallup-sgw-2026"],
    },
    {
      id: "tool", tool: "/tools/leader-standard-work/",
      kicker: x("Tool of the issue", "Mjeti i numrit", "Werkzeug der Ausgabe"),
      title: [x("The connection", "Karta", "Die Verbundenheits-"), x("card", "e lidhjes", "karte")],
      lead: x(
        "One card per team, reviewed monthly. What a leader decides to do about it goes into the routine in Leader Standard Work, so it is checked off like any other task and not left to the quiet weeks.",
        "Një kartë për ekip, e rishikuar çdo muaj. Ajo që vendos të bëjë drejtuesi hyn në rutinën te Leader Standard Work, që të shënohet si çdo detyrë tjetër dhe të mos lihet për javët e qeta.",
        "Eine Karte je Team, monatlich durchgesehen. Was die Führungskraft daraus macht, kommt in die Routine in Leader Standard Work, damit es wie jede andere Aufgabe abgehakt und nicht den ruhigen Wochen überlassen wird."),
      blocks: [
        { type: "form", items: [
          { h: x("Who works alone", "Kush punon vetëm", "Wer allein arbeitet"), hint: x("nights, remote, the only one of a trade, the newest", "netët, në distancë, i vetmi i zanatit, më i riu", "nachts, remote, als Einzige ihres Fachs, die Neuesten") },
          { h: x("Who each one asks when stuck", "Kë pyet secili kur ngec", "Wen jede Person fragt, wenn sie feststeckt"), hint: x("a name for every person; a blank is the finding", "një emër për çdo person; një vend bosh është vetë gjetja", "ein Name für jede Person; eine Lücke ist der Befund") },
          { h: x("Work done together", "Puna e bërë bashkë", "Gemeinsame Arbeit"), hint: x("a task each person shares with someone, not only a shared room", "një detyrë që secili e ndan me dikë, jo vetëm një dhomë e përbashkët", "eine Aufgabe, die jede Person mit jemandem teilt, nicht nur ein Raum") },
          { h: x("The three questions", "Tri pyetjet", "Die drei Fragen"), hint: x("anonymous, team total from 3 to 9 per person, compared with last time", "anonime, totali i ekipit nga 3 në 9 për person, krahasuar me herën e kaluar", "anonym, Teamsumme von 3 bis 9 je Person, verglichen mit dem letzten Mal") },
          { h: x("Who left, and who they talked to", "Kush u largua, dhe me kë fliste", "Wer ging, und mit wem er sprach"), hint: x("in the exit talk: whom they could turn to, and when that stopped", "në bisedën e largimit: te kush mund të drejtohej, dhe kur pushoi kjo", "im Austrittsgespräch: an wen man sich wenden konnte, und wann das aufhörte") },
          { h: x("This month's step", "Hapi i këtij muaji", "Der Schritt dieses Monats"), hint: x("one change, written into the leader's routine", "një ndryshim, i shkruar në rutinën e drejtuesit", "eine Änderung, in die Routine der Führungskraft geschrieben") },
        ] },
      ],
      note: x(
        "The card is the editors' proposal, built on the review's two sides of relationships, Gallup's data and the Tokyo study; it is not a tested instrument, and it shows only whether a team is connected, not why.",
        "Karta është propozim i redaksisë, i ndërtuar mbi dy anët e marrëdhënieve te rishikimi, të dhënat e Gallup-it dhe studimin e Tokios; nuk është instrument i testuar, dhe tregon vetëm nëse një ekip është i lidhur, jo pse.",
        "Die Karte ist ein Vorschlag der Redaktion, gestützt auf die zwei Seiten von Beziehungen aus der Übersicht, Gallups Daten und die Tokioter Studie; sie ist kein geprüftes Instrument und zeigt nur, ob ein Team verbunden ist, nicht warum."),
      source: ["connect-holt-lunstad-2010", "connect-gallup-sgw-2026", "connect-sasaki-2025"],
    },
    { id: "sources", type: "sources" },
    { id: "back", type: "back" },
  ],
};
