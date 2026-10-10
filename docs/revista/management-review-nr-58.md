# Management Review Nr. 58 · Ligji i Little-it: puna në proces, koha dhe ritmi

Blloku: KPI. Të dhënat janë te `lib/weekly/issues/58.js`.

Artikulli i Little-it i 1961 (PDF në faqen e MIT) dhe artikulli i tij i 2011 për 50-vjetorin (PDF i plotë, kopje në
faqen e një kursi të UMass Amherst) u lexuan të plotë; të dhënat bibliografike u kontrolluan edhe te Crossref, IDEAS/RePEc
dhe INFORMS. Libri Factory Physics i Hopp-it dhe Spearman-it nuk u pa: përkufizimet e tij i marrim nga citimi te Little-i
(2011), dhe shembullin Penny Fab nga sllajdet e dy inxhinierëve të Intel-it në konferencën e IIE (maj 2008), të botuara
nga Factory Physics Inc. Faqet e Scribd me sllajdet e librit nuk u hapën, ndaj termi i librit "practical worst case" nuk
hyn: përdorim etiketën e sllajdeve, "with variability". Për studimin e Sjøberg-ut (2018) u lexua vetëm abstrakti
(Semantic Scholar, Crossref); për artikullin për CONWIP (1990) vetëm abstrakti i ribotuar nga Project Production
Institute, sepse faqja e Taylor & Francis ktheu 403. Rastet e urgjencave, të njësisë së vëzhgimit dhe të serverit
vijnë vetëm nga rrëfimi i Little-it (2011), që i mori nga bisedat me njerëzit e përfshirë; nuk janë studime të
pavarura dhe kështu thuhet në faqe. Tabelat zyrtare të spitaleve në Gjermani (Destatis) do të ishin shembull i mirë i
ligjit me të dhëna reale, por PDF-të e Statistische Bibliothek dhe GENESIS nuk u hapën nga ambienti i punës; i lamë
jashtë. Për Shqipërinë nuk u gjet asnjë shifër.

## Tabela e fakteve

