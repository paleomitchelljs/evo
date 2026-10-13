#!/usr/bin/env node
/*
 * check_lesson18_numbers.js -- the checks for app/lessons/lesson18.html.
 *
 * Lesson 18 is the interactive exam key (draft, 2026-10-12): Exam 02's five
 * questions and its ARRB2 extra credit, each with a simulation and a target
 * shaped like the question's figure or table. What has to hold:
 *
 *   A. Before the typhoon: the balance agrees with sqrt(u/s) (h 0) and
 *      u/(hs) (h large); the target hit by u/s near 3e-5 with h 0, missed by
 *      the opening and by h .1. After it: 1+ of 100 islands at 10%+ hit by
 *      slow regrowth and a big family for the carrier (2+ of 3 tries),
 *      missed by fast regrowth; F rises more the slower the regrowth.
 *   B. The table hit by u .02 with three in four box young from
 *      relatives; missed with none (no gap) and with all (too inbred); He
 *      higher in box than spotted at the same u (the key's (d): open point).
 *   C. All 10 at C's peak at N 300 and 1200; 1+ of 10 reach B's peak at N
 *      6 (4+ of 5 tries; pooled reach counts); B lost first most often at
 *      N 1200.
 *   D. The 17 points matched with heavy hunting and missed at the opening;
 *      after the ban, a rise slower than the fall needs the rams' edge;
 *      cov(w, z) ~0 before 1995 at edge 0, positive with an edge, negative
 *      while hunted; V_A and breeding rams fall while hunted.
 *   E. The eleven tumors matched only at 1000 AD and 1,900 a year; dN/dS
 *      hit at s .01 / .01, missed off it; measured against the closed form.
 *   F. The three boxes hit at d -17, h .5 (2+ of 3 tries); missed at h .75,
 *      h 0, d -25 and the opening.
 *   Flow. every stage open with the name; a scored miss records 0 and the
 *      key stays shut; hits open the key; every bit written; the banner.
 *   All. every canvas fits its panel (1500 and 1000 wide);
 *
 * Same harness as check_lesson17_numbers.js.
 *
 * Usage:  node scripts/check_lesson18_numbers.js      (~3 minutes)
 * Exit 0 iff every check passes. Needs Google Chrome and python3.
 */
const { spawn, spawnSync } = require("child_process");
const fs = require("fs"), path = require("path");

const ROOT = path.resolve(__dirname, "..");
const PORT = +process.env.PORT || 8796;
const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

