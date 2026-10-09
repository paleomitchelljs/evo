#!/usr/bin/env node
/*
 * check_lesson15_numbers.js -- the checks for app/lessons/lesson15.html.
 *
 * Lesson 15 is a draft (fifteenth pass, 2026-10-09): A the snake game on a
 * neutral island, fifteen generations, a pedigree in three views and three
 * questions under it (six answers), then the island over time; B the same
 * on an island whose new alleles carry s and h, its plot, s and h in
 * generation N, and three questions (five answers); C play as a gamete -- a
 * sperm race, three targets, then a question; D the jumping gene: one
 * division, then a pedigree of cells, then the same with a preference. The
 * old D (a hierarchical Price equation) is app/archive/
 * lesson15_with_D_2026-10-09.html, its checks this file at 20b9c9b. What
 * has to hold:
 *
 *   Engine. fourteen founders, one new allele each; A's alleles do nothing,
 *      B's carry s and h on the 0.05 grid inside their ranges, s drawn from
 *      the curve the page draws (share below 0 re-derived here); a snake's
 *      multiplier is 1 - s, 1 - h s, 1 - h_a s_a - h_b s_b, multiplied
 *      across genes; a pair's young average (f1 m1 + f2 m2) / 2; a played
 *      snake with no young ends play and names why; a game always reaches
 *      generation 15.
 *   Pedigree. past rows show exactly the snakes that had young, the living
 *      row every snake; mates side by side; no lines without a click; a
 *      click on a bead / circle / snake selects that copy or snake in each
 *      view; lock adds, unlocking keeps the last.
 *   Score. a steered season counts its young, keeps the top score as the
 *      code's note, and opens Run to generation 15 (hidden before); a season
 *      let play itself adds nothing; the count stops when play ends, though
 *      the seasons after it breed the played snake's line on. Play again:
 *      the same founders, new seasons, the score from 0, the top score
 *      kept, and a read already answered keeps its first answer.
 *   Plot. every series re-derived from the rows: frequencies at a locus sum
 *      to 1; heterozygosity counted; distinct alleles as the winter card's;
 *      an allele's loss is its first generation with no copy; its time to
 *      MRCA is where all its living copies' lines first coincide, never more
 *      than its age, 0 when it arises; B's mean fitness is the mean
 *      multiplier. A click on a line, a dot or a copy picks that allele.
 *   s and h. generation N's bars count exactly the coloured copies alive.
 *   Questions, A. the six answers re-derived here from the snakes: the
 *      traced copy's parent, grandparent and great-grandparent copies; the
 *      pair's meeting copy (the first copy both lines share) and its depth;
 *      the commonest coloured allele, its origin, and the most recent copy
 *      every living copy passes through; the card shows one question, and
 *      they can be taken in any order; the last question in JM's words
 *      ("with a frequency of N out of M", "Select the origin of the
 *      allele"); a wrong click there says what the copy is; first answers
 *      record their own bit, misses do not shut a door; an allele that arose
 *      in a founder has its origin in generation 0 and a real click there is
 *      right (JM met one marked wrong; this is the guard); over fresh
 *      islands the meeting copy sits after the origin most of the time
 *      (measured 83%).
 *   Questions, B. JM's three titles; the highest and lowest fitness
 *      alleles left (ties all count), their meeting copies, the highest
 *      ever drawn; an allele step takes any pick, a copy step only a
 *      pedigree copy; answered out of order; the 200 islands agree with the
 *      measured direction (the highest's copies meet further back; the
 *      highest ever mostly gone).
 *   Run to generation 100 (B only). hidden until B's reads are done; then
 *      it runs the island to 100 with no generation below two snakes; the
 *      generations up to the reads' are untouched, no snake past the line's
 *      end is the player's, the reveal and every bit unchanged; the same
 *      island gives the same run; a deal that dies out is dealt again, and
 *      first deals rarely die (measured 0.6%). At 100 the series are
 *      re-derived again, s and h's dot strips grow rows instead of
 *      overlapping, lifespans keep 3 px a row, and every pedigree row fits.
 *   C, the race. half of every snake's sperm gold; each sperm reaches the
 *      egg's edge at its own time; gold's wins re-derived at four speeds;
 *      the drawn race's winner is the computer's, and a player steering at
 *      the egg arrives as an average sperm; Go waits for six races and a
 *      hundred more; each round: ×1.00 never hits, the right idea does
 *      (round 3 is JM's system since 2026-10-09: one gold copy 0.8, two
 *      sterile, so it takes ×1.2); each generation's change is exactly cov +
 *      E; practice records nothing, Go locks and records. The question:
 *      hidden until the three targets are taken, then on its own (the last
 *      target's verdict hidden); first answer = C4; the right one closes C.
 *   D, the jump. the four gametes re-derived strand by strand; staying put
 *      2 of 4, the other chromosome at least 3, the matching place 4; a copy
 *      on its own chromosome gets 3 at d/7; a division plays with no target.
 *   D, the cells. re-derived from each run: a cell divides exactly when
 *      none of its jumps landed in a gene; a daughter carries her mother's
 *      copies and jumps; every copy in a cell left at the end sits between
 *      genes; jumps land in genes at the genes' share of the DNA (no
 *      preference) and at (1 - preference) of it; how often any cell is
 *      left after five divisions against the measured table; the readout
 *      agrees with the run; D finishes on a division and one run of each
 *      panel, and that ends the lesson.
 *   All. every canvas fits its panel; a full run writes all 15 bits.
 *
 * Same harness as check_lesson14_numbers.js: the checks run inside a
 * same-origin iframe against the page's own functions; the report comes back
 * in a <pre>; the runner fails if fewer checks come back than ran.
 *
 * Usage:  node scripts/check_lesson15_numbers.js      (~1 minute)
 * Exit 0 iff every check passes. Needs Google Chrome and python3.
 */
const { spawn, spawnSync } = require("child_process");
const fs = require("fs"), path = require("path");

const ROOT = path.resolve(__dirname, "..");
const PORT = +process.env.PORT || 8797;
const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

