// Management Review, No. 15: Problem solving with A3 and Pareto. Block: Operations.
// Facts and their sources: docs/revista/management-review-nr-15.md.
import { x, pc } from "../common.js";

export default {
  number: 15,
  block: "operations",
  date: x("October 2026", "Tetor 2026", "Oktober 2026"),
  theme: [x("Problem solving", "Zgjidhja e problemeve", "Probleme lösen"), x("with A3 and Pareto", "me A3 dhe Pareto", "mit A3 und Pareto")],
  sub: x(
    "Why problems that are worked around come back, what the Pareto principle is and is not, how Toyota puts a problem on one sheet, and an A3 card to fill in.",
    "Pse problemet që anashkalohen kthehen, çfarë është dhe çfarë nuk është parimi i Paretos, si e vë Toyota një problem në një fletë, dhe një kartë A3 për ta plotësuar.",
    "Warum umgangene Probleme wiederkommen, was das Pareto-Prinzip ist und was nicht, wie Toyota ein Problem auf ein Blatt bringt, und eine A3-Karte zum Ausfüllen."),
  seo: x(
    "Problem solving with A3 and Pareto: nurses' workarounds, the principle Juran named after Pareto, Toyota's eight steps, a Pareto chart and an A3 card.",
    "Zgjidhja e problemeve me A3 dhe Pareto: anashkalimet e infermiereve, parimi që Juran e quajti Pareto, tetë hapat e Toyota-s dhe një kartë A3.",
    "Probleme lösen mit A3 und Pareto: Workarounds in Kliniken, das Prinzip, das Juran nach Pareto benannte, Toyotas acht Schritte und eine A3-Karte."),
  feature: x(
    "Issue 15 starts in nine hospitals where problems were worked around rather than solved, tells how Joseph Juran named a principle after Pareto and later took the name back, shows how Toyota puts a whole problem on one sheet and how a Pareto chart is drawn, and ends with an A3 card.",
    "Numri 15 nis në nëntë spitale ku problemet anashkaloheshin në vend që të zgjidheshin, tregon si Joseph Juran i vuri një parimi emrin e Paretos dhe më vonë e tërhoqi, tregon si e vë Toyota një problem të tërë në një fletë dhe si vizatohet diagrami Pareto, dhe mbyllet me një kartë A3.",
    "Ausgabe 15 beginnt in neun Krankenhäusern, in denen Probleme umgangen statt gelöst wurden, erzählt, wie Joseph Juran ein Prinzip nach Pareto benannte und den Namen später zurücknahm, zeigt, wie Toyota ein ganzes Problem auf ein Blatt bringt und wie man ein Pareto-Diagramm zeichnet, und endet mit einer A3-Karte."),
  figure: { n: x("239 h", "239 orë", "239 Std."), by: "Tucker & Edmondson, 2003", t: x(
    "of watching nurses in nine hospitals: most problems were worked around rather than fixed at the cause.",
    "vëzhgim i infermiereve në nëntë spitale: shumica e problemeve u anashkaluan, nuk u rregulluan te shkaku.",
    "Beobachtung von Pflegekräften in neun Kliniken: Die meisten Probleme wurden umgangen statt an der Ursache behoben.") },
  teasers: [
    { page: "story", kicker: x("Cover story", "Tema kryesore", "Titelthema"),
      title: x("Worked around, not solved", "Anashkaluar, jo zgjidhur", "Umgangen, nicht gelöst") },
    { page: "model", kicker: x("The model", "Modeli", "Das Modell"),
      title: x("One problem, one sheet", "Një problem, një fletë", "Ein Problem, ein Blatt") },
    { page: "tool", kicker: x("Tool of the issue", "Mjeti i numrit", "Werkzeug der Ausgabe"),
      title: x("The A3 card", "Karta A3", "Die A3-Karte") },
  ],
  sources: ["tucker-edmondson-2003", "juran-1974", "lei-a3", "shook-2009", "toyota-tbp", "ghosh-sobek-2015", "asq-pareto", "hse-accidents-2025"],
  pages: [
    { id: "cover", type: "cover" },
    {
      id: "intro", type: "intro",
      why: x(
        "Every operation has problems that come back every week: the same late start, the same missing part, the same complaint. This issue is about the difference between getting through the shift and making sure the problem does not return.",
        "Çdo operacion ka probleme që kthehen çdo javë: e njëjta nisje me vonesë, e njëjta pjesë që mungon, e njëjta ankesë. Ky numër flet për diferencën mes kalimit të turnit dhe sigurimit që problemi të mos kthehet.",
        "Jeder Betrieb hat Probleme, die jede Woche wiederkommen: derselbe späte Start, dasselbe fehlende Teil, dieselbe Beschwerde. Diese Ausgabe handelt vom Unterschied zwischen dem Überstehen der Schicht und der Gewissheit, dass das Problem nicht zurückkehrt."),
      body: x(
        "Researchers who followed nurses in nine hospitals found that most problems were worked around and few reached someone who could remove the cause. The Pareto chart shows where to start; Joseph Juran gave the idea Pareto's name and later admitted it was the wrong one. Toyota puts a whole problem, from the background to the follow-up, on one sheet of A3 paper. A study of 18 hospital projects suggests that following the steps matters.",
        "Studiuesit që ndoqën infermieret në nëntë spitale gjetën se shumica e problemeve anashkaloheshin dhe pak arrinin te dikush që mund ta hiqte shkakun. Diagrami Pareto tregon ku të nisësh; Joseph Juran i vuri idesë emrin e Paretos dhe më vonë pranoi se ishte emri i gabuar. Toyota e vë një problem të tërë, nga sfondi te ndjekja, në një fletë A3. Një studim me 18 projekte në një spital sugjeron se ndjekja e hapave ka rëndësi.",
        "Forschende, die Pflegekräfte in neun Kliniken begleiteten, fanden, dass die meisten Probleme umgangen wurden und nur wenige jemanden erreichten, der die Ursache beseitigen konnte. Das Pareto-Diagramm zeigt, wo man anfängt; Joseph Juran gab der Idee Paretos Namen und räumte später ein, dass es der falsche war. Toyota bringt ein ganzes Problem, vom Hintergrund bis zur Nachverfolgung, auf ein A3-Blatt. Eine Studie mit 18 Klinikprojekten legt nahe, dass es sich lohnt, den Schritten zu folgen."),
    },
    {
      id: "story",
      kicker: x("Cover story", "Tema kryesore", "Titelthema"),
      title: [x("Worked around,", "Anashkaluar,", "Umgangen,"), x("not solved", "jo zgjidhur", "nicht gelöst")],
      lead: x(
        "Anita Tucker and Amy Edmondson followed nurses in nine hospitals as they met failures in their daily work, and recorded what they did next.",
        "Anita Tucker dhe Amy Edmondson ndoqën infermieret në nëntë spitale ndërsa përballeshin me dështime në punën e përditshme, dhe shënuan çfarë bënin më pas.",
        "Anita Tucker und Amy Edmondson begleiteten Pflegekräfte in neun Krankenhäusern, wenn sie im Alltag auf Störungen trafen, und hielten fest, was sie dann taten."),
      blocks: [
        { type: "figures", compact: true, items: [
          { n: x("239 h", "239 orë", "239 Std."), t: x("of observation on the wards", "vëzhgim në pavijone", "Beobachtung auf den Stationen") },
          { n: "26", t: x("nurses followed through their shifts", "infermiere të ndjekura gjatë turneve", "Pflegekräfte durch ihre Schichten begleitet") },
          { n: "9", t: x("hospitals", "spitale", "Krankenhäuser") },
        ] },
        { type: "lists", cols: [
          { h: x("First-order problem solving", "Zgjidhja e rendit të parë", "Problemlösung erster Ordnung"), items: [
            x("The nurse finds a way around the problem", "Infermierja gjen një mënyrë për ta anashkaluar problemin", "Die Pflegekraft findet einen Weg um das Problem herum"),
            x("The patient is served, the shift goes on", "Pacienti merr shërbimin, turni vazhdon", "Der Patient wird versorgt, die Schicht läuft weiter"),
            x("The cause stays where it was", "Shkaku mbetet aty ku ishte", "Die Ursache bleibt, wo sie war"),
          ] },
          { h: x("Second-order problem solving", "Zgjidhja e rendit të dytë", "Problemlösung zweiter Ordnung"), accent: true, items: [
            x("The nurse deals with the immediate problem", "Infermierja merret me problemin e çastit", "Die Pflegekraft löst das akute Problem"),
            x("and tells someone who can change the cause", "dhe i tregon dikujt që mund ta ndryshojë shkakun", "und sagt es jemandem, der die Ursache ändern kann"),
            x("The next shift may not meet it again", "Turni tjetër mund të mos e hasë më", "Die nächste Schicht trifft es vielleicht nicht mehr"),
          ] },
        ] },
        { type: "p", text: x(
          "Working around was the dominant response. The nurses were not careless: under time pressure they got the job done, and in doing so kept the problem out of sight of the people who could remove it.",
          "Anashkalimi ishte reagimi mbizotërues. Infermieret nuk ishin të pakujdesshme: nën presionin e kohës e kryen punën, dhe duke e bërë këtë e mbajtën problemin larg syve të atyre që mund ta hiqnin.",
          "Das Umgehen war die vorherrschende Reaktion. Die Pflegekräfte waren nicht nachlässig: Unter Zeitdruck erledigten sie die Arbeit und hielten das Problem dabei von denen fern, die es hätten beseitigen können.") },
        { type: "callout", reading: true, text: x(
          "A workaround solves the problem for one shift. It also hides it from everyone who could make sure it does not come back.",
          "Anashkalimi e zgjidh problemin për një turn. Por edhe e fsheh nga të gjithë ata që mund të siguronin që të mos kthehej.",
          "Ein Workaround löst das Problem für eine Schicht. Er verbirgt es aber auch vor allen, die dafür sorgen könnten, dass es nicht wiederkommt.") },
      ],
      source: ["tucker-edmondson-2003"],
    },
    {
      id: "principle", more: "pareto-and-5-why-in-practice",
      kicker: x("The principle", "Parimi", "Das Prinzip"),
      title: [x("A principle with", "Një parim", "Ein Prinzip mit"), x("the wrong name", "me emër të gabuar", "falschem Namen")],
      lead: x(
        "In the mid-1920s a young engineer, Joseph Juran, noticed that quality defects are not equal in frequency: a few kinds make up most of them. Years later he gave the idea the name of the Italian economist Vilfredo Pareto.",
        "Në mesin e viteve '20, një inxhinier i ri, Joseph Juran, vuri re se defektet e cilësisë nuk janë të barabarta në shpeshtësi: pak lloje përbëjnë shumicën e tyre. Vite më vonë, idesë i vuri emrin e ekonomistit italian Vilfredo Pareto.",
        "Mitte der 1920er-Jahre bemerkte ein junger Ingenieur, Joseph Juran, dass Qualitätsfehler nicht gleich häufig sind: Wenige Arten machen die meisten aus. Jahre später gab er der Idee den Namen des italienischen Ökonomen Vilfredo Pareto."),
      blocks: [
        { type: "timeline", items: [
          { k: "1896", t: x("Pareto publishes his work on the unequal distribution of incomes.", "Pareto boton punën e tij për shpërndarjen e pabarabartë të të ardhurave.", "Pareto veröffentlicht seine Arbeit zur ungleichen Verteilung der Einkommen.") },
          { k: x("1920s", "Vitet '20", "1920er"), t: x("Juran sees that a few kinds of defects make up most of them.", "Juran sheh se pak lloje defektesh përbëjnë shumicën.", "Juran sieht, dass wenige Fehlerarten die meisten ausmachen.") },
          { k: "1974", t: x("Juran's “Mea culpa”: the name was a mistake. It stays anyway.", "“Mea culpa” e Juranit: emri ishte gabim. Mbetet sidoqoftë.", "Jurans „Mea culpa“: Der Name war ein Fehler. Er bleibt trotzdem.") },
        ] },
        { type: "quote", text: x(
          "I was forced to confess that I had mistakenly applied the wrong name to the principle.",
          "U detyrova të pranoj se gabimisht i kisha vënë parimit emrin e gabuar.",
          "Ich musste gestehen, dass ich dem Prinzip irrtümlich den falschen Namen gegeben hatte.") },
        { type: "p", text: x(
          "That is how Juran put it in 1974. He had called it the principle of “the vital few and the trivial many”. Pareto had written about wealth and incomes, not about defects; the step to quality was Juran's. Later Juran preferred “the vital few and the useful many”, so that the rest would not be read as worthless.",
          "Kështu e tha Juran në 1974. E kishte quajtur “parimi i pakëve vendimtarë dhe shumëve të parëndësishëm”. Pareto kishte shkruar për pasurinë dhe të ardhurat, jo për defektet; hapi drejt cilësisë ishte i Juranit. Më vonë Juran preferoi “pakët vendimtarë dhe shumët e dobishëm”, që pjesa tjetër të mos lexohej si e pavlerë.",
          "So formulierte es Juran 1974. Er hatte es das Prinzip der „wenigen Wesentlichen und vielen Unwesentlichen“ genannt. Pareto hatte über Vermögen und Einkommen geschrieben, nicht über Fehler; der Schritt zur Qualität war Jurans. Später bevorzugte Juran „die wenigen Wesentlichen und die nützlichen Vielen“, damit der Rest nicht als wertlos gelesen wird.") },
        { type: "callout", reading: true, text: x(
          "80/20 is not a law of nature. It is a reminder to count before you decide where to start.",
          "80/20 nuk është ligj i natyrës. Është një kujtesë që të numërosh para se të vendosësh ku të nisësh.",
          "80/20 ist kein Naturgesetz. Es ist eine Erinnerung, erst zu zählen und dann zu entscheiden, wo man anfängt.") },
      ],
      note: x(
        "Juran's paper is dated 1974 in the copy of the Juran Institute; a bibliography lists it in Quality Progress in May 1975.",
        "Punimi i Juranit mban datën 1974 te kopja e Juran Institute; një bibliografi e jep te Quality Progress në maj 1975.",
        "Jurans Aufsatz trägt in der Kopie des Juran Institute das Jahr 1974; eine Bibliografie führt ihn in Quality Progress, Mai 1975."),
      source: ["juran-1974"],
    },
    {
      id: "model",
      kicker: x("The model", "Modeli", "Das Modell"),
      title: [x("One problem,", "Një problem,", "Ein Problem,"), x("one sheet", "një fletë", "ein Blatt")],
      lead: x(
        "The A3 report is a practice Toyota pioneered: the problem, the analysis, the countermeasures and the plan on a single sheet of A3 paper, 297 × 420 mm. John Shook calls it standardised storytelling.",
        "Raporti A3 është një praktikë që e nisi Toyota: problemi, analiza, kundërmasat dhe plani në një fletë të vetme A3, 297 × 420 mm. John Shook e quan rrëfim të standardizuar.",
        "Der A3-Bericht ist eine Praxis, die Toyota begründet hat: Problem, Analyse, Gegenmaßnahmen und Plan auf einem einzigen A3-Blatt, 297 × 420 mm. John Shook nennt ihn standardisiertes Erzählen."),
      blocks: [
        { type: "rows", compact: true, items: [
          { h: x("Background", "Sfondi", "Hintergrund"), p: x("Why this problem matters now.", "Pse ky problem ka rëndësi tani.", "Warum dieses Problem jetzt zählt.") },
          { h: x("Current condition", "Gjendja aktuale", "Ist-Zustand"), p: x("What happens today, drawn and measured.", "Çfarë ndodh sot, e vizatuar dhe e matur.", "Was heute passiert, gezeichnet und gemessen.") },
          { h: x("Goal", "Qëllimi", "Ziel"), p: x("What will be different, by how much, by when.", "Çfarë do të ndryshojë, sa dhe deri kur.", "Was anders sein wird, um wie viel, bis wann.") },
          { h: x("Analysis", "Analiza", "Analyse"), p: x("Why it happens: the cause behind the cause.", "Pse ndodh: shkaku pas shkakut.", "Warum es passiert: die Ursache hinter der Ursache.") },
          { h: x("Countermeasures", "Kundërmasat", "Gegenmaßnahmen"), p: x("What will change, aimed at the cause, not the symptom.", "Çfarë do të ndryshojë, drejt shkakut, jo simptomës.", "Was sich ändert, gezielt auf die Ursache, nicht das Symptom.") },
          { h: x("Plan", "Plani", "Plan"), p: x("Who does what, by when.", "Kush bën çfarë, deri kur.", "Wer macht was, bis wann.") },
          { h: x("Follow-up", "Ndjekja", "Nachverfolgung"), p: x("How the result is checked, and what happens if it does not come.", "Si kontrollohet rezultati, dhe çfarë ndodh nëse nuk vjen.", "Wie das Ergebnis geprüft wird und was geschieht, wenn es ausbleibt.") },
        ] },
        { type: "p", text: x(
          "Shook writes that managers use the A3 to teach others to find root causes and think with evidence, and to bring people and departments to agreement.",
          "Shook shkruan se menaxherët e përdorin A3 për t'u mësuar të tjerëve të gjejnë shkakun rrënjë dhe të mendojnë me prova, dhe për t'i sjellë njerëzit dhe departamentet te një marrëveshje.",
          "Shook schreibt, dass Führungskräfte das A3 nutzen, um anderen beizubringen, Grundursachen zu finden und mit Belegen zu denken, und um Menschen und Abteilungen zu einer Einigung zu bringen.") },
        { type: "callout", reading: true, text: x(
          "The sheet is small on purpose. If the problem does not fit on one page, it has not been understood yet.",
          "Fleta është e vogël me qëllim. Nëse problemi nuk futet në një faqe, ende nuk është kuptuar.",
          "Das Blatt ist absichtlich klein. Wenn das Problem nicht auf eine Seite passt, ist es noch nicht verstanden.") },
      ],
      note: x(
        "The sections follow Shook and the Lean Enterprise Institute; the descriptions are the editors'.",
        "Pjesët ndjekin Shook dhe Lean Enterprise Institute; përshkrimet janë të redaksisë.",
        "Die Abschnitte folgen Shook und dem Lean Enterprise Institute; die Beschreibungen stammen von der Redaktion."),
      source: ["lei-a3", "shook-2009"],
    },
    {
      id: "method",
      kicker: x("How it is applied", "Si zbatohet", "Wie man es anwendet"),
      title: [x("Eight steps", "Tetë hapa", "Acht Schritte"), x("and a check", "dhe një kontroll", "und eine Prüfung")],
      lead: x(
        "In 2004 Toyota gathered its ways of solving problems into the Toyota Business Practices: eight steps, from describing the problem to making the solution the new standard.",
        "Në 2004, Toyota i mblodhi mënyrat e veta të zgjidhjes së problemeve te Toyota Business Practices: tetë hapa, nga përshkrimi i problemit deri te kthimi i zgjidhjes në standard të ri.",
        "2004 fasste Toyota seine Wege der Problemlösung in den Toyota Business Practices zusammen: acht Schritte, von der Beschreibung des Problems bis zur Lösung als neuem Standard."),
      blocks: [
        { type: "lists", cols: [
          { h: x("Plan", "Planifiko", "Planen"), items: [
            x("1 Clarify the problem", "1 Qartëso problemin", "1 Das Problem klären"),
            x("2 Break it down", "2 Ndaje në pjesë", "2 Es zerlegen"),
            x("3 Set a target", "3 Vendos objektivin", "3 Ein Ziel setzen"),
            x("4 Find the root cause", "4 Gjej shkakun rrënjë", "4 Die Grundursache finden"),
            x("5 Develop countermeasures", "5 Harto kundërmasat", "5 Gegenmaßnahmen entwickeln"),
          ] },
          { h: x("Do, check, act", "Bëj, kontrollo, vepro", "Tun, prüfen, handeln"), accent: true, items: [
            x("6 See the countermeasures through", "6 Zbatoji kundërmasat deri në fund", "6 Die Gegenmaßnahmen umsetzen"),
            x("7 Check the results and the process", "7 Kontrollo rezultatet dhe procesin", "7 Ergebnisse und Prozess prüfen"),
            x("8 Make what worked the standard", "8 Bëje standard atë që funksionoi", "8 Was funktioniert hat, zum Standard machen"),
          ] },
        ] },
        { type: "p", text: x(
          "A study by Ghosh and Sobek looked at 18 improvement projects in one hospital. The projects that followed all the steps of the problem-solving routine improved more. It is one hospital and a correlation, not proof.",
          "Një studim i Ghosh dhe Sobek shqyrtoi 18 projekte përmirësimi në një spital. Projektet që ndoqën të gjithë hapat e rutinës së zgjidhjes së problemit u përmirësuan më shumë. Është një spital dhe një lidhje, jo provë.",
          "Eine Studie von Ghosh und Sobek untersuchte 18 Verbesserungsprojekte in einem Krankenhaus. Die Projekte, die allen Schritten der Problemlösungsroutine folgten, verbesserten sich stärker. Es ist ein Krankenhaus und ein Zusammenhang, kein Beweis.") },
        { type: "callout", reading: true, text: x(
          "Many attempts fail at step one: the problem is written as a solution, “we need more people”, instead of as a gap between what should happen and what does.",
          "Shumë përpjekje dështojnë te hapi i parë: problemi shkruhet si zgjidhje, “na duhen më shumë njerëz”, në vend që të shkruhet si diferencë mes asaj që duhet të ndodhë dhe asaj që ndodh.",
          "Viele Versuche scheitern an Schritt eins: Das Problem wird als Lösung formuliert, „wir brauchen mehr Leute“, statt als Lücke zwischen dem, was passieren soll, und dem, was passiert.") },
      ],
      note: x(
        "The steps are Toyota's, in our words; the grouping into plan, do, check and act follows summaries of the method.",
        "Hapat janë të Toyota-s, me fjalët tona; grupimi në planifiko, bëj, kontrollo dhe vepro ndjek përmbledhjet e metodës.",
        "Die Schritte stammen von Toyota, in unseren Worten; die Gruppierung in Planen, Tun, Prüfen und Handeln folgt Zusammenfassungen der Methode."),
      source: ["toyota-tbp", "ghosh-sobek-2015"],
    },
    {
      id: "measure", tool: "/tools/pareto/",
      kicker: x("How it is measured", "Si matet", "Wie man es misst"),
      title: [x("A Pareto chart", "Diagrami Pareto", "Ein Pareto-Diagramm"), x("in four steps", "në katër hapa", "in vier Schritten")],
      lead: x(
        "As ASQ describes it, the chart sorts the bars from the longest to the shortest and adds them up with a line.",
        "Siç e përshkruan ASQ, diagrami i rendit shtyllat nga më e gjata te më e shkurtra dhe i mbledh me një vijë.",
        "Wie ASQ es beschreibt, ordnet das Diagramm die Balken vom längsten zum kürzesten und summiert sie mit einer Linie auf."),
      blocks: [
        { type: "rows", compact: true, items: [
          { h: x("Choose one measure", "Zgjidh një masë", "Ein Maß wählen"), p: x("A count or a cost, over one period.", "Një numër ose një kosto, për një periudhë.", "Eine Anzahl oder Kosten, über einen Zeitraum.") },
          { h: x("Group by cause", "Grupo sipas shkakut", "Nach Ursache gruppieren"), p: x("Categories you can act on; “other” goes last.", "Kategori mbi të cilat mund të veprosh; “të tjera” në fund.", "Kategorien, bei denen man handeln kann; „Sonstiges“ zuletzt.") },
          { h: x("Sort and add up", "Rendit dhe mblidh", "Sortieren und aufsummieren"), p: x("Longest bar first, then the running percentage. Start on the left.", "Shtylla më e gjatë e para, pastaj përqindja që mblidhet. Nis nga e majta.", "Längster Balken zuerst, dann der laufende Prozentwert. Links anfangen.") },
          { h: x("Draw it again", "Vizatoje sërish", "Neu zeichnen"), p: x("After the change, for the same period and the same categories.", "Pas ndryshimit, për të njëjtën periudhë dhe të njëjtat kategori.", "Nach der Änderung, für denselben Zeitraum und dieselben Kategorien.") },
        ] },
        { type: "hbars", max: 40, source: ["hse-accidents-2025"],
          label: x("Reported injuries to employees by kind, Great Britain, 2024/25", "Lëndimet e raportuara sipas llojit, Britania e Madhe, 2024/25", "Gemeldete Verletzungen nach Art, Großbritannien, 2024/25"),
          items: [
            { k: x("Slip, trip or fall on the same level", "Rrëshqitje, pengim ose rrëzim në të njëjtin nivel", "Ausrutschen, Stolpern, Sturz auf gleicher Ebene"), v: 30, n: pc(30), alert: true },
            { k: x("Handling, lifting or carrying", "Trajtim, ngritje ose mbajtje peshash", "Heben, Tragen, Handhaben"), v: 17, n: pc(17), alert: true },
            { k: x("Struck by a moving object", "Goditje nga një objekt në lëvizje", "Von bewegtem Gegenstand getroffen"), v: 10, n: pc(10) },
            { k: x("Act of violence", "Akt dhune", "Gewalttat"), v: 10, n: pc(10) },
            { k: x("Fall from a height", "Rënie nga lartësia", "Absturz aus der Höhe"), v: 8, n: pc(8) },
          ] },
        { type: "p", text: x(
          "Sorted, the first two kinds make up 47% of the injuries employers reported, the first five 75%. A safety A3 would start with the first two bars.",
          "Të renditura, dy llojet e para përbëjnë 47% të lëndimeve që raportuan punëdhënësit, pesë të parat 75%. Një A3 për sigurinë do të niste me dy shtyllat e para.",
          "Sortiert machen die ersten beiden Arten 47 % der gemeldeten Verletzungen aus, die ersten fünf 75 %. Ein A3 zur Sicherheit begänne bei den ersten beiden Balken.") },
      ],
      note: x(
        "Data: HSE, injuries employers must report (RIDDOR). The sums and the steps are the editors'.",
        "Të dhënat: HSE, lëndimet që punëdhënësit duhet t'i raportojnë (RIDDOR). Shumat dhe hapat janë të redaksisë.",
        "Daten: HSE, meldepflichtige Verletzungen (RIDDOR). Summen und Schritte stammen von der Redaktion."),
      source: ["asq-pareto", "hse-accidents-2025"],
    },
    {
      id: "tool", tool: "/tools/five-whys/",
      kicker: x("Tool of the issue", "Mjeti i numrit", "Werkzeug der Ausgabe"),
      title: [x("The", "Karta", "Die"), x("A3 card", "A3", "A3-Karte")],
      lead: x(
        "One sheet for one problem. Fill it in with the people who do the work, and in pencil: the sheet changes as you learn.",
        "Një fletë për një problem. Plotësoje me njerëzit që e bëjnë punën, dhe me laps: fleta ndryshon ndërsa mëson.",
        "Ein Blatt für ein Problem. Mit den Menschen ausfüllen, die die Arbeit machen, und mit Bleistift: Das Blatt ändert sich, während man lernt."),
      blocks: [
        { type: "form", items: [
          { h: x("The problem and its owner", "Problemi dhe pronari i tij", "Das Problem und wer es trägt"), hint: x("in a few words, one name, a date", "me pak fjalë, një emër, një datë", "in wenigen Worten, ein Name, ein Datum") },
          { h: x("Background", "Sfondi", "Hintergrund"), hint: x("why it matters now", "pse ka rëndësi tani", "warum es jetzt zählt") },
          { h: x("Current condition", "Gjendja aktuale", "Ist-Zustand"), hint: x("what happens today, with a number", "çfarë ndodh sot, me një numër", "was heute passiert, mit einer Zahl") },
          { h: x("Goal", "Qëllimi", "Ziel"), hint: x("what changes, by how much, by when", "çfarë ndryshon, sa, deri kur", "was sich ändert, um wie viel, bis wann") },
          { h: x("Root cause", "Shkaku rrënjë", "Grundursache"), hint: x("why, and why again, until you reach something you can change", "pse, dhe sërish pse, derisa të arrish te diçka që mund ta ndryshosh", "warum, und noch einmal warum, bis zu etwas, das man ändern kann"), lines: 2 },
          { h: x("Countermeasures and plan", "Kundërmasat dhe plani", "Gegenmaßnahmen und Plan"), hint: x("what, who, by when", "çfarë, kush, deri kur", "was, wer, bis wann"), lines: 2 },
          { h: x("Follow-up", "Ndjekja", "Nachverfolgung"), hint: x("when you check, and what you do if the number does not move", "kur kontrollon, dhe çfarë bën nëse numri nuk lëviz", "wann man prüft und was man tut, wenn sich die Zahl nicht bewegt") },
        ] },
      ],
      note: x(
        "A practice proposed by the editors. The sections follow the Lean Enterprise Institute and John Shook.",
        "Praktikë e propozuar nga redaksia. Pjesët ndjekin Lean Enterprise Institute dhe John Shook.",
        "Eine Praxis, die die Redaktion vorschlägt. Die Abschnitte folgen dem Lean Enterprise Institute und John Shook."),
      source: ["lei-a3"],
    },
    { id: "sources", type: "sources" },
    { id: "back", type: "back" },
  ],
};
