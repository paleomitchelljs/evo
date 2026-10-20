#!/usr/bin/env node
/*
 * check_lesson20_numbers.js -- the checks for app/lessons/lesson20.html.
 *
 * Lesson 20, first draft (2026-10-20, JM's brief for 19-21): phylogeny. One
 * population keeps splitting; the alleles at eight loci traced back through
 * the run's own parent links; every pair's F_ST, hybrids and sizes against
 * the generations since they parted; nine steps (four targets, five
 * questions). What has to hold:
 *
 *   Engine. No split with chance 0, never more than six populations; a split
 *      halves the fish (two disjoint halves that cover the parent); every
 *      link points at the parent chromosome that really carries the allele
 *      (checked against saved generations, no mutation); two lineages from
 *      populations that parted at g meet only before g; a fish's size is 20
 *      plus its alleles' effects; with no mutation every hybrid lives.
 *   Steps. Each target's intended setting hits it in most single trees and
 *      its opening in few (tree by tree, so counted over several trees);
 *      the questions' answers are judged as the tree says.
 *   Flow. A miss records 0 and the step stays; questions answered by clicks
 *      on the tree's letters; the size trees hide sizes until the pick; the
 *      ninth step ends the lesson; all nine bits written.
 *   Layout. The R code last and closed; the Anolis box closed at load; hover
 *      marks with words; every canvas fits (1500 and 1000 wide); the R panel
 *      runs (shortened).
 *
 * Usage:  node scripts/check_lesson20_numbers.js      (~2 minutes)
 */
const { spawn, spawnSync } = require("child_process");
const fs = require("fs"), path = require("path");
const ROOT = path.resolve(__dirname, "..");
const PORT = +process.env.PORT || 8798;
const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const CANVAS_IDS = ["A_tree", "A_pairs", "A_size", "A_anolis"];

