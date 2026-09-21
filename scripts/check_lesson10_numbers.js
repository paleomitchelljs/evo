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
      Object.keys(BIT).length === 9, Object.keys(BIT).length + " named bits");

/* ---- A. differential reproduction with nothing attached ---------------- */
{
  /* A2 is a roll: drive one allele out inside A_ROLL_GENS generations, five
     times. Three things have to hold and none of them is visible on screen. */
  const rollOnce = (N, cv) => {
    A.N = N; A.cv = cv; A.p0 = 0.5; A.round = null; A_fresh();
    for (let i = 0; i < A_ROLL_GENS; i++) { A_step(); if (A_fixed()) break; }
    return A_fixed();
  };
  const rate = (N, cv, k) => { let h = 0; for (let r = 0; r < k; r++) if (rollOnce(N, cv)) h++; return h / k; };
  const easy = rate(8, 0, 40), spread = rate(40, 2.6, 40), hard = rate(300, 0, 20);
  check("A2 roll clearable", easy >= 0.5,
        "8 breeders, flat: lands " + (100*easy).toFixed(0) + "% of rolls (5 needed, so ~" +
        (easy>0 ? (5/easy).toFixed(0) : "inf") + " rolls)");
  check("A2 roll clearable by spread too", spread >= 0.25,
        "40 breeders, spread 2.6: lands " + (100*spread).toFixed(0) + "% of rolls");
  check("A2 roll not a gimme", hard <= 0.05,
        "300 breeders, flat: lands " + (100*hard).toFixed(0) + "% -- the default pond must not walk it");

  /* A1 is the ten dealt rounds. The student calls where the pond ends and
     how far off they expect to be, and the whole stage lives in the second
     number: the first has one honest answer (where it started) in every
     round, and the second moves by a large factor between the classes.

     So the checks are:
       - the middle really is unbiased, in every class, or the first slider
         is a trick question;
       - the honest miss moves enough between classes that one width cannot
         be right for all of them;
       - every honest miss is reachable on the slider that asks for it;
       - the widest band always lands and the narrowest almost never does,
         which is what makes the silent last-five-vs-first-five bit
         ungameable in either direction;
       - A_typical, which draws the green band, agrees with Stage A's own
         operator rather than with a formula. */
  const cls = A.game.classes;
  const REPS = 400;
  const prof = cls.map((c, ci) => {
    const N = c.N[1], p0 = c.p0[1];
    const t = A_typical(N, p0, A_ROLL_GENS, REPS);
    const signed = [];
    const rng = mulberry32(9001 + ci * 77);
    for (let r = 0; r < REPS; r++) { let p = p0; for (let g = 0; g < A_ROLL_GENS; g++) p = breedFreq(rng, p, N, 0); signed.push(p - p0); }
    return { N, p0, miss: t.miss, raw: t.raw, bias: mn(signed), se: Math.sqrt(mn(signed.map(v=>v*v))/REPS) };
  });
  check("A1 the middle is unbiased in every class",
        prof.every(r => Math.abs(r.bias) < 3 * r.se),
        prof.map(r => "N=" + r.N + " drifts " + (r.bias>=0?"+":"") + r.bias.toFixed(4) + " (3se " + (3*r.se).toFixed(4) + ")").join("  "));
  const misses = prof.map(r => r.miss);
  check("A1 the honest miss moves across the classes",
        Math.max(...misses) / Math.min(...misses) >= 3,
        prof.map(r => "N=" + r.N + " -> " + r.miss.toFixed(3)).join("  ") +
        "  (x" + (Math.max(...misses)/Math.min(...misses)).toFixed(1) + ")");
  // every member of every class, not just the middle one: a pond that could be
  // dealt whose honest answer is off the end of the slider is unanswerable
  const all = [];
  for (const c of cls) for (const N of c.N) for (const p0 of c.p0) all.push([N, p0, A_typical(N, p0, A_ROLL_GENS, 120).miss]);
  const off = all.filter(r => r[2] < 0.01 || r[2] > 0.50);
  check("A1 every honest miss is on the slider", off.length === 0,
        "slider runs 0.01..0.50; " + all.length + " ponds can be dealt, spanning " +
        Math.min(...all.map(r=>r[2])).toFixed(3) + " to " + Math.max(...all.map(r=>r[2])).toFixed(3) +
        (off.length ? "  OFF: " + off.map(r=>"N="+r[0]+" p0="+r[1]+" -> "+r[2].toFixed(3)).join(", ") : ""));
  const hitRate = (err, r) => r.raw.filter(v => v <= err).length / r.raw.length;
  const wide = prof.map(r => hitRate(0.50, r)), narrow = prof.map(r => hitRate(0.01, r));
  check("A1 the widest band always lands", wide.every(v => v === 1),
        "err=0.50 hits " + wide.map(v=>(100*v).toFixed(0)+"%").join("/") +
        " -- so first five and last five tie and the silent bit stays false");
  check("A1 the narrowest band hardly ever lands", narrow.every(v => v <= 0.25),
        "err=0.01 hits " + narrow.map(v=>(100*v).toFixed(0)+"%").join("/"));
  /* The honest band is drawn from A_typical, which runs breedFreq. The pond
     on screen runs makePool+breed. They must be the same process. */
  const simMiss = (N, p0, reps) => {
    const errs = [];
    for (let r = 0; r < reps; r++) {
      A.N = N; A.cv = 0; A.p0 = p0; A.round = null; A_fresh();
      const start = popFreq(A.pop);
      for (let g = 0; g < A_ROLL_GENS; g++) A_step();
      errs.push(Math.abs(popFreq(A.pop) - start));
    }
    return mn(errs);
  };
  const cmp = cls.map(c => { const N = c.N[1], p0 = c.p0[1];
    return [N, simMiss(N, p0, 120), A_typical(N, p0, A_ROLL_GENS, REPS).miss]; });
  check("A1 the green band matches the pond on screen",
        cmp.every(r => Math.abs(r[1] - r[2]) / r[2] < 0.22),
        cmp.map(r => "N=" + r[0] + " pond " + r[1].toFixed(3) + " vs band " + r[2].toFixed(3)).join("  "));
  check("A1 all three classes are dealt inside ten rounds", cls.length === 3 && A_ROUNDS >= 9,
        A_ROUNDS + " rounds over " + cls.length + " classes in rotation");
  /* Every population that can be dealt has to be answerable on the two
     sliders it is answered with -- the middle as well as the width. */
  const offMid = [];
  for (const c of cls) for (const p0 of c.p0) if (p0 < 0 || p0 > 1) offMid.push(p0);
  check("A1 every starting frequency is on the first slider", offMid.length === 0,
        "slider runs 0..1; classes start at " + [...new Set(cls.flatMap(c => c.p0))].sort().join(", "));

  /* A2's anti-gaming rule: a landed roll spends its setting. The check is
     that the rule is actually enforced by the predicate rather than only
     described in the goal text. */
  A.used = {}; A.N = 6; A.cv = 0; A.p0 = 0.5; A.round = null;
  const key = A_settingKey();
  A.used[key] = true;
  A_fresh(); for (let i = 0; i < A_ROLL_GENS; i++) { A_step(); if (A_fixed()) break; }
  const spentBlocks = A_fixed() ? !A.roll.hitNow() : null;
  check("A2 a spent setting cannot land again", spentBlocks === true || spentBlocks === null,
        spentBlocks === null ? "the probe roll did not fix; rule untested this run"
                             : "an allele went at " + key + " and the roll refused to count it");
  A.used = {};
  A_fresh(); for (let i = 0; i < A_ROLL_GENS; i++) { A_step(); if (A_fixed()) break; }
  check("A2 a fresh setting still lands", !A_fixed() || A.roll.hitNow() === true,
        "at " + A_settingKey() + " with nothing spent, a fixed run counts");

  /* Five distinct settings have to exist that each land often enough to be
     worth trying -- otherwise "a landed setting is spent" turns a five-roll
     gate into a grind. Both sliders count towards distinctness, which is
     what the rule says, so both are swept. */
  const landable = [];
  for (const N of [4, 6, 8, 10, 12, 16, 20, 30]) for (const cv of [0, 1.0, 2.0]) {
    let h = 0;
    for (let r = 0; r < 12; r++) { A.N = N; A.cv = cv; A.p0 = 0.5; A.round = null; A_fresh();
      for (let i = 0; i < A_ROLL_GENS; i++) { A_step(); if (A_fixed()) break; }
      if (A_fixed()) h++; }
    if (h >= 5) landable.push(N + "@" + cv.toFixed(1) + " (" + h + "/12)");
  }
  check("A2 plenty of distinct settings land often enough to be worth rolling", landable.length >= 8,
        landable.length + " settings land 5+ of 12: " + landable.slice(0, 8).join(", ") +
        (landable.length > 8 ? " ..." : ""));
  A.used = {};
}

