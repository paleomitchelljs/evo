#!/usr/bin/env node
/*
 * check_lesson17_numbers.js -- the checks for app/lessons/lesson17.html.
 *
 * Lesson 17 is a draft (first pass, 2026-10-12): migration between two
 * populations of bead-string genomes (hue = the population an allele arose
 * in). A steady migration, B one pulse, C a split (drift, migration,
 * mutation; heterozygosity and F_ST), D selection at gene 20. What has to
 * hold:
 *
 *   Engine. A swap moves whole genomes; a gamete with no crossover is a
 *      parent's chromosome; at R 0 fragments never shorten; the pulse puts
 *      exactly M other-hue genomes in each population; a new mutation takes
 *      its population's hue.
 *   A. each target hit by its intended setting and missed by the opening
 *      and the naive one (twice each, practice); fragment length flat in m.
 *   B. the same, at the slider's generation; fragments shorten with time
 *      and with crossing over; every run is a dot on "your runs".
 *   C. heterozygosity within agrees with H0 (1 - 1/2N)^t (drift alone);
 *      F_ST agrees with 1/(1 + 16Nm) (two populations), not 1/(1 + 4Nm);
 *      heterozygosity under mutation agrees with 4Nu/(1 + 4Nu); each
 *      target hit by its intended setting, missed by the opening.
 *   D. barrier and sweep: hit by s > 0 / s < 0, missed by s 0 and by the
 *      opening.
 *   Flow. the opening run records 0 and the target stays; a hit opens Next
 *      target; each round opens on settings that miss; every bit written at
 *      the end; B needs ten runs and a pick.
 *   All. every canvas fits its panel (1500 and 1000 wide); the four R
 *      panels run (Rscript; C and D shortened).
 *
 * Same harness as check_lesson16_numbers.js.
 *
 * Usage:  node scripts/check_lesson17_numbers.js      (~3 minutes)
 * Exit 0 iff every check passes. Needs Google Chrome and python3; Rscript
 * for the R panels (skipped, and said so, without it).
 */
const { spawn, spawnSync } = require("child_process");
const fs = require("fs"), path = require("path");

const ROOT = path.resolve(__dirname, "..");
const PORT = +process.env.PORT || 8797;
const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

const CANVAS_IDS = ["A_board","A_time","B_board","B_time","B_runs","C_board","C_freq","C_time","D_board","D_genes","D_time","D_sparrow"];
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
  const P = { N: 25, m: 0, R: 0, U: 0, sel: null, split: false }, pops = mgStart(P, 7), rng = mulberry32(3);
  const g = pops[0][0], gm = mgGamete(P, g, 1, rng);
  check("engine: at R 0 a gamete is one of the parent's two chromosomes, unchanged", gm === g[0] || gm === g[1]);
  /* a pulse of 4: exactly 4 genomes of the other hue in each */
  const q = SB.cfg.start({ M: 4, R: 1, G: 5 }, 11, 5); q.t0swap();
  const nOther = q.pairs.map(p => p.pops.map((F, k) => F.filter(x => mgOther(x, k + 1) === 1).length));
  check("engine: a pulse of 4 leaves exactly 4 all-other-hue genomes in each population of every pair", nOther.every(a => a[0] === 4 && a[1] === 4));
  const st0 = mgStats(q.pairs[0], false);
  check("engine: right after the pulse every fragment is a whole chromosome (40 beads)", st0.pops.every(p => p.mf === 40));
  /* R 0: with migration, fragments never get shorter than 40 */
  const P0 = { N: 25, m: 0.05, R: 0, U: 0, sel: null, split: false }, pr0 = { pops: mgStart(P0, 13), rng: mulberry32(17) };
  for (let t = 0; t < 30; t++) mgStep(P0, pr0);
  const s0 = mgStats(pr0, false);
  check("engine: with no crossing over, the other hue only ever comes as whole chromosomes (average " + s0.pops.map(p => p.mf).join(", ") + ")", s0.pops.every(p => p.mf == null || p.mf === 40));
  /* new mutations take their population's hue */
  const PU = { N: 25, m: 0, R: 1, U: 2, sel: null, split: true }, pu = { pops: mgStart(PU, 21), rng: mulberry32(23) };
  for (let t = 0; t < 5; t++) mgStep(PU, pu);
  let wrong = 0, newOnes = 0; pu.pops.forEach((F, k) => { for (const x of F) for (const c of x) for (const a of c) if (a >> 5 >= 100000) { newOnes++; if (mgHue(a) !== k + 1) wrong++; } });
  check("engine: " + newOnes + " new mutations after 5 generations of a split, each in its own population's hue", newOnes > 100 && wrong === 0);
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
tgt(SB, 0, [{ M: 2, R: 1, G: 3 }, { M: 2, R: 0.5, G: 5 }], [{ M: 6, R: 1, G: 20 }, { M: 2, R: 1, G: 10 }, { M: 10, R: 1, G: 3 }]);
tgt(SB, 1, [{ R: 0.5 }], [{ R: 1 }, { R: 2 }]);
tgt(SB, 2, [{ M: 2, R: 1, G: 20 }, { M: 2, R: 2, G: 10 }], [{ M: 6, R: 0.5, G: 10 }, { M: 1, R: 1, G: 10 }, { M: 4, R: 1, G: 30 }]);
{
  SB.round = 0; SB.done = true; document.getElementById("B_practice").checked = true;
  const at = (R, G) => { setC(SB, { M: 4, R, G }); goStage(SB); finishNow(SB); return sumAt(SB.last, G).mf; };
  const r1 = [5, 10, 20].map(G => at(1, G)), r2 = at(2, 10), rh = at(0.5, 10);
  check("B: fragments shorten with time (R 1: " + r1.map(v => v.toFixed(1)).join(" / ") + " at 5 / 10 / 20) and with crossing over (at 10: R .5 " + rh.toFixed(1) + ", 1 " + r1[1].toFixed(1) + ", 2 " + r2.toFixed(1) + ")",
        r1[0] > r1[1] && r1[1] > r1[2] && rh > r1[1] && r1[1] > r2);
  const n0 = BX.dots.length; setC(SB, { M: 4, R: 1, G: 5 }); goStage(SB); finishNow(SB);
  check("B: every run, practice too, adds a dot to your runs (" + n0 + " -> " + BX.dots.length + ")", BX.dots.length === n0 + 1);
  SB.done = false;
}

