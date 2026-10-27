// Team sync (partials/team-sync.njk, inside the box "All your work in one file"): the tools a team ticks are kept the
// same on every device of the team, through one encrypted copy on the sync server (workers/sync/worker.js).
//
// The team code is six words. Everything else comes from it on the device, with WebCrypto:
//   bits        = PBKDF2-SHA-256(code, "stiven-catalyst-sync-id-v2", 310000), 512 bits
//   spaceId     = hex of the first 256 bits      the address of the team's copy
//   writeToken  = hex of the last 256 bits       lets a device replace or delete it
//   key         = PBKDF2-SHA-256(code, "stiven-catalyst-sync-v1", 310000) → AES-GCM 256
// The server sees the space id and the token: each guess of the code costs whoever holds them the same 310 000
// rounds as a guess against the copy. Teams made before kept their copy at the "legacy" address, SHA-256("space:" +
// code) with the token SHA-256("write:" + code), which a guesser could test with one hash; a sync reads such a copy
// there, writes it to the new address and deletes the old one (or keeps it in "retire" to delete later). Read-only
// codes made before carry the old address and stop working once the team's copy has moved: the box says the copy
// is gone, and the team makes a new read-only code.
// What goes up is { format: "stiven-catalyst-team", version: 2, sent, device, devices, items: { key: string },
// deleted: { key: { row id: ms } } }, gzipped
// where the browser can (a first byte says which: 1 gzip, 0 plain JSON), then encrypted with a fresh 12-byte IV. The
// server stores ciphertext; the code and the key never leave the device. The code is kept in localStorage "sc-team",
// what was last synced in "sc-team-state"; neither is work, so neither goes into a saved file (work-backup.js SKIP).
//
// A sync: GET → decrypt → merge (TeamSyncMath.merge) → a restore point, then only the changed keys are written → PUT
// with the revision of the GET. 409 (another device saved first): once more from the GET. 429: wait 2 s, once more.
//
// Deletions: a row (of a log, { rows: [{ id, … }] }) that was in the team's copy at the last sync and is no longer on
// this device was deleted here. The sync takes it out of the team's copy and leaves a tombstone in "deleted" (the
// storage key, the row id, when this device saw it deleted); every device that reads the tombstone deletes the row
// too, whatever it holds of it. A row deleted on one device and changed on another before either heard of the other
// stays deleted, in whichever order they sync: what was deleted (a guest's name, a phone number) never comes back
// from the team. The device that changed it keeps its version in the restore point made before the sync. Tombstones
// are kept 90 days (TOMBSTONE_DAYS); after that, a device that was away and still holds the row drops it all the
// same when it has not changed it since its last sync (the team's copy no longer has it), and brings it back only
// when it has changed it. Rows without an id, and a whole tool's key, are never deleted by a sync. A copy written
// before tombstones (version 1) is read as one without any; a restore point or a file put back is not a deletion
// (rebase). This device keeps the tombstones it knows in "sc-team-state" too.
// It runs on page load, after "Sync now", and when the page has been idle for 30 s after a change. A device that
// found the team's copy gone (deleted, or the team changed its code) no longer syncs by itself.
//
// A read-only code ("scr1." + base64url, see viewerCode) carries the space id and the AES key, not the write token:
// a device that joined with one only reads (pullOnce: GET → decrypt → the team's version of the ticked tools, after a
// restore point) and never sends a PUT or a DELETE; the server would refuse them anyway without the token. Its key
// is imported for decryption only. "Change the team code" (rotate) moves the team's whole copy to the space of a new
// code, and only once that upload has gone through deletes the old space with the old token.
(() => {
  const FORMAT = "stiven-catalyst-team";
  const VERSION = 2;
  // Version 1: the same, before tombstones.
  const READ_VERSIONS = [1, 2];
  const TOMBSTONE_DAYS = 90;
  const TOMBSTONE_MS = TOMBSTONE_DAYS * 24 * 60 * 60 * 1000;
  // At most this many tombstones in a copy, the newest kept: a few hundred kilobytes before gzip.
  const MAX_DELETED = 20000;
  const SALT = "stiven-catalyst-sync-v1";
  const ID_SALT = "stiven-catalyst-sync-id-v2";
  const ITERATIONS = 310000;
  const TEAM_KEY = "sc-team";
  const STATE_KEY = "sc-team-state";
  const MAX_BYTES = 4 * 1024 * 1024;
  const MAX_DEVICES = 10;
  const IDLE_MS = 30000;
  // A device that saw the team within a day does not upload only to say so.
  const SEEN_MS = 24 * 60 * 60 * 1000;

  // ---- The words of a team code ----
  // The EFF short word list 1 (1296 words of 3 to 5 letters, CC BY 3.0 US, eff.org/dice), "yo-yo" spelled "yacht" so
  // every word is plain letters. Six words: 6 × log2(1296) ≈ 62 bits.
  const WORDS = (
    "acid acorn acre acts afar affix aged agent agile aging agony ahead aide aids aim ajar alarm alias alibi alien " +
    "alike alive aloe aloft aloha alone amend amino ample amuse angel anger angle ankle apple april apron aqua area " +
    "arena argue arise armed armor army aroma array arson art ashen ashes atlas atom attic audio avert avoid awake " +
    "award awoke axis bacon badge bagel baggy baked baker balmy banjo barge barn bash basil bask batch bath baton " +
    "bats blade blank blast blaze bleak blend bless blimp blink bloat blob blog blot blunt blurt blush boast boat " +
    "body boil bok bolt boned boney bonus bony book booth boots boss botch both boxer breed bribe brick bride brim " +
    "bring brink brisk broad broil broke brook broom brush buck bud buggy bulge bulk bully bunch bunny bunt bush bust " +
    "busy buzz cable cache cadet cage cake calm cameo canal candy cane canon cape card cargo carol carry carve case " +
    "cash cause cedar chain chair chant chaos charm chase cheek cheer chef chess chest chew chief chili chill chip " +
    "chomp chop chow chuck chump chunk churn chute cider cinch city civic civil clad claim clamp clap clash clasp " +
    "class claw clay clean clear cleat cleft clerk click cling clink clip cloak clock clone cloth cloud clump coach " +
    "coast coat cod coil coke cola cold colt coma come comic comma cone cope copy coral cork cost cot couch cough " +
    "cover cozy craft cramp crane crank crate crave crawl crazy creme crepe crept crib cried crisp crook crop cross " +
    "crowd crown crumb crush crust cub cult cupid cure curl curry curse curve curvy cushy cut cycle dab dad daily " +
    "dairy daisy dance dandy darn dart dash data date dawn deaf deal dean debit debt debug decaf decal decay deck " +
    "decor decoy deed delay denim dense dent depth derby desk dial diary dice dig dill dime dimly diner dingy disco " +
    "dish disk ditch ditzy dizzy dock dodge doing doll dome donor donut dose dot dove down dowry doze drab drama " +
    "drank draw dress dried drift drill drive drone droop drove drown drum dry duck duct dude dug duke duo dusk dust " +
    "duty dwarf dwell eagle early earth easel east eaten eats ebay ebony ebook echo edge eel eject elbow elder elf " +
    "elk elm elope elude elves email emit empty emu enter entry envoy equal erase error erupt essay etch evade even " +
    "evict evil evoke exact exit fable faced fact fade fall false fancy fang fax feast feed femur fence fend ferry " +
    "fetal fetch fever fiber fifth fifty film filth final finch fit five flag flaky flame flap flask fled flick fling " +
    "flint flip flirt float flock flop floss flyer foam foe fog foil folic folk food fool found fox foyer frail frame " +
    "fray fresh fried frill frisk from front frost froth frown froze fruit gag gains gala game gap gas gave gear " +
    "gecko geek gem genre gift gig gills given giver glad glass glide gloss glove glow glue goal going golf gong good " +
    "gooey goofy gore gown grab grain grant grape graph grasp grass grave gravy gray green greet grew grid grief " +
    "grill grip grit groom grope growl grub grunt guide gulf gulp gummy guru gush gut guy habit half halo halt happy " +
    "harm hash hasty hatch hate haven hazel hazy heap heat heave hedge hefty help herbs hers hub hug hula hull human " +
    "humid hump hung hunk hunt hurry hurt hush hut ice icing icon icy igloo image ion iron islam issue item ivory ivy " +
    "jab jam jaws jazz jeep jelly jet jiffy job jog jolly jolt jot joy judge juice juicy july jumbo jump junky juror " +
    "jury keep keg kept kick kilt king kite kitty kiwi knee knelt koala kung ladle lady lair lake lance land lapel " +
    "large lash lasso last latch late lazy left legal lemon lend lens lent level lever lid life lift lilac lily limb " +
    "limes line lint lion lip list lived liver lunar lunch lung lurch lure lurk lying lyric mace maker malt mama " +
    "mango manor many map march mardi marry mash match mate math moan mocha moist mold mom moody mop morse most motor " +
    "motto mount mouse mousy mouth move movie mower mud mug mulch mule mull mumbo mummy mural muse music musky mute " +
    "nacho nag nail name nanny nap navy near neat neon nerd nest net next niece ninth nutty oak oasis oat ocean oil " +
    "old olive omen onion only ooze opal open opera opt otter ouch ounce outer oval oven owl ozone pace pagan pager " +
    "palm panda panic pants panty paper park party pasta patch path patio payer pecan penny pep perch perky perm pest " +
    "petal petri petty photo plank plant plaza plead plot plow pluck plug plus poach pod poem poet pogo point poise " +
    "poker polar polio polka polo pond pony poppy pork poser pouch pound pout power prank press print prior prism " +
    "prize probe prong proof props prude prune pry pug pull pulp pulse puma punch punk pupil puppy purr purse push " +
    "putt quack quake query quiet quill quilt quit quota quote rabid race rack radar radio raft rage raid rail rake " +
    "rally ramp ranch range rank rant rash raven reach react ream rebel recap relax relay relic remix repay repel " +
    "reply rerun reset rhyme rice rich ride rigid rigor rinse riot ripen rise risk ritzy rival river roast robe robin " +
    "rock rogue roman romp rope rover royal ruby rug ruin rule runny rush rust rut sadly sage said saint salad salon " +
    "salsa salt same sandy santa satin sauna saved savor sax say scale scam scan scare scarf scary scoff scold scoop " +
    "scoot scope score scorn scout scowl scrap scrub scuba scuff sect sedan self send sepia serve set seven shack " +
    "shade shady shaft shaky sham shape share sharp shed sheep sheet shelf shell shine shiny ship shirt shock shop " +
    "shore shout shove shown showy shred shrug shun shush shut shy sift silk silly silo sip siren sixth size skate " +
    "skew skid skier skies skip skirt skit sky slab slack slain slam slang slash slate slaw sled sleek sleep sleet " +
    "slept slice slick slimy sling slip slit slob slot slug slum slurp slush small smash smell smile smirk smog snack " +
    "snap snare snarl sneak sneer sniff snore snort snout snowy snub snuff speak speed spend spent spew spied spill " +
    "spiny spoil spoke spoof spool spoon sport spot spout spray spree spur squad squat squid stack staff stage stain " +
    "stall stamp stand stank stark start stash state stays steam steep stem step stew stick sting stir stock stole " +
    "stomp stony stood stool stoop stop storm stout stove straw stray strut stuck stud stuff stump stung stunt suds " +
    "sugar sulk surf sushi swab swan swarm sway swear sweat sweep swell swept swim swing swipe swirl swoop swore " +
    "syrup tacky taco tag take tall talon tamer tank taper taps tarot tart task taste tasty taunt thank thaw theft " +
    "theme thigh thing think thong thorn those throb thud thumb thump thus tiara tidal tidy tiger tile tilt tint tiny " +
    "trace track trade train trait trap trash tray treat tree trek trend trial tribe trick trio trout truce truck " +
    "trump trunk try tug tulip tummy turf tusk tutor tutu tux tweak tweet twice twine twins twirl twist uncle uncut " +
    "undo unify union unit untie upon upper urban used user usher utter value vapor vegan venue verse vest veto vice " +
    "video view viral virus visa visor vixen vocal voice void volt voter vowel wad wafer wager wages wagon wake walk " +
    "wand wasp watch water wavy wheat whiff whole whoop wick widen widow width wife wifi wilt wimp wind wing wink " +
    "wipe wired wiry wise wish wispy wok wolf womb wool woozy word work worry wound woven wrath wreck wrist xerox " +
    "yahoo yam yard year yeast yelp yield yacht yodel yoga yoyo yummy zebra zero zesty zippy zone zoom "
  ).trim().split(" ");
  const WORD_SET = new Set(WORDS);
  const CODE_WORDS = 6;
  const BITS = CODE_WORDS * Math.log2(WORDS.length);

  const randomBelow = (n, fill) => {
    // Rejection sampling: no word is likelier than another.
    const limit = 65536 - (65536 % n);
    const buffer = new Uint16Array(1);
    for (;;) {
      fill(buffer);
      if (buffer[0] < limit) return buffer[0] % n;
    }
  };
  const newCode = (fill = (array) => globalThis.crypto.getRandomValues(array)) => Array.from({ length: CODE_WORDS }, () => WORDS[randomBelow(WORDS.length, fill)]).join("-");
  // Typed with spaces, dashes, capitals or a line break, or scanned: the same code.
  const parseCode = (text) => {
    const words = String(text ?? "").toLowerCase().split(/[^a-z]+/).filter(Boolean);
    const unknown = words.filter((word) => !WORD_SET.has(word));
    return { code: words.join("-"), words, unknown, ok: words.length === CODE_WORDS && !unknown.length };
  };
  const normalise = (text) => parseCode(text).code;

  // ---- Keys and the sealed copy ----
  const subtle = () => globalThis.crypto?.subtle;
  const canEncrypt = () => Boolean(subtle() && typeof globalThis.TextEncoder === "function" && typeof globalThis.TextDecoder === "function");
  const utf8 = (text) => new TextEncoder().encode(text);
  const hex = (buffer) => [...new Uint8Array(buffer)].map((b) => b.toString(16).padStart(2, "0")).join("");
  const sha256 = async (text) => hex(await subtle().digest("SHA-256", utf8(text)));
  // The address and the token: 512 bits of PBKDF2 with a salt that is not the key's.
  const deriveIds = async (code, iterations = ITERATIONS) => {
    const base = await subtle().importKey("raw", utf8(code), "PBKDF2", false, ["deriveBits"]);
    const bits = new Uint8Array(await subtle().deriveBits({ name: "PBKDF2", hash: "SHA-256", salt: utf8(ID_SALT), iterations }, base, 512));
    return { spaceId: hex(bits.subarray(0, 32)), writeToken: hex(bits.subarray(32)) };
  };
  const legacyIds = async (code) => {
    const [spaceId, writeToken] = await Promise.all([sha256(`space:${code}`), sha256(`write:${code}`)]);
    return { spaceId, writeToken };
  };
  const deriveKeys = async (text, iterations = ITERATIONS) => {
    const code = normalise(text);
    const base = await subtle().importKey("raw", utf8(code), "PBKDF2", false, ["deriveKey"]);
    const [ids, legacy, key] = await Promise.all([
      deriveIds(code, iterations),
      legacyIds(code),
      subtle().deriveKey({ name: "PBKDF2", hash: "SHA-256", salt: utf8(SALT), iterations }, base, { name: "AES-GCM", length: 256 }, false, ["encrypt", "decrypt"]),
    ]);
    return { code, spaceId: ids.spaceId, writeToken: ids.writeToken, key, legacy };
  };
  const toBase64 = (bytes) => {
    let text = "";
    for (let i = 0; i < bytes.length; i += 0x8000) text += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000));
    return btoa(text);
  };
  const fromBase64 = (text) => {
    const raw = atob(text);
    const bytes = new Uint8Array(raw.length);
    for (let i = 0; i < raw.length; i++) bytes[i] = raw.charCodeAt(i);
    return bytes;
  };
  // RFC 4648 §5: the URL- and file-safe alphabet, without padding.
  const toBase64Url = (bytes) => toBase64(bytes).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  const fromBase64Url = (text) => {
    if (!/^[A-Za-z0-9_-]*$/.test(text) || text.length % 4 === 1) throw new Error("base64url");
    const plain = text.replace(/-/g, "+").replace(/_/g, "/");
    return fromBase64(plain + "=".repeat((4 - (plain.length % 4)) % 4));
  };
  const fromHex = (text) => Uint8Array.from(String(text).match(/[0-9a-f]{2}/g) || [], (pair) => parseInt(pair, 16));
  const concat = (...parts) => {
    const out = new Uint8Array(parts.reduce((sum, part) => sum + part.length, 0));
    let at = 0;
    parts.forEach((part) => { out.set(part, at); at += part.length; });
    return out;
  };
  const through = async (bytes, stream) => {
    const writer = stream.writable.getWriter();
    const written = writer.write(bytes).then(() => writer.close());
    const reader = stream.readable.getReader();
    const chunks = [];
    let total = 0;
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      chunks.push(value);
      total += value.length;
    }
    await written;
    const out = new Uint8Array(total);
    let at = 0;
    chunks.forEach((chunk) => { out.set(chunk, at); at += chunk.length; });
    return out;
  };
  const seal = async (payload, key) => {
    const json = utf8(JSON.stringify(payload));
    let body = null;
    if (typeof globalThis.CompressionStream === "function") {
      try {
        const zipped = await through(json, new globalThis.CompressionStream("gzip"));
        body = new Uint8Array(zipped.length + 1);
        body[0] = 1;
        body.set(zipped, 1);
      } catch { body = null; }
    }
    if (!body) {
      body = new Uint8Array(json.length + 1);
      body[0] = 0;
      body.set(json, 1);
    }
    const iv = globalThis.crypto.getRandomValues(new Uint8Array(12));
    const data = new Uint8Array(await subtle().encrypt({ name: "AES-GCM", iv }, key, body));
    return { iv: toBase64(iv), data: toBase64(data) };
  };
  // Throws when the key is not the team's (AES-GCM checks) or the copy is damaged.
  const unseal = async ({ iv, data }, key) => {
    const body = new Uint8Array(await subtle().decrypt({ name: "AES-GCM", iv: fromBase64(iv) }, key, fromBase64(data)));
    let json;
    if (body[0] === 1) {
      if (typeof globalThis.DecompressionStream !== "function") throw new Error("gzip");
      json = await through(body.subarray(1), new globalThis.DecompressionStream("gzip"));
    } else if (body[0] === 0) json = body.subarray(1);
    else throw new Error("format");
    return JSON.parse(new TextDecoder().decode(json));
  };

  // ---- Read-only codes ----
  // What a device needs to read the team's copy, and nothing that lets it write:
  //   "scr1." + base64url( space id (32 bytes) ‖ AES key (32 bytes) ‖ check (4 bytes) )      96 characters
  // The key is the 256 bits PBKDF2 gives the team code (deriveBits; deriveKey to AES-256 takes the very same bits, so
  // it opens what the members seal). The check is the first 4 bytes of SHA-256("scr1." ‖ space id ‖ key): a copy cut
  // short or mistyped is told apart from a code of another team. The six words and the write token are not in it:
  // the token is the other half of the address's PBKDF2 (deriveIds), which nothing in the code leads back to. "1" is
  // the version of the format; a later one gets a new number.
  const VIEW_PREFIX = "scr";
  const VIEW_VERSION = 1;
  const VIEW_BYTES = 68;
  const HEX64 = /^[0-9a-f]{64}$/;
  const looksViewer = (text) => /^\s*scr\d+\./i.test(String(text ?? ""));
  const viewerCheck = async (body) => new Uint8Array(await subtle().digest("SHA-256", concat(utf8(`${VIEW_PREFIX}${VIEW_VERSION}.`), body))).subarray(0, 4);
  const viewerCode = async (text, iterations = ITERATIONS) => {
    const code = normalise(text);
    const { spaceId } = await deriveIds(code, iterations);
    const base = await subtle().importKey("raw", utf8(code), "PBKDF2", false, ["deriveBits"]);
    const key = new Uint8Array(await subtle().deriveBits({ name: "PBKDF2", hash: "SHA-256", salt: utf8(SALT), iterations }, base, 256));
    const body = concat(fromHex(spaceId), key);
    return `${VIEW_PREFIX}${VIEW_VERSION}.${toBase64Url(concat(body, await viewerCheck(body)))}`;
  };
  // { ok: true, text, spaceId, key (32 bytes) }, or { ok: false, reason: "damaged" | "version" }. Spaces and line
  // breaks a chat app put in are ignored; the letters keep their case (base64url is case-sensitive).
  const parseViewer = async (input) => {
    const text = String(input ?? "").replace(/\s+/g, "");
    const match = /^scr(\d+)\.([A-Za-z0-9_-]+)$/i.exec(text);
    if (!match) return { ok: false, reason: "damaged" };
    if (Number(match[1]) !== VIEW_VERSION) return { ok: false, reason: "version" };
    let bytes;
    try { bytes = fromBase64Url(match[2]); } catch { return { ok: false, reason: "damaged" }; }
    if (bytes.length !== VIEW_BYTES) return { ok: false, reason: "damaged" };
    const body = bytes.slice(0, 64);
    const check = await viewerCheck(body);
    if (check.some((byte, i) => byte !== bytes[64 + i])) return { ok: false, reason: "damaged" };
    return { ok: true, text: `${VIEW_PREFIX}${VIEW_VERSION}.${match[2]}`, spaceId: hex(body.slice(0, 32)), key: body.slice(32) };
  };
  // A viewer's keys: the space, a key that can only decrypt, and no write token.
  const viewerKeys = async (input) => {
    const parsed = await parseViewer(input);
    if (!parsed.ok) return null;
    const key = await subtle().importKey("raw", parsed.key, { name: "AES-GCM" }, false, ["decrypt"]);
    return { viewer: true, code: parsed.text, spaceId: parsed.spaceId, writeToken: null, key };
  };

  // ---- What may be shared ----
  const isWork = (key) => (window.WorkBackup ? window.WorkBackup.isWork(key) : typeof key === "string" && key.startsWith("sc-") && !["sc-theme", "sc-print-guide-hidden", TEAM_KEY, STATE_KEY].includes(key));
  const toolSlug = (key) => (window.WorkBackup ? window.WorkBackup.toolSlug(key) : String(key).replace(/^sc-/, "").replace(/-(check|calc|ui)$/, "").replace(/-(de|sq)$/, ""));
  // Personal, never offered: the career tools, the reader's own shelf, reading and cards, coaching, and Site Compare,
  // which holds other teams' read-only codes (secrets of those teams, not work of this one).
  const PERSONAL = /^sc-(cv-builder|ats-cv|cover-letter|shelf|reading|checklists|coaching|site-compare)(?![a-z])/;
  // Settings of the page, the reader and this module, not work of a tool.
  const NOT_TOOL = /^sc-(team|book-|audio-|listen-|import-maps|persist-|restore|theme|print-guide)|-ui$/;
  const offerable = (key) => isWork(key) && !PERSONAL.test(key) && !NOT_TOOL.test(key);
  // Ticked unless the device says otherwise: the action list, the workplace, the timeline events, the floor logs and the hotel boards.
  const DEFAULT_ON = new Set(["action-tracker", "workplace", "annotations", "damage-control", "incomplete-control", "night-audit", "delay-analyzer", "sigma-control-chart", "lost-found", "room-inspection", "maintenance-planner", "safety-cross", "room-status", "guest-complaints"]);
  const isOn = (slug, choices = {}) => (typeof choices[slug] === "boolean" ? choices[slug] : DEFAULT_ON.has(slug));
  // A remote entry is taken only when it could have come from a tool here (work-backup.js checks the logs' shape).
  const soundItem = (key, value) => typeof value === "string" && offerable(key) && (!window.WorkBackup?.sound || window.WorkBackup.sound([key, value]));
  const readPayload = (payload) => {
    if (!payload || typeof payload !== "object" || payload.format !== FORMAT || !READ_VERSIONS.includes(payload.version)) return null;
    const items = payload.items;
    if (!items || typeof items !== "object" || Array.isArray(items)) return null;
    return {
      sent: typeof payload.sent === "string" ? payload.sent : "",
      device: payload.device && typeof payload.device === "object" ? payload.device : null,
      devices: cleanDevices(payload.devices),
      items: Object.fromEntries(Object.entries(items).filter(([key, value]) => soundItem(key, value))),
      deleted: cleanDeleted(payload.deleted),
    };
  };
  // Tombstones as they may come from a team copy: keys that may be shared, ids of up to 200 characters, times in ms.
  const cleanDeleted = (value) => {
    const out = {};
    if (!value || typeof value !== "object" || Array.isArray(value)) return out;
    Object.entries(value).forEach(([key, rows]) => {
      if (!offerable(key) || !rows || typeof rows !== "object" || Array.isArray(rows)) return;
      const kept = Object.entries(rows).filter(([id, at]) => id.length > 0 && id.length <= 200 && Number.isFinite(at) && at > 0);
      if (kept.length) out[key] = Object.fromEntries(kept);
    });
    return out;
  };
  const cleanDevices = (list) => (Array.isArray(list) ? list : [])
    .filter((d) => d && typeof d === "object" && typeof d.id === "string" && /^[0-9a-z]{4,40}$/i.test(d.id))
    .map((d) => ({ id: d.id, name: typeof d.name === "string" ? d.name.slice(0, 60) : "", seen: typeof d.seen === "string" ? d.seen : "" }))
    .slice(0, MAX_DEVICES);
  // This device first, then the others by when they were last seen; ten at most.
  const withDevice = (list, device, now = new Date()) => {
    const others = cleanDevices(list).filter((d) => d.id !== device.id);
    return [{ id: device.id, name: String(device.name || "").slice(0, 60), seen: now.toISOString() }, ...others.sort((a, b) => String(b.seen).localeCompare(String(a.seen)))].slice(0, MAX_DEVICES);
  };
  const deviceFresh = (list, device, now = new Date()) => cleanDevices(list).some((d) => d.id === device.id && d.name === String(device.name || "") && now - new Date(d.seen) < SEEN_MS);

  // ---- Merge ----
  // A short fingerprint of a text (cyrb53), to know whether this device changed something since the last sync.
  const hash = (input) => {
    const text = String(input);
    let h1 = 0xdeadbeef;
    let h2 = 0x41c6ce57;
    for (let i = 0; i < text.length; i++) {
      const c = text.charCodeAt(i);
      h1 = Math.imul(h1 ^ c, 2654435761);
      h2 = Math.imul(h2 ^ c, 1597334677);
    }
    h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
    return (h2 >>> 0).toString(36).padStart(7, "0") + (h1 >>> 0).toString(36).padStart(7, "0");
  };
  const isObject = (value) => value !== null && typeof value === "object" && !Array.isArray(value);
  const isEmpty = (value) => value === undefined || value === null || value === "" || (Array.isArray(value) && !value.length) || (isObject(value) && !Object.keys(value).length);
  const parse = (text) => { try { return JSON.parse(text); } catch { return undefined; } };
  const hasRows = (value) => isObject(value) && Array.isArray(value.rows);
  const rowId = (row) => (isObject(row) && ((typeof row.id === "string" && row.id) || typeof row.id === "number") ? String(row.id) : null);
  const STAMPS = ["updated", "closed", "created"];
  const stampValue = (value) => (typeof value === "number" ? value : Date.parse(value));
  // 1 when a is newer, -1 when b is, 0 when the rows cannot tell.
  const newer = (a, b) => {
    for (const field of STAMPS) {
      const x = a[field];
      const y = b[field];
      if (isEmpty(x) && isEmpty(y)) continue;
      if (isEmpty(x)) return -1;
      if (isEmpty(y)) return 1;
      if (x === y) continue;
      const nx = stampValue(x);
      const ny = stampValue(y);
      if (Number.isFinite(nx) && Number.isFinite(ny) && nx !== ny) return nx > ny ? 1 : -1;
      if (String(x) !== String(y)) return String(x) > String(y) ? 1 : -1;
    }
    return 0;
  };
  // One row both sides have, changed on at least one: the side that did not change it since the last sync gives way;
  // when both did, the newer by updated / closed / created, and the team's copy when that cannot tell.
  const pickRow = (local, remote, synced) => {
    const l = JSON.stringify(local);
    const r = JSON.stringify(remote);
    if (l === r) return local;
    if (synced !== undefined) {
      if (hash(l) === synced) return remote;
      if (hash(r) === synced) return local;
    }
    return newer(local, remote) > 0 ? local : remote;
  };
  // Every row of both, once: by id where rows have one, by their whole content where they do not. A row one side lacks
  // is kept, except a row with a tombstone (dead: { id: ms }, deleted on some device) and a row this device holds as it
  // was last synced that the team's copy no longer has (deleted on the team, its tombstone perhaps gone by now).
  const mergeRows = (localRows, remoteRows, synced = {}, dead = {}) => {
    const out = [];
    const ids = new Set();
    const contents = new Set();
    const remoteById = new Map();
    remoteRows.forEach((row) => {
      const id = rowId(row);
      if (id !== null && !remoteById.has(id)) remoteById.set(id, row);
    });
    const take = (row, other, here = false) => {
      const id = rowId(row);
      if (id === null) {
        const text = JSON.stringify(row);
        if (contents.has(text)) return;
        contents.add(text);
        out.push(row);
        return;
      }
      if (ids.has(id)) return;
      ids.add(id);
      if (Object.prototype.hasOwnProperty.call(dead, id)) return;
      if (here && other === undefined && synced[id] !== undefined && hash(JSON.stringify(row)) === synced[id]) return;
      out.push(other === undefined ? row : pickRow(row, other, synced[id]));
    };
    localRows.forEach((row) => take(row, remoteById.get(rowId(row)), true));
    remoteRows.forEach((row) => take(row));
    return out;
  };
  // The text of a log without the rows that have a tombstone; the very same text when it has none of them.
  const dropDead = (text, dead = {}) => {
    if (typeof text !== "string" || !Object.keys(dead).length) return text;
    const value = parse(text);
    if (!hasRows(value)) return text;
    const rows = value.rows.filter((row) => {
      const id = rowId(row);
      return id === null || !Object.prototype.hasOwnProperty.call(dead, id);
    });
    return rows.length === value.rows.length ? text : JSON.stringify({ ...value, rows });
  };
  // The ids of a log's rows that were in the team's copy at the last sync (base.r) and are no longer in it here.
  const goneHere = (value, base) => {
    if (!hasRows(value) || !base?.r) return [];
    const here = new Set(value.rows.map(rowId).filter((id) => id !== null));
    return Object.keys(base.r).filter((id) => !here.has(id));
  };
  // The fields of both, in this device's order first.
  const fieldsOf = (a, b) => [...new Set([...Object.keys(a), ...Object.keys(b)])];
  // One storage key. local / remote are the stored texts (undefined when that side has none), base what was last
  // synced (TeamSyncMath.baseOf), or nothing before the first sync.
  // dead: the tombstones of this key ({ id: ms }); the rows this device deleted since the last sync count as such too.
  const mergeValue = (local, remote, base = null, dead = {}) => {
    if (local === undefined || local === null) return dropDead(remote, dead);
    if (remote === undefined || remote === null || local === remote) return dropDead(local, dead);
    const l = parse(local);
    const r = parse(remote);
    let out = null;
    if (isObject(l) && isObject(r) && (hasRows(l) || hasRows(r))) {
      // A log: the rows of both; its other fields (settings, a draft) this device's unless empty here.
      const gone = { ...dead };
      goneHere(l, base).forEach((id) => { gone[id] = gone[id] || 1; });
      out = {};
      fieldsOf(l, r).forEach((field) => {
        // What the team's copy lacks counts as deleted on the team only where that copy is a log.
        if (field === "rows") out.rows = mergeRows(Array.isArray(l.rows) ? l.rows : [], Array.isArray(r.rows) ? r.rows : [], hasRows(r) ? base?.r || {} : {}, gone);
        else out[field] = isEmpty(l[field]) && r[field] !== undefined ? r[field] : l[field];
      });
    } else if (isObject(l) && isObject(r)) {
      // Field by field: the team's value where this device has not changed the field since the last sync.
      out = {};
      fieldsOf(l, r).forEach((field) => {
        if (!(field in l)) out[field] = r[field];
        else if (!(field in r)) out[field] = l[field];
        else {
          const lj = JSON.stringify(l[field]);
          out[field] = lj !== JSON.stringify(r[field]) && base?.f?.[field] !== undefined && hash(lj) === base.f[field] ? r[field] : l[field];
        }
      });
    } else {
      // A word, a number, a list: whole, the team's when this device has not changed it since the last sync.
      return base?.h !== undefined && hash(local) === base.h ? remote : local;
    }
    const text = JSON.stringify(out);
    if (text === JSON.stringify(l)) return local;
    if (text === JSON.stringify(r)) return remote;
    return text;
  };
  // local and remote: { storage key: text }; synced: { storage key: base }; deleted: the tombstones, { storage key:
  // { row id: ms } }. Never drops a key one side lacks.
  const merge = (local = {}, remote = {}, synced = {}, deleted = {}) => {
    const out = {};
    fieldsOf(local, remote).forEach((key) => {
      const value = mergeValue(local[key], remote[key], synced[key], deleted[key] || {});
      if (typeof value === "string") out[key] = value;
    });
    return out;
  };
  // The rows this device deleted since the last sync, as tombstones dated `now` (ms).
  const deletedHere = (local = {}, synced = {}, now = Date.now()) => {
    const out = {};
    Object.entries(local).forEach(([key, text]) => {
      const ids = goneHere(parse(text), synced[key]);
      if (ids.length) out[key] = Object.fromEntries(ids.map((id) => [id, now]));
    });
    return out;
  };
  // Several lists of tombstones as one, with the latest time of each row.
  const joinDeleted = (...lists) => {
    const out = {};
    lists.forEach((list) => Object.entries(cleanDeleted(list)).forEach(([key, rows]) => {
      out[key] = out[key] || {};
      Object.entries(rows).forEach(([id, at]) => { out[key][id] = Math.max(out[key][id] || 0, at); });
    }));
    return out;
  };
  // Without the tombstones older than 90 days; the newest MAX_DELETED at most.
  const purgeDeleted = (deleted, now = Date.now(), max = MAX_DELETED) => {
    const all = [];
    Object.entries(cleanDeleted(deleted)).forEach(([key, rows]) => Object.entries(rows).forEach(([id, at]) => {
      if (now - at < TOMBSTONE_MS) all.push([key, id, at]);
    }));
    all.sort((a, b) => b[2] - a[2]);
    const out = {};
    all.slice(0, max).forEach(([key, id, at]) => {
      out[key] = out[key] || {};
      out[key][id] = at;
    });
    return out;
  };
  // Each text without the rows that have a tombstone.
  const applyDeleted = (items, deleted = {}) => Object.fromEntries(Object.entries(items).map(([key, text]) => [key, dropDead(text, deleted[key] || {})]));
  // The same tombstones, in any order.
  const sameDeleted = (a = {}, b = {}) => {
    const flat = (list) => Object.entries(list).flatMap(([key, rows]) => Object.entries(rows).map(([id, at]) => `${key}\n${id}\n${at}`)).sort().join("\n\n");
    return flat(a) === flat(b);
  };
  // What a device keeps of the synced texts: a fingerprint of each, of each field of an object, of each row of a log.
  const baseOf = (items) => Object.fromEntries(Object.entries(items).map(([key, text]) => {
    const value = parse(text);
    const base = { h: hash(text) };
    if (hasRows(value)) {
      base.r = {};
      value.rows.forEach((row) => {
        const id = rowId(row);
        if (id !== null && !(id in base.r)) base.r[id] = hash(JSON.stringify(row));
      });
    } else if (isObject(value)) {
      base.f = Object.fromEntries(Object.entries(value).map(([field, v]) => [field, hash(JSON.stringify(v))]));
    }
    return [key, base];
  }));
  const changedSince = (items, synced = {}) => Object.keys(items).filter((key) => synced[key]?.h !== hash(items[key]));
  const sameItems = (a, b) => {
    const keys = Object.keys(a);
    return keys.length === Object.keys(b).length && keys.every((key) => b[key] === a[key]);
  };

  // ---- QR code (ISO/IEC 18004): byte mode, error correction level M, versions 1 to 40 ----
  // A team code (about 35 characters) fits version 3; a handover sent as a link (js/shift-handover.js, up to 2331
  // bytes) may need the largest. The matrix is an array of rows of 0 and 1.
  // Level M by version: error correction codewords in each block, and how many blocks. The codewords a version holds
  // follow from its size (the modules left once the finders, timing, alignment, format and version areas are placed),
  // and the data splits into the blocks as evenly as it can, the longer ones last, as the standard's table has it.
  const QR_EC = [null, 10, 16, 26, 18, 24, 16, 18, 22, 22, 26, 30, 22, 22, 24, 24, 28, 28, 26, 26, 26, 26, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28, 28];
  const QR_BLOCKS = [null, 1, 1, 1, 2, 2, 4, 4, 4, 5, 5, 5, 8, 9, 9, 10, 10, 11, 13, 14, 16, 17, 17, 18, 20, 21, 23, 25, 26, 28, 29, 31, 33, 35, 37, 38, 40, 43, 45, 47, 49];
  // The centres of the alignment patterns: 6, then evenly up to the last one, with an even step (version 32 is the
  // standard's one exception to the rounding).
  const qrAlign = (version) => {
    if (version === 1) return [];
    const n = version * 4 + 17;
    const count = Math.floor(version / 7) + 2;
    const step = version === 32 ? 26 : Math.ceil((n - 13) / (2 * count - 2)) * 2;
    const out = [6];
    for (let i = count - 1, at = n - 7; i >= 1; i--, at -= step) out.splice(1, 0, at);
    return out;
  };
  const qrTotal = (version) => {
    const n = version * 4 + 17;
    const align = qrAlign(version).length;
    const alignment = align ? (align * align - 3) * 25 - (align - 2) * 2 * 5 : 0;
    return Math.floor((n * n - 192 - 2 * (n - 16) - alignment - 31 - (version >= 7 ? 36 : 0)) / 8);
  };
  const QR_M = [null];
  const QR_ALIGN = [null];
  for (let version = 1; version <= 40; version++) {
    const ec = QR_EC[version];
    const blocks = QR_BLOCKS[version];
    const data = qrTotal(version) - ec * blocks;
    const short = Math.floor(data / blocks);
    const longer = data % blocks;
    // [error correction codewords per block, blocks in group 1, data codewords each, blocks in group 2, data codewords each]
    QR_M.push([ec, blocks - longer, short, longer, longer ? short + 1 : 0]);
    QR_ALIGN.push(qrAlign(version));
  }
  const GF_EXP = new Array(512);
  const GF_LOG = new Array(256);
  for (let i = 0, x = 1; i < 255; i++) {
    GF_EXP[i] = x;
    GF_LOG[x] = i;
    x <<= 1;
    if (x & 0x100) x ^= 0x11d;
  }
  for (let i = 255; i < 512; i++) GF_EXP[i] = GF_EXP[i - 255];
  const gfMul = (a, b) => (a && b ? GF_EXP[GF_LOG[a] + GF_LOG[b]] : 0);
  // The generator polynomial of degree n, highest power first (its leading 1 left out).
  const rsGenerator = (n) => {
    let poly = [1];
    for (let i = 0; i < n; i++) {
      const next = new Array(poly.length + 1).fill(0);
      poly.forEach((c, j) => {
        next[j] ^= c;
        next[j + 1] ^= gfMul(c, GF_EXP[i]);
      });
      poly = next;
    }
    return poly.slice(1);
  };
  const rsRemainder = (data, n) => {
    const gen = rsGenerator(n);
    const rest = new Array(n).fill(0);
    for (const byte of data) {
      const factor = byte ^ rest.shift();
      rest.push(0);
      gen.forEach((c, i) => { rest[i] ^= gfMul(c, factor); });
    }
    return rest;
  };
  const qrCapacity = (version) => {
    const [, b1, d1, b2, d2] = QR_M[version];
    return b1 * d1 + b2 * d2;
  };
  // The codewords of the message: mode, length, the bytes, terminator and padding, then error correction, interleaved.
  const qrCodewords = (bytes, version) => {
    const [ec, b1, d1, b2, d2] = QR_M[version];
    const capacity = qrCapacity(version);
    const bits = [];
    const put = (value, length) => { for (let i = length - 1; i >= 0; i--) bits.push((value >>> i) & 1); };
    put(0b0100, 4);
    put(bytes.length, version < 10 ? 8 : 16);
    bytes.forEach((byte) => put(byte, 8));
    put(0, Math.min(4, capacity * 8 - bits.length));
    while (bits.length % 8) bits.push(0);
    const data = [];
    for (let i = 0; i < bits.length; i += 8) data.push(bits.slice(i, i + 8).reduce((v, bit) => (v << 1) | bit, 0));
    for (let pad = 0; data.length < capacity; pad++) data.push(pad % 2 ? 0x11 : 0xec);
    const blocks = [];
    let at = 0;
    for (let i = 0; i < b1 + b2; i++) {
      const size = i < b1 ? d1 : d2;
      const block = data.slice(at, at + size);
      at += size;
      blocks.push({ data: block, ec: rsRemainder(block, ec) });
    }
    const out = [];
    for (let i = 0; i < Math.max(d1, d2); i++) blocks.forEach((block) => { if (i < block.data.length) out.push(block.data[i]); });
    for (let i = 0; i < ec; i++) blocks.forEach((block) => out.push(block.ec[i]));
    return out;
  };
  // BCH code of the format (5 bits) and version (6 bits) information.
  const bch = (value, poly, length) => {
    let rest = value << length;
    const top = Math.floor(Math.log2(poly));
    while (rest && Math.floor(Math.log2(rest)) >= top) rest ^= poly << (Math.floor(Math.log2(rest)) - top);
    return (value << length) | rest;
  };
  const QR_MASKS = [
    (r, c) => (r + c) % 2 === 0,
    (r) => r % 2 === 0,
    (r, c) => c % 3 === 0,
    (r, c) => (r + c) % 3 === 0,
    (r, c) => (Math.floor(r / 2) + Math.floor(c / 3)) % 2 === 0,
    (r, c) => ((r * c) % 2) + ((r * c) % 3) === 0,
    (r, c) => (((r * c) % 2) + ((r * c) % 3)) % 2 === 0,
    (r, c) => (((r + c) % 2) + ((r * c) % 3)) % 2 === 0,
  ];
  // The four penalty rules of the standard; the mask with the lowest score is used.
  const qrPenalty = (m) => {
    const n = m.length;
    let score = 0;
    const line = (get) => {
      for (let i = 0; i < n; i++) {
        let run = 1;
        for (let j = 1; j <= n; j++) {
          if (j < n && get(i, j) === get(i, j - 1)) run++;
          else {
            if (run >= 5) score += run - 2;
            run = 1;
          }
        }
        for (let j = 0; j + 10 < n; j++) {
          const seq = Array.from({ length: 11 }, (_, k) => get(i, j + k)).join("");
          if (seq === "10111010000" || seq === "00001011101") score += 40;
        }
      }
    };
    line((i, j) => m[i][j]);
    line((i, j) => m[j][i]);
    for (let r = 0; r < n - 1; r++) for (let c = 0; c < n - 1; c++) {
      const v = m[r][c];
      if (v === m[r][c + 1] && v === m[r + 1][c] && v === m[r + 1][c + 1]) score += 3;
    }
    const dark = m.reduce((sum, row) => sum + row.reduce((a, b) => a + b, 0), 0);
    score += Math.floor(Math.abs(dark * 20 - n * n * 10) / (n * n)) * 10;
    return score;
  };
  const qrEncode = (text, forceMask = -1) => {
    const bytes = [...utf8(String(text))];
    let version = 1;
    while (version <= 40 && qrCapacity(version) * 8 < 4 + (version < 10 ? 8 : 16) + bytes.length * 8) version++;
    if (version > 40) return null;
    const n = version * 4 + 17;
    const m = Array.from({ length: n }, () => new Array(n).fill(0));
    const fixed = Array.from({ length: n }, () => new Array(n).fill(false));
    const set = (r, c, v) => { m[r][c] = v ? 1 : 0; fixed[r][c] = true; };
    // Finders with their separators, timing patterns, alignment patterns, the dark module.
    for (const [fr, fc] of [[0, 0], [0, n - 7], [n - 7, 0]]) {
      for (let r = -1; r <= 7; r++) for (let c = -1; c <= 7; c++) {
        const rr = fr + r;
        const cc = fc + c;
        if (rr < 0 || cc < 0 || rr >= n || cc >= n) continue;
        const ring = Math.max(Math.abs(r - 3), Math.abs(c - 3));
        set(rr, cc, ring !== 2 && ring !== 4);
      }
    }
    for (let i = 8; i < n - 8; i++) {
      set(6, i, i % 2 === 0);
      set(i, 6, i % 2 === 0);
    }
    const align = QR_ALIGN[version];
    for (const r of align) for (const c of align) {
      if ((r === 6 && c === 6) || (r === 6 && c === align[align.length - 1]) || (r === align[align.length - 1] && c === 6)) continue;
      for (let dr = -2; dr <= 2; dr++) for (let dc = -2; dc <= 2; dc++) set(r + dr, c + dc, Math.max(Math.abs(dr), Math.abs(dc)) !== 1);
    }
    set(n - 8, 8, 1);
    // Reserve the format and version areas; they are written once the mask is chosen.
    for (let i = 0; i < 9; i++) {
      if (!fixed[8][i]) set(8, i, 0);
      if (!fixed[i][8]) set(i, 8, 0);
    }
    for (let i = 0; i < 8; i++) {
      set(8, n - 1 - i, 0);
      if (!fixed[n - 1 - i][8]) set(n - 1 - i, 8, 0);
    }
    if (version >= 7) for (let i = 0; i < 6; i++) for (let j = 0; j < 3; j++) { set(i, n - 11 + j, 0); set(n - 11 + j, i, 0); }
    // The codewords, two columns at a time from the bottom right, up and down in turn, skipping the timing column.
    const words = qrCodewords(bytes, version);
    let bit = 0;
    for (let right = n - 1, up = true; right >= 1; right -= 2, up = !up) {
      if (right === 6) right = 5;
      for (let k = 0; k < n; k++) {
        const r = up ? n - 1 - k : k;
        for (const c of [right, right - 1]) {
          if (fixed[r][c]) continue;
          m[r][c] = bit < words.length * 8 ? (words[bit >> 3] >>> (7 - (bit & 7))) & 1 : 0;
          bit++;
        }
      }
    }
    const withMask = (mask) => {
      const out = m.map((row, r) => row.map((v, c) => (fixed[r][c] ? v : v ^ (QR_MASKS[mask](r, c) ? 1 : 0))));
      // Format: level M is 00, then the mask; BCH(15,5), masked with 101010000010010.
      const format = bch(mask, 0x537, 10) ^ 0x5412;
      const fbit = (i) => (format >>> i) & 1;
      for (let i = 0; i < 15; i++) {
        const v = fbit(i);
        // Around the top-left finder, skipping the timing pattern...
        if (i < 6) out[i][8] = v;
        else if (i === 6) out[7][8] = v;
        else if (i === 7) out[8][8] = v;
        else if (i === 8) out[8][7] = v;
        else out[8][14 - i] = v;
        // ...and split between the other two.
        if (i < 8) out[8][n - 1 - i] = v;
        else out[n - 15 + i][8] = v;
      }
      if (version >= 7) {
        const info = bch(version, 0x1f25, 12);
        for (let i = 0; i < 18; i++) {
          const v = (info >>> i) & 1;
          const a = Math.floor(i / 3);
          const b = (i % 3) + n - 11;
          out[a][b] = v;
          out[b][a] = v;
        }
      }
      return out;
    };
    let best = null;
    for (let mask = 0; mask < 8; mask++) {
      if (forceMask >= 0 && mask !== forceMask) continue;
      const candidate = withMask(mask);
      const score = qrPenalty(candidate);
      if (!best || score < best.score) best = { score, matrix: candidate, mask, version };
    }
    return best;
  };
  // The matrix as an SVG drawing, dark on white with the quiet zone of four modules scanners need, in either theme.
  const qrSvg = (matrix, label = "") => {
    const n = matrix.length;
    const quiet = 4;
    const size = n + quiet * 2;
    let path = "";
    matrix.forEach((row, r) => {
      for (let c = 0; c < n;) {
        if (!row[c]) { c++; continue; }
        let end = c;
        while (end < n && row[end]) end++;
        path += `M${c + quiet} ${r + quiet}h${end - c}v1h-${end - c}z`;
        c = end;
      }
    });
    const safe = String(label).replace(/[&<>"]/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[ch]);
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" role="img" aria-label="${safe}" shape-rendering="crispEdges"><rect width="${size}" height="${size}" fill="#fff"/><path d="${path}" fill="#000"/></svg>`;
  };

  // ---- One sync ----
  const collect = (storage, wanted) => {
    const items = {};
    if (!storage) return items;
    for (let i = 0; i < storage.length; i++) {
      const key = storage.key(i);
      if (wanted(key)) {
        const value = storage.getItem(key);
        if (typeof value === "string") items[key] = value;
      }
    }
    return items;
  };
  const pick = (items, keys) => Object.fromEntries(keys.map((key) => [key, items[key]]));
  const replaceItems = (storage, items) => {
    if (window.StorageGuardMath) return window.StorageGuardMath.replaceItems(storage, items);
    const before = new Map(Object.keys(items).map((key) => [key, storage.getItem(key)]));
    const written = [];
    for (const key of Object.keys(items)) {
      try { storage.setItem(key, items[key]); written.push(key); } catch {
        written.forEach((done) => { try { if (before.get(done) === null) storage.removeItem(done); else storage.setItem(done, before.get(done)); } catch { /* it fitted before */ } });
        return false;
      }
    }
    return true;
  };
  const readJson = (storage, key) => { try { const value = JSON.parse(storage.getItem(key)); return isObject(value) ? value : null; } catch { return null; } };
  const writeJson = (storage, key, value) => { try { storage.setItem(key, JSON.stringify(value)); return true; } catch { return false; } };
  const readState = (storage) => readJson(storage, STATE_KEY) || {};
  const newDeviceId = () => hex(globalThis.crypto.getRandomValues(new Uint8Array(8)));

  const spaceUrl = (endpoint, spaceId) => `${String(endpoint).replace(/\/+$/, "")}/v1/spaces/${spaceId}`;
  const answer = async (response) => { try { return await response.json(); } catch { return null; } };
  const sealedBox = (box) => Boolean(box && typeof box.data === "string" && typeof box.iv === "string" && Number.isInteger(box.rev));

  // ctx: { endpoint, fetch, storage, keys (deriveKeys), selected(key), beforeWrite(keys), create (a 404 may start the
  // team's copy), now(), wait(ms) }. Returns { status, changed, rev, size, devices, code? }; status is "synced",
  // "offline", "gone" (no copy on the server), "unreadable", "refused", "too-large", "busy", "conflict", "full" or "error".
  // Keys without a write token (a read-only code) only ever read: pullOnce.
  const syncOnce = async (ctx) => {
    const { storage, keys } = ctx;
    if (!keys.writeToken) return pullOnce(ctx);
    const now = ctx.now || (() => new Date());
    const wait = ctx.wait || ((ms) => new Promise((resolve) => setTimeout(resolve, ms)));
    const url = spaceUrl(ctx.endpoint, keys.spaceId);
    const call = async (init, at = url) => {
      try { return await ctx.fetch(at, { cache: "no-store", ...init }); } catch { return null; }
    };
    const body = async (response) => { try { return await response.json(); } catch { return null; } };
    for (let attempt = 0; attempt < 2; attempt++) {
      const state = readState(storage);
      let got = await call({ method: "GET" });
      if (!got) return { status: "offline" };
      // Nothing at the address: a team made before keeps its copy at the old one. Read there, it goes up to the
      // new address (revision 0, a new space) and the old space is deleted once that went through.
      let moving = false;
      if (got.status === 404 && keys.legacy && HEX64.test(keys.legacy.spaceId)) {
        const old = await call({ method: "GET" }, spaceUrl(ctx.endpoint, keys.legacy.spaceId));
        if (!old) return { status: "offline" };
        if (old.ok) { got = old; moving = true; }
      }
      let rev = 0;
      let remote = null;
      let size = 0;
      if (got.status === 404) {
        if (!ctx.create) return { status: "gone" };
      } else if (got.ok) {
        const box = await body(got);
        if (!box || typeof box.data !== "string" || typeof box.iv !== "string" || !Number.isInteger(box.rev)) return { status: "unreadable" };
        rev = moving ? 0 : box.rev;
        size = box.data.length;
        try { remote = readPayload(await unseal(box, keys.key)); } catch { remote = null; }
        if (!remote) return { status: "unreadable" };
      } else return { status: got.status === 403 || got.status === 401 ? "refused" : "error", code: got.status };

      const deviceId = state.deviceId || newDeviceId();
      const device = { id: deviceId, name: state.deviceName || "" };
      const shared = (key) => offerable(key) && ctx.selected(key);
      const remoteItems = remote ? remote.items : {};
      const local = collect(storage, shared);
      const remoteShared = Object.fromEntries(Object.entries(remoteItems).filter(([key]) => shared(key)));
      // A copy that was gone and is back may be another team's start: nothing here is measured against the old one.
      const base = state.gone ? {} : state.synced || {};
      const at = now().getTime();
      const deleted = purgeDeleted(joinDeleted(remote?.deleted, state.deleted, deletedHere(local, base, at)), at);
      const merged = merge(local, remoteShared, base, deleted);
      const changed = Object.keys(merged).filter((key) => merged[key] !== local[key]);
      if (changed.length) {
        try { await ctx.beforeWrite?.(changed); } catch { /* written as before */ }
        if (!replaceItems(storage, pick(merged, changed))) return { status: "full" };
      }
      // This device now holds the team's copy as it was read: that is what later changes are measured against, even
      // if the upload below does not go through.
      const synced = { ...base, ...baseOf(remoteShared) };
      // The tools this device does not share lose their deleted rows in the team's copy too.
      const out = applyDeleted({ ...remoteItems, ...merged }, deleted);
      const devices = withDevice(remote?.devices, device, now());
      const keep = (extra) => writeJson(storage, STATE_KEY, { ...readState(storage), deviceId, synced, deleted, teamKeys: Object.keys(out), ...extra });
      const space = keys.spaceId;
      if (!moving && remote && sameItems(out, remoteItems) && sameDeleted(deleted, remote.deleted) && deviceFresh(remote.devices, device, now())) {
        keep({ rev, size, devices: remote.devices, lastSync: now().toISOString(), gone: false, space });
        return { status: "synced", changed, rev, size, devices: remote.devices, uploaded: false };
      }
      keep({ gone: false });
      const payload = { format: FORMAT, version: VERSION, sent: now().toISOString(), device, devices, items: out, deleted };
      const sealed = await seal(payload, keys.key);
      if (sealed.data.length > MAX_BYTES) return { status: "too-large", changed };
      const put = () => call({ method: "PUT", headers: { Authorization: `Bearer ${keys.writeToken}`, "Content-Type": "application/json" }, body: JSON.stringify({ rev, ...sealed }) });
      let response = await put();
      if (response && response.status === 429) {
        await wait(2000);
        response = await put();
      }
      if (!response) return { status: "offline", changed };
      if (response.status === 409) continue;
      if (response.status === 429) return { status: "busy", changed };
      if (response.status === 413) return { status: "too-large", changed };
      if (response.status === 403 || response.status === 401) return { status: "refused", changed };
      if (!response.ok) return { status: "error", code: response.status, changed };
      const saved = (await body(response)) || {};
      const newRev = Number.isInteger(saved.rev) ? saved.rev : rev + 1;
      writeJson(storage, STATE_KEY, { ...readState(storage), deviceId, synced: { ...base, ...baseOf(merged) }, deleted, teamKeys: Object.keys(out), rev: newRev, size: sealed.data.length, devices, lastSync: now().toISOString(), gone: false, space });
      if (moving) {
        // The copy is at its new address: the old one goes, now or at a later sync (retireOld).
        const outcome = await deleteCopy({ endpoint: ctx.endpoint, fetch: ctx.fetch, keys: keys.legacy });
        const saved = readJson(storage, TEAM_KEY);
        if (outcome !== "deleted" && saved) writeJson(storage, TEAM_KEY, { ...saved, retire: [...retireList(storage), { spaceId: keys.legacy.spaceId, writeToken: keys.legacy.writeToken }].slice(-5) });
      }
      return { status: "synced", changed, rev: newRev, size: sealed.data.length, devices, uploaded: true, moved: moving };
    }
    return { status: "conflict" };
  };
  // A read-only device: GET → decrypt → for every ticked tool the team's copy has, the team's version, written after a
  // restore point (beforeWrite) when it differs from this device's. Nothing goes up: no PUT, no DELETE, not even to
  // say the device was seen, so a viewer is never on the team's list of devices.
  const pullOnce = async (ctx) => {
    const { storage, keys } = ctx;
    const now = ctx.now || (() => new Date());
    let got = null;
    try { got = await ctx.fetch(spaceUrl(ctx.endpoint, keys.spaceId), { method: "GET", cache: "no-store" }); } catch { got = null; }
    if (!got) return { status: "offline" };
    if (got.status === 404) return { status: "gone" };
    if (!got.ok) return { status: got.status === 403 || got.status === 401 ? "refused" : "error", code: got.status };
    const box = await answer(got);
    if (!sealedBox(box)) return { status: "unreadable" };
    let remote = null;
    try { remote = readPayload(await unseal(box, keys.key)); } catch { remote = null; }
    if (!remote) return { status: "unreadable" };
    const shared = (key) => offerable(key) && ctx.selected(key);
    const team = Object.fromEntries(Object.entries(remote.items).filter(([key]) => shared(key)));
    const changed = Object.keys(team).filter((key) => storage.getItem(key) !== team[key]);
    if (changed.length) {
      try { await ctx.beforeWrite?.(changed); } catch { /* written as before */ }
      if (!replaceItems(storage, pick(team, changed))) return { status: "full" };
    }
    // What the device now holds of the team's copy: a later change here is measured against it (the warning that
    // the next sync will replace it).
    writeJson(storage, STATE_KEY, { ...readState(storage), viewer: true, synced: baseOf(team), teamKeys: Object.keys(remote.items), rev: box.rev, size: box.data.length, devices: remote.devices, lastSync: now().toISOString(), gone: false });
    return { status: "synced", changed, rev: box.rev, size: box.data.length, devices: remote.devices, uploaded: false };
  };
  // A look at another team's copy for a page that reads it without joining (site-compare.js): a read-only code only,
  // one GET, decrypt, and the payload's tools back to the caller. It sends no PUT and no DELETE, writes nothing to
  // storage, makes no restore point and leaves this browser's own team (sc-team, sc-team-state) alone. A six-word
  // team code is refused before anything is derived from it: whoever compares must not hold the right to write.
  // Returns { status: "ok", sent, items, rev, updated }, or { status } with "team-code", "damaged", "version",
  // "no-crypto", "off" (no server), "offline", "gone", "refused", "unreadable" or "error" (with code).
  const readTeamCopy = async (input, ctx = {}) => {
    if (!canEncrypt()) return { status: "no-crypto" };
    if (!looksViewer(input)) return { status: parseCode(input).ok ? "team-code" : "damaged" };
    const parsed = await parseViewer(input);
    if (!parsed.ok) return { status: parsed.reason };
    const endpoint = ctx.endpoint ?? document.querySelector("[data-team-sync]")?.dataset.endpoint ?? "";
    if (!endpoint) return { status: "off" };
    const keys = await viewerKeys(parsed.text);
    const get = ctx.fetch || ((...args) => window.fetch(...args));
    let got = null;
    try { got = await get(spaceUrl(endpoint, keys.spaceId), { method: "GET", cache: "no-store" }); } catch { got = null; }
    if (!got) return { status: "offline" };
    if (got.status === 404) return { status: "gone" };
    if (!got.ok) return { status: got.status === 403 || got.status === 401 ? "refused" : "error", code: got.status };
    const box = await answer(got);
    if (!sealedBox(box)) return { status: "unreadable" };
    let remote = null;
    try { remote = readPayload(await unseal(box, keys.key)); } catch { remote = null; }
    if (!remote) return { status: "unreadable" };
    // The team's device names stay out: the caller needs the work, not who carries it.
    return { status: "ok", sent: remote.sent, items: remote.items, rev: box.rev, updated: Number.isFinite(box.updated) ? box.updated : null };
  };
  // The copy at the address of the keys and, for a team made before, the one at its old address too.
  const deleteCopy = async ({ endpoint, fetch, keys }) => {
    if (!keys?.writeToken) return "refused";
    const one = async ({ spaceId, writeToken }) => {
      try {
        const response = await fetch(spaceUrl(endpoint, spaceId), { method: "DELETE", headers: { Authorization: `Bearer ${writeToken}` } });
        return response.status === 204 || response.status === 404 ? "deleted" : response.status === 403 || response.status === 401 ? "refused" : "error";
      } catch { return "offline"; }
    };
    const result = await one(keys);
    if (result !== "deleted" || !keys.legacy?.writeToken) return result;
    return one(keys.legacy);
  };

  // Old spaces still to delete after a change of code, kept with the team code in sc-team (never in a saved file).
  const retireList = (storage) => {
    const saved = readJson(storage, TEAM_KEY);
    return (Array.isArray(saved?.retire) ? saved.retire : []).filter((item) => item && HEX64.test(item.spaceId) && HEX64.test(item.writeToken));
  };
  // Tries to delete each; "deleted" when none is left, else the reason of the last that failed.
  const retireOld = async ({ endpoint, fetch, storage }) => {
    const list = retireList(storage);
    if (!list.length) return "deleted";
    let result = "deleted";
    const left = [];
    for (const item of list) {
      const outcome = await deleteCopy({ endpoint, fetch, keys: item });
      if (outcome !== "deleted") { left.push(item); result = outcome; }
    }
    const saved = readJson(storage, TEAM_KEY);
    if (saved) {
      if (left.length) saved.retire = left;
      else delete saved.retire;
      writeJson(storage, TEAM_KEY, saved);
    }
    return result;
  };

  // Change the team code, for when someone leaves. In this order, each step only once the one before went through:
  // 1. a sync with the old team (pull, merge, push), so the copy holds this device's work and everyone's latest;
  // 2. the team's whole copy read back, the tools other devices share included;
  // 3. that copy sealed with the keys of a new code and uploaded as the first version of the new space;
  // 4. the new code kept on this device; 5. the old space deleted with the old token.
  // Until 3 has gone through nothing changes here and the device keeps the old team. When 5 fails the old space is
  // kept in "retire" and deleted at a later sync. ctx as syncOnce, plus newCode() and derive(code) for the tests.
  // Returns { status: "rotated", code, keys, rev, deleted, changed } or { status, code?, stage: "sync" | "read" |
  // "upload", changed? }.
  const rotate = async (ctx) => {
    const { storage, keys: old } = ctx;
    const now = ctx.now || (() => new Date());
    if (!old.writeToken) return { status: "refused", stage: "sync" };
    const first = await syncOnce({ ...ctx, create: false });
    if (first.status !== "synced") return { ...first, stage: "sync" };
    const fail = (outcome) => ({ ...outcome, changed: first.changed || [] });
    let got = null;
    try { got = await ctx.fetch(spaceUrl(ctx.endpoint, old.spaceId), { method: "GET", cache: "no-store" }); } catch { got = null; }
    if (!got) return fail({ status: "offline", stage: "read" });
    if (!got.ok) return fail({ status: got.status === 404 ? "gone" : "error", code: got.status, stage: "read" });
    const box = await answer(got);
    let remote = null;
    try { remote = sealedBox(box) ? readPayload(await unseal(box, old.key)) : null; } catch { remote = null; }
    if (!remote) return fail({ status: "unreadable", stage: "read" });
    const code = (ctx.newCode || newCode)();
    const next = await (ctx.derive || deriveKeys)(code);
    const state = readState(storage);
    const device = { id: state.deviceId || newDeviceId(), name: state.deviceName || "" };
    // Only this device: the others are on the list again once they have joined with the new code.
    const devices = withDevice([], device, now());
    const sealed = await seal({ format: FORMAT, version: VERSION, sent: now().toISOString(), device, devices, items: remote.items, deleted: remote.deleted }, next.key);
    if (sealed.data.length > MAX_BYTES) return fail({ status: "too-large", stage: "upload" });
    let put = null;
    try {
      put = await ctx.fetch(spaceUrl(ctx.endpoint, next.spaceId), { method: "PUT", cache: "no-store", headers: { Authorization: `Bearer ${next.writeToken}`, "Content-Type": "application/json" }, body: JSON.stringify({ rev: 0, ...sealed }) });
    } catch { put = null; }
    if (!put || !put.ok) {
      // The answer was lost on the way: the new space may exist all the same. Nobody else has its code; it goes.
      if (!put) await deleteCopy({ endpoint: ctx.endpoint, fetch: ctx.fetch, keys: { spaceId: next.spaceId, writeToken: next.writeToken } });
      const status = !put ? "offline" : put.status === 413 ? "too-large" : put.status === 429 ? "busy" : put.status === 409 ? "conflict" : put.status === 403 || put.status === 401 ? "refused" : "error";
      return fail({ status, code: put?.status, stage: "upload" });
    }
    const saved = (await answer(put)) || {};
    const rev = Number.isInteger(saved.rev) ? saved.rev : 1;
    // From here this device is in the new team, whatever happens to the old copy.
    writeJson(storage, TEAM_KEY, { code, since: now().toISOString(), retire: [...retireList(storage), { spaceId: old.spaceId, writeToken: old.writeToken }].slice(-5) });
    writeJson(storage, STATE_KEY, { ...readState(storage), deviceId: device.id, rev, size: sealed.data.length, devices, teamKeys: Object.keys(remote.items), lastSync: now().toISOString(), gone: false, space: next.spaceId });
    const deleted = await retireOld({ endpoint: ctx.endpoint, fetch: ctx.fetch, storage });
    return { status: "rotated", code, keys: next, rev, deleted, changed: first.changed || [] };
  };

  // Work put back by hand (a restore point, a saved file) for these keys: the rows it lacks were not deleted here, so
  // the next sync takes them from the team again instead of deleting them on every device. What was last synced
  // forgets them; the tombstones this device knows stay.
  const rebase = (storage, keys) => {
    const state = readState(storage);
    if (!isObject(state.synced)) return false;
    const synced = { ...state.synced };
    let changed = false;
    keys.forEach((key) => {
      const ids = goneHere(parse(storage.getItem(key)) ?? { rows: [] }, synced[key]);
      if (!ids.length) return;
      const r = { ...synced[key].r };
      ids.forEach((id) => { delete r[id]; });
      synced[key] = { ...synced[key], r };
      changed = true;
    });
    return changed ? writeJson(storage, STATE_KEY, { ...state, synced }) : false;
  };

  window.TeamSyncMath = {
    FORMAT, VERSION, SALT, ID_SALT, ITERATIONS, WORDS, BITS, DEFAULT_ON, VIEW_VERSION, TOMBSTONE_DAYS,
    newCode, parseCode, normalise, deriveKeys, seal, unseal, toBase64, fromBase64, toBase64Url, fromBase64Url,
    looksViewer, viewerCode, parseViewer, viewerKeys,
    offerable, isOn, readPayload, withDevice, deviceFresh,
    hash, newer, mergeRows, mergeValue, merge, baseOf, changedSince, sameItems,
    deletedHere, joinDeleted, purgeDeleted, applyDeleted,
    qrEncode, qrSvg,
  };
  window.TeamSync = { syncOnce, pullOnce, readTeamCopy, deleteCopy, rotate, retireOld, retireList, rebase, TEAM_KEY, STATE_KEY };

  // ---- The section in the box ----
  const root = document.querySelector("[data-team-sync]");
  if (!root) return;
  const storage = (() => {
    try { const probe = window.localStorage; probe.length; return probe; } catch { return null; }
  })();
  const text = (() => { try { return JSON.parse(root.dataset.text || "{}"); } catch { return {}; } })();
  const endpoint = root.dataset.endpoint || "";
  const names = (() => { try { return JSON.parse(document.getElementById("work-backup-names")?.textContent || "{}"); } catch { return {}; } })();
  const lang = document.documentElement.lang || "en";
  const fill = (template, vars = {}) => String(template || "").replace(/\{(\w+)\}/g, (match, name) => (name in vars ? vars[name] : match));
  const $ = (selector) => root.querySelector(selector);
  const pad = (n) => String(n).padStart(2, "0");
  const localDay = (date) => `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
  const when = (iso) => {
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) return "?";
    const time = `${pad(date.getHours())}:${pad(date.getMinutes())}`;
    const now = new Date();
    if (localDay(date) === localDay(now)) return fill(text.today, { time });
    if (localDay(date) === localDay(new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1))) return fill(text.yesterday, { time });
    return `${lang === "en" ? localDay(date) : `${pad(date.getDate())}.${pad(date.getMonth() + 1)}.${date.getFullYear()}`} ${time}`;
  };
  const size = (bytes) => (window.StorageGuardMath ? window.StorageGuardMath.formatBytes(bytes, lang) : `${Math.max(1, Math.round(bytes / 1024))} KB`);
  const nameOf = (slug) => names[slug] || slug;

  if (!storage || !endpoint || !canEncrypt()) {
    $("[data-tm-summary]").textContent = text.off || "";
    $("[data-tm-off]").hidden = true;
    $("[data-tm-message]").textContent = storage ? text.noCrypto : "";
    return;
  }
  // Locked for a shared computer (js/work-lock.js): the team code is in the locked record, and starting or joining a
  // team now would bring the team's work here in plain text. Nothing until the PIN.
  if (window.WorkLock?.locked) {
    $("[data-tm-summary]").textContent = text.off || "";
    $("[data-tm-off]").hidden = true;
    $("[data-tm-message]").textContent = text.locked || "";
    return;
  }

  // { code, since, retire? } for a member, { viewer, since } for a read-only device.
  const team = () => {
    const saved = readJson(storage, TEAM_KEY);
    return saved && (parseCode(saved.code).ok || (typeof saved.viewer === "string" && looksViewer(saved.viewer))) ? saved : null;
  };
  const isViewer = () => Boolean(team()?.viewer);
  let keysFor = null;
  const keys = async () => {
    const current = team();
    if (!current) return null;
    const id = current.viewer || normalise(current.code);
    if (!keysFor || keysFor.code !== id) keysFor = current.viewer ? await viewerKeys(current.viewer) : await deriveKeys(current.code);
    return keysFor;
  };
  const state = () => readState(storage);
  const setState = (patch) => writeJson(storage, STATE_KEY, { ...state(), ...patch });
  const slugsHere = () => {
    const keysHere = [...Object.keys(collect(storage, offerable)), ...(state().teamKeys || []).filter(offerable)];
    return [...new Set(keysHere.map(toolSlug))].filter((slug) => names[slug]).sort((a, b) => nameOf(a).localeCompare(nameOf(b)));
  };
  const selected = (key) => isOn(toolSlug(key), state().choices || {});
  const say = (message) => { $("[data-tm-message]").textContent = message || ""; };

  // The tool on this page, for "reload to see it" when the team changed its work.
  const pageSlug = (/\/tools\/([a-z0-9-]+)\/?$/.exec(location.pathname.replace(/index\.html$/, "")) || [])[1] || "";
  let interacted = false;
  let lastActivity = Date.now();
  let touched = false;

  const showTools = () => {
    const list = $("[data-tm-tools]");
    const slugs = slugsHere();
    const choices = state().choices || {};
    list.replaceChildren(...slugs.map((slug) => {
      const label = document.createElement("label");
      label.className = "tm-tool";
      const box = document.createElement("input");
      box.type = "checkbox";
      box.checked = isOn(slug, choices);
      box.dataset.slug = slug;
      box.addEventListener("change", () => {
        setState({ choices: { ...(state().choices || {}), [slug]: box.checked } });
        touched = true;
        lastActivity = Date.now() - IDLE_MS + 3000;
      });
      label.append(box, ` ${nameOf(slug)}`);
      return label;
    }));
    $("[data-tm-tools-empty]").hidden = slugs.length > 0;
  };
  const devicesText = (list) => {
    const mine = state().deviceId;
    return cleanDevices(list).map((d) => {
      if (d.id === mine) return d.name ? `${d.name} (${text.thisDevice})` : text.thisDevice;
      return `${d.name || fill(text.unnamed, { id: d.id.slice(0, 4) })} (${when(d.seen)})`;
    }).join(", ");
  };
  // A read-only device: the shared tools changed here since the last sync, which the next one will replace.
  const viewerPending = () => {
    const s = state();
    const synced = s.synced || {};
    return (s.teamKeys || []).filter((key) => offerable(key) && selected(key) && synced[key]).filter((key) => {
      const value = storage.getItem(key);
      return value === null || hash(value) !== synced[key].h;
    });
  };
  const showPending = () => {
    const node = $("[data-tm-pending]");
    const changed = isViewer() && state().lastSync ? viewerPending() : [];
    node.textContent = changed.length ? fill(text.viewerPending, { tools: [...new Set(changed.map((key) => nameOf(toolSlug(key))))].sort((a, b) => a.localeCompare(b)).join(", ") }) : "";
    node.hidden = !changed.length;
  };
  let lastError = "";
  const showStatus = () => {
    const s = state();
    const viewer = isViewer();
    const count = cleanDevices(s.devices).length;
    const line = s.lastSync
      ? fill(viewer ? text.viewerSynced : text.synced, { when: when(s.lastSync), rev: s.rev ?? 0, size: size(s.size || 0), devices: count === 1 ? text.oneDevice : fill(text.devicesN, { n: count }) })
      : text.neverSynced;
    const problem = lastError || (s.gone ? `${text.gone} ${viewer ? text.goneViewer : text.goneMember}` : "");
    $("[data-tm-status]").textContent = problem ? `${problem} ${s.lastSync ? fill(text.lastSynced, { when: when(s.lastSync) }) : ""}`.trim() : line;
    $("[data-tm-status]").classList.toggle("is-error", Boolean(problem));
    const devices = $("[data-tm-devices]");
    devices.textContent = count ? fill(text.devicesLine, { list: devicesText(s.devices) }) : "";
    devices.hidden = !count;
    // A copy that is gone is not synced again by a click on "Sync now": the team may have moved to a new code, and
    // whoever has the old one could have put a copy of their own there since.
    $("[data-tm-again]").hidden = !s.gone || viewer;
    $("[data-tm-sync]").hidden = Boolean(s.gone);
    $("[data-tm-summary]").textContent = viewer
      ? (problem ? text.readOnlyError : s.lastSync ? fill(text.readOnlySynced, { when: when(s.lastSync) }) : text.readOnly)
      : (problem ? text.onError : s.lastSync ? fill(text.onSynced, { when: when(s.lastSync) }) : text.on);
    showPending();
  };
  const showMode = () => {
    const on = Boolean(team());
    const viewer = isViewer();
    $("[data-tm-off]").hidden = on;
    $("[data-tm-on]").hidden = !on;
    root.querySelectorAll("[data-tm-member-only]").forEach((node) => { node.hidden = viewer; });
    root.querySelectorAll("[data-tm-viewer-only]").forEach((node) => { node.hidden = !viewer; });
    if (!on || viewer) $("[data-tm-view]").hidden = true;
    if (on) {
      showTools();
      showStatus();
      $("[data-tm-device]").value = state().deviceName || "";
    } else {
      $("[data-tm-summary]").textContent = text.off;
    }
  };

  const ERRORS = { offline: "offline", gone: "gone", unreadable: "unreadable", refused: "refused", "too-large": "tooLarge", busy: "busy", conflict: "conflict", full: "full" };
  const errorText = (result) => (result.status === "error" ? fill(text.failed, { code: result.code ?? "?" }) : text[ERRORS[result.status]] || fill(text.failed, { code: result.status }));
  let running = null;
  let again = false;
  const restorePoint = () => (window.StorageGuard?.supported?.()
    ? Promise.race([window.StorageGuard.makePoint("before-sync").catch(() => null), new Promise((resolve) => setTimeout(resolve, 2000))])
    : null);
  const sync = async ({ create = false, quiet = false } = {}) => {
    if (running) { again = true; return running; }
    running = (async () => {
      const k = await keys();
      if (!k) return null;
      const button = $("[data-tm-sync]");
      button.disabled = true;
      if (!quiet) $("[data-tm-status]").textContent = text.syncing;
      touched = false;
      const viewer = Boolean(k.viewer);
      const fetcher = (...args) => window.fetch(...args);
      // A read-only device reads and nothing else, whatever the button.
      const result = await (viewer ? pullOnce : syncOnce)({
        endpoint, storage, keys: k, selected, create: !viewer && (create || !(state().rev > 0) && !state().gone),
        fetch: fetcher, beforeWrite: restorePoint,
      }).catch(() => ({ status: "error", code: "?" }));
      button.disabled = false;
      if (result.status === "gone") setState({ gone: true });
      // A gone copy is said by the status line from the state, with what to do about it.
      lastError = result.status === "synced" || result.status === "gone" ? "" : errorText(result);
      if (result.changed?.length) afterChange(result.changed);
      // An old copy left over from a change of code: deleted now that the server answers.
      if (!viewer && result.status === "synced" && retireList(storage).length) {
        if ((await retireOld({ endpoint, fetch: fetcher, storage })) === "deleted") say(text.retired);
      }
      showTools();
      showStatus();
      return result;
    })();
    try { return await running; } finally {
      running = null;
      if (again) { again = false; sync({ quiet: true }); }
    }
  };

  // The team changed work on this device: tell the tools that listen (action list, workplace, timeline events, as if
  // another tab had saved), and offer a reload when the tool on this page holds the old state.
  const afterChange = (changed) => {
    changed.forEach((key) => {
      try { window.dispatchEvent(new StorageEvent("storage", { key, newValue: storage.getItem(key) })); } catch { /* an old browser */ }
    });
    const tools = [...new Set(changed.map((key) => nameOf(toolSlug(key))))].sort((a, b) => a.localeCompare(b));
    say(fill(text.updated, { tools: tools.join(", ") }));
    const here = pageSlug && changed.some((key) => toolSlug(key) === pageSlug);
    if (!here) return;
    // Nobody has typed yet: the page simply opens again with the team's work, at most once a minute.
    let recent = false;
    try {
      recent = Date.now() - Number(sessionStorage.getItem("sc-team-reloaded") || 0) < 60000;
      sessionStorage.setItem("sc-team-reloaded", String(Date.now()));
    } catch { recent = true; }
    if (!interacted && !recent) { window.location.reload(); return; }
    $("[data-tm-reload]").hidden = false;
  };

  // ---- Start, join, leave ----
  const showCode = (code, { block = "[data-tm-new]", textAt = "[data-tm-code]", qrAt = "[data-tm-qr]", label = text.qrLabel } = {}) => {
    $(block).hidden = false;
    $(textAt).textContent = code;
    const qr = qrEncode(code);
    const holder = $(qrAt);
    holder.replaceChildren();
    if (qr) {
      holder.innerHTML = qrSvg(qr.matrix, label || "");
    }
  };
  $("[data-tm-start]").addEventListener("click", async () => {
    const code = newCode();
    writeJson(storage, TEAM_KEY, { code, since: new Date().toISOString() });
    setState({ rev: 0, synced: {}, teamKeys: [], devices: [], lastSync: "", gone: false });
    showCode(code);
    showMode();
    say(text.started);
    await sync({ create: true });
  });
  const joinField = $("[data-tm-join-code]");
  $("[data-tm-join]").addEventListener("click", async () => {
    // The same field takes both kinds: a read-only code starts with "scr" and a version, a team code is six words.
    const typed = joinField.value;
    const viewer = looksViewer(typed);
    const parsed = viewer ? null : parseCode(typed);
    if (parsed && !parsed.ok) {
      say(parsed.unknown.length ? fill(text.unknownWords, { words: parsed.unknown.join(", ") }) : fill(text.badCode, { n: CODE_WORDS }));
      joinField.focus();
      return;
    }
    const button = $("[data-tm-join]");
    let view = null;
    if (viewer) {
      view = await parseViewer(typed);
      if (!view.ok) {
        say(view.reason === "version" ? text.viewerVersion : text.viewerDamaged);
        joinField.focus();
        return;
      }
    }
    button.disabled = true;
    say(text.syncing);
    const k = viewer ? await viewerKeys(view.text) : await deriveKeys(parsed.code);
    // Join only a team that exists: a mistyped code that happens to be six real words starts nothing.
    const probe = async (spaceId) => {
      try {
        const response = await window.fetch(spaceUrl(endpoint, spaceId), { cache: "no-store" });
        return response.status === 404 ? false : response.ok ? true : null;
      } catch { return null; }
    };
    // A team made before may still have its copy at the old address (it moves at the next sync of a member).
    let exists = await probe(k.spaceId);
    if (exists === false && k.legacy) exists = await probe(k.legacy.spaceId);
    button.disabled = false;
    if (exists === false) { say(text.noTeam); return; }
    if (exists === null) { say(text.offline); return; }
    writeJson(storage, TEAM_KEY, viewer ? { viewer: view.text, since: new Date().toISOString() } : { code: parsed.code, since: new Date().toISOString() });
    setState({ rev: 0, synced: {}, teamKeys: [], devices: [], lastSync: "", gone: false, viewer });
    keysFor = k;
    joinField.value = "";
    showMode();
    const result = await sync();
    say(result?.status === "synced" ? (viewer ? text.joinedViewer : text.joined) : "");
  });
  $("[data-tm-copy]").addEventListener("click", async () => {
    const code = $("[data-tm-code]").textContent;
    try { await navigator.clipboard.writeText(code); say(text.copied); } catch { say(code); }
  });
  $("[data-tm-sync]").addEventListener("click", () => sync());
  $("[data-tm-again]").addEventListener("click", () => { if (!isViewer()) sync({ create: true }); });

  // ---- A read-only code, and a new team code ----
  $("[data-tm-viewer-make]").addEventListener("click", async () => {
    const current = team();
    if (!current || current.viewer) return;
    const button = $("[data-tm-viewer-make]");
    button.disabled = true;
    say(text.viewerMaking);
    // The code carries the new address of the team's copy: a team made before moves there first.
    if (!state().lastSync || state().space !== (await keys())?.spaceId) await sync({ quiet: true });
    let code = null;
    try { code = await viewerCode(current.code); } catch { code = null; }
    button.disabled = false;
    if (!code) { say(fill(text.failed, { code: "?" })); return; }
    say("");
    showCode(code, { block: "[data-tm-view]", textAt: "[data-tm-view-code]", qrAt: "[data-tm-view-qr]", label: text.viewerQrLabel });
  });
  $("[data-tm-view-copy]").addEventListener("click", async () => {
    const code = $("[data-tm-view-code]").textContent;
    try { await navigator.clipboard.writeText(code); say(text.copied); } catch { say(code); }
  });
  $("[data-tm-view-hide]").addEventListener("click", () => {
    $("[data-tm-view]").hidden = true;
    $("[data-tm-view-code]").textContent = "";
    $("[data-tm-view-qr]").replaceChildren();
  });
  $("[data-tm-rotate]").addEventListener("click", async () => {
    if (!team() || isViewer() || !window.confirm(text.rotateConfirm)) return;
    // Never alongside a sync of the old team.
    if (running) { try { await running; } catch { /* it said so */ } }
    const k = await keys();
    if (!k || !k.writeToken) return;
    const buttons = ["[data-tm-rotate]", "[data-tm-sync]", "[data-tm-viewer-make]"].map((selector) => $(selector));
    buttons.forEach((node) => { node.disabled = true; });
    say(text.rotating);
    running = rotate({ endpoint, storage, keys: k, selected, fetch: (...args) => window.fetch(...args), beforeWrite: restorePoint })
      .catch(() => ({ status: "error", code: "?", stage: "sync" }));
    let result;
    try { result = await running; } finally { running = null; }
    buttons.forEach((node) => { node.disabled = false; });
    if (result.changed?.length) afterChange(result.changed);
    if (result.status !== "rotated") {
      if (result.status === "gone") setState({ gone: true });
      lastError = "";
      showStatus();
      say(fill(text.rotateFailed, { reason: errorText(result) }));
      return;
    }
    keysFor = result.keys;
    lastError = "";
    $("[data-tm-view]").hidden = true;
    showMode();
    showCode(result.code);
    say(result.deleted === "deleted" ? text.rotated : `${text.rotated} ${text.retireFailed}`);
    if (again) { again = false; sync({ quiet: true }); }
  });
  $("[data-tm-reload-button]").addEventListener("click", () => window.location.reload());
  $("[data-tm-device]").addEventListener("change", (event) => {
    setState({ deviceName: event.target.value.trim().slice(0, 60) });
    // The team sees the new name with the next upload, which a new name always makes.
    sync({ quiet: true });
  });
  const forget = () => {
    try { storage.removeItem(TEAM_KEY); } catch { /* nothing to forget */ }
    const { deviceId, deviceName, choices } = state();
    writeJson(storage, STATE_KEY, { deviceId, deviceName, choices });
    keysFor = null;
    lastError = "";
    $("[data-tm-new]").hidden = true;
    $("[data-tm-view]").hidden = true;
    showMode();
  };
  $("[data-tm-leave]").addEventListener("click", () => {
    if (!window.confirm(text.leaveConfirm)) return;
    forget();
    say(text.left);
  });
  $("[data-tm-delete]").addEventListener("click", async () => {
    if (isViewer() || !window.confirm(text.deleteConfirm)) return;
    const k = await keys();
    if (!k || !k.writeToken) return;
    const result = await deleteCopy({ endpoint, fetch: (...args) => window.fetch(...args), keys: k });
    if (result === "deleted") { forget(); say(text.deleted); return; }
    say(result === "offline" ? text.offline : result === "refused" ? text.refused : fill(text.failed, { code: "" }));
  });

  // ---- When it syncs by itself ----
  const activity = () => { lastActivity = Date.now(); touched = true; };
  ["input", "change", "keydown", "pointerdown"].forEach((type) => document.addEventListener(type, (event) => {
    interacted = true;
    if (!root.contains(event.target)) activity();
  }, { capture: true, passive: true }));
  ["storage", "actions:changed", "workplace:changed"].forEach((type) => window.addEventListener(type, (event) => {
    if (event.type === "storage" && event.key && !offerable(event.key)) return;
    activity();
  }));
  const pending = () => {
    const items = collect(storage, (key) => offerable(key) && selected(key));
    return changedSince(items, state().synced || {}).length > 0;
  };
  setInterval(() => {
    if (!team() || !touched || running) return;
    // A read-only device sends nothing: it only says, soon after, what the next sync will replace.
    if (isViewer()) { touched = false; showPending(); return; }
    if (state().gone || Date.now() - lastActivity < IDLE_MS) return;
    if (pending()) sync({ quiet: true });
    else touched = false;
  }, 5000);
  window.addEventListener("online", () => { if (team() && lastError && !state().gone) sync({ quiet: true }); });

  window.FloorCapture?.initScan?.(root);
  showMode();
  if (team() && !state().gone) {
    // After the day's restore point (storage-guard.js), so that one holds the work as it was before the team's.
    const ready = window.StorageGuard?.ready || Promise.resolve();
    Promise.race([ready, new Promise((resolve) => setTimeout(resolve, 3000))]).then(() => sync({ quiet: true }));
  }
})();
