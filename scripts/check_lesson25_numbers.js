#!/usr/bin/env node
/*
 * check_lesson25_numbers.js -- the checks for app/lessons/lesson25.html.
 *
 * Lesson 25, draft 2 (2026-11-07): mesoevolution. A the map from two
 * genes' levels (Gli3, Hox13) to digits, through lesson 24's draft-2 limb
 * (Sox9 with Bmp and Wnt); B clades on the map. What has to hold:
 *
 *   Engine. The digits table B reads (measured offline) is what stage A's
 *      model makes: 8 limbs at each Hox13 level at Gli3 x 1.5 and x 1
 *      regrown on the page, their modes equal to the table; no six at
 *      x 1.5, six at x 1.
 *   Rounds. Each target hit by its intended setting, missed by its
 *      opening; in B, six arises in every clade at x 1 even when held off,
 *      and never at x 1.5 even when favoured (while seven and eight do).
 *   Flow. A by clicks on the map; five bits written; the lesson ends.
 *   Layout. Hover marks; canvases fit; R last and closed; R panels run.
 *
 * Usage:  node scripts/check_lesson25_numbers.js      (~1 minute)
 */
const { spawn, spawnSync } = require("child_process");
const fs = require("fs"), path = require("path");
const ROOT = path.resolve(__dirname, "..");
const PORT = +process.env.PORT || 8795;
const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const CANVAS_IDS = ["A_map", "A_limb", "A_tpic", "B_tree", "B_row", "B_clades", "B_tpic"];

