# Management Review Nr. 53 · Takt time dhe koha e ciklit: ritmi i kërkesës

Blloku: KPI. Të dhënat janë te `lib/weekly/issues/53.js`.

Faqet e fjalorit të Lean Enterprise Institute (Takt Time, Cycle Time, Pitch, Operator Balance Chart, Yamazumi Board,
Takt Image, Pacemaker Process), artikulli i IndustryWeek dhe tri artikujt e konferencës IGLC (Haghsheno et al. 2016,
Frandson et al. 2013 në PDF nga iglc.net; Lehtovaara et al. 2019 në PDF nga depoja e Aalto-s) u hapën dhe u lexuan nga
ambienti i punës. Tre burimet kandidate të planit nuk u konfirmuan dot: libri i Ohno-s (Toyota Production System, 1988)
nuk u gjet në asnjë kopje të hapur dhe asnjë fragment për takt-in nuk u konfirmua te një burim i besueshëm; teksti i
Learning to See (Rother & Shook) nuk u pa (faqja e LEI jep vetëm përshkrimin e librit, pa takt-in), dhe shifrat e rastit
Acme Stamping u gjetën vetëm në materiale studimi të pavarura që nuk përputhen me njëra-tjetrën (46 ose 45 sekonda);
për më tepër, rasti Acme i përket hartës së rrjedhës së vlerës, që është tema e Nr. 56. Edhe Creating Continuous Flow
(Rother & Harris) nuk u pa: pjesët e librit te LEI jepen vetëm pas një formulari. Prandaj numri mbështetet te fjalori i
LEI për përkufizimet, te një përmbledhje akademike për historinë, te një rast praktik i raportuar nga drejtuesi i tij
për balancimin e linjës, dhe te dy raste studimore nga ndërtimi për takt-in jashtë fabrikës. Të tri rastet janë raste
të vetme, të raportuara nga vetë autorët; kjo thuhet në shënimet e faqeve. Për Shqipërinë nuk u gjet asnjë shifër.

## Tabela e fakteve

