#!/usr/bin/env node
/*
 * check_lesson10_numbers.js -- the bar checks for app/lessons/lesson10.html.
 *
 * WHAT THIS IS FOR. Lesson 10 is a stochastic simulator whose gates are
 * "get this number under X" and whose closing games judge a locked estimate
 * against a tolerance. Three things have to be true of every one of those
 * bars, and none of them is visible by opening the page:
 *
 *   1. it is clearable at all, by a student doing the intended thing;
 *   2. it is NOT clearable by the naive answer -- the headcount, "it is an
 *      ancestor of everyone", q-squared, "the same duration" -- because a bar
 *      that the misconception clears teaches the misconception;
 *   3. the truth it is judged against sits inside its own band relative to the
 *      six re-runs the student is shown.
 *
 * It drives the shipped page rather than a copy of its arithmetic: the checks
 * run inside a same-origin iframe against the page's own functions, so a bar
 * cannot pass here and fail in the browser.
 *
 * Usage:  node scripts/check_lesson10_numbers.js
 * Exit 0 iff every bar passes. Needs Google Chrome and python3.
 */
const { spawn, spawnSync } = require("child_process");
const fs = require("fs"), path = require("path"), os = require("os");

const ROOT = path.resolve(__dirname, "..");
const PORT = 8791;
const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