/* ---- B. the error is inherited ----------------------------------------- */
{
  const rngB = mulberry32(99);
  /* The stage's one observation, unchanged: the error compounds only when it
     is inherited, and the per-generation randomness is identical either way. */
  const inh = B_batch(rngB, 10, 300, true, 20);
  check("B the inherited rule fixes everything", inh.fixed === 20,
        "10 individuals, 300 generations: " + inh.fixed + "/20 down to one allele");
  const fr = B_batch(rngB, 10, 300, false, 60);
  check("B the uninherited rule fixes nothing", fr.touched === 0,
        "60 uninherited populations x 300 generations at N=10: " + fr.touched + " ever reached a wall");
  check("B and it keeps its variety", fr.H[300] > 0.45,
        "variety after 300 generations: " + fr.H[300].toFixed(3) + " of 0.500");

  // the distance grows with the root of the generations, not with them
  const d = g => { const r = []; for (let i = 0; i < 60; i++) r.push(Math.abs(B_runOne(rngB, 100, g, true)[g] - 0.5)); return mn(r); };
  const d10 = d(10), d40 = d(40), d150 = d(150);
  check("B sublinear in generations", d150 < 3 * d40 && d40 < 3 * d10,
        "10 gen " + d10.toFixed(3) + " -> 40 gen " + d40.toFixed(3) + " -> 150 gen " + d150.toFixed(3));

  /* THE TEN TARGETS. Three things have to hold of each one and none of them
     is visible on the page:
       - it is reachable on the sliders the student actually has;
       - it is not reachable by leaving the controls where the last target
         left them, or the ten rounds are one round played ten times;
       - and target 5 is reachable ONLY with the uninherited switch, which is
         the only reason the switch is a control rather than a demonstration.
     The slider ranges are read off the page, not restated here. */
  const sN = []; { const el = document.getElementById("B_N");
    for (let v = +el.min; v <= +el.max; v += +el.step) sN.push(v); }
  const sG = []; { const el = document.getElementById("B_gens");
    for (let v = +el.min; v <= +el.max; v += +el.step) sG.push(v); }
  const lands = (tg, N, G, inhFlag, k) => { let h = 0;
    for (let r = 0; r < k; r++) { const b = B_batch(mulberry32(4000 + r * 7919 + N * 13 + G), N, G, inhFlag, 20);
      b.gens = G; if (B_judge(tg, b).ok) h++; }
    return h; };
  const winners = B_TARGETS.map(tg => { const w = { inh: [], fresh: [] };
    for (const inhFlag of [true, false]) for (const N of sN) for (const G of sG) {
      if (tg.gensMin && G < tg.gensMin) continue;
      if (lands(tg, N, G, inhFlag, 5) >= 3) w[inhFlag ? "inh" : "fresh"].push(N + "/" + G);
    }
    return w; });
  winners.forEach((w, i) => {
    const total = w.inh.length + w.fresh.length;
    check("B target " + (i + 1) + " is reachable", total >= 5,
          total + " settings land 3 of 5 rolls  [inherited " + w.inh.length + ", uninherited " + w.fresh.length +
          "]  e.g. " + (w.inh.concat(w.fresh)).slice(0, 3).join(" "));
  });
  check("B the 300-generation target needs the switch",
        winners[4].inh.length === 0 && winners[4].fresh.length > 0,
        "target 5: " + winners[4].inh.length + " inherited settings, " + winners[4].fresh.length + " uninherited");
  // no single setting clears more than one target
  let overlap = null;
  for (const inhFlag of [true, false]) for (const N of [10, 25, 50, 100, 150, 200]) for (const G of [25, 100, 200, 300]) {
    const cleared = B_TARGETS.map((tg, i) => lands(tg, N, G, inhFlag, 5) >= 3 ? i + 1 : 0).filter(Boolean);
    if (cleared.length > 1) overlap = (inhFlag ? "inh" : "fresh") + " N=" + N + " G=" + G + " clears targets " + cleared.join(",");
  }
  check("B no one setting clears two targets", overlap === null,
        overlap || "every sampled setting clears at most one of the five");
}

