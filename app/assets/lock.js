// BIO 202 release gate — the student-facing half of LOCKS.txt.
//
// LOCKS.txt at the repo root carries one row per page:
//
//     lesson7         o   Tracing how much of a parent ends up in their child
//     lesson8         x   Counting the ratios that breed true
//     \_____/         |
//      key         o = open, x = locked
//
// The instructor flips a letter and commits. This file is what makes that
// letter mean something in a browser:
//
//   * A lesson page includes it and calls nothing. The script works out which
//     page it is on from the filename, fetches LOCKS.txt, and if that row says
//     x it replaces the document with a short notice before the lesson is
//     readable.
//
//   * The landing page calls Lock.load() and styles its own cards from the
//     result, so locked lessons are greyed out or dropped entirely depending
//     on the file's `display:` line.
//
// WHAT THIS IS NOT
// A static site cannot keep a secret. Everything here runs in the student's
// browser, so disabling JavaScript, or opening the page source, or reading
// LOCKS.txt directly, all get past it. That is fine: the job is to stop a
// student wandering into next week's homework, not to withstand one who is
// trying. Nothing that must genuinely stay unseen belongs in a public repo.
//
// PERSONAL UNLOCK
// The notice on a locked page carries a passphrase box. Entering the right one
// sets a flag in this browser's localStorage and every locked page opens for
// good, so a lesson can be tested and refined before it is released. Clear it
// again with ?relock=1 on any page, or by clearing site data.
//
// The passphrase is checked against a salted SHA-256 kept below, so the phrase
// itself is not sitting in the source. That is the only claim being made: this
// is a convenience for the instructor, not a security boundary. Anyone who
// reads this file can set the same localStorage key by hand, exactly as they
// could already read LOCKS.txt or turn JavaScript off. See WHAT THIS IS NOT.
//
// FAILURE MODE
// Deliberately fail-open. If LOCKS.txt is missing, unreachable, or malformed,
// every page opens, and a page with no row of its own opens too. A student
// blocked from work they were assigned because a fetch hiccuped is a far worse
// outcome than a student seeing a lesson a week early.