| Shifra ose fakti | Burimi | Statusi |
|---|---|---|
| Takt time është koha e prodhimit në dispozicion e pjesëtuar me kërkesën e klientit. Shembulli: një fabrikë që punon 480 minuta në ditë, me kërkesë 240 njësi në ditë, ka takt prej dy minutash. Qëllimi është ta përputhë prodhimin me kërkesën; takt-i "provides the heartbeat of a lean production system" | Lean Enterprise Institute, Lean Lexicon, "Takt Time" | U konfirmua te faqja e LEI (lexuar me WebFetch dhe me curl). Faqja nuk ka datë; si te hyrjet e tjera të fjalorit (`lei-lexicon`, `lei-gemba-walk`), shënohet viti 2014 |
| "Takt is German for a precise interval of time such as a musical meter." Takt-i u përdor së pari si mjet i menaxhimit të prodhimit në industrinë gjermane të avionëve në vitet 1930: intervali në të cilin avionët kalonin te stacioni tjetër. U përdor gjerësisht brenda Toyota-s në vitet 1950 dhe te furnitorët e saj nga fundi i viteve 1960 | Po aty | U konfirmua te faqja e LEI. "Furnitorët" përkthen "supply base" |
| Toyota zakonisht e rishikon takt-in e një procesi çdo muaj, me një rishikim rregullues çdo 10 ditë | Po aty | U konfirmua te faqja e LEI. E japim si "sipas institutit" |
| Dokumentet e një kantieri të arsenalit të Venecias në shekullin XVI përshkruajnë një prodhim të qëndrueshëm me takt të anijeve tregtare dhe luftarake; në 1913, në Detroit, Ford-i ishte i pari që futi prodhimin masiv të automobilave me linja prodhimi; në industri të tjera takt-i u përdor për herë të parë në aviacionin gjerman, për të sinkronizuar lëvizjen e trupave të avionëve | Shervin Haghsheno, Marco Binninger, Janosch Dlouhy & Simon Sterlike, "History and Theoretical Foundations of Takt Planning and Takt Control", Proceedings IGLC-24, Boston, 2016, f. 53–62 | U konfirmua te PDF-ja e iglc.net. Për Venecian artikulli citon "Das Arsenal von Venedig", për Ford-in një emision të 3sat (2014); këto burime nuk u panë, ndaj në shënimin e faqes themi që të dyja ndjekin përmbledhjen e Haghsheno et al. Në vijën kohore shkruajmë "linja e prodhimit", jo "linja lëvizëse", sepse artikulli nuk e thotë |
| Përdorimi i parë i regjistruar i takt time në ndërtimin e godinave: ndërtesa Empire State, Nju Jork, 1930 (plane kohore sipas vendndodhjes, me hapa pune të përcaktuar në kohë) | Po aty (citon Willis & Friedman, 1998) | U konfirmua te PDF-ja. Burimi i Haghsheno-s nuk u pa; në tekst e japim si "një përmbledhje e Haghsheno-s dhe kolegëve e quan…" |
| Rasti i një linje (2016): tetë operatorë, takt 5,2 minuta, diferenca mes operatorit më pak dhe më shumë të ngarkuar "exactly four minutes", balancimi i linjës 64%. Pas ndryshimit: dy linja me nga tre operatorë, secila me takt 10,5 minuta ("we could run two lines at a takt time of 10.5 minutes instead of one line with a takt time of 5.2 minutes"), diferenca nën një minutë, balancimi 93%. Koha e përgjithshme e pritjes ("total compounded waiting time") nga 16 minuta në më pak se dy, "an 87% reduction"; prodhimi +38%; puna në proces mes operacioneve nga disa njësi në një. U ndihmua nga "targeted training and process kaizen" | Curt Knoll, "Operator Balance: Why Waiting Is the Worst of the Wastes", IndustryWeek, 1 nëntor 2016 | U konfirmua te teksti i artikullit (curl dhe WebFetch). Autori e quan "an actual recent project", pa emër kompanie dhe pa produkt. Artikulli nuk shpjegon si u llogaritën balancimi dhe prodhimi; kjo thuhet në shënimin e faqes. Autori përshkruhet si "former manager of continuous improvement" në një kompani amerikane; emrin e kompanisë nuk e japim, sepse artikulli nuk thotë që projekti ishte aty |
| Përgatitja e matjes së kohës sipas Knoll-it: llogarit takt-in para se të marrësh kronometrin; ec linjën nga fundi në fillim dhe nga fillimi në fund; shëno hapat në një fletë vëzhgimi të kohës; thuaji ekipit që nuk i mat për t'i shpejtuar dhe që të punojnë "at their normal pace"; caktoni pika të qarta nisjeje dhe ndalimi, sepse vëzhguesit e nisin dhe e ndalin orën ndryshe ("we actually proved this out performing a Gage R&R"); të paktën 10 matje për çdo hap, 20 janë më mirë; pastaj grafiku me shtylla të mbivendosura për çdo operator | Po aty | U konfirmua te teksti. Hapat te faqja 7 janë përmbledhje e jona, me fjalët tona |
| Koha e ciklit: "the time required to produce a part or complete a process, as timed by actual measurement". Koha e ciklit të operatorit: koha që i duhet operatorit për të gjitha elementet e punës në një stacion para se t'i përsërisë, "as timed by direct observation". Koha e ciklit të makinës: koha që i duhet makinës për të gjitha operacionet mbi një copë | Lean Enterprise Institute, Lean Lexicon, "Cycle Time" | U konfirmua te faqja e LEI |
| Koha efektive e ciklit të makinës: koha e ciklit + ngarkimi e shkarkimi + koha e ndërrimit e pjesëtuar me copat mes ndërrimeve. Shembulli: 20 + 30 + (30/30) = 51 sekonda | Po aty | U konfirmua te faqja e LEI. Teksti i faqes shkruan "20+30+(30/30) or 1 = 51 seconds", gabim shtypi; llogaria (20 + 30 + 1 = 51) është e saktë. Në revistë shkruajmë "një ndërrim 30 sekondash çdo 30 copë" |
| Pitch: koha që i duhet një zone prodhimi për të bërë një kontejner produktesh; "takt time x pack-out quantity = pitch"; shembulli: 1 minutë × 20 copë = pitch prej 20 minutash | Lean Enterprise Institute, Lean Lexicon, "Pitch" | U konfirmua te faqja e LEI |
| Grafiku i balancimit të operatorëve (operator balance chart, yamazumi): shtylla vertikale për punën e çdo operatori përballë takt-it, të ndërtuara nga elementet e punës; qëllimi është të ulet numri i operatorëve duke e bërë punën e secilit "very nearly equal to, but slightly less than, takt time". Yamazumi në japonisht do të thotë "grumbull" ose "stivë" | Lean Enterprise Institute, Lean Lexicon, "Operator Balance Chart" dhe "Yamazumi Board" | U konfirmua te faqet e LEI. Kuptimi i fjalës yamazumi nuk hyri në tekst për vend |
| Spitali Anderson Lucchetti Women's and Children's Center, Sacramento: 8 kate, 242 shtretër. Puna e jashtme (karkasa, dritaret, skelat, veshja, dy shtresa hidroizolimi, riparimet) u nda në zona me një takt prej katër ditësh; karkasa ishte shumë më e ngadaltë dhe mori një ekip të dytë (një ekip dritaresh për dy ekipe karkase). Plani tradicional: 11 muaj për përfundimin e pjesshëm të pjesës së jashtme; me takt: 5,5 muaj (abstrakti), "5 months" (rezultatet dhe përfundimi) | Adam Frandson, Klas Berghede & Iris D. Tommelein, "Takt Time Planning for Construction of Exterior Cladding", Proceedings IGLC-21, Fortaleza, 2013, f. 527–536 | U konfirmua te PDF-ja e iglc.net. Mospërputhja 5,5/5 muaj thuhet në shënimin e faqes; grafiku përdor 5,5 nga abstrakti. Lehtovaara et al. (2019) e citojnë si "reduced production duration by 55%"; ne nuk e japim këtë përqindje. Rritja e ritmit u arrit edhe pse në punë u shtuan çatia e përkohshme dhe kalimi në panele |
| Pas vendosjes së takt-it 4-ditor, tri planet e para të prodhimit nuk u mbajtën; çdo plan tjetër u mbajt. Mësimet: sfida numër një ishte komunikimi i planit; takt-i kërkoi disiplinë dhe shkaktoi stres te kryepunëtorët; citimi "if the building process is not well-understood, then all the Takt time adds is stress"; ekipi në fillim "added time onto the Takt time" | Po aty | U konfirmua te PDF-ja. Përkthimi i citimit është i yni |
| Helsinki: pallat shtatëkatësh me 42 apartamente; takt prej një dite për apartament (lyerja dhe niveli i mureve me takt një javor); faza e brendshme e planifikuar 18 javë; "the cycle time of the internal construction phase was reduced radically by two months (nearly 30%)", me një rritje të lehtë të kostove direkte dhe pa ulje të cilësisë; javët e para "quite chaotic", faza "partially restarted"; takt-i një ditor "caused some stress for the subcontractors". Studim cilësor, një rast i vetëm, 14 intervista | Joonas Lehtovaara, Iina Mustonen, Petteri Peuronen, Olli Seppänen & Antti Peltokorpi, "Implementing Takt Planning and Takt Control Into Residential Construction", Proceedings IGLC-27, Dublin, 2019, f. 417–428, DOI 10.24928/2019/0118 | U konfirmua te PDF-ja (versioni i botuar, depoja e Aalto University) |

