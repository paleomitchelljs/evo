#!/usr/bin/env node
/*
 * check_lesson12_numbers.js -- the bar checks for app/lessons/lesson12.html.
 *
 * Lesson 12 is a draft (2026-09-24, restructured 2026-09-27 and twice on
 * 2026-09-28): Stage A (a meadow where a gene and its visitors make h and
 * s), Stage B (one locus, five rounds, one per kind of dominance, with
 * Price's covariance on the bars), Stage C (four alleles racing), Stage D
 * (new harmful mutations: which ones stay, average fitness, homozygosity)
 * and Stage E (a valley that only small populations cross). Fitness is JM's
 * classroom form throughout: 1, 1 - h s, 1 - s. None of its bars can be
 * seen by opening the page:
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
{
  /* A and D open on free play: no target dealt, every control free, until
     the student asks. Then Start the targets deals the first. */
  const before = [A, D].map(X => X.game.free() && X.game.current() == null);
  const labFree = ["A", "D"].map(K => document.getElementById(K + "_run").textContent);
  for (const K of ["A", "D"]) document.getElementById(K + "_tnext").click();
  const after = [A, D].map(X => !X.game.free() && X.game.current() != null);
  check("A and D open on free play, then deal on Start", before.every(Boolean) && after.every(Boolean),
        "free at load: A " + before[0] + ", D " + before[1] + "; a target after Start: A " + after[0] + ", D " + after[1]);
  /* JM, 2026-09-28: the button read "Practice run" on the first target with
     practice unticked, until something else repainted it */
  const labNow = ["A", "D"].map(K => document.getElementById(K + "_run").textContent);
  const unticked = ["A", "D"].every(K => !document.getElementById(K + "_practice").checked);
  check("A and D's button reads Go once the targets start", unticked && labFree.every(t => t === "Practice run") && labNow.every(t => t === "Go"),
        "free play: " + labFree.join(" / ") + "; first target, practice unticked: " + labNow.join(" / "));
}
{
  /* JM, 2026-09-28: one picture per stage -- the target is drawn on the plot
     the run plays on, and that plot is in the Predict card */
  const where = { A: "A_bars", B: "B_traj", C: "C_shares", D: "D_time", E: "E_time" }, rep = [];
  let ok = true;
  for (const [K, id] of Object.entries(where)) {
    const cv = document.getElementById(id), card = document.getElementById("pred" + K), n = document.querySelectorAll("#stage" + K + " canvas").length;
    const inCard = !!(cv && card && card.contains(cv)), old = !!document.getElementById(K + "_tpic");
    if (!inCard || old) ok = false;
    rep.push(K + " " + id + (inCard ? " in the card" : " NOT IN THE CARD") + (old ? ", A SECOND PICTURE" : "") + " (" + n + " canvases)");
  }
  check("every stage runs on its Predict picture, and has no second one", ok, rep.join("; "));
}
check("slots declared match slots written", Object.keys(BIT).length === 5, Object.keys(BIT).length + " named bits, scaffold is 5");

/* ---- A. the meadow -------------------------------------------------------
   Written here from the setup's sentences, not read off the page: a visitor
   takes a flower fully at or past its edge, a share rising over 0.2 before
   it, and a tenth of a full rate for any other colour; each visitor calls on
   a flower it takes fully 8 times a season; a visit is a seed. */
const lkH = (r, t) => 0.1 + 0.9 * Math.min(1, Math.max(0, (r - t + 0.2) / 0.2));
const lkB = (r, t) => 0.1 + 0.9 * Math.min(1, Math.max(0, (t - r + 0.2) / 0.2));
const aWant = (d, nH, tH, nB, tB) => [0, d, 1].map(r => 8 * (nH * lkH(r, tH) + nB * lkB(r, tB)));
/* against red, JM's form: red 1, pink 1 - h s, white 1 - s */
const aHS = w => ({ s: 1 - w[0] / w[2], h: (w[2] - w[1]) / (w[2] - w[0]) });
{
  const rep = []; let fails = 0;
  for (const st of [[0.5, 8, 0.3, 2, 0.3], [0.5, 7, 0.3, 3, 0.7], [0.3, 6, 0.8, 3, 0.3], [0.5, 5, 0, 5, 1]]) {
    const want = aWant(...st), page = A_expect(...st).w, v = [[], [], []];
    for (let q = 0; q < 120; q++) { const S = A_season(...st, mulberry32(20000 + q * 7919)); S.w.forEach((x, g) => v[g].push(x)); }
    const got = v.map(mn), se = v.map(a => sdv(a) / Math.sqrt(a.length));
    got.forEach((m, g) => { if (Math.abs(m - want[g]) > 3 * se[g] + 0.05 || Math.abs(page[g] - want[g]) > 1e-9) fails++; });
    rep.push(st.join("/") + ": " + got.map(x => x.toFixed(1)).join(" ") + " vs " + want.map(x => x.toFixed(1)).join(" "));
  }
  check("A a season's seeds are the visit rates", fails === 0, "d/nH/tH/nB/tB, seeds per flower white pink red, 120 seasons vs written here: " + rep.join("  "));
}
{
  /* the 2026-09-28 fix: a flower's seeds depend on its colour and the
     visitors only, so moving pink leaves red and white where they were, and
     s is the visitors' alone */
  let worst = 0; const rep = [];
  for (const e of [[8, 0.3, 2, 0.3], [7, 0.7, 3, 0.3], [6, 0.8, 3, 0.3], [8, 0.9, 0, 0.3]]) {
    const ss = [0, 0.3, 0.5, 0.8, 1].map(d => { const w = A_expect(d, ...e).w; return [w[0], w[2], aHS(w).s]; });
    for (const q of ss) worst = Math.max(worst, Math.abs(q[0] - ss[0][0]), Math.abs(q[1] - ss[0][1]), Math.abs(q[2] - ss[0][2]));
    rep.push(e.join("/") + ": s " + ss[0][2].toFixed(2));
  }
  check("A moving pink moves neither red nor white", worst < 1e-12, "largest change in white's or red's seeds, or s, as pink goes 0 to 1: " + worst.toExponential(1) + "  (" + rep.join("  ") + ")");
}
const hitA = (r, st, reps, seed) => { let k = 0;
  for (let q = 0; q < reps; q++) if (A_judge(r, A_season(...st, mulberry32(seed + q * 7919)).w)) k++; return k / reps; };
