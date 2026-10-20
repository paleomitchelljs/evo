#!/usr/bin/env node
/*
 * check_lesson21_numbers.js -- the checks for app/lessons/lesson21.html.
 *
 * Lesson 21, first draft (2026-10-20, JM's brief for 19-21): species
 * selection. A clade of species; a disperser allele helps its fish (its
 * share rises inside every species) and rejoins cut-off pieces before they
 * become species (19 A's floods), so species with few dispersers leave more
 * species. The clade's change taken apart three ways (Price's equation,
 * species as the units). Two targets on 16 clades' averages, one drawn
 * round. What has to hold:
 *
 *   Engine. The three parts add up to the clade's change exactly, every
 *      interval, every clade; a disperser's advantage raises its share as
 *      1 + s says (averaged over many draws); dispersers that always cross
 *      rejoin every piece (no new species) and dispersers that never cross
 *      make a species of every piece exactly 40 generations after its cut;
 *      the clade's last species is never lost; species are lost at about
 *      0.002 a generation whatever they carry.
 *   Rounds. Each target hit by its intended setting and missed by its
 *      opening; the drawn round scores dots inside the 16 clades' cloud,
 *      a flat line far off misses and the clades' own average hits.
 *   Flow. A miss records 0 and the round stays; Next after a hit; drawing
 *      by dragging across the plot, Go held until every dot is set, Clear
 *      takes it away; the third round ends the lesson; three bits written.
 *   Sister clades. New species that started with fewer dispersers than
 *      their parents end with more species on their side than those that
 *      started with more.
 *   Layout. R code last and closed; hover marks with words; every canvas
 *      fits (1500 and 1000 wide); the R panel runs (shortened).
 *
 * Usage:  node scripts/check_lesson21_numbers.js      (~1 minute)
 */
const { spawn, spawnSync } = require("child_process");
const fs = require("fs"), path = require("path");
const ROOT = path.resolve(__dirname, "..");
const PORT = +process.env.PORT || 8797;
const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const CANVAS_IDS = ["A_tree", "A_time", "A_price", "A_runs", "A_sis"];

