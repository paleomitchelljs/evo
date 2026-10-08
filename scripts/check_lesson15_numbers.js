#!/usr/bin/env node
/*
 * check_lesson15_numbers.js -- the checks for app/lessons/lesson15.html.
 *
 * Lesson 15 is a draft (eleventh pass, 2026-10-07): A the snake game on a
 * neutral island, fifteen generations, a pedigree in three views and six
 * reads of it, then the island over time; B the same on an island whose new
 * alleles carry s and h, its plot, s and h in generation N, and five reads
 * of the plots; C one allele's change split among snakes and then among the
 * copies inside each snake (a hierarchical Price equation), and B's island
 * read back winter by winter. What has to hold:
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
 *   Reads, A. the six targets re-derived here from the snakes: the
 *      traced copy's parent, grandparent and great-grandparent copies; the
 *      pair's meeting copy (the first copy both lines share) and its depth;
 *      the commonest coloured allele, its origin, and the most recent copy
 *      every living copy passes through; first answers record their own
 *      bit, misses do not shut a door; over fresh islands the meeting copy
 *      sits after the origin most of the time (the measured 83%).
 *   Reads, B. the best and worst coloured alleles left (ties all count),
 *      their meeting copies, the best ever drawn; an allele step takes any
 *      pick, a copy step only a pedigree copy; the 200 islands agree with
 *      the measured direction (best left's copies meet further back; the
 *      best ever mostly gone).
 *   Run to generation 100 (B only). hidden until B's reads are done; then
 *      it runs the island to 100 with no generation below two snakes; the
 *      generations up to the reads' are untouched, no snake past the line's
 *      end is the player's, the reveal and every bit unchanged; the same
 *      island gives the same run; a deal that dies out is dealt again, and
 *      first deals rarely die (measured 0.6%). At 100 the series are
 *      re-derived again, s and h's dot strips grow rows instead of
 *      overlapping, lifespans keep 3 px a row, and every pedigree row fits.
 *   C. the identity holds exactly for random families (Δz = cov + E, the
 *      snakes' E(wΔz) = the copies' cov + E, and the snakes' cov plus the
 *      copies' cov is the covariance over all twelve copies); a fair coin
 *      for which copy leaves the copies' cov at 0 on average; each round has
 *      an answer that hits and one step the right way of the opening hits
 *      where that is the idea; the opening hits none; no family hits two
 *      rounds; practice records nothing, Go records one bit and waits for
 *      Next target; the R panel computes the page's own numbers (Rscript).
 *   Island read-back. every winter's three parts add to that winter's
 *      change, and the change lands on the next generation's share.
 *   All. every canvas fits its panel; a full run writes all 16 bits.
 *
 * Same harness as check_lesson14_numbers.js: the checks run inside a
 * same-origin iframe against the page's own functions; the report comes back
 * in a <pre>; the runner fails if fewer checks come back than ran.
 *
 * Usage:  node scripts/check_lesson15_numbers.js      (~1 minute)
 * Exit 0 iff every check passes. Needs Google Chrome and python3; Rscript
 * for the R panel's check (skipped, and said so, without it).
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
for (const s of ["A","B","C"]) document.getElementById("stage"+s).classList.remove("stage-locked");
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
check("A runs to generation " + LAST + " and opens its reads", wA.gen === LAST && wA.phase === "done" && !!CH.A, "gen " + wA.gen + ", phase " + wA.phase);
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
  check("unlocked a click replaces; lock adds; unlocking keeps the last click", replaced && added && kept, [replaced, added, kept].join(" "));
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
  /* answering: a first miss records 0 and the door stays open; the rest are first-time hits */
  const c = CH.A, P = PV.A;
  P.last = { kind: "copy", id: c.trace.id, side: c.trace.side, locus: c.trace.locus }; Chal.answer("A");
  const missed = c.step === 0 && Score.getBit("scaffold", BIT.A1) === 0;
  P.last = { kind: "snake", id: c.up[0].id }; Chal.answer("A");
  const snakeRefused = c.step === 0;
  while (!c.done) { const wnt = Chal.want(c); if (!wnt) break; P.last = { kind: "copy", id: wnt.id, side: wnt.side, locus: wnt.locus }; Chal.answer("A"); }
  const bits = ["A1","A2","A3","A4","A5","A6"].map(k => Score.getBit("scaffold", BIT[k])).join("");
  check("A: a first miss records 0 and the read stays open; a snake is not a copy; then each first hit records 1; B opens",
        missed && snakeRefused && c.done && bits === "011111" && Gates.B.open, "bits " + bits);
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
  const kept = c.step === 1 && Score.getBit("scaffold", BIT.A1) === bits0;
  check("Play again (shown once the line ends): the same founders, the score from 0, the top score kept; new seasons; a read answered before keeps its first answer",
        shown && fresh && JSON.stringify(rowSnakes(w, 1).map(s => s.parents)) !== row1 && kept && Gates.B.open);
}

