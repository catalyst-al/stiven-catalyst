// The diagrams inside the essays: a few pictures of the systems the essays describe (where a mistake is born and
// where it is measured, what crosses a handover, the three levels of escalation, the loop from the report to the
// floor, what the system decides and what the person answers for), drawn with HTML and CSS so the words wrap in every language and the picture reflows on a phone.
//
// An essay names its diagram in the front matter ("diagram: handover-gap") and marks the place in its text with a
// paragraph that is only "{diagram}"; the article layout replaces that paragraph with the figure in the page's
// language (withDiagram, below). Without the marker the figure comes at the end of the text.
//
// Every text lives here in English, German and Albanian. Six shapes:
//   flow     steps in a line, each with an optional line under it and a tag (start: where it began, measured:
//            where the number is written, gate: the check that stops it)
//   handoff  two sides and what has to cross between them
//   ladder   levels side by side, the questions that sort a situation into them, and the rules
//   loop     steps that lead back to the first
//   layers   bands one under the other
//   paths    two rows of steps with different ends

const t = (en, de, sq) => ({ en, de, sq });
const pick = (text, lang) => (text && typeof text === "object" ? text[lang] ?? text.en ?? "" : text ?? "");
const esc = (text) => String(text).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export const DIAGRAMS = [
  {
    id: "handover-gap",
    type: "handoff",
    title: t("Where an organisation loses its memory", "Wo eine Organisation ihr Gedächtnis verliert", "Ku e humbet kujtesën një organizatë"),
    left: { title: t("The shift that ends", "Die Schicht, die endet", "Turni që mbaron"), lines: [t("Did everything right", "Hat alles richtig gemacht", "Bëri gjithçka siç duhet"), t("Knows what is still open", "Weiß, was noch offen ist", "E di çfarë është ende e hapur")] },
    gap: { title: t("The handover", "Die Übergabe", "Dorëzimi"), items: [t("The state of the hotel", "Der Zustand des Hauses", "Gjendja e hotelit"), t("What happened", "Was geschehen ist", "Çfarë ndodhi"), t("What is resolved", "Was erledigt ist", "Çfarë u zgjidh"), t("What is open, with an owner and a time", "Was offen ist, mit Verantwortlichem und Uhrzeit", "Çfarë është e hapur, me përgjegjës dhe orë")] },
    right: { title: t("The shift that starts", "Die Schicht, die beginnt", "Turni që fillon"), lines: [t("Just as capable", "Genauso fähig", "Po aq i aftë"), t("Does not yet know the problem exists", "Weiß noch nicht, dass das Problem existiert", "Nuk e di ende që problemi ekziston")] },
    lost: t("What does not cross this line stays in the head of the person who has just gone home.", "Was diese Linie nicht überquert, bleibt im Kopf der Person, die gerade nach Hause gegangen ist.", "Ajo që nuk e kalon këtë vijë mbetet në kokën e personit që sapo shkoi në shtëpi."),
    caption: t("A handover is a transfer of responsibility, not only of information: every open point crosses with a name and a time.", "Eine Übergabe überträgt Verantwortung, nicht nur Information: Jeder offene Punkt geht mit Namen und Uhrzeit hinüber.", "Dorëzimi është kalim përgjegjësie, jo vetëm informacioni: çdo pikë e hapur kalon me një emër dhe një orë."),
  },
  {
    id: "between-departments",
    type: "flow",
    title: t("Where a mistake is born, and where it is measured", "Wo ein Fehler entsteht und wo er gemessen wird", "Ku lind një gabim dhe ku matet"),
    steps: [
      { label: t("Preparation", "Vorbereitung", "Përgatitja"), sub: t("A bag goes into the wrong trolley", "Eine Tasche landet im falschen Wagen", "Një çantë shkon në karrocën e gabuar"), tag: t("born here", "entsteht hier", "lind këtu"), kind: "start" },
      { label: t("The dock", "Die Rampe", "Rampa"), sub: t("The trolley is loaded as it is", "Der Wagen wird geladen, wie er ist", "Karroca ngarkohet siç është") },
      { label: t("The driver", "Der Fahrer", "Shoferi"), sub: t("Delivers what was in the van", "Liefert, was im Wagen war", "Dorëzon atë që ishte në furgon") },
      { label: t("The customer", "Der Kunde", "Klienti"), sub: t("Incomplete = 1, against the driver's name", "Incomplete = 1, auf den Namen des Fahrers", "Incomplete = 1, në emër të shoferit"), tag: t("measured here", "hier gemessen", "matet këtu"), kind: "measured" },
    ],
    caption: t("Work changes hands three times before the number is written. The place where the mistake is measured is not necessarily the place where it was born.", "Die Arbeit geht dreimal in andere Hände über, bevor die Zahl geschrieben wird. Der Ort, an dem der Fehler gemessen wird, ist nicht unbedingt der Ort, an dem er entstanden ist.", "Puna ndërron duar tri herë para se të shkruhet numri. Vendi ku matet gabimi nuk është domosdoshmërisht vendi ku lindi."),
  },
  {
    id: "table-to-ramp",
    type: "flow",
    title: t("From the table to the ramp", "Von der Tabelle zur Rampe", "Nga tabela te rampa"),
    steps: [
      { label: t("Warehouse", "Lager", "Magazina"), sub: t("The bag is prepared and scanned", "Die Tasche wird vorbereitet und gescannt", "Çanta përgatitet dhe skanohet") },
      { label: t("Loading", "Beladung", "Ngarkimi"), sub: t("It goes into the wrong trolley", "Sie landet im falschen Wagen", "Shkon në karrocën e gabuar"), tag: t("where it started", "wo es begann", "ku filloi"), kind: "start" },
      { label: t("Departure", "Abfahrt", "Nisja"), sub: t("The route leaves as complete", "Die Tour fährt als vollständig los", "Rruga niset si e plotë") },
      { label: t("Road", "Straße", "Rruga"), sub: t("Nothing to see from here", "Von hier aus nichts zu sehen", "Nga këtu nuk shihet asgjë") },
      { label: t("The door", "Die Haustür", "Dera"), sub: t("Incomplete = 1", "Incomplete = 1", "Incomplete = 1"), tag: t("where it is measured", "wo es gemessen wird", "ku matet"), kind: "measured" },
    ],
    caption: t("In Excel the mistake is a number. On the ramp it has an address: the last point where everything was still in order.", "In Excel ist der Fehler eine Zahl. An der Rampe hat er eine Adresse: der letzte Punkt, an dem noch alles in Ordnung war.", "Në Excel gabimi është një numër. Në rampë ka një adresë: pika e fundit ku gjithçka ishte ende në rregull."),
  },
  {
    id: "check-before-departure",
    type: "flow",
    title: t("The last moment a missing bag is still a question", "Der letzte Moment, in dem eine fehlende Tasche noch eine Frage ist", "Momenti i fundit kur një çantë që mungon është ende një pyetje"),
    steps: [
      { label: t("Picking", "Kommissionierung", "Përgatitja"), sub: t("Every bag linked to its order", "Jede Tasche ihrem Auftrag zugeordnet", "Çdo çantë e lidhur me porosinë e saj") },
      { label: t("Loading", "Beladung", "Ngarkimi"), sub: t("Bags counted, trolleys unmixed", "Taschen gezählt, Wagen nicht gemischt", "Çantat të numëruara, karrocat pa përzierje") },
      { label: t("Check before departure", "Kontrolle vor der Abfahrt", "Kontrolli para nisjes"), sub: t("A bag is missing: the trolley stops, the Team Leader is told", "Eine Tasche fehlt: Der Wagen bleibt stehen, der Team Leader wird informiert", "Mungon një çantë: karroca ndalet, njoftohet Team Leader-i"), tag: t("the gate", "die Schranke", "porta"), kind: "gate" },
      { label: t("Road", "Straße", "Rruga"), sub: t("Too late to find it", "Zu spät, um sie zu finden", "Tepër vonë për ta gjetur") },
      { label: t("The door", "Die Haustür", "Dera"), sub: t("A complaint, not a question", "Eine Beschwerde, keine Frage", "Një ankesë, jo një pyetje"), tag: t("measured here", "hier gemessen", "matet këtu"), kind: "measured" },
    ],
    caption: t("The best check is not the one that counts incomplete orders. It is the one that stops them before they leave.", "Die beste Kontrolle ist nicht die, die unvollständige Aufträge zählt. Es ist die, die sie aufhält, bevor sie losfahren.", "Kontrolli më i mirë nuk është ai që numëron porositë e paplota. Është ai që i ndal para se të nisen."),
  },
  {
    id: "escalation-matrix",
    type: "ladder",
    title: t("Three levels, five questions", "Drei Stufen, fünf Fragen", "Tre nivele, pesë pyetje"),
    levels: [
      { title: t("Solve it yourself", "Selbst lösen", "Zgjidhe vetë"), when: t("Within your role, the standard is clear, the risk is low, the decision can be reversed.", "In Ihrer Rolle, der Standard ist klar, das Risiko gering, die Entscheidung umkehrbar.", "Brenda rolit tënd, standardi i qartë, rreziku i ulët, vendimi i kthyeshëm.") },
      { title: t("Solve it and inform", "Lösen und informieren", "Zgjidhe dhe informo"), when: t("Within your authority, but it matters for the next shift, a KPI, the customer, or may happen again.", "In Ihrer Befugnis, aber wichtig für die nächste Schicht, eine Kennzahl, den Kunden, oder es kann wieder passieren.", "Brenda autoritetit tënd, por ka rëndësi për turnin tjetër, një KPI, klientin, ose mund të përsëritet.") },
      { title: t("Do not touch it, escalate it", "Nicht anfassen, eskalieren", "Mos e prek, eskaloje"), when: t("Safety, security, compliance, sensitive data, payments or decisions beyond the role.", "Sicherheit, Security, Compliance, sensible Daten, Zahlungen oder Entscheidungen jenseits der Rolle.", "Siguria, security, pajtueshmëria, të dhëna të ndjeshme, pagesa ose vendime përtej rolit.") },
    ],
    questions: [
      t("Is it within my authority?", "Liegt es in meiner Befugnis?", "A është brenda autoritetit tim?"),
      t("Is there a safety or compliance risk?", "Gibt es ein Sicherheits- oder Compliance-Risiko?", "A ka rrezik sigurie ose pajtueshmërie?"),
      t("Can the decision be reversed?", "Lässt sich die Entscheidung rückgängig machen?", "A mund të kthehet vendimi?"),
      t("Does it affect someone outside my shift?", "Betrifft es jemanden außerhalb meiner Schicht?", "A prek dikë jashtë turnit tim?"),
      t("What happens if I wait?", "Was passiert, wenn ich warte?", "Çfarë ndodh nëse pres?"),
    ],
    rules: [
      { text: t("1 is no, or 2 is yes", "1 ist nein, oder 2 ist ja", "1 është jo, ose 2 është po"), level: 3 },
      { text: t("Not reversible, or someone outside the shift", "Nicht umkehrbar, oder jemand außerhalb der Schicht", "E pakthyeshme, ose dikush jashtë turnit"), level: 2 },
      { text: t("All the answers are calm", "Alle Antworten sind ruhig", "Të gjitha përgjigjet janë të qeta"), level: 1 },
      { text: t("Question 5 sets the speed: if waiting raises the risk, escalate now with what you know.", "Frage 5 bestimmt das Tempo: Erhöht Warten das Risiko, jetzt eskalieren, mit dem, was Sie wissen.", "Pyetja 5 cakton shpejtësinë: nëse pritja e rrit rrezikun, eskaloje tani me atë që di."), level: 0 },
    ],
    caption: t("The matrix does not replace judgement. It gives judgement the same questions, whoever is on shift.", "Die Matrix ersetzt kein Urteil. Sie gibt dem Urteil dieselben Fragen, wer auch immer Schicht hat.", "Matrica nuk e zëvendëson gjykimin. I jep gjykimit të njëjtat pyetje, kushdo qoftë në turn."),
  },
  {
    id: "handover-to-briefing",
    type: "flow",
    title: t("The handover tells you what you inherit. The briefing decides what matters now.", "Die Übergabe sagt, was Sie übernehmen. Das Briefing entscheidet, was jetzt zählt.", "Dorëzimi të thotë çfarë trashëgon. Briefing-u vendos çfarë ka rëndësi tani."),
    steps: [
      { label: t("The handover", "Die Übergabe", "Dorëzimi"), sub: t("Complete: the state, the open items, the cases waiting for follow-up", "Vollständig: der Zustand, die offenen Punkte, die Fälle, die Nachverfolgung brauchen", "I plotë: gjendja, pikat e hapura, rastet që presin ndjekje"), tag: t("everything", "alles", "gjithçka"), kind: "start" },
      { label: t("The briefing", "Das Briefing", "Briefing-u"), sub: t("Selective: what changed, where the risk is, two or three priorities, each with a name", "Selektiv: was sich geändert hat, wo das Risiko liegt, zwei oder drei Prioritäten, jede mit einem Namen", "Selektiv: çfarë ndryshoi, ku është rreziku, dy ose tri prioritete, secili me një emër"), tag: t("ten minutes", "zehn Minuten", "dhjetë minuta"), kind: "gate" },
      { label: t("The first hour", "Die erste Stunde", "Ora e parë"), sub: t("Ask one person: what are today's two priorities?", "Fragen Sie eine Person: Was sind heute die zwei Prioritäten?", "Pyet një person: cilat janë dy prioritetet e sotme?"), tag: t("the test", "der Test", "testi"), kind: "measured" },
    ],
    caption: t("If the briefing reads the handover aloud, the team hears everything and holds on to nothing.", "Liest das Briefing die Übergabe vor, hört das Team alles und behält nichts.", "Nëse briefing-u e lexon dorëzimin me zë, ekipi dëgjon gjithçka dhe nuk mban asgjë."),
  },
  {
    id: "improvement-paths",
    type: "paths",
    title: t("Two ways an improvement can go", "Zwei Wege, die eine Verbesserung nehmen kann", "Dy rrugë që mund të marrë një përmirësim"),
    rows: [
      { title: t("Held by attention", "Getragen von Aufmerksamkeit", "E mbajtur nga vëmendja"), steps: [t("The problem is solved", "Das Problem ist gelöst", "Problemi zgjidhet"), t("The manager watches it", "Die Führungskraft hat es im Blick", "Menaxheri e ndjek"), t("The attention moves on", "Die Aufmerksamkeit wandert weiter", "Vëmendja kalon diku tjetër")], outcome: t("It fades", "Es verblasst", "Shuhet"), kind: "fade" },
      { title: t("Held by the system", "Getragen vom System", "E mbajtur nga sistemi"), steps: [t("The problem is solved", "Das Problem ist gelöst", "Problemi zgjidhet"), t("Documented, trained, with an owner", "Dokumentiert, geschult, mit Verantwortlichem", "E dokumentuar, e trajnuar, me përgjegjës"), t("Checked and updated", "Geprüft und aktualisiert", "E kontrolluar dhe e përditësuar")], outcome: t("It holds without you", "Es hält ohne Sie", "Mbahet pa ty"), kind: "hold" },
    ],
    caption: t("A good manager can improve a working day. A good system keeps the improvement alive on the day the manager is not there.", "Eine gute Führungskraft kann einen Arbeitstag verbessern. Ein gutes System hält die Verbesserung auch an dem Tag am Leben, an dem die Führungskraft nicht da ist.", "Një menaxher i mirë mund të përmirësojë një ditë pune. Një sistem i mirë e mban gjallë përmirësimin edhe ditën kur menaxheri nuk është aty."),
  },
  {
    id: "dmaic-loop",
    type: "loop",
    title: t("DMAIC: five phases, one discipline", "DMAIC: fünf Phasen, eine Disziplin", "DMAIC: pesë faza, një disiplinë"),
    steps: [
      { label: t("Define", "Definieren", "Përkufizo"), sub: t("One problem, one place, one period", "Ein Problem, ein Ort, ein Zeitraum", "Një problem, një vend, një periudhë") },
      { label: t("Measure", "Messen", "Mat"), sub: t("Which number, from where, and what it was before", "Welche Zahl, woher, und was sie vorher war", "Cili numër, nga ku, dhe sa ishte më parë") },
      { label: t("Analyse", "Analysieren", "Analizo"), sub: t("The cause you tested, not the first that came to mind", "Die geprüfte Ursache, nicht die erste, die einfiel", "Shkaku që teston, jo i pari që të vjen në mendje") },
      { label: t("Improve", "Verbessern", "Përmirëso"), sub: t("A change you can try", "Eine Änderung, die Sie ausprobieren können", "Një ndryshim që mund ta provosh") },
      { label: t("Control", "Kontrollieren", "Kontrollo"), sub: t("Who follows it, how often, what if it comes back", "Wer es verfolgt, wie oft, was bei Rückfall", "Kush e ndjek, sa shpesh, çfarë nëse kthehet"), key: true },
    ],
    back: t("A problem is not solved just because it did not happen again today: Control sends you back to the number.", "Ein Problem ist nicht gelöst, nur weil es heute nicht wieder aufgetreten ist: Kontrollieren schickt Sie zurück zur Zahl.", "Problemi nuk është zgjidhur vetëm sepse sot nuk ndodhi përsëri: Kontrollo të kthen te numri."),
    caption: t("The value of DMAIC lies in the discipline not to jump straight from the problem to the solution.", "Der Wert von DMAIC liegt in der Disziplin, nicht direkt vom Problem zur Lösung zu springen.", "Vlera e DMAIC-ut qëndron te disiplina për të mos kërcyer drejtpërdrejt nga problemi te zgjidhja."),
  },
  {
    id: "gemba-loop",
    type: "loop",
    title: t("From the report to the floor and back", "Vom Bericht zum Ort der Arbeit und zurück", "Nga raporti në terren dhe mbrapsht"),
    steps: [
      { label: t("The report", "Der Bericht", "Raporti"), sub: t("One number brings you to the floor, not a feeling", "Eine Zahl schickt Sie vor Ort, kein Gefühl", "Një numër të sjell në terren, jo një ndjesi") },
      { label: t("The floor", "Vor Ort", "Terreni"), sub: t("See the facts, listen before you explain, find the obstacle the number does not show", "Fakten sehen, zuhören, bevor Sie erklären, das Hindernis finden, das die Zahl nicht zeigt", "Shiko faktet, dëgjo para se të shpjegosh, gjej pengesën që numri nuk e tregon"), key: true },
      { label: t("The action", "Die Maßnahme", "Veprimi"), sub: t("One action, an owner, a date on which it is checked", "Eine Maßnahme, ein Verantwortlicher, ein Prüfdatum", "Një veprim, një përgjegjës, një datë kur kontrollohet") },
    ],
    back: t("Tomorrow's report shows whether the action changed the number.", "Der Bericht von morgen zeigt, ob die Maßnahme die Zahl verändert hat.", "Raporti i nesërm tregon nëse veprimi e ndryshoi numrin."),
    caption: t("An observation without an action is only a memory.", "Eine Beobachtung ohne Maßnahme ist nur eine Erinnerung.", "Një vëzhgim pa veprim është vetëm një kujtim."),
  },
  {
    id: "three-layers",
    type: "layers",
    title: t("Three layers under one number", "Drei Schichten unter einer Zahl", "Tre shtresa nën një numër"),
    rows: [
      { title: t("The KPI", "Die Kennzahl", "KPI-ja"), text: t("What happened: Delay 2.8% today.", "Was geschehen ist: Delay 2,8 % heute.", "Çfarë ndodhi: Delay 2,8% sot.") },
      { title: t("The trend", "Der Trend", "Trendi"), text: t("Is something changing? Today next to the last ten days: an exception, or several days going the same way.", "Verändert sich etwas? Heute neben den letzten zehn Tagen: eine Ausnahme, oder mehrere Tage in dieselbe Richtung.", "A po ndryshon diçka? Dita e sotme pranë dhjetë ditëve të fundit: një përjashtim, apo disa ditë në të njëjtin drejtim.") },
      { title: t("The process", "Der Prozess", "Procesi"), text: t("What to do: a concrete cause, found before the rule is changed.", "Was zu tun ist: eine konkrete Ursache, gefunden, bevor die Regel geändert wird.", "Çfarë të bësh: një shkak konkret, i gjetur para se të ndryshohet rregulli.") },
    ],
    caption: t("A bad day is a signal to check. It is not automatically proof that the whole process has to change.", "Ein schlechter Tag ist ein Signal, nachzusehen. Er ist nicht automatisch der Beweis, dass der ganze Prozess geändert werden muss.", "Një ditë e keqe është sinjal për të kontrolluar. Nuk është automatikisht provë që i gjithë procesi duhet të ndryshojë."),
  },
  {
    id: "decision-split",
    type: "handoff",
    title: t("Who decides, who answers", "Wer entscheidet, wer verantwortet", "Kush vendos, kush përgjigjet"),
    left: { title: t("The system", "Das System", "Sistemi"), lines: [t("Faster than you in everything it was told", "Schneller als Sie in allem, was man ihm gesagt hat", "Më i shpejtë se ti në gjithçka që i është thënë"), t("Right in 98 cases out of 100", "In 98 von 100 Fällen richtig", "I saktë në 98 raste nga 100")] },
    gap: { title: t("What it was never told", "Was ihm nie gesagt wurde", "Çfarë nuk i është thënë kurrë"), items: [t("The shop that opens at ten", "Der Laden, der um zehn öffnet", "Dyqani që hap në orën dhjetë"), t("The gate that is broken", "Das Tor, das kaputt ist", "Porta që është e prishur"), t("The guest who complained yesterday", "Der Gast, der sich gestern beschwert hat", "Mysafiri që u ankua dje"), t("The bag that was in the wrong trolley", "Die Tasche, die im falschen Wagen lag", "Çanta që ishte në karrocën e gabuar")] },
    right: { title: t("The person on shift", "Die Person in der Schicht", "Njeriu në turn"), lines: [t("Slower, and on the floor", "Langsamer, und vor Ort", "Më i ngadaltë, dhe në terren"), t("Notices the two cases, answers for all hundred", "Bemerkt die zwei Fälle, verantwortet alle hundert", "I vëren dy rastet, përgjigjet për të njëqindtat")] },
    lost: t("A decision the system takes with something missing is still taken in your name.", "Eine Entscheidung, die das System mit einer Lücke trifft, wird trotzdem in Ihrem Namen getroffen.", "Një vendim që sistemi e merr me diçka që i mungon, merret prapë në emrin tënd."),
    caption: t("The system brings speed, memory and numbers. The person brings what it was never told, and the name that answers.", "Das System bringt Tempo, Gedächtnis und Zahlen. Der Mensch bringt, was ihm nie gesagt wurde, und den Namen, der verantwortet.", "Sistemi sjell shpejtësi, kujtesë dhe numra. Njeriu sjell atë që sistemit nuk i është thënë kurrë, dhe emrin që përgjigjet."),
  },
  {
    id: "dashboard-lag",
    type: "flow",
    title: t("How old is a red number", "Wie alt eine rote Zahl ist", "Sa i vjetër është një numër i kuq"),
    steps: [
      { label: t("The floor", "Vor Ort", "Salla"), sub: t("The van is still at the dock", "Der Wagen steht noch an der Rampe", "Furgoni është ende në rampë"), tag: t("it happens here", "hier passiert es", "këtu ndodh"), kind: "start" },
      { label: t("Someone sees it", "Jemand sieht es", "Dikush e sheh"), sub: t("Or nobody does, yet", "Oder noch niemand", "Ose ende askush") },
      { label: t("Someone reports it", "Jemand meldet es", "Dikush e raporton"), sub: t("A scan, a message, a call", "Ein Scan, eine Nachricht, ein Anruf", "Një skanim, një mesazh, një telefonatë") },
      { label: t("The system counts it", "Das System rechnet", "Sistemi e llogarit"), sub: t("Against the target, at its own pace", "Gegen das Ziel, in seinem Takt", "Kundrejt objektivit, me ritmin e vet") },
      { label: t("Your screen", "Ihr Bildschirm", "Ekrani yt"), sub: t("The number turns red", "Die Zahl wird rot", "Numri skuqet"), tag: t("you see it here", "hier sehen Sie es", "këtu e sheh"), kind: "measured" },
    ],
    caption: t("Every step takes time. The red you see is the floor as it was, not as it is. Ask how old it is before you act on it.", "Jeder Schritt braucht Zeit. Das Rot, das Sie sehen, zeigt die Lage, wie sie war, nicht, wie sie ist. Fragen Sie, wie alt es ist, bevor Sie danach handeln.", "Çdo hap merr kohë. E kuqja që sheh është terreni siç ishte, jo siç është. Pyet sa e vjetër është para se të veprosh mbi të."),
  },
];

