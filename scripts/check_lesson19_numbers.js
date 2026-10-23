#!/usr/bin/env node
/*
 * check_lesson19_numbers.js -- the checks for app/lessons/lesson19.html.
 *
 * Lesson 19, pass 5 (2026-10-22, JM's second review): speciation as a
 * process. A pulsed migration (floods) and F_ST across the genome, every
 * target a window on F_ST over the whole genome; B
 * sticklebacks, two food genes placed on the chromosome; C new mutations
 * that make incompatibilities; D mate choice on a throat colour. What has to
 * hold:
 *
 *   Engine. A starts grey, and with no floods each pond carries only grey
 *      and its own colour, every fish surviving (nothing selects in A);
 *      mutation runs at mu a locus; floods come only every T generations,
 *      about N m fish each, and A's at 1, 1 + T, ... so that 400 is the
 *      generation before a flood; F_ST is 1 for two ponds with nothing in common
 *      and 0 for two the same; B's chance to survive follows the diet and
 *      the food in each pond, by hand; C's hybrid incompatible pairs agree
 *      with a count by hand and each lowers survival by its cost; D's
 *      choice gives a rare throat colour fewer births and mixes few throats
 *      when choosy, as many as chance when not; the valley sets the hybrid;
 *      D's inversion stops crossing over inside it in a fish with one
 *      inverted chromosome; the correlation is 1 for a matched start; the
 *      table's fitness is its survival times its births, re-derived here.
 *   Targets. Each round's intended settings hit it and its opening (and the
 *      near misses measured in the page's comments) miss it. B's picture of
 *      each round, judged by that round's own rules, is a hit.
 *   Flow. A miss records 0 and the target stays; hits open Next target;
 *      each stage opens the next; the last ends the lesson; every bit
 *      written.
 *   Controls. B's two genes and D's throat gene move by dragging along the
 *      chromosome; D's ◐ moves by dragging on the fitness surface; D's
 *      toggles write their inputs and are held when a round holds them; C's
 *      cost arrow is red (it lowers survival).
 *   Layout. A's and B's Target cards have no words, only their picture
 *   (A's genome graph, B's sketch) over the controls; no card says anything
 *   once its stage is done; the practice box reads "practice"; C's and D's
 *   fitness surfaces in the left column; each stage ends in its R code, closed; no readout lines; every
 *   hover mark has words; the hybrid box closed at load; every canvas fits
 *   its panel (1500 and 1000 wide); the four R panels run (Rscript,
 *   shortened).
 *
 * Same harness as check_lesson17_numbers.js. The page seeds itself afresh on
 * every load, so each run of this check draws new runs.
 *
 * Usage:  node scripts/check_lesson19_numbers.js      (~3 minutes)
 * Exit 0 iff every check passes. Needs Google Chrome and python3; Rscript
 * for the R panels (skipped, and said so, without it).
 */
const { spawn, spawnSync } = require("child_process");
const fs = require("fs"), path = require("path");

const ROOT = path.resolve(__dirname, "..");
const PORT = +process.env.PORT || 8799;
const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