/* ================= island B ================= */
fastForward("B");
check("B runs to generation " + LAST + "; Run to generation " + LONG + " hidden until its reads are done", WD.B.gen === LAST && !!CH.B && document.getElementById("B_long").hidden);
checkSeries("B");
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
  const P = PV.B;
  /* a first miss records 0 and the door stays open */
  PICK.B = c.worst[0]; ChalB.answer("B");
  const missed = c.step === 0 && Score.getBit("scaffold", BIT.B1) === 0;
  PICK.B = c.best[c.best.length - 1]; ChalB.answer("B");
  /* the meeting copy: re-derived from the copies' lines; an allele pick is not a copy */
  const meet = id => { const l = w.AL[id].locus, ups = []; for (const sid of genOf(w, G)) for (const sd of [0, 1]) if (w.SN.get(sid).g[sd][l] === id) ups.push(fullUp(w, { id: sid, side: sd, locus: l }));
    let k = 0; while (new Set(ups.map(u => u[k].id + "|" + u[k].side)).size > 1) k++; return { id: ups[0][k].id, side: ups[0][k].side, locus: l }; };
  const m1 = meet(c.bestId);
  P.last = null; ChalB.answer("B");
  const refused = c.step === 1 && !Score.isAnswered("scaffold", BIT.B2);
  check("B: a first miss records 0 and the read stays open; an allele pick does not answer a copy step; the best's meeting copy re-derived",
        missed && refused && same(m1, c.bestM.mrca), JSON.stringify(m1));
  P.last = Object.assign({ kind: "copy" }, m1); ChalB.answer("B");
  PICK.B = c.worst[0]; ChalB.answer("B");
  const m2 = meet(c.worstId);
  P.last = Object.assign({ kind: "copy" }, m2); ChalB.answer("B");
  PICK.B = c.ever[0]; ChalB.answer("B");
  const bits = ["B1","B2","B3","B4","B5"].map(k => Score.getBit("scaffold", BIT[k])).join("");
  check("B: then four first hits record 1; the worst's meeting copy re-derived; C opens", c.done && bits === "01111" && same(m2, c.worstM.mrca) && Gates.C.open, "bits " + bits);
  const q = c.pool;
  check("B: the 200 islands (" + q.n + " compared): best left's copies meet " + q.best.toFixed(1) + " back, worst left's " + q.worst.toFixed(1) +
        "; best ever gone " + pct(q.gone) + " (measured 4.0 / 2.0 / 79%)", q.n >= 180 && q.best > q.worst + 0.8 && q.gone > 0.65);
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
  check("Run to " + LONG + ": generations 0-" + at + " untouched; no snake past the line's end is the player's; the reveal and every bit unchanged",
        snap(w, at) === before && JSON.stringify([...w.YOU]) === you0 && document.getElementById("B_reveal").innerHTML === rev0 &&
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
  check("Run to " + LONG + ": a deal that dies out is dealt again (calls " + calls.join(",") + "); if every deal dies the island stays at " + LAST +
        "; first deals that die: " + died + " of " + n + " (measured 0.6%)",
        ok1 && w1.gen === LONG && calls.join(",") === "0,1" && !ok2 && w2.gen === LAST && n >= 190 && died / n < 0.03);
}
{
  /* over fresh islands: where the read allele's living copies meet, against where it arose */
  let later = 0, n = 0;
  for (let salt = 10; salt < 70; salt++) { const w = makeWorld("A"); found(w, salt); runRest(w); const t = alleleTarget(w); if (!t) continue; n++; if (t.mrcaGen > t.bornGen) later++; }
  check("fresh islands: the living copies' meeting copy is younger than the mutant in " + later + " of " + n + " (model: 83%)", n >= 50 && later / n > 0.65);
}

