#!/usr/bin/env node
/*
 * check_lesson10_numbers.js -- the bar checks for app/lessons/lesson10.html.
 *
 * WHAT THIS IS FOR. Lesson 10 is a stochastic simulator whose gates are
 * "get this number past X" and whose closing games judge a locked estimate
 * against a tolerance. Three things have to be true of every one of those
 * bars, and none of them is visible by opening the page:
 *
 *   1. it is clearable at all, by a student doing the intended thing;
 *   2. it is NOT clearable by the naive answer -- the headcount, "it never
 *      moves", "the advantage always wins", the plain average -- because a
 *      bar that the misconception clears teaches the misconception;
 *   3. the truth it is judged against sits inside its own band relative to
 *      the re-runs the student is shown.
 *
 * A fourth thing, specific to the closing games: no CONSTANT answer may
 * clear three rounds. Each game's three round classes are checked for an
 * empty common interval, so a student who locks the same number every time
 * cannot pass by finding the average.
 *
 * It drives the shipped page rather than a copy of its arithmetic: the
 * checks run inside a same-origin iframe against the page's own functions,
 * so a bar cannot pass here and fail in the browser.
 *
 * Usage:  node scripts/check_lesson10_numbers.js
 * Exit 0 iff every bar passes. Needs Google Chrome and python3.
 */
const { spawn, spawnSync } = require("child_process");
const fs = require("fs"), path = require("path");

const ROOT = path.resolve(__dirname, "..");
const PORT = 8791;
const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

