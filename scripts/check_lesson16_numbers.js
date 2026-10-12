#!/usr/bin/env node
/*
 * check_lesson16_numbers.js -- the checks for app/lessons/lesson16.html.
 *
 * Lesson 16 is a draft (first pass, 2026-10-08; A's targets 2026-10-09; B-D
 * rebuilt 2026-10-11): A eight targets, each one change to a real gene (E.
 * coli trpL) of a kind asked for, played out in 1,000 populations for 4N
 * generations, then dN/dS off the eight; B copy or mate, a plan for your line
 * played in 100 populations; C your DNA in pieces; D an inversion. What has
 * to hold:
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
 *   B (2026-10-11, rebuilt: a plan of copy / mate played in 100
 *      populations). A copy is its mother exactly and a whole copy of you; a
 *      young from mating never is, half are sons. The Price split (cov(w, z)
 *      + E(wΔz)) adds to the change in the females' average exactly, for your
 *      DNA and for whole copies; a mating ends whole copies in E(wΔz). Each
 *      world's window is hit by the intended plan and missed by the opening
 *      and the naive ones (re-measured, two runs of 100 populations each);
 *      a miss records 0 and the target stays; three hits finish B.
 *   C. pieces are runs of red; two females share what both carry at the same
 *      genes; each target hit by its plan and missed by its neighbours; two
 *      targets and a comparison finish C.
 *   D. a carrier of one inverted and one standard chromosome never crosses
 *      over inside the stretch; each target hit by its world and missed by
 *      the others; two finish the lesson.
 *   All. every canvas fits its panel (1500 and 1000 wide); a full run writes
 *      all 15 bits; the four R panels run (Rscript).
 *
 * Same harness as check_lesson15_numbers.js.
 *
 * Usage:  node scripts/check_lesson16_numbers.js      (~1.5 minutes)
 * Exit 0 iff every check passes. Needs Google Chrome and python3; Rscript
 * for the R panels (skipped, and said so, without it).
 */
const { spawn, spawnSync } = require("child_process");
const fs = require("fs"), path = require("path");

const ROOT = path.resolve(__dirname, "..");
const PORT = +process.env.PORT || 8798;
const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

