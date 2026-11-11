#!/usr/bin/env node
/*
 * check_lesson24_numbers.js -- the checks for app/lessons/lesson24.html.
 *
 * Lesson 24, draft 3 (2026-11-10): a few named genes build a body. The
 * models run as they are watched, their parts go in one at a time, and a
 * stage ends on a short list of things to find, each noticed off the
 * running model (a find writes its bit 1; nothing writes a miss).
 * A one cell's Hes7; B a row of cells (Hes7, the tail adding cells, Fgf8
 * mRNA); C the whole body (Hoxc6, Hoxc10; three animals to build).
 * What has to hold:
 *
 *   Flow. The page as a student meets it, through its own buttons and
 *      sliders: the parts go in one at a time; nothing is found before
 *      the part that makes it is in; each find is met by its intended
 *      change; a stage's finds open the next; two animals end the lesson
 *      and the third is still taken after; 11 bits, each written once.
 *   Finds. Off the engine, with no side effects: the opening settings
 *      meet none of the finds that ask for a change; each such find is
 *      met by one step the right way, from the start and mid-run, and
 *      not by a step the wrong way. The animals: the mouse is none of
 *      them, each card's setting is its own animal only, and a setting
 *      two hours off on either Hox gene is still that animal (the snake's
 *      Hoxc6 has to be on from the start).
 *   Engine. A: without binding the protein settles at k a hm hp / ln2^2
 *      (the closed form beside the measurement); the mouse's gene pulses
 *      about every two hours. B: 12-cell somites; no growth, no row.
 *   Printed numbers agree with the model they are read from.
 *   Modes. Study mode opens every stage and leaves the finds to find;
 *      the instructor reveal fills them.
 *   Layout. Hover marks; every canvas fits at two widths; R last and
 *      closed; the three R panels run and print what the page measured.
 *
 * The page is asked for with ?still=1: its clock stays stopped and this
 * script steps the models itself (headless Chrome spends a tenth of a
 * second on every animation frame).
 *
 * Usage:  node scripts/check_lesson24_numbers.js      (~2 minutes, most of it Chrome starting)
 */
const { spawn, spawnSync } = require("child_process");
const fs = require("fs"), path = require("path");
const ROOT = path.resolve(__dirname, "..");
const PORT = +process.env.PORT || 8796;
const CHROME = process.env.CHROME || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const CANVAS_IDS = ["A_cell", "A_hist", "B_emb", "C_emb", "C_body", "C_cv0", "C_cv1", "C_cv2"];

const HEAD = `
const L_=[], say=s=>L_.push(s);
let bad=0, ran=0;
const check=(name, ok, detail)=>{ ran++; if(!ok) bad++; say((ok?"ok   ":"FAIL ")+name+(detail?"  -- "+detail:"")); };
const el = id => document.getElementById(id), shown = e => getComputedStyle(e).display !== "none";
const click = id => el(id).click();
const slide = (id, v) => { const e = el(id); e.value = v; e.dispatchEvent(new Event("input", { bubbles: true })); e.dispatchEvent(new Event("change", { bubbles: true })); };
const bits = () => Object.keys(BIT).map(k => Score.isAnswered("scaffold", BIT[k]) ? String(Score.getBit("scaffold", BIT[k])) : "-").join("");
const nFound = () => Object.keys(FOUND).length, ticks = () => document.querySelectorAll("ul.tasks li.done").length;
const fits = () => { FIT_EPOCH++; paintAll(); const over = []; for (const id of ${JSON.stringify(CANVAS_IDS)}) { const cv = el(id), host = cv.parentElement, cs = getComputedStyle(host), room = host.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight); if (+cv.dataset.drawW > room + 1) over.push(id + " " + cv.dataset.drawW + ">" + Math.round(room)); } return over; };
/* a stage stepped a minute (A, B) or six (C) at a time, as the page's clock steps it, until a find is made: the minutes it took */
const until = (S, key, max) => { const per = S.K === "A" ? 4 : S.K === "C" ? 6 : 1, m = S.K === "C" ? 6 : 1; let t = 0; while (t < max && !FOUND[key]) { S.step(per); t += m; } return FOUND[key] ? t : null; };
`;

