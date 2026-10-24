# Udhëzues: si të shtosh materiale në faqe

Faqja tani ndërtohet vetë nga skedarë të thjeshtë teksti. Ti nuk prek më HTML.
Shkruan në një panel në browser, shtyp **Save**, dhe pas 1–2 minutash ndryshimi del në faqe.

---

## 1. Hyrja në panel (një herë)

1. Hap **https://app.pagescms.org**
2. Kliko **Sign in with GitHub** dhe hyr me llogarinë tënde.
3. Kur ta kërkojë, jepi leje (**Install**) për repository-n `stiven-catalyst`.
4. Zgjidh `catalyst-al / stiven-catalyst`, branch **main**.

Në të majtë do shohësh:

| Seksioni | Çfarë është |
|---|---|
| **Insights (essays)** | Artikujt e gjatë |
| **Reflections** | Shkrimet personale |
| **Field Notes** | Shënimet e shkurtra (citatet) |
| **Projects** | Projektet, me foto, link ose skedar për shkarkim |
| **Homepage highlights** | Dy kartat e vogla në faqen kryesore |
| **Impressum details** | Të dhënat ligjore (adresa etj.) dhe ofruesi i newsletter-it |
| **Media** | Fotot, PDF-të dhe skedarët e ngarkuar |

---

## 2. Artikull i ri

**Insights (essays) → Add an entry**

- **Title**: titulli.
- **Date**: data e publikimit.
- **Category**: tema (Leadership, Operations…).
- **Status**:
  - `published`: artikulli ka faqen e vet dhe lexohet.
  - `soon`: del në listë si "Coming soon", pa faqe. Mirë për të lajmëruar çfarë vjen.
- **Feature on homepage**: nëse e shënon, ky artikull del në kartën e madhe në faqen kryesore.
- **Reading time**: p.sh. `5 min`.
- **Summary**: 1 fjali për listën e Insights.
- **Homepage teaser**, **Intro under the title**, **Search description**: opsionale.
- **Essay**: teksti. Ka butona për tituj, bold, citate dhe foto.

Shtyp **Save**. Kaq.

**Foto në krye (opsionale)**: te **Photo at the top** ngarko një foto, dhe te **Photo description** shkruaj me pak fjalë çfarë shihet (për lexuesit që nuk e shohin foton). Foto horizontale ose katrore del më mirë; faqja e zbut vetë skajet.

### Reflektime (shkrimet personale)

**Reflections → Add an entry** (gjermanisht: **Reflections (Deutsch)**, shqip: **Reflections (Shqip)**). Fushat janë si te artikulli, pa kategori. Këtu shkojnë shkrimet me zërin tënd personal; Insights mbeten për analizat e punës.

## 3. Field Note e re

**Field Notes → Add an entry**: shkruaj shënimin (pa thonjëza, shtohen vetë) dhe datën. Faqja kryesore tregon 2 më të rejat.

**Lidhjet bëhen vetë.** Çdo shënim lidhet me esenë nga vjen (kur fjalët e tij janë në një ese) dhe me mjetin që përmend
(dorëzimi i turnit, KPI, vonesat…), ose me mjetin e parë të esesë së tij. Te shënimi dalin "Nga eseja" dhe "Provoje në
punë"; te eseja "Shënime nga terreni nga kjo ese"; te mjeti "Nga shënimet e terrenit". Mjetet e një eseje i zgjedh fusha
**relatedTools** e esesë angleze; pa të, faqja i gjen vetë nga teksti.

**Shënime të reja nga esetë.** Fjalitë me bold më vete në ese (parimet) mund të bëhen shënime, në tri gjuhët njëherësh:

```
node scripts/field-notes.mjs              # propozimet, me numër; nuk shkruan asgjë
node scripts/field-notes.mjs --write 1,3  # shkruan propozimet 1 dhe 3 (ose --write all)
node scripts/note-cards.mjs               # pastaj: imazhet e shënimeve për LinkedIn/Instagram
```

Skripti lë jashtë parimet që janë tashmë shënim dhe hapat e listave ("Dita 1: …", "2. …").

## 4. Projekt, foto ose material për shkarkim

**Projects → Add an entry**

