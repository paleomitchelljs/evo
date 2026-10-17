#!/usr/bin/env node
/*
 * check_lesson19_numbers.js -- the checks for app/lessons/lesson19.html.
 *
 * Lesson 19 is a draft (first pass, 2026-10-17, from JM's brief the same
 * day): speciation on lesson 17's engine. A a grey population splits, each
 * half takes mutations in its own colour, incompatible pairs build up and
 * hold the two apart in contact or not; B two incompatible pairs and an
 * inversion; C a choosy allele where the two meet. What has to hold:
 *
 *   Engine. The split starts grey; apart, each population carries only its
 *      own colour and every genome there has fitness 1 (a pair costs
 *      nothing until the two meet); a genome's incompatible pairs agree
 *      with the list counted by hand; mutation runs at mu a gene, never at
 *      gene 1, always in the population's colour; with one inverted and one
 *      standard chromosome no crossover falls inside the inversion, and the
 *      gamete takes the arrangement of the chromosome that gave it the
 *      inversion's first gene, while two inverted chromosomes cross over
 *      inside as usual; B's pairs halve fitness and a chromosome blue at a
 *      pair's first gene and orange at its second fits both populations;
 *      a choosy population of two looks makes almost no mixed young and an
 *      unchoosy one about half; gene 20 gives 1, .75, .5.
 *   A. practice is free play; a round holds its settings and measure and
 *      Go waits for a drawing; one drag sets every dot and Clear takes them
 *      away; each round's median is inside its cloud, one straight line is
 *      not, and "it holds at contact" misses where the two fuse; the cloud
 *      stays on its axis; hybrid fitness falls with time apart; incompatible
 *      pairs grow faster than the mutations do; every run is two dots on
 *      your runs; a practice drawing is a row and no bit.
 *   B. each round holds what it says; each target hit by its setting and
 *      missed by the opening and the near misses (an inversion over one
 *      gene of the pair, or over none); with the inversion across both
 *      genes no chromosome that fits both ever forms, without it they do;
 *      dragging across the strip sets the inversion and a click on it
 *      takes it away.
 *   C. the choosy allele is absent apart and 1 in 5 at contact; the two
 *      targets hit and missed as measured; few young of mixed parents
 *      once it is common.
 *   Flow. A: four drawn rounds, each scored once (half the dots inside or
 *      more), its count in the notes, Next round after each; A waits for
 *      five times apart. B, C: a miss records 0 and the target stays; hits
 *      open Next target; C waits for six runs. Every bit written.
 *   All. every canvas fits its panel (1500 and 1000 wide); the three R
 *      panels run (Rscript; shortened).
 *
 * Same harness as check_lesson17_numbers.js.
 *
 * Usage:  node scripts/check_lesson19_numbers.js      (~4 minutes)
 * Exit 0 iff every check passes. Needs Google Chrome and python3; Rscript
 * for the R panels (skipped, and said so, without it).
 */
const { spawn, spawnSync } = require("child_process");
const fs = require("fs"), path = require("path");

const ROOT = path.resolve(__dirname, "..");
const PORT = +process.env.PORT || 8799;
const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

