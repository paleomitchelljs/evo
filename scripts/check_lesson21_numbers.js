#!/usr/bin/env node
/*
 * check_lesson21_numbers.js -- the checks for app/lessons/lesson21.html.
 *
 * Lesson 21, draft 4 (2026-11-07, JM: "purely illustrating sexual
 * selection & its consequences, with a single starting activity showing
 * how divergence in sexually selected traits may make speciation
 * easier"). A: draft 3's two islands, beak, colour and preference genes,
 * seeds and preference strength. B-E: one island of 500. B the cost and
 * the pay; C the liking as a gene and a cost of choosiness; D a colour
 * dulled by harmful mutations; E colour in females too, and a gene that
 * switches it off in them. (Draft 3's checks are this file at 2368016.)
 * What has to hold:
 *
 *   Engine (A). With no migration the islands never mix; the three genes
 *      sort independently; a female who likes dull among bright males goes
 *      unmated as (1 - e^-s)^4 says; survivors' beaks from one-of-each
 *      parents on soft seeds as 1:2:1 times the survival rule says.
 *   Engine (one island). Colour genes sort as Mendel says; a female who
 *      likes bright mates a bright male, among half bright and half dull,
 *      with chance 1 / (1 + e^-s); the cost of choosiness keeps cp x a of
 *      choosy females from breeding; a bright male lives 1 - c, a female
 *      1 (in E 1 - c x how much of her colour shows); harmful mutations
 *      pass and cut survival as the binomial and Poisson say; the change
 *      taken apart adds up exactly to the change in the mean; in C at no
 *      cost the liking gains in males, not females.
 *   Rounds. Each target hit by its intended setting (and a neighbour of
 *      it), missed by its opening.
 *   Flow. A miss records 0 and the round stays; a click on the seeds sets
 *      them; Next after a hit; held and free arrows each round; E's two
 *      boxes; eleven bits written; the lesson ends.
 *   Layout. Hover marks with words; every canvas fits (1500 and 1000
 *      wide); each stage's R code last and closed; the five R panels run
 *      (shortened to 3 generations).
 *
 * The page draws its seeds from the page label, so a run here is the run a
 * student with the same seed sees; each bar's margin is in the comment of
 * its round on the page.
 *
 * Usage:  node scripts/check_lesson21_numbers.js      (~2 minutes)
 */
const { spawn, spawnSync } = require("child_process");
const fs = require("fs"), path = require("path");
const ROOT = path.resolve(__dirname, "..");
const PORT = +process.env.PORT || 8797;
const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const CANVAS_IDS = ["A_time", "A_surf", "A_tpic", "A_seeds", "B_time", "B_split", "B_surf", "B_tpic", "C_time", "C_split", "C_surf", "C_tpic",
  "D_time", "D_split", "D_surf", "D_tpic", "E_time", "E_surf", "E_tpic"];