/* ---- C. 107 populations and a shape to match ---------------------------- */
{
  /* The stage shows a picture and asks for a picture, and takes its verdict
     on the two numbers that pin a picture of this kind down. Three things
     have to hold, and none of them is visible on the page:

       - the SAME setting, run again, lands inside the tolerance, or a
         correct answer is marked wrong by sampling noise alone;
       - no setting clears two different shapes, or the ten rounds collapse
         into one round played ten times;
       - every shape is reachable by a spread of settings rather than a
         single point, because the shape is a function of generations over
         headcount and that has to show up as a curve of answers.

     The slider ranges are read off the page rather than restated here, so a
     range that gets edited is a range that gets re-checked. */
  const shp = t => C.game.shapeFor(t);
  const ends = (N, G, rng) => C_ends(N, G, rng);

  C_TARGETS.forEach((t, i) => {
    const rng = mulberry32(999 + t.N * 7 + t.gens);
    let h = 0;
    for (let r = 0; r < 20; r++) if (C_matches(C_feat(ends(t.N, t.gens, rng)), shp(t).feat)) h++;
    check("C shape " + (i + 1) + " accepts its own setting", h >= 18,
          "lands " + h + " of 20 replays at N=" + t.N + " gens=" + t.gens);
  });

  let overlap = null, tightest = 99, tpair = "";
  for (let i = 0; i < C_TARGETS.length; i++) for (let j = i + 1; j < C_TARGETS.length; j++) {
    const a = shp(C_TARGETS[i]).feat, b = shp(C_TARGETS[j]).feat;
    const df = Math.abs(a.fx - b.fx) / (2 * C_FT), dm = Math.abs(a.mad - b.mad) / (2 * C_MT);
    const sep = Math.max(df, dm);
    if (sep <= 1) overlap = "shapes " + (i + 1) + " and " + (j + 1) + " overlap";
    if (sep < tightest) { tightest = sep; tpair = (i + 1) + " and " + (j + 1); }
  }
  check("C every pair of shapes is disjoint", overlap === null,
        overlap || ("tightest pair is " + tpair + ", separated by " + tightest.toFixed(2) +
                    " times the width of a tolerance box"));

  const sN = []; { const el = document.getElementById("C_N");
    for (let v = +el.min; v <= +el.max; v += +el.step) sN.push(v); }
  const sG = []; { const el = document.getElementById("C_gens");
    for (let v = +el.min; v <= +el.max; v += +el.step) sG.push(v); }
  const reach = C_TARGETS.map(t => { const w = [];
    for (const N of sN) for (const G of sG) {
      const rng = mulberry32(2100 + N * 13 + G); let h = 0;
      for (let r = 0; r < 4; r++) if (C_matches(C_feat(ends(N, G, rng)), shp(t).feat)) h++;
      if (h >= 3) w.push(N + "/" + G);
    }
    return w; });
  reach.forEach((w, i) => check("C shape " + (i + 1) + " is reachable", w.length >= 20,
        w.length + " settings land 3 of 4  e.g. " + w.slice(0, 4).join(" ")));
  check("C no shape lives only at the bottom of a slider",
        reach.every(w => new Set(w.map(k => k.split("/")[1])).size >= 2),
        reach.map((w, i) => "#" + (i + 1) + " generations: " +
          [...new Set(w.map(k => +k.split("/")[1]))].sort((a, b) => a - b).slice(0, 4).join(",")).join("  "));

  let bothAt = null;
  for (const N of sN) for (const G of sG) {
    const rng = mulberry32(3300 + N * 7 + G);
    const f = C_feat(ends(N, G, rng));
    const cleared = C_TARGETS.map((t, i) => C_matches(f, shp(t).feat) ? i + 1 : 0).filter(Boolean);
    if (cleared.length > 1) bothAt = "N=" + N + " gens=" + G + " clears shapes " + cleared.join(",");
  }
  check("C no one setting clears two shapes", bothAt === null,
        bothAt || "every setting on the two sliders clears at most one of the five");

  check("C each shape is dealt twice and never twice running",
        C_ORDER.length === C_ROUNDS &&
        [0,1,2,3,4].every(k => C_ORDER.filter(v => v === k).length === 2) &&
        C_ORDER.every((v, i) => i === 0 || v !== C_ORDER[i - 1]),
        "order " + C_ORDER.join(""));
}

