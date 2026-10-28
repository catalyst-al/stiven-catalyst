# Management Review Nr. 78 · Drejtuesi etik

Blloku: Roli. Të dhënat janë te `lib/weekly/issues/78.js`.

Ky numër u kontrollua në kushte më të kufizuara se numrat e mëparshëm, dhe kjo duhet thënë qartë. Nga ambienti i punës
(10 tetor 2026) WebFetch ktheu gabim DNS (`getaddrinfo ENOTFOUND`) për çdo adresë që provuam: kopjet PDF të Brown et al.
(2005) te eclass.uoa.gr dhe apps.it.purdue.edu, PDF-ja e Mayer et al. (2009) te ethicalsystems.org, PDF-ja e Treviño et al.
(2000) te homepages.se.edu, faqet e Penn State (pure.psu.edu), IDEAS/RePEc, përshtatja italiane e shkallës (cris.unibo.it)
dhe madje Wikipedia. curl u ndal nga proxy-ja (403). Prandaj **asnjë artikull nuk u lexua i plotë**. Çdo fakt më poshtë u
kontrollua përmes rezultateve të kërkimit në internet (WebSearch), që sjellin fragmente nga abstraktet e artikujve (CMR,
ScienceDirect, Springer, ProQuest, IDEAS, Penn State, Rutgers) dhe nga studime të mëvonshme që i citojnë ose i riprodhojnë.
Pas rreth tridhjetë kërkimesh u mbarua edhe kufiri i kërkimeve për këtë seancë, ndaj disa pika mbetën pa u kontrolluar dhe
janë te "Çfarë nuk hyri". Statusi i çdo rreshti thotë nga erdhi konfirmimi. Të gjitha studimet e përdorura janë anketa me
vlerësime të punonjësve: tregojnë lidhje, jo shkak; kjo thuhet në shënimet e faqeve. Për Shqipërinë dhe Gjermaninë nuk u
kërkua dhe nuk hyn asnjë shifër. Para printimit, mirë do të ishte që dikush me qasje në revista t'i krahasojë rreshtat e
shënuar "vetëm abstrakti" ose "vetëm përmbledhje" me tekstin e plotë.

