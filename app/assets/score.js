// BIO 202 score-code library.
//
// Drop-in for a module HTML file:
//   <link rel="stylesheet" href="../assets/score.css">
//   <script src="../assets/score.js"></script>
//   <script>
//     Score.init({
//       moduleId: "s01",
//       version: 1,                      // bump when you change scoring rules
//       pretest: 2, scaffold: 5, posttest: 2,
//       mountNamePrompt: "#score-name",  // selector or omitted (auto-prepended)
//       mountFinalCode:  "#score-final", // selector for the finale panel
//       onReady: (passcode) => { /* unlock first stage */ }
//     });
//
//     // anywhere during the module:
//     Score.recordPretest(0, 1);
//     Score.recordCheckpoint(2, Score.scoring.signMatch(predicted, observed));
//     Score.recordPosttest(1, Score.scoring.equals(answer, "drift"));
//     Score.finish();   // renders the copy-able code panel
//
// Final code format (v3 — opaque):
//   MODULEvVERSION . BASE64URL(cipher) . MAC6
//   e.g.  lesson1v6.Q0p9c2V4dGc-bHpx0Z3.a4f19c
//
// Only the module id + version are in cleartext (the instructor needs to know
// which module a pasted code belongs to, and which salt to apply, *without*
// decoding). Everything that describes the student — name, per-question
// right/wrong bits, elapsed seconds, per-stage manipulation counts — is packed
// into one payload string:
//
//   NAMETOKEN | PRETESTBITS | SCAFFOLDBITS | POSTTESTBITS | ELAPSEDSEC | MANIP | ACTIVESEC
//
// ELAPSEDSEC is wall clock from name-confirm to finish(); ACTIVESEC is the same
// span with every pause longer than IDLE_GAP_MS discarded, so a tab left open
// over lunch inflates the first and not the second. Codes emitted before
// ACTIVESEC existed carry six fields; the decoder accepts both.
//
// which is XOR'd with a keystream derived from (salt | module | version) and
// base64url-encoded, so a student staring at the code cannot read their own
// name or score off it. A 6-hex MAC over the cleartext payload makes the code
// tamper-evident: flip a character and verification fails.
//
// This is opacity by obscurity + a keyed MAC, not server-grade secrecy —
// static hosting cannot hide a key, so a determined student who reads this
// file, extracts the salt, and reimplements the XOR+SHA could decode it. The
// realistic bar it clears: a student cannot read their score off the string,
// eyeball-edit it, or decode a classmate's. A real project-wide salt is set by
// default (DEFAULT_SALT, below) and folded into the keystream + MAC; override it
// per-module via Score.init({ salt }). The verifier defaults a blank salt field
// to the same DEFAULT_SALT, so the round-trip just works.
//
// The instructor's verifier (instructor/verify_code.html) calls
// Score.decodeCode(code, salt) to recover name + bits + elapsed + manips.
// hashName()/parseCode() below remain only to read any legacy dash-format
// codes; nothing new emits them.