const CANVAS_IDS = ["A_board", "A_genes", "A_time", "B_board", "B_genes", "B_time", "B_surf", "B_tpic", "C_board", "C_time", "C_dmi", "C_grid", "D_board", "D_genes", "D_time", "D_fit", "D_got"];
const INNER = `
const L_=[], say=s=>L_.push(s);
let bad=0, ran=0;
const check=(name, ok, detail)=>{ ran++; if(!ok) bad++; say((ok?"ok   ":"FAIL ")+name+(detail?"  -- "+detail:"")); };
for (const s of ["A","B","C","D"]) document.getElementById("stage"+s).classList.remove("stage-locked");
for (const k in Gates) Gates[k].open = true;
const el = (S, k) => document.getElementById(S.K + "_" + k);
const setC = (S, o) => { for (const k in o) { const c = S.cfg.ctl.find(c => c.key === k), e = el(S, k), i = c.vals.indexOf(o[k]); if (i < 0) throw new Error(S.K + ": no " + k + " = " + o[k]); e.value = i + (+e.min || 0); } syncVals(S); };
/* a setting played n times as practice from round r's holds: the summaries at the end */
const play = (S, r, o, n) => { S.round = r; S.waiting = false; S.done = false; el(S, "practice").checked = true; openRound(S); setC(S, o);
  const out = []; for (let k = 0; k < (n || 1); k++) { goStage(S); finishNow(S); out.push(sumAt(S.last, S.last.G)); } return out; };
const show = o => JSON.stringify(o).replace(/"/g, "");
const tgt = (S, r, good, badOnes, n) => {
  const R = S.cfg.rounds[r], res = (o, want) => { const js = play(S, r, o, n).map(x => judge(R, x, S.last)); return [o, js.every(j => j.ok === want), js.map(j => j.vals.join("/")).join(", ")]; };
  const g = good.map(o => res(o, true)), b = badOnes.map(o => res(o, false));
  check(S.K + " target " + (r + 1) + ": hit by " + g.map(x => show(x[0]) + " (" + x[2] + ")").join(", ") + "; missed by " + b.map(x => show(x[0]) + " (" + x[2] + ")").join(", "),
        g.every(x => x[1]) && b.every(x => x[1]), g.filter(x => !x[1]).map(x => "no hit " + show(x[0])).concat(b.filter(x => !x[1]).map(x => "hit " + show(x[0]))).join("; "));
};
const kinds = (w, F) => { const s = new Set(); for (const g of F) for (const c of g) for (let i = 0; i < L; i++) s.add(w.kind[c[i]]); return [...s].sort().join(""); };

/* ================= the engine ================= */
{
  const P = { N: 25, mu: 0.004, R: 1, m: 0, T: 10, start: "grey" }, w = pdWorld(P, 7);
  check("engine: the split starts grey: kinds in the two ponds " + kinds(w, w.pops[0]) + " / " + kinds(w, w.pops[1]), kinds(w, w.pops[0]) === "0" && kinds(w, w.pops[1]) === "0");
  for (let t = 0; t < 150; t++) pdStep(P, w);
  const live = w.pops.map((F, k) => F.every(g => pdLive(P, w, g, k) === 1));
  check("engine: A, 150 generations with no floods: the orange pond carries grey and orange only (" + kinds(w, w.pops[0]) + "), the blue grey and blue only (" + kinds(w, w.pops[1]) + "), and every fish in both survives for sure (nothing selects)",
        /^0?1$/.test(kinds(w, w.pops[0])) && /^0?2$/.test(kinds(w, w.pops[1])) && live.every(Boolean));
  /* mutation */
  const Pm = { mu: 0.004 }, wm = pdWorld({ N: 1, start: "grey", R: 1 }, 3), c0 = wm.pops[0][0][0]; let n = 0; const T = 30000;
  for (let r = 0; r < T; r++) { const c = pdMutate(Pm, wm, c0, r % 2); for (let i = 0; i < L; i++) if (c[i] !== c0[i]) { n++; if (wm.kind[c[i]] !== r % 2 + 1) n -= 1000; } }
  check("engine: mutation, " + (n / T).toFixed(4) + " new alleles a chromosome a generation (40 x 0.004 = 0.16), each in its pond's colour", Math.abs(n / T - 0.16) < 0.008);
  /* floods */
  const Pf = { N: 50, mu: 0, R: 1, m: 0.2, T: 10, start: "grey" }, wf = pdWorld(Pf, 9); let off = 0, sw = 0, nf = 0;
  for (let t = 1; t <= 300; t++) { pdStep(Pf, wf); if (t % 10) { if (wf.flood) off++; } else { nf++; sw += Math.max(0, wf.flood); } }
  check("engine: floods only every 10th generation (" + off + " between), " + (sw / nf).toFixed(1) + " fish swapped a flood (50 x 0.2 = 10)", off === 0 && Math.abs(sw / nf - 10) < 2);
  /* A's floods: at 1, 1 + T, ...; for every T on A's slider, none at 400 and one T - 1 generations before it */
  const ph = A_TV.map(T => { const Pa = SA.cfg.start({ N: 10, mu: 0, R: 1, m: 0.2, T }, 3).P, at = []; for (let t = 1; t <= A_G; t++) if (pdFloodAt(Pa, t)) at.push(t);
    return { T, first: at[0], last: at[at.length - 1], n: at.length }; });
  check("engine: A's floods come at generation 1 and every T after: " + ph.map(x => "every " + x.T + ": " + x.first + " ... " + x.last + " (" + x.n + ")").join(", ") + "; generation 400 is the one before a flood",
        ph.every(x => x.first === 1 && x.last === A_G - x.T + 1 && x.n === A_G / x.T));
  /* F_ST */
  const wa = pdWorld({ N: 25, start: "apart", R: 1 }, 4), fa = pdFst(wa, null).fst, wg = pdWorld({ N: 25, start: "grey", R: 1 }, 4); wg.pops[1] = wg.pops[0].map(g => g.map(c => c.slice()));
  check("engine: F_ST " + fa.toFixed(3) + " for two ponds with nothing in common, " + pdFst(wg, null).fst.toFixed(3) + " for two the same", Math.abs(fa - 1) < 1e-9 && Math.abs(pdFst(wg, null).fst) < 1e-9);
  /* B's food: genes at 10 and 30, arrows 1 and 0.5, S 0.8. Diet d = 0.5 + (1 (z1 - .5) + .5 (z2 - .5)) / 2; top 0.875;
     survival 1 - 0.8 (0.875 - food), food d in orange, 1 - d in blue */
  const PB = { N: 2, start: "apart", R: 1, eco: { at: [9, 29], a: [1, 0.5], S: 0.8, v: 0, q0: [[1, 1], [0, 0]] } }, wb = pdWorld(PB, 2);
  const mk = (b1, b2) => { const a = wb.pops[0][0][0].slice(), b = a.slice(); a[9] = b1 >= 1 ? wb.BEN : wb.LIM; b[9] = b1 >= 2 ? wb.BEN : wb.LIM; a[29] = b2 >= 1 ? wb.BEN : wb.LIM; b[29] = b2 >= 2 ? wb.BEN : wb.LIM; return [a, b]; };
  const hand = (b1, b2, k) => { const d = 0.5 + (1 * (b1 / 2 - 0.5) + 0.5 * (b2 / 2 - 0.5)) / 2, f = k ? 1 - d : d; return 1 - 0.8 * (0.875 - f); };
  let worst = 0; for (const b1 of [0, 1, 2]) for (const b2 of [0, 1, 2]) for (const k of [0, 1]) worst = Math.max(worst, Math.abs(pdLive(PB, wb, mk(b1, b2), k) - hand(b1, b2, k)));
  check("engine: B's chance to survive, every genotype at both genes in both ponds, agrees with the diet by hand (worst gap " + worst.toExponential(1) + "): benthic at both, orange pond " + pdLive(PB, wb, mk(2, 2), 0).toFixed(3) + ", blue " + pdLive(PB, wb, mk(2, 2), 1).toFixed(3) + "; a first hybrid " + pdLive(PB, wb, mk(1, 1), 0).toFixed(3),
        worst < 1e-12 && pdLive(PB, wb, mk(2, 2), 0) === 1 && pdLive(PB, wb, mk(0, 0), 1) === 1);
  /* C's pairs: counted by hand; each lowers survival by its cost */
  const PC = { N: 25, mu: 0.004, p: 0.02, cost: 0.5, R: 1, m: 0, T: 10, start: "grey" }, wc = pdWorld(PC, 7);
  for (let t = 0; t < 150; t++) pdStep(PC, wc);
  const rng = mulberry32(5); let agree = 0, tot = 0, some = 0, cst = 0;
  for (let r = 0; r < 200; r++) { const y = [pdGamete(PC, wc.pops[0][r % 25], rng, null), pdGamete(PC, wc.pops[1][(7 * r) % 25], rng, null)];
    const o = new Set(), b = new Set(); for (const c of y) for (let i = 0; i < L; i++) { const k = wc.kind[c[i]]; if (k === 1) o.add(c[i]); else if (k === 2) b.add(c[i]); }
    let h = 0; for (const x of o) for (const z of b) if (wc.loc[x] !== wc.loc[z] && pdHash(Math.min(x, z), Math.max(x, z), wc.salt) < PC.p) h++;
    if (pdPairs(PC, wc, y) === h) agree++; if (h > 0) some++; tot++; if (Math.abs(pdLive(PC, wc, y, 0) - Math.pow(0.5, h)) < 1e-12) cst++; }
  check("engine: C, a hybrid's incompatible pairs agree with a count by hand (" + agree + " of " + tot + "; " + some + " carry one or more) and its chance to survive is (1 - cost) to that power (" + cst + " of " + tot + ")",
        agree === tot && cst === tot && some > 40);
  /* D's choice, through pdStep: a pond of 100 with a share q of fish black-throated and benthic (both genes two copies) and the
     rest red and limnetic, nothing selecting; births per black / red fish (pdStep's tracking, by Bmp6), and the share of young
     with one parent of each (Bmp6 one copy each), summed over 30 fresh ponds */
  const dtest = (q, a) => { let br = [0, 0], ad = [0, 0], mixed = 0, tot = 0;
    for (let r = 0; r < 30; r++) {
      const Pd = { N: 100, R: 1, mu: 0, start: "grey", eco: { at: [19], a: [1], S: 0, v: 0, q0: [[0], [0]] }, disp: { at: 20, h: 0.5, a, tries: 4, q0: [0, 0] } }, wd = pdWorld(Pd, 21 + r);
      wd.pops[0].forEach((f, i) => { const blk = i < 100 * q; for (const c of f) { c[19] = blk ? wd.BEN : wd.LIM; c[20] = blk ? wd.BLACK : wd.RED; } });
      pdStep(Pd, wd); const t = wd.gen[0]; br[0] += t.births[2]; ad[0] += t.adults[2]; br[1] += t.births[0]; ad[1] += t.adults[0]; mixed += t.born[1]; tot += t.born[0] + t.born[1] + t.born[2]; }
    return { perRare: br[0] / ad[0], perCommon: br[1] / ad[1], mixed: mixed / tot }; };
  const d1 = dtest(0.1, 1), d0 = dtest(0.1, 0), dh = dtest(0.5, 1), dr = dtest(0.5, 0);
  check("engine: D's choice: throats 1 black in 10, everyone choosy: births a black / a red fish " + d1.perRare.toFixed(2) + " / " + d1.perCommon.toFixed(2) + " (no one choosy " + d0.perRare.toFixed(2) + " / " + d0.perCommon.toFixed(2) + "); half and half, young of mixed parents " + Math.round(100 * dh.mixed) + "% choosy, " + Math.round(100 * dr.mixed) + "% not",
        d1.perRare < 0.8 * d1.perCommon && Math.abs(d0.perRare - d0.perCommon) < 0.25 && dh.mixed < 0.08 && Math.abs(dr.mixed - 0.5) < 0.05);
  /* the valley: Bmp6 ○ ◐ ● in the orange pond, S 0.4, v 0.3 -> 0.6, 0.5, 1 */
  const PV = { N: 2, start: "apart", R: 1, eco: { at: [19], a: [1], S: 0.4, v: 0.3, q0: [[1], [0]] } }, wv = pdWorld(PV, 2);
  const gv = d => { const a = wv.pops[0][0][0].slice(), b = a.slice(); a[19] = d >= 1 ? wv.BEN : wv.LIM; b[19] = d >= 2 ? wv.BEN : wv.LIM; return [a, b]; };
  const vv = [0, 1, 2].map(d => [pdLive(PV, wv, gv(d), 0), pdLive(PV, wv, gv(d), 1)].map(x => +x.toFixed(4)));
  check("engine: D, S 0.4, valley 0.3: chance to survive ○ ◐ ● " + vv.map(x => x.join("/")).join(", ") + " (orange / blue)", JSON.stringify(vv) === JSON.stringify([[0.6, 1], [0.5, 0.5], [1, 0.6]]));
  /* D's inversion: loci 20-31 (19..30) */
  const PI = { R: 8, eco: { at: [19] }, disp: { at: 30 }, inv: true }, inv = pdInv(PI), A = new Int32Array(L + 1).fill(1), B2 = new Int32Array(L + 1).fill(2); A[L] = 0; B2[L] = 1;
  const Bi = new Int32Array(L + 1).fill(3); Bi[L] = 1; const ir = mulberry32(13); let split = 0, arrOk = 0, outside = 0, homo = 0;
  for (let r = 0; r < 4000; r++) {
    const gm = pdGamete(PI, [A, B2], ir, inv), ins = new Set(); for (let i = 19; i <= 30; i++) ins.add(gm[i]);
    if (ins.size > 1) split++; if (gm[L] === (gm[19] === 1 ? 0 : 1)) arrOk++; if (gm[0] !== gm[39]) outside++;
    const hm = pdGamete(PI, [B2, Bi], ir, inv), hin = new Set(); for (let i = 19; i <= 30; i++) hin.add(hm[i]); if (hin.size > 1) homo++; }
  check("engine: D's inversion over loci 20-31: one inverted, one standard, none of 4000 gametes mixes inside (" + split + "), each takes the arrangement of the chromosome that gave it locus 20 (" + arrOk + "), crossing over outside goes on (" + outside + "); two inverted cross over inside (" + homo + ")",
        split === 0 && arrOk === 4000 && outside > 1000 && homo > 1000);
  const PM = { N: 50, start: "apart", R: 1, inv: true, eco: { at: [19], a: [1], S: 0.4, v: 0, q0: [[1], [0]] }, disp: { at: 25, h: 0.5, a: 1, tries: 4, q0: [1, 0] } };
  const wM = pdWorld(PM, 5), wS = pdWorld(Object.assign({}, PM, { disp: Object.assign({}, PM.disp, { q0: [0.3, 0.3] }) }), 5);
  check("engine: D, the throat colour-food correlation " + pdMatch(PM, wM).toFixed(2) + " for a matched start, " + pdMatch(PM, wS).toFixed(2) + " for the same mix in both; the orange pond's chromosomes start inverted (" + wM.pops[0].every(g => g[0][L] === 1 && g[1][L] === 1) + "), the blue's not (" + wM.pops[1].every(g => g[0][L] === 0) + ")",
        Math.abs(pdMatch(PM, wM) - 1) < 1e-9 && Math.abs(pdMatch(PM, wS)) < 0.25 && wM.pops[0].every(g => g[0][L] === 1 && g[1][L] === 1) && wM.pops[1].every(g => g[0][L] === 0));
}

/* ================= the targets ================= */
tgt(SA, 0, [{ T: 25 }, { m: 0.05 }, { m: 0.1, T: 25 }, { T: 50 }], [{ m: 0.2, T: 10 }, { m: 0.3, T: 5 }]);
tgt(SA, 1, [{ N: 10 }], [{ N: 25 }, { N: 50 }]);
tgt(SA, 2, [{ T: 5 }, { T: 2 }, { m: 0.5, T: 5 }], [{ m: 0.2, T: 10 }, { T: 25 }]);
{
  /* A's line is the bars' average: F_ST over the genome (each run's average over the loci that vary, then the runs averaged)
     against the mean of the bars drawn, at N 25 and at N 10 (where many loci carry one allele in both ponds and are left out) */
  const gap = [[0, { T: 25 }], [2, { m: 0.2, T: 10 }]].map(([r, o]) => { const S = play(SA, r, o, 1)[0], last = SA.last.hist[SA.last.hist.length - 1].runs;
    const out = last.reduce((n, p) => n + p.by.filter(v => Number.isNaN(v)).length, 0) / last.length;
    return { N: SA.last.P.N, fst: S.fst, bars: meanOf(S.by), out }; });
  check("A's line is the bars' average: " + gap.map(g => "N " + g.N + " " + f2(g.fst) + " vs " + f2(g.bars) + " (" + g.out.toFixed(1) + " loci a run left out)").join("; "),
        gap.every(g => Math.abs(g.fst - g.bars) < 0.015) && gap[1].out > 5);
}
{
  /* B's picture of each round: its sketch at the round's own gene places (round 3 also at the start, far apart, and side by
     side), judged by the round's rules, is a hit */
  const pics = [[0, {}], [1, {}], [2, {}], [2, { i: 19, j: 20 }], [3, {}]].map(([r, o]) => {
    const R = SB.cfg.rounds[r], set = Object.assign({}, readSet(SB), { i: 9, j: 29 }, R.open || {}, R.hold || {}, o), bars = B_picBars(set, R);
    const S = { by: bars, genes: [bars[set.i], bars[set.j]] }, q = { P: { eco: { at: [set.i, set.j] } } };
    return { r, at: (set.i + 1) + "/" + (set.j + 1), ok: judge(R, S, q).ok, vals: judge(R, S, q).vals.join(" ") };
  });
  check("B's pictures, each judged by its own round: " + pics.map(x => "round " + (x.r + 1) + " at " + x.at + " " + (x.ok ? "hit" : "MISS") + " (" + x.vals + ")").join("; "), pics.every(x => x.ok));
}
tgt(SB, 0, [{ a1: 1, a2: 0 }, { a1: 0.75, a2: 0 }], [{ a1: 0.5, a2: 0.5 }, { a1: 1, a2: 0.5 }, { a1: 0, a2: 0 }]);
tgt(SB, 1, [{ R: 0.5 }, { R: 0.25 }], [{ R: 1 }, { R: 2 }]);
tgt(SB, 2, [{ i: 19, j: 20 }, { i: 30, j: 31 }], [{ i: 9, j: 29 }, { i: 14, j: 25 }]);
tgt(SB, 3, [{ m: 0.2, T: 2 }, { m: 0.3, T: 2 }], [{ m: 0.1, T: 2 }, { m: 0.1, T: 5 }]);
tgt(SC, 0, [{ mu: 0.004 }, { p: 0.05 }], [{ mu: 0.002 }, { mu: 0.001 }]);
tgt(SC, 1, [{ m: 0.2, T: 2 }, { m: 0.3, T: 5 }], [{ m: 0.2, T: 10 }, { m: 0.2, T: 5 }]);
tgt(SC, 2, [{ mu: 0.004 }, { mu: 0.006 }], [{ p: 0 }, { mu: 0.001 }]);
tgt(SD, 0, [{ c: 1 }], [{ c: 0 }, { c: 0.5 }]);
tgt(SD, 1, [{ start: 0 }], [{ start: 1 }]);
tgt(SD, 2, [{ at: 20 }, { inv: 1 }, { at: 20, R: 1 }], [{ at: 39, R: 4 }, { at: 39, R: 1 }]);
tgt(SD, 3, [{ v: 0.1 }, { v: 0 }, { T: 2 }, { m: 0.1 }], [{ v: 0.4 }, { v: 0.2 }]);
{
  /* the table's fitness re-derived from the run's own counts: a young fish's chance to survive x births of a fish of its
     genotype, relative */
  play(SD, 0, { c: 1 }, 1); const q = SD.last, G = gotOf(q), t0 = q.t - 19; let worst = 0, avg = [];
  [0, 1].forEach(k => { let born = [0, 0, 0], lived = [0, 0, 0], br = [0, 0, 0], ad = [0, 0, 0];
    for (const h of q.hist) if (h.t >= t0) for (const s of h.runs) for (let d = 0; d < 3; d++) { born[d] += s.trk[k][d]; lived[d] += s.trk[k][3 + d]; br[d] += s.trk[k][6 + d]; ad[d] += s.trk[k][9 + d]; }
    const bAll = (br[0] + br[1] + br[2]) / (ad[0] + ad[1] + ad[2]), f = [0, 1, 2].map(d => born[d] && ad[d] ? lived[d] / born[d] * (br[d] / ad[d] / bAll) : null);
    let fs = 0, fn = 0; for (let d = 0; d < 3; d++) if (f[d] != null) { fs += f[d] * born[d]; fn += born[d]; }
    for (let d = 0; d < 3; d++) if (f[d] != null) worst = Math.max(worst, Math.abs(f[d] / (fs / fn) - G[k].fr[d]));
    let as = 0, an = 0; for (let d = 0; d < 3; d++) if (G[k].fr[d] != null) { as += G[k].fr[d] * born[d]; an += born[d]; } avg.push(as / an); });
  check("D's table: fitness re-derived from the counts agrees (worst gap " + worst.toExponential(1) + "); the average young's fitness is 1 in each pond (" + avg.map(x => x.toFixed(3)).join(" / ") + ")", worst < 1e-9 && avg.every(x => Math.abs(x - 1) < 1e-9));
}

/* ================= the flow, scored ================= */
{
  const flow = (S, missing, intended) => {
    S.round = 0; S.results = []; S.done = false; S.waiting = false; S.last = null; el(S, "practice").checked = false; openRound(S); syncStage(S);
    setC(S, missing); goStage(S); finishNow(S); const miss = Score.getBit("scaffold", BIT[S.K + "1"]) === 0 && !S.waiting;
    for (let r = 0; r < intended.length; r++) {
      setC(S, intended[r]); goStage(S); finishNow(S);
      if (r < intended.length - 1) { const shown = !el(S, "next").hidden; nextRound(S); if (!shown) return { miss, bits: "next hidden at " + r }; }
    }
    return { miss, bits: intended.map((_, r) => Score.getBit("scaffold", BIT[S.K + (r + 1)])).join("") };
  };
  const a = flow(SA, { m: 0.2, T: 10 }, [{ T: 50 }, { N: 10 }, { T: 2 }]);
  check("A flow: a miss records 0; three hits (bits " + a.bits + ") open B", a.miss && a.bits === "011" && Gates.A.done && Gates.B.open);
  const b = flow(SB, { a1: 0.5, a2: 0.5 }, [{ a1: 1, a2: 0 }, { R: 0.25 }, { i: 19, j: 20 }, { m: 0.3, T: 2 }]);
  check("B flow: a miss records 0; four hits (bits " + b.bits + ") open C", b.miss && b.bits === "0111" && Gates.B.done && Gates.C.open);
  const c = flow(SC, { mu: 0.001 }, [{ mu: 0.006 }, { m: 0.2, T: 2 }, { mu: 0.006 }]);
  check("C flow: a miss records 0; three hits (bits " + c.bits + ") open D", c.miss && c.bits === "011" && Gates.C.done && Gates.D.open);
  const d = flow(SD, { c: 0 }, [{ c: 1 }, { start: 0 }, { at: 20, R: 1 }, { v: 0 }]);
  check("D flow: a miss records 0; four hits (bits " + d.bits + ") end the lesson", d.miss && d.bits === "0111" && Gates.D.done && document.getElementById("done-banner").classList.contains("shown"));
  const D = Object.keys(BIT).length; let n = 0; for (let i = 0; i < D; i++) if (Score.isAnswered("scaffold", i)) n++;
  check("all " + D + " declared bits written", D === 14 && n === D, n + " written");
}

/* ================= the controls ================= */
{
  /* B: drag ▲ from locus 10 to locus 15 along the chromosome */
  SB.done = true; SB.waiting = false; openRound(SB); setC(SB, { i: 9, j: 29 }); B_paint();
  const cv = document.getElementById("B_genes"), r = cv.getBoundingClientRect(), k = r.width / GN.W, sy = +cv.dataset.cssH - 42;
  const at = g => ({ clientX: r.left + (GN.px + (g + 0.5) * GN.pw / L) * k, clientY: r.top + sy * k, pointerId: 1, bubbles: true });
  cv.dispatchEvent(new PointerEvent("pointerdown", at(9))); cv.dispatchEvent(new PointerEvent("pointermove", at(12))); cv.dispatchEvent(new PointerEvent("pointermove", at(14))); cv.dispatchEvent(new PointerEvent("pointerup", at(14)));
  const s1 = readSet(SB);
  /* D: drag ♥ to locus 31, and never onto Bmp6; drag ◐ to the top of the surface; the toggles */
  SD.done = true; SD.waiting = false; openRound(SD); setC(SD, { at: 20, inv: 0, start: 0, v: 0.4 }); D_paint();
  const dv = document.getElementById("D_genes"), dr = dv.getBoundingClientRect(), dk = dr.width / GN.W, dsy = +dv.dataset.cssH - 42;
  const dat = g => ({ clientX: dr.left + (GN.px + (g + 0.5) * GN.pw / L) * dk, clientY: dr.top + (dsy - 25) * dk, pointerId: 1, bubbles: true });
  dv.dispatchEvent(new PointerEvent("pointerdown", dat(20))); dv.dispatchEvent(new PointerEvent("pointermove", dat(19))); const onFood = readSet(SD).at;
  dv.dispatchEvent(new PointerEvent("pointermove", dat(26))); dv.dispatchEvent(new PointerEvent("pointermove", dat(30))); dv.dispatchEvent(new PointerEvent("pointerup", dat(30)));
  const fv = document.getElementById("D_fit"), fr = fv.getBoundingClientRect(), fk = fr.width / DFt.W, hp = D_fitXY(0.4);
  const fat = y => ({ clientX: fr.left + hp.x * fk, clientY: fr.top + y * fk, pointerId: 2, bubbles: true });
  fv.dispatchEvent(new PointerEvent("pointerdown", fat(hp.y))); fv.dispatchEvent(new PointerEvent("pointermove", fat(D_fitXY(0.1).y))); fv.dispatchEvent(new PointerEvent("pointermove", fat(D_fitXY(0).y))); fv.dispatchEvent(new PointerEvent("pointerup", fat(D_fitXY(0).y)));
  const box = document.getElementById("D_invBox"); box.checked = true; box.dispatchEvent(new Event("change"));
  const sm = document.getElementById("D_startS"); sm.checked = true; sm.dispatchEvent(new Event("change"));
  const s2 = readSet(SD);
  /* rounds that hold them: round 2 holds the inversion and frees the start; round 3 the other way */
  SD.done = false; SD.round = 1; openRound(SD); syncStage(SD); const h1 = box.disabled && !sm.disabled;
  SD.round = 2; openRound(SD); syncStage(SD); const h2 = !box.disabled && sm.disabled;
  check("controls: dragging ▲ along B's chromosome moves Bmp6 10 -> " + (s1.i + 1) + "; ♥ along D's stops short of Bmp6 (" + (onFood + 1) + ") and moves the throat gene 21 -> " + (s2.at + 1) + "; ◐ dragged up sets the valley 0.4 -> " + s2.v + "; the toggles set the inversion (" + s2.inv + ") and the start (" + s2.start + "); round 2 holds the inversion and frees the start (" + h1 + "), round 3 the other way (" + h2 + ")",
        s1.i === 14 && s1.j === 29 && onFood !== 19 && s2.at === 30 && s2.v === 0 && s2.inv === 1 && s2.start === 1 && h1 && h2);
  SD.done = true; openRound(SD);
  SC.done = true; openRound(SC); setC(SC, { cost: 0.5 }); C_PATHS.sync();
  const arrow = document.querySelector('#C_paths .paths-arrow[data-of="cost"]');
  check("controls: C's cost arrow is drawn as a negative (red) arrow (" + (arrow ? arrow.getAttribute("class") : "none") + ")", !!arrow && arrow.classList.contains("down"));
}
{
  /* the cards (JM, 2026-10-22): A's and B's carry no words, their picture right above the controls; a done stage's card says
     nothing; the practice box says "practice"; C's and D's fitness surfaces sit in the left column */
  const bare = ["A", "B"].map(K => { const c = document.querySelector("#stage" + K + " .tcard"), cv = c.querySelector("canvas");
    return !c.querySelector(".ttext, ul.rules") && !!cv && cv.nextElementSibling === c.querySelector(".controls"); });
  const quiet = ["A", "B", "C", "D"].map(K => { syncStage(ST[K]); const t = document.getElementById(K + "_ttext"), r = document.getElementById(K + "_rules");
    return ST[K].done && (!t || t.textContent === "") && (!r || r.innerHTML === ""); });
  const prac = [...document.querySelectorAll(".practice-row label")].map(l => l.textContent.trim());
  const left = ["C_dmi", "D_fit"].map(id => { const e = document.getElementById(id); return e.closest(".col") === e.closest(".grid").querySelector(".col"); });
  check("cards: A and B wordless with the picture over the controls (" + bare.join(",") + "); done cards say nothing (" + quiet.join(",") + "); practice boxes read " + JSON.stringify([...new Set(prac)]) + " (" + prac.length + "); C's and D's fitness surfaces in the left column (" + left.join(",") + ")",
        bare.every(Boolean) && quiet.every(Boolean) && prac.length === 4 && prac.every(x => x === "practice") && left.every(Boolean));
}
{
  /* hover text: every mark has words; hover shows them and moving off hides them; the hybrid box closed at load */
  const infos = [...document.querySelectorAll(".info")], tipOf = e => e.dataset.tip ? document.getElementById(e.dataset.tip) : e.querySelector(".tip");
  const empty = infos.filter(e => !tipOf(e) || !tipOf(e).textContent.trim()).length, pop = document.querySelector(".tip-pop");
  const perStage = "A,B,C,D".split(",").map(K => document.querySelectorAll("#stage" + K + " .info").length);
  const ev = (e, type) => e.dispatchEvent(new MouseEvent(type, { bubbles: true }));
  ev(infos[0], "mouseover"); const shown = !pop.hidden && pop.textContent === tipOf(infos[0]).textContent; ev(document.body, "mouseover"); const gone = pop.hidden;
  const hy = document.getElementById("C_hyBox");
  check("hover text: no bullet list; " + infos.length + " marks (" + perStage.join("/") + " a stage), " + empty + " empty; hover shows, off hides; the hybrid box closed at load",
        document.querySelectorAll("ul.setup, .stage-intro").length === 0 && empty === 0 && perStage.every(n => n >= 3) && shown && gone && hy.matches("details.opt") && !hy.open);
  for (const d of document.querySelectorAll("details.opt")) d.open = true;
}
{
  FIT_EPOCH++; paintAll();
  const over = [];
  for (const id of ${JSON.stringify(CANVAS_IDS)}) { const cv = document.getElementById(id), host = cv.parentElement;
    if (+cv.dataset.drawW > host.clientWidth + 1) over.push(id + " " + cv.dataset.drawW + ">" + host.clientWidth); }
  check("every canvas fits its panel (" + window.innerWidth + " wide)", over.length === 0, over.join(", "));
  const last = ["A", "B", "C", "D"].map(K => { const els = document.querySelectorAll("#stage" + K + " .panel"), e = els[els.length - 1]; return e.matches("details.rcode") && !e.open && !!e.querySelector("#code" + K) && !!e.querySelector("#" + K + "_dl"); });
  check("layout: each stage ends in its R code, closed (" + last.join(",") + "); no readout lines (" + document.querySelectorAll(".readout").length + ")", last.every(Boolean) && document.querySelectorAll(".readout").length === 0);
}
A_code(); B_code(); C_code(); D_code();
say(bad ? ("FAILED " + bad) : "ALL BARS PASS");
say("RAN " + ran);
for (const K of ["A", "B", "C", "D"]) say("R" + K + " " + RTEXT["code" + K].replace(/\\n/g, "\\\\n"));
L_.join(" ;; ");
`;

