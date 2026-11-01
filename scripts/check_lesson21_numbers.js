#!/usr/bin/env node
/*
 * check_lesson21_numbers.js -- the checks for app/lessons/lesson21.html.
 *
 * Lesson 21, draft 3 (2026-10-29, JM's review of draft 2): speciation by
 * sexual selection on his three-gene DAG, genes -> beak -> seeds ->
 * reproduction <- mating <- colour / preference <- genes. Two islands of
 * finches; seeds by island and preference strength, each a fitness
 * surface. A seeds and preference strength; B (2026-11-01) the cost of
 * brightness, the colour gene dragged along the beak gene's chromosome,
 * an inversion between them; C a learned song (two arrows from the
 * father's song, to his son's song and his daughter's preference, each on
 * or off); D three drawn rounds. (Draft 2's checks are this file at
 * b46e463; the first draft's at a887904.) What has to hold:
 *
 *   Engine. With no migration the islands never mix (F_ST 1 at all three
 *      genes); genes on separate chromosomes sort independently; on one
 *      chromosome a crossover parts the beak and colour genes as the
 *      distance says, and never inside the inversion in a bird with one
 *      inverted chromosome; a female who likes dull among bright males
 *      goes unmated as (1 - e^-s)^4 says; survivors' beaks from one-of-each
 *      parents on soft seeds as 1:2:1 times the survival rule says; their
 *      sons' colours as 1:2:1 times the cost of brightness; a son sings
 *      his father's song 98% of the time when sons learn, his song gene's
 *      when not; a daughter likes her father's song when daughters learn,
 *      her preference gene's when not.
 *   Rounds. Each target hit by its intended setting (and a neighbour of
 *      it), missed by its opening. The drawn rounds: the runs' own average
 *      inside its cloud, a flat line at 1 not, and no one flat line inside
 *      on all three.
 *   Flow. A miss records 0 and the round stays; a click on the seeds sets
 *      them; Next after a hit; A round 1's sentence; B's drag of the colour
 *      gene and its inversion box; C's arrows held and free, the genes'
 *      arrows following; D holds Go until a drawing, one drag sets all ten
 *      dots, Clear takes them away; twelve bits written; the lesson ends.
 *   Layout. Hover marks with words; every canvas fits (1500 and 1000
 *      wide); each stage's R code last and closed; the four R panels run
 *      (shortened to 3 generations).
 *
 * The page draws its seeds from the page label, so a run here is the run a
 * student with the same seed sees; each bar's margin is in the comment of
 * its round on the page.
 *
 * Usage:  node scripts/check_lesson21_numbers.js      (~1 minute)
 */
const { spawn, spawnSync } = require("child_process");
const fs = require("fs"), path = require("path");
const ROOT = path.resolve(__dirname, "..");
const PORT = +process.env.PORT || 8797;
const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const CANVAS_IDS = ["A_time", "A_surf", "A_tpic", "A_seeds", "B_time", "B_surf", "B_genes", "B_tpic", "B_seeds", "C_time", "C_surf", "C_tpic", "C_seeds", "D_time", "D_surf"];

