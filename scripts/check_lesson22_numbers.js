#!/usr/bin/env node
/*
 * check_lesson22_numbers.js -- the checks for app/lessons/lesson22.html.
 *
 * Lesson 22, draft 1 (2026-11-07): kin selection and gene-level selection
 * on a grid of nests (JM: "Yes please go ahead with the grid"). A help
 * that reaches the neighbours; B relatedness as a condition, the change
 * taken apart; C helping at the start and a mutation that breaks it; D
 * help that follows a call (JM, 2026-11-07: "nothing should have
 * **perfect** kin recognition"); E a driving gene. What has to hold:
 *
 *   Engine. A bird's young follow 2 f, f = 1 - c h + b (neighbours' h) / 4;
 *      alleles pass as Mendel says; a driver goes into q of a carrier's
 *      gametes; broken helping alleles at 1 in 100; neighbours share a
 *      parent more the closer young settle; the change in the helping
 *      allele taken apart (own, neighbours', what the young keep) adds up
 *      exactly, own + neighbours' = cov(w, z) / w-bar, and the driver's too.
 *      D: a helper's help goes to the birds within 2 that call like it
 *      (all of it to one alone; none given, none paid, with none); young
 *      copy the father's call but for 1 in m; copies turn kind at 1/200;
 *      both of D's splits add up exactly.
 *   Rounds. Each target hit by its intended setting (and a neighbour of
 *      it), missed by its opening. D: no setting of the call gives help
 *      that reaches only family and misses none of it; D4's checking
 *      stops short of all, selection and the turning in balance.
 *   Flow. Held and free arrows; a miss records 0; Next after a hit; 14
 *      bits written; the lesson ends.
 *   Layout. Hover marks with words; every canvas fits (1500 and 1000
 *      wide); each stage's R code last and closed; the five R panels run
 *      (shortened to 3 generations).
 *
 * Usage:  node scripts/check_lesson22_numbers.js      (~5 minutes)
 */
const { spawn, spawnSync } = require("child_process");
const fs = require("fs"), path = require("path");
const ROOT = path.resolve(__dirname, "..");
const PORT = +process.env.PORT || 8798;
const CHROME = process.env.CHROME || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const CANVAS_IDS = ["A_map", "A_time", "A_split", "A_tpic", "B_map", "B_time", "B_split", "B_tpic", "C_map", "C_time", "C_split", "C_tpic", "D_map", "D_time", "D_split", "D_tpic", "E_map", "E_time", "E_split", "E_tpic"];

