// Management Review, No. 86: Using AI without losing the skill. Block: AI.
// Facts and their sources: docs/revista/management-review-nr-86.md. Budzyń et al. (2025) was read in full in the
// published PDF; Bastani et al. (2025) and Macnamara et al. (2024) in full at PubMed Central; Bainbridge (1983) in
// full in a copy of the Automatica pages; the FAA alert SAFO 13002 (2013) in full at faa.gov. The headline results of
// Bastani et al. are in No. 51 and are not repeated; automation bias and the human override are in Volume 3 of the
// operational treatise.
import { x, pc } from "../common.js";

export default {
  number: 86,
  block: "ai",
  date: x("November 2026", "Nëntor 2026", "November 2026"),
  theme: [x("Using AI", "Ta përdorësh AI-në", "KI nutzen,"), x("without losing the skill", "pa e humbur aftësinë", "ohne das Können zu verlieren")],
  sub: x(
    "Experienced endoscopists who found fewer adenomas on their own after working with AI, students who asked the chatbot for answers and felt fine, two ways a skill is lost, an aviation rule for flying by hand, and a card for the switch-off check.",
    "Endoskopistë me përvojë që gjetën më pak adenoma vetë pasi punuan me AI, nxënës që i kërkonin chatbot-it përgjigjet dhe ndiheshin mirë, dy mënyra si humbet një aftësi, një rregull i aviacionit për fluturimin me dorë, dhe një kartë për kontrollin me mjetin të fikur.",
    "Erfahrene Endoskopiker, die nach der Arbeit mit KI allein weniger Adenome fanden, Schüler, die den Chatbot nach Antworten fragten und sich gut fühlten, zwei Wege, Können zu verlieren, eine Regel der Luftfahrt fürs Fliegen von Hand und eine Karte für die Probe ohne Werkzeug."),
  seo: x(
    "Deskilling after AI: endoscopists in Poland, students in Turkey, Bainbridge and the FAA on manual skill, two ways a skill is lost, and a switch-off card.",
    "Humbja e aftësisë pas AI-së: endoskopistë në Poloni, nxënës në Turqi, Bainbridge dhe FAA për aftësinë manuale, dy mënyra humbjeje, dhe një kartë.",
    "Können verlieren durch KI: Endoskopiker in Polen, Schüler in der Türkei, Bainbridge und die FAA zum Handfliegen, zwei Wege des Verlusts, eine Karte."),
  feature: x(
    "Most studies of AI at work measure what people do with the tool. Issue 86 asks what they can still do without it. In four Polish clinics, experienced endoscopists found fewer adenomas on the days the AI was off, three months after it arrived. In a Turkish school, students with an open chatbot mostly asked for the answer and did not notice they had learned less. A theory of two ways to lose a skill, aviation's long experience with autopilots, five marks of a team that keeps its skill and a card close the issue.",
    "Shumica e studimeve për AI-në në punë matin çfarë bëjnë njerëzit me mjetin. Numri 86 pyet çfarë mund të bëjnë ende pa të. Në katër klinika polake, endoskopistë me përvojë gjetën më pak adenoma në ditët kur AI ishte e fikur, tre muaj pasi kishte ardhur. Në një shkollë turke, nxënësit me një chatbot pa kufizime kërkonin kryesisht përgjigjen dhe nuk e kuptuan se kishin mësuar më pak. Një teori për dy mënyra të humbjes së aftësisë, përvoja e gjatë e aviacionit me autopilotin, pesë shenja të një ekipi që e ruan aftësinë dhe një kartë e mbyllin numrin.",
    "Die meisten Studien zu KI bei der Arbeit messen, was Menschen mit dem Werkzeug tun. Ausgabe 86 fragt, was sie ohne es noch können. In vier polnischen Kliniken fanden erfahrene Endoskopiker an den Tagen ohne KI weniger Adenome, drei Monate nach ihrer Einführung. In einer türkischen Schule fragten Schüler mit einem freien Chatbot meist nach der Antwort und merkten nicht, dass sie weniger gelernt hatten. Eine Theorie zweier Wege des Könnensverlusts, die lange Erfahrung der Luftfahrt mit dem Autopiloten, fünf Merkmale eines Teams, das sein Können hält, und eine Karte schließen die Ausgabe."),
  figure: { n: x("−6.0", "−6,0", "−6,0"), by: "Budzyń et al., 2025", t: x(
    "points in adenoma detection without AI by 19 experienced endoscopists, three months after AI arrived: from 28.4% to 22.4%.",
    "pikë në zbulimin e adenomave pa AI nga 19 endoskopistë me përvojë, tre muaj pasi erdhi AI: nga 28,4% në 22,4%.",
    "Punkte bei der Adenomerkennung ohne KI durch 19 erfahrene Endoskopiker, drei Monate nach Einführung der KI: von 28,4 auf 22,4 %.") },
  teasers: [
    { page: "story", kicker: x("Cover story", "Tema kryesore", "Titelthema"),
      title: x("Three months with the assistant", "Tre muaj me asistentin", "Drei Monate mit dem Assistenten") },
    { page: "research", kicker: x("What the research says", "Çfarë thotë kërkimi", "Was die Forschung sagt"),
      title: x("Flying by hand", "Të fluturosh me dorë", "Von Hand fliegen") },
    { page: "tool", kicker: x("Tool of the issue", "Mjeti i numrit", "Werkzeug der Ausgabe"),
      title: x("The switch-off card", "Karta e kontrollit pa mjetin", "Die Karte ohne Werkzeug") },
  ],
  sources: ["deskill-budzyn-2025", "genai-bastani-2025", "deskill-macnamara-2024", "bainbridge-1983", "deskill-faa-2013"],
  pages: [
    { id: "cover", type: "cover" },
    {
      id: "intro", type: "intro",
      why: x(
        "Most studies of AI at work measure what people do with the tool. Fewer measure what they can still do without it. That second question decides what happens on the day the tool is down, wrong or replaced, and it is the subject of this issue.",
        "Shumica e studimeve për AI-në në punë matin çfarë bëjnë njerëzit me mjetin. Më pak matin çfarë mund të bëjnë ende pa të. Kjo pyetje e dytë vendos çfarë ndodh ditën kur mjeti nuk punon, gabon ose zëvendësohet, dhe është tema e këtij numri.",
        "Die meisten Studien zu KI bei der Arbeit messen, was Menschen mit dem Werkzeug tun. Weniger messen, was sie ohne es noch können. Diese zweite Frage entscheidet, was an dem Tag geschieht, an dem das Werkzeug ausfällt, irrt oder ersetzt wird, und sie ist das Thema dieser Ausgabe."),
      body: x(
        "In four Polish clinics, experienced endoscopists found adenomas in 28.4% of colonoscopies without AI before it arrived, and in 22.4% three months after. In a Turkish school, most students with an open chatbot asked it for the answer, and did not feel they had learned less. A 2024 paper names two ways a skill is lost; a 1983 paper on automation and a 2013 aviation alert met it earlier. Five marks of a team that keeps its skill and a card close the issue.",
        "Në katër klinika polake, endoskopistë me përvojë gjetën adenoma në 28,4% të kolonoskopive pa AI para se të vinte ajo, dhe në 22,4% tre muaj pas. Në një shkollë turke, shumica e nxënësve me një chatbot pa kufizime i kërkonin përgjigjen, dhe nuk e ndien se kishin mësuar më pak. Një punim i vitit 2024 emërton dy mënyra si humbet një aftësi; një punim i vitit 1983 për automatizimin dhe një njoftim i aviacionit i vitit 2013 e hasën më herët. Pesë shenja të një ekipi që e ruan aftësinë dhe një kartë e mbyllin numrin.",
        "In vier polnischen Kliniken fanden erfahrene Endoskopiker vor Einführung der KI bei 28,4 % der Koloskopien ohne KI Adenome, drei Monate danach bei 22,4 %. In einer türkischen Schule fragten die meisten Schüler mit einem freien Chatbot nach der Antwort und hatten nicht das Gefühl, weniger gelernt zu haben. Ein Aufsatz von 2024 benennt zwei Wege, Können zu verlieren; ein Aufsatz zur Automatisierung von 1983 und ein Luftfahrthinweis von 2013 kannten es schon früher. Fünf Merkmale eines Teams, das sein Können hält, und eine Karte schließen die Ausgabe."),
    },
    {
      id: "story",
      kicker: x("Cover story", "Tema kryesore", "Titelthema"),
      title: [x("Three months", "Tre muaj", "Drei Monate"), x("with the assistant", "me asistentin", "mit dem Assistenten")],
      lead: x(
        "At the end of 2021, four endoscopy centres in Poland began using an AI system that marks possible polyps on the screen. Whether it was on depended on the date of the examination. Krzysztof Budzyń and colleagues looked at the days it was off.",
        "Në fund të vitit 2021, katër qendra endoskopie në Poloni nisën të përdornin një sistem AI që shënon në ekran polipet e mundshme. Nëse ishte i ndezur apo jo, varej nga data e ekzaminimit. Krzysztof Budzyń dhe kolegët panë ditët kur ishte i fikur.",
        "Ende 2021 begannen vier Endoskopiezentren in Polen, ein KI-System zu nutzen, das mögliche Polypen auf dem Bildschirm markiert. Ob es lief, hing vom Datum der Untersuchung ab. Krzysztof Budzyń und Kollegen betrachteten die Tage, an denen es aus war."),
      blocks: [
        { type: "columns", max: 35, height: 112, source: ["deskill-budzyn-2025"],
          label: x("Colonoscopies with at least one adenoma found, four Polish centres, 2021–2022", "Kolonoskopi me të paktën një adenomë të gjetur, katër qendra polake, 2021–2022", "Koloskopien mit mindestens einem gefundenen Adenom, vier polnische Zentren, 2021–2022"),
          items: [
            { k: x("No AI, before", "Pa AI, para", "Ohne KI, vorher"), v: 28.4, n: x("28.4%", "28,4%", "28,4 %") },
            { k: x("No AI, after", "Pa AI, pas", "Ohne KI, nachher"), v: 22.4, n: x("22.4%", "22,4%", "22,4 %"), alert: true },
            { k: x("With AI, after", "Me AI, pas", "Mit KI, nachher"), v: 25.3, n: x("25.3%", "25,3%", "25,3 %") },
          ] },
        { type: "p", text: x(
          "The 19 endoscopists had each done more than 2,000 colonoscopies, with 27.6 years of experience on average. After the change their patients included more men and more were sedated, both of which usually raise detection. The authors suspect over-reliance: less motivated, less focused and less responsible when the AI is not there.",
          "Secili nga 19 endoskopistët kishte bërë mbi 2.000 kolonoskopi, me mesatarisht 27,6 vjet përvojë. Pas ndryshimit, mes pacientëve të tyre kishte më shumë burra dhe më shumë u sedatuan, dy gjëra që zakonisht e rritin zbulimin. Autorët dyshojnë te mbështetja e tepruar: më pak motivim, më pak përqendrim dhe më pak përgjegjësi kur AI nuk është aty.",
          "Die 19 Endoskopiker hatten jeweils über 2.000 Koloskopien gemacht, im Schnitt mit 27,6 Jahren Erfahrung. Nach der Umstellung waren unter ihren Patienten mehr Männer und mehr Sedierte, beides hebt die Erkennung meist. Die Autoren vermuten zu großes Vertrauen: weniger Motivation, weniger Fokus und weniger Verantwortung, wenn die KI fehlt.") },
        { type: "callout", reading: true, text: x(
          "Against the same weeks without AI, the AI looked better. Against the team three months earlier, it did not. The yardstick had moved.",
          "Krahasuar me të njëjtat javë pa AI, AI dukej më e mirë. Krahasuar me ekipin tre muaj më parë, jo. Masa e krahasimit ishte zhvendosur.",
          "Gegen dieselben Wochen ohne KI sah die KI besser aus. Gegen das Team drei Monate zuvor nicht. Der Maßstab hatte sich verschoben.") },
      ],
      note: x(
        "Observational study of 1,443 colonoscopies without AI and 734 with it. Poland paused its screening programme in 2022, so later patients came from another waiting list. The authors call for randomised trials.",
        "Studim vëzhgues me 1.443 kolonoskopi pa AI dhe 734 me të. Polonia e pezulloi programin e saj të depistimit më 2022, prandaj pacientët e mëvonshëm erdhën nga një listë tjetër pritjeje. Autorët kërkojnë prova të rastësishme.",
        "Beobachtungsstudie mit 1.443 Koloskopien ohne KI und 734 mit KI. Polen setzte 2022 sein Vorsorgeprogramm aus, die späteren Patienten kamen daher von einer anderen Warteliste. Die Autoren fordern randomisierte Studien."),
      source: ["deskill-budzyn-2025"],
    },
    {
      id: "numbers",
      kicker: x("The numbers", "Shifrat", "Die Zahlen"),
      title: [x("Asking", "Të kërkosh", "Nach der Antwort"), x("for the answer", "përgjigjen", "fragen")],
      lead: x(
        "No. 51 gave the main result of a field experiment with nearly 1,000 students in Turkey: an open GPT-4 helped in practice and hurt in the exam without it. The full study also shows how the students used the chatbot, and what they thought it had done for them.",
        "Nr. 51 dha rezultatin kryesor të një eksperimenti në terren me gati 1.000 nxënës në Turqi: një GPT-4 pa kufizime ndihmoi në ushtrime dhe dëmtoi në provimin pa të. Studimi i plotë tregon edhe si e përdorën nxënësit chatbot-in, dhe çfarë menduan se kishte bërë ai për ta.",
        "Nr. 51 brachte das Hauptergebnis eines Feldexperiments mit fast 1.000 Schülern in der Türkei: Ein freies GPT-4 half beim Üben und schadete in der Prüfung ohne es. Die ganze Studie zeigt auch, wie die Schüler den Chatbot nutzten und was er ihrer Meinung nach für sie getan hatte."),
      blocks: [
        { type: "pairs", from: x("First problem", "Problemi i parë", "Erste Aufgabe"), to: x("All problems, session 1", "Të gjitha problemet, seanca 1", "Alle Aufgaben, Sitzung 1"), max: 100, source: ["genai-bastani-2025"],
          label: x("Students whose first message asked for the answer or repeated the question", "Nxënës, mesazhi i parë i të cilëve kërkonte përgjigjen ose përsëriste pyetjen", "Schüler, deren erste Nachricht nach der Antwort fragte oder die Frage wiederholte"),
          rows: [
            { k: x("Open chatbot (GPT Base)", "Chatbot pa kufizime (GPT Base)", "Freier Chatbot (GPT Base)"), a: 56, an: pc(56), b: 67, bn: pc(67), alert: true },
            { k: x("Tutor giving hints (GPT Tutor)", "Tutor që jep udhëzime (GPT Tutor)", "Tutor mit Hinweisen (GPT Tutor)"), a: 42, an: pc(42), b: 37, bn: pc(37) },
          ] },
        { type: "figures", compact: true, items: [
          { n: pc(51), t: x("of the open chatbot's answers to the practice problems were correct, asked ten times each", "e përgjigjeve të chatbot-it pa kufizime për ushtrimet ishin të sakta, i pyetur dhjetë herë për secilin", "der Antworten des freien Chatbots auf die Übungsaufgaben waren richtig, je zehnmal gefragt") },
        ] },
        { type: "p", text: x(
          "Students with the open version did worse in the exam but did not think they had learned less; those with the tutor thought they had done better, though they had not. The authors' reading: the open version was used as a crutch.",
          "Nxënësit me versionin pa kufizime dolën më keq në provim, por nuk menduan se kishin mësuar më pak; ata me tutorin menduan se kishin dalë më mirë, megjithëse jo. Leximi i autorëve: versioni pa kufizime u përdor si paterica.",
          "Schüler mit der freien Version schnitten in der Prüfung schlechter ab, glaubten aber nicht, weniger gelernt zu haben; die mit dem Tutor glaubten, besser abgeschnitten zu haben, was nicht stimmte. Die Deutung der Autoren: Die freie Version diente als Krücke.") },
        { type: "callout", reading: true, text: x(
          "How people feel about a tool is not a measure of what they can do without it.",
          "Si ndihen njerëzit për një mjet nuk është masë e asaj që mund të bëjnë pa të.",
          "Wie Menschen ein Werkzeug empfinden, misst nicht, was sie ohne es können.") },
      ],
      note: x(
        "Students, not employees: one school, mathematics, autumn 2023, GPT-4. The bars are shares of opening messages as the authors classified them. The 48%, 127% and 17% are in No. 51.",
        "Nxënës, jo punonjës: një shkollë, matematikë, vjeshta 2023, GPT-4. Shiritat janë pjesë të mesazheve të para siç i klasifikuan autorët. Shifrat 48%, 127% dhe 17% janë te Nr. 51.",
        "Schüler, keine Beschäftigten: eine Schule, Mathematik, Herbst 2023, GPT-4. Die Balken sind Anteile der ersten Nachrichten, wie die Autoren sie einordneten. Die 48 %, 127 % und 17 % stehen in Nr. 51."),
      source: ["genai-bastani-2025"],
    },
    {
      id: "model",
      kicker: x("The model", "Modeli", "Das Modell"),
      title: [x("Two ways", "Dy mënyra", "Zwei Wege,"), x("to lose a skill", "për ta humbur aftësinë", "Können zu verlieren")],
      lead: x(
        "Brooke Macnamara and colleagues at Case Western Reserve University separate two risks of AI assistants, and a third that makes both worse: the person may not notice either of them.",
        "Brooke Macnamara dhe kolegët në Universitetin Case Western Reserve dallojnë dy rreziqe të asistentëve AI, dhe një të tretë që i rëndon të dyja: personi mund të mos e vërejë asnjërin.",
        "Brooke Macnamara und Kollegen an der Case Western Reserve University unterscheiden zwei Risiken von KI-Assistenten und ein drittes, das beide verschärft: Die Person bemerkt womöglich keines davon."),
      blocks: [
        { type: "lists", cols: [
          { h: x("Experts: the skill fades", "Ekspertët: aftësia zbehet", "Fachleute: Das Können verblasst"), items: [
            x("A skill used less declines; thinking skills faster than physical ones", "Një aftësi që përdoret më pak bie; ato mendore më shpejt se ato fizike", "Weniger genutztes Können lässt nach, geistiges schneller als körperliches"),
            x("The work still gets done, so the loss stays hidden", "Puna bëhet ende, prandaj humbja mbetet e fshehur", "Die Arbeit wird weiter erledigt, also bleibt der Verlust verborgen"),
            x("It shows when the tool is wrong, down or out of its depth", "Duket kur mjeti gabon, nuk punon ose s'e njeh rastin", "Er zeigt sich, wenn das Werkzeug irrt, ausfällt oder überfordert ist"),
          ] },
          { h: x("Learners: the skill never forms", "Ata që mësojnë: aftësia s'formohet", "Lernende: Das Können entsteht nicht"), accent: true, items: [
            x("Performance rises fast with the tool", "Rezultatet rriten shpejt me mjetin", "Die Leistung steigt mit dem Werkzeug schnell"),
            x("The skill behind it may not develop", "Aftësia pas tyre mund të mos zhvillohet", "Das Können dahinter entwickelt sich womöglich nicht"),
            x("It shows only when the tool is taken away", "Duket vetëm kur mjeti hiqet", "Es zeigt sich erst, wenn das Werkzeug wegfällt"),
          ] },
        ] },
        { type: "p", text: x(
          "Automation bias, trusting a tool too far, goes away when the tool is switched off. A lost skill does not: it stays with the person. When the authors wrote, in 2024, they knew of no research on how AI assistants affect the user's skill.",
          "Paragjykimi i automatizimit, besimi i tepruar te mjeti, largohet kur mjeti fiket. Një aftësi e humbur jo: ajo mbetet te personi. Kur autorët shkruan, më 2024, nuk dinin për asnjë kërkim mbi ndikimin e asistentëve AI te aftësia e përdoruesit.",
          "Automation Bias, zu großes Vertrauen in ein Werkzeug, vergeht, wenn das Werkzeug aus ist. Verlorenes Können nicht: Es bleibt bei der Person. Als die Autoren 2024 schrieben, kannten sie keine Forschung dazu, wie KI-Assistenten das Können der Nutzer beeinflussen.") },
        { type: "callout", reading: true, text: x(
          "A tool's errors leave with the tool. A lost skill stays with the team.",
          "Gabimet e një mjeti ikin bashkë me mjetin. Një aftësi e humbur mbetet te ekipi.",
          "Die Fehler eines Werkzeugs gehen mit dem Werkzeug. Verlorenes Können bleibt beim Team.") },
      ],
      note: x(
        "A theoretical paper with examples from radiology and robotic surgery; the columns shorten its two sections. Automation bias and the human override are in Volume 3 of the operational treatise.",
        "Punim teorik me shembuj nga radiologjia dhe kirurgjia robotike; kolonat shkurtojnë dy pjesët e tij. Paragjykimi i automatizimit dhe ndërhyrja njerëzore janë te Vëllimi 3 i traktatit operacional.",
        "Ein theoretischer Aufsatz mit Beispielen aus Radiologie und robotischer Chirurgie; die Spalten kürzen seine beiden Abschnitte. Automation Bias und der menschliche Eingriff stehen in Band 3 des operativen Traktats."),
      source: ["deskill-macnamara-2024"],
    },
    {
      id: "research",
      kicker: x("What the research says", "Çfarë thotë kërkimi", "Was die Forschung sagt"),
      title: [x("Flying", "Të fluturosh", "Von Hand"), x("by hand", "me dorë", "fliegen")],
      lead: x(
        "Industry and aviation met the problem first. In 1983 Lisanne Bainbridge of University College London wrote that physical skills deteriorate when they are not used, so a formerly experienced operator who has only been monitoring may now be an inexperienced one.",
        "Industria dhe aviacioni e hasën problemin të parat. Më 1983, Lisanne Bainbridge nga University College London shkroi se aftësitë fizike përkeqësohen kur nuk përdoren, kështu që një operator dikur me përvojë, që veç ka mbikëqyrur, mund të jetë tani pa përvojë.",
        "Industrie und Luftfahrt stießen zuerst auf das Problem. 1983 schrieb Lisanne Bainbridge vom University College London, dass körperliche Fertigkeiten verkümmern, wenn sie nicht genutzt werden: Ein einst erfahrener Operator, der nur überwacht hat, ist womöglich nun ein unerfahrener."),
      blocks: [
        { type: "timeline", items: [
          { k: "1983", t: x("Bainbridge: give operators hands-on control for a short time in each shift, or a simulator.", "Bainbridge: jepuni operatorëve kontroll me dorë për pak kohë në çdo turn, ose një simulator.", "Bainbridge: Operatoren in jeder Schicht kurz von Hand steuern lassen, sonst am Simulator.") },
          { k: "2013", t: x("FAA alert: more manual handling errors; airlines should let pilots fly by hand at low workload.", "Njoftimi i FAA-s: më shumë gabime në pilotim me dorë; linjat t'i lënë pilotët të fluturojnë me dorë kur ngarkesa është e ulët.", "FAA-Hinweis: mehr Fehler beim Handfliegen; Airlines sollen Piloten bei geringer Last von Hand fliegen lassen.") },
          { k: "2024", t: x("Macnamara et al.: no study yet of AI assistants' effect on users' skill.", "Macnamara et al.: ende asnjë studim për ndikimin e asistentëve AI te aftësia e përdoruesve.", "Macnamara et al.: noch keine Studie zur Wirkung von KI-Assistenten auf das Können.") },
          { k: "2025", t: x("Budzyń et al.: the first such result in medicine, in colonoscopy.", "Budzyń et al.: rezultati i parë i këtij lloji në mjekësi, në kolonoskopi.", "Budzyń et al.: das erste solche Ergebnis in der Medizin, bei der Koloskopie.") },
        ] },
        { type: "quote", text: x(
          "The most successful automated systems, with rare need for manual intervention, … may need the greatest investment in human operator training.",
          "Sistemet më të suksesshme të automatizuara, me nevojë të rrallë për ndërhyrje me dorë, … mund të kërkojnë investimin më të madh në trajnimin e operatorit njerëzor.",
          "Die erfolgreichsten automatisierten Systeme, die selten manuelles Eingreifen brauchen, … benötigen womöglich die größte Investition in die Ausbildung des menschlichen Operators.") },
        { type: "callout", reading: true, text: x(
          "The better the tool, the rarer the practice, and the more it has to be planned.",
          "Sa më i mirë mjeti, aq më e rrallë praktika, dhe aq më shumë duhet planifikuar.",
          "Je besser das Werkzeug, desto seltener die Übung und desto mehr muss sie geplant werden.") },
      ],
      note: x(
        "Bainbridge wrote about process plants and cockpits, not AI; the quotation is hers, shortened, and the translations are ours. The FAA alert is guidance to airlines, not a rule. Her ironies of monitoring are in Volume 3 of the treatise.",
        "Bainbridge shkruante për impiantet e proceseve dhe kabinat, jo për AI-në; citimi është i saj, i shkurtuar, përkthimet janë tonat. Njoftimi i FAA-s është udhëzim për linjat ajrore, jo rregull. Ironitë e saj të mbikëqyrjes janë te Vëllimi 3 i traktatit.",
        "Bainbridge schrieb über Prozessanlagen und Cockpits, nicht über KI; das Zitat ist ihres, gekürzt, die Übersetzung unsere. Der FAA-Hinweis ist eine Empfehlung an Airlines, keine Vorschrift. Ihre Ironien des Überwachens stehen in Band 3 des Traktats."),
      source: ["bainbridge-1983", "deskill-faa-2013", "deskill-macnamara-2024", "deskill-budzyn-2025"],
    },
    {
      id: "measure", more: "the-night-the-system-went-down",
      kicker: x("How it is measured", "Si matet", "Wie es gemessen wird"),
      title: [x("Measure it", "Mate", "Messen, wenn"), x("with the tool off", "me mjetin të fikur", "das Werkzeug aus ist")],
      lead: x(
        "The Polish study could see the loss because the AI was switched off on some days. Most teams have no such days, and notice what they can no longer do only when the system stops. Five marks of a team that keeps its skill:",
        "Studimi polak e pa humbjen sepse AI fikej disa ditë. Shumica e ekipeve nuk kanë ditë të tilla, dhe e kuptojnë çfarë nuk dinë më të bëjnë vetëm kur sistemi ndalet. Pesë shenja të një ekipi që e ruan aftësinë:",
        "Die polnische Studie sah den Verlust, weil die KI an manchen Tagen aus war. Die meisten Teams haben keine solchen Tage und merken erst beim Systemausfall, was sie nicht mehr können. Fünf Merkmale eines Teams, das sein Können hält:"),
      blocks: [
        { type: "rows", compact: true, items: [
          { h: x("A planned stretch without the tool", "Një periudhë e planifikuar pa mjetin", "Geplante Zeit ohne Werkzeug"), p: x("At low workload, as the FAA asks of airlines; not only when the system fails.", "Kur ngarkesa është e ulët, siç u kërkon FAA linjave ajrore; jo vetëm kur sistemi bie.", "Bei geringer Last, wie die FAA es von Airlines verlangt; nicht erst beim Ausfall.") },
          { h: x("The same measure, both ways", "E njëjta masë, në të dyja mënyrat", "Dieselbe Kennzahl, beide Wege"), p: x("Misses, errors or time with and without the tool, recorded apart.", "Mungesat, gabimet ose koha me dhe pa mjetin, të shënuara veçmas.", "Übersehenes, Fehler oder Zeit mit und ohne Werkzeug, getrennt erfasst.") },
          { h: x("Learners try first", "Ata që mësojnë provojnë të parët", "Lernende versuchen zuerst"), p: x("New people work the case themselves; the tool hints or checks, as the tutor did in the school study.", "Të rinjtë e zgjidhin rastin vetë; mjeti jep udhëzime ose kontrollon, si tutori në studimin e shkollës.", "Neue lösen den Fall selbst; das Werkzeug gibt Hinweise oder prüft, wie der Tutor in der Schulstudie.") },
          { h: x("Ability tested, not felt", "Aftësia e provuar, jo e ndjerë", "Können geprüft, nicht gefühlt"), p: x("A short task done alone, not a survey of confidence.", "Një detyrë e shkurtër e bërë vetë, jo një pyetësor për vetëbesimin.", "Eine kurze Aufgabe allein, keine Umfrage zum Selbstvertrauen.") },
          { h: x("A name for the fallback", "Një emër për rastin pa sistem", "Ein Name für den Ausfall"), p: x("Who can do the work when the tool is down, and when they last did.", "Kush e bën punën kur mjeti nuk punon, dhe kur e bëri për herë të fundit.", "Wer die Arbeit ohne Werkzeug kann, und wann zuletzt.") },
        ] },
        { type: "callout", reading: true, text: x(
          "A team that never works without the tool cannot know what it would do if it had to.",
          "Një ekip që s'punon kurrë pa mjetin nuk mund ta dijë çfarë do të bënte po të duhej.",
          "Ein Team, das nie ohne Werkzeug arbeitet, kann nicht wissen, was es täte, wenn es müsste.") },
      ],
      note: x(
        "The marks are the editors', drawn from Budzyń et al. (2025), Bastani et al. (2025), the FAA alert (2013) and Macnamara et al. (2024). None of them was tested as a set.",
        "Shenjat janë të redaksisë, të nxjerra nga Budzyń et al. (2025), Bastani et al. (2025), njoftimi i FAA-s (2013) dhe Macnamara et al. (2024). Asnjëra nuk është provuar si tërësi.",
        "Die Merkmale stammen von der Redaktion, gestützt auf Budzyń et al. (2025), Bastani et al. (2025), den FAA-Hinweis (2013) und Macnamara et al. (2024). Als Ganzes wurden sie nicht erprobt."),
      source: ["deskill-budzyn-2025", "genai-bastani-2025", "deskill-faa-2013", "deskill-macnamara-2024"],
    },
    {
      id: "tool", tool: "/tools/skills-matrix/",
      kicker: x("Tool of the issue", "Mjeti i numrit", "Werkzeug der Ausgabe"),
      title: [x("The switch-off", "Karta e kontrollit", "Die Karte"), x("card", "pa mjetin", "ohne Werkzeug")],
      lead: x(
        "One card for each task the tool now helps with, filled in with the team. The Skills Matrix shows who can do each task without help, where cover is thin and whom to train next.",
        "Një kartë për çdo detyrë ku mjeti ndihmon tani, e plotësuar me ekipin. Skills Matrix tregon kush e bën secilën detyrë pa ndihmë, ku mbulimi është i hollë dhe kë duhet trajnuar më pas.",
        "Eine Karte für jede Aufgabe, bei der das Werkzeug jetzt hilft, ausgefüllt mit dem Team. Die Skills Matrix zeigt, wer welche Aufgabe ohne Hilfe kann, wo die Abdeckung dünn ist und wen man als Nächstes schult."),
      blocks: [
        { type: "form", items: [
          { h: x("The task", "Detyra", "Die Aufgabe"), hint: x("what the tool does in it: suggests, checks, decides or writes", "çfarë bën mjeti aty: sugjeron, kontrollon, vendos apo shkruan", "was das Werkzeug dabei tut: vorschlagen, prüfen, entscheiden oder schreiben") },
          { h: x("Without the tool", "Pa mjetin", "Ohne Werkzeug"), hint: x("who can still do it alone; when each of them last did", "kush e bën ende vetë; kur e bëri secili për herë të fundit", "wer es noch allein kann; wann jeder es zuletzt tat") },
          { h: x("The measure", "Masa", "Die Kennzahl"), hint: x("one number to compare with and without the tool, recorded apart", "një numër për krahasim me dhe pa mjetin, i shënuar veçmas", "eine Zahl zum Vergleich mit und ohne Werkzeug, getrennt erfasst") },
          { h: x("The practice", "Praktika", "Die Übung"), hint: x("when, how often, at what workload; who is there to help", "kur, sa shpesh, me çfarë ngarkese; kush është aty për të ndihmuar", "wann, wie oft, bei welcher Last; wer hilft") },
          { h: x("Learners", "Ata që mësojnë", "Lernende"), hint: x("what new people do alone before the tool helps them", "çfarë bëjnë të rinjtë vetë para se t'i ndihmojë mjeti", "was Neue allein tun, bevor das Werkzeug hilft") },
          { h: x("Review", "Rishikimi", "Rückblick"), hint: x("what the last stretch without the tool showed; what changes; next date", "çfarë tregoi periudha e fundit pa mjetin; çfarë ndryshon; data e radhës", "was die letzte Zeit ohne Werkzeug zeigte; was sich ändert; nächster Termin"), lines: 2 },
        ] },
      ],
      note: x(
        "The card is the editors' proposal, built on the FAA alert (2013), Bainbridge (1983) and the designs of the studies by Budzyń et al. and Bastani et al. (2025).",
        "Karta është propozim i redaksisë, e ndërtuar mbi njoftimin e FAA-s (2013), Bainbridge (1983) dhe mënyrën si u ndërtuan studimet e Budzyń et al. dhe Bastani et al. (2025).",
        "Die Karte ist ein Vorschlag der Redaktion, gestützt auf den FAA-Hinweis (2013), Bainbridge (1983) und den Aufbau der Studien von Budzyń et al. und Bastani et al. (2025)."),
      source: ["deskill-faa-2013", "bainbridge-1983", "deskill-budzyn-2025", "genai-bastani-2025"],
    },
    { id: "sources", type: "sources" },
    { id: "back", type: "back" },
  ],
};
