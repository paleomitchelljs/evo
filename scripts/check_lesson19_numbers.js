#!/usr/bin/env node
/*
 * check_lesson19_numbers.js -- the checks for app/lessons/lesson19.html.
 *
 * Lesson 19, pass 7 (2026-10-23, JM's review of pass 6): speciation as a
 * process. A pulsed migration (floods) and F_ST across the genome, every
 * target a window on F_ST over the whole genome; B sticklebacks, two food
 * genes placed on the chromosome, each pond's snails and plankton set
 * apart (lesson 12's columns); C new
 * mutations that make incompatibilities; D mate choice: a preference gene
 * and a throat gene. What has to hold:
 *
 *   Engine. A starts grey, and with no floods each pond carries only grey
 *      and its own colour, every fish surviving (nothing selects in A);
 *      mutation runs at mu a locus; floods come only every T generations,
 *      about N m fish each, and A's at 1, 1 + T, ... so that 400 is the
 *      generation before a flood; F_ST is 1 for two ponds with nothing in common
 *      and 0 for two the same; B's chance to survive follows each pond's
 *      snails and plankton and the traits' cost, by hand, and each gene
 *      answers to its own food alone (Bmp6 to snails, the gill-raker gene
 *      to plankton, neither when its food sits at the middle); C's hybrid incompatible
 *      pairs agree with a count by hand and each lowers survival by its
 *      cost; D's choice gives a rare throat colour fewer matings and mixes
 *      few throats when choosy, as many as chance when not or when every
 *      fish carries one preference allele of each; the valley sets the
 *      hybrid; D's inversion (over the three genes) stops crossing over
 *      inside it in a fish with one inverted chromosome; both correlations
 *      are 1 for a start where the alleles arose in different ponds; the
 *      table's number of offspring is its survival times its mating
 *      frequency, re-derived here.
 *   Targets. Each round's intended settings hit it and its opening (and the
 *      near misses measured in the page's comments) miss it. Each round's
 *      picture (B's sketch of the genome, C's and D's example charts),
 *      judged by that round's own rules, is a hit. D's verdict is what its
 *      chart draws: the thick line's end against the red box.
 *   Flow. A miss records 0 and the target stays; hits open Next target;
 *      each stage opens the next; the last ends the lesson; every bit
 *      written.
 *   Controls. B's food columns set each pond's snails and plankton by
 *      click or drag, the 0 clears one, and a held one stays put; B's two
 *      genes and D's throat and preference genes move by
 *      dragging along the chromosome, a held one staying put; D's ◐ moves by
 *      dragging on the fitness surface; D's
 *      toggles write their inputs and are held when a round holds them; C's
 *      cost arrow is red (it lowers survival).
 *   Layout. JM's intro in each stage; no Target card has words but B round
 *   5's and D round 3's one sentence on a drag, only its picture
 *   (A's genome graph, B's sketch, C's and D's example charts) over the
 *   controls, and C's and D's menus turn to the plot the picture is; no card says anything
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

const CANVAS_IDS = ["A_board", "A_genes", "A_time", "B_board", "B_genes", "B_time", "B_surf", "B_tpic", "B_food", "C_board", "C_time", "C_dmi", "C_grid", "C_tpic", "D_board", "D_genes", "D_time", "D_fit", "D_got", "D_tpic"];
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
  /* B's food: genes at 10 and 30; the orange pond 3 snails and 1 plankton of 4, the blue 1 and 4; S 0.8. Teeth t = benthic
     share at Bmp6, rakers r = limnetic share at the gill-raker gene; food sn t + pl r less 0.5 (t + r); survival
     1 - 0.8 (top - food), top the best genotype's */
  const SN = [0.75, 0.25], PL = [0.25, 1];
  const PB = { N: 2, start: "apart", R: 1, eco: { at: [9, 29], sn: SN, pl: PL, S: 0.8, v: 0, q0: [[1, 1], [0, 0]] } }, wb = pdWorld(PB, 2);
  const mk = (b1, b2) => { const a = wb.pops[0][0][0].slice(), b = a.slice(); a[9] = b1 >= 1 ? wb.BEN : wb.LIM; b[9] = b1 >= 2 ? wb.BEN : wb.LIM; a[29] = b2 >= 1 ? wb.BEN : wb.LIM; b[29] = b2 >= 2 ? wb.BEN : wb.LIM; return [a, b]; };
  const hand = (z1, z2, k) => { const t = z1 / 2, r = 1 - z2 / 2, val = (tt, rr) => (SN[k] - 0.5) * tt + (PL[k] - 0.5) * rr;
    let top = -9; for (const tt of [0, 0.5, 1]) for (const rr of [0, 0.5, 1]) top = Math.max(top, val(tt, rr)); return 1 - 0.8 * (top - val(t, r)); };
  let worst = 0; for (const b1 of [0, 1, 2]) for (const b2 of [0, 1, 2]) for (const k of [0, 1]) worst = Math.max(worst, Math.abs(pdLive(PB, wb, mk(b1, b2), k) - hand(b1, b2, k)));
  check("engine: B's chance to survive, every genotype at both genes in both ponds, agrees with the snails and plankton by hand (worst gap " + worst.toExponential(1) + "): benthic at both, orange pond " + pdLive(PB, wb, mk(2, 2), 0).toFixed(3) + ", blue " + pdLive(PB, wb, mk(2, 2), 1).toFixed(3) + "; a first hybrid " + pdLive(PB, wb, mk(1, 1), 0).toFixed(3),
        worst < 1e-12 && Math.abs(pdLive(PB, wb, mk(2, 2), 0) - 1) < 1e-12 && Math.abs(pdLive(PB, wb, mk(0, 0), 1) - 1) < 1e-12);
  /* each gene answers to its own food: over every snails x plankton on B's columns, two benthic alleles at Bmp6 against none
     change survival by 0.8 (snails - 0.5) whatever the plankton and the other gene; two benthic alleles at the gill-raker gene
     (few rakers) against none by -0.8 (plankton - 0.5) whatever the snails */
  let g1 = 0, g2 = 0; const at1 = [], at2 = [];
  for (const sn of B_FOODV) for (const pl of B_FOODV) { const E = { at: [9, 29], sn: [sn, sn], pl: [pl, pl], S: 0.8 };
    for (const z of [0, 1, 2]) { g1 = Math.max(g1, Math.abs(pdEatZ(E, 0, 2, z) - pdEatZ(E, 0, 0, z) - 0.8 * (sn - 0.5))); g2 = Math.max(g2, Math.abs(pdEatZ(E, 0, z, 2) - pdEatZ(E, 0, z, 0) + 0.8 * (pl - 0.5))); } }
  B_FOODV.forEach(v => { const E = { at: [9, 29], sn: [v, v], pl: [v, v], S: 0.8 }; at1.push(+(pdEatZ(E, 0, 2, 1) - pdEatZ(E, 0, 0, 1)).toFixed(2)); at2.push(+(pdEatZ(E, 0, 1, 0) - pdEatZ(E, 0, 1, 2)).toFixed(2)); });
  check("engine: each gene answers to its own food: Bmp6's benthic allele (two copies against none) adds " + at1.join(", ") + " at snails 0-4, whatever the plankton (worst gap " + g1.toExponential(1) + "); the gill-raker gene's limnetic allele adds " + at2.join(", ") + " at plankton 0-4, whatever the snails (" + g2.toExponential(1) + "); at 2 of 4 neither selects",
        g1 < 1e-12 && g2 < 1e-12 && at1.join() === "-0.4,-0.2,0,0.2,0.4" && at2.join() === "-0.4,-0.2,0,0.2,0.4");
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
  /* D's choice, through pdStep: a pond of 100 with a share q of fish black-throated, prefers-black and benthic (each gene two
     copies) and the rest red, prefers-red and limnetic (het: every fish one preference allele of each), nothing selecting;
     matings per black / red fish (pdStep's tracking, by Bmp6), and the share of young with one parent of each (Bmp6 one copy
     each), summed over 30 fresh ponds */
  const dtest = (q, a, het) => { let br = [0, 0], ad = [0, 0], mixed = 0, tot = 0;
    for (let r = 0; r < 30; r++) {
      const Pd = { N: 100, R: 1, mu: 0, start: "grey", eco: { at: [19], sn: [1, 0], S: 0, v: 0, q0: [[0], [0]] }, disp: { at: 20, h: 0.5, a, tries: 4, q0: [0, 0], pat: 21, pq0: [0, 0] } }, wd = pdWorld(Pd, 21 + r);
      wd.pops[0].forEach((f, i) => { const blk = i < 100 * q; f.forEach((c, ci) => { c[19] = blk ? wd.BEN : wd.LIM; c[20] = blk ? wd.BLACK : wd.RED; c[21] = het ? (ci ? wd.PBLK : wd.PRED) : blk ? wd.PBLK : wd.PRED; }); });
      pdStep(Pd, wd); const t = wd.gen[0]; br[0] += t.births[2]; ad[0] += t.adults[2]; br[1] += t.births[0]; ad[1] += t.adults[0]; mixed += t.born[1]; tot += t.born[0] + t.born[1] + t.born[2]; }
    return { perRare: br[0] / ad[0], perCommon: br[1] / ad[1], mixed: mixed / tot }; };
  const d1 = dtest(0.1, 1), d0 = dtest(0.1, 0), dh = dtest(0.5, 1), dr = dtest(0.5, 0), dx = dtest(0.5, 1, true);
  check("engine: D's choice: throats 1 black in 10, everyone choosy: matings a black / a red fish " + d1.perRare.toFixed(2) + " / " + d1.perCommon.toFixed(2) + " (no one choosy " + d0.perRare.toFixed(2) + " / " + d0.perCommon.toFixed(2) + "); half and half, young of mixed parents " + Math.round(100 * dh.mixed) + "% choosy, " + Math.round(100 * dr.mixed) + "% not, " + Math.round(100 * dx.mixed) + "% choosy when every fish carries one preference allele of each",
        d1.perRare < 0.8 * d1.perCommon && Math.abs(d0.perRare - d0.perCommon) < 0.25 && dh.mixed < 0.08 && Math.abs(dr.mixed - 0.5) < 0.05 && Math.abs(dx.mixed - 0.5) < 0.05);
  /* the valley: Bmp6 ○ ◐ ● in the orange pond, S 0.4, v 0.3 -> 0.6, 0.5, 1 */
  const PV = { N: 2, start: "apart", R: 1, eco: { at: [19], sn: [1, 0], S: 0.4, v: 0.3, q0: [[1], [0]] } }, wv = pdWorld(PV, 2);
  const gv = d => { const a = wv.pops[0][0][0].slice(), b = a.slice(); a[19] = d >= 1 ? wv.BEN : wv.LIM; b[19] = d >= 2 ? wv.BEN : wv.LIM; return [a, b]; };
  const vv = [0, 1, 2].map(d => [pdLive(PV, wv, gv(d), 0), pdLive(PV, wv, gv(d), 1)].map(x => +x.toFixed(4)));
  check("engine: D, S 0.4, valley 0.3: chance to survive ○ ◐ ● " + vv.map(x => x.join("/")).join(", ") + " (orange / blue)", JSON.stringify(vv) === JSON.stringify([[0.6, 1], [0.5, 0.5], [1, 0.6]]));
  /* D's inversion: loci 20-31 (19..30), the preference gene inside it at 26 */
  const PI = { R: 8, eco: { at: [19] }, disp: { at: 30, pat: 25 }, inv: true }, inv = pdInv(PI), A = new Int32Array(L + 1).fill(1), B2 = new Int32Array(L + 1).fill(2); A[L] = 0; B2[L] = 1;
  const Bi = new Int32Array(L + 1).fill(3); Bi[L] = 1; const ir = mulberry32(13); let split = 0, arrOk = 0, outside = 0, homo = 0;
  for (let r = 0; r < 4000; r++) {
    const gm = pdGamete(PI, [A, B2], ir, inv), ins = new Set(); for (let i = 19; i <= 30; i++) ins.add(gm[i]);
    if (ins.size > 1) split++; if (gm[L] === (gm[19] === 1 ? 0 : 1)) arrOk++; if (gm[0] !== gm[39]) outside++;
    const hm = pdGamete(PI, [B2, Bi], ir, inv), hin = new Set(); for (let i = 19; i <= 30; i++) hin.add(hm[i]); if (hin.size > 1) homo++; }
  check("engine: D's inversion over loci 20-31 (" + (inv[0] + 1) + "-" + (inv[1] + 1) + "): one inverted, one standard, none of 4000 gametes mixes inside (" + split + "), each takes the arrangement of the chromosome that gave it locus 20 (" + arrOk + "), crossing over outside goes on (" + outside + "); two inverted cross over inside (" + homo + ")",
        split === 0 && arrOk === 4000 && outside > 1000 && homo > 1000 && inv[0] === 19 && inv[1] === 30);
  const PM = { N: 50, start: "apart", R: 1, inv: true, eco: { at: [19], sn: [1, 0], S: 0.4, v: 0, q0: [[1], [0]] }, disp: { at: 25, h: 0.5, a: 1, tries: 4, q0: [1, 0], pat: 26, pq0: [1, 0] } };
  const wM = pdWorld(PM, 5), wS = pdWorld(Object.assign({}, PM, { disp: Object.assign({}, PM.disp, { q0: [0.3, 0.3], pq0: [0.3, 0.3] }) }), 5);
  const pt = (P, w) => pdMatch(P, w, g => pdPref(P, w, g), g => pdBlack(P, w, g));
  check("engine: D, the throat colour-food correlation " + pdMatch(PM, wM).toFixed(2) + " and the preference-throat correlation " + pt(PM, wM).toFixed(2) + " when the alleles arose in different ponds, " + pdMatch(PM, wS).toFixed(2) + " and " + pt(PM, wS).toFixed(2) + " when they are present in both; the orange pond's chromosomes start inverted (" + wM.pops[0].every(g => g[0][L] === 1 && g[1][L] === 1) + "), the blue's not (" + wM.pops[1].every(g => g[0][L] === 0) + ")",
        Math.abs(pdMatch(PM, wM) - 1) < 1e-9 && Math.abs(pt(PM, wM) - 1) < 1e-9 && Math.abs(pdMatch(PM, wS)) < 0.25 && Math.abs(pt(PM, wS)) < 0.25 && wM.pops[0].every(g => g[0][L] === 1 && g[1][L] === 1) && wM.pops[1].every(g => g[0][L] === 0));
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
  /* B's picture of each round: its sketch at the round's own gene places (round 5 also at its start, far apart, and side by
     side), judged by the round's rules, is a hit */
  const pics = [[0, {}], [1, {}], [2, {}], [3, {}], [4, {}], [4, { i: 19, j: 20 }]].map(([r, o]) => {
    const R = SB.cfg.rounds[r], set = Object.assign({}, readSet(SB), { i: 9, j: 29 }, R.open || {}, R.hold || {}, o), bars = B_picBars(set, R);
    const S = { by: bars, genes: [bars[set.i], bars[set.j]] }, q = { P: { eco: { at: [set.i, set.j] } } };
    return { r, at: (set.i + 1) + "/" + (set.j + 1), ok: judge(R, S, q).ok, vals: judge(R, S, q).vals.join(" ") };
  });
  check("B's pictures, each judged by its own round: " + pics.map(x => "round " + (x.r + 1) + " at " + x.at + " " + (x.ok ? "hit" : "MISS") + " (" + x.vals + ")").join("; "), pics.every(x => x.ok));
  /* C's and D's example charts: each curve's end judged by its round (C's third on the curve's own falls at its last four floods,
     against its first) */
  const cp = SC.cfg.rounds.map((R, r) => { const f = R.pic.lines[0].f, G = R.pic.G;
    if (r < 2) { const j = judge(R, { hw: f(G) }, null); return { r, ok: j.ok, v: f2(f(G)) }; }
    const fall = t => f(t - 1) - f(t), late = meanOf([0, 1, 2, 3].map(k => fall(G - 25 * k)));
    return { r, ok: late < 0.16 && fall(25) > 0.16, v: "falls " + f2(fall(25)) + " at the first flood, " + f2(late) + " at the last four" }; });
  const dp = SD.cfg.rounds.map((R, r) => { const e = R.pic.lines[0].f(R.pic.G), j = judge(R, { fb: e }, null); return { r, ok: j.ok && R.pic.meas === "fb", v: f2(e) }; });
  check("C's and D's example charts, each judged by its own round: C " + cp.map(x => (x.r + 1) + " " + (x.ok ? "hit" : "MISS") + " (" + x.v + ")").join(", ") + "; D " + dp.map(x => (x.r + 1) + " " + (x.ok ? "hit" : "MISS") + " (" + x.v + ")").join(", "),
        cp.every(x => x.ok) && dp.every(x => x.ok));
}
/* B's food as orange snails, plankton / blue snails, plankton, 0-1 (the columns' 0-4 over 4) */
const fd = (so, po, sb, pb) => ({ so, po, sb, pb });
tgt(SB, 0, [fd(1, 0, 0, 1), fd(0.75, 0.25, 0.25, 0.75), fd(1, 1, 0, 0)], [fd(0.5, 0.5, 0.5, 0.5), fd(0.75, 0.5, 0.25, 0.5), fd(0.5, 1, 0.5, 0)]);
tgt(SB, 1, [fd(1, 0, 1, 1), fd(0.75, 0, 0.75, 1), fd(0.25, 0.25, 0.25, 0.75)], [fd(1, 0, 0, 1), fd(1, 1, 0, 0), fd(0.75, 0.5, 0.25, 0.5)]);
tgt(SB, 2, [{ R: 1 }, { R: 0.5 }], [{ R: 2 }, { R: 4 }]);
tgt(SB, 3, [{ m: 0.3, T: 2 }, { m: 0.5, T: 5 }], [{ m: 0.2, T: 2 }, { m: 0.1, T: 5 }]);
/* genes 11 apart (15 and 26) sit on the bar (.28-.37): closer is the right way, so they are not asked to miss */
tgt(SB, 4, [{ i: 19, j: 20 }, { i: 9, j: 10 }], [{ i: 9, j: 29 }, { i: 0, j: 39 }]);
tgt(SC, 0, [{ mu: 0.002 }, { p: 0.05 }], [{ mu: 0.001 }, { p: 0.01 }]);
tgt(SC, 1, [{ m: 0.2, T: 2 }, { m: 0.5, T: 5 }], [{ m: 0.2, T: 10 }, { m: 0.3, T: 5 }, { m: 0.5, T: 10 }]);
tgt(SC, 2, [{ mu: 0.002 }, { mu: 0.004 }], [{ mu: 0.001 }, { p: 0 }]);
tgt(SD, 0, [{ c: 1 }], [{ c: 0.75 }, { c: 0 }]);
tgt(SD, 1, [{ start: 0 }], [{ start: 1 }]);
tgt(SD, 2, [{ pat: 21 }, { inv: 1 }], [{ pat: 39 }]);
/* a flat valley alone (.1, 0) keeps the ponds only a little apart, F_ST at Bmp6 .08-.12, under the bar: asked neither way */
tgt(SD, 3, [{ T: 2 }, { m: 0.15 }], [{ v: 0.4 }, { v: 0.2 }]);
{
  /* D's verdict is what its chart draws (pass 8): the thick line's end, the 16 runs' average, against the red box. Pass 7's
     count put the thick lines in the boxes on a miss with ◆ at 31 */
  const agree = [[2, { pat: 30 }], [2, { pat: 39 }], [3, { v: 0 }]].map(([r, o]) => { const S = play(SD, r, o, 1)[0], R = SD.cfg.rounds[r], j = judge(R, S, SD.last);
    const end = meanOf(SD.last.hist[SD.last.hist.length - 1].runs.map(p => MEAS_D[R.pic.meas].vals(p)[0])), box = R.pic.boxes[0];
    return { o, ok: R.rules[0].meas === R.pic.meas && j.ok === (end >= box.lo && end <= box.hi), v: f2(end) + (j.ok ? " hit" : " miss") }; });
  check("D's verdict is its chart's: the thick line's end against the red box agrees with the score (" + agree.map(a => "round " + (a.o.v != null ? 4 : 3) + " " + show(a.o) + " " + a.v).join(", ") + ")", agree.every(a => a.ok));
}
{
  /* the table's number of offspring re-derived from the run's own counts: a young fish's chance to survive x the matings of a
     fish of its genotype, relative */
  play(SD, 0, { c: 1 }, 1); const q = SD.last, G = gotOf(q), t0 = q.t - 19; let worst = 0, avg = [];
  [0, 1].forEach(k => { let born = [0, 0, 0], lived = [0, 0, 0], br = [0, 0, 0], ad = [0, 0, 0];
    for (const h of q.hist) if (h.t >= t0) for (const s of h.runs) for (let d = 0; d < 3; d++) { born[d] += s.trk[k][d]; lived[d] += s.trk[k][3 + d]; br[d] += s.trk[k][6 + d]; ad[d] += s.trk[k][9 + d]; }
    const bAll = (br[0] + br[1] + br[2]) / (ad[0] + ad[1] + ad[2]), f = [0, 1, 2].map(d => born[d] && ad[d] ? lived[d] / born[d] * (br[d] / ad[d] / bAll) : null);
    let fs = 0, fn = 0; for (let d = 0; d < 3; d++) if (f[d] != null) { fs += f[d] * born[d]; fn += born[d]; }
    for (let d = 0; d < 3; d++) if (f[d] != null) worst = Math.max(worst, Math.abs(f[d] / (fs / fn) - G[k].fr[d]));
    let as = 0, an = 0; for (let d = 0; d < 3; d++) if (G[k].fr[d] != null) { as += G[k].fr[d] * born[d]; an += born[d]; } avg.push(as / an); });
  check("D's table: the number of offspring re-derived from the counts agrees (worst gap " + worst.toExponential(1) + "); the average young's fitness is 1 in each pond (" + avg.map(x => x.toFixed(3)).join(" / ") + ")", worst < 1e-9 && avg.every(x => Math.abs(x - 1) < 1e-9));
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
  const b = flow(SB, fd(0.5, 0.5, 0.5, 0.5), [fd(1, 0, 0, 1), { sb: 1 }, { R: 0.5 }, { m: 0.5, T: 2 }, { i: 19, j: 20 }]);
  check("B flow: a miss records 0; five hits (bits " + b.bits + ") open C", b.miss && b.bits === "01111" && Gates.B.done && Gates.C.open);
  const c = flow(SC, { mu: 0.001 }, [{ mu: 0.006 }, { m: 0.2, T: 2 }, { mu: 0.006 }]);
  check("C flow: a miss records 0; three hits (bits " + c.bits + ") open D", c.miss && c.bits === "011" && Gates.C.done && Gates.D.open);
  const d = flow(SD, { c: 0.75 }, [{ c: 1 }, { start: 0 }, { pat: 21 }, { T: 2 }]);
  check("D flow: a miss records 0; four hits (bits " + d.bits + ") end the lesson", d.miss && d.bits === "0111" && Gates.D.done && document.getElementById("done-banner").classList.contains("shown"));
  const D = Object.keys(BIT).length; let n = 0; for (let i = 0; i < D; i++) if (Score.isAnswered("scaffold", i)) n++;
  check("all " + D + " declared bits written", D === 15 && n === D, n + " written");
}