const INNER = `
const L_=[], say=s=>L_.push(s);
let bad=0, ran=0;
const check=(name, ok, detail)=>{ ran++; if(!ok) bad++; say((ok?"ok   ":"FAIL ")+name+(detail?"  -- "+detail:"")); };
document.getElementById("stageA").classList.remove("stage-locked"); Gates.A.open = true;
const setC = o => { for (const k in o) { const c = CTL.find(c => c.key === k), i = c.vals.indexOf(o[k]); if (i < 0) throw new Error("no " + k + " = " + o[k]); document.getElementById("A_" + k).value = i; } syncVals(); };
const grow = (P, seed) => { const w = trWorld(P, seed); while (w.t < G) trStep(w); return w; };

/* ================= the engine ================= */
{
  const w0 = grow({ N: 10, b: 0, mu: 0.001 }, 3), w1 = grow({ N: 10, b: 0.03, mu: 0.001 }, 3);
  check("engine: chance 0, one population all run (" + w0.alive.length + "); chance 0.03, six and no more (" + w1.alive.length + ", " + w1.pops.length + " in all)", w0.alive.length === 1 && w1.alive.length === 6 && w1.pops.length === 11);
  const halves = w1.pops.filter(p => p.map).reduce((m, p) => { (m[p.parent] = m[p.parent] || []).push([...p.map]); return m; }, {});
  const okH = Object.values(halves).every(([a, b]) => { const all = a.concat(b).sort((x, y) => x - y); return a.length === 5 && b.length === 5 && all.every((v, i) => v === i); });
  check("engine: each split shares its population's 10 fish into two halves of 5, none in both (" + Object.keys(halves).length + " splits)", okH);
  /* links against saved generations: no mutation, so the allele a link points at is the allele the young carries */
  const P = { N: 12, b: 0.02, mu: 0 }, w = trWorld(P, 11); while (w.t < 0) trStep(w);
  let tot = 0, good = 0;
  for (let g = 0; g < 120; g++) {
    const before = new Map(w.alive.map(pid => [pid, w.pops[pid].F]));
    trStep(w);
    for (const pid of w.alive) { const p = w.pops[pid];
      for (let slot = 0; slot < 2 * P.N; slot++) for (let k = 0; k < NT; k++) {
        const [pp, ps] = trBack(w, pid, w.t, slot, k), src = before.get(pp) || before.get(p.parent);
        const parentF = pp === pid ? before.get(pid) : w.pops[pp].F === undefined ? null : before.get(pp);
        if (!parentF) continue; tot++;
        if (p.F[slot >> 1][slot & 1][TRACED[k]] === parentF[ps >> 1][ps & 1][TRACED[k]]) good++; } }
  }
  check("engine: every link points at a parent chromosome carrying the same allele (" + good + " of " + tot + ", 120 generations, splits included)", tot > 10000 && good === tot);
  /* lineages from two populations meet only before they parted */
  const w2 = grow({ N: 25, b: 0.008, mu: 0.001 }, 21); let early = 0, n = 0;
  for (let k = 0; k < NT; k++) { const tr = trTrace(w2, k, false);
    for (const m of tr.merges) { const tips = w2.alive.filter((_, i) => m.mask >> i & 1); let latest = -1e9;
      for (let a = 0; a < tips.length; a++) for (let b = a + 1; b < tips.length; b++) latest = Math.max(latest, trParted(w2, tips[a], tips[b]));
      n++; if (m.t >= latest) early++; } }
  check("engine: lineages from populations that parted at generation g never meet at g or later (" + early + " of " + n + " meetings)", n > 20 && early === 0);
  const g = w2.pops[w2.alive[0]].F[0]; let sz = 20; for (const c of g) for (let i = 0; i < L; i++) sz += w2.eff[c[i]];
  const w3 = grow({ N: 10, b: 0.016, mu: 0 }, 5), hw = trPairs(w3, 20).map(p => p.hw);
  check("engine: a fish's size is 20 plus its 80 alleles' effects (" + sz.toFixed(3) + " = " + trSizeOf(w2, g).toFixed(3) + "); with no mutation every hybrid lives (" + hw.map(v => v.toFixed(2)).join(" ") + ")", Math.abs(sz - trSizeOf(w2, g)) < 1e-9 && hw.every(v => v === 1));
}

/* ================= the steps' targets, tree by tree ================= */
const hits = (k, o, n) => { let h = 0; const out = []; AX.step = k; AX.done = false; AX.waiting = false; openStep(); document.getElementById("A_practice").checked = true; setC(o);
  for (let r = 0; r < n; r++) { goRun(); finishNow(); const q = AX.last; const ok = STEPS[k].rules.every(u => u.ok(q)); if (ok) h++; out.push(STEPS[k].rules.map(u => u.val(q)).join("/")); } return { h, out }; };
const T = (k, good, badOne, n, minGood, maxBad) => { const g = hits(k, good, n), b = hits(k, badOne, n);
  check("step " + (k + 1) + ": " + JSON.stringify(good).replace(/"/g, "") + " hits " + g.h + " of " + n + " trees (" + g.out.join(", ") + "); the opening " + JSON.stringify(badOne).replace(/"/g, "") + " " + b.h + " of " + n + " (" + b.out.join(", ") + ")",
        g.h >= minGood && b.h <= maxBad); };
/* each step's single-tree hit rate was measured (the page's comment above STEPS); the counts below are sized so a check fails
   about one time in a hundred or less: .99 at .016 vs a few % at .001; ~1.0 vs ~.05; ~.60 vs 0; .83-.93 vs .03-.10 */
T(0, { b: 0.016 }, { b: 0.001 }, 6, 5, 1);
T(2, { N: 50, b: 0.016 }, { N: 5, b: 0.008 }, 8, 7, 2);
T(3, { N: 5, b: 0.008 }, { N: 50, b: 0.008 }, 10, 3, 0);
T(4, { mu: 0.004, N: 25, b: 0.008 }, { mu: 0.001, N: 25, b: 0.008 }, 10, 6, 2);
{
  /* the questions, judged by the tree: A's closest relative; the pair that parted most recently */
  const w = grow({ N: 25, b: 0.016, mu: 0.004 }, 77), q = { w, pairs: trPairs(w, 20) }, X = refTip(w), sis = sisterOf(w, X);
  const right1 = sis.size === 1 && [...sis].every(i => STEPS[1].judge(w, i)), wrong1 = [0, 1, 2, 3, 4, 5].filter(i => !sis.has(i)).every(i => !STEPS[1].judge(w, i));
  const mn = Math.min(...q.pairs.map(p => p.ago)), young = q.pairs.find(p => p.ago === mn), old = q.pairs.find(p => p.ago > mn);
  check("questions: the ringed population " + LETTERS[X] + "'s closest relative (" + [...sis].map(i => LETTERS[i]).join(",") + ", one population) is right and no other letter is (" + right1 + ", " + wrong1 + "); the pair that parted most recently (" + LETTERS[young.i] + LETTERS[young.j] + ", " + mn + " ago) is the best bet for living hybrids and an older pair is not (" + STEPS[5].judge(w, young.i, young.j, q) + ", " + !STEPS[5].judge(w, old.i, old.j, q) + ")",
        right1 && wrong1 && STEPS[5].judge(w, young.i, young.j, q) && !STEPS[5].judge(w, old.i, old.j, q));
}

/* ================= the flow, by the real buttons and clicks ================= */
const clickLetter = i => { const q = AX.last, cv = document.getElementById("A_tree"), r = cv.getBoundingClientRect(), k = r.width / TR.W, Ly = trLayout(q.w);
  const x = TR.px + q.w.t / G * TR.pw + 14, y = Ly.ys.get(Ly.order[i]); cv.dispatchEvent(new MouseEvent("click", { clientX: r.left + x * k, clientY: r.top + y * k, bubbles: true })); };
{
  AX.step = 0; AX.done = false; AX.waiting = false; AX.results = []; AX.last = null; openStep(); paint();
  const prac = document.getElementById("A_practice"), go = () => { document.getElementById("A_go").click(); finishNow(); }, next = () => document.getElementById("A_next").click();
  const rowsShown = () => ["b", "N", "mu"].map(k => !document.getElementById("A_" + k + "Row").hidden ? k : "").join("");
  const r0 = rowsShown();
  prac.checked = false; setC({ b: 0 }); go(); const miss = Score.getBit("scaffold", BIT.S1) === 0 && !AX.waiting;
  setC({ b: 0.016 }); go(); const hit1 = AX.waiting; next();
  /* step 2: Go is held while the tree on screen will do; a wrong letter records 0 and the question stays; the right one opens step 3 */
  const goHeld = document.getElementById("A_go").disabled, X = refTip(AX.last.w), sis = sisterOf(AX.last.w, X), wrong = [0, 1, 2, 3, 4, 5].find(i => i !== X && i < AX.last.w.alive.length && !sis.has(i));
  if (wrong != null) clickLetter(wrong); const q1 = wrong == null || (Score.getBit("scaffold", BIT.S2) === 0 && !AX.waiting);
  clickLetter([...sis][0]); const q2 = AX.waiting; next();
  const r1 = rowsShown();
  setC({ N: 50, b: 0.016 }); prac.checked = false; go(); let tries = 1; while (!AX.waiting && tries < 6) { go(); tries++; } next();
  setC({ N: 5, b: 0.008 }); prac.checked = false; go(); tries = 1; while (!AX.waiting && tries < 20) { go(); tries++; } const t4 = tries; next();
  const r2 = rowsShown();
  setC({ mu: 0.004, N: 25, b: 0.008 }); prac.checked = false; go(); tries = 1; while (!AX.waiting && tries < 6) { go(); tries++; } next();
  /* step 6: two letters, the pair that parted most recently */
  const q = AX.last, mn = Math.min(...q.pairs.map(p => p.ago)), yp = q.pairs.find(p => p.ago === mn); clickLetter(yp.i); clickLetter(yp.j); const q6 = AX.waiting; next();
  /* the three size trees: hidden until the pick */
  const hid = [], shown = [];
  for (let k = 0; k < 3; k++) { setC({ N: 25, b: 0.016, mu: 0.004 }); go(); hid.push(document.getElementById("A_sizeBox").hidden === false && AX.last.hidden === true && !document.getElementById("A_measSz").disabled);
    clickLetter([...sisterOf(AX.last.w, refTip(AX.last.w))][0]); shown.push(AX.last.hidden === false && AX.waiting); next(); }
  const bits = Object.keys(BIT).map(k => Score.getBit("scaffold", BIT[k])).join(""), wrong2 = wrong;
  check("flow: the sliders join as the steps open them (" + r0 + " / " + r1 + " / " + r2 + "); a miss records 0 and step 1 stays (" + miss + "), then hits (" + hit1 + ")",
        r0 === "b" && r1 === "bN" && r2 === "bNmu" && miss && hit1);
  check("flow: questions by clicks on the tree's letters: Go held while the tree will do (" + goHeld + "); a wrong letter records 0 and the question stays (" + q1 + "); the right one opens the next step (" + q2 + "); two letters for the hybrids (" + q6 + ")",
        goHeld && q1 && q2 && q6);
  check("flow: the size trees hide the sizes until the pick (" + hid.join(",") + ") and show them after (" + shown.join(",") + "); the last ends the lesson; bits " + bits + " (step 4 took " + t4 + " trees)",
        hid.every(Boolean) && shown.every(Boolean) && Gates.A.done && document.getElementById("done-banner").classList.contains("shown") && bits.startsWith(wrong2 != null ? "00" : "01") && bits.length === 9 && /^[01]+$/.test(bits));
  const D = Object.keys(BIT).length; let n = 0; for (let i = 0; i < D; i++) if (Score.isAnswered("scaffold", i)) n++;
  check("all " + D + " declared bits written", D === 9 && n === D, n + " written");
}
{
  const infos = [...document.querySelectorAll(".info")], tipOf = e => e.dataset.tip ? document.getElementById(e.dataset.tip) : e.querySelector(".tip");
  const empty = infos.filter(e => !tipOf(e) || !tipOf(e).textContent.trim()).length, ano = document.getElementById("A_anoBox");
  check("hover text: " + infos.length + " marks, " + empty + " empty; the Anolis box closed at load", infos.length >= 5 && empty === 0 && ano.matches("details.opt") && !ano.open);
  ano.open = true; drawAnolis(); const A = anoBuild();
  check("the Anolis box: 82 species on the tree, each with a length (" + A.tips.length + ", " + A.tips.filter(t => ANOLIS_SVL[t.name] != null).length + "); pairs that parted recently differ least (" + A.mean.map(m => m == null ? "-" : m.toFixed(2)).join(" / ") + ")",
        A.tips.length === 82 && A.tips.every(t => ANOLIS_SVL[t.name] != null) && A.mean[0] < A.mean[A.mean.length - 1]);
  FIT_EPOCH++; paint(); drawAnolis();
  const over = []; for (const id of ${JSON.stringify(CANVAS_IDS)}) { const cv = document.getElementById(id), host = cv.parentElement; if (+cv.dataset.drawW > host.clientWidth + 1) over.push(id + " " + cv.dataset.drawW + ">" + host.clientWidth); }
  check("every canvas fits its panel (" + window.innerWidth + " wide)", over.length === 0, over.join(", "));
  const els = document.querySelectorAll("#stageA .panel"), last = els[els.length - 1];
  check("layout: the R code last and closed; no readout lines", last.matches("details.rcode") && !last.open && document.querySelectorAll(".readout").length === 0);
}
A_code();
say(bad ? ("FAILED " + bad) : "ALL BARS PASS");
say("RAN " + ran);
say("RA " + RTEXT.codeA.replace(/\\n/g, "\\\\n"));
L_.join(" ;; ");
`;
const INNER_NARROW = `
document.getElementById("stageA").classList.remove("stage-locked"); document.getElementById("A_sizeBox").hidden = false;
for (const d of document.querySelectorAll("details.opt")) d.open = true;
FIT_EPOCH++; paint(); drawAnolis();
const over = []; for (const id of ${JSON.stringify(CANVAS_IDS)}) { const cv = document.getElementById(id), host = cv.parentElement; if (+cv.dataset.drawW > host.clientWidth + 1) over.push(id + " " + cv.dataset.drawW + ">" + host.clientWidth); }
(over.length ? "FAIL " : "ok   ") + "every canvas fits its panel (" + window.innerWidth + " wide)" + (over.length ? "  -- " + over.join(", ") : "");
`;
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
  for (const line of lines) if (!/^RA /.test(line)) console.log(line);
  const reported = lines.filter(l => /^(ok|FAIL)\s/.test(l)).length, ranLine = /^RAN (\d+)$/.exec((lines.find(l => /^RAN \d+$/.test(l)) || ""));
  if (!ranLine || +ranLine[1] !== reported) { console.log("FAIL harness  " + (ranLine ? ranLine[1] : "?") + " checks ran, " + reported + " came back"); bad = true; }
  const narrow = m2 ? dec(m2[1]) : "FAIL narrow frame gave nothing"; console.log(narrow); if (!/^ok/.test(narrow)) bad = true;
  const probeR = spawnSync("Rscript", ["--version"], { encoding: "utf8" });
  if (probeR.error) console.log("skip R panel  (no Rscript)");
  else { const src = (lines.find(l => l.startsWith("RA ")) || "").slice(3).replace(/\\n/g, "\n"), fixed = src.replace("G <- 400", "G <- 25").replace(/^N <- \d+/m, "N <- 10").replace(/^b <- [0-9.]+/m, "b <- 0.1");
    const o = spawnSync("Rscript", ["-e", fixed + "\ncat('\\nOK\\n')"], { encoding: "utf8", timeout: 240000 }), ok = /OK/.test(o.stdout || "");
    console.log((ok ? "ok   " : "FAIL ") + "the R panel runs (25 generations, 10 fish)" + (ok ? "  -- " + (o.stdout || "").trim().split("\n").slice(-6, -1).join(" ").replace(/\s+/g, " ") : "  -- " + (o.stderr || "").slice(0, 300)));
    if (!ok) bad = true; }
  cleanup(); process.exit(bad ? 1 : 0);
}, 700);
