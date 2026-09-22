#!/usr/bin/env node
/*
 * check_lesson11_numbers.js -- the bar checks for app/lessons/lesson11.html.
 *
 * Lesson 11 is four stochastic round games. None of their bars can be seen
 * by opening the page, and three things have to be true of every one:
 *
 *   1. it is clearable by a student doing the intended thing;
 *   2. it is NOT clearable by the naive answer -- leaving the sliders where
 *      they opened, or killing the herd to drive F up;
 *   3. no single constant answer clears the game.
 *
 * It drives the shipped page rather than a copy of its arithmetic: the
 * checks run inside a same-origin iframe against the page's own functions.
 *
 * The report comes back in a <pre>, never document.title -- Chrome caps the
 * title and a capped report silently drops checks while still printing a
 * clean summary. The runner fails if the count that ran does not match the
 * count that came back.
 *
 * Usage:  node scripts/check_lesson11_numbers.js
 * Exit 0 iff every bar passes. Needs Google Chrome and python3.
 */
const { spawn, spawnSync } = require("child_process");
const fs = require("fs"), path = require("path");

const ROOT = path.resolve(__dirname, "..");
const PORT = 8792;
const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

const INNER = `
const L=[], say=s=>L.push(s);
let bad = 0, ran = 0;
const check = (name, ok, detail) => { ran++; if (!ok) bad++; say((ok?"ok   ":"FAIL ") + name + "  " + detail); };
const mn = a => a.reduce((x,y)=>x+y,0)/a.length;
const sdv = a => { const m = mn(a); return Math.sqrt(a.reduce((x,y)=>x+(y-m)*(y-m),0)/Math.max(1,a.length-1)); };

check("page loaded", !!(A && B && C && D && typeof Score !== "undefined"),
      "every stage object and Score are defined");
check("slots declared match slots written", Object.keys(BIT).length === 4,
      Object.keys(BIT).length + " named bits, scaffold is 4");

/* ---- A. the knob, and what it does to F -------------------------------- */
{
  const Fat = (f, reps) => { const v = [];
    for (let r = 0; r < reps; r++) { A.f = f; A.p0 = 0.5; A.serial = r*17 + Math.round(f*100); A_fresh();
      for (let g = 0; g < 15; g++) pondStep(A.rng, A.pond, f);
      v.push(A_stats()); }
    return v; };
  const sweep = [0, 0.2, 0.4, 0.6, 0.8, 1.0].map(f => [f, Fat(f, 5)]);
  const means = sweep.map(s => mn(s[1].map(q => q.F)));
  let mono = true;
  for (let i = 1; i < means.length; i++) if (means[i] < means[i-1] - 0.02) mono = false;
  check("A the knob runs one way", mono,
        "F after 15 generations: " + means.map(v => v.toFixed(2)).join(" -> "));
  check("A the knob is worth having", means[means.length-1] - means[0] > 0.6,
        "f = 0 lands " + means[0].toFixed(2) + " and f = 1 lands " + means[means.length-1].toFixed(2));

  /* Inbreeding rearranges the genotypes; it does not push the allele. */
  const flat = Fat(0.8, 8);
  const drift = mn(flat.map(q => q.p - 0.5)), spread = sdv(flat.map(q => q.p));
  check("A inbreeding does not push the allele frequency", Math.abs(drift) < 2 * spread / Math.sqrt(8),
        "at f = 0.8 the dark allele sits " + (drift >= 0 ? "+" : "") + drift.toFixed(3) +
        " from where it started (spread " + spread.toFixed(3) + "), while F climbs to " +
        mn(flat.map(q => q.F)).toFixed(2));

  const hit = (target, f, reps) => Fat(f, reps).filter(q => Math.abs(q.F - target) <= A_TOL).length / reps;
  const reach = A_TARGETS.map(t => {
    let best = 0, bf = 0;
    for (let f = 0; f <= 1.0001; f += 0.05) { const h = hit(t, Math.round(f*20)/20, 4); if (h > best) { best = h; bf = f; } }
    return [t, best, bf];
  });
  check("A every target is reachable", reach.every(r => r[1] >= 0.5),
        reach.map(r => r[0].toFixed(2) + "@f" + r[2].toFixed(2) + ":" + (100*r[1]).toFixed(0) + "%").join("  "));
  const byDefault = A_TARGETS.filter(t => hit(t, 0, 8) >= 0.4);
  check("A the default setting is not an answer", byDefault.length === 0,
        "f = 0 lands " + byDefault.length + " of the " + A_TARGETS.length +
        " targets" + (byDefault.length ? " (" + byDefault.map(v => v.toFixed(2)).join(", ") + ")" : "") +
        ", and F there is " + mn(Fat(0, 8).map(q => q.F)).toFixed(2) +
        " ± " + sdv(Fat(0, 8).map(q => q.F)).toFixed(2));
}

/* ---- B. where the herd sits, and what that costs the gene -------------- */
{
  const run = (b, d, bad, seed) => { const rng = mulberry32(seed);
    const N = B_herd(b, d, bad, rng), H = B_het(N, 60, rng);
    return { F: 1 - H[H.length-1]/H[0], end: N[N.length-1], low: Math.min.apply(null, N) }; };
  const many = (b, d, bad, reps) => { const o = [];
    for (let r = 0; r < reps; r++) o.push(run(b, d, bad, 900 + r*7919)); return o; };

  /* N* = K(1 - d/b) is the claim the stage rests on. */
  const pairs = [[0.50,0.10],[0.40,0.25],[0.35,0.28],[0.30,0.27]];
  const sits = pairs.map(([b,d]) => {
    const pred = B_CAP * (1 - d/b), got = mn(many(b, d, 0, 4).map(q => q.end));
    return [pred, got, Math.abs(got - pred) / pred];
  });
  check("B the herd sits where the birth and death rates put it",
        sits.every(s => s[2] < 0.25),
        sits.map(s => "N*" + s[0].toFixed(0) + "->" + s[1].toFixed(0)).join("  ") +
        "  (K(1-d/b), measured against the herd at year " + B_YEARS + ")");

  const legal = q => q.end >= B_FLOOR;
  const rate = (b, d, bad, target, reps) =>
    many(b, d, bad, reps).filter(q => legal(q) && Math.abs(q.F - target) <= B_TOL).length / reps;
  const grid = [];
  for (const bd of [0, 0.15, 0.30, 0.45])
    for (const [b,d] of [[0.50,0.10],[0.45,0.20],[0.40,0.25],[0.35,0.28],[0.30,0.27],[0.30,0.285]])
      grid.push([b, d, bd]);
  const reach = B_TARGETS.map(t => {
    let best = 0, at = null;
    for (const g of grid) { const h = rate(g[0], g[1], g[2], t, 4); if (h > best) { best = h; at = g; } }
    return [t, best, at];
  });
  check("B every target is reachable with the herd still alive", reach.every(r => r[1] >= 0.5),
        reach.map(r => r[0].toFixed(2) + ":" + (100*r[1]).toFixed(0) + "%").join("  "));

  /* The naive route -- crash it to nothing -- must not be an answer. */
  const wiped = many(0.30, 0.285, 0.45, 5);
  check("B killing the herd is not a way to hit the target",
        wiped.every(q => !legal(q)),
        "the hardest crash leaves " + wiped.map(q => q.end).join("/") +
        " moose against a floor of " + B_FLOOR + ", so its F of " +
        mn(wiped.map(q => q.F)).toFixed(2) + " never counts");

  /* Two different routes to the same F -- the stage's silent point. SEARCHED
     for, not asserted: an earlier version of this check named a pair of
     settings and they turned out to land 0.20 and 0.12. */
  const legalSettings = grid.map(g => {
    const rs = many(g[0], g[1], g[2], 3).filter(legal);
    return rs.length === 3 ? { g, F: mn(rs.map(q => q.F)), N: mn(rs.map(q => q.end)) } : null;
  }).filter(Boolean);
  let twin = null;
  for (let i = 0; i < legalSettings.length && !twin; i++)
    for (let j = i + 1; j < legalSettings.length && !twin; j++) {
      const a = legalSettings[i], b = legalSettings[j];
      if (Math.abs(a.F - b.F) <= B_TOL && Math.max(a.N, b.N) >= 2 * Math.min(a.N, b.N)
          && Math.abs(a.g[2] - b.g[2]) >= 0.15) twin = [a, b];
    }
  check("B two different herds reach the same F", !!twin,
        twin ? ("a herd of " + twin[0].N.toFixed(0) + " with bad years biting " +
                twin[0].g[2].toFixed(2) + " lands F " + twin[0].F.toFixed(2) +
                "; a herd of " + twin[1].N.toFixed(0) + " biting " + twin[1].g[2].toFixed(2) +
                " lands " + twin[1].F.toFixed(2))
             : "no two legal settings with different herd sizes land the same F");

  check("B the default setting is not an answer",
        B_TARGETS.filter(t => rate(0.30, 0.28, 0, t, 5) >= 0.5).length <= 1,
        "the setting the stage opens on lands " +
        B_TARGETS.filter(t => rate(0.30, 0.28, 0, t, 5) >= 0.5).length + " of " +
        B_TARGETS.length + " targets");
}

/* ---- C. the tree, the founders, and one drop -------------------------- */
{
  /* The knob is a RULE, and one tree built under it is a draw. So this
     averages several trees per setting: a single tree can and does wobble by
     0.05 between adjacent settings, which is a property of pedigrees that
     small, not of the rule. The spread is reported alongside. */
  const pedAt = (k, seeds) => { const v = [];
    for (let q = 0; q < seeds; q++) {
      C.inb = k;
      C.ped = C_makePed(mulberry32(4000 + q * 7919 + Math.round(k * 10)), k);
      v.push(C_pedF(C.ped));
    }
    return v; };
  const ks = [0, 0.2, 0.4, 0.6, 0.8, 1.0];
  const runs = ks.map(k => pedAt(k, 6)), pf = runs.map(mn);
  let mono = true;
  for (let i = 1; i < pf.length; i++) if (pf[i] < pf[i-1] - 0.015) mono = false;
  check("C the inbreeding knob runs one way", mono,
        "the tree's own inbreeding, 6 trees per setting: " +
        pf.map((v, i) => v.toFixed(2) + "±" + sdv(runs[i]).toFixed(2)).join(" -> "));
  C_rebuild();
  check("C the inbreeding knob is worth having", pf[pf.length-1] - pf[0] > 0.2,
        "knob 0 builds a tree at " + pf[0].toFixed(2) + ", knob 1 at " + pf[pf.length-1].toFixed(2));

  const setPool = (ncol, nhet) => {
    for (let i = 0; i < 8; i++) C.founders[i] = i < nhet ? [i%ncol, (i+1)%ncol] : [i%ncol, i%ncol];
  };
  /* One drop is not the number. If it were, C_DROPS would be waste. */
  C.inb = 0; C_rebuild(); setPool(4, 4);
  const one = []; for (let r = 0; r < 20; r++) { C.serial = r*31; C_drop(); one.push(C_bottomStats().het); }
  check("C one drop is not the number", sdv(one) > C_TOL,
        "the same tree and the same founders give " + mn(one).toFixed(1) + " ± " + sdv(one).toFixed(1) +
        " two-tone birds over 20 drops, against a tolerance of " + C_TOL +
        " -- which is why the verdict is taken on " + C_DROPS + " of them");
  const avgs = []; for (let q = 0; q < 8; q++) { C.serial = q*137; avgs.push(C_dropMany()); }
  check("C averaging the drops makes the tolerance mean something", sdv(avgs) < C_TOL,
        "the " + C_DROPS + "-drop average repeats to ± " + sdv(avgs).toFixed(2));

  const closest = target => { let best = null;
    for (const k of [0, 0.3, 0.6, 1.0]) { C.inb = k; C_rebuild();
      for (const ncol of [1,2,3,4]) for (let nhet = 0; nhet <= 8; nhet++) {
        setPool(ncol, nhet); C.serial = nhet*13 + ncol*7;
        const a = C_dropMany();
        if (!best || Math.abs(a-target) < Math.abs(best.a-target)) best = { a, k, ncol, nhet };
      } }
    return best; };
  const reach = C_TARGETS.map(t => [t, closest(t)]);
  check("C every target is reachable", reach.every(r => Math.abs(r[1].a - r[0]) <= C_TOL),
        reach.map(r => r[0] + "->" + r[1].a.toFixed(1)).join("  ") + "  (of " + C.ped.bottom.length + ")");
  check("C the founders matter more than the knob",
        (function () {
          C.inb = 0.5; C_rebuild();
          setPool(1, 0); C.serial = 5; const lo = C_dropMany();
          setPool(4, 8); C.serial = 5; const hi = C_dropMany();
          C.inb = 0; C_rebuild(); setPool(4, 8); C.serial = 5; const k0 = C_dropMany();
          C.inb = 1; C_rebuild(); setPool(4, 8); C.serial = 5; const k1 = C_dropMany();
          say("     (founder pool spans " + lo.toFixed(1) + "-" + hi.toFixed(1) +
              ", the knob spans " + k1.toFixed(1) + "-" + k0.toFixed(1) + ")");
          return (hi - lo) > Math.abs(k0 - k1);
        })(), "the colours in the founder pool move the bottom row further than the mating rule does");
}

/* ---- D. draw the curve, then run it ------------------------------------ */
{
  const bestFor = (n, f, seed) => { D.serial = seed; const tr = D_truth(n, f);
    let bg = 9, be = 0.3, bb = 1;
    for (let e = 0; e <= 95; e += 1) for (let bd = 3; bd <= 60; bd += 1) {
      D.end = e/100; D.bend = bd/20; const g = D_gap(D_mine(), tr);
      if (g < bg) { bg = g; be = e/100; bb = bd/20; } }
    D.end = be; D.bend = bb; return D_mine(); };
  const scored = (mine, n, f, reps) => { const o = [];
    for (let r = 0; r < reps; r++) { D.serial = 100 + r*37; o.push(D_gap(mine, D_truth(n, f))); }
    return o; };
  const per = D_DEALS.map(([n,f]) => {
    const g = scored(bestFor(n, f, 1), n, f, 4);
    return [n, f, g.filter(v => v <= D_TOL).length / 4];
  });
  check("D every deal is drawable", per.every(p => p[2] >= 0.75),
        per.map(p => "n" + p[0] + "/f" + p[1].toFixed(1) + ":" + (100*p[2]).toFixed(0) + "%").join("  ") +
        "  (a curve fitted to one run, judged on fresh ones)");

  /* No one setting may clear the game. */
  let greedy = 0, gp = "";
  for (let e = 0; e <= 95; e += 5) for (let bd = 3; bd <= 60; bd += 4) {
    D.end = e/100; D.bend = bd/20; const m = D_mine();
    let cleared = 0;
    for (const [n,f] of D_DEALS) {
      let hit = 0;
      for (let r = 0; r < 3; r++) { D.serial = 700 + r*37; if (D_gap(m, D_truth(n, f)) <= D_TOL) hit++; }
      if (hit >= 2) cleared++;
    }
    if (cleared > greedy) { greedy = cleared; gp = "end " + (e/100).toFixed(2) + ", bend " + (bd/20).toFixed(2); }
  }
  check("D no one curve clears the game", greedy <= 1,
        "the greediest constant answer (" + gp + ") clears " + greedy + " of " +
        D_DEALS.length + " deals; three of five is a pass");
  D.end = 0.30; D.bend = 1;
  const dflt = D_mine();
  let dc = 0;
  for (const [n,f] of D_DEALS) { const g = scored(dflt, n, f, 3);
    if (g.filter(v => v <= D_TOL).length >= 2) dc++; }
  check("D the default curve is not an answer", dc === 0,
        "leaving both sliders alone clears " + dc + " of " + D_DEALS.length + " settings");

  /* Each setting is dealt more than once, so the first sight of it teaches
     and the second tests, and never twice running. */
  const seen = D_ORDER.map(k => (k + D_ROT) % D_DEALS.length);
  const counts = D_DEALS.map((_, k) => seen.filter(v => v === k).length);
  let adjacent = false;
  for (let i = 1; i < seen.length; i++) if (seen[i] === seen[i-1]) adjacent = true;
  check("D each setting is dealt twice and never twice running",
        counts.filter(c => c >= 2).length >= 2 && !adjacent,
        "the five rounds deal settings " + seen.join(",") + " -- counts " + counts.join("/"));
}

say(bad ? ("FAILED " + bad) : "ALL BARS PASS");
say("RAN " + ran);
L.join(" ;; ");
`;

const probe = `<!doctype html><meta charset="utf-8"><title>pending</title>
<iframe id="f" src="http://127.0.0.1:${PORT}/app/lessons/lesson11.html?preview=1" width="1500" height="1000"></iframe>
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
}, 4000));
</script>`;

const probePath = path.join(ROOT, "_check_l11.html");
fs.writeFileSync(probePath, probe);
const server = spawn("python3", ["-m", "http.server", String(PORT), "--directory", ROOT],
                     { stdio: "ignore", detached: true });
const cleanup = () => { try { process.kill(-server.pid); } catch (e) {} try { fs.unlinkSync(probePath); } catch (e) {} };
process.on("exit", cleanup);

setTimeout(() => {
  const r = spawnSync(CHROME, ["--headless=new", "--disable-gpu", "--virtual-time-budget=900000",
                               "--dump-dom", `http://127.0.0.1:${PORT}/_check_l11.html`],
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