const INNER = HEAD + `
/* ================= the page as it opens ================= */
check("the page opens locked, its clock stopped (?still=1)", ["A", "B", "C"].every(K => el("stage" + K).classList.contains("stage-locked")) && STILL && !TICKING && nFound() === 0 && bits() === "-----------");
el("stageA").classList.remove("stage-locked"); Gates.A.open = true;

/* ================= flow: the page through its own controls ================= */
{
  const rows0 = !shown(el("A_p2").closest(".part")) && !shown(el("A_p3").closest(".part")) && el("A_hp").disabled;
  SA.step(4 * 900); const m1 = SA.S.c.m, p1 = SA.S.c.p, n1 = nFound();
  click("A_add"); const re1 = SA.S.t === 0 && SA.P.tl === 1 && shown(el("A_p2").closest(".part")) && el("A_p2").checked && !el("A_hp").disabled;
  SA.step(4 * 900); const p2 = SA.S.c.p, top = HX.k * HX.a * 3 * 22 / Math.LN2 / Math.LN2, n2 = nFound();
  click("A_add"); const re2 = SA.S.t === 0 && SA.P.fb === 1 && !shown(el("A_add"));
  SA.step(4 * 590); const early = nFound(); const tp = until(SA, "Apulse", 400), per = cellPeriod(SA.S, 0);
  check("A parts: transcription alone, mRNA settles at " + m1.toFixed(1) + " (k hm / ln2 = " + (HX.k * 3 / Math.LN2).toFixed(1) + ") and no protein (" + Math.round(p1) + "); translation added, the run starts again and the protein settles at " + Math.round(p2) + " (k a hm hp / ln2^2 = " + Math.round(top) + "); nothing found yet (" + n1 + ", " + n2 + "); the later parts and the protein's half-life wait their turn (" + rows0 + ")",
        rows0 && re1 && re2 && Math.abs(m1 / (HX.k * 3 / Math.LN2) - 1) < 0.01 && p1 === 0 && Math.abs(p2 / top - 1) < 0.01 && n1 === 0 && n2 === 0);
  check("A1: the protein on its own promoter, and the pulse is found " + (tp == null ? "never" : (590 + tp) + " minutes in") + " (not before ten hours: " + (early === 0) + "); a peak every " + (per == null ? "-" : per.toFixed(1)) + " min; bits " + bits(),
        early === 0 && tp != null && tp <= 60 && per > 118 && per < 126 && bits() === "1----------" && ticks() === 1);
  const hint = el("A_faster_now").textContent, k = SA.S.peaks, gap = Math.round(k[k.length - 1] - k[k.length - 2]);
  SA.paint(); const hint2 = el("A_faster_now").textContent;
  check("A's printed period is the last gap between peaks (" + hint2 + ")", hint2 === "now: a peak every " + gap + " minutes" && Math.abs(gap - per) <= 1.5);
  click("A_i1"); const out = el("A_i1").classList.contains("out") && SA.P.i1 === 0; const tf = until(SA, "Afaster", 1500), per2 = cellPeriod(SA.S, SA.S.mark);
  click("A_i1"); click("A_i3"); const td = until(SA, "Afade", 3000);
  check("A2, A3: intron 1 out (" + out + "), faster found after " + tf + " min (a peak every " + (per2 == null ? "-" : per2.toFixed(1)) + "); intron 1 back and intron 3 out, the pulses die away, found after " + td + " min; A done and B open (" + Gates.A.done + ", " + Gates.B.open + ")",
        out && tf != null && tf <= 600 && per2 <= 118 && td != null && td <= 1500 && Gates.A.done && Gates.B.open && !el("stageB").classList.contains("stage-locked") && el("solvedA").classList.contains("shown") && bits() === "111--------");
}
{
  SB.step(600); const n0 = nFound() - 3, c0 = SB.w.cells.length;
  click("B_add"); SB.step(600); const n1 = nFound() - 3, c1 = SB.w.cells.length;
  click("B_add"); const held = el("B_hF").disabled; const t4 = until(SB, "Bfour", 2500); SB.step(3000); const noTwo = !FOUND.Btwo, done1 = SB.w.done, segs1 = SB.w.st.segs;
  click("B_add"); const t2 = until(SB, "Btwo", 2500); SB.step(3000); const segs2 = SB.w.st.segs, size2 = rowSize(SB.w), only = nFound() - 3;
  SB.paint(); const hint = el("B_small_now").textContent;
  check("B parts: Hes7 alone, a row of " + c0 + " cells and nothing found (" + n0 + "); the tail adds cells (" + c1 + " after ten hours) and still nothing (" + n1 + "); Fgf8 in, four somites after " + t4 + " min, " + segs1 + " by the end, and never two stripes (" + noTwo + "); Fgf8 speeding Hes7, two stripes after " + t2 + " min; " + segs2 + " somites of " + (size2 == null ? "-" : size2.toFixed(2)) + " cells; two found (" + only + "); printed: " + hint,
        n0 === 0 && c0 === 40 && n1 === 0 && c1 >= 99 && c1 <= 100 && !held && t4 != null && noTwo && done1 && t2 != null && only === 2 && Math.abs(size2 - 12) < 0.25 && hint === "now: " + size2.toFixed(1) + " cells in a somite");
  click("B_i2"); const re = SB.w.t === 0; const ts = until(SB, "Bsmall", 3000), sz = rowSize(SB.w);
  click("B_i2"); SB.step(3000); slide("B_hF", 500); const re2 = SB.w.t === 0 && !SB.w.fTouched; const tz = until(SB, "Bzone", 3000), zn = SB.w.zone;
  SB.step(3000); slide("B_hF", 400); slide("B_hp", 30); const tb = until(SB, "Bblock", 4000);
  check("B2, B4, B3: intron 2 out of a finished row grows it again (" + re + ") with smaller somites, found after " + ts + " min (" + (sz == null ? "-" : sz.toFixed(2)) + " cells); Fgf8 mRNA half-life 500, a longer stretch still running, found after " + tz + " min (" + zn + " cells); protein half-life 30, no boundary, found after " + tb + " min; B done and C open (" + Gates.B.done + ", " + Gates.C.open + ")",
        re && re2 && ts != null && sz <= 11.7 && tz != null && zn >= 76 && tb != null && Gates.B.done && Gates.C.open && !el("stageC").classList.contains("stage-locked") && bits() === "11111111---");
}
{
  SC.step(6000); const pl = bodyPlan(SC.w, SC.P), n0 = nFound() - 8, tEnd = SC.w.t;
  slide("C_t6", 30); slide("C_t10", 46); const same = SC.w.t === tEnd, pg = bodyPlan(SC.w, SC.P), g = !!FOUND.Cgoose;
  check("C opens on the mouse: " + pl.neck + " neck / " + pl.rib + " with ribs / " + pl.rear + " behind, limbs at vertebrae " + (pl.fore + 1) + " and " + (pl.hind + 1) + ", none of the animals (" + n0 + "); Hoxc6 at hour 30 and Hoxc10 at 46 relabel the finished body where it stands (" + same + "): " + pg.neck + " / " + pg.rib + " / " + pg.rear + ", the goose (" + g + ")",
        SC.w.done && pl.neck === 7 && pl.rib === 13 && pl.rear === 12 && pl.fore === 7 && pl.hind === 20 && n0 === 0 && same && g && !Gates.C.done);
  click("C_i1"); click("C_i2"); const re = SC.w.t === 0; slide("C_hp", 11); slide("C_t6", 8); slide("C_t10", 50);
  const tl = until(SC, "Clizard", 6000), pz = bodyPlan(SC.w, SC.P), endA = Gates.C.done && el("done-banner").classList.contains("shown"), b10 = bits();
  click("C_i1"); click("C_i2"); click("C_i3"); slide("C_t6", 0); slide("C_t10", 56);
  const ts = until(SC, "Csnake", 6000), ps = bodyPlan(SC.w, SC.P);
  check("C: the two small introns out (the body grows again: " + re + "), protein half-life 11, Hoxc6 at 8, Hoxc10 at 50: " + pz.neck + " / " + pz.rib + " / " + pz.rear + ", the lizard; two animals end the lesson (" + endA + ", bits " + b10 + "); then intron 3 out instead, Hoxc6 from the start, Hoxc10 at 56: " + ps.neck + " / " + ps.rib + " / " + ps.rear + ", no forelimb (" + (ps.fore < 0) + "), the snake, taken after the end (bits " + bits() + ")",
        re && tl != null && endA && b10 === "1111111111-" && ts != null && bits() === "11111111111" && ticks() === 11);
}

/* ================= the finds, off the engine: what meets each and what does not ================= */
{
  const A0 = { i1: 1, i2: 1, i3: 1, hm: 3, hp: 22, tl: 1, fb: 1 };
  /* stage A from its start at P0, changed to P1 at minute at: the minute each find's test is first met */
  const tryA = (P0, P1, at, total) => { Object.assign(SA.P, A0, P0); SA.S = cellNew(); const got = {};
    for (let t = 1; t <= total; t++) { if (P1 && t === at) { Object.assign(SA.P, P1); SA.changedHes(); } cellStep(SA.S, SA.P, 4); for (const f of FINDS.A) if (!(f.id in got) && f.test()) got[f.id] = t; }
    return got; };
  const show = g => Object.keys(g).map(k => k + " " + g[k]).join(", ") || "nothing";
  const open = [tryA({ tl: 0, fb: 0 }, null, 0, 2000), tryA({ fb: 0 }, null, 0, 2000), tryA({}, null, 0, 4000)];
  check("A, as it opens and as each part goes in, over 33 hours: " + open.map(show).join(" | ") + "; the mouse's gene pulses and is neither faster nor fading",
        !Object.keys(open[0]).length && !Object.keys(open[1]).length && Object.keys(open[2]).join() === "pulse" && open[2].pulse <= 620);
  const fast = [{ i1: 0 }, { i2: 0 }, { hm: 2 }, { hm: 1.5 }, { hp: 14 }, { hp: 11 }, { hp: 8 }].map(P => [P, tryA({}, P, 900, 2400)]);
  const slow = [{ hm: 4 }, { hm: 6 }, { hp: 25 }].map(P => [P, tryA({}, P, 900, 2400)]);
  check("A2 faster, a change made 15 hours in: " + fast.map(([P, g]) => JSON.stringify(P) + " at " + (g.faster == null ? "-" : g.faster - 900)).join(", ") + " min after; the other way, never: " + slow.map(([P, g]) => JSON.stringify(P) + " " + (g.faster == null ? "-" : g.faster)).join(", "),
        fast.every(([P, g]) => g.faster != null && g.faster - 900 <= 700 && !("fade" in g)) && slow.every(([P, g]) => !("faster" in g)));
  const fade = [{ i3: 0 }, { hp: 30 }, { hp: 35 }, { hp: 40 }].map(P => [P, tryA({}, P, 900, 4500)]), fromStart = tryA({ i3: 0 }, null, 0, 3000), keep = [{ i1: 0 }, { hp: 16 }, { hp: 25 }, { hm: 6 }].map(P => [P, tryA({}, P, 900, 4500)]);
  check("A3 pulses that die away: " + fade.map(([P, g]) => JSON.stringify(P) + " at " + (g.fade == null ? "-" : g.fade - 900)).join(", ") + " min after; intron 3 out from the start: " + show(fromStart) + " (no pulse credited to a cell whose pulses are dying); never at " + keep.map(([P]) => JSON.stringify(P)).join(", "),
        fade.every(([P, g]) => g.fade != null && g.fade - 900 <= 1500) && fromStart.fade != null && !("pulse" in fromStart) && keep.every(([P, g]) => !("fade" in g)));
  Object.assign(SA.P, A0); SA.restart();
}
{
  const B0 = { i1: 1, i2: 1, i3: 1, hm: 3, hp: 22, fb: 1, tl: 1, grow: 1, fgf: 1, slow: 1, hF: 400 };
  const tryB = (P0, P1, at, total) => { Object.assign(SB.P, B0, P0); SB.w = rowNew(SB.o); const got = {}; let t = 0;
    while (!SB.w.done && t < (total || 5000)) { t++; if (P1 && t === at) { Object.assign(SB.P, P1); if ("hF" in P1) SB.changedF(); else SB.changedHes(); }
      rowStep(SB.w, SB.P, 1); for (const f of FINDS.B) if (!(f.id in got) && f.test()) got[f.id] = t; }
    return got; };
  const show = g => Object.keys(g).map(k => k + " " + g[k]).join(", ") || "nothing", has = (g, ids) => Object.keys(g).sort().join() === ids.slice().sort().join();
  const base = tryB({}), ends = SB.w.t, noSlow = tryB({ slow: 0 }), noGrow = tryB({ grow: 0 }, null, 0, 2500), segsNoGrow = SB.w.st.segs, noFgf = tryB({ fgf: 0, slow: 0 }, null, 0, 2500);
  check("B with every part in, untouched: " + show(base) + " (over at minute " + ends + "); without Fgf8 speeding Hes7: " + show(noSlow) + "; without growth: " + show(noGrow) + " (" + segsNoGrow + " somites); without Fgf8: " + show(noFgf),
        has(base, ["four", "two"]) && has(noSlow, ["four"]) && !Object.keys(noGrow).length && !Object.keys(noFgf).length);
  const runs = [["small", { i1: 0 }], ["small", { i2: 0 }], ["small", { hp: 11 }], ["small", { hp: 8 }], ["zone", { hF: 450 }], ["zone", { hF: 500 }], ["zone", { hF: 800 }], ["block", { i3: 0 }], ["block", { hp: 30 }]];
  const start = runs.map(([id, P]) => [id, P, tryB(P)]), mid = runs.map(([id, P]) => [id, P, tryB({}, P, 400)]);
  const line = rs => rs.map(([id, P, g]) => JSON.stringify(P) + " " + id + " " + (g[id] == null ? "-" : g[id])).join(", ");
  check("B2, B4, B3 by one change, from the start: " + line(start), start.every(([id, P, g]) => g[id] != null));
  check("the same changes made 400 minutes into a growing row: " + line(mid) + "; a change to Fgf8's half-life is never credited as smaller somites", mid.every(([id, P, g]) => g[id] != null) && mid.concat(start).filter(([id]) => id === "zone").every(([id, P, g]) => !("small" in g)));
  const wrong = [{ hp: 25 }, { hF: 300 }, { hF: 200 }].map(P => [P, tryB(P), tryB({}, P, 400)]);
  check("a step the other way finds nothing new: " + wrong.map(([P, a, b]) => JSON.stringify(P) + " " + show(a) + " / mid-run " + show(b)).join("; "), wrong.every(([P, a, b]) => has(a, ["four", "two"]) && has(b, ["four", "two"])));
  Object.assign(SB.P, B0); SB.restart();
}
{
  const grow = P => { const Pf = Object.assign({}, MOUSE, P), w = rowNew(C_WORLD); rowStep(w, Pf, 100000); return { w, P: Pf, plan: bodyPlan(w, Pf) }; };
  const which = b => CARDS.filter(c => c.ok(b)).map(c => c.id).join("+") || "none", str = b => b.neck + "/" + b.rib + "/" + b.rear + (b.fore < 0 ? " no forelimb" : "") + (b.hind < 0 ? " no hindlimb" : "");
  /* the Hox hours relabel a grown body, so one growth serves every pair of hours */
  const relabel = (g, t6, t10) => bodyPlan(g.w, Object.assign({}, g.P, { t6, t10 }));
  const mouse = grow({}), own = CARDS.map(c => grow(c.P));
  cardsFinish();
  check("the animals: the mouse " + str(mouse.plan) + " is " + which(mouse.plan) + "; " + CARDS.map((c, i) => c.id + " " + str(own[i].plan) + " is " + which(own[i].plan)).join("; ") + "; each card is drawn from that same body",
        which(mouse.plan) === "none" && CARDS.every((c, i) => which(own[i].plan) === c.id && c.plan && str(c.plan) === str(own[i].plan)));
  const near = CARDS.map((c, i) => { let n = 0, tot = 0; for (const d6 of (c.Pfull.t6 === 0 ? [0] : [-2, 0, 2])) for (const d10 of [-2, 0, 2]) { const t6 = c.Pfull.t6 + d6; tot++; if (which(relabel(own[i], t6, c.Pfull.t10 + d10)) === c.id) n++; } return n + " of " + tot; });
  /* every pair of hours on the mouse's own Hes7: which animals a student reaches by the Hox genes alone */
  const hoxOnly = {}; for (let t6 = 0; t6 <= 64; t6 += 2) for (let t10 = t6; t10 <= 64; t10 += 2) { const k = which(relabel(mouse, t6, t10)); hoxOnly[k] = (hoxOnly[k] || 0) + 1; }
  /* and by Hes7 alone, the Hox hours left as the mouse's */
  const hesOnly = [{ i1: 0 }, { i1: 0, i2: 0 }, { i3: 0, hp: 11 }, { hp: 11 }, { hp: 6 }, { i1: 0, i2: 0, hp: 11 }, { i1: 0, i2: 0, i3: 0, hp: 8 }].map(P => { const g = grow(P); return JSON.stringify(P) + " " + g.plan.n + " vertebrae " + which(g.plan); });
  const snakeLate = relabel(own[2], 0.5, CARDS[2].Pfull.t10);
  check("each animal's window: two hours either way on each Hox gene (the snake's Hoxc6 is on from the start: at hour 0.5 a forelimb, " + (snakeLate.fore >= 0) + "), still that animal in " + near.join(", ") + " settings; the Hox genes alone on the mouse's Hes7 reach " + JSON.stringify(hoxOnly) + "; Hes7 alone: " + hesOnly.join("; "),
        near.join() === "9 of 9,9 of 9,3 of 3" && snakeLate.fore >= 0 && hoxOnly.goose > 0 && !hoxOnly.lizard && !hoxOnly.snake && !Object.keys(hoxOnly).some(k => k.indexOf("+") >= 0) && hesOnly.every(s => / none$/.test(s)));
}

/* ================= the clock ================= */
{
  SA.restart(); SA.vis = true; SA.paused = false; SA.fast = false; const t0 = SA.S.t; LAST_T = 0; loop(1000); loop(1050); const d1 = SA.S.t - t0;
  SA.paused = true; loop(1100); const d2 = SA.S.t - t0 - d1; SA.paused = false; SA.fast = true; loop(1150); const d3 = SA.S.t - t0 - d1; SA.fast = false;
  SB.restart(); SB.vis = true; LAST_T = 0; loop(2000); loop(2050); const dB = SB.w.t; SB.vis = false; loop(2100); const dB2 = SB.w.t - dB;
  check("the clock: 50 ms is " + d1 + " min of A's cell (40 a second), " + d2 + " when paused, " + d3 + " when fast; " + dB + " min of B's row (60 a second), " + dB2 + " when B is off the screen", Math.abs(d1 - 2) <= 0.25 && d2 === 0 && Math.abs(d3 - 6) <= 0.25 && dB === 3 && dB2 === 0);
}

/* ================= layout ================= */
{
  const infos = [...document.querySelectorAll(".info")], tipOf = e => e.dataset.tip ? document.getElementById(e.dataset.tip) : e.querySelector(".tip");
  const empty = infos.filter(e => !tipOf(e) || !tipOf(e).textContent.trim()).length;
  check("hover text: " + infos.length + " marks, " + empty + " empty", infos.length >= 14 && empty === 0);
  const over = fits(); check("every canvas fits its panel (" + window.innerWidth + " wide)", over.length === 0, over.join(", "));
  const lastOk = ["A", "B", "C"].every(K => { const els = document.querySelectorAll("#stage" + K + " .panel"), last = els[els.length - 1]; return last.matches("details.rcode") && !last.open; });
  check("layout: each stage's R code last and closed; no summary lines; no setup bullets", lastOk && document.querySelectorAll(".readout, .fit-stats, .status-line, ul.setup").length === 0);
}

/* ================= what the R panels should print ================= */
{
  Object.assign(SA.P, { i1: 1, i2: 1, i3: 1, hm: 3, hp: 22, tl: 1, fb: 1 }); SA.restart(); cellStep(SA.S, SA.P, 4 * 1200); refresh(SA);
  say("VA " + [SA.S.c.m, SA.S.c.p, cellSwing(SA.S, 300), cellPeriod(SA.S, 0)].join(" "));
  SB.restart(); rowStep(SB.w, SB.P, 100000); refresh(SB); say("VB " + [SB.w.st.segs, rowSize(SB.w)].join(" "));
  Object.assign(SC.P, MOUSE); SC.restart(); rowStep(SC.w, SC.P, 100000); refresh(SC); { const b = bodyPlan(SC.w, SC.P); say("VC " + [b.neck, b.rib, b.rear].join(" ")); }
}
say(bad ? ("FAILED " + bad) : "ALL BARS PASS");
say("RAN " + ran);
for (const K of ["A", "B", "C"]) say("R" + K + " " + RTEXT["code" + K].replace(/\\n/g, "\\\\n"));
L_.join(" ;; ");
`;

