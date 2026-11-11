#!/usr/bin/env node
/*
 * check_lesson25_numbers.js -- the checks for app/lessons/lesson25.html.
 *
 * Lesson 25, draft 3 (2026-11-10): five named genes grow a limb, and
 * clades walk the limbs they can make. The limb grows as it is watched,
 * its parts go in one at a time, and a stage ends on a short list of
 * things to find, each noticed off the running model (a find writes its
 * bit 1; nothing writes a miss).
 * A a bud that stops itself (Fgf8, Bmp4, Grem1, Shh); B digits (Sox9,
 * joints, Bmp4 between the digits); C five animals, any four; D the map
 * (Shh x Bmp4 -> digits) and 16 clades walking it.
 * What has to hold:
 *
 *   Flow. The page as a student meets it, through its own buttons,
 *      sliders and map: the parts go in one at a time; nothing is found
 *      before the part that makes it is in; each find is met by its
 *      intended change; a stage's finds open the next; four animals open
 *      D and the fifth is still taken after; D's three finds end the
 *      lesson; 17 bits, each written once.
 *   Finds. Off the engine, with no side effects: the opening settings
 *      meet none of the finds that ask for a change; each is met by one
 *      change the right way, from the start and mid-run (hour 10), and
 *      not by a change the wrong way. B's at the intended settings on 12
 *      limb seeds as well as this page's.
 *   Animals. The human limb is none of them; each card's own setting is
 *      its own animal only, on 12 seeds; on every setting of the four
 *      sliders (13,770) no setting is two animals and each animal is met
 *      by a region (at least 130 settings, two values or more of every
 *      slider among them).
 *   Clades. Over 20 seeds: the founder in the middle of the five-digit
 *      patch gives twelve species and no change (D2) and never D1 or D3;
 *      a founder on an edge between counts gives D1; the human limb's
 *      cell (next to the cell-death rows) gives D3. 19 of 20 or better.
 *   Engine. A's length against its closed form; the map's columns are the
 *      limbs B and C grow at those levels.
 *   Printed numbers agree with the model they are read from.
 *   Modes. Study mode opens every stage and leaves the finds to find;
 *      the instructor reveal fills them.
 *   Layout. Hover marks; every canvas fits at two widths; R last and
 *      closed; the four R panels run and print what the page measured.
 *
 * The page is asked for with ?still=1: its clock stays stopped and this
 * script steps the models itself (headless Chrome spends a tenth of a
 * second on every animation frame).
 *
 * Usage:  node scripts/check_lesson25_numbers.js      (~3 minutes, most of it Chrome starting and the 13,770 limbs)
 */
const { spawn, spawnSync } = require("child_process");
const fs = require("fs"), path = require("path");
const ROOT = path.resolve(__dirname, "..");
const PORT = +process.env.PORT || 8795;
const CHROME = process.env.CHROME || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const CANVAS_IDS = ["A_bud", "B_limb", "C_limb", "C_cv0", "C_cv1", "C_cv2", "C_cv3", "C_cv4", "D_map", "D_limb", "D_tree", "D_clades"];

const HEAD = `
const L_=[], say=s=>L_.push(s);
let bad=0, ran=0;
const check=(name, ok, detail)=>{ ran++; if(!ok) bad++; say((ok?"ok   ":"FAIL ")+name+(detail?"  -- "+detail:"")); };
const el = id => document.getElementById(id), shown = e => getComputedStyle(e).display !== "none";
const click = id => el(id).click();
/* a slider is a ladder of levels: set it to a level, as a student's drag would */
const slide = (K, key, v) => { const e = el(K + "_" + key), i = LV[key].indexOf(v); if (i < 0) throw new Error("no level " + v + " for " + key); e.value = i; e.dispatchEvent(new Event("input", { bubbles: true })); e.dispatchEvent(new Event("change", { bubbles: true })); };
const bits = () => Object.keys(BIT).map(k => Score.isAnswered("scaffold", BIT[k]) ? String(Score.getBit("scaffold", BIT[k])) : "-").join("");
const nFound = () => Object.keys(FOUND).length, ticks = () => document.querySelectorAll("ul.tasks li.done").length;
const fits = () => { FIT_EPOCH++; paintAll(); const over = []; for (const id of ${JSON.stringify(CANVAS_IDS)}) { const cv = el(id), host = cv.parentElement, cs = getComputedStyle(host), room = host.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight); if (+cv.dataset.drawW > room + 1) over.push(id + " " + cv.dataset.drawW + ">" + Math.round(room)); } return over; };
/* a stage stepped as the page's clock steps it (a tenth of an hour, or one clade step) until a find is made: the hours (steps) it took */
const until = (S, key, max) => { let n = 0; while (n < max && !FOUND[key]) { S.step(1); n++; } return FOUND[key] ? (S.K === "D" ? n : Math.round(n) / 10) : null; };
/* a click on the map at a cell, as a student's */
const clickCell = (u, v) => { const cv = el("D_map"), r = cv.getBoundingClientRect(), k = r.width / 760; cv.dispatchEvent(new MouseEvent("click", { bubbles: true, clientX: r.left + cellX(u) * k, clientY: r.top + cellY(v) * k })); };
const U = sh => LV.sh.indexOf(sh), V = bm => LV.bm.indexOf(bm);
/* every gene to a setting: the first change to a stopped limb grows it again, the rest act on the growing one */
const setAll = (K, P) => { for (const k of ["f", "sh", "gr", "bm"]) if (P[k] !== SC.P[k] || K !== "C") slide(K, k, P[k]); };
const SEEDS = Array.from({ length: 12 }, (_, i) => 1000 + 7919 * (i + 1));
`;