const INNER = `
const L_=[], say=s=>L_.push(s);
let bad=0, ran=0;
const check=(name, ok, detail)=>{ ran++; if(!ok) bad++; say((ok?"ok   ":"FAIL ")+name+(detail?"  -- "+detail:"")); };
for (const k in Gates) { Gates[k].open = true; document.getElementById("stage" + k).classList.remove("stage-locked"); }
const BASE = { N: BW_N, m: 0.1, q: [0, 1], s: 0 }, mk = P => Object.assign({}, BASE, P);
const grow = (P, seed, n) => { const w = bwWorld(mk(P), seed); for (let t = 0; t < n; t++) bwStep(w); return w; };
const ONEP = P => Object.assign({ s: 0, c: 0, pref: 0, cp: 0, U: 0, g: 0, both: 0, mod: 0 }, P);

/* ================= stage A's engine ================= */
{
  const w = grow({ m: 0, s: 2 }, 11, 50), s = bwStat(w);
  check("engine A: with no migration the islands never mix (F_ST at the beak, colour and preference genes " + [s.fb, s.fc, s.fp].map(v => v.toFixed(3)).join(", ") + " at 50)", s.fb === 1 && s.fc === 1 && s.fp === 1);
  const w0 = bwWorld(mk({}), 5), b = { g: Int8Array.from([0, 0, 0, 1, 1, 1]) }; let bc = 0, cp = 0, b1 = 0; const n = 40000;
  for (let i = 0; i < n; i++) { const o = bwGamete(w0, b); if (o[0] !== o[1]) bc++; if (o[1] !== o[2]) cp++; b1 += o[0]; }
  check("engine A: the three genes sort independently (beak and colour parted " + (bc / n).toFixed(3) + ", colour and preference " + (cp / n).toFixed(3) + ", the large-beak allele passed on " + (b1 / n).toFixed(3) + "; each 1/2)",
        [bc / n, cp / n, b1 / n].every(x => Math.abs(x - 0.5) < 0.01));
  const out = [];
  for (const s0 of [1, 3, 6]) { let un = 0; const R = 40; for (let r = 0; r < R; r++) { const w2 = bwWorld(mk({ N: 200, m: 0, q: [0, 0], s: s0 }), 100 + r);
      for (const x of w2.isl[0]) if (x.sex === 1) { x.g[1] = 1; x.g[4] = 1; } bwStep(w2); un += w2.unm[0]; }
    out.push([s0, un / R, Math.pow(1 - Math.exp(-s0), 4)]); }
  check("engine A: a female who likes dull among bright males goes unmated as (1 - e^-s)^4 says (" + out.map(([s0, got, want]) => "s " + s0 + ": " + got.toFixed(3) + " vs " + want.toFixed(3)).join("; ") + ")",
        out.every(([, got, want]) => Math.abs(got - want) < 0.02));
  const live = [0, 1, 2].map(z => bwLive(0, z)), raw = [0.25, 0.5, 0.25].map((x, z) => x * live[z]), tot = raw.reduce((a, c) => a + c, 0), want = raw.map(x => x / tot), got = [0, 0, 0]; let nb = 0;
  for (let r = 0; r < 30; r++) { const w3 = bwWorld(mk({ N: 200, m: 0, q: [0, 0] }), 300 + r);
    for (const x of w3.isl[0]) { x.g[0] = 0; x.g[3] = 1; } bwStep(w3); for (const x of w3.isl[0]) { got[zB(x)]++; nb++; } }
  check("engine A: on soft seeds the chance to live is " + live.map(v => v.toFixed(2)).join(", ") + " for ○ ◐ ●; young of one-of-each parents that live " + got.map(x => (x / nb).toFixed(3)).join(", ") + " vs " + want.map(x => x.toFixed(3)).join(", "),
        Math.abs(live[1] - 0.61) < 1e-9 && Math.abs(live[2] - 0.4) < 1e-9 && got.every((x, z) => Math.abs(x / nb - want[z]) < 0.015));
}
/* ================= the one-island engine ================= */
{
  /* Mendel: every bird one of each at both colour genes, random mating, no cost: the young's bright alleles (0-4) ~ Binomial(4, 1/2) */
  const cnt = [0, 0, 0, 0, 0]; let nn = 0;
  for (let r = 0; r < 6; r++) { const w = oneWorld(ONEP({}), 900 + r); for (const b of w.B) b.col.set([0, 0, 1, 1]); oneStep(w); for (const b of w.B) { cnt[Math.round(4 * oZ(b))]++; nn++; } }
  const bin = [1, 4, 6, 4, 1].map(x => x / 16);
  check("engine 1: colour genes sort as Mendel says (young with 0-4 bright alleles " + cnt.map(x => (x / nn).toFixed(3)).join(", ") + " vs " + bin.map(x => x.toFixed(3)).join(", ") + ")",
        cnt.every((x, i) => Math.abs(x / nn - bin[i]) < 0.015));
  /* mating: half the males all bright, half all dull; every female likes bright */
  const share = s => { let b = 0, d = 0; for (let r = 0; r < 20; r++) { const w = oneWorld(ONEP({ s }), 1000 + r); let i = 0;
      for (const x of w.B) if (x.sex) x.col.set(i++ % 2 ? [1, 1, 1, 1] : [0, 0, 0, 0]); oneStep(w); b += w.cc[4 + 10]; d += w.cc[0 + 10]; } return b / (b + d); };
  const ms = [1, 3].map(s => [s, share(s), 1 / (1 + Math.exp(-s))]);
  check("engine 1: among half bright, half dull males a female who likes bright takes a bright one as 1 / (1 + e^-s) says (" + ms.map(([s, got, want]) => "s " + s + ": " + got.toFixed(3) + " vs " + want.toFixed(3)).join("; ") + ")",
        ms.every(([, got, want]) => Math.abs(got - want) < 0.015));
  /* the cost of choosiness: every female two liking-bright alleles, then one */
  const unm = (pg, cp) => { let u = 0; for (let r = 0; r < 20; r++) { const w = oneWorld(ONEP({ pref: 1, cp, s: 2 }), 1100 + r); for (const x of w.B) x.pg.set(pg); oneStep(w); u += w.unm; } return u / 20; };
  const u1 = unm([1, 1], 0.2), u2 = unm([0, 1], 0.2);
  check("engine 1: at cost of choosiness 0.2 a female with two liking-bright alleles fails to breed " + u1.toFixed(3) + " (0.2), with one " + u2.toFixed(3) + " (0.1)", Math.abs(u1 - 0.2) < 0.015 && Math.abs(u2 - 0.1) < 0.012);
  /* the cost of brightness: every bird all bright; c 0.5: males live 1/2, females 1; E: colour in females, every bird one off allele in two, so 1/4 none, 1/2 one, 1/4 two: a daughter lives .5/4 + .75/2 + 1/4 = .75 */
  const surv = P => { let lv = 0, dl = 0; for (let r = 0; r < 20; r++) { const w = oneWorld(ONEP(P), 1200 + r); for (const x of w.B) { x.col.set([1, 1, 1, 1]); if (P.mod) x.md.set([0, 1]); } oneStep(w); lv += w.lived; dl += w.dl; } return [lv / 20, dl / 20]; };
  const [lv1, dl1] = surv({ c: 0.5 }), [, dl2] = surv({ c: 0.5, both: 1, mod: 1 });
  check("engine 1: all bright at cost 0.5: young that live " + lv1.toFixed(3) + " (3/4: sons 1/2, daughters " + dl1.toFixed(3) + "); colour in females too, one off allele in two: daughters " + dl2.toFixed(3) + " (0.75)",
        Math.abs(lv1 - 0.75) < 0.012 && Math.abs(dl1 - 1) < 1e-9 && Math.abs(dl2 - 0.75) < 0.015);
  /* harmful mutations: every bird 10, U .5, no colour: the young's survival E[.95^h] = .975^20 e^-.025, their mean h tilted 20(.95)/1.95 + .5(.95) */
  { let lv = 0, hs = 0, n = 0; for (let r = 0; r < 20; r++) { const w = oneWorld(ONEP({ U: 0.5 }), 1300 + r); for (const x of w.B) { x.h = 10; x.col.fill(0); } oneStep(w); lv += w.lived; for (const b of w.B) { hs += b.h; n++; } }
    const wantL = Math.pow(0.975, 20) * Math.exp(-0.025), wantH = 20 * 0.95 / 1.95 + 0.5 * 0.95;
    check("engine 1: harmful mutations: parents with 10 each, 0.5 new: young that live " + (lv / 20).toFixed(3) + " vs " + wantL.toFixed(3) + ", their mutations " + (hs / n).toFixed(2) + " vs " + wantH.toFixed(2),
          Math.abs(lv / 20 - wantL) < 0.01 && Math.abs(hs / n - wantH) < 0.08); }
  /* the change taken apart adds up exactly, and the menus' mean is the split's */
  { const w = oneWorld(ONEP({ s: 6, c: 0.25, pref: 1, cp: 0.1, U: 0.5, g: 2 }), 77); let worst = 0, mis = 0;
    for (let t = 0; t < 20; t++) { const z0 = oneStat(w); oneStep(w); const z1 = oneStat(w);
      for (const k of ["z", "g"]) { const L = w.last[k], sum = L.parts.reduce((a, c) => a + c, 0); worst = Math.max(worst, Math.abs(sum - (L.after - L.before))); mis = Math.max(mis, Math.abs(L.before - z0[k]), Math.abs(L.after - z1[k])); } }
    check("engine 1: who mates (females, males) + what the young keep + who lives = the change in the mean, each generation (worst " + worst.toExponential(1) + "), the mean the menus show (" + mis.toExponential(1) + ")", worst < 1e-12 && mis < 1e-12); }
}
/* ================= the rounds ================= */
const STG = { A: SA, B: SB, C: SC, D: SDd, E: SE };
const setC = (S, o) => { for (const k in o) { const c = S.cfg.ctl.find(c => c.key === k), i = c.vals.indexOf(o[k]); if (i < 0) throw new Error("no " + k + " = " + o[k]); const el = document.getElementById(S.K + "_" + k); el.value = i + (+el.min || 0); el.dispatchEvent(new Event("input")); } };
const play = (K, r, o) => { const S = STG[K]; S.round = r; S.done = false; S.waiting = false; S.run = null; const pr = document.getElementById(K + "_practice"); if (pr) pr.checked = true;
  openRound(S); for (const c of S.cfg.ctl) document.getElementById(K + "_" + c.key).dataset.held = ""; setC(S, o); goStage(S); finishNow(S); return S.last; };
const T = (K, r, good, badOnes) => { const S = STG[K], R = S.cfg.rounds[r];
  const res = (o, want) => { const q = play(K, r, o), e = sumAt(q, q.G), j = judge(R, e); return [o, j.ok === want, j.vals.join("/")]; };
  const g = good.map(o => res(o, true)), b = badOnes.map(o => res(o, false));
  check(K + (r + 1) + ": hit by " + g.map(x => JSON.stringify(x[0]).replace(/"/g, "") + " (" + x[2] + ")").join(", ") + "; missed by " + b.map(x => JSON.stringify(x[0]).replace(/"/g, "") + " (" + x[2] + ")").join(", "),
        g.every(x => x[1]) && b.every(x => x[1])); };
T("A", 0, [{ q0: 0, q1: 1 }, { q0: 0.25, q1: 0.75 }], [{ q0: 0, q1: 0 }, { q0: 0, q1: 0.5 }]);
T("A", 1, [{ s: 4 }, { s: 6 }], [{ s: 3 }, { s: 0 }]);
T("A", 2, [{ q0: 0, q1: 0 }, { q0: 1, q1: 1 }], [{ q0: 0, q1: 1 }]);
T("B", 0, [{ s: 1 }, { s: 2 }], [{ s: 0 }]);
T("B", 1, [{ c: 0.75 }, { c: 1 }], [{ c: 0.5 }, { c: 0.25 }]);
T("C", 0, [{ k: 0 }], [{ k: 0.1 }, { k: 0.2 }]);
T("C", 1, [{ k: 0.1 }, { k: 0.2 }], [{ k: 0 }]);
T("D", 0, [{ g: 1 }, { g: 2 }], [{ g: 0 }]);
T("D", 1, [{ u: 0.5 }, { u: 1 }], [{ u: 0.25 }, { u: 0 }]);
T("E", 0, [{ both: 1 }], [{ both: 0 }]);
T("E", 1, [{ c: 0.25 }, { c: 0.5 }], [{ c: 0 }]);
{ /* C at no cost: the liking-bright allele's change summed over 100 generations sits in males' matings, not females' */
  const q = play("C", 0, { k: 0 }), e = sumAt(q, q.G);
  check("C: at no cost of choosiness the liking-bright allele's change, summed, is in males' matings " + f2(e.sg[1]) + " (+.1 or more), females' " + f2(e.sg[0]) + ", survival " + f2(e.sg[3]),
        e.sg[1] >= 0.1 && e.sg[0] > -0.06 && e.sg[3] < 0.01); }
/* ================= the flow ================= */
{
  for (const S of STAGES) { S.round = 0; S.done = false; S.waiting = false; S.results = []; S.last = null; const pr = document.getElementById(S.K + "_practice"); if (pr) pr.checked = false; openRound(S); }
  for (const k in Gates) Gates[k].done = false; paintAll();
  const go = S => { document.getElementById(S.K + "_go").click(); finishNow(S); }, next = S => document.getElementById(S.K + "_next").click();
  const cls = (K, id) => (document.querySelector("#" + K + '_paths [data-of="' + id + '"]') || { classList: { contains: () => false } }).classList;
  const held1 = document.getElementById("A_s").disabled, sentence = /Click the seeds/.test(document.getElementById("A_ttext").innerHTML);
  const zero1 = cls("A", "cm").contains("zero") && cls("A", "s").contains("zero");
  go(SA); const miss = Score.getBit("scaffold", BIT.A1) === 0 && !SA.waiting && SA.round === 0;
  const sc = document.getElementById("A_seeds"), sr = sc.getBoundingClientRect(), sk = sr.width / SDP.W;
  sc.dispatchEvent(new PointerEvent("pointerdown", { clientX: sr.left + seedX(1, 3) * sk, clientY: sr.top + SDP.y * sk, pointerId: 1, bubbles: true }));
  const clicked = readSet(SA).q1 === 1;
  go(SA); const hit = SA.waiting; next(SA);
  const follow2 = !cls("A", "cm").contains("zero") && cls("A", "cm").contains("locked") && cls("A", "s").contains("settable") && readSet(SA).s === 3;
  setC(SA, { s: 4 }); go(SA); next(SA);
  setC(SA, { q0: 0, q1: 0 }); go(SA); const doneA = Gates.A.done;
  check("flow: A round 1 holds preference strength (" + held1 + ") and says to click the seeds (" + sentence + "); a miss records 0 and the round stays (" + miss + "); a click sets the seeds (" + clicked + "); a hit opens Next (" + hit + "); three hits finish A (" + doneA + ")",
        held1 && sentence && miss && clicked && hit && doneA);
  check("flow: A's diagram: at strength 0 colour -> mating and the preference's arrow onto it are dashed (" + zero1 + "); round 2 opens the strength at 3, colour -> mating following, pale (" + follow2 + ")", zero1 && follow2);
  const b1 = cls("B", "s").contains("settable") && cls("B", "c").contains("locked") && readSet(SB).c === 0.5 && readSet(SB).s === 0;
  setC(SB, { s: 1 }); go(SB); const hitB = SB.waiting; next(SB);
  const b2 = cls("B", "c").contains("settable") && cls("B", "s").contains("locked") && readSet(SB).s === 2 && readSet(SB).c === 0.5;
  setC(SB, { c: 0.75 }); go(SB);
  check("flow: B round 1 frees the strength, holds the cost at 0.5 (" + b1 + "); strength 1 hits (" + hitB + "); round 2 frees the cost at 0.5, holds the strength at 2 (" + b2 + "); two hits finish B (" + Gates.B.done + ")", b1 && hitB && b2 && Gates.B.done);
  const c1 = cls("C", "k").contains("settable") && cls("C", "s").contains("locked") && cls("C", "c").contains("locked") && readSet(SC).k === 0.1;
  setC(SC, { k: 0 }); go(SC); next(SC); const c2 = readSet(SC).k === 0 && cls("C", "k").contains("settable");
  setC(SC, { k: 0.1 }); go(SC);
  check("flow: C opens the cost of choosiness at 0.1, the rest held (" + c1 + "); round 2 opens it at 0 (" + c2 + "); two hits finish C (" + Gates.C.done + ")", c1 && c2 && Gates.C.done);
  const d1 = cls("D", "g").contains("settable") && cls("D", "u").contains("locked") && cls("D", "k").contains("locked") && readSet(SDd).g === 0 && readSet(SDd).u === 0.5;
  setC(SDd, { g: 1 }); go(SDd); next(SDd); const d2 = cls("D", "u").contains("settable") && cls("D", "g").contains("locked") && readSet(SDd).g === 2 && readSet(SDd).u === 0.25;
  setC(SDd, { u: 0.5 }); go(SDd);
  check("flow: D round 1 frees the dulling at 0, new mutations held at 0.5 (" + d1 + "); round 2 frees the new mutations at 0.25, dulling held at 2 (" + d2 + "); two hits finish D (" + Gates.D.done + ")", d1 && d2 && Gates.D.done);
  paintAll();
  const bb = document.getElementById("E_bothBox"), mb = document.getElementById("E_modBox");
  const noFemCost = !document.querySelector('#E_paths [data-of="cfc"]');
  const e1 = !bb.disabled && !bb.checked && mb.disabled && !mb.checked && cls("E", "fx").contains("zero") && !cls("E", "c").contains("settable") && noFemCost;
  bb.click(); const ticked = readSet(SE).both === 1 && !cls("E", "fx").contains("zero") && !!document.querySelector('#E_paths [data-of="cfc"]');
  go(SE); const hitE = SE.waiting; next(SE);
  const e2 = bb.disabled && bb.checked && mb.disabled && mb.checked && cls("E", "c").contains("settable") && readSet(SE).c === 0;
  setC(SE, { c: 0.25 }); go(SE);
  check("flow: E round 1: the colour-in-females box free and off, the off gene's box held off, the cost held, no females' cost arrow (" + e1 + "); ticked, the arrow turns on and the females' cost appears (" + ticked + ") and hits (" + hitE + "); round 2 holds both boxes on and frees the cost at 0 (" + e2 + "); two hits finish E (" + Gates.E.done + ")",
        e1 && ticked && hitE && e2 && Gates.E.done);
  let n = 0; for (let i = 0; i < 11; i++) if (Score.isAnswered("scaffold", i)) n++;
  const bits = Object.keys(BIT).map(k => Score.getBit("scaffold", BIT[k])).join("");
  check("all 11 declared bits written (" + n + "; bits " + bits + "); the lesson ends", n === 11 && bits.startsWith("0") && Gates.E.done && document.getElementById("done-banner").classList.contains("shown"));
}
{
  const infos = [...document.querySelectorAll(".info")], tipOf = e => e.dataset.tip ? document.getElementById(e.dataset.tip) : e.querySelector(".tip");
  const empty = infos.filter(e => !tipOf(e) || !tipOf(e).textContent.trim()).length;
  check("hover text: " + infos.length + " marks, " + empty + " empty", infos.length >= 15 && empty === 0);
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
<iframe id="f" src="http://127.0.0.1:${PORT}/app/lessons/lesson21.html?preview=1" width="1500" height="1000"></iframe>
<iframe id="g" src="http://127.0.0.1:${PORT}/app/lessons/lesson21.html?preview=1" width="1000" height="900"></iframe>
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
const probePath = path.join(ROOT, "_check_l21_" + PORT + ".html");
fs.writeFileSync(probePath, probe);
const server = spawn("python3", ["-m", "http.server", String(PORT), "--directory", ROOT], { stdio: "ignore", detached: true });
const cleanup = () => { try { process.kill(-server.pid); } catch (e) {} try { fs.unlinkSync(probePath); } catch (e) {} };
process.on("exit", cleanup);
setTimeout(() => {
  const r = spawnSync(CHROME, ["--headless=new", "--disable-gpu", "--virtual-time-budget=6000000", "--dump-dom", `http://127.0.0.1:${PORT}/_check_l21_${PORT}.html`], { encoding: "utf8", maxBuffer: 1 << 28 });
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
