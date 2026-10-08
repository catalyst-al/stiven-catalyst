// Management Review, No. 4: Psychological safety. Block: People.
// Facts and their sources: docs/revista/management-review-nr-04.md.
import { x, pc } from "../common.js";

export default {
  number: 4,
  block: "people",
  date: x("October 2026", "Tetor 2026", "Oktober 2026"),
  theme: [x("Psychological safety:", "Siguria psikologjike:", "Psychologische Sicherheit:"), x("when people speak up", "kur njerëzit flasin", "wenn Menschen sprechen")],
  sub: x(
    "What it is and what it is not, why Google put it first in its research on teams, and how a manager builds it, one shift at a time.",
    "Çfarë është dhe çfarë nuk është, pse Google e vuri të parën në kërkimin për ekipet, dhe si e ndërton një menaxher, turn pas turni.",
    "Was sie ist und was nicht, warum Google sie in der Teamforschung an die erste Stelle setzte und wie eine Führungskraft sie aufbaut, Schicht für Schicht."),
  seo: x(
    "Psychological safety: Edmondson's research, Google's Project Aristotle, a meta-analysis of 136 samples and seven questions to ask your own team.",
    "Siguria psikologjike: kërkimi i Edmondson, Project Aristotle i Google, një meta-analizë me 136 mostra dhe shtatë pyetje për ekipin tënd.",
    "Psychologische Sicherheit: die Forschung von Edmondson, Googles Project Aristotle, eine Meta-Analyse mit 136 Stichproben und sieben Fragen fürs Team."),
  feature: x(
    "Issue 4 starts in a hospital where the best teams reported more errors, follows the idea to Google's study of 180 teams, and ends with seven questions a manager can ask the team on Monday.",
    "Numri 4 nis në një spital ku ekipet më të mira raportonin më shumë gabime, e ndjek idenë deri te studimi i Google me 180 ekipe, dhe mbyllet me shtatë pyetje që një menaxher mund t'ia bëjë ekipit të hënën.",
    "Ausgabe 4 beginnt in einem Krankenhaus, in dem die besten Teams mehr Fehler meldeten, folgt der Idee bis zu Googles Studie mit 180 Teams und endet mit sieben Fragen, die eine Führungskraft am Montag dem Team stellen kann."),
  figure: { n: pc(43), by: "McKinsey, 2021", t: x(
    "of respondents in a McKinsey global survey report a positive climate in their team.",
    "e të anketuarve në një anketë globale të McKinsey raportojnë klimë pozitive në ekipin e tyre.",
    "der Befragten einer weltweiten McKinsey-Umfrage berichten von einem positiven Klima in ihrem Team.") },
  teasers: [
    { page: "story", kicker: x("Cover story", "Tema kryesore", "Titelthema"),
      title: x("The best teams reported more errors", "Ekipet më të mira raportonin më shumë gabime", "Die besten Teams meldeten mehr Fehler") },
    { page: "zones", kicker: x("What it is not", "Çfarë nuk është", "Was sie nicht ist"),
      title: x("Safety without standards is only comfort", "Siguria pa standarde është vetëm rehati", "Sicherheit ohne Anspruch ist nur Bequemlichkeit") },
    { page: "tool", kicker: x("Tool of the week", "Mjeti i javës", "Werkzeug der Woche"),
      title: x("Seven questions for your team", "Shtatë pyetje për ekipin tënd", "Sieben Fragen für Ihr Team") },
  ],
  sources: ["edmondson-1996", "edmondson-1999", "rework-teams", "frazier-2017", "mckinsey-2021", "edmondson-2018"],
  pages: [
    { id: "cover", type: "cover" },
    {
      id: "intro", type: "intro",
      why: x(
        "A team learns only from what its people dare to say: the mistake, the doubt, the question that sounds naive. This issue is about the climate that makes that possible, and about the manager's part in it.",
        "Një ekip mëson vetëm nga ajo që njerëzit e tij guxojnë të thonë: gabimi, dyshimi, pyetja që duket naive. Ky numër flet për klimën që e bën këtë të mundur, dhe për pjesën e menaxherit në të.",
        "Ein Team lernt nur aus dem, was seine Menschen auszusprechen wagen: den Fehler, den Zweifel, die Frage, die naiv klingt. Diese Ausgabe handelt vom Klima, das das möglich macht, und vom Anteil der Führungskraft daran."),
      body: x(
        "The idea comes from Amy Edmondson's research in the 1990s. Google found it at the top of its own study of teams in 2015, and a meta-analysis of 136 samples has since linked it to how people work and perform. It is also easy to misunderstand: psychological safety is not about being nice, and it does not mean lower standards.",
        "Ideja vjen nga kërkimet e Amy Edmondson në vitet '90. Google e gjeti në krye të studimit të vet për ekipet në 2015, dhe një meta-analizë me 136 mostra e ka lidhur që atëherë me mënyrën si punojnë dhe performojnë njerëzit. Është edhe e lehtë të keqkuptohet: siguria psikologjike nuk do të thotë të jesh i sjellshëm, dhe nuk do të thotë standarde më të ulëta.",
        "Die Idee stammt aus Amy Edmondsons Forschung in den 1990er-Jahren. Google fand sie 2015 an der Spitze der eigenen Teamstudie, und eine Meta-Analyse mit 136 Stichproben hat sie seither mit Arbeitsweise und Leistung verbunden. Sie wird auch leicht missverstanden: Psychologische Sicherheit heißt nicht, nett zu sein, und sie heißt nicht, Ansprüche zu senken."),
    },
    {
      id: "story",
      kicker: x("Cover story", "Tema kryesore", "Titelthema"),
      title: [x("The best teams", "Ekipet më të mira", "Die besten Teams"), x("reported more errors", "raportonin më shumë gabime", "meldeten mehr Fehler")],
      lead: x(
        "In the mid-1990s Amy Edmondson studied medication errors in hospital units. The units with better leadership and better relationships had more detected errors, not fewer.",
        "Në mesin e viteve '90, Amy Edmondson studioi gabimet me mjekimet në njësitë e një spitali. Njësitë me drejtim dhe marrëdhënie më të mira kishin më shumë gabime të zbuluara, jo më pak.",
        "Mitte der 1990er-Jahre untersuchte Amy Edmondson Medikationsfehler auf Krankenhausstationen. Die Stationen mit besserer Führung und besseren Beziehungen hatten mehr entdeckte Fehler, nicht weniger."),
      blocks: [
        { type: "p", text: x(
          "Edmondson's explanation: the number of detected errors depends on two things, how many happen and how many people are willing to report. Where people were not afraid, mistakes came to the surface and could be learned from. Three years later Edmondson defined the idea.",
          "Shpjegimi i Edmondson: numri i gabimeve të zbuluara varet nga dy gjëra, sa gabime ndodhin dhe sa njerëz janë të gatshëm t'i raportojnë. Aty ku njerëzit nuk kishin frikë, gabimet dilnin në sipërfaqe dhe nga to mësohej. Tre vjet më vonë, Edmondson e përkufizoi idenë.",
          "Edmondsons Erklärung: Die Zahl der entdeckten Fehler hängt von zwei Dingen ab, wie viele passieren und wie viele Menschen bereit sind, sie zu melden. Wo Menschen keine Angst hatten, kamen Fehler ans Licht und man konnte aus ihnen lernen. Drei Jahre später definierte Edmondson den Begriff.") },
        { type: "callout", label: x("Team psychological safety · Edmondson, 1999", "Siguria psikologjike e ekipit · Edmondson, 1999", "Psychologische Sicherheit im Team · Edmondson, 1999"), text: x(
          "A shared belief held by members of a team that the team is safe for interpersonal risk taking.",
          "Një bindje e përbashkët e anëtarëve të një ekipi se ekipi është i sigurt për të marrë rreziqe ndërpersonale.",
          "Die gemeinsame Überzeugung der Mitglieder eines Teams, dass das Team sicher ist für zwischenmenschliche Risiken.") },
        { type: "p", text: x(
          "Such risks include admitting a mistake or asking for help. The 1999 study looked at 51 work teams in a manufacturing company and found it linked to the team's learning behaviour.",
          "Rreziqe të tilla janë, për shembull, të pranosh një gabim ose të kërkosh ndihmë. Studimi i 1999 e pa në 51 ekipe pune në një kompani prodhuese dhe e gjeti të lidhur me sjelljen e të mësuarit në ekip.",
          "Solche Risiken sind etwa, einen Fehler zuzugeben oder um Hilfe zu bitten. Die Studie von 1999 untersuchte sie in 51 Arbeitsteams eines Produktionsunternehmens und fand einen Zusammenhang mit dem Lernverhalten des Teams.") },
        { type: "timeline", items: [
          { k: "1996", t: x("Hospital units: more errors detected where people speak up.", "Njësitë e spitalit: më shumë gabime të zbuluara aty ku njerëzit flasin.", "Krankenhausstationen: mehr entdeckte Fehler, wo Menschen sprechen.") },
          { k: "1999", t: x("The definition, tested in 51 work teams.", "Përkufizimi, i provuar në 51 ekipe pune.", "Die Definition, geprüft in 51 Arbeitsteams.") },
          { k: "2015", t: x("Google puts it first among five team dynamics.", "Google e vë të parën mes pesë dinamikave të ekipit.", "Google setzt sie an die erste Stelle von fünf Teamdynamiken.") },
          { k: "2017", t: x("A meta-analysis of 136 samples.", "Një meta-analizë me 136 mostra.", "Eine Meta-Analyse mit 136 Stichproben.") },
        ] },
        { type: "callout", reading: true, text: x(
          "A team that reports no problems is not always a team without problems. Sometimes it is a team where nobody speaks.",
          "Një ekip që nuk raporton probleme nuk është gjithmonë ekip pa probleme. Ndonjëherë është ekip ku askush nuk flet.",
          "Ein Team, das keine Probleme meldet, ist nicht immer ein Team ohne Probleme. Manchmal ist es ein Team, in dem niemand spricht.") },
      ],
      source: ["edmondson-1996", "edmondson-1999", "rework-teams", "frazier-2017"],
    },
    {
      id: "numbers",
      kicker: x("The numbers", "Shifrat", "Die Zahlen"),
      title: [x("What the research", "Çfarë thotë", "Was die Forschung"), x("says", "kërkimi", "sagt")],
      lead: x(
        "Two large bodies of evidence, one inside a single company, one across many studies, point the same way. A third shows how far most teams still are.",
        "Dy burime të mëdha të dhënash, njëri brenda një kompanie, tjetri nga shumë studime, tregojnë në të njëjtin drejtim. I treti tregon sa larg janë ende shumica e ekipeve.",
        "Zwei umfangreiche Untersuchungen, eine innerhalb eines Unternehmens, eine über viele Studien hinweg, weisen in dieselbe Richtung. Eine dritte zeigt, wie weit die meisten Teams noch entfernt sind."),
      blocks: [
        { type: "figures", items: [
          { n: x("180+", "180+", "180+"), t: x("Google teams studied in Project Aristotle", "ekipe të Google të studiuara te Project Aristotle", "Google-Teams, untersucht im Project Aristotle") },
          { n: x("200+", "200+", "200+"), t: x("interviews, and more than 250 team attributes", "intervista, dhe më shumë se 250 atribute ekipi", "Interviews und mehr als 250 Teammerkmale") },
          { n: x("5", "5", "5"), t: x("dynamics found, with psychological safety first", "dinamika të gjetura, me sigurinë psikologjike të parën", "gefundene Dynamiken, psychologische Sicherheit zuerst") },
        ] },
        { type: "figures", items: [
          { n: x("136", "136", "136"), t: x("independent samples in the 2017 meta-analysis", "mostra të pavarura te meta-analiza e 2017", "unabhängige Stichproben der Meta-Analyse von 2017") },
          { n: x("22,000+", "22.000+", "22.000+"), t: x("people in those samples", "persona në ato mostra", "Personen in diesen Stichproben") },
          { n: x("≈5,000", "≈5.000", "≈5.000"), t: x("groups and teams", "grupe dhe ekipe", "Gruppen und Teams") },
        ] },
        { type: "p", text: x(
          "The meta-analysis links psychological safety to task performance and to engagement. Most of the studies measured at one point in time, so they show a link, not proof of cause.",
          "Meta-analiza e lidh sigurinë psikologjike me performancën në detyrë dhe me angazhimin. Shumica e studimeve matën në një moment të vetëm, prandaj tregojnë një lidhje, jo provë shkaku.",
          "Die Meta-Analyse verbindet psychologische Sicherheit mit Aufgabenleistung und Engagement. Die meisten Studien maßen zu einem einzigen Zeitpunkt, sie zeigen also einen Zusammenhang, keinen Beweis für eine Ursache.") },
        { type: "donut", v: 43, n: pc(43), source: ["mckinsey-2021"], t: x(
          "of respondents in a McKinsey global survey during the pandemic reported a positive team climate. McKinsey found the leader's own behaviour had the most influence on it.",
          "e të anketuarve në një anketë globale të McKinsey gjatë pandemisë raportuan klimë pozitive në ekip. McKinsey gjeti se sjellja e vetë liderit ndikonte më shumë se çdo gjë tjetër.",
          "der Befragten einer weltweiten McKinsey-Umfrage während der Pandemie berichteten von einem positiven Teamklima. Laut McKinsey hatte das Verhalten der Führungskraft selbst den größten Einfluss darauf.") },
      ],
      source: ["rework-teams", "frazier-2017", "mckinsey-2021"],
    },
    {
      id: "model", more: "leading-people-without-losing-the-person",
      kicker: x("The model", "Modeli", "Das Modell"),
      title: [x("Five things", "Pesë gjëra", "Fünf Dinge"), x("that make a team work", "që e bëjnë ekipin të punojë", "die ein Team tragen")],
      lead: x(
        "Google's researchers found that how a team works together mattered more than who was on it. These are the five dynamics, with the question behind each, in our words.",
        "Kërkuesit e Google gjetën se si punon bashkë një ekip ka më shumë rëndësi se kush është në të. Këto janë pesë dinamikat, me pyetjen pas secilës, me fjalët tona.",
        "Die Forschenden von Google fanden, dass es mehr darauf ankommt, wie ein Team zusammenarbeitet, als wer dazugehört. Das sind die fünf Dynamiken, mit der Frage hinter jeder, in unseren Worten."),
      blocks: [
        { type: "rows", items: [
          { h: x("Psychological safety", "Siguria psikologjike", "Psychologische Sicherheit"), p: x("Can we take a risk on this team without feeling insecure or embarrassed?", "A mund të marrim një rrezik në këtë ekip pa u ndjerë të pasigurt ose në siklet?", "Können wir in diesem Team ein Risiko eingehen, ohne uns unsicher oder bloßgestellt zu fühlen?") },
          { h: x("Dependability", "Besueshmëria", "Verlässlichkeit"), p: x("Can we count on each other to do good work on time?", "A mund të mbështetemi te njëri-tjetri për punë të mirë dhe në kohë?", "Können wir uns darauf verlassen, dass alle gute Arbeit rechtzeitig liefern?") },
          { h: x("Structure and clarity", "Struktura dhe qartësia", "Struktur und Klarheit"), p: x("Are our goals, roles and plans clear?", "A janë të qarta objektivat, rolet dhe planet tona?", "Sind unsere Ziele, Rollen und Pläne klar?") },
          { h: x("Meaning", "Kuptimi", "Bedeutung"), p: x("Is the work personally important to each of us?", "A ka puna rëndësi personale për secilin prej nesh?", "Ist die Arbeit für jede und jeden von uns persönlich wichtig?") },
          { h: x("Impact", "Ndikimi", "Wirkung"), p: x("Do we believe that what we do matters?", "A besojmë se ajo që bëjmë ka rëndësi?", "Glauben wir, dass unsere Arbeit etwas bewirkt?") },
        ] },
        { type: "callout", reading: true, text: x(
          "The other four are hard to reach without the first. A team that does not dare to say “I am behind” cannot be dependable for long.",
          "Katër të tjerat arrihen me vështirësi pa të parën. Një ekip që nuk guxon të thotë “kam mbetur pas” nuk mund të jetë i besueshëm për shumë kohë.",
          "Die anderen vier sind ohne die erste schwer zu erreichen. Ein Team, das sich nicht traut zu sagen „Ich liege zurück“, kann nicht lange verlässlich sein.") },
      ],
      source: ["rework-teams"],
    },
    {
      id: "zones",
      kicker: x("What it is not", "Çfarë nuk është", "Was sie nicht ist"),
      title: [x("Safety without standards", "Siguria pa standarde", "Sicherheit ohne Anspruch"), x("is only comfort", "është vetëm rehati", "ist nur Bequemlichkeit")],
      lead: x(
        "Edmondson places psychological safety beside a second dimension: how high the standards are. Only the two together lead to learning.",
        "Edmondson e vendos sigurinë psikologjike pranë një dimensioni të dytë: sa të larta janë standardet. Vetëm të dyja bashkë të çojnë te të mësuarit.",
        "Edmondson stellt psychologische Sicherheit neben eine zweite Dimension: wie hoch die Ansprüche sind. Nur beide zusammen führen zum Lernen."),
      blocks: [
        { type: "matrix", y: x("Psychological safety", "Siguria psikologjike", "Psychologische Sicherheit"), x: x("Performance standards", "Standardet e punës", "Leistungsansprüche"), cells: [
          { h: x("Comfort", "Rehati", "Bequemlichkeit"), tone: "dim", where: x("high safety · low standards", "siguri e lartë · standarde të ulëta", "hohe Sicherheit · niedriger Anspruch"), p: x("People get on well, but little is asked of them, so little changes.", "Njerëzit shkojnë mirë, por u kërkohet pak, prandaj ndryshon pak.", "Man versteht sich gut, aber es wird wenig verlangt, also ändert sich wenig.") },
          { h: x("Learning", "Të mësuarit", "Lernen"), tone: "blue", where: x("high safety · high standards", "siguri e lartë · standarde të larta", "hohe Sicherheit · hoher Anspruch"), p: x("Demanding work, and people say what they see. This is where teams improve.", "Punë e kërkuar, dhe njerëzit thonë atë që shohin. Këtu ekipet përmirësohen.", "Anspruchsvolle Arbeit, und alle sagen, was sie sehen. Hier werden Teams besser.") },
          { h: x("Apathy", "Apati", "Apathie"), tone: "dim", where: x("low safety · low standards", "siguri e ulët · standarde të ulëta", "niedrige Sicherheit · niedriger Anspruch"), p: x("People are present, but they have stopped trying.", "Njerëzit janë aty, por kanë pushuar së përpjekuri.", "Die Menschen sind da, aber sie haben aufgehört, sich zu bemühen.") },
          { h: x("Anxiety", "Ankth", "Angst"), tone: "red", where: x("low safety · high standards", "siguri e ulët · standarde të larta", "niedrige Sicherheit · hoher Anspruch"), p: x("High targets and fear: mistakes are hidden, and help is not asked for.", "Objektiva të larta dhe frikë: gabimet fshihen dhe ndihma nuk kërkohet.", "Hohe Ziele und Angst: Fehler werden versteckt, um Hilfe wird nicht gebeten.") },
        ] },
        { type: "callout", reading: true, text: x(
          "Psychological safety is not being nice, and it is not lowering the bar. It is keeping the bar high and making it safe to say that you are not over it yet.",
          "Siguria psikologjike nuk është të jesh i butë, dhe nuk është të ulësh nivelin. Është ta mbash nivelin të lartë dhe ta bësh të sigurt të thuash se ende nuk e ke arritur.",
          "Psychologische Sicherheit heißt nicht, nett zu sein, und nicht, die Latte zu senken. Sie heißt, die Latte hoch zu halten und es sicher zu machen zu sagen, dass man noch nicht darüber ist.") },
      ],
      source: ["edmondson-2018"],
    },
    {
      id: "measure", more: "talking-to-someone-who-made-a-mistake",
      kicker: x("How it is measured", "Si matet", "Wie man es misst"),
      title: [x("Ask the team,", "Pyet ekipin,", "Das Team fragen,"), x("not yourself", "jo veten", "nicht sich selbst")],
      lead: x(
        "Edmondson measured psychological safety with seven statements that the members of a team rate, about mistakes, problems, differences, risk, help, trust and skills. The manager's own impression is not a measure.",
        "Edmondson e mati sigurinë psikologjike me shtatë pohime që i vlerësojnë anëtarët e ekipit, për gabimet, problemet, dallimet, rrezikun, ndihmën, besimin dhe aftësitë. Përshtypja e vetë menaxherit nuk është matje.",
        "Edmondson maß psychologische Sicherheit mit sieben Aussagen, die die Teammitglieder bewerten, zu Fehlern, Problemen, Unterschieden, Risiko, Hilfe, Vertrauen und Fähigkeiten. Der Eindruck der Führungskraft selbst ist keine Messung."),
      blocks: [
        { type: "steps", items: [
          { h: x("Anonymous", "Anonime", "Anonym"), p: x("Answers without names, and results only for the whole team.", "Përgjigje pa emra, dhe rezultate vetëm për gjithë ekipin.", "Antworten ohne Namen und Ergebnisse nur für das ganze Team.") },
          { h: x("Talk about the lowest item", "Fol për pyetjen me notën më të ulët", "Über die schwächste Aussage sprechen"), p: x("Not to find who scored it low, but to understand what makes it hard.", "Jo për të gjetur kush i dha notë të ulët, por për të kuptuar çfarë e vështirëson.", "Nicht um herauszufinden, wer sie niedrig bewertet hat, sondern um zu verstehen, was sie schwer macht.") },
          { h: x("Change one behaviour", "Ndrysho një sjellje", "Ein Verhalten ändern"), p: x("For example, thank the first person who brings bad news in the briefing.", "Për shembull, falënderoje personin e parë që sjell një lajm të keq në briefing.", "Zum Beispiel der ersten Person danken, die im Briefing eine schlechte Nachricht bringt.") },
          { h: x("Ask again", "Pyet përsëri", "Erneut fragen"), p: x("After two or three months, with the same questions.", "Pas dy ose tre muajsh, me të njëjtat pyetje.", "Nach zwei oder drei Monaten, mit denselben Fragen.") },
        ] },
        { type: "callout", reading: true, text: x(
          "The way a manager reacts to the first bad news decides whether there will be a second.",
          "Mënyra si reagon menaxheri ndaj lajmit të parë të keq vendos nëse do të ketë një të dytë.",
          "Wie eine Führungskraft auf die erste schlechte Nachricht reagiert, entscheidet, ob es eine zweite gibt.") },
      ],
      note: x("The four steps are a practice proposed by the editors.", "Katër hapat janë praktikë e propozuar nga redaksia.", "Die vier Schritte sind eine Praxis, die die Redaktion vorschlägt."),
      source: ["edmondson-1999"],
    },
    {
      id: "tool",
      kicker: x("Tool of the week", "Mjeti i javës", "Werkzeug der Woche"),
      title: [x("Seven questions", "Shtatë pyetje", "Sieben Fragen"), x("for your team", "për ekipin tënd", "für Ihr Team")],
      lead: x(
        "Ask each person to rate the seven statements without a name. Collect the cards, add them up, and talk about the lowest one together.",
        "Kërkoji secilit t'i vlerësojë shtatë pohimet pa emër. Mblidhi kartat, mblidhi notat, dhe flisni bashkë për më të ulëtin.",
        "Bitten Sie alle, die sieben Aussagen ohne Namen zu bewerten. Sammeln Sie die Karten ein, zählen Sie zusammen und sprechen Sie gemeinsam über die schwächste."),
      blocks: [
        { type: "rating", roomy: true, scale: ["1", "2", "3", "4", "5"],
          key: x("1 = not at all · 5 = completely", "1 = aspak · 5 = plotësisht", "1 = gar nicht · 5 = völlig"),
          items: [
            x("If I make a mistake here, it is not held against me.", "Nëse gaboj këtu, gabimi nuk më mbahet kundër.", "Wenn ich hier einen Fehler mache, wird er mir nicht vorgehalten."),
            x("We can bring up problems and difficult issues.", "Mund t'i ngremë problemet dhe çështjet e vështira.", "Wir können Probleme und schwierige Themen ansprechen."),
            x("Nobody is pushed aside for being different.", "Askush nuk lihet mënjanë sepse është ndryshe.", "Niemand wird ausgegrenzt, weil er oder sie anders ist."),
            x("It is safe to try something new here.", "Është e sigurt të provosh diçka të re këtu.", "Es ist sicher, hier etwas Neues auszuprobieren."),
            x("It is easy to ask the others for help.", "Është e lehtë t'u kërkosh ndihmë të tjerëve.", "Es ist leicht, die anderen um Hilfe zu bitten."),
            x("Nobody here would deliberately undermine my work.", "Askush këtu nuk do ta minonte me qëllim punën time.", "Niemand hier würde meine Arbeit absichtlich untergraben."),
            x("My skills are valued and used.", "Aftësitë e mia vlerësohen dhe përdoren.", "Meine Fähigkeiten werden geschätzt und genutzt."),
          ] },
        { type: "box", title: x("After the card", "Pas kartës", "Nach der Karte"), items: [
          x("Look at the statement with the lowest total.", "Shiko pohimin me shumën më të ulët.", "Die Aussage mit der niedrigsten Summe ansehen."),
          x("Ask the team what would make it a 5, and listen.", "Pyete ekipin çfarë do ta bënte 5, dhe dëgjo.", "Das Team fragen, was daraus eine 5 machen würde, und zuhören."),
          x("Fill it in again after two or three months.", "Përsërite kartën pas dy ose tre muajsh.", "Nach zwei oder drei Monaten erneut ausfüllen."),
        ] },
      ],
      note: x(
        "The statements are in our words, inspired by Edmondson's scale (1999). Use the card for the team, never to rate a person.",
        "Pohimet janë me fjalët tona, të frymëzuara nga shkalla e Edmondson (1999). Përdore kartën për ekipin, kurrë për të vlerësuar një person.",
        "Die Aussagen sind in unseren Worten, angelehnt an Edmondsons Skala (1999). Die Karte ist für das Team, nie zur Bewertung einer Person."),
    },
    { id: "sources", type: "sources" },
    { id: "back", type: "back" },
  ],
};
