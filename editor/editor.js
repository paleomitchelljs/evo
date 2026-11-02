/* The lesson editor, the page half (JM, 2026-11-01: "an editor so that I can directly rewrite text in panels and flag
   individual boxes and interactives and targets"). Served only by editor/server.py, which marks every piece of text the
   page's HTML holds with data-ed="k" (wrapped in <ed-run> where the words sit beside a control), every element with
   data-ln (its line in the file), and puts this script last. Three modes: Use, the page as a student has it; Edit
   text; Flag. The lesson's own handlers see nothing of a click or a key the editor takes. */
(function () {
  "use strict";
  const DATA = JSON.parse(document.getElementById("ed-units").textContent);
  const FILE = DATA.file, UNITS = new Map(DATA.units.map(u => [String(u.k), u]));
  const Q = new URLSearchParams(location.search);
  let HASH = DATA.hash, mode = "use", editing = null, pop = null, FLAGS = [], EDITS = [], tab = "flags", queue = Promise.resolve();

  const store = (kind) => ({
    get(k, d) { try { const v = window[kind].getItem("ed-" + k); return v === null ? d : v; } catch (e) { return d; } },
    set(k, v) { try { window[kind].setItem("ed-" + k, v); } catch (e) { /* private window */ } }
  });
  const ss = store("sessionStorage"), ls = store("localStorage");

  function h(tag, attrs, ...kids) {
    const el = document.createElement(tag);
    for (const k in attrs || {}) {
      const v = attrs[k];
      if (v == null || v === false) continue;
      if (k === "class") el.className = v;
      else if (k === "html") el.innerHTML = v;
      else if (k.startsWith("on")) el.addEventListener(k.slice(2), v);
      else el.setAttribute(k, v === true ? "" : v);
    }
    for (const c of kids) if (c != null) el.append(c);
    return el;
  }
  const squash = s => (s || "").replace(/\s+/g, " ").trim();
  const cut = (s, n) => (s.length > n ? s.slice(0, n - 1) + "…" : s);
  function textOf(html) { const t = document.createElement("template"); t.innerHTML = html; return t.content.textContent; }
  /* words to read in a list: a hover text's lines kept apart by " · " */
  function wordsOf(html, kind) {
    if (kind !== "tip") return squash(textOf(html));
    const t = document.createElement("template"); t.innerHTML = html;
    return [...t.content.childNodes].map(n => squash(n.textContent)).filter(Boolean).join(" · ");
  }
  function shown(el) {
    if (!el || !el.getClientRects().length) return false;
    return el.checkVisibility ? el.checkVisibility({ visibilityProperty: true }) : true;
  }
  const clock = t => new Date(t).toLocaleString([], { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });

  async function api(path, body) {
    const opt = body === undefined ? {} : { method: "POST", headers: { "Content-Type": "application/json", "X-Evo-Editor": "1" }, body: JSON.stringify(body) };
    let r;
    try { r = await fetch("/__editor/api/" + path, opt); } catch (e) { throw new Error("the editor's server is not answering (is its Terminal window still open?)"); }
    const out = (r.headers.get("content-type") || "").includes("json") ? await r.json() : { text: await r.text() };
    if (!r.ok) throw new Error(out.error || r.statusText);
    return out;
  }

  /* What the browser's editing leaves behind, cleared: its wrappers and styles, a stray <div> per line, the &nbsp; it
     types for a space at the end of a line. Inline markup the words had (b, i, sub, sup, a ...) stays. */
  const KEEP = new Set(["A", "ABBR", "B", "BDI", "BDO", "BR", "CITE", "CODE", "DEL", "DFN", "EM", "I", "INS", "KBD", "MARK", "Q",
                        "S", "SAMP", "SMALL", "SPAN", "STRONG", "SUB", "SUP", "U", "VAR", "WBR"]);
  function clean(html, orig) {
    const t = document.createElement("template"); t.innerHTML = html;
    (function walk(n) {
      for (const c of [...n.childNodes]) {
        if (c.nodeType !== 1) continue;
        walk(c);
        for (const a of ["style", "contenteditable", "spellcheck", "data-ed", "data-ln"]) c.removeAttribute(a);
        if (c.tagName === "DIV" || c.tagName === "P") {
          if (c.previousSibling) c.before(document.createElement("br"));
          c.replaceWith(...c.childNodes);
        } else if (!KEEP.has(c.tagName) || (c.tagName === "SPAN" && !c.attributes.length)) {
          c.replaceWith(...c.childNodes);
        } else if (c.tagName !== "BR" && c.tagName !== "WBR" && !c.textContent) {
          c.remove();
        }
      }
    })(t.content);
    let out = t.innerHTML;
    if (!/&nbsp;| /.test(orig || "")) out = out.replace(/&nbsp;/g, " ");
    else out = out.replace(/(?<=^|[\s>])&nbsp;|&nbsp;(?=$|[\s<])/g, " ");
    if (!/<br\s*\/?>\s*$/.test(orig || "")) out = out.replace(/(<br>\s*)+$/, "");
    return out.trim();
  }

  /* ---------------------------------------------------------------------------------------------------------- UI */
  const ui = h("div", { id: "ed-ui" });
  const layer = h("div", { id: "ed-layer" });
  const hl = h("div", { class: "ed-hl", hidden: true }, h("span", { class: "ed-hl-tag" }));
  const toastEl = h("div", { class: "ed-toast" });
  const tools = h("div", { class: "ed-tools", hidden: true });
  const HINT = {
    use: "",
    edit: "click words to rewrite them · an ⓘ mark opens its hover text · Enter saves, Esc cancels",
    flag: "click a box, plot, slider or target to flag it · Shift-click takes the whole box"
  };
  const modeBtn = {};
  const bar = h("div", { class: "ed-bar" }, h("a", { class: "ed-home", href: "/", title: "every page, with its flags" }, FILE.split("/").pop().replace(/\.html$/, "")));
  for (const [m, label, key] of [["use", "Use", "U"], ["edit", "Edit text", "E"], ["flag", "Flag", "F"]]) {
    modeBtn[m] = h("button", { class: "ed-mode", title: "Alt+" + key, onclick: () => setMode(m) }, label);
    bar.append(modeBtn[m]);
  }
  const drawerBtn = h("button", { class: "ed-drawer-btn", onclick: () => toggleDrawer() }, "Flags");
  const hint = h("span", { class: "ed-hint" });
  bar.append(drawerBtn, hint);

  const drawer = h("aside", { class: "ed-drawer", hidden: true });
  const tabBtn = {}, dbody = h("div", { class: "ed-dbody" });
  const tabs = h("div", { class: "ed-tabs" });
  for (const [t, label] of [["flags", "Flags"], ["edits", "Edits"], ["text", "All text"]]) {
    tabBtn[t] = h("button", { onclick: () => { tab = t; ss.set("tab", t); renderDrawer(true); } }, label);
    tabs.append(tabBtn[t]);
  }
  tabs.append(h("span", { class: "ed-sp" }), h("button", { class: "ed-x", title: "close", onclick: () => toggleDrawer(false) }, "×"));
  const studyBox = h("input", { type: "checkbox" }), pinBox = h("input", { type: "checkbox" });
  studyBox.checked = ls.get("study", "1") === "1";
  pinBox.checked = ls.get("pins", "1") === "1";
  studyBox.addEventListener("change", () => { ls.set("study", studyBox.checked ? "1" : "0"); toast(studyBox.checked ? "Every stage opens (study mode) from the next load." : "The page loads as a student has it from the next load."); });
  pinBox.addEventListener("change", () => { ls.set("pins", pinBox.checked ? "1" : "0"); placePins(); });
  drawer.append(tabs, dbody, h("div", { class: "ed-dfoot" },
    h("label", {}, studyBox, " open every stage (study mode)"), h("label", {}, pinBox, " show flags on the page")));
  ui.append(bar, drawer, hl, tools, toastEl);
  document.body.append(layer, ui);

  let toastT = 0;
  function toast(msg, kind) {
    toastEl.textContent = msg; toastEl.className = "ed-toast on " + (kind || "");
    clearTimeout(toastT); toastT = setTimeout(() => { toastEl.className = "ed-toast"; }, kind === "err" ? 8000 : 3800);
  }
  function flash(el, cls) { el.classList.remove(cls); void el.offsetWidth; el.classList.add(cls); setTimeout(() => el.classList.remove(cls), 1400); }

  function setMode(m) {
    if (editing) commit();
    if (!closePop()) return;
    mode = m; ss.set("mode", m);
    document.body.classList.toggle("ed-edit", m === "edit");
    document.body.classList.toggle("ed-flag", m === "flag");
    for (const k in modeBtn) modeBtn[k].classList.toggle("on", k === m);
    hint.textContent = HINT[m]; hl.hidden = true;
  }
  function toggleDrawer(on) {
    drawer.hidden = on === undefined ? !drawer.hidden : !on;
    ss.set("drawer", drawer.hidden ? "0" : "1");
    if (!drawer.hidden) renderDrawer(true);
  }

  /* ------------------------------------------------------------------------------------------ events, all taken first */
  const inUI = t => !!(t && t.closest && t.closest("#ed-ui, #ed-layer"));
  const elOf = t => (t && t.nodeType === 1 ? t : t && t.parentElement);
  for (const type of ["pointerdown", "mousedown", "pointerup", "mouseup", "touchstart", "touchend", "dblclick"]) {
    document.addEventListener(type, e => {
      const t = elOf(e.target);
      if (mode === "use" || inUI(t)) return;
      if (mode === "flag") { e.stopPropagation(); if (e.cancelable) e.preventDefault(); return; }
      if ((editing && editing.el.contains(t)) || t.closest(".info, [data-ed]:not(summary)")) e.stopPropagation();
    }, { capture: true, passive: false });
  }
  document.addEventListener("click", e => {
    const t = elOf(e.target);
    if (inUI(t)) return;
    if (pop) {
      if (pop.dirty()) { e.preventDefault(); e.stopPropagation(); nag(); return; }
      closePop(true);
    }
    if (mode === "use") return;
    if (mode === "flag") { e.preventDefault(); e.stopPropagation(); openFlagForm(e.shiftKey ? wide(t) : pick(t)); return; }
    if (editing && editing.el.contains(t)) { e.preventDefault(); e.stopPropagation(); return; }
    if (editing) commit();
    const info = t.closest(".info");
    if (info) { e.preventDefault(); e.stopPropagation(); openTipEditor(info); return; }
    if (t.closest("summary")) return;                    /* a closed box still opens; its title is in All text */
    const el = t.closest("[data-ed]");
    if (el) { e.preventDefault(); e.stopPropagation(); startEdit(el, e.clientX, e.clientY); return; }
    /* anything else (a slider, a menu, a plot) works as it does for a student */
    if ([...t.childNodes].some(n => n.nodeType === 3 && n.nodeValue.trim()))
      toast("The page's script writes these words, so they can't be rewritten here. Flag them instead (Alt+F).");
  }, true);
  document.addEventListener("mousemove", e => {
    if (mode !== "flag" || pop) return;
    const t = elOf(e.target);
    if (inUI(t)) { hl.hidden = true; return; }
    hlOn(e.shiftKey ? wide(t) : pick(t));
  }, { passive: true });
  window.addEventListener("keydown", e => {
    const t = elOf(e.target), typing = editing && editing.el.contains(t), mine = inUI(t);
    if (e.altKey && !e.metaKey && !e.ctrlKey && ["KeyE", "KeyF", "KeyU"].includes(e.code)) {
      e.preventDefault(); e.stopPropagation();
      setMode({ KeyE: "edit", KeyF: "flag", KeyU: "use" }[e.code]); return;
    }
    if (typing) {
      e.stopPropagation();
      if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); commit(); }
      else if (e.key === "Escape") { e.preventDefault(); cancel(); }
      return;
    }
    if (mine) {
      e.stopPropagation();
      if (!pop) return;
      if (e.key === "Escape") { e.preventDefault(); closePop(true); }
      else if (e.key === "Enter" && (e.metaKey || e.ctrlKey || (!e.shiftKey && t.classList.contains("ed-field")))) { e.preventDefault(); pop.save(); }
      return;
    }
    if (e.key === "Escape" && pop) { e.preventDefault(); closePop(true); }
    else if (e.key === "Escape" && mode !== "use") setMode("use");
  }, true);
  /* pasted words come in as plain words, so nothing of a Word or Google document's styling reaches the file */
  window.addEventListener("paste", e => {
    const t = elOf(e.target);
    if (!((editing && editing.el.contains(t)) || t.closest(".ed-field"))) return;
    e.preventDefault(); e.stopPropagation();
    document.execCommand("insertText", false, (e.clipboardData.getData("text/plain") || "").replace(/\s*\n\s*/g, " "));
  }, true);
  window.addEventListener("drop", e => {
    const t = elOf(e.target);
    if ((editing && editing.el.contains(t)) || t.closest(".ed-field")) { e.preventDefault(); e.stopPropagation(); }
  }, true);

  /* ----------------------------------------------------------------------------------------------- editing in place */
  const POP_TAGS = new Set(["BUTTON", "OPTION", "SUMMARY"]);
  function startEdit(el, x, y) {
    const u = UNITS.get(el.dataset.ed);
    if (!u) return;
    if (u.kind === "tip") { const info = infoOf(el); return info ? openTipEditor(info) : openPopEditor(u, el); }
    if (POP_TAGS.has(el.tagName) || el.closest("button, select") || !shown(el)) return openPopEditor(u, el);
    const live = el.innerHTML, liveText = squash(el.textContent);
    el.innerHTML = u.src;                                 /* the file's words, not what the script has made of them */
    const before = clean(el.innerHTML, u.src);
    if (el._edPending) el.innerHTML = el._edPending;
    else if (squash(el.textContent) !== liveText) toast("The page's script rewrites these words as it runs. This is the file's text.");
    el.classList.remove("ed-unsaved");
    el.contentEditable = "true"; el.spellcheck = true; el.classList.add("ed-editing");
    el.focus({ preventScroll: true });
    caretAt(el, x, y);
    editing = { el, u, live, before };
    showTools(el);
  }
  function caretAt(el, x, y) {
    let r = null;
    if (x != null) {
      if (document.caretRangeFromPoint) r = document.caretRangeFromPoint(x, y);
      else if (document.caretPositionFromPoint) {
        const p = document.caretPositionFromPoint(x, y);
        if (p) { r = document.createRange(); r.setStart(p.offsetNode, p.offset); }
      }
    }
    if (!r || !el.contains(r.startContainer)) { r = document.createRange(); r.selectNodeContents(el); r.collapse(false); }
    const s = getSelection(); s.removeAllRanges(); s.addRange(r);
  }
  function stopEditing() {
    if (!editing) return;
    const el = editing.el;
    el.removeAttribute("contenteditable"); el.classList.remove("ed-editing");
    tools.hidden = true; editing = null;
  }
  function cancel() {
    if (!editing) return;
    const { el, live } = editing;
    stopEditing(); el.innerHTML = live; el._edPending = null; el.classList.remove("ed-unsaved");
  }
  async function commit() {
    if (!editing) return;
    const ed = editing, html = clean(ed.el.innerHTML, ed.u.src);
    if (html === ed.before) { ed.el._edPending = null; return cancel(); }
    if (!squash(textOf(html))) { toast("Empty words are not saved. Flag them to have them cut.", "err"); return; }
    stopEditing();
    ed.el.classList.add("ed-saving");
    try {
      const r = await save(ed.u, html);
      ed.el.innerHTML = r.same ? ed.u.src : r.html; ed.el._edPending = null;
      flash(ed.el, "ed-ok");
    } catch (err) {
      ed.el._edPending = ed.el.innerHTML; ed.el.classList.add("ed-unsaved");
      toast("Not saved: " + err.message + " Your words are still in the box; click it to try again.", "err");
    } finally { ed.el.classList.remove("ed-saving"); }
  }
  /* one save at a time, so each one's shift of the places after it lands before the next is sent */
  function save(u, html) {
    const run = async () => {
      const oldE = u.e;
      const r = await api("edit", { file: FILE, hash: HASH, s: u.s, e: u.e, src: u.src, html, meta: { stage: u.stage, kind: u.kind, tag: u.tag } });
      if (r.same) return r;
      for (const v of UNITS.values()) if (v !== u && v.s >= oldE) { v.s += r.delta; v.e += r.delta; }
      u.s = r.s; u.e = r.e; u.src = r.src; HASH = r.hash;
      EDITS.unshift(r.edit);
      if (r.stale) toast("Saved. The file had changed on disk since this page loaded (another edit?): reload before much more.", "err");
      else toast("Saved to " + FILE.split("/").pop() + ", line " + r.edit.line + ".", "ok");
      renderDrawer();
      return r;
    };
    const p = queue.then(run); queue = p.catch(() => {});
    return p;
  }
  function fmtButtons() {
    const b = (label, cmd, title) => h("button", { title, onmousedown: e => e.preventDefault(), onclick: () => document.execCommand(cmd) }, label);
    return [b("B", "bold", "bold (⌘B)"), b("I", "italic", "italic (⌘I)"), b("x₂", "subscript", "subscript, as in F_ST"), b("x²", "superscript", "superscript")];
  }
  tools.append(...fmtButtons(),
    h("button", { class: "ed-t-save", onmousedown: e => e.preventDefault(), onclick: () => commit() }, "Save ⏎"),
    h("button", { onmousedown: e => e.preventDefault(), onclick: () => cancel() }, "Cancel"));
  function showTools(el) {
    tools.hidden = false;
    const r = el.getBoundingClientRect(), th = tools.offsetHeight, tw = tools.offsetWidth;
    tools.style.left = Math.max(8, Math.min(r.left, innerWidth - tw - 8)) + "px";
    tools.style.top = (r.top - th - 6 >= 4 ? r.top - th - 6 : r.bottom + 6) + "px";
  }
  window.addEventListener("scroll", () => { if (editing) showTools(editing.el); if (pop) place(pop); }, { passive: true });

  /* ------------------------------------------------------------------------------------------------- the popovers */
  function popBox(title, anchor) {
    const sub = h("span", { class: "ed-sub" }), body = h("div"), foot = h("div", { class: "ed-foot" });
    const root = h("div", { class: "ed-pop" }, h("div", { class: "ed-pop-h" }, h("span", {}, title), sub), body, foot);
    return { root, sub, body, foot, anchor, extra: [], rich: false, saveLabel: "Save", save: async () => closePop(true), dirty: () => false };
  }
  function field(html) { return h("div", { class: "ed-field", contenteditable: "true", spellcheck: "true", html }); }
  function showPop(box) {
    if (!closePop()) return false;
    hl.hidden = true;
    const tipPop = document.querySelector(".tip-pop"); if (tipPop) tipPop.hidden = true;   /* hover.js's own box */
    if (box.rich) box.foot.append(...fmtButtons());
    box.foot.append(h("span", { class: "ed-sp" }), ...box.extra,
      h("button", { onclick: () => closePop(true) }, "Cancel"),
      h("button", { class: "ed-primary", onclick: () => box.save() }, box.saveLabel));
    ui.append(box.root); pop = box; place(box);
    return true;
  }
  function place(box) {
    const a = box.anchor && shown(box.anchor) ? box.anchor.getBoundingClientRect() : null;
    const w = box.root.offsetWidth, ht = box.root.offsetHeight, W = innerWidth, H = innerHeight;
    let left, top;
    if (a && a.bottom > 0 && a.top < H) {
      left = Math.min(Math.max(8, a.left), W - w - 8);
      top = a.bottom + 8 + ht <= H - 8 ? a.bottom + 8 : a.top - 8 - ht >= 8 ? a.top - 8 - ht : Math.max(8, H - ht - 8);
    } else { left = W - w - (drawer.hidden ? 16 : 416); top = 60; }
    box.root.style.left = Math.max(8, left) + "px"; box.root.style.top = top + "px";
  }
  function closePop(force) {
    if (!pop) return true;
    if (!force && pop.dirty()) { nag(); return false; }
    pop.root.remove(); pop = null; hl.hidden = true;
    return true;
  }
  function nag() { toast("Save or cancel the open box first."); if (pop) flash(pop.root, "ed-shake"); }

  function openPopEditor(u, el) {
    const box = popBox({ BUTTON: "Button", OPTION: "Menu choice", SUMMARY: "Closed box's title" }[el && el.tagName] || "Words", el);
    box.sub.textContent = "line " + u.line;
    const f = field(u.src), before = clean(f.innerHTML, u.src);
    box.body.append(f); box.rich = true;
    box.dirty = () => clean(f.innerHTML, u.src) !== before;
    box.save = async () => {
      const html = clean(f.innerHTML, u.src);
      if (html === before) return closePop(true);
      if (!squash(textOf(html))) return toast("Empty words are not saved. Flag them to have them cut.", "err");
      try {
        const r = await save(u, html);
        for (const x of document.querySelectorAll(`[data-ed="${u.k}"]`)) x.innerHTML = r.html;
        closePop(true);
      } catch (err) { toast("Not saved: " + err.message, "err"); }
    };
    if (showPop(box)) { f.focus(); caretAt(f); }
  }

  function infoOf(tip) {
    return tip.closest(".info") || (tip.id && document.querySelector(`.info[data-tip="${CSS.escape(tip.id)}"]`)) || null;
  }
  /* A hover mark: the words on the page (if the HTML holds them) and its hover text, a box a line. The lines are the
     <span>s of its .tip; one added here is a new <span>. */
  function openTipEditor(info) {
    const tip = info.dataset.tip ? document.getElementById(info.dataset.tip) : info.querySelector(".tip");
    const tu = tip && tip.dataset.ed && UNITS.get(tip.dataset.ed);
    const marks = [...info.querySelectorAll("[data-ed]")].filter(x => !(tip && (x === tip || tip.contains(x))))
      .map(el => ({ el, u: UNITS.get(el.dataset.ed) })).filter(m => m.u);
    if (!tu && !marks.length) return toast("The page's script writes this hover text. Flag it instead (Alt+F).");
    const box = popBox("Hover text", info);
    box.rich = true;
    box.sub.textContent = "line " + (tu || marks[0].u).line + (info.dataset.tip ? " · shared with every mark that names it" : "");
    for (const m of marks) {
      m.f = field(m.u.src); m.before = clean(m.f.innerHTML, m.u.src);
      box.body.append(h("div", { class: "ed-label" }, "On the page"), m.f);
    }
    let list = null, build = () => "", tipBefore = "";
    if (tu) {
      const t = document.createElement("template"); t.innerHTML = tu.src;
      const nodes = [...t.content.childNodes], spans = nodes.filter(n => n.nodeType === 1);
      const plain = !(spans.length && nodes.every(n => (n.nodeType === 1 && n.tagName === "SPAN") || (n.nodeType === 3 && !n.nodeValue.trim())));
      const gap = nodes.find((n, i) => n.nodeType === 3 && i > 0 && i < nodes.length - 1), sep = gap ? gap.nodeValue : "";
      list = h("div", { class: "ed-lines" });
      const addLine = (html, shell, after) => {
        const f = field(html), row = h("div", { class: "ed-line" }, f);
        const mv = d => { const s = d < 0 ? row.previousElementSibling : row.nextElementSibling; if (s) d < 0 ? s.before(row) : s.after(row); };
        row.append(h("span", { class: "ed-line-b" },
          h("button", { title: "move up", onclick: () => mv(-1) }, "↑"), h("button", { title: "move down", onclick: () => mv(1) }, "↓"),
          h("button", { title: "cut this line", onclick: () => row.remove() }, "✕")));
        row._f = f; row._shell = shell;
        after ? after.after(row) : list.append(row);
        return row;
      };
      if (plain) addLine(tu.src, null); else spans.forEach(s => addLine(s.innerHTML, s.cloneNode(false)));
      build = () => {
        const rows = [...list.children].filter(r => squash(textOf(clean(r._f.innerHTML, tu.src))));
        if (plain && rows.length === 1 && !rows[0]._shell) return clean(rows[0]._f.innerHTML, tu.src);
        return rows.map(r => { const s = r._shell ? r._shell.cloneNode(false) : document.createElement("span"); s.innerHTML = clean(r._f.innerHTML, tu.src); return s.outerHTML; }).join(sep);
      };
      tipBefore = build();
      box.body.append(h("div", { class: "ed-label" }, "Hover text, a box a line"), list,
        h("button", { class: "ed-small", onclick: () => { const r = addLine("", null); r._f.focus(); } }, "+ line"));
    }
    box.dirty = () => marks.some(m => clean(m.f.innerHTML, m.u.src) !== m.before) || (!!tu && build() !== tipBefore);
    box.save = async () => {
      try {
        for (const m of marks) {
          const html = clean(m.f.innerHTML, m.u.src);
          if (html === m.before) continue;
          if (!squash(textOf(html))) throw new Error("the words on the page can't be empty.");
          const r = await save(m.u, html); m.el.innerHTML = r.html; m.before = html;
        }
        if (tu) {
          const html = build();
          if (html !== tipBefore) {
            if (!squash(textOf(html))) throw new Error("a hover text can't be empty. Flag the mark to have it cut.");
            const r = await save(tu, html); tip.innerHTML = r.html; tipBefore = html;
          }
        }
        closePop(true);
      } catch (err) { toast("Not saved: " + err.message, "err"); }
    };
    if (showPop(box)) { const f = box.body.querySelector(".ed-field"); if (f) { f.focus(); caretAt(f); } }
  }

  /* ------------------------------------------------------------------------------------------------------ flags */
  const PICK = "canvas, input, select, textarea, button, [data-ed], li, .verdict, .tbar, .toggles, .controls, .voice, .tcard, .panel, details, section";
  const WIDE = "canvas, svg, input, select, button, .info, .tbar, .toggles, [data-ed], li, ul, .verdict, .voice, .stage-intro, .controls, .tcard, .panel, details, .pathwrap, table, section, header, nav";
  function pick(t) {
    const svg = t.closest("svg");
    if (svg) { let top = svg; while (top.parentElement && top.parentElement.closest("svg")) top = top.parentElement.closest("svg"); return top.closest(".pathwrap") || top; }
    return t.closest(".info") || t.closest(PICK) || t;
  }
  function wide(t) { return t.closest(".tcard, .panel, details, .stage-intro, section") || pick(t); }
  function hlOn(el) {
    if (!el) { hl.hidden = true; return; }
    const r = el.getBoundingClientRect();
    Object.assign(hl.style, { left: r.left - 3 + "px", top: r.top - 3 + "px", width: r.width + 6 + "px", height: r.height + 6 + "px" });
    hl.firstChild.textContent = what(el);
    hl.firstChild.style.top = r.top < 26 ? "auto" : "-22px"; hl.firstChild.style.bottom = r.top < 26 ? "-22px" : "auto";
    hl.hidden = false;
  }
  function headingText(b) {
    const hh = b.querySelector(":scope > h3, :scope > h2, :scope > h4");
    if (!hh) return "";
    const c = hh.cloneNode(true); c.querySelectorAll(".tip, .pips").forEach(x => x.remove());
    return squash(c.textContent);
  }
  function boxName(b) {
    if (b.matches(".tcard")) return "Target card";
    if (b.matches(".stage-intro")) return "intro";
    if (b.matches("details")) { const s = b.querySelector("summary"); return `closed box "${cut(squash(s && s.textContent) || "?", 30)}"`; }
    const hd = headingText(b);
    return hd ? `"${cut(hd, 40)}" box` : "box";
  }
  function labelOf(c) {
    const l = c.closest("label") || (c.id && document.querySelector(`label[for="${CSS.escape(c.id)}"]`));
    if (!l) return c.id ? "#" + c.id : "";
    const k = l.cloneNode(true); k.querySelectorAll(".tip, select, input").forEach(x => x.remove());
    return `"${cut(squash(k.textContent), 40)}"`;
  }
  function what(el) {
    const id = el.id ? " #" + el.id : "";
    if (el.matches("section")) return "the whole stage";
    if (el.matches(".tcard, .panel, details, .stage-intro")) return boxName(el);
    if (el.matches(".voice")) return "intro words";
    if (el.tagName === "CANVAS") return "plot" + id;
    if (el.tagName.toLowerCase() === "svg" || el.matches(".pathwrap")) return "diagram" + id;
    if (el.matches("input[type=range]")) return "slider " + labelOf(el);
    if (el.matches("input[type=checkbox], input[type=radio]")) return "toggle " + labelOf(el);
    if (el.tagName === "SELECT") return "menu" + id;
    if (el.tagName === "BUTTON") return `button "${cut(squash(el.textContent), 30)}"`;
    if (el.matches(".info")) { const c = el.cloneNode(true); c.querySelectorAll(".tip").forEach(x => x.remove()); return `hover mark "${cut(squash(c.textContent), 40)}"`; }
    if (el.matches(".tbar")) { const i = el.querySelector("input"); return "slider row " + (i ? labelOf(i) : ""); }
    if (el.matches(".toggles")) return "toggles";
    if (el.matches(".controls")) return "controls";
    if (el.matches(".verdict")) return "verdict";
    if (el.tagName === "LI") return `task "${cut(squash(el.textContent), 40)}"`;
    if (el.matches("ul, ol")) return "list";
    if (el.matches("[data-ed]")) return `words "${cut(squash(el.textContent), 40)}"`;
    return el.tagName.toLowerCase() + (id || (el.classList.length ? "." + el.classList[0] : ""));
  }
  function describe(el) {
    const sec = el.closest("section");
    const stage = sec ? squash((sec.querySelector("h2") || {}).textContent) || sec.id : "";
    const box = el.closest(".tcard, .panel, details");
    const w = what(el), panel = box && box !== el ? boxName(box) : "";
    return { stage, stageId: (sec && sec.id) || "", panel, what: w,
             path: [stage && "Stage " + stage, panel, w].filter(Boolean).join(" › "),
             text: el.matches("canvas, svg, input, select") ? "" : cut(squash(el.textContent), 160) };
  }
  function selectorOf(el) {
    if (el.tagName === "ED-RUN") el = el.parentElement;
    if (el.id && document.querySelectorAll("#" + CSS.escape(el.id)).length === 1) return "#" + CSS.escape(el.id);
    const steps = [];
    for (let x = el; x && x.nodeType === 1; x = x.parentElement) {
      if (x === document.body) { steps.unshift("body"); break; }
      if (x !== el && x.id) { steps.unshift("#" + CSS.escape(x.id)); break; }
      let i = 1; for (let s = x.previousElementSibling; s; s = s.previousElementSibling) if (s.tagName === x.tagName) i++;
      steps.unshift(x.tagName.toLowerCase() + ":nth-of-type(" + i + ")");
    }
    return steps.join(" > ");
  }
  function settingsOf(el) {
    const scope = el.closest("section") || document.body, out = {};
    for (const c of scope.querySelectorAll("input[id], select[id]")) {
      if (inUI(c) || c.id === "score-name-input") continue;
      let v = c.type === "checkbox" || c.type === "radio" ? (c.checked ? "on" : "off") : c.value;
      const sh = document.getElementById(c.id + "V");
      if (sh && squash(sh.textContent)) v += " (" + squash(sh.textContent) + ")";
      out[c.id] = v;
    }
    return out;
  }
  function picturesOf(el) {
    const cs = el.tagName === "CANVAS" ? [el] : [...el.querySelectorAll("canvas")];
    return cs.filter(c => c.width && c.height && shown(c)).slice(0, 4);
  }
  function whereOf(el) {
    const d = describe(el), node = el.tagName === "ED-RUN" ? el.parentElement : el, ln = node.closest("[data-ln]");
    const u = el.dataset.ed && UNITS.get(el.dataset.ed);
    return Object.assign(d, { selector: selectorOf(el), tag: node.tagName.toLowerCase(),
      line: u ? u.line : ln ? +ln.dataset.ln : null, made_by_script: !u && !node.dataset.ln });
  }
  function openFlagForm(el) {
    const chain = [];
    for (let x = el; x && x !== document.body; x = x.parentElement) if (x === el || x.matches(WIDE)) chain.push(x);
    let target = el;
    const box = popBox("Flag", el);
    const chips = h("div", { class: "ed-chips" });
    const pic = h("input", { type: "checkbox" }); pic.checked = true;
    const picText = h("span"), picRow = h("label", { class: "ed-check" }, pic, picText);
    const note = h("textarea", { class: "ed-note", rows: "4", placeholder: "What needs doing? (⌘⏎ saves)" });
    const draw = () => {
      chips.replaceChildren(...chain.map(x => h("button", { class: "ed-chip" + (x === target ? " on" : ""),
        onclick: () => { target = x; draw(); } }, what(x))));
      const n = picturesOf(target).length;
      picRow.hidden = !n; picText.textContent = " keep a picture of " + (n > 1 ? "its " + n + " plots" : "the plot");
      box.sub.textContent = describe(target).path;
      hlOn(target);
    };
    box.body.append(h("div", { class: "ed-label" }, "Points at (click to widen)"), chips, note, picRow);
    box.saveLabel = "Save flag";
    box.dirty = () => !!note.value.trim();
    box.save = async () => {
      if (!note.value.trim()) return toast("Say what needs doing first.", "err");
      const flag = { note: note.value.trim(), where: whereOf(target), settings: settingsOf(target), pictures: [] };
      if (pic.checked) for (const c of picturesOf(target)) try { flag.pictures.push(c.toDataURL("image/png")); } catch (e) { /* a tainted canvas */ }
      try {
        const r = await api("flag", { file: FILE, flag });
        FLAGS.push(r.flag); closePop(true); renderDrawer(); placePins();
        toast(`Flag ${r.flag.n} saved.`, "ok");
      } catch (err) { toast("Not saved: " + err.message, "err"); }
    };
    if (showPop(box)) { draw(); place(box); note.focus(); }
  }
  function locate(f) {
    const w = f.where || {};
    let el = null;
    try { el = w.selector ? document.querySelector(w.selector) : null; } catch (e) { el = null; }
    if (el && w.tag && el.tagName.toLowerCase() !== w.tag) el = null;
    if (!el && w.line && w.tag) el = document.querySelector(`${w.tag}[data-ln="${w.line}"]`);
    return el;
  }
  function openFlagView(f) {
    const el = locate(f), box = popBox("Flag " + f.n, el);
    box.sub.textContent = (f.where && f.where.path) || "";
    const note = h("textarea", { class: "ed-note", rows: "4" }); note.value = f.note || "";
    box.body.append(note, h("div", { class: "ed-meta" },
      clock(f.time) + (f.where && f.where.line ? " · line " + f.where.line : "") + (el ? "" : " · not found on the page now") +
      ((f.pictures || []).length ? " · " + f.pictures.length + " picture" + (f.pictures.length > 1 ? "s" : "") : "")));
    let armed = false;
    const del = h("button", { class: "ed-danger", onclick: async () => {
      if (!armed) { armed = true; del.textContent = "Really delete?"; return; }
      try { await api("flag-delete", { file: FILE, id: f.id }); FLAGS = FLAGS.filter(x => x !== f); closePop(true); renderDrawer(); placePins(); toast("Flag " + f.n + " deleted."); }
      catch (err) { toast(err.message, "err"); }
    } }, "Delete");
    box.extra.push(del, h("button", { onclick: () => setStatus(f, f.status === "done" ? "open" : "done") }, f.status === "done" ? "Reopen" : "Done"));
    box.dirty = () => note.value.trim() !== (f.note || "");
    box.save = async () => {
      try { const r = await api("flag", { file: FILE, flag: { id: f.id, note: note.value.trim() } }); Object.assign(f, r.flag); closePop(true); renderDrawer(); }
      catch (err) { toast("Not saved: " + err.message, "err"); }
    };
    if (showPop(box)) { if (el) hlOn(el); note.focus(); }
  }
  async function setStatus(f, status) {
    try { const r = await api("flag", { file: FILE, flag: { id: f.id, status } }); Object.assign(f, r.flag); closePop(true); renderDrawer(); placePins(); }
    catch (err) { toast(err.message, "err"); }
  }
  function showEl(el) {
    if (!el) return toast("Not on the page now: its stage may be closed, or the page has changed since.", "err");
    el.scrollIntoView({ block: "center" });
    setTimeout(() => { hlOn(el); setTimeout(() => { if (mode !== "flag" || pop) hl.hidden = true; }, 1600); }, 60);
  }

  const pins = new Map();
  function placePins() {
    const want = new Set();
    if (pinBox.checked) for (const f of FLAGS) if (f.status !== "done") want.add(f.id);
    for (const [id, p] of pins) if (!want.has(id)) { p.remove(); pins.delete(id); }
    for (const f of FLAGS) {
      if (!want.has(f.id)) continue;
      let p = pins.get(f.id);
      if (!p) { p = h("div", { class: "ed-pin", title: f.note, onclick: () => openFlagView(f) }, String(f.n)); layer.append(p); pins.set(f.id, p); }
      p.title = f.note;
      const el = locate(f);
      if (!el || !shown(el)) { p.hidden = true; continue; }
      const r = el.getBoundingClientRect();
      p.hidden = false;
      p.style.left = Math.max(0, r.right + scrollX - 14) + "px"; p.style.top = Math.max(0, r.top + scrollY - 9) + "px";
    }
  }
  setInterval(placePins, 500);
  window.addEventListener("resize", placePins);

  /* ------------------------------------------------------------------------------------------------------ the drawer */
  function renderDrawer(asked) {
    const open = FLAGS.filter(f => f.status !== "done");
    drawerBtn.textContent = open.length ? `Flags ${open.length}` : "Flags";
    drawerBtn.classList.toggle("has", open.length > 0);
    if (drawer.hidden) return;
    for (const t in tabBtn) tabBtn[t].classList.toggle("on", t === tab);
    const keep = dbody.scrollTop;
    dbody.replaceChildren();
    if (tab === "flags") renderFlags(open); else if (tab === "edits") renderEdits(); else renderText(asked);
    if (!asked) dbody.scrollTop = keep;
  }
  function renderFlags(open) {
    dbody.append(h("div", { class: "ed-row" },
      h("button", { onclick: async () => {
        try { const r = await api("flags.md?file=" + encodeURIComponent(FILE)); await navigator.clipboard.writeText(r.text); toast(`Copied ${open.length} flag${open.length === 1 ? "" : "s"}: paste them to Claude.`, "ok"); }
        catch (err) { toast("Copy failed: " + err.message, "err"); }
      } }, "Copy open flags for Claude"),
      h("span", { class: "ed-meta" }, " or tell Claude: “work through my flags on " + FILE.split("/").pop().replace(/\.html$/, "") + "”")));
    if (!FLAGS.length) dbody.append(h("p", { class: "ed-meta" }, "No flags yet. Choose Flag (Alt+F) and click what needs doing."));
    const item = f => {
      const el = locate(f);
      return h("div", { class: "ed-item" + (f.status === "done" ? " done" : "") },
        h("div", { class: "ed-item-h" }, (f.status === "done" ? "✓ " : f.n + ". ") + ((f.where && f.where.path) || "")),
        h("div", { class: "ed-item-note" }, f.note),
        h("div", { class: "ed-meta" }, clock(f.time) + (f.where && f.where.line ? " · line " + f.where.line : "") + (el ? "" : " · not on the page now")),
        h("div", { class: "ed-item-b" },
          h("button", { onclick: () => showEl(locate(f)) }, "Show"),
          h("button", { onclick: () => { const x = locate(f); if (x) x.scrollIntoView({ block: "center" }); setTimeout(() => openFlagView(f), 80); } }, "Edit"),
          h("button", { onclick: () => setStatus(f, f.status === "done" ? "open" : "done") }, f.status === "done" ? "Reopen" : "Done")));
    };
    open.forEach(f => dbody.append(item(f)));
    const done = FLAGS.filter(f => f.status === "done");
    if (done.length) { dbody.append(h("div", { class: "ed-stage-h" }, "Done")); done.forEach(f => dbody.append(item(f))); }
  }
  function diffWords(a, b) {
    const A = a.split(/(\s+)/), B = b.split(/(\s+)/), n = A.length, m = B.length;
    if (n * m > 250000) return [["del", a], ["ins", b]];
    const L = Array.from({ length: n + 1 }, () => new Uint32Array(m + 1));
    for (let i = n - 1; i >= 0; i--) for (let j = m - 1; j >= 0; j--) L[i][j] = A[i] === B[j] ? L[i + 1][j + 1] + 1 : Math.max(L[i + 1][j], L[i][j + 1]);
    const out = [], push = (k, s) => { const l = out[out.length - 1]; if (l && l[0] === k) l[1] += s; else out.push([k, s]); };
    let i = 0, j = 0;
    while (i < n && j < m) { if (A[i] === B[j]) { push("eq", A[i]); i++; j++; } else if (L[i + 1][j] >= L[i][j + 1]) push("del", A[i++]); else push("ins", B[j++]); }
    while (i < n) push("del", A[i++]);
    while (j < m) push("ins", B[j++]);
    return out;
  }
  function renderEdits() {
    if (!EDITS.length) { dbody.append(h("p", { class: "ed-meta" }, "No edits to this page yet.")); return; }
    for (const ed of EDITS) {
      const diff = h("div", { class: "ed-diff" });
      for (const [k, s] of diffWords(wordsOf(ed.old, ed.kind), wordsOf(ed.new, ed.kind))) {
        if (k === "eq") diff.append(s.length > 110 ? s.slice(0, 45) + " … " + s.slice(-45) : s);
        else diff.append(h(k, {}, s));
      }
      dbody.append(h("div", { class: "ed-item" + (ed.undone ? " done" : "") },
        h("div", { class: "ed-meta" }, clock(ed.time) + " · line " + ed.line + (ed.stage ? " · " + ed.stage.replace(/^stage/, "stage ") : "") + (ed.undone ? " · undone" : "")),
        diff,
        ed.undone ? null : h("div", { class: "ed-item-b" }, h("button", { onclick: async () => {
          try { await api("undo", { file: FILE, id: ed.id }); ss.set("scroll", String(scrollY)); location.reload(); }
          catch (err) { toast(err.message, "err"); }
        } }, "Undo"))));
    }
  }
  function badge(u) {
    if (u.kind === "tip") return "ⓘ";
    if (/^h\d$/.test(u.tag)) return "H";
    return { p: "¶", li: "•", button: "▢", option: "▾", summary: "▸", label: "◦" }[u.tag] || "·";
  }
  let textQuery = "";
  function renderText(focus) {
    const q = h("input", { class: "ed-search", type: "search", placeholder: "find words on this page" });
    q.value = textQuery;
    const list = h("div");
    const draw = () => {
      const s = (textQuery = q.value).trim().toLowerCase();
      list.replaceChildren();
      let stage = null;
      for (const u of UNITS.values()) {
        const txt = wordsOf(u.src, u.kind);
        if (s && !txt.toLowerCase().includes(s)) continue;
        if (u.stage !== stage) { stage = u.stage; list.append(h("div", { class: "ed-stage-h" }, stage ? stage.replace(/^stage/, "Stage ") : "Top of the page")); }
        list.append(h("div", { class: "ed-trow", title: "line " + u.line, onclick: () => editUnit(u) },
          h("span", { class: "ed-badge" }, badge(u)), h("span", {}, cut(txt, 150)), h("span", { class: "ed-ln" }, String(u.line))));
      }
    };
    q.addEventListener("input", draw);
    dbody.append(q, list); draw();
    if (focus) q.focus();
  }
  function editUnit(u) {
    const el = document.querySelector(`[data-ed="${u.k}"]`);
    if (mode !== "edit") setMode("edit");
    if (!el) return openPopEditor(u, null);
    if (u.kind === "tip") {
      const info = infoOf(el);
      if (!info) return openPopEditor(u, el);
      if (shown(info)) info.scrollIntoView({ block: "center" });
      return setTimeout(() => openTipEditor(info), 60);
    }
    if (!shown(el) || POP_TAGS.has(el.tagName)) { if (shown(el)) el.scrollIntoView({ block: "center" }); return setTimeout(() => openPopEditor(u, el), 60); }
    el.scrollIntoView({ block: "center" });
    setTimeout(() => startEdit(el), 60);
  }

  /* ------------------------------------------------------------------------------------------------------- start */
  async function selfTest() {
    const out = { units: UNITS.size, mismatch: [], notOnce: [] };
    const doc = new DOMParser().parseFromString(await (await fetch(location.href)).text(), "text/html");
    for (const u of UNITS.values()) {
      const els = doc.querySelectorAll(`[data-ed="${u.k}"]`);
      if (els.length !== 1) { out.notOnce.push(u.k + "@" + u.line); continue; }
      if (squash(els[0].textContent) !== squash(textOf(u.src))) out.mismatch.push(u.k + "@" + u.line);
    }
    if (Q.get("edtest") === "2") {                     /* the real paths, against the copy the test serves */
      const el = document.querySelector(".voice p[data-ed]") || document.querySelector("p[data-ed]");
      setMode("edit"); startEdit(el); editing.el.append(" EDTEST"); await commit();
      out.edited = UNITS.get(el.dataset.ed).line;
      const c = document.querySelector("canvas");
      setMode("flag"); openFlagForm(c ? pick(c) : document.querySelector(".panel"));
      pop.root.querySelector("textarea").value = "EDTEST flag"; await pop.save();
      out.flags = FLAGS.map(f => ({ id: f.id, path: f.where.path, line: f.where.line, pictures: f.pictures.length }));
    }
    document.documentElement.setAttribute("data-edtest", JSON.stringify(out));
  }
  function ready() {
    const y = +ss.get("scroll", "0");
    if (y) { ss.set("scroll", "0"); window.scrollTo(0, y); }
    setMode(ss.get("mode", "use"));
    tab = ss.get("tab", "flags");
    if (ss.get("drawer", "0") === "1") toggleDrawer(true);
    if (Q.get("edtest")) selfTest().catch(err => document.documentElement.setAttribute("data-edtest", JSON.stringify({ error: String(err) })));
  }
  api("flags?file=" + encodeURIComponent(FILE)).then(r => { FLAGS = r.flags; EDITS = r.edits.slice().reverse(); renderDrawer(); placePins(); })
    .catch(err => toast("Flags not loaded: " + err.message, "err"));
  setMode("use");
  if (studyBox.checked && !Q.get("edtest")) {            /* every stage open, no code: Score's own study mode */
    let n = 0;
    const t = setInterval(() => {
      const inp = document.getElementById("score-name-input"), b = document.getElementById("score-name-confirm");
      if (inp && b && !inp.disabled) { inp.value = "Study Mode"; b.click(); clearInterval(t); setTimeout(ready, 300); }
      else if (++n > 30) { clearInterval(t); ready(); }
    }, 100);
  } else ready();
})();
