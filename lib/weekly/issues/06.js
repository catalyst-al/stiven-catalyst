// Management Review, No. 6: From the best on the team to the manager. Block: Role.
// Facts and their sources: docs/revista/management-review-nr-06.md.
import { x, pc } from "../common.js";

export default {
  number: 6,
  block: "role",
  date: x("October 2026", "Tetor 2026", "Oktober 2026"),
  // Corrections made after publication, shown on the issue's page and its sources page.
  corrections: [
    {
      date: x("13 October 2026", "13 tetor 2026", "13. Oktober 2026"),
      t: x(
        "The study by three economists that tested the Peter Principle with sales data (Benson, Li and Shue) is from 2019, as the sources give it; the text first said 2018.",
        "Studimi i tre ekonomistëve që e provoi Peter Principle me të dhëna shitjesh (Benson, Li dhe Shue) është i vitit 2019, si te burimet; teksti fillimisht shkruante 2018.",
        "Die Studie dreier Ökonomen, die das Peter Principle mit Vertriebsdaten prüfte (Benson, Li und Shue), ist von 2019, wie in den Quellen; der Text nannte zuerst 2018."),
    },
  ],
  theme: [x("From the best on the team", "Nga më i miri në ekip", "Vom Besten im Team"), x("to the manager", "te menaxheri", "zur Führungskraft")],
  sub: x(
    "Why the best people at the job do not become the best managers by themselves, what changes when you cross the line, and how to make the step less risky.",
    "Pse më të mirët në punë nuk bëhen vetvetiu menaxherët më të mirë, çfarë ndryshon kur kalon pragun, dhe si bëhet hapi më pak i rrezikshëm.",
    "Warum die besten Fachkräfte nicht von selbst die besten Führungskräfte werden, was sich beim Schritt über die Schwelle ändert und wie er weniger riskant wird."),
  seo: x(
    "From the best on the team to manager: the Peter Principle in sales data, Gallup 2026 on supervisors, the Leadership Pipeline and a card for the first months.",
    "Nga më i miri në ekip te menaxheri: Parimi i Peter-it në shitje, Gallup 2026 për mbikëqyrësit, Leadership Pipeline dhe një kartë për muajt e parë.",
    "Vom Besten im Team zur Führung: das Peter-Prinzip im Vertrieb, Gallup 2026 zu Vorgesetzten, die Leadership Pipeline und eine Karte für die ersten Monate."),
  feature: x(
    "Issue 6 follows the best person on the team into the manager's chair. The data on promoting top performers come first, then the shift in skills, time and values. Five expectations close the issue, none of which survives the first year.",
    "Numri 6 e ndjek personin më të mirë të ekipit deri në karrigen e menaxherit. Së pari vijnë të dhënat për promovimin e më të mirëve, pastaj ndryshimi te aftësitë, koha dhe vlerat. Numri mbyllet me pesë pritje, dhe asnjëra prej tyre nuk i mbijeton vitit të parë.",
    "Ausgabe 6 begleitet die beste Person im Team auf den Stuhl der Führungskraft. Zuerst geht es um die Daten zur Beförderung der Besten, dann um den Wandel bei Fähigkeiten, Zeit und Werten. Am Ende stehen fünf Erwartungen, von denen keine das erste Jahr übersteht."),
  figure: { n: pc(31), by: "Gallup, 2026", t: x(
    "of supervisors promoted for their results or tenure as frontline workers are engaged, against 42% of those chosen for supervisory skill.",
    "e mbikëqyrësve të promovuar për rezultatet ose vjetërsinë si punonjës janë të angazhuar, kundrejt 42% të atyre të zgjedhur për aftësi mbikëqyrjeje.",
    "der Vorgesetzten, die für Leistung oder Betriebszugehörigkeit befördert wurden, sind engagiert, gegenüber 42 % derer, die für Führungsfähigkeit ausgewählt wurden.") },
  teasers: [
    { page: "story", kicker: x("Cover story", "Tema kryesore", "Titelthema"),
      title: x("The best salesperson, the weakest manager?", "Shitësi më i mirë, menaxheri më i dobët?", "Der beste Verkäufer, die schwächste Führungskraft?") },
    { page: "role", kicker: x("Developing the role", "Zhvillimi i rolit", "Die Rolle entwickeln"),
      title: x("Five expectations that do not hold", "Pesë pritje që nuk përmbushen", "Fünf Erwartungen, die sich nicht erfüllen") },
    { page: "tool", kicker: x("Tool of the issue", "Mjeti i numrit", "Werkzeug der Ausgabe"),
      title: x("The transition card", "Karta e kalimit", "Die Übergangskarte") },
  ],
  sources: ["peter-hull-1969", "benson-li-shue-2019", "gallup-supervisors-2026", "charan-2001", "hill-2007"],
  pages: [
    { id: "cover", type: "cover" },
    {
      id: "intro", type: "intro",
      why: x(
        "Most frontline supervisors were promoted for their results or tenure as workers. The subject here is the day when the person who did the work better than anyone has to get it done through others.",
        "Shumica e mbikëqyrësve të vijës së parë u promovuan për rezultatet ose vjetërsinë e tyre si punonjës. Këtu bëhet fjalë për ditën kur ai që e bënte punën më mirë se kushdo duhet ta kryejë tani përmes të tjerëve.",
        "Die meisten Vorgesetzten der ersten Führungsebene wurden für ihre Leistung oder Betriebszugehörigkeit befördert. Hier geht es um den Tag, an dem jemand, der die Arbeit besser machte als alle anderen, sie nun durch andere erledigen lassen muss."),
      body: x(
        "Laurence Peter named the problem in 1969. Five decades later, three economists measured it in sales: the best salespeople were promoted more often and led teams that sold less. In 2026 Gallup found a similar pattern among frontline supervisors. The step can be learned, but only once it is clear what changes: the skills, the time and what you value.",
        "Laurence Peter e emërtoi problemin në vitin 1969. Pesë dekada më vonë, tre ekonomistë e matën te shitja: shitësit më të mirë promovoheshin më shpesh dhe drejtonin ekipe që shisnin më pak. Në vitin 2026, Gallup gjeti një model të ngjashëm te mbikëqyrësit e vijës së parë. Hapi mund të mësohet, por vetëm kur e di çfarë ndryshon: aftësitë, koha dhe ajo që vlerëson.",
        "Laurence Peter benannte das Problem 1969. Fünf Jahrzehnte später maßen es drei Ökonomen im Vertrieb: Die besten Verkäufer wurden häufiger befördert und führten Teams, die weniger verkauften. 2026 fand Gallup ein ähnliches Muster bei Vorgesetzten der ersten Führungsebene. Der Schritt lässt sich lernen, aber nur, wenn klar ist, was sich ändert: die Fähigkeiten, die Zeit und das, was Sie wertschätzen."),
    },
    {
      id: "story",
      kicker: x("Cover story", "Tema kryesore", "Titelthema"),
      title: [x("The best salesperson,", "Shitësi më i mirë,", "Der beste Verkäufer,"), x("the weakest manager?", "menaxheri më i dobët?", "die schwächste Führungskraft?")],
      lead: x(
        "In 1969 Laurence Peter and Raymond Hull wrote, with irony, that in a hierarchy every employee tends to rise to their level of incompetence. A 2019 study by three economists tested the idea with sales data.",
        "Në vitin 1969, Laurence Peter dhe Raymond Hull shkruan, me ironi, se në një hierarki çdo punonjës priret të ngjitet deri në nivelin e paaftësisë së vet. Një studim i vitit 2019 nga tre ekonomistë e provoi idenë me të dhëna shitjesh.",
        "1969 schrieben Laurence Peter und Raymond Hull ironisch, dass in einer Hierarchie jeder Beschäftigte dazu neigt, bis zu seiner Stufe der Unfähigkeit aufzusteigen. Eine Studie dreier Ökonomen von 2019 prüfte die Idee mit Vertriebsdaten."),
      blocks: [
        { type: "p", text: x(
          "Alan Benson, Danielle Li and Kelly Shue analysed data on salespeople at many US companies. The companies promoted their top sellers more often. But after the promotion, their teams sold less: when someone's sales before the promotion were twice as high, each team member's sales under them fell by about 6.1%. The study shows a link, not proof that the promotion caused the drop.",
          "Alan Benson, Danielle Li dhe Kelly Shue analizuan të dhënat e shitësve në shumë kompani amerikane. Kompanitë promovonin më shpesh ata që shisnin më shumë. Por pas promovimit, ekipet e tyre shisnin më pak: kur shitjet e dikujt para promovimit ishin dyfish më të larta, shitjet e çdo anëtari të ekipit të tij ranë rreth 6,1%. Studimi tregon një lidhje, jo provë se promovimi e shkaktoi rënien.",
          "Alan Benson, Danielle Li und Kelly Shue werteten Daten von Vertriebsleuten in vielen US-Unternehmen aus. Die Unternehmen beförderten ihre besten Verkäufer häufiger. Doch nach der Beförderung verkauften ihre Teams weniger: Waren die Umsätze vor der Beförderung doppelt so hoch, sanken die Umsätze jedes Teammitglieds unter dieser Person um rund 6,1 %. Die Studie zeigt einen Zusammenhang, keinen Beweis, dass die Beförderung den Rückgang verursachte.") },
        { type: "timeline", items: [
          { k: "1969", t: x("The Peter Principle: rising to the level of incompetence.", "Parimi i Peter-it: ngjitja deri te niveli i paaftësisë.", "Das Peter-Prinzip: Aufstieg bis zur Stufe der Unfähigkeit.") },
          { k: "2001", t: x("The Leadership Pipeline: six passages, the first from self to others.", "The Leadership Pipeline: gjashtë kalime, i pari nga vetja te të tjerët.", "The Leadership Pipeline: sechs Übergänge, der erste vom Selbst zu den anderen.") },
          { k: "2019", t: x("Quarterly Journal of Economics: the top sellers' teams sell less.", "Quarterly Journal of Economics: ekipet e shitësve më të mirë shesin më pak.", "Quarterly Journal of Economics: Die Teams der besten Verkäufer verkaufen weniger.") },
          { k: "2026", t: x("Gallup: supervisors chosen for skill are more engaged.", "Gallup: mbikëqyrësit e zgjedhur për aftësi janë më të angazhuar.", "Gallup: Für Führungsfähigkeit ausgewählte Vorgesetzte sind engagierter.") },
        ] },
        { type: "callout", reading: true, text: x(
          "A promotion rewards what someone has done on their own. Management asks what they will achieve through others. Yet one figure, their own past results, often decides both.",
          "Promovimi shpërblen atë që dikush ka bërë vetë. Menaxhimi kërkon atë që do të arrijë përmes të tjerëve. Megjithatë, shpesh për të dyja vendos e njëjta shifër: rezultatet e tij të deriatëhershme.",
          "Eine Beförderung belohnt, was jemand allein geleistet hat. Führung verlangt, was jemand durch andere erreichen wird. Trotzdem entscheidet über beides oft dieselbe Zahl: die bisherigen eigenen Ergebnisse.") },
      ],
      source: ["peter-hull-1969", "charan-2001", "benson-li-shue-2019", "gallup-supervisors-2026"],
    },
    {
      id: "numbers",
      kicker: x("The numbers", "Shifrat", "Die Zahlen"),
      title: [x("How supervisors", "Si zgjidhen", "Wie Vorgesetzte"), x("are chosen", "mbikëqyrësit", "ausgewählt werden")],
      lead: x(
        "Gallup asked frontline supervisors why they were promoted. The answer is linked to how engaged they are today.",
        "Gallup i pyeti mbikëqyrësit e vijës së parë pse u promovuan. Përgjigjja lidhet me sa të angazhuar janë sot.",
        "Gallup fragte Vorgesetzte der ersten Führungsebene, warum sie befördert wurden. Die Antwort hängt damit zusammen, wie engagiert sie heute sind."),
      blocks: [
        { type: "hbars", max: 100, source: ["gallup-supervisors-2026"],
          label: x("Why they were promoted, by their own account", "Pse u promovuan, sipas vetë mbikëqyrësve", "Warum sie befördert wurden, nach eigener Angabe"),
          note: x(
            "Share of frontline supervisors in Gallup's 2026 study, as they themselves explain their promotion.",
            "Pjesa e mbikëqyrësve të vijës së parë në studimin e Gallup-it të vitit 2026, sipas asaj që thonë vetë për promovimin e tyre.",
            "Anteil der Vorgesetzten der ersten Führungsebene in der Gallup-Studie von 2026, nach eigener Angabe zum Grund ihrer Beförderung."),
          items: [
            { k: x("For their results or tenure as frontline workers", "Për rezultatet ose vjetërsinë si punonjës", "Für Leistung oder Betriebszugehörigkeit in der operativen Arbeit"), v: 65, n: pc(65), alert: true },
            { k: x("For supervisory skill or experience", "Për aftësi ose përvojë mbikëqyrjeje", "Für Führungsfähigkeit oder -erfahrung"), v: 30, n: pc(30) },
          ] },
        { type: "columns", max: 50, height: 110, source: ["gallup-supervisors-2026"],
          label: x("Engaged supervisors, by reason for promotion", "Mbikëqyrës të angazhuar, sipas arsyes së promovimit", "Engagierte Vorgesetzte nach Beförderungsgrund"),
          note: x(
            "Share engaged within each group of frontline supervisors, Gallup 2026. A link, not proof that the reason for promotion causes it.",
            "Pjesa e të angazhuarve brenda secilit grup mbikëqyrësish të vijës së parë, Gallup 2026. Një lidhje, jo provë se e shkakton arsyeja e promovimit.",
            "Anteil der Engagierten in jeder Gruppe von Vorgesetzten der ersten Führungsebene, Gallup 2026. Ein Zusammenhang, kein Beweis, dass der Beförderungsgrund ihn verursacht."),
          items: [
            { k: x("Results or tenure", "Rezultate ose vjetërsi", "Leistung oder Zugehörigkeit"), v: 31, n: pc(31), alert: true },
            { k: x("Supervisory skill", "Aftësi mbikëqyrjeje", "Führungsfähigkeit"), v: 42, n: pc(42) },
          ] },
        { type: "p", text: x(
          "Gallup advises choosing supervisors for supervisory talent rather than mainly for frontline results or seniority, with evidence-based interviews and assessments.",
          "Gallup këshillon që mbikëqyrësit të zgjidhen për talentin e mbikëqyrjes, jo kryesisht për rezultatet si punonjës ose vjetërsinë, me intervista dhe vlerësime të bazuara në prova.",
          "Gallup rät, Vorgesetzte nach Führungstalent auszuwählen statt vor allem nach Leistung in der operativen Arbeit oder Dienstalter, mit evidenzbasierten Interviews und Einschätzungen.") },
        { type: "callout", reading: true, text: x(
          "The reason someone was promoted outlasts the day of the promotion: Gallup finds it again in the supervisor's engagement.",
          "Arsyeja pse dikush u promovua jeton më gjatë se dita e promovimit: Gallup-i e gjen sërish te angazhimi i mbikëqyrësit.",
          "Der Grund einer Beförderung wirkt über deren Tag hinaus: Gallup findet ihn im Engagement der Vorgesetzten wieder.") },
      ],
      source: ["gallup-supervisors-2026"],
    },
    {
      id: "model", more: "the-operations-manager-i-want-to-be",
      kicker: x("The model", "Modeli", "Das Modell"),
      title: [x("Three things", "Tri gjëra", "Drei Dinge,"), x("that change", "që ndryshojnë", "die sich ändern")],
      lead: x(
        "In The Leadership Pipeline, Charan, Drotter and Noel describe the first passage, from managing yourself to managing others, as a change in three things at once.",
        "Te The Leadership Pipeline, Charan, Drotter dhe Noel e përshkruajnë kalimin e parë, nga menaxhimi i vetvetes te menaxhimi i të tjerëve, si ndryshim në tri gjëra njëherësh.",
        "In The Leadership Pipeline beschreiben Charan, Drotter und Noel den ersten Übergang, von der Führung der eigenen Person zur Führung anderer, als Wandel in drei Dingen zugleich."),
      blocks: [
        { type: "tiles", groups: [
          { h: x("Skills", "Aftësitë", "Fähigkeiten"), tone: "red", items: [
            { n: "01", t: x("Planning other people's work", "Planifikon punën e të tjerëve", "Die Arbeit anderer planen") },
            { n: "02", t: x("Choosing people and delegating", "Zgjedh njerëzit dhe delegon", "Menschen auswählen und delegieren") },
            { n: "03", t: x("Coaching and assessing the work", "Mentoron dhe vlerëson punën", "Coachen und die Arbeit bewerten") },
          ] },
          { h: x("Time", "Koha", "Zeit"), tone: "blue", items: [
            { n: "01", t: x("Time set aside for people", "Kohë e rezervuar për njerëzit", "Feste Zeit für die Menschen") },
            { n: "02", t: x("Time to plan, not only to do", "Kohë për të planifikuar, jo vetëm për të bërë", "Zeit zum Planen, nicht nur zum Machen") },
            { n: "03", t: x("Fewer hours on one's own tasks", "Më pak orë te puna e vet", "Weniger Stunden für eigene Aufgaben") },
          ] },
          { h: x("Values", "Vlerat", "Werte"), tone: "ink", items: [
            { n: "01", t: x("Results come through others", "Rezultati vjen përmes të tjerëve", "Ergebnisse entstehen durch andere") },
            { n: "02", t: x("The team's success as one's own", "Suksesi i ekipit si sukses personal", "Der Erfolg des Teams als eigener Erfolg") },
            { n: "03", t: x("Managing as real work", "Menaxhimi si punë e vërtetë", "Führen als echte Arbeit") },
          ] },
        ] },
        { type: "p", text: x(
          "The authors write that the values are harder to change than the skills: believing that a manager's work is real work, and no obstacle to the “real work”.",
          "Autorët shkruajnë se vlerat ndryshojnë më vështirë se aftësitë: të besosh se puna e menaxherit është punë e vërtetë, dhe jo pengesë për “punën e vërtetë”.",
          "Die Autoren schreiben, dass sich die Werte schwerer ändern als die Fähigkeiten: zu glauben, dass die Arbeit einer Führungskraft echte Arbeit ist und kein Hindernis für die „echte Arbeit“.") },
        { type: "callout", reading: true, text: x(
          "Most new managers know they should delegate. Few change their calendar. The step shows in the week before it shows in the results.",
          "Shumica e menaxherëve të rinj e dinë se duhet të delegojnë. Pak e ndryshojnë kalendarin. Hapi duket te java, para se të duket te rezultati.",
          "Die meisten neuen Führungskräfte wissen, dass sie delegieren sollten. Wenige ändern ihren Kalender. Der Schritt zeigt sich in der Woche, bevor er sich im Ergebnis zeigt.") },
      ],
      note: x(
        "The three categories are the book's; the examples within them are our summary.",
        "Tri kategoritë janë të librit; shembujt brenda tyre janë përmbledhja jonë.",
        "Die drei Kategorien stammen aus dem Buch; die Beispiele darin sind unsere Zusammenfassung."),
      source: ["charan-2001"],
    },
    {
      id: "role",
      kicker: x("Developing the role", "Zhvillimi i rolit", "Die Rolle entwickeln"),
      title: [x("Five expectations", "Pesë pritje", "Fünf Erwartungen,"), x("that do not hold", "që nuk përmbushen", "die sich nicht erfüllen")],
      lead: x(
        "Linda Hill has studied new managers for years. In 2007 she summed up their expectations in five myths, each with the reality that replaces it. The right-hand column is our summary.",
        "Linda Hill ka studiuar për vite menaxherët e rinj. Në vitin 2007 i përmblodhi pritjet e tyre në pesë mite, secili me realitetin që i zë vendin. Kolona djathtas është përmbledhja jonë.",
        "Linda Hill erforscht seit Jahren neue Führungskräfte. 2007 fasste sie deren Erwartungen in fünf Mythen zusammen, jeweils mit der Wirklichkeit, die an ihre Stelle tritt. Die rechte Spalte ist unsere Zusammenfassung."),
      blocks: [
        { type: "rows", compact: true, items: [
          { h: x("The manager has authority", "Menaxheri ka autoritet", "Die Führungskraft hat Entscheidungsbefugnis"), p: x("The manager depends on others: the boss, peers, the team and people outside it.", "Menaxheri varet nga të tjerët: nga shefi, kolegët, ekipi dhe njerëzit jashtë tij.", "Die Führungskraft hängt von anderen ab: vom Chef, von Kollegen, vom Team und von Menschen außerhalb.") },
          { h: x("Power comes from the title", "Fuqia vjen nga titulli", "Macht kommt vom Titel"), p: x("Power comes from trust, earned through character and competence.", "Fuqia vjen nga besimi, që fitohet me karakter dhe aftësi.", "Macht kommt aus Vertrauen, das man mit Charakter und Können gewinnt.") },
          { h: x("Control is the goal", "Synimi është kontrolli", "Kontrolle ist das Ziel"), p: x("Compliance is not commitment; commitment is the goal.", "Bindja nuk është angazhim; synimi është angazhimi.", "Gehorsam ist kein Engagement; Engagement ist das Ziel.") },
          { h: x("Managing one by one", "Marrëdhënie një me një", "Einzeln führen"), p: x("Beyond each person, the team as a whole has to be led.", "Përveç çdo personi, duhet drejtuar ekipi si i tërë.", "Über jede Person hinaus muss das Team als Ganzes geführt werden.") },
          { h: x("Keeping things running smoothly", "Gjithçka të ecë pa probleme", "Alles soll reibungslos laufen"), p: x("The job is also to change how the team works.", "Detyra është edhe të ndryshosh mënyrën si punon ekipi.", "Zur Aufgabe gehört auch, die Arbeitsweise des Teams zu verändern.") },
        ] },
        { type: "p", text: x(
          "Most supervisors meet these myths without preparation. In Gallup's 2026 study, fewer than half had any supervisor training in the past year, and those who had were more likely to be engaged and less likely to burn out often.",
          "Shumica e mbikëqyrësve i takojnë këto mite pa përgatitje. Në studimin e Gallup-it të vitit 2026, më pak se gjysma kishin marrë trajnim mbikëqyrjeje vitin e fundit, dhe ata që e kishin marrë ishin më të angazhuar dhe më rrallë të rraskapitur.",
          "Die meisten Vorgesetzten begegnen diesen Mythen ohne Vorbereitung. In Gallups Studie von 2026 hatte weniger als die Hälfte im letzten Jahr eine Schulung für Vorgesetzte, und wer eine hatte, war häufiger engagiert und seltener ausgebrannt.") },
        { type: "figures", compact: true, items: [
          { n: pc(45), t: x("had supervisor training in the past year", "morën trajnim mbikëqyrjeje vitin e fundit", "hatten im letzten Jahr eine Schulung für Vorgesetzte") },
          { n: pc(23), t: x("have never had any", "nuk kanë marrë kurrë", "hatten nie eine") },
          { n: pc(79), t: x("more likely to be engaged if they had training in the past year", "më shumë gjasa të jenë të angazhuar ata që kanë marrë trajnim vitin e fundit", "höhere Wahrscheinlichkeit, engagiert zu sein, wenn sie im letzten Jahr geschult wurden") },
        ] },
        { type: "callout", reading: true, text: x(
          "What a new manager needs most is agreements: with the team, with the boss and with peers. Authority comes with the title; these have to be made.",
          "Ajo që i duhet më shumë menaxherit të ri janë marrëveshjet: me ekipin, me shefin dhe me kolegët. Autoriteti vjen me titullin; marrëveshjet duhen bërë.",
          "Was eine neue Führungskraft am meisten braucht, sind Vereinbarungen: mit dem Team, mit dem Chef und mit Kollegen. Befugnisse kommen mit dem Titel, Vereinbarungen muss sie erst treffen.") },
      ],
      source: ["hill-2007", "gallup-supervisors-2026"],
    },
    {
      id: "measure",
      kicker: x("How it is measured", "Si matet", "Wie es gemessen wird"),
      title: [x("Where does", "Ku shkon", "Wohin geht"), x("your week go?", "java jote?", "Ihre Woche?")],
      lead: x(
        "The step shows in the calendar before it shows in the results. One honestly recorded week tells you whether you are still the best worker or have started to be a manager.",
        "Hapi duket te kalendari para se të duket te rezultatet. Një javë e shënuar me ndershmëri tregon nëse je ende punonjësi më i mirë apo ke nisur të jesh menaxher.",
        "Der Schritt zeigt sich im Kalender früher als in den Ergebnissen. Eine ehrlich notierte Woche verrät Ihnen, ob Sie noch die beste Fachkraft sind oder schon Führungskraft."),
      blocks: [
        { type: "steps", items: [
          { h: x("Record one week", "Shëno një javë", "Eine Woche notieren"), p: x("Every hour, what you did. Without dressing it up.", "Çdo orë, çfarë bëre. Pa e zbukuruar.", "Notieren Sie für jede Stunde, was Sie getan haben. Ohne Schönfärberei.") },
          { h: x("Split it into three", "Ndaje në tri", "In drei Teile teilen"), p: x("Your own work, work with the team (planning, coaching, conversations), and fires.", "Puna jote, puna me ekipin (planifikimi, mentorimi, bisedat) dhe zjarret.", "Eigene Arbeit, Arbeit mit dem Team (Planung, Coaching, Gespräche) und Feuerwehreinsätze.") },
          { h: x("Decide how many hours the team gets", "Vendos sa orë i takojnë ekipit", "Festlegen, wie viele Stunden dem Team gehören"), p: x("Together with your boss. One number for next month.", "Bashkë me shefin tënd. Një shifër për muajin tjetër.", "Gemeinsam mit Ihrem Chef. Eine Zahl für den nächsten Monat.") },
          { h: x("Hand over one task", "Kalo një detyrë", "Eine Aufgabe übergeben"), p: x("Each week, one thing you still do yourself goes to someone on the team, with time to learn it.", "Çdo javë, një gjë që e bën ende vetë kalon te dikush në ekip, me kohë për ta mësuar.", "Geben Sie jede Woche eine Sache, die Sie noch selbst erledigen, an jemanden im Team ab, mit Zeit zum Lernen.") },
        ] },
        { type: "example", label: x("Hypothetical example, a shift lead in the first month", "Shembull hipotetik, një shef turni në muajin e parë", "Hypothetisches Beispiel, eine Schichtleitung im ersten Monat"), rows: [
          { k: x("Own work", "Puna e vet", "Eigene Arbeit"), v: x("22 hours", "22 orë", "22 Stunden") },
          { k: x("With the team", "Me ekipin", "Mit dem Team"), v: x("8 hours", "8 orë", "8 Stunden") },
          { k: x("Fires", "Zjarret", "Feuerwehr"), v: x("10 hours", "10 orë", "10 Stunden") },
        ], text: x("The goal for next month: 15 hours with the team. All figures invented.", "Qëllimi për muajin tjetër: 15 orë me ekipin. Të gjitha shifrat janë të shpikura.", "Ziel für den nächsten Monat: 15 Stunden mit dem Team. Alle Zahlen sind erfunden.") },
        { type: "callout", reading: true, text: x(
          "When fires take more hours than the team, the usual cause is that nobody else knows how to put them out.",
          "Kur zjarret marrin më shumë orë se ekipi, shkaku i zakonshëm është se askush tjetër nuk di t'i shuajë.",
          "Wenn das Löschen von Bränden mehr Stunden frisst als das Team, liegt das meist daran, dass sonst niemand löschen kann.") },
      ],
      note: x("The steps and the example are the editors'.", "Hapat dhe shembulli janë të redaksisë.", "Schritte und Beispiel stammen von der Redaktion."),
    },
    {
      id: "tool", more: "watch-how-i-do-it-is-not-training",
      kicker: x("Tool of the issue", "Mjeti i numrit", "Werkzeug der Ausgabe"),
      title: [x("The", "Karta", "Die"), x("transition card", "e kalimit", "Übergangskarte")],
      lead: x(
        "One page for your first three months as a manager. Fill it in yourself, then discuss it with your boss.",
        "Një faqe për tre muajt e parë si menaxher. Plotësoje vetë, pastaj bisedoje me shefin tënd.",
        "Eine Seite für Ihre ersten drei Monate als Führungskraft. Füllen Sie sie selbst aus und besprechen Sie sie dann mit Ihrem Chef."),
      blocks: [
        { type: "form", items: [
          { h: x("What I stop doing myself", "Çfarë ndaloj së bëri vetë", "Was ich nicht mehr selbst mache"), hint: x("the tasks that go to the team", "detyrat që kalojnë te ekipi", "Aufgaben, die ans Team gehen"), lines: 2 },
          { h: x("Time for the team", "Koha për ekipin", "Zeit für das Team"), hint: x("when, how many hours, for what", "kur, sa orë, për çfarë", "wann, wie viele Stunden, wofür") },
          { h: x("One-to-one conversations", "Bisedat një me një", "Einzelgespräche"), hint: x("with whom, how often", "me kë, sa shpesh", "mit wem, wie oft") },
          { h: x("The skill I am learning", "Aftësia që po mësoj", "Die Fähigkeit, die ich lerne"), hint: x("one this month", "një këtë muaj", "eine in diesem Monat") },
          { h: x("Who I depend on", "Nga kush varem", "Von wem ich abhänge"), hint: x("boss, peers, other units", "shefi, kolegët, njësitë e tjera", "Chef, Kollegen, andere Einheiten"), lines: 2 },
          { h: x("Review", "Rishikimi", "Überprüfung"), hint: x("date, and where the week went", "data, dhe ku shkoi java", "Datum, und wohin die Woche ging") },
        ] },
      ],
      note: x(
        "The editors suggest this as a practice. Leave names and confidential data off the card.",
        "Praktikë që e sugjeron redaksia. Mos shkruaj në kartë emra ose të dhëna konfidenciale.",
        "Die Redaktion schlägt diese Praxis vor. Schreiben Sie keine Namen oder vertraulichen Daten auf die Karte."),
    },
    { id: "sources", type: "sources" },
    { id: "back", type: "back" },
  ],
};
