#!/usr/bin/env node
/*
 * check_lesson13_numbers.js -- the bar checks for app/lessons/lesson13.html.
 *
 * Lesson 13 is a draft (2026-09-24): Stage A, covariance. What has to hold:
 *
 *   1. the offspring's shift IS cov(w, z) / w̄, every time, exactly -- the
 *      identity the stage prints -- and the covariance IS the average of the
 *      rectangles it draws;
 *   2. at a fixed slope the shift grows with the trait's variance: selection
 *      needs variation;
 *   3. every round is hit at its slope, missed at slope 0, and no one slope
 *      clears three rounds.
 *
 * Same harness as check_lesson11_numbers.js: the checks run inside a
 * same-origin iframe against the page's own functions; the report comes back
 * in a <pre>, and the runner fails if fewer checks come back than ran.
 *
 * Usage:  node scripts/check_lesson12_numbers.js
 * Exit 0 iff every bar passes. Needs Google Chrome and python3.
 */
const { spawn, spawnSync } = require("child_process");
const fs = require("fs"), path = require("path");

const ROOT = path.resolve(__dirname, "..");
const PORT = 8794;
const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

const INNER = `
const L=[], say=s=>L.push(s);
let bad = 0, ran = 0;
const check = (name, ok, detail) => { ran++; if (!ok) bad++; say((ok?"ok   ":"FAIL ") + name + "  " + detail); };
const mn = a => a.reduce((x,y)=>x+y,0)/a.length;
const sdv = a => { const m = mn(a); return Math.sqrt(a.reduce((x,y)=>x+(y-m)*(y-m),0)/Math.max(1,a.length-1)); };

check("page loaded", !!(A && A.game && typeof Score !== "undefined"), "Stage A and Score are defined");
check("slots declared match slots written", Object.keys(BIT).length === 1, Object.keys(BIT).length + " named bit, scaffold is 1");

/* ---- the identity, recomputed here from the dots ----------------------- */
{
  let worst = 0, worstRect = 0, n = 0;
  for (const sd of [0.5, 1.5, 3]) for (const beta of [-1, -0.3, 0, 0.4, 1.2]) for (let q = 0; q < 5; q++) {
    const pop = A_makePop(sd, 900 + q * 13 + Math.round(sd * 10)), rng = mulberry32(1000 + q * 7919);
    const w = A_lambda(pop, beta).map(l => A_pois(rng, l)), st = A_stats(pop, w);
    /* by hand: the weighted mean of the parents' trait, minus their mean */
    let sw = 0, swz = 0, sz = 0; for (let i = 0; i < pop.z.length; i++) { sw += w[i]; swz += w[i] * pop.z[i]; sz += pop.z[i]; }
    const shift = sw > 0 ? swz / sw - sz / pop.z.length : 0;
    /* the rectangles, one per dot, signed, averaged */
    const zb = sz / pop.z.length, wb = sw / pop.z.length;
    let rect = 0; for (let i = 0; i < pop.z.length; i++) rect += (pop.z[i] - zb) * (w[i] - wb) / pop.z.length;
    worst = Math.max(worst, Math.abs(shift - rect / wb), Math.abs(st.shift - shift));
    worstRect = Math.max(worstRect, Math.abs(rect - st.cov)); n++;
  }
  check("A the shift is cov(w, z) / w̄, and the covariance is the average rectangle", worst < 1e-9 && worstRect < 1e-9,
        n + " populations x slopes x draws: largest gap " + worst.toExponential(1) + " (shift) and " + worstRect.toExponential(1) + " (rectangles)");
}
{
  /* selection needs variation: one slope, four spreads */
  const beta = 0.3, rows = [0.5, 1, 2, 3].map(sd => { const pop = A_makePop(sd, 1200 + sd * 10), st = A_stats(pop, A_lambda(pop, beta));
    return { sd, V: pop.V, shift: st.shift, pred: beta * pop.V / st.wb }; });
  check("A at one slope the shift grows with the variance", rows.every((q, i) => i === 0 || q.shift > rows[i - 1].shift) && rows.every(q => Math.abs(q.shift - q.pred) < 0.02 * Math.max(1, q.pred)),
        "slope 0.3: " + rows.map(q => "spread " + q.sd + " (variance " + q.V.toFixed(2) + ") → " + q.shift.toFixed(3) + " [slope × variance ÷ w̄ " + q.pred.toFixed(3) + "]").join("  "));
}
/* ---- the rounds --------------------------------------------------------- */
{
  const popOf = (r, i) => A_makePop(r.sd, pageSeed("l13Ap", 1, 99999) + (i + 1) * 7919);
  const hitA = (r, pop, beta, reps, seed) => { let k = 0; const lam = A_lambda(pop, beta);
    for (let q = 0; q < reps; q++) { const rng = mulberry32(seed + q * 7919); if (Math.abs(A_stats(pop, lam.map(l => A_pois(rng, l))).shift - r.S) <= A_tol(r)) k++; }
    return k / reps; };
  const own = A_ROUNDS.map((r, i) => { const pop = popOf(r, i), beta = Math.round(200 * r.S / pop.V) / 100; return { k: r.key, beta, v: hitA(r, pop, beta, 40, 2000 + i * 97) }; });
  check("A every round is hit at its slope", own.every(q => q.v >= 0.9),
        own.map(q => q.k + " @" + q.beta + ": " + Math.round(100 * q.v) + "%").join("  ") + "  (40 draws each)");
  const zero = A_ROUNDS.map((r, i) => hitA(r, popOf(r, i), 0, 20, 2500 + i * 97));
  check("A slope 0, the opening, hits none", zero.every(v => v === 0), zero.map(v => Math.round(100 * v) + "%").join(" / "));
  let most = 0, at = 0;
  for (let b = -1.5; b <= 1.5001; b += 0.01) { const beta = Math.round(b * 100) / 100;
    const c = A_ROUNDS.filter((r, i) => { const pop = popOf(r, i); return Math.abs(A_stats(pop, A_lambda(pop, beta)).shift - r.S) <= A_tol(r); }).length;
    if (c > most) { most = c; at = beta; } }
  check("A no one slope clears three rounds", most <= 2, "301 slopes on the expected offspring: the greediest (" + at + ") clears " + most);
  const spreadOK = A_ROUNDS.map((r, i) => { const pop = popOf(r, i); return Math.round(200 * r.S / pop.V) / 100; });
  check("A the slope a round needs changes with its spread", Math.max(...spreadOK.map(Math.abs)) / Math.min(...spreadOK.map(Math.abs)) > 3,
        "slopes: " + spreadOK.join(", ") + " — spreads " + A_ROUNDS.map(r => r.sd).join(", "));
}
/* ---- the drag puts the slope where the pointer is ---------------------- */
{
  const cv = document.getElementById("A_scatter"), rc = cv.getBoundingClientRect(), W = +cv.dataset.drawW, H = +cv.dataset.cssH;
  const keep = A.beta; A.drawn = null;
  const f = A_frameTop(W, H), z = A.pop.zb + 2 * A.pop.sd, w = A_WBAR + 0.4 * (2 * A.pop.sd);
  A_dragTo({ clientX: rc.left + f.x(z) * rc.width / W, clientY: rc.top + f.y(w) * rc.height / H });
  const got = A.beta; A.beta = keep; A_syncSliders(); A_paint();
  check("A dragging on the plot sets the slope through the pointer", Math.abs(got - 0.4) <= 0.02, "pointer on the line of slope 0.40 through the average parent: slope set to " + got);
}
/* ---- every plot inside its panel --------------------------------------- */
{
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
<iframe id="f" src="http://127.0.0.1:${PORT}/app/lessons/lesson13.html?preview=1" width="1500" height="1000"></iframe>
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

const probePath = path.join(ROOT, "_check_l13.html");
fs.writeFileSync(probePath, probe);
const server = spawn("python3", ["-m", "http.server", String(PORT), "--directory", ROOT],
                     { stdio: "ignore", detached: true });
const cleanup = () => { try { process.kill(-server.pid); } catch (e) {} try { fs.unlinkSync(probePath); } catch (e) {} };
process.on("exit", cleanup);

setTimeout(() => {
  const r = spawnSync(CHROME, ["--headless=new", "--disable-gpu", "--virtual-time-budget=900000",
                               "--dump-dom", `http://127.0.0.1:${PORT}/_check_l13.html`],
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
