#!/usr/bin/env node
/*
 * check_lesson17_numbers.js -- the checks for app/lessons/lesson17.html.
 *
 * Lesson 17 is a draft (pass 2, 2026-10-15, from JM's review): migration
 * between populations of bead-string genomes (hue = the population an
 * allele arose in). A steady migration, B one dispersal event, C selection
 * at gene 20 with s and h per population (local adaptation, swamping, a
 * sweep), D four populations and F_ST. What has to hold:
 *
 *   Engine. A swap moves whole genomes; a gamete with no crossover is a
 *      parent's chromosome; at R 0 fragments never shorten; the dispersal
 *      event puts exactly M other-hue genomes in each population; C's
 *      fitness is 1, 1 - hs, 1 - s with each population's own s and h; four
 *      solid populations read F_ST 1, two identical ones 0; migration on
 *      one arrow only brings in that partner's colour.
 *   A. each target hit by its intended setting and missed by the opening
 *      and the naive one (twice each, practice); fragment length flat in m.
 *   B. each round holds the event at 4 each way and frees one slider; each
 *      target hit a step the right way of its opening and missed at the
 *      opening and the wrong way; fragments shorten with time and with
 *      crossing over; every run is a dot on "your runs".
 *   C. local adaptation needs both signs; swamping needs m .05 or more;
 *      the sweep needs a helpful allele and little migration, and the swamp
 *      that opens it misses; the fitness line agrees with 1, 1 - hs, 1 - s.
 *   D. F_ST falls as migration rises and as N rises; each target hit by
 *      its intended setting and missed by the opening and the near miss;
 *      the printed (pooled - within) / pooled agrees with the printed F_ST;
 *      a held arrow is pale and takes no drag.
 *   Flow. the opening run records 0 and the target stays; a hit opens Next
 *      target; every bit written at the end; B needs ten runs and a pick.
 *   All. every canvas fits its panel (1500 and 1000 wide); the four R
 *      panels run (Rscript; C and D shortened).
 *
 * Same harness as check_lesson16_numbers.js.
 *
 * Usage:  node scripts/check_lesson17_numbers.js      (~4 minutes)
 * Exit 0 iff every check passes. Needs Google Chrome and python3; Rscript
 * for the R panels (skipped, and said so, without it).
 */
const { spawn, spawnSync } = require("child_process");
const fs = require("fs"), path = require("path");

const ROOT = path.resolve(__dirname, "..");
const PORT = +process.env.PORT || 8797;
const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