const INNER = `
const L_=[], say=s=>L_.push(s);
let bad=0, ran=0;
const check=(name, ok, detail)=>{ ran++; if(!ok) bad++; say((ok?"ok   ":"FAIL ")+name+(detail?"  -- "+detail:"")); };
for (const k in Gates) { Gates[k].open = true; document.getElementById("stage" + k).classList.remove("stage-locked"); }
/* ================= the engines ================= */
{
  const mode = a => { const c = {}; for (const x of a) c[x] = (c[x] || 0) + 1; return +Object.entries(c).sort((x, y) => y[1] - x[1])[0][0]; };
  const got = {}, off = [];
  for (const W of [18, 22]) { got[W] = MAP_H.map(hx => { const ds = []; for (let s = 0; s < 8; s++) { const w = sxWorld({ W3: W, hx }, 500 + s * 7919); for (let r = 0; r < SX.rows; r++) sxStep(w); ds.push(sxStat(w).di); } return mode(ds); });
    got[W].forEach((d, i) => { if (d !== DIGITS[W][i]) off.push(W + "/" + MAP_H[i] + ": " + d + " vs " + DIGITS[W][i]); }); }
  check("engine: the digits B reads, regrown (8 limbs a level): Gli3 x 1.5 " + got[18].join(" ") + "; x 1 " + got[22].join(" ") + " (the table: " + DIGITS[18].join(" ") + " / " + DIGITS[22].join(" ") + "); no six at x 1.5, six at x 1",
        off.length === 0 && !DIGITS[18].includes(6) && DIGITS[22].includes(6), off.join(", "));
}
/* ================= the rounds ================= */
const STG = { A: SA, B: SB };
const setC = (S, o) => { for (const k in o) { const c = S.cfg.ctl.find(c => c.key === k), i = c.vals.indexOf(o[k]); if (i < 0) throw new Error("no " + k + " = " + o[k]); const el = document.getElementById(S.K + "_" + k); el.value = i + (+el.min || 0); el.dispatchEvent(new Event("input")); } };
const play = (K, r, o) => { const S = STG[K]; S.round = r; S.done = false; S.waiting = false; S.run = null; const pr = document.getElementById(K + "_practice"); if (pr) pr.checked = true;
  openRound(S); for (const c of S.cfg.ctl) document.getElementById(K + "_" + c.key).dataset.held = ""; setC(S, o); goStage(S); finishNow(S); return S.last; };
const T = (K, r, good, badOnes) => { const S = STG[K], R = S.cfg.rounds[r];
  const res = (o, want) => { const q = play(K, r, o), e = sumAt(q, q.G), j = judge(R, e); return [o, j.ok === want, j.vals.join("/")]; };
  const g = good.map(o => res(o, true)), b = badOnes.map(o => res(o, false));
  const js = o => JSON.stringify(o, (k, v) => typeof v === "number" ? +v.toFixed(3) : v).replace(/"/g, "");
  check(K + (r + 1) + ": hit by " + g.map(x => js(x[0]) + " (" + x[2] + ")").join(", ") + "; missed by " + b.map(x => js(x[0]) + " (" + x[2] + ")").join(", "),
        g.every(x => x[1]) && b.every(x => x[1])); };
T("A", 0, [{ g: 1.75, hx: 0.5 }, { g: 1.25, hx: 0.7 }, { g: 0.25, hx: 1.2 }], [{ g: 1, hx: 1 }, { g: 1.5, hx: 0.7 }, { g: 1.5, hx: 0.85 }]);
T("A", 1, [{ g: 2, hx: 2.5 }, { g: 2, hx: 3 }], [{ g: 1, hx: 1 }, { g: 1, hx: 3 }]);
T("B", 0, [{ f: 1 }], [{ f: 0 }, { f: 3 }]);
T("B", 1, [{ g: 1 }], [{ g: 1.5 }]);
T("B", 2, [{ f: 0 }], [{ f: 3 }]);
{ const q = play("B", 2, { f: 3 });
  const e6 = q.runs.filter(c => c.ever[6]).length;
  check("B3 with five or fewer favoured: six arose in " + e6 + " of 16 clades though six or more end at " + f2(sumAt(q, q.G).s6), e6 >= 14); }
{ const q = play("B", 1, { g: 1.5 }), s7 = q.runs.filter(c => c.ever[7] || c.ever[8]).length;
  check("B2 at Gli3 x 1.5, six favoured: six arose in " + q.runs.filter(c => c.ever[6]).length + " of 16 clades, seven or eight in " + s7 + " (more digits are made; six is not)", q.runs.every(c => !c.ever[6]) && s7 >= 8); }
/* ================= the flow ================= */
{
  for (const S of STAGES) { S.round = 0; S.done = false; S.waiting = false; S.results = []; S.last = null; const pr = document.getElementById(S.K + "_practice"); if (pr) pr.checked = false; openRound(S); }
  for (const k in Gates) Gates[k].done = false; paintAll();
  const go = S => { document.getElementById(S.K + "_go").click(); finishNow(S); }, next = S => document.getElementById(S.K + "_next").click();
  const clickCell = (g, hx) => { const cv = document.getElementById("A_map"), r = cv.getBoundingClientRect(), k = r.width / 760;
    cv.dispatchEvent(new MouseEvent("click", { clientX: r.left + (MP.x0 + MAP_H.indexOf(hx) * MP.cw + MP.cw / 2) * k, clientY: r.top + (MP.y0 + MAP_G.indexOf(g) * MP.ch + MP.ch / 2) * k, bubbles: true })); };
  go(SA); const miss = Score.getBit("scaffold", BIT.A1) === 0 && !SA.waiting;
  clickCell(1.75, 0.5); const set = readSet(SA), clicked = set.g === 1.75 && set.hx === 0.5; go(SA); const hit = SA.waiting; next(SA);
  clickCell(2, 2.5); go(SA);
  const filled = SEEN["1.75,0.5"] === 6 && SEEN["2,2.5"] === 2;
  check("flow: a miss records 0 (" + miss + "); a click on the map sets the cell (" + clicked + "); six digits there hits (" + hit + "); the map fills (" + filled + "); two hits finish A (" + Gates.A.done + ")", miss && clicked && hit && filled && Gates.A.done);
  setC(SB, { f: 1 }); go(SB); next(SB); setC(SB, { g: 1 }); go(SB); next(SB); setC(SB, { f: 0 }); go(SB);
  check("flow: three hits finish B (" + Gates.B.done + ")", Gates.B.done);
  let n = 0; for (let i = 0; i < 5; i++) if (Score.isAnswered("scaffold", i)) n++;
  const bits = Object.keys(BIT).map(k => Score.getBit("scaffold", BIT[k])).join("");
  check("all 5 declared bits written (" + n + "; bits " + bits + "); the lesson ends", n === 5 && bits.startsWith("0") && Gates.B.done && document.getElementById("done-banner").classList.contains("shown"));
}
{
  const infos = [...document.querySelectorAll(".info")], tipOf = e => e.dataset.tip ? document.getElementById(e.dataset.tip) : e.querySelector(".tip");
  const empty = infos.filter(e => !tipOf(e) || !tipOf(e).textContent.trim()).length;
  { const off = []; for (const S of STAGES) for (const c of S.cfg.ctl) { const el = document.getElementById(S.K + "_" + c.key); if (+el.max - +el.min + 1 !== c.vals.length) off.push(S.K + "_" + c.key + " " + (+el.max - +el.min + 1) + "/" + c.vals.length); }
    check("every control's positions match its values (" + off.length + " off)", off.length === 0, off.join(", ")); }
  check("hover text: " + infos.length + " marks, " + empty + " empty", infos.length >= 8 && empty === 0);
  FIT_EPOCH++; paintAll();
  const over = []; for (const id of ${JSON.stringify(CANVAS_IDS)}) { const cv = document.getElementById(id), host = cv.parentElement; if (+cv.dataset.drawW > host.clientWidth + 1) over.push(id + " " + cv.dataset.drawW + ">" + host.clientWidth); }
  check("every canvas fits its panel (" + window.innerWidth + " wide)", over.length === 0, over.join(", "));
  const lastOk = ["A", "B"].every(K => { const els = document.querySelectorAll("#stage" + K + " .panel"), last = els[els.length - 1]; return last.matches("details.rcode") && !last.open; });
  check("layout: each stage's R code last and closed; no readout lines", lastOk && document.querySelectorAll(".readout").length === 0);
}
for (const S of STAGES) S.cfg.paint();
say(bad ? ("FAILED " + bad) : "ALL BARS PASS");
say("RAN " + ran);
for (const K of ["A", "B"]) say("R" + K + " " + RTEXT["code" + K].replace(/\\n/g, "\\\\n"));
L_.join(" ;; ");
`;
const INNER_NARROW = `
for (const k in Gates) document.getElementById("stage" + k).classList.remove("stage-locked");
FIT_EPOCH++; paintAll();
const over = []; for (const id of ${JSON.stringify(CANVAS_IDS)}) { const cv = document.getElementById(id), host = cv.parentElement; if (+cv.dataset.drawW > host.clientWidth + 1) over.push(id + " " + cv.dataset.drawW + ">" + host.clientWidth); }
(over.length ? "FAIL " : "ok   ") + "every canvas fits its panel (" + window.innerWidth + " wide)" + (over.length ? "  -- " + over.join(", ") : "");
`;
const probe = `<!doctype html><meta charset="utf-8"><title>pending</title>
<iframe id="f" src="http://127.0.0.1:${PORT}/app/lessons/lesson25.html?preview=1" width="1500" height="1000"></iframe>
<iframe id="g" src="http://127.0.0.1:${PORT}/app/lessons/lesson25.html?preview=1" width="1000" height="900"></iframe>
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
const probePath = path.join(ROOT, "_check_l25_" + PORT + ".html");
fs.writeFileSync(probePath, probe);
const server = spawn("python3", ["-m", "http.server", String(PORT), "--directory", ROOT], { stdio: "ignore", detached: true });
const cleanup = () => { try { process.kill(-server.pid); } catch (e) {} try { fs.unlinkSync(probePath); } catch (e) {} };
process.on("exit", cleanup);
setTimeout(() => {
  const r = spawnSync(CHROME, ["--headless=new", "--disable-gpu", "--virtual-time-budget=6000000", "--dump-dom", `http://127.0.0.1:${PORT}/_check_l25_${PORT}.html`], { encoding: "utf8", maxBuffer: 1 << 28 });
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
  else for (const K of ["A", "B"]) {
    const src = (lines.find(l => l.startsWith("R" + K + " ")) || "").slice(3).replace(/\\n/g, "\n"), fixed = src.replace(/G <- \d+/, "G <- " + (process.env.R_G || 3)).replace(/rows <- \d+/, "rows <- " + (process.env.R_G ? 60 : 20)).replace(/dur <- \d+/, "dur <- " + (process.env.R_G ? 500 : 200));
    const o = spawnSync("Rscript", ["-e", fixed + "\ncat('\\nOK\\n')"], { encoding: "utf8", timeout: 240000 }), ok = /OK/.test(o.stdout || "");
    console.log((ok ? "ok   " : "FAIL ") + "the R panel of stage " + K + " runs (3 generations)" + (ok ? "  -- " + (o.stdout || "").trim().split("\n").slice(-3, -1).join(" ").replace(/\s+/g, " ") : "  -- " + (o.stderr || "").trim().split("\n").slice(-3).join(" ")));
    if (!ok) bad = true;
  }
  cleanup(); process.exit(bad ? 1 : 0);
}, 700);
