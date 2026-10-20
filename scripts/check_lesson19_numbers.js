#!/usr/bin/env node
/*
 * check_lesson19_numbers.js -- the checks for app/lessons/lesson19.html.
 *
 * Lesson 19, pass 3 (2026-10-20, JM's brief that day): speciation as a
 * process. A ponds and floods (incompatibilities build by drift until the
 * floods stop mattering); B one incompatible pair placed on the chromosome;
 * C a trait (genotype -> looks -> chance to live, a pond each); D a choosy
 * allele at a locus the student places, with an inversion. What has to hold:
 *
 *   Engine. The split starts grey; with no floods each pond carries only
 *      grey and its own colour and every fish there lives (a pair costs
 *      nothing until the ponds meet); a hybrid's incompatible pairs agree
 *      with a count by hand and any one of them kills it; mutation runs at
 *      mu a locus; floods come only every T generations, about N m fish
 *      each; F_ST is 1 for two ponds with nothing in common and 0 for two
 *      the same; B's pair costs only with both alleles, and a chromosome
 *      blue at the first locus and orange at the second fits both ponds;
 *      C's chance to live follows the arrows and h for each look in each
 *      pond; D's inversion stops crossing over inside it in a fish with one
 *      inverted chromosome and not in a fish with two, and a gamete takes
 *      the arrangement of the chromosome that gave it the inversion's first
 *      locus; a choosy pond gives the look it prefers the births; the
 *      table's fitness is its chance to live times its births, re-derived
 *      here from the counts.
 *   Targets. Each round's intended setting hits it and its opening (and the
 *      near misses measured in the page's comments) miss it.
 *   Flow. A miss records 0 and the target stays; hits open Next target;
 *      each stage opens the next; the last ends the lesson; every bit
 *      written.
 *   Controls. B's two loci and D's choosy locus move by dragging along the
 *      chromosome; D's toggles write their inputs and are held when a round
 *      holds them; B's cost arrow is red (it lowers the chance to live).
 *   Layout. Each stage ends in its R code, closed; no readout lines; every
 *      hover mark has words; the hybrid box closed at load; every canvas
 *      fits its panel (1500 and 1000 wide); the four R panels run (Rscript,
 *      shortened).
 *
 * Same harness as check_lesson17_numbers.js.
 *
 * Usage:  node scripts/check_lesson19_numbers.js      (~6 minutes)
 * Exit 0 iff every check passes. Needs Google Chrome and python3; Rscript
 * for the R panels (skipped, and said so, without it).
 */
const { spawn, spawnSync } = require("child_process");
const fs = require("fs"), path = require("path");

const ROOT = path.resolve(__dirname, "..");
const PORT = +process.env.PORT || 8799;
const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