const CANVAS_IDS = ["A_board","A_time","B_board","B_time","B_runs","C_board","C_genes","C_time","D_board","D_time","D_sparrow","D_pairs"];
const INNER = `
const L_=[], say=s=>L_.push(s);
let bad=0, ran=0;
const check=(name, ok, detail)=>{ ran++; if(!ok) bad++; say((ok?"ok   ":"FAIL ")+name+(detail?"  -- "+detail:"")); };
for (const s of ["A","B","C","D"]) document.getElementById("stage"+s).classList.remove("stage-locked");
const setC = (S, o) => { for (const k in o) { const c = S.cfg.ctl.find(c => c.key === k), i = c.vals.indexOf(o[k]); if (i < 0) throw new Error(S.K + ": no " + k + " = " + o[k] + " on the slider"); document.getElementById(S.K + "_" + k).value = i; } syncVals(S); };
/* a setting played n times as practice against round r; the summaries at the round's generation */
const play = (S, r, o, n) => { S.round = r; S.waiting = false; S.done = false; document.getElementById(S.K + "_practice").checked = true; openRound(S); setC(S, o);
  const out = []; for (let k = 0; k < (n || 2); k++) { goStage(S); finishNow(S); out.push(sumAt(S.last, S.last.G)); } return out; };
const hits = (S, r, o, n) => play(S, r, o, n).map(x => judge(S.cfg.rounds[r], x));
const allHit = (S, r, o) => hits(S, r, o).every(j => j.ok), noneHit = (S, r, o) => hits(S, r, o).every(j => !j.ok);
const show = (S, r, o) => JSON.stringify(o).replace(/"/g, "");
const tgt = (S, r, good, badOnes) => {
  const g = good.map(o => [o, allHit(S, r, o)]), b = badOnes.map(o => [o, noneHit(S, r, o)]);
  check(S.K + " target " + (r + 1) + ": hit by " + good.map(o => show(S, r, o)).join(", ") + "; missed by " + badOnes.map(o => show(S, r, o)).join(", "),
        g.every(x => x[1]) && b.every(x => x[1]), g.filter(x => !x[1]).map(x => "no hit " + show(S, r, x[0])).concat(b.filter(x => !x[1]).map(x => "hit " + show(S, r, x[0]))).join("; "));
};

/* ================= the engine ================= */
{
  const P = { N: 25, mig: [[0, 1, 0]], R: 0, sel: null }, pops = mgStart(P, 7), rng = mulberry32(3);
  const g = pops[0][0], gm = mgGamete(P, g, rng);
  check("engine: at R 0 a gamete is one of the parent's two chromosomes, unchanged", gm === g[0] || gm === g[1]);
  /* a dispersal event of 4: exactly 4 all-other-hue genomes in each */
  const q = SB.cfg.start({ M: 4, R: 1, G: 5 }, 11, 5); q.t0swap();
  const nOther = q.pairs.map(p => p.pops.map((F, k) => F.filter(x => mgOther(x, k + 1) === 1).length));
  check("engine: a dispersal event of 4 leaves exactly 4 all-other-hue genomes in each population of every pair", nOther.every(a => a[0] === 4 && a[1] === 4));
  const st0 = mgStats(q.pairs[0], false);
  check("engine: right after the dispersal event every fragment is a whole chromosome (40 beads)", st0.pops.every(p => p.mf === 40));
  /* R 0: with migration, fragments never get shorter than 40 */
  const P0 = { N: 25, mig: [[0, 1, 0.05]], R: 0, sel: null }, pr0 = { pops: mgStart(P0, 13), rng: mulberry32(17) };
  for (let t = 0; t < 30; t++) mgStep(P0, pr0);
  const s0 = mgStats(pr0, false);
  check("engine: with no crossing over, the other hue only ever comes as whole chromosomes (average " + s0.pops.map(p => p.mf).join(", ") + ")", s0.pops.every(p => p.mf == null || p.mf === 40));
  /* C: the blue allele at gene 20, each population's own s and h */
  const PC = { N: 25, mig: [[0, 1, 0]], R: 1, sel: 19, s: [0.3, -0.6], h: [0.5, 1] }, F = mgStart(PC, 5), mk = (k, nb) => { const x = [F[k][0][0].slice(), F[k][0][1].slice()]; x[0][19] = nb > 0 ? 2 : 1; x[1][19] = nb > 1 ? 2 : 1; return x; };
  const fw = [0, 1].map(k => [0, 1, 2].map(nb => mgFit(PC, mk(k, nb), k)));
  const want = [[1, 1 - 0.5 * 0.3, 1 - 0.3], [1, 1 + 0.6, 1 + 0.6]];
  check("engine: C's fitness, by blue alleles at gene 20 (0 / 1 / 2): orange population " + fw[0].map(v => v.toFixed(2)).join(" / ") + ", blue " + fw[1].map(v => v.toFixed(2)).join(" / ") + " (s +.3 h .5; s -.6 h 1)",
        fw.every((r, k) => r.every((v, i) => Math.abs(v - want[k][i]) < 1e-9)));
  /* D: four solid populations; identical populations; one arrow */
  const P4 = { n: 4, founders: 1, N: 25, R: 1, sel: null, mig: [[0, 1, 0.05]] }, w = { pops: mgStart(P4, 9), rng: mulberry32(19) }, st4 = mgStats(w, true);
  check("engine: four populations at the start, each one colour: F_ST " + st4.fst.toFixed(3) + ", within " + st4.HS.toFixed(3) + ", every pair " + st4.pw.map(v => v.toFixed(2)).join(" "), st4.fst === 1 && st4.HS === 0 && st4.pw.every(v => v === 1));
  for (let t = 0; t < 30; t++) mgStep(P4, w);
  const hc = mgCounts(w), leak = [[0, 3], [0, 4], [1, 3], [1, 4], [2, 1], [2, 2], [3, 1], [3, 2]].reduce((a, [k, h]) => a + hc[k].reduce((b, r) => b + r[h], 0), 0);
  const mixed = hc[0].reduce((b, r) => b + r[2], 0) / L;
  check("engine: migration on the orange-blue arrow only: after 30 generations orange carries " + (100 * mixed).toFixed(0) + "% blue, and no orange or blue in red or purple, nor red or purple in orange or blue", leak === 0 && mixed > 0.1);
  const same = { pops: [w.pops[0], w.pops[0].map(x => x), w.pops[2], w.pops[3]] }, fs = mgFst(mgCounts(same), [0, 1]).fst;
  check("engine: two identical populations read F_ST " + fs.toFixed(3), Math.abs(fs) < 1e-12);
}

/* ================= A ================= */
tgt(SA, 0, [{ m: 0.005, R: 1 }, { m: 0.01, R: 1 }], [{ m: 0, R: 1 }, { m: 0.002, R: 1 }, { m: 0.02, R: 1 }]);
tgt(SA, 1, [{ m: 0.01, R: 0.5 }, { m: 0.005, R: 0.25 }], [{ m: 0.01, R: 1 }, { m: 0.02, R: 0.5 }]);
tgt(SA, 2, [{ m: 0.02, R: 2 }, { m: 0.01, R: 4 }], [{ m: 0.005, R: 0.5 }, { m: 0.02, R: 1 }, { m: 0.01, R: 2 }]);
{
  const lo = play(SA, 0, { m: 0.005, R: 1 }, 2), hi = play(SA, 0, { m: 0.05, R: 1 }, 2), mean = a => a.reduce((x, y) => x + y.mf, 0) / a.length;
  check("A: average fragment length barely moves with m (m .005 " + mean(lo).toFixed(2) + ", m .05 " + mean(hi).toFixed(2) + " beads, R 1)", Math.abs(mean(lo) - mean(hi)) < 0.8);
}

/* ================= B ================= */
{
  const holds = [0, 1, 2].map(r => { SB.round = r; SB.done = false; openRound(SB); return readSet(SB).M === 4 && document.getElementById("B_M").dataset.held === "1"; });
  check("B: every round holds the dispersal event at 4 genomes each way", holds.every(Boolean));
}
tgt(SB, 0, [{ G: 10 }, { G: 5 }], [{ G: 20 }, { G: 40 }]);
tgt(SB, 1, [{ R: 0.5 }, { R: 0.25 }], [{ R: 1 }, { R: 2 }]);
tgt(SB, 2, [{ R: 2 }, { R: 4 }], [{ R: 1 }, { R: 0.5 }]);
{
  SB.round = 0; SB.done = true; openRound(SB); document.getElementById("B_practice").checked = true;
  const at = (R, G) => { setC(SB, { M: 4, R, G }); goStage(SB); finishNow(SB); return sumAt(SB.last, G).mf; };
  const r1 = [5, 10, 20].map(G => at(1, G)), r2 = at(2, 10), rh = at(0.5, 10);
  check("B: fragments shorten with time (R 1: " + r1.map(v => v.toFixed(1)).join(" / ") + " at 5 / 10 / 20) and with crossing over (at 10: R .5 " + rh.toFixed(1) + ", 1 " + r1[1].toFixed(1) + ", 2 " + r2.toFixed(1) + ")",
        r1[0] > r1[1] && r1[1] > r1[2] && rh > r1[1] && r1[1] > r2);
  const n0 = BX.dots.length; setC(SB, { M: 4, R: 1, G: 5 }); goStage(SB); finishNow(SB);
  check("B: every run, practice too, adds a dot to your runs (" + n0 + " -> " + BX.dots.length + ")", BX.dots.length === n0 + 1);
  SB.done = false;
}

/* ================= C ================= */
tgt(SC, 0, [{ so: 0.3, sb: -0.3 }, { so: 0.6, sb: -0.6 }], [{ so: 0, sb: 0 }, { so: 0.3, sb: 0 }, { so: 0, sb: -0.3 }]);
tgt(SC, 1, [{ m: 0.05 }, { m: 0.1 }], [{ m: 0.02 }, { m: 0.01 }]);
tgt(SC, 2, [{ so: -0.3, sb: 0, m: 0.005 }, { so: -0.3, sb: -0.6, m: 0.005 }, { so: -0.6, sb: -0.6, m: 0.002 }],
           [{ so: 0.1, sb: -0.6, m: 0.05 }, { so: 0, sb: -0.6, m: 0.05 }, { so: -0.3, sb: 0, m: 0.002 }, { so: -0.1, sb: 0, m: 0.005 }]);
{
  SC.round = 1; SC.done = false; openRound(SC);
  const set = readSet(SC), held = ["so", "ho", "sb", "hb"].every(k => document.getElementById("C_" + k).dataset.held === "1");
  check("C round 2 holds s and h (+0.1 / 0.5, -0.6 / 0.5) and opens m at 0.02", held && set.so === 0.1 && set.sb === -0.6 && set.m === 0.02);
  C_fitLine();
  const shown = (document.getElementById("C_fit").textContent.match(/[0-9][.][0-9][0-9]/g) || []).map(Number), want = [1, 1 - 0.05, 0.9, 1, 1.3, 1.6];
  check("C: the fitness line agrees with 1, 1 - hs, 1 - s (shown " + shown.join(" ") + ")", shown.length === 6 && shown.every((v, i) => Math.abs(v - want[i]) < 0.006));
}

/* ================= D ================= */
const allE = v => ({ e0: v, e1: v, e2: v, e3: v, e4: v, e5: v }), only = o => Object.assign(allE(0), o);
{
  const f = [0, 0.002, 0.005, 0.01, 0.02].map(m => { const r = play(SD, 0, allE(m), 1)[0]; return r.fst; });
  check("D: F_ST at 100 falls as every pair's migration rises (m 0 / .002 / .005 / .01 / .02: " + f.map(v => v.toFixed(2)).join(" / ") + ")", f.every((v, i) => i === 0 || v < f[i - 1]) && f[0] === 1);
  const n = [10, 25, 50].map(N => play(SD, 2, { N }, 1)[0].fst);
  check("D: with every pair held at .01, F_ST falls as N rises (N 10 / 25 / 50: " + n.map(v => v.toFixed(2)).join(" / ") + ")", n[0] > n[1] && n[1] > n[2]);
  play(SD, 0, allE(0.01), 1); D_paint();
  const nums = (document.getElementById("D_boardRead").textContent.match(/within ([0-9.]+) · pooled ([0-9.]+) · F_ST = [(]pooled − within[)] [/] pooled = ([0-9.]+)/) || []).slice(1).map(Number);
  check("D: the board's (pooled - within) / pooled agrees with its F_ST (" + nums.join(", ") + ")", nums.length === 3 && Math.abs((nums[1] - nums[0]) / nums[1] - nums[2]) < 0.012);
  SD.round = 2; SD.done = false; openRound(SD); const pale3 = document.querySelectorAll("#D_paths .paths-arrow.locked").length, hit3 = document.querySelectorAll("#D_paths .paths-hit").length;
  SD.round = 0; openRound(SD); const pale1 = document.querySelectorAll("#D_paths .paths-arrow.locked").length, hit1 = document.querySelectorAll("#D_paths .paths-hit").length;
  check("D: round 3's six held arrows are pale and take no drag (" + pale3 + " pale, " + hit3 + " draggable); round 1's are live (" + pale1 + ", " + hit1 + ")", pale3 === 6 && hit3 === 0 && pale1 === 0 && hit1 === 6);
}
tgt(SD, 0, [allE(0.01), allE(0.02), only({ e0: 0.02, e1: 0.02, e4: 0.02, e5: 0.02 })], [allE(0), allE(0.005), only({ e0: 0.02, e3: 0.02, e5: 0.02 })]);
tgt(SD, 1, [only({ e0: 0.02, e5: 0.02 }), only({ e0: 0.05, e5: 0.05, e4: 0.002 })], [allE(0.02), only({ e0: 0.05, e5: 0.05, e4: 0.05 }), allE(0)]);
tgt(SD, 2, [{ N: 10 }], [{ N: 25 }, { N: 50 }]);

/* ================= the flow, scored ================= */
{
  const flow = (S, intended) => {
    S.round = 0; S.results = []; S.done = false; S.waiting = false; S.last = null; document.getElementById(S.K + "_practice").checked = false; openRound(S); syncStage(S);
    goStage(S); finishNow(S); const miss = Score.getBit("scaffold", BIT[S.K + "1"]) === 0 && !S.waiting;
    for (let r = 0; r < intended.length; r++) {
      setC(S, intended[r]); goStage(S); finishNow(S);
      if (r < intended.length - 1) nextRound(S);
    }
    const bits = intended.map((_, r) => Score.getBit("scaffold", BIT[S.K + (r + 1)])).join("");
    return { miss, bits };
  };
  const a = flow(SA, [{ m: 0.01, R: 1 }, { m: 0.01, R: 0.5 }, { m: 0.02, R: 2 }]);
  check("A flow: the opening run records 0 and the target stays; three hits (bits " + a.bits + ") finish A", a.miss && a.bits === "011" && Gates.A.done);
  BX.picked = false; BX.dots = [];
  const b = flow(SB, [{ G: 10 }, { R: 0.5 }, { R: 2 }]);
  const waitB = !Gates.B.done;
  while (BX.dots.length < 10) { goStage(SB); finishNow(SB); }
  const stillB = !Gates.B.done;
  BX.picked = true; checkStage(SB);
  check("B flow: opening records 0; three hits (bits " + b.bits + "); B waits for ten runs (" + waitB + ") and a pick (" + stillB + "), then opens C", b.miss && b.bits === "011" && waitB && stillB && Gates.B.done);
  const c = flow(SC, [{ so: 0.3, sb: -0.3 }, { m: 0.05 }, { so: -0.3, sb: 0, m: 0.005 }]);
  check("C flow: opening records 0; three hits (bits " + c.bits + ") finish C", c.miss && c.bits === "011" && Gates.C.done);
  const d = flow(SD, [allE(0.02), only({ e0: 0.02, e5: 0.02 }), { N: 10 }]);
  check("D flow: opening records 0; three hits (bits " + d.bits + ") finish D and the lesson", d.miss && d.bits === "011" && Gates.D.done && document.getElementById("done-banner").classList.contains("shown"));
}
{
  const D = Object.keys(BIT).length; let n = 0; for (let i = 0; i < D; i++) if (Score.isAnswered("scaffold", i)) n++;
  check("all " + D + " declared bits written", D === 12 && n === D, n + " written");
}
{
  FIT_EPOCH++; paintAll();
  const over = [];
  for (const id of ${JSON.stringify(CANVAS_IDS)}) { const cv = document.getElementById(id), host = cv.parentElement;
    if (+cv.dataset.drawW > host.clientWidth + 1) over.push(id + " " + cv.dataset.drawW + ">" + host.clientWidth); }
  check("every canvas fits its panel (" + window.innerWidth + " wide)", over.length === 0, over.join(", "));
}
A_code(); B_code(); C_code(); D_code();
say(bad ? ("FAILED " + bad) : "ALL BARS PASS");
say("RAN " + ran);
say("RA " + RTEXT.codeA.replace(/\\n/g, "\\\\n"));
say("RB " + RTEXT.codeB.replace(/\\n/g, "\\\\n"));
say("RC " + RTEXT.codeC.replace(/\\n/g, "\\\\n"));
say("RD " + RTEXT.codeD.replace(/\\n/g, "\\\\n"));
L_.join(" ;; ");
`;

