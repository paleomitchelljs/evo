#!/usr/bin/env node
/*
 * check_lesson16_numbers.js -- the checks for app/lessons/lesson16.html.
 *
 * Lesson 16 is a draft (first pass, 2026-10-08; A's targets 2026-10-09; B-D
 * rebuilt 2026-10-11): A eight targets, each one change to a real gene (E.
 * coli trpL) of a kind asked for, played out in 1,000 populations for 4N
 * generations, then dN/dS off the eight; B you, a sequence, in pieces; C copy
 * or mate, a plan for your line played in 100 populations; D an inversion.
 * What has to hold:
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
 *   B (2026-10-12: you are a specific sequence of nucleotides; later the
 *      same day, hermaphrodites; 2026-10-14: targets on frequency, the bar
 *      plot gone). Pieces are runs of red; two genomes share what both carry
 *      at the same places; your letters stay yours; a copy is its parent
 *      whole and a genome that copies is no one's mate; with no males
 *      copying does not multiply you (copies of you over all 100 near 1
 *      either way); "exactly you" is your two chromosomes letter for letter;
 *      target 1 (genomes exactly you) hit by copying and missed by any
 *      mating, target 2 (genomes carrying some of you) hit by mating late or
 *      throughout and missed by copying and by mating only early; the
 *      population menu picks the board's population and its dark line; no
 *      line under the plot (2026-10-17); two targets and a comparison finish B.
 *   C (copy or mate: a plan played in 100 populations; it was B until
 *      2026-10-12; hermaphrodites since that evening). A copy is its parent
 *      exactly and you, whole; a young from mating never is, and is half
 *      you. The Price split (cov(w, z) + E(wΔz), every genome a parent, a
 *      young from mating half to each) adds to the change in the genomes'
 *      average exactly, for your sequence and for you whole; a mating ends
 *      you whole in E(wΔz), while your sequence passes on as it was. Each
 *      world's window is hit by the intended plan and missed by the opening
 *      and the naive ones (re-measured, two runs of 100 populations each); a
 *      miss records 0 and the target stays; three hits finish C.
 *   D (rebuilt 2026-10-12: how common the inversion gets). A carrier of one
 *      inverted and one standard chromosome never crosses over inside the
 *      stretch; inverted, your haplotype and the inversion are the same
 *      chromosomes; with two copies killing no copy ever sits beside
 *      another; gene by gene, the haplotype's chromosomes part from the
 *      others inside the stretch and not far outside it; the genomes carrying
 *      a never-paired inversion carry more mutational load; each target hit
 *      by its world and missed by the others; four finish the lesson.
 *   All. every canvas fits its panel (1500 and 1000 wide); a full run writes
 *      all 17 bits; the four R panels run (Rscript).
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

const CANVAS_IDS = ["A_seq","A_runs","A_dnds","A_wheel","B_board","B_letters","B_time","C_plan","C_side","C_board","C_time","C_price","D_board","D_time","D_genes"];
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
  const popOpen = !el("A_pop").hidden && document.querySelectorAll("#A_pop button").length === 9 &&
    Array.from(document.querySelectorAll("#A_pop .pr span")).map(x => x.textContent).join("|") === "Change it to|Insert" &&
    document.querySelector('#A_pop button[data-act="del"]').textContent === "Delete";
  document.querySelector('#A_pop button[data-act="sub"][data-to="T"]').click();
  const changed = A.step === "set" && A.mut.kind === "sub" && A.mut.to === "T" && A.eff.kind === "nonsynonymous";
  A_openPop(10); const lockedSeq = el("A_pop").hidden && A.mut.pos === 41;
  const opened = shown("A_controls") && free("s") && free("h") && free("N") && txt("A_go") === "Go" && txt("A_verdict") === "" && !/Gly/.test(txt("A_effect"));
  check("A: target 1 asks for a synonymous change; a click opens the pop-up (3 + 4 + 2 buttons: Change it to, Insert, Delete); a change locks the sequence and opens s, h and N; the verdict and the protein wait for Go",
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
  /* the runs: no line under them since the declutter (JM, 2026-10-17); the run's 1,000 populations each extinct,
     still present or fixed */
  const q = A.lastRes;
  check("A: no line under the runs; the run's 1,000 populations are each extinct, still present or fixed",
        !document.getElementById("A_runsRead") && q.runs.length === 1000 && q.lost + q.here + q.fixed === 1000);
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
        bits === "01011111" && document.querySelectorAll("#A_table tr").length === 9 && /letter 31: [ACGT] deleted/.test(el("A_table").textContent) && A_changeText({ kind: "ins", pos: 4, to: "G" }) === "letter 5: G inserted");
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
        near(+dm[1], dB, 0.05) && near(+dm[2], dS) && near(+dm[3], dB / dS, 0.0051) && near(+dm[4], dH, 0.05) && near(+dm[5], dS) && near(+dm[6], dH / dS, 0.0051) &&   /* half the last printed place: 0.125 prints 0.13 */
        dH / dS < 1 && dB / dS > 1);
  /* after the eight: a change plays as practice, N free again, its kind said, nothing recorded */
  A_nextChange(); A_edit("sub", 50, "A");
  const sand = free("N") && txt("A_go") === "Practice run" && el("A_practice").disabled;
  play();
  check("A: after the eight, a change plays as practice with N free; its kind is said, nothing recorded: '" + txt("A_verdict") + "'",
        sand && /^that change is /.test(txt("A_verdict")) && A.rows.length === 8 && Array.from({ length: 8 }, (_, i) => bit("A" + (i + 1))).join("") === "01011111");
}

