// Team sync (partials/team-sync.njk, inside the box "All your work in one file"): the tools a team ticks are kept the
// same on every device of the team, through one encrypted copy on the sync server (workers/sync/worker.js).
//
// The team code is six words. Everything else comes from it on the device, with WebCrypto:
//   spaceId     = hex SHA-256("space:" + code)   the address of the team's copy
//   writeToken  = hex SHA-256("write:" + code)   lets a device replace or delete it
//   key         = PBKDF2-SHA-256(code, "stiven-catalyst-sync-v1", 310000) → AES-GCM 256
// What goes up is { format: "stiven-catalyst-team", version: 1, sent, device, devices, items: { key: string } }, gzipped
// where the browser can (a first byte says which: 1 gzip, 0 plain JSON), then encrypted with a fresh 12-byte IV. The
// server stores ciphertext; the code and the key never leave the device. The code is kept in localStorage "sc-team",
// what was last synced in "sc-team-state"; neither is work, so neither goes into a saved file (work-backup.js SKIP).
//
// A sync: GET → decrypt → merge (TeamSyncMath.merge) → a restore point, then only the changed keys are written → PUT
// with the revision of the GET. 409 (another device saved first): once more from the GET. 429: wait 2 s, once more.
// It runs on page load, after "Sync now", and when the page has been idle for 30 s after a change.
(() => {
  const FORMAT = "stiven-catalyst-team";
  const VERSION = 1;
  const SALT = "stiven-catalyst-sync-v1";
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
  const deriveKeys = async (text, iterations = ITERATIONS) => {
    const code = normalise(text);
    const [spaceId, writeToken] = await Promise.all([sha256(`space:${code}`), sha256(`write:${code}`)]);
    const base = await subtle().importKey("raw", utf8(code), "PBKDF2", false, ["deriveKey"]);
    const key = await subtle().deriveKey({ name: "PBKDF2", hash: "SHA-256", salt: utf8(SALT), iterations }, base, { name: "AES-GCM", length: 256 }, false, ["encrypt", "decrypt"]);
    return { code, spaceId, writeToken, key };
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

  // ---- What may be shared ----
  const isWork = (key) => (window.WorkBackup ? window.WorkBackup.isWork(key) : typeof key === "string" && key.startsWith("sc-") && !["sc-theme", "sc-print-guide-hidden", TEAM_KEY, STATE_KEY].includes(key));
  const toolSlug = (key) => (window.WorkBackup ? window.WorkBackup.toolSlug(key) : String(key).replace(/^sc-/, "").replace(/-(check|calc|ui)$/, "").replace(/-(de|sq)$/, ""));
  // Personal, never offered: the career tools, the reader's own shelf, reading and cards, coaching.
  const PERSONAL = /^sc-(cv-builder|ats-cv|cover-letter|shelf|reading|checklists|coaching)(?![a-z])/;
  // Settings of the page, the reader and this module, not work of a tool.
  const NOT_TOOL = /^sc-(team|book-|audio-|listen-|import-maps|persist-|restore|theme|print-guide)|-ui$/;
  const offerable = (key) => isWork(key) && !PERSONAL.test(key) && !NOT_TOOL.test(key);
  // Ticked unless the device says otherwise: the action list, the workplace, the timeline events, the floor logs and the hotel boards.
  const DEFAULT_ON = new Set(["action-tracker", "workplace", "annotations", "damage-control", "incomplete-control", "night-audit", "delay-analyzer", "sigma-control-chart", "lost-found", "room-inspection", "maintenance-planner", "safety-cross", "room-status", "guest-complaints"]);
  const isOn = (slug, choices = {}) => (typeof choices[slug] === "boolean" ? choices[slug] : DEFAULT_ON.has(slug));
  // A remote entry is taken only when it could have come from a tool here (work-backup.js checks the logs' shape).
  const soundItem = (key, value) => typeof value === "string" && offerable(key) && (!window.WorkBackup?.sound || window.WorkBackup.sound([key, value]));
  const readPayload = (payload) => {
    if (!payload || typeof payload !== "object" || payload.format !== FORMAT || payload.version !== VERSION) return null;
    const items = payload.items;
    if (!items || typeof items !== "object" || Array.isArray(items)) return null;
    return {
      sent: typeof payload.sent === "string" ? payload.sent : "",
      device: payload.device && typeof payload.device === "object" ? payload.device : null,
      devices: cleanDevices(payload.devices),
      items: Object.fromEntries(Object.entries(items).filter(([key, value]) => soundItem(key, value))),
    };
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
  // is kept: a sync never deletes.
  const mergeRows = (localRows, remoteRows, synced = {}) => {
    const out = [];
    const ids = new Set();
    const contents = new Set();
    const remoteById = new Map();
    remoteRows.forEach((row) => {
      const id = rowId(row);
      if (id !== null && !remoteById.has(id)) remoteById.set(id, row);
    });
    const take = (row, other) => {
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
      out.push(other === undefined ? row : pickRow(row, other, synced[id]));
    };
    localRows.forEach((row) => take(row, remoteById.get(rowId(row))));
    remoteRows.forEach((row) => take(row));
    return out;
  };
  // The fields of both, in this device's order first.
  const fieldsOf = (a, b) => [...new Set([...Object.keys(a), ...Object.keys(b)])];
  // One storage key. local / remote are the stored texts (undefined when that side has none), base what was last
  // synced (TeamSyncMath.baseOf), or nothing before the first sync.
  const mergeValue = (local, remote, base = null) => {
    if (local === undefined || local === null) return remote;
    if (remote === undefined || remote === null || local === remote) return local;
    const l = parse(local);
    const r = parse(remote);
    let out = null;
    if (isObject(l) && isObject(r) && (hasRows(l) || hasRows(r))) {
      // A log: the rows of both; its other fields (settings, a draft) this device's unless empty here.
      out = {};
      fieldsOf(l, r).forEach((field) => {
        if (field === "rows") out.rows = mergeRows(Array.isArray(l.rows) ? l.rows : [], Array.isArray(r.rows) ? r.rows : [], base?.r || {});
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
  // local and remote: { storage key: text }; synced: { storage key: base }. Never drops a key one side lacks.
  const merge = (local = {}, remote = {}, synced = {}) => {
    const out = {};
    fieldsOf(local, remote).forEach((key) => {
      const value = mergeValue(local[key], remote[key], synced[key]);
      if (typeof value === "string") out[key] = value;
    });
    return out;
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

  // ---- QR code (ISO/IEC 18004): byte mode, error correction level M, versions 1 to 10 ----
  // Enough for a team code (about 35 characters fit version 3). The matrix is an array of rows of 0 and 1.
  const QR_M = [
    // [error correction codewords per block, blocks in group 1, data codewords each, blocks in group 2, data codewords each]
    null, [10, 1, 16, 0, 0], [16, 1, 28, 0, 0], [26, 1, 44, 0, 0], [18, 2, 32, 0, 0], [24, 2, 43, 0, 0],
    [16, 4, 27, 0, 0], [18, 4, 31, 0, 0], [22, 2, 38, 2, 39], [22, 3, 36, 2, 37], [26, 4, 43, 1, 44],
  ];
  const QR_ALIGN = [null, [], [6, 18], [6, 22], [6, 26], [6, 30], [6, 34], [6, 22, 38], [6, 24, 42], [6, 26, 46], [6, 28, 50]];
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
    while (version <= 10 && qrCapacity(version) * 8 < 4 + (version < 10 ? 8 : 16) + bytes.length * 8) version++;
    if (version > 10) return null;
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

  // ctx: { endpoint, fetch, storage, keys (deriveKeys), selected(key), beforeWrite(keys), create (a 404 may start the
  // team's copy), now(), wait(ms) }. Returns { status, changed, rev, size, devices, code? }; status is "synced",
  // "offline", "gone" (no copy on the server), "unreadable", "refused", "too-large", "busy", "conflict", "full" or "error".
  const syncOnce = async (ctx) => {
    const { storage, keys } = ctx;
    const now = ctx.now || (() => new Date());
    const wait = ctx.wait || ((ms) => new Promise((resolve) => setTimeout(resolve, ms)));
    const url = `${String(ctx.endpoint).replace(/\/+$/, "")}/v1/spaces/${keys.spaceId}`;
    const call = async (init) => {
      try { return await ctx.fetch(url, { cache: "no-store", ...init }); } catch { return null; }
    };
    const body = async (response) => { try { return await response.json(); } catch { return null; } };
    for (let attempt = 0; attempt < 2; attempt++) {
      const state = readState(storage);
      const got = await call({ method: "GET" });
      if (!got) return { status: "offline" };
      let rev = 0;
      let remote = null;
      let size = 0;
      if (got.status === 404) {
        if (!ctx.create) return { status: "gone" };
      } else if (got.ok) {
        const box = await body(got);
        if (!box || typeof box.data !== "string" || typeof box.iv !== "string" || !Number.isInteger(box.rev)) return { status: "unreadable" };
        rev = box.rev;
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
      const merged = merge(local, remoteShared, state.synced || {});
      const changed = Object.keys(merged).filter((key) => merged[key] !== local[key]);
      if (changed.length) {
        try { await ctx.beforeWrite?.(changed); } catch { /* written as before */ }
        if (!replaceItems(storage, pick(merged, changed))) return { status: "full" };
      }
      // This device now holds the team's copy as it was read: that is what later changes are measured against, even
      // if the upload below does not go through.
      const synced = { ...(state.synced || {}), ...baseOf(remoteShared) };
      const out = { ...remoteItems, ...merged };
      const devices = withDevice(remote?.devices, device, now());
      const keep = (extra) => writeJson(storage, STATE_KEY, { ...readState(storage), deviceId, synced, teamKeys: Object.keys(out), ...extra });
      if (remote && sameItems(out, remoteItems) && deviceFresh(remote.devices, device, now())) {
        keep({ rev, size, devices: remote.devices, lastSync: now().toISOString(), gone: false });
        return { status: "synced", changed, rev, size, devices: remote.devices, uploaded: false };
      }
      keep({ gone: false });
      const payload = { format: FORMAT, version: VERSION, sent: now().toISOString(), device, devices, items: out };
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
      writeJson(storage, STATE_KEY, { ...readState(storage), deviceId, synced: { ...(state.synced || {}), ...baseOf(merged) }, teamKeys: Object.keys(out), rev: newRev, size: sealed.data.length, devices, lastSync: now().toISOString(), gone: false });
      return { status: "synced", changed, rev: newRev, size: sealed.data.length, devices, uploaded: true };
    }
    return { status: "conflict" };
  };
  const deleteCopy = async ({ endpoint, fetch, keys }) => {
    try {
      const response = await fetch(`${String(endpoint).replace(/\/+$/, "")}/v1/spaces/${keys.spaceId}`, { method: "DELETE", headers: { Authorization: `Bearer ${keys.writeToken}` } });
      return response.status === 204 || response.status === 404 ? "deleted" : response.status === 403 || response.status === 401 ? "refused" : "error";
    } catch { return "offline"; }
  };

  window.TeamSyncMath = {
    FORMAT, VERSION, SALT, ITERATIONS, WORDS, BITS, DEFAULT_ON,
    newCode, parseCode, normalise, deriveKeys, seal, unseal, toBase64, fromBase64,
    offerable, isOn, readPayload, withDevice, deviceFresh,
    hash, newer, mergeRows, mergeValue, merge, baseOf, changedSince, sameItems,
    qrEncode, qrSvg,
  };
  window.TeamSync = { syncOnce, deleteCopy, TEAM_KEY, STATE_KEY };

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

  const team = () => {
    const saved = readJson(storage, TEAM_KEY);
    return saved && parseCode(saved.code).ok ? saved : null;
  };
  let keysFor = null;
  const keys = async () => {
    const current = team();
    if (!current) return null;
    if (!keysFor || keysFor.code !== normalise(current.code)) keysFor = await deriveKeys(current.code);
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
  let lastError = "";
  const showStatus = () => {
    const s = state();
    const count = cleanDevices(s.devices).length;
    const line = s.lastSync
      ? fill(text.synced, { when: when(s.lastSync), rev: s.rev ?? 0, size: size(s.size || 0), devices: count === 1 ? text.oneDevice : fill(text.devicesN, { n: count }) })
      : text.neverSynced;
    $("[data-tm-status]").textContent = lastError ? `${lastError} ${s.lastSync ? fill(text.lastSynced, { when: when(s.lastSync) }) : ""}`.trim() : line;
    $("[data-tm-status]").classList.toggle("is-error", Boolean(lastError));
    const devices = $("[data-tm-devices]");
    devices.textContent = count ? fill(text.devicesLine, { list: devicesText(s.devices) }) : "";
    devices.hidden = !count;
    $("[data-tm-again]").hidden = !s.gone;
    $("[data-tm-summary]").textContent = lastError ? text.onError : s.lastSync ? fill(text.onSynced, { when: when(s.lastSync) }) : text.on;
  };
  const showMode = () => {
    const on = Boolean(team());
    $("[data-tm-off]").hidden = on;
    $("[data-tm-on]").hidden = !on;
    if (on) {
      showTools();
      showStatus();
      $("[data-tm-device]").value = state().deviceName || "";
    } else {
      $("[data-tm-summary]").textContent = text.off;
    }
  };

  const ERRORS = { offline: "offline", gone: "gone", unreadable: "unreadable", refused: "refused", "too-large": "tooLarge", busy: "busy", conflict: "conflict", full: "full" };
  let running = null;
  let again = false;
  const sync = async ({ create = false, quiet = false } = {}) => {
    if (running) { again = true; return running; }
    running = (async () => {
      const k = await keys();
      if (!k) return null;
      const button = $("[data-tm-sync]");
      button.disabled = true;
      if (!quiet) $("[data-tm-status]").textContent = text.syncing;
      touched = false;
      const result = await syncOnce({
        endpoint, storage, keys: k, selected, create: create || !(state().rev > 0) && !state().gone,
        fetch: (...args) => window.fetch(...args),
        beforeWrite: () => (window.StorageGuard?.supported?.()
          ? Promise.race([window.StorageGuard.makePoint("before-sync").catch(() => null), new Promise((resolve) => setTimeout(resolve, 2000))])
          : null),
      }).catch(() => ({ status: "error", code: "?" }));
      button.disabled = false;
      if (result.status === "gone") setState({ gone: true });
      lastError = result.status === "synced" ? "" : result.status === "error" ? fill(text.failed, { code: result.code ?? "?" }) : text[ERRORS[result.status]] || fill(text.failed, { code: result.status });
      if (result.changed?.length) afterChange(result.changed);
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
  const showCode = (code) => {
    $("[data-tm-new]").hidden = false;
    $("[data-tm-code]").textContent = code;
    const qr = qrEncode(code);
    const holder = $("[data-tm-qr]");
    holder.replaceChildren();
    if (qr) {
      holder.innerHTML = qrSvg(qr.matrix, text.qrLabel || "");
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
    const parsed = parseCode(joinField.value);
    if (!parsed.ok) {
      say(parsed.unknown.length ? fill(text.unknownWords, { words: parsed.unknown.join(", ") }) : fill(text.badCode, { n: CODE_WORDS }));
      joinField.focus();
      return;
    }
    const button = $("[data-tm-join]");
    button.disabled = true;
    say(text.syncing);
    const k = await deriveKeys(parsed.code);
    // Join only a team that exists: a mistyped code that happens to be six real words starts nothing.
    let exists = null;
    try {
      const response = await window.fetch(`${endpoint.replace(/\/+$/, "")}/v1/spaces/${k.spaceId}`, { cache: "no-store" });
      exists = response.status === 404 ? false : response.ok ? true : null;
    } catch { exists = null; }
    button.disabled = false;
    if (exists === false) { say(text.noTeam); return; }
    if (exists === null) { say(text.offline); return; }
    writeJson(storage, TEAM_KEY, { code: parsed.code, since: new Date().toISOString() });
    setState({ rev: 0, synced: {}, teamKeys: [], devices: [], lastSync: "", gone: false });
    keysFor = k;
    joinField.value = "";
    showMode();
    const result = await sync();
    say(result?.status === "synced" ? text.joined : "");
  });
  $("[data-tm-copy]").addEventListener("click", async () => {
    const code = $("[data-tm-code]").textContent;
    try { await navigator.clipboard.writeText(code); say(text.copied); } catch { say(code); }
  });
  $("[data-tm-sync]").addEventListener("click", () => sync());
  $("[data-tm-again]").addEventListener("click", () => sync({ create: true }));
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
    showMode();
  };
  $("[data-tm-leave]").addEventListener("click", () => {
    if (!window.confirm(text.leaveConfirm)) return;
    forget();
    say(text.left);
  });
  $("[data-tm-delete]").addEventListener("click", async () => {
    if (!window.confirm(text.deleteConfirm)) return;
    const k = await keys();
    if (!k) return;
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
    if (!team() || !touched || running || Date.now() - lastActivity < IDLE_MS) return;
    if (pending()) sync({ quiet: true });
    else touched = false;
  }, 5000);
  window.addEventListener("online", () => { if (team() && lastError) sync({ quiet: true }); });

  window.FloorCapture?.initScan?.(root);
  showMode();
  if (team()) {
    // After the day's restore point (storage-guard.js), so that one holds the work as it was before the team's.
    const ready = window.StorageGuard?.ready || Promise.resolve();
    Promise.race([ready, new Promise((resolve) => setTimeout(resolve, 3000))]).then(() => sync({ quiet: true }));
  }
})();
