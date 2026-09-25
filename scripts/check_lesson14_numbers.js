#!/usr/bin/env node
/*
 * check_lesson14_numbers.js -- the bar checks for app/lessons/lesson14.html.
 *
 * Lesson 14 is a draft (2026-09-24): Stage A, births and deaths leaning on
 * crowding. What has to hold:
 *
 *   1. the crossing the page prints is where the two lines actually meet;
 *   2. populations settle at the crossing, measured over many runs;
 *   3. every round is hit at the lever value its level needs, missed at the
 *      lever's opening value, and the held arrows are the round's.
 *
 * Same harness as check_lesson11_numbers.js: the checks run inside a
 * same-origin iframe against the page's own functions; the report comes back
 * in a <pre>, and the runner fails if fewer checks come back than ran.
 *
 * Usage:  node scripts/check_lesson14_numbers.js
 * Exit 0 iff every bar passes. Needs Google Chrome and python3.
 */
const { spawn, spawnSync } = require("child_process");
const fs = require("fs"), path = require("path");

const ROOT = path.resolve(__dirname, "..");
const PORT = 8797;
const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

const INNER = `
const L=[], say=s=>L.push(s);
let bad = 0, ran = 0;
const check = (name, ok, detail) => { ran++; if (!ok) bad++; say((ok?"ok   ":"FAIL ") + name + "  " + detail); };
const mn = a => a.reduce((x,y)=>x+y,0)/a.length;

check("page loaded", !!(A && A.game && A.paths && typeof Score !== "undefined"), "Stage A, its diagram and Score are defined");
check("slots declared match slots written", Object.keys(BIT).length === 1, Object.keys(BIT).length + " named bit, scaffold is 1");

/* ---- the crossing, found here by bisection on births minus deaths -------- */
{
  let worst = 0, n = 0; const rng = mulberry32(77);
  for (let q = 0; q < 200; q++) {
    const v = { b0: 0.3 + 0.9 * rng(), d0: 0.25 * rng(), bb: -0.2 * rng(), bd: 0.02 + 0.2 * rng() };
    const K = A_cross(v); if (K == null || K > 5000) continue;
    let lo = 0, hi = 20000; for (let k = 0; k < 200; k++) { const m = (lo + hi) / 2; if (A_birth(v, m) > A_death(v, m)) lo = m; else hi = m; }
    /* only where neither line has hit its floor or ceiling */
    if (A_birth(v, lo) <= 0 || A_death(v, lo) >= 1) continue;
    worst = Math.max(worst, Math.abs(lo - K)); n++;
  }
  check("A the crossing printed is where the lines meet", worst < 1e-6 && n > 100, n + " random diagrams: largest gap " + worst.toExponential(1));
}
/* the lever value a round's level needs, on the slider's steps */
const need = r => { const v = Object.assign({ b0: 0.6, bb: 0, d0: 0.2, bd: 0 }, r.fix), step = r.lever === "b0" || r.lever === "d0" ? 0.05 : 0.01;
  const lo = r.lever === "b0" || r.lever === "d0" ? 0 : -0.3, hi = r.lever === "b0" ? 1.2 : r.lever === "d0" ? 1 : 0.3;
  let best = null, gap = Infinity;
  for (let x = lo; x <= hi + 1e-9; x += step) { const u = Math.round(x / step) * step; v[r.lever] = +u.toFixed(4); const K = A_cross(v);
    if (K != null && Math.abs(K - r.K) < gap) { gap = Math.abs(K - r.K); best = +u.toFixed(4); } }
  v[r.lever] = best; return { val: best, v: Object.assign({}, v), K: A_cross(v) }; };
{
  /* the populations settle at the crossing */
  const rows = A_ROUNDS.map((r, i) => { const nd = need(r), lev = [];
    for (let q = 0; q < 30; q++) lev.push(A_level(A_run(nd.v, mulberry32(3000 + i * 131 + q * 7919))));
    return { k: r.key, K: nd.K, m: mn(lev) }; });
  check("A populations settle at the crossing", rows.every(q => Math.abs(q.m - q.K) <= 0.03 * q.K),
        rows.map(q => q.k + ": " + Math.round(q.m) + " [crossing " + Math.round(q.K) + "]").join("  ") + "  (generations 31-40, 30 runs each)");
}
{
  const rate = (r, v, reps, seed) => { let k = 0; for (let q = 0; q < reps; q++) if (Math.abs(A_level(A_run(v, mulberry32(seed + q * 7919))) - r.K) <= A_TOL * r.K) k++; return k / reps; };
  const hit = A_ROUNDS.map((r, i) => { const nd = need(r); return { k: r.key, val: nd.val, v: rate(r, nd.v, 40, 5000 + i * 97) }; });
  check("A every round is hit at the lever value its level needs", hit.every(q => q.v >= 0.9),
        hit.map(q => q.k + " @" + q.val + ": " + Math.round(100 * q.v) + "%").join("  ") + "  (40 runs each)");
  const open = A_ROUNDS.map((r, i) => { const v = Object.assign({ b0: 0.6, bb: 0, d0: 0.2, bd: 0 }, r.fix); v[r.lever] = r.start; return rate(r, v, 20, 6000 + i * 97); });
  check("A the lever's opening value hits none", open.every(v => v === 0), open.map(v => Math.round(100 * v) + "%").join(" / "));
  /* one value of each lever serves at most two of its rounds */
  const byLever = {}; A_ROUNDS.forEach(r => (byLever[r.lever] = byLever[r.lever] || []).push(r));
  let worst = 0; const detail = [];
  for (const lv in byLever) if (byLever[lv].length > 1) { const nd = byLever[lv].map(need);
    const cross = byLever[lv].map((r, j) => byLever[lv].filter((q, k) => { const v = Object.assign({}, nd[k].v); v[lv] = nd[j].val; const K = A_cross(v); return K != null && Math.abs(K - q.K) <= A_TOL * q.K; }).length);
    worst = Math.max(worst, ...cross); detail.push(lv + ": " + nd.map(n => n.val).join(" vs ")); }
  check("A two rounds on one lever need different values", worst <= 1, detail.join("; "));
}
{
  /* the deal holds the three arrows that are not the student's */
  const r = A.game.current(), v = A.v;
  const held = Object.keys(r.fix).every(k => Math.abs(v[k] - r.fix[k]) < 1e-9);
  check("A the held arrows are the round's", held, "round " + r.key + ": " + Object.keys(r.fix).map(k => k + " " + v[k] + " (dealt " + r.fix[k] + ")").join(", "));
}
/* ---- every plot inside its panel --------------------------------------- */
{
  document.getElementById("stageA").classList.remove("stage-locked");
  const over = () => { const bad = [];
    document.querySelectorAll("canvas").forEach(cv => {
      if (cv.dataset.fit === "off") return;
      let host = cv.parentElement; while (host && !host.classList.contains("panel")) host = host.parentElement;
      if (!host) return;
      const cs = getComputedStyle(host), hr = host.getBoundingClientRect(), cr = cv.getBoundingClientRect();
      const o = cr.right - (hr.right - parseFloat(cs.paddingRight) - parseFloat(cs.borderRightWidth));
      if (o > 0.5) bad.push((cv.id || "card") + " +" + Math.round(o));
    });
    return bad; };
  const fe = window.frameElement, w0 = fe ? fe.width : null, res = [];
  for (const w of [w0, 1100, 900]) {
    if (fe && w) { fe.width = w; void document.body.offsetWidth; FIT_EPOCH++; repaintAll(); }
    res.push({ w: innerWidth, bad: over() });
  }
  if (fe) { fe.width = w0; void document.body.offsetWidth; FIT_EPOCH++; repaintAll(); }
  check("every plot fits its panel", res.every(q => q.bad.length === 0),
        res.map(q => q.w + " px: " + (q.bad.length ? q.bad.join(" ") : "none over")).join("  |  "));
}

/* ---- the practice switch, through the real buttons. Last: spends one
   scored attempt of each game. The runs animate on setInterval; a stand-in
   runs each out. */
{
  const realSI = window.setInterval, realCI = window.clearInterval;
  let loop = false, stop = false;
  window.setInterval = fn => { loop = true; stop = false; for (let k = 0; k < 20000 && !stop; k++) fn(); loop = false; return 0; };
  window.clearInterval = id => { if (loop) stop = true; else realCI(id); };
  const out = [], stages = { A };
  try {
    for (const [S, go] of [["A", "A_run"]]) {
      document.getElementById("stage" + S).classList.remove("stage-locked");
      const g = stages[S].game, box = document.getElementById(S + "_practice"), btn = document.getElementById(go);
      const tick = on => { box.checked = on; box.dispatchEvent(new Event("change")); };
      const n0 = g.st.hits.length;
      tick(true); btn.click();
      const pracOk = g.st.hits.length === n0 && g.st.last != null && /practice/.test(document.getElementById(S + "_tflip").textContent);
      tick(false); btn.click();
      const scored = g.st.hits.length === n0 + 1 && g.waiting(), blocked = btn.disabled;
      tick(true); btn.click();
      const stillPrac = !btn.disabled && g.st.hits.length === n0 + 1 && g.waiting();
      tick(false);
      out.push({ ok: pracOk && scored && blocked && stillPrac,
                 t: S + ": practice " + (pracOk ? "unscored" : "SCORED") + ", ticked off " + (scored ? "scored" : "NOT scored") +
                    ", waiting " + (blocked ? "Go off" : "GO ON") + (stillPrac ? " but practice runs" : ", practice BLOCKED") });
    }
  } finally { window.setInterval = realSI; window.clearInterval = realCI; }
  check("every stage has a practice switch that does not score", out.length === 1 && out.every(q => q.ok), out.map(q => q.t).join("  |  "));
}

say(bad ? ("FAILED " + bad) : "ALL BARS PASS");
say("RAN " + ran);
L.join(" ;; ");
`;

