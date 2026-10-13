// The Management Review as a podcast: the audio overviews of its issues (src/_data/audio.json, made by
// scripts/audio.mjs) as one RSS feed per language that has episodes (src/podcast-feed.njk: /podcast.xml,
// /de/podcast.xml, /sq/podcast.xml), and the page that explains how to follow it (pages/podcast.njk, /podcast.html
// in the three languages). The artwork, the show's square cover and one picture per episode, is drawn by
// scripts/podcast-art.mjs into src/media/podcast/.
//
// A page in a language without episodes yet offers the feed of the English ones and says so.
import fs from "node:fs";
import weekly from "./weekly.js";
import { uuid5 } from "../../lib/uuid5.js";

const audio = JSON.parse(fs.readFileSync(new URL("./audio.json", import.meta.url), "utf8"));
const site = JSON.parse(fs.readFileSync(new URL("./site.json", import.meta.url), "utf8"));
const langs = ["en", "sq", "de"];
const x = (en, sq, de) => ({ en, sq, de });
const local = (url, lang) => (lang === "en" ? url : `/${lang}${url}`);
const absolute = (path) => new URL(path.replace(/^\//, ""), site.url).href;

const texts = {
  title: x("Management Review · Stiven Catalyst", "Management Review · Stiven Catalyst", "Management Review · Stiven Catalyst"),
  description: x(
    "Management without theatre, to listen to. Every episode is a conversation about one issue of the Management Review, the monthly magazine of Stiven Catalyst: what the research says about leading people and operations, and what to do with it on the next shift. The episodes are made with AI (NotebookLM) from the text of each issue; the figures, their sources and the tools are in the issue, free on stivencatalyst.com.",
    "Menaxhim pa teatër, për ta dëgjuar. Çdo episod është një bisedë për një numër të Management Review, revistës mujore të Stiven Catalyst: çfarë thotë kërkimi për drejtimin e njerëzve dhe të operacioneve, dhe çfarë të bësh me të në turnin e radhës. Episodet krijohen me inteligjencë artificiale (NotebookLM) nga teksti i çdo numri; shifrat, burimet dhe mjetet janë te numri, falas në stivencatalyst.com.",
    "Management ohne Theater, zum Hören. Jede Folge ist ein Gespräch über eine Ausgabe der Management Review, des Monatsmagazins von Stiven Catalyst: was die Forschung über das Führen von Menschen und Abläufen sagt und was man in der nächsten Schicht damit anfängt. Die Folgen werden mit KI (NotebookLM) aus dem Text jeder Ausgabe erstellt; die Zahlen, ihre Quellen und die Tools stehen in der Ausgabe, kostenlos auf stivencatalyst.com.",
  ),
  // The page.
  eyebrow: x("Management Review · Podcast", "Management Review · Podcast", "Management Review · Podcast"),
  heading: x("Listen to the Management Review", "Dëgjo Management Review", "Die Management Review zum Hören"),
  lede: x(
    "One issue, one conversation: for the commute, a walk or the quiet hour of a night shift. Follow it once, and every new episode comes to your phone by itself.",
    "Një numër, një bisedë: për rrugën, për një shëtitje ose për orën e qetë të turnit të natës. Ndiqe një herë, dhe çdo episod i ri të vjen vetë në telefon.",
    "Eine Ausgabe, ein Gespräch: für den Arbeitsweg, einen Spaziergang oder die ruhige Stunde einer Nachtschicht. Einmal abonniert, kommt jede neue Folge von selbst aufs Handy.",
  ),
  seo: x(
    "The Management Review as a podcast: one conversation per issue on leading people and operations. Follow it in Apple Podcasts, Overcast or any app.",
    "Management Review si podcast: një bisedë për çdo numër, për drejtimin e njerëzve dhe operacioneve. Ndiqe në Apple Podcasts ose çdo aplikacion.",
    "Die Management Review als Podcast: ein Gespräch pro Ausgabe über das Führen von Menschen und Abläufen. In Apple Podcasts oder jeder App hören.",
  ),
  episodes: x("Episodes", "Episode", "Folgen"),
  minutes: x("Minutes", "Minuta", "Minuten"),
  language: x("Language", "Gjuha", "Sprache"),
  listen: x("Listen to the newest", "Dëgjo më të renë", "Die neueste hören"),
  follow: x("Follow the podcast", "Ndiq podcast-in", "Podcast abonnieren"),
  followKicker: x("Follow", "Ndiqe", "Abonnieren"),
  followTitle: x("Follow it in your podcast app", "Ndiqe në aplikacionin tënd të podcast-eve", "In Ihrer Podcast-App abonnieren"),
  followText: x(
    "Tap your app. It opens with the podcast ready to follow, and new episodes arrive by themselves, also for listening offline.",
    "Prek aplikacionin tënd. Hapet me podcast-in gati për ta ndjekur, dhe episodet e reja vijnë vetë, edhe për t’i dëgjuar pa internet.",
    "Tippen Sie auf Ihre App. Sie öffnet sich mit dem Podcast, bereit zum Abonnieren, und neue Folgen kommen von selbst, auch zum Offline-Hören.",
  ),
  otherTitle: x("Any other app, in three steps", "Çdo aplikacion tjetër, në tre hapa", "Jede andere App, in drei Schritten"),
  steps: [
    x("Copy the address of the podcast.", "Kopjo adresën e podcast-it.", "Kopieren Sie die Adresse des Podcasts."),
    x("In your app, look for “Add a podcast by URL” (often under + or Search).", "Në aplikacion, kërko “Shto podcast me URL” (zakonisht te + ose te Kërko).", "Suchen Sie in Ihrer App „Podcast per URL hinzufügen“ (oft unter + oder Suche)."),
    x("Paste the address and follow. That is all.", "Ngjite adresën dhe ndiqe. Kaq.", "Adresse einfügen und abonnieren. Fertig."),
  ],
  address: x("The address of the podcast", "Adresa e podcast-it", "Adresse des Podcasts"),
  copy: x("Copy", "Kopjo", "Kopieren"),
  copied: x("Copied", "U kopjua", "Kopiert"),
  inEnglish: x("", "Episodet janë për momentin në anglisht.", "Die Folgen sind bisher auf Englisch."),
  listKicker: x("Episodes", "Episodet", "Folgen"),
  listTitle: x("Every episode, the newest first", "Të gjitha episodet, më i riu i pari", "Alle Folgen, die neueste zuerst"),
  fromIssue: x("From the issue", "Nga numri", "Aus der Ausgabe"),
  readIssue: x("Read the issue", "Lexo numrin", "Ausgabe lesen"),
  howKicker: x("How they are made", "Si bëhen", "Wie sie entstehen"),
  howTitle: x("Two voices, one issue", "Dy zëra, një numër", "Zwei Stimmen, eine Ausgabe"),
  howText: x(
    "Each episode is made with AI (NotebookLM) from the text of one issue: two voices talk the issue through. They can simplify, and now and then get something wrong; the issue is the reference, with every figure and its source.",
    "Çdo episod krijohet me inteligjencë artificiale (NotebookLM) nga teksti i një numri: dy zëra e diskutojnë numrin. Mund të thjeshtojnë dhe ndonjëherë të gabojnë; numri mbetet referenca, me çdo shifër dhe burimin e saj.",
    "Jede Folge wird mit KI (NotebookLM) aus dem Text einer Ausgabe erstellt: Zwei Stimmen sprechen die Ausgabe durch. Sie können vereinfachen und sich manchmal irren; maßgeblich ist die Ausgabe, mit jeder Zahl und ihrer Quelle.",
  ),
  rss: x("The feed itself (RSS)", "Vetë feed-i (RSS)", "Der Feed selbst (RSS)"),
};
const langName = { en: x("English", "Anglisht", "Englisch"), sq: x("Albanian", "Shqip", "Albanisch"), de: x("German", "Gjermanisht", "Deutsch") };
const no = x("No.", "Nr.", "Nr.");

// Every episode of a language, the newest issue first.
const episodesOf = (lang) => weekly.issues
  .filter((issue) => audio[issue.slug]?.[lang])
  .map((issue) => {
    const track = audio[issue.slug][lang];
    const I = issue[lang];
    const published = track.published;
    return {
      slug: issue.slug,
      number: issue.number,
      no: issue.no,
      lang,
      label: `${no[lang]} ${issue.no}`,
      title: track.title,
      ai: track.ai,
      src: track.src,
      bytes: track.bytes,
      seconds: track.seconds,
      minutes: Math.round(track.seconds / 60),
      clock: `${Math.floor(track.seconds / 60)}:${String(track.seconds % 60).padStart(2, "0")}`,
      published,
      // RFC 2822, at six in the morning in Germany, the hour a new issue is meant to be found, one minute later for
      // each issue number: podcast apps order by this date, and issues published on the same day keep their order.
      pubDate: new Date(Date.parse(`${published}T04:00:00Z`) + issue.number * 60000).toUTCString(),
      issueHeading: I.heading,
      issueSub: I.sub,
      issueDate: I.date,
      issueUrl: local(`/magazine/${issue.slug}.html`, lang),
      image: `/media/podcast/${issue.slug}-${lang}.jpg`,
      guid: `stivencatalyst-${issue.slug}-${lang}`,
    };
  })
  .sort((a, b) => b.number - a.number);

const feedPath = (lang) => local("/podcast.xml", lang);
const feeds = langs.filter((lang) => episodesOf(lang).length).map((lang) => {
  const episodes = episodesOf(lang);
  const path = feedPath(lang);
  return {
    lang,
    path,
    url: absolute(path),
    guid: uuid5(absolute(path).replace(/^https?:\/\//, "")),
    title: texts.title[lang],
    description: texts.description[lang],
    pageUrl: local("/podcast.html", lang),
    image: "/media/podcast/cover.jpg",
    updated: episodes.map((e) => e.pubDate).sort((a, b) => new Date(b) - new Date(a))[0],
    episodes,
  };
});

// The page of each language: its own feed, or the English one until it has episodes.
const pages = Object.fromEntries(langs.map((lang) => {
  const feed = feeds.find((f) => f.lang === lang) || feeds.find((f) => f.lang === "en") || null;
  const t = Object.fromEntries(Object.entries(texts).map(([key, value]) => [key, Array.isArray(value) ? value.map((v) => v[lang]) : value[lang]]));
  const subscribe = feed && (() => {
    const bare = feed.url.replace(/^https?:\/\//, "");
    const encoded = encodeURIComponent(feed.url);
    return [
      { name: "Apple Podcasts", href: `podcast://${bare}` },
      { name: "Overcast", href: `overcast://x-callback-url/add?url=${encoded}` },
      { name: "Pocket Casts", href: `pktc://subscribe/${bare}` },
      { name: "AntennaPod", href: `https://antennapod.org/deeplink/subscribe?url=${encoded}` },
    ];
  })();
  return [lang, {
    ...t,
    feed,
    feedLanguage: feed ? langName[feed.lang][lang] : "",
    other: Boolean(feed && feed.lang !== lang),
    subscribe,
    totalMinutes: feed ? Math.round(feed.episodes.reduce((sum, e) => sum + e.seconds, 0) / 60) : 0,
    // The episodes as this page shows them: the recording as it is, the issue it comes from in the page's language.
    list: feed ? feed.episodes.map((e) => {
      const I = weekly.issues.find((issue) => issue.slug === e.slug)[lang];
      return { ...e, label: `${no[lang]} ${e.no}`, issueHeading: I.heading, issueSub: I.sub, issueDate: I.date, issueUrl: local(`/magazine/${e.slug}.html`, lang) };
    }) : [],
  }];
}));

export default {
  author: site.author,
  email: site.email,
  feeds,
  ...pages,
};