const INNER = `
const L_=[], say=s=>L_.push(s);
let bad=0, ran=0;
const check=(name, ok, detail)=>{ ran++; if(!ok) bad++; say((ok?"ok   ":"FAIL ")+name+(detail?"  -- "+detail:"")); };
for (const k in Gates) { Gates[k].open = true; document.getElementById("stage" + k).classList.remove("stage-locked"); }
const BASE = { N: BW_N, m: 0.1, q: [0, 1], s: 0, c: 0, at: null, inv: 0, song: false, sing: 0, learn: 0 }, mk = P => Object.assign({}, BASE, P);
const grow = (P, seed, n) => { const w = bwWorld(mk(P), seed); for (let t = 0; t < n; t++) bwStep(w); return w; };

/* ================= the engine ================= */
{
  const w = grow({ m: 0, s: 2 }, 11, 50), s = bwStat(w);
  check("engine: with no migration the islands never mix (F_ST at the beak, colour and preference genes " + [s.fb, s.fc, s.fp].map(v => v.toFixed(3)).join(", ") + " at 50)", s.fb === 1 && s.fc === 1 && s.fp === 1);
  /* a bird with one of each allele at all three genes, in phase (0 0 0 from one parent, 1 1 1 from the other) */
  const parted = (P, arr, n) => { const w0 = bwWorld(mk(P), 5), b = { g: Int8Array.from([0, 0, 0, 1, 1, 1]), a: Int8Array.from(arr) }; let bc = 0, cp = 0, b1 = 0;
    for (let i = 0; i < n; i++) { const o = bwGamete(w0, b); if (o[0] !== o[1]) bc++; if (o[1] !== o[2]) cp++; b1 += o[0]; } return [bc / n, cp / n, b1 / n]; };
  const n = 40000, [bc, cp, b1] = parted({}, [0, 0], n);
  check("engine: genes on separate chromosomes sort independently (beak and colour parted " + bc.toFixed(3) + ", colour and preference " + cp.toFixed(3) + ", the large-beak allele passed on " + b1.toFixed(3) + "; each 1/2)",
        [bc, cp, b1].every(x => Math.abs(x - 0.5) < 0.01));
  /* B: the colour gene on the beak gene's chromosome */
  const near = parted({ at: 20 }, [0, 0], n)[0], far = parted({ at: 39 }, [0, 0], n)[0], invHet = parted({ at: 39, inv: 1 }, [0, 1], n)[0], invHom = parted({ at: 39, inv: 1 }, [1, 1], n)[0];
  check("engine: on one chromosome a crossover parts the beak and colour genes " + near.toFixed(3) + " beside (" + bwR(20).toFixed(3) + " set), " + far.toFixed(3) + " at locus 40 (" + bwR(39).toFixed(3) + "); the inversion: " + invHet.toFixed(3) + " with one inverted chromosome, " + invHom.toFixed(3) + " with two",
        Math.abs(near - bwR(20)) < 0.005 && Math.abs(far - bwR(39)) < 0.01 && invHet === 0 && Math.abs(invHom - bwR(39)) < 0.01);
  /* the mating probability: on the orange island every female likes dull; make every male bright */
  const out = [];
  for (const s0 of [1, 3, 6]) { let un = 0; const R = 40; for (let r = 0; r < R; r++) { const w2 = bwWorld(mk({ N: 200, m: 0, q: [0, 0], s: s0 }), 100 + r);
      for (const x of w2.isl[0]) if (x.sex === 1) { x.g[1] = 1; x.g[4] = 1; } bwStep(w2); un += w2.unm[0]; }
    out.push([s0, un / R, Math.pow(1 - Math.exp(-s0), 4)]); }
  check("engine: a female who likes dull among bright males goes unmated as (1 - e^-s)^4 says (" + out.map(([s0, got, want]) => "s " + s0 + ": " + got.toFixed(3) + " vs " + want.toFixed(3)).join("; ") + ")",
        out.every(([, got, want]) => Math.abs(got - want) < 0.02));
  /* survival: parents all one-of-each at the beak gene on soft seeds; the young that live, 1:2:1 times the chance to live */
  const live = [0, 1, 2].map(z => bwLive(0, z)), raw = [0.25, 0.5, 0.25].map((x, z) => x * live[z]), tot = raw.reduce((a, c) => a + c, 0), want = raw.map(x => x / tot), got = [0, 0, 0]; let nb = 0;
  for (let r = 0; r < 30; r++) { const w3 = bwWorld(mk({ N: 200, m: 0, q: [0, 0] }), 300 + r);
    for (const x of w3.isl[0]) { x.g[0] = 0; x.g[3] = 1; } bwStep(w3); for (const x of w3.isl[0]) { got[zB(x)]++; nb++; } }
  check("engine: on soft seeds the chance to live is " + live.map(v => v.toFixed(2)).join(", ") + " for ○ ◐ ●; young of one-of-each parents that live " + got.map(x => (x / nb).toFixed(3)).join(", ") + " vs " + want.map(x => x.toFixed(3)).join(", "),
        Math.abs(live[1] - 0.61) < 1e-9 && Math.abs(live[2] - 0.4) < 1e-9 && got.every((x, z) => Math.abs(x / nb - want[z]) < 0.015));
  /* the cost of brightness: small-beaked parents on soft seeds, all one-of-each at the colour gene, random mating; sons'
     colours 1:2:1 times 1 - c x colour, daughters' 1:2:1 */
  const c0 = 0.5, cl = [0, 1, 2].map(z => bwCostLive(c0, z)), rw = [0.25, 0.5, 0.25].map((x, z) => x * cl[z]), ct = rw.reduce((a, c) => a + c, 0), wantM = rw.map(x => x / ct), gm = [0, 0, 0], gf = [0, 0, 0];
  for (let r = 0; r < 30; r++) { const w4 = bwWorld(mk({ N: 200, m: 0, q: [0, 0], c: c0 }), 400 + r);
    for (const x of w4.isl[0]) { x.g[1] = 0; x.g[4] = 1; } bwStep(w4); for (const x of w4.isl[0]) (x.sex ? gm : gf)[zC(x)]++; }
  const sm = gm.reduce((a, c) => a + c, 0), sf = gf.reduce((a, c) => a + c, 0);
  check("engine: at cost of brightness " + c0 + " sons' colours (dull, in between, bright) " + gm.map(x => (x / sm).toFixed(3)).join(", ") + " vs " + wantM.map(x => x.toFixed(3)).join(", ") + "; daughters' " + gf.map(x => (x / sf).toFixed(3)).join(", ") + " vs .25, .5, .25",
        gm.every((x, z) => Math.abs(x / sm - wantM[z]) < 0.015) && gf.every((x, z) => Math.abs(x / sf - [0.25, 0.5, 0.25][z]) < 0.015));
  /* the song (C): every orange-island male sings the slow trill though his genes say fast; the young, with each arrow on or off */
  const sung = (sing, learn) => { let sl = 0, lk = 0, ns = 0, nd = 0; for (let r = 0; r < 10; r++) { const w6 = bwWorld(mk({ N: 200, m: 0, q: [0, 0], song: true, sing, learn }), 600 + r);
      for (const x of w6.isl[0]) if (x.sex === 1) x.sg = 1; bwStep(w6); for (const x of w6.isl[0]) { if (x.sex) { sl += x.sg; ns++; } else { lk += x.pl; nd++; } } } return [sl / ns, lk / nd]; };
  const [sOn, lOn] = sung(1, 1), [sOff, lOff] = sung(0, 0);
  check("engine: arrows on, a son sings his father's slow trill " + (100 * sOn).toFixed(1) + "% (98% set) and a daughter likes it " + (100 * lOn).toFixed(1) + "%; off, they follow their genes (" + sOff.toFixed(3) + ", " + lOff.toFixed(3) + ")",
        Math.abs(sOn - 0.98) < 0.01 && Math.abs(lOn - 0.98) < 0.01 && sOff === 0 && lOff === 0);
}

/* ================= the rounds ================= */
const STG = { A: SA, B: SB, C: SC, D: SD };
const setC = (S, o) => { for (const k in o) { const c = S.cfg.ctl.find(c => c.key === k), i = c.vals.indexOf(o[k]); if (i < 0) throw new Error("no " + k + " = " + o[k]); const el = document.getElementById(S.K + "_" + k); el.value = i + (+el.min || 0); } };
const play = (K, r, o) => { const S = STG[K]; S.round = r; S.done = false; S.waiting = false; S.run = null; const pr = document.getElementById(K + "_practice"); if (pr) pr.checked = true;
  openRound(S); for (const c of S.cfg.ctl) document.getElementById(K + "_" + c.key).dataset.held = ""; setC(S, o); goStage(S); finishNow(S); return S.last; };
const T = (K, r, good, badOnes) => { const S = STG[K], R = S.cfg.rounds[r];
  const res = (o, want) => { const q = play(K, r, o), e = sumAt(q, q.G), j = judge(R, e); return [o, j.ok === want, j.vals.join("/") + (K === "C" ? ", beak " + f2(e.fb) : "")]; };
  const g = good.map(o => res(o, true)), b = badOnes.map(o => res(o, false));
  check(K + (r + 1) + ": hit by " + g.map(x => JSON.stringify(x[0]).replace(/"/g, "") + " (" + x[2] + ")").join(", ") + "; missed by " + b.map(x => JSON.stringify(x[0]).replace(/"/g, "") + " (" + x[2] + ")").join(", "),
        g.every(x => x[1]) && b.every(x => x[1])); };
T("A", 0, [{ q0: 0, q1: 1 }, { q0: 0.25, q1: 0.75 }], [{ q0: 0, q1: 0 }, { q0: 0, q1: 0.5 }]);
T("A", 1, [{ s: 4 }, { s: 6 }], [{ s: 3 }, { s: 0 }]);
T("A", 2, [{ q0: 0, q1: 0 }, { q0: 1, q1: 1 }], [{ q0: 0, q1: 1 }]);
T("B", 0, [{ c: 0.75 }, { c: 1 }], [{ c: 0 }, { c: 0.5 }]);
T("B", 1, [{ at: 20 }, { at: 18 }], [{ at: 39 }, { at: 0 }]);
T("B", 2, [{ inv: 1 }], [{ inv: 0 }]);
T("B", 3, [{ c: 0.75 }, { c: 1 }], [{ c: 0.25 }, { c: 0.5 }, { c: 0.75, inv: 0 }]);
T("C", 0, [{ learn: 1 }], [{ learn: 0 }]);
T("C", 1, [{ sing: 1 }], [{ sing: 0 }]);
{
  /* the drawn rounds: the 16 runs' own average inside its cloud; a flat line at 1 ("they stay apart") outside; no flat line inside on all three */
  const flats = [0, 0.25, 0.5, 0.75], perRound = [];
  for (let r = 0; r < 3; r++) {
    /* the engine straight, not Go: a scored run here would spend the round's one bit */
    SD.round = r; const q = SD.cfg.start({}, 4242 + 97 * r); Object.assign(q, { t: 0, hist: [] }); snap(q); while (q.t < q.G) stepOnce(q);
    const avg = D_KNOTS.map(t => meanOf((q.hist.find(h => h.t === t)).runs.map(s => s.fb)));
    const own = insideOf(q, { ys: avg }, D_KNOTS, "fb"), top = insideOf(q, { ys: D_KNOTS.map(() => 1) }, D_KNOTS, "fb");
    perRound.push({ r, own, top, flat: flats.map(v => insideOf(q, { ys: D_KNOTS.map(() => v) }, D_KNOTS, "fb").k >= 5), avg: avg[avg.length - 1] });
  }
  check("D: each round's own average inside its cloud (" + perRound.map(p => p.own.k + "/" + p.own.n + " ending " + p.avg.toFixed(2)).join(", ") + "); a flat line at 1 inside nowhere (" + perRound.map(p => p.top.k).join(",") + ")",
        perRound.every(p => p.own.k === p.own.n && p.top.k === 0));
  const allThree = flats.filter((v, i) => perRound.every(p => p.flat[i]));
  check("D: no flat line among " + flats.join(", ") + " scores on all three rounds (" + (allThree.length ? allThree.join(",") + " does" : "none does") + ")", allThree.length === 0);
}

/* ================= the flow ================= */
{
  for (const S of [SA, SB, SC, SD]) { S.round = 0; S.done = false; S.waiting = false; S.results = []; S.last = null; S.pred = null; const pr = document.getElementById(S.K + "_practice"); if (pr) pr.checked = false; openRound(S); }
  Gates.A.done = Gates.B.done = Gates.C.done = Gates.D.done = false; paintAll();
  const go = S => { document.getElementById(S.K + "_go").click(); finishNow(S); }, next = S => document.getElementById(S.K + "_next").click();
  const held1 = document.getElementById("A_s").disabled, sentence = /Click the seeds/.test(document.getElementById("A_ttext").innerHTML);
  go(SA); const miss = Score.getBit("scaffold", BIT.A1) === 0 && !SA.waiting && SA.round === 0;
  /* the blue island's fourth seed: all four hard */
  const sc = document.getElementById("A_seeds"), sr = sc.getBoundingClientRect(), sk = sr.width / SDP.W;
  sc.dispatchEvent(new PointerEvent("pointerdown", { clientX: sr.left + seedX(1, 3) * sk, clientY: sr.top + SDP.y * sk, pointerId: 1, bubbles: true }));
  const clicked = readSet(SA).q1 === 1;
  go(SA); const hit = SA.waiting; next(SA);
  setC(SA, { s: 4 }); go(SA); next(SA);
  setC(SA, { q0: 0, q1: 0 }); go(SA); const doneA = Gates.A.done;
  check("flow: A round 1 holds preference strength (" + held1 + ") and says to click the seeds (" + sentence + "); a miss records 0 and the round stays (" + miss + "); a click sets the seeds (" + clicked + "); a hit opens Next (" + hit + "); three hits finish A (" + doneA + ")",
        held1 && sentence && miss && clicked && hit && doneA);
  const cls = (K, id) => (document.querySelector("#" + K + '_paths [data-of="' + id + '"]') || { classList: { contains: () => false } }).classList;
  const b1 = cls("B", "c").contains("settable") && document.getElementById("B_invBox").disabled;
  setC(SB, { c: 0.75 }); go(SB); next(SB);
  /* round 2: drag the colour gene to locus 21, beside the beak gene */
  const gc = document.getElementById("B_genes"), gr = gc.getBoundingClientRect(), gk = gr.width / BG.W;
  const gAt = i => ({ clientX: gr.left + B_x(i) * gk, clientY: gr.top + BG.y * gk, pointerId: 1, bubbles: true });
  gc.dispatchEvent(new PointerEvent("pointerdown", gAt(30))); gc.dispatchEvent(new PointerEvent("pointermove", gAt(20))); gc.dispatchEvent(new PointerEvent("pointerup", gAt(20)));
  const dragged = readSet(SB).at === 20, b2 = !cls("B", "c").contains("settable") && document.getElementById("B_invBox").disabled;
  go(SB); const hit2 = SB.waiting; next(SB);
  const b3 = !document.getElementById("B_invBox").disabled && readSet(SB).at === 39;
  document.getElementById("B_invBox").click(); const ticked = readSet(SB).inv === 1;
  go(SB); next(SB); setC(SB, { c: 0.75 }); go(SB);
  check("flow: B round 1 frees the cost and holds the inversion (" + b1 + "); round 2 holds the cost (" + b2 + "), a drag puts the colour gene at locus 21 (" + dragged + ") and hits (" + hit2 + "); round 3 opens the box with the gene at 40 (" + b3 + "), a click ticks it (" + ticked + "); four hits finish B (" + Gates.B.done + ")",
        b1 && b2 && dragged && hit2 && b3 && ticked && Gates.B.done);
  const c1 = cls("C", "sing").contains("locked") && cls("C", "learn").contains("settable") && cls("C", "learnG").contains("locked") && !cls("C", "learnG").contains("zero");
  const lg = document.getElementById("C_learn"); lg.value = 1; lg.dispatchEvent(new Event("input"));
  const follows = readSet(SC).learn === 1 && document.getElementById("C_learnG").value === "0" && cls("C", "learnG").contains("zero");
  go(SC); next(SC); const c2 = cls("C", "learn").contains("locked") && cls("C", "sing").contains("settable") && readSet(SC).sing === 0 && document.getElementById("C_singG").value === "1";
  setC(SC, { sing: 1 }); go(SC);
  check("flow: C round 1 holds the sons' arrow on and frees the daughters' (" + c1 + "); turned on, the preference gene's arrow goes off (" + follows + "); round 2 holds the daughters' and opens the sons' off, the song gene's on (" + c2 + ")", c1 && follows && c2);
  check("flow: two hits finish C (" + Gates.C.done + ")", Gates.C.done);
  /* D: Go held until a drawing; one drag sets every dot; Clear; drag again; Go; three rounds end the lesson */
  paintAll();
  const goHeld = document.getElementById("D_go").disabled;
  const cv = document.getElementById("D_time"), rect = cv.getBoundingClientRect(), k = rect.width / TM.W, tf = cv._tf;
  const at = (t, v) => ({ clientX: rect.left + tf.xs(t) * k, clientY: rect.top + tf.ys(v) * k, pointerId: 1, bubbles: true });
  const drag = v => { cv.dispatchEvent(new PointerEvent("pointerdown", at(1, v))); cv.dispatchEvent(new PointerEvent("pointermove", at(50, v))); cv.dispatchEvent(new PointerEvent("pointermove", at(100, v))); cv.dispatchEvent(new PointerEvent("pointerup", at(100, v))); };
  drag(0.25); const full = predFull(SD), free = !document.getElementById("D_go").disabled;
  document.getElementById("D_clear").click(); const cleared = !SD.pred && document.getElementById("D_go").disabled;
  drag(0.5); go(SD); next(SD); drag(0.74); go(SD); next(SD); drag(0); go(SD);
  const notes = [1, 2, 3].map(i => Score.getNote ? Score.getNote("D_in" + i) : null);
  check("flow: D holds Go for a drawing (" + goHeld + "); one drag sets all " + D_KNOTS.length + " dots (" + full + ") and frees Go (" + free + "); Clear takes it away (" + cleared + "); drawn at .5, .74, 0, scored " + notes.join(", "),
        goHeld && full && free && cleared && notes.every(x => /^\\d+of10$/.test(x || "")) && notes.every(x => +x.split("of")[0] >= 5));
  let n = 0; for (let i = 0; i < 12; i++) if (Score.isAnswered("scaffold", i)) n++;
  const bits = Object.keys(BIT).map(k => Score.getBit("scaffold", BIT[k])).join("");
  check("all 12 declared bits written (" + n + "; bits " + bits + "); the lesson ends", n === 12 && bits.startsWith("0") && Gates.D.done && document.getElementById("done-banner").classList.contains("shown"));
}
{
  const infos = [...document.querySelectorAll(".info")], tipOf = e => e.dataset.tip ? document.getElementById(e.dataset.tip) : e.querySelector(".tip");
  const empty = infos.filter(e => !tipOf(e) || !tipOf(e).textContent.trim()).length;
  check("hover text: " + infos.length + " marks, " + empty + " empty", infos.length >= 12 && empty === 0);
  FIT_EPOCH++; paintAll();
  const over = []; for (const id of ${JSON.stringify(CANVAS_IDS)}) { const cv = document.getElementById(id), host = cv.parentElement; if (+cv.dataset.drawW > host.clientWidth + 1) over.push(id + " " + cv.dataset.drawW + ">" + host.clientWidth); }
  check("every canvas fits its panel (" + window.innerWidth + " wide)", over.length === 0, over.join(", "));
  const lastOk = ["A", "B", "C", "D"].every(K => { const els = document.querySelectorAll("#stage" + K + " .panel"), last = els[els.length - 1]; return last.matches("details.rcode") && !last.open; });
  check("layout: each stage's R code last and closed; no readout lines", lastOk && document.querySelectorAll(".readout").length === 0);
}
for (const S of [SA, SB, SC, SD]) S.cfg.paint();
say(bad ? ("FAILED " + bad) : "ALL BARS PASS");
say("RAN " + ran);
for (const K of ["A", "B", "C", "D"]) say("R" + K + " " + RTEXT["code" + K].replace(/\\n/g, "\\\\n"));
say("RE " + rModel("C -- a learned song", { q: [0, 1], s: 2, song: true, sons: false, daughters: true }).map(l => l[1]).join("\\\\n"));
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
    console.log((ok ? "ok   " : "FAIL ") + "the R panel of stage " + (K === "E" ? "C (sons from their genes, daughters from their father)" : K) + " runs (3 generations)" + (ok ? "  -- " + (o.stdout || "").trim().split("\n").slice(-3, -1).join(" ").replace(/\s+/g, " ") : "  -- " + (o.stderr || "").slice(0, 300)));
    if (!ok) bad = true;
  }
  cleanup(); process.exit(bad ? 1 : 0);
}, 700);