/* the narrow frame: no name, the instructor's reveal */
const INNER_NARROW = HEAD + `
const before = nFound();
window.__l24reveal();
const all = ["A", "B", "C"].every(K => Gates[K].open && Gates[K].done && !el("stage" + K).classList.contains("stage-locked") && el("solved" + K).classList.contains("shown"));
check("the instructor's reveal: every stage open and every find filled (" + before + " before, " + nFound() + " after, " + ticks() + " circles, bits " + bits() + ")", before === 0 && all && nFound() === 11 && ticks() === 11 && bits() === "11111111111");
const over = fits(); check("every canvas fits its panel (" + window.innerWidth + " wide)", over.length === 0, over.join(", "));
say(bad ? ("FAILED " + bad) : "ALL BARS PASS"); say("RAN " + ran);
L_.join(" ;; ");
`;
/* the third frame: "study mode" typed into the name box */
const INNER_STUDY = HEAD + `
const open = ["A", "B", "C"].every(K => Gates[K].open && !Gates[K].done && !el("stage" + K).classList.contains("stage-locked"));
check("study mode: every stage open, nothing filled (" + Score.isStudy() + ", " + nFound() + " found, " + ticks() + " circles)", Score.isStudy() && open && nFound() === 0 && ticks() === 0);
click("A_add"); click("A_add"); const t = until(SA, "Apulse", 800);
SC.step(6000); slide("C_t6", 30); slide("C_t10", 46);
check("study mode leaves the finds to find: the pulse after " + t + " min, the goose by its two Hox hours (" + !!FOUND.Cgoose + "), their circles filled (" + ticks() + ")", t != null && !!FOUND.Cgoose && ticks() === 2);
say(bad ? ("FAILED " + bad) : "ALL BARS PASS"); say("RAN " + ran);
L_.join(" ;; ");
`;

