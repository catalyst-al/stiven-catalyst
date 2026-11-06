// Management Review, No. 108: Online ratings, what a star is worth and what the average hides. Block: KPIs.
// Facts and their sources: docs/revista/management-review-nr-108.md. All four sources were read in full: Luca (HBS
// working paper 12-016, 2016 version), Hu, Pavlou & Zhang (working paper, February 2007, NYU Faculty Digital Archive),
// Luca & Zervas (accepted version of 20 July 2015 in Harvard's DASH; published in Management Science 2016) and
// Anderson (Cornell Hospitality Report, 2012, from Cornell's eCommons). No regulator's material on fake reviews was
// read in full, so none is used. NPS, CSAT and CES are No. 32, Goodhart's law No. 43: not repeated.
import { x, pc } from "../common.js";

// "1.42%" in English, "1,42%" in Albanian, "1,42 %" in German.
const pcd = (s) => x(`${s}%`, `${s.replace(".", ",")}%`, `${s.replace(".", ",")} %`);

export default {
  number: 108,
  block: "kpi",
  date: x("November 2026", "Nëntor 2026", "November 2026"),
  theme: [x("Online ratings:", "Vlerësimet online:", "Online-Bewertungen:"), x("what a star is worth", "sa vlen një yll", "was ein Stern wert ist")],
  sub: x(
    "Half a star in Seattle, what a point is worth to a hotel, three things the average hides, the J that nobody chose, the fakes, and a card for reading the month's reviews.",
    "Gjysmë ylli në Seattle, sa vlen një pikë për një hotel, tri gjëra që i fsheh mesatarja, J-ja që s'e zgjodhi askush, vlerësimet e rreme, dhe një kartë për të lexuar vlerësimet e muajit.",
    "Ein halber Stern in Seattle, was ein Punkt einem Hotel wert ist, drei Dinge, die der Durchschnitt verbirgt, das J, das niemand wählte, die Fälschungen und eine Karte für die Bewertungen des Monats."),
  seo: x(
    "Online ratings as a KPI: what a star does to revenue and hotel prices, why reviews form a J, how common fake reviews are, and a monthly reading card.",
    "Vlerësimet online si KPI: çfarë i bën një yll të ardhurave dhe çmimit, pse formojnë një J, sa të shpeshta janë ato të rreme, dhe një kartë.",
    "Online-Bewertungen als Kennzahl: was ein Stern für Umsatz und Hotelpreis bedeutet, warum sie ein J bilden, wie häufig Fälschungen sind, und eine Karte."),
  feature: x(
    "A guest choosing between two hotels sees 4.1 against 4.4 and books the second. Issue 108 asks what one star is worth: about 5% to 9% of revenue for an independent restaurant in Seattle, and 11.2% of price for a hotel on a booking site in 2012. Then it shows what the single average hides: how few people wrote, a J-shaped pile of fives and ones, and the share of reviews a platform flags as fake. A card for reading the month's reviews closes it.",
    "Një mysafir që zgjedh mes dy hoteleve sheh 4,1 kundrejt 4,4 dhe rezervon të dytin. Numri 108 pyet sa vlen një yll: rreth 5% deri 9% e të ardhurave për një restorant të pavarur në Seattle, dhe 11,2% e çmimit për një hotel në një faqe rezervimesh më 2012. Pastaj tregon çfarë fsheh mesatarja e vetme: sa pak njerëz shkruan, një grumbull në formë J-je me pesëshe dhe njësha, dhe pjesën e vlerësimeve që një platformë i shënon si të rreme. E mbyll një kartë për të lexuar vlerësimet e muajit.",
    "Ein Gast, der zwischen zwei Hotels wählt, sieht 4,1 gegen 4,4 und bucht das zweite. Ausgabe 108 fragt, was ein Stern wert ist: rund 5 bis 9 % Umsatz für ein unabhängiges Restaurant in Seattle und 11,2 % Preis für ein Hotel auf einem Buchungsportal 2012. Dann zeigt sie, was der eine Durchschnitt verbirgt: wie wenige schrieben, einen J-förmigen Haufen aus Fünfen und Einsen und den Anteil, den eine Plattform als gefälscht markiert. Eine Karte zum Lesen der Bewertungen des Monats schließt sie."),
  figure: { n: pcd("11.2"), by: "Anderson, 2012", t: x(
    "higher price a hotel could charge, at the same chance of being booked, with a review score one point higher out of five. Travelocity, 2012.",
    "çmim më të lartë që mund të vinte një hotel, me të njëjtin shans për t'u rezervuar, me një vlerësim një pikë më të lartë nga pesë. Travelocity, 2012.",
    "höheren Preis konnte ein Hotel bei gleicher Buchungschance verlangen, wenn seine Bewertung einen Punkt von fünf höher lag. Travelocity, 2012.") },
  teasers: [
    { page: "story", kicker: x("Cover story", "Tema kryesore", "Titelthema"),
      title: x("Half a star in Seattle", "Gjysmë ylli në Seattle", "Ein halber Stern in Seattle") },
    { page: "research", kicker: x("What the research says", "Çfarë thotë kërkimi", "Was die Forschung sagt"),
      title: x("The J that nobody chose", "J-ja që s'e zgjodhi askush", "Das J, das niemand wählte") },
    { page: "tool", kicker: x("Tool of the issue", "Mjeti i numrit", "Werkzeug der Ausgabe"),
      title: x("The monthly review card", "Karta mujore e vlerësimeve", "Die Monatskarte der Bewertungen") },
  ],
  sources: ["reviews-luca-2016", "reviews-anderson-2012", "reviews-hu-2007", "reviews-luca-zervas-2016"],
  pages: [
    { id: "cover", type: "cover" },
    {
      id: "intro", type: "intro",
      why: x(
        "Stars have become a KPI that the customer writes and the whole market reads. A manager is asked why the score fell from 4.4 to 4.2 and rarely asks how many people wrote, who they were, or whether some of them were real. This issue puts a price on a star, then takes the average apart.",
        "Yjet janë bërë një KPI që e shkruan klienti dhe e lexon gjithë tregu. Menaxherit i kërkohet pse rezultati ra nga 4,4 në 4,2, dhe rrallë pyet sa vetë shkruan, kush ishin, apo nëse disa prej tyre ishin të vërtetë. Ky numër i vë një çmim një ylli, pastaj e çmonton mesataren.",
        "Sterne sind eine Kennzahl geworden, die der Kunde schreibt und der ganze Markt liest. Eine Führungskraft wird gefragt, warum der Wert von 4,4 auf 4,2 fiel, und fragt selten, wie viele schrieben, wer sie waren oder ob alle echt waren. Diese Ausgabe gibt einem Stern einen Preis und nimmt dann den Durchschnitt auseinander."),
      body: x(
        "In Seattle a star more on Yelp meant 5% to 9% more revenue for an independent restaurant, and nothing measurable for a chain. For hotels on Travelocity in 2012, a point more was worth an 11.2% higher price. But on Amazon most ratings are fives, with a smaller heap of ones; when a whole group rated one CD, the ratings were lower and in the middle. On Yelp about 16% of Boston restaurant reviews were filtered as suspicious. A monthly card closes the issue.",
        "Në Seattle një yll më shumë në Yelp do të thoshte 5% deri 9% më shumë të ardhura për një restorant të pavarur, dhe asgjë të matshme për një zinxhir. Për hotelet në Travelocity më 2012, një pikë më shumë vlente 11,2% çmim më të lartë. Por në Amazon shumica e vlerësimeve janë pesëshe, me një grumbull më të vogël njëshash; kur një grup i tërë vlerësoi një CD, vlerësimet ishin më të ulëta dhe në mes. Në Yelp rreth 16% e vlerësimeve të restoranteve të Bostonit u filtruan si të dyshimta. Një kartë mujore e mbyll numrin.",
        "In Seattle brachte ein Stern mehr auf Yelp einem unabhängigen Restaurant 5 bis 9 % mehr Umsatz, einer Kette nichts Messbares. Für Hotels auf Travelocity war 2012 ein Punkt mehr 11,2 % höheren Preis wert. Doch auf Amazon sind die meisten Bewertungen Fünfen, mit einem kleineren Haufen Einsen; als eine ganze Gruppe eine CD bewertete, lagen die Werte niedriger und in der Mitte. Auf Yelp wurden rund 16 % der Bewertungen Bostoner Restaurants als verdächtig gefiltert. Eine Monatskarte schließt die Ausgabe."),
    },
    {
      id: "story",
      kicker: x("Cover story", "Tema kryesore", "Titelthema"),
      title: [x("Half a star", "Gjysmë ylli", "Ein halber Stern"), x("in Seattle", "në Seattle", "in Seattle")],
      lead: x(
        "Michael Luca of Harvard Business School matched Yelp reviews with the revenue every restaurant in Seattle reported to the state tax office, 2003 to 2009: 3,582 restaurants. Yelp shows each average rounded to the nearest half star, so a 3.24 appears as three stars and a 3.25 as three and a half.",
        "Michael Luca nga Harvard Business School i lidhi vlerësimet e Yelp me të ardhurat e deklaruara në tatime të çdo restoranti në Seattle, 2003 deri 2009: 3.582 restorante. Yelp e tregon çdo mesatare të rrumbullakuar te gjysmë ylli më i afërt, ndaj një 3,24 shfaqet tre yje dhe një 3,25 tre e gjysmë.",
        "Michael Luca von der Harvard Business School verknüpfte Yelp-Bewertungen mit den Umsätzen, die jedes Restaurant in Seattle der Steuerbehörde meldete, 2003 bis 2009: 3.582 Restaurants. Yelp zeigt jeden Durchschnitt auf den nächsten halben Stern gerundet, eine 3,24 erscheint also als drei Sterne, eine 3,25 als dreieinhalb."),
      blocks: [
        { type: "figures", compact: true, items: [
          { n: x("5–9%", "5–9%", "5–9 %"), t: x("more revenue for an independent restaurant per extra star, depending on the method", "më shumë të ardhura për një restorant të pavarur për çdo yll shtesë, sipas metodës", "mehr Umsatz für ein unabhängiges Restaurant je zusätzlichem Stern, je nach Methode") },
          { n: x("≈ 0", "≈ 0", "≈ 0"), t: x("effect for chain restaurants: not significant", "efekti për restorantet e zinxhirëve: jo i rëndësishëm", "Effekt bei Kettenrestaurants: nicht signifikant") },
        ] },
        { type: "p", text: x(
          "Comparing restaurants just either side of a rounding line, the extra half star alone raised revenue; scaled to a full star, about 9%. Diners reacted to the rounded number they saw, not only to the reviews behind it. By 2009 Yelp covered 70% of Seattle's restaurants; the city's paper had reviewed about 5%.",
          "Duke krahasuar restorantet pak sipër e pak poshtë një vije rrumbullakimi, vetëm gjysmë ylli shtesë i rriti të ardhurat; e shtrirë në një yll të plotë, rreth 9%. Klientët reaguan ndaj numrit të rrumbullakuar që panë, jo vetëm ndaj vlerësimeve pas tij. Deri më 2009 Yelp mbulonte 70% të restoranteve të Seattle-it; gazeta e qytetit kishte shkruar për rreth 5%.",
          "Beim Vergleich von Restaurants knapp über und unter einer Rundungsgrenze hob der zusätzliche halbe Stern allein den Umsatz; auf einen ganzen Stern hochgerechnet rund 9 %. Die Gäste reagierten auf die gerundete Zahl, die sie sahen, nicht nur auf die Bewertungen dahinter. 2009 deckte Yelp 70 % der Restaurants Seattles ab; die Lokalzeitung hatte rund 5 % besprochen.") },
        { type: "callout", reading: true, text: x(
          "The rounding line is arbitrary, and the money followed it. A displayed number is a decision for the customer.",
          "Vija e rrumbullakimit është arbitrare, dhe paraja e ndoqi. Një numër i shfaqur është një vendim për klientin.",
          "Die Rundungsgrenze ist willkürlich, und das Geld folgte ihr. Eine angezeigte Zahl ist eine Entscheidung für den Kunden.") },
      ],
      note: x(
        "Luca (2016), HBS working paper: quarterly revenue from the Washington State Department of Revenue; 5.4% from fixed effects, about 9% from restaurants within 0.1 star of a threshold. One city, data up to 2009; chains were about 5% of restaurants.",
        "Luca (2016), punim pune i HBS: të ardhura tremujore nga Departamenti i të Ardhurave i shtetit Washington; 5,4% nga efektet fikse, rreth 9% nga restorantet brenda 0,1 ylli nga një prag. Një qytet, të dhëna deri më 2009; zinxhirët ishin rreth 5% e restoranteve.",
        "Luca (2016), HBS-Arbeitspapier: Quartalsumsätze der Steuerbehörde des Bundesstaats Washington; 5,4 % aus Fixed Effects, rund 9 % aus Restaurants innerhalb von 0,1 Stern um eine Schwelle. Eine Stadt, Daten bis 2009; Ketten waren rund 5 % der Restaurants."),
      source: ["reviews-luca-2016"],
    },
    {
      id: "numbers",
      kicker: x("The numbers", "Shifrat", "Die Zahlen"),
      title: [x("What a point is", "Sa vlen një pikë", "Was ein Punkt"), x("worth to a hotel", "për një hotel", "einem Hotel wert ist")],
      lead: x(
        "Chris Anderson of Cornell's School of Hotel Administration studied 13,341 Travelocity bookings in nine US cities in July 2012. One point more on the five-point review score raised a hotel's odds of being chosen by 14.2%: enough to charge 11.2% more and be booked as often. Each place lower on the list cut the odds by 11.5%.",
        "Chris Anderson nga Shkolla e Administrimit të Hoteleve e Cornell-it studioi 13.341 rezervime në Travelocity në nëntë qytete amerikane në korrik 2012. Një pikë më shumë në vlerësimin me pesë pikë i rriti shanset e një hoteli për t'u zgjedhur me 14,2%: aq sa të kërkonte 11,2% më shumë dhe të rezervohej njësoj. Çdo vend më poshtë në listë i uli shanset me 11,5%.",
        "Chris Anderson von der School of Hotel Administration der Cornell University untersuchte 13.341 Travelocity-Buchungen in neun US-Städten im Juli 2012. Ein Punkt mehr auf der Fünf-Punkte-Bewertung erhöhte die Chance eines Hotels, gewählt zu werden, um 14,2 %: genug, um 11,2 % mehr zu verlangen und gleich oft gebucht zu werden. Jeder Platz tiefer in der Liste senkte die Chance um 11,5 %."),
      blocks: [
        { type: "hbars", max: 1.6, source: ["reviews-anderson-2012"],
          label: x("RevPAR change for a 1% better online reputation, by hotel class, 2010–2012", "Ndryshimi i RevPAR për 1% reputacion online më të mirë, sipas klasës së hotelit, 2010–2012", "RevPAR-Änderung je 1 % besserer Online-Reputation, nach Hotelklasse, 2010–2012"),
          items: [
            { k: x("Luxury", "Luks", "Luxus"), v: 0.49, n: pcd("0.49") },
            { k: x("Upper upscale", "Shumë i lartë", "Gehobene Oberklasse"), v: 0.74, n: pcd("0.74") },
            { k: x("Upscale", "I lartë", "Gehoben"), v: 0.83, n: pcd("0.83") },
            { k: x("Upper midscale", "Mesatar i lartë", "Obere Mittelklasse"), v: 1.13, n: pcd("1.13") },
            { k: x("Midscale", "Mesatar", "Mittelklasse"), v: 1.42, n: pcd("1.42"), alert: true },
          ] },
        { type: "callout", reading: true, text: x(
          "The less a guest can guess from the brand and the price, the more the reviews decide. In midscale the gain was nearly three times that of luxury.",
          "Sa më pak mund të hamendësojë mysafiri nga marka dhe çmimi, aq më shumë vendosin vlerësimet. Te klasa mesatare fitimi ishte gati tri herë sa te luksi.",
          "Je weniger ein Gast aus Marke und Preis ablesen kann, desto mehr entscheiden die Bewertungen. In der Mittelklasse war der Gewinn fast dreimal so groß wie im Luxussegment.") },
      ],
      note: x(
        "Anderson (2012): STR monthly data, January 2010 to June 2012, 11 cities in Europe and North America, against each hotel's competitive set; reputation is ReviewPro's index. Across all classes: price 0.80%, occupancy 0.20%, RevPAR 0.96%. Associations, old data; he notes much is not measured.",
        "Anderson (2012): të dhëna mujore të STR, janar 2010 deri qershor 2012, 11 qytete në Evropë dhe Amerikën e Veriut, kundrejt grupit konkurrues të çdo hoteli; reputacioni është indeksi i ReviewPro. Për të gjitha klasat: çmimi 0,80%, zënia 0,20%, RevPAR 0,96%. Lidhje, jo prova shkaku, të dhëna të vjetra; autori shënon se shumëçka nuk matet.",
        "Anderson (2012): STR-Monatsdaten, Januar 2010 bis Juni 2012, 11 Städte in Europa und Nordamerika, gegen das Wettbewerbsumfeld jedes Hotels; Reputation ist der Index von ReviewPro. Über alle Klassen: Preis 0,80 %, Auslastung 0,20 %, RevPAR 0,96 %. Zusammenhänge, alte Daten; vieles sei nicht gemessen, schreibt er."),
      source: ["reviews-anderson-2012"],
    },
    {
      id: "model",
      kicker: x("The model", "Modeli", "Das Modell"),
      title: [x("Three things", "Tri gjëra", "Drei Dinge,"), x("the average hides", "që fsheh mesatarja", "die der Durchschnitt verbirgt")],
      lead: x(
        "An average of stars is a single figure built from three things the reader does not see: how many people wrote, how their ratings are spread, and who they were. Luca found that readers weigh the first and the last when they can see them.",
        "Një mesatare yjesh është një shifër e vetme e ndërtuar nga tri gjëra që lexuesi nuk i sheh: sa vetë shkruan, si shpërndahen vlerësimet e tyre, dhe kush ishin. Luca gjeti se lexuesit e peshojnë të parën dhe të fundit kur i shohin.",
        "Ein Sternedurchschnitt ist eine Zahl aus drei Dingen, die der Leser nicht sieht: wie viele schrieben, wie ihre Bewertungen verteilt sind und wer sie waren. Luca fand, dass Leser das Erste und das Letzte gewichten, wenn sie es sehen."),
      blocks: [
        { type: "cards", cols: 3, items: [
          { h: x("How many", "Sa vetë", "Wie viele"), p: x("A rating change moved revenue 50% more with 50 reviews or more than with under 10.", "Një ndryshim vlerësimi lëvizi të ardhurat 50% më shumë me 50 vlerësime e sipër se me nën 10.", "Eine Änderung wirkte ab 50 Bewertungen 50 % stärker als bei unter 10.") },
          { h: x("The spread", "Shpërndarja", "Die Verteilung"), p: x("Reviews pile up at five and one; the mean sits between two crowds.", "Vlerësimet grumbullohen te pesa dhe njëshi; mesatarja rri mes dy turmave.", "Bewertungen häufen sich bei Fünf und Eins; der Mittelwert liegt zwischen zwei Lagern.") },
          { h: x("Who wrote", "Kush shkroi", "Wer schrieb"), p: x("Yelp's elite reviewers had about twice the effect; some reviewers are not customers.", "Vlerësuesit elitë të Yelp kishin rreth dyfishin e efektit; disa vlerësues nuk janë klientë.", "Yelps Elite-Rezensenten wirkten etwa doppelt; manche Rezensenten sind keine Kunden.") },
        ] },
        { type: "example", label: x("Example, invented by the editors", "Shembull, i shpikur nga redaksia", "Beispiel, von der Redaktion erfunden"),
          rows: [
            { k: x("Hotel A, 10 reviews", "Hoteli A, 10 vlerësime", "Hotel A, 10 Bewertungen"), v: x("all three stars: average 3.0", "të gjitha tre yje: mesatarja 3,0", "alle drei Sterne: Durchschnitt 3,0") },
            { k: x("Hotel B, 10 reviews", "Hoteli B, 10 vlerësime", "Hotel B, 10 Bewertungen"), v: x("five fives, five ones: average 3.0", "pesë pesëshe, pesë njësha: mesatarja 3,0", "fünf Fünfen, fünf Einsen: Durchschnitt 3,0") },
          ],
          text: x(
            "Same average, two different hotels: one is ordinary for everyone, the other splits its guests. Only the spread tells them apart.",
            "E njëjta mesatare, dy hotele të ndryshëm: njëri është i zakonshëm për të gjithë, tjetri i ndan mysafirët. Vetëm shpërndarja i dallon.",
            "Gleicher Durchschnitt, zwei verschiedene Hotels: eines ist für alle gewöhnlich, das andere spaltet seine Gäste. Nur die Verteilung trennt sie.") },
      ],
      note: x(
        "Cards: the editors' summary of Luca (2016, tables 9 and 10), Hu, Pavlou & Zhang (2007) and Luca & Zervas (2016). The 50% compares restaurants with at least 50 reviews to those with fewer than 10. The example is invented.",
        "Kartat: përmbledhje e redaksisë nga Luca (2016, tabelat 9 dhe 10), Hu, Pavlou & Zhang (2007) dhe Luca & Zervas (2016). 50% krahason restorantet me të paktën 50 vlerësime me ato me më pak se 10. Shembulli është i shpikur.",
        "Karten: Zusammenfassung der Redaktion aus Luca (2016, Tabellen 9 und 10), Hu, Pavlou & Zhang (2007) und Luca & Zervas (2016). Die 50 % vergleichen Restaurants mit mindestens 50 Bewertungen mit solchen unter 10. Das Beispiel ist erfunden."),
      source: ["reviews-luca-2016", "reviews-hu-2007", "reviews-luca-zervas-2016"],
    },
    {
      id: "research",
      kicker: x("What the research says", "Çfarë thotë kërkimi", "Was die Forschung sagt"),
      title: [x("The J that", "J-ja që", "Das J, das"), x("nobody chose", "s'e zgjodhi askush", "niemand wählte")],
      lead: x(
        "Nan Hu, Paul Pavlou and Jennifer Zhang collected Amazon reviews of 32,878 books, 17,978 DVDs and 28,983 videos in 2005. Ratings piled up at five stars, with a smaller heap at one and little between: a J. Then they gave one music CD to 66 students and asked every one of them to rate it.",
        "Nan Hu, Paul Pavlou dhe Jennifer Zhang mblodhën vlerësimet e Amazon për 32.878 libra, 17.978 DVD dhe 28.983 video më 2005. Vlerësimet grumbulloheshin te pesë yjet, me një grumbull më të vogël te njëshi dhe pak në mes: një J. Pastaj u dhanë një CD muzike 66 studentëve dhe i kërkuan secilit ta vlerësonte.",
        "Nan Hu, Paul Pavlou und Jennifer Zhang sammelten 2005 Amazon-Bewertungen zu 32.878 Büchern, 17.978 DVDs und 28.983 Videos. Die Bewertungen häuften sich bei fünf Sternen, mit einem kleineren Haufen bei einem und wenig dazwischen: ein J. Dann gaben sie 66 Studierenden eine Musik-CD und baten jeden, sie zu bewerten."),
      blocks: [
        { type: "hbars", max: 100, source: ["reviews-hu-2007"],
          label: x("Share of Amazon reviews at four or five stars, 2005", "Pjesa e vlerësimeve në Amazon me katër ose pesë yje, 2005", "Anteil der Amazon-Bewertungen mit vier oder fünf Sternen, 2005"),
          items: [
            { k: x("Books", "Libra", "Bücher"), v: 78, n: pc(78), alert: true },
            { k: x("DVDs", "DVD", "DVDs"), v: 73, n: pc(73) },
            { k: x("Videos", "Video", "Videos"), v: 72, n: pc(72) },
          ] },
        { type: "p", text: x(
          "60 students answered. Their ratings formed a bell around the middle, mean 3.12; on Amazon the same CD averaged 3.54, with over 60% of reviews at one or five stars, against under 10% among the students. Most products also had few voices: 78% of the books had fewer than 20 reviews.",
          "U përgjigjën 60 studentë. Vlerësimet e tyre formuan një kambanë rreth mesit, mesatarja 3,12; në Amazon i njëjti CD kishte mesatare 3,54, me mbi 60% të vlerësimeve me një ose pesë yje, kundrejt nën 10% te studentët. Shumica e produkteve kishin edhe pak zëra: 78% e librave kishin më pak se 20 vlerësime.",
          "60 Studierende antworteten. Ihre Bewertungen bildeten eine Glocke um die Mitte, Mittelwert 3,12; auf Amazon hatte dieselbe CD im Mittel 3,54, mit über 60 % der Bewertungen bei einem oder fünf Sternen, gegen unter 10 % bei den Studierenden. Die meisten Produkte hatten zudem wenige Stimmen: 78 % der Bücher hatten weniger als 20 Bewertungen.") },
        { type: "callout", reading: true, text: x(
          "Those who buy already like the product, and those who write are the delighted and the angry. The ordinary customer mostly stays silent.",
          "Ata që blejnë e pëlqejnë tashmë produktin, dhe ata që shkruajnë janë të kënaqurit e të zemëruarit. Klienti i zakonshëm kryesisht hesht.",
          "Wer kauft, mag das Produkt schon, und wer schreibt, ist begeistert oder verärgert. Der gewöhnliche Kunde schweigt meist.") },
      ],
      note: x(
        "Hu, Pavlou & Zhang (2007), working paper; Amazon data February to July 2005; bars are shares of all reviews in each category. The authors call the two causes purchasing bias and under-reporting bias. One CD and students: limits they name themselves.",
        "Hu, Pavlou & Zhang (2007), punim pune; të dhëna të Amazon shkurt deri korrik 2005; shiritat janë pjesë e të gjitha vlerësimeve të çdo kategorie. Autorët i quajnë dy shkaqet paragjykim i blerjes dhe paragjykim i mosraportimit. Një CD dhe studentë: kufij që i emërtojnë vetë.",
        "Hu, Pavlou & Zhang (2007), Arbeitspapier; Amazon-Daten Februar bis Juli 2005; Balken sind Anteile an allen Bewertungen der Kategorie. Die Autoren nennen die zwei Ursachen Kaufverzerrung und Untermeldungsverzerrung. Eine CD und Studierende: Grenzen, die sie selbst nennen."),
      source: ["reviews-hu-2007"],
    },
    {
      id: "measure",
      kicker: x("How it is measured", "Si matet", "Wie es gemessen wird"),
      title: [x("Count, spread,", "Numri, shpërndarja,", "Anzahl, Verteilung"), x("and the fakes", "dhe të rremet", "und die Fälschungen")],
      lead: x(
        "Michael Luca and Georgios Zervas studied 316,415 Yelp reviews of 3,625 Boston restaurants, 2004 to 2012. Yelp's filter had set aside about 16% as suspicious. Filtered reviews were more extreme; restaurants with few reviews or recent bad ones were more likely to commit fraud, chains less so.",
        "Michael Luca dhe Georgios Zervas studiuan 316.415 vlerësime në Yelp për 3.625 restorante të Bostonit, 2004 deri 2012. Filtri i Yelp kishte lënë mënjanë rreth 16% si të dyshimta. Vlerësimet e filtruara ishin më ekstreme; restorantet me pak vlerësime ose me vlerësime të këqija së fundmi kishin më shumë gjasa të mashtronin, zinxhirët më pak.",
        "Michael Luca und Georgios Zervas untersuchten 316.415 Yelp-Bewertungen zu 3.625 Bostoner Restaurants, 2004 bis 2012. Yelps Filter hatte rund 16 % als verdächtig aussortiert. Gefilterte Bewertungen waren extremer; Restaurants mit wenigen oder frisch schlechten Bewertungen betrogen eher, Ketten seltener."),
      blocks: [
        { type: "figures", compact: true, items: [
          { n: x("79% : 19%", "79% : 19%", "79 % : 19 %"), t: x("of reviews filtered at businesses caught soliciting fake reviews, against the average Boston restaurant", "e vlerësimeve të filtruara te bizneset e kapura duke kërkuar vlerësime të rreme, kundrejt restorantit mesatar të Bostonit", "gefilterte Bewertungen bei Betrieben, die beim Anwerben falscher Bewertungen ertappt wurden, gegen das durchschnittliche Bostoner Restaurant") },
        ] },
        { type: "rows", compact: true, items: [
          { h: x("Count", "Numri", "Anzahl"), p: x("how many this month, and the total behind the average", "sa këtë muaj, dhe totali pas mesatares", "wie viele diesen Monat, und die Gesamtzahl hinter dem Durchschnitt") },
          { h: x("Spread", "Shpërndarja", "Verteilung"), p: x("the share of ones and twos, and of fives, not only the mean", "pjesa e njëshave dhe dyshave, dhe e pesësheve, jo vetëm mesatarja", "der Anteil der Einsen und Zweien und der Fünfen, nicht nur der Mittelwert") },
          { h: x("Recent, not lifetime", "Të fundit, jo të gjitha", "Aktuell, nicht gesamt"), p: x("the month against the last three; the lifetime average moves slowly", "muaji kundrejt tre të fundit; mesatarja e përgjithshme lëviz ngadalë", "der Monat gegen die letzten drei; der Gesamtdurchschnitt bewegt sich langsam") },
          { h: x("Who wrote", "Kush shkroi", "Wer schrieb"), p: x("filtered Boston reviewers had written 10 reviews on average, published ones 137", "vlerësuesit e filtruar në Boston kishin shkruar 10 vlerësime mesatarisht, të publikuarit 137", "gefilterte Bostoner Rezensenten hatten im Mittel 10 Bewertungen geschrieben, veröffentlichte 137") },
        ] },
      ],
      note: x(
        "Luca & Zervas (2016), accepted version of 2015. The filter is a proxy for fakes, with errors both ways; the sting covered 126 US businesses flagged by Yelp in the 90 days to March 2014. The fields are the editors' proposal. Top-2-box is in No. 32, Goodhart's law in No. 43.",
        "Luca & Zervas (2016), versioni i pranuar i 2015-s. Filtri është tregues i përafërt për të rremet, me gabime në të dy drejtimet; kurthi përfshiu 126 biznese amerikane të shënuara nga Yelp në 90 ditët para marsit 2014. Fushat janë propozim i redaksisë. Top-2-box është te Nr. 32, ligji i Goodhart-it te Nr. 43.",
        "Luca & Zervas (2016), angenommene Fassung von 2015. Der Filter ist ein Näherungswert für Fälschungen, mit Fehlern in beide Richtungen; die Testaktion umfasste 126 US-Betriebe, die Yelp in den 90 Tagen bis März 2014 markierte. Die Felder sind ein Vorschlag der Redaktion. Top-2-Box steht in Nr. 32, Goodharts Gesetz in Nr. 43."),
      source: ["reviews-luca-zervas-2016"],
    },
    {
      id: "tool", tool: "/tools/guest-complaints/", more: "the-angry-guest-at-2am",
      kicker: x("Tool of the issue", "Mjeti i numrit", "Werkzeug der Ausgabe"),
      title: [x("The monthly", "Karta mujore", "Die Monatskarte"), x("review card", "e vlerësimeve", "der Bewertungen")],
      lead: x(
        "Once a month, read the reviews as a complaint log, not a score: count them, look at the spread, sort the low ones by what went wrong and check whether the desk heard it first. The Guest Complaints tool turns categories into a Pareto and finds the rooms that complain twice.",
        "Një herë në muaj, lexoji vlerësimet si regjistër ankesash, jo si rezultat: numëroji, shiko shpërndarjen, rendit të ulëtat sipas asaj që shkoi keq dhe kontrollo nëse recepsioni e dëgjoi i pari. Mjeti Guest Complaints i kthen kategoritë në Pareto dhe gjen dhomat që ankohen dy herë.",
        "Einmal im Monat die Bewertungen als Beschwerdebuch lesen, nicht als Wert: zählen, die Verteilung ansehen, die schlechten nach Ursache ordnen und prüfen, ob die Rezeption es zuerst hörte. Das Werkzeug Guest Complaints macht aus Kategorien ein Pareto und findet die Zimmer, die zweimal klagen."),
      blocks: [
        { type: "form", items: [
          { h: x("Month, platform, count", "Muaji, platforma, numri", "Monat, Plattform, Anzahl"), hint: x("new reviews this month; the total behind the average", "vlerësimet e reja këtë muaj; totali pas mesatares", "neue Bewertungen diesen Monat; die Gesamtzahl hinter dem Durchschnitt") },
          { h: x("Average and spread", "Mesatarja dhe shpërndarja", "Durchschnitt und Verteilung"), hint: x("share of ones and twos, share of fives; against the last three months", "pjesa e njëshave e dyshave, pjesa e pesësheve; kundrejt tre muajve të fundit", "Anteil Einsen und Zweien, Anteil Fünfen; gegen die letzten drei Monate") },
          { h: x("What the low ones say", "Çfarë thonë të ulëtat", "Was die schlechten sagen"), hint: x("in the guest's words, one category each", "me fjalët e mysafirit, një kategori secila", "in den Worten des Gastes, je eine Kategorie") },
          { h: x("Heard at the desk first?", "U dëgjua më parë në recepsion?", "Zuerst an der Rezeption gehört?"), hint: x("in the complaint log or not; if not, why not", "në regjistrin e ankesave apo jo; nëse jo, pse", "im Beschwerdebuch oder nicht; wenn nicht, warum") },
          { h: x("Fixed, and answered", "E rregulluar, dhe e përgjigjur", "Behoben und beantwortet"), hint: x("who fixes the cause, by when; who replies to the review", "kush e rregullon shkakun, deri kur; kush i përgjigjet vlerësimit", "wer die Ursache behebt, bis wann; wer die Bewertung beantwortet") },
        ] },
      ],
      note: x(
        "The card is the editors' proposal, not a tested method, built on the three sources' warnings about count, spread and who wrote. In the editors' view a review score should not become a staff target. The essay linked below gives the author's way of writing a complaint down in the guest's words.",
        "Karta është propozim i redaksisë, jo metodë e provuar, e ndërtuar mbi paralajmërimet e tri burimeve për numrin, shpërndarjen dhe kush shkroi. Sipas redaksisë, rezultati i vlerësimeve nuk duhet të bëhet objektiv për stafin. Eseja e lidhur më poshtë jep mënyrën e autorit për të shkruar një ankesë me fjalët e mysafirit.",
        "Die Karte ist ein Vorschlag der Redaktion, keine erprobte Methode, gestützt auf die Warnungen der drei Quellen zu Anzahl, Verteilung und Verfassern. Nach Ansicht der Redaktion sollte ein Bewertungswert kein Ziel für das Personal werden. Der unten verlinkte Essay zeigt, wie der Autor eine Beschwerde in den Worten des Gastes festhält."),
      source: ["reviews-luca-2016", "reviews-hu-2007", "reviews-luca-zervas-2016"],
    },
    { id: "sources", type: "sources" },
    { id: "back", type: "back" },
  ],
};
