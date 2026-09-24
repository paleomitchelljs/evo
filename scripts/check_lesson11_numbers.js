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
  const W = +cv.dataset.drawW, H = +cv.dataset.cssH, fr = B_frame(W, H, Math.log(B_NMIN), Math.log(B_NMAX));
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
  /* The rule averaged over trees is one thing; the student sees ONE tree a
     setting and its readout. Measured 2026-09-23: with one tree a setting,
     37 of 60 pages fell by more than 0.02 somewhere up the slider. The page
     now shows the median of C_CAND trees. Tested over 40 page seeds. */
  {
    const kk = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1];
    let falls = 0, worst = 0;
    for (let q = 0; q < 40; q++) {
      const v = kk.map(k => C_pedF(C_typicalPed(20000 + q * 7919, k)));
      let drop = 0; for (let i = 1; i < v.length; i++) drop = Math.max(drop, Math.max(...v.slice(0, i)) - v[i]);
      if (drop > 0.02) falls++; worst = Math.max(worst, drop);
    }
    check("C one page's readout rises with the slider", falls <= 2 && worst <= 0.05,
          falls + " of 40 pages fall by more than 0.02 anywhere up the slider; largest fall " + worst.toFixed(3));
  }
  C_rebuild();
  check("C the inbreeding slider is worth having", pf[pf.length-1] - pf[0] > 0.2,
        "slider at 0 builds a tree at " + pf[0].toFixed(2) + ", at 1 " + pf[pf.length-1].toFixed(2));

  const setPool = (ncol, nhet) => {
    for (let i = 0; i < 8; i++) C.founders[i] = i < nhet ? [i%ncol, (i+1)%ncol] : [i%ncol, i%ncol];
  };
  /* One drop is not the number. If it were, C_DROPS would be waste. Taken
     at two colours, four heterozygous founders -- mid-range, where the
     targets are. It was 20 drops at four colours, which sits near the
     ceiling (15 of 20) where the spread is squeezed, and on the monogamous
     tree of 2026-09-23 it read 1.5 against 1.5. Over 200 drops the spread
     across the target range is 2.2-3.1. */
  C.inb = 0; C_rebuild(); setPool(2, 4);
  const one = []; for (let r = 0; r < 100; r++) { C.serial = r*31; C_drop(); one.push(C_bottomStats().het); }
  check("C one drop is not the number", sdv(one) > C_TOL,
        "the same tree and the same founders give " + mn(one).toFixed(1) + " ± " + sdv(one).toFixed(1) +
        " heterozygotes over 100 drops, against a tolerance of " + C_TOL +
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
  /* Homozygous founders (JM, round 4): every founder two copies of the SAME
     allele. Nothing varies, so F has nothing to measure in any row and must
     come back empty, not 0. */
  C.serial = 11; C_homoFounders();
  C.inb = 0; C_rebuild(); C_dropMany();
  const oneAllele = C.founders.every(([x, y]) => x === 0 && y === 0);
  const noF = C.traj.every(t => t.every(r => r.F === null));
  check("C homozygous founders: one allele fixed across the top, F left undefined",
        oneAllele && noF, "founders " + C.founders.map(q => q.join("")).join(" ") +
        "; rows with an F: " + C.traj.reduce((a, t) => a + t.filter(r => r.F !== null).length, 0));
  /* The tree is drawn as matings, so it has to BE matings: one partner each. */
  let multi = 0, idle = 0;
  for (const k of [0, 0.5, 1]) { C.inb = k; C_rebuild();
    C.ped.couples.forEach((pairs, g) => {
      const seen = pairs.flat();
      if (new Set(seen).size !== seen.length) multi++;
      idle += C.ped.rows[g].length - seen.length;
    }); }
  check("C every individual above the bottom row pairs once", multi === 0 && idle === 0,
        multi + " rows with someone in two couples, " + idle + " individuals who never pair");
  C.inb = 0; C_rebuild(); C_randomFounders();
}

