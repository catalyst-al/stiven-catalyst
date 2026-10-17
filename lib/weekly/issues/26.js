// Management Review, No. 26: The first 90 days in a new role. Block: Role.
// Facts and their sources: docs/revista/management-review-nr-26.md.
import { x, pc } from "../common.js";

export default {
  number: 26,
  block: "role",
  date: x("October 2026", "Tetor 2026", "Oktober 2026"),
  theme: [x("The first 90 days", "90 ditët e para", "Die ersten 90 Tage"), x("in a new role", "në një rol të ri", "in einer neuen Rolle")],
  sub: x(
    "How long until a new leader gives back what they cost, what 1,195 executives say about their transitions, Watkins's five situations, Gabarro's five stages, and a card for the first 90 days.",
    "Sa kohë i duhet një drejtuesi të ri për të kthyer atë që kushton, çfarë thonë 1.195 drejtues për tranzicionin, pesë situatat e Watkins-it, pesë fazat e Gabarro-s, dhe një kartë për 90 ditët e para.",
    "Wie lange eine neue Führungskraft braucht, um zurückzugeben, was sie kostet, was 1.195 Topmanager über ihren Übergang sagen, Watkins' fünf Situationen, Gabarros fünf Phasen und eine Karte für 90 Tage."),
  seo: x(
    "The first 90 days in a new role: Watkins's breakeven point, McKinsey's survey of 1,195 executives, five situations, Gabarro's five stages and a card.",
    "90 ditët e para në një rol të ri: pika e barazimit e Watkins-it, anketa e McKinsey-t me 1.195 drejtues, pesë situata, fazat e Gabarro-s dhe një kartë.",
    "Die ersten 90 Tage in einer neuen Rolle: Watkins' Break-even, McKinseys Umfrage unter 1.195 Topmanagern, fünf Situationen, Gabarros Phasen, eine Karte."),
  feature: x(
    "Over 200 CEOs and company presidents estimate that a mid-level manager in a new role needs 6.2 months to reach Michael Watkins's breakeven point. Issue 26 hears 1,195 executives on their transitions, sets out the five situations of Watkins's STARS model, and follows John Gabarro's five stages of taking charge and Matthew Bidwell's external hires. A card for the first 90 days closes it.",
    "Mbi 200 CEO dhe presidentë kompanish vlerësojnë se një menaxheri të nivelit të mesëm në rol të ri i duhen 6,2 muaj për të arritur pikën e barazimit të Michael Watkins-it. Numri 26 dëgjon 1.195 drejtues për tranzicionet e tyre, shtjellon pesë situatat e modelit STARS të Watkins-it, dhe ndjek pesë fazat e marrjes së drejtimit sipas John Gabarro-s dhe të punësuarit nga jashtë te Matthew Bidwell-i. Mbyllet me një kartë për 90 ditët e para.",
    "Über 200 CEOs und Unternehmenschefs schätzen, dass eine Führungskraft der mittleren Ebene in neuer Rolle 6,2 Monate bis zu Michael Watkins' Break-even-Punkt braucht. Ausgabe 26 hört 1.195 Topmanager zu ihrem Übergang, stellt die fünf Situationen von Watkins' STARS-Modell vor und folgt John Gabarros fünf Phasen der Übernahme sowie Matthew Bidwells externen Neuzugängen. Den Abschluss bildet eine Karte für die ersten 90 Tage."),
  figure: { n: x("6.2", "6,2", "6,2"), by: "Watkins, 2003", t: x(
    "months, on average, for a mid-level manager in a new role to give as much value as they have consumed, by the estimate of over 200 CEOs and presidents.",
    "muaj, mesatarisht, i duhen një menaxheri të nivelit të mesëm në rol të ri për të dhënë po aq vlerë sa ka marrë, sipas vlerësimit të mbi 200 CEO-ve dhe presidentëve.",
    "Monate braucht eine Führungskraft der mittleren Ebene in neuer Rolle im Schnitt, um so viel Wert zu schaffen, wie sie verbraucht hat, nach Schätzung von über 200 CEOs und Unternehmenschefs.") },
  teasers: [
    { page: "story", kicker: x("Cover story", "Tema kryesore", "Titelthema"),
      title: x("6.2 months to break even", "6,2 muaj deri te barazimi", "6,2 Monate bis zum Break-even") },
    { page: "model", kicker: x("The model", "Modeli", "Das Modell"),
      title: x("Five situations", "Pesë situata", "Fünf Situationen") },
    { page: "tool", kicker: x("Tool of the issue", "Mjeti i numrit", "Werkzeug der Ausgabe"),
      title: x("The 90-day card", "Karta e 90 ditëve", "Die 90-Tage-Karte") },
  ],
  sources: ["watkins-2003", "watkins-2009", "watkins-2013", "mckinsey-csuite-2015", "mckinsey-transitions-2018", "gabarro-1985", "bidwell-2011", "fisher-1998"],
  pages: [
    { id: "cover", type: "cover" },
    {
      id: "intro", type: "intro",
      why: x(
        "Every new role starts with a stretch in which the organisation gives more than it gets back. How long does it last, what makes it go wrong, and what can a new leader do in the first 90 days?",
        "Çdo rol i ri nis me një periudhë kur organizata jep më shumë sesa merr. Sa zgjat kjo periudhë, çfarë e bën të shkojë keq, dhe çfarë mund të bëjë një drejtues i ri në 90 ditët e para?",
        "Jede neue Rolle beginnt mit einer Phase, in der die Organisation mehr gibt, als sie zurückbekommt. Wie lange dauert sie, woran scheitert sie, und was kann eine neue Führungskraft in den ersten 90 Tagen tun?"),
      body: x(
        "Over 200 CEOs and company presidents estimate that a mid-level manager in a new role needs 6.2 months on average to give back as much value as they have consumed. Of 1,195 executives surveyed by McKinsey, about a third needed more than 100 days to feel fully comfortable, and culture was the hardest part. Michael Watkins sorts transitions into five situations, John Gabarro found five stages of taking charge, and Matthew Bidwell found that external hires were paid more and rated lower in their first two years.",
        "Mbi 200 CEO dhe presidentë kompanish vlerësojnë se një menaxheri të nivelit të mesëm në rol të ri i duhen mesatarisht 6,2 muaj për të kthyer po aq vlerë sa ka marrë. Nga 1.195 drejtues që pyeti McKinsey, rreth një të tretës iu deshën mbi 100 ditë për t'u ndier plotësisht rehat, dhe kultura ishte pjesa më e vështirë. Michael Watkins i ndan tranzicionet në pesë situata, John Gabarro gjeti pesë faza të marrjes së drejtimit, dhe Matthew Bidwell gjeti se të punësuarit nga jashtë paguheshin më shumë dhe vlerësoheshin më ulët në dy vitet e para.",
        "Über 200 CEOs und Unternehmenschefs schätzen, dass eine Führungskraft der mittleren Ebene in neuer Rolle im Schnitt 6,2 Monate braucht, um so viel Wert zurückzugeben, wie sie verbraucht hat. Von 1.195 Topmanagern, die McKinsey befragte, brauchte etwa ein Drittel über 100 Tage, um sich ganz wohlzufühlen; am schwersten war die Kultur. Michael Watkins ordnet Übergänge fünf Situationen zu, John Gabarro fand fünf Phasen der Übernahme, und Matthew Bidwell stellte fest, dass extern Eingestellte mehr verdienten und in den ersten zwei Jahren schlechter bewertet wurden."),
    },
    {
      id: "story",
      kicker: x("Cover story", "Tema kryesore", "Titelthema"),
      title: [x("6.2 months", "6,2 muaj", "6,2 Monate"), x("to break even", "deri te barazimi", "bis zum Break-even")],
      lead: x(
        "Michael Watkins calls it the breakeven point: the moment a new leader has given the new organisation as much value as they have consumed from it. Over 200 CEOs and company presidents put the time a typical mid-level manager needs to get there at 6.2 months on average.",
        "Michael Watkins e quan pikë barazimi çastin kur drejtuesi i ri i ka dhënë organizatës së re po aq vlerë sa ka marrë prej saj. Mbi 200 CEO dhe presidentë kompanish e vlerësuan kohën që i duhet një menaxheri tipik të nivelit të mesëm për të mbërritur aty: 6,2 muaj mesatarisht.",
        "Michael Watkins spricht vom Break-even-Punkt: dem Moment, in dem eine neue Führungskraft der neuen Organisation so viel Wert gegeben hat, wie sie von ihr verbraucht hat. Über 200 CEOs und Unternehmenschefs schätzten die Zeit, die eine typische Führungskraft der mittleren Ebene dafür braucht, auf durchschnittlich 6,2 Monate."),
      blocks: [
        { type: "people", source: ["watkins-2003"],
          label: x("Managers in large corporations who take a new leadership role each year, by Watkins's estimate", "Menaxherët në korporatat e mëdha që marrin një rol të ri drejtues çdo vit, sipas vlerësimit të Watkins-it", "Führungskräfte in Großunternehmen, die jedes Jahr eine neue Führungsrolle übernehmen, nach Schätzung von Watkins"),
          groups: [
            { v: 1, tone: "red", n: x("1 in 4", "1 në 4", "1 von 4"), t: x("takes a new leadership role", "merr një rol të ri drejtues", "übernimmt eine neue Führungsrolle") },
            { v: 3, tone: "dim", n: x("3 in 4", "3 në 4", "3 von 4"), t: x("the others", "të tjerët", "die übrigen") },
          ] },
        { type: "p", text: x(
          "The time varies widely with the situation, and the 6.2 months are an estimate by senior leaders rather than a measurement. Still, if about a quarter of managers enter a new role every year, transitions are no rare event in a large company.",
          "Koha ndryshon shumë sipas situatës, dhe 6,2 muajt janë vlerësim i drejtuesve të lartë, jo matje. Megjithatë, nëse rreth një e katërta e menaxherëve hyjnë çdo vit në një rol të ri, tranzicionet në një kompani të madhe nuk janë ngjarje të rralla.",
          "Die Zeit schwankt je nach Situation stark, und die 6,2 Monate sind eine Schätzung von Topführungskräften, keine Messung. Doch wenn etwa ein Viertel der Führungskräfte jedes Jahr in eine neue Rolle wechselt, sind Übergänge in einem großen Unternehmen kein seltenes Ereignis.") },
        { type: "callout", reading: true, text: x(
          "Until the breakeven point the organisation is investing in the new leader. A planned start can shorten that time; no plan makes it disappear.",
          "Deri te pika e barazimit, organizata po investon te drejtuesi i ri. Një fillim i planifikuar mund ta shkurtojë këtë kohë; asnjë plan nuk e zhduk.",
          "Bis zum Break-even investiert die Organisation in die neue Führungskraft. Ein geplanter Start kann diese Zeit verkürzen; kein Plan lässt sie verschwinden.") },
      ],
      note: x(
        "Both figures are estimates from Watkins's book of 2003; the method and the year of the survey are not given.",
        "Të dyja shifrat janë vlerësime nga libri i Watkins-it i vitit 2003; metoda dhe viti i anketës nuk jepen.",
        "Beide Zahlen sind Schätzungen aus Watkins' Buch von 2003; Methode und Jahr der Umfrage werden nicht genannt."),
      source: ["watkins-2003"],
    },
    {
      id: "numbers",
      kicker: x("The numbers", "Shifrat", "Die Zahlen"),
      title: [x("1,195 executives", "1.195 drejtues", "1.195 Topmanager"), x("look back", "shohin pas", "blicken zurück")],
      lead: x(
        "In July 2014 McKinsey asked 1,195 C-suite executives about their transitions, the first 18 months in the role. Culture was the area all of them found hardest to understand, whether they came from inside or from outside.",
        "Në korrik 2014, McKinsey pyeti 1.195 drejtues të nivelit më të lartë për tranzicionet e tyre, 18 muajt e parë në rol. Kultura ishte fusha që të gjithë e gjetën më të vështirë për ta kuptuar, qofshin të ardhur nga brenda apo nga jashtë.",
        "Im Juli 2014 befragte McKinsey 1.195 Mitglieder der obersten Führungsebene zu ihrem Übergang, den ersten 18 Monaten in der Rolle. Die Kultur war für alle am schwersten zu verstehen, ob sie von innen oder von außen kamen."),
      blocks: [
        { type: "columns", max: 50, height: 100, source: ["mckinsey-csuite-2015"],
          label: x("Say more information on the culture would have helped them most in the transition (%)", "Thonë se më shumë informacion për kulturën do t'i kishte ndihmuar më së shumti në tranzicion (%)", "Sagen, mehr Wissen über die Kultur hätte ihnen im Übergang am meisten geholfen (%)"),
          items: [
            { k: x("From outside", "Nga jashtë", "Von außen"), v: 42, n: pc(42), alert: true },
            { k: x("From inside", "Nga brenda", "Von innen"), v: 29, n: pc(29) },
          ] },
        { type: "figures", compact: true, items: [
          { n: pc(27), t: x("think their organisation had the right resources or programmes to support the move", "mendojnë se organizata kishte burimet ose programet e duhura për t'i mbështetur", "meinen, ihre Organisation habe die richtigen Mittel oder Programme für den Wechsel gehabt") },
          { n: "≈ 1/3", t: x("needed more than 100 days to feel fully comfortable in the role", "iu deshën më shumë se 100 ditë për t'u ndier plotësisht rehat në rol", "brauchten mehr als 100 Tage, um sich in der Rolle ganz wohlzufühlen") },
        ] },
        { type: "p", text: x(
          "Creating a shared vision ranked first among the tasks of a transition, yet only 30% found it easy, and 39% of those whose transition succeeded. In hindsight, the executives say they would have moved faster in every area, most often in putting their team in place.",
          "Krijimi i një vizioni të përbashkët renditet i pari ndër detyrat e tranzicionit, por vetëm 30% e gjetën të lehtë, dhe 39% e atyre me tranzicion të suksesshëm. Duke parë pas, drejtuesit thonë se do të kishin lëvizur më shpejt në çdo fushë, më shpesh në ngritjen e ekipit të tyre.",
          "Eine gemeinsame Vision zu schaffen, stand unter den Aufgaben eines Übergangs an erster Stelle, doch nur 30 % fanden es leicht, und 39 % derer mit gelungenem Übergang. Im Rückblick sagen die Befragten, sie wären in jedem Bereich schneller vorgegangen, am häufigsten beim Aufstellen ihres Teams.") },
      ],
      note: x(
        "Self-assessments by executives, with 2014 data; whether a transition succeeded is their own judgment. 622 came from outside, 573 from inside.",
        "Vetëvlerësime të drejtuesve, me të dhëna të vitit 2014; nëse tranzicioni pati sukses e gjykojnë vetë. 622 erdhën nga jashtë, 573 nga brenda.",
        "Selbsteinschätzungen von Topmanagern, Daten von 2014; ob ein Übergang gelang, beurteilen sie selbst. 622 kamen von außen, 573 von innen."),
      source: ["mckinsey-csuite-2015"],
    },
    {
      id: "model", more: "the-operations-manager-i-want-to-be",
      kicker: x("The model", "Modeli", "Das Modell"),
      title: [x("Five situations,", "Pesë situata,", "Fünf Situationen,"), x("not one recipe", "jo një recetë", "kein Rezept")],
      lead: x(
        "Michael Watkins sorts the situations a new leader walks into in his STARS model, named after their English initials. His texts of 2003 had four; his 2009 article in Harvard Business Review and the 2013 edition of his book have five.",
        "Michael Watkins i rendit situatat ku hyn një drejtues i ri në modelin e tij STARS, të quajtur sipas inicialeve të tyre në anglisht. Tekstet e tij të vitit 2003 kishin katër; artikulli i vitit 2009 në Harvard Business Review dhe botimi i vitit 2013 i librit kanë pesë.",
        "Michael Watkins ordnet die Situationen, in die eine neue Führungskraft kommt, in seinem STARS-Modell, benannt nach den englischen Anfangsbuchstaben. Seine Texte von 2003 kannten vier; sein Artikel in der Harvard Business Review von 2009 und die Neuauflage seines Buchs von 2013 haben fünf."),
      blocks: [
        { type: "rows", compact: true, items: [
          { h: x("Start-up", "Nisja", "Start-up"), p: x("Assemble the people, money and technology to launch a new business or initiative.", "Mblidh njerëzit, financimin dhe teknologjinë për të nisur një biznes ose një nismë të re.", "Menschen, Geld und Technik zusammenbringen, um ein neues Geschäft oder Vorhaben zu starten.") },
          { h: x("Turnaround", "Shpëtimi", "Turnaround"), p: x("Rescue a business or initiative known to be in serious trouble.", "Shpëto një biznes ose një nismë që dihet se është në telashe serioze.", "Ein Geschäft oder Vorhaben retten, das bekanntermaßen in ernsten Schwierigkeiten steckt.") },
          { h: x("Accelerated growth", "Rritja e shpejtë", "Schnelles Wachstum"), p: x("Lead a business that is expanding fast.", "Drejto një biznes që zgjerohet shpejt.", "Ein Geschäft führen, das schnell wächst.") },
          { h: x("Realignment", "Rirreshtimi", "Neuausrichtung"), p: x("Revitalise a once-successful organisation that now has problems.", "Ringjall një organizatë dikur të suksesshme që tani ka probleme.", "Eine einst erfolgreiche Organisation neu beleben, die nun Probleme hat.") },
          { h: x("Sustaining success", "Ruajtja e suksesit", "Erfolg bewahren"), p: x("Follow a highly regarded leader and take the business to the next level.", "Pasoje një drejtues shumë të çmuar dhe çoje biznesin në nivelin tjetër.", "Auf eine hoch angesehene Führungskraft folgen und das Geschäft weiterbringen.") },
        ] },
        { type: "p", text: x(
          "Some principles hold everywhere: organise to learn the business, set the few priorities that matter most, and secure early wins. How to apply them depends on the situation, and a leader who repeats what worked last time may be making a mistake.",
          "Disa parime vlejnë kudo: organizo mënyrën si e mëson biznesin, cakto ato pak përparësi që kanë më shumë rëndësi, dhe siguro fitore të hershme. Si zbatohen varet nga situata, dhe drejtuesi që përsërit atë që i funksionoi herën e kaluar ndoshta po gabon.",
          "Einige Grundsätze gelten überall: das Lernen über das Geschäft organisieren, die wenigen Prioritäten setzen, die am meisten zählen, und frühe Erfolge sichern. Wie Sie sie anwenden, hängt von der Situation ab, und wer wiederholt, was beim letzten Mal funktioniert hat, macht womöglich einen Fehler.") },
        { type: "callout", reading: true, text: x(
          "Name the situation before writing the plan for the first 90 days. A turnaround and a role that must sustain success call for very different first moves.",
          "Emërto situatën para se të shkruash planin për 90 ditët e para. Një shpëtim dhe një rol që duhet ta ruajë suksesin kërkojnë hapa të parë shumë të ndryshëm.",
          "Benennen Sie erst die Situation, dann schreiben Sie den Plan für die ersten 90 Tage. Ein Turnaround und eine Rolle, die Erfolg bewahren soll, verlangen ganz andere erste Schritte.") },
      ],
      note: x(
        "The descriptions follow the 2009 article; their wording varies a little between summaries of the book.",
        "Përshkrimet ndjekin artikullin e vitit 2009; formulimi ndryshon pak nga një përmbledhje e librit te tjetra.",
        "Die Beschreibungen folgen dem Artikel von 2009; ihr Wortlaut schwankt leicht zwischen Zusammenfassungen des Buchs."),
      source: ["watkins-2003", "watkins-2009", "watkins-2013"],
    },
    {
      id: "research",
      kicker: x("What the research says", "Çfarë thotë kërkimi", "Was die Forschung sagt"),
      title: [x("Five stages of", "Pesë fazat e", "Fünf Phasen"), x("taking charge", "marrjes së drejtimit", "der Übernahme")],
      lead: x(
        "John Gabarro followed 14 successions: a three-year study of four newly appointed division presidents, and ten historical cases that included turnarounds, normal situations, failures and successes. Management style and working relationships made a difference.",
        "John Gabarro ndoqi 14 ndërrime drejtuesish: një studim trevjeçar me katër presidentë divizionesh të sapoemëruar, dhe dhjetë raste historike me shpëtime, situata normale, dështime dhe suksese. Stili i menaxhimit dhe marrëdhëniet e punës bënin dallimin.",
        "John Gabarro untersuchte 14 Führungswechsel: eine dreijährige Studie mit vier neu ernannten Divisionsleitern und zehn historische Fälle, darunter Sanierungen, Normalfälle, Misserfolge und Erfolge. Führungsstil und Arbeitsbeziehungen machten einen Unterschied."),
      blocks: [
        { type: "chain", label: x("The stages of taking charge, after Gabarro", "Fazat e marrjes së drejtimit, sipas Gabarro-s", "Die Phasen der Übernahme nach Gabarro"), items: [
          { h: x("Taking hold", "Zënia e terrenit", "Fuß fassen") },
          { h: x("Immersion", "Zhytja", "Eintauchen") },
          { h: x("Reshaping", "Riformësimi", "Umgestalten") },
          { h: x("Consolidation", "Konsolidimi", "Festigen") },
          { h: x("Refinement", "Përsosja", "Verfeinern") },
        ] },
        { type: "p", text: x(
          "Matthew Bidwell studied personnel data from 2003 to 2009 from the US investment-banking division of a large financial firm. External hires were paid around 18% more than staff promoted into similar jobs, got significantly lower performance ratings in their first two years, and left more often. Those who stayed were promoted faster.",
          "Matthew Bidwell studioi të dhëna personeli të viteve 2003–2009 nga divizioni amerikan i investimeve bankare të një firme të madhe financiare. Të punësuarit nga jashtë paguheshin rreth 18% më shumë se ata që u ngritën në detyrë në punë të ngjashme, morën vlerësime dukshëm më të ulëta në dy vitet e para, dhe largoheshin më shpesh. Ata që qëndruan u ngritën në detyrë më shpejt.",
          "Matthew Bidwell untersuchte Personaldaten von 2003 bis 2009 aus dem US-Investmentbanking einer großen Finanzfirma. Extern Eingestellte verdienten rund 18 % mehr als intern auf ähnliche Stellen Beförderte, wurden in den ersten zwei Jahren deutlich schlechter bewertet und gingen häufiger. Wer blieb, wurde schneller befördert.") },
        { type: "callout", reading: true, text: x(
          "A leader from outside starts without the context that insiders have. Building it is part of the work of the first months and deserves its own place in the plan.",
          "Drejtuesi që vjen nga jashtë nis pa kontekstin që kanë ata nga brenda. Ndërtimi i tij është pjesë e punës së muajve të parë dhe meriton vendin e vet në plan.",
          "Wer von außen kommt, beginnt ohne den Kontext, den Interne haben. Ihn aufzubauen gehört zur Arbeit der ersten Monate und verdient einen eigenen Platz im Plan.") },
      ],
      note: x(
        "Bidwell's data come from one firm and cover all levels, leaders among them; they show associations and fall short of full proof of cause. In Gabarro's US cases, taking charge took two to two and a half years.",
        "Të dhënat e Bidwell-it vijnë nga një firmë e vetme dhe përfshijnë të gjitha nivelet, drejtuesit bashkë me të tjerët; tregojnë lidhje, por nuk e provojnë plotësisht shkakun. Në rastet amerikane të Gabarro-s, marrja e drejtimit zgjati 2–2,5 vjet.",
        "Bidwells Daten stammen aus einer einzigen Firma und umfassen alle Ebenen, Führungskräfte eingeschlossen; sie zeigen Zusammenhänge, beweisen eine Ursache aber nicht vollständig. In Gabarros US-Fällen dauerte die Übernahme zwei bis zweieinhalb Jahre."),
      source: ["gabarro-1985", "bidwell-2011"],
    },
    {
      id: "measure",
      kicker: x("How it is measured", "Si matet", "Wie es gemessen wird"),
      title: [x("How failure", "Si numërohet", "Wie Scheitern"), x("is counted", "dështimi", "gezählt wird")],
      lead: x(
        "There is no single measure of a failed transition. Studies quoted by McKinsey in 2018 find that two years after executive transitions, 27% to 46% are regarded as failures or disappointments. That is a judgment, and no single measured rate.",
        "Nuk ka një masë të vetme për një tranzicion të dështuar. Studimet që citon McKinsey në vitin 2018 gjejnë se dy vjet pas tranzicioneve të drejtuesve, 27% deri në 46% e tyre shihen si dështime ose zhgënjime. Ky është gjykim, dhe jo një normë e vetme e matur.",
        "Für einen gescheiterten Übergang gibt es kein einheitliches Maß. Studien, die McKinsey 2018 zitiert, kommen zu dem Ergebnis, dass zwei Jahre nach Führungswechseln 27 % bis 46 % als Misserfolg oder Enttäuschung gelten. Das ist ein Urteil, keine einzelne gemessene Quote."),
      blocks: [
        { type: "figures", compact: true, items: [
          { n: pc(90), t: x("more likely that the team meets its three-year goals, when the transition succeeds", "më shumë gjasa që ekipi t'i arrijë objektivat trevjeçare, kur tranzicioni del me sukses", "höhere Chance, dass das Team seine Dreijahresziele erreicht, wenn der Übergang gelingt") },
          { n: pc(15), t: x("lower performance of the direct reports, when the new leader struggles", "rendiment më i ulët i vartësve të drejtpërdrejtë, kur drejtuesi i ri ngec", "geringere Leistung der direkt Unterstellten, wenn die neue Führungskraft strauchelt") },
          { n: pc(20), t: x("more likely that those direct reports disengage or leave", "më shumë gjasa që këta vartës të shkëputen ose të largohen", "höhere Wahrscheinlichkeit, dass diese sich innerlich lösen oder gehen") },
        ] },
        { type: "p", text: x(
          "The figure quoted most often, that 40% of new executives fail within 18 months, goes back at least to Fortune in 1998, which credited the Center for Creative Leadership and the firm Manchester. How the 40% was derived is not shown, so we do not report it as data. Manchester had asked 826 HR specialists why new managers fail.",
          "Shifra që citohet më shpesh, se 40% e drejtuesve të rinj dështojnë brenda 18 muajve, të çon të paktën te Fortune në vitin 1998, që ua atribuonte Center for Creative Leadership dhe firmës Manchester. Si u nxor 40%-shi nuk tregohet, ndaj nuk e japim si të dhënë. Manchester-i kishte pyetur 826 specialistë të burimeve njerëzore pse dështojnë menaxherët e rinj.",
          "Die meistzitierte Zahl, 40 % der neuen Führungskräfte scheiterten binnen 18 Monaten, geht mindestens auf Fortune 1998 zurück, das sie dem Center for Creative Leadership und der Firma Manchester zuschrieb. Wie die 40 % zustande kamen, wird nicht offengelegt; wir führen sie daher nicht als Messwert. Manchester hatte 826 Personalfachleute gefragt, warum neue Führungskräfte scheitern.") },
        { type: "box", title: x("The reasons they gave", "Arsyet që dhanë", "Die genannten Gründe"), items: [
          x("no good relationships with peers and staff", "nuk ndërtojnë marrëdhënie të mira me kolegët dhe vartësit", "keine guten Beziehungen zu Kollegen und Mitarbeitenden"),
          x("unclear about what the boss expects", "nuk e kanë të qartë çfarë pret shefi", "unklar, was die vorgesetzte Person erwartet"),
          x("too little political skill inside the organisation", "pak aftësi politike brenda organizatës", "zu wenig politisches Geschick in der Organisation"),
          x("the most important objectives of the role missed", "nuk arrijnë objektivat më të rëndësishme të rolit", "die wichtigsten Ziele der Rolle verfehlt"),
        ] },
      ],
      note: x(
        "McKinsey cites the 90%, 15% and 20% from a CEB blog of 2013; method and sample are not given. The 27% and the 46% come from two different studies.",
        "McKinsey i citon 90%, 15% dhe 20% nga një blog i CEB-së i vitit 2013; metoda dhe mostra nuk jepen. 27% dhe 46% vijnë nga dy studime të ndryshme.",
        "McKinsey zitiert die 90 %, 15 % und 20 % nach einem CEB-Blog von 2013; Methode und Stichprobe werden nicht genannt. Die 27 % und die 46 % stammen aus zwei verschiedenen Studien."),
      source: ["mckinsey-transitions-2018", "fisher-1998"],
    },
    {
      id: "tool",
      kicker: x("Tool of the issue", "Mjeti i numrit", "Werkzeug der Ausgabe"),
      title: [x("The 90-day", "Karta e", "Die 90-Tage-"), x("card", "90 ditëve", "Karte")],
      lead: x(
        "Fill it in during the first two weeks and look at it again on days 30, 60 and 90. Each line answers one of the reasons new managers fail.",
        "Plotësoje në dy javët e para dhe rishikoje në ditën 30, 60 dhe 90. Çdo rresht i përgjigjet njërës prej arsyeve pse dështojnë menaxherët e rinj.",
        "Füllen Sie die Karte in den ersten zwei Wochen aus und sehen Sie sie an Tag 30, 60 und 90 wieder an. Jede Zeile greift einen der Gründe auf, an denen neue Führungskräfte scheitern."),
      blocks: [
        { type: "form", items: [
          { h: x("The situation", "Situata", "Die Situation"), hint: x("start-up, turnaround, accelerated growth, realignment or sustaining success, and why", "nisje, shpëtim, rritje e shpejtë, rirreshtim apo ruajtje e suksesit, dhe pse", "Start-up, Turnaround, schnelles Wachstum, Neuausrichtung oder Erfolg bewahren, und warum") },
          { h: x("What my boss expects", "Çfarë pret shefi", "Was meine Führungskraft erwartet"), hint: x("in their words, by when, and how we will both know", "me fjalët e shefit, deri kur, dhe si do ta kuptojmë të dy", "in ihren Worten, bis wann und woran wir es beide erkennen") },
          { h: x("Priorities", "Përparësitë", "Prioritäten"), hint: x("the few that matter most, and what will not continue", "ato pak që kanë më shumë rëndësi, dhe çfarë nuk do të vazhdojë", "die wenigen, die am meisten zählen, und was nicht weitergeführt wird") },
          { h: x("An early win", "Një fitore e hershme", "Ein früher Erfolg"), hint: x("a result others can see, by day 90", "një rezultat që e shohin të tjerët, deri në ditën 90", "ein Ergebnis, das andere sehen, bis Tag 90") },
          { h: x("People to meet", "Njerëzit për t'u takuar", "Menschen zum Kennenlernen"), hint: x("peers and team members, one to one, and when", "kolegët dhe anëtarët e ekipit, një me një, dhe kur", "Kollegen und Teammitglieder, unter vier Augen, und wann") },
          { h: x("The culture", "Kultura", "Die Kultur"), hint: x("what surprised me, and whom I can ask", "çfarë më befasoi, dhe kë mund të pyes", "was mich überrascht hat und wen ich fragen kann") },
        ] },
      ],
      note: x(
        "A plan of our own, after Watkins (2009), McKinsey (2015) and the reasons reported by Fortune (1998).",
        "Plan i yni, sipas Watkins-it (2009), McKinsey-t (2015) dhe arsyeve që raportoi Fortune (1998).",
        "Ein Plan der Redaktion, angelehnt an Watkins (2009), McKinsey (2015) und die Gründe, über die Fortune (1998) berichtete."),
      source: ["watkins-2009", "mckinsey-csuite-2015", "fisher-1998"],
    },
    { id: "sources", type: "sources" },
    { id: "back", type: "back" },
  ],
};