const CANVAS_IDS = ["A_seq","A_runs","A_dnds","A_wheel","B_plan","B_side","B_board","B_young","B_time","B_price","C_board","C_pieces","C_time","D_board","D_time"];
const INNER = `
const CANVASES = ${JSON.stringify(CANVAS_IDS)};
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

/* ================= B: the engine ================= */
{
  const P = B_P({ env: 0, U: 0, N: 6 }), pop = cmStart(P, 11, B_you()); pop.theta = 12;
  const me = pop.F[0];
  cmStep(P, pop, "copy", 1, true);
  const mine = pop.F.filter(g => g.lin);
  const same = mine.length > 0 && mine.every(g => g.c[0] === me.c[0] && g.c[1] === me.c[1] && g.whole && cmRed(g) === 1);
  const sc = pop.seen.filter(y => y.lin), copiesOk = sc.length === 6 && sc.every(y => y.copy && !y.male);
  check("B: at U 0 a copy is its mother exactly (her own two chromosomes), a daughter, a whole copy of you; you had 6, " + mine.length + " lived", same && copiesOk);
  cmStep(P, pop, "mate", 2, true);
  const sm = pop.seen.filter(y => y.lin), sons = sm.filter(y => y.male).length, mated = pop.F.filter(g => g.lin);
  check("B: when your line mates, none of its young is a copy or whole; " + sons + " of " + sm.length + " are sons; a daughter's red " + mated.map(g => cmRed(g).toFixed(2)).slice(0, 6).join(" "),
        sm.length > 0 && sm.every(y => !y.copy) && sons > 0.25 * sm.length && sons < 0.75 * sm.length && mated.every(g => !g.whole && cmRed(g) <= 1));
}
{
  /* the Price split adds up exactly: for both your DNA and whole copies of you, cov(w, z) + E(wΔz) is the change in the
     females' average, every generation of 40 populations played copy, copy, mate, copy, mate, mate, copy (one wandering) */
  const P = B_P({ env: 1, U: 0.3, N: 7 }), s0 = cmStart(P, 21, B_you()), plan = ["copy", "copy", "mate", "copy", "mate", "mate", "copy"];
  let worst = 0, n = 0, oNeg = 0;
  for (let k = 0; k < 40; k++) {
    const p = { F: s0.F.slice(), M: s0.M.slice(), rng: mulberry32(500 + k), theta: 12, price: { gS: 0, gT: 0, oS: 0, oT: 0 } };
    plan.forEach((c, i) => {
      const F0 = p.F, zg = F0.length ? F0.reduce((a, g) => a + cmRed(g), 0) / F0.length : 0, zo = F0.length ? F0.filter(g => g.whole).length / F0.length : 0;
      let th = p.theta + gauss(p.rng); if (th < 6) th = 12 - th; if (th > 18) th = 36 - th; p.theta = th;
      cmStep(P, p, c, i + 1, false);
      if (!F0.length || !p.F.length) return;
      const zg1 = p.F.reduce((a, g) => a + cmRed(g), 0) / p.F.length, zo1 = p.F.filter(g => g.whole).length / p.F.length;
      worst = Math.max(worst, Math.abs(p.price.gS + p.price.gT - (zg1 - zg)), Math.abs(p.price.oS + p.price.oT - (zo1 - zo))); n++;
      if (c === "mate" && zo > 0 && zo1 === 0 && p.price.oT < 0) oNeg++;
    });
  }
  check("B: cov(w, z) + E(wΔz) equals the change in the females' average, your DNA and whole copies, in " + n + " generations (worst gap " + worst.toExponential(1) + "); a mating ends the whole copies in E(wΔz) (" + oNeg + " times)",
        n > 200 && worst < 1e-9 && oNeg > 20);
}
/* ================= B: the three worlds ================= */
{
  /* re-measured on the page: each plan played twice as practice (100 populations each); the window is on copies of you
     at the world's last generation. Measured (100 populations, three starts): still, 6 generations: copy 37, mate 0.8,
     every 5th 23-24, only at 6: 26-28; wandering 1, 30 generations: copy 8-12, every 5th 19-21, mate ~1; harmful
     changes 0.7, 100 generations: copy ~3, every 5th 29-31, every 20th ~13 */
  const pr = document.getElementById("B_practice"), fill = v => { document.getElementById("B_fill").value = v; B_fillPlan(B_world().N); };
  pr.checked = true; B_sync();
  const play = (round, plan) => { BG.round = round; B_openRound(); if (typeof plan === "string") fill(plan); else BG.plan = plan.slice(); const out = []; for (let k = 0; k < 2; k++) { B_go(); B_finishNow(); out.push(B_sum(BG.last, BG.last.w.N).copies); } return out; };
  const fmt = a => a.map(v => v.toFixed(1)).join("/"), r = B_ROUNDS;
  const r1 = { copy: play(0, "copy"), mate: play(0, "mate"), five: play(0, "5"), last: play(0, ["copy", "copy", "copy", "copy", "copy", "mate"]) };
  check("B world 1 (still, 6 generations, at least " + r[0].copies + "): copy " + fmt(r1.copy) + " hits; mate " + fmt(r1.mate) + ", every 5th " + fmt(r1.five) + ", only at the last " + fmt(r1.last) + " miss",
        r1.copy.every(v => v >= r[0].copies) && [r1.mate, r1.five, r1.last].every(a => a.every(v => v < r[0].copies)));
  const r2 = { copy: play(1, "copy"), five: play(1, "5"), mate: play(1, "mate") };
  check("B world 2 (wandering 1, 30 generations, at least " + r[1].copies + "): every 5th " + fmt(r2.five) + " hits; copy " + fmt(r2.copy) + ", mate " + fmt(r2.mate) + " miss",
        r2.five.every(v => v >= r[1].copies) && [r2.copy, r2.mate].every(a => a.every(v => v < r[1].copies)));
  const r3 = { copy: play(2, "copy"), five: play(2, "5"), twenty: play(2, "20") };
  const left = B_sum(BG.last, 100).alive;
  check("B world 3 (harmful changes 0.7, 100 generations, at least " + r[2].copies + "): every 5th " + fmt(r3.five) + " hits; copy " + fmt(r3.copy) + " (its populations die out), every 20th " + fmt(r3.twenty) + " miss",
        r3.five.every(v => v >= r[2].copies) && [r3.copy, r3.twenty].every(a => a.every(v => v < r[2].copies)));
  pr.checked = false; BG.round = 0; BG.results = []; B_openRound(); B_sync();
}
{
  /* the flow: the opening plan misses (the bit 0, the target stays); the right plan hits (the bit stays 0, Next target);
     three targets finish B and open C */
  const txt = id => document.getElementById(id).textContent.replace(/\\s+/g, " ").trim(), fill = v => { document.getElementById("B_fill").value = v; B_fillPlan(B_world().N); };
  const opening = BG.plan.every(c => c === "mate") && BG.plan.length === 6 && document.getElementById("B_env").disabled;
  B_go(); B_finishNow();
  const miss = Score.getBit("scaffold", BIT.B1) === 0 && !BG.waiting && txt("B_verdict") === "incorrect";
  fill("copy"); B_go(); B_finishNow();
  const hit = BG.waiting && Score.getBit("scaffold", BIT.B1) === 0 && !document.getElementById("B_next").hidden && txt("B_verdict") === "correct";
  B_nextRound(); fill("5"); B_go(); B_finishNow(); B_nextRound(); fill("5"); B_go(); B_finishNow();
  const bits = ["B1", "B2", "B3"].map(k => Score.getBit("scaffold", BIT[k])).join("");
  check("B: the opening plan misses and records 0; the right plan then hits, the bit still the first try's; three targets finish B and open C (bits " + bits + ")",
        opening && miss && hit && bits === "011" && BG.done && Gates.B.done && Gates.C.open && !document.getElementById("B_env").disabled);
}

/* ================= C: your DNA in pieces ================= */
{
  const mk = (a, b) => ({ c: [{ y: Uint8Array.from(a) }, { y: Uint8Array.from(b) }] });
  const z = n => new Array(40).fill(0), on = (s, e) => { const v = z(); for (let i = s; i < e; i++) v[i] = 1; return v; };
  const sh = C_shared(mk(on(5, 20), z()), mk(z(), on(12, 30))), pc = cmPieces({ y: Uint8Array.from(on(0, 3).map((v, i) => v || (i >= 10 && i < 14) ? 1 : 0)) });
  check("C: pieces of red found as runs (" + JSON.stringify(pc) + "); two females both red at genes 13-20 share exactly that (" + JSON.stringify(sh) + ")",
        JSON.stringify(pc) === "[[0,3],[10,4]]" && JSON.stringify(sh) === "[[12,8]]");
  /* each plan played twice as practice; measured (100 populations): copy 6 then mate 2: 42 females / pieces 26; copy 5,
     mate 3: 40 / 17; copy 8: 40 / 40; mate 8: 11 / 5.5 */
  const pr = document.getElementById("C_practice"); pr.checked = true; C_sync();
  const play = (round, nc) => { CG.round = round; const out = []; for (let k = 0; k < 2; k++) { C_newRun(); for (let t = 0; t < 8; t++) { document.getElementById("C_choice").value = t < nc ? "copy" : "mate"; C_stepOnce(); } out.push(C_sum(CG.run, 8)); } return out; };
  const ok = (r, S) => S.car >= r.car && S.piece >= r.lo && S.piece <= r.hi, f = a => a.map(S => S.car.toFixed(0) + "/" + S.piece.toFixed(1)).join(" ");
  const [c1, c2] = C_ROUNDS, a6 = play(0, 6), a8 = play(0, 8), a0 = play(0, 0), b5 = play(1, 5), b6 = play(1, 6);
  check("C target 1 (pieces " + c1.lo + "-" + c1.hi + ", " + c1.car + "+ females): copy 6 then mate " + f(a6) + " hits; copy 8 " + f(a8) + " and mate 8 " + f(a0) + " miss",
        a6.every(S => ok(c1, S)) && a8.every(S => !ok(c1, S)) && a0.every(S => !ok(c1, S)) && a8.every(S => S.piece === 40));
  check("C target 2 (pieces " + c2.lo + "-" + c2.hi + "): copy 5 then mate " + f(b5) + " hits; copy 6 then mate " + f(b6) + " misses (one generation of mating fewer, longer pieces)",
        b5.every(S => ok(c2, S)) && b6.every(S => !ok(c2, S)));
  pr.checked = false; CG.round = 0; CG.results = []; C_newRun(); C_sync();
  /* the flow: both targets and two females compared finish C */
  for (const [r, nc] of [[0, 6], [1, 5]]) { if (r) C_nextRound(); for (let t = 0; t < 8; t++) { document.getElementById("C_choice").value = t < nc ? "copy" : "mate"; C_stepOnce(); } }
  const done1 = CG.done && !Gates.C.done, bits = Score.getBit("scaffold", BIT.C1) + "" + Score.getBit("scaffold", BIT.C2);
  const q = CG.run, k = C_shown(q), F = q.pops[k].F, red = F.map((g, i) => [cmRed(g), i]).filter(x => x[0] > 0);
  CG.pick = [red[0][1]]; CG.pick.push(red[1][1]); CG.picked = true; C_checkDone();
  check("C: two targets (bits " + bits + "), then two females that both carry some of you compared, finish C and open D", done1 && bits === "11" && Gates.C.done && Gates.D.open);
}

/* ================= D: an inversion ================= */
{
  /* a carrier of one inverted and one standard chromosome never crosses over inside genes 9-16; two standard ones do */
  const P = Object.assign({}, D_P({ inv: true, U: 0, kill: false }), { xo: 0.5 }), rng = mulberry32(3);
  const ch = (v, inv) => { const c = cmHap(DW.L); c.a.fill(v); c.inv = inv; return c; };
  let mixedHet = 0, mixedStd = 0, invOk = true;
  for (let k = 0; k < 2000; k++) {
    const [g] = cmGamete(P, { c: [ch(1, 1), ch(0, 0)] }, rng), s = g.a.slice(DW.A, DW.B).reduce((a, b) => a + b, 0);
    if (s > 0 && s < DW.B - DW.A) mixedHet++; if (g.inv !== g.a[DW.A]) invOk = false;
    const [h] = cmGamete(P, { c: [ch(1, 0), ch(0, 0)] }, rng), t = h.a.slice(DW.A, DW.B).reduce((a, b) => a + b, 0);
    if (t > 0 && t < DW.B - DW.A) mixedStd++;
  }
  check("D: 2,000 gametes at a crossover chance of 0.5 a gap: one inverted + one standard, genes 9-16 always come whole from one (" + mixedHet + " mixed), with the arrangement they sit in; two standard, mixed " + mixedStd + " times",
        mixedHet === 0 && invOk && mixedStd > 1500);
}
{
  /* the targets, each setting played twice as practice. Measured (100 populations, six starts): the team lasts at 40
     in 55-70 populations inverted, 8-17 standard; at 100 with harm common, the fewest inside on the team's chromosomes
     1.33-1.67 inverted with two copies killing, 0.04-0.25 if two help, 0.00-0.67 standard */
  const sel = (inv, U, two) => { document.getElementById("D_inv").value = inv; document.getElementById("D_U").value = U; document.getElementById("D_two").value = two; };
  const pr = document.getElementById("D_practice"); pr.checked = true; D_sync();
  const play = (round, inv, U, two) => { DG.round = round; sel(inv, U, two); const out = []; for (let k = 0; k < 2; k++) { D_go(); D_finishNow(); out.push(D_sum(DG.last, DG.last.G)); } return out; };
  const i1 = play(0, "yes", "0.05", "fine"), s1 = play(0, "no", "0.05", "fine"), s1k = play(0, "no", "0.05", "kill");
  check("D target 1 (the team in 40+ populations at 40): inverted " + i1.map(S => S.pops).join("/") + " hits; standard " + s1.map(S => S.pops).join("/") + " (two kill " + s1k.map(S => S.pops).join("/") + ") misses",
        i1.every(S => S.pops >= 40) && s1.concat(s1k).every(S => S.pops < 40));
  const f = a => a.map(S => S.mT == null ? "–" : S.mT.toFixed(2)).join("/");
  const i2 = play(1, "yes", "0.5", "kill"), i2f = play(1, "yes", "0.5", "fine"), s2 = play(1, "no", "0.5", "kill"), i2r = play(1, "yes", "0.05", "kill");
  const j = S => D_ROUNDS[1].judge(S).ok, g = a => a.map(S => S.pops + ":" + (S.mT == null ? "–" : S.mT.toFixed(2))).join("/");
  check("D target 2 (at 100, the team in 40+ populations and the fewest inside its chromosomes 1+): inverted, harm common, two kill " + g(i2) + " (others " + i2.map(S => S.mO.toFixed(2)).join("/") + ") hits; two help " + g(i2f) + ", standard " + g(s2) + ", harm rare " + g(i2r) + " miss",
        i2.every(S => j(S) && S.mO < 0.2) && i2f.concat(s2, i2r).every(S => !j(S)) && i2f.concat(i2r).every(S => S.mT < 1));
  pr.checked = false; DG.round = 0; DG.results = []; DG.last = null; D_sync();
  sel("yes", "0.05", "fine"); D_go(); D_finishNow(); D_nextRound(); sel("yes", "0.5", "kill"); D_go(); D_finishNow();
  const bits = Score.getBit("scaffold", BIT.D1) + "" + Score.getBit("scaffold", BIT.D2);
  check("D: two targets (bits " + bits + ") finish D and the lesson", bits === "11" && Gates.D.done && document.getElementById("done-banner").classList.contains("shown"));
}
{
  const D = Object.keys(BIT).length; let n = 0; for (let i = 0; i < D; i++) if (Score.isAnswered("scaffold", i)) n++;
  check("all " + D + " declared bits written", D === 15 && n === D, n + " written");
}
{
  FIT_EPOCH++; paintAll();
  const over = [];
  for (const id of CANVASES) { const cv = document.getElementById(id), host = cv.parentElement;
    if (+cv.dataset.drawW > host.clientWidth + 1) over.push(id + " " + cv.dataset.drawW + ">" + host.clientWidth); }
  check("every canvas fits its panel (" + window.innerWidth + " wide)", over.length === 0, over.join(", "));
}
/* the R panels, for the runner to run */
A_code(); B_code(); C_code(); D_code();
say(bad ? ("FAILED " + bad) : "ALL BARS PASS");
say("RAN " + ran);
say("RA " + RTEXT.codeA.replace(/\\n/g, "\\\\n"));
say("RB " + RTEXT.codeB.replace(/\\n/g, "\\\\n"));
say("RC " + RTEXT.codeC.replace(/\\n/g, "\\\\n"));
say("RD " + RTEXT.codeD.replace(/\\n/g, "\\\\n"));
L.join(" ;; ");
`;

