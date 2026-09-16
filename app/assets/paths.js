// BIO 202 path-diagram controls — the arrow IS the slider.
//
// A causal model drawn as boxes and arrows, where the arrows are the only
// controls on the panel. Click an arrow to select it, then drag up or down
// (or use the − and + that appear on it, or the arrow keys) to scale what
// that cause contributes. The stroke thickens as the contribution grows, so
// the picture and the number say the same thing.
//
// This is deliberately NOT dag.js. That one lets a student BUILD a graph —
// draw arrows between variables and watch a joint distribution fall out of
// whatever they built. This one takes a graph the lesson has already fixed
// and makes its edges adjustable. A toggler, not a builder.
//
// Every arrow is bound to an <input type="range"> that already exists on the
// page. The widget reads min/max/step/value off that input and writes back
// through it, dispatching an "input" event, so the page's existing wiring —
// listeners, gate checks, code highlighting, refresh functions — runs exactly
// as it did when the input was the visible control. Hide the input, mount a
// diagram, and nothing downstream needs to know.
//
// Usage:
//   <link rel="stylesheet" href="../assets/paths.css">
//   <script src="../assets/paths.js"></script>
//   <div id="mine"></div>
//   <script>
//     const p = Paths.init({
//       mount: "#mine", width: 420, height: 300,
//       boxes: [
//         { id:"par", label:"the two parents averaged", x:108, y:48,  w:200, h:52 },
//         { id:"els", label:"everything else",          x:322, y:48,  w:180, h:52 },
//         { id:"kid", label:"the grown child", x:215, y:190, w:220, h:52, kind:"outcome" }
//       ],
//       arrows: [
//         { id:"tilt", from:"par", to:"kid", input:"D_tilt_s",
//           label:"how much of a parent arrives in a child", fmt:f2 },
//         { id:"else", from:"els", to:"kid", readonly:true, dark:true,
//           label:"everything else", text:"locked" }
//       ]
//     });
//
// Controller:
//   p.sync()                       // re-read every bound input and redraw
//   p.setArrow(id, {...})          // label, from, to, dark, readonly, text, hidden
//   p.setBox(id, {...})            // label, sub, hidden
//   p.selected()                   // id of the selected arrow, or null

