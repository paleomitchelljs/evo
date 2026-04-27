// BIO 202 score-code library.
//
// Drop-in for a module HTML file:
//   <link rel="stylesheet" href="../lib/score.css">
//   <script src="../lib/score.js"></script>
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
// Final code format:
//   MODULEID v VERSION - NAMETOKEN - ADJECTIVE - ANIMAL - PREBITS - SCAFFOLDBITS - POSTBITS
//   e.g.  s01v1-alice_smith-noble-otter-11-10110-10
//
// The name token is the student's name slugified (lowercase, non-alphanumerics
// collapsed to underscores). It is also the hash input, so any name spelling
// the instructor recognizes ("Bob" vs "Robert") still produces a verifiable
// passcode — the verifier just re-hashes the embedded token.

(function (global) {
  "use strict";

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
    studentName: null,
    passcode: null,
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
        bits: state.bits, answered: state.answered, finished: state.finished
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
      state.finished = !!obj.finished;
    } catch (e) { /* parse error — ignore */ }
  }

  function init(opts) {
    state.moduleId = String(opts.moduleId);
    state.version = opts.version || 1;
    state.salt = opts.salt || "";
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
          '<input id="score-name-input" type="text" autocomplete="off" placeholder="full name" />' +
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

  function buildCode() {
    if (!state.passcode) return null;
    return state.moduleId + "v" + state.version + "-" +
      nameToken(state.studentName) + "-" +
      state.passcode + "-" +
      state.bits.pretest.join("")  + "-" +
      state.bits.scaffold.join("") + "-" +
      state.bits.posttest.join("");
  }

  function finish() {
    state.finished = true; save();
    if (!state.mountFinalCode) {
      console.warn("Score: finish() called but no mountFinalCode container.");
      return;
    }
    const code = buildCode();
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
  // Format: MODULEvVER-NAMETOKEN-ADJ-ANIMAL-PRE-SCAFF-POST  (exactly 7 parts)
  function parseCode(code) {
    if (typeof code !== "string") return null;
    const trimmed = code.trim();
    const parts = trimmed.split("-");
    if (parts.length !== 7) return null;
    const [modVer, name, adj, animal, pre, sc, po] = parts;
    const m = modVer.match(/^([a-z][a-z0-9_]*)v(\d+)$/i);
    if (!m) return null;
    if (!/^[a-z0-9_]*$/.test(name)) return null;
    const isBits = (s) => /^[01]*$/.test(s);
    if (!isBits(pre) || !isBits(sc) || !isBits(po)) return null;
    return {
      moduleId: m[1], version: parseInt(m[2], 10),
      nameToken: name,
      passcode: adj + "-" + animal,
      adjective: adj, animal: animal,
      pretestBits:  pre, scaffoldBits: sc, posttestBits: po,
      raw: trimmed
    };
  }

  global.Score = {
    init, recordPretest, recordCheckpoint, recordPosttest, finish,
    isAnswered, allAnswered, getBit,
    scoring, hashName, parseCode, nameToken,
    // testing/inspection only
    _state: state,
    _wordlists: { ADJ, ANIMAL }
  };
})(typeof window !== "undefined" ? window : globalThis);