const INNER_NARROW = `
for (const s of ["A","B","C","D"]) document.getElementById("stage"+s).classList.remove("stage-locked");
for (const d of document.querySelectorAll("details.opt")) d.open = true;
FIT_EPOCH++; paintAll();
const over = [];
for (const id of ${JSON.stringify(CANVAS_IDS)}) { const cv = document.getElementById(id), host = cv.parentElement;
  if (+cv.dataset.drawW > host.clientWidth + 1) over.push(id + " " + cv.dataset.drawW + ">" + host.clientWidth); }
(over.length ? "FAIL " : "ok   ") + "every canvas fits its panel (" + window.innerWidth + " wide)" + (over.length ? "  -- " + over.join(", ") : "");
`;

const probe = `<!doctype html><meta charset="utf-8"><title>pending</title>
<iframe id="f" src="http://127.0.0.1:${PORT}/app/lessons/lesson19.html?preview=1" width="1500" height="1000"></iframe>
<iframe id="g" src="http://127.0.0.1:${PORT}/app/lessons/lesson19.html?preview=1" width="1000" height="900"></iframe>
<pre id="out"></pre><pre id="out2"></pre>
<script>
const SRC = ${JSON.stringify(INNER)}, SRC2 = ${JSON.stringify(INNER_NARROW)};
let n = 0;
const run = (id, src, out) => document.getElementById(id).addEventListener("load", () => setTimeout(() => {
  const w = document.getElementById(id).contentWindow; let res;
  try { res = String(w.eval(src)); } catch (e) { res = "THREW " + e.message + " @ " + (e.stack||"").split("\\n")[1]; }
  document.getElementById(out).textContent = res;
  if (++n === 2) document.title = "done";
}, 2500));
run("f", SRC, "out"); run("g", SRC2, "out2");
</script>`;