| Shifra ose fakti | Burimi | Statusi |
|---|---|---|
| John D. C. Little, "A Proof for the Queuing Formula: L = λW", Operations Research 9(3), 1961, 383–387; marrë më 9 nëntor 1960. Nëse tri mesataret janë të fundme, proceset rreptësisht stacionare dhe procesi i mbërritjeve metrikisht transitiv me mesatare jo zero, atëherë L = λW. L = numri mesatar i njësive në sistem, W = koha mesatare në sistem, 1/λ = koha mesatare mes dy mbërritjeve. Morse (1958) kishte dhënë një argument besueshmërie | Little, 1961 | U konfirmua te teksti i plotë (PDF në fisherp.mit.edu) dhe te Crossref (DOI 10.1287/opre.9.3.383) |
| Little, "Little's Law as Viewed on Its 50th Anniversary", Operations Research 59(3), maj–qershor 2011, 536–549 (OR Forum) | Little, 2011 | U konfirmua te PDF-ja e plotë (kopje te people.cs.umass.edu) dhe te IDEAS/RePEc; faqja e INFORMS kërkon abonim |
| Rrëfimi: në 1957–1962 Little jepte mësim për kërkimin operacional në Case Institute of Technology në Cleveland, me librin e Morse-it (1958). Në klasë tha se formula L = λW që dilte vazhdimisht dukej shumë e përgjithshme; pas mësimit studenti Sid Hess pyeti: "How hard would it be to prove it in general?" Little: "I guess it shouldn't be too hard." Pastaj: "Famous last words." E punoi gjatë verëve në Nantucket dhe e dërgoi te Operations Research; u pranua | Little, 2011, seksioni 5 | U konfirmua te teksti. Citimet janë të shkurtra; përkthimet janë tonat. Pyetja e Hess-it jepet me parafrazim |
| Për provën duken të mos nevojiten supozime të hollësishme për kohët mes mbërritjeve, kohët e shërbimit, numrin e shërbyesve dhe radhën e shërbimit; ligji nuk varet nga disiplina e radhës | Little, 2011, seksionet 2.1.4 dhe 5 | U konfirmua te teksti. Në faqe: "cilado qoftë mënyra si mbërrijnë njësitë, kohët e shërbimit apo radha e shërbimit" |
| Shpjegimi fizik: një njeri në radhë numërohet dhe në të njëjtën kohë mbledh minuta pritjeje; prandaj e njëjta sipërfaqe jep të dy mesataret | Little, 2011, seksionet 2.1.3 dhe 4.3.1 | U konfirmua te teksti |
| Në 2011 Little e provon ligjin për çdo periudhë të fundme [0, T], edhe kur sistemi nuk është bosh në fillim dhe në fund (LL.1, LL.2); në praktikë vlen saktësisht, pas faktit, për të dhënat e periudhës; nuk kërkon proces stacionar | Little, 2011, seksioni 2 | U konfirmua te teksti |
| Në operacione, Hopp dhe Spearman e shkruajnë TH = WIP/CT. Throughput: "the average output of a production process … per unit time"; WIP: "the inventory between the start and end points of a product routing"; CT: "the average time from release of a job at the beginning of the routing until it reaches an inventory point at the end of the routing" | Hopp & Spearman, Factory Physics, botimi i 2-të, Irwin/McGraw-Hill, 2000, sipas Little-it (2011), seksioni 4.2 | U konfirmua vetëm te citimi i Little-it; libri nuk u pa. Në burime shënohet `via` |
| Për menaxherin e operacioneve rezultati vjen i pari, sepse është arsyeja e ekzistencës së operacionit; shpesh caktohet nga jashtë (porosi, shitje, parashikim) | Little, 2011, seksioni 4.2.2 (sipas Little & Graves, 2008) | U konfirmua te teksti |
| Tri përdorimet: kur di dy nga tre numrat, llogarit të tretin (përdorimi më i zakonshëm); tre numrat janë masa të ndryshme të performancës që ligji i lidh bashkë; nëse λ është i paracaktuar, e vetmja mënyrë për ta ulur L është ta ulësh W. Thirrja: menaxherët duhet të mendojnë t'i mbledhin dhe t'i shfaqin të tre masat; nëse diçka nuk shkon, me shumë gjasa do të duket te njëra prej tyre | Little, 2011, seksionet 2.3 dhe 4.3.2 | U konfirmua te teksti |
| Penny Fab: katër vegla të njëjta në seri (Punch, Stamp, Rim, Deburr), secila 2 orë për copë, pa ndryshueshmëri; punët lëshohen për të mbajtur një nivel të caktuar WIP (CONWIP). Koha e procesit 8 orë, ritmi i grykës 0,5 në orë; WIP kritik = RPT × BNR = 4 | Joan Tafoya & Tim Skowronski (Intel), "Factory Physics: A Fast Cycle Time Story", IIE Conference, maj 2008, sllajde të botuara nga Factory Physics Inc.; shembulli është i Hopp-it dhe Spearman-it | U konfirmua te PDF-ja (factoryphysics.com). Vlerat 8 dhe 0,5 dalin nga 4 × 2 orë dhe nga 2 orë për copë; 8 × 0,5 = 4 është llogaritja e redaksisë sipas formulës së sllajdeve |
| Tabela pa ndryshueshmëri: WIP 1–6 → TH 0,125; 0,250; 0,375; 0,500; 0,500; 0,500 dhe CT 8, 8, 8, 8, 10, 12 orë; TH × CT = WIP | Po aty | U konfirmua te sllajdet. Në grafik: WIP 2, 4, 6 → 8, 8, 12 |
| Tabela me ndryshueshmëri ("With Variability is Much Worse"): WIP 1–6 → TH 0,125; 0,200; 0,250; 0,286; 0,313; 0,333 dhe CT 8, 10, 12, 14, 16, 18 orë | Po aty | U konfirmua te sllajdet. Në grafik: WIP 2, 4, 6 → 10, 14, 18. Kopertina: 14 orë në vend të 8, në WIP 4. Sllajdet nuk thonë si modelohet ndryshueshmëria; nuk e shpjegojmë |
| Sjøberg (2018): rast studimi sasior në një kompani softueri, mbi 8.000 detyra pune gjatë katër vjetëve, nga pesë ekipe. WIP lidhet me kohën e kalimit (më pak WIP, kohë më të shkurtra), në përputhje me literaturën; WIP lidhet edhe me produktivitetin, në kundërshtim me pohimin se WIP i ulët e rrit produktivitetin. Kufiri optimal i WIP-it është i vështirë të caktohet; matja e produktivitetit ka kufizime | Dag I. K. Sjøberg, "An empirical study of WIP in kanban teams", ESEM 2018 (ACM/IEEE), DOI 10.1145/3239235.3239238 | U konfirmua vetëm abstrakti (Semantic Scholar, Crossref për titullin dhe vitin); teksti i plotë nuk u pa. Drejtimi i lidhjes me produktivitetin del nga abstrakti ("inconsistent with the claim … that a low WIP … will improve productivity") |
| Urgjencat: Mark Harris (2010) ndan mbërritjet me produktivitetin e mjekut për stafin minimal; shembulli: 2,5 pacientë në orë për mjek dhe 10 mbërritje në orë → 4 mjekë minimum. Radhët rriten ngadalë në fillim dhe shpejt kur mbërritjet i afrohen kapacitetit; rregull praktik 10–20% staf më shumë se minimumi | Little, 2011, seksioni 4.2.3(a), nga një bisedë me Harris-in | U konfirmua te teksti i Little-it. Artikulli i Harris-it (Emergency Physicians Monthly) nuk u pa. Shembulli me 2,5 dhe 10 është ilustrim i Little-it, jo matje |
| Provë ngarkese e një serveri të Intel-it (Microsoft FAST Search Farm, nëntor 2010): radha mesatare e kërkesave rritet afërsisht në mënyrë lineare, pastaj ngjitet pjerrët; pas rreth 18 kërkesave në sekondë, kërkesat e tjera në fakt hidhen. Leximi i Little-it (pas bisedës me Flynn-in): radhët e mëdha zënë memorie dhe e ngadalësojnë shërbimin ("queue-related overhead") | Little, 2011, seksioni 4.1.1 | U konfirmua te teksti. Leximi për ngadalësimin i atribuohet Little-it në faqe |
| Bill Lovejoy (Universiteti i Michigan-it), studim për njësinë e vëzhgimit në urgjencë: ligji si "reality check" për të dhënat spitalore që nuk përputhen | Little, 2011, seksioni 4.2.3(c); Lovejoy & Desmond, Academic Emergency Medicine 18 (2011) | U konfirmua te teksti i Little-it; artikulli i Lovejoy-t nuk u pa |
| CONWIP: sistem i ri prodhimi me tërheqje, me përparësi praktike ndaj sistemeve me shtytje dhe sistemeve të tjera me tërheqje, me argumente teorike dhe simulime. Mark L. Spearman, David L. Woodruff & Wallace J. Hopp, International Journal of Production Research 28(5), 1990, 879–894 | Spearman, Woodruff & Hopp, 1990 | Të dhënat bibliografike te Crossref; abstrakti te ribotimi i Project Production Institute (2018). Që punët lëshohen për të mbajtur WIP-in në një nivel të caktuar e thonë sllajdet e Intel-it (2008). Në faqe e quajmë "sistem që e mban konstante punën në proces të gjithë linjës", sipas emrit (CONstant Work In Process) dhe sllajdeve; rezultatet e simulimeve nuk hyjnë |

