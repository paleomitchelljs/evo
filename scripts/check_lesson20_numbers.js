#!/usr/bin/env node
/*
 * check_lesson20_numbers.js -- the checks for app/lessons/lesson20.html.
 *
 * Pass 3 (2026-10-27, JM's review): four stages.
 *   A  one pond splits in two, as a pedigree, mutations drawn; when every pair of copies meets against the split.
 *   B  two ponds apart, then floods; incompatible new alleles; a choosy allele.
 *   C  the student splits populations by clicking; each locus's tree over the populations' tree.
 *   D  one trait, dispersal, that changes splitting and loss; no genes (2026-10-28, JM).
 *   E  reading a tree: a ringed species' nearest relative, two species' common ancestor (2026-10-28).
 * What has to hold:
 *
 *   A engine. Below the split every fish has both parents in its own pond; every link points at the parent chromosome carrying
 *      the same allele (no mutation); a pair with one copy from each pond meets only above the split; the pair counts add up
 *      (8 loci x every pair; every pair once for the differences); with no mutation no new allele, and a new allele from one
 *      pond is never found in the other.
 *   A reads. Each dealt read's answer locks in as correct, a copy that is not the answer as wrong; A3's answer carries the new
 *      allele and its parent copy does not.
 *   A targets. Each intended setting clears its bar in most Gos of 16 pedigrees, the opening in few; T3's too-high mutation
 *      misses (a window, not a floor).
 *   B. Inside a pond no fish carries an incompatible pair before the floods; the choosy allele is absent before the first
 *      flood and near one in ten after it; each target's intended setting hits, its opening misses.
 *   C. No split without a click; never more than 16 living; with no crossing over every locus has the same tree; two
 *      populations' lineages meet only before they parted; each target's intended clicks hit most trees, the opening few.
 *   D. With no arrows the far dispersers' share agrees with the closed form beside it (the dashed curve); each target's intended
 *      setting hits, its opening misses.
 *   E. On many random trees, each question's key is what it asks for (the tips whose fork with the ringed one is youngest; the
 *      fork holding both ringed tips and no younger one), and the dealt traps hold.
 *   Flow. Working each stage through by its own buttons opens the next; the last ends the lesson; all 26 bits written.
 *   Layout. The R code last and closed in every stage; hover marks with words; every canvas fits (1500 and 1000 wide).
 *
 * Bars are sized off the spreads measured on the page's engine (the comments above each stage's rounds in lesson20.html):
 * a check counts several Gos so that a fair bar fails it about one run in a hundred or less.
 *
 * Usage:  node scripts/check_lesson20_numbers.js      (~2 minutes)
 *         CHROME=/path/to/chrome node scripts/check_lesson20_numbers.js   (running as root, a wrapper adding --no-sandbox)
 */
const { spawn, spawnSync } = require("child_process");
const fs = require("fs"), path = require("path");
const ROOT = path.resolve(__dirname, "..");
const PORT = +process.env.PORT || 8798;
const CHROME = process.env.CHROME || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const CANVAS_IDS = ["A_ped", "A_meet", "A_tpic", "B_board", "B_time", "B_fit", "B_tpic", "C_tree", "C_pairs", "C_runs", "C_tpic", "D_tree", "D_time", "D_tpic", "E_tree"];

