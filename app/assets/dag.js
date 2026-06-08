// BIO 202 DAG primitive — visual causal-model builder.
//
// Mounts a clickable node/arrow editor (SVG) paired with a scatter plot
// (Canvas) of synthetic data generated under the student's current DAG.
// Students don't see equations. They draw arrows, set their strength on a
// slider, and watch the joint distribution of any two variables change.
// A "condition on" toggle slices the data; a "color by" toggle stratifies it.
// Confounding, mediation, colliders, and Simpson's paradox all fall out of
// the same primitive — they differ only in what the student chooses to
// build and observe.
//
// Usage:
//   <link rel="stylesheet" href="../assets/dag.css">
//   <script src="../assets/dag.js"></script>
//   <div id="my-dag"></div>
//   <script>
//     const dag = DAG.init({
//       mount: "#my-dag",
//       nodes: [
//         { id: "drought",  label: "Drought",    x: 100, y: 80 },
//         { id: "seedSize", label: "Seed size",  x: 280, y: 80 },
//         { id: "beak",     label: "Beak depth", x: 460, y: 80 },
//         { id: "species",  label: "Species",    x: 280, y: 200,
//           type: "categorical", levels: 2 }
//       ],
//       arrows: [
//         { from: "drought", to: "seedSize", strength: 0.7 },
//         { from: "seedSize", to: "beak", strength: 0.6 }
//       ],
//       initialAxes: { x: "drought", y: "beak" },
//       n: 300,
//       onChange: (state) => { /* read state.corr, state.arrows, etc. */ }
//     });
//
// Controller API (returned from init):
//   dag.setArrow(from, to, strength)   // create or update; strength=0 removes
//   dag.removeArrow(from, to)
//   dag.setConditioned(id, on)         // toggle conditioning on node id
//   dag.setColorBy(id|null)            // categorical node id, or null
//   dag.setAxes(xId, yId)
//   dag.regenerate(seed?)              // re-roll samples (optional new seed)
//   dag.getCorrelation(a, b)           // Pearson r over current samples
//   dag.getState()                     // { nodes, arrows, samples, corr, axes }
//   dag.on(event, cb)                  // events: "change", "arrow", "axes"

