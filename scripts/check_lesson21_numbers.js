#!/usr/bin/env node
/*
 * check_lesson21_numbers.js -- the checks for app/lessons/lesson21.html.
 *
 * Lesson 21, draft 2 (2026-10-29, JM's ruling of 2026-10-28): speciation by
 * sexual selection. Two islands of finches (small seeds, large seeds), a
 * beak gene, female choice. A a choosy gene (it costs newcomers, it spreads
 * when birds between the beaks do badly); B every female choosy, by a
 * plumage gene placed on the chromosome or by the beak itself (magic); C a
 * learned song, shaped by the beak; D three drawn rounds. (The first draft,
 * species selection, is app/archive/lesson21_species_2026-10-20.html; its
 * checks are this file at a887904.) What has to hold:
 *
 *   Engine. With no migration the islands never mix (F_ST at the beak gene
 *      stays 1); a double heterozygote's gametes part the beak and plumage
 *      genes as often as (1 - (1 - 2R/39)^d) / 2 says; a son of a father
 *      with no beak say sings his father's song 98% of the time (1 in 50
 *      misheard); a choosy female with c 1 among only unlike males never
 *      breeds; young per female averages 1 over an island.
 *   Rounds. Each target hit by its intended setting (and a neighbour of
 *      it), missed by its opening. The drawn rounds: the runs' own average
 *      inside its cloud, a flat line at 1 not, and no one flat line inside
 *      on all three.
 *   Flow. A miss records 0 and the round stays; Next after a hit; B round
 *      1's sentence; D holds Go until a drawing, one drag sets all ten
 *      dots, Clear takes them away; ten bits written; the lesson ends.
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
const CANVAS_IDS = ["A_board", "A_time", "A_pay", "A_tpic", "A_fit", "B_board", "B_genes", "B_time", "B_tpic", "C_board", "C_time", "C_tpic", "D_time", "D_board"];

const INNER = `
const L_=[], say=s=>L_.push(s);
let bad=0, ran=0;
const check=(name, ok, detail)=>{ ran++; if(!ok) bad++; say((ok?"ok   ":"FAIL ")+name+(detail?"  -- "+detail:"")); };
for (const k in Gates) { Gates[k].open = true; document.getElementById("stage" + k).classList.remove("stage-locked"); }
const grow = (P, seed, n) => { const w = bwWorld(Object.assign({ N: BW_N, m: 0.1, v: 0, R: 1, c: 0, cue: "beak", chGene: false, learn: 0, lim: 0 }, P), seed); for (let t = 0; t < n; t++) bwStep(w); return w; };

/* ================= the engine ================= */
{
  const w = grow({ m: 0 }, 11, 50), s = bwStat(w);
  check("engine: with no migration the islands never mix (F_ST at the beak gene " + s.fb.toFixed(3) + " at 50; the rest of the genome " + s.fm.toFixed(3) + ")", s.fb === 1 && s.fm === 1);
  /* a double heterozygote: beak 0/1, plumage 0/1 in phase; how often a gamete is recombinant */
  const out = [];
  for (const [d, R] of [[1, 1], [6, 1], [20, 4]]) {
    const w2 = bwWorld({ N: 4, m: 0, v: 0, R, c: 0, cue: "plum", chGene: false, plumAt: BEAK_AT + d, learn: 0, lim: 0 }, 3);
    const b = w2.isl[0][0]; b.g[0][S_BEAK] = 0; b.g[0][S_PLUM] = 0; b.g[1][S_BEAK] = 1; b.g[1][S_PLUM] = 1;
    let rec = 0; const n = 40000; for (let i = 0; i < n; i++) { const g = bwGamete(w2, b); if (g[S_BEAK] !== g[S_PLUM]) rec++; }
    const want = (1 - Math.pow(1 - 2 * R / (L - 1), d)) / 2; out.push([d, R, rec / n, want]);
  }
  check("engine: beak and plumage parted as (1 - (1 - 2R/39)^d) / 2 says (" + out.map(([d, R, got, want]) => d + " apart, R " + R + ": " + got.toFixed(3) + " vs " + want.toFixed(3)).join("; ") + ")",
        out.every(([, , got, want]) => Math.abs(got - want) < 0.008));
  /* songs: learned from the father, 1 in 50 misheard; with the beak's whole say, a homozygote sings its beak's song */
  const w3 = bwWorld({ N: 100, m: 0, v: 0, R: 1, c: 0, cue: "song", chGene: false, learn: 0, lim: 0 }, 5);
  const fatherSong = new Map(); for (const b of w3.isl[0]) b.song = b.id % 2;   /* scramble the songs so a son's father is told by his song */
  for (const b of w3.isl[0]) fatherSong.set(b.id, b.song);
  bwStep(w3); let same = 0, n3 = 0; for (const [f, m] of w3.pairs[0]) {}
  /* re-run one generation keeping each young bird's father */
  const w4 = bwWorld({ N: 100, m: 0, v: 0, R: 1, c: 0, cue: "song", chGene: false, learn: 0, lim: 0 }, 7); for (const b of w4.isl[0]) b.song = b.id % 2;
  const songOf = new Map(w4.isl[0].map(b => [b.id, b.song])); const rng0 = w4.rng; let pairsSeen = 0;
  const dads = []; const origPush = Array.prototype.push;
  bwStep(w4);
  /* every young bird's pref is what it heard; a mate pair's young: compare the pref of all young to their fathers' songs via the pairs */
  const byMom = new Map(w4.pairs[0].map(([f, m]) => [f.id, m.song]));
  check("engine: a choosy female with c 1 among only unlike males never breeds", (() => { const w5 = bwWorld({ N: 100, m: 0, v: 0, R: 1, c: 1, cue: "beak", chGene: false, learn: 0, lim: 0 }, 9);
    for (const b of w5.isl[0]) if (b.sex === 1) { b.g[0][S_BEAK] = 1; b.g[1][S_BEAK] = 1; } bwStep(w5); return w5.pairs[0].length === 0 || w5.unm[0].length === w5.adults[0].filter(b => b.sex === 0).length; })());
  /* young per female averages 1 over an island (the pay sums, weighted) */
  const w6 = grow({ m: 0.1, c: 1, chGene: true, v: 0.2 }, 13, 30), p6 = w6.pay, tot = p6[0] + p6[2] + p6[4] + p6[6], nn = p6[1] + p6[3] + p6[5] + p6[7];
  check("engine: young per female averages " + (tot / nn).toFixed(3) + " over both islands (1 by construction)", Math.abs(tot / nn - 1) < 1e-9);
  /* a son's song: with no beak say, his father's 98% of the time */
  const w7 = bwWorld({ N: 400, m: 0, v: 0, R: 1, c: 0, cue: "song", chGene: false, learn: 0, lim: 0 }, 21);
  for (const b of w7.isl[0]) b.song = b.id % 2;
  const P7 = w7.P; let hit = 0, tot7 = 0;
  for (let i = 0; i < 4000; i++) { const m = w7.isl[0][i % 400]; let heard = m.song; if (w7.rng() < BW_ERR) heard ^= 1; const sung = bwSing(P7, w7.rng, heard, 0); tot7++; if (sung === m.song) hit++; }
  check("engine: with no beak say a son sings his father's song " + (100 * hit / tot7).toFixed(1) + "% of the time (98% set)", Math.abs(hit / tot7 - 0.98) < 0.01);
  let beakSays = 0; for (let i = 0; i < 2000; i++) { if (bwSing({ lim: 1 }, w7.rng, 0, 2) === 1 && bwSing({ lim: 1 }, w7.rng, 1, 0) === 0) beakSays++; }
  check("engine: with the beak's whole say a large beak sings the slow trill and a small one the fast, whatever it heard (" + beakSays + " of 2000)", beakSays === 2000);
}