const withHold = (r, d, nH, tH, nB, tB) => r.hold.d != null ? [r.hold.d, nH, tH, nB, tB] : [d, r.hold.env.nH, r.hold.env.tH, r.hold.env.nB, r.hold.env.tB];
{
  const aim = { asred: [0.5, 8, 0.3, 2, 0.3], best: [0.5, 7, 0.3, 3, 0.7], worst: [0.5, 7, 0.7, 3, 0.3], halfway: [0.8, 0, 0, 0, 0], mostly: [0.35, 0, 0, 0, 0] };
  const own = A_ROUNDS.map((r, i) => { const st = withHold(r, ...aim[r.key]); return { k: r.key, st, v: hitA(r, st, 40, 21000 + i * 97) }; });
  check("A every round is hit at a setting built for it", own.every(q => q.v >= 0.8),
        own.map(q => q.k + " @" + q.st.join("/") + ": " + Math.round(100 * q.v) + "%").join("  ") + "  (40 seasons)");
  const open = A_ROUNDS.map((r, i) => { const st = withHold(r, 0.5, 5, 0, 5, 1); return { k: r.key, v: hitA(r, st, 30, 22000 + i * 97) }; });
  check("A the opening setting is not an answer", open.every(q => q.v === 0),
        "pink 0.5, 5 hummingbirds from 0, 5 bees to 1 (what a round holds, held): " + open.map(q => q.k + " " + Math.round(100 * q.v) + "%").join("  "));
}
{
  /* the point of the stage: h moves with the visitors when the gene is
     held, and with the gene when the visitors are held; and in the gene
     rounds, pink halfway in colour is not halfway in seeds */
  const byEnv = [[8, 0.3, 2, 0.3], [7, 0.3, 3, 0.7], [7, 0.7, 3, 0.3]].map(e => aHS(aWant(0.5, ...e)).h);
  const e = A_ENV, byGene = [0.5, 0.8, 1].map(d => aHS(aWant(d, e.nH, e.tH, e.nB, e.tB)).h);
  const e2 = A_ENV2, at35 = aHS(aWant(0.35, e2.nH, e2.tH, e2.nB, e2.tB)).h;
  const spread = a => Math.max(...a) - Math.min(...a);
  check("A h moves with the visitors, and with the gene", spread(byEnv) >= 2 && spread(byGene) >= 0.9 && Math.abs(byGene[0] - 1) < 1e-9 && Math.abs(byGene[1] - 0.5) < 1e-9,
        "pink 0.5, three sets of visitors: h " + byEnv.map(f2).join(", ") + "; the halfway round's visitors, pink 0.5 / 0.8 / 1: h " + byGene.map(f2).join(", ") +
        "; the three-quarter round's, pink 0.35: h " + f2(at35));
}
{
  /* one setting across the five, on the arithmetic: every d, every count,
     edges in tenths; the greediest then played for real. And how often a
     setting drawn at random clears each round. */
  let most = 0, at = null, n = 0; const cnt = A_ROUNDS.map(() => 0);
  for (let d = 0; d <= 1.0001; d += 0.05) for (let nH = 0; nH <= 10; nH++) for (let nB = 0; nB <= 10; nB++)
    for (let tH = 0; tH <= 1.0001; tH += 0.1) for (let tB = 0; tB <= 1.0001; tB += 0.1) {
      n++;
      const hits = A_ROUNDS.map(r => A_judge(r, A_expect(...withHold(r, d, nH, tH, nB, tB)).w));
      hits.forEach((h, k) => { if (h) cnt[k]++; });
      const c = hits.filter(Boolean).length;
      if (c > most) { most = c; at = [+d.toFixed(2), nH, +tH.toFixed(1), nB, +tB.toFixed(1)]; }
    }
  /* 40 seasons, not 10: the greediest setting is one hummingbird from 0.1,
     whose seasons are the noisiest there are. At 10 seasons it cleared three
     on 7 of 300 page layouts (asred 37% and best 24% a season, lucking past
     half); at 40, none of 150. (2026-09-28) */
  const real = A_ROUNDS.filter((r, i) => hitA(r, withHold(r, ...at), 40, 23000 + i * 97) >= 0.5).length;
  const share = cnt.map(c => c / n);
  check("A no one setting clears three rounds, and a random one rarely any", most <= 2 && real <= 2 && share.every(v => v <= 0.12),
        n + " settings on the arithmetic: the greediest (" + at.join("/") + ") clears " + most + "; played for real, " + real +
        "; a random setting clears " + A_ROUNDS.map((r, k) => r.key + " " + (100 * share[k]).toFixed(1) + "%").join(", "));
}
{
  /* the bars' readout is the season's own arithmetic */
  const keep = A.season, S = A_season(0.5, 7, 0.3, 3, 0.7, mulberry32(24000));
  A.season = S; A_drawBars();
  const t = document.getElementById("A_read").textContent, q = A_hs(S.w);
  const ms = /s = 1 . white . red =\\s*(-?[0-9.]+)/.exec(t), mh = /h = \\(red . pink\\) . \\(red . white\\) =\\s*(-?[0-9.]+)/.exec(t);
  A.season = keep; A_paint();
  check("A the printed s and h are the season's", !!(ms && mh) && ms[1] === f2(q.s) && mh[1] === f2(q.h),
        "printed s " + (ms ? ms[1] : "?") + ", h " + (mh ? mh[1] : "?") + "; from its seeds " + f2(q.s) + ", " + f2(q.h));
}