/* ---- D. the Lesson 6 record, with a gene walking it --------------------- */
{
  /* The apparatus is Lesson 6's: one birth rate, one death rate, one extra
     death rate for a marked winter. The claim the stage makes is that what
     a record is worth to a gene is the sum of one-over-each-winter and not
     the average of the winters. Nothing on the page asserts that; it comes
     out of forty herds. So the first thing to check is that the arithmetic
     printed beside the measurement agrees with the measurement. */
  const put = (b, d, h, bad) => { D.b = b; D.d = d; D.h = h; D.bad = {};
                                  for (const y of bad) D.bad[y] = true; D.mode = "free"; D.dealt = null; };
  put(0.260, 0.200, 0.60, [1976, 1996]);
  const l6 = D_sizes(D.b, D.d, D.h, D.bad);
  check("D the Lesson 6 model still fits the record", D_miss(l6) < 200,
        "it sits " + D_miss(l6).toFixed(0) + " moose off the counted record");

  const agree = [];
  for (const sizes of [new Array(42).fill(700),
                       (() => { const a = new Array(42).fill(900); for (let i = 20; i < 23; i++) a[i] = 18; return a; })(),
                       (() => { const a = new Array(42).fill(900); for (let i = 11; i < 31; i++) a[i] = 58; return a; })()]) {
    const f = acrossGenerations(sizes);
    const m = D_measuredN(D_runHerds(sizes, 400, 4242 + Math.round(f)));
    agree.push([f, m, Math.abs(m - f) / f]);
  }
  check("D the arithmetic matches the forty herds", agree.every(r => r[2] < 0.25),
        agree.map(r => "says " + r[0].toFixed(0) + ", herds measure " + r[1].toFixed(0)).join("  "));
  check("D a crash is worth far less than its own average",
        agree[1][0] < 0.5 * mn((() => { const a = new Array(42).fill(900); for (let i = 20; i < 23; i++) a[i] = 18; return a; })()),
        "900 with a three-winter crash to 18 averages " +
        mn((() => { const a = new Array(42).fill(900); for (let i = 20; i < 23; i++) a[i] = 18; return a; })()).toFixed(0) +
        " and is worth " + agree[1][0].toFixed(0));

  /* D1, the committed estimate: on the record as Lesson 6 left it, a typical
     herd barely moves. The misconception is that forty-two winters of a
     thousand moose does something to a gene, so the bar has to reject 0.25
     and 0.50 -- the two answers a student who has not looked gives. */
  put(0.260, 0.200, 0.60, [1976, 1996]);
  const P0 = D_runHerds(D_sizes(D.b, D.d, D.h, D.bad), 200, 1959);
  const t1 = D_dist(P0), tol1 = Math.max(0.015, 0.3 * t1);
  check("D1 truth", t1 > 0 && t1 < 0.12, "a typical herd ends " + t1.toFixed(3) + " from where it started");
  check("D1 rejects 'it wanders a long way'", Math.abs(0.25 - t1) > tol1 && Math.abs(0.50 - t1) > tol1,
        "0.25 and 0.50 both miss a truth of " + t1.toFixed(3) + " (tol " + tol1.toFixed(3) + ")");

  /* D2 is the roll, and its target is a WINDOW: between 12 and 24 of the
     forty outside 0.35-0.65. Two-sided on purpose -- doing nothing
     undershoots and flattening the herd overshoots, so aiming is the skill.
     Both of those have to be true or the window is decoration. */
  const outsideFor = (b, d, h, bad, k) => { put(b, d, h, bad);
    return D_outside(D_runHerds(D_sizes(D.b, D.d, D.h, D.bad), D_HERDS, 7000 + k)); };
  const doNothing = [0,1,2,3].map(k => outsideFor(0.260, 0.200, 0.60, [], k));
  check("D2 doing nothing undershoots the window", doNothing.every(v => v < D_WANT_LO),
        "no marked winters: " + doNothing.join("/") + " of 40 outside, window is " + D_WANT_LO + "-" + D_WANT_HI);
  const flatten = [0,1,2,3].map(k => outsideFor(0.0, 0.60, 0.80, MOOSE_Y.slice(0, -1), k));
  check("D2 flattening the herd overshoots it", flatten.every(v => v > D_WANT_HI),
        "every winter marked, deaths at 0.60: " + flatten.join("/") + " of 40 outside");
  /* And somewhere in between it is landable. Swept rather than asserted:
     the window corresponds to a record worth roughly 50 to 240 moose, and
     there are two routes into it -- lean on the death rate, or mark a
     handful of winters and leave the rates alone. Both are checked, because
     a window only one route reaches is a window with one answer. */
  const landed = [];
  for (const d of [0.255, 0.26, 0.265, 0.27, 0.275, 0.28, 0.285])
    if ([0,1,2,3,4].map(k => outsideFor(0.260, d, 0.60, [1976, 1996], k))
                   .filter(v => v >= D_WANT_LO && v <= D_WANT_HI).length >= 3)
      landed.push("deaths " + d.toFixed(3) + " on the Lesson 6 winters");
  for (const n of [3, 4, 5, 6]) {
    const bad = []; for (let i = 0; i < n; i++) bad.push(1970 + i * 4);
    if ([0,1,2,3,4].map(k => outsideFor(0.260, 0.200, 0.60, bad, k))
                   .filter(v => v >= D_WANT_LO && v <= D_WANT_HI).length >= 3)
      landed.push(n + " deep winters, rates left alone");
  }
  check("D2 the window is landable, by more than one route", landed.length >= 2,
        landed.length ? landed.join(" ;  ") : "nothing in the swept range landed 3 of 5 rolls");
  put(0.260, 0.200, 0.60, [1976, 1996]);

  /* D3, the closing rounds. Three classes in rotation; no constant clears
     three, and in particular the plain average of the record does not. */
  const rg = mulberry32(808), iv = [];
  for (let n = 0; n < 3; n++) { const r = D.game.round(rg, n); iv.push([r.truth - r.tol, r.truth + r.tol, mn(r.sizes)]); }
  const lo = Math.max(...iv.map(v=>v[0])), hi = Math.min(...iv.map(v=>v[1]));
  check("D3 no constant clears", lo > hi,
        "three rounds: " + iv.map(v=>"["+v[0].toFixed(0)+","+v[1].toFixed(0)+"]").join(" "));
  const avgClears = iv.filter(v => v[2] >= v[0] && v[2] <= v[1]).length;
  check("D3 the plain average clears at most the steady round", avgClears <= 1,
        "the record's own average clears " + avgClears + " of 3: " +
        iv.map(v => "avg " + v[2].toFixed(0) + " vs [" + v[0].toFixed(0) + "," + v[1].toFixed(0) + "]").join("  "));

  /* D4, the wolves: the plain average must miss at every window the slider
     reaches, or the panel is making a claim the record does not support. */
  {
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
  }
}