## Çfarë nuk hyri

- Tabelat e Destatis për spitalet gjermane (shtretër, raste, kohëzgjatja mesatare e qëndrimit, 1991 kundrejt viteve të
  fundit), që do ta tregonin ligjin me të dhëna zyrtare: PDF-të e Fachserie 12 Reihe 6.1.1 dhe tabela e GENESIS nuk u
  hapën. Vlerat e 1991 (665.565 shtretër, 14.576.613 raste, 14,0 ditë, 84,1%) u panë vetëm në një përmbledhje kërkimi,
  jo te burimi.
- Sjøberg, Johnsen & Solberg, "Quantifying the Effect of Using Kanban versus Scrum", IEEE Software 29(5), 2012: abstrakti
  (mbi 12.000 detyra pune) u konfirmua, por rezultatet (koha e kalimit, gabimet, produktiviteti) jo; përqindjet që
  qarkullojnë në blogje nuk hynë.
- Në sllajdet e kapitullit 8 të Factory Physics (kopje në Scribd, sipas kërkimit), Penny Fab arrin 95% të kapacitetit
  vetëm me 27 punë në "practical worst case"; formula e të njëjtit rast jep rreth 57. Mospërputhja nuk u zgjidh dhe
  sllajdet nuk u hapën: shifra nuk hyn.
