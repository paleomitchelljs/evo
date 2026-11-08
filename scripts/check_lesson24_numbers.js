#!/usr/bin/env node
/*
 * check_lesson24_numbers.js -- the checks for app/lessons/lesson24.html.
 *
 * Lesson 24, draft 2 (2026-11-07): evo-devo with named genes, every
 * control a gene's expression. A one cell's Hes7; B the embryo (Hes7,
 * Fgf8 mRNA, Mesp2, somites); C where a limb goes (Hoxc6, Hoxc10, Tbx5,
 * Tbx4, Fgf10); D a bud that stops itself (Fgf8, Shh, Grem1, Bmp4); E the
 * skeleton (Sox9, Bmp, Wnt; Hox13, Gli3). What has to hold:
 *
 *   Engine. A: without binding the protein settles at k a hm hp / ln2^2
 *      (the closed form beside the measurement); the delay makes the
 *      pulse and sets its period; a shorter-lived protein swings harder.
 *      B: one intron more somites than three, none no somites; a
 *      slower-decaying protein, somites stop; a longer-lived Fgf8 mRNA,
 *      more Hes7 stripes in the tail. C: the limbs where Hoxc6 and Hoxc10
 *      start, Fgf10 in the flank makes an arm or a leg by Tbx5 or Tbx4,
 *      Hoxc6 from the head loses the forelimb. D: the bud stops itself,
 *      its length set by Shh, not by Fgf8's speed; more Grem1, longer.
 *   Rounds. Each target hit by its intended setting, missed by its
 *      opening (E: over the page's seed).
 *   Flow. 15 bits written; the lesson ends.
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
const CANVAS_IDS = ["A_cell", "A_strip", "A_tpic", "B_emb", "B_tpic", "C_emb", "C_tpic", "D_bud", "D_series", "D_tpic", "E_limb", "E_all", "E_tpic"];

const INNER = `
const L_=[], say=s=>L_.push(s);
let bad=0, ran=0;
const check=(name, ok, detail)=>{ ran++; if(!ok) bad++; say((ok?"ok   ":"FAIL ")+name+(detail?"  -- "+detail:"")); };
for (const k in Gates) { Gates[k].open = true; document.getElementById("stage" + k).classList.remove("stage-locked"); }
/* ================= the engines ================= */
{
  const cell = P => { const w = cellWorld(Object.assign({ fb: 1, tau: 33, hm: 3, hp: 22 }, P)); w.t = HX.T / HX.frame; return CELL.stat(w); };
  const free = [3, 6, 12].map(hm => [cell({ fb: 0, hm }).prot, HX.k * HX.a * hm * 22 / Math.LN2 / Math.LN2]);
  const d = TAU_V.map(tau => cell({ tau })), h = [11, 16, 22, 30].map(hp => cell({ hp }).swing);
  check("A engine: without binding the protein settles at " + free.map(([m, c]) => Math.round(m) + " (k a hm hp / ln2^2 = " + Math.round(c) + ")").join(", ") +
        "; the delay none / 1 intron / 3 introns: swing " + d.map(x => f2(x.swing)).join(" / ") + ", a peak every " + d.map(x => x.per ? Math.round(x.per) : "-").join(" / ") + " min; protein half-life 11 / 16 / 22 / 30: swing " + h.map(f2).join(" / "),
        free.every(([m, c]) => Math.abs(m / c - 1) < 0.01) && d[0].swing < 0.05 && d[1].swing >= 0.2 && d[2].swing > d[1].swing && d[1].per < d[2].per && d[2].per > 110 && d[2].per < 135 && h[0] > h[1] && h[1] > h[2] && h[2] > h[3]);
}
{
  const emb = P => { const w = emWorld(Object.assign({ tau: 33, hp: 22, hF: 400 }, P)); w.t = EM.T / EM.frame; return emCells(w); };
  const t = TAU_V.map(tau => emb({ tau })), h30 = emb({ hp: 30 }), f = HF_V.map(hF => emb({ hF }));
  check("B engine: somites in 24 hours with no introns / 1 / 3: " + t.map(e => e.somites).join(" / ") + " (none: one long block of " + t[0].tail + " cells); protein half-life 30: " + h30.somites + " somites, then a block of " + h30.tail + " cells; Fgf8 mRNA half-life 800 / 400 / 200: Hes7 stripes in the tail " + f.map(e => e.stripes).join(" / "),
        t[0].somites <= 2 && t[1].somites > t[2].somites && t[2].somites >= 8 && h30.somites <= 5 && h30.tail > 60 && f[0].stripes > f[1].stripes && f[1].stripes >= f[2].stripes);
}
{
  const s = r => r.limbs.map(x => x.kind + "@" + (x.at + 1)).join(" "), n = posLimbs({ c6: 8, fg: -1 }), late = posLimbs({ c6: 12, fg: -1 }), py = posLimbs({ c6: 1, fg: -1 }), leg = posLimbs({ c6: 8, fg: 15 }), arm = posLimbs({ c6: 8, fg: 10 }), nk = posLimbs({ c6: 8, fg: 3 });
  check("C engine: the limbs: " + s(n) + "; Hoxc6 from somite 12: " + s(late) + "; from somite 1: " + s(py) + " (no forelimb); Fgf10 in the flank at somite 16: " + s(leg) + "; at 11: " + s(arm) + "; at 4 (no Tbx): " + s(nk),
        n.armAt === 8 && n.legs === 1 && late.armAt === 12 && late.legs === 1 && py.arms === 0 && py.legs === 1 && leg.legs === 2 && leg.arms === 1 && arm.arms === 2 && nk.limbs.length === 2);
}
{
  const bud = P => { const w = bdWorld(Object.assign({ sh: 1, gr: 20, f: 1 }, P)); for (let t = 0; t < 160; t++) bdStep(w); return bdStat(w); };
  const r = SH_V.map(sh => bud({ sh })), f2x = bud({ f: 2 }), g = GR_V.map(gr => bud({ gr }));
  check("D engine: the bud stops by itself; length (mm) by Shh x .3 / 1 / 3: " + r.map(x => x.len.toFixed(2)).join(" / ") + ", stopping at hour " + r.map(x => x.hours.toFixed(1)).join(" / ") + "; Fgf8 x 2: " + f2x.len.toFixed(2) + " mm at hour " + f2x.hours.toFixed(1) + " (the same length, sooner); Grem1 x .25 / 1 / 4: " + g.map(x => x.len.toFixed(2)).join(" / "),
        r[0].len < r[1].len && r[1].len < r[2].len && r.every(x => x.ridge === 0) && Math.abs(f2x.len - r[1].len) < 0.1 && f2x.hours < r[1].hours * 0.6 && g[0].len < g[1].len && g[1].len < g[2].len);
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
T("A", 0, [{ hm: 6 }], [{ hm: 3 }, { hm: 12 }]);
T("A", 1, [{ tau: 26.6 }, { tau: 33 }], [{ tau: 14 }]);
T("A", 2, [{ hp: 16 }, { hp: 11 }], [{ hp: 22 }, { hp: 30 }]);
T("B", 0, [{ tau: 26.6 }], [{ tau: 33 }, { tau: 14 }]);
T("B", 1, [{ hp: 30 }], [{ hp: 22 }, { hp: 16 }]);
T("B", 2, [{ hF: 800 }], [{ hF: 400 }, { hF: 200 }]);
T("C", 0, [{ c6: 12 }], [{ c6: 8 }, { c6: 1 }]);
T("C", 1, [{ fg: 15 }, { fg: 12 }], [{ fg: -1 }, { fg: 10 }, { fg: 3 }]);
T("C", 2, [{ c6: 1 }], [{ c6: 8 }, { c6: 12 }]);
T("D", 0, [{ sh: 1 }], [{ sh: 0.3 }, { sh: 3 }]);
T("D", 1, [{ f: 2 }], [{ f: 1 }]);
T("D", 2, [{ gr: 80 }], [{ gr: 20 }, { gr: 5 }]);
T("E", 0, [{ hx: 1 }], [{ hx: 0.5 }, { hx: 3 }]);
T("E", 1, [{ hx: 3 }], [{ hx: 1 }]);
T("E", 2, [{ g: 0 }], [{ g: 1 }]);
{ const q = play("D", 1, { f: 2 }), e = sumAt(q, q.G);
  check("D2 at Fgf8 x 2: the bud " + e.len.toFixed(2) + " mm (still 1.6-1.8: the speed changed when, not how long)", e.len >= 1.6 && e.len <= 1.8); }
/* ================= the flow ================= */
{
  for (const S of STAGES) { S.round = 0; S.done = false; S.waiting = false; S.results = []; S.last = null; const pr = document.getElementById(S.K + "_practice"); if (pr) pr.checked = false; openRound(S); }
  for (const k in Gates) Gates[k].done = false; paintAll();
  const go = S => { document.getElementById(S.K + "_go").click(); finishNow(S); }, next = S => document.getElementById(S.K + "_next").click();
  const cls = (K, id) => (document.querySelector("#" + K + '_paths [data-of="' + id + '"]') || { classList: { contains: () => false } }).classList;
  const a1 = cls("A", "hm").contains("settable");
  go(SA); const miss = Score.getBit("scaffold", BIT.A1) === 0 && !SA.waiting;
  setC(SA, { hm: 6 }); go(SA); const hit = SA.waiting; next(SA);
  setC(SA, { tau: 33 }); go(SA); next(SA); setC(SA, { hp: 16 }); go(SA);
  check("flow: A's arrows settable (" + a1 + "); a miss records 0 (" + miss + "); a hit waits (" + hit + "); three hits finish A (" + Gates.A.done + ")", a1 && miss && hit && Gates.A.done);
  setC(SB, { tau: 26.6 }); go(SB); next(SB); setC(SB, { hp: 30 }); go(SB); next(SB); setC(SB, { hF: 800 }); go(SB);
  check("flow: three hits finish B (" + Gates.B.done + ")", Gates.B.done);
  setC(SC, { c6: 12 }); go(SC); next(SC);
  /* Fgf10 by a click on the flank under somite 16 */
  { const cv = document.getElementById("C_emb"), r = cv.getBoundingClientRect(), k = r.width / 760;
    cv.dispatchEvent(new MouseEvent("click", { clientX: r.left + (CX.x0 + 15 * CX.bw + CX.bw / 2) * k, clientY: r.top + (CX.fy + 15) * k, bubbles: true })); }
  const clicked = readSet(SC).fg === 15; go(SC); next(SC); setC(SC, { c6: 1 }); go(SC);
  check("flow: a click on the flank under somite 16 switches Fgf10 on there (" + clicked + "); three hits finish C (" + Gates.C.done + ")", clicked && Gates.C.done);
  setC(SD, { sh: 1 }); go(SD); next(SD); setC(SD, { f: 2 }); go(SD); next(SD); setC(SD, { gr: 80 }); go(SD);
  check("flow: three hits finish D (" + Gates.D.done + ")", Gates.D.done);
  setC(SE, { hx: 1 }); go(SE); next(SE); setC(SE, { hx: 3 }); go(SE); next(SE); setC(SE, { g: 0 }); go(SE);
  check("flow: three hits finish E (" + Gates.E.done + ")", Gates.E.done);
  let n = 0; for (let i = 0; i < 15; i++) if (Score.isAnswered("scaffold", i)) n++;
  const bits = Object.keys(BIT).map(k => Score.getBit("scaffold", BIT[k])).join("");
  check("all 15 declared bits written (" + n + "; bits " + bits + "); the lesson ends", n === 15 && bits.startsWith("0") && Gates.E.done && document.getElementById("done-banner").classList.contains("shown"));
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
