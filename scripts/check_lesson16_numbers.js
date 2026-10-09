#!/usr/bin/env node
/*
 * check_lesson16_numbers.js -- the checks for app/lessons/lesson16.html.
 *
 * Lesson 16 is a draft (first pass, 2026-10-08; A's targets 2026-10-09): A
 * eight targets, each one change to a real gene (E. coli trpL) of a kind
 * asked for, played out in 1,000 populations for 4N generations, then dN/dS
 * off the eight; B a bench (copy, or meiosis and fusion) and then two
 * populations, one without sex and one with, and the ratchet; C two
 * chromosomes paired and crossed over, at their genes or at copies of a
 * repeat. What has to hold:
 *
 *   A, the reading. trpL reads MKAIFVLKGWWRTS from letter 17 to the stop at
 *      59-61; the genetic code on the page is the standard one (re-derived
 *      from the codon list here); every one-letter insertion or deletion
 *      inside the reading still meets its stop on screen; the kind of every
 *      one-letter change in view (synonymous, nonsynonymous, noncoding)
 *      against the rule written out here, and the synonymous substitutions
 *      against the codon table; worked cases of what a change does.
 *   A, the populations. the share lost by 4N at N 100 neutral; the
 *      yardstick: at the largest N offered, a synonymous change in 1,000
 *      populations goes to fixation somewhere almost always; the playback:
 *      the first 20 generations take 2.4 s, all of them 6 s.
 *   A, the flow. the verdict waits for Go; a miss records 0, adds no row,
 *      says why (the wrong kind, or the wrong sign of s), and the target
 *      stays; practice records nothing; a change that leaves the protein the
 *      same holds s (at 0) and h in view, read off the computed style and
 *      `disabled`, never the `hidden` attribute (2026-10-09: `.tbar`'s
 *      display:flex beat `hidden`, so the rows showed and moved while this
 *      check passed); the student's s comes back; N holds from the first
 *      scored Go; the sentence under the runs agrees with the run; eight
 *      hits open B; dN/dS printed agrees with the rows, harmful below the
 *      synonymous change and beneficial above; after the eight, changes
 *      play as practice.
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
 *      all 16 bits; the three R panels run (Rscript), and C's gives the
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
for (const s of ["A","B","C","D"]) document.getElementById("stage"+s).classList.remove("stage-locked");
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
  /* the kinds (JM, 2026-10-09): every one-letter change in view against the rule written out here -- the protein
     changed: nonsynonymous; the same, and the letters from start to stop the same: noncoding; else synonymous */
  const o = ORIG, cnt = { synonymous: 0, nonsynonymous: 0, noncoding: 0 }, badK = [], synIndel = [];
  let synSub = 0;
  for (let p = 0; p < VIEW; p++) {
    const ms = "ACGT".split("").filter(t => t !== BASE[p]).map(t => ({ kind: "sub", pos: p, from: BASE[p], to: t }))
      .concat("ACGT".split("").map(t => ({ kind: "ins", pos: p, from: null, to: t })), [{ kind: "del", pos: p, from: BASE[p], to: null }]);
    for (const m of ms) {
      const e = effectOf(m), r = readSeq(applyMut(m)), same = r.start >= 0 && r.aa === o.aa;
      const seq = applyMut(m), want = !same ? "nonsynonymous" : seq.slice(r.start, r.stop + 3) === BASE.slice(o.start, o.stop + 3) ? "noncoding" : "synonymous";
      cnt[e.kind]++; if (e.kind !== want) badK.push(m.kind + p + (m.to || ""));
      if (e.kind === "synonymous") { if (m.kind === "sub") synSub++; else synIndel.push(p); }
    }
  }
  /* synonymous substitutions straight off the codon table: a letter of a codon of the reading (the stop too) changed
     to one that codes the same */
  let fromTable = 0;
  for (const c of o.codons) for (let j = 0; j < 3; j++) for (const t of "ACGT") if (t !== c.cod[j] && CODE[c.cod.slice(0, j) + t + c.cod.slice(j + 1)] === c.aa) fromTable++;
  check("kinds over every one-letter change in view: " + cnt.synonymous + " synonymous, " + cnt.nonsynonymous + " nonsynonymous, " + cnt.noncoding + " noncoding; each by the rule; " +
        synSub + " synonymous substitutions, as the codon table gives (" + fromTable + "); the " + synIndel.length + " synonymous indels all in the stop codon",
        badK.length === 0 && synSub === fromTable && synIndel.every(p => p >= o.stop && p < o.stop + 3), badK.slice(0, 6).join(" "));
  const E = (kind, pos, to) => effectOf({ kind, pos, from: BASE[pos], to });
  const cases = [
    ["synonymous: GCA to GCG (Ala)", E("sub", 24, "G"), e => e.kind === "synonymous" && /same 14/.test(e.text)],
    ["noncoding: outside the reading", E("sub", 3, "C"), e => e.kind === "noncoding" && /Outside/.test(e.text)],
    ["noncoding: a letter put in front of the start", E("ins", 16, "C"), e => e.kind === "noncoding" && /Outside/.test(e.text)],
    ["one amino acid: GGT to GTT, Gly to Val at 9", E("sub", 41, "T"), e => e.kind === "nonsynonymous" && e.short === "Gly→Val at 9"],
    ["an early stop: TGG to TAG at Trp 10", E("sub", 44, "A"), e => e.short === "stop at 10" && e.r.aa === "MKAIFVLKG"],
    ["the stop lost: TGA to TGG, a Trp then 8 more", E("sub", 60, "G"), e => e.short === "reads on" && e.r.aa.length === 23 && /reads on 9 amino acids/.test(e.text)],
    ["the start lost: ATG to ATC, the next ATG down", E("sub", 18, "C"), e => e.short === "start lost" && e.r.start === 80 && /64 letters further on/.test(e.text)],
    ["a new start upstream: C to G makes ATG 7 letters before", E("sub", 11, "G"), e => e.kind === "nonsynonymous" && e.short === "new start" && /7 letters before/.test(e.text)],
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
  /* the yardstick for dN/dS: one synonymous change in 1,000 populations, at the largest N offered, has to go to
     fixation somewhere (measured 2026-10-09: none 0.2% of the time at N 50, 5% at N 100, 22% at N 200) */
  const Nmax = A_NS[A_NS.length - 1], r3 = mulberry32(91), S = 200; let zero = 0, tot = 0;
  for (let k = 0; k < S; k++) { let f = 0; for (let i = 0; i < A_POPS; i++) if (A_fate(Nmax, 0.5, 0, r3).end === "fixed") f++; tot += f; if (!f) zero++; }
  check("the yardstick: a synonymous change at N " + Nmax + " (the largest offered) goes to fixation in " + (tot / S).toFixed(1) + " of " + A_POPS + " by 4N, in none " + pct(zero / S) + " of the time (under 2%)",
        A_POPS === 1000 && zero / S < 0.02);
  const T = 400; let mono = true; for (let t = 0, g0 = -1; t <= 6.2; t += 0.05) { const g = A_genAt(t, T); if (g < g0) mono = false; g0 = g; }
  check("playback: generation 20 at 2.4 s, all " + T + " by 6 s, never backwards", A_genAt(2.39, T) <= 20 && A_genAt(2.4, T) === 20 && A_genAt(6, T) === T && mono && A_genAt(2.4, 40) === 20 && A_genAt(6, 40) === 40);
}