const probePath = path.join(ROOT, "_check_l19_" + PORT + ".html");
fs.writeFileSync(probePath, probe);
const server = spawn("python3", ["-m", "http.server", String(PORT), "--directory", ROOT], { stdio: "ignore", detached: true });
const cleanup = () => { try { process.kill(-server.pid); } catch (e) {} try { fs.unlinkSync(probePath); } catch (e) {} };
process.on("exit", cleanup);

setTimeout(() => {
  const r = spawnSync(CHROME, ["--headless=new", "--disable-gpu", "--virtual-time-budget=4000000", "--dump-dom", `http://127.0.0.1:${PORT}/_check_l19_${PORT}.html`],
                      { encoding: "utf8", maxBuffer: 1 << 28 });
  const dec = s => s.replace(/&quot;/g, '"').replace(/&gt;/g, ">").replace(/&lt;/g, "<").replace(/&amp;/g, "&");
  const m = /<pre id="out">([\s\S]*?)<\/pre>/.exec(r.stdout || ""), m2 = /<pre id="out2">([\s\S]*?)<\/pre>/.exec(r.stdout || "");
  if (!m) { console.error("no result -- is Chrome at " + CHROME + " ?"); cleanup(); process.exit(2); }
  const text = dec(m[1]), lines = text.split(" ;; ");
  let bad = !/ALL BARS PASS/.test(text);
  const tagged = t => (lines.find(l => l.startsWith(t + " ")) || "").slice(t.length + 1).replace(/\\n/g, "\n");
  for (const line of lines) if (!/^R[ABCD] /.test(line)) console.log(line);
  const reported = lines.filter(l => /^(ok|FAIL)\s/.test(l)).length;
  const ranLine = /^RAN (\d+)$/.exec((lines.find(l => /^RAN \d+$/.test(l)) || ""));
  if (!ranLine || +ranLine[1] !== reported) { console.log("FAIL harness  " + (ranLine ? ranLine[1] : "?") + " checks ran, " + reported + " came back"); bad = true; }
  const narrow = m2 ? dec(m2[1]) : "FAIL narrow frame gave nothing";
  console.log(narrow); if (!/^ok/.test(narrow)) bad = true;
  const probeR = spawnSync("Rscript", ["--version"], { encoding: "utf8" });
  /* shortened: A 30 generations, B and C 20, D 15 at 30 fish */
  const SHORT = { RA: s => s.replace("for (t in 1:400)", "for (t in 1:30)"), RB: s => s.replace("for (t in 1:200)", "for (t in 1:20)"),
                  RC: s => s.replace("for (t in 1:400)", "for (t in 1:20)"), RD: s => s.replace("for (t in 1:300)", "for (t in 1:15)").replace("N <- 100", "N <- 30") };
  if (probeR.error) console.log("skip R panels  (no Rscript)");
  else for (const tag of ["RA", "RB", "RC", "RD"]) {
    const src = tagged(tag), fixed = SHORT[tag](src);
    if (fixed === src) { console.log("FAIL the R panel for " + tag.slice(1) + ": its loop was not found to shorten"); bad = true; continue; }
    const o = spawnSync("Rscript", ["-e", fixed + "\ncat('\\nOK\\n')"], { encoding: "utf8", timeout: 240000 }), ok = /OK/.test(o.stdout || "");
    console.log((ok ? "ok   " : "FAIL ") + "the R panel for " + tag.slice(1) + " runs (shortened)" + (ok ? "  -- " + (o.stdout || "").trim().split("\n").slice(-3, -1).join(" ").replace(/\s+/g, " ") : "  -- " + (o.stderr || "").slice(0, 300)));
    if (!ok) bad = true;
  }
  cleanup();
  process.exit(bad ? 1 : 0);
}, 700);