const CANVAS_IDS = ["A_hist","A_traj","B_time","C_land","D_plot","D_time","E_plot","E_time","F_plot"];
const INNER = `
const L_=[], say=s=>L_.push(s);
let bad=0, ran=0;
const check=(name, ok, detail)=>{ ran++; if(!ok) bad++; say((ok?"ok   ":"FAIL ")+name+(detail?"  -- "+detail:"")); };
const setC = (S, o) => { for (const k in o) { const c = S.cfg.ctl.find(c => c.key === k), i = c.vals.indexOf(o[k]); if (i < 0) throw new Error(S.P + ": no " + k + " = " + o[k] + " on the slider"); document.getElementById(S.P + "_" + k).value = i - (c.mid || 0); } syncVals(S); };
/* keep going until a part is done, at most 12 more tries (a miss forever is a failure, not a hang) */
const until = S => { for (let k = 0; k < 12 && !S.done; k++) { goPart(S); finishNow(S); } };
const play = (S, r, o, n) => { S.round = r; S.waiting = false; S.done = false; document.getElementById(S.P + "_practice").checked = true; openRound(S); setC(S, o);
  const out = []; for (let k = 0; k < (n || 2); k++) { goPart(S); finishNow(S); out.push(S.last.sum); } return out; };
const hitN = (S, r, o, n) => play(S, r, o, n).filter(x => judge(S.cfg.rounds[r], x).ok).length;
const show = o => JSON.stringify(o).replace(/"/g, "");
const tgt = (S, r, good, badOnes, n, need) => {
  n = n || 2; need = need == null ? n : need;
  const g = good.map(o => [o, hitN(S, r, o, n)]), b = badOnes.map(o => [o, hitN(S, r, o, 2)]);
  check(S.P + " target " + (r + 1) + ": hit by " + good.map(show).join(", ") + " (" + need + "+ of " + n + "); missed by " + badOnes.map(show).join(", "),
        g.every(x => x[1] >= need) && b.every(x => x[1] === 0), g.map(x => show(x[0]) + " " + x[1] + "/" + n).concat(b.map(x => show(x[0]) + " " + x[1] + "/2")).join("; "));
};

/* ================= A ================= */
{
  const q0 = A_balance(1e-5, 0.3, 0), q1 = A_balance(1e-5, 0.3, 0.5);
  check("A: balance q " + q0.toPrecision(3) + " against sqrt(u/s) " + Math.sqrt(1e-5 / 0.3).toPrecision(3) + " (h 0); " + q1.toPrecision(3) + " against u/(hs) " + (1e-5 / 0.15).toPrecision(3) + " (h .5)",
        Math.abs(q0 / Math.sqrt(1e-5 / 0.3) - 1) < 0.05 && Math.abs(q1 / (1e-5 / 0.15) - 1) < 0.1);
}
tgt(PA, 0, [{ u: 1e-6, s: 0.3, h: 0, N: 20, f: 0 }, { u: 1e-6, s: 0.1, h: 0, N: 10, f: 0.25 }], [{ u: 1e-6, s: 1, h: 0.5, N: 300, f: 0 }, { u: 1e-6, s: 0.3, h: 0, N: 100, f: 0.25 }, { u: 1e-6, s: 0.01, h: 0, N: 300, f: 0 }, { u: 1e-6, s: 1, h: 0.5, N: 10, f: 0 }], 3, 2);
{
  const small = play(PA, 0, { u: 1e-6, s: 0.3, h: 0, N: 10, f: 0 }, 1)[0], big = play(PA, 0, { u: 1e-6, s: 0.3, h: 0, N: 300, f: 0 }, 1)[0];
  const sib = play(PA, 0, { u: 1e-6, s: 0.3, h: 0, N: 20, f: 0.25 }, 1)[0], none = play(PA, 0, { u: 1e-6, s: 0.3, h: 0, N: 20, f: 0 }, 1)[0];
  check("A: F (ten neutral genes) is higher in a small census, " + small.F.toFixed(2) + " (N 10) against " + big.F.toFixed(2) + " (N 300); and with siblings mating, " + sib.F.toFixed(2) + " against " + none.F.toFixed(2) + " (N 20); drift alone at N 10 " + (1 - Math.pow(1 - 1 / 20, 9)).toFixed(2),
        small.F > big.F + 0.1 && sib.F > none.F + 0.02 && Math.abs(small.F - (1 - Math.pow(1 - 1 / 20, 9))) < 0.1);
}

/* ================= B ================= */
tgt(PB, 0, [{ mu: 0.025, sb: 0.1, hb: 0.02, bs: 0, bb: 0.7 }], [{ mu: 0.005, sb: 0, hb: 0.1, bs: 0, bb: 0 }, { mu: 0.025, sb: 0, hb: 0.02, bs: 0, bb: 0.7 }, { mu: 0.025, sb: 0.1, hb: 0.02, bs: 0, bb: 0 }, { mu: 0.025, sb: 0.1, hb: 0.02, bs: 0.7, bb: 0.7 }], 3, 2);
{
  const x = play(PB, 0, { mu: 0.02, sb: 0, hb: 0.02, bs: 0, bb: 0 }, 1)[0], y = play(PB, 0, { mu: 0.02, sb: 0.1, hb: 0.02, bs: 0, bb: 0.7 }, 1)[0];
  const cf = N => 4 * N * 0.02 / (1 + 4 * N * 0.02);
  check("B: random mating, s 0: He " + x.sHe.toFixed(2) + " / " + x.bHe.toFixed(2) + " against 4Nu/(1 + 4Nu) " + cf(39).toFixed(2) + " / " + cf(109).toFixed(2) + "; hatching " + pc(x.sHat) + " / " + pc(x.bHat) + " (nothing to expose); with s .1 and relatives, box hatching falls to " + pc(y.bHat),
        Math.abs(x.sHe - cf(39)) < 0.1 && Math.abs(x.bHe - cf(109)) < 0.1 && x.sHat > 0.9 && x.bHat > 0.9 && y.bHat < 0.7);
}

/* ================= C ================= */
tgt(PC, 0, [{ N: 1200 }, { N: 300 }], [{ N: 12 }], 3, 2);
tgt(PC, 1, [{ N: 6 }], [{ N: 1200 }], 5, 4);
{
  const big = play(PC, 0, { N: 1200 }, 2), small = play(PC, 0, { N: 6 }, 4);
  const lostB = big.reduce((a, s) => a + s.lost[1], 0), lostAll = big.reduce((a, s) => a + s.lost[0] + s.lost[1] + s.lost[2], 0);
  const reach = small.reduce((a, s) => a + s.reachB, 0), reachBig = big.reduce((a, s) => a + s.reachB, 0);
  check("C: at N 1200 B is the lineage lost first in " + lostB + " of " + lostAll + " populations; B's peak reached in " + reach + " of 40 at N 6, " + reachBig + " of 20 at N 1200", lostB > lostAll / 2 && reach >= 4 && reachBig === 0);
}

/* ================= D ================= */
tgt(PD, 0, [{ H: 0.7, pref: 50, h2: 0.8, b: 0 }, { H: 0.9, pref: 4, h2: 0.6, b: 0.1 }], [{ H: 0.3, pref: 50, h2: 0.4, b: 0 }, { H: 0.7, pref: 0, h2: 0.8, b: 0 }]);
tgt(PD, 1, [{ H: 0.7, pref: 50, h2: 0.8, b: 0.3 }, { H: 0.9, pref: 50, h2: 0.8, b: 0.3 }], [{ H: 0.7, pref: 50, h2: 0.8, b: 0 }, { H: 0, pref: 50, h2: 0.8, b: 0.3 }]);
{
  const z = play(PD, 1, { H: 0.7, pref: 50, h2: 0.8, b: 0 }, 1)[0], e = play(PD, 1, { H: 0.7, pref: 50, h2: 0.8, b: 0.3 }, 1)[0];
  check("D: cov(w, z)/w̄ before 1995 " + z.covBefore.toFixed(2) + " at edge 0, " + e.covBefore.toFixed(2) + " at edge .3; while hunted " + z.covHunt.toFixed(2) + "; V_A " + z.va1995.toFixed(1) + " -> " + z.va2020.toFixed(1) + "; rams that sired " + z.ramsBefore.toFixed(0) + " -> " + z.ramsHunt.toFixed(0) + "; neutral heterozygosity " + z.hn1995.toFixed(3) + " -> " + z.hn2020.toFixed(3),
        Math.abs(z.covBefore) < 0.3 && e.covBefore > 1 && z.covHunt < -2 && z.va2020 < 0.6 * z.va1995 && z.ramsHunt < 0.5 * z.ramsBefore && z.hn2020 < z.hn1995);
}
{
  const hunted = herds => meanOf(herds.flatMap(h => h.slice(6, 16).map(r => r.shotZ)));
  const lo = play(PD, 0, { H: 0.7, pref: 0, h2: 0.8, b: 0 }, 1)[0], hi = play(PD, 0, { H: 0.7, pref: 50, h2: 0.8, b: 0 }, 1)[0];
  const qLo = PD.last && PD.last, z = { lo: lo.z2020, hi: hi.z2020 };
  check("D: with hunters indifferent to horns (preference none) the horn mean ends at " + z.lo.toFixed(1) + " cm; picking the largest, " + z.hi.toFixed(1) + " cm (the horn's own link to deaths is 0 throughout)", z.lo > 68 && z.hi < 56);
}

/* ================= E ================= */
tgt(PE, 0, [{ N: 100, y0: 1000, r: 1900 }], [{ N: 100, y0: -4000, r: 300 }, { N: 100, y0: 1000, r: 1800 }, { N: 100, y0: 900, r: 1900 }, { N: 100, y0: -4000, r: 1900 }]);
tgt(PE, 1, [{ hk: -0.05, im: 0.05, oth: 0, N: 100 }], [{ hk: 0, im: 0, oth: 0, N: 100 }, { hk: -0.01, im: 0.01, oth: 0, N: 100 }, { hk: -0.1, im: 0.1, oth: 0, N: 100 }, { hk: 0.05, im: -0.05, oth: 0, N: 100 }], 3, 2);
tgt(PE, 2, [{ hk: -0.05, im: 0.05, oth: 0, N: 100 }], [{ hk: 0, im: 0, oth: 0, N: 100 }, { hk: -0.01, im: 0.01, oth: 0, N: 100 }], 3, 2);
{
  const x = play(PE, 1, { hk: 0, im: 0, oth: 0, N: 100 }, 2), y = play(PE, 1, { hk: -0.05, im: 0.05, oth: 0, N: 100 }, 2);
  const tm = meanOf(x.map(v => v.tmrca)), pi = meanOf(x.map(v => v.pi)), tms = meanOf(y.map(v => v.tmrca)), pis = meanOf(y.map(v => v.pi));
  check("E: no selection, the common ancestor " + tm.toFixed(0) + " generations back against 2N 200, differences between two cells " + Math.round(pi) + " against 2 N rate 380,000, dN/dS ~1 (" + x.map(v => f2(v.hk) + "/" + f2(v.im) + "/" + f2(v.all)).join(", ") + "); with s -.05 and +.05 the ancestor " + tms.toFixed(0) + " and differences " + Math.round(pis),
        Math.abs(tm / 200 - 1) < 0.5 && Math.abs(pi / 380000 - 1) < 0.5 && x.every(v => Math.abs(v.hk - 1) < 0.45 && Math.abs(v.im - 1) < 0.45) && tms < tm && pis < 0.7 * pi);
}

/* ================= F ================= */
tgt(PF, 0, [{ d: -17, h: 0.5 }], [{ d: -5, h: 0 }, { d: -17, h: 0.75 }, { d: -17, h: 0 }, { d: -25, h: 0.5 }], 3, 2);

/* ================= the flow, scored ================= */
{
  const before = Object.keys(Gates).filter(K => !document.getElementById("stage" + K).classList.contains("stage-locked")).length;
  const flow = (S, rounds) => {
    S.round = 0; S.results = []; S.done = false; S.waiting = false; S.last = null; document.getElementById(S.P + "_practice").checked = false; openRound(S); syncPart(S);
    goPart(S); finishNow(S);
    const miss = Score.getBit("scaffold", BIT[S.cfg.bits[0]]) === 0 && !S.waiting;
    rounds.forEach((o, r) => { setC(S, o); goPart(S); finishNow(S); if (r < rounds.length - 1) nextRound(S); });
    return { miss, bits: S.cfg.bits.map(b => Score.getBit("scaffold", BIT[b])).join("") };
  };
  for (const K in Gates) Gates[K].done = false;
  const keyShut = document.getElementById("keyA").textContent.indexOf("Hit this question") >= 0;
  const a = flow(PA, [{ u: 1e-6, s: 0.3, h: 0, N: 20, f: 0 }]); until(PA);
  const keyOpen = /drift/.test(document.getElementById("keyA").textContent);
  const b = flow(PB, [{ mu: 0.025, sb: 0.1, hb: 0.02, bs: 0, bb: 0.7 }]); until(PB);
  const c = flow(PC, [{ N: 1200 }, { N: 6 }]); until(PC);
  const d = flow(PD, [{ H: 0.7, pref: 50, h2: 0.8, b: 0.1 }, { H: 0.7, pref: 50, h2: 0.8, b: 0.3 }]); until(PD);
  const e = flow(PE, [{ y0: 1000, r: 1900 }, { hk: -0.05, im: 0.05, oth: 0 }, { hk: -0.05, im: 0.05, oth: 0 }]); until(PE);
  const f = flow(PF, [{ d: -17, h: 0.5 }]); until(PF);
  check("flow: all six stages open with the name (" + before + "); the key shut before (" + keyShut + ") and open after the target (" + keyOpen + ")", before === 6 && keyShut && keyOpen);
  check("flow: each opening run records 0 (" + [a, b, c, d, e, f].map(x => x.miss).join(",") + "); bits " + [a, b, c, d, e, f].map(x => x.bits).join(" "),
        [a, b, c, d, e, f].every(x => x.miss) && a.bits === "0" && c.bits.startsWith("0") && d.bits.startsWith("0") && e.bits.startsWith("0"));
  const n = Object.keys(BIT).filter(k => Score.isAnswered("scaffold", BIT[k])).length;
  check("all " + Object.keys(BIT).length + " declared bits written; every stage done; the banner shown", n === 10 && Object.values(Gates).every(g => g.done) && document.getElementById("done-banner").classList.contains("shown"), n + " written");
}
{
  FIT_EPOCH++; paintAll();
  const over = [];
  for (const id of ${JSON.stringify(CANVAS_IDS)}) { const cv = document.getElementById(id), host = cv.parentElement;
    if (+cv.dataset.drawW > host.clientWidth + 1) over.push(id + " " + cv.dataset.drawW + ">" + host.clientWidth); }
  check("every canvas fits its panel (" + window.innerWidth + " wide)", over.length === 0, over.join(", "));
}
say(bad ? ("FAILED " + bad) : "ALL BARS PASS");
say("RAN " + ran);
L_.join(" ;; ");
`;