const INNER = `
const L=[], say=s=>L.push(s);
let bad=0, ran=0;
const check=(name, ok, detail)=>{ ran++; if(!ok) bad++; say((ok?"ok   ":"FAIL ")+name+(detail?"  -- "+detail:"")); };
const near=(a,b,e)=>Math.abs(a-b)<=(e==null?1e-9:e);
for (const s of ["A","B","C","D"]) document.getElementById("stage"+s).classList.remove("stage-locked");
FIT_EPOCH++;

/* ================= engine ================= */
for (const key of ["A","B"]) {
  const w = WD[key], row = rowSnakes(w, 0);
  const one = row.every(s => { let c = 0; for (let l=0;l<LOCI;l++) for (const sd of [0,1]) if (w.AL[s.g[sd][l]].col) c++; return c === 1; });
  check(key+" fourteen founders, one new allele each, seven plain", row.length === N0 && one && w.AL.filter(a=>!a.col).length === LOCI, row.length+" founders");
}
check("A's alleles do nothing", WD.A.AL.every(a => a.s === 0 && a.h === 0));
{
  const ok = WD.B.AL.filter(a=>a.col).every(a => a.s >= S_LO-1e-9 && a.s <= S_HI+1e-9 && a.h >= 0 && a.h <= 1 && near(a.s*20, Math.round(a.s*20), 1e-6) && near(a.h*20, Math.round(a.h*20), 1e-6));
  check("B's alleles: s and h on the 0.05 grid, inside their ranges", ok);
  /* the curve the page draws is normal(S_MU, S_SD) clipped; the share rounding below -0.025 re-derived */
  const scratch = makeWorld("B"); scratch.srng = mulberry32(4242); scratch.rng = mulberry32(17);
  let neg = 0, n = 20000; for (let i=0;i<n;i++) { const id = newAllele(scratch, 0, 1, null, false); if (scratch.AL[id].s < 0) neg++; }
  const erf = x => { const t = 1/(1+0.3275911*Math.abs(x)); const y = 1-(((((1.061405429*t-1.453152027)*t)+1.421413741)*t-0.284496736)*t+0.254829592)*t*Math.exp(-x*x); return x<0?-y:y; };
  const want = 0.5*(1+erf((-0.025 - S_MU)/S_SD/Math.SQRT2));
  check("B's s comes from the drawn curve: share helpful "+(neg/n).toFixed(3)+" against "+want.toFixed(3), near(neg/n, want, 0.015));
}
{
  const w = makeWorld("B"); w.srng = mulberry32(5); found(w, 0);
  const mk = (s, h) => { w.AL.push({ locus: 0, born: 1, from: null, col: "#000", s, h }); return w.AL.length - 1; };
  const a = mk(-0.5, 0.5), b = mk(0.5, 0.2), c = mk(0.2, 1);
  const sn = { g: [Int32Array.from(rowSnakes(w,0)[0].g[0]), Int32Array.from(rowSnakes(w,0)[0].g[0])] };
  for (let l=0;l<LOCI;l++) { sn.g[0][l] = l; sn.g[1][l] = l; }       /* plain everywhere: the founders' plain ids are 0..6 */
  const m0 = multOf(w, sn);
  sn.g[0][0] = a; sn.g[1][0] = a; const m1 = multOf(w, sn);
  sn.g[1][0] = 0; const m2 = multOf(w, sn);
  sn.g[1][0] = b; const m3 = multOf(w, sn);
  sn.g[0][1] = c; sn.g[1][1] = c; const m4 = multOf(w, sn);
  check("multiplier: plain 1; two copies of s -0.5 = 1.5; one copy, h 0.5 = 1.25; two new alleles = 1 - h_a s_a - h_b s_b; across genes it multiplies",
        near(m0,1) && near(m1,1.5) && near(m2,1.25) && near(m3,1.15) && near(m4,1.15*0.8), [m0,m1,m2,m3,m4].map(x=>x.toFixed(3)).join(" "));
  sn.g[0][1] = mk(1, 1); sn.g[1][1] = sn.g[0][1];
  check("multiplier never below 0", multOf(w, sn) === 0);
  const A_ = { food: 3, g: [new Int32Array(LOCI).fill(0), new Int32Array(LOCI).fill(0)] }; for (let l=0;l<LOCI;l++){A_.g[0][l]=l;A_.g[1][l]=l;}
  const B_ = { food: 3, g: [Int32Array.from(A_.g[0]), Int32Array.from(A_.g[1])] }; B_.g[0][0] = a; B_.g[1][0] = a;
  const rng = mulberry32(9); let sum = 0; const N = 40000; for (let i=0;i<N;i++) sum += broodOf(w, A_, B_, rng);
  check("a pair's young average (f1 m1 + f2 m2) / 2: "+(sum/N).toFixed(3)+" against "+((3+3*1.5)/2).toFixed(3), near(sum/N, 3.75, 0.02));
}
{
  /* a played snake with no young ends play, and says why; with young, the player is one of them */
  const w = makeWorld("A"); found(w, 3);
  const row = rowSnakes(w, 0), me = w.SN.get(w.YOU.get(0)), others = row.filter(s => s !== me);
  for (const s of row) s.food = 2;
  me.fate = "hawk";
  breed(w, [[others[0], others[1]], [others[2], others[3]]], mulberry32(1));
  const ended = w.ended === "hawk" && !w.YOU.has(1);
  const w2 = makeWorld("A"); found(w2, 4);
  const r2 = rowSnakes(w2, 0), me2 = w2.SN.get(w2.YOU.get(0)), o2 = r2.filter(s => s !== me2); for (const s of r2) s.food = 2;
  breed(w2, [[me2, o2[0]]], mulberry32(2));
  const kid = w2.YOU.get(1);
  check("a played snake with no young ends play and names why; one with young is born again as one of them",
        ended && w2.ended == null && me2.kids.includes(kid), "ended " + w.ended + ", next " + kid);
}

/* ================= one steered season: the score and Run to generation 15 ================= */
{
  Score._state.notes = {}; delete TOP.A;
  const fast = document.getElementById("A_fast"), hiddenBefore = fast.hidden;
  startSeason("A", false);
  let k = 0; while (AR.on && k < 3000) { const me = youNow(); if (me && AR.sal.length) { let b = AR.sal[0]; for (const f of AR.sal) if (Math.hypot(f.x-me.x,f.y-me.y) < Math.hypot(b.x-me.x,b.y-me.y)) b = f; AR.pointer = { x: b.x, y: b.y }; } step(0.03); k++; }
  const card = AR.card, w = WD.A, young = card ? card.kids.length : -1;
  const counted = w.steered === 1 && w.tally === young && topScore(w) === young && (young ? Score.getNote("topScoreA") === String(young) : Score.getNote("topScoreA") == null);
  const runShown = w.phase === "ready" ? !document.getElementById("btnRun").hidden && !fast.hidden : fast.hidden;
  check("a steered season counts its young (" + young + ") and the top score keeps them; Run to generation 15 hidden before, shown after while play goes on",
        hiddenBefore && counted && runShown, "phase " + w.phase + ", tally " + w.tally);
  closeArena();
  if (w.phase === "ready") {
    /* a season let play itself: the line goes on, the score does not move */
    const t0 = w.tally, s0 = w.steered;
    startSeason("A", true); k = 0; while (AR.on && k < 3000) { step(0.03); k++; }
    check("a season let play itself adds nothing to the score", w.tally === t0 && w.steered === s0, w.tally + " / " + t0);
    closeArena();
  }
}

/* ================= island A: a whole game ================= */
const tallyBefore = WD.A.tally;
fastForward("A");
const wA = WD.A;
check("A runs to generation " + LASTS.A + " and opens its reads", wA.gen === LASTS.A && wA.phase === "done" && !!CH.A, "gen " + wA.gen + ", phase " + wA.phase);
check("the score stops when play ends: the seasons after add nothing, Run is gone",
      wA.tally === tallyBefore && document.getElementById("A_fast").hidden && /final/.test(document.getElementById("A_score").textContent), wA.tally + " / " + tallyBefore);

/* ================= the plot over time, re-derived ================= */
function checkSeries(key) {
  const w = WD[key], S = islandSeries(w), G = w.gen;
  let sum1 = true, hetOk = true, divOk = true, lossOk = true, tmOk = true, ageOk = true, fitOk = true;
  const dis = distinctAlleleSeries(w);
  for (let t = 0; t <= G; t++) {
    const row = rowSnakes(w, t);
    for (let l = 0; l < LOCI; l++) {
      let f = 0; for (const a of S.al) if (a.locus === l && a.f[t] != null) f += a.f[t];
      if (!near(f, 1, 1e-9)) sum1 = false;
      const h = row.filter(s => s.g[0][l] !== s.g[1][l]).length / row.length; if (!near(h, S.het[t][l])) hetOk = false;
    }
    if (S.div[t].reduce((a, b) => a + b, 0) !== dis[t]) divOk = false;
    if (w.sel && !near(S.fit[t].mean, row.reduce((a, s) => a + multOf(w, s), 0) / row.length)) fitOk = false;
  }
  for (const a of S.al) {
    const copies = t => { let c = 0; for (const s of rowSnakes(w, t)) c += (s.g[0][a.locus] === a.id) + (s.g[1][a.locus] === a.id); return c; };
    let first = null; for (let t = a.born; t <= G; t++) if (!copies(t)) { first = t; break; }
    if (first !== a.lost || (a.lost != null && a.f[a.lost] !== 0)) lossOk = false;
    if (!a.col) continue;
    for (let t = a.born; t < (a.lost == null ? G + 1 : a.lost); t++) { if (a.tm[t] > t - a.born || a.tm[t] < 0) ageOk = false; }
    if (a.tm[a.born] !== 0) ageOk = false;
    if (a.lost == null) {
      const ups = []; for (const sid of genOf(w, G)) for (const sd of [0, 1]) if (w.SN.get(sid).g[sd][a.locus] === a.id) ups.push(fullUp(w, { id: sid, side: sd, locus: a.locus }));
      let k = 0; while (new Set(ups.map(u => u[k].id + "|" + u[k].side)).size > 1) k++;
      if (k !== a.tm[G]) tmOk = false;
    }
  }
  check(key + " plot: frequencies at each locus sum to 1; heterozygosity counted; distinct alleles as the winter card's" + (w.sel ? "; mean fitness the mean multiplier" : ""), sum1 && hetOk && divOk && fitOk);
  check(key + " plot: an allele is lost in its first generation with no copy; time to MRCA re-derived from the copies' lines, 0 when it arises, never past its age", lossOk && tmOk && ageOk, [lossOk, tmOk, ageOk].join(" "));
  /* every measure draws, at every locus choice; a click on a line picks its allele */
  let drew = true; for (const m of TMEAS) if (!m.sel || w.sel) for (const l of [-1, 0, 6]) { try { setMeasure(key, m.k, l); } catch (e) { drew = false; } }
  setMeasure(key, "freq", 2); PICK[key] = null; drawTime(key);
  const h = TP[key].hits.find(x => x.pts && x.pts.length > 2), cv = document.getElementById(key + "_time"), r = cv.getBoundingClientRect();
  const pt = h.pts[1];
  cv.dispatchEvent(new MouseEvent("click", { clientX: r.left + pt[0], clientY: r.top + pt[1], bubbles: true }));
  const picked = PICK[key] === h.id || TP[key].hits.some(o => o.id === PICK[key] && o.pts && o.pts.some(q => Math.hypot(q[0] - pt[0], q[1] - pt[1]) < 6));
  check(key + " plot: every measure draws at every locus choice; a click on a line picks that allele", drew && picked, "picked " + PICK[key] + " / " + h.id);
  PICK[key] = null; TP[key].hover = null;
}
checkSeries("A");
{
  let ok = true, why = "";
  for (let t = 0; t <= wA.gen; t++) {
    const shown = new Set(shownRow(wA, t)), all = genOf(wA, t);
    for (const id of all) { const want = t === wA.gen || wA.SN.get(id).kids.length > 0; if (shown.has(id) !== want) { ok = false; why = "gen " + t + " snake " + id; } }
  }
  check("past rows show exactly the snakes that had young; the living row every snake", ok, why);
  const P = PV.A, Lay = pedLayout(wA, P, 1200); let adj = true;
  for (let t = 0; t < wA.gen; t++) for (const id of shownRow(wA, t)) { const m = mateOf(wA, id); if (m == null) { adj = false; continue; }
    if (Math.abs(Math.abs(Lay.pos.get(id).x - Lay.pos.get(m).x) - Lay.slot) > 1e-6) adj = false; }
  check("mates sit side by side", adj);
}
/* clicks: no lines without one; each view selects what was clicked; lock adds, unlock keeps the last */
{
  const key = "A", P = PV.A, cv = document.getElementById("A_ped"); P.sel = []; P.last = null; P.lock = false;
  document.getElementById("A_lock").checked = false;
  const at = (xy) => { const r = cv.getBoundingClientRect(); return { clientX: r.left + xy.x, clientY: r.top + xy.y, bubbles: true }; };
  const last = genOf(wA, wA.gen), id0 = last[2], id1 = last[5];
  let res = [];
  for (const v of ["chr", "loc", "org"]) {
    setView(key, v); P.locus = 3; setView(key, v);
    const c = v === "org" ? { kind: "snake", id: id0 } : { kind: "copy", id: id0, side: 1, locus: 3 };
    const xy = v === "org" ? snakeXY(P.lay, id0) : copyXY(P.lay, P, c);
    cv.dispatchEvent(new MouseEvent("mousemove", at(xy)));
    const noHover = P.sel.length === 0;
    cv.dispatchEvent(new MouseEvent("click", at(xy)));
    res.push(v + ":" + (noHover && P.last && itemKey(P.last) === itemKey(c) ? "ok" : "no"));
    P.sel = []; P.last = null;
  }
  check("no lines without a click; a click selects that copy or snake in each view", res.every(s => /ok$/.test(s)), res.join(" "));
  setView(key, "chr");
  const c0 = { kind: "copy", id: id0, side: 0, locus: 2 }, c1 = { kind: "copy", id: id1, side: 1, locus: 4 };
  cv.dispatchEvent(new MouseEvent("click", at(copyXY(P.lay, P, c0))));
  cv.dispatchEvent(new MouseEvent("click", at(copyXY(P.lay, P, c1))));
  const replaced = P.sel.length === 1 && itemKey(P.sel[0]) === itemKey(c1);
  const lk = document.getElementById("A_lock"); lk.checked = true; lk.dispatchEvent(new Event("change"));
  cv.dispatchEvent(new MouseEvent("click", at(copyXY(P.lay, P, c0))));
  const added = P.sel.length === 2;
  lk.checked = false; lk.dispatchEvent(new Event("change"));
  const kept = P.sel.length === 1 && itemKey(P.sel[0]) === itemKey(c0);
  /* a second click on the same copy keeps it picked (it used to clear it: an answer that is the same copy twice could
     not be given, JM 2026-10-09); Clear is what clears */
  cv.dispatchEvent(new MouseEvent("click", at(copyXY(P.lay, P, c0))));
  const twice = P.sel.length === 1 && P.last && itemKey(P.last) === itemKey(c0);
  document.getElementById("A_clear").click();
  const cleared = P.sel.length === 0 && !P.last;
  check("unlocked a click replaces; lock adds; unlocking keeps the last click; a second click keeps the copy picked; Clear clears", replaced && added && kept && twice && cleared, [replaced, added, kept, twice, cleared].join(" "));
  check("a copy clicked in the pedigree picks its allele on the plot", PICK.A === wA.SN.get(c0.id).g[c0.side][c0.locus]);
  P.sel = []; P.last = null;
}

/* the reads, re-derived from the snakes */
function upBy(w, c, k) { let id = c.id, side = c.side; for (let i = 0; i < k; i++) { const o = w.SN.get(id).src[side]; side = o.h[c.locus]; id = o.p; } return { id, side, locus: c.locus }; }
function fullUp(w, c) { const out = [{ id: c.id, side: c.side }]; let s = w.SN.get(c.id), side = c.side; while (s.src) { const o = s.src[side]; side = o.h[c.locus]; s = w.SN.get(o.p); out.push({ id: s.id, side }); } return out; }
const same = (a, b) => a && b && a.id === b.id && a.side === b.side && a.locus === b.locus;
function checkReads(key) {
  const w = WD[key], c = CH[key];
  const ups = [1,2,3].map(k => upBy(w, c.trace, k));
  check(key + " the traced copy's parent, grandparent, great-grandparent copies", ups.every((u, i) => same(u, c.up[i])) && ups.every((u, i) => w.SN.get(u.id).gen === w.gen - 1 - i));
  const p = c.pair, A = fullUp(w, p.a), B = fullUp(w, p.b);
  let d = -1; for (let i = 0; i < Math.min(A.length, B.length); i++) if (A[i].id === B[i].id && A[i].side === B[i].side) { d = i; break; }
  const m = d >= 0 ? Object.assign({ locus: p.a.locus }, A[d]) : null;
  let inBand = 0; const last = genOf(w, w.gen);
  for (let l = 0; l < LOCI; l++) for (let i = 0; i < last.length; i++) for (let j = i+1; j < last.length; j++) for (const si of [0,1]) for (const sj of [0,1]) {
    const q = coalesce(w, { id: last[i], side: si }, { id: last[j], side: sj }, l); if (q && q.d >= 3 && q.d <= 8) inBand++; }
  check(key + " the pair's meeting copy is the first both lines share, " + d + " generations back (3-8 where the record has such a pair: " + inBand + " do)",
        m && same(m, p.m) && p.a.id !== p.b.id && p.a.locus === p.b.locus && (inBand === 0 || (d >= 3 && d <= 8)));
  const al = c.allele;
  if (!al) { check(key + " the commonest coloured allele (none with three copies: Run one more generation)", !!document.getElementById(key + "_more") && !document.getElementById(key + "_more").hidden); return; }
  const cnt = new Map(); for (const id of last) { const s = w.SN.get(id); for (let l=0;l<LOCI;l++) for (const sd of [0,1]) { const v = s.g[sd][l]; if (w.AL[v].col) cnt.set(v, (cnt.get(v)||0)+1); } }
  const mx = Math.max(...cnt.values());
  check(key + " the read allele is the commonest coloured one: " + al.n + " of " + al.of + " copies", cnt.get(al.id) === al.n && al.n === mx && al.of === 2 * last.length);
  const a = w.AL[al.id];
  check(key + " its origin is the copy where it arose", same(al.origin, { id: a.from.snake, side: a.from.side, locus: a.locus }) && w.SN.get(a.from.snake).g[a.from.side][a.locus] === al.id);
  const mg = w.SN.get(al.mrca.id).gen, through = al.copies.every(cp => { const u = fullUp(w, { id: cp.id, side: cp.side, locus: al.locus }); const x = u[w.gen - mg]; return x.id === al.mrca.id && x.side === al.mrca.side; });
  const below = new Set(al.copies.map(cp => { const u = fullUp(w, { id: cp.id, side: cp.side, locus: al.locus }); const x = u[w.gen - mg - 1]; return x.id + "|" + x.side; }));
  check(key + " every living copy passes through its meeting copy (generation " + mg + "), and a generation later they are " + below.size + " copies, not one",
        through && (mg === w.gen || below.size > 1) && mg >= a.born);
}
checkReads("A");
{
  /* answering through the card: a first miss records 0 and the question stays open; a snake is not a copy; the last
     question first (any order); a wrong origin, and the origin offered as the meeting copy, each say what they are */
  const c = CH.A, P = PV.A, txt = id => document.getElementById(id).textContent.replace(/\\s+/g, " ").trim();
  const card1 = txt("A_qno") === "Question 1 of 3" && txt("A_qtext") === "Follow one copy back three generations.";
  P.last = { kind: "copy", id: c.trace.id, side: c.trace.side, locus: c.trace.locus }; Chal.answer("A");
  const missed = c.prog[0] === 0 && Score.getBit("scaffold", BIT.A1) === 0;
  P.last = { kind: "snake", id: c.up[0].id }; Chal.answer("A");
  const snakeRefused = c.prog[0] === 0;
  qStep("A", -1);
  const al = c.allele, onLast = QV.A === 2 && (!al || (/with a frequency of \\d+ out of \\d+[.]$/.test(txt("A_qtext")) && /^Select the origin of the allele/.test(txt("A_ask"))));
  let wrongOrigin = "", wrongMeet = "", want5 = "1", want6 = "1";
  if (al) {
    const liv = al.copies.find(x => !(x.id === al.origin.id && x.side === al.origin.side));
    if (liv) { P.last = { kind: "copy", id: liv.id, side: liv.side, locus: al.locus }; Chal.answer("A"); wrongOrigin = txt("A_fb"); want5 = "0"; }
    P.last = Object.assign({ kind: "copy" }, Chal.want(c, 2)); Chal.answer("A");
    if (!same(al.origin, al.mrca)) { P.last = Object.assign({ kind: "copy" }, al.origin); Chal.answer("A"); wrongMeet = txt("A_fb"); want6 = "0"; }
    P.last = Object.assign({ kind: "copy" }, Chal.want(c, 2)); Chal.answer("A");
  }
  const lastDone = !al || (Chal.solved(c, 2) && (!wrongOrigin || /carries it, but it was copied from an earlier one/.test(wrongOrigin)) && (!wrongMeet || /their lines meet in a later copy/.test(wrongMeet)));
  for (const q of [0, 1]) { QV.A = q; let n = 0; while (!Chal.solved(c, q) && n++ < 5) { const wnt = Chal.want(c, q); if (!wnt) break; P.last = { kind: "copy", id: wnt.id, side: wnt.side, locus: wnt.locus }; Chal.answer("A"); } }
  if (!al) { QV.A = 2; Chal.more("A"); let n = 0; while (c.allele && !Chal.solved(c, 2) && n++ < 3) { P.last = Object.assign({ kind: "copy" }, Chal.want(c, 2)); Chal.answer("A"); } }
  const bits = ["A1","A2","A3","A4","A5","A6"].map(k => Score.getBit("scaffold", BIT[k])).join(""), want = "0111" + want5 + want6;
  check("A: the card shows one question; a first miss records 0 and the question stays open; a snake is not a copy; the last question first, in JM's words; a wrong origin and the origin offered as the meeting copy say what they are; B opens",
        card1 && missed && snakeRefused && onLast && lastDone && c.done && (al ? bits === want : bits.slice(0, 4) === "0111") && Gates.B.open, "bits " + bits + " (want " + want + "); " + wrongOrigin + " | " + wrongMeet);
}
{
  /* Play again: the same founders, new seasons; score from 0, top score kept; reads dealt anew, first answers kept */
  const w = WD.A, founders = JSON.stringify(rowSnakes(w, 0).map(s => [Array.from(s.g[0]), Array.from(s.g[1])]));
  const row1 = JSON.stringify(rowSnakes(w, 1).map(s => s.parents)), top = topScore(w), bits0 = Score.getBit("scaffold", BIT.A1);
  const again = document.getElementById("A_again"), shown = !again.hidden;
  again.click();
  const fresh = w.gen === 0 && w.games === 1 && w.tally === 0 && topScore(w) === top && CH.A === null && again.hidden &&
                JSON.stringify(rowSnakes(w, 0).map(s => [Array.from(s.g[0]), Array.from(s.g[1])])) === founders;
  fastForward("A");
  const c = CH.A, P = PV.A;
  P.last = { kind: "copy", id: c.up[0].id, side: c.up[0].side, locus: c.up[0].locus }; Chal.answer("A");
  const kept = c.prog[0] === 1 && Score.getBit("scaffold", BIT.A1) === bits0;
  check("Play again (shown once the line ends): the same founders, the score from 0, the top score kept; new seasons; a read answered before keeps its first answer",
        shown && fresh && JSON.stringify(rowSnakes(w, 1).map(s => s.parents)) !== row1 && kept && Gates.B.open);
}
{
  /* JM 2026-10-09: "the allele 1st arose in the founding generation. But selecting the founding generation is listed as
     incorrect". Islands until the commonest allele arose in a founder; a real click on its ringed copy, then This one. */
  const w = WD.A, P = PV.A, txt = id => document.getElementById(id).textContent.replace(/\\s+/g, " ").trim();
  let res = null, salt = 0;
  for (salt = 1; salt < 60 && !res; salt++) {
    found(w, salt); CH.A = null; QV.A = 0; P.sel = []; P.last = null; P.lock = false; document.getElementById("A_lock").checked = false;
    fastForward("A");
    const c = CH.A; if (!c || !c.allele || w.AL[c.allele.id].born !== 0) continue;
    QV.A = 2; setView("A", "chr"); Chal.sync("A");
    const cv = document.getElementById("A_ped"), r = cv.getBoundingClientRect(), o = c.allele.origin, xy = copyXY(P.lay, P, { id: o.id, side: o.side, locus: o.locus });
    cv.dispatchEvent(new MouseEvent("click", { clientX: r.left + xy.x, clientY: r.top + xy.y, bubbles: true }));
    document.getElementById("A_this").click();
    res = { gen0: w.SN.get(o.id).gen === 0, ringed: w.SN.get(o.id).g[o.side][o.locus] === c.allele.id, fb: txt("A_fb"), prog: c.prog[2] };
  }
  check("A: an allele that arose in a founder (island " + (salt - 1) + "): its origin is in generation 0, and a click on it there is right",
        !!res && res.gen0 && res.ringed && /^correct/.test(res.fb) && res.prog === 1, JSON.stringify(res));
}
{
  /* JM 2026-10-09: "Part A doesn't seem to clear". Every question answered with real clicks and This one, on an island
     where the allele's origin is also where its living copies meet (the same copy picked twice running) */
  const w = WD.A, P = PV.A, txt = id => document.getElementById(id).textContent.replace(/\\s+/g, " ").trim();
  let c = null, salt = 0;
  for (salt = 1; salt < 80; salt++) {
    found(w, salt); CH.A = null; QV.A = 0; P.sel = []; P.last = null; P.lock = false; document.getElementById("A_lock").checked = false;
    fastForward("A"); c = CH.A;
    if (c && c.allele && same(c.allele.origin, c.allele.mrca)) break;
    c = null;
  }
  let log = [];
  if (c) {
    setView("A", "chr");
    const cv = document.getElementById("A_ped");
    let guard = 0;
    while (!c.done && guard++ < 12) {
      const wnt = Chal.want(c, QV.A), r = cv.getBoundingClientRect(), xy = copyXY(P.lay, P, { id: wnt.id, side: wnt.side, locus: wnt.locus });
      cv.dispatchEvent(new MouseEvent("click", { clientX: r.left + xy.x, clientY: r.top + xy.y, bubbles: true }));
      document.getElementById("A_this").click(); log.push(txt("A_fb").slice(0, 12));
    }
  }
  check("A: every question answered with real clicks closes the card, on an island where the origin is the meeting copy too (island " + salt + ")",
        !!c && c.done && log.length === 6 && log.every(t => /^correct/.test(t)), log.join(" | "));
}

/* ================= island B ================= */
fastForward("B");
check("B runs to generation " + LASTS.B + " (JM 2026-10-09: 30, A stays at " + LASTS.A + "); Run to generation " + LONG + " hidden until its reads are done", LASTS.B === 30 && WD.B.gen === LASTS.B && !!CH.B && document.getElementById("B_long").hidden);
checkSeries("B");
{
  /* JM 2026-10-09: "double the mutation rate for 15b": two new alleles a generation on B, one on A, each in its own copy */
  const per = w => { const n = []; for (let t = 1; t <= w.gen; t++) n.push(w.AL.filter(a => a.col && a.born === t).length); return n; };
  const nB = per(WD.B), nA = per(WD.A);
  check("new alleles a generation: island B " + nB.join("") + ", island A " + nA.join(""), nB.length >= 15 && nB.every(v => v === 2) && nA.length >= 1 && nA.every(v => v === 1));
}
{
  /* s and h in generation N: the bars count the coloured copies alive, their mean is the copies' */
  const w = WD.B;
  let ok = true;
  for (let N = 0; N <= w.gen; N++) {
    const D = distStats(w, N); let n = 0, sm = 0;
    for (const s of rowSnakes(w, N)) for (let l = 0; l < LOCI; l++) for (const sd of [0, 1]) { const a = w.AL[s.g[sd][l]]; if (a.col) { n++; sm += a.s; } }
    if (D.copies !== n || (n && !near(D.sCopies, sm / n))) ok = false;
    if (D.alive.some(id => w.AL[id].born > N) || D.gone.some(id => D.cnt[id])) ok = false;
  }
  DN.n = null; drawDist();
  const h = DH.hits[0], cv = document.getElementById("B_dist"), r = cv.getBoundingClientRect();
  cv.dispatchEvent(new MouseEvent("click", { clientX: r.left + h.x, clientY: r.top + h.y, bubbles: true }));
  check("B s and h: generation N's bars are exactly the coloured copies alive, their mean the copies' mean; a dot picks its allele", ok && PICK.B === h.id);
  PICK.B = null;
}
{
  /* "Run one more generation" when fewer than two alleles with different s are left */
  const c0 = CH.B, g0 = WD.B.gen; c0.short = true; ChalB.sync("B");
  const shown = !document.getElementById("B_more").hidden && document.getElementById("B_this").disabled;
  ChalB.more("B");
  check("B: with fewer than two alleles to compare, Run one more generation runs one and the reads are dealt again", shown && WD.B.gen === g0 + 1 && CH.B !== c0);
  /* the islands differ from run to run (the page's seed is random per load): if the new deal is short too, press it
     again, as a student would */
  for (let k = 0; CH.B.short && k < 6; k++) ChalB.more("B");
}
{
  const w = WD.B, c = CH.B, G = w.gen;
  const alive = []; for (const sid of genOf(w, G)) for (let l = 0; l < LOCI; l++) for (const sd of [0, 1]) { const v = w.SN.get(sid).g[sd][l]; if (w.AL[v].col && !alive.includes(v)) alive.push(v); }
  const lo = Math.min(...alive.map(id => w.AL[id].s)), hi = Math.max(...alive.map(id => w.AL[id].s));
  let ev = Infinity; w.AL.forEach(a => { if (a.col) ev = Math.min(ev, a.s); });
  const eq = (x, y) => x.length === y.length && x.every(v => y.includes(v));
  check("B reads: the best left, the worst left and the best ever, re-derived (ties all count)",
        eq(c.best, alive.filter(id => w.AL[id].s === lo)) && eq(c.worst, alive.filter(id => w.AL[id].s === hi)) &&
        eq(c.ever, w.AL.map((a, id) => a.col && a.s === ev ? id : -1).filter(id => id >= 0)) && !c.short, c.best + " / " + c.worst + " / " + c.ever);
  const P = PV.B, txt = id => document.getElementById(id).textContent.replace(/\\s+/g, " ").trim();
  const titles = [0, 1, 2].map(q => { QV.B = q; ChalB.sync("B"); return txt("B_qtext"); });
  const jm = titles[0] === "Find the highest fitness allele in the final generation, and the most recent common ancestor for that allele." &&
             titles[1] === "Find the lowest fitness allele left, and its most recent common ancestor." &&
             titles[2] === "Find the highest fitness allele that ever emerged on the island.";
  QV.B = 0; ChalB.sync("B");
  /* a first miss records 0 and the question stays open */
  PICK.B = c.worst[0]; ChalB.answer("B");
  const missed = c.prog[0] === 0 && Score.getBit("scaffold", BIT.B1) === 0;
  PICK.B = c.best[c.best.length - 1]; ChalB.answer("B");
  /* the meeting copy: re-derived from the copies' lines; an allele pick is not a copy */
  const meet = id => { const l = w.AL[id].locus, ups = []; for (const sid of genOf(w, G)) for (const sd of [0, 1]) if (w.SN.get(sid).g[sd][l] === id) ups.push(fullUp(w, { id: sid, side: sd, locus: l }));
    let k = 0; while (new Set(ups.map(u => u[k].id + "|" + u[k].side)).size > 1) k++; return { id: ups[0][k].id, side: ups[0][k].side, locus: l }; };
  const m1 = c.bestId != null ? meet(c.bestId) : null, state = "short " + c.short + ", CH.B is c " + (CH.B === c) + ", prog " + c.prog + ", QV " + QV.B + ", fb " + txt("B_fb");
  P.last = null; ChalB.answer("B");
  const refused = c.prog[0] === 1 && !Score.isAnswered("scaffold", BIT.B2);
  check("B: JM's three questions; a first miss records 0 and the question stays open; an allele pick does not answer a copy step; the highest's meeting copy re-derived",
        jm && missed && refused && !!m1 && same(m1, c.bestM.mrca), state + " | " + JSON.stringify(m1) + " | " + titles.join(" / "));
  P.last = Object.assign({ kind: "copy" }, m1); ChalB.answer("B");
  const movedOn = QV.B === 1;
  /* out of order: the highest ever before the lowest left */
  QV.B = 2; ChalB.sync("B"); PICK.B = c.ever[0]; ChalB.answer("B");
  QV.B = 1; ChalB.sync("B"); PICK.B = c.worst[0]; ChalB.answer("B");
  const m2 = c.worstId != null ? meet(c.worstId) : null;
  P.last = Object.assign({ kind: "copy" }, m2); ChalB.answer("B");
  const bits = ["B1","B2","B3","B4","B5"].map(k => Score.getBit("scaffold", BIT[k])).join("");
  check("B: a question finished moves the card on; then the rest out of order, four first hits record 1; the lowest's meeting copy re-derived; C opens",
        movedOn && c.done && bits === "01111" && !!m2 && same(m2, c.worstM.mrca) && Gates.C.open, "bits " + bits);
  const q = c.pool;
  check("B: the 200 islands (" + q.n + " compared): the highest left's copies meet " + q.best.toFixed(1) + " back, the lowest's " + q.worst.toFixed(1) +
        "; the highest ever gone " + pct(q.gone) + " (measured at 30 generations, two new alleles a generation: 6.8 / 2.6 / 88%; at 15 and one, 4.0 / 2.0 / 79%)", q.n >= 180 && q.best > q.worst + 0.8 && q.gone > 0.65);
}

/* ================= B: Run to generation 100 ================= */
{
  const w = WD.B, c = CH.B, btn = document.getElementById("B_long"), at = c.at;
  const shown = !btn.hidden;
  const snap = (x, upto) => JSON.stringify(x.ROWS.slice(0, upto + 1).map(r => r.map(id => { const s = x.SN.get(id); return [id, s.parents, Array.from(s.g[0]), Array.from(s.g[1])]; })));
  const before = snap(w, at), you0 = JSON.stringify([...w.YOU]), rev0 = document.getElementById("B_reveal").innerHTML;
  const bits0 = Object.values(BIT).map(b => Score.getBit("scaffold", b)).join("");
  /* the same deal run on a copy first: the button must give exactly this */
  let twin = null; for (let k = 0; !twin && k < 20; k++) twin = longAttempt(w, k);
  btn.click();
  let rowsOk = true; for (let t = 0; t <= w.gen; t++) if (genOf(w, t).length < 2) rowsOk = false;
  check("Run to generation " + LONG + ": shown once B's reads are done; runs the island to " + LONG + " with no generation below two snakes, then hides",
        shown && w.gen === LONG && rowsOk && btn.hidden, "gen " + w.gen);
  const rev1 = document.getElementById("B_reveal").innerHTML;
  check("Run to " + LONG + ": generations 0-" + at + " untouched; no snake past the line's end is the player's; what was found unchanged, the card saying the island ran on; every bit unchanged",
        snap(w, at) === before && JSON.stringify([...w.YOU]) === you0 && rev1.startsWith(rev0) && new RegExp("run on to " + LONG).test(rev1) &&
        Object.values(BIT).map(b => Score.getBit("scaffold", b)).join("") === bits0);
  check("Run to " + LONG + ": the same island and game give the same run", !!twin && snap(twin, LONG) === snap(w, LONG));
  check("Run to " + LONG + ": the phase line says where the reads stay", new RegExp("reads stay with generation " + at).test(document.getElementById("B_phase").textContent));
}
checkSeries("B");
{
  /* s and h at generation 100: bars still the copies alive; the dot strips grow rows rather than overlap */
  const w = WD.B; DN.n = null; drawDist();
  const D = distStats(w, w.gen); let n = 0; for (const s of rowSnakes(w, w.gen)) for (let l = 0; l < LOCI; l++) for (const sd of [0, 1]) if (w.AL[s.g[sd][l]].col) n++;
  const cv = document.getElementById("B_dist"), H = +cv.dataset.drawH;
  let clash = 0; for (let i = 0; i < DH.hits.length; i++) for (let j = i + 1; j < DH.hits.length; j++) { const a = DH.hits[i], b = DH.hits[j]; if (a.y === b.y && Math.abs(a.x - b.x) <= 2 * DOT_R + 1 - 1e-9) clash++; }
  const inside = DH.hits.every(h => h.y + DOT_R <= H);
  check("s and h at generation " + LONG + ": " + D.alive.length + " alive, " + D.gone.length + " gone; no two dots in a row overlap, all inside the canvas (" + H + " px)",
        D.copies === n && clash === 0 && inside && DH.hits.length === D.alive.length * 2 + D.gone.length * 2, "clashes " + clash);
  /* the lifespans: at least 3 px an allele */
  setMeasure("B", "life", -1);
  const boxes = TP.B.hits.filter(h => h.box), tc = document.getElementById("B_time");
  check("lifespans at " + LONG + ": " + boxes.length + " alleles, each row at least 3 px, all inside the plot",
        boxes.length === w.AL.filter(a => a.col).length && boxes.every(b => b.box[3] - b.box[1] >= 3 - 1e-9 && b.box[3] <= +tc.dataset.drawH));
  setMeasure("B", "fit", -1);
  /* the pedigree: the widest row fits the room, in every view */
  const P = PV.B, fits = [];
  for (const v of ["chr", "loc", "org"]) { setView("B", v); const L = P.lay, Wd = +document.getElementById("B_ped").dataset.drawW;
    let right = 0; for (const Q of L.pos.values()) right = Math.max(right, Q.x + L.slot / 2); fits.push(v + ":" + (right <= Wd + 0.5 ? "ok" : Math.round(right) + ">" + Wd)); }
  setView("B", "chr");
  /* and a room too narrow for the roomy slot: the slot narrows to fit, down to its floor (25 chromosome, 18 the others) */
  const most = Math.max(...w.ROWS.map((r, t) => shownRow(w, t).length));
  for (const [v, per] of [["chr", 28], ["loc", 21], ["org", 21]]) { const Wd = PD_LEFT + 10 + most * per, L = pedLayout(w, Object.assign({}, P, { view: v }), Wd);
    let right = 0; for (const Q of L.pos.values()) right = Math.max(right, Q.x + L.slot / 2); fits.push(v + "@" + Wd + ":" + (right <= Wd + 0.5 && near(L.slot, per, 1e-9) ? "ok" : Math.round(right) + "/" + L.slot.toFixed(1))); }
  check("pedigree at " + LONG + ": every row inside the canvas in every view (widest " + most + "), and in a room too narrow for 34 / 26 px slots", fits.every(s => /ok$/.test(s)), fits.join(" "));
}
{
  /* a first deal that dies out is dealt again; twenty that die leave the island where it was */
  const orig = window.longAttempt, calls = [];
  window.longAttempt = (x, k) => { calls.push(k); return k === 0 ? null : orig(x, k); };
  const w1 = makeWorld("B"); found(w1, 31); runRest(w1); w1.phase = "done";
  const ok1 = runLong(w1);
  window.longAttempt = () => null;
  const w2 = makeWorld("B"); found(w2, 32); runRest(w2);
  const ok2 = runLong(w2);
  window.longAttempt = orig;
  let died = 0, n = 0; for (let i = 0; i < 200; i++) { const x = makeWorld("B"); found(x, 700 + i); if (!runRest(x)) continue; n++; if (!longAttempt(x, 0)) died++; }
  check("Run to " + LONG + ": a deal that dies out is dealt again (calls " + calls.join(",") + "); if every deal dies the island stays at " + LASTS.B +
        "; first deals that die: " + died + " of " + n + " (measured 0.6%)",
        ok1 && w1.gen === LONG && calls.join(",") === "0,1" && !ok2 && w2.gen === LASTS.B && n >= 190 && died / n < 0.03);
}
{
  /* over fresh islands: where the read allele's living copies meet, against where it arose */
  let later = 0, n = 0;
  for (let salt = 10; salt < 70; salt++) { const w = makeWorld("A"); found(w, salt); runRest(w); const t = alleleTarget(w); if (!t) continue; n++; if (t.mrcaGen > t.bornGen) later++; }
  check("fresh islands: the living copies' meeting copy is younger than the mutant in " + later + " of " + n + " (model: 83%)", n >= 50 && later / n > 0.65);
}

/* ================= C: the race ================= */
{
  /* every deal: half gold; a sperm the computer swims is at the egg's edge exactly at its time */
  const rng = mulberry32(5); let half = true, edge = 0;
  for (let i = 0; i < 300; i++) { const sp = raceDeal(rng, 1 + rng() * 0.3); if (sp.filter(s => s.gold).length !== RC.N / 2) half = false;
    for (const s of sp) { const q = spermAt(s, s.T); edge = Math.max(edge, Math.abs(Math.hypot(q.x - RC.EX, q.y - RC.EY) - RC.ER)); } }
  check("race: half of every snake's sperm carry gold; each sperm reaches the egg's edge at its own time", half && edge < 1e-6, "worst " + edge.toExponential(1));
  /* gold's wins, re-derived (measured 0.50 / 0.74 / 0.89 / 0.99) */
  const want = [[1, 0.50, 0.025], [1.05, 0.74, 0.03], [1.1, 0.89, 0.025], [1.2, 0.99, 0.012]], got = [];
  for (const [G, k, e] of want) { const r = mulberry32(Math.round(G * 1000)); let g = 0; for (let i = 0; i < 4000; i++) if (raceWinner(r, G)) g++; got.push([g / 4000, k, e]); }
  check("race: gold wins " + got.map(x => x[0].toFixed(3)).join(" / ") + " at ×1.00 / 1.05 / 1.10 / 1.20 (measured 0.50 / 0.74 / 0.89 / 0.99)", got.every(([v, k, e]) => near(v, k, e)));
  /* the animation agrees with the computer's race; a player steering at the egg arrives as an average sperm does */
  let agree = 0; for (let i = 0; i < 20; i++) { const r = CR_newRace(900 + i, 1.1, null); while (!r.over) CR_tick(r, 1 / 60); if (r.winner === raceFirst(r.sp) && near(r.tWin, r.sp[r.winner].T, 1 / 60 + 1e-9)) agree++; }
  let late = 0; CR.aim = null;
  for (let i = 0; i < 20; i++) { const r = CR_newRace(950 + i, 1.1, 3), s = r.sp[3]; while (!Number.isFinite(s.T)) CR_tick(r, 1 / 60); late = Math.max(late, Math.abs(s.T - s.D / (s.v * RC.EFF))); }
  check("race: the drawn race's winner and time are the computer's (" + agree + " of 20); steered straight at the egg, you arrive in distance / (speed × " + RC.EFF + ") (worst " + late.toFixed(3) + " s)", agree === 20 && late < 0.12);
}
{
  /* play: six eggs, then a hundred; the targets wait for both; the question is nowhere yet */
  const goBefore = document.getElementById("C_go").disabled, qHidden0 = document.getElementById("C_q").hidden;
  CR.aim = { x: RC.EX, y: RC.EY };
  for (let e = 0; e < RC_BROOD; e++) { CR_startRace(); const r = CR.race; while (!r.over) CR_tick(r, 1 / 60); CR_endRace(); }
  const moreShown = !document.getElementById("C_more").hidden;
  document.getElementById("C_more").click();
  const share = CR.more.filter(Boolean).length / RC_MORE;
  check("C: Go waits for the six races and the hundred more (" + CR.brood.length + " young, gold in " + Math.round(share * 100) + " of 100 at ×" + RC_PLAY_G + "), then opens",
        goBefore && qHidden0 && CR.brood.length === RC_BROOD && moreShown && CR.more.length === RC_MORE && share > 0.75 && !document.getElementById("C_go").disabled);
}
{
  /* the rounds: the opening (×1.00) never hits; the right idea does; the island's split adds up exactly */
  const rate = (i, G, n) => { let h = 0; for (let k = 0; k < n; k++) if (CR_result(CR_ROUNDS[i], G, 31337 + 7919 * k).ok) h++; return h / n; };
  const r1 = [rate(0, 1, 100), rate(0, 1.05, 100)], r2 = [rate(1, 1, 60), rate(1, 1.05, 60), rate(1, 1.1, 60)], r3 = [rate(2, 1, 60), rate(2, 1.05, 60), rate(2, 1.1, 60), rate(2, 1.2, 60), rate(2, 1.3, 60)];
  check("C round 1 hits " + r1.map(pct).join(" / ") + " at ×1.00 / ×1.05 (measured 0 / 100%)", r1[0] === 0 && r1[1] === 1);
  check("C round 2 hits " + r2.map(pct).join(" / ") + " at ×1.00 / 1.05 / 1.10 (measured 0 / 13 / 100%): the race must beat the cost", r2[0] === 0 && r2[1] < 0.35 && r2[2] >= 0.95);
  check("C round 3 (JM's system: one gold copy 0.8, two sterile) hits " + r3.map(pct).join(" / ") + " at ×1.00 / 1.05 / 1.10 / 1.20 / 1.30 (measured 0 / 0 / 4 / 91 / 94%): only a strong race beats the cost",
        CR_ROUNDS[2].s === 1 && CR_ROUNDS[2].h === 0.2 && r3[0] === 0 && r3[1] < 0.1 && r3[2] < 0.3 && r3[3] >= 0.7 && r3[4] >= 0.7);   /* 60 islands: 91% has an sd of ~4% */
  let worst = 0;
  for (let k = 0; k < 20; k++) { const o = islandRun(mulberry32(77 + k), 1 + 0.05 * (k % 6), 0.4, 0.5, 0.3, 20); for (let t = 1; t < o.length; t++) worst = Math.max(worst, Math.abs(o[t].cov + o[t].E - (o[t].p - o[t - 1].p))); }
  check("C: each generation's change in gold is exactly cov(w, z) + E(wΔz)", worst < 1e-12, "worst " + worst.toExponential(1));
  /* scoring: practice nothing; a miss, then two hits */
  const sl = document.getElementById("C_speed"), pr = document.getElementById("C_practice");
  const setG = G => { sl.value = String(G); sl.dispatchEvent(new Event("input")); CR.demo = null; };
  pr.checked = true; C_sync(); setG(1.05); CR_go(); CR_endRun();
  const practiced = CR.results.length === 0 && !CR.waiting;
  pr.checked = false; C_sync(); setG(1); CR_go(); const locked = sl.disabled; CR_endRun();
  const miss = CR.results.length === 1 && !CR.results[0] && Score.getBit("scaffold", BIT.C1) === 0 && CR.waiting && !document.getElementById("C_next").hidden;
  CR_nextRound(); setG(1.1); CR_go(); CR_endRun(); CR_nextRound(); setG(1.3); CR_go(); CR_endRun();
  const bits = ["C1","C2","C3"].map(k => Score.getBit("scaffold", BIT[k])).join("");
  check("C race: practice records nothing; Go locks the slider while it runs and records one bit; three attempts", practiced && locked && miss && CR.done && bits === "011", "bits " + bits);
}
{
  /* the question after the race: shown once the three race targets are taken, on its own (the last target's verdict
     hidden); its first answer is the bit; a wrong answer says so and leaves the rest open; the right one closes C */
  const box = document.getElementById("C_q"), btn = o => box.querySelector('button[data-opt="' + o + '"]');
  const shown = !box.hidden && CR.done && document.getElementById("C_verdict").hidden &&
                /didn't solve this problem made fewer of themselves, and so became rarer/.test(btn(3).textContent);
  btn(1).click();
  const first = Score.isAnswered("scaffold", BIT.C4) && Score.getBit("scaffold", BIT.C4) === 0 && !CQ.solved && /incorrect/.test(document.getElementById("C_qfb").textContent) && btn(1).disabled && !btn(3).disabled;
  btn(0).click(); btn(3).click();
  const closed = CQ.solved && Score.getBit("scaffold", BIT.C4) === 0 && btn(2).disabled && Gates.C.done && Gates.D.open;
  check("C question: hidden at first; shown after the race targets, on its own, JM's last option; a wrong first answer records 0 and leaves the others open; the right one closes C and opens D", shown && first && closed);
}

/* ================= D: the jump ================= */
{
  /* the four gametes, re-derived strand by strand */
  const rng = mulberry32(12); let agree = true;
  for (let i = 0; i < 3000; i++) {
    const xc = rng() * CJ_LEN, items = [{ chr: (rng() * 2) | 0, x: Math.round(rng() * 14) / 2 }]; if (rng() < 0.7) items.push({ chr: (rng() * 2) | 0, x: Math.round(rng() * 14) / 2 });
    const src = [x => 0, x => x < xc ? 0 : 1, x => x < xc ? 1 : 0, x => 1];
    const g = src.map(f => items.some(c => f(c.x === CJ_LEN ? CJ_LEN - 1e-9 : c.x) === c.chr && !(c.x === xc)));
    if (JSON.stringify(g) !== JSON.stringify(CJ_meiosis(xc, items).g)) agree = false;
  }
  const o = CJ.orig, cnt = (items, n) => { const r = mulberry32(99); const c = [0, 0, 0, 0, 0]; for (let i = 0; i < n; i++) c[CJ_meiosis(r() * CJ_LEN, items).n]++; return c; };
  const stay = cnt([o], 2000), other = [0, 1, 2, 3, 4, 5, 6, 7].map(x => cnt([o, { chr: 1, x }], 2000)), same = cnt([o, { chr: 0, x: o.x === 2 ? 6 : 1 }], 20000);
  const d = Math.abs((o.x === 2 ? 6 : 1) - o.x);
  check("jump: the four gametes re-derived strand by strand; staying put, always 2 of 4; a copy on the other chromosome, never fewer than 3; at the matching place, always 4",
        agree && stay[2] === 2000 && other.every(c => c[0] + c[1] + c[2] === 0) && other[o.x][4] === 2000);
  check("jump: a copy on your own chromosome, " + d + " genes away, gets you into 3 of 4 when the crossover falls between: " + (same[3] / 20000).toFixed(3) + " (that is " + d + "/7 = " + (d / 7).toFixed(3) + ")", near(same[3] / 20000, d / 7, 0.012) && same[3] + same[2] === 20000);
}
{
  /* a division plays with no target; D waits for the cells too */
  CJ.copy = { chr: 1, x: CJ.orig.x }; CJ.last = null; CJ_go(); CJ.anim.t = 3; CJ_endAnim();
  const msg = document.getElementById("D_jumpPhase").textContent;
  check("D jump: a division plays and says how many gametes you are in, against 2 for a gene that never jumps; no target; D waits for the cells",
        CJ.tried && /You are in 4 of the 4 gametes/.test(msg) && /never jumps is in 2/.test(msg) && !Gates.D.done, msg);
}
{
  /* the animation loop itself, on a frame clock pumped here (headless Chrome does not run frames under virtual time):
     a race at the slider's speed, an island run and a division each play to their end */
  const realRAF = window.requestAnimationFrame, q = []; let ts = 1000, frames = 0;
  window.requestAnimationFrame = f => { q.push(f); return q.length; };
  const pump = (until, max) => { let n = 0; while (!until() && q.length && n < max) { const f = q.shift(); ts += 1000 / 60; f(ts); n++; } frames = n; return until(); };
  C_on = false; CR.demo = null; CR.race = null;
  document.getElementById("C_speed").value = "1.1"; CR_demo(); const demo = CR.demo;
  const raced = pump(() => !CR.demo, 4000), raceFrames = frames;
  const prR = document.getElementById("C_practice");
  prR.checked = true; C_sync(); CR_go(); const ran = pump(() => !CR.run, 4000);
  D_on = false; CJ.last = null; CJ_go(); const divided = pump(() => !CJ.anim, 4000) && !!CJ.last;
  document.getElementById("D1_k").value = "1"; cellsGo(1); const celled = pump(() => !CELLS[1].anim, 4000) && CELLS[1].tried;
  window.requestAnimationFrame = realRAF; prR.checked = false; C_sync();
  check("the loops play a race to its end (" + raceFrames + " frames for a " + (demo.tWin / 1.6).toFixed(1) + " s win shown at 1.6×), an island run to its verdict, a division to its gametes, five divisions of cells",
        raced && ran && divided && celled && !C_on && !D_on);
}

/* ================= D: the cells ================= */
{
  /* each run re-derived: a cell divides exactly when none of its jumps landed in a gene; a daughter carries her
     mother's copies and her mother's jumps; every copy in a cell left at the end sits between genes */
  const inG = x => CELL_GENES.some(([a, b]) => x >= a && x < b);
  let ok = true, jumps = 0, inGenes = 0, jumpsP = 0, inGenesP = 0;
  for (let i = 0; i < 400; i++) {
    const k = i % 6, R = cellRun(k, 0, 5000 + i), RP = cellRun(3, 0.6, 9000 + i);
    for (const c of R.cells) {
      const kids = R.cells.filter(d => d.parent === c), hit = c.land.some(inG);
      if (c.gen < CELL_DIVS && kids.length !== (c.dead ? 0 : 2)) ok = false;
      if (c.gen < CELL_DIVS && (hit !== c.dead || c.land.length !== k)) ok = false;
      for (const d of kids) if (JSON.stringify(d.tp) !== JSON.stringify(c.tp.concat(c.land))) ok = false;
    }
    for (const c of R.last) if (c.gen !== CELL_DIVS || c.tp.some(inG) || c.tp.length !== 1 + k * CELL_DIVS) ok = false;
    jumps += R.jumps.length; inGenes += R.jumps.filter(j => j.gene).length;
    jumpsP += RP.jumps.length; inGenesP += RP.jumps.filter(j => j.gene).length;
  }
  const cover = CELL_GENES.reduce((a, [x, y]) => a + y - x, 0);
  check("D cells: a cell divides exactly when none of its jumps landed in a gene; daughters carry their mother's copies and jumps; the cells left hold 1 + 5k copies, all between genes (400 runs)", ok);
  check("D cells: jumps land in genes at the genes' share of the DNA, " + (inGenes / jumps).toFixed(3) + " against " + cover.toFixed(2) + "; with a preference of 0.6, " + (inGenesP / jumpsP).toFixed(3) + " against " + (0.4 * cover).toFixed(2),
        near(cover, CELL_COVER, 1e-9) && near(inGenes / jumps, cover, 0.02) && near(inGenesP / jumpsP, 0.4 * cover, 0.02));
  /* how often any cell is left after five divisions, against the measured table */
  const alive = (k, pref) => { let a = 0; for (let i = 0; i < 1500; i++) if (cellRun(k, pref, 20000 + 31 * i + 7 * k).last.length) a++; return a / 1500; };
  const t = [alive(0, 0), alive(1, 0), alive(2, 0), alive(3, 0), alive(3, 0.8)];
  check("D cells: any cell left after five divisions " + t.map(pct).join(" / ") + " at k 0 / 1 / 2 / 3, and k 3 with preference 0.8 (measured 100 / 67 / 33 / 12 / 84%)",
        t[0] === 1 && near(t[1], 0.67, 0.05) && near(t[2], 0.33, 0.05) && near(t[3], 0.12, 0.04) && near(t[4], 0.84, 0.04));
}
{
  /* the two panels: the readout agrees with the run; D finishes on a division and one run of each panel, and that is
     the end of the lesson */
  const txt = id => document.getElementById(id).textContent.replace(/\\s+/g, " ").trim();
  const reads = [];
  for (const [part, k, pref] of [[1, 1, 0], [2, 3, 0.8]]) {
    document.getElementById("D" + part + "_k").value = String(k); if (part === 2) document.getElementById("D2_pref").value = String(pref);
    cellsGo(part); cellsEnd(part);
    const R = CELLS[part].run, rd = txt("D" + part + "_read"), m = rd.match(/^(\\d+) of 32 cells left after five divisions · (\\d+) jumps?, (\\d+) of them into a gene/);
    reads.push(!!m && +m[1] === R.last.length && +m[2] === R.jumps.length && +m[3] === R.jumps.filter(j => j.gene).length && R.k === k && R.pref === (part === 2 ? pref : 0) &&
               (R.last.length ? /where it ends up in the cells that survive is not random/.test(rd) : !/not random/.test(rd)));
  }
  check("D cells: each panel's readout agrees with its run, and says the copies' places are not random when cells are left; D done, the lesson done",
        reads.every(Boolean) && Gates.D.done && document.getElementById("done-banner").classList.contains("shown"), reads.join(" "));
}
{
  const D = Object.keys(BIT).length; let n = 0; for (let i = 0; i < D; i++) if (Score.isAnswered("scaffold", i)) n++;
  check("all " + D + " declared bits written", D === 15 && n === D, n + " written");
}
{
  FIT_EPOCH++; paintAll(null, false);
  const over = [];
  for (const id of ["A_ped","B_ped","A_time","B_time","B_dist","C_race","C_pop","D_jump","D1_cells","D1_where","D2_cells","D2_where"]) { const cv = document.getElementById(id), host = cv.parentElement;
    if (+cv.dataset.drawW > host.clientWidth + 1) over.push(id + " " + cv.dataset.drawW + ">" + host.clientWidth); }
  check("every canvas fits its panel", over.length === 0, over.join(", "));
}

say(bad ? ("FAILED " + bad) : "ALL BARS PASS");
say("RAN " + ran);
L.join(" ;; ");
`;

