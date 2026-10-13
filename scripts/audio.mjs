// The audio overview of an issue: a recording made elsewhere (a NotebookLM conversation, or Stiven's own voice) is
// encoded once for the site and listed in src/_data/audio.json, which the reader of the issue reads
// (partials/audio-player.njk, js/audio-player.js).
//
//   node scripts/audio.mjs <recording> <slug> <lang> "<title>" [--own-voice]
//   node scripts/audio.mjs ~/Downloads/why.mp3 management-review-nr-01 en "Why great employees make bad managers"
//
// Needs ffmpeg and ffprobe. A spoken recording is one voice channel, so it is written as 64 kbps mono MP3 (the
// quality of 128 kbps stereo for each channel, half the size), brought to -16 LUFS, the loudness of podcasts, so it
// is not quieter than everything else on a phone, and tagged with its title, the issue and its cover. The file goes
// to src/media/audio/<slug>-<lang>.mp3. Without --own-voice the reader says the audio was made with AI (NotebookLM).
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const args = process.argv.slice(2);
const ownVoice = args.includes("--own-voice");
const [input, slug, lang, title] = args.filter((arg) => !arg.startsWith("--"));
if (!input || !slug || !["en", "sq", "de"].includes(lang) || !title) {
  console.error('Usage: node scripts/audio.mjs <recording> <slug> <en|sq|de> "<title>" [--own-voice]');
  process.exit(1);
}
if (!fs.existsSync(input)) throw new Error(`No recording at ${input}`);

// Runs ffmpeg or ffprobe and returns what it wrote (ffmpeg reports on stderr).
const run = (cmd, argv) => {
  const result = spawnSync(cmd, ["-hide_banner", ...argv], { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
  if (result.error) throw new Error(`${cmd} is needed: ${result.error.message}`);
  if (result.status !== 0) throw new Error(`${cmd} failed:\n${result.stderr.slice(-2000)}`);
  return { out: result.stdout, err: result.stderr };
};

const ISO = { en: "eng", sq: "sqi", de: "deu" };
const number = slug.match(/^management-review-nr-(\d+)$/)?.[1];
const album = number ? `Management Review No. ${number}` : slug;
const cover = path.join(ROOT, "src", "media", "magazine", slug, lang, "page-01-720.webp");
const outDir = path.join(ROOT, "src", "media", "audio");
const out = path.join(outDir, `${slug}-${lang}.mp3`);
fs.mkdirSync(outDir, { recursive: true });

// 1. Measure the loudness, so the second pass brings it to -16 LUFS in one linear step (no pumping).
const LOUD = "loudnorm=I=-16:TP=-1.5:LRA=11";
const report = run("ffmpeg", ["-nostats", "-i", input, "-af", `${LOUD}:print_format=json`, "-f", "null", "-"]).err;
const m = JSON.parse(report.slice(report.lastIndexOf("{"), report.lastIndexOf("}") + 1));
// loudnorm keeps the gain linear only when the peaks allow it; otherwise it compresses, and its output can still
// overshoot once encoded. A limiter at the final sample rate keeps the MP3 from clipping: it starts at -2 dBFS, and
// when the decoded file still peaks above -0.3 dBFS (an MP3 can overshoot its source on a sharp consonant), the
// recording is encoded again with the limiter 1.5 dB lower.
const filter = (limitDb) => [
  `${LOUD}:measured_I=${m.input_i}:measured_TP=${m.input_tp}:measured_LRA=${m.input_lra}:measured_thresh=${m.input_thresh}:offset=${m.target_offset}:linear=true`,
  "aresample=44100",
  `alimiter=limit=${(10 ** (limitDb / 20)).toFixed(3)}:attack=5:release=50:level=false`,
].join(",");
const peakOf = (file) => Number(run("ffmpeg", ["-nostats", "-i", file, "-af", "astats=measure_overall=Peak_level:measure_perchannel=none", "-f", "null", "-"]).err.match(/Peak level dB:\s*(-?[\d.]+|-inf)/)?.[1]);

// 2. Encode: mono, 64 kbps, 44.1 kHz, ID3v2.3 tags (read by phones and car radios), the cover as its picture.
const withCover = fs.existsSync(cover);
const encode = (limitDb) => run("ffmpeg", [
  "-y", "-nostats", "-i", input,
  ...(withCover ? ["-i", cover, "-map", "0:a", "-map", "1:v", "-c:v", "mjpeg", "-q:v", "4", "-disposition:v", "attached_pic"] : ["-map", "0:a"]),
  "-af", filter(limitDb), "-ac", "1", "-c:a", "libmp3lame", "-b:a", "64k",
  "-map_metadata", "-1", "-id3v2_version", "3",
  "-metadata", `title=${title}`, "-metadata", "artist=Stiven Catalyst", "-metadata", `album=${album}`,
  "-metadata", `language=${ISO[lang]}`, "-metadata", `date=${new Date().getFullYear()}`,
  ...(number ? ["-metadata", `track=${Number(number)}`] : []),
  out,
]);
let limit = -2;
let peak;
for (;;) {
  encode(limit);
  peak = peakOf(out);
  if (!(peak > -0.3) || limit <= -6.5) break;
  console.log(`peak ${peak} dBFS with the limiter at ${limit} dBFS: encoding again at ${limit - 1.5}`);
  limit -= 1.5;
}

// 3. List it: the reader shows the length and size before anything is downloaded.
const seconds = Math.round(Number(run("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", out]).out));
const bytes = fs.statSync(out).size;
const listFile = path.join(ROOT, "src", "_data", "audio.json");
const list = fs.existsSync(listFile) ? JSON.parse(fs.readFileSync(listFile, "utf8")) : {};
// The day it was first published stays when a recording is encoded again; podcast apps order the episodes by it.
const published = list[slug]?.[lang]?.published || new Date().toISOString().slice(0, 10);
list[slug] = { ...list[slug], [lang]: { src: `/media/audio/${slug}-${lang}.mp3`, title, seconds, bytes, published, ...(ownVoice ? {} : { ai: "NotebookLM" }) } };
const sorted = Object.fromEntries(Object.keys(list).sort().map((key) => [key, list[key]]));
fs.writeFileSync(listFile, `${JSON.stringify(sorted, null, 2)}\n`);
console.log(`${path.relative(ROOT, out)}: ${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}, ${(bytes / 1048576).toFixed(1)} MB, from ${m.input_i} to -16 LUFS, peak ${peak} dBFS`);