const INNER = `
const L_=[], say=s=>L_.push(s);
let bad=0, ran=0;
const check=(name, ok, detail)=>{ ran++; if(!ok) bad++; say((ok?"ok   ":"FAIL ")+name+(detail?"  -- "+detail:"")); };
for (const k in Gates) { Gates[k].open = true; document.getElementById("stage" + k).classList.remove("stage-locked"); }
const GP = P => Object.assign({ b: 0, c: 0, d: 1, mu: 0, p0: 0.5, q: 0.5, k: 0, dr0: 0 }, P);
const empty = w => { w.occ.fill(0); w.g.fill(0); w.dr.fill(0); };
/* ================= the engine ================= */
{
  /* fecundity: a lone bird, or one with four neighbours, on an empty island: its young that settle, by its mother index */
  const young = (P, setup, R) => { let n = 0; for (let r = 0; r < R; r++) { const w = gWorld(GP(P), 500 + r); empty(w); setup(w); gStep(w); for (let x = 0; x < GN; x++) if (w.occ[x] && w.mo[x] === 528) n++; } return n / R; };
  const lone = (w, h) => { w.occ[528] = 1; w.g[2 * 528] = h; w.g[2 * 528 + 1] = h; };
  const y1 = young({ c: 0.5 }, w => lone(w, 1), 400), y0 = young({ c: 0.5 }, w => lone(w, 0), 400);
  const y4 = young({ c: 0.2, b: 1 }, w => { lone(w, 1); for (const j of NB4[528]) { w.occ[j] = 1; w.g[2 * j] = 1; w.g[2 * j + 1] = 1; } }, 400);
  check("engine: young a bird leaves = 2 f: a lone full helper at cost .5 " + y1.toFixed(2) + " (1.0), a lone non-helper " + y0.toFixed(2) + " (2.0); a full helper among four at cost .2, benefit 1 " + y4.toFixed(2) + " (3.6)",
        Math.abs(y1 - 1) < 0.12 && Math.abs(y0 - 2) < 0.15 && Math.abs(y4 - 3.6) < 0.25);
  /* Mendel, the driver, the breaks: every bird one of each */
  const gam = (P, set) => { let a = 0, n = 0, d = 0; for (let r = 0; r < 20; r++) { const w = gWorld(GP(P), 600 + r); set(w); gStep(w); for (let x = 0; x < GN; x++) if (w.occ[x]) { a += w.g[2 * x] + w.g[2 * x + 1]; d += w.dr[2 * x] + w.dr[2 * x + 1]; n += 2; } } return [a / n, d / n]; };
  const het = w => { for (let i = 0; i < GN; i++) { w.g[2 * i] = 0; w.g[2 * i + 1] = 1; w.dr[2 * i] = 0; w.dr[2 * i + 1] = 1; } };
  const [ha, d5] = gam({}, het), [, d9] = gam({ q: 0.9 }, het), [hb] = gam({ mu: 0.01, p0: 1 }, w => {});
  check("engine: from one-of-each parents the young carry the helping allele " + ha.toFixed(3) + " (1/2), the driver " + d5.toFixed(3) + " fair and " + d9.toFixed(3) + " at drive .9; from all helpers with 1 in 100 broken, " + hb.toFixed(4) + " (.99)",
        Math.abs(ha - 0.5) < 0.01 && Math.abs(d5 - 0.5) < 0.01 && Math.abs(d9 - 0.9) < 0.01 && Math.abs(hb - 0.99) < 0.002);
  /* kinship by how close young settle (no helping) */
  const kin = d => { let s = 0; for (let r = 0; r < 4; r++) { const w = gWorld(GP({ d }), 700 + r); for (let t = 0; t < 20; t++) gStep(w); s += gStat(w).kin; } return s / 4; };
  const ks = [1, 2, 4, 8].map(kin);
  check("engine: neighbours that share a parent, within 1, 2, 4, 8: " + ks.map(v => v.toFixed(3)).join(", ") + " (falling)", ks[0] > ks[1] && ks[1] > ks[2] && ks[2] > ks[3] && ks[0] > 0.12 && ks[3] < 0.03);
  /* the split adds up exactly */
  { const w = gWorld(GP({ b: 1.5, c: 0.1, d: 2, mu: 0.01, q: 0.7, k: 0.2, dr0: 0.3 }), 77); let worst = 0, reg = 0, mis = 0;
    for (let t = 0; t < 20; t++) { const s0 = gStat(w); gStep(w); const s1 = gStat(w), L = w.last;
      worst = Math.max(worst, Math.abs(L.own + L.nbr + L.keep - (L.after - L.before)), Math.abs(L.dcov + L.dkeep - (L.dafter - L.dbefore)));
      reg = Math.max(reg, Math.abs(L.own + L.nbr - L.cov)); mis = Math.max(mis, Math.abs(L.before - s0.p), Math.abs(L.after - s1.p), Math.abs(L.dafter - s1.dr)); }
    check("engine: own + neighbours' + what the young keep = the change in the helping allele, and the driver's two parts its change (worst " + worst.toExponential(1) + "); own + neighbours' = cov(w, z) / w-bar (" + reg.toExponential(1) + "); the menus' means (" + mis.toExponential(1) + ")",
          worst < 1e-12 && reg < 1e-12 && mis < 1e-12); }
}
/* ================= stage D's engine ================= */
{
  const KP = P => Object.assign({ b: 1.5, c: 0.5, d: 1, m: 0, ck: 1, ev: 0, p0: 0 }, P);
  const kEmpty = w => { w.occ.fill(0); w.g.fill(0); w.av.fill(0); };
  /* a full helper at 528 that checks the call; X two nests east calls like it, Y two south does not: young by mother */
  const young = (P, setup, R) => { const n = {}; for (let r = 0; r < R; r++) { const w = kWorld(KP(P), 900 + r); kEmpty(w); setup(w); kStep(w); for (let x = 0; x < GN; x++) if (w.occ[x]) n[w.mo[x]] = (n[w.mo[x]] || 0) + 1 / R; } return n; };
  const put = (w, i, h, call) => { w.occ[i] = 1; w.g[2 * i] = h; w.g[2 * i + 1] = h; w.av[2 * i] = 1; w.av[2 * i + 1] = 1; w.call[i] = call; };
  const X = 530, Y = 528 + 2 * GL;
  const n1 = young({}, w => { put(w, 528, 1, 7); put(w, X, 0, 7); put(w, Y, 0, 9); }, 300);
  const n0 = young({}, w => { put(w, 528, 1, 7); put(w, Y, 0, 9); }, 300);
  check("D engine: a full helper that checks, cost .5: it " + f2(n1[528]) + " (1.0), the one bird calling alike within reach " + f2(n1[X]) + " (2 x 2.5 = 5.0), a bird calling differently " + f2(n1[Y]) + " (2.0); with none calling alike the helper " + f2(n0[528]) + " (2.0: no help given, none paid)",
        Math.abs(n1[528] - 1) < 0.15 && Math.abs(n1[X] - 5) < 0.35 && Math.abs(n1[Y] - 2) < 0.2 && Math.abs(n0[528] - 2) < 0.2);
  /* calls: the father's, or a new one */
  const fromFa = m => { let s = 0, n = 0; for (let r = 0; r < 6; r++) { const w = kWorld(KP({ m, p0: 0.5 }), 950 + r), before = w.call.slice(); kStep(w); for (let x = 0; x < GN; x++) if (w.occ[x]) { n++; if (w.call[x] === before[w.fa[x]]) s++; } } return s / n; };
  const f0 = fromFa(0), f5 = fromFa(0.5);
  /* turning kind: every copy not checking, 1 in 200 turns */
  let tk = 0, tn = 0; for (let r = 0; r < 20; r++) { const w = kWorld(KP({ ev: 1, p0: 1 }), 980 + r); w.av.fill(0); kStep(w); for (let x = 0; x < GN; x++) if (w.occ[x]) { tk += w.av[2 * x] + w.av[2 * x + 1]; tn += 2; } }
  check("D engine: young with their father's call " + f2(f0) + " (1) when none make up their own, " + (f5).toFixed(3) + " (1/2) when half do; copies turned kind " + (tk / tn).toFixed(4) + " (1/200)",
        f0 === 1 && Math.abs(f5 - 0.5) < 0.02 && Math.abs(tk / tn - 0.005) < 0.0012);
  /* both splits add up exactly */
  { const w = kWorld(KP({ c: 0.1, d: 4, m: 1 / 3, ck: 0, ev: 1, p0: 0.5 }), 77); let worst = 0, mis = 0;
    for (let t = 0; t < 20; t++) { kStep(w); const s1 = kStat(w), L = w.last;
      worst = Math.max(worst, Math.abs(L.own + L.nbr + L.keep - (L.after - L.before)), Math.abs(L.kcov + L.kkeep - (L.kafter - L.kbefore)));
      mis = Math.max(mis, Math.abs(L.after - s1.p)); }
    check("D engine: own + the help it receives + what the young keep = the change in the helping allele, and checking's two parts its change (worst " + worst.toExponential(1) + "); the menu's mean (" + mis.toExponential(1) + ")", worst < 1e-12 && mis < 1e-12); }
}
/* ================= the rounds ================= */
const STG = { A: SA, B: SB, C: SC, D: SD, E: SE };
const setC = (S, o) => { for (const k in o) { const c = S.cfg.ctl.find(c => c.key === k), i = c.vals.indexOf(o[k]); if (i < 0) throw new Error("no " + k + " = " + o[k]); const el = document.getElementById(S.K + "_" + k); el.value = i + (+el.min || 0); el.dispatchEvent(new Event("input")); } };
const play = (K, r, o) => { const S = STG[K]; S.round = r; S.done = false; S.waiting = false; S.run = null; const pr = document.getElementById(K + "_practice"); if (pr) pr.checked = true;
  openRound(S); for (const c of S.cfg.ctl) document.getElementById(K + "_" + c.key).dataset.held = ""; setC(S, o); goStage(S); finishNow(S); return S.last; };
const T = (K, r, good, badOnes) => { const S = STG[K], R = S.cfg.rounds[r];
  const res = (o, want) => { const q = play(K, r, o), e = sumAt(q, q.G), j = judge(R, e); return [o, j.ok === want, j.vals.join("/")]; };
  const g = good.map(o => res(o, true)), b = badOnes.map(o => res(o, false));
  const js = o => JSON.stringify(o, (k, v) => typeof v === "number" ? +v.toFixed(3) : v).replace(/"/g, "");
  check(K + (r + 1) + ": hit by " + g.map(x => js(x[0]) + " (" + x[2] + ")").join(", ") + "; missed by " + b.map(x => js(x[0]) + " (" + x[2] + ")").join(", "),
        g.every(x => x[1]) && b.every(x => x[1])); };
T("A", 0, [{ b: 1 }, { b: 1.5 }], [{ b: 0.5 }]);
T("A", 1, [{ d: 3 }, { d: 4 }], [{ d: 2 }, { d: 1 }]);
T("A", 2, [{ d: 1 }], [{ d: 2 }, { d: 3 }]);
T("B", 0, [{ d: 1 }], [{ d: 2 }, { d: 4 }]);
T("B", 1, [{ b: 1.5, d: 2 }, { b: 2, d: 3 }, { b: 3, d: 8 }], [{ b: 2, d: 2 }, { b: 0.5, d: 2 }]);
T("B", 2, [{ c: 0.2 }, { c: 0.3 }], [{ c: 0.1 }]);
T("C", 0, [{ d: 2 }, { d: 1 }], [{ d: 3 }, { d: 8 }]);
T("C", 1, [{ b: 1 }, { b: 0.5 }], [{ b: 1.5 }]);
T("D", 0, [{ ck: 1 }], [{ ck: 0 }]);
T("D", 1, [{ m: 0.2 }, { m: 1 / 3 }], [{ m: 0 }]);
T("D", 2, [{ m: 0.5 }, { m: 1 / 3 }], [{ m: 0.8 }]);
T("D", 3, [{ m: 0.2 }, { m: 1 / 3 }], [{ m: 0 }]);
T("E", 0, [{ q: 0.6 }, { q: 0.9 }], [{ q: 0.5 }]);
T("E", 1, [{ k: 0.5 }, { k: 0.6 }], [{ k: 0.4 }, { k: 0.2 }]);
{ /* B at the line: the two parts of the change from the birds' helping take opposite signs */
  const q = play("B", 1, { b: 1.5, d: 2 }), e = sumAt(q, q.G);
  check("B2 at benefit 1.5, within 2: from its own helping " + f2(e.sh[0]) + " (negative), from its neighbours' " + f2(e.sh[1]) + " (positive), what the young keep " + f2(e.sh[2]), e.sh[0] < 0 && e.sh[1] > 0); }
{ const q = play("E", 0, { q: 0.6 }), e = sumAt(q, q.G);
  check("E1 at drive .6: who leaves more young " + f2(e.sd[0]) + " (negative), what the young keep " + f2(e.sd[1]) + " (positive)", e.sd[0] < 0 && e.sd[1] > 0); }
{ /* D: the call is a cue, never kin itself (JM, 2026-11-07): at every share of young copying it, help that reaches family and family
     calling alike are not both high -- the help reaches non-family, or the call misses family */
  const rows = M_V.map(m => { const q = play("D", 1, { m }), e = sumAt(q, q.G); return { m, hk: e.hk, kr: e.kr, p: e.p }; });
  check("D: help that reaches birds sharing a parent / birds sharing a parent that call alike, by young that make up their own call: " + rows.map(r => (+r.m.toFixed(2)) + " " + f2(r.hk) + "/" + f2(r.kr)).join(", ") + " (never both above .5; the most helping where the help mostly misses family)",
        rows.every(r => Math.min(r.hk, r.kr) < 0.5 && r.hk < 0.995) && rows.reduce((a, r) => r.p > a.p ? r : a).hk < 0.5); }
{ /* D4: checking climbs and stops short; its change, taken apart: who leaves more young up, what the young keep (the turning) down */
  const q = play("D", 3, { m: 1 / 3 }), e = sumAt(q, q.G);
  check("D4 at 2 in 3 copying: checking " + f2(e.ck) + " (short of all); who leaves more young " + f2(e.sk[0]) + " (positive), what the young keep " + f2(e.sk[1]) + " (negative)", e.ck < 0.97 && e.sk[0] > 0 && e.sk[1] < 0); }
/* ================= the flow ================= */
{
  for (const S of STAGES) { S.round = 0; S.done = false; S.waiting = false; S.results = []; S.last = null; const pr = document.getElementById(S.K + "_practice"); if (pr) pr.checked = false; openRound(S); }
  for (const k in Gates) Gates[k].done = false; paintAll();
  const go = S => { document.getElementById(S.K + "_go").click(); finishNow(S); }, next = S => document.getElementById(S.K + "_next").click();
  const cls = (K, id) => (document.querySelector("#" + K + '_paths [data-of="' + id + '"]') || { classList: { contains: () => false } }).classList;
  const a1 = cls("A", "b").contains("settable") && cls("A", "d").contains("locked") && cls("A", "c").contains("locked") && readSet(SA).b === 0.5;
  go(SA); const miss = Score.getBit("scaffold", BIT.A1) === 0 && !SA.waiting;
  setC(SA, { b: 1 }); go(SA); const hit = SA.waiting; next(SA);
  const a2 = cls("A", "d").contains("settable") && cls("A", "b").contains("locked") && readSet(SA).d === 2;
  setC(SA, { d: 3 }); go(SA); next(SA); setC(SA, { d: 1 }); go(SA);
  check("flow: A1 frees the benefit at .5, the rest held (" + a1 + "); a miss records 0 and stays (" + miss + "); benefit 1 hits (" + hit + "); A2 frees how close young settle at 2 (" + a2 + "); three hits finish A (" + Gates.A.done + ")", a1 && miss && hit && a2 && Gates.A.done);
  setC(SB, { d: 1 }); go(SB); next(SB);
  const b2 = cls("B", "b").contains("settable") && cls("B", "d").contains("settable") && cls("B", "c").contains("locked");
  setC(SB, { b: 1.5 }); go(SB); next(SB); setC(SB, { c: 0.2 }); go(SB);
  check("flow: B2 frees both benefit and how close (" + b2 + "); three hits finish B (" + Gates.B.done + ")", b2 && Gates.B.done);
  setC(SC, { d: 2 }); go(SC); next(SC); setC(SC, { b: 1 }); go(SC);
  check("flow: two hits finish C (" + Gates.C.done + ")", Gates.C.done);
  const dk1 = cls("D", "ck").contains("settable") && cls("D", "m").contains("locked") && cls("D", "b").contains("locked") && readSet(SD).ck === 0;
  setC(SD, { ck: 1 }); go(SD); next(SD);
  const dk2 = cls("D", "m").contains("settable") && cls("D", "ck").contains("locked") && readSet(SD).m === 0;
  setC(SD, { m: 0.2 }); go(SD); next(SD); setC(SD, { m: 0.5 }); go(SD); next(SD);
  const dk4 = !document.querySelector('#D_paths [data-of="ck"]') || document.querySelector('#D_paths [data-of="ck"]').closest("[hidden]") || getComputedStyle(document.querySelector('#D_paths [data-of="ck"]')).display === "none";
  setC(SD, { m: 0.2 }); go(SD);
  check("flow: D1 frees checks the call at no, the rest held (" + dk1 + "); D2 frees young that copy it at all (" + dk2 + "); D4 hides checks the call (" + !!dk4 + "); four hits finish D (" + Gates.D.done + ")", dk1 && dk2 && !!dk4 && Gates.D.done);
  const d1 = cls("E", "q").contains("settable") && cls("E", "k").contains("locked");
  setC(SE, { q: 0.6 }); go(SE); next(SE); setC(SE, { k: 0.5 }); go(SE);
  check("flow: E1 frees the drive, holds the cost (" + d1 + "); two hits finish E (" + Gates.E.done + ")", d1 && Gates.E.done);
  let n = 0; for (let i = 0; i < 14; i++) if (Score.isAnswered("scaffold", i)) n++;
  const bits = Object.keys(BIT).map(k => Score.getBit("scaffold", BIT[k])).join("");
  check("all 14 declared bits written (" + n + "; bits " + bits + "); the lesson ends", n === 14 && bits.startsWith("0") && Gates.E.done && document.getElementById("done-banner").classList.contains("shown"));
}
{
  const infos = [...document.querySelectorAll(".info")], tipOf = e => e.dataset.tip ? document.getElementById(e.dataset.tip) : e.querySelector(".tip");
  const empty = infos.filter(e => !tipOf(e) || !tipOf(e).textContent.trim()).length;
  { const off = []; for (const S of STAGES) for (const c of S.cfg.ctl) { const el = document.getElementById(S.K + "_" + c.key); if (+el.max - +el.min + 1 !== c.vals.length) off.push(S.K + "_" + c.key + " " + (+el.max - +el.min + 1) + "/" + c.vals.length); }
    check("every control's positions match its values (" + off.length + " off)", off.length === 0, off.join(", ")); }
  check("hover text: " + infos.length + " marks, " + empty + " empty", infos.length >= 16 && empty === 0);
  FIT_EPOCH++; paintAll();
  const over = []; for (const id of ${JSON.stringify(CANVAS_IDS)}) { const cv = document.getElementById(id), host = cv.parentElement; if (+cv.dataset.drawW > host.clientWidth + 1) over.push(id + " " + cv.dataset.drawW + ">" + host.clientWidth); }
  check("every canvas fits its panel (" + window.innerWidth + " wide)", over.length === 0, over.join(", "));
  const lastOk = ["A", "B", "C", "D", "E"].every(K => { const els = document.querySelectorAll("#stage" + K + " .panel"), last = els[els.length - 1]; return last.matches("details.rcode") && !last.open; });
  check("layout: each stage's R code last and closed; no readout lines", lastOk && document.querySelectorAll(".readout").length === 0);
}
for (const S of STAGES) S.cfg.paint();
say(bad ? ("FAILED " + bad) : "ALL BARS PASS");
say("RAN " + ran);
for (const K of ["A", "B", "C", "D", "E"]) say("R" + K + " " + RTEXT["code" + K].replace(/\\n/g, "\\\\n"));
L_.join(" ;; ");
`;
const INNER_NARROW = `
for (const k in Gates) document.getElementById("stage" + k).classList.remove("stage-locked");
FIT_EPOCH++; paintAll();
const over = []; for (const id of ${JSON.stringify(CANVAS_IDS)}) { const cv = document.getElementById(id), host = cv.parentElement; if (+cv.dataset.drawW > host.clientWidth + 1) over.push(id + " " + cv.dataset.drawW + ">" + host.clientWidth); }
(over.length ? "FAIL " : "ok   ") + "every canvas fits its panel (" + window.innerWidth + " wide)" + (over.length ? "  -- " + over.join(", ") : "");
`;
const probe = `<!doctype html><meta charset="utf-8"><title>pending</title>
<iframe id="f" src="http://127.0.0.1:${PORT}/app/lessons/lesson22.html?preview=1" width="1500" height="1000"></iframe>
<iframe id="g" src="http://127.0.0.1:${PORT}/app/lessons/lesson22.html?preview=1" width="1000" height="900"></iframe>
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
const probePath = path.join(ROOT, "_check_l22_" + PORT + ".html");
fs.writeFileSync(probePath, probe);
const server = spawn("python3", ["-m", "http.server", String(PORT), "--directory", ROOT], { stdio: "ignore", detached: true });
const cleanup = () => { try { process.kill(-server.pid); } catch (e) {} try { fs.unlinkSync(probePath); } catch (e) {} };
process.on("exit", cleanup);
setTimeout(() => {
  const r = spawnSync(CHROME, ["--headless=new", "--disable-gpu", "--virtual-time-budget=6000000", "--dump-dom", `http://127.0.0.1:${PORT}/_check_l22_${PORT}.html`], { encoding: "utf8", maxBuffer: 1 << 28 });
  const dec = s => s.replace(/&quot;/g, '"').replace(/&gt;/g, ">").replace(/&lt;/g, "<").replace(/&amp;/g, "&");
  const m = /<pre id="out">([\s\S]*?)<\/pre>/.exec(r.stdout || ""), m2 = /<pre id="out2">([\s\S]*?)<\/pre>/.exec(r.stdout || "");
  if (!m) { console.error("no result -- is Chrome at " + CHROME + " ?"); cleanup(); process.exit(2); }
  const text = dec(m[1]), lines = text.split(" ;; ");
  let bad = !/ALL BARS PASS/.test(text);
  for (const line of lines) if (!/^R[ABCDE] /.test(line)) console.log(line);
  const reported = lines.filter(l => /^(ok|FAIL)\s/.test(l)).length, ranLine = /^RAN (\d+)$/.exec((lines.find(l => /^RAN \d+$/.test(l)) || ""));
  if (!ranLine || +ranLine[1] !== reported) { console.log("FAIL harness  " + (ranLine ? ranLine[1] : "?") + " checks ran, " + reported + " came back"); bad = true; }
  const narrow = m2 ? dec(m2[1]) : "FAIL narrow frame gave nothing"; console.log(narrow); if (!/^ok/.test(narrow)) bad = true;
  const probeR = spawnSync("Rscript", ["--version"], { encoding: "utf8" });
  if (probeR.error) console.log("skip R panels  (no Rscript)");
  else for (const K of ["A", "B", "C", "D", "E"]) {
    const src = (lines.find(l => l.startsWith("R" + K + " ")) || "").slice(3).replace(/\\n/g, "\n"), fixed = src.replace(/G <- \d+/, "G <- 3");
    const o = spawnSync("Rscript", ["-e", fixed + "\ncat('\\nOK\\n')"], { encoding: "utf8", timeout: 240000 }), ok = /OK/.test(o.stdout || "");
    console.log((ok ? "ok   " : "FAIL ") + "the R panel of stage " + K + " runs (3 generations)" + (ok ? "  -- " + (o.stdout || "").trim().split("\n").slice(-3, -1).join(" ").replace(/\s+/g, " ") : "  -- " + (o.stderr || "").trim().split("\n").slice(-3).join(" ")));
    if (!ok) bad = true;
  }
  cleanup(); process.exit(bad ? 1 : 0);
}, 700);
