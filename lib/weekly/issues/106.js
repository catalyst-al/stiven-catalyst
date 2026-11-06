// Management Review, No. 106: AI that screens CVs, what a test of bias found and what the EU AI Act asks of AI in
// recruitment. Block: AI. Facts and their sources: docs/revista/management-review-nr-106.md. Wilson & Caliskan (AIES
// 2024) was read in full in arXiv version 3 (30 August 2026), which carries the authors' correction of the
// gender-only results; Regulation (EU) 2024/1689 and the Digital Omnibus (EU) 2026/1744 were read in the Official
// Journal text. The AI Act in general, its dates and Article 26 are No. 41; algorithmic management No. 61; the
// structured interview No. 65; monitoring No. 71. This issue keeps to screening and recruitment. Not legal advice.
import { x, pc } from "../common.js";

// "85.1%" in English, "85,1%" in Albanian and "85,1 %" in German.
const pcd = (n) => x(`${n}%`, `${n.replace(".", ",")}%`, `${n.replace(".", ",")} %`);

export default {
  number: 106,
  block: "ai",
  date: x("November 2026", "Nëntor 2026", "November 2026"),
  theme: [x("AI that screens CVs:", "AI që shqyrton CV-të:", "KI, die Lebensläufe sichtet:"), x("the test and the law", "testi dhe ligji", "der Test und das Gesetz")],
  sub: x(
    "The same CV under different names, the group that lost most, what the AI Act asks of providers and employers, a result that turned around with one design choice, a way to test your own screen, and a card.",
    "E njëjta CV me emra të ndryshëm, grupi që humbi më shumë, çfarë kërkon AI Act nga ofruesit dhe punëdhënësit, një rezultat që u kthye me një zgjedhje të vetme, një mënyrë për të testuar filtrin tënd, dhe një kartë.",
    "Derselbe Lebenslauf unter anderen Namen, die Gruppe, die am meisten verlor, was die KI-Verordnung von Anbietern und Arbeitgebern verlangt, ein Ergebnis, das eine Designentscheidung umkehrte, ein Test für das eigene System und eine Karte."),
  seo: x(
    "AI CV screening: a 2024 test of bias by race and gender, the EU AI Act's rules for AI in recruitment, how to test a screen with swapped names, and a card.",
    "Shqyrtimi i CV-ve me AI: një test i 2024-s për paragjykimin, rregullat e AI Act për rekrutimin, si testohet një filtër me emra të ndërruar, dhe një kartë.",
    "KI-Sichtung von Lebensläufen: ein Test zu Verzerrung 2024, die Regeln der KI-Verordnung für Recruiting, ein Test mit getauschten Namen und eine Karte."),
  feature: x(
    "Two researchers at the University of Washington gave three AI models the same CVs, changing only the name at the top, and asked which CVs best fitted real job ads. CVs with names associated with White people were favoured in 85.1% of the tests; those with Black men's names never beat White men's. Issue 106 reads the study and its correction of 2026, then the rules the EU AI Act sets for AI that filters or ranks applicants: what the provider must check, what the employer must do, and when an employer becomes the provider. It ends with a name-swap test and a card for any system that screens CVs.",
    "Dy kërkues në Universitetin e Washingtonit u dhanë tri modeleve AI të njëjtat CV, duke ndryshuar vetëm emrin në krye, dhe pyetën cilat CV u përshtateshin më mirë njoftimeve të vërteta për punë. CV-të me emra që lidhen me të bardhët u preferuan në 85,1% të testeve; ato me emra burrash zezakë nuk fituan kurrë ndaj atyre me emra burrash të bardhë. Numri 106 lexon studimin dhe korrigjimin e tij të 2026-s, pastaj rregullat që vendos AI Act i BE-së për AI-në që filtron ose rendit kandidatët: çfarë duhet të kontrollojë ofruesi, çfarë duhet të bëjë punëdhënësi, dhe kur punëdhënësi bëhet vetë ofrues. Mbyllet me një test me emra të ndërruar dhe një kartë për çdo sistem që shqyrton CV.",
    "Zwei Forschende der University of Washington gaben drei KI-Modellen dieselben Lebensläufe, nur der Name oben war anders, und fragten, welche am besten zu echten Stellenanzeigen passten. Lebensläufe mit Namen, die mit Weißen verbunden werden, wurden in 85,1 % der Tests bevorzugt; die mit Namen Schwarzer Männer schlugen die weißer Männer nie. Ausgabe 106 liest die Studie und ihre Korrektur von 2026, dann die Regeln der EU-KI-Verordnung für KI, die Bewerbungen filtert oder reiht: was der Anbieter prüfen, was der Arbeitgeber tun muss und wann ein Arbeitgeber selbst Anbieter wird. Am Ende stehen ein Test mit getauschten Namen und eine Karte für jedes System, das Lebensläufe sichtet."),
  figure: { n: pcd("85.1"), by: "Wilson & Caliskan, 2024", t: x(
    "of tests favoured CVs with White-associated names over the same CVs with Black-associated names; 8.6% the reverse.",
    "e testeve preferuan CV-të me emra që lidhen me të bardhët ndaj të njëjtave CV me emra që lidhen me zezakët; 8,6% e kundërta.",
    "der Tests bevorzugten Lebensläufe mit weiß konnotierten Namen gegenüber denselben mit Schwarz konnotierten; 8,6 % umgekehrt.") },
  teasers: [
    { page: "story", kicker: x("Cover story", "Tema kryesore", "Titelthema"),
      title: x("Same CV, another name", "E njëjta CV, një emër tjetër", "Derselbe Lebenslauf, ein anderer Name") },
    { page: "model", kicker: x("The model", "Modeli", "Das Modell"),
      title: x("What the AI Act asks", "Çfarë kërkon AI Act", "Was die KI-Verordnung verlangt") },
    { page: "tool", kicker: x("Tool of the issue", "Mjeti i numrit", "Werkzeug der Ausgabe"),
      title: x("A card for a CV screen", "Një kartë për një filtër CV-sh", "Eine Karte für ein Sichtungssystem") },
  ],
  sources: ["cvscreen-wilson-2024", "aiact-reg-2024", "aiact-omnibus-2026"],
  pages: [
    { id: "cover", type: "cover" },
    {
      id: "intro", type: "intro",
      why: x(
        "Many applications are read by software before a person sees them, and language models make it cheap to add one more filter. A filter that ranks people decides who gets a look. This issue asks what a careful test found when only the name changed, and what European law now asks before such a system screens anyone.",
        "Shumë aplikime i lexon një program para se t'i shohë një njeri, dhe modelet gjuhësore e bëjnë të lirë shtimin e një filtri tjetër. Një filtër që rendit njerëz vendos kush shihet. Ky numër pyet çfarë gjeti një test i kujdesshëm kur ndryshoi vetëm emri, dhe çfarë kërkon tani ligji evropian para se një sistem i tillë të shqyrtojë dikë.",
        "Viele Bewerbungen liest eine Software, bevor ein Mensch sie sieht, und Sprachmodelle machen einen weiteren Filter billig. Ein Filter, der Menschen reiht, entscheidet, wer angesehen wird. Diese Ausgabe fragt, was ein sorgfältiger Test fand, als sich nur der Name änderte, und was europäisches Recht verlangt, bevor ein solches System jemanden sichtet."),
      body: x(
        "In a 2024 study the same CVs, under different names, were ranked against real job ads by three AI models. Names associated with White people were favoured in 85.1% of tests, and Black men's names never beat White men's. A correction in 2026 and a test with other names show how much the design matters. The AI Act counts such systems as high-risk and sets duties for providers and employers. A name-swap test and a card close the issue.",
        "Në një studim të 2024-s, të njëjtat CV, me emra të ndryshëm, u renditën nga tri modele AI ndaj njoftimeve të vërteta për punë. Emrat që lidhen me të bardhët u preferuan në 85,1% të testeve, dhe emrat e burrave zezakë nuk fituan kurrë ndaj atyre të burrave të bardhë. Një korrigjim më 2026 dhe një test me emra të tjerë tregojnë sa vlen projektimi i testit. AI Act i quan këto sisteme me rrezik të lartë dhe u vë detyra ofruesve dhe punëdhënësve. Një test me emra të ndërruar dhe një kartë e mbyllin numrin.",
        "In einer Studie von 2024 reihten drei KI-Modelle dieselben Lebensläufe unter verschiedenen Namen gegen echte Stellenanzeigen. Weiß konnotierte Namen wurden in 85,1 % der Tests bevorzugt, Namen Schwarzer Männer schlugen die weißer Männer nie. Eine Korrektur von 2026 und ein Test mit anderen Namen zeigen, wie viel am Testdesign hängt. Die KI-Verordnung stuft solche Systeme als hochriskant ein und verpflichtet Anbieter und Arbeitgeber. Ein Namenstausch-Test und eine Karte schließen die Ausgabe."),
    },
    {
      id: "story",
      kicker: x("Cover story", "Tema kryesore", "Titelthema"),
      title: [x("Same CV,", "E njëjta CV,", "Derselbe Lebenslauf,"), x("another name", "një emër tjetër", "ein anderer Name")],
      lead: x(
        "Kyra Wilson and Aylin Caliskan took 554 public CVs and 571 job ads in nine occupations, from chief executives to teachers. Each CV got a first name linked to Black or White men or women, and the surname Williams. Three open AI models, built to match texts, ranked the CVs for each ad, and the top 10% counted as selected.",
        "Kyra Wilson dhe Aylin Caliskan morën 554 CV publike dhe 571 njoftime pune në nëntë profesione, nga drejtorët ekzekutivë te mësuesit. Çdo CV mori një emër që lidhet me burra ose gra zezakë ose të bardhë, dhe mbiemrin Williams. Tri modele AI të hapura, të ndërtuara për të krahasuar tekste, i renditën CV-të për çdo njoftim, dhe 10% e para u numëruan si të përzgjedhura.",
        "Kyra Wilson und Aylin Caliskan nahmen 554 öffentliche Lebensläufe und 571 Stellenanzeigen aus neun Berufen, von Geschäftsführern bis zu Lehrkräften. Jeder Lebenslauf bekam einen Vornamen, der mit Schwarzen oder weißen Männern oder Frauen verbunden wird, und den Nachnamen Williams. Drei offene KI-Modelle für den Textabgleich reihten die Lebensläufe je Anzeige, die besten 10 % galten als ausgewählt."),
      blocks: [
        { type: "hbars", max: 100, source: ["cvscreen-wilson-2024"],
          label: x("Tests by race only, three models × nine occupations: which CVs were selected significantly more often (2024)", "Testet vetëm sipas racës, tri modele × nëntë profesione: cilat CV u përzgjodhën dukshëm më shpesh (2024)", "Tests nur nach Herkunft, drei Modelle × neun Berufe: welche Lebensläufe signifikant öfter ausgewählt wurden (2024)"),
          items: [
            { k: x("CVs with White-associated names", "CV me emra që lidhen me të bardhët", "Lebensläufe mit weiß konnotierten Namen"), v: 85.1, n: pcd("85.1"), alert: true },
            { k: x("CVs with Black-associated names", "CV me emra që lidhen me zezakët", "Lebensläufe mit Schwarz konnotierten Namen"), v: 8.6, n: pcd("8.6") },
            { k: x("No significant difference", "Pa ndryshim të rëndësishëm", "Kein signifikanter Unterschied"), v: 6.3, n: pcd("6.3") },
          ] },
        { type: "p", text: x(
          "The set-up worked as a screen: without names, CVs from the advertised occupation scored higher than others for every occupation. The only tests where Black-associated names won came from one of the three models.",
          "Ndërtimi funksionoi si filtër: pa emra, CV-të nga profesioni i njoftuar morën pikë më të larta se të tjerat në çdo profesion. Të vetmet teste ku fituan emrat që lidhen me zezakët erdhën nga njëri prej tri modeleve.",
          "Der Aufbau funktionierte als Filter: Ohne Namen schnitten Lebensläufe aus dem ausgeschriebenen Beruf in jedem Beruf besser ab als andere. Die einzigen Tests, in denen Schwarz konnotierte Namen gewannen, stammten von einem der drei Modelle.") },
        { type: "callout", reading: true, text: x(
          "Nothing in these CVs differed but the name. Whatever the models preferred, it was not the work.",
          "Asgjë në këto CV nuk ndryshonte përveç emrit. Çfarëdo që preferuan modelet, nuk ishte puna.",
          "In diesen Lebensläufen unterschied sich nur der Name. Was immer die Modelle bevorzugten, die Arbeit war es nicht.") },
      ],
      note: x(
        "Wilson & Caliskan (2024), figure 4. A simulation with US names and occupations, not an audit of a tool in use; CVs were cut at 1,300 tokens. Shares are of 27 chi-square tests at p < 0.05. Names signal race and gender only roughly, as the authors note.",
        "Wilson & Caliskan (2024), figura 4. Një simulim me emra dhe profesione amerikane, jo kontroll i një mjeti në përdorim; CV-të u prenë te 1.300 tokena. Pjesët janë nga 27 teste chi-katror me p < 0,05. Emrat e sinjalizojnë racën dhe gjininë vetëm përafërsisht, siç shënojnë autorët.",
        "Wilson & Caliskan (2024), Abbildung 4. Eine Simulation mit US-Namen und -Berufen, keine Prüfung eines eingesetzten Werkzeugs; Lebensläufe wurden bei 1.300 Tokens gekürzt. Anteile an 27 Chi-Quadrat-Tests bei p < 0,05. Namen zeigen Herkunft und Geschlecht nur grob an, wie die Forschenden anmerken."),
      source: ["cvscreen-wilson-2024"],
    },
    {
      id: "numbers",
      kicker: x("The numbers", "Shifrat", "Die Zahlen"),
      title: [x("The group that", "Grupi që humbi", "Die Gruppe, die am"), x("lost most", "më shumë", "meisten verlor")],
      lead: x(
        "The researchers then compared the four groups pair by pair, again 27 tests for each pair. The differences between White men's and White women's names were the smallest; comparisons that included Black names showed larger ones.",
        "Kërkuesit pastaj i krahasuan katër grupet çift më çift, përsëri 27 teste për çdo çift. Ndryshimet mes emrave të burrave dhe grave të bardha ishin më të voglat; krahasimet që përfshinin emra zezakësh treguan ndryshime më të mëdha.",
        "Dann verglichen die Forschenden die vier Gruppen paarweise, wieder 27 Tests je Paar. Die Unterschiede zwischen Namen weißer Männer und weißer Frauen waren am kleinsten; Vergleiche mit Schwarz konnotierten Namen zeigten größere."),
      blocks: [
        { type: "hbars", max: 100, source: ["cvscreen-wilson-2024"],
          label: x("Share of 27 tests in which the first group's CVs were selected significantly more often (2024)", "Pjesa e 27 testeve ku CV-të e grupit të parë u përzgjodhën dukshëm më shpesh (2024)", "Anteil von 27 Tests, in denen Lebensläufe der ersten Gruppe signifikant öfter ausgewählt wurden (2024)"),
          items: [
            { k: x("White men over Black men", "Burra të bardhë ndaj burrave zezakë", "Weiße Männer vor Schwarzen Männern"), v: 100, n: pc(100), alert: true },
            { k: x("Black women over Black men", "Gra zezake ndaj burrave zezakë", "Schwarze Frauen vor Schwarzen Männern"), v: 66.7, n: pcd("66.7") },
            { k: x("White women over Black women", "Gra të bardha ndaj grave zezake", "Weiße Frauen vor Schwarzen Frauen"), v: 48.1, n: pcd("48.1") },
            { k: x("Black women over White women", "Gra zezake ndaj grave të bardha", "Schwarze Frauen vor weißen Frauen"), v: 25.9, n: pcd("25.9") },
            { k: x("White women over White men", "Gra të bardha ndaj burrave të bardhë", "Weiße Frauen vor weißen Männern"), v: 25.9, n: pcd("25.9") },
            { k: x("White men over White women", "Burra të bardhë ndaj grave të bardha", "Weiße Männer vor weißen Frauen"), v: 18.5, n: pcd("18.5") },
          ] },
        { type: "p", text: x(
          "Black men's names were preferred to Black women's in 14.8% of tests and to White men's in none. The authors note that this follows what field studies of hiring have long found, and that the bias against one group is not the sum of a race effect and a gender effect.",
          "Emrat e burrave zezakë u preferuan ndaj atyre të grave zezake në 14,8% të testeve dhe ndaj atyre të burrave të bardhë në asnjë. Autorët shënojnë se kjo ndjek atë që studimet në terren për punësimin kanë gjetur prej kohësh, dhe se paragjykimi ndaj një grupi nuk është shuma e një efekti race dhe një efekti gjinie.",
          "Namen Schwarzer Männer wurden in 14,8 % der Tests denen Schwarzer Frauen vorgezogen, denen weißer Männer in keinem. Die Forschenden merken an, dass dies dem entspricht, was Feldstudien zur Einstellung seit Langem finden, und dass die Verzerrung gegen eine Gruppe nicht die Summe eines Herkunfts- und eines Geschlechtseffekts ist.") },
        { type: "callout", reading: true, text: x(
          "A check by race alone and by gender alone can miss the group that loses most. Test the combinations.",
          "Një kontroll vetëm sipas racës dhe vetëm sipas gjinisë mund ta humbasë grupin që humbet më shumë. Testo kombinimet.",
          "Eine Prüfung nur nach Herkunft und nur nach Geschlecht kann die Gruppe übersehen, die am meisten verliert. Prüfen Sie die Kombinationen.") },
      ],
      note: x(
        "Wilson & Caliskan (2024), figures 6–9; 20 names per group. The rest of each 100% is tests with no significant difference. These intersectional results were not affected by the 2026 correction and were replicated by a team at the University of Salzburg.",
        "Wilson & Caliskan (2024), figurat 6–9; 20 emra për grup. Pjesa tjetër e çdo 100% janë teste pa ndryshim të rëndësishëm. Këto rezultate të kryqëzuara nuk u prekën nga korrigjimi i 2026-s dhe u përsëritën nga një ekip i Universitetit të Salzburgut.",
        "Wilson & Caliskan (2024), Abbildungen 6–9; 20 Namen je Gruppe. Der Rest zu 100 % sind Tests ohne signifikanten Unterschied. Diese intersektionalen Ergebnisse betraf die Korrektur von 2026 nicht; ein Team der Universität Salzburg hat sie repliziert."),
      source: ["cvscreen-wilson-2024"],
    },
    {
      id: "model", more: "the-system-is-faster-than-you",
      kicker: x("The model", "Modeli", "Das Modell"),
      title: [x("What the AI Act", "Çfarë kërkon", "Was die KI-Verordnung"), x("asks", "AI Act", "verlangt")],
      lead: x(
        "Annex III, point 4(a) lists AI meant for recruitment or selection, in particular to target job ads, to analyse and filter applications and to evaluate candidates. Such systems are high-risk; the rules apply from 2 December 2027. Here is what falls on each side.",
        "Aneksi III, pika 4(a) rendit AI-në që synohet për rekrutim ose përzgjedhje, veçanërisht për njoftime pune të synuara, për analizimin dhe filtrimin e aplikimeve dhe për vlerësimin e kandidatëve. Këto sisteme janë me rrezik të lartë; rregullat zbatohen nga 2 dhjetori 2027. Ja çfarë bie mbi secilën palë.",
        "Anhang III Nummer 4 Buchstabe a nennt KI für Einstellung oder Auswahl, insbesondere für gezielte Stellenanzeigen, zum Analysieren und Filtern von Bewerbungen und zum Bewerten von Bewerbern. Solche Systeme sind hochriskant; die Regeln gelten ab dem 2. Dezember 2027. Das trifft jede Seite."),
      blocks: [
        { type: "lists", cols: [
          { h: x("The provider, who builds it", "Ofruesi, që e ndërton", "Der Anbieter, der es baut"), items: [
            x("Examines its data for possible biases and takes measures to detect, prevent and reduce them (Art. 10(2)(f), (g))", "I shqyrton të dhënat për paragjykime të mundshme dhe merr masa për t'i zbuluar, parandaluar dhe ulur (neni 10(2)(f), (g))", "Prüft seine Daten auf mögliche Verzerrungen, erkennt, verhindert und mindert sie (Art. 10 Abs. 2 lit. f, g)"),
            x("States accuracy and, where appropriate, results for specific groups in the instructions (13(3)(b))", "Shkruan saktësinë dhe, kur duhet, rezultatet për grupe të caktuara në udhëzimet e përdorimit (13(3)(b))", "Nennt in der Anleitung die Genauigkeit und, wo angebracht, Ergebnisse für bestimmte Gruppen (Art. 13 Abs. 3 lit. b)"),
            x("Is built so overseers stay aware of over-reliance and can override the output (14(4)(b), (d))", "Ndërtohet që mbikëqyrësit ta kenë parasysh mbështetjen e tepërt dhe ta anashkalojnë dot rezultatin (14(4)(b), (d))", "Lässt die Aufsicht übermäßiges Vertrauen im Blick behalten und das Ergebnis übergehen (Art. 14 Abs. 4 lit. b, d)"),
          ] },
          { h: x("The employer, who uses it", "Punëdhënësi, që e përdor", "Der Arbeitgeber, der es einsetzt"), accent: true, items: [
            x("Keeps the input data it controls relevant and sufficiently representative (26(4))", "I mban të dhënat hyrëse që kontrollon të përshtatshme dhe mjaftueshëm përfaqësuese (26(4))", "Hält die Eingabedaten, die er steuert, relevant und hinreichend repräsentativ (Art. 26 Abs. 4)"),
            x("Explains, when an affected candidate asks, the AI's role and the main elements of the decision (86)", "I shpjegon një kandidati të prekur, kur e kërkon, rolin e AI-së dhe elementet kryesore të vendimit (86)", "Erklärt Betroffenen auf Verlangen die Rolle der KI und die wesentlichen Elemente der Entscheidung (Art. 86)"),
            x("Can become the provider by turning a general AI system to screening CVs (25(1)(c))", "Mund të bëhet vetë ofrues kur e kthen një sistem AI të përgjithshëm në filtër CV-sh (25(1)(c))", "Kann selbst Anbieter werden, wenn er allgemeine KI zur Sichtung von Lebensläufen umwidmet (Art. 25 Abs. 1 lit. c)"),
          ] },
        ] },
        { type: "p", text: x(
          "The last line matters most for small firms: a general chatbot set to sort applicants is put to a high-risk purpose it was not placed on the market for. Article 25 then gives the firm that did so the provider's duties under Article 16.",
          "Rreshti i fundit vlen më shumë për firmat e vogla: një chatbot i përgjithshëm i vënë të rendisë kandidatët përdoret për një qëllim me rrezik të lartë për të cilin nuk u nxor në treg. Neni 25 i jep atëherë firmës që e bëri këtë detyrat e ofruesit sipas nenit 16.",
          "Die letzte Zeile zählt vor allem für kleine Firmen: Ein allgemeiner Chatbot, der Bewerbungen sortieren soll, dient einem hochriskanten Zweck, für den er nicht in Verkehr gebracht wurde. Artikel 25 gibt der Firma, die das tut, dann die Pflichten des Anbieters nach Artikel 16.") },
        { type: "callout", reading: true, text: x(
          "“A person checks it” is not oversight if that person only sees the shortlist. Oversight starts with the rejected.",
          "“E kontrollon një njeri” nuk është mbikëqyrje nëse ai njeri sheh vetëm listën e shkurtër. Mbikëqyrja nis me të refuzuarit.",
          "„Ein Mensch prüft das“ ist keine Aufsicht, wenn dieser Mensch nur die Auswahlliste sieht. Aufsicht beginnt bei den Abgelehnten.") },
      ],
      note: x(
        "Regulation (EU) 2024/1689, Articles 10, 13, 14, 16, 25, 26 and 86 and Annex III; date from Article 113 as amended by Regulation (EU) 2026/1744, which left the provisions cited here unchanged. The wording and the callout are the editors'; not legal advice. Dates, the employer's other duties and Article 6(3) are in No. 41. The linked essay is the author's view of who decides when a system decides first.",
        "Rregullorja (BE) 2024/1689, nenet 10, 13, 14, 16, 25, 26 dhe 86 dhe Aneksi III; data nga neni 113 i ndryshuar me Rregulloren (BE) 2026/1744, që dispozitat e cituara këtu i la të pandryshuara. Fjalët dhe shënimi i leximit janë të redaksisë; nuk është këshillë ligjore. Datat, detyrat e tjera të punëdhënësit dhe neni 6(3) janë te Nr. 41. Eseja e lidhur është pikëpamja e autorit për kush vendos kur sistemi vendos i pari.",
        "Verordnung (EU) 2024/1689, Artikel 10, 13, 14, 16, 25, 26 und 86 und Anhang III; Datum nach Artikel 113 in der Fassung der Verordnung (EU) 2026/1744, die die hier zitierten Bestimmungen unverändert ließ. Formulierung und Lesehinweis: Redaktion; keine Rechtsberatung. Fristen, weitere Arbeitgeberpflichten und Art. 6 Abs. 3 in Nr. 41. Der Essay: die Sicht des Autors, wer entscheidet, wenn ein System zuerst entscheidet."),
      source: ["aiact-reg-2024", "aiact-omnibus-2026"],
    },
    {
      id: "research",
      kicker: x("What the research says", "Çfarë thotë kërkimi", "Was die Forschung sagt"),
      title: [x("A result that", "Një rezultat", "Ein Ergebnis,"), x("turned around", "që u kthye", "das sich umkehrte")],
      lead: x(
        "The main test used White names that occur about 5.5 times as often in written text as the Black names, matching the population. In a second run the White names were about as frequent as the Black ones. Nothing else changed.",
        "Testi kryesor përdori emra të bardhë që shfaqen në tekste rreth 5,5 herë më shpesh se emrat e zezakëve, sipas popullsisë. Në një provë të dytë emrat e bardhë ishin afërsisht po aq të shpeshtë sa ata të zezakëve. Asgjë tjetër nuk ndryshoi.",
        "Der Haupttest nutzte weiße Namen, die in Texten etwa 5,5-mal so häufig vorkommen wie die Schwarzen, passend zur Bevölkerung. In einem zweiten Durchlauf waren die weißen Namen etwa so häufig wie die Schwarzen. Sonst änderte sich nichts."),
      blocks: [
        { type: "pairs", from: x("Names in proportion", "Emra në përpjesëtim", "Namen nach Anteil"), to: x("Names equally frequent", "Emra po aq të shpeshtë", "Namen gleich häufig"), max: 100, source: ["cvscreen-wilson-2024"],
          label: x("Share of 27 race tests won by each group, by how the names were chosen (2024)", "Pjesa e 27 testeve të racës që fitoi secili grup, sipas mënyrës si u zgjodhën emrat (2024)", "Anteil der 27 Herkunftstests, den jede Gruppe gewann, nach Wahl der Namen (2024)"),
          rows: [
            { k: x("White-associated names", "Emra që lidhen me të bardhët", "Weiß konnotierte Namen"), a: 85.1, an: pcd("85.1"), b: 22.2, bn: pcd("22.2") },
            { k: x("Black-associated names", "Emra që lidhen me zezakët", "Schwarz konnotierte Namen"), a: 8.6, an: pcd("8.6"), b: 51.9, bn: pcd("51.9"), alert: true },
          ] },
        { type: "p", text: x(
          "In August 2026 the authors added a correction: after a team at the University of Salzburg tried to replicate the study, a bug was found that had swapped the labels in the gender-only tests. Women's names, not men's, were the ones preferred in 51.9% of those tests. The race and intersectional results stood.",
          "Në gusht 2026 autorët shtuan një korrigjim: pasi një ekip i Universitetit të Salzburgut u përpoq ta përsëriste studimin, u gjet një gabim në kod që i kishte ndërruar etiketat në testet vetëm sipas gjinisë. Emrat e grave, jo të burrave, ishin ata të preferuar në 51,9% të atyre testeve. Rezultatet për racën dhe ato të kryqëzuara qëndruan.",
          "Im August 2026 ergänzten die Forschenden eine Korrektur: Nachdem ein Team der Universität Salzburg die Studie zu wiederholen versucht hatte, fand sich ein Programmfehler, der in den reinen Geschlechtertests die Bezeichnungen vertauscht hatte. Frauennamen, nicht Männernamen, wurden in 51,9 % dieser Tests bevorzugt. Die Ergebnisse zu Herkunft und Überschneidungen blieben bestehen.") },
        { type: "callout", reading: true, text: x(
          "One audit is a reading, not a verdict. Ask how the test was built, and whether anyone repeated it.",
          "Një kontroll i vetëm është një lexim, jo një vendim. Pyet si u ndërtua testi, dhe nëse e përsëriti dikush.",
          "Ein einzelnes Audit ist eine Messung, kein Urteil. Fragen Sie, wie der Test gebaut war und ob ihn jemand wiederholt hat.") },
      ],
      note: x(
        "Wilson & Caliskan (2024), arXiv version 3 (30 August 2026) with the correction note; section “Frequency effects”. The authors read the reversal as the models' sensitivity to how often a name occurs. The callout is the editors'.",
        "Wilson & Caliskan (2024), versioni 3 në arXiv (30 gusht 2026) me shënimin e korrigjimit; seksioni për efektet e shpeshtësisë. Autorët e lexojnë përmbysjen si ndjeshmëri të modeleve ndaj sa shpesh shfaqet një emër. Shënimi i leximit është i redaksisë.",
        "Wilson & Caliskan (2024), arXiv-Version 3 (30. August 2026) mit dem Korrekturhinweis; Abschnitt zu Häufigkeitseffekten. Die Forschenden deuten die Umkehr als Empfindlichkeit der Modelle für die Häufigkeit eines Namens. Der Lesehinweis stammt von der Redaktion."),
      source: ["cvscreen-wilson-2024"],
    },
    {
      id: "measure",
      kicker: x("How it is measured", "Si matet", "Wie es gemessen wird"),
      title: [x("Test your", "Testo filtrin", "Das eigene System"), x("own screen", "tënd", "testen")],
      lead: x(
        "The study's method can be turned into a test for a screen a team already uses: identical CVs that differ in one signal, run through the same step, with the selection rates compared. The steps below are the editors' proposal, not the study's.",
        "Metoda e studimit mund të kthehet në test për një filtër që një ekip e përdor tashmë: CV identike që ndryshojnë në një sinjal, të kaluara në të njëjtin hap, me normat e përzgjedhjes të krahasuara. Hapat më poshtë janë propozim i redaksisë, jo i studimit.",
        "Die Methode der Studie lässt sich in einen Test für ein bereits genutztes System verwandeln: identische Lebensläufe, die sich in einem Signal unterscheiden, durch denselben Schritt geschickt, die Auswahlquoten verglichen. Die Schritte unten sind ein Vorschlag der Redaktion, nicht der Studie."),
      blocks: [
        { type: "steps", items: [
          { h: x("Take real ads, invented CVs", "Merr njoftime të vërteta, CV të sajuara", "Echte Anzeigen, erfundene Lebensläufe"), p: x("No real applicant's data; several occupations.", "Pa të dhëna të kandidatëve të vërtetë; disa profesione.", "Keine Daten echter Bewerber; mehrere Berufe.") },
          { h: x("Change one signal only", "Ndrysho vetëm një sinjal", "Nur ein Signal ändern"), p: x("A name, a women's club, a school, an age; and their combinations.", "Një emër, një klub grash, një shkollë, një moshë; dhe kombinimet e tyre.", "Ein Name, ein Frauenverein, eine Schule, ein Alter; und Kombinationen.") },
          { h: x("Keep your real cut-off", "Mbaj kufirin tënd të vërtetë", "Die echte Grenze behalten"), p: x("The share that a person actually reads, such as the top 10%.", "Pjesa që lexon vërtet një njeri, si 10% e para.", "Den Anteil, den wirklich ein Mensch liest, etwa die besten 10 %.") },
          { h: x("Compare selection rates", "Krahaso normat e përzgjedhjes", "Auswahlquoten vergleichen"), p: x("Per group and per combination; then vary length and wording.", "Për grup dhe për kombinim; pastaj ndrysho gjatësinë dhe fjalët.", "Je Gruppe und Kombination; dann Länge und Wortwahl variieren.") },
          { h: x("Report it", "Raportoje", "Melden"), p: x("Keep the record; tell the provider of any risk (Art. 26(5)).", "Ruaje regjistrin; njofto ofruesin për çdo rrezik (neni 26(5)).", "Protokoll aufbewahren; den Anbieter über Risiken informieren (Art. 26 Abs. 5).") },
        ] },
        { type: "callout", reading: true, text: x(
          "A screen that was never tested with a swapped name has no known bias, which is not the same as none.",
          "Një filtër që nuk u testua kurrë me një emër të ndërruar nuk ka paragjykim të njohur, që nuk është njësoj si pa paragjykim.",
          "Ein System, das nie mit getauschtem Namen getestet wurde, hat keine bekannte Verzerrung, was nicht dasselbe ist wie keine.") },
      ],
      note: x(
        "Proposal of the editors, modelled on Wilson & Caliskan (2024), who also changed CV length and found it altered results. Since July 2026, Article 4a lets employers using high-risk AI process sensitive data to detect bias, under strict conditions; it creates no duty to do so. The structured interview is in No. 65.",
        "Propozim i redaksisë, sipas modelit të Wilson & Caliskan (2024), që ndryshuan edhe gjatësinë e CV-ve dhe gjetën se kjo i ndryshonte rezultatet. Që nga korriku 2026, neni 4a u lejon punëdhënësve që përdorin AI me rrezik të lartë të përpunojnë të dhëna të ndjeshme për të zbuluar paragjykimin, me kushte të rrepta; nuk krijon detyrim. Intervista e strukturuar është te Nr. 65.",
        "Vorschlag der Redaktion nach dem Vorbild von Wilson & Caliskan (2024), die auch die Länge der Lebensläufe änderten und damit die Ergebnisse veränderten. Seit Juli 2026 erlaubt Artikel 4a Arbeitgebern mit Hochrisiko-KI, sensible Daten zur Erkennung von Verzerrungen unter strengen Bedingungen zu verarbeiten; eine Pflicht dazu entsteht nicht. Das strukturierte Interview steht in Nr. 65."),
      source: ["cvscreen-wilson-2024", "aiact-reg-2024", "aiact-omnibus-2026"],
    },
    {
      id: "tool", tool: "/tools/ats-cv/",
      kicker: x("Tool of the issue", "Mjeti i numrit", "Werkzeug der Ausgabe"),
      title: [x("A card for", "Një kartë për", "Eine Karte für ein"), x("a CV screen", "një filtër CV-sh", "Sichtungssystem")],
      lead: x(
        "One card for each system that reads applications before a person does. The ATS CV tool shows the other side: how application software reads a CV, and what a candidate can do so it is read correctly.",
        "Një kartë për çdo sistem që i lexon aplikimet para një njeriu. Mjeti ATS CV tregon anën tjetër: si e lexon një CV programi i aplikimeve, dhe çfarë mund të bëjë kandidati që ajo të lexohet saktë.",
        "Eine Karte für jedes System, das Bewerbungen vor einem Menschen liest. Das Werkzeug ATS CV zeigt die andere Seite: wie Bewerbungssoftware einen Lebenslauf liest und was Bewerber tun können, damit er richtig gelesen wird."),
      blocks: [
        { type: "form", items: [
          { h: x("System and its intended purpose", "Sistemi dhe qëllimi i tij", "System und Zweckbestimmung"), hint: x("built for recruitment, or a general tool we turned to it?", "i ndërtuar për rekrutim, apo mjet i përgjithshëm që e kthyem në të?", "für Recruiting gebaut oder ein allgemeines Werkzeug, das wir umgewidmet haben?") },
          { h: x("What it does in the process", "Çfarë bën në proces", "Was es im Ablauf tut"), hint: x("targets ads, filters, ranks or scores; where a person comes in", "synon njoftime, filtron, rendit apo vlerëson; ku hyn një njeri", "Anzeigen steuern, filtern, reihen oder bewerten; wo ein Mensch eingreift") },
          { h: x("Who sees the rejected", "Kush i sheh të refuzuarit", "Wer die Abgelehnten sieht"), hint: x("a name, how many are reviewed, who may override", "një emër, sa rishikohen, kush mund ta anashkalojë", "ein Name, wie viele geprüft werden, wer übergehen darf") },
          { h: x("Last swapped-name test", "Testi i fundit me emër të ndërruar", "Letzter Test mit getauschtem Namen"), hint: x("date, signals and combinations tested, result, sent to provider", "data, sinjalet dhe kombinimet, rezultati, dërguar ofruesit", "Datum, Signale und Kombinationen, Ergebnis, an den Anbieter") },
          { h: x("Our input data", "Të dhënat tona hyrëse", "Unsere Eingabedaten"), hint: x("ads and criteria we feed it: relevant to the job?", "njoftimet dhe kriteret që i japim: të lidhura me punën?", "Anzeigen und Kriterien, die wir eingeben: für die Stelle relevant?") },
          { h: x("Candidates told and explained", "Kandidatët të njoftuar dhe me shpjegim", "Bewerber informiert, Erklärung"), hint: x("where they learn AI is used; who answers a request", "ku mësojnë se përdoret AI; kush i përgjigjet një kërkese", "wo sie vom KI-Einsatz erfahren; wer Anfragen beantwortet") },
        ] },
      ],
      note: x(
        "The card is the editors' proposal, built on Articles 14, 25, 26 and 86 of the AI Act and on the method of Wilson & Caliskan (2024); it is not a tested instrument and not legal advice. The employer's duties before use, such as informing workers' representatives, are in No. 41.",
        "Karta është propozim i redaksisë, i ndërtuar mbi nenet 14, 25, 26 dhe 86 të AI Act dhe mbi metodën e Wilson & Caliskan (2024); nuk është instrument i testuar dhe as këshillë ligjore. Detyrat e punëdhënësit para përdorimit, si informimi i përfaqësuesve të punonjësve, janë te Nr. 41.",
        "Die Karte ist ein Vorschlag der Redaktion, gestützt auf die Artikel 14, 25, 26 und 86 der KI-Verordnung und die Methode von Wilson & Caliskan (2024); sie ist kein geprüftes Instrument und keine Rechtsberatung. Pflichten des Arbeitgebers vor dem Einsatz, etwa die Information der Arbeitnehmervertretung, stehen in Nr. 41."),
      source: ["aiact-reg-2024", "cvscreen-wilson-2024"],
    },
    { id: "sources", type: "sources" },
    { id: "back", type: "back" },
  ],
};