const CANVAS_IDS = ["A_board", "A_time", "A_grid", "B_board", "B_genes", "B_time", "C_board", "C_time", "C_surv", "C_got", "D_board", "D_genes", "D_time", "D_got"];
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
  const P = { N: 25, mu: 0.004, p: 0.02, R: 1, m: 0, T: 10, start: "grey" }, w = pdWorld(P, 7);
  check("engine: the split starts grey: kinds in the two ponds " + kinds(w, w.pops[0]) + " / " + kinds(w, w.pops[1]), kinds(w, w.pops[0]) === "0" && kinds(w, w.pops[1]) === "0");
  for (let t = 0; t < 150; t++) pdStep(P, w);
  const live = w.pops.map((F, k) => F.every(g => pdLive(P, w, g, k) === 1));
  check("engine: 150 generations with no floods, the orange pond carries grey and orange only (" + kinds(w, w.pops[0]) + "), the blue grey and blue only (" + kinds(w, w.pops[1]) + "), and every fish in both would live",
        /^0?1$/.test(kinds(w, w.pops[0])) && /^0?2$/.test(kinds(w, w.pops[1])) && live.every(Boolean));
  /* hybrids: their incompatible pairs counted by hand; one is enough to kill */
  const rng = mulberry32(5); let agree = 0, tot = 0, some = 0, dead = 0;
  for (let r = 0; r < 200; r++) { const y = [pdGamete(P, w.pops[0][r % 25], rng, null), pdGamete(P, w.pops[1][(7 * r) % 25], rng, null)];
    const o = new Set(), b = new Set(); for (const c of y) for (let i = 0; i < L; i++) { const k = w.kind[c[i]]; if (k === 1) o.add(c[i]); else if (k === 2) b.add(c[i]); }
    let hand = 0; for (const x of o) for (const z of b) if (w.loc[x] !== w.loc[z] && pdHash(Math.min(x, z), Math.max(x, z), w.salt) < P.p) hand++;
    const n = pdPairsA(P, w, y); if (n === hand) agree++; if (n > 0) some++; tot++; if ((pdLive(P, w, y, 0) === 0) === (hand > 0)) dead++; }
  check("engine: a hybrid's incompatible pairs agree with a count by hand (" + agree + " of " + tot + "; " + some + " carry one or more) and a hybrid lives exactly when it carries none (" + dead + " of " + tot + ")",
        agree === tot && dead === tot && some > 40);
  /* mutation */
  const Pm = { mu: 0.004 }, wm = pdWorld({ N: 1, start: "grey", R: 1 }, 3), c0 = wm.pops[0][0][0]; let n = 0; const T = 30000;
  for (let r = 0; r < T; r++) { const c = pdMutate(Pm, wm, c0, r % 2); for (let i = 0; i < L; i++) if (c[i] !== c0[i]) { n++; if (wm.kind[c[i]] !== r % 2 + 1) n -= 1000; } }
  check("engine: mutation, " + (n / T).toFixed(4) + " new alleles a chromosome a generation (40 x 0.004 = 0.16), each in its pond's colour", Math.abs(n / T - 0.16) < 0.008);
  /* floods */
  const Pf = { N: 50, mu: 0, R: 1, m: 0.2, T: 10, start: "grey" }, wf = pdWorld(Pf, 9); let off = 0, sw = 0, nf = 0;
  for (let t = 1; t <= 300; t++) { pdStep(Pf, wf); if (t % 10) { if (wf.flood) off++; } else { nf++; sw += Math.max(0, wf.flood); } }
  check("engine: floods only every 10th generation (" + off + " between), " + (sw / nf).toFixed(1) + " fish swapped a flood (50 x 0.2 = 10)", off === 0 && Math.abs(sw / nf - 10) < 2);
  /* F_ST */
  const wa = pdWorld({ N: 25, start: "apart", R: 1 }, 4), fa = pdFst(wa, null).fst, wg = pdWorld({ N: 25, start: "grey", R: 1 }, 4); wg.pops[1] = wg.pops[0].map(g => g.map(c => c.slice()));
  check("engine: F_ST " + fa.toFixed(3) + " for two ponds with nothing in common, " + pdFst(wg, null).fst.toFixed(3) + " for two the same", Math.abs(fa - 1) < 1e-9 && Math.abs(pdFst(wg, null).fst) < 1e-9);
  /* B's pair */
  const PB = { N: 2, start: "apart", R: 1, pair: [9, 14], cost: 0.9 }, wb = pdWorld(PB, 2), Oc = wb.pops[0][0][0], Bc = wb.pops[1][0][0];
  const fits = Bc.slice(); fits[14] = Oc[14];
  const v = [pdLive(PB, wb, [Oc, Oc], 0), pdLive(PB, wb, [Oc, Bc], 0), pdLive(PB, wb, [fits, Oc], 0), pdLive(PB, wb, [fits, Bc], 1)];
  check("engine: B's pair at loci 10 and 15, cost 0.9: orange fish " + v[0] + ", a first hybrid " + v[1].toFixed(2) + "; a chromosome blue at 10 and orange at 15 beside orange " + v[2] + " and beside blue " + v[3],
        v[0] === 1 && Math.abs(v[1] - 0.1) < 1e-9 && v[2] === 1 && v[3] === 1);
  /* C's arrows */
  const PC = { N: 2, start: "grey", R: 1, trait: { at: 19, h: 0.25, b: [-0.5, 0.75], q0: [0, 1] } }, wc = pdWorld(PC, 2);
  const g = d => { const a = wc.pops[0][0][0].slice(), b = a.slice(); a[19] = d >= 1 ? wc.DARK : wc.LIGHT; b[19] = d >= 2 ? wc.DARK : wc.LIGHT; return [a, b]; };
  const got = [0, 1, 2].map(d => [pdLive(PC, wc, g(d), 0), pdLive(PC, wc, g(d), 1)].map(x => +x.toFixed(4)));
  const want = [[1, 0.25], [0.875, 0.4375], [0.5, 1]];
  check("engine: C, h 0.25, orange pond -0.5, blue pond +0.75: chance to live ○ ◐ ● " + got.map(x => x.join("/")).join(", ") + " (1 + b z or 1 - b (1 - z), z = 0, h, 1)", JSON.stringify(got) === JSON.stringify(want));
  /* D's inversion: loci 20-31 (19..30) */
  const PD = { R: 8, trait: { at: 19 }, pref: { at: 30 }, inv: true }, inv = pdInv(PD), A = new Int32Array(L + 1).fill(1), B2 = new Int32Array(L + 1).fill(2); A[L] = 0; B2[L] = 1;
  const Bi = new Int32Array(L + 1).fill(3); Bi[L] = 1; const ir = mulberry32(13); let split = 0, arrOk = 0, outside = 0, homo = 0;
  for (let r = 0; r < 4000; r++) {
    const gm = pdGamete(PD, [A, B2], ir, inv), ins = new Set(); for (let i = 19; i <= 30; i++) ins.add(gm[i]);
    if (ins.size > 1) split++; if (gm[L] === (gm[19] === 1 ? 0 : 1)) arrOk++; if (gm[0] !== gm[39]) outside++;
    const hm = pdGamete(PD, [B2, Bi], ir, inv), hin = new Set(); for (let i = 19; i <= 30; i++) hin.add(hm[i]); if (hin.size > 1) homo++; }
  check("engine: D's inversion over loci 20-31: one inverted, one standard, none of 4000 gametes mixes inside (" + split + "), each takes the arrangement of the chromosome that gave it locus 20 (" + arrOk + "), crossing over outside goes on (" + outside + "); two inverted cross over inside (" + homo + ")",
        split === 0 && arrOk === 4000 && outside > 1000 && homo > 1000);
  /* D's choice: half light, half dark, every fish choosy for dark (strength 1) or no one choosy */
  const births = choosy => { const Pc = { N: 100, R: 1, mu: 0, start: "grey", trait: { at: 19, h: 0.5, b: [0, 0], q0: [0, 0] }, pref: { at: 30, a: 1, want: 1, q0: [choosy ? 1 : 0, 0] } }, wd = pdWorld(Pc, 21);
    wd.pops[0].forEach((f, i) => { if (i >= 50) for (const c of f) c[19] = wd.DARK; }); pdStep(Pc, wd); const t = wd.gen[0]; return [t.births[0] / t.adults[0], t.births[2] / t.adults[2]]; };
  const bc = births(true), bn = births(false);
  check("engine: a pond half light, half dark: births a light / a dark fish " + bc.map(x => x.toFixed(2)).join(" / ") + " when every fish is choosy for dark, " + bn.map(x => x.toFixed(2)).join(" / ") + " when none is",
        bc[1] > 1.8 * bc[0] && Math.abs(bn[0] - bn[1]) < 0.4);
}

