#!/usr/bin/env node
/*
 * check_lesson22_numbers.js -- the checks for app/lessons/lesson22.html.
 *
 * Lesson 22, draft 1 (2026-11-07): kin selection and gene-level selection
 * on a grid of nests (JM: "Yes please go ahead with the grid"). A help
 * that reaches the neighbours; B relatedness as a condition, the change
 * taken apart; C helping at the start and a mutation that breaks it; D a
 * driving gene. What has to hold:
 *
 *   Engine. A bird's young follow 2 f, f = 1 - c h + b (neighbours' h) / 4;
 *      alleles pass as Mendel says; a driver goes into q of a carrier's
 *      gametes; broken helping alleles at 1 in 100; neighbours share a
 *      parent more the closer young settle; the change in the helping
 *      allele taken apart (own, neighbours', what the young keep) adds up
 *      exactly, own + neighbours' = cov(w, z) / w-bar, and the driver's too.
 *   Rounds. Each target hit by its intended setting (and a neighbour of
 *      it), missed by its opening.
 *   Flow. Held and free arrows; a miss records 0; Next after a hit; ten
 *      bits written; the lesson ends.
 *   Layout. Hover marks with words; every canvas fits (1500 and 1000
 *      wide); each stage's R code last and closed; the four R panels run
 *      (shortened to 3 generations).
 *
 * Usage:  node scripts/check_lesson22_numbers.js      (~2 minutes)
 */
const { spawn, spawnSync } = require("child_process");
const fs = require("fs"), path = require("path");
const ROOT = path.resolve(__dirname, "..");
const PORT = +process.env.PORT || 8798;
const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const CANVAS_IDS = ["A_map", "A_time", "A_split", "A_tpic", "B_map", "B_time", "B_split", "B_tpic", "C_map", "C_time", "C_split", "C_tpic", "D_map", "D_time", "D_split", "D_tpic"];

