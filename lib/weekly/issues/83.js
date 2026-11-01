// Management Review, No. 83: Estimate first, then discuss. Block: Strategy.
// Facts and their sources: docs/revista/management-review-nr-83.md. Galton (1907) was read in full in the scan of
// Nature at galton.org; Lorenz et al. (2011) and Becker et al. (2017) in full at PubMed Central. The noise audit of
// Kahneman, Sibony & Sunstein is in No. 20 and is not repeated here.
import { x, pc } from "../common.js";

export default {
  number: 83,
  block: "strategy",
  date: x("November 2026", "Nëntor 2026", "November 2026"),
  theme: [x("Estimate first,", "Vlerëso më parë,", "Erst schätzen,"), x("then discuss", "pastaj diskuto", "dann diskutieren")],
  sub: x(
    "Galton's ox at Plymouth, why one wild guess can spoil an average, three ways seeing others' answers weakens a crowd, when exchange helps, and a card for independent estimates.",
    "Kau i Galton-it në Plymouth, pse një hamendësim i egër e prish mesataren, tri mënyra si e dobëson turmën shikimi i përgjigjeve të të tjerëve, kur ndihmon shkëmbimi, dhe një kartë për vlerësime të pavarura.",
    "Galtons Ochse in Plymouth, warum eine wilde Schätzung den Durchschnitt verdirbt, drei Wege, wie fremde Antworten eine Gruppe schwächen, wann Austausch hilft, und eine Karte für unabhängige Schätzungen."),
  seo: x(
    "Estimate first, then discuss: Galton's 787 guesses, how social influence undermines the wisdom of crowds, when networks help, and a card.",
    "Vlerëso më parë, pastaj diskuto: 787 hamendësimet e Galton-it, si e dobëson ndikimi shoqëror mençurinë e turmës, kur ndihmon rrjeti, dhe një kartë.",
    "Erst schätzen, dann diskutieren: Galtons 787 Schätzungen, wie sozialer Einfluss die Weisheit der Vielen untergräbt, wann Netzwerke helfen, eine Karte."),
  feature: x(
    "In 1907 Francis Galton sorted 787 cards from a cattle show and found that the middle estimate of an ox's weight was 0.8% too high. Issue 83 asks what made that crowd wise: each card was written alone. It follows an experiment in Zurich in which seeing the others' answers narrowed the group without making it more accurate, and one in which exchange helped, as long as no single voice reached everyone. A card for independent estimates ends the issue.",
    "Më 1907, Francis Galton renditi 787 karta nga një panair bagëtish dhe gjeti se vlerësimi i mesit për peshën e një kau ishte 0,8% më i lartë. Numri 83 pyet çfarë e bëri të mençur atë turmë: çdo kartë u shkrua më vete. Ndjek një eksperiment në Cyrih, ku shikimi i përgjigjeve të të tjerëve e ngushtoi grupin pa e bërë më të saktë, dhe një tjetër, ku shkëmbimi ndihmoi, për sa kohë asnjë zë nuk arrinte te të gjithë. Një kartë për vlerësime të pavarura e mbyll numrin.",
    "1907 sortierte Francis Galton 787 Karten von einer Viehschau und fand, dass die mittlere Schätzung des Gewichts eines Ochsen 0,8 % zu hoch lag. Ausgabe 83 fragt, was diese Menge klug machte: Jede Karte wurde allein geschrieben. Sie folgt einem Experiment in Zürich, in dem der Blick auf fremde Antworten die Gruppe einengte, ohne sie genauer zu machen, und einem, in dem Austausch half, solange keine einzelne Stimme alle erreichte. Eine Karte für unabhängige Schätzungen beendet die Ausgabe."),
  figure: { n: x("0.8%", "0,8%", "0,8 %"), by: "Galton, 1907", t: x(
    "was how far the middle estimate of 787 visitors to a cattle show lay from the ox's dressed weight: 1,207 lb against 1,198 lb.",
    "ishte largësia e vlerësimit të mesit të 787 vizitorëve të një panairi bagëtish nga pesha e kaut të therur: 1207 paund kundrejt 1198.",
    "betrug der Abstand der mittleren Schätzung von 787 Besuchern einer Viehschau zum Schlachtgewicht des Ochsen: 1207 gegen 1198 Pfund.") },
  teasers: [
    { page: "story", kicker: x("Cover story", "Tema kryesore", "Titelthema"),
      title: x("787 cards and one ox", "787 karta dhe një ka", "787 Karten und ein Ochse") },
    { page: "model", kicker: x("The model", "Modeli", "Das Modell"),
      title: x("Three ways a crowd loses its edge", "Tri mënyra si humbet turma", "Drei Wege, wie eine Menge verliert") },
    { page: "tool", kicker: x("Tool of the issue", "Mjeti i numrit", "Werkzeug der Ausgabe"),
      title: x("The independent estimate card", "Karta e vlerësimit të pavarur", "Die Karte für unabhängige Schätzungen") },
  ],
  sources: ["crowd-galton-1907", "crowd-lorenz-2011", "crowd-becker-2017"],
  pages: [
    { id: "cover", type: "cover" },
    {
      id: "intro", type: "intro",
      why: x(
        "Many planning meetings start with someone saying a number. After that, the others tend to talk around it. The research on the wisdom of crowds asks a simple question: what is a group's estimate worth if its members have already heard each other?",
        "Shumë takime planifikimi nisin me dikë që thotë një numër. Pas kësaj, të tjerët priren të flasin rreth tij. Kërkimi për mençurinë e turmës bën një pyetje të thjeshtë: sa vlen vlerësimi i një grupi, nëse anëtarët e tij e kanë dëgjuar tashmë njëri-tjetrin?",
        "Viele Planungsrunden beginnen damit, dass jemand eine Zahl nennt. Danach reden die anderen meist um sie herum. Die Forschung zur Weisheit der Vielen stellt eine einfache Frage: Was ist die Schätzung einer Gruppe wert, wenn ihre Mitglieder einander schon gehört haben?"),
      body: x(
        "At a cattle show in Plymouth, 787 visitors each wrote a guess on a card; the middle one missed the ox's weight by 0.8%. In Zurich, 144 students were paid for accurate answers. Seeing the others' estimates narrowed their range, did not make the group significantly more accurate, and made them surer. In a web experiment with 1,360 people, exchange did help when every voice weighed the same, and hurt when one well-connected person was far from the truth. A card turns this into a routine for estimates.",
        "Në një panair bagëtish në Plymouth, 787 vizitorë shkruan secili një hamendësim në një kartë; ai i mesit e humbi peshën e kaut me 0,8%. Në Cyrih, 144 studentë u paguan për përgjigje të sakta. Shikimi i vlerësimeve të të tjerëve ua ngushtoi shtrirjen, nuk e bëri grupin dukshëm më të saktë, dhe i bëri më të sigurt. Në një eksperiment në internet me 1360 njerëz, shkëmbimi ndihmoi kur çdo zë peshonte njësoj, dhe dëmtoi kur një person me shumë lidhje ishte larg së vërtetës. Një kartë e kthen këtë në rutinë për vlerësimet.",
        "Auf einer Viehschau in Plymouth schrieben 787 Besucher je eine Schätzung auf eine Karte; die mittlere verfehlte das Gewicht des Ochsen um 0,8 %. In Zürich wurden 144 Studierende für genaue Antworten bezahlt. Der Blick auf die Schätzungen der anderen engte ihre Spannweite ein, machte die Gruppe nicht signifikant genauer und machte sie sicherer. In einem Online-Experiment mit 1360 Personen half der Austausch, wenn jede Stimme gleich viel wog, und schadete, wenn eine gut vernetzte Person weit von der Wahrheit lag. Eine Karte macht daraus eine Routine für Schätzungen."),
    },
    {
      id: "story",
      kicker: x("Cover story", "Tema kryesore", "Titelthema"),
      title: [x("787 cards", "787 karta", "787 Karten"), x("and one ox", "dhe një ka", "und ein Ochse")],
      lead: x(
        "In March 1907 Francis Galton described in Nature a weight-judging competition at the West of England Fat Stock and Poultry Exhibition in Plymouth. For sixpence, visitors wrote on a card what a fat ox would weigh once slaughtered and dressed.",
        "Në mars 1907, Francis Galton përshkroi te Nature një garë për të gjetur peshën në panairin e bagëtive dhe shpendëve të Anglisë Perëndimore, në Plymouth. Për gjashtë peni, vizitorët shkruanin në një kartë sa do të peshonte një ka i majmë pasi të therej dhe të pastrohej.",
        "Im März 1907 beschrieb Francis Galton in Nature einen Wettbewerb im Gewichtschätzen auf der Mastvieh- und Geflügelschau Westenglands in Plymouth. Für sechs Pence schrieben Besucher auf eine Karte, was ein Mastochse geschlachtet und ausgenommen wiegen würde."),
      blocks: [
        { type: "figures", compact: true, items: [
          { n: x("≈800", "≈800", "≈800"), t: x("cards were issued; Galton set 13 aside as defective or illegible", "karta u shpërndanë; Galton-i la mënjanë 13 si të dëmtuara ose të palexueshme", "Karten wurden ausgegeben; Galton legte 13 als fehlerhaft oder unleserlich beiseite") },
          { n: x("1,207 lb", "1207 paund", "1207 Pfund"), t: x("the middle estimate of the 787 that remained", "vlerësimi i mesit i 787 kartave që mbetën", "die mittlere der 787 verbliebenen Schätzungen") },
          { n: x("1,198 lb", "1198 paund", "1198 Pfund"), t: x("the dressed weight of the ox", "pesha e kaut të therur", "das Schlachtgewicht des Ochsen") },
        ] },
        { type: "p", text: x(
          "Galton took the middlemost estimate, as in a vote in which every other estimate is outvoted as too high or too low. It was 9 lb, or 0.8%, too high. Half of the cards lay between 29 lb below and 45 lb above it. He gave one reason the material was good:",
          "Galton-i mori vlerësimin e mesit, si në një votim ku çdo vlerësim tjetër del me shumicë ose shumë i lartë ose shumë i ulët. Ishte 9 paund, ose 0,8%, më i lartë. Gjysma e kartave ishin nga 29 paund poshtë deri në 45 paund sipër tij. Ai dha një arsye pse materiali ishte i mirë:",
          "Galton nahm die mittlere Schätzung, wie bei einer Abstimmung, in der jede andere Schätzung als zu hoch oder zu niedrig überstimmt wird. Sie lag 9 Pfund oder 0,8 % zu hoch. Die Hälfte der Karten lag zwischen 29 Pfund darunter und 45 Pfund darüber. Er nannte einen Grund, warum das Material gut war:") },
        { type: "quote", text: x(
          "The judgments were unbiassed by passion and uninfluenced by oratory and the like.",
          "Gjykimet nuk ishin të anshme nga pasioni dhe nuk ishin të ndikuara nga oratoria dhe të ngjashme.",
          "Die Urteile waren von Leidenschaft unverzerrt und von Redekunst und dergleichen unbeeinflusst.") },
        { type: "callout", reading: true, text: x(
          "The crowd was not wise because it talked. It was wise because each card was written before anyone could hear a speech.",
          "Turma nuk ishte e mençur sepse foli. Ishte e mençur sepse çdo kartë u shkrua para se dikush të dëgjonte një fjalim.",
          "Die Menge war nicht klug, weil sie redete. Sie war klug, weil jede Karte geschrieben war, bevor jemand eine Rede hören konnte.") },
      ],
      note: x(
        "Galton, Nature 75, 7 March 1907, pp. 450–451. He reports the middlemost estimate, the median; we use only his figures. The quote is his; the translations are ours.",
        "Galton, Nature 75, 7 mars 1907, f. 450–451. Ai jep vlerësimin e mesit, medianën; ne përdorim vetëm shifrat e tij. Citimi është i tij; përkthimet janë tonat.",
        "Galton, Nature 75, 7. März 1907, S. 450–451. Er nennt die mittlere Schätzung, den Median; wir verwenden nur seine Zahlen. Das Zitat ist seins, die Übersetzungen sind unsere."),
      source: ["crowd-galton-1907"],
    },
    {
      id: "numbers",
      kicker: x("The numbers", "Shifrat", "Die Zahlen"),
      title: [x("The average", "Mesatarja", "Der Durchschnitt,"), x("that misleads", "që mashtron", "der täuscht")],
      lead: x(
        "Jan Lorenz, Heiko Rauhut and colleagues at ETH Zurich put six factual questions to 144 students, in 12 sessions of 12. One asked for the length of the border between Switzerland and Italy. Payment rewarded only accuracy, not agreeing with others.",
        "Jan Lorenz, Heiko Rauhut dhe kolegët në ETH të Cyrihut u bënë 144 studentëve gjashtë pyetje faktike, në 12 seanca me nga 12 veta. Një pyetje kërkonte gjatësinë e kufirit mes Zvicrës dhe Italisë. Pagesa shpërblente vetëm saktësinë, jo pajtimin me të tjerët.",
        "Jan Lorenz, Heiko Rauhut und Kollegen an der ETH Zürich stellten 144 Studierenden in 12 Sitzungen zu je 12 Personen sechs Sachfragen. Eine fragte nach der Länge der Grenze zwischen der Schweiz und Italien. Bezahlt wurde nur Genauigkeit, nicht Übereinstimmung mit anderen."),
      blocks: [
        { type: "columns", max: 100, height: 112, source: ["crowd-lorenz-2011"],
          label: x("How often the group figure beat the individual estimates (2011)", "Sa shpesh shifra e grupit i mundi vlerësimet individuale (2011)", "Wie oft die Gruppenzahl die Einzelschätzungen schlug (2011)"),
          items: [
            { k: x("Plain average", "Mesatarja e thjeshtë", "Einfaches Mittel"), v: 21.3, n: x("21.3%", "21,3%", "21,3 %"), alert: true },
            { k: x("Geometric mean", "Mesatarja gjeometrike", "Geometrisches Mittel"), v: 77.1, n: x("77.1%", "77,1%", "77,1 %") },
          ] },
        { type: "p", text: x(
          "Answers to such questions are skewed to the right: a few very high guesses pull the plain average away from the truth. The geometric mean, an average taken on a logarithmic scale, resists them, as does the median Galton used.",
          "Përgjigjet e pyetjeve të tilla janë të anuara djathtas: pak hamendësime shumë të larta e tërheqin mesataren e thjeshtë larg së vërtetës. Mesatarja gjeometrike, një mesatare e marrë në shkallë logaritmike, u reziston, ashtu si mediana që përdori Galton-i.",
          "Antworten auf solche Fragen sind rechtsschief: Wenige sehr hohe Schätzungen ziehen das einfache Mittel von der Wahrheit weg. Das geometrische Mittel, ein Mittel auf logarithmischer Skala, hält ihnen stand, ebenso wie der Median, den Galton nahm.") },
        { type: "callout", reading: true, text: x(
          "Before averaging a team's estimates, look at the spread. One wild number can move the average more than ten sensible ones.",
          "Para se të nxirrni mesataren e vlerësimeve të ekipit, shikoni shtrirjen. Një numër i egër mund ta lëvizë mesataren më shumë se dhjetë të arsyeshëm.",
          "Bevor Sie die Schätzungen eines Teams mitteln, schauen Sie auf die Streuung. Eine wilde Zahl kann den Durchschnitt stärker bewegen als zehn vernünftige."),
        },
      ],
      note: x(
        "Share of cases in which the group figure was closer to the truth than individual estimates: the plain average against first estimates, the geometric mean on logarithms. 144 subjects, six questions. Read in the full text.",
        "Pjesa e rasteve kur shifra e grupit ishte më afër së vërtetës se vlerësimet individuale: mesatarja e thjeshtë kundrejt vlerësimeve të para, ajo gjeometrike me logaritme. 144 pjesëmarrës, gjashtë pyetje. Lexuar te teksti i plotë.",
        "Anteil der Fälle, in denen die Gruppenzahl näher an der Wahrheit lag als Einzelschätzungen: das einfache Mittel gegen erste Schätzungen, das geometrische auf Logarithmen. 144 Personen, sechs Fragen. Gelesen im Volltext."),
      source: ["crowd-lorenz-2011"],
    },
    {
      id: "model",
      kicker: x("The model", "Modeli", "Das Modell"),
      title: [x("Three ways", "Tri mënyra", "Drei Wege,"), x("a crowd loses its edge", "si humbet turma", "wie eine Menge verliert")],
      lead: x(
        "Each question ran for five rounds. In the control condition nobody saw anything. In the others, subjects saw the average of the previous round, or every estimate so far. The authors' finding:",
        "Çdo pyetje zgjati pesë raunde. Në kushtin e kontrollit askush nuk shihte gjë. Në të tjerët, pjesëmarrësit shihnin mesataren e raundit të mëparshëm, ose çdo vlerësim deri atëherë. Përfundimi i autorëve:",
        "Jede Frage lief über fünf Runden. In der Kontrollbedingung sah niemand etwas. In den anderen sahen die Teilnehmenden den Durchschnitt der Vorrunde oder alle bisherigen Schätzungen. Der Befund der Autoren:"),
      blocks: [
        { type: "quote", text: x(
          "Even mild social influence can undermine the wisdom of crowd effect.",
          "Edhe ndikimi i lehtë shoqëror mund ta minojë efektin e mençurisë së turmës.",
          "Schon milder sozialer Einfluss kann den Effekt der Weisheit der Vielen untergraben.") },
        { type: "rows", compact: true, items: [
          { h: x("Social influence effect", "Efekti i ndikimit shoqëror", "Effekt des sozialen Einflusses"), p: x("The estimates move closer together; the group's collective error does not fall significantly.", "Vlerësimet afrohen me njëri-tjetrin; gabimi kolektiv i grupit nuk bie dukshëm.", "Die Schätzungen rücken zusammen; der kollektive Fehler der Gruppe sinkt nicht signifikant.") },
          { h: x("Range reduction effect", "Efekti i ngushtimit të shtrirjes", "Effekt der verengten Spannweite"), p: x("The truth ends up at the edge of the range instead of the middle, so the group tells an outsider less.", "E vërteta përfundon në skaj të shtrirjes, jo në mes, ndaj grupi i tregon më pak dikujt nga jashtë.", "Die Wahrheit landet am Rand der Spannweite statt in der Mitte; die Gruppe sagt Außenstehenden weniger.") },
          { h: x("Confidence effect", "Efekti i sigurisë", "Effekt der Zuversicht"), p: x("People grow surer after converging, although they are not more accurate.", "Njerëzit bëhen më të sigurt pasi afrohen, edhe pse nuk janë më të saktë.", "Die Menschen werden nach der Annäherung sicherer, obwohl sie nicht genauer sind.") },
        ] },
        { type: "callout", reading: true, text: x(
          "Agreement is not evidence. A team that converged in the meeting may only have converged.",
          "Pajtimi nuk është provë. Një ekip që u afrua në takim mund të jetë vetëm afruar.",
          "Einigkeit ist kein Beleg. Ein Team, das sich im Meeting angenähert hat, hat sich vielleicht nur angenähert.") },
      ],
      note: x(
        "Lorenz et al. (2011), abstract and results, read in full; the quote is from the abstract. The three names are the authors'; the short descriptions are ours.",
        "Lorenz et al. (2011), abstrakti dhe rezultatet, lexuar të plota; citimi është nga abstrakti. Tre emrat janë të autorëve; përshkrimet e shkurtra janë tonat.",
        "Lorenz et al. (2011), Abstract und Ergebnisse, im Volltext gelesen; das Zitat stammt aus dem Abstract. Die drei Namen sind die der Autoren, die kurzen Beschreibungen unsere."),
      source: ["crowd-lorenz-2011"],
    },
    {
      id: "research",
      kicker: x("What the research says", "Çfarë thotë kërkimi", "Was die Forschung sagt"),
      title: [x("Not all influence", "Jo çdo ndikim", "Nicht jeder Einfluss"), x("is the same", "është i njëjtë", "ist gleich")],
      lead: x(
        "Joshua Becker, Devon Brackbill and Damon Centola at the University of Pennsylvania recruited 1,360 people online; 1,040 of them worked in networks of 40. They estimated quantities such as the calories on a plate of food, three times each, and saw the average of the people they were linked to.",
        "Joshua Becker, Devon Brackbill dhe Damon Centola në Universitetin e Pensilvanisë rekrutuan 1360 njerëz në internet; 1040 prej tyre punuan në rrjete me nga 40 veta. Ata vlerësuan sasi si kaloritë e një pjate me ushqim, tri herë secilën, dhe shihnin mesataren e njerëzve me të cilët ishin të lidhur.",
        "Joshua Becker, Devon Brackbill und Damon Centola von der University of Pennsylvania warben 1360 Personen online an; 1040 davon arbeiteten in Netzwerken zu je 40. Sie schätzten Größen wie die Kalorien eines Tellers Essen, jeweils dreimal, und sahen den Durchschnitt der Personen, mit denen sie verbunden waren."),
      blocks: [
        { type: "hbars", max: 25, source: ["crowd-becker-2017"],
          label: x("Change in error, first to third estimate (2017)", "Ndryshimi i gabimit, nga vlerësimi i parë te i treti (2017)", "Veränderung des Fehlers, erste bis dritte Schätzung (2017)"),
          items: [
            { k: x("Individuals, no network (control)", "Individët, pa rrjet (kontrolli)", "Einzelne, ohne Netzwerk (Kontrolle)"), v: 3, n: x("−3%", "−3%", "−3 %") },
            { k: x("Individuals, equal network", "Individët, rrjet i barabartë", "Einzelne, gleiches Netzwerk"), v: 23, n: x("−23%", "−23%", "−23 %") },
            { k: x("Group mean, equal network", "Mesatarja e grupit, rrjet i barabartë", "Gruppenmittel, gleiches Netzwerk"), v: 10, n: x("−10%", "−10%", "−10 %") },
            { k: x("Group mean, central person far from truth", "Mesatarja, personi qendror larg së vërtetës", "Gruppenmittel, zentrale Person fern der Wahrheit"), v: 19, n: x("+19%", "+19%", "+19 %"), alert: true },
          ] },
        { type: "p", text: x(
          "In the equal networks everyone had the same number of ties; in centralized ones one member had far more, and the group drifted towards that person's first answer, for better or worse. Those who started accurate revised less.",
          "Në rrjetet e barabarta çdokush kishte të njëjtin numër lidhjesh; në ato të centralizuara një anëtar kishte shumë më tepër, dhe grupi u zhvendos drejt përgjigjes së parë të tij, për mirë a për keq. Ata që nisën të saktë ndryshuan më pak.",
          "In den gleichen Netzwerken hatten alle gleich viele Verbindungen; in zentralisierten hatte ein Mitglied weit mehr, und die Gruppe bewegte sich zu dessen erster Antwort hin, im Guten wie im Schlechten. Wer anfangs genau lag, änderte weniger.") },
        { type: "callout", reading: true, text: x(
          "Exchange helped where every voice weighed the same. In many meetings one voice reaches everyone first: the boss's.",
          "Shkëmbimi ndihmoi aty ku çdo zë peshonte njësoj. Në shumë takime, një zë arrin i pari te të gjithë: ai i shefit.",
          "Austausch half dort, wo jede Stimme gleich viel wog. In vielen Meetings erreicht eine Stimme alle zuerst: die der Chefin oder des Chefs.") },
      ],
      note: x(
        "Web experiments on estimation tasks, not work teams; 13 trials per network type. −10% is our calculation from the group-mean error of 0.69 and 0.62 standard deviations. Read in the full text.",
        "Eksperimente në internet me detyra vlerësimi, jo ekipe pune; 13 prova për çdo lloj rrjeti. −10% është llogaritja jonë nga gabimi i mesatares 0,69 dhe 0,62 devijime standarde. Lexuar te teksti i plotë.",
        "Online-Experimente mit Schätzaufgaben, keine Arbeitsteams; 13 Durchgänge je Netzwerktyp. −10 % ist unsere Rechnung aus dem Fehler des Gruppenmittels von 0,69 und 0,62 Standardabweichungen. Gelesen im Volltext."),
      source: ["crowd-becker-2017"],
    },
    {
      id: "measure",
      kicker: x("How it is measured", "Si matet", "Wie es gemessen wird"),
      title: [x("Is the group", "A është grupi", "Ist die Gruppe"), x("still wise?", "ende i mençur?", "noch klug?")],
      lead: x(
        "The studies measured a crowd in a few ways. A team can keep the same records for its own estimates, and check them once the true figure is known.",
        "Studimet e matën turmën në disa mënyra. Një ekip mund të mbajë të njëjtat shënime për vlerësimet e veta, dhe t'i kontrollojë kur të dihet shifra e vërtetë.",
        "Die Studien maßen eine Menge auf wenige Arten. Ein Team kann dieselben Aufzeichnungen für die eigenen Schätzungen führen und sie prüfen, sobald die wahre Zahl bekannt ist."),
      blocks: [
        { type: "rows", compact: true, items: [
          { h: x("First notes kept", "Shënimet e para të ruajtura", "Erste Notizen aufbewahrt"), p: x("Every estimate written alone, before anyone speaks, and kept after the meeting.", "Çdo vlerësim i shkruar më vete, para se të flasë kush, dhe i ruajtur pas takimit.", "Jede Schätzung allein notiert, bevor jemand spricht, und nach dem Meeting aufbewahrt.") },
          { h: x("Median and spread", "Mediana dhe shtrirja", "Median und Streuung"), p: x("The middle value, and where the middle half of the notes lies, as Galton read his cards.", "Vlera e mesit, dhe ku bie gjysma e mesme e shënimeve, siç i lexoi kartat Galton-i.", "Der mittlere Wert und wo die mittlere Hälfte der Notizen liegt, wie Galton seine Karten las.") },
          { h: x("Where the truth fell", "Ku ra e vërteta", "Wo die Wahrheit lag"), p: x("In the middle of the notes, or at their edge: the wisdom of crowd indicator of Lorenz and colleagues.", "Në mes të shënimeve, apo në skaj të tyre: treguesi i mençurisë së turmës te Lorenz dhe kolegët.", "In der Mitte der Notizen oder an ihrem Rand: der Indikator der Weisheit der Vielen bei Lorenz und Kollegen.") },
          { h: x("Error before and after", "Gabimi para dhe pas", "Fehler vorher und nachher"), p: x("The median of the first notes and the agreed figure, each against the true value.", "Mediana e shënimeve të para dhe shifra e rënë dakord, secila përballë vlerës së vërtetë.", "Der Median der ersten Notizen und die vereinbarte Zahl, jeweils gegen den wahren Wert.") },
          { h: x("Confidence before and after", "Siguria para dhe pas", "Zuversicht vorher und nachher"), p: x("How sure each person was, asked twice. Rising confidence without a smaller error is a warning.", "Sa i sigurt ishte secili, e pyetur dy herë. Siguria që rritet pa një gabim më të vogël është paralajmërim.", "Wie sicher jede Person war, zweimal gefragt. Steigende Zuversicht ohne kleineren Fehler ist ein Warnsignal.") },
        ] },
        { type: "callout", reading: true, text: x(
          "If the agreed figure is no better than the median of the first notes, the meeting added confidence, not knowledge.",
          "Nëse shifra e rënë dakord nuk është më e mirë se mediana e shënimeve të para, takimi shtoi siguri, jo dije.",
          "Ist die vereinbarte Zahl nicht besser als der Median der ersten Notizen, hat das Meeting Zuversicht hinzugefügt, kein Wissen.") },
      ],
      note: x(
        "The measures follow Galton (1907) and Lorenz et al. (2011); applying them to a team's estimates is the editors' proposal. The noise audit is in No. 20, the pre-mortem in No. 44, independent scoring in interviews in No. 65.",
        "Masat ndjekin Galton-in (1907) dhe Lorenz et al. (2011); zbatimi i tyre te vlerësimet e një ekipi është propozim i redaksisë. Auditimi i zhurmës është te Nr. 20, pre-mortem te Nr. 44, vlerësimi i pavarur në intervista te Nr. 65.",
        "Die Maße folgen Galton (1907) und Lorenz et al. (2011); sie auf die Schätzungen eines Teams anzuwenden, ist ein Vorschlag der Redaktion. Das Noise-Audit steht in Nr. 20, das Pre-Mortem in Nr. 44, unabhängiges Bewerten im Interview in Nr. 65."),
      source: ["crowd-galton-1907", "crowd-lorenz-2011"],
    },
    {
      id: "tool", tool: "/tools/shift-capacity/",
      kicker: x("Tool of the issue", "Mjeti i numrit", "Werkzeug der Ausgabe"),
      title: [x("The independent", "Karta e vlerësimit", "Die Karte für"), x("estimate card", "të pavarur", "unabhängige Schätzungen")],
      lead: x(
        "One card per estimate: next week's volume, the length of a job, the cost of a change. Lines 1–3 are filled in alone; talk starts when every card is in. An agreed volume can then go into Shift Capacity.",
        "Një kartë për çdo vlerësim: vëllimi i javës që vjen, kohëzgjatja e një pune, kostoja e një ndryshimi. Rreshtat 1–3 plotësohen më vete; biseda nis kur të jenë mbledhur të gjitha kartat. Vëllimi i rënë dakord mund të hyjë pastaj te Shift Capacity.",
        "Eine Karte pro Schätzung: das Volumen der nächsten Woche, die Dauer eines Auftrags, die Kosten einer Änderung. Zeilen 1–3 werden allein ausgefüllt; geredet wird, wenn alle Karten da sind. Ein vereinbartes Volumen kann dann in Shift Capacity einfließen."),
      blocks: [
        { type: "form", items: [
          { h: x("The question", "Pyetja", "Die Frage"), hint: x("what exactly, in which unit, and when the true figure will be known", "çfarë saktësisht, në cilën njësi, dhe kur do të dihet shifra e vërtetë", "was genau, in welcher Einheit, und wann die wahre Zahl bekannt ist") },
          { h: x("My estimate, alone", "Vlerësimi im, më vete", "Meine Schätzung, allein"), hint: x("one number, and how sure: low, medium, high", "një numër, dhe sa i sigurt: pak, mesatarisht, shumë", "eine Zahl, und wie sicher: wenig, mittel, sehr") },
          { h: x("What I based it on", "Mbi çfarë u bazova", "Worauf ich mich stütze"), hint: x("one line: data, experience, a comparison", "një rresht: të dhëna, përvojë, një krahasim", "eine Zeile: Daten, Erfahrung, ein Vergleich") },
          { h: x("The spread", "Shtrirja", "Die Streuung"), hint: x("lowest, median and highest of all cards, read out before anyone argues", "më i ulëti, mediana dhe më i larti i të gjitha kartave, të lexuara para se të debatojë kush", "niedrigste, Median und höchste aller Karten, vorgelesen, bevor jemand argumentiert") },
          { h: x("After the discussion", "Pas diskutimit", "Nach der Diskussion"), hint: x("the agreed figure; who moved, and why", "shifra e rënë dakord; kush lëvizi dhe pse", "die vereinbarte Zahl; wer sich bewegt hat und warum") },
          { h: x("The true figure", "Shifra e vërtetë", "Die wahre Zahl"), hint: x("the error of the median and of the agreed figure; what we change next time", "gabimi i medianës dhe i shifrës së rënë dakord; çfarë ndryshojmë herën tjetër", "Fehler des Medians und der vereinbarten Zahl; was wir nächstes Mal ändern"), lines: 2 },
        ] },
      ],
      note: x(
        "This card is the editors' proposal, built on Galton (1907), Lorenz et al. (2011) and Becker et al. (2017); it has not been tested as a card.",
        "Kjo kartë është propozim i redaksisë, i ndërtuar mbi Galton-in (1907), Lorenz et al. (2011) dhe Becker et al. (2017); si kartë nuk është provuar.",
        "Diese Karte ist ein Vorschlag der Redaktion, gestützt auf Galton (1907), Lorenz et al. (2011) und Becker et al. (2017); als Karte wurde sie nicht getestet."),
      source: ["crowd-galton-1907", "crowd-lorenz-2011", "crowd-becker-2017"],
    },
    { id: "sources", type: "sources" },
    { id: "back", type: "back" },
  ],
};
