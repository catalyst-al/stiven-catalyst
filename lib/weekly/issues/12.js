// Management Review, No. 12: OKRs and KPIs, when to use which. Block: KPIs.
// Facts and their sources: docs/revista/management-review-nr-12.md.
import { x, pc } from "../common.js";

export default {
  number: 12,
  block: "kpi",
  date: x("October 2026", "Tetor 2026", "Oktober 2026"),
  theme: [x("OKRs and KPIs:", "OKR dhe KPI:", "OKR und KPI:"), x("when to use which", "kur përdoret secili", "wann welches passt")],
  sub: x(
    "Why OKRs and KPIs are two tools and not two names for one list, where both come from, how an OKR is scored, and what goes wrong when one does the other's job.",
    "Pse OKR dhe KPI janë dy mjete dhe jo dy emra për të njëjtën listë, nga vijnë, si vlerësohet një OKR, dhe çfarë prishet kur njëri bën punën e tjetrit.",
    "Warum OKR und KPI zwei Werkzeuge sind und nicht zwei Namen für eine Liste, woher sie kommen, wie ein OKR bewertet wird und was schiefgeht, wenn eins den Job des anderen macht."),
  seo: x(
    "OKRs and KPIs: Andy Grove's indicators and objectives, Doerr and Google's guide, 0.0–1.0 scoring, what research shows, common mix-ups and an OKR card.",
    "OKR dhe KPI: treguesit dhe objektivat e Andy Grove, Doerr dhe guida e Google, nota 0,0–1,0, çfarë tregon kërkimi, ngatërresat dhe një kartë OKR.",
    "OKR und KPI: Andy Groves Indikatoren und Ziele, Doerr und Googles Leitfaden, Bewertung von 0,0 bis 1,0, was die Forschung zeigt, Verwechslungen und eine Karte."),
  feature: x(
    "Issue 12 goes back to the book where both tools began, compares what each one is for, looks at how thin the research on OKRs still is, and ends with a card that keeps the KPIs in view while the team aims higher.",
    "Numri 12 kthehet te libri ku nisën të dy mjetet, krahason për çfarë shërben secili, shikon sa e hollë është ende kërkimi për OKR-të, dhe mbyllet me një kartë që i mban KPI-të para syve ndërsa ekipi synon më lart.",
    "Ausgabe 12 geht zurück zu dem Buch, in dem beide Werkzeuge begannen, vergleicht, wofür jedes da ist, zeigt, wie dünn die Forschung zu OKR noch ist, und endet mit einer Karte, die die KPIs im Blick behält, während das Team höher zielt."),
  figure: { n: x("60–70%", "60–70%", "60–70 %"), by: "Google re:Work", t: x(
    "is the sweet spot for an OKR score in Google's guide. A team that always reaches 100% is not aiming high enough.",
    "është zona e mirë për notën e një OKR-je te guida e Google. Ekipi që arrin gjithmonë 100% nuk synon mjaft lart.",
    "ist der ideale Bereich für eine OKR-Bewertung in Googles Leitfaden. Ein Team, das immer 100 % erreicht, zielt nicht hoch genug.") },
  teasers: [
    { page: "story", kicker: x("Cover story", "Tema kryesore", "Titelthema"),
      title: x("Two tools from one book", "Dy mjete nga një libër", "Zwei Werkzeuge aus einem Buch") },
    { page: "risk", kicker: x("The risk", "Rreziku", "Das Risiko"),
      title: x("When one does the other's job", "Kur njëri bën punën e tjetrit", "Wenn eins den Job des anderen macht") },
    { page: "tool", kicker: x("Tool of the issue", "Mjeti i numrit", "Werkzeug der Ausgabe"),
      title: x("The OKR card", "Karta OKR", "Die OKR-Karte") },
  ],
  sources: ["grove-1983", "doerr-2018", "doerr-ted-2018", "rework-okr", "klau-2013", "silva-santos-2024", "butler-2024"],
  pages: [
    { id: "cover", type: "cover" },
    {
      id: "intro", type: "intro",
      why: x(
        "Many teams use OKRs and KPIs as two names for the same list of numbers. This issue is about why they are two different tools, and what goes wrong when one is asked to do the other's job.",
        "Shumë ekipe i përdorin OKR dhe KPI si dy emra për të njëjtën listë numrash. Ky numër flet për arsyen pse janë dy mjete të ndryshme, dhe për atë që prishet kur njërit i kërkohet të bëjë punën e tjetrit.",
        "Viele Teams verwenden OKR und KPI als zwei Namen für dieselbe Liste von Zahlen. Diese Ausgabe handelt davon, warum es zwei verschiedene Werkzeuge sind und was schiefgeht, wenn eins den Job des anderen machen soll."),
      body: x(
        "Andy Grove described both in the same book in 1983: indicators that keep a running operation in view, and objectives with key results that set a direction. John Doerr took the second to Google in 1999. Google's guide asks for few objectives, scored from 0.0 to 1.0, with 60–70% as the sweet spot. The research is thinner than the enthusiasm: a 2024 review found 47 studies and called the literature still scarce.",
        "Andy Grove i përshkroi të dy në të njëjtin libër në 1983: treguesit që e mbajnë para syve punën që po ecën, dhe objektivat me rezultate kyçe që japin drejtimin. John Doerr e çoi të dytin te Google në 1999. Guida e Google kërkon pak objektiva, me notë nga 0,0 deri në 1,0, dhe 60–70% si zonë të mirë. Kërkimi është më i hollë se entuziazmi: një rishikim i 2024 gjeti 47 studime dhe e quajti literaturën ende të pakët.",
        "Andy Grove beschrieb beide 1983 im selben Buch: Indikatoren, die den laufenden Betrieb im Blick halten, und Ziele mit Schlüsselergebnissen, die eine Richtung geben. John Doerr brachte das zweite 1999 zu Google. Googles Leitfaden verlangt wenige Ziele, bewertet von 0,0 bis 1,0, mit 60–70 % als idealem Bereich. Die Forschung ist dünner als die Begeisterung: Eine Übersicht von 2024 fand 47 Studien und nannte die Literatur noch spärlich."),
    },
    {
      id: "story",
      kicker: x("Cover story", "Tema kryesore", "Titelthema"),
      title: [x("Two tools", "Dy mjete", "Zwei Werkzeuge"), x("from one book", "nga një libër", "aus einem Buch")],
      lead: x(
        "In High Output Management (1983), Intel's Andy Grove wrote about two things a manager needs: indicators to watch the work as it runs, and a few objectives that say where the team should go next.",
        "Te High Output Management (1983), Andy Grove nga Intel shkroi për dy gjëra që i duhen një menaxheri: treguesit për ta ndjekur punën ndërsa ecën, dhe pak objektiva që thonë ku duhet të shkojë ekipi më pas.",
        "In High Output Management (1983) schrieb Andy Grove von Intel über zwei Dinge, die eine Führungskraft braucht: Indikatoren, um die laufende Arbeit zu beobachten, und wenige Ziele, die sagen, wohin das Team als Nächstes gehen soll."),
      blocks: [
        { type: "quote", text: x(
          "Where do I want to go? How will I pace myself to see if I am getting there?",
          "Ku dua të shkoj? Si do ta mas ecjen time për të parë nëse po shkoj atje?",
          "Wohin will ich? Wie messe ich mein Tempo, um zu sehen, ob ich dorthin komme?") },
        { type: "p", text: x(
          "Grove's two questions for objectives. The answer to the first is the objective; the answer to the second gives the key results. John Doerr learned the method at Intel in the 1970s and took it to Google's founders in 1999.",
          "Dy pyetjet e Grove për objektivat. Përgjigjja e së parës është objektivi; përgjigjja e së dytës jep rezultatet kyçe. John Doerr e mësoi metodën te Intel në vitet '70 dhe ua çoi themeluesve të Google në 1999.",
          "Groves zwei Fragen für Ziele. Die Antwort auf die erste ist das Ziel; die Antwort auf die zweite ergibt die Schlüsselergebnisse. John Doerr lernte die Methode in den 1970er-Jahren bei Intel und brachte sie 1999 zu den Gründern von Google.") },
        { type: "p", text: x(
          "For the running work, Grove used the example of a breakfast factory: which few pieces of information would its manager want to see every morning, on arriving at the office? Those are the indicators. Today most teams call them KPIs.",
          "Për punën që ecën, Grove dha shembullin e një fabrike mëngjesi: cilat pak të dhëna do të donte të shihte menaxheri i saj çdo mëngjes, sapo mbërrin në zyrë? Ata janë treguesit. Sot shumica e ekipeve i quajnë KPI.",
          "Für die laufende Arbeit nahm Grove das Beispiel einer Frühstücksfabrik: Welche wenigen Informationen würde ihr Leiter jeden Morgen sehen wollen, sobald er ins Büro kommt? Das sind die Indikatoren. Heute nennen die meisten Teams sie KPIs.") },
        { type: "timeline", items: [
          { k: "1983", t: x("Grove: indicators for the running work, objectives for the direction.", "Grove: treguesit për punën që ecën, objektivat për drejtimin.", "Grove: Indikatoren für die laufende Arbeit, Ziele für die Richtung.") },
          { k: "1999", t: x("Doerr brings OKRs to Google's founders.", "Doerr ua çon OKR-të themeluesve të Google.", "Doerr bringt OKR zu den Gründern von Google.") },
          { k: "2018", t: x("Measure What Matters makes OKRs widely known.", "Measure What Matters i bën OKR-të të njohura gjerësisht.", "Measure What Matters macht OKR weithin bekannt.") },
          { k: "2024", t: x("A review finds 47 studies: the research is still scarce.", "Një rishikim gjen 47 studime: kërkimi është ende i pakët.", "Eine Übersicht findet 47 Studien: Die Forschung ist noch spärlich.") },
        ] },
        { type: "callout", reading: true, text: x(
          "A KPI tells you whether the machine is running. An OKR tells you where to take it. Most teams need both, and many mix them up.",
          "KPI të tregon nëse makina po punon. OKR të tregon ku ta çosh. Shumica e ekipeve kanë nevojë për të dyja, dhe shumë i ngatërrojnë.",
          "Ein KPI sagt, ob die Maschine läuft. Ein OKR sagt, wohin man sie fährt. Die meisten Teams brauchen beides, und viele verwechseln es.") },
      ],
      source: ["grove-1983", "doerr-2018", "silva-santos-2024"],
    },
    {
      id: "numbers",
      kicker: x("The numbers", "Shifrat", "Die Zahlen"),
      title: [x("What the research", "Çfarë mund", "Was die Forschung"), x("can show", "të tregojë kërkimi", "zeigen kann")],
      lead: x(
        "Researchers at a large software company asked engineers about OKRs: 47 interviews, then a survey with 512 answers. It is one company, but one of the few places where OKRs have been studied closely.",
        "Studiues në një kompani të madhe softueri i pyetën inxhinierët për OKR-të: 47 intervista, pastaj një anketë me 512 përgjigje. Është një kompani e vetme, por një nga pak vendet ku OKR-të janë studiuar nga afër.",
        "Forschende in einem großen Softwareunternehmen befragten Ingenieure zu OKR: 47 Interviews, dann eine Umfrage mit 512 Antworten. Es ist ein einziges Unternehmen, aber einer der wenigen Orte, an denen OKR genau untersucht wurden."),
      blocks: [
        { type: "hbars", max: 100, source: ["butler-2024"],
          label: x("Engineers at one large software company, 2024", "Inxhinierë në një kompani të madhe softueri, 2024", "Ingenieure in einem großen Softwareunternehmen, 2024"),
          items: [
            { k: x("Do not know how to find other teams' goals when they need them", "Nuk dinë si t'i gjejnë qëllimet e ekipeve të tjera kur u duhen", "Wissen nicht, wie sie die Ziele anderer Teams finden, wenn sie sie brauchen"), v: 76, n: pc(76), alert: true },
            { k: x("Want or need to see other teams' OKRs", "Duan ose kanë nevojë t'i shohin OKR-të e ekipeve të tjera", "Wollen oder müssen die OKR anderer Teams sehen"), v: 59, n: pc(59) },
          ] },
        { type: "figures", compact: true, items: [
          { n: "12", t: x("different tools for tracking OKRs, in that one company", "mjete të ndryshme për ndjekjen e OKR-ve, në atë kompani të vetme", "verschiedene Werkzeuge zur OKR-Verfolgung, in diesem einen Unternehmen") },
          { n: "47", t: x("studies on OKRs found by a 2024 review, most in software and IT", "studime për OKR-të gjeti një rishikim i 2024, shumica në softuer dhe IT", "Studien zu OKR fand eine Übersicht von 2024, die meisten aus Software und IT") },
        ] },
        { type: "p", text: x(
          "The authors of the review call the academic literature on OKRs still scarce. We found no long-term study showing that OKRs make organisations perform better; the studies that exist describe how teams use them and where they struggle.",
          "Autorët e rishikimit e quajnë literaturën akademike për OKR-të ende të pakët. Nuk gjetëm asnjë studim afatgjatë që tregon se OKR-të i bëjnë organizatat më të suksesshme; studimet që ekzistojnë përshkruajnë si i përdorin ekipet dhe ku hasin vështirësi.",
          "Die Autoren der Übersicht nennen die akademische Literatur zu OKR noch spärlich. Wir fanden keine Langzeitstudie, die zeigt, dass OKR Organisationen erfolgreicher machen; die vorhandenen Studien beschreiben, wie Teams sie nutzen und wo sie sich schwertun.") },
        { type: "callout", reading: true, text: x(
          "OKRs are a promising tool, not a proven one. Introduce them like an experiment: with a review date and a question you want answered.",
          "OKR-të janë mjet premtues, jo i provuar. Futi si eksperiment: me një datë rishikimi dhe një pyetje që do t'i japësh përgjigje.",
          "OKR sind ein vielversprechendes Werkzeug, kein bewiesenes. Führen Sie sie ein wie ein Experiment: mit einem Prüftermin und einer Frage, die beantwortet werden soll.") },
      ],
      source: ["butler-2024", "silva-santos-2024"],
    },
    {
      id: "model",
      kicker: x("The model", "Modeli", "Das Modell"),
      title: [x("Running", "Të mbash në punë", "Betreiben"), x("or changing", "apo të ndryshosh", "oder verändern")],
      lead: x(
        "The two tools answer different questions. The comparison below is ours, built from Grove, Doerr and Google's guide.",
        "Dy mjetet u përgjigjen pyetjeve të ndryshme. Krahasimi më poshtë është yni, i ndërtuar nga Grove, Doerr dhe guida e Google.",
        "Die beiden Werkzeuge beantworten verschiedene Fragen. Der Vergleich unten ist unserer, gebaut aus Grove, Doerr und Googles Leitfaden."),
      blocks: [
        { type: "lists", cols: [
          { h: x("KPI: is the work running well?", "KPI: a po ecën mirë puna?", "KPI: Läuft die Arbeit gut?"), items: [
            x("Watches the running operation, often daily", "Ndjek punën që po ecën, shpesh çdo ditë", "Beobachtet den laufenden Betrieb, oft täglich"),
            x("The target is a range: stay inside it", "Synimi është një interval: qëndro brenda tij", "Das Ziel ist ein Bereich: darin bleiben"),
            x("Read in pairs: a measure and its counter-measure", "Lexohet në çifte: një masë dhe kundërmasa e saj", "Wird paarweise gelesen: eine Kennzahl und ihr Gegenstück"),
            x("Stays for years", "Mbetet për vite", "Bleibt über Jahre"),
          ] },
          { h: x("OKR: where do we go this quarter?", "OKR: ku shkojmë këtë tremujor?", "OKR: Wohin geht es in diesem Quartal?"), accent: true, items: [
            x("Few objectives, about three key results each", "Pak objektiva, rreth tre rezultate kyçe për secilin", "Wenige Ziele, je etwa drei Schlüsselergebnisse"),
            x("Scored 0.0 to 1.0; 0.6–0.7 is the sweet spot", "Notë nga 0,0 në 1,0; 0,6–0,7 është zona e mirë", "Bewertet von 0,0 bis 1,0; 0,6–0,7 ist ideal"),
            x("Key results describe outcomes, not activities", "Rezultatet kyçe përshkruajnë rezultate, jo veprimtari", "Schlüsselergebnisse beschreiben Ergebnisse, keine Tätigkeiten"),
            x("Changes every cycle", "Ndryshon çdo cikël", "Ändert sich jeden Zyklus"),
          ] },
        ] },
        { type: "p", text: x(
          "Doerr's short version, at TED in 2018: the objective is what you want to have accomplished; the key results are how you will get it done. Key results, he said, must be specific and time-bound, aggressive yet realistic, measurable and verifiable.",
          "Versioni i shkurtër i Doerr, te TED në 2018: objektivi është ajo që do të kesh arritur; rezultatet kyçe janë si do ta arrish. Rezultatet kyçe, tha ai, duhet të jenë specifike dhe me afat, ambicioze por realiste, të matshme dhe të verifikueshme.",
          "Doerrs Kurzfassung bei TED 2018: Das Ziel ist, was man erreicht haben will; die Schlüsselergebnisse sind, wie man es erreicht. Schlüsselergebnisse, sagte er, müssen konkret und terminiert, ehrgeizig und doch realistisch, messbar und überprüfbar sein.") },
        { type: "callout", reading: true, text: x(
          "A KPI that is green every day is good news. An OKR that scores 1.0 every quarter is a warning: the goal was too easy.",
          "KPI që del jeshil çdo ditë është lajm i mirë. OKR që merr 1,0 çdo tremujor është paralajmërim: qëllimi ishte shumë i lehtë.",
          "Ein KPI, der jeden Tag grün ist, ist eine gute Nachricht. Ein OKR, das jedes Quartal 1,0 erreicht, ist eine Warnung: Das Ziel war zu leicht.") },
      ],
      note: x(
        "The comparison is our reading of Grove (1983), Doerr (2018) and Google's guide.",
        "Krahasimi është leximi ynë i Grove (1983), Doerr (2018) dhe guidës së Google.",
        "Der Vergleich ist unsere Lesart von Grove (1983), Doerr (2018) und Googles Leitfaden."),
      source: ["grove-1983", "doerr-ted-2018", "rework-okr"],
    },
    {
      id: "risk", more: "kpis-the-team-trusts",
      kicker: x("The risk", "Rreziku", "Das Risiko"),
      title: [x("When one does", "Kur njëri bën", "Wenn eins den Job"), x("the other's job", "punën e tjetrit", "des anderen macht")],
      lead: x(
        "Grove warned that indicators steer attention to what they measure, like a bicycle that goes where you look. Watch only the inventory, and you cut it until shortages appear.",
        "Grove paralajmëroi se treguesit e drejtojnë vëmendjen te ajo që matin, si biçikleta që shkon aty ku shikon. Po të shohësh vetëm stokun, e ul derisa shfaqen mungesat.",
        "Grove warnte, dass Indikatoren die Aufmerksamkeit auf das lenken, was sie messen, wie ein Fahrrad, das dorthin fährt, wohin man schaut. Wer nur den Bestand beobachtet, senkt ihn, bis Engpässe auftreten."),
      blocks: [
        { type: "rows", compact: true, items: [
          { h: x("A KPI turned into a stretch goal", "KPI i kthyer në qëllim ambicioz", "Ein KPI wird zum Ehrgeizziel"), p: x("The team pushes one number and the one beside it suffers. Grove's answer: pair indicators, so effect and counter-effect are measured together.", "Ekipi shtyn një numër dhe vuan ai pranë tij. Përgjigjja e Grove: treguesit në çifte, që të maten bashkë efekti dhe kundërefekti.", "Das Team treibt eine Zahl, und die daneben leidet. Groves Antwort: Indikatoren paaren, damit Wirkung und Gegenwirkung gemeinsam gemessen werden.") },
          { h: x("An OKR used to rate people", "OKR e përdorur për të vlerësuar njerëzit", "Ein OKR zur Bewertung von Menschen"), p: x("Whoever is rated on the score sets goals they know they can hit. Google's guide keeps OKRs apart from employee evaluation, and low scores are data for the next quarter, not a punishment.", "Kush vlerësohet me notën vendos qëllime që e di se i arrin. Guida e Google i mban OKR-të larg vlerësimit të punonjësve, dhe notat e ulëta janë të dhëna për tremujorin tjetër, jo ndëshkim.", "Wer nach der Bewertung beurteilt wird, setzt sich Ziele, die er sicher erreicht. Googles Leitfaden trennt OKR von der Mitarbeiterbeurteilung, und niedrige Werte sind Daten für das nächste Quartal, keine Strafe.") },
          { h: x("Too many OKRs", "Shumë OKR", "Zu viele OKR"), p: x("Google suggests about three key results per objective, and Doerr's book three to five objectives per cycle. A long list is a KPI dashboard with a new name.", "Google sugjeron rreth tre rezultate kyçe për objektiv, dhe libri i Doerr tre deri në pesë objektiva për cikël. Një listë e gjatë është një panel KPI me emër të ri.", "Google schlägt etwa drei Schlüsselergebnisse pro Ziel vor, Doerrs Buch drei bis fünf Ziele pro Zyklus. Eine lange Liste ist ein KPI-Dashboard mit neuem Namen.") },
        ] },
        { type: "example", label: x("Hypothetical example, a pair of indicators in a warehouse", "Shembull hipotetik, një çift treguesish në magazinë", "Hypothetisches Beispiel, ein Indikatorenpaar im Lager"), rows: [
          { k: x("Pushed", "I shtyrë", "Angetrieben"), v: x("Picks per hour, from 90 to 110", "Marrje në orë, nga 90 në 110", "Picks pro Stunde, von 90 auf 110") },
          { k: x("Beside it", "Pranë tij", "Daneben"), v: x("Picking errors per 1,000 lines, from 2 to 6", "Gabime në 1.000 rreshta, nga 2 në 6", "Pickfehler pro 1.000 Positionen, von 2 auf 6") },
        ], text: x("Speed went up and quality paid for it. Read together, the two numbers show it in the same report. The numbers are invented.", "Shpejtësia u rrit dhe e pagoi cilësia. Të lexuar bashkë, dy numrat e tregojnë në të njëjtin raport. Numrat janë të shpikur.", "Das Tempo stieg, und die Qualität bezahlte dafür. Zusammen gelesen zeigen es beide Zahlen im selben Bericht. Die Zahlen sind erfunden.") },
        { type: "callout", reading: true, text: x(
          "Before you raise a target, name the number that will suffer if the team reaches it the wrong way, and watch both.",
          "Para se ta ngresh një synim, emërto numrin që do të vuajë nëse ekipi e arrin në mënyrë të gabuar, dhe ndiqi të dy.",
          "Bevor Sie ein Ziel anheben, benennen Sie die Zahl, die leidet, wenn das Team es auf falschem Weg erreicht, und beobachten Sie beide.") },
      ],
      source: ["grove-1983", "rework-okr", "klau-2013", "doerr-2018"],
    },
    {
      id: "measure",
      kicker: x("How it is measured", "Si matet", "Wie man es misst"),
      title: [x("Scoring", "Nota", "Das Quartal"), x("the quarter", "e tremujorit", "bewerten")],
      lead: x(
        "At the end of the quarter each key result gets a score from 0.0 to 1.0, and the objective gets roughly their average.",
        "Në fund të tremujorit, çdo rezultat kyç merr një notë nga 0,0 në 1,0, dhe objektivi merr afërsisht mesataren e tyre.",
        "Am Ende des Quartals bekommt jedes Schlüsselergebnis einen Wert von 0,0 bis 1,0, und das Ziel ungefähr deren Durchschnitt."),
      blocks: [
        { type: "steps", items: [
          { h: x("Score each key result", "Vlerëso çdo rezultat kyç", "Jedes Schlüsselergebnis bewerten"), p: x("0.0 for no progress, 1.0 for fully achieved, a partial score for partial progress.", "0,0 për asnjë ecje, 1,0 për të arritur plotësisht, notë të pjesshme për ecje të pjesshme.", "0,0 ohne Fortschritt, 1,0 bei vollem Erfolg, ein Teilwert bei Teilfortschritt.") },
          { h: x("Take the average", "Merr mesataren", "Den Durchschnitt bilden"), p: x("That is the objective's score.", "Ajo është nota e objektivit.", "Das ist der Wert des Ziels.") },
          { h: x("Read it", "Lexoje", "Ihn lesen"), p: x("Around 0.6–0.7: ambitious and reachable. Always 1.0: too easy. Very low: find the cause before the next quarter.", "Rreth 0,6–0,7: ambicioz dhe i arritshëm. Gjithmonë 1,0: shumë i lehtë. Shumë i ulët: gjej shkakun para tremujorit tjetër.", "Um 0,6–0,7: ehrgeizig und erreichbar. Immer 1,0: zu leicht. Sehr niedrig: die Ursache vor dem nächsten Quartal finden.") },
          { h: x("Check the KPIs beside it", "Kontrollo KPI-të pranë tij", "Die KPIs daneben prüfen"), p: x("Did the health measures stay in their range?", "A qëndruan masat e shëndetit të punës brenda intervalit?", "Sind die Gesundheitskennzahlen im Bereich geblieben?") },
        ] },
        { type: "example", label: x("Hypothetical example, an evening shift", "Shembull hipotetik, një turn mbrëmjeje", "Hypothetisches Beispiel, eine Abendschicht"), rows: [
          { k: x("Objective", "Objektivi", "Ziel"), v: x("Close the evening shift on time", "Ta mbyllim turnin e mbrëmjes në kohë", "Die Abendschicht pünktlich abschließen") },
          { k: "KR 1", v: x("Overtime from 40 to 10 hours a month: reached 16, score 0.8", "Orët shtesë nga 40 në 10 në muaj: u arrit 16, nota 0,8", "Überstunden von 40 auf 10 pro Monat: 16 erreicht, Wert 0,8") },
          { k: "KR 2", v: x("Handover done by 22:00 on 9 of 10 days, from 5: reached 7, score 0.5", "Dorëzimi gati deri në 22:00 në 9 nga 10 ditë, nga 5: u arrit 7, nota 0,5", "Übergabe bis 22:00 Uhr an 9 von 10 Tagen, von 5: 7 erreicht, Wert 0,5") },
          { k: "KR 3", v: x("Two more people can do the stock count: done, score 1.0", "Edhe dy veta dinë ta bëjnë numërimin e stokut: u bë, nota 1,0", "Zwei weitere Personen können die Inventur: erledigt, Wert 1,0") },
        ], text: x("Score 0.77, and the error rate of the count stayed under 1%. The numbers are invented.", "Nota 0,77, dhe gabimet e numërimit mbetën nën 1%. Numrat janë të shpikur.", "Wert 0,77, und die Fehlerquote der Inventur blieb unter 1 %. Die Zahlen sind erfunden.") },
      ],
      note: x("The scale is Google's; the steps and the example are the editors'.", "Shkalla është e Google; hapat dhe shembulli janë të redaksisë.", "Die Skala stammt von Google; Schritte und Beispiel von der Redaktion."),
      source: ["rework-okr"],
    },
    {
      id: "tool", tool: "/tools/kpi-diagnostic/",
      kicker: x("Tool of the issue", "Mjeti i numrit", "Werkzeug der Ausgabe"),
      title: [x("The", "Karta", "Die"), x("OKR card", "OKR", "OKR-Karte")],
      lead: x(
        "One card per objective, for one quarter. The last line keeps the KPIs in view while the team aims higher.",
        "Një kartë për objektiv, për një tremujor. Rreshti i fundit i mban KPI-të para syve ndërsa ekipi synon më lart.",
        "Eine Karte pro Ziel, für ein Quartal. Die letzte Zeile hält die KPIs im Blick, während das Team höher zielt."),
      blocks: [
        { type: "form", items: [
          { h: x("Objective", "Objektivi", "Ziel"), hint: x("one sentence, where we want to go", "një fjali, ku duam të shkojmë", "ein Satz, wohin wir wollen") },
          { h: x("Key result 1", "Rezultati kyç 1", "Schlüsselergebnis 1"), hint: x("a number, from where to where, by when", "një numër, nga ku në ku, deri kur", "eine Zahl, von wo nach wo, bis wann") },
          { h: x("Key result 2", "Rezultati kyç 2", "Schlüsselergebnis 2") },
          { h: x("Key result 3", "Rezultati kyç 3", "Schlüsselergebnis 3") },
          { h: x("The KPIs that must not get worse", "KPI-të që nuk duhet të përkeqësohen", "Die KPIs, die nicht schlechter werden dürfen"), hint: x("and their range", "dhe intervali i tyre", "und ihr Bereich"), lines: 2 },
          { h: x("Score at the end of the quarter", "Nota në fund të tremujorit", "Wert am Quartalsende"), hint: x("and what we learned", "dhe çfarë mësuam", "und was wir gelernt haben") },
        ] },
      ],
      note: x(
        "A practice proposed by the editors.",
        "Praktikë e propozuar nga redaksia.",
        "Eine Praxis, die die Redaktion vorschlägt."),
    },
    { id: "sources", type: "sources" },
    { id: "back", type: "back" },
  ],
};
