// Operational treatise, Volume 13: The partner paradox, why operations depend on people outside the org chart.
// Block: Operations. Facts and their sources: docs/revista/traktati-operacional.md. The research is the literature on
// governing work across company lines: Williamson 1979, Anderson & Narus 1990, Heide & John 1992, Ring & Van de Ven
// 1994, Gulati 1995, Dyer & Singh 1998, Zaheer, McEvily & Perrone 1998, Jap & Ganesan 2000, Poppo & Zenger 2002,
// Provan & Kenis 2008, Lumineau & Henderson 2012 and Cao & Lumineau 2015, each checked at its DOI. Six chapters in the
// three layers, as in the author's PDF. The PDF has no charts; the site adds one page to Chapter II with two sourced
// ones, from the sample of Lumineau & Henderson (128 disputes examined, 99 kept, and the type of contract in each).
// Every study count describes published research; the 61 resellers are the author's confirmed background, not a
// sample, and nothing is measured at any partner.
import { x } from "../common.js";

export default {
  number: 13,
  numeral: "XIII",
  block: "operations",
  date: x("October 2026", "Tetor 2026", "Oktober 2026"),
  theme: [x("The partner paradox:", "Paradoksi i partnerit:", "Das Partnerparadox:"), x("why operations depend on people outside the org chart", "pse operacionet varen nga njerëz jashtë organigramës", "warum der Betrieb von Menschen außerhalb des Organigramms abhängt")],
  sub: x(
    "Six chapters on commitments, contracts, trust, incentives and network reliability across company lines.",
    "Gjashtë kapituj për premtimet, kontratat, besimin, nxitjet dhe besueshmërinë e rrjetit përtej kufijve të kompanisë.",
    "Sechs Kapitel über Zusagen, Verträge, Vertrauen, Anreize und die Verlässlichkeit von Netzwerken über Firmengrenzen hinweg."),
  seo: x(
    "The partner paradox, an operational treatise: six chapters on work across company lines, from Dyer, Poppo and Zaheer to the Partner Reliability Card.",
    "Paradoksi i partnerit, traktat operacional: gjashtë kapituj për punën përtej kufijve të kompanisë, nga Dyer, Poppo e Zaheer te Karta e partnerit.",
    "Das Partnerparadox, operativer Traktat: sechs Kapitel über Arbeit über Firmengrenzen, von Dyer, Poppo und Zaheer zur Partner-Verlässlichkeitskarte."),
  feature: x(
    "Volume 13 asks how a promise stays reliable when no single manager controls both sides of it. Its six chapters move from an order between two firms, a clause that cannot drive the route, a call that needs no command, one delivery with two scorecards and a network that grows more fragile, to Williamson, Anderson and Narus, Heide and John, Zaheer, Poppo and Zenger, Lumineau and Henderson, Cao and Lumineau, Dyer and Singh, Provan and Kenis, and end with a partnership review that produces a decision, the Partner Reliability Card and the 30/60/90-day pilot.",
    "Vëllimi 13 pyet si mbetet i besueshëm një premtim kur asnjë menaxher i vetëm nuk i kontrollon të dyja anët e tij. Gjashtë kapitujt e tij shkojnë nga një porosi mes dy firmave, një klauzolë që nuk e drejton dot rrugën, një telefonatë që nuk ka nevojë për urdhër, një dorëzim me dy karta rezultatesh dhe një rrjet që rritet e bëhet më i brishtë, te Williamson, Anderson e Narus, Heide e John, Zaheer, Poppo e Zenger, Lumineau e Henderson, Cao e Lumineau, Dyer e Singh, Provan e Kenis, dhe mbyllen me një rishikim partneriteti që nxjerr një vendim, Kartën e besueshmërisë së partnerit dhe pilotin 30/60/90-ditor.",
    "Band 13 fragt, wie eine Zusage verlässlich bleibt, wenn keine einzelne Führungskraft beide Seiten kontrolliert. Seine sechs Kapitel führen von einem Auftrag zwischen zwei Firmen, einer Klausel, die keine Tour fahren kann, einem Anruf, der keinen Befehl braucht, einer Lieferung mit zwei Scorecards und einem Netzwerk, das wächst und zerbrechlicher wird, zu Williamson, Anderson und Narus, Heide und John, Zaheer, Poppo und Zenger, Lumineau und Henderson, Cao und Lumineau, Dyer und Singh, Provan und Kenis, und enden mit einem Partnerschaftsreview, das eine Entscheidung hervorbringt, der Partner-Verlässlichkeitskarte und dem 30/60/90-Tage-Pilot."),
  figure: { n: "149", by: x("Cao and Lumineau 2015, meta-analysis study count", "Cao e Lumineau 2015, numri i studimeve në meta-analizë", "Cao und Lumineau 2015, Zahl der Studien der Metaanalyse"), t: x(
    "empirical studies, covering 33,051 interorganisational relationships, were synthesised on contractual and relational governance across company boundaries.",
    "studime empirike, me 33.051 marrëdhënie ndërmjet organizatave, u përmblodhën për qeverisjen kontraktuale dhe relacionale përtej kufijve të kompanisë.",
    "empirische Studien mit 33.051 Beziehungen zwischen Organisationen wurden zur vertraglichen und relationalen Steuerung über Firmengrenzen zusammengefasst.") },
  teasers: [
    { page: "i-scene", kicker: x("Cover story", "Tema kryesore", "Titelthema"),
      title: x("The promise between two firms", "Premtimi mes dy firmave", "Die Zusage zwischen zwei Firmen") },
    { page: "iv-evidence", kicker: x("The evidence", "Prova", "Der Beleg"),
      title: x("Contracts and trust across 33,051 relationships", "Kontratat dhe besimi në 33.051 marrëdhënie", "Verträge und Vertrauen in 33.051 Beziehungen") },
    { page: "tool", kicker: x("Field tool", "Mjeti i terrenit", "Werkzeug vor Ort"),
      title: x("The Partner Reliability Card", "Karta e besueshmërisë së partnerit", "Die Partner-Verlässlichkeitskarte") },
  ],
  contract: [
    { h: x("Clarity", "Qartësia", "Klarheit"), p: x("A shared promise, not competing assumptions.", "Një premtim i përbashkët, jo supozime që konkurrojnë.", "Eine gemeinsame Zusage, keine konkurrierenden Annahmen.") },
    { h: x("Reciprocity", "Reciprociteti", "Gegenseitigkeit"), p: x("Information that moves in both directions.", "Informacion që lëviz në të dy drejtimet.", "Informationen, die in beide Richtungen fließen.") },
    { h: x("Evidence", "Prova", "Belege"), p: x("Verify the service and the response.", "Verifiko shërbimin dhe përgjigjen.", "Leistung und Reaktion prüfen.") },
  ],
  sources: ["williamson-1979", "anderson-narus-1990", "heide-john-1992", "ring-van-de-ven-1994", "gulati-1995", "dyer-singh-1998", "zaheer-mcevily-perrone-1998", "jap-ganesan-2000", "poppo-zenger-2002", "provan-kenis-2008", "lumineau-henderson-2012", "cao-lumineau-2015"],
  pages: [
    { id: "cover", type: "cover" },
    {
      id: "intro", type: "intro",
      title: [x("The work across", "Puna përtej", "Die Arbeit über"), x("company lines", "kufijve të kompanisë", "Firmengrenzen hinweg")],
      why: x(
        "Some of the most consequential operational work happens outside the manager's direct authority.",
        "Një pjesë e punës operacionale me më shumë pasoja ndodh jashtë autoritetit të drejtpërdrejtë të menaxherit.",
        "Ein Teil der folgenreichsten Betriebsarbeit geschieht außerhalb der direkten Weisungsbefugnis der Führungskraft."),
      body: x(
        "An organisation can prepare the work, publish the target and appoint an accountable manager. Yet the final result may depend on an independent reseller, a carrier, a supplier or another business with its own resources and incentives. The operating problem is not simply how to give an instruction. It is how to make a promise reliable across a boundary neither side fully controls. The author's experience spans a wholesale distribution network of 61 resellers in Albania and last-mile coordination with delivery partners in Germany. Those are confirmed areas of work. This treatise does not assert that a named partner failed, that a particular contract caused conflict, or that a governance change produced measured savings; its scenes are constructed and labelled. Research adds a demanding counterpoint. Trust between people is not identical to trust between organisations. Formal contracts do not automatically destroy trust, nor does a contract guarantee cooperative execution. A mature partnership is not one without disagreements. It is one that knows what has been promised, how uncertainty will be signalled, how exceptions will be handled fairly, and whether corrective decisions reach both sides. The measure is not whether a partner feels agreeable, but whether two organisations can coordinate legitimate work under changing conditions without losing accountability.",
        "Një organizatë mund ta përgatisë punën, ta shpallë objektivin dhe të caktojë një menaxher përgjegjës. Megjithatë rezultati përfundimtar mund të varet nga një rishitës i pavarur, një transportues, një furnizues apo një biznes tjetër me burimet dhe nxitjet e veta. Problemi operacional nuk është thjesht si jepet një udhëzim. Është si bëhet i besueshëm një premtim përtej një kufiri që asnjëra palë nuk e kontrollon plotësisht. Përvoja e autorit përfshin një rrjet shpërndarjeje me shumicë me 61 rishitës në Shqipëri dhe koordinimin e last mile-it me partnerë dorëzimi në Gjermani. Këto janë fusha pune të konfirmuara. Ky traktat nuk pohon se një partner i caktuar dështoi, se një kontratë e caktuar shkaktoi konflikt, apo se një ndryshim qeverisjeje solli kursime të matura; skenat e tij janë të ndërtuara dhe të shënuara si të tilla. Kërkimi sjell një kundërpeshë të rreptë. Besimi mes njerëzve nuk është i njëjtë me besimin mes organizatave. Kontratat formale nuk e shkatërrojnë vetvetiu besimin, as një kontratë nuk e garanton zbatimin bashkëpunues. Një partneritet i pjekur nuk është ai pa mosmarrëveshje. Është ai që e di çfarë është premtuar, si do të sinjalizohet pasiguria, si do të trajtohen përjashtimet me drejtësi dhe nëse vendimet korrigjuese arrijnë te të dyja palët. Masa nuk është nëse një partner duket i këndshëm, por nëse dy organizata mund ta koordinojnë punën e ligjshme në kushte që ndryshojnë pa e humbur llogaridhënien.",
        "Eine Organisation kann die Arbeit vorbereiten, das Ziel veröffentlichen und eine verantwortliche Führungskraft benennen. Dennoch kann das Endergebnis von einem unabhängigen Wiederverkäufer, einem Frachtführer, einem Lieferanten oder einem anderen Unternehmen mit eigenen Mitteln und Anreizen abhängen. Das betriebliche Problem ist nicht bloß, wie man eine Anweisung gibt, sondern wie eine Zusage über eine Grenze hinweg verlässlich wird, die keine Seite ganz kontrolliert. Die Erfahrung des Autors umfasst ein Großhandelsnetz mit 61 Wiederverkäufern in Albanien und die Last-Mile-Koordination mit Zustellpartnern in Deutschland. Das sind bestätigte Arbeitsfelder. Dieser Traktat behauptet nicht, dass ein benannter Partner versagt, ein bestimmter Vertrag Konflikte verursacht oder eine Änderung der Steuerung gemessene Einsparungen gebracht hätte; seine Szenen sind konstruiert und gekennzeichnet. Die Forschung setzt einen anspruchsvollen Kontrapunkt. Vertrauen zwischen Menschen ist nicht dasselbe wie Vertrauen zwischen Organisationen. Formale Verträge zerstören Vertrauen nicht automatisch, und ein Vertrag garantiert keine kooperative Umsetzung. Eine reife Partnerschaft ist keine ohne Meinungsverschiedenheiten, sondern eine, die weiß, was zugesagt ist, wie Unsicherheit gemeldet wird, wie Ausnahmen fair behandelt werden und ob Korrekturen beide Seiten erreichen. Der Maßstab ist nicht, ob ein Partner angenehm wirkt, sondern ob zwei Organisationen legitime Arbeit unter wechselnden Bedingungen koordinieren können, ohne die Verantwortlichkeit zu verlieren."),
    },
    { id: "contents", type: "contents" },
    {
      id: "note",
      kicker: x("Editorial method", "Metoda editoriale", "Redaktionelle Methode"),
      title: [x("Narrative, science,", "Rrëfim, shkencë,", "Erzählung, Wissenschaft,"), x("operational protocol", "protokoll operacional", "operatives Protokoll")],
      lead: x(
        "A plausible scenario can reveal a mechanism. It cannot substitute for evidence of what happened.",
        "Një skenar i besueshëm mund ta zbulojë një mekanizëm. Nuk mund të zërë vendin e provës për atë që ndodhi.",
        "Ein plausibles Szenario kann einen Mechanismus zeigen. Es ersetzt keinen Beleg dafür, was geschah."),
      blocks: [
        { type: "p", text: x(
          "Three kinds of evidence are kept apart throughout this volume. First, the author's confirmed career context includes wholesale distribution work with 61 resellers and the coordination of last-mile delivery partners. These facts establish relevant operating environments; they do not establish the frequency of disputes, contract terms or a measured causal outcome. Second, the research ranges from conceptual frameworks to surveys of relationships, a study of documented buyer-supplier disputes and a meta-analysis. Every count belongs to its published study, and cross-sector mechanisms are prompts for inquiry, not universal effect sizes: a sample of industrial buyers does not report performance for a German delivery operation. Third, every scene is a labelled hypothetical or composite, and the protocols and the Partner Reliability Card are editorial proposals that need local review, consent, contractual compatibility and protection of confidential information before any formal use. This volume is not a legal guide. It does not provide contract language, name partner organisations, evaluate actual disputes or reveal commercial terms.",
          "Tri lloje provash mbahen të ndara gjatë gjithë këtij vëllimi. E para, konteksti i konfirmuar i karrierës së autorit përfshin punën në shpërndarjen me shumicë me 61 rishitës dhe koordinimin e partnerëve të dorëzimit last mile. Këto fakte tregojnë mjedise pune të rëndësishme; nuk tregojnë shpeshtësinë e mosmarrëveshjeve, kushtet e kontratave apo një rezultat shkakësor të matur. E dyta, kërkimi shkon nga korniza konceptuale te anketa marrëdhëniesh, një studim i mosmarrëveshjeve të dokumentuara blerës-furnizues dhe një meta-analizë. Çdo numër i përket studimit të vet të botuar, dhe mekanizmat nga sektorë të tjerë janë nxitje për hetim, jo madhësi universale efekti: një mostër blerësish industrialë nuk raporton performancën e një operacioni dorëzimi në Gjermani. E treta, çdo skenë është hipotetike ose e përbërë dhe e shënuar si e tillë, ndërsa protokollet dhe Karta e besueshmërisë së partnerit janë propozime editoriale që kërkojnë rishikim lokal, pëlqim, përputhje me kontratat dhe mbrojtje të informacionit konfidencial para çdo përdorimi formal. Ky vëllim nuk është udhëzues ligjor. Nuk jep tekst kontrate, nuk emërton organizata partnere, nuk vlerëson mosmarrëveshje reale dhe nuk zbulon kushte tregtare.",
          "Drei Arten von Belegen bleiben in diesem Band getrennt. Erstens umfasst der bestätigte berufliche Hintergrund des Autors Großhandelsarbeit mit 61 Wiederverkäufern und die Koordination von Last-Mile-Zustellpartnern. Diese Fakten belegen relevante Arbeitsumfelder, aber weder die Häufigkeit von Streitfällen noch Vertragsbedingungen oder ein gemessenes kausales Ergebnis. Zweitens reicht die Forschung von begrifflichen Rahmen über Befragungen zu Beziehungen bis zu einer Studie dokumentierter Streitfälle zwischen Käufern und Lieferanten und einer Metaanalyse. Jede Zahl gehört zu ihrer veröffentlichten Studie, und Mechanismen aus anderen Branchen sind Anstöße zur Prüfung, keine universellen Effektgrößen: Eine Stichprobe industrieller Einkäufer sagt nichts über die Leistung einer deutschen Zustellung. Drittens ist jede Szene als hypothetisch oder zusammengesetzt gekennzeichnet, und die Protokolle und die Partner-Verlässlichkeitskarte sind redaktionelle Vorschläge, die vor jeder formalen Nutzung örtliche Prüfung, Zustimmung, Vereinbarkeit mit Verträgen und Schutz vertraulicher Informationen brauchen. Dieser Band ist kein Rechtsratgeber. Er liefert keine Vertragstexte, nennt keine Partnerorganisationen, bewertet keine echten Streitfälle und legt keine Handelsbedingungen offen.") },
        { type: "cards", cols: 3, items: [
          { h: x("Fact · career context", "Fakt · konteksti i karrierës", "Fakt · beruflicher Kontext"), p: x("61 reseller relationships; last-mile partner coordination.", "61 marrëdhënie me rishitës; koordinim i partnerëve last mile.", "61 Beziehungen zu Wiederverkäufern; Koordination von Last-Mile-Partnern.") },
          { h: x("Research · published study", "Kërkim · studim i botuar", "Forschung · veröffentlichte Studie"), p: x("Author, year, sample and method noted where relevant.", "Autori, viti, mostra dhe metoda, aty ku kanë rëndësi.", "Autor, Jahr, Stichprobe und Methode, wo es zählt.") },
          { h: x("Proposal · field design", "Propozim · projektim terreni", "Vorschlag · Feldentwurf"), p: x("Test locally; never present as a certified method.", "Provoje lokalisht; mos e paraqit kurrë si metodë të certifikuar.", "Örtlich erproben; nie als zertifizierte Methode ausgeben.") },
        ] },
        { type: "callout", reading: true, text: x(
          "The strongest claim in a field treatise is a claim whose evidence level the reader can see.",
          "Pohimi më i fortë në një traktat terreni është ai pohim, niveli i provës së të cilit duket nga lexuesi.",
          "Die stärkste Aussage eines Feldtraktats ist eine, deren Belegstufe die Leserin und der Leser sehen können.") },
      ],
      note: x(
        "Research orientation: Dyer and Singh (1998); Zaheer et al. (1998); Poppo and Zenger (2002); Cao and Lumineau (2015). No private partner data are used.",
        "Orientimi i kërkimit: Dyer e Singh (1998); Zaheer et al. (1998); Poppo e Zenger (2002); Cao e Lumineau (2015). Nuk përdoren të dhëna private partnerësh.",
        "Forschungsgrundlage: Dyer und Singh (1998); Zaheer et al. (1998); Poppo und Zenger (2002); Cao und Lumineau (2015). Es werden keine privaten Partnerdaten verwendet."),
      source: ["dyer-singh-1998", "zaheer-mcevily-perrone-1998", "poppo-zenger-2002", "cao-lumineau-2015"],
    },

    // Chapter I. The promise across company lines
    {
      id: "ch-i", type: "chapter", numeral: "I",
      title: x("The promise across company lines", "Premtimi përtej kufijve të kompanisë", "Die Zusage über Firmengrenzen"),
      pages: [
        {
          id: "i-scene", layer: "scene", more: "mistakes-get-lost-between-departments",
          title: [x("The order", "Porosia", "Der Auftrag"), x("between two firms", "mes dy firmave", "zwischen zwei Firmen")],
          lead: x(
            "A customer hears one promise. Two organisations must decide how to keep it.",
            "Klienti dëgjon një premtim. Dy organizata duhet të vendosin si ta mbajnë.",
            "Der Kunde hört eine Zusage. Zwei Organisationen müssen entscheiden, wie sie sie halten."),
          blocks: [
            { type: "flag", text: x("Composite wholesale scene, hypothetical, not a documented incident", "Skenë e përbërë shumice, hipotetike, jo ngjarje e dokumentuar", "Zusammengesetzte Großhandelsszene, hypothetisch, kein dokumentierter Vorfall") },
            { type: "p", text: x(
              "A reseller asks for a shipment before a local campaign. The commercial contact wants to preserve the sale. Availability looks reasonable in the sales view, but the distribution team has a separate picture of picking capacity and transport cut-off times. Someone on the supplying side gives a confident answer before both realities are reconciled. The order is accepted. The next morning another team discovers that the promised date requires an exception. Nobody in the scene needs to be dishonest. The salesperson sees a commitment to a business relationship, the warehouse sees a capacity constraint, the reseller sees a delivery promise. Each holds a different piece of the operating system and faces a different consequence if the promise fails. The interface between their information is the real problem.",
              "Një rishitës kërkon një dërgesë para një fushate lokale. Kontakti tregtar do ta ruajë shitjen. Në pamjen e shitjes gjendja duket e arsyeshme, por ekipi i shpërndarjes ka një tablo tjetër për kapacitetin e mbledhjes së mallit dhe orët e fundit të transportit. Dikush nga ana e furnizuesit jep një përgjigje të sigurt para se të dy realitetet të përputhen. Porosia pranohet. Të nesërmen në mëngjes një ekip tjetër zbulon se data e premtuar kërkon një përjashtim. Askush në këtë skenë nuk ka nevojë të jetë i pandershëm. Shitësi sheh një angazhim ndaj një marrëdhënieje biznesi, magazina sheh një kufizim kapaciteti, rishitësi sheh një premtim dorëzimi. Secili mban një copë tjetër të sistemit operativ dhe përballet me një pasojë tjetër nëse premtimi dështon. Ndërfaqja mes informacioneve të tyre është problemi i vërtetë.",
              "Ein Wiederverkäufer bittet vor einer lokalen Aktion um eine Lieferung. Der Vertriebskontakt will den Verkauf halten. In der Vertriebssicht wirkt der Bestand ausreichend, doch das Distributionsteam hat ein eigenes Bild von Kommissionierkapazität und Transportschlusszeiten. Jemand auf der Lieferseite gibt eine sichere Antwort, bevor beide Wirklichkeiten abgeglichen sind. Der Auftrag wird angenommen. Am nächsten Morgen entdeckt ein anderes Team, dass der zugesagte Termin eine Ausnahme verlangt. Niemand in der Szene muss unehrlich sein. Der Verkäufer sieht eine Verpflichtung gegenüber einer Geschäftsbeziehung, das Lager eine Kapazitätsgrenze, der Wiederverkäufer ein Lieferversprechen. Jeder hält ein anderes Stück des Betriebssystems und trägt eine andere Folge, wenn die Zusage scheitert. Die Schnittstelle zwischen ihren Informationen ist das eigentliche Problem.") },
            { type: "p", text: x(
              "This scene is constructed. The author's confirmed background includes 61 reseller relationships in Albania, but no source establishes that this particular event occurred. It illustrates a question that applies across wholesale and logistics: how much operational certainty is needed before one firm communicates a commitment another firm will plan around? The easy response is to demand more personal effort after the promise has been made. The stronger one is a joint commitment process that asks about stock, preparation, handoff and confirmation before the customer is given a date. That will not eliminate uncertainty. It will make uncertainty visible before it becomes someone else's crisis.",
              "Kjo skenë është e ndërtuar. Sfondi i konfirmuar i autorit përfshin 61 marrëdhënie me rishitës në Shqipëri, por asnjë burim nuk tregon se kjo ngjarje e veçantë ndodhi. Ajo ilustron një pyetje që vlen në shumicë dhe në logjistikë: sa siguri operacionale duhet para se një firmë të komunikojë një angazhim mbi të cilin do të planifikojë një firmë tjetër? Përgjigjja e lehtë është të kërkosh më shumë përpjekje personale pasi premtimi është bërë. Përgjigjja më e fortë është një proces i përbashkët angazhimi që pyet për gjendjen, përgatitjen, dorëzimin dhe konfirmimin para se klientit t'i jepet një datë. Kjo nuk e zhduk pasigurinë. E bën të dukshme para se të bëhet kriza e dikujt tjetër.",
              "Diese Szene ist konstruiert. Der bestätigte Hintergrund des Autors umfasst 61 Beziehungen zu Wiederverkäufern in Albanien, doch keine Quelle belegt, dass genau dieses Ereignis stattfand. Sie veranschaulicht eine Frage, die im Großhandel wie in der Logistik gilt: Wie viel betriebliche Gewissheit braucht es, bevor eine Firma eine Zusage macht, mit der eine andere Firma plant? Die bequeme Antwort ist, nach der Zusage mehr persönlichen Einsatz zu verlangen. Die stärkere ist ein gemeinsamer Zusageprozess, der nach Bestand, Vorbereitung, Übergabe und Bestätigung fragt, bevor der Kunde einen Termin erhält. Das beseitigt Unsicherheit nicht. Es macht sie sichtbar, bevor sie zur Krise eines anderen wird.") },
            { type: "callout", reading: true, text: x(
              "A promise is an interface between organisations. Treat its conditions as carefully as its wording.",
              "Një premtim është ndërfaqe mes organizatave. Trajtoji kushtet e tij me po aq kujdes sa fjalët.",
              "Eine Zusage ist eine Schnittstelle zwischen Organisationen. Ihre Bedingungen verdienen dieselbe Sorgfalt wie ihr Wortlaut.") },
          ],
          note: x(
            "Constructed illustration. For distributor-manufacturer relationship context, see Anderson and Narus (1990). The essay named below follows mistakes across the points where work changes hands.",
            "Ilustrim i ndërtuar. Për kontekstin e marrëdhënies shpërndarës-prodhues, shih Anderson e Narus (1990). Eseja e emërtuar më poshtë i ndjek gabimet në pikat ku puna ndërron duar.",
            "Konstruierte Veranschaulichung. Zum Verhältnis von Händler und Hersteller siehe Anderson und Narus (1990). Der unten genannte Essay folgt Fehlern an den Stellen, an denen Arbeit die Hand wechselt."),
          source: ["anderson-narus-1990"],
        },
        {
          id: "i-concept", layer: "concept",
          title: [x("The invisible", "Kontrata e padukshme", "Der unsichtbare"), x("handoff contract", "e dorëzimit", "Übergabevertrag")],
          lead: x(
            "The handoff carries materials, information, expectations and a duty to respond.",
            "Dorëzimi mbart materiale, informacion, pritshmëri dhe detyrimin për t'u përgjigjur.",
            "Die Übergabe trägt Material, Information, Erwartungen und eine Pflicht zu antworten."),
          blocks: [
            { type: "p", text: x(
              "A commercial promise is not only a date or a quantity. It is an agreement about which organisation will perform which part of a chain. The outcome is judged by one recipient, while each contributing company sees only its local part: a classic coordination challenge, not simply a communication failure. Anderson and Narus (1990) studied manufacturer-distributor working partnerships with multiple informants on both sides. Their model was supported best when cooperation was specified as an antecedent of trust rather than its consequence: a caution against assuming trust must exist before useful joint action occurs. Repeated reliable interactions can help build confidence in a partner.",
              "Një premtim tregtar nuk është vetëm një datë apo një sasi. Është marrëveshje se cila organizatë do ta kryejë cilën pjesë të zinxhirit. Rezultati gjykohet nga një marrës i vetëm, ndërsa çdo kompani që kontribuon sheh vetëm pjesën e vet: sfidë klasike koordinimi, jo thjesht dështim komunikimi. Anderson dhe Narus (1990) studiuan partneritetet e punës prodhues-shpërndarës me disa informues nga të dyja anët. Modeli i tyre u mbështet më mirë kur bashkëpunimi u vendos si paraardhës i besimit, jo si pasojë e tij: një paralajmërim kundër supozimit se besimi duhet të ekzistojë para se të nisë një veprim i përbashkët i dobishëm. Ndërveprimet e përsëritura dhe të besueshme mund të ndihmojnë të ndërtohet besimi te një partner.",
              "Eine geschäftliche Zusage ist nicht nur ein Termin oder eine Menge. Sie ist eine Vereinbarung darüber, welche Organisation welchen Teil einer Kette ausführt. Das Ergebnis beurteilt ein Empfänger, während jedes beteiligte Unternehmen nur seinen Teil sieht: eine klassische Koordinationsaufgabe, nicht bloß ein Kommunikationsfehler. Anderson und Narus (1990) untersuchten Arbeitspartnerschaften zwischen Herstellern und Händlern mit mehreren Auskunftspersonen auf beiden Seiten. Ihr Modell wurde am besten gestützt, wenn Kooperation als Vorläufer von Vertrauen statt als dessen Folge angesetzt wurde: eine Warnung vor der Annahme, Vertrauen müsse bestehen, bevor nützliches gemeinsames Handeln beginnt. Wiederholte verlässliche Interaktionen können Vertrauen in einen Partner aufbauen helfen.") },
            { type: "p", text: x(
              "Three handoffs deserve separate attention. A physical handoff transfers goods or a completed service. An informational handoff transfers verified facts about status and exceptions. An authority handoff specifies who is permitted and required to decide when the original plan is threatened. A perfect goods label cannot repair a missing authority rule; friendly communication cannot repair a systematically misleading status. For a reseller network, a joint promise might record accepted quantity, confirmed availability, dispatch commitment and the responsible point of contact; for a carrier, readiness to load might be distinguished from actual departure. These are proposed fields, not a claim about how the author's employers worked.",
              "Tri dorëzime meritojnë vëmendje më vete. Dorëzimi fizik kalon mallin ose një shërbim të kryer. Dorëzimi i informacionit kalon fakte të verifikuara për gjendjen dhe përjashtimet. Dorëzimi i autoritetit përcakton kush lejohet dhe kush detyrohet të vendosë kur plani fillestar kërcënohet. Një etiketë malli e përsosur nuk e ndreq dot mungesën e një rregulli autoriteti; komunikimi miqësor nuk e ndreq dot një status që mashtron sistematikisht. Për një rrjet rishitësish, një premtim i përbashkët mund të shënojë sasinë e pranuar, gjendjen e konfirmuar, angazhimin e nisjes dhe pikën përgjegjëse të kontaktit; për një transportues, gatishmëria për ngarkim mund të dallohet nga nisja e vërtetë. Këto janë fusha të propozuara, jo pohim për mënyrën si punonin punëdhënësit e autorit.",
              "Drei Übergaben verdienen eigene Aufmerksamkeit. Die physische Übergabe überträgt Ware oder eine erbrachte Leistung. Die Informationsübergabe überträgt geprüfte Fakten zu Stand und Ausnahmen. Die Befugnisübergabe legt fest, wer entscheiden darf und muss, wenn der ursprüngliche Plan gefährdet ist. Ein perfektes Warenetikett ersetzt keine fehlende Befugnisregel; freundliche Kommunikation ersetzt keinen systematisch irreführenden Status. In einem Händlernetz könnte eine gemeinsame Zusage angenommene Menge, bestätigte Verfügbarkeit, Versandzusage und die verantwortliche Kontaktstelle festhalten; bei einem Frachtführer ließe sich Ladebereitschaft von tatsächlicher Abfahrt unterscheiden. Das sind vorgeschlagene Felder, keine Aussage darüber, wie die Arbeitgeber des Autors arbeiteten.") },
            { type: "rows", compact: true, items: [
              { h: x("Physical", "Fizik", "Physisch"), p: x("What must cross the boundary?", "Çfarë duhet të kalojë kufirin?", "Was muss die Grenze überqueren?") },
              { h: x("Information", "Informacion", "Information"), p: x("Which status is verified, and at what time?", "Cili status është verifikuar, dhe në çfarë ore?", "Welcher Stand ist geprüft, und zu welcher Zeit?") },
              { h: x("Authority", "Autoritet", "Befugnis"), p: x("Who may change the promise, and who must be informed?", "Kush mund ta ndryshojë premtimin, dhe kush duhet të njoftohet?", "Wer darf die Zusage ändern, und wer muss es erfahren?") },
            ] },
          ],
          note: x(
            "Anderson and Narus (1990), Journal of Marketing 54(1); Ring and Van de Ven (1994). The three handoffs and their fields are editorial.",
            "Anderson e Narus (1990), Journal of Marketing 54(1); Ring e Van de Ven (1994). Tri dorëzimet dhe fushat e tyre janë editoriale.",
            "Anderson und Narus (1990), Journal of Marketing 54(1); Ring und Van de Ven (1994). Die drei Übergaben und ihre Felder sind redaktionell."),
          source: ["anderson-narus-1990", "ring-van-de-ven-1994"],
        },
        {
          id: "i-protocol", layer: "protocol",
          title: [x("Make the promise", "Bëje premtimin", "Die Zusage"), x("testable", "të provueshëm", "prüfbar machen")],
          lead: x(
            "The goal is not perfect forecasting. It is reducing the gap between commitment and shared knowledge.",
            "Qëllimi nuk është parashikimi i përsosur. Është ngushtimi i hendekut mes angazhimit dhe dijes së përbashkët.",
            "Ziel ist keine perfekte Prognose, sondern eine kleinere Lücke zwischen Zusage und geteiltem Wissen."),
          blocks: [
            { type: "p", text: x(
              "Partnership discipline starts before a problem becomes a dispute. A promise should be specific enough to be checked, yet flexible enough to record an authorised revision; the final customer should not have to negotiate the boundary between two suppliers or two teams. A practical test is to review a small sample of recent, non-sensitive commitments with both sides: when the commitment was made, what evidence was available, what was delivered and how any revision was communicated.",
              "Disiplina e partneritetit nis para se një problem të bëhet mosmarrëveshje. Një premtim duhet të jetë aq i saktë sa të kontrollohet, por aq fleksibël sa të shënojë një rishikim të autorizuar; klienti përfundimtar nuk duhet të detyrohet të negociojë kufirin mes dy furnizuesve apo dy ekipeve. Një provë praktike është të rishikohet me të dyja palët një mostër e vogël angazhimesh të fundit, jo të ndjeshme: kur u bë angazhimi, çfarë prove kishte, çfarë u dorëzua dhe si u komunikua çdo rishikim.",
              "Partnerschaftliche Disziplin beginnt, bevor ein Problem zum Streit wird. Eine Zusage sollte genau genug sein, um geprüft zu werden, und flexibel genug, um eine befugte Änderung festzuhalten; der Endkunde sollte nicht die Grenze zwischen zwei Lieferanten oder zwei Teams aushandeln müssen. Ein praktischer Test: mit beiden Seiten eine kleine Stichprobe jüngerer, unsensibler Zusagen durchgehen, wann sie gemacht wurde, welche Belege vorlagen, was geliefert wurde und wie eine Änderung mitgeteilt wurde.") },
            { type: "steps", items: [
              { h: x("Define the output", "Përcakto rezultatin", "Das Ergebnis festlegen"), p: x("Specify quantity, service, agreed date and acceptance criteria.", "Saktëso sasinë, shërbimin, datën e rënë dakord dhe kriteret e pranimit.", "Menge, Leistung, vereinbarten Termin und Abnahmekriterien angeben.") },
              { h: x("Verify the dependency", "Verifiko varësinë", "Die Abhängigkeit prüfen"), p: x("Confirm the capacity or input supplied by the other organisation.", "Konfirmo kapacitetin ose inputin që jep organizata tjetër.", "Kapazität oder Vorleistung der anderen Organisation bestätigen.") },
              { h: x("Assign the contact", "Cakto kontaktin", "Den Kontakt benennen"), p: x("Name a role on both sides, with a lawful escalation route.", "Emërto një rol në të dyja anët, me një rrugë të ligjshme eskalimi.", "Auf beiden Seiten eine Rolle benennen, mit rechtmäßigem Eskalationsweg.") },
              { h: x("Record revisions", "Shëno rishikimet", "Änderungen festhalten"), p: x("Keep one authorised version of a changed commitment.", "Mbaj një version të vetëm të autorizuar të angazhimit të ndryshuar.", "Eine einzige befugte Fassung der geänderten Zusage führen.") },
              { h: x("Close the loop", "Mbylle ciklin", "Den Kreis schließen"), p: x("Confirm the result with the recipient, not only the sender.", "Konfirmoje rezultatin me marrësin, jo vetëm me dërguesin.", "Das Ergebnis beim Empfänger bestätigen, nicht nur beim Absender.") },
            ] },
            { type: "p", text: x(
              "A relationship that always relies on one personal phone call may work today but remain fragile during absence or peak volume.",
              "Një marrëdhënie që mbështetet gjithmonë te një telefonatë personale mund të funksionojë sot, por mbetet e brishtë gjatë mungesave ose vëllimit të lartë.",
              "Eine Beziehung, die immer an einem persönlichen Anruf hängt, kann heute funktionieren und bei Abwesenheit oder Spitzenlast doch brüchig bleiben.") },
            { type: "callout", reading: true, text: x(
              "If the promise cannot be checked by both sides, it is not yet an operational standard.",
              "Nëse premtimi nuk mund të kontrollohet nga të dyja palët, ende nuk është standard operacional.",
              "Wenn beide Seiten die Zusage nicht prüfen können, ist sie noch kein betrieblicher Standard.") },
          ],
          note: x(
            "Editorial protocol inspired by Anderson and Narus (1990) and Ring and Van de Ven (1994); not a company procedure.",
            "Protokoll editorial i frymëzuar nga Anderson e Narus (1990) dhe Ring e Van de Ven (1994); jo procedurë kompanie.",
            "Redaktionelles Protokoll nach Anderson und Narus (1990) und Ring und Van de Ven (1994); kein Firmenverfahren."),
          source: ["anderson-narus-1990", "ring-van-de-ven-1994"],
        },
      ],
    },

    // Chapter II. The limits of the contract
    {
      id: "ch-ii", type: "chapter", numeral: "II",
      title: x("The limits of the contract", "Kufijtë e kontratës", "Die Grenzen des Vertrags"),
      pages: [
        {
          id: "ii-scene", layer: "scene", more: "80-vehicles-you-cannot-see",
          title: [x("A clause cannot", "Një klauzolë nuk e", "Eine Klausel"), x("drive the route", "drejton dot rrugën", "fährt keine Tour")],
          lead: x(
            "A detailed contract is necessary in some settings. It does not operate the next decision for people.",
            "Në disa mjedise një kontratë e hollësishme është e domosdoshme. Por nuk e merr ajo vendimin e radhës në vend të njerëzve.",
            "Ein ausführlicher Vertrag ist in manchen Lagen nötig. Die nächste Entscheidung trifft er nicht für die Menschen."),
          blocks: [
            { type: "flag", text: x("Hypothetical transport scene, no actual partner or contract identified", "Skenë hipotetike transporti, pa partner apo kontratë reale të identifikuar", "Hypothetische Transportszene, kein echter Partner und kein echter Vertrag") },
            { type: "p", text: x(
              "A delivery operation has service expectations agreed with an external partner. A vehicle becomes unavailable shortly before departure. The local dispatcher needs an updated resource plan. One side asks for immediate confirmation; the other must verify what is feasible. Both know the service outcome matters, yet the operational answer cannot be produced by reading a contract aloud. A contract can establish duties, service levels, notice requirements, remedies and boundaries of authority. It cannot specify every combination of traffic, resource availability and last-minute demand, nor guarantee that the person answering the telephone knows the operational state at that moment. The missing ingredient is a repeatable coordination routine that operates inside the contractual framework.",
              "Një operacion dorëzimi ka pritshmëri shërbimi të rëna dakord me një partner të jashtëm. Pak para nisjes, një automjet bëhet i padisponueshëm. Dispeçeri lokal ka nevojë për një plan të përditësuar burimesh. Njëra palë kërkon konfirmim të menjëhershëm; tjetra duhet të verifikojë çfarë është e mundur. Të dyja e dinë se rezultati i shërbimit ka rëndësi, por përgjigjja operacionale nuk del duke lexuar me zë kontratën. Një kontratë mund të caktojë detyrimet, nivelet e shërbimit, afatet e njoftimit, zgjidhjet dhe kufijtë e autoritetit. Nuk mund të parashikojë çdo kombinim trafiku, burimesh të disponueshme dhe kërkese të minutës së fundit, as të garantojë se personi që përgjigjet në telefon e di gjendjen operacionale në atë çast. Përbërësi që mungon është një rutinë koordinimi e përsëritshme që vepron brenda kornizës së kontratës.",
              "Ein Zustellbetrieb hat mit einem externen Partner Leistungserwartungen vereinbart. Kurz vor der Abfahrt fällt ein Fahrzeug aus. Die örtliche Disposition braucht einen neuen Ressourcenplan. Eine Seite verlangt sofortige Bestätigung; die andere muss prüfen, was machbar ist. Beide wissen, dass das Ergebnis zählt, doch die betriebliche Antwort entsteht nicht, indem man den Vertrag vorliest. Ein Vertrag kann Pflichten, Servicelevel, Meldefristen, Abhilfen und Grenzen der Befugnis festlegen. Er kann nicht jede Kombination aus Verkehr, verfügbaren Ressourcen und kurzfristiger Nachfrage vorwegnehmen und nicht garantieren, dass die Person am Telefon den betrieblichen Stand in diesem Moment kennt. Was fehlt, ist eine wiederholbare Koordinationsroutine, die innerhalb des vertraglichen Rahmens arbeitet.") },
            { type: "p", text: x(
              "The scenario is constructed and reveals no live route, company, vehicle or agreement. Its point is not that contracts are bad. Without clear formal obligations a partnership can depend on personal goodwill and become impossible to govern fairly. The danger is treating the written instrument as a substitute for the daily relationships through which information reaches decisions. The managerial question becomes more precise: what should the contract define, and what should the operating team maintain through routine communication? Over-specifying ordinary collaboration may make escalation mechanical; under-specifying authority can leave a critical decision with someone not permitted to make it.",
              "Skenari është i ndërtuar dhe nuk zbulon asnjë rrugë, kompani, automjet apo marrëveshje reale. Pika e tij nuk është se kontratat janë të këqija. Pa detyrime formale të qarta, një partneritet mund të varet nga vullneti i mirë personal dhe të bëhet i pamundur për t'u qeverisur me drejtësi. Rreziku është ta trajtosh dokumentin e shkruar si zëvendësues të marrëdhënieve të përditshme përmes të cilave informacioni arrin te vendimet. Pyetja menaxheriale bëhet më e saktë: çfarë duhet të përcaktojë kontrata, dhe çfarë duhet ta mbajë ekipi operacional me komunikim rutinë? Përcaktimi i tepërt i bashkëpunimit të zakonshëm mund ta bëjë eskalimin mekanik; përcaktimi i mangët i autoritetit mund ta lërë një vendim kritik te dikush që nuk lejohet ta marrë.",
              "Das Szenario ist konstruiert und zeigt keine echte Tour, Firma, kein Fahrzeug und keine Vereinbarung. Sein Punkt ist nicht, dass Verträge schlecht wären. Ohne klare formale Pflichten kann eine Partnerschaft vom persönlichen Wohlwollen abhängen und sich nicht mehr fair steuern lassen. Die Gefahr ist, das schriftliche Instrument als Ersatz für die täglichen Beziehungen zu behandeln, über die Informationen Entscheidungen erreichen. Die Führungsfrage wird genauer: Was soll der Vertrag festlegen, und was soll das Betriebsteam durch Routinekommunikation pflegen? Wer gewöhnliche Zusammenarbeit überregelt, macht Eskalation mechanisch; wer Befugnisse unterregelt, lässt eine kritische Entscheidung bei jemandem, der sie nicht treffen darf.") },
            { type: "callout", reading: true, text: x(
              "A contract allocates obligations. A working partnership also needs a reliable method for coordinating uncertainty.",
              "Kontrata i shpërndan detyrimet. Një partneritet që funksionon ka nevojë edhe për një mënyrë të besueshme për ta koordinuar pasigurinë.",
              "Ein Vertrag verteilt Pflichten. Eine funktionierende Partnerschaft braucht auch eine verlässliche Art, Unsicherheit zu koordinieren.") },
          ],
          note: x(
            "Scene hypothetical. Williamson (1979); Poppo and Zenger (2002). The essay named below is about coordinating vehicles you cannot see.",
            "Skenë hipotetike. Williamson (1979); Poppo e Zenger (2002). Eseja e emërtuar më poshtë flet për koordinimin e automjeteve që nuk i sheh.",
            "Hypothetische Szene. Williamson (1979); Poppo und Zenger (2002). Der unten genannte Essay handelt davon, Fahrzeuge zu koordinieren, die man nicht sieht."),
          source: ["williamson-1979", "poppo-zenger-2002"],
        },
        {
          id: "ii-concept", layer: "concept",
          title: [x("Governance beyond", "Qeverisja përtej", "Steuerung jenseits"), x("the signatures", "nënshkrimeve", "der Unterschriften")],
          lead: x(
            "Transactional safeguards and relational routines solve different aspects of the same problem.",
            "Mbrojtjet transaksionale dhe rutinat relacionale zgjidhin anë të ndryshme të të njëjtit problem.",
            "Transaktionale Absicherung und relationale Routinen lösen verschiedene Seiten desselben Problems."),
          blocks: [
            { type: "p", text: x(
              "Williamson's transaction-cost approach (1979) directs attention to the uncertainty of an exchange, how often it recurs and how far it requires investments specific to one relationship. When one organisation invests in arrangements useful mainly for a particular partner, its exposure grows, and formal safeguards may matter more. That does not make relational processes irrelevant. Poppo and Zenger (2002) tested whether formal contracts and relational governance work as substitutes or complements. In a sample of information-services exchanges they found support for complementarity: managers coupled increasingly customised contracts with higher levels of relational governance, and that interdependence was associated with better exchange performance. The sample and context matter; it would be wrong to conclude that more contract pages always raise trust in a delivery operation.",
              "Qasja e kostos së transaksionit e Williamson-it (1979) e drejton vëmendjen te pasiguria e një shkëmbimi, sa shpesh përsëritet dhe sa kërkon investime të veçanta për një marrëdhënie të vetme. Kur një organizatë investon në rregullime të dobishme kryesisht për një partner të caktuar, ekspozimi i saj rritet dhe mbrojtjet formale mund të kenë më shumë rëndësi. Kjo nuk i bën proceset relacionale të parëndësishme. Poppo dhe Zenger (2002) provuan nëse kontratat formale dhe qeverisja relacionale veprojnë si zëvendësues apo si plotësues. Në një mostër shkëmbimesh shërbimesh informatike gjetën mbështetje për plotësueshmërinë: menaxherët i çiftonin kontratat gjithnjë e më të personalizuara me nivele më të larta qeverisjeje relacionale, dhe ajo ndërvarësi shoqërohej me performancë më të mirë të shkëmbimit. Mostra dhe konteksti kanë rëndësi; do të ishte gabim të përfundohej se më shumë faqe kontrate e rrisin gjithmonë besimin në një operacion dorëzimi.",
              "Der Transaktionskostenansatz von Williamson (1979) lenkt den Blick auf die Unsicherheit eines Austauschs, darauf, wie oft er wiederkehrt, und wie weit er beziehungsspezifische Investitionen verlangt. Investiert eine Organisation in Vorkehrungen, die vor allem für einen bestimmten Partner nützen, wächst ihr Risiko, und formale Absicherung kann wichtiger werden. Das macht relationale Prozesse nicht bedeutungslos. Poppo und Zenger (2002) prüften, ob formale Verträge und relationale Steuerung einander ersetzen oder ergänzen. In einer Stichprobe von IT-Dienstleistungsbeziehungen fanden sie Belege für Ergänzung: Führungskräfte koppelten zunehmend maßgeschneiderte Verträge an mehr relationale Steuerung, und diese Wechselwirkung ging mit besserer Austauschleistung einher. Stichprobe und Kontext zählen; daraus folgt nicht, dass mehr Vertragsseiten in einem Zustellbetrieb immer mehr Vertrauen schaffen.") },
            { type: "p", text: x(
              "The distinction is functional. The written contract clarifies expectations, liability and authorised remedies; relational governance provides cooperative norms, information sharing and practical adjustment when unforeseen events occur. Neither is naturally unlimited: excessive flexibility can make requirements uncertain, excessive control can make an adjustment needlessly adversarial. The question is not contract or trust, but whether the agreement and the working routines reinforce the same outcome.",
              "Dallimi është funksional. Kontrata e shkruar i sqaron pritshmëritë, përgjegjësinë dhe zgjidhjet e autorizuara; qeverisja relacionale sjell norma bashkëpunimi, ndarje informacioni dhe përshtatje praktike kur ndodhin ngjarje të paparashikuara. Asnjëra nuk është pa kufi: fleksibiliteti i tepërt mund t'i bëjë kërkesat të paqarta, kontrolli i tepërt mund ta bëjë një përshtatje armiqësore pa nevojë. Pyetja nuk është kontratë apo besim, por nëse marrëveshja dhe rutinat e punës e përforcojnë të njëjtin rezultat.",
              "Die Unterscheidung ist funktional. Der schriftliche Vertrag klärt Erwartungen, Haftung und befugte Abhilfen; relationale Steuerung bringt kooperative Normen, Informationsaustausch und praktische Anpassung, wenn Unvorhergesehenes eintritt. Keines ist von Natur aus grenzenlos: Zu viel Flexibilität macht Anforderungen unklar, zu viel Kontrolle macht eine Anpassung unnötig gegnerisch. Die Frage ist nicht Vertrag oder Vertrauen, sondern ob Vereinbarung und Arbeitsroutinen dasselbe Ergebnis stützen.") },
            { type: "cards", cols: 3, items: [
              { h: x("Formal · boundaries", "Formale · kufij", "Formal · Grenzen"), p: x("Clear obligations, decision rights and authorised remedies.", "Detyrime të qarta, të drejta vendimi dhe zgjidhje të autorizuara.", "Klare Pflichten, Entscheidungsrechte und befugte Abhilfen.") },
              { h: x("Relational · coordination", "Relacionale · koordinim", "Relational · Koordination"), p: x("Timely updates, joint problem framing and fair adjustments.", "Përditësime në kohë, përcaktim i përbashkët i problemit dhe përshtatje të drejta.", "Rechtzeitige Updates, gemeinsame Problemsicht, faire Anpassungen.") },
              { h: x("Combined · reliability", "Bashkë · besueshmëri", "Gemeinsam · Verlässlichkeit"), p: x("Compatible rules and routines tested by actual performance.", "Rregulla dhe rutina të përputhshme, të provuara nga performanca reale.", "Vereinbare Regeln und Routinen, an echter Leistung geprüft.") },
            ] },
          ],
          note: x(
            "Williamson (1979), Journal of Law and Economics 22(2); Poppo and Zenger (2002), Strategic Management Journal 23(8). Findings from other sectors are not universal effect estimates.",
            "Williamson (1979), Journal of Law and Economics 22(2); Poppo e Zenger (2002), Strategic Management Journal 23(8). Gjetjet nga sektorë të tjerë nuk janë vlerësime universale efekti.",
            "Williamson (1979), Journal of Law and Economics 22(2); Poppo und Zenger (2002), Strategic Management Journal 23(8). Befunde aus anderen Branchen sind keine universellen Effektschätzungen."),
          source: ["williamson-1979", "poppo-zenger-2002"],
        },
        {
          id: "ii-evidence", layer: "concept",
          title: [x("When control changes", "Kur kontrolli e ndryshon", "Wenn Kontrolle das"), x("the conversation", "bisedën", "Gespräch verändert")],
          lead: x(
            "The role of a clause can matter as much as its existence.",
            "Roli i një klauzole mund të ketë po aq rëndësi sa ekzistenca e saj.",
            "Die Funktion einer Klausel kann so viel zählen wie ihr Vorhandensein."),
          blocks: [
            { type: "p", text: x(
              "A later study complicates the simple claim that contract and trust always reinforce each other. Lumineau and Henderson (2012) analysed buyer-supplier disputes, distinguishing contractual coordination from contractual control and cooperative from competitive relational experience. Their data were 99 two-party supply-chain disputes from the files of one French law firm. Coordination clauses reinforced the positive link between a cooperative history and a cooperative negotiation strategy. Stronger contractual control weakened that link; where the history had been competitive, more control was associated with more cooperative negotiation. The result is a contingent finding about one dispute dataset, not a global verdict against formal governance.",
              "Një studim i mëvonshëm e ndërlikon pohimin e thjeshtë se kontrata dhe besimi gjithmonë përforcojnë njëra-tjetrën. Lumineau dhe Henderson (2012) analizuan mosmarrëveshje blerës-furnizues, duke dalluar koordinimin kontraktual nga kontrolli kontraktual dhe përvojën relacionale bashkëpunuese nga ajo konkurruese. Të dhënat e tyre ishin 99 mosmarrëveshje me dy palë në zinxhirin e furnizimit, nga dosjet e një firme ligjore franceze. Klauzolat e koordinimit e përforconin lidhjen pozitive mes një historie bashkëpunimi dhe një strategjie negocimi bashkëpunuese. Kontrolli kontraktual më i fortë e dobësonte atë lidhje; aty ku historia kishte qenë konkurruese, më shumë kontroll shoqërohej me negocim më bashkëpunues. Rezultati është gjetje e kushtëzuar për një grup të vetëm mosmarrëveshjesh, jo vendim global kundër qeverisjes formale.",
              "Eine spätere Studie verkompliziert die einfache Behauptung, Vertrag und Vertrauen verstärkten einander immer. Lumineau und Henderson (2012) analysierten Streitfälle zwischen Käufern und Lieferanten und unterschieden vertragliche Koordination von vertraglicher Kontrolle sowie kooperative von kompetitiver Beziehungserfahrung. Ihre Daten waren 99 Zwei-Parteien-Streitfälle aus Lieferbeziehungen in den Akten einer französischen Kanzlei. Koordinationsklauseln verstärkten den positiven Zusammenhang zwischen kooperativer Vorgeschichte und kooperativer Verhandlungsstrategie. Stärkere vertragliche Kontrolle schwächte ihn; war die Vorgeschichte kompetitiv, ging mehr Kontrolle mit kooperativerem Verhandeln einher. Das ist ein bedingter Befund über einen Datensatz von Streitfällen, kein globales Urteil gegen formale Steuerung.") },
            { type: "p", text: x(
              "For a partnership review this suggests a diagnostic question: does the clause tell people how to coordinate a necessary change, or is it mainly designed to constrain unwanted behaviour? Both can be legitimate. A manager who uses a control clause as a substitute for listening may not learn what the problem requires; one who ignores a necessary safeguard in the name of trust creates another danger. A professional review examines the written rights with qualified legal input, then the everyday communication through which people use them.",
              "Për një rishikim partneriteti kjo sugjeron një pyetje diagnostikuese: a u tregon klauzola njerëzve si ta koordinojnë një ndryshim të nevojshëm, apo është ndërtuar kryesisht për të frenuar sjellje të padëshiruar? Të dyja mund të jenë të ligjshme. Një menaxher që e përdor një klauzolë kontrolli në vend që të dëgjojë mund të mos e mësojë çfarë kërkon problemi; ai që e shpërfill një mbrojtje të nevojshme në emër të besimit krijon një rrezik tjetër. Një rishikim profesional i shqyrton të drejtat e shkruara me ndihmë juridike të kualifikuar, pastaj komunikimin e përditshëm përmes të cilit njerëzit i përdorin.",
              "Für ein Partnerschaftsreview ergibt sich eine diagnostische Frage: Sagt die Klausel, wie eine nötige Änderung koordiniert wird, oder soll sie vor allem unerwünschtes Verhalten begrenzen? Beides kann legitim sein. Wer eine Kontrollklausel statt Zuhören einsetzt, erfährt vielleicht nicht, was das Problem verlangt; wer im Namen des Vertrauens eine nötige Absicherung übergeht, schafft eine andere Gefahr. Ein professionelles Review prüft die schriftlichen Rechte mit qualifizierter juristischer Hilfe und dann die tägliche Kommunikation, über die Menschen sie nutzen.") },
            { type: "stat", n: "99", t: x(
              "buyer-supplier disputes in an empirical study of contractual governance and negotiation strategy (Lumineau and Henderson, 2012): a study sample, not local disputes.",
              "mosmarrëveshje blerës-furnizues në një studim empirik për qeverisjen kontraktuale dhe strategjinë e negocimit (Lumineau e Henderson, 2012): mostër studimi, jo mosmarrëveshje lokale.",
              "Streitfälle zwischen Käufern und Lieferanten in einer empirischen Studie zu vertraglicher Steuerung und Verhandlungsstrategie (Lumineau und Henderson, 2012): eine Studienstichprobe, keine örtlichen Streitfälle.") },
            { type: "callout", reading: true, text: x(
              "The research warns against a universal slogan. The effect of governance depends on what it does and on relationship history.",
              "Kërkimi paralajmëron kundër një slogani universal. Efekti i qeverisjes varet nga ajo që bën dhe nga historia e marrëdhënies.",
              "Die Forschung warnt vor einem universellen Slogan. Die Wirkung von Steuerung hängt davon ab, was sie tut, und von der Geschichte der Beziehung.") },
          ],
          note: x(
            "Lumineau and Henderson (2012), Journal of Operations Management 30(5), 382–395; the sample is described in the authors' working paper.",
            "Lumineau e Henderson (2012), Journal of Operations Management 30(5), 382–395; mostra përshkruhet në versionin e punës së autorëve.",
            "Lumineau und Henderson (2012), Journal of Operations Management 30(5), 382–395; die Stichprobe beschreibt das Arbeitspapier der Autoren."),
          source: ["lumineau-henderson-2012"],
        },
        {
          id: "ii-sample", layer: "concept",
          title: [x("What the 99", "Për çfarë ishin", "Worum es in den"), x("disputes were about", "99 mosmarrëveshjet", "99 Streitfällen ging")],
          lead: x(
            "Before borrowing a finding, look at the cases it was drawn from.",
            "Para se të huazosh një gjetje, shiko rastet nga të cilat doli.",
            "Bevor man einen Befund übernimmt, lohnt der Blick auf die Fälle, aus denen er stammt."),
          blocks: [
            { type: "hbars", max: 128,
              label: x("Dispute files of one French law firm, 1991–2005", "Dosjet e mosmarrëveshjeve të një firme ligjore franceze, 1991–2005", "Streitakten einer französischen Kanzlei, 1991–2005"),
              items: [
                { k: x("Disputes examined in detail", "Mosmarrëveshje të shqyrtuara në hollësi", "Im Detail geprüfte Streitfälle"), v: 128, n: "128" },
                { k: x("Two-party supply-chain disputes kept", "Mosmarrëveshje me dy palë në zinxhirin e furnizimit, të mbajtura", "Behaltene Zwei-Parteien-Fälle aus Lieferbeziehungen"), v: 99, n: "99", alert: true },
                { k: x("Of those, only European firms", "Prej tyre, vetëm firma evropiane", "Davon nur europäische Firmen"), v: 96, n: "96" },
              ] },
            { type: "hbars", max: 40,
              label: x("Type of contract in the 99 disputes", "Lloji i kontratës në 99 mosmarrëveshjet", "Vertragsart in den 99 Streitfällen"),
              items: [
                { k: x("Distribution", "Shpërndarje", "Vertrieb"), v: 36.4, n: x("36.4%", "36,4%", "36,4 %"), alert: true },
                { k: x("Production supply", "Furnizim për prodhim", "Produktionslieferung"), v: 28.3, n: x("28.3%", "28,3%", "28,3 %") },
                { k: x("IT", "IT", "IT"), v: 26.2, n: x("26.2%", "26,2%", "26,2 %") },
                { k: x("Consulting and other services", "Konsulencë dhe shërbime të tjera", "Beratung und andere Dienste"), v: 9.1, n: x("9.1%", "9,1%", "9,1 %") },
              ] },
            { type: "p", text: x(
              "Every figure is the authors': the files ran to some 150,000 pages, contracts fell under French law, and about 46% of the cases crossed a border. Distribution is the largest group, which makes the study relevant to a wholesale reader, but it remains a sample of disputes that reached lawyers, not of partnerships that ran smoothly. It can sharpen a question about clauses; it cannot tell how often a reseller network ends in conflict.",
              "Çdo shifër është e autorëve: dosjet kishin rreth 150.000 faqe, kontratat ishin nën ligjin francez dhe rreth 46% e rasteve kalonin një kufi shtetëror. Shpërndarja është grupi më i madh, gjë që e bën studimin të rëndësishëm për një lexues të shumicës, por mbetet mostër mosmarrëveshjesh që arritën te avokatët, jo partneritetesh që ecën mirë. Mund ta mprehë një pyetje për klauzolat; nuk mund të tregojë sa shpesh një rrjet rishitësish përfundon në konflikt.",
              "Jede Zahl stammt von den Autoren: Die Akten umfassten rund 150.000 Seiten, die Verträge unterlagen französischem Recht, und etwa 46 % der Fälle waren grenzüberschreitend. Vertrieb ist die größte Gruppe, was die Studie für Großhandelsleser relevant macht, doch sie bleibt eine Stichprobe von Streitfällen, die bei Anwälten landeten, nicht von Partnerschaften, die gut liefen. Sie kann eine Frage zu Klauseln schärfen; wie oft ein Händlernetz im Konflikt endet, sagt sie nicht.") },
            ],
          note: x(
            "Lumineau and Henderson (2012), sample section of the working paper (MPRA No. 38510): 128 files examined, 99 kept, 96 with only European firms; contract types as reported.",
            "Lumineau e Henderson (2012), pjesa e mostrës në versionin e punës (MPRA nr. 38510): 128 dosje të shqyrtuara, 99 të mbajtura, 96 vetëm me firma evropiane; llojet e kontratave siç raportohen.",
            "Lumineau und Henderson (2012), Stichprobenteil des Arbeitspapiers (MPRA Nr. 38510): 128 Akten geprüft, 99 behalten, 96 nur mit europäischen Firmen; Vertragsarten wie berichtet."),
          source: ["lumineau-henderson-2012"],
        },
        {
          id: "ii-protocol", layer: "protocol",
          title: [x("Build two layers", "Ndërto dy shtresa", "Zwei Ebenen bauen,"), x("that agree", "që pajtohen", "die übereinstimmen")],
          lead: x(
            "Formal rights should support, not conflict with, the daily operating method.",
            "Të drejtat formale duhet ta mbështesin metodën e përditshme të punës, jo të bien ndesh me të.",
            "Formale Rechte sollen die tägliche Arbeitsweise stützen, nicht ihr widersprechen."),
          blocks: [
            { type: "p", text: x(
              "A workable governance review distinguishes changing a task from changing an agreement. The former may be permitted within everyday responsibilities; the latter may require an authorised signatory. Treating them alike leads to needless waiting or unauthorised promises. The checklist below is for a joint review under proper contractual and data-protection controls; it is not a sample contract.",
              "Një rishikim qeverisjeje që funksionon e dallon ndryshimin e një detyre nga ndryshimi i një marrëveshjeje. I pari mund të lejohet brenda përgjegjësive të përditshme; i dyti mund të kërkojë një nënshkrues të autorizuar. Trajtimi i tyre njësoj çon në pritje të panevojshme ose në premtime të paautorizuara. Lista më poshtë është për një rishikim të përbashkët me kontrollet e duhura kontraktuale dhe të mbrojtjes së të dhënave; nuk është model kontrate.",
              "Ein tragfähiges Steuerungsreview unterscheidet die Änderung einer Aufgabe von der Änderung einer Vereinbarung. Das Erste kann im Alltag erlaubt sein; das Zweite kann eine zeichnungsberechtigte Person verlangen. Wer beides gleich behandelt, landet bei unnötigem Warten oder unbefugten Zusagen. Die Liste unten dient einem gemeinsamen Review mit passenden vertraglichen und datenschutzrechtlichen Kontrollen; sie ist kein Mustervertrag.") },
            { type: "steps", items: [
              { h: x("Map obligations", "Hartëzo detyrimet", "Pflichten erfassen"), p: x("List outputs, verification criteria and owners without revealing confidential rates.", "Listo rezultatet, kriteret e verifikimit dhe pronarët pa zbuluar tarifa konfidenciale.", "Ergebnisse, Prüfkriterien und Verantwortliche auflisten, ohne vertrauliche Preise.") },
              { h: x("Name decision rights", "Emërto të drejtat e vendimit", "Entscheidungsrechte benennen"), p: x("Distinguish routine coordination from contractual variation.", "Dallo koordinimin rutinë nga ndryshimi i kontratës.", "Routinekoordination von Vertragsänderung trennen.") },
              { h: x("Provide an exception route", "Krijo një rrugë për përjashtimet", "Einen Ausnahmeweg schaffen"), p: x("Document whom to contact when normal performance cannot be achieved.", "Shëno kë kontakton kur performanca normale nuk arrihet.", "Festhalten, wen man anspricht, wenn die normale Leistung nicht erreichbar ist.") },
              { h: x("Separate control and coordination", "Ndaj kontrollin nga koordinimi", "Kontrolle und Koordination trennen"), p: x("Keep necessary safeguards while enabling timely shared information.", "Mbaji mbrojtjet e nevojshme dhe lejo informacion të përbashkët në kohë.", "Nötige Absicherung behalten und zeitnahe geteilte Information ermöglichen.") },
              { h: x("Test an ordinary case", "Provo një rast të zakonshëm", "Einen gewöhnlichen Fall prüfen"), p: x("Follow one non-sensitive promise from request to confirmation.", "Ndiq një premtim jo të ndjeshëm nga kërkesa te konfirmimi.", "Eine unsensible Zusage von der Anfrage bis zur Bestätigung verfolgen.") },
              { h: x("Review a disagreement", "Rishiko një mosmarrëveshje", "Eine Meinungsverschiedenheit prüfen"), p: x("Ask whether records and roles enable an evidence-based resolution.", "Pyet nëse regjistrat dhe rolet lejojnë një zgjidhje të bazuar në prova.", "Fragen, ob Unterlagen und Rollen eine belegbasierte Lösung erlauben.") },
            ] },
            { type: "callout", reading: true, text: x(
              "The best operating contract is one people can act within, while recognising what they cannot authorise.",
              "Kontrata më e mirë operacionale është ajo brenda së cilës njerëzit mund të veprojnë, duke e ditur çfarë nuk mund të autorizojnë.",
              "Der beste Betriebsvertrag ist einer, in dem Menschen handeln können und zugleich wissen, was sie nicht freigeben dürfen.") },
          ],
          note: x(
            "Editorial design informed by Williamson (1979), Poppo and Zenger (2002) and Lumineau and Henderson (2012); not legal advice.",
            "Projektim editorial i mbështetur te Williamson (1979), Poppo e Zenger (2002) dhe Lumineau e Henderson (2012); jo këshillë ligjore.",
            "Redaktioneller Entwurf nach Williamson (1979), Poppo und Zenger (2002) sowie Lumineau und Henderson (2012); keine Rechtsberatung."),
          source: ["williamson-1979", "poppo-zenger-2002", "lumineau-henderson-2012"],
        },
      ],
    },

    // Chapter III. Trust is an operating asset
    {
      id: "ch-iii", type: "chapter", numeral: "III",
      title: x("Trust is an operating asset", "Besimi është aset operacional", "Vertrauen ist ein Betriebsgut"),
      pages: [
        {
          id: "iii-scene", layer: "scene", more: "61-resellers",
          title: [x("The call that", "Telefonata që", "Der Anruf, der"), x("needs no command", "s'ka nevojë për urdhër", "keinen Befehl braucht")],
          lead: x(
            "Trust can make coordination easier, but should not make critical knowledge undocumented.",
            "Besimi mund ta lehtësojë koordinimin, por nuk duhet ta lërë dijen kritike pa u dokumentuar.",
            "Vertrauen kann Koordination erleichtern, darf aber kritisches Wissen nicht undokumentiert lassen."),
          blocks: [
            { type: "flag", text: x("Composite reseller scene, not a transcript or verified incident", "Skenë e përbërë me rishitës, jo transkript apo ngjarje e verifikuar", "Zusammengesetzte Händlerszene, kein Protokoll und kein geprüfter Vorfall") },
            { type: "p", text: x(
              "An established reseller calls to ask whether a planned delivery is still realistic. The commercial contact does not know every warehouse constraint, but gives an honest provisional answer and promises a confirmed update. The reseller accepts the uncertainty because similar questions have received clear responses before. The exchange is short; neither side needs a lengthy performance of confidence. A new reseller might reasonably demand more detail. The two relationships may have identical formal conditions and different histories of coordination. Trust, in this sense, is not simply liking the other person. It is a working expectation that an organisation will do what it says, acknowledge what it does not know and correct the record when circumstances change.",
              "Një rishitës i vjetër telefonon për të pyetur nëse një dorëzim i planifikuar është ende realist. Kontakti tregtar nuk i di të gjitha kufizimet e magazinës, por jep një përgjigje paraprake të ndershme dhe premton një përditësim të konfirmuar. Rishitësi e pranon pasigurinë, sepse pyetje të ngjashme kanë marrë më parë përgjigje të qarta. Biseda është e shkurtër; asnjëra palë nuk ka nevojë për një shfaqje të gjatë sigurie. Një rishitës i ri me të drejtë mund të kërkonte më shumë hollësi. Dy marrëdhëniet mund të kenë kushte formale të njëjta dhe histori koordinimi të ndryshme. Besimi, në këtë kuptim, nuk është thjesht pëlqimi i personit tjetër. Është pritshmëria e punës se një organizatë do të bëjë atë që thotë, do ta pranojë atë që nuk e di dhe do ta korrigjojë regjistrin kur rrethanat ndryshojnë.",
              "Ein langjähriger Wiederverkäufer ruft an und fragt, ob eine geplante Lieferung noch realistisch ist. Der Vertriebskontakt kennt nicht jede Lagergrenze, gibt aber eine ehrliche vorläufige Antwort und verspricht ein bestätigtes Update. Der Wiederverkäufer akzeptiert die Unsicherheit, weil ähnliche Fragen früher klare Antworten bekamen. Das Gespräch ist kurz; keine Seite braucht eine lange Vorführung von Zuversicht. Ein neuer Wiederverkäufer dürfte zu Recht mehr Einzelheiten verlangen. Beide Beziehungen können gleiche formale Bedingungen und verschiedene Koordinationsgeschichten haben. Vertrauen heißt hier nicht bloß, die andere Person zu mögen. Es ist die Arbeitserwartung, dass eine Organisation tut, was sie sagt, zugibt, was sie nicht weiß, und den Stand korrigiert, wenn sich die Lage ändert.") },
            { type: "p", text: x(
              "The scene is hypothetical. The author's experience managing a network of 61 resellers is confirmed; the specific call and its outcome are not. Trust can also be dangerously concentrated. If only one experienced contact knows how a reseller prefers updates, the shared process may break when that person leaves. A mature partnership translates useful relational knowledge into legitimate, accessible routines without exposing personal or sensitive information. Credibility grows when an honest 'not confirmed yet' is followed by a reliable confirmation, not by an unsupported promise.",
              "Skena është hipotetike. Përvoja e autorit në drejtimin e një rrjeti me 61 rishitës është e konfirmuar; telefonata e veçantë dhe përfundimi i saj jo. Besimi mund të jetë edhe rrezikshëm i përqendruar. Nëse vetëm një kontakt me përvojë e di si i do përditësimet një rishitës, procesi i përbashkët mund të prishet kur ai person largohet. Një partneritet i pjekur e kthen dijen e dobishme relacionale në rutina të ligjshme e të arritshme, pa ekspozuar informacion personal apo të ndjeshëm. Besueshmëria rritet kur një \"ende i pakonfirmuar\" i ndershëm pasohet nga një konfirmim i besueshëm, jo nga një premtim pa mbështetje.",
              "Die Szene ist hypothetisch. Die Erfahrung des Autors mit einem Netz von 61 Wiederverkäufern ist bestätigt, der konkrete Anruf und sein Ausgang nicht. Vertrauen kann auch gefährlich gebündelt sein. Weiß nur ein erfahrener Kontakt, wie ein Wiederverkäufer Updates bevorzugt, kann der gemeinsame Ablauf brechen, wenn diese Person geht. Eine reife Partnerschaft übersetzt nützliches Beziehungswissen in legitime, zugängliche Routinen, ohne persönliche oder sensible Informationen preiszugeben. Glaubwürdigkeit wächst, wenn auf ein ehrliches „noch nicht bestätigt“ eine verlässliche Bestätigung folgt und keine unbelegte Zusage.") },
            { type: "callout", reading: true, text: x(
              "Trust is operational when it changes what both sides can reasonably expect and verify, not when it removes the need to verify.",
              "Besimi është operacional kur ndryshon atë që të dyja palët mund të presin dhe të verifikojnë me arsye, jo kur e heq nevojën për verifikim.",
              "Vertrauen ist betrieblich, wenn es verändert, was beide Seiten vernünftig erwarten und prüfen können, nicht wenn es das Prüfen überflüssig macht.") },
          ],
          note: x(
            "Constructed illustration. Anderson and Narus (1990); Zaheer, McEvily and Perrone (1998). The essay named below is the author's own account of 61 resellers and trust.",
            "Ilustrim i ndërtuar. Anderson e Narus (1990); Zaheer, McEvily e Perrone (1998). Eseja e emërtuar më poshtë është rrëfimi i vetë autorit për 61 rishitësit dhe besimin.",
            "Konstruierte Veranschaulichung. Anderson und Narus (1990); Zaheer, McEvily und Perrone (1998). Der unten genannte Essay ist der eigene Bericht des Autors über 61 Wiederverkäufer und Vertrauen."),
          source: ["anderson-narus-1990", "zaheer-mcevily-perrone-1998"],
        },
        {
          id: "iii-evidence", layer: "concept",
          title: [x("Two different", "Dy nivele", "Zwei verschiedene"), x("levels of trust", "të ndryshme besimi", "Ebenen des Vertrauens")],
          lead: x(
            "A helpful person and a dependable organisation are related but not interchangeable.",
            "Një person i gatshëm për të ndihmuar dhe një organizatë e besueshme lidhen, por nuk zëvendësojnë njëra-tjetrën.",
            "Eine hilfsbereite Person und eine verlässliche Organisation hängen zusammen, sind aber nicht austauschbar."),
          blocks: [
            { type: "p", text: x(
              "Zaheer, McEvily and Perrone (1998) investigated interorganisational and interpersonal trust using data from 107 buyer-supplier relationships in electrical-equipment manufacturing. They defined the two as distinct constructs and examined their effects on negotiation costs, conflict and performance with a structural equation model. The two levels proved related but distinct and played different roles, and the link from trust to performance received some support, though not quite in the form first proposed. An individual may trust a particular sales representative; the partner organisation must also trust that agreed information will survive a holiday, a staff change or a transfer between departments. These are different units of analysis. A team can employ a respected contact and still run an unreliable fulfilment system.",
              "Zaheer, McEvily dhe Perrone (1998) studiuan besimin ndërorganizativ dhe atë ndërpersonal me të dhëna nga 107 marrëdhënie blerës-furnizues në prodhimin e pajisjeve elektrike. I përcaktuan të dyja si koncepte të dallueshme dhe i shqyrtuan efektet e tyre te kostot e negocimit, konflikti dhe performanca me një model ekuacionesh strukturore. Dy nivelet dolën të lidhura, por të dallueshme, me role të ndryshme, dhe lidhja nga besimi te performanca mori njëfarë mbështetjeje, megjithëse jo saktësisht në formën e propozuar në fillim. Një individ mund t'i besojë një përfaqësuesi të caktuar shitjesh; organizata partnere duhet t'i besojë edhe faktit që informacioni i rënë dakord do t'i mbijetojë një pushimi, një ndryshimi stafi apo një kalimi mes departamenteve. Këto janë njësi të ndryshme analize. Një ekip mund të ketë një kontakt të respektuar dhe prapë të drejtojë një sistem përmbushjeje të pabesueshëm.",
              "Zaheer, McEvily und Perrone (1998) untersuchten interorganisationales und interpersonales Vertrauen mit Daten aus 107 Käufer-Lieferanten-Beziehungen in der Elektrogeräteherstellung. Sie definierten beide als getrennte Konstrukte und prüften mit einem Strukturgleichungsmodell ihre Wirkung auf Verhandlungskosten, Konflikt und Leistung. Beide Ebenen erwiesen sich als verwandt, aber verschieden, mit unterschiedlichen Rollen, und der Zusammenhang von Vertrauen und Leistung fand teilweise Bestätigung, wenn auch nicht ganz in der zuerst vorgeschlagenen Form. Eine Person kann einem bestimmten Vertriebsmitarbeiter vertrauen; die Partnerorganisation muss außerdem darauf vertrauen, dass vereinbarte Informationen einen Urlaub, einen Personalwechsel oder eine Übergabe zwischen Abteilungen überstehen. Das sind verschiedene Analyseeinheiten. Ein Team kann einen geschätzten Kontakt haben und trotzdem ein unzuverlässiges Erfüllungssystem betreiben.") },
            { type: "p", text: x(
              "The study offers a useful question for a distributor network: if one relationship manager left today, could the reseller still obtain the same verified answer from the organisation? That cannot be answered by measuring friendliness; it requires evidence from response times, dispute resolution, handover quality and fulfilment records collected through approved channels. Nor should the evidence be pushed beyond its context: 107 industrial relationships are not 107 resellers in Albania.",
              "Studimi jep një pyetje të dobishme për një rrjet shpërndarjeje: nëse një menaxher marrëdhëniesh do të largohej sot, a do ta merrte rishitësi ende të njëjtën përgjigje të verifikuar nga organizata? Kësaj nuk i përgjigjesh duke matur përzemërsinë; duhen prova nga kohët e përgjigjes, zgjidhja e mosmarrëveshjeve, cilësia e dorëzimit të punës dhe regjistrat e përmbushjes, të mbledhura përmes kanaleve të miratuara. As prova nuk duhet shtyrë përtej kontekstit të saj: 107 marrëdhënie industriale nuk janë 107 rishitës në Shqipëri.",
              "Die Studie liefert eine nützliche Frage für ein Händlernetz: Wenn ein Beziehungsmanager heute ginge, bekäme der Wiederverkäufer von der Organisation noch dieselbe geprüfte Antwort? Freundlichkeit zu messen beantwortet das nicht; es braucht Belege aus Antwortzeiten, Konfliktlösung, Übergabequalität und Erfüllungsdaten, erhoben über genehmigte Kanäle. Auch dürfen die Belege nicht über ihren Kontext hinaus gedehnt werden: 107 Industriebeziehungen sind nicht 107 Wiederverkäufer in Albanien.") },
            { type: "stat", n: "107", t: x(
              "buyer-supplier relationships analysed for interpersonal and interorganisational trust (Zaheer, McEvily and Perrone, Organization Science, 1998).",
              "marrëdhënie blerës-furnizues të analizuara për besimin ndërpersonal dhe ndërorganizativ (Zaheer, McEvily e Perrone, Organization Science, 1998).",
              "Käufer-Lieferanten-Beziehungen, auf interpersonales und interorganisationales Vertrauen untersucht (Zaheer, McEvily und Perrone, Organization Science, 1998).") },
            { type: "callout", reading: true, text: x(
              "A trusted representative is valuable. A trustworthy process is harder to replace and more resilient.",
              "Një përfaqësues i besuar ka vlerë. Një proces i besueshëm zëvendësohet më vështirë dhe është më qëndrueshëm.",
              "Ein vertrauenswürdiger Ansprechpartner ist wertvoll. Ein vertrauenswürdiger Prozess ist schwerer zu ersetzen und belastbarer.") },
          ],
          note: x(
            "Zaheer, McEvily and Perrone (1998), Organization Science 9(2), 141–159.",
            "Zaheer, McEvily e Perrone (1998), Organization Science 9(2), 141–159.",
            "Zaheer, McEvily und Perrone (1998), Organization Science 9(2), 141–159."),
          source: ["zaheer-mcevily-perrone-1998"],
        },
        {
          id: "iii-concept", layer: "concept",
          title: [x("Four sources of", "Katër burime", "Vier Quellen"), x("shared advantage", "të avantazhit të përbashkët", "gemeinsamen Vorteils")],
          lead: x(
            "The relationship between firms can hold capabilities that neither side owns alone.",
            "Marrëdhënia mes firmave mund të mbajë aftësi që asnjëra palë nuk i zotëron vetëm.",
            "Die Beziehung zwischen Firmen kann Fähigkeiten tragen, die keine Seite allein besitzt."),
          blocks: [
            { type: "p", text: x(
              "Dyer and Singh (1998) proposed the relational view of competitive advantage: some valuable resources and routines live across company boundaries. They name four potential sources of relational rents: relation-specific assets, knowledge-sharing routines, complementary resources and capabilities, and effective governance. The first needs care, because an investment valuable to one trading relationship can improve performance and also create dependence. The second concerns repeated ways of exchanging useful know-how, the third capacities that work well together, the fourth the mechanisms that protect cooperation and limit unnecessary transaction costs. This is a conceptual framework, not an empirical claim that every partner network has all four, and not a promise of returns: the value of a relationship must be weighed against its cost and its exposure to risk.",
              "Dyer dhe Singh (1998) propozuan pikëpamjen relacionale të avantazhit konkurrues: disa burime dhe rutina me vlerë jetojnë përtej kufijve të kompanisë. Ata emërtojnë katër burime të mundshme të rentës relacionale: asete specifike për marrëdhënien, rutina të ndarjes së dijes, burime dhe aftësi plotësuese, dhe qeverisje efektive. E para kërkon kujdes, sepse një investim me vlerë për një marrëdhënie tregtare mund ta përmirësojë performancën dhe njëkohësisht të krijojë varësi. E dyta ka të bëjë me mënyra të përsëritura të shkëmbimit të njohurive të dobishme, e treta me kapacitete që punojnë mirë bashkë, e katërta me mekanizmat që e mbrojnë bashkëpunimin dhe i kufizojnë kostot e panevojshme të transaksionit. Kjo është kornizë konceptuale, jo pohim empirik se çdo rrjet partnerësh i ka të katërta, dhe jo premtim fitimi: vlera e një marrëdhënieje duhet peshuar kundrejt kostos dhe ekspozimit të saj ndaj rrezikut.",
              "Dyer und Singh (1998) schlugen die relationale Sicht auf Wettbewerbsvorteile vor: Manche wertvollen Ressourcen und Routinen liegen über Firmengrenzen hinweg. Sie nennen vier mögliche Quellen relationaler Renten: beziehungsspezifische Investitionen, Routinen des Wissensaustauschs, sich ergänzende Ressourcen und Fähigkeiten sowie wirksame Steuerung. Die erste verlangt Vorsicht, denn eine Investition, die für eine Geschäftsbeziehung wertvoll ist, kann die Leistung verbessern und zugleich Abhängigkeit schaffen. Die zweite betrifft wiederholte Wege, nützliches Wissen auszutauschen, die dritte Fähigkeiten, die gut zusammenwirken, die vierte die Mechanismen, die Kooperation schützen und unnötige Transaktionskosten begrenzen. Das ist ein begrifflicher Rahmen, keine empirische Aussage, dass jedes Partnernetz alle vier besitzt, und kein Renditeversprechen: Der Wert einer Beziehung ist gegen ihre Kosten und ihr Risiko abzuwägen.") },
            { type: "p", text: x(
              "For a reseller network one might ask whether the two sides share reliable stock information, understand each other's delivery constraints and keep learning from recurring problems; for last-mile partners, whether resource planning, loading readiness and exception reporting are mutually understood. These are proposed lines of inquiry, not verified practices at any named company.",
              "Për një rrjet rishitësish mund të pyesësh nëse të dyja palët ndajnë informacion të besueshëm për gjendjen e mallit, i kuptojnë kufizimet e dorëzimit të njëra-tjetrës dhe vazhdojnë të mësojnë nga problemet që përsëriten; për partnerët last mile, nëse planifikimi i burimeve, gatishmëria për ngarkim dhe raportimi i përjashtimeve kuptohen nga të dyja anët. Këto janë drejtime hetimi të propozuara, jo praktika të verifikuara në ndonjë kompani të emërtuar.",
              "In einem Händlernetz könnte man fragen, ob beide Seiten verlässliche Bestandsinformationen teilen, die Lieferbeschränkungen der anderen verstehen und aus wiederkehrenden Problemen lernen; bei Last-Mile-Partnern, ob Ressourcenplanung, Ladebereitschaft und Ausnahmemeldungen gegenseitig verstanden werden. Das sind vorgeschlagene Prüffragen, keine geprüften Praktiken einer benannten Firma.") },
            { type: "cards", cols: 3, items: [
              { h: x("Specialised assets", "Asete të specializuara", "Spezifische Investitionen"), p: x("Useful investments that can create value and dependence.", "Investime të dobishme që mund të krijojnë vlerë dhe varësi.", "Nützliche Investitionen, die Wert und Abhängigkeit schaffen können.") },
              { h: x("Knowledge routines", "Rutina të dijes", "Wissensroutinen"), p: x("Repeated ways to exchange verified operational information.", "Mënyra të përsëritura për të shkëmbyer informacion operacional të verifikuar.", "Wiederholte Wege, geprüfte Betriebsinformationen auszutauschen.") },
              { h: x("Complementarity", "Plotësueshmëri", "Ergänzung"), p: x("Capabilities that function better when coordinated.", "Aftësi që funksionojnë më mirë kur koordinohen.", "Fähigkeiten, die koordiniert besser wirken.") },
            ] },
            { type: "callout", reading: true, text: x(
              "The fourth source, effective governance, holds the first three together without turning cooperation into guesswork.",
              "Burimi i katërt, qeverisja efektive, i mban bashkë tre të parët pa e kthyer bashkëpunimin në hamendje.",
              "Die vierte Quelle, wirksame Steuerung, hält die ersten drei zusammen, ohne Kooperation zum Ratespiel zu machen.") },
          ],
          note: x(
            "Dyer and Singh (1998), Academy of Management Review 23(4), 660–679. Conceptual theory; the lines of inquiry are editorial.",
            "Dyer e Singh (1998), Academy of Management Review 23(4), 660–679. Teori konceptuale; drejtimet e hetimit janë editoriale.",
            "Dyer und Singh (1998), Academy of Management Review 23(4), 660–679. Begriffliche Theorie; die Prüffragen sind redaktionell."),
          source: ["dyer-singh-1998"],
        },
        {
          id: "iii-protocol", layer: "protocol",
          title: [x("From a trusted person", "Nga një person i besuar", "Von der vertrauten Person"), x("to a trusted process", "te një proces i besuar", "zum vertrauten Prozess")],
          lead: x(
            "A partner relationship should remain dependable when the usual contact is unavailable.",
            "Një marrëdhënie partneriteti duhet të mbetet e besueshme edhe kur kontakti i zakonshëm mungon.",
            "Eine Partnerbeziehung soll verlässlich bleiben, wenn der übliche Kontakt nicht erreichbar ist."),
          blocks: [
            { type: "p", text: x(
              "The operational test of trust is not whether two individuals believe they have a good relationship. It is whether the promised work remains understandable and correct when the relationship is under pressure. A partner that hears only optimistic statements does not necessarily have a high-trust relationship; it may have too little verified information. The design below turns trust into observable routines without pretending it can be measured by one score. Test it on non-sensitive cases, with clear agreement on what may be shared; contractual and privacy limits take priority.",
              "Prova operacionale e besimit nuk është nëse dy individë mendojnë se kanë marrëdhënie të mirë. Është nëse puna e premtuar mbetet e kuptueshme dhe e saktë kur marrëdhënia është nën presion. Një partner që dëgjon vetëm deklarata optimiste nuk ka domosdoshmërisht marrëdhënie me besim të lartë; mund të ketë shumë pak informacion të verifikuar. Projektimi më poshtë e kthen besimin në rutina të vëzhgueshme pa pretenduar se matet me një pikë të vetme. Provoje në raste jo të ndjeshme, me marrëveshje të qartë për atë që mund të ndahet; kufijtë kontraktualë dhe të privatësisë kanë përparësi.",
              "Der betriebliche Test von Vertrauen ist nicht, ob zwei Menschen glauben, eine gute Beziehung zu haben, sondern ob die zugesagte Arbeit verständlich und richtig bleibt, wenn die Beziehung unter Druck steht. Ein Partner, der nur Zuversichtliches hört, hat nicht unbedingt eine Beziehung mit hohem Vertrauen; vielleicht hat er zu wenig geprüfte Information. Der Entwurf unten übersetzt Vertrauen in beobachtbare Routinen, ohne vorzugeben, es ließe sich mit einer Zahl messen. An unsensiblen Fällen erproben, mit klarer Absprache, was geteilt werden darf; vertragliche und datenschutzrechtliche Grenzen haben Vorrang.") },
            { type: "steps", items: [
              { h: x("Document the promise", "Dokumento premtimin", "Die Zusage festhalten"), p: x("Identify the outcome both organisations recognise as complete.", "Identifiko rezultatin që të dyja organizatat e njohin si të përfunduar.", "Das Ergebnis benennen, das beide Organisationen als erledigt anerkennen.") },
              { h: x("Clarify the status language", "Sqaro gjuhën e statuseve", "Die Statussprache klären"), p: x("Define what 'confirmed', 'pending' and 'delivered' mean.", "Përcakto çfarë do të thotë \"i konfirmuar\", \"në pritje\" dhe \"i dorëzuar\".", "Festlegen, was „bestätigt“, „offen“ und „geliefert“ bedeuten.") },
              { h: x("Create a substitute route", "Krijo një rrugë zëvendësuese", "Einen Ersatzweg schaffen"), p: x("Provide an authorised contact for absence or escalation.", "Siguro një kontakt të autorizuar për mungesat ose eskalimin.", "Einen befugten Kontakt für Abwesenheit oder Eskalation bereitstellen.") },
              { h: x("Invite correction", "Ftoje korrigjimin", "Korrektur einladen"), p: x("Make it acceptable to report uncertainty before a promise fails.", "Bëje të pranueshme raportimin e pasigurisë para se të dështojë premtimi.", "Unsicherheit melden dürfen, bevor eine Zusage scheitert.") },
              { h: x("Confirm resolution", "Konfirmo zgjidhjen", "Die Lösung bestätigen"), p: x("Ask the receiving side whether the action met the agreed need.", "Pyet palën marrëse nëse veprimi e plotësoi nevojën e rënë dakord.", "Die empfangende Seite fragen, ob die Handlung den vereinbarten Bedarf traf.") },
              { h: x("Review reliability", "Rishiko besueshmërinë", "Verlässlichkeit prüfen"), p: x("Use a small sample of commitments, not a popularity score.", "Përdor një mostër të vogël angazhimesh, jo një pikë popullariteti.", "Eine kleine Stichprobe von Zusagen nutzen, keine Beliebtheitsnote.") },
            ] },
            { type: "callout", reading: true, text: x(
              "Relationship strength is tested by the difficult update, not merely by the easy conversation.",
              "Forca e marrëdhënies provohet nga përditësimi i vështirë, jo thjesht nga biseda e lehtë.",
              "Die Stärke einer Beziehung zeigt sich am schwierigen Update, nicht nur am leichten Gespräch.") },
          ],
          note: x(
            "Editorial protocol informed by Zaheer et al. (1998), Dyer and Singh (1998) and Ring and Van de Ven (1994).",
            "Protokoll editorial i mbështetur te Zaheer et al. (1998), Dyer e Singh (1998) dhe Ring e Van de Ven (1994).",
            "Redaktionelles Protokoll nach Zaheer et al. (1998), Dyer und Singh (1998) sowie Ring und Van de Ven (1994)."),
          source: ["zaheer-mcevily-perrone-1998", "dyer-singh-1998", "ring-van-de-ven-1994"],
        },
      ],
    },

    // Chapter IV. When incentives pull apart
    {
      id: "ch-iv", type: "chapter", numeral: "IV",
      title: x("When incentives pull apart", "Kur nxitjet tërheqin në drejtime të ndryshme", "Wenn Anreize auseinanderziehen"),
      pages: [
        {
          id: "iv-scene", layer: "scene", more: "where-part-of-the-order-goes-missing",
          title: [x("One delivery,", "Një dorëzim,", "Eine Lieferung,"), x("two scorecards", "dy karta rezultatesh", "zwei Scorecards")],
          lead: x(
            "A good local outcome is not automatically a good result for the shared customer.",
            "Një rezultat i mirë lokal nuk është vetvetiu rezultat i mirë për klientin e përbashkët.",
            "Ein gutes örtliches Ergebnis ist nicht automatisch gut für den gemeinsamen Kunden."),
          blocks: [
            { type: "flag", text: x("Constructed last-mile scene, not an allegation about any partner", "Skenë e ndërtuar last mile, jo akuzë ndaj ndonjë partneri", "Konstruierte Last-Mile-Szene, keine Behauptung über einen Partner") },
            { type: "p", text: x(
              "A carrier partner is measured on a defined service commitment. The supplying operation wants vehicles to leave at the planned time. A driver reports that an item in the expected load cannot be located. The local teams face a real question: prioritise departure, investigate completeness or request a change to the plan? This is not a story about a particular employer or driver. It is an analytic scene designed to show how two scorecards can create different instincts. The problem is not automatically selfishness or negligence. Each organisation may be responding rationally to what it is asked to measure, what it can control and what its local manager will be held accountable for.",
              "Një partner transporti matet me një angazhim shërbimi të përcaktuar. Operacioni furnizues do që automjetet të nisen në orën e planifikuar. Një shofer raporton se një artikull i ngarkesës së pritur nuk gjendet. Ekipet lokale përballen me një pyetje reale: t'i japin përparësi nisjes, të hetojnë plotësinë apo të kërkojnë ndryshim të planit? Kjo nuk është histori për një punëdhënës apo shofer të caktuar. Është skenë analitike e ndërtuar për të treguar si dy karta rezultatesh mund të krijojnë instinkte të ndryshme. Problemi nuk është vetvetiu egoizëm apo pakujdesi. Secila organizatë mund t'u përgjigjet me arsye atyre që i kërkohet të masë, atyre që mund të kontrollojë dhe atyre për të cilat do të mbahet përgjegjës menaxheri i saj lokal.",
              "Ein Transportpartner wird an einer festgelegten Leistungszusage gemessen. Der liefernde Betrieb will, dass die Fahrzeuge planmäßig abfahren. Ein Fahrer meldet, dass ein Artikel der erwarteten Ladung nicht auffindbar ist. Die örtlichen Teams stehen vor einer echten Frage: Abfahrt priorisieren, Vollständigkeit prüfen oder eine Planänderung beantragen? Das ist keine Geschichte über einen bestimmten Arbeitgeber oder Fahrer, sondern eine analytische Szene, die zeigt, wie zwei Scorecards verschiedene Reflexe erzeugen. Das Problem ist nicht automatisch Eigennutz oder Nachlässigkeit. Jede Organisation kann vernünftig auf das reagieren, was sie messen soll, was sie kontrollieren kann und wofür ihre örtliche Führung verantwortlich gemacht wird.") },
            { type: "p", text: x(
              "A shared customer judges the eventual service, not the elegance of each internal report. An early departure with an avoidable incomplete delivery may not be a success; delaying every route for an uncertain item can damage time-sensitive commitments. If the two firms use different definitions of a completed handoff, arguments become predictable. If they share the same exception code and responsibility, learning becomes possible. The question is not which partner should win the argument, but whether the joint performance system measures the right outcome and produces a timely decision when objectives conflict.",
              "Klienti i përbashkët e gjykon shërbimin përfundimtar, jo elegancën e çdo raporti të brendshëm. Një nisje e hershme me një dorëzim të paplotë që mund të shmangej mund të mos jetë sukses; vonimi i çdo rruge për një artikull të pasigurt mund t'i dëmtojë angazhimet që varen nga koha. Nëse dy firmat përdorin përkufizime të ndryshme për një dorëzim të përfunduar, debatet bëhen të parashikueshme. Nëse ndajnë të njëjtin kod përjashtimi dhe të njëjtën përgjegjësi, mësimi bëhet i mundur. Pyetja nuk është cili partner duhet ta fitojë debatin, por nëse sistemi i përbashkët i performancës mat rezultatin e duhur dhe nxjerr një vendim në kohë kur objektivat bien ndesh.",
              "Der gemeinsame Kunde beurteilt die erbrachte Leistung, nicht die Eleganz jedes internen Berichts. Eine frühe Abfahrt mit vermeidbar unvollständiger Lieferung ist nicht unbedingt ein Erfolg; jede Tour für einen unsicheren Artikel aufzuhalten, kann zeitkritische Zusagen beschädigen. Nutzen beide Firmen verschiedene Definitionen einer erledigten Übergabe, wird der Streit vorhersehbar. Teilen sie denselben Ausnahmecode und dieselbe Verantwortung, wird Lernen möglich. Die Frage ist nicht, welcher Partner den Streit gewinnt, sondern ob das gemeinsame Leistungssystem das richtige Ergebnis misst und rechtzeitig entscheidet, wenn Ziele kollidieren.") },
            { type: "callout", reading: true, text: x(
              "A partnership needs a shared definition of success, or local optimisation can become a shared failure.",
              "Një partneritet ka nevojë për një përkufizim të përbashkët të suksesit, përndryshe optimizimi lokal mund të bëhet dështim i përbashkët.",
              "Eine Partnerschaft braucht eine gemeinsame Definition von Erfolg, sonst kann örtliche Optimierung zum gemeinsamen Scheitern werden.") },
          ],
          note: x(
            "Hypothetical scene; no company KPI values are used. Dyer and Singh (1998); Heide and John (1992). The essay named below is about where part of the order goes missing.",
            "Skenë hipotetike; nuk përdoret asnjë vlerë KPI kompanie. Dyer e Singh (1998); Heide e John (1992). Eseja e emërtuar më poshtë flet për vendin ku humbet një pjesë e porosisë.",
            "Hypothetische Szene; keine KPI-Werte einer Firma. Dyer und Singh (1998); Heide und John (1992). Der unten genannte Essay handelt davon, wo ein Teil des Auftrags verloren geht."),
          source: ["dyer-singh-1998", "heide-john-1992"],
        },
        {
          id: "iv-concept", layer: "concept",
          title: [x("Cooperation has", "Bashkëpunimi ka", "Kooperation hat"), x("a cost structure", "një strukturë kostosh", "eine Kostenstruktur")],
          lead: x(
            "Alignment means understanding who carries the cost when the plan changes.",
            "Përputhja do të thotë të kuptosh kush e mban koston kur ndryshon plani.",
            "Abstimmung heißt verstehen, wer die Kosten trägt, wenn sich der Plan ändert."),
          blocks: [
            { type: "p", text: x(
              "Two organisations can honestly want the same customer outcome while disagreeing about the price of achieving it. A last-minute exception may require extra dispatch work on one side, waiting time on another and an explanation to a recipient who sees neither. Without an agreed way to surface the burden, the interaction can turn into repeated blame. Heide and John (1992) examined the role of relational norms in economically efficient relationships between independent firms. In a sample of manufacturer-supplier relationships they argued that where specific assets are at risk and vertical control over the other firm is not available, supportive norms matter; without them, dependent parties lose control. Their conclusion is about governing relationships under particular conditions, not a promise that goodwill erases cost.",
              "Dy organizata mund të duan sinqerisht të njëjtin rezultat për klientin dhe të mos pajtohen për çmimin e arritjes së tij. Një përjashtim i minutës së fundit mund të kërkojë punë shtesë dispeçerie në njërën anë, kohë pritjeje në anën tjetër dhe një shpjegim për një marrës që nuk sheh asnjërën. Pa një mënyrë të rënë dakord për ta nxjerrë në dritë barrën, ndërveprimi mund të kthehet në faj të përsëritur. Heide dhe John (1992) shqyrtuan rolin e normave relacionale në marrëdhënie ekonomikisht efikase mes firmave të pavarura. Në një mostër marrëdhëniesh prodhues-furnizues argumentuan se, kur asetet specifike janë në rrezik dhe kontrolli vertikal mbi firmën tjetër nuk është i mundur, normat mbështetëse kanë rëndësi; pa to, palët e varura e humbin kontrollin. Përfundimi i tyre ka të bëjë me qeverisjen e marrëdhënieve në kushte të caktuara, jo me një premtim se vullneti i mirë e fshin koston.",
              "Zwei Organisationen können ehrlich dasselbe Kundenergebnis wollen und über den Preis dafür uneins sein. Eine kurzfristige Ausnahme kann auf der einen Seite zusätzliche Disposition verlangen, auf der anderen Wartezeit und eine Erklärung gegenüber einem Empfänger, der beides nicht sieht. Ohne vereinbarten Weg, die Last sichtbar zu machen, kann der Austausch in wiederholte Schuldzuweisung kippen. Heide und John (1992) untersuchten die Rolle relationaler Normen in wirtschaftlich effizienten Beziehungen zwischen unabhängigen Firmen. In einer Stichprobe von Hersteller-Lieferanten-Beziehungen argumentierten sie: Wo spezifische Investitionen gefährdet sind und keine vertikale Kontrolle über die andere Firma möglich ist, zählen stützende Normen; ohne sie verlieren abhängige Parteien die Kontrolle. Ihr Schluss betrifft die Steuerung von Beziehungen unter bestimmten Bedingungen, kein Versprechen, dass guter Wille Kosten aufhebt.") },
            { type: "p", text: x(
              "This helps explain why a useful cross-company scorecard needs at least three views: the shared result the customer receives, the interface measures within each party's control, and the exceptions that require joint decisions. Measuring only the shared outcome can obscure where the failure arose; measuring only local tasks can reward behaviour that hurts the end-to-end service. A partner should not be held accountable for a step it cannot influence, nor excused for one it explicitly controls.",
              "Kjo ndihmon të shpjegohet pse një kartë e dobishme rezultatesh mes kompanive ka nevojë për të paktën tri pamje: rezultatin e përbashkët që merr klienti, matjet e ndërfaqes brenda kontrollit të secilës palë dhe përjashtimet që kërkojnë vendime të përbashkëta. Matja vetëm e rezultatit të përbashkët mund ta fshehë vendin ku lindi dështimi; matja vetëm e detyrave lokale mund të shpërblejë sjellje që e dëmton shërbimin nga fillimi në fund. Një partner nuk duhet të mbahet përgjegjës për një hap që nuk mund ta ndikojë, as të falet për një hap që e kontrollon qartë.",
              "Das erklärt, warum eine nützliche firmenübergreifende Scorecard mindestens drei Sichten braucht: das gemeinsame Ergebnis beim Kunden, die Schnittstellenmaße im Einflussbereich jeder Partei und die Ausnahmen, die gemeinsame Entscheidungen verlangen. Nur das gemeinsame Ergebnis zu messen, kann verdecken, wo der Fehler entstand; nur örtliche Aufgaben zu messen, kann Verhalten belohnen, das dem Gesamtservice schadet. Ein Partner sollte weder für einen Schritt haften, den er nicht beeinflussen kann, noch für einen entschuldigt werden, den er ausdrücklich kontrolliert.") },
            { type: "rows", compact: true, items: [
              { h: x("Customer outcome", "Rezultati për klientin", "Kundenergebnis"), p: x("Was the shared promise fulfilled at acceptable quality?", "A u përmbush premtimi i përbashkët me cilësi të pranueshme?", "Wurde die gemeinsame Zusage in annehmbarer Qualität erfüllt?") },
              { h: x("Interface performance", "Performanca e ndërfaqes", "Schnittstellenleistung"), p: x("Which transfer or confirmation was delayed or inaccurate?", "Cili kalim apo konfirmim u vonua ose ishte i pasaktë?", "Welche Übergabe oder Bestätigung war verspätet oder ungenau?") },
              { h: x("Joint exception", "Përjashtimi i përbashkët", "Gemeinsame Ausnahme"), p: x("What decision was needed, and was the authority clear?", "Çfarë vendimi duhej, dhe a ishte i qartë autoriteti?", "Welche Entscheidung war nötig, und war die Befugnis klar?") },
            ] },
          ],
          note: x(
            "Heide and John (1992), Journal of Marketing 56(2); Dyer and Singh (1998). The three-view scorecard is an editorial proposal.",
            "Heide e John (1992), Journal of Marketing 56(2); Dyer e Singh (1998). Karta me tri pamje është propozim editorial.",
            "Heide und John (1992), Journal of Marketing 56(2); Dyer und Singh (1998). Die Scorecard mit drei Sichten ist ein redaktioneller Vorschlag."),
          source: ["heide-john-1992", "dyer-singh-1998"],
        },
        {
          id: "iv-evidence", layer: "concept",
          title: [x("Contracts and norms:", "Kontratat dhe normat:", "Verträge und Normen:"), x("a qualified relationship", "një lidhje me kushte", "ein bedingter Zusammenhang")],
          lead: x(
            "Large evidence syntheses are valuable only when their reported effects are not simplified beyond recognition.",
            "Përmbledhjet e mëdha të provave kanë vlerë vetëm kur efektet që raportojnë nuk thjeshtohen sa të mos njihen më.",
            "Große Evidenzsynthesen sind nur wertvoll, wenn ihre Befunde nicht bis zur Unkenntlichkeit vereinfacht werden."),
          blocks: [
            { type: "p", text: x(
              "Cao and Lumineau (2015) combined a qualitative review with a meta-analysis of 149 empirical studies covering 33,051 interorganisational relationships. Contractual governance was positively related to both sides of relational governance, trust and relational norms, and contracts, trust and norms together were associated with higher satisfaction and relationship performance and lower opportunism. They also found that the link varies with the institutional environment, the type and length of the relationship and how contracts were measured. The result supports examining formal and relational governance together, not an instruction to maximise both indiscriminately. It does not measure a logistics company's completion rate or show that a particular contract raises trust by a fixed amount. The 33,051 observations are relationships across studies, not employees in one organisation, and the findings depend on how the underlying studies defined their constructs.",
              "Cao dhe Lumineau (2015) bashkuan një rishikim cilësor me një meta-analizë të 149 studimeve empirike që përfshinin 33.051 marrëdhënie ndërmjet organizatave. Qeverisja kontraktuale doli e lidhur pozitivisht me të dyja anët e qeverisjes relacionale, besimin dhe normat relacionale, ndërsa kontratat, besimi dhe normat bashkë shoqëroheshin me kënaqësi dhe performancë më të lartë të marrëdhënies dhe me më pak oportunizëm. Gjetën gjithashtu se lidhja ndryshon sipas mjedisit institucional, llojit dhe kohëzgjatjes së marrëdhënies dhe mënyrës si ishin matur kontratat. Rezultati e mbështet shqyrtimin e qeverisjes formale dhe relacionale bashkë, jo udhëzimin për t'i maksimizuar të dyja pa dallim. Nuk mat shkallën e përfundimit të një kompanie logjistike dhe nuk tregon se një kontratë e caktuar e rrit besimin me një sasi fikse. 33.051 vëzhgimet janë marrëdhënie në shumë studime, jo punonjës të një organizate, dhe gjetjet varen nga mënyra si i përcaktuan konceptet studimet bazë.",
              "Cao und Lumineau (2015) verbanden einen qualitativen Überblick mit einer Metaanalyse von 149 empirischen Studien über 33.051 Beziehungen zwischen Organisationen. Vertragliche Steuerung hing positiv mit beiden Seiten relationaler Steuerung zusammen, Vertrauen und relationalen Normen, und Verträge, Vertrauen und Normen gingen gemeinsam mit höherer Zufriedenheit und Beziehungsleistung und weniger Opportunismus einher. Zudem variiert der Zusammenhang mit dem institutionellen Umfeld, Art und Dauer der Beziehung und der Messung von Verträgen. Das Ergebnis spricht dafür, formale und relationale Steuerung gemeinsam zu betrachten, nicht dafür, beide wahllos zu maximieren. Es misst keine Zustellquote eines Logistikunternehmens und zeigt nicht, dass ein bestimmter Vertrag Vertrauen um einen festen Betrag erhöht. Die 33.051 Beobachtungen sind Beziehungen über Studien hinweg, keine Beschäftigten einer Organisation, und die Befunde hängen davon ab, wie die Einzelstudien ihre Konstrukte definierten.") },
            { type: "p", text: x(
              "Operationally, the evidence challenges a false choice between trusting partners and needing strict agreements. Well-designed agreements can clarify expectations; relational norms can reduce ambiguity and improve the use of formal terms. A contract used mainly as a threat may produce a different response from a coordination rule designed for transparent adjustment. Does a notice clause help both parties react to a genuine exception, or merely help one document a penalty afterwards?",
              "Operacionalisht, prova e sfidon zgjedhjen e rreme mes besimit te partnerët dhe nevojës për marrëveshje të rrepta. Marrëveshjet e projektuara mirë mund t'i sqarojnë pritshmëritë; normat relacionale mund ta ulin paqartësinë dhe ta përmirësojnë përdorimin e kushteve formale. Një kontratë e përdorur kryesisht si kërcënim mund të sjellë një përgjigje tjetër nga një rregull koordinimi i ndërtuar për përshtatje transparente. A i ndihmon një klauzolë njoftimi të dyja palët të reagojnë ndaj një përjashtimi të vërtetë, apo thjesht ndihmon njërën të dokumentojë më pas një gjobë?",
              "Betrieblich stellt der Befund eine falsche Wahl infrage: Partnern vertrauen oder strenge Vereinbarungen brauchen. Gut gestaltete Vereinbarungen können Erwartungen klären; relationale Normen können Mehrdeutigkeit verringern und den Gebrauch formaler Regeln verbessern. Ein Vertrag, der vor allem als Drohung dient, kann eine andere Reaktion hervorrufen als eine Koordinationsregel für transparente Anpassung. Hilft eine Meldeklausel beiden Seiten, auf eine echte Ausnahme zu reagieren, oder nur einer, später eine Vertragsstrafe zu belegen?") },
            { type: "stat", n: "149", t: x(
              "empirical studies covering 33,051 interorganisational relationships in a governance meta-analysis (Cao and Lumineau, Journal of Operations Management, 2015).",
              "studime empirike me 33.051 marrëdhënie ndërmjet organizatave në një meta-analizë të qeverisjes (Cao e Lumineau, Journal of Operations Management, 2015).",
              "empirische Studien mit 33.051 Beziehungen zwischen Organisationen in einer Metaanalyse zur Steuerung (Cao und Lumineau, Journal of Operations Management, 2015).") },
            { type: "callout", reading: true, text: x(
              "Research suggests complementarity, with variation. It does not supply an off-the-shelf trust score for one partner.",
              "Kërkimi sugjeron plotësueshmëri, me ndryshime. Nuk jep një pikë besimi të gatshme për një partner.",
              "Die Forschung legt Ergänzung nahe, mit Unterschieden. Einen fertigen Vertrauenswert für einen Partner liefert sie nicht.") },
          ],
          note: x(
            "Cao and Lumineau (2015), Journal of Operations Management 33–34, 15–42.",
            "Cao e Lumineau (2015), Journal of Operations Management 33–34, 15–42.",
            "Cao und Lumineau (2015), Journal of Operations Management 33–34, 15–42."),
          source: ["cao-lumineau-2015"],
        },
        {
          id: "iv-protocol", layer: "protocol",
          title: [x("Measure the interface,", "Mat ndërfaqen,", "Die Schnittstelle messen,"), x("not just each party", "jo vetëm secilën palë", "nicht nur jede Partei")],
          lead: x(
            "Build a shared exception review with an agreed outcome and clear decision rights.",
            "Ndërto një rishikim të përbashkët të përjashtimeve, me një rezultat të rënë dakord dhe të drejta të qarta vendimi.",
            "Ein gemeinsames Ausnahmereview mit vereinbartem Ergebnis und klaren Entscheidungsrechten aufbauen."),
          blocks: [
            { type: "p", text: x(
              "A useful scorecard conversation starts with one joint service definition: what completion means, which intermediate confirmations matter and what happens when the conditions for a normal handoff are missing. It must not become a shortcut for disclosing confidential rates, individual driver records or private commercial arrangements. The measures can often be aggregated or categorical, and the first test should be small enough for careful verification.",
              "Një bisedë e dobishme për kartën e rezultateve nis me një përkufizim të përbashkët të shërbimit: çfarë do të thotë përfundim, cilat konfirmime të ndërmjetme kanë rëndësi dhe çfarë ndodh kur mungojnë kushtet për një dorëzim normal. Nuk duhet të bëhet rrugë e shkurtër për të zbuluar tarifa konfidenciale, regjistra individualë shoferësh apo marrëveshje tregtare private. Matjet shpesh mund të jenë të përmbledhura ose sipas kategorive, dhe prova e parë duhet të jetë aq e vogël sa të lejojë verifikim të kujdesshëm.",
              "Ein nützliches Scorecard-Gespräch beginnt mit einer gemeinsamen Leistungsdefinition: was Erledigung heißt, welche Zwischenbestätigungen zählen und was geschieht, wenn die Bedingungen für eine normale Übergabe fehlen. Es darf kein Umweg werden, um vertrauliche Preise, einzelne Fahrerdaten oder private Handelsabsprachen offenzulegen. Die Maße lassen sich oft aggregiert oder in Kategorien ausdrücken, und der erste Test sollte klein genug für sorgfältige Prüfung sein.") },
            { type: "steps", items: [
              { h: x("Agree the customer promise", "Bini dakord për premtimin ndaj klientit", "Die Kundenzusage vereinbaren"), p: x("Use one definition of quality, timeliness and successful completion.", "Përdorni një përkufizim të vetëm për cilësinë, kohën dhe përfundimin e suksesshëm.", "Eine Definition von Qualität, Pünktlichkeit und erfolgreicher Erledigung nutzen.") },
              { h: x("Map controllable inputs", "Hartëzo inputet e kontrollueshme", "Beeinflussbare Beiträge erfassen"), p: x("Identify which organisation owns each verified step.", "Identifiko cila organizatë e zotëron çdo hap të verifikuar.", "Klären, welche Organisation jeden geprüften Schritt verantwortet.") },
              { h: x("Define the exception", "Përcakto përjashtimin", "Die Ausnahme definieren"), p: x("Use clear, non-accusatory categories for shared problems.", "Përdor kategori të qarta, jo akuzuese, për problemet e përbashkëta.", "Klare, nicht anklagende Kategorien für gemeinsame Probleme nutzen.") },
              { h: x("Agree the decision route", "Bini dakord për rrugën e vendimit", "Den Entscheidungsweg vereinbaren"), p: x("Name the role authorised to choose among permitted alternatives.", "Emërto rolin e autorizuar të zgjedhë mes alternativave të lejuara.", "Die Rolle benennen, die zwischen erlaubten Alternativen wählen darf.") },
              { h: x("Return the finding", "Ktheje gjetjen", "Den Befund zurückgeben"), p: x("Tell both parties what happened and what remains uncertain.", "U thuaj të dyja palëve çfarë ndodhi dhe çfarë mbetet e pasigurt.", "Beiden Seiten sagen, was geschah und was unsicher bleibt.") },
              { h: x("Verify unintended effects", "Verifiko efektet e padëshiruara", "Nebenwirkungen prüfen"), p: x("Check that one improved number did not damage another outcome.", "Kontrollo që një numër i përmirësuar të mos ketë dëmtuar një rezultat tjetër.", "Prüfen, dass eine verbesserte Zahl kein anderes Ergebnis beschädigt hat.") },
            ] },
            { type: "callout", reading: true, text: x(
              "An honest cross-company scorecard records joint uncertainty rather than assigning blame to the nearest visible team.",
              "Një kartë e ndershme rezultatesh mes kompanive e shënon pasigurinë e përbashkët, në vend që t'ia hedhë fajin ekipit më të dukshëm pranë.",
              "Eine ehrliche firmenübergreifende Scorecard hält gemeinsame Unsicherheit fest, statt dem nächsten sichtbaren Team die Schuld zu geben.") },
          ],
          note: x(
            "Editorial protocol informed by Heide and John (1992) and Cao and Lumineau (2015); not a KPI system of any company.",
            "Protokoll editorial i mbështetur te Heide e John (1992) dhe Cao e Lumineau (2015); jo sistem KPI i ndonjë kompanie.",
            "Redaktionelles Protokoll nach Heide und John (1992) sowie Cao und Lumineau (2015); kein KPI-System einer Firma."),
          source: ["heide-john-1992", "cao-lumineau-2015"],
        },
      ],
    },

    // Chapter V. The fragile partner network
    {
      id: "ch-v", type: "chapter", numeral: "V",
      title: x("The fragile partner network", "Rrjeti i brishtë i partnerëve", "Das zerbrechliche Partnernetz"),
      pages: [
        {
          id: "v-scene", layer: "scene", more: "what-last-mile-taught-me",
          title: [x("A network can grow", "Një rrjet mund të rritet", "Ein Netz kann wachsen"), x("and become more fragile", "dhe të bëhet më i brishtë", "und zerbrechlicher werden")],
          lead: x(
            "More names on a partner list do not necessarily create more resilience.",
            "Më shumë emra në listën e partnerëve nuk sjellin domosdoshmërisht më shumë qëndrueshmëri.",
            "Mehr Namen auf einer Partnerliste schaffen nicht unbedingt mehr Widerstandskraft."),
          blocks: [
            { type: "flag", text: x("Constructed network scene, no documented failure attributed", "Skenë e ndërtuar rrjeti, pa asnjë dështim të dokumentuar të atribuuar", "Konstruierte Netzszene, kein dokumentiertes Versagen zugeschrieben") },
            { type: "p", text: x(
              "A distributor has relationships with many independent resellers. One has a strong regional position; another serves a narrow product category; a third relies on a single person for coordination. A customer request looks simple at company level but depends on a sequence of choices across local inventories, credit terms, product availability and transport. Each partner has different constraints, and counting them all as identical 'active outlets' conceals those differences. This is a constructed illustration, not an assessment of the author's historical reseller network. The confirmed network size is 61 resellers. There are no verified measures of revenue concentration, default risk, contractual dependence or the share of sales by individual partners, and such numbers must not be invented to make an analytical chart look convincing.",
              "Një shpërndarës ka marrëdhënie me shumë rishitës të pavarur. Njëri ka pozitë të fortë rajonale; një tjetër shërben një kategori të ngushtë produktesh; një i tretë mbështetet te një person i vetëm për koordinimin. Një kërkesë klienti duket e thjeshtë në nivel kompanie, por varet nga një varg zgjedhjesh mes gjendjeve lokale të mallit, kushteve të kreditit, disponueshmërisë së produktit dhe transportit. Çdo partner ka kufizime të ndryshme, dhe numërimi i të gjithëve si \"pika shitjeje aktive\" të njëjta i fsheh ato dallime. Ky është ilustrim i ndërtuar, jo vlerësim i rrjetit historik të rishitësve të autorit. Madhësia e konfirmuar e rrjetit është 61 rishitës. Nuk ka matje të verifikuara për përqendrimin e të ardhurave, rrezikun e mospagimit, varësinë kontraktuale apo pjesën e shitjeve sipas partnerëve, dhe numra të tillë nuk duhen shpikur për ta bërë bindës një grafik analitik.",
              "Ein Händler hat Beziehungen zu vielen unabhängigen Wiederverkäufern. Einer ist regional stark, ein anderer bedient eine schmale Produktkategorie, ein dritter hängt für die Koordination an einer einzigen Person. Eine Kundenanfrage wirkt auf Firmenebene einfach, hängt aber an einer Folge von Entscheidungen über örtliche Bestände, Zahlungsbedingungen, Produktverfügbarkeit und Transport. Jeder Partner hat andere Grenzen, und wer alle als gleiche „aktive Verkaufsstellen“ zählt, verdeckt diese Unterschiede. Das ist eine konstruierte Veranschaulichung, keine Bewertung des früheren Händlernetzes des Autors. Bestätigt ist eine Netzgröße von 61 Wiederverkäufern. Es gibt keine geprüften Werte zu Umsatzkonzentration, Ausfallrisiko, vertraglicher Abhängigkeit oder Umsatzanteilen einzelner Partner, und solche Zahlen dürfen nicht erfunden werden, damit ein Diagramm überzeugend aussieht.") },
            { type: "p", text: x(
              "A partner network can be robust when capabilities are complementary and information flows through stable routines. It can be fragile when too much knowledge, volume or decision authority rests in a few narrow points. Diversity can reduce some risks, but complexity also raises coordination demands; the number of partners is a descriptor, not a resilience score. A serious review asks what could interrupt the promised service if one link became unavailable. Can another partner cover the capability? Would the same information be available? Are the commercial and legal constraints known? Has anyone tested the response? The answer is not to duplicate every relationship, but to identify material dependencies and create feasible, authorised contingencies for those that matter most.",
              "Një rrjet partnerësh mund të jetë i qëndrueshëm kur aftësitë plotësojnë njëra-tjetrën dhe informacioni rrjedh përmes rutinave të qëndrueshme. Mund të jetë i brishtë kur shumë dije, vëllim apo autoritet vendimi mbështetet në pak pika të ngushta. Larmia mund t'i ulë disa rreziqe, por ndërlikimi i rrit edhe kërkesat për koordinim; numri i partnerëve është përshkrues, jo pikë qëndrueshmërie. Një rishikim serioz pyet çfarë mund ta ndërpresë shërbimin e premtuar nëse një hallkë bëhet e padisponueshme. A mund ta mbulojë aftësinë një partner tjetër? A do të ishte i disponueshëm i njëjti informacion? A dihen kufizimet tregtare dhe ligjore? A e ka provuar dikush përgjigjen? Zgjidhja nuk është të dyfishohet çdo marrëdhënie, por të identifikohen varësitë thelbësore dhe të krijohen plane rezervë të realizueshme e të autorizuara për ato që kanë më shumë rëndësi.",
              "Ein Partnernetz kann robust sein, wenn sich Fähigkeiten ergänzen und Informationen über stabile Routinen fließen. Es kann zerbrechlich sein, wenn zu viel Wissen, Volumen oder Entscheidungsbefugnis an wenigen engen Stellen liegt. Vielfalt kann manche Risiken senken, doch Komplexität erhöht auch den Koordinationsbedarf; die Zahl der Partner beschreibt, sie bewertet keine Widerstandskraft. Ein ernsthaftes Review fragt, was die zugesagte Leistung unterbrechen könnte, wenn ein Glied ausfällt. Kann ein anderer Partner die Fähigkeit abdecken? Wären dieselben Informationen verfügbar? Sind die handels- und rechtlichen Grenzen bekannt? Hat jemand die Reaktion erprobt? Die Antwort ist nicht, jede Beziehung zu verdoppeln, sondern wesentliche Abhängigkeiten zu erkennen und machbare, befugte Ausweichlösungen für die wichtigsten zu schaffen.") },
            { type: "callout", reading: true, text: x(
              "The health of a network cannot be inferred from the count of its members.",
              "Shëndeti i një rrjeti nuk nxirret nga numri i anëtarëve të tij.",
              "Die Gesundheit eines Netzes lässt sich nicht an der Zahl seiner Mitglieder ablesen.") },
          ],
          note: x(
            "Composite illustration; confirmed background: 61 resellers. Provan and Kenis (2008); Dyer and Singh (1998). The essay named below is about what last mile taught the author.",
            "Ilustrim i përbërë; sfondi i konfirmuar: 61 rishitës. Provan e Kenis (2008); Dyer e Singh (1998). Eseja e emërtuar më poshtë flet për atë që i mësoi last mile-i autorit.",
            "Zusammengesetzte Veranschaulichung; bestätigter Hintergrund: 61 Wiederverkäufer. Provan und Kenis (2008); Dyer und Singh (1998). Der unten genannte Essay handelt davon, was die letzte Meile den Autor lehrte."),
          source: ["provan-kenis-2008", "dyer-singh-1998"],
        },
        {
          id: "v-concept", layer: "concept",
          title: [x("Who governs", "Kush e qeveris", "Wer steuert"), x("the whole network?", "gjithë rrjetin?", "das ganze Netz?")],
          lead: x(
            "A collection of bilateral agreements does not automatically create coordinated network governance.",
            "Një grumbull marrëveshjesh dypalëshe nuk krijon vetvetiu qeverisje të koordinuar të rrjetit.",
            "Eine Sammlung zweiseitiger Vereinbarungen ergibt nicht automatisch eine koordinierte Netzsteuerung."),
          blocks: [
            { type: "p", text: x(
              "Provan and Kenis (2008) developed a conceptual account of three broad modes of governing interorganisational networks: governance shared by the participants, governance through a lead organisation, and governance through a separate network administrative organisation. They explored the conditions under which each may be effective and the tensions each creates. In a small, highly aligned network, direct coordination among participants may be practical. In a larger network with asymmetric resources, a lead organisation may take more responsibility for routines. A dedicated administrative body can coordinate some networks but adds overhead and its own questions of accountability. These are analytical modes, not compulsory stages every commercial partnership must pass through.",
              "Provan dhe Kenis (2008) zhvilluan një shpjegim konceptual të tri mënyrave të gjera të qeverisjes së rrjeteve ndërmjet organizatave: qeverisja e ndarë nga pjesëmarrësit, qeverisja përmes një organizate drejtuese dhe qeverisja përmes një organizate administrative të veçantë të rrjetit. Shqyrtuan kushtet në të cilat secila mund të jetë efektive dhe tensionet që krijon secila. Në një rrjet të vogël dhe shumë të përputhur, koordinimi i drejtpërdrejtë mes pjesëmarrësve mund të jetë praktik. Në një rrjet më të madh me burime të pabarabarta, një organizatë drejtuese mund të marrë më shumë përgjegjësi për rutinat. Një organ administrativ i dedikuar mund t'i koordinojë disa rrjete, por shton kosto dhe pyetjet e veta të llogaridhënies. Këto janë mënyra analitike, jo faza të detyrueshme nëpër të cilat duhet të kalojë çdo partneritet tregtar.",
              "Provan und Kenis (2008) entwickelten eine begriffliche Darstellung dreier grundlegender Formen, interorganisationale Netze zu steuern: geteilte Steuerung durch die Beteiligten, Steuerung durch eine führende Organisation und Steuerung durch eine eigene Netzwerkverwaltungsorganisation. Sie untersuchten, unter welchen Bedingungen jede wirksam sein kann und welche Spannungen sie erzeugt. In einem kleinen, eng abgestimmten Netz kann direkte Koordination unter den Beteiligten praktikabel sein. In einem größeren Netz mit ungleichen Ressourcen kann eine führende Organisation mehr Verantwortung für Routinen übernehmen. Eine eigene Verwaltungsstelle kann manche Netze koordinieren, bringt aber Aufwand und eigene Fragen der Rechenschaft. Das sind analytische Formen, keine Pflichtstufen, die jede Handelspartnerschaft durchlaufen muss.") },
            { type: "p", text: x(
              "The framework helps managers avoid an important mistake: assuming that if each individual contract is understood, the network as a whole will coordinate itself. A change in one partner's capacity can affect others even when no bilateral party has broken its own obligation. Last-mile and wholesale networks are not interchangeable, yet the question travels across both: who has the legitimate authority and information to identify a shared problem and organise a joint response? The answer may be distributed among roles, but it should not remain implicit. The most useful map may be a map of decisions and information, not a list of partner names.",
              "Korniza i ndihmon menaxherët të shmangin një gabim të rëndësishëm: të supozojnë se, nëse kuptohet çdo kontratë më vete, rrjeti si i tërë do të koordinohet vetë. Një ndryshim në kapacitetin e një partneri mund të prekë të tjerët edhe kur asnjë palë dypalëshe nuk e ka shkelur detyrimin e vet. Rrjetet last mile dhe ato të shumicës nuk janë të këmbyeshme, por pyetja vlen për të dyja: kush ka autoritetin e ligjshëm dhe informacionin për ta identifikuar një problem të përbashkët dhe për ta organizuar një përgjigje të përbashkët? Përgjigjja mund të shpërndahet mes roleve, por nuk duhet të mbetet e nënkuptuar. Harta më e dobishme mund të jetë hartë vendimesh dhe informacioni, jo listë emrash partnerësh.",
              "Der Rahmen hilft, einen wichtigen Fehler zu vermeiden: anzunehmen, das Netz koordiniere sich von selbst, wenn jeder Einzelvertrag verstanden ist. Eine Kapazitätsänderung bei einem Partner kann andere treffen, auch wenn keine Vertragspartei ihre eigene Pflicht verletzt hat. Last-Mile- und Großhandelsnetze sind nicht austauschbar, doch die Frage gilt für beide: Wer hat die legitime Befugnis und die Information, ein gemeinsames Problem zu erkennen und eine gemeinsame Antwort zu organisieren? Die Antwort kann auf Rollen verteilt sein, sollte aber nicht stillschweigend bleiben. Die nützlichste Karte ist vielleicht eine Karte der Entscheidungen und Informationen, keine Liste von Partnernamen.") },
            { type: "cards", cols: 3, items: [
              { h: x("Shared", "E ndarë", "Geteilt"), p: x("Participants govern through direct joint action.", "Pjesëmarrësit qeverisin me veprim të përbashkët të drejtpërdrejtë.", "Die Beteiligten steuern durch direktes gemeinsames Handeln.") },
              { h: x("Lead", "Drejtuese", "Führend"), p: x("A central participant coordinates network activity.", "Një pjesëmarrës qendror e koordinon veprimtarinë e rrjetit.", "Ein zentraler Beteiligter koordiniert das Netz.") },
              { h: x("Separate", "E veçantë", "Eigenständig"), p: x("A dedicated administrative entity coordinates.", "Koordinon një njësi administrative e dedikuar.", "Eine eigene Verwaltungseinheit koordiniert.") },
            ] },
            { type: "callout", reading: true, text: x(
              "The best network mode depends on structure and context. No one mode is universally superior.",
              "Mënyra më e mirë e rrjetit varet nga struktura dhe konteksti. Asnjë mënyrë nuk është gjithmonë më e mira.",
              "Die beste Netzform hängt von Struktur und Kontext ab. Keine Form ist immer überlegen.") },
          ],
          note: x(
            "Provan and Kenis (2008), Journal of Public Administration Research and Theory 18(2), 229–252. Conceptual framework.",
            "Provan e Kenis (2008), Journal of Public Administration Research and Theory 18(2), 229–252. Kornizë konceptuale.",
            "Provan und Kenis (2008), Journal of Public Administration Research and Theory 18(2), 229–252. Begrifflicher Rahmen."),
          source: ["provan-kenis-2008"],
        },
        {
          id: "v-cycle", layer: "concept",
          title: [x("Partnerships are", "Partneritetet", "Partnerschaften werden"), x("maintained, not installed", "mbahen, nuk instalohen", "gepflegt, nicht installiert")],
          lead: x(
            "Commitment, execution and renegotiation recur when work and conditions change.",
            "Angazhimi, zbatimi dhe rinegocimi përsëriten kur ndryshojnë puna dhe kushtet.",
            "Zusage, Ausführung und Neuverhandlung kehren wieder, wenn sich Arbeit und Bedingungen ändern."),
          blocks: [
            { type: "p", text: x(
              "Ring and Van de Ven (1994) describe interorganisational relationships as developmental processes of negotiation, commitment and execution within both formal and social structures. Parties revise expectations through interaction rather than following a straight line from signed agreement to stable performance. The framework is conceptual and should not be presented as an experiment on annual partner retention. Gulati (1995) adds an empirical perspective on repeated alliances: in multi-industry data on alliances formed between 1970 and 1989, alliances between partners with prior ties were less likely to be organised through equity, a sign that familiarity shaped the governance chosen. Jap and Ganesan (2000), studying retailers and suppliers, found that the effect of safeguards on perceived commitment depended on the phase of the relationship. Familiarity may support trust; it may also hide assumptions never retested for current capacity.",
              "Ring dhe Van de Ven (1994) i përshkruajnë marrëdhëniet ndërmjet organizatave si procese zhvillimi të negocimit, angazhimit dhe zbatimit, brenda strukturave formale dhe shoqërore. Palët i rishikojnë pritshmëritë përmes ndërveprimit, jo duke ndjekur një vijë të drejtë nga marrëveshja e nënshkruar te performanca e qëndrueshme. Korniza është konceptuale dhe nuk duhet paraqitur si eksperiment mbi mbajtjen vjetore të partnerëve. Gulati (1995) shton një këndvështrim empirik për aleancat e përsëritura: në të dhëna nga shumë industri për aleancat e krijuara mes 1970 dhe 1989, aleancat mes partnerëve me lidhje të mëparshme organizoheshin më rrallë me kapital të përbashkët, shenjë se njohja e ndikonte qeverisjen e zgjedhur. Jap dhe Ganesan (2000), duke studiuar shitës me pakicë dhe furnizues, gjetën se efekti i mbrojtjeve te angazhimi i perceptuar varej nga faza e marrëdhënies. Njohja mund ta mbështesë besimin; mund të fshehë edhe supozime që nuk janë riprovuar kurrë për kapacitetin e sotëm.",
              "Ring und Van de Ven (1994) beschreiben Beziehungen zwischen Organisationen als Entwicklungsprozesse aus Verhandlung, Zusage und Ausführung, in formalen wie sozialen Strukturen. Die Parteien passen Erwartungen durch Interaktion an, statt einer geraden Linie vom unterschriebenen Vertrag zur stabilen Leistung zu folgen. Der Rahmen ist begrifflich und darf nicht als Experiment zur jährlichen Partnerbindung ausgegeben werden. Gulati (1995) ergänzt eine empirische Sicht auf wiederholte Allianzen: In branchenübergreifenden Daten zu Allianzen von 1970 bis 1989 wurden Allianzen zwischen Partnern mit früheren Verbindungen seltener über Kapitalbeteiligung organisiert, ein Zeichen, dass Vertrautheit die gewählte Steuerung prägte. Jap und Ganesan (2000) fanden bei Einzelhändlern und Lieferanten, dass die Wirkung von Absicherungen auf wahrgenommenes Engagement von der Phase der Beziehung abhing. Vertrautheit kann Vertrauen stützen und zugleich Annahmen verbergen, die nie für die heutige Kapazität geprüft wurden.") },
            { type: "p", text: x(
              "A relationship review should therefore have more than an onboarding moment. Early commitments should be checked against actual delivery; mature relationships should be assessed for changing demand, concentration and key-person dependence; relationships in difficulty need a fair route for renegotiation or exit, not repeated informal exceptions nobody owns. If the current way of working is not what both sides believe they agreed, reconcile the gap through the authorised process.",
              "Një rishikim i marrëdhënies duhet të ketë pra më shumë se një çast hyrjeje. Angazhimet e hershme duhen kontrolluar kundrejt dorëzimit real; marrëdhëniet e pjekura duhen vlerësuar për kërkesën që ndryshon, përqendrimin dhe varësinë nga persona kyç; marrëdhëniet në vështirësi kanë nevojë për një rrugë të drejtë rinegocimi ose largimi, jo për përjashtime joformale të përsëritura që s'i ka askush. Nëse mënyra aktuale e punës nuk është ajo për të cilën të dyja palët mendojnë se ranë dakord, hendeku pajtohet përmes procesit të autorizuar.",
              "Ein Beziehungsreview braucht deshalb mehr als einen Startmoment. Frühe Zusagen sind an der tatsächlichen Lieferung zu prüfen; reife Beziehungen auf veränderte Nachfrage, Konzentration und Abhängigkeit von Schlüsselpersonen; Beziehungen in Schwierigkeiten brauchen einen fairen Weg zur Neuverhandlung oder zum Ausstieg, keine wiederholten informellen Ausnahmen, die niemandem gehören. Weicht die heutige Arbeitsweise von dem ab, was beide vereinbart zu haben glauben, die Lücke über den befugten Weg abgleichen.") },
            { type: "chain", items: [
              { h: x("Negotiate", "Negocio", "Verhandeln"), p: x("Clarify need.", "Sqaro nevojën.", "Bedarf klären.") },
              { h: x("Commit", "Angazhohu", "Zusagen"), p: x("Define promise.", "Përcakto premtimin.", "Zusage festlegen.") },
              { h: x("Execute", "Zbato", "Ausführen"), p: x("Verify work.", "Verifiko punën.", "Arbeit prüfen.") },
              { h: x("Review", "Rishiko", "Prüfen"), p: x("Adapt rules.", "Përshtat rregullat.", "Regeln anpassen.") },
            ] },
            { type: "callout", reading: true, text: x(
              "Repetition alone is not proof of quality. A reliable partnership learns and updates its agreements.",
              "Përsëritja vetëm nuk është provë cilësie. Një partneritet i besueshëm mëson dhe i përditëson marrëveshjet e veta.",
              "Wiederholung allein beweist keine Qualität. Eine verlässliche Partnerschaft lernt und erneuert ihre Vereinbarungen.") },
          ],
          note: x(
            "Ring and Van de Ven (1994), conceptual; Gulati (1995), empirical alliances; Jap and Ganesan (2000), Journal of Marketing Research 37(2), retailer-supplier relationships. The cycle is an editorial simplification.",
            "Ring e Van de Ven (1994), konceptual; Gulati (1995), aleanca empirike; Jap e Ganesan (2000), Journal of Marketing Research 37(2), marrëdhënie shitës me pakicë-furnizues. Cikli është thjeshtim editorial.",
            "Ring und Van de Ven (1994), begrifflich; Gulati (1995), empirische Allianzen; Jap und Ganesan (2000), Journal of Marketing Research 37(2), Beziehungen zwischen Einzelhandel und Lieferanten. Der Kreislauf ist eine redaktionelle Vereinfachung."),
          source: ["ring-van-de-ven-1994", "gulati-1995", "jap-ganesan-2000"],
        },
        {
          id: "v-protocol", layer: "protocol",
          title: [x("Test the network", "Provoje rrjetin", "Das Netz prüfen,"), x("before it is tested", "para se ta provojë jeta", "bevor es geprüft wird")],
          lead: x(
            "A resilience review should identify material dependencies without inventing scenarios as measured incidents.",
            "Një rishikim qëndrueshmërie duhet t'i identifikojë varësitë thelbësore pa i shpikur skenarët si incidente të matura.",
            "Ein Resilienzreview soll wesentliche Abhängigkeiten erkennen, ohne Szenarien als gemessene Vorfälle auszugeben."),
          blocks: [
            { type: "p", text: x(
              "Begin with an authorised, high-level map of the partner network and the outcome it is meant to deliver. Identify critical capabilities, not the number of names, without collecting unnecessary personal data or publishing contract terms, then ask which dependencies have a realistic approved substitute and which would require a revised promise to the customer. The review stays qualitative: it is not a model of failure probability, which would need verified exposure data and a defensible method.",
              "Nis me një hartë të autorizuar dhe të përgjithshme të rrjetit të partnerëve dhe të rezultatit që duhet të japë. Identifiko aftësitë kritike, jo numrin e emrave, pa mbledhur të dhëna personale të panevojshme dhe pa publikuar kushte kontratash, pastaj pyet cilat varësi kanë një zëvendësues realist të miratuar dhe cilat do të kërkonin një premtim të rishikuar ndaj klientit. Rishikimi mbetet cilësor: nuk është model i probabilitetit të dështimit, që do të kërkonte të dhëna të verifikuara ekspozimi dhe një metodë të mbrojtshme.",
              "Mit einer befugten Übersicht des Netzes und seines Ergebnisses beginnen. Kritische Fähigkeiten erkennen, nicht die Zahl der Namen, ohne unnötige personenbezogene Daten oder Vertragsbedingungen, und dann fragen, welche Abhängigkeiten einen realistischen genehmigten Ersatz haben und welche eine geänderte Zusage an den Kunden verlangen würden. Das Review bleibt qualitativ: Es ist kein Modell der Ausfallwahrscheinlichkeit, das geprüfte Expositionsdaten und eine belastbare Methode bräuchte.") },
            { type: "steps", items: [
              { h: x("Identify the outcome", "Identifiko rezultatin", "Das Ergebnis benennen"), p: x("Which shared service must continue under disruption?", "Cili shërbim i përbashkët duhet të vazhdojë edhe kur prishet diçka?", "Welche Leistung muss bei Störungen weiterlaufen?") },
              { h: x("Map critical capabilities", "Hartëzo aftësitë kritike", "Kritische Fähigkeiten erfassen"), p: x("Where are knowledge, capacity and decision rights concentrated?", "Ku janë të përqendruara dija, kapaciteti dhe të drejtat e vendimit?", "Wo bündeln sich Wissen, Kapazität, Entscheidungen?") },
              { h: x("Assess substitution", "Vlerëso zëvendësimin", "Ersatz prüfen"), p: x("Can a permitted alternative actually cover the obligation?", "A mund ta mbulojë vërtet detyrimin një alternativë e lejuar?", "Kann eine erlaubte Alternative die Pflicht tatsächlich abdecken?") },
              { h: x("Plan communication", "Planifiko komunikimin", "Kommunikation planen"), p: x("Who informs partners and customers when the promise changes?", "Kush i njofton partnerët dhe klientët kur ndryshon premtimi?", "Wer informiert Partner und Kunden, wenn sich die Zusage ändert?") },
              { h: x("Exercise a hypothetical case", "Ushtro një rast hipotetik", "Einen hypothetischen Fall üben"), p: x("Test one approved scenario without real sensitive information.", "Provo një skenar të miratuar pa informacion real të ndjeshëm.", "Ein genehmigtes Szenario ohne sensible Daten durchspielen.") },
              { h: x("Record gaps", "Shëno mangësitë", "Lücken festhalten"), p: x("Assign a review owner and verify any improvement later.", "Cakto një pronar rishikimi dhe verifiko më vonë çdo përmirësim.", "Verantwortliche benennen, Verbesserungen später prüfen.") },
            ] },
            { type: "callout", reading: true, text: x(
              "Resilience is the ability to keep making honest, feasible commitments when circumstances change.",
              "Qëndrueshmëria është aftësia për të vazhduar të bësh premtime të ndershme dhe të realizueshme kur ndryshojnë rrethanat.",
              "Widerstandskraft heißt, weiter ehrliche, machbare Zusagen zu geben, wenn sich die Umstände ändern.") },
          ],
          note: x(
            "Editorial resilience protocol informed by Provan and Kenis (2008) and Ring and Van de Ven (1994); not a risk model.",
            "Protokoll editorial qëndrueshmërie i mbështetur te Provan e Kenis (2008) dhe Ring e Van de Ven (1994); jo model rreziku.",
            "Redaktionelles Resilienzprotokoll nach Provan und Kenis (2008) sowie Ring und Van de Ven (1994); kein Risikomodell."),
          source: ["provan-kenis-2008", "ring-van-de-ven-1994"],
        },
      ],
    },

    // Chapter VI. Designing reliable partnerships
    {
      id: "ch-vi", type: "chapter", numeral: "VI",
      title: x("Designing reliable partnerships", "Projektimi i partneriteteve të besueshme", "Verlässliche Partnerschaften gestalten"),
      pages: [
        {
          id: "vi-scene", layer: "scene", more: "kpis-the-team-trusts",
          title: [x("The partnership review", "Rishikimi i partneritetit", "Das Partnerschaftsreview,"), x("that ends with action", "që mbyllet me veprim", "das mit Handeln endet")],
          lead: x(
            "A joint meeting is useful only when it changes how work is coordinated.",
            "Një takim i përbashkët është i dobishëm vetëm kur ndryshon mënyrën si koordinohet puna.",
            "Ein gemeinsames Treffen nützt nur, wenn es verändert, wie Arbeit koordiniert wird."),
          blocks: [
            { type: "flag", text: x("Hypothetical future state, not a documented company initiative", "Gjendje hipotetike e ardhshme, jo nismë e dokumentuar kompanie", "Hypothetischer Zukunftszustand, keine dokumentierte Firmeninitiative") },
            { type: "p", text: x(
              "Representatives of two organisations meet after a run of unresolved interface problems. Everyone has brought a different report. One counts departures, another counts completed customer commitments, a third lists exceptions that were reported but never clearly closed. The conversation begins with familiar explanations about pressure and the quality of other teams' data. A manager changes the question. Instead of asking who owns the failure in general, the participants choose one ordinary service promise and reconstruct it together. What did the customer expect? What was verified at the moment of commitment? When did the status change? Which party could legally decide? Who told the receiving side what had happened?",
              "Përfaqësuesit e dy organizatave takohen pas një vargu problemesh ndërfaqeje të pazgjidhura. Secili ka sjellë një raport tjetër. Njëri numëron nisjet, një tjetër numëron angazhimet e përfunduara ndaj klientëve, një i tretë listëzon përjashtime që u raportuan, por nuk u mbyllën kurrë qartë. Biseda nis me shpjegimet e njohura për presionin dhe cilësinë e të dhënave të ekipeve të tjera. Një menaxher e ndryshon pyetjen. Në vend që të pyesin kujt i takon dështimi në përgjithësi, pjesëmarrësit zgjedhin një premtim të zakonshëm shërbimi dhe e rindërtojnë bashkë. Çfarë priste klienti? Çfarë u verifikua në çastin e angazhimit? Kur ndryshoi statusi? Cila palë mund të vendoste ligjërisht? Kush i tha palës marrëse çfarë kishte ndodhur?",
              "Vertreter zweier Organisationen treffen sich nach einer Reihe ungelöster Schnittstellenprobleme. Jeder hat einen anderen Bericht dabei. Einer zählt Abfahrten, ein anderer erfüllte Kundenzusagen, ein dritter listet Ausnahmen, die gemeldet, aber nie klar geschlossen wurden. Das Gespräch beginnt mit bekannten Erklärungen über Druck und die Datenqualität anderer Teams. Eine Führungskraft ändert die Frage. Statt allgemein zu fragen, wem das Versagen gehört, wählen die Beteiligten eine gewöhnliche Leistungszusage und rekonstruieren sie gemeinsam. Was erwartete der Kunde? Was war im Moment der Zusage geprüft? Wann änderte sich der Status? Welche Partei durfte rechtlich entscheiden? Wer sagte der empfangenden Seite, was geschehen war?") },
            { type: "p", text: x(
              "The group finds no magic answer. Several causes may have contributed, and the contract still governs rights and obligations. But the meeting produces two useful decisions: an agreed definition of a completed transfer, and an authorised way to report an exception without leaving its ownership ambiguous. Both sides assign a named role, not necessarily a named person, to review a short sample of future cases. This is a hypothetical future state; no actual intervention or result is claimed. Its point is practical: a partner review should end in an operating agreement that can be checked, not a ceremonial affirmation of collaboration.",
              "Grupi nuk gjen asnjë përgjigje magjike. Mund të kenë kontribuar disa shkaqe, dhe kontrata vazhdon t'i rregullojë të drejtat dhe detyrimet. Por takimi nxjerr dy vendime të dobishme: një përkufizim të rënë dakord për një kalim të përfunduar dhe një mënyrë të autorizuar për të raportuar një përjashtim pa e lënë të paqartë pronësinë e tij. Të dyja palët caktojnë një rol të emërtuar, jo domosdoshmërisht një person të emërtuar, për të rishikuar një mostër të shkurtër rastesh të ardhshme. Kjo është gjendje hipotetike e ardhshme; nuk pohohet asnjë ndërhyrje apo rezultat real. Pika e saj është praktike: një rishikim partneriteti duhet të mbyllet me një marrëveshje operacionale që mund të kontrollohet, jo me një pohim ceremonial bashkëpunimi.",
              "Die Gruppe findet keine Zauberlösung. Mehrere Ursachen können beigetragen haben, und der Vertrag regelt weiter Rechte und Pflichten. Doch das Treffen bringt zwei nützliche Entscheidungen: eine vereinbarte Definition einer erledigten Übergabe und einen befugten Weg, eine Ausnahme zu melden, ohne ihre Zuständigkeit offen zu lassen. Beide Seiten benennen eine Rolle, nicht unbedingt eine Person, die eine kleine Stichprobe künftiger Fälle prüft. Das ist ein hypothetischer Zukunftszustand; kein echter Eingriff und kein Ergebnis wird behauptet. Sein Punkt ist praktisch: Ein Partnerschaftsreview soll mit einer prüfbaren Betriebsvereinbarung enden, nicht mit einem feierlichen Bekenntnis zur Zusammenarbeit.") },
            { type: "callout", reading: true, text: x(
              "The output of coordination is not a meeting. It is a clearer next action shared by both parties.",
              "Rezultati i koordinimit nuk është një takim. Është një veprim i radhës më i qartë, i ndarë nga të dyja palët.",
              "Das Ergebnis von Koordination ist kein Treffen, sondern eine klarere nächste Handlung, die beide Seiten teilen.") },
          ],
          note: x(
            "Constructed scenario. Poppo and Zenger (2002); Lumineau and Henderson (2012). The essay named below is about building KPIs the team trusts.",
            "Skenar i ndërtuar. Poppo e Zenger (2002); Lumineau e Henderson (2012). Eseja e emërtuar më poshtë flet për ndërtimin e KPI-ve që ekipi i beson.",
            "Konstruiertes Szenario. Poppo und Zenger (2002); Lumineau und Henderson (2012). Der unten genannte Essay handelt von KPIs, denen das Team vertraut."),
          source: ["poppo-zenger-2002", "lumineau-henderson-2012"],
        },
        {
          id: "vi-concept", layer: "concept",
          title: [x("A charter for", "Një kartë për", "Eine Charta für"), x("shared execution", "zbatimin e përbashkët", "gemeinsame Ausführung")],
          lead: x(
            "Build a small operating structure that works inside existing contracts and approved decision rights.",
            "Ndërto një strukturë të vogël operacionale që funksionon brenda kontratave ekzistuese dhe të drejtave të miratuara të vendimit.",
            "Eine kleine Betriebsstruktur bauen, die innerhalb bestehender Verträge und genehmigter Entscheidungsrechte funktioniert."),
          blocks: [
            { type: "p", text: x(
              "An effective partnership charter need not be long, but it must be more than a list of values. It defines a shared outcome, the interface between the organisations, the role responsible for confirmation and the rules for a changing situation, and it names what each organisation is not authorised to decide for the other. What follows is an editorial structure, not binding contract language, to be checked against the actual agreement, labour, confidentiality and compliance rules; it confers no rights.",
              "Një kartë efektive partneriteti nuk ka nevojë të jetë e gjatë, por duhet të jetë më shumë se një listë vlerash. Përcakton një rezultat të përbashkët, ndërfaqen mes organizatave, rolin përgjegjës për konfirmimin dhe rregullat për një situatë që ndryshon, dhe emërton atë që secila organizatë nuk është e autorizuar ta vendosë për tjetrën. Ajo që vijon është strukturë editoriale, jo tekst kontrate detyrues, që duhet krahasuar me marrëveshjen reale dhe rregullat e punës, të konfidencialitetit dhe të përputhshmërisë; nuk jep asnjë të drejtë.",
              "Eine wirksame Partnerschaftscharta muss nicht lang sein, aber mehr als eine Werteliste. Sie legt ein gemeinsames Ergebnis fest, die Schnittstelle zwischen den Organisationen, die für die Bestätigung verantwortliche Rolle und die Regeln für eine sich ändernde Lage, und sie benennt, was keine Organisation für die andere entscheiden darf. Das Folgende ist eine redaktionelle Struktur, kein bindender Vertragstext, abzugleichen mit der tatsächlichen Vereinbarung und den Regeln zu Arbeit, Vertraulichkeit und Compliance; sie verleiht keine Rechte.") },
            { type: "rows", compact: true, items: [
              { h: x("Promise", "Premtimi", "Zusage"), p: x("Service result, standard and clear definition of completion.", "Rezultati i shërbimit, standardi dhe përkufizimi i qartë i përfundimit.", "Leistungsergebnis, Standard und klare Definition der Erledigung.") },
              { h: x("Interface", "Ndërfaqja", "Schnittstelle"), p: x("Verified information and agreed transfer point.", "Informacioni i verifikuar dhe pika e rënë dakord e kalimit.", "Geprüfte Information und vereinbarter Übergabepunkt.") },
              { h: x("Ownership", "Pronësia", "Verantwortung"), p: x("Role on each side accountable for follow-through.", "Roli në secilën anë, përgjegjës për ndjekjen deri në fund.", "Rolle auf jeder Seite, die für die Umsetzung einsteht.") },
              { h: x("Exception", "Përjashtimi", "Ausnahme"), p: x("What changes, who decides and how updates reach others.", "Çfarë ndryshon, kush vendos dhe si u arrijnë përditësimet të tjerëve.", "Was sich ändert, wer entscheidet und wie Updates andere erreichen.") },
              { h: x("Evidence", "Prova", "Belege"), p: x("Agreed, minimal data used to verify result and response.", "Të dhëna minimale, të rëna dakord, për të verifikuar rezultatin dhe përgjigjen.", "Vereinbarte, sparsame Daten, um Ergebnis und Reaktion zu prüfen.") },
              { h: x("Learning", "Mësimi", "Lernen"), p: x("Joint review of recurring causes, revisions and unresolved risk.", "Rishikim i përbashkët i shkaqeve që përsëriten, rishikimeve dhe rrezikut të pazgjidhur.", "Gemeinsame Prüfung wiederkehrender Ursachen, Änderungen und offener Risiken.") },
            ] },
            { type: "p", text: x(
              "The last item matters because an organisation can formally close every individual case while keeping the same underlying problem. A disciplined monthly review might examine a small number of anonymised examples, not hundreds of reports nobody can interpret. A one-page tool cannot replace contractual advice or formal dispute procedures.",
              "Pika e fundit ka rëndësi, sepse një organizatë mund ta mbyllë formalisht çdo rast më vete dhe ta mbajë të njëjtin problem në themel. Një rishikim mujor i disiplinuar mund të shqyrtojë pak shembuj të anonimizuar, jo qindra raporte që askush nuk i interpreton dot. Një mjet njëfaqësh nuk zë dot vendin e këshillës kontraktuale apo të procedurave formale të mosmarrëveshjeve.",
              "Der letzte Punkt zählt, weil eine Organisation jeden Einzelfall formal schließen und dasselbe Grundproblem behalten kann. Ein diszipliniertes Monatsreview könnte wenige anonymisierte Beispiele prüfen statt Hunderter Berichte, die niemand deuten kann. Ein einseitiges Werkzeug ersetzt weder Vertragsberatung noch formale Streitverfahren.") },
            { type: "callout", reading: true, text: x(
              "Make the interface explicit. Keep the legal agreement authoritative and the operating promise checkable.",
              "Bëje ndërfaqen të qartë. Mbaje marrëveshjen ligjore autoritare dhe premtimin operacional të kontrollueshëm.",
              "Die Schnittstelle ausdrücklich machen. Die rechtliche Vereinbarung bleibt maßgeblich, die betriebliche Zusage prüfbar.") },
          ],
          note: x(
            "Editorial charter informed by Dyer and Singh (1998), Provan and Kenis (2008) and Lumineau and Henderson (2012); not contract language.",
            "Kartë editoriale e mbështetur te Dyer e Singh (1998), Provan e Kenis (2008) dhe Lumineau e Henderson (2012); jo tekst kontrate.",
            "Redaktionelle Charta nach Dyer und Singh (1998), Provan und Kenis (2008) sowie Lumineau und Henderson (2012); kein Vertragstext."),
          source: ["dyer-singh-1998", "provan-kenis-2008", "lumineau-henderson-2012"],
        },
        {
          id: "vi-protocol", layer: "protocol",
          title: [x("Test, learn,", "Provo, mëso,", "Prüfen, lernen,"), x("renegotiate", "rinegocio", "neu verhandeln")],
          lead: x(
            "A proposal for a 30/60/90-day partnership review, not a research-validated universal schedule.",
            "Një propozim për një rishikim partneriteti 30/60/90-ditor, jo një kalendar universal i vërtetuar nga kërkimi.",
            "Ein Vorschlag für ein 30/60/90-Tage-Partnerschaftsreview, kein durch Forschung bestätigter universeller Zeitplan."),
          blocks: [
            { type: "p", text: x(
              "A partnership-improvement effort can begin with a bounded pilot. Select one agreed service interface and obtain approval from both organisations. Exchange only necessary information through a permitted channel. Establish the baseline through a small sample of cases before introducing any change; the evidence should include both timely completion and the quality of exception closure. The time points below are practical checkpoints proposed by this publication, not thresholds established by the cited studies.",
              "Një përpjekje për përmirësimin e partneritetit mund të nisë me një pilot të kufizuar. Zgjidh një ndërfaqe shërbimi të rënë dakord dhe merr miratimin e të dyja organizatave. Shkëmbe vetëm informacionin e nevojshëm përmes një kanali të lejuar. Përcakto pikën e nisjes me një mostër të vogël rastesh para se të futësh ndonjë ndryshim; prova duhet të përfshijë si përfundimin në kohë, ashtu edhe cilësinë e mbylljes së përjashtimeve. Pikat kohore më poshtë janë kontrolle praktike të propozuara nga ky botim, jo pragje të vendosura nga studimet e cituara.",
              "Eine Verbesserung kann mit einem begrenzten Pilot beginnen: eine vereinbarte Schnittstelle, mit Zustimmung beider Organisationen. Nur nötige Informationen über einen erlaubten Kanal austauschen. Vor jeder Änderung den Ausgangsstand an einer kleinen Stichprobe von Fällen festhalten; die Belege sollten pünktliche Erledigung und die Qualität des Ausnahmeabschlusses umfassen. Die Zeitpunkte sind Prüfpunkte dieser Publikation, keine Schwellen aus den Studien.") },
            { type: "steps", items: [
              { h: x("Day 30", "Dita 30", "Tag 30"), p: x("Do the partners read the same status the same way? Confirm both sides receive useful updates.", "A e lexojnë partnerët të njëjtin status njësoj? Konfirmo që të dyja palët marrin përditësime të dobishme.", "Lesen beide denselben Status gleich? Erhalten beide nützliche Updates?") },
              { h: x("Day 60", "Dita 60", "Tag 60"), p: x("Look for repeat exceptions and hidden dependence on specific contacts.", "Kërko përjashtime që përsëriten dhe varësi të fshehur nga kontakte të caktuara.", "Wiederkehrende Ausnahmen und versteckte Abhängigkeit von Kontakten suchen.") },
              { h: x("Day 90", "Dita 90", "Tag 90"), p: x("Decide whether to adopt, revise or stop the pilot, or whether a contractual decision is needed.", "Vendos nëse piloti miratohet, rishikohet apo ndalet, ose nëse duhet një vendim kontraktual.", "Pilot übernehmen, ändern oder beenden, oder eine Vertragsentscheidung anstoßen.") },
            ] },
            { type: "p", text: x(
              "The unit of analysis must stay clear. A claim about a reseller network requires data about that network; a claim about contracted last-mile transport requires its own records and permission. Industrial buyer-supplier studies may inform hypotheses, not prove them elsewhere. The outcome of the review is a decision, not a score alone: keep an interface that works, redesign one that creates repeated avoidable work, escalate any matter that belongs to formal governance, and if results are inconclusive, say so.",
              "Njësia e analizës duhet të mbetet e qartë. Një pohim për një rrjet rishitësish kërkon të dhëna për atë rrjet; një pohim për transportin last mile me kontratë kërkon regjistrat dhe lejen e vet. Studimet industriale blerës-furnizues mund të ushqejnë hipoteza, jo t'i provojnë diku tjetër. Rezultati i rishikimit është një vendim, jo vetëm një pikë: mbaje ndërfaqen që funksionon, riprojekto atë që krijon punë të përsëritur të shmangshme, eskaloje çdo çështje që i përket qeverisjes formale, dhe nëse rezultatet janë jopërfundimtare, thuaje.",
              "Die Analyseeinheit bleibt klar: Eine Aussage über ein Händlernetz braucht Daten dieses Netzes, eine über Last-Mile-Transport dessen eigene Unterlagen. Industrielle Käufer-Lieferanten-Studien können Hypothesen anregen, nicht anderswo beweisen. Das Ergebnis des Reviews ist eine Entscheidung, nicht nur eine Zahl: eine funktionierende Schnittstelle behalten, eine mit wiederholter vermeidbarer Arbeit neu gestalten, alles der formalen Steuerung Zugehörige eskalieren, und wenn die Ergebnisse unklar sind, das sagen.") },
            { type: "callout", reading: true, text: x(
              "Partnership reliability improves through an evidence loop, not through enthusiasm at the launch meeting.",
              "Besueshmëria e partneritetit përmirësohet përmes një cikli provash, jo përmes entuziazmit në takimin e nisjes.",
              "Partnerschaftliche Verlässlichkeit wächst durch eine Belegschleife, nicht durch Begeisterung beim Auftakttreffen.") },
          ],
          note: x(
            "All checkpoints are proposed editorial design, not empirically validated deadlines. Informed by Ring and Van de Ven (1994) and Cao and Lumineau (2015).",
            "Të gjitha pikat e kontrollit janë projektim editorial i propozuar, jo afate të vërtetuara empirikisht. Të mbështetura te Ring e Van de Ven (1994) dhe Cao e Lumineau (2015).",
            "Alle Prüfpunkte sind vorgeschlagener redaktioneller Entwurf, keine empirisch bestätigten Fristen. Nach Ring und Van de Ven (1994) sowie Cao und Lumineau (2015)."),
          source: ["ring-van-de-ven-1994", "cao-lumineau-2015"],
        },
      ],
    },

    {
      id: "tool", tool: "/tools/action-tracker/",
      kicker: x("Field tool", "Mjeti i terrenit", "Werkzeug vor Ort"),
      title: [x("One card.", "Një kartë.", "Eine Karte."), x("Two organisations.", "Dy organizata.", "Zwei Organisationen.")],
      lead: x(
        "The Partner Reliability Card: a joint conversation aid for a single, non-sensitive operating interface. Not a validated scale, legal agreement, supplier audit or authorisation to share confidential information; use it only with the relevant parties' permission.",
        "Karta e besueshmërisë së partnerit: ndihmë për një bisedë të përbashkët rreth një ndërfaqeje të vetme operacionale, jo të ndjeshme. Nuk është shkallë e vërtetuar, marrëveshje ligjore, auditim furnizuesi apo autorizim për të ndarë informacion konfidencial; përdore vetëm me lejen e palëve përkatëse.",
        "Die Partner-Verlässlichkeitskarte: eine Gesprächshilfe für eine einzelne, unsensible Betriebsschnittstelle. Keine validierte Skala, keine rechtliche Vereinbarung, kein Lieferantenaudit und keine Erlaubnis, Vertrauliches zu teilen; nur mit Erlaubnis der beteiligten Parteien nutzen."),
      blocks: [
        { type: "form", items: [
          { h: x("Shared promise", "Premtimi i përbashkët", "Gemeinsame Zusage"), hint: x("what is the verifiable outcome, and how will both sides define completion?", "cili është rezultati i verifikueshëm, dhe si do ta përcaktojnë përfundimin të dyja palët?", "was ist das prüfbare Ergebnis, und wie definieren beide Seiten Erledigung?") },
          { h: x("Interface", "Ndërfaqja", "Schnittstelle"), hint: x("what physical or information transfer must be acknowledged, and by whom?", "cili kalim fizik apo informacioni duhet konfirmuar, dhe nga kush?", "welche physische oder Informationsübergabe ist zu bestätigen, und von wem?") },
          { h: x("Authority", "Autoriteti", "Befugnis"), hint: x("which role can resolve a routine exception, and what requires formal approval?", "cili rol mund ta zgjidhë një përjashtim rutinë, dhe çfarë kërkon miratim formal?", "welche Rolle löst eine Routineausnahme, und was braucht formale Freigabe?") },
          { h: x("Communication", "Komunikimi", "Kommunikation"), hint: x("how and when will both sides learn of a changed commitment?", "si dhe kur do ta mësojnë të dyja palët një angazhim të ndryshuar?", "wie und wann erfahren beide Seiten von einer geänderten Zusage?") },
          { h: x("Evidence", "Prova", "Belege"), hint: x("which minimal, authorised records will verify completion and any open issue?", "cilët regjistra minimalë dhe të autorizuar do ta verifikojnë përfundimin dhe çdo çështje të hapur?", "welche sparsamen, befugten Unterlagen belegen Erledigung und offene Punkte?") },
          { h: x("Learning", "Mësimi", "Lernen"), hint: x("who reviews recurring gaps, and when will changes be checked again?", "kush i rishikon mangësitë që përsëriten, dhe kur do të rikontrollohen ndryshimet?", "wer prüft wiederkehrende Lücken, und wann werden Änderungen erneut geprüft?") },
        ] },
      ],
      note: x(
        "Decision gate: if confidentiality, safety, a regulatory duty or contractual authority is uncertain, use the authorised process and do not improvise a new data-sharing practice. This card is a testable editorial proposal; the Action Tracker on this site can hold the follow-up items, each with an owner and a review date.",
        "Porta e vendimit: nëse konfidencialiteti, siguria, një detyrim rregullator apo autoriteti kontraktual është i pasigurt, përdor procesin e autorizuar dhe mos improvizo një praktikë të re ndarjeje të dhënash. Kjo kartë është propozim editorial që mund të provohet; Gjurmuesi i veprimeve në këtë faqe mund t'i mbajë pikat e ndjekjes, secilën me pronar dhe datë rishikimi.",
        "Entscheidungstor: Sind Vertraulichkeit, Sicherheit, eine regulatorische Pflicht oder vertragliche Befugnis unklar, den befugten Weg nutzen und keine neue Praxis des Datenaustauschs improvisieren. Diese Karte ist ein prüfbarer redaktioneller Vorschlag; der Action Tracker dieser Website kann die Folgepunkte führen, jeden mit Verantwortlichen und Prüftermin."),
      source: ["dyer-singh-1998", "ring-van-de-ven-1994"],
    },
    {
      id: "closing",
      kicker: x("Closing essay", "Eseja e mbylljes", "Schlussessay"),
      title: [x("Outside the org chart,", "Jashtë organigramës,", "Außerhalb des Organigramms,"), x("inside the outcome", "brenda rezultatit", "innerhalb des Ergebnisses")],
      lead: x(
        "A partner is not a subordinate. The shared result still needs ownership.",
        "Partneri nuk është vartës. Rezultati i përbashkët ka sërish nevojë për pronar.",
        "Ein Partner ist kein Untergebener. Das gemeinsame Ergebnis braucht trotzdem Verantwortung."),
      blocks: [
        { type: "p", text: x(
          "The first twelve volumes of this treatise dealt largely with the internal workings of operations: seeing the process, mapping flow, protecting human judgement, maintaining standards, managing capacity, designing measures, recovering service and protecting attention. The thirteenth adds a boundary that cannot be managed away. Many vital outcomes depend on organisations that remain independent. The evidence does not support the simple choice between control and trust. Contracts, relational norms, repeated experience, joint routines and network governance each address a different part of uncertainty, and their interaction depends on context. The strongest managerial insight is therefore a design question, not a slogan: what combination of clear rights and reliable cooperation lets the partners keep honest promises? The author's wholesale and last-mile experience makes the question grounded. It does not by itself establish a causal mechanism or a performance improvement, and that discipline protects both author and reader from the illusion that every plausible scene is a documented case. The applied conclusion is concrete. Define the shared result. Verify the transfer points. Respect the autonomy and contractual rights of each party. Create an exception route that works without one indispensable individual. Test whether the customer receives the promised result, not merely whether each department or firm reports a completed action. The relationship can then be examined as an operating capability, observed in routine confirmations, in difficult updates and in the fairness of resolution when the original plan no longer holds. That is a more demanding meaning of partnership than a signature, and a more useful one than a promise of effortless trust.",
          "Dymbëdhjetë vëllimet e para të këtij traktati u morën kryesisht me punën e brendshme të operacioneve: me parjen e procesit, hartëzimin e rrjedhës, mbrojtjen e gjykimit njerëzor, ruajtjen e standardeve, menaxhimin e kapacitetit, projektimin e matjeve, rikthimin e shërbimit dhe mbrojtjen e vëmendjes. I trembëdhjeti shton një kufi që nuk menaxhohet dot për ta zhdukur. Shumë rezultate jetike varen nga organizata që mbeten të pavarura. Prova nuk e mbështet zgjedhjen e thjeshtë mes kontrollit dhe besimit. Kontratat, normat relacionale, përvoja e përsëritur, rutinat e përbashkëta dhe qeverisja e rrjetit trajtojnë secila një pjesë tjetër të pasigurisë, dhe ndërveprimi i tyre varet nga konteksti. Kuptimi më i fortë menaxherial është pra një pyetje projektimi, jo një slogan: cila përzierje e të drejtave të qarta dhe e bashkëpunimit të besueshëm i lejon partnerët t'i mbajnë premtimet e ndershme? Përvoja e autorit në shumicë dhe në last mile e bën pyetjen të bazuar. Nuk vërteton vetvetiu një mekanizëm shkakësor apo një përmirësim performance, dhe kjo disiplinë e mbron si autorin, ashtu edhe lexuesin nga iluzioni se çdo skenë e besueshme është rast i dokumentuar. Përfundimi i zbatuar është konkret. Përcakto rezultatin e përbashkët. Verifiko pikat e kalimit. Respekto autonominë dhe të drejtat kontraktuale të secilës palë. Krijo një rrugë për përjashtimet që funksionon pa një individ të pazëvendësueshëm. Provo nëse klienti e merr rezultatin e premtuar, jo thjesht nëse çdo departament apo firmë raporton një veprim të përfunduar. Atëherë marrëdhënia mund të shqyrtohet si aftësi operacionale, e vëzhguar në konfirmimet rutinë, në përditësimet e vështira dhe në drejtësinë e zgjidhjes kur plani fillestar nuk qëndron më. Ky është kuptim më i kërkueshëm i partneritetit se një nënshkrim, dhe më i dobishëm se një premtim besimi pa mund.",
          "Die ersten zwölf Bände dieses Traktats befassten sich vor allem mit dem Innenleben des Betriebs: den Prozess sehen, den Fluss abbilden, menschliches Urteil schützen, Standards halten, Kapazität steuern, Kennzahlen gestalten, Service wiederherstellen und Aufmerksamkeit schützen. Der dreizehnte fügt eine Grenze hinzu, die sich nicht wegsteuern lässt. Viele lebenswichtige Ergebnisse hängen von Organisationen ab, die unabhängig bleiben. Die Belege stützen keine einfache Wahl zwischen Kontrolle und Vertrauen. Verträge, relationale Normen, wiederholte Erfahrung, gemeinsame Routinen und Netzsteuerung behandeln je einen anderen Teil der Unsicherheit, und ihr Zusammenspiel hängt vom Kontext ab. Die stärkste Führungseinsicht ist deshalb eine Gestaltungsfrage, kein Slogan: Welche Verbindung aus klaren Rechten und verlässlicher Kooperation lässt die Partner ehrliche Zusagen halten? Die Großhandels- und Last-Mile-Erfahrung des Autors erdet die Frage. Sie belegt für sich weder einen kausalen Mechanismus noch eine Leistungsverbesserung, und diese Disziplin schützt Autor und Leser vor der Illusion, jede plausible Szene sei ein dokumentierter Fall. Die angewandte Schlussfolgerung ist konkret. Das gemeinsame Ergebnis festlegen. Die Übergabepunkte prüfen. Die Eigenständigkeit und die Vertragsrechte jeder Partei achten. Einen Ausnahmeweg schaffen, der ohne eine unentbehrliche Person funktioniert. Prüfen, ob der Kunde das zugesagte Ergebnis erhält, nicht nur, ob jede Abteilung oder Firma eine erledigte Handlung meldet. Dann lässt sich die Beziehung als betriebliche Fähigkeit betrachten, beobachtbar in Routinebestätigungen, in schwierigen Updates und in der Fairness der Lösung, wenn der ursprüngliche Plan nicht mehr hält. Das ist ein anspruchsvollerer Begriff von Partnerschaft als eine Unterschrift, und ein nützlicherer als das Versprechen mühelosen Vertrauens.") },
        { type: "callout", reading: true, text: x(
          "You can manage a department through authority. You cannot build a reliable partnership through authority alone.",
          "Një departament mund ta drejtosh me autoritet. Një partneritet të besueshëm nuk e ndërton dot vetëm me autoritet.",
          "Eine Abteilung kann man mit Autorität führen. Eine verlässliche Partnerschaft baut man nicht mit Autorität allein.") },
      ],
      note: x(
        "Editorial essay. No dispute, failure or improvement is attributed to any named partner or employer.",
        "Ese editoriale. Asnjë mosmarrëveshje, dështim apo përmirësim nuk i atribuohet ndonjë partneri apo punëdhënësi të caktuar.",
        "Redaktioneller Essay. Kein Streit, kein Versagen und keine Verbesserung wird einem benannten Partner oder Arbeitgeber zugeschrieben."),
    },
    {
      id: "method",
      kicker: x("Method", "Metoda", "Methode"),
      title: [x("Where the evidence", "Nga vjen", "Woher die Belege"), x("comes from", "prova", "stammen")],
      lead: x(
        "An evidence-informed editorial synthesis, not original field research: twelve sources, four conceptual papers, seven empirical studies and one meta-analysis, each with its limits. Scenes, protocols and the card are editorial.",
        "Një sintezë editoriale e mbështetur në prova, jo kërkim origjinal në terren: dymbëdhjetë burime, katër punime konceptuale, shtatë studime empirike dhe një meta-analizë, secili me kufijtë e vet. Skenat, protokollet dhe karta janë editoriale.",
        "Eine belegbasierte redaktionelle Synthese, keine eigene Feldforschung: zwölf Quellen, vier begriffliche Arbeiten, sieben empirische Studien und eine Metaanalyse, jede mit ihren Grenzen. Szenen, Protokolle und Karte sind redaktionell."),
      blocks: [
        { type: "rows", compact: true, items: [
          { h: x("Conceptual", "Konceptuale", "Begrifflich"), p: x("Williamson (1979), transaction costs; Ring and Van de Ven (1994), relationship processes; Dyer and Singh (1998), relational rents; Provan and Kenis (2008), network governance. They explain; they do not measure.", "Williamson (1979), kostot e transaksionit; Ring e Van de Ven (1994), proceset e marrëdhënies; Dyer e Singh (1998), renta relacionale; Provan e Kenis (2008), qeverisja e rrjetit. Shpjegojnë; nuk matin.", "Williamson (1979), Transaktionskosten; Ring und Van de Ven (1994), Beziehungsprozesse; Dyer und Singh (1998), relationale Renten; Provan und Kenis (2008), Netzsteuerung. Sie erklären; sie messen nicht.") },
          { h: x("Empirical samples", "Mostra empirike", "Empirische Stichproben"), p: x("Distributor and manufacturer firms (Anderson and Narus 1990); manufacturer-supplier relationships (Heide and John 1992); alliances 1970–1989 (Gulati 1995); 107 buyer-supplier relationships (Zaheer et al. 1998); retailers and suppliers (Jap and Ganesan 2000); information-services exchanges (Poppo and Zenger 2002); 99 disputes from one law firm (Lumineau and Henderson 2012).", "Firma shpërndarëse dhe prodhuese (Anderson e Narus 1990); marrëdhënie prodhues-furnizues (Heide e John 1992); aleanca 1970–1989 (Gulati 1995); 107 marrëdhënie blerës-furnizues (Zaheer et al. 1998); shitës me pakicë dhe furnizues (Jap e Ganesan 2000); shkëmbime shërbimesh informatike (Poppo e Zenger 2002); 99 mosmarrëveshje nga një firmë ligjore (Lumineau e Henderson 2012).", "Händler- und Herstellerfirmen (Anderson und Narus 1990); Hersteller-Lieferanten-Beziehungen (Heide und John 1992); Allianzen 1970–1989 (Gulati 1995); 107 Käufer-Lieferanten-Beziehungen (Zaheer et al. 1998); Einzelhändler und Lieferanten (Jap und Ganesan 2000); IT-Dienstleistungsbeziehungen (Poppo und Zenger 2002); 99 Streitfälle einer Kanzlei (Lumineau und Henderson 2012).") },
          { h: x("Meta-analysis", "Meta-analizë", "Metaanalyse"), p: x("149 studies, 33,051 relationships (Cao and Lumineau 2015): associations across heterogeneous research, moderated by context.", "149 studime, 33.051 marrëdhënie (Cao e Lumineau 2015): lidhje në kërkime të ndryshme, të ndikuara nga konteksti.", "149 Studien, 33.051 Beziehungen (Cao und Lumineau 2015): Zusammenhänge über heterogene Forschung, vom Kontext abhängig.") },
          { h: x("Author's background", "Sfondi i autorit", "Hintergrund des Autors"), p: x("61 resellers in Albania and last-mile partner coordination in Germany: confirmed context, not a sample; no partner data, rates or disputes are used.", "61 rishitës në Shqipëri dhe koordinim partnerësh last mile në Gjermani: kontekst i konfirmuar, jo mostër; nuk përdoren të dhëna, tarifa apo mosmarrëveshje partnerësh.", "61 Wiederverkäufer in Albanien und Koordination von Last-Mile-Partnern in Deutschland: bestätigter Kontext, keine Stichprobe; keine Partnerdaten, Preise oder Streitfälle.") },
        ] },
        { type: "p", text: x(
          "The handoff types, the three-view scorecard, the charter, the six-step protocols, the 30/60/90-day checkpoints and the Partner Reliability Card are editorial proposals for local testing, not validated controls or employer-approved procedures. Publisher records were checked for every source; where only the record or an abstract was read, the source list says so.",
          "Llojet e dorëzimit, karta me tri pamje, karta e partneritetit, protokollet me gjashtë hapa, pikat e kontrollit 30/60/90-ditore dhe Karta e besueshmërisë së partnerit janë propozime editoriale për provë lokale, jo kontrolle të vërtetuara apo procedura të miratuara nga punëdhënësi. Regjistrat e botuesve u kontrolluan për çdo burim; aty ku u lexua vetëm regjistri ose një abstrakt, lista e burimeve e thotë.",
          "Die Übergabearten, die Scorecard mit drei Sichten, die Charta, die sechsstufigen Protokolle, die 30/60/90-Tage-Prüfpunkte und die Partner-Verlässlichkeitskarte sind redaktionelle Vorschläge für die örtliche Prüfung, keine validierten Kontrollen und keine vom Arbeitgeber genehmigten Verfahren. Die Verlagsdaten jeder Quelle wurden geprüft; wo nur der Eintrag oder ein Abstract gelesen wurde, sagt es die Quellenliste.") },
      ],
      note: x(
        "Every source is cited on the next page; the twelve records, their journals, volumes, pages and years were checked against the publishers' metadata.",
        "Çdo burim citohet në faqen tjetër; dymbëdhjetë regjistrimet, revistat, vëllimet, faqet dhe vitet e tyre u kontrolluan kundrejt metadata-ve të botuesve.",
        "Jede Quelle ist auf der nächsten Seite zitiert; die zwölf Einträge, ihre Zeitschriften, Bände, Seiten und Jahre wurden an den Metadaten der Verlage geprüft."),
      source: ["williamson-1979", "anderson-narus-1990", "heide-john-1992", "ring-van-de-ven-1994", "gulati-1995", "dyer-singh-1998", "zaheer-mcevily-perrone-1998", "jap-ganesan-2000", "poppo-zenger-2002", "provan-kenis-2008", "lumineau-henderson-2012", "cao-lumineau-2015"],
    },
    { id: "sources", type: "sources" },
    { id: "back", type: "back" },
  ],
};