const INNER = HEAD + `
/* ================= the page as it opens ================= */
check("the page opens locked, its clock stopped (?still=1)", ["A", "B", "C", "D"].every(K => el("stage" + K).classList.contains("stage-locked")) && STILL && !TICKING && nFound() === 0 && bits() === "-".repeat(17));
el("stageA").classList.remove("stage-locked"); Gates.A.open = true;

/* ================= flow: the page through its own controls ================= */
{
  const rows0 = ["A_p2", "A_p3", "A_p4"].every(id => !shown(el(id).closest(".part"))) && el("A_sh").disabled && el("A_gr").disabled && !el("A_f").disabled;
  SA.step(700); const run1 = SA.w.ran && SA.w.L >= 110, n1 = nFound(), h1 = SA.w.t;
  click("A_add"); const re1 = SA.w.t === 0 && SA.P.bmp === 1; SA.step(100); const L2 = SA.w.L, over2 = SA.w.over, n2 = nFound();
  click("A_add"); const re2 = SA.w.t === 0 && SA.P.grem === 1 && !el("A_gr").disabled && el("A_sh").disabled; SA.step(700); const run3 = SA.w.ran, n3 = nFound();
  click("A_add"); const re3 = SA.w.t === 0 && SA.P.shh === 1 && !el("A_sh").disabled && !shown(el("A_add"));
  const t1 = until(SA, "Astop", 600), L = SA.w.L, closed = reachG(SA.P) + 10 * Math.log(LB.G0 * SA.P.gr);
  check("A parts: Fgf8 alone runs past the picture (" + run1 + ", hour " + h1 + "); Bmp4 added, the bud never grows (" + L2 + " rows, " + over2 + "); Grem1 added, it runs off again (" + run3 + "); nothing found on the way (" + n1 + ", " + n2 + ", " + n3 + "); the held sliders wait for their parts (" + (rows0 && re2) + ")",
        rows0 && run1 && re1 && L2 === LB.L0 && over2 && re2 && run3 && re3 && n1 + n2 + n3 === 0);
  check("A1: Grem1 only where Shh reaches, and the bud stops itself at hour " + SA.w.tEnd + " (found " + t1 + " hours after the part went in), " + L.toFixed(2) + " rows (the closed form reach + 10 ln(7.39 x Grem1) = " + closed.toFixed(2) + "); bits " + bits(),
        t1 != null && Math.abs(L - closed) <= LB.v0 * LB.dt + 1e-9 && Math.abs(L - REF.L) < 1e-9 && SA.w.tEnd === REF.h && bits().startsWith("1---") && ticks() === 1);
  SA.paint(); const hint = el("A_longer_now").textContent, hint2 = el("A_sooner_now").textContent;
  check("A's printed numbers are the bud's (" + hint + " / " + hint2 + ")", hint === "now: " + L.toFixed(1) + " rows; at ×1, " + REF.L.toFixed(1) && hint2 === "now: hour " + SA.w.tEnd.toFixed(1) + "; at ×1, hour " + REF.h.toFixed(1));
  slide("A", "gr", 1.4); const re4 = SA.w.t === 0; const t2 = until(SA, "Alonger", 600), L4 = SA.w.L;
  slide("A", "gr", 0.7); const t3 = until(SA, "Ashorter", 600), L5 = SA.w.L;
  slide("A", "gr", 1); slide("A", "f", 1.2); const t4 = until(SA, "Asooner", 600), L6 = SA.w.L, h6 = SA.w.tEnd;
  check("A2-A4: a change to a stopped bud grows it again (" + re4 + "); Grem1 x1.4 stops at " + L4.toFixed(1) + " rows (found at hour " + t2 + "); Grem1 x0.7 at " + L5.toFixed(1) + " (hour " + t3 + "); Grem1 x1 and Fgf8 x1.2: " + L6.toFixed(1) + " rows at hour " + h6 + " (found then); A done and B open (" + Gates.A.done + ", " + Gates.B.open + ")",
        re4 && t2 != null && t3 != null && t4 != null && Gates.A.done && Gates.B.open && !el("stageB").classList.contains("stage-locked") && el("solvedA").classList.contains("shown") && bits().startsWith("1111-"));
}
{
  SB.step(400); const n0 = nFound() - 4, sk0 = limbStat(SB.w, SB.P);
  click("B_add"); const re = SB.w.t === 0 && SB.P.sox === 1; SB.step(400); const s1 = limbStat(SB.w, SB.P), n1 = nFound() - 4;
  slide("B", "sh", 1.6); const t1 = until(SB, "Bsix", 600), d1 = limbStat(SB.w, SB.P).kept;
  slide("B", "sh", 0.25); const t2 = until(SB, "Bfew", 600), d2 = limbStat(SB.w, SB.P).kept;
  slide("B", "sh", 1); SB.step(600); const m3 = nFound(); click("B_add"); SB.step(600); const s3 = limbStat(SB.w, SB.P), n3 = nFound() - m3;
  slide("B", "f", 0.7); const t5 = until(SB, "Bbones", 900), g5 = limbStat(SB.w, SB.P).segs;
  slide("B", "f", 1); SB.step(600); const held = el("B_bm").disabled, m4 = nFound(); click("B_add"); const freed = !el("B_bm").disabled; SB.step(600); const s4 = limbStat(SB.w, SB.P), n4 = nFound() - m4;
  const tEnd = SB.w.t; slide("B", "bm", 1.5); const at3 = SB.w.t === tEnd && !!FOUND.Bcarved, s5 = limbStat(SB.w, SB.P);
  slide("B", "bm", 0.8); const at4 = SB.w.t === tEnd && !!FOUND.Bweb, s6 = limbStat(SB.w, SB.P);
  check("B parts: the bud alone, nothing found (" + n0 + ", no digits: " + sk0.laid + "); Sox9 in, the limb grows again (" + re + "): " + s1.up + "-" + s1.fo + "-" + s1.laid + ", nothing found (" + n1 + "); joints in: " + s3.segs + " bones a digit, nothing found (" + n3 + "); Bmp4 between the digits held until its part (" + held + ", " + freed + "): a web " + s4.web + ", none lost, nothing found (" + n4 + ")",
        n0 === 0 && sk0.laid === 0 && re && s1.up === 1 && s1.fo === 2 && s1.laid === 5 && n1 === 0 && s3.segs === 4 && n3 === 0 && held && freed && s4.web === 0 && s4.lost === 0 && n4 === 0);
  check("B1-B5: Shh x1.6, " + d1 + " digits (hour " + t1 + "); Shh x0.25, " + d2 + " (hour " + t2 + "); Fgf8 x0.7, " + g5 + " bones a digit (hour " + t5 + "); on the stopped limb, Bmp4 x1.5 at once (" + at3 + "): " + s5.kept + " of " + s5.laid + " kept; Bmp4 x0.8 at once (" + at4 + "): a web " + s6.web.toFixed(2) + "; B done and C open (" + Gates.B.done + ", " + Gates.C.open + ")",
        t1 != null && d1 >= 6 && t2 != null && d2 <= 3 && t5 != null && g5 >= 6 && at3 && at4 && Gates.B.done && Gates.C.open && !el("stageC").classList.contains("stage-locked") && bits().startsWith("111111111-"));
}
{
  SC.step(600); const hs = limbStat(SC.w, SC.P), n0 = nFound() - 9;
  /* each animal from the human limb's settings, by the card's own setting (the cards' settings are printed) */
  const go = (i, max) => { setAll("C", Object.assign({}, HUMAN, CARDS[i].P)); return until(SC, "C" + CARDS[i].id, max); };
  slide("C", "gr", 2); const re = SC.w.t === 0; slide("C", "gr", 1);
  const th = go(1, 900), tk = go(0, 900), tc = go(2, 900), tb = go(3, 900), endC = Gates.C.done && Gates.D.open, b14 = bits(), ti = go(4, 1200);
  check("C opens on the human limb: " + hs.up + "-" + hs.fo + "-" + hs.kept + ", " + hs.segs + " bones a digit, " + hs.L.toFixed(1) + " rows, none of the animals (" + n0 + ", " + animalOf(hs) + "); the cards' settings " + CARDS.map(c => c.id + " " + JSON.stringify(c.P)).join(", ") + "; through its own sliders: the horse at hour " + th + ", the skink " + tk + ", the camel " + tc + ", the bat " + tb + " (a change to a stopped limb grows it again: " + re + "); four open D (" + endC + ", bits " + b14 + "); the ichthyosaur after, hour " + ti + " (bits " + bits() + ")",
        hs.kept === 5 && hs.lost === 0 && n0 === 0 && animalOf(hs) === "none" && re && th != null && tk != null && tc != null && tb != null && endC && b14 === "1111111111111----" && ti != null && bits() === "11111111111111---");
}
{
  const n0 = nFound(), noClade = !SD.cl && SD.over(), [hu, hv] = SD.cell; SD.step(50); const n1 = nFound() - n0;
  /* a clade is a chance history: where one misses (12 species are not reached in 400 steps, about 1 in 400), a student starts again */
  clickCell(U(1), V(0.4)); const at = SD.cell.join(); let s2 = until(SD, "Dstill", 400), tries = 1; while (s2 == null && tries < 3) { click("D_re"); tries++; s2 = until(SD, "Dstill", 400); }
  SD.step(400); const ch2 = SD.cl[0].changed, l2 = SD.cl[0].lostArose;
  clickCell(U(0.2), V(0.4)); const s1 = until(SD, "Dlineages", 400);
  clickCell(U(1), V(1)); const s3 = until(SD, "Dlost", 400), done = Gates.D.done && el("done-banner").classList.contains("shown");
  check("D opens with no clade (" + noClade + "), the human limb's cell outlined (Shh " + LV.sh[hu] + ", Bmp4 " + LV.bm[hv] + "), nothing found before a click (" + n1 + "); a click at Shh x1, Bmp4 x0.4 founds the clades there (" + at + "): twelve species and no change at step " + s2 + (tries > 1 ? " (start again " + (tries - 1) + " times)" : "") + ", and by step 400 still " + ch2 + " lineages changed, lost " + l2 + "; at Shh x0.2: four lineages changed by step " + s1 + "; at the human limb's cell: a digit lost, arising, at step " + s3 + "; the lesson done (" + done + ", bits " + bits() + ")",
        noClade && n1 === 0 && LV.sh[hu] === 1 && LV.bm[hv] === 1 && at === U(1) + "," + V(0.4) && s2 != null && ch2 === 0 && !l2 && s1 != null && s3 != null && done && bits() === "1".repeat(17) && ticks() === 17);
}

/* ================= the finds, off the engine: what meets each and what does not ================= */
const show = g => Object.keys(g).map(k => k + " " + g[k]).join(", ") || "nothing";
{
  const A0 = Object.assign({}, HUMAN, { sox: 0, joints: 0, carve: 0 });
  /* stage A from its start at P0, changed to P1 at hour 'at': the hour each find's test is first met (no side effects) */
  const tryA = (P0, P1, at) => { const keep = SA.w; Object.assign(SA.P, A0, P0); SA.w = limbNew(LIMB_SEED); const got = {};
    for (let i = 1; i <= 900 && !SA.w.over; i++) { if (P1 && i === at * 10) Object.assign(SA.P, P1); limbStep(SA.w, SA.P); for (const f of FINDS.A) if (!(f.id in got) && f.test()) got[f.id] = SA.w.t; }
    for (const f of FINDS.A) if (!(f.id in got) && f.test()) got[f.id] = SA.w.t; SA.w = keep; return got; };
  const open = [tryA({ bmp: 0, grem: 0, shh: 0 }), tryA({ grem: 0, shh: 0 }), tryA({ shh: 0 }), tryA({})];
  check("A, as it opens and as each part goes in: " + open.map(show).join(" | ") + "; every gene at x1 is only the stop", open.slice(0, 3).every(g => !Object.keys(g).length) && Object.keys(open[3]).join() === "stop");
  const right = [["longer", { gr: 1.4 }], ["longer", { gr: 2 }], ["longer", { gr: 4 }], ["longer", { sh: 1.2 }], ["longer", { sh: 1.4 }], ["longer", { sh: 2 }],
    ["shorter", { gr: 0.7 }], ["shorter", { gr: 0.5 }], ["shorter", { gr: 0.25 }], ["shorter", { sh: 0.8 }], ["shorter", { sh: 0.6 }], ["shorter", { sh: 0.3 }],
    ["sooner", { f: 1.2 }], ["sooner", { f: 1.4 }], ["sooner", { f: 2 }]];
  const line = rs => rs.map(([id, P, g]) => JSON.stringify(P) + " " + (g[id] == null ? "-" : "hour " + g[id])).join(", ");
  const start = right.map(([id, P]) => [id, P, tryA(P)]), mid = right.map(([id, P]) => [id, P, tryA({}, P, 10)]);
  check("A2-A4 by one change, from the start: " + line(start), start.every(([id, P, g]) => g[id] != null && Object.keys(g).length === 2));
  check("the same changes made at hour 10 of a growing bud: " + line(mid), mid.every(([id, P, g]) => g[id] != null && Object.keys(g).length === 2));
  /* what each change finds, and nothing besides: the wrong way, or a step too small to see (Shh x0.9 and x1.1 move the stop a row and a half) */
  const each = [[{ f: 0.85 }, "stop"], [{ f: 0.6 }, "stop"], [{ sh: 1.1 }, "stop"], [{ sh: 0.9 }, "stop"], [{ gr: 1.4 }, "longer,stop"], [{ gr: 0.7 }, "shorter,stop"], [{ sh: 1.2 }, "longer,stop"]].map(([P, want]) => [P, want, tryA(P), tryA({}, P, 10)]);
  check("what a change finds, from the start / at hour 10, and nothing else: " + each.map(([P, want, a, b]) => JSON.stringify(P) + " " + show(a) + " / " + show(b)).join("; "),
    each.every(([P, want, a, b]) => Object.keys(a).sort().join() === want && Object.keys(b).sort().join() === want));
}
{
  const B0 = Object.assign({}, HUMAN);
  /* stage B with every part (or as P0 sets them), from the start or changed at hour 10, run to its stop: what its finds see */
  const tryB = (P0, P1, at, seed) => { const keep = SB.w, kp = Object.assign({}, SB.P); Object.assign(SB.P, B0, P0); SB.w = limbNew(seed || LIMB_SEED);
    for (let i = 1; i <= 1200 && !SB.w.over; i++) { if (P1 && i === at * 10) Object.assign(SB.P, P1); limbStep(SB.w, SB.P); }
    const got = FINDS.B.filter(f => f.test()).map(f => f.id); SB.w = keep; Object.assign(SB.P, kp); return got.join(",") || "nothing"; };
  const base = tryB({}), parts = [tryB({ sox: 0 }), tryB({ joints: 0, f: 0.5 }), tryB({ carve: 0, bm: 0.2 }), tryB({ carve: 0, bm: 2 })];
  check("B with every part at x1: " + base + "; without Sox9: " + parts[0] + "; without joints, Fgf8 x0.5: " + parts[1] + "; without Bmp4 between the digits, at x0.2 and x2: " + parts[2] + " / " + parts[3],
    base === "nothing" && parts.every(g => g === "nothing"));
  const right = [["six", { sh: 1.6 }], ["six", { sh: 2 }], ["six", { sh: 3 }], ["few", { sh: 0.25 }], ["few", { sh: 0.2 }], ["carved", { bm: 1.5 }], ["carved", { bm: 2 }],
    ["web", { bm: 0.8 }], ["web", { bm: 0.2 }], ["bones", { f: 0.7 }], ["bones", { f: 0.5 }], ["bones", { gr: 4 }]];
  const start = right.map(([id, P]) => [id, P, tryB(P)]), mid = right.map(([id, P]) => [id, P, tryB({}, P, 10)]);
  const line = rs => rs.map(([id, P, g]) => JSON.stringify(P) + " " + g).join("; ");
  /* a change can meet a second find as well (Shh x3 lays more digits and grows a longer limb: more bones); never one of the others */
  const only = (id, g) => g.split(",").includes(id) && g.split(",").every(x => x === id || (id === "six" && x === "bones"));
  check("B1-B5 by one change, from the start: " + line(start), start.every(([id, P, g]) => only(id, g)));
  check("the same changes made at hour 10: " + line(mid), mid.every(([id, P, g]) => only(id, g)));
  /* (not Shh x0.5 or x0.6: the right way, and on 1 to 6 limb seeds in 100 already three digits) */
  const wrong = [{ sh: 0.8 }, { sh: 0.9 }, { sh: 1.1 }, { bm: 1.2 }, { f: 1.2 }, { gr: 2.8 }, { f: 0.85 }].map(P => [P, tryB(P), tryB({}, P, 10)]);
  check("a change the other way (or not far enough) finds nothing: " + wrong.map(([P, a, b]) => JSON.stringify(P) + " " + a + " / " + b).join("; "), wrong.every(([P, a, b]) => a === "nothing" && b === "nothing"));
  const seeds = right.map(([id, P]) => { let n = 0; for (const s of SEEDS) if (only(id, tryB(P, null, 0, s))) n++; return id + " " + JSON.stringify(P) + " " + n; });
  check("the intended changes on 12 other limb seeds (where the Sox9 pattern differs): " + seeds.join("; "), seeds.every(s => / 12$/.test(s)));
}
{
  /* the animals: the human, each card's own setting, and every setting of the four sliders */
  const grow = (P, seed) => { const Pf = Object.assign({}, HUMAN, P), w = limbGrow(Pf, seed || LIMB_SEED); return limbStat(w, Pf); };
  const human = grow({}), own = CARDS.map(c => [c, SEEDS.filter(s => animalOf(grow(c.P, s)) === c.id).length]);
  check("the human limb is " + animalOf(human) + "; each card's own setting on this page is that animal and no other on 12 other limb seeds too: " + own.map(([c, n]) => c.id + " " + n).join(", ") + "; each card is drawn from that limb (" + CARDS.every(c => animalOf(c.st) === c.id) + ")",
    animalOf(human) === "none" && own.every(([c, n]) => n >= 11) && CARDS.every(c => animalOf(c.st) === c.id && c.st.L === grow(c.P).L));
  const cnt = {}, vals = {}; let tot = 0, two = 0;
  for (const f of LV.f) for (const sh of LV.sh) for (const gr of LV.gr) { const P0 = Object.assign({}, HUMAN, { f, sh, gr }), w = limbGrow(P0, LIMB_SEED);
    for (const bm of LV.bm) { const s = limbStat(w, Object.assign({}, P0, { bm })), a = animalOf(s); tot++; if (a.indexOf("+") >= 0) two++;
      if (a !== "none" && a.indexOf("+") < 0) { cnt[a] = (cnt[a] || 0) + 1; const v = vals[a] = vals[a] || { f: {}, sh: {}, gr: {}, bm: {} }; v.f[f] = 1; v.sh[sh] = 1; v.gr[gr] = 1; v.bm[bm] = 1; } } }
  const spread = a => ["f", "sh", "gr", "bm"].map(k => Object.keys(vals[a][k]).length).join("/");
  check("every setting of the four sliders (" + tot + "): " + CARDS.map(c => c.id + " " + (cnt[c.id] || 0) + " (levels of Fgf8/Shh/Grem1/Bmp4 among them: " + (vals[c.id] ? spread(c.id) : "-") + ")").join(", ") + "; two animals at once: " + two,
    two === 0 && CARDS.every(c => cnt[c.id] >= 130 && ["f", "sh", "gr", "bm"].every(k => Object.keys(vals[c.id][k]).length >= 2)));
  const oneSlider = []; for (const k of ["f", "sh", "gr", "bm"]) for (const v of LV[k]) { const a = animalOf(grow({ [k]: v })); if (a !== "none") oneSlider.push(k + " " + v + " " + a); }
  say("note one slider moved from the human limb builds: " + (oneSlider.join(", ") || "nothing"));
}
{
  /* the map: each column is the limb B and C grow at that Shh level; the clades from three founders over 20 seeds */
  const m = getMap(), same = [0, U(1), U(2)].every(u => laidOf(limbGrow(Object.assign({}, HUMAN, { sh: LV.sh[u] }), LIMB_SEED)) === m.laid[u]);
  const kept = LV.bm.every((bm, v) => LV.sh.every((sh, u) => m.kept[v][u] === keptOf(m.laid[u], marginOf(bm))));
  check("the map's digits laid (" + m.laid.join(" ") + ") are the limbs B and C grow at those Shh levels (" + same + "), and each row is what Bmp4 between the digits leaves (" + kept + ")", same && kept);
  const keep = SD.cl, run = (u, v) => { let d1 = 0, d2 = 0, d3 = 0, t = { lineages: [], still: [], lost: [] };
    for (let s = 1; s <= 20; s++) { SD.cl = [cbWorld(m, u, v, 0, 50000 + 7919 * s)]; const got = {};
      while (SD.cl[0].t < CB.steps) { cbStep(SD.cl[0]); for (const f of FINDS.D) if (!got[f.id] && f.test()) { got[f.id] = 1; t[f.id].push(SD.cl[0].t); } }
      d1 += !!got.lineages; d2 += !!got.still; d3 += !!got.lost; }
    const med = a => a.length ? a.sort((x, y) => x - y)[a.length >> 1] : "-";
    return { d1, d2, d3, txt: "D1 " + d1 + ", D2 " + d2 + ", D3 " + d3 + " of 20 (median steps " + med(t.lineages) + " / " + med(t.still) + " / " + med(t.lost) + ")" }; };
  /* D1's founder: the first cell, from the left, whose right-hand neighbour keeps a different number of digits (webbed rows) */
  let e = 0; while (e + 1 < LV.sh.length && m.kept[V(0.4)][e] === m.kept[V(0.4)][e + 1]) e++;
  /* D2's second founder: the cell of the human's patch in Bmp4 x0.2's row farthest from a change in digits kept. Re-derived,
     not pasted: the limb seed is new on every load, and on 7 limb seeds in 24 the five-digit patch starts at Shh x0.8, so
     x0.9 sits next to its edge and 3 clades in 20 change (measured 2026-11-11) */
  const row = m.kept[V(0.2)], dist = u => { let d = 1; while (d < row.length && (u - d < 0 || row[u - d] === row[u]) && (u + d >= row.length || row[u + d] === row[u])) d++; return d; };
  let c = U(1); row.forEach((k, u) => { if (k === row[U(1)] && (dist(u) > dist(c) || (dist(u) === dist(c) && Math.abs(u - U(1)) < Math.abs(c - U(1))))) c = u; });
  const r2 = run(U(1), V(0.4)), r1 = run(e, V(0.4)), r3 = run(U(1), V(1)), r0 = run(c, V(0.2));
  SD.cl = keep;
  check("clades over 20 seeds: from Shh x1, Bmp4 x0.4 (the five-digit patch) " + r2.txt + "; from Shh x" + LV.sh[c] + ", x0.2 (" + dist(c) + " cells from a change) " + r0.txt + "; from Shh x" + LV.sh[e] + " (next to " + m.kept[V(0.4)][e + 1] + " digits), x0.4: " + r1.txt + "; from the human limb's cell " + r3.txt,
    r2.d2 >= 19 && r2.d1 === 0 && r2.d3 === 0 && r0.d2 >= 19 && r0.d1 === 0 && r1.d1 >= 19 && r3.d3 >= 19);
}

/* ================= the pictures draw what they print ================= */
{
  /* the bones the renderer draws, counted: one near the body, two after, then per digit the bones the label prints; no
     stray piece in the plate's first rows (where the count of Sox9 runs settles) */
  const drawn = (P) => { const Pf = Object.assign({}, HUMAN, P), w = limbGrow(Pf, LIMB_SEED), st = limbStat(w, Pf), b = bonesOf(w, Pf, marginOf(Pf.bm));
    const pl = b.filter(x => x.reg === 2), main = pl.filter(x => x.q === st.laid), live = main.filter(x => !x.dead), ranks = [...new Set(live.map(x => x.rank))];
    return { r0: b.filter(x => x.reg === 0).length, r1: b.filter(x => x.reg === 1).length, digits: ranks.length, per: ranks.map(r => live.filter(x => x.rank === r).length), dead: new Set(main.filter(x => x.dead).map(x => x.rank)).size, stray: pl.length - main.length, st }; };
  const cases = [["the human limb", {}]].concat(CARDS.map(c => [c.id, c.P])), res = cases.map(([nm, P]) => [nm, drawn(P)]);
  const txt = ([nm, d]) => nm + ": " + d.r0 + "-" + d.r1 + "-" + d.digits + " drawn, " + d.per.join("/") + " bones a digit, " + d.dead + " outlined as lost, " + d.stray + " stray (printed " + d.st.up + "-" + d.st.fo + "-" + d.st.kept + ", " + d.st.segs + " bones, " + d.st.lost + " lost)";
  check("what the limb's label prints is what it draws: " + res.map(txt).join("; "),
    res.every(([nm, d]) => d.r0 === d.st.up && d.r1 === d.st.fo && d.digits === d.st.kept && d.dead === d.st.lost && d.per.every(n => n === d.st.segs) && d.stray === 0));
}

/* ================= the clock ================= */
{
  SA.restart(); SA.vis = true; SA.paused = false; SA.fast = false; SB.vis = false; SC.vis = false; SD.vis = true; SD.start(U(1), V(0.4));
  const t0 = SA.w.t, d0 = SD.cl[0].t; LAST_T = 0; loop(1000); loop(1050); const a1 = SA.w.t - t0, dd = SD.cl[0].t - d0;
  SA.paused = true; loop(1100); const a2 = SA.w.t - t0 - a1; SA.paused = false; SA.fast = true; loop(1150); const a3 = SA.w.t - t0 - a1; SA.fast = false;
  const b0 = SB.w.t; loop(1200); const b1 = SB.w.t - b0;
  check("the clock: 50 ms is " + a1.toFixed(1) + " hours of A's bud (3 a second), " + a2.toFixed(1) + " when paused, " + a3.toFixed(1) + " when fast; " + dd + " steps of D's clades (40 a second); B off the screen moves " + b1, Math.abs(a1 - 0.1) < 1e-9 && a2 === 0 && Math.abs(a3 - 0.5) < 1e-9 && dd === 2 && b1 === 0);
}

/* ================= layout ================= */
{
  const infos = [...document.querySelectorAll(".info")], tipOf = e => e.dataset.tip ? document.getElementById(e.dataset.tip) : e.querySelector(".tip");
  const empty = infos.filter(e => !tipOf(e) || !tipOf(e).textContent.trim()).length;
  check("hover text: " + infos.length + " marks, " + empty + " empty", infos.length >= 20 && empty === 0);
  const over = fits(); check("every canvas fits its panel (" + window.innerWidth + " wide)", over.length === 0, over.join(", "));
  const lastOk = ["A", "B", "C", "D"].every(K => { const els = document.querySelectorAll("#stage" + K + " .panel"), last = els[els.length - 1]; return last.matches("details.rcode") && !last.open; });
  check("layout: each stage's R code last and closed; no summary lines; no setup bullets", lastOk && document.querySelectorAll(".readout, .fit-stats, .status-line, ul.setup").length === 0);
}

/* ================= what the R panels should print ================= */
{
  Object.assign(SA.P, HUMAN, { sox: 0, joints: 0, carve: 0 }); SA.restart(); SA.step(900); refresh(SA); say("VA " + [SA.w.L, SA.w.tEnd].join(" "));
  Object.assign(SB.P, HUMAN); SB.restart(); SB.step(900); refresh(SB); { const s = limbStat(SB.w, SB.P); say("VB " + [s.L, s.hours, s.up, s.fo, s.laid, s.kept, s.lost, s.segs, s.web].join(" ")); }
  Object.assign(SC.P, HUMAN, CARDS[1].P); SC.restart(); SC.step(900); refresh(SC); { const s = limbStat(SC.w, SC.P); say("VC " + [s.L, s.hours, s.up, s.fo, s.laid, s.kept, s.lost, s.segs, s.web].join(" ")); say("AC " + animalOf(s)); }
  SD.start(U(1), V(1)); refresh(SD); { const m = getMap(), [u, v] = SD.cell; let tot = 0; for (const r of m.kept) for (const x of r) tot += x; say("VD " + [m.kept[v][u], m.lost[v][u], tot].join(" ")); }
}
say(bad ? ("FAILED " + bad) : "ALL BARS PASS");
say("RAN " + ran);
for (const K of ["A", "B", "C", "D"]) say("R" + K + " " + RTEXT["code" + K].replace(/\\n/g, "\\\\n"));
L_.join(" ;; ");
`;