/* ---- B. the model, re-derived --------------------------------------------
   Fitness (1, 1 - h s, 1 - s); parents drawn in proportion; with chance
   2F/(1+F) one individual is both parents. The genotype recursion below is
   written here from that sentence, not read off the page. */
const G = B_G;
function det(p0, h, s, F, gens) {
  const sf = 2 * F / (1 + F), w = [1, 1 - h * s, 1 - s];
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
  const aims = { hide: [-0.2, 0.3, 0], sweep: [1, -0.25, 0], hold: [2, -0.15, 0], split: [-1, -0.3, 0], rescue: [0, -0.2, 0.5] };
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
  const f0 = hit(R.rescue, 400, 0, -0.2, 0, 60, 5000), f5 = hit(R.rescue, 400, 0, -0.2, 0.5, 30, 5100), f75 = hit(R.rescue, 400, 0, -0.2, 0.75, 30, 5200);
  check("B in the rescue round, inbreeding is the lever", f0 <= 0.1 && f5 >= 0.65 && f75 >= f5 - 0.1,
        "recessive, s -0.2: F 0 " + Math.round(100 * f0) + "%, F 0.5 " + Math.round(100 * f5) + "%, F 0.75 " + Math.round(100 * f75) + "%");
}
{
  /* the tipping point the split round is built on: h/(2h-1), 0.33 at h = -1 */
  const lo = mn(Array.from({ length: 30 }, (_, i) => B_run(400, 0.28, -1, -0.3, 0, mulberry32(6000 + i * 7919), false).P[G]));
  const hi = mn(Array.from({ length: 30 }, (_, i) => B_run(400, 0.39, -1, -0.3, 0, mulberry32(6100 + i * 7919), false).P[G]));
  check("B the split round's tipping point is at h/(2h-1)", lo < 0.1 && hi > 0.9,
        "h -1, s -0.3 (tipping point " + (-1 / (2 * -1 - 1)).toFixed(3) + "): from 0.28 purple ends at " + lo.toFixed(2) + " on average, from 0.39 at " + hi.toFixed(2));
}
{
  /* the readout's fitnesses are the sliders' arithmetic */
  const keep = { h: B.h, s: B.s }, rep = []; let ok = true;
  for (const [h, s] of [[0, 0.3], [2, -0.2], [-1, 0.15]]) {
    B.h = h; B.s = s; B_drawFit();
    const t = document.getElementById("B_fitRead").textContent, m = /yellow · heterozygote · purple\\s+([0-9.]+) · ([0-9.]+) · ([0-9.]+)/.exec(t);
    const want = [1, 1 - h * s, 1 - s].map(v => v.toFixed(2)), got = m ? [m[1], m[2], m[3]] : [];
    rep.push(h + "/" + s + ": " + got.join(" "));
    if (got.join() !== want.join()) ok = false;
  }
  B.h = keep.h; B.s = keep.s; B_syncSliders(); B_paint();
  check("B the printed fitnesses are 1, 1 - hs, 1 - s", ok, rep.join("  "));
}

