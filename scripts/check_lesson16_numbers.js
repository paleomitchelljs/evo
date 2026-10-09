#!/usr/bin/env node
/*
 * check_lesson16_numbers.js -- the checks for app/lessons/lesson16.html.
 *
 * Lesson 16 is a draft (first pass, 2026-10-08): A one change to a real gene
 * (E. coli trpL), named, then played out in 100 populations for 4N
 * generations, ten times; B a bench (copy, or meiosis and fusion) and then
 * two populations, one without sex and one with, and the ratchet; C two
 * chromosomes paired and crossed over, at their genes or at copies of a
 * repeat. What has to hold:
 *
 *   A, the reading. trpL reads MKAIFVLKGWWRTS from letter 17 to the stop at
 *      59-61; the genetic code on the page is the standard one (re-derived
 *      from the codon list here); every one-letter insertion or deletion
 *      inside the reading still meets its stop on screen; the four kinds
 *      (transition = purine for purine or pyrimidine for pyrimidine) for all
 *      twelve substitutions; worked cases of what a change does: silent,
 *      one amino acid, an early stop, a lost stop, a lost start, a new start
 *      upstream, a frameshift.
 *   A, the populations. the share lost by 4N at N 100 neutral; the
 *      playback: the first 20 generations take 2.4 s, all of them 6 s.
 *   A, the flow. a letter clicked opens the pop-up; a change locks the
 *      sequence; a wrong first answer records 0 and the right one opens the
 *      sliders; the sentence under the runs agrees with the run; a silent
 *      change holds s (at 0) and h in view, read off the computed style and
 *      `disabled`, not the `hidden` attribute (2026-10-09: `.tbar`'s
 *      display:flex beat `hidden`, so the rows showed and moved while this
 *      check passed), and runs at s = 0; the next change frees them and gives
 *      back the student's s; ten changes played out fill the table and open
 *      B; an eleventh records nothing.
 *   B, the bench. copying always gives the parent's 3; without crossovers
 *      the best young carries 2; a young with none exists exactly when the
 *      parent's crossover falls after gene 4-7 and the mate's after 3-5.
 *   B, the populations. a copied young keeps every harmful change of its
 *      parent; a gamete carries only changes its parent had; with sex the
 *      average settles at U/s; each target is hit by the intended setting
 *      and missed by the opening and the naive one; practice records
 *      nothing; a scored Go records its bit when the run ends.
 *   C. genes lined up, every gap gives two chromosomes with every gene once;
 *      two copies facing the same way on the two chromosomes give one
 *      lacking the stretch between them and one with it twice; facing
 *      opposite ways, two centres and none; on one chromosome, a loop-out
 *      (a deletion and a ring) or an inversion; on the reversed board, 9
 *      places for a crossover, 7 safe, 2 inside the reversed stretch; every
 *      target has a pairing that hits it and the trivial crossovers miss;
 *      the first Cross over is a free try; five attempts finish the lesson.
 *   All. every canvas fits its panel (1500 and 1000 wide); a full run writes
 *      all 18 bits; the three R panels run (Rscript), and C's gives the
 *      page's own chromosomes.
 *
 * Same harness as check_lesson15_numbers.js.
 *
 * Usage:  node scripts/check_lesson16_numbers.js      (~1 minute)
 * Exit 0 iff every check passes. Needs Google Chrome and python3; Rscript
 * for the R panels (skipped, and said so, without it).
 */
const { spawn, spawnSync } = require("child_process");
const fs = require("fs"), path = require("path");

const ROOT = path.resolve(__dirname, "..");
const PORT = +process.env.PORT || 8798;
const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