export const diagramById = (id) => DIAGRAMS.find((d) => d.id === id) || null;

const pad = (n) => String(n).padStart(2, "0");

const step = (s, lang, i) => {
  const kind = s.kind ? ` is-${s.kind}` : "";
  const key = s.key ? " is-key" : "";
  return `<li class="dg-step${kind}${key}"><span class="dg-n">${pad(i + 1)}</span><strong>${esc(pick(s.label, lang))}</strong>` +
    (s.sub ? `<span class="dg-sub">${esc(pick(s.sub, lang))}</span>` : "") +
    (s.tag ? `<em class="dg-tag">${esc(pick(s.tag, lang))}</em>` : "") + `</li>`;
};

const shapes = {
  flow: (d, lang) => `<ol class="dg-steps">${d.steps.map((s, i) => step(s, lang, i)).join("")}</ol>`,
  loop: (d, lang) => `<ol class="dg-steps">${d.steps.map((s, i) => step(s, lang, i)).join("")}</ol><p class="dg-return"><span aria-hidden="true">↺</span>${esc(pick(d.back, lang))}</p>`,
  handoff: (d, lang) => {
    const side = (s, cls) => `<div class="dg-side ${cls}"><strong>${esc(pick(s.title, lang))}</strong>${(s.lines || []).map((l) => `<span>${esc(pick(l, lang))}</span>`).join("")}</div>`;
    return `<div class="dg-handoff">${side(d.left, "is-left")}<div class="dg-gap"><strong>${esc(pick(d.gap.title, lang))}</strong><ul>${d.gap.items.map((l) => `<li>${esc(pick(l, lang))}</li>`).join("")}</ul></div>${side(d.right, "is-right")}</div>` +
      (d.lost ? `<p class="dg-lost">${esc(pick(d.lost, lang))}</p>` : "");
  },
  ladder: (d, lang) => `<ol class="dg-levels">${d.levels.map((l, i) => `<li class="dg-level is-level-${i + 1}"><span class="dg-n">${pad(i + 1)}</span><strong>${esc(pick(l.title, lang))}</strong><span class="dg-sub">${esc(pick(l.when, lang))}</span></li>`).join("")}</ol>` +
    `<ol class="dg-questions">${d.questions.map((q, i) => `<li><b>${i + 1}</b>${esc(pick(q, lang))}</li>`).join("")}</ol>` +
    `<ul class="dg-rules">${d.rules.map((r) => `<li class="${r.level ? `is-level-${r.level}` : "is-note"}">${esc(pick(r.text, lang))}${r.level ? `<em aria-hidden="true">→ ${pad(r.level)}</em>` : ""}</li>`).join("")}</ul>`,
  layers: (d, lang) => `<ol class="dg-layers">${d.rows.map((r, i) => `<li class="dg-layer is-layer-${i + 1}"><span class="dg-n">${pad(i + 1)}</span><div><strong>${esc(pick(r.title, lang))}</strong><span class="dg-sub">${esc(pick(r.text, lang))}</span></div></li>`).join("")}</ol>`,
  paths: (d, lang) => `<div class="dg-paths">${d.rows.map((r) => `<div class="dg-path is-${r.kind}"><p class="dg-path-title">${esc(pick(r.title, lang))}</p><ol class="dg-steps">${r.steps.map((s, i) => `<li class="dg-step"><span class="dg-n">${pad(i + 1)}</span><strong>${esc(pick(s, lang))}</strong></li>`).join("")}<li class="dg-step dg-outcome"><strong>${esc(pick(r.outcome, lang))}</strong></li></ol></div>`).join("")}</div>`,
};

// The figure for a diagram id in a language, or "" when the id is unknown.
export const renderDiagram = (id, lang = "en") => {
  const d = diagramById(id);
  if (!d || !shapes[d.type]) return "";
  const title = esc(pick(d.title, lang));
  return `<figure class="essay-diagram dg dg-${d.type}" data-diagram="${esc(d.id)}" role="group" aria-labelledby="diagram-${esc(d.id)}">` +
    `<p class="dg-title" id="diagram-${esc(d.id)}">${title}</p>${shapes[d.type](d, lang)}` +
    (d.caption ? `<figcaption>${esc(pick(d.caption, lang))}</figcaption>` : "") + `</figure>`;
};

// The body of an essay with its diagram in place of the "{diagram}" paragraph, else after the text. A body whose
// essay names no diagram is returned as it is, with any stray marker removed.
export const withDiagram = (html, id, lang = "en") => {
  const body = String(html || "");
  const marker = /<p>\s*\{diagram\}\s*<\/p>\s*/;
  const figure = id ? renderDiagram(id, lang) : "";
  if (!figure) return body.replace(marker, "");
  return marker.test(body) ? body.replace(marker, figure) : body + figure;
};