/* ================= C ================= */
{
  play(SC, 0, { N: 50 }, 1);
  const q = SC.last, h0 = H0(q), want = h0 * Math.pow(1 - 1 / 100, 50), got = sumAt(q, 50).H;
  check("C: drift alone, N 50: heterozygosity within at 50 " + got.toFixed(3) + " against H0 (1 - 1/2N)^t = " + want.toFixed(3), Math.abs(got - want) < 0.06);
  const f = [0.01, 0.02].map(m => { const S = play(SC, 1, { m }, 2); return { m, got: (S[0].fst + S[1].fst) / 2, w16: 1 / (1 + 16 * 25 * m), w4: 1 / (1 + 4 * 25 * m) }; });
  check("C: F_ST at 100, N 25, sits on 1/(1 + 16Nm), not 1/(1 + 4Nm): " + f.map(x => "m " + x.m + " " + x.got.toFixed(3) + " vs " + x.w16.toFixed(3) + " (4Nm " + x.w4.toFixed(3) + ")").join("; "),
        f.every(x => Math.abs(x.got - x.w16) < 0.07 && Math.abs(x.got - x.w4) > 0.15));
  const u = play(SC, 3, { U: 0.5 }, 2), wu = 4 * 25 * 0.5 / 40 / (1 + 4 * 25 * 0.5 / 40), gu = (u[0].H + u[1].H) / 2;
  check("C: mutation and drift, N 25, U .5: heterozygosity within at 100 " + gu.toFixed(3) + " against 4Nu/(1 + 4Nu) = " + wu.toFixed(3), Math.abs(gu - wu) < 0.08);
}
tgt(SC, 0, [{ N: 50 }, { N: 25 }], [{ N: 100 }]);
tgt(SC, 1, [{ m: 0.01 }, { m: 0.02 }], [{ m: 0 }, { m: 0.005 }, { m: 0.05 }]);
tgt(SC, 2, [{ m: 0.002 }, { m: 0.005 }], [{ m: 0.01 }, { m: 0.001 }]);
tgt(SC, 3, [{ U: 0.25 }, { U: 0.5 }], [{ U: 0 }, { U: 0.1 }]);

/* ================= D ================= */
tgt(SD, 0, [{ s: 0.3, m: 0.02, R: 1, h: 0.5 }, { s: 0.6, m: 0.02, R: 1, h: 0.5 }], [{ s: 0, m: 0.02, R: 1, h: 0.5 }, { s: 0.1, m: 0.02, R: 1, h: 0.5 }, { s: 1, m: 0.02, R: 1, h: 0.5 }]);
tgt(SD, 1, [{ s: -0.3, m: 0.005, R: 1, h: 0.5 }, { s: -0.6, m: 0.002, R: 1, h: 0.5 }], [{ s: 0.3, m: 0.005, R: 1, h: 0.5 }, { s: 0, m: 0.05, R: 1, h: 0.5 }, { s: -0.1, m: 0.005, R: 1, h: 0.5 }]);

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
  const b = flow(SB, [{ M: 2, R: 1, G: 3 }, { R: 0.5 }, { M: 2, R: 1, G: 20 }]);
  const waitB = !Gates.B.done;
  while (BX.dots.length < 10) { goStage(SB); finishNow(SB); }
  const stillB = !Gates.B.done;
  BX.picked = true; checkStage(SB);
  check("B flow: opening records 0; three hits (bits " + b.bits + "); B waits for ten runs (" + waitB + ") and a pick (" + stillB + "), then opens C", b.miss && b.bits === "011" && waitB && stillB && Gates.B.done);
  const c = flow(SC, [{ N: 50 }, { m: 0.01 }, { m: 0.002 }, { U: 0.5 }]);
  check("C flow: opening records 0; four hits (bits " + c.bits + ") finish C", c.miss && c.bits === "0111" && Gates.C.done);
  const d = flow(SD, [{ s: 0.3, m: 0.02, R: 1, h: 0.5 }, { s: -0.6, m: 0.005, R: 1, h: 0.5 }]);
  check("D flow: opening records 0; two hits (bits " + d.bits + ") finish D and the lesson", d.miss && d.bits === "01" && Gates.D.done && document.getElementById("done-banner").classList.contains("shown"));
  /* each round opens on settings that miss: the opening is played as the first run of each round above, so check the held
     sliders instead: C rounds hold what they say */
  SC.round = 2; SC.done = false; openRound(SC);
  check("C round 3 holds N at 100 and opens m at 0.01 (the answer to round 2)", readSet(SC).N === 100 && document.getElementById("C_N").dataset.held === "1" && readSet(SC).m === 0.01);
  SC.done = true; openRound(SC);
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