(function (global) {
  "use strict";

  const NS = "http://www.w3.org/2000/svg";
  const DRAG_SPAN = 170;   // px of vertical drag that covers the whole range
  const MIN_W = 2.0, MAX_W = 15.0;

  function svg(name, attrs) {
    const e = document.createElementNS(NS, name);
    if (attrs) for (const k in attrs) if (attrs[k] != null) e.setAttribute(k, attrs[k]);
    return e;
  }
  function clamp(v, lo, hi) { return v < lo ? lo : (v > hi ? hi : v); }

  // Where the segment from `c` to the centre of box `b` crosses b's edge.
  // Rectangles, so it is the nearer of the two axis crossings.
  function edgePoint(b, c) {
    const dx = c.x - b.x, dy = c.y - b.y;
    if (dx === 0 && dy === 0) return { x: b.x, y: b.y };
    const hw = b.w / 2 + 4, hh = b.h / 2 + 4;
    const tx = dx === 0 ? Infinity : hw / Math.abs(dx);
    const ty = dy === 0 ? Infinity : hh / Math.abs(dy);
    const t = Math.min(tx, ty);
    return { x: b.x + dx * t, y: b.y + dy * t };
  }

  // Pull the line end back off the box edge. The gap grows with the stroke,
  // because a head measured in stroke widths grows with it too.
  function backOff(p, from, gap) {
    const dx = p.x - from.x, dy = p.y - from.y;
    const d = Math.hypot(dx, dy) || 1;
    return { x: p.x - dx / d * gap, y: p.y - dy / d * gap };
  }

  function init(opts) {
    const mount = typeof opts.mount === "string" ? document.querySelector(opts.mount) : opts.mount;
    if (!mount) { console.warn("Paths: mount not found:", opts.mount); return null; }

    const W = opts.width || 420, H = opts.height || 300;
    const boxes = {}, order = [];
    (opts.boxes || []).forEach(b => {
      boxes[b.id] = { id: b.id, label: b.label || b.id, sub: b.sub || null,
                      x: b.x, y: b.y, w: b.w || 170, h: b.h || 48,
                      kind: b.kind || "cause", hidden: !!b.hidden };
      order.push(b.id);
    });
    const arrows = (opts.arrows || []).map(a => ({
      id: a.id, from: a.from, to: a.to, edges: a.edges || null, input: a.input || null,
      label: a.label || "", fmt: a.fmt || (v => String(v)),
      readonly: !!a.readonly, dark: !!a.dark, ghost: !!a.ghost,
      text: a.text || null, bend: a.bend || 0, hidden: !!a.hidden,
      hint: a.hint || null, labelDx: a.labelDx || 0, labelAt: a.labelAt || null,
      dragSpan: a.dragSpan || 0, signed: !!a.signed
    }));

    const state = { sel: null, drag: null, held: false, dirty: false };

    mount.classList.add("paths-root");
    mount.innerHTML = "";
    const root = svg("svg", { class: "paths-svg", viewBox: `0 0 ${W} ${H}`,
                              preserveAspectRatio: "xMidYMid meet" });
    mount.appendChild(root);
    const note = document.createElement("div");
    note.className = "paths-note";
    mount.appendChild(note);

    const defs = svg("defs");
    [["paths-head", "#2f6b8f"], ["paths-head-sel", "#b23a48"], ["paths-head-dark", "#c4c0b4"],
     ["paths-head-down", "#9a6b1f"]]
      .forEach(([id, fill]) => {
        // markerUnits is strokeWidth (the default), so the head grows with the
        // line. A fixed head is worse than a big one: past about 8px of stroke
        // the line simply swallows it and the arrow stops reading as an arrow.
        // 2.6 stroke-widths stays a head rather than a blot at full weight.
        const m = svg("marker", { id: id, viewBox: "0 0 10 10", refX: "7.6", refY: "5",
                                  markerWidth: "2.6", markerHeight: "2.6",
                                  orient: "auto-start-reverse" });
        m.appendChild(svg("path", { d: "M0,0 L10,5 L0,10 z", fill: fill }));
        defs.appendChild(m);
      });
    root.appendChild(defs);
    const gArrows = svg("g"), gBoxes = svg("g"), gTop = svg("g");
    root.appendChild(gArrows); root.appendChild(gBoxes); root.appendChild(gTop);

    // ---- the value behind an arrow, read straight off its bound input ----
    function inp(a) { return a.input ? document.getElementById(a.input) : null; }
    function spec(a) {
      const el = inp(a);
      if (!el) return null;
      const min = parseFloat(el.min), max = parseFloat(el.max);
      const step = parseFloat(el.step) || (max - min) / 100;
      return { el, min, max, step, v: parseFloat(el.value) };
    }
    /* A signed arrow runs through zero: it can push a thing up or pull it
       down, and BOTH ends are strong. So thickness comes off the magnitude and
       the sign is carried by colour instead -- otherwise the strongest negative
       setting draws as a hairline, which says the opposite of what it means. */
    function norm(a) {
      const s = spec(a);
      if (!s || a.dark) return 0;
      if (a.signed) {
        const lim = Math.max(Math.abs(s.min), Math.abs(s.max)) || 1;
        return clamp(Math.abs(s.v) / lim, 0, 1);
      }
      return clamp((s.v - s.min) / (s.max - s.min || 1), 0, 1);
    }
    function isNeg(a) { const s = spec(a); return !!(a.signed && s && s.v < 0); }
    function setValue(a, v) {
      const s = spec(a);
      if (!s || a.readonly) return;
      const snapped = Math.round((clamp(v, s.min, s.max) - s.min) / s.step) * s.step + s.min;
      const out = clamp(+snapped.toFixed(6), s.min, s.max);
      if (out === s.v) return;
      s.el.value = String(out);
      s.el.dispatchEvent(new Event("input", { bubbles: true }));
    }

    // ---- geometry ----
    // One control can drive several edges. Two shapes matter:
    //   a fork  -- one cause reaching two outcomes, `to` as a list; and
    //   a tier  -- the same relationship repeated in two places that share no
    //              endpoint at all, given as an explicit `edges` list.
    // The second is what a two-generation model needs: "an accident takes a
    // limb" is one fact about the world, and it holds in the parent's life and
    // in the child's, which are different arrows between different boxes.
    function edgesOf(a) {
      if (a.edges) return a.edges.map(e => Array.isArray(e) ? { from: e[0], to: e[1] } : e);
      if (Array.isArray(a.to)) return a.to.map(t => ({ from: a.from, to: t }));
      return [{ from: a.from, to: a.to }];
    }
    function isFork(eds) { return eds.length > 1 && eds.every(e => e.from === eds[0].from); }

    function geom(fromId, toId, bend, width) {
      width = width || 2;
      const b1 = boxes[fromId], b2 = boxes[toId];
      if (!b1 || !b2) return null;
      const straightMid = { x: (b1.x + b2.x) / 2, y: (b1.y + b2.y) / 2 };
      const dx = b2.x - b1.x, dy = b2.y - b1.y, len = Math.hypot(dx, dy) || 1;
      const nx = -dy / len, ny = dx / len;
      const ctrl = { x: straightMid.x + nx * bend, y: straightMid.y + ny * bend };
      const p1 = edgePoint(b1, ctrl);
      const p2 = backOff(edgePoint(b2, ctrl), ctrl, 2 + width * 1.9);
      // the point the label rides on: the curve at t = 0.5
      const mid = { x: 0.25 * p1.x + 0.5 * ctrl.x + 0.25 * p2.x,
                    y: 0.25 * p1.y + 0.5 * ctrl.y + 0.25 * p2.y };
      return { d: `M${p1.x.toFixed(1)},${p1.y.toFixed(1)} Q${ctrl.x.toFixed(1)},${ctrl.y.toFixed(1)} ${p2.x.toFixed(1)},${p2.y.toFixed(1)}`,
               mid, nx, ny };
    }

    // Two arrows between the same pair need opposite bends or they overlap.
    function autoBend(a, fromId, toId) {
      if (a.bend) return a.bend;
      const twins = arrows.filter(o => !o.hidden &&
        edgesOf(o).some(e => e.from === fromId && e.to === toId));
      if (twins.length < 2) return 0;
      return (twins.indexOf(a) === 0 ? -1 : 1) * 22;
    }

    function wrap(text, perLine) {
      const words = String(text).split(/\s+/), lines = [];
      let cur = "";
      words.forEach(w => {
        if (!cur) { cur = w; return; }
        if ((cur + " " + w).length <= perLine) cur += " " + w;
        else { lines.push(cur); cur = w; }
      });
      if (cur) lines.push(cur);
      return lines;
    }

    // ---- drawing ----
    // A refresh often patches several arrows and boxes at once. Batching them
    // keeps that to one rebuild per frame instead of one per patch, which
    // matters because the refresh runs on every pointermove of a drag.
    function render() {
      if (state.held) { state.dirty = true; return; }
      // Every value change rebuilds this SVG, which throws away whatever the
      // keyboard was on. Note it now and put focus back afterwards, or a
      // student adjusting an arrow with the arrow keys gets exactly one press.
      const ae = document.activeElement;
      const refocus = (ae && ae.classList && ae.classList.contains("paths-hit")
                       && gArrows.contains(ae)) ? ae.getAttribute("data-arrow") : null;
      gArrows.innerHTML = ""; gBoxes.innerHTML = ""; gTop.innerHTML = "";

      arrows.forEach(a => {
        if (a.hidden) return;
        const sel = state.sel === a.id;
        const n = norm(a);
        const width = a.ghost ? 1.6 : (a.dark ? 2.2 : MIN_W + (MAX_W - MIN_W) * n);
        const eds = edgesOf(a);
        const fork = isFork(eds);
        eds.forEach((ed, i) => {
          // A forked arrow -- one cause reaching two outcomes -- bows its two
          // halves in opposite directions, so the pair reads as a fork rather
          // than as two arrows that happen to share a tail. A tier has no
          // shared tail to fan out from, so its edges keep their own bend.
          const b = autoBend(a, ed.from, ed.to);
          const g = geom(ed.from, ed.to, fork && i > 0 ? -b : b, width);
          if (!g) return;
          const neg = isNeg(a);
          const cls = ["paths-arrow"];
          if (a.ghost) cls.push("ghost");
          else if (a.dark) cls.push("dark");
          else if (n <= 0.0001) cls.push("zero");
          else if (neg) cls.push("down");
          if (sel) cls.push("selected");
          const head = a.ghost ? null
                     : (sel ? "url(#paths-head-sel)"
                            : (a.dark || n <= 0.0001 ? "url(#paths-head-dark)"
                                                     : (neg ? "url(#paths-head-down)" : "url(#paths-head)")));
          const path = svg("path", { d: g.d, class: cls.join(" "),
                                     "stroke-width": width.toFixed(2),
                                     "marker-end": head });
          gArrows.appendChild(path);

          // The hit target is a fat invisible copy of the same curve, so a thin
          // arrow at strength zero is still as easy to grab as a fat one.
          if (!a.ghost && !a.readonly && a.input) {
            const hit = svg("path", { d: g.d, class: "paths-hit", tabindex: "0",
                                      role: "slider", "aria-label": a.label,
                                      "data-arrow": a.id });
            const s = spec(a);
            if (s) {
              hit.setAttribute("aria-valuemin", s.min);
              hit.setAttribute("aria-valuemax", s.max);
              hit.setAttribute("aria-valuenow", s.v);
              hit.setAttribute("aria-valuetext", a.fmt(s.v));
            }
            wireArrow(hit, a);
            gArrows.insertBefore(hit, path);
          }

          // Label and value ride on the first head only; the others are the
          // same control reaching somewhere else and saying so twice is noise.
          if (i === 0) {
            const lines = a.label ? wrap(a.label, 20) : [];
            const showVal = !a.ghost;
            const blockH = lines.length * 13 + (showVal ? 15 : 0);
            // These diagrams are hand-laid, so an arrow may name where its
            // label belongs. Falling back to the curve's own midpoint is fine
            // for a lone arrow and useless as soon as two of them converge.
            const anchor = a.labelAt || g.mid;
            let ty = anchor.y - blockH / 2 + 10;
            const tx = anchor.x + (a.labelDx || 0);
            // The label block gets an opaque backing plate, so the arrow runs
            // behind it rather than through the words. A text halo is enough
            // over a hairline and nowhere near enough over a stroke 15px wide,
            // which is exactly where the number matters most.
            const lg = svg("g");
            gTop.appendChild(lg);
            lines.forEach(ln => {
              const t = svg("text", { x: tx, y: ty, class: "paths-arrow-label" });
              t.textContent = ln;
              lg.appendChild(t);
              ty += 13;
            });
            if (showVal) {
              const vcls = ["paths-arrow-value"];
              if (sel) vcls.push("selected");
              else if (isNeg(a)) vcls.push("down");
              if (a.dark) vcls.push("dark");
              const t = svg("text", { x: tx, y: ty + 2, class: vcls.join(" ") });
              const sp2 = spec(a);
              t.textContent = a.text != null ? a.text : (sp2 ? a.fmt(sp2.v) : "—");
              lg.appendChild(t);
            }
            plate(lg);
            if (showVal && sel && !a.readonly && spec(a)) stepper(tx, ty + 2, a, spec(a));
          }
        });
      });

      order.forEach(id => {
        const b = boxes[id];
        if (b.hidden) return;
        const g = svg("g");
        g.appendChild(svg("rect", { x: b.x - b.w / 2, y: b.y - b.h / 2, width: b.w, height: b.h,
                                    rx: 7, class: "paths-box-bg" + (b.kind === "outcome" ? " outcome" : "") }));
        const lines = wrap(b.label, Math.max(12, Math.floor(b.w / 6.6)));
        const sub = b.sub ? 1 : 0;
        let ty = b.y - ((lines.length + sub) * 14) / 2 + 12;
        lines.forEach(ln => {
          const t = svg("text", { x: b.x, y: ty, class: "paths-box-label" });
          t.textContent = ln; g.appendChild(t); ty += 14;
        });
        if (b.sub) {
          const t = svg("text", { x: b.x, y: ty, class: "paths-box-sub" });
          t.textContent = b.sub; g.appendChild(t);
        }
        gBoxes.appendChild(g);
      });

      renderNote();

      if (refocus) {
        const back = gArrows.querySelector('.paths-hit[data-arrow="' + refocus + '"]');
        // safe against a loop: the focus handler only re-renders when the
        // selection actually changes, and by here it already has
        if (back) back.focus({ preventScroll: true });
      }
    }

    // Slip an opaque rounded plate behind a label group, sized to whatever the
    // text actually measured out to.
    function plate(group) {
      let bb;
      try { bb = group.getBBox(); } catch (e) { return; }
      if (!bb || !bb.width) return;
      const pad = 3.5;
      const r = svg("rect", { x: bb.x - pad, y: bb.y - pad,
                              width: bb.width + pad * 2, height: bb.height + pad * 2,
                              rx: 4, class: "paths-label-plate" });
      group.insertBefore(r, group.firstChild);
    }

    // The − and + that appear on a selected arrow, for anyone who would rather
    // click than drag.
    function stepper(x, y, a, s) {
      const nudge = Math.max(s.step, (s.max - s.min) / 40);
      [[-1, x - 46, "−"], [1, x + 46, "+"]].forEach(([dir, cx, glyph]) => {
        const g = svg("g", { class: "paths-step" });
        g.appendChild(svg("circle", { cx: cx, cy: y - 4, r: 10 }));
        const t = svg("text", { x: cx, y: y + 1 });
        t.textContent = glyph;
        g.appendChild(t);
        g.addEventListener("pointerdown", ev => {
          ev.stopPropagation(); ev.preventDefault();
          setValue(a, spec(a).v + dir * nudge);
        });
        gTop.appendChild(g);
      });
    }

    function renderNote() {
      const a = arrows.find(o => o.id === state.sel);
      if (!a) {
        note.innerHTML = opts.idleNote || "Click an arrow to pick it up, then drag it up or down to change how much that cause contributes.";
        return;
      }
      if (a.readonly) { note.innerHTML = a.hint || "<b>" + a.label + "</b> — this one is not yours to set."; return; }
      const s = spec(a);
      note.innerHTML = "<b>" + a.label + "</b> is now " + (s ? a.fmt(s.v) : "—")
        // comma, not an em-dash: a dash sitting two words from the &minus;
        // glyph reads as part of the control rather than as punctuation
        + ". Drag it up to make it bigger, down to make it smaller, or use the &minus; and + on it."
        + (a.hint ? " " + a.hint : "");
    }

    function wireArrow(hit, a) {
      // The drag lives on the window, not on the arrow. Selecting an arrow
      // redraws the diagram, which throws away the very element the pointer
      // came down on -- so pointer capture on that element would be released
      // out from under the drag on the first move. The window does not care
      // what the SVG does underneath it.
      hit.addEventListener("pointerdown", ev => {
        ev.preventDefault();
        const s = spec(a); if (!s) return;
        state.sel = a.id;
        // dragSpan buys precision: an arrow whose useful window is a sliver of
        // its range needs more pixels of travel to cover that range.
        state.drag = { id: a.id, y0: ev.clientY, v0: s.v, span: s.max - s.min,
                       px: a.dragSpan || DRAG_SPAN };
        const move = e => {
          if (!state.drag) return;
          e.preventDefault();
          setValue(a, state.drag.v0 + (state.drag.y0 - e.clientY) / state.drag.px * state.drag.span);
        };
        const up = () => {
          state.drag = null;
          window.removeEventListener("pointermove", move);
          window.removeEventListener("pointerup", up);
          window.removeEventListener("pointercancel", up);
        };
        window.addEventListener("pointermove", move);
        window.addEventListener("pointerup", up);
        window.addEventListener("pointercancel", up);
        render();
      });
      hit.addEventListener("focus", () => { if (state.sel !== a.id) { state.sel = a.id; render(); } });
      hit.addEventListener("keydown", ev => {
        const s = spec(a); if (!s) return;
        const nudge = Math.max(s.step, (s.max - s.min) / 40);
        let d = 0;
        if (ev.key === "ArrowUp" || ev.key === "ArrowRight") d = 1;
        else if (ev.key === "ArrowDown" || ev.key === "ArrowLeft") d = -1;
        else if (ev.key === "Home") { setValue(a, s.min); ev.preventDefault(); return; }
        else if (ev.key === "End") { setValue(a, s.max); ev.preventDefault(); return; }
        if (!d) return;
        ev.preventDefault();
        setValue(a, s.v + d * nudge * (ev.shiftKey ? 5 : 1));
      });
    }

    const ctrl = {
      sync: render,
      selected: () => state.sel,
      batch(fn) {
        state.held = true;
        try { fn(); } finally { state.held = false; }
        if (state.dirty) { state.dirty = false; render(); }
      },
      setArrow(id, patch) {
        const a = arrows.find(o => o.id === id);
        if (!a) return;
        Object.assign(a, patch);
        render();
      },
      setBox(id, patch) {
        const b = boxes[id];
        if (!b) return;
        Object.assign(b, patch);
        render();
      }
    };
    render();
    return ctrl;
  }

  global.Paths = { init: init };
})(window);