/* ---- D. when the variety runs out ----------------------------------------
   Rebuilt 2026-09-23 (round 5). 200 populations of one locus, each run until
   one allele is left; a round deals a generation and holds the alleles and
   one of individuals / F. What has to hold, none of it visible on the page:
     - the model is the one the readout describes: F held where the slider
       says, Ne = N/(1+F) in the runs, and the average time to one allele
       equal to 4Ne(k-1)ln(k/(k-1)) -- re-derived here, not read off the page;
     - one population is not the number, and the average of 200 is;
     - every round is hit at its intended setting, for every target it can deal;
     - the naive answers miss: reading 4Ne and stopping (the two-allele rounds),
       leaving F at 0 (the F rounds), ignoring the held F, the opening setting;
     - no one setting clears three rounds;
     - the readout's arithmetic agrees with the sliders, and a round holds
       what its card says. */
{
  const ck = k => (k - 1) * Math.log(k / (k - 1));
  const kOf = (k, n) => k || 2 * n;
  const pred = (n, k, F) => 4 * n / (1 + F) * ck(kOf(k, n));
  const once = (n, k, F, seed) => D_run(n, kOf(k, n), F, D_R, mulberry32(seed));
  const rate = (n, k, F, T, reps, seed) => { let h = 0;
    for (let r = 0; r < reps; r++) if (D_hits(once(n, k, F, seed + r * 7919).mean, T)) h++; return h / reps; };

  /* the model. Each estimate here is the mean of eight runs of 200 whose
     seeds sit far apart: one run's Ne, from the time or from the rate of
     loss, wobbles by 4-8% (measured over 20 seeds: mean ratio to N/(1+F)
     0.98-1.01, sd 0.04-0.08), and seeds 31 apart once read low together.
     Selfing at middling F also runs a few percent under N/(1+F) at these
     sizes (0.92-0.95 at 60 individuals, F 0.5, over 800-1200 populations),
     so the bar is 8%, or 3 SE if that is wider. */
  const set1 = [[60, 0], [60, 0.5], [100, 0.9], [30, 0.3]];
  const model = set1.map(([n, F], i) => { const v = [];
    for (let r = 0; r < 8; r++) v.push(once(n, 0, F, 700 + i * 104729 + r * 7919));
    const truth = n / (1 + F);
    /* the plotted line against random pairing's, from generation 10 (the
       held F has set in) while random pairing's is above a tenth of its start */
    const ratio = m => { let o = 0, e = 0;
      for (let t = 10; t < m.avgHe.length && m.avgHe[t] > 0.1 * m.avgHe[0]; t++) { o += m.avgHo[t]; e += m.avgHe[t]; }
      return o / e; };
    return { n, F, truth, neT: v.map(m => m.mean / (4 * ck(2 * n)) / truth), neD: v.map(m => (m.Nem || 0) / truth),
             Fm: mn(v.map(m => m.Fm == null ? NaN : m.Fm)), ho: mn(v.map(ratio)),
             plotted: v.every(m => m.H.every(h => h.length > 0 && h[h.length - 1] === 0)) }; });
  const within = a => Math.abs(mn(a) - 1) <= Math.max(0.08, 3 * sdv(a) / Math.sqrt(a.length));
  check("D Ne = N/(1+F) in the runs", model.every(q => within(q.neT)),
        "Ne from the average time to one allele, over the sliders' Ne: " + model.map(q => q.n + "/F" + q.F + " " +
        mn(q.neT).toFixed(3) + "±" + sdv(q.neT).toFixed(3)).join("  "));
  check("D the Ne the page measures agrees with the sliders", model.every(q => within(q.neD)),
        "from the average rate of loss, over the sliders' Ne: " + model.map(q => q.n + "/F" + q.F + " " +
        mn(q.neD).toFixed(3) + "±" + sdv(q.neD).toFixed(3)).join("  "));
  check("D F is held where the slider sets it", model.every(q => Math.abs(q.Fm - q.F) <= 0.04),
        "F measured in the runs: " + model.map(q => q.Fm.toFixed(3) + " at " + q.F).join("  "));
  /* JM, 2026-09-24: the plot is the heterozygosity the population actually
     has, not the random-pairing figure. So the plotted line has to sit at
     (1 - F) of random pairing's, and reach 0 at the generation one allele is left. */
  check("D the plotted heterozygosity is counted, at (1 - F) of random pairing's",
        model.every(q => Math.abs(q.ho - (1 - q.F)) <= 0.04 && q.plotted),
        "plotted over random pairing's, generation 10 on: " + model.map(q => q.ho.toFixed(3) + " at F " + q.F +
        " (1 - F = " + (1 - q.F).toFixed(2) + ")").join("  ") + "; every line ends at 0: " + model.every(q => q.plotted));
  const byK = [2, 3, 10, 0].map((k, i) => { const T = [];
    for (let r = 0; r < 3; r++) T.push(...Array.from(once(50, k, 0, 800 + i * 104729 + r * 7919).T));
    return { k, m: mn(T), se: sdv(T) / Math.sqrt(T.length), p: pred(50, k, 0) }; });
  check("D the average time is 4Ne(k-1)ln(k/(k-1)), and 4Ne only with many alleles",
        byK.every(q => Math.abs(q.m - q.p) <= 3 * q.se + 0.02 * q.p) && byK[0].m < 0.8 * 200,
        "50 individuals, F 0, " + 3 * D_R + " populations each: " + byK.map(q => (q.k || "every copy") + " alleles " + q.m.toFixed(0) +
        "±" + q.se.toFixed(0) + " (formula " + q.p.toFixed(0) + ")").join("  ") + "; 4Ne is 200");

  /* one population, and the average of 200 */
  const one = once(60, 0, 0, 900), cv = sdv(Array.from(one.T)) / one.mean;
  check("D one population is not the number", cv > 3 * D_TOL,
        "one population's time runs " + one.mean.toFixed(0) + " ± " + (cv * 100).toFixed(0) + "%, against a window of ±" + (100 * D_TOL) + "%");
  const avgs = []; for (let r = 0; r < 8; r++) avgs.push(once(60, 0, 0, 950 + r * 7919).mean);
  check("D the average of " + D_R + " repeats inside the window", sdv(avgs) / mn(avgs) <= D_TOL / 2.5,
        "eight averages: " + mn(avgs).toFixed(0) + " ± " + (100 * sdv(avgs) / mn(avgs)).toFixed(1) + "%");

  /* the rounds */
  const Ng = []; for (let v = 0; v <= 100; v++) Ng.push(D_nAt(v));
  const Fg = []; for (let i = 0; i <= 20; i++) Fg.push(i / 20);
  const near = (list, f, T) => list.reduce((b, x) => Math.abs(f(x) - T) < Math.abs(f(b) - T) ? x : b, list[0]);
  const aim = (r, T, fn) => r.N != null ? { n: r.N, F: near(Fg, F => fn(r.N, r.k, F), T) }
                                        : { n: near(Ng, n => fn(n, r.k, r.F), T), F: r.F };
  const own = [];
  D_ROUNDS.forEach((r, i) => r.Ts.forEach(T => { const a = aim(r, T, pred);
    own.push({ i, T, a, h: rate(a.n, r.k, a.F, T, 10, 1100 + i * 97 + T) }); }));
  check("D every round is hit at its intended setting", own.every(o => o.h >= 0.8),
        own.map(o => "r" + (o.i + 1) + " " + o.T + "@" + (D_ROUNDS[o.i].N != null ? "F" + o.a.F : "N" + o.a.n) + ":" +
        (100 * o.h).toFixed(0) + "%").join("  ") + "  (10 fresh runs of " + D_R + " each)");

  const four = (n, k, F) => 4 * n / (1 + F);
  const naive = [];
  D_ROUNDS.forEach((r, i) => { if (r.k !== 2) return;
    r.Ts.forEach(T => { const a = aim(r, T, four); naive.push({ i, T, a, h: rate(a.n, r.k, a.F, T, 6, 1300 + i * 97 + T) }); }); });
  check("D reading 4Ne and stopping misses the two-allele rounds", naive.every(o => o.h <= 0.17),
        naive.map(o => "r" + (o.i + 1) + " " + o.T + "@" + (D_ROUNDS[o.i].N != null ? "F" + o.a.F : "N" + o.a.n) + ":" +
        (100 * o.h).toFixed(0) + "%").join("  "));
  const f0 = [];
  D_ROUNDS.forEach((r, i) => { if (r.N == null) return; r.Ts.forEach(T => f0.push({ i, T, h: rate(r.N, r.k, 0, T, 6, 1500 + i * 97 + T) })); });
  check("D leaving F at 0 misses the rounds where F is the lever", f0.every(o => o.h <= 0.17),
        f0.map(o => "r" + (o.i + 1) + " " + o.T + ":" + (100 * o.h).toFixed(0) + "%").join("  "));
  const ign = [];
  D_ROUNDS.forEach((r, i) => { if (!(r.F > 0)) return;
    r.Ts.forEach(T => { const n = near(Ng, n => pred(n, r.k, 0), T); ign.push({ i, T, n, h: rate(n, r.k, r.F, T, 6, 1700 + T) }); }); });
  check("D ignoring the held F misses", ign.length > 0 && ign.every(o => o.h <= 0.17),
        ign.map(o => "r" + (o.i + 1) + " " + o.T + "@N" + o.n + ":" + (100 * o.h).toFixed(0) + "%").join("  "));
  const open = [];
  D_ROUNDS.forEach((r, i) => r.Ts.forEach(T => { const n = r.N != null ? r.N : D_nAt(100), F = r.F != null ? r.F : 0;
    open.push({ i, T, h: rate(n, r.k, F, T, 4, 1900 + i * 97 + T) }); }));
  check("D the opening setting is not an answer", open.every(o => o.h === 0),
        D_nAt(100) + " individuals, F 0, where the round leaves them free: " + open.map(o => "r" + (o.i + 1) + " " + o.T + ":" +
        (100 * o.h).toFixed(0) + "%").join("  "));

  /* No one setting clears three rounds. Searched over the whole slider grid
     and every combination of the per-student targets, on the formula checked
     above with 3% added to the window for its error; then the greediest
     setting is run for real. */
  let most = 0, mostAt = null;
  for (const n of Ng) for (const F of Fg) {
    let c = 0;
    D_ROUNDS.forEach(r => { const nn = r.N != null ? r.N : n, FF = r.F != null ? r.F : F;
      if (r.Ts.some(T => Math.abs(pred(nn, r.k, FF) - T) <= (D_TOL + 0.03) * T)) c++; });
    if (c > most) { most = c; mostAt = { n, F }; }
  }
  let real = 0;
  D_ROUNDS.forEach((r, i) => { const nn = r.N != null ? r.N : mostAt.n, FF = r.F != null ? r.F : mostAt.F;
    if (r.Ts.some(T => rate(nn, r.k, FF, T, 3, 2100 + i * 97 + T) >= 0.5)) real++; });
  check("D no one setting clears three rounds", most <= 2 && real <= 2,
        Ng.length * Fg.length + " settings searched: the greediest (" + mostAt.n + " individuals, F " + mostAt.F +
        ") clears " + most + " of 5 on the formula and " + real + " when run");

  /* the page's own deal, the readout, and what a round holds */
  const dealt = [0, 1, 2, 3, 4].map(D_deal);
  check("D five rounds up the ladder, five different targets",
        dealt.every((r, i) => D_ROUNDS[i].Ts.indexOf(r.T) >= 0 && r.k === D_ROUNDS[i].k) && new Set(dealt.map(r => r.T)).size === 5,
        "the five rounds deal " + dealt.map(r => r.T + (r.N != null ? " (F yours)" : " (individuals yours)")).join(", "));
  const keep = { n: D.n, F: D.F, k: D.k }, arith = [];
  for (const [n, F] of [[40, 0], [100, 0.5], [120, 0.25]]) {
    D.n = n; D.F = F; D_syncOut();
    const t = document.getElementById("D_ne").textContent;
    const ne = +(/Ne ([0-9.]+)/.exec(t) || [])[1], fn = +(/4Ne ([0-9.]+)/.exec(t) || [])[1];
    arith.push({ n, F, ne, fn, ok: Math.abs(ne - n / (1 + F)) < 0.06 && Math.abs(fn - 4 * n / (1 + F)) <= 0.5 });
  }
  D.n = keep.n; D.F = keep.F; D.k = keep.k; D_applyHeld();
  check("D the readout's Ne and 4Ne are the sliders' arithmetic", arith.every(a => a.ok),
        arith.map(a => a.n + "/F" + a.F + ": Ne " + a.ne + ", 4Ne " + a.fn).join("  "));
  const r0 = D.game.current(), held = { k: document.getElementById("D_k").disabled, n: document.getElementById("D_n").disabled,
                                        F: document.getElementById("D_F").disabled };
  check("D a round holds what its card says",
        held.k && held.n === (r0.N != null) && held.F === (r0.F != null) && D.k === r0.k &&
        (r0.N == null || D.n === r0.N) && (r0.F == null || D.F === r0.F),
        "round 1: alleles " + (held.k ? "held" : "free") + ", individuals " + (held.n ? "held" : "free") +
        ", F " + (held.F ? "held at " + D.F : "free"));
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

  /* The tracker (JM, 2026-09-24): alleles left and pi, by generation.
     Recounted here genome by genome and pair by pair through E_carries,
     not through E_dots or the closed form the page uses. */
  {
    const brute = row => {
      const gs = row.flatMap(ind => ind.chroms), has = gs.map(c => E.sites.map(s => E_carries(c, s)));
      const left = E.sites.filter((_, j) => has.some(h => h[j])).length;
      let d = 0, pairs = 0;
      for (let i = 0; i < gs.length; i++) for (let j = i + 1; j < gs.length; j++) {
        pairs++; for (let s = 0; s < E.sites.length; s++) if (has[i][s] !== has[j][s]) d++; }
      return { left, pi: d / pairs };
    };
    let agree = true, rise = 0, rows = 0, founders = true;
    for (const [n, g, f] of [[2, 7, 0], [4, 5, 0.5], [8, 6, 1], [3, 4, 0]]) for (let r = 0; r < 10; r++) {
      E.serial = 12000 + r * 11 + n * 101 + g; E_build(n, g, f);
      const tr = E.rows.map(E_rowDiv);
      E.rows.forEach((row, k) => { rows++; const b = brute(row);
        if (b.left !== tr[k].left || Math.abs(b.pi - tr[k].pi) > 1e-9) agree = false; });
      for (let k = 1; k < tr.length; k++) if (tr[k].left > tr[k - 1].left) rise++;
      if (tr[0].left !== E_NANC || Math.abs(tr[0].pi - 6) > 1e-9) founders = false;
    }
    check("E the tracker counts what is on the tree", agree && founders,
          rows + " generations recounted genome by genome: " + (agree ? "all agree" : "DISAGREE") +
          "; the founders read " + E_NANC + " alleles and pi 6 every time: " + founders);
    check("E alleles left never rise", rise === 0,
          "closed, no new mutations: " + rise + " generations with more dot alleles than the one before");

    /* pi is diversity in the sense F is its loss: two genomes that are not
       identical by descent trace to two different founder genomes, which
       differ at half the dots. So pi = 6 (1 - mean kinship of the
       generation's genomes), in expectation. Paired per run.
       Measured 2026-09-24: no bias (-0.03 ± 0.04 over 400 runs at 8 a
       generation, relatives always; 120 batches of 40, z from -2.6 to 2.2),
       but the first page load drew z = -3.7 at 40 runs and 3 SE, with the
       four settings sharing seeds and so sharing site layouts. Now each
       setting has its own seeds, 80 runs, 3.5 SE. A with-replacement pi
       would sit 0.4 low at two a generation, about 5 SE; the recount above
       is the exact check, this one is what pi means. */
    let fails = [], rep = [];
    const R2 = 80;
    for (const [n, g, f] of [[4, 4, 0], [2, 6, 0], [8, 6, 1], [6, 2, 0]]) {
      const d = [], pis = [];
      for (let r = 0; r < R2; r++) {
        E.serial = 15000 + r * 7 + n * 1009 + g * 101 + Math.round(f * 10) * 13; E_build(n, g, f);
        const row = E.rows[E.rows.length - 1], m = 2 * row.length;
        let phi = 0;
        for (const x of row) phi += E_kin(x.parents[0], x.parents[1]);
        for (let i = 0; i < row.length; i++) for (let j = i + 1; j < row.length; j++) phi += 4 * E_kin(row[i], row[j]);
        phi /= m * (m - 1) / 2;
        const pi = E_rowDiv(row).pi;
        pis.push(pi); d.push(pi - 6 * (1 - phi));
      }
      const m = mn(d), se = sdv(d) / Math.sqrt(R2);
      rep.push("n" + n + "/g" + g + "/f" + f + " pi " + mn(pis).toFixed(2) + ", minus 6(1-kinship) " + (m >= 0 ? "+" : "") + m.toFixed(3) + "±" + se.toFixed(3));
      if (Math.abs(m) > 3.5 * se) fails.push(n);
    }
    check("E pi falls as the generation's genomes become kin", fails.length === 0, rep.join("  "));
  }
  E.serial = 0; E.n = 4; E.gens = 2; E.f = 0; E_reset();
}