/* the fit check alone, in a narrower frame */
const INNER_NARROW = `
for (const s of ["A","B","C","D"]) document.getElementById("stage"+s).classList.remove("stage-locked");
FIT_EPOCH++; paintAll();
const over = [];
for (const id of ${JSON.stringify(CANVAS_IDS)}) { const cv = document.getElementById(id), host = cv.parentElement;
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
  for (const line of lines) if (!/^(RA|RB|RC|RD) /.test(line)) console.log(line);
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
    const b = rs(tagged("RB"), "\ncat('\\nOK', round(sum(sapply(fem, red)), 1), '\\n')");
    const okB = /OK [0-9.]+/.test(b.stdout || ""); console.log((okB ? "ok   " : "FAIL ") + "the R panel for B runs (the plan as set: " + ((b.stdout || "").match(/OK (.*)/) || ["", "-"])[1] + " copies of you)" + (okB ? "" : "  -- " + (b.stderr || "").slice(0, 300))); if (!okB) bad = true;
    const c = rs(tagged("RC"), "\ncat('\\nOK\\n')");
    const okC = /OK/.test(c.stdout || ""); console.log((okC ? "ok   " : "FAIL ") + "the R panel for C runs" + (okC ? "" : "  -- " + (c.stderr || "").slice(0, 300))); if (!okC) bad = true;
    const d = rs(tagged("RD").replace("for (t in 1:100)", "for (t in 1:8)"), "\ncat('\\nOK\\n')");
    const okD = /OK/.test(d.stdout || ""); console.log((okD ? "ok   " : "FAIL ") + "the R panel for D runs (8 generations here)" + (okD ? "" : "  -- " + (d.stderr || "").slice(0, 300))); if (!okD) bad = true;
  }
  cleanup();
  process.exit(bad ? 1 : 0);
}, 700);
