// Management Review, No. 31: Self-awareness and emotional intelligence. Block: Role.
// Facts and their sources: docs/revista/management-review-nr-31.md. No test items are reproduced, and the issue
// gives no psychological diagnosis or advice.
import { x } from "../common.js";

export default {
  number: 31,
  block: "role",
  date: x("October 2026", "Tetor 2026", "Oktober 2026"),
  theme: [x("Self-awareness", "Vetënjohja", "Selbstwahrnehmung"), x("and emotional intelligence", "dhe inteligjenca emocionale", "und emotionale Intelligenz")],
  sub: x(
    "How many people really know themselves, how others see us, Goleman's five components, what the research finds on emotional intelligence, and a self-awareness card.",
    "Sa njerëz e njohin vërtet veten, si na shohin të tjerët, pesë komponentët e Goleman-it, çfarë gjen kërkimi për inteligjencën emocionale, dhe një kartë e vetënjohjes.",
    "Wie viele sich wirklich kennen, wie andere uns sehen, Golemans fünf Komponenten, was die Forschung zu emotionaler Intelligenz findet, und eine Karte."),
  seo: x(
    "Self-awareness and emotional intelligence: Eurich's 10–15%, how self-ratings and others' ratings differ, Goleman's five components, the meta-analyses, a card.",
    "Vetënjohja dhe inteligjenca emocionale: 10–15% e Eurich-it, vetëvlerësimi kundrejt vlerësimit të të tjerëve, Goleman-i, meta-analizat dhe një kartë.",
    "Selbstwahrnehmung und emotionale Intelligenz: Eurichs 10–15 %, Selbst- und Fremdbild, Golemans fünf Komponenten, die Metaanalysen und eine Karte."),
  feature: x(
    "Issue 31 starts with Tasha Eurich's estimate that only 10–15% of people fit the criteria of self-awareness, shows how little self-ratings agree with the ratings of others, sets out Daniel Goleman's five components and the claims made for them, weighs what meta-analyses find about emotional intelligence, and ends with a card for seeing yourself as others do.",
    "Numri 31 nis me vlerësimin e Tasha Eurich-it se vetëm 10–15% e njerëzve i plotësojnë kriteret e vetënjohjes, tregon sa pak përputhet vetëvlerësimi me vlerësimin e të tjerëve, shtjellon pesë komponentët e Daniel Goleman-it dhe pretendimet për to, peshon çfarë gjejnë meta-analizat për inteligjencën emocionale, dhe mbyllet me një kartë për ta parë veten si të shohin të tjerët.",
    "Ausgabe 31 beginnt mit Tasha Eurichs Schätzung, dass nur 10–15 % der Menschen die Kriterien der Selbstwahrnehmung erfüllen, zeigt, wie wenig Selbsteinschätzungen mit den Urteilen anderer übereinstimmen, stellt Daniel Golemans fünf Komponenten und die Behauptungen dazu vor, wägt ab, was Metaanalysen über emotionale Intelligenz finden, und endet mit einer Karte, um sich so zu sehen, wie andere es tun."),
  figure: { n: x("10–15%", "10–15%", "10–15 %"), by: "Eurich, 2018", t: x(
    "of the people studied by Tasha Eurich's team fit the criteria of self-awareness, by her estimate, though most believe they are self-aware.",
    "e njerëzve që studioi ekipi i Tasha Eurich-it i plotësojnë kriteret e vetënjohjes, sipas vlerësimit të saj, ndonëse shumica besojnë se e njohin veten.",
    "der Untersuchten erfüllen laut Tasha Eurichs Schätzung die Kriterien der Selbstwahrnehmung, obwohl die meisten glauben, sich zu kennen.") },
  teasers: [
    { page: "story", kicker: x("Cover story", "Tema kryesore", "Titelthema"),
      title: x("10 to 15 out of 100", "10 deri në 15 nga 100", "10 bis 15 von 100") },
    { page: "model", kicker: x("The model", "Modeli", "Das Modell"),
      title: x("What makes a leader", "Çfarë e bën një drejtues", "Was Führung ausmacht") },
    { page: "tool", kicker: x("Tool of the issue", "Mjeti i numrit", "Werkzeug der Ausgabe"),
      title: x("The self-awareness card", "Karta e vetënjohjes", "Die Karte zur Selbstwahrnehmung") },
  ],
  sources: ["eurich-2018", "harris-schaubroeck-1988", "harms-crede-2010", "goleman-1998", "joseph-newman-2010", "oboyle-2011", "joseph-2015", "fleenor-2010"],
  pages: [
    { id: "cover", type: "cover" },
    {
      id: "intro", type: "intro",
      why: x(
        "A manager watches the team every day, and the team watches the manager, often more clearly. This issue looks at what self-awareness and emotional intelligence are, what the research really shows, and how to learn how others see you.",
        "Një menaxher e sheh ekipin çdo ditë, dhe ekipi e sheh menaxherin, shpesh më qartë. Ky numër shikon çfarë janë vetënjohja dhe inteligjenca emocionale, çfarë tregon vërtet kërkimi, dhe si mëson se si të shohin të tjerët.",
        "Eine Führungskraft sieht das Team jeden Tag, und das Team sieht die Führungskraft, oft klarer. Diese Ausgabe zeigt, was Selbstwahrnehmung und emotionale Intelligenz sind, was die Forschung wirklich belegt und wie man erfährt, wie andere einen sehen."),
      body: x(
        "In Tasha Eurich's research most people believed they were self-aware, but only 10–15% fit her criteria. Ratings of the same people by peers and by bosses agree at 0.62; a person's own rating agrees with either at about 0.35. Daniel Goleman's five components of emotional intelligence came with bold claims. Meta-analyses find moderate links with performance, and much of what self-reported emotional intelligence predicts was already covered by personality and ability measures.",
        "Te kërkimi i Tasha Eurich-it, shumica e njerëzve besonin se e njihnin veten, por vetëm 10–15% i plotësonin kriteret e saj. Vlerësimet e të njëjtëve njerëz nga kolegët dhe nga eprorët përputhen në masën 0,62; vetëvlerësimi me secilin prej tyre, rreth 0,35. Pesë komponentët e inteligjencës emocionale të Daniel Goleman-it erdhën me pretendime të guximshme. Meta-analizat gjejnë lidhje mesatare me performancën, dhe shumë nga ajo që parashikon inteligjenca emocionale e vetëdeklaruar mbulohej tashmë nga matjet e personalitetit dhe të aftësive.",
        "In Tasha Eurichs Forschung glaubten die meisten, sich selbst zu kennen, doch nur 10–15 % erfüllten ihre Kriterien. Urteile von Kollegen und Vorgesetzten über dieselben Menschen korrelieren zu 0,62; die Selbsteinschätzung mit beiden nur zu etwa 0,35. Zu Daniel Golemans fünf Komponenten emotionaler Intelligenz gab es kühne Behauptungen. Metaanalysen finden mäßige Zusammenhänge mit der Leistung, und vieles, was selbst berichtete emotionale Intelligenz vorhersagt, deckten Persönlichkeits- und Fähigkeitsmaße schon ab."),
    },
    {
      id: "story",
      kicker: x("Cover story", "Tema kryesore", "Titelthema"),
      title: [x("10 to 15", "10 deri në 15", "10 bis 15"), x("out of 100", "nga 100", "von 100")],
      lead: x(
        "Tasha Eurich's team ran ten investigations with nearly 5,000 participants and reviewed about 800 studies. Her conclusion in Harvard Business Review, 2018: most people believe they are self-aware, but only 10–15% of those studied fit the criteria.",
        "Ekipi i Tasha Eurich-it bëri dhjetë hetime me afro 5.000 pjesëmarrës dhe shqyrtoi rreth 800 studime. Përfundimi i saj te Harvard Business Review, 2018: shumica e njerëzve besojnë se e njohin veten, por vetëm 10–15% e të studiuarve i plotësojnë kriteret.",
        "Das Team von Tasha Eurich führte zehn Untersuchungen mit fast 5.000 Teilnehmenden durch und sichtete rund 800 Studien. Ihr Fazit in der Harvard Business Review, 2018: Die meisten glauben, sich selbst zu kennen, doch nur 10–15 % der Untersuchten erfüllen die Kriterien."),
      blocks: [
        { type: "figures", compact: true, items: [
          { n: x("10–15%", "10–15%", "10–15 %"), t: x("of the people studied fit the criteria of self-awareness, by Eurich's estimate", "e të studiuarve i plotësojnë kriteret e vetënjohjes, sipas vlerësimit të Eurich-it", "der Untersuchten erfüllen nach Eurichs Schätzung die Kriterien der Selbstwahrnehmung") },
          { n: x("19 of 20", "19 nga 20", "19 von 20"), t: x("competencies in which higher-level leaders overrated themselves more than lower-level ones, in a study of over 3,600 leaders", "kompetenca ku drejtuesit e niveleve më të larta e mbivlerësonin veten më shumë se ata më poshtë, në një studim me mbi 3.600 drejtues", "Kompetenzen, in denen sich ranghöhere Führungskräfte stärker überschätzten als rangniedrigere, in einer Studie mit über 3.600 Führungskräften") },
        ] },
        { type: "p", text: x(
          "Eurich explains it with experience and power: senior leaders have fewer people above them who give candid feedback, and the more power a leader holds, the less comfortable others feel offering criticism. The most effective leaders, she writes, counter this by seeking critical feedback often, from bosses, peers, staff and the board.",
          "Eurich e shpjegon me përvojën dhe pushtetin: drejtuesit e lartë kanë më pak njerëz mbi vete që u japin feedback të sinqertë, dhe sa më shumë pushtet ka një drejtues, aq më pak rehat ndihen të tjerët t'i bëjnë kritika. Drejtuesit më efektivë, shkruan ajo, i kundërvihen kësaj duke kërkuar shpesh feedback kritik, nga eprorët, kolegët, punonjësit dhe bordi.",
          "Eurich erklärt es mit Erfahrung und Macht: Ranghohe Führungskräfte haben weniger Menschen über sich, die offenes Feedback geben, und je mehr Macht jemand hat, desto weniger wohl fühlen sich andere dabei, Kritik zu üben. Die wirksamsten Führungskräfte, schreibt sie, steuern dagegen, indem sie oft kritisches Feedback suchen, bei Vorgesetzten, Kollegen, Mitarbeitenden und dem Aufsichtsrat.") },
        { type: "callout", reading: true, text: x(
          "Rank brings more information about the business and less about yourself. That gap has to be closed on purpose.",
          "Posti sjell më shumë informacion për biznesin dhe më pak për veten. Ky boshllëk mbyllet vetëm me qëllim.",
          "Mit dem Rang wächst das Wissen über das Geschäft und schrumpft das über einen selbst. Diese Lücke schließt man nur mit Absicht.") },
      ],
      note: x(
        "The 10–15% is the author's estimate; her criteria and calculation are not published in the texts we saw, and the study of 3,600 leaders she cites is not named.",
        "10–15% është vlerësim i autores; kriteret dhe llogaritjen e saj s'i kam parë të botuara, dhe studimi me 3.600 drejtues që citon nuk emërtohet.",
        "Die 10–15 % sind eine Schätzung der Autorin; ihre Kriterien und Berechnung sind in den eingesehenen Texten nicht veröffentlicht, und die zitierte Studie mit 3.600 Führungskräften wird nicht namentlich genannt."),
      source: ["eurich-2018"],
    },
    {
      id: "numbers",
      kicker: x("The numbers", "Shifrat", "Die Zahlen"),
      title: [x("How others", "Si na shohin", "Wie andere"), x("see us", "të tjerët", "uns sehen")],
      lead: x(
        "In 1988 Michael Harris and John Schaubroeck pooled studies of performance ratings. Peers and bosses agreed fairly well about the same people; the people's own ratings agreed far less with either.",
        "Në 1988, Michael Harris dhe John Schaubroeck bashkuan studimet për vlerësimet e performancës. Kolegët dhe eprorët përputheshin mjaft mirë për të njëjtët njerëz; vetëvlerësimet e këtyre njerëzve përputheshin shumë më pak me secilin prej tyre.",
        "1988 fassten Michael Harris und John Schaubroeck Studien zu Leistungsbeurteilungen zusammen. Kollegen und Vorgesetzte urteilten über dieselben Menschen recht ähnlich; deren Selbsteinschätzung stimmte mit beiden viel weniger überein."),
      blocks: [
        { type: "columns", max: 0.7, height: 96, source: ["harris-schaubroeck-1988"],
          label: x("Agreement between ratings of the same people's performance (correlation)", "Përputhja mes vlerësimeve të performancës së të njëjtëve njerëz (korrelacioni)", "Übereinstimmung der Urteile über die Leistung derselben Menschen (Korrelation)"),
          items: [
            { k: x("Self and boss", "Vetja dhe eprori", "Selbst und Chef"), v: 0.35, n: x("0.35", "0,35", "0,35") },
            { k: x("Self and peers", "Vetja dhe kolegët", "Selbst und Kollegen"), v: 0.36, n: x("0.36", "0,36", "0,36") },
            { k: x("Peers and boss", "Kolegët dhe eprori", "Kollegen und Chef"), v: 0.62, n: x("0.62", "0,62", "0,62"), alert: true },
          ] },
        { type: "columns", max: 0.7, height: 96, source: ["harms-crede-2010"],
          label: x("Link between a leader's EI and transformational leadership, by who rates them", "Lidhja mes IE-së së drejtuesit dhe udhëheqjes transformuese, sipas vlerësuesve", "Zusammenhang zwischen EI und transformationaler Führung, je nachdem, wer urteilt"),
          items: [
            { k: x("The same person rates both", "I njëjti person vlerëson të dyja", "Dieselbe Person urteilt"), v: 0.59, n: x("0.59", "0,59", "0,59") },
            { k: x("Different people rate them", "Persona të ndryshëm vlerësojnë", "Verschiedene Personen urteilen"), v: 0.12, n: x("0.12", "0,12", "0,12"), alert: true },
          ] },
        { type: "p", text: x(
          "Peter Harms and Marcus Credé found the second pattern in a 2010 meta-analysis. Different raters also agreed little with each other: 0.14 on leadership and 0.16 on emotional intelligence.",
          "Peter Harms dhe Marcus Credé e gjetën modelin e dytë në një meta-analizë të 2010. Edhe vlerësuesit e ndryshëm përputheshin pak me njëri-tjetrin: 0,14 për udhëheqjen dhe 0,16 për inteligjencën emocionale.",
          "Peter Harms und Marcus Credé fanden das zweite Muster 2010 in einer Metaanalyse. Auch verschiedene Beurteilende stimmten kaum überein: 0,14 bei der Führung und 0,16 bei der emotionalen Intelligenz.") },
      ],
      note: x(
        "Correlations from meta-analyses, not proof of cause. The 1988 figures concern performance ratings in general, not emotional intelligence.",
        "Korrelacione nga meta-analiza, jo provë shkaku. Shifrat e 1988 kanë të bëjnë me vlerësimet e performancës në përgjithësi, jo me inteligjencën emocionale.",
        "Korrelationen aus Metaanalysen, kein Beweis einer Ursache. Die Zahlen von 1988 betreffen Leistungsbeurteilungen allgemein, nicht emotionale Intelligenz."),
      source: ["harris-schaubroeck-1988", "harms-crede-2010"],
    },
    {
      id: "model", more: "from-albania-to-germany",
      kicker: x("The model", "Modeli", "Das Modell"),
      title: [x("What makes", "Çfarë e bën", "Was eine Führungskraft"), x("a leader", "një drejtues", "ausmacht")],
      lead: x(
        "In 1998 Daniel Goleman described emotional intelligence at work in five components. Self-awareness comes first: knowing your emotions, strengths, weaknesses, drives and values, and their effect on others.",
        "Në 1998, Daniel Goleman e përshkroi inteligjencën emocionale në punë me pesë komponentë. E para vjen vetënjohja: të njohësh emocionet, pikat e forta, dobësitë, shtysat dhe vlerat e tua, dhe ndikimin e tyre te të tjerët.",
        "1998 beschrieb Daniel Goleman emotionale Intelligenz bei der Arbeit in fünf Komponenten. Zuerst kommt die Selbstwahrnehmung: eigene Gefühle, Stärken, Schwächen, Antriebe, Werte und ihre Wirkung auf andere kennen."),
      blocks: [
        { type: "rows", compact: true, items: [
          { h: x("Self-awareness", "Vetënjohja", "Selbstwahrnehmung"), p: x("Realistic self-assessment, humour about oneself, a thirst for constructive criticism.", "Vetëvlerësim realist, humor me veten, etje për kritikë konstruktive.", "Realistische Selbsteinschätzung, Selbstironie, Hunger nach konstruktiver Kritik.") },
          { h: x("Self-regulation", "Vetërregullimi", "Selbststeuerung"), p: x("Managing disruptive emotions and impulses: thinking before acting.", "Menaxhimi i emocioneve dhe impulseve trazuese: të mendosh para se të veprosh.", "Störende Gefühle und Impulse steuern: erst denken, dann handeln.") },
          { h: x("Motivation", "Motivimi", "Motivation"), p: x("Passion for the work beyond money or status, and persistence.", "Pasion për punën përtej parave ose statusit, dhe këmbëngulje.", "Leidenschaft für die Arbeit jenseits von Geld oder Status, und Ausdauer.") },
          { h: x("Empathy", "Empatia", "Empathie"), p: x("Understanding the emotional makeup of others and treating them accordingly.", "Të kuptosh përbërjen emocionale të të tjerëve dhe t'i trajtosh sipas saj.", "Die Gefühlslage anderer verstehen und sie entsprechend behandeln.") },
          { h: x("Social skill", "Aftësia sociale", "Soziale Kompetenz"), p: x("Managing relationships, building networks, finding common ground.", "Menaxhimi i marrëdhënieve, ndërtimi i rrjeteve, gjetja e gjuhës së përbashkët.", "Beziehungen gestalten, Netzwerke knüpfen, Gemeinsamkeiten finden.") },
        ] },
        { type: "p", text: x(
          "His basis: competency models from 188 companies, some built from senior managers' judgments, some from criteria such as division profits. He wrote that emotional intelligence was twice as important as technical skills and IQ for jobs at all levels, and that for senior leaders nearly 90% of the difference in their profiles came from it. The article does not show how these ratios were calculated.",
          "Baza e tij: modelet e kompetencave të 188 kompanive, disa të ndërtuara nga gjykimi i drejtuesve të lartë, disa me kritere si fitimi i divizionit. Shkroi se inteligjenca emocionale ishte dy herë më e rëndësishme se aftësitë teknike dhe IQ-ja për punët në të gjitha nivelet, dhe se te drejtuesit e lartë afro 90% e diferencës në profilet e tyre vinte prej saj. Artikulli nuk tregon si u llogaritën këto raporte.",
          "Grundlage: Kompetenzmodelle aus 188 Unternehmen, teils aus dem Urteil von Topführungskräften, teils aus Kriterien wie dem Bereichsgewinn. Emotionale Intelligenz sei auf allen Ebenen doppelt so wichtig wie Fachwissen und IQ, und bei Topführungskräften gehe fast 90 % des Unterschieds in ihren Profilen auf sie zurück. Wie das berechnet wurde, zeigt der Artikel nicht.") },
        { type: "callout", reading: true, text: x(
          "The five components are a useful checklist. The ratios are a claim, not a finding.",
          "Pesë komponentët janë një listë kontrolli e dobishme. Raportet janë pretendim, jo gjetje.",
          "Die fünf Komponenten sind eine nützliche Checkliste. Die Zahlen sind eine Behauptung, kein Befund.") },
      ],
      note: x(
        "HBR is a magazine for practitioners, not a peer-reviewed journal. The 90% refers to differences between competency profiles, not to the share of performance that emotional intelligence explains.",
        "HBR është revistë për praktikuesit, jo revistë shkencore me recension. 90% u referohet diferencave mes profileve të kompetencave, jo pjesës së performancës që shpjegon inteligjenca emocionale.",
        "Die HBR ist ein Magazin für die Praxis, keine begutachtete Fachzeitschrift. Die 90 % beziehen sich auf Unterschiede zwischen Kompetenzprofilen, nicht auf den Anteil der Leistung, den emotionale Intelligenz erklärt."),
      source: ["goleman-1998"],
    },
    {
      id: "research",
      kicker: x("What the research says", "Çfarë thotë kërkimi", "Was die Forschung sagt"),
      title: [x("Two kinds of", "Dy lloje", "Zwei Arten"), x("emotional intelligence", "inteligjence emocionale", "emotionaler Intelligenz")],
      lead: x(
        "In 2010 Dana Joseph and Daniel Newman showed that the label covers two different things: ability EI, measured with tests that have right answers, and mixed EI, measured mostly with self-report questionnaires that also take in personality, motivation and other competencies.",
        "Në 2010, Dana Joseph dhe Daniel Newman treguan se emri mbulon dy gjëra të ndryshme: IE-në si aftësi, që matet me teste me përgjigje të sakta, dhe IE-në e përzier, që matet kryesisht me pyetësorë vetëvlerësimi që përfshijnë edhe personalitetin, motivimin dhe kompetenca të tjera.",
        "2010 zeigten Dana Joseph und Daniel Newman, dass der Begriff zwei verschiedene Dinge umfasst: EI als Fähigkeit, gemessen in Tests mit richtigen Antworten, und gemischte EI, gemessen vor allem mit Selbstauskunftsbögen, die auch Persönlichkeit, Motivation und andere Kompetenzen erfassen."),
      blocks: [
        { type: "p", text: x(
          "Ernest O'Boyle and colleagues found that all three kinds of EI measure correlate with job performance, at 0.24 to 0.30 after correction. For ability EI, Joseph and Newman found the link inconsistent: positive in jobs with much emotional labour, negative in jobs with little.",
          "Ernest O'Boyle dhe kolegët gjetën se të tria llojet e matjes së IE-së lidhen me performancën në punë, me korrelacione nga 0,24 deri në 0,30 pas korrigjimit. Për IE-në si aftësi, Joseph dhe Newman e gjetën lidhjen të paqëndrueshme: pozitive në punët me shumë punë emocionale, negative në ato me pak.",
          "Ernest O'Boyle und Kollegen fanden, dass alle drei Arten von EI-Messungen mit der Arbeitsleistung zusammenhängen; korrigiert liegen die Korrelationen zwischen 0,24 und 0,30. Für EI als Fähigkeit fanden Joseph und Newman den Zusammenhang uneinheitlich: positiv in Berufen mit viel Emotionsarbeit, negativ in solchen mit wenig.") },
        { type: "chain", label: x("Self-reported, mixed EI and job performance (Joseph et al., 2015)", "IE-ja e përzier, e vetëdeklaruar, dhe performanca në punë (Joseph et al., 2015)", "Selbst berichtete, gemischte EI und Arbeitsleistung (Joseph et al., 2015)"), items: [
          { h: x("0.47", "0,47", "0,47"), p: x("the earlier estimate, from 2010", "vlerësimi i mëparshëm, i 2010", "die frühere Schätzung von 2010") },
          { h: x("0.29", "0,29", "0,29"), p: x("the updated estimate, with performance rated by supervisors", "vlerësimi i përditësuar, me performancën të vlerësuar nga eprori", "die aktualisierte Schätzung, mit Leistungsurteil der Vorgesetzten") },
          { h: x("−0.02", "−0,02", "−0,02"), p: x("after controlling for ability EI, self-efficacy, self-rated performance, personality and general mental ability", "pasi kontrollohen IE-ja si aftësi, besimi te vetja, performanca e vetëvlerësuar, personaliteti dhe aftësia mendore", "nach Kontrolle von EI als Fähigkeit, Selbstwirksamkeit, selbst eingeschätzter Leistung, Persönlichkeit und allgemeiner Denkfähigkeit") },
        ] },
        { type: "callout", reading: true, text: x(
          "What self-report questionnaires predict, older measures mostly predicted already. What others can see a leader do is a better place to start.",
          "Atë që parashikojnë pyetësorët e vetëvlerësimit, e parashikonin kryesisht matje më të vjetra. Më mirë të nisesh nga ajo që të tjerët e shohin drejtuesin të bëjë.",
          "Was Selbstauskunftsbögen vorhersagen, sagten ältere Maße meist schon voraus. Besser beginnt man bei dem, was andere eine Führungskraft tun sehen.") },
      ],
      note: x(
        "Correlations, not proof of cause; 0.47 and 0.29 are correlations, −0.02 is a regression weight. The O'Boyle figures are confirmed through secondary sources only.",
        "Korrelacione, jo provë shkaku; 0,47 dhe 0,29 janë korrelacione, −0,02 është peshë regresioni. Shifrat e O'Boyle-it konfirmohen vetëm përmes burimeve dytësore.",
        "Korrelationen, kein Beweis einer Ursache; 0,47 und 0,29 sind Korrelationen, −0,02 ist ein Regressionsgewicht. Die Werte von O'Boyle sind nur über Sekundärquellen belegt."),
      source: ["joseph-newman-2010", "oboyle-2011", "joseph-2015"],
    },
    {
      id: "measure",
      kicker: x("How it is measured", "Si matet", "Wie man es misst"),
      title: [x("Seeing yourself,", "Si e sheh veten,", "Sich sehen,"), x("being seen", "si të shohin", "gesehen werden")],
      lead: x(
        "Eurich separates internal self-awareness, how clearly we see our own values, reactions and impact, from external self-awareness, how well we understand how others see us. By her account the two are unrelated, which gives four types.",
        "Eurich e ndan vetënjohjen e brendshme, sa qartë i shohim vlerat, reagimet dhe ndikimin tonë, nga vetënjohja e jashtme, sa mirë e kuptojmë si na shohin të tjerët. Sipas saj, të dyja nuk lidhen me njëra-tjetrën, dhe kjo jep katër tipa.",
        "Eurich unterscheidet die innere Selbstwahrnehmung, wie klar wir unsere Werte, Reaktionen und Wirkung sehen, von der äußeren, wie gut wir verstehen, wie andere uns sehen. Ihr zufolge hängen beide nicht zusammen, und daraus ergeben sich vier Typen."),
      blocks: [
        { type: "matrix", y: x("Internal self-awareness", "Vetënjohja e brendshme", "Innere Selbstwahrnehmung"), x: x("External self-awareness", "Vetënjohja e jashtme", "Äußere Selbstwahrnehmung"), cells: [
          { h: "Introspectors", tone: "dim", where: x("high internal · low external", "e brendshme e lartë · e jashtme e ulët", "innen hoch · außen niedrig"), p: x("Clear about who they are, but often surprised by how others react.", "E dinë qartë kush janë, por shpesh i befasojnë reagimet e të tjerëve.", "Im Klaren über sich, aber oft überrascht, wie andere reagieren.") },
          { h: "Aware", tone: "blue", where: x("high internal · high external", "e brendshme e lartë · e jashtme e lartë", "innen hoch · außen hoch"), p: x("They see themselves clearly and understand their effect on others.", "E shohin veten qartë dhe e kuptojnë ndikimin që kanë te të tjerët.", "Sie sehen sich klar und verstehen ihre Wirkung auf andere.") },
          { h: "Seekers", tone: "dim", where: x("low internal · low external", "e brendshme e ulët · e jashtme e ulët", "innen niedrig · außen niedrig"), p: x("Not yet clear who they are or how others experience them.", "Ende nuk e kanë të qartë kush janë ose si i përjetojnë të tjerët.", "Noch unklar, wer sie sind und wie andere sie erleben.") },
          { h: "Pleasers", tone: "red", where: x("low internal · high external", "e brendshme e ulët · e jashtme e lartë", "innen niedrig · außen hoch"), p: x("Focused on what others expect, at times at the cost of their own needs and values.", "Të vëmendshëm ndaj asaj që presin të tjerët, ndonjëherë në kurriz të nevojave dhe vlerave të tyre.", "Auf die Erwartungen anderer ausgerichtet, manchmal auf Kosten eigener Bedürfnisse und Werte.") },
        ] },
        { type: "p", text: x(
          "Measuring it means comparing a self-rating with other people's ratings. John Fleenor and colleagues reviewed the research on this self–other agreement: studies measure it in different ways, so their findings conflict, including on whether leaders who over-rate themselves are less effective.",
          "Ta matësh do të thotë ta krahasosh vetëvlerësimin me vlerësimet e të tjerëve. John Fleenor dhe kolegët shqyrtuan kërkimin për këtë përputhje mes vetes dhe të tjerëve: studimet e masin ndryshe, prandaj gjetjet nuk përputhen, edhe për pyetjen nëse drejtuesit që e mbivlerësojnë veten janë më pak efektivë.",
          "Messen heißt, eine Selbsteinschätzung mit den Urteilen anderer zu vergleichen. John Fleenor und Kollegen sichteten die Forschung zu dieser Selbst-Fremd-Übereinstimmung: Studien messen sie unterschiedlich, deshalb widersprechen sich die Befunde, auch bei der Frage, ob Führungskräfte, die sich überschätzen, weniger wirksam sind.") },
      ],
      note: x(
        "The four types are a description, not a measured split: how many people fall into each is not given.",
        "Katër tipat janë përshkrim, jo ndarje e matur: sa njerëz bien në secilin nuk jepet.",
        "Die vier Typen sind eine Beschreibung, keine gemessene Aufteilung: Wie viele Menschen in jeden fallen, wird nicht genannt."),
      source: ["eurich-2018", "fleenor-2010"],
    },
    {
      id: "tool",
      kicker: x("Tool of the issue", "Mjeti i numrit", "Werkzeug der Ausgabe"),
      title: [x("The self-awareness", "Karta e", "Die Karte zur"), x("card", "vetënjohjes", "Selbstwahrnehmung")],
      lead: x(
        "Answer the questions yourself, then ask three people who see your work, a boss, a peer and someone in your team, the same ones. The gaps are the point.",
        "Përgjigju vetë pyetjeve, pastaj bëjua të njëjtat tre njerëzve që e shohin punën tënde: një eprori, një kolegu dhe dikujt nga ekipi. Boshllëqet janë qëllimi.",
        "Die Fragen selbst beantworten und dann drei Menschen, die die eigene Arbeit sehen, dieselben stellen: einer vorgesetzten Person, einem Kollegen und jemandem aus dem Team. Auf die Lücken kommt es an."),
      blocks: [
        { type: "form", items: [
          { h: x("What I do well", "Çfarë bëj mirë", "Was ich gut mache"), hint: x("two or three things, in my words", "dy ose tri gjëra, me fjalët e mia", "zwei oder drei Dinge, in meinen Worten") },
          { h: x("What they say I do well", "Çfarë thonë ata që bëj mirë", "Was ich laut anderen gut mache"), hint: x("the same question, in their words", "e njëjta pyetje, me fjalët e tyre", "dieselbe Frage, in ihren Worten") },
          { h: x("What I could do better", "Çfarë mund të bëj më mirë", "Was ich besser machen könnte"), hint: x("my view", "mendimi im", "meine Sicht") },
          { h: x("What they say I could do better", "Çfarë thonë ata që mund të bëj më mirë", "Was ich laut anderen besser machen könnte"), hint: x("their view, without arguing back", "mendimi i tyre, pa e kundërshtuar", "ihre Sicht, ohne zu widersprechen") },
          { h: x("Where we differ most", "Ku ndryshojmë më shumë", "Wo wir am weitesten auseinanderliegen"), hint: x("one gap to look at", "një boshllëk për ta parë nga afër", "eine Lücke, die ich mir ansehe") },
          { h: x("One thing to try", "Një gjë për ta provuar", "Eine Sache zum Ausprobieren"), hint: x("what, from when, and when I ask again", "çfarë, kur e nis, dhe kur pyes sërish", "was, ab wann, und wann ich wieder frage") },
        ] },
      ],
      note: x(
        "A practice proposed by the editors, after Eurich (2018) on external self-awareness and critical feedback. It is not a test of emotional intelligence.",
        "Praktikë e propozuar nga redaksia, sipas Eurich-it (2018) për vetënjohjen e jashtme dhe feedback-un kritik. Nuk është test i inteligjencës emocionale.",
        "Eine Praxis, die die Redaktion vorschlägt, nach Eurich (2018) zu äußerer Selbstwahrnehmung und kritischem Feedback. Sie ist kein Test emotionaler Intelligenz."),
      source: ["eurich-2018"],
    },
    { id: "sources", type: "sources" },
    { id: "back", type: "back" },
  ],
};