const INNER_NARROW = `
for (const K of ["A","B","C","D","E","F"]) document.getElementById("stage"+K).classList.remove("stage-locked");
FIT_EPOCH++; paintAll();
const over = [];
for (const id of ${JSON.stringify(CANVAS_IDS)}) { const cv = document.getElementById(id), host = cv.parentElement;
  if (+cv.dataset.drawW > host.clientWidth + 1) over.push(id + " " + cv.dataset.drawW + ">" + host.clientWidth); }
(over.length ? "FAIL " : "ok   ") + "every canvas fits its panel (" + window.innerWidth + " wide)" + (over.length ? "  -- " + over.join(", ") : "");
`;

/* the score library opens the page's stages when a name is confirmed; the check types one in first */
const probe = `<!doctype html><meta charset="utf-8"><title>pending</title>
<iframe id="f" src="http://127.0.0.1:${PORT}/app/lessons/lesson18.html?preview=1" width="1500" height="1000"></iframe>
<iframe id="g" src="http://127.0.0.1:${PORT}/app/lessons/lesson18.html?preview=1" width="1000" height="900"></iframe>
<pre id="out"></pre><pre id="out2"></pre>
<script>
const SRC = ${JSON.stringify(INNER)}, SRC2 = ${JSON.stringify(INNER_NARROW)};
let n = 0;
const run = (id, src, out) => document.getElementById(id).addEventListener("load", () => setTimeout(() => {
  const w = document.getElementById(id).contentWindow; let res;
  try { const d = w.document, inp = d.querySelector("#score-name input"), btn = d.querySelector("#score-name button");
        if (inp && btn) { inp.value = "Check Student"; inp.dispatchEvent(new w.Event("input")); btn.click(); } } catch (e) {}
  setTimeout(() => { try { res = String(w.eval(src)); } catch (e) { res = "THREW " + e.message + " @ " + (e.stack||"").split("\\n")[1]; }
    document.getElementById(out).textContent = res;
    if (++n === 2) document.title = "done"; }, 600);
}, 2500));
run("f", SRC, "out"); run("g", SRC2, "out2");
</script>`;