const INNER = `
const L=[], say=s=>L.push(s);
let bad = 0;
const check = (name, ok, detail) => { if (!ok) bad++; say((ok?"ok   ":"FAIL ") + name + "  " + detail); };
const mn = a => a.reduce((x,y)=>x+y,0)/a.length;

/* ---- 0. the page came up at all ---------------------------------------- */
check("page loaded", !!(A && A.pop && B && C && D && E && typeof Score !== "undefined"),
      "every stage object and Score are defined");
check("slots declared match slots written",
      Object.keys(BIT).length === 13, Object.keys(BIT).length + " named bits");

/* ---- A. differential reproduction with nothing attached ---------------- */
{
  // the A2 gate: 0.12 in one generation, holding 100 breeders. Only the
  // spread can do it; a flat pond gets there by luck about once in a blue moon.
  const tryRun = (N, cv) => { A.N = N; A.cv = cv; A.best = 0; A_fresh();
    for (let i = 0; i < 25; i++) A_step(); return A.best; };
  const hot = [], cold = [];
  for (let r = 0; r < 6; r++) { hot.push(tryRun(100, 2.6)); cold.push(tryRun(100, 0)); }
  check("A2 gate clearable", hot.filter(v => v > 0.12).length >= 5,
        "spread 2.6 cleared " + hot.filter(v=>v>0.12).length + "/6 (best " + Math.max(...hot).toFixed(3) + ")");
  check("A2 gate not cleared flat", cold.filter(v => v > 0.12).length <= 1,
        "spread 0 cleared " + cold.filter(v=>v>0.12).length + "/6 (best " + Math.max(...cold).toFixed(3) + ")");

  // A1: "nobody is left out" is the misconception, and it must miss.
  const m = A_measure(100, 0, 5), pct = 100 * m.childless / 100;
  const tol = Math.max(5, 0.15 * pct);
  check("A1 truth", pct > 8 && pct < 20, "a flat pond leaves " + pct.toFixed(0) + "% of breeders with nothing");
  check("A1 rejects zero", Math.abs(0 - pct) > tol, "0% is " + (pct/tol).toFixed(1) + " tolerances out");

  // A3: no constant answer clears three rounds.
  const rng = mulberry32(4242), iv = [];
  for (let n = 0; n < 3; n++) { const r = A.game.round(rng, n); iv.push([r.truth - r.tol, r.truth + r.tol]); }
  const lo = Math.max(...iv.map(v=>v[0])), hi = Math.min(...iv.map(v=>v[1]));
  check("A3 no constant clears", lo > hi,
        "three rounds: " + iv.map(v=>"["+v[0].toFixed(3)+","+v[1].toFixed(3)+"]").join(" "));
  const zeroClears = iv.filter(v => 0 >= v[0] && 0 <= v[1]).length;
  check("A3 rejects 'it does not move'", zeroClears === 0, zeroClears + " of 3 rounds would accept 0.000");
}

/* ---- B. the error is inherited ----------------------------------------- */
{
  const rngB = mulberry32(99);
  const inh = B_batch(rngB, 10, 300, true, 20);
  check("B2 gate clearable", inh.fixed === 20, "10 breeders, 300 generations: " + inh.fixed + "/20 down to one colour");
  const fr = B_batch(rngB, 10, 300, false, 60);
  check("B3 observation holds", fr.touched === 0,
        "60 fresh-start ponds x 300 generations at N=10: " + fr.touched + " ever reached a wall");
  check("B3 variety holds up", fr.H[300] > 0.45, "variety after 300 generations: " + fr.H[300].toFixed(3) + " of 0.500");
  check("B2 not clearable fresh", B_batch(rngB, 10, 300, false, 20).fixed === 0, "the other setting fixes nothing");

  // the distance grows with the root of the generations, not with them
  const d = g => { const r = []; for (let i = 0; i < 60; i++) r.push(Math.abs(B_runOne(rngB, 100, g, true)[g] - 0.5)); return mn(r); };
  const d10 = d(10), d40 = d(40), d150 = d(150);
  check("B4 sublinear in generations", d150 < 3 * d40 && d40 < 3 * d10,
        "10 gen " + d10.toFixed(3) + " -> 40 gen " + d40.toFixed(3) + " -> 150 gen " + d150.toFixed(3));
  const rng = mulberry32(31337), iv = [];
  for (let n = 0; n < 3; n++) { const r = B.game.round(rng, n); iv.push([r.truth - r.tol, r.truth + r.tol]); }
  const lo = Math.max(...iv.map(v=>v[0])), hi = Math.min(...iv.map(v=>v[1]));
  check("B4 no constant clears", lo > hi, "three rounds: " + iv.map(v=>"["+v[0].toFixed(3)+","+v[1].toFixed(3)+"]").join(" "));
}

/* ---- C. 107 ponds and the two walls ------------------------------------ */
{
  const hl = N => C_halfLife(N);
  const rows = [8, 16, 25, 50].map(N => [N, hl(N)]);
  const worst = rows.map(([N, h]) => Math.abs(h - 1.386 * N) / (1.386 * N)).reduce((a,b)=>Math.max(a,b),0);
  check("C1 half-life is 1.4 x the headcount", worst < 0.15,
        rows.map(([N,h]) => N + "->" + h.toFixed(1) + " (want " + (1.386*N).toFixed(0) + ")").join("  "));

  C.N = 8; C_run(); const small = C.runs.one[20];
  C.N = 25; C_run(); const big = C.runs.one[20];
  check("C2 gate clearable", small > 53, "8 breeders: " + small + " of 107 by generation 20");
  check("C2 gate needs a small pond", big <= 53, "25 breeders: " + big + " of 107 by generation 20");

  const rng = mulberry32(606), iv = [];
  for (let n = 0; n < 3; n++) { const r = C.game.round(rng, n); iv.push([r.truth - r.tol, r.truth + r.tol]); }
  const lo = Math.max(...iv.map(v=>v[0])), hi = Math.min(...iv.map(v=>v[1]));
  check("C3 no constant clears", lo > hi, "three rounds: " + iv.map(v=>"["+v[0].toFixed(0)+","+v[1].toFixed(0)+"]").join(" "));
  check("C3 rejects 'none of them'", iv.filter(v => 0 >= v[0]).length === 0, "0 would clear " + iv.filter(v => 0 >= v[0]).length + " of 3");

  if (REAL.buriHist) {
    const truth = C_buriTruth();
    check("C4 Buri's number", truth === 58, truth + " of 107 bottles had one colour left at generation 19");
    const r2 = mulberry32(1956), sim = [];
    for (let b = 0; b < 6; b++) { let k = 0;
      for (let i = 0; i < 107; i++) { let p = 0.5; for (let g = 0; g < 19; g++) p = breedFreq(r2, p, 16, 0); if (p === 0 || p === 1) k++; }
      sim.push(k); }
    check("C4 the census misses", mn(sim) < truth - 4,
          "107 simulated bottles of sixteen flies reach " + mn(sim).toFixed(0) + ", his reached " + truth);
  } else check("C4 Buri loaded", false, "buri_fly.json did not arrive");
}

/* ---- D. three routes to a smaller system -------------------------------- */
{
  const set = (route, cfg) => { D.route = route; if (cfg.cv != null) D.cv = cfg.cv;
    if (cfg.males != null) D.males = cfg.males; if (cfg.depth != null) D.depth = cfg.depth;
    if (cfg.dur != null) D.dur = cfg.dur; return D_formula(); };
  const dSpread = set("spread", { cv: 4 }), dLek = set("lek", { males: 2 }), dBust = set("bust", { depth: 2, dur: 3 });
  check("D1 spread route reaches 10", dSpread <= 10, "cv 4 -> " + dSpread.toFixed(1));
  check("D1 lek route reaches 10", dLek <= 10, "2 breeding males -> " + dLek.toFixed(1));
  check("D1 bust route reaches 10", dBust <= 10, "crash to 2 for 3 of every 10 -> " + dBust.toFixed(1));
  check("D1 not cleared at the default", (set("spread", { cv: 0 }) > 10) && (set("lek", { males: 50 }) > 10)
        && (set("bust", { depth: 100, dur: 0 }) > 10), "every route starts above the bar");

  // the arithmetic against the simulator, which is the claim the stage makes
  const rng = mulberry32(555), rows = [];
  for (const [route, cfg] of [["spread", { cv: 2 }], ["lek", { males: 5 }], ["bust", { depth: 10, dur: 1, sizes: null }]]) {
    if (route === "bust") { cfg.sizes = []; for (let t = 0; t < 10; t++) cfg.sizes.push(t < 1 ? 10 : 100); }
    const b = D_batch(rng, route, cfg, 40);
    D.route = route; if (cfg.cv != null) D.cv = cfg.cv; if (cfg.males != null) D.males = cfg.males;
    if (route === "bust") { D.depth = 10; D.dur = 1; }
    const f = D_formula(route);
    rows.push([route, b.ne, f, Math.abs(b.ne - f) / f]);
  }
  check("D arithmetic matches the simulator", rows.every(r => r[3] < 0.22),
        rows.map(r => r[0] + " measured " + r[1].toFixed(1) + " vs " + r[2].toFixed(1)).join("  "));

  D.route = "lek"; D.males = 1;
  const one = D_batch(mulberry32(77), "lek", { males: 1 }, 30).ne;
  const tol = Math.max(2.2, 0.35 * one);
  check("D2 truth", one > 2 && one < 8, "one breeding male out of a hundred drifts like " + one.toFixed(1));
  check("D2 rejects the headcount", Math.abs(100 - one) > tol && Math.abs(50 - one) > tol,
        "100 and 50 both miss a truth of " + one.toFixed(1));

  const rg = mulberry32(808), iv = [];
  for (let n = 0; n < 3; n++) { const r = D.game.round(rg, n); iv.push([r.truth - r.tol, r.truth + r.tol, r.route]); }
  check("D3 rejects the headcount", iv.every(v => 100 > v[1]),
        "rounds: " + iv.map(v => v[2] + " " + v[0].toFixed(0) + "-" + v[1].toFixed(0)).join(", "));
  const lo = Math.max(...iv.map(v=>v[0])), hi = Math.min(...iv.map(v=>v[1]));
  check("D3 no constant clears", lo > hi, "common interval " + (lo > hi ? "empty" : "[" + lo.toFixed(0) + "," + hi.toFixed(0) + "]"));

  if (REAL.wolf) {
    let worst = null;
    for (let y = 1959; y <= 2000; y++) {
      document.getElementById("D_wy").value = String(y);
      const c = D_wolfWindow().map(x => x[1]);
      const hm = acrossGenerations(c), am = mn(c), t = Math.max(1.2, 0.1 * hm);
      if (Math.abs(am - hm) <= t) worst = "at " + y + " the plain average " + am.toFixed(1) + " lands on " + hm.toFixed(1);
    }
    document.getElementById("D_wy").value = "1959";
    const c = D_wolfWindow().map(x => x[1]);
    check("D4 the plain average misses, at every window", worst === null,
          worst || ("1959 on: average " + mn(c).toFixed(1) + ", drifts like " + acrossGenerations(c).toFixed(1)));
  } else check("D4 wolves loaded", false, "isle_royale.json did not arrive");
}

/* ---- E. the slope and the scatter --------------------------------------- */
{
  const rng = mulberry32(2026);
  const at = s => [E_fixCount(rng, 500, s, 40), E_fixCount(rng, 20, s, 40)];
  const win = [], none = at(0), lots = at(0.1);
  for (const s of [0.002, 0.004, 0.006, 0.01, 0.02]) { const [b, sm] = at(s);
    if (b >= 37 && sm >= 16 && sm <= 27) win.push(s); }
  check("E1 gate clearable", win.length >= 3, "cleared at s = " + win.map(v=>v.toFixed(3)).join(", "));
  check("E1 rejects no advantage", !(none[0] >= 37), "s=0 gives " + none[0] + "/40 in the big pond");
  check("E1 rejects a huge advantage", !(lots[1] >= 16 && lots[1] <= 27), "s=0.1 gives " + lots[1] + "/40 in the small pond");
  const e2 = []; for (let r = 0; r < 6; r++) e2.push(E_fixCount(rng, 20, 0.06, 40));
  check("E2 gate clearable", e2.filter(v => v >= 33).length >= 5,
        "s=0.06 in the pond of twenty: " + e2.join("/") + " of 40, bar is 33");
  const e2b = []; for (let r = 0; r < 6; r++) e2b.push(E_fixCount(rng, 20, 0.02, 40));
  check("E2 needs more than E1's answer", e2b.filter(v => v >= 33).length === 0,
        "the E1 answer (s=0.02) gives " + e2b.join("/") + ", none of them 33");

  const e3 = []; for (let r = 0; r < 8; r++) e3.push(E_fixCount(rng, 20, 0.02, 40));
  const t3 = mn(e3);
  check("E3 truth", t3 > 22 && t3 < 34, "a 2% advantage in a pond of twenty wins " + t3.toFixed(1) + " of 40");
  check("E3 rejects 'it always wins'", Math.abs(40 - t3) > 5, "40 of 40 is " + (Math.abs(40-t3)/5).toFixed(1) + " tolerances out");

  const rg = mulberry32(1234), iv = [];
  for (let n = 0; n < 3; n++) { const r = E.game.round(rg, n); iv.push([r.truth - r.tol, r.truth + r.tol, r.N, r.s]); }
  const lo = Math.max(...iv.map(v=>v[0])), hi = Math.min(...iv.map(v=>v[1]));
  check("E4 no constant clears", lo > hi,
        "rounds: " + iv.map(v => "N=" + v[2] + " s=" + v[3].toFixed(3) + " [" + v[0].toFixed(0) + "," + v[1].toFixed(0) + "]").join("  "));
  check("E4 rejects 'the advantage always wins'", iv.filter(v => 40 >= v[0] && 40 <= v[1]).length <= 1,
        "40 clears " + iv.filter(v => 40 >= v[0] && 40 <= v[1]).length + " of 3 rounds");

  if (REAL.ltee) {
    document.getElementById("E_lg").value = "50000"; E_drawLtee();
    const spread = E.lteeSpread, se = E.lteeSe, tol = Math.max(0.03, 0.25 * spread);
    check("E5 the fan is real", spread > se + tol,
          "spread " + spread.toFixed(3) + " against a repeat-measurement bar of " + se.toFixed(3));
    document.getElementById("E_lg").value = "0"; E_drawLtee();
    check("E5 they start as one clone", E.lteeSpread < 0.05,
          "at generation 0 the twelve are spread " + E.lteeSpread.toFixed(3));
    document.getElementById("E_lg").value = "50000"; E_drawLtee();
  } else check("E5 the long-term lines loaded", false, "ltee_fitness_summary.json did not arrive");
}

say(bad ? ("FAILED " + bad) : "ALL BARS PASS");
L.join(" ;; ");
`;