/* ================= B: you, a sequence, in pieces ================= */
{
  const mk = (a, b) => ({ c: [{ y: Uint8Array.from(a) }, { y: Uint8Array.from(b) }] });
  const z = n => new Array(40).fill(0), on = (s, e) => { const v = z(); for (let i = s; i < e; i++) v[i] = 1; return v; };
  const sh = B_shared(mk(on(5, 20), z()), mk(z(), on(12, 30))), pc = cmPieces({ y: Uint8Array.from(on(0, 3).map((v, i) => v || (i >= 10 && i < 14) ? 1 : 0)) });
  check("B: pieces of red found as runs (" + JSON.stringify(pc) + "); two genomes both red at places 13-20 share exactly that (" + JSON.stringify(sh) + ")",
        JSON.stringify(pc) === "[[0,3],[10,4]]" && JSON.stringify(sh) === "[[12,8]]");
  /* hermaphrodites: a copying genome's young are it, whole (its own two chromosomes); no genome that is not you gets any
     of you while you copy; then a mating cuts nothing the first time (both your chromosomes are you) */
  { let seed = 77, pop, me, n0 = 0, red, whole, clean, mine;
    do { pop = B_start(seed++); me = pop.F[0]; cmStep(B_P, pop, "copy", 1, false); red = pop.F.filter(g => cmRed(g) > 0); n0 = red.length;
         whole = red.every(g => g.c[0] === me.c[0] && g.c[1] === me.c[1]); clean = pop.F.every(g => cmRed(g) === 0 || cmRed(g) === 1);
         cmStep(B_P, pop, "mate", 2, false); mine = pop.F.filter(g => cmRed(g) > 0); } while ((!n0 || !mine.length) && seed < 200);
    const uncut = mine.every(g => g.c.every(c => { const n = c.y.reduce((x, v) => x + v, 0); return n === 0 || n === 40; }));
    check("B: a genome that copies leaves itself whole (" + n0 + " young lived, all you, both chromosomes its own) and mates with no one; the first mating after cuts none of you (" + mine.length + " young, every chromosome all red or none)",
          n0 > 0 && whole && clean && mine.length > 0 && uncut); }
  /* you are a sequence: every red place, in every genome of 100 populations after 4 copies and 4 matings, carries one of
     your two letters at that place; a grey one can match your letter only by chance (~1 in 4) */
  { const pr0 = document.getElementById("B_practice"); pr0.checked = true; B_sync(); B_newRun();
    for (let t = 0; t < 8; t++) { document.getElementById("B_choice").value = t < 4 ? "copy" : "mate"; B_stepOnce(); }
    let red = 0, mine = 0, grey = 0, same = 0;
    for (const p of BG.run.pops) for (const g of p.F) for (const c of g.c) for (let i = 0; i < 40; i++) {
      const yours = c.a[i] === B_SEQ[0][i] || c.a[i] === B_SEQ[1][i];
      if (c.y[i]) { red++; if (yours) mine++; } else { grey++; if (c.a[i] === B_SEQ[0][i]) same++; } }
    pr0.checked = false; B_sync();
    check("B: you are 80 letters (" + B_SEQ.map(r => r.map(v => "ACGT"[v]).join("").slice(0, 12)).join(" / ") + " ...); all " + red + " red places carry your letter there; grey ones match yours " + (100 * same / grey).toFixed(0) + "% of the time, by chance",
          B_SEQ.length === 2 && B_SEQ.every(r => r.length === 40) && red > 0 && mine === red && same / grey > 0.15 && same / grey < 0.4); }
  /* exactly you: your two chromosomes letter for letter, either way round; all red is not enough (a young of two of
     you is red throughout, its chromosomes your two crossed over) */
  { const you = B_you(), sw = { c: [you.c[1], you.c[0]] }, mixed = { c: [cmHap(40), cmHap(40)] };
    mixed.c[0].a.set(B_SEQ[0].slice(0, 20).concat(B_SEQ[1].slice(20))); mixed.c[1].a.set(B_SEQ[1]); mixed.c.forEach(c => c.y.fill(1));
    const differ = B_SEQ[0].slice(20).some((v, i) => v !== B_SEQ[1][20 + i]);
    check("B: exactly you is your two chromosomes letter for letter, either way round; a red-throughout genome with one chromosome your two crossed over is not",
          B_exact(you) && B_exact(sw) && (!differ || !B_exact(mixed)) && cmRed(mixed) === 1); }
  /* each plan played twice as practice. Measured (node, the page's engine; 100 populations; at generation 8, averaged
     over the populations still carrying you, min / median / max over starts):
       genomes exactly you   copy 8 (40 starts) see the page's comment; any mating 0.0-0.6 (one at the end), 0 (more)
       genomes carrying you  copy 2.6-5.7 · mate last 1 5.7-9.3 · last 2 8.8-12.5 · last 3 11.3-16.3 · mate 8 13.3-17.5 ·
                             mate first 2 then copy 5.1-7.1 · mate first 1 then copy 3.7-5.8
     copies of you over all 100 near 1 whatever the plan (expected exactly 1; one run of 100 populations has a standard
     error near 0.26 copying, so the band is wide) */
  const pr = document.getElementById("B_practice"); pr.checked = true; B_sync();
  const plan = (n, first) => Array.from({ length: 8 }, (_, t) => (first ? t < n : t >= 8 - n) ? "mate" : "copy");
  const play = (round, pl) => { BG.round = round; const out = []; for (let k = 0; k < 2; k++) { B_newRun(); for (let t = 0; t < 8; t++) { document.getElementById("B_choice").value = pl[t]; B_stepOnce(); } out.push(Object.assign(B_sum(BG.run, 8), { j: B_judge(B_rule(), B_sum(BG.run, 8)) })); } return out; };
  const [c1, c2] = B_ROUNDS, f = (a, k) => a.map(S => S[k] == null ? "–" : S[k].toFixed(1)).join("/");
  const a0 = play(0, plan(0)), a1 = play(0, plan(1)), a1f = play(0, plan(1, true)), a8 = play(0, plan(8));
  const b8 = play(1, plan(8)), b3 = play(1, plan(3)), b0 = play(1, plan(0)), b2f = play(1, plan(2, true));
  check("B: no males, so copying does not multiply you: copies of you over all 100 at generation 8, copy 8 " + a0.map(S => S.copiesAll.toFixed(2)).join("/") + ", mate 8 " + b8.map(S => S.copiesAll.toFixed(2)).join("/") +
        " (about 1 either way); mating spreads you, populations still carrying you " + a0.map(S => S.left).join("/") + " against " + b8.map(S => S.left).join("/"),
        a0.concat(b8).every(S => S.copiesAll > 0.25 && S.copiesAll < 2.2) && Math.min(...b8.map(S => S.left)) > Math.max(...a0.map(S => S.left)));
  check("B target 1 (" + c1.txt + ", where you last): copy 8 " + f(a0, "exact") + " hits; mate once at the end " + f(a1, "exact") + ", once at the start " + f(a1f, "exact") + ", mate 8 " + f(a8, "exact") + " miss",
        c1.meas === "exact" && a0.every(S => S.j.ok) && a1.concat(a1f, a8).every(S => !S.j.ok && S.exact < 1));
  /* the window closes on copying (its highest, 40 starts: 6.48); mating only early and copying after spreads you less
     than mating throughout, but it is mating, and may reach the window (5.1-7.1 over 12 starts; 8.0 once on the page) */
  const avg = (a, k) => a.reduce((x, S) => x + S[k], 0) / a.length;
  check("B target 2 (" + c2.txt + ", where you last): mate 8 " + f(b8, "car") + " and copy 5 then mate 3 " + f(b3, "car") + " hit; copy 8 " + f(b0, "car") + " misses; mate 2 then copy 6 " + f(b2f, "car") + " spreads you less than mate 8",
        c2.meas === "car" && b8.concat(b3).every(S => S.j.ok) && b0.every(S => !S.j.ok) && avg(b2f, "car") < avg(b8, "car"));
  /* the over-time panel: no line under it since the declutter (JM, 2026-10-17); the population menu picks the board's
     population (and its dark line), Start over goes back to the first still carrying you; no bar plot */
  { B_paint(); const q = BG.run, agrees = !document.getElementById("B_timeRead");
    const sel = document.getElementById("B_pop"), first = B_shown(q), other = (first + 7) % 100;
    sel.value = String(other + 1); sel.dispatchEvent(new Event("change"));
    const picked = B_shown(q) === other && /^Population /.test(document.getElementById("B_boardH").textContent) && document.getElementById("B_boardH").textContent.startsWith("Population " + (other + 1) + " ");
    BG.round = 0; B_restart(); const back = BG.popSel == null && sel.value === String(B_shown(BG.run) + 1);
    check("B: no line under the over-time plot; the population menu puts population " + (other + 1) + " on the board; Start over goes back to the first still carrying you; no bar plot",
          agrees && picked && back && !document.getElementById("B_pieces") && sel.options.length === 100); }
  pr.checked = false; BG.round = 0; BG.results = []; B_newRun(); B_sync();
  /* the flow: each round opens on its own measure; both targets and two genomes compared finish B */
  const m0 = document.getElementById("B_meas").value;
  for (const [r, pl] of [[0, plan(0)], [1, plan(8)]]) { if (r) B_nextRound(); for (let t = 0; t < 8; t++) { document.getElementById("B_choice").value = pl[t]; B_stepOnce(); } }
  const m1 = document.getElementById("B_meas").value;
  const done1 = BG.done && !Gates.B.done, bits = Score.getBit("scaffold", BIT.B1) + "" + Score.getBit("scaffold", BIT.B2);
  const q = BG.run, k = B_shown(q), F = q.pops[k].F, red = F.map((g, i) => [cmRed(g), i]).filter(x => x[0] > 0);
  const two = red.length >= 2;
  if (two) { BG.pick = [red[0][1]]; BG.pick.push(red[1][1]); BG.picked = true; B_checkDone(); }
  check("B: rounds open on their own measure (" + m0 + ", " + m1 + "); two targets (bits " + bits + "), then two genomes that both carry some of you compared, finish B and open C",
        m0 === "exact" && m1 === "car" && two && done1 && bits === "11" && Gates.B.done && Gates.C.open,
        "two " + two + " (" + red.length + " carriers shown) done1 " + done1 + " results " + BG.results.join(","));
}