{
  /* Price's covariance on B's bars: slope, covariance and the change it
     predicts, recomputed here from the population's own copies */
  const keep = { runs: B.runs, showTo: B.showTo, h: B.h, s: B.s };
  B.h = 0; B.s = -0.2; B.runs = [B_run(400, 0.3, 0, -0.2, 0, mulberry32(31000), true, 40)]; B.showTo = 12; B_drawFit();
  const pop = B.runs[0].snaps[12], w = [1, 1, 1.2]; let sx = 0, sw = 0, sxx = 0, sxw = 0;
  for (let i = 0; i < 400; i++) { const x = pop[2 * i] + pop[2 * i + 1]; sx += x; sw += w[x]; sxx += x * x; sxw += x * w[x]; }
  const xb = sx / 400, wb = sw / 400, cov = sxw / 400 - xb * wb, vx = sxx / 400 - xb * xb, dp = cov / wb / 2;
  const t = document.getElementById("B_fitRead").textContent.replace(/\u2212/g, "-");
  const mc = /= covariance\\s+(-?[0-9.]+)/.exec(t), mp = /purple should move\\s+([-+][0-9.]+)/.exec(t), msl = /slope\\s+(-?[0-9.]+)/.exec(t);
  Object.assign(B, keep); B_syncSliders(); B_paint();
  check("B the line's slope and covariance are the population's", !!(mc && mp && msl) && Math.abs(+mc[1] - cov) < 6e-5 && Math.abs(+mp[1] - dp) < 6e-5 && Math.abs(+msl[1] - cov / vx) < 6e-4,
        "generation 12, recessive s -0.2: printed slope " + (msl ? msl[1] : "?") + ", covariance " + (mc ? mc[1] : "?") + ", purple should move " + (mp ? mp[1] : "?") +
        "; from its copies " + (cov / vx).toFixed(3) + ", " + cov.toFixed(4) + ", " + dp.toFixed(4));
}
{
  /* and it is the change: over 400 populations, purple's average one-
     generation change against the average covariance / (2 w-bar) read off
     each one's parents -- inbred or not, since Price's term does not care
     how the parents pair */
  const rep = []; let fails = 0;
  for (const [p0, h, s, F] of [[0.1, 0, -0.3, 0], [0.1, 0, -0.3, 0.6], [0.5, 2, -0.2, 0], [0.3, 1, 0.2, 0.4]]) {
    const act = [], pred = [];
    for (let r = 0; r < 400; r++) { const R = B_run(400, p0, h, s, F, mulberry32(32000 + r * 7919), true, 1); act.push(R.P[1] - R.P[0]); pred.push(B_cov(R.snaps[0], h, s).dp); }
    const d = act.map((v, k) => v - pred[k]), m = mn(d), se = sdv(d) / Math.sqrt(d.length);
    rep.push("p " + p0 + " h " + h + " s " + s + " F " + F + ": moved " + mn(act).toFixed(4) + ", covariance said " + mn(pred).toFixed(4));
    if (Math.abs(m) > 3 * se + 0.0005) fails++;
  }
  check("B the covariance is purple's expected change", fails === 0, rep.join("  "));
}

