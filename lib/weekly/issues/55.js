// Management Review, No. 55: Multicultural teams: mapping the differences. Block: People.
// Facts and their sources: docs/revista/management-review-nr-55.md. The GLOBE figures are rounded by the editors from
// the aggregated society-level data file of the GLOBE Project (17 May 2004); "Germany" there is the West German sample.
import { x } from "../common.js";

export default {
  number: 55,
  block: "people",
  date: x("November 2026", "Nëntor 2026", "November 2026"),
  theme: [x("Multicultural teams:", "Ekipet me shumë kultura:", "Teams mit vielen Kulturen:"), x("mapping the differences", "harta e dallimeve", "eine Landkarte der Unterschiede")],
  sub: x(
    "Erin Meyer's eight scales, Albania and Germany in GLOBE, what its managers say is done and should be, a meta-analysis of 10,632 teams, a scale for cultural intelligence, and a card for team norms.",
    "Tetë shkallët e Erin Meyer-it, Shqipëria dhe Gjermania te GLOBE, çfarë thonë menaxherët e tij se bëhet dhe se duhet, një meta-analizë e 10.632 ekipeve, një shkallë për inteligjencën kulturore, dhe një kartë për normat e ekipit.",
    "Erin Meyers acht Skalen, Albanien und Deutschland in GLOBE, was die Führungskräfte dort für Praxis halten und wollen, eine Metaanalyse von 10.632 Teams, eine Skala für kulturelle Intelligenz und eine Karte für Teamregeln."),
  seo: x(
    "Multicultural teams: Meyer's eight scales, Albania and Germany in the GLOBE study, a meta-analysis of 10,632 teams and a card for team norms.",
    "Ekipet me shumë kultura: tetë shkallët e Meyer-it, Shqipëria dhe Gjermania te studimi GLOBE, 10.632 ekipe në një meta-analizë dhe një kartë normash.",
    "Teams mit vielen Kulturen: Meyers acht Skalen, Albanien und Deutschland in der GLOBE-Studie, eine Metaanalyse von 10.632 Teams und eine Karte."),
  feature: x(
    "Issue 55 starts with Erin Meyer's eight scales and her point that a culture's place on a scale means something only next to another, sets Albania beside Germany in the GLOBE study, separates what its managers say is done from what they say should be done, weighs a meta-analysis of 108 studies and 10,632 teams, looks at a scale that measures a person rather than a country, and ends with a card for agreeing how a mixed team works.",
    "Numri 55 nis me tetë shkallët e Erin Meyer-it dhe me idenë e saj se vendi i një kulture në një shkallë ka kuptim vetëm pranë një tjetre, vendos Shqipërinë pranë Gjermanisë në studimin GLOBE, ndan atë që menaxherët e tij thonë se bëhet nga ajo që thonë se duhet të bëhet, peshon një meta-analizë të 108 studimeve dhe 10.632 ekipeve, shikon një shkallë që mat një njeri dhe jo një vend, dhe mbyllet me një kartë për t'u marrë vesh si punon një ekip i përzier.",
    "Ausgabe 55 beginnt mit Erin Meyers acht Skalen und ihrem Gedanken, dass die Stelle einer Kultur auf einer Skala nur neben einer anderen etwas bedeutet, stellt Albanien neben Deutschland in der GLOBE-Studie, trennt, was die Führungskräfte dort für gelebte Praxis halten, von dem, was sein sollte, wägt eine Metaanalyse von 108 Studien und 10.632 Teams, betrachtet eine Skala, die einen Menschen misst und kein Land, und endet mit einer Karte, mit der ein gemischtes Team seine Arbeitsweise vereinbart."),
  figure: { n: x("10,632", "10.632", "10.632"), by: "Stahl et al., 2010", t: x(
    "teams in 108 studies: cultural diversity brought more creativity and satisfaction, but also more task conflict and less cohesion.",
    "ekipe në 108 studime: shumëllojshmëria kulturore solli më shumë kreativitet dhe kënaqësi, por edhe më shumë konflikt për detyrën dhe më pak kohezion.",
    "Teams in 108 Studien: Kulturelle Vielfalt brachte mehr Kreativität und Zufriedenheit, aber auch mehr Sachkonflikte und weniger Zusammenhalt.") },
  teasers: [
    { page: "story", kicker: x("Cover story", "Tema kryesore", "Titelthema"),
      title: x("It depends where you stand", "Varet nga ku qëndron", "Eine Frage des Standorts") },
    { page: "research", kicker: x("What the research says", "Çfarë thotë kërkimi", "Was die Forschung sagt"),
      title: x("Asset and liability", "Pasuri dhe barrë", "Gewinn und Last") },
    { page: "tool", kicker: x("Tool of the issue", "Mjeti i numrit", "Werkzeug der Ausgabe"),
      title: x("The team norms card", "Karta e normave të ekipit", "Die Karte der Teamregeln") },
  ],
  sources: ["mc-meyer-2014", "mc-globe-2004", "mc-hofstede-2015", "mc-stahl-2010", "mc-ang-2007", "mc-brett-2006"],
  pages: [
    { id: "cover", type: "cover" },
    {
      id: "intro", type: "intro",
      why: x(
        "More and more teams are made of people who grew up in different countries. The differences that hurt are rarely the visible ones; they are in how people give feedback, disagree, decide and keep time. This issue maps them, without turning a country's score into a judgement about a person.",
        "Gjithnjë e më shumë ekipe përbëhen nga njerëz që u rritën në vende të ndryshme. Dallimet që lëndojnë rrallë janë ato që duken; janë te mënyra si njerëzit japin feedback, kundërshtojnë, vendosin dhe e mbajnë kohën. Ky numër i vendos në hartë, pa e kthyer pikëzimin e një vendi në gjykim për një njeri.",
        "Immer mehr Teams bestehen aus Menschen, die in verschiedenen Ländern aufgewachsen sind. Die Unterschiede, die wehtun, sind selten die sichtbaren; sie liegen darin, wie Menschen Feedback geben, widersprechen, entscheiden und mit Zeit umgehen. Diese Ausgabe kartiert sie, ohne den Wert eines Landes zum Urteil über einen Menschen zu machen."),
      body: x(
        "Erin Meyer places countries on eight scales and warns that a position means something only next to another. GLOBE asked managers in 62 societies how things are and how they should be; Albania's managers describe more loyalty to the group than West Germany's, and less planning for the future. Hofstede's own data hold only two scores for Albania. A meta-analysis of 10,632 teams finds that diversity is both an asset and a liability. A scale for cultural intelligence measures a person, and a card helps a team agree its norms.",
        "Erin Meyer i vendos vendet në tetë shkallë dhe paralajmëron se një pozicion ka kuptim vetëm pranë një tjetri. GLOBE i pyeti menaxherët në 62 shoqëri si janë gjërat dhe si duhet të jenë; menaxherët shqiptarë përshkruajnë më shumë besnikëri ndaj grupit se ata të Gjermanisë Perëndimore, dhe më pak planifikim për të ardhmen. Të dhënat e vetë Hofstede-s kanë vetëm dy pikë për Shqipërinë. Një meta-analizë e 10.632 ekipeve gjen se shumëllojshmëria është edhe pasuri, edhe barrë. Një shkallë për inteligjencën kulturore mat një njeri, dhe një kartë e ndihmon ekipin të bjerë dakord për normat.",
        "Erin Meyer ordnet Länder auf acht Skalen ein und warnt, dass eine Position nur neben einer anderen etwas bedeutet. GLOBE fragte Führungskräfte in 62 Gesellschaften, wie es ist und wie es sein sollte; die albanischen beschreiben mehr Loyalität zur Gruppe als die westdeutschen und weniger Planung für die Zukunft. Hofstedes eigene Daten enthalten für Albanien nur zwei Werte. Eine Metaanalyse von 10.632 Teams zeigt Vielfalt als Gewinn und als Last. Eine Skala für kulturelle Intelligenz misst einen Menschen, und eine Karte hilft einem Team, seine Regeln zu vereinbaren."),
    },
    {
      id: "story",
      kicker: x("Cover story", "Tema kryesore", "Titelthema"),
      title: [x("It depends", "Varet nga", "Eine Frage"), x("where you stand", "ku qëndron", "des Standorts")],
      lead: x(
        "Erin Meyer of INSEAD built the Culture Map from eight scales, the management behaviours where she finds cultural gaps most often. She presented it in Harvard Business Review in 2014 and in a book the same year.",
        "Erin Meyer nga INSEAD e ndërtoi Hartën e Kulturës (Culture Map) me tetë shkallë, sjelljet e menaxhimit ku ajo i gjen më shpesh hendeqet kulturore. E paraqiti te Harvard Business Review në 2014 dhe në një libër po atë vit.",
        "Erin Meyer von INSEAD baute die Culture Map aus acht Skalen, den Führungsverhaltensweisen, bei denen sie kulturelle Lücken am häufigsten findet. Sie stellte sie 2014 in der Harvard Business Review vor und im selben Jahr in einem Buch."),
      blocks: [
        { type: "cards", cols: 2, items: [
          { h: x("Communicating", "Komunikimi", "Kommunizieren"), p: x("explicit and literal, or layered and implied", "i qartë e fjalë për fjalë, ose me shtresa e i nënkuptuar", "explizit und wörtlich oder vielschichtig und angedeutet") },
          { h: x("Evaluating", "Vlerësimi", "Bewerten"), p: x("frank or diplomatic negative feedback", "kritikë e drejtpërdrejtë ose diplomatike", "offene oder diplomatische Kritik") },
          { h: x("Persuading", "Bindja", "Überzeugen"), p: x("principles first, or applications first", "parimet në fillim, ose zbatimet në fillim", "erst Prinzipien oder erst Anwendungen") },
          { h: x("Leading", "Drejtimi", "Führen"), p: x("egalitarian or hierarchical", "barazitar ose hierarkik", "egalitär oder hierarchisch") },
          { h: x("Deciding", "Vendimi", "Entscheiden"), p: x("by consensus or from the top", "me konsensus ose nga lart", "im Konsens oder von oben") },
          { h: x("Trusting", "Besimi", "Vertrauen"), p: x("built through the task or through the relationship", "ndërtohet përmes punës ose përmes marrëdhënies", "entsteht über die Aufgabe oder über die Beziehung") },
          { h: x("Disagreeing", "Kundërshtimi", "Widersprechen"), p: x("open confrontation seen as useful, or as harmful", "përplasja e hapur shihet e dobishme, ose e dëmshme", "offene Konfrontation gilt als nützlich oder als schädlich") },
          { h: x("Scheduling", "Koha", "Zeitplanung"), p: x("a linear plan, or a flexible one", "plan linear, ose plan fleksibël", "linearer oder flexibler Zeitplan") },
        ] },
        { type: "p", text: x(
          "A Mexican marketing director at Heineken in Amsterdam found his Dutch team ignored his authority. A Chinese manager in Monterrey found the Mexicans strikingly egalitarian. Mexico sits between the Netherlands and China on the Leading scale, so both were right.",
          "Një drejtor marketingu meksikan te Heineken në Amsterdam zbuloi se ekipi holandez nuk ia përfillte autoritetin. Një menaxher kinez në Monterrey i gjeti meksikanët jashtëzakonisht barazitarë. Në shkallën e drejtimit Meksika qëndron mes Holandës dhe Kinës, prandaj kishin të drejtë të dy.",
          "Ein mexikanischer Marketingdirektor bei Heineken in Amsterdam erlebte, dass sein niederländisches Team seine Autorität überging. Ein chinesischer Manager in Monterrey fand die Mexikaner auffallend egalitär. Auf der Skala Führen liegt Mexiko zwischen den Niederlanden und China, also hatten beide recht.") },
        { type: "quote", text: x(
          "What matters is the position of one country relative to another.",
          "Ajo që ka rëndësi është pozicioni i një vendi në raport me një tjetër.",
          "Entscheidend ist, wo ein Land im Vergleich zu einem anderen steht.") },
      ],
      note: x(
        "The two managers are Meyer's examples; she does not give their real names. The profiles describe a society at large, she writes, not every person in it. The descriptions of the scales are condensed by the editors.",
        "Dy menaxherët janë shembuj të Meyer-it; ajo nuk jep emrat e tyre të vërtetë. Profilet përshkruajnë një shoqëri në tërësi, shkruan ajo, jo çdo njeri në të. Përshkrimet e shkallëve janë përmbledhur nga redaksia.",
        "Die beiden Manager sind Meyers Beispiele; ihre echten Namen nennt sie nicht. Die Profile beschreiben eine Gesellschaft als Ganzes, schreibt sie, nicht jeden Menschen darin. Die Beschreibungen der Skalen hat die Redaktion verdichtet."),
      source: ["mc-meyer-2014"],
    },
    {
      id: "numbers", more: "from-albania-to-germany",
      kicker: x("The numbers", "Shifrat", "Die Zahlen"),
      title: [x("Albania and Germany,", "Shqipëria dhe Gjermania,", "Albanien und Deutschland,"), x("side by side", "krah për krah", "nebeneinander")],
      lead: x(
        "In the GLOBE study (next page), middle managers rated how things are in their society, from 1 to 7. Albania and the West German sample on four of its nine dimensions, from the 2004 data:",
        "Në studimin GLOBE (faqja tjetër), menaxherët e mesëm vlerësuan si janë gjërat në shoqërinë e tyre, nga 1 deri në 7. Shqipëria dhe mostra e Gjermanisë Perëndimore në katër nga nëntë dimensionet e tij, sipas të dhënave të 2004:",
        "In der GLOBE-Studie (nächste Seite) bewerteten Führungskräfte der mittleren Ebene, wie es in ihrer Gesellschaft ist, von 1 bis 7. Albanien und die westdeutsche Stichprobe in vier ihrer neun Dimensionen, nach den Daten von 2004:"),
      blocks: [
        { type: "dumbbell", from: x("Albania", "Shqipëria", "Albanien"), to: x("Germany", "Gjermania", "Deutschland"), min: 1, max: 7, rowH: 24, source: ["mc-globe-2004"],
          label: x("GLOBE practices, 1 to 7", "Praktikat sipas GLOBE, 1 deri 7", "GLOBE-Praxiswerte, 1 bis 7"),
          rows: [
            { k: x("In-group loyalty", "Besnikëria ndaj grupit", "Gruppenloyalität"), a: 5.7, an: x("5.7", "5,7", "5,7"), b: 4.0, bn: x("4.0", "4,0", "4,0"), alert: true },
            { k: x("Humane orientation", "Orientimi njerëzor", "Humanorientierung"), a: 4.6, an: x("4.6", "4,6", "4,6"), b: 3.2, bn: x("3.2", "3,2", "3,2") },
            { k: x("Performance", "Performanca", "Leistung"), a: 4.8, an: x("4.8", "4,8", "4,8"), b: 4.2, bn: x("4.2", "4,2", "4,2") },
            { k: x("Future orientation", "E ardhmja", "Zukunftsorientierung"), a: 3.9, an: x("3.9", "3,9", "3,9"), b: 4.3, bn: x("4.3", "4,3", "4,3") },
          ] },
        { type: "p", text: x(
          "Hofstede's own data (2015) hold only two of his six scores for Albania, on a scale to 100: long-term orientation 61, against Germany's 83, and indulgence 15, against 40. His site advises taking dimension scores “with a grain of salt”.",
          "Të dhënat e vetë Hofstede-s (2015) kanë vetëm dy nga gjashtë pikët e tij për Shqipërinë, në një shkallë deri në 100: orientimi afatgjatë 61, kundrejt 83 të Gjermanisë, dhe indulgjenca 15, kundrejt 40. Faqja e tij këshillon që pikët e dimensioneve të merren “me rezervë”.",
          "Hofstedes eigene Daten (2015) enthalten für Albanien nur zwei seiner sechs Werte, auf einer Skala bis 100: Langzeitorientierung 61, gegenüber 83 für Deutschland, und Nachgiebigkeit 15, gegenüber 40. Seine Website rät, die Werte „mit Vorsicht zu genießen“.") },
        { type: "callout", reading: true, text: x(
          "The chart describes two countries, not your two colleagues.",
          "Grafiku përshkruan dy vende, jo dy kolegët e tu.",
          "Die Grafik beschreibt zwei Länder, nicht Ihre zwei Kollegen.") },
      ],
      note: x(
        "Averages of managers' answers, not descriptions of individuals; rounded. “In-group loyalty” is GLOBE's in-group collectivism. Other Hofstede scores for Albania found online cite no published study, so we leave them out.",
        "Mesatare të përgjigjeve të menaxherëve, jo përshkrime individësh; të rrumbullakuara. “Besnikëria ndaj grupit” është kolektivizmi i grupit te GLOBE. Pikë të tjera të Hofstede-s për Shqipërinë që gjenden në internet nuk citojnë studim të botuar, ndaj i lëmë jashtë.",
        "Mittelwerte der Antworten von Führungskräften, keine Beschreibung von Einzelnen; gerundet. „Gruppenloyalität“ ist GLOBEs gruppenbezogener Kollektivismus. Weitere Hofstede-Werte für Albanien im Netz nennen keine veröffentlichte Studie, deshalb lassen wir sie weg."),
      source: ["mc-globe-2004", "mc-hofstede-2015"],
    },
    {
      id: "model",
      kicker: x("The model", "Modeli", "Das Modell"),
      title: [x("What is done,", "Çfarë bëhet,", "Was getan wird,"), x("what should be", "çfarë duhet", "was sein sollte")],
      lead: x(
        "The GLOBE study, founded by Robert House, asked more than 17,000 middle managers in 62 societies about nine dimensions of culture, twice: how things are in their society, and how they should be. Albania was one of the 62.",
        "Studimi GLOBE, i themeluar nga Robert House, pyeti mbi 17.000 menaxherë të mesëm në 62 shoqëri për nëntë dimensione të kulturës, dy herë: si janë gjërat në shoqërinë e tyre, dhe si duhet të jenë. Shqipëria ishte një nga të 62-at.",
        "Die GLOBE-Studie, von Robert House begründet, befragte mehr als 17.000 Führungskräfte der mittleren Ebene in 62 Gesellschaften zu neun Dimensionen von Kultur, und zwar doppelt: wie es in ihrer Gesellschaft ist und wie es sein sollte. Albanien war eine der 62."),
      blocks: [
        { type: "dumbbell", from: x("As is", "Si është", "Ist"), to: x("Should be", "Si duhet", "Soll"), min: 1, max: 7, rowH: 24, source: ["mc-globe-2004"],
          label: x("GLOBE scores from 1 to 7, practices and values", "Pikët e GLOBE nga 1 deri në 7, praktikat dhe vlerat", "GLOBE-Werte von 1 bis 7, Praxis und Werte"),
          rows: [
            { k: x("Power · Albania", "Pushteti · Shqipëria", "Macht · Albanien"), a: 4.6, an: x("4.6", "4,6", "4,6"), b: 3.5, bn: x("3.5", "3,5", "3,5") },
            { k: x("Power · Germany", "Pushteti · Gjermania", "Macht · Deutschland"), a: 5.3, an: x("5.3", "5,3", "5,3"), b: 2.5, bn: x("2.5", "2,5", "2,5") },
            { k: x("Rules · Albania", "Rregullat · Shqipëria", "Regeln · Albanien"), a: 4.6, an: x("4.6", "4,6", "4,6"), b: 5.4, bn: x("5.4", "5,4", "5,4"), alert: true },
            { k: x("Rules · Germany", "Rregullat · Gjermania", "Regeln · Deutschland"), a: 5.2, an: x("5.2", "5,2", "5,2"), b: 3.3, bn: x("3.3", "3,3", "3,3") },
          ] },
        { type: "p", text: x(
          "GLOBE counts power distance among the dimensions nobody wants: managers in both countries want less of it. On rules, its uncertainty avoidance, they part: the Albanian managers want more, the German managers fewer.",
          "GLOBE e rendit distancën e pushtetit te dimensionet që askush nuk i dëshiron: menaxherët e të dy vendeve duan më pak të saj. Te rregullat, shmangia e pasigurisë, ndahen: menaxherët shqiptarë duan më shumë, ata gjermanë më pak.",
          "GLOBE zählt Machtdistanz zu den Dimensionen, die niemand will: Die Führungskräfte beider Länder wollen weniger davon. Bei Regeln, der Unsicherheitsvermeidung, trennen sie sich: Die albanischen wollen mehr, die deutschen weniger.") },
        { type: "callout", reading: true, text: x(
          "What managers say is done and what they say should be done are two different maps. In a mixed team, ask about both.",
          "Ajo që menaxherët thonë se bëhet dhe ajo që thonë se duhet të bëhet janë dy harta të ndryshme. Në një ekip të përzier, pyet për të dyja.",
          "Was Führungskräfte für gelebte Praxis halten und was sein sollte, sind zwei verschiedene Karten. Fragen Sie in einem gemischten Team nach beiden.") },
      ],
      note: x(
        "Scores rounded from GLOBE's society-level data (2004); Germany is the West German sample. Averages of managers' answers, not of every person.",
        "Pikët janë rrumbullakuar nga të dhënat e GLOBE për shoqëritë (2004); Gjermania është mostra e Gjermanisë Perëndimore. Mesatare të përgjigjeve të menaxherëve, jo të çdo njeriu.",
        "Werte gerundet aus den GLOBE-Daten auf Gesellschaftsebene (2004); Deutschland ist die westdeutsche Stichprobe. Mittelwerte der Antworten von Führungskräften, nicht jedes Einzelnen."),
      source: ["mc-globe-2004"],
    },
    {
      id: "research",
      kicker: x("What the research says", "Çfarë thotë kërkimi", "Was die Forschung sagt"),
      title: [x("Asset", "Pasuri", "Gewinn"), x("and liability", "dhe barrë", "und Last")],
      lead: x(
        "Günter Stahl, Martha Maznevski, Andreas Voigt and Karsten Jonsen pooled 108 studies of 10,632 teams. Cultural diversity had no direct link with team performance; it pulled the way teams work in two directions.",
        "Günter Stahl, Martha Maznevski, Andreas Voigt dhe Karsten Jonsen bashkuan 108 studime për 10.632 ekipe. Shumëllojshmëria kulturore nuk kishte lidhje të drejtpërdrejtë me performancën e ekipit; e tërhoqi mënyrën si punojnë ekipet në dy drejtime.",
        "Günter Stahl, Martha Maznevski, Andreas Voigt und Karsten Jonsen werteten 108 Studien mit 10.632 Teams aus. Kulturelle Vielfalt hing nicht direkt mit der Teamleistung zusammen; sie zog die Arbeitsweise der Teams in zwei Richtungen."),
      blocks: [
        { type: "hbars", max: 0.2, source: ["mc-stahl-2010"],
          label: x("Average correlation with cultural diversity", "Korrelacioni mesatar me shumëllojshmërinë kulturore", "Mittlere Korrelation mit kultureller Vielfalt"),
          items: [
            { k: x("Creativity", "Kreativiteti", "Kreativität"), v: 0.16, n: x("+0.16", "+0,16", "+0,16") },
            { k: x("Satisfaction", "Kënaqësia", "Zufriedenheit"), v: 0.15, n: x("+0.15", "+0,15", "+0,15") },
            { k: x("Task conflict", "Konflikti për detyrën", "Sachkonflikt"), v: 0.10, n: x("+0.10", "+0,10", "+0,10"), alert: true },
            { k: x("Social integration", "Integrimi social", "Soziale Integration"), v: 0.07, n: x("−0.07", "−0,07", "−0,07"), alert: true },
          ] },
        { type: "p", text: x(
          "Context changed the picture. Diverse teams had more conflict when the task was complex, when they sat together rather than apart, and, against the authors' hypothesis, when they had been together longer. Communication suffered in larger teams.",
          "Konteksti e ndryshonte pamjen. Ekipet e larmishme kishin më shumë konflikt kur detyra ishte e ndërlikuar, kur punonin në një vend dhe jo të shpërndarë, dhe, ndryshe nga hipoteza e autorëve, kur kishin më shumë kohë bashkë. Komunikimi vuante në ekipet më të mëdha.",
          "Der Kontext veränderte das Bild. Vielfältige Teams hatten mehr Konflikte, wenn die Aufgabe komplex war, wenn sie am selben Ort statt verteilt arbeiteten und, entgegen der Hypothese der Autoren, wenn sie schon länger zusammen waren. In größeren Teams litt die Kommunikation.") },
        { type: "callout", reading: true, text: x(
          "Time alone does not close the gaps. Someone has to name them and agree how the team will work.",
          "Koha vetë nuk i mbyll hendeqet. Dikush duhet t'i emërtojë dhe të bjerë dakord si do të punojë ekipi.",
          "Zeit allein schließt die Lücken nicht. Jemand muss sie benennen und vereinbaren, wie das Team arbeitet.") },
      ],
      note: x(
        "Weighted mean correlations, small by the usual standard; creativity rests on only 5 effect sizes, social integration on 22. The authors' own summary: diversity “can be both an asset and a liability”.",
        "Korrelacione mesatare të peshuara, të vogla sipas standardit të zakonshëm; kreativiteti mbështetet vetëm te 5 madhësi efekti, integrimi social te 22. Përmbledhja e vetë autorëve: shumëllojshmëria “mund të jetë edhe pasuri, edhe barrë”.",
        "Gewichtete mittlere Korrelationen, nach üblichem Maßstab klein; die Kreativität beruht auf nur 5 Effektgrößen, die soziale Integration auf 22. Das Fazit der Autoren: Vielfalt „kann Gewinn und Last zugleich sein“."),
      source: ["mc-stahl-2010"],
    },
    {
      id: "measure", more: "teams-with-many-languages",
      kicker: x("How it is measured", "Si matet", "Wie man es misst"),
      title: [x("Measure the person,", "Mat njeriun,", "Den Menschen messen,"), x("not the passport", "jo pasaportën", "nicht den Pass")],
      lead: x(
        "Soon Ang, Linn Van Dyne and colleagues built a 20-item scale for cultural intelligence (CQ), the capability to work effectively in culturally diverse settings. Each statement is rated from 1 to 7. They tested it on 1,360 people, then in three studies with 794 people in the USA and Singapore.",
        "Soon Ang, Linn Van Dyne dhe kolegët ndërtuan një shkallë me 20 pohime për inteligjencën kulturore (CQ), aftësinë për të punuar mirë në mjedise me shumë kultura. Çdo pohim vlerësohet nga 1 deri në 7. E provuan te 1.360 njerëz, pastaj në tri studime me 794 njerëz në SHBA dhe Singapor.",
        "Soon Ang, Linn Van Dyne und Kollegen entwickelten eine Skala mit 20 Aussagen für kulturelle Intelligenz (CQ), die Fähigkeit, in kulturell gemischten Umgebungen wirksam zu arbeiten. Jede Aussage wird von 1 bis 7 bewertet. Sie prüften sie an 1.360 Personen, dann in drei Studien mit 794 Personen in den USA und Singapur."),
      blocks: [
        { type: "cards", cols: 2, items: [
          { h: x("Metacognitive", "Metakognitive", "Metakognitiv"), p: x("checking what you think you know about a culture while you deal with it", "të kontrollosh atë që mendon se di për një kulturë ndërsa ke të bësh me të", "prüfen, was man über eine Kultur zu wissen glaubt, während man mit ihr zu tun hat") },
          { h: x("Cognitive", "Njohëse", "Kognitiv"), p: x("knowing values, languages and the rules of gesture elsewhere", "të njohësh vlerat, gjuhët dhe rregullat e gjesteve gjetkë", "Werte, Sprachen und die Regeln der Gesten anderswo kennen") },
          { h: x("Motivational", "Motivuese", "Motivational"), p: x("enjoying contact and trusting yourself to adjust", "të të pëlqejë kontakti dhe të besosh se përshtatesh", "Freude am Kontakt und Zutrauen, sich anzupassen") },
          { h: x("Behavioural", "E sjelljes", "Verhalten"), p: x("changing pace, pauses and gestures when the situation needs it", "të ndryshosh ritmin, pauzat dhe gjestet kur e kërkon situata", "Tempo, Pausen und Gesten ändern, wenn die Lage es verlangt") },
        ] },
        { type: "p", text: x(
          "The parts predicted different things: the first two cultural judgement and decisions, the last two adapting to a new culture, the first and last task performance.",
          "Pjesët parashikonin gjëra të ndryshme: dy të parat gjykimin kulturor dhe vendimet, dy të fundit përshtatjen me një kulturë të re, e para dhe e fundit performancën në detyrë.",
          "Die Teile sagten Verschiedenes voraus: die ersten beiden kulturelles Urteil und Entscheidungen, die letzten beiden die Anpassung an eine neue Kultur, der erste und der letzte die Leistung bei der Aufgabe.") },
        { type: "example", label: x("Hypothetical example, a check after meetings", "Shembull hipotetik, një kontroll pas takimeve", "Hypothetisches Beispiel, ein Check nach Besprechungen"), rows: [
          { k: x("Method", "Metoda", "Methode"), v: x("each member writes the decision and the next step in one line", "çdo anëtar shkruan vendimin dhe hapin tjetër në një rresht", "jedes Mitglied schreibt Entscheidung und nächsten Schritt in eine Zeile") },
          { k: x("Six meetings", "Gjashtë takime", "Sechs Besprechungen"), v: x("21 of 30 lines matched", "21 nga 30 rreshta përputheshin", "21 von 30 Zeilen stimmten überein") },
        ], text: x("The gap shows where a “yes” meant “I heard you”. The numbers are invented.", "Mungesa tregon ku një “po” do të thoshte “të dëgjova”. Numrat janë të shpikur.", "Die Lücke zeigt, wo ein „Ja“ nur „Ich habe Sie gehört“ hieß. Die Zahlen sind erfunden.") },
      ],
      note: x(
        "CQ is a self-assessment of one person, unlike the country scores on the earlier pages. The item summaries and the meeting check are the editors'.",
        "CQ është vetëvlerësim i një njeriu, ndryshe nga pikët e vendeve në faqet e mëparshme. Përmbledhjet e pohimeve dhe kontrolli pas takimeve janë të redaksisë.",
        "CQ ist eine Selbsteinschätzung eines Menschen, anders als die Länderwerte auf den vorigen Seiten. Die Zusammenfassungen der Aussagen und der Check nach Besprechungen stammen von der Redaktion."),
      source: ["mc-ang-2007"],
    },
    {
      id: "tool", tool: "/tools/shift-handover/",
      kicker: x("Tool of the issue", "Mjeti i numrit", "Werkzeug der Ausgabe"),
      title: [x("The team", "Karta e normave", "Die Karte der"), x("norms card", "të ekipit", "Teamregeln")],
      lead: x(
        "Jeanne Brett, Kristin Behfar and Mary Kern found that the most successful multicultural teams they studied adapted, changed the team's shape, had a manager set norms early, and only as a last resort let someone leave. One manager told the members they had been chosen for their expertise, not their English. Fill in the card together in the first week.",
        "Jeanne Brett, Kristin Behfar dhe Mary Kern gjetën se ekipet me shumë kultura më të suksesshme që studiuan përshtateshin, ndryshonin formën e ekipit, kishin një menaxher që vendoste norma herët, dhe vetëm si mjet të fundit linin dikë të largohej. Një menaxher i tha ekipit se ishin zgjedhur për ekspertizën, jo për anglishten. Plotësojeni kartën bashkë në javën e parë.",
        "Jeanne Brett, Kristin Behfar und Mary Kern fanden, dass die erfolgreichsten multikulturellen Teams, die sie untersuchten, sich anpassten, den Zuschnitt des Teams änderten, früh Regeln durch eine Führungskraft setzen ließen und nur als letztes Mittel jemanden gehen ließen. Eine Führungskraft sagte den Mitgliedern, sie seien wegen ihrer Fachkenntnis ausgewählt worden, nicht wegen ihres Englischs. Füllen Sie die Karte in der ersten Woche gemeinsam aus."),
      blocks: [
        { type: "form", items: [
          { h: x("Working language", "Gjuha e punës", "Arbeitssprache"), hint: x("which one, and what is always put in writing", "cila, dhe çfarë shkruhet gjithmonë", "welche, und was immer schriftlich festgehalten wird") },
          { h: x("Saying something is wrong", "Kur diçka nuk shkon", "Wenn etwas nicht stimmt"), hint: x("in private or in the group, how direct", "veçmas apo para grupit, sa drejtpërdrejt", "unter vier Augen oder in der Gruppe, wie direkt") },
          { h: x("Disagreeing", "Kundërshtimi", "Widersprechen"), hint: x("how to disagree in a meeting; who asks the quiet ones", "si kundërshtojmë në takim; kush i pyet ata që heshtin", "wie man in der Besprechung widerspricht; wer die Stillen fragt") },
          { h: x("Deciding", "Vendimi", "Entscheiden"), hint: x("who decides what, and when a decision counts as made", "kush vendos çfarë, dhe kur një vendim quhet i marrë", "wer was entscheidet und wann eine Entscheidung gilt") },
          { h: x("Time", "Koha", "Zeit"), hint: x("what “on time” and “deadline” mean here", "çfarë do të thotë këtu “në kohë” dhe “afat”", "was „pünktlich“ und „Frist“ hier bedeuten") },
          { h: x("Checking understanding", "Kontrolli i të kuptuarit", "Verständnis prüfen"), hint: x("show me how you would do it, not “did you understand?”", "më trego si do ta bëje, jo “e kuptove?”", "zeigen lassen, wie man es machen würde, statt „Verstanden?“") },
        ] },
      ],
      note: x(
        "A practice proposed by the editors, after Brett, Behfar and Kern's managerial intervention and Meyer's eight scales. Review it when someone joins the team.",
        "Praktikë e propozuar nga redaksia, sipas ndërhyrjes menaxheriale te Brett, Behfar dhe Kern dhe tetë shkallëve të Meyer-it. Rishikojeni kur dikush i bashkohet ekipit.",
        "Eine Praxis, die die Redaktion vorschlägt, nach dem Eingreifen der Führung bei Brett, Behfar und Kern und Meyers acht Skalen. Überarbeiten Sie sie, wenn jemand neu ins Team kommt."),
      source: ["mc-brett-2006", "mc-meyer-2014"],
    },
    { id: "sources", type: "sources" },
    { id: "back", type: "back" },
  ],
};