/* ================= C ================= */
{
  const rng = mulberry32(77); let worst = 0, worstFlat = 0;
  for (let it = 0; it < 600; it++) {
    const y = [0,1,2].map(() => { const n = (rng() * 6) | 0; return Array.from({ length: n }, () => ({ a: rng() < .5 ? 0 : 1, b: rng() < .5 ? 0 : 1, ca: rng() < .2, cb: rng() < .2 })); });
    const t = C_terms(y); if (t.dead) continue;
    worst = Math.max(worst, Math.abs(t.covS + t.ES - t.dz), Math.abs(t.ES - t.covC - t.EC));
    /* the covariance over all twelve copies, each copy's w its young over the average copy's */
    const ws = [], zs = []; for (let i = 0; i < 6; i++) for (const j of [0,1]) { ws.push(t.m[i][j] / (t.n.reduce((a,b)=>a+b,0) / 12)); zs.push(C_PAR[i][j]); }
    const mw = ws.reduce((a,b)=>a+b,0)/12, mz = zs.reduce((a,b)=>a+b,0)/12; let cv = 0; for (let k=0;k<12;k++) cv += (ws[k]-mw)*(zs[k]-mz)/12;
    worstFlat = Math.max(worstFlat, Math.abs(cv - t.covS - t.covC));
  }
  check("C: Δz = cov + E(wΔz) for the snakes, and their E(wΔz) = the copies' cov + E, exactly (600 random families)", worst < 1e-12, "worst " + worst.toExponential(1));
  check("C: the snakes' cov plus the copies' cov is the covariance over all twelve copies", worstFlat < 1e-12, "worst " + worstFlat.toExponential(1));
  let s = 0, se = 0; const N = 4000;
  for (let it = 0; it < N; it++) { const y = [0,1,2].map(() => [0,1].map(() => ({ a: rng() < .5 ? 0 : 1, b: rng() < .5 ? 0 : 1, ca: false, cb: false }))); const t = C_terms(y); s += t.covC; se += Math.abs(t.EC); }
  check("C: a fair coin for which copy leaves the copies' cov at 0 on average (" + (s/N).toFixed(4) + "), and faithful copies leave E at 0", Math.abs(s / N) < 0.006 && se === 0);
}
const K = (a, b, ca, cb) => ({ a, b, ca: !!ca, cb: !!cb });
const ANSWERS = [
  [[K(0,0),K(0,1)], [K(0,1),K(1,0)], [K(0,0),K(1,1)]],                                      /* hets pass gold twice */
  [[K(0,0),K(0,0)], [K(0,0),K(0,1),K(0,0)], [K(0,1)]],                                      /* fewer young for gold, gold copies reach more */
  [[K(0,1),K(1,0)], [K(0,1),K(1,0,0,1)], [K(0,1),K(1,0)]],                                  /* a grey copy comes out gold */
  [[K(1,0),K(0,1)], [K(0,0)], [K(0,0),K(1,0),K(0,0)]],                                      /* more young for gold, grey copies reach more */
  [[K(0,0),K(0,1,1)], [K(0,1),K(1,0)], [K(0,1),K(1,0)]]                                     /* gold copy reaches both; one comes out grey */
];
const OPEN = () => [0,1,2].map(() => [C_kid(0), C_kid(1)]);
{
  const hits = ANSWERS.map((y, i) => C_judge(C_ROUNDS[i], y).ok);
  check("C: each round has an answer that hits", hits.every(Boolean), hits.join(" "));
  const open = C_ROUNDS.map(r => C_judge(r, OPEN()).ok);
  check("C: the opening hits no round", open.every(x => !x), open.join(" "));
  /* one step the right way of the opening: one het passes gold to both its young (round 1), one grey copy comes out gold (round 3) */
  const s1 = OPEN(); s1[0][1].a = 0; const s3 = OPEN(); s3[1][0].cb = true;
  check("C: one step the right way hits rounds 1 and 3", C_judge(C_ROUNDS[0], s1).ok && C_judge(C_ROUNDS[2], s3).ok,
        C_terms(s1).p2.toFixed(3) + " / " + C_terms(s3).p2.toFixed(3));
  /* no family hits two rounds: random search plus the answers themselves */
  const rng = mulberry32(31); let two = 0, found = C_ROUNDS.map(() => 0);
  const fams = ANSWERS.slice();
  for (let it = 0; it < 30000; it++) fams.push([0,1,2].map(() => { const n = (rng() * 6) | 0; return Array.from({ length: n }, () => ({ a: rng() < .5 ? 0 : 1, b: rng() < .5 ? 0 : 1, ca: rng() < .15, cb: rng() < .15 })); }));
  for (const y of fams) { const h = C_ROUNDS.map(r => C_judge(r, y).ok); h.forEach((x, i) => { if (x) found[i]++; }); if (h.filter(Boolean).length > 1) two++; }
  check("C: no family hits two rounds (30,000 random families); each round is hit by some: " + found.join(" / "), two === 0 && found.every(x => x > 0));
}
{
  /* Go: practice records nothing; a scored Go records its bit and waits for Next target */
  C.round = 0; C.results = []; C.waiting = false; C.done = false;
  const pr = document.getElementById("C_practice"), go = document.getElementById("C_go"), nx = document.getElementById("C_next");
  C.young = ANSWERS[0].map(k => k.map(x => Object.assign({}, x)));
  pr.checked = true; go.click();
  const practiced = C.results.length === 0 && !C.waiting;
  pr.checked = false; C_drawTarget();
  C.young = OPEN(); go.click();
  const miss = C.results.length === 1 && C.results[0] === false && Score.getBit("scaffold", BIT.C1) === 0 && C.waiting && !nx.hidden;
  C_flip(0, 1, 0); const locked = C_terms(C.young).p2 === 0.5;
  nx.click();
  for (let i = 1; i < 5; i++) { C.young = ANSWERS[i].map(k => k.map(x => Object.assign({}, x))); go.click(); if (i < 4) nx.click(); }
  const bits = ["C1","C2","C3","C4","C5"].map(k => Score.getBit("scaffold", BIT[k])).join("");
  check("C: practice records nothing; Go records one bit and locks the family until Next target; five attempts finish the lesson",
        practiced && miss && locked && C.done && bits === "01111" && document.getElementById("done-banner").classList.contains("shown"), "bits " + bits);
}
{
  let n = 0; for (let i = 0; i < 16; i++) if (Score.isAnswered("scaffold", i)) n++;
  check("all 16 declared bits written", n === 16, n + " written");
}
/* the R panel, for a family that moves every term */
C.young = [[K(0,0),K(0,0,1,0)], [K(0,1),K(1,0),K(0,0)], [K(0,1)]];
const RT = C_terms(C.young);
const RCODE = C_RCODE();