const URL = `http://127.0.0.1:${PORT}/app/lessons/lesson24.html?preview=1&still=1`;
const probe = `<!doctype html><meta charset="utf-8"><title>pending</title>
<iframe id="f" src="${URL}" width="1500" height="1000"></iframe>
<iframe id="g" src="${URL}" width="1000" height="900"></iframe>
<iframe id="h" src="${URL}" width="1300" height="900"></iframe>
<pre id="out"></pre><pre id="out2"></pre><pre id="out3"></pre>
<script>
const SRC = ${JSON.stringify(INNER)}, SRC2 = ${JSON.stringify(INNER_NARROW)}, SRC3 = ${JSON.stringify(INNER_STUDY)};
let n = 0;
const run = (id, src, out, name) => document.getElementById(id).addEventListener("load", () => setTimeout(() => {
  const w = document.getElementById(id).contentWindow, d = w.document;
  if (name) { const inp = d.getElementById("score-name-input"), btn = d.getElementById("score-name-confirm"); if (inp && btn) { inp.value = name; btn.click(); } }
  setTimeout(() => {
    let res;
    try { res = String(w.eval(src)); } catch (e) { res = "THREW " + e.message + " @ " + (e.stack||"").split("\\n").slice(1, 3).join(" | "); }
    document.getElementById(out).textContent = res;
    if (++n === 3) document.title = "done";
  }, 2500);
}, 1500));
run("f", SRC, "out"); run("g", SRC2, "out2"); run("h", SRC3, "out3", "study mode");
</script>`;
const probePath = path.join(ROOT, "_check_l24_" + PORT + ".html");
fs.writeFileSync(probePath, probe);
const server = spawn("python3", ["-m", "http.server", String(PORT), "--directory", ROOT], { stdio: "ignore", detached: true });
const cleanup = () => { try { process.kill(-server.pid); } catch (e) {} try { fs.unlinkSync(probePath); } catch (e) {} };
process.on("exit", cleanup);
setTimeout(() => {
  const r = spawnSync(CHROME, ["--headless=new", "--disable-gpu", "--virtual-time-budget=6000000", "--dump-dom", `http://127.0.0.1:${PORT}/_check_l24_${PORT}.html`], { encoding: "utf8", maxBuffer: 1 << 28 });
  const dec = s => s.replace(/&quot;/g, '"').replace(/&gt;/g, ">").replace(/&lt;/g, "<").replace(/&amp;/g, "&");
  const grab = id => { const m = new RegExp('<pre id="' + id + '">([\\s\\S]*?)</pre>').exec(r.stdout || ""); return m ? dec(m[1]) : null; };
  const text = grab("out");
  if (text == null) { console.error("no result -- is Chrome at " + CHROME + " ?"); cleanup(); process.exit(2); }
  let bad = false;
  const report = (label, t) => {
    if (!t) { console.log("FAIL " + label + " gave nothing"); bad = true; return []; }
    const lines = t.split(" ;; ");
    if (!/ALL BARS PASS/.test(t)) bad = true;
    for (const line of lines) if (!/^(R[ABC]|V[ABC]|RAN|ALL BARS) /.test(line) && !/^RAN \d+$/.test(line)) console.log(line);
    const reported = lines.filter(l => /^(ok|FAIL)\s/.test(l)).length, ranLine = /^RAN (\d+)$/.exec(lines.find(l => /^RAN \d+$/.test(l)) || "");
    if (!ranLine || +ranLine[1] !== reported) { console.log("FAIL harness (" + label + ")  " + (ranLine ? ranLine[1] : "?") + " checks ran, " + reported + " came back"); bad = true; }
    return lines;
  };
  const lines = report("the wide frame", text); report("the narrow frame", grab("out2")); report("the study-mode frame", grab("out3"));
  /* the R panels: run as the page wrote them, and held to what the page measured */
  const V = K => ((lines.find(l => l.startsWith("V" + K + " ")) || "").slice(3).split(" ").map(Number));
  const TOL = { A: [0.6, 15, 0.03, 1.5], B: [1, 0.3], C: [1, 1, 1] }, NAMES = { A: "mRNA, protein, swing, minutes between peaks", B: "somites, cells in each", C: "neck, with ribs, behind" };
  const probeR = spawnSync("Rscript", ["--version"], { encoding: "utf8" });
  if (probeR.error) console.log("skip R panels  (no Rscript)");
  else for (const K of ["A", "B", "C"]) {
    const src = (lines.find(l => l.startsWith("R" + K + " ")) || "").slice(3).replace(/\\n/g, "\n");
    const o = spawnSync("Rscript", ["-e", "options(width = 200)\n" + src + "\ncat('\\nOK\\n')"], { encoding: "utf8", timeout: 240000 }), ran = /OK/.test(o.stdout || "");
    const nums = ((o.stdout || "").split("\n").filter(l => /^[\s\d.eNA+-]+$/.test(l) && /\d/.test(l)).pop() || "").trim().split(/\s+/).map(Number), page = V(K);
    const ok = ran && nums.length === page.length && nums.every((x, i) => Math.abs(x - page[i]) <= TOL[K][i]);
    console.log((ok ? "ok   " : "FAIL ") + "the R panel of stage " + K + " runs and prints what the page measured (" + NAMES[K] + "): R " + nums.join(" ") + "; page " + page.map(x => Math.round(x * 100) / 100).join(" ") + (ran ? "" : "  -- " + (o.stderr || "").trim().split("\n").slice(-3).join(" ")));
    if (!ok) bad = true;
  }
  console.log(bad ? "FAILED" : "ALL PASS");
  cleanup(); process.exit(bad ? 1 : 0);
}, 700);