/* ================= C: copy or mate, the engine ================= */
{
  const P = C_P({ env: 0, U: 0, N: 6 }), pop = cmStart(P, 11, C_you()); pop.theta = 12;
  const me = pop.F[0];
  cmStep(P, pop, "copy", 1, true);
  const mine = pop.F.filter(g => cmRed(g) > 0);
  const same = mine.length > 0 && mine.every(g => g.c[0] === me.c[0] && g.c[1] === me.c[1] && g.whole && cmRed(g) === 1);
  const sc = pop.seen.filter(y => y.mine), copiesOk = sc.length === 6 && sc.every(y => y.copy);
  check("C: at U 0 a copy is its parent exactly (its own two chromosomes), you whole; you had 6, " + mine.length + " lived; no one else got any of you", same && copiesOk && pop.F.every(g => cmRed(g) === 0 || cmRed(g) === 1));
  cmStep(P, pop, "mate", 2, true);
  const sm = pop.seen.filter(y => y.mine), mated = pop.F.filter(g => cmRed(g) > 0);
  check("C: when genomes carrying you mate, none of their young is a copy or whole; a young's red " + mated.map(g => cmRed(g).toFixed(2)).slice(0, 6).join(" "),
        sm.length > 0 && sm.every(y => !y.copy) && mated.length > 0 && mated.every(g => !g.whole && cmRed(g) <= 1));
}
{
  /* the Price split adds up exactly: for your sequence and for you whole, cov(w, z) + E(wΔz) is the change in the genomes'
     average, every generation of 40 populations played copy, copy, mate, copy, mate, mate, copy (one wandering); a mating
     ends you whole in E(wΔz); with both parents counted, your sequence's E(wΔz) in matings averages near 0 */
  const P = C_P({ env: 1, U: 0.3, N: 7 }), s0 = cmStart(P, 21, C_you()), plan = ["copy", "copy", "mate", "copy", "mate", "mate", "copy"];
  let worst = 0, n = 0, oNeg = 0, gT = 0, gS = 0, nm = 0;
  for (let k = 0; k < 40; k++) {
    const p = { F: s0.F.slice(), rng: mulberry32(500 + k), theta: 12, price: { gS: 0, gT: 0, oS: 0, oT: 0 } };
    plan.forEach((c, i) => {
      const F0 = p.F, zg = F0.length ? F0.reduce((a, g) => a + cmRed(g), 0) / F0.length : 0, zo = F0.length ? F0.filter(g => g.whole).length / F0.length : 0;
      let th = p.theta + gauss(p.rng); if (th < 6) th = 12 - th; if (th > 18) th = 36 - th; p.theta = th;
      cmStep(P, p, c, i + 1, false);
      if (!F0.length || !p.F.length) return;
      const zg1 = p.F.reduce((a, g) => a + cmRed(g), 0) / p.F.length, zo1 = p.F.filter(g => g.whole).length / p.F.length;
      worst = Math.max(worst, Math.abs(p.price.gS + p.price.gT - (zg1 - zg)), Math.abs(p.price.oS + p.price.oT - (zo1 - zo))); n++;
      if (c === "mate" && zo > 0 && zo1 === 0 && p.price.oT < 0) oNeg++;
      if (c === "mate" && zg > 0) { gT += p.price.gT; gS += Math.abs(p.price.gS); nm++; }
    });
  }
  check("C: cov(w, z) + E(wΔz) equals the change in the genomes' average, your sequence and you whole, in " + n + " generations (worst gap " + worst.toExponential(1) + "); a mating ends you whole in E(wΔz) (" + oNeg + " times); your sequence's E(wΔz) in matings averages " + (gT / nm).toFixed(4) + " (|cov| " + (gS / nm).toFixed(4) + ")",
        n > 200 && worst < 1e-9 && oNeg > 20 && Math.abs(gT / nm) < 0.004);
}
/* ================= C: the three worlds ================= */
{
  /* re-measured on the page: each plan played twice as practice (100 populations each); the window is on copies of you
     at the world's last generation. Measured (node, hermaphrodites, 12-16 starts, min-max): never changes, 6 generations:
     copy 6.5-9.1, only at the last 4.2-5.8, every 5th 3.3-4.5, mate 0.5-0.7; changes often and bad, 40 generations:
     60 generations, every 5th 1.7-4.2, copy 0.0 typically (1.4 once in 24), mate ~0.7; very bad, 100 generations: every 10th 16.1-22.5, copy 1.2-3.2, mate
     0.6-1.2 */
  const pr = document.getElementById("C_practice"), fill = v => { document.getElementById("C_fill").value = v; C_fillPlan(C_world().N); };
  pr.checked = true; C_sync();
  const play = (round, plan) => { CG.round = round; C_openRound(); if (typeof plan === "string") fill(plan); else CG.plan = plan.slice(); const out = []; for (let k = 0; k < 2; k++) { C_go(); C_finishNow(); out.push(C_sum(CG.last, CG.last.w.N).copies); } return out; };
  const fmt = a => a.map(v => v.toFixed(1)).join("/"), r = C_ROUNDS;
  const r1 = { copy: play(0, "copy"), mate: play(0, "mate"), five: play(0, "5"), last: play(0, ["copy", "copy", "copy", "copy", "copy", "mate"]) };
  check("C world 1 (still, 6 generations, at least " + r[0].copies + "): copy " + fmt(r1.copy) + " hits; mate " + fmt(r1.mate) + " and every 5th " + fmt(r1.five) + " miss (only at the last, mostly copying: " + fmt(r1.last) + ")",
        r1.copy.every(v => v >= r[0].copies) && [r1.mate, r1.five].every(a => a.every(v => v < r[0].copies)) && r1.last.every(v => v < Math.min(...r1.copy) + 2));
  /* world 2's naive plans are judged on their typical run (the mean of two): copying alone ends at 0 in most starts but
     reached 1.4 once in 20, where the best value stayed near where you began */
  const r2 = { copy: play(1, "copy"), five: play(1, "5"), mate: play(1, "mate") }, mean = a => (a[0] + a[1]) / 2;
  check("C world 2 (changes often, bad mutations, 60 generations, at least " + r[1].copies + "): every 5th " + fmt(r2.five) + " hits; copy " + fmt(r2.copy) + ", mate " + fmt(r2.mate) + " miss (their typical run)",
        r2.five.every(v => v >= r[1].copies) && [r2.copy, r2.mate].every(a => mean(a) < r[1].copies));
  const r3 = { copy: play(2, "copy"), ten: play(2, "10"), mate: play(2, "mate") };
  const left = C_sum(CG.last, 100).alive;
  check("C world 3 (very bad mutations, 100 generations, at least " + r[2].copies + "): every 10th " + fmt(r3.ten) + " hits; copy " + fmt(r3.copy) + " (its populations die out), mate " + fmt(r3.mate) + " miss",
        r3.ten.every(v => v >= r[2].copies) && [r3.copy, r3.mate].every(a => a.every(v => v < r[2].copies)));
  pr.checked = false; CG.round = 0; CG.results = []; C_openRound(); C_sync();
}
{
  /* the flow: the opening plan misses (the bit 0, the target stays); the right plan hits (the bit stays 0, Next target);
     three targets finish C and open D */
  const txt = id => document.getElementById(id).textContent.replace(/\\s+/g, " ").trim(), fill = v => { document.getElementById("C_fill").value = v; C_fillPlan(C_world().N); };
  const opening = CG.plan.every(c => c === "mate") && CG.plan.length === 6 && document.getElementById("C_env").disabled;
  C_go(); C_finishNow();
  const miss = Score.getBit("scaffold", BIT.C1) === 0 && !CG.waiting && txt("C_verdict") === "incorrect";
  fill("copy"); C_go(); C_finishNow();
  const hit = CG.waiting && Score.getBit("scaffold", BIT.C1) === 0 && !document.getElementById("C_next").hidden && txt("C_verdict") === "correct";
  C_nextRound(); fill("5"); C_go(); C_finishNow(); C_nextRound(); fill("10"); C_go(); C_finishNow();
  const bits = ["C1", "C2", "C3"].map(k => Score.getBit("scaffold", BIT[k])).join("");
  check("C: the opening plan misses and records 0; the right plan then hits, the bit still the first try's; three targets finish C and open D (bits " + bits + ")",
        opening && miss && hit && bits === "011" && CG.done && Gates.C.done && Gates.D.open && !document.getElementById("C_env").disabled);
}

