#!/usr/bin/env node
/*
 * check_lesson23_numbers.js -- the checks for app/lessons/lesson23.html.
 *
 * Lesson 23, draft 1 (2026-11-07): species selection on a clade of
 * species (lesson 21's first draft's engine). A choosiness: a cost to the
 * bird, species that split; B dispersal: good for the bird, fewer
 * species; C splitting against loss. What has to hold:
 *
 *   Engine. The binomial draws; a cut-off piece rejoins as each rule says
 *      (A: meets 1 in 20, mates across with chance exp(-S a gap^2); B:
 *      d x its share of dispersers); a species lost with chance
 *      E0 x (1 - prot x p); the clade's change taken apart three ways adds
 *      up exactly, and to the clade's share since generation 0.
 *   Rounds. Each target hit by its intended setting, missed by its
 *      opening; A2 and B1 show the two levels pulling apart.
 *   Flow. Held and free arrows; a miss records 0; Next after a hit; five
 *      bits written; the lesson ends.
 *   Layout. Hover marks with words; every canvas fits (1500 and 1000
 *      wide); each stage's R code last and closed; the three R panels run
 *      (shortened to 3 generations).
 *
 * Usage:  node scripts/check_lesson23_numbers.js      (~1 minute)
 */
const { spawn, spawnSync } = require("child_process");
const fs = require("fs"), path = require("path");
const ROOT = path.resolve(__dirname, "..");
const PORT = +process.env.PORT || 8797;
const CHROME = process.env.CHROME || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const CANVAS_IDS = ["A_tree", "A_time", "A_split", "A_tpic", "B_tree", "B_time", "B_split", "B_tpic", "C_tree", "C_time", "C_split", "C_tpic"];