/* the narrow frame: no name, the instructor's reveal */
const INNER_NARROW = HEAD + `
const before = nFound();
window.__l25reveal();
const all = ["A", "B", "C", "D"].every(K => Gates[K].open && Gates[K].done && !el("stage" + K).classList.contains("stage-locked") && el("solved" + K).classList.contains("shown"));
check("the instructor's reveal: every stage open and every find filled (" + before + " before, " + nFound() + " after, " + ticks() + " circles, bits " + bits() + ")", before === 0 && all && nFound() === 17 && ticks() === 17 && bits() === "1".repeat(17));
SD.start(U(1), V(1)); SD.step(100);
const over = fits(); check("every canvas fits its panel (" + window.innerWidth + " wide)", over.length === 0, over.join(", "));
say(bad ? ("FAILED " + bad) : "ALL BARS PASS"); say("RAN " + ran);
L_.join(" ;; ");
`;
/* the third frame: "study mode" typed into the name box */
const INNER_STUDY = HEAD + `
const open = ["A", "B", "C", "D"].every(K => Gates[K].open && !Gates[K].done && !el("stage" + K).classList.contains("stage-locked"));
check("study mode: every stage open, nothing filled (" + Score.isStudy() + ", " + nFound() + " found, " + ticks() + " circles)", Score.isStudy() && open && nFound() === 0 && ticks() === 0);
click("A_add"); click("A_add"); click("A_add"); const t = until(SA, "Astop", 600);
slide("C", "gr", 2); slide("C", "bm", 2); const th = until(SC, "Chorse", 600);
check("study mode leaves the finds to find: the bud stops itself at hour " + t + ", the horse at hour " + th + ", their circles filled (" + ticks() + ")", t != null && th != null && ticks() === 2);
say(bad ? ("FAILED " + bad) : "ALL BARS PASS"); say("RAN " + ran);
L_.join(" ;; ");
`;