const probePath = path.join(ROOT, "_check_l18_" + PORT + ".html");
fs.writeFileSync(probePath, probe);
const server = spawn("python3", ["-m", "http.server", String(PORT), "--directory", ROOT], { stdio: "ignore", detached: true });
const cleanup = () => { try { process.kill(-server.pid); } catch (e) {} try { fs.unlinkSync(probePath); } catch (e) {} };
process.on("exit", cleanup);

setTimeout(() => {
  const r = spawnSync(CHROME, ["--headless=new", "--disable-gpu", "--virtual-time-budget=1500000", "--dump-dom", `http://127.0.0.1:${PORT}/_check_l18_${PORT}.html`],
                      { encoding: "utf8", maxBuffer: 1 << 28 });
  const dec = s => s.replace(/&quot;/g, '"').replace(/&gt;/g, ">").replace(/&lt;/g, "<").replace(/&amp;/g, "&");
  const m = /<pre id="out">([\s\S]*?)<\/pre>/.exec(r.stdout || ""), m2 = /<pre id="out2">([\s\S]*?)<\/pre>/.exec(r.stdout || "");
  if (!m) { console.error("no result -- is Chrome at " + CHROME + " ?"); cleanup(); process.exit(2); }
  const text = dec(m[1]), lines = text.split(" ;; ");
  let bad = !/ALL BARS PASS/.test(text);
  const tagged = t => (lines.find(l => l.startsWith(t + " ")) || "").slice(t.length + 1).replace(/\\n/g, "\n");
  for (const line of lines) if (!/^R[A-F] /.test(line)) console.log(line);
  const reported = lines.filter(l => /^(ok|FAIL)\s/.test(l)).length;
  const ranLine = /^RAN (\d+)$/.exec((lines.find(l => /^RAN \d+$/.test(l)) || ""));
  if (!ranLine || +ranLine[1] !== reported) { console.log("FAIL harness  " + (ranLine ? ranLine[1] : "?") + " checks ran, " + reported + " came back"); bad = true; }
  const narrow = m2 ? dec(m2[1]) : "FAIL narrow frame gave nothing";
  console.log(narrow); if (!/^ok/.test(narrow)) bad = true;
  cleanup();
  process.exit(bad ? 1 : 0);
}, 700);
