# Stiven Catalyst Tools, Faza 3: PowerTool End-to-End, piloti i parë

Data: 28 tetor 2026. Dega `feature/powertool-case-flow`, nga `main` `c21b30c9` (pas PR #364 dhe #366). Draft PR, pa
merge, pa deploy. Planetët, përmbajtja editoriale, Team Sync Worker dhe Cloudflare të paprekura. Çdo e dhënë në teste
është e stacionit shembull, e shpikur.

## 1. Çfarë ekzistonte në `main` (PARA)

Katër strukturat e kërkuara ishin aty, secila e plotë më vete, por të lidhura vetëm me tekst:

| Struktura | Çfarë kishte | Çfarë i mungonte rrjedhës |
| --- | --- | --- |
| CX Control Tower, Deep dive | Hetimi (`INV-YYYYMMDD-NNN`) me evidencë, pesë pse, shkak si hipotezë/i verifikuar, veprim, përgjegjës, afat, "metrikë verifikimi" dhe "rezultat verifikimi" si tekst; snapshot i periudhës (k/n, filtra, segment); veprimi vetëm në tabelën e stacionit; "Verified effective" ndalohej pa evidencë, shkak të verifikuar dhe rezultat të shkruar | KPI para/pas llogaritej nga njeriu dhe shkruhej si tekst; veprimi nuk shkonte te Action Tracker; pas "done" asgjë nuk ndryshonte në rast; rihapja ishte vetëm një vlerë e listës |
| Action Tracker (`sc-actions`) | Një listë për gjithë mjetet, status open/doing/done/verified, `check` dhe `result`, mbrojtje nga dublikatat (titull + burim), kujtesa, sinjale vonese | "Verified" vendosej me një klik pa rezultat; asnjë lidhje me rastin që e lindi |
| 5 Whys | Fletë pune; dërgon kundërmasën te handover (`?issue=`) dhe te tracker (`?action=&source=five-whys`) | Nuk dinte për cilin rast punonte; shkaku nuk kthehej te hetimi |
| Shift Handover | Çështje të hapura me përgjegjës/afat/bartje; lidhje te 5 Whys pas 3 bartjeve; merr `?issue=` një herë | Asnjë identifikues rasti |

Pa identifikues të përbashkët, "problemi i javës së kaluar" dhe "veprimi i javës së kaluar" ishin dy rreshta pa fije mes
tyre, dhe "Verified" ishte një fjalë, jo një numër.

## 2. Rrjedha pilot (PAS)

Një hetim i CX Control Tower është fija. Identifikuesi i tij `INV-…` udhëton në veprim, në fletën e 5 Whys dhe në
tekstin e çështjes së handover-it; asnjë kopje e dytë e punës nuk krijohet.

| Hapi | Ku | Çfarë ndodh |
| --- | --- | --- |
| Problem | Tower, Deep dive | Një dështim (p.sh. dëmtime), periudha e evidencës me filtrat; "Hetim i ri" |
| Evidencë | Tower | Snapshot i periudhës: metrika, nga–deri, partner/turn/zonë, segment, k/n; teksti i evidencës i detyrueshëm për mbyllje |
| Shkak | 5 Whys ↔ Tower | "Punoji pse-të në 5 Whys" hap fletën me problemin dhe `?case=`; fleta e emërton hetimin dhe "Dërgoje shkakun te hetimi" kthehet me `?case=&why1..5=&root=`; tower-i plotëson vetëm fushat bosh, ruan ato të shkruara, pastron adresën |
| Veprim, përgjegjës, afat | Tower → Action Tracker | "Krijo veprimin e lidhur" shkruan rreshtin në regjistrin e stacionit (si më parë) **dhe** veprimin në Action Tracker me `caseId`, përgjegjës, afat, kontroll; `trackerId` ruhet në rast; klikimi i dytë nuk shton asgjë; tracker-i tregon "Investigation INV-…" me lidhje kthimi |
| Done ≠ Verified | Action Tracker | Përgjegjësi e bën "done"; "verified" pa rezultat refuzohet nga vetë store-i (`needs-result`), forma hapet te rezultati; te rastet vendimi merret në tower |
| Verifikim | Tower | Kur veprimi është done, faza e rastit bëhet vetë "Verification pending"; kutia e verifikimit mat **të njëjtin dështim** para (periudha e snapshot-it) dhe pas (nga dita kur ndryshimi hyri në fuqi, e vendosur nga përdoruesi, deri në ditën e fundit me të dhëna), mbi rreshtat e të njëjtit partner/turn/zonë/segment, çdo shkallë mbi rreshtat e vet të vlefshëm, me periudhat dhe emëruesit të shkruar |
| KPI para/pas | Tower | `verdict`: efektiv vetëm me rreshta të mjaftueshëm pas (kufiri i mostrës i deep dive-it) dhe shkallë më të ulët (brenda maksimumit të miratuar kur ka); jo efektiv me rreshta të mjaftueshëm pa rënie; përndryshe asnjë vendim ("shumë pak rreshta", "ende asnjë rresht pas") |
| Mbyllje | Tower → Tracker → Regjistër | "Mbylle: verifikuar efektiv" kërkon vendimin efektiv + evidencë + shkak të verifikuar + veprim done; shkruan numrat në rast (`verification`), verifikon veprimin në tracker me të njëjtin tekst si rezultat, shënon rreshtin e regjistrit Effective me Baseline/Result |
| Rihapje | Tower | "Rihape: jo efektiv": rasti Reopened, veprimi mbetet done me rezultatin "jo efektiv", regjistri Not effective; veprimi i ri lidhet me të njëjtin `INV-…` (dy veprime, një rast, pa dublikatë) |
| Turni | Tower → Handover | "Vendose veprimin në dorëzimin e turnit": çështje e hapur me tekst `INV-…: veprimi`, përgjegjës, afat, një herë |

## 3. Çfarë u ndryshua

| Skedar | Ndryshim |
| --- | --- |
| `src/js/actions-store.js` | `caseId` në veprim (pastruar, opsional), `forCase()`, `?case=` në hand-off dhe në `link()`, `update()` refuzon verified pa rezultat (`lastUpdate = "needs-result"`) |
| `src/js/action-tracker.js` | Lidhja "Investigation INV-…" te veprimi; "verified" pa rezultat hap formën te rezultati dhe zbatohet kur ruhet rezultati |
| `src/js/cx-tower.js` | Motori: `caseRows`, `afterWindow`, `verdict`, `caseToTracker`, `applyWhys`. Faqja: veprimi në tracker, kutia e verifikimit, vendimet mbyll/rihap, sinkronizimi i fazës, `?case=` me pse-të, lidhjet te 5 Whys/tracker/handover; fushat `trackerId`, `verifyFrom`, `verification` në rast, regjistri CSV me kolonat e reja (eksport dhe import) |
| `src/js/five-whys.js`, `five-whys.njk` | Fusha e fshehur `case`, shiriti "Investigation INV-…", lidhja "Send the cause back"; pastrimi e heq rastin |
| `src/_includes/partials/cx-tower.njk` | Ngarkon `actions-store.js` |
| `src/css/09-career-and-data-tools.css` | Kutia e verifikimit dhe lidhjet (pa prekur pamjen ekzistuese) |
| `src/_data/de/ui.json`, `sq/ui.json` | 31 tekste të reja |
| `docs/DATA-FORMATS.md`, `README.md` | Format dhe përshkrim |

Pa backend, pa librari, pa framework. Asnjë çelës i ri ruajtjeje: rasti jeton në `sc-cx-tower`, veprimi në `sc-actions`,
fleta në `sc-five-whys`; skedari i punës, PIN-i, PWA-ja dhe team sync i mbartin si më parë.

## 4. Kompatibiliteti

- Një rast i ruajtur para kësaj faze ngarkohet me `trackerId`, `verifyFrom` dhe `verification` bosh; asgjë nuk
  rishkruhet në ngarkim.
- Veprimet e vjetra pa `caseId` janë si më parë; i vetmi ndryshim sjelljeje për to: "verified" kërkon rezultat (testi i
  vjetër i tracker-it u përshtat me qëllim).
- Shembujt mbeten të ndarë: veprimi i shembullit të tracker-it zëvendësohet nga veprimi i parë real, si më parë;
  stacioni shembull i tower-it është i shënuar `example`.
- EN/DE/SQ: çdo tekst i ri është në të tria gjuhët (testi i përkthimeve të tower-it).

## 5. Testet

| Provë | Çfarë mbulon |
| --- | --- |
| `tests/case-thread.test.cjs` (9 teste) | Rregullat e vendimit (mjaftueshmëria, rënia, maksimumi i miratuar, pa "para"); dritarja pas dhe rreshtat e rastit (partner/turn/zonë/segment/javë); stacioni shembull: dëmtimet bien pas kundërmasës, vonesat jo; përkthimi rast → veprim tracker-i; bashkimi i pse-ve (bosh plotësohet, e shkruara ruhet). Faqja e tower-it në jsdom me store-in: rrjedha e plotë deri te mbyllja, rifreskimi me gjendjen e ruajtur, rihapja me veprim të dytë nën të njëjtin rast, rreshta të pamjaftueshëm, veprimi done vetëm në regjistër, evidenca që mungon, `?case=` me pse-të dhe rasti i panjohur; faqet e 5 Whys dhe të tracker-it nga ndërtimi |
| `tests/action-tracker.test.cjs` | Verified pa rezultat refuzohet, me rezultat vuloset dita |
| `tests/browser/case-flow.spec.mjs` (Chromium, 1440 px) | Rrjedha e plotë nëpër faqet reale: tower → 5 Whys → tower → tracker → tower → handover, rifreskim, ruajtje në skedar pune, fshirje, rikthim me lidhjen rast–veprim të paprekur |
| Suitat ekzistuese | `npm test` dhe gjithë suita e shfletuesit (rezultatet në seksionin 7) |

## 6. Kufizimet, me ndershmëri

- Piloti mat KPI-në vetëm për rastet e lindura në CX Control Tower (të dhënat e dorëzimeve/rrugëve). Një rast nga
  handover-i ose 5 Whys pa të dhëna në tower mbetet me verifikim tekstual, si më parë.
- "Dita kur ndryshimi hyri në fuqi" është e përdoruesit: data e mbylljes së veprimit është vetëm parazgjedhje. Pa të,
  nuk ka dritare "pas".
- Para/pas krahason shkallë, jo shkaqe: dy periudha me volume dhe kushte të ndryshme mund të ndryshojnë për arsye të
  tjera. Kufiri i mostrës dhe periudhat e shkruara e bëjnë të dukshme, jo të pamundur.
- Vendimi për mbylljen mbetet njerëzor; numrat mund ta ndalojnë (nuk mbyllet pa vendim efektiv), nuk e marrin vetë.
- Handover-i mban identifikuesin në tekstin e çështjes, jo si fushë; mjafton për gjurmim, nuk mjafton për automatizim.

## 7. Rezultatet e provës

REZULTATET