/* runs inside the page (an iframe): returns the report as one string */
function inner(CANVAS_IDS) {
  const L_ = [], say = s => L_.push(s);
  let bad = 0, ran = 0;
  const check = (name, ok, detail) => { ran++; if (!ok) bad++; say((ok ? "ok   " : "FAIL ") + name + (detail ? "  -- " + detail : "")); };
  for (const k of ["A", "B", "C", "D", "E"]) { document.getElementById("stage" + k).classList.remove("stage-locked"); }
  Gates.A.open = true;
  const $ = id => document.getElementById(id);

  /* ================= A: the engine ================= */
  {
    let own = true, cross = 0, totOk = true, diffOk = true;
    for (let r = 0; r < 12; r++) {
      const P = { n: [4, 6, 8, 10][r % 4], G: [20, 30, 40, 60][r % 4], s: 5 + r, mu: 0.01 }, w = pdWorld(P, 31 + 977 * r), S = pdPairs(w);
      for (let t = P.s + 1; t <= P.G; t++) w.rows[t].forEach(f => { for (const a of f.pa) if (w.rows[t - 1][a].pond !== f.pond) own = false; });
      for (let t = P.s; t <= P.G; t++) cross += S.meet.x[t + 1];
      const c = 4 * P.n, pairs = c * (c - 1) / 2, sum = k => S.meet[k].reduce((a, b) => a + b, 0), dsum = k => S.diff[k].reduce((a, b) => a + b, 0);
      if (sum("o") + sum("b") + sum("x") !== NT * pairs) totOk = false;
      if (dsum("o") + dsum("b") + dsum("x") !== pairs || dsum("x") !== (2 * P.n) * (2 * P.n)) diffOk = false;
    }
    check("A engine: below the split every fish's parents are in its own pond (" + own + "); no pair with one copy from each pond meets at or below the split (" + cross + ")", own && cross === 0);
    check("A engine: every pair of copies counted once a locus when they meet (" + totOk + ") and once for the differences, (2n)^2 of them one from each pond (" + diffOk + ")", totOk && diffOk);
    let tot = 0, good = 0;
    for (let r = 0; r < 6; r++) { const w = pdWorld({ n: 6, G: 30, s: 12, mu: 0 }, 5 + 101 * r);
      for (let t = 1; t <= w.G; t++) w.rows[t].forEach(f => { for (const s of [0, 1]) for (let k = 0; k < NT; k++) { tot++; if (f.g[s][TRACED[k]] === w.rows[t - 1][f.pa[s]].g[f.sd[s * NT + k]][TRACED[k]]) good++; } }); }
    check("A engine: every link points at a parent chromosome carrying the same allele (" + good + " of " + tot + ", no mutation)", tot > 10000 && good === tot);
    const w0 = pdWorld({ n: 6, G: 30, s: 10, mu: 0 }, 9), w1 = pdWorld({ n: 6, G: 30, s: 10, mu: 0.04 }, 9);
    let newIn0 = 0, wrongPond = 0, green = 0;
    for (const row of w0.rows) for (const f of row) for (const c of f.g) for (let i = 0; i < L; i++) if (w0.org[c[i]] >= 0) newIn0++;
    w1.rows.forEach((row, t) => { for (const f of row) for (const c of f.g) for (let i = 0; i < L; i++) { const o = w1.org[c[i]]; if (o === 0) green++; if (t >= w1.g0 && o >= 1 && o !== f.pond + 1) wrongPond++; } });
    check("A engine: no mutation, no new allele (" + newIn0 + "); at .04, new alleles from before the split (" + green + ") and none from one pond found in the other (" + wrongPond + ")", newIn0 === 0 && green > 0 && wrongPond === 0);
  }
  /* ================= A: the reads ================= */
  {
    const res = [];
    for (let it = 0; it < 4; it++) {
      let right = 0, wrong = 0, n = 0, origin = true;
      for (let r = 0; r < 12; r++) {
        const item = AITEMS[it], w = pdWorld({ n: 6, G: 20, s: 10, mu: item.mut ? 0.02 : 0.01 }, 300 + 7919 * r + it), d = dealRead(w, item, mulberry32(w.salt + 5)); if (!d) continue; n++;
        const a = d.key[0], hit = c => d.key.some(k => c.t === k.t && c.i === k.i && c.s === k.s);
        if (hit({ t: a.t, i: a.i, s: a.s })) right++;
        const other = { t: a.t, i: a.i, s: 1 - a.s }; if (!hit(other)) wrong++;
        if (item.mut) { const id = w.rows[w.G][d.tips[0].fish].g[d.tips[0].side][TRACED[d.k]], f = w.rows[a.t][a.i], par = w.rows[a.t - 1][f.pa[a.s]].g[f.sd[a.s * NT + d.k]][TRACED[d.k]];
          if (f.g[a.s][TRACED[d.k]] !== id || par === id) origin = false; }
        else { const up = d.tips.map(c => pdUp(w, w.G, c.fish, c.side, d.k)), on = up.filter(p => p.some(c => c.t === a.t && c.i === a.i && c.s === a.s)).length; if (on < 2) origin = false; }
      }
      res.push(AITEMS[it].id + " " + right + "/" + n + " right, " + wrong + "/" + n + " other copy wrong, key " + origin);
      if (!(n >= 10 && right === n && wrong === n && origin)) res.push("BAD");
    }
    check("A reads: each dealt answer is a copy the ringed lineages share (A3: the copy where the new allele arose); its twin chromosome is not the answer: " + res.join("; "), !res.includes("BAD"));
  }
  /* ================= A: the targets, 16 pedigrees a Go ================= */
  const Gos = (P, item, n) => { let h = 0; const v = []; for (let r = 0; r < n; r++) { const b = pdBatch(P, 4000 + 104729 * r + 13 * item); const ok = AITEMS[item].ok(b.S); if (ok) h++; v.push(AITEMS[item].val(b.S)); } return { h, v }; };
  const TA = (item, good, open, n, minGood, maxOpen, far) => {
    const g = Gos(good, item, n), o = Gos(open, item, n), f = far ? Gos(far, item, n) : null;
    check("A target " + (item - 3) + ": " + JSON.stringify(good).replace(/"/g, "") + " " + g.h + "/" + n + " (" + g.v.join(", ") + "); the opening " + JSON.stringify(open).replace(/"/g, "") + " " + o.h + "/" + n + (f ? "; too far " + JSON.stringify(far).replace(/"/g, "") + " " + f.h + "/" + n : ""),
          g.h >= minGood && o.h <= maxOpen && (!f || f.h <= maxOpen));
  };
  /* measured: .77 vs .43; .22 vs .43 (bar .28 after); T3 .77-.92 / .88-.99 vs 0 and .25-.35 within; T4 .73-.95 vs .00-.11 */
  TA(4, { n: 4, G: 40, s: 25, mu: 0.01 }, { n: 4, G: 40, s: 35, mu: 0.01 }, 5, 5, 0);
  TA(5, { n: 10, G: 40, s: 35, mu: 0.01 }, { n: 4, G: 40, s: 35, mu: 0.01 }, 5, 5, 0);
  TA(6, { n: 4, G: 60, s: 10, mu: 0.01 }, { n: 4, G: 60, s: 10, mu: 0 }, 5, 4, 0, { n: 4, G: 60, s: 10, mu: 0.04 });
  TA(7, { n: 4, G: 60, s: 1, mu: 0.005 }, { n: 4, G: 40, s: 30, mu: 0.005 }, 5, 4, 0);

  /* ================= B ================= */
  {
    const P = { N: BN, T: 100, mu: 0.004, m: 0.1, cost: 1, c: 1 }, w = bwWorld(P, 77);
    let pairsIn = 0, chBefore = 0; while (w.t < P.T) { bwStep(w); for (const F of w.pops) for (const g of F) pairsIn += bwPairs(w, g); }
    chBefore = bwFreq(w, w.CH); const hyb = bwHybrids(w, 60); bwStep(w); const chAfter = bwFreq(w, w.CH);
    check("B engine: before the floods no fish carries an incompatible pair (" + pairsIn + "), though a hybrid would (survival " + hyb.toFixed(2) + "); the choosy allele absent (" + chBefore.map(v => v.toFixed(2)) + ") then near one in ten (" + chAfter.map(v => v.toFixed(2)) + ")",
          pairsIn === 0 && hyb < 0.5 && chBefore.every(v => v === 0) && chAfter.every(v => v > 0.02 && v < 0.25));
  }
  const goB = (set, seed) => { const q = SB.cfg.start(Object.assign({ cost: 1, c: 0, m: 0.05 }, set), seed); Object.assign(q, { set, t: 0, hist: [] }); snap(q); while (q.t < q.G) stepOnce(q); return q; };
  const TB = (k, good, open, n) => {
    const r = B_ROUNDS[k], run = s => { let h = 0; const v = []; for (let i = 0; i < n; i++) { const q = goB(s, 600 + 9973 * i + 17 * k), S = sumAt(q, q.G), j = judge(r, S, q); if (j.ok) h++; v.push(j.vals.join("/")); } return { h, v }; };
    const g = run(Object.assign({}, r.hold, r.open, good)), o = run(Object.assign({}, r.hold, r.open));
    check("B target " + (k + 1) + ": " + JSON.stringify(good).replace(/"/g, "") + " " + g.h + "/" + n + " (" + g.v.join(", ") + "); the opening " + o.h + "/" + n + " (" + o.v.join(", ") + ")", g.h === n && o.h === 0);
  };
  /* measured (16 runs averaged): .08-.14 vs .88-.97; .10-.19 vs .97-.99; .43-.59 vs .00-.07; .05 vs .43-.59 */
  TB(0, { mu: 0.002 }, null, 2); TB(1, { T: 400 }, null, 2); TB(2, { c: 1 }, null, 2); TB(3, { T: 50 }, null, 2);

  /* ================= C ================= */
  const grow = (set, seed, sched) => { const w = ctWorld(set, seed); while (w.t < 0) ctStep(w);
    while (w.t < C_G) { for (const pid of sched(w.t + 1, w)) if (!w.pending.includes(pid) && w.alive.length + w.pending.length < C_CAP) w.pending.push(pid); ctStep(w); } return w; };
  const seq = (d, k, t0) => (t, w) => (t >= (t0 || 1) && (t - (t0 || 1)) % d === 0 && w.alive.length < k) ? [w.alive.slice().sort((a, b) => w.pops[a].born - w.pops[b].born)[0]] : [];
  const bal = (d, k) => (t, w) => (t % d === 1 && w.alive.length < k) ? w.alive.slice(0, k - w.alive.length) : [];
  {
    const w0 = grow({ N: 10, mu: 0.001, R: 1 }, 5, () => []), w1 = grow({ N: 10, mu: 0.001, R: 1 }, 5, (t, w) => t % 10 === 1 ? w.alive.slice() : []);
    const w2 = grow({ N: 50, mu: 0.001, R: 0 }, 8, seq(10, 6, 100)), loci = ctLoci(w2), same = ctJudgeOf(w2).same;
    let early = 0, n = 0;
    for (const l of ctLoci(w1)) for (const m of l.tr.merges) { for (let i = 0; i < w1.alive.length; i++) for (let j = i + 1; j < w1.alive.length; j++) if ((m.mask >> i & 1) && (m.mask >> j & 1)) { n++; if (m.t < ctParted(w1, w1.alive[i], w1.alive[j])) early++; } }
    check("C engine: no click, one population all run (" + w0.alive.length + "); a click at every chance, never more than 16 (" + w1.alive.length + "); no crossing over, every locus the same tree (" + same + ", " + loci.map(l => l.cat).join("") + "); lineages of two populations meet only before they parted (" + early + " of " + n + ")",
          w0.alive.length === 1 && w1.alive.length === 16 && same && early === n && n > 100);
  }
  const TC = (k, good, gs, open, os, n, minGood, maxOpen) => {
    const run = (set, sc) => { let h = 0; const v = []; for (let i = 0; i < n; i++) { const c = ctJudgeOf(grow(set, 300 + 104729 * i + k, sc)); if (C_ROUNDS[k].ok(c)) h++; v.push(c.n + ":" + c.v + "/" + c.p + "/" + c.x); } return { h, v }; };
    const g = run(good, gs), o = run(open, os);
    check("C target " + (k + 1) + ": " + JSON.stringify(good).replace(/"/g, "") + " " + g.h + "/" + n + " trees (" + g.v.join(" ") + "); the opening " + JSON.stringify(open).replace(/"/g, "") + " " + o.h + "/" + n + " (" + o.v.join(" ") + ")", g.h >= minGood && o.h <= maxOpen);
  };
  /* measured (8 trees): 8/8 vs 0-1/8; 8/8 vs 0/8 (N 5, splits 10 apart); 8/8 vs 0/8; 8/8 vs 0/8 */
  TC(0, { N: 5, mu: 0.001, R: 1 }, seq(50, 6), { N: 50, mu: 0.001, R: 1 }, seq(50, 6), 6, 5, 1);
  TC(1, { N: 25, mu: 0.001, R: 1 }, seq(10, 6, 300), { N: 5, mu: 0.001, R: 1 }, seq(10, 6, 300), 6, 5, 1);
  TC(2, { N: 10, mu: 0.001, R: 1 }, bal(70, 12), { N: 25, mu: 0.001, R: 1 }, bal(70, 12), 6, 5, 0);
  TC(3, { N: 100, mu: 0.001, R: 0 }, seq(10, 6, 100), { N: 100, mu: 0.001, R: 1 }, seq(10, 6, 100), 4, 4, 0);

  /* ================= D ================= */
  {
    const P0 = { cs: 0, cl: 0, gc: 0.02 }; let a = 0, k = 0;
    for (let r = 0; r < 300; r++) { const w = dcWorld(P0, 77 + 13 * r); for (let t = 0; t < D_G; t++) dcStep(w); a += D_stat(w).col; k++; }
    const f = dNeutral(0.02, D_G);
    /* 300 clades: the mean's spread about .02 (a clade's share sd .2-.3, clades share ancestry inside, not across) */
    check("D: no arrows, the far dispersers' share at 200 million years over 300 clades " + (a / k).toFixed(3) + " against the dashed curve's " + f.toFixed(3), Math.abs(a / k - f) < 0.06);
  }
  const goD = (set, seed) => { const q = SD.cfg.start(set, seed); Object.assign(q, { set, t: 0, hist: [] }); snap(q); while (q.t < q.G) stepOnce(q); return q; };
  const TD = (k, good, n, slack) => {
    const r = D_ROUNDS[k], base = Object.assign({ cs: 0, cl: 0, gc: 0.002 }, r.hold, r.open);
    const run = s => { let h = 0; const v = []; for (let i = 0; i < n; i++) { const q = goD(s, 900 + 104729 * i + k), j = judge(r, sumAt(q, q.G), q); if (j.ok) h++; v.push(j.vals.join("")); } return { h, v }; };
    const g = run(Object.assign({}, base, good)), o = run(base);
    check("D target " + (k + 1) + ": " + JSON.stringify(good).replace(/"/g, "") + " " + g.h + "/" + n + " (" + g.v.join(", ") + "); the opening " + o.h + "/" + n + " (" + o.v.join(", ") + ")", g.h >= n - (slack || 1) && o.h === 0);
  };
  /* measured (10 Gos): .64-.78 vs .12-.27; .13-.30 vs .32-.50; .30-.51 vs .13-.30, window .38-.58 (×0.25 .60-.67 above it); .60-.67 vs .13-.30 */
  TD(0, { cl: -1.4 }, 6); TD(1, { cs: -0.7 }, 6); TD(2, { cl: -0.7 }, 6, 2); TD(3, { cl: -1.4 }, 6);

  /* ================= E ================= */
  {
    let n = 0, bad = [], traps = 0;
    for (let r = 0; r < 60; r++) for (let it = 0; it < 6; it++) {
      const T = etTree(5000 + 104729 * r + it), q = EITEMS[it].deal(T); if (!q) continue; n++;
      const tips = T.order, forks = T.nodes.filter(x => x.kids.length).map(x => x.id);
      if (q.what === "tip") { const a = q.ring[0], d = id => { const m = etMrca(T, a, id); return T.nodes[m].age; }, best = Math.min(...tips.filter(t => t !== a).map(d));
        if (!tips.filter(t => t !== a).every(t => q.key.includes(t) === (d(t) === best))) bad.push(EITEMS[it].id + " key");
        if (it === 1 && q.key.length < 2) bad.push("E2 one"); if (it === 2) { if (!etNeighbours(T, a).some(x => !q.key.includes(x))) bad.push("E3 trap"); else traps++; } }
      else { const [a, b] = q.ring, m = q.key[0], under = new Set(etTips(T, m));
        if (!(under.has(a) && under.has(b)) || T.nodes[m].kids.some(k => { const u = new Set(etTips(T, k)); return u.has(a) && u.has(b); })) bad.push(EITEMS[it].id + " fork");
        if (it === 4 && (m === T.root || Math.abs(T.nodes[a].row - T.nodes[b].row) < 4)) bad.push("E5 trap"); if (it === 5) { if (m !== T.root || Math.abs(T.nodes[a].row - T.nodes[b].row) !== 1) bad.push("E6 trap"); else traps++; } }
    }
    check("E: " + n + " dealt questions; a nearest-relative key is every tip whose fork with the ringed one is the youngest, a common-ancestor key the fork holding both and no younger one; the traps hold (" + traps + " page neighbours not nearest / oldest fork)", n > 300 && !bad.length, bad.slice(0, 5).join(", "));
  }

  /* ================= the flow, by the stages' own buttons ================= */
  {
    const setR = (id, i) => { const el = $(id); el.value = String(i); el.dispatchEvent(new Event("input")); };
    $("A_practice").checked = false;
    /* A: a wrong read records 0 and stays; then every item by its answer or its intended setting */
    gotoItem(0); const d0 = AY.read, wrongC = { kind: "copy", t: d0.key[0].t, i: d0.key[0].i, s: 1 - d0.key[0].s, k: d0.k };
    PV.last = wrongC; lockIn(); const missA = Score.getBit("scaffold", BIT.A1) === 0 && !AY.results[0] && AY.answered;
    newPed(false); PV.last = Object.assign({ kind: "copy", k: AY.read.k }, AY.read.key[0]); lockIn(); const hitA = !!AY.results[0];
    for (let it = 1; it < 4; it++) { gotoItem(it); PV.last = Object.assign({ kind: "copy", k: AY.read.k }, AY.read.key[0]); lockIn(); }
    const intended = [null, null, null, null, { s: 25 }, { n: 3 }, { mu: 3 }, { G: 3, s: 1 }];
    for (let it = 4; it < 8; it++) { gotoItem(it); for (const [k, v] of Object.entries(intended[it])) setR("A_" + k, v);
      for (let tries = 0; tries < 4 && !AY.results[it]; tries++) { $("A_go").click(); while (AY.run) { AY.shown = 1e9; endTarget(); } } }
    const openB = Gates.B.open && !$("stageB").classList.contains("stage-locked");
    check("flow A: a wrong copy records 0 and the read stays (" + missA + "), the right one solves it (" + hitA + "); all eight done opens B (" + AY.results.filter(Boolean).length + ", " + openB + ")", missA && hitA && AY.results.filter(Boolean).length === 8 && openB);
    /* B, C, D: each target's intended setting, Go by the button, Next target */
    const runStage = (S, sets) => { for (let k = 0; k < sets.length; k++) { gotoRound(S, k); for (const [key, v] of Object.entries(sets[k])) { const c = S.cfg.ctl.find(x => x.key === key), el = $(S.K + "_" + key); el.value = String(c.vals.indexOf(v) + (+el.min || 0)); el.dispatchEvent(new Event("input")); }
      for (let tries = 0; tries < 4 && !S.results[k]; tries++) { $(S.K + "_go").click(); finishNow(S); } } };
    runStage(SB, [{ mu: 0.002 }, { T: 400 }, { c: 1 }, { T: 50 }]);
    const openC = Gates.C.open;
    const plans = [[5, seq(50, 6)], [25, seq(10, 6, 300)], [10, bal(70, 12)], [100, seq(10, 6, 100)]];
    for (let k = 0; k < 4; k++) { gotoRoundC(k); setR("C_N", C_NV.indexOf(plans[k][0])); if (k === 3) setR("C_R", 0);
      for (let tries = 0; tries < 5 && !CX.results[k]; tries++) { $("C_go").click(); const q = CX.run, w = q.w;
        while (w.t < C_G) { for (const pid of plans[k][1](w.t + 1, w)) if (!w.pending.includes(pid)) w.pending.push(pid); ctStep(w); } endC(); } }
    const openD = Gates.D.open;
    runStage(SD, [{ cl: -1.4 }, { cs: -0.7 }, { cl: -0.7 }, { cl: -1.4 }]);
    const openE = Gates.E.open;
    /* E: a wrong pick records 0 and shows the answer; another tree, the right one; then the rest */
    gotoItemE(0); EX.pick = EX.q.ring[0]; syncE(); $("E_lockin").click(); const missE = Score.getBit("scaffold", BIT.E1) === 0 && !EX.results[0] && EX.answered;
    $("E_deal").click(); EX.pick = EX.q.key[0]; syncE(); $("E_lockin").click(); const hitE = !!EX.results[0];
    for (let i = 1; i < 6; i++) { gotoItemE(i); EX.pick = EX.q.key[0]; syncE(); $("E_lockin").click(); }
    const D = Object.keys(BIT).length; let nb = 0; for (let i = 0; i < D; i++) if (Score.isAnswered("scaffold", i)) nb++;
    check("flow: B's four done opens C (" + openC + "), C's four by clicks opens D (" + openD + "), D's four open E (" + openE + "); in E a wrong pick records 0 (" + missE + "), another tree and the right one solve it (" + hitE + "); E's six end the lesson (" + $("done-banner").classList.contains("shown") + "); all " + D + " bits written (" + nb + ")",
          openC && openD && openE && missE && hitE && Gates.E.done && $("done-banner").classList.contains("shown") && D === 26 && nb === D);
  }
  /* ================= layout ================= */
  {
    const infos = [...document.querySelectorAll(".info")], tipOf = e => e.dataset.tip ? document.getElementById(e.dataset.tip) : e.querySelector(".tip");
    const empty = infos.filter(e => !tipOf(e) || !tipOf(e).textContent.trim()).length;
    check("hover text: " + infos.length + " marks, " + empty + " empty", infos.length >= 15 && empty === 0);
    FIT_EPOCH++; paintAll();
    const over = []; for (const id of CANVAS_IDS) { const cv = document.getElementById(id); if (!cv || cv.hidden) continue; const host = cv.parentElement; if (+cv.dataset.drawW > host.clientWidth + 1) over.push(id + " " + cv.dataset.drawW + ">" + host.clientWidth); }
    check("every canvas fits its panel (" + window.innerWidth + " wide)", over.length === 0, over.join(", "));
    const lastOk = ["A", "B", "C", "D", "E"].every(k => { const els = document.querySelectorAll("#stage" + k + " .panel"), last = els[els.length - 1]; return last.matches("details.rcode") && !last.open; });
    check("layout: the R code last and closed in every stage; no readout lines", lastOk && document.querySelectorAll(".readout").length === 0);
  }
  say(bad ? ("FAILED " + bad) : "ALL BARS PASS");
  say("RAN " + ran);
  for (const k of ["A", "B", "C", "D", "E"]) say("R" + k + " " + RTEXT["code" + k].replace(/\n/g, "\\n"));
  return L_.join(" ;; ");
}
function narrow(CANVAS_IDS) {
  for (const k of ["A", "B", "C", "D", "E"]) document.getElementById("stage" + k).classList.remove("stage-locked");
  FIT_EPOCH++; paintAll();
  const over = []; for (const id of CANVAS_IDS) { const cv = document.getElementById(id); if (!cv || cv.hidden) continue; const host = cv.parentElement; if (+cv.dataset.drawW > host.clientWidth + 1) over.push(id + " " + cv.dataset.drawW + ">" + host.clientWidth); }
  return (over.length ? "FAIL " : "ok   ") + "every canvas fits its panel (" + window.innerWidth + " wide)" + (over.length ? "  -- " + over.join(", ") : "");
}
const INNER = "(" + inner.toString() + ")(" + JSON.stringify(CANVAS_IDS) + ")", INNER_NARROW = "(" + narrow.toString() + ")(" + JSON.stringify(CANVAS_IDS) + ")";
const probe = `<!doctype html><meta charset="utf-8"><title>pending</title>
<iframe id="f" src="http://127.0.0.1:${PORT}/app/lessons/lesson20.html?preview=1" width="1500" height="1000"></iframe>
<iframe id="g" src="http://127.0.0.1:${PORT}/app/lessons/lesson20.html?preview=1" width="1000" height="900"></iframe>
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
const probePath = path.join(ROOT, "_check_l20_" + PORT + ".html");
fs.writeFileSync(probePath, probe);
const server = spawn("python3", ["-m", "http.server", String(PORT), "--directory", ROOT], { stdio: "ignore", detached: true });
const cleanup = () => { try { process.kill(-server.pid); } catch (e) {} try { fs.unlinkSync(probePath); } catch (e) {} };
process.on("exit", cleanup);
setTimeout(() => {
  const r = spawnSync(CHROME, ["--headless=new", "--disable-gpu", "--virtual-time-budget=4000000", "--dump-dom", `http://127.0.0.1:${PORT}/_check_l20_${PORT}.html`], { encoding: "utf8", maxBuffer: 1 << 28 });
  const dec = s => s.replace(/&quot;/g, '"').replace(/&gt;/g, ">").replace(/&lt;/g, "<").replace(/&amp;/g, "&");
  const m = /<pre id="out">([\s\S]*?)<\/pre>/.exec(r.stdout || ""), m2 = /<pre id="out2">([\s\S]*?)<\/pre>/.exec(r.stdout || "");
  if (!m) { console.error("no result -- is Chrome at " + CHROME + " ?"); cleanup(); process.exit(2); }
  const text = dec(m[1]), lines = text.split(" ;; ");
  let bad = !/ALL BARS PASS/.test(text);
  for (const line of lines) if (!/^R[ABCDE] /.test(line)) console.log(line);
  const reported = lines.filter(l => /^(ok|FAIL)\s/.test(l)).length, ranLine = /^RAN (\d+)$/.exec((lines.find(l => /^RAN \d+$/.test(l)) || ""));
  if (!ranLine || +ranLine[1] !== reported) { console.log("FAIL harness  " + (ranLine ? ranLine[1] : "?") + " checks ran, " + reported + " came back"); bad = true; }
  const nar = m2 ? dec(m2[1]) : "FAIL narrow frame gave nothing"; console.log(nar); if (!/^ok/.test(nar)) bad = true;
  /* the R panels, shortened, when R is here */
  const probeR = spawnSync("Rscript", ["--version"], { encoding: "utf8" });
  if (probeR.error) console.log("skip R panels  (no Rscript)");
  else for (const k of ["A", "B", "C", "D", "E"]) {
    let src = (lines.find(l => l.startsWith("R" + k + " ")) || "").slice(3).replace(/\\n/g, "\n");
    if (k === "B") src = src.replace(/^T(apart <- )\d+/m, "Tapart <- 10").replace("(Tapart + 150)", "(Tapart + 10)");
    if (k === "C") src = src.replace(/^N <- \d+/m, "N <- 5").replace("G <- 400", "G <- 30");
    const o = spawnSync("Rscript", ["-e", src + "\ncat('\\nOK\\n')"], { encoding: "utf8", timeout: 240000 }), ok = /OK/.test(o.stdout || "");
    console.log((ok ? "ok   " : "FAIL ") + "the R panel of stage " + k + " runs" + (ok ? "" : "  -- " + (o.stderr || "").slice(0, 300)));
    if (!ok) bad = true;
  }
  cleanup(); process.exit(bad ? 1 : 0);
}, 700);
