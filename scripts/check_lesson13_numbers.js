#!/usr/bin/env node
/*
 * check_lesson13_numbers.js -- the bar checks for app/lessons/lesson13.html.
 *
 * Lesson 13 is a draft (2026-09-24): Stage A, covariance; Stage B, what
 * responds. What has to hold:
 *
 *   1. the offspring's shift IS cov(w, z) / w̄, every time, exactly -- the
 *      identity the stage prints -- and the covariance IS the average of the
 *      rectangles it draws;
 *   2. at a fixed slope the shift grows with the trait's variance: selection
 *      needs variation;
 *   3. every round is hit at its slope, missed at slope 0, and no one slope
 *      clears three rounds;
 *   4. B: the offspring move h2 times the parents who bred, whatever the
 *      slope; no inherited variation, no response; one slope gives the same
 *      shift in every population; the printed arithmetic agrees; B's rounds
 *      as in 3; a population's inherited share stays hidden until its scored
 *      run;
 *   5. C: the page's least squares against a hand solve; the least-squares
 *      arrows leave the least over, and it leans on neither trait; each
 *      one-trait slope is its arrow and its spread is the other arrow plus
 *      the box; the rounds as in 3, and reading the box off one picture
 *      misses;
 *   6. D: the same for three causes tied by an allele, plus: the line the
 *      whole diagram draws in each picture is that picture's slope at the
 *      fit; a confounded trait and a mediated allele show a slope their own
 *      arrow does not have; reading arrows off pictures misses;
 *   7. E: the traits are unrelated across all seedlings; the drought kills
 *      exactly its share; with no luck the survivors' slope is the
 *      truncated-normal value; it deepens with the drought and flips sign
 *      with the rule; the rounds as in 3.
 *
 * Same harness as check_lesson11_numbers.js: the checks run inside a
 * same-origin iframe against the page's own functions; the report comes back
 * in a <pre>, and the runner fails if fewer checks come back than ran.
 *
 * Usage:  node scripts/check_lesson13_numbers.js
 * Exit 0 iff every bar passes. Needs Google Chrome and python3.
 */
const { spawn, spawnSync } = require("child_process");
const fs = require("fs"), path = require("path");

const ROOT = path.resolve(__dirname, "..");
const PORT = 8794;
const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

