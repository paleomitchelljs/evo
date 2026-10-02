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
//   p.sync()                       // re-read every bound input and redraw.
//                                  // Dragging an arrow writes its input and
//                                  // fires "input" but does not redraw: the
//                                  // page's input handler must call sync()
//                                  // (or setArrow/setBox), or the arrow keeps
//                                  // its old width and number (lesson 14 C,
//                                  // 2026-10-01).
//   p.setArrow(id, {...})          // label, from, to, dark, readonly, text, hidden
//   p.setBox(id, {...})            // label, sub, hidden
//   p.selected()                   // id of the selected arrow, or null
//
// Two options, both off unless a page asks (lesson 13 C/D, 2026-09-30; JM:
// "showing the numbers on the graph is not necessary except when that arrow
// is being adjusted" and "Pale red = locked & negative, Pale blue = locked &
// positive, Red = negative & adjustable, Blue = positive & adjustable, Gray
// = intrinsic and unadjustable"):
//   valuesOnSelect: true   an arrow's value shows only while it is
//                          selected, as the number between − and +, with no
//                          name, placed beside the arrow where it covers
//                          neither it nor, where it can help it, any other
//                          arrow, box or label (`labelAt` is not used for it).
//                          Only arrows the student can set can be selected
//                          (JM: no pop-ups on arrows that cannot be changed).
//                          An arrow with `always: true` keeps its `text` on
//                          show, at its `labelAt`.
//   lockColours: true      a readonly arrow that is not `dark` gets the class
//                          `locked` and pale heads, for the page's CSS to
//                          colour as held; a selected arrow keeps its sign's
//                          colour and head (red now means negative), and its
//                          value is coloured by sign as it is dragged. An
//                          arrow the student can set now gets `settable`.
// And per arrow, `width` fixes a `dark` arrow's stroke (default 2.2), and
// `onto: "<arrow id>"` in place of `to` lands it on the middle of that arrow
// rather than on a box: one cause changing what another does (lesson 14 A,
// 2026-10-01; JM: "the beak depth arrow should really point to the
// rainfall->food a bird gets arrow"). The arrow landed on must run between
// two boxes.