const CANVAS_IDS = ["A_board","A_time","A_grid","A_runs","B_board","B_genes","B_time","B_sparrow","C_board","C_time","C_runs"];
const INNER = `
const L_=[], say=s=>L_.push(s);
let bad=0, ran=0;
const check=(name, ok, detail)=>{ ran++; if(!ok) bad++; say((ok?"ok   ":"FAIL ")+name+(detail?"  -- "+detail:"")); };
for (const s of ["A","B","C"]) document.getElementById("stage"+s).classList.remove("stage-locked");
for (const k in Gates) Gates[k].open = true;
const setC = (S, o) => { for (const k in o) { const c = S.cfg.ctl.find(c => c.key === k), i = c.vals.indexOf(o[k]); if (i < 0) throw new Error(S.K + ": no " + k + " = " + o[k] + " on the slider"); document.getElementById(S.K + "_" + k).value = i; } syncVals(S); };
/* a setting played n times as practice against round r: the summaries at the end and at contact */
const play = (S, r, o, n) => { S.round = r; S.waiting = false; S.done = false; document.getElementById(S.K + "_practice").checked = true; openRound(S); setC(S, o);
  const out = []; for (let k = 0; k < (n || 2); k++) { goStage(S); finishNow(S); out.push({ S: sumAt(S.last, S.last.G), C: contactSum(S.last) }); } return out; };
const hits = (S, r, o, n) => play(S, r, o, n).map(x => judge(S.cfg.rounds[r], x.S, x.C));
const show = o => JSON.stringify(o).replace(/"/g, "");
const tgt = (S, r, good, badOnes) => {
  const g = good.map(o => [o, hits(S, r, o)]), b = badOnes.map(o => [o, hits(S, r, o)]);
  const gOk = g.map(([o, js]) => [o, js.every(j => j.ok), js.map(j => j.vals.join("/")).join(", ")]), bOk = b.map(([o, js]) => [o, js.every(j => !j.ok), js.map(j => j.vals.join("/")).join(", ")]);
  check(S.K + " target " + (r + 1) + ": hit by " + gOk.map(x => show(x[0]) + " (" + x[2] + ")").join(", ") + "; missed by " + bOk.map(x => show(x[0]) + " (" + x[2] + ")").join(", "),
        gOk.every(x => x[1]) && bOk.every(x => x[1]), gOk.filter(x => !x[1]).map(x => "no hit " + show(x[0])).concat(bOk.filter(x => !x[1]).map(x => "hit " + show(x[0]))).join("; "));
};
const hues = F => { const s = new Set(); for (const g of F) for (const c of g) for (let i = 0; i < L; i++) s.add(c[i] & 7); return [...s].sort().join(""); };

/* ================= the engine ================= */
{
  const P = { N: 25, R: 1, mu: 0.004, cost: 0.5, clash: CLASH, m: 0.05, grey: true }, pr = { pops: mgStart(P, 7), rng: mulberry32(11) };
  check("engine: the split starts grey: colours in the two populations " + hues(pr.pops[0]) + " / " + hues(pr.pops[1]), hues(pr.pops[0]) === "0" && hues(pr.pops[1]) === "0");
  for (let t = 0; t < 120; t++) mgStep(P, pr, false);
  const fit = pr.pops.map((F, k) => F.every(g => mgFit(P, g, k) === 1));
  check("engine: 120 generations apart, the orange population carries grey and orange only (" + hues(pr.pops[0]) + "), the blue grey and blue only (" + hues(pr.pops[1]) + "), and every genome in both has fitness 1",
        /^0?1$/.test(hues(pr.pops[0])) && /^0?2$/.test(hues(pr.pops[1])) && fit.every(Boolean));
  /* incompatible pairs in hybrids, by the masks and by hand over the list */
  const rng = mulberry32(5); let agree = 0, tot = 0, some = 0;
  for (let r = 0; r < 200; r++) { const y = [mgGamete(P, pr.pops[0][r % 25], rng), mgGamete(P, pr.pops[1][(7 * r) % 25], rng)];
    const has = (i, h) => (y[0][i] & 7) === h || (y[1][i] & 7) === h, hand = CLASH.list.filter(([i, j]) => has(i, 1) && has(j, 2)).length, n = mgClashes(P, y);
    if (n === hand) agree++; if (n > 0) some++; tot++;
    if (Math.abs(mgFit(P, y, 0) - Math.pow(0.5, hand)) > 1e-12) agree--; }
  check("engine: a hybrid's incompatible pairs agree with the list counted by hand, and its fitness is 0.5 per pair (" + agree + " of " + tot + " hybrids; " + some + " carry at least one; the list holds " + CLASH.list.length + ")",
        agree === tot && some > 50 && CLASH.list.length >= 24 && CLASH.list.length <= 32 && CLASH.list.every(([i, j]) => i !== j && i !== 0 && j !== 0 && i !== 19 && j !== 19));
  /* mutation: mu a gene; never gene 1; the population's colour */
  const c0 = new Int32Array(L + 1), Pm = { mu: 0.004 }, mr = mulberry32(9); let n = 0, g1 = 0, wrong = 0; const T = 40000;
  for (let r = 0; r < T; r++) { const k = r % 2, c = mgMutate(Pm, c0, k, mr); for (let i = 0; i < L; i++) if (c[i] !== 0) { n++; if (i === 0) g1++; if ((c[i] & 7) !== k + 1) wrong++; } }
  const want = 39 * 0.004;
  check("engine: mutation, " + (n / T).toFixed(4) + " new alleles a chromosome a generation (39 genes x 0.004 = " + want.toFixed(4) + "); none at gene 1; all in the population's colour", Math.abs(n / T - want) < 0.008 && g1 === 0 && wrong === 0);
  /* the inversion: genes 8-17 (7..16), crossing over at R 8 */
  const Pi = { R: 8, inv: [7, 16] }, A = new Int32Array(L + 1).fill(1), B = new Int32Array(L + 1).fill(2); A[L] = 0; B[L] = 1;
  const Bi = new Int32Array(L + 1).fill(3); Bi[L] = 1;
  const ir = mulberry32(13); let split = 0, arrOk = 0, outside = 0, homoSplit = 0;
  for (let r = 0; r < 4000; r++) {
    const gm = mgGamete(Pi, [A, B], ir), inside = new Set(); for (let i = 7; i <= 16; i++) inside.add(gm[i]);
    if (inside.size > 1) split++; if (gm[L] === (gm[7] === 1 ? 0 : 1)) arrOk++; if (gm[0] !== gm[39]) outside++;
    const hm = mgGamete(Pi, [B, Bi], ir), hin = new Set(); for (let i = 7; i <= 16; i++) hin.add(hm[i]); if (hin.size > 1) homoSplit++;
  }
  check("engine: one inverted, one standard: of 4000 gametes none mixes the two inside genes 8-17 (" + split + "), each takes the arrangement of the chromosome that gave it gene 8 (" + arrOk + "), and outside they still cross over (" + outside + " differ at the two ends); two inverted cross over inside (" + homoSplit + ")",
        split === 0 && arrOk === 4000 && outside > 1000 && homoSplit > 1000);
  /* B's pairs */
  const PB = { cost: 0.5, clash: B_CLASH }, mk = f => { const c = new Int32Array(L + 1); for (let i = 0; i < L; i++) c[i] = f(i); return c; };
  const O = mk(() => mgAl(1, 3, 1)), Bl = mk(() => mgAl(2, 3, 2)), bridge = mk(i => i === 9 || i === 29 ? mgAl(2, 3, 2) : mgAl(1, 3, 1));
  const w = [mgFit(PB, [O, O], 0), mgFit(PB, [O, Bl], 0), mgFit(PB, [bridge, O], 0), mgFit(PB, [bridge, Bl], 1)];
  const one = mk(i => i === 14 ? mgAl(2, 3, 2) : mgAl(1, 3, 1)), w1 = mgFit(PB, [one, O], 0);
  check("engine: B's pairs: all orange " + w[0] + ", a first hybrid (both pairs) " + w[1] + ", one pair (blue at 15 only) " + w1 + "; a chromosome blue at 10 and 30, orange elsewhere, fits beside orange (" + w[2] + ") and beside blue (" + w[3] + ")",
        w[0] === 1 && w[1] === 0.25 && w1 === 0.5 && w[2] === 1 && w[3] === 1);
  /* the choosy allele: two looks in one population */
  const twoLooks = choosy => { const Pc = { N: 100, R: 1, mu: 0, choose: true }, F = [];
    for (let i = 0; i < 100; i++) { const c = mk(j => j === 0 ? (choosy ? mgAl(CHOOSY, 3, 7) : 0) : i < 50 ? mgAl(1, 3, 1) : mgAl(2, 3, 2)); F.push([c, c]); }
    const pr2 = { pops: [F, F.slice()], rng: mulberry32(21), born: 0, mixed: 0 }; mgStep(Pc, pr2, false); return pr2.mixed / pr2.born; };
  const mc = twoLooks(true), mn = twoLooks(false);
  check("engine: half orange-looking, half blue-looking: young of mixed parents " + pc(mc) + " when all are choosy, " + pc(mn) + " when none is", mc < 0.03 && mn > 0.35 && mn < 0.65);
  const PC = { g20: 0.5 }, own = mk(i => i === 19 ? mgAl(1, 3, 1) : 0), away = mk(i => i === 19 ? mgAl(2, 3, 1) : 0);
  const g20 = [mgFit(PC, [own, own], 0), mgFit(PC, [own, away], 0), mgFit(PC, [away, away], 0), mgFit(PC, [away, away], 1)];
  check("engine: gene 20 in the orange population, the blue allele 0 / 1 / 2 copies: " + g20.slice(0, 3).join(" / ") + "; two blue in the blue population " + g20[3], g20.join() === "1,0.75,0.5,1");
}

/* ================= A ================= */
/* practice (free play) at a round's settings: the 50 pairs' median at each dot, and how drawings score against the run */
const A_run = (G, m, meas) => { SA.done = false; SA.waiting = false; document.getElementById("A_practice").checked = true; openRound(SA); setC(SA, { G, m });
  document.getElementById("A_meas").value = meas; AX.pred = null; goStage(SA); finishNow(SA); return SA.last; };
const A_median = (q, meas) => A_knots(q.G).map(t => { const s = q.hist.find(h => h.t === t); return qtl(s.pairs.map(p => MEAS_A[meas].vals(p)[0]).sort((a, b) => a - b), 0.5); });
const A_score = (q, meas, ys) => { const r = A_inside(q, { meas, G: q.G, ys }); return r.k / r.n; };
{
  const S = SA; S.round = 0; S.results = []; S.done = false; S.waiting = false; S.last = null; AX.pred = null;
  const prac = document.getElementById("A_practice"); prac.checked = true; openRound(S); A_paint();
  const free = document.getElementById("A_G").dataset.held === "" && !document.getElementById("A_meas").disabled && document.getElementById("A_go").textContent === "Practice run" && !document.getElementById("A_go").disabled;
  prac.checked = false; prac.dispatchEvent(new Event("change"));
  const set = readSet(S), held = document.getElementById("A_G").dataset.held === "1" && document.getElementById("A_m").dataset.held === "1", meas = document.getElementById("A_meas");
  const blocked = document.getElementById("A_go").disabled;
  check("A: practice ticked at the start is free play (" + free + "); unticked, round 1 holds 200 apart and m .05 (" + set.G + ", " + set.m + ", held " + held + "), shows hybrid fitness and holds it (" + meas.value + ", " + meas.disabled + "), and Go waits for a drawing (" + blocked + ")",
        free && set.G === 200 && set.m === 0.05 && held && meas.value === "w" && meas.disabled && blocked);
  /* draw by dragging across the plot: a flat line at 0.5 */
  const cv = document.getElementById("A_time"), r = cv.getBoundingClientRect(), F = cv._tf, k = r.width / TM.W;
  const at = (t, v) => ({ clientX: r.left + (F.T.px + t / F.G * F.T.pw) * k, clientY: r.top + (F.T.py + F.T.ph - v / F.ymax * F.T.ph) * k, pointerId: 1, bubbles: true });
  cv.dispatchEvent(new PointerEvent("pointerdown", at(0, 0.5))); cv.dispatchEvent(new PointerEvent("pointermove", at(140, 0.5))); cv.dispatchEvent(new PointerEvent("pointermove", at(300, 0.5))); cv.dispatchEvent(new PointerEvent("pointerup", at(300, 0.5)));
  const pd = A_pred(), go = !document.getElementById("A_go").disabled;
  check("A: one drag across the plot sets all " + (pd ? pd.ys.length : 0) + " dots (" + (pd ? pd.ys.map(v => v == null ? "-" : v.toFixed(2)).join(" ") : "none") + ") and Go is free",
        !!pd && pd.ys.length === 13 && pd.ys.every(v => v != null && Math.abs(v - 0.5) < 0.02) && go);
  document.getElementById("A_clear").click();
  check("A: Clear drawing takes it away and Go waits again", !A_pred() && document.getElementById("A_go").disabled);
}
/* each round's cloud: the median inside; the naive drawings out */
const A_good = [];
{
  const R = [[200, 0.05, "w"], [50, 0.1, "fst"], [150, 0.05, "fst"], [150, 0.2, "fst"]].map(([G, m, meas]) => {
    const q = A_run(G, m, meas), md = A_median(q, meas), K = A_knots(q.G), iC = K.indexOf(q.apart), end = md[md.length - 1];
    A_good.push(md);
    return { G, m, meas, med: A_score(q, meas, md), line: A_score(q, meas, K.map(t => md[0] + (end - md[0]) * t / q.G)), flat: A_score(q, meas, K.map((t, i) => t <= q.apart ? md[i] : md[iC])) };
  });
  check("A: each round's own median is inside its cloud (" + R.map(x => x.med.toFixed(2)).join(" / ") + ")", R.every(x => x.med === 1));
  check("A: one straight line from start to end misses the F_ST rounds' clouds (inside " + R.slice(1).map(x => x.line.toFixed(2)).join(" / ") + ") and much of the hybrid fitness one (" + R[0].line.toFixed(2) + ")",
        R.slice(1).every(x => x.line <= 0.8) && R.slice(1).some(x => x.line <= 0.5) && R[0].line <= 0.8);
  check("A: 'holds at its contact value' misses where the two fuse (50 apart, m .1: " + R[1].flat.toFixed(2) + ", m .2 " + R[3].flat.toFixed(2) + ") and fits where they mostly hold (150 apart, m .05: " + R[2].flat.toFixed(2) + ")",
        R[1].flat <= 0.6 && R[3].flat <= 0.75 && R[2].flat >= 0.8);
  const q = A_run(200, 0.05, "inc"), hiMax = Math.max(...q.hist.map(h => A_band(q, "inc", h.t).hi));
  check("A: incompatible pairs, 200 apart: the cloud stays on its axis (highest " + hiMax.toFixed(1) + " of " + MEAS_A.inc.ymax + ")", hiMax <= MEAS_A.inc.ymax);
}
{
  const n0 = AX.dots.length, c = [25, 50, 100, 200].map(G => contactSum(A_run(G, 0.05, "fst")));
  check("A: hybrid fitness at contact falls with time apart (25 / 50 / 100 / 200: " + c.map(x => x.w.toFixed(2)).join(" / ") + ")", c.every((x, i) => i === 0 || x.w < c[i - 1].w));
  const mut = (c[3].mut[0] + c[3].mut[1]) / (c[2].mut[0] + c[2].mut[1]), inc = c[3].inc / c[2].inc, kp = c[3].kp / c[2].kp;
  check("A: from 100 to 200 generations apart, mutations a chromosome grow " + mut.toFixed(2) + "x, pairs of them in a hybrid " + kp.toFixed(2) + "x, incompatible pairs " + inc.toFixed(2) + "x (the snowball)",
        mut > 1.4 && mut < 2.1 && inc > 1.25 * mut && kp > 1.25 * mut);
  check("A: every run, practice too, adds its two dots to your runs (" + n0 + " -> " + AX.dots.length + ")", AX.dots.length === n0 + 4);
  /* a practice run with a drawing: a practice row, no bit */
  const rows0 = AX.rows.length; SA.done = false; document.getElementById("A_practice").checked = true; openRound(SA); setC(SA, { G: 50, m: 0.1 }); document.getElementById("A_meas").value = "fst";
  AX.pred = { meas: "fst", G: 150, ys: A_good[1].slice() }; goStage(SA); finishNow(SA);
  const row = AX.rows[rows0];
  check("A: a practice run with a drawing adds a practice row (" + (row ? row.k + " of " + row.n : "none") + ") and writes no bit", AX.rows.length === rows0 + 1 && row.practice && [0, 1, 2, 3].every(i => !Score.isAnswered("scaffold", BIT["A" + (i + 1)])));
}

/* ================= B ================= */
{
  const held = [0, 1, 2].map(r => { SB.round = r; SB.done = false; openRound(SB); const s = readSet(SB), h = k => document.getElementById("B_" + k).dataset.held === "1";
    return r === 0 ? s.R === 4 && s.m === 0.02 && h("R") && h("m") && !h("ia") : r === 1 ? s.ia === 7 && s.ib === 16 && s.R === 4 && h("ia") && h("R") && !h("m") : s.ia === -1 && s.m === 0.02 && h("ia") && h("m") && !h("R"); });
  check("B: round 1 holds R 4 and m .02; round 2 the inversion across 8-17 and R 4; round 3 no inversion and m .02 (" + held.join(", ") + ")", held.every(Boolean));
}
/* an inversion over gene 15 alone (genes 14-23) still lets crossing over through four of the five gaps between 10 and 15; over genes
   11-20 it leaves only one, holds in part (.41-.66 measured) and is not asserted */
tgt(SB, 0, [{ ia: 9, ib: 14 }, { ia: 7, ib: 16 }], [{ ia: -1 }, { ia: 13, ib: 22 }, { ia: 4, ib: 11 }, { ia: 0, ib: 7 }]);
tgt(SB, 1, [{ m: 0.05 }, { m: 0.1 }], [{ m: 0.02 }, { m: 0.01 }]);
tgt(SB, 2, [{ R: 0.5 }, { R: 0.25 }], [{ R: 2 }, { R: 4 }, { R: 8 }]);
{
  const inv = play(SB, 0, { ia: 7, ib: 16 }, 1)[0].S, none = play(SB, 0, { ia: -1 }, 1)[0].S;
  /* in every snapshot of the inverted run, not one chromosome blue at 10 and orange at 15 */
  play(SB, 0, { ia: 7, ib: 16 }, 1); const maxInv = Math.max(...SB.last.hist.flatMap(h => h.pairs.map(p => p.br[0])));
  check("B: across both genes, no chromosome that fits both populations ever forms (most in any pair at any time " + maxInv + "); without the inversion they do (" + pc(none.br[0]) + " at 100)", maxInv === 0 && inv.br[0] === 0 && none.br[0] > 0.05);
  /* the strip: drag from gene 5 to 18, then click inside to take it away */
  SB.round = 0; SB.done = true; SB.waiting = false; openRound(SB); B_paint();
  const cv = document.getElementById("B_genes"), r = cv.getBoundingClientRect(), k = r.width / BGn.W;
  const at = (g, y) => ({ clientX: r.left + (BGn.px + (g + 0.5) * BGn.pw / L) * k, clientY: r.top + y * k, pointerId: 1, bubbles: true });
  const y = BGn.stripY + BGn.stripH / 2;
  cv.dispatchEvent(new PointerEvent("pointerdown", at(4, y))); cv.dispatchEvent(new PointerEvent("pointermove", at(10, y))); cv.dispatchEvent(new PointerEvent("pointermove", at(17, y))); cv.dispatchEvent(new PointerEvent("pointerup", at(17, y)));
  const s1 = readSet(SB), line1 = document.getElementById("B_invLine").textContent;
  cv.dispatchEvent(new PointerEvent("pointerdown", at(9, y))); cv.dispatchEvent(new PointerEvent("pointerup", at(9, y)));
  const s2 = readSet(SB);
  check("B: dragging across the strip from gene 5 to 18 inverts 5-18 (" + s1.ia + "-" + s1.ib + ", '" + line1 + "'); a click on it takes it away (" + s2.ia + ")",
        s1.ia === 4 && s1.ib === 17 && /genes 5 to 18/.test(line1) && s2.ia === -1);
  SB.done = false;
}

/* ================= C ================= */
{
  const r = play(SC, 0, { G: 200, m: 0.2 }, 1)[0], q = SC.last, before = q.hist.filter(h => h.t < q.apart).every(h => h.pairs.every(p => p.ch == null)), c = q.contact.pairs.map(p => p.ch), cm = meanOf(c);
  check("C: no choosy allele while apart (" + before + "); at contact " + pc(cm) + " of chromosomes carry it (1 in 5); young whose parents look different at the end " + pc(r.S.mixed),
        before && cm > 0.17 && cm < 0.23 && r.S.mixed < 0.05);
}
tgt(SC, 0, [{ m: 0.2 }], [{ m: 0.05 }, { m: 0 }]);
tgt(SC, 1, [{ G: 0 }], [{ G: 100 }, { G: 200 }]);

/* ================= the flow, scored ================= */
{
  /* a miss first, then each round's intended setting; the bits as recorded */
  const flow = (S, missing, intended) => {
    S.round = 0; S.results = []; S.done = false; S.waiting = false; S.last = null; document.getElementById(S.K + "_practice").checked = false; openRound(S); syncStage(S);
    setC(S, missing); goStage(S); finishNow(S); const miss = Score.getBit("scaffold", BIT[S.K + "1"]) === 0 && !S.waiting;
    for (let r = 0; r < intended.length; r++) {
      setC(S, intended[r]); goStage(S); finishNow(S);
      if (r < intended.length - 1) { const shown = !document.getElementById(S.K + "_next").hidden; nextRound(S); if (!shown) return { miss, bits: "next hidden at " + r }; }
    }
    return { miss, bits: intended.map((_, r) => Score.getBit("scaffold", BIT[S.K + (r + 1)])).join("") };
  };
  /* A: four drawn rounds, each scored once: the median of a practice run at the round's settings (good) in rounds 1, 3 and 4,
     a flat line at 1 in round 2 (bad); bits 1 when half the dots or more are inside */
  {
    const S = SA; S.round = 0; S.results = []; S.done = false; S.waiting = false; S.last = null; AX.dots = []; AX.rows = [];
    document.getElementById("A_practice").checked = false; openRound(S); A_paint();
    const got = [], notes = [], nextShown = [];
    for (let r = 0; r < 4; r++) {
      const G = readSet(S).G + A_CONTACT, n = A_knots(G).length;
      AX.pred = { meas: ruleOf(S).meas, G, ys: r === 1 ? Array(n).fill(1) : A_good[r].slice() };
      goStage(S); finishNow(S);
      got.push(Score.getBit("scaffold", BIT["A" + (r + 1)])); notes.push(Score.getNote("A_in" + (r + 1)));
      if (r < 3) { nextShown.push(!document.getElementById("A_next").hidden); nextRound(S); }
    }
    const rows = AX.rows.filter(x => !x.practice), noteOk = rows.every((x, i) => notes[i] === x.k + "of" + x.n);
    const waitA = S.done && !Gates.A.done;
    for (const G of [0, 25, 100]) { setC(S, { G }); goStage(S); finishNow(S); }
    check("A flow: four drawn rounds, each once (bits " + got.join("") + ", notes " + notes.join(" ") + "); Next round after each (" + nextShown.join(",") + "); A waits for five times apart (" + waitA + "), then opens B",
          got.join("") === "1011" && noteOk && rows.length === 4 && nextShown.every(Boolean) && waitA && Gates.A.done);
  }
  const b = flow(SB, { ia: -1 }, [{ ia: 9, ib: 14 }, { m: 0.05 }, { R: 0.5 }]);
  check("B flow: a miss records 0; three hits (bits " + b.bits + ") open C", b.miss && b.bits === "011" && Gates.B.done);
  CX.dots = [];
  const c = flow(SC, { m: 0.02 }, [{ m: 0.2 }, { G: 0 }]);
  const waitC = !Gates.C.done;
  while (CX.dots.length < 6) { goStage(SC); finishNow(SC); }
  check("C flow: a miss records 0; two hits (bits " + c.bits + "); C waits for six runs (" + waitC + "), then the lesson ends", c.miss && c.bits === "01" && waitC && Gates.C.done && document.getElementById("done-banner").classList.contains("shown"));
}
{
  const D = Object.keys(BIT).length; let n = 0; for (let i = 0; i < D; i++) if (Score.isAnswered("scaffold", i)) n++;
  check("all " + D + " declared bits written", D === 9 && n === D, n + " written");
}
{
  FIT_EPOCH++; paintAll();
  const over = [];
  for (const id of ${JSON.stringify(CANVAS_IDS)}) { const cv = document.getElementById(id), host = cv.parentElement;
    if (+cv.dataset.drawW > host.clientWidth + 1) over.push(id + " " + cv.dataset.drawW + ">" + host.clientWidth); }
  check("every canvas fits its panel (" + window.innerWidth + " wide)", over.length === 0, over.join(", "));
}
{
  /* the layout (JM, 2026-10-17, on lesson 17): the R code last in each stage and closed; no summary line under a board or
     plot; the sparrows under B's grid, not in it */
  const last = ["A", "B", "C"].map(K => { const els = document.querySelectorAll("#stage" + K + " .panel"), el = els[els.length - 1]; return el.matches("details.rcode") && !el.open && !!el.querySelector("#code" + K) && !!el.querySelector("#" + K + "_dl"); });
  const reads = document.querySelectorAll(".readout").length, sp = document.getElementById("B_sparrow");
  check("layout: each stage ends in its R code, closed (" + last.join(",") + "); no readout lines (" + reads + "); the sparrows sit under B's grid",
        last.every(Boolean) && reads === 0 && !!sp.closest(".tail") && !sp.closest(".grid"));
}
A_code(); B_code(); C_code();
say(bad ? ("FAILED " + bad) : "ALL BARS PASS");
say("RAN " + ran);
say("RA " + RTEXT.codeA.replace(/\\n/g, "\\\\n"));
say("RB " + RTEXT.codeB.replace(/\\n/g, "\\\\n"));
say("RC " + RTEXT.codeC.replace(/\\n/g, "\\\\n"));
L_.join(" ;; ");
`;

