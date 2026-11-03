// Management Review, No. 96: Check the AI's sources, invented citations and confident errors, and how a team checks
// AI output before it goes out. Block: AI. Facts and their sources: docs/revista/management-review-nr-96.md.
// Walters & Wilder (2023, PubMed Central), the preprint of Magesh et al. (arXiv, 2024) and the court's opinion in
// Mata v. Avianca (2023) were read in full; the version of Magesh et al. published in 2025 did not open and is not used.
// Other AI angles are in No. 10, 39, 41, 51, 61, 71, 77, 86 and treatise volume 3; they are not repeated here.
import { x, pc } from "../common.js";

export default {
  number: 96,
  block: "ai",
  date: x("November 2026", "Nëntor 2026", "November 2026"),
  theme: [x("Check the AI's sources", "Kontrollo burimet e AI-së", "Die Quellen der KI prüfen"), x("before it goes out", "para se të dalë", "bevor es rausgeht")],
  sub: x(
    "Six court decisions that never existed, how often a chatbot invented its references, why a real citation can still mislead, what legal tools built to avoid it still got wrong, and a card for the check before sending.",
    "Gjashtë vendime gjykate që nuk ekzistuan kurrë, sa shpesh një chatbot shpiku referencat e veta, pse një citim i vërtetë mund të mashtrojë prapë, çfarë gabuan mjetet ligjore të ndërtuara për ta shmangur këtë, dhe një kartë për kontrollin para dërgimit.",
    "Sechs Gerichtsentscheidungen, die es nie gab, wie oft ein Chatbot seine Belege erfand, warum ein echtes Zitat trotzdem irreführen kann, was dafür gebaute Rechtswerkzeuge dennoch falsch machten, und eine Karte für die Prüfung vor dem Versand."),
  seo: x(
    "Invented citations and confident AI errors: a court sanction, ChatGPT's references tested, legal AI tools measured, and a card to check AI output.",
    "Citime të shpikura dhe gabime të sigurta të AI-së: një sanksion gjykate, referencat e ChatGPT, mjetet ligjore të matura dhe një kartë kontrolli.",
    "Erfundene Zitate und selbstsichere KI-Fehler: eine Gerichtssanktion, geprüfte ChatGPT-Belege, gemessene Rechts-KI und eine Karte zur Prüfung."),
  feature: x(
    "In 2023 a New York court fined two lawyers and their firm for a filing that cited six decisions ChatGPT had made up. Issue 96 follows that case, then a study that checked 636 references written by two versions of ChatGPT, and a test of legal research tools marketed as avoiding such errors. It separates the false answer from the real source cited for what it does not say, and ends with the questions to ask of every source before an AI-assisted text leaves the team.",
    "Më 2023, një gjykatë në Nju Jork gjobiti dy avokatë dhe firmën e tyre për një dokument që citonte gjashtë vendime të sajuara nga ChatGPT. Numri 96 e ndjek atë rast, pastaj një studim që kontrolloi 636 referenca të shkruara nga dy versione të ChatGPT, dhe një provë të mjeteve të kërkimit ligjor të reklamuara si të lira nga gabime të tilla. Dallon përgjigjen e rreme nga burimi i vërtetë i cituar për diçka që nuk e thotë, dhe mbyllet me pyetjet për çdo burim para se një tekst i shkruar me ndihmën e AI-së të dalë nga ekipi.",
    "2023 verhängte ein New Yorker Gericht eine Strafe gegen zwei Anwälte und ihre Kanzlei für einen Schriftsatz, der sechs von ChatGPT erfundene Entscheidungen zitierte. Ausgabe 96 folgt diesem Fall, dann einer Studie, die 636 Belege zweier ChatGPT-Versionen prüfte, und einem Test von Rechtsrecherche-Werkzeugen, die damit beworben wurden, solche Fehler zu vermeiden. Sie trennt die falsche Antwort von der echten Quelle, die für etwas zitiert wird, das sie nicht sagt, und endet mit den Fragen an jede Quelle, bevor ein Text mit KI-Hilfe das Team verlässt."),
  figure: { n: pc(18), by: "Walters & Wilder, 2023", t: x(
    "of the works GPT-4 cited in 42 short literature reviews did not exist; for GPT-3.5, 55% (tested in April 2023).",
    "e veprave që GPT-4 citoi në 42 përmbledhje të shkurtra literature nuk ekzistonin; për GPT-3.5, 55% (provuar në prill 2023).",
    "der Werke, die GPT-4 in 42 kurzen Literaturübersichten zitierte, gab es nicht; bei GPT-3.5 waren es 55 % (getestet im April 2023).") },
  teasers: [
    { page: "story", kicker: x("Cover story", "Tema kryesore", "Titelthema"),
      title: x("Six cases that never were", "Gjashtë raste që s'kanë qenë kurrë", "Sechs Fälle, die es nie gab") },
    { page: "research", kicker: x("What the research says", "Çfarë thotë kërkimi", "Was die Forschung sagt"),
      title: x("Built for law, still wrong", "Të ndërtuara për ligjin, prapë gabim", "Für das Recht gebaut, trotzdem falsch") },
    { page: "tool", kicker: x("Tool of the issue", "Mjeti i numrit", "Werkzeug der Ausgabe"),
      title: x("The release check card", "Karta e kontrollit para dërgimit", "Die Karte vor dem Versand") },
  ],
  sources: ["aicheck-mata-2023", "aicheck-walters-2023", "aicheck-magesh-2024"],
  pages: [
    { id: "cover", type: "cover" },
    {
      id: "intro", type: "intro",
      why: x(
        "An AI tool writes a fluent text in seconds, with names, dates and sources that look right. Some of them are not. When that text goes out under a team's name, the team answers for it. This issue asks how often the sources are wrong, in which ways, and what a check before sending has to cover.",
        "Një mjet AI shkruan në pak sekonda një tekst të rrjedhshëm, me emra, data dhe burime që duken në rregull. Disa prej tyre nuk janë. Kur ai tekst del me emrin e ekipit, ekipi përgjigjet për të. Ky numër pyet sa shpesh burimet janë të gabuara, në cilat mënyra, dhe çfarë duhet të mbulojë kontrolli para dërgimit.",
        "Ein KI-Werkzeug schreibt in Sekunden einen flüssigen Text, mit Namen, Daten und Quellen, die richtig aussehen. Manche sind es nicht. Geht dieser Text unter dem Namen des Teams hinaus, haftet das Team dafür. Diese Ausgabe fragt, wie oft die Quellen falsch sind, auf welche Weise, und was eine Prüfung vor dem Versand abdecken muss."),
      body: x(
        "A New York court sanctioned lawyers whose filing cited six decisions that do not exist. In 84 texts written in 2023, 55% of GPT-3.5's references and 18% of GPT-4's were invented, and many real ones had wrong numbers. Legal tools built on their own databases still gave false or wrongly sourced answers to 17% to 33% of hard questions. Six questions for each source and a card close the issue.",
        "Një gjykatë në Nju Jork sanksionoi avokatë që në dokumentin e tyre citonin gjashtë vendime që nuk ekzistojnë. Në 84 tekste të shkruara më 2023, 55% e referencave të GPT-3.5 dhe 18% e atyre të GPT-4 ishin të shpikura, dhe shumë të vërteta kishin numra të gabuar. Mjetet ligjore të ndërtuara mbi bazat e tyre të të dhënave dhanë prapë përgjigje të rreme ose me burim të gabuar për 17% deri në 33% të pyetjeve të vështira. Gjashtë pyetje për çdo burim dhe një kartë e mbyllin numrin.",
        "Ein New Yorker Gericht sanktionierte Anwälte, deren Schriftsatz sechs nicht existierende Entscheidungen zitierte. In 84 Texten von 2023 waren 55 % der Belege von GPT-3.5 und 18 % der von GPT-4 erfunden, und viele echte hatten falsche Zahlen. Rechtswerkzeuge auf eigenen Datenbanken gaben auf 17 % bis 33 % schwieriger Fragen trotzdem falsche oder falsch belegte Antworten. Sechs Fragen an jede Quelle und eine Karte schließen die Ausgabe."),
    },
    {
      id: "story",
      kicker: x("Cover story", "Tema kryesore", "Titelthema"),
      title: [x("Six cases", "Gjashtë raste", "Sechs Fälle,"), x("that never were", "që s'kanë qenë kurrë", "die es nie gab")],
      lead: x(
        "A passenger sued an airline over a knee injury from a serving cart. Against a motion to dismiss, his lawyers quoted court decisions that ChatGPT had produced. The lawyer who signed had read none of them; he had checked the text for style.",
        "Një pasagjer paditi një linjë ajrore për një lëndim në gju nga një karrocë shërbimi. Kundër një kërkese për rrëzimin e padisë, avokatët e tij cituan vendime gjykatash që i kishte prodhuar ChatGPT. Avokati që nënshkroi nuk kishte lexuar asnjë prej tyre; e kishte parë tekstin vetëm për stilin.",
        "Ein Passagier verklagte eine Fluggesellschaft wegen einer Knieverletzung durch einen Servierwagen. Gegen einen Antrag auf Klageabweisung zitierten seine Anwälte Gerichtsentscheidungen, die ChatGPT erzeugt hatte. Der unterzeichnende Anwalt hatte keine davon gelesen; er hatte den Text nur auf Stil geprüft."),
      blocks: [
        { type: "timeline", items: [
          { k: x("1 Mar", "1 mars", "1. März"), t: x("The filing with the decisions goes to the court.", "Dokumenti me vendimet shkon në gjykatë.", "Der Schriftsatz mit den Entscheidungen geht ans Gericht.") },
          { k: x("15 Mar", "15 mars", "15. März"), t: x("The airline's lawyers write that they cannot find most of the cases. Nobody withdraws the filing.", "Avokatët e linjës ajrore shkruajnë se nuk i gjejnë shumicën e rasteve. Askush nuk e tërheq dokumentin.", "Die Anwälte der Fluggesellschaft schreiben, sie fänden die meisten Fälle nicht. Niemand zieht den Schriftsatz zurück.") },
          { k: x("Apr", "Prill", "April"), t: x("The court orders copies; the lawyers file excerpts and say one case cannot be found.", "Gjykata urdhëron kopje; avokatët dorëzojnë fragmente dhe thonë se një rast nuk gjendet.", "Das Gericht verlangt Kopien; die Anwälte reichen Auszüge ein und sagen, ein Fall sei nicht auffindbar.") },
          { k: x("25 May", "25 maj", "25. Mai"), t: x("First admission that ChatGPT produced the cases.", "Pranimi i parë se rastet i prodhoi ChatGPT.", "Erstes Eingeständnis, dass ChatGPT die Fälle erzeugt hat.") },
          { k: x("22 Jun", "22 qershor", "22. Juni"), t: x("Sanctions: $5,000, and letters to the client and to each judge named as author of a fake decision.", "Sanksionet: 5.000 dollarë, dhe letra për klientin dhe për çdo gjyqtar të përmendur si autor i një vendimi të rremë.", "Sanktionen: 5.000 Dollar und Briefe an den Mandanten und an jeden Richter, der als Verfasser einer Fälschung genannt war.") },
        ] },
        { type: "p", text: x(
          "Asked “Is Varghese a real case”, the chatbot said it was and could be found in the legal databases. The court weighed the sticking with the fakes after the warnings more than the first mistake.",
          "E pyetur “A është Varghese një rast i vërtetë”, chatbot-i tha që ishte dhe që gjendej në bazat e të dhënave ligjore. Gjykata peshoi më shumë qëndrimin pas rasteve të rreme pas paralajmërimeve se gabimin e parë.",
          "Auf die Frage „Ist Varghese ein echter Fall“ antwortete der Chatbot, er sei echt und in den juristischen Datenbanken zu finden. Das Gericht gewichtete das Festhalten an den Fälschungen nach den Warnungen stärker als den ersten Fehler.") },
        { type: "callout", reading: true, text: x(
          "Asking the tool whether its source is real is not a check. Opening the source is.",
          "Ta pyesësh mjetin nëse burimi i tij është i vërtetë nuk është kontroll. Kontroll është ta hapësh burimin.",
          "Das Werkzeug zu fragen, ob seine Quelle echt ist, ist keine Prüfung. Die Quelle zu öffnen, ist eine.") },
      ],
      note: x(
        "From the opinion of the US District Court for the Southern District of New York, 22 June 2023, read in full; all dates 2023. The lawyers are not named here. The court found bad faith, and found that the real cases cited mostly did not support the argument either.",
        "Nga vendimi i Gjykatës Federale të Distriktit Jugor të Nju Jorkut, 22 qershor 2023, lexuar i plotë; të gjitha datat janë të 2023-s. Avokatët nuk përmenden me emër këtu. Gjykata gjeti keqbesim, dhe gjeti se edhe rastet e vërteta të cituara kryesisht nuk e mbështetnin argumentin.",
        "Aus der Entscheidung des US-Bezirksgerichts für den Southern District of New York vom 22. Juni 2023, vollständig gelesen; alle Daten 2023. Die Anwälte werden hier nicht genannt. Das Gericht stellte Bösgläubigkeit fest und dass auch die zitierten echten Fälle das Argument meist nicht stützten."),
      source: ["aicheck-mata-2023"],
    },
    {
      id: "numbers",
      kicker: x("The numbers", "Shifrat", "Die Zahlen"),
      title: [x("636 references,", "636 referenca,", "636 Belege,"), x("checked one by one", "të kontrolluara një nga një", "einzeln geprüft")],
      lead: x(
        "In April 2023 William Walters and Esther Isabelle Wilder had GPT-3.5 and GPT-4 write short literature reviews with sources on 42 topics, from e-cigarettes to Brexit, then looked up each of the 636 works cited.",
        "Në prill 2023, William Walters dhe Esther Isabelle Wilder i vunë GPT-3.5 dhe GPT-4 të shkruanin përmbledhje të shkurtra literature me burime për 42 tema, nga cigaret elektronike te Brexit-i, pastaj kërkuan secilën nga 636 veprat e cituara.",
        "Im April 2023 ließen William Walters und Esther Isabelle Wilder GPT-3.5 und GPT-4 kurze Literaturübersichten mit Quellen zu 42 Themen schreiben, von E-Zigaretten bis Brexit, und suchten dann jedes der 636 zitierten Werke."),
      blocks: [
        { type: "pairs", from: "GPT-3.5", to: "GPT-4", max: 100, source: ["aicheck-walters-2023"],
          label: x("Cited works that do not exist, by type, 84 short reviews (2023)", "Vepra të cituara që nuk ekzistojnë, sipas llojit, 84 përmbledhje (2023)", "Zitierte Werke, die es nicht gibt, nach Art, 84 kurze Übersichten (2023)"),
          rows: [
            { k: x("All works", "Të gjitha veprat", "Alle Werke"), a: 55, an: pc(55), b: 18, bn: pc(18) },
            { k: x("Journal articles", "Artikuj në revista", "Zeitschriftenartikel"), a: 73, an: pc(73), b: 18, bn: pc(18) },
            { k: x("Book chapters", "Kapituj librash", "Buchkapitel"), a: 70, an: pc(70), b: 70, bn: pc(70), alert: true },
            { k: x("Books", "Libra", "Bücher"), a: 23, an: pc(23), b: 8, bn: pc(8) },
          ] },
        { type: "p", text: x(
          "Of the works that do exist, 43% (GPT-3.5) and 24% (GPT-4) were cited with a substantive error, most often in the numbers: the year wrong in 22% and 16%, volume, issue or pages wrong in 34% and 13% of articles and chapters. Five reviews posed as studies, with made-up methods and results.",
          "Nga veprat që ekzistojnë, 43% (GPT-3.5) dhe 24% (GPT-4) u cituan me një gabim thelbësor, më shpesh te numrat: viti i gabuar në 22% dhe 16%, vëllimi, numri ose faqet të gabuara në 34% dhe 13% të artikujve dhe kapitujve. Pesë përmbledhje u paraqitën si studime, me metoda dhe rezultate të sajuara.",
          "Von den Werken, die es gibt, wurden 43 % (GPT-3.5) und 24 % (GPT-4) mit einem inhaltlichen Fehler zitiert, meist bei den Zahlen: falsches Jahr bei 22 % und 16 %, falscher Band, falsches Heft oder falsche Seiten bei 34 % und 13 % der Artikel und Kapitel. Fünf Übersichten gaben sich als Studien aus, mit erfundenen Methoden und Ergebnissen.") },
        { type: "callout", reading: true, text: x(
          "A newer model invented fewer sources, not none. The numbers in a reference are the part to check digit by digit.",
          "Një model më i ri shpiku më pak burime, jo zero. Numrat e një reference janë pjesa që kontrollohet shifër për shifër.",
          "Ein neueres Modell erfand weniger Quellen, nicht keine. Die Zahlen eines Belegs sind der Teil, den man Ziffer für Ziffer prüft.") },
      ],
      note: x(
        "Walters & Wilder (2023), read in full: shares of 222 (GPT-3.5) and 414 (GPT-4) cited works; a work counted as real if title and authors matched or nearly matched. A test of the 2023 versions, not of today's tools.",
        "Walters & Wilder (2023), lexuar i plotë: pjesë nga 222 (GPT-3.5) dhe 414 (GPT-4) vepra të cituara; një vepër u numërua e vërtetë nëse titulli dhe autorët përputheshin ose gati përputheshin. Provë e versioneve të 2023-s, jo e mjeteve të sotme.",
        "Walters & Wilder (2023), vollständig gelesen: Anteile von 222 (GPT-3.5) und 414 (GPT-4) zitierten Werken; ein Werk galt als echt, wenn Titel und Autoren ganz oder fast übereinstimmten. Ein Test der Versionen von 2023, nicht heutiger Werkzeuge."),
      source: ["aicheck-walters-2023"],
    },
    {
      id: "model",
      kicker: x("The model", "Modeli", "Das Modell"),
      title: [x("Wrong, or", "I gabuar, apo", "Falsch oder"), x("wrongly sourced", "me burim të gabuar", "falsch belegt")],
      lead: x(
        "Varun Magesh, Daniel Ho and colleagues at Stanford and Yale judge an AI answer on two things: is it correct, and do its sources support it? An invented case is the visible failure. A real case cited for something it does not say is harder to see.",
        "Varun Magesh, Daniel Ho dhe kolegët në Stanford dhe Yale e gjykojnë një përgjigje të AI-së për dy gjëra: a është e saktë, dhe a e mbështetin burimet e saj? Një rast i shpikur është dështimi që duket. Një rast i vërtetë i cituar për diçka që nuk e thotë shihet më vështirë.",
        "Varun Magesh, Daniel Ho und Kollegen aus Stanford und Yale beurteilen eine KI-Antwort nach zwei Dingen: Ist sie richtig, und stützen ihre Quellen sie? Ein erfundener Fall ist das sichtbare Versagen. Ein echter Fall, zitiert für etwas, das er nicht sagt, ist schwerer zu sehen."),
      blocks: [
        { type: "lists", cols: [
          { h: x("Hallucinated", "Halucinacion", "Halluziniert"), accent: true, items: [
            x("Incorrect: any false statement", "E pasaktë: çdo pohim i rremë", "Falsch: jede unwahre Aussage"),
            x("Misgrounded: a source cited that does not support the claim", "Me burim të gabuar: cituar një burim që nuk e mbështet pohimin", "Falsch belegt: eine Quelle, die die Aussage nicht stützt"),
          ] },
          { h: x("Incomplete", "E paplotë", "Unvollständig"), items: [
            x("Refusal: no answer, or an irrelevant one", "Refuzim: pa përgjigje, ose një e palidhur", "Verweigerung: keine oder eine unpassende Antwort"),
            x("Ungrounded: correct, but the key claims carry no source", "Pa burim: e saktë, por pohimet kryesore s'kanë burim", "Unbelegt: richtig, aber ohne Quelle für die Kernaussagen"),
          ] },
        ] },
        { type: "p", text: x(
          "Asked for notable opinions of Judge Luther A. Wilgarten, a judge who never existed, one tool returned a real case by another judge. The citation was real; the answer was false. The authors call such errors potentially more dangerous than an invented case, “because they are subtler and more difficult to spot”.",
          "E pyetur për vendimet e shquara të gjyqtarit Luther A. Wilgarten, një gjyqtar që nuk ka ekzistuar kurrë, një mjet ktheu një rast të vërtetë të një gjyqtari tjetër. Citimi ishte i vërtetë; përgjigjja ishte e rreme. Autorët i quajnë këto gabime potencialisht më të rrezikshme se një rast i shpikur, “sepse janë më delikate dhe më të vështira për t'u vënë re”.",
          "Gefragt nach bedeutenden Urteilen von Richter Luther A. Wilgarten, den es nie gab, lieferte ein Werkzeug einen echten Fall eines anderen Richters. Das Zitat war echt, die Antwort falsch. Die Autoren nennen solche Fehler potenziell gefährlicher als einen erfundenen Fall, „weil sie subtiler und schwerer zu erkennen sind“.") },
        { type: "callout", reading: true, text: x(
          "That a source exists is the first check, not the last. The second is whether it says what the text claims.",
          "Që burimi ekziston është kontrolli i parë, jo i fundit. I dyti është nëse thotë atë që pohon teksti.",
          "Dass eine Quelle existiert, ist die erste Prüfung, nicht die letzte. Die zweite ist, ob sie sagt, was der Text behauptet.") },
      ],
      note: x(
        "Definitions from Magesh et al. (preprint, 2024). Partly correct answers count as correct; sourcing is judged only for correct answers. The two columns are the authors' labels; the wording is the editors'.",
        "Përkufizimet nga Magesh et al. (parapublikim, 2024). Përgjigjet pjesërisht të sakta numërohen të sakta; burimi gjykohet vetëm te përgjigjet e sakta. Dy kolonat janë etiketat e autorëve; fjalët janë të redaksisë.",
        "Definitionen nach Magesh et al. (Preprint, 2024). Teilweise richtige Antworten gelten als richtig; Belege werden nur bei richtigen Antworten beurteilt. Die zwei Spalten sind die Kategorien der Autoren, die Formulierung stammt von der Redaktion."),
      source: ["aicheck-magesh-2024"],
    },
    {
      id: "research",
      kicker: x("What the research says", "Çfarë thotë kërkimi", "Was die Forschung sagt"),
      title: [x("Built for law,", "Të ndërtuara për ligjin,", "Für das Recht gebaut,"), x("still wrong", "prapë gabim", "trotzdem falsch")],
      lead: x(
        "Vendors said their legal research tools, which answer from their own databases, avoid or eliminate hallucinations. In spring 2024 the same team put 202 hard legal questions, registered before testing, to three such tools and to GPT-4, and checked every answer by hand.",
        "Shitësit thoshin se mjetet e tyre të kërkimit ligjor, që përgjigjen nga bazat e veta të të dhënave, i shmangin ose i zhdukin halucinacionet. Në pranverën e 2024-s, i njëjti ekip u bëri 202 pyetje të vështira ligjore, të regjistruara para provës, tri mjeteve të tilla dhe GPT-4, dhe kontrolloi me dorë çdo përgjigje.",
        "Anbieter sagten, ihre Rechtsrecherche-Werkzeuge, die aus eigenen Datenbanken antworten, vermieden oder beseitigten Halluzinationen. Im Frühjahr 2024 stellte dasselbe Team 202 schwierige, vorab registrierte Rechtsfragen an drei solche Werkzeuge und an GPT-4 und prüfte jede Antwort von Hand."),
      blocks: [
        { type: "hbars", max: 50, source: ["aicheck-magesh-2024"],
          label: x("Answers with a hallucination, share of all answers to 202 questions (2024)", "Përgjigje me halucinacion, pjesë e të gjitha përgjigjeve për 202 pyetje (2024)", "Antworten mit Halluzination, Anteil aller Antworten auf 202 Fragen (2024)"),
          items: [
            { k: "Lexis+ AI", v: 17, n: pc(17) },
            { k: "Ask Practical Law AI", v: 17, n: pc(17) },
            { k: "Westlaw AI-Assisted Research", v: 33, n: pc(33), alert: true },
            { k: x("GPT-4, no database", "GPT-4, pa bazë të dhënash", "GPT-4, ohne Datenbank"), v: 43, n: pc(43) },
          ] },
        { type: "p", text: x(
          "The best tool answered 65% correctly and with valid sources; another left 63% incomplete. The Westlaw tool, with the most errors of the three, also wrote the longest answers, 350 words on average against 219 and 175: more claims, and more to check. The authors' conclusion: users “must continue to verify that key propositions are accurately supported by citations”.",
          "Mjeti më i mirë u përgjigj saktë dhe me burime të vlefshme në 65%; një tjetër la 63% të paplota. Mjeti i Westlaw-it, me më shumë gabime nga të tre, shkroi edhe përgjigjet më të gjata, mesatarisht 350 fjalë kundrejt 219 dhe 175: më shumë pohime, dhe më shumë për të kontrolluar. Përfundimi i autorëve: përdoruesit “duhet të vazhdojnë të verifikojnë që pohimet kryesore mbështeten saktë nga citimet”.",
          "Das beste Werkzeug antwortete in 65 % richtig und mit gültigen Quellen; ein anderes ließ 63 % unvollständig. Das Westlaw-Werkzeug, mit den meisten Fehlern der drei, schrieb auch die längsten Antworten, im Schnitt 350 Wörter gegen 219 und 175: mehr Aussagen, mehr zu prüfen. Das Fazit der Autoren: Nutzer „müssen weiterhin prüfen, ob die Kernaussagen durch die Zitate zutreffend gestützt sind“.") },
        { type: "callout", reading: true, text: x(
          "Answering from a database cut the errors against a general chatbot. It did not remove the need to read the source.",
          "Përgjigjja nga një bazë të dhënash i uli gabimet kundrejt një chatbot-i të përgjithshëm. Nuk e hoqi nevojën për ta lexuar burimin.",
          "Antworten aus einer Datenbank senkten die Fehler gegenüber einem allgemeinen Chatbot. Die Quelle lesen muss man trotzdem.") },
      ],
      note: x(
        "Magesh et al., preprint read in full; the 2025 journal version was not read. Questions were chosen to be hard, so the shares are not rates for everyday use; tools change over time. The authors' updated chart is used.",
        "Magesh et al., parapublikimi u lexua i plotë; versioni i revistës (2025) nuk u lexua. Pyetjet u zgjodhën të vështira, prandaj pjesët nuk janë norma për përdorimin e përditshëm; mjetet ndryshojnë me kohën. Përdoret grafiku i përditësuar i autorëve.",
        "Magesh et al., Preprint vollständig gelesen; die Zeitschriftenfassung von 2025 nicht. Die Fragen waren bewusst schwer, die Anteile sind also keine Raten für den Alltag; Werkzeuge ändern sich. Verwendet wird die aktualisierte Grafik der Autoren."),
      source: ["aicheck-magesh-2024"],
    },
    {
      id: "measure",
      kicker: x("How it is measured", "Si matet", "Wie es gemessen wird"),
      title: [x("Open every", "Hape çdo", "Jede Quelle"), x("source", "burim", "öffnen")],
      lead: x(
        "Magesh and colleagues describe what checking takes: click through to the source, read it, judge its authority, compare it with the claim. Six questions turn that into a count a team can keep for any text drafted with AI.",
        "Magesh dhe kolegët e përshkruajnë çfarë kërkon kontrolli: të hapësh burimin, ta lexosh, të gjykosh autoritetin e tij, ta krahasosh me pohimin. Gjashtë pyetje e kthejnë këtë në një numërim që një ekip mund ta mbajë për çdo tekst të shkruar me AI.",
        "Magesh und Kollegen beschreiben, was Prüfen heißt: zur Quelle durchklicken, sie lesen, ihre Autorität beurteilen, sie mit der Aussage vergleichen. Sechs Fragen machen daraus eine Zählung, die ein Team für jeden mit KI entworfenen Text führen kann."),
      blocks: [
        { type: "rows", compact: true, items: [
          { h: x("It exists", "Ekziston", "Es gibt sie"), p: x("the source opens; the tool's word that it exists does not count", "burimi hapet; fjala e mjetit që ekziston nuk vlen", "die Quelle öffnet sich; das Wort des Werkzeugs zählt nicht") },
          { h: x("It says so", "E thotë", "Sie sagt es"), p: x("the passage supports the claim, in the author's own voice, not a party's", "pasazhi e mbështet pohimin, me zërin e autorit, jo të një pale", "die Stelle stützt die Aussage, als Wort des Autors, nicht einer Partei") },
          { h: x("It still holds", "Vlen ende", "Sie gilt noch"), p: x("not overruled, replaced or out of date", "nuk është rrëzuar, zëvendësuar ose vjetruar", "nicht aufgehoben, ersetzt oder veraltet") },
          { h: x("It applies here", "Vlen këtu", "Sie passt hierher"), p: x("the right place, period and case", "vendi, periudha dhe rasti i duhur", "richtiger Ort, Zeitraum und Fall") },
          { h: x("The numbers match", "Numrat përputhen", "Die Zahlen stimmen"), p: x("years, pages and figures against the original", "vitet, faqet dhe shifrat me origjinalin", "Jahre, Seiten und Zahlen gegen das Original") },
          { h: x("It is marked", "Është shënuar", "Es ist markiert"), p: x("what a person checked, apart from what was generated", "çfarë kontrolloi një person, veç asaj që u gjenerua", "was ein Mensch geprüft hat, getrennt vom Erzeugten") },
        ] },
        { type: "callout", reading: true, text: x(
          "Count the claims checked against an opened source, not the minutes spent. A short draft fully checked beats a long one skimmed.",
          "Numëro pohimet e kontrolluara me një burim të hapur, jo minutat e shpenzuara. Një draft i shkurtër i kontrolluar plotësisht vlen më shumë se një i gjatë i shfletuar.",
          "Zählen Sie die an einer geöffneten Quelle geprüften Aussagen, nicht die Minuten. Ein kurzer, ganz geprüfter Entwurf schlägt einen langen, überflogenen.") },
      ],
      note: x(
        "The questions draw on the legal study's error types, Walters & Wilder's finding that numbers go wrong most, and the court's opinion; the selection is the editors'. AI at work is in No. 10, 51 and 86; trust in automated signals in treatise volume 3.",
        "Pyetjet mbështeten te llojet e gabimeve të studimit ligjor, te gjetja e Walters & Wilder se më shpesh gabohen numrat, dhe te vendimi i gjykatës; përzgjedhja është e redaksisë. AI në punë është te Nr. 10, 51 dhe 86; besimi te sinjalet automatike te vëllimi 3 i traktatit.",
        "Die Fragen stützen sich auf die Fehlerarten der Rechtsstudie, den Befund von Walters & Wilder, dass Zahlen am häufigsten falsch sind, und die Gerichtsentscheidung; die Auswahl stammt von der Redaktion. KI bei der Arbeit steht in Nr. 10, 51 und 86, Vertrauen in automatische Signale in Band 3 der Abhandlung."),
      source: ["aicheck-magesh-2024", "aicheck-walters-2023", "aicheck-mata-2023"],
    },
    {
      id: "tool", tool: "/tools/ops-report/", more: "the-report-a-machine-wrote",
      kicker: x("Tool of the issue", "Mjeti i numrit", "Werkzeug der Ausgabe"),
      title: [x("The release", "Karta e kontrollit", "Die Karte vor"), x("check card", "para dërgimit", "dem Versand")],
      lead: x(
        "One card for each text that leaves the team with machine help: a report, a summary, a letter. The Ops Report tool writes the period's report from the team's own logs; the card is the step between the draft and sending it.",
        "Një kartë për çdo tekst që del nga ekipi me ndihmën e një makine: një raport, një përmbledhje, një letër. Mjeti Ops Report e shkruan raportin e periudhës nga regjistrat e vetë ekipit; karta është hapi mes draftit dhe dërgimit.",
        "Eine Karte für jeden Text, der das Team mit Maschinenhilfe verlässt: ein Bericht, eine Zusammenfassung, ein Brief. Das Werkzeug Ops Report schreibt den Periodenbericht aus den eigenen Protokollen des Teams; die Karte ist der Schritt zwischen Entwurf und Versand."),
      blocks: [
        { type: "form", items: [
          { h: x("What goes out, to whom", "Çfarë del, te kush", "Was rausgeht, an wen"), hint: x("the text, its reader, the decision it will feed", "teksti, lexuesi, vendimi që do të ushqejë", "der Text, sein Leser, die Entscheidung, die er stützt") },
          { h: x("Claims that rest on a source", "Pohimet që mbështeten te një burim", "Aussagen mit Quelle"), hint: x("how many; each is checked, not taken from the tool", "sa janë; secili kontrollohet, nuk merret nga mjeti", "wie viele; jede wird geprüft, nicht vom Werkzeug übernommen") },
          { h: x("Sources opened and read", "Burime të hapura dhe të lexuara", "Quellen geöffnet und gelesen"), hint: x("n of N; one that will not open leaves its claim without a source", "n nga N; ai që nuk hapet e lë pohimin pa burim", "n von N; eine, die sich nicht öffnet, lässt ihre Aussage ohne Quelle") },
          { h: x("Numbers checked against the original", "Numrat të kontrolluar me origjinalin", "Zahlen am Original geprüft"), hint: x("dates, amounts, versions, pages", "data, shuma, versione, faqe", "Daten, Beträge, Versionen, Seiten") },
          { h: x("Added by the tool", "Shtuar nga mjeti", "Vom Werkzeug ergänzt"), hint: x("names, times or a “resolved” that were not in the notes", "emra, orë ose një “zgjidhur” që nuk ishin te shënimet", "Namen, Uhrzeiten oder ein „erledigt“, das nicht in den Notizen stand") },
          { h: x("Checked by, and when", "Kontrolluar nga, dhe kur", "Geprüft von, und wann"), hint: x("a name; whoever signs has read it", "një emër; kush nënshkruan e ka lexuar", "ein Name; wer unterschreibt, hat es gelesen") },
        ] },
      ],
      note: x(
        "The card is the editors' proposal, not a tested instrument; it draws on the three sources and on the linked essay, which tells the author's own rule for texts drafted with AI. Keep personal and confidential data out of tools that are not approved.",
        "Karta është propozim i redaksisë, jo instrument i testuar; mbështetet te tri burimet dhe te eseja e lidhur, që tregon rregullin e vetë autorit për tekstet e shkruara me AI. Mbaji të dhënat personale dhe konfidenciale jashtë mjeteve që nuk janë miratuar.",
        "Die Karte ist ein Vorschlag der Redaktion, kein geprüftes Instrument; sie stützt sich auf die drei Quellen und den verlinkten Essay, der die eigene Regel des Autors für KI-Entwürfe schildert. Persönliche und vertrauliche Daten gehören nicht in nicht freigegebene Werkzeuge."),
      source: ["aicheck-magesh-2024", "aicheck-walters-2023", "aicheck-mata-2023"],
    },
    { id: "sources", type: "sources" },
    { id: "back", type: "back" },
  ],
};