(function (global) {
  "use strict";

  // Project-wide salt. Folded into the passcode hash, the XOR keystream, and the
  // MAC, so every emitted code depends on it and the verifier must use the same
  // value. A lesson may override per-module via Score.init({ salt: "…" }); the
  // instructor tools (verify_code.html / aggregate.html) read Score.DEFAULT_SALT.
  //
  // Reality check (see the file header too): on a static site this constant ships
  // to the browser, so it is obfuscation, not a server secret. Its job is to stop
  // a student reading their score off the code, eyeball-editing it, or decoding a
  // classmate's — not to withstand someone who reads this file. Rotate it (and
  // bump module `version`s) if a class's codes ever need invalidating.
  const DEFAULT_SALT = "bio202-evo-2026-99921b821f9185c49da553be203ba680";
  function resolveSalt(s) { return (s != null && s !== "") ? String(s) : DEFAULT_SALT; }

  // 32 adjectives. Neutral, all distinct from animal list.
  const ADJ = [
    "brisk","calm","candid","clever","crisp","deft","eager","frank",
    "gentle","hardy","honest","humble","jovial","keen","kind","lively",
    "lucid","mellow","mild","neat","nimble","noble","plucky","prompt",
    "quiet","rapid","ready","smart","steady","sturdy","spry","vivid"
  ];

  // 64 animals. Biology-flavored, no overlap with adjectives.
  const ANIMAL = [
    "ant","axolotl","badger","beaver","beetle","bison","bobcat","camel",
    "caribou","chamois","chinchilla","cougar","coyote","crane","dolphin","dormouse",
    "echidna","egret","falcon","ferret","finch","fox","gazelle","gibbon",
    "goose","hare","hawk","hedgehog","heron","ibex","ibis","jackal",
    "jaguar","kestrel","lemming","lemur","lynx","marlin","marmot","marten",
    "meerkat","mongoose","narwhal","newt","ocelot","okapi","opossum","otter",
    "owl","panda","pangolin","plover","puffin","raven","salmon","serval",
    "shrew","sparrow","stoat","swift","tapir","toucan","urial","weasel"
  ];

  // Slugify a name into a URL-safe token: lowercase, accents stripped,
  // anything non-alphanumeric collapsed to "_", leading/trailing "_" trimmed.
  // Used both for the embedded name in the final code and as the hash input,
  // so "Alice Smith", "alice smith", and "alice_smith" all produce the same
  // passcode.
  function nameToken(name) {
    return (name || "")
      .toLowerCase()
      .normalize("NFKD")
      .replace(/[̀-ͯ]/g, "")  // strip combining diacritics
      .replace(/[^a-z0-9]+/g, "_")
      .replace(/^_+|_+$/g, "");
  }

  // SHA-256 of (name token | moduleId-with-version | salt) → adj-animal.
  // moduleId/version are folded into the hash input so the same student gets a
  // different passcode per module and per scoring revision.
  async function hashName(name, moduleIdWithVersion, salt) {
    const input = nameToken(name) + "|" + moduleIdWithVersion + "|" + (salt || "");
    const buf = new TextEncoder().encode(input);
    const digest = await crypto.subtle.digest("SHA-256", buf);
    const hex = Array.from(new Uint8Array(digest))
      .map(b => b.toString(16).padStart(2, "0")).join("");
    const adjIdx  = parseInt(hex.slice(0, 4), 16) % ADJ.length;
    const animIdx = parseInt(hex.slice(4, 8), 16) % ANIMAL.length;
    return ADJ[adjIdx] + "-" + ANIMAL[animIdx];
  }

  const state = {
    moduleId: null,
    version: 1,
    salt: "",
    counts:   { pretest: 0, scaffold: 0, posttest: 0 },
    bits:     { pretest: [], scaffold: [], posttest: [] },
    // Parallel boolean array — true once a position has been recorded.
    // Lets the UI distinguish "answered wrong" from "not yet answered" on reload.
    answered: { pretest: [], scaffold: [], posttest: [] },
    // Manipulation counts keyed by an arbitrary stage label (typically "A","B",…).
    // Tracks how much the student actually engaged with each interactive panel —
    // independent of whether their predictions were correct.
    manipulations: {},
    studentName: null,
    passcode: null,
    // Epoch ms when the student confirmed their name (the clock start for
    // "how fast they worked"). Persisted so a reload measures from the true
    // first start, not the reload.
    startTime: null,
    // Attention-weighted counterpart to startTime: milliseconds accumulated
    // between consecutive signs of life, with any gap longer than IDLE_GAP_MS
    // thrown away. Persisted, so it survives reloads the same way.
    activeMs: 0,
    lastTick: null,
    mountFinalCode: null,
    onReady: null,
    finished: false,
  };

  function storageKey() {
    return "bio202-score:" + state.moduleId + "v" + state.version
      + ":" + nameToken(state.studentName);
  }

  function save() {
    if (!state.studentName) return;
    try {
      localStorage.setItem(storageKey(), JSON.stringify({
        bits: state.bits, answered: state.answered, finished: state.finished,
        manipulations: state.manipulations, startedAt: state.startTime,
        activeMs: state.activeMs
      }));
    } catch (e) { /* storage full or disabled — fail silent */ }
  }

  function load() {
    if (!state.studentName) return;
    try {
      const raw = localStorage.getItem(storageKey());
      if (!raw) return;
      const obj = JSON.parse(raw);
      // Only restore if length matches (otherwise version drift wipes it).
      ["pretest","scaffold","posttest"].forEach(g => {
        if (obj.bits && Array.isArray(obj.bits[g]) && obj.bits[g].length === state.counts[g]) {
          state.bits[g] = obj.bits[g].map(x => x ? 1 : 0);
        }
        if (obj.answered && Array.isArray(obj.answered[g]) && obj.answered[g].length === state.counts[g]) {
          state.answered[g] = obj.answered[g].map(Boolean);
        }
      });
      if (obj.manipulations && typeof obj.manipulations === "object") {
        state.manipulations = {};
        Object.keys(obj.manipulations).forEach(k => {
          const v = obj.manipulations[k];
          if (typeof v === "number" && isFinite(v) && v >= 0) state.manipulations[k] = v | 0;
        });
      }
      if (typeof obj.startedAt === "number" && isFinite(obj.startedAt)) {
        state.startTime = obj.startedAt;
      }
      if (typeof obj.activeMs === "number" && isFinite(obj.activeMs) && obj.activeMs >= 0) {
        state.activeMs = obj.activeMs;
      }
      state.finished = !!obj.finished;
    } catch (e) { /* parse error — ignore */ }
  }

  // --- cross-lesson carryover ------------------------------------------------
  // A lesson stores the number the student produced with their own hands; a
  // later lesson opens on that number instead of a fresh control. This is what
  // welds the slope thread together: the rate landed in one lesson becomes the
  // lever in the next, so "the quantity you have been fitting all along" is the
  // student's own value on screen rather than an assertion.
  //
  // Scoped to the student, not the module — deliberately outside storageKey(),
  // which is per-module and version-stamped. Carried values survive a module
  // version bump; they are inputs to a later lesson, not scoring state.
  //
  //   Score.carry("l7.slope", 0.65)
  //   Score.recall("l7.slope")          -> 0.65, or null if never set
  //   Score.recallInfo("l7.slope")      -> {value, from, at} or null

  function carryKey() {
    return "bio202-carry:" + nameToken(state.studentName);
  }

  function readCarry() {
    if (!state.studentName) return {};
    try {
      const raw = localStorage.getItem(carryKey());
      if (!raw) return {};
      const obj = JSON.parse(raw);
      return (obj && typeof obj === "object") ? obj : {};
    } catch (e) { return {}; }
  }

  function carry(key, value) {
    if (!state.studentName) return false;   // nothing to key on yet
    if (typeof key !== "string" || !key) return false;
    if (typeof value === "number" && !isFinite(value)) return false;
    try {
      const all = readCarry();
      all[key] = { v: value, from: state.moduleId, at: Date.now() };
      localStorage.setItem(carryKey(), JSON.stringify(all));
      return true;
    } catch (e) { return false; }          // storage full or disabled — fail silent
  }

  function recall(key, fallback) {
    const rec = readCarry()[key];
    if (!rec || typeof rec !== "object" || !("v" in rec)) {
      return (fallback === undefined) ? null : fallback;
    }
    return rec.v;
  }

  function recallInfo(key) {
    const rec = readCarry()[key];
    if (!rec || typeof rec !== "object" || !("v" in rec)) return null;
    return { value: rec.v, from: rec.from || null, at: rec.at || null };
  }

  function clearCarry() {
    if (!state.studentName) return;
    try { localStorage.removeItem(carryKey()); } catch (e) { /* ignore */ }
  }

  // ---- Attention clock ------------------------------------------------------
  // Wall-clock elapsed is an upper bound on effort and a bad one: a student who
  // opens the lesson, walks away, and comes back after dinner reads as three
  // hours of work. So alongside it we accumulate *active* time — the sum of the
  // gaps between consecutive signs of life, discarding any gap longer than
  // IDLE_GAP_MS. Two minutes of genuine staring at a chart still counts; a
  // lunch break does not.
  //
  // "Signs of life" are deliberately broad (pointer, key, scroll, tab-focus)
  // rather than only Score's own record/bump calls, because reading is work
  // too and a student can spend a legitimate stretch on a stage without
  // touching a control. The floor is honest either way: active time can never
  // exceed wall-clock time, and both travel in the code so a suspicious ratio
  // is visible to the instructor rather than hidden.
  const IDLE_GAP_MS = 120 * 1000;
  let activityBound = false;

  function tickActivity() {
    if (!state.startTime) return;         // clock has not started yet
    const now = Date.now();
    if (state.lastTick != null) {
      const gap = now - state.lastTick;
      if (gap > 0 && gap <= IDLE_GAP_MS) state.activeMs += gap;
    }
    state.lastTick = now;
  }

  function bindActivity() {
    if (activityBound || typeof document === "undefined") return;
    activityBound = true;
    const evts = ["pointerdown", "keydown", "wheel", "input", "change", "scroll"];
    evts.forEach(e => document.addEventListener(e, tickActivity, { passive: true, capture: true }));
    // Returning to the tab restarts the clock without crediting the time away:
    // reset lastTick so the gap spanning the absence is never counted, and
    // leaving persists what has accrued so far.
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") { tickActivity(); state.lastTick = null; save(); }
      else { state.lastTick = Date.now(); }
    });
  }

  // Seconds of attention, floored at 0 and never above wall-clock elapsed.
  function activeSeconds() {
    if (!state.startTime) return 0;
    const ms = Math.max(0, state.activeMs);
    return Math.min(elapsedSeconds(), Math.round(ms / 1000));
  }

  function init(opts) {
    state.moduleId = String(opts.moduleId);
    state.version = opts.version || 1;
    state.salt = resolveSalt(opts.salt);
    state.counts.pretest  = opts.pretest  | 0;
    state.counts.scaffold = opts.scaffold | 0;
    state.counts.posttest = opts.posttest | 0;
    state.bits.pretest      = new Array(state.counts.pretest ).fill(0);
    state.bits.scaffold     = new Array(state.counts.scaffold).fill(0);
    state.bits.posttest     = new Array(state.counts.posttest).fill(0);
    state.answered.pretest  = new Array(state.counts.pretest ).fill(false);
    state.answered.scaffold = new Array(state.counts.scaffold).fill(false);
    state.answered.posttest = new Array(state.counts.posttest).fill(false);
    state.onReady = typeof opts.onReady === "function" ? opts.onReady : null;
    state.mountFinalCode = opts.mountFinalCode
      ? document.querySelector(opts.mountFinalCode) : null;
    state.manipTracker = (opts.showManipulationTracker !== false);

    renderNamePrompt(opts.mountNamePrompt);
  }

  function renderNamePrompt(selector) {
    let mount;
    if (selector) {
      mount = document.querySelector(selector);
      if (!mount) {
        console.warn("Score: mountNamePrompt selector not found:", selector);
        return;
      }
    } else {
      mount = document.createElement("div");
      document.body.insertBefore(mount, document.body.firstChild);
    }

    mount.classList.add("score-name-mount");
    mount.innerHTML =
      '<div class="score-card score-name-card">' +
        '<h3 class="score-card-h">Enter your name</h3>' +
        '<div class="score-name-row">' +
          '<input id="score-name-input" type="text" autocomplete="off" placeholder="first &amp; last name" />' +
          '<button id="score-name-confirm" type="button">Confirm</button>' +
        '</div>' +
        '<p id="score-name-status" class="score-name-status"></p>' +
      '</div>';

    const input = mount.querySelector("#score-name-input");
    const btn   = mount.querySelector("#score-name-confirm");
    const stat  = mount.querySelector("#score-name-status");

    async function confirm() {
      const name = input.value.trim();
      if (!name) { stat.textContent = "Name required."; return; }
      btn.disabled = true; input.disabled = true;
      stat.textContent = "Generating passcode…";
      try {
        state.studentName = name;
        state.passcode = await hashName(
          name,
          state.moduleId + "v" + state.version,
          state.salt
        );
        load();
        // Start the clock on first confirm; a resumed session keeps the
        // original start restored by load() above.
        if (!state.startTime) { state.startTime = Date.now(); save(); }
        state.lastTick = Date.now();
        bindActivity();
        stat.textContent = "Confirmed.";
        if (state.onReady) state.onReady(state.passcode);
      } catch (e) {
        btn.disabled = false; input.disabled = false;
        stat.textContent = "Error generating passcode: " + (e && e.message || e);
      }
    }

    btn.addEventListener("click", confirm);
    input.addEventListener("keydown", (e) => { if (e.key === "Enter") confirm(); });
  }

  function recordBit(group, idx, bit) {
    if (!state.bits[group]) return;
    if (idx < 0 || idx >= state.counts[group]) {
      console.warn("Score: index", idx, "out of range for", group,
                   "(0.." + (state.counts[group]-1) + ")");
      return;
    }
    state.bits[group][idx] = bit ? 1 : 0;
    state.answered[group][idx] = true;
    tickActivity();
    save();
  }

  function isAnswered(group, idx) {
    return !!(state.answered[group] && state.answered[group][idx]);
  }
  function allAnswered(group) {
    const arr = state.answered[group];
    if (!arr || arr.length === 0) return true;  // an empty group is trivially complete
    return arr.every(Boolean);
  }
  function getBit(group, idx) {
    return state.bits[group] ? state.bits[group][idx] : undefined;
  }

  function recordPretest(idx, bit)    { recordBit("pretest",  idx, bit); }
  function recordCheckpoint(idx, bit) { recordBit("scaffold", idx, bit); }
  function recordPosttest(idx, bit)   { recordBit("posttest", idx, bit); }

  // Count an interactive manipulation. `key` is typically a stage label
  // ("A","B",…) but can be any short string. Each call increments by one.
  // Called from lessons via `Score.bumpManipulation(stage)` inside slider
  // input handlers, simulate/reseed buttons, drag-to-predict canvases, etc.
  function bumpManipulation(key) {
    if (!key) return;
    // sim.js randomises each stage's seed at load by firing the `input` event
    // the lesson already listens for. That event is indistinguishable from a
    // student dragging the slider, so without this guard every lesson would
    // open having already logged a manipulation on every seeded stage — and
    // the engagement column in the instructor's export would be measuring the
    // page setting itself up rather than the student doing anything.
    if (typeof SEEDING_IN_PROGRESS !== "undefined" && SEEDING_IN_PROGRESS) return;
    // The wire format packs the map as KEYCOUNT pairs (`A12B8`), so a key
    // containing a digit would make the token ambiguous on the way back.
    // Strip to letters and drop the call rather than emit a code the
    // instructor's decoder will mis-parse.
    const k = String(key).replace(/[^A-Za-z]/g, "");
    if (!k) { console.warn("Score: manipulation key has no letters:", key); return; }
    state.manipulations[k] = (state.manipulations[k] | 0) + 1;
    tickActivity();
    save();
    renderManipTracker();
  }
  function renderManipTracker() {
    if (state.manipTracker === false) return;
    let panel = document.querySelector(".score-manip");
    if (!panel) {
      panel = document.createElement("div");
      panel.className = "score-manip";
      panel.innerHTML = '<h4>your activity</h4><div class="body"></div>';
      document.body.appendChild(panel);
    }
    const keys = Object.keys(state.manipulations).sort();
    if (keys.length === 0) return;
    panel.classList.add("shown");
    let total = 0;
    let html = "";
    for (const k of keys) {
      const v = state.manipulations[k];
      total += v;
      html += '<div class="row"><span class="stage">stage ' + k + '</span><span class="count">' + v + '</span></div>';
    }
    html += '<div class="row total"><span class="stage">total</span><span class="count">' + total + '</span></div>';
    panel.querySelector(".body").innerHTML = html;
  }
  function getManipulations() { return Object.assign({}, state.manipulations); }
  function manipulationCount(key) { return state.manipulations[String(key)] | 0; }

  // Serialise the manipulations object into a compact `A12B8C5D9`-style token.
  // Keys are sorted alphabetically for stability. Empty object → "".
  function manipulationsToken(map) {
    const keys = Object.keys(map).sort();
    let s = "";
    for (const k of keys) {
      const v = map[k] | 0;
      if (v < 0) continue;
      s += k + v.toString(10);
    }
    return s;
  }
  function parseManipulationsToken(s) {
    const out = {};
    if (!s) return out;
    // Keys are letters only (no digits, no underscores); values are decimal ints.
    // Format is like "A12B8C5D9" — alphabetic key then count, repeated.
    const re = /([A-Za-z]+)(\d+)/g;
    let m;
    while ((m = re.exec(s)) !== null) out[m[1]] = parseInt(m[2], 10);
    return out;
  }

  // ---- Elapsed working time -------------------------------------------------
  // Wall-clock seconds between name-confirm and finish(). This is an upper
  // bound on effort (a student who leaves the tab open inflates it);
  // activeSeconds() above is the idle-trimmed lower bound, and the per-stage
  // manipulation counts travel alongside both as an engagement cross-check.
  function elapsedSeconds() {
    if (!state.startTime) return 0;
    return Math.max(0, Math.round((Date.now() - state.startTime) / 1000));
  }

  // ---- v3 opaque codec ------------------------------------------------------
  // SHA-256 counter-mode keystream over (salt | module | version). Deterministic
  // for a given salt, so the verifier reproduces it to decrypt.
  async function keystream(nBytes, salt, modVer) {
    const out = new Uint8Array(nBytes);
    const enc = new TextEncoder();
    let filled = 0, counter = 0;
    while (filled < nBytes) {
      const digest = await crypto.subtle.digest(
        "SHA-256", enc.encode("ks|" + (salt || "") + "|" + modVer + "|" + counter));
      const block = new Uint8Array(digest);
      const take = Math.min(block.length, nBytes - filled);
      out.set(block.subarray(0, take), filled);
      filled += take; counter++;
    }
    return out;
  }

  // 6-hex tamper tag over the *cleartext* payload, keyed by salt + module.
  async function macHex(payloadStr, salt, modVer) {
    const digest = await crypto.subtle.digest(
      "SHA-256", new TextEncoder().encode("mac|" + payloadStr + "|" + (salt || "") + "|" + modVer));
    return Array.from(new Uint8Array(digest))
      .map(b => b.toString(16).padStart(2, "0")).join("").slice(0, 6);
  }

  function b64urlEncode(bytes) {
    let bin = "";
    for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
    return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  }
  function b64urlDecode(str) {
    let s = str.replace(/-/g, "+").replace(/_/g, "/");
    while (s.length % 4) s += "=";
    const bin = atob(s);
    const out = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
    return out;
  }

  // Internal payload — the only place the cleartext fields live together.
  function payloadString() {
    return [
      nameToken(state.studentName),
      state.bits.pretest.join(""),
      state.bits.scaffold.join(""),
      state.bits.posttest.join(""),
      String(elapsedSeconds()),
      manipulationsToken(state.manipulations),
      String(activeSeconds())
    ].join("|");
  }

  async function buildCodeAsync() {
    if (!state.studentName) return null;
    const modVer = state.moduleId + "v" + state.version;
    const payload = payloadString();
    const bytes = new TextEncoder().encode(payload);
    const ks = await keystream(bytes.length, state.salt, modVer);
    const cipher = new Uint8Array(bytes.length);
    for (let i = 0; i < bytes.length; i++) cipher[i] = bytes[i] ^ ks[i];
    const mac = await macHex(payload, state.salt, modVer);
    return modVer + "." + b64urlEncode(cipher) + "." + mac;
  }

  // Verifier-side: reverse a v3 code with the instructor's salt. Returns a
  // structured record; `ok` is true only when the MAC checks out and the
  // decrypted payload is well-formed (a wrong salt yields ok:false).
  async function decodeCode(code, salt) {
    if (typeof code !== "string") return null;
    salt = resolveSalt(salt);  // blank in the verifier → the project default
    const parts = code.trim().split(".");
    if (parts.length !== 3) return null;  // not a v3 code
    const [modVer, blob, mac] = parts;
    const m = modVer.match(/^([a-z][a-z0-9_]*)v(\d+)$/i);
    if (!m) return null;
    let cipher;
    try { cipher = b64urlDecode(blob); } catch (e) { return null; }
    const ks = await keystream(cipher.length, salt, modVer);
    const bytes = new Uint8Array(cipher.length);
    for (let i = 0; i < cipher.length; i++) bytes[i] = cipher[i] ^ ks[i];
    let payload;
    try { payload = new TextDecoder("utf-8", { fatal: false }).decode(bytes); }
    catch (e) { return null; }
    const f = payload.split("|");
    const base = { moduleId: m[1], version: parseInt(m[2], 10), raw: code.trim() };
    // Six fields is the original layout; seven adds active seconds. Anything
    // else means the payload did not decrypt to a record at all.
    if (f.length !== 6 && f.length !== 7) {
      return Object.assign(base, { ok: false, macOk: false, reason: "wrong salt or corrupt code" });
    }
    const expectMac = await macHex(payload, salt, modVer);
    const [nameTok, pre, sc, po, elapsed, manip, active] = f;
    const bitsOk = /^[01]*$/.test(pre) && /^[01]*$/.test(sc) && /^[01]*$/.test(po);
    const elapsedSec = parseInt(elapsed, 10) || 0;
    return Object.assign(base, {
      ok: expectMac === mac && bitsOk,
      macOk: expectMac === mac,
      nameToken: nameTok,
      pretestBits: pre, scaffoldBits: sc, posttestBits: po,
      elapsedSec: elapsedSec,
      // null, not 0, for the older six-field codes: "this code predates the
      // attention clock" and "this student was never active" must not print
      // the same way in the instructor's tools.
      activeSec: (f.length === 7) ? (parseInt(active, 10) || 0) : null,
      manipulationsToken: manip,
      manipulations: parseManipulationsToken(manip)
    });
  }

  async function finish() {
    state.finished = true; save();
    if (!state.mountFinalCode) {
      console.warn("Score: finish() called but no mountFinalCode container.");
      return;
    }
    // Encoding is async (WebCrypto). Show a placeholder so the panel never
    // flashes empty while the digest runs.
    state.mountFinalCode.innerHTML =
      '<div class="score-card score-final-card">' +
        '<h3 class="score-card-h">Here is your code</h3>' +
        '<p class="score-card-p">Generating…</p>' +
      '</div>';
    const code = await buildCodeAsync();
    if (!code) {
      state.mountFinalCode.innerHTML =
        '<div class="score-card score-final-card">' +
          '<p class="score-card-p">Cannot build code — no name confirmed.</p>' +
        '</div>';
      return;
    }
    state.mountFinalCode.innerHTML =
      '<div class="score-card score-final-card">' +
        '<h3 class="score-card-h">Here is your code</h3>' +
        '<div class="score-code-row">' +
          '<code class="score-code" id="score-code-display">' + code + '</code>' +
          '<button class="score-copy-btn" id="score-copy-btn" type="button">Copy</button>' +
        '</div>' +
        '<p class="score-copy-status" id="score-copy-status"></p>' +
      '</div>';

    const btn  = state.mountFinalCode.querySelector("#score-copy-btn");
    const stat = state.mountFinalCode.querySelector("#score-copy-status");
    btn.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(code);
        stat.textContent = "Copied.";
      } catch (e) {
        stat.textContent = "Copy failed — select the code and copy it manually.";
      }
    });
  }

  // Scoring helpers — the module decides which to use per checkpoint.
  // All return 1 (correct) or 0.
  const scoring = {
    equals:    (a, b) => (a === b ? 1 : 0),
    signMatch: (predicted, actual) => {
      if (predicted === 0 && actual === 0) return 1;
      return Math.sign(predicted) === Math.sign(actual) ? 1 : 0;
    },
    // "Same order of magnitude" = within a factor of 10 in either direction.
    // 0.01 vs 0.05 → 1; 0.01 vs 100 → 0.
    sameOrder: (predicted, actual) => {
      if (predicted === 0 && actual === 0) return 1;
      if (predicted === 0 || actual === 0) return 0;
      return Math.abs(Math.log10(Math.abs(predicted)) - Math.log10(Math.abs(actual))) <= 1 ? 1 : 0;
    },
    withinPct: (predicted, actual, pct) =>
      (Math.abs(predicted - actual) <= Math.abs(actual) * pct / 100 ? 1 : 0),
    inRange:   (val, lo, hi) => (val >= lo && val <= hi ? 1 : 0),
    oneOf:     (val, set)    => (set.indexOf(val) >= 0 ? 1 : 0),
  };

  // Verifier-side: parse a student-submitted code into structured fields.
  // Accepts two formats:
  //   v2+: MODULEvVER-NAMETOKEN-ADJ-ANIMAL-SCAFF-MANIPULATIONS  (6 parts)
  //   v1:  MODULEvVER-NAMETOKEN-ADJ-ANIMAL-PRE-SCAFF-POST       (7 parts; legacy)
  function parseCode(code) {
    if (typeof code !== "string") return null;
    const trimmed = code.trim();
    const parts = trimmed.split("-");
    const isBits = (s) => /^[01]*$/.test(s);
    const manipRe = /^[A-Za-z0-9_]*$/;

    if (parts.length === 6) {
      const [modVer, name, adj, animal, sc, manip] = parts;
      const m = modVer.match(/^([a-z][a-z0-9_]*)v(\d+)$/i);
      if (!m) return null;
      if (!/^[a-z0-9_]*$/.test(name)) return null;
      if (!isBits(sc)) return null;
      if (!manipRe.test(manip)) return null;
      return {
        moduleId: m[1], version: parseInt(m[2], 10),
        nameToken: name,
        passcode: adj + "-" + animal,
        adjective: adj, animal: animal,
        pretestBits: "", scaffoldBits: sc, posttestBits: "",
        manipulationsToken: manip,
        manipulations: parseManipulationsToken(manip),
        raw: trimmed
      };
    }
    if (parts.length === 7) {
      const [modVer, name, adj, animal, pre, sc, po] = parts;
      const m = modVer.match(/^([a-z][a-z0-9_]*)v(\d+)$/i);
      if (!m) return null;
      if (!/^[a-z0-9_]*$/.test(name)) return null;
      if (!isBits(pre) || !isBits(sc) || !isBits(po)) return null;
      return {
        moduleId: m[1], version: parseInt(m[2], 10),
        nameToken: name,
        passcode: adj + "-" + animal,
        adjective: adj, animal: animal,
        pretestBits:  pre, scaffoldBits: sc, posttestBits: po,
        manipulationsToken: "",
        manipulations: {},
        raw: trimmed
      };
    }
    return null;
  }

  global.Score = {
    init, recordPretest, recordCheckpoint, recordPosttest, finish,
    isAnswered, allAnswered, getBit,
    carry, recall, recallInfo, clearCarry,   // cross-lesson carryover
    bumpManipulation, getManipulations, manipulationCount,
    scoring, nameToken, elapsedSeconds, activeSeconds,
    decodeCode,            // v3 verifier entry point
    DEFAULT_SALT,          // so instructor tools can prefill the salt field
    hashName, parseCode,   // legacy dash-format only
    // testing/inspection only
    _state: state,
    _buildCodeAsync: buildCodeAsync,
    _wordlists: { ADJ, ANIMAL }
  };
})(typeof window !== "undefined" ? window : globalThis);
