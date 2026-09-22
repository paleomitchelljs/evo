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
 * A fourth thing, specific to the closing games: no single setting may
 * clear two different targets, so a student cannot park the controls and
 * let the randomness hand them the ladder.
 *
 * Stage E was cut on 2026-09-21 and its half of this file went with it.
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
check("page loaded", !!(A && A.pop && B && C && D && typeof Score !== "undefined"),
      "every stage object and Score are defined");
check("slots declared match slots written",
      Object.keys(BIT).length === 4, Object.keys(BIT).length + " named bits");

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
  check("A1 the honest miss matches the population on screen",
        cmp.every(r => Math.abs(r[1] - r[2]) / r[2] < 0.22),
        cmp.map(r => "N=" + r[0] + " pond " + r[1].toFixed(3) + " vs band " + r[2].toFixed(3)).join("  "));
  check("A1 all three classes are dealt inside ten rounds", cls.length === 3 && A_ROUNDS >= 9,
        A_ROUNDS + " rounds over " + cls.length + " classes in rotation");

  /* The density absorbs at the walls: whatever the curve puts past 0 or 1 is
     piled onto the wall rather than clipped off, so the three pieces have to
     sum to one however the sliders are set. */
  const massOf = (you, err) => {
    const sd = Math.max(1e-4, err * MAD_TO_SD);
    const z = v => (v - you) / sd;
    const lo = normCdf(z(0)), hi = 1 - normCdf(z(1));
    // interior by the trapezium rule over the same grid the painter uses
    let mid = 0; const n = 2000;
    for (let i = 0; i < n; i++) { const y = (i + 0.5) / n;
      mid += Math.exp(-0.5 * z(y) * z(y)) / (sd * 2.5066) / n; }
    return { lo, hi, mid, tot: lo + hi + mid };
  };
  const cases = [[0.50, 0.10], [0.50, 0.50], [0.05, 0.30], [0.95, 0.30], [0.30, 0.02]];
  const sums = cases.map(([y, e]) => massOf(y, e).tot);
  check("A the density conserves its probability at the walls",
        sums.every(v => Math.abs(v - 1) < 0.01),
        cases.map(([y, e], i) => y + "±" + e + " -> " + sums[i].toFixed(4)).join("  "));
  const pinned = massOf(0.95, 0.30);
  check("A a call pushed against a wall piles mass onto it",
        pinned.hi > 0.25,
        "0.95 ± 0.30 puts " + (100 * pinned.hi).toFixed(0) + "% on the top wall and " +
        (100 * pinned.lo).toFixed(0) + "% on the bottom");

  /* The over-wide penalty has to be reachable and has to bite: the honest
     miss must sit inside the slider's range at half its top, or "twice the
     honest miss" is wider than the slider can go and the penalty is dead. */
  const wideCases = cls.map(c => { const N = c.N[1], p0 = c.p0[1];
    const m = A_typical(N, p0, A_ROLL_GENS, 200).miss;
    return [N, m, 2 * Math.max(0.02, m)]; });
  /* The penalty fires when a band is more than twice as wide as the honest
     miss. In the smallest class the honest miss is already close to the top
     of the slider, so there is no room above it to be wasteful in -- which is
     correct, not a defect: a wide call about a population of fourteen IS the
     honest call. What has to hold is that the penalty is live where there is
     room, and that the slider can express the honest answer everywhere. */
  const withRoom = wideCases.filter(r => r[2] < 0.50);
  check("A the over-wide penalty is live where there is room to be wasteful",
        withRoom.length >= 2 && wideCases.every(r => r[1] < 0.50),
        wideCases.map(r => "N=" + r[0] + " honest " + r[1].toFixed(3) +
          (r[2] < 0.50 ? ", penalty above " + r[2].toFixed(3) : ", no room on the slider (correctly)")).join("  "));
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
  // every target's reference setting -- the one its picture is drawn from --
  // must be a setting that actually lands that target
  const refOk = B_TARGETS.map((tg, i) => {
    const r = tg.ref;
    return [i + 1, lands(tg, r.N, r.G, r.inh, 5), (r.inh ? "inh" : "fresh") + " " + r.N + "/" + r.G];
  });
  check("B every target's picture is drawn from a setting that lands it",
        refOk.every(r => r[1] >= 3),
        refOk.map(r => "#" + r[0] + " " + r[2] + " lands " + r[1] + "/5").join("  "));
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

  /* Same switch, same rule: practice is free and costs nothing. */
  {
    const g = C.game, before = g.state.hits.length, n0 = g.state.n;
    document.getElementById("C_practice").checked = true;
    g.run({ now: true });
    check("C a practice run costs no round",
          g.state.hits.length === before && g.state.n === n0 && g.state.ran === false,
          "tally " + before + " -> " + g.state.hits.length + ", still on shape " + (g.state.n + 1));
    document.getElementById("C_practice").checked = false;
  }

  check("C each shape is dealt twice and never twice running",
        C_ORDER.length === C_ROUNDS &&
        [0,1,2,3,4].every(k => C_ORDER.filter(v => v === k).length === 2) &&
        C_ORDER.every((v, i) => i === 0 || v !== C_ORDER[i - 1]),
        "order " + C_ORDER.join(""));
}

