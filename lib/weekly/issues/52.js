// Management Review, No. 52: Managing up: the relationship with your boss. Block: Role.
// Facts and their sources: docs/revista/management-review-nr-52.md.
import { x, pc } from "../common.js";

export default {
  number: 52,
  block: "role",
  // Page 2 is too full in German for the reading legend under the contents; it is left out there.
  tight: ["de"],
  date: x("October 2026", "Tetor 2026", "Oktober 2026"),
  // Corrections made after publication, shown on the issue's page and its sources page.
  corrections: [
    {
      date: x("16 October 2026", "16 tetor 2026", "16. Oktober 2026"),
      t: x(
        "Sin and colleagues' meta-analysis of 64 samples found higher agreement in longer relationships; that agreement also rose with more intense contact comes from their own data on 98 pairs. The text first credited both to the meta-analysis.",
        "Meta-analiza e Sin-it dhe kolegëve me 64 mostra gjeti përputhje më të lartë në marrëdhëniet më të gjata; që përputhja rritej edhe me kontakt më të ngushtë vjen nga të dhënat e tyre me 98 çifte. Teksti fillimisht ia atribuonte të dyja meta-analizës.",
        "Die Metaanalyse von Sin und Kollegen mit 64 Stichproben fand höhere Übereinstimmung in längeren Beziehungen; dass sie auch bei engerem Kontakt stieg, stammt aus ihren eigenen Daten zu 98 Paaren. Der Text schrieb zuerst beides der Metaanalyse zu."),
    },
  ],
  theme: [x("Managing up:", "Të menaxhosh lart:", "Nach oben führen:"), x("the relationship with your boss", "marrëdhënia me shefin", "die Beziehung zum Chef")],
  sub: x(
    "A case of 14 months from Gabarro and Kotter, what 40 employees did not tell their bosses, five parts of a working relationship, two views of one relationship, seven questions and a card for the talk.",
    "Një rast 14-mujor nga Gabarro dhe Kotter, çfarë nuk u thanë shefave 40 punonjës, pesë pjesët e një marrëdhënieje pune, dy pamje të një marrëdhënieje, shtatë pyetje dhe një kartë për bisedën.",
    "Ein Fall von 14 Monaten bei Gabarro und Kotter, was 40 Beschäftigte ihren Chefs nicht sagten, fünf Teile einer Arbeitsbeziehung, zwei Sichten auf eine Beziehung, sieben Fragen und eine Karte fürs Gespräch."),
  seo: x(
    "Managing up: Gabarro and Kotter's mutual dependence, why people stay silent with the boss, leader–member exchange, the LMX-7 questions and a card.",
    "Të menaxhosh lart: varësia e ndërsjellë te Gabarro dhe Kotter, pse heshtin njerëzit me shefin, marrëdhënia drejtues–anëtar, pyetjet LMX-7 dhe një kartë.",
    "Nach oben führen: gegenseitige Abhängigkeit bei Gabarro und Kotter, warum Beschäftigte beim Chef schweigen, Leader-Member-Exchange, LMX-7-Fragen, eine Karte."),
  feature: x(
    "A manager fired after 14 months under a difficult boss: the case John Gabarro and John Kotter told in 1980 opens Issue 52. Then come what 40 employees did not dare to raise with their bosses, and why, and the five parts of a working relationship with the boss. Leader–member exchange follows that relationship from strangers to partners, meta-analyses show that boss and employee rate it differently, and a card prepares your next conversation with your manager.",
    "Numri 52 hapet me një rast që treguan John Gabarro dhe John Kotter më 1980: një menaxher që u pushua pas 14 muajsh nën një shef të vështirë. Pastaj vjen ajo që 40 punonjës nuk guxuan t'ua thoshin shefave, bashkë me arsyet, si dhe pesë pjesët e një marrëdhënieje pune me shefin. Pastaj ndjek si rritet marrëdhënia drejtues–anëtar nga të huaj në partnerë, meta-analizat tregojnë se shefi dhe punonjësi e vlerësojnë ndryshe, dhe një kartë të ndihmon të përgatitësh bisedën e radhës me eprorin.",
    "Eine Führungskraft, die nach 14 Monaten unter einem schwierigen Chef entlassen wurde: Mit diesem Fall, den John Gabarro und John Kotter 1980 schilderten, beginnt Ausgabe 52. Danach geht es darum, was 40 Beschäftigte ihren Chefs nicht zu sagen wagten und warum, und um die fünf Teile einer Arbeitsbeziehung zum Chef. Der Leader-Member-Exchange führt von Fremden zu Partnern, Metaanalysen zeigen, dass Chef und Beschäftigte die Beziehung unterschiedlich bewerten, und eine Karte hilft Ihnen, das nächste Gespräch mit Ihrer Führungskraft vorzubereiten."),
  figure: { n: x("85%", "85%", "85 %"), by: "Milliken, Morrison & Hewlin, 2003", t: x(
    "of 40 employees interviewed had at least once felt unable to raise an issue with their bosses, although they thought it important.",
    "e 40 punonjësve të intervistuar ishin ndier të paktën një herë se nuk mund t'u ngrinin shefave një çështje, edhe pse e mendonin të rëndësishme.",
    "von 40 befragten Beschäftigten hatten sich mindestens einmal außerstande gefühlt, ein Thema beim Chef anzusprechen, obwohl sie es für wichtig hielten.") },
  teasers: [
    { page: "story", kicker: x("Cover story", "Tema kryesore", "Titelthema"),
      title: x("Fourteen months", "Katërmbëdhjetë muaj", "Vierzehn Monate") },
    { page: "numbers", kicker: x("The numbers", "Shifrat", "Die Zahlen"),
      title: x("What does not travel up", "Çfarë nuk ngjitet lart", "Was nicht nach oben dringt") },
    { page: "tool", kicker: x("Tool of the issue", "Mjeti i numrit", "Werkzeug der Ausgabe"),
      title: x("The card for the talk with your boss", "Karta për bisedën me shefin", "Die Karte fürs Gespräch mit dem Chef") },
  ],
  sources: ["boss-gabarro-kotter-1980", "boss-milliken-2003", "boss-graen-uhl-bien-1995", "boss-gerstner-day-1997", "boss-sin-2009", "boss-dulebohn-2012"],
  pages: [
    { id: "cover", type: "cover" },
    {
      id: "intro", type: "intro",
      why: x(
        "Most of what is written for managers looks down, at the team. Yet every manager also has a boss, who sets priorities, opens doors and decides on resources. Here we look up: at what the relationship with the boss needs, what gets in its way, and what a manager can do about it.",
        "Shumica e asaj që shkruhet për menaxherët shikon poshtë, drejt ekipit. Por çdo menaxher ka edhe një shef, që vendos prioritetet, hap dyer dhe vendos për burimet. Këtu shikojmë lart: çfarë i duhet marrëdhënies me shefin, çfarë e pengon dhe çfarë mund të bëjë vetë menaxheri.",
        "Das meiste, was für Führungskräfte geschrieben wird, blickt nach unten, auf das Team. Doch jede Führungskraft hat auch einen Chef, der Prioritäten setzt, Türen öffnet und über Mittel entscheidet. Hier blicken wir nach oben: was die Beziehung zum Chef braucht, was ihr im Weg steht und was eine Führungskraft selbst dafür tun kann."),
      body: x(
        "In 1980 John Gabarro and John Kotter described managing the boss as working consciously with your superior for the best results for both and for the company, not as flattery. Of 40 employees interviewed in 2003, 34 had at least once felt unable to raise an important issue with their bosses. Leader–member exchange research describes how the relationship grows from strangers to partners. Meta-analyses find that boss and employee rate it only moderately alike. Seven questions make it measurable.",
        "Më 1980, John Gabarro dhe John Kotter e përshkruan menaxhimin e shefit si punë të vetëdijshme me eprorin për rezultatin më të mirë për të dy dhe për kompaninë, jo si lajkë. Nga 40 punonjës të intervistuar më 2003, 34 ishin ndier të paktën një herë se nuk mund t'u ngrinin shefave një çështje të rëndësishme. Studimet për marrëdhënien drejtues–anëtar përshkruajnë si kalon ajo nga të huaj në partnerë. Meta-analizat gjejnë se vlerësimet e shefit dhe të punonjësit përputhen vetëm mesatarisht. Shtatë pyetje e bëjnë marrëdhënien të matshme.",
        "1980 beschrieben John Gabarro und John Kotter das Führen des eigenen Chefs als bewusste Zusammenarbeit mit dem Vorgesetzten, die beiden und dem Unternehmen das beste Ergebnis bringen soll, nicht als Schmeichelei. Von 40 Beschäftigten, die 2003 befragt wurden, hatten sich 34 mindestens einmal außerstande gefühlt, ein wichtiges Thema beim Chef anzusprechen. Die Leader-Member-Exchange-Forschung beschreibt, wie die Beziehung von Fremden zu Partnern wächst. Metaanalysen zeigen, dass Chef und Beschäftigte sie nur mäßig übereinstimmend bewerten. Sieben Fragen machen sie messbar."),
    },
    {
      id: "story",
      kicker: x("Cover story", "Tema kryesore", "Titelthema"),
      title: [x("Fourteen", "Katërmbëdhjetë", "Vierzehn"), x("months", "muaj", "Monate")],
      lead: x(
        "Gabarro and Kotter open with a case. Frank Gibbons, a manufacturing vice president, was strong on production and weak with people. Philip Bonnevie, who had always had good bosses, was promoted to report to him in 1975 and never thought that managing his boss was part of his job. Fourteen months later he was fired.",
        "Gabarro dhe Kotter nisin me një rast. Frank Gibbons, zëvendëspresident i prodhimit, ishte i fortë në prodhim dhe i dobët me njerëzit. Philip Bonnevie, që kishte pasur gjithmonë shefa të mirë, u ngrit në detyrë nën varësinë e tij më 1975 dhe nuk mendoi kurrë se menaxhimi i shefit ishte pjesë e punës së tij. Katërmbëdhjetë muaj më vonë u pushua.",
        "Gabarro und Kotter beginnen mit einem Fall. Frank Gibbons, Vizepräsident der Fertigung, war stark in der Produktion und schwach im Umgang mit Menschen. Philip Bonnevie, der immer gute Chefs gehabt hatte, wurde 1975 befördert und ihm unterstellt; er dachte nie, dass das Führen des eigenen Chefs zu seiner Arbeit gehöre. Vierzehn Monate später wurde er entlassen."),
      blocks: [
        { type: "p", text: x(
          "During a major product launch the two disagreed about what had been agreed: a new type of machinery, how much risk to take. A plant was built that could not make the product as planned. The company lost $2 million to $5 million, by the authors' account. Gibbons blamed Bonnevie, Bonnevie blamed Gibbons.",
          "Gjatë hedhjes në treg të një produkti të madh, të dy e kishin kuptuar ndryshe se për çfarë kishin rënë dakord: për një lloj të ri makinerish dhe për sa rrezik do të merrej. U ndërtua një fabrikë që nuk e prodhonte dot produktin siç ishte planifikuar. Sipas autorëve, kompania humbi 2 deri në 5 milionë dollarë. Gibbons fajësoi Bonnevie-n, Bonnevie fajësoi Gibbons-in.",
          "Bei einer großen Produkteinführung waren sich beide uneins, was vereinbart war: eine neue Art von Maschinen, wie viel Risiko einzugehen sei. Es entstand ein Werk, das das Produkt nicht wie geplant herstellen konnte. Nach Darstellung der Autoren verlor das Unternehmen 2 bis 5 Millionen Dollar. Gibbons gab Bonnevie die Schuld, Bonnevie Gibbons.") },
        { type: "cards", cols: 2, items: [
          { h: x("What the boss needs from you", "Çfarë i duhet shefit nga ti", "Was der Chef von Ihnen braucht"), p: x("cooperation, dependability and honesty", "bashkëpunim, besueshmëri dhe ndershmëri", "Zusammenarbeit, Verlässlichkeit und Ehrlichkeit") },
          { h: x("What you need from the boss", "Çfarë të duhet ty nga shefi", "Was Sie vom Chef brauchen"), p: x("links to the rest of the company, priorities that fit, resources", "lidhjet me pjesën tjetër të kompanisë, prioritete që përputhen, burimet", "Verbindungen zum übrigen Unternehmen, passende Prioritäten, Mittel") },
        ] },
        { type: "callout", reading: true, text: x(
          "Gibbons's weakness was known to everyone. What was missing was a subordinate who took it into account.",
          "Dobësinë e Gibbons-it e dinte gjithkush. Mungonte një vartës që ta merrte parasysh.",
          "Gibbons' Schwäche kannten alle. Es fehlte ein Mitarbeiter, der sie einkalkulierte.") },
      ],
      note: x(
        "The case is told by Gabarro and Kotter (1980), from events of the 1970s; we know it only from their account. The two lists follow their article; what we draw from them is our own.",
        "Rastin e tregojnë Gabarro dhe Kotter (1980), nga ngjarje të viteve 1970; e njohim vetëm nga rrëfimi i tyre. Dy listat ndjekin artikullin e tyre; ajo që nxjerrim prej tyre është e jona.",
        "Den Fall erzählen Gabarro und Kotter (1980), nach Ereignissen der 1970er-Jahre; wir kennen ihn nur aus ihrer Darstellung. Die beiden Listen folgen ihrem Artikel; die Folgerungen daraus sind unsere."),
      source: ["boss-gabarro-kotter-1980"],
    },
    {
      id: "numbers",
      kicker: x("The numbers", "Shifrat", "Die Zahlen"),
      title: [x("What does not", "Çfarë nuk", "Was nicht nach"), x("travel up", "ngjitet lart", "oben dringt")],
      lead: x(
        "Frances Milliken, Elizabeth Morrison and Patricia Hewlin interviewed 40 people in full-time jobs. 34 of them (85%) had at least once felt unable to raise an issue with their bosses, although they thought it important. Only 51% generally felt comfortable speaking up.",
        "Frances Milliken, Elizabeth Morrison dhe Patricia Hewlin intervistuan 40 njerëz me punë me kohë të plotë. 34 prej tyre (85%) ishin ndier të paktën një herë se nuk mund t'u ngrinin shefave një çështje, edhe pse e mendonin të rëndësishme. Vetëm 51% ndiheshin përgjithësisht rehat të flisnin hapur.",
        "Frances Milliken, Elizabeth Morrison und Patricia Hewlin befragten 40 Vollzeitbeschäftigte. 34 von ihnen (85 %) hatten sich mindestens einmal außerstande gefühlt, ein Thema beim Chef anzusprechen, obwohl sie es für wichtig hielten. Nur 51 % fühlten sich grundsätzlich wohl dabei, Dinge offen anzusprechen."),
      blocks: [
        { type: "hbars", source: ["boss-milliken-2003"],
          label: x("Why they stayed silent (share of the 40 who named each reason), 2003", "Pse heshtën (pjesa e 40 vetave që përmendën secilën arsye), 2003", "Warum sie schwiegen (Anteil der 40, die den Grund nannten), 2003"),
          items: [
            { k: x("Being labelled or seen negatively", "Të etiketohej ose të shihej keq", "Negativ abgestempelt werden"), v: 30, n: pc(30), alert: true },
            { k: x("Damaging a relationship", "Të prishte një marrëdhënie", "Eine Beziehung beschädigen"), v: 27.5, n: x("27.5%", "27,5%", "27,5 %") },
            { k: x("It would change nothing", "Nuk do të ndryshonte asgjë", "Es würde nichts ändern"), v: 25, n: pc(25) },
            { k: x("Retaliation or punishment", "Hakmarrja ose ndëshkimi", "Vergeltung oder Strafe"), v: 22.5, n: x("22.5%", "22,5%", "22,5 %") },
            { k: x("Harm to someone else", "Dëmi për dikë tjetër", "Anderen schaden"), v: 20, n: pc(20) },
          ] },
        { type: "p", text: x(
          "Held back most often: the competence or performance of a colleague or boss (37.5%), problems with processes (35%) and pay (27.5%).",
          "Më shpesh mbaheshin për vete: aftësia ose performanca e një kolegu a shefi (37,5%), problemet me proceset (35%) dhe paga (27,5%).",
          "Am häufigsten verschwiegen: Kompetenz oder Leistung von Kollegen oder Chef (37,5 %), Probleme mit Abläufen (35 %) und die Bezahlung (27,5 %).") },
        { type: "callout", reading: true, text: x(
          "The news a boss needs most is often the news hardest to bring. Waiting to be asked is not enough.",
          "Lajmi që i duhet më shumë shefit shpesh është ai që i çohet më me vështirësi. Nuk mjafton të presësh që të të pyesë.",
          "Die Nachricht, die der Chef am dringendsten braucht, ist oft die, die am schwersten zu überbringen ist. Darauf zu warten, dass er fragt, reicht nicht.") },
      ],
      note: x(
        "Exploratory study: 40 interviews with full-time employees taking part-time MBA classes; the shares describe only this sample. Most named several reasons.",
        "Studim eksplorues: 40 intervista me punonjës me kohë të plotë që ndiqnin MBA me kohë të pjesshme; përqindjet përshkruajnë vetëm këtë mostër. Shumica përmendën disa arsye.",
        "Explorative Studie: 40 Interviews mit Vollzeitbeschäftigten in einem berufsbegleitenden MBA; die Anteile beschreiben nur diese Stichprobe. Die meisten nannten mehrere Gründe."),
      source: ["boss-milliken-2003"],
    },
    {
      id: "model", more: "solve-it-or-escalate-it",
      kicker: x("The model", "Modeli", "Das Modell"),
      title: [x("Understand, then", "Kupto, pastaj", "Verstehen, dann"), x("build", "ndërto", "aufbauen")],
      lead: x(
        "Gabarro and Kotter's checklist has three parts: understand the boss, understand yourself, and build a relationship that fits both. A boss, they write, is a fallible human being with limited time and their own pressures.",
        "Lista e Gabarro-s dhe Kotter-it ka tri pjesë: kupto shefin, kupto veten, dhe ndërto një marrëdhënie që u përshtatet të dyve. Shefi, shkruajnë ata, është një njeri që gabon, me kohë të kufizuar dhe me presionet e veta.",
        "Die Checkliste von Gabarro und Kotter hat drei Teile: den Chef verstehen, sich selbst verstehen und eine Beziehung aufbauen, die zu beiden passt. Ein Chef, schreiben sie, ist ein fehlbarer Mensch mit begrenzter Zeit und eigenem Druck."),
      blocks: [
        { type: "lists", cols: [
          { h: x("Understand", "Kupto", "Verstehen"), items: [
            x("the boss's goals and pressures", "qëllimet dhe presionet e shefit", "Ziele und Druck des Chefs"),
            x("strengths, weaknesses, blind spots", "pikat e forta, të dobëta, të verbëta", "Stärken, Schwächen, blinde Flecken"),
            x("the boss's preferred way of working", "mënyrën e preferuar të punës së shefit", "die bevorzugte Arbeitsweise des Chefs"),
            x("your own style and attitude to authority", "stilin tënd dhe qëndrimin ndaj autoritetit", "den eigenen Stil und die Haltung zur Autorität"),
          ] },
          { h: x("Build", "Ndërto", "Aufbauen"), accent: true, items: [
            x("compatible work styles", "stile pune që përputhen", "vereinbare Arbeitsstile"),
            x("expectations spelled out on both sides", "pritshmëri të qarta nga të dyja anët", "beiderseits klare Erwartungen"),
            x("a flow of information, bad news included", "rrjedhë informacioni, edhe lajmet e këqija", "Informationsfluss, auch schlechte Nachrichten"),
            x("dependability and honesty", "besueshmëri dhe ndershmëri", "Verlässlichkeit und Ehrlichkeit"),
            x("selective use of the boss's time", "përdorim i kursyer i kohës së shefit", "sparsamer Umgang mit der Zeit des Chefs"),
          ] },
        ] },
        { type: "p", text: x(
          "Following Peter Drucker, they split bosses into readers and listeners. A listener is briefed in person, then gets a memo; a reader gets the memo first, then the talk.",
          "Duke ndjekur Peter Drucker-in, ata i ndajnë shefat në lexues dhe dëgjues. Dëgjuesi informohet së pari me gojë dhe pastaj merr një shënim; lexuesi merr së pari shënimin, pastaj bisedën.",
          "Nach Peter Drucker teilen sie Chefs in Leser und Zuhörer. Ein Zuhörer wird zuerst persönlich informiert und bekommt danach eine Notiz; ein Leser bekommt zuerst die Notiz, dann das Gespräch.") },
        { type: "callout", reading: true, text: x(
          "Managing up means sparing the boss the guesswork. Pleasing the boss is another matter.",
          "Të menaxhosh lart do të thotë t'ia kursesh shefit hamendësimet. T'i pëlqesh është tjetër gjë.",
          "Nach oben führen heißt, dem Chef das Raten zu ersparen. Ihm zu gefallen, ist etwas anderes.") },
      ],
      note: x(
        "Grouping after the authors' checklist, shortened by the editors. Readers and listeners come from Drucker, as quoted by Gabarro and Kotter.",
        "Grupimi sipas listës së autorëve, i shkurtuar nga redaksia. Lexuesit dhe dëgjuesit vijnë nga Drucker-i, siç e citojnë Gabarro dhe Kotter.",
        "Gliederung nach der Checkliste der Autoren, von der Redaktion gekürzt. Leser und Zuhörer stammen von Drucker, wie Gabarro und Kotter ihn zitieren."),
      source: ["boss-gabarro-kotter-1980"],
    },
    {
      id: "research",
      kicker: x("What the research says", "Çfarë thotë kërkimi", "Was die Forschung sagt"),
      title: [x("Two views of", "Dy pamje të", "Zwei Sichten auf"), x("one relationship", "një marrëdhënieje", "eine Beziehung")],
      lead: x(
        "Leader–member exchange (LMX) theory studies each boss–employee pair as a relationship of its own. In 1995 George Graen and Mary Uhl-Bien described how such a relationship can grow in three phases.",
        "Teoria e marrëdhënies drejtues–anëtar (LMX) e studion çdo çift shef–punonjës si marrëdhënie më vete. Më 1995, George Graen dhe Mary Uhl-Bien përshkruan si mund të rritet një marrëdhënie e tillë në tri faza.",
        "Die Theorie des Leader-Member-Exchange (LMX) untersucht jedes Paar aus Chef und Beschäftigtem als eigene Beziehung. 1995 beschrieben George Graen und Mary Uhl-Bien, wie eine solche Beziehung in drei Phasen wachsen kann."),
      blocks: [
        { type: "chain", label: x("Leadership making, after Graen & Uhl-Bien (1995)", "Ndërtimi i marrëdhënies, sipas Graen & Uhl-Bien (1995)", "Beziehungsaufbau nach Graen & Uhl-Bien (1995)"), items: [
          { h: x("Strangers", "Të huaj", "Fremde"), p: x("formal, within the job description", "formale, brenda përshkrimit të punës", "formell, im Rahmen der Stellenbeschreibung") },
          { h: x("Acquaintances", "Të njohur", "Bekannte"), p: x("roles are tested, trust grows", "rolet provohen, besimi rritet", "Rollen werden erprobt, Vertrauen wächst") },
          { h: x("Partners", "Partnerë", "Partner"), p: x("mutual trust, respect and obligation", "besim, respekt dhe detyrim i ndërsjellë", "gegenseitiges Vertrauen, Respekt, Verpflichtung") },
        ] },
        { type: "p", text: x(
          "Charlotte Gerstner and David Day found the quality of this relationship tied to performance, satisfaction, commitment, role clarity and the intention to leave, but not to actual leaving. Leaders and members rated it only moderately alike. Hock-Peng Sin and colleagues confirmed this across 64 samples and 10,884 pairs (ρ = .37). Agreement was higher in longer relationships; in their own data from 98 pairs, it also rose with more intense contact.",
          "Charlotte Gerstner dhe David Day gjetën se cilësia e kësaj marrëdhënieje lidhej me performancën, kënaqësinë, përkushtimin, qartësinë e rolit dhe synimin për t'u larguar, por jo me largimin e vërtetë. Vlerësimet e drejtuesve dhe të anëtarëve përputheshin vetëm mesatarisht. Hock-Peng Sin dhe kolegët e konfirmuan këtë në 64 mostra dhe 10.884 çifte (ρ = 0,37). Përputhja ishte më e lartë në marrëdhëniet më të gjata; në të dhënat e tyre me 98 çifte, ajo rritej edhe kur kontakti ishte më i ngushtë.",
          "Charlotte Gerstner und David Day fanden, dass die Qualität dieser Beziehung mit Leistung, Zufriedenheit, Bindung, Rollenklarheit und Kündigungsabsicht zusammenhängt, nicht aber mit tatsächlichen Kündigungen. Die Urteile von Führenden und Geführten stimmten nur mäßig überein. Hock-Peng Sin und Kollegen bestätigten das über 64 Stichproben und 10.884 Paare (ρ = 0,37). Die Übereinstimmung war in längeren Beziehungen höher; in ihren eigenen Daten aus 98 Paaren stieg sie auch bei engerem Kontakt.") },
        { type: "callout", reading: true, text: x(
          "Would your boss describe your working relationship the way you do? Only a conversation will tell you.",
          "A do ta përshkruante shefi marrëdhënien tuaj të punës ashtu si ti? Këtë ta tregon vetëm një bisedë.",
          "Würde Ihr Chef Ihre Arbeitsbeziehung so beschreiben wie Sie? Herausfinden lässt sich das nur im Gespräch.") },
      ],
      note: x(
        "Meta-analyses of correlations: they show associations, not causes. The phases are confirmed through independent summaries. James Dulebohn and colleagues (247 studies) found the leader's side explains the most; the employee's side counts too.",
        "Meta-analiza korrelacionesh: tregojnë lidhje, jo shkaqe. Fazat konfirmohen përmes përmbledhjeve të pavarura. James Dulebohn dhe kolegët (247 studime) gjetën se ana e drejtuesit shpjegon më shumë; edhe ana e punonjësit ka peshë.",
        "Metaanalysen von Korrelationen: Sie zeigen Zusammenhänge, keine Ursachen. Die Phasen sind über unabhängige Zusammenfassungen belegt. James Dulebohn und Kollegen (247 Studien) fanden, dass die Seite der Führungskraft am meisten erklärt; die der Beschäftigten zählt auch."),
      source: ["boss-graen-uhl-bien-1995", "boss-gerstner-day-1997", "boss-sin-2009", "boss-dulebohn-2012"],
    },
    {
      id: "measure",
      kicker: x("How it is measured", "Si matet", "Wie es gemessen wird"),
      title: [x("Seven questions,", "Shtatë pyetje,", "Sieben Fragen,"), x("two answers", "dy përgjigje", "zwei Antworten")],
      lead: x(
        "Graen and Uhl-Bien proposed seven questions, LMX-7, each answered on a five-point scale, so the total runs from 7 to 35. Gerstner and Day found it the soundest of the measures they compared. The questions ask, in short:",
        "Graen dhe Uhl-Bien propozuan shtatë pyetje, LMX-7, secila me një shkallë me pesë pikë, ndaj totali shkon nga 7 deri në 35. Gerstner dhe Day e gjetën më të qëndrueshmen nga matjet që krahasuan. Pyetjet, shkurt, janë:",
        "Graen und Uhl-Bien schlugen sieben Fragen vor, LMX-7, jede auf einer Fünf-Punkte-Skala, sodass die Summe von 7 bis 35 reicht. Gerstner und Day fanden sie unter den verglichenen Maßen am solidesten. Die Fragen lauten, kurz gefasst:"),
      blocks: [
        { type: "steps", items: [
          { h: x("Where do I stand?", "Ku jam unë?", "Wo stehe ich?"), p: x("Do you know how satisfied the boss is with your work?", "E di sa i kënaqur është shefi me punën tënde?", "Wissen Sie, wie zufrieden der Chef mit Ihrer Arbeit ist?") },
          { h: x("Understanding and potential", "Kuptimi dhe potenciali", "Verständnis und Potenzial"), p: x("Does the boss understand your problems and see your potential?", "A i kupton shefi problemet e tua dhe a e sheh potencialin tënd?", "Versteht der Chef Ihre Probleme und sieht er Ihr Potenzial?") },
          { h: x("Backing", "Mbështetja", "Rückhalt"), p: x("Would the boss use their power to help you, even at a cost to themselves?", "A do ta përdorte shefi pushtetin për të të ndihmuar, edhe me kosto për veten?", "Würde der Chef seinen Einfluss nutzen, um Ihnen zu helfen, auch auf eigene Kosten?") },
          { h: x("Trust and the whole", "Besimi dhe e tëra", "Vertrauen und das Ganze"), p: x("Would you defend the boss's decision in their absence? How effective is the relationship?", "A do ta mbroje vendimin e shefit kur ai mungon? Sa efektive është marrëdhënia?", "Würden Sie die Entscheidung des Chefs in seiner Abwesenheit verteidigen? Wie wirksam ist die Beziehung?") },
        ] },
        { type: "example", label: x("Hypothetical example, a shift leader and her manager", "Shembull hipotetik, një shefe turni dhe eprori i saj", "Hypothetisches Beispiel, eine Schichtleiterin und ihr Vorgesetzter"), rows: [
          { k: x("Her score", "Pikët e saj", "Ihre Punkte"), v: x("22 of 35, lowest on “where do I stand?”", "22 nga 35, më pak te “ku jam unë?”", "22 von 35, am niedrigsten bei „Wo stehe ich?“") },
          { k: x("His score", "Pikët e tij", "Seine Punkte"), v: x("29 of 35", "29 nga 35", "29 von 35") },
          { k: x("Next step", "Hapi tjetër", "Nächster Schritt"), v: x("a monthly talk on what “good” means this quarter", "një bisedë mujore për çfarë do të thotë “mirë” këtë tremujor", "ein monatliches Gespräch, was in diesem Quartal „gut“ heißt") },
        ], text: x("The gap matters more than either score. Case and scores are invented.", "Dallimi peshon më shumë se secili prej rezultateve. Rasti dhe pikët janë të sajuara.", "Die Lücke zählt mehr als jede der beiden Punktzahlen. Fall und Punkte sind erfunden.") },
      ],
      note: x(
        "Questions paraphrased and grouped by the editors; the original wording was seen only in later reproductions. The boss can answer a matching version about the employee.",
        "Pyetjet i ka parafrazuar dhe grupuar redaksia; formulimi origjinal u pa vetëm te riprodhime të mëvonshme. Shefi mund të përgjigjet në një version përkatës për punonjësin.",
        "Fragen von der Redaktion umschrieben und gruppiert; den Originalwortlaut sahen wir nur in späteren Wiedergaben. Der Chef kann eine entsprechende Fassung über die beschäftigte Person beantworten."),
      source: ["boss-graen-uhl-bien-1995", "boss-gerstner-day-1997", "boss-sin-2009"],
    },
    {
      id: "tool", tool: "/tools/shift-handover/",
      kicker: x("Tool of the issue", "Mjeti i numrit", "Werkzeug der Ausgabe"),
      title: [x("The card for the talk", "Karta për bisedën", "Die Karte fürs Gespräch"), x("with your boss", "me shefin", "mit dem Chef")],
      lead: x(
        "One card before each regular talk with your manager. Check the first two lines every quarter, the rest each time.",
        "Një kartë para çdo bisede të rregullt me eprorin. Dy rreshtat e parë kontrolloji çdo tremujor, të tjerët çdo herë.",
        "Eine Karte vor jedem regelmäßigen Gespräch mit der eigenen Führungskraft. Die ersten zwei Zeilen prüfen Sie jedes Quartal, den Rest jedes Mal."),
      blocks: [
        { type: "form", items: [
          { h: x("Their goals and pressures", "Qëllimet dhe presionet e tij", "Ziele und Druck des Chefs"), hint: x("what their own boss expects of them this quarter", "çfarë pret prej tij shefi i vet këtë tremujor", "was dessen eigener Chef in diesem Quartal erwartet") },
          { h: x("How they take information", "Si e merr informacionin", "Wie der Chef Informationen aufnimmt"), hint: x("reader or listener; how often, in what form", "lexues apo dëgjues; sa shpesh, në çfarë forme", "Leser oder Zuhörer; wie oft, in welcher Form") },
          { h: x("What we expect of each other", "Çfarë presim nga njëri-tjetri", "Was wir voneinander erwarten"), hint: x("my draft of their expectations, to check together", "skica ime e pritshmërive të tij, për ta kontrolluar bashkë", "mein Entwurf seiner Erwartungen, gemeinsam zu prüfen"), lines: 2 },
          { h: x("News they need, including bad news", "Lajmet që i duhen, edhe të këqijat", "Nachrichten, die er braucht, auch schlechte"), hint: x("what happened, what I have done, what I need decided", "çfarë ndodhi, çfarë kam bërë, çfarë më duhet të vendoset", "was passiert ist, was ich getan habe, was entschieden werden muss") },
          { h: x("Commitments", "Angazhimet", "Zusagen"), hint: x("only dates I can keep; what slipped since last time", "vetëm afate që i mbaj; çfarë ka mbetur pas që nga hera e kaluar", "nur Termine, die ich halte; was sich seit dem letzten Mal verschoben hat") },
          { h: x("What I will not ask for", "Çfarë nuk do të kërkoj", "Worum ich nicht bitte"), hint: x("small things I can settle myself", "gjëra të vogla që i zgjidh vetë", "Kleinigkeiten, die ich selbst kläre") },
        ] },
      ],
      note: x(
        "The card is the editors' proposal, built on Gabarro and Kotter's checklist and on Milliken et al.'s work on silence. The handover tool keeps open issues with an owner and a time.",
        "Karta është propozim i redaksisë, mbi listën e Gabarro-s dhe Kotter-it dhe punën e Milliken-it et al. për heshtjen. Mjeti Dorëzimi i turnit i mban çështjet e hapura me përgjegjës dhe afat.",
        "Die Karte ist ein Vorschlag der Redaktion, gestützt auf die Checkliste von Gabarro und Kotter und auf Milliken et al. zum Schweigen. Das Werkzeug Schichtübergabe hält offene Punkte mit Verantwortlichem und Termin fest."),
      source: ["boss-gabarro-kotter-1980", "boss-milliken-2003"],
    },
    { id: "sources", type: "sources" },
    { id: "back", type: "back" },
  ],
};