const INNER = `
const L=[], say=s=>L.push(s);
let bad = 0;
const check = (name, ok, detail) => { if (!ok) bad++; say((ok?"ok   ":"FAIL ") + name + "  " + detail); };

/* ---- 1. the gates are clearable, and only by the intended move ---------- */
{ const best = [];
  for (const cv of [1.5, 2.6]) { A.N = 100; A.cv = cv; A.sel = false; A_fresh();
    for (let i = 0; i < 25; i++) A_step(); best.push(A.best); }
  check("A2 gate", best[1] < 0.55 && best[0] >= 0.55,
        "spread 2.6 -> " + (100*best[1]).toFixed(0) + "%, spread 1.5 -> " + (100*best[0]).toFixed(0) + "% (bar 55%)"); }
{ const hi = [], lo = [];
  for (let r = 0; r < 6; r++) { C.rng = mulberry32(900 + r * 77);
    const b = []; for (let k = 0; k < 5; k++) b.push(C_build(C.rng, 20, 1, 8, 0.1).evenPond);
    lo.push(mean(b));
    const b2 = []; for (let k = 0; k < 5; k++) b2.push(C_build(C.rng, 40, 0, 8, 0.1).evenPond);
    hi.push(mean(b2)); }
  check("C1 gate", Math.max(...lo) <= 18 && Math.min(...hi) > 18,
        "closest-kin at 20 -> " + mean(lo).toFixed(1) + ", random pairing at 40 -> " + mean(hi).toFixed(1) + " (bar 18)"); }
check("D1 gate", 4*2*50/52 <= 10, "two males of a hundred birds -> " + (4*2*50/52).toFixed(1) + " (bar 10)");
{ const t = E_trial(mulberry32(31337), 3, 20);
  check("E1 gate", t.netV > t.massV,
        "three netted larvae " + t.netV.toFixed(3) + " vs two hundred siblings " + t.massV.toFixed(3)); }
{ const ne = p => { const n=[]; for(let t=0;t<20;t++) n.push(reallyInTheGame(F_weights(mulberry32(88+t*13), p[0], p[1])));
                    return acrossGenerations(n); };
  check("F1 gate", ne([2,2]) <= 25 && ne([0.3,0]) >= 170,
        "both spreads at 2 -> " + ne([2,2]).toFixed(0) + ", between only at 0.3 -> " + ne([0.3,0]).toFixed(0)); }

/* ---- 2. no game's naive answer lands, over many dealt rounds ------------ */
const naiveFor = {
  A: r => parseInt((r.prompt.match(/pond of <b>(\\d+)<\\/b>/)||[0,"0"])[1],10),
  B: () => 100,
  C: r => r.start,
  D: r => parseInt((r.prompt.match(/lasting <b>(\\d+)<\\/b>/)||[0,"1"])[1],10),
  E: () => 60,
  F: () => 200
};
const naiveName = { A:"the headcount", B:"\\"ancestor of everyone\\"", C:"q-squared",
                    D:"the same duration", E:"a big net", F:"the headcount" };
for (const [id, game] of [["A",A.game],["B",B.game],["C",C.game],["D",D.game],["E",E.game],["F",F.game]]) {
  let leaks = 0, inBand = 0, withDots = 0;
  for (let n = 0; n < 8; n++) {
    const r = game.round(mulberry32(31000 + n*7919 + id.charCodeAt(0)), n);
    if (Math.abs(naiveFor[id](r) - r.truth) <= r.tol) leaks++;
    if (r.values) { withDots++; inBand += r.values.filter(v => Math.abs(v - r.truth) <= r.tol).length / r.values.length; }
  }
  check(id + " game vs " + naiveName[id], leaks === 0, leaks + " of 8 rounds let it land");
  if (withDots) check(id + " truth inside its own band", inBand / withDots >= 0.5,
                      (100*inBand/withDots).toFixed(0) + "% of re-runs land in the band");
}
/* ---- 3. the three real-data panels ------------------------------------- */
check("real data loaded", !!(REAL.buri && REAL.buriHist && REAL.sheep && REAL.wolf),
      "buri=" + !!REAL.buri + " pedigree=" + !!REAL.sheep + " wolves=" + !!REAL.wolf);
if (REAL.buri && REAL.sheep && REAL.wolf) {
  { const fit = obs => { let best = 2, bs = Infinity;
      for (let ne = 2; ne <= 30; ne += 0.1) { let s = 0;
        for (const [t, v] of obs) { const d = v - 0.25 * (1 - Math.pow(1 - 1/(2*ne), t)); s += d*d; }
        if (s < bs) { bs = s; best = ne; } } return best; };
    const truth = fit(REAL.buri.filter(r => r.generation > 0).map(r => [r.generation, r.var_p]));
    const rng = mulberry32(20260917), vals = [];
    for (let r = 0; r < 6; r++) { const runs = buriSim(rng, truth, 19, 107);
      vals.push(fit(Array.from({length:19}, (_, k) => [k+1, buriVar(runs, k+1)]))); }
    const tol = Math.max(1.2, 2 * sd(vals));
    check("Buri vs the census count", Math.abs(16 - truth) > tol,
          "107 bottles of 16 flies drifted like " + truth.toFixed(1) + " +/- " + tol.toFixed(1)); }
  { const vals = []; for (let r = 0; r < 6; r++) vals.push(sheepRun(mulberry32(4400 + r*971), 120).equiv);
    const t = mean(vals), tol = Math.max(2, 2.5 * sd(vals));
    const one = sheepRun(mulberry32(12345), 200);
    check("bighorn vs 'all the founders'", Math.abs(one.elig.length - t) > tol,
          one.elig.length + " founders had the chance, " + one.gone + " have nothing left, equivalent of " +
          t.toFixed(1) + " +/- " + tol.toFixed(1)); }
  { let worst = null;
    for (let from = 1959; from <= 1995; from += 4) {
      D.from = from; const ns = wolfWindow().map(x => x[1]);
      const am = mean(ns), hm = ns.length / ns.reduce((s, n) => s + 1/n, 0), tol = Math.max(1.2, 0.1*hm);
      if (ns.length < 15) { worst = "window from " + from + " too short to lock"; break; }
      if (Math.abs(am - hm) <= tol) { worst = "the plain average lands from " + from; break; }
    }
    D.from = 1959;
    check("Isle Royale vs the plain average", worst === null,
          worst || "every window the slider reaches separates the two"); }
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
  catch (e) { document.title = "THREW " + e.message; }
}, 2500));
</script>`;

const probePath = path.join(ROOT, "_check_l10.html");
fs.writeFileSync(probePath, probe);
const server = spawn("python3", ["-m", "http.server", String(PORT), "--directory", ROOT],
                     { stdio: "ignore", detached: true });
const cleanup = () => { try { process.kill(-server.pid); } catch (e) {} try { fs.unlinkSync(probePath); } catch (e) {} };
process.on("exit", cleanup);

setTimeout(() => {
  const r = spawnSync(CHROME, ["--headless=new", "--disable-gpu", "--virtual-time-budget=300000",
                               "--dump-dom", `http://127.0.0.1:${PORT}/_check_l10.html`],
                      { encoding: "utf8", maxBuffer: 1 << 28 });
  const m = /<title>([\s\S]*?)<\/title>/.exec(r.stdout || "");
  if (!m) { console.error("no result -- is Chrome at " + CHROME + " ?"); cleanup(); process.exit(2); }
  const text = m[1].replace(/&quot;/g, '"').replace(/&gt;/g, ">").replace(/&lt;/g, "<").replace(/&amp;/g, "&");
  for (const linefeed of text.split(" ;; ")) console.log(linefeed);
  cleanup();
  process.exit(/ALL BARS PASS/.test(text) ? 0 : 1);
}, 1800);