const INNER_NARROW = `
for (const s of ["A","B","C"]) document.getElementById("stage"+s).classList.remove("stage-locked");
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
  const r = spawnSync(CHROME, ["--headless=new", "--disable-gpu", "--virtual-time-budget=2400000", "--dump-dom", `http://127.0.0.1:${PORT}/_check_l19_${PORT}.html`],
                      { encoding: "utf8", maxBuffer: 1 << 28 });
  const dec = s => s.replace(/&quot;/g, '"').replace(/&gt;/g, ">").replace(/&lt;/g, "<").replace(/&amp;/g, "&");
  const m = /<pre id="out">([\s\S]*?)<\/pre>/.exec(r.stdout || ""), m2 = /<pre id="out2">([\s\S]*?)<\/pre>/.exec(r.stdout || "");
  if (!m) { console.error("no result -- is Chrome at " + CHROME + " ?"); cleanup(); process.exit(2); }
  const text = dec(m[1]), lines = text.split(" ;; ");
  let bad = !/ALL BARS PASS/.test(text);
  const tagged = t => (lines.find(l => l.startsWith(t + " ")) || "").slice(t.length + 1).replace(/\\n/g, "\n");
  for (const line of lines) if (!/^(RA|RB|RC) /.test(line)) console.log(line);
  const reported = lines.filter(l => /^(ok|FAIL)\s/.test(l)).length;
  const ranLine = /^RAN (\d+)$/.exec((lines.find(l => /^RAN \d+$/.test(l)) || ""));
  if (!ranLine || +ranLine[1] !== reported) { console.log("FAIL harness  " + (ranLine ? ranLine[1] : "?") + " checks ran, " + reported + " came back"); bad = true; }
  const narrow = m2 ? dec(m2[1]) : "FAIL narrow frame gave nothing";
  console.log(narrow); if (!/^ok/.test(narrow)) bad = true;
  const rs = (code, tail) => spawnSync("Rscript", ["-e", code + (tail || "")], { encoding: "utf8", timeout: 240000 });
  const probeR = spawnSync("Rscript", ["--version"], { encoding: "utf8" });
  /* shortened: A 10 generations apart and 10 of contact; B 20 generations; C 30 genomes, 5 apart and 5 of contact */
  const shortA = s => s.replace(/^G <- \d+/m, "G <- 10").replace("1:(G + 100)", "1:(G + 10)");
  const shortB = s => s.replace("G <- 100", "G <- 20");
  const shortC = s => s.replace("N <- 100", "N <- 30").replace("Gc <- 150", "Gc <- 5").replace(/^G <- \d+/m, "G <- 5");
  if (probeR.error) console.log("skip R panels  (no Rscript)");
  else for (const [tag, name, fix] of [["RA", "A (10 apart, 10 in contact here)", shortA], ["RB", "B (20 generations here)", shortB], ["RC", "C (30 genomes, 5 + 5 generations here)", shortC]]) {
    const o = rs(fix(tagged(tag)), "\ncat('\\nOK\\n')");
    const ok = /OK/.test(o.stdout || "");
    console.log((ok ? "ok   " : "FAIL ") + "the R panel for " + name + " runs" + (ok ? "  -- " + (o.stdout || "").trim().split("\n").slice(-3, -1).join(" ").replace(/\s+/g, " ") : "  -- " + (o.stderr || "").slice(0, 300)));
    if (!ok) bad = true;
  }
  cleanup();
  process.exit(bad ? 1 : 0);
}, 700);
