// Management Review, No. 4: Psychological safety. Block: People.
// Facts and their sources: docs/revista/management-review-nr-04.md.
import { x, pc } from "../common.js";

export default {
  number: 4,
  block: "people",
  date: x("October 2026", "Tetor 2026", "Oktober 2026"),
  // Corrections made after publication, shown on the issue's page and its sources page.
  corrections: [
    {
      date: x("16 October 2026", "16 tetor 2026", "16. Oktober 2026"),
      t: x(
        "The introduction now places Amy Edmondson's 1996 study on hospital wards; it first said one hospital. Her study looked at care teams in two hospitals.",
        "Hyrja tani e vendos studimin e Amy Edmondson-it të vitit 1996 në repartet e spitaleve; fillimisht thoshte një spital. Studimi i saj shqyrtoi ekipe kujdesi në dy spitale.",
        "Die Einleitung verortet Amy Edmondsons Studie von 1996 jetzt auf Krankenhausstationen; zuerst hieß es: ein Krankenhaus. Ihre Studie untersuchte Pflegeteams in zwei Krankenhäusern."),
    },
  ],
  theme: [x("Psychological safety:", "Siguria psikologjike:", "Psychologische Sicherheit:"), x("when people speak up", "kur njerëzit flasin", "wenn Menschen sich zu Wort melden")],
  sub: x(
    "What it is and what it is not, why Google put it first in its research on teams, and how a manager builds it, one shift at a time.",
    "Çfarë është dhe çfarë nuk është, pse Google e vuri të parën në kërkimin për ekipet, dhe si e ndërton një menaxher, turn pas turni.",
    "Was sie ist und was nicht, warum Google sie in der Teamforschung an die erste Stelle setzte und wie eine Führungskraft sie aufbaut, Schicht für Schicht."),
  seo: x(
    "Psychological safety: Edmondson's research, Google's Project Aristotle, a meta-analysis of 136 samples and seven questions to ask your own team.",
    "Siguria psikologjike: kërkimi i Edmondson, Project Aristotle i Google-it, një meta-analizë me 136 mostra dhe shtatë pyetje për ekipin tënd.",
    "Psychologische Sicherheit: die Forschung von Edmondson, Googles Project Aristotle, eine Metaanalyse mit 136 Stichproben und sieben Fragen fürs Team."),
  feature: x(
    "Issue 4 opens on hospital wards where the best teams reported more errors. From there the idea leads to Google's study of 180 teams. The issue closes with seven questions a manager can put to the team on Monday.",
    "Numri 4 hapet në repartet e spitaleve, ku ekipet më të mira raportonin më shumë gabime. Prej andej ideja të çon te studimi i Google-it me 180 ekipe. Në fund vijnë shtatë pyetje që një menaxher mund t'ia bëjë ekipit të hënën.",
    "Ausgabe 4 beginnt auf Krankenhausstationen, auf denen die besten Teams mehr Fehler meldeten. Von dort führt die Idee zu Googles Studie mit 180 Teams. Am Ende stehen sieben Fragen, die Sie Ihrem Team am Montag stellen können."),
  figure: { n: pc(43), by: "McKinsey, 2021", t: x(
    "of respondents in a McKinsey global survey report a positive climate in their team.",
    "e të anketuarve në një anketë globale të McKinsey-t raportojnë klimë pozitive në ekipin e tyre.",
    "der Befragten einer weltweiten McKinsey-Umfrage berichten von einem positiven Klima in ihrem Team.") },
  teasers: [
    { page: "story", kicker: x("Cover story", "Tema kryesore", "Titelthema"),
      title: x("The best teams reported more errors", "Ekipet më të mira raportonin më shumë gabime", "Die besten Teams meldeten mehr Fehler") },
    { page: "zones", kicker: x("What it is not", "Çfarë nuk është", "Was sie nicht ist"),
      title: x("Safety without standards is only comfort", "Siguria pa standarde është vetëm rehati", "Sicherheit ohne Anspruch ist nur Bequemlichkeit") },
    { page: "tool", kicker: x("Tool of the issue", "Mjeti i numrit", "Werkzeug der Ausgabe"),
      title: x("Seven questions for your team", "Shtatë pyetje për ekipin tënd", "Sieben Fragen für Ihr Team") },
  ],
  sources: ["edmondson-1996", "edmondson-1999", "rework-teams", "frazier-2017", "mckinsey-2021", "edmondson-2018"],
  pages: [
    { id: "cover", type: "cover" },
    {
      id: "intro", type: "intro",
      why: x(
        "A team learns only from what its people dare to say: the mistake, the doubt, the question that sounds naive. The subject here is the climate that makes that possible, and the manager's part in it.",
        "Një ekip mëson vetëm nga ajo që njerëzit e tij guxojnë të thonë: gabimi, dyshimi, pyetja që duket naive. Këtu bëhet fjalë për klimën që e bën këtë të mundur dhe për rolin e menaxherit në të.",
        "Ein Team lernt nur aus dem, was seine Menschen auszusprechen wagen: den Fehler, den Zweifel, die Frage, die naiv klingt. Hier geht es um das Klima, das dies möglich macht, und um den Anteil der Führungskraft daran."),
      body: x(
        "The idea comes from Amy Edmondson's research in the 1990s. Google found it at the top of its own study of teams in 2015, and a meta-analysis of 136 samples has since linked it to how people work and perform. It is also easily mistaken for niceness, or for permission to lower standards.",
        "Ideja vjen nga kërkimet e Amy Edmondson në vitet '90. Google e gjeti në krye të studimit të vet për ekipet në vitin 2015, dhe një meta-analizë me 136 mostra e ka lidhur që atëherë me mënyrën si punojnë dhe performojnë njerëzit. Por ngatërrohet lehtë me mirësjelljen, ose me lejen për t'i ulur standardet.",
        "Die Idee stammt aus Amy Edmondsons Forschung in den 1990er-Jahren. Google fand sie 2015 an der Spitze der eigenen Teamstudie, und eine Metaanalyse mit 136 Stichproben hat sie seither mit Arbeitsweise und Leistung verbunden. Sie wird allerdings leicht mit Nettigkeit verwechselt oder mit der Erlaubnis, Ansprüche zu senken."),
    },
    {
      id: "story",
      kicker: x("Cover story", "Tema kryesore", "Titelthema"),
      title: [x("The best teams", "Ekipet më të mira", "Die besten Teams"), x("reported more errors", "raportonin më shumë gabime", "meldeten mehr Fehler")],
      lead: x(
        "In the mid-1990s Amy Edmondson studied medication errors in hospital units. The units with better leadership and better relationships had more detected errors, not fewer.",
        "Në mesin e viteve '90, Amy Edmondson studioi gabimet në dhënien e barnave në repartet e spitaleve. Repartet me drejtim dhe marrëdhënie më të mira kishin më shumë gabime të zbuluara, jo më pak.",
        "Mitte der 1990er-Jahre untersuchte Amy Edmondson Medikationsfehler auf Krankenhausstationen. Die Stationen mit besserer Führung und besseren Beziehungen hatten mehr entdeckte Fehler, nicht weniger."),
      blocks: [
        { type: "p", text: x(
          "Edmondson's explanation: the number of detected errors depends on two things, how many happen and how many people are willing to report. Where people were not afraid, mistakes came to the surface and could be learned from. Three years later Edmondson defined the idea.",
          "Shpjegimi i Edmondson: numri i gabimeve të zbuluara varet nga dy gjëra, sa gabime ndodhin dhe sa njerëz janë të gatshëm t'i raportojnë. Aty ku njerëzit nuk kishin frikë, gabimet dilnin në sipërfaqe dhe prej tyre mund të mësohej. Tre vjet më vonë, Edmondson e përkufizoi idenë.",
          "Edmondsons Erklärung: Die Zahl der entdeckten Fehler hängt von zwei Dingen ab, wie viele passieren und wie viele Menschen bereit sind, sie zu melden. Wo niemand Angst hatte, kamen Fehler ans Licht, und das Team konnte aus ihnen lernen. Drei Jahre später definierte Edmondson den Begriff.") },
        { type: "callout", label: x("Team psychological safety · Edmondson, 1999", "Siguria psikologjike e ekipit · Edmondson, 1999", "Psychologische Sicherheit im Team · Edmondson, 1999"), text: x(
          "A shared belief held by members of a team that the team is safe for interpersonal risk taking.",
          "Një bindje e përbashkët e anëtarëve të një ekipi se ekipi është i sigurt për të marrë rreziqe ndërpersonale.",
          "Die gemeinsame Überzeugung der Mitglieder eines Teams, dass im Team zwischenmenschliche Risiken gefahrlos eingegangen werden können.") },
        { type: "p", text: x(
          "Such risks include admitting a mistake or asking for help. The 1999 study looked at 51 work teams in a manufacturing company and found it linked to the team's learning behaviour.",
          "Rreziqe të tilla janë, për shembull, të pranosh një gabim ose të kërkosh ndihmë. Studimi i vitit 1999 e pa në 51 ekipe pune në një kompani prodhuese dhe gjeti se shkonte bashkë me mënyrën si mëson ekipi.",
          "Solche Risiken sind etwa, einen Fehler zuzugeben oder um Hilfe zu bitten. Die Studie von 1999 untersuchte sie in 51 Arbeitsteams eines Produktionsunternehmens und fand einen Zusammenhang mit dem Lernverhalten des Teams.") },
        { type: "timeline", items: [
          { k: "1996", t: x("Hospital units: more errors detected where people speak up.", "Repartet e spitalit: më shumë gabime të zbuluara aty ku njerëzit flasin.", "Krankenhausstationen: mehr entdeckte Fehler, wo Menschen sich äußern.") },
          { k: "1999", t: x("The definition, tested in 51 work teams.", "Përkufizimi, i provuar në 51 ekipe pune.", "Die Definition, geprüft in 51 Arbeitsteams.") },
          { k: "2015", t: x("Google puts it first among five team dynamics.", "Google e vë të parën mes pesë dinamikave të ekipit.", "Google setzt sie an die erste Stelle von fünf Teamdynamiken.") },
          { k: "2017", t: x("A meta-analysis of 136 samples.", "Një meta-analizë me 136 mostra.", "Eine Metaanalyse mit 136 Stichproben.") },
        ] },
        { type: "callout", reading: true, text: x(
          "When a team reports no problems, sometimes the reason is that nobody speaks.",
          "Kur një ekip nuk raporton asnjë problem, ndonjëherë arsyeja është se askush nuk flet.",
          "Wenn ein Team keine Probleme meldet, liegt das manchmal daran, dass niemand etwas sagt.") },
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
          { n: x("180+", "180+", "180+"), t: x("Google teams studied in Project Aristotle", "ekipe të Google-it të studiuara te Project Aristotle", "Google-Teams, untersucht im Project Aristotle") },
          { n: x("200+", "200+", "200+"), t: x("interviews, and more than 250 team attributes", "intervista, dhe më shumë se 250 atribute ekipi", "Interviews und mehr als 250 Teammerkmale") },
          { n: x("5", "5", "5"), t: x("dynamics found, with psychological safety first", "dinamika të gjetura, me sigurinë psikologjike të parën", "gefundene Dynamiken, psychologische Sicherheit zuerst") },
        ] },
        { type: "figures", items: [
          { n: x("136", "136", "136"), t: x("independent samples in the 2017 meta-analysis", "mostra të pavarura te meta-analiza e vitit 2017", "unabhängige Stichproben der Metaanalyse von 2017") },
          { n: x("22,000+", "22.000+", "22.000+"), t: x("people in those samples", "persona në ato mostra", "Personen in diesen Stichproben") },
          { n: x("≈5,000", "≈5.000", "≈5.000"), t: x("groups and teams", "grupe dhe ekipe", "Gruppen und Teams") },
        ] },
        { type: "p", text: x(
          "The meta-analysis links psychological safety to task performance and to engagement. Most of the studies measured at one point in time, so they show a link, not proof of cause.",
          "Meta-analiza e lidh sigurinë psikologjike me performancën në detyrë dhe me angazhimin. Shumica e studimeve matën në një moment të vetëm, prandaj tregojnë një lidhje, jo provë shkaku.",
          "Die Metaanalyse verbindet psychologische Sicherheit mit Aufgabenleistung und Engagement. Die meisten Studien maßen zu einem einzigen Zeitpunkt, sie zeigen also einen Zusammenhang, keinen Beweis für eine Ursache.") },
        { type: "donut", v: 43, n: pc(43), source: ["mckinsey-2021"],
          note: x(
            "Share of respondents in one McKinsey global survey, run during the pandemic (McKinsey, 2021). What people report about their own team.",
            "Pjesa e të anketuarve në një anketë globale të McKinsey-t, gjatë pandemisë (McKinsey, 2021). Ajo që raportojnë vetë për ekipin e tyre.",
            "Anteil der Befragten einer weltweiten McKinsey-Umfrage während der Pandemie (McKinsey, 2021). Eigene Angaben über das eigene Team."),
          t: x(
          "of respondents in a McKinsey global survey during the pandemic reported a positive team climate. McKinsey found the leader's own behaviour had the most influence on it.",
          "e të anketuarve në një anketë globale të McKinsey-t gjatë pandemisë raportuan klimë pozitive në ekip. Sipas McKinsey-t, sjellja e vetë drejtuesit ndikonte më shumë se çdo gjë tjetër.",
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
        "Studiuesit e Google-it gjetën se mënyra si punon bashkë një ekip ka më shumë rëndësi sesa kush bën pjesë në të. Këto janë pesë dinamikat, me pyetjen pas secilës, me fjalët tona.",
        "Die Forschenden von Google fanden, dass es mehr darauf ankommt, wie ein Team zusammenarbeitet, als wer dazugehört. Das sind die fünf Dynamiken, mit der Frage hinter jeder, in unseren Worten."),
      blocks: [
        { type: "rows", items: [
          { h: x("Psychological safety", "Siguria psikologjike", "Psychologische Sicherheit"), p: x("Can we take a risk on this team without feeling insecure or embarrassed?", "A mund të marrim një rrezik në këtë ekip pa u ndjerë të pasigurt ose në siklet?", "Können wir in diesem Team ein Risiko eingehen, ohne uns unsicher oder bloßgestellt zu fühlen?") },
          { h: x("Dependability", "Besueshmëria", "Verlässlichkeit"), p: x("Can we count on each other to do good work on time?", "A mund të mbështetemi në njëri-tjetrin për punë të mirë dhe në kohë?", "Können wir uns darauf verlassen, dass alle gute Arbeit rechtzeitig liefern?") },
          { h: x("Structure and clarity", "Struktura dhe qartësia", "Struktur und Klarheit"), p: x("Are our goals, roles and plans clear?", "A janë të qarta objektivat, rolet dhe planet tona?", "Sind unsere Ziele, Rollen und Pläne klar?") },
          { h: x("Meaning", "Kuptimi", "Bedeutung"), p: x("Is the work personally important to each of us?", "A ka puna rëndësi personale për secilin prej nesh?", "Ist die Arbeit für jede und jeden von uns persönlich wichtig?") },
          { h: x("Impact", "Ndikimi", "Wirkung"), p: x("Do we believe that what we do matters?", "A besojmë se ajo që bëjmë ka rëndësi?", "Glauben wir, dass unsere Arbeit etwas bewirkt?") },
        ] },
        { type: "callout", reading: true, text: x(
          "Without the first, the other four are hard to reach. A team that does not dare to say “I am behind” will not stay dependable for long.",
          "Katër të tjerat arrihen me vështirësi pa të parën. Një ekip që nuk guxon të thotë “kam mbetur pas” nuk mund të jetë i besueshëm për shumë kohë.",
          "Ohne die erste sind die anderen vier schwer zu erreichen. Ein Team, das sich nicht zu sagen traut „Ich liege zurück“, bleibt nicht lange verlässlich.") },
      ],
      source: ["rework-teams"],
    },
    {
      id: "zones",
      kicker: x("What it is not", "Çfarë nuk është", "Was sie nicht ist"),
      title: [x("Safety without standards", "Siguria pa standarde", "Sicherheit ohne Anspruch"), x("is only comfort", "është vetëm rehati", "ist nur Bequemlichkeit")],
      lead: x(
        "Edmondson places psychological safety beside a second dimension: how high the standards are. Only the two together lead to learning.",
        "Edmondson e vendos sigurinë psikologjike pranë një dimensioni të dytë: sa të larta janë standardet. Vetëm të dyja bashkë sjellin të mësuarit.",
        "Edmondson stellt psychologische Sicherheit neben eine zweite Dimension: wie hoch die Ansprüche sind. Nur beide zusammen führen zum Lernen."),
      blocks: [
        { type: "matrix", y: x("Psychological safety", "Siguria psikologjike", "Psychologische Sicherheit"), x: x("Performance standards", "Standardet e punës", "Leistungsansprüche"), cells: [
          { h: x("Comfort", "Rehati", "Bequemlichkeit"), tone: "dim", where: x("high safety · low standards", "siguri e lartë · standarde të ulëta", "hohe Sicherheit · niedriger Anspruch"), p: x("People get on well, but little is asked of them, so little changes.", "Njerëzit shkojnë mirë me njëri-tjetrin, por u kërkohet pak, prandaj ndryshon pak.", "Man versteht sich gut, aber es wird wenig verlangt, also ändert sich wenig.") },
          { h: x("Learning", "Të mësuarit", "Lernen"), tone: "blue", where: x("high safety · high standards", "siguri e lartë · standarde të larta", "hohe Sicherheit · hoher Anspruch"), p: x("Demanding work, and people say what they see. This is where teams improve.", "Punë kërkuese, dhe njerëzit thonë atë që shohin. Këtu ekipet përmirësohen.", "Anspruchsvolle Arbeit, und alle sagen, was sie sehen. Hier werden Teams besser.") },
          { h: x("Apathy", "Apati", "Apathie"), tone: "dim", where: x("low safety · low standards", "siguri e ulët · standarde të ulëta", "niedrige Sicherheit · niedriger Anspruch"), p: x("People are present, but they have stopped trying.", "Njerëzit janë aty, por kanë pushuar së përpjekuri.", "Die Menschen sind da, aber sie haben aufgehört, sich zu bemühen.") },
          { h: x("Anxiety", "Ankth", "Angst"), tone: "red", where: x("low safety · high standards", "siguri e ulët · standarde të larta", "niedrige Sicherheit · hoher Anspruch"), p: x("High targets and fear: mistakes are hidden, and help is not asked for.", "Objektiva të larta dhe frikë: gabimet fshihen dhe ndihma nuk kërkohet.", "Hohe Ziele und Angst: Fehler werden versteckt, um Hilfe wird nicht gebeten.") },
        ] },
        { type: "callout", reading: true, text: x(
          "Psychological safety leaves the bar where it was, high. What changes is that anyone can say, without risk, that they are not over it yet.",
          "Siguria psikologjike e lë nivelin aty ku ishte, lart. Ajo që ndryshon është se kushdo mund të thotë pa rrezik që ende nuk e ka arritur.",
          "Psychologische Sicherheit lässt die Latte, wo sie war: hoch. Neu ist, dass jeder gefahrlos sagen kann: Ich bin noch nicht darüber.") },
      ],
      source: ["edmondson-2018"],
    },
    {
      id: "measure", more: "talking-to-someone-who-made-a-mistake",
      kicker: x("How it is measured", "Si matet", "Wie es gemessen wird"),
      title: [x("Ask the team,", "Pyet ekipin,", "Das Team fragen,"), x("not yourself", "jo veten", "nicht sich selbst")],
      lead: x(
        "Edmondson measured psychological safety with seven statements that the members of a team rate, about mistakes, problems, differences, risk, help, trust and skills. The manager's own impression does not count as a measurement.",
        "Edmondson e mati sigurinë psikologjike me shtatë pohime që i vlerësojnë anëtarët e ekipit, për gabimet, problemet, dallimet, rrezikun, ndihmën, besimin dhe aftësitë. Përshtypja e vetë menaxherit nuk vlen si matje.",
        "Edmondson maß psychologische Sicherheit mit sieben Aussagen, die die Teammitglieder bewerten, zu Fehlern, Problemen, Unterschieden, Risiko, Hilfe, Vertrauen und Fähigkeiten. Der eigene Eindruck der Führungskraft gilt nicht als Messung."),
      blocks: [
        { type: "steps", items: [
          { h: x("Anonymous", "Anonime", "Anonym"), p: x("Answers without names, and results only for the whole team.", "Përgjigje pa emra, dhe rezultate vetëm për gjithë ekipin.", "Antworten ohne Namen und Ergebnisse nur für das ganze Team.") },
          { h: x("Talk about the lowest item", "Fol për pohimin me notën më të ulët", "Über die schwächste Aussage sprechen"), p: x("The aim is to understand what makes it hard. Who scored it low does not matter.", "Qëllimi është të kuptosh çfarë e vështirëson. Kush i dha notë të ulët nuk ka rëndësi.", "Ziel ist zu verstehen, was die Aussage schwer macht. Wer sie niedrig bewertet hat, spielt keine Rolle.") },
          { h: x("Change one behaviour", "Ndrysho një sjellje", "Ein Verhalten ändern"), p: x("For example, thank the first person who brings bad news in the briefing.", "Për shembull, falënderoje në takimin e shkurtër të ekipit personin e parë që sjell një lajm të keq.", "Danken Sie zum Beispiel in der Besprechung der ersten Person, die eine schlechte Nachricht überbringt.") },
          { h: x("Ask again", "Pyet përsëri", "Erneut fragen"), p: x("After two or three months, with the same questions.", "Pas dy ose tre muajsh, me të njëjtat pyetje.", "Nach zwei oder drei Monaten, mit denselben Fragen.") },
        ] },
        { type: "callout", reading: true, text: x(
          "The way a manager reacts to the first bad news decides whether there will be a second.",
          "Mënyra si reagon menaxheri ndaj lajmit të parë të keq vendos nëse do të ketë një të dytë.",
          "Wie eine Führungskraft auf die erste schlechte Nachricht reagiert, entscheidet, ob es eine zweite gibt.") },
      ],
      note: x("The editors propose the four steps as a practice.", "Katër hapat i propozon redaksia si praktikë.", "Die vier Schritte schlägt die Redaktion als Praxis vor."),
      source: ["edmondson-1999"],
    },
    {
      id: "tool",
      kicker: x("Tool of the issue", "Mjeti i numrit", "Werkzeug der Ausgabe"),
      title: [x("Seven questions", "Shtatë pyetje", "Sieben Fragen"), x("for your team", "për ekipin tënd", "für Ihr Team")],
      lead: x(
        "Ask each person to rate the seven statements without a name. Collect the cards, add them up, and talk about the lowest one together.",
        "Kërkoji secilit t'i vlerësojë shtatë pohimet pa emër. Mblidhi kartat, llogarit shumat dhe flisni bashkë për pohimin me notën më të ulët.",
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
          x("Look at the statement with the lowest total.", "Shiko pohimin me shumën më të ulët.", "Sehen Sie sich die Aussage mit der niedrigsten Summe an."),
          x("Ask the team what would make it a 5, and listen.", "Pyete ekipin çfarë do ta bënte 5, dhe dëgjo.", "Fragen Sie das Team, was daraus eine 5 machen würde, und hören Sie zu."),
          x("Fill it in again after two or three months.", "Përsërite kartën pas dy ose tre muajsh.", "Lassen Sie die Karte nach zwei oder drei Monaten erneut ausfüllen."),
        ] },
      ],
      note: x(
        "The statements are in our words, inspired by Edmondson's scale (1999). Use the card for the team, never to rate a person.",
        "Pohimet janë me fjalët tona, të frymëzuara nga shkalla e Edmondson (1999). Përdore kartën për ekipin, kurrë për të vlerësuar një person.",
        "Die Aussagen sind in unseren Worten formuliert, angelehnt an Edmondsons Skala (1999). Nutzen Sie die Karte für das Team, nie zur Bewertung einer einzelnen Person."),
    },
    { id: "sources", type: "sources" },
    { id: "back", type: "back" },
  ],
};