const URL = `http://127.0.0.1:${PORT}/app/lessons/lesson25.html?preview=1&still=1`;
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
const probePath = path.join(ROOT, "_check_l25_" + PORT + ".html");
fs.writeFileSync(probePath, probe);
const server = spawn("python3", ["-m", "http.server", String(PORT), "--directory", ROOT], { stdio: "ignore", detached: true });
const cleanup = () => { try { process.kill(-server.pid); } catch (e) {} try { fs.unlinkSync(probePath); } catch (e) {} };
process.on("exit", cleanup);
setTimeout(() => {
  const r = spawnSync(CHROME, ["--headless=new", "--disable-gpu", "--virtual-time-budget=6000000", "--dump-dom", `http://127.0.0.1:${PORT}/_check_l25_${PORT}.html`], { encoding: "utf8", maxBuffer: 1 << 28 });
  const dec = s => s.replace(/&quot;/g, '"').replace(/&gt;/g, ">").replace(/&lt;/g, "<").replace(/&amp;/g, "&");
  const grab = id => { const m = new RegExp('<pre id="' + id + '">([\\s\\S]*?)</pre>').exec(r.stdout || ""); return m ? dec(m[1]) : null; };
  const text = grab("out");
  if (text == null) { console.error("no result -- is Chrome at " + CHROME + " ?"); cleanup(); process.exit(2); }
  let bad = false;
  const report = (label, t) => {
    if (!t) { console.log("FAIL " + label + " gave nothing"); bad = true; return []; }
    const lines = t.split(" ;; ");
    if (!/ALL BARS PASS/.test(t)) bad = true;
    for (const line of lines) if (!/^(R[ABCD]|V[ABCD]|AC|RAN|ALL BARS) /.test(line) && !/^RAN \d+$/.test(line)) console.log(line);
    const reported = lines.filter(l => /^(ok|FAIL)\s/.test(l)).length, ranLine = /^RAN (\d+)$/.exec(lines.find(l => /^RAN \d+$/.test(l)) || "");
    if (!ranLine || +ranLine[1] !== reported) { console.log("FAIL harness (" + label + ")  " + (ranLine ? ranLine[1] : "?") + " checks ran, " + reported + " came back"); bad = true; }
    return lines;
  };
  const lines = report("the wide frame", text); report("the narrow frame", grab("out2")); report("the study-mode frame", grab("out3"));
  /* the R panels: run as the page wrote them, and held to what the page measured. R's random numbers are not the page's:
     the limbs are compared at settings where every seed lays the same digits (Shh x1), and D on its map's numbers */
  const V = K => ((lines.find(l => l.startsWith("V" + K + " ")) || "").slice(3).split(" ").map(Number));
  const TOL = { A: [0.01, 0.01], B: [0.01, 0.01, 0, 0, 0, 0, 0, 0, 0.01], C: [0.01, 0.01, 0, 0, 0, 0, 0, 0, 0.01], D: [0, 0, 0] };
  const NAMES = { A: "rows, hours", B: "rows, hours, upper, fore, digits laid, kept, lost, bones in a digit, web", C: "the same, at the horse's setting", D: "the founder's digits and lost, the map's total" };
  const probeR = spawnSync("Rscript", ["--version"], { encoding: "utf8" });
  if (probeR.error) console.log("skip R panels  (no Rscript)");
  else for (const K of ["A", "B", "C", "D"]) {
    const src = (lines.find(l => l.startsWith("R" + K + " ")) || "").slice(3).replace(/\\n/g, "\n");
    const t0 = Date.now(), o = spawnSync("Rscript", ["-e", "options(width = 250)\nset.seed(1)\n" + src + "\ncat('\\nOK\\n')"], { encoding: "utf8", timeout: 240000 }), ok0 = /OK/.test(o.stdout || "");
    const nums = ((o.stdout || "").split("\n").filter(l => /^[\s\d.eNA+-]+$/.test(l) && /\d/.test(l)).pop() || "").trim().split(/\s+/).map(Number), page = V(K);
    let ok = ok0 && nums.length === page.length && nums.every((x, i) => Math.abs(x - page[i]) <= TOL[K][i] + 1e-9);
    let extra = "";
    if (K === "C") { const m = /animal: (\w+)/.exec(o.stdout || ""), want = (lines.find(l => l.startsWith("AC ")) || "").slice(3); extra = "; animal: R " + (m ? m[1] : "?") + ", page " + want; ok = ok && m && m[1] === want; }
    console.log((ok ? "ok   " : "FAIL ") + "the R panel of stage " + K + " runs (" + ((Date.now() - t0) / 1000).toFixed(1) + " s) and prints what the page measured (" + NAMES[K] + "): R " + nums.join(" ") + "; page " + page.map(x => Math.round(x * 100) / 100).join(" ") + extra + (ok0 ? "" : "  -- " + (o.stderr || "").trim().split("\n").slice(-3).join(" ")));
    if (!ok) bad = true;
  }
  console.log(bad ? "FAILED" : "ALL PASS");
  cleanup(); process.exit(bad ? 1 : 0);
}, 700);
