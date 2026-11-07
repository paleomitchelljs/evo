#!/usr/bin/env node
/*
 * check_lesson26_numbers.js -- the checks for app/lessons/lesson26.html.
 *
 * Lesson 26, draft 1 (2026-11-07): the origins of individuality (Michod).
 * A cheater cells in colonies; B who does the work (the group covariance
 * effect); C a germ line and policing. What has to hold:
 *
 *   Engine. The change in the cheaters' share taken apart (between
 *      colonies, inside, the propagule draw) adds up exactly; with a germ
 *      line the inside part is exactly 0 every generation; policing every
 *      new cheater leaves none; W = mean(v b) - cov(v, b) for both kinds
 *      of colony, a specialist colony's cells worth 0 on their own.
 *   Rounds. Each target hit by its intended setting, missed by its
 *      opening.
 *   Flow. Six bits; the lesson ends. Layout; R panels.
 *
 * Usage:  node scripts/check_lesson26_numbers.js      (~1 minute)
 */
const { spawn, spawnSync } = require("child_process");
const fs = require("fs"), path = require("path");
const ROOT = path.resolve(__dirname, "..");
const PORT = +process.env.PORT || 8794;
const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const CANVAS_IDS = ["A_cols", "A_time", "A_split", "A_tpic", "B_curve", "B_time", "B_split", "B_tpic", "C_cols", "C_time", "C_split", "C_tpic"];