const INNER = `
const L=[], say=s=>L.push(s);
let bad = 0, ran = 0;
const check = (name, ok, detail) => { ran++; if (!ok) bad++; say((ok?"ok   ":"FAIL ") + name + "  " + detail); };
const mn = a => a.reduce((x,y)=>x+y,0)/a.length;
const sdv = a => { const m = mn(a); return Math.sqrt(a.reduce((x,y)=>x+(y-m)*(y-m),0)/Math.max(1,a.length-1)); };

check("page loaded", !!(A && A.game && B && B.game && C && C.game && C.paths && D && D.game && D.paths && E && E.game && E.paths && typeof Score !== "undefined"), "Stages A-E, the three diagrams and Score are defined");
check("slots declared match slots written", Object.keys(BIT).length === 5, Object.keys(BIT).length + " named bits, scaffold is 5");

/* ---- the identity, recomputed here from the dots ----------------------- */
{
  let worst = 0, worstRect = 0, n = 0;
  for (const sd of [0.5, 1.5, 3]) for (const beta of [-1, -0.3, 0, 0.4, 1.2]) for (let q = 0; q < 5; q++) {
    const pop = A_makePop(sd, 900 + q * 13 + Math.round(sd * 10)), rng = mulberry32(1000 + q * 7919);
    const w = A_lambda(pop, beta).map(l => A_pois(rng, l)), st = A_stats(pop, w);
    /* by hand: the weighted mean of the parents' trait, minus their mean */
    let sw = 0, swz = 0, sz = 0; for (let i = 0; i < pop.z.length; i++) { sw += w[i]; swz += w[i] * pop.z[i]; sz += pop.z[i]; }
    const shift = sw > 0 ? swz / sw - sz / pop.z.length : 0;
    /* the rectangles, one per dot, signed, averaged */
    const zb = sz / pop.z.length, wb = sw / pop.z.length;
    let rect = 0; for (let i = 0; i < pop.z.length; i++) rect += (pop.z[i] - zb) * (w[i] - wb) / pop.z.length;
    worst = Math.max(worst, Math.abs(shift - rect / wb), Math.abs(st.shift - shift));
    worstRect = Math.max(worstRect, Math.abs(rect - st.cov)); n++;
  }
  check("A the shift is cov(w, z) / w̄, and the covariance is the average rectangle", worst < 1e-9 && worstRect < 1e-9,
        n + " populations x slopes x draws: largest gap " + worst.toExponential(1) + " (shift) and " + worstRect.toExponential(1) + " (rectangles)");
}
{
  /* selection needs variation: one slope, four spreads */
  const beta = 0.3, rows = [0.5, 1, 2, 3].map(sd => { const pop = A_makePop(sd, 1200 + sd * 10), st = A_stats(pop, A_lambda(pop, beta));
    return { sd, V: pop.V, shift: st.shift, pred: beta * pop.V / st.wb }; });
  check("A at one slope the shift grows with the variance", rows.every((q, i) => i === 0 || q.shift > rows[i - 1].shift) && rows.every(q => Math.abs(q.shift - q.pred) < 0.02 * Math.max(1, q.pred)),
        "slope 0.3: " + rows.map(q => "spread " + q.sd + " (variance " + q.V.toFixed(2) + ") → " + q.shift.toFixed(3) + " [slope × variance ÷ w̄ " + q.pred.toFixed(3) + "]").join("  "));
}
/* ---- the rounds --------------------------------------------------------- */
{
  const popOf = (r, i) => A_makePop(r.sd, pageSeed("l13Ap", 1, 99999) + (i + 1) * 7919);
  const hitA = (r, pop, beta, reps, seed) => { let k = 0; const lam = A_lambda(pop, beta);
    for (let q = 0; q < reps; q++) { const rng = mulberry32(seed + q * 7919); if (Math.abs(A_stats(pop, lam.map(l => A_pois(rng, l))).shift - r.S) <= A_tol(r)) k++; }
    return k / reps; };
  const own = A_ROUNDS.map((r, i) => { const pop = popOf(r, i), beta = Math.round(200 * r.S / pop.V) / 100; return { k: r.key, beta, v: hitA(r, pop, beta, 40, 2000 + i * 97) }; });
  check("A every round is hit at its slope", own.every(q => q.v >= 0.9),
        own.map(q => q.k + " @" + q.beta + ": " + Math.round(100 * q.v) + "%").join("  ") + "  (40 draws each)");
  const zero = A_ROUNDS.map((r, i) => hitA(r, popOf(r, i), 0, 20, 2500 + i * 97));
  check("A slope 0, the opening, hits none", zero.every(v => v === 0), zero.map(v => Math.round(100 * v) + "%").join(" / "));
  let most = 0, at = 0;
  for (let b = -1.5; b <= 1.5001; b += 0.01) { const beta = Math.round(b * 100) / 100;
    const c = A_ROUNDS.filter((r, i) => { const pop = popOf(r, i); return Math.abs(A_stats(pop, A_lambda(pop, beta)).shift - r.S) <= A_tol(r); }).length;
    if (c > most) { most = c; at = beta; } }
  check("A no one slope clears three rounds", most <= 2, "301 slopes on the expected offspring: the greediest (" + at + ") clears " + most);
  const spreadOK = A_ROUNDS.map((r, i) => { const pop = popOf(r, i); return Math.round(200 * r.S / pop.V) / 100; });
  check("A the slope a round needs changes with its spread", Math.max(...spreadOK.map(Math.abs)) / Math.min(...spreadOK.map(Math.abs)) > 3,
        "slopes: " + spreadOK.join(", ") + " — spreads " + A_ROUNDS.map(r => r.sd).join(", "));
}
/* ---- the drag puts the slope where the pointer is ---------------------- */
{
  const cv = document.getElementById("A_scatter"), rc = cv.getBoundingClientRect(), W = +cv.dataset.drawW, H = +cv.dataset.cssH;
  const keep = A.beta; A.drawn = null;
  const f = A_frameTop(W, H), z = A.pop.zb + 2 * A.pop.sd, w = A_WBAR + 0.4 * (2 * A.pop.sd);
  A_dragTo({ clientX: rc.left + f.x(z) * rc.width / W, clientY: rc.top + f.y(w) * rc.height / H });
  const got = A.beta; A.beta = keep; A_syncSliders(); A_paint();
  check("A dragging on the plot sets the slope through the pointer", Math.abs(got - 0.4) <= 0.02, "pointer on the line of slope 0.40 through the average parent: slope set to " + got);
}
/* ---- B: the model, recomputed here -------------------------------------- */
const B_gen = (h2, beta, seed) => B_breed(B_makePop(h2, seed), beta, mulberry32(seed + 17));
{
  /* the offspring move h2 times the parents who bred: pooled slope through
     the origin, 60 runs at slopes -1 and +1 */
  const rows = [0, 0.25, 0.5, 0.8, 1].map(h2 => { let sr = 0, ss = 0;
    for (let q = 0; q < 30; q++) for (const beta of [-1, 1]) {
      const g = B_gen(h2, beta, 3000 + q * 131 + Math.round(h2 * 1000) + (beta > 0 ? 7 : 0)); sr += g.S * g.R; ss += g.S * g.S; }
    return { h2, slope: sr / ss }; });
  check("B the offspring move h² times the parents who bred", rows.every(q => Math.abs(q.slope - q.h2) < 0.05),
        rows.map(q => "h² " + q.h2 + " → " + q.slope.toFixed(3)).join("  ") + "  (60 runs each)");
  /* none inherited: ratchet the slope to the stop and nothing moves */
  const flat = [-1.5, 1.5].map(beta => { const R = [], S = []; for (let q = 0; q < 20; q++) { const g = B_gen(0, beta, 3500 + q * 17 + (beta > 0 ? 3 : 0)); R.push(g.R); S.push(g.S); }
    return { beta, R: mn(R), S: mn(S), se: sdv(R) / Math.sqrt(R.length) }; });
  check("B no inherited variation: no response at the slider's stops", flat.every(q => Math.abs(q.R) < 3 * q.se + 0.005 && Math.abs(q.S) > 0.5),
        flat.map(q => "slope " + q.beta + ": parents moved " + q.S.toFixed(3) + ", offspring " + q.R.toFixed(4) + " ± " + q.se.toFixed(4)).join("  "));
  /* the spread holds across the generation: a midparent halves the inherited
     variance and the segregation term puts it back */
  const vs = []; for (let q = 0; q < 20; q++) { const g = B_gen(0.5, 0, 3700 + q * 29); vs.push(sdv(Array.from(g.zo)) ** 2); }
  check("B at slope 0 the offspring vary as much as their parents", Math.abs(mn(vs) - 1) < 0.03, "offspring variance " + mn(vs).toFixed(3) + " (parents 1), 20 runs, h² 0.5");
  /* every population varies alike, so one slope gives one shift */
  const sh = [0.2, 0.5, 0.9].map(h2 => { const S = []; for (let q = 0; q < 20; q++) S.push(B_gen(h2, 1, 3900 + q * 23 + Math.round(h2 * 100)).S); return mn(S); });
  check("B one slope moves the parents who bred alike in every population", Math.max(...sh) - Math.min(...sh) < 0.03,
        "slope 1: h² 0.2, 0.5, 0.9 → " + sh.map(v => v.toFixed(3)).join(", "));
}
{
  /* the printed arithmetic, against a hand count */
  const pop = B_makePop(0.6, 4242), g = B_breed(pop, 1, mulberry32(4243));
  let zb = 0, sw = 0, swz = 0, so = 0; for (let i = 0; i < pop.z.length; i++) { zb += pop.z[i] / pop.z.length; sw += g.uses[i]; swz += g.uses[i] * pop.z[i]; so += g.zo[i]; }
  const S = swz / sw - zb, R = so / g.zo.length - zb;
  const keep = { run: B.run, frame: B.frame, pts: B.pts };
  g.parents = pop; g.key = "r1"; B.run = g; B.frame = null; B_drawGen();
  const txt = document.getElementById("B_read").textContent.replace(/\\s+/g, " ");
  const num = re => { const m = re.exec(txt); return m ? +m[1] : NaN; };
  const pS = num(/bred moved ([+-][0-9.]+)/), pR = num(/offspring moved ([+-][0-9.]+)/), pQ = num(/parents ([0-9.-]+)/);
  B.pts = [{ key: "r2", S: 0.3, R: 0.2 }, { key: "r2", S: -0.5, R: -0.4 }, { key: "r2", S: 0.6, R: 0.5 }]; B_drawPts();
  const fit = (0.3 * 0.2 + 0.5 * 0.4 + 0.6 * 0.5) / (0.09 + 0.25 + 0.36);
  const pF = +(/population 2: 3 runs · slope of its line ([0-9.]+)/.exec(document.getElementById("B_ptsRead").textContent) || [0, NaN])[1];
  Object.assign(B, keep); B_paint();
  check("B the printed shifts, ratio and fitted slope agree with a hand count",
        sw === 2 * pop.z.length && pS === +S.toFixed(2) && pR === +R.toFixed(2) && pQ === +(R / S).toFixed(2) && pF === +fit.toFixed(2),
        "parents counted " + sw + " times (2 per child); printed " + pS + ", " + pR + ", ratio " + pQ + " — by hand " + S.toFixed(3) + ", " + R.toFixed(3) + ", " + (R / S).toFixed(3) +
        "; fitted slope printed " + pF + ", by hand " + fit.toFixed(3));
}
/* ---- B: the rounds ------------------------------------------------------ */
{
  const rate = (r, beta, reps, seed) => { let k = 0; for (let q = 0; q < reps; q++) if (Math.abs(B_gen(r.h2, beta, seed + q * 7919).R - r.R) <= B_TOL) k++; return k / reps; };
  const slopes = []; for (let b = -1.5; b <= 1.5001; b += 0.05) slopes.push(Math.round(b * 100) / 100);
  const table = B_ROUNDS.map((r, i) => slopes.map(b => rate(r, b, 12, 5000 + i * 97 + Math.round(b * 100) * 3)));
  const best = B_ROUNDS.map((r, i) => { let j = 0; table[i].forEach((v, k) => { if (v > table[i][j]) j = k; });
    return { k: r.key, b: slopes[j], v: rate(r, slopes[j], 40, 9000 + i * 31) }; });
  check("B every round is hit at its best slope", best.every(q => q.v >= 0.7),
        best.map(q => q.k + " @" + q.b + ": " + Math.round(100 * q.v) + "%").join("  ") + "  (best of 61 slopes by 12 runs, then 40 fresh)");
  const zero = B_ROUNDS.map((r, i) => rate(r, 0, 20, 9500 + i * 31));
  check("B slope 0, the opening, hits none", zero.every(v => v === 0), zero.map(v => Math.round(100 * v) + "%").join(" / "));
  let most = 0, at = 0;
  slopes.forEach((b, j) => { const c = B_ROUNDS.filter((_, i) => table[i][j] >= 0.5).length; if (c > most) { most = c; at = b; } });
  check("B no one slope clears three rounds", most <= 2, "61 slopes, 12 runs each: the greediest (" + at + ") hits half the time or more in " + most);
}
/* ---- C: the regression, recomputed here --------------------------------- */
const C_popOf = i => C_makePop(C_ROUNDS[i], pageSeed("l13Cp", 1, 99999) + (i + 1) * 7919);
{
  /* a hand solve: the 3 x 3 normal equations on raw sums, by elimination */
  const solve = pop => { const n = pop.w.length, X = i => [1, pop.z1[i], pop.z2[i]];
    const A = [[0,0,0],[0,0,0],[0,0,0]], y = [0,0,0];
    for (let i = 0; i < n; i++) { const x = X(i); for (let a = 0; a < 3; a++) { y[a] += x[a] * pop.w[i]; for (let b = 0; b < 3; b++) A[a][b] += x[a] * x[b]; } }
    for (let c = 0; c < 3; c++) for (let r = c + 1; r < 3; r++) { const k = A[r][c] / A[c][c]; for (let q = c; q < 3; q++) A[r][q] -= k * A[c][q]; y[r] -= k * y[c]; }
    const b = [0,0,0]; for (let r = 2; r >= 0; r--) { let t = y[r]; for (let q = r + 1; q < 3; q++) t -= A[r][q] * b[q]; b[r] = t / A[r][r]; }
    let ss = 0; for (let i = 0; i < n; i++) { const e = pop.w[i] - b[0] - b[1] * pop.z1[i] - b[2] * pop.z2[i]; ss += e * e / n; }
    return { b1: b[1], b2: b[2], sig: Math.sqrt(ss) }; };
  let worst = 0, lean = 0, sdGap = 0, corr = 0, one = 0, view = 0;
  const pops = C_ROUNDS.map((_, i) => C_popOf(i));
  for (const pop of pops) {
    const f = pop.fit, h = solve(pop);
    worst = Math.max(worst, Math.abs(f.b1 - h.b1), Math.abs(f.b2 - h.b2), Math.abs(f.sig - h.sig));
    const st = C_leftStats(pop, f.b1, f.b2);
    lean = Math.max(lean, Math.abs(st.lean1), Math.abs(st.lean2)); sdGap = Math.max(sdGap, Math.abs(st.sd - f.sig));
    corr = Math.max(corr, Math.abs(f.c12));
    /* one trait at a time: slope, and the spread left around it */
    for (const k of [1, 2]) { const z = k === 1 ? pop.z1 : pop.z2, m = k === 1 ? f.m1 : f.m2, v = k === 1 ? f.v1 : f.v2;
      let c = 0; for (let i = 0; i < C_N; i++) c += (z[i] - m) * (pop.w[i] - f.mw) / C_N;
      const slope = c / v; let ss = 0; for (let i = 0; i < C_N; i++) { const e = pop.w[i] - f.mw - slope * (z[i] - m); ss += e * e / C_N; }
      one = Math.max(one, Math.abs(slope - (k === 1 ? f.b1 : f.b2)));
      const keep = { b1: C.b1, b2: C.b2, sig: C.sig }; C.b1 = f.b1; C.b2 = f.b2; C.sig = f.sig;
      view = Math.max(view, Math.abs(Math.sqrt(ss) - C_viewSpread(pop, k))); Object.assign(C, keep); }
  }
  check("C the page's least squares agrees with a hand solve", worst < 1e-9, "5 populations: largest gap " + worst.toExponential(1));
  check("C at the least-squares arrows the leftover leans on neither trait, and its spread is the box", lean < 1e-9 && sdGap < 1e-9,
        "largest lean " + lean.toExponential(1) + ", spread vs fit " + sdGap.toExponential(1));
  check("C the traits are unrelated, so each one-trait slope is its arrow", corr < 1e-12 && one < 1e-9, "largest correlation " + corr.toExponential(1) + ", slope vs arrow " + one.toExponential(1));
  check("C a one-trait picture's spread is the other arrow plus the box, as the band says", view < 1e-9, "measured vs printed: largest gap " + view.toExponential(1));
  /* the least-squares arrows leave the least over */
  let least = true; const eg = [];
  pops.forEach((pop, i) => { const f = pop.fit, sd0 = C_leftStats(pop, f.b1, f.b2).sd;
    for (const [d1, d2] of [[0.3, 0], [-0.3, 0], [0, 0.3], [0, -0.3]]) { const sd = C_leftStats(pop, f.b1 + d1, f.b2 + d2).sd; if (sd <= sd0) least = false; if (i === 1 && d1 > 0) eg.push(sd0.toFixed(3) + " → " + sd.toFixed(3)); } });
  check("C the least-squares arrows leave the least over", least, "every arrow nudged 0.3 either way leaves more, all 5 populations (e.g. " + eg.join("") + ")");
  const bands = pops.map(pop => { const f = pop.fit, keep = { b1: C.b1, b2: C.b2, sig: C.sig }; C.b1 = f.b1; C.b2 = f.b2; C.sig = f.sig;
    const r = [C_inBand(pop, 1), C_inBand(pop, 2)]; Object.assign(C, keep); return r; });
  check("C at the right diagram each band holds about two in three", bands.every(q => q.every(v => v >= 0.58 && v <= 0.78)),
        bands.map(q => q.map(v => Math.round(100 * v) + "%").join("/")).join("  "));
}
/* ---- C: the rounds ------------------------------------------------------ */
{
  const pops = C_ROUNDS.map((_, i) => C_popOf(i)), r1 = v => Math.round(v * 10) / 10;
  const hits = d => pops.map(pop => { const j = C_judge(pop, d(pop)); return j.ok1 && j.ok2 && j.ok3; });
  const ls = hits(pop => ({ b1: r1(pop.fit.b1), b2: r1(pop.fit.b2), sig: r1(pop.fit.sig) }));
  check("C every round is hit at its least-squares diagram, on the slider's steps", ls.every(Boolean), ls.map(v => v ? "hit" : "MISS").join(" / "));
  const open = hits(() => ({ b1: 0, b2: 0, sig: 3 }));
  check("C the opening diagram hits none", open.every(v => !v), open.map(v => v ? "HIT" : "miss").join(" / "));
  /* the natural mistake: arrows right, the box read off the wider one-trait picture */
  const naive = hits(pop => { const f = pop.fit, s1 = Math.sqrt(f.b2 * f.b2 * f.v2 + f.sig * f.sig), s2 = Math.sqrt(f.b1 * f.b1 * f.v1 + f.sig * f.sig);
    return { b1: r1(f.b1), b2: r1(f.b2), sig: r1(Math.max(s1, s2)) }; });
  check("C reading the box off one picture misses most rounds", naive.filter(Boolean).length <= 1,
        naive.map((v, i) => C_ROUNDS[i].key + (v ? " hit" : " miss")).join("  ") + " (arrows right, box = the wider picture's spread)");
  let most = 0, at = null;
  for (let b1 = -4; b1 <= 4; b1 += 0.5) for (let b2 = -4; b2 <= 4; b2 += 0.5) for (let sg = 0; sg <= 6; sg += 0.5) {
    const c = hits(() => ({ b1, b2, sig: sg })).filter(Boolean).length; if (c > most) { most = c; at = [b1, b2, sg]; } }
  check("C no one diagram clears three rounds", most <= 2, "3757 diagrams on a 0.5 grid: the greediest (" + at + ") clears " + most);
}
/* ---- D: three causes tied by an allele ---------------------------------- */
const D_popOf = i => D_makePop(D_ROUNDS[i], pageSeed("l13Dp", 1, 99999) + (i + 1) * 7919);
{
  const pops = D_ROUNDS.map((_, i) => D_popOf(i));
  /* a hand solve: the 4 x 4 normal equations on raw sums, by elimination */
  const solve = pop => { const n = pop.w.length, K = 4, A = [], y = [0,0,0,0];
    for (let a = 0; a < K; a++) A.push([0,0,0,0]);
    for (let i = 0; i < n; i++) { const x = [1, pop.x[0][i], pop.x[1][i], pop.x[2][i]];
      for (let a = 0; a < K; a++) { y[a] += x[a] * pop.w[i]; for (let b = 0; b < K; b++) A[a][b] += x[a] * x[b]; } }
    for (let c = 0; c < K; c++) for (let r = c + 1; r < K; r++) { const k = A[r][c] / A[c][c]; for (let q = c; q < K; q++) A[r][q] -= k * A[c][q]; y[r] -= k * y[c]; }
    const b = [0,0,0,0]; for (let r = K - 1; r >= 0; r--) { let t = y[r]; for (let q = r + 1; q < K; q++) t -= A[r][q] * b[q]; b[r] = t / A[r][r]; }
    return b.slice(1); };
  let worst = 0, lean = 0, sdGap = 0, pic = 0;
  for (const pop of pops) {
    const f = pop.fit, h = solve(pop);
    worst = Math.max(worst, ...h.map((v, j) => Math.abs(v - f.b[j])));
    const st = D_leftStats(pop, f.b); lean = Math.max(lean, ...st.lean.map(Math.abs)); sdGap = Math.max(sdGap, Math.abs(st.sd - f.sig));
    /* each picture on its own, measured, against what the fitted diagram draws there */
    for (const k of [0, 1, 2]) { const m = f.m[k]; let c = 0, v = 0;
      for (let i = 0; i < D_N; i++) { c += (pop.x[k][i] - m) * (pop.w[i] - f.mw) / D_N; v += (pop.x[k][i] - m) ** 2 / D_N; }
      const slope = c / v; let ss = 0; for (let i = 0; i < D_N; i++) { const e = pop.w[i] - f.mw - slope * (pop.x[k][i] - m); ss += e * e / D_N; }
      const im = D_implied(pop, k, f.b, f.sig); pic = Math.max(pic, Math.abs(im.slope - slope), Math.abs(im.spread - Math.sqrt(ss))); }
  }
  check("D the page's least squares agrees with a hand solve", worst < 1e-9, "5 populations, 3 slopes each: largest gap " + worst.toExponential(1));
  check("D at the least-squares arrows the leftover leans on none of the three, and its spread is the box", lean < 1e-9 && sdGap < 1e-9,
        "largest lean " + lean.toExponential(1) + ", spread vs fit " + sdGap.toExponential(1));
  check("D at the fit, the line and band the diagram draws in each picture are that picture's own", pic < 1e-9, "slope and spread, 15 pictures: largest gap " + pic.toExponential(1));
  const f1 = pops[0].fit, f2_ = pops[1].fit;
  check("D a confounded trait and a mediated allele show slopes their own arrows lack",
        f1.one[2] >= 1 && Math.abs(f1.b[2]) <= 0.5 && f2_.one[0] >= 2 && Math.abs(f2_.b[0]) <= 0.5,
        "r1 stem height: picture " + f1.one[2].toFixed(2) + ", arrow " + f1.b[2].toFixed(2) + "  |  r2 allele: picture " + f2_.one[0].toFixed(2) + ", arrow " + f2_.b[0].toFixed(2));
  const bands = pops.map(pop => { const keep = { b: D.b.slice(), sig: D.sig }; D.b = pop.fit.b.slice(); D.sig = pop.fit.sig;
    const r = [0, 1, 2].map(k => D_inBand(pop, k)); D.b = keep.b; D.sig = keep.sig; return r; });
  check("D at the right diagram each band holds about two in three", bands.every(q => q.every(v => v >= 0.58 && v <= 0.78)),
        bands.map(q => q.map(v => Math.round(100 * v) + "%").join("/")).join("  "));
  const r1 = v => Math.round(v * 10) / 10;
  const hits = d => pops.map(pop => D_judge(pop, d(pop).b, d(pop).sig).ok.every(Boolean));
  const ls = hits(pop => ({ b: pop.fit.b.map(r1), sig: r1(pop.fit.sig) }));
  check("D every round is hit at its least-squares diagram, on the slider's steps", ls.every(Boolean), ls.map(v => v ? "hit" : "MISS").join(" / "));
  const open = hits(() => ({ b: [0, 0, 0], sig: 3 }));
  check("D the opening diagram hits none", open.every(v => !v), open.map(v => v ? "HIT" : "miss").join(" / "));
  const naive = hits(pop => ({ b: pop.fit.one.map(r1), sig: r1(pop.fit.sig) }));
  check("D reading each arrow off its own picture misses most rounds", naive.filter(Boolean).length <= 1,
        naive.map((v, i) => D_ROUNDS[i].key + (v ? " hit" : " miss")).join("  ") + " (box right)");
  let most = 0, at = null; const fits = pops.map(p => p.fit);
  for (let a = -4; a <= 4; a += 0.5) for (let b = -4; b <= 4; b += 0.5) for (let c = -4; c <= 4; c += 0.5) for (let sg = 0; sg <= 6; sg += 0.5) {
    let n = 0; for (const f of fits) if (Math.abs(a - f.b[0]) <= D_TOL && Math.abs(b - f.b[1]) <= D_TOL && Math.abs(c - f.b[2]) <= D_TOL && Math.abs(sg - f.sig) <= D_TOL) n++;
    if (n > most) { most = n; at = [a, b, c, sg]; } }
  check("D no one diagram clears three rounds", most <= 2, "63869 diagrams on a 0.5 grid: the greediest (" + at + ") clears " + most);
}
/* ---- E: the collider ---------------------------------------------------- */
{
  const pop = E_makePop(4321), all = E_slope(pop, null);
  const counts = [0.25, 0.5, 0.8].map(k => E_alive(pop, 1, 1, k, pop.luck).alive.reduce((x, y) => x + y, 0));
  check("E across all seedlings the traits are unrelated, and the drought kills exactly its share",
        Math.abs(all.slope) < 1e-12 && counts[0] === 1500 && counts[1] === 1000 && counts[2] === 400,
        "slope among all " + all.slope.toExponential(1) + "; survivors at 25/50/80% killed: " + counts.join(", "));
  /* with no luck, equal arrows: survival cuts (f + h)/sqrt2 at c; lambda = phi(c)/(1 - Phi(c));
     delta = lambda (lambda - c); the survivors' slope of stem on flower is -delta / (2 - delta) */
  const erf = x => { const t = 1 / (1 + 0.3275911 * Math.abs(x)), y = 1 - (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-x * x);
    return x >= 0 ? y : -y; };
  const Phi = x => 0.5 * (1 + erf(x / Math.SQRT2)), phi = x => Math.exp(-x * x / 2) / Math.sqrt(2 * Math.PI);
  const qn = p => { let lo = -8, hi = 8; for (let k = 0; k < 80; k++) { const m = (lo + hi) / 2; if (Phi(m) < p) lo = m; else hi = m; } return (lo + hi) / 2; };
  const rows = [0.3, 0.6, 0.9].map(k => { const c = qn(k), lam = phi(c) / (1 - Phi(c)), d = lam * (lam - c);
    let m = 0; for (let q = 0; q < 8; q++) m += E_slope(E_makePop(5000 + q * 37), E_alive(E_makePop(5000 + q * 37), 1, 1, k, null).alive).slope / 8;
    return { k, got: m, want: -d / (2 - d) }; });
  check("E with no luck the survivors' slope is the truncated-normal value", rows.every(q => Math.abs(q.got - q.want) < 0.03),
        rows.map(q => Math.round(q.k * 100) + "% killed: " + q.got.toFixed(3) + " [formula " + q.want.toFixed(3) + "]").join("  ") + "  (8 populations each)");
  const mean = (wf, wh, k) => { let m = 0; for (let q = 0; q < 10; q++) { const pp = E_makePop(6000 + q * 41), rng = mulberry32(6100 + q * 43), lk = Float64Array.from({ length: E_N }, () => A_gauss(rng));
    m += E_slope(pp, E_alive(pp, wf, wh, k, lk).alive).slope / 10; } return m; };
  const eq = [0, 0.2, 0.5, 0.8].map(k => mean(1, 1, k)), flip = mean(1, -1, 0.5);
  check("E the survivors' trade-off deepens with the drought, and flips sign with the rule",
        Math.abs(eq[0]) < 0.02 && eq[1] < -0.1 && eq[2] < eq[1] && eq[3] < eq[2] && flip > 0.3,
        "equal arrows, 0/20/50/80% killed: " + eq.map(v => v.toFixed(2)).join(", ") + "  |  flower +1, stem -1, 50%: " + flip.toFixed(2) + "  (10 runs each)");
}
{
  const kills = []; for (let k = 0; k <= 0.95001; k += 0.05) kills.push(Math.round(k * 100) / 100);
  const one = (r, k, seed) => { const pp = E_makePop(seed), rng = mulberry32(seed + 17), lk = new Float64Array(E_N);
    for (let i = 0; i < E_N; i++) lk[i] = A_gauss(rng); return E_slope(pp, E_alive(pp, r.wf, r.wh, k, lk).alive).slope; };
  const rate = (r, k, reps, seed) => { let c = 0; for (let q = 0; q < reps; q++) if (Math.abs(one(r, k, seed + q * 7919) - r.T) <= E_TOL) c++; return c / reps; };
  const table = E_ROUNDS.map((r, i) => kills.map(k => rate(r, k, 10, 7000 + i * 97 + Math.round(k * 100) * 3)));
  const best = E_ROUNDS.map((r, i) => { let j = 0; table[i].forEach((v, q) => { if (v > table[i][j]) j = q; });
    return { k: r.key, kill: kills[j], v: rate(r, kills[j], 40, 9100 + i * 31) }; });
  check("E every round is hit at its best drought", best.every(q => q.v >= 0.7),
        best.map(q => q.k + " @" + Math.round(q.kill * 100) + "%: " + Math.round(100 * q.v) + "%").join("  ") + "  (best of 20 by 10 runs, then 40 fresh)");
  const zero = E_ROUNDS.map((r, i) => rate(r, 0, 10, 9500 + i * 31));
  check("E no drought, the opening, hits none", zero.every(v => v === 0), zero.map(v => Math.round(100 * v) + "%").join(" / "));
  let most = 0, at = 0;
  kills.forEach((k, j) => { const c = E_ROUNDS.filter((_, i) => table[i][j] >= 0.5).length; if (c > most) { most = c; at = k; } });
  check("E no one drought clears three rounds", most <= 2, "20 droughts, 10 runs each: the greediest (" + Math.round(at * 100) + "%) hits half the time or more in " + most);
}
/* ---- every plot inside its panel --------------------------------------- */
{
  document.getElementById("stageE").classList.remove("stage-locked");
  document.getElementById("stageB").classList.remove("stage-locked");
  document.getElementById("stageC").classList.remove("stage-locked");
  document.getElementById("stageD").classList.remove("stage-locked");
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

/* ---- the practice switch, through the real buttons. Last: spends one
   scored attempt of each game. The runs animate on setInterval; a stand-in
   runs each out. */
{
  const realSI = window.setInterval, realCI = window.clearInterval;
  let loop = false, stop = false;
  window.setInterval = fn => { loop = true; stop = false; for (let k = 0; k < 20000 && !stop; k++) fn(); loop = false; return 0; };
  window.clearInterval = id => { if (loop) stop = true; else realCI(id); };
  const out = [], stages = { A, B, C, D, E };
  let hidden = "", shown = "", leftBefore = "", leftAfter = "", dBefore = "", dAfter = "";
  try {
    for (const [S, go] of [["A", "A_run"], ["B", "B_run"], ["C", "C_run"], ["D", "D_run"], ["E", "E_run"]]) {
      document.getElementById("stage" + S).classList.remove("stage-locked");
      const g = stages[S].game, box = document.getElementById(S + "_practice"), btn = document.getElementById(go);
      const tick = on => { box.checked = on; box.dispatchEvent(new Event("change")); };
      const n0 = g.st.hits.length;
      if (S === "C") { tick(false); leftBefore = document.getElementById("C_leftRead").textContent; }
      if (S === "D") { tick(false); dBefore = document.getElementById("D_leftRead").textContent; }
      tick(true); btn.click();
      const pracOk = g.st.hits.length === n0 && g.st.last != null && /practice/.test(document.getElementById(S + "_tflip").textContent);
      if (S === "B") hidden = document.getElementById("B_ptsRead").textContent;
      tick(false); btn.click();
      if (S === "B") shown = document.getElementById("B_ptsRead").textContent;
      if (S === "C") leftAfter = document.getElementById("C_leftRead").textContent;
      if (S === "D") dAfter = document.getElementById("D_leftRead").textContent;
      const scored = g.st.hits.length === n0 + 1 && g.waiting(), blocked = btn.disabled;
      tick(true); btn.click();
      const stillPrac = !btn.disabled && g.st.hits.length === n0 + 1 && g.waiting();
      tick(false);
      out.push({ ok: pracOk && scored && blocked && stillPrac,
                 t: S + ": practice " + (pracOk ? "unscored" : "SCORED") + ", ticked off " + (scored ? "scored" : "NOT scored") +
                    ", waiting " + (blocked ? "Go off" : "GO ON") + (stillPrac ? " but practice runs" : ", practice BLOCKED") });
    }
  } finally { window.setInterval = realSI; window.clearInterval = realCI; }
  check("every stage has a practice switch that does not score", out.length === 5 && out.every(q => q.ok), out.map(q => q.t).join("  |  "));
  check("C the leftover waits for Go in a round, and shows after it", !/left over: spread/.test(leftBefore) && /left over: spread/.test(leftAfter) && /least squares on these plants/.test(leftAfter),
        "before: '" + leftBefore.trim().slice(0, 40) + "'; after the scored run: '" + leftAfter.trim().slice(0, 40) + "…'");
  check("D the leftover waits for Go in a round, and shows after it", !/left over: spread/.test(dBefore) && /left over: spread/.test(dAfter) && /least squares on these plants/.test(dAfter),
        "before: '" + dBefore.trim().slice(0, 40) + "'; after the scored run: '" + dAfter.trim().slice(0, 40) + "…'");
  const h1 = f2(B_ROUNDS[0].h2);
  check("B a population's inherited share shows only after its scored run", /inherited share \\?/.test(hidden) && new RegExp("inherited share " + h1).test(shown),
        "after a practice run: '" + (/population 1[^\\n]*/.exec(hidden) || [""])[0].trim() + "'; after the scored run: '" + (/population 1[^\\n]*/.exec(shown) || [""])[0].trim() + "'");
}

say(bad ? ("FAILED " + bad) : "ALL BARS PASS");
say("RAN " + ran);
L.join(" ;; ");
`;

const probe = `<!doctype html><meta charset="utf-8"><title>pending</title>
<iframe id="f" src="http://127.0.0.1:${PORT}/app/lessons/lesson13.html?preview=1" width="1500" height="1000"></iframe>
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

const probePath = path.join(ROOT, "_check_l13.html");
fs.writeFileSync(probePath, probe);
const server = spawn("python3", ["-m", "http.server", String(PORT), "--directory", ROOT],
                     { stdio: "ignore", detached: true });
const cleanup = () => { try { process.kill(-server.pid); } catch (e) {} try { fs.unlinkSync(probePath); } catch (e) {} };
process.on("exit", cleanup);

setTimeout(() => {
  const r = spawnSync(CHROME, ["--headless=new", "--disable-gpu", "--virtual-time-budget=900000",
                               "--dump-dom", `http://127.0.0.1:${PORT}/_check_l13.html`],
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