const probe = `<!doctype html><meta charset="utf-8"><title>pending</title>
<iframe id="f" src="http://127.0.0.1:${PORT}/app/lessons/lesson14.html?preview=1" width="1500" height="1000"></iframe>
<pre id="out"></pre>
<script>
const SRC = ${JSON.stringify(INNER)};
document.getElementById("f").addEventListener("load", () => setTimeout(() => {
  const w = document.getElementById("f").contentWindow;
  let res;
  try { res = String(w.eval(SRC)); }
  catch (e) { res = "THREW " + e.message + " @ " + (e.stack||"").split("\\n")[1]; }
  document.getElementById("out").textContent = res;
  document.title = "done";
}, 3000));
</script>`;

const probePath = path.join(ROOT, "_check_l14.html");
fs.writeFileSync(probePath, probe);
const server = spawn("python3", ["-m", "http.server", String(PORT), "--directory", ROOT],
                     { stdio: "ignore", detached: true });
const cleanup = () => { try { process.kill(-server.pid); } catch (e) {} try { fs.unlinkSync(probePath); } catch (e) {} };
process.on("exit", cleanup);

setTimeout(() => {
  const r = spawnSync(CHROME, ["--headless=new", "--disable-gpu", "--virtual-time-budget=900000",
                               "--dump-dom", `http://127.0.0.1:${PORT}/_check_l14.html`],
                      { encoding: "utf8", maxBuffer: 1 << 28 });
  const m = /<pre id="out">([\s\S]*?)<\/pre>/.exec(r.stdout || "");
  if (!m) { console.error("no result -- is Chrome at " + CHROME + " ?"); cleanup(); process.exit(2); }
  const text = m[1].replace(/&quot;/g, '"').replace(/&gt;/g, ">").replace(/&lt;/g, "<").replace(/&amp;/g, "&");
  const lines = text.split(" ;; ");
  for (const line of lines) console.log(line);
  const reported = lines.filter(l => /^(ok|FAIL)\s/.test(l)).length;
  const ranLine = /^RAN (\d+)$/.exec((lines.find(l => /^RAN \d+$/.test(l)) || ""));
  if (!ranLine || +ranLine[1] !== reported) {
    console.log("FAIL harness  " + (ranLine ? ranLine[1] : "?") + " checks ran, " + reported +
                " came back -- the report was truncated");
    cleanup(); process.exit(1);
  }
  cleanup();
  process.exit(/ALL BARS PASS/.test(text) ? 0 : 1);
}, 1800);