## Çfarë nuk hyri

- Taiichi Ohno, Toyota Production System (1988): libri nuk u pa dhe nuk u gjet asnjë fragment i konfirmuar për takt-in
  (as formula e Ohno-s, as citimet që qarkullojnë në internet). Burimi `ohno-1988` nuk përdoret.
- Rother & Shook, Learning to See (LEI; 1998 sipas disa burimeve, çmimi Shingo 1999 sipas LEI): përkufizimi i tyre i
  takt-it dhe udhëzimi "produce to your takt time" nuk u panë në tekst. Rasti Acme Stamping (27.600 sekonda në turn,
  460 copë, takt 60 sekonda; kohët e ciklit 39, 46 ose 45, 62, 40 sekonda) u gjet vetëm në materiale studimi që nuk
  përputhen, dhe i përket hartës së rrjedhës së vlerës (Nr. 56). E lamë jashtë.
- Rother & Harris, Creating Continuous Flow (LEI, 2001): "koha më e ulët e përsëritshme" dhe formula "puna gjithsej ÷
  takt = numri i operatorëve" nuk u konfirmuan te libri. Llogaria e njerëzve te faqet 5 dhe 8 shënohet si llogari e
  redaksisë.
- Rruga e takt-it nga Junkers te Mitsubishi në Nagoya (1942–1943) dhe pastaj te Toyota: vetëm te blogu i Michel
  Baudin-it dhe te Vorne (oee.com), të cilët vetë thonë se zinxhiri nuk është i dokumentuar. Haghsheno et al. e
  përmendin bashkëpunimin me Mitsubishi-n duke cituar lean.org (2015), por faqja e sotme e LEI nuk e thotë. E lamë jashtë.