(function (global) {
  "use strict";

  // ------ deterministic PRNG ------
  function mulberry32(seed) {
    let s = seed >>> 0;
    return function () {
      s = (s + 0x6D2B79F5) >>> 0;
      let t = s;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  function gaussian(rand) {
    // Box-Muller; rand() returns uniform [0,1).
    let u = 0, v = 0;
    while (u === 0) u = rand();
    while (v === 0) v = rand();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  }

  // ------ topological sort over arrows ------
  function topoSort(nodes, arrows) {
    const ids = Object.keys(nodes);
    const inDeg = {}; ids.forEach(id => inDeg[id] = 0);
    const adj = {}; ids.forEach(id => adj[id] = []);
    arrows.forEach(a => {
      if (a.from !== a.to && nodes[a.from] && nodes[a.to]) {
        inDeg[a.to] = (inDeg[a.to] || 0) + 1;
        adj[a.from].push(a.to);
      }
    });
    const queue = ids.filter(id => inDeg[id] === 0);
    const out = [];
    while (queue.length) {
      const x = queue.shift();
      out.push(x);
      adj[x].forEach(y => {
        inDeg[y]--;
        if (inDeg[y] === 0) queue.push(y);
      });
    }
    if (out.length !== ids.length) return null;  // cycle
    return out;
  }

  // ------ generate samples under the linear SCM ------
  function generateSamples(state) {
    const order = topoSort(state.nodes, state.arrows);
    const samples = {};
    if (!order) return { samples: null, cycle: true };
    const rand = mulberry32(state.seed);
    const n = state.n;
    for (const id of order) {
      const node = state.nodes[id];
      const col = new Array(n);
      const incoming = state.arrows.filter(a => a.to === id);
      if (node.type === "categorical") {
        const k = node.levels || 2;
        for (let i = 0; i < n; i++) col[i] = Math.floor(rand() * k);
      } else {
        for (let i = 0; i < n; i++) {
          let v = gaussian(rand);  // residual N(0,1)
          for (const a of incoming) {
            const parent = state.nodes[a.from];
            const px = samples[a.from][i];
            if (parent.type === "categorical") {
              const center = ((parent.levels || 2) - 1) / 2;
              v += a.strength * (px - center) * 2;  // ×2 so binary levels span ~±strength
            } else {
              v += a.strength * px;
            }
          }
          col[i] = v;
        }
      }
      samples[id] = col;
    }
    return { samples, cycle: false };
  }

  // ------ stats ------
  function mean(arr) { let s = 0; for (let i=0;i<arr.length;i++) s += arr[i]; return s/arr.length; }
  function pearson(xs, ys) {
    if (!xs || !ys || xs.length !== ys.length || xs.length === 0) return NaN;
    const mx = mean(xs), my = mean(ys);
    let sxx = 0, syy = 0, sxy = 0;
    for (let i = 0; i < xs.length; i++) {
      const dx = xs[i] - mx, dy = ys[i] - my;
      sxx += dx*dx; syy += dy*dy; sxy += dx*dy;
    }
    if (sxx === 0 || syy === 0) return NaN;
    return sxy / Math.sqrt(sxx * syy);
  }
  // OLS slope of y on x.
  function olsSlope(xs, ys) {
    const mx = mean(xs), my = mean(ys);
    let sxx = 0, sxy = 0;
    for (let i = 0; i < xs.length; i++) {
      const dx = xs[i] - mx, dy = ys[i] - my;
      sxx += dx*dx; sxy += dx*dy;
    }
    if (sxx === 0) return NaN;
    return { slope: sxy/sxx, intercept: my - (sxy/sxx)*mx };
  }

  // ------ conditioning mask: keep middle half of conditioned-on nodes ------
  function buildMask(state) {
    const n = state.n;
    const mask = new Array(n).fill(true);
    for (const id in state.nodes) {
      const node = state.nodes[id];
      if (!node.conditioned) continue;
      const col = state._samples[id];
      if (!col) continue;
      if (node.type === "categorical") {
        // For categorical conditioning, default to filtering to level 0
        // (caller can set node.conditionLevel for finer control).
        const lvl = (typeof node.conditionLevel === "number") ? node.conditionLevel : 0;
        for (let i = 0; i < n; i++) if (col[i] !== lvl) mask[i] = false;
      } else {
        // Continuous: keep middle 50%.
        const sorted = col.slice().sort((a,b)=>a-b);
        const lo = sorted[Math.floor(n*0.25)], hi = sorted[Math.floor(n*0.75)];
        for (let i = 0; i < n; i++) if (col[i] < lo || col[i] > hi) mask[i] = false;
      }
    }
    return mask;
  }

  // =====================================================================
  // SVG / Canvas / DOM rendering
  // =====================================================================

  const NS = "http://www.w3.org/2000/svg";
  function svg(name, attrs) {
    const e = document.createElementNS(NS, name);
    if (attrs) for (const k in attrs) e.setAttribute(k, attrs[k]);
    return e;
  }
  function el(tag, attrs, kids) {
    const e = document.createElement(tag);
    if (attrs) for (const k in attrs) {
      if (k === "class") e.className = attrs[k];
      else if (k === "html") e.innerHTML = attrs[k];
      else e.setAttribute(k, attrs[k]);
    }
    (kids || []).forEach(k => {
      if (k == null) return;
      e.appendChild(typeof k === "string" ? document.createTextNode(k) : k);
    });
    return e;
  }

  // Curved cubic Bezier from p1 to p2, offset so two arrows in opposite
  // directions don't overlap.
  function arrowPath(p1, p2, bend) {
    const dx = p2.x - p1.x, dy = p2.y - p1.y;
    const len = Math.sqrt(dx*dx + dy*dy);
    if (len === 0) return `M${p1.x},${p1.y} L${p2.x},${p2.y}`;
    const nx = -dy / len, ny = dx / len;
    const mx = (p1.x + p2.x) / 2 + nx * bend;
    const my = (p1.y + p2.y) / 2 + ny * bend;
    return `M${p1.x},${p1.y} Q${mx},${my} ${p2.x},${p2.y}`;
  }

  // Trim a line endpoint by `r` along the direction toward the other point.
  function trimToward(from, to, r) {
    const dx = to.x - from.x, dy = to.y - from.y;
    const d = Math.sqrt(dx*dx + dy*dy);
    if (d === 0) return { x: to.x, y: to.y };
    return { x: to.x - (dx/d) * r, y: to.y - (dy/d) * r };
  }

  // ---- main controller ----
  function init(opts) {
    const mount = typeof opts.mount === "string"
      ? document.querySelector(opts.mount) : opts.mount;
    if (!mount) { console.warn("DAG: mount not found:", opts.mount); return null; }

    const state = {
      nodes: {},
      arrows: [],
      n: opts.n || 300,
      seed: (opts.seed | 0) || 12345,
      axes: opts.initialAxes || null,
      colorBy: opts.initialColor || null,
      locked: !!opts.locked,
      _samples: null,
      _selectedNode: null,   // for arrow drawing: clicked node
      _selectedArrow: null,  // {from, to} for properties panel
    };
    (opts.nodes || []).forEach(n => {
      state.nodes[n.id] = {
        id: n.id,
        label: n.label || n.id,
        x: n.x | 0,
        y: n.y | 0,
        type: n.type || "continuous",
        levels: n.levels || (n.type === "categorical" ? 2 : null),
        conditioned: false,
        conditionLevel: 0,
        radius: n.radius || 36
      };
    });
    (opts.arrows || []).forEach(a => {
      if (state.nodes[a.from] && state.nodes[a.to]) {
        state.arrows.push({ from: a.from, to: a.to, strength: +a.strength });
      }
    });
    if (!state.axes) {
      const ids = Object.keys(state.nodes);
      if (ids.length >= 2) state.axes = { x: ids[0], y: ids[ids.length - 1] };
    }

    const listeners = { change: [], arrow: [], axes: [] };
    function emit(ev, payload) { (listeners[ev] || []).forEach(cb => cb(payload, ctrl)); }
    function on(ev, cb) { (listeners[ev] = listeners[ev] || []).push(cb); }

    // ---- DOM scaffold ----
    mount.classList.add("dag-root");
    mount.innerHTML = "";
    const row = el("div", { class: "dag-row" });
    mount.appendChild(row);

    // Left column: DAG editor.
    const leftCol = el("div", { class: "dag-col" });
    row.appendChild(leftCol);

    const toolbar = el("div", { class: "dag-toolbar" });
    leftCol.appendChild(toolbar);
    const statusSpan = el("span", { class: "status" }, ["Click a variable to draw an arrow from it."]);
    const btnClear = el("button", { type: "button" }, ["Clear arrows"]);
    const btnReroll = el("button", { type: "button" }, ["Re-roll data"]);
    toolbar.appendChild(statusSpan);
    toolbar.appendChild(el("span", { class: "spacer" }));
    toolbar.appendChild(btnReroll);
    if (!state.locked) toolbar.appendChild(btnClear);

    const svgWrap = el("div", { class: "dag-svg-wrap" });
    leftCol.appendChild(svgWrap);
    const SVG_W = opts.svgWidth || 560, SVG_H = opts.svgHeight || 280;
    const root = svg("svg", { class: "dag-svg", viewBox: `0 0 ${SVG_W} ${SVG_H}`, preserveAspectRatio: "xMidYMid meet" });
    svgWrap.appendChild(root);

    // marker for arrowheads
    const defs = svg("defs");
    const marker = svg("marker", {
      id: "dag-arrowhead", viewBox: "0 0 10 10", refX: "9", refY: "5",
      markerWidth: "8", markerHeight: "8", orient: "auto-start-reverse"
    });
    const triangle = svg("path", { d: "M0,0 L10,5 L0,10 z", class: "dag-arrow-head" });
    marker.appendChild(triangle); defs.appendChild(marker);
    const markerSel = svg("marker", {
      id: "dag-arrowhead-sel", viewBox: "0 0 10 10", refX: "9", refY: "5",
      markerWidth: "8", markerHeight: "8", orient: "auto-start-reverse"
    });
    markerSel.appendChild(svg("path", { d: "M0,0 L10,5 L0,10 z", fill: "#b23a48" }));
    defs.appendChild(markerSel);
    root.appendChild(defs);

    const arrowsG = svg("g", { class: "dag-arrows" });
    const nodesG = svg("g", { class: "dag-nodes" });
    root.appendChild(arrowsG);
    root.appendChild(nodesG);

    // Right column: scatter + props.
    const rightCol = el("div", { class: "dag-col" });
    row.appendChild(rightCol);

    const scatterPanel = el("div", { class: "dag-panel" });
    rightCol.appendChild(scatterPanel);
    scatterPanel.appendChild(el("h4", null, ["What the data looks like"]));

    const axisControls = el("div", { class: "dag-scatter-controls" });
    scatterPanel.appendChild(axisControls);
    const xSel = el("select"); const ySel = el("select"); const colorSel = el("select");
    function fillSel(sel, includeNone) {
      sel.innerHTML = "";
      if (includeNone) {
        const o = el("option"); o.value = ""; o.textContent = "— none —"; sel.appendChild(o);
      }
      for (const id in state.nodes) {
        const o = el("option"); o.value = id; o.textContent = state.nodes[id].label;
        if (includeNone === "cat-only" && state.nodes[id].type !== "categorical") continue;
        sel.appendChild(o);
      }
    }
    fillSel(xSel, false); fillSel(ySel, false);
    // Color-by: only categorical nodes.
    colorSel.innerHTML = "";
    {
      const o = el("option"); o.value = ""; o.textContent = "— none —"; colorSel.appendChild(o);
      for (const id in state.nodes) {
        if (state.nodes[id].type === "categorical") {
          const o2 = el("option"); o2.value = id; o2.textContent = state.nodes[id].label; colorSel.appendChild(o2);
        }
      }
    }
    if (state.axes) { xSel.value = state.axes.x; ySel.value = state.axes.y; }
    if (state.colorBy) colorSel.value = state.colorBy;

    axisControls.appendChild(el("label", null, ["x: "]));
    axisControls.appendChild(xSel);
    axisControls.appendChild(el("label", null, ["y: "]));
    axisControls.appendChild(ySel);
    axisControls.appendChild(el("label", null, ["color by: "]));
    axisControls.appendChild(colorSel);

    const scatterCanvas = el("canvas", { class: "dag-scatter-canvas" });
    scatterCanvas.width = 480; scatterCanvas.height = 280;
    scatterPanel.appendChild(scatterCanvas);

    const readout = el("div", { class: "dag-scatter-readout" });
    scatterPanel.appendChild(readout);

    const propsPanel = el("div", { class: "dag-panel dag-props" });
    rightCol.appendChild(propsPanel);
    propsPanel.appendChild(el("h4", null, ["Selected arrow"]));
    const propsBody = el("div");
    propsPanel.appendChild(propsBody);

    const condPanel = el("div", { class: "dag-panel" });
    rightCol.appendChild(condPanel);
    condPanel.appendChild(el("h4", null, ["Condition on a variable"]));
    const condBody = el("div");
    condPanel.appendChild(condBody);
    condPanel.appendChild(el("p", { class: "dag-prop-help" }, [
      "Holding a variable steady (or filtering to one level) lets you see what happens to the relationship between the other two when that one isn't free to move."
    ]));

    // ---- rendering helpers ----
    function getNode(id) { return state.nodes[id]; }
    function pos(id) { const n = getNode(id); return { x: n.x, y: n.y }; }
    function arrowsBetween(a, b) {
      return state.arrows.filter(ar => (ar.from === a && ar.to === b) || (ar.from === b && ar.to === a));
    }

    function renderArrows() {
      arrowsG.innerHTML = "";
      state.arrows.forEach((ar, i) => {
        const p1c = pos(ar.from), p2c = pos(ar.to);
        const r1 = getNode(ar.from).radius, r2 = getNode(ar.to).radius;
        const p1 = trimToward(p2c, p1c, r1);
        const p2 = trimToward(p1c, p2c, r2);
        const twoWay = arrowsBetween(ar.from, ar.to).length > 1;
        const bend = twoWay ? (ar.from < ar.to ? 18 : -18) : 0;
        const g = svg("g");
        const path = svg("path", {
          d: arrowPath(p1, p2, bend),
          class: "dag-arrow" + (ar.strength < 0 ? " negative" : "")
            + ((state._selectedArrow && state._selectedArrow.from === ar.from && state._selectedArrow.to === ar.to) ? " selected" : ""),
          "marker-end": (state._selectedArrow && state._selectedArrow.from === ar.from && state._selectedArrow.to === ar.to)
            ? "url(#dag-arrowhead-sel)" : "url(#dag-arrowhead)"
        });
        path.addEventListener("click", (e) => { e.stopPropagation(); selectArrow(ar.from, ar.to); });
        g.appendChild(path);

        // strength label at midpoint
        const dx = p2.x - p1.x, dy = p2.y - p1.y, len = Math.sqrt(dx*dx + dy*dy) || 1;
        const nx = -dy/len, ny = dx/len;
        const mx = (p1.x + p2.x)/2 + nx*(bend + (bend >= 0 ? 14 : -14));
        const my = (p1.y + p2.y)/2 + ny*(bend + (bend >= 0 ? 14 : -14));
        const label = svg("text", { x: mx, y: my, class: "dag-arrow-strength-label" });
        label.textContent = (ar.strength >= 0 ? "+" : "") + ar.strength.toFixed(2);
        g.appendChild(label);

        arrowsG.appendChild(g);
      });
    }

    function renderNodes() {
      nodesG.innerHTML = "";
      for (const id in state.nodes) {
        const n = state.nodes[id];
        const g = svg("g", { transform: `translate(${n.x},${n.y})` });
        const cls = ["dag-node-bg"];
        if (state._selectedNode === id) cls.push("selected");
        if (n.conditioned) cls.push("conditioned");
        if (n.type === "categorical") cls.push("categorical");
        const bg = svg("circle", { r: n.radius, cx: 0, cy: 0, class: cls.join(" ") });
        bg.addEventListener("click", (e) => { e.stopPropagation(); onNodeClick(id); });
        g.appendChild(bg);
        // Wrap label across two lines if needed (split on space).
        const words = n.label.split(/\s+/);
        if (words.length <= 1 || n.label.length < 10) {
          const t = svg("text", { y: 4, class: "dag-node-label" });
          t.textContent = n.label;
          g.appendChild(t);
        } else {
          const mid = Math.ceil(words.length / 2);
          const t1 = svg("text", { y: -2, class: "dag-node-label" });
          t1.textContent = words.slice(0, mid).join(" ");
          const t2 = svg("text", { y: 12, class: "dag-node-label" });
          t2.textContent = words.slice(mid).join(" ");
          g.appendChild(t1); g.appendChild(t2);
        }
        if (n.type === "categorical") {
          const sub = svg("text", { y: n.radius + 11, class: "dag-node-sublabel" });
          sub.textContent = "(group, " + (n.levels || 2) + ")";
          g.appendChild(sub);
        }
        nodesG.appendChild(g);
      }
    }

    function onNodeClick(id) {
      if (state.locked) return;
      if (state._selectedNode === null) {
        state._selectedNode = id;
        state._selectedArrow = null;
        statusSpan.textContent = `From “${state.nodes[id].label}” — click another variable to draw an arrow.`;
        renderAll();
        return;
      }
      if (state._selectedNode === id) {
        // Cancel: clicking the same node twice OR toggle conditioning if double-clicked
        state._selectedNode = null;
        statusSpan.textContent = "Click a variable to draw an arrow from it.";
        renderAll();
        return;
      }
      // Create arrow from selected → id (or update strength if exists).
      const from = state._selectedNode, to = id;
      // Reject self-loops and arrows that would create a cycle.
      const exists = state.arrows.find(a => a.from === from && a.to === to);
      if (!exists) {
        // Tentatively add and check for cycle.
        state.arrows.push({ from, to, strength: 0.5 });
        const order = topoSort(state.nodes, state.arrows);
        if (!order) {
          state.arrows.pop();
          statusSpan.textContent = `Cannot draw “${state.nodes[from].label}” → “${state.nodes[to].label}” (creates a loop).`;
          state._selectedNode = null;
          renderAll();
          return;
        }
        emit("arrow", { type: "add", from, to });
      }
      state._selectedNode = null;
      state._selectedArrow = { from, to };
      statusSpan.textContent = "Drag the strength slider on the right to change the effect.";
      regenerateAndRender();
    }

    root.addEventListener("click", () => {
      state._selectedNode = null;
      state._selectedArrow = null;
      statusSpan.textContent = "Click a variable to draw an arrow from it.";
      renderAll();
    });

    btnClear.addEventListener("click", () => {
      if (state.locked) return;
      state.arrows = [];
      state._selectedArrow = null;
      state._selectedNode = null;
      regenerateAndRender();
      emit("arrow", { type: "clear" });
    });
    btnReroll.addEventListener("click", () => {
      state.seed = (Math.random() * 1e9) | 0;
      regenerateAndRender();
    });

    function selectArrow(from, to) {
      state._selectedArrow = { from, to };
      state._selectedNode = null;
      renderAll();
    }

    function renderProps() {
      propsBody.innerHTML = "";
      const sel = state._selectedArrow;
      if (!sel) {
        propsBody.appendChild(el("p", { class: "dag-prop-help" }, [
          "Click an arrow in the diagram to change how strong it is, or delete it."
        ]));
        return;
      }
      const ar = state.arrows.find(a => a.from === sel.from && a.to === sel.to);
      if (!ar) { state._selectedArrow = null; renderProps(); return; }
      const fromN = state.nodes[ar.from], toN = state.nodes[ar.to];
      propsBody.appendChild(el("p", { class: "dag-prop-help" }, [
        el("strong", null, [fromN.label]),
        " affects ",
        el("strong", null, [toN.label]),
        "."
      ]));
      const row = el("div", { class: "dag-prop-row" });
      row.appendChild(el("label", null, ["Strength"]));
      const slider = el("input", { type: "range", min: "-1", max: "1", step: "0.05" });
      slider.value = String(ar.strength);
      row.appendChild(slider);
      const out = el("output");
      out.textContent = (ar.strength >= 0 ? "+" : "") + ar.strength.toFixed(2);
      row.appendChild(out);
      propsBody.appendChild(row);
      slider.addEventListener("input", () => {
        ar.strength = parseFloat(slider.value);
        out.textContent = (ar.strength >= 0 ? "+" : "") + ar.strength.toFixed(2);
        regenerateAndRender({ skipNodes: true });
      });

      if (!state.locked) {
        const del = el("button", { type: "button", style: "margin-top:6px; background:#fff; border:1px solid #c00; color:#c00; padding:3px 8px; border-radius:3px; cursor:pointer; font-size:12px;" }, ["Delete this arrow"]);
        del.addEventListener("click", () => {
          state.arrows = state.arrows.filter(a => !(a.from === sel.from && a.to === sel.to));
          state._selectedArrow = null;
          emit("arrow", { type: "remove", from: sel.from, to: sel.to });
          regenerateAndRender();
        });
        propsBody.appendChild(del);
      }
    }

    function renderConditioning() {
      condBody.innerHTML = "";
      for (const id in state.nodes) {
        const n = state.nodes[id];
        // Don't allow conditioning on the current axes (creates confusing reads).
        const isAxis = (state.axes && (state.axes.x === id || state.axes.y === id));
        const row = el("label", { style: "display:flex; align-items:center; gap:8px; font-size:13px; padding:3px 0;" });
        const cb = el("input", { type: "checkbox" });
        cb.checked = !!n.conditioned;
        cb.disabled = isAxis;
        cb.addEventListener("change", () => {
          n.conditioned = cb.checked;
          regenerateAndRender();
        });
        row.appendChild(cb);
        const labelText = n.label + (isAxis ? "  (on the chart axes)" : (n.type === "categorical" ? "  (group)" : ""));
        row.appendChild(el("span", null, [labelText]));
        condBody.appendChild(row);
      }
    }

    function drawScatter() {
      const canvas = scatterCanvas;
      const dpr = window.devicePixelRatio || 1;
      if (!canvas.dataset.cssW) { canvas.dataset.cssW = String(canvas.width); canvas.dataset.cssH = String(canvas.height); }
      const cssW = +canvas.dataset.cssW, cssH = +canvas.dataset.cssH;
      canvas.width = cssW * dpr; canvas.height = cssH * dpr;
      canvas.style.width = cssW + "px"; canvas.style.height = cssH + "px";
      const ctx = canvas.getContext("2d");
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, cssW, cssH);

      const ax = state.axes;
      if (!ax || !state._samples || !state._samples[ax.x] || !state._samples[ax.y]) {
        ctx.fillStyle = "#888"; ctx.font = "13px sans-serif";
        ctx.fillText("Pick axes above to see the data.", 20, 30);
        readout.innerHTML = "";
        return;
      }
      const xs = state._samples[ax.x], ys = state._samples[ax.y];
      const mask = buildMask(state);
      const xsF = [], ysF = [], cF = [];
      const colorId = state.colorBy && state.nodes[state.colorBy] && state.nodes[state.colorBy].type === "categorical" ? state.colorBy : null;
      const cs = colorId ? state._samples[colorId] : null;
      for (let i = 0; i < xs.length; i++) {
        if (!mask[i]) continue;
        xsF.push(xs[i]); ysF.push(ys[i]);
        if (cs) cF.push(cs[i]);
      }
      if (xsF.length === 0) {
        ctx.fillStyle = "#888"; ctx.font = "13px sans-serif";
        ctx.fillText("No samples after conditioning.", 20, 30);
        readout.innerHTML = "";
        return;
      }

      // axes
      const xMin = Math.min(...xsF), xMax = Math.max(...xsF);
      const yMin = Math.min(...ysF), yMax = Math.max(...ysF);
      const xPad = (xMax - xMin) * 0.08 || 1, yPad = (yMax - yMin) * 0.08 || 1;
      const pad = { l: 50, r: 16, t: 14, b: 32 };
      const W = cssW - pad.l - pad.r, H = cssH - pad.t - pad.b;
      const xs2px = v => pad.l + (v - (xMin - xPad)) / ((xMax + xPad) - (xMin - xPad)) * W;
      const ys2px = v => pad.t + H - (v - (yMin - yPad)) / ((yMax + yPad) - (yMin - yPad)) * H;

      ctx.strokeStyle = "#bbb"; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(pad.l, pad.t); ctx.lineTo(pad.l, pad.t + H); ctx.lineTo(pad.l + W, pad.t + H); ctx.stroke();
      ctx.fillStyle = "#666"; ctx.font = "11px sans-serif";
      ctx.textAlign = "center"; ctx.textBaseline = "top";
      ctx.fillText(state.nodes[ax.x].label, pad.l + W/2, pad.t + H + 14);
      ctx.save(); ctx.translate(12, pad.t + H/2); ctx.rotate(-Math.PI/2);
      ctx.textBaseline = "alphabetic"; ctx.fillText(state.nodes[ax.y].label, 0, 0); ctx.restore();

      // points
      const palette = ["#2f6b8f", "#b23a48", "#c28a2b", "#2f6b3a", "#542788", "#a52a2a"];
      for (let i = 0; i < xsF.length; i++) {
        ctx.fillStyle = colorId ? palette[cF[i] % palette.length] + "cc" : "#1d1d1baa";
        ctx.beginPath();
        ctx.arc(xs2px(xsF[i]), ys2px(ysF[i]), 3, 0, 2*Math.PI);
        ctx.fill();
      }

      // OLS line(s)
      if (colorId) {
        const k = state.nodes[colorId].levels || 2;
        const lines = [];
        for (let lvl = 0; lvl < k; lvl++) {
          const xsk = [], ysk = [];
          for (let i = 0; i < xsF.length; i++) if (cF[i] === lvl) { xsk.push(xsF[i]); ysk.push(ysF[i]); }
          if (xsk.length >= 2) lines.push({ lvl, ...olsSlope(xsk, ysk) });
        }
        // Stratified lines, in matching colors
        lines.forEach(L => {
          ctx.strokeStyle = palette[L.lvl % palette.length];
          ctx.lineWidth = 1.8;
          ctx.beginPath();
          ctx.moveTo(xs2px(xMin), ys2px(L.slope * xMin + L.intercept));
          ctx.lineTo(xs2px(xMax), ys2px(L.slope * xMax + L.intercept));
          ctx.stroke();
        });
        // Pooled line (dashed, dark)
        const pooled = olsSlope(xsF, ysF);
        ctx.strokeStyle = "#000"; ctx.lineWidth = 1.5; ctx.setLineDash([5, 4]);
        ctx.beginPath();
        ctx.moveTo(xs2px(xMin), ys2px(pooled.slope * xMin + pooled.intercept));
        ctx.lineTo(xs2px(xMax), ys2px(pooled.slope * xMax + pooled.intercept));
        ctx.stroke(); ctx.setLineDash([]);
      } else {
        const fit = olsSlope(xsF, ysF);
        ctx.strokeStyle = "#b23a48"; ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(xs2px(xMin), ys2px(fit.slope * xMin + fit.intercept));
        ctx.lineTo(xs2px(xMax), ys2px(fit.slope * xMax + fit.intercept));
        ctx.stroke();
      }

      // readout
      const r = pearson(xsF, ysF);
      const sign = Math.abs(r) < 0.05 ? "≈ 0" : r > 0 ? "positive" : "negative";
      const strength = Math.abs(r) < 0.15 ? "essentially no" : Math.abs(r) < 0.35 ? "a weak" : Math.abs(r) < 0.6 ? "a moderate" : "a strong";
      const condList = Object.values(state.nodes).filter(n => n.conditioned).map(n => n.label);
      let condText = "";
      if (condList.length) condText = ` (holding ${condList.join(", ")} fixed)`;
      readout.innerHTML = "";
      readout.appendChild(el("span", null, [
        `Across these ${xsF.length} samples${condText}, there is `,
      ]));
      readout.appendChild(el("span", { class: "big" }, [`${strength} ${sign}`]));
      readout.appendChild(el("span", null, [` relationship between ${state.nodes[ax.x].label} and ${state.nodes[ax.y].label}.`]));
      readout.appendChild(el("div", { style: "margin-top:4px; font-size:11px; color:#666;" }, [
        `(Pearson r = ${isFinite(r) ? r.toFixed(2) : "—"})`
      ]));
    }

    function regenerateAndRender(opts2) {
      const res = generateSamples(state);
      if (res.cycle) {
        statusSpan.textContent = "There's a loop in the arrows — remove one to continue.";
        return;
      }
      state._samples = res.samples;
      renderAll(opts2);
      emit("change", state);
    }

    function renderAll(opts2) {
      if (!opts2 || !opts2.skipNodes) renderNodes();
      renderArrows();
      renderProps();
      renderConditioning();
      drawScatter();
    }

    xSel.addEventListener("change", () => { state.axes = { x: xSel.value, y: state.axes.y }; renderAll(); emit("axes", state.axes); });
    ySel.addEventListener("change", () => { state.axes = { x: state.axes.x, y: ySel.value }; renderAll(); emit("axes", state.axes); });
    colorSel.addEventListener("change", () => { state.colorBy = colorSel.value || null; drawScatter(); });

    // ---- public controller ----
    const ctrl = {
      setArrow(from, to, strength) {
        const existing = state.arrows.find(a => a.from === from && a.to === to);
        if (Math.abs(strength) < 1e-6) {
          state.arrows = state.arrows.filter(a => !(a.from === from && a.to === to));
        } else if (existing) {
          existing.strength = strength;
        } else {
          state.arrows.push({ from, to, strength });
        }
        regenerateAndRender();
      },
      removeArrow(from, to) {
        state.arrows = state.arrows.filter(a => !(a.from === from && a.to === to));
        if (state._selectedArrow && state._selectedArrow.from === from && state._selectedArrow.to === to) state._selectedArrow = null;
        regenerateAndRender();
      },
      setConditioned(id, on) {
        if (state.nodes[id]) { state.nodes[id].conditioned = !!on; regenerateAndRender(); }
      },
      setColorBy(id) { state.colorBy = id || null; colorSel.value = id || ""; drawScatter(); },
      setAxes(x, y) { state.axes = { x, y }; xSel.value = x; ySel.value = y; renderAll(); emit("axes", state.axes); },
      regenerate(seed) { if (typeof seed === "number") state.seed = seed; regenerateAndRender(); },
      getCorrelation(a, b) { if (!state._samples) return NaN; return pearson(state._samples[a], state._samples[b]); },
      getState() { return state; },
      getArrows() { return state.arrows.map(a => ({ from: a.from, to: a.to, strength: a.strength })); },
      on
    };

    regenerateAndRender();
    return ctrl;
  }

  global.DAG = { init };
})(typeof window !== "undefined" ? window : globalThis);