const INNER = `
const L_=[], say=s=>L_.push(s);
let bad=0, ran=0;
const check=(name, ok, detail)=>{ ran++; if(!ok) bad++; say((ok?"ok   ":"FAIL ")+name+(detail?"  -- "+detail:"")); };
for (const k in Gates) { Gates[k].open = true; document.getElementById("stage" + k).classList.remove("stage-locked"); }
/* ================= the engines ================= */
{
  let worst = 0, germIns = 0, mis = 0;
  for (const P of [{ k: 16, B: 0.2, germ: 0, pol: 0 }, { k: 1, B: 0.5, germ: 0, pol: 0.5 }, { k: 16, B: 0.2, germ: 1, pol: 0 }]) {
    const w = coWorld(P, 77); for (let t = 0; t < 60; t++) { const z0 = coStat(w).z; coStep(w); const L = w.last;
      worst = Math.max(worst, Math.abs(L.bet + L.ins + L.draw - (L.after - L.before))); mis = Math.max(mis, Math.abs(L.before - z0), Math.abs(L.after - coStat(w).z)); if (P.germ) germIns = Math.max(germIns, Math.abs(L.ins)); } }
  const wp = coWorld({ k: 16, B: 0.2, germ: 0, pol: 1 }, 5); let zmax = 0; for (let t = 0; t < 50; t++) { coStep(wp); zmax = Math.max(zmax, coStat(wp).z); }
  check("engine: between + inside + the propagule draw = the change in the cheaters' share (worst " + worst.toExponential(1) + "; the menu's means " + mis.toExponential(1) + "); with a germ line, inside every generation " + germIns + " (0); policing every new cheater: cheaters at most " + zmax + " (0)",
        worst < 1e-12 && mis < 1e-12 && germIns === 0 && zmax === 0);
  const sp = dvCells("spec", { g: 2, q: 0.5 }), ge = dvCells("gen", { g: 2, q: 0.5 }), ge5 = dvCells("gen", { g: 0.5, q: 0.5 });
  check("engine: bowed in, half germ: a specialist colony V x B " + sp.W.toFixed(3) + " = its cells' own " + sp.wc.toFixed(3) + " - cov " + sp.cov.toFixed(3) + "; a generalist colony " + ge.W.toFixed(3) + " (cov " + ge.cov.toFixed(3) + "); bowed out, generalists " + ge5.W.toFixed(3),
        Math.abs(sp.W - (sp.wc - sp.cov)) < 1e-12 && sp.wc === 0 && Math.abs(sp.W - 0.25) < 1e-12 && Math.abs(ge.cov) < 1e-12 && ge.W < sp.W && ge5.W > sp.W);
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
T("A", 0, [{ k: 1 }], [{ k: 16 }]);
T("A", 1, [{ B: 0.5 }, { B: 1 }], [{ B: 0.2 }]);
T("B", 0, [{ g: 2 }], [{ g: 1 }, { g: 0.5 }]);
T("B", 1, [{ q: 0.25 }, { q: 0.5 }], [{ q: 0.1 }]);
T("C", 0, [{ g: 1 }], [{ g: 0 }]);
T("C", 1, [{ p: 0.8 }], [{ p: 0.5 }, { p: 0 }]);
/* ================= the flow ================= */
{
  for (const S of STAGES) { S.round = 0; S.done = false; S.waiting = false; S.results = []; S.last = null; const pr = document.getElementById(S.K + "_practice"); if (pr) pr.checked = false; openRound(S); }
  for (const k in Gates) Gates[k].done = false; paintAll();
  const go = S => { document.getElementById(S.K + "_go").click(); finishNow(S); }, next = S => document.getElementById(S.K + "_next").click();
  const cls = (K, id) => (document.querySelector("#" + K + '_paths [data-of="' + id + '"]') || { classList: { contains: () => false } }).classList;
  const a1 = cls("A", "k").contains("settable") && cls("A", "B").contains("locked") && readSet(SA).k === 16;
  go(SA); const miss = Score.getBit("scaffold", BIT.A1) === 0 && !SA.waiting;
  setC(SA, { k: 1 }); go(SA); const hit = SA.waiting; next(SA); setC(SA, { B: 0.5 }); go(SA);
  check("flow: A1 frees where a colony starts at 16 cells, the gift held (" + a1 + "); a miss records 0 (" + miss + "); one cell hits (" + hit + "); two hits finish A (" + Gates.A.done + ")", a1 && miss && hit && Gates.A.done);
  setC(SB, { g: 2 }); go(SB); next(SB); setC(SB, { q: 0.25 }); go(SB);
  check("flow: two hits finish B (" + Gates.B.done + ")", Gates.B.done);
  const c1 = cls("C", "g").contains("settable") && cls("C", "p").contains("locked");
  setC(SC, { g: 1 }); go(SC); next(SC); setC(SC, { p: 0.8 }); go(SC);
  check("flow: C1 frees the germ line, policing held (" + c1 + "); two hits finish C (" + Gates.C.done + ")", c1 && Gates.C.done);
  let n = 0; for (let i = 0; i < 6; i++) if (Score.isAnswered("scaffold", i)) n++;
  const bits = Object.keys(BIT).map(k => Score.getBit("scaffold", BIT[k])).join("");
  check("all 6 declared bits written (" + n + "; bits " + bits + "); the lesson ends", n === 6 && bits.startsWith("0") && Gates.C.done && document.getElementById("done-banner").classList.contains("shown"));
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
<iframe id="f" src="http://127.0.0.1:${PORT}/app/lessons/lesson26.html?preview=1" width="1500" height="1000"></iframe>
<iframe id="g" src="http://127.0.0.1:${PORT}/app/lessons/lesson26.html?preview=1" width="1000" height="900"></iframe>
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
const probePath = path.join(ROOT, "_check_l26_" + PORT + ".html");
fs.writeFileSync(probePath, probe);
const server = spawn("python3", ["-m", "http.server", String(PORT), "--directory", ROOT], { stdio: "ignore", detached: true });
const cleanup = () => { try { process.kill(-server.pid); } catch (e) {} try { fs.unlinkSync(probePath); } catch (e) {} };
process.on("exit", cleanup);
setTimeout(() => {
  const r = spawnSync(CHROME, ["--headless=new", "--disable-gpu", "--virtual-time-budget=6000000", "--dump-dom", `http://127.0.0.1:${PORT}/_check_l26_${PORT}.html`], { encoding: "utf8", maxBuffer: 1 << 28 });
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
    const src = (lines.find(l => l.startsWith("R" + K + " ")) || "").slice(3).replace(/\\n/g, "\n"), fixed = src.replace(/G <- \d+/, "G <- " + (process.env.R_G || 3)).replace(/rows <- \d+/, "rows <- " + (process.env.R_G ? 60 : 20)).replace(/dur <- \d+/, "dur <- " + (process.env.R_G ? 500 : 200));
    const o = spawnSync("Rscript", ["-e", fixed + "\ncat('\\nOK\\n')"], { encoding: "utf8", timeout: 240000 }), ok = /OK/.test(o.stdout || "");
    console.log((ok ? "ok   " : "FAIL ") + "the R panel of stage " + K + " runs (3 generations)" + (ok ? "  -- " + (o.stdout || "").trim().split("\n").slice(-3, -1).join(" ").replace(/\s+/g, " ") : "  -- " + (o.stderr || "").trim().split("\n").slice(-3).join(" ")));
    if (!ok) bad = true;
  }
  cleanup(); process.exit(bad ? 1 : 0);
}, 700);
