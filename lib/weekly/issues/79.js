// Management Review, No. 79: The price of incivility. Block: People.
// Facts and their sources: docs/revista/management-review-nr-79.md. All six sources were read in full; the pencils
// are Study 1 of Porath & Erez (2007).
import { x, pc } from "../common.js";

// A decimal written for each language: "89.8", "89,8", "89,8".
const dec = (s) => x(s, s.replace(".", ","), s.replace(".", ","));

export default {
  number: 79,
  block: "people",
  date: x("November 2026", "Nëntor 2026", "November 2026"),
  theme: [x("The price", "Çmimi", "Der Preis"), x("of incivility", "i mosrespektit", "der Unhöflichkeit")],
  sub: x(
    "Rudeness that is small but not harmless, what it costs those on the receiving end, the spiral it can start, an experiment with dropped pencils, customers who watch, how it is measured, and a card for one incident.",
    "Vrazhdësia e vogël që nuk është e padëmshme, çfarë u kushton atyre që e pësojnë, spiralja që mund të nisë, një eksperiment me lapsa të rënë, klientët që shohin, si matet, dhe një kartë për një rast.",
    "Kleine Unhöflichkeit, die nicht harmlos ist, was sie Betroffene kostet, die Spirale, die sie auslösen kann, ein Experiment mit fallenden Stiften, Kunden als Zeugen, wie man sie misst, und eine Karte."),
  seo: x(
    "The price of incivility: what rudeness at work costs, the incivility spiral, rudeness and helpfulness in experiments, customers who watch, a scale and a card.",
    "Çmimi i mosrespektit në punë: çfarë kushton vrazhdësia, spiralja, eksperimentet për performancën dhe ndihmën, klientët që shohin, një shkallë dhe një kartë.",
    "Der Preis der Unhöflichkeit: was Respektlosigkeit kostet, die Spirale, Experimente zu Leistung und Hilfsbereitschaft, Kunden als Zeugen, Skala und Karte."),
  feature: x(
    "Issue 79 starts with what researchers mean by incivility, rudeness of low intensity with no clear intent to harm, follows a poll of 800 managers and employees in which those treated rudely held back effort and commitment, traces how one rude remark can spiral, shows in experiments how rudeness lowers performance and helpfulness and how customers who merely watch it judge the whole company, sets out how incivility is measured, and ends with a card for one incident.",
    "Numri 79 nis me atë që studiuesit quajnë mosrespekt në punë, vrazhdësi me intensitet të ulët pa qëllim të qartë për të dëmtuar, ndjek një sondazh me 800 menaxherë dhe punonjës ku ata që u trajtuan me vrazhdësi mbajtën prapa përpjekjen dhe përkushtimin, tregon si një fjalë e vrazhdë mund të kthehet në spirale, shfaq në eksperimente si vrazhdësia ul performancën dhe gatishmërinë për të ndihmuar dhe si klientët që thjesht e shohin gjykojnë gjithë kompaninë, shpjegon si matet, dhe mbyllet me një kartë për një rast.",
    "Ausgabe 79 beginnt damit, was die Forschung unter Unhöflichkeit am Arbeitsplatz versteht, Respektlosigkeit geringer Intensität ohne klare Schädigungsabsicht, folgt einer Umfrage unter 800 Führungskräften und Beschäftigten, in der unhöflich Behandelte Einsatz und Bindung zurücknahmen, zeigt, wie eine grobe Bemerkung zur Spirale werden kann, wie Unhöflichkeit in Experimenten Leistung und Hilfsbereitschaft senkt und wie Kunden, die sie nur beobachten, das ganze Unternehmen beurteilen, erklärt, wie man sie misst, und endet mit einer Karte für einen Vorfall."),
  figure: { n: pc(12), by: "Porath & Pearson, 2013", t: x(
    "of those treated rudely at work said they had left their job because of it.",
    "e atyre që u trajtuan me vrazhdësi në punë thanë se e lanë punën për shkak të saj.",
    "der unhöflich Behandelten gaben an, deswegen ihre Stelle verlassen zu haben.") },
  teasers: [
    { page: "story", kicker: x("Cover story", "Tema kryesore", "Titelthema"),
      title: x("Small, not harmless", "E vogël, jo e padëmshme", "Klein, nicht harmlos") },
    { page: "numbers", kicker: x("The numbers", "Shifrat", "Die Zahlen"),
      title: x("What rudeness costs", "Çfarë kushton vrazhdësia", "Was Unhöflichkeit kostet") },
    { page: "tool", kicker: x("Tool of the issue", "Mjeti i numrit", "Werkzeug der Ausgabe"),
      title: x("The incident card", "Karta e rastit", "Die Karte für einen Vorfall") },
  ],
  sources: ["incivil-andersson-pearson-1999", "incivil-porath-pearson-2013", "incivil-schilpzand-2016", "incivil-porath-erez-2007", "incivil-porath-macinnis-folkes-2010", "incivil-cortina-2001"],
  pages: [
    { id: "cover", type: "cover" },
    {
      id: "intro", type: "intro",
      why: x(
        "Most rudeness at work is not shouting or bullying. It is a curt reply, a question ignored, a remark in front of others. Each one looks too small to matter. This issue counts what it costs and asks what a manager can do about it.",
        "Shumica e vrazhdësisë në punë nuk është britmë apo ngacmim. Është një përgjigje e prerë, një pyetje e injoruar, një vërejtje para të tjerëve. Secila duket shumë e vogël për të pasur rëndësi. Ky numër llogarit sa kushton dhe pyet çfarë mund të bëjë një menaxher.",
        "Die meiste Unhöflichkeit bei der Arbeit ist kein Brüllen und kein Mobbing. Es ist eine knappe Antwort, eine überhörte Frage, eine Bemerkung vor anderen. Jede wirkt zu klein, um zu zählen. Diese Ausgabe rechnet nach, was sie kostet, und fragt, was Führung tun kann."),
      body: x(
        "Christine Porath and Christine Pearson polled 800 managers and employees in 17 industries: of those treated rudely, 48% cut their effort and 12% left their job. Lynne Andersson and Pearson describe how one rude act can spiral into aggression. In experiments, people treated rudely did worse and helped less, and customers who watched an employee being insulted judged the whole company more harshly. A seven-question scale measures incivility, and a card helps with one incident.",
        "Christine Porath dhe Christine Pearson pyetën 800 menaxherë dhe punonjës në 17 industri: nga ata që u trajtuan me vrazhdësi, 48% e ulën përpjekjen dhe 12% e lanë punën. Lynne Andersson dhe Pearson përshkruajnë si një akt i vrazhdë mund të kthehet në spirale agresioni. Në eksperimente, ata që u trajtuan me vrazhdësi punuan më keq dhe ndihmuan më pak, dhe klientët që panë një punonjës të fyer e gjykuan më ashpër gjithë kompaninë. Një shkallë me shtatë pyetje e mat mosrespektin, dhe një kartë ndihmon për një rast.",
        "Christine Porath und Christine Pearson befragten 800 Führungskräfte und Beschäftigte aus 17 Branchen: Von den unhöflich Behandelten senkten 48 % ihren Einsatz, 12 % kündigten. Lynne Andersson und Pearson beschreiben, wie eine grobe Handlung zur Spirale der Aggression werden kann. In Experimenten leisteten unhöflich Behandelte weniger und halfen seltener, und Kunden, die sahen, wie ein Mitarbeiter beleidigt wurde, urteilten härter über das ganze Unternehmen. Eine Skala mit sieben Fragen misst Unhöflichkeit, eine Karte hilft bei einem Vorfall."),
    },
    {
      id: "story",
      kicker: x("Cover story", "Tema kryesore", "Titelthema"),
      title: [x("Small,", "E vogël,", "Klein,"), x("not harmless", "jo e padëmshme", "nicht harmlos")],
      lead: x(
        "In 1999 Lynne Andersson and Christine Pearson gave everyday rudeness at work a name and a definition. Workplace incivility, they wrote, is",
        "Në 1999, Lynne Andersson dhe Christine Pearson i dhanë vrazhdësisë së përditshme në punë një emër dhe një përkufizim. Mosrespekti në punë (incivility), shkruan ato, është",
        "1999 gaben Lynne Andersson und Christine Pearson der alltäglichen Unhöflichkeit bei der Arbeit einen Namen und eine Definition. Unhöflichkeit am Arbeitsplatz (incivility) sei"),
      blocks: [
        { type: "quote", text: x(
          "low-intensity deviant behavior with ambiguous intent to harm the target, in violation of workplace norms for mutual respect.",
          "sjellje devijuese me intensitet të ulët, me qëllim të paqartë për të dëmtuar tjetrin, që shkel normat e respektit të ndërsjellë në punë.",
          "abweichendes Verhalten geringer Intensität mit unklarer Absicht, das Gegenüber zu schädigen, das gegen die Normen gegenseitigen Respekts verstößt.") },
        { type: "figures", compact: true, items: [
          { n: pc(98), t: x("of the workers in Porath and Pearson's polls had experienced it", "e punonjësve në sondazhet e Porath-it dhe Pearson-it e kishin përjetuar", "der Beschäftigten in den Umfragen von Porath und Pearson hatten sie erlebt") },
          { n: x("1 in 4", "1 nga 4", "1 von 4"), t: x("said in 1998 they were treated rudely at least once a week", "thoshte në 1998 se trajtohej me vrazhdësi të paktën një herë në javë", "gab 1998 an, mindestens einmal pro Woche unhöflich behandelt zu werden") },
          { n: x("1 in 2", "1 nga 2", "1 von 2"), t: x("said the same in 2011", "thoshte të njëjtën gjë në 2011", "sagte dasselbe im Jahr 2011") },
        ] },
        { type: "callout", reading: true, text: x(
          "Because each act is small, nobody reports it. Because nobody reports it, nobody counts what it costs.",
          "Meqë çdo akt është i vogël, askush nuk e raporton. Meqë askush nuk e raporton, askush nuk e numëron sa kushton.",
          "Weil jede Handlung klein ist, meldet sie niemand. Weil sie niemand meldet, rechnet niemand nach, was sie kostet.") },
      ],
      note: x(
        "The unclear intent sets incivility apart from aggression.",
        "Qëllimi i paqartë e ndan mosrespektin nga agresioni.",
        "Die unklare Absicht trennt Unhöflichkeit von Aggression."),
      source: ["incivil-andersson-pearson-1999", "incivil-porath-pearson-2013"],
    },
    {
      id: "numbers",
      kicker: x("The numbers", "Shifrat", "Die Zahlen"),
      title: [x("What rudeness", "Çfarë kushton", "Was Unhöflichkeit"), x("costs", "vrazhdësia", "kostet")],
      lead: x(
        "Porath and Pearson polled 800 managers and employees in 17 industries and asked those who had been treated rudely at work what happened next.",
        "Porath dhe Pearson pyetën 800 menaxherë dhe punonjës në 17 industri, dhe ata që ishin trajtuar me vrazhdësi në punë i pyetën çfarë ndodhi më pas.",
        "Porath und Pearson befragten 800 Führungskräfte und Beschäftigte aus 17 Branchen und fragten die unhöflich Behandelten, was danach geschah."),
      blocks: [
        { type: "hbars", max: 100, source: ["incivil-porath-pearson-2013"],
          label: x("Of those treated rudely, the share who said they…", "Nga ata që u trajtuan me vrazhdësi, pjesa që tha se…", "Anteil der unhöflich Behandelten, die angaben …"),
          items: [
            { k: x("lost work time worrying about it", "humbën kohë pune duke u shqetësuar", "Arbeitszeit mit Grübeln verloren"), v: 80, n: pc(80) },
            { k: x("felt their commitment decline", "u ul përkushtimi ndaj organizatës", "weniger Bindung an die Firma hatten"), v: 78, n: pc(78) },
            { k: x("felt their performance decline", "u ul performanca", "schlechter leisteten"), v: 66, n: pc(66) },
            { k: x("lost time avoiding the offender", "humbën kohë duke shmangur fajtorin", "Zeit mit Meiden des Täters verloren"), v: 63, n: pc(63) },
            { k: x("cut their work effort on purpose", "e ulën përpjekjen me qëllim", "absichtlich weniger Einsatz zeigten"), v: 48, n: pc(48), alert: true },
          ] },
        { type: "p", text: x(
          "47% cut their time at work on purpose and 38% the quality of their work. A quarter admitted taking their frustration out on customers, and 12% said they left their job because of the way they were treated.",
          "47% e ulën me qëllim kohën në punë dhe 38% cilësinë e punës. Një e katërta pranuan se e shfrynin mërzinë te klientët, dhe 12% thanë se e lanë punën për shkak të mënyrës si u trajtuan.",
          "47 % verkürzten absichtlich ihre Arbeitszeit, 38 % senkten die Qualität ihrer Arbeit. Ein Viertel gab zu, den Frust an Kunden ausgelassen zu haben, und 12 % kündigten wegen der Behandlung.") },
        { type: "callout", reading: true, text: x(
          "Most of the bill never shows up as a cost: effort held back, hours spent brooding, customers served worse.",
          "Pjesa më e madhe e faturës nuk del kurrë si kosto: përpjekje e mbajtur prapa, orë të humbura në mendime, klientë të shërbyer më keq.",
          "Der größte Teil der Rechnung erscheint nie als Kosten: zurückgehaltener Einsatz, Stunden des Grübelns, schlechter bediente Kunden.") },
      ],
      note: x(
        "Self-reports: the poll shows what people say they did, not a measured loss. Figures as Porath and Pearson give them in the article (2013).",
        "Vetëdeklarime: sondazhi tregon çfarë thonë njerëzit se bënë, jo një humbje të matur. Shifrat siç i japin Porath dhe Pearson te artikulli (2013).",
        "Selbstauskünfte: Die Umfrage zeigt, was Menschen nach eigener Aussage taten, keinen gemessenen Verlust. Zahlen, wie Porath und Pearson sie im Artikel nennen (2013)."),
      source: ["incivil-porath-pearson-2013"],
    },
    {
      id: "model", more: "leading-people-without-losing-the-person",
      kicker: x("The model", "Modeli", "Das Modell"),
      title: [x("The incivility", "Spiralja", "Die Spirale"), x("spiral", "e mosrespektit", "der Unhöflichkeit")],
      lead: x(
        "Andersson and Pearson describe how incivility can escalate: a rude act draws a reply in kind, and at a tipping point the exchange turns into open aggression. The spiral can be broken at any step.",
        "Andersson dhe Pearson përshkruajnë si mund të përshkallëzohet mosrespekti: një akt i vrazhdë sjell një përgjigje të njëjtë, dhe në një pikë kthese shkëmbimi bëhet agresion i hapur. Spiralja mund të ndërpritet në çdo hap.",
        "Andersson und Pearson beschreiben, wie Unhöflichkeit eskalieren kann: Eine grobe Handlung zieht eine gleiche Antwort nach sich, und an einem Kipppunkt wird daraus offene Aggression. Die Spirale lässt sich an jeder Stelle brechen."),
      blocks: [
        { type: "chain", label: x("The spiral (Andersson & Pearson, 1999)", "Spiralja (Andersson & Pearson, 1999)", "Die Spirale (Andersson & Pearson, 1999)"), items: [
          { h: x("A rude act", "Një akt i vrazhdë", "Grobe Handlung"), p: x("intent unclear", "qëllim i paqartë", "Absicht unklar") },
          { h: x("A reply in kind", "Përgjigje e njëjtë", "Gleiche Antwort"), p: x("tit for tat", "sy për sy", "wie du mir") },
          { h: x("Tipping point", "Pika e kthesës", "Kipppunkt"), p: x("one side feels its face is threatened", "njëra palë ndien se i cenohet dinjiteti", "eine Seite fürchtet Gesichtsverlust") },
          { h: x("Aggression", "Agresioni", "Aggression"), p: x("intent to harm is now clear", "qëllimi për të dëmtuar tani është i qartë", "Schädigungsabsicht nun klar") },
        ] },
        { type: "cards", cols: 3, items: [
          { h: x("Experienced", "E pësuar", "Erlebt"), p: x("incivility a person suffers", "mosrespekti që pëson dikush", "was man selbst erleidet") },
          { h: x("Witnessed", "E parë", "Beobachtet"), p: x("incivility seen done to others", "mosrespekti që sheh t'u bëhet të tjerëve", "was man bei anderen sieht") },
          { h: x("Instigated", "E nisur", "Ausgeübt"), p: x("incivility a person commits", "mosrespekti që bën vetë dikush", "was man selbst tut") },
        ] },
        { type: "callout", reading: true, text: x(
          "The cheapest moment to stop a spiral is the first remark. By the tipping point it is a conflict (see No. 38).",
          "Momenti më i lirë për ta ndalur spiralen është vërejtja e parë. Te pika e kthesës është tashmë konflikt (shih Nr. 38).",
          "Am billigsten stoppt man die Spirale bei der ersten Bemerkung. Am Kipppunkt ist es schon ein Konflikt (siehe Nr. 38).") },
      ],
      note: x(
        "Ways out named by the authors: ignoring the act, not retaliating, forgiving. Witnesses can start secondary spirals. The three perspectives organise the review by Schilpzand, De Pater and Erez (2016).",
        "Daljet që përmendin autoret: ta injorosh aktin, të mos kundërpërgjigjesh, të falësh. Dëshmitarët mund të nisin spirale dytësore. Tri këndvështrimet strukturojnë rishikimin e Schilpzand, De Pater dhe Erez (2016).",
        "Auswege nach den Autorinnen: die Handlung übergehen, nicht zurückschlagen, verzeihen. Zeugen können Folgespiralen auslösen. Die drei Blickwinkel ordnen den Überblick von Schilpzand, De Pater und Erez (2016)."),
      source: ["incivil-andersson-pearson-1999", "incivil-schilpzand-2016"],
    },
    {
      id: "research",
      kicker: x("What the research says", "Çfarë thotë kërkimi", "Was die Forschung sagt"),
      title: [x("Rudeness", "Vrazhdësia", "Unhöflichkeit"), x("in the lab", "në laborator", "im Labor")],
      lead: x(
        "Christine Porath and Amir Erez ran three experiments. In the first, 98 students saw a latecomer turned away; the experimenter then belittled students at their university. Later the experimenter knocked over a jar of pencils.",
        "Christine Porath dhe Amir Erez bënë tri eksperimente. Në të parin, 98 studentë panë një të vonuar që u kthye mbrapsht; pastaj eksperimentuesi i nënçmoi studentët e universitetit të tyre. Më vonë rrëzoi një kavanoz me lapsa.",
        "Christine Porath und Amir Erez führten drei Experimente durch. Im ersten sahen 98 Studierende, wie ein Nachzügler abgewiesen wurde; dann machte der Versuchsleiter die Studierenden ihrer Universität herunter. Später warf er ein Glas Stifte um."),
      blocks: [
        { type: "columns", max: 100, height: 100, source: ["incivil-porath-erez-2007"],
          label: x("Helped pick up the pencils, Study 1 (2007)", "Ndihmuan të mblidheshin lapsat, studimi 1 (2007)", "Halfen, die Stifte aufzuheben, Studie 1 (2007)"),
          items: [
            { k: x("Neutral", "Neutral", "Neutral"), v: 89.8, n: x("89.8%", "89,8%", "89,8 %") },
            { k: x("After rudeness", "Pas vrazhdësisë", "Nach Unhöflichkeit"), v: 35.5, n: x("35.5%", "35,5%", "35,5 %"), alert: true },
          ] },
        { type: "p", text: x(
          "Rudeness lowered performance on routine and creative tasks, whether it came from the experimenter, a stranger or was only imagined. In four studies by Porath, Debbie MacInnis and Valerie Folkes, customers who saw one employee call another an “idiot” judged the whole company worse, even when the employee had served badly.",
          "Vrazhdësia e uli performancën në detyra rutinë dhe krijuese, qoftë kur vinte nga eksperimentuesi, nga një i panjohur, apo ishte vetëm e imagjinuar. Në katër studime të Porath-it, Debbie MacInnis dhe Valerie Folkes, klientët që panë një punonjës ta quante një tjetër “idiot” e gjykuan më keq gjithë kompaninë, edhe kur punonjësi kishte shërbyer keq.",
          "Unhöflichkeit senkte die Leistung bei Routine- und kreativen Aufgaben, ob vom Versuchsleiter, von einem Fremden oder nur vorgestellt. In vier Studien von Porath, Debbie MacInnis und Valerie Folkes urteilten Kunden, die hörten, wie ein Mitarbeiter einen anderen „Idiot“ nannte, schlechter über die ganze Firma, selbst wenn dieser schlecht bedient hatte.") },
        { type: "callout", reading: true, text: x(
          "Rudeness is never private. It costs the attention of the one hit and the trust of whoever is watching.",
          "Vrazhdësia nuk është kurrë private. I kushton vëmendjen atij që goditet dhe besimin kujtdo që sheh.",
          "Unhöflichkeit ist nie privat. Sie kostet die Aufmerksamkeit des Getroffenen und das Vertrauen aller, die zusehen.") },
      ],
      note: x(
        "Short laboratory sessions with students: they show a cause, not what happens over years at work. Porath and Erez trace the effect to disrupted thinking.",
        "Seanca të shkurtra laboratori me studentë: tregojnë një shkak, jo çfarë ndodh gjatë viteve në punë. Porath dhe Erez e lidhin efektin me mendimin e çrregulluar.",
        "Kurze Laborsitzungen mit Studierenden: Sie zeigen eine Ursache, nicht was über Jahre im Betrieb geschieht. Porath und Erez führen den Effekt auf gestörtes Denken zurück."),
      source: ["incivil-porath-erez-2007", "incivil-porath-macinnis-folkes-2010"],
    },
    {
      id: "measure",
      kicker: x("How it is measured", "Si matet", "Wie man es misst"),
      title: [x("Seven questions,", "Shtatë pyetje,", "Sieben Fragen,"), x("five years", "pesë vjet", "fünf Jahre")],
      lead: x(
        "Lilia Cortina and colleagues built the Workplace Incivility Scale: seven questions on how often superiors or co-workers had treated you in certain ways over five years. Of 1,180 public-sector employees, 71% reported some incivility.",
        "Lilia Cortina dhe kolegët ndërtuan Workplace Incivility Scale: shtatë pyetje për sa shpesh eprorët ose kolegët të kishin trajtuar në mënyra të caktuara gjatë pesë viteve. Nga 1.180 punonjës të sektorit publik, 71% raportuan njëfarë mosrespekti.",
        "Lilia Cortina und Kollegen entwickelten die Workplace Incivility Scale: sieben Fragen, wie oft Vorgesetzte oder Kollegen einen in fünf Jahren auf bestimmte Weise behandelt hatten. Von 1.180 Beschäftigten im öffentlichen Dienst berichteten 71 % von Unhöflichkeit."),
      blocks: [
        { type: "cards", cols: 2, items: [
          { h: x("Condescension", "Përbuzja", "Herablassung"), p: x("put you down or talked down to you", "të ulën ose të folën nga lart", "einen heruntergemacht oder von oben herab behandelt") },
          { h: x("Not listening", "Mosdëgjimi", "Nicht zuhören"), p: x("paid little attention to what you said or thought", "i kushtuan pak vëmendje asaj që the ose mendoje", "dem, was man sagte oder dachte, kaum Beachtung geschenkt") },
          { h: x("Doubt", "Dyshimi", "Zweifel"), p: x("doubted your judgment where you are responsible", "dyshuan në gjykimin tënd aty ku përgjigjesh ti", "das Urteil angezweifelt, wo man selbst zuständig ist") },
          { h: x("Remarks and exclusion", "Fjalët dhe përjashtimi", "Bemerkungen, Ausschluss"), p: x("demeaning remarks, unprofessional address, being left out, unwanted personal talk", "fjalë poshtëruese, ton joprofesional, përjashtim, biseda personale të padëshiruara", "abwertende Bemerkungen, unprofessionelle Ansprache, Ausschluss, unerwünschte private Themen") },
        ] },
        { type: "p", text: x(
          "Women reported incivility more often than men, but both suffered alike in job satisfaction, withdrawal from work and how much their career mattered to them. Incivility went with greater psychological distress, but broader indices of psychological and physical health were relatively unaffected.",
          "Gratë raportuan mosrespekt më shpesh se burrat, por të dy grupet u prekën njësoj në kënaqësinë me punën, tërheqjen nga puna dhe sa rëndësi kishte karriera për ta. Mosrespekti shoqërohej me më shumë shqetësim psikologjik, por treguesit më të gjerë të shëndetit psikologjik dhe fizik u prekën relativisht pak.",
          "Frauen berichteten häufiger davon als Männer, doch beide litten gleich bei Arbeitszufriedenheit, Rückzug von der Arbeit und der Bedeutung des Berufs. Unhöflichkeit ging mit mehr psychischer Belastung einher, doch breitere Maße psychischer und körperlicher Gesundheit blieben vergleichsweise unberührt.") },
        { type: "callout", reading: true, text: x(
          "What is counted can be discussed. Asked anonymously, the same few questions make the small acts visible over time.",
          "Ajo që numërohet mund të diskutohet. Të bëra në mënyrë anonime, të njëjtat pak pyetje i bëjnë të dukshme me kohë aktet e vogla.",
          "Was gezählt wird, lässt sich besprechen. Anonym gestellt, machen dieselben Fragen die kleinen Handlungen mit der Zeit sichtbar.") },
      ],
      note: x(
        "The four groups summarise the seven items in our words; the full wording is in Cortina et al. (2001). Self-reports at one point in time.",
        "Katër grupet përmbledhin shtatë pyetjet me fjalët tona; formulimi i plotë është te Cortina et al. (2001). Vetëdeklarime në një moment.",
        "Die vier Gruppen fassen die sieben Fragen mit unseren Worten zusammen; den Wortlaut haben Cortina et al. (2001). Selbstauskünfte zu einem Zeitpunkt."),
      source: ["incivil-cortina-2001"],
    },
    {
      id: "tool", tool: "/tools/five-whys/",
      kicker: x("Tool of the issue", "Mjeti i numrit", "Werkzeug der Ausgabe"),
      title: [x("The incident", "Karta", "Die Karte für"), x("card", "e rastit", "einen Vorfall")],
      lead: x(
        "One card for one rude incident. Write facts, not labels, speak to the person in private and soon, check again two weeks later. If flare-ups keep coming at the same moment, the 5 Whys help find the pressure behind them.",
        "Një kartë për një rast vrazhdësie. Shkruaj fakte, jo etiketa, fol me personin në vetmi dhe shpejt, kontrollo sërish pas dy javësh. Nëse shpërthimet vijnë gjithmonë në të njëjtin moment, fleta 5 Whys ndihmon të gjesh presionin pas tyre.",
        "Eine Karte pro Vorfall. Fakten statt Etiketten, bald unter vier Augen sprechen, nach zwei Wochen prüfen. Kehren Ausbrüche im selben Moment wieder, hilft das Blatt 5 Whys, den Druck dahinter zu finden."),
      blocks: [
        { type: "form", items: [
          { h: x("What happened", "Çfarë ndodhi", "Was geschah"), hint: x("what was said or done, by whom, who saw it; no labels", "çfarë u tha ose u bë, nga kush, kush e pa; pa etiketa", "was gesagt oder getan wurde, von wem, wer es sah; ohne Etiketten") },
          { h: x("Where in the spiral", "Ku në spirale", "Wo in der Spirale"), hint: x("a first act, a reply in kind, or near the tipping point", "akti i parë, përgjigje e njëjtë, apo afër pikës së kthesës", "erste Handlung, gleiche Antwort oder nahe am Kipppunkt") },
          { h: x("The conversation", "Biseda", "Das Gespräch"), hint: x("with whom, when, in private; what changes", "me kë, kur, në vetmi; çfarë ndryshon", "mit wem, wann, unter vier Augen; was sich ändert") },
          { h: x("The pressure behind it", "Presioni pas tij", "Der Druck dahinter"), hint: x("when it recurs: the hour, the handover, the delay", "kur përsëritet: ora, dorëzimi i turnit, vonesa", "wann es wiederkehrt: Uhrzeit, Übergabe, Verspätung") },
          { h: x("The team norm", "Norma e ekipit", "Die Teamnorm"), hint: x("the one behaviour agreed, and who models it first", "sjellja e rënë dakord, dhe kush e jep i pari shembullin", "das vereinbarte Verhalten, und wer es zuerst vorlebt") },
          { h: x("Review date", "Data e rishikimit", "Prüftermin"), hint: x("has it happened again; what the people who saw it noticed", "a ka ndodhur sërish; çfarë vunë re ata që e panë", "ist es wieder passiert; was die Zeugen bemerkt haben") },
        ] },
      ],
      note: x(
        "A practice proposed by the editors, after the spiral of Andersson and Pearson and the advice Porath and Pearson give leaders: model civility, ask for feedback, set norms with the team. The pressure explains, it does not excuse.",
        "Praktikë e propozuar nga redaksia, sipas spirales së Andersson-it dhe Pearson-it dhe këshillave që Porath dhe Pearson u japin drejtuesve: jep shembull respekti, kërko feedback, vendos norma me ekipin. Presioni shpjegon, nuk justifikon.",
        "Praxisvorschlag der Redaktion, nach der Spirale von Andersson und Pearson und dem Rat von Porath und Pearson an Führungskräfte: Respekt vorleben, Feedback einholen, Normen im Team setzen. Druck erklärt, entschuldigt aber nicht."),
      source: ["incivil-andersson-pearson-1999", "incivil-porath-pearson-2013"],
    },
    { id: "sources", type: "sources" },
    { id: "back", type: "back" },
  ],
};
