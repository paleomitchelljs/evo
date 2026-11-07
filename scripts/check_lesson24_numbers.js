#!/usr/bin/env node
/*
 * check_lesson24_numbers.js -- the checks for app/lessons/lesson24.html.
 *
 * Lesson 24, draft 1 (2026-11-07): evo-devo, a gene network builds a limb.
 * A switches; B a clock and a growing body; C where a limb goes; D a bud
 * that grows and stops itself; E the skeleton. What has to hold:
 *
 *   Engine. A's rule (on when something on turns it on, nothing on turns
 *      it off) gives each target from its wiring, and a loop that shuts
 *      itself off flickers; B's blocks follow the delay (the period) and
 *      the growth time; C's rules place the limbs, a bead makes an extra
 *      one, an early start loses the forelimb; D's bud stops by itself,
 *      its length set by Shh's reach and not by growth speed, cut short
 *      by the scalpel; E's 16 limbs give 1-2-5, three digits, seven.
 *   Rounds. Each target hit by its intended setting, missed by its
 *      opening.
 *   Flow. 14 bits written; the lesson ends.
 *   Layout. Hover marks; every canvas fits; R last and closed; the five
 *      R panels run (shortened).
 *
 * Usage:  node scripts/check_lesson24_numbers.js      (~2 minutes)
 */
const { spawn, spawnSync } = require("child_process");
const fs = require("fs"), path = require("path");
const ROOT = path.resolve(__dirname, "..");
const PORT = +process.env.PORT || 8796;
const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const CANVAS_IDS = ["A_cells", "A_tpic", "B_clock", "B_body", "B_tpic", "C_body", "C_tpic", "D_bud", "D_time", "D_tpic", "E_limb", "E_tally", "E_tpic"];

