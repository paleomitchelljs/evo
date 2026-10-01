#!/usr/bin/env node
/*
 * check_lesson14_numbers.js -- the bar checks for app/lessons/lesson14.html.
 *
 * Lesson 14 was rebuilt from zero on 2026-09-30 (the births/deaths page and
 * its checks are in app/archive/ and at 77e4149). It is a draft: Stage A is
 * built, B-E are planned in docs/overhauls/lesson14_overhaul.md. What has to
 * hold:
 *
 *   A. the rain is the record in data/clean/grant_rainfall.csv and dryness is
 *      its standardised log; a population's frequency is its counts; the
 *      bars' "should move" is exactly the change in the parents' allele
 *      frequency weighted by fitness (the covariance over average offspring
 *      over 2); with no push the allele goes nowhere on average, and with a
 *      push the average path over many big populations follows the
 *      deterministic recursion; the two readings are the least-squares line
 *      of each year's change on that year's dryness, its rise across the
 *      span and the mean absolute miss; each round's stored mean and spread
 *      of both readings agree with a fresh measurement off this engine; the
 *      hidden setting hits its own windows; the record shown is a run at the
 *      hidden setting with readings near its means; no setting on the
 *      controls' grid clears two rounds; the opening clears none; Start
 *      deals the first round with the arrows at the opening, and a new target
 *      puts them back; the practice switch does not score; each scored attempt
 *      records its own bit, as judged; nothing prints under the card; every
 *      plot fits its panel.
 *   B. a crossover falls in a gap with chance B_R per meiosis and the markers
 *      on other chromosomes assort at random; the losses before a new copy
 *      spreads match Kimura's chance of spreading; the rest of the genome
 *      loses diversity as (1 - 1/2N)^t whatever the sweep; the shared stretch
 *      and the windows by hand; each round's stored readings (averages of
 *      three populations) agree with a fresh measurement and its hidden
 *      setting hits its windows; the lactase record is the 1000 Genomes file
 *      and sits inside its round's windows; the made records sit near their
 *      setting's means; no setting on a coarse grid clears three rounds; the
 *      opening clears none; practice, bits, the bare card and the reset as A.
 *
 * Same harness as check_lesson13_numbers.js: the checks run inside a
 * same-origin iframe against the page's own functions; the report comes back
 * in a <pre>, and the runner fails if fewer checks come back than ran.
 *
 * Usage:  node scripts/check_lesson14_numbers.js
 * Exit 0 iff every bar passes. Needs Google Chrome and python3.
 */
const { spawn, spawnSync } = require("child_process");
const fs = require("fs"), path = require("path");

const ROOT = path.resolve(__dirname, "..");
const PORT = 8795;
const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

