// Management Review, No. 51: Generative AI at work: what the studies show. Block: AI.
// Facts and their sources: docs/revista/management-review-nr-51.md. Issue 10 already uses the headline figures of
// Brynjolfsson et al. and Dell'Acqua et al.; this issue takes other findings from them and adds newer studies.
import { x, pc } from "../common.js";

export default {
  number: 51,
  block: "ai",
  date: x("November 2026", "Nëntor 2026", "November 2026"),
  theme: [x("Generative AI at work:", "AI gjenerative në punë:", "Generative KI bei der Arbeit:"), x("what the studies show", "çfarë tregojnë studimet", "was die Studien zeigen")],
  sub: x(
    "Forty per cent faster in a writing test, 2.8% of work hours saved in Denmark, three ways consultants worked with AI, what support agents learned from it, what to count besides speed, and a card for one trial.",
    "Dyzet për qind më shpejt në një provë shkrimi, 2,8% e orëve të punës të kursyera në Danimarkë, tri mënyrat si punuan konsulentët me AI, çfarë mësuan prej saj punonjësit e mbështetjes, çfarë numërohet përveç shpejtësisë, dhe një kartë për një provë.",
    "Vierzig Prozent schneller in einem Schreibtest, 2,8 % der Arbeitszeit gespart in Dänemark, drei Arten, wie Berater mit KI arbeiteten, was Supportkräfte von ihr lernten, was neben dem Tempo zählt, und eine Karte für einen Test."),
  seo: x(
    "Generative AI at work: a 40% faster writing test, 2.8% of hours saved in Denmark, cyborgs and centaurs, what support agents learned, and a trial card.",
    "AI gjenerative në punë: 40% më shpejt në një provë shkrimi, 2,8% e orëve në Danimarkë, kiborgët dhe kentaurët, çfarë mësuan punonjësit, një kartë.",
    "Generative KI bei der Arbeit: 40 % schneller im Schreibtest, 2,8 % Zeit gespart in Dänemark, Cyborgs und Zentauren, was Supportkräfte lernten, eine Karte."),
  feature: x(
    "Issue 51 reads the studies of generative AI at work side by side: a writing experiment in which professionals finished 40% faster, a Danish survey in which users saved 2.8% of their hours, the three ways 244 consultants worked with GPT-4, what 5,179 support agents learned from an AI assistant and what students lost without one, five things to count besides speed, and a card for trying AI on one task.",
    "Numri 51 i lexon krah për krah studimet për AI-në gjenerative në punë: një eksperiment shkrimi ku profesionistët mbaruan 40% më shpejt, një anketë daneze ku përdoruesit kursyen 2,8% të orëve, tri mënyrat si punuan 244 konsulentë me GPT-4, çfarë mësuan 5.179 punonjës të mbështetjes nga një asistent AI dhe çfarë humbën nxënësit pa të, pesë gjëra që numërohen përveç shpejtësisë, dhe një kartë për ta provuar AI-në në një detyrë.",
    "Ausgabe 51 liest die Studien zu generativer KI bei der Arbeit nebeneinander: ein Schreibexperiment, in dem Fachleute 40 % schneller fertig waren, eine dänische Umfrage, in der Nutzer 2,8 % ihrer Arbeitszeit sparten, die drei Arten, wie 244 Berater mit GPT-4 arbeiteten, was 5.179 Supportkräfte von einem KI-Assistenten lernten und was Schüler ohne ihn verloren, fünf Dinge, die neben dem Tempo zählen, und eine Karte, um KI an einer Aufgabe zu testen."),
  figure: { n: x("2.8%", "2,8%", "2,8 %"), by: "Humlum & Vestergaard, 2025", t: x(
    "of their work hours: what users of AI chatbots in 11 occupations in Denmark saved on average in 2024.",
    "e orëve të punës: aq kursyen mesatarisht në 2024 përdoruesit e chatbot-eve AI në 11 profesione në Danimarkë.",
    "ihrer Arbeitszeit: so viel sparten Nutzer von KI-Chatbots in 11 Berufen in Dänemark 2024 im Schnitt.") },
  teasers: [
    { page: "story", kicker: x("Cover story", "Tema kryesore", "Titelthema"),
      title: x("Forty per cent faster, on paper", "Dyzet për qind më shpejt, në letër", "Vierzig Prozent schneller, auf dem Papier") },
    { page: "model", kicker: x("The model", "Modeli", "Das Modell"),
      title: x("Three ways to work with AI", "Tri mënyra për të punuar me AI", "Drei Arten, mit KI zu arbeiten") },
    { page: "tool", kicker: x("Tool of the issue", "Mjeti i numrit", "Werkzeug der Ausgabe"),
      title: x("The AI trial card", "Karta e provës me AI", "Die Karte für den KI-Test") },
  ],
  sources: ["genai-noy-zhang-2023", "genai-noy-zhang-wp-2023", "genai-mitnews-2023", "genai-humlum-2025", "genai-randazzo-2025", "dellacqua-2023", "brynjolfsson-2023", "genai-bastani-2025"],
  pages: [
    { id: "cover", type: "cover" },
    {
      id: "intro", type: "intro",
      why: x(
        "Few tools have reached offices as fast as AI chatbots, and few have been studied so quickly. The results differ widely. This issue reads them side by side: what each study measured, on which task, and what a manager can take from it for a team.",
        "Pak mjete kanë hyrë në zyra aq shpejt sa chatbot-et AI, dhe pak janë studiuar aq shpejt. Rezultatet ndryshojnë shumë. Ky numër i lexon krah për krah: çfarë mati secili studim, në cilën detyrë, dhe çfarë mund të marrë prej tyre një menaxher për ekipin e vet.",
        "Kaum ein Werkzeug kam so schnell in die Büros wie KI-Chatbots, und kaum eines wurde so schnell untersucht. Die Ergebnisse gehen weit auseinander. Diese Ausgabe liest sie nebeneinander: was jede Studie gemessen hat, an welcher Aufgabe, und was eine Führungskraft daraus für ihr Team mitnehmen kann."),
      body: x(
        "In a writing experiment, professionals with ChatGPT finished 40% faster. In Denmark, users of AI chatbots saved on average 2.8% of their work hours. Among 244 consultants, three ways of working with AI emerged, and they built different skills. In a support centre, the newest agents gained most, and those who followed the suggestions learned from them; students who leaned on an open chatbot did worse once it was gone.",
        "Në një eksperiment shkrimi, profesionistët me ChatGPT mbaruan 40% më shpejt. Në Danimarkë, përdoruesit e chatbot-eve AI kursyen mesatarisht 2,8% të orëve të punës. Te 244 konsulentë dolën tri mënyra pune me AI, dhe secila ndërtoi aftësi të tjera. Në një qendër mbështetjeje, punonjësit më të rinj fituan më shumë, dhe ata që ndoqën sugjerimet mësuan prej tyre; nxënësit që u mbështetën te një chatbot pa kufizime dolën më keq kur ai iku.",
        "In einem Schreibexperiment waren Fachleute mit ChatGPT 40 % schneller fertig. In Dänemark sparten Nutzer von KI-Chatbots im Schnitt 2,8 % ihrer Arbeitszeit. Bei 244 Beratern zeigten sich drei Arten, mit KI zu arbeiten, und jede baute andere Fähigkeiten auf. In einem Supportcenter gewannen die Neuesten am meisten, und wer den Vorschlägen folgte, lernte daraus; Schüler, die sich auf einen freien Chatbot stützten, schnitten ohne ihn schlechter ab."),
    },
    {
      id: "story",
      kicker: x("Cover story", "Tema kryesore", "Titelthema"),
      title: [x("Forty per cent faster,", "Dyzet për qind më shpejt,", "Vierzig Prozent schneller,"), x("on paper", "në letër", "auf dem Papier")],
      lead: x(
        "In an experiment published in 2023, Shakked Noy and Whitney Zhang of MIT gave 453 college-educated professionals two writing tasks from their own jobs, such as a cover letter for a grant or an email about a restructuring. Half, chosen at random, could use ChatGPT for the second. Experienced people from the same occupations graded the work without knowing who had used it.",
        "Në një eksperiment të botuar në 2023, Shakked Noy dhe Whitney Zhang nga MIT u dhanë 453 profesionistëve me arsim universitar dy detyra shkrimi nga puna e tyre, si një letër shoqëruese për një grant ose një email për një ristrukturim. Gjysma, e zgjedhur rastësisht, mund të përdorte ChatGPT te detyra e dytë. Punën e vlerësuan njerëz me përvojë nga të njëjtat profesione, pa ditur kush e kishte përdorur.",
        "In einem 2023 veröffentlichten Experiment gaben Shakked Noy und Whitney Zhang vom MIT 453 Fachleuten mit Hochschulabschluss zwei Schreibaufgaben aus ihrem Beruf, etwa ein Anschreiben für einen Förderantrag oder eine E-Mail zu einer Umstrukturierung. Die Hälfte durfte, per Zufall bestimmt, bei der zweiten ChatGPT nutzen. Erfahrene Leute aus denselben Berufen bewerteten die Arbeit, ohne zu wissen, wer es genutzt hatte."),
      blocks: [
        { type: "figures", items: [
          { n: pc(40), t: x("less time on the task, on average", "më pak kohë për detyrën, mesatarisht", "weniger Zeit für die Aufgabe, im Schnitt") },
          { n: pc(18), t: x("better grades from the evaluators", "nota më të mira nga vlerësuesit", "bessere Noten von den Bewertenden") },
          { n: pc(68), t: x("handed in ChatGPT's first draft unedited (working paper)", "dorëzuan draftin e parë të ChatGPT pa e redaktuar (versioni i punës)", "gaben den ersten Entwurf von ChatGPT unbearbeitet ab (Arbeitspapier)") },
        ] },
        { type: "p", text: x(
          "Those who had done worse on the first task gained most, so the gap between workers narrowed. The authors also named the limits: the tasks needed no knowledge of a real company or customer, the instructions were explicit, and no one checked the facts in the texts.",
          "Ata që kishin dalë më dobët te detyra e parë fituan më shumë, kështu që diferenca mes punonjësve u ngushtua. Autorët i emërtuan edhe kufijtë: detyrat nuk kërkonin njohuri për një kompani ose klient të vërtetë, udhëzimet ishin të qarta, dhe askush nuk i kontrolloi faktet në tekste.",
          "Wer bei der ersten Aufgabe schwächer war, gewann am meisten, der Abstand zwischen den Beschäftigten wurde also kleiner. Die Autoren nannten auch die Grenzen: Die Aufgaben verlangten kein Wissen über ein echtes Unternehmen oder einen echten Kunden, die Anweisungen waren eindeutig, und niemand prüfte die Fakten in den Texten.") },
        { type: "callout", reading: true, text: x(
          "The experiment timed a draft, not a decision. Where a text has to be right about a customer, the time saved counts only after someone has checked it.",
          "Eksperimenti mati kohën e një drafti, jo të një vendimi. Aty ku një tekst duhet të jetë i saktë për një klient, koha e kursyer vlen vetëm pasi dikush e ka kontrolluar.",
          "Das Experiment hat einen Entwurf gestoppt, keine Entscheidung. Wo ein Text über einen Kunden stimmen muss, zählt die gesparte Zeit erst, wenn jemand ihn geprüft hat.") },
      ],
      note: x(
        "A preregistered online experiment with 20–30-minute tasks, published in Science in July 2023. The 68% comes from the working paper of March 2023 (444 participants), not from the published article; the limits are as the authors described them to MIT News.",
        "Eksperiment online i regjistruar paraprakisht, me detyra 20–30 minutëshe, i botuar te Science në korrik 2023. 68% vjen nga versioni i punës i marsit 2023 (444 pjesëmarrës), jo nga artikulli i botuar; kufijtë janë siç ua përshkruan autorët MIT News.",
        "Ein vorab registriertes Online-Experiment mit Aufgaben von 20–30 Minuten, im Juli 2023 in Science veröffentlicht. Die 68 % stammen aus dem Arbeitspapier vom März 2023 (444 Teilnehmende), nicht aus dem veröffentlichten Artikel; die Grenzen nannten die Autoren gegenüber MIT News."),
      source: ["genai-noy-zhang-2023", "genai-noy-zhang-wp-2023", "genai-mitnews-2023"],
    },
    {
      id: "numbers",
      kicker: x("The numbers", "Shifrat", "Die Zahlen"),
      title: [x("From the test", "Nga prova", "Vom Test"), x("to the working week", "te java e punës", "zur Arbeitswoche")],
      lead: x(
        "Anders Humlum and Emilie Vestergaard surveyed about 25,000 workers in Denmark, in 11 occupations exposed to AI chatbots, and linked the answers to registers of pay and hours. Time saved by users, as a share of their work hours, 2024:",
        "Anders Humlum dhe Emilie Vestergaard anketuan rreth 25.000 punonjës në Danimarkë, në 11 profesione të ekspozuara ndaj chatbot-eve AI, dhe i lidhën përgjigjet me regjistrat e pagave dhe orëve. Koha e kursyer nga përdoruesit, si pjesë e orëve të punës, 2024:",
        "Anders Humlum und Emilie Vestergaard befragten rund 25.000 Beschäftigte in Dänemark, in 11 Berufen, die KI-Chatbots ausgesetzt sind, und verknüpften die Antworten mit Registern zu Lohn und Stunden. Von Nutzern gesparte Zeit in % der Arbeitszeit, 2024:"),
      blocks: [
        { type: "dumbbell", from: x("Not encouraged", "Pa nxitje", "Nicht ermutigt"), to: x("Encouraged", "Me nxitje", "Ermutigt"), min: 0, max: 8, rowH: 26, source: ["genai-humlum-2025"],
          label: x("Time saved as a share of work hours, with and without the employer's encouragement", "Koha e kursyer si pjesë e orëve të punës, me dhe pa nxitjen e punëdhënësit", "Gesparte Zeit in % der Arbeitszeit, mit und ohne Ermutigung durch den Arbeitgeber"),
          rows: [
            { k: x("Marketing", "Marketingu", "Marketing"), a: 4.6, an: x("4.6%", "4,6%", "4,6 %"), b: 6.8, bn: x("6.8%", "6,8%", "6,8 %"), alert: true },
            { k: x("Developers", "Programuesit", "Entwickler"), a: 3.9, an: x("3.9%", "3,9%", "3,9 %"), b: 6.5, bn: x("6.5%", "6,5%", "6,5 %") },
            { k: x("Accountants", "Kontabilistët", "Buchhaltung"), a: 0.9, an: x("0.9%", "0,9%", "0,9 %"), b: 2.2, bn: x("2.2%", "2,2%", "2,2 %") },
            { k: x("Teachers", "Mësuesit", "Lehrkräfte"), a: 0.6, an: x("0.6%", "0,6%", "0,6 %"), b: 1, bn: x("1.0%", "1,0%", "1,0 %") },
          ] },
        { type: "p", text: x(
          "Across all 11 occupations, users saved 2.8% of their hours, and 80% put the time into other tasks. In no occupation did pay or recorded hours change significantly.",
          "Në të 11 profesionet, përdoruesit kursyen 2,8% të orëve, dhe 80% e vunë kohën në detyra të tjera. Në asnjë profesion nuk ndryshuan ndjeshëm pagat ose orët e regjistruara.",
          "Über alle 11 Berufe sparten Nutzer 2,8 % ihrer Zeit, und 80 % steckten sie in andere Aufgaben. In keinem Beruf änderten sich Lohn oder erfasste Stunden deutlich.") },
        { type: "callout", reading: true, text: x(
          "An experiment measures a task the tool suits. A working week is mostly other tasks.",
          "Një eksperiment mat një detyrë që i përshtatet mjetit. Një javë pune përbëhet kryesisht nga detyra të tjera.",
          "Ein Experiment misst eine Aufgabe, die zum Werkzeug passt. Eine Arbeitswoche besteht meist aus anderen Aufgaben.") },
      ],
      note: x(
        "Self-reported savings, turned by the authors into a share of work hours; 4 of the 11 occupations. Working paper of May 2025.",
        "Kursime të vetëdeklaruara, të kthyera nga autorët në pjesë të orëve; 4 nga 11 profesionet. Version pune i majit 2025.",
        "Selbst angegebene Ersparnis, von den Autoren in Anteile der Arbeitszeit umgerechnet; 4 der 11 Berufe. Arbeitspapier vom Mai 2025."),
      source: ["genai-humlum-2025"],
    },
    {
      id: "model",
      kicker: x("The model", "Modeli", "Das Modell"),
      title: [x("Three ways", "Tri mënyra", "Drei Arten,"), x("to work with AI", "për të punuar me AI", "mit KI zu arbeiten")],
      lead: x(
        "244 junior consultants at Boston Consulting Group solved the same problem with GPT-4: which of a fictional company's three brands should get the investment, in a memo of at most 500 words. Steven Randazzo, Hila Lifshitz and colleagues read all 4,975 exchanges with the AI and held 237 interviews.",
        "244 konsulentë të rinj të Boston Consulting Group zgjidhën të njëjtin problem me GPT-4: cila nga tri markat e një kompanie të shpikur duhet të merrte investimin, në një memo deri në 500 fjalë. Steven Randazzo, Hila Lifshitz dhe kolegët lexuan të 4.975 shkëmbimet me AI-në dhe bënë 237 intervista.",
        "244 junge Beraterinnen und Berater der Boston Consulting Group lösten dasselbe Problem mit GPT-4: Welche der drei Marken eines erfundenen Unternehmens soll die Investition bekommen, in einem Memo von höchstens 500 Wörtern. Steven Randazzo, Hila Lifshitz und Kollegen lasen alle 4.975 Wechsel mit der KI und führten 237 Interviews."),
      blocks: [
        { type: "cards", cols: 3, items: [
          { h: x("Cyborgs · 60%", "Kiborgët · 60%", "Cyborgs · 60 %"), p: x("work with AI at every step, in constant back and forth; gained skill with AI and kept their domain knowledge", "punojnë me AI në çdo hap, me shkëmbim të vazhdueshëm; fituan aftësi me AI-në dhe ruajtën njohuritë e fushës", "arbeiten bei jedem Schritt mit KI, im ständigen Hin und Her; gewannen KI-Können und behielten ihr Fachwissen") },
          { h: x("Centaurs · 14%", "Kentaurët · 14%", "Zentauren · 14 %"), p: x("decide what to do and how, and give AI chosen parts; most accurate answers; deepened their domain knowledge", "vendosin çfarë bëhet dhe si, dhe i japin AI-së pjesë të zgjedhura; përgjigjet më të sakta; thelluan njohuritë e fushës", "entscheiden, was und wie, und geben der KI gewählte Teile; die genauesten Antworten; vertieften ihr Fachwissen") },
          { h: x("Self-automators · 27%", "Vetautomatizuesit · 27%", "Selbstautomatisierer · 27 %"), p: x("hand the task over in one or two prompts; fast and polished, but shallow; built neither skill", "ia dorëzojnë detyrën AI-së me një ose dy kërkesa; shpejt e me pamje të mirë, por pa thellësi; nuk ndërtuan asnjë aftësi", "übergeben die Aufgabe mit ein, zwei Anfragen; schnell und glatt, aber flach; bauten keine der beiden Fähigkeiten auf") },
        ] },
        { type: "p", text: x(
          "Two questions separate the three: who chooses what has to be done, and who decides how it is done. Of the self-automators, 44% accepted the AI's text without any change; the rest made only surface edits.",
          "Dy pyetje i ndajnë të tri: kush zgjedh çfarë duhet bërë, dhe kush vendos si bëhet. Nga vetautomatizuesit, 44% e pranuan tekstin e AI-së pa asnjë ndryshim; të tjerët bënë vetëm ndryshime sipërfaqësore.",
          "Zwei Fragen trennen die drei: Wer wählt, was zu tun ist, und wer entscheidet, wie es getan wird. Von den Selbstautomatisierern übernahmen 44 % den Text der KI ohne jede Änderung, die übrigen änderten nur an der Oberfläche.") },
        { type: "callout", reading: true, text: x(
          "“A human in the loop” can mean three different things. For a manager the question is who still does the thinking, and what each way teaches.",
          "“Një njeri në cikël” mund të thotë tri gjëra të ndryshme. Për menaxherin pyetja është kush e bën ende mendimin, dhe çfarë mëson secila mënyrë.",
          "„Ein Mensch in der Schleife“ kann drei verschiedene Dinge heißen. Für die Führungskraft ist die Frage, wer noch denkt und was jede Art lehrt.") },
      ],
      note: x(
        "At the time, the task lay outside what GPT-4 did well, beyond the “jagged frontier” of issue 10. Shares as rounded by the authors (101% in total); the names in Albanian and German are ours. Working paper of 2025.",
        "Në atë kohë detyra ishte jashtë asaj që GPT-4 e bënte mirë, përtej “kufirit të dhëmbëzuar” të Nr. 10. Pjesët janë të rrumbullakosura nga autorët (101% gjithsej); emrat në shqip dhe gjermanisht janë tonët. Version pune i 2025.",
        "Die Aufgabe lag damals außerhalb dessen, was GPT-4 gut konnte, jenseits der „gezackten Grenze“ aus Ausgabe 10. Anteile wie von den Autoren gerundet (zusammen 101 %); die Namen auf Albanisch und Deutsch sind unsere. Arbeitspapier von 2025."),
      source: ["genai-randazzo-2025", "dellacqua-2023"],
    },
    {
      id: "research", more: "how-i-built-front-desk-control",
      kicker: x("What the research says", "Çfarë thotë kërkimi", "Was die Forschung sagt"),
      title: [x("Who gains,", "Kush fiton,", "Wer gewinnt,"), x("who learns", "kush mëson", "wer lernt")],
      lead: x(
        "Erik Brynjolfsson, Danielle Li and Lindsey Raymond followed 5,179 support agents serving a large software firm as an AI assistant was rolled out. It suggested replies during each chat; the agents stayed responsible and could ignore it.",
        "Erik Brynjolfsson, Danielle Li dhe Lindsey Raymond ndoqën 5.179 punonjës të mbështetjes së klientëve të një firme të madhe softueri, ndërsa futej një asistent AI. Ai sugjeronte përgjigje gjatë çdo bisede; punonjësit mbetën përgjegjës dhe mund ta injoronin.",
        "Erik Brynjolfsson, Danielle Li und Lindsey Raymond begleiteten 5.179 Supportkräfte einer großen Softwarefirma, während ein KI-Assistent eingeführt wurde. Er schlug in jedem Chat Antworten vor; die Beschäftigten blieben verantwortlich und konnten ihn übergehen."),
      blocks: [
        { type: "figures", compact: true, items: [
          { n: x("2 = 6", "2 = 6", "2 = 6"), t: x("months: agents with two months and AI did as well as those with over six months without it", "muaj: me dy muaj përvojë dhe AI punonin po aq mirë sa ata me mbi gjashtë muaj pa të", "Monate: Mit zwei Monaten und KI arbeiteten sie so gut wie andere mit über sechs Monaten ohne") },
          { n: pc(38), t: x("of the suggestions were followed, on average", "e sugjerimeve u ndoqën, mesatarisht", "der Vorschläge wurden im Schnitt befolgt") },
        ] },
        { type: "p", text: x(
          "Agents who followed the most suggestions gained close to 25%, those who followed the fewest about 10%. When the system was down, close followers still worked faster than before: they had learned. Before the AI, coaching meant a short weekly session with a manager.",
          "Ata që ndoqën më shumë sugjerime fituan afër 25%, ata që ndoqën më pak rreth 10%. Kur sistemi binte, ata që i kishin ndjekur nga afër punonin ende më shpejt se më parë: kishin mësuar. Para AI-së, trajnimi ishte një seancë e shkurtër javore me menaxherin.",
          "Wer den meisten Vorschlägen folgte, gewann fast 25 %, wer den wenigsten folgte, etwa 10 %. Fiel das System aus, arbeiteten enge Befolger immer noch schneller als vorher: Sie hatten gelernt. Vor der KI bestand das Coaching aus einer kurzen Wochensitzung mit der Führungskraft.") },
        { type: "p", text: x(
          "It can go the other way. Nearly 1,000 high-school students in Turkey who practised maths with an open GPT-4 did 48% better in practice, but 17% worse in the exam without it than students who never had it. A version that gave hints instead of answers avoided the loss.",
          "Mund të ndodhë edhe e kundërta. Gati 1.000 nxënës të shkollës së mesme në Turqi që u ushtruan në matematikë me një GPT-4 pa kufizime dolën 48% më mirë në ushtrime, por 17% më keq në provim pa të, krahasuar me ata që s'e kishin pasur kurrë. Një version që jepte udhëzime në vend të përgjigjeve e shmangu humbjen.",
          "Es geht auch umgekehrt. Fast 1.000 Schüler in der Türkei, die Mathe mit einem freien GPT-4 übten, waren beim Üben 48 % besser, in der Prüfung ohne ihn aber 17 % schlechter als jene, die ihn nie hatten. Eine Version, die Hinweise statt Antworten gab, vermied den Verlust.") },
        { type: "callout", reading: true, text: x(
          "The same tool can coach or replace. Whether people can still do the work when it is switched off has to be tested, not assumed.",
          "I njëjti mjet mund të trajnojë ose të zëvendësojë. Nëse njerëzit e bëjnë ende punën kur mjeti fiket, duhet provuar, jo supozuar.",
          "Dasselbe Werkzeug kann anleiten oder ersetzen. Ob Menschen die Arbeit noch können, wenn es abgeschaltet ist, muss man prüfen, nicht annehmen.") },
      ],
      note: x(
        "One firm, text chats only; the link between following and gains may partly reflect who chose to follow. The published version (QJE, 2025) reports the same patterns. Bastani et al. studied students, not workers.",
        "Një firmë e vetme, vetëm biseda me shkrim; lidhja mes ndjekjes dhe fitimit mund të vijë pjesërisht nga kush zgjodhi t'i ndiqte. Versioni i botuar (QJE, 2025) jep të njëjtat prirje. Bastani et al. studiuan nxënës, jo punonjës.",
        "Eine Firma, nur Text-Chats; der Zusammenhang zwischen Befolgen und Gewinn kann teils daher rühren, wer sich zum Befolgen entschied. Die veröffentlichte Fassung (QJE, 2025) zeigt dieselben Muster. Bastani et al. untersuchten Schüler, keine Beschäftigten."),
      source: ["brynjolfsson-2023", "genai-bastani-2025"],
    },
    {
      id: "measure",
      kicker: x("How it is measured", "Si matet", "Wie man es misst"),
      title: [x("Count more", "Numëro më shumë", "Mehr zählen"), x("than speed", "se shpejtësinë", "als das Tempo")],
      lead: x(
        "Speed is the easiest thing to measure. In the studies of this issue, the results also hinged on checking, on who gained, on where the time went and on what people could do without the tool. Five things to count in a trial:",
        "Shpejtësia është gjëja më e lehtë për t'u matur. Në studimet e këtij numri, rezultatet varën edhe nga kontrolli, nga kush fitoi, nga ku shkoi koha dhe nga çfarë mund të bënin njerëzit pa mjetin. Pesë gjëra që numërohen në një provë:",
        "Das Tempo ist am leichtesten zu messen. In den Studien dieser Ausgabe hingen die Ergebnisse auch an der Prüfung, daran, wer gewann, wohin die Zeit ging und was Menschen ohne das Werkzeug konnten. Fünf Dinge, die man bei einem Test zählt:"),
      blocks: [
        { type: "steps", items: [
          { h: x("Time, with the checking", "Koha, me kontrollin", "Zeit, samt Prüfung"), p: x("From the request to the finished, checked result.", "Nga kërkesa te rezultati i mbaruar dhe i kontrolluar.", "Von der Anfrage bis zum fertigen, geprüften Ergebnis.") },
          { h: x("Quality, judged blind", "Cilësia, e vlerësuar verbërisht", "Qualität, blind bewertet"), p: x("By someone who knows the work and not which version used AI.", "Nga dikush që e njeh punën, por jo cili version përdori AI.", "Von jemandem, der die Arbeit kennt, aber nicht weiß, welche Fassung KI nutzte.") },
          { h: x("New and experienced, apart", "Të rinjtë dhe të vjetrit, veç", "Neue und Erfahrene, getrennt"), p: x("An average can hide a gain for one and a loss for the other.", "Mesatarja mund të fshehë fitimin e njërit dhe humbjen e tjetrit.", "Ein Mittelwert kann den Gewinn der einen und den Verlust der anderen verdecken.") },
          { h: x("Where the saved time goes", "Ku shkon koha e kursyer", "Wohin die gesparte Zeit geht"), p: x("Name the task it moves to, or it disappears.", "Emërto detyrën ku kalon, përndryshe humbet.", "Die Aufgabe benennen, in die sie fließt, sonst verschwindet sie.") },
          { h: x("A day without the tool", "Një ditë pa mjetin", "Ein Tag ohne Werkzeug"), p: x("Can the person still do the task alone?", "A e bën ende personi detyrën vetë?", "Kann die Person die Aufgabe noch allein?") },
        ] },
        { type: "example", label: x("Hypothetical example, a month of AI drafts for customer emails", "Shembull hipotetik, një muaj drafte me AI për email-et e klientëve", "Hypothetisches Beispiel, ein Monat KI-Entwürfe für Kunden-E-Mails"), rows: [
          { k: x("Time", "Koha", "Zeit"), v: x("9 min per email before, 6 min now with checking", "9 min për email më parë, tani 6 min me kontrollin", "vorher 9 Min. pro E-Mail, jetzt 6 Min. mit Prüfung") },
          { k: x("Blind check", "Kontrolli i verbër", "Blinde Prüfung"), v: x("errors in 2 of 40 before, in 5 of 40 now", "gabime në 2 nga 40 më parë, tani në 5 nga 40", "Fehler vorher in 2 von 40, jetzt in 5 von 40") },
          { k: x("By experience", "Sipas përvojës", "Nach Erfahrung"), v: x("new staff −4 min, experienced −1 min", "të rinjtë −4 min, me përvojë −1 min", "Neue −4 Min., Erfahrene −1 Min.") },
        ], text: x("Faster, but the errors rose: the trial is not finished. The numbers are invented.", "Më shpejt, por gabimet u rritën: prova nuk ka mbaruar. Numrat janë të shpikur.", "Schneller, aber mit mehr Fehlern: Der Test ist nicht fertig. Die Zahlen sind erfunden.") },
      ],
      note: x(
        "The five checks are the editors' choice from the studies in this issue; the example is the editors'.",
        "Pesë kontrollet janë zgjedhje e redaksisë nga studimet e këtij numri; shembulli është i redaksisë.",
        "Die fünf Prüfungen hat die Redaktion aus den Studien dieser Ausgabe gewählt; das Beispiel stammt von der Redaktion."),
      source: ["genai-noy-zhang-2023", "brynjolfsson-2023", "genai-humlum-2025", "genai-bastani-2025"],
    },
    {
      id: "tool", tool: "/tools/sigma-control-chart/",
      kicker: x("Tool of the issue", "Mjeti i numrit", "Werkzeug der Ausgabe"),
      title: [x("The AI", "Karta e provës", "Die Karte für"), x("trial card", "me AI", "den KI-Test")],
      lead: x(
        "One task, one month, the same check as before. Write down what you will count before the trial starts, so the result cannot be read to fit a wish. Keep confidential data out of tools the company has not approved.",
        "Një detyrë, një muaj, i njëjti kontroll si më parë. Shkruaj çfarë do të numërosh para se të nisë prova, që rezultati të mos lexohet sipas një dëshire. Mos fut të dhëna konfidenciale në mjete që kompania nuk i ka miratuar.",
        "Eine Aufgabe, ein Monat, dieselbe Prüfung wie vorher. Vor dem Test aufschreiben, was gezählt wird, damit das Ergebnis nicht nach Wunsch gelesen wird. Vertrauliche Daten gehören nicht in Werkzeuge, die das Unternehmen nicht freigegeben hat."),
      blocks: [
        { type: "form", items: [
          { h: x("The task", "Detyra", "Die Aufgabe"), hint: x("what, how often, who does it today", "çfarë, sa shpesh, kush e bën sot", "was, wie oft, wer sie heute macht") },
          { h: x("Before the trial", "Para provës", "Vor dem Test"), hint: x("two weeks without AI: time per task and errors", "dy javë pa AI: koha për detyrë dhe gabimet", "zwei Wochen ohne KI: Zeit pro Aufgabe und Fehler") },
          { h: x("Who tries it", "Kush e provon", "Wer testet"), hint: x("new and experienced people, counted apart", "njerëz të rinj dhe me përvojë, të numëruar veç", "Neue und Erfahrene, getrennt gezählt") },
          { h: x("What to check", "Çfarë kontrollohet", "Was geprüft wird"), hint: x("facts, figures, names, tone, data that must not leave the team", "fakte, shifra, emra, toni, të dhëna që s'duhet të dalin nga ekipi", "Fakten, Zahlen, Namen, Ton, Daten, die das Team nicht verlassen dürfen"), lines: 2 },
          { h: x("Who does the thinking", "Kush bën mendimin", "Wer denkt"), hint: x("what the person decides, what the AI does", "çfarë vendos personi, çfarë bën AI", "was der Mensch entscheidet, was die KI tut") },
          { h: x("Result and decision", "Rezultati dhe vendimi", "Ergebnis und Entscheidung"), hint: x("time with checking, errors, a day without the tool; keep, change or stop", "koha me kontrollin, gabimet, një ditë pa mjetin; mbaje, ndryshoje ose ndalo", "Zeit mit Prüfung, Fehler, ein Tag ohne Werkzeug; behalten, ändern oder stoppen") },
        ] },
      ],
      note: x(
        "A practice proposed by the editors, after Noy & Zhang, Randazzo et al. and Brynjolfsson et al.; the day without the tool follows the outages in the support centre.",
        "Praktikë e propozuar nga redaksia, sipas Noy & Zhang, Randazzo et al. dhe Brynjolfsson et al.; dita pa mjetin ndjek ndërprerjet në qendrën e mbështetjes.",
        "Eine Praxis, die die Redaktion vorschlägt, nach Noy & Zhang, Randazzo et al. und Brynjolfsson et al.; der Tag ohne Werkzeug folgt den Ausfällen im Supportcenter."),
      source: ["genai-noy-zhang-2023", "genai-randazzo-2025", "brynjolfsson-2023"],
    },
    { id: "sources", type: "sources" },
    { id: "back", type: "back" },
  ],
};