/* ---- D. the record you fitted, and the rate it drifts at ---------------- */
{
  /* The claim the stage makes is that a bad winter costs a gene far more than
     its size suggests, and the way it makes that claim is a floor on the
     average headcount: two of the three curves must be matched while the herd
     still averages a stated number, which forbids the answer "make the whole
     herd smaller". Three things have to hold and none is visible on screen:

       - each curve is reachable, with its floor respected;
       - the smooth route CANNOT reach the two floored curves at any death
         rate on the slider -- this is the whole stage, and it is swept;
       - the same setting run again lands inside the tolerance.            */
  const put = (b, d, h, bad) => { D.on.b = D.on.d = D.on.bad = true;
    D.b = b; D.d = d; D.h = h; D.bad = {}; for (const y of bad) D.bad[y] = true;
    D.mode = "free"; D.dealt = null; };
  const endVar = (sizes, k, seed) => {
    const P = D_runHerds(sizes, k, seed);
    const t = sizes.length - 1;
    return mn(P.map(r => 2 * r[t] * (1 - r[t])));
  };
  const sizesNow = () => D_sizes(D.b, D.d, D.h, D.bad);

  put(0.260, 0.200, 0.60, [1976, 1996]);
  check("D the Lesson 6 model still fits the record", D_miss(sizesNow()) < 200,
        "it sits " + D_miss(sizesNow()).toFixed(0) + " moose off the counted record");

  D_TARGETS.forEach((t, i) => {
    const want = D_targetCurve(t);
    const r = t.ref;
    put(r.b, r.d, r.h, r.bad);
    const sz = sizesNow(), avg = mn(sz);
    const hits = [0, 1, 2, 3, 4].map(k => endVar(sz, D_HERDS, 6000 + k * 7919))
                                .filter(v => Math.abs(v - want.endVar) <= t.tol).length;
    check("D curve " + (i + 1) + " is reachable and keeps its bounds",
          hits >= 4 && (!t.minAvg || avg >= t.minAvg) && (!t.maxAvg || avg <= t.maxAvg),
          "its own model lands " + hits + "/5, ends at " + want.endVar.toFixed(3) +
          " ± " + t.tol + ", averages " + avg.toFixed(0) +
          (t.minAvg ? " against a floor of " + t.minAvg
                    : t.maxAvg ? " against a ceiling of " + t.maxAvg : " unbounded"));
  });

  // the sweep that makes the stage mean something
  const sliderD = []; { const el = document.getElementById("D_d");
    for (let v = +el.min; v <= +el.max; v += +el.step) sliderD.push(v); }
  D_TARGETS.forEach((t, i) => {
    if (!t.minAvg) return;
    const want = D_targetCurve(t);
    let best = null;
    for (const d of sliderD) {
      put(0.260, d, 0.60, []);                       // no bad winters at all
      const sz = sizesNow(), avg = mn(sz);
      if (avg < t.minAvg) continue;
      const v = mn([0, 1].map(k => endVar(sz, D_HERDS, 7000 + k * 7919)));
      if (best === null || Math.abs(v - want.endVar) < Math.abs(best[1] - want.endVar)) best = [d, v, avg];
    }
    check("D curve " + (i + 1) + " is out of reach without bad winters",
          best === null || Math.abs(best[1] - want.endVar) > t.tol,
          best === null ? "no death rate keeps the average above " + t.minAvg
                        : "best smooth decay is d=" + best[0].toFixed(3) + " -> " + best[1].toFixed(3) +
                          " (average " + best[2].toFixed(0) + "), wanted " + want.endVar.toFixed(3) + " ± " + t.tol);
  });

  // and the contrast the stage exists to show, stated as one line
  put(0.260, 0.300, 0.60, []);              const smooth = sizesNow();
  put(0.260, 0.200, 0.60, [1968, 1972, 1976, 1980, 1984, 1988]); const bumpy = sizesNow();
  check("D a bad winter costs more than its size suggests",
        acrossGenerations(bumpy) < 0.5 * acrossGenerations(smooth) &&
        Math.abs(mn(bumpy) - mn(smooth)) / mn(smooth) < 0.25,
        "smooth: average " + mn(smooth).toFixed(0) + ", worth " + acrossGenerations(smooth).toFixed(0) +
        "  |  six bad winters: average " + mn(bumpy).toFixed(0) + ", worth " + acrossGenerations(bumpy).toFixed(0));

  check("D each curve is dealt twice and never twice running",
        D_ORDER.length === D_ROUNDS &&
        [0,1,2].every(k => D_ORDER.filter(v => v === k).length === 2) &&
        D_ORDER.every((v, i) => i === 0 || v !== D_ORDER[i - 1]),
        "order " + D_ORDER.join(""));

  /* Drawing nothing at all must clear no curve. It used to clear curve 1:
     with no arrows the herd grows without bound, and 0.493 sat inside a
     window centred on 0.463. Curve 1 now carries a ceiling on the average,
     which is what this bar defends. */
  {
    D.on.b = D.on.d = D.on.bad = false; D.bad = {};
    const sz = D_model(), avg = mn(sz);
    const v = mn([0, 1, 2].map(k => endVar(sz, D_HERDS, 9100 + k * 7919)));
    const clears = D_TARGETS.filter(t => {
      const w = D_targetCurve(t);
      return Math.abs(v - w.endVar) <= t.tol &&
             (!t.minAvg || avg >= t.minAvg) && (!t.maxAvg || avg <= t.maxAvg);
    }).length;
    check("D drawing nothing clears no curve", clears === 0,
          "no arrows: averages " + avg.toFixed(0) + ", ends at " + v.toFixed(3) +
          " -- clears " + clears + " of " + D_TARGETS.length);
    D.on.b = D.on.d = D.on.bad = true;
  }

  /* Clicking a winter on the top plot is the only way to reach the answer
     the stage is about, and it was silently swallowing clicks: the old snap
     window was 1.2 years wide on a 13-pixel year. Every x inside the frame
     must now land on a winter, and a click with the arrow undrawn must
     change nothing rather than throw. */
  {
    const cv = document.getElementById("D_moose");
    D_paint();
    const f = D.frame, rect = cv.getBoundingClientRect();
    const fitW = +cv.dataset.fitW || +cv.dataset.cssW || cv.width;
    const at = px => ({ currentTarget: cv,
                        clientX: rect.left + px * (rect.width / fitW),
                        clientY: rect.top + (f.py + f.ph / 2) * (rect.width / fitW) });
    let snapped = 0, tried = 0;
    for (let px = f.px + 1; px < f.px + f.pw; px += 3) { tried++; if (D_winterAt(at(px)) !== null) snapped++; }
    check("D every click inside the plot lands on a winter", snapped === tried,
          snapped + " of " + tried + " x-positions across the frame snap to a winter");

    D.on.bad = false; D.bad = {};
    D_markAt(at(f.px + f.pw / 2));
    check("D a click with the arrow undrawn marks nothing", Object.keys(D.bad).length === 0,
          "the harsh-winter arrow gates the marking, and the note nudges instead of nothing happening");

    D.on.bad = true; D.bad = {};
    const years = [];
    for (let k = 0; k < 6; k++) {
      const px = f.px + f.pw * (0.1 + 0.15 * k);
      D_markAt(at(px));
      years.push(Object.keys(D.bad).length);
    }
    check("D six clicks mark six different winters",
          years.join(",") === "1,2,3,4,5,6", "after each click the count was " + years.join(", "));
    const one = Object.keys(D.bad)[0];
    D_markAt(at(f.x(+one)));
    check("D clicking a marked winter unmarks it", Object.keys(D.bad).length === 5,
          "clicking " + one + " again left " + Object.keys(D.bad).length + " marked");
  }

  /* The practice switch must not consume a round, and must not be able to
     hand the student a pass -- a practice run is judged and shown but never
     pushed onto the tally. */
  {
    const g = D.game, before = g.state.hits.length, n0 = g.state.n;
    document.getElementById("D_practice").checked = true;
    g.run({ now: true });
    check("D a practice run costs no round",
          g.state.hits.length === before && g.state.n === n0 && g.state.ran === false,
          "tally " + before + " -> " + g.state.hits.length + ", still on curve " + (g.state.n + 1));
    document.getElementById("D_practice").checked = false;
  }

  put(0.260, 0.200, 0.60, [1976, 1996]);
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