const INNER = `
const L=[], say=s=>L.push(s);
let bad=0, ran=0;
const check=(name, ok, detail)=>{ ran++; if(!ok) bad++; say((ok?"ok   ":"FAIL ")+name+(detail?"  -- "+detail:"")); };
const near=(a,b,e)=>Math.abs(a-b)<=(e==null?1e-9:e);
const pct=x=>Math.round(100*x)+"%";
for (const s of ["A","B","C"]) document.getElementById("stage"+s).classList.remove("stage-locked");
Gates.A.open = true; FIT_EPOCH++;

/* ================= A: the reading ================= */
{
  check("trpL reads MKAIFVLKGWWRTS from letter 17, stop at 59-61", ORIG.aa === "MKAIFVLKGWWRTS" && ORIG.start === 16 && ORIG.stop === 58 && BASE.length === 299);
  /* the standard code, written out here by amino acid */
  const STD = { F:"TTT TTC", L:"TTA TTG CTT CTC CTA CTG", I:"ATT ATC ATA", M:"ATG", V:"GTT GTC GTA GTG", S:"TCT TCC TCA TCG AGT AGC", P:"CCT CCC CCA CCG",
    T:"ACT ACC ACA ACG", A:"GCT GCC GCA GCG", Y:"TAT TAC", "*":"TAA TAG TGA", H:"CAT CAC", Q:"CAA CAG", N:"AAT AAC", K:"AAA AAG", D:"GAT GAC", E:"GAA GAG",
    C:"TGT TGC", W:"TGG", R:"CGT CGC CGA CGG AGA AGG", G:"GGT GGC GGA GGG" };
  let n = 0, agree = true; for (const aa in STD) for (const c of STD[aa].split(" ")) { n++; if (CODE[c] !== aa) agree = false; }
  check("the page's genetic code is the standard one, all 64 codons", n === 64 && agree && Object.keys(CODE).length === 64);
  let worst = 0, off = [];
  for (let p = ORIG.start + 1; p < ORIG.stop + 3; p++) for (const m of [{ kind: "del", pos: p, from: BASE[p] }].concat("ACGT".split("").map(t => ({ kind: "ins", pos: p, to: t })))) {
    const r = readSeq(applyMut(m)); if (r.stop == null || r.stop + 3 > VIEW) off.push(m.kind + p); else worst = Math.max(worst, r.stop + 3);
  }
  check("every one-letter insertion or deletion in the reading meets its stop on screen (last stop ends at letter " + worst + " of " + VIEW + ")", off.length === 0, off.slice(0, 6).join(" "));
  let kinds = true; for (const a of "ACGT") for (const b of "ACGT") if (a !== b) { const k = kindOf({ kind: "sub", from: a, to: b }), tr = (a + b === "AG" || a + b === "GA" || a + b === "CT" || a + b === "TC");
    if (k !== (tr ? "transition" : "transversion")) kinds = false; }
  check("kinds: A-G and C-T are transitions, the other eight substitutions transversions; an insertion and a deletion", kinds && kindOf({ kind: "ins" }) === "insertion" && kindOf({ kind: "del" }) === "deletion");
  const E = (kind, pos, to) => effectOf({ kind, pos, from: BASE[pos], to });
  const cases = [
    ["silent: GCA to GCG (Ala)", E("sub", 24, "G"), e => e.syn && /same 14/.test(e.text)],
    ["outside the reading", E("sub", 3, "C"), e => e.syn && /Outside/.test(e.text)],
    ["a letter put in front of the start", E("ins", 16, "C"), e => e.syn && /Outside/.test(e.text)],
    ["one amino acid: GGT to GTT, Gly to Val at 9", E("sub", 41, "T"), e => !e.syn && e.short === "Gly→Val at 9"],
    ["an early stop: TGG to TAG at Trp 10", E("sub", 44, "A"), e => e.short === "stop at 10" && e.r.aa === "MKAIFVLKG"],
    ["the stop lost: TGA to TGG, a Trp then 8 more", E("sub", 60, "G"), e => e.short === "reads on" && e.r.aa.length === 23 && /reads on 9 amino acids/.test(e.text)],
    ["the start lost: ATG to ATC, the next ATG down", E("sub", 18, "C"), e => e.short === "start lost" && e.r.start === 80 && /64 letters further on/.test(e.text)],
    ["a new start upstream: C to G makes ATG 7 letters before", E("sub", 11, "G"), e => e.short === "new start" && /7 letters before/.test(e.text)],
    ["a frameshift: one letter out at codon 5", E("del", 30), e => e.short === "frame from 5" && e.r.stop != null],
  ];
  const fails = cases.filter(c => !c[2](c[1])).map(c => c[0] + " [" + c[1].short + ": " + c[1].text + "]");
  check("what a change does, " + cases.length + " worked cases", fails.length === 0, fails.join(" | "));
}

/* ================= A: the populations ================= */
{
  const r2 = mulberry32(77); let lost = 0, here = 0, fx = 0, maxT = 0; const R = 3000;
  for (let i = 0; i < R; i++) { const o = A_fate(100, 0.5, 0, r2); if (o.end === "lost") lost++; else if (o.end === "here") here++; else fx++; maxT = Math.max(maxT, o.path.length - 1); }
  check("N 100, neutral: lost by 4N in " + pct(lost / R) + " (measured 99.5%), never past 4N generations", near(lost / R, 0.995, 0.006) && maxT <= 400);
  const T = 400; let mono = true; for (let t = 0, g0 = -1; t <= 6.2; t += 0.05) { const g = A_genAt(t, T); if (g < g0) mono = false; g0 = g; }
  check("playback: generation 20 at 2.4 s, all " + T + " by 6 s, never backwards", A_genAt(2.39, T) <= 20 && A_genAt(2.4, T) === 20 && A_genAt(6, T) === T && mono && A_genAt(2.4, 40) === 20 && A_genAt(6, 40) === 40);
}

/* ================= A: the flow ================= */
{
  A_openPop(41);
  const popOpen = !document.getElementById("A_pop").hidden && document.querySelectorAll("#A_pop button").length === 9;
  document.querySelector('#A_pop button[data-act="sub"][data-to="T"]').click();
  const changed = A.step === "kind" && A.mut.kind === "sub" && A.mut.to === "T";
  A_openPop(10); const lockedSeq = document.getElementById("A_pop").hidden && A.mut.pos === 41;
  A_kind("transition");
  const wrong = Score.isAnswered("scaffold", BIT.A1) && Score.getBit("scaffold", BIT.A1) === 0 && A.step === "kind" && /incorrect/.test(document.getElementById("A_kindFb").textContent);
  A_kind("transversion");
  /* what a student sees: a row in view (not display:none), its slider free or held */
  const el = id => document.getElementById(id);
  const shown = id => getComputedStyle(el(id)).display !== "none";
  const free = k => shown("A_" + k + "Row") && !el("A_" + k).disabled && !el("A_" + k + "Row").classList.contains("held");
  const held = k => shown("A_" + k + "Row") && el("A_" + k).disabled && el("A_" + k + "Row").classList.contains("held");
  const opened = A.step === "set" && shown("A_controls") && free("s") && free("h") && !el("A_N").disabled && Score.getBit("scaffold", BIT.A1) === 0;
  check("A: a click opens the pop-up (3 + 4 + 2 buttons); a change locks the sequence; a wrong first answer records 0, the right one opens s, h and N", popOpen && changed && lockedSeq && wrong && opened);
  const sBefore = el("A_s").value;
  A_go(); const running = A.step === "run" && el("A_s").disabled;
  A.run.g = 4 * A.run.set.N; A_endRun();
  const row = A.rows[0];
  check("A: Go locks the sliders; the run ends as a row: " + row.eff.short + ", extinct " + row.res.lost + " / still present " + row.res.here + " / went to fixation " + row.res.fixed,
        running && A.rows.length === 1 && row.res.lost + row.res.here + row.res.fixed === 100 && !row.firstOk);
  /* the sentence under the runs (JM's): 100 populations, extinct in the row's count, after 4N generations */
  const said = el("A_runsRead").textContent.replace(/\\s+/g, " ").trim();
  const sm = said.match(/^In (\\d+) populations where this mutation arose, it went extinct in (\\d+) after (\\d+) generations[.]$/);
  check("A: under the runs, one sentence that agrees with the run: '" + said + "'",
        !!sm && +sm[1] === 100 && +sm[2] === row.res.lost && +sm[3] === 4 * row.res.set.N);
  /* a silent change: s held at 0 and h held, both in view; N free; runs at s = 0 */
  A_nextChange(); A_edit("sub", 24, "G");
  A_kind("transition");
  const silent = A.step === "set" && A.eff.syn && held("s") && held("h") && !el("A_N").disabled &&
    A_S[+el("A_s").value] === 0 && el("A_sV").textContent === "0" && A_set().s === 0 && Score.getBit("scaffold", BIT.A2) === 1;
  A_go(); A.run.g = 4 * A.run.set.N; A_endRun();
  check("A: a silent change holds s at 0 and h, in view, and runs at s = 0; a right first answer records 1", silent && A.rows[1].res.set.s === 0);
  /* eight more, then the stage closes; the first of them (a frameshift) frees s and h and gives back the student's s */
  let restored = null;
  for (let i = 2; i < 10; i++) { A_nextChange(); A_edit("del", 20 + i, null); A_kind("deletion");
    if (i === 2) restored = !A.eff.syn && free("s") && free("h") && el("A_s").value === sBefore;
    A_go(); A.run.g = 4 * A.run.set.N; A_endRun(); }
  check("A: the next change that alters the protein frees s and h and gives back the s set before", restored === true);
  const done = A.rows.length === 10 && Gates.A.done && Gates.B.open && document.querySelector('#tasksA li[data-task="A1"]').classList.contains("done");
  A_nextChange(); A_edit("sub", 50, "A"); A_kind(kindOf(A.mut)); A_go(); A.run.g = 4 * A.run.set.N; A_endRun();
  const bits = Array.from({ length: 10 }, (_, i) => Score.getBit("scaffold", BIT["A" + (i + 1)])).join("");
  check("A: ten changes fill the table and open B; an eleventh is played but not counted (bits " + bits + ")", done && A.rows.length === 10 && bits === "0111111111" && document.querySelectorAll("#A_table tr").length === 11);
}

/* ================= B: the bench ================= */
{
  const P = B_PAR.P, M = B_PAR.M; let best = Infinity, cleanAt = [];
  const xs = [null, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  let noXO = Infinity;
  for (const xp of xs) for (const xm of xs) {
    const gp = B_gametes(P, xp), gm = B_gametes(M, xm); let m = Infinity;
    for (const a of gp) for (const b of gm) m = Math.min(m, a.m.length + b.m.length);
    if (xp == null && xm == null) noXO = m;
    if (m === 0) cleanAt.push(xp + "/" + xm); best = Math.min(best, m);
  }
  const want = []; for (const xp of [4, 5, 6, 7]) for (const xm of [3, 4, 5]) want.push(xp + "/" + xm);
  check("bench: no crossover, the best young carries " + noXO + "; a young with none needs the parent's crossover after gene 4-7 and the mate's after 3-5 (" + cleanAt.length + " pairs)",
        noXO === 2 && best === 0 && cleanAt.sort().join() === want.sort().join());
  /* the gametes' sources: four strands, two whole, two joined at the crossover */
  const g = B_gametes(P, 5);
  check("bench: four gametes, two whole and two joined after the crossover", g[0].src.every(x => x === 0) && g[3].src.every(x => x === 1) && g[1].src.join("") === "0000011111" && g[2].src.join("") === "1111100000" &&
        g[1].m.join() === "2,4,8" && g[2].m.length === 0);
  B_copy(); BB.xo.P = 6; BB.xo.M = 4; B_makeGametes(); B_pickGamete("P", 2); B_pickGamete("M", 1);
  check("bench: a copy keeps the parent's 3; the right gametes make a young with none; the rounds open", BB.young[0].n === 0 && B_ready() && !document.getElementById("B_go").disabled);
}

/* ================= B: the populations ================= */
{
  /* a copied young keeps every change its parent had; a gamete only what its parent had */
  const rng = mulberry32(5);
  let pop = []; for (let i = 0; i < 40; i++) { const ind = [[], []]; rtAdd(ind, (rng() * 6) | 0, rng); pop.push(ind); }
  let keeps = true; const ids = new Set(); pop.forEach(ind => ind[0].concat(ind[1]).forEach(x => ids.add(x)));
  const kids = rtStep(pop, 0, 0.1, false, rng);
  for (const k of kids) { const all = k[0].concat(k[1]); if (!pop.some(p => p[0].join() === k[0].join() && p[1].join() === k[1].join())) keeps = false; }
  const sexK = rtStep(pop, 0, 0.1, true, rng); let only = true;
  for (const k of sexK) for (const x of k[0].concat(k[1])) if (!ids.has(x)) only = false;
  check("without sex a young is its parent exactly (no new changes at U = 0); with sex every change it carries came from a parent", keeps && only);
  /* with sex, the average settles at U/s */
  const out = rtDrain(rtRun({ N: 500, U: 0.3, s: 0.1 }, 31, {}));
  let m = 0; for (let t = 150; t <= 200; t++) m += out.X[t].mean / 51;
  check("with sex, the average settles at U/s: " + m.toFixed(2) + " against 3.00 (N 500, generations 150-200); the best stays at " + out.X[200].min, near(m, 3, 0.35) && out.X[200].min <= 1);
  /* the targets: hit by the intended setting, missed by the opening and the naive one */
  const rate = (r, set, n) => { let h = 0; for (let k = 0; k < n; k++) if (BR_judge(r, rtDrain(rtRun(set, 9001 + 7919 * k, {}))).ok) h++; return h / n; };
  const [r1, r2, r3] = BR_ROUNDS;
  const a = [rate(r1, { N: 100, U: 0.3, s: 0.1 }, 16), rate(r1, { N: 200, U: 0.3, s: 0.1 }, 16), rate(r1, { N: 1000, U: 0.3, s: 0.1 }, 12)];
  check("B round 1 (keep the best at 3 or fewer): N 100 / 200 / 1000 hit " + a.map(pct).join(" / ") + " (measured 0 / ~40 / 100%)", a[0] <= 0.15 && a[2] >= 0.9);
  const b = [rate(r2, { N: 100, U: 0.3, s: 0.1 }, 16), rate(r2, { N: 100, U: 0.5, s: 0.1 }, 16), rate(r2, { N: 100, U: 1, s: 0.1 }, 10)];
  check("B round 2 (12-25 without sex, 2 or fewer with): U 0.3 / 0.5 / 1.0 hit " + b.map(pct).join(" / ") + " (the opening, the aim, too far)", b[0] <= 0.15 && b[1] >= 0.8 && b[2] <= 0.1);
  const c = [rate(r3, { N: 100, U: 0.3, s: 0.1 }, 16), rate(r3, { N: 100, U: 0.3, s: 0.05 }, 16), rate(r3, { N: 100, U: 0.3, s: 0.3 }, 10)];
  check("B round 3 (12-25 without sex): s 0.1 / 0.05 / 0.3 hit " + c.map(pct).join(" / ") + " (the opening, milder harm, harsher harm)", c[0] <= 0.15 && c[1] >= 0.8 && c[2] === 0);
  /* scoring: practice nothing; a scored Go records when the run ends; three attempts */
  const pr = document.getElementById("B_practice"), N = document.getElementById("B_N");
  pr.checked = true; B_sync(); B_go(); B_finishNow(); const practiced = BRd.results.length === 0 && !BRd.waiting;
  pr.checked = false; B_sync(); N.value = "2"; B_go(); const pend = BRd.pending && Score.isAnswered && !Score.isAnswered("scaffold", BIT.B1); B_finishNow();
  const first = BRd.results.length === 1 && BRd.waiting && Score.isAnswered("scaffold", BIT.B1) && !document.getElementById("B_next").hidden;
  B_nextRound(); const held = document.getElementById("B_N").disabled && document.getElementById("B_N").value === "2" && !document.getElementById("B_U").disabled;
  document.getElementById("B_U").value = "0.5"; B_go(); B_finishNow(); B_nextRound();
  document.getElementById("B_s").value = "1"; B_go(); B_finishNow();
  check("B: practice records nothing; a scored Go records its bit when the run ends; the next target holds its sliders; three attempts finish B and open C",
        practiced && pend && first && held && BRd.done && Gates.B.done && Gates.C.open);
}

/* ================= C ================= */
const ids = p => p.map(e => e.k === "cen" ? "o" : e.k === "r" ? (e.d > 0 ? ">" : "<") : e.id + (e.d < 0 ? "'" : "")).join("");
{
  const T = C_chrom(0, false), Bt = C_chrom(1, false);
  let allOk = true, mixed = 0;
  for (let g = 1; g < T.length; g++) { const rs = C_cross(T, Bt, { t: "al" }, g).map(C_read); if (!rs.every(r => r.one && r.order)) allOk = false; if (rs.every(r => r.mix)) mixed++; }
  check("C: genes lined up, every gap gives two chromosomes with every gene once in order; " + mixed + " of 11 gaps give two mixes (all but the gap next to the centre)", allOk && mixed === 10);
  /* every pair of repeat copies on the two chromosomes, and on one */
  const reps = T.map((e, i) => e.k === "r" ? i : -1).filter(i => i >= 0); let same = true, opp = true, n = 0;
  for (const i of reps) for (const j of reps) { if (i === j) continue; n++;
    const rs = C_cross(T, Bt, { t: "rr", i, j }).map(C_read);
    if (T[i].d === Bt[j].d) { const del = rs.find(r => r.one && r.missing.length), dup = rs.find(r => r.one && r.dup.length);
      if (!del || !dup || del.missing.join() !== dup.dup.join()) same = false; }
    else if (!(rs.some(r => r.cens === 2) && rs.some(r => r.cens === 0))) opp = false; }
  check("C: two copies on the two chromosomes (" + n + " pairs): facing the same way, one lacks exactly what the other has twice; facing opposite ways, two centres and none", same && opp);
  const loop = C_cross(T, Bt, { t: "self", c: "top", i: 2, j: 9 }).map(C_read), inv = C_cross(T, Bt, { t: "self", c: "top", i: 2, j: 6 }).map(C_read);
  check("C: one chromosome looped (same way): " + loop[0].text + " + " + loop[1].text + "; folded (opposite ways): " + inv[0].text,
        loop[0].one && loop[0].missing.join("") === "BCDEF" && loop[1].text.indexOf("a ring") === 0 && inv[0].one && inv[0].all && !inv[0].order && ids(inv[0].p) === "oA>D'C'B'<EF>GH");
  const IB = C_chrom(1, true); let allowed = 0, safe = 0, inside = 0;
  for (let g = 1; g < T.length; g++) { const X = T[g - 1], Y = T[g], bx = IB.findIndex(e => e.id === X.id), by = IB.findIndex(e => e.id === Y.id);
    if (Math.abs(bx - by) !== 1) continue; allowed++; const rs = C_cross(T, IB, { t: "al" }, g).map(C_read);
    if (rs.every(r => r.one && r.all)) safe++; else if (rs.some(r => r.cens === 2) && rs.some(r => r.cens === 0)) inside++; }
  check("C: one chromosome reversed at B C D: " + allowed + " places for a crossover, " + safe + " safe, " + inside + " (inside) give two centres and none (9 / 7 / 2)", allowed === 9 && safe === 7 && inside === 2);
  /* each target has a pairing that hits it; the trivial crossovers miss */
  const sol = [
    () => C_cross(T, Bt, { t: "al" }, 5), () => C_cross(T, Bt, { t: "rr", i: 2, j: 9 }), () => C_cross(T, Bt, { t: "rr", i: 2, j: 9 }),
    () => C_cross(T, Bt, { t: "self", c: "top", i: 2, j: 6 }), () => C_cross(T, IB, { t: "al" }, 8) ];
  const hits = C_ROUNDS.map((r, i) => r.ok(sol[i]().map(C_read)));
  const triv = C_ROUNDS.map((r, i) => r.ok(C_cross(T, r.board === "inv" ? IB : Bt, { t: "al" }, 1).map(C_read)));
  const inside5 = C_ROUNDS[4].ok(C_cross(T, IB, { t: "al" }, 4).map(C_read));
  check("C: every target has a pairing that hits (" + hits.join(" ") + "); a crossover next to the centre hits none (" + triv.join(" ") + "); inside the reversed stretch misses the last", hits.every(Boolean) && triv.every(x => !x) && !inside5);
}
{
  /* the flow: no pairing, no Go; a free try; five attempts */
  C_setBoard("std"); C_paint();
  const shut = document.getElementById("C_go").disabled;
  C.off = 0; C.pair = { t: "al" }; C.gap = 5; C_sync(); C_go();
  const tried = C.tried && C.results.length === 0;
  const pr = document.getElementById("C_practice"); pr.checked = true; C_sync(); C_go(); const practiced = C.results.length === 0; pr.checked = false; C_sync();
  C.pair = { t: "al" }; C.gap = 1; C_go();
  const miss = C.results.length === 1 && !C.results[0] && C.waiting && Score.getBit("scaffold", BIT.C1) === 0 && document.getElementById("C_go").disabled;
  const plan = [{ t: "rr", i: 2, j: 9 }, { t: "rr", i: 2, j: 9 }, { t: "self", c: "top", i: 2, j: 6 }, { t: "al" }];
  for (let k = 0; k < 4; k++) { C_nextRound(); C.pair = plan[k]; C.gap = plan[k].t === "al" ? 8 : null; C_go(); }
  const bits = ["C1","C2","C3","C4","C5"].map(k => Score.getBit("scaffold", BIT[k])).join("");
  check("C: no pairing, no Cross over; the first is a free try; practice records nothing; a miss records 0; five attempts finish the lesson (bits " + bits + ")",
        shut && tried && practiced && miss && bits === "01111" && C.board === "inv" && Gates.C.done && document.getElementById("done-banner").classList.contains("shown"));
}
{
  let n = 0; for (let i = 0; i < 18; i++) if (Score.isAnswered("scaffold", i)) n++;
  check("all 18 declared bits written", n === 18, n + " written");
}
{
  FIT_EPOCH++; paintAll();
  const over = [];
  for (const id of ["A_seq","A_runs","A_wheel","B_bench","B_hist","B_plot","C_pair","C_out"]) { const cv = document.getElementById(id), host = cv.parentElement;
    if (+cv.dataset.drawW > host.clientWidth + 1) over.push(id + " " + cv.dataset.drawW + ">" + host.clientWidth); }
  check("every canvas fits its panel (" + window.innerWidth + " wide)", over.length === 0, over.join(", "));
}
/* the R panels, for the runner to run; C's for a known pairing, with the page's own products */
A_code(); B_code();
C_setBoard("std"); C.off = 0; C.pair = { t: "al" }; C.gap = 4; C_code();
const RC_AL = ids(C_cross(C.top, C.bot, C.pair, C.gap)[0]) + "|" + ids(C_cross(C.top, C.bot, C.pair, C.gap)[1]);
const RC_CODE = RTEXT.codeC;
say(bad ? ("FAILED " + bad) : "ALL BARS PASS");
say("RAN " + ran);
say("RA " + RTEXT.codeA.replace(/\\n/g, "\\\\n"));
say("RB " + RTEXT.codeB.replace(/\\n/g, "\\\\n"));
say("RC " + RC_CODE.replace(/\\n/g, "\\\\n"));
say("RCWANT " + RC_AL);
L.join(" ;; ");
`;