const INNER = `
const L_=[], say=s=>L_.push(s);
let bad=0, ran=0;
const check=(name, ok, detail)=>{ ran++; if(!ok) bad++; say((ok?"ok   ":"FAIL ")+name+(detail?"  -- "+detail:"")); };
for (const k in Gates) { Gates[k].open = true; document.getElementById("stage" + k).classList.remove("stage-locked"); }
const CP = P => Object.assign({ mode: "disp", s: 0, S: 0, d: 0, E0: 0, prot: 0, p0: 1 }, P);
/* ================= the engine ================= */
{
  const r = mulberry32(5); let m = 0, v = 0, m9 = 0; for (let i = 0; i < 20000; i++) { const k = clBinom(200, 0.3, r); m += k; v += k * k; m9 += clBinom(10, 0.9, r); }
  m /= 20000; v = v / 20000 - m * m; m9 /= 20000;
  check("engine: binomial draws, 200 at .3: mean " + m.toFixed(2) + " (60), variance " + v.toFixed(1) + " (42); 10 at .9: mean " + m9.toFixed(3) + " (9)", Math.abs(m - 60) < 0.3 && Math.abs(v - 42) < 2 && Math.abs(m9 - 9) < 0.03);
  /* a piece of all-choosy birds, its colour 1 from its species': rejoins 1 in 20 x exp(-S gap^2) a generation */
  const rejoin = (P, piece, n) => { let k = 0; for (let i = 0; i < n; i++) { const c = clWorld(CP(P), 1000 + i); c.sp[0].piece = Object.assign({ age: 0 }, piece); clStep(c); if (!c.sp[0].piece && c.sp.length === 1) k++; } return k / n; };
  const r1 = rejoin({ mode: "choose", S: 1 }, { p: 1, col: 1 }, 40000), r0 = rejoin({ mode: "choose", S: 0 }, { p: 1, col: 1 }, 20000), rd = rejoin({ mode: "disp", d: 0.5 }, { p: 1, col: 0 }, 20000);
  check("engine: a cut-off piece rejoins: choosy, strength 1, gap 1: " + r1.toFixed(4) + " (1/20 x e^-1 = .0184); strength 0: " + r0.toFixed(3) + " (.05); dispersers, how far .5: " + rd.toFixed(3) + " (.5)",
        Math.abs(r1 - 0.0184) < 0.002 && Math.abs(r0 - 0.05) < 0.005 && Math.abs(rd - 0.5) < 0.012);
  /* losses: E0 .2, prot 1, a species a quarter dispersers (two living, so the last-species rule never applies) */
  { let k = 0; const n = 20000; for (let i = 0; i < n; i++) { const c = clWorld(CP({ E0: 0.2, prot: 1, p0: 0.25 }), 3000 + i); c.sp.push(Object.assign({}, c.sp[0], { id: 99, h: [] })); c.nLiving = 2; clStep(c); if (c.sp[0].died != null) k++; }
    check("engine: a species a quarter dispersers, losses .2, lost " + (k / n).toFixed(4) + " a generation (.2 x 3/4 = .15)", Math.abs(k / n - 0.15) < 0.007); }
  /* the change taken apart, exact */
  { let worst = 0, tot = 0; for (const P of [{ mode: "choose", s: -0.005, S: 30, E0: 0.002, p0: 0.5 }, { mode: "disp", s: 0.005, d: 0.05, E0: 0.01, prot: 1, p0: 0.5 }]) for (let i = 0; i < 3; i++) {
      const c = clWorld(CP(P), 77 + i); for (let t = 0; t < 1000; t++) clStep(c); const st = clStat(c);
      worst = Math.max(worst, Math.abs(st.sel + st.inside + st.splits - st.total)); tot = Math.max(tot, Math.abs(st.total - (st.z - 0.5))); }
    check("engine: between + inside + at the splits = the change (worst " + worst.toExponential(1) + "), and the change = the clade's share at 1000 minus .5 (" + tot.toExponential(1) + ")", worst < 1e-12 && tot < 1e-12); }
}
/* ================= the rounds ================= */
const STG = { A: SA, B: SB, C: SC };
const setC = (S, o) => { for (const k in o) { const c = S.cfg.ctl.find(c => c.key === k), i = c.vals.indexOf(o[k]); if (i < 0) throw new Error("no " + k + " = " + o[k]); const el = document.getElementById(S.K + "_" + k); el.value = i + (+el.min || 0); el.dispatchEvent(new Event("input")); } };
const play = (K, r, o) => { const S = STG[K]; S.round = r; S.done = false; S.waiting = false; S.run = null; const pr = document.getElementById(K + "_practice"); if (pr) pr.checked = true;
  openRound(S); for (const c of S.cfg.ctl) document.getElementById(K + "_" + c.key).dataset.held = ""; setC(S, o); goStage(S); finishNow(S); return S.last; };
const T = (K, r, good, badOnes) => { const S = STG[K], R = S.cfg.rounds[r];
  const res = (o, want) => { const q = play(K, r, o), e = sumAt(q, q.G), j = judge(R, e); return [o, j.ok === want, j.vals.join("/")]; };
  const g = good.map(o => res(o, true)), b = badOnes.map(o => res(o, false));
  const js = o => JSON.stringify(o, (k, v) => typeof v === "number" ? +v.toFixed(3) : v).replace(/"/g, "");
  check(K + (r + 1) + ": hit by " + g.map(x => js(x[0]) + " (" + x[2] + ")").join(", ") + "; missed by " + b.map(x => js(x[0]) + " (" + x[2] + ")").join(", "),
        g.every(x => x[1]) && b.every(x => x[1])); };
T("A", 0, [{ S: 30 }, { S: 100 }], [{ S: 0 }]);
T("A", 1, [{ k: 0.02 }], [{ k: 0.005 }, { k: 0 }]);
T("B", 0, [{ s: 0.005 }, { s: 0.002 }], [{ s: 0.02 }]);
T("B", 1, [{ d: 0.05 }], [{ d: 0.5 }]);
T("C", 0, [{ e: 0.01 }, { e: 0.02 }], [{ e: 0.002 }]);
{ const q = play("A", 1, { k: 0.02 }), e = sumAt(q, q.G);
  check("A2 at cost .02: between species " + f2(e.sel) + " (positive: choosy species split more), inside " + f2(e.inside) + " (negative), the clade's share " + f2(e.z) + " (fell)", e.sel > 0 && e.inside < 0 && e.z < 0.5); }
{ const q = play("B", 0, { s: 0.005 }), e = sumAt(q, q.G);
  check("B1 at advantage .005: inside species " + f2(e.inside) + " (positive), between " + f2(e.sel) + " (negative), the clade's share " + f2(e.z) + " (fell)", e.inside > 0 && e.sel < 0 && e.z < 0.5); }
/* ================= the flow ================= */
{
  for (const S of STAGES) { S.round = 0; S.done = false; S.waiting = false; S.results = []; S.last = null; const pr = document.getElementById(S.K + "_practice"); if (pr) pr.checked = false; openRound(S); }
  for (const k in Gates) Gates[k].done = false; paintAll();
  const go = S => { document.getElementById(S.K + "_go").click(); finishNow(S); }, next = S => document.getElementById(S.K + "_next").click();
  const cls = (K, id) => (document.querySelector("#" + K + '_paths [data-of="' + id + '"]') || { classList: { contains: () => false } }).classList;
  const a1 = cls("A", "S").contains("settable") && cls("A", "k").contains("locked") && readSet(SA).S === 0;
  go(SA); const miss = Score.getBit("scaffold", BIT.A1) === 0 && !SA.waiting;
  setC(SA, { S: 30 }); go(SA); const hit = SA.waiting; next(SA);
  const a2 = cls("A", "k").contains("settable") && cls("A", "S").contains("locked") && readSet(SA).k === 0.005;
  setC(SA, { k: 0.02 }); go(SA);
  check("flow: A1 frees the strength at 0, the cost held (" + a1 + "); a miss records 0 and stays (" + miss + "); strength 30 hits (" + hit + "); A2 frees the cost at .005 (" + a2 + "); two hits finish A (" + Gates.A.done + ")", a1 && miss && hit && a2 && Gates.A.done);
  const b1 = cls("B", "s").contains("settable") && cls("B", "d").contains("locked") && readSet(SB).s === 0.02;
  setC(SB, { s: 0.005 }); go(SB); next(SB); setC(SB, { d: 0.05 }); go(SB);
  check("flow: B1 frees the advantage at .02, how far held (" + b1 + "); two hits finish B (" + Gates.B.done + ")", b1 && Gates.B.done);
  const c1 = cls("C", "e").contains("settable") && cls("C", "s").contains("locked") && cls("C", "d").contains("locked") && readSet(SC).e === 0.002;
  setC(SC, { e: 0.01 }); go(SC);
  check("flow: C1 frees the losses at 1 in 500, the rest held (" + c1 + "); a hit finishes C (" + Gates.C.done + ")", c1 && Gates.C.done);
  let n = 0; for (let i = 0; i < 5; i++) if (Score.isAnswered("scaffold", i)) n++;
  const bits = Object.keys(BIT).map(k => Score.getBit("scaffold", BIT[k])).join("");
  check("all 5 declared bits written (" + n + "; bits " + bits + "); the lesson ends", n === 5 && bits.startsWith("0") && Gates.C.done && document.getElementById("done-banner").classList.contains("shown"));
}
{
  const infos = [...document.querySelectorAll(".info")], tipOf = e => e.dataset.tip ? document.getElementById(e.dataset.tip) : e.querySelector(".tip");
  const empty = infos.filter(e => !tipOf(e) || !tipOf(e).textContent.trim()).length;
  { const off = []; for (const S of STAGES) for (const c of S.cfg.ctl) { const el = document.getElementById(S.K + "_" + c.key); if (+el.max - +el.min + 1 !== c.vals.length) off.push(S.K + "_" + c.key + " " + (+el.max - +el.min + 1) + "/" + c.vals.length); }
    check("every control's positions match its values (" + off.length + " off)", off.length === 0, off.join(", ")); }
  check("hover text: " + infos.length + " marks, " + empty + " empty", infos.length >= 12 && empty === 0);
  FIT_EPOCH++; paintAll();
  const over = []; for (const id of ${JSON.stringify(CANVAS_IDS)}) { const cv = document.getElementById(id), host = cv.parentElement; if (+cv.dataset.drawW > host.clientWidth + 1) over.push(id + " " + cv.dataset.drawW + ">" + host.clientWidth); }
  check("every canvas fits its panel (" + window.innerWidth + " wide)", over.length === 0, over.join(", "));
  const lastOk = ["A", "B", "C"].every(K => { const els = document.querySelectorAll("#stage" + K + " .panel"), last = els[els.length - 1]; return last.matches("details.rcode") && !last.open; });
  check("layout: each stage's R code last and closed; no readout lines", lastOk && document.querySelectorAll(".readout").length === 0);
}
for (const S of STAGES) S.cfg.paint();
say(bad ? ("FAILED " + bad) : "ALL BARS PASS");
say("RAN " + ran);
for (const K of ["A", "B", "C"]) say("R" + K + " " + RTEXT["code" + K].replace(/\\n/g, "\\\\n"));
L_.join(" ;; ");
`;
const INNER_NARROW = `
for (const k in Gates) document.getElementById("stage" + k).classList.remove("stage-locked");
FIT_EPOCH++; paintAll();
const over = []; for (const id of ${JSON.stringify(CANVAS_IDS)}) { const cv = document.getElementById(id), host = cv.parentElement; if (+cv.dataset.drawW > host.clientWidth + 1) over.push(id + " " + cv.dataset.drawW + ">" + host.clientWidth); }
(over.length ? "FAIL " : "ok   ") + "every canvas fits its panel (" + window.innerWidth + " wide)" + (over.length ? "  -- " + over.join(", ") : "");
`;
const probe = `<!doctype html><meta charset="utf-8"><title>pending</title>
<iframe id="f" src="http://127.0.0.1:${PORT}/app/lessons/lesson23.html?preview=1" width="1500" height="1000"></iframe>
<iframe id="g" src="http://127.0.0.1:${PORT}/app/lessons/lesson23.html?preview=1" width="1000" height="900"></iframe>
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
const probePath = path.join(ROOT, "_check_l23_" + PORT + ".html");
fs.writeFileSync(probePath, probe);
const server = spawn("python3", ["-m", "http.server", String(PORT), "--directory", ROOT], { stdio: "ignore", detached: true });
const cleanup = () => { try { process.kill(-server.pid); } catch (e) {} try { fs.unlinkSync(probePath); } catch (e) {} };
process.on("exit", cleanup);
setTimeout(() => {
  const r = spawnSync(CHROME, ["--headless=new", "--disable-gpu", "--virtual-time-budget=6000000", "--dump-dom", `http://127.0.0.1:${PORT}/_check_l23_${PORT}.html`], { encoding: "utf8", maxBuffer: 1 << 28 });
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
  else for (const K of ["A", "B", "C"]) {
    const src = (lines.find(l => l.startsWith("R" + K + " ")) || "").slice(3).replace(/\\n/g, "\n"), fixed = src.replace(/G <- \d+/, "G <- " + (process.env.R_G || 3));
    const o = spawnSync("Rscript", ["-e", fixed + "\ncat('\\nOK\\n')"], { encoding: "utf8", timeout: 240000 }), ok = /OK/.test(o.stdout || "");
    console.log((ok ? "ok   " : "FAIL ") + "the R panel of stage " + K + " runs (3 generations)" + (ok ? "  -- " + (o.stdout || "").trim().split("\n").slice(-3, -1).join(" ").replace(/\s+/g, " ") : "  -- " + (o.stderr || "").trim().split("\n").slice(-3).join(" ")));
    if (!ok) bad = true;
  }
  cleanup(); process.exit(bad ? 1 : 0);
}, 700);