const probe = `<!doctype html><meta charset="utf-8"><title>pending</title>
<iframe id="f" src="http://127.0.0.1:${PORT}/app/lessons/lesson15.html?preview=1" width="1500" height="1000"></iframe>
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

const probePath = path.join(ROOT, "_check_l15_" + PORT + ".html");
fs.writeFileSync(probePath, probe);
const server = spawn("python3", ["-m", "http.server", String(PORT), "--directory", ROOT],
                     { stdio: "ignore", detached: true });
const cleanup = () => { try { process.kill(-server.pid); } catch (e) {} try { fs.unlinkSync(probePath); } catch (e) {} };
process.on("exit", cleanup);

setTimeout(() => {
  const r = spawnSync(CHROME, ["--headless=new", "--disable-gpu", "--virtual-time-budget=600000",
                               "--dump-dom", `http://127.0.0.1:${PORT}/_check_l15_${PORT}.html`],
                      { encoding: "utf8", maxBuffer: 1 << 28 });
  const m = /<pre id="out">([\s\S]*?)<\/pre>/.exec(r.stdout || "");
  if (!m) { console.error("no result -- is Chrome at " + CHROME + " ?"); cleanup(); process.exit(2); }
  const text = m[1].replace(/&quot;/g, '"').replace(/&gt;/g, ">").replace(/&lt;/g, "<").replace(/&amp;/g, "&");
  const lines = text.split(" ;; ");
  let bad = !/ALL BARS PASS/.test(text);
  for (const line of lines) console.log(line);
  const reported = lines.filter(l => /^(ok|FAIL)\s/.test(l)).length;
  const ranLine = /^RAN (\d+)$/.exec((lines.find(l => /^RAN \d+$/.test(l)) || ""));
  if (!ranLine || +ranLine[1] !== reported) {
    console.log("FAIL harness  " + (ranLine ? ranLine[1] : "?") + " checks ran, " + reported + " came back -- the report was truncated");
    cleanup(); process.exit(1);
  }
  cleanup();
  process.exit(bad ? 1 : 0);
}, 1800);