const INNER_NARROW = `
for (const s of ["A","B","C","D"]) document.getElementById("stage"+s).classList.remove("stage-locked");
FIT_EPOCH++; paintAll();
const over = [];
for (const id of ${JSON.stringify(CANVAS_IDS)}) { const cv = document.getElementById(id), host = cv.parentElement;
  if (+cv.dataset.drawW > host.clientWidth + 1) over.push(id + " " + cv.dataset.drawW + ">" + host.clientWidth); }
(over.length ? "FAIL " : "ok   ") + "every canvas fits its panel (" + window.innerWidth + " wide)" + (over.length ? "  -- " + over.join(", ") : "");
`;

const probe = `<!doctype html><meta charset="utf-8"><title>pending</title>
<iframe id="f" src="http://127.0.0.1:${PORT}/app/lessons/lesson17.html?preview=1" width="1500" height="1000"></iframe>
<iframe id="g" src="http://127.0.0.1:${PORT}/app/lessons/lesson17.html?preview=1" width="1000" height="900"></iframe>
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

const probePath = path.join(ROOT, "_check_l17_" + PORT + ".html");
fs.writeFileSync(probePath, probe);
const server = spawn("python3", ["-m", "http.server", String(PORT), "--directory", ROOT], { stdio: "ignore", detached: true });
const cleanup = () => { try { process.kill(-server.pid); } catch (e) {} try { fs.unlinkSync(probePath); } catch (e) {} };
process.on("exit", cleanup);

setTimeout(() => {
  const r = spawnSync(CHROME, ["--headless=new", "--disable-gpu", "--virtual-time-budget=1200000", "--dump-dom", `http://127.0.0.1:${PORT}/_check_l17_${PORT}.html`],
                      { encoding: "utf8", maxBuffer: 1 << 28 });
  const dec = s => s.replace(/&quot;/g, '"').replace(/&gt;/g, ">").replace(/&lt;/g, "<").replace(/&amp;/g, "&");
  const m = /<pre id="out">([\s\S]*?)<\/pre>/.exec(r.stdout || ""), m2 = /<pre id="out2">([\s\S]*?)<\/pre>/.exec(r.stdout || "");
  if (!m) { console.error("no result -- is Chrome at " + CHROME + " ?"); cleanup(); process.exit(2); }
  const text = dec(m[1]), lines = text.split(" ;; ");
  let bad = !/ALL BARS PASS/.test(text);
  const tagged = t => (lines.find(l => l.startsWith(t + " ")) || "").slice(t.length + 1).replace(/\\n/g, "\n");
  for (const line of lines) if (!/^(RA|RB|RC|RD) /.test(line)) console.log(line);
  const reported = lines.filter(l => /^(ok|FAIL)\s/.test(l)).length;
  const ranLine = /^RAN (\d+)$/.exec((lines.find(l => /^RAN \d+$/.test(l)) || ""));
  if (!ranLine || +ranLine[1] !== reported) { console.log("FAIL harness  " + (ranLine ? ranLine[1] : "?") + " checks ran, " + reported + " came back"); bad = true; }
  const narrow = m2 ? dec(m2[1]) : "FAIL narrow frame gave nothing";
  console.log(narrow); if (!/^ok/.test(narrow)) bad = true;
  const rs = (code, tail) => spawnSync("Rscript", ["-e", code + (tail || "")], { encoding: "utf8", timeout: 180000 });
  const probeR = spawnSync("Rscript", ["--version"], { encoding: "utf8" });
  if (probeR.error) console.log("skip R panels  (no Rscript)");
  else for (const [tag, name, fix] of [["RA", "A", s => s], ["RB", "B", s => s], ["RC", "C (20 generations here)", s => s.replace("G <- 100", "G <- 20")], ["RD", "D (10 generations here)", s => s.replace("G <- 100", "G <- 10")]]) {
    const o = rs(fix(tagged(tag)), "\ncat('\\nOK\\n')");
    const ok = /OK/.test(o.stdout || "");
    console.log((ok ? "ok   " : "FAIL ") + "the R panel for " + name + " runs" + (ok ? "  -- " + (o.stdout || "").trim().split("\n").slice(-3, -1).join(" ").replace(/\s+/g, " ") : "  -- " + (o.stderr || "").slice(0, 300)));
    if (!ok) bad = true;
  }
  cleanup();
  process.exit(bad ? 1 : 0);
}, 700);