const INNER = `
const L_=[], say=s=>L_.push(s);
let bad=0, ran=0;
const check=(name, ok, detail)=>{ ran++; if(!ok) bad++; say((ok?"ok   ":"FAIL ")+name+(detail?"  -- "+detail:"")); };
document.getElementById("stageA").classList.remove("stage-locked"); Gates.A.open = true;
const setC = o => { for (const k in o) { const c = CTL.find(c => c.key === k), i = c.vals.indexOf(o[k]); if (i < 0) throw new Error("no " + k + " = " + o[k]); document.getElementById("A_" + k).value = i; } syncVals(); };
const grow = (P, seed, n) => { const c = clWorld(P, seed); for (let t = 0; t < (n || G); t++) clStep(c); return c; };

/* ================= the engine ================= */
{
  let worst = 0, k = 0;
  for (let i = 0; i < 6; i++) { const c = grow({ s: [0, 0.005, 0.02][i % 3], d: [0.02, 0.1][i % 2] }, 40 + i);
    for (let j = 1; j < c.cum.length; j++) { const a = c.cum[j], b = c.cum[j - 1]; worst = Math.max(worst, Math.abs((a.sel - b.sel) + (a.inside - b.inside) + (a.splits - b.splits) - (a.total - b.total))); k++; } }
  check("engine: between + inside + at the splits = the clade's change, every interval of six clades (" + k + " intervals, worst gap " + worst.toExponential(1) + ")", worst < 1e-12 && k > 100);
  const rng = mulberry32(3); let sum = 0; const n = 20000, s = 0.02, p = 0.3;
  for (let i = 0; i < n; i++) sum += clBreed(p, N_SP, s, rng);
  const want = (p * (1 + s) / (1 + s * p)) * (1 - MU) + (1 - p * (1 + s) / (1 + s * p)) * MU;
  check("engine: a disperser's advantage of 0.02 takes a share of 0.3 to " + (sum / n).toFixed(4) + " on average (1 + s says " + want.toFixed(4) + ")", Math.abs(sum / n - want) < 0.001);
  /* pieces: always rejoined when dispersers always cross; a species exactly TAU after the cut when they never do */
  const always = grow({ s: 0, d: 1e9 }, 5, 400), never = clWorld({ s: 0, d: 0 }, 6); let gaps = [];
  const watch = new Map(); for (let t = 0; t < 400; t++) { for (const sp of clLiving(never)) if (sp.piece && !watch.has(sp.id + ":" + sp.piece.age)) {} 
    const before = clLiving(never).filter(sp => sp.piece && sp.piece.age === 0).map(sp => [sp.id, never.t + 1]); clStep(never);
    for (const [id, t1] of before) { const sp = never.sp.find(x => x.id === id); if (sp.piece && sp.piece.age === 1) watch.set(id + "@" + t1, t1); } }
  for (const sp of never.sp) if (sp.parent >= 0) { const cuts = [...watch.entries()].filter(([k]) => +k.split("@")[0] === sp.parent).map(([, t]) => t).filter(t => t <= sp.born); if (cuts.length) gaps.push(sp.born - Math.max(...cuts)); }
  const okGaps = gaps.length > 5 && gaps.every(g => g === TAU - 1 || g === TAU);
  check("engine: dispersers that always cross make no species in 400 generations (" + always.sp.length + " ever); never crossing, every piece is a species " + TAU + " generations after it was cut (" + gaps.length + " species, gaps " + [...new Set(gaps)].join(",") + ")",
        always.sp.length === 1 && okGaps);
  let lostOne = 0, gens = 0, deaths = 0;
  for (let i = 0; i < 4; i++) { const c = grow({ s: 0.005, d: 0.05 }, 70 + i); if (c.nLiving >= 1) lostOne++;
    for (const sp of c.sp) { const end = sp.died == null ? c.t : sp.died; gens += end - sp.born; if (sp.died != null) deaths++; } }
  check("engine: the clade's last species is never lost (" + lostOne + " of 4 clades living at 1000); species are lost at " + (deaths / gens).toFixed(4) + " a generation (" + E_LOSS + " set)", lostOne === 4 && Math.abs(deaths / gens - E_LOSS) < 0.0006);
}

/* ================= the rounds ================= */
const play = (r, o) => { AX.round = r; AX.done = false; AX.waiting = false; document.getElementById("A_practice").checked = true; openRound(); setC(o); goRun(); finishNow(); return AX.last; };
const T = (r, good, badOnes) => { const R = ROUNDS[r], res = (o, want) => { const q = play(r, o), each = R.rules.map(u => u.ok(q.S)), ok = each.every(Boolean); return [o, ok === want, R.rules.map(u => u.val(q.S)).join("/")]; };
  const g = good.map(o => res(o, true)), b = badOnes.map(o => res(o, false));
  check("round " + (r + 1) + ": hit by " + g.map(x => JSON.stringify(x[0]).replace(/"/g, "") + " (" + x[2] + ")").join(", ") + "; missed by " + b.map(x => JSON.stringify(x[0]).replace(/"/g, "") + " (" + x[2] + ")").join(", "),
        g.every(x => x[1]) && b.every(x => x[1])); };
T(0, [{ s: 0.005 }, { s: 0.002 }], [{ s: 0.02 }]);
T(1, [{ d: 0.05 }, { d: 0.02 }], [{ d: 0.5 }]);
{
  /* the drawn round: the clades' own average inside its cloud; a flat line at 0.9 not */
  const q = play(2, { s: 0.002, d: 0.05 }), avg = KNOTS.map(t => q.clades.reduce((a, c) => a + (c.hist.find(h => h.t === t) || c.hist[c.hist.length - 1]).z, 0) / q.clades.length);
  const own = insideOf(q, { ys: avg }), flat = insideOf(q, { ys: KNOTS.map(() => 0.9) }), none = insideOf(q, { ys: KNOTS.map(() => P0) });
  check("round 3: the 16 clades' own average sits inside their cloud (" + own.k + " of " + own.n + "); 'no change' (flat at the start) mostly does not (" + none.k + " of " + none.n + "), a flat line at 0.9 not at all (" + flat.k + ")",
        own.k === own.n && none.k <= 5 && flat.k === 0);
}
{
  const q = play(0, { s: 0.005 }), cols = sisterCols(q);
  check("sister clades: new species that started with fewer dispersers end with more species on their side (" + cols.map(c => c.name + " " + (c.mean == null ? "-" : c.mean.toFixed(2)) + " of " + c.ys.length).join(", ") + ")",
        cols[0].mean != null && cols[2].mean != null && cols[0].mean > cols[2].mean && cols[0].mean > 0);
}

/* ================= the flow ================= */
{
  AX.round = 0; AX.done = false; AX.waiting = false; AX.results = []; AX.last = null; AX.pred = null; AX.dots = [];
  const prac = document.getElementById("A_practice"); prac.checked = false; openRound(); paint();
  const go = () => { document.getElementById("A_go").click(); finishNow(); }, next = () => document.getElementById("A_next").click();
  const held1 = document.getElementById("A_d").disabled && !document.getElementById("A_s").disabled;
  go(); const miss = Score.getBit("scaffold", BIT.A1) === 0 && !AX.waiting;
  setC({ s: 0.002 }); go(); const hit = AX.waiting; next();
  setC({ d: 0.05 }); go(); const hit2 = AX.waiting; next();
  /* round 3: Go held until a drawing; one drag sets every dot; Clear; drag again; Go */
  const goHeld = document.getElementById("A_go").disabled;
  const cv = document.getElementById("A_time"), r = cv.getBoundingClientRect(), k = r.width / TM.W;
  const at = (t, v) => ({ clientX: r.left + (TM.px + t / G * TM.pw) * k, clientY: r.top + (TM.py + TM.ph - v * TM.ph) * k, pointerId: 1, bubbles: true });
  const drag = v => { cv.dispatchEvent(new PointerEvent("pointerdown", at(0, 0.5))); cv.dispatchEvent(new PointerEvent("pointermove", at(500, v))); cv.dispatchEvent(new PointerEvent("pointermove", at(1000, v))); cv.dispatchEvent(new PointerEvent("pointerup", at(1000, v))); };
  drag(0.3); const full = predFull(), free = !document.getElementById("A_go").disabled;
  document.getElementById("A_clear").click(); const cleared = !AX.pred && document.getElementById("A_go").disabled;
  drag(0.3); go();
  const note = Score.getNote ? Score.getNote("A_in3") : null, bits = Object.keys(BIT).map(k => Score.getBit("scaffold", BIT[k])).join("");
  next();
  check("flow: round 1 holds how far and frees the advantage (" + held1 + "); a miss records 0 and the round stays (" + miss + "); hits open Next (" + hit + ", " + hit2 + ")", held1 && miss && hit && hit2);
  check("flow: round 3 holds Go for a drawing (" + goHeld + "); one drag sets all " + KNOTS.length + " dots (" + full + ") and frees Go (" + free + "); Clear takes it away (" + cleared + "); scored " + note + "; bits " + bits + "; the lesson ends",
        goHeld && full && free && cleared && /^\\d+of11$/.test(note || "") && bits.startsWith("01") && bits.length === 3 && Gates.A.done && document.getElementById("done-banner").classList.contains("shown"));
  let n = 0; for (let i = 0; i < 3; i++) if (Score.isAnswered("scaffold", i)) n++;
  check("all 3 declared bits written", n === 3, n + " written");
}
{
  const infos = [...document.querySelectorAll(".info")], tipOf = e => e.dataset.tip ? document.getElementById(e.dataset.tip) : e.querySelector(".tip");
  const empty = infos.filter(e => !tipOf(e) || !tipOf(e).textContent.trim()).length;
  check("hover text: " + infos.length + " marks, " + empty + " empty", infos.length >= 6 && empty === 0);
  FIT_EPOCH++; paint();
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
document.getElementById("stageA").classList.remove("stage-locked");
FIT_EPOCH++; paint();
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
  const r = spawnSync(CHROME, ["--headless=new", "--disable-gpu", "--virtual-time-budget=4000000", "--dump-dom", `http://127.0.0.1:${PORT}/_check_l21_${PORT}.html`], { encoding: "utf8", maxBuffer: 1 << 28 });
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
  else { const src = (lines.find(l => l.startsWith("RA ")) || "").slice(3).replace(/\\n/g, "\n"), fixed = src.replace("G <- 1000", "G <- 200");
    const o = spawnSync("Rscript", ["-e", fixed + "\ncat('\\nOK\\n')"], { encoding: "utf8", timeout: 240000 }), ok = /OK/.test(o.stdout || "");
    console.log((ok ? "ok   " : "FAIL ") + "the R panel runs (200 generations)" + (ok ? "  -- " + (o.stdout || "").trim().split("\n").slice(-4, -1).join(" ").replace(/\s+/g, " ") : "  -- " + (o.stderr || "").slice(0, 300)));
    if (!ok) bad = true; }
  cleanup(); process.exit(bad ? 1 : 0);
}, 700);
