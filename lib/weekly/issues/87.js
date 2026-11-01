// Management Review, No. 87: Injury rates, how a safety number is made. Block: KPI.
// Facts and their sources: docs/revista/management-review-nr-87.md. The formula and the industry rates are the US
// Bureau of Labor Statistics' (the 2024 survey, released in January 2026); what counts as a case is OSHA's rule,
// 29 CFR 1904.7, read in the 2024 annual edition of the Code of Federal Regulations; the European rates are Eurostat's
// for 2024; the survey of health practitioners is the GAO's of 2009. All read in full.
// Leading and lagging indicators are No. 2, near misses No. 63: not repeated.
import { x, pc } from "../common.js";

// A decimal number: "4.8", "4,8", "4,8".
const dec = (s) => x(s, s.replace(".", ","), s.replace(".", ","));

export default {
  number: 87,
  block: "kpi",
  date: x("November 2026", "Nëntor 2026", "November 2026"),
  theme: [x("Injury rates:", "Norma e lëndimeve:", "Unfallquoten:"), x("how a safety number is made", "si bëhet një shifër sigurie", "wie eine Sicherheitszahl entsteht")],
  sub: x(
    "Why 200,000 hours, what OSHA counts as a case, US rates by industry for 2024, why a small site's rate jumps, what Europe's rates and a survey of health practitioners say the number hides, and a card.",
    "Pse 200.000 orë, çfarë numëron OSHA si rast, normat në SHBA sipas industrisë për 2024, pse kërcen norma e një vendi të vogël, çfarë fsheh shifra sipas Evropës dhe një ankete me mjekë të punës, dhe një kartë.",
    "Warum 200.000 Stunden, was OSHA als Fall zählt, US-Quoten nach Branche für 2024, warum die Quote eines kleinen Standorts springt, was die Zahl laut Europas Statistik und einer Befragung in der Arbeitsmedizin verdeckt, und eine Karte."),
  seo: x(
    "Injury rates: the 200,000-hour formula, what counts as a recordable case, US rates by industry for 2024, small sites, under-reporting and a card.",
    "Norma e lëndimeve: formula me 200.000 orë, çfarë është rast i regjistrueshëm, normat në SHBA për 2024, vendet e vogla, nënraportimi dhe një kartë.",
    "Unfallquoten: die Formel mit 200.000 Stunden, was als meldepflichtiger Fall zählt, US-Quoten 2024, kleine Standorte, Untererfassung und eine Karte."),
  feature: x(
    "A safety rate is a fraction: cases on top, hours below, and a constant that turns it into cases per 100 full-time workers. Issue 87 takes the number apart. It follows the US formula and OSHA's line between first aid and a recordable case, sets the 2024 rates of six industries beside the private-sector average, and shows why one case can double a small site's rate. Eurostat's country figures and a survey of occupational health practitioners show what a low rate can hide. A card for reading a safety number ends the issue.",
    "Një normë sigurie është një thyesë: rastet sipër, orët poshtë, dhe një konstante që e kthen në raste për 100 punonjës me kohë të plotë. Numri 87 e zbërthen këtë shifër. Ndjek formulën amerikane dhe vijën që heq OSHA mes ndihmës së parë dhe rastit të regjistrueshëm, vë normat e vitit 2024 të gjashtë industrive pranë mesatares së sektorit privat, dhe tregon pse një rast i vetëm mund ta dyfishojë normën e një vendi të vogël. Shifrat e Eurostat-it për vendet e BE-së dhe një anketë me mjekë dhe profesionistë të shëndetit në punë tregojnë çfarë mund të fshehë një normë e ulët. Numri mbyllet me një kartë për të lexuar një shifër sigurie.",
    "Eine Sicherheitsquote ist ein Bruch: oben die Fälle, unten die Stunden, dazu eine Konstante, die daraus Fälle je 100 Vollzeitbeschäftigte macht. Ausgabe 87 nimmt die Zahl auseinander. Sie folgt der US-Formel und OSHAs Grenze zwischen Erster Hilfe und meldepflichtigem Fall, stellt die Quoten von sechs Branchen für 2024 neben den Schnitt der Privatwirtschaft und zeigt, warum ein einziger Fall die Quote eines kleinen Standorts verdoppeln kann. Eurostats Länderzahlen und eine Befragung von Fachleuten der Arbeitsmedizin zeigen, was eine niedrige Quote verdecken kann. Eine Karte zum Lesen einer Sicherheitszahl beschließt die Ausgabe."),
  figure: { n: dec("4.8"), by: "BLS, 2026", t: x(
    "recordable injuries and illnesses per 100 full-time workers in US warehousing and storage in 2024, about twice the 2.3 of all private industry.",
    "lëndime dhe sëmundje të regjistrueshme për 100 punonjës me kohë të plotë në magazinimin në SHBA më 2024, rreth dyfishi i 2,3 të gjithë sektorit privat.",
    "meldepflichtige Verletzungen und Erkrankungen je 100 Vollzeitbeschäftigte in der US-Lagerei 2024, rund doppelt so viele wie die 2,3 der gesamten Privatwirtschaft.") },
  teasers: [
    { page: "story", kicker: x("Cover story", "Tema kryesore", "Titelthema"),
      title: x("Cases, hours and 200,000", "Raste, orë dhe 200.000", "Fälle, Stunden und 200.000") },
    { page: "research", kicker: x("What the research says", "Çfarë thotë kërkimi", "Was die Forschung sagt"),
      title: x("What a low rate can hide", "Çfarë mund të fshehë një normë e ulët", "Was eine niedrige Quote verdecken kann") },
    { page: "tool", kicker: x("Tool of the issue", "Mjeti i numrit", "Werkzeug der Ausgabe"),
      title: x("The safety rate card", "Karta e normës së sigurisë", "Die Karte zur Sicherheitsquote") },
  ],
  sources: ["injury-bls-rate-2025", "injury-bls-soii-2026", "injury-cfr-1904-2024", "injury-ilo-1998", "injury-eurostat-2026", "injury-gao-2009"],
  pages: [
    { id: "cover", type: "cover" },
    {
      id: "intro", type: "intro",
      why: x(
        "Almost every site reports a safety rate, and the rate often decides whether a month counts as good. Few people who read it know how it is made: what counts as a case, which hours go below the line, and why the same site can show three different numbers.",
        "Pothuajse çdo vend pune raporton një normë sigurie, dhe shpesh ajo vendos nëse një muaj quhet i mirë. Pak nga ata që e lexojnë e dinë si bëhet: çfarë numërohet si rast, cilat orë shkojnë poshtë vijës, dhe pse i njëjti vend mund të tregojë tri shifra të ndryshme.",
        "Fast jeder Standort meldet eine Sicherheitsquote, und oft entscheidet sie, ob ein Monat als gut gilt. Wenige, die sie lesen, wissen, wie sie entsteht: was als Fall zählt, welche Stunden unter den Strich kommen und warum derselbe Standort drei verschiedene Zahlen zeigen kann."),
      body: x(
        "In the US the rate is cases times 200,000, divided by hours worked: cases per 100 full-time workers. OSHA's rule decides what is a case, and the line runs through the treatment. In 2024 the rate was 2.3 for all private industry and 8.0 for couriers. The ILO's frequency rate counts per million hours, Eurostat per 100,000 people employed, and Eurostat warns that very low national rates may reflect under-reporting. On a small site a single case can double the rate. A card helps read the number with its base.",
        "Në SHBA norma është rastet herë 200.000, pjesëtuar me orët e punuara: raste për 100 punonjës me kohë të plotë. Rregulli i OSHA-s vendos çfarë është rast, dhe vija kalon nëpër trajtimin mjekësor. Më 2024 norma ishte 2,3 për gjithë sektorin privat dhe 8,0 për korrierët. Norma e shpeshtësisë e ILO-s numëron për një milion orë, Eurostat për 100.000 të punësuar, dhe Eurostat paralajmëron se normat shumë të ulëta të disa vendeve mund të vijnë nga nënraportimi. Në një vend të vogël, një rast i vetëm mund ta dyfishojë normën. Një kartë ndihmon ta lexosh shifrën bashkë me bazën e saj.",
        "In den USA ist die Quote Fälle mal 200.000, geteilt durch die geleisteten Stunden: Fälle je 100 Vollzeitbeschäftigte. OSHAs Regel bestimmt, was ein Fall ist, und die Grenze verläuft über die Behandlung. 2024 lag die Quote für die gesamte Privatwirtschaft bei 2,3, bei Kurierdiensten bei 8,0. Die Häufigkeitsrate der ILO rechnet je Million Stunden, Eurostat je 100.000 Erwerbstätige, und Eurostat warnt, dass sehr niedrige Länderquoten Untererfassung spiegeln können. An einem kleinen Standort kann ein einziger Fall die Quote verdoppeln. Eine Karte hilft, die Zahl mit ihrer Basis zu lesen."),
    },
    {
      id: "story",
      kicker: x("Cover story", "Tema kryesore", "Titelthema"),
      title: [x("Cases, hours", "Raste, orë", "Fälle, Stunden"), x("and 200,000", "dhe 200.000", "und 200.000")],
      lead: x(
        "The US Bureau of Labor Statistics gives the formula in one line: recordable injuries and illnesses, times 200,000, divided by the hours all employees worked. The 200,000 is 100 employees working 40 hours a week for 50 weeks, so the rate reads as cases per 100 full-time workers in a year.",
        "Byroja e Statistikave të Punës në SHBA (BLS) e jep formulën në një rresht: lëndimet dhe sëmundjet e regjistrueshme, herë 200.000, pjesëtuar me orët që punuan të gjithë punonjësit. 200.000 janë 100 punonjës që punojnë 40 orë në javë për 50 javë, prandaj norma lexohet si raste për 100 punonjës me kohë të plotë në një vit.",
        "Das US Bureau of Labor Statistics (BLS) gibt die Formel in einer Zeile: meldepflichtige Verletzungen und Erkrankungen mal 200.000, geteilt durch die Stunden aller Beschäftigten. 200.000 sind 100 Beschäftigte mit 40 Stunden pro Woche an 50 Wochen; die Quote liest sich also als Fälle je 100 Vollzeitbeschäftigte im Jahr."),
      blocks: [
        { type: "example", label: x("The BLS worked example, a fictitious manufacturer", "Shembulli i llogaritur i BLS-së, një prodhues fiktiv", "Das Rechenbeispiel des BLS, ein fiktiver Hersteller"), rows: [
          { k: x("Employees", "Punonjësit", "Beschäftigte"), v: x("200, who worked 400,000 hours in the year", "200, që punuan 400.000 orë gjatë vitit", "200, die im Jahr 400.000 Stunden arbeiteten") },
          { k: x("All recordable cases", "Të gjitha rastet", "Alle Fälle"), v: x("7: 7 × 200,000 ÷ 400,000 = 3.5", "7: 7 × 200.000 ÷ 400.000 = 3,5", "7: 7 × 200.000 ÷ 400.000 = 3,5") },
          { k: x("Days away, restriction or transfer", "Ditë larg, punë e kufizuar ose transferim", "Ausfalltage, Einschränkung oder Versetzung"), v: x("3 of them: 3 × 200,000 ÷ 400,000 = 1.5", "3 prej tyre: 3 × 200.000 ÷ 400.000 = 1,5", "3 davon: 3 × 200.000 ÷ 400.000 = 1,5") },
        ], text: x("The company is the BLS's own invention, to show the method.", "Kompaninë e ka sajuar vetë BLS-ja, për të treguar metodën.", "Das Unternehmen hat das BLS selbst erfunden, um die Methode zu zeigen.") },
        { type: "p", text: x(
          "Hours worked means hours actually worked: paid vacation, sick leave and holidays are left out. Where the hours are not recorded, the BLS allows an estimate from scheduled hours or from 8 hours per working day.",
          "Orët e punuara janë orët e punuara vërtet: pushimet e paguara, lejet mjekësore dhe festat lihen jashtë. Kur orët nuk regjistrohen, BLS-ja lejon një vlerësim nga orët e planifikuara ose me 8 orë për çdo ditë pune.",
          "Geleistete Stunden heißt tatsächlich gearbeitete Stunden: bezahlter Urlaub, Krankheit und Feiertage bleiben draußen. Wo die Stunden nicht erfasst sind, erlaubt das BLS eine Schätzung aus den geplanten Stunden oder mit 8 Stunden je Arbeitstag.") },
        { type: "callout", reading: true, text: x(
          "The rate is a fraction. It moves when the cases change, and also when the hours do.",
          "Norma është thyesë. Lëviz kur ndryshojnë rastet, por edhe kur ndryshojnë orët.",
          "Die Quote ist ein Bruch. Sie bewegt sich, wenn sich die Fälle ändern, und auch, wenn sich die Stunden ändern.") },
      ],
      note: x(
        "Formula, constant, example and the rule for hours as the BLS gives them (page last modified March 2025). The cases come from OSHA's log, Form 300, or its summary, Form 300A.",
        "Formula, konstantja, shembulli dhe rregulli për orët siç i jep BLS-ja (faqja e ndryshuar së fundi në mars 2025). Rastet merren nga regjistri i OSHA-s, formulari 300, ose nga përmbledhja e tij, formulari 300A.",
        "Formel, Konstante, Beispiel und Stundenregel, wie das BLS sie angibt (Seite zuletzt geändert im März 2025). Die Fälle stammen aus OSHAs Verzeichnis, Formular 300, oder seiner Zusammenfassung, Formular 300A."),
      source: ["injury-bls-rate-2025"],
    },
    {
      id: "numbers",
      kicker: x("The numbers", "Shifrat", "Die Zahlen"),
      title: [x("Same formula,", "E njëjta formulë,", "Gleiche Formel,"), x("different work", "punë të ndryshme", "andere Arbeit")],
      lead: x(
        "In 2024 the rate for all US private industry was 2.3 recordable cases per 100 full-time workers. Behind the average, the same formula gives very different numbers from one kind of work to the next.",
        "Më 2024, norma për gjithë sektorin privat në SHBA ishte 2,3 raste të regjistrueshme për 100 punonjës me kohë të plotë. Pas mesatares, e njëjta formulë jep shifra shumë të ndryshme nga një lloj pune te tjetri.",
        "2024 lag die Quote der gesamten US-Privatwirtschaft bei 2,3 meldepflichtigen Fällen je 100 Vollzeitbeschäftigte. Hinter dem Durchschnitt liefert dieselbe Formel von Arbeit zu Arbeit sehr verschiedene Zahlen."),
      blocks: [
        { type: "hbars", max: 8, source: ["injury-bls-soii-2026"],
          label: x("Recordable cases per 100 full-time workers, US, 2024", "Raste të regjistrueshme për 100 punonjës me kohë të plotë, SHBA, 2024", "Meldepflichtige Fälle je 100 Vollzeitbeschäftigte, USA, 2024"),
          items: [
            { k: x("Couriers and messengers", "Korrierët", "Kurier- und Expressdienste"), v: 8.0, n: dec("8.0"), alert: true },
            { k: x("Nursing and residential care", "Shtëpitë e kujdesit", "Pflege- und Wohnheime"), v: 5.5, n: dec("5.5") },
            { k: x("Warehousing and storage", "Magazinimi", "Lagerei"), v: 4.8, n: dec("4.8") },
            { k: x("Manufacturing", "Prodhimi", "Verarbeitendes Gewerbe"), v: 2.7, n: dec("2.7") },
            { k: x("All private industry", "Gjithë sektori privat", "Gesamte Privatwirtschaft"), v: 2.3, n: dec("2.3") },
            { k: x("Construction", "Ndërtimi", "Baugewerbe"), v: 2.2, n: dec("2.2") },
            { k: x("Finance and insurance", "Financat dhe sigurimet", "Finanz- und Versicherungswesen"), v: 0.3, n: dec("0.3") },
          ] },
        { type: "p", text: x(
          "The kind of case differs too. In warehousing, 4.1 of the 4.8 involved days away, restricted work or transfer, most of them restriction or transfer (2.6). Among couriers, days away led (4.2 of 8.0).",
          "Ndryshon edhe lloji i rastit. Në magazinim, 4,1 nga 4,8 kishin ditë larg punës, punë të kufizuar ose transferim, shumica punë të kufizuar ose transferim (2,6). Te korrierët prinin ditët larg punës (4,2 nga 8,0).",
          "Auch die Art der Fälle unterscheidet sich. In der Lagerei hatten 4,1 der 4,8 Ausfalltage, eingeschränkte Arbeit oder Versetzung, meist Einschränkung oder Versetzung (2,6). Bei Kurierdiensten überwogen Ausfalltage (4,2 von 8,0).") },
        { type: "callout", reading: true, text: x(
          "A rate below the national average says little. Compare it with your own industry, and look at which kind of case makes up the number.",
          "Një normë nën mesataren kombëtare thotë pak. Krahasoje me industrinë tënde dhe shiko cili lloj rasti e përbën shifrën.",
          "Eine Quote unter dem Landesdurchschnitt sagt wenig. Vergleichen Sie mit der eigenen Branche, und sehen Sie nach, welche Art von Fall die Zahl ausmacht.") },
      ],
      note: x(
        "Cases per 100 full-time equivalent workers, as employers reported them under OSHA's rules; BLS survey for 2024, Table 1, released January 2026.",
        "Raste për 100 punonjës ekuivalentë me kohë të plotë, siç i raportuan punëdhënësit sipas rregullave të OSHA-s; anketa e BLS-së për 2024, tabela 1, botuar në janar 2026.",
        "Fälle je 100 Vollzeitäquivalente, wie Arbeitgeber sie nach OSHAs Regeln meldeten; BLS-Erhebung für 2024, Tabelle 1, veröffentlicht im Januar 2026."),
      source: ["injury-bls-soii-2026"],
    },
    {
      id: "model",
      kicker: x("The model", "Modeli", "Das Modell"),
      title: [x("What counts", "Çfarë numërohet", "Was als"), x("as a case", "si rast", "Fall zählt")],
      lead: x(
        "OSHA's rule, 29 CFR 1904.7, records a work-related injury or illness that leads to death, days away from work, restricted work or transfer, medical treatment beyond first aid, or loss of consciousness, or that a doctor or other licensed professional diagnoses as significant.",
        "Rregulli i OSHA-s, 29 CFR 1904.7, regjistron një lëndim ose sëmundje nga puna që çon në vdekje, ditë larg punës, punë të kufizuar ose transferim, trajtim mjekësor përtej ndihmës së parë, ose humbje të vetëdijes, ose që një mjek a profesionist tjetër i licencuar e diagnostikon si të rëndësishme.",
        "OSHAs Regel 29 CFR 1904.7 erfasst eine arbeitsbedingte Verletzung oder Erkrankung, die zu Tod, Ausfalltagen, eingeschränkter Arbeit oder Versetzung, ärztlicher Behandlung über Erste Hilfe hinaus oder Bewusstlosigkeit führt oder die ein Arzt oder eine andere zugelassene Fachkraft als erheblich diagnostiziert."),
      blocks: [
        { type: "lists", cols: [
          { h: x("First aid: not a case", "Ndihmë e parë: jo rast", "Erste Hilfe: kein Fall"), items: [
            x("Non-prescription medicine at normal strength", "Ilaç pa recetë në dozë të zakonshme", "Rezeptfreie Arznei in normaler Stärke"),
            x("A tetanus shot", "Vaksina kundër tetanozit", "Eine Tetanusimpfung"),
            x("Cleaning a wound, plasters, butterfly strips", "Pastrimi i plagës, leukoplasti, shiritat ngjitës", "Wundreinigung, Pflaster, Klammerpflaster"),
            x("Hot or cold packs, elastic bandages", "Kompresa të nxehta ose të ftohta, fasha elastike", "Wärme oder Kälte, elastische Binden"),
            x("Massage; fluids for heat stress", "Masazh; lëngje për stresin nga nxehtësia", "Massage; Flüssigkeit bei Hitzestress"),
          ] },
          { h: x("Medical treatment: a case", "Trajtim mjekësor: rast", "Ärztliche Behandlung: ein Fall"), accent: true, items: [
            x("The same medicine at prescription strength", "I njëjti ilaç në dozë me recetë", "Dieselbe Arznei in verschreibungspflichtiger Stärke"),
            x("Other vaccines, such as rabies", "Vaksina të tjera, si ajo kundër tërbimit", "Andere Impfungen, etwa gegen Tollwut"),
            x("Stitches or staples", "Qepje ose kapëse", "Nähte oder Klammern"),
            x("A rigid splint to immobilise", "Një shinë e fortë për palëvizshmëri", "Eine starre Schiene zur Ruhigstellung"),
            x("Physical therapy or chiropractic", "Fizioterapi ose kiropraktikë", "Physiotherapie oder Chiropraktik"),
          ] },
        ] },
        { type: "p", text: x(
          "The rule calls its list of 14 first-aid treatments complete. A note at the head of the rule adds that recording a case does not mean that the employer or the worker was at fault, or that a rule was broken.",
          "Rregulli e quan të plotë listën e vet me 14 trajtime të ndihmës së parë. Një shënim në krye të rregullit shton se regjistrimi i një rasti nuk do të thotë që punëdhënësi ose punonjësi kishte faj, as që u shkel një rregull.",
          "Die Regel nennt ihre Liste von 14 Erste-Hilfe-Maßnahmen abschließend. Eine Anmerkung am Anfang der Regel fügt hinzu: Wird ein Fall erfasst, heißt das nicht, dass Arbeitgeber oder Beschäftigte schuld waren oder eine Vorschrift verletzt wurde.") },
        { type: "callout", reading: true, text: x(
          "The line runs through the treatment, not the injury. The same cut is first aid with butterfly strips and a recordable case with stitches.",
          "Vija kalon nëpër trajtimin, jo nëpër lëndimin. E njëjta prerje është ndihmë e parë me shirita ngjitës dhe rast i regjistrueshëm me qepje.",
          "Die Grenze verläuft über die Behandlung, nicht über die Verletzung. Derselbe Schnitt ist mit Klammerpflaster Erste Hilfe und mit Naht ein meldepflichtiger Fall.") },
      ],
      note: x(
        "Shortened from 29 CFR 1904.7, Code of Federal Regulations, annual edition 2024. Each side lists 5 examples. Leading and lagging indicators are in No. 2.",
        "E shkurtuar nga 29 CFR 1904.7, Kodi i Rregulloreve Federale, botimi vjetor 2024. Secila anë jep 5 shembuj. Treguesit paraprijës dhe vonues janë te Nr. 2.",
        "Gekürzt aus 29 CFR 1904.7, Code of Federal Regulations, Jahresausgabe 2024. Jede Seite nennt 5 Beispiele. Früh- und Spätindikatoren stehen in Nr. 2."),
      source: ["injury-cfr-1904-2024"],
    },
    {
      id: "research",
      kicker: x("What the research says", "Çfarë thotë kërkimi", "Was die Forschung sagt"),
      title: [x("What a low rate", "Çfarë mund të fshehë", "Was eine niedrige"), x("can hide", "një normë e ulët", "Quote verdecken kann")],
      lead: x(
        "Eurostat counts accidents at work that cause at least four full calendar days of absence. In 2024 the EU had 1,359 per 100,000 people employed. Romania reported 65, France 2,622.",
        "Eurostat numëron aksidentet në punë që shkaktojnë të paktën katër ditë të plota kalendarike mungesë. Më 2024, BE-ja kishte 1.359 të tilla për 100.000 të punësuar. Rumania raportoi 65, Franca 2.622.",
        "Eurostat zählt Arbeitsunfälle mit mindestens vier vollen Kalendertagen Ausfall. 2024 kamen in der EU 1.359 auf 100.000 Erwerbstätige. Rumänien meldete 65, Frankreich 2.622."),
      blocks: [
        { type: "hbars", max: 2700, source: ["injury-eurostat-2026"],
          label: x("Non-fatal accidents at work per 100,000 employed, 2024", "Aksidente jo fatale në punë për 100.000 të punësuar, 2024", "Nicht tödliche Arbeitsunfälle je 100.000 Erwerbstätige, 2024"),
          items: [
            { k: x("France", "Franca", "Frankreich"), v: 2622, n: x("2,622", "2.622", "2.622") },
            { k: x("Portugal", "Portugalia", "Portugal"), v: 2489, n: x("2,489", "2.489", "2.489") },
            { k: x("EU", "BE", "EU"), v: 1359, n: x("1,359", "1.359", "1.359") },
            { k: x("Bulgaria", "Bullgaria", "Bulgarien"), v: 87, n: "87" },
            { k: x("Romania", "Rumania", "Rumänien"), v: 65, n: "65", alert: true },
          ] },
        { type: "p", text: x(
          "Eurostat warns that very low rates may reflect under-reporting, and that well-established reporting systems may often explain high ones. In 2009 the US GAO surveyed occupational health practitioners: 67% had seen workers fear discipline for reporting, and over a third had been asked for treatment that kept a case off the log but was not enough to treat it.",
          "Eurostat paralajmëron se normat shumë të ulëta mund të vijnë nga nënraportimi, dhe se sistemet e raportimit të mirëngritura shpesh mund t'i shpjegojnë normat e larta. Më 2009, Zyra e Llogaridhënies së Qeverisë së SHBA-së (GAO) anketoi mjekë dhe profesionistë të tjerë të shëndetit në punë: 67% kishin parë punonjës që kishin frikë nga ndëshkimi po të raportonin, dhe mbi një e treta ishin pyetur për trajtim që e mbante rastin jashtë regjistrit, por nuk mjaftonte për ta kuruar.",
          "Eurostat warnt, dass sehr niedrige Quoten Untererfassung spiegeln können und dass gut etablierte Meldesysteme hohe Quoten oft erklären können. 2009 befragte der US-Rechnungshof GAO Fachleute der Arbeitsmedizin: 67 % hatten erlebt, dass Beschäftigte Strafen für eine Meldung fürchteten, und über ein Drittel war um eine Behandlung gebeten worden, die den Fall aus dem Verzeichnis hielt, aber zur Heilung nicht reichte.") },
        { type: "callout", reading: true, text: x(
          "A low rate can mean safe work, or work where cases are not reported. The number alone cannot tell the two apart.",
          "Një normë e ulët mund të thotë punë e sigurt, ose punë ku rastet nuk raportohen. Vetëm shifra nuk i dallon dot të dyja.",
          "Eine niedrige Quote kann sichere Arbeit bedeuten oder Arbeit, in der Fälle nicht gemeldet werden. Die Zahl allein unterscheidet die beiden nicht.") },
      ],
      note: x(
        "Eurostat: simple rates, not adjusted for the mix of industries; data extracted September 2026. GAO: 504 of 1,131 practitioners answered (45%), about the workplaces where they treated workers in 2008.",
        "Eurostat: norma të thjeshta, pa përshtatje për përbërjen e industrive; të dhënat e nxjerra në shtator 2026. GAO: u përgjigjën 504 nga 1.131 të anketuar (45%), për vendet e punës ku trajtuan punonjës më 2008.",
        "Eurostat: einfache Quoten, nicht nach Branchenmix bereinigt; Datenstand September 2026. GAO: 504 von 1.131 Fachleuten antworteten (45 %), über die Betriebe, in denen sie 2008 Beschäftigte behandelten."),
      source: ["injury-eurostat-2026", "injury-gao-2009"],
    },
    {
      id: "measure", more: "a-bad-day-or-a-problem",
      kicker: x("How it is measured", "Si matet", "Wie es gemessen wird"),
      title: [x("One case,", "Një rast,", "Ein Fall,"), x("a new rate", "një normë tjetër", "eine neue Quote")],
      lead: x(
        "The hours are the denominator. A small site has few of them, so one case moves its rate a long way. The base matters too: the ILO standard counts per million hours, five times the US base.",
        "Orët janë emëruesi. Një vend i vogël ka pak orë, prandaj një rast e lëviz shumë normën e tij. Ka rëndësi edhe baza: standardi i ILO-s numëron për një milion orë, pesë herë baza amerikane.",
        "Die Stunden sind der Nenner. Ein kleiner Standort hat wenige davon, also bewegt ein Fall seine Quote weit. Auch die Basis zählt: Der ILO-Standard rechnet je Million Stunden, fünfmal die US-Basis."),
      blocks: [
        { type: "example", label: x("Hypothetical example, two sites in one year", "Shembull hipotetik, dy vende pune në një vit", "Hypothetisches Beispiel, zwei Standorte in einem Jahr"), rows: [
          { k: x("Small site", "Vendi i vogël", "Kleiner Standort"), v: x("25 people, 50,000 hours: 1 case = 4.0, 2 cases = 8.0", "25 vetë, 50.000 orë: 1 rast = 4,0, 2 raste = 8,0", "25 Personen, 50.000 Stunden: 1 Fall = 4,0, 2 Fälle = 8,0") },
          { k: x("Large site", "Vendi i madh", "Großer Standort"), v: x("1,000 people, 2,000,000 hours: one more case adds 0.1", "1.000 vetë, 2.000.000 orë: një rast më shumë shton 0,1", "1.000 Personen, 2.000.000 Stunden: ein Fall mehr bringt 0,1") },
          { k: x("Per million hours", "Për një milion orë", "Je Million Stunden"), v: x("the small site's 4.0 becomes 20", "4,0 e vendit të vogël bëhet 20", "aus den 4,0 des kleinen Standorts werden 20") },
        ], text: x("One more case doubles the small site's rate and barely shows at the large one. The sites and figures are invented.", "Një rast më shumë e dyfishon normën e vendit të vogël dhe mezi duket te i madhi. Vendet dhe shifrat janë të shpikura.", "Ein Fall mehr verdoppelt die Quote des kleinen Standorts und fällt beim großen kaum auf. Standorte und Zahlen sind erfunden.") },
        { type: "rows", compact: true, items: [
          { h: x("Show the count and the hours", "Trego numrin dhe orët", "Anzahl und Stunden zeigen"), p: x("Next to the rate, so a reader sees how many cases make it.", "Pranë normës, që lexuesi të shohë sa raste e bëjnë.", "Neben der Quote, damit man sieht, wie viele Fälle sie ausmachen.") },
          { h: x("Use twelve months", "Përdor dymbëdhjetë muaj", "Zwölf Monate nehmen"), p: x("A rolling year gives a small site enough hours to read.", "Një vit që rrëshqet i jep një vendi të vogël mjaft orë për ta lexuar.", "Ein gleitendes Jahr gibt einem kleinen Standort genug Stunden.") },
          { h: x("Name the base", "Thuaj bazën", "Die Basis nennen"), p: x("200,000 hours, a million hours, or people employed.", "200.000 orë, një milion orë, apo të punësuarit.", "200.000 Stunden, eine Million Stunden oder Erwerbstätige.") },
        ] },
        { type: "callout", reading: true, text: x(
          "A small site with a second case has not become twice as dangerous overnight. Read the count before the rate.",
          "Një vend i vogël me një rast të dytë nuk është bërë brenda natës dy herë më i rrezikshëm. Lexo numrin e rasteve para normës.",
          "Ein kleiner Standort mit einem zweiten Fall ist nicht über Nacht doppelt so gefährlich geworden. Lesen Sie die Anzahl vor der Quote.") },
      ],
      note: x(
        "The example and the three checks are the editors'. 2,000 hours a year is the BLS base per worker; the ILO frequency rate is from its 1998 resolution.",
        "Shembulli dhe tri kontrollet janë të redaksisë. 2.000 orë në vit është baza e BLS-së për një punonjës; norma e shpeshtësisë e ILO-s vjen nga rezoluta e saj e vitit 1998.",
        "Beispiel und die drei Prüfungen stammen von der Redaktion. 2.000 Stunden im Jahr sind die BLS-Basis je Beschäftigten; die Häufigkeitsrate der ILO stammt aus ihrer Resolution von 1998."),
      source: ["injury-bls-rate-2025", "injury-ilo-1998"],
    },
    {
      id: "tool", tool: "/tools/safety-cross/",
      kicker: x("Tool of the issue", "Mjeti i numrit", "Werkzeug der Ausgabe"),
      title: [x("The safety", "Karta e normës", "Die Karte zur"), x("rate card", "së sigurisë", "Sicherheitsquote")],
      lead: x(
        "One card per site and month, filled in before the number goes into a report. The safety cross logs each event by day and works out the rates from the hours.",
        "Një kartë për çdo vend pune dhe muaj, e plotësuar para se shifra të hyjë në raport. Kryqi i sigurisë regjistron çdo ngjarje sipas ditës dhe i llogarit normat nga orët.",
        "Eine Karte je Standort und Monat, ausgefüllt, bevor die Zahl in einen Bericht geht. Das Sicherheitskreuz erfasst jedes Ereignis nach Tag und berechnet die Quoten aus den Stunden."),
      blocks: [
        { type: "form", items: [
          { h: x("Site and period", "Vendi dhe periudha", "Standort und Zeitraum"), hint: x("the month, and the twelve months to date", "muaji, dhe dymbëdhjetë muajt deri sot", "der Monat und die zwölf Monate bis heute") },
          { h: x("Cases", "Rastet", "Fälle"), hint: x("days away, restriction or transfer, other recordable; first-aid cases apart", "ditë larg, punë e kufizuar ose transferim, të tjera; ndihma e parë veçmas", "Ausfalltage, Einschränkung oder Versetzung, sonstige; Erste Hilfe getrennt") },
          { h: x("Hours worked", "Orët e punuara", "Geleistete Stunden"), hint: x("hours actually worked, without paid leave; where they come from", "orët e punuara vërtet, pa lejet e paguara; nga vijnë", "tatsächlich gearbeitet, ohne bezahlte Abwesenheit; woher sie stammen") },
          { h: x("Rate and base", "Norma dhe baza", "Quote und Basis"), hint: x("cases × 200,000 ÷ hours, or × 1,000,000; write which", "rastet × 200.000 ÷ orët, ose × 1.000.000; shkruaj cilën", "Fälle × 200.000 ÷ Stunden oder × 1.000.000; angeben, welche") },
          { h: x("Compared with", "Krahasuar me", "Verglichen mit"), hint: x("our last twelve months; our industry, with its year", "dymbëdhjetë muajt tanë të fundit; industria jonë, me vitin e saj", "unsere letzten zwölf Monate; unsere Branche, mit ihrem Jahr") },
          { h: x("What the rate does not show", "Çfarë nuk tregon norma", "Was die Quote nicht zeigt"), hint: x("near misses, first-aid cases, reports still open, any sign that people hold back", "near miss-et, rastet e ndihmës së parë, raportet e hapura, çdo shenjë se njerëzit nuk raportojnë", "Beinahe-Ereignisse, Erste-Hilfe-Fälle, offene Meldungen, jedes Zeichen, dass Leute nicht melden"), lines: 2 },
        ] },
      ],
      note: x(
        "Our proposal, built on the BLS formula, OSHA's recording criteria and the ILO frequency rate. Near misses are in No. 63.",
        "Propozimi ynë, i ndërtuar mbi formulën e BLS-së, kriteret e regjistrimit të OSHA-s dhe normën e shpeshtësisë së ILO-s. Near miss-et janë te Nr. 63.",
        "Unser Vorschlag, gestützt auf die BLS-Formel, OSHAs Erfassungskriterien und die Häufigkeitsrate der ILO. Beinahe-Ereignisse stehen in Nr. 63."),
      source: ["injury-bls-rate-2025", "injury-cfr-1904-2024", "injury-ilo-1998"],
    },
    { id: "sources", type: "sources" },
    { id: "back", type: "back" },
  ],
};
