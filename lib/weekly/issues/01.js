// Management Review, No. 1: What the best managers do. Block: Role.
// Facts and their sources: docs/revista/management-review-nr-01.md. Every text is written once in the three
// languages, x(en, sq, de); src/_data/weekly.js resolves them and draws the charts.
import { x, pc } from "../common.js";

export default {
  number: 1,
  block: "role",
  date: x("October 2026", "Tetor 2026", "Oktober 2026"),
  theme: [x("What the best", "Çfarë bëjnë", "Was die besten"), x("managers do", "menaxherët më të mirë", "Führungskräfte tun")],
  sub: x(
    "Ten behaviours from Google's research, why the talent to manage is rare, and how a team can rate its own manager.",
    "Dhjetë sjellje nga kërkimi i Google, pse talenti për të drejtuar është i rrallë, dhe si e vlerëson një ekip menaxherin e vet.",
    "Zehn Verhaltensweisen aus der Forschung von Google, warum Führungstalent selten ist und wie ein Team die eigene Führungskraft bewertet."),
  // The description for search results: short enough to be shown whole (about 155 characters).
  seo: x(
    "What the best managers do: Google's ten behaviours, Gallup's 70% and a card to rate the manager with the team. Every figure checked.",
    "Çfarë bëjnë menaxherët më të mirë: dhjetë sjelljet e Google, 70% e Gallup dhe një kartë për ta vlerësuar menaxherin me ekipin.",
    "Was die besten Führungskräfte tun: die zehn Verhaltensweisen von Google, die 70 % von Gallup und eine Karte für die Bewertung im Team."),
  feature: x(
    "Issue 1 starts with the most basic question: does the manager matter? Google's own data, Gallup's research on engagement and talent, and a card to rate the ten behaviours with your team.",
    "Numri 1 nis me pyetjen më themelore: a ka rëndësi menaxheri? Të dhënat e vetë Google, kërkimet e Gallup për angazhimin dhe talentin, dhe një kartë për t'i vlerësuar dhjetë sjelljet me ekipin.",
    "Ausgabe 1 beginnt mit der grundlegendsten Frage: Spielt die Führungskraft eine Rolle? Die eigenen Daten von Google, die Forschung von Gallup zu Engagement und Talent und eine Karte, um die zehn Verhaltensweisen mit dem Team zu bewerten."),
  // The figure of the week, on the cover.
  figure: { n: pc(70), by: "Gallup, 2015", t: x(
    "at least, of the variance in engagement between business units is explained by the manager.",
    "të paktën, e ndryshimit në angazhim mes njësive të biznesit shpjegohet nga menaxheri.",
    "mindestens, der Unterschiede im Engagement zwischen Geschäftseinheiten erklärt die Führungskraft.") },
  teasers: [
    { page: "story", kicker: x("Cover story", "Tema kryesore", "Titelthema"),
      title: x("When Google removed its engineering managers", "Kur Google hoqi menaxherët e inxhinierisë", "Als Google seine Engineering-Manager abschaffte") },
    { page: "numbers", kicker: x("The numbers", "Shifrat", "Die Zahlen"),
      title: x("Managers are losing engagement faster than their teams", "Menaxherët po humbin angazhimin më shpejt se ekipet e tyre", "Führungskräfte verlieren schneller an Engagement als ihre Teams") },
    { page: "tool", kicker: x("Tool of the week", "Mjeti i javës", "Werkzeug der Woche"),
      title: x("The ten-behaviour card, to fill in with your team", "Karta e dhjetë sjelljeve, për ta plotësuar me ekipin", "Die Karte der zehn Verhaltensweisen, zum Ausfüllen mit dem Team") },
  ],
  sources: ["rework-managers", "garvin-2013", "bryant-2011", "gallup-manager-2015", "gallup-sogw-2026", "gallup-rare-2014", "quartz-2017", "bock-2015"],
  pages: [
    { id: "cover", type: "cover" },
    {
      id: "intro", type: "intro",
      why: x(
        "Every week, Management Review takes one management question and checks it against the best research that has been published. The first issue starts with the most basic one: does the manager matter, and if so, what does a good manager do differently?",
        "Çdo javë, Management Review merr një pyetje të menaxhimit dhe e kontrollon me kërkimet më të mira që janë publikuar. Numri i parë nis me pyetjen më themelore: a ka rëndësi menaxheri, dhe nëse ka, çfarë bën ndryshe menaxheri i mirë?",
        "Jede Woche nimmt sich die Management Review eine Führungsfrage vor und prüft sie an der besten veröffentlichten Forschung. Die erste Ausgabe beginnt mit der grundlegendsten: Spielt die Führungskraft eine Rolle, und wenn ja, was macht eine gute Führungskraft anders?"),
      body: x(
        "The answer comes from two very different directions. Google analysed its own data on managers and arrived at ten behaviours. Gallup measured engagement across teams and showed how much of it depends on the manager. Both lead to the same conclusion, and to the same problem: good managers do not appear in an organisation by themselves. They are chosen and developed.",
        "Përgjigjja vjen nga dy drejtime shumë të ndryshme. Google analizoi të dhënat e veta për menaxherët dhe nxori dhjetë sjellje. Gallup mati angazhimin e ekipeve dhe tregoi sa shumë varet ai nga menaxheri. Të dyja të çojnë te i njëjti përfundim, dhe te i njëjti problem: menaxherët e mirë nuk lindin vetvetiu në një organizatë. Ata zgjidhen dhe zhvillohen.",
        "Die Antwort kommt aus zwei sehr verschiedenen Richtungen. Google hat die eigenen Daten über Führungskräfte ausgewertet und zehn Verhaltensweisen gefunden. Gallup hat das Engagement von Teams gemessen und gezeigt, wie viel davon an der Führungskraft hängt. Beide führen zum selben Schluss und zum selben Problem: Gute Führungskräfte entstehen in einer Organisation nicht von selbst. Sie werden ausgewählt und entwickelt."),
    },
    {
      id: "story",
      kicker: x("Cover story", "Tema kryesore", "Titelthema"),
      title: [x("Does the manager", "A ka rëndësi", "Spielt die Führungskraft"), x("matter?", "menaxheri?", "eine Rolle?")],
      lead: x(
        "In 2002 Google removed its engineering managers. Within months it brought them back. Years later it asked its own data whether managers matter.",
        "Në vitin 2002, Google hoqi menaxherët e inxhinierisë. Pas pak muajsh i ktheu. Vite më vonë, i pyeti të dhënat e veta nëse menaxherët kanë rëndësi.",
        "2002 schaffte Google seine Engineering-Manager ab. Nach wenigen Monaten holte es sie zurück. Jahre später fragte es die eigenen Daten, ob Führungskräfte eine Rolle spielen."),
      blocks: [
        { type: "timeline", items: [
          { k: "2002", t: x("Google removes its engineering managers and brings them back within months.", "Google heq menaxherët e inxhinierisë dhe i kthen pas pak muajsh.", "Google schafft seine Engineering-Manager ab und holt sie nach wenigen Monaten zurück.") },
          { k: "2011", t: x("The New York Times publishes Google's first list: eight behaviours.", "New York Times boton listën e parë të Google: tetë sjellje.", "Die New York Times veröffentlicht die erste Liste von Google: acht Verhaltensweisen.") },
          { k: "2018", t: x("Google extends the list to ten behaviours.", "Google e zgjeron listën në dhjetë sjellje.", "Google erweitert die Liste auf zehn Verhaltensweisen.") },
        ] },
        { type: "p", text: x(
          "Google's people analytics team examined more than 10,000 data points from performance reviews and feedback surveys, along with hundreds of pages of interview notes. The answer was clear: teams with better managers had better results, were happier and left less often.",
          "Ekipi i analizës së njerëzve te Google shqyrtoi më shumë se 10.000 të dhëna nga vlerësimet e performancës dhe anketat e feedback-ut, si dhe qindra faqe me shënime intervistash. Përgjigjja ishte e qartë: ekipet me menaxherë më të mirë kishin rezultate më të mira, ishin më të kënaqur dhe largoheshin më rrallë.",
          "Das People-Analytics-Team von Google wertete mehr als 10.000 Datenpunkte aus Leistungsbeurteilungen und Feedback-Umfragen aus, dazu Hunderte Seiten Interviewnotizen. Die Antwort war eindeutig: Teams mit besseren Führungskräften hatten bessere Ergebnisse, waren zufriedener und kündigten seltener.") },
        { type: "p", text: x(
          "Gallup reached the same conclusion from another direction, in its 2015 report on managers in the United States.",
          "Gallup arriti te i njëjti përfundim nga një drejtim tjetër, në raportin e vitit 2015 për menaxherët në Shtetet e Bashkuara.",
          "Gallup kam aus einer anderen Richtung zum selben Schluss, im Bericht von 2015 über Führungskräfte in den USA.") },
        { type: "donut", v: 70, n: pc(70), source: ["gallup-manager-2015"], t: x(
          "at least, of the variance in engagement between business units is explained by the manager.",
          "të paktën, e ndryshimit në angazhim mes njësive të biznesit shpjegohet nga menaxheri.",
          "mindestens, der Unterschiede im Engagement zwischen Geschäftseinheiten erklärt die Führungskraft.") },
        { type: "callout", reading: true, text: x(
          "The manager is not a cost to be cut. It is where an organisation gains or loses most of what its people can do.",
          "Menaxheri nuk është një kosto për t'u ulur. Është vendi ku organizata fiton ose humbet pjesën më të madhe të asaj që mund të bëjnë njerëzit e saj.",
          "Die Führungskraft ist kein Kostenpunkt, den man streicht. Hier gewinnt oder verliert eine Organisation das meiste von dem, was ihre Menschen leisten können.") },
      ],
      source: ["garvin-2013", "bryant-2011", "rework-managers", "gallup-manager-2015"],
    },
    {
      id: "numbers",
      kicker: x("The numbers", "Shifrat", "Die Zahlen"),
      title: [x("Manager engagement", "Angazhimi i menaxherëve", "Das Engagement der Führung"), x("is falling faster", "bie më shpejt", "sinkt schneller")],
      lead: x(
        "If the manager carries the team, who carries the manager? Managers' engagement has fallen further than that of the people they lead.",
        "Nëse menaxheri e mban ekipin, kush e mban menaxherin? Angazhimi i menaxherëve ka rënë më shumë se ai i njerëzve që drejtojnë.",
        "Wenn die Führungskraft das Team trägt, wer trägt die Führungskraft? Ihr Engagement ist stärker gesunken als das der Menschen, die sie führt."),
      blocks: [
        { type: "line", alert: true, min: 0, max: 40, height: 104,
          label: x("Engaged managers worldwide, 2022–2025", "Menaxherët e angazhuar në botë, 2022–2025", "Engagierte Führungskräfte weltweit, 2022–2025"),
          points: [
            { k: "2022", v: 31, n: pc(31) },
            { k: "2023", v: 30, n: pc(30) },
            { k: "2024", v: 27, n: pc(27) },
            { k: "2025", v: 22, n: pc(22) },
          ] },
        { type: "dumbbell", from: "2022", to: "2025", min: 0, max: 40, rowH: 26,
          label: x("Managers and non-managers, 2022 and 2025", "Menaxherët dhe jo-menaxherët, 2022 dhe 2025", "Führungskräfte und Mitarbeitende ohne Führungsrolle, 2022 und 2025"),
          rows: [
            { k: x("Managers", "Menaxherët", "Führungskräfte"), a: 31, an: pc(31), b: 22, bn: pc(22), alert: true },
            { k: x("Non-managers", "Jo-menaxherët", "Ohne Führung"), a: 20, an: pc(20), b: 19, bn: pc(19) },
          ] },
        { type: "figures", compact: true, items: [
          { n: x("−9", "−9", "−9"), t: x("points for managers, from 2022 to 2025", "pikë për menaxherët, nga 2022 në 2025", "Punkte bei Führungskräften, 2022 bis 2025") },
          { n: x("−1", "−1", "−1"), t: x("point for non-managers in the same years", "pikë për jo-menaxherët në të njëjtat vite", "Punkt bei Mitarbeitenden ohne Führung") },
          { n: pc(20), t: x("of employees worldwide were engaged in 2025", "e punonjësve në botë ishin të angazhuar në 2025", "der Beschäftigten weltweit waren 2025 engagiert") },
        ] },
        { type: "callout", reading: true, text: x(
          "Managers used to be clearly more engaged than their teams. Today the gap is about 3 points. If most of a team's engagement depends on its manager, this fall does not stay with the manager.",
          "Dikur menaxherët ishin dukshëm më të angazhuar se ekipet e tyre. Sot diferenca është rreth 3 pikë. Nëse pjesa më e madhe e angazhimit të një ekipi varet nga menaxheri, kjo rënie nuk mbetet vetëm te menaxheri.",
          "Früher waren Führungskräfte deutlich engagierter als ihre Teams. Heute liegt der Abstand bei etwa 3 Punkten. Wenn der größte Teil des Engagements eines Teams an der Führungskraft hängt, bleibt dieser Rückgang nicht bei ihr.") },
      ],
      source: ["gallup-sogw-2026"],
    },
    {
      id: "model", more: "leading-people-without-losing-the-person",
      kicker: x("The model", "Modeli", "Das Modell"),
      title: [x("The ten behaviours", "Dhjetë sjelljet", "Die zehn Verhaltensweisen"), x("of a good manager", "e menaxherit të mirë", "guter Führung")],
      lead: x(
        "Google's list, in its 2018 version. The grouping into three areas is ours, to make the list easier to remember.",
        "Lista e Google, në versionin e vitit 2018. Grupimi në tri fusha është i yni, që lista të mbahet mend më lehtë.",
        "Die Liste von Google in der Fassung von 2018. Die Einteilung in drei Bereiche stammt von uns, damit man sie sich leichter merkt."),
      blocks: [
        { type: "tiles", badge: x("New in 2018", "E re në 2018", "Neu 2018"), groups: [
          { h: x("People", "Njerëzit", "Menschen"), tone: "red", items: [
            { n: "01", t: x("Is a good coach", "Është coach i mirë", "Ist ein guter Coach") },
            { n: "02", t: x("Empowers the team and does not micromanage", "Fuqizon ekipin dhe nuk e kontrollon në çdo hap", "Befähigt das Team und kontrolliert nicht jeden Schritt") },
            { n: "03", t: x("Creates an inclusive team and cares about people's success and well-being", "Krijon një ekip ku secili ka vend dhe kujdeset për suksesin dhe mirëqenien e njerëzve", "Schafft ein Team, in dem alle dazugehören, und kümmert sich um Erfolg und Wohlbefinden") },
            { n: "06", t: x("Supports career development and discusses performance", "Mbështet zhvillimin e karrierës dhe flet për performancën", "Fördert die Entwicklung und spricht über Leistung") },
          ] },
          { h: x("Direction", "Drejtimi", "Richtung"), tone: "blue", items: [
            { n: "04", t: x("Is productive and results-oriented", "Është produktiv dhe i fokusuar te rezultati", "Ist produktiv und ergebnisorientiert") },
            { n: "07", t: x("Has a clear vision and strategy for the team", "Ka vizion dhe strategji të qartë për ekipin", "Hat eine klare Vision und Strategie für das Team") },
            { n: "10", t: x("Is a strong decision maker", "Merr vendime me vendosmëri", "Trifft klare Entscheidungen"), isNew: true },
          ] },
          { h: x("Connection", "Lidhjet", "Verbindung"), tone: "ink", items: [
            { n: "05", t: x("Communicates well: listens and shares information", "Komunikon mirë: dëgjon dhe ndan informacionin", "Kommuniziert gut: hört zu und teilt Informationen") },
            { n: "08", t: x("Has the technical skills to advise the team", "Ka aftësitë teknike për ta këshilluar ekipin", "Hat das Fachwissen, um das Team zu beraten") },
            { n: "09", t: x("Collaborates across the company", "Bashkëpunon në gjithë kompaninë", "Arbeitet über Bereichsgrenzen hinweg zusammen"), isNew: true },
          ] },
        ] },
        { type: "p", text: x(
          "The last two were added in 2018, after feedback from employees. According to Google, the new list predicts turnover and team satisfaction better than the first one with eight behaviours.",
          "Dy të fundit u shtuan në 2018, pas feedback-ut të punonjësve. Sipas Google, lista e re i parashikon më mirë largimet dhe kënaqësinë e ekipit se e para, me tetë sjellje.",
          "Die letzten beiden kamen 2018 hinzu, nach Rückmeldungen der Beschäftigten. Laut Google sagt die neue Liste Kündigungen und Zufriedenheit im Team besser voraus als die erste mit acht Verhaltensweisen.") },
        { type: "callout", reading: true, text: x(
          "Only one of the ten behaviours is about technical expertise. The rest is how the manager works with people, gives direction and works with the rest of the company.",
          "Vetëm një nga dhjetë sjelljet ka të bëjë me ekspertizën teknike. Pjesa tjetër është mënyra si menaxheri punon me njerëzit, si jep drejtim dhe si punon me pjesën tjetër të kompanisë.",
          "Nur eine der zehn Verhaltensweisen betrifft Fachwissen. Der Rest ist, wie die Führungskraft mit Menschen arbeitet, Richtung gibt und mit dem übrigen Unternehmen zusammenarbeitet.") },
      ],
      source: ["rework-managers"],
    },
    {
      id: "role",
      kicker: x("Developing the role", "Zhvillimi i rolit", "Die Rolle entwickeln"),
      title: [x("Why good managers", "Pse menaxherët e mirë", "Warum gute Führungskräfte"), x("are rare", "janë të rrallë", "selten sind")],
      lead: x(
        "If we know what good managers do, why are there so few of them? According to Gallup, the problem starts with the choice.",
        "Nëse e dimë çfarë bëjnë menaxherët e mirë, pse janë kaq të pakët? Sipas Gallup, problemi fillon te zgjedhja.",
        "Wenn wir wissen, was gute Führungskräfte tun, warum gibt es so wenige? Laut Gallup beginnt das Problem bei der Auswahl."),
      blocks: [
        { type: "people",
          label: x("The talent to manage, out of 10 people", "Talenti për të drejtuar, nga 10 njerëz", "Führungstalent, von 10 Menschen"),
          groups: [
            { v: 1, tone: "red", n: x("1 in 10", "1 në 10", "1 von 10"), t: x("have high talent to manage", "kanë talent të lartë për të drejtuar", "haben hohes Führungstalent") },
            { v: 2, tone: "blue", n: x("2 in 10", "2 në 10", "2 von 10"), t: x("have basic talent", "kanë talent bazë", "haben Grundtalent") },
            { v: 7, tone: "dim", n: x("7 in 10", "7 në 10", "7 von 10"), t: x("the rest", "të tjerët", "die übrigen") },
          ] },
        { type: "stat", n: pc(82), t: x(
          "of the time, companies do not choose the candidate with the right talent for the manager's job.",
          "të herëve, kompanitë nuk e zgjedhin për menaxher kandidatin me talentin e duhur.",
          "der Fälle wählen Unternehmen für die Führungsrolle nicht die Person mit dem passenden Talent.") },
        { type: "rows", compact: true, label: x("The five talents Gallup finds in great managers", "Pesë talentet që Gallup gjen te menaxherët e shkëlqyer", "Fünf Talente großartiger Führungskräfte laut Gallup"), items: [
          { h: x("Motivates", "Motivon", "Motiviert"), p: x("Moves every person and ties them to a clear mission.", "Vë në lëvizje secilin dhe e lidh me një qëllim të qartë.", "Bewegt jede Person und gibt ihr ein klares Ziel.") },
          { h: x("Drives results", "Çon te rezultati", "Treibt Ergebnisse"), p: x("Sees the work through, against obstacles and resistance.", "E çon punën deri në fund, edhe përballë pengesave.", "Bringt die Arbeit zu Ende, auch gegen Widerstand.") },
          { h: x("Creates accountability", "Krijon përgjegjshmëri", "Klärt Verantwortung"), p: x("Makes it clear who answers for what.", "E bën të qartë kush përgjigjet për çfarë.", "Macht klar, wer wofür einsteht.") },
          { h: x("Builds trust", "Ndërton besim", "Baut Vertrauen auf"), p: x("Builds relationships on open dialogue and transparency.", "Ndërton marrëdhënie me dialog të hapur dhe transparencë.", "Baut Beziehungen mit offenem Dialog und Transparenz.") },
          { h: x("Decides on the work", "Vendos sipas punës", "Entscheidet sachlich"), p: x("Decides on what moves the work, not on politics.", "Vendos sipas asaj që e çon punën përpara, jo sipas politikës.", "Entscheidet nach der Sache, nicht nach Politik.") },
        ] },
        { type: "callout", reading: true, text: x(
          "Training helps, but it does not replace the choice. The first question before a promotion is not “does this person work well?” but “does this person help others work well?”",
          "Trajnimi ndihmon, por nuk e zëvendëson zgjedhjen. Pyetja e parë para një promovimi nuk është “a punon mirë?”, por “a i ndihmon të tjerët të punojnë mirë?”",
          "Training hilft, aber es ersetzt die Auswahl nicht. Die erste Frage vor einer Beförderung lautet nicht „Arbeitet die Person gut?“, sondern „Hilft sie anderen, gut zu arbeiten?“") },
      ],
      source: ["gallup-rare-2014"],
    },
    {
      id: "measure",
      kicker: x("How it is measured", "Si matet", "Wie man es misst"),
      title: [x("The team rates", "Ekipi e vlerëson", "Das Team bewertet"), x("the manager", "menaxherin", "die Führungskraft")],
      lead: x(
        "Google did not leave the list on a wall. It turned it into a survey that each team fills in about its own manager.",
        "Google nuk e la listën në mur. E ktheu në një anketë që çdo ekip e plotëson për menaxherin e vet.",
        "Google hat die Liste nicht an die Wand gehängt. Es hat daraus eine Umfrage gemacht, die jedes Team über die eigene Führungskraft ausfüllt."),
      blocks: [
        { type: "steps", items: [
          { h: x("Twice a year", "Dy herë në vit", "Zweimal im Jahr"), p: x("The survey is repeated, so the manager can see whether anything is changing.", "Anketa përsëritet, që menaxheri të shohë nëse diçka po ndryshon.", "Die Umfrage wird wiederholt, damit die Führungskraft sieht, ob sich etwas ändert.") },
          { h: x("Anonymous", "Anonime", "Anonym"), p: x("A report appears only when at least three people have answered.", "Raporti del vetëm kur janë përgjigjur të paktën tre persona.", "Ein Bericht erscheint erst, wenn mindestens drei Personen geantwortet haben.") },
          { h: x("About behaviour", "Për sjelljet", "Zum Verhalten"), p: x("In 2017 there were 13 questions, tied to the behaviours on the list.", "Në 2017 ishin 13 pyetje, të lidhura me sjelljet e listës.", "2017 waren es 13 Fragen, verbunden mit den Verhaltensweisen der Liste.") },
          { h: x("For development only", "Vetëm për zhvillim", "Nur zur Entwicklung"), p: x("The result does not count towards the manager's pay or rating, so that people answer honestly.", "Rezultati nuk llogaritet te paga ose vlerësimi i menaxherit, që njerëzit të përgjigjen sinqerisht.", "Das Ergebnis fließt nicht in Gehalt oder Beurteilung ein, damit ehrlich geantwortet wird.") },
        ] },
        { type: "pairs", from: "2010", to: "2012", max: 100, source: ["bock-2015"],
          label: x("Google managers' scores in the team survey", "Nota e menaxherëve të Google në anketën e ekipit", "Bewertung der Google-Führungskräfte in der Teamumfrage"),
          rows: [
            { k: x("All managers", "Të gjithë menaxherët", "Alle Führungskräfte"), a: 83, an: pc(83), b: 88, bn: pc(88) },
            { k: x("The weakest quarter", "Çereku më i dobët", "Das schwächste Viertel"), a: 70, an: pc(70), b: 77, bn: pc(77) },
          ],
          note: x(
            "Bock presents this as a result of the programme. It was not a controlled experiment, so we read it as a direction, not as proof.",
            "Bock e paraqet si rezultat të programit. Nuk ishte eksperiment i kontrolluar, prandaj e lexojmë si drejtim, jo si provë.",
            "Bock stellt das als Ergebnis des Programms dar. Es war kein kontrolliertes Experiment, deshalb lesen wir es als Richtung, nicht als Beweis.") },
      ],
      note: x("The survey as Google described it in 2017.", "Anketa siç e përshkroi Google në 2017.", "Die Umfrage, wie Google sie 2017 beschrieb."),
      source: ["quartz-2017", "bock-2015"],
    },
    {
      id: "tool", more: "the-operations-manager-i-want-to-be",
      kicker: x("Tool of the week", "Mjeti i javës", "Werkzeug der Woche"),
      title: [x("The ten-behaviour", "Karta e", "Die Karte der"), x("card", "dhjetë sjelljeve", "zehn Verhaltensweisen")],
      lead: x(
        "Fill it in yourself, then ask your team to fill it in without names. The gap between the two is where the work starts.",
        "Plotësoje vetë, pastaj kërkoji ekipit ta plotësojë pa emra. Diferenca mes të dyjave është vendi ku fillon puna.",
        "Füllen Sie sie selbst aus und bitten Sie dann das Team, sie ohne Namen auszufüllen. Der Unterschied zwischen beiden ist der Punkt, an dem die Arbeit beginnt."),
      blocks: [
        { type: "rating", scale: ["1", "2", "3", "4", "5"],
          key: x("1 = rarely · 5 = always", "1 = rrallë · 5 = gjithmonë", "1 = selten · 5 = immer"),
          items: [
            x("Gives me feedback that helps me improve.", "Më jep feedback që më ndihmon të përmirësohem.", "Gibt mir Feedback, das mir hilft, besser zu werden."),
            x("Lets me decide, without checking every step.", "Më lë të vendos, pa më kontrolluar në çdo hap.", "Lässt mich entscheiden, ohne jeden Schritt zu prüfen."),
            x("Cares about me as a person, not only about the work.", "Kujdeset për mua si person, jo vetëm për punën.", "Kümmert sich um mich als Mensch, nicht nur um die Arbeit."),
            x("Keeps the team on its priorities, even under pressure.", "E mban ekipin te prioritetet, edhe kur ka presion.", "Hält das Team bei seinen Prioritäten, auch unter Druck."),
            x("Shares what they know and listens to us.", "Ndan me ne atë që di dhe na dëgjon.", "Teilt Informationen und hört uns zu."),
            x("Has talked with me about my development in the last six months.", "Ka folur me mua për zhvillimin tim në gjashtë muajt e fundit.", "Hat in den letzten sechs Monaten mit mir über meine Entwicklung gesprochen."),
            x("Makes it clear why we do the work we do.", "E bën të qartë pse e bëjmë punën që bëjmë.", "Macht klar, warum wir die Arbeit tun, die wir tun."),
            x("Knows our work well enough to advise us.", "E njeh punën tonë mjaftueshëm për të na këshilluar.", "Kennt unsere Arbeit gut genug, um uns zu beraten."),
            x("Works well with the other departments.", "Punon mirë me departamentet e tjera.", "Arbeitet gut mit den anderen Abteilungen zusammen."),
            x("Makes decisions in time, even hard ones.", "Merr vendime në kohë, edhe kur janë të vështira.", "Trifft Entscheidungen rechtzeitig, auch schwierige."),
          ] },
        { type: "box", title: x("After the card", "Pas kartës", "Nach der Karte"), items: [
          x("Pick the two behaviours with the biggest gap.", "Zgjidh dy sjelljet me diferencën më të madhe.", "Wählen Sie die zwei Verhaltensweisen mit dem größten Unterschied."),
          x("Tell the team what you will change, and how they will notice.", "Thuaji ekipit çfarë do të ndryshosh, dhe si do ta vërejnë.", "Sagen Sie dem Team, was Sie ändern und woran es das merkt."),
          x("Fill it in again after six months.", "Plotësojeni sërish pas gjashtë muajsh.", "Füllen Sie sie nach sechs Monaten erneut aus."),
        ] },
      ],
      note: x(
        "A practice proposed by the editors, after Google's survey. Do not use it for anyone's rating or pay.",
        "Praktikë e propozuar nga redaksia, sipas modelit të anketës së Google. Mos e përdor për vlerësimin ose pagën e askujt.",
        "Eine Praxis, die die Redaktion nach dem Vorbild der Google-Umfrage vorschlägt. Nicht für Beurteilung oder Gehalt verwenden."),
    },
    { id: "sources", type: "sources" },
    { id: "back", type: "back" },
  ],
};