/* ---- E. four arrows into one junction ----------------------------------- */
{
  /* The stage's claim is that three of the four causes shrink a herd
     WITHOUT taking a body off the island, and that what they come to
     together is a product. E_formula prints that product; E_batch runs the
     herds. They have to agree, or the stage is asserting arithmetic the
     simulation does not produce. Ne is read back out of the spread of end
     frequencies, the same way Stage D does it, rather than compared against
     a second formula. */
  const neOf = (cfg, k, seed) => {
    const P = E_batch(cfg, k, seed);
    const T = P[0].length - 1;
    const v = mn(P.map(t => { const d = t[T] - 0.5; return d * d; }));
    const r = Math.min(Math.max(1 - v / 0.25, 1e-12), 1 - 1e-12);
    return 1 / (2 * (1 - Math.pow(r, 1 / T)));
  };
  const rows = [
    ["bodies only",  { N: 24,  depth: null, males: null, cv: 0 }],
    ["a crash",      { N: 100, depth: 10,   males: null, cv: 0 }],
    ["a lopsided lek", { N: 100, depth: null, males: 6,  cv: 0 }],
    ["uneven broods",  { N: 100, depth: null, males: null, cv: 1.8 }]
  ].map(([name, cfg]) => [name, E_formula(cfg), neOf(cfg, 300, 2026 + cfg.N)]);
  check("E the four-way arithmetic matches the herds",
        rows.every(r => Math.abs(r[2] - r[1]) / r[1] < 0.30),
        rows.map(r => r[0] + ": says " + r[1].toFixed(1) + ", herds measure " + r[2].toFixed(1)).join("  "));
  check("E three of the four shrink it with a hundred bodies on the island",
        rows.slice(1).every(r => r[1] < 60),
        rows.slice(1).map(r => r[0] + " -> " + r[1].toFixed(1) + " of 100").join("  "));

  /* The ladder. Every rung has to be REACHABLE with the arrows it has been
     handed, and OUT OF REACH with the arrows of the rung below it. The
     second half is what the per-rung slider floors buy: a crash alone
     reaches 35 of the forty, so without a floor on it rungs 3 and 4 are
     both clearable with rung 2's arrow and handing over an arrow means
     nothing. The floors are read off E_RUNGS rather than restated here. */
  const bestIn = (sweep, k, seed) => {
    let hi = -1, at = null;
    for (const cfg of sweep) {
      const g = E_gone(E_batch(Object.assign({}, base, cfg), k, seed));
      if (g > hi) { hi = g; at = cfg; }
    }
    return { hi, at };
  };
  const reps = (cfg, k, n) => { const v = []; for (let r = 0; r < n; r++) v.push(E_gone(E_batch(Object.assign({}, base, cfg), k, 12000 + r * 7919))); return v; };
  const lands = (cfg, rung, n) => reps(cfg, E_HERDS, n)
        .filter(v => v >= rung.lo && v <= (rung.hi == null ? E_HERDS : rung.hi)).length;
  const base = { N: 100, depth: null, males: null, cv: 0 };
  const floorOf = (i, k) => { for (let r = 1; r <= i; r++) { const f = E_RUNGS[r].floors; if (f && f[k] != null) return f[k]; } return null; };

  // rung 1 -- the headcount, and only the headcount
  {
    const R = E_RUNGS[0];
    const best = [24, 28, 32, 36].map(N => [N, lands({ N }, R, 6)]).reduce((a, b) => b[1] > a[1] ? b : a);
    check("E rung 1 landable", best[1] >= 4,
          "N=" + best[0] + " lands " + best[1] + " of 6 rolls in " + R.lo + "-" + R.hi);
    check("E rung 1 not already cleared", lands({}, R, 4) === 0,
          "a hundred bodies, no arrows: " + reps({}, E_HERDS, 4).join("/") + " of " + E_HERDS);
    check("E rung 1 is two-sided", lands({ N: 6 }, R, 4) === 0 && lands({ N: 300 }, R, 4) === 0,
          "bottoming the slider gives " + reps({ N: 6 }, E_HERDS, 3).join("/") +
          " and topping it gives " + reps({ N: 300 }, E_HERDS, 3).join("/"));
  }
  // rung 2 -- bodies pinned at a hundred, the crash handed over
  {
    const R = E_RUNGS[1];
    const best = [4, 6, 8, 10].map(d => [d, lands({ depth: d }, R, 6)]).reduce((a, b) => b[1] > a[1] ? b : a);
    check("E rung 2 landable on the crash", best[1] >= 4,
          "depth=" + best[0] + " lands " + best[1] + " of 6 rolls at " + R.lo + "+");
    check("E rung 2 needs the crash", lands({}, R, 4) === 0,
          "no arrows at a hundred bodies: " + reps({}, E_HERDS, 4).join("/"));
  }
  // rungs 3 and 4 -- each one is handed an arrow and loses the cheap route
  for (const idx of [2, 3]) {
    const R = E_RUNGS[idx], dFloor = floorOf(idx, "depth"), mFloor = floorOf(idx, "males");
    const sweepD = [dFloor, dFloor + 10, dFloor + 20].map(depth => ({ depth }));
    const sweepM = idx === 2 ? [2, 3, 5, 8].map(males => ({ males }))
                             : [mFloor, mFloor + 5, mFloor + 15].map(males => ({ males }));
    const sweepC = idx === 2 ? [{}] : [{ cv: 1.2 }, { cv: 1.6 }, { cv: 2.0 }];
    const withNew = [];
    for (const a of sweepD) for (const b of sweepM) for (const c of sweepC)
      withNew.push(Object.assign({}, a, b, c));
    const bn = withNew.map(c => [c, lands(c, R, 6)]).reduce((a, b) => b[1] > a[1] ? b : a);
    check("E rung " + (idx + 1) + " landable with its new arrow", bn[1] >= 4,
          JSON.stringify(bn[0]) + " lands " + bn[1] + " of 6 rolls at " + R.lo + "+");
    // the same settings with the new arrow rubbed out
    const without = withNew.map(c => { const d = Object.assign({}, c);
      if (idx === 2) delete d.males; else delete d.cv; return d; });
    const bw = bestIn(without, E_HERDS, 4242);
    check("E rung " + (idx + 1) + " out of reach without it", bw.hi < R.lo,
          "best without the new arrow: " + bw.hi + " of " + E_HERDS + " (" + JSON.stringify(bw.at) + "), rung asks " + R.lo);
  }

  /* E1, the committed estimate, taken before a single arrow is drawn. The
     two answers a student who has not looked gives are "none of them" and
     "all of them", and the bar has to reject both. */
  const e1 = [];
  for (let r = 0; r < 6; r++) e1.push(E_gone(E_batch(base, 40, 5000 + r * 7919)));
  const t1 = mn(e1);
  check("E1 truth", t1 >= 0 && t1 < 6,
        "a hundred bodies, sixty generations, nothing drawn: " + t1.toFixed(1) + " of 40 lose an allele");
  check("E1 rejects the two answers a student gives without looking",
        Math.abs(20 - t1) > 5 && Math.abs(40 - t1) > 5,
        "20 and 40 both miss " + t1.toFixed(1) + " by more than the tolerance of 5");
  check("E1 is worth asking -- the ladder moves it a long way",
        mn([0,1,2].map(r => E_gone(E_batch(Object.assign({}, base, { depth: 40, males: 25, cv: 2 }), 40, 8000 + r * 131)))) > t1 + 20,
        "the same hundred bodies with three arrows drawn lose far more");

  /* E3, the closing rounds: three classes, no constant clears three, and
     the misconception -- that the headcount is the number -- clears none. */
  const rg = mulberry32(1234), iv = [];
  for (let n = 0; n < 3; n++) { const r = E.game.round(rg, n); iv.push([r.truth - r.tol, r.truth + r.tol, r.cfg]); }
  const lo = Math.max(...iv.map(v=>v[0])), hi = Math.min(...iv.map(v=>v[1]));
  check("E4 no constant clears", lo > hi,
        "rounds: " + iv.map(v => "[" + v[0].toFixed(0) + "," + v[1].toFixed(0) + "]").join("  "));
  check("E4 rejects 'they all lose one' and 'none of them'",
        iv.filter(v => 40 >= v[0] && 40 <= v[1]).length === 0 && iv.filter(v => 0 >= v[0] && 0 <= v[1]).length === 0,
        "40 of 40 clears " + iv.filter(v => 40 >= v[0] && 40 <= v[1]).length + " of 3 rounds");

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