/* ================= A: the flow ================= */
{
  /* what a student sees: a row in view (not display:none), its slider free or held */
  const el = id => document.getElementById(id);
  const shown = id => getComputedStyle(el(id)).display !== "none";
  const free = k => shown("A_" + k + "Row") && !el("A_" + k).disabled && !el("A_" + k + "Row").classList.contains("held");
  const held = k => shown("A_" + k + "Row") && el("A_" + k).disabled && el("A_" + k + "Row").classList.contains("held");
  const txt = id => el(id).textContent.replace(/\\s+/g, " ").trim();
  const bit = k => Score.isAnswered("scaffold", BIT[k]) ? Score.getBit("scaffold", BIT[k]) : null;
  const play = () => { A_go(); A.run.g = 4 * A.run.set.N; A_endRun(); };
  const setS = v => { el("A_s").value = A_S.indexOf(v); A_sync(); };
  /* target 1, synonymous; the first scored try a nonsynonymous change */
  const t1 = txt("A_ttext") === "Make a synonymous change.";
  A_openPop(41);
  const popOpen = !el("A_pop").hidden && document.querySelectorAll("#A_pop button").length === 9;
  document.querySelector('#A_pop button[data-act="sub"][data-to="T"]').click();
  const changed = A.step === "set" && A.mut.kind === "sub" && A.mut.to === "T" && A.eff.kind === "nonsynonymous";
  A_openPop(10); const lockedSeq = el("A_pop").hidden && A.mut.pos === 41;
  const opened = shown("A_controls") && free("s") && free("h") && free("N") && txt("A_go") === "Go" && txt("A_verdict") === "" && !/Gly/.test(txt("A_effect"));
  check("A: target 1 asks for a synonymous change; a click opens the pop-up (3 + 4 + 2 buttons); a change locks the sequence and opens s, h and N; the verdict and the protein wait for Go",
        t1 && popOpen && changed && lockedSeq && opened);
  /* Reset, top left of the sequence panel (JM 2026-10-09): a misclicked change undone in one click, then made again */
  const rb = el("A_reset"), sp = el("A_seq").parentElement;
  const atTop = rb.closest(".seqpanel") === sp && sp.firstElementChild.contains(rb) && !rb.disabled;
  rb.click();
  const undone = A.step === "pick" && !A.mut && rb.disabled && txt("A_ttext") === "Make a synonymous change.";
  A_edit("sub", 41, "T");
  check("A: Reset sits at the top left of the sequence panel; one click undoes a change; nothing to reset, it greys out", atTop && undone && A.step === "set" && !rb.disabled);
  const sBefore = el("A_s").value, NBefore = el("A_N").value;
  A_go(); const running = A.step === "run" && el("A_s").disabled && el("A_N").disabled && A.Nheld === NBefore;
  A.run.g = 4 * A.run.set.N; A_endRun();
  const why1 = txt("A_verdict");
  check("A: Go locks the sliders and fixes N; a miss records 0, adds no row, says why, offers Try again: '" + why1 + "'",
        running && bit("A1") === 0 && A.rows.length === 0 && why1 === "incorrect: that change is nonsynonymous. Try again." && txt("A_next") === "Try again" && /Gly/.test(txt("A_effect")));
  /* the sentence under the runs (JM's): 1,000 populations, extinct in the run's count, after 4N generations */
  const q = A.lastRes, said = txt("A_runsRead"), num = x => +x.replace(/,/g, "");
  const sm = said.match(/^In ([\\d,]+) populations where this mutation arose, it went extinct in ([\\d,]+) after ([\\d,]+) generations[.]$/);
  check("A: under the runs, one sentence that agrees with the run: '" + said + "'",
        !!sm && num(sm[1]) === 1000 && q.runs.length === 1000 && num(sm[2]) === q.lost && num(sm[3]) === 4 * q.set.N && q.lost + q.here + q.fixed === 1000);
  /* practice, a noncoding change: s held at 0, h held, N held -- all in view; nothing counts */
  A_nextChange(); el("A_practice").checked = true; A_sync();
  A_edit("sub", 3, "C");
  const pr1 = A.eff.kind === "noncoding" && held("s") && held("h") && held("N") && A_S[+el("A_s").value] === 0 && txt("A_sV") === "0" && txt("A_go") === "Practice run";
  play();
  check("A: practice on, a noncoding change: s held at 0, h and N held, all in view; the run counts for nothing: '" + txt("A_verdict") + "'",
        pr1 && txt("A_verdict") === "practice: incorrect: that change is noncoding." && A.rows.length === 0 && bit("A1") === 0 && A.lastRes.set.s === 0);
  /* scored again, a synonymous change: a hit, a row, the bit still the first try's */
  A_nextChange(); el("A_practice").checked = false; A_sync();
  A_edit("sub", 24, "G");
  const sy = A.eff.kind === "synonymous" && held("s") && held("h") && held("N");
  play();
  check("A: a synonymous change hits target 1 on a later try: a row at s = 0; the bit stays 0; Next target",
        sy && A.rows.length === 1 && A.rows[0].res.set.s === 0 && A.rows[0].firstOk === false && bit("A1") === 0 && txt("A_verdict") === "correct" && txt("A_next") === "Next target");
  /* target 2, harmful: the s set before comes back */
  A_nextChange(); const t2 = /harmful/.test(txt("A_ttext"));
  A_edit("sub", 41, "T");
  const restored = free("s") && free("h") && held("N") && el("A_s").value === sBefore;
  play();
  check("A: target 2 (harmful): the s set before comes back, s and h free, N held; s 0.1 hits at the first try", t2 && restored && bit("A2") === 1 && A.rows.length === 2);
  /* target 3, beneficial: s 0.1 misses, s -0.05 hits */
  A_nextChange(); A_edit("sub", 41, "T"); play();
  const why3 = txt("A_verdict"), miss3 = bit("A3") === 0 && A.rows.length === 2;
  A_nextChange(); A_edit("sub", 41, "T"); setS(-0.05); play();
  check("A: target 3 (beneficial): s 0.1 misses ('" + why3 + "'), s -0.05 hits; the bit stays the first try's",
        miss3 && why3 === "incorrect: with s = 0.1 it is harmful. Try again." && A.rows.length === 3 && bit("A3") === 0);
  /* target 4, noncoding; then the last four */
  A_nextChange(); A_edit("sub", 3, "C"); play();
  const nc = bit("A4") === 1 && A.rows.length === 4;
  for (const [k, p, t, sv] of [["sub", 44, "A", 0.1], ["del", 30, null, -0.05], ["sub", 18, "C", 0.1], ["sub", 60, "G", -0.05]]) { A_nextChange(); A_edit(k, p, t); setS(sv); play(); }
  const Ns = new Set(A.rows.map(r => r.res.set.N));
  const bits = Array.from({ length: 8 }, (_, i) => bit("A" + (i + 1))).join("");
  check("A: eight hits fill the table, all at one N (" + [...Ns].join(", ") + "), and open B (bits " + bits + ")",
        nc && A.rows.length === 8 && Ns.size === 1 && Gates.A.done && Gates.B.open && document.querySelector('#tasksA li[data-task="A1"]').classList.contains("done") &&
        bits === "01011111" && document.querySelectorAll("#A_table tr").length === 9);
  /* dN/dS off the eight, beneficial and harmful apart (JM 2026-10-09): the readout against the rows, and the
     picture it is for -- harmful below the synonymous change, beneficial above (N 20, the opening: synonymous ~16 of
     1,000, s 0.1 ~1, s -0.05 ~38) */
  const syn = A.rows.filter(r => r.eff.kind === "synonymous"), non = A.rows.filter(r => r.eff.kind === "nonsynonymous");
  const mean = a => a.reduce((x, y) => x + y, 0) / a.length;
  const harm = non.filter(r => r.res.set.s > 0).map(r => r.res.fixed), ben = non.filter(r => r.res.set.s < 0).map(r => r.res.fixed);
  const dS = syn[0] ? syn[0].res.fixed : 0, dB = mean(ben), dH = mean(harm);
  const dr = txt("A_dndsRead"), dm = dr.match(/^dN[/]dS: beneficial ([\\d.]+) ÷ ([\\d.]+) = ([\\d.]+) · harmful ([\\d.]+) ÷ ([\\d.]+) = ([\\d.]+)$/);
  check("A: dN/dS from the eight, beneficial and harmful apart: '" + dr + "' (synonymous " + dS + ", harmful " + harm.join("/") + ", beneficial " + ben.join("/") + "; the noncoding one left out)",
        shown("A_dndsPanel") && syn.length === 1 && ben.length === 3 && harm.length === 3 && dS > 0 && !!dm &&
        near(+dm[1], dB, 0.05) && near(+dm[2], dS) && near(+dm[3], dB / dS, 0.005) && near(+dm[4], dH, 0.05) && near(+dm[5], dS) && near(+dm[6], dH / dS, 0.005) &&
        dH / dS < 1 && dB / dS > 1);
  /* after the eight: a change plays as practice, N free again, its kind said, nothing recorded */
  A_nextChange(); A_edit("sub", 50, "A");
  const sand = free("N") && txt("A_go") === "Practice run" && el("A_practice").disabled;
  play();
  check("A: after the eight, a change plays as practice with N free; its kind is said, nothing recorded: '" + txt("A_verdict") + "'",
        sand && /^that change is /.test(txt("A_verdict")) && A.rows.length === 8 && Array.from({ length: 8 }, (_, i) => bit("A" + (i + 1))).join("") === "01011111");
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
  const waits = !B_ready() && document.getElementById("B_go").disabled;
  B_twenty();
  check("bench: a copy keeps the parent's 3; the right gametes make a young with none; the rounds wait for twenty young each, then open", waits && BB.young[0].n === 0 && B_ready() && !document.getElementById("B_go").disabled);
  /* twenty young each (JM 2026-10-09): copies all carry the parent's 3; young from sex spread round it, each carrying
     half of the parent: twenty of them carry ten copies' worth */
  const S = BB.spread, nP = P[0].length + P[1].length, sd = a => { const m = a.reduce((x, y) => x + y, 0) / a.length; return Math.sqrt(a.reduce((x, y) => x + (y - m) * (y - m), 0) / a.length); };
  let lo = 99, hi = -1, many = []; const r0 = BB.twentyRuns;
  for (let k = 0; k < 30; k++) { B_twenty(); many = many.concat(BB.spread.sex); }
  lo = Math.min(...many); hi = Math.max(...many);
  const rd = document.getElementById("B_spreadRead").textContent.replace(/\\s+/g, " ");
  check("twenty young each: copies all " + nP + " harmful; young from sex " + lo + " to " + hi + " over 600 (spread " + sd(many).toFixed(2) + ", copies 0); the readout: 20 copies against 10",
        S.asex.length === 20 && S.asex.every(v => v === nP) && S.sex.length === 20 && lo < nP && hi > nP && sd(many) > 0.8 && /20 copies/.test(rd) && /10 copies' worth/.test(rd));

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
  check("B: practice records nothing; a scored Go records its bit when the run ends; the next target holds its sliders; three attempts, and B waits for the one-population targets",
        practiced && pend && first && held && BRd.done && !Gates.B.done);
}

/* ================= B: one population, two ways to breed ================= */
{
  /* the targets, re-measured on the page's engine (30 runs a setting): the intended setting hits, the opening misses */
  const rate = (i, every, by) => { let h = 0; for (let k = 0; k < 30; k++) { const o = envRun({ every, by }, 4001 + 7919 * k); if (E_ROUNDS[i].ok(o[EV.G].share)) h++; } return h / 30; };
  const e1 = [rate(0, 5, 4), rate(0, 0, 4)], e2 = [rate(1, 0, 4), rate(1, 5, 4), rate(1, 10, 6)], e3 = [rate(2, 10, 2), rate(2, 10, 6)];
  check("B one population, round 1 (the asexual line takes over): moving every 5 / never hits " + e1.map(pct).join(" / ") + " (measured 15 / 100%)", e1[0] <= 0.35 && e1[1] >= 0.9);
  check("B one population, round 2 (the sexual line holds): never / every 5 by 4 / every 10 by 6 hits " + e2.map(pct).join(" / ") + " (measured 0 / 85 / 86%)", e2[0] === 0 && e2[1] >= 0.65 && e2[2] >= 0.65);
  check("B one population, round 3 (asexual under half, every 10): by 2 / by 6 hits " + e3.map(pct).join(" / ") + " (measured 1 / 86%)", e3[0] <= 0.1 && e3[1] >= 0.65);
  /* one run read: the best value moves as set; once a line is gone it stays gone; the spread with sex is wider */
  const o = envRun({ every: 10, by: 4 }, 777), moves = o.slice(1).map(S => S.best);
  const steps = moves.every((b, t) => b === (Math.floor(t / 10) % 2 === 0 ? 12 : 4));
  let gone = true; for (let t = 1; t <= EV.G; t++) { if (o[t - 1].share === 1 && o[t].share !== 1) gone = false; if (o[t - 1].share === 0 && o[t].share !== 0) gone = false; }
  const st = envRun({ every: 0, by: 4 }, 778); let sexSd = 0, asexSd = 0, n = 0;
  for (let t = 1; t <= 40; t++) if (st[t].sex.n && st[t].asex.n) { sexSd += st[t].sex.sd; asexSd += st[t].asex.sd; n++; }
  check("B one population: the best value moves every 10 between 12 and 4; a line once gone stays gone; the first 40 generations, the trait's spread with sex " + (sexSd / n).toFixed(2) + " against without " + (asexSd / n).toFixed(2),
        steps && gone && n >= 5 && sexSd > asexSd);   /* stable, the asexual line takes over in ~10 generations, so the two overlap briefly */
  /* scoring: practice nothing; a scored Go records B4 when the run ends; the next target holds its sliders; three attempts finish B */
  const pr = document.getElementById("B_epractice"), ev = document.getElementById("B_every"), by = document.getElementById("B_by");
  const fin = () => { ER.run.t = 99; ER.run.shown = EV.G; E_endRun(); };
  const open1 = ev.value === "4" && by.value === "1" && by.disabled && !ev.disabled;
  pr.checked = true; E_sync(); E_go(); fin(); const practiced = ER.results.length === 0 && !ER.waiting;
  pr.checked = false; E_sync(); ev.value = "0"; E_sync(); E_go(); fin();
  const first = ER.results.length === 1 && ER.waiting && Score.getBit("scaffold", BIT.B4) === 1;
  const said = document.getElementById("B_envRead").textContent.replace(/\\s+/g, " ").match(/asexual (\\d+)% of the females/);
  const agrees = !!said && +said[1] === Math.round(100 * ER.last.out[EV.G].share);
  E_next(); const open2 = ev.value === "0" && by.value === "1" && !ev.disabled && !by.disabled;
  ev.value = "4"; E_go(); fin(); E_next();
  const open3 = ev.value === "3" && ev.disabled && by.value === "0" && !by.disabled;
  by.value = "2"; E_go(); fin();
  check("B one population: each target opens at its own settings, the held slider held; practice records nothing; a scored Go records its bit; the readout agrees with the run; three attempts finish B and open C",
        open1 && practiced && first && agrees && open2 && open3 && ER.done && Gates.B.done && Gates.C.open, [open1, practiced, first, agrees, open2, open3, ER.done, Gates.B.done].join(" "));
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
  /* the watch (JM 2026-10-09): every event makes what its name says, on the page's own rules */
  const want = { xo: rs => rs.every(r => r.one && r.order && r.mix),
                 deldup: rs => rs.some(r => r.one && r.missing.join("") === "BCDEF") && rs.some(r => r.one && r.dup.join("") === "BCDEF"),
                 loop: rs => rs.some(r => r.one && r.missing.join("") === "BCDEF") && rs.some(r => r.p.ring),
                 invBCD: rs => rs.some(r => r.one && r.all && ids(r.p) === "oA>D'C'B'<EF>GH"),
                 invEF: rs => rs.some(r => r.one && r.all && !r.order && ids(r.p).indexOf("F'E'") >= 0),
                 dic: rs => rs.some(r => r.cens === 2) && rs.some(r => r.cens === 0),
                 hetOut: rs => rs.every(r => r.one && r.all),
                 hetIn: rs => rs.some(r => r.cens === 2) && rs.some(r => r.cens === 0) };
  const sel = document.getElementById("C_event"), names = [], shut0 = !C_ready() && C_practising();
  let ok = true;
  for (let i = 0; i < C_EVENTS.length; i++) {
    sel.value = String(i); C_play(); let n = 0; while (CW.ev && n++ < 400) C_watchTick(0.02);
    const e = C_EVENTS[i]; if (!C.out || !C.out.watch || !want[e.id](C.out.rs)) { ok = false; names.push("✗" + e.id); } else names.push(e.id);
  }
  check("C watch: each of the " + C_EVENTS.length + " events plays and makes what it says (" + names.join(" ") + "); the targets wait until all are watched, then open",
        ok && shut0 && C_ready() && CW.watched.size === C_EVENTS.length && !/First watch/.test(document.getElementById("C_ttext").textContent));
  /* the last event watched was on the reversed board: the first touch puts the target's board back */
  const cv = document.getElementById("C_pair"), r = cv.getBoundingClientRect();
  const was = C.board; cv.dispatchEvent(new PointerEvent("pointerdown", { clientX: r.left + 20, clientY: r.top + 20, bubbles: true, pointerId: 1 }));
  check("C watch: after watching on the reversed board, the first touch puts the first target's board back", was === "inv" && C.board === "std" && !C.pair);
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
  check("C: no pairing, no Cross over; the first is a free try; practice records nothing; a miss records 0; five attempts finish C and open D (bits " + bits + ")",
        shut && tried && practiced && miss && bits === "01111" && C.board === "inv" && Gates.C.done && Gates.D.open && !document.getElementById("done-banner").classList.contains("shown"));
}

/* ================= D: an inversion in one population ================= */
{
  /* inside the inversion, every allele moves with it: no crossover inside it in a heterozygote, so the new allele at
     genes 4-8 is only ever on inverted chromosomes, and exactly as common as the inversion, every generation */
  let tied = true, fixedIn = 0, nIn = 0, gapsOut = 0, fixedOut = 0, nOut = 0, gapNoInv = 0;
  for (let i = 0; i < 60; i++) {
    const o = invRun({ inv: true, s: -0.3 }, 6000 + 13 * i);
    for (const S of o) for (let l = IV.A; l < IV.B; l++) if (Math.abs(S.f[l] - S.inv) > 1e-12) tied = false;
    nIn++; if (o[o.length - 1].f[IV.GOOD] === 1) { fixedIn++; const e = o[o.length - 1].f; gapsOut += (e[2] + e[8]) / 2; }
    const q = invRun({ inv: false, s: -0.3 }, 7000 + 13 * i); nOut++;
    if (q[q.length - 1].f[IV.GOOD] === 1) { fixedOut++; const e = q[q.length - 1].f; gapNoInv += 1 - (e[4] + e[6]) / 2; }
  }
  check("D: with the inversion, genes 4-8 carry the new allele exactly as often as the inversion, every generation of 60 runs; once it fixes, genes 3 and 9 average " + (gapsOut / Math.max(1, fixedIn)).toFixed(2),
        tied && fixedIn > 0 && gapsOut / fixedIn < 0.6);
  check("D: without it, genes 5 and 7 fall short of gene 6 by " + (gapNoInv / Math.max(1, fixedOut)).toFixed(2) + " on average once gene 6 fixes (measured 0.71); fixed " + fixedIn + " / " + fixedOut + " of 60 (measured ~61 / 57%)",
        fixedOut > 0 && gapNoInv / fixedOut > 0.4 && fixedIn / 60 > 0.4 && fixedIn / 60 < 0.8);
  const drift = (() => { let f = 0; for (let i = 0; i < 100; i++) { const o = invRun({ inv: true, s: 0 }, 8000 + 7 * i); if (o[o.length - 1].f[IV.GOOD] === 1) f++; } return f / 100; })();
  check("D: with s at 0 the inversion rarely fixes in " + IV.MAXG + " generations: " + pct(drift) + " (measured 1%)", drift <= 0.06);
  /* the flow: a run with the inversion and one without finish D, and the lesson */
  const txt = id => document.getElementById(id).textContent.replace(/\\s+/g, " ").trim(), inv = document.getElementById("D_inv");
  inv.checked = true; D_go(); DV.run.shown = DV.run.out.length - 1; D_endRun();
  const q1 = DV.last, rd = txt("D_read"), m = rd.match(/the inversion in (\\d+)%/);
  const agrees = !!m && +m[1] === Math.round(100 * q1.out[q1.out.length - 1].inv) && !Gates.D.done;
  inv.checked = false; D_go(); DV.run.shown = DV.run.out.length - 1; D_endRun();
  check("D: the readout agrees with the run; a run with the inversion and one without finish D, and the lesson", agrees && !/the inversion in/.test(txt("D_read")) && Gates.D.done && document.getElementById("done-banner").classList.contains("shown"), rd);
}
{
  const D = Object.keys(BIT).length; let n = 0; for (let i = 0; i < D; i++) if (Score.isAnswered("scaffold", i)) n++;
  check("all " + D + " declared bits written", D === 19 && n === D, n + " written");
}
{
  FIT_EPOCH++; paintAll();
  const over = [];
  for (const id of ["A_seq","A_runs","A_dnds","A_wheel","B_bench","B_spread","B_hist","B_plot","B_env","C_pair","C_out","D_pop","D_freq"]) { const cv = document.getElementById(id), host = cv.parentElement;
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
for (const s of ["A","B","C","D"]) document.getElementById("stage"+s).classList.remove("stage-locked");
FIT_EPOCH++; paintAll();
const over = [];
for (const id of ["A_seq","A_runs","A_dnds","A_wheel","B_bench","B_spread","B_hist","B_plot","B_env","C_pair","C_out","D_pop","D_freq"]) { const cv = document.getElementById(id), host = cv.parentElement;
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
    const okA = /OK 1000/.test(a.stdout || ""); console.log((okA ? "ok   " : "FAIL ") + "the R panel for A runs 1,000 populations" + (okA ? "" : "  -- " + (a.stderr || "").slice(0, 300))); if (!okA) bad = true;
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