/* ================= the targets ================= */
tgt(SA, 0, [{ mu: 0.004 }, { mu: 0.006 }], [{ mu: 0.002 }, { mu: 0.001 }]);
tgt(SA, 1, [{ m: 0.1, T: 25 }, { m: 0.05, T: 25 }, { m: 0.1, T: 50 }], [{ m: 0.2, T: 25 }, { m: 0.3, T: 25 }]);
tgt(SA, 2, [{ T: 5 }, { m: 0.3 }, { p: 0 }], [{ p: 0.02, m: 0.2, T: 10 }]);
tgt(SA, 3, [{ N: 25 }, { N: 10 }], [{ N: 50 }]);
tgt(SB, 0, [{ i: 19, j: 20 }, { i: 18, j: 20 }], [{ i: 4, j: 35 }, { i: 14, j: 25 }]);
tgt(SB, 1, [{ cost: 1 }], [{ cost: 0.9 }, { cost: 0.75 }]);
tgt(SB, 2, [{ m: 0.2 }, { m: 0.3 }], [{ m: 0.1 }, { m: 0.05 }]);
tgt(SC, 0, [{ bo: -0.5, bb: 0.5 }, { bo: -1, bb: 1 }], [{ bo: 0, bb: 0 }, { bo: -0.25, bb: 0 }]);
tgt(SC, 1, [{ h: 0.75 }, { h: 1 }], [{ h: 0.5 }, { h: 0 }]);
tgt(SC, 2, [{ m: 0.2, T: 2 }], [{ m: 0.1, T: 2 }, { m: 0.05, T: 1 }]);
tgt(SD, 0, [{ want: 1 }], [{ want: 0 }]);
tgt(SD, 1, [{ inv: 1 }, { at: 30, inv: 1 }], [{ at: 38, inv: 0 }, { at: 25, inv: 0 }]);
tgt(SD, 2, [{ bo: -0.5 }], [{ bo: -1, bb: 1 }]);
{
  /* the table's fitness re-derived from the run's own counts: a young fish's chance to live x births a fish of its look, relative */
  play(SC, 0, { bo: -0.5, bb: 0.5 }, 1); const q = SC.last, G = gotOf(q), t0 = q.t - 19; let worst = 0, avg = [];
  [0, 1].forEach(k => { let born = [0, 0, 0], lived = [0, 0, 0], br = [0, 0, 0], ad = [0, 0, 0];
    for (const h of q.hist) if (h.t >= t0) for (const s of h.runs) for (let d = 0; d < 3; d++) { born[d] += s.trk[k][d]; lived[d] += s.trk[k][3 + d]; br[d] += s.trk[k][6 + d]; ad[d] += s.trk[k][9 + d]; }
    const bAll = (br[0] + br[1] + br[2]) / (ad[0] + ad[1] + ad[2]), f = [0, 1, 2].map(d => lived[d] / born[d] * (br[d] / ad[d] / bAll));
    const fbar = (f[0] * born[0] + f[1] * born[1] + f[2] * born[2]) / (born[0] + born[1] + born[2]);
    for (let d = 0; d < 3; d++) worst = Math.max(worst, Math.abs(f[d] / fbar - G[k].fr[d]));
    avg.push((G[k].fr[0] * born[0] + G[k].fr[1] * born[1] + G[k].fr[2] * born[2]) / (born[0] + born[1] + born[2])); });
  check("C's table: fitness re-derived from the counts agrees (worst gap " + worst.toExponential(1) + "); the average young's fitness is 1 in each pond (" + avg.map(x => x.toFixed(3)).join(" / ") + ")", worst < 1e-9 && avg.every(x => Math.abs(x - 1) < 1e-9));
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
  const a = flow(SA, { mu: 0.002 }, [{ mu: 0.004 }, { m: 0.05, T: 25 }, { T: 5 }, { N: 10 }]);
  check("A flow: a miss records 0; four hits (bits " + a.bits + ") open B", a.miss && a.bits === "0111" && Gates.A.done && Gates.B.open);
  const b = flow(SB, { i: 4, j: 35 }, [{ i: 19, j: 20 }, { cost: 1 }, { m: 0.3 }]);
  check("B flow: a miss records 0; three hits (bits " + b.bits + ") open C", b.miss && b.bits === "011" && Gates.B.done && Gates.C.open);
  const c = flow(SC, { bo: 0, bb: 0 }, [{ bo: -1, bb: 1 }, { h: 1 }, { m: 0.2, T: 2 }]);
  check("C flow: a miss records 0; three hits (bits " + c.bits + ") open D", c.miss && c.bits === "011" && Gates.C.done && Gates.D.open);
  const d = flow(SD, { want: 0 }, [{ want: 1 }, { inv: 1 }, { bo: -0.5 }]);
  check("D flow: a miss records 0; three hits (bits " + d.bits + ") end the lesson", d.miss && d.bits === "011" && Gates.D.done && document.getElementById("done-banner").classList.contains("shown"));
  const D = Object.keys(BIT).length; let n = 0; for (let i = 0; i < D; i++) if (Score.isAnswered("scaffold", i)) n++;
  check("all " + D + " declared bits written", D === 13 && n === D, n + " written");
}