/* the fit check alone, in a narrower frame */
const INNER_NARROW = `
for (const s of ["A","B","C"]) document.getElementById("stage"+s).classList.remove("stage-locked");
FIT_EPOCH++; paintAll();
const over = [];
for (const id of ["A_seq","A_runs","A_wheel","B_bench","B_hist","B_plot","C_pair","C_out"]) { const cv = document.getElementById(id), host = cv.parentElement;
  if (+cv.dataset.drawW > host.clientWidth + 1) over.push(id + " " + cv.dataset.drawW + ">" + host.clientWidth); }
(over.length ? "FAIL " : "ok   ") + "every canvas fits its panel (" + window.innerWidth + " wide)" + (over.length ? "  -- " + over.join(", ") : "");
`;

const probe = `<!doctype html><meta charset="utf-8"><title>pending</title>
<iframe id="f" src="http://127.0.0.1:${PORT}/app/lessons/lesson16.html?preview=1" width="1500" height="1000"></iframe>
<iframe id="g" src="http://127.0.0.1:${PORT}/app/lessons/lesson16.html?preview=1" width="1000" height="900"></iframe>
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

const probePath = path.join(ROOT, "_check_l16_" + PORT + ".html");
fs.writeFileSync(probePath, probe);
const server = spawn("python3", ["-m", "http.server", String(PORT), "--directory", ROOT], { stdio: "ignore", detached: true });
const cleanup = () => { try { process.kill(-server.pid); } catch (e) {} try { fs.unlinkSync(probePath); } catch (e) {} };
process.on("exit", cleanup);

setTimeout(() => {
  const r = spawnSync(CHROME, ["--headless=new", "--disable-gpu", "--virtual-time-budget=600000", "--dump-dom", `http://127.0.0.1:${PORT}/_check_l16_${PORT}.html`],
                      { encoding: "utf8", maxBuffer: 1 << 28 });
  const dec = s => s.replace(/&quot;/g, '"').replace(/&gt;/g, ">").replace(/&lt;/g, "<").replace(/&amp;/g, "&");
  const m = /<pre id="out">([\s\S]*?)<\/pre>/.exec(r.stdout || ""), m2 = /<pre id="out2">([\s\S]*?)<\/pre>/.exec(r.stdout || "");
  if (!m) { console.error("no result -- is Chrome at " + CHROME + " ?"); cleanup(); process.exit(2); }
  const text = dec(m[1]), lines = text.split(" ;; ");
  let bad = !/ALL BARS PASS/.test(text);
  const tagged = t => (lines.find(l => l.startsWith(t + " ")) || "").slice(t.length + 1).replace(/\\n/g, "\n");
  for (const line of lines) if (!/^(RA|RB|RC|RCWANT) /.test(line)) console.log(line);
  const reported = lines.filter(l => /^(ok|FAIL)\s/.test(l)).length;
  const ranLine = /^RAN (\d+)$/.exec((lines.find(l => /^RAN \d+$/.test(l)) || ""));
  if (!ranLine || +ranLine[1] !== reported) { console.log("FAIL harness  " + (ranLine ? ranLine[1] : "?") + " checks ran, " + reported + " came back"); bad = true; }
  const narrow = m2 ? dec(m2[1]) : "FAIL narrow frame gave nothing";
  console.log(narrow); if (!/^ok/.test(narrow)) bad = true;
  /* the R panels: A and B run; C's lined-up crossover gives the page's own two chromosomes */
  const rs = (code, tail) => spawnSync("Rscript", ["-e", code + (tail || "")], { encoding: "utf8", timeout: 120000 });
  const probeR = spawnSync("Rscript", ["--version"], { encoding: "utf8" });
  if (probeR.error) console.log("skip R panels  (no Rscript)");
  else {
    const a = rs(tagged("RA"), "\ncat('\\nOK', sum(table(fate)), '\\n')");
    const okA = /OK 100/.test(a.stdout || ""); console.log((okA ? "ok   " : "FAIL ") + "the R panel for A runs 100 populations" + (okA ? "" : "  -- " + (a.stderr || "").slice(0, 300))); if (!okA) bad = true;
    const b = rs(tagged("RB").replace(/N <- \d+/, "N <- 40").replace("1:200", "1:40"), "\ncat('\\nOK\\n')");
    const okB = /OK/.test(b.stdout || ""); console.log((okB ? "ok   " : "FAIL ") + "the R panel for B runs (40 individuals, 40 generations here)" + (okB ? "" : "  -- " + (b.stderr || "").slice(0, 300))); if (!okB) bad = true;
    const want = tagged("RCWANT");
    const c = rs(tagged("RC"), "\nnm <- function(v) paste(sapply(v, function(x) switch(x, centre='o', 'r>'='>', 'r<'='<', 'D<'=\"D'\", 'C<'=\"C'\", 'B<'=\"B'\", x)), collapse='')\n" +
                 "o <- list(c(top[1:(g - 1)], bot[g:n]), c(bot[1:(g - 1)], top[g:n])); cat('\\nGOT', nm(o[[1]]), '|', nm(o[[2]]), '\\n', sep='')");
    const got = ((c.stdout || "").match(/GOT(.*)/) || [])[1];
    const okC = got === want; console.log((okC ? "ok   " : "FAIL ") + "the R panel for C gives the page's two chromosomes: " + got + (okC ? "" : "  -- page " + want + " " + (c.stderr || "").slice(0, 300))); if (!okC) bad = true;
  }
  cleanup();
  process.exit(bad ? 1 : 0);
}, 700);
