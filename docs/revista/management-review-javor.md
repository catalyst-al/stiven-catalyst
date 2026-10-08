# Management Review · botimi javor

Vendosur nga autori më 8 tetor 2026.

## Vendimet

- **Emri:** Management Review, me kopertinën e botimit të shtatorit (STIVEN CATALYST, MANAGEMENT REVIEW, llamba). Botimi i shtatorit mbetet "botim special".
- **Numërimi:** Nr. 1–41 dalin si arkivë e botuar tani, pa data të kaluara. Në kopertinë shkruhet numri dhe muaji i botimit. Pasi mbyllet arkiva, del një numër i ri çdo javë me datën e vet të vërtetë.
- **Gjuhët:** shqip, anglisht, gjermanisht, si gjithë faqja.
- **Ritmi:** Nr. 1 del si model. Pas miratimit vazhdojmë me 4 numra për PR.

## Rregullat për çdo numër

Të njëjtat si te "Nga terreni", plus disa rregulla që vijnë nga tema:

- Çdo shifër vjen nga një burim i identifikueshëm, me botuesin, titullin dhe vitin. Kontrollohet para se të hyjë në draft. Ajo që nuk konfirmohet, hiqet.
- Shifrat e vjetra shënohen me vitin e tyre ("Gallup, 2015"), që lexuesi ta dijë sa të reja janë.
- Teksti shkruhet me fjalët tona. Nuk kopjojmë paragrafë dhe as grafikë nga raportet. Grafikët i rivizatojmë vetë nga shifrat e publikuara. Citimet janë të shkurtra dhe me burim.
- Interpretimi editorial ndahet qartë nga statistika.
- Asnjë histori, rast ose rezultat i shpikur. Përvoja e autorit hyn vetëm si lidhje te esetë e tij të publikuara.
- Pa emra kompanish ku ka punuar autori, pa të dhëna konfidenciale.
- Kur burimi primar nuk hapet nga ambienti i punës, shifra kontrollohet te përmbledhje të pavarura dhe shënohet kështu në tabelën e fakteve.

## Faqet e një numri (10)

1. Kopertina: tema e javës, shifra e javës dhe tri pika brenda
2. Në këtë numër: pse kjo temë, përmbajtja dhe si lexohet numri
3. Tema kryesore: çfarë thonë të dhënat
4. Shifrat: 2–3 grafikë
5. Modeli ose korniza, me diagram
6. Zhvillimi i rolit, ose si zbatohet
7. Si matet
8. Mjeti i javës: kartë që printohet dhe plotësohet, me lidhje te një ese ose një mjet i faqes
9. Burimet dhe metoda
10. Kopertina e pasme

Faqet 3–8 mund ta ndryshojnë rendin sipas temës. Testi (`tests/weekly.test.cjs`) kërkon që kopertina, përmbajtja,
burimet dhe kopertina e pasme të jenë në vendin e tyre, dhe që çdo faqe me shifra të ketë burimin.

## Ku janë skedarët

- Teksti i çdo numri: `lib/weekly/issues/XX.js`, çdo tekst në tri gjuhët, `x(en, sq, de)`
- Burimet: `lib/weekly/sources.js`; etiketat e përbashkëta dhe blloqet: `lib/weekly/common.js`
- Grafikët (vija, dy pika, unaza, njerëz nga 10, para dhe pas, kolona, shirita, një katror për çdo ditë): `lib/weekly/charts.js`
- Faqet e printimit: `src/guide-print/weekly.njk`; faqja e lexuesit: `src/_includes/pages/weekly-issue.njk`;
  lista e numrave: `src/_includes/pages/weekly-archive.njk` (`/magazine/management-review.html`)

## Si punojmë me çdo grup

1. Kërkimi dhe tabela e fakteve për 4 numra (`docs/revista/management-review-nr-XX.md`)
2. Teksti shqip, pastaj anglisht dhe gjermanisht (`lib/weekly/issues/XX.js`)
3. Printimi (`node scripts/weekly.mjs XX`), kontrolli i faqeve, testet, PR
4. Autori lexon dhe shkruan "bashkoje"

## 41 temat

Blloqet: **Roli** (zhvillimi i rolit, 8) · **KPI** (matja, 8) · **Strategjia** (ekzekutimi, 7) · **Njerëzit** (ekipet, 8) · **Operacioni** (Lean, Six Sigma, 5) · **AI** (të dhënat, 5).

Burimet në kolonën e fundit janë kandidatë. Shifrat e tyre kontrollohen te kërkimi i numrit.

