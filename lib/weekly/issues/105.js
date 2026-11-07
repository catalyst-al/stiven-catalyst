// Management Review, No. 105: Maintenance that matches how things fail, why fixed-interval overhauls often do not
// help and what reliability-centred maintenance changed. Block: Operations. Facts and their sources:
// docs/revista/management-review-nr-105.md. Nowlan & Heap (1978), the report for the US Department of Defense, was
// read in the NTIS scan of AD-A066579 (text recognised page by page, every figure checked on the page image); NASA's
// RCM guide (2008) was read in its chapters 1 to 4, the only ones cited. OEE is No. 48 and FMEA No. 28: not
// repeated here. The site's maintenance planner is the tool of the issue.
import { x, pc } from "../common.js";

// "0.077" in English, "0,077" in Albanian and German.
const dec = (n) => x(n, n.replace(".", ","), n.replace(".", ","));
// "1,193" in English, "1.193" in Albanian and German.
const th = (n) => x(n, n.replace(",", "."), n.replace(",", "."));

export default {
  number: 105,
  block: "operations",
  date: x("November 2026", "Nëntor 2026", "November 2026"),
  theme: [x("Maintenance that fits", "Mirëmbajtja që i përshtatet", "Wartung, die zum"), x("how things fail", "mënyrës si prishen gjërat", "Ausfall passt")],
  sub: x(
    "How airlines learned that overhauls did not control failures, six patterns of failure and the 4% bathtub, three questions and four tasks, what an age limit would cost an engine shop, what “a life of 2,000 hours” can mean, and a card.",
    "Si mësuan linjat ajrore se riparimet e plota nuk i kontrollonin prishjet, gjashtë modele prishjeje dhe vaska me 4%, tri pyetje dhe katër detyra, sa do t'i kushtonte një kufi moshe repartit të motorëve, çfarë mund të thotë “jetë 2.000 orë”, dhe një kartë.",
    "Wie Fluglinien lernten, dass Überholungen Ausfälle nicht steuerten, sechs Ausfallmuster und die Badewanne mit 4 %, drei Fragen und vier Aufgaben, was eine Altersgrenze eine Triebwerkswerkstatt kosten würde, was „2.000 Stunden Lebensdauer“ heißen kann, und eine Karte."),
  seo: x(
    "Reliability-centred maintenance: Nowlan and Heap's six failure patterns, why fixed overhauls often fail, the RCM decision questions, and a card per task.",
    "Mirëmbajtja e përqendruar te besueshmëria: gjashtë modelet e Nowlan dhe Heap, pse riparimet me afat dështojnë, pyetjet e RCM-së dhe një kartë.",
    "Zuverlässigkeitsorientierte Instandhaltung: sechs Ausfallmuster nach Nowlan und Heap, warum feste Überholungen oft scheitern, die RCM-Fragen, eine Karte."),
  feature: x(
    "For decades the rule was simple: overhaul a machine often enough and it will not fail. When United Airlines charted the failure records of its aircraft components, 89% showed no age at which failures piled up, and only 4% followed the bathtub curve. Issue 105 reads the 1978 report by Nowlan and Heap that turned this into reliability-centred maintenance: three questions about the consequences of a failure, four kinds of task, the engine example that shows what an age limit costs, and NASA's guide that carried the method to buildings and plant. A card for each maintenance task closes the issue.",
    "Për dekada rregulli ishte i thjeshtë: riparoje plotësisht një makinë mjaft shpesh dhe nuk prishet. Kur United Airlines hartoi të dhënat e prishjeve të pjesëve të avionëve të saj, 89% nuk treguan asnjë moshë ku prishjet grumbullohen, dhe vetëm 4% ndoqën kurbën e vaskës. Numri 105 lexon raportin e Nowlan-it dhe Heap-it të vitit 1978 që e ktheu këtë në mirëmbajtje të përqendruar te besueshmëria: tri pyetje për pasojat e një prishjeje, katër lloje detyrash, shembullin e motorit që tregon sa kushton një kufi moshe, dhe udhëzuesin e NASA-s që e çoi metodën te ndërtesat dhe impiantet. Një kartë për çdo detyrë mirëmbajtjeje e mbyll numrin.",
    "Jahrzehntelang galt eine einfache Regel: Eine Maschine, die oft genug überholt wird, fällt nicht aus. Als United Airlines die Ausfalldaten seiner Flugzeugkomponenten auswertete, zeigten 89 % kein Alter, in dem sich Ausfälle häuften, und nur 4 % folgten der Badewannenkurve. Ausgabe 105 liest den Bericht von Nowlan und Heap von 1978, der daraus die zuverlässigkeitsorientierte Instandhaltung machte: drei Fragen zu den Folgen eines Ausfalls, vier Arten von Aufgaben, das Triebwerksbeispiel, das zeigt, was eine Altersgrenze kostet, und den Leitfaden der NASA, der die Methode in Gebäude und Anlagen trug. Eine Karte für jede Wartungsaufgabe schließt die Ausgabe."),
  figure: { n: pc(89), by: "Nowlan & Heap, 1978", t: x(
    "of the aircraft components United Airlines analysed had no wearout zone: no age limit could improve them.",
    "e pjesëve të avionëve që analizoi United Airlines nuk kishin zonë konsumimi: asnjë kufi moshe nuk i përmirësonte.",
    "der von United Airlines untersuchten Flugzeugkomponenten hatten keine Verschleißzone: keine Altersgrenze half ihnen.") },
  teasers: [
    { page: "story", kicker: x("Cover story", "Tema kryesore", "Titelthema"),
      title: x("From 339 overhauls to seven", "Nga 339 riparime në shtatë", "Von 339 Überholungen auf sieben") },
    { page: "numbers", kicker: x("The numbers", "Shifrat", "Die Zahlen"),
      title: x("Six patterns, one bathtub", "Gjashtë modele, një vaskë", "Sechs Muster, eine Badewanne") },
    { page: "tool", kicker: x("Tool of the issue", "Mjeti i numrit", "Werkzeug der Ausgabe"),
      title: x("A card for each task", "Një kartë për çdo detyrë", "Eine Karte für jede Aufgabe") },
  ],
  sources: ["rcm-nowlan-heap-1978", "rcm-nasa-2008"],
  pages: [
    { id: "cover", type: "cover" },
    {
      id: "intro", type: "intro",
      why: x(
        "Most maintenance plans still say: every so many hours or months, take it apart, renew it, put it back. It feels like care. Airlines tested that belief against their own failure data fifty years ago and found it held for a few items only. This issue asks which failures a fixed interval prevents, which it does not, and what to do instead.",
        "Shumica e planeve të mirëmbajtjes thonë ende: çdo kaq orë ose muaj, çmontoje, rinovoje, montoje përsëri. Duket si kujdes. Linjat ajrore e provuan këtë besim me të dhënat e veta të prishjeve pesëdhjetë vjet më parë dhe gjetën se vlente vetëm për pak pjesë. Ky numër pyet cilat prishje i parandalon një interval i fiksuar, cilat jo, dhe çfarë të bëhet në vend të tij.",
        "Die meisten Wartungspläne sagen noch immer: alle so und so viele Stunden oder Monate zerlegen, erneuern, wieder einbauen. Das fühlt sich nach Sorgfalt an. Fluglinien prüften diesen Glauben vor fünfzig Jahren an ihren eigenen Ausfalldaten und fanden, dass er nur für wenige Teile galt. Diese Ausgabe fragt, welche Ausfälle ein festes Intervall verhindert, welche nicht und was stattdessen zu tun ist."),
      body: x(
        "Under the old rules the Douglas DC-8 started with 339 items on scheduled overhaul; the DC-10, planned with the new logic, with seven. Of the components United Airlines analysed, only 6% wore out at a clear age, and 4% followed the bathtub. Nowlan and Heap asked three questions about each failure and chose among four tasks. Their engine example shows an overhaul limit filling the shop. NASA's guide adds how to watch a part that is degrading. A card closes the issue.",
        "Me rregullat e vjetra, Douglas DC-8 nisi me 339 pjesë në riparim të plotë me afat; DC-10, i planifikuar me logjikën e re, me shtatë. Nga pjesët që analizoi United Airlines, vetëm 6% konsumoheshin në një moshë të qartë, dhe 4% ndiqnin vaskën. Nowlan dhe Heap bënë tri pyetje për çdo prishje dhe zgjodhën mes katër detyrave. Shembulli i tyre me motorin tregon një kufi riparimi që e mbush repartin. Udhëzuesi i NASA-s shton si ndiqet një pjesë që po degradohet. Një kartë e mbyll numrin.",
        "Nach den alten Regeln begann die Douglas DC-8 mit 339 Teilen auf planmäßiger Überholung, die mit der neuen Logik geplante DC-10 mit sieben. Von den Komponenten, die United Airlines auswertete, verschlissen nur 6 % in einem klaren Alter, 4 % folgten der Badewanne. Nowlan und Heap stellten zu jedem Ausfall drei Fragen und wählten unter vier Aufgaben. Ihr Triebwerksbeispiel zeigt eine Überholungsgrenze, die die Werkstatt füllt. Der Leitfaden der NASA ergänzt, wie man ein Teil beobachtet, das nachlässt. Eine Karte schließt die Ausgabe."),
    },
    {
      id: "story",
      kicker: x("Cover story", "Tema kryesore", "Titelthema"),
      title: [x("From 339 overhauls", "Nga 339 riparime", "Von 339 Überholungen"), x("to seven", "në shtatë", "auf sieben")],
      lead: x(
        "By the late 1950s airline maintenance costs had grown enough to force a new look. In 1960 the US aviation regulator and the airlines formed a task force; its reliability programme of November 1961 stated that reliability and the control of overhaul times “are not necessarily directly associated topics”.",
        "Nga fundi i viteve 1950, kostot e mirëmbajtjes në linjat ajrore ishin rritur aq sa kërkonin një vështrim të ri. Më 1960 rregullatori amerikan i aviacionit dhe linjat ajrore krijuan një grup pune; programi i tij i besueshmërisë, nëntor 1961, shkroi se besueshmëria dhe kontrolli i afateve të riparimit “nuk janë domosdoshmërisht tema të lidhura drejtpërdrejt”.",
        "Ende der 1950er-Jahre waren die Wartungskosten der Fluglinien so gestiegen, dass ein neuer Blick nötig wurde. 1960 bildeten die US-Luftfahrtbehörde und die Fluglinien eine Arbeitsgruppe; ihr Zuverlässigkeitsprogramm vom November 1961 hielt fest, Zuverlässigkeit und die Steuerung der Überholungszeiten seien „nicht notwendigerweise direkt verbundene Themen“."),
      blocks: [
        { type: "columns", height: 120, max: 339, source: ["rcm-nowlan-heap-1978"],
          label: x("Items assigned to scheduled overhaul in the initial maintenance programme", "Pjesët e caktuara për riparim të plotë me afat në programin fillestar të mirëmbajtjes", "Teile mit planmäßiger Überholung im ersten Wartungsprogramm"),
          items: [
            { k: x("DC-8, old rules", "DC-8, rregullat e vjetra", "DC-8, alte Regeln"), v: 339, n: "339" },
            { k: x("DC-10, MSG-2", "DC-10, MSG-2", "DC-10, MSG-2"), v: 7, n: "7", alert: true },
          ] },
        { type: "p", text: x(
          "The turbine engine was among the items taken off fixed overhaul, which cut the spare engines held for shop work by more than half. On the Boeing 747, United Airlines spent 66,000 manhours on major structural inspections to reach a 20,000-hour interval; on the smaller DC-8 the old policies had taken over 4 million.",
          "Motori me turbinë ishte mes pjesëve që dolën nga riparimi me afat, gjë që i uli motorët rezervë për punën në repart me më shumë se gjysmën. Te Boeing 747, United Airlines shpenzoi 66.000 orë pune në inspektimet kryesore të strukturës për të arritur një interval 20.000 orësh; te DC-8, më i vogël, politikat e vjetra kishin marrë mbi 4 milionë.",
          "Das Turbinentriebwerk gehörte zu den Teilen ohne feste Überholung, was die Ersatztriebwerke für die Werkstatt um mehr als die Hälfte senkte. Bei der Boeing 747 brauchte United Airlines 66.000 Arbeitsstunden für große Strukturinspektionen bis zu einem Intervall von 20.000 Stunden; bei der kleineren DC-8 hatten die alten Regeln über 4 Millionen gekostet.") },
        { type: "callout", reading: true, text: x(
          "The overhauls were not too rare or too careless. For most items, the chance of failing simply did not rise with age.",
          "Riparimet nuk ishin shumë të rralla ose të pakujdesshme. Për shumicën e pjesëve, mundësia e prishjes thjesht nuk rritej me moshën.",
          "Die Überholungen waren weder zu selten noch zu nachlässig. Bei den meisten Teilen stieg die Ausfallwahrscheinlichkeit mit dem Alter schlicht nicht.") },
      ],
      note: x(
        "Nowlan & Heap (1978), section 1·1. The authors write that the cuts came with no loss of reliability. Both programmes are airline examples from the report, not a controlled comparison: the DC-10 is a later and different aircraft. The callout paraphrases the report's own explanation.",
        "Nowlan & Heap (1978), seksioni 1·1. Autorët shkruajnë se uljet erdhën pa humbje besueshmërie. Të dy programet janë shembuj të linjave ajrore nga raporti, jo krahasim i kontrolluar: DC-10 është avion më i vonë dhe i ndryshëm. Shënimi i leximit e përmbledh shpjegimin e vetë raportit.",
        "Nowlan & Heap (1978), Abschnitt 1·1. Die Autoren schreiben, die Einsparungen kamen ohne Verlust an Zuverlässigkeit. Beide Programme sind Beispiele aus dem Bericht, kein kontrollierter Vergleich: Die DC-10 ist ein späteres, anderes Flugzeug. Der Lesehinweis gibt die Erklärung des Berichts selbst wieder."),
      source: ["rcm-nowlan-heap-1978"],
    },
    {
      id: "numbers",
      kicker: x("The numbers", "Shifrat", "Die Zahlen"),
      title: [x("Six patterns,", "Gjashtë modele,", "Sechs Muster,"), x("one bathtub", "një vaskë", "eine Badewanne")],
      lead: x(
        "While overhaul intervals were being stretched, United Airlines plotted, for many aircraft components, the chance that a unit which had reached a given age would fail in the next interval. The curves fell into six patterns.",
        "Ndërsa intervalet e riparimit po zgjateshin, United Airlines vizatoi, për shumë pjesë avionësh, mundësinë që një njësi që ka arritur një moshë të caktuar të prishet në intervalin pasues. Kurbat ranë në gjashtë modele.",
        "Während die Überholungsintervalle verlängert wurden, zeichnete United Airlines für viele Flugzeugkomponenten auf, wie wahrscheinlich eine Einheit, die ein bestimmtes Alter erreicht hat, im nächsten Intervall ausfällt. Die Kurven fielen in sechs Muster."),
      blocks: [
        { type: "hbars", max: 70, source: ["rcm-nowlan-heap-1978"],
          label: x("Share of the components analysed, by failure pattern (United Airlines, 1978)", "Pjesa e komponentëve të analizuar, sipas modelit të prishjes (United Airlines, 1978)", "Anteil der untersuchten Komponenten nach Ausfallmuster (United Airlines, 1978)"),
          items: [
            { k: x("A  Bathtub: early failures, then wearout", "A  Vaska: prishje të hershme, pastaj konsumim", "A  Badewanne: Frühausfälle, dann Verschleiß"), v: 4, n: pc(4) },
            { k: x("B  Flat, then wearout at the end", "B  E sheshtë, pastaj konsumim në fund", "B  Flach, am Ende Verschleiß"), v: 2, n: pc(2) },
            { k: x("C  Slowly rising, no wearout age", "C  Rritje e ngadaltë, pa moshë konsumimi", "C  Langsam steigend, ohne Verschleißalter"), v: 5, n: pc(5) },
            { k: x("D  Low when new, then constant", "D  E ulët kur është e re, pastaj konstante", "D  Niedrig, wenn neu, dann konstant"), v: 7, n: pc(7) },
            { k: x("E  Constant at all ages", "E  Konstante në çdo moshë", "E  In jedem Alter konstant"), v: 14, n: pc(14) },
            { k: x("F  Early failures, then constant", "F  Prishje të hershme, pastaj konstante", "F  Frühausfälle, dann konstant"), v: 68, n: pc(68), alert: true },
          ] },
        { type: "p", text: x(
          "Only A and B, 6%, wore out at a clear age, mostly simple items such as tyres, brake pads and compressor blades. Another 5% grew steadily more likely to fail. The other 89% had no wearout zone, so no age limit could improve them.",
          "Vetëm A dhe B, 6%, konsumoheshin në një moshë të qartë, kryesisht pjesë të thjeshta si gomat, ferrotet dhe fletët e kompresorit. Edhe 5% bëheshin gjithnjë më të prirura të prisheshin. 89% e tjera nuk kishin zonë konsumimi, ndaj asnjë kufi moshe nuk i përmirësonte.",
          "Nur A und B, 6 %, verschlissen in einem klaren Alter, meist einfache Teile wie Reifen, Bremsbeläge und Verdichterschaufeln. Bei weiteren 5 % stieg das Risiko stetig. Die übrigen 89 % hatten keine Verschleißzone, keine Altersgrenze half ihnen.") },
        { type: "callout", reading: true, text: x(
          "The most common pattern starts with failures right after installation. For it, the riskiest time is the start, not the end.",
          "Modeli më i shpeshtë nis me prishje menjëherë pas montimit. Për të, koha më e rrezikshme është fillimi, jo fundi.",
          "Das häufigste Muster beginnt mit Ausfällen direkt nach dem Einbau. Bei ihm ist der Anfang die riskanteste Zeit, nicht das Ende.") },
      ],
      note: x(
        "Exhibit 2·13 and section 2·8. Shares of components, not of failures; the report gives neither their number nor the years. NASA's guide (2008) cites a Swedish study (1973) and a US Navy one (1982): with the airline data, 77–92% of failures “random”, not age-related; the Navy found pattern B in 17%.",
        "Ekspozita 2·13 dhe seksioni 2·8. Pjesë të komponentëve, jo të prishjeve; raporti nuk jep as numrin e tyre, as vitet. Udhëzuesi i NASA-s (2008) citon një studim suedez (1973) dhe një të Marinës amerikane (1982): me të dhënat e linjës ajrore, 77–92% e prishjeve “të rastit”, jo të lidhura me moshën; Marina e gjeti modelin B te 17%.",
        "Abbildung 2·13, Abschnitt 2·8. Anteile an Komponenten, nicht an Ausfällen; Anzahl und Jahre nennt der Bericht nicht. Der NASA-Leitfaden (2008) nennt eine schwedische Studie (1973) und eine der US-Marine (1982): mit den Airline-Daten 77–92 % der Ausfälle „zufällig“, nicht altersbedingt; die Marine fand Muster B bei 17 %."),
      source: ["rcm-nowlan-heap-1978", "rcm-nasa-2008"],
    },
    {
      id: "model",
      kicker: x("The model", "Modeli", "Das Modell"),
      title: [x("Three questions,", "Tri pyetje,", "Drei Fragen,"), x("four tasks", "katër detyra", "vier Aufgaben")],
      lead: x(
        "Nowlan and Heap start not from the part but from what its failure does. The decision runs in two steps: first the consequence, which sets what a task must achieve, then the tasks in a fixed order of preference.",
        "Nowlan dhe Heap nuk nisin nga pjesa, por nga ajo që bën prishja e saj. Vendimi ecën në dy hapa: së pari pasoja, që cakton çfarë duhet të arrijë një detyrë, pastaj detyrat sipas një radhe të fiksuar përparësie.",
        "Nowlan und Heap beginnen nicht beim Teil, sondern bei dem, was sein Ausfall bewirkt. Die Entscheidung läuft in zwei Schritten: zuerst die Folge, die festlegt, was eine Aufgabe leisten muss, dann die Aufgaben in fester Rangfolge."),
      blocks: [
        { type: "lists", cols: [
          { h: x("Ask of each failure", "Pyet për çdo prishje", "Zu jedem Ausfall fragen"), items: [
            x("Would the crew notice it? If not, the function is hidden and needs a check.", "A do ta vinte re ekuipazhi? Nëse jo, funksioni është i fshehur dhe do kontroll.", "Würde die Crew ihn bemerken? Wenn nicht, ist die Funktion verdeckt und braucht eine Prüfung."),
            x("Could it harm safety? Then a task must prevent every case, or the design changes.", "A mund të dëmtojë sigurinë? Atëherë detyra duhet të parandalojë çdo rast, ose ndryshon projekti.", "Kann er die Sicherheit gefährden? Dann muss eine Aufgabe jeden Fall verhindern, sonst ändert sich die Konstruktion."),
            x("Does it stop operations? Then a task must cost less than the loss.", "A e ndal punën? Atëherë detyra duhet të kushtojë më pak se humbja.", "Stoppt er den Betrieb? Dann muss die Aufgabe weniger kosten als der Verlust."),
          ] },
          { h: x("Then try, in this order", "Pastaj provo, me këtë radhë", "Dann prüfen, in dieser Reihenfolge"), accent: true, items: [
            x("Inspect for signs of a coming failure", "Inspekto për shenjat e një prishjeje që po vjen", "Auf Anzeichen eines nahenden Ausfalls prüfen"),
            x("Rework at an age limit", "Riparo plotësisht te një kufi moshe", "Bei einer Altersgrenze überholen"),
            x("Discard at a life limit", "Hiqe te një kufi jete", "Bei einer Lebensdauergrenze verwerfen"),
            x("For hidden functions: a check that finds failures", "Për funksionet e fshehura: një kontroll që gjen prishjet", "Für verdeckte Funktionen: eine Prüfung, die Ausfälle findet"),
          ] },
        ] },
        { type: "p", text: x(
          "An inspection works only if a coming failure can be seen, defined as a limit and found in time, like a crack growing at a known rate or a brake pin worn below 0.25 inch. If no task passes, an evident failure without safety risk gets no scheduled task.",
          "Një inspektim funksionon vetëm nëse prishja që po vjen mund të shihet, të përcaktohet si kufi dhe të gjendet në kohë, si një çarje që rritet me shpejtësi të njohur ose një kunj frenash i konsumuar nën 0,25 inç. Nëse asnjë detyrë nuk kalon, një prishje e dukshme pa rrezik sigurie nuk merr detyrë të planifikuar.",
          "Eine Inspektion wirkt nur, wenn sich ein nahender Ausfall erkennen, als Grenze festlegen und rechtzeitig finden lässt, etwa ein Riss mit bekannter Wachstumsrate oder ein Bremsstift unter 0,25 Zoll. Besteht keine Aufgabe die Prüfung, bekommt ein sichtbarer Ausfall ohne Sicherheitsrisiko keine planmäßige Aufgabe.") },
        { type: "callout", reading: true, text: x(
          "“Run to failure” is a decision with a reason written next to it, not a gap in the plan.",
          "“Puno deri në prishje” është vendim me një arsye të shkruar pranë, jo një boshllëk në plan.",
          "„Bis zum Ausfall betreiben“ ist eine Entscheidung mit einer Begründung daneben, keine Lücke im Plan.") },
      ],
      note: x(
        "Exhibits 4·2 and 4·3 and sections 3·1–3·4 of Nowlan & Heap (1978); the wording is the editors'. The brake pin is one of United Airlines' task cards in Exhibit 3·2. NASA's guide (2008) keeps the same logic and names run-to-failure “a conscious decision”. Risk ranking with FMEA is in No. 28.",
        "Ekspozitat 4·2 dhe 4·3 dhe seksionet 3·1–3·4 te Nowlan & Heap (1978); fjalët janë të redaksisë. Kunji i frenave është një nga kartat e detyrave të United Airlines te ekspozita 3·2. Udhëzuesi i NASA-s (2008) mban të njëjtën logjikë dhe e quan punën deri në prishje “vendim të vetëdijshëm”. Renditja e rrezikut me FMEA është te Nr. 28.",
        "Abbildungen 4·2 und 4·3 und Abschnitte 3·1–3·4 bei Nowlan & Heap (1978); die Formulierung stammt von der Redaktion. Der Bremsstift ist eine Arbeitskarte von United Airlines in Abbildung 3·2. Der NASA-Leitfaden (2008) folgt derselben Logik und nennt Betrieb bis zum Ausfall „eine bewusste Entscheidung“. Risikobewertung mit FMEA steht in Nr. 28."),
      source: ["rcm-nowlan-heap-1978", "rcm-nasa-2008"],
    },
    {
      id: "research",
      kicker: x("What the research says", "Çfarë thotë kërkimi", "Was die Forschung sagt"),
      title: [x("What an age limit", "Sa i kushton repartit", "Was eine Altersgrenze"), x("costs the shop", "një kufi moshe", "die Werkstatt kostet")],
      lead: x(
        "The report's worked example is the Pratt & Whitney JT8D-7 engine of United's Boeing 737s, from 58,432 operating hours between May and July 1974. Without an age limit an engine lasted 1,811 hours on average. The authors then computed the shop load under three overhaul limits.",
        "Shembulli i llogaritur i raportit është motori Pratt & Whitney JT8D-7 i Boeing 737-ave të United, nga 58.432 orë pune mes majit dhe korrikut 1974. Pa kufi moshe, një motor zgjaste mesatarisht 1.811 orë. Autorët pastaj llogaritën ngarkesën e repartit me tri kufij riparimi.",
        "Das Rechenbeispiel des Berichts ist das Triebwerk Pratt & Whitney JT8D-7 der Boeing 737 von United, aus 58.432 Betriebsstunden zwischen Mai und Juli 1974. Ohne Altersgrenze hielt ein Triebwerk im Schnitt 1.811 Stunden. Dann berechneten die Autoren die Werkstattlast bei drei Überholungsgrenzen."),
      blocks: [
        { type: "columns", height: 130, max: 1200, source: ["rcm-nowlan-heap-1978"],
          label: x("Engines sent to the shop per 1,000,000 operating hours, failed plus scheduled, by overhaul limit (1978)", "Motorë të dërguar në repart për 1.000.000 orë pune, të prishur plus të planifikuar, sipas kufirit të riparimit (1978)", "Triebwerke in der Werkstatt je 1.000.000 Betriebsstunden, ausgefallen plus geplant, nach Überholungsgrenze (1978)"),
          items: [
            { k: x("1,000 h", "1.000 orë", "1.000 h"), v: 1193.3, n: th("1,193"), alert: true },
            { k: x("2,000 h", "2.000 orë", "2.000 h"), v: 717.9, n: "718" },
            { k: x("3,000 h", "3.000 orë", "3.000 h"), v: 593.5, n: "594" },
            { k: x("No limit", "Pa kufi", "Ohne Grenze"), v: 552.2, n: "552" },
          ] },
        { type: "p", text: x(
          "A limit of 2,000 hours would bring about 135 fewer failures but 166 more engines into the shop. It pays only if a planned overhaul costs less than 45.1% of a failure repair, or if failures bring other losses. For complex items the authors add that overhaul often raises the failure rate, by bringing back the early failures of a fresh unit.",
          "Një kufi 2.000 orësh do të sillte rreth 135 prishje më pak, por 166 motorë më shumë në repart. Ia vlen vetëm nëse një riparim i planifikuar kushton më pak se 45,1% e riparimit të një prishjeje, ose nëse prishjet sjellin humbje të tjera. Për pjesët e ndërlikuara autorët shtojnë se riparimi i plotë shpesh e rrit normën e prishjeve, sepse rikthen prishjet e hershme të një njësie të sapo riparuar.",
          "Eine Grenze von 2.000 Stunden brächte rund 135 Ausfälle weniger, aber 166 Triebwerke mehr in die Werkstatt. Das lohnt sich nur, wenn eine geplante Überholung weniger als 45,1 % einer Ausfallreparatur kostet oder Ausfälle weitere Verluste bringen. Bei komplexen Teilen, so die Autoren, erhöht die Überholung oft die Ausfallrate, weil sie die Frühausfälle einer frischen Einheit zurückbringt.") },
        { type: "callout", reading: true, text: x(
          "An age limit always sends more units to the shop. The question is whether the failures it saves are worth that.",
          "Një kufi moshe çon gjithmonë më shumë njësi në repart. Pyetja është nëse prishjet që kursen e vlejnë këtë.",
          "Eine Altersgrenze schickt immer mehr Einheiten in die Werkstatt. Die Frage ist, ob die eingesparten Ausfälle das wert sind.") },
      ],
      note: x(
        "Exhibit 3·3 and section 3·2; the columns round the report's totals (1,193.3; 717.9; 593.5; 552.2). These are the authors' calculations from one engine's survival curve, not counts of real overhauls. With no limit all 552 are failures; at 1,000 hours 825 of the 1,193 are planned removals.",
        "Ekspozita 3·3 dhe seksioni 3·2; kolonat i rrumbullakojnë shumat e raportit (1.193,3; 717,9; 593,5; 552,2). Janë llogari të autorëve nga kurba e mbijetesës së një motori, jo numërime riparimesh të vërteta. Pa kufi, të 552 janë prishje; te 1.000 orë, 825 nga 1.193 janë heqje të planifikuara.",
        "Abbildung 3·3 und Abschnitt 3·2; die Säulen runden die Summen des Berichts (1.193,3; 717,9; 593,5; 552,2). Es sind Berechnungen der Autoren aus der Überlebenskurve eines Triebwerks, keine gezählten Überholungen. Ohne Grenze sind alle 552 Ausfälle; bei 1.000 Stunden sind 825 der 1.193 geplante Ausbauten."),
      source: ["rcm-nowlan-heap-1978"],
    },
    {
      id: "measure",
      kicker: x("How it is measured", "Si matet", "Wie es gemessen wird"),
      title: [x("What “a life of", "Çfarë do të thotë", "Was „2.000 Stunden"), x("2,000 hours” means", "“jetë 2.000 orë”", "Lebensdauer“ heißt")],
      lead: x(
        "Nowlan and Heap list six things the same sentence can mean: no engine fails before 2,000 hours; no critical failure before then; half fail before; the average failed engine is 2,000 hours old; the risk is constant until then; or one part has a 2,000-hour limit.",
        "Nowlan dhe Heap rendisin gjashtë gjëra që mund të thotë e njëjta fjali: asnjë motor nuk prishet para 2.000 orëve; asnjë prishje kritike para tyre; gjysma prishen më parë; motori mesatar i prishur është 2.000 orë i vjetër; rreziku është konstant deri atëherë; ose një pjesë ka kufi 2.000 orë.",
        "Nowlan und Heap zählen sechs Dinge auf, die derselbe Satz heißen kann: Kein Triebwerk fällt vor 2.000 Stunden aus; kein kritischer Ausfall davor; die Hälfte fällt vorher aus; das ausgefallene Triebwerk ist im Schnitt 2.000 Stunden alt; das Risiko ist bis dahin konstant; oder ein Teil hat eine Grenze von 2.000 Stunden."),
      blocks: [
        { type: "figures", compact: true, items: [
          { n: dec("0.692"), t: x("of the engines reached 1,000 hours", "e motorëve arritën 1.000 orë", "der Triebwerke erreichten 1.000 Stunden") },
          { n: dec("0.053"), t: x("of all engines failed between 1,000 and 1,200", "e të gjithë motorëve u prishën mes 1.000 dhe 1.200", "aller Triebwerke fielen zwischen 1.000 und 1.200 aus") },
          { n: dec("0.077"), t: x("the risk for an engine that reached 1,000 hours", "rreziku për një motor që arriti 1.000 orë", "das Risiko für ein Triebwerk, das 1.000 Stunden erreichte") },
        ] },
        { type: "p", text: x(
          "The last figure is the one that guides maintenance: the chance of failing in the next interval for a unit that has survived so far, .053 divided by .692. Plotted by age, it shows whether failures pile up. A failure rate or an average life does not, and the authors give it a minor role. NASA's guide adds a rule for parts watched for wear: once a reading passes the alert limit, check three to four times as often, for example every three to four weeks instead of quarterly.",
          "Shifra e fundit është ajo që e udhëheq mirëmbajtjen: mundësia e prishjes në intervalin pasues për një njësi që ka mbijetuar deri këtu, 0,053 pjesëtuar me 0,692. E vizatuar sipas moshës, tregon nëse prishjet grumbullohen. Një normë prishjesh ose një jetë mesatare nuk e tregon, dhe autorët i japin rol të vogël. Udhëzuesi i NASA-s shton një rregull për pjesët që ndiqen për konsumim: sapo një lexim kalon kufirin e alarmit, kontrollo tri deri katër herë më shpesh, për shembull çdo tri deri katër javë në vend të çdo tremujori.",
          "Die letzte Zahl leitet die Wartung: die Wahrscheinlichkeit, im nächsten Intervall auszufallen, für eine Einheit, die bis hierher überlebt hat, 0,053 geteilt durch 0,692. Nach Alter aufgetragen zeigt sie, ob sich Ausfälle häufen. Eine Ausfallrate oder eine mittlere Lebensdauer zeigt das nicht, die Autoren geben ihr eine Nebenrolle. Der NASA-Leitfaden ergänzt eine Regel für Teile, die auf Verschleiß beobachtet werden: Sobald ein Messwert die Alarmgrenze überschreitet, drei- bis viermal so oft prüfen, etwa alle drei bis vier Wochen statt vierteljährlich.") },
        { type: "callout", reading: true, text: x(
          "Count failures by the age of the unit since its last overhaul, not only by month. Only then can a curve be drawn.",
          "Numëroji prishjet sipas moshës së njësisë që nga riparimi i fundit, jo vetëm sipas muajit. Vetëm atëherë mund të vizatohet një kurbë.",
          "Zählen Sie Ausfälle nach dem Alter der Einheit seit der letzten Überholung, nicht nur nach Monat. Nur dann lässt sich eine Kurve zeichnen.") },
      ],
      note: x(
        "Section 2·7 and 2·8 of Nowlan & Heap (1978), the JT8D-7 engine; section 4·1 of NASA's guide (2008). The callout is the editors' reading. MTBF in the site's maintenance planner is a failure rate: useful for intervals and costs, silent on which task fits. OEE is in No. 48.",
        "Seksionet 2·7 dhe 2·8 te Nowlan & Heap (1978), motori JT8D-7; seksioni 4·1 i udhëzuesit të NASA-s (2008). Shënimi i leximit është i redaksisë. MTBF te planifikuesi i mirëmbajtjes i faqes është normë prishjesh: e dobishme për intervalet dhe kostot, e heshtur për detyrën që i përshtatet. OEE është te Nr. 48.",
        "Abschnitte 2·7 und 2·8 bei Nowlan & Heap (1978), das Triebwerk JT8D-7; Abschnitt 4·1 des NASA-Leitfadens (2008). Der Lesehinweis stammt von der Redaktion. Die MTBF im Wartungsplaner der Website ist eine Ausfallrate: nützlich für Intervalle und Kosten, stumm zur passenden Aufgabe. OEE steht in Nr. 48."),
      source: ["rcm-nowlan-heap-1978", "rcm-nasa-2008"],
    },
    {
      id: "tool", tool: "/tools/maintenance-planner/",
      kicker: x("Tool of the issue", "Mjeti i numrit", "Werkzeug der Ausgabe"),
      title: [x("A card for", "Një kartë për", "Eine Karte für"), x("each task", "çdo detyrë", "jede Aufgabe")],
      lead: x(
        "One card for each task in the maintenance plan, to say why it is there. The Maintenance Planner keeps the tasks, their intervals and the breakdowns per asset; the card adds the reason, and the date to look at it again.",
        "Një kartë për çdo detyrë në planin e mirëmbajtjes, që të thotë pse është aty. Maintenance Planner i mban detyrat, intervalet dhe prishjet për çdo pajisje; karta shton arsyen, dhe datën kur shihet përsëri.",
        "Eine Karte für jede Aufgabe im Wartungsplan, die sagt, warum sie dort steht. Der Maintenance Planner führt Aufgaben, Intervalle und Störungen je Anlage; die Karte ergänzt den Grund und das Datum, sie neu anzusehen."),
      blocks: [
        { type: "form", items: [
          { h: x("Function and failure", "Funksioni dhe prishja", "Funktion und Ausfall"), hint: x("what it must do, with a limit, and how it fails to", "çfarë duhet të bëjë, me një kufi, dhe si dështon", "was sie leisten muss, mit Grenzwert, und wie sie versagt") },
          { h: x("Would anyone notice?", "A do ta vinte re dikush?", "Würde es jemand bemerken?"), hint: x("if not, it is hidden: plan a check that finds the failure", "nëse jo, është e fshehur: planifiko një kontroll që e gjen", "wenn nicht, ist sie verdeckt: eine Prüfung planen, die den Ausfall findet") },
          { h: x("Consequence", "Pasoja", "Folge"), hint: x("safety, stopped work, or only the repair", "siguria, puna e ndalur, apo vetëm riparimi", "Sicherheit, Stillstand oder nur die Reparatur") },
          { h: x("Warning sign and lead time", "Shenja paralajmëruese dhe koha", "Warnzeichen und Vorlaufzeit"), hint: x("what shows it coming, and how long before it fails", "çfarë e tregon që po vjen, dhe sa kohë para prishjes", "was ihn ankündigt, und wie lange vor dem Ausfall") },
          { h: x("Task and why this interval", "Detyra dhe pse ky interval", "Aufgabe und warum dieses Intervall"), hint: x("inspect, rework, discard, find, or run to failure", "inspekto, riparo, hiq, gjej, apo puno deri në prishje", "prüfen, überholen, verwerfen, finden oder bis zum Ausfall") },
          { h: x("Failures by age, next review", "Prishjet sipas moshës, rishikimi", "Ausfälle nach Alter, nächste Prüfung"), hint: x("hours since last overhaul at each failure; the date to decide again", "orët që nga riparimi i fundit te çdo prishje; data për të vendosur përsëri", "Stunden seit der letzten Überholung je Ausfall; Datum der neuen Entscheidung") },
        ] },
      ],
      note: x(
        "The card is the editors' proposal, built on the decision questions and task criteria of Nowlan & Heap (1978) and on NASA's guide (2008); it is not a tested instrument. Reviewing tasks as failure data arrive is what the report calls age exploration.",
        "Karta është propozim i redaksisë, i ndërtuar mbi pyetjet e vendimit dhe kriteret e detyrave te Nowlan & Heap (1978) dhe mbi udhëzuesin e NASA-s (2008); nuk është instrument i testuar. Rishikimi i detyrave ndërsa vijnë të dhënat e prishjeve është ajo që raporti e quan eksplorim i moshës.",
        "Die Karte ist ein Vorschlag der Redaktion, gestützt auf die Entscheidungsfragen und Aufgabenkriterien bei Nowlan & Heap (1978) und auf den NASA-Leitfaden (2008); sie ist kein geprüftes Instrument. Aufgaben zu überprüfen, sobald Ausfalldaten vorliegen, nennt der Bericht Age Exploration."),
      source: ["rcm-nowlan-heap-1978", "rcm-nasa-2008"],
    },
    { id: "sources", type: "sources" },
    { id: "back", type: "back" },
  ],
};