const INNER = `
const L_=[], say=s=>L_.push(s);
let bad=0, ran=0;
const check=(name, ok, detail)=>{ ran++; if(!ok) bad++; say((ok?"ok   ":"FAIL ")+name+(detail?"  -- "+detail:"")); };
for (const k in Gates) { Gates[k].open = true; document.getElementById("stage" + k).classList.remove("stage-locked"); }
/* ================= the engines ================= */
{
  const run = P => { const w = swWorld(Object.assign({ LX: 0, RX: 0, LY: 0, RY: 0, XY: 0, YX: 0 }, P)); for (let t = 0; t < A_STEPS; t++) swStep(w); return w; };
  const y = w => Array.from(w.Y).join("");
  const a1 = y(run({ LY: 1, RY: -1 })), a2 = y(run({ LX: 1, RX: -1, LY: 1, XY: -1 })), a3 = y(run({ LX: 1, YX: 1, XY: 1, pulse: true })), a3n = y(run({ LX: 1, XY: 1, pulse: true }));
  const fl = run({ LX: 1, XY: 1, YX: -1 }), seq = fl.hist.map(h => h.Y[0]).join("");
  check("A engine: Y on with L, off with R: " + a1 + "; X between (L on, R off), Y on with L, off with X: " + a2 + "; a pulse kept by X and Y turning each other on: " + a3 + " (without the loop " + a3n + "); Y turning X off flickers: " + seq,
        a1 === "111100000000" && a2 === "000011110000" && a3 === "111111110000" && a3n === "000000000000" && /0110/.test(seq) && /1001/.test(seq));
}
{
  const blk = (Tm, v, dur) => { const w = ckWorld({ Tm, v, dur }); for (let t = 0; t < Math.ceil((dur + CK.start) / 10); t++) ckStep(w); return ckStat(w).blocks; };
  const b = [20, 12, 6].map(T => blk(T, 0.5, 500)), b2 = blk(12, 0.2, 1500), b3 = blk(3, 0.5, 500);
  check("B engine: blocks in 500 minutes at delay 20 / 12 / 6: " + b.join(" / ") + " (more as the delay shortens: 7 / 11 / 15); 1,500 minutes at .2 a minute, delay 12: " + b2 + " (31); delay 3, the clock damps: " + b3,
        b[0] < b[1] && b[1] < b[2] && b[0] >= 6 && b[0] <= 8 && b[2] >= 14 && b[2] <= 16 && b2 >= 28 && b2 <= 34 && b3 < b[2]);
}
{
  const n = posLimbs({ shift: 0, bead: -1 }), l = posLimbs({ shift: 0, bead: 14 }), a = posLimbs({ shift: 0, bead: 12 }), py = posLimbs({ shift: 10, bead: -1 }), nk = posLimbs({ shift: 0, bead: 3 });
  const s = r => r.limbs.map(x => x.kind + "@" + (x.at + 1)).join(" ");
  check("C engine: the body's limbs: " + s(n) + "; a bead in block 15: " + s(l) + "; in block 13: " + s(a) + "; in the neck (block 4): " + s(nk) + " (nothing); Hox 10 blocks early: " + s(py) + " (no forelimb)",
        n.arms === 1 && n.legs === 1 && l.legs === 2 && a.arms === 2 && nk.arms === 1 && nk.legs === 1 && py.arms === 0 && py.legs === 1);
}
{
  const len = P => { const w = bdWorld(Object.assign({ lamS: 0.25, w: 20, g: 0.3, cut: null }, P)); for (let t = 0; t < 160; t++) bdStep(w); return bdStat(w); };
  const r = [0.1, 0.25, 0.4].map(s => len({ lamS: s })), f = len({ g: 0.6 }), c3 = len({ cut: 3 }), w80 = len({ w: 80 });
  check("D engine: the bud stops by itself; length (mm) by Shh's reach .1 / .25 / .4: " + r.map(x => x.len.toFixed(2)).join(" / ") + " (rising), stopping at hour " + r.map(x => x.hours.toFixed(1)).join(" / ") + "; growth doubled: " + f.len.toFixed(2) + " mm at hour " + f.hours.toFixed(1) + " (the same length, sooner); the ridge removed at hour 3: " + c3.len.toFixed(2) + "; Gremlin blocking BMP harder: " + w80.len.toFixed(2),
        r[0].len < r[1].len && r[1].len < r[2].len && r.every(x => x.ridge === 0) && Math.abs(f.len - r[1].len) < 0.05 && f.hours < r[1].hours * 0.6 && c3.len < 1.1 && w80.len > r[1].len);
}
/* ================= the rounds ================= */
const STG = { A: SA, B: SB, C: SC, D: SD, E: SE };
const setC = (S, o) => { for (const k in o) { const c = S.cfg.ctl.find(c => c.key === k), i = c.vals.indexOf(o[k]); if (i < 0) throw new Error("no " + k + " = " + o[k]); const el = document.getElementById(S.K + "_" + k); el.value = i + (+el.min || 0); el.dispatchEvent(new Event("input")); } };
const play = (K, r, o) => { const S = STG[K]; S.round = r; S.done = false; S.waiting = false; S.run = null; const pr = document.getElementById(K + "_practice"); if (pr) pr.checked = true;
  openRound(S); for (const c of S.cfg.ctl) document.getElementById(K + "_" + c.key).dataset.held = ""; setC(S, o); goStage(S); finishNow(S); return S.last; };
const T = (K, r, good, badOnes) => { const S = STG[K], R = S.cfg.rounds[r];
  const res = (o, want) => { const q = play(K, r, o), e = sumAt(q, q.G), j = judge(R, e); return [o, j.ok === want, j.vals.join("/")]; };
  const g = good.map(o => res(o, true)), b = badOnes.map(o => res(o, false));
  const js = o => JSON.stringify(o, (k, v) => typeof v === "number" ? +v.toFixed(3) : v).replace(/"/g, "");
  check(K + (r + 1) + ": hit by " + g.map(x => js(x[0]) + " (" + x[2] + ")").join(", ") + "; missed by " + b.map(x => js(x[0]) + " (" + x[2] + ")").join(", "),
        g.every(x => x[1]) && b.every(x => x[1])); };
T("A", 0, [{ LY: 1, RY: -1 }], [{}]);
T("A", 1, [{ LX: 1, RX: -1, LY: 1, XY: -1 }], [{}, { LY: 1, RY: 1 }]);
T("A", 2, [{ LX: 1, YX: 1, XY: 1 }], [{}, { LX: 1, XY: 1 }]);
T("B", 0, [{ T: 12 }], [{ T: 20 }]);
T("B", 1, [{ T: 6 }], [{ T: 12 }, { T: 3 }]);
T("C", 0, [{ bd: 14 }], [{ bd: -1 }, { bd: 12 }]);
T("C", 1, [{ bd: 12 }], [{ bd: -1 }, { bd: 14 }]);
T("C", 2, [{ sh: 10 }], [{ sh: 0 }, { sh: -4 }]);
T("D", 0, [{ s: 0.25 }], [{ s: 0.1 }, { s: 0.4 }]);
T("D", 1, [{ g: 0.6 }], [{ g: 0.3 }]);
T("D", 2, [{ c: 3 }, { c: 1 }], [{ c: null }]);
T("E", 0, [{ a2: 3, a3: 6 }], [{ a2: 1, a3: 3 }, { a2: 1, a3: 6 }]);
T("E", 1, [{ a3: 3 }], [{ a3: 6 }]);
T("E", 2, [{ a3: 12 }], [{ a3: 6 }]);
{ const q = play("D", 1, { g: 0.6 }), e = sumAt(q, q.G);
  check("D2 at growth .6: the bud " + e.len.toFixed(2) + " mm (still 1.6-1.8: the speed changed when, not how long)", e.len >= 1.6 && e.len <= 1.8); }
/* ================= the flow ================= */
{
  for (const S of STAGES) { S.round = 0; S.done = false; S.waiting = false; S.results = []; S.last = null; const pr = document.getElementById(S.K + "_practice"); if (pr) pr.checked = false; openRound(S); }
  for (const k in Gates) Gates[k].done = false; paintAll();
  const go = S => { document.getElementById(S.K + "_go").click(); finishNow(S); }, next = S => document.getElementById(S.K + "_next").click();
  const cls = (K, id) => (document.querySelector("#" + K + '_paths [data-of="' + id + '"]') || { classList: { contains: () => false } }).classList;
  const a1 = cls("A", "LY").contains("settable");
  go(SA); const miss = Score.getBit("scaffold", BIT.A1) === 0 && !SA.waiting;
  setC(SA, { LY: 1, RY: -1 }); go(SA); const hit = SA.waiting; next(SA);
  setC(SA, { LY: 0, RY: 0, LX: 1, RX: -1 }); setC(SA, { LY: 1, XY: -1 }); go(SA); next(SA);
  setC(SA, { LX: 0, RX: 0, LY: 0, RY: 0, XY: 0, YX: 0 }); setC(SA, { LX: 1, YX: 1, XY: 1 }); go(SA);
  check("flow: A's arrows settable (" + a1 + "); a miss records 0 (" + miss + "); a hit waits (" + hit + "); three hits finish A (" + Gates.A.done + ")", a1 && miss && hit && Gates.A.done);
  setC(SB, { T: 12 }); go(SB); next(SB); setC(SB, { T: 6 }); go(SB);
  check("flow: two hits finish B (" + Gates.B.done + ")", Gates.B.done);
  /* the bead by a click on block 15 */
  { const cv = document.getElementById("C_body"), r = cv.getBoundingClientRect(), k = r.width / 760;
    cv.dispatchEvent(new MouseEvent("click", { clientX: r.left + (44 + 14 * 28 + 14) * k, clientY: r.top + 57 * k, bubbles: true })); }
  const clicked = readSet(SC).bd === 14; go(SC); next(SC); setC(SC, { bd: 12 }); go(SC); next(SC); setC(SC, { sh: 10 }); go(SC);
  check("flow: a click on block 15 puts the bead there (" + clicked + "); three hits finish C (" + Gates.C.done + ")", clicked && Gates.C.done);
  setC(SD, { s: 0.25 }); go(SD); next(SD); setC(SD, { g: 0.6 }); go(SD); next(SD); setC(SD, { c: 3 }); go(SD);
  check("flow: three hits finish D (" + Gates.D.done + ")", Gates.D.done);
  setC(SE, { a2: 3, a3: 6 }); go(SE); next(SE); setC(SE, { a3: 3 }); go(SE); next(SE); setC(SE, { a3: 12 }); go(SE);
  check("flow: three hits finish E (" + Gates.E.done + ")", Gates.E.done);
  let n = 0; for (let i = 0; i < 14; i++) if (Score.isAnswered("scaffold", i)) n++;
  const bits = Object.keys(BIT).map(k => Score.getBit("scaffold", BIT[k])).join("");
  check("all 14 declared bits written (" + n + "; bits " + bits + "); the lesson ends", n === 14 && bits.startsWith("0") && Gates.E.done && document.getElementById("done-banner").classList.contains("shown"));
}
{
  const infos = [...document.querySelectorAll(".info")], tipOf = e => e.dataset.tip ? document.getElementById(e.dataset.tip) : e.querySelector(".tip");
  const empty = infos.filter(e => !tipOf(e) || !tipOf(e).textContent.trim()).length;
  check("hover text: " + infos.length + " marks, " + empty + " empty", infos.length >= 12 && empty === 0);
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
<iframe id="f" src="http://127.0.0.1:${PORT}/app/lessons/lesson24.html?preview=1" width="1500" height="1000"></iframe>
<iframe id="g" src="http://127.0.0.1:${PORT}/app/lessons/lesson24.html?preview=1" width="1000" height="900"></iframe>
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
const probePath = path.join(ROOT, "_check_l24_" + PORT + ".html");
fs.writeFileSync(probePath, probe);
const server = spawn("python3", ["-m", "http.server", String(PORT), "--directory", ROOT], { stdio: "ignore", detached: true });
const cleanup = () => { try { process.kill(-server.pid); } catch (e) {} try { fs.unlinkSync(probePath); } catch (e) {} };
process.on("exit", cleanup);
setTimeout(() => {
  const r = spawnSync(CHROME, ["--headless=new", "--disable-gpu", "--virtual-time-budget=6000000", "--dump-dom", `http://127.0.0.1:${PORT}/_check_l24_${PORT}.html`], { encoding: "utf8", maxBuffer: 1 << 28 });
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
    const src = (lines.find(l => l.startsWith("R" + K + " ")) || "").slice(3).replace(/\\n/g, "\n"), fixed = src.replace(/G <- \d+/, "G <- " + (process.env.R_G || 3)).replace(/rows <- \d+/, "rows <- " + (process.env.R_G ? 60 : 20)).replace(/dur <- \d+/, "dur <- " + (process.env.R_G ? 500 : 200));
    const o = spawnSync("Rscript", ["-e", fixed + "\ncat('\\nOK\\n')"], { encoding: "utf8", timeout: 240000 }), ok = /OK/.test(o.stdout || "");
    console.log((ok ? "ok   " : "FAIL ") + "the R panel of stage " + K + " runs (3 generations)" + (ok ? "  -- " + (o.stdout || "").trim().split("\n").slice(-3, -1).join(" ").replace(/\s+/g, " ") : "  -- " + (o.stderr || "").trim().split("\n").slice(-3).join(" ")));
    if (!ok) bad = true;
  }
  cleanup(); process.exit(bad ? 1 : 0);
}, 700);