- Termi "practical worst case" dhe formulat e Hopp-it dhe Spearman-it për rastin më të mirë dhe më të keq: vetëm te
  blogje (R-bloggers) dhe te përmbledhje kërkimi; libri nuk u pa.
- Rezultatet e Intel-it nga zbatimi i Factory Physics (sllajdi "Let's Start with the Results" është figurë pa tekst që
  lexohet): nuk dimë çfarë tregon, ndaj nuk japim asnjë rezultat.
- Studimi i Lovejoy-t dhe Desmond-it: njësi vëzhgimi me 14 shtretër, rreth 5,8 milionë dollarë të ardhura neto në vit,
  qëndrim mesatar 1,14 ditë. Të konfirmuara vetëm te Little-i (2011), si rrëfim; për vend përdorëm vetëm vërejtjen për
  kontrollin e të dhënave.
- Mike George dhe Lean Six Sigma (Little, 2011): kompani konsulence; rezultatet e klientëve janë pohime të saj, jo
  matje të pavarura.
- Formula VUT / Kingman dhe ligji i buferëve (inventar, kapacitet, kohë) te sllajdet e Intel-it: temë më vete, dhe
  ndryshueshmëria shihet tashmë te Nr. 25.
- Koha e procesit, koha e plotë dhe raporti i aktivitetit për çdo hap (Nr. 56), takt time (Nr. 53) dhe gryka e ngushtë
  (Nr. 54): nuk përsëriten.
- Shqipëria: nuk u gjet asnjë shifër.

## Çfarë është editoriale

- Leximet te kutitë "Leximi ynë": ligji nuk thotë si shkurtohet radha, por që radha, ritmi dhe pritja nuk drejtohen veç e
  veç; ndryshueshmëria nuk e prish ligjin, por e rrit çmimin; një tabelë që tregon vetëm të mbaruarat fsheh dy nga tre
  numrat; ngarkesa e plotë është vendi ku pritja nuk rritet më në vijë të drejtë.
- Hapat e matjes te faqja 7 dhe shembulli hipotetik i sportelit të kthimeve: numrat janë të shpikur.
- Karta te faqja 8 është praktikë e redaksisë, sipas Little-it (2011), Penny Fab-it dhe CONWIP-it.
- Lidhja me esenë "Ditët me shumë volum: standardi nën presion" (faqja 6, `high-volume-days`): eseja flet për ditët kur kërkesa e kaloi
  parashikimin dhe për kapacitetin që nuk është numri i njerëzve; nuk ka të dhëna për radhë, por është lidhja më e afërt
  e ndershme me faqen ku radhët rriten shpejt kur ngarkesa i afrohet kapacitetit.
- Lidhja me mjetin Delay Analyzer (faqja 8, `/tools/delay-analyzer/`): mat kohët e planifikuara dhe reale dhe ku nis
  vonesa; është mjeti i faqes më i afërt me kohën e kalimit, megjithëse nuk numëron punën në proces.