Kontrolli i dytë, te tekstet e plota (12 tetor 2026). Paragrafi i mësipërm përshkruan punën e parë. Në kontrollin e dytë
u hapën të plotë tre artikuj, të gjithë në versionin e botuar: Treviño, Hartman & Brown (2000), skanimi i faqeve 128–142
të CMR (PDF te homepages.se.edu); Mayer et al. (2009), PDF-ja e botuesit (OBHDP 108, f. 1–13, te ethicalsystems.org); dhe
Brown, Treviño & Harrison (2005), PDF-ja e botuesit (OBHDP 97, f. 117–134, te eclass.uoa.gr). Këtyre të treve u hiqet
`via`. Nuk u hapën: Hoch et al. (2018; SAGE, ResearchGate 403, asnjë kopje e hapur), Ng & Feldman (2015; APA, depoja e
HKU pa skedar) dhe Bedi et al. (2016; Springer); ata mbajnë `via`. Teksti i plotë ndryshoi këto, në të tri gjuhët:
(1) Mayer et al. matën vetëm devijimin ndaj organizatës, jo ndaj kolegëve ("We focus specifically on organizational
deviance as opposed to interpersonal deviance"; shembujt e shkallës: "taking property from work without permission and
coming in late to work without permission", f. 6): shembulli "dëmtimi i kolegëve" i faqes 4 u zëvendësua me shembujt e
shkallës; (2) 904 janë përgjigjet e marra, ndërsa mostra përfundimtare ishte "891 employees and 195 supervisors from 195
departments in 160 organizations" (f. 6); kopertina mban 904 si abstrakti, shënimi i faqes 4 e thotë; (3) numri i
intervistave te Treviño et al. u gjet ("our 40 structured interviews (20 with senior executives and 20 with corporate
ethics officers)", f. 129) dhe hyn te shënimi i faqes 3; (4) matrica 2×2 është figura 2 e artikullit, jo vizatim i
redaksisë: shënimi i faqes 5 u ndreq; (5) artikulli thotë "talks the ethics talk" but does not "walk the ethics walk"
(f. 138): fjalia angleze e faqes 5 ndjek tani këtë formulim; (6) pyetjet e ELS vijnë nga tabela 3 e artikullit: shënimi i
faqes 7 u ndreq. Asnjë shifër tjetër e shtypur nuk doli ndryshe.

Shënim (27 tetor 2026), sipas historisë së git-it: kontrolli i dytë i 11 tetorit u bë para se numri të dilte online.
Ndryshimet e tij u bënë në degën e punës (commit 3565e02a, 11 tetor 2026) dhe numri hyri në main, nga ku botohet faqja,
vetëm me bashkimin #177 (7b43e7c3, 11 tetor 2026, ora 20:33): versioni i parë online i ka tashmë. Prandaj këto ndryshime
nuk kanë shënim korrigjimi dhe nuk e çojnë numrin te `checked.issues` (lib/weekly/common.js). Numri ndryshoi edhe më 12
tetor 2026, pasi kishte dalë online (de0466bb), dhe për këtë është te `checked.issues` dhe e thotë nën përmbledhjen e
vet.

## Tabela e fakteve

| Shifra ose fakti | Burimi | Statusi |
|---|---|---|
| Treviño, Hartman & Brown, "Moral Person and Moral Manager: How Executives Develop a Reputation for Ethical Leadership", California Management Review 42(4), 2000, f. 128–142, DOI 10.2307/41166057 | Penn State Research Portal; DePaul; scirp.org; CMR (cmr.berkeley.edu) | U konfirmua te teksti i plotë (skanimi i CMR, "VOL 42, NO. 4 SUMMER 2000", f. 128–142); DOI te Crossref |
| Artikulli bazohet në intervista me drejtues të lartë dhe zyrtarë të etikës në korporata ("Based on interviews with senior executives and corporate ethics officers") | Abstrakti (EBSCO, CMR) | U konfirmua te teksti i plotë (f. 129): "in our 40 structured interviews (20 with senior executives and 20 with corporate ethics officers)". **U ndreq** shënimi i faqes 3, që thoshte se numri nuk u pa; tani e jep |
| Reputacioni për drejtim etik mbështetet mbi dy shtylla: dukshmëria si njeri moral (tiparet, sjelljet, mënyra e vendimmarrjes) dhe si menaxher moral (shembulli, përdorimi i sistemit të shpërblimeve, komunikimi) | Abstrakti | U konfirmua te teksti i plotë, figura 1 "The Two Pillars of Ethical Leadership" (f. 131): Moral Person = Traits (Integrity, Honesty, Trustworthiness), Behaviors, Decision-Making; Moral Manager = Role Modeling Through Visible Action, Rewards and Discipline, Communicating About Ethics and Values. F. 130: "The traits that executives most often associate with ethical leadership are honesty, trustworthiness, and integrity" |
| Tri alternativat e drejtuesit etik: drejtuesi joetik, drejtuesi hipokrit ("talks the talk, but doesn't walk the walk") dhe drejtuesi etikisht neutral, që mund të jetë i ndershëm, por punonjësit nuk e dinë sepse etika dhe vlerat nuk janë pjesë e qartë e axhendës së tij | Abstrakti, siç e sjellin rezultatet e kërkimit; përmbledhje e mëvonshme në Executive Journal (Tajlandë) | U konfirmua te teksti i plotë (f. 137–138): "one may develop a reputation as an unethical leader, a hypocritical leader, or an ethically neutral leader"; hipokriti "talks the ethics talk" but does not "walk the ethics walk"; neutrali, sepse drejtuesi "has not proactively made ethics and values an explicit and evident part of the leadership agenda" (f. 130). **U ndreq** fjalia angleze e faqes 5 ("talks the ethics talk but does not walk the ethics walk", pa "in their words"); përkthimet në shqip dhe gjermanisht janë parafrazime dhe mbeten |
| Hipokriti: i fortë si menaxher moral, i dobët si njeri moral; neutrali: i dobët si menaxher moral, pavarësisht anës personale | Përmbledhje e mëvonshme (Executive Journal, so01.tci-thaijo.org) | U konfirmua te teksti i plotë, figura 2 "Executive Reputation and Ethical Leadership" (f. 137): boshti vertikal Moral Manager (Weak/Strong), horizontal Moral Person; hipokriti lart majtas, etiku lart djathtas, joetiku poshtë majtas, neutrali poshtë, me "?" në të dy anët e boshtit të njeriut moral ("not clearly unethical, but also not strongly ethical", f. 138). **U ndreq** shënimi i faqes 5: matrica është e artikullit; vetëm tekstet në kuti janë tonat |
| Mayer, Kuenzi, Greenbaum, Bardes & Salvador, "How low does ethical leadership flow? Test of a trickle-down model", Organizational Behavior and Human Decision Processes 108(1), 2009, f. 1–13, DOI 10.1016/j.obhdp.2008.04.002 | ScienceDirect; Rutgers; IDEAS; scirp.org | U konfirmua te PDF-ja e botuesit ("Organizational Behavior and Human Decision Processes 108 (2009) 1–13") |
| 904 punonjës dhe 195 menaxherë në 195 departamente | Abstrakti, siç e sjell rezultati i kërkimit | U konfirmua te teksti i plotë, me një saktësim: abstrakti (f. 1) "a sample of 904 employees and 195 managers in 195 departments"; metoda (f. 6): "We received and tabulated a total of 904 employees' responses out of 1915 surveys (47.2%) and 195 supervisors' responses out of 383 surveys (50.9%)", tetë departamente me një ose dy përgjigje u hoqën, "our final sample consisted of 891 employees and 195 supervisors from 195 departments in 160 organizations". Kopertina mban 904 siç e jep abstrakti; **u shtua** te shënimi i faqes 4 që u analizuan 891 |
| Drejtimi etik i drejtimit të lartë dhe ai i shefave lidheshin negativisht me devijimin në nivel grupi dhe pozitivisht me sjelljen qytetare (OCB) në nivel grupi; efektet e drejtimit të lartë mbi devijimin dhe OCB-në ndërmjetësoheshin nga drejtimi etik i shefave | Abstrakti | U konfirmua te teksti i plotë (f. 7–8): lidhje negative me devijimin e grupit dhe pozitive me OCB-në, si sipas shefave ashtu edhe sipas punonjësve; "supervisory ethical leadership fully mediated the relationship" (testet Sobel). OCB u mat me "five items measuring helping behavior" (f. 6): "më shumë ndihmë" qëndron. **U ndreq** shembulli i devijimit: studimi mati vetëm devijimin ndaj organizatës ("organizational deviance as opposed to interpersonal deviance", f. 3), me shembujt "taking property from work without permission and coming in late to work without permission" (f. 6); "dëmtimi i kolegëve" u hoq, faqja 4 jep tani shembujt e shkallës |
| Hoch, Bommer, Dulebohn & Wu, "Do Ethical, Authentic, and Servant Leadership Explain Variance Above and Beyond Transformational Leadership? A Meta-Analysis", Journal of Management 44(2), 2018, f. 501–529, DOI 10.1177/0149206316665461 | Semantic Scholar; EconBiz; scirp.org | Të dhënat bibliografike u konfirmuan |
| Korrelacionet e larta të drejtimit autentik dhe etik me drejtimin transformues, bashkë me variancën e vogël shtesë, sugjerojnë se dobia e tyre është e ulët, përveç pyetjeve shumë specifike | Abstrakti, siç e sjell rezultati i kërkimit | U konfirmua. Në faqe: "për shumicën e rezultateve shtonte pak" |
| ρ me drejtimin transformues: autentik 0,75, etik 0,70, shërbyes 0,52 | Hoch et al. (2018), siç i raportojnë rishikimet e mëvonshme (një artikull në Human Resource Development International, 2022, dhe një në Frontiers in Psychology, 2022) | Kontrolli i dytë: u konfirmua te teksti i plotë i Fuller et al. (2022, PMC9039396), tabelat 2–4, që riprodhojnë rreshtat e Hoch et al.: etik ρ = 0,70 (k = 20, N = 3.717, r̄ = 0,63), shërbyes ρ = 0,52 (k = 5, N = 774, r̄ = 0,47), autentik ρ = 0,75 (k = 10, N = 2.397, r̄ = 0,67); shënimi i tabelave: "ρ, r bar corrected for measurement error in both the predictor and the criterion". Tabela e Hoch-it vetë nuk u pa. Grafiku i faqes 6; burimi ka `via` dhe shënimi e thotë |
| Ng & Feldman, "Ethical leadership: Meta-analytic evidence of criterion-related and incremental validity", Journal of Applied Psychology 100(3), 2015, f. 948–965, DOI 10.1037/a0038246: 101 mostra nga 15 vitet e fundit, N = 29.620; besimi te drejtuesi ndërmjetësonte lidhjet me qëndrimet në punë dhe performancën; drejtimi etik parashikonte performancën në detyrë, sjelljen qytetare dhe sjelljen kundërproduktive "significantly, albeit weakly in some cases", edhe pasi u kontrolluan drejtimi transformues, shpërblimi i kushtëzuar, menaxhimi me përjashtim (management by exception), drejtësia ndërvepruese dhe drejtimi shkatërrues | Abstrakti (ProQuest, scite, Semantic Scholar; kontrolli i dytë: OpenAlex) | U konfirmua vetëm abstrakti; në kontrollin e dytë u lexua drejtpërdrejt, dhe lista e kontrolleve u plotësua me "management by exception". Asnjë koeficient i Ng & Feldman nuk hyn |
| Bedi, Alpaslan & Green, "A Meta-analytic Review of Ethical Leadership Outcomes and Moderators", Journal of Business Ethics 139(3), 2016, f. 517–536: drejtimi etik lidhet pozitivisht me shumë rezultate, mes tyre drejtësia ndërvepruese e perceptuar e drejtuesit dhe sjellja etike e ndjekësve; lidhet pozitivisht me drejtimin transformues dhe me shpërblimin e kushtëzuar; prova të përziera për paragjykimin e botimit; vendndodhja gjeografike moderonte disa lidhje; mostrat nga sektori publik kishin korrelacione mesatare më të forta | Abstrakti (IDEAS/RePEc, Springer) | U konfirmua vetëm abstrakti. Në faqen 6 hyn vetëm lidhja me trajtimin e drejtë (me referencë te Nr. 70) dhe sektori publik |
| Brown, Treviño & Harrison, "Ethical leadership: A social learning perspective for construct development and testing", Organizational Behavior and Human Decision Processes 97(2), 2005, f. 117–134, DOI 10.1016/j.obhdp.2005.03.002; shtatë studime të ndërlidhura | Abstrakti (Penn State, ScienceDirect) | U konfirmua te PDF-ja e botuesit (f. 117: "In seven interlocking studies"; tabela 2 i liston studimet 1–7) |
| Përkufizimi: "the demonstration of normatively appropriate conduct through personal actions and interpersonal relationships, and the promotion of such conduct to followers through two-way communication, reinforcement, and decision-making" (f. 120) | Disa studime të mëvonshme që e citojnë fjalë për fjalë me faqen (PMC, Springer, Baylor) | U konfirmua fjalë për fjalë te teksti i plotë (f. 120). Në faqen 7 e japim me fjalët tona, jo si citat |
| Drejtimi etik lidhet me sjelljen e kujdesshme (consideration), ndershmërinë, besimin te drejtuesi, drejtësinë ndërvepruese, drejtimin karizmatik të socializuar dhe mbikëqyrjen abuzive, por nuk përfshihet në asnjërën; parashikon efektivitetin e perceptuar të drejtuesit, kënaqësinë në punë dhe përkushtimin e ndjekësve dhe gatishmërinë e tyre për t'ia raportuar problemet drejtimit | Abstrakti, siç e sjell rezultati i kërkimit | U konfirmua te abstrakti i PDF-së së botuesit (f. 117), fjalë për fjalë. Saktësim: në studimin 7 masa ishte "satisfaction with leader/supervisor" (tabela 2, f. 124; tabela 6), ndërsa abstrakti thotë "followers' job satisfaction"; faqja 7 ndjek abstraktin dhe nuk u ndryshua |
| Shkalla ELS ka 10 pyetje; nga 21 pyetje që mbetën pas analizës faktoriale u zgjodhën 10; alfa = 0,92 | Përmbledhje te Wikipedia dhe te studimet e mëvonshme, siç i sjellin rezultatet e kërkimit | U konfirmua te teksti i plotë (f. 124): pas studimit 1 "21 items remained", pastaj "a set of ten items"; studimi 2 (f. 125): "excellent internal consistency (α = .92)". Alfa nuk hyn në faqe |
| Dhjetë pyetjet formojnë një faktor të vetëm ("supported a unidimensional rather than the proposed two-dimensional structure") | Një studim i mëvonshëm, siç e sjell rezultati i kërkimit; edhe përshtatjet italiane (2020) dhe portugeze (2022) e quajnë shkallë njëdimensionale | U konfirmua te teksti i plotë (f. 124–125): studimi 2 "indicated a one-factor solution"; studimi 3 (CFA) "a unidimensional model (single ethical leadership factor) fit the data well". Citimi për strukturën dydimensionale vjen nga studimi i mëvonshëm, jo nga Brown et al. |
| Pyetjet e ELS: "Listens to what employees have to say"; "Disciplines employees who violate ethical standards"; "Conducts his/her personal life in an ethical manner"; "Has the best interests of employees in mind"; "Makes fair and balanced decisions"; "Can be trusted"; "Discusses business ethics or values with employees"; "Sets an example of how to do things the right way in terms of ethics"; "Defines success not just by results but also the way that they are obtained"; "When making decisions, asks 'what is the right thing to do?'" | Riprodhime në studime të mëvonshme: një punim i Universitetit të Debrecenit (dea.lib.unideb.hu), forma ELS-R (psytests.org), një version i përshtatur nga Wake Forest (clc.business.wfu.edu), Walumbwa & Schaubroeck (2009) dhe të tjerë | Të dhjeta pyetjet u konfirmuan fjalë për fjalë te tabela 3 e artikullit (f. 125). **U ndreq** shënimi i faqes 7, që thoshte se pyetjet vinin nga studime të mëvonshme. Në faqen 7 pyetjet janë të shkurtuara dhe të përkthyera nga ne. Ndarja në dy kolona ("si vepron" / "çfarë nxit") është e redaksisë, sipas dy pjesëve të përkufizimit; shënimi e thotë |

## Çfarë nuk hyri

- Numri i të intervistuarve te Treviño et al. (2000): në kontrollin e dytë u gjet te teksti i plotë (40 intervista, 20 + 20)
  dhe hyri te shënimi i faqes 3.
- Figura origjinale e matricës së reputacionit te Treviño et al. (2000): në kontrollin e dytë u pa (figura 2); matrica e
  faqes 5 e ndjek. Edhe Treviño, Brown & Hartman (2003), studimi në Human Relations me intervista brenda dhe
  jashtë majës së kompanisë, nuk u kontrollua.
- Koeficientët e Mayer et al. (2009), p.sh. b = 0,72 mes drejtimit të lartë dhe shefave (f. 7), dhe "160 organizata"
  (f. 6): tani u panë te teksti i plotë; nuk hynë për vend.
- Korrelacionet e Bedi et al. (2016): një kopje e hershme te academia.edu, siç e sjell kërkimi, jep ρ ≈ 0,94 me drejtimin
  transformues dhe ρ ≈ 0,56 me kënaqësinë në punë, por simbolet dalin të ngatërruara dhe nuk dihet nëse përputhen me
  versionin e botuar. Nuk hynë. Edhe ρ = 0,21 për performancën në punë, që një artikull i Frontiers (2022) ia atribuon
  herë Bedi-t e herë Ng & Feldman-it: nuk hyri.
- Variancat shtesë te Hoch et al. (2018) (p.sh. 17% shtesë për devijimin, 5–11% për besimin te shefi): vetëm te
  përmbledhje të mëvonshme. Nuk hynë.
- Shkalla e përgjigjeve të ELS: burimet thonë herë 5 pika, herë 7. Nuk e japim; karta e numrit nuk e përdor shkallën.
- Madhësitë e mostrave të shtatë studimeve të Brown et al. (2005) (tabela 2: nga 20 deri 485) dhe korrelacionet e tyre:
  tani u panë te teksti i plotë; nuk hynë për vend.
- Kritika se tri pyetje ("can be trusted", "has the best interests of employees in mind", "listens to what employees have
  to say") afrohen me kujdesin (consideration): e thonë vetë Brown et al. (studimi 4, f. 125, "some (not surprising) overlap
  with consideration behaviors"). Nuk hyri.
- Shkallët e tjera (ELW të Kalshoven et al., 2011; ELBS e Tanner et al., 2010; ELS-R): u përmendën te rezultatet, por nuk
  u kontrolluan.
- Të dhënat e anketës globale të Ethics & Compliance Initiative (sjellje e gabuar e vëzhguar, raportimi, hakmarrja): u
  planifikuan si faqe shifrash, por kufiri i kërkimeve mbaroi para se të kontrolloheshin. Nuk hynë.
- Drejtësia në organizatë (Nr. 70), kultura e drejtë pas gabimeve (Nr. 50), ligji i Goodhart-it (Nr. 43) dhe sjellja joetike
  kur vetëm shifra ka rëndësi (Nr. 7): nuk përsëriten; faqja 6 i referohet Nr. 70.

## Çfarë është editoriale

- Leximet te kutitë "Leximi ynë": ekipi nuk e sheh ndërgjegjen, sheh çfarë shpërblen, korrigjon dhe për çfarë flet; vija e
  parë i lexon vlerat te personi të cilit i raporton; heshtja nuk mbetet neutrale, shifra dëgjohet si i vetmi rregull; të
  frymëzosh dhe të jesh etik nuk janë e njëjta gjë, por në anketa gjenden te të njëjtët drejtues; një shef mund të marrë
  pikë te kolona e parë dhe të heshtë te e dyta.
- Fjalia e faqes 3 "një drejtues mund të jetë i ndershëm privatisht dhe prapë t'i lërë punonjësit të pasigurt" është
  përmbledhja jonë e drejtuesit etikisht neutral nga abstrakti.
- Tekstet e shkurtra në kuti (faqja 5) janë të redaksisë; vetë matrica është figura 2 e Treviño et al. (2000).
- Përshkrimi i drejtimit transformues si "stili që frymëzon dhe jep shembull" (faqja 6) është i yni.
- Ndarja e dhjetë pyetjeve në dy kolona (faqja 7) është e redaksisë; në studimet origjinale pyetjet formojnë një faktor.
- Karta e rrugës së drejtë (faqja 8) është praktikë e redaksisë, sipas shtyllës së menaxherit moral dhe pyetjeve të ELS
  ("çfarë është e drejtë të bëjmë?", suksesi që matet edhe me mënyrën si arrihet, dëgjimi i punonjësve, disiplina).
- Lidhja me esenë "Leading people without losing the person" (faqja 5): eseja nuk përdor fjalën "etikë", por përshkruan
  pikërisht anën e menaxherit moral që i mungon drejtuesit neutral: standardi duhet bërë i qartë para se dikush të gjykohet
  ("You cannot hold people accountable for a rule nobody ever made clear"), ndëshkimi vjen kur rregulli shkelet
  vazhdimisht, dhe respekti është "making the standard clear to them, listening to them before you judge them". Kjo
  përputhet me pyetjet e ELS për dëgjimin dhe disiplinën. Eseja është përdorur edhe nga numra të tjerë; e zgjodhëm sepse
  asnjë ese tjetër nuk e mbështet më mirë këtë faqe.
- Lidhja me mjetin KPI Diagnostic (faqja 8): një nga pyetjet e ELS është nëse shefi e mat suksesin edhe me mënyrën si
  arrihen rezultatet. Mjeti pyet, para se të shtyhet më fort një shifër, "What makes the wrong way faster than the right
  way?" dhe nëse njerëzit kapërcejnë hapa nga mungesa e kohës. Asnjë mjet i faqes nuk është për etikën; ky është më i
  afërti.