| Nr. | Blloku | Tema | Burimet për t'u kontrolluar |
|---|---|---|---|
| 1 | Roli | Çfarë bëjnë menaxherët më të mirë | Google re:Work, Project Oxygen (2018); Gallup, State of the American Manager (2015); Gallup, State of the Global Workplace 2026 |
| 2 | KPI | Tregues paraprijës dhe vonues: KPI që paralajmërojnë | Kaplan & Norton, HBR (1992); OSHA, Using Leading Indicators to Improve Safety (2019) |
| 3 | Strategjia | Pse strategjia humbet në mes | Sull, Homkes & Sull, "Why Strategy Execution Unravels", HBR (2015) |
| 4 | Njerëzit | Siguria psikologjike | Google re:Work, Project Aristotle; Edmondson (1999) |
| 5 | Operacioni | Tetë humbjet e Lean-it | Ohno, Toyota Production System (1988); Lean Enterprise Institute; Womack & Jones (1996) |
| 6 | Roli | Nga më i miri në ekip te menaxheri | Gallup (2026), "When Good Frontline Workers Make Bad Supervisors"; Charan, Drotter & Noel, The Leadership Pipeline |
| 7 | KPI | Pak qëllime, të qarta | Locke & Latham (2002), American Psychologist; McChesney, Covey & Huling, The 4 Disciplines of Execution (2012) |
| 8 | Strategjia | Kush vendos çfarë | McKinsey, Decision making in the age of urgency (2019); Rogers & Blenko, "Who Has the D?", HBR (2006) |
| 9 | Njerëzit | Angazhimi: të dhënat e 2026-s | Gallup, State of the Global Workplace 2026; Gallup, Q12 Meta-Analysis |
| 10 | AI | AI në punën e menaxherit, pa iluzione | MIT NANDA, The GenAI Divide (2025); Microsoft, Work Trend Index 2026; Gallup (2026) |
| 11 | Roli | Menaxheri si coach | Google re:Work; Gallup, punimet për coaching-un e menaxherëve |
| 12 | KPI | OKR dhe KPI: kur përdoret secili | Doerr, Measure What Matters (2018); Google re:Work, OKR; Grove, High Output Management (1983) |
| 13 | Strategjia | Takimet që prodhojnë vendime | Perlow, Hadley & Eun, "Stop the Meeting Madness", HBR (2017); Rogelberg (2019) |
| 14 | Njerëzit | Pse njerëzit ikin dhe çfarë i mban | Gallup (2019), largimet që mund të parandalohen; Work Institute, Retention Report; McKinsey (2022) |
| 15 | Operacioni | Zgjidhja e problemeve me A3 dhe Pareto | Juran; Shook, Managing to Learn (2008) |
| 16 | Roli | Delegimi | Gallup (2015), studimi për talentin e delegimit te CEO-të |
| 17 | KPI | Balanced Scorecard pas 30 vitesh | Kaplan & Norton, HBR (1992, 1996); Bain, Management Tools & Trends |
| 18 | Strategjia | Ritmi i menaxhimit: dita, java, muaji | Mann, Creating a Lean Culture; Grove, High Output Management |
| 19 | Njerëzit | Feedback-u që ndryshon sjelljen | Kluger & DeNisi (1996), Psychological Bulletin; Gallup (menaxhimi i performancës) |
| 20 | AI | Vendime me të dhëna | Brynjolfsson, Hitt & Kim (2011); MIT Sloan Management Review |
| 21 | Roli | Menaxheri i mesëm, roli që po ripërkufizohet | McKinsey, Power to the Middle (2023); Deloitte, Global Human Capital Trends 2026 |
| 22 | KPI | Cilësia: First Pass Yield dhe kostoja e cilësisë | ASQ, Cost of Quality; Juran's Quality Handbook; Crosby, Quality Is Free (1979) |
| 23 | Strategjia | Ndryshimi që zgjat: e vërteta për "70% dështojnë" | Kotter, HBR (1995); Hughes (2011), Journal of Change Management; McKinsey |
| 24 | Njerëzit | Onboarding-u që i mban njerëzit | Gallup (2018); Bauer, SHRM Foundation (2010) |
| 25 | Operacioni | Six Sigma dhe variacioni | ASQ; Motorola (1986); Montgomery, Statistical Quality Control |
| 26 | Roli | 90 ditët e para në një rol të ri | Watkins, The First 90 Days; McKinsey (tranzicionet e drejtuesve) |
| 27 | KPI | OTIF dhe Perfect Order në logjistikë | ASCM, SCOR; APQC; Gartner |
| 28 | Strategjia | Rreziku operacional: FMEA dhe matrica e rrezikut | AIAG & VDA, FMEA Handbook (2019); ISO 31000:2018 |
| 29 | Njerëzit | Burnout-i dhe ngarkesa | OBSH, ICD-11 (2019); Gallup, Employee Burnout |
| 30 | AI | Cilësia e të dhënave | Nagle, Redman & Sammon, HBR (2017); Gartner |
| 31 | Roli | Vetënjohja dhe inteligjenca emocionale | Goleman, "What Makes a Leader?", HBR (1998); Eurich, HBR (2018) |
| 32 | KPI | NPS, CSAT, CES: çfarë matin vërtet | Reichheld, HBR (2003); Dixon, Freeman & Toman, HBR (2010) |
| 33 | Strategjia | Strategjia në një faqe | Akao, Hoshin Kanri (1991); Lafley & Martin, Playing to Win (2013) |
| 34 | Njerëzit | Mirënjohja që funksionon | Gallup & Workhuman (2023) |
| 35 | Operacioni | Puna standarde dhe Kaizen | Imai, Kaizen (1986); Lean Enterprise Institute |
| 36 | Roli | 70-20-10: si zhvillohen drejtuesit | Lombardo & Eichinger (1996); Center for Creative Leadership |
| 37 | KPI | Dashboard-et që përdoren | Few, Information Dashboard Design; kërkimet për aftësitë me të dhëna |
| 38 | Njerëzit | Konflikti në ekip | Thomas & Kilmann (1974); CPP, Global Human Capital Report (2008) |
| 39 | AI | Automatizimi dhe e ardhmja e roleve | World Economic Forum, Future of Jobs Report 2025; OECD, Employment Outlook |
| 40 | Operacioni | Gemba: menaxhimi aty ku ndodh puna | Ohno; Womack, Gemba Walks (2011); Mann |
| 41 | AI | AI dhe rregullat në punë: EU AI Act | Rregullorja (BE) 2024/1689 dhe afatet e saj |

## Grupet

| PR | Numrat | Statusi |
|---|---|---|
| Modeli | 1 | U botua |
| 1 | 2–5 | U botua |
| 2 | 6–9 | Në shqyrtim |
| 3 | 10–13 | |
| 4 | 14–17 | |
| 5 | 18–21 | |
| 6 | 22–25 | |
| 7 | 26–29 | |
| 8 | 30–33 | |
| 9 | 34–37 | |
| 10 | 38–41 | |