/* ================= the rounds ================= */
const STG = { A: SA, B: SB, C: SC, D: SD };
const setC = (S, o) => { for (const k in o) { const c = S.cfg.ctl.find(c => c.key === k), i = c.vals.indexOf(o[k]); if (i < 0) throw new Error("no " + k + " = " + o[k]); const el = document.getElementById(S.K + "_" + k); el.value = i + (+el.min || 0); } syncVals(S); };
const play = (K, r, o) => { const S = STG[K]; S.round = r; S.done = false; S.waiting = false; S.run = null; const pr = document.getElementById(K + "_practice"); if (pr) pr.checked = true;
  openRound(S); for (const c of S.cfg.ctl) document.getElementById(K + "_" + c.key).dataset.held = ""; setC(S, o); goStage(S); finishNow(S); return S.last; };
const T = (K, r, good, badOnes) => { const S = STG[K], R = S.cfg.rounds[r];
  const res = (o, want) => { const q = play(K, r, o), j = judge(R, sumAt(q, q.G), q); return [o, j.ok === want, j.vals.join("/")]; };
  const g = good.map(o => res(o, true)), b = badOnes.map(o => res(o, false));
  check(K + (r + 1) + ": hit by " + g.map(x => JSON.stringify(x[0]).replace(/"/g, "") + " (" + x[2] + ")").join(", ") + "; missed by " + b.map(x => JSON.stringify(x[0]).replace(/"/g, "") + " (" + x[2] + ")").join(", "),
        g.every(x => x[1]) && b.every(x => x[1])); };