(function (global) {
  "use strict";

  const NS = "http://www.w3.org/2000/svg";
  const DRAG_SPAN = 170;   // px of vertical drag that covers the whole range
  const MIN_W = 2.0, MAX_W = 15.0;
  // Where along the head (0 = its base, 10 = its tip) the line ends, and how
  // far past that the tip reaches in stroke widths: 2.6 widths per 10 units.
  const HEAD_REF = 4.5, TIP_W = (10 - HEAD_REF) * 0.26;

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
      id: a.id, from: a.from, to: a.onto ? "@" + a.onto : a.to, onto: a.onto || null, edges: a.edges || null, input: a.input || null,
      label: a.label || "", fmt: a.fmt || (v => String(v)),
      readonly: !!a.readonly, dark: !!a.dark, ghost: !!a.ghost,
      text: a.text || null, bend: a.bend || 0, hidden: !!a.hidden,
      hint: a.hint || null, labelDx: a.labelDx || 0, labelAt: a.labelAt || null,
      dragSpan: a.dragSpan || 0, signed: !!a.signed, width: a.width || 0, always: !!a.always
    }));
    const valuesOnSelect = !!opts.valuesOnSelect, lockColours = !!opts.lockColours;

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
     ["paths-head-down", "#9a6b1f"]].concat(opts.lockColours ? [["paths-head-locked", "#a9c7da"], ["paths-head-locked-down", "#e8aab0"]] : [])
      .forEach(([id, fill]) => {
        // markerUnits is strokeWidth (the default), so the head grows with the
        // line. A fixed head is worse than a big one: past about 8px of stroke
        // the line simply swallows it and the arrow stops reading as an arrow.
        // 2.6 stroke-widths stays a head rather than a blot at full weight.
        // The line ends at HEAD_REF, where the head is 0.72 stroke-widths wide
        // either side -- wider than the line's round cap (0.5) -- so a thick
        // line cannot poke out past the head's flanks (JM, 2026-09-30).
        const m = svg("marker", { id: id, viewBox: "0 0 10 10", refX: String(HEAD_REF), refY: "5",
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

    // An arrow with `onto` lands on the middle of another arrow: that point is
    // kept as a box of no size, "@" + its id, refreshed before each drawing.
    function placeOnto() {
      arrows.forEach(a => {
        if (!a.onto) return;
        const o = arrows.find(x => x.id === a.onto), e = o ? edgesOf(o)[0] : null;
        const g = e && boxes[e.from] && boxes[e.to] ? geom(e.from, e.to, autoBend(o, e.from, e.to), 0) : null;
        if (g) boxes["@" + a.onto] = { id: "@" + a.onto, x: g.mid.x, y: g.mid.y, w: 0, h: 0, kind: "point", hidden: true };
      });
    }

    function geom(fromId, toId, bend, width) {
      width = width || 2;
      const b1 = boxes[fromId], b2 = boxes[toId];
      if (!b1 || !b2) return null;
      const straightMid = { x: (b1.x + b2.x) / 2, y: (b1.y + b2.y) / 2 };
      const dx = b2.x - b1.x, dy = b2.y - b1.y, len = Math.hypot(dx, dy) || 1;
      const nx = -dy / len, ny = dx / len;
      let ctrl = { x: straightMid.x + nx * bend, y: straightMid.y + ny * bend };
      const p1 = edgePoint(b1, ctrl), e2 = edgePoint(b2, ctrl);
      // the tip lands 2 + 1.28 widths off the box edge, as it did when the
      // line ran on to 7.6 units into the head
      let p2 = backOff(e2, ctrl, 2 + width * (1.28 + TIP_W)), fit = width;
      // Between close boxes that pull-back can carry the line's end past the
      // control point: the curve doubles back and the head turns round (JM,
      // 2026-09-30). Such an arrow is redrawn from its own two ends, its tip
      // nearer the box, and no thicker than a head can fit in the room.
      const dot = (u, v, w) => (u.x - w.x) * (v.x - w.x) + (u.y - w.y) * (v.y - w.y);
      if (dot(p2, e2, ctrl) <= 0 || dot(ctrl, e2, p1) <= 0 || dot(p2, e2, p1) <= 0) {
        const L = Math.hypot(e2.x - p1.x, e2.y - p1.y) || 1, ux = (e2.x - p1.x) / L, uy = (e2.y - p1.y) / L;
        fit = Math.max(1.6, Math.min(width, (L - 10) / (0.3 + TIP_W)));
        const gap = 2 + fit * (0.3 + TIP_W);
        p2 = { x: e2.x - ux * gap, y: e2.y - uy * gap };
        ctrl = { x: (p1.x + p2.x) / 2 + nx * bend * 0.5, y: (p1.y + p2.y) / 2 + ny * bend * 0.5 };
      }
      // the point the label rides on: the curve at t = 0.5
      const mid = { x: 0.25 * p1.x + 0.5 * ctrl.x + 0.25 * p2.x,
                    y: 0.25 * p1.y + 0.5 * ctrl.y + 0.25 * p2.y };
      return { d: `M${p1.x.toFixed(1)},${p1.y.toFixed(1)} Q${ctrl.x.toFixed(1)},${ctrl.y.toFixed(1)} ${p2.x.toFixed(1)},${p2.y.toFixed(1)}`,
               mid, nx, ny, p1, ctrl, p2, fit };
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
      placeOnto();
      // under valuesOnSelect the selected arrow's readout is placed after every
      // arrow is drawn, so it can be put where it hides none of them
      const drawn = [], labelRects = [], ownGeo = [];
      let pending = null;

      arrows.forEach(a => {
        if (a.hidden) return;
        const sel = state.sel === a.id;
        const n = norm(a);
        const width = a.ghost ? 1.6 : (a.dark ? (a.width || 2.2) : MIN_W + (MAX_W - MIN_W) * n);
        const locked = lockColours && a.readonly && !a.dark && !a.ghost;
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
          if (valuesOnSelect) {
            // what covering it costs: an arrow the student could click next
            // most, a held one less, a fixed grey one least
            const k = a.dark || a.ghost ? 0.4 : (!a.readonly && inp(a) && !inp(a).disabled ? 2.5 : 1);
            drawn.push({ id: a.id, g, w: g.fit < width ? g.fit : width, k });
            if (sel) ownGeo.push(geom(ed.from, ed.to, fork && i > 0 ? -b : b, 0));
          }
          const neg = isNeg(a);
          const cls = ["paths-arrow"];
          if (a.ghost) cls.push("ghost");
          else if (a.dark) cls.push("dark");
          else if (n <= 0.0001) cls.push("zero");
          else if (neg) cls.push("down");
          if (locked) cls.push("locked");
          if (sel) cls.push("selected");
          const head = a.ghost ? null
                     : (sel && !lockColours ? "url(#paths-head-sel)"
                            : (a.dark || n <= 0.0001 ? "url(#paths-head-dark)"
                                                     : (neg ? (locked ? "url(#paths-head-locked-down)" : "url(#paths-head-down)")
                                                            : (locked ? "url(#paths-head-locked)" : "url(#paths-head)"))));
          // Under lockColours an arrow the student can set right now (not held,
          // not mid-run) is marked, for the page to make it stand out (JM:
          // "maybe any selectable arrow has a 'glow' effect?").
          if (lockColours && !a.readonly && !a.dark && !a.ghost && inp(a) && !inp(a).disabled) cls.push("settable");
          const path = svg("path", { d: g.d, class: cls.join(" "),
                                     "stroke-width": (g.fit < width ? g.fit : width).toFixed(2),
                                     "marker-end": head });
          // Under lockColours a held arrow has no hit target, so the drawn
          // curve carries its id for a page (or a check) to read its state.
          if (lockColours) path.setAttribute("data-of", a.id);
          gArrows.appendChild(path);

          // The hit target is a fat invisible copy of the same curve, so a thin
          // arrow at strength zero is still as easy to grab as a fat one.
          const clickable = !a.readonly && !!a.input;
          if (!a.ghost && clickable) {
            const hit = svg("path", { d: g.d, class: "paths-hit" + (a.readonly ? " ro" : ""), tabindex: "0",
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
          const showBlock = !valuesOnSelect || sel || (a.always && a.text != null);
          if (i === 0 && showBlock && valuesOnSelect && sel) pending = { a, g };
          else if (i === 0 && showBlock) {
            // JM, 2026-09-30: under valuesOnSelect no name over the number
            const lines = a.label && !valuesOnSelect ? wrap(a.label, 20) : [];
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
              if (sel && !lockColours) vcls.push("selected");
              else if (isNeg(a)) vcls.push("down");
              if (a.dark) vcls.push("dark");
              const t = svg("text", { x: tx, y: ty + 2, class: vcls.join(" ") });
              const sp2 = spec(a);
              t.textContent = a.text != null ? a.text : (sp2 ? a.fmt(sp2.v) : "—");
              lg.appendChild(t);
            }
            plate(lg);
            if (valuesOnSelect) { try { labelRects.push(lg.getBBox()); } catch (e) {} }
            if (showVal && sel && !a.readonly && spec(a)) stepper(tx, ty + 2, a, spec(a));
          }
        });
      });
      if (pending) readout(pending.a, placeReadout(pending.a, pending.g, ownGeo, drawn, labelRects));

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

    // The selected arrow's readout under valuesOnSelect: its number between
    // the − and +, centred on `c`.
    function readout(a, c) {
      // pushed away from its arrow for want of room, it gets a faint leader
      // back to it, so the number is not read as another arrow's
      const HW = c.hw || 48, HH = c.hh || 12;
      if (c.near && Math.hypot(c.near.x - clamp(c.near.x, c.x - HW, c.x + HW), c.near.y - clamp(c.near.y, c.y - HH, c.y + HH)) > MAX_W / 2 + 14) {
        const rx = clamp(c.near.x, c.x - HW + 8, c.x + HW - 8), ry = clamp(c.near.y, c.y - HH, c.y + HH);
        const dx = c.near.x - rx, dy = c.near.y - ry, d = Math.hypot(dx, dy) || 1, stop = (c.w || 2) / 2 + 3;
        gTop.appendChild(svg("line", { x1: rx, y1: ry, x2: (c.near.x - dx / d * stop).toFixed(1), y2: (c.near.y - dy / d * stop).toFixed(1), class: "paths-leader" }));
      }
      const lg = svg("g");
      gTop.appendChild(lg);
      const vcls = ["paths-arrow-value"];
      if (isNeg(a)) vcls.push("down");
      const t = svg("text", { x: c.x, y: c.y + 4.5, class: vcls.join(" ") });
      const s = spec(a);
      t.textContent = a.text != null ? a.text : (s ? a.fmt(s.v) : "—");
      lg.appendChild(t);
      plate(lg);
      if (!a.readonly && s) stepper(c.x, c.y + 4.5, a, s, RO_STEP, c.upright);
    }
    // Where that readout goes (JM, 2026-09-30: "the popup boxes can obscure
    // what arrow you" are setting). Candidates sit beside the arrow, stepped
    // out from points along it; one that comes within a full-weight stroke of
    // its own arrow is out, and the rest are scored by the other arrows,
    // boxes and labels they cover, then by distance. The arrow's own curve is
    // taken at no width, so the readout does not move while it is dragged.
    // two shapes: − number + side by side, or + over the number over −
    // (dragging up makes an arrow bigger); the tighter spot picks
    const RO_STEP = 36, RO_SHAPES = [{ hw: RO_STEP + 12, hh: 12, upright: false }, { hw: 20, hh: 36, upright: true }];
    function placeReadout(a, g, own, drawn, labelRects) {
      const quad = (q, t) => ({ x: (1 - t) * (1 - t) * q.p1.x + 2 * (1 - t) * t * q.ctrl.x + t * t * q.p2.x,
                                y: (1 - t) * (1 - t) * q.p1.y + 2 * (1 - t) * t * q.ctrl.y + t * t * q.p2.y });
      // a curve as points, each standing for its share of the curve's length;
      // with a width, the head too, as its base and tip at a heavier price,
      // since a covered head hides which way the arrow runs
      const pts = (q, w) => {
        const out = [];
        let len = 0; for (let k = 1; k <= 24; k++) { const u = quad(q, (k - 1) / 24), v = quad(q, k / 24); len += Math.hypot(v.x - u.x, v.y - u.y); }
        for (let k = 0; k <= 24; k++) out.push(Object.assign(quad(q, k / 24), { cost: len / 25 * 0.6 }));
        if (w) { const dx = q.p2.x - q.ctrl.x, dy = q.p2.y - q.ctrl.y, d = Math.hypot(dx, dy) || 1;
                 for (const f of [0.5, 1]) out.push({ x: q.p2.x + dx / d * TIP_W * w * f, y: q.p2.y + dy / d * TIP_W * w * f, cost: 20 }); }
        return out;
      };
      const mine = [].concat(...own.map(q => pts(q, 0)));
      const others = drawn.filter(o => o.id !== a.id).map(o => ({ p: pts(o.g, o.w), r: o.w / 2 + 2, k: o.k }));
      const rects = order.map(id => boxes[id]).filter(b => !b.hidden).map(b => ({ x: b.x - b.w / 2, y: b.y - b.h / 2, w: b.w, h: b.h, cost: 100 }))
        .concat(labelRects.map(r => ({ x: r.x, y: r.y, w: r.width, h: r.height, cost: 30 })));
      const clear = MAX_W / 2 + 5, q0 = own[0] || g, mid = quad(q0, 0.5);
      let best = null, bestS = Infinity, dist;
      for (const shape of RO_SHAPES) {
      const RO_HW = shape.hw, RO_HH = shape.hh;
      dist = (p, c) => Math.hypot(Math.max(Math.abs(p.x - c.x) - RO_HW, 0), Math.max(Math.abs(p.y - c.y) - RO_HH, 0));
      for (const t of [0.5, 0.42, 0.58, 0.34, 0.66, 0.26, 0.74]) {
        const P = quad(q0, t);
        const tx = 2 * (1 - t) * (q0.ctrl.x - q0.p1.x) + 2 * t * (q0.p2.x - q0.ctrl.x);
        const ty = 2 * (1 - t) * (q0.ctrl.y - q0.p1.y) + 2 * t * (q0.p2.y - q0.ctrl.y), tl = Math.hypot(tx, ty) || 1;
        const nx = -ty / tl, ny = tx / tl;
        for (const [ux, uy] of [[nx, ny], [-nx, -ny], [0, -1], [0, 1], [-1, 0], [1, 0]]) {
          const reach = clear + RO_HW * Math.abs(ux) + RO_HH * Math.abs(uy);
          for (const extra of [0, 10, 22, 36, 52, 72]) {
            const c = { x: P.x + ux * (reach + extra), y: P.y + uy * (reach + extra) };
            if (c.x - RO_HW < 2 || c.x + RO_HW > W - 2 || c.y - RO_HH < 2 || c.y + RO_HH > H - 2) continue;
            if (mine.some(p => dist(p, c) < clear)) continue;
            let sc = Math.hypot(c.x - mid.x, c.y - mid.y) / 8;
            for (const o of others) for (const p of o.p) if (dist(p, c) < o.r) sc += p.cost * o.k;
            for (const r of rects) if (r.x < c.x + RO_HW + 2 && r.x + r.w > c.x - RO_HW - 2 && r.y < c.y + RO_HH + 2 && r.y + r.h > c.y - RO_HH - 2) sc += r.cost;
            // set away from its arrow, it will need a leader: one through a
            // box or over another arrow's head is worse than none
            let near = mine[0], nd = Infinity;
            for (const p of mine) { const d = dist(p, c); if (d < nd) { nd = d; near = p; } }
            if (nd > MAX_W / 2 + 14) {
              const rx = clamp(near.x, c.x - RO_HW, c.x + RO_HW), ry = clamp(near.y, c.y - RO_HH, c.y + RO_HH);
              for (let k = 1; k < 12; k++) {
                const p = { x: rx + (near.x - rx) * k / 12, y: ry + (near.y - ry) * k / 12 };
                if (rects.some(r => r.cost >= 100 && p.x > r.x + 3 && p.x < r.x + r.w - 3 && p.y > r.y + 3 && p.y < r.y + r.h - 3)) { sc += 60; break; }
              }
              sc += nd / 6;
            }
            if (sc < bestS) { bestS = sc; best = Object.assign(c, shape); }
          }
        }
      }
      }
      if (!best) return a.labelAt || g.mid;
      let near = mine[0], nd = Infinity;
      dist = (p, c) => Math.hypot(Math.max(Math.abs(p.x - c.x) - c.hw, 0), Math.max(Math.abs(p.y - c.y) - c.hh, 0));
      for (const p of mine) { const d = dist(p, best); if (d < nd) { nd = d; near = p; } }
      const self = drawn.find(o => o.id === a.id);
      return { x: best.x, y: best.y, hw: best.hw, hh: best.hh, upright: best.upright, near, w: self ? self.w : 2 };
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
    function stepper(x, y, a, s, off, upright) {
      const nudge = Math.max(s.step, (s.max - s.min) / 40);
      off = off || 46;
      (upright ? [[-1, x, "−", y + 22], [1, x, "+", y - 26]] : [[-1, x - off, "−", y], [1, x + off, "+", y]]).forEach(([dir, cx, glyph, cy]) => {
        const g = svg("g", { class: "paths-step" });
        g.appendChild(svg("circle", { cx: cx, cy: cy - 4, r: 10 }));
        const t = svg("text", { x: cx, y: cy + 1 });
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