const INNER = `
const L=[], say=s=>L.push(s);
let bad = 0, ran = 0;
const check = (name, ok, detail) => { ran++; if (!ok) bad++; say((ok?"ok   ":"FAIL ") + name + "  " + detail); };
const mn = a => a.reduce((x,y)=>x+y,0)/a.length;
const sdv = a => { const m = mn(a); return Math.sqrt(a.reduce((x,y)=>x+(y-m)*(y-m),0)/Math.max(1,a.length-1)); };
const rateAt = (r, push, v, reps, seed) => { let k = 0; for (let q = 0; q < reps; q++) if (A_judge(r, A_read(A_run(A_nAt(v), push, A_P0, mulberry32(seed + q * 7919)).P))) k++; return k / reps; };

check("page loaded", !!(A && A.game && A.paths && B && B.game && B.paths && typeof Score !== "undefined"), "Stages A and B, their diagrams and Score are defined");
{
  const want = ["A1", "A2", "A3", "A4", "A5", "B1", "B2", "B3", "B4", "B5"];
  check("one bit per scored attempt: five slots each for A and B", Object.keys(BIT).length === 10 && want.every((k, i) => BIT[k] === i) && A_ROUNDS.length === 5 && B_ROUNDS.length === 5,
        Object.keys(BIT).join(", ") + "; A deals " + A_ROUNDS.length + " rounds, B " + B_ROUNDS.length);
}
/* ---- A: the engine ------------------------------------------------------ */
{
  /* A opens on free play; Start deals the first round with the arrows at the opening */
  const before = A.game.free() && A.game.current() == null, lab = document.getElementById("A_run").textContent;
  A.push = 0.2; A.v = 10;
  document.getElementById("A_tnext").click();
  const r0 = A.game.current();
  check("A opens on free play; Start deals the first round, arrows at the opening", before && lab === "Practice run" && r0 === A_ROUNDS[0] &&
        A.push === A_OPEN.push && A.v === A_OPEN.v && document.getElementById("A_run").textContent === "Go",
        "free at load: " + before + " (button '" + lab + "'); after Start: round " + (r0 || {}).key + ", push " + A.push + ", chance " + A.v + " (" + A_nAt(A.v) + " birds)");
}
{
  const x = new XMLHttpRequest(); x.open("GET", "/data/clean/grant_rainfall.csv", false); x.send();
  const rows = x.responseText.trim().split(/\\r?\\n/).slice(1).map(l => l.split(","));
  const yrs = rows.map(r => +r[0]), mm = rows.map(r => +r[r.length - 1]);
  const same = yrs[0] === A_Y0 && mm.length === A_NY && mm.every((v, i) => v === A_RAIN[i]);
  check("A the rain is data/clean/grant_rainfall.csv, 1973-2012", same, rows.length + " rows in the file, " + yrs[0] + "-" + yrs[yrs.length - 1] + "; the page carries " + A_NY + " years; all equal: " + same);
  check("A dryness is the standardised log of the rain, drier above 0", Math.abs(mn(A_DRY)) < 1e-12 && Math.abs(sdv(A_DRY) - 1) < 1e-12 &&
        A_DRY[A_RAIN.indexOf(1)] > 1.5 && A_DRY[A_RAIN.indexOf(1359)] < -1.5 && Math.abs(A_SPAN - (Math.max(...A_DRY) - Math.min(...A_DRY))) < 1e-12,
        "mean " + mn(A_DRY).toExponential(1) + ", sd " + sdv(A_DRY).toFixed(12) + "; 1 mm (1988) " + A_DRY[A_RAIN.indexOf(1)].toFixed(2) + ", 1359 mm (1983) " + A_DRY[A_RAIN.indexOf(1359)].toFixed(2) + "; span " + A_SPAN.toFixed(3));
}
{
  /* a run's frequency is its counts; the bars' "should move" is exactly the fitness-weighted parents' frequency minus this year's */
  let worstP = 0, worstD = 0;
  const rng = mulberry32(5);
  for (let q = 0; q < 40; q++) {
    const n = 20 + Math.floor(rng() * 400), push = (rng() - 0.5) * 0.8;
    const R = A_run(n, push, A_P0, mulberry32(100 + q));
    R.C.forEach((c, t) => { worstP = Math.max(worstP, Math.abs((c[1] + 2 * c[2]) / (2 * n) - R.P[t]), Math.abs(c[0] + c[1] + c[2] - n)); });
    for (let t = 0; t < A_NY - 1; t += 7) {
      const c = R.C[t], w = A_wOf(push, t), tot = c[0] * w[0] + c[1] * w[1] + c[2] * w[2];
      const pw = (c[1] * w[1] * 0.5 + c[2] * w[2]) / tot;
      worstD = Math.max(worstD, Math.abs(A_cov(c, w).dp - (pw - R.P[t])));
    }
  }
  check("A a population's frequency is its genotype counts", worstP < 1e-12, "40 runs, every year: largest gap " + worstP.toExponential(1));
  check("A the bars' 'should move' is the fitness-weighted parents' frequency minus this year's", worstD < 1e-12, "40 runs, every 7th year: largest gap " + worstD.toExponential(1));
}
{
  /* no push: nowhere on average; a push: the average of big populations follows the recursion */
  const reps = 60, n = 2000;
  const ends0 = []; for (let q = 0; q < reps; q++) ends0.push(A_run(400, 0, A_P0, mulberry32(300 + q)).P[A_NY - 1]);
  const se0 = sdv(ends0) / Math.sqrt(reps);
  check("A with no push the allele goes nowhere on average", Math.abs(mn(ends0) - A_P0) < 3 * se0,
        reps + " runs of 400 birds: average end " + mn(ends0).toFixed(3) + " (start " + A_P0 + ", standard error " + se0.toFixed(3) + ")");
  const push = 0.3, det = [A_P0];
  for (let t = 0; t < A_NY - 1; t++) { const p = det[t], q = 1 - p, w = A_wOf(push, t), wb = p * p * w[2] + 2 * p * q * w[1] + q * q * w[0];
    det.push((p * p * w[2] + p * q * w[1]) / wb); }
  const runs = []; for (let q = 0; q < reps; q++) runs.push(A_run(n, push, A_P0, mulberry32(500 + q)).P);
  let worst = 0, worstZ = 0;
  for (let t = 1; t < A_NY; t++) { const col = runs.map(P => P[t]), m = mn(col), se = sdv(col) / Math.sqrt(reps);
    worst = Math.max(worst, Math.abs(m - det[t])); worstZ = Math.max(worstZ, Math.abs(m - det[t]) / Math.max(se, 1e-9)); }
  check("A with a push the average path follows the deterministic recursion", worst < 0.02 && worstZ < 4.5,
        reps + " runs of " + n + " birds, push " + push + ": largest gap from the recursion " + worst.toFixed(4) + " (" + worstZ.toFixed(1) + " standard errors, across 39 years); recursion ends " + det[A_NY - 1].toFixed(3));
}
{
  /* the readings by hand */
  const R = A_run(300, 0.2, A_P0, mulberry32(77)), q = A_read(R.P);
  const xs = A_DRY.slice(0, 39), ys = R.P.slice(1).map((v, i) => v - R.P[i]);
  const mx = mn(xs), my = mn(ys), b = xs.reduce((s, x, i) => s + (x - mx) * (ys[i] - my), 0) / xs.reduce((s, x) => s + (x - mx) * (x - mx), 0), a = my - b * mx;
  /* least squares: the leftovers lean on nothing */
  const res = ys.map((y, i) => y - a - b * xs[i]), lean = Math.abs(res.reduce((s, e, i) => s + e * xs[i], 0)) + Math.abs(res.reduce((s, e) => s + e, 0));
  const miss = mn(res.map(Math.abs));
  check("A the readings: least squares of each year's change on its dryness, the rise across the span, the mean absolute miss",
        Math.abs(q.slope - b) < 1e-14 && Math.abs(q.tilt - b * A_SPAN) < 1e-14 && Math.abs(q.miss - miss) < 1e-14 && lean < 1e-12,
        "slope " + b.toFixed(5) + " (page " + q.slope.toFixed(5) + "), rise " + q.tilt.toFixed(4) + ", typical miss " + q.miss.toFixed(5) + "; leftovers against dryness and their sum " + lean.toExponential(1));
}
/* ---- A: the rounds ---------------------------------------------------- */
{
  /* every round's stored mean and spread agree with a fresh measurement; the hidden setting hits its own windows */
  const S = 160, rows = [], hits = [];
  let agree = true;
  for (const r of A_ROUNDS) {
    const T = [], M = []; let k = 0;
    for (let q = 0; q < S; q++) { const z = A_read(A_run(A_nAt(r.v), r.push, A_P0, mulberry32(9001 + q * 7919)).P); T.push(z.tilt); M.push(z.miss); if (A_judge(r, z)) k++; }
    const tm = mn(T), ts = sdv(T), mm = mn(M), ms = sdv(M);
    /* standard error of a mean of 160 is 0.08 sd; of an sd, about 6% */
    const ok = Math.abs(tm - r.tilt[0]) < 0.3 * r.tilt[1] && Math.abs(mm - r.miss[0]) < 0.3 * r.miss[1] &&
               Math.abs(ts / r.tilt[1] - 1) < 0.22 && Math.abs(ms / r.miss[1] - 1) < 0.22;
    agree = agree && ok;
    rows.push(r.key + " rise " + tm.toFixed(4) + "±" + ts.toFixed(4) + " [stored " + r.tilt[0] + "±" + r.tilt[1] + "], miss " + mm.toFixed(5) + "±" + ms.toFixed(5) + " [" + r.miss[0] + "±" + r.miss[1] + "]" + (ok ? "" : " OFF"));
    hits.push(r.key + " " + (k / S).toFixed(2));
    r._rate = k / S;
  }
  check("A every round's stored readings agree with a fresh measurement off the engine", agree, S + " runs each: " + rows.join("; "));
  check("A every round's hidden setting hits its own windows", A_ROUNDS.every(r => r._rate >= 0.85), "share of " + S + " runs inside both windows (expect ~0.93): " + hits.join(", "));
}
{
  /* the record: a run at the hidden setting, reproducible, its readings near the means */
  const out = []; let ok = true;
  for (const r of A_ROUNDS) {
    const rec = A_record(r), q = r.recQ;
    const near = Math.abs(q.tilt - r.tilt[0]) < 0.5 * r.tilt[1] && Math.abs(q.miss - r.miss[0]) < 0.5 * r.miss[1];
    const inside = A_judge(r, q), right = rec.n === A_nAt(r.v) && rec.push === r.push && rec.P.length === A_NY;
    ok = ok && near && inside && right;
    out.push(r.key + " rise " + q.tilt.toFixed(3) + ", miss " + q.miss.toFixed(4) + (near ? "" : " FAR") + (inside ? "" : " OUTSIDE") + (right ? "" : " WRONG SETTING"));
  }
  check("A each record is a run at the hidden setting, its readings within half a spread of the means", ok, out.join("; "));
}
{
  /* the controls' grid: no setting clears two rounds; the opening clears none */
  const pushes = []; for (let p = -0.4; p <= 0.4001; p += 0.04) pushes.push(+p.toFixed(2));
  const vs = []; for (let v = 0; v <= 100; v += 10) vs.push(v);
  let most = 0; const multi = []; const REPS = 24;
  for (const p of pushes) for (const v of vs) {
    const zs = []; for (let q = 0; q < REPS; q++) zs.push(A_read(A_run(A_nAt(v), p, A_P0, mulberry32(4242 + q * 104729)).P));
    const rates = A_ROUNDS.map(r => zs.filter(z => A_judge(r, z)).length / REPS), c = rates.filter(x => x >= 0.5).length;
    most = Math.max(most, c); if (c >= 2) multi.push("push " + p + ", " + A_nAt(v) + " birds: " + rates.map(x => x.toFixed(2)).join(" "));
  }
  check("A no setting on the controls' grid clears two rounds", most <= 1, pushes.length * vs.length + " settings x " + REPS + " runs: most rounds one setting clears at 50% or better: " + most + (multi.length ? " -- " + multi.join("; ") : ""));
  const open = A_ROUNDS.map(r => rateAt(r, A_OPEN.push, A_OPEN.v, 60, 777));
  check("A the opening (no push, " + A_nAt(A_OPEN.v) + " birds) clears no round", open.every(x => x < 0.1), A_ROUNDS.map((r, i) => r.key + " " + open[i].toFixed(2)).join(", "));
  /* the right push alone is not enough, and neither is the right population alone */
  const halfP = A_ROUNDS.filter(r => r.push !== 0).map(r => [r.key, rateAt(r, r.push, A_OPEN.v, 40, 991)]);
  const halfN = A_ROUNDS.filter(r => r.push !== 0).map(r => [r.key, rateAt(r, 0, r.v, 40, 992)]);
  check("A the right push at the opening's population, or the right population with no push, misses", halfN.every(x => x[1] < 0.15) && halfP.every(x => x[1] < 0.25),
        "push right, chance at the opening: " + halfP.map(x => x[0] + " " + x[1].toFixed(2)).join(", ") + " | chance right, no push: " + halfN.map(x => x[0] + " " + x[1].toFixed(2)).join(", "));
}
/* ---- B: the chromosome engine ------------------------------------------ */
{
  /* B opens on free play; Start deals the first round with the arrows at the opening */
  document.getElementById("stageB").classList.remove("stage-locked");
  const before = B.game.free() && B.game.current() == null, lab = document.getElementById("B_run").textContent;
  B.ai = 0; B.v = 90;
  document.getElementById("B_tnext").click();
  const r0 = B.game.current();
  check("B opens on free play; Start deals the first round, arrows at the opening", before && lab === "Practice run" && r0 === B_ROUNDS[0] &&
        B.ai === B_OPEN.ai && B.v === B_OPEN.v && document.getElementById("B_run").textContent === "Go",
        "free at load: " + before + "; after Start: round " + (r0 || {}).key + ", advantage " + B_ADV[B.ai] + ", " + B_nAt(B.v) + " individuals");
}
{
  /* crossovers: one copy all 0, the other all 1 along the chromosome; a switch between neighbours is a crossover */
  const a = new Uint32Array(2 * B_WD); a[B_WD] = a[B_WD + 1] = a[B_WD + 2] = a[B_WD + 3] = 0xFFFFFFFF; a[B_WD + 4] = a[B_WD + 5] = 0xFFFFFFFF;
  const b = new Uint32Array(B_WD), mk = new Uint32Array(4), rng = mulberry32(31);
  const G = 200000; let sw = 0, ones = 0, pairs = 0, same = 0;
  for (let q = 0; q < G; q++) {
    B_gamete(a, 0, B_WD, b, 0, rng, mk);
    for (let m = 0; m < B_M - 1; m++) if (B_bit(b, 0, m) !== B_bit(b, 0, m + 1)) sw++;
    const u0 = b[4] & 1, u1 = (b[4] >>> 1) & 1; ones += u0; pairs++; if (u0 === u1) same++;
  }
  const rate = sw / (G * (B_M - 1)), se = Math.sqrt(B_R / (G * (B_M - 1)));
  check("B a crossover falls in a gap with chance " + B_R + " per meiosis", Math.abs(rate - B_R) < 4 * se,
        G + " gametes: " + rate.toFixed(6) + " per gap (standard error " + se.toFixed(6) + ")");
  check("B the markers on other chromosomes come from either copy at random, each on its own", Math.abs(ones / G - 0.5) < 0.01 && Math.abs(same / pairs - 0.5) < 0.01,
        "first unlinked marker from the second copy " + (ones / G).toFixed(4) + "; two unlinked markers from the same copy " + (same / pairs).toFixed(4));
}
{
  /* lost copies: one new copy in a population of N spreads with chance about the advantage (Kimura, het advantage adv/2) */
  const n = 400, adv = 0.1, f = B_found(n, mulberry32(7)), L = [];
  for (let q = 0; q < 60; q++) L.push(B_run(f, adv, 0.5, mulberry32(900 + q), 0).lost);
  const s = adv / 2, u = (1 - Math.exp(-2 * s)) / (1 - Math.exp(-4 * n * s)), want = (1 - u) / u;
  const m = mn(L), se = sdv(L) / Math.sqrt(L.length);
  check("B most new copies are lost: the losses before one spreads match the chance of spreading", Math.abs(m - want) < 3.5 * se,
        "advantage " + adv + ", " + n + " individuals, 60 sweeps: " + m.toFixed(1) + " lost on average (standard error " + se.toFixed(1) + "); one in " + (1 / u).toFixed(1) + " spreads, so " + want.toFixed(1) + " expected");
}
{
  /* the rest of the genome: chance alone, (1 - 1/2N)^t, whatever the sweep does */
  const out = [];
  let ok = true;
  for (const [ai, n] of [[6, 150], [2, 400]]) {
    const R = [], E = [];
    for (let q = 0; q < 30; q++) { const rng = mulberry32(5000 + q * 17 + n), run = B_run(B_found(n, rng), B_ADV[ai], 0.95, rng, 0); R.push(B_read(run).bg); E.push(Math.pow(1 - 1 / (2 * n), run.t)); }
    const d = R.map((x, i) => x - E[i]), se = sdv(d) / Math.sqrt(d.length);
    ok = ok && Math.abs(mn(d)) < 3.5 * se;
    out.push("advantage " + B_ADV[ai] + ", " + n + ": measured " + mn(R).toFixed(3) + " vs (1 - 1/2N)^t " + mn(E).toFixed(3) + " (standard error of the gap " + se.toFixed(3) + ")");
  }
  check("B the rest of the genome loses diversity as chance alone would, (1 - 1/2N) a generation", ok, out.join("; "));
}
{
  /* the stretch by hand: three copies, two carriers that match out to known markers */
  const K = 3, ch = new Uint32Array(K * B_WD), set = (k, m) => { ch[k * B_WD + (m >> 5)] |= 1 << (m & 31); };
  set(0, B_SITE); set(1, B_SITE);
  set(0, B_SITE + 7); set(1, B_SITE - 12);   /* copy 0 differs at +7, copy 1 at -12: they match from -11 to +6 */
  const st = B_stretch(ch, K, 1, mulberry32(1), 10);
  const w = B_windows(Array.from({ length: B_M }, (_, m) => m));
  check("B the shared stretch counts the matched markers either side; the windows are 5 markers wide", st === 17 && w.length === 21 && w[10] === 50 && w[0] === 1 && w[20] === 99,
        "carriers matching from -11 to +6 share " + st + " markers (17 expected); windows " + w.length + ", centre window's average index " + w[10] + " (gene left out), ends " + w[0] + " and " + w[20]);
}
/* ---- B: the rounds ---------------------------------------------------- */
const B_avg = (ai, v, stop, seed) => { const rng = mulberry32(seed); let bg = 0, st = 0;
  for (let j = 0; j < 3; j++) { const q = B_read(B_run(B_found(B_nAt(v), rng), B_ADV[ai], stop, rng, 0)); bg += q.bg; st += q.st; }
  return { bg: bg / 3, st: st / 3 }; };
{
  const S = 24, rows = [], hits = []; let agree = true;
  for (const r of B_ROUNDS) {
    const Q = []; for (let q = 0; q < S; q++) Q.push(B_avg(r.ai, r.v, r.stop, 7000 + q * 7919));
    const bm = mn(Q.map(q => q.bg)), bs = sdv(Q.map(q => q.bg)), sm = mn(Q.map(q => q.st)), ss = sdv(Q.map(q => q.st));
    /* a mean of 24 wobbles 0.2 sd; an sd of 24, about 15% */
    const ok = Math.abs(bm - r.bg[0]) < 0.6 * r.bg[1] && Math.abs(sm - r.st[0]) < 0.6 * r.st[1] && Math.abs(bs / r.bg[1] - 1) < 0.45 && Math.abs(ss / r.st[1] - 1) < 0.45;
    agree = agree && ok;
    const k = Q.filter(q => B_judge(r, q)).length;
    r._rate = k / S;
    rows.push(r.key + " rest " + bm.toFixed(3) + "±" + bs.toFixed(3) + " [" + r.bg.map(x => x.toFixed(3)).join("±") + "], stretch " + sm.toFixed(2) + "±" + ss.toFixed(2) + " Mb [" + r.st.map(x => x.toFixed(2)).join("±") + "]" + (ok ? "" : " OFF"));
    hits.push(r.key + " " + r._rate.toFixed(2));
  }
  check("B every round's stored readings (averages of three populations) agree with a fresh measurement", agree, S + " each: " + rows.join("; "));
  check("B every round's hidden setting hits its own windows", B_ROUNDS.every(r => r._rate >= 0.8), "share of " + S + " Go's inside both windows (expect ~0.94): " + hits.join(", "));
}
{
  const real = B_ROUNDS.find(r => r.real), w = B_win(real);
  const ok = !!B_REAL && B_REAL.real && Math.abs(B_REAL.stop - 0.737) < 0.001 && B_REAL.win.length === 21 && B_judge(real, B_REAL);
  check("B the lactase record is the 1000 Genomes file, and its readings sit in the round's windows", ok,
        B_REAL ? "T at " + B_REAL.stop.toFixed(3) + " in Utah Europeans; rest of the genome " + B_REAL.bg.toFixed(3) + " (window " + w.bg.map(x => x.toFixed(2)).join("-") + "); carriers share " + B_REAL.st.toFixed(2) + " Mb (window " + w.st.map(x => x.toFixed(2)).join("-") + "), non-carriers " + B_REAL.stC.toFixed(2) + " Mb" : "not loaded");
  const out = []; let near = true;
  for (const r of B_ROUNDS.filter(r => !r.real)) { const q = B_record(r); const z = Math.max(Math.abs(q.bg - r.bg[0]) / r.bg[1], Math.abs(q.st - r.st[0]) / r.st[1]);
    near = near && z < 1 && B_judge(r, q); out.push(r.key + " " + z.toFixed(2)); }
  check("B each made record sits within one spread of its setting's means, inside its windows", near, "largest distance in spreads: " + out.join(", "));
}
{
  /* a coarse grid of the controls: no setting clears three rounds; the opening clears none */
  let most = 0; const multi = [];
  for (let ai = 0; ai < B_ADV.length; ai++) for (let v = 0; v <= 100; v += 20) {
    const by = {}; for (const stop of [0.95, B_ROUNDS.find(r => r.real).stop]) { by[stop] = []; for (let q = 0; q < 6; q++) by[stop].push(B_avg(ai, v, stop, 333 + q * 104729)); }
    const rates = B_ROUNDS.map(r => by[r.stop].filter(q => B_judge(r, q)).length / 6), c = rates.filter(x => x >= 0.5).length;
    most = Math.max(most, c); if (c >= 2) multi.push("advantage " + B_ADV[ai] + ", " + B_nAt(v) + ": " + rates.map(x => x.toFixed(2)).join(" "));
  }
  check("B no setting on a grid of the controls clears three rounds", most <= 2, "60 settings x 6 Go's: most rounds one setting clears at 50% or better: " + most + (multi.length ? " -- " + multi.join("; ") : ""));
  const op = B_ROUNDS.map(r => { let k = 0; for (let q = 0; q < 10; q++) if (B_judge(r, B_avg(B_OPEN.ai, B_OPEN.v, r.stop, 4444 + q * 7919))) k++; return k / 10; });
  check("B the opening (advantage " + B_ADV[B_OPEN.ai] + ", " + B_nAt(B_OPEN.v) + " individuals) clears no round", op.every(x => x < 0.2), B_ROUNDS.map((r, i) => r.key + " " + op[i].toFixed(2)).join(", "));
}
/* ---- every plot inside its panel --------------------------------------- */
{
  const over = () => { const out = [];
    document.querySelectorAll("canvas").forEach(cv => {
      let host = cv.parentElement; while (host && !host.classList.contains("panel")) host = host.parentElement;
      if (!host) return;
      const cs = getComputedStyle(host), hr = host.getBoundingClientRect(), cr = cv.getBoundingClientRect();
      const o = cr.right - (hr.right - parseFloat(cs.paddingRight) - parseFloat(cs.borderRightWidth));
      if (o > 0.5) out.push((cv.id || "card") + " +" + Math.round(o));
    });
    return out; };
  const fe = window.frameElement, w0 = fe ? fe.width : null, res = [];
  for (const w of [w0, 1100, 900]) {
    if (fe && w) { fe.width = w; void document.body.offsetWidth; FIT_EPOCH++; repaintAll(); }
    res.push({ w: innerWidth, bad: over() });
  }
  if (fe) { fe.width = w0; void document.body.offsetWidth; FIT_EPOCH++; repaintAll(); }
  check("every plot fits its panel", res.every(q => q.bad.length === 0), res.map(q => q.w + " px: " + (q.bad.length ? q.bad.join(" ") : "none over")).join("  |  "));
}
/* ---- the practice switch, through the real buttons. Last: spends one scored attempt of each. ---- */
{
  const realSI = window.setInterval, realCI = window.clearInterval;
  let loop = false, stop = false;
  window.setInterval = fn => { loop = true; stop = false; for (let k = 0; k < 20000 && !stop; k++) fn(); loop = false; return 0; };
  window.clearInterval = id => { if (loop) stop = true; else realCI(id); };
  const read = id => document.getElementById(id).textContent;
  const res = {};
  try {
    for (const [S, st] of [["A", A], ["B", B]]) {
      document.getElementById("stage" + S).classList.remove("stage-locked");
      const g = st.game, box = document.getElementById(S + "_practice"), btn = document.getElementById(S + "_run");
      const tick = on => { box.checked = on; box.dispatchEvent(new Event("change")); };
      const n0 = g.st.hits.length;
      tick(true); btn.click();
      const pracOk = g.st.hits.length === n0 && g.st.last != null && /practice/.test(read(S + "_tflip"));
      tick(false); btn.click();
      const scored = g.st.hits.length === n0 + 1 && g.waiting(), blocked = btn.disabled;
      const bit = S + (n0 + 1) + " " + (Score.getBit("scaffold", BIT[S + (n0 + 1)]) === (g.st.hits[n0] ? 1 : 0) ? "ok" : "WRONG");
      const cardText = read(S + "_cardRead");
      tick(true); btn.click();
      const stillPrac = !btn.disabled && g.st.hits.length === n0 + 1 && g.waiting();
      tick(false);
      res[S] = { bit, cardText, line: (pracOk && scored && blocked && stillPrac ? "OK " : "BAD ") + "practice " + (pracOk ? "unscored" : "SCORED") + ", ticked off " + (scored ? "scored" : "NOT scored") +
                 ", waiting " + (blocked ? "Go off" : "GO ON") + (stillPrac ? " but practice runs" : ", practice BLOCKED") };
    }
  } finally { window.setInterval = realSI; window.clearInterval = realCI; }
  for (const S of ["A", "B"]) {
    check(S + " has a practice switch that does not score", /^OK /.test(res[S].line), res[S].line);
    check(S + " each scored attempt records its own bit, as the page judged it", / ok$/.test(res[S].bit), res[S].bit);
    check(S + " nothing is printed under the card", res[S].cardText.trim() === "", "'" + res[S].cardText + "'");
  }
  /* a new target puts the arrows back where they opened */
  A.push = 0.36; A.v = 90; A_syncInputs();
  document.getElementById("A_tnext").click();
  const r2 = A.game.current();
  check("A a new target puts both arrows back where they opened", r2 === A_ROUNDS[1] && A.push === A_OPEN.push && A.v === A_OPEN.v &&
        +document.getElementById("A_push").value === A_OPEN.push && +document.getElementById("A_drift").value === A_OPEN.v,
        "arrows moved to push 0.36, chance 90; Next target: round " + (r2 || {}).key + ", push " + A.push + ", chance " + A.v);
  B.ai = 0; B.v = 90; B_syncInputs();
  document.getElementById("B_tnext").click();
  const r3 = B.game.current();
  check("B a new target puts both arrows back where they opened", r3 === B_ROUNDS[1] && B.ai === B_OPEN.ai && B.v === B_OPEN.v &&
        +document.getElementById("B_adv").value === B_OPEN.ai && +document.getElementById("B_drift").value === B_OPEN.v,
        "arrows moved; Next target: round " + (r3 || {}).key + ", advantage index " + B.ai + ", chance " + B.v);
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
