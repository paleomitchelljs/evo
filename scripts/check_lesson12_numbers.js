#!/usr/bin/env node
/*
 * check_lesson12_numbers.js -- the bar checks for app/lessons/lesson12.html.
 *
 * Lesson 12 is a draft (2026-09-24, restructured 2026-09-27): Stage A (a
 * meadow where a gene and its visitors make h and s), Stage B (one locus,
 * five rounds, one per kind of dominance), Stage C (four alleles racing),
 * Stage D (a valley that only small populations cross) and Stage E (the
 * population's mean fitness). None of its bars can be seen by opening the
 * page:
 *
 *   1. the simulator is the model the bars describe (one generation's change
 *      against the recursion, re-derived here), and F is held where set;
 *   2. every round is hit at a setting built for it;
 *   3. the rounds cannot be cleared without the dominance they are about,
 *      and not by the opening setting;
 *   4. no one constant setting clears three.
 *
 * Same harness as check_lesson11_numbers.js: the checks run inside a
 * same-origin iframe against the page's own functions; the report comes back
 * in a <pre>, and the runner fails if fewer checks come back than ran.
 *
 * Usage:  node scripts/check_lesson12_numbers.js
 * Exit 0 iff every bar passes. Needs Google Chrome and python3.
 */
const { spawn, spawnSync } = require("child_process");
const fs = require("fs"), path = require("path");

const ROOT = path.resolve(__dirname, "..");
const PORT = 8793;
const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