/* ================= the controls ================= */
{
  /* B: drag ▲ from locus 10 to locus 15 along the chromosome */
  SB.done = true; SB.waiting = false; openRound(SB); setC(SB, { i: 9, j: 29 }); B_paint();
  const cv = document.getElementById("B_genes"), r = cv.getBoundingClientRect(), k = r.width / GN.W, sy = +cv.dataset.cssH - 42;
  const at = g => ({ clientX: r.left + (GN.px + (g + 0.5) * GN.pw / L) * k, clientY: r.top + sy * k, pointerId: 1, bubbles: true });
  cv.dispatchEvent(new PointerEvent("pointerdown", at(9))); cv.dispatchEvent(new PointerEvent("pointermove", at(12))); cv.dispatchEvent(new PointerEvent("pointermove", at(14))); cv.dispatchEvent(new PointerEvent("pointerup", at(14)));
  const s1 = readSet(SB);
  /* B's food: drag the blue pond's plankton column from its bottom slot to its top; click the 0 under the orange pond's snails;
     then in round 3 (food held) a click changes nothing */
  setC(SB, fd(0.5, 0.5, 0.5, 0.5)); B_paint();
  const fv0 = document.getElementById("B_food"), fr0 = fv0.getBoundingClientRect(), fk0 = fr0.width / FD.W;
  const fat0 = (key, y) => ({ clientX: fr0.left + FD.cols.find(c => c[0] === key)[2] * fk0, clientY: fr0.top + y * fk0, pointerId: 3, bubbles: true });
  const slotY = n => FD.bot - (n - 0.5) * FD.sh;
  fv0.dispatchEvent(new PointerEvent("pointerdown", fat0("pb", slotY(1)))); const pb1 = readSet(SB).pb;
  fv0.dispatchEvent(new PointerEvent("pointermove", fat0("pb", slotY(3)))); fv0.dispatchEvent(new PointerEvent("pointermove", fat0("pb", slotY(4)))); fv0.dispatchEvent(new PointerEvent("pointerup", fat0("pb", slotY(4))));
  fv0.dispatchEvent(new PointerEvent("pointerdown", fat0("so", FD.bot + 10))); fv0.dispatchEvent(new PointerEvent("pointerup", fat0("so", FD.bot + 10)));
  const sf = readSet(SB);
  SB.done = false; SB.round = 2; openRound(SB); syncStage(SB); B_paint(); const heldSo = readSet(SB).so;
  fv0.dispatchEvent(new PointerEvent("pointerdown", fat0("so", slotY(2)))); fv0.dispatchEvent(new PointerEvent("pointerup", fat0("so", slotY(2))));
  const sh3 = readSet(SB).so; SB.done = true; openRound(SB);
  check("controls: B's food columns: pressing the blue pond's plankton at its bottom slot sets " + pb1 * 4 + " of 4, dragging up to the top " + sf.pb * 4 + "; the 0 under the orange pond's snails clears them (" + sf.so * 4 + "); in round 3, where the food is held, a click leaves it (" + heldSo * 4 + " -> " + sh3 * 4 + ")",
        pb1 === 0.25 && sf.pb === 1 && sf.so === 0 && heldSo === 1 && sh3 === 1);
  /* D: drag ♥ to locus 31, and never onto Bmp6; then ◆ to locus 30, never onto Bmp6 or ♥ (at 31 now); drag ◐ to the top of the surface;
     the toggles */
  SD.done = true; SD.waiting = false; openRound(SD); setC(SD, { at: 20, pat: 21, inv: 0, start: 0, v: 0.4 }); D_paint();
  const dv = document.getElementById("D_genes"), dr = dv.getBoundingClientRect(), dk = dr.width / GN.W, dsy = +dv.dataset.cssH - 42;
  const dat = g => ({ clientX: dr.left + (GN.px + (g + 0.5) * GN.pw / L) * dk, clientY: dr.top + (dsy - 25) * dk, pointerId: 1, bubbles: true });
  const dragD = path => { dv.dispatchEvent(new PointerEvent("pointerdown", dat(path[0]))); for (const g of path.slice(1)) dv.dispatchEvent(new PointerEvent("pointermove", dat(g))); dv.dispatchEvent(new PointerEvent("pointerup", dat(path[path.length - 1]))); };
  dv.dispatchEvent(new PointerEvent("pointerdown", dat(20))); dv.dispatchEvent(new PointerEvent("pointermove", dat(19))); const onFood = readSet(SD).at;
  dv.dispatchEvent(new PointerEvent("pointermove", dat(26))); dv.dispatchEvent(new PointerEvent("pointermove", dat(30))); dv.dispatchEvent(new PointerEvent("pointerup", dat(30)));
  dv.dispatchEvent(new PointerEvent("pointerdown", dat(21))); dv.dispatchEvent(new PointerEvent("pointermove", dat(19))); const pOnFood = readSet(SD).pat;
  dv.dispatchEvent(new PointerEvent("pointermove", dat(25))); dv.dispatchEvent(new PointerEvent("pointermove", dat(29))); dv.dispatchEvent(new PointerEvent("pointermove", dat(30))); dv.dispatchEvent(new PointerEvent("pointerup", dat(30)));
  const sp = readSet(SD);
  /* round 3 holds ♥ and frees ◆: a drag that starts on ♥ moves ◆ */
  SD.done = false; SD.round = 2; openRound(SD); syncStage(SD); dragD([20, 24, 27]); const r3 = readSet(SD);
  SD.done = true; openRound(SD); setC(SD, { at: 30, pat: 29 }); D_paint();
  const fv = document.getElementById("D_fit"), fr = fv.getBoundingClientRect(), fk = fr.width / DFt.W, hp = D_fitXY(0.4);
  const fat = y => ({ clientX: fr.left + hp.x * fk, clientY: fr.top + y * fk, pointerId: 2, bubbles: true });
  fv.dispatchEvent(new PointerEvent("pointerdown", fat(hp.y))); fv.dispatchEvent(new PointerEvent("pointermove", fat(D_fitXY(0.1).y))); fv.dispatchEvent(new PointerEvent("pointermove", fat(D_fitXY(0).y))); fv.dispatchEvent(new PointerEvent("pointerup", fat(D_fitXY(0).y)));
  const box = document.getElementById("D_invBox"); box.checked = true; box.dispatchEvent(new Event("change"));
  const sm = document.getElementById("D_startS"); sm.checked = true; sm.dispatchEvent(new Event("change"));
  const s2 = readSet(SD);
  /* rounds that hold them: round 2 holds the inversion and frees the start; round 3 the other way */
  SD.done = false; SD.round = 1; openRound(SD); syncStage(SD); const h1 = box.disabled && !sm.disabled;
  SD.round = 2; openRound(SD); syncStage(SD); const h2 = !box.disabled && sm.disabled;
  check("controls: dragging ▲ along B's chromosome moves Bmp6 10 -> " + (s1.i + 1) + "; ♥ along D's stops short of Bmp6 (" + (onFood + 1) + ") and moves the throat gene 21 -> " + (sp.at + 1) + "; ◆ stops short of Bmp6 (" + (pOnFood + 1) + ") and of ♥ and moves the preference gene 22 -> " + (sp.pat + 1) + "; in round 3 a drag from ♥ moves ◆ (♥ " + (r3.at + 1) + ", ◆ " + (r3.pat + 1) + "); ◐ dragged up sets the valley 0.4 -> " + s2.v + "; the toggles set the inversion (" + s2.inv + ") and the start (" + s2.start + "); round 2 holds the inversion and frees the start (" + h1 + "), round 3 the other way (" + h2 + ")",
        s1.i === 14 && s1.j === 29 && onFood !== 19 && sp.at === 30 && pOnFood !== 19 && sp.pat === 29 && r3.at === 20 && r3.pat === 27 && s2.v === 0 && s2.inv === 1 && s2.start === 1 && h1 && h2);
  SD.done = true; openRound(SD);
  SC.done = true; openRound(SC); setC(SC, { cost: 0.5 }); C_PATHS.sync();
  const arrow = document.querySelector('#C_paths .paths-arrow[data-of="cost"]');
  check("controls: C's cost arrow is drawn as a negative (red) arrow (" + (arrow ? arrow.getAttribute("class") : "none") + ")", !!arrow && arrow.classList.contains("down"));
}
{
  /* the cards (JM, 2026-10-22): A's and B's carry no words, their picture right above the controls; a done stage's card says
     nothing; the practice box says "practice"; C's and D's fitness surfaces sit in the left column */
  const bare = ["A", "B", "C", "D"].map(K => { const c = document.querySelector("#stage" + K + " .tcard"), cv = c.querySelector("canvas");
    /* but B's and D's one sentence, over the picture (below) */
    const words = [...c.querySelectorAll(".ttext, ul.rules, p")].filter(e => !((e.id === "B_ttext" || e.id === "D_ttext") && e.nextElementSibling === cv));
    return !words.length && !!cv && cv.nextElementSibling === c.querySelector(".controls"); });
  /* C's and D's menus turn to the plot each round's picture is */
  const menus = [[SC, 2, "C_meas"], [SD, 1, "D_meas"]].map(([S, r, id]) => { S.done = false; S.round = r; document.getElementById(id).value = "hw"; openRound(S);
    const ok = document.getElementById(id).value === S.cfg.rounds[r].pic.meas; S.done = true; openRound(S); return ok; });
  const quiet = ["A", "B", "C", "D"].map(K => { syncStage(ST[K]); const t = document.getElementById(K + "_ttext"), r = document.getElementById(K + "_rules");
    return ST[K].done && (!t || t.textContent === "") && (!r || r.innerHTML === ""); });
  const prac = [...document.querySelectorAll(".practice-row label")].map(l => l.textContent.trim());
  const left = ["C_dmi", "D_fit"].map(id => { const e = document.getElementById(id); return e.closest(".col") === e.closest(".grid").querySelector(".col"); });
  check("cards: A, B, C and D wordless with the picture over the controls (" + bare.join(",") + "); C's and D's menus turn to the picture's plot (" + menus.join(",") + "); done cards say nothing (" + quiet.join(",") + "); practice boxes read " + JSON.stringify([...new Set(prac)]) + " (" + prac.length + "); C's and D's fitness surfaces in the left column (" + left.join(",") + ")",
        bare.every(Boolean) && menus.every(Boolean) && quiet.every(Boolean) && prac.length === 4 && prac.every(x => x === "practice") && left.every(Boolean));
  /* B's sentence (JM, 2026-10-23, late: "there is no visual cue that that option exists"): round 5 only, the one round the genes
     are open; and what it says is so: a drag moves ▲ in round 5, not in round 4, where the genes are held */
  const bt = document.getElementById("B_ttext"), cv = document.getElementById("B_genes");
  const dragB = () => { B_paint(); const r = cv.getBoundingClientRect(), k = r.width / GN.W, sy = +cv.dataset.cssH - 42;
    const at = g => ({ clientX: r.left + (GN.px + (g + 0.5) * GN.pw / L) * k, clientY: r.top + sy * k, pointerId: 1, bubbles: true });
    cv.dispatchEvent(new PointerEvent("pointerdown", at(9))); cv.dispatchEvent(new PointerEvent("pointermove", at(12))); cv.dispatchEvent(new PointerEvent("pointerup", at(12)));
    return readSet(SB).i; };
  const said = [0, 1, 2, 3, 4].map(r => { SB.done = false; SB.waiting = false; SB.round = r; openRound(SB); syncStage(SB); return bt.textContent; });
  const moved5 = dragB(); SB.round = 3; openRound(SB); syncStage(SB); const moved4 = dragB();
  SB.round = 4; SB.done = true; openRound(SB); syncStage(SB);
  check("cards: B's sentence on the drag shows in round 5 only (" + said.map(t => t ? "text" : "-").join(",") + "; done: " + (bt.textContent ? "text" : "-") + "), \\"" + said[4] + "\\"; a drag moves ▲ 10 -> " + (moved5 + 1) + " in round 5, " + (moved4 + 1) + " in round 4",
        said.slice(0, 4).every(t => t === "") && /^Slide the square and triangle symbols on the FST across the genome plot/.test(said[4]) && bt.textContent === "" && moved5 === 12 && moved4 === 9);
  /* D's: round 3 only, the one round ◆ is open (its drag is tested with the controls) */
  const dt = document.getElementById("D_ttext");
  const saidD = [0, 1, 2, 3].map(r => { SD.done = false; SD.waiting = false; SD.round = r; openRound(SD); syncStage(SD); return dt.textContent; });
  SD.round = 3; SD.done = true; openRound(SD); syncStage(SD);
  check("cards: D's sentence on the preference gene shows in round 3 only (" + saidD.map(t => t ? "text" : "-").join(",") + "; done: " + (dt.textContent ? "text" : "-") + "), \\"" + saidD[2] + "\\"",
        saidD[0] === "" && saidD[1] === "" && saidD[3] === "" && /^Adjust the position of the preference locus on the FST across the genome plot at left/.test(saidD[2]) && dt.textContent === "");
}
{
  /* hover text: every mark has words; hover shows them and moving off hides them; the hybrid box closed at load */
  const infos = [...document.querySelectorAll(".info")], tipOf = e => e.dataset.tip ? document.getElementById(e.dataset.tip) : e.querySelector(".tip");
  const empty = infos.filter(e => !tipOf(e) || !tipOf(e).textContent.trim()).length, pop = document.querySelector(".tip-pop");
  const perStage = "A,B,C,D".split(",").map(K => document.querySelectorAll("#stage" + K + " .info").length);
  const ev = (e, type) => e.dispatchEvent(new MouseEvent(type, { bubbles: true }));
  ev(infos[0], "mouseover"); const shown = !pop.hidden && pop.textContent === tipOf(infos[0]).textContent; ev(document.body, "mouseover"); const gone = pop.hidden;
  const hy = document.getElementById("C_hyBox");
  const voices = "A,B,C,D".split(",").map(K => { const v = document.querySelector("#stage" + K + " > .stage-intro .voice"); return v ? v.textContent.trim().split(/\\s+/).length : 0; });
  check("hover text: no bullet list; JM's intro in every stage (" + voices.join("/") + " words); " + infos.length + " marks (" + perStage.join("/") + " a stage), " + empty + " empty; hover shows, off hides; the hybrid box closed at load",
        document.querySelectorAll("ul.setup").length === 0 && voices.every(n => n > 60) && empty === 0 && perStage.every(n => n >= 3) && shown && gone && hy.matches("details.opt") && !hy.open);
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