/* ================= the controls ================= */
{
  /* B: drag ▲ from locus 5 to locus 12 along the chromosome */
  SB.done = true; SB.waiting = false; openRound(SB); setC(SB, { i: 4, j: 35 }); B_paint();
  const cv = document.getElementById("B_genes"), r = cv.getBoundingClientRect(), k = r.width / BGn.W;
  const at = g => ({ clientX: r.left + (BGn.px + (g + 0.5) * BGn.pw / L) * k, clientY: r.top + BGn.sy * k, pointerId: 1, bubbles: true });
  cv.dispatchEvent(new PointerEvent("pointerdown", at(4))); cv.dispatchEvent(new PointerEvent("pointermove", at(8))); cv.dispatchEvent(new PointerEvent("pointermove", at(11))); cv.dispatchEvent(new PointerEvent("pointerup", at(11)));
  const s1 = readSet(SB);
  /* D: drag ♥ to locus 31; the toggles */
  SD.done = true; SD.waiting = false; openRound(SD); setC(SD, { at: 20, inv: 0, want: 1 }); D_paint();
  const dv = document.getElementById("D_genes"), dr = dv.getBoundingClientRect(), dk = dr.width / DGn.W;
  const dat = g => ({ clientX: dr.left + (DGn.px + (g + 0.5) * DGn.pw / L) * dk, clientY: dr.top + (DGn.sy - 27) * dk, pointerId: 1, bubbles: true });
  dv.dispatchEvent(new PointerEvent("pointerdown", dat(20))); dv.dispatchEvent(new PointerEvent("pointermove", dat(26))); dv.dispatchEvent(new PointerEvent("pointermove", dat(30))); dv.dispatchEvent(new PointerEvent("pointerup", dat(30)));
  const box = document.getElementById("D_invBox"); box.checked = true; box.dispatchEvent(new Event("change"));
  const lt = document.getElementById("D_wantL"); lt.checked = true; lt.dispatchEvent(new Event("change"));
  const s2 = readSet(SD);
  /* a round that holds them: round 1 holds the inversion; round 2 holds the look */
  SD.done = false; SD.round = 0; openRound(SD); syncStage(SD); const h1 = box.disabled && !lt.disabled;
  SD.round = 1; openRound(SD); syncStage(SD); const h2 = !box.disabled && lt.disabled;
  check("controls: dragging ▲ along B's chromosome moves the orange allele's locus 5 -> " + (s1.i + 1) + "; dragging ♥ along D's moves the choosy locus 21 -> " + (s2.at + 1) + "; D's toggles set the inversion (" + s2.inv + ") and the look (" + s2.want + "); round 1 holds the inversion and frees the look (" + h1 + "), round 2 the other way (" + h2 + ")",
        s1.i === 11 && s1.j === 35 && s2.at === 30 && s2.inv === 1 && s2.want === 0 && h1 && h2);
  SD.done = true; openRound(SD);
  SB.done = true; openRound(SB); setC(SB, { cost: 0.9 }); B_PATHS.sync();
  const arrow = document.querySelector('#B_paths .paths-arrow[data-of="cost"]') || [...document.querySelectorAll("#B_paths .paths-arrow")].find(a => a.classList.contains("down"));
  check("controls: B's cost arrow is drawn as a negative (red) arrow (" + (arrow ? arrow.getAttribute("class") : "none") + ")", !!arrow && arrow.classList.contains("down"));
}
{
  /* hover text: every mark has words; hover shows them and moving off hides them; the hybrid box closed at load */
  const infos = [...document.querySelectorAll(".info")], tipOf = e => e.dataset.tip ? document.getElementById(e.dataset.tip) : e.querySelector(".tip");
  const empty = infos.filter(e => !tipOf(e) || !tipOf(e).textContent.trim()).length, pop = document.querySelector(".tip-pop");
  const perStage = "A,B,C,D".split(",").map(K => document.querySelectorAll("#stage" + K + " .info").length);
  const ev = (e, type) => e.dispatchEvent(new MouseEvent(type, { bubbles: true }));
  ev(infos[0], "mouseover"); const shown = !pop.hidden && pop.textContent === tipOf(infos[0]).textContent; ev(document.body, "mouseover"); const gone = pop.hidden;
  const hy = document.getElementById("A_hyBox");
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
  const SHORT = { RA: s => s.replace("for (t in 1:400)", "for (t in 1:30)"), RB: s => s.replace("for (t in 1:150)", "for (t in 1:20)"),
                  RC: s => s.replace("for (t in 1:200)", "for (t in 1:20)"), RD: s => s.replace("for (t in 1:300)", "for (t in 1:15)").replace("N <- 100", "N <- 30") };
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
