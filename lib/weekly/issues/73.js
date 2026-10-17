// Management Review, No. 73: Cost per unit: time-driven activity-based costing. Block: KPIs.
// Facts and their sources: docs/revista/management-review-nr-73.md. The customer service department on pages 4, 5 and 7
// is the worked example in Kaplan & Anderson (2004), an illustration and not a measured company; the shares of the
// 700,000 minutes are the editors' arithmetic on its figures.
import { x, pc } from "../common.js";

// A dollar amount: "$6.40", "6,40 $", "6,40 $".
const usd = (s) => x(`$${s}`, `${s.replace(".", ",")} $`, `${s.replace(".", ",")} $`);
// A share with one decimal: "17.9%", "17,9%", "17,9 %".
const pcd = (s) => x(`${s}%`, `${s.replace(".", ",")}%`, `${s.replace(".", ",")} %`);

export default {
  number: 73,
  block: "kpi",
  date: x("November 2026", "Nëntor 2026", "November 2026"),
  theme: [x("Cost per unit:", "Kostoja për njësi:", "Kosten pro Einheit:"), x("time-driven ABC", "Time-Driven ABC", "Time-Driven ABC")],
  sub: x(
    "Why time surveys always add up to 100%, one department costed twice, two numbers per resource, what studies of activity-based costing found, the minutes no one used, and a card for one activity.",
    "Pse anketat e kohës dalin gjithmonë 100%, një departament i kostuar dy herë, dy numra për çdo burim, çfarë gjetën studimet për kostimin sipas aktiviteteve, minutat që s'i përdori askush, dhe një kartë për një aktivitet.",
    "Warum Zeitumfragen immer 100 % ergeben, eine Abteilung zweimal kalkuliert, zwei Zahlen je Ressource, was Studien zur Prozesskostenrechnung fanden, die ungenutzten Minuten und eine Karte für eine Tätigkeit."),
  seo: x(
    "Time-driven ABC: why time surveys hide idle capacity, Kaplan and Anderson's worked example, practical capacity, time equations, the research and a card.",
    "Time-Driven ABC: pse anketat e kohës fshehin kapacitetin e papërdorur, shembulli i Kaplan-it dhe Anderson-it, kapaciteti praktik, kërkimet dhe një kartë.",
    "Time-Driven ABC: warum Zeitumfragen Leerlauf verbergen, das Beispiel von Kaplan und Anderson, praktische Kapazität, Zeitgleichungen, Forschung, eine Karte."),
  feature: x(
    "Activity-based costing traced overhead to the work that uses it, and many firms then abandoned it because of its surveys. Issue 73 follows Kaplan and Anderson's customer service department, costed once from a survey and once from minutes, and sets out the two numbers time-driven ABC needs for each resource, along with the time equation. Studies in plants, large companies and hospitals come next, then the capacity that was paid for and not used. A card works out the cost per minute of one activity.",
    "Kostimi sipas aktiviteteve i çonte kostot e përgjithshme te puna që i përdor, por shumë firma më pas e braktisën për shkak të anketave. Numri 73 ndjek departamentin e shërbimit të klientit te Kaplan-i dhe Anderson-i, të kostuar një herë nga një anketë dhe një herë nga minutat, dhe shtjellon dy numrat që i duhen Time-Driven ABC për çdo burim, bashkë me ekuacionin e kohës. Pastaj vijnë studimet në fabrika, në kompani të mëdha dhe në spitale, dhe kapaciteti i paguar që nuk u përdor. Një kartë llogarit koston për minutë të një aktiviteti.",
    "Die Prozesskostenrechnung ordnete Gemeinkosten der Arbeit zu, die sie verursacht, doch viele Firmen gaben sie wegen ihrer Umfragen wieder auf. Ausgabe 73 folgt der Kundendienstabteilung von Kaplan und Anderson, einmal aus einer Umfrage und einmal aus Minuten kalkuliert, und erklärt die zwei Zahlen, die Time-Driven ABC je Ressource braucht, samt Zeitgleichung. Danach geht es um Studien in Werken, Großunternehmen und Kliniken und um bezahlte, aber ungenutzte Kapazität. Eine Karte ermittelt die Kosten pro Minute einer Tätigkeit."),
  figure: { n: pc(83), by: "Kaplan & Anderson, 2004", t: x(
    "of the practical capacity of a customer service department was used for productive work in a quarter, in the example that introduced time-driven ABC.",
    "e kapacitetit praktik të një departamenti të shërbimit të klientit u përdor për punë produktive në një tremujor, te shembulli që prezantoi Time-Driven ABC.",
    "der praktischen Kapazität einer Kundendienstabteilung wurden in einem Quartal produktiv genutzt, im Beispiel, mit dem Time-Driven ABC vorgestellt wurde.") },
  teasers: [
    { page: "story", kicker: x("Cover story", "Tema kryesore", "Titelthema"),
      title: x("Two questions instead of a survey", "Dy pyetje në vend të një ankete", "Zwei Fragen statt einer Umfrage") },
    { page: "numbers", kicker: x("The numbers", "Shifrat", "Die Zahlen"),
      title: x("One department, two prices", "Një departament, dy çmime", "Eine Abteilung, zwei Preise") },
    { page: "tool", kicker: x("Tool of the issue", "Mjeti i numrit", "Werkzeug der Ausgabe"),
      title: x("The cost per minute card", "Karta e kostos për minutë", "Die Karte für die Kosten pro Minute") },
  ],
  sources: ["tdabc-cooper-kaplan-1988", "tdabc-kaplan-anderson-2004", "tdabc-kaplan-anderson-2003", "tdabc-kaplan-porter-2011", "tdabc-ittner-2002", "tdabc-keel-2017"],
  pages: [
    { id: "cover", type: "cover" },
    {
      id: "intro", type: "intro",
      why: x(
        "Every price, every quote and every decision to keep a customer rests on a cost per unit. In most operations a large part of that cost is people's time and the capacity around them. How do you put a fair price on a minute, and what should happen to the minutes no one used?",
        "Çdo çmim, çdo ofertë dhe çdo vendim për të mbajtur një klient mbështetet në një kosto për njësi. Në shumicën e operacioneve, një pjesë e madhe e asaj kostoje është koha e njerëzve dhe kapaciteti rreth tyre. Si i vë një çmim të drejtë një minute, dhe çfarë bën me minutat që s'i përdori askush?",
        "Jeder Preis, jedes Angebot und jede Entscheidung, einen Kunden zu halten, beruht auf Kosten pro Einheit. In den meisten Betrieben besteht ein großer Teil davon aus der Zeit von Menschen und der Kapazität um sie herum. Wie geben Sie einer Minute einen fairen Preis, und was soll mit den Minuten geschehen, die niemand genutzt hat?"),
      body: x(
        "Activity-based costing traced overhead to the work that uses it, but its interviews and surveys were costly, and many firms gave it up. Kaplan and Anderson replaced the survey with two numbers per resource: the cost of a minute of practical capacity and the minutes each job takes. In their example a department used 83% of its capacity. Studies link ABC with better quality and cycle times, not with profit on average.",
        "Kostimi sipas aktiviteteve i çonte kostot e përgjithshme te puna që i përdor, por intervistat dhe anketat e tij kushtonin shumë, dhe shumë firma hoqën dorë. Kaplan-i dhe Anderson-i e zëvendësuan anketën me dy numra për çdo burim: koston e një minute të kapacitetit praktik dhe minutat që merr çdo punë. Te shembulli i tyre, një departament përdori 83% të kapacitetit. Studimet e lidhin ABC-në me cilësi më të mirë dhe cikle më të shkurtra, jo me fitimin, mesatarisht.",
        "Die Prozesskostenrechnung ordnete Gemeinkosten der Arbeit zu, die sie verursacht, doch ihre Interviews und Umfragen waren teuer, und viele Firmen gaben sie auf. Kaplan und Anderson ersetzten die Umfrage durch zwei Zahlen je Ressource: die Kosten einer Minute praktischer Kapazität und die Minuten, die jede Arbeit braucht. In ihrem Beispiel nutzte eine Abteilung 83 % ihrer Kapazität. Studien verbinden ABC mit besserer Qualität und kürzeren Zyklen, im Schnitt nicht mit dem Gewinn."),
    },
    {
      id: "story",
      kicker: x("Cover story", "Tema kryesore", "Titelthema"),
      title: [x("Two questions", "Dy pyetje", "Zwei Fragen"), x("instead of a survey", "në vend të një ankete", "statt einer Umfrage")],
      lead: x(
        "In 1988 Robin Cooper and Robert Kaplan argued that traditional cost systems distort product costs: they weight direct labour and materials more heavily than the support work in the factory. Activity-based costing (ABC) traced overhead to activities, then to products.",
        "Më 1988, Robin Cooper dhe Robert Kaplan shkruan se sistemet tradicionale të kostos i shtrembërojnë kostot e produkteve: u japin punës direkte dhe materialeve më shumë peshë se punës mbështetëse në fabrikë. Kostimi sipas aktiviteteve (ABC) i çonte kostot e përgjithshme te aktivitetet, pastaj te produktet.",
        "1988 schrieben Robin Cooper und Robert Kaplan, herkömmliche Kostensysteme verzerrten die Produktkosten: Sie gewichten Fertigungslohn und Material stärker als die unterstützende Arbeit im Werk. Die Prozesskostenrechnung (ABC) ordnete Gemeinkosten Tätigkeiten zu, dann Produkten."),
      blocks: [
        { type: "p", text: x(
          "To learn how time was split between activities, ABC teams interviewed and surveyed staff. In 2004 Kaplan and Steven Anderson wrote that many managers who had tried it on any significant scale had abandoned it, in the face of rising costs and employee irritation.",
          "Për të mësuar si ndahej koha mes aktiviteteve, ekipet e ABC-së intervistonin dhe anketonin stafin. Më 2004, Kaplan-i dhe Steven Anderson shkruan se shumë menaxherë që e kishin provuar në shkallë të gjerë e kishin braktisur, përballë kostove në rritje dhe acarimit të punonjësve.",
          "Wie sich die Zeit auf Tätigkeiten verteilt, erfragten ABC-Teams bei den Beschäftigten. 2004 schrieben Kaplan und Steven Anderson, viele Manager, die ABC in größerem Maßstab versucht hatten, hätten aufgegeben, angesichts steigender Kosten und genervter Mitarbeiter.") },
        { type: "cards", cols: 3, items: [
          { h: x("Costly", "E kushtueshme", "Teuer"), p: x("interviews and surveys in every department, again after every change", "intervista dhe anketa në çdo departament, sërish pas çdo ndryshimi", "Interviews und Umfragen in jeder Abteilung, nach jeder Änderung erneut") },
          { h: x("Subjective", "Subjektive", "Subjektiv"), p: x("people's own estimates of their time, costly to check", "vlerësimet e vetë njerëzve për kohën e tyre, të kushtueshme për t'u kontrolluar", "eigene Schätzungen der Leute zu ihrer Zeit, teuer zu prüfen") },
          { h: x("Always 100%", "Gjithmonë 100%", "Immer 100 %"), p: x("the shares add up to a full day, so idle time vanishes into the rates", "pjesët mblidhen në një ditë të plotë, ndaj koha bosh zhduket te tarifat", "die Anteile ergeben einen vollen Tag, so verschwindet Leerlauf in den Sätzen") },
        ] },
        { type: "callout", reading: true, text: x(
          "Ask people how they spend their day and the answer always fills the day. Ask how long one order takes, and you can watch it.",
          "Pyet njerëzit si e kalojnë ditën dhe përgjigjja e mbush gjithmonë ditën. Pyet sa zgjat një porosi, dhe mund ta shikosh vetë.",
          "Fragen Sie Menschen, wie sie ihren Tag verbringen, und die Antwort füllt immer den Tag. Fragen Sie, wie lange ein Auftrag dauert, und Sie können zusehen.") },
      ],
      note: x(
        "The three problems follow Kaplan and Anderson's 2003 working paper and their 2004 article; the grouping is ours.",
        "Tri problemet ndjekin punimin e Kaplan-it dhe Anderson-it (2003) dhe artikullin e tyre të vitit 2004; grupimi është yni.",
        "Die drei Probleme folgen dem Arbeitspapier von Kaplan und Anderson (2003) und ihrem Artikel von 2004; die Einteilung ist unsere."),
      source: ["tdabc-cooper-kaplan-1988", "tdabc-kaplan-anderson-2004", "tdabc-kaplan-anderson-2003"],
    },
    {
      id: "numbers",
      kicker: x("The numbers", "Shifrat", "Die Zahlen"),
      title: [x("One department,", "Një departament,", "Eine Abteilung,"), x("two prices", "dy çmime", "zwei Preise")],
      lead: x(
        "Kaplan and Anderson's example is a customer service department that costs $560,000 a quarter. In a quarter it handles 49,000 orders, 1,400 customer inquiries and 2,500 credit checks. A survey splits the staff's time 70%, 10% and 20%.",
        "Shembulli i Kaplan-it dhe Anderson-it është një departament i shërbimit të klientit që kushton 560.000 $ në tremujor. Në një tremujor trajton 49.000 porosi, 1.400 pyetje klientësh dhe 2.500 kontrolle krediti. Një anketë e ndan kohën e stafit 70%, 10% dhe 20%.",
        "Das Beispiel von Kaplan und Anderson ist eine Kundendienstabteilung, die 560.000 $ im Quartal kostet. In einem Quartal bearbeitet sie 49.000 Aufträge, 1.400 Kundenanfragen und 2.500 Bonitätsprüfungen. Eine Umfrage teilt die Zeit der Beschäftigten in 70 %, 10 % und 20 %."),
      blocks: [
        { type: "pairs", from: x("Survey-based ABC", "ABC me anketë", "ABC mit Umfrage"), to: x("Time-driven ABC", "Time-Driven ABC", "Time-Driven ABC"), max: 50, source: ["tdabc-kaplan-anderson-2004"],
          label: x("Cost per transaction in the example, $ (2004)", "Kostoja për transaksion te shembulli, $ (2004)", "Kosten je Vorgang im Beispiel, $ (2004)"),
          rows: [
            { k: x("Process an order", "Përpunimi i një porosie", "Auftrag bearbeiten"), a: 8, an: usd("8.00"), b: 6.4, bn: usd("6.40") },
            { k: x("Handle an inquiry", "Trajtimi i një pyetjeje", "Anfrage bearbeiten"), a: 40, an: usd("40.00"), b: 35.2, bn: usd("35.20") },
            { k: x("Run a credit check", "Një kontroll krediti", "Bonitätsprüfung"), a: 44.8, an: usd("44.80"), b: 40, bn: usd("40.00"), alert: true },
          ] },
        { type: "p", text: x(
          "The survey spreads all $560,000 over the work done. The time-driven version takes how long each job lasts, 8, 44 and 50 minutes, times $0.80 a minute. All three rates fall: the survey-based ones also carry the cost of time no one used.",
          "Anketa i shpërndan të gjitha 560.000 $ mbi punën e bërë. Versioni Time-Driven merr sa zgjat çdo punë, 8, 44 dhe 50 minuta, herë 0,80 $ për minutë. Të tria tarifat bien: ato nga anketa mbartin edhe koston e kohës që s'e përdori askush.",
          "Die Umfrage verteilt alle 560.000 $ auf die geleistete Arbeit. Die zeitbasierte Version misst, wie lange jede Arbeit dauert, 8, 44 und 50 Minuten, mal 0,80 $ pro Minute. Alle drei Sätze sinken: Die aus der Umfrage tragen auch die Kosten ungenutzter Zeit.") },
        { type: "callout", reading: true, text: x(
          "A rate that includes idle time looks like a fact. It makes every order look more expensive than the work it takes.",
          "Një tarifë që përfshin kohën bosh duket si fakt. E bën çdo porosi të duket më e shtrenjtë se puna që kërkon.",
          "Ein Satz, der Leerlauf enthält, wirkt wie eine Tatsache. Er lässt jeden Auftrag teurer aussehen als die Arbeit, die er braucht.") },
      ],
      note: x(
        "An illustration from the source, not a measured company; later versions use slightly different figures. The time-driven rates are the source's too: minutes × $0.80.",
        "Ilustrim nga burimi, jo një kompani e matur; versionet e mëvonshme përdorin shifra pak të ndryshme. Edhe tarifat Time-Driven janë të burimit: minutat × 0,80 $.",
        "Illustration der Quelle, kein gemessenes Unternehmen; spätere Fassungen haben leicht andere Zahlen. Auch die zeitbasierten Sätze stammen aus der Quelle: Minuten × 0,80 $."),
      source: ["tdabc-kaplan-anderson-2004"],
    },
    {
      id: "model", more: "high-volume-days",
      kicker: x("The model", "Modeli", "Das Modell"),
      title: [x("Two numbers", "Dy numra", "Zwei Zahlen"), x("per resource", "për çdo burim", "je Ressource")],
      lead: x(
        "Time-driven ABC needs two estimates: what a unit of capacity costs, and how many units each job uses. Capacity is practical, not theoretical, often 80% or 85% of it: people need breaks and training, machines maintenance.",
        "Time-Driven ABC kërkon dy vlerësime: sa kushton një njësi kapaciteti, dhe sa njësi përdor çdo punë. Kapaciteti është praktik, jo teorik, shpesh 80% ose 85% e tij: njerëzve u duhen pushime dhe trajnim, makinave mirëmbajtje.",
        "Time-Driven ABC braucht zwei Schätzungen: was eine Einheit Kapazität kostet und wie viele Einheiten jede Arbeit beansprucht. Gerechnet wird mit praktischer, nicht theoretischer Kapazität, oft 80 % oder 85 % davon: Menschen brauchen Pausen und Schulung, Maschinen Wartung."),
      blocks: [
        { type: "chain", label: x("The example, step by step (2004)", "Shembulli, hap pas hapi (2004)", "Das Beispiel, Schritt für Schritt (2004)"), items: [
          { h: x("Cost of capacity", "Kostoja e kapacitetit", "Kosten der Kapazität"), p: x("$560,000 a quarter: staff, supervision, IT, telecoms", "560.000 $ në tremujor: stafi, mbikëqyrja, IT, telefonia", "560.000 $ im Quartal: Personal, Aufsicht, IT, Telefon") },
          { h: x("Practical capacity", "Kapaciteti praktik", "Praktische Kapazität"), p: x("700,000 minutes a quarter, about 80% of the time paid", "700.000 minuta në tremujor, rreth 80% e kohës së paguar", "700.000 Minuten im Quartal, etwa 80 % der bezahlten Zeit") },
          { h: x("Cost per minute", "Kostoja për minutë", "Kosten pro Minute"), p: x("$560,000 ÷ 700,000 = $0.80", "560.000 $ ÷ 700.000 = 0,80 $", "560.000 $ ÷ 700.000 = 0,80 $") },
          { h: x("Minutes per job", "Minutat për punë", "Minuten je Arbeit"), p: x("order 8, inquiry 44, credit check 50", "porosia 8, pyetja 44, kontrolli i kreditit 50", "Auftrag 8, Anfrage 44, Bonitätsprüfung 50") },
        ] },
        { type: "p", text: x(
          "Where jobs differ, a time equation replaces new activities. In the working paper, packing takes 0.5 minutes, plus 6.5 for special handling, plus 0.2 if it goes by air; the data are in the order system.",
          "Kur punët ndryshojnë, një ekuacion i kohës zëvendëson aktivitetet e reja. Te punimi i vitit 2003, paketimi merr 0,5 minuta, plus 6,5 për trajtim të veçantë, plus 0,2 nëse niset me avion; të dhënat janë në sistemin e porosive.",
          "Unterscheiden sich Arbeiten, ersetzt eine Zeitgleichung neue Tätigkeiten. Im Arbeitspapier dauert Verpacken 0,5 Minuten, plus 6,5 bei Sonderbehandlung, plus 0,2 bei Luftfracht; die Daten stehen im Auftragssystem.") },
        { type: "callout", reading: true, text: x(
          "Capacity on paper counts every hour paid. A plan built on it is wrong, and so is the price built on that plan.",
          "Kapaciteti në letër numëron çdo orë të paguar. Plani që ndërtohet mbi të është gabim, dhe po ashtu çmimi që ndërtohet mbi atë plan.",
          "Kapazität auf dem Papier zählt jede bezahlte Stunde. Ein Plan, der darauf aufbaut, ist falsch, und der Preis, der auf diesem Plan beruht, ebenso.") },
      ],
      note: x(
        "The 80–85% is the authors' rule of thumb, not a measurement. The chain follows the 2004 example.",
        "80–85% është rregull praktik i autorëve, jo matje. Zinxhiri ndjek shembullin e vitit 2004.",
        "80–85 % sind eine Faustregel der Autoren, keine Messung. Die Kette folgt dem Beispiel von 2004."),
      source: ["tdabc-kaplan-anderson-2004", "tdabc-kaplan-anderson-2003"],
    },
    {
      id: "research",
      kicker: x("What the research says", "Çfarë thotë kërkimi", "Was die Forschung sagt"),
      title: [x("What better costs", "Çfarë ndryshojnë", "Was bessere"), x("change", "kostot më të sakta", "Kosten ändern")],
      lead: x(
        "In 2011 Kaplan and Michael Porter took time-driven ABC to hospitals: existing systems could not measure the cost of one patient's condition over the whole cycle of care. Their seven steps run from choosing the condition, through time estimates and a cost rate per resource, to the total cost of care.",
        "Më 2011, Kaplan-i dhe Michael Porter e çuan Time-Driven ABC në spitale: sistemet ekzistuese nuk e matnin dot koston e gjendjes së një pacienti përgjatë gjithë ciklit të kujdesit. Shtatë hapat e tyre shkojnë nga zgjedhja e gjendjes, përmes vlerësimeve të kohës dhe tarifës për çdo burim, te kostoja e plotë e kujdesit.",
        "2011 brachten Kaplan und Michael Porter Time-Driven ABC in Kliniken: Die bestehenden Systeme konnten die Kosten der Erkrankung eines Patienten über den ganzen Behandlungszyklus nicht messen. Ihre sieben Schritte reichen von der Wahl der Erkrankung über Zeitschätzungen und einen Kostensatz je Ressource bis zu den Gesamtkosten der Behandlung."),
      blocks: [
        { type: "rows", items: [
          { h: x("Manufacturing plants, 2002", "Fabrika, 2002", "Fertigungswerke, 2002"), p: x(
            "Ittner, Lanen and Larcker: extensive ABC use went with higher quality and faster cycle times, and through them lower costs; on average, not with return on assets.",
            "Ittner, Lanen dhe Larcker: përdorimi i gjerë i ABC-së lidhej me cilësi më të lartë dhe cikle më të shpejta, e përmes tyre me kosto më të ulëta; mesatarisht, jo me kthimin nga aktivet.",
            "Ittner, Lanen und Larcker: Breiter ABC-Einsatz ging mit höherer Qualität und schnelleren Zyklen einher, über sie mit niedrigeren Kosten; im Schnitt nicht mit der Kapitalrendite.") },
          { h: x("Health care, 2017", "Kujdesi shëndetësor, 2017", "Gesundheitswesen, 2017"), p: x(
            "Keel and colleagues: time-driven ABC can cost processes efficiently, but many studies deviated from the seven steps; its role in bundled payments was not yet shown.",
            "Keel dhe kolegët: Time-Driven ABC mund t'i kostojë proceset me efikasitet, por shumë studime u larguan nga shtatë hapat; roli i saj te pagesat e paketuara ende nuk ishte treguar.",
            "Keel und Kollegen: Time-Driven ABC kann Prozesse effizient kalkulieren, doch viele Studien wichen von den sieben Schritten ab; die Rolle bei Pauschalvergütungen war noch nicht belegt.") },
        ] },
        { type: "callout", reading: true, text: x(
          "A more accurate cost helps where someone acts on it: a process redesigned, a price changed. On its own it changes nothing.",
          "Një kosto më e saktë ndihmon aty ku dikush vepron mbi të: një proces i rindërtuar, një çmim i ndryshuar. Më vete, nuk ndryshon asgjë.",
          "Genauere Kosten helfen dort, wo jemand danach handelt: ein umgebauter Prozess, ein geänderter Preis. Allein ändern sie nichts.") },
      ],
      note: x(
        "Ittner et al.: one cross-section of plants, links not causes. Ittner et al. and Keel et al. not read in full.",
        "Ittner et al.: një prerje e fabrikave në një moment, lidhje dhe jo shkaqe. Ittner et al. dhe Keel et al. nuk u lexuan të plotë.",
        "Ittner et al.: ein Querschnitt von Werken, Zusammenhänge, keine Ursachen. Ittner et al. und Keel et al. nicht im Volltext gelesen."),
      source: ["tdabc-kaplan-porter-2011", "tdabc-ittner-2002", "tdabc-keel-2017"],
    },
    {
      id: "measure",
      kicker: x("How it is measured", "Si matet", "Wie es gemessen wird"),
      title: [x("Used", "Të përdorura", "Genutzt"), x("and unused", "dhe të papërdorura", "und ungenutzt")],
      lead: x(
        "The time-driven report shows what the survey hid. In the quarter, the three jobs used 578,600 of the 700,000 minutes of practical capacity: 83%. Only that share of the cost, $462,880, goes to orders and customers.",
        "Raporti Time-Driven tregon atë që fshehu anketa. Në tremujor, tri punët përdorën 578.600 nga 700.000 minutat e kapacitetit praktik: 83%. Vetëm ajo pjesë e kostos, 462.880 $, u ngarkohet porosive dhe klientëve.",
        "Der zeitbasierte Bericht zeigt, was die Umfrage verbarg. Im Quartal nutzten die drei Arbeiten 578.600 der 700.000 Minuten praktischer Kapazität: 83 %. Nur dieser Teil der Kosten, 462.880 $, geht an Aufträge und Kunden."),
      blocks: [
        { type: "hbars", source: ["tdabc-kaplan-anderson-2004"],
          label: x("Where the 700,000 minutes went, one quarter (example)", "Ku shkuan 700.000 minutat, një tremujor (shembull)", "Wohin die 700.000 Minuten gingen, ein Quartal (Beispiel)"),
          items: [
            { k: x("Orders: 49,000 × 8 min", "Porositë: 49.000 × 8 min", "Aufträge: 49.000 × 8 Min."), v: 56, n: pc(56) },
            { k: x("Credit checks: 2,500 × 50 min", "Kontrollet: 2.500 × 50 min", "Prüfungen: 2.500 × 50 Min."), v: 17.9, n: pcd("17.9") },
            { k: x("Inquiries: 1,400 × 44 min", "Pyetjet: 1.400 × 44 min", "Anfragen: 1.400 × 44 Min."), v: 8.8, n: pcd("8.8") },
            { k: x("Unused: 121,400 min", "Të papërdorura: 121.400 min", "Ungenutzt: 121.400 Min."), v: 17.3, n: pcd("17.3"), alert: true },
          ] },
        { type: "p", text: x(
          "The unused minutes, about $97,120 of the quarter's cost, are capacity paid for and not used. Kaplan and Anderson do not spread them over the work done; they report them, so that managers can act on the excess capacity.",
          "Minutat e papërdorura, rreth 97.120 $ nga kostoja e tremujorit, janë kapacitet i paguar dhe i papërdorur. Kaplan-i dhe Anderson-i nuk i shpërndajnë mbi punën e bërë; i raportojnë, që drejtuesit të veprojnë mbi kapacitetin e tepërt.",
          "Die ungenutzten Minuten, rund 97.120 $ der Quartalskosten, sind bezahlte, ungenutzte Kapazität. Kaplan und Anderson verteilen sie nicht auf die Arbeit, sie weisen sie aus, damit die Führung handeln kann.") },
        { type: "callout", reading: true, text: x(
          "Unused capacity is not an error to hide in the rates. It is a decision: cut it, fill it, or keep it on purpose for the peak.",
          "Kapaciteti i papërdorur nuk është gabim për t'u fshehur te tarifat. Është vendim: ta shkurtosh, ta mbushësh, ose ta mbash qëllimisht për kulmin e ngarkesës.",
          "Ungenutzte Kapazität ist kein Fehler, den man in Sätzen versteckt. Sie ist eine Entscheidung: abbauen, füllen oder bewusst für die Spitze halten.") },
      ],
      note: x(
        "Volumes, minutes, 578,600, $462,880 and the $97,120 of unused capacity (121,400 × $0.80) are from the source; the shares of 700,000 are our arithmetic.",
        "Vëllimet, minutat, 578.600, 462.880 $ dhe 97.120 $ e kapacitetit të papërdorur (121.400 × 0,80 $) janë nga burimi; pjesët e 700.000 janë llogaritje jona.",
        "Mengen, Minuten, 578.600, 462.880 $ und die 97.120 $ ungenutzter Kapazität (121.400 × 0,80 $) stammen aus der Quelle; die Anteile an 700.000 sind unsere Rechnung."),
      source: ["tdabc-kaplan-anderson-2004"],
    },
    {
      id: "tool", tool: "/tools/pareto/",
      kicker: x("Tool of the issue", "Mjeti i numrit", "Werkzeug der Ausgabe"),
      title: [x("The cost per", "Karta e kostos", "Die Karte für die"), x("minute card", "për minutë", "Kosten pro Minute")],
      lead: x(
        "One card per activity or team. Start from the cost of one period and the minutes really available, then time the jobs instead of asking for percentages. At the end, rank them by minutes.",
        "Një kartë për çdo aktivitet ose ekip. Nis nga kostoja e një periudhe dhe minutat që janë vërtet në dispozicion, pastaj mat kohën e punëve në vend që të kërkosh përqindje. Në fund, renditi sipas minutave.",
        "Eine Karte pro Tätigkeit oder Team. Beginnen Sie mit den Kosten eines Zeitraums und den tatsächlich verfügbaren Minuten, messen Sie dann die Dauer der Arbeiten, statt Prozente zu erfragen. Zum Schluss ordnen Sie sie nach Minuten."),
      blocks: [
        { type: "form", items: [
          { h: x("Resource and period", "Burimi dhe periudha", "Ressource und Zeitraum"), hint: x("a team or a machine; a month or a quarter", "një ekip ose një makinë; një muaj ose një tremujor", "ein Team oder eine Maschine; ein Monat oder ein Quartal") },
          { h: x("Cost of capacity", "Kostoja e kapacitetit", "Kosten der Kapazität"), hint: x("people, supervision, equipment, space, systems", "njerëzit, mbikëqyrja, pajisjet, hapësira, sistemet", "Personal, Aufsicht, Ausstattung, Fläche, Systeme") },
          { h: x("Practical capacity", "Kapaciteti praktik", "Praktische Kapazität"), hint: x("minutes paid, minus breaks, training, meetings, maintenance", "minutat e paguara, minus pushimet, trajnimet, takimet, mirëmbajtjen", "bezahlte Minuten minus Pausen, Schulung, Besprechungen, Wartung") },
          { h: x("Cost per minute", "Kostoja për minutë", "Kosten pro Minute"), hint: x("line 2 divided by line 3", "rreshti 2 pjesëtuar me rreshtin 3", "Zeile 2 geteilt durch Zeile 3") },
          { h: x("Time equation", "Ekuacioni i kohës", "Zeitgleichung"), hint: x("minutes for the standard job, plus what each variant adds", "minutat për punën standarde, plus sa shton çdo variant", "Minuten für die Standardarbeit, plus was jede Variante dazugibt") },
          { h: x("Used and unused", "Të përdorura dhe të papërdorura", "Genutzt und ungenutzt"), hint: x("volumes × minutes; what is left, and what you will do with it", "vëllimet × minutat; çfarë mbetet, dhe çfarë do të bësh me të", "Mengen × Minuten; was übrig bleibt und was Sie damit tun") },
        ] },
      ],
      note: x(
        "The card is a practice the editors propose, based on Kaplan and Anderson (2004, 2003). The Pareto tool ranks the job types.",
        "Karta është praktikë që propozon redaksia, mbi bazën e Kaplan-it dhe Anderson-it (2004, 2003). Mjeti Pareto i rendit llojet e punëve.",
        "Die Karte ist eine Praxis, die die Redaktion vorschlägt, gestützt auf Kaplan und Anderson (2004, 2003). Das Pareto-Werkzeug ordnet die Arbeitsarten."),
      source: ["tdabc-kaplan-anderson-2004", "tdabc-kaplan-anderson-2003"],
    },
    { id: "sources", type: "sources" },
    { id: "back", type: "back" },
  ],
};
