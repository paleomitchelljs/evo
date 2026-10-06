#!/usr/bin/env node
/*
 * check_lesson14_numbers.js -- the bar checks for app/lessons/lesson14.html.
 *
 * Lesson 14 is a draft: A one allele year by year in the real rain (births,
 * deaths, carry-over, meiosis), then one shot at observed data; B what a
 * sweep leaves, then one shot at the real lactase scan; C what slows a sweep;
 * D when the rare allele wins (pathogens and an MHC-like gene), the last
 * stage (Stage E, a dN/dS draft, was removed 2026-10-05; see
 * app/archive/lesson14_with_E_2026-10-05.html). Rebuilt 2026-10-01 from JM's
 * review. What has to hold:
 *
 *   A. (rebuilt 2026-10-01, evening: the headcount is an outcome, the beak
 *      arrow lands on rainfall -> food, chance acts on births and deaths;
 *      2026-10-02: only survivors breed)
 *      the rain is data/clean/grant_rainfall.csv; next year's birds are the
 *      survivors plus the new chicks, and the headcount swings; a
 *      population's frequency is its counts; the bars' "should change" is
 *      exactly the covariance of birds-next-year with the copies over twice
 *      their average, and many populations' first year changes by it (and
 *      their headcount by the bars' average); with no beak effect the allele
 *      goes nowhere on average; the observed data's headcount is like the
 *      real fortis counts (harmonic mean computed here from
 *      data/clean/finch_pop.csv); the readings are the least-squares slope of
 *      each year's change on log10 of the rain and the mean absolute miss;
 *      each target's stored readings agree with a fresh measurement and its
 *      hidden setting hits its windows; no reachable setting clears two
 *      rounds; the opening and the cheap routes miss; the observed data is a
 *      run at its setting near its means, and no round's answer clears it;
 *      Start deals round 1 with the arrows at the opening and the held arrow
 *      pale; the beak size arrow lands on the rainfall -> food arrow.
 *   B. (2026-10-05: alleles per locus, judged on the whole profile, not Mb)
 *      crossovers, assortment, Kimura's losses, the shared stretch by hand
 *      (Stage C still calls it); a locus is 5 markers either side of the
 *      gene, B_profile ranks its alleles; the five rounds' stored target
 *      profiles and bars agree with a fresh measurement and their hidden
 *      settings hit their own windows; the lactase record is the 1000
 *      Genomes file inside its window and is not named until shot at; no
 *      setting clears two rounds, the opening clears none, no round's
 *      answer clears the lactase target.
 *   C. selection follows the rain only in the rain round; each round's stored
 *      stretch agrees with a fresh measurement and its setting hits it; each
 *      free arrow at the opening and at both ends of its range misses (the
 *      window is two-sided); each slower slows the sweep and narrows the
 *      stretch; the rain box shows only where the rain matters.
 *   D. new alleles arrive at the stated rate; the neutral gene loses alleles
 *      as drift and mutation say it should (the recursion is computed here,
 *      not stored); the pathogens add alleles at the immune gene and not at
 *      the neutral one; each round's stored readings agree and its setting
 *      hits them; no setting clears two rounds; the opening and the cheap
 *      routes miss.
 *   All. every plot fits its panel; every stage has a practice switch that
 *      does not score; each scored attempt records its own bit; the one-shot
 *      targets cannot be practised; nothing prints under a card; a new target
 *      puts the free arrows back where they opened.
 *
 * Same harness as check_lesson13_numbers.js: the checks run inside a
 * same-origin iframe against the page's own functions; the report comes back
 * in a <pre>, and the runner fails if fewer checks come back than ran.
 *
 * Usage:  node scripts/check_lesson14_numbers.js [A] [B] [C] [D]
 *         (no letters: everything, ~15 minutes; run it in the background)
 * Exit 0 iff every bar passes. Needs Google Chrome and python3.
 */
const { spawn, spawnSync } = require("child_process");
const fs = require("fs"), path = require("path");

const ROOT = path.resolve(__dirname, "..");
const PORT = 8795;
const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const ONLY = process.argv.slice(2).filter(a => /^[ABCD]$/.test(a));