/* ---- C. four alleles race ---------------------------------------------- */
{
  /* the grid is JM's rule in his classroom form: 1 - s_i on the diagonal,
     1 - h_i s_i - h_j s_j off it */
  const h = [1, 0, 2, -1], sv = [0.1, 0.2, -0.1, 0.05], Wm = C_W(h, sv); let ok = true;
  for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) {
    const want = i === j ? 1 - sv[i] : 1 - h[i] * sv[i] - h[j] * sv[j];
    if (Math.abs(Wm[i][j] - Math.max(0.05, want)) > 1e-12) ok = false; }
  check("C the fitness grid is 1 - s on the diagonal, 1 - h s - h s off it", ok,
        "blue/orange " + Wm[0][1].toFixed(3) + " (1 - 1·0.1 - 0·0.2), green/yellow " + Wm[2][3].toFixed(3) + " (1 - 2·(-0.1) - (-1)·0.05)");
}
{
  /* one generation of the race against the four-allele recursion, from a
     quarter each: p_i' = p_i Σ_j p_j w_ij / w̄. 300 runs, 3 SE */
  const rep = []; let fails = 0;
  for (const [h, sv] of [[[1, 0, 0.5, 0.5], [-0.2, -0.2, 0, 0]], [[-1, -1, -1, -1], [0.1, 0.1, 0.1, 0.1]], [[0.5, 0, 1, 0.5], [-0.3, 0.2, -0.1, 0]]]) {
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
  check("C the opening setting is not an answer", open.every(q => q.v <= 0.1),
        "every s 0 (what a round holds, held), 100 individuals: " + open.map(q => q.k + " " + Math.round(100 * q.v) + "%").join("  "));
  const R = {}; for (const r of C_ROUNDS) R[r.key] = r;
  const noDom = [
    ["dominance, both without dominance", hitB(R.dominance, 60, [0.5, 0.5, 0.5, 0.5], R.dominance.s, 0, 10, 9100)],
    ["all, the same s without dominance", hitB(R.all, 100, [0.5, 0.5, 0.5, 0.5], R.all.s, 0, 10, 9200)]];
  check("C dominance is what the dominance rounds are about", noDom.every(q => q[1] <= 0.2),
        noDom.map(q => q[0] + " " + Math.round(100 * q[1]) + "%").join("  "));
  /* JM: "if you maximize no extinction, you get the last target incorrect".
     The first three sit at a wall and are one-sided: pushing hardest clears them. */
  const most = [
    ["one, blue s -0.3 at 200", hitB(R.one, 200, [0.5, 0.5, 0.5, 0.5], [-0.3, 0, 0, 0], 0, 5, 9250)],
    ["all, every h -1 and s 0.3 at 200", hitB(R.all, 200, [-1, -1, -1, -1], [0.3, 0.3, 0.3, 0.3], 0, 5, 9260)],
    ["two, green and yellow s 0.3 at 20", hitB(R.two, 20, [0.5, 0.5, 0.5, 0.5], [0, 0, 0.3, 0.3], 0, 5, 9270)]];
  check("C pushing hardest clears the rounds at a wall", most.every(q => q[1] >= 0.8), most.map(q => q[0] + " " + Math.round(100 * q[1]) + "%").join("  "));
  const big = hitB(R.drift, 100, R.drift.h, R.drift.s, 0, 5, 9300), small = hitB(R.drift, 10, R.drift.h, R.drift.s, 0, 10, 9400);
  const inbred = hitB(R.drift, 20, R.drift.h, R.drift.s, 0.9, 10, 9500);
  check("C an advantageous allele lost to drift: small populations do it", big === 0 && small >= 0.7,
        "blue s -0.1 held: 100 individuals " + Math.round(100 * big) + "%, 10 individuals " + Math.round(100 * small) +
        "% (blue wins " + Math.round(100 * R.drift.tg.share[0]) + "% of the target's populations); 20 individuals at F 0.9 " + Math.round(100 * inbred) + "%");
  /* no one setting clears three: every round's own setting, carried to all five */
  let most3 = 0, mostAt = "";
  C_ROUNDS.forEach((src, i) => {
    const c = C_ROUNDS.filter((r, j) => { const hd = r.hold || {};
      return hitB(r, hd.N ? r.N : src.N, hd.hs ? r.h : src.h, (hd.hs || hd.s) ? r.s : src.s, src.F, 3, 9600 + i * 13 + j) >= 0.5; }).length;
    if (c > most3) { most3 = c; mostAt = src.key; } });
  check("C no round's setting clears three rounds", most3 <= 2, "the greediest, " + mostAt + "'s setting, clears " + most3 + " of 5");
}

/* ---- D. new mutations: which ones stay ----------------------------------- */
{
  /* arrivals are the curves the controls set: h a bell curve cut to [-1, 2];
     s a gamma with the set average and spread, in (0, 1] */
  const rep = []; let ok = true;
  for (const set of [{ hm: 0.5, hsd: 0.2, sm: 0.1, ssd: 0.05 }, { hm: 0.3, hsd: 0.1, sm: 0.3, ssd: 0.1 }, { hm: -0.4, hsd: 0.3, sm: 0.05, ssd: 0.05 }, { hm: 1.5, hsd: 0, sm: 0.2, ssd: 0 }]) {
    const rng = mulberry32(40000), H = [], S2 = [];
    for (let k = 0; k < 20000; k++) { const d = D_draw(set, rng); H.push(d.h); S2.push(d.s); if (d.s <= 0 || d.s > 1 || d.h < -1 || d.h > 2) ok = false; }
    const [mh, sh, ma, sa] = [mn(H), sdv(H), mn(S2), sdv(S2)];
    /* the bell curve cut to [-1, 2], its mean and spread by integration */
    let eh = set.hm, esd = 0;
    if (set.hsd > 0) { let z = 0, m1 = 0, m2 = 0; for (let k = 0; k <= 30000; k++) { const x = -1 + 3 * k / 30000, d = Math.exp(-0.5 * ((x - set.hm) / set.hsd) ** 2); z += d; m1 += d * x; m2 += d * x * x; }
      eh = m1 / z; esd = Math.sqrt(m2 / z - eh * eh); }
    if (Math.abs(mh - eh) > 0.01 || Math.abs(sh - esd) > 0.01 || Math.abs(ma - set.sm) > 0.01 * Math.max(1, set.sm * 10) || Math.abs(sa - set.ssd) > 0.01 * Math.max(1, set.ssd * 10)) ok = false;
    rep.push("h " + set.hm + "±" + set.hsd + " (cut: " + eh.toFixed(3) + "±" + esd.toFixed(3) + ") s " + set.sm + "±" + set.ssd + ": drawn " + mh.toFixed(3) + "±" + sh.toFixed(3) + ", " + ma.toFixed(3) + "±" + sa.toFixed(3));
  }
  check("D new mutations come from the curves the controls set", ok, "20000 draws each: " + rep.join("  "));
}
{
  /* fitness multiplies over loci, 1 - h s for one copy and 1 - s for two:
     one individual built by hand */
  const run = D_start(1, { hm: 0, hsd: 0, sm: 0.1, ssd: 0 }, mulberry32(1));
  run.H = [0.5, 0, 2, -1]; run.S = [0.2, 0.5, 0.1, 0.3];
  const w = Math.exp(D_logw(run, Int32Array.from([0, 1, 3]), Int32Array.from([1, 2]))), want = 0.9 * 0.5 * 0.8 * 1.3;
  check("D fitness is 1 - h s for one copy, 1 - s for two, multiplied", Math.abs(w - want) < 1e-12,
        "one copy each of h 0.5 / 2 / -1 (s 0.2 / 0.1 / 0.3) and two of s 0.5: " + w.toFixed(6) + " vs 0.9 × 0.5 × 0.8 × 1.3 = " + want.toFixed(6));
}
/* fitness and homozygosity written here from the setup's sentences */
const dCount = (a, b) => { const c = new Map(); for (const m of a) c.set(m, (c.get(m) || 0) + 1); for (const m of b) c.set(m, (c.get(m) || 0) + 1); return c; };
const dFit = (run, a, b) => { let f = 1; for (const [m, k] of dCount(a, b)) f *= k === 2 ? 1 - run.S[m] : 1 - run.H[m] * run.S[m]; return Math.max(0, f); };
const dHom = (a, b) => { let t = 0; for (const [, k] of dCount(a, b)) if (k === 2) t++; return t; };
{
  /* average fitness is against an individual carrying none, the fixed load
     in, and homozygosity counts the fixed loci too: both recomputed from a
     small population that drift has fixed alleles in */
  const R = D_runAll(20, { hm: 0.5, hsd: 0.1, sm: 0.05, ssd: 0.03 }, mulberry32(43000));
  let fl = 1; for (const a of R.fixed) fl *= 1 - a.s;
  const w = mn(R.pop.map(([a, b]) => dFit(R, a, b))) * fl, page = R.Wbar[400];
  const ho = mn(R.pop.map(([a, b]) => dHom(a, b))) + R.fixed.length, pageHo = R.Ho[400];
  check("D average fitness and homozygosity are the individuals', fixed alleles in", R.fixed.length > 0 && Math.abs(w / page - 1) < 1e-9 && Math.abs(ho - pageHo) < 1e-9,
        "20 individuals, " + R.fixed.length + " fixed: average fitness recomputed " + w.toFixed(4) + ", the page's " + page.toFixed(4) +
        "; homozygosity recomputed " + ho.toFixed(3) + ", the page's " + pageHo.toFixed(3));
}
{
  /* 202_lec14_01's magic trick, measured: average fitness at the end barely
     moves with h (0.3 and up) or s; heterozygote advantage lifts it past 1 */
  const v = [[0.3, 0.1], [0.3, 0.3], [1, 0.15], [2, 0.15]].map(([hm, sm], k) => ({ hm, sm,
    w: D_runAll(300, { hm, hsd: 0.1, sm, ssd: sm / 3 }, mulberry32(45000 + k * 97)).Wbar[400] }));
  const od = D_runAll(300, { hm: -0.3, hsd: 0.1, sm: 0.15, ssd: 0.05 }, mulberry32(45900)).Wbar[400];
  const ws = v.map(q => q.w);
  check("D average fitness hardly moves with h or s, until the heterozygote wins", Math.max(...ws) - Math.min(...ws) <= 0.08 && ws.every(x => x > 0.66 && x < 0.84) && od > 1,
        "300 individuals: " + v.map(q => "h " + q.hm + " s " + q.sm + " → " + q.w.toFixed(3)).join(", ") + "; h -0.3 → " + od.toFixed(1));
}
{
  /* the printed w-bar and homozygosity are the run's */
  const keep = D.run, R = D_runAll(60, { hm: 0.3, hsd: 0.1, sm: 0.1, ssd: 0.05 }, mulberry32(44000));
  D.run = R; D_drawTime();
  const t = document.getElementById("D_read").textContent, mw = /\\(w̄\\)\\s+([0-9.]+)/.exec(t), mh = /homozygosity\\s+([0-9.]+)/.exec(t);
  D.run = keep; D_paint();
  const hoTxt = R.Ho[400] >= 10 ? R.Ho[400].toFixed(1) : f2(R.Ho[400]);
  check("D the printed average fitness and homozygosity are the run's", !!(mw && mh) && mw[1] === f2(R.Wbar[400]) && mh[1] === hoTxt,
        "printed " + (mw ? mw[1] : "?") + " and " + (mh ? mh[1] : "?") + "; the run's " + f2(R.Wbar[400]) + " and " + hoTxt);
}
/* a round's one number, run only as far as the round reads */
const dSet = (r, lev) => ({ n: r.hold.n != null ? r.hold.n : lev.n, hm: r.hold.hm != null ? r.hold.hm : lev.hm, hsd: r.hold.hsd, sm: r.hold.sm, ssd: r.hold.ssd });
const dVal = (r, st, seed) => { const run = D_start(st.n, st, mulberry32(seed));
  if (r.at < D_G) { D_step(run, r.at + 1); return D_value(run, r); }
  while (run.gen < D_G) D_step(run, 50); D_finish(run); return D_value(run, r); };
const hitDr = (r, lev, reps, seed) => { let k = 0; const st = dSet(r, lev);
  for (let q = 0; q < reps; q++) if (D_judge(r, dVal(r, st, seed + q * 7919))) k++; return k / reps; };
{
  const Rd = {}; for (const r of D_ROUNDS) Rd[r.key] = r;
  const aim = { homozygous: { n: 15 }, clean: { n: 1000 }, above: { hm: -0.1 }, fast: { hm: 2 }, middle: { n: 40 } };
  const own = D_ROUNDS.map((r, i) => ({ k: r.key, a: aim[r.key], v: hitDr(r, aim[r.key], r.key === "middle" ? 10 : 4, 46000 + i * 97) }));
  check("D every round is hit at a setting built for it", own.every(q => q.v >= 0.7),
        own.map(q => q.k + " @" + JSON.stringify(q.a).replace(/[{}"]/g, "") + ": " + Math.round(100 * q.v) + "%").join("  ") + "  (4 runs; middle 10)");
  const open = D_ROUNDS.map((r, i) => ({ k: r.key, v: hitDr(r, { n: 100, hm: 0.5 }, 3, 47000 + i * 97) }));
  check("D the opening setting is not an answer", open.every(q => q.v === 0),
        "100 individuals, h 0.5 (what a round holds, held): " + open.map(q => q.k + " " + Math.round(100 * q.v) + "%").join("  "));
  const need = [
    ["above with h 0 (no heterozygote advantage on average)", hitDr(Rd.above, { hm: 0 }, 3, 48000)],
    ["fast with h 1 (dominant, not beyond)", hitDr(Rd.fast, { hm: 1 }, 6, 48100)],
    ["homozygous at 60 individuals", hitDr(Rd.homozygous, { n: 60 }, 3, 48200)],
    ["clean at 100 individuals", hitDr(Rd.clean, { n: 100 }, 3, 48300)],
    ["middle at 100 individuals", hitDr(Rd.middle, { n: 100 }, 3, 48400)],
    ["middle at 15 individuals", hitDr(Rd.middle, { n: 15 }, 3, 48500)]];
  check("D each round needs what it is about (above: h below 0; fast: h above 1)", need.every(q => q[1] <= (q[0].startsWith("fast") ? 0.2 : 0)),
        need.map(q => q[0] + " " + Math.round(100 * q[1]) + "%").join("  "));
}
{
  /* no one setting clears three. A round holds all but one lever, so a
     setting's h rounds depend on its h alone and its size rounds on its size
     alone: the most any one setting clears is the best h plus the best size.
     A round counts as cleared at a hit rate of 0.6 or better: homozygosity
     is heavy-tailed, and at the sizes between two rounds a setting clears
     each some of the time (30 individuals: at least 20 about 1 in 10, 6 to 16
     about 3 in 4), which is not the same as clearing both. */
  const hR = D_ROUNDS.filter(r => r.hold.n != null), nR = D_ROUNDS.filter(r => r.hold.hm != null);
  let bh = 0, bhAt = null, bn = 0, bnAt = null;
  [-0.3, -0.1, 0, 0.1, 0.5, 1, 1.5, 2].forEach((hm, i) => {
    const c = hR.filter((r, j) => hitDr(r, { hm }, 2, 49000 + i * 13 + j) >= 0.5).length; if (c > bh) { bh = c; bhAt = hm; } });
  [15, 20, 25, 30, 35, 40, 50, 60, 100, 300, 500, 1000].forEach((n, i) => {
    const c = nR.filter((r, j) => hitDr(r, { n }, n <= 60 ? 16 : 4, 49500 + i * 13 + j) >= 0.6).length; if (c > bn) { bn = c; bnAt = n; } });
  check("D no one setting clears three rounds", bh + bn <= 2,
        "the greediest h (" + bhAt + ") clears " + bh + " of the h rounds, the greediest size (" + bnAt + ") " + bn + " of the size rounds");
}

/* ---- E. the valley ------------------------------------------------------ */
{
  const w = E_W(0.07);
  check("E the landscape is 1, three valley steps at 1 - depth, 1.2", w.join() === [1, 0.93, 0.93, 0.93, 1.2].map(v => +v.toFixed(2)).join() || w.map(v => v.toFixed(2)).join() === "1.00,0.93,0.93,0.93,1.20",
        "at depth 0.07: " + w.map(v => v.toFixed(2)).join(", "));
  const shareAt = (n, d, reps, seed) => { const v = []; for (let q = 0; q < reps; q++) v.push(E_share(E_runAll(n, d, mulberry32(seed + q * 7919)))); return mn(v); };
  /* Wright's point, measured here: at one depth, small populations cross
     and big ones stay on the low peak */
  const byN = [10, 20, 40, 120].map((n, i) => shareAt(n, 0.05, 3, 11000 + i * 97));
  check("E small populations cross the valley, big ones stay put", byN[0] > byN[2] + 0.2 && byN[3] <= 0.05,
        "depth 0.05, share of 50 on the high peak by generation 1500, averaged over 3 runs: 10 → " + byN.map(v => Math.round(100 * v) + "%").join(", 20 → ").replace(/, 20 → ([^,]+), 20 → ([^,]+), 20 → /, ", 20 → $1, 40 → $2, 120 → "));
  const byD = [0.02, 0.05, 0.10].map((d, i) => shareAt(20, d, 3, 11500 + i * 97));
  check("E a deeper valley needs a smaller population", byD[0] > byD[1] + 0.1 && byD[1] > byD[2] + 0.1,
        "20 individuals: depth 0.02 → " + Math.round(100 * byD[0]) + "%, 0.05 → " + Math.round(100 * byD[1]) + "%, 0.10 → " + Math.round(100 * byD[2]) + "%");
  const hitC = (r, n, d, reps, seed) => { let k = 0; for (let q = 0; q < reps; q++) if (E_hits(E_share(E_runAll(n, d, mulberry32(seed + q * 7919))), r)) k++; return k / reps; };
  const aim = { middling: [20, 0.05], stuck: [120, 0.05], deep: [10, 0.10], depth20: [20, 0.05], depth10: [10, 0.17] };
  const own = E_ROUNDS.map((r, i) => { const [n, d] = aim[r.key]; return { k: r.key, n, d, v: hitC(r, n, d, 8, 12000 + i * 97) }; });
  check("E every round is hit at a setting built for it", own.every(q => q.v >= 0.5),
        own.map(q => q.k + " @N" + q.n + "/depth " + q.d + ": " + Math.round(100 * q.v) + "%").join("  ") + "  (8 runs of 50)");
  const open = E_ROUNDS.map((r, i) => ({ k: r.key, v: hitC(r, r.hold.N != null ? r.hold.N : 40, r.hold.d != null ? r.hold.d : 0.10, 8, 12500 + i * 97) }));
  check("E the opening setting is not an answer", open.every(q => q.v <= 0.125),
        "40 individuals, depth 0.10 (what a round holds, held): " + open.map(q => q.k + " " + Math.round(100 * q.v) + "%").join("  "));
  /* no one setting clears three: each round's answer carried to all five */
  let most = 0, mostAt = "";
  E_ROUNDS.forEach((src, i) => { const [n, d] = aim[src.key];
    const c = E_ROUNDS.filter((r, j) => hitC(r, r.hold.N != null ? r.hold.N : n, r.hold.d != null ? r.hold.d : d, 3, 13000 + i * 13 + j) >= 0.5).length;
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
      const n0 = g.st.hits.length, sea0 = A.seasons.length;
      tick(true); btn.click();
      const pracOk = g.st.hits.length === n0 && g.st.last != null && /practice/.test(document.getElementById(S + "_tflip").textContent);
      tick(false); btn.click();
      const scored = g.st.hits.length === n0 + 1 && g.waiting(), blocked = btn.disabled;
      tick(true); btn.click();
      const stillPrac = !btn.disabled && g.st.hits.length === n0 + 1 && g.waiting();
      tick(false);
      /* A keeps every season on its seasons plot; D finishes each run */
      const extra = S === "A" ? A.seasons.length === sea0 + 3 : S === "D" ? !!(D.run && D.run.gen === 400 && isFinite(D.run.Wbar[400]) && isFinite(D.run.Ho[400])) : true;
      out.push({ ok: pracOk && scored && blocked && stillPrac && extra,
                 t: S + ": practice " + (pracOk ? "unscored" : "SCORED") + ", ticked off " + (scored ? "scored" : "NOT scored") +
                    ", waiting " + (blocked ? "Go off" : "GO ON") + (stillPrac ? " but practice runs" : ", practice BLOCKED") +
                    (S === "A" ? (extra ? ", 3 seasons plotted" : ", SEASONS NOT PLOTTED") : S === "D" ? (extra ? ", runs to 400" : ", RUN UNFINISHED") : "") });
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