- Porsche me takt rreth pesë minuta dhe shkritorja Wolfensberger me 50% më pak kohë kalimi: vetëm si citime te
  Haghsheno et al. (Friedrich 2013; Reusser 2013), burimet nuk u panë.
- Rastet e tjera në tabelën e Lehtovaara et al. (Binninger et al. 2018, 70%; Dlouhy et al. 2016, 45%): vetëm si
  citime, nuk u panë.
- Shembulli i Toyota-s në Georgetown (55 sekonda për sediljen e Camry-t) është te Nr. 35; nuk përsëritet.
- Fjalët e Art Byrne-it te faqja e LEI ("Takt time is therefore what sets the tone for everything else"): të konfirmuara,
  por i lamë jashtë për vend.
- Takt image (LEI; takt 1 minutë, paketa me 20 copë, 20 minuta) mbulohet nga pitch-i; procesi pacemaker i përket Nr. 56.
- Koha e kalimit (lead time) dhe harta e rrjedhës së vlerës: tema e Nr. 56. Tetë humbjet (Nr. 5), puna standarde
  (Nr. 35) dhe OEE (Nr. 48) nuk përsëriten.
- Shqipëria: nuk u gjet asnjë shifër për takt-in ose balancimin e linjave.

## Çfarë është editoriale

- Leximet te kutitë "Leximi ynë": takt-i nuk është shpejtësi që u kërkohet njerëzve; pritja duket te grafiku i
  balancimit, jo te raporti; kur kërkesa kalon parashikimin, takt-i shkurtohet dhe hapat pak nën të mbeten të parët pas.
- Shembulli hipotetik i paketimit të kolive te faqja 5 (450 minuta, 900 koli, takt 30 sekonda, katër hapa): numrat janë
  të shpikur. Llogaritë: 27.000 s ÷ 900 = 30 s; 900 × 34 s = 30.600 s, pra 3.600 s (një orë) më shumë se turni;
  26 + 11 + 34 + 9 = 80 s, 80 ÷ 30 = 2,7.
- Fleta e punës për takt-in te faqja 8 është praktikë e redaksisë, mbi përkufizimet e LEI dhe matjen e kohës te Knoll-i.
- Lidhja me esenë "High-volume days" (faqja 5) dhe me mjetin Sigma & Control Chart (faqja 8), që vizaton matjet e kohës
  së ciklit dhe shpërndarjen e tyre.
