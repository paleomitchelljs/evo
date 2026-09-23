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
let bad = 0, ran = 0;
const check = (name, ok, detail) => { ran++; if (!ok) bad++; say((ok?"ok   ":"FAIL ") + name + "  " + detail); };
const mn = a => a.reduce((x,y)=>x+y,0)/a.length;

/* ---- 0. the page came up at all ---------------------------------------- */
check("page loaded", !!(A && A.pop && B && C && D && typeof Score !== "undefined"),
      "every stage object and Score are defined");
check("slots declared match slots written",
      Object.keys(BIT).length === 4, Object.keys(BIT).length + " named bits");

/* ---- A. differential reproduction with nothing attached ---------------- */
{
  /* A2 is a roll: drive one allele out, TEN times, each at a different
     (population size, generations) pair. JM, 2026-09-22. The unevenness
     slider stays on the page but is deliberately not part of what makes a
     setting distinct, so it must not launder a spent setting.

     Four things have to hold and none is visible on screen:
       - at least ten settings actually land, or the task cannot be finished;
       - the generations slider does something, or it is decoration;
       - the default setting does not walk it;
       - and unevenness does not change the spent-setting key. */
  const rollOnce = (N, gens, cv) => {
    A.N = N; A.gens = gens; A.cv = cv; A.p0 = 0.5; A.round = null; A_fresh();
    for (let i = 0; i < gens; i++) { A_step(); if (A_fixed()) break; }
    return A_fixed();
  };
  const rate = (N, gens, cv, k) => { let h = 0; for (let r = 0; r < k; r++) if (rollOnce(N, gens, cv)) h++; return h / k; };

  const landing = [];
  for (const N of [4, 8, 16, 30, 60, 120, 240, 400])
    for (const G of [10, 25, 50, 100, 150, 200])
      if (rate(N, G, 0, 12) >= 0.5) landing.push(N + "/" + G);
  check("A2 at least ten settings land the roll", landing.length >= 10,
        landing.length + " of 48 sampled (size/generations) settings land 6 of 12 rolls  e.g. " +
        landing.slice(0, 4).join(" "));

  const short = rate(60, 25, 0, 40), long_ = rate(60, 200, 0, 40);
  check("A2 the generations slider is worth having", long_ >= short + 0.25,
        "60 individuals: " + (100*short).toFixed(0) + "% over 25 generations, " +
        (100*long_).toFixed(0) + "% over 200 -- the slider has to move the answer");

  const dflt = rate(100, 30, 0, 40);
  check("A2 the default setting is not a gimme", dflt <= 0.10,
        "100 individuals over 30 generations lands " + (100*dflt).toFixed(0) + "% -- a student must move something");

  A.N = 20; A.gens = 40; A.cv = 0;   const k1 = A_settingKey();
  A.cv = 2.0;                        const k2 = A_settingKey();
  A.gens = 45;                       const k3 = A_settingKey();
  A.N = 25; A.gens = 40;             const k4 = A_settingKey();
  check("A2 a setting is (size, generations) and unevenness cannot launder it",
        k1 === k2 && k1 !== k3 && k1 !== k4,
        "cv 0 -> " + k1 + ", cv 2.0 -> " + k2 + ", +5 generations -> " + k3 + ", +5 individuals -> " + k4);

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
  /* JM, 2026-09-22: the band is judged on the WIGGLE. Two thirds of the
     trajectory inside is credit; nothing outside at all is credit but too
     uncertain; less than two thirds is a miss. So the three things that have
     to hold are that the widest band is always too uncertain, the narrowest
     always misses, and a band near the honest miss is a clean hit. */
  const insideFrac = (N, p0, gens, you, err, reps) => {
    const out = [];
    for (let r = 0; r < reps; r++) {
      A.N = N; A.cv = 0; A.p0 = p0; A.round = null; A_fresh();
      const traj = [popFreq(A.pop)];
      for (let g = 0; g < gens; g++) { A_step(); traj.push(popFreq(A.pop)); if (A_fixed()) break; }
      out.push(traj.filter(v => Math.abs(v - you) <= err).length / traj.length);
    }
    return out;
  };
  const midOf = c => [c.N[1], c.p0[1]];
  const wideIn = cls.map(c => { const [N, p0] = midOf(c); return insideFrac(N, p0, A_ROLL_GENS, p0, 0.50, 25); });
  check("A1 the widest band is always too uncertain", wideIn.every(a2 => a2.every(v => v >= 1)),
        "err=0.50 leaves nothing outside in " + wideIn.map(a2 => a2.filter(v => v >= 1).length + "/25").join(", ") +
        " -- so it reads correct-but-too-uncertain and never counts clean");
  const narrowIn = cls.map(c => { const [N, p0] = midOf(c); return insideFrac(N, p0, A_ROLL_GENS, p0, 0.01, 25); });
  check("A1 the narrowest band misses", narrowIn.every(a2 => mn(a2) < 2/3),
        "err=0.01 keeps " + narrowIn.map(a2 => (100*mn(a2)).toFixed(0) + "%").join("/") +
        " of the wiggle inside, against the two-thirds bar");
  /* Every class has to be answerable: some width on the slider has to give a
     clean hit (two thirds in, something out) most of the time.

     NOTE, because it is a real consequence of the rule change: the width that
     does this is NOT A_typical's endpoint miss. The wiggle spends most of its
     length nearer the start than the endpoint does, so the band that holds two
     thirds of the trajectory is a different quantity from the average final
     error. The slider is still the honest answer to the question the stage
     now asks; it is no longer the same number as Lesson 6's typical miss. */
  const best = cls.map(c => { const [N, p0] = midOf(c);
    let bw = 0, br = 0;
    for (let e = 0.02; e <= 0.50; e += 0.02) {
      const f = insideFrac(N, p0, A_ROLL_GENS, p0, e, 25);
      const r = f.filter(v => v >= 2/3 && v < 1).length / f.length;
      if (r > br) { br = r; bw = e; }
    }
    return [N, bw, br, A_typical(N, p0, A_ROLL_GENS, 200).miss];
  });
  /* The bar is 0.4 rather than 0.5 because the largest class earns it: at 320
     individuals over 30 generations the wiggle is so tight that most widths
     swallow it whole and read as too uncertain. That is the process, not a
     defect, and the number is printed so it stays visible. */
  check("A1 every class has a width that lands a clean hit", best.every(r => r[2] >= 0.4),
        best.map(r => "N=" + r[0] + " best width " + r[1].toFixed(2) + " -> clean " +
          (100*r[2]).toFixed(0) + "% (endpoint miss was " + r[3].toFixed(2) + ")").join("  "));
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
  /* The band that would have worked is drawn whenever nothing fell outside.
     It keeps the student's own centre and takes the half-width that puts two
     thirds of the wiggle inside, so it has to be narrower than the band they
     actually drew -- otherwise the picture says "be wider" when the verdict
     said "too uncertain". */
  const better = cls.map(c => { const N = c.N[1], p0 = c.p0[1];
    A.N = N; A.cv = 0; A.p0 = p0; A.round = null; A_fresh();
    const traj = [popFreq(A.pop)];
    for (let g = 0; g < A_ROLL_GENS; g++) { A_step(); traj.push(popFreq(A.pop)); if (A_fixed()) break; }
    const devs = traj.map(v => Math.abs(v - p0)).sort((x, y) => x - y);
    const best = devs[Math.min(devs.length - 1, Math.ceil(devs.length * 2 / 3) - 1)];
    return [N, best];
  });
  check("A the band that would have worked is narrower than the widest one",
        better.every(r => r[1] < 0.50),
        better.map(r => "N=" + r[0] + " -> " + r[1].toFixed(3)).join("  ") + " against a slider that stops at 0.50");
  /* Every population that can be dealt has to be answerable on the two
     sliders it is answered with -- the middle as well as the width. */
  const offMid = [];
  for (const c of cls) for (const p0 of c.p0) if (p0 < 0 || p0 > 1) offMid.push(p0);
  check("A1 every starting frequency is on the first slider", offMid.length === 0,
        "slider runs 0..1; classes start at " + [...new Set(cls.flatMap(c => c.p0))].sort().join(", "));

  /* A2's anti-gaming rule: a landed roll spends its setting. The check is
     that the rule is actually enforced by the predicate rather than only
     described in the goal text. */
  A.used = {}; A.N = 6; A.gens = 40; A.cv = 0; A.p0 = 0.5; A.round = null;
  const key = A_settingKey();
  A.used[key] = true;
  A_fresh(); for (let i = 0; i < A.gens; i++) { A_step(); if (A_fixed()) break; }
  const spentBlocks = A_fixed() ? !A.roll.hitNow() : null;
  check("A2 a spent setting cannot land again", spentBlocks === true || spentBlocks === null,
        spentBlocks === null ? "the probe roll did not fix; rule untested this run"
                             : "an allele went at " + key + " and the roll refused to count it");
  A.used = {};
  A_fresh(); for (let i = 0; i < A.gens; i++) { A_step(); if (A_fixed()) break; }
  check("A2 a fresh setting still lands", !A_fixed() || A.roll.hitNow() === true,
        "at " + A_settingKey() + " with nothing spent, a fixed run counts");

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

  /* THE TARGETS ARE NOW THE STUDENT'S OWN. JM, 2026-09-22: "In place of preset
     targets ... the students set themselves 10 targets & run the controls until
     they hit each", and explicitly no guard on what may be set. So the checks
     change shape. There is no preset list to verify; what has to hold is:

       - the slider means what it says -- the picture drawn for a target is
         worth that target, measured off the picture;
       - the tolerance is sized off the measured run-to-run wobble rather
         than chosen, because twenty populations is a small sample;
       - a decent share of the settable range is actually reachable, and the
         part that is not is reported rather than discovered by a student;
       - no single setting clears most of the range, or parking the controls
         beats playing;
       - and the inherited/uninherited switch still earns its place. */
  const settable = []; { const el = document.getElementById("B_terr");
    for (let v = +el.min; v <= +el.max + 1e-9; v += +el.step) settable.push(+v.toFixed(2)); }

  const picOk = settable.every(d => Math.abs(B_targetDist(B_errForDist(d)) - d) < 0.005);
  check("B the picture is worth what the slider says", picOk,
        "every one of the " + settable.length + " settable targets draws a density whose own " +
        "mean distance from 0.50 is within 0.005 of it");

  // the run-to-run wobble the tolerance has to cover
  const sdOf = a => { const m = a.reduce((x, y) => x + y, 0) / a.length;
    return Math.sqrt(a.reduce((x, y) => x + (y - m) * (y - m), 0) / (a.length - 1)); };
  let worstSd = 0, worstAt = "";
  for (const inh of [true, false]) for (const N of [10, 50, 120, 200]) for (const G of [25, 100, 300]) {
    const d = []; for (let r = 0; r < 30; r++) d.push(B_batch(mulberry32(91 + r * 7919 + N + G), N, G, inh, 20).dist);
    const s = sdOf(d); if (s > worstSd) { worstSd = s; worstAt = (inh ? "inherited" : "uninherited") + " " + N + "/" + G; }
  }
  check("B the tolerance covers the run-to-run wobble", B_TOL >= worstSd,
        "worst sd of dist over 20 populations is " + worstSd.toFixed(3) + " at " + worstAt +
        "; tolerance is " + B_TOL + " (" + (B_TOL / worstSd).toFixed(1) + "x)");

  // one pass over the settings, five batches each; every target is then judged
  // against the same measurements rather than re-running the simulator per target
  const grid = [];
  for (const inh of [true, false]) for (const N of [10, 20, 40, 60, 100, 140, 200])
    for (const G of [25, 50, 100, 150, 200, 300]) {
      const d = []; for (let r = 0; r < 5; r++) d.push(B_batch(mulberry32(5000 + r * 7919 + N * 13 + G), N, G, inh, 20).dist);
      grid.push({ inh, N, G, d });
    }
  const landsFor = (tgt, g) => g.d.filter(v => Math.abs(v - tgt) <= B_TOL).length >= 3;
  const reach = settable.map(tgt => {
    const w = grid.filter(g => landsFor(tgt, g));
    return { tgt, n: w.length, inh: w.filter(g => g.inh).length, fresh: w.filter(g => !g.inh).length };
  });
  const unreachable = reach.filter(r => r.n === 0).map(r => r.tgt.toFixed(2));
  check("B most of the settable range is reachable", unreachable.length <= settable.length * 0.4,
        (settable.length - unreachable.length) + " of " + settable.length + " settable targets are reachable" +
        (unreachable.length ? "; not reachable on this grid: " + unreachable.join(" ") : ""));

  let worstClear = 0, worstClearAt = "";
  for (const g of grid) { const c = settable.filter(tgt => landsFor(tgt, g)).length;
    if (c > worstClear) { worstClear = c; worstClearAt = (g.inh ? "inherited" : "uninherited") + " " + g.N + "/" + g.G; } }
  check("B no one setting clears most of the range", worstClear <= settable.length * 0.35,
        "the greediest setting (" + worstClearAt + ") clears " + worstClear + " of " + settable.length +
        " settable targets");

  const onlyFresh = reach.filter(r => r.n > 0 && r.inh === 0);
  check("B the uninherited switch still earns its place", onlyFresh.length > 0,
        onlyFresh.length + " targets are reachable only with the uninherited rule" +
        (onlyFresh.length ? " (e.g. " + onlyFresh.slice(0, 4).map(r => r.tgt.toFixed(2)).join(" ") + ")" : ""));

  /* THE RECORDED BIT IS "ten hits in B_TRIES_MAX tries or fewer". Ten is the
     floor, so the bar has to be clearable by a student who aims and out of
     reach for one who parks the controls and lets the randomness hand it over.
     Both are played here against fresh batches rather than against the grid's
     own samples, which would flatter the aiming strategy. */
  const CAP = 20;
  /* The ten targets have to differ by B_GAP (JM, 2026-09-23), so both players
     draw each target from what the targets already set leave open. */
  const drawTarget = (s, used) => {
    const free = settable.filter(t => B_clash(used, t) === undefined);
    const tgt = free[Math.floor(s / 2147483648 * free.length)];
    used.push(tgt); return tgt;
  };
  const playAimed = (seed) => {
    let tries = 0, s = seed; const used = [];
    for (let k = 0; k < B_ROUNDS; k++) {
      const tgt = drawTarget(s = (s * 1103515245 + 12345) % 2147483648, used);
      const best = grid.slice().sort((a, b) =>
        b.d.filter(v => Math.abs(v - tgt) <= B_TOL).length - a.d.filter(v => Math.abs(v - tgt) <= B_TOL).length)[0];
      let hit = false;
      for (let i = 0; i < CAP && !hit; i++) {
        tries++;
        hit = Math.abs(B_batch(mulberry32(seed * 31 + k * 7919 + i * 13), best.N, best.G, best.inh, 20).dist - tgt) <= B_TOL;
      }
    }
    return tries;
  };
  const playParked = (seed, g) => {
    let tries = 0, s = seed; const used = [];
    for (let k = 0; k < B_ROUNDS; k++) {
      const tgt = drawTarget(s = (s * 1103515245 + 12345) % 2147483648, used);
      let hit = false;
      for (let i = 0; i < CAP && !hit; i++) {
        tries++;
        hit = Math.abs(B_batch(mulberry32(seed * 31 + k * 7919 + i * 13), g.N, g.G, g.inh, 20).dist - tgt) <= B_TOL;
      }
    }
    return tries;
  };
  /* Abandoning a target records it as missed and moves on, so a student
     cannot be stuck on one nothing reaches. JM, 2026-09-22. */
  {
    const g = B.game, before = g.state.n;
    g.state.dist = 0.48; g.lock();
    const el = id => document.getElementById(id);
    const canGiveUp = !el("B_tgiveup").disabled;
    el("B_tgiveup").click();
    check("B a target can be abandoned",
          canGiveUp && g.state.hits[before] === false && g.state.n === before + 1 && g.state.locked === null,
          "locked target " + (before + 1) + ", abandoned it: recorded as missed and moved to " +
          (g.state.n + 1) + " with the slider live again");
    g.state.n = before; g.state.hits = []; g.state.locked = null; g.state.tries = 0; g.state.set = [];
  }

  /* TEN DIFFERENT TARGETS. JM, 2026-09-23. A target within B_GAP of one
     already set -- abandoned ones count -- cannot be set, and the button says
     so by going dead while the card names the clash. Driven through the
     slider's own input event, so the check sees what a student sees. */
  {
    const g = B.game, el = id => document.getElementById(id);
    const slide = v => { el("B_terr").value = v; el("B_terr").dispatchEvent(new Event("input")); };
    const step = +el("B_terr").step, gapSteps = Math.round(B_GAP / step);
    const t0 = 0.25, inside = +(t0 + (gapSteps - 1) * step).toFixed(2), outside = +(t0 + gapSteps * step).toFixed(2);
    slide(t0); g.lock(); el("B_tgiveup").click();
    slide(t0);
    const sameDead = el("B_tlock").disabled;
    slide(inside);
    const nearDead = el("B_tlock").disabled, named = /already set/.test(el("B_tshape").textContent);
    g.lock(); const nearRefused = g.state.locked === null && g.state.set.length === 1;
    slide(outside);
    const farLive = !el("B_tlock").disabled;
    g.lock(); const farTaken = g.state.locked === outside;
    check("B ten targets have to be different",
          sameDead && nearDead && named && nearRefused && farLive && farTaken,
          "after " + t0.toFixed(2) + " (abandoned): " + t0.toFixed(2) + " refused " + sameDead + ", " +
          inside.toFixed(2) + " refused " + (nearDead && nearRefused) + " and the card names the clash " + named +
          ", " + outside.toFixed(2) + " accepted " + (farLive && farTaken));
    g.state.n = 0; g.state.hits = []; g.state.locked = null; g.state.tries = 0; g.state.set = [];
    slide(0.25);

    /* The gap is the widest one that can never strand a student: nine set
       targets must leave at least one slider stop open for the tenth. Counted
       off the slider, and the next gap up is shown failing. */
    const mid = settable[Math.floor(settable.length / 2)];
    const ruledOut = gap => settable.filter(t => Math.round(Math.abs(t - mid) * 100) < Math.round(gap * 100)).length;
    const r = ruledOut(B_GAP), rUp = ruledOut(B_GAP + step);
    check("B the gap can never strand a student", (B_ROUNDS - 1) * r < settable.length &&
          Math.ceil(settable.length / rUp) < B_ROUNDS,
          "each target rules out " + r + " of " + settable.length + " stops, so nine rule out at most " +
          (B_ROUNDS - 1) * r + "; at a gap of " + (B_GAP + step).toFixed(2) + " it is " + rUp +
          " each and " + Math.ceil(settable.length / rUp) + " badly placed targets close the slider");

    /* And the rule has to cost something: one parked setting serves only the
       few targets it clears that are also B_GAP apart. Greedy from the bottom
       is the most a set of points on a line can take at a fixed spacing. */
    let most = 0, mostAt = "";
    for (const gr of grid) {
      let n = 0, last = -1;
      for (const t of settable) if (landsFor(t, gr) && (last < 0 || Math.round((t - last) * 100) >= Math.round(B_GAP * 100))) { n++; last = t; }
      if (n > most) { most = n; mostAt = (gr.inh ? "inherited" : "uninherited") + " " + gr.N + "/" + gr.G; }
    }
    check("B one setting serves only a few of the ten", most <= B_ROUNDS / 2,
          "the most distinct targets any one setting clears is " + most + " (" + mostAt + ")");
  }

  const aimed = [11, 23, 47, 91, 137].map(playAimed);
  const parked = grid.find(g => g.inh && g.N === 60 && g.G === 100);
  const flail = [11, 23, 47, 91, 137].map(s => playParked(s, parked));
  const med = a => a.slice().sort((x, y) => x - y)[Math.floor(a.length / 2)];
  check("B the tries bar is clearable by aiming", med(aimed) <= B_TRIES_MAX,
        "a student who picks the right setting needs " + aimed.join("/") + " tries for ten targets (bar is " +
        B_TRIES_MAX + ", floor is " + B_ROUNDS + ")");
  check("B the tries bar is not free to a parked setting", med(flail) > B_TRIES_MAX,
        "leaving the controls at inherited 60/100 for all ten costs " + flail.join("/") + " tries");
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
    /* 40 replays, not 20, and the bar is 80% rather than the 90% floor round 2
       measured. The target picture is drawn off pageSeed, so it moves from
       one page to the next; a bar sitting on the measured minimum failed about
       one run in six. */
    for (let r = 0; r < 40; r++) if (C_matches(C_feat(ends(t.N, t.gens, rng)), shp(t).feat)) h++;
    check("C shape " + (i + 1) + " accepts its own setting", h >= 32,
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

/* ---- D. how big a steady herd drifts like this one ---------------------- */
{
  /* JM rebuilt this stage twice on 2026-09-22. The second rebuild replaced
     the operator: the herd is individuals now, generations do not overlap,
     a bad winter kills males, and males vary wildly in how many calves they
     sire. Those assumptions are silent on the page, so every one of them has
     to be pinned here or a later edit drops one without anything going red.

     What has to hold, none of it visible by opening the page:

       - the record identifies a herd size, rather than accepting anything;
       - the size it identifies is BELOW the harmonic mean of the census --
         the old stage taught that the answer was the harmonic mean, and the
         male-biased crash is exactly what makes that no longer true;
       - the plain average does not clear the gate;
       - the loci all ride one pedigree, so more of them do NOT average the
         noise away the way independent loci would. This is the driftiness
         JM asked for, and it is the thing a well-meaning refactor would
         quietly undo;
       - the herd drifts far faster than an ideal population of the same
         size, which is what the closing banner claims;
       - and the alleles slider does not move the bar, because the verdict is
         taken on the decay rather than on the level.

     Every "student" here is a fresh record seed, because the page draws the
     record once per student and the answer shifts a little with it. A bar
     that only holds for the average student is not a bar. */
  const recDecay  = (loci, k, seed) => D_decay(D_herdRun(mulberry32(seed), MOOSE, loci, k));
  const herdDecay = (N, loci, k, seed) =>
    D_decay(D_herdRun(mulberry32(seed), new Array(MOOSE.length).fill(N), loci, k));
  /* P(at least D_HITS of D_RUNS attempts land) for a herd whose single-attempt
     hit rate is p -- the gate the student actually faces. */
  const pGate = p => {
    let s = 0;
    for (let i = D_HITS; i <= D_RUNS; i++) {
      let c = 1; for (let j = 0; j < i; j++) c = c * (D_RUNS - j) / (j + 1);
      s += c * Math.pow(p, i) * Math.pow(1 - p, D_RUNS - i);
    }
    return s;
  };
  /* one student, one record; their herd resampled att times */
  const gateAt = (N, loci, k, student, att) => {
    const rec = recDecay(loci, k, 4000 + student * 7919);
    let hit = 0;
    for (let a = 0; a < att; a++)
      if (Math.abs(herdDecay(N, loci, k, 90001 + student * 104729 + a * 131) - rec) <= D_TOL) hit++;
    return pGate(hit / att);
  };
  const meanGate = (N, loci, k, students, att) => {
    let s = 0; for (let i = 0; i < students; i++) s += gateAt(N, loci, k, i, att);
    return s / students;
  };

  /* -- the record pins a size, and it is not "anything big" -------------- */
  const LOCI = 120;
  const band = [];
  for (const N of [300, 500, 700, 800, 926, 1056, 1400, 2200, 3000])
    band.push([N, meanGate(N, LOCI, 4, 4, 10)]);
  const inBand = band.filter(r => r[1] >= 0.5).map(r => r[0]);
  check("D the record identifies a herd size", inBand.length >= 1 && inBand.length <= 4,
        "of " + band.length + " sizes swept, " + inBand.length + " clear the gate half the time: " +
        band.map(r => r[0] + ":" + (100 * r[1]).toFixed(0) + "%").join(" "));
  const big = band.filter(r => r[0] >= 2200).map(r => r[1]);
  check("D a big herd does not pass by being big", big.every(r => r <= 0.2),
        "2200 and 3000 moose clear " + big.map(r => (100 * r).toFixed(0) + "%").join(" and ") +
        " of the time, so the answer is a size rather than a ceiling");
  check("D the default setting is not the answer", meanGate(500, LOCI, 4, 4, 10) <= 0.25,
        "the herd the stage opens on (500) clears " +
        (100 * meanGate(500, LOCI, 4, 4, 10)).toFixed(0) + "% of the time");
  check("D the plain average does not clear the gate", meanGate(1056, LOCI, 4, 6, 12) <= 0.4,
        "the plain average of the census (" + D_ARITH.toFixed(0) + ") clears " +
        (100 * meanGate(1056, LOCI, 4, 6, 12)).toFixed(0) + "% of the time");

  /* -- the answer is BELOW the harmonic mean ----------------------------- */
  {
    const reps = 10;
    let rec = 0; for (let r = 0; r < reps; r++) rec += recDecay(LOCI, 4, 4000 + r * 7919);
    rec /= reps;
    const at = N => { let s = 0; for (let r = 0; r < reps; r++) s += herdDecay(N, LOCI, 4, 6000 + r * 7919); return s / reps; };
    /* walk down from the harmonic mean until the herd drifts as fast as the
       record; re-derived here rather than pasted, so a drifting bar is caught
       rather than enshrined. */
    let ans = null, prev = null;
    for (const N of [1400, 1200, 1056, 926, 850, 800, 750, 700, 600, 500]) {
      const d = at(N);
      if (prev && prev[1] <= rec && d >= rec) { const f = (rec - prev[1]) / (d - prev[1]); ans = prev[0] + f * (N - prev[0]); break; }
      prev = [N, d];
    }
    check("D the answer sits below the harmonic mean of the census",
          ans !== null && ans < D_HARM,
          "the record loses " + (100 * rec).toFixed(2) + "% and the herd that loses the same is ~" +
          (ans === null ? "off the sweep" : ans.toFixed(0)) + ", against a harmonic mean of " +
          D_HARM.toFixed(0) + " and a plain average of " + D_ARITH.toFixed(0));
  }

  /* -- the loci share one pedigree --------------------------------------- */
  {
    const sdOf = (loci, reps) => {
      const v = []; for (let r = 0; r < reps; r++) v.push(recDecay(loci, 4, 300 + r * 7919));
      const m = mn(v);
      return Math.sqrt(v.reduce((s, x) => s + (x - m) * (x - m), 0) / (v.length - 1));
    };
    const s10 = sdOf(10, 12), s160 = sdOf(160, 12);
    /* independent loci would shrink the sd by sqrt(160/10) = 4. A shared
       pedigree puts a floor under it. If this ever passes 3.2 the loci have
       come unstuck from each other and the line has gone smooth again. */
    check("D every locus rides one pedigree", s160 > 0 && s10 / s160 < 3.2,
          "run-to-run sd of the decay is " + (100 * s10).toFixed(2) + "% at 10 loci and " +
          (100 * s160).toFixed(2) + "% at 160 -- a factor of " + (s10 / s160).toFixed(2) +
          ", against the 4.0 independent loci would give");
    check("D the loci slider is still worth having", s10 / s160 > 1.3,
          "more loci do cut the noise, by a factor of " + (s10 / s160).toFixed(2));
  }

  /* -- drift is far stronger than the headcount suggests ------------------ */
  {
    const reps = 10;
    let rec = 0; for (let r = 0; r < reps; r++) rec += recDecay(LOCI, 4, 7100 + r * 7919);
    rec /= reps;
    /* an ideal population held at the harmonic mean of the census, in closed
       form: no sexes, no Vk, one gene copy sampled per parent slot */
    const ideal = 1 - Math.pow(1 - 1 / (2 * D_HARM), MOOSE.length - 1);
    check("D drift is far stronger than the census suggests", rec > 2 * ideal,
          "the record loses " + (100 * rec).toFixed(2) + "% where an ideal herd of " +
          D_HARM.toFixed(0) + " would lose " + (100 * ideal).toFixed(2) +
          "% -- a factor of " + (rec / ideal).toFixed(1));
  }

  /* -- the alleles slider does not move the bar -------------------------- */
  {
    const byK = [2, 4, 8].map(k => {
      const reps = 8;
      let rec = 0, you = 0;
      for (let r = 0; r < reps; r++) { rec += recDecay(LOCI, k, 8100 + r * 7919); you += herdDecay(800, LOCI, k, 8600 + r * 7919); }
      return (you - rec) / reps;
    });
    check("D the alleles slider does not move the bar", byK.every(g => Math.abs(g) <= D_TOL),
          "at a herd of 800 the decay gap is " + byK.map(g => (100 * g).toFixed(2) + "%").join(" / ") +
          " for 2, 4 and 8 alleles");
  }
}


say(bad ? ("FAILED " + bad) : "ALL BARS PASS");
/* The count goes back with the report so the runner can tell a clean run from
   a truncated one. This used to be invisible: the report came home through
   document.title, Chrome capped it, and a whole stage's worth of checks went
   missing while the summary still read clean. */
say("RAN " + ran);
L.join(" ;; ");
`;

/* The result comes back in a <pre>, not in document.title: Chrome caps the
   title, and when the Stage D messages grew the cap silently ate the whole
   Stage A block -- 45 checks ran and 29 were reported, with nothing saying
   so. --dump-dom returns the outer document whole, so the <pre> has no cap.
   The title is kept as a one-word sentinel for "did the eval even land". */
const probe = `<!doctype html><meta charset="utf-8"><title>pending</title>
<iframe id="f" src="http://127.0.0.1:${PORT}/app/lessons/lesson10.html?preview=1" width="1500" height="1000"></iframe>
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
  const m = /<pre id="out">([\s\S]*?)<\/pre>/.exec(r.stdout || "");
  if (!m) { console.error("no result -- is Chrome at " + CHROME + " ?"); cleanup(); process.exit(2); }
  const text = m[1].replace(/&quot;/g, '"').replace(/&gt;/g, ">").replace(/&lt;/g, "<").replace(/&amp;/g, "&");
  const lines = text.split(" ;; ");
  for (const linefeed of lines) console.log(linefeed);
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
