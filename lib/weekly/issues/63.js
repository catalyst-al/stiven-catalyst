// Management Review, No. 63: Near misses: what almost happened. Block: KPI.
// Facts and their sources: docs/revista/management-review-nr-63.md.
import { x } from "../common.js";

export default {
  number: 63,
  block: "kpi",
  date: x("November 2026", "Nëntor 2026", "November 2026"),
  theme: [x("Near misses:", "Near miss:", "Beinahe-Ereignisse:"), x("what almost happened", "ngjarjet që gati ndodhën", "was fast passiert wäre")],
  sub: x(
    "The foam that fell before Columbia's last flight, how the telling of a near miss changes a decision, seven stages from report to fix, what Heinrich's pyramid does and does not show, what to count, and a card for the event that almost happened.",
    "Shkuma që kishte rënë edhe para fluturimit të fundit të Columbia-s, si e ndryshon një vendim mënyra si tregohet një near miss, shtatë faza nga raportimi te rregullimi, çfarë tregon dhe çfarë nuk tregon piramida e Heinrich-ut, çfarë numërohet, dhe një kartë për ngjarjen që gati ndodhi.",
    "Der Schaum, der schon vor Columbias letztem Flug abfiel, wie die Erzählung eines Beinahe-Ereignisses eine Entscheidung verändert, sieben Stufen von der Meldung bis zur Lösung, was Heinrichs Pyramide zeigt und was nicht, was man zählt, und eine Karte für das, was fast passiert wäre."),
  seo: x(
    "Near misses: Columbia's foam, how a lucky escape changes decisions, seven stages from report to fix, the truth about Heinrich's pyramid, and a card.",
    "Near miss: shkuma e Columbia-s, si e ndryshon vendimin një shpëtim me fat, shtatë faza nga raportimi te rregullimi, piramida e Heinrich-ut dhe një kartë.",
    "Beinahe-Ereignisse: Columbias Schaum, wie Glück Entscheidungen verändert, sieben Stufen von der Meldung zur Lösung, Heinrichs Pyramide und eine Karte."),
  feature: x(
    "Issue 63 starts with the foam that had broken off the same ramp of the shuttle's tank six times before it brought down Columbia, shows in experiments how the way a near miss is told turns it into reassurance or into a warning, follows James Phimister's seven stages from noticing to fixing, asks what Heinrich's 300-29-1 pyramid does and does not show, sets out what to count, and ends with a card for the event that almost happened.",
    "Numri 63 nis me shkumën që ishte shkëputur gjashtë herë nga e njëjta pjesë e rezervuarit të anijes, para se ta rrëzonte Columbia-n, tregon me eksperimente si mënyra si tregohet një near miss e kthen atë në qetësim ose në paralajmërim, ndjek shtatë fazat e James Phimister-it nga vënia re te rregullimi, pyet çfarë tregon dhe çfarë nuk tregon piramida 300-29-1 e Heinrich-ut, shtjellon çfarë numërohet, dhe mbyllet me një kartë për ngjarjen që gati ndodhi.",
    "Ausgabe 63 beginnt mit dem Schaum, der sich sechsmal von derselben Stelle des Shuttle-Tanks gelöst hatte, bevor er Columbia zum Verhängnis wurde, zeigt in Experimenten, wie die Erzählung eines Beinahe-Ereignisses daraus Beruhigung oder Warnung macht, folgt James Phimisters sieben Stufen vom Bemerken bis zur Lösung, fragt, was Heinrichs Pyramide 300-29-1 zeigt und was nicht, stellt vor, was man zählt, und endet mit einer Karte für das, was fast passiert wäre."),
  figure: { n: "6", by: "CAIB, 2003", t: x(
    "earlier shuttle flights, from 1983 to 2002, on which imagery showed foam breaking off the same ramp of the external tank. None of them ended in disaster.",
    "fluturime të mëparshme të anijes, nga 1983 deri në 2002, ku pamjet treguan shkumë që shkëputej nga e njëjta pjesë e rezervuarit të jashtëm. Asnjëri nuk përfundoi me katastrofë.",
    "frühere Shuttle-Flüge von 1983 bis 2002, auf denen Bilder zeigten, wie sich Schaum von derselben Stelle des Außentanks löste. Keiner endete in einer Katastrophe.") },
  teasers: [
    { page: "story", kicker: x("Cover story", "Tema kryesore", "Titelthema"),
      title: x("The foam that fell before", "Shkuma që kishte rënë më parë", "Der Schaum, der schon vorher fiel") },
    { page: "research", kicker: x("What the research says", "Çfarë thotë kërkimi", "Was die Forschung sagt"),
      title: x("300, 29, 1: what the pyramid shows", "300, 29, 1: çfarë tregon piramida", "300, 29, 1: was die Pyramide zeigt") },
    { page: "tool", kicker: x("Tool of the issue", "Mjeti i numrit", "Werkzeug der Ausgabe"),
      title: x("The near-miss card", "Karta e near miss-it", "Die Karte für Beinahe-Ereignisse") },
  ],
  sources: ["nearmiss-caib-2003", "nearmiss-tinsley-2012", "nearmiss-phimister-2003", "nearmiss-nsc-2013", "nearmiss-heinrich-1931", "nearmiss-manuele-2011", "nearmiss-wright-2004", "nearmiss-yorio-2018"],
  pages: [
    { id: "cover", type: "cover" },
    {
      id: "intro", type: "intro",
      why: x(
        "Much of what goes wrong at work almost went wrong first. This issue is about the events that ended well by luck: how to notice them, why they so often reassure instead of warn, and what a team does with them before the luck runs out.",
        "Shumë nga ato që shkojnë keq në punë fillimisht gati shkuan keq. Ky numër flet për ngjarjet që përfunduan mirë falë fatit: si t'i vësh re, pse aq shpesh të qetësojnë në vend që të të paralajmërojnë, dhe çfarë bën një ekip me to para se të mbarojë fati.",
        "Vieles, was bei der Arbeit schiefgeht, wäre vorher schon fast schiefgegangen. Diese Ausgabe handelt von Ereignissen, die durch Glück gut ausgingen: wie man sie bemerkt, warum sie so oft beruhigen statt zu warnen, und was ein Team damit tut, bevor das Glück ausgeht."),
      body: x(
        "The US National Safety Council calls a near miss an event that could have caused harm, where only a fortunate break in the chain of events prevented it. Foam broke off the same part of the shuttle's tank on six flights before the one that destroyed Columbia. In experiments by Catherine Tinsley and colleagues, people who heard of a hazard that had left no harm took more risk. James Phimister and colleagues follow a near miss through seven stages. Heinrich's pyramid of 1931 is still everywhere; its data cannot be checked.",
        "Këshilli Kombëtar i Sigurisë në SHBA (NSC) e quan near miss një ngjarje që mund të shkaktonte dëm, ku vetëm një këputje me fat në zinxhirin e ngjarjeve e pengoi. Shkuma u shkëput nga e njëjta pjesë e rezervuarit të anijes në gjashtë fluturime, para atij që shkatërroi Columbia-n. Në eksperimentet e Catherine Tinsley-t dhe kolegëve, njerëzit që dëgjuan për një rrezik që nuk kishte lënë dëm morën më shumë rrezik. James Phimister dhe kolegët ndjekin një near miss në shtatë faza. Piramida e Heinrich-ut e 1931 është ende kudo; të dhënat e saj nuk kontrollohen dot.",
        "Der US-amerikanische National Safety Council nennt ein Beinahe-Ereignis ein Ereignis, das hätte schaden können und bei dem nur eine glückliche Unterbrechung der Ereigniskette den Schaden verhinderte. Von derselben Stelle des Shuttle-Tanks löste sich Schaum auf sechs Flügen vor dem, der Columbia zerstörte. In Experimenten von Catherine Tinsley und Kollegen gingen Menschen, die von einer folgenlosen Gefahr gehört hatten, mehr Risiko ein. James Phimister und Kollegen verfolgen ein Beinahe-Ereignis über sieben Stufen. Heinrichs Pyramide von 1931 ist noch überall; ihre Daten lassen sich nicht prüfen."),
    },
    {
      id: "story",
      kicker: x("Cover story", "Tema kryesore", "Titelthema"),
      title: [x("The foam that", "Shkuma që kishte", "Der Schaum, der"), x("fell before", "rënë më parë", "schon vorher fiel")],
      lead: x(
        "On 16 January 2003, 81.7 seconds after launch, foam broke off the left bipod ramp of Columbia's external tank and struck the left wing. On 1 February the shuttle broke up on re-entry; all seven crew died. The accident board found that the same ramp had shed foam before.",
        "Më 16 janar 2003, 81,7 sekonda pas nisjes, shkuma u shkëput nga rampa e majtë e mbajtëses (bipod) në rezervuarin e jashtëm të Columbia-s dhe goditi krahun e majtë. Më 1 shkurt anija u shkatërrua gjatë rikthimit në atmosferë; vdiq i gjithë ekuipazhi prej shtatë vetash. Bordi hetimor gjeti se e njëjta rampë kishte lëshuar shkumë edhe më parë.",
        "Am 16. Januar 2003, 81,7 Sekunden nach dem Start, löste sich Schaum von der linken Bipod-Rampe des Außentanks der Columbia und traf den linken Flügel. Am 1. Februar zerbrach das Shuttle beim Wiedereintritt; alle sieben Besatzungsmitglieder starben. Die Untersuchungskommission fand, dass sich von derselben Rampe schon früher Schaum gelöst hatte."),
      blocks: [
        { type: "timeline", items: [
          { k: "1983", t: x("First known foam loss from the ramp. Logged as an in-flight anomaly, then closed.", "Humbja e parë e njohur e shkumës nga rampa. U regjistrua si anomali në fluturim, pastaj u mbyll.", "Erster bekannter Schaumverlust an der Rampe. Als Anomalie im Flug erfasst, dann abgeschlossen.") },
          { k: "1990–94", t: x("Four more. Only 72 of 113 flights had imagery good enough to tell.", "Edhe katër të tjera. Vetëm 72 nga 113 fluturime kishin pamje mjaft të mira për ta parë.", "Vier weitere. Nur 72 von 113 Flügen hatten Bilder, die gut genug dafür waren.") },
          { k: "2002", t: x("A large loss on STS-112, logged only as an “action” item.", "Një humbje e madhe te STS-112, e regjistruar vetëm si “veprim” për t'u ndjekur.", "Ein großer Verlust bei STS-112, nur als „Action“-Punkt erfasst.") },
          { k: "2003", t: x("The seventh known loss hits Columbia's wing.", "Humbja e shtatë e njohur godet krahun e Columbia-s.", "Der siebte bekannte Verlust trifft Columbias Flügel.") },
        ] },
        { type: "p", text: x(
          "Over 22 years, the Board wrote, foam strikes were normalised into a “maintenance” issue. NASA labelled them “in family”: a problem already experienced, analysed and understood.",
          "Gjatë 22 vjetëve, shkroi Bordi, goditjet e shkumës u normalizuan në një çështje “mirëmbajtjeje”. NASA i etiketoi “in family”: problem i njohur, i analizuar dhe i kuptuar.",
          "Über 22 Jahre, schrieb die Kommission, wurden Schaumtreffer zur „Wartungsfrage“ normalisiert. NASA nannte sie „in family“: ein bekanntes, analysiertes und verstandenes Problem.") },
        { type: "callout", reading: true, text: x(
          "A near miss repeated often enough stops looking like a warning and starts looking like proof that all is well.",
          "Një near miss që përsëritet mjaft herë nuk duket më si paralajmërim, por si provë se gjithçka është në rregull.",
          "Ein Beinahe-Ereignis, das sich oft genug wiederholt, wirkt nicht mehr wie eine Warnung, sondern wie ein Beweis, dass alles in Ordnung ist.") },
      ],
      note: x(
        "Seven cases confirmed by imagery, about 10% of the 72 imaged flights. The Board called the pattern a normalisation of deviance.",
        "Shtatë raste të konfirmuara nga pamjet, rreth 10% e 72 fluturimeve me pamje. Bordi e quajti këtë model normalizim të devijimit.",
        "Sieben durch Bilder bestätigte Fälle, rund 10 % der 72 Flüge mit Bildern. Die Kommission nannte das Muster eine Normalisierung der Abweichung."),
      source: ["nearmiss-caib-2003"],
    },
    {
      id: "numbers",
      kicker: x("The numbers", "Shifrat", "Die Zahlen"),
      title: [x("When luck", "Kur fati", "Wenn Glück"), x("reassures", "të qetëson", "beruhigt")],
      lead: x(
        "Catherine Tinsley, Robin Dillon and Matthew Cronin asked 299 business students whether they would still take a non-refundable cruise that a hurricane had a 30% chance of hitting. Some read that their three earlier cruises had gone without trouble; others also knew someone whose cruise had been hit.",
        "Catherine Tinsley, Robin Dillon dhe Matthew Cronin pyetën 299 studentë biznesi nëse do të shkonin ende në një kroçerë të parimbursueshme, që një uragan e godiste me 30% mundësi. Disa lexuan se tri kroçerat e tyre të mëparshme kishin shkuar pa probleme; të tjerët njihnin edhe dikë që e kishte goditur uragani.",
        "Catherine Tinsley, Robin Dillon und Matthew Cronin fragten 299 Wirtschaftsstudierende, ob sie eine nicht erstattbare Kreuzfahrt antreten würden, die ein Hurrikan mit 30 % Wahrscheinlichkeit trifft. Manche lasen, ihre drei früheren Fahrten seien problemlos verlaufen; andere kannten zudem jemanden, dessen Fahrt getroffen wurde."),
      blocks: [
        { type: "hbars", source: ["nearmiss-tinsley-2012"],
          label: x("Would still go on the cruise, 2012", "Do të shkonin ende në kroçerë, 2012", "Würden die Kreuzfahrt antreten, 2012"),
          items: [
            { k: x("No trouble before, reminded of delays", "Pa probleme më parë, kujtohen vonesat", "Bisher problemlos, Hinweis auf Verspätung"), v: 58.5, n: x("58.5%", "58,5%", "58,5 %"), alert: true },
            { k: x("No trouble before, reminded of injury", "Pa probleme më parë, kujtohet lëndimi", "Bisher problemlos, Hinweis auf Verletzung"), v: 50.8, n: x("50.8%", "50,8%", "50,8 %") },
            { k: x("Knew someone hit, reminded of delays", "Njihnin dikë të goditur, kujtohen vonesat", "Kannten Betroffene, Hinweis auf Verspätung"), v: 39.0, n: x("39.0%", "39,0%", "39,0 %") },
            { k: x("Knew someone hit, reminded of injury", "Njihnin dikë të goditur, kujtohet lëndimi", "Kannten Betroffene, Hinweis auf Verletzung"), v: 32.8, n: x("32.8%", "32,8%", "32,8 %") },
          ] },
        { type: "p", text: x(
          "How the earlier escape was told mattered more than the reminder. The pattern also held in an evacuation task among 102 emergency managers.",
          "Mënyra si tregohej shpëtimi i mëparshëm kishte më shumë rëndësi se kujtesa. Modeli u pa edhe në një detyrë evakuimi te 102 menaxherë emergjencash.",
          "Wie das frühere Davonkommen erzählt wurde, zählte mehr als der Hinweis. Das Muster zeigte sich auch in einer Evakuierungsaufgabe bei 102 Fachleuten des Katastrophenschutzes.") },
        { type: "callout", reading: true, text: x(
          "The same event, told as “nothing happened” or as “it almost happened”, leads to opposite decisions.",
          "E njëjta ngjarje, e treguar si “s'ndodhi asgjë” ose si “gati ndodhi”, të çon në vendime të kundërta.",
          "Dasselbe Ereignis, erzählt als „nichts ist passiert“ oder als „fast wäre es passiert“, führt zu gegensätzlichen Entscheidungen.") },
      ],
      note: x(
        "Students in a scenario, not staff at work. Delays versus injury made no significant difference; the two kinds of near miss did.",
        "Studentë në një skenar, jo punonjës në punë. Vonesat kundrejt lëndimit nuk bënë diferencë domethënëse; dy llojet e near miss-it po.",
        "Studierende in einem Szenario, keine Beschäftigten bei der Arbeit. Verspätung oder Verletzung machte keinen signifikanten Unterschied, die beiden Arten von Beinahe-Ereignis schon."),
      source: ["nearmiss-tinsley-2012"],
    },
    {
      id: "model", more: "6s-without-a-poster",
      kicker: x("The model", "Modeli", "Das Modell"),
      title: [x("Seven stages,", "Shtatë faza,", "Sieben Stufen,"), x("report to fix", "nga raporti te rregullimi", "von der Meldung zur Lösung")],
      lead: x(
        "James Phimister and colleagues built their framework (2003) on more than 100 interviews at 20 chemical and pharmaceutical sites. It follows a near miss through seven stages, so that a site can find its weak links.",
        "James Phimister dhe kolegët e ndërtuan kornizën e tyre (2003) mbi më shumë se 100 intervista në 20 objekte kimike dhe farmaceutike. Ajo ndjek një near miss nëpër shtatë faza, që një objekt të gjejë hallkat e veta të dobëta.",
        "James Phimister und Kollegen stützten ihr Modell (2003) auf mehr als 100 Interviews an 20 Chemie- und Pharmastandorten. Es verfolgt ein Beinahe-Ereignis über sieben Stufen, damit ein Standort seine schwachen Glieder findet."),
      blocks: [
        { type: "box", title: x("The seven stages", "Shtatë fazat", "Die sieben Stufen"), items: [
          x("Identification: someone sees that something almost happened", "Identifikimi: dikush e sheh që diçka gati ndodhi", "Erkennen: Jemand sieht, dass fast etwas passiert wäre"),
          x("Disclosure: it is reported", "Raportimi: ngjarja raportohet", "Melden: Das Ereignis wird gemeldet"),
          x("Prioritisation and distribution: how serious, who takes it", "Përparësia dhe shpërndarja: sa serioze, kush e merr", "Priorisieren und Verteilen: wie ernst, wer es übernimmt"),
          x("Causal analysis: why it happened", "Analiza e shkaqeve: pse ndodhi", "Ursachenanalyse: warum es geschah"),
          x("Solution identification: what would stop it", "Gjetja e zgjidhjes: çfarë do ta ndalte", "Lösungssuche: was es verhindern würde"),
          x("Dissemination: those affected hear of it", "Përhapja: e marrin vesh ata që preken", "Verbreiten: Die Betroffenen erfahren davon"),
          x("Resolution: the change is made and the case closed", "Zgjidhja: ndryshimi bëhet dhe rasti mbyllet", "Abschluss: Die Änderung ist umgesetzt, der Fall geschlossen"),
        ] },
        { type: "p", text: x(
          "The National Safety Council's 2013 case study adds the conditions: reporting that is non-punitive, anonymous if the reporter wishes, and easy, with each near miss investigated for the weaknesses in the system behind it.",
          "Studimi i rastit i NSC-së në 2013 shton kushtet: raportim pa ndëshkim, anonim nëse e do raportuesi, dhe i lehtë, ku çdo near miss hetohet për dobësitë e sistemit që qëndrojnë pas tij.",
          "Die Fallstudie des National Safety Council von 2013 nennt die Bedingungen: Melden ohne Strafe, anonym, wenn die meldende Person es wünscht, und einfach, wobei jedes Beinahe-Ereignis auf die Schwächen im System dahinter untersucht wird.") },
        { type: "callout", reading: true, text: x(
          "Most programmes count stage 2. Near misses are lost at stage 1, when nobody sees them, and at stage 7, when nobody closes them.",
          "Shumica e programeve numërojnë fazën 2. Near miss-et humbasin te faza 1, kur s'i sheh askush, dhe te faza 7, kur s'i mbyll askush.",
          "Die meisten Programme zählen Stufe 2. Verloren gehen Beinahe-Ereignisse in Stufe 1, wenn niemand sie sieht, und in Stufe 7, wenn niemand sie abschließt.") },
      ],
      note: x(
        "We saw the article only as an abstract; the stage names follow two later papers that cite it. The reading is the editors'.",
        "Artikullin e pamë vetëm si abstrakt; emrat e fazave ndjekin dy punime të mëvonshme që e citojnë. Leximi është i redaksisë.",
        "Den Artikel sahen wir nur als Zusammenfassung; die Namen der Stufen folgen zwei späteren Arbeiten, die ihn zitieren. Die Deutung stammt von der Redaktion."),
      source: ["nearmiss-phimister-2003", "nearmiss-nsc-2013"],
    },
    {
      id: "research",
      kicker: x("What the research says", "Çfarë thotë kërkimi", "Was die Forschung sagt"),
      title: [x("300, 29, 1: what", "300, 29, 1: çfarë", "300, 29, 1: was"), x("the pyramid shows", "tregon piramida", "die Pyramide zeigt")],
      lead: x(
        "In 1931 Herbert W. Heinrich estimated that of 330 accidents, 300 cause no injury, 29 a minor one and 1 a major one. Reviewing all four editions in 2011, Fred Manuele found no data behind the ratio that could be examined.",
        "Në 1931, Herbert W. Heinrich vlerësoi se nga 330 aksidente, 300 nuk shkaktojnë lëndim, 29 një lëndim të lehtë dhe 1 një të rëndë. Duke i shqyrtuar të katër botimet në 2011, Fred Manuele nuk gjeti të dhëna pas raportit që të mund të kontrolloheshin.",
        "1931 schätzte Herbert W. Heinrich, dass von 330 Unfällen 300 keine Verletzung verursachen, 29 eine leichte und 1 eine schwere. Fred Manuele prüfte 2011 alle vier Auflagen und fand keine prüfbaren Daten hinter dem Verhältnis."),
      blocks: [
        { type: "columns", max: 300, height: 92, source: ["nearmiss-heinrich-1931", "nearmiss-manuele-2011"],
          label: x("Heinrich's group of 330 accidents, 1931", "Grupi i Heinrich-ut prej 330 aksidentesh, 1931", "Heinrichs Gruppe von 330 Unfällen, 1931"),
          items: [
            { k: x("No injury", "Pa lëndim", "Keine Verletzung"), v: 300, n: "300" },
            { k: x("Minor", "I lehtë", "Leicht"), v: 29, n: "29" },
            { k: x("Major", "I rëndë", "Schwer"), v: 1, n: "1", alert: true },
          ] },
        { type: "p", text: x(
          "A “major” injury was any case reported to an insurer. Later tests are mixed. On UK railways, only 3 of 21 types of cause differed between injuries, damage and near misses (Wright & van der Schaaf). In 25,000+ workplaces over 13 years, more minor incidents went with a higher chance of a fatal one, but the triangle's shape depended on how severity was classified (Yorio & Moore).",
          "Lëndim “i rëndë” ishte çdo rast i raportuar te një sigurues. Provat e mëvonshme janë të përziera. Në hekurudhat britanike, vetëm 3 nga 21 llojet e shkaqeve ndryshonin mes lëndimeve, dëmeve dhe near miss-eve (Wright & van der Schaaf). Në mbi 25.000 vende pune gjatë 13 vjetëve, më shumë incidente të lehta shkonin me një mundësi më të lartë për një vdekjeprurës, por forma e trekëndëshit varej nga si klasifikohej rëndësia (Yorio & Moore).",
          "Als „schwer“ galt jeder Fall, der einer Versicherung gemeldet wurde. Spätere Prüfungen fallen gemischt aus. Bei britischen Bahnen unterschieden sich nur 3 von 21 Ursachenarten zwischen Verletzungen, Schäden und Beinahe-Ereignissen (Wright & van der Schaaf). In über 25.000 Arbeitsstätten über 13 Jahre gingen mehr leichte Vorfälle mit einer höheren Wahrscheinlichkeit eines tödlichen einher, doch die Form des Dreiecks hing davon ab, wie man die Schwere einteilte (Yorio & Moore).") },
        { type: "callout", reading: true, text: x(
          "Near misses are worth learning from because they often share causes with accidents. That does not make the ratio a law, or fewer small injuries a promise of fewer deaths.",
          "Nga near miss-et ia vlen të mësosh, sepse shpesh kanë shkaqe të përbashkëta me aksidentet. Kjo nuk e bën raportin ligj, as më pak lëndime të lehta premtim për më pak vdekje.",
          "Aus Beinahe-Ereignissen lohnt es sich zu lernen, weil sie oft Ursachen mit Unfällen teilen. Das macht das Verhältnis nicht zum Gesetz und weniger leichte Verletzungen nicht zum Versprechen weniger Todesfälle.") },
      ],
      note: x(
        "Heinrich is quoted from Manuele; we did not see the book. Manuele also cites US claims data: small claims fell faster than large ones.",
        "Heinrich-u citohet nga Manuele; librin nuk e pamë. Manuele citon edhe të dhëna dëmesh në SHBA: dëmet e vogla ranë më shpejt se të mëdhatë.",
        "Heinrich wird nach Manuele zitiert; das Buch sahen wir nicht. Manuele nennt auch US-Schadensdaten: Kleine Fälle sanken schneller als große."),
      source: ["nearmiss-heinrich-1931", "nearmiss-manuele-2011", "nearmiss-wright-2004", "nearmiss-yorio-2018"],
    },
    {
      id: "measure",
      kicker: x("How it is measured", "Si matet", "Wie man es misst"),
      title: [x("Count the closing,", "Numëro mbylljen,", "Den Abschluss zählen,"), x("not only the reports", "jo vetëm raportet", "nicht nur die Meldungen")],
      lead: x(
        "The NSC treats near-miss reporting as a leading indicator, to be used alongside other measures and reported back to the organisation. It warns against rewarding managers for low recordable injury rates: that kind of incentive has been shown to suppress reporting.",
        "NSC-ja e trajton raportimin e near miss-eve si tregues paraprijës, që përdoret bashkë me masa të tjera dhe i kthehet organizatës si informacion. Ajo paralajmëron kundër shpërblimit të drejtuesve për norma të ulëta lëndimesh të regjistruara: ky lloj nxitjeje ka treguar se e shtyp raportimin.",
        "Der NSC sieht die Meldung von Beinahe-Ereignissen als Frühindikator, der neben anderen Kennzahlen genutzt und an die Organisation zurückgemeldet wird. Er warnt davor, Führungskräfte für niedrige Quoten meldepflichtiger Verletzungen zu belohnen: Solche Anreize unterdrücken nachweislich Meldungen."),
      blocks: [
        { type: "steps", items: [
          { h: x("Reports per month", "Raportet në muaj", "Meldungen pro Monat"), p: x("Expect the count to rise first: more reports can mean more trust, not more danger.", "Prit që numri të rritet në fillim: më shumë raporte mund të thotë më shumë besim, jo më shumë rrezik.", "Zuerst steigt die Zahl meist: Mehr Meldungen können mehr Vertrauen bedeuten, nicht mehr Gefahr.") },
          { h: x("Share closed", "Pjesa e mbyllur", "Anteil abgeschlossen"), p: x("Reports with an agreed change carried out, out of all reports.", "Raportet me një ndryshim të rënë dakord e të zbatuar, nga të gjitha raportet.", "Meldungen mit vereinbarter und umgesetzter Änderung, von allen Meldungen.") },
          { h: x("Days to feedback", "Ditët deri te përgjigjja", "Tage bis zur Rückmeldung"), p: x("From the report to the reporter hearing what happens next.", "Nga raporti deri kur raportuesi mëson çfarë ndodh më tej.", "Von der Meldung, bis die meldende Person erfährt, wie es weitergeht.") },
          { h: x("Repeats", "Përsëritjet", "Wiederholungen"), p: x("The same near miss again after its case was closed.", "I njëjti near miss sërish, pasi rasti i tij u mbyll.", "Dasselbe Beinahe-Ereignis erneut, nachdem der Fall geschlossen war.") },
        ] },
        { type: "example", label: x("Hypothetical example, one month in a parcel depot", "Shembull hipotetik, një muaj në një depo pakosh", "Hypothetisches Beispiel, ein Monat in einem Paketlager"), rows: [
          { k: x("Reports", "Raportet", "Meldungen"), v: x("18, up from 12", "18, nga 12", "18, nach 12") },
          { k: x("Changes", "Ndryshimet", "Änderungen"), v: x("10 agreed, 6 carried out", "10 të rëna dakord, 6 të zbatuara", "10 vereinbart, 6 umgesetzt") },
          { k: x("Feedback", "Përgjigjja", "Rückmeldung"), v: x("5 of 18 reporters heard back within 7 days", "5 nga 18 raportuesit morën përgjigje brenda 7 ditëve", "5 von 18 Meldenden hörten binnen 7 Tagen etwas") },
        ], text: x("The rising count is good news; the gap is in telling people what their report changed. The numbers are invented.", "Rritja e numrit është lajm i mirë; mungesa është te tregimi i njerëzve çfarë ndryshoi raporti i tyre. Numrat janë të shpikur.", "Die steigende Zahl ist eine gute Nachricht; die Lücke liegt darin, den Leuten zu sagen, was ihre Meldung verändert hat. Die Zahlen sind erfunden.") },
      ],
      note: x(
        "The four measures and the example are the editors', after the NSC case study and the stages of Phimister et al.",
        "Katër masat dhe shembulli janë të redaksisë, sipas studimit të rastit të NSC-së dhe fazave të Phimister et al.",
        "Die vier Kennzahlen und das Beispiel stammen von der Redaktion, nach der NSC-Fallstudie und den Stufen von Phimister et al."),
      source: ["nearmiss-nsc-2013", "nearmiss-phimister-2003"],
    },
    {
      id: "tool", tool: "/tools/five-whys/",
      kicker: x("Tool of the issue", "Mjeti i numrit", "Werkzeug der Ausgabe"),
      title: [x("The near-miss", "Karta e", "Die Karte für"), x("card", "near miss-it", "Beinahe-Ereignisse")],
      lead: x(
        "One card per event, filled in the same day. Write it as something that almost happened, not as something that did not; describe the conditions, not the person.",
        "Një kartë për çdo ngjarje, e plotësuar po atë ditë. Shkruaje si diçka që gati ndodhi, jo si diçka që nuk ndodhi; përshkruaj kushtet, jo personin.",
        "Eine Karte pro Ereignis, am selben Tag ausgefüllt. Als etwas aufschreiben, das fast passiert wäre, nicht als etwas, das nicht passiert ist; die Bedingungen beschreiben, nicht die Person."),
      blocks: [
        { type: "form", items: [
          { h: x("What happened", "Çfarë ndodhi", "Was geschah"), hint: x("where, when, what you saw; no names", "ku, kur, çfarë pe; pa emra", "wo, wann, was man sah; keine Namen") },
          { h: x("What could have happened", "Çfarë mund të kishte ndodhur", "Was hätte passieren können"), hint: x("the worst realistic outcome, and what stopped it", "përfundimi më i keq i mundshëm, dhe çfarë e ndali", "der schlimmste realistische Ausgang und was ihn verhinderte"), lines: 2 },
          { h: x("Why", "Pse", "Warum"), hint: x("the conditions behind it; ask why more than once", "kushtet pas saj; pyet pse më shumë se një herë", "die Bedingungen dahinter; mehr als einmal nach dem Warum fragen") },
          { h: x("What changes", "Çfarë ndryshon", "Was sich ändert"), hint: x("one change that removes the condition, not a reminder to be careful", "një ndryshim që e heq kushtin, jo një kujtesë për të qenë i kujdesshëm", "eine Änderung, die die Bedingung beseitigt, keine Mahnung zur Vorsicht") },
          { h: x("Who follows up, by when", "Kush e ndjek, deri kur", "Wer kümmert sich, bis wann"), hint: x("one owner and a date", "një përgjegjës dhe një datë", "eine verantwortliche Person und ein Datum") },
          { h: x("Told back", "I tregova raportuesit", "Zurückgemeldet"), hint: x("when the person who reported heard what changed", "kur mori vesh personi që raportoi çfarë ndryshoi", "wann die meldende Person erfuhr, was sich geändert hat") },
        ] },
      ],
      note: x(
        "A practice proposed by the editors, after the NSC case study, the seven stages of Phimister et al. and the near misses told as “almost happened” in Tinsley et al.",
        "Praktikë e propozuar nga redaksia, sipas studimit të rastit të NSC-së, shtatë fazave të Phimister et al. dhe near miss-eve të treguara si “gati ndodhi” te Tinsley et al.",
        "Eine Praxis, die die Redaktion vorschlägt, nach der NSC-Fallstudie, den sieben Stufen von Phimister et al. und den als „fast passiert“ erzählten Beinahe-Ereignissen bei Tinsley et al."),
      source: ["nearmiss-nsc-2013", "nearmiss-phimister-2003", "nearmiss-tinsley-2012"],
    },
    { id: "sources", type: "sources" },
    { id: "back", type: "back" },
  ],
};
