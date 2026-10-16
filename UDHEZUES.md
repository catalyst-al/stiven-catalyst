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