/* ---- every plot inside its panel ----------------------------------------
   JM, 2026-09-24: "Many graphs in both the interactive & prediction parts
   extend beyond the limits of their boxes." Measured at the check's own
   width and at an 1100-px window, where they ran 56-119 px over. C's
   pedigree is exempt: it sits in its own scroller, which JM wants kept. */
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

/* ---- a practice switch on every stage ------------------------------------
   JM, 2026-09-24: "a 'practice' toggle for every part ... a default
   incorporation for all of the 'bowling' style activities". Driven through
   the real buttons and checkboxes. The runs animate on setInterval, so a
   stand-in runs each one to its end at once. Last in the file: it spends
   one scored attempt of every game. For each stage:
     practice ticked  -> a run is shown and not scored;
     unticked         -> a run is scored, and the card waits for Next;
     waiting          -> Go is off, and a practice run is still allowed. */
{
  const realSI = window.setInterval, realCI = window.clearInterval;
  let loop = false, stop = false;
  window.setInterval = fn => { loop = true; stop = false; for (let k = 0; k < 20000 && !stop; k++) fn(); loop = false; return 0; };
  window.clearInterval = id => { if (loop) stop = true; else realCI(id); };
  const out = [], stages = { A, B, C, D, E };
  try {
    for (const [S, go] of [["A", "A_run"], ["B", "B_run"], ["C", "C_drop"], ["D", "D_run"], ["E", "E_go"]]) {
      const g = stages[S].game, box = document.getElementById(S + "_practice"), btn = document.getElementById(go);
      const tick = on => { box.checked = on; box.dispatchEvent(new Event("change")); };
      const n0 = g.st.hits.length;
      tick(true); btn.click();
      const pracOk = g.st.hits.length === n0 && g.st.last != null && /practice/.test(document.getElementById(S + "_tflip").textContent);
      tick(false); btn.click();
      const scored = g.st.hits.length === n0 + 1 && g.waiting();
      const blocked = btn.disabled;
      tick(true); btn.click();
      const stillPrac = !btn.disabled && g.st.hits.length === n0 + 1 && g.waiting();
      tick(false);
      out.push({ S, ok: !!box && pracOk && scored && blocked && stillPrac,
                 d: S + ": practice " + (pracOk ? "unscored" : "SCORED") + ", ticked off " + (scored ? "scored" : "NOT scored") +
                    ", waiting " + (blocked ? "Go off" : "GO ON") + (stillPrac ? " but practice runs" : ", practice BLOCKED") });
    }
  } finally { window.setInterval = realSI; window.clearInterval = realCI; }
  check("every stage has a practice switch that does not score", out.length === 5 && out.every(q => q.ok),
        out.map(q => q.d).join("  |  "));
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
