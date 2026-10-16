// The audio overview of an issue (partials/audio-player.njk, [data-audio]): a one-line bar over the browser's own
// player, which stays as it is when this script does not run.
// - Play and pause, 15 seconds back and forward, the position as a slider, the time and the speed.
// - Nothing is downloaded before play is pressed (preload="none"); the length shown comes from audio.json.
// - The place reached is kept in this browser (localStorage "sc-audio-<key>") and offered as "Resume" on the next
//   visit; it is forgotten at the end. The speed is kept too ("sc-audio-rate"). Nothing is recorded or sent.
// - The phone's lock screen and headphones control it too (the Media Session API), with the title and the cover.
(() => {
  const RATES = [1, 1.25, 1.5, 2];
  const RATE_KEY = "sc-audio-rate";
  const read = (key) => { try { return localStorage.getItem(key); } catch { return null; } };
  const write = (key, value) => {
    try {
      if (value === null) localStorage.removeItem(key);
      else localStorage.setItem(key, value);
    } catch { /* storage unavailable */ }
  };
  const clock = (s) => {
    const t = Math.max(0, Math.floor(s || 0));
    const h = Math.floor(t / 3600);
    const m = Math.floor((t % 3600) / 60);
    const sec = String(t % 60).padStart(2, "0");
    return h ? `${h}:${String(m).padStart(2, "0")}:${sec}` : `${m}:${sec}`;
  };
  const players = [];

  document.querySelectorAll("[data-audio]").forEach((box) => {
    const media = box.querySelector("[data-audio-media]");
    const controls = box.querySelector("[data-audio-controls]");
    if (!media || !controls) return;
    const toggle = box.querySelector("[data-audio-toggle]");
    const label = box.querySelector("[data-audio-label]");
    const scrub = box.querySelector("[data-audio-scrub]");
    const now = box.querySelector("[data-audio-now]");
    const rateButton = box.querySelector("[data-audio-rate]");
    const rateValue = box.querySelector("[data-audio-rate-value]");
    const note = box.querySelector("[data-audio-note]");
    const d = box.dataset;
    const placeKey = `sc-audio-${d.key}`;
    const length = () => (Number.isFinite(media.duration) && media.duration > 0 ? media.duration : Number(d.seconds) || 0);

    // Until the file's own data has arrived, a position is held here and applied when it can be.
    let pending = null;
    const position = () => (pending ?? media.currentTime) || 0;
    const seek = (seconds) => {
      const to = Math.min(Math.max(0, seconds), Math.max(0, length() - 0.5));
      if (media.readyState >= 1) { media.currentTime = to; pending = null; } else pending = to;
      show(to);
    };
    media.addEventListener("loadedmetadata", () => {
      if (pending !== null) { media.currentTime = pending; pending = null; }
      scrub.max = String(Math.round(length()));
    });

    let saved = 0;
    let scrubbing = false;
    const show = (at = position()) => {
      now.textContent = clock(at);
      if (!scrubbing) scrub.value = String(Math.round(at));
      // How much has been heard, as the filled part of the line (styles.css: --heard).
      scrub.style.setProperty("--heard", `${length() ? Math.min(100, (at / length()) * 100).toFixed(1) : 0}%`);
      scrub.setAttribute("aria-valuetext", (d.timeLabel || "{a} of {b}").replace("{a}", clock(at)).replace("{b}", clock(length())));
    };
    const labelFor = () => (media.paused ? (position() > 1 ? d.resumeLabel : d.playLabel) : d.pauseLabel);
    const state = () => {
      toggle.setAttribute("aria-pressed", String(!media.paused));
      label.textContent = labelFor();
      box.classList.toggle("is-playing", !media.paused);
    };
    const remember = (force) => {
      const at = Math.floor(position());
      if (!force && Math.abs(at - saved) < 5) return;
      saved = at;
      // The very start and the last seconds are not worth a "Resume".
      write(placeKey, at > 10 && at < length() - 10 ? String(at) : null);
    };

    // The speed, the same for every recording on the site.
    const setRate = (rate) => {
      const r = RATES.includes(rate) ? rate : 1;
      media.playbackRate = r;
      media.defaultPlaybackRate = r;
      rateValue.textContent = `${r.toLocaleString(document.documentElement.lang || "en")}×`;
    };
    setRate(Number(read(RATE_KEY)) || 1);
    rateButton.addEventListener("click", () => {
      const next = RATES[(RATES.indexOf(media.playbackRate) + 1) % RATES.length];
      setRate(next);
      write(RATE_KEY, next === 1 ? null : String(next));
    });

    const play = () => {
      players.forEach((other) => { if (other !== media) other.pause(); });
      media.playbackRate = media.defaultPlaybackRate;
      const started = media.play();
      if (started && typeof started.catch === "function") started.catch(() => state());
    };
    toggle.addEventListener("click", () => (media.paused ? play() : media.pause()));
    box.querySelectorAll("[data-audio-skip]").forEach((button) => {
      button.addEventListener("click", () => seek(position() + Number(button.dataset.audioSkip)));
    });

    // Dragging the slider moves the time shown at once and the playback when it is let go.
    scrub.addEventListener("input", () => {
      scrubbing = true;
      now.textContent = clock(Number(scrub.value));
      scrub.style.setProperty("--heard", `${length() ? Math.min(100, (Number(scrub.value) / length()) * 100).toFixed(1) : 0}%`);
    });
    scrub.addEventListener("change", () => { scrubbing = false; seek(Number(scrub.value)); remember(true); });

    media.addEventListener("play", () => { state(); session(); });
    media.addEventListener("pause", () => { state(); remember(true); });
    media.addEventListener("timeupdate", () => { show(); remember(false); positionState(); });
    media.addEventListener("ended", () => { write(placeKey, null); saved = 0; seek(0); state(); });
    media.addEventListener("error", () => {
      if (!note || note.querySelector(".audio-player-error")) return;
      const p = document.createElement("strong");
      p.className = "audio-player-error";
      p.textContent = `${d.errorLabel} `;
      note.prepend(p);
      state();
    });
    window.addEventListener("pagehide", () => remember(true));

    // The lock screen of a phone, a car and headphones: title, issue, cover, and the same buttons.
    const session = () => {
      if (!("mediaSession" in navigator) || typeof window.MediaMetadata !== "function") return;
      navigator.mediaSession.metadata = new window.MediaMetadata({
        title: d.title,
        artist: "Stiven Catalyst",
        album: d.album || "",
        artwork: d.artwork ? [{ src: new URL(d.artwork, location.href).href }] : [],
      });
      const on = (action, handler) => { try { navigator.mediaSession.setActionHandler(action, handler); } catch { /* not supported */ } };
      on("play", play);
      on("pause", () => media.pause());
      on("seekbackward", (e) => seek(position() - (e.seekOffset || 15)));
      on("seekforward", (e) => seek(position() + (e.seekOffset || 15)));
      on("seekto", (e) => seek(e.seekTime));
    };
    const positionState = () => {
      if (!("mediaSession" in navigator) || !navigator.mediaSession.setPositionState || !(media.duration > 0)) return;
      try { navigator.mediaSession.setPositionState({ duration: media.duration, playbackRate: media.playbackRate, position: Math.min(media.currentTime, media.duration) }); } catch { /* out of range */ }
    };

    // Where the reader stopped last time.
    const before = Number(read(placeKey)) || 0;
    if (before > 0 && before < length()) { pending = before; saved = before; }

    media.removeAttribute("controls");
    media.hidden = true;
    controls.hidden = false;
    box.classList.add("is-live");
    players.push(media);
    show();
    state();
  });
})();