(function (global) {
  "use strict";

  // How far the current page sits below the repo root. Lessons and scaffolds
  // live two directories down (app/lessons/, app/scaffolds/); the landing page
  // is at the root.
  function rootPrefix() {
    return /\/app\//.test(global.location.pathname) ? "../../" : "./";
  }
  function locksUrl() { return rootPrefix() + "LOCKS.txt"; }

  // The key for the current page: the filename without .html, so
  // app/lessons/lesson7.html -> "lesson7" and
  // app/scaffolds/s04_fixation_probability.html -> "s04".
  function pageKey() {
    const file = (global.location.pathname.split("/").pop() || "").replace(/\.html?$/i, "");
    if (!file) return null;
    const m = file.match(/^(s\d+)_/);     // scaffolds carry a descriptive tail
    return m ? m[1] : file;
  }

  // Parse LOCKS.txt. Whitespace is free-form and everything after the state
  // letter is a comment for the instructor, so the file can stay readable.
  function parse(text) {
    const state = {};
    let display = "dim";
    text.split("\n").forEach(line => {
      const trimmed = line.trim();
      if (!trimmed) return;
      if (trimmed[0] === "#") return;
      const dm = trimmed.match(/^display\s*:\s*(\w+)/i);
      if (dm) { display = dm[1].toLowerCase() === "hide" ? "hide" : "dim"; return; }
      const m = trimmed.match(/^([A-Za-z][\w-]*)\s+([oxOX])\b/);
      if (!m) return;
      state[m[1]] = (m[2].toLowerCase() === "x");   // true == locked
    });
    return { locked: state, display: display };
  }

  let cached = null;
  function load() {
    if (cached) return cached;
    cached = fetch(locksUrl(), { cache: "no-store" })
      .then(r => (r.ok ? r.text() : ""))
      .then(t => parse(t))
      // An instructor unlock makes every row read as open, so the landing page
      // stops greying cards out as well.
      .then(cfg => (isUnlocked() ? { locked: {}, display: cfg.display } : cfg))
      // Any failure at all -> nothing is locked. See FAILURE MODE above.
      .catch(() => ({ locked: {}, display: "dim" }));
    return cached;
  }

  function isPreview() {
    return /[?&]preview=?1?\b/.test(global.location.search);
  }

  // Salted SHA-256 of the instructor passphrase, so the phrase itself is not in
  // the source. See PERSONAL UNLOCK above for what that does and does not buy.
  const UNLOCK_SALT = "bio202-lock-2026-preview";
  const UNLOCK_HASH = "7aa815f8ca97c9dec65305f9a2603a0a938033a6c1b8a14ed074828d021fc5d5";
  const UNLOCK_KEY  = "bio202-unlocked";

  function store() {
    try { return global.localStorage; } catch (e) { return null; }   // private mode throws
  }
  function isUnlocked() {
    if (/[?&]relock=?1?\b/.test(global.location.search)) {
      const s = store(); if (s) { try { s.removeItem(UNLOCK_KEY); } catch (e) {} }
      return false;
    }
    const s = store();
    try { return !!s && s.getItem(UNLOCK_KEY) === "1"; } catch (e) { return false; }
  }
  function setUnlocked() {
    const s = store();
    try { if (s) s.setItem(UNLOCK_KEY, "1"); } catch (e) {}
  }
  async function checkPhrase(phrase) {
    if (!global.crypto || !global.crypto.subtle) return false;
    const buf = new TextEncoder().encode(String(phrase) + UNLOCK_SALT);
    const digest = await global.crypto.subtle.digest("SHA-256", buf);
    return Array.from(new Uint8Array(digest))
      .map(b => b.toString(16).padStart(2, "0")).join("") === UNLOCK_HASH;
  }

  function noticeHtml(title) {
    return '<div style="min-height:100vh;display:flex;align-items:center;'
      + 'justify-content:center;background:#fafaf7;color:#1d1d1b;'
      + 'font:16px/1.55 -apple-system,BlinkMacSystemFont,\'Helvetica Neue\',sans-serif;'
      + 'margin:0;padding:24px;">'
      + '<div style="max-width:44ch;text-align:center;">'
      + '<div style="font-size:12px;letter-spacing:0.08em;text-transform:uppercase;'
      + 'color:#6b6b68;margin-bottom:10px;">Not open yet</div>'
      + '<h1 style="font-size:26px;margin:0 0 14px;letter-spacing:-0.01em;">' + title + '</h1>'
      + '<p style="color:#6b6b68;margin:0 0 22px;">This one opens later in the term. '
      + 'It will appear on the course page when it does.</p>'
      + '<a href="' + rootPrefix() + 'index.html" style="color:#2f6b8f;">Back to the course page</a>'
      + '<form id="lock-unlock" style="margin:30px auto 0;max-width:22rem;'
      + 'border-top:1px solid #e2e0d9;padding-top:18px;">'
      + '<label for="lock-phrase" style="display:block;font-size:12px;letter-spacing:0.06em;'
      + 'text-transform:uppercase;color:#6b6b68;margin-bottom:8px;">Instructor access</label>'
      + '<div style="display:flex;gap:8px;">'
      + '<input id="lock-phrase" type="password" autocomplete="current-password" '
      + 'placeholder="passphrase" style="flex:1;min-width:0;padding:8px 10px;'
      + 'border:1px solid #e2e0d9;border-radius:4px;font:14px inherit;background:#fff;">'
      + '<button type="submit" style="padding:8px 14px;border:0;border-radius:4px;'
      + 'background:#b23a48;color:#fff;font:14px inherit;cursor:pointer;">Unlock</button>'
      + '</div>'
      + '<div id="lock-msg" style="margin-top:9px;font-size:13px;color:#a8331a;min-height:1.2em;"></div>'
      + '</form>'
      + '</div></div>';
  }

  // Hold the page blank while we find out whether it is open. This script sits
  // in <head>, so at this point the body has not been parsed and nothing has
  // painted; without the curtain, a locked lesson would flash into view for
  // however long the fetch takes. The timer is the safety net: if the fetch
  // never settles, the page reveals itself anyway.
  const CURTAIN_MS = 2000;
  let curtain = null;
  function drawCurtain() {
    if (curtain || typeof document === "undefined" || !document.head) return;
    curtain = document.createElement("style");
    curtain.textContent = "html{visibility:hidden}";
    document.head.appendChild(curtain);
    global.setTimeout(liftCurtain, CURTAIN_MS);
  }
  function liftCurtain() {
    if (curtain && curtain.parentNode) curtain.parentNode.removeChild(curtain);
    curtain = null;
  }

  // Guard the page this script is running on. Runs automatically at the bottom
  // of this file; a lesson does not have to call anything.
  function guard() {
    const key = pageKey();
    if (!key || key === "index" || isPreview() || isUnlocked()) return;
    drawCurtain();
    load().then(cfg => {
      if (!cfg.locked[key]) { liftCurtain(); return; }
      const title = (document.title || "").replace(/^BIO 202\s*[—-]\s*/, "");
      // Replace the document rather than covering it: leaving the lesson in
      // the DOM behind an overlay would put the whole thing one Inspect away.
      const keep = document.title || "Not open yet";
      document.documentElement.innerHTML =
        "<head><meta charset='utf-8'><title>" + keep + "</title></head><body>"
        + noticeHtml(title) + "</body>";
      liftCurtain();
      wireUnlockForm();
      // Stop whatever the lesson was about to do next.
      if (global.stop) global.stop();
    }).catch(liftCurtain);
  }

  // Wired after the notice replaces the document, and before window.stop(),
  // so the handler survives the halt.
  function wireUnlockForm() {
    const form = document.getElementById("lock-unlock");
    if (!form) return;
    const input = document.getElementById("lock-phrase");
    const msg = document.getElementById("lock-msg");
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      msg.style.color = "#6b6b68";
      msg.textContent = "checking…";
      let ok = false;
      try { ok = await checkPhrase(input.value); } catch (err) { ok = false; }
      if (ok) {
        setUnlocked();
        msg.style.color = "#4a7a2a";
        msg.textContent = "Unlocked. Opening…";
        // Reload without ?relock, or the flag we just set is cleared on the way
        // back in and the unlock looks like it silently failed.
        const url = new URL(global.location.href);
        url.searchParams.delete("relock");
        global.location.replace(url.toString());
      } else {
        msg.style.color = "#a8331a";
        msg.textContent = "Not that one.";
        input.select();
      }
    });
    input.focus();
  }

  global.Lock = { load, parse, pageKey, isPreview, isUnlocked };
  guard();
})(typeof window !== "undefined" ? window : globalThis);