const INNER = `
JOBS_SYNC = true;   /* a Go and the observed data finish inside the call, as they did before they were sliced */
const ONLY = ${JSON.stringify(ONLY)};
const want = S => !ONLY.length || ONLY.includes(S);
const L=[], say=s=>L.push(s);
let bad = 0, ran = 0;
const check = (name, ok, detail) => { ran++; if (!ok) bad++; say((ok?"ok   ":"FAIL ") + name + "  " + detail); };
const mn = a => a.reduce((x,y)=>x+y,0)/a.length;
const sdv = a => { const m = mn(a); return Math.sqrt(a.reduce((x,y)=>x+(y-m)*(y-m),0)/Math.max(1,a.length-1)); };
const unlock = S => { document.getElementById("stage" + S).classList.remove("stage-locked"); Gates[S].open = true; };

check("page loaded", !!(A && A.game && A.paths && B && B.game && B.paths && C && C.game && C.paths && D && D.game && D.paths && typeof Score !== "undefined"),
      "Stages A-D, their controls and Score are defined");
{
  const keys = ["A1","A2","A3","A4","A5","A6","B1","B2","B3","B4","B5","B6","C1","C2","C3","C4","C5","D1","D2","D3","D4","D5"];
  check("one bit per scored attempt: A and B five rounds and a last target each, C and D five rounds", Object.keys(BIT).length === 22 && keys.every((k, i) => BIT[k] === i) &&
        A_ROUNDS.length === 5 && B_ROUNDS.length === 5 && C_ROUNDS.length === 5 && D_ROUNDS.length === 5 && !!A_FINAL && !!B_FINAL,
        Object.keys(BIT).join(", "));
}

/* ======================================================================= A */
if (want("A")) {
const A_rate = (r, g, sv, reps, seed) => { let k = 0; for (let q = 0; q < reps; q++) if (A_judge(r, A_read(A_run(g, sv, A_P0, mulberry32(seed + q * 7919)).P))) k++; return k / reps; };
{
  const before = A.game.free() && A.game.current() == null, lab = document.getElementById("A_run").textContent;
  A.g = -0.3; A.s = 2.5;
  document.getElementById("A_tnext").click();
  const r0 = A.game.current(), cls = id => (document.querySelector('#pathsA [data-of="' + id + '"]') || { getAttribute: () => "" }).getAttribute("class");
  check("A opens on free play; Start deals the first round with the arrows at the opening, its held arrow pale",
        before && lab === "Practice run" && r0 === A_ROUNDS[0] && A.g === A_OPEN.g && A.s === r0.hold.s &&
        /locked/.test(cls("luck")) && /settable/.test(cls("bk")) && document.getElementById("A_run").textContent === "Go",
        "after Start: round " + (r0 || {}).key + ", beak " + A.g + ", luck " + A.s + "; chance '" + cls("luck") + "', beak '" + cls("bk") + "'");
}
{
  /* the beak size arrow lands on the middle of the rainfall -> food arrow (JM: "the beak depth arrow should really point to the rainfall->food a bird gets arrow"; "beak size", 2026-10-02) */
  const d = id => (document.querySelector('#pathsA [data-of="' + id + '"]') || { getAttribute: () => "" }).getAttribute("d");
  const nums = id => (d(id).match(/-?[0-9.]+/g) || []).map(Number);
  const rf = nums("rf"), bk = nums("bk");
  const mid = { x: 0.25 * rf[0] + 0.5 * rf[2] + 0.25 * rf[4], y: 0.25 * rf[1] + 0.5 * rf[3] + 0.25 * rf[5] };
  const tip = { x: bk[4], y: bk[5] }, gap = Math.hypot(tip.x - mid.x, tip.y - mid.y);
  check("A the beak size arrow lands on the rainfall -> food arrow", rf.length === 6 && bk.length === 6 && gap < 16,
        "its line ends " + gap.toFixed(1) + " px from the middle of rainfall -> food (the head reaches past it)");
}
{
  const x = new XMLHttpRequest(); x.open("GET", "/data/clean/grant_rainfall.csv", false); x.send();
  const rows = x.responseText.trim().split(/\\r?\\n/).slice(1).map(l => l.split(","));
  const mm = rows.map(r => +r[r.length - 1]);
  check("A the rain is data/clean/grant_rainfall.csv, 1973-2012; dryness is its standardised log",
        +rows[0][0] === A_Y0 && mm.length === A_NY && mm.every((v, i) => v === A_RAIN[i]) && Math.abs(mn(A_DRY)) < 1e-12 && Math.abs(sdv(A_DRY) - 1) < 1e-12 &&
        A_X.every((v, i) => Math.abs(v - Math.log10(A_RAIN[i] + 10)) < 1e-15),
        rows.length + " rows; dryness mean " + mn(A_DRY).toExponential(1) + ", sd " + sdv(A_DRY).toFixed(12) + "; the card's axis is log10(mm + 10)");
}
{
  /* the headcount is an outcome: next year's birds are this year's less the deaths plus the new chicks */
  let worstP = 0, worstN = 0, worstW = 0, swing = 0;
  const rng = mulberry32(5);
  for (let q = 0; q < 30; q++) {
    const g = (rng() - 0.5) * 1.2, sv = rng() * 3, R = A_run(g, sv, A_P0, mulberry32(100 + q));
    R.C.forEach((c, t) => { const n = c[0] + c[1] + c[2]; worstP = Math.max(worstP, Math.abs((c[1] + 2 * c[2]) / (2 * n) - R.P[t]));
                            worstN = Math.max(worstN, Math.abs(n - R.N[t]), t ? Math.abs(R.N[t] - (R.N[t - 1] - R.D[t - 1] + R.B[t - 1])) : 0); });
    swing = Math.max(swing, Math.max(...R.N) / Math.min(...R.N));
    for (let t = 0; t < A_NY - 1; t += 5) {
      const c = R.C[t], f = A_fit(c, g, sv, t), n = R.N[t];
      const pn = (c[1] * f.tot[1] + 2 * c[2] * f.tot[2]) / (2 * (c[0] * f.tot[0] + c[1] * f.tot[1] + c[2] * f.tot[2]));
      worstW = Math.max(worstW, Math.abs(f.dp - (pn - R.P[t])));
    }
  }
  check("A the headcount is survivors plus new chicks, it changes with the years, and a population's frequency is its counts", worstN === 0 && worstP < 1e-12 && swing > 3,
        "30 runs, every year: headcount off by " + worstN + ", frequency " + worstP.toExponential(1) + "; largest swing in one run x" + swing.toFixed(1));
  check("A 'should change' is the covariance of birds-next-year with the copies, over twice their average", worstW < 1e-12,
        "every 5th year of 30 runs: against the weighted frequency " + worstW.toExponential(1));
}
{
  /* the first year, over many populations, changes by 'should change' on average, and the headcount by the bars' average */
  const g = 0.5, sv = 1, reps = 400, moved = [], should = [], nn = [], nShould = [];
  for (let q = 0; q < reps; q++) { const R = A_run(g, sv, A_P0, mulberry32(700 + q)), f = A_fit(R.C[0], g, sv, 0);
    moved.push(R.P[1] - R.P[0]); should.push(f.dp); nn.push(R.N[1]); nShould.push(R.N[0] * f.wb); }
  const gap = moved.map((m, i) => m - should[i]), se = sdv(gap) / Math.sqrt(reps);
  const gapN = nn.map((m, i) => m - nShould[i]), seN = sdv(gapN) / Math.sqrt(reps);
  check("A many populations' first year changes by 'should change' on average, and the headcount by the bars' average", Math.abs(mn(gap)) < 3.5 * se && Math.abs(mn(gapN)) < 3.5 * seN,
        reps + " runs, 1973, beak " + g + ", luck " + sv + ": changed " + mn(moved).toFixed(5) + ", should " + mn(should).toFixed(5) + " (se of the gap " + se.toFixed(5) + "); birds " + mn(nn).toFixed(1) + ", expected " + mn(nShould).toFixed(1) + " (se " + seN.toFixed(1) + ")");
  const ends = []; for (let q = 0; q < 60; q++) ends.push(A_run(0, 1, A_P0, mulberry32(300 + q)).P[A_NY - 1]);
  const se0 = sdv(ends) / Math.sqrt(60);
  check("A with no beak effect the allele goes nowhere on average", Math.abs(mn(ends) - A_P0) < 3 * se0, "60 runs, luck 1: average end " + mn(ends).toFixed(3) + " (standard error " + se0.toFixed(3) + ")");
}
{
  /* the headcount looks like the real fortis counts: harmonic mean of data/clean/finch_pop.csv, computed here */
  const x = new XMLHttpRequest(); x.open("GET", "/data/clean/finch_pop.csv", false); x.send();
  const rows = x.responseText.trim().split(/\\r?\\n/), head = rows[0].split(","), col = head.indexOf("fortis");
  const real = rows.slice(1).map(l => +l.split(",")[col]).filter(v => v > 0), hm = a => a.length / a.reduce((s, v) => s + 1 / v, 0);
  const sims = []; for (let q = 0; q < 60; q++) sims.push(hm(A_run(A_FINAL.g, A_FINAL.s, A_P0, mulberry32(1300 + q)).N));
  const ratio = mn(sims) / hm(real);
  check("A the observed data's headcount is like the real fortis counts (harmonic means within 25%)", ratio > 0.8 && ratio < 1.25,
        "real " + hm(real).toFixed(0) + " (" + real.length + " years, " + Math.min(...real) + " to " + Math.max(...real) + "); the data's setting " + mn(sims).toFixed(0) + " over 60 runs");
}
{
  const R = A_run(0.3, 1, A_P0, mulberry32(77)), q = A_read(R.P);
  const xs = A_RAIN.slice(0, 39).map(r => Math.log10(r + 10)), ys = R.P.slice(1).map((v, i) => v - R.P[i]);
  const mx = mn(xs), my = mn(ys), b = xs.reduce((s, x, i) => s + (x - mx) * (ys[i] - my), 0) / xs.reduce((s, x) => s + (x - mx) * (x - mx), 0), a = my - b * mx;
  const res = ys.map((y, i) => y - a - b * xs[i]), miss = mn(res.map(Math.abs));
  check("A the readings: least squares of each year's change on log10 of its rain, and the mean absolute miss",
        Math.abs(q.slope - b) < 1e-14 && Math.abs(q.miss - miss) < 1e-14, "slope " + b.toFixed(5) + " (page " + q.slope.toFixed(5) + "), error " + miss.toFixed(5));
}
{
  const S = 160, rows = [], hits = []; let agree = true;
  for (const r of A_ROUNDS.concat([A_FINAL])) {
    const T = [], M = []; let k = 0;
    for (let q = 0; q < S; q++) { const z = A_read(A_run(r.g, r.s, A_P0, mulberry32(5003 + q * 7919)).P); T.push(z.slope); M.push(z.miss); if (A_judge(r, z)) k++; }
    const tm = mn(T), ts = sdv(T), mm = mn(M), ms = sdv(M);
    /* a mean of 160 wobbles 0.08 sd; an sd, about 6% (more for the error's long tail) */
    const ok = Math.abs(tm - r.sl[0]) < 0.3 * r.sl[1] && Math.abs(mm - r.ms[0]) < 0.3 * r.ms[1] && Math.abs(ts / r.sl[1] - 1) < 0.22 && Math.abs(ms / r.ms[1] - 1) < 0.25;
    agree = agree && ok; r._rate = k / S;
    rows.push(r.key + " slope " + tm.toFixed(4) + "±" + ts.toFixed(4) + " [" + r.sl.join("±") + "], error " + mm.toFixed(5) + "±" + ms.toFixed(5) + " [" + r.ms.join("±") + "]" + (ok ? "" : " OFF"));
    hits.push(r.key + " " + r._rate.toFixed(2));
  }
  check("A every target's stored readings agree with a fresh measurement off the engine", agree, S + " runs each: " + rows.join("; "));
  check("A every target's hidden setting hits its own windows", A_ROUNDS.concat([A_FINAL]).every(r => r._rate >= 0.85), "share inside both windows (expect ~0.93): " + hits.join(", "));
}
{
  const obs = A_observed(A_FINAL), q = A_FINAL.obsQ;
  const near = Math.abs(q.slope - A_FINAL.sl[0]) < 0.5 * A_FINAL.sl[1] && Math.abs(q.miss - A_FINAL.ms[0]) < 0.5 * A_FINAL.ms[1];
  check("A the observed data is a run at its hidden setting, its readings within half a spread of the means", near && obs.g === A_FINAL.g && obs.s === A_FINAL.s,
        "slope " + q.slope.toFixed(4) + ", error " + q.miss.toFixed(5) + "; birds " + Math.min(...obs.N) + " to " + Math.max(...obs.N));
}
{
  /* every setting a round can reach (its holds applied): no setting clears two rounds */
  const REPS = 16, G = [], Sx = []; for (let i = -6; i <= 6; i++) G.push(i / 10); for (let i = 0; i <= 6; i++) Sx.push(i / 2);
  const seen = new Map(), reach = (r, g, sv) => Object.keys(r.hold).every(k => ({ g, s: sv })[k] === r.hold[k]);
  for (const r of A_ROUNDS) for (const g0 of G) for (const s0 of Sx) {
    const g = "g" in r.hold ? r.hold.g : g0, sv = "s" in r.hold ? r.hold.s : s0; seen.set(g + "|" + sv, [g, sv]); }
  let most = 0; const multi = [];
  for (const [g, sv] of seen.values()) {
    const zs = []; for (let q = 0; q < REPS; q++) zs.push(A_read(A_run(g, sv, A_P0, mulberry32(4242 + q * 104729)).P));
    const rates = A_ROUNDS.map(r => reach(r, g, sv) ? zs.filter(z => A_judge(r, z)).length / REPS : 0), c = rates.filter(x => x >= 0.5).length;
    most = Math.max(most, c); if (c >= 2) multi.push("beak " + g + ", luck " + sv + ": " + rates.map(x => x.toFixed(2)).join(" "));
  }
  check("A no setting a round can reach clears two rounds", most <= 1, seen.size + " settings x " + REPS + " runs: most rounds one clears at 50%: " + most + (multi.length ? " -- " + multi.join("; ") : ""));
  const all = A_ROUNDS.concat([A_FINAL]);
  const open = all.map(r => A_rate(r, "g" in r.hold ? r.hold.g : A_OPEN.g, "s" in r.hold ? r.hold.s : A_OPEN.s, 60, 777));
  check("A the opening (no beak effect, no luck; held arrows as held) clears no target", open.every(x => x < 0.1), all.map((r, i) => r.key + " " + open[i].toFixed(2)).join(", "));
  /* where luck is free: the right beak with the luck left at the opening, and the right luck with the beak left there */
  const both = all.filter(r => !("g" in r.hold) && !("s" in r.hold));
  const halfG = both.map(r => [r.key, A_rate(r, r.g, A_OPEN.s, 60, 991)]), halfS = both.map(r => [r.key, A_rate(r, A_OPEN.g, r.s, 60, 992)]);
  check("A where both arrows are free, the right beak with no luck, or the right luck with no beak effect, misses", halfG.every(x => x[1] < 0.25) && halfS.every(x => x[1] < 0.15),
        "beak right: " + halfG.map(x => x[0] + " " + x[1].toFixed(2)).join(", ") + " | luck right: " + halfS.map(x => x[0] + " " + x[1].toFixed(2)).join(", "));
  const fromRounds = A_ROUNDS.map(r => [r.key, A_rate(A_FINAL, r.g, r.s, 60, 993)]);
  check("A no round's answer clears the observed data", fromRounds.every(x => x[1] < 0.3), fromRounds.map(x => x[0] + "'s answer " + x[1].toFixed(2)).join(", "));
}
}

/* ======================================================================= B */
if (want("B")) {
unlock("B");
{
  const before = B.game.free() && B.game.current() == null, lab = document.getElementById("B_run").textContent;
  B.ai = 0; B.v = 90;
  document.getElementById("B_tnext").click();
  const r0 = B.game.current();
  check("B opens on free play; Start deals the first round, arrows at the opening", before && lab === "Practice run" && r0 === B_ROUNDS[0] &&
        B.ai === B_OPEN.ai && B.v === B_OPEN.v && document.getElementById("B_run").textContent === "Go",
        "after Start: round " + (r0 || {}).key + ", advantage " + B_ADV[B.ai] + ", " + B_nAt(B.v) + " individuals");
}
{
  const a = new Uint32Array(2 * B_WD); a[B_WD] = a[B_WD + 1] = a[B_WD + 2] = a[B_WD + 3] = 0xFFFFFFFF; a[B_WD + 4] = a[B_WD + 5] = 0xFFFFFFFF;
  const b = new Uint32Array(B_WD), mk = new Uint32Array(4), rng = mulberry32(31);
  const G = 200000; let sw = 0, ones = 0, same = 0;
  for (let q = 0; q < G; q++) {
    B_gamete(a, 0, B_WD, b, 0, rng, mk);
    for (let m = 0; m < B_M - 1; m++) if (B_bit(b, 0, m) !== B_bit(b, 0, m + 1)) sw++;
    const u0 = b[4] & 1, u1 = (b[4] >>> 1) & 1; ones += u0; if (u0 === u1) same++;
  }
  const rate = sw / (G * (B_M - 1)), se = Math.sqrt(B_R / (G * (B_M - 1)));
  check("B a crossover falls in a gap with chance " + B_R + " per meiosis", Math.abs(rate - B_R) < 4 * se, G + " gametes: " + rate.toFixed(6) + " per gap (standard error " + se.toFixed(6) + ")");
  check("B the markers on other chromosomes come from either copy at random, each on its own", Math.abs(ones / G - 0.5) < 0.01 && Math.abs(same / G - 0.5) < 0.01,
        "from the second copy " + (ones / G).toFixed(4) + "; two from the same copy " + (same / G).toFixed(4));
}
{
  const n = 400, adv = 0.1, f = B_found(n, mulberry32(7)), Ls = [];
  for (let q = 0; q < 60; q++) Ls.push(B_run(f, adv, 0.5, mulberry32(900 + q), 0).lost);
  const s = adv / 2, u = (1 - Math.exp(-2 * s)) / (1 - Math.exp(-4 * n * s)), wantL = (1 - u) / u, m = mn(Ls), se = sdv(Ls) / Math.sqrt(Ls.length);
  check("B the losses before a new copy spreads match the chance of spreading", Math.abs(m - wantL) < 3.5 * se,
        "advantage " + adv + ", " + n + " individuals, 60 sweeps: " + m.toFixed(1) + " lost (standard error " + se.toFixed(1) + "); " + wantL.toFixed(1) + " expected");
}
/* bg (the unlinked-markers' diversity share) and the by-position windows are
   retired (JM, 2026-10-05: one profile reading, "whole profile", not two);
   B_stretch/B_mb stay -- Stage C still calls them directly -- so test
   B_stretch by hand on its own. */
{
  const K = 3, ch = new Uint32Array(K * B_WD), set = (k, m) => { ch[k * B_WD + (m >> 5)] |= 1 << (m & 31); };
  set(0, B_SITE); set(1, B_SITE); set(0, B_SITE + 7); set(1, B_SITE - 12);
  const st = B_stretch(ch, K, 1, mulberry32(1), 10);
  check("B the shared stretch, by hand (Stage C still calls it directly)", st === 17, "stretch " + st + " (want 17)");
}
{
  /* B_LOCI: 21 columns, 5-marker flanking loci either side, the gene alone
     in the middle; B_profile ranks each locus's alleles among the rows
     passed in, commonest (rank 0, drawn grey) first */
  const okShape = B_LOCI.length === 21 && B_GENE_COL === 10 &&
        B_LOCI[0].join(",") === "0,1,2,3,4" && B_LOCI[9].join(",") === "45,46,47,48,49" &&
        B_LOCI[10].join(",") === String(B_SITE) &&
        B_LOCI[11].join(",") === "51,52,53,54,55" && B_LOCI[20].join(",") === "96,97,98,99,100";
  const mkRow = bits => { const r = new Uint8Array(B_M); for (const [m, v] of bits) r[m] = v; return r; };
  const rows = [mkRow([[0, 1], [1, 1]]), mkRow([[0, 1], [1, 1]]), mkRow([]), mkRow([[0, 1]])];
  const prof = B_profile(rows), keys0 = rows.map(r => B_locusKey(r, B_LOCI[0]));
  const okProf = prof.counts[0] === 3 && prof.ranks[0].get(keys0[0]) === 0 && prof.ranks[0].get(keys0[2]) === 1 && prof.ranks[0].get(keys0[3]) === 2;
  check("B a locus is 5 neighbouring markers, one at the gene; B_profile ranks its alleles, commonest first", okShape && okProf,
        "columns " + B_LOCI.length + ", gene at " + B_GENE_COL + "; 4 hand-built chromosomes, locus 0: " + prof.counts[0] + " alleles, ranks " + keys0.map(k => prof.ranks[0].get(k)).join(","));
}
/* the three-population average profile at a setting, and the share of reps
   whose profile difference from a round's target clears its bar */
const B_avgLoc = (ai, v, stop, seed) => { const rng = mulberry32(seed);
  const qs = []; for (let j = 0; j < 3; j++) { const run = B_run(B_found(B_nAt(v), rng), B_ADV[ai], stop, rng, 0); qs.push(B_read(run, B_rows(run.ch, 2 * run.n, rng))); }
  return B_LOCI.map((_, c) => qs.reduce((s, q) => s + q.loc[c], 0) / 3); };
const B_rateLoc = (r, ai, v, stop, reps, seed) => { let k = 0; for (let q = 0; q < reps; q++) if (B_judge(r, { loc: B_avgLoc(ai, v, stop, seed + q * 7919) })) k++; return k / reps; };
{
  const S = 30, rows = [], hits = []; let agree = true;
  for (const r of B_ROUNDS.concat([B_FINAL])) {
    const Q = []; for (let q = 0; q < S; q++) Q.push(B_avgLoc(r.ai, r.v, r.stop, 7000 + q * 7919));
    const freshMean = B_LOCI.map((_, c) => mn(Q.map(p => p[c])));
    const agreeD = B_profDist(freshMean, r.loc), dists = Q.map(p => B_profDist(p, r.loc));
    /* the stored target is itself a mean over many Go's, so a fresh mean of S should land much
       closer to it than a single Go's own spread (r.bar, a high percentile of that spread) does */
    const ok = agreeD < 0.4 * r.bar;
    agree = agree && ok; r._rate = dists.filter(d => d <= r.bar).length / S;
    rows.push(r.key + " target-vs-fresh-mean " + agreeD.toFixed(3) + " (bar " + r.bar.toFixed(2) + ")" + (ok ? "" : " OFF"));
    hits.push(r.key + " " + r._rate.toFixed(2));
  }
  check("B every target's stored profile (the mean at the hidden setting) agrees with a fresh measurement", agree, S + " three-population averages each: " + rows.join("; "));
  check("B every target's hidden setting hits its own window", B_ROUNDS.concat([B_FINAL]).every(r => r._rate >= 0.8), hits.join(", "));
}
{
  const ok = !!B_REAL && B_REAL.real && Math.abs(B_REAL.stop - 0.737) < 0.001 && B_REAL.loc.length === 21 && B_judge(B_FINAL, B_REAL);
  check("B the lactase record is the 1000 Genomes file, inside its window", ok,
        B_REAL ? "T at " + B_REAL.stop.toFixed(3) + "; profile difference from the target " + B_profDist(B_REAL.loc, B_FINAL.loc).toFixed(2) + " (bar " + B_FINAL.bar.toFixed(2) + ")" : "not loaded");
  const out = []; let near = true;
  for (const r of B_ROUNDS) { const q = B_record(r); const z = B_profDist(q.loc, r.loc) / r.bar;
    near = near && z < 1 && B_judge(r, q); out.push(r.key + " " + z.toFixed(2)); }
  check("B each made record sits within its setting's window", near, out.join(", "));
}
{
  let most = 0; const multi = [];
  const stops = [...new Set(B_ROUNDS.map(r => r.stop))];
  for (let ai = 0; ai < B_ADV.length; ai++) for (let v = 0; v <= 100; v += 20) {
    const by = {}; for (const stop of stops) { by[stop] = []; for (let q = 0; q < 6; q++) by[stop].push(B_avgLoc(ai, v, stop, 333 + q * 104729)); }
    const rates = B_ROUNDS.map(r => by[r.stop].filter(loc => B_judge(r, { loc })).length / 6), c = rates.filter(x => x >= 0.5).length;
    most = Math.max(most, c); if (c >= 2) multi.push(B_ADV[ai] + ", " + B_nAt(v) + ": " + rates.map(x => x.toFixed(2)).join(" "));
  }
  check("B no setting on a grid of the controls clears two rounds", most <= 1, "60 settings x 6 Go's: most " + most + (multi.length ? " -- " + multi.join("; ") : ""));
  const all = B_ROUNDS.concat([B_FINAL]);
  const op = all.map(r => B_rateLoc(r, B_OPEN.ai, B_OPEN.v, r.stop, 10, 4444));
  check("B the opening clears no target", op.every(x => x < 0.2), all.map((r, i) => r.key + " " + op[i].toFixed(2)).join(", "));
  const fin = B_ROUNDS.map(r => [r.key, B_rateLoc(B_FINAL, r.ai, r.v, B_FINAL.stop, 8, 5555)]);
  check("B no round's answer clears the lactase target", fin.every(x => x[1] < 0.3), fin.map(x => x[0] + "'s answer " + x[1].toFixed(2)).join(", "));
}
}

/* ======================================================================= C */
if (want("C")) {
unlock("C");
const C_avgOf = (o, seed) => C_three(o, mulberry32(seed), 0).q;
const C_rateAt = (r, o, n, seed) => { let k = 0; for (let q = 0; q < n; q++) if (C_judge(r, C_avgOf(o, seed + q * 7919))) k++; return k / n; };
{
  const before = C.game.free() && C.game.current() == null;
  C.beta = 0.33; C.h = 0.1;
  document.getElementById("C_tnext").click();
  const r0 = C.game.current(), cls = id => (document.querySelector('#pathsC [data-of="' + id + '"]') || { getAttribute: () => "" }).getAttribute("class");
  check("C opens on free play; Start deals the first round: its free arrow at the opening, the rest held and pale",
        before && r0 === C_ROUNDS[0] && C.beta === C_OPEN.beta && C.h === C_HELD.h && /settable/.test(cls("beta")) && /locked/.test(cls("h")) && /locked/.test(cls("se")),
        "round " + (r0 || {}).key + ", selection " + C.beta + ", one copy " + C.h + "; trait -> survival '" + cls("beta") + "', one copy -> trait '" + cls("h") + "'");
}
{
  const o = { beta: 0.2, wet: 0.1, rain: true }, okR = A_DRY.every((D, t) => Math.abs(C_selAt(o, t) - (D > 0 ? 0.2 * D : 0.1 * D)) < 1e-15);
  const okC = [0, 7, 23].every(t => C_selAt({ beta: 0.2, wet: 0.1, rain: false }, t) === 0.2);
  check("C selection follows the rain only in the rain round: dry years by its strength x dryness, wet ones the other way", okR && okC,
        "rain regime matches beta x dryness / wet x dryness every year: " + okR + "; constant otherwise: " + okC);
}
{
  const S = 24, rows = [], hits = []; let agree = true;
  for (const r of C_ROUNDS) {
    const Q = []; for (let q = 0; q < S; q++) Q.push(C_avgOf(C_setOf(r), 7000 + q * 7919));
    const st = Q.filter(q => q.ok).map(q => q.st), m = mn(st), s = sdv(st);
    /* a mean of 24 wobbles 0.2 sd; an sd of 24, about 15% */
    const ok = st.length === S && Math.abs(m - r.st[0]) < 0.6 * r.st[1] && Math.abs(s / r.st[1] - 1) < 0.45;
    agree = agree && ok; r._rate = Q.filter(q => C_judge(r, q)).length / S;
    rows.push(r.key + " " + m.toFixed(3) + "±" + s.toFixed(3) + " Mb [" + r.st.join("±") + "], " + mn(Q.map(q => q.t)).toFixed(0) + " generations" + (ok ? "" : " OFF"));
    hits.push(r.key + " " + r._rate.toFixed(2));
  }
  check("C every round's stored stretch (averages of six) agrees with a fresh measurement", agree, S + " each: " + rows.join("; "));
  check("C every round's hidden setting hits its own window", C_ROUNDS.every(r => r._rate >= 0.8), hits.join(", "));
}
{
  /* two-sided: the free arrow at the opening, at the bottom and at the top of its range all miss */
  const range = { beta: [0, 0.4], h: [-0.5, 1], se: [0.25, 4], wet: [0, 0.2], harm: [0, 0.2] };
  const out = []; let ok = true;
  for (const r of C_ROUNDS) {
    const base = C_setOf(r), at = v => Object.assign({}, base, { [r.free]: v });
    const vals = [["opening", C_OPEN[r.free]], ["bottom", range[r.free][0]], ["top", range[r.free][1]]].filter((x, i, a) => a.findIndex(y => y[1] === x[1]) === i);
    const rates = vals.map(([lab, v]) => [lab + " " + v, C_rateAt(r, at(v), 8, 333)]);
    ok = ok && rates.every(x => x[1] < 0.2);
    out.push(r.key + ": " + rates.map(x => x[0] + " " + x[1].toFixed(2)).join(", "));
  }
  check("C each free arrow at the opening and at both ends of its range misses", ok, "8 Go's each: " + out.join(" | "));
}
{
  /* each slower slows the sweep and narrows the stretch, from the held setting to the round's */
  const out = []; let ok = true;
  for (const r of C_ROUNDS.slice(1)) {
    const Q0 = [], Q1 = [];
    for (let q = 0; q < 6; q++) { Q0.push(C_avgOf(Object.assign({}, C_HELD, { rain: !!r.rain }), 600 + q * 7919)); Q1.push(C_avgOf(C_setOf(r), 600 + q * 7919)); }
    const t0 = mn(Q0.map(q => q.t)), t1 = mn(Q1.map(q => q.t)), s0 = mn(Q0.map(q => q.st)), s1 = mn(Q1.map(q => q.st));
    ok = ok && t1 > t0 && s1 < s0;
    out.push(r.key + " " + t0.toFixed(0) + " -> " + t1.toFixed(0) + " generations, " + s0.toFixed(2) + " -> " + s1.toFixed(2) + " Mb");
  }
  check("C each slower slows the sweep and narrows the stretch", ok, out.join("; "));
}
{
  const out = []; let near = true;
  for (const r of C_ROUNDS) { const q = C_record(r), z = Math.abs(q.st - r.st[0]) / r.st[1]; near = near && q.ok && z < 1; out.push(r.key + " " + q.st.toFixed(2) + " Mb (" + z.toFixed(2) + " spreads)"); }
  check("C each record sits within one spread of its setting's mean", near, out.join(", "));
}
}

/* ======================================================================= D */
if (want("D")) {
unlock("D");
const D_rateAt = (r, c, v, n, seed) => { let k = 0; for (let q = 0; q < n; q++) if (D_judge(r, D_three(c, v, mulberry32(seed + q * 7919)).q)) k++; return k / n; };
{
  const before = D.game.free() && D.game.current() == null;
  D.c = 1.2; D.v = 5;
  document.getElementById("D_tnext").click();
  const r0 = D.game.current();
  check("D opens on free play; Start deals the first round with the arrows at the opening", before && r0 === D_ROUNDS[0] && D.c === D_OPEN.c && D.v === D_OPEN.v,
        "round " + (r0 || {}).key + ", pathogens " + D.c + ", " + D_nAt(D.v) + " individuals");
}
{
  /* new alleles at the immune gene: 2N x mu a generation */
  const n = 150, made = []; for (let q = 0; q < 40; q++) made.push(D_run(n, 0.5, mulberry32(40 + q)).made);
  const wantM = 2 * n * D_MU * D_T, se = sdv(made) / Math.sqrt(made.length);
  check("D new alleles arrive at one copy in " + Math.round(1 / D_MU) + " a generation", Math.abs(mn(made) - wantM) < 3.5 * se, "40 runs of " + n + ": " + mn(made).toFixed(1) + " made (" + wantM + " expected, standard error " + se.toFixed(1) + ")");
}
{
  /* the neutral gene: two copies match as drift and mutation say. F' = (1/2N + (1 - 1/2N) F)(1 - mu)^2 for two different
     copies, from F = (2N/20 - 1)/(2N - 1) at the start; the sum of squares counts a copy with itself, so add 1/2N of the rest */
  const n = 100, K = 2 * n, homo = [];
  for (let q = 0; q < 200; q++) { const run = D_run(n, 0.8, mulberry32(60 + q)), last = run.snaps[run.snaps.length - 1].su; homo.push(last.reduce((s, e) => s + (e[1] / K) * (e[1] / K), 0)); }
  let F = (K / D_K0 - 1) / (K - 1);
  for (let t = 0; t < D_T; t++) F = (1 / K + (1 - 1 / K) * F) * (1 - D_MU) * (1 - D_MU);
  const wantH = F * (1 - 1 / K) + 1 / K, se = sdv(homo) / Math.sqrt(homo.length);
  check("D the neutral gene's copies match as drift and mutation alone say, whatever the pathogens do", Math.abs(mn(homo) - wantH) < 3.5 * se,
        "200 runs of " + n + ", pathogens 0.8: two copies match " + mn(homo).toFixed(4) + " vs " + wantH.toFixed(4) + " from the recursion (standard error " + se.toFixed(4) + ")");
}
{
  const Q0 = [], Q1 = []; for (let q = 0; q < 10; q++) { Q0.push(D_three(0, 40, mulberry32(80 + q * 7919)).q); Q1.push(D_three(1, 40, mulberry32(80 + q * 7919)).q); }
  const k0 = mn(Q0.map(q => q.k)), k1 = mn(Q1.map(q => q.k)), u0 = mn(Q0.map(q => q.ku)), u1 = mn(Q1.map(q => q.ku));
  const se = Math.sqrt((sdv(Q0.map(q => q.ku)) ** 2 + sdv(Q1.map(q => q.ku)) ** 2) / 10);
  check("D the pathogens add alleles at the immune gene and not at the neutral one", k1 > k0 + 4 && Math.abs(u1 - u0) < 3.5 * se,
        D_nAt(40) + " individuals, 10 Go's: immune " + k0.toFixed(1) + " -> " + k1.toFixed(1) + ", neutral " + u0.toFixed(1) + " -> " + u1.toFixed(1) + " (standard error " + se.toFixed(1) + ")");
}
{
  const S = 30, rows = [], hits = []; let agree = true;
  for (const r of D_ROUNDS) {
    const Q = []; for (let q = 0; q < S; q++) Q.push(D_three(r.c, r.v, mulberry32(7000 + q * 7919)).q);
    const km = mn(Q.map(q => q.k)), ks = sdv(Q.map(q => q.k)), um = mn(Q.map(q => q.ku)), us = sdv(Q.map(q => q.ku));
    const ok = Math.abs(km - r.k[0]) < 0.6 * r.k[1] && Math.abs(um - r.ku[0]) < 0.6 * r.ku[1] && Math.abs(ks / r.k[1] - 1) < 0.45 && Math.abs(us / r.ku[1] - 1) < 0.45;
    agree = agree && ok; r._rate = Q.filter(q => D_judge(r, q)).length / S;
    rows.push(r.key + " immune " + km.toFixed(2) + "±" + ks.toFixed(2) + " [" + r.k.join("±") + "], neutral " + um.toFixed(2) + "±" + us.toFixed(2) + " [" + r.ku.join("±") + "]" + (ok ? "" : " OFF"));
    hits.push(r.key + " " + r._rate.toFixed(2));
  }
  check("D every round's stored readings (averages of three) agree with a fresh measurement", agree, S + " each: " + rows.join("; "));
  check("D every round's hidden setting hits its own window", D_ROUNDS.every(r => r._rate >= 0.8), hits.join(", "));
}
{
  let most = 0; const multi = [];
  for (let ci = 0; ci <= 15; ci += 1) for (let v = 0; v <= 100; v += 10) {
    const c = ci / 10, Q = []; for (let q = 0; q < 4; q++) Q.push(D_three(c, v, mulberry32(4242 + q * 104729)).q);
    const rates = D_ROUNDS.map(r => Q.filter(q => D_judge(r, q)).length / 4), n = rates.filter(x => x >= 0.5).length;
    most = Math.max(most, n); if (n >= 2) multi.push(c + ", " + D_nAt(v) + ": " + rates.map(x => x.toFixed(2)).join(" "));
  }
  check("D no setting on the controls' grid clears two rounds", most <= 1, "176 settings x 4 Go's: most " + most + (multi.length ? " -- " + multi.join("; ") : ""));
  const op = D_ROUNDS.map(r => D_rateAt(r, D_OPEN.c, D_OPEN.v, 10, 777));
  check("D the opening (no pathogens, " + D_nAt(D_OPEN.v) + " individuals) clears no round", op.every(x => x < 0.15), D_ROUNDS.map((r, i) => r.key + " " + op[i].toFixed(2)).join(", "));
  const half = D_ROUNDS.map(r => [r.key, D_rateAt(r, r.c, D_OPEN.v, 8, 778), D_rateAt(r, 0, r.v, 8, 779)]);
  check("D the right pathogens at the opening's headcount, or the right headcount with no pathogens, misses", half.every(x => x[1] < 0.25 && x[2] < 0.25),
        half.map(x => x[0] + " " + x[1].toFixed(2) + " / " + x[2].toFixed(2)).join(", "));
}
}

/* ===================================================================== all */
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
  ["A", "B", "C", "D"].forEach(unlock);
  const fe = window.frameElement, w0 = fe ? fe.width : null, res = [];
  for (const w of [w0, 1100, 900]) {
    if (fe && w) { fe.width = w; void document.body.offsetWidth; FIT_EPOCH++; repaintAll(); }
    res.push({ w: innerWidth, bad: over() });
  }
  if (fe) { fe.width = w0; void document.body.offsetWidth; FIT_EPOCH++; repaintAll(); }
  check("every plot fits its panel", res.every(q => q.bad.length === 0), res.map(q => q.w + " px: " + (q.bad.length ? q.bad.join(" ") : "none over")).join("  |  "));
}
/* the practice switch, through the real buttons; spends one scored attempt in each stage asked for */
{
  const realSI = window.setInterval, realCI = window.clearInterval;
  let loop = false, stop = false;
  window.setInterval = fn => { loop = true; stop = false; for (let k = 0; k < 20000 && !stop; k++) fn(); loop = false; return 0; };
  window.clearInterval = id => { if (loop) stop = true; else realCI(id); };
  const read = id => document.getElementById(id).textContent;
  const ST = { A, B, C, D }, res = {};
  try {
    for (const S of ["A", "B", "C", "D"].filter(want)) {
      unlock(S);
      const g = ST[S].game, box = document.getElementById(S + "_practice"), btn = document.getElementById(S + "_run");
      if (g.free()) document.getElementById(S + "_tnext").click();
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
    for (const S of ["A", "B", "C", "D"].filter(want)) {
      check(S + " has a practice switch that does not score", /^OK /.test(res[S].line), res[S].line);
      check(S + " each scored attempt records its own bit, as the page judged it", / ok$/.test(res[S].bit), res[S].bit);
      check(S + " nothing is printed under the card", res[S].cardText.trim() === "", "'" + res[S].cardText + "'");
    }
    /* a new target puts the free arrows back where they opened */
    if (want("A")) { A.g = 0.5; A.s = 2.9; document.getElementById("A_tnext").click(); const r = A.game.current();
      check("A a new target puts the free arrows back where they opened, and holds the rest", A.g === ("g" in r.hold ? r.hold.g : A_OPEN.g) && A.s === ("s" in r.hold ? r.hold.s : A_OPEN.s),
            "round " + r.key + ": beak " + A.g + ", luck " + A.s); }
    if (want("B")) { B.ai = 0; B.v = 90; document.getElementById("B_tnext").click(); const r = B.game.current();
      check("B a new target puts both arrows back where they opened", B.ai === B_OPEN.ai && B.v === B_OPEN.v, "round " + r.key); }
    if (want("C")) { C.beta = 0.4; C.h = -0.5; document.getElementById("C_tnext").click(); const r = C.game.current();
      const ok = C_KEYS.every(k => C[k] === (k === r.free ? C_OPEN[k] : C_HELD[k]));
      const rainShown = !!document.querySelector('#pathsC [data-of="wet"]');
      check("C a new target frees one arrow at its opening and holds the rest; the rain shows only in the rain round", ok && rainShown === !!r.rain,
            "round " + r.key + ": " + C_KEYS.map(k => k + " " + C[k]).join(", ") + "; rain arrow drawn " + rainShown); }
    if (want("D")) { D.c = 1.4; D.v = 0; document.getElementById("D_tnext").click(); const r = D.game.current();
      check("D a new target puts both arrows back where they opened", D.c === D_OPEN.c && D.v === D_OPEN.v, "round " + r.key); }
    /* the one-shot targets: play out the rounds, then the observed data can be shot once and not practised */
    for (const S of ["A", "B"].filter(want)) {
      const st = ST[S], g = st.game, btn = document.getElementById(S + "_run"), nx = document.getElementById(S + "_tnext"), box = document.getElementById(S + "_practice");
      while (g.st.hits.length < 5) { if (g.waiting()) nx.click(); btn.click(); }
      const lab0 = nx.textContent; nx.click();
      const one = g.oneShot(), boxOff = box.disabled && !box.checked, goLab = btn.textContent, named = read(S + "_ttab");
      btn.click();
      const done = g.st.done && g.st.hits.length === 6, bit6 = Score.getBit("scaffold", BIT[S + "6"]) === (g.st.hits[5] ? 1 : 0);
      check(S + " the observed data is one shot: dealt by its own button, no practice, its own bit", lab0 === "Try to match actual data" && one && boxOff && /one shot/.test(goLab) && done && bit6 && !box.disabled,
            "button '" + lab0 + "', practice off " + boxOff + ", Go '" + goLab + "', taken " + done + ", bit " + bit6 + ", practice back after " + !box.disabled);
      if (S === "B") check("B the lactase data is not named until it has been shot at", !/lactase/i.test(named) && /lactase/i.test(read("B_ttab")), "before: '" + named + "' | after: '" + read("B_ttab") + "'");
    }
  } finally { window.setInterval = realSI; window.clearInterval = realCI; }
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
  const r = spawnSync(CHROME, ["--headless=new", "--disable-gpu", "--virtual-time-budget=1800000",
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