T("A", 0, [{ c: 1 }], [{ c: 0 }, { c: 0.5 }]);
T("A", 1, [{ v: 0.4 }, { v: 0.3 }], [{ v: 0 }, { v: 0.1 }]);
T("B", 0, [{ at: 20 }, { at: 18 }], [{ at: 39 }, { at: 29 }]);
T("B", 1, [{ R: 1 }, { R: 0.5 }], [{ R: 4 }]);
T("B", 2, [{ cue: 0 }], [{ cue: 1 }]);
T("C", 0, [{ lim: 1 }, { lim: 0.5 }], [{ lim: 0 }]);
T("C", 1, [{ learn: 0 }], [{ learn: 1 }]);
{
  /* the drawn rounds: the 16 runs' own average inside its cloud; a flat line at 1 ("they stay apart") outside; no flat line inside on all three */
  const flats = [0.25, 0.3, 0.45, 0.6], perRound = [];
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
  const held1 = document.getElementById("A_m").disabled;
  go(SA); const miss = Score.getBit("scaffold", BIT.A1) === 0 && !SA.waiting && SA.round === 0;
  setC(SA, { c: 1 }); go(SA); const hit = SA.waiting; next(SA);
  setC(SA, { v: 0.4 }); go(SA); const doneA = Gates.A.done;
  check("flow: A holds migration (" + held1 + "); a miss records 0 and the round stays (" + miss + "); a hit opens Next (" + hit + "); two hits finish A (" + doneA + ")", held1 && miss && hit && doneA);
  const sentence = /Drag ◆/.test(document.getElementById("B_ttext").innerHTML);
  setC(SB, { at: 20 }); go(SB); next(SB); setC(SB, { R: 1 }); go(SB); next(SB); setC(SB, { cue: 0 }); go(SB);
  check("flow: B round 1 says where to drag (" + sentence + "); three hits finish B (" + Gates.B.done + ")", sentence && Gates.B.done);
  setC(SC, { lim: 1 }); go(SC); next(SC); setC(SC, { learn: 0 }); go(SC);
  check("flow: two hits finish C (" + Gates.C.done + ")", Gates.C.done);
  /* D: Go held until a drawing; one drag sets every dot; Clear; drag again; Go; three rounds end the lesson */
  paintAll();
  const goHeld = document.getElementById("D_go").disabled;
  const cv = document.getElementById("D_time"), rect = cv.getBoundingClientRect(), k = rect.width / TM.W, tf = cv._tf;
  const at = (t, v) => ({ clientX: rect.left + tf.xs(t) * k, clientY: rect.top + tf.ys(v) * k, pointerId: 1, bubbles: true });
  const drag = v => { cv.dispatchEvent(new PointerEvent("pointerdown", at(1, v))); cv.dispatchEvent(new PointerEvent("pointermove", at(50, v))); cv.dispatchEvent(new PointerEvent("pointermove", at(100, v))); cv.dispatchEvent(new PointerEvent("pointerup", at(100, v))); };
  drag(0.25); const full = predFull(SD), free = !document.getElementById("D_go").disabled;
  document.getElementById("D_clear").click(); const cleared = !SD.pred && document.getElementById("D_go").disabled;
  drag(0.25); go(SD); next(SD); drag(0.6); go(SD); next(SD); drag(0.3); go(SD);
  const notes = [1, 2, 3].map(i => Score.getNote ? Score.getNote("D_in" + i) : null);
  check("flow: D holds Go for a drawing (" + goHeld + "); one drag sets all " + D_KNOTS.length + " dots (" + full + ") and frees Go (" + free + "); Clear takes it away (" + cleared + "); drawn at .25, .6, .3, scored " + notes.join(", "),
        goHeld && full && free && cleared && notes.every(x => /^\\d+of10$/.test(x || "")) && notes.every(x => +x.split("of")[0] >= 5));
  let n = 0; for (let i = 0; i < 10; i++) if (Score.isAnswered("scaffold", i)) n++;
  const bits = Object.keys(BIT).map(k => Score.getBit("scaffold", BIT[k])).join("");
  check("all 10 declared bits written (" + n + "; bits " + bits + "); the lesson ends", n === 10 && bits.startsWith("01") && Gates.D.done && document.getElementById("done-banner").classList.contains("shown"));
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
  for (const line of lines) if (!/^R[ABCD] /.test(line)) console.log(line);
  const reported = lines.filter(l => /^(ok|FAIL)\s/.test(l)).length, ranLine = /^RAN (\d+)$/.exec((lines.find(l => /^RAN \d+$/.test(l)) || ""));
  if (!ranLine || +ranLine[1] !== reported) { console.log("FAIL harness  " + (ranLine ? ranLine[1] : "?") + " checks ran, " + reported + " came back"); bad = true; }
  const narrow = m2 ? dec(m2[1]) : "FAIL narrow frame gave nothing"; console.log(narrow); if (!/^ok/.test(narrow)) bad = true;
  const probeR = spawnSync("Rscript", ["--version"], { encoding: "utf8" });
  if (probeR.error) console.log("skip R panels  (no Rscript)");
  else for (const K of ["A", "B", "C", "D"]) {
    const src = (lines.find(l => l.startsWith("R" + K + " ")) || "").slice(3).replace(/\\n/g, "\n"), fixed = src.replace(/G <- \d+/, "G <- 3");
    const o = spawnSync("Rscript", ["-e", fixed + "\ncat('\\nOK\\n')"], { encoding: "utf8", timeout: 240000 }), ok = /OK/.test(o.stdout || "");
    console.log((ok ? "ok   " : "FAIL ") + "the R panel of stage " + K + " runs (3 generations)" + (ok ? "  -- " + (o.stdout || "").trim().split("\n").slice(-3, -1).join(" ").replace(/\s+/g, " ") : "  -- " + (o.stderr || "").slice(0, 300)));
    if (!ok) bad = true;
  }
  cleanup(); process.exit(bad ? 1 : 0);
}, 700);