/* ================= island read-back ================= */
{
  C_drawIsle();
  const w = WD.B, a = isleAllele(w), T = isleTerms(w, a.id, a.locus);
  let worst = 0, land = 0;
  T.forEach((q, i) => { if (!q) return; worst = Math.max(worst, Math.abs(q.covS + q.covC + q.EC - (q.p2 - q.p)));
    const nx = rowSnakes(w, q.t + 1); let c = 0; for (const s of nx) c += (s.g[0][a.locus] === a.id) + (s.g[1][a.locus] === a.id); land = Math.max(land, Math.abs(c / (2 * nx.length) - q.p2)); });
  check("read-back: each winter's three parts add to its change, and the change lands on the next generation's share", worst < 1e-12 && land < 1e-12, "worst " + worst.toExponential(1) + ", " + land.toExponential(1));
}
{
  FIT_EPOCH++; paintAll(null, false);
  const over = [];
  for (const id of ["A_ped","B_ped","A_time","B_time","B_dist","C_fam","C_card","C_isle"]) { const cv = document.getElementById(id), host = cv.parentElement;
    if (+cv.dataset.drawW > host.clientWidth + 1) over.push(id + " " + cv.dataset.drawW + ">" + host.clientWidth); }
  check("every canvas fits its panel", over.length === 0, over.join(", "));
}

say(bad ? ("FAILED " + bad) : "ALL BARS PASS");
say("RAN " + ran);
say("RTERMS " + JSON.stringify([RT.covS, RT.ES, RT.covS + RT.ES, RT.dz]));
say("RCODE " + RCODE.replace(/\\n/g, "\\\\n"));
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
  const rterms = lines.find(l => /^RTERMS /.test(l)), rcode = lines.find(l => /^RCODE /.test(l));
  for (const line of lines) if (!/^(RTERMS|RCODE) /.test(line)) console.log(line);
  const reported = lines.filter(l => /^(ok|FAIL)\s/.test(l)).length;
  const ranLine = /^RAN (\d+)$/.exec((lines.find(l => /^RAN \d+$/.test(l)) || ""));
  if (!ranLine || +ranLine[1] !== reported) {
    console.log("FAIL harness  " + (ranLine ? ranLine[1] : "?") + " checks ran, " + reported + " came back -- the report was truncated");
    cleanup(); process.exit(1);
  }
  /* the R panel computes the page's own four numbers */
  if (rterms && rcode) {
    const want = JSON.parse(rterms.slice(7)), code = rcode.slice(6).replace(/\\n/g, "\n");
    const rs = spawnSync("Rscript", ["-e", code + "\ncat(sprintf('%.12f', c(cov_snakes, E_snakes, cov_snakes + E_snakes, mean(zy) - mean(z))), sep=' ')"], { encoding: "utf8" });
    if (rs.error) console.log("skip R panel  (no Rscript)");
    else {
      /* the panel's own last line prints too ([1] ...); the four numbers asked for come last */
      const got = (rs.stdout || "").trim().split(/\s+/).slice(-4).map(Number);
      const ok = got.length === 4 && got.every((v, i) => Math.abs(v - want[i]) < 1e-9);
      console.log((ok ? "ok   " : "FAIL ") + "the R panel computes the page's numbers: " + got.map(v => v.toFixed(4)).join(" ") + (ok ? "" : "  -- page " + want.map(v => v.toFixed(4)).join(" ") + " " + (rs.stderr || "").slice(0, 300)));
      if (!ok) bad = true;
    }
  }
  cleanup();
  process.exit(bad ? 1 : 0);
}, 1800);
