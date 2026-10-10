// Management Review, No. 78: The ethical leader. Block: Role.
// Facts and their sources: docs/revista/management-review-nr-78.md. The correlations on the research page are the
// corrected ρ of Hoch et al. (2018) as later reviews report them; the article itself was not seen.
import { x } from "../common.js";

// A decimal written for each language: "0.70", "0,70", "0,70".
const dec = (s) => x(s, s.replace(".", ","), s.replace(".", ","));

export default {
  number: 78,
  block: "role",
  date: x("November 2026", "Nëntor 2026", "November 2026"),
  theme: [x("The ethical", "Drejtuesi", "Die ethische"), x("leader", "etik", "Führungskraft")],
  sub: x(
    "A good person is not yet an ethical leader, how ethics flows from the top to the front line, four reputations, the overlap with transformational leadership, the ten questions of the scale, and a card for one decision.",
    "Një njeri i mirë nuk është ende drejtues etik, si rrjedh etika nga maja te vija e parë, katër reputacione, mbivendosja me drejtimin transformues, dhjetë pyetjet e shkallës, dhe një kartë për një vendim.",
    "Ein guter Mensch ist noch keine ethische Führungskraft, wie Ethik von oben nach unten fließt, vier Rufe, die Nähe zur transformationalen Führung, die zehn Fragen der Skala und eine Karte für eine Entscheidung."),
  seo: x(
    "The ethical leader: moral person and moral manager, the trickle-down from top to front line, the overlap with transformational leadership, the ELS and a card.",
    "Drejtuesi etik: njeriu moral dhe menaxheri moral, rrjedha nga maja te vija e parë, mbivendosja me drejtimin transformues, shkalla ELS dhe një kartë.",
    "Die ethische Führungskraft: moralische Person und moralischer Manager, der Fluss nach unten, die Nähe zu transformationaler Führung, die ELS, Karte."),
  feature: x(
    "Issue 78 starts with interviews in which senior executives and ethics officers described what earns a leader a reputation for ethics, follows a study of 195 departments in which the ethics of top management reached employees through their own supervisors, crosses the two pillars into four reputations, weighs how far ethical leadership is more than good leadership in general, sets out the ten questions with which employees rate it, and ends with a card for one decision that tests the standard.",
    "Numri 78 nis me intervistat ku drejtues të lartë dhe zyrtarë të etikës përshkruan çfarë i jep një drejtuesi reputacionin e etikës, ndjek një studim në 195 departamente ku etika e drejtimit të lartë arriti te punonjësit përmes shefave të tyre të drejtpërdrejtë, kryqëzon dy shtyllat në katër reputacione, peshon sa është drejtimi etik më shumë se drejtimi i mirë në përgjithësi, rendit dhjetë pyetjet me të cilat e vlerësojnë punonjësit, dhe mbyllet me një kartë për një vendim që e vë standardin në provë.",
    "Ausgabe 78 beginnt mit Interviews, in denen Topmanager und Ethikbeauftragte beschrieben, was einer Führungskraft den Ruf der Ethik einbringt, folgt einer Studie in 195 Abteilungen, in der die Ethik der Unternehmensleitung die Beschäftigten über ihre direkten Vorgesetzten erreichte, kreuzt die zwei Säulen zu vier Rufen, wägt ab, wie weit ethische Führung mehr ist als gute Führung allgemein, stellt die zehn Fragen vor, mit denen Beschäftigte sie bewerten, und endet mit einer Karte für eine Entscheidung, die den Standard auf die Probe stellt."),
  figure: { n: "904", by: "Mayer et al., 2009", t: x(
    "employees in 195 departments: the ethics of top management reached them through their own supervisors.",
    "punonjës në 195 departamente: etika e drejtimit të lartë arriti te ta përmes shefave të tyre të drejtpërdrejtë.",
    "Beschäftigte in 195 Abteilungen: Die Ethik der Leitung erreichte sie über ihre direkten Vorgesetzten.") },
  teasers: [
    { page: "story", kicker: x("Cover story", "Tema kryesore", "Titelthema"),
      title: x("A good person is not enough", "Një njeri i mirë nuk mjafton", "Ein guter Mensch reicht nicht") },
    { page: "model", kicker: x("The model", "Modeli", "Das Modell"),
      title: x("Four reputations", "Katër reputacione", "Vier Rufe") },
    { page: "tool", kicker: x("Tool of the issue", "Mjeti i numrit", "Werkzeug der Ausgabe"),
      title: x("The right-way card", "Karta e rrugës së drejtë", "Die Karte für den richtigen Weg") },
  ],
  sources: ["ethlead-trevino-2000", "ethlead-mayer-2009", "ethlead-hoch-2018", "ethlead-ng-feldman-2015", "ethlead-bedi-2016", "ethlead-brown-2005"],
  pages: [
    { id: "cover", type: "cover" },
    {
      id: "intro", type: "intro",
      why: x(
        "Most managers think of themselves as decent people. The research on ethical leadership asks a harder question: does the team know it, and does the way the team is led show it? A reputation for ethics is built in front of others, or not at all.",
        "Shumica e menaxherëve e shohin veten si njerëz të ndershëm. Kërkimi për drejtimin etik bën një pyetje më të vështirë: a e di ekipi këtë, dhe a duket te mënyra si drejtohet ekipi? Reputacioni i etikës ndërtohet para të tjerëve, ose nuk ndërtohet fare.",
        "Die meisten Führungskräfte halten sich für anständig. Die Forschung zu ethischer Führung stellt eine härtere Frage: Weiß das Team das, und zeigt es sich daran, wie das Team geführt wird? Ein Ruf für Ethik entsteht vor anderen, oder gar nicht."),
      body: x(
        "Linda Treviño and colleagues found two pillars behind that reputation: the moral person and the moral manager. Crossed, they give four reputations, and only one is ethical leadership. In 195 departments the ethics of top management reached employees through their supervisors. Ethical leadership overlaps strongly with transformational leadership, yet still predicts behaviour beyond it. The ten-item scale shows what employees look at.",
        "Linda Treviño dhe kolegët gjetën dy shtylla pas atij reputacioni: njeriun moral dhe menaxherin moral. Të kryqëzuara, japin katër reputacione, dhe vetëm njëri është drejtim etik. Në 195 departamente, etika e drejtimit të lartë arriti te punonjësit përmes shefave të tyre. Drejtimi etik mbivendoset fort me drejtimin transformues, por prapë parashikon sjelljen përtej tij. Shkalla me dhjetë pyetje tregon çfarë shohin punonjësit.",
        "Linda Treviño und Kollegen fanden hinter diesem Ruf zwei Säulen: die moralische Person und den moralischen Manager. Gekreuzt ergeben sie vier Rufe, und nur einer ist ethische Führung. In 195 Abteilungen erreichte die Ethik der Leitung die Beschäftigten über ihre Vorgesetzten. Ethische Führung überschneidet sich stark mit transformationaler Führung, sagt Verhalten aber auch darüber hinaus voraus. Die Skala mit zehn Fragen zeigt, worauf Beschäftigte achten."),
    },
    {
      id: "story",
      kicker: x("Cover story", "Tema kryesore", "Titelthema"),
      title: [x("A good person", "Një njeri i mirë", "Ein guter Mensch"), x("is not enough", "nuk mjafton", "reicht nicht")],
      lead: x(
        "Linda Treviño, Laura Hartman and Michael Brown interviewed senior executives and corporate ethics officers about what makes an executive known as an ethical leader (2000). The answer was a reputation that rests on two pillars.",
        "Linda Treviño, Laura Hartman dhe Michael Brown intervistuan drejtues të lartë dhe zyrtarë të etikës në korporata për atë që e bën një drejtues të njihet si drejtues etik (2000). Përgjigjja ishte një reputacion që mbështetet mbi dy shtylla.",
        "Linda Treviño, Laura Hartman und Michael Brown befragten Topmanager und Ethikbeauftragte von Unternehmen, wodurch eine Führungskraft als ethisch gilt (2000). Die Antwort war ein Ruf, der auf zwei Säulen ruht."),
      blocks: [
        { type: "lists", cols: [
          { h: x("Moral person", "Njeriu moral", "Moralische Person"), items: [
            x("Traits: honesty, integrity, trustworthiness", "Tiparet: ndershmëria, integriteti, besueshmëria", "Eigenschaften: Ehrlichkeit, Integrität, Vertrauen"),
            x("Behaviours others can see", "Sjelljet që i shohin të tjerët", "Verhalten, das andere sehen"),
            x("How decisions are made", "Mënyra si merren vendimet", "Wie entschieden wird"),
          ] },
          { h: x("Moral manager", "Menaxheri moral", "Moralischer Manager"), accent: true, items: [
            x("Role modelling, in view of others", "Shembulli, para syve të të tjerëve", "Vorbild, vor den Augen anderer"),
            x("Rewards and discipline", "Shpërblimet dhe ndëshkimet", "Belohnung und Sanktion"),
            x("Communicating about ethics and values", "Të folurit për etikën dhe vlerat", "Über Ethik und Werte sprechen"),
          ] },
        ] },
        { type: "p", text: x(
          "The first pillar is about who you are, the second about what you make of the team. A leader can be honest in private and still leave employees unsure what is expected of them, because ethics is never part of how the work is led.",
          "Shtylla e parë ka të bëjë me atë që je, e dyta me atë që bën me ekipin. Një drejtues mund të jetë i ndershëm privatisht dhe prapë t'i lërë punonjësit të pasigurt se çfarë pritet prej tyre, sepse etika nuk hyn kurrë në mënyrën si drejtohet puna.",
          "Die erste Säule betrifft, wer man ist, die zweite, was man aus dem Team macht. Eine Führungskraft kann privat ehrlich sein und Beschäftigte trotzdem im Unklaren lassen, was erwartet wird, weil Ethik nie Teil der Führung der Arbeit ist.") },
        { type: "callout", reading: true, text: x(
          "The team cannot see your conscience. It sees what you reward, what you correct and what you talk about.",
          "Ekipi nuk e sheh ndërgjegjen tënde. Sheh çfarë shpërblen, çfarë korrigjon dhe për çfarë flet.",
          "Das Team sieht kein Gewissen. Es sieht, was man belohnt, was man korrigiert und worüber man spricht.") },
      ],
      note: x(
        "The pillars as the article's abstract and later summaries give them; we could not see the article, nor how many people were interviewed.",
        "Shtyllat siç i japin abstrakti i artikullit dhe përmbledhjet e mëvonshme; artikullin nuk e pamë, as sa njerëz u intervistuan.",
        "Die Säulen nach dem Abstract des Artikels und späteren Zusammenfassungen; den Artikel selbst und die Zahl der Befragten konnten wir nicht einsehen."),
      source: ["ethlead-trevino-2000"],
    },
    {
      id: "numbers",
      kicker: x("The numbers", "Shifrat", "Die Zahlen"),
      title: [x("How low", "Sa poshtë", "Wie weit"), x("it flows", "rrjedh", "es nach unten fließt")],
      lead: x(
        "David Mayer and colleagues asked whether ethical leadership at the top reaches the people who do the work, or stops at the level below (2009).",
        "David Mayer dhe kolegët pyetën nëse drejtimi etik në majë arrin te njerëzit që e bëjnë punën, apo ndalet një nivel më poshtë (2009).",
        "David Mayer und Kollegen fragten, ob ethische Führung an der Spitze die Menschen erreicht, die die Arbeit machen, oder eine Ebene tiefer endet (2009)."),
      blocks: [
        { type: "figures", compact: true, items: [
          { n: "904", t: x("employees surveyed", "punonjës të anketuar", "befragte Beschäftigte") },
          { n: "195", t: x("managers, in 195 departments", "menaxherë, në 195 departamente", "Vorgesetzte, in 195 Abteilungen") },
        ] },
        { type: "chain", label: x("The trickle-down the study tested", "Rrjedha nga lart poshtë që testoi studimi", "Der Fluss nach unten, den die Studie prüfte"), items: [
          { h: x("Top management", "Drejtimi i lartë", "Unternehmensleitung"), p: x("its ethical leadership", "drejtimi i tij etik", "ihre ethische Führung") },
          { h: x("Supervisor", "Shefi i drejtpërdrejtë", "Direkte Vorgesetzte"), p: x("their ethical leadership", "drejtimi i tij etik", "deren ethische Führung") },
          { h: x("The group", "Grupi", "Die Gruppe"), p: x("less deviance, more helping", "më pak devijim, më shumë ndihmë", "weniger Fehlverhalten, mehr Hilfe") },
        ] },
        { type: "p", text: x(
          "Ethical leadership at both levels went with less deviance in the group, such as breaking rules or harming colleagues, and with more voluntary help. The effect of the top ran through the supervisors.",
          "Drejtimi etik në të dy nivelet shkonte me më pak devijim në grup, si shkelja e rregullave ose dëmtimi i kolegëve, dhe me më shumë ndihmë vullnetare. Efekti i majës kalonte përmes shefave.",
          "Ethische Führung auf beiden Ebenen ging mit weniger Fehlverhalten in der Gruppe einher, etwa Regelbrüchen oder Schaden für Kollegen, und mit mehr freiwilliger Hilfe. Die Wirkung der Spitze lief über die Vorgesetzten.") },
        { type: "callout", reading: true, text: x(
          "The front line reads the company's values from the person it reports to.",
          "Vija e parë i lexon vlerat e kompanisë te personi të cilit i raporton.",
          "Die Basis liest die Werte des Unternehmens an der Person ab, der sie berichtet.") },
      ],
      note: x(
        "Survey data at the level of groups: links, not causes. The examples of deviance are ours. We read the abstract and summaries, not the article.",
        "Të dhëna anketash në nivel grupi: lidhje, jo shkaqe. Shembujt e devijimit janë tanët. Lexuam abstraktin dhe përmbledhjet, jo artikullin.",
        "Umfragedaten auf Gruppenebene: Zusammenhänge, keine Ursachen. Die Beispiele für Fehlverhalten sind unsere. Gelesen haben wir Abstract und Zusammenfassungen, nicht den Artikel."),
      source: ["ethlead-mayer-2009"],
    },
    {
      id: "model", more: "leading-people-without-losing-the-person",
      kicker: x("The model", "Modeli", "Das Modell"),
      title: [x("Four", "Katër", "Vier"), x("reputations", "reputacione", "Rufe")],
      lead: x(
        "Treviño and her co-authors set the ethical leader against three alternatives: the unethical leader, the hypocritical leader, who in their words talks the talk but doesn't walk the walk, and the ethically neutral leader.",
        "Treviño dhe bashkautorët e vënë drejtuesin etik përballë tri alternativave: drejtuesit joetik, drejtuesit hipokrit, i cili sipas tyre flet bukur, por nuk vepron njësoj, dhe drejtuesit etikisht neutral.",
        "Treviño und ihre Mitautoren stellen der ethischen Führungskraft drei Alternativen gegenüber: die unethische, die heuchlerische, die in ihren Worten Wasser predigt und Wein trinkt, und die ethisch neutrale."),
      blocks: [
        { type: "matrix", y: x("Moral manager", "Menaxheri moral", "Moralischer Manager"), x: x("Moral person", "Njeriu moral", "Moralische Person"), cells: [
          { h: x("Hypocritical", "Hipokrit", "Heuchlerisch"), tone: "red", where: x("strong manager · weak person", "menaxher i fortë · njeri i dobët", "Manager stark · Person schwach"), p: x("Speaks of values that their own conduct does not follow.", "Flet për vlera që sjellja e vet nuk i ndjek.", "Spricht von Werten, denen das eigene Handeln nicht folgt.") },
          { h: x("Ethical", "Etik", "Ethisch"), tone: "blue", where: x("strong manager · strong person", "menaxher i fortë · njeri i fortë", "Manager stark · Person stark"), p: x("Lives the values and makes them part of how the team is led.", "I jeton vlerat dhe i bën pjesë të mënyrës si drejtohet ekipi.", "Lebt die Werte und macht sie zum Teil der Führung.") },
          { h: x("Unethical", "Joetik", "Unethisch"), tone: "red", where: x("weak manager · weak person", "menaxher i dobët · njeri i dobët", "Manager schwach · Person schwach"), p: x("Seen to act wrongly, and leaves ethics out of the team.", "Shihet se vepron gabim, dhe etikën e lë jashtë ekipit.", "Handelt erkennbar falsch und lässt Ethik aus dem Team heraus.") },
          { h: x("Ethically neutral", "Etikisht neutral", "Ethisch neutral"), tone: "dim", where: x("weak manager · person unclear", "menaxher i dobët · njeri i paqartë", "Manager schwach · Person unklar"), p: x("May be decent, but ethics is not on the agenda, so employees cannot tell.", "Mund të jetë i ndershëm, por etika s'është në rend dite, ndaj punonjësit s'e dinë.", "Mag anständig sein, doch Ethik steht nicht auf der Agenda, also weiß es keiner.") },
        ] },
        { type: "callout", reading: true, text: x(
          "Silence is not neutral for long. Where nobody talks about how results are reached, the number is heard as the only rule.",
          "Heshtja nuk mbetet neutrale për shumë kohë. Aty ku askush nuk flet për mënyrën si arrihen rezultatet, shifra dëgjohet si i vetmi rregull.",
          "Schweigen bleibt nicht lange neutral. Wo niemand darüber spricht, wie Ergebnisse zustande kommen, gilt die Zahl als einzige Regel.") },
      ],
      note: x(
        "The four types follow the article's abstract and summaries; placing them on two axes and the short texts in the cells are the editors'.",
        "Katër llojet ndjekin abstraktin e artikullit dhe përmbledhjet; vendosja e tyre në dy akse dhe tekstet e shkurtra në kuti janë të redaksisë.",
        "Die vier Typen folgen dem Abstract und Zusammenfassungen; die Anordnung auf zwei Achsen und die kurzen Texte in den Feldern stammen von der Redaktion."),
      source: ["ethlead-trevino-2000"],
    },
    {
      id: "research",
      kicker: x("What the research says", "Çfarë thotë kërkimi", "Was die Forschung sagt"),
      title: [x("Ethical, or simply", "Etik, apo thjesht", "Ethisch oder einfach"), x("a good leader?", "drejtues i mirë?", "gut geführt?")],
      lead: x(
        "Julia Hoch and colleagues pooled the studies on the newer leadership styles and asked how far each overlaps with transformational leadership, the style that inspires and sets an example (2018).",
        "Julia Hoch dhe kolegët bashkuan studimet për stilet e reja të drejtimit dhe pyetën sa mbivendoset secili me drejtimin transformues, stilin që frymëzon dhe jep shembull (2018).",
        "Julia Hoch und Kollegen fassten die Studien zu neueren Führungsstilen zusammen und fragten, wie stark sich jeder mit transformationaler Führung überschneidet, dem Stil, der inspiriert und vorlebt (2018)."),
      blocks: [
        { type: "hbars", max: 100, source: ["ethlead-hoch-2018"],
          label: x("Correlation with transformational leadership, corrected ρ", "Korrelacioni me drejtimin transformues, ρ e korrigjuar", "Korrelation mit transformationaler Führung, korrigiertes ρ"),
          items: [
            { k: x("Authentic leadership", "Drejtimi autentik", "Authentische Führung"), v: 75, n: dec("0.75") },
            { k: x("Ethical leadership", "Drejtimi etik", "Ethische Führung"), v: 70, n: dec("0.70"), alert: true },
            { k: x("Servant leadership", "Drejtimi shërbyes", "Dienende Führung"), v: 52, n: dec("0.52") },
          ] },
        { type: "p", text: x(
          "For most outcomes ethical leadership added little beyond transformational leadership. Thomas Ng and Daniel Feldman (101 samples, 29,620 people, 2015) found it still predicted performance, helping and counterproductive behaviour, if weakly in some cases; trust in the leader carried the link to attitudes and performance.",
          "Për shumicën e rezultateve, drejtimi etik shtonte pak përtej drejtimit transformues. Thomas Ng dhe Daniel Feldman (101 mostra, 29.620 vetë, 2015) gjetën se prapë parashikonte performancën, ndihmën dhe sjelljen kundërproduktive, në disa raste dobët; besimi te drejtuesi e ndërmjetësonte lidhjen me qëndrimet dhe performancën.",
          "Für die meisten Ergebnisse fügte ethische Führung über transformationale Führung hinaus wenig hinzu. Thomas Ng und Daniel Feldman (101 Stichproben, 29.620 Personen, 2015) fanden, dass sie dennoch Leistung, Hilfe und kontraproduktives Verhalten vorhersagte, teils schwach; Vertrauen in die Führungskraft vermittelte den Bezug zu Einstellungen und Leistung.") },
        { type: "callout", reading: true, text: x(
          "Inspiring and ethical are not the same thing. In the surveys they are mostly found in the same leaders.",
          "Të frymëzosh dhe të jesh etik nuk janë e njëjta gjë. Në anketa, gjenden kryesisht te të njëjtët drejtues.",
          "Inspirierend und ethisch ist nicht dasselbe. In den Umfragen findet man beides meist bei denselben Führungskräften.") },
      ],
      note: x(
        "ρ runs from 0 to 1; Hoch et al. as later reviews report them. Bedi et al. (2016) link it with fair treatment by the leader (see No. 70); links were stronger in the public sector.",
        "ρ shkon nga 0 te 1; Hoch et al. siç i japin rishikimet e mëvonshme. Bedi et al. (2016) e lidhin me trajtimin e drejtë nga drejtuesi (shih Nr. 70); lidhjet ishin më të forta në sektorin publik.",
        "ρ reicht von 0 bis 1; Hoch et al. nach späteren Übersichten. Bedi et al. (2016) verbinden sie mit fairer Behandlung durch die Führungskraft (siehe Nr. 70); im öffentlichen Sektor waren die Zusammenhänge stärker."),
      source: ["ethlead-hoch-2018", "ethlead-ng-feldman-2015", "ethlead-bedi-2016"],
    },
    {
      id: "measure",
      kicker: x("How it is measured", "Si matet", "Wie man es misst"),
      title: [x("Ten questions", "Dhjetë pyetje", "Zehn Fragen"), x("for the team", "për ekipin", "an das Team")],
      lead: x(
        "Michael Brown, Linda Treviño and David Harrison define ethical leadership as acting rightly oneself and promoting it in others through two-way communication, reinforcement and decisions (2005). Over seven studies they built a ten-item scale that employees fill in about their supervisor.",
        "Michael Brown, Linda Treviño dhe David Harrison e përkufizojnë drejtimin etik si të vepruarit drejt vetë dhe nxitjen e kësaj te të tjerët përmes komunikimit në dy drejtime, përforcimit dhe vendimeve (2005). Në shtatë studime ndërtuan një shkallë me dhjetë pyetje që punonjësit e plotësojnë për shefin e tyre.",
        "Michael Brown, Linda Treviño und David Harrison definieren ethische Führung als eigenes richtiges Handeln, das man bei anderen fördert, durch Kommunikation in beide Richtungen, Verstärkung und Entscheidungen (2005). In sieben Studien entwickelten sie eine Skala mit zehn Aussagen, die Beschäftigte über ihre Vorgesetzten ausfüllen."),
      blocks: [
        { type: "lists", cols: [
          { h: x("How they act", "Si vepron", "Wie sie handeln"), items: [
            x("lives ethically in private too", "jeton në mënyrë etike edhe privatisht", "lebt auch privat ethisch"),
            x("can be trusted", "është i besueshëm", "ist vertrauenswürdig"),
            x("decides fairly, in balance", "vendos drejt dhe me ekuilibër", "entscheidet fair und ausgewogen"),
            x("has employees' interests in mind", "ka parasysh të mirën e punonjësve", "hat das Wohl der Leute im Blick"),
            x("listens to employees", "i dëgjon punonjësit", "hört den Leuten zu"),
          ] },
          { h: x("What they promote", "Çfarë nxit", "Was sie fördern"), accent: true, items: [
            x("talks about ethics and values", "flet për etikën dhe vlerat", "spricht über Ethik und Werte"),
            x("sets an example of the right way", "jep shembullin e rrugës së drejtë", "lebt den richtigen Weg vor"),
            x("judges success by how it was reached", "e mat suksesin me mënyrën si u arrit", "misst Erfolg auch am Weg dorthin"),
            x("asks: what is the right thing to do?", "pyet: çfarë është e drejtë të bëjmë?", "fragt: Was ist das Richtige?"),
            x("disciplines breaches of ethics", "ndëshkon shkeljet e etikës", "ahndet Verstöße gegen Ethik"),
          ] },
        ] },
        { type: "p", text: x(
          "The ten items formed a single factor. In the original studies the scale predicted job satisfaction, dedication and willingness to report problems to management.",
          "Dhjetë pyetjet formuan një faktor të vetëm. Në studimet origjinale, shkalla parashikonte kënaqësinë në punë, përkushtimin dhe gatishmërinë për t'ia raportuar problemet drejtimit.",
          "Die zehn Aussagen bildeten einen einzigen Faktor. In den Originalstudien sagte die Skala Arbeitszufriedenheit, Einsatz und die Bereitschaft voraus, Probleme der Leitung zu melden.") },
        { type: "callout", reading: true, text: x(
          "A boss can score well in the first column and stay silent in the second. That is the neutral leader of page 5.",
          "Një shef mund të marrë pikë të mira në kolonën e parë dhe të heshtë te e dyta. Ky është drejtuesi neutral i faqes 5.",
          "Eine Führungskraft kann in der ersten Spalte gut abschneiden und in der zweiten schweigen. Das ist die neutrale Führung von Seite 5.") },
      ],
      note: x(
        "Items shortened and translated by us, from later studies that reproduce them; the two columns follow the two parts of the definition and are the editors' sorting.",
        "Pyetjet të shkurtuara dhe të përkthyera nga ne, sipas studimeve të mëvonshme që i riprodhojnë; dy kolonat ndjekin dy pjesët e përkufizimit dhe janë ndarje e redaksisë.",
        "Aussagen von uns gekürzt und übersetzt, nach späteren Studien, die sie wiedergeben; die zwei Spalten folgen den zwei Teilen der Definition und sind eine Einteilung der Redaktion."),
      source: ["ethlead-brown-2005"],
    },
    {
      id: "tool", tool: "/tools/kpi-diagnostic/",
      kicker: x("Tool of the issue", "Mjeti i numrit", "Werkzeug der Ausgabe"),
      title: [x("The right-way", "Karta e rrugës", "Die Karte für den"), x("card", "së drejtë", "richtigen Weg")],
      lead: x(
        "One card per decision that tests the standard: a target under pressure, a shortcut, a complaint. Before pushing harder on a number, check how it is being reached.",
        "Një kartë për çdo vendim që e vë standardin në provë: një objektiv nën presion, një rrugë e shkurtër, një ankesë. Para se të shtysh më fort një shifër, kontrollo si po arrihet.",
        "Eine Karte pro Entscheidung, die den Standard prüft: ein Ziel unter Druck, eine Abkürzung, eine Beschwerde. Bevor man stärker auf eine Zahl drückt, prüfen, wie sie erreicht wird."),
      blocks: [
        { type: "form", items: [
          { h: x("The decision", "Vendimi", "Die Entscheidung"), hint: x("what it is, and who it affects", "çfarë është, dhe kë prek", "worum es geht, und wen sie betrifft") },
          { h: x("The right thing to do", "Çfarë është e drejtë", "Das Richtige"), hint: x("the question asked aloud, and the answer", "pyetja e bërë me zë, dhe përgjigjja", "die Frage laut gestellt, und die Antwort") },
          { h: x("How the result is reached", "Si arrihet rezultati", "Wie das Ergebnis entsteht"), hint: x("what would make the wrong way faster", "çfarë do ta bënte rrugën e gabuar më të shpejtë", "was den falschen Weg schneller machen würde") },
          { h: x("Who was heard", "Kush u dëgjua", "Wer gehört wurde"), hint: x("the people who do the work, before deciding", "njerëzit që e bëjnë punën, para vendimit", "die Leute, die die Arbeit machen, vorher") },
          { h: x("What the team was told", "Çfarë iu tha ekipit", "Was das Team erfuhr"), hint: x("the standard and the reason, in one sentence", "standardi dhe arsyeja, në një fjali", "Standard und Grund, in einem Satz") },
          { h: x("What was rewarded or corrected", "Çfarë u shpërblye ose u korrigjua", "Was belohnt oder korrigiert wurde"), hint: x("and whether the same would hold for anyone", "dhe nëse do të vlente njësoj për këdo", "und ob es für jeden genauso gälte") },
        ] },
      ],
      note: x(
        "A practice proposed by the editors, after the moral manager pillar of Treviño et al. (2000) and the items of the scale by Brown et al. (2005).",
        "Praktikë e propozuar nga redaksia, sipas shtyllës së menaxherit moral te Treviño et al. (2000) dhe pyetjeve të shkallës së Brown-it et al. (2005).",
        "Eine Praxis, die die Redaktion vorschlägt, nach der Säule des moralischen Managers bei Treviño et al. (2000) und den Aussagen der Skala von Brown et al. (2005)."),
      source: ["ethlead-trevino-2000", "ethlead-brown-2005"],
    },
    { id: "sources", type: "sources" },
    { id: "back", type: "back" },
  ],
};
