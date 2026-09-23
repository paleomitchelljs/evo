#!/usr/bin/env node
/*
 * check_lesson11_numbers.js -- the bar checks for app/lessons/lesson11.html.
 *
 * Lesson 11 is five stochastic round games. None of their bars can be seen
 * by opening the page, and three things have to be true of every one:
 *
 *   1. it is clearable by a student doing the intended thing;
 *   2. it is NOT clearable by the naive answer -- leaving the sliders where
 *      they opened, or or matching a curve's end with the wrong cause;
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

check("page loaded", !!(A && B && C && D && E && typeof Score !== "undefined"),
      "every stage object and Score are defined");
check("slots declared match slots written", Object.keys(BIT).length === 5,
      Object.keys(BIT).length + " named bits, scaffold is 5");

/* ---- A. the slider, and what it does to F -------------------------------- */
{
  const Fat = (f, reps) => { const v = [];
    for (let r = 0; r < reps; r++) { A.f = f; A.p0 = 0.5; A.serial = r*17 + Math.round(f*100); A_fresh();
      for (let g = 0; g < 15; g++) popStep(A.rng, A.pop, f);
      v.push(A_stats()); }
    return v; };
  /* 12 runs a setting: at 5, one page load in a few swapped f = 0 and
     f = 0.2 (0.06 against 0.02), because every load reseeds the page and
     F at the low end moves by about 0.03 from run to run. */
  const sweep = [0, 0.2, 0.4, 0.6, 0.8, 1.0].map(f => [f, Fat(f, 12)]);
  const means = sweep.map(s => mn(s[1].map(q => q.F)));
  let mono = true;
  for (let i = 1; i < means.length; i++) if (means[i] < means[i-1] - 0.02) mono = false;
  check("A the slider runs one way", mono,
        "F after 15 generations: " + means.map(v => v.toFixed(2)).join(" -> "));
  check("A the slider is worth having", means[means.length-1] - means[0] > 0.6,
        "f = 0 gives " + means[0].toFixed(2) + " and f = 1 gives " + means[means.length-1].toFixed(2));

  /* Inbreeding rearranges the genotypes; it does not push the allele. It
     does shrink the population in the gene's eyes, so the frequency drifts
     MORE from run to run -- the test is on the mean, over enough runs that
     a 3-SE band is not tripped by the drift itself. It was 8 runs at 2 SE
     until 2026-09-22 and failed on fixed seeds: -0.063 against 0.057. */
  const NR = 30, flat = Fat(0.8, NR);
  const drift = mn(flat.map(q => q.p - 0.5)), spread = sdv(flat.map(q => q.p));
  check("A inbreeding does not push the allele frequency", Math.abs(drift) < 3 * spread / Math.sqrt(NR),
        "at f = 0.8 the purple allele sits " + (drift >= 0 ? "+" : "") + drift.toFixed(3) +
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
  const pickA = dealDistinct("l11Ar", A_TARGETS), dealtA = [0, 1, 2, 3, 4].map(pickA);
  check("A five different targets", new Set(dealtA).size === 5, "the five rounds deal F " + dealtA.map(v => v.toFixed(2)).join(", "));
  const byDefault = A_TARGETS.filter(t => hit(t, 0, 8) >= 0.4);
  check("A the default setting is not an answer", byDefault.length === 0,
        "f = 0 hits " + byDefault.length + " of the " + A_TARGETS.length +
        " targets" + (byDefault.length ? " (" + byDefault.map(v => v.toFixed(2)).join(", ") + ")" : "") +
        ", and F there is " + mn(Fat(0, 8).map(q => q.F)).toFixed(2) +
        " ± " + sdv(Fat(0, 8).map(q => q.F)).toFixed(2));
}

/* ---- B. draw the headcount, and F follows --------------------------------
   Rebuilt 2026-09-23. The student draws how many breed each generation and
   matches an F curve. What has to hold, none of it visible on the page:
     - every target is hit at its own hidden headcount, on fresh runs;
     - the opening line (flat at B_START) hits none of them;
     - the targets are far enough apart that no drawn headcount clears two;
     - the tolerance covers one run's own wobble;
     - a crash's timing is forgiving and its depth is not -- that is what
       the student has to read off the plot;
     - the brush puts the headcount where the pointer is. */
{
  const runs = (census, reps, seed) => { const o = [];
    for (let r = 0; r < reps; r++) o.push(B_Fcurve(census, mulberry32(seed + r * 7919))); return o; };
  const hitRate = (census, k, reps, seed) => runs(census, reps, seed).filter(F => rmsGap(F, B_targetCurve(k)) <= B_TOL).length / reps;
  const own = B_SHAPES.map((_, k) => hitRate(B_shapeCensus(k), k, 12, 300 + k));
  check("B every target is hit at its own headcount", own.every(h => h >= 0.8),
        own.map((h, k) => "shape " + k + ":" + (100 * h).toFixed(0) + "%").join("  ") + "  (12 fresh runs each)");

  const wob = []; B_SHAPES.forEach((_, k) => runs(B_shapeCensus(k), 12, 900 + k).forEach(F => wob.push(rmsGap(F, B_targetCurve(k)))));
  wob.sort((a, b) => a - b);
  const p90 = wob[Math.floor(0.9 * wob.length)];
  check("B the tolerance covers one run's own wobble", p90 <= B_TOL,
        "90th percentile of one run's gap from its own target: " + p90.toFixed(3) + " against " + B_TOL);

  const flat = new Array(B_G).fill(B_START);
  const open = B_SHAPES.map((_, k) => hitRate(flat, k, 8, 50));
  check("B the opening line is not an answer", open.every(h => h <= 0.125),
        "flat at " + B_START + " hits " + open.map(h => (100 * h).toFixed(0) + "%").join("/") + " of the six targets");

  let minD = 9, minAt = "";
  for (let i = 0; i < B_SHAPES.length; i++) for (let j = i + 1; j < B_SHAPES.length; j++) {
    const d = rmsGap(B_targetCurve(i), B_targetCurve(j)); if (d < minD) { minD = d; minAt = i + "/" + j; } }
  check("B the targets are far apart", minD >= 1.5 * B_TOL,
        "closest two targets (" + minAt + ") sit " + minD.toFixed(3) + " apart, against a tolerance of " + B_TOL);

  /* Searched, not asserted: flat lines, single crashes of every depth,
     length and time, and two-level steps, averaged over four runs each.
     Sixty generations of F have no room for six shapes 0.10 apart, which
     is what would make "clears two" impossible outright; the closest pair
     sits at about 0.085. So the bar is the one that matters to a student:
     no one drawing clears three targets, so none passes the stage, and
     drawings that clear two are rare (measured 0-2 of 1,295 per page). */
  const fam = [];
  for (const n of [8, 12, 15, 20, 25, 30, 40, 50, 60, 75, 90, 110, 130, 150, 180, 220, 250, 350, 500, 1000]) fam.push(new Array(B_G).fill(n));
  for (let at = 2; at < 58; at += 3) for (const to of [3, 4, 5, 6, 8, 10, 12, 15, 20]) for (const len of [1, 2, 3, 4, 6])
    fam.push(Array.from({ length: B_G }, (_, t) => t >= at && t < at + len ? to : 1000));
  for (const sw of [5, 10, 15, 20, 25, 30, 35, 40, 45, 50]) for (const a of [15, 25, 40, 60, 100, 150, 1000]) for (const b of [15, 25, 40, 60, 100, 150, 1000])
    if (a !== b) fam.push(Array.from({ length: B_G }, (_, t) => t < sw ? a : b));
  let most = 0, two = 0;
  fam.forEach((c, i) => {
    const R = runs(c, 4, 7000 + i), avg = R[0].map((_, t) => R.reduce((s, F) => s + F[t], 0) / R.length);
    const n = B_SHAPES.filter((_, k) => rmsGap(avg, B_targetCurve(k)) <= B_TOL).length;
    if (n >= 2) two++;
    most = Math.max(most, n);
  });
  check("B no one headcount clears three targets, and few clear two", most <= 2 && two <= 0.01 * fam.length,
        fam.length + " headcounts searched: the greediest clears " + most + " of " + B_SHAPES.length +
        ", and " + two + " clear two");

  /* The early-crash target: two generations late still counts, half as deep does not. */
  const kE = 2;
  const late2 = Array.from({ length: B_G }, (_, t) => t >= 10 && t < 12 ? 5 : 1000);
  const shallow = Array.from({ length: B_G }, (_, t) => t >= 8 && t < 10 ? 10 : 1000);
  const hL = hitRate(late2, kE, 12, 60), hS = hitRate(shallow, kE, 12, 61);
  check("B a crash's timing is forgiving and its depth is not", hL >= 0.6 && hS <= 0.2,
        "early-crash target: the crash two generations late hits " + (100 * hL).toFixed(0) +
        "%, the crash to 10 instead of 5 hits " + (100 * hS).toFixed(0) + "%");

  /* The brush: a pointer at generation 30, height 10 on the log axis, sets 10 there. */
  const cv = document.getElementById("B_pop"), rc = cv.getBoundingClientRect();
  const W = +cv.dataset.cssW, H = +cv.dataset.cssH, fr = B_frame(W, H, Math.log(B_NMIN), Math.log(B_NMAX));
  const at = (t, n) => ({ clientX: rc.left + fr.x(t + 0.5) * rc.width / W, clientY: rc.top + fr.y(Math.log(n)) * rc.height / H });
  const keep = B.census.slice();
  B.last = null; B_brush(at(30, 10)); B_brush(at(34, 100)); B.last = null;
  const ok = Math.abs(B.census[30] - 10) <= 1 && Math.abs(B.census[34] - 100) <= 3 && B.census[32] > 10 && B.census[32] < 100;
  check("B the brush puts the headcount where the pointer is", ok,
        "pointer at (30, 10) then (34, 100): census " + B.census.slice(30, 35).join(", ") + ", the skipped generations filled in between");
  B.census = keep; B_paint();

  const pick = dealDistinct("l11Br", B_SHAPES.map((_, k) => k)), dealt = [0, 1, 2, 3, 4].map(pick);
  check("B five different targets", new Set(dealt).size === 5, "the five rounds deal shapes " + dealt.join(", "));
}

/* ---- C. the tree, the founders, and one drop -------------------------- */
{
  /* The slider is a RULE, and one tree built under it is a draw. So this
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
  check("C the inbreeding slider runs one way", mono,
        "the tree's own inbreeding, 6 trees per setting: " +
        pf.map((v, i) => v.toFixed(2) + "±" + sdv(runs[i]).toFixed(2)).join(" -> "));
  C_rebuild();
  check("C the inbreeding slider is worth having", pf[pf.length-1] - pf[0] > 0.2,
        "slider at 0 builds a tree at " + pf[0].toFixed(2) + ", at 1 " + pf[pf.length-1].toFixed(2));

  const setPool = (ncol, nhet) => {
    for (let i = 0; i < 8; i++) C.founders[i] = i < nhet ? [i%ncol, (i+1)%ncol] : [i%ncol, i%ncol];
  };
  /* One drop is not the number. If it were, C_DROPS would be waste. */
  C.inb = 0; C_rebuild(); setPool(4, 4);
  const one = []; for (let r = 0; r < 20; r++) { C.serial = r*31; C_drop(); one.push(C_bottomStats().het); }
  check("C one drop is not the number", sdv(one) > C_TOL,
        "the same tree and the same founders give " + mn(one).toFixed(1) + " ± " + sdv(one).toFixed(1) +
        " heterozygotes over 20 drops, against a tolerance of " + C_TOL +
        " -- which is why the verdict is taken on " + C_DROPS + " of them");
  const avgs = []; for (let q = 0; q < 8; q++) { C.serial = q*137; avgs.push(C_dropMany()); }
  check("C averaging the drops makes the tolerance mean something", sdv(avgs) < C_TOL,
        "the " + C_DROPS + "-drop average repeats to ± " + sdv(avgs).toFixed(2));

  /* Two kinds of founder set: colours spread evenly (setPool), and one
     colour made rare -- m of the sixteen founder copies orange, the rest
     blue -- which is how a student gets a bottom row with few
     heterozygotes. The evenly spread sets alone could not reach 5 or 6 on
     some trees (measured 2026-09-23: 7.6 was the floor on one page load). */
  const rarePool = m => { for (let i = 0; i < 8; i++) C.founders[i] = [2*i < m ? 1 : 0, 2*i + 1 < m ? 1 : 0]; };
  const closest = target => { let best = null;
    const tryIt = (a, info) => { if (!best || Math.abs(a-target) < Math.abs(best.a-target)) best = Object.assign({ a }, info); };
    for (const k of [0, 0.3, 0.6, 1.0]) { C.inb = k; C_rebuild();
      for (const ncol of [1,2,3,4]) for (let nhet = 0; nhet <= 8; nhet++) {
        setPool(ncol, nhet); C.serial = nhet*13 + ncol*7; tryIt(C_dropMany(), { k, ncol, nhet });
      }
      for (let m = 1; m <= 8; m++) { rarePool(m); C.serial = 500 + m*13; tryIt(C_dropMany(), { k, rare: m }); }
    }
    return best; };
  const reach = C_TARGETS.map(t => [t, closest(t)]);
  check("C every target is reachable", reach.every(r => Math.abs(r[1].a - r[0]) <= C_TOL),
        reach.map(r => r[0] + "->" + r[1].a.toFixed(1)).join("  ") + "  (of " + C.ped.bottom.length + ")");
  check("C the founders matter more than the slider",
        (function () {
          C.inb = 0.5; C_rebuild();
          setPool(1, 0); C.serial = 5; const lo = C_dropMany();
          setPool(4, 8); C.serial = 5; const hi = C_dropMany();
          C.inb = 0; C_rebuild(); setPool(4, 8); C.serial = 5; const k0 = C_dropMany();
          C.inb = 1; C_rebuild(); setPool(4, 8); C.serial = 5; const k1 = C_dropMany();
          say("     (founder pool spans " + lo.toFixed(1) + "-" + hi.toFixed(1) +
              ", the slider spans " + k1.toFixed(1) + "-" + k0.toFixed(1) + ")");
          return (hi - lo) > Math.abs(k0 - k1);
        })(), "the colours in the founder pool move the bottom row further than the mating rule does");
  const pick = dealDistinct("l11Cr", C_TARGETS), dealt = [0, 1, 2, 3, 4].map(pick);
  check("C five different targets", new Set(dealt).size === 5, "the five rounds deal " + dealt.join(", "));
  /* Homozygous founders: every founder two copies of one colour, each colour on two founders. */
  C.serial = 11; C_homoFounders();
  const cnt = [0, 0, 0, 0]; for (const [x, y] of C.founders) { cnt[x]++; cnt[y]++; }
  check("C homozygous founders are homozygous, every colour a quarter",
        C.founders.every(([x, y]) => x === y) && cnt.every(c => c === 4),
        "founders " + C.founders.map(q => q.join("")).join(" ") + "; copies per colour " + cnt.join("/"));
  C_randomFounders();
}

/* ---- D. two causes, two shapes ------------------------------------------
   Rebuilt 2026-09-23. The target is an F curve from a hidden (breeders,
   relatives) setting; the student sets both and runs. What has to hold:
     - every target is hit at its own setting, on fresh runs;
     - the opening setting hits none;
     - no one setting clears two targets (searched over the controls);
     - the wrong cause cannot fake the shape: the targets made by pairing
       relatives cannot be matched by size alone, and the reverse;
     - the breeders slider can reach every target's size. */
{
  const runs = (n, f, reps, seed) => { const o = [];
    for (let r = 0; r < reps; r++) o.push(D_run(n, f, mulberry32(seed + r * 7919))); return o; };
  const avg = R => R[0].map((_, t) => R.reduce((s, F) => s + F[t], 0) / R.length);
  const hitRate = (n, f, k, reps, seed) => runs(n, f, reps, seed).filter(F => rmsGap(F, D_targetCurve(k)) <= D_TOL).length / reps;
  /* 20 runs for the small populations: at 10, a true rate of 0.9 reads 0.7
     about one page load in fifteen. */
  const own = D_TARGETS.map(([n, f], k) => hitRate(n, f, k, n >= 500 ? 5 : 20, 400 + k));
  check("D every target is hit at its own setting", own.every(h => h >= 0.75),
        own.map((h, k) => D_TARGETS[k][0] + "/" + D_TARGETS[k][1] + ":" + (100 * h).toFixed(0) + "%").join("  "));

  const open = avg(runs(1000, 0, 3, 77));
  const openGaps = D_TARGETS.map((_, k) => rmsGap(open, D_targetCurve(k)));
  check("D the opening setting is not an answer", openGaps.every(g => g > D_TOL),
        "1000 breeding, no relatives: gaps " + openGaps.map(g => g.toFixed(3)).join("/") + " against " + D_TOL);

  let minD = 9, minAt = "";
  for (let i = 0; i < D_TARGETS.length; i++) for (let j = i + 1; j < D_TARGETS.length; j++) {
    const d = rmsGap(D_targetCurve(i), D_targetCurve(j)); if (d < minD) { minD = d; minAt = D_TARGETS[i].join("/") + " vs " + D_TARGETS[j].join("/"); } }
  check("D the targets are far apart", minD >= 1.5 * D_TOL,
        "closest two (" + minAt + ") sit " + minD.toFixed(3) + " apart, against a tolerance of " + D_TOL);

  /* The control grid, two runs a setting. */
  const grid = [];
  for (const v of [0, 15, 28, 35, 41, 50, 59, 70, 85, 100]) for (let f = 0; f <= 1.001; f += 0.1)
    grid.push({ n: D_nAt(v), f: Math.round(f * 10) / 10, F: avg(runs(D_nAt(v), Math.round(f * 10) / 10, 2, 8000 + v * 11 + Math.round(f * 10))) });
  /* Same bar as B: no one setting passes the stage (three of five), and
     settings that clear two are rare. The closest pair of targets is
     0.09-0.10 apart, just short of the 0.10 that would rule two out. */
  let most = 0, mostAt = "", two = 0;
  for (const g of grid) { const c = D_TARGETS.filter((_, k) => rmsGap(g.F, D_targetCurve(k)) <= D_TOL).length;
    if (c >= 2) two++;
    if (c > most) { most = c; mostAt = g.n + "/" + g.f; } }
  check("D no one setting clears three targets, and few clear two", most <= 2 && two <= Math.max(1, 0.02 * grid.length),
        grid.length + " settings searched; the greediest (" + mostAt + ") clears " + most + ", and " + two + " clear two");

  /* The wrong cause. 1000/0.5 is made by relatives: size alone (f = 0) must
     miss it. 60/0 is made by size: relatives alone (1000 breeding) must miss it. */
  const kRel = D_TARGETS.findIndex(t => t[0] === 1000 && t[1] === 0.5), kSize = D_TARGETS.findIndex(t => t[0] === 60 && t[1] === 0);
  const bySize = grid.filter(g => g.f === 0).map(g => rmsGap(g.F, D_targetCurve(kRel)));
  const byRel = grid.filter(g => g.n === 1000).map(g => rmsGap(g.F, D_targetCurve(kSize)));
  check("D the wrong cause cannot fake the shape", Math.min(...bySize) > D_TOL && Math.min(...byRel) > D_TOL,
        "best size-only try at the relatives target: " + Math.min(...bySize).toFixed(3) +
        "; best relatives-only try at the size target: " + Math.min(...byRel).toFixed(3) + " (tolerance " + D_TOL + ")");

  const reach = D_TARGETS.map(([n]) => { let b = 1e9; for (let v = 0; v <= 100; v++) b = Math.min(b, Math.abs(D_nAt(v) - n) / n); return b; });
  check("D the breeders slider reaches every target's size", reach.every(r => r <= 0.03),
        D_TARGETS.map(([n], k) => n + " within " + (100 * reach[k]).toFixed(1) + "%").join("  "));

  const pick = dealDistinct("l11Dr", D_TARGETS.map((_, k) => k)), dealt = [0, 1, 2, 3, 4].map(pick);
  check("D five different targets", new Set(dealt).size === 5, "the five rounds deal " + dealt.map(k => D_TARGETS[k].join("/")).join(", "));
}

/* ---- E. one founding pair, traced down --------------------------------- */
{
  const REPS = 40;
  const runs = (n, g, f) => { const v = []; for (let r = 0; r < REPS; r++) { E.serial = 5000 + r * 13 + n * 101 + g * 17 + Math.round(f * 10); v.push(E_build(n, g, f)); } return v; };
  const rate = (v, t) => v.filter(x => Math.abs(x - t) <= E_TOL).length / v.length;
  const grid = [];
  for (const n of [2, 3, 4, 6, 8]) for (const g of [2, 3, 4, 5, 6, 7]) for (const f of [0, 0.5, 1]) grid.push([n, g, f, runs(n, g, f)]);

  /* the shaded share is the F the tree implies, measured two ways. Paired
     per run and judged on the mean difference against 3 SE of it: a flat
     0.03 bound tripped about one load in twenty at two a generation,
     where one run's shading wobbles by 0.09. */
  {
    let fails = [], rep = [];
    for (const [n, g, f] of [[4, 4, 0], [2, 6, 0], [8, 6, 1]]) {
      const d = [];
      for (let r = 0; r < REPS; r++) {
        E.serial = 9000 + r * 7; const real = E_build(n, g, f);
        const bot = E.rows[E.rows.length - 1];
        d.push(real - bot.reduce((t, x) => t + E_kin(x.parents[0], x.parents[1]), 0) / bot.length);
      }
      const m = mn(d), se = sdv(d) / Math.sqrt(REPS);
      rep.push("n" + n + "/g" + g + "/f" + f + " " + (m >= 0 ? "+" : "") + m.toFixed(3) + "±" + se.toFixed(3));
      if (Math.abs(m) > 3 * se) fails.push(n);
    }
    check("E the shading is the pedigree's own F", fails.length === 0, "shaded minus pedigree F, mean ± SE: " + rep.join("  "));
  }
  const reach = E_TARGETS.map(t => { let best = 0, at = null;
    for (const q of grid) { const h = rate(q[3], t); if (h > best) { best = h; at = q; } }
    return [t, best, at]; });
  check("E every target is reachable", reach.every(r => r[1] >= 0.5),
        reach.map(r => r[0].toFixed(2) + "@n" + r[2][0] + "/g" + r[2][1] + "/f" + r[2][2] + ":" + (100 * r[1]).toFixed(0) + "%").join("  "));
  const dflt = runs(4, 2, 0);
  check("E the default setting is not an answer", E_TARGETS.every(t => rate(dflt, t) < 0.1),
        "4 a generation, 2 generations gives F " + mn(dflt).toFixed(2) + " ± " + sdv(dflt).toFixed(2) +
        "; best target hit " + (100 * Math.max(...E_TARGETS.map(t => rate(dflt, t)))).toFixed(0) + "%");
  let greedy = 0, gp = "";
  for (const q of grid) { const k = E_TARGETS.filter(t => rate(q[3], t) >= 0.5).length; if (k > greedy) { greedy = k; gp = "n" + q[0] + "/g" + q[1] + "/f" + q[2]; } }
  check("E no one setting clears two targets", greedy <= 1,
        "the greediest setting (" + gp + ") hits " + greedy + " of " + E_TARGETS.length + " targets half the time or better");
  /* more than one route to a target: the stage's quiet point, searched for */
  const routes = E_TARGETS.map(t => grid.filter(q => rate(q[3], t) >= 0.4).map(q => "n" + q[0] + "/g" + q[1] + "/f" + q[2]));
  check("E each target has more than one route", routes.every(r => r.length >= 2),
        routes.map((r, i) => E_TARGETS[i].toFixed(2) + ": " + r.slice(0, 4).join(" ")).join("  |  "));
  const seen = E_ORDER.map(k => (k + E_ROT) % E_TARGETS.length);
  let adj = false; for (let i = 1; i < seen.length; i++) if (seen[i] === seen[i - 1]) adj = true;
  check("E targets repeat and never twice running", !adj && new Set(seen).size === E_TARGETS.length,
        "the five rounds deal targets " + seen.map(k => E_TARGETS[k].toFixed(2)).join(", "));
  E.serial = 0; E.n = 4; E.gens = 2; E.f = 0; E_reset();
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