const INNER = `
const L_=[], say=s=>L_.push(s);
let bad=0, ran=0;
const check=(name, ok, detail)=>{ ran++; if(!ok) bad++; say((ok?"ok   ":"FAIL ")+name+(detail?"  -- "+detail:"")); };
for (const k in Gates) { Gates[k].open = true; document.getElementById("stage" + k).classList.remove("stage-locked"); }
const GP = P => Object.assign({ b: 0, c: 0, d: 1, mu: 0, p0: 0.5, q: 0.5, k: 0, dr0: 0 }, P);
const empty = w => { w.occ.fill(0); w.g.fill(0); w.dr.fill(0); };
/* ================= the engine ================= */
{
  /* fecundity: a lone bird, or one with four neighbours, on an empty island: its young that settle, by its mother index */
  const young = (P, setup, R) => { let n = 0; for (let r = 0; r < R; r++) { const w = gWorld(GP(P), 500 + r); empty(w); setup(w); gStep(w); for (let x = 0; x < GN; x++) if (w.occ[x] && w.mo[x] === 528) n++; } return n / R; };
  const lone = (w, h) => { w.occ[528] = 1; w.g[2 * 528] = h; w.g[2 * 528 + 1] = h; };
  const y1 = young({ c: 0.5 }, w => lone(w, 1), 400), y0 = young({ c: 0.5 }, w => lone(w, 0), 400);
  const y4 = young({ c: 0.2, b: 1 }, w => { lone(w, 1); for (const j of NB4[528]) { w.occ[j] = 1; w.g[2 * j] = 1; w.g[2 * j + 1] = 1; } }, 400);
  check("engine: young a bird leaves = 2 f: a lone full helper at cost .5 " + y1.toFixed(2) + " (1.0), a lone non-helper " + y0.toFixed(2) + " (2.0); a full helper among four at cost .2, benefit 1 " + y4.toFixed(2) + " (3.6)",
        Math.abs(y1 - 1) < 0.12 && Math.abs(y0 - 2) < 0.15 && Math.abs(y4 - 3.6) < 0.25);
  /* Mendel, the driver, the breaks: every bird one of each */
  const gam = (P, set) => { let a = 0, n = 0, d = 0; for (let r = 0; r < 20; r++) { const w = gWorld(GP(P), 600 + r); set(w); gStep(w); for (let x = 0; x < GN; x++) if (w.occ[x]) { a += w.g[2 * x] + w.g[2 * x + 1]; d += w.dr[2 * x] + w.dr[2 * x + 1]; n += 2; } } return [a / n, d / n]; };
  const het = w => { for (let i = 0; i < GN; i++) { w.g[2 * i] = 0; w.g[2 * i + 1] = 1; w.dr[2 * i] = 0; w.dr[2 * i + 1] = 1; } };
  const [ha, d5] = gam({}, het), [, d9] = gam({ q: 0.9 }, het), [hb] = gam({ mu: 0.01, p0: 1 }, w => {});
  check("engine: from one-of-each parents the young carry the helping allele " + ha.toFixed(3) + " (1/2), the driver " + d5.toFixed(3) + " fair and " + d9.toFixed(3) + " at drive .9; from all helpers with 1 in 100 broken, " + hb.toFixed(4) + " (.99)",
        Math.abs(ha - 0.5) < 0.01 && Math.abs(d5 - 0.5) < 0.01 && Math.abs(d9 - 0.9) < 0.01 && Math.abs(hb - 0.99) < 0.002);
  /* kinship by how close young settle (no helping) */
  const kin = d => { let s = 0; for (let r = 0; r < 4; r++) { const w = gWorld(GP({ d }), 700 + r); for (let t = 0; t < 20; t++) gStep(w); s += gStat(w).kin; } return s / 4; };
  const ks = [1, 2, 4, 8].map(kin);
  check("engine: neighbours that share a parent, within 1, 2, 4, 8: " + ks.map(v => v.toFixed(3)).join(", ") + " (falling)", ks[0] > ks[1] && ks[1] > ks[2] && ks[2] > ks[3] && ks[0] > 0.12 && ks[3] < 0.03);
  /* the split adds up exactly */
  { const w = gWorld(GP({ b: 1.5, c: 0.1, d: 2, mu: 0.01, q: 0.7, k: 0.2, dr0: 0.3 }), 77); let worst = 0, reg = 0, mis = 0;
    for (let t = 0; t < 20; t++) { const s0 = gStat(w); gStep(w); const s1 = gStat(w), L = w.last;
      worst = Math.max(worst, Math.abs(L.own + L.nbr + L.keep - (L.after - L.before)), Math.abs(L.dcov + L.dkeep - (L.dafter - L.dbefore)));
      reg = Math.max(reg, Math.abs(L.own + L.nbr - L.cov)); mis = Math.max(mis, Math.abs(L.before - s0.p), Math.abs(L.after - s1.p), Math.abs(L.dafter - s1.dr)); }
    check("engine: own + neighbours' + what the young keep = the change in the helping allele, and the driver's two parts its change (worst " + worst.toExponential(1) + "); own + neighbours' = cov(w, z) / w-bar (" + reg.toExponential(1) + "); the menus' means (" + mis.toExponential(1) + ")",
          worst < 1e-12 && reg < 1e-12 && mis < 1e-12); }
}
/* ================= the rounds ================= */
const STG = { A: SA, B: SB, C: SC, D: SD };
const setC = (S, o) => { for (const k in o) { const c = S.cfg.ctl.find(c => c.key === k), i = c.vals.indexOf(o[k]); if (i < 0) throw new Error("no " + k + " = " + o[k]); const el = document.getElementById(S.K + "_" + k); el.value = i + (+el.min || 0); el.dispatchEvent(new Event("input")); } };
const play = (K, r, o) => { const S = STG[K]; S.round = r; S.done = false; S.waiting = false; S.run = null; const pr = document.getElementById(K + "_practice"); if (pr) pr.checked = true;
  openRound(S); for (const c of S.cfg.ctl) document.getElementById(K + "_" + c.key).dataset.held = ""; setC(S, o); goStage(S); finishNow(S); return S.last; };
const T = (K, r, good, badOnes) => { const S = STG[K], R = S.cfg.rounds[r];
  const res = (o, want) => { const q = play(K, r, o), e = sumAt(q, q.G), j = judge(R, e); return [o, j.ok === want, j.vals.join("/")]; };
  const g = good.map(o => res(o, true)), b = badOnes.map(o => res(o, false));
  check(K + (r + 1) + ": hit by " + g.map(x => JSON.stringify(x[0]).replace(/"/g, "") + " (" + x[2] + ")").join(", ") + "; missed by " + b.map(x => JSON.stringify(x[0]).replace(/"/g, "") + " (" + x[2] + ")").join(", "),
        g.every(x => x[1]) && b.every(x => x[1])); };
T("A", 0, [{ b: 1 }, { b: 1.5 }], [{ b: 0.5 }]);
T("A", 1, [{ d: 3 }, { d: 4 }], [{ d: 2 }, { d: 1 }]);
T("A", 2, [{ d: 1 }], [{ d: 2 }, { d: 3 }]);
T("B", 0, [{ d: 1 }], [{ d: 2 }, { d: 4 }]);
T("B", 1, [{ b: 1.5, d: 2 }, { b: 2, d: 3 }, { b: 3, d: 8 }], [{ b: 2, d: 2 }, { b: 0.5, d: 2 }]);
T("B", 2, [{ c: 0.2 }, { c: 0.3 }], [{ c: 0.1 }]);
T("C", 0, [{ d: 2 }, { d: 1 }], [{ d: 3 }, { d: 8 }]);
T("C", 1, [{ b: 1 }, { b: 0.5 }], [{ b: 1.5 }]);
T("D", 0, [{ q: 0.6 }, { q: 0.9 }], [{ q: 0.5 }]);
T("D", 1, [{ k: 0.5 }, { k: 0.6 }], [{ k: 0.4 }, { k: 0.2 }]);
{ /* B at the line: the two parts of the change from the birds' helping take opposite signs */
  const q = play("B", 1, { b: 1.5, d: 2 }), e = sumAt(q, q.G);
  check("B2 at benefit 1.5, within 2: from its own helping " + f2(e.sh[0]) + " (negative), from its neighbours' " + f2(e.sh[1]) + " (positive), what the young keep " + f2(e.sh[2]), e.sh[0] < 0 && e.sh[1] > 0); }
{ const q = play("D", 0, { q: 0.6 }), e = sumAt(q, q.G);
  check("D1 at drive .6: who leaves more young " + f2(e.sd[0]) + " (negative), what the young keep " + f2(e.sd[1]) + " (positive)", e.sd[0] < 0 && e.sd[1] > 0); }
/* ================= the flow ================= */
{
  for (const S of STAGES) { S.round = 0; S.done = false; S.waiting = false; S.results = []; S.last = null; const pr = document.getElementById(S.K + "_practice"); if (pr) pr.checked = false; openRound(S); }
  for (const k in Gates) Gates[k].done = false; paintAll();
  const go = S => { document.getElementById(S.K + "_go").click(); finishNow(S); }, next = S => document.getElementById(S.K + "_next").click();
  const cls = (K, id) => (document.querySelector("#" + K + '_paths [data-of="' + id + '"]') || { classList: { contains: () => false } }).classList;
  const a1 = cls("A", "b").contains("settable") && cls("A", "d").contains("locked") && cls("A", "c").contains("locked") && readSet(SA).b === 0.5;
  go(SA); const miss = Score.getBit("scaffold", BIT.A1) === 0 && !SA.waiting;
  setC(SA, { b: 1 }); go(SA); const hit = SA.waiting; next(SA);
  const a2 = cls("A", "d").contains("settable") && cls("A", "b").contains("locked") && readSet(SA).d === 2;
  setC(SA, { d: 3 }); go(SA); next(SA); setC(SA, { d: 1 }); go(SA);
  check("flow: A1 frees the benefit at .5, the rest held (" + a1 + "); a miss records 0 and stays (" + miss + "); benefit 1 hits (" + hit + "); A2 frees how close young settle at 2 (" + a2 + "); three hits finish A (" + Gates.A.done + ")", a1 && miss && hit && a2 && Gates.A.done);
  setC(SB, { d: 1 }); go(SB); next(SB);
  const b2 = cls("B", "b").contains("settable") && cls("B", "d").contains("settable") && cls("B", "c").contains("locked");
  setC(SB, { b: 1.5 }); go(SB); next(SB); setC(SB, { c: 0.2 }); go(SB);
  check("flow: B2 frees both benefit and how close (" + b2 + "); three hits finish B (" + Gates.B.done + ")", b2 && Gates.B.done);
  setC(SC, { d: 2 }); go(SC); next(SC); setC(SC, { b: 1 }); go(SC);
  check("flow: two hits finish C (" + Gates.C.done + ")", Gates.C.done);
  const d1 = cls("D", "q").contains("settable") && cls("D", "k").contains("locked");
  setC(SD, { q: 0.6 }); go(SD); next(SD); setC(SD, { k: 0.5 }); go(SD);
  check("flow: D1 frees the drive, holds the cost (" + d1 + "); two hits finish D (" + Gates.D.done + ")", d1 && Gates.D.done);
  let n = 0; for (let i = 0; i < 10; i++) if (Score.isAnswered("scaffold", i)) n++;
  const bits = Object.keys(BIT).map(k => Score.getBit("scaffold", BIT[k])).join("");
  check("all 10 declared bits written (" + n + "; bits " + bits + "); the lesson ends", n === 10 && bits.startsWith("0") && Gates.D.done && document.getElementById("done-banner").classList.contains("shown"));
}
{
  const infos = [...document.querySelectorAll(".info")], tipOf = e => e.dataset.tip ? document.getElementById(e.dataset.tip) : e.querySelector(".tip");
  const empty = infos.filter(e => !tipOf(e) || !tipOf(e).textContent.trim()).length;
  check("hover text: " + infos.length + " marks, " + empty + " empty", infos.length >= 16 && empty === 0);
  FIT_EPOCH++; paintAll();
  const over = []; for (const id of ${JSON.stringify(CANVAS_IDS)}) { const cv = document.getElementById(id), host = cv.parentElement; if (+cv.dataset.drawW > host.clientWidth + 1) over.push(id + " " + cv.dataset.drawW + ">" + host.clientWidth); }
  check("every canvas fits its panel (" + window.innerWidth + " wide)", over.length === 0, over.join(", "));
  const lastOk = ["A", "B", "C", "D"].every(K => { const els = document.querySelectorAll("#stage" + K + " .panel"), last = els[els.length - 1]; return last.matches("details.rcode") && !last.open; });
  check("layout: each stage's R code last and closed; no readout lines", lastOk && document.querySelectorAll(".readout").length === 0);
}
for (const S of STAGES) S.cfg.paint();
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
<iframe id="f" src="http://127.0.0.1:${PORT}/app/lessons/lesson22.html?preview=1" width="1500" height="1000"></iframe>
<iframe id="g" src="http://127.0.0.1:${PORT}/app/lessons/lesson22.html?preview=1" width="1000" height="900"></iframe>
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
const probePath = path.join(ROOT, "_check_l22_" + PORT + ".html");
fs.writeFileSync(probePath, probe);
const server = spawn("python3", ["-m", "http.server", String(PORT), "--directory", ROOT], { stdio: "ignore", detached: true });
const cleanup = () => { try { process.kill(-server.pid); } catch (e) {} try { fs.unlinkSync(probePath); } catch (e) {} };
process.on("exit", cleanup);
setTimeout(() => {
  const r = spawnSync(CHROME, ["--headless=new", "--disable-gpu", "--virtual-time-budget=6000000", "--dump-dom", `http://127.0.0.1:${PORT}/_check_l22_${PORT}.html`], { encoding: "utf8", maxBuffer: 1 << 28 });
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
  else for (const K of ["A", "B", "C", "D"]) {
    const src = (lines.find(l => l.startsWith("R" + K + " ")) || "").slice(3).replace(/\\n/g, "\n"), fixed = src.replace(/G <- \d+/, "G <- 3");
    const o = spawnSync("Rscript", ["-e", fixed + "\ncat('\\nOK\\n')"], { encoding: "utf8", timeout: 240000 }), ok = /OK/.test(o.stdout || "");
    console.log((ok ? "ok   " : "FAIL ") + "the R panel of stage " + K + " runs (3 generations)" + (ok ? "  -- " + (o.stdout || "").trim().split("\n").slice(-3, -1).join(" ").replace(/\s+/g, " ") : "  -- " + (o.stderr || "").trim().split("\n").slice(-3).join(" ")));
    if (!ok) bad = true;
  }
  cleanup(); process.exit(bad ? 1 : 0);
}, 700);