- **Image or screenshot**: ngarko një foto.
- **Link**: adresë interneti (opsionale).
- **Downloadable file**: ngarko PDF, template, Excel… Në kartë del butoni **Download**.
- **Position**: 1 = i pari.

Skedarët e ngarkuar ruhen te **Media** dhe mund të përdoren kudo.

## 5. Impressum dhe Datenschutz

Të dhënat janë te **Impressum details** (emri, qyteti, email; rruga është opsionale).
Faqet **Impressum** dhe **Datenschutz** krijohen vetë në tri gjuhë (anglisht, gjermanisht, shqip) dhe dalin në fund të çdo faqeje, në gjuhën e saj.

> Teksti i Datenschutz është draft i mirë, por **nuk është këshillë ligjore**.
> Kontrolloje një herë me një gjenerator (p.sh. e-recht24.de) ose me një jurist.

## 6. Newsletter

Newsletter-i është **aktiv** dhe punon me **MailerLite** (https://dashboard.mailerlite.com).

- **Ku del formulari:** në faqen kryesore, Start, Insights, në fund të çdo eseje, Reflections, Publications,
  Challenges dhe Shelf, në tri gjuhët.
- **Si regjistrohet lexuesi:** shkruan emailin dhe shtyp **Subscribe**. Faqja nuk largohet; i thotë të hapë emailin
  dhe ta konfirmojë me linkun (double opt-in). Vetëm pas konfirmimit del te **Subscribers** në MailerLite.
- **Gjuha:** çdo abonent vjen me fushën **language** (`en`, `de` ose `sq`), sipas faqes ku u regjistrua. Në
  MailerLite bëj një **Segment** për çdo gjuhë (language = `sq` etj.) dhe dërgoja secilit në gjuhën e vet.
  Fusha `language` duhet të ekzistojë te **Subscribers → Fields**; pa të, MailerLite e humb gjuhën.
- **Dërgimi i një numri:** **Campaigns → Create campaign**, zgjidh segmentin e gjuhës, shkruaj ose ngjit tekstin
  me linkun e esesë së re, dhe **Send** ose **Schedule**. Faqja nuk dërgon asgjë vetë.
- **Feed-et e shkrimeve** (esetë dhe reflektimet e reja): `stivencatalyst.com/feed.xml` (anglisht), `/de/feed.xml`
  dhe `/sq/feed.xml`. Nëse do që MailerLite ta nisë vetë emailin kur del një ese e re, provo një **RSS campaign**
  me feed-in e gjuhës.
- **Datenschutz:** seksioni i newsletter-it shtohet vetë në faqen Datenschutz. Emri i ofruesit merret nga
  **Impressum details → Newsletter provider**.
- **Ta ndryshosh ose ta fikësh:** adresa e formularit është te `src/_data/site.json` (`newsletter.action`). Nëse e
  lë bosh, formulari zhduket nga të gjitha faqet. Për një formular të ri MailerLite, më dërgo adresën e tij.

## 7. Versionet gjermanisht dhe shqip

Faqja ka tri gjuhë. Faqet gjermane janë nën `/de/` (p.sh. `/de/insights.html`) dhe ato shqip nën `/sq/`
(p.sh. `/sq/insights.html`). Butonat **EN · DE · SQ** lart djathtas të çojnë te e njëjta faqe në gjuhën tjetër.
Në celular janë brenda menysë.

Në panel çdo seksion ka edhe variantet **(Deutsch)** dhe **(Shqip)**:

| Seksioni | Çfarë është |
|---|---|
| **Insights (Deutsch / Shqip)** | Artikujt në gjermanisht / shqip |
| **Reflections (Deutsch / Shqip)** | Shkrimet personale në gjermanisht / shqip |
| **Field Notes (Deutsch / Shqip)** | Shënimet në gjermanisht / shqip |
| **Projects (Deutsch / Shqip)** | Projektet në gjermanisht / shqip |
| **Homepage highlights (Deutsch / Shqip)** | Dy kartat e vogla në faqen kryesore gjermane / shqip |

- Një artikull i ri në anglisht **nuk** del vetë në gjuhët e tjera: shtoje edhe te **Insights (Deutsch)** dhe **Insights (Shqip)**.
- Te **English version** shkruaj adresën e artikullit anglisht, p.sh. `starting-from-zero`.
  Kështu faqet lidhen me butonat e gjuhës. Nëse e lë bosh, artikulli del vetëm në atë gjuhë.
- Kategoritë në gjermanisht: Führung, Betrieb, Menschen, Systeme, Hotellerie, Logistik, Service, Wandel.
- Kategoritë në shqip: Udhëheqje, Operacione, Njerëz, Sisteme, Mikpritje, Logjistikë, Shërbim, Ndryshim.

---

## 8. Mjetet

Te **Mjete** (`/sq/tools.html`) janë **36 mjete falas dhe një kurs**, në tri gjuhë. Janë të ndara sipas rolit
(planetet): çdo rol ka mjetet e veta dhe një rutinë që thotë kur përdoret secili. Mjetet punojnë edhe pa internet,
pasi janë hapur një herë në atë pajisje.

### Çfarë ka secili rol

**Shef turni** (një turn):

| Mjeti | Për çfarë |
|---|---|
| **Shift Pulse** | Turni në një pamje: dëmet, porositë e paplota, vonesat, siguria, OEE dhe veprimet e hapura |
| **Kontrolli i dëmeve** | Regjistri i dëmeve sipas hapit dhe shkakut, me normën, DPMO-në dhe nivelin sigma |
| **Kontrolli i plotësisë** | E njëjta gjë për porositë që dolën pa çdo artikull |
| **Analiza e vonesave** | Rrugët me orën e planifikuar dhe reale: sa vonesë nis te doku, sa në rrugë |
| **Regjistri i Night Audit** | No-show, karta të refuzuara, gabime postimi dhe bilance të hapura në hotel |
| **Dorëzimi i turnit** | Numrat, çështjet e hapura me përgjegjës dhe sigurinë, nga një turn te tjetri |
| **Lista e veprimeve** | Çdo veprim nga çdo mjet, me përgjegjës, afat, status dhe si verifikohet |
| **Tabela e ditës** | Takimi i mëngjesit: Siguri, Cilësi, Dorëzim, Kosto, Njerëz si ditë jeshile, portokalli, të kuqe |
| **Auditi 5S** | Auditi 5S, 6S ose 8S sipas zonës, me radar, trend, etiketat e kuqe, foto para/pas dhe plan auditesh me rotacion |
| **Kryqi i sigurisë** | Kryqi i muajit për murin, ditët pa aksident, LTIFR, TRIR dhe piramida e ngjarjeve |
| **Sendet e gjetura** | Regjistri i sendeve të gjetura nga dorëzimi deri te kthimi, policia, bamirësia ose asgjësimi |

**Menaxher zone** (një zonë, javë pas jave):

| Mjeti | Për çfarë |
|---|---|
| **Last-Mile CX Control Tower** | Perfect Delivery, partnerët, shoferët dhe rreziku i rrugëve nga Excel-i yt |
| **Diagnostikimi i KPI-së** | Kur një numër bëhet i kuq: qartësi, aftësi, kapacitet, proces apo përgjegjësi? |
| **Pareto 80/20** | Cilat pak shkaqe bëjnë shumicën e humbjeve |
| **Raporti A3** | Problemi në një faqe, nga gjendja aktuale te ndjekja, me Word |
| **Tabela Kaizen** | Idetë e ekipit nga propozimi te rezultati, me kursimet |
| **Matrica e aftësive** | Kush di çfarë, ku varemi nga një person i vetëm, plani i trajnimit |
| **OEE** | Disponueshmëria, performanca dhe cilësia e makinave, me gjashtë humbjet e mëdha |
| **KPI-të e hotelit** | Zënia, ADR dhe RevPAR kundrejt buxhetit, dhe paratë e humbura nga no-show |
| **Gemba Walk** | Auditet sipas niveleve (shef turni, menaxher, drejtues) dhe ecjet për humbjet |
| **Raporti i operacioneve** | Raporti javor ose mujor për menaxherin, i shkruar vetë nga të dhënat e mjeteve të tjera |
| **Inspektimi i dhomës** | Kontrolli i dhomës së pastruar para se të lirohet, me pikët sipas zonës dhe defektet |
| **Planifikuesi i mirëmbajtjes** | Mirëmbajtja parandaluese dhe kontrollet ligjore sipas datës ose orëve të punës, me MTBF/MTTR |

**Menaxher procesesh** (një proces, nga problemi te standardi):

| Mjeti | Për çfarë |
|---|---|
| **Sigma dhe karta e kontrollit** | Niveli sigma, Perfect Delivery dhe a është një ditë e keqe sinjal apo zhurmë |
| **5 Whys** | Nga simptoma te shkaku që mund ta ndryshosh, me një kundërmasë |
| **Kurrizi i peshkut** | Shkaqet sipas kategorive (6M), me vota dhe shkaqet e mundshme |
| **FMEA** | Rreziqet e çdo hapi me S, O, D dhe prioritetin AIAG-VDA |
| **Laboratori i procesit** | Karta I-MR, Cp/Cpk, testet para/pas dhe sa matje duhen |
| **Studimi i kohës** | Kohët e ciklit me kronometër, takti dhe grafiku Yamazumi |
| **Harta e rrjedhës së vlerës** | E gjithë rrjedha, ku pret koha, gjendja aktuale dhe e ardhshme |
| **Puna standarde** | Udhëzimi i punës hap pas hapi, me pikat kyçe dhe arsyet, në A4 dhe Word |
| **Diagrami spageti** | Rrugët e ecjes mbi planin e katit, në metra, para dhe pas ndryshimit |
| **Portofoli i projekteve** | Të gjitha projektet DMAIC në një faqe: faza, gjendja, kursimet dhe kalimi i radhës |
| **Six Sigma në magazinë** | Kursi DMAIC në pesë hapa, me mjetin e duhur te çdo hap |

**Karrierë:** Krijuesi i CV-së, CV për ATS dhe Letër motivimi.

### Si lidhen me njëri-tjetrin

- **Lista e veprimeve është qendra.** Kundërmasa e 5 Whys, gjetjet e auditit 5S, rreziqet e FMEA-s, çështjet e
  dorëzimit të turnit dhe problemet e regjistrave shkojnë te lista me butonin **Shto te veprimet**. Lista tregon nga
  cili mjet erdhi secili veprim, cilat janë të vonuara, dhe e bën shqyrtimin javor.
- **Profili i vendit të punës** (vendi, turnet, zonat me përgjegjësit, ekipet, objektivat) plotësohet një herë te
  **Tabela e ditës**, në pjesën e sipërme. Pastaj e marrin edhe mjetet e tjera: auditi 5S ofron zonat, regjistrat
  marrin turnet dhe objektivat. Një objektiv i shkruar në vetë mjetin ka gjithmonë përparësi.
- **Tabela e ditës dhe Shift Pulse lexojnë vetë** regjistrat e mjeteve të tjera: dëmet, vonesat, sigurinë, OEE-në,
  auditin 5S dhe veprimet. Nuk shkruan gjë dy herë.
- Shumë mjete kanë edhe butonat **Vazhdo me 5 Whys**, **Hape në Pareto 80/20** dhe **Hape si kartë kontrolli**.

### Ku ruhen të dhënat

- Çdo gjë mbetet **vetëm në atë browser**, në atë pajisje. Asgjë nuk dërgohet.
- Çdo gjuhë mban regjistrat e vet (emrat brenda janë fjalët e asaj gjuhe). Lista e veprimeve dhe profili i vendit të
  punës janë të njëjta në të tri gjuhët.
- **Ruaj gjithë punën time** (në fund të çdo mjeti dhe te faqja Mjete) bën një skedar me gjithë punën. Me **Hap një skedar
  të ruajtur** e hap në një telefon ose kompjuter tjetër, ose ia jep një kolegu.
- **Pikat e rikthimit:** browser-i krijon vetë një pikë rikthimi çdo ditë që hap një mjet, dhe para se një skedar i
  hapur të zëvendësojë diçka. Te kutia e ruajtjes, **Pika rikthimi** tregon listën; **Rikthe** e kthen punën si ishte
  atë ditë. Kutia tregon edhe sa vend zë puna dhe paralajmëron kur hapësira po mbaron.
- Çdo mjet hapet herën e parë me një **shembull**, që të shihet menjëherë çfarë tregon. Shtyp **Fshi shembullin**
  ose shto të dhënat e tua dhe shembulli ikën vetë.

### Udhëzuesi i mjeteve

**The Tools Guide** (`/sq/guides/tools-guide.html`) është libri i mjeteve, tani në **botimin e tretë**: një faqe
për çdo mjet, në tri gjuhë, për t’u shfletuar ose shkarkuar si PDF. Botimet e mëparshme mbeten te faqja si u
printuan. Te çdo mjet, poshtë, lidhja **Hape te faqja N** të çon te faqja e tij në libër.

### Ndryshimi i një mjeti (në kompjuter, jo nga paneli)

Mjetet nuk ndryshohen nga paneli: janë kod. Teksti i tyre është te `src/_data/` (një skedar për çdo mjet dhe gjuhë,
p.sh. `src/_data/sq/fmea.json`), përkthimet e butonave te `src/_data/sq/ui.json` dhe `src/_data/de/ui.json`,
kartat te `src/_data/tools.json` (dhe `de/`, `sq/`), rolet te `src/_data/families.json`.

Pas një ndryshimi:

```
npm run build && npm test                  # faqja ndërtohet dhe testet kalojnë
node scripts/check-tool.mjs fmea           # kontrollon një mjet në tri gjuhët, pa build të plotë
node scripts/tool-previews.mjs             # fotot e kartave (TOOLS=fmea për një mjet të vetëm)
node scripts/social-cards.mjs              # imazhet për LinkedIn/WhatsApp (TOOLS=fmea)
node scripts/thumbnails.mjs                # kopjet e vogla të fotove
node scripts/tools-guide.mjs               # libri i mjeteve, kur ndryshon një mjet
```

Skriptet e fotove kanë nevojë për Chromium (Playwright). Nëse Chromium është tashmë në kompjuter, jepja rrugën me
`CHROMIUM_PATH=/rruga/te/chromium` para komandës.

---

## Libri “Mall për Durrësin”

Libri shfletohet në tri gjuhë, secila me botimin e vet, me të njëjtin dizajn dhe të njëjtën kopertinë:

- shqip, origjinali: `/sq/books/mall-per-durresin.html`
- anglisht, *Longing for Durrës*: `/books/mall-per-durresin.html`
- gjermanisht, *Sehnsucht nach Durrës*: `/de/books/mall-per-durresin.html`

Përkthimet ndjekin origjinalin faqe për faqe: çdo kapitull nis në të njëjtën faqe në çdo gjuhë, kështu që kur
ndërrohet gjuha, lexuesi vazhdon nga e njëjta faqe. Faqet janë imazhe të nxjerra nga PDF-ja e secilës gjuhë, plus
teksti i plotë për kërkim dhe lexues ekrani.

**Kur ke një version të ri të PDF-së shqip**, kjo bëhet në kompjuter (jo nga paneli):

```
pip install pymupdf pillow
python3 scripts/book-pages.py rruga/per/te/libri.pdf
```

Kopjo edhe PDF-në e re te `src/media/books/mall-per-durresin/mall-per-durresin.pdf` (për shkarkim).
Skripti rishkruan faqet te `src/media/books/mall-per-durresin/` dhe tekstin te `src/_data/books/sq.json`.
Pastaj ndrysho të njëjtat fjali edhe te `scripts/book/sq.txt`, `en.txt` dhe `de.txt`, që përkthimet të mbeten të
njëjta me origjinalin.

**Për të ndrequr një fjalë në përkthim** (ose titullin), ndryshoje te `scripts/book/en.txt` ose `scripts/book/de.txt`
(çdo paragraf është një rresht; formati shpjegohet te `scripts/book/README.md`) dhe pastaj:

```
pip install pymupdf pillow reportlab
python3 scripts/book-edition.py en      # ose: de
node scripts/thumbnails.mjs
```

Skripti e radhit tekstin me të njëjtat shkronja, ngjyra, fotografi dhe kopertinë si libri shqip, shkruan PDF-në te
`src/media/books/mall-per-durresin/en/` (ose `de/`), faqet dhe `src/_data/books/en.json`. Për çdo faqe tregon sa
vend ka mbetur; nëse një tekst del shumë i gjatë, e thotë vetë cila faqe duhet shkurtuar. Libri shqip nuk preket.

---

## Audio e një numri të Management Review

Te faqja e një numri, nën butonat **Open the issue**, **Read it as text** dhe **Download PDF**, del një luajtës i
vogël kur numri ka audio në atë gjuhë: Play/Pause, 15 sekonda prapa e përpara, shiriti i kohës, `03:42 / 20:51` dhe
shpejtësia (1×, 1.25×, 1.5×, 2×). Lexuesi e vazhdon aty ku e la herën e kaluar, dhe telefoni e kontrollon edhe nga
ekrani i kyçur. Audio nuk shkarkohet derisa të shtypet Play.

Për të shtuar audion e një numri (p.sh. nga NotebookLM, `.mp3`, `.m4a` ose `.wav`):

```
node scripts/audio.mjs ~/Downloads/biseda.m4a management-review-nr-02 sq "Titulli i bisedës"
```

- `management-review-nr-02` është numri, `sq` gjuha e audios (`en`, `sq` ose `de`).
- Skripti (i duhet `ffmpeg`) e kthen në MP3 64 kbps mono me zë të njëtrajtshëm (rreth 10 MB për 20 minuta),
  e ruan te `src/media/audio/` dhe e shton te `src/_data/audio.json`.
- Shënimi poshtë luajtësit thotë që biseda është bërë me AI (NotebookLM). Nëse e ke incizuar me zërin tënd,
  shto `--own-voice` dhe shënimi nuk del.

### Podcast-i

Çdo audio e Management Review del vetë edhe si episod podcast-i:

- **Faqja:** `stivencatalyst.com/podcast.html` (edhe `/de/` dhe `/sq/`). Aty lexuesi e ndjek me një prekje në
  Apple Podcasts, Overcast, Pocket Casts ose AntennaPod, ose kopjon adresën për çdo aplikacion tjetër. Lidhja
  "Podcast" është edhe në fund të çdo faqeje dhe poshtë luajtësit të çdo numri.
- **Feed-i:** një për çdo gjuhë: `stivencatalyst.com/podcast.xml` (anglisht), `/sq/podcast.xml` (shqip) dhe `/de/podcast.xml` (gjermanisht). Një gjuhë pa episode merr në faqe ato angleze.
- **Pas çdo audioje të re:** pasi ke bërë `node scripts/audio.mjs …`, bëj edhe
  `node scripts/podcast-art.mjs`. Ai vizaton foton katrore të episodit (numri dhe titulli) te `src/media/podcast/`.

**Ta shfaqësh në Apple Podcasts dhe Spotify (një herë):**

1. **Apple Podcasts:** hyr te https://podcastsconnect.apple.com me Apple ID-në, **+ → New Show → Add a show with an
   RSS feed**, ngjit `https://stivencatalyst.com/podcast.xml`. Apple e kontrollon për disa ditë.
2. **Spotify:** hyr te https://creators.spotify.com, **Add an existing show**, ngjit të njëjtën adresë. Spotify dërgon
   një kod te emaili i podcast-it (`contact@stivencatalyst.com`, nga `src/_data/site.json`): mbaje atë email aktiv.
3. Episodet e reja dalin vetë në të dyja, pa bërë asgjë tjetër.
4. Feed-i shqip (`https://stivencatalyst.com/sq/podcast.xml`) dhe ai gjermanisht (`/de/podcast.xml`) janë shfaqje më vete: shtoji në të njëjtën mënyrë, që secila gjuhë të ketë podcast-in e vet.


---

## Pyetje të shpejta

**Sa shpejt del ndryshimi?** Rreth 1–2 minuta pas Save.
Ecurinë e shikon në GitHub → **Actions**.

**Gabova diçka, si kthehem mbrapa?** Çdo Save është një version në GitHub.
Asgjë nuk humbet dhe çdo ndryshim mund të kthehet.

**A mund ta prish dizajnin nga paneli?** Jo. Paneli ndryshon vetëm tekstin, fotot dhe skedarët.
Dizajni është i ndarë.

**Skedarë të mëdhenj?** Mbaji nën ~20 MB secilin. Për video, përdor YouTube dhe vendos linkun.

**A i shoh të dhënat e mjeteve në një telefon tjetër?** Jo vetë: ato janë vetëm në browser-in ku u shkruan. Bëj
**Ruaj gjithë punën time** dhe hape skedarin në pajisjen tjetër me **Hap një skedar të ruajtur**.

**Fshiva historinë e browser-it. Humbën të dhënat?** Po, nëse nuk ke ruajtur skedarin. Ruaje një herë në javë.
