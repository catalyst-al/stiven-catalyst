// Operational treatise, Volume 7: The cost of silence, why frontline teams stop speaking up, and what leaders never
// hear. Block: Operations. Facts and their sources: docs/revista/traktati-operacional.md. The research is the voice
// and psychological-safety literature: Edmondson 1999, Morrison & Milliken 2000, Milliken, Morrison & Hewlin 2003,
// Tucker & Edmondson 2003, Nembhard & Edmondson 2006, Detert & Burris 2007, Detert & Treviño 2010, Liang, Farh & Farh
// 2012, Morrison 2014 and Frazier et al. 2017, each checked at its DOI. Six chapters in the three layers, as in the
// author's PDF; the site adds a synthetic chart of the upstream loss of knowledge (Chapter I) beside the PDF's funnel
// of unanswered concerns (Chapter V), and the method has its own page. Every sample count describes a published study;
// every operational count is invented and flagged; nothing is measured in the author's workplaces.
import { x } from "../common.js";

const synthetic = x("Synthetic example, authored for this volume; not employer data", "Shembull sintetik, i shkruar për këtë vëllim; jo të dhëna punëdhënësi", "Synthetisches Beispiel, für diesen Band verfasst; keine Arbeitgeberdaten");

export default {
  number: 7,
  numeral: "VII",
  block: "operations",
  date: x("October 2026", "Tetor 2026", "Oktober 2026"),
  theme: [x("The cost of silence:", "Kostoja e heshtjes:", "Der Preis des Schweigens:"), x("why frontline teams stop speaking up", "pse ekipet e vijës së parë pushojnë së foluri", "warum Teams an der Front aufhören, sich zu äußern")],
  sub: x(
    "Six chapters on psychological safety, employee voice, leadership signals, silent handovers and the obligation to respond.",
    "Gjashtë kapituj për sigurinë psikologjike, zërin e punonjësve, sinjalet e drejtuesve, dorëzimet e heshtura dhe detyrimin për t'u përgjigjur.",
    "Sechs Kapitel über psychologische Sicherheit, die Stimme der Beschäftigten, Führungssignale, stumme Übergaben und die Pflicht zu antworten."),
  seo: x(
    "The cost of silence, an operational treatise: six chapters in three layers, from an unreported workaround to Edmondson, Detert and the Speak-Up Signal Card.",
    "Kostoja e heshtjes, traktat operacional: gjashtë kapituj në tri shtresa, nga një zgjidhje e paraportuar te Edmondson, Detert dhe Karta e sinjalit.",
    "Der Preis des Schweigens, ein operativer Traktat: sechs Kapitel in drei Ebenen, von einem ungemeldeten Umweg zu Edmondson, Detert und der Signalkarte."),
  feature: x(
    "Volume 7 asks what a manager never hears. Its six chapters move from a workaround nobody reported, a question left unasked, an open door nobody uses, a handover that carries a status but not the doubt behind it, and a concern that was heard once and never answered, to Edmondson, Morrison and Milliken, Detert and Burris, Nembhard and Edmondson, Liang, Farh and Farh and Frazier's meta-analysis, and end with a five-step framework from voice to action and the Speak-Up Signal Card.",
    "Vëllimi 7 pyet çfarë nuk dëgjon kurrë një menaxher. Gjashtë kapitujt e tij shkojnë nga një zgjidhje e përkohshme që askush nuk e raportoi, një pyetje e lënë pa bërë, një derë e hapur që askush nuk e përdor, një dorëzim që bart statusin, por jo dyshimin pas tij, dhe një shqetësim që u dëgjua një herë dhe nuk mori kurrë përgjigje, te Edmondson, Morrison e Milliken, Detert e Burris, Nembhard e Edmondson, Liang, Farh e Farh dhe meta-analiza e Frazier-it, dhe mbyllen me një kuadër pesëhapësh nga zëri te veprimi dhe me Kartën e sinjalit për të folur.",
    "Band 7 fragt, was eine Führungskraft nie zu hören bekommt. Seine sechs Kapitel führen von einem Umweg, den niemand meldete, einer ungestellten Frage, einer offenen Tür, die niemand nutzt, einer Übergabe, die den Status trägt, aber nicht den Zweifel dahinter, und einem Anliegen, das einmal gehört und nie beantwortet wurde, zu Edmondson, Morrison und Milliken, Detert und Burris, Nembhard und Edmondson, Liang, Farh und Farh und Fraziers Metaanalyse, und enden mit einem Fünf-Schritte-Rahmen von der Stimme zur Handlung und der Signalkarte fürs Ansprechen."),
  figure: { n: "51", by: x("Edmondson 1999, an association, not universal causation", "Edmondson 1999, lidhje, jo shkakësi universale", "Edmondson 1999, ein Zusammenhang, keine universelle Ursache"), t: x(
    "work teams in Edmondson's manufacturing study linked psychological safety with learning behaviour.",
    "ekipe pune në studimin e Edmondson-it në prodhim e lidhën sigurinë psikologjike me sjelljen e të mësuarit.",
    "Arbeitsteams in Edmondsons Fertigungsstudie verbanden psychologische Sicherheit mit Lernverhalten.") },
  teasers: [
    { page: "i-scene", kicker: x("Cover story", "Tema kryesore", "Titelthema"),
      title: x("The problem nobody reported", "Problemi që askush nuk e raportoi", "Das Problem, das niemand meldete") },
    { page: "iii-concept", kicker: x("The evidence", "Prova", "Die Belege"),
      title: x("Why the open door fails", "Pse dështon dera e hapur", "Warum die offene Tür versagt") },
    { page: "tool", kicker: x("Field tool", "Mjeti i terrenit", "Werkzeug vor Ort"),
      title: x("The Speak-Up Signal Card", "Karta e sinjalit për të folur", "Die Signalkarte fürs Ansprechen") },
  ],
  contract: [
    { h: x("Field", "Terreni", "Feld"), p: x("Real categories of operational work, no invented personal incidents.", "Kategori të vërteta pune operacionale, pa ngjarje personale të shpikura.", "Echte Kategorien betrieblicher Arbeit, keine erfundenen persönlichen Vorfälle.") },
    { h: x("Evidence", "Prova", "Belege"), p: x("Research setting, sample, method and limits stated together.", "Mjedisi i kërkimit, mostra, metoda dhe kufijtë, të thënë bashkë.", "Forschungsumfeld, Stichprobe, Methode und Grenzen gemeinsam genannt.") },
    { h: x("Action", "Veprimi", "Handeln"), p: x("A concern is closed only when the decision has been told back.", "Një shqetësim mbyllet vetëm kur vendimi i është kthyer si përgjigje.", "Ein Anliegen ist erst geschlossen, wenn die Entscheidung zurückgemeldet wurde.") },
  ],
  sources: ["edmondson-1999", "morrison-milliken-2000", "boss-milliken-2003", "tucker-edmondson-2003", "nembhard-edmondson-2006", "detert-burris-2007", "detert-trevino-2010", "liang-farh-farh-2012", "morrison-2014", "frazier-2017"],
  pages: [
    { id: "cover", type: "cover" },
    {
      id: "intro", type: "intro",
      title: [x("What silence", "Çfarë i kushton", "Was Schweigen"), x("costs a business", "heshtja një biznesi", "ein Unternehmen kostet")],
      why: x(
        "A dashboard can be accurate and still miss the most important operational fact: someone saw a problem and decided not to say it.",
        "Një panel mund të jetë i saktë dhe prapë ta humbasë faktin më të rëndësishëm operacional: dikush e pa një problem dhe vendosi të mos e thotë.",
        "Ein Dashboard kann stimmen und trotzdem die wichtigste betriebliche Tatsache verfehlen: Jemand sah ein Problem und beschloss, es nicht zu sagen."),
      body: x(
        "Managers tend to value visible evidence. A late departure has a timestamp. A missing bag creates an exception. A room issue may enter a shift log. What does a report show when a worker notices a flawed instruction, judges that raising it is pointless and quietly works around it? Often nothing at all. The absent signal cannot be counted the way a recorded failure can. This volume studies the conditions under which useful knowledge fails to travel upward. Its subject is not politeness or personality. It is an information problem shaped by authority, anticipated consequences, the design of reporting channels and the credibility of the managerial response. A company can be busy collecting data while losing the first-hand observations that would make the data intelligible. The author has worked in last-mile loading and coordination, with wholesale partners, and with Front Office and Night Audit procedures. Those are verified categories of work, not evidence that a particular employer discouraged reporting. The scenes in this volume are expressly constructed; they contain no identifiable staff, guest, customer, company or private internal information. Edmondson gives the language of psychological safety. Milliken, Morrison and Hewlin examine why employees keep concerns to themselves. Detert and Burris show why managerial openness matters. Research in healthcare and a wider meta-analysis provide comparisons with their own limits. The practical question is what a manager can do after an employee takes the risk of telling the truth.",
        "Menaxherët priren ta vlerësojnë provën e dukshme. Një nisje e vonuar ka një vulë kohe. Një çantë që mungon krijon një përjashtim. Një problem dhome mund të hyjë në ditarin e turnit. Çfarë tregon një raport kur një punonjës vë re një udhëzim të gabuar, gjykon se nuk ia vlen ta ngrejë dhe e anashkalon në heshtje? Shpesh asgjë fare. Sinjali që mungon nuk numërohet dot ashtu si një dështim i regjistruar. Ky vëllim studion kushtet në të cilat dija e dobishme nuk arrin të udhëtojë lart. Tema e tij nuk është mirësjellja apo personaliteti. Është një problem informacioni, i formuar nga autoriteti, pasojat e parashikuara, projektimi i kanaleve të raportimit dhe besueshmëria e përgjigjes menaxheriale. Një kompani mund të jetë e zënë duke mbledhur të dhëna, ndërsa humbet vëzhgimet e dorës së parë që do t'i bënin të dhënat të kuptueshme. Autori ka punuar në ngarkimin dhe koordinimin e miljes së fundit, me partnerë të shitjes me shumicë dhe me procedurat e Front Office-it dhe të Night Audit-it. Këto janë kategori të verifikuara pune, jo prova se një punëdhënës i caktuar e shkurajoi raportimin. Skenat e këtij vëllimi janë shprehimisht të ndërtuara; nuk përmbajnë asnjë staf, mysafir, klient, kompani apo informacion të brendshëm privat të identifikueshëm. Edmondson jep gjuhën e sigurisë psikologjike. Milliken, Morrison dhe Hewlin shqyrtojnë pse punonjësit i mbajnë shqetësimet për vete. Detert dhe Burris tregojnë pse ka rëndësi hapja e menaxherit. Kërkimi në shëndetësi dhe një meta-analizë më e gjerë sjellin krahasime me kufijtë e vet. Pyetja praktike është çfarë mund të bëjë një menaxher pasi një punonjës merr rrezikun e të thënit të së vërtetës.",
        "Führungskräfte schätzen sichtbare Belege. Eine verspätete Abfahrt hat einen Zeitstempel. Eine fehlende Tasche erzeugt eine Ausnahme. Ein Zimmerproblem gelangt vielleicht ins Schichtbuch. Was zeigt ein Bericht, wenn eine Arbeitskraft eine fehlerhafte Anweisung bemerkt, das Ansprechen für zwecklos hält und still einen Umweg nimmt? Oft gar nichts. Das fehlende Signal lässt sich nicht so zählen wie ein erfasster Fehler. Dieser Band untersucht die Bedingungen, unter denen nützliches Wissen nicht nach oben gelangt. Sein Gegenstand ist nicht Höflichkeit oder Persönlichkeit. Es ist ein Informationsproblem, geformt von Autorität, erwarteten Folgen, dem Aufbau der Meldewege und der Glaubwürdigkeit der Antwort der Führung. Ein Unternehmen kann eifrig Daten sammeln und dabei die Beobachtungen verlieren, die die Daten verständlich machen. Der Autor hat in Beladung und Koordination der letzten Meile, mit Großhandelspartnern und mit Front-Office- und Night-Audit-Verfahren gearbeitet. Das sind geprüfte Arbeitskategorien, kein Beleg, dass ein Arbeitgeber das Melden entmutigt hätte. Die Szenen sind ausdrücklich konstruiert, ohne identifizierbare Beschäftigte, Gäste, Kunden, Unternehmen oder interne Informationen. Edmondson liefert die Sprache der psychologischen Sicherheit. Milliken, Morrison und Hewlin untersuchen, warum Beschäftigte Bedenken für sich behalten. Detert und Burris zeigen, warum die Offenheit der Führung zählt. Forschung im Gesundheitswesen und eine Metaanalyse liefern Vergleiche mit eigenen Grenzen. Die praktische Frage lautet, was eine Führungskraft tun kann, nachdem eine Arbeitskraft das Risiko eingegangen ist, die Wahrheit zu sagen."),
    },
    { id: "contents", type: "contents" },
    {
      id: "note",
      kicker: x("Research note", "Shënim kërkimor", "Forschungsnotiz"),
      title: [x("The absence of a report", "Mungesa e një raporti", "Das Fehlen einer Meldung"), x("is not a statistic", "nuk është statistikë", "ist keine Statistik")],
      lead: x(
        "Silence is difficult to observe directly. The studies below help us reason about it, not calculate a universal percentage of silent workers.",
        "Heshtja vështirë se vëzhgohet drejtpërdrejt. Studimet më poshtë na ndihmojnë të arsyetojmë për të, jo të llogarisim një përqindje universale punonjësish të heshtur.",
        "Schweigen lässt sich schwer direkt beobachten. Die Studien unten helfen, darüber nachzudenken, nicht, einen universellen Prozentsatz schweigender Beschäftigter zu berechnen."),
      blocks: [
        { type: "p", text: x(
          "Organisational voice is the voluntary expression of work-relevant ideas or concerns. Organisational silence, in the tradition of Morrison and Milliken, is the withholding of potentially important information. Not every quiet employee is withholding something: they may have nothing to add, may not have been asked, or may use a different channel. Counting zero reports cannot distinguish these possibilities. The evidence base mixes designs. Edmondson studied 51 work teams at one manufacturing company. Milliken, Morrison and Hewlin interviewed 40 employees. Detert and Burris analysed 3,149 employees and 223 managers in a restaurant chain. Frazier and colleagues synthesised 136 independent samples. These counts identify the scale and setting of each study; they are not comparable rates of silence.",
          "Zëri organizativ është shprehja vullnetare e ideve ose shqetësimeve që lidhen me punën. Heshtja organizative, në traditën e Morrison-it dhe Milliken-it, është mbajtja për vete e informacionit potencialisht të rëndësishëm. Jo çdo punonjës i qetë po mban diçka për vete: mund të mos ketë asgjë për të shtuar, mund të mos jetë pyetur, ose mund të përdorë një kanal tjetër. Numërimi i zero raporteve nuk i dallon dot këto mundësi. Baza e provave përzien projektime. Edmondson studioi 51 ekipe pune në një kompani prodhimi. Milliken, Morrison dhe Hewlin intervistuan 40 punonjës. Detert dhe Burris analizuan 3.149 punonjës dhe 223 menaxherë në një zinxhir restorantesh. Frazier dhe kolegët sintetizuan 136 mostra të pavarura. Këto numra tregojnë shkallën dhe mjedisin e secilit studim; nuk janë norma të krahasueshme heshtjeje.",
          "Organisationale Stimme ist der freiwillige Ausdruck arbeitsbezogener Ideen oder Bedenken. Organisationales Schweigen, nach Morrison und Milliken, ist das Zurückhalten potenziell wichtiger Informationen. Nicht jede stille Arbeitskraft hält etwas zurück: Sie hat vielleicht nichts hinzuzufügen, wurde nicht gefragt oder nutzt einen anderen Weg. Null Meldungen zu zählen kann diese Möglichkeiten nicht unterscheiden. Die Belege mischen Designs. Edmondson untersuchte 51 Arbeitsteams in einem Fertigungsunternehmen. Milliken, Morrison und Hewlin befragten 40 Beschäftigte. Detert und Burris analysierten 3.149 Beschäftigte und 223 Führungskräfte einer Restaurantkette. Frazier und Kollegen fassten 136 unabhängige Stichproben zusammen. Diese Zahlen benennen Umfang und Umfeld jeder Studie; sie sind keine vergleichbaren Schweigequoten.") },
        { type: "cards", cols: 3, items: [
          { h: x("Observed", "E vëzhguar", "Beobachtet"), p: x("A defined sample, a research design and a reported association.", "Një mostër e përkufizuar, një projektim kërkimi dhe një lidhje e raportuar.", "Eine definierte Stichprobe, ein Forschungsdesign und ein berichteter Zusammenhang.") },
          { h: x("Transferred", "E bartur", "Übertragen"), p: x("A cautious management hypothesis to test locally.", "Një hipotezë e kujdesshme menaxhimi për t'u provuar lokalisht.", "Eine vorsichtige Führungshypothese, lokal zu prüfen.") },
          { h: x("Unproven", "E paprovuar", "Unbelegt"), p: x("Any claim that the author measured silence or fixed it at an employer.", "Çdo pretendim se autori e mati heshtjen ose e rregulloi te një punëdhënës.", "Jede Behauptung, der Autor habe Schweigen gemessen oder bei einem Arbeitgeber behoben.") },
        ] },
        { type: "p", text: x(
          "The strongest statement this literature supports is directional: interpersonal risk, managerial behaviour and organisational context are associated with whether workers speak and whether teams learn. We cannot infer that an unreported issue exists at a specific warehouse or hotel, nor that an editorial protocol will produce a particular improvement.",
          "Pohimi më i fortë që e mbështet kjo literaturë është drejtimor: rreziku ndërpersonal, sjellja menaxheriale dhe konteksti organizativ lidhen me faktin nëse punonjësit flasin dhe nëse ekipet mësojnë. Nuk mund të nxjerrim se një problem i paraportuar ekziston në një magazinë apo hotel të caktuar, as se një protokoll editorial do të sjellë një përmirësim të caktuar.",
          "Die stärkste Aussage dieser Literatur ist eine Richtung: zwischenmenschliches Risiko, Führungsverhalten und Kontext hängen damit zusammen, ob Beschäftigte sprechen und Teams lernen. Wir können nicht folgern, dass in einem bestimmten Lager oder Hotel ein ungemeldetes Problem besteht, noch dass ein redaktionelles Protokoll eine bestimmte Verbesserung bewirkt.") },
        { type: "callout", reading: true, text: x(
          "A complaint count is evidence of reporting. It is not a census of everything workers know.",
          "Numri i ankesave është provë e raportimit. Nuk është regjistrim i gjithçkaje që dinë punonjësit.",
          "Eine Beschwerdezahl belegt das Melden. Sie ist keine Zählung all dessen, was die Beschäftigten wissen.") },
      ],
      note: x(
        "Edmondson (1999); Milliken, Morrison and Hewlin (2003); Detert and Burris (2007); Frazier et al. (2017). Voice and silence defined after Morrison (2014).",
        "Edmondson (1999); Milliken, Morrison e Hewlin (2003); Detert e Burris (2007); Frazier et al. (2017). Zëri dhe heshtja të përkufizuara sipas Morrison-it (2014).",
        "Edmondson (1999); Milliken et al. (2003); Detert und Burris (2007); Frazier et al. (2017); Definitionen nach Morrison (2014)."),
      source: ["edmondson-1999", "boss-milliken-2003", "detert-burris-2007", "frazier-2017", "morrison-2014"],
    },

    // Chapter I. The problem nobody reported
    {
      id: "ch-i", type: "chapter", numeral: "I",
      title: x("The problem nobody reported", "Problemi që askush nuk e raportoi", "Das Problem, das niemand meldete"),
      pages: [
        {
          id: "i-scene", layer: "scene", more: "gemba",
          title: [x("The problem", "Problemi", "Das Problem,"), x("nobody reported", "që askush nuk e raportoi", "das niemand meldete")],
          lead: x(
            "A small workaround can conceal the fact that the next shift inherited a system that does not quite work.",
            "Një zgjidhje e vogël e përkohshme mund ta fshehë faktin se turni tjetër trashëgoi një sistem që nuk funksionon mirë.",
            "Ein kleiner Umweg kann verbergen, dass die nächste Schicht ein System geerbt hat, das nicht ganz funktioniert."),
          blocks: [
            { type: "flag", text: x("Constructed last-mile scene, not a recorded personal incident", "Skenë e ndërtuar e miljes së fundit, jo ngjarje personale e regjistruar", "Konstruierte Last-Mile-Szene, kein aufgezeichneter persönlicher Vorfall") },
            { type: "p", text: x(
              "A loading area prepares for departures. A worker notices that a particular handover routinely produces an unclear status. The next colleague can still make the order ready by checking twice and asking someone nearby. Today the team is under pressure. The worker finds the answer, corrects the immediate situation and returns to the queue. No exception is raised. From the dashboard, the episode looks ordinary. This is not a story of misconduct. The employee may reasonably believe that reporting a small problem takes longer than fixing it. Perhaps no simple reporting channel exists. Perhaps a past suggestion received no answer. Or perhaps the local standard expects an exception to be recorded and the worker made a poor choice. Without asking, the manager cannot know which explanation fits.",
              "Një zonë ngarkimi përgatitet për nisjet. Një punonjës vë re se një dorëzim i caktuar prodhon rregullisht një status të paqartë. Kolegu tjetër e bën prapë gati porosinë duke kontrolluar dy herë dhe duke pyetur dikë aty pranë. Sot ekipi është nën presion. Punonjësi e gjen përgjigjen, e ndreq situatën e çastit dhe kthehet në radhë. Nuk ngrihet asnjë përjashtim. Nga paneli, episodi duket i zakonshëm. Kjo nuk është histori sjelljeje të keqe. Punonjësi mund të besojë me arsye se raportimi i një problemi të vogël zgjat më shumë se ndreqja e tij. Ndoshta nuk ekziston një kanal i thjeshtë raportimi. Ndoshta një sugjerim i mëparshëm nuk mori përgjigje. Ose ndoshta standardi lokal kërkon që përjashtimi të regjistrohet dhe punonjësi bëri një zgjedhje të keqe. Pa pyetur, menaxheri nuk e di cili shpjegim përshtatet.",
              "Ein Ladebereich bereitet die Abfahrten vor. Eine Arbeitskraft bemerkt, dass eine bestimmte Übergabe regelmäßig einen unklaren Status erzeugt. Die nächste Kollegin kann den Auftrag trotzdem fertig machen, indem sie zweimal prüft und jemanden in der Nähe fragt. Heute steht das Team unter Druck. Die Arbeitskraft findet die Antwort, bereinigt die Lage und kehrt in die Reihe zurück. Keine Ausnahme wird gemeldet. Vom Dashboard aus wirkt die Episode gewöhnlich. Das ist keine Geschichte von Fehlverhalten. Die Arbeitskraft darf vernünftigerweise glauben, dass das Melden eines kleinen Problems länger dauert als seine Behebung. Vielleicht gibt es keinen einfachen Meldeweg. Vielleicht blieb ein früherer Vorschlag unbeantwortet. Oder der örtliche Standard verlangt, die Ausnahme zu erfassen, und die Arbeitskraft hat schlecht gewählt. Ohne zu fragen, weiß die Führungskraft nicht, welche Erklärung passt.") },
            { type: "p", text: x(
              "The author has documented categories such as mixed trolleys, missing bags and operational handovers from last-mile work. The person, the exchange, the timing and the reason for silence in this scene are invented. Their use is analytical: a process may recover from an obstacle without teaching the organisation why that obstacle appeared.",
              "Autori ka dokumentuar kategori si karrocat e përziera, çantat që mungojnë dhe dorëzimet operacionale nga puna në miljen e fundit. Personi, shkëmbimi, koha dhe arsyeja e heshtjes në këtë skenë janë të shpikura. Përdorimi i tyre është analitik: një proces mund të rimëkëmbet nga një pengesë pa e mësuar organizatën pse u shfaq ajo pengesë.",
              "Der Autor hat aus der Last-Mile-Arbeit Kategorien wie gemischte Wagen, fehlende Taschen und betriebliche Übergaben dokumentiert. Person, Austausch, Zeitpunkt und Grund des Schweigens in dieser Szene sind erfunden. Ihr Nutzen ist analytisch: Ein Prozess kann sich von einem Hindernis erholen, ohne dass die Organisation lernt, warum es auftrat.") },
            { type: "callout", reading: true, text: x(
              "An apparently normal departure may hide the extra effort that made it possible.",
              "Një nisje në dukje normale mund ta fshehë mundimin shtesë që e bëri të mundur.",
              "Eine scheinbar normale Abfahrt kann die Mehrarbeit verbergen, die sie möglich machte.") },
          ],
          note: x(
            "Editorial illustration informed by Tucker and Edmondson (2003); no employer-level voice data. The essay named below goes to the floor to see the work.",
            "Ilustrim editorial i mbështetur te Tucker e Edmondson (2003); pa të dhëna zëri në nivel punëdhënësi. Eseja e emërtuar më poshtë shkon në terren për ta parë punën.",
            "Redaktionelle Illustration nach Tucker und Edmondson (2003); keine Stimmdaten auf Arbeitgeberebene. Der unten genannte Essay geht auf die Fläche, um die Arbeit zu sehen."),
          source: ["tucker-edmondson-2003"],
        },
        {
          id: "i-concept", layer: "concept",
          title: [x("The missing signal", "Sinjali që mungon", "Das fehlende Signal"), x("in the feedback system", "në sistemin e reagimit", "im Rückmeldesystem")],
          lead: x(
            "A reported exception is only one possible outcome of a problem being noticed.",
            "Një përjashtim i raportuar është vetëm një nga rezultatet e mundshme kur vihet re një problem.",
            "Eine gemeldete Ausnahme ist nur ein möglicher Ausgang, wenn ein Problem bemerkt wird."),
          blocks: [
            { type: "p", text: x(
              "Morrison and Milliken argued in 2000 that organisational silence can become collective: people infer from leadership behaviour and shared experience that speaking up carries costs or little prospect of influence. Their paper is a conceptual framework, not a survey proving that most organisations suppress information. It nevertheless separates an operational problem from the social route by which the problem becomes known. A worker must first notice an issue, interpret it as relevant, see a feasible channel, judge the interpersonal risk and decide whether to use that channel. Even after speaking, the information must be received and processed. At every step an organisation may lose knowledge. A manager who measures only the final complaint count observes the end of this chain, not the conditions upstream.",
              "Morrison dhe Milliken argumentuan në vitin 2000 se heshtja organizative mund të bëhet kolektive: njerëzit nxjerrin nga sjellja e drejtuesve dhe nga përvoja e përbashkët se të folurit ka kosto ose pak gjasa ndikimi. Punimi i tyre është kuadër konceptual, jo anketë që provon se shumica e organizatave e shtypin informacionin. Megjithatë, e ndan problemin operacional nga rruga shoqërore përmes së cilës problemi bëhet i njohur. Punonjësi duhet së pari ta vërë re një problem, ta interpretojë si të rëndësishëm, të shohë një kanal të realizueshëm, ta gjykojë rrezikun ndërpersonal dhe të vendosë nëse do ta përdorë atë kanal. Edhe pasi flet, informacioni duhet marrë dhe përpunuar. Në çdo hap një organizatë mund të humbasë dije. Një menaxher që mat vetëm numrin përfundimtar të ankesave vëzhgon fundin e këtij zinxhiri, jo kushtet më lart.",
              "Morrison und Milliken argumentierten 2000, organisationales Schweigen könne kollektiv werden: Menschen schließen aus dem Verhalten der Führung und aus geteilter Erfahrung, dass Ansprechen Kosten trägt oder wenig Aussicht auf Einfluss hat. Ihr Aufsatz ist ein konzeptioneller Rahmen, keine Umfrage, die beweist, dass die meisten Organisationen Informationen unterdrücken. Er trennt dennoch das betriebliche Problem vom sozialen Weg, auf dem es bekannt wird. Eine Arbeitskraft muss ein Problem erst bemerken, es als relevant deuten, einen gangbaren Weg sehen, das zwischenmenschliche Risiko abwägen und entscheiden, ob sie diesen Weg nutzt. Auch nach dem Sprechen muss die Information empfangen und verarbeitet werden. Bei jedem Schritt kann eine Organisation Wissen verlieren. Wer nur die endgültige Beschwerdezahl misst, beobachtet das Ende dieser Kette, nicht die Bedingungen davor.") },
            { type: "chain", items: [
              { h: x("Notice", "Vër re", "Bemerken"), p: x("A problem or an improvement idea.", "Një problem ose një ide përmirësimi.", "Ein Problem oder eine Verbesserungsidee.") },
              { h: x("Assess", "Vlerëso", "Abwägen"), p: x("Risk and likely usefulness.", "Rreziku dhe dobia e mundshme.", "Risiko und wahrscheinlicher Nutzen.") },
              { h: x("Speak", "Fol", "Sprechen"), p: x("A usable channel.", "Një kanal i përdorshëm.", "Ein nutzbarer Weg.") },
              { h: x("Receive", "Merr", "Empfangen"), p: x("The listener understands.", "Dëgjuesi kupton.", "Die Zuhörerin versteht.") },
              { h: x("Act", "Vepro", "Handeln"), p: x("Decision and feedback.", "Vendim dhe përgjigje.", "Entscheidung und Rückmeldung.") },
            ] },
            { type: "p", text: x(
              "This is why silence cannot be treated as a personal flaw. A conscientious worker can still judge that a meeting with little time, a public audience and no feedback is an unhelpful place to raise a concern. The alternative is not to excuse every failure to report: safety and compliance duties remain binding. The task is to improve both the channel and the expectation that a concern will be fairly evaluated.",
              "Prandaj heshtja nuk mund të trajtohet si e metë personale. Një punonjës i ndërgjegjshëm mund të gjykojë prapë se një mbledhje me pak kohë, me publik dhe pa përgjigje është vend i papërshtatshëm për të ngritur një shqetësim. Alternativa nuk është të justifikohet çdo mosraportim: detyrat e sigurisë dhe të përputhshmërisë mbeten detyruese. Detyra është të përmirësohet si kanali, ashtu edhe pritshmëria se një shqetësim do të vlerësohet me drejtësi.",
              "Deshalb lässt sich Schweigen nicht als persönlicher Makel behandeln. Eine gewissenhafte Arbeitskraft kann trotzdem urteilen, dass eine Besprechung mit wenig Zeit, Publikum und ohne Rückmeldung kein guter Ort für ein Anliegen ist. Die Alternative ist nicht, jedes Nichtmelden zu entschuldigen: Sicherheits- und Compliance-Pflichten bleiben bindend. Die Aufgabe ist, den Weg und die Erwartung zu verbessern, dass ein Anliegen fair geprüft wird.") },
            { type: "callout", reading: true, text: x(
              "The absence of recorded concerns cannot establish the absence of operational obstacles.",
              "Mungesa e shqetësimeve të regjistruara nuk e vërteton mungesën e pengesave operacionale.",
              "Das Fehlen erfasster Anliegen belegt nicht das Fehlen betrieblicher Hindernisse.") },
          ],
          note: x(
            "Conceptual source: Morrison and Milliken (2000); voice definitions after Morrison (2014). The five-stage flow is editorial.",
            "Burim konceptual: Morrison e Milliken (2000); përkufizimet e zërit sipas Morrison-it (2014). Rrjedha me pesë faza është editoriale.",
            "Konzeptionelle Quelle: Morrison und Milliken (2000); Stimmdefinitionen nach Morrison (2014). Der fünfstufige Ablauf ist redaktionell."),
          source: ["morrison-milliken-2000", "morrison-2014"],
        },
        {
          id: "i-model", layer: "concept",
          title: [x("Where the knowledge", "Ku humbet dija", "Wo das Wissen"), x("is lost on the way up", "rrugës për lart", "nach oben verloren geht")],
          lead: x(
            "A fully synthetic illustration of the chain on the previous page: twenty invented observations, followed stage by stage.",
            "Një ilustrim krejt sintetik i zinxhirit të faqes së mëparshme: njëzet vëzhgime të shpikura, të ndjekura fazë pas faze.",
            "Eine synthetische Illustration der Kette der vorigen Seite: zwanzig erfundene Beobachtungen, Stufe für Stufe verfolgt."),
          blocks: [
            { type: "flag", text: synthetic },
            { type: "hbars", max: 20, hypothetical: true,
              label: x("Invented cohort of 20 noticed problems", "Grup i shpikur prej 20 problemesh të vëna re", "Erfundene Kohorte von 20 bemerkten Problemen"),
              items: [
                { k: x("Noticed", "Të vëna re", "Bemerkt"), v: 20, n: "20" },
                { k: x("Worth raising", "Ia vlen të ngrihen", "Ansprechenswert"), v: 14, n: "14" },
                { k: x("Channel seen", "Me kanal", "Weg gesehen"), v: 9, n: "9" },
                { k: x("Spoken", "Të thëna", "Ausgesprochen"), v: 6, n: "6" },
                { k: x("Understood", "Të kuptuara", "Verstanden"), v: 5, n: "5" },
                { k: x("Fed back", "Me përgjigje", "Rückgemeldet"), v: 3, n: "3", alert: true },
              ] },
            { type: "p", text: x(
              "Every count is invented so the arithmetic can be followed. The manager's log would show six entries and three closures, while seventeen of the twenty observations never became visible. The largest losses sit upstream: eleven observations were filtered out by the worker's own judgement of risk, usefulness or the lack of a channel. No real operation has these proportions. A low complaint count can describe a quiet channel as easily as a quiet process; only asking the people who notice tells the two apart.",
              "Çdo numër është i shpikur, që llogaria të ndiqet. Ditari i menaxherit do të tregonte gjashtë hyrje dhe tri mbyllje, ndërsa shtatëmbëdhjetë nga njëzet vëzhgimet nuk u bënë kurrë të dukshme. Humbjet më të mëdha janë më lart: njëmbëdhjetë vëzhgime u filtruan nga gjykimi i vetë punonjësit për rrezikun, dobinë ose mungesën e kanalit. Asnjë operacion i vërtetë nuk i ka këto përpjesëtime. Një numër i ulët ankesash mund të përshkruajë po aq lehtë një kanal të qetë sa një proces të qetë; vetëm pyetja e njerëzve që vënë re i dallon të dyja.",
              "Jede Zahl ist erfunden, damit die Rechnung nachvollziehbar ist. Das Buch der Führungskraft zeigte sechs Einträge und drei Abschlüsse; siebzehn der zwanzig Beobachtungen wurden nie sichtbar. Die größten Verluste liegen davor: Elf filterte das eigene Urteil über Risiko, Nutzen oder fehlenden Weg heraus. Kein echter Betrieb hat diese Verhältnisse. Eine niedrige Beschwerdezahl kann einen stillen Weg wie einen stillen Prozess beschreiben; nur die Frage an die, die bemerken, unterscheidet beides.") },
            { type: "callout", reading: true, text: x(
              "The complaint log counts what survived the chain. Manage the chain, not the log.",
              "Ditari i ankesave numëron atë që i mbijetoi zinxhirit. Menaxho zinxhirin, jo ditarin.",
              "Das Beschwerdebuch zählt, was die Kette überstand. Führen Sie die Kette, nicht das Buch.") },
          ],
          note: x(
            "Every value on this page is synthetic, authored for this volume; the stages follow Morrison and Milliken (2000). The PDF draws only the downstream funnel of Chapter V.",
            "Çdo vlerë në këtë faqe është sintetike, e shkruar për këtë vëllim; fazat ndjekin Morrison e Milliken (2000). PDF-ja vizaton vetëm hinkën e poshtme të Kapitullit V.",
            "Jeder Wert ist synthetisch, für diesen Band verfasst; die Stufen folgen Morrison und Milliken (2000). Das PDF zeichnet nur den Trichter des Kapitels V."),
          source: ["morrison-milliken-2000"],
        },
        {
          id: "i-protocol", layer: "protocol",
          title: [x("Ask about the work", "Pyet për punën", "Nach der Arbeit fragen,"), x("before asking for blame", "para se të kërkosh fajin", "bevor nach Schuld gefragt wird")],
          lead: x(
            "A first inquiry should make problems observable without forcing people to identify colleagues or disclose sensitive data.",
            "Një hetim i parë duhet t'i bëjë problemet të vëzhgueshme pa i detyruar njerëzit të identifikojnë kolegë apo të zbulojnë të dhëna të ndjeshme.",
            "Eine erste Erkundung soll Probleme sichtbar machen, ohne Menschen zu zwingen, Kolleginnen zu benennen oder sensible Daten preiszugeben."),
          blocks: [
            { type: "steps", items: [
              { h: x("Choose one handover", "Zgjidh një dorëzim", "Eine Übergabe wählen"), p: x("A loading, order-preparation or shift-transfer process with an observable result.", "Një proces ngarkimi, përgatitjeje porosish ose kalimi turni me rezultat të vëzhgueshëm.", "Ein Belade-, Kommissionier- oder Schichtwechselprozess mit beobachtbarem Ergebnis.") },
              { h: x("Ask where people recover", "Pyet ku rimëkëmben njerëzit", "Fragen, wo Menschen nachbessern"), p: x("What do workers double-check, chase or explain to make the next step possible?", "Çfarë kontrollojnë dy herë, ndjekin ose shpjegojnë punonjësit që hapi tjetër të bëhet i mundur?", "Was prüfen, verfolgen oder erklären Beschäftigte, damit der nächste Schritt möglich wird?") },
              { h: x("Separate observation from interpretation", "Ndaje vëzhgimin nga interpretimi", "Beobachtung von Deutung trennen"), p: x("Record what was checked, what was said and what remains uncertain.", "Shëno çfarë u kontrollua, çfarë u tha dhe çfarë mbetet e pasigurt.", "Festhalten, was geprüft, was gesagt wurde und was unsicher bleibt.") },
              { h: x("Check the safe channels", "Kontrollo kanalet e sigurta", "Die sicheren Wege prüfen"), p: x("How can a worker raise a recurring issue confidentially through the right organisational route?", "Si mund ta ngrejë një punonjës një problem të përsëritur në mënyrë konfidenciale, përmes rrugës së duhur organizative?", "Wie kann eine Arbeitskraft ein wiederkehrendes Problem vertraulich ansprechen?") },
              { h: x("Assign the next decision", "Cakto vendimin e radhës", "Die nächste Entscheidung zuweisen"), p: x("A responsible role and a near-term date for a response; no premature promise of a fix.", "Një rol përgjegjës dhe një datë të afërt për përgjigje; pa premtim të parakohshëm zgjidhjeje.", "Eine verantwortliche Rolle und ein naher Termin für eine Antwort; keine voreilige Zusage.") },
              { h: x("Return to the team", "Kthehu te ekipi", "Zum Team zurückkehren"), p: x("Share what was verified, what will change and what still needs investigation.", "Ndaj çfarë u verifikua, çfarë do të ndryshojë dhe çfarë ka ende nevojë për hetim.", "Mitteilen, was geprüft wurde, was sich ändert und was noch untersucht werden muss.") },
            ] },
            { type: "p", text: x(
              "A safety-critical matter follows the existing immediate escalation rules; a process question can receive a slower, transparent review. The two should not be merged because the same worker identified them. Watch for one effect: after an invitation, reporting may rise because detection improved, not because the operation deteriorated.",
              "Një çështje kritike për sigurinë ndjek rregullat ekzistuese të eskalimit të menjëhershëm; një pyetje procesi mund të marrë një rishikim më të ngadaltë dhe transparent. Të dyja nuk duhen bashkuar vetëm se i identifikoi i njëjti punonjës. Kujdes për një efekt: pas një ftese, raportimi mund të rritet se u përmirësua zbulimi, jo se operacioni u keqësua.",
              "Sicherheitskritisches folgt den bestehenden Regeln sofortiger Eskalation; eine Prozessfrage verträgt eine langsamere, transparente Prüfung. Beides nicht verschmelzen, nur weil dieselbe Arbeitskraft es erkannt hat. Ein Effekt: Nach einer Einladung kann das Melden steigen, weil die Erkennung besser wurde, nicht der Betrieb schlechter.") },
            { type: "callout", reading: true, text: x(
              "The useful question is not “Why did nobody report it?” but “What made reporting possible, safe and worthwhile?”",
              "Pyetja e dobishme nuk është “Pse nuk e raportoi askush?”, por “Çfarë e bëri raportimin të mundur, të sigurt dhe të vlefshëm?”",
              "Die nützliche Frage ist nicht „Warum hat es niemand gemeldet?“, sondern „Was machte das Melden möglich, sicher und lohnend?“") },
          ],
          note: x(
            "Proposed operating checklist, not a validated intervention. Research foundations: Morrison and Milliken (2000); Tucker and Edmondson (2003).",
            "Listë kontrolli operative e propozuar, jo ndërhyrje e vërtetuar. Themelet kërkimore: Morrison e Milliken (2000); Tucker e Edmondson (2003).",
            "Vorgeschlagene Checkliste, keine validierte Intervention; nach Morrison und Milliken (2000) und Tucker und Edmondson (2003)."),
          source: ["morrison-milliken-2000", "tucker-edmondson-2003"],
        },
      ],
    },

    // Chapter II. The fear of speaking up
    {
      id: "ch-ii", type: "chapter", numeral: "II",
      title: x("The fear of speaking up", "Frika për të folur", "Die Angst, sich zu äußern"),
      pages: [
        {
          id: "ii-scene", layer: "scene", more: "teams-with-many-languages",
          title: [x("The sentence", "Fjalia", "Der Satz,"), x("left unsaid", "e lënë pa thënë", "der ungesagt blieb")],
          lead: x(
            "The cost of saying something can be immediate and personal; the benefit may be distant and uncertain.",
            "Kostoja e të thënit të diçkaje mund të jetë e menjëhershme dhe personale; dobia mund të jetë e largët dhe e pasigurt.",
            "Die Kosten, etwas zu sagen, können sofort und persönlich sein; der Nutzen kann fern und ungewiss sein."),
          blocks: [
            { type: "flag", text: x("Hypothetical team interaction, not the author's reported dialogue", "Ndërveprim hipotetik ekipi, jo dialog i raportuar i autorit", "Hypothetische Teaminteraktion, kein berichteter Dialog des Autors") },
            { type: "p", text: x(
              "A new team member spots an ambiguity in an instruction. The experienced colleagues proceed without discussion. The worker could ask, but the question may sound basic in front of a crowded room. There is no evidence that the instruction is wrong; the problem may be the employee's incomplete understanding. Still, the worker decides that asking later will be easier. The briefing ends; the ambiguity remains. A manager later says that everyone had the opportunity to ask. Technically, that may be true. Yet the relevant question is whether the opportunity felt usable to the people least familiar with the system. Speaking is a social act. A question carries information about the work, but it can also expose uncertainty, interrupt a supervisor and invite comparison with peers.",
              "Një anëtar i ri i ekipit vë re një paqartësi në një udhëzim. Kolegët me përvojë vazhdojnë pa diskutim. Punonjësi mund të pyesë, por pyetja mund të tingëllojë elementare para një salle plot. Nuk ka asnjë provë se udhëzimi është i gabuar; problemi mund të jetë kuptimi i paplotë i punonjësit. Megjithatë, punonjësi vendos se do të jetë më lehtë të pyesë më vonë. Instruktimi mbaron; paqartësia mbetet. Më vonë një menaxher thotë se të gjithë e patën mundësinë të pyesnin. Teknikisht, mund të jetë e vërtetë. Por pyetja përkatëse është nëse mundësia u duk e përdorshme për njerëzit që e njohin më pak sistemin. Të folurit është akt shoqëror. Një pyetje bart informacion për punën, por mund të ekspozojë edhe pasiguri, të ndërpresë një mbikëqyrës dhe të ftojë krahasim me kolegët.",
              "Ein neues Teammitglied bemerkt eine Unklarheit in einer Anweisung. Die erfahrenen Kolleginnen machen ohne Diskussion weiter. Die Arbeitskraft könnte fragen, doch die Frage könnte vor vollem Raum banal klingen. Es gibt keinen Beleg, dass die Anweisung falsch ist; das Problem kann das unvollständige Verständnis der Arbeitskraft sein. Trotzdem beschließt sie, später zu fragen. Die Besprechung endet; die Unklarheit bleibt. Eine Führungskraft sagt später, jeder habe die Gelegenheit zu fragen gehabt. Technisch mag das stimmen. Die eigentliche Frage ist, ob die Gelegenheit für die mit dem System am wenigsten Vertrauten nutzbar wirkte. Sprechen ist ein sozialer Akt. Eine Frage trägt Information über die Arbeit, kann aber auch Unsicherheit zeigen, eine Vorgesetzte unterbrechen und zum Vergleich mit Kolleginnen einladen.") },
            { type: "p", text: x(
              "This constructed scene illustrates an interpersonal risk, not a proven event at a hotel or last-mile employer. It argues neither that every silence means fear nor that safety removes accountability. It suggests that access to information depends partly on how people expect others to respond to an inconvenient question.",
              "Kjo skenë e ndërtuar ilustron një rrezik ndërpersonal, jo një ngjarje të provuar te një hotel apo punëdhënës i miljes së fundit. Nuk argumenton as se çdo heshtje do të thotë frikë, as se siguria e heq përgjegjësinë. Sugjeron se qasja në informacion varet pjesërisht nga mënyra si presin njerëzit që të tjerët t'i përgjigjen një pyetjeje të papërshtatshme.",
              "Diese konstruierte Szene zeigt ein zwischenmenschliches Risiko, kein belegtes Ereignis bei einem Hotel oder Last-Mile-Arbeitgeber. Sie behauptet weder, dass jedes Schweigen Angst bedeutet, noch dass Sicherheit Verantwortung aufhebt. Sie legt nahe, dass der Zugang zu Information teils davon abhängt, wie Menschen die Reaktion anderer auf eine unbequeme Frage erwarten.") },
            { type: "callout", reading: true, text: x(
              "An invitation has little value if the employee expects the cost of using it to outweigh the benefit.",
              "Një ftesë ka pak vlerë nëse punonjësi pret që kostoja e përdorimit të saj ta tejkalojë dobinë.",
              "Eine Einladung ist wenig wert, wenn die Arbeitskraft erwartet, dass ihre Nutzung mehr kostet als sie bringt.") },
          ],
          note: x(
            "Constructed illustration; the psychological-safety concept after Edmondson (1999), the employee interviews after Milliken, Morrison and Hewlin (2003). The essay named below works in a team of many languages.",
            "Ilustrim i ndërtuar; koncepti i sigurisë psikologjike sipas Edmondson-it (1999), intervistat e punonjësve sipas Milliken, Morrison e Hewlin (2003). Eseja e emërtuar më poshtë punon në një ekip me shumë gjuhë.",
            "Konstruierte Illustration; das Konzept der psychologischen Sicherheit nach Edmondson (1999), die Beschäftigteninterviews nach Milliken, Morrison und Hewlin (2003). Der unten genannte Essay arbeitet in einem Team vieler Sprachen."),
          source: ["edmondson-1999", "boss-milliken-2003"],
        },
        {
          id: "ii-concept", layer: "concept",
          title: [x("Psychological safety", "Siguria psikologjike", "Psychologische Sicherheit"), x("is not comfort", "nuk është rehati", "ist nicht Behaglichkeit")],
          lead: x(
            "The construct concerns perceived interpersonal risk when asking, admitting uncertainty or challenging a practice.",
            "Koncepti ka të bëjë me rrezikun ndërpersonal të perceptuar kur pyet, pranon pasiguri ose vë në pikëpyetje një praktikë.",
            "Das Konstrukt betrifft das wahrgenommene zwischenmenschliche Risiko beim Fragen, beim Eingestehen von Unsicherheit oder beim Infragestellen einer Praxis."),
          blocks: [
            { type: "p", text: x(
              "Amy Edmondson defined team psychological safety in 1999 as a shared belief that the team is safe for interpersonal risk taking. The distinction is exacting: it is not a promise that colleagues will always agree, that every criticism will be accepted or that professional standards can be ignored. A team can expect disciplined, high-quality work and still allow employees to identify a mistake without humiliation. Edmondson's field study examined 51 work teams within one manufacturing company. Psychological safety was associated with learning behaviours such as seeking feedback and discussing errors. The association was not a randomised test of a managerial training programme, and it establishes no universal numerical benefit for transport, hotels or wholesale operations.",
              "Amy Edmondson e përkufizoi sigurinë psikologjike të ekipit në vitin 1999 si bindje e përbashkët se ekipi është i sigurt për marrjen e rreziqeve ndërpersonale. Dallimi është i rreptë: nuk është premtim se kolegët do të pajtohen gjithmonë, se çdo kritikë do të pranohet apo se standardet profesionale mund të shpërfillen. Një ekip mund të presë punë të disiplinuar e me cilësi të lartë dhe prapë t'u lejojë punonjësve ta identifikojnë një gabim pa poshtërim. Studimi në terren i Edmondson-it shqyrtoi 51 ekipe pune brenda një kompanie prodhimi. Siguria psikologjike lidhej me sjellje të të mësuarit, si kërkimi i reagimit dhe diskutimi i gabimeve. Lidhja nuk ishte provë e randomizuar e një programi trajnimi për menaxherët, dhe nuk vërteton asnjë dobi numerike universale për transportin, hotelet apo shitjen me shumicë.",
              "Amy Edmondson definierte die psychologische Sicherheit eines Teams 1999 als geteilte Überzeugung, dass das Team sicher ist für zwischenmenschliches Risiko. Die Unterscheidung ist streng: Es ist kein Versprechen, dass Kolleginnen immer zustimmen, jede Kritik angenommen wird oder fachliche Standards ignoriert werden dürfen. Ein Team kann disziplinierte, hochwertige Arbeit erwarten und Beschäftigten dennoch erlauben, einen Fehler ohne Demütigung zu benennen. Edmondsons Feldstudie untersuchte 51 Arbeitsteams in einem Fertigungsunternehmen. Psychologische Sicherheit hing mit Lernverhalten zusammen, etwa Rückmeldung einholen und Fehler besprechen. Der Zusammenhang war kein randomisierter Test eines Führungstrainings und belegt keinen universellen Zahlenwert für Transport, Hotels oder Großhandel.") },
            { type: "cards", cols: 3, items: [
              { h: x("Voice", "Zëri", "Stimme"), p: x("Can I ask or warn without being treated as disloyal?", "A mund të pyes ose të paralajmëroj pa u trajtuar si i pabesë?", "Kann ich fragen oder warnen, ohne als illoyal zu gelten?") },
              { h: x("Standards", "Standardet", "Standards"), p: x("Will the concern be tested against the real requirement?", "A do të provohet shqetësimi kundrejt kërkesës së vërtetë?", "Wird das Anliegen an der echten Anforderung geprüft?") },
              { h: x("Accountability", "Përgjegjësia", "Verantwortung"), p: x("What must I still do, including urgent reporting duties?", "Çfarë duhet të bëj prapë, përfshirë detyrat urgjente të raportimit?", "Was muss ich weiterhin tun, auch dringende Meldepflichten?") },
            ] },
            { type: "p", text: x(
              "A manager can reduce unnecessary interpersonal risk by asking precise questions, thanking the person for specific information and separating the report of a problem from proof of responsibility. Conversely, a warm tone without consequences for unresolved risks is not enough. Psychological safety becomes operationally relevant when information moves into verification and a decision.",
              "Një menaxher mund ta ulë rrezikun e panevojshëm ndërpersonal duke bërë pyetje të sakta, duke e falënderuar personin për informacionin konkret dhe duke e ndarë raportimin e një problemi nga prova e përgjegjësisë. Anasjelltas, një ton i ngrohtë pa pasoja për rreziqet e pazgjidhura nuk mjafton. Siguria psikologjike bëhet operacionalisht e rëndësishme kur informacioni kalon në verifikim dhe në vendim.",
              "Eine Führungskraft kann unnötiges zwischenmenschliches Risiko senken, indem sie präzise fragt, für konkrete Information dankt und die Meldung eines Problems vom Nachweis der Verantwortung trennt. Umgekehrt genügt ein warmer Ton ohne Folgen für ungelöste Risiken nicht. Psychologische Sicherheit wird betrieblich relevant, wenn Information in Prüfung und Entscheidung übergeht.") },
            { type: "callout", reading: true, text: x(
              "Safety to speak and responsibility to act are complements, not opposites.",
              "Siguria për të folur dhe përgjegjësia për të vepruar plotësojnë njëra-tjetrën, nuk kundërshtohen.",
              "Sicherheit zu sprechen und Verantwortung zu handeln ergänzen sich, sie widersprechen sich nicht.") },
          ],
          note: x(
            "Edmondson, Administrative Science Quarterly (1999). The three-part practical interpretation is editorial.",
            "Edmondson, Administrative Science Quarterly (1999). Interpretimi praktik me tri pjesë është editorial.",
            "Edmondson, Administrative Science Quarterly (1999). Die dreiteilige praktische Deutung ist redaktionell."),
          source: ["edmondson-1999"],
        },
        {
          id: "ii-evidence", layer: "concept",
          title: [x("Two studies,", "Dy studime,", "Zwei Studien,"), x("different questions", "pyetje të ndryshme", "verschiedene Fragen")],
          lead: x(
            "One examines learning in teams. Another asks why employees decide to remain silent. A third separates two kinds of voice.",
            "Njëri shqyrton të mësuarit në ekipe. Tjetri pyet pse punonjësit vendosin të heshtin. Një i tretë ndan dy lloje zëri.",
            "Eine untersucht Lernen in Teams. Eine andere fragt, warum Beschäftigte schweigen. Eine dritte trennt zwei Arten von Stimme."),
          blocks: [
            { type: "stats", cols: 2, items: [
              { n: "51", t: x("manufacturing work teams in Edmondson's 1999 field study; psychological safety associated with learning behaviour, with the study's controls", "ekipe pune prodhimi në studimin në terren të Edmondson-it, 1999; siguria psikologjike e lidhur me sjelljen e të mësuarit, me kontrollet e studimit", "Fertigungsteams in Edmondsons Feldstudie 1999; psychologische Sicherheit verbunden mit Lernverhalten, mit den Kontrollen der Studie"), by: x("Edmondson, 1999, one company", "Edmondson, 1999, një kompani", "Edmondson, 1999, ein Unternehmen") },
              { n: "40", t: x("employees interviewed in Milliken, Morrison and Hewlin's 2003 exploratory study; fear of negative labels and damaged relationships was frequently described", "punonjës të intervistuar në studimin eksplorues të Milliken, Morrison e Hewlin, 2003; frika nga etiketat negative dhe marrëdhëniet e dëmtuara përshkruhej shpesh", "Beschäftigte in der explorativen Studie von Milliken, Morrison und Hewlin 2003; Angst vor negativen Etiketten und beschädigten Beziehungen wurde häufig genannt"), by: x("Milliken, Morrison and Hewlin, 2003, interviews", "Milliken, Morrison e Hewlin, 2003, intervista", "Milliken, Morrison und Hewlin, 2003, Interviews") },
            ] },
            { type: "p", text: x(
              "The samples cannot be combined into a prevalence estimate. The manufacturing study concerns team-level beliefs and behaviours. The interview study explores employees' accounts of situations in which they chose not to raise concerns; it is not designed to say what share of all workers behave this way. Both make the social cost of voice analytically visible, but neither proves the outcome of a specific speak-up initiative at a loading point. The distinction between promotive and prohibitive voice deepens this. A suggestion for a better process and a warning that a current process is unsafe or failing feel quite different. Liang, Farh and Farh followed 239 employees in a two-wave study and reported different psychological antecedents for the two kinds of voice. A channel that attracts ideas will not automatically attract difficult warnings.",
              "Mostrat nuk mund të bashkohen në një vlerësim përhapjeje. Studimi i prodhimit ka të bëjë me bindjet dhe sjelljet në nivel ekipi. Studimi me intervista eksploron rrëfimet e punonjësve për situata ku zgjodhën të mos ngrinin shqetësime; nuk është projektuar për të thënë çfarë pjese e të gjithë punonjësve sillet kështu. Të dyja e bëjnë analitikisht të dukshme koston shoqërore të zërit, por asnjëri nuk e provon rezultatin e një nisme të caktuar për të folur në një pikë ngarkimi. Dallimi mes zërit promovues dhe atij ndalues e thellon këtë. Një sugjerim për një proces më të mirë dhe një paralajmërim se procesi aktual është i pasigurt ose po dështon ndihen krejt ndryshe. Liang, Farh dhe Farh ndoqën 239 punonjës në një studim me dy valë dhe raportuan paraardhës psikologjikë të ndryshëm për të dy llojet e zërit. Një kanal që tërheq ide nuk do të tërheqë automatikisht paralajmërime të vështira.",
              "Die Stichproben lassen sich nicht zu einer Prävalenzschätzung verbinden. Die Fertigungsstudie betrifft Überzeugungen und Verhalten auf Teamebene. Die Interviewstudie erkundet Schilderungen von Situationen, in denen Beschäftigte Bedenken nicht äußerten; sie ist nicht dafür gebaut, den Anteil aller Beschäftigten zu nennen, die sich so verhalten. Beide machen die sozialen Kosten der Stimme analytisch sichtbar, doch keine beweist das Ergebnis einer bestimmten Initiative an einem Ladepunkt. Die Unterscheidung zwischen fördernder und verhindernder Stimme vertieft das. Ein Vorschlag für einen besseren Prozess und eine Warnung, dass ein Prozess unsicher ist oder versagt, fühlen sich sehr verschieden an. Liang, Farh und Farh folgten 239 Beschäftigten in einer Zwei-Wellen-Studie und berichteten verschiedene psychologische Vorläufer für beide Arten. Ein Kanal, der Ideen anzieht, zieht nicht automatisch schwierige Warnungen an.") },
            { type: "callout", reading: true, text: x(
              "Count the study participants accurately. Never turn their stories into an invented company-wide silence rate.",
              "Numëroji saktë pjesëmarrësit e studimit. Mos i kthe kurrë historitë e tyre në një normë heshtjeje të shpikur për gjithë kompaninë.",
              "Zählen Sie die Studienteilnehmer genau. Machen Sie aus ihren Geschichten nie eine erfundene unternehmensweite Schweigequote.") },
          ],
          note: x(
            "Edmondson (1999); Milliken, Morrison and Hewlin (2003); Liang, Farh and Farh (2012). No cross-study effect is calculated.",
            "Edmondson (1999); Milliken, Morrison e Hewlin (2003); Liang, Farh e Farh (2012). Nuk llogaritet asnjë efekt ndërstudimor.",
            "Edmondson (1999); Milliken, Morrison und Hewlin (2003); Liang, Farh und Farh (2012). Kein studienübergreifender Effekt wird berechnet."),
          source: ["edmondson-1999", "boss-milliken-2003", "liang-farh-farh-2012"],
        },
        {
          id: "ii-protocol", layer: "protocol",
          title: [x("Make the first response", "Bëje përgjigjen e parë", "Die erste Antwort"), x("worth the risk", "të vlejë rrezikun", "das Risiko wert machen")],
          lead: x(
            "The first managerial reaction can lower or raise the perceived risk of the next report.",
            "Reagimi i parë i menaxherit mund ta ulë ose ta rrisë rrezikun e perceptuar të raportit të radhës.",
            "Die erste Reaktion der Führung kann das wahrgenommene Risiko der nächsten Meldung senken oder erhöhen."),
          blocks: [
            { type: "steps", items: [
              { h: x("Acknowledge the contribution", "Prano kontributin", "Den Beitrag anerkennen"), p: x("The person supplied potentially useful information; say so without certifying a cause.", "Personi dha informacion potencialisht të dobishëm; thuaje pa vërtetuar një shkak.", "Die Person lieferte womöglich nützliche Information; das sagen, ohne eine Ursache zu bescheinigen.") },
              { h: x("Clarify the observation", "Sqaro vëzhgimin", "Die Beobachtung klären"), p: x("What happened, when it was noticed and what the worker could actually verify.", "Çfarë ndodhi, kur u vu re dhe çfarë mundi të verifikonte vërtet punonjësi.", "Was geschah, wann es auffiel und was die Arbeitskraft wirklich prüfen konnte.") },
              { h: x("Do not demand an instant culprit", "Mos kërko fajtor të çastit", "Keinen sofortigen Schuldigen verlangen"), p: x("Distinguish an honest report from any later finding about conduct or compliance.", "Dalloje një raport të ndershëm nga çdo gjetje e mëvonshme për sjelljen apo përputhshmërinë.", "Eine ehrliche Meldung von späteren Befunden zu Verhalten oder Compliance trennen.") },
              { h: x("Protect appropriate privacy", "Mbro privatësinë e duhur", "Angemessene Vertraulichkeit schützen"), p: x("Authorised channels for serious allegations or confidential details; no published case files.", "Kanale të autorizuara për akuza serioze ose detaje konfidenciale; pa dosje rastesh të publikuara.", "Autorisierte Wege für ernste Vorwürfe oder vertrauliche Details; keine Fallakten veröffentlichen.") },
              { h: x("Give a realistic next step", "Jep një hap të radhës realist", "Einen realistischen nächsten Schritt nennen"), p: x("The role that will review the matter and the timing of an update.", "Roli që do ta shqyrtojë çështjen dhe koha e një përditësimi.", "Die prüfende Rolle und der Zeitpunkt einer Rückmeldung.") },
              { h: x("Follow through", "Çoje deri në fund", "Dranbleiben"), p: x("Even when the claim proves incorrect, explain the reasoning respectfully where appropriate.", "Edhe kur pohimi del i pasaktë, shpjegoje arsyetimin me respekt, ku është e përshtatshme.", "Auch bei falscher Behauptung die Begründung respektvoll erklären, wo angemessen.") },
            ] },
            { type: "p", text: x(
              "An urgent concern uses the existing emergency or escalation process. In routine improvement, leaders should avoid teaching employees that a problem becomes dangerous to their reputation merely because it is uncomfortable for the manager. Equally, a fair inquiry allows the concern to be inaccurate; it does not presume the reporter was right.",
              "Një shqetësim urgjent përdor procesin ekzistues të emergjencës ose të eskalimit. Në përmirësimin rutinë, drejtuesit duhet të shmangin t'u mësojnë punonjësve se një problem bëhet i rrezikshëm për reputacionin e tyre thjesht se është i papërshtatshëm për menaxherin. Po ashtu, një hetim i drejtë lejon që shqetësimi të jetë i pasaktë; nuk supozon se raportuesi kishte të drejtë.",
              "Ein dringendes Anliegen nutzt den bestehenden Notfall- oder Eskalationsprozess. In der laufenden Verbesserung dürfen Beschäftigte nicht lernen, dass ein Problem ihrem Ruf schadet, nur weil es der Führung unangenehm ist. Eine faire Prüfung lässt zu, dass das Anliegen unzutreffend ist; sie unterstellt nicht, dass die meldende Person recht hatte.") },
            { type: "callout", reading: true, text: x(
              "The first response to a concern is also a lesson to everybody deciding whether to speak next time.",
              "Përgjigjja e parë ndaj një shqetësimi është edhe mësim për këdo që vendos nëse do të flasë herën tjetër.",
              "Die erste Antwort auf ein Anliegen ist auch eine Lektion für alle, die entscheiden, ob sie nächstes Mal sprechen.") },
          ],
          note: x(
            "Original practice proposal informed by Edmondson (1999), Milliken, Morrison and Hewlin (2003) and Morrison (2014).",
            "Propozim praktik origjinal i mbështetur te Edmondson (1999), Milliken, Morrison e Hewlin (2003) dhe Morrison (2014).",
            "Eigener Praxisvorschlag nach Edmondson (1999), Milliken et al. (2003) und Morrison (2014)."),
          source: ["edmondson-1999", "boss-milliken-2003"],
        },
      ],
    },

    // Chapter III. The open door nobody uses
    {
      id: "ch-iii", type: "chapter", numeral: "III",
      title: x("The open door nobody uses", "Dera e hapur që askush nuk e përdor", "Die offene Tür, die niemand nutzt"),
      pages: [
        {
          id: "iii-scene", layer: "scene", more: "leading-people-without-losing-the-person",
          title: [x("The open door", "Dera e hapur", "Die offene Tür,"), x("nobody enters", "ku askush nuk hyn", "durch die niemand geht")],
          lead: x(
            "A leader can sincerely invite feedback and still, without meaning to, make the invitation difficult to accept.",
            "Një drejtues mund të ftojë sinqerisht për reagime dhe prapë, pa dashur, ta bëjë ftesën të vështirë për t'u pranuar.",
            "Eine Führungskraft kann aufrichtig um Rückmeldung bitten und die Einladung trotzdem, ohne es zu wollen, schwer annehmbar machen."),
          blocks: [
            { type: "flag", text: x("Hypothetical leadership scene, not a documented meeting", "Skenë hipotetike drejtimi, jo mbledhje e dokumentuar", "Hypothetische Führungsszene, keine dokumentierte Besprechung") },
            { type: "p", text: x(
              "A supervisor ends the weekly briefing by saying that the door is open. The team nods. During the meeting the supervisor had interrupted one colleague repeatedly, explained away a concern before hearing its details and described another question as something everybody should already know. No explicit prohibition has been issued. Nevertheless, the team has received more than one message about what kind of speaking is welcome. Another employee knows that a recurrent task has become harder since a process change. It is possible to talk to the supervisor privately. But asking for attention feels like arguing with the person who owns the new procedure. The employee waits for a better moment, and the manager later infers from the quiet meeting that the rollout is complete.",
              "Një mbikëqyrës e mbyll instruktimin javor duke thënë se dera është e hapur. Ekipi pohon me kokë. Gjatë mbledhjes mbikëqyrësi e kishte ndërprerë një koleg vazhdimisht, e kishte hedhur poshtë një shqetësim para se t'i dëgjonte detajet dhe e kishte përshkruar një pyetje tjetër si diçka që duhet ta dinë të gjithë. Nuk është dhënë asnjë ndalim i shprehur. Megjithatë, ekipi ka marrë më shumë se një mesazh për llojin e të folurit që mirëpritet. Një punonjës tjetër e di se një detyrë e përsëritur është bërë më e vështirë që nga një ndryshim procesi. Është e mundur të flasë privatisht me mbikëqyrësin. Por të kërkosh vëmendje ndihet si të debatosh me personin që e zotëron procedurën e re. Punonjësi pret një çast më të mirë, dhe menaxheri më vonë nxjerr nga mbledhja e qetë se zbatimi ka përfunduar.",
              "Eine Vorgesetzte beendet die Wochenbesprechung mit dem Satz, die Tür stehe offen. Das Team nickt. Während der Besprechung hatte sie eine Kollegin mehrfach unterbrochen, ein Anliegen weggewischt, bevor sie die Einzelheiten hörte, und eine andere Frage als etwas bezeichnet, das jeder wissen sollte. Kein ausdrückliches Verbot wurde ausgesprochen. Dennoch hat das Team mehr als eine Botschaft darüber erhalten, welche Art des Sprechens willkommen ist. Eine andere Arbeitskraft weiß, dass eine wiederkehrende Aufgabe seit einer Prozessänderung schwerer geworden ist. Ein privates Gespräch mit der Vorgesetzten wäre möglich. Doch um Aufmerksamkeit zu bitten fühlt sich an wie ein Streit mit der Person, der das neue Verfahren gehört. Die Arbeitskraft wartet auf einen besseren Moment, und die Führung schließt später aus der stillen Besprechung, die Einführung sei abgeschlossen.") },
            { type: "p", text: x(
              "This scene is assembled to illustrate managerial signals. It accuses no named leader or organisation and is not a transcript from the author's experience. Its question is practical: which matters more, the verbal invitation or the way leaders react when a concern finally arrives?",
              "Kjo skenë është montuar për të ilustruar sinjalet menaxheriale. Nuk akuzon asnjë drejtues apo organizatë të emërtuar dhe nuk është transkript nga përvoja e autorit. Pyetja e saj është praktike: cila ka më shumë rëndësi, ftesa me fjalë apo mënyra si reagojnë drejtuesit kur një shqetësim më në fund mbërrin?",
              "Diese Szene ist zusammengesetzt, um Führungssignale zu zeigen. Sie beschuldigt keine benannte Führungskraft oder Organisation und ist kein Protokoll aus der Erfahrung des Autors. Ihre Frage ist praktisch: Was zählt mehr, die verbale Einladung oder die Reaktion der Führung, wenn ein Anliegen endlich ankommt?") },
            { type: "callout", reading: true, text: x(
              "An open door is a claim about access. The response to the first inconvenient question tests that claim.",
              "Një derë e hapur është pretendim për qasje. Përgjigjja ndaj pyetjes së parë të papërshtatshme e provon atë pretendim.",
              "Eine offene Tür ist eine Behauptung über Zugang. Die Antwort auf die erste unbequeme Frage prüft diese Behauptung.") },
          ],
          note: x(
            "Constructed scene. Research lens: Detert and Burris (2007); Nembhard and Edmondson (2006). The essay named below leads people without losing the person.",
            "Skenë e ndërtuar. Lentja kërkimore: Detert e Burris (2007); Nembhard e Edmondson (2006). Eseja e emërtuar më poshtë drejton njerëz pa e humbur personin.",
            "Konstruierte Szene. Forschungslinse: Detert und Burris (2007); Nembhard und Edmondson (2006). Der unten genannte Essay führt Menschen, ohne den Menschen zu verlieren."),
          source: ["detert-burris-2007", "nembhard-edmondson-2006"],
        },
        {
          id: "iii-concept", layer: "concept",
          title: [x("Openness is", "Hapja është", "Offenheit ist"), x("observable behaviour", "sjellje e vëzhgueshme", "beobachtbares Verhalten")],
          lead: x(
            "Leadership affects voice not only through its declared values, but through the social signals attached to everyday responses.",
            "Drejtimi ndikon te zëri jo vetëm përmes vlerave të deklaruara, por përmes sinjaleve shoqërore që shoqërojnë përgjigjet e përditshme.",
            "Führung wirkt auf die Stimme nicht nur durch erklärte Werte, sondern durch die sozialen Signale, die an alltäglichen Reaktionen hängen."),
          blocks: [
            { type: "p", text: x(
              "Detert and Burris examined employee voice in a two-phase study of 3,149 employees and 223 managers at a restaurant chain. Managerial openness was more consistently associated with improvement-oriented voice than the other leadership construct they measured, transformational leadership, and perceived psychological safety mediated the relationship in their model. This does not show that merely telling managers to smile makes employees speak. Nembhard and Edmondson studied 23 neonatal intensive care units engaged in improvement projects. Their survey results supported a model in which inclusive words and actions from leaders related to psychological safety and to engagement in improvement, in the presence of professional-status differences. Those findings come from clinical teams, not hotels or transport operators.",
              "Detert dhe Burris e shqyrtuan zërin e punonjësve në një studim me dy faza me 3.149 punonjës dhe 223 menaxherë në një zinxhir restorantesh. Hapja e menaxherit lidhej më vazhdimisht me zërin e orientuar nga përmirësimi sesa konstrukti tjetër i drejtimit që matën, drejtimi transformues, dhe siguria psikologjike e perceptuar e ndërmjetësonte lidhjen në modelin e tyre. Kjo nuk tregon se mjafton t'u thuash menaxherëve të buzëqeshin që punonjësit të flasin. Nembhard dhe Edmondson studiuan 23 njësi të kujdesit intensiv neonatal të përfshira në projekte përmirësimi. Rezultatet e anketës së tyre e mbështetën një model ku fjalët dhe veprimet gjithëpërfshirëse të drejtuesve lidheshin me sigurinë psikologjike dhe me angazhimin në përmirësim, në prani të dallimeve të statusit profesional. Këto gjetje vijnë nga ekipe klinike, jo nga hotele apo operatorë transporti.",
              "Detert und Burris untersuchten die Stimme der Beschäftigten in einer zweiphasigen Studie mit 3.149 Beschäftigten und 223 Führungskräften einer Restaurantkette. Die Offenheit der Führung hing beständiger mit verbesserungsorientierter Stimme zusammen als das andere gemessene Führungskonstrukt, die transformationale Führung, und wahrgenommene psychologische Sicherheit vermittelte den Zusammenhang in ihrem Modell. Das zeigt nicht, dass Beschäftigte sprechen, sobald man Führungskräften sagt, sie sollten lächeln. Nembhard und Edmondson untersuchten 23 neonatologische Intensivstationen in Verbesserungsprojekten. Ihre Umfrageergebnisse stützten ein Modell, in dem einbeziehende Worte und Taten der Führung mit psychologischer Sicherheit und mit Engagement für Verbesserung zusammenhingen, bei bestehenden Unterschieden im beruflichen Status. Diese Befunde stammen aus klinischen Teams, nicht aus Hotels oder Transportbetrieben.") },
            { type: "cards", cols: 3, items: [
              { h: x("Invite", "Fto", "Einladen"), p: x("Ask for inconvenient information, not just good news.", "Kërko informacion të papërshtatshëm, jo vetëm lajme të mira.", "Nach unbequemer Information fragen, nicht nur nach guten Nachrichten.") },
              { h: x("Receive", "Merr", "Empfangen"), p: x("Make room for clarification without interruption or ridicule.", "Lër hapësirë për sqarim pa ndërprerje dhe pa tallje.", "Raum für Klärung lassen, ohne Unterbrechung oder Spott.") },
              { h: x("Conclude", "Mbyll", "Abschließen"), p: x("Describe the decision and the right channel for further action.", "Përshkruaj vendimin dhe kanalin e duhur për veprim të mëtejshëm.", "Die Entscheidung und den richtigen Weg für weitere Schritte beschreiben.") },
            ] },
            { type: "p", text: x(
              "These principles are deliberately behavioural. A worker evaluates a leader's reaction to correction, uncertainty and disagreement. A stated intention matters, but is weaker evidence than the visible response to an actual concern. Open dialogue still requires verification, good faith and compliance with the standards that protect customers and workers.",
              "Këto parime janë qëllimisht të sjelljes. Punonjësi e vlerëson reagimin e drejtuesit ndaj korrigjimit, pasigurisë dhe mospajtimit. Një qëllim i deklaruar ka rëndësi, por është provë më e dobët se përgjigjja e dukshme ndaj një shqetësimi të vërtetë. Dialogu i hapur kërkon prapë verifikim, mirëbesim dhe përputhje me standardet që mbrojnë klientët dhe punonjësit.",
              "Diese Grundsätze sind bewusst verhaltensbezogen. Eine Arbeitskraft bewertet die Reaktion der Führung auf Korrektur, Unsicherheit und Widerspruch. Eine erklärte Absicht zählt, ist aber ein schwächerer Beleg als die sichtbare Antwort auf ein echtes Anliegen. Offener Dialog verlangt weiterhin Prüfung, guten Glauben und die Einhaltung der Standards, die Kunden und Beschäftigte schützen.") },
            { type: "callout", reading: true, text: x(
              "Openness becomes credible through a repeated pattern of response, not a sign on the office door.",
              "Hapja bëhet e besueshme përmes një modeli të përsëritur përgjigjeje, jo përmes një tabele në derën e zyrës.",
              "Offenheit wird glaubwürdig durch ein wiederholtes Muster von Antworten, nicht durch ein Schild an der Bürotür.") },
          ],
          note: x(
            "Detert and Burris, Academy of Management Journal (2007); Nembhard and Edmondson, Journal of Organizational Behavior (2006).",
            "Detert e Burris, Academy of Management Journal (2007); Nembhard e Edmondson, Journal of Organizational Behavior (2006).",
            "Detert und Burris, Academy of Management Journal (2007); Nembhard und Edmondson, Journal of Organizational Behavior (2006)."),
          source: ["detert-burris-2007", "nembhard-edmondson-2006"],
        },
        {
          id: "iii-evidence", layer: "concept",
          title: [x("The influence", "Ndikimi", "Der Einfluss"), x("above the supervisor", "mbi mbikëqyrësin", "über der Vorgesetzten")],
          lead: x(
            "Workers read the wider hierarchy, not only the personality of their immediate manager.",
            "Punonjësit e lexojnë hierarkinë më të gjerë, jo vetëm personalitetin e menaxherit të drejtpërdrejtë.",
            "Beschäftigte lesen die weitere Hierarchie, nicht nur die Persönlichkeit ihrer direkten Führungskraft."),
          blocks: [
            { type: "stat", n: "89", t: x("interviews in Detert and Treviño's qualitative research at a multinational technology company, across manufacturing and research-and-development units", "intervista në kërkimin cilësor të Detert e Treviño në një kompani teknologjike shumëkombëshe, nëpër njësi prodhimi dhe kërkimi e zhvillimi", "Interviews in der qualitativen Forschung von Detert und Treviño in einem multinationalen Technologieunternehmen, in Fertigungs- und Entwicklungseinheiten") },
            { type: "p", text: x(
              "Employees described direct supervisors and leaders several levels higher as influencing whether speaking up seemed risky or futile. The findings complicate the advice to fix the relationship with the immediate manager. A frontline employee may expect the local supervisor to listen, yet believe that someone with authority over the actual process will ignore or penalise the message. The number 89 counts interviews, not silenced employees. The research did not measure what share of operational issues went unreported; it identified pathways of perceived influence in one company. Its relevance to a warehouse, a hotel or a wholesale service is a hypothesis about hierarchy to be checked, not assumed.",
              "Punonjësit i përshkruan mbikëqyrësit e drejtpërdrejtë dhe drejtuesit disa nivele më lart si ndikues të faktit nëse të folurit dukej i rrezikshëm apo i kotë. Gjetjet e ndërlikojnë këshillën për ta rregulluar marrëdhënien me menaxherin e drejtpërdrejtë. Një punonjës i vijës së parë mund të presë që mbikëqyrësi lokal të dëgjojë, por të besojë se dikush me autoritet mbi procesin e vërtetë do ta shpërfillë ose ndëshkojë mesazhin. Numri 89 numëron intervista, jo punonjës të heshtur. Kërkimi nuk mati çfarë pjese e problemeve operacionale mbeti e paraportuar; identifikoi rrugë ndikimi të perceptuar në një kompani. Rëndësia e tij për një magazinë, një hotel apo një shërbim me shumicë është hipotezë për hierarkinë që duhet kontrolluar, jo supozuar.",
              "Beschäftigte beschrieben direkte Vorgesetzte und Führungskräfte mehrere Ebenen höher als Einfluss darauf, ob Ansprechen riskant oder zwecklos schien. Die Befunde verkomplizieren den Rat, die Beziehung zur direkten Führungskraft zu verbessern. Eine Arbeitskraft an der Front mag erwarten, dass die örtliche Vorgesetzte zuhört, und dennoch glauben, dass jemand mit Autorität über den eigentlichen Prozess die Botschaft ignoriert oder bestraft. Die Zahl 89 zählt Interviews, nicht zum Schweigen gebrachte Beschäftigte. Die Forschung maß nicht, welcher Anteil betrieblicher Probleme ungemeldet blieb; sie identifizierte Pfade wahrgenommenen Einflusses in einem Unternehmen. Ihre Bedeutung für ein Lager, ein Hotel oder einen Großhandelsdienst ist eine Hypothese über Hierarchie, die zu prüfen ist, nicht anzunehmen.") },
            { type: "rows", compact: true, label: x("Leader signal, and a possible reading by the team", "Sinjali i drejtuesit, dhe një lexim i mundshëm nga ekipi", "Führungssignal, und eine mögliche Lesart des Teams"), items: [
              { h: x("Asks for contradictions", "Kërkon kundërshtime", "Bittet um Widerspruch"), p: x("Inconvenient facts may be useful.", "Faktet e papërshtatshme mund të jenë të dobishme.", "Unbequeme Fakten können nützlich sein.") },
              { h: x("Explains an unresolved decision", "Shpjegon një vendim të pazgjidhur", "Erklärt eine offene Entscheidung"), p: x("The issue was heard, even without a fix.", "Çështja u dëgjua, edhe pa zgjidhje.", "Das Anliegen wurde gehört, auch ohne Lösung.") },
              { h: x("Dismisses a question publicly", "E hedh poshtë një pyetje publikisht", "Wischt eine Frage öffentlich weg"), p: x("Speaking up may risk reputation.", "Të folurit mund ta rrezikojë reputacionin.", "Ansprechen kann den Ruf gefährden.") },
              { h: x("Escalates carefully", "Eskalon me kujdes", "Eskaliert sorgfältig"), p: x("Authority may support local learning.", "Autoriteti mund ta mbështesë të mësuarit lokal.", "Autorität kann lokales Lernen stützen.") },
            ] },
            { type: "callout", reading: true, text: x(
              "The reporting line and the decision-making line are not always the same line.",
              "Vija e raportimit dhe vija e vendimmarrjes nuk janë gjithmonë e njëjta vijë.",
              "Die Meldelinie und die Entscheidungslinie sind nicht immer dieselbe Linie.") },
          ],
          note: x(
            "Detert and Treviño, Organization Science (2010), qualitative research. The interpretive table is editorial.",
            "Detert e Treviño, Organization Science (2010), kërkim cilësor. Tabela interpretuese është editoriale.",
            "Detert und Treviño, Organization Science (2010), qualitative Forschung. Die Deutungstabelle ist redaktionell."),
          source: ["detert-trevino-2010"],
        },
        {
          id: "iii-protocol", layer: "protocol",
          title: [x("A listening routine", "Një rutinë dëgjimi", "Eine Zuhörroutine,"), x("that can be checked", "që mund të kontrollohet", "die sich prüfen lässt")],
          lead: x(
            "Turn openness into a small set of public behaviours without exposing employees or confidential issues.",
            "Ktheje hapjen në një tog të vogël sjelljesh publike pa i ekspozuar punonjësit apo çështjet konfidenciale.",
            "Offenheit in wenige öffentliche Verhaltensweisen verwandeln, ohne Beschäftigte oder vertrauliche Themen bloßzustellen."),
          blocks: [
            { type: "steps", items: [
              { h: x("Ask one focused question", "Bëj një pyetje të fokusuar", "Eine gezielte Frage stellen"), p: x("For example: which part of today's handover forced a second explanation?", "Për shembull: cila pjesë e dorëzimit të sotëm kërkoi një shpjegim të dytë?", "Zum Beispiel: Welcher Teil der heutigen Übergabe erzwang eine zweite Erklärung?") },
              { h: x("Allow a second interpretation", "Lejo një interpretim të dytë", "Eine zweite Deutung zulassen"), p: x("Invite the team to correct the leader's understanding before a conclusion is drawn.", "Ftoje ekipin ta korrigjojë kuptimin e drejtuesit para se të nxirret një përfundim.", "Das Team einladen, das Verständnis der Führung zu korrigieren, bevor ein Schluss gezogen wird.") },
              { h: x("Protect dissent", "Mbro mospajtimin", "Widerspruch schützen"), p: x("Separate the content of a concern from assumptions about attitude or loyalty.", "Ndaje përmbajtjen e një shqetësimi nga supozimet për qëndrimin apo besnikërinë.", "Den Inhalt eines Anliegens von Annahmen über Haltung oder Loyalität trennen.") },
              { h: x("Name the responsible level", "Emërto nivelin përgjegjës", "Die zuständige Ebene benennen"), p: x("If the local supervisor cannot change the condition, clarify the authorised escalation route.", "Nëse mbikëqyrësi lokal nuk e ndryshon dot kushtin, sqaro rrugën e autorizuar të eskalimit.", "Kann die örtliche Vorgesetzte die Bedingung nicht ändern, den autorisierten Eskalationsweg klären.") },
              { h: x("Report the status truthfully", "Raportoje statusin me vërtetësi", "Den Status wahrheitsgemäß berichten"), p: x("Acknowledged, under review, decision reached and closed are different conditions.", "E pranuar, në shqyrtim, e vendosur dhe e mbyllur janë gjendje të ndryshme.", "Bestätigt, in Prüfung, entschieden und geschlossen sind verschiedene Zustände.") },
              { h: x("Check the next meeting", "Kontrollo mbledhjen e radhës", "Die nächste Besprechung prüfen"), p: x("Did the team receive a meaningful answer about the issue previously raised?", "A mori ekipi një përgjigje kuptimplotë për çështjen e ngritur më parë?", "Hat das Team eine aussagekräftige Antwort zum zuvor angesprochenen Thema erhalten?") },
            ] },
            { type: "p", text: x(
              "A routine does not turn every meeting into a public complaints session. Some issues belong in confidential, human-resources, safety or other formal channels. The common principle is that the employee knows where to raise an issue and how to get a response, without the concern being turned into an accusation by default.",
              "Një rutinë nuk e kthen çdo mbledhje në seancë publike ankesash. Disa çështje u takojnë kanaleve konfidenciale, të burimeve njerëzore, të sigurisë ose kanaleve të tjera formale. Parimi i përbashkët është që punonjësi e di ku ta ngrejë një çështje dhe si të marrë përgjigje, pa u kthyer shqetësimi në akuzë si parazgjedhje.",
              "Eine Routine macht nicht jede Besprechung zur öffentlichen Beschwerdestunde. Manche Themen gehören in vertrauliche, personalbezogene, sicherheitsbezogene oder andere formelle Kanäle. Der gemeinsame Grundsatz: Die Arbeitskraft weiß, wo sie ein Thema anspricht und wie sie eine Antwort erhält, ohne dass das Anliegen standardmäßig zur Anschuldigung wird.") },
            { type: "callout", reading: true, text: x(
              "The observable test of openness is whether the team can bring difficult facts into a usable decision process.",
              "Prova e vëzhgueshme e hapjes është nëse ekipi mund t'i sjellë faktet e vështira në një proces vendimi të përdorshëm.",
              "Der beobachtbare Test der Offenheit ist, ob das Team schwierige Fakten in einen nutzbaren Entscheidungsprozess einbringen kann.") },
          ],
          note: x(
            "Editorial protocol developed from Detert and Burris (2007), Detert and Treviño (2010) and Nembhard and Edmondson (2006).",
            "Protokoll editorial i zhvilluar nga Detert e Burris (2007), Detert e Treviño (2010) dhe Nembhard e Edmondson (2006).",
            "Redaktionelles Protokoll, entwickelt aus Detert und Burris (2007), Detert und Treviño (2010) und Nembhard und Edmondson (2006)."),
          source: ["detert-burris-2007", "detert-trevino-2010", "nembhard-edmondson-2006"],
        },
      ],
    },

    // Chapter IV. The silent shift
    {
      id: "ch-iv", type: "chapter", numeral: "IV",
      title: x("The silent shift", "Turni i heshtur", "Die stumme Schicht"),
      pages: [
        {
          id: "iv-scene", layer: "scene", more: "why-the-handover-is-underrated",
          title: [x("The quiet", "Dorëzimi", "Die stille"), x("handover", "i qetë", "Übergabe")],
          lead: x(
            "Work moves between people who may never have the chance to explain it face to face.",
            "Puna kalon mes njerëzve që mund të mos kenë kurrë rastin ta shpjegojnë ballë për ballë.",
            "Arbeit wandert zwischen Menschen, die vielleicht nie die Gelegenheit haben, sie sich von Angesicht zu Angesicht zu erklären."),
          blocks: [
            { type: "flag", text: x("Constructed hotel-shift example, not a claimed guest incident", "Shembull i ndërtuar turni hoteli, jo ngjarje e pretenduar mysafiri", "Konstruiertes Hotelschicht-Beispiel, kein behaupteter Gästevorfall") },
            { type: "p", text: x(
              "An evening team completes its shift. A small service concern was raised earlier; somebody has looked at it, but another department must decide what happens next. The situation is not urgent. A brief handover note says only that it needs follow-up. The night colleague can see the open item, but not the uncertainty behind it: what was actually checked, which answer was given and who owns the next step. At first glance the issue is an incomplete handover. Yet one more question matters. Did the earlier colleague omit information because the template made it hard to record, because the person did not know which detail was useful, or because an uncomfortable uncertainty seemed better left unsaid? The manager cannot diagnose intentional silence from an incomplete note alone.",
              "Një ekip i mbrëmjes e mbyll turnin. Një shqetësim i vogël shërbimi ishte ngritur më herët; dikush e ka parë, por një departament tjetër duhet të vendosë çfarë ndodh më pas. Situata nuk është urgjente. Një shënim i shkurtër dorëzimi thotë vetëm se ka nevojë për ndjekje. Kolegu i natës e sheh pikën e hapur, por jo pasigurinë pas saj: çfarë u kontrollua vërtet, cila përgjigje u dha dhe kush e zotëron hapin tjetër. Në pamje të parë çështja është një dorëzim i paplotë. Por ka edhe një pyetje që ka rëndësi. A e la kolegu i mëparshëm informacionin jashtë se shablloni e bënte të vështirë regjistrimin, se personi nuk e dinte cili detaj ishte i dobishëm, apo se një pasiguri e papërshtatshme dukej më mirë të mbetej e pathënë? Menaxheri nuk e diagnostikon dot heshtjen e qëllimshme vetëm nga një shënim i paplotë.",
              "Ein Abendteam beendet seine Schicht. Ein kleines Serviceanliegen wurde früher angesprochen; jemand hat es angesehen, doch eine andere Abteilung muss entscheiden, wie es weitergeht. Die Lage ist nicht dringend. Eine knappe Übergabenotiz sagt nur, dass es nachverfolgt werden muss. Die Nachtkollegin sieht den offenen Punkt, aber nicht die Unsicherheit dahinter: was tatsächlich geprüft, welche Antwort gegeben wurde und wer den nächsten Schritt verantwortet. Auf den ersten Blick ist das Thema eine unvollständige Übergabe. Doch eine weitere Frage zählt. Ließ die frühere Kollegin Information weg, weil die Vorlage das Erfassen erschwerte, weil sie nicht wusste, welches Detail nützlich war, oder weil eine unangenehme Unsicherheit besser ungesagt schien? Die Führungskraft kann absichtliches Schweigen nicht allein aus einer unvollständigen Notiz diagnostizieren.") },
            { type: "p", text: x(
              "The author has handled Night Audit documentation, technical room issues and shift handovers. The time, the particular case and the motives in this scene are fictional. No guest or payment data, security procedure, room identifier or internal technology is revealed.",
              "Autori ka trajtuar dokumentacionin e Night Audit-it, problemet teknike të dhomave dhe dorëzimet e turneve. Koha, rasti i veçantë dhe motivet në këtë skenë janë të sajuara. Nuk zbulohet asnjë e dhënë mysafiri apo pagese, procedurë sigurie, identifikues dhome apo teknologji e brendshme.",
              "Der Autor hat Night-Audit-Dokumentation, technische Zimmerprobleme und Schichtübergaben bearbeitet. Zeitpunkt, konkreter Fall und Motive in dieser Szene sind erfunden. Keine Gäste- oder Zahlungsdaten, kein Sicherheitsverfahren, keine Zimmerkennung und keine interne Technik werden offengelegt.") },
            { type: "callout", reading: true, text: x(
              "An unfinished task may be visible in a log while the uncertainty needed to finish it remains invisible.",
              "Një detyrë e papërfunduar mund të duket në një ditar, ndërsa pasiguria që duhet për ta përfunduar mbetet e padukshme.",
              "Eine unerledigte Aufgabe kann im Logbuch sichtbar sein, während die Unsicherheit, die man zum Erledigen braucht, unsichtbar bleibt.") },
          ],
          note: x(
            "Constructed illustration using verified categories of hospitality work. Conceptual references: Morrison (2014); Tucker and Edmondson (2003). The essay named below makes the case for the handover.",
            "Ilustrim i ndërtuar me kategori të verifikuara të punës në mikpritje. Referenca konceptuale: Morrison (2014); Tucker e Edmondson (2003). Eseja e emërtuar më poshtë e mbron dorëzimin.",
            "Konstruierte Illustration mit geprüften Kategorien der Hotelarbeit. Konzeptionelle Bezüge: Morrison (2014); Tucker und Edmondson (2003). Der unten genannte Essay plädiert für die Übergabe."),
          source: ["morrison-2014", "tucker-edmondson-2003"],
        },
        {
          id: "iv-concept", layer: "concept",
          title: [x("The handover", "Dorëzimi", "Die Übergabe"), x("has two channels", "ka dy kanale", "hat zwei Kanäle")],
          lead: x(
            "A status can move to the next shift without moving the judgement that the next worker needs.",
            "Një status mund të kalojë te turni tjetër pa kaluar gjykimin që i duhet punonjësit tjetër.",
            "Ein Status kann zur nächsten Schicht wandern, ohne dass das Urteil mitwandert, das die nächste Arbeitskraft braucht."),
          blocks: [
            { type: "p", text: x(
              "In a shift-based service, the handover carries two kinds of information. The formal channel contains fields, statuses, timestamps and assigned work. The informal channel contains context: what a person is uncertain about, why a promised action did not happen or which interpretation has not been confirmed. Both can be needed, but the informal channel is particularly vulnerable when a shift ends under time pressure. The manager's task is not to encourage uncontrolled verbal storytelling. It is to make the formal record expressive enough for uncertainty. A useful handover distinguishes observed facts, reported claims, actions already taken and the decision still required. The next shift should be able to act without reconstructing a conversation whose participants have gone home.",
              "Në një shërbim me turne, dorëzimi bart dy lloje informacioni. Kanali formal përmban fusha, statuse, vula kohe dhe punë të caktuar. Kanali joformal përmban kontekst: për çfarë është i pasigurt një person, pse një veprim i premtuar nuk ndodhi ose cili interpretim nuk është konfirmuar. Të dy mund të jenë të nevojshëm, por kanali joformal është veçanërisht i cenueshëm kur turni mbaron nën presion kohe. Detyra e menaxherit nuk është të nxisë rrëfime verbale të pakontrolluara. Është ta bëjë regjistrin formal mjaft shprehës për pasigurinë. Një dorëzim i dobishëm dallon faktet e vëzhguara, pohimet e raportuara, veprimet e bëra tashmë dhe vendimin që kërkohet ende. Turni tjetër duhet të jetë në gjendje të veprojë pa rindërtuar një bisedë pjesëmarrësit e së cilës kanë shkuar në shtëpi.",
              "In einem Schichtbetrieb trägt die Übergabe zwei Arten von Information. Der formelle Kanal enthält Felder, Status, Zeitstempel und zugewiesene Arbeit. Der informelle Kanal enthält Kontext: worüber jemand unsicher ist, warum eine versprochene Handlung ausblieb oder welche Deutung nicht bestätigt wurde. Beide können nötig sein, doch der informelle Kanal ist besonders verletzlich, wenn eine Schicht unter Zeitdruck endet. Die Aufgabe der Führung ist nicht, unkontrolliertes mündliches Erzählen zu fördern. Sie ist, die formelle Aufzeichnung ausdrucksstark genug für Unsicherheit zu machen. Eine nützliche Übergabe unterscheidet beobachtete Fakten, berichtete Behauptungen, bereits getroffene Maßnahmen und die noch nötige Entscheidung. Die nächste Schicht sollte handeln können, ohne ein Gespräch zu rekonstruieren, dessen Teilnehmer nach Hause gegangen sind.") },
            { type: "cards", cols: 3, items: [
              { h: x("Status", "Statusi", "Status"), p: x("What the system says, and when it was updated.", "Çfarë thotë sistemi, dhe kur u përditësua.", "Was das System sagt, und wann es aktualisiert wurde.") },
              { h: x("Uncertainty", "Pasiguria", "Unsicherheit"), p: x("What remains unverified or disputed.", "Çfarë mbetet e paverifikuar ose e kundërshtuar.", "Was ungeprüft oder strittig bleibt.") },
              { h: x("Next owner", "Përgjegjësi i radhës", "Nächste Verantwortliche"), p: x("Who is authorised to review, decide and respond.", "Kush është i autorizuar të shqyrtojë, të vendosë dhe të përgjigjet.", "Wer befugt ist zu prüfen, zu entscheiden und zu antworten.") },
            ] },
            { type: "p", text: x(
              "Operational silence can arise here without anyone intending to suppress information. Workers may be unsure whether an unresolved problem will be read as failure, or may lack a safe channel for disagreement about the state of a case. The remedy must distinguish communication design, training needs and interpersonal risk; none can be diagnosed from the number of notes alone.",
              "Heshtja operacionale mund të lindë këtu pa dashur askush ta shtypë informacionin. Punonjësit mund të mos jenë të sigurt nëse një problem i pazgjidhur do të lexohet si dështim, ose mund të mos kenë kanal të sigurt për mospajtim rreth gjendjes së një rasti. Ilaçi duhet të dallojë projektimin e komunikimit, nevojat për trajnim dhe rrezikun ndërpersonal; asnjëri nuk diagnostikohet dot vetëm nga numri i shënimeve.",
              "Betriebliches Schweigen kann hier entstehen, ohne dass jemand Information unterdrücken will. Beschäftigte sind vielleicht unsicher, ob ein ungelöstes Problem als Versagen gelesen wird, oder haben keinen sicheren Weg für Widerspruch zum Stand eines Falls. Die Abhilfe muss Kommunikationsdesign, Schulungsbedarf und zwischenmenschliches Risiko unterscheiden; keines lässt sich allein aus der Zahl der Notizen diagnostizieren.") },
            { type: "callout", reading: true, text: x(
              "A handover is complete only when the receiving person knows what is known and what is not.",
              "Një dorëzim është i plotë vetëm kur personi që e merr e di çfarë dihet dhe çfarë jo.",
              "Eine Übergabe ist erst vollständig, wenn die empfangende Person weiß, was bekannt ist und was nicht.") },
          ],
          note: x(
            "Editorial cross-shift application; voice concepts from Morrison (2014). Not a property-specific hotel procedure.",
            "Zbatim editorial ndërmjet turneve; konceptet e zërit nga Morrison (2014). Jo procedurë hoteli e një prone të caktuar.",
            "Redaktionelle Anwendung über Schichten hinweg; Stimmkonzepte nach Morrison (2014). Kein hausspezifisches Hotelverfahren."),
          source: ["morrison-2014"],
        },
        {
          id: "iv-evidence", layer: "concept",
          title: [x("When workarounds", "Kur zgjidhjet e përkohshme", "Wenn Umwege"), x("mask failure", "e maskojnë dështimin", "Versagen verdecken")],
          lead: x(
            "Evidence from healthcare illustrates the difference between recovering from an obstacle and learning why it recurred.",
            "Prova nga shëndetësia ilustron dallimin mes rimëkëmbjes nga një pengesë dhe të mësuarit pse u përsërit.",
            "Belege aus dem Gesundheitswesen zeigen den Unterschied zwischen der Erholung von einem Hindernis und dem Lernen, warum es wiederkehrte."),
          blocks: [
            { type: "stat", n: "9", t: x("hospitals in Tucker and Edmondson's 2003 qualitative field research on nurses' responses to process failures and the barriers to system change", "spitale në kërkimin cilësor në terren të Tucker e Edmondson, 2003, për reagimet e infermierëve ndaj dështimeve të procesit dhe pengesat për ndryshim të sistemit", "Krankenhäuser in der qualitativen Feldforschung von Tucker und Edmondson 2003 zu den Reaktionen von Pflegekräften auf Prozessfehler und den Hürden für Systemänderung") },
            { type: "p", text: x(
              "The researchers described an operational equilibrium in which frontline professionals worked around recurring process problems. Their study of nurses in nine hospitals differentiated errors from problems and examined why recovery on the day did not automatically generate organisational learning. This is a valuable analogy for information that vanishes at a handover, but it is not a study of hotel Night Audit. A second distinction comes from Liang, Farh and Farh's two-wave study of 239 employees. They separated promotive voice, which proposes improvement, from prohibitive voice, which warns about harmful practices, and found psychological safety particularly relevant to subsequent prohibitive voice. The exact relationships depend on their design and population. Together these studies pose a question worth testing: does our handover format allow staff to flag what may be wrong, as well as record what was done?",
              "Kërkuesit përshkruan një ekuilibër operacional ku profesionistët e vijës së parë i anashkalonin problemet e përsëritura të procesit. Studimi i tyre me infermierë në nëntë spitale i dalloi gabimet nga problemet dhe shqyrtoi pse rimëkëmbja e asaj dite nuk gjeneronte automatikisht të mësuar organizativ. Është analogji e vlefshme për informacionin që zhduket në një dorëzim, por nuk është studim i Night Audit-it në hotel. Një dallim i dytë vjen nga studimi me dy valë i Liang, Farh e Farh me 239 punonjës. Ata e ndanë zërin promovues, që propozon përmirësim, nga zëri ndalues, që paralajmëron për praktika të dëmshme, dhe e gjetën sigurinë psikologjike veçanërisht të rëndësishme për zërin ndalues të mëvonshëm. Marrëdhëniet e sakta varen nga projektimi dhe popullata e tyre. Bashkë, këto studime shtrojnë një pyetje që ia vlen të provohet: a e lejon formati ynë i dorëzimit stafin të sinjalizojë çfarë mund të jetë gabim, dhe jo vetëm të regjistrojë çfarë u bë?",
              "Die Forscherinnen beschrieben ein betriebliches Gleichgewicht, in dem Fachkräfte an der Front wiederkehrende Prozessprobleme umgingen. Ihre Studie mit Pflegekräften in neun Krankenhäusern unterschied Fehler von Problemen und untersuchte, warum die Erholung am selben Tag nicht automatisch organisationales Lernen erzeugte. Das ist eine wertvolle Analogie für Information, die bei einer Übergabe verschwindet, aber keine Studie über das Night Audit im Hotel. Eine zweite Unterscheidung stammt aus der Zwei-Wellen-Studie von Liang, Farh und Farh mit 239 Beschäftigten. Sie trennten fördernde Stimme, die Verbesserung vorschlägt, von verhindernder Stimme, die vor schädlichen Praktiken warnt, und fanden psychologische Sicherheit besonders bedeutsam für spätere verhindernde Stimme. Die genauen Beziehungen hängen von Design und Population ab. Zusammen stellen diese Studien eine prüfenswerte Frage: Erlaubt unser Übergabeformat dem Personal, zu melden, was falsch sein könnte, und nicht nur festzuhalten, was getan wurde?") },
            { type: "callout", reading: true, text: x(
              "Recovery gets the shift through the night. Learning asks why recovery was necessary.",
              "Rimëkëmbja e çon turnin deri në mëngjes. Të mësuarit pyet pse ishte e nevojshme rimëkëmbja.",
              "Erholung bringt die Schicht durch die Nacht. Lernen fragt, warum Erholung nötig war.") },
          ],
          note: x(
            "Tucker and Edmondson (2003); Liang, Farh and Farh (2012). The sector transfer is explicitly hypothetical.",
            "Tucker e Edmondson (2003); Liang, Farh e Farh (2012). Bartja mes sektorëve është shprehimisht hipotetike.",
            "Tucker und Edmondson (2003); Liang, Farh und Farh (2012). Die Übertragung zwischen Sektoren ist ausdrücklich hypothetisch."),
          source: ["tucker-edmondson-2003", "liang-farh-farh-2012"],
        },
        {
          id: "iv-protocol", layer: "protocol",
          title: [x("Carry the uncertainty", "Barte pasigurinë", "Die Unsicherheit"), x("across the shift", "përtej turnit", "über die Schicht tragen")],
          lead: x(
            "A handover format can preserve dissent without inviting speculation or exposing private information.",
            "Një format dorëzimi mund ta ruajë mospajtimin pa ftuar spekulime dhe pa ekspozuar informacion privat.",
            "Ein Übergabeformat kann Widerspruch bewahren, ohne Spekulation einzuladen oder private Information bloßzustellen."),
          blocks: [
            { type: "steps", items: [
              { h: x("State the observed issue", "Thuaje problemin e vëzhguar", "Das beobachtete Problem nennen"), p: x("A neutral category and the factual condition; identifiable detail stays in the approved internal system.", "Një kategori neutrale dhe gjendja faktike; detaji i identifikueshëm mbetet në sistemin e brendshëm të miratuar.", "Neutrale Kategorie und sachlicher Zustand; identifizierbare Details bleiben im internen System.") },
              { h: x("Separate reported from verified", "Ndaje të raportuarën nga e verifikuara", "Berichtetes von Geprüftem trennen"), p: x("What a colleague or customer said is not necessarily what was observed.", "Ajo që tha një koleg ose klient nuk është doemos ajo që u vëzhgua.", "Was eine Kollegin oder ein Kunde sagte, ist nicht unbedingt das, was beobachtet wurde.") },
              { h: x("Explain the remaining question", "Shpjego pyetjen që mbetet", "Die offene Frage erklären"), p: x("What has not been established, and what information would settle it.", "Çfarë nuk është vërtetuar, dhe cili informacion do ta zgjidhte.", "Was nicht festgestellt ist, und welche Information es klären würde.") },
              { h: x("Record the action actually taken", "Shëno veprimin që u bë vërtet", "Die tatsächlich getroffene Maßnahme festhalten"), p: x("Do not turn an attempted step into a completed outcome.", "Mos e kthe një hap të provuar në rezultat të përfunduar.", "Einen versuchten Schritt nicht zum abgeschlossenen Ergebnis machen.") },
              { h: x("Transfer responsibility", "Kaloje përgjegjësinë", "Verantwortung übertragen"), p: x("The authorised receiving role and the next review point.", "Roli i autorizuar që e merr dhe pika e radhës e rishikimit.", "Die befugte empfangende Rolle und der nächste Prüfzeitpunkt.") },
              { h: x("Report back where appropriate", "Raporto, ku është e përshtatshme", "Rückmelden, wo angemessen"), p: x("The person who raised the concern should learn that a decision was made, within confidentiality limits.", "Personi që e ngriti shqetësimin duhet të mësojë se u mor një vendim, brenda kufijve të konfidencialitetit.", "Wer das Anliegen vorbrachte, sollte erfahren, dass entschieden wurde, innerhalb der Vertraulichkeitsgrenzen.") },
            ] },
            { type: "p", text: x(
              "No public text should reproduce private hotel procedures, payment controls or security details. For operational use the template is reconciled with the organisation's official requirements; an anonymous example teaches the structure while the authoritative record stays in the approved system.",
              "Asnjë tekst publik nuk duhet të riprodhojë procedura private hoteli, kontrolle pagesash apo detaje sigurie. Për përdorim operacional, shablloni pajtohet me kërkesat zyrtare të organizatës; një shembull anonim e mëson strukturën, ndërsa regjistri autoritar mbetet në sistemin e miratuar.",
              "Kein öffentlicher Text sollte private Hotelverfahren, Zahlungskontrollen oder Sicherheitsdetails wiedergeben. Für den Betrieb wird die Vorlage mit den offiziellen Anforderungen abgeglichen; ein anonymes Beispiel lehrt die Struktur, während die maßgebliche Aufzeichnung im freigegebenen System bleibt.") },
            { type: "callout", reading: true, text: x(
              "The next shift deserves the truth about an open problem, including the part nobody has yet resolved.",
              "Turni tjetër e meriton të vërtetën për një problem të hapur, përfshirë pjesën që askush nuk e ka zgjidhur ende.",
              "Die nächste Schicht verdient die Wahrheit über ein offenes Problem, einschließlich des Teils, den noch niemand gelöst hat.") },
          ],
          note: x(
            "Original editorial handover protocol; no claim of certification or managerial approval at a named employer. The site's shift-handover tool follows the same structure.",
            "Protokoll origjinal editorial dorëzimi; asnjë pretendim certifikimi apo miratimi menaxherial te një punëdhënës i emërtuar. Mjeti i dorëzimit të turnit në faqe ndjek të njëjtën strukturë.",
            "Eigenes redaktionelles Übergabeprotokoll, bei keinem Arbeitgeber zertifiziert oder freigegeben; das Schichtübergabe-Werkzeug der Website folgt derselben Struktur."),
          source: ["morrison-2014", "tucker-edmondson-2003"],
        },
      ],
    },

    // Chapter V. When speaking up changes nothing
    {
      id: "ch-v", type: "chapter", numeral: "V",
      title: x("When speaking up changes nothing", "Kur të folurit nuk ndryshon asgjë", "Wenn Ansprechen nichts ändert"),
      pages: [
        {
          id: "v-scene", layer: "scene", more: "solve-it-or-escalate-it",
          title: [x("The meeting that", "Mbledhja që nuk kthen", "Die Besprechung,"), x("returns no answer", "asnjë përgjigje", "die keine Antwort zurückgibt")],
          lead: x(
            "Listening can create an expectation that a concern will travel somewhere useful.",
            "Dëgjimi mund të krijojë pritshmërinë se një shqetësim do të udhëtojë diku të dobishëm.",
            "Zuhören kann die Erwartung wecken, dass ein Anliegen irgendwohin gelangt, wo es nützt."),
          blocks: [
            { type: "flag", text: x("Constructed follow-up scene, not a reported experience", "Skenë e ndërtuar ndjekjeje, jo përvojë e raportuar", "Konstruierte Folgeszene, keine berichtete Erfahrung") },
            { type: "p", text: x(
              "A staff member raises an obstacle that recurs every week. The supervisor writes it down and thanks the worker. Days pass without an update. In the next meeting the team is asked to describe possible improvements. The same obstacle comes up, this time more cautiously. Nobody needs to be hostile for the message to become clear: speaking creates work for the employee, but its effect is impossible to see. Perhaps the manager escalated the issue and received no decision. Perhaps the problem is technically complicated. Perhaps the observation was incorrect. Silence from management gives the team no way to tell these cases apart. The organisation has created an information exchange without completing it.",
              "Një anëtar i stafit ngre një pengesë që përsëritet çdo javë. Mbikëqyrësi e shënon dhe e falënderon punonjësin. Kalojnë ditë pa asnjë përditësim. Në mbledhjen e radhës ekipit i kërkohet të përshkruajë përmirësime të mundshme. E njëjta pengesë del sërish, këtë herë më me kujdes. Askush nuk ka nevojë të jetë armiqësor që mesazhi të bëhet i qartë: të folurit krijon punë për punonjësin, por efekti i tij nuk shihet dot. Ndoshta menaxheri e eskaloi çështjen dhe nuk mori asnjë vendim. Ndoshta problemi është teknikisht i ndërlikuar. Ndoshta vëzhgimi ishte i pasaktë. Heshtja e menaxhimit nuk i jep ekipit asnjë mënyrë për t'i dalluar këto raste. Organizata ka krijuar një shkëmbim informacioni pa e përfunduar.",
              "Ein Mitglied des Personals spricht ein Hindernis an, das jede Woche wiederkehrt. Die Vorgesetzte schreibt es auf und bedankt sich. Tage vergehen ohne Rückmeldung. In der nächsten Besprechung soll das Team mögliche Verbesserungen beschreiben. Dasselbe Hindernis kommt wieder auf, diesmal vorsichtiger. Niemand muss feindselig sein, damit die Botschaft klar wird: Sprechen macht der Arbeitskraft Arbeit, doch seine Wirkung ist unsichtbar. Vielleicht hat die Führungskraft die Sache eskaliert und keine Entscheidung erhalten. Vielleicht ist das Problem technisch kompliziert. Vielleicht war die Beobachtung falsch. Das Schweigen der Führung gibt dem Team keine Möglichkeit, diese Fälle zu unterscheiden. Die Organisation hat einen Informationsaustausch begonnen, ohne ihn abzuschließen.") },
            { type: "p", text: x(
              "This is not an accusation about a real supervisor; the sequence is hypothetical. It shows why a listening practice should be judged not only by how many concerns it gathers, but by what the organisation can verify, act upon and communicate afterwards.",
              "Kjo nuk është akuzë për një mbikëqyrës të vërtetë; radha e ngjarjeve është hipotetike. Tregon pse një praktikë dëgjimi duhet gjykuar jo vetëm nga sa shqetësime mbledh, por nga ajo që organizata mund të verifikojë, të zbatojë dhe të komunikojë më pas.",
              "Das ist keine Anschuldigung gegen eine echte Vorgesetzte; der Ablauf ist hypothetisch. Er zeigt, warum eine Zuhörpraxis nicht nur daran zu messen ist, wie viele Anliegen sie sammelt, sondern daran, was die Organisation danach prüfen, umsetzen und mitteilen kann.") },
            { type: "callout", reading: true, text: x(
              "Being heard once is not the same as knowing what happened to what you said.",
              "Të dëgjohesh një herë nuk është njësoj si të dish çfarë ndodhi me atë që the.",
              "Einmal gehört zu werden ist nicht dasselbe wie zu wissen, was aus dem Gesagten wurde.") },
          ],
          note: x(
            "Constructed scenario. Conceptual sources: Morrison (2014); Tucker and Edmondson (2003). The essay named below decides whether to solve or escalate.",
            "Skenar i ndërtuar. Burime konceptuale: Morrison (2014); Tucker e Edmondson (2003). Eseja e emërtuar më poshtë vendos nëse të zgjidhet apo të eskalohet.",
            "Konstruiertes Szenario. Konzeptionelle Quellen: Morrison (2014); Tucker und Edmondson (2003). Der unten genannte Essay entscheidet, ob lösen oder eskalieren."),
          source: ["morrison-2014", "tucker-edmondson-2003"],
        },
        {
          id: "v-concept", layer: "concept",
          title: [x("Silence can follow", "Heshtja mund të vijë", "Schweigen kann"), x("a failed response", "pas një përgjigjeje të dështuar", "einer ausgebliebenen Antwort folgen")],
          lead: x(
            "The perceived futility of voice is a distinct risk from the fear of interpersonal consequences.",
            "Kotësia e perceptuar e zërit është rrezik i ndryshëm nga frika e pasojave ndërpersonale.",
            "Die wahrgenommene Zwecklosigkeit der Stimme ist ein anderes Risiko als die Angst vor zwischenmenschlichen Folgen."),
          blocks: [
            { type: "p", text: x(
              "Morrison's 2014 review of employee voice and silence synthesises work on whether employees communicate suggestions and concerns upward, the factors influencing that choice and the implications for organisations. Silence can be related to the expectation that speaking will be risky; it can also emerge when speaking seems unlikely to make a difference. These are analytically different problems. A manager may respond politely while having no mechanism to bring a cross-functional concern to a decision. Detert and Treviño's interviews showed that voice perceptions were influenced by several levels of leadership. A local supervisor may receive a concern but not control the process causing it. Without a defined route to the person who can act, even a sympathetic response may become another unfulfilled promise.",
              "Rishikimi i Morrison-it i vitit 2014 për zërin dhe heshtjen e punonjësve sintetizon punën për faktin nëse punonjësit i komunikojnë sugjerimet dhe shqetësimet lart, faktorët që ndikojnë në atë zgjedhje dhe pasojat për organizatat. Heshtja mund të lidhet me pritshmërinë se të folurit do të jetë i rrezikshëm; mund të lindë edhe kur të folurit duket se nuk do të bëjë ndryshim. Këto janë probleme analitikisht të ndryshme. Një menaxher mund të përgjigjet me mirësjellje pa pasur mekanizëm për ta çuar një shqetësim ndërfunksional në vendim. Intervistat e Detert e Treviño treguan se perceptimet e zërit ndikoheshin nga disa nivele drejtimi. Një mbikëqyrës lokal mund ta marrë një shqetësim, por të mos e kontrollojë procesin që e shkakton. Pa një rrugë të përkufizuar deri te personi që mund të veprojë, edhe një përgjigje e dashamirë mund të bëhet një tjetër premtim i papërmbushur.",
              "Morrisons Übersicht von 2014 zu Stimme und Schweigen der Beschäftigten fasst zusammen, ob Beschäftigte Vorschläge und Bedenken nach oben weitergeben, welche Faktoren diese Wahl beeinflussen und was das für Organisationen bedeutet. Schweigen kann mit der Erwartung zusammenhängen, dass Sprechen riskant ist; es kann auch entstehen, wenn Sprechen kaum etwas zu ändern scheint. Das sind analytisch verschiedene Probleme. Eine Führungskraft kann höflich antworten und dennoch keinen Mechanismus haben, ein bereichsübergreifendes Anliegen zu einer Entscheidung zu bringen. Die Interviews von Detert und Treviño zeigten, dass die Wahrnehmung von Stimme von mehreren Führungsebenen beeinflusst wurde. Eine örtliche Vorgesetzte mag ein Anliegen entgegennehmen, aber den verursachenden Prozess nicht steuern. Ohne definierten Weg zur Person, die handeln kann, wird selbst eine wohlwollende Antwort zu einem weiteren unerfüllten Versprechen.") },
            { type: "rows", compact: true, items: [
              { h: x("Captured", "E kapur", "Erfasst"), p: x("The concern exists in a recognised, appropriate channel.", "Shqetësimi ekziston në një kanal të njohur dhe të përshtatshëm.", "Das Anliegen liegt in einem anerkannten, passenden Kanal vor.") },
              { h: x("Acknowledged", "E pranuar", "Bestätigt"), p: x("Receipt is confirmed, not the truth of the claim.", "Konfirmohet marrja, jo vërtetësia e pohimit.", "Der Eingang ist bestätigt, nicht die Richtigkeit der Behauptung.") },
              { h: x("Verified", "E verifikuar", "Geprüft"), p: x("A responsible person has investigated the evidence.", "Një person përgjegjës i ka hetuar provat.", "Eine verantwortliche Person hat die Belege untersucht.") },
              { h: x("Decided", "E vendosur", "Entschieden"), p: x("An action, a reasoned refusal or an identified dependency.", "Një veprim, një refuzim i arsyetuar ose një varësi e identifikuar.", "Eine Maßnahme, eine begründete Ablehnung oder eine benannte Abhängigkeit.") },
              { h: x("Told back", "E kthyer si përgjigje", "Zurückgemeldet"), p: x("The reporting worker or team has received an appropriate explanation.", "Punonjësi ose ekipi që raportoi ka marrë një shpjegim të përshtatshëm.", "Die meldende Person oder das Team hat eine angemessene Erklärung erhalten.") },
            ] },
            { type: "callout", reading: true, text: x(
              "Feedback is not a courtesy at the end of listening. It completes the information process the report started.",
              "Përgjigjja nuk është mirësjellje në fund të dëgjimit. Ajo e përfundon procesin e informacionit që e nisi raporti.",
              "Rückmeldung ist keine Höflichkeit am Ende des Zuhörens. Sie vollendet den Informationsprozess, den die Meldung begann.") },
          ],
          note: x(
            "Morrison (2014); Detert and Treviño (2010). The five-status model is editorial; an honest no-action decision made visible can be better than a promise that authority or evidence cannot support.",
            "Morrison (2014); Detert e Treviño (2010). Modeli me pesë statuse është editorial; një vendim i ndershëm për mosveprim, i bërë i dukshëm, mund të jetë më i mirë se një premtim që autoriteti apo prova nuk e mbështesin.",
            "Morrison (2014); Detert und Treviño (2010). Das Fünf-Status-Modell ist redaktionell; eine ehrliche, sichtbar gemachte Entscheidung gegen Handeln kann besser sein als ein Versprechen, das Autorität oder Belege nicht tragen."),
          source: ["morrison-2014", "detert-trevino-2010"],
        },
        {
          id: "v-model", layer: "concept",
          title: [x("The funnel of", "Hinka e", "Der Trichter"), x("unanswered concerns", "shqetësimeve pa përgjigje", "unbeantworteter Anliegen")],
          lead: x(
            "A fully synthetic illustration of why the count of reports is not the count of resolved problems: one cohort of twelve findings.",
            "Një ilustrim sintetik se pse numri i raporteve nuk është numri i problemeve të zgjidhura: një grup prej dymbëdhjetë gjetjesh.",
            "Eine synthetische Illustration, warum die Zahl der Meldungen nicht die Zahl der gelösten Probleme ist: eine Kohorte von zwölf Befunden."),
          blocks: [
            { type: "flag", text: synthetic },
            { type: "hbars", max: 12, hypothetical: true,
              label: x("Illustrative counts, one cohort of 12 findings", "Numra ilustrues, një grup prej 12 gjetjesh", "Illustrative Zahlen, eine Kohorte von 12 Befunden"),
              items: [
                { k: x("Raised", "Të ngritura", "Vorgebracht"), v: 12, n: "12" },
                { k: x("Acknowledged", "Të pranuara", "Bestätigt"), v: 9, n: "9" },
                { k: x("Assigned", "Të caktuara", "Zugewiesen"), v: 7, n: "7" },
                { k: x("Action started", "Veprim i nisur", "Begonnen"), v: 5, n: "5" },
                { k: x("Told back", "Me përgjigje", "Zurückgemeldet"), v: 3, n: "3", alert: true },
                { k: x("Verified closed", "Të mbyllura", "Geschlossen"), v: 2, n: "2" },
              ] },
            { type: "p", text: x(
              "Twelve concerns produce only three returns of information, while the record claims activity because seven issues have an owner. Ownership is not action, action is not closure and closure is not communication to the people who spoke. Nor are the other nine proven unfair: some may be confidential or still under review. Never make a low complaint count a performance goal; it rewards discouraged reporting. More concerns may mean safer disclosure, a worse process or better detection; the count alone cannot tell.",
              "Dymbëdhjetë shqetësime prodhojnë vetëm tri kthime informacioni, ndërsa regjistri pretendon aktivitet, sepse shtatë çështje kanë përgjegjës. Pronësia nuk është veprim, veprimi nuk është mbyllje dhe mbyllja nuk është komunikim me ata që folën. As nëntë të tjerat nuk provohen të padrejta: disa mund të jenë konfidenciale ose ende në shqyrtim. Mos e bëj kurrë numrin e ulët të ankesave objektiv performance; shpërblen raportimin e shkurajuar. Më shumë shqetësime mund të thonë zbulim më të sigurt, proces më të keq ose zbulim më të mirë; vetëm numri nuk e dallon dot.",
              "Zwölf Anliegen erzeugen nur drei Rückmeldungen, während die Aufzeichnung Aktivität behauptet, weil sieben Themen einen Verantwortlichen haben. Zuständigkeit ist keine Handlung, Handlung kein Abschluss, Abschluss keine Mitteilung an die Meldenden; die anderen neun sind deshalb nicht unfair behandelt, manche sind vertraulich oder in Prüfung. Eine niedrige Beschwerdezahl darf nie Leistungsziel sein; das belohnt entmutigtes Melden. Mehr Anliegen können sicherere Offenheit, einen schlechteren Prozess oder bessere Erkennung bedeuten; die Zahl allein sagt es nicht.") },
            { type: "callout", reading: true, text: x(
              "Measure the route from report to decision, while refusing to reward silence.",
              "Mat rrugën nga raporti te vendimi, duke refuzuar ta shpërblesh heshtjen.",
              "Messen Sie den Weg von der Meldung zur Entscheidung, und weigern Sie sich, Schweigen zu belohnen.") },
          ],
          note: x(
            "All counts and bar proportions are fabricated for demonstration, as in the author's PDF; no local response rate is estimated. Statuses after the five-status model on the previous page.",
            "Numrat dhe shtyllat janë të sajuara për demonstrim, si te PDF-ja e autorit; nuk vlerësohet asnjë normë lokale përgjigjeje. Statuset sipas faqes së mëparshme.",
            "Zahlen und Balken erfunden, wie im PDF des Autors; keine örtliche Antwortquote geschätzt. Status nach der vorigen Seite."),
          source: ["morrison-2014"],
        },
        {
          id: "v-protocol", layer: "protocol",
          title: [x("Return with a decision,", "Kthehu me një vendim,", "Mit einer Entscheidung zurückkommen,"), x("not a slogan", "jo me një slogan", "nicht mit einer Parole")],
          lead: x(
            "A proportionate feedback practice protects privacy and avoids promising what the organisation cannot deliver.",
            "Një praktikë e përpjesëtuar përgjigjeje e mbron privatësinë dhe shmang premtimin e asaj që organizata nuk e jep dot.",
            "Eine verhältnismäßige Rückmeldepraxis schützt Vertraulichkeit und vermeidet Versprechen, die die Organisation nicht halten kann."),
          blocks: [
            { type: "steps", items: [
              { h: x("Confirm receipt through the right channel", "Konfirmo marrjen përmes kanalit të duhur", "Den Eingang über den richtigen Kanal bestätigen"), p: x("Acknowledge without prejudging truth or liability.", "Pranoje pa paragjykuar vërtetësinë apo përgjegjësinë.", "Bestätigen, ohne Wahrheit oder Haftung vorwegzunehmen.") },
              { h: x("Triage by risk and authority", "Klasifiko sipas rrezikut dhe autoritetit", "Nach Risiko und Zuständigkeit sortieren"), p: x("Safety and protected reporting follow formal channels, not the improvement queue.", "Siguria dhe raportimi i mbrojtur ndjekin kanale formale, jo radhën e përmirësimit.", "Sicherheit und geschütztes Melden folgen formellen Kanälen, nicht der Verbesserungsliste.") },
              { h: x("Verify facts and scope", "Verifiko faktet dhe fushën", "Fakten und Umfang prüfen"), p: x("Hear the sending and the receiving side of the process, where appropriate.", "Dëgjo palën që dërgon dhe palën që merr, ku është e përshtatshme.", "Sendende und empfangende Seite anhören, wo angemessen.") },
              { h: x("Name the next owner", "Emërto përgjegjësin e radhës", "Die nächste Verantwortliche benennen"), p: x("Specific enough that a concern cannot vanish between departments.", "Mjaft e saktë që një shqetësim të mos zhduket mes departamenteve.", "So konkret, dass ein Anliegen nicht zwischen Abteilungen verschwindet.") },
              { h: x("State the decision and the uncertainty", "Thuaj vendimin dhe pasigurinë", "Entscheidung und Unsicherheit nennen"), p: x("Solved, testing, awaiting authority, insufficient evidence or declined, with reasons.", "E zgjidhur, në provë, në pritje të autoritetit, pa prova të mjaftueshme ose e refuzuar, me arsye.", "Gelöst, im Test, wartet auf Zuständigkeit, zu wenig Belege oder abgelehnt, mit Gründen.") },
              { h: x("Tell back at the right level", "Kthe përgjigje në nivelin e duhur", "Auf der richtigen Ebene zurückmelden"), p: x("What is allowed, when the next update comes, how more information can be added.", "Çfarë lejohet, kur vjen përditësimi i radhës, si shtohet informacion tjetër.", "Was erlaubt ist, wann die nächste Rückmeldung kommt, wie Information ergänzt wird.") },
            ] },
            { type: "p", text: x(
              "A review rhythm is an operating experiment, not a scientific standard: urgent matters cannot wait for the meeting, complex ones may take longer than one cycle. The minimum obligation is a truthful, timely update through an authorised route. If more concerns arrive, ask whether trust, exposure or the underlying failures changed before claiming success or deterioration.",
              "Një ritëm rishikimi është eksperiment operativ, jo standard shkencor: çështjet urgjente nuk presin dot mbledhjen, të ndërlikuarat mund të zgjasin më shumë se një cikël. Detyrimi minimal është një përditësim i vërtetë dhe në kohë përmes një rruge të autorizuar. Nëse vijnë më shumë shqetësime, pyet nëse ndryshoi besimi, ekspozimi apo dështimet në themel, para se të pretendosh sukses ose keqësim.",
              "Ein Prüfrhythmus ist ein Betriebsexperiment, kein Standard: Dringendes wartet nicht auf die Besprechung, Komplexes dauert vielleicht länger als einen Zyklus. Die Mindestpflicht ist eine wahre, rechtzeitige Rückmeldung über einen autorisierten Weg. Kommen mehr Anliegen, fragen Sie, ob sich Vertrauen, Sichtbarkeit oder die Fehler dahinter änderten, bevor Sie Erfolg oder Verschlechterung behaupten.") },
            { type: "callout", reading: true, text: x(
              "A concern is not closed by assigning a number. The information loop ends when the outcome is understood.",
              "Një shqetësim nuk mbyllet duke i caktuar një numër. Cikli i informacionit mbaron kur rezultati kuptohet.",
              "Ein Anliegen wird nicht durch eine Nummer geschlossen. Die Informationsschleife endet, wenn das Ergebnis verstanden ist.") },
          ],
          note: x(
            "Original operating proposal synthesising Morrison (2014) and Detert and Treviño (2010); not formally validated.",
            "Propozim operativ origjinal që sintetizon Morrison (2014) dhe Detert e Treviño (2010); i pavërtetuar formalisht.",
            "Eigener Betriebsvorschlag nach Morrison (2014) und Detert und Treviño (2010); nicht förmlich validiert."),
          source: ["morrison-2014", "detert-trevino-2010"],
        },
      ],
    },

    // Chapter VI. Building a culture that hears
    {
      id: "ch-vi", type: "chapter", numeral: "VI",
      title: x("Building a culture that hears", "Ndërtimi i një kulture që dëgjon", "Eine Kultur bauen, die hört"),
      pages: [
        {
          id: "vi-scene", layer: "scene", more: "the-operations-manager-i-want-to-be",
          title: [x("The useful", "Pyetja e dobishme", "Die nützliche"), x("uncomfortable question", "e papërshtatshme", "unbequeme Frage")],
          lead: x(
            "A leadership team can decide differently by hearing a warning before a defect becomes a headline.",
            "Një ekip drejtues mund të vendosë ndryshe duke e dëgjuar një paralajmërim para se një defekt të bëhet titull.",
            "Ein Führungsteam kann anders entscheiden, wenn es eine Warnung hört, bevor ein Mangel zur Schlagzeile wird."),
          blocks: [
            { type: "flag", text: x("Hypothetical leadership scene, not a documented achievement", "Skenë hipotetike drejtimi, jo arritje e dokumentuar", "Hypothetische Führungsszene, keine dokumentierte Leistung") },
            { type: "p", text: x(
              "A process change is being reviewed. The dashboard looks encouraging. The manager asks whether anyone has seen a condition that would make the reported result unreliable. A junior colleague says that one category of requests is being completed differently from the others. The manager asks for the observation, not a verdict. Someone checks the definition and agrees to compare a small sample. The review closes with an owner and a follow-up date, not a promise that the new process is already wrong. The warning may prove correct, partly correct or mistaken. All three outcomes support learning when the evidence is examined fairly. A speaking-up culture does not treat every objection as fact. It lets important doubts enter a responsible decision system before hierarchy or fear filters them out.",
              "Po shqyrtohet një ndryshim procesi. Paneli duket inkurajues. Menaxheri pyet nëse dikush ka parë një kusht që do ta bënte rezultatin e raportuar të pabesueshëm. Një koleg i ri thotë se një kategori kërkesash po përfundohet ndryshe nga të tjerat. Menaxheri kërkon vëzhgimin, jo një verdikt. Dikush e kontrollon përkufizimin dhe pranon të krahasojë një mostër të vogël. Rishikimi mbyllet me një përgjegjës dhe një datë ndjekjeje, jo me premtimin se procesi i ri është tashmë i gabuar. Paralajmërimi mund të dalë i saktë, pjesërisht i saktë ose i gabuar. Të tria rezultatet e mbështesin të mësuarit kur prova shqyrtohet me drejtësi. Një kulturë e të folurit nuk e trajton çdo kundërshtim si fakt. I lejon dyshimet e rëndësishme të hyjnë në një sistem vendimi të përgjegjshëm para se hierarkia apo frika t'i filtrojnë.",
              "Eine Prozessänderung wird überprüft. Das Dashboard sieht ermutigend aus. Die Führungskraft fragt, ob jemand eine Bedingung gesehen hat, die das berichtete Ergebnis unzuverlässig machen würde. Eine junge Kollegin sagt, eine Kategorie von Anfragen werde anders abgeschlossen als die übrigen. Die Führungskraft bittet um die Beobachtung, nicht um ein Urteil. Jemand prüft die Definition und sagt zu, eine kleine Stichprobe zu vergleichen. Die Überprüfung endet mit einer Verantwortlichen und einem Folgetermin, nicht mit dem Versprechen, der neue Prozess sei schon falsch. Die Warnung kann sich als richtig, teilweise richtig oder falsch erweisen. Alle drei Ausgänge stützen Lernen, wenn die Belege fair geprüft werden. Eine Kultur des Ansprechens behandelt nicht jeden Einwand als Tatsache. Sie lässt wichtige Zweifel in ein verantwortliches Entscheidungssystem gelangen, bevor Hierarchie oder Angst sie herausfiltern.") },
            { type: "p", text: x(
              "This is a constructed scene, not a claim that the author delivered a programme that improved speaking-up rates. The operations background shows where information matters; the voice mechanism described here remains a proposal to test.",
              "Kjo është skenë e ndërtuar, jo pretendim se autori zbatoi një program që i përmirësoi normat e të folurit. Sfondi operacional tregon ku ka rëndësi informacioni; mekanizmi i zërit i përshkruar këtu mbetet propozim për t'u provuar.",
              "Das ist eine konstruierte Szene, keine Behauptung, der Autor habe ein Programm umgesetzt, das Ansprechraten verbesserte. Der betriebliche Hintergrund zeigt, wo Information zählt; der hier beschriebene Stimmmechanismus bleibt ein zu prüfender Vorschlag.") },
            { type: "callout", reading: true, text: x(
              "The outcome of speaking is not automatic agreement. It is a fair and traceable decision.",
              "Rezultati i të folurit nuk është pajtim automatik. Është një vendim i drejtë dhe i gjurmueshëm.",
              "Das Ergebnis des Sprechens ist keine automatische Zustimmung. Es ist eine faire, nachvollziehbare Entscheidung.") },
          ],
          note: x(
            "Editorial scene informed by Edmondson (1999), Detert and Burris (2007) and Morrison (2014). The essay named below describes the manager this volume argues for.",
            "Skenë editoriale e mbështetur te Edmondson (1999), Detert e Burris (2007) dhe Morrison (2014). Eseja e emërtuar më poshtë e përshkruan menaxherin për të cilin argumenton ky vëllim.",
            "Redaktionelle Szene nach Edmondson (1999), Detert und Burris (2007) und Morrison (2014). Der unten genannte Essay beschreibt die Führungskraft, für die dieser Band wirbt."),
          source: ["edmondson-1999", "detert-burris-2007", "morrison-2014"],
        },
        {
          id: "vi-concept", layer: "concept",
          title: [x("Five steps", "Pesë hapa", "Fünf Schritte"), x("from voice to action", "nga zëri te veprimi", "von der Stimme zur Handlung")],
          lead: x(
            "An operating system for concerns must include the opportunity to speak and the obligation to respond.",
            "Një sistem operativ për shqetësimet duhet të përfshijë mundësinë për të folur dhe detyrimin për t'u përgjigjur.",
            "Ein Betriebssystem für Anliegen muss die Gelegenheit zu sprechen und die Pflicht zu antworten enthalten."),
          blocks: [
            { type: "rows", compact: true, items: [
              { h: x("Invite", "Fto", "Einladen"), p: x("A realistic route to raise process defects, improvement ideas and uncomfortable warnings.", "Një rrugë realiste për të ngritur defekte procesi, ide përmirësimi dhe paralajmërime të papërshtatshme.", "Ein realistischer Weg, Prozessmängel, Verbesserungsideen und unbequeme Warnungen vorzubringen.") },
              { h: x("Protect", "Mbro", "Schützen"), p: x("Good-faith reporting is not a personal accusation; formal escalation and confidentiality are safeguarded.", "Raportimi në mirëbesim nuk është akuzë personale; eskalimi formal dhe konfidencialiteti mbrohen.", "Melden in gutem Glauben ist keine persönliche Anschuldigung; formelle Eskalation und Vertraulichkeit sind gesichert.") },
              { h: x("Verify", "Verifiko", "Prüfen"), p: x("Distinguish the report from what has been independently observed; seek competing explanations.", "Dalloje raportin nga ajo që është vëzhguar në mënyrë të pavarur; kërko shpjegime konkurruese.", "Die Meldung von unabhängig Beobachtetem trennen; konkurrierende Erklärungen suchen.") },
              { h: x("Decide", "Vendos", "Entscheiden"), p: x("What is within local authority, what needs cross-team approval and what cannot be adopted.", "Çfarë është brenda autoritetit lokal, çfarë kërkon miratim ndërmjet ekipeve dhe çfarë nuk mund të pranohet.", "Was in örtlicher Zuständigkeit liegt, was teamübergreifende Freigabe braucht und was nicht übernommen werden kann.") },
              { h: x("Return", "Kthe", "Zurückmelden"), p: x("An authorised response, including what remains open and when it will be reviewed.", "Një përgjigje e autorizuar, përfshirë çfarë mbetet e hapur dhe kur do të rishikohet.", "Eine autorisierte Antwort, einschließlich dessen, was offen bleibt und wann es geprüft wird.") },
            ] },
            { type: "p", text: x(
              "These steps are a synthesis, not an intervention trial. Frazier and colleagues' 2017 meta-analysis aggregated 136 independent samples involving over 22,000 individuals and nearly 5,000 groups. That breadth supports taking psychological safety seriously as an organisational construct. It does not validate this five-step procedure or guarantee that it changes performance in a particular hotel or logistics operation. The goal is observable management behaviour. Publicity is not protection: a suggestion channel must not publish worker identities, guest information, operational credentials or details of a protected complaint. Real organisations adapt the framework to labour rules, safeguarding requirements and authorised workflows.",
              "Këta hapa janë sintezë, jo provë ndërhyrjeje. Meta-analiza e Frazier-it dhe kolegëve e vitit 2017 agregoi 136 mostra të pavarura me mbi 22.000 individë dhe afro 5.000 grupe. Kjo gjerësi e mbështet marrjen seriozisht të sigurisë psikologjike si konstrukt organizativ. Nuk e vërteton këtë procedurë me pesë hapa dhe nuk garanton se ajo e ndryshon performancën në një hotel apo operacion logjistik të caktuar. Qëllimi është sjellje e vëzhgueshme menaxhimi. Publiciteti nuk është mbrojtje: një kanal sugjerimesh nuk duhet të publikojë identitete punonjësish, informacion mysafirësh, kredenciale operacionale apo detaje të një ankese të mbrojtur. Organizatat e vërteta e përshtatin kuadrin me rregullat e punës, kërkesat e mbrojtjes dhe rrjedhat e autorizuara të punës.",
              "Diese Schritte sind eine Synthese, keine Interventionsstudie. Die Metaanalyse von Frazier und Kollegen aus 2017 fasste 136 unabhängige Stichproben mit über 22.000 Personen und fast 5.000 Gruppen zusammen. Diese Breite stützt es, psychologische Sicherheit als organisationales Konstrukt ernst zu nehmen. Sie validiert dieses Fünf-Schritte-Verfahren nicht und garantiert nicht, dass es die Leistung in einem bestimmten Hotel oder Logistikbetrieb verändert. Das Ziel ist beobachtbares Führungsverhalten. Öffentlichkeit ist kein Schutz: Ein Vorschlagskanal darf keine Identitäten von Beschäftigten, Gästeinformationen, betriebliche Zugangsdaten oder Details einer geschützten Beschwerde veröffentlichen. Echte Organisationen passen den Rahmen an Arbeitsrecht, Schutzanforderungen und freigegebene Abläufe an.") },
            { type: "callout", reading: true, text: x(
              "A culture that hears is one where an important message can reach someone who can decide responsibly.",
              "Një kulturë që dëgjon është ajo ku një mesazh i rëndësishëm mund të arrijë te dikush që mund të vendosë me përgjegjësi.",
              "Eine Kultur, die hört, ist eine, in der eine wichtige Botschaft jemanden erreichen kann, der verantwortlich entscheiden kann.") },
          ],
          note: x(
            "Frazier et al. (2017) sample totals; the five-stage framework is editorial, developed from the cited voice literature.",
            "Totalet e mostrave të Frazier et al. (2017); kuadri me pesë faza është editorial, i zhvilluar nga literatura e cituar e zërit.",
            "Stichprobensummen nach Frazier et al. (2017); der fünfstufige Rahmen ist redaktionell, entwickelt aus der zitierten Stimmliteratur."),
          source: ["frazier-2017"],
        },
        {
          id: "vi-protocol", layer: "protocol",
          title: [x("A short trial", "Një provë e shkurtër", "Ein kurzer Versuch"), x("of real listening", "dëgjimi të vërtetë", "echten Zuhörens")],
          lead: x(
            "Test whether an improvement process can receive, verify and respond to concerns without tracking personal identities in public.",
            "Provo nëse një proces përmirësimi mund t'i marrë, verifikojë dhe t'u përgjigjet shqetësimeve pa ndjekur identitete personale publikisht.",
            "Prüfen Sie, ob ein Verbesserungsprozess Anliegen empfangen, prüfen und beantworten kann, ohne persönliche Identitäten öffentlich zu verfolgen."),
          blocks: [
            { type: "steps", items: [
              { h: x("Select one bounded workflow", "Zgjidh një rrjedhë pune të kufizuar", "Einen abgegrenzten Ablauf wählen"), p: x("Its owner and authorised reporting channel are known.", "Përgjegjësi dhe kanali i autorizuar i raportimit njihen.", "Verantwortliche und autorisierter Meldeweg sind bekannt.") },
              { h: x("Set definitions before collecting", "Vendos përkufizimet para se të mbledhësh", "Definitionen vor dem Sammeln festlegen"), p: x("Improvement idea, risk warning, complaint and routine clarification differ.", "Ide përmirësimi, paralajmërim rreziku, ankesë dhe sqarim rutinë ndryshojnë.", "Verbesserungsidee, Risikowarnung, Beschwerde und Klärung sind verschieden.") },
              { h: x("Ask consistently", "Pyet vazhdimisht", "Beständig fragen"), p: x("One question about recurring obstacles, one about consequences.", "Një pyetje për pengesat e përsëritura, një për pasojat.", "Eine Frage zu wiederkehrenden Hindernissen, eine zu Folgen.") },
              { h: x("Record safely", "Regjistro në mënyrë të sigurt", "Sicher erfassen"), p: x("Approved systems; publish only anonymous categories and aggregate status.", "Sisteme të miratuara; publiko vetëm kategori anonime dhe status të përmbledhur.", "Freigegebene Systeme; nur anonyme Kategorien und Gesamtstand veröffentlichen.") },
              { h: x("Resolve or explain", "Zgjidh ose shpjego", "Lösen oder erklären"), p: x("Check facts, name a decision-maker, return a status even when nothing changes.", "Kontrollo faktet, cakto vendimmarrësin, kthe një status edhe kur asgjë nuk ndryshon.", "Fakten prüfen, Entscheider benennen, Status zurückgeben, auch wenn sich nichts ändert.") },
              { h: x("Review the effects", "Rishiko efektet", "Die Wirkungen prüfen"), p: x("Watch recurrence and side effects; fewer reports is never the success target.", "Vëzhgo përsëritjen dhe efektet anësore; më pak raporte nuk është kurrë objektivi i suksesit.", "Wiederkehr und Nebenwirkungen beobachten; weniger Meldungen sind nie das Erfolgsziel.") },
            ] },
            { type: "p", text: x(
              "Review the channel after two weeks and the process after a month: local choices, not evidence-based deadlines, with serious risks treated at once under existing rules. If staff do not use the channel, do not conclude the system is healthy; examine access, trust, language, confidentiality and whether earlier submissions got real answers.",
              "Rishikoje kanalin pas dy javësh dhe procesin pas një muaji: zgjedhje lokale, jo afate të mbështetura në prova, me rreziqet serioze të trajtuara menjëherë sipas rregullave ekzistuese. Nëse stafi nuk e përdor kanalin, mos nxirr se sistemi është i shëndetshëm; shqyrto qasjen, besimin, gjuhën, konfidencialitetin dhe nëse paraqitjet e mëparshme morën përgjigje të vërteta.",
              "Den Kanal nach zwei Wochen, den Prozess nach einem Monat prüfen: örtliche Entscheidungen, keine belegten Fristen, ernste Risiken sofort nach bestehenden Regeln behandelt. Nutzt das Personal den Kanal nicht, gilt das System nicht als gesund; prüfen Sie Zugang, Vertrauen, Sprache, Vertraulichkeit und ob frühere Eingaben echte Antworten erhielten.") },
            { type: "callout", reading: true, text: x(
              "The measure of leadership is not how often a manager says “speak freely”, but what happens after someone does.",
              "Masa e drejtimit nuk është sa shpesh thotë një menaxher “flisni lirisht”, por çfarë ndodh pasi dikush e bën.",
              "Das Maß der Führung ist nicht, wie oft eine Führungskraft „sprecht frei“ sagt, sondern was geschieht, nachdem es jemand tut.") },
          ],
          note: x(
            "Proposed operating experiment after the cited voice literature; no guaranteed effectiveness or implied prior implementation.",
            "Eksperiment operativ i propozuar sipas literaturës së cituar të zërit; pa efektshmëri të garantuar dhe pa zbatim të mëparshëm të nënkuptuar.",
            "Vorgeschlagenes Betriebsexperiment nach der zitierten Stimmliteratur; keine garantierte Wirksamkeit und keine angedeutete frühere Umsetzung."),
          source: ["edmondson-1999", "morrison-2014", "frazier-2017"],
        },
      ],
    },

    {
      id: "tool", tool: "/tools/shift-handover/",
      kicker: x("Field tool", "Mjeti i terrenit", "Werkzeug vor Ort"),
      title: [x("The Speak-Up", "Karta e sinjalit", "Die Signalkarte"), x("Signal Card", "për të folur", "fürs Ansprechen")],
      lead: x(
        "One issue, one safe pathway, one decision and one return message. Keep confidential case detail in the authorised system.",
        "Një çështje, një rrugë e sigurt, një vendim dhe një mesazh kthimi. Mbaji detajet konfidenciale të rastit në sistemin e autorizuar.",
        "Ein Thema, ein sicherer Weg, eine Entscheidung und eine Rückmeldung. Vertrauliche Falldetails bleiben im autorisierten System."),
      blocks: [
        { type: "form", items: [
          { h: x("The process", "Procesi", "Der Prozess"), hint: x("which one process or handover does the concern refer to?", "cilit proces apo dorëzimi i referohet shqetësimi?", "auf welchen Prozess oder welche Übergabe bezieht sich das Anliegen?") },
          { h: x("Observed or reported", "E vëzhguar apo e raportuar", "Beobachtet oder berichtet"), hint: x("what is known first-hand, and what is only an account or an interpretation?", "çfarë dihet nga dora e parë, dhe çfarë është vetëm rrëfim ose interpretim?", "was ist aus erster Hand bekannt, und was ist nur Schilderung oder Deutung?") },
          { h: x("The cost of speaking", "Kostoja e të folurit", "Die Kosten des Sprechens"), hint: x("does the person have a usable, appropriately protected reporting route?", "a ka personi një rrugë raportimi të përdorshme dhe të mbrojtur siç duhet?", "hat die Person einen nutzbaren, angemessen geschützten Meldeweg?") },
          { h: x("The right response", "Përgjigjja e duhur", "Die richtige Antwort"), hint: x("which risk category and authorised owner should review the issue?", "cila kategori rreziku dhe cili përgjegjës i autorizuar duhet ta shqyrtojë çështjen?", "welche Risikokategorie und welche befugte Verantwortliche soll das Thema prüfen?") },
          { h: x("The decision", "Vendimi", "Die Entscheidung"), hint: x("what was verified, decided, deferred or declined, and on what basis?", "çfarë u verifikua, u vendos, u shty ose u refuzua, dhe mbi çfarë baze?", "was wurde geprüft, entschieden, vertagt oder abgelehnt, und auf welcher Grundlage?") },
          { h: x("Told back", "E kthyer si përgjigje", "Zurückgemeldet"), hint: x("who can receive which update, through what approved channel, and by when?", "kush mund të marrë cilin përditësim, përmes cilit kanal të miratuar, dhe deri kur?", "wer kann welche Rückmeldung erhalten, über welchen freigegebenen Kanal, und bis wann?") },
        ] },
      ],
      note: x(
        "An editorial checklist, not a validated psychological-safety survey, a whistleblowing mechanism or a replacement for formal safety and HR procedures. Do not record identifiable people or confidential hotel, guest, payment or logistics data on the public copy.",
        "Listë kontrolli editoriale, jo anketë e vërtetuar e sigurisë psikologjike, mekanizëm sinjalizimi apo zëvendësim i procedurave formale të sigurisë dhe të burimeve njerëzore. Mos regjistro persona të identifikueshëm apo të dhëna konfidenciale hoteli, mysafirësh, pagesash apo logjistike në kopjen publike.",
        "Eine redaktionelle Checkliste, keine validierte Umfrage zur psychologischen Sicherheit, kein Hinweisgebermechanismus und kein Ersatz für formelle Sicherheits- und Personalverfahren. Keine identifizierbaren Personen oder vertraulichen Hotel-, Gäste-, Zahlungs- oder Logistikdaten auf der öffentlichen Kopie erfassen."),
      source: ["edmondson-1999", "morrison-2014", "detert-burris-2007"],
    },
    {
      id: "closing",
      kicker: x("Closing essay", "Eseja e mbylljes", "Schlussessay"),
      title: [x("What the quiet room", "Çfarë nuk të thotë dot", "Was der stille Raum"), x("cannot tell you", "dhoma e qetë", "nicht sagen kann")],
      lead: x(
        "The absence of disagreement can mean alignment. It can also mean that the information the manager needs has nowhere safe to go.",
        "Mungesa e mospajtimit mund të thotë përputhje. Mund të thotë edhe se informacioni që i duhet menaxherit nuk ka asnjë vend të sigurt ku të shkojë.",
        "Das Fehlen von Widerspruch kann Übereinstimmung bedeuten. Es kann auch bedeuten, dass die Information, die die Führung braucht, keinen sicheren Ort hat."),
      blocks: [
        { type: "p", text: x(
          "An operations manager wants the day to be predictable. Vehicles should depart with complete loads. Customers should receive what was promised. An arriving shift should understand what the previous shift could not finish. Reports should contain reliable facts. These are legitimate expectations. But none of them can be met sustainably if staff have to choose between keeping the manager comfortable and making the process visible. In loading operations, a small workaround can look like competence and conceal recurrent waste. In a hotel, an unresolved issue may carry a status without the context needed for a fair next decision. In a wholesale relationship, the people closest to fulfilment may know that a promise needs clarification long before a sales target reveals any problem. Different sectors, one shared danger: the organisation mistakes the information that reaches the system for all the information that exists.",
          "Një menaxher operacionesh dëshiron që dita të jetë e parashikueshme. Automjetet duhet të nisen me ngarkesa të plota. Klientët duhet të marrin atë që u premtua. Turni që vjen duhet ta kuptojë çfarë nuk mundi të përfundonte turni i mëparshëm. Raportet duhet të përmbajnë fakte të besueshme. Këto janë pritshmëri legjitime. Por asnjëra nuk plotësohet dot në mënyrë të qëndrueshme nëse stafi duhet të zgjedhë mes mbajtjes së menaxherit rehat dhe bërjes së procesit të dukshëm. Në operacionet e ngarkimit, një zgjidhje e vogël e përkohshme mund të duket kompetencë dhe të fshehë shpërdorim të përsëritur. Në një hotel, një çështje e pazgjidhur mund të mbajë një status pa kontekstin që duhet për një vendim të drejtë të radhës. Në një marrëdhënie me shumicë, njerëzit më afër përmbushjes mund ta dinë se një premtim ka nevojë për sqarim shumë para se një objektiv shitjesh të zbulojë ndonjë problem. Sektorë të ndryshëm, një rrezik i përbashkët: organizata e ngatërron informacionin që arrin te sistemi me gjithë informacionin që ekziston.",
          "Eine Betriebsleiterin will, dass der Tag vorhersehbar ist. Fahrzeuge sollen mit vollständiger Ladung abfahren. Kunden sollen erhalten, was versprochen wurde. Eine ankommende Schicht soll verstehen, was die vorige nicht beenden konnte. Berichte sollen verlässliche Fakten enthalten. Das sind berechtigte Erwartungen. Doch keine davon lässt sich dauerhaft erfüllen, wenn das Personal wählen muss zwischen dem Komfort der Führung und der Sichtbarkeit des Prozesses. Beim Beladen kann ein kleiner Umweg wie Kompetenz aussehen und wiederkehrende Verschwendung verbergen. Im Hotel kann ein ungelöstes Thema einen Status tragen, ohne den Kontext für eine faire nächste Entscheidung. In einer Großhandelsbeziehung wissen die der Erfüllung Nächsten vielleicht, dass ein Versprechen Klärung braucht, lange bevor ein Verkaufsziel ein Problem zeigt. Verschiedene Sektoren, eine gemeinsame Gefahr: Die Organisation hält die Information, die das System erreicht, für alle Information, die es gibt.") },
        { type: "p", text: x(
          "The literature does not invite a sentimental answer. Psychological safety is not the abolition of standards. Evidence must still be checked. Employees can be mistaken; managers sometimes have to disagree; protected concerns must use the appropriate channels. The research instead sets a practical challenge: make it possible for people to bring relevant concerns forward, then treat those concerns as inputs to an honest decision. That decision may be a correction, a refusal with reasons, an escalation or a question that remains open. No amount of listening theatre can substitute for the difficult second half of the work. A note must find an owner. An uncertainty must find a way to be verified. A response must return to those who need it, without violating privacy. A manager need not promise to solve every problem today. A manager can promise not to confuse a conversation with a completed improvement. The quietest team is not necessarily the strongest. Sometimes silence is what a team has learned to offer when it doubts that the truth will be useful.",
          "Literatura nuk fton për një përgjigje sentimentale. Siguria psikologjike nuk është heqja e standardeve. Prova duhet kontrolluar prapë. Punonjësit mund të gabohen; menaxherët ndonjëherë duhet të mos pajtohen; shqetësimet e mbrojtura duhet të përdorin kanalet e duhura. Kërkimi shtron, përkundrazi, një sfidë praktike: bëje të mundur që njerëzit t'i sjellin përpara shqetësimet e rëndësishme, pastaj trajtoji ato si hyrje për një vendim të ndershëm. Ai vendim mund të jetë një korrigjim, një refuzim me arsye, një eskalim ose një pyetje që mbetet e hapur. Asnjë teatër dëgjimi nuk e zëvendëson dot gjysmën e dytë, të vështirë, të punës. Një shënim duhet të gjejë një përgjegjës. Një pasiguri duhet të gjejë mënyrën për t'u verifikuar. Një përgjigje duhet të kthehet te ata që kanë nevojë për të, pa e shkelur privatësinë. Një menaxher nuk ka pse të premtojë se do ta zgjidhë çdo problem sot. Një menaxher mund të premtojë se nuk do ta ngatërrojë një bisedë me një përmirësim të përfunduar. Ekipi më i qetë nuk është doemos më i forti. Ndonjëherë heshtja është ajo që një ekip ka mësuar të ofrojë kur dyshon se e vërteta do të jetë e dobishme.",
          "Die Literatur lädt nicht zu einer sentimentalen Antwort ein. Psychologische Sicherheit ist nicht die Abschaffung von Standards. Belege müssen weiterhin geprüft werden. Beschäftigte können sich irren; Führungskräfte müssen manchmal widersprechen; geschützte Anliegen müssen die passenden Kanäle nutzen. Die Forschung stellt stattdessen eine praktische Aufgabe: Machen Sie es möglich, dass Menschen relevante Anliegen vorbringen, und behandeln Sie diese dann als Eingaben für eine ehrliche Entscheidung. Diese kann eine Korrektur sein, eine begründete Ablehnung, eine Eskalation oder eine offen bleibende Frage. Kein Zuhörtheater ersetzt die schwierige zweite Hälfte der Arbeit. Eine Notiz muss eine Verantwortliche finden. Eine Unsicherheit muss einen Weg zur Prüfung finden. Eine Antwort muss zu denen zurückkehren, die sie brauchen, ohne Vertraulichkeit zu verletzen. Eine Führungskraft muss nicht versprechen, jedes Problem heute zu lösen. Sie kann versprechen, ein Gespräch nicht mit einer abgeschlossenen Verbesserung zu verwechseln. Das stillste Team ist nicht unbedingt das stärkste. Manchmal ist Schweigen das, was ein Team anzubieten gelernt hat, wenn es bezweifelt, dass die Wahrheit nützlich sein wird.") },
        { type: "callout", reading: true, text: x(
          "The problems a team never reports cannot be managed by a dashboard. They must first become safe enough to be seen.",
          "Problemet që një ekip nuk i raporton kurrë nuk menaxhohen dot nga një panel. Së pari duhet të bëhen mjaft të sigurta për t'u parë.",
          "Die Probleme, die ein Team nie meldet, lassen sich nicht über ein Dashboard führen. Sie müssen erst sicher genug werden, um gesehen zu werden.") },
      ],
      note: x(
        "Editorial conclusion. No discouraged reporting, suppressed concern or sanction is attributed to any named employer.",
        "Përfundim editorial. Asnjë raportim i shkurajuar, shqetësim i shtypur apo ndëshkim nuk i atribuohet ndonjë punëdhënësi të caktuar.",
        "Redaktionelles Fazit. Kein entmutigtes Melden, kein unterdrücktes Anliegen und keine Sanktion wird einem bestimmten Arbeitgeber zugeschrieben."),
    },
    {
      id: "method",
      kicker: x("Method", "Metoda", "Methode"),
      title: [x("Every claim", "Çdo pohim", "Jede Behauptung"), x("has a boundary", "ka një kufi", "hat eine Grenze")],
      lead: x(
        "An evidence-informed editorial synthesis, not new field research. All managerial conversations and shift scenes are constructed and labelled as such; sample counts describe published studies, never silence rates at the author's workplaces.",
        "Një sintezë editoriale e mbështetur në prova, jo kërkim i ri në terren. Të gjitha bisedat menaxheriale dhe skenat e turneve janë të ndërtuara dhe të etiketuara si të tilla; numrat e mostrave përshkruajnë studime të botuara, kurrë norma heshtjeje në vendet e punës së autorit.",
        "Eine belegbasierte redaktionelle Synthese, keine neue Feldforschung. Alle Führungsgespräche und Schichtszenen sind konstruiert und als solche gekennzeichnet; Stichprobenzahlen beschreiben veröffentlichte Studien, nie Schweigequoten an den Arbeitsplätzen des Autors."),
      blocks: [
        { type: "rows", compact: true, items: [
          { h: x("Concept", "Koncepti", "Konzept"), p: x("Morrison and Milliken (2000) and Morrison (2014) define silence and voice; they are frameworks and a review, not measured rates.", "Morrison e Milliken (2000) dhe Morrison (2014) e përkufizojnë heshtjen dhe zërin; janë kuadër dhe rishikim, jo norma të matura.", "Morrison und Milliken (2000) und Morrison (2014) definieren Schweigen und Stimme; sie sind Rahmen und Übersicht, keine gemessenen Quoten.") },
          { h: x("Field studies", "Studimet në terren", "Feldstudien"), p: x("51 teams (Edmondson 1999), 40 interviews (Milliken et al. 2003), 9 hospitals (Tucker and Edmondson 2003), 23 NICUs (Nembhard and Edmondson 2006), 3,149 employees and 223 managers (Detert and Burris 2007), 89 interviews (Detert and Treviño 2010), 239 employees (Liang et al. 2012).", "51 ekipe (Edmondson 1999), 40 intervista (Milliken et al. 2003), 9 spitale (Tucker e Edmondson 2003), 23 NICU (Nembhard e Edmondson 2006), 3.149 punonjës dhe 223 menaxherë (Detert e Burris 2007), 89 intervista (Detert e Treviño 2010), 239 punonjës (Liang et al. 2012).", "51 Teams (Edmondson 1999), 40 Interviews (Milliken et al. 2003), 9 Krankenhäuser (Tucker und Edmondson 2003), 23 Neonatologien (Nembhard und Edmondson 2006), 3.149 Beschäftigte und 223 Führungskräfte (Detert und Burris 2007), 89 Interviews (Detert und Treviño 2010), 239 Beschäftigte (Liang et al. 2012).") },
          { h: x("Synthesis", "Sinteza", "Synthese"), p: x("Frazier et al. (2017): 136 independent samples, over 22,000 individuals, nearly 5,000 groups; it supports the construct, not any protocol here.", "Frazier et al. (2017): 136 mostra të pavarura, mbi 22.000 individë, afro 5.000 grupe; e mbështet konstruktin, jo ndonjë protokoll këtu.", "Frazier et al. (2017): 136 unabhängige Stichproben, über 22.000 Personen, fast 5.000 Gruppen; stützt das Konstrukt, kein Protokoll hier.") },
          { h: x("Invented counts", "Numrat e shpikur", "Erfundene Zahlen"), p: x("20 → 14 → 9 → 6 → 5 → 3 (Chapter I) and 12 → 9 → 7 → 5 → 3 → 2 (Chapter V) are illustrations, flagged on their pages; no proportion is a benchmark.", "20 → 14 → 9 → 6 → 5 → 3 (Kapitulli I) dhe 12 → 9 → 7 → 5 → 3 → 2 (Kapitulli V) janë ilustrime, me flamur në faqet e tyre; asnjë përpjesëtim nuk është pikë referimi.", "20 → 14 → 9 → 6 → 5 → 3 (Kapitel I) und 12 → 9 → 7 → 5 → 3 → 2 (Kapitel V) sind Illustrationen, auf ihren Seiten gekennzeichnet; kein Verhältnis ist ein Richtwert.") },
        ] },
        { type: "p", text: x(
          "The Speak-Up Signal Card, the listening routine and the short trial are designs for local assessment and require formal approval before operational use. Confidential data, personnel allegations and employer-specific procedures are excluded. Editorial standard: a concept, a field study, a synthesis and a proposal are named as such, and the sentence stops claiming where the evidence stops.",
          "Karta e sinjalit për të folur, rutina e dëgjimit dhe prova e shkurtër janë projektime për vlerësim lokal dhe kërkojnë miratim formal para përdorimit operacional. Të dhënat konfidenciale, akuzat ndaj personelit dhe procedurat e veçanta të punëdhënësit janë të përjashtuara. Standardi editorial: një koncept, një studim në terren, një sintezë dhe një propozim quhen me emrin e tyre, dhe fjalia pushon së pohuari aty ku mbaron prova.",
          "Die Signalkarte fürs Ansprechen, die Zuhörroutine und der kurze Versuch sind Entwürfe für die örtliche Prüfung und brauchen vor dem betrieblichen Einsatz eine förmliche Freigabe. Vertrauliche Daten, Vorwürfe gegen Personal und arbeitgeberspezifische Verfahren sind ausgeschlossen. Redaktioneller Standard: Ein Konzept, eine Feldstudie, eine Synthese und ein Vorschlag werden als solche benannt, und der Satz hört auf zu behaupten, wo die Belege enden.") },
      ],
      note: x(
        "Every source is cited at its DOI or page on the next page. The author's PDF also mentions Tucker (2004) beside Chapter I without listing it among its sources; the site cites Tucker and Edmondson (2003) alone.",
        "Çdo burim citohet me DOI-n ose faqen e vet në faqen tjetër. PDF-ja e autorit përmend edhe Tucker (2004) pranë Kapitullit I pa e renditur mes burimeve të veta; faqja citon vetëm Tucker e Edmondson (2003).",
        "Jede Quelle ist auf der nächsten Seite mit ihrer DOI oder Seite zitiert. Das PDF des Autors nennt neben Kapitel I auch Tucker (2004), ohne es unter seinen Quellen aufzuführen; die Website zitiert allein Tucker und Edmondson (2003)."),
      source: ["edmondson-1999", "morrison-milliken-2000", "boss-milliken-2003", "tucker-edmondson-2003", "nembhard-edmondson-2006", "detert-burris-2007", "detert-trevino-2010", "liang-farh-farh-2012", "morrison-2014", "frazier-2017"],
    },
    { id: "sources", type: "sources" },
    { id: "back", type: "back" },
  ],
};