const probe = `<!doctype html><meta charset="utf-8"><title>pending</title>
<iframe id="f" src="http://127.0.0.1:${PORT}/app/lessons/lesson10.html?preview=1" width="1500" height="1000"></iframe>
<script>
const SRC = ${JSON.stringify(INNER)};
document.getElementById("f").addEventListener("load", () => setTimeout(() => {
  const w = document.getElementById("f").contentWindow;
  try { document.title = String(w.eval(SRC)); }
  catch (e) { document.title = "THREW " + e.message + " @ " + (e.stack||"").split("\\n")[1]; }
}, 4000));
</script>`;

const probePath = path.join(ROOT, "_check_l10.html");
fs.writeFileSync(probePath, probe);
const server = spawn("python3", ["-m", "http.server", String(PORT), "--directory", ROOT],
                     { stdio: "ignore", detached: true });
const cleanup = () => { try { process.kill(-server.pid); } catch (e) {} try { fs.unlinkSync(probePath); } catch (e) {} };
process.on("exit", cleanup);

setTimeout(() => {
  const r = spawnSync(CHROME, ["--headless=new", "--disable-gpu", "--virtual-time-budget=600000",
                               "--dump-dom", `http://127.0.0.1:${PORT}/_check_l10.html`],
                      { encoding: "utf8", maxBuffer: 1 << 28 });
  const m = /<title>([\s\S]*?)<\/title>/.exec(r.stdout || "");
  if (!m) { console.error("no result -- is Chrome at " + CHROME + " ?"); cleanup(); process.exit(2); }
  const text = m[1].replace(/&quot;/g, '"').replace(/&gt;/g, ">").replace(/&lt;/g, "<").replace(/&amp;/g, "&");
  for (const linefeed of text.split(" ;; ")) console.log(linefeed);
  cleanup();
  process.exit(/ALL BARS PASS/.test(text) ? 0 : 1);
}, 1800);