const INNER = `
const L=[], say=s=>L.push(s);
let bad = 0, ran = 0;
const check = (name, ok, detail) => { ran++; if (!ok) bad++; say((ok?"ok   ":"FAIL ") + name + "  " + detail); };
const mn = a => a.reduce((x,y)=>x+y,0)/a.length;
const sdv = a => { const m = mn(a); return Math.sqrt(a.reduce((x,y)=>x+(y-m)*(y-m),0)/Math.max(1,a.length-1)); };

check("page loaded", !!(A && A.game && B && B.game && C && C.game && D && D.game && E && E.game && typeof Score !== "undefined"), "Stages A-E and Score are defined");
check("slots declared match slots written", Object.keys(BIT).length === 5, Object.keys(BIT).length + " named bits, scaffold is 5");

/* ---- A. the meadow -------------------------------------------------------
   Written here from the setup's sentences, not read off the page: a visitor
   takes a flower fully at or past its edge, a share rising over 0.2 before
   it, and a tenth of a share for any other colour; each visit picks a
   flower in proportion; a visit is a seed. */
const lkH = (r, t) => 0.1 + 0.9 * Math.min(1, Math.max(0, (r - t + 0.2) / 0.2));
const lkB = (r, t) => 0.1 + 0.9 * Math.min(1, Math.max(0, (t - r + 0.2) / 0.2));
const aWant = (d, nH, tH, nB, tB) => { const R = [0, d, 1], sH = R.reduce((x, r) => x + lkH(r, tH), 0), sB = R.reduce((x, r) => x + lkB(r, tB), 0);
  return R.map(r => 300 * (nH * lkH(r, tH) / sH + nB * lkB(r, tB) / sB) / 12); };
const aHS = w => ({ s: w[2] / w[0] - 1, h: (w[1] - w[0]) / (w[2] - w[0]) });
{
  const rep = []; let fails = 0;
  for (const st of [[0.5, 8, 0.3, 2, 0.3], [0.5, 7, 0.3, 3, 0.7], [0.3, 6, 0.8, 3, 0.3], [0.5, 5, 0, 5, 1]]) {
    const want = aWant(...st), page = A_expect(...st).w, v = [[], [], []];
    for (let q = 0; q < 120; q++) { const S = A_season(...st, mulberry32(20000 + q * 7919)); S.w.forEach((x, g) => v[g].push(x)); }
    const got = v.map(mn), se = v.map(a => sdv(a) / Math.sqrt(a.length));
    got.forEach((m, g) => { if (Math.abs(m - want[g]) > 3 * se[g] + 0.05 || Math.abs(page[g] - want[g]) > 1e-9) fails++; });
    rep.push(st.join("/") + ": " + got.map(x => x.toFixed(1)).join(" ") + " vs " + want.map(x => x.toFixed(1)).join(" "));
  }
  check("A a season's seeds are the visit shares", fails === 0, "d/nH/tH/nB/tB, seeds per flower white pink red, 120 seasons vs written here: " + rep.join("  "));
}
const hitA = (r, st, reps, seed) => { let k = 0;
  for (let q = 0; q < reps; q++) if (A_judge(r, A_season(...st, mulberry32(seed + q * 7919)).w)) k++; return k / reps; };
const withHold = (r, d, nH, tH, nB, tB) => r.hold.d != null ? [r.hold.d, nH, tH, nB, tB] : [d, r.hold.env.nH, r.hold.env.tH, r.hold.env.nB, r.hold.env.tB];
{
  const aim = { asred: [0.5, 8, 0.3, 2, 0.3], best: [0.5, 7, 0.3, 3, 0.7], worst: [0.5, 7, 0.7, 3, 0.3], aswhite: [0.2, 0, 0, 0, 0], asred2: [0.9, 0, 0, 0, 0] };
  const own = A_ROUNDS.map((r, i) => { const st = withHold(r, ...aim[r.key]); return { k: r.key, st, v: hitA(r, st, 40, 21000 + i * 97) }; });
  check("A every round is hit at a setting built for it", own.every(q => q.v >= 0.8),
        own.map(q => q.k + " @" + q.st.join("/") + ": " + Math.round(100 * q.v) + "%").join("  ") + "  (40 seasons)");
  const open = A_ROUNDS.map((r, i) => { const st = withHold(r, 0.5, 5, 0, 5, 1); return { k: r.key, v: hitA(r, st, 30, 22000 + i * 97) }; });
  check("A the opening setting is not an answer", open.every(q => q.v === 0),
        "pink 0.5, 5 hummingbirds from 0, 5 bees to 1 (what a round holds, held): " + open.map(q => q.k + " " + Math.round(100 * q.v) + "%").join("  "));
}
{
  /* the point of the stage: h moves with the visitors when the gene is
     held, and with the gene when the visitors are held */
  const byEnv = [[8, 0.3, 2, 0.3], [7, 0.3, 3, 0.7], [7, 0.7, 3, 0.3]].map(e => aHS(aWant(0.5, ...e)).h);
  const e = A_ENV, byGene = [0.2, 0.55, 0.9].map(d => aHS(aWant(d, e.nH, e.tH, e.nB, e.tB)).h);
  const spread = a => Math.max(...a) - Math.min(...a);
  check("A h moves with the visitors, and with the gene", spread(byEnv) >= 2 && spread(byGene) >= 1.2,
        "pink 0.5, three sets of visitors: h " + byEnv.map(f2).join(", ") + "; the held visitors, pink 0.2 / 0.55 / 0.9: h " + byGene.map(f2).join(", "));
}
{
  /* one setting across the five, on the arithmetic: every d, every count,
     edges in tenths; the greediest then played for real */
  let most = 0, at = null, n = 0;
  for (let d = 0; d <= 1.0001; d += 0.05) for (let nH = 0; nH <= 10; nH++) for (let nB = 0; nB <= 10; nB++)
    for (let tH = 0; tH <= 1.0001; tH += 0.1) for (let tB = 0; tB <= 1.0001; tB += 0.1) {
      n++;
      const c = A_ROUNDS.filter(r => A_judge(r, A_expect(...withHold(r, d, nH, tH, nB, tB)).w)).length;
      if (c > most) { most = c; at = [+d.toFixed(2), nH, +tH.toFixed(1), nB, +tB.toFixed(1)]; }
    }
  const real = A_ROUNDS.filter((r, i) => hitA(r, withHold(r, ...at), 10, 23000 + i * 97) >= 0.5).length;
  check("A no one setting clears three rounds", most <= 2 && real <= 2,
        n + " settings on the arithmetic: the greediest (" + at.join("/") + ") clears " + most + "; played for real, " + real);
}
{
  /* the bars' readout is the season's own arithmetic */
  const keep = A.season, S = A_season(0.5, 7, 0.3, 3, 0.7, mulberry32(24000));
  A.season = S; A_drawBars();
  const t = document.getElementById("A_read").textContent, q = A_hs(S.w);
  const ms = /s = red . white . 1 =\\s*(-?[0-9.]+)/.exec(t), mh = /h = \\(pink . white\\) . \\(red . white\\) =\\s*(-?[0-9.]+)/.exec(t);
  A.season = keep; A_paint();
  check("A the printed s and h are the season's", !!(ms && mh) && ms[1] === f2(q.s) && mh[1] === f2(q.h),
        "printed s " + (ms ? ms[1] : "?") + ", h " + (mh ? mh[1] : "?") + "; from its seeds " + f2(q.s) + ", " + f2(q.h));
}


/* ---- B. the model, re-derived --------------------------------------------
   Fitness (1, 1 + h s, 1 + s); parents drawn in proportion; with chance
   2F/(1+F) one individual is both parents. The genotype recursion below is
   written here from that sentence, not read off the page. */
const G = B_G;
function det(p0, h, s, F, gens) {
  const sf = 2 * F / (1 + F), w = [1, 1 + h * s, 1 + s];
  let x = [(1 - p0) ** 2, 2 * p0 * (1 - p0), p0 ** 2]; const P = [];
  for (let t = 0; t <= gens; t++) {
    P.push(x[2] + x[1] / 2);
    const wb = x[0] * w[0] + x[1] * w[1] + x[2] * w[2], y = x.map((v, i) => v * w[i] / wb), p = y[2] + y[1] / 2;
    const self = [y[0] + y[1] / 4, y[1] / 2, y[2] + y[1] / 4], rnd = [(1 - p) ** 2, 2 * p * (1 - p), p * p];
    x = [0, 1, 2].map(i => sf * self[i] + (1 - sf) * rnd[i]);
  }
  return P;
}
{
  /* one generation from a random-pairing start: the average change over 300
     runs against the recursion's, 3 SE */
  const rep = []; let fails = 0;
  for (const [p0, h, s] of [[0.3, 0, 0.3], [0.3, 1, 0.3], [0.5, 2, 0.2], [0.5, -1, 0.3], [0.7, 0.5, -0.3]]) {
    const d = []; for (let r = 0; r < 300; r++) d.push(B_run(400, p0, h, s, 0, mulberry32(100 + r * 7919), false, 1).P[1]);
    const want = det(p0, h, s, 0, 1)[1], m = mn(d), se = sdv(d) / Math.sqrt(d.length);
    rep.push("p " + p0 + " h " + h + " s " + s + ": " + m.toFixed(4) + " vs " + want.toFixed(4));
    if (Math.abs(m - want) > 3 * se + 0.002) fails++;   // 0.002: the start is rounded to whole copies
  }
  check("B one generation of the simulator is the model's", fails === 0, rep.join("  "));
}
{
  /* F held: 1 - Ho/He measured in neutral runs, from generation 10 on */
  const rep = []; let fails = 0;
  for (const F of [0, 0.5, 0.8]) {
    const v = [];
    for (let r = 0; r < 20; r++) {
      const R = B_run(400, 0.5, 0.5, 0, F, mulberry32(300 + r * 7919), true, 30);
      for (let t = 10; t <= 30; t++) { const a = R.snaps[t]; let k = 0, het = 0;
        for (let i = 0; i < 400; i++) { k += a[2*i] + a[2*i+1]; if (a[2*i] !== a[2*i+1]) het++; }
        const p = k / 800, he = 2 * p * (1 - p); if (he > 0.1) v.push(1 - (het / 400) / he); }
    }
    rep.push(mn(v).toFixed(3) + " at " + F); if (Math.abs(mn(v) - F) > 0.03) fails++;
  }
  check("B F is held where the slider sets it", fails === 0, "F measured in the runs: " + rep.join("  "));
}

/* ---- the rounds --------------------------------------------------------- */
const hit = (r, n, h, s, F, reps, seed) => { let k = 0;
  for (let i = 0; i < reps; i++) if (B_judge(r, r.starts.map((p0, j) => B_run(n, p0, h, s, F, mulberry32(seed + i * 7919 + j * 104729), false).P))) k++;
  return k / reps; };
const R = {}; for (const r of B_ROUNDS) R[r.key] = r;
{
  const aims = { hide: [-0.2, -0.3, 0], sweep: [1, 0.25, 0], hold: [2, 0.15, 0], split: [-1, 0.3, 0], rescue: [0, 0.2, 0.5] };
  const bar = { hide: 0.5, sweep: 0.55, hold: 0.8, split: 0.8, rescue: 0.65 };
  const res = B_ROUNDS.map((r, i) => { const [h, s, F] = aims[r.key]; return { k: r.key, h, s, F, v: hit(r, 400, h, s, F, 30, 1000 + i * 97) }; });
  check("B every round is hit at a setting built for it", res.every(q => q.v >= bar[q.k]),
        res.map(q => q.k + " @h" + q.h + "/s" + q.s + "/F" + q.F + ": " + Math.round(100 * q.v) + "%").join("  ") + "  (30 runs, 400 individuals)");
}
{
  /* the opening setting; rescue holds h and s, so there it is F 0 */
  const res = B_ROUNDS.map((r, i) => ({ k: r.key, v: r.hold ? hit(r, 400, r.hold.h, r.hold.s, 0, 100, 2000 + i * 97)
                                                       : hit(r, 400, 0.5, 0, 0, 20, 2000 + i * 97) }));
  check("B the opening setting is not an answer", res.every(q => q.v < 0.1),
        "h 0.5, s 0, F 0, 400 individuals: " + res.map(q => q.k + " " + Math.round(100 * q.v) + "%").join("  "));
}
{
  /* no dominance: the best h = 0.5 setting for each free round, found on the
     recursion over s and F, then run for real */
  const sg = []; for (let v = -0.3; v < 0.301; v += 0.01) sg.push(+v.toFixed(2));
  const judgeDet = (r, h, s, F) => B_judge(r, r.starts.map(p0 => det(p0, h, s, F, G)));
  const res = B_ROUNDS.filter(r => !r.hold).map((r, i) => {
    let bestS = null, bestF = 0, cnt = 0;
    for (const s of sg) for (const F of [0, 0.25, 0.5, 0.75]) if (judgeDet(r, 0.5, s, F)) { cnt++; bestS = s; bestF = F; }
    /* nothing passes on the recursion: run the closest near-miss for real */
    if (bestS == null) { let d = 9;
      for (const s of sg) { const Ps = r.starts.map(p0 => det(p0, 0.5, s, 0, G)); const miss = r.split ? 1 : Math.max(...Ps.map(P => Math.max(...r.win.map(([g, lo, hi]) => P[g] < lo ? lo - P[g] : P[g] > hi ? P[g] - hi : 0)))); if (miss < d) { d = miss; bestS = s; } } }
    return { k: r.key, cnt, s: bestS, F: bestF, v: hit(r, 400, 0.5, bestS, bestF, 20, 3000 + i * 97) }; });
  check("B no round is cleared without its dominance", res.every(q => q.cnt === 0 && q.v <= 0.15),
        "h 0.5 settings passing on the model: " + res.map(q => q.k + " " + q.cnt).join(", ") + "; the nearest, run for real: " +
        res.map(q => q.k + " @s" + q.s + " " + Math.round(100 * q.v) + "%").join("  "));
}
{
  /* one constant setting across the five: searched on the model over h, s, F;
     the greediest run for real */
  const hg = []; for (let v = -1; v < 2.001; v += 0.1) hg.push(+v.toFixed(1));
  const sg = []; for (let v = -0.3; v < 0.301; v += 0.02) sg.push(+v.toFixed(2));
  let most = 0, at = null;
  for (const h of hg) for (const s of sg) for (const F of [0, 0.25, 0.5, 0.75]) {
    const c = B_ROUNDS.filter(r => { const hh = r.hold ? r.hold.h : h, ss = r.hold ? r.hold.s : s;
      return B_judge(r, r.starts.map(p0 => det(p0, hh, ss, F, G))); }).length;
    if (c > most) { most = c; at = { h, s, F }; }
  }
  const real = B_ROUNDS.filter((r, i) => hit(r, 400, r.hold ? r.hold.h : at.h, r.hold ? r.hold.s : at.s, at.F, 6, 4000 + i * 97) >= 0.5).length;
  check("B no one setting clears three rounds", most <= 2 && real <= 2,
        hg.length * sg.length * 4 + " settings on the model: the greediest (h " + at.h + ", s " + at.s + ", F " + at.F + ") clears " + most + "; run for real, " + real);
}
{
  const f0 = hit(R.rescue, 400, 0, 0.2, 0, 60, 5000), f5 = hit(R.rescue, 400, 0, 0.2, 0.5, 30, 5100), f75 = hit(R.rescue, 400, 0, 0.2, 0.75, 30, 5200);
  check("B in the rescue round, inbreeding is the lever", f0 <= 0.1 && f5 >= 0.65 && f75 >= f5 - 0.1,
        "recessive, s 0.2: F 0 " + Math.round(100 * f0) + "%, F 0.5 " + Math.round(100 * f5) + "%, F 0.75 " + Math.round(100 * f75) + "%");
}
{
  /* the tipping point the split round is built on: h/(2h-1), 0.33 at h = -1 */
  const lo = mn(Array.from({ length: 30 }, (_, i) => B_run(400, 0.28, -1, 0.3, 0, mulberry32(6000 + i * 7919), false).P[G]));
  const hi = mn(Array.from({ length: 30 }, (_, i) => B_run(400, 0.39, -1, 0.3, 0, mulberry32(6100 + i * 7919), false).P[G]));
  check("B the split round's tipping point is at h/(2h-1)", lo < 0.1 && hi > 0.9,
        "h -1, s 0.3 (tipping point " + (-1 / (2 * -1 - 1)).toFixed(3) + "): from 0.28 purple ends at " + lo.toFixed(2) + " on average, from 0.39 at " + hi.toFixed(2));
}
{
  /* the readout's fitnesses are the sliders' arithmetic */
  const keep = { h: B.h, s: B.s }, rep = []; let ok = true;
  for (const [h, s] of [[0, 0.3], [2, -0.2], [-1, 0.15]]) {
    B.h = h; B.s = s; B_drawFit();
    const t = document.getElementById("B_fitRead").textContent, m = /yellow · heterozygote · purple\\s+([0-9.]+) · ([0-9.]+) · ([0-9.]+)/.exec(t);
    const want = [1, 1 + h * s, 1 + s].map(v => v.toFixed(2)), got = m ? [m[1], m[2], m[3]] : [];
    rep.push(h + "/" + s + ": " + got.join(" "));
    if (got.join() !== want.join()) ok = false;
  }
  B.h = keep.h; B.s = keep.s; B_syncSliders(); B_paint();
  check("B the printed fitnesses are 1, 1 + hs, 1 + s", ok, rep.join("  "));
}

/* ---- C. four alleles race ---------------------------------------------- */
{
  /* the grid is the rule JM agreed: 1 + s_i on the diagonal, 1 + h_i s_i + h_j s_j off it */
  const h = [1, 0, 2, -1], sv = [0.1, 0.2, -0.1, 0.05], Wm = C_W(h, sv); let ok = true;
  for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) {
    const want = i === j ? 1 + sv[i] : 1 + h[i] * sv[i] + h[j] * sv[j];
    if (Math.abs(Wm[i][j] - Math.max(0.05, want)) > 1e-12) ok = false; }
  check("C the fitness grid is 1 + s on the diagonal, 1 + h s + h s off it", ok,
        "blue/orange " + Wm[0][1].toFixed(3) + " (1 + 1·0.1 + 0·0.2), green/yellow " + Wm[2][3].toFixed(3) + " (1 + 2·(-0.1) + (-1)·0.05)");
}
{
  /* one generation of the race against the four-allele recursion, from a
     quarter each: p_i' = p_i Σ_j p_j w_ij / w̄. 300 runs, 3 SE */
  const rep = []; let fails = 0;
  for (const [h, sv] of [[[1, 0, 0.5, 0.5], [0.2, 0.2, 0, 0]], [[2, 2, 2, 2], [0.1, 0.1, 0.1, 0.1]], [[0.5, 0, 1, 0.5], [0.3, -0.2, 0.1, 0]]]) {
    const Wm = C_W(h, sv), p = [0.25, 0.25, 0.25, 0.25];
    const wi = p.map((_, i) => p.reduce((t, pj, j) => t + pj * Wm[i][j], 0)), wbar = p.reduce((t, pi, i) => t + pi * wi[i], 0);
    const want = p.map((pi, i) => pi * wi[i] / wbar);
    const res = C_race(200, h, sv, 0, 300, mulberry32(7100), 0, 1);
    const got = [0, 1, 2, 3].map(k => { const v = []; for (let r = 0; r < 300; r++) v.push(res.ends[4 * r + k]); return [mn(v), sdv(v) / Math.sqrt(300)]; });
    got.forEach(([m, se], k) => { if (Math.abs(m - want[k]) > 3 * se + 0.002) fails++; });
    rep.push(got.map(g => g[0].toFixed(3)).join("/") + " vs " + want.map(v => v.toFixed(3)).join("/"));
  }
  check("C one generation of the race is the four-allele model's", fails === 0, rep.join("  "));
}
{
  const pc = sh => sh.map(v => Math.round(100 * v)).join("/");
  const hitB = (r, n, h, sv, F, reps, seed) => { let k = 0;
    for (let q = 0; q < reps; q++) if (C_hits(C_race(n, h, sv, F, C_R, mulberry32(seed + q * 7919), 0).share, r)) k++; return k / reps; };
  const own = C_ROUNDS.map((r, i) => { C_target(r); return { k: r.key, t: pc(r.tg.share), v: hitB(r, r.N, r.h, r.s, r.F, 10, 8000 + i * 97) }; });
  check("C every round is hit at its own setting", own.every(q => q.v >= 0.7),
        own.map(q => q.k + " (" + q.t + ") " + Math.round(100 * q.v) + "%").join("  ") + "  (10 runs of " + C_R + ")");
  const open = C_ROUNDS.map((r, i) => { const hd = r.hold || {};
    return { k: r.key, v: hitB(r, hd.N ? r.N : 100, hd.hs ? r.h : [0.5, 0.5, 0.5, 0.5], (hd.hs || hd.s) ? r.s : [0, 0, 0, 0], 0, 20, 8500 + i * 97) }; });
  /* 20 runs, at most 10%: the recessive round's opening sits ~2% (measured over
     six targets); a bar of 0 in 5 would fail on sampling one load in ten */
  check("C the opening setting is not an answer", open.every(q => q.v <= 0.1),
        "every s 0 (what a round holds, held), 100 individuals: " + open.map(q => q.k + " " + Math.round(100 * q.v) + "%").join("  "));
  const R = {}; for (const r of C_ROUNDS) R[r.key] = r;
  const noDom = [
    ["recessive, blue without dominance", hitB(R.recessive, 40, [0.5, 0.5, 0.5, 0.5], R.recessive.s, 0, 10, 9000)],
    ["dominance, both without dominance", hitB(R.dominance, 60, [0.5, 0.5, 0.5, 0.5], R.dominance.s, 0, 10, 9100)],
    ["balance, same s without dominance", hitB(R.balance, 30, [0.5, 0.5, 0.5, 0.5], R.balance.s, 0, 10, 9200)]];
  check("C dominance is what the dominance rounds are about", noDom.every(q => q[1] <= 0.2),
        noDom.map(q => q[0] + " " + Math.round(100 * q[1]) + "%").join("  "));
  const big = hitB(R.drift, 100, R.drift.h, R.drift.s, 0, 5, 9300), small = hitB(R.drift, 10, R.drift.h, R.drift.s, 0, 10, 9400);
  const inbred = hitB(R.drift, 20, R.drift.h, R.drift.s, 0.9, 10, 9500);
  check("C an advantageous allele lost to drift: small populations do it", big === 0 && small >= 0.7,
        "blue s 0.1 held: 100 individuals " + Math.round(100 * big) + "%, 10 individuals " + Math.round(100 * small) +
        "% (blue wins " + Math.round(100 * R.drift.tg.share[0]) + "% of the target's populations); 20 individuals at F 0.9 " + Math.round(100 * inbred) + "%");
  /* no one setting clears three: every round's own setting, carried to all five */
  let most = 0, mostAt = "";
  C_ROUNDS.forEach((src, i) => {
    const c = C_ROUNDS.filter((r, j) => { const hd = r.hold || {};
      return hitB(r, hd.N ? r.N : src.N, hd.hs ? r.h : src.h, (hd.hs || hd.s) ? r.s : src.s, src.F, 3, 9600 + i * 13 + j) >= 0.5; }).length;
    if (c > most) { most = c; mostAt = src.key; } });
  check("C no round's setting clears three rounds", most <= 2, "the greediest, " + mostAt + "'s setting, clears " + most + " of 5");
}

/* ---- D. the valley ------------------------------------------------------ */
{
  const w = D_W(0.07);
  check("D the landscape is 1, three valley steps at 1 - depth, 1.2", w.join() === [1, 0.93, 0.93, 0.93, 1.2].map(v => +v.toFixed(2)).join() || w.map(v => v.toFixed(2)).join() === "1.00,0.93,0.93,0.93,1.20",
        "at depth 0.07: " + w.map(v => v.toFixed(2)).join(", "));
  const shareAt = (n, d, reps, seed) => { const v = []; for (let q = 0; q < reps; q++) v.push(D_share(D_runAll(n, d, mulberry32(seed + q * 7919)))); return mn(v); };
  /* Wright's point, measured here: at one depth, small populations cross
     and big ones stay on the low peak */
  const byN = [10, 20, 40, 120].map((n, i) => shareAt(n, 0.05, 3, 11000 + i * 97));
  check("D small populations cross the valley, big ones stay put", byN[0] > byN[2] + 0.2 && byN[3] <= 0.05,
        "depth 0.05, share of 50 on the high peak by generation 1500, averaged over 3 runs: 10 → " + byN.map(v => Math.round(100 * v) + "%").join(", 20 → ").replace(/, 20 → ([^,]+), 20 → ([^,]+), 20 → /, ", 20 → $1, 40 → $2, 120 → "));
  const byD = [0.02, 0.05, 0.10].map((d, i) => shareAt(20, d, 3, 11500 + i * 97));
  check("D a deeper valley needs a smaller population", byD[0] > byD[1] + 0.1 && byD[1] > byD[2] + 0.1,
        "20 individuals: depth 0.02 → " + Math.round(100 * byD[0]) + "%, 0.05 → " + Math.round(100 * byD[1]) + "%, 0.10 → " + Math.round(100 * byD[2]) + "%");
  const hitC = (r, n, d, reps, seed) => { let k = 0; for (let q = 0; q < reps; q++) if (D_hits(D_share(D_runAll(n, d, mulberry32(seed + q * 7919))), r)) k++; return k / reps; };
  const aim = { middling: [20, 0.05], stuck: [120, 0.05], deep: [10, 0.10], depth20: [20, 0.05], depth10: [10, 0.17] };
  const own = D_ROUNDS.map((r, i) => { const [n, d] = aim[r.key]; return { k: r.key, n, d, v: hitC(r, n, d, 8, 12000 + i * 97) }; });
  check("D every round is hit at a setting built for it", own.every(q => q.v >= 0.5),
        own.map(q => q.k + " @N" + q.n + "/depth " + q.d + ": " + Math.round(100 * q.v) + "%").join("  ") + "  (8 runs of 50)");
  const open = D_ROUNDS.map((r, i) => ({ k: r.key, v: hitC(r, r.hold.N != null ? r.hold.N : 40, r.hold.d != null ? r.hold.d : 0.10, 8, 12500 + i * 97) }));
  check("D the opening setting is not an answer", open.every(q => q.v <= 0.125),
        "40 individuals, depth 0.10 (what a round holds, held): " + open.map(q => q.k + " " + Math.round(100 * q.v) + "%").join("  "));
  /* no one setting clears three: each round's answer carried to all five */
  let most = 0, mostAt = "";
  D_ROUNDS.forEach((src, i) => { const [n, d] = aim[src.key];
    const c = D_ROUNDS.filter((r, j) => hitC(r, r.hold.N != null ? r.hold.N : n, r.hold.d != null ? r.hold.d : d, 3, 13000 + i * 13 + j) >= 0.5).length;
    if (c > most) { most = c; mostAt = src.key; } });
  check("D no round's answer clears three rounds", most <= 2, "the greediest, " + mostAt + "'s, clears " + most + " of 5");
}


/* ---- E. the population's mean fitness ------------------------------------ */
{
  /* mean fitness is the individuals' own average, recomputed from the copies */
  let worst = 0;
  for (const [h, s, F] of [[2, 0.2, 0], [0, -0.3, 0.8], [-1, 0.3, 0.3]]) {
    const R = B_run(200, 0.4, h, s, F, mulberry32(25000), true, 40), w = [1, 1 + h * s, 1 + s];
    R.snaps.forEach((a, t) => { let tot = 0; for (let i = 0; i < 200; i++) tot += w[a[2 * i] + a[2 * i + 1]];
      worst = Math.max(worst, Math.abs(tot / 200 - R.W[t])); });
  }
  check("E mean fitness is the individuals' average", worst < 1e-12, "largest gap over 3 runs x 41 generations: " + worst.toExponential(1));
}
{
  /* the arithmetic printed beside it, with F: generations 20-100 of big runs */
  const rep = []; let ok = true;
  for (const [h, s, F] of [[2, 0.15, 0], [2, 0.15, 0.6], [0, -0.3, 0.8], [0.5, 0.2, 0.5]]) {
    const R = B_run(3000, 0.3, h, s, F, mulberry32(26000), false, 100); let m = 0;
    for (let t = 20; t <= 100; t++) m = Math.max(m, Math.abs(R.W[t] - E_wbar(R.P[t], h, s, F)));
    rep.push(h + "/" + s + "/F" + F + ": " + m.toFixed(4)); if (m > 0.012) ok = false;
  }
  check("E the printed arithmetic is the measured mean fitness", ok, "largest gap, generations 20-100, 3000 individuals: " + rep.join("  "));
}
const hitE = (r, n, h, s, F, reps, seed) => { let k = 0;
  const ss = r.hold && r.hold.s != null ? r.hold.s : s, FF = r.hold && r.hold.F != null ? r.hold.F : F;
  for (let q = 0; q < reps; q++) if (E_judge(r, B_run(n, r.p0, h, ss, FF, mulberry32(seed + q * 7919), false, E_G))) k++; return k / reps; };
const RE = {}; for (const r of E_ROUNDS) RE[r.key] = r;
const aimE = { climb: [400, 0.7, 0.2, 0], above: [400, 2, 0, 0], strand: [400, -1, 0, 0], drift: [40, 0.5, 0, 0.8], inbred: [400, 2, 0.3, 0] };
{
  const own = E_ROUNDS.map((r, i) => ({ k: r.key, a: aimE[r.key], v: hitE(r, ...aimE[r.key], 30, 27000 + i * 97) }));
  check("E every round is hit at a setting built for it", own.every(q => q.v >= 0.75),
        own.map(q => q.k + " @N" + q.a[0] + "/h" + q.a[1] + "/s" + q.a[2] + "/F" + q.a[3] + ": " + Math.round(100 * q.v) + "%").join("  ") + "  (30 runs)");
  const open = E_ROUNDS.map((r, i) => ({ k: r.key, v: hitE(r, 400, 0.5, 0, 0, 20, 28000 + i * 97) }));
  check("E the opening setting is not an answer", open.every(q => q.v <= 0.05),
        "400 individuals, h 0.5, s 0, F 0 (what a round holds, held): " + open.map(q => q.k + " " + Math.round(100 * q.v) + "%").join("  "));
}
{
  /* each round needs the thing it is about */
  const cases = [
    ["climb, recessive (h 0, s 0.3)", hitE(RE.climb, 400, 0, 0.3, 0, 20, 29000)],
    ["above, no heterozygote advantage (h 1)", hitE(RE.above, 400, 1, 0, 0, 20, 29100)],
    ["strand, drift instead (h 0, 20 individuals)", hitE(RE.strand, 20, 0, 0, 0, 30, 29200)],
    ["drift, selection clearing purple (s -0.3, 20)", hitE(RE.drift, 20, 0.5, -0.3, 0, 20, 29300)],
    ["inbred, recessive bad (h 0, s -0.3)", hitE(RE.inbred, 400, 0, -0.3, 0, 20, 29400)],
    ["inbred, no dominance (h 0.5, s 0.3)", hitE(RE.inbred, 400, 0.5, 0.3, 0, 20, 29500)]];
  check("E each round needs what it is about", cases.every(q => q[1] <= 0.1), cases.map(q => q[0] + " " + Math.round(100 * q[1]) + "%").join("  "));
}
{
  /* no one setting clears three: each round's answer carried to all five */
  let most = 0, mostAt = "";
  E_ROUNDS.forEach((src, i) => {
    const c = E_ROUNDS.filter((r, j) => hitE(r, ...aimE[src.key], 6, 30000 + i * 13 + j) >= 0.5).length;
    if (c > most) { most = c; mostAt = src.key; } });
  check("E no round's answer clears three rounds", most <= 2, "the greediest, " + mostAt + "'s, clears " + most + " of 5");
}

/* ---- every plot inside its panel --------------------------------------- */
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

/* ---- the practice switch, through the real buttons. Last: spends one
   scored attempt of each game. The runs animate on setInterval; a stand-in
   runs each out. */
{
  const realSI = window.setInterval, realCI = window.clearInterval;
  let loop = false, stop = false;
  window.setInterval = fn => { loop = true; stop = false; for (let k = 0; k < 20000 && !stop; k++) fn(); loop = false; return 0; };
  window.clearInterval = id => { if (loop) stop = true; else realCI(id); };
  const out = [], stages = { A, B, C, D, E };
  try {
    for (const [S, go] of [["A", "A_run"], ["B", "B_run"], ["C", "C_run"], ["D", "D_run"], ["E", "E_run"]]) {
      document.getElementById("stage" + S).classList.remove("stage-locked");
      const g = stages[S].game, box = document.getElementById(S + "_practice"), btn = document.getElementById(go);
      const tick = on => { box.checked = on; box.dispatchEvent(new Event("change")); };
      const n0 = g.st.hits.length;
      tick(true); btn.click();
      const pracOk = g.st.hits.length === n0 && g.st.last != null && /practice/.test(document.getElementById(S + "_tflip").textContent);
      tick(false); btn.click();
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
}

say(bad ? ("FAILED " + bad) : "ALL BARS PASS");
say("RAN " + ran);
L.join(" ;; ");
`;

const probe = `<!doctype html><meta charset="utf-8"><title>pending</title>
<iframe id="f" src="http://127.0.0.1:${PORT}/app/lessons/lesson12.html?preview=1" width="1500" height="1000"></iframe>
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

const probePath = path.join(ROOT, "_check_l12.html");
fs.writeFileSync(probePath, probe);
const server = spawn("python3", ["-m", "http.server", String(PORT), "--directory", ROOT],
                     { stdio: "ignore", detached: true });
const cleanup = () => { try { process.kill(-server.pid); } catch (e) {} try { fs.unlinkSync(probePath); } catch (e) {} };
process.on("exit", cleanup);

setTimeout(() => {
  const r = spawnSync(CHROME, ["--headless=new", "--disable-gpu", "--virtual-time-budget=900000",
                               "--dump-dom", `http://127.0.0.1:${PORT}/_check_l12.html`],
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