/* ================= D: an inversion ================= */
{
  /* a carrier of one inverted and one standard chromosome never crosses over inside genes 9-16; two standard ones do */
  const P = Object.assign({}, D_P({ inv: true, two: "one" }), { xo: 0.5 }), rng = mulberry32(3);
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
  /* the targets, each setting played twice as practice. Measured (node, hermaphrodites, 60 genomes, 100 populations, 12
     starts): your haplotype lasts at 40 in 58-70 populations inverted, 5-22 standard; at 100, fewest inside on its
     chromosomes: kill 2.17-3.03, no better than none 0.33-0.76 (1.03 once on the page), as one 0.06-0.40; its share where it lasts 0.21-0.23 /
     0.46-0.50 / 0.92-0.97; at 50, fewest inside on the other chromosomes: as one 0.35-0.67, none 0.10 at most, kill 0.01,
     standard 0.04 */
  const sel = (inv, two) => { document.getElementById("D_inv").value = inv; document.getElementById("D_two").value = two; };
  const pr = document.getElementById("D_practice"); pr.checked = true; D_sync();
  const play = (round, inv, two) => { DG.round = round; sel(inv, two); const out = []; for (let k = 0; k < 2; k++) { D_go(); D_finishNow(); out.push(D_sum(DG.last, DG.last.G)); } return out; };
  const j = (r, S) => D_judge(D_ROUNDS[r], S).ok;
  const i1 = play(0, "yes", "one"), s1 = play(0, "no", "one"), s1k = play(0, "no", "kill");
  check("D target 1 (your haplotype in 40+ populations at 40): inverted " + i1.map(S => S.pops).join("/") + " hits; standard " + s1.map(S => S.pops).join("/") + " (two kill " + s1k.map(S => S.pops).join("/") + ") misses",
        i1.every(S => j(0, S)) && s1.concat(s1k).every(S => !j(0, S)));
  const g = a => a.map(S => S.pops + ":" + (S.share == null ? "–" : S.share.toFixed(2)) + ":" + (S.mT == null ? "–" : S.mT.toFixed(2))).join(" ");
  const k2 = play(1, "yes", "kill"), n2 = play(1, "yes", "none"), o2 = play(1, "yes", "one"), sk2 = play(1, "no", "kill");
  check("D target 2 (at 100: in 40+ populations, fewest harmful mutations inside its chromosomes 1.5+; populations:share:fewest): kill " + g(k2) + " hits; no better than none " + g(n2) + ", as one " + g(o2) + ", standard " + g(sk2) + " miss",
        k2.every(S => j(1, S)) && n2.concat(o2, sk2).every(S => !j(1, S)));
  /* the lock itself: with two copies killing, no copy of your haplotype ever sits beside another; inverted, the haplotype
     and the inversion are the same chromosomes; and the genomes carrying it carry more mutational load than the rest */
  play(1, "yes", "kill"); const qk = DG.last, neverK = qk.hist.every(H => H.every(st => st.paired == null || st.paired === 0));
  let sameK = true; for (const p of qk.pops) for (const gg of p.F) for (const c of gg.c) if (D_hap(c) !== !!c.inv) sameK = false;
  const Sk = D_sum(qk, 100), S0 = D_sum(qk, 10);
  /* gene by gene, kill at 100: inside the stretch your haplotype's chromosomes carry more harmful mutations than the others;
     at the ends of the chromosome (genes 1-4, 21-24), about as many */
  const sum = [new Float64Array(DW.L), new Float64Array(DW.L)], cnt = [0, 0];
  for (const p of qk.pops) for (const gg of p.F) for (const c of gg.c) { const k = D_hap(c) ? 1 : 0; cnt[k]++; for (let i = 0; i < DW.L; i++) sum[k][i] += c.h[i]; }
  const per = (k, gs) => gs.reduce((a, i) => a + sum[k][i], 0) / gs.length / cnt[k], inside = [8, 9, 10, 11, 12, 13, 14, 15], ends = [0, 1, 2, 3, 20, 21, 22, 23];
  const rIn = per(1, inside) / per(0, inside), rEnd = per(1, ends) / per(0, ends);
  check("D: two copies killing, no copy of your haplotype ever sits beside another (" + neverK + "); inverted, the haplotype and the inversion are the same chromosomes (" + sameK + "); gene by gene at 100, your haplotype's chromosomes carry " + rIn.toFixed(2) + "x the others' harmful mutations inside genes 9-16, " + rEnd.toFixed(2) + "x at the ends",
        neverK && sameK && rIn > 1.5 && rEnd > 0.7 && rEnd < 1.4);
  check("D: mutational load, kill: genomes carrying your haplotype " + D_f2(S0.lT) + " / the rest " + D_f2(S0.lO) + " at 10, " + D_f2(Sk.lT) + " / " + D_f2(Sk.lO) + " at 100 (carriers' load pulls ahead as the mutations pile up; the rest settle)",
        Sk.lT - Sk.lO > 0.015 && Sk.lT - Sk.lO > S0.lT - S0.lO && Sk.lO > 0.2 && Sk.lO < 0.35);
  const n3 = play(2, "yes", "none"), o3 = play(2, "yes", "one"), k3 = play(2, "yes", "kill"), s3 = play(2, "no", "one");
  check("D target 3 (at 100: in 40+ populations, on 40%+ of chromosomes where it lasts, fewest inside below 1.5): no better than none " + g(n3) + " and as one " + g(o3) + " hit; kill " + g(k3) + ", standard " + g(s3) + " miss; beside another, none " + n3.map(S => S.paired.toFixed(2)).join("/") + ", kill 0",
        n3.concat(o3).every(S => j(2, S)) && k3.concat(s3).every(S => !j(2, S)) && n3.every(S => S.paired > 0.2));
  const go4 = a => a.map(S => S.pops + ":" + (S.mO == null ? "–" : S.mO.toFixed(2))).join(" ");
  const o4 = play(3, "yes", "one"), n4 = play(3, "yes", "none"), k4 = play(3, "yes", "kill"), s4 = play(3, "no", "one");
  check("D target 4 (at 50: in 40+ populations, fewest inside on the other chromosomes 0.25+; populations:fewest on the others): as one " + go4(o4) + " hits (yours " + o4.map(S => D_f2(S.mT)).join("/") + "); no better than none " + go4(n4) + ", kill " + go4(k4) + ", standard " + go4(s4) + " miss",
        /* the others above yours on average over the two runs: run by run the two overlap at their tails (2026-10-14: others
           0.26 against yours 0.29 once; measured over 12 starts, yours 0.06-0.29, the others 0.35-0.67) */
        o4.every(S => j(3, S)) && o4.reduce((a, S) => a + S.mO - S.mT, 0) > 0 && n4.concat(k4, s4).every(S => !j(3, S)));
  pr.checked = false; DG.round = 0; DG.results = []; DG.last = null; D_openRound(); D_sync();
  /* the flow: the opening misses (bit 0); the right world hits; each round opens on a world that misses; four finish */
  const op1 = document.getElementById("D_inv").value === "no";
  D_go(); D_finishNow(); const miss = Score.getBit("scaffold", BIT.D1) === 0 && !DG.waiting;
  sel("yes", "one"); D_go(); D_finishNow(); D_nextRound();
  const op2 = document.getElementById("D_inv").value === "yes" && document.getElementById("D_two").value === "one";
  sel("yes", "kill"); D_go(); D_finishNow(); D_nextRound();
  const op3 = document.getElementById("D_two").value === "kill";
  sel("yes", "none"); D_go(); D_finishNow(); D_nextRound();
  const op4 = document.getElementById("D_two").value === "none";
  sel("yes", "one"); D_go(); D_finishNow();
  const bits = ["D1", "D2", "D3", "D4"].map(k => Score.getBit("scaffold", BIT[k])).join("");
  check("D: each round opens on a world that misses (" + [op1, op2, op3, op4].join(", ") + "); the opening run records 0; four targets (bits " + bits + ") finish D and the lesson",
        op1 && op2 && op3 && op4 && miss && bits === "0111" && Gates.D.done && document.getElementById("done-banner").classList.contains("shown"));
}
{
  const D = Object.keys(BIT).length; let n = 0; for (let i = 0; i < D; i++) if (Score.isAnswered("scaffold", i)) n++;
  check("all " + D + " declared bits written", D === 17 && n === D, n + " written");
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
    const b = rs(tagged("RB"), "\ncat('\\nOK\\n')");
    const okB = /OK/.test(b.stdout || ""); console.log((okB ? "ok   " : "FAIL ") + "the R panel for B runs" + (okB ? "" : "  -- " + (b.stderr || "").slice(0, 300))); if (!okB) bad = true;
    const c = rs(tagged("RC"), "\ncat('\\nOK', round(sum(vapply(pop, red, 0)), 1), '\\n')");
    const okC = /OK [0-9.]+/.test(c.stdout || ""); console.log((okC ? "ok   " : "FAIL ") + "the R panel for C runs (the plan as set: " + ((c.stdout || "").match(/OK (.*)/) || ["", "-"])[1] + " copies of you)" + (okC ? "" : "  -- " + (c.stderr || "").slice(0, 300))); if (!okC) bad = true;
    const d = rs(tagged("RD").replace("for (t in 1:100)", "for (t in 1:8)"), "\ncat('\\nOK\\n')");
    const okD = /OK/.test(d.stdout || ""); console.log((okD ? "ok   " : "FAIL ") + "the R panel for D runs (8 generations here)" + (okD ? "" : "  -- " + (d.stderr || "").slice(0, 300))); if (!okD) bad = true;
  }
  cleanup();
  process.exit(bad ? 1 : 0);
}, 700);
