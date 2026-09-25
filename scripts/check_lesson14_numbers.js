#!/usr/bin/env node
/*
 * check_lesson14_numbers.js -- the bar checks for app/lessons/lesson14.html.
 *
 * Lesson 14 is a draft (2026-09-24): Stage A, births and deaths leaning on
 * crowding. What has to hold:
 *
 *   1. the crossing the page prints is where the two lines actually meet;
 *   2. populations settle at the crossing, measured over many runs;
 *   3. every round is hit at the lever value its level needs, missed at the
 *      lever's opening value, and the held arrows are the round's;
 *   4. B: births minus deaths is r (1 - N/K) on both sides of zero; the
 *      crossing printed is where the two lines meet; the r arrow moves the
 *      early share and the K arrow the late one; every pattern is hit by
 *      some setting, none by arrows at zero, and no setting clears three;
 *   5. C: each genotype's rates, averaged by quadrature, match a fine
 *      integral; offspring come in the proportions two gamete draws give;
 *      the spread printed is the spread of the individuals; the environment
 *      arrow leaves the allele's fate alone when the trait acts on r; the
 *      rounds as in 4; the dealt arrows are held in a round.
 *
 * Same harness as check_lesson11_numbers.js: the checks run inside a
 * same-origin iframe against the page's own functions; the report comes back
 * in a <pre>, and the runner fails if fewer checks come back than ran.
 *
 * Usage:  node scripts/check_lesson14_numbers.js
 * Exit 0 iff every bar passes. Needs Google Chrome and python3.
 */
const { spawn, spawnSync } = require("child_process");
const fs = require("fs"), path = require("path");

const ROOT = path.resolve(__dirname, "..");
const PORT = 8797;
const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

const INNER = `
const L=[], say=s=>L.push(s);
let bad = 0, ran = 0;
const check = (name, ok, detail) => { ran++; if (!ok) bad++; say((ok?"ok   ":"FAIL ") + name + "  " + detail); };
const mn = a => a.reduce((x,y)=>x+y,0)/a.length;

check("page loaded", !!(A && A.game && A.paths && B && B.game && B.paths && C && C.game && C.paths && typeof Score !== "undefined"), "Stages A-C, their diagrams and Score are defined");
check("slots declared match slots written", Object.keys(BIT).length === 3, Object.keys(BIT).length + " named bits, scaffold is 3");

/* ---- the crossing, found here by bisection on births minus deaths -------- */
{
  let worst = 0, n = 0; const rng = mulberry32(77);
  for (let q = 0; q < 200; q++) {
    const v = { b0: 0.3 + 0.9 * rng(), d0: 0.25 * rng(), bb: -0.2 * rng(), bd: 0.02 + 0.2 * rng() };
    const K = A_cross(v); if (K == null || K > 5000) continue;
    let lo = 0, hi = 20000; for (let k = 0; k < 200; k++) { const m = (lo + hi) / 2; if (A_birth(v, m) > A_death(v, m)) lo = m; else hi = m; }
    /* only where neither line has hit its floor or ceiling */
    if (A_birth(v, lo) <= 0 || A_death(v, lo) >= 1) continue;
    worst = Math.max(worst, Math.abs(lo - K)); n++;
  }
  check("A the crossing printed is where the lines meet", worst < 1e-6 && n > 100, n + " random diagrams: largest gap " + worst.toExponential(1));
}
/* the lever value a round's level needs, on the slider's steps */
const need = r => { const v = Object.assign({ b0: 0.6, bb: 0, d0: 0.2, bd: 0 }, r.fix), step = r.lever === "b0" || r.lever === "d0" ? 0.05 : 0.01;
  const lo = r.lever === "b0" || r.lever === "d0" ? 0 : -0.3, hi = r.lever === "b0" ? 1.2 : r.lever === "d0" ? 1 : 0.3;
  let best = null, gap = Infinity;
  for (let x = lo; x <= hi + 1e-9; x += step) { const u = Math.round(x / step) * step; v[r.lever] = +u.toFixed(4); const K = A_cross(v);
    if (K != null && Math.abs(K - r.K) < gap) { gap = Math.abs(K - r.K); best = +u.toFixed(4); } }
  v[r.lever] = best; return { val: best, v: Object.assign({}, v), K: A_cross(v) }; };
{
  /* the populations settle at the crossing */
  const rows = A_ROUNDS.map((r, i) => { const nd = need(r), lev = [];
    for (let q = 0; q < 30; q++) lev.push(A_level(A_run(nd.v, mulberry32(3000 + i * 131 + q * 7919))));
    return { k: r.key, K: nd.K, m: mn(lev) }; });
  check("A populations settle at the crossing", rows.every(q => Math.abs(q.m - q.K) <= 0.03 * q.K),
        rows.map(q => q.k + ": " + Math.round(q.m) + " [crossing " + Math.round(q.K) + "]").join("  ") + "  (generations 31-40, 30 runs each)");
}
{
  const rate = (r, v, reps, seed) => { let k = 0; for (let q = 0; q < reps; q++) if (Math.abs(A_level(A_run(v, mulberry32(seed + q * 7919))) - r.K) <= A_TOL * r.K) k++; return k / reps; };
  const hit = A_ROUNDS.map((r, i) => { const nd = need(r); return { k: r.key, val: nd.val, v: rate(r, nd.v, 40, 5000 + i * 97) }; });
  check("A every round is hit at the lever value its level needs", hit.every(q => q.v >= 0.9),
        hit.map(q => q.k + " @" + q.val + ": " + Math.round(100 * q.v) + "%").join("  ") + "  (40 runs each)");
  const open = A_ROUNDS.map((r, i) => { const v = Object.assign({ b0: 0.6, bb: 0, d0: 0.2, bd: 0 }, r.fix); v[r.lever] = r.start; return rate(r, v, 20, 6000 + i * 97); });
  check("A the lever's opening value hits none", open.every(v => v === 0), open.map(v => Math.round(100 * v) + "%").join(" / "));
  /* one value of each lever serves at most two of its rounds */
  const byLever = {}; A_ROUNDS.forEach(r => (byLever[r.lever] = byLever[r.lever] || []).push(r));
  let worst = 0; const detail = [];
  for (const lv in byLever) if (byLever[lv].length > 1) { const nd = byLever[lv].map(need);
    const cross = byLever[lv].map((r, j) => byLever[lv].filter((q, k) => { const v = Object.assign({}, nd[k].v); v[lv] = nd[j].val; const K = A_cross(v); return K != null && Math.abs(K - q.K) <= A_TOL * q.K; }).length);
    worst = Math.max(worst, ...cross); detail.push(lv + ": " + nd.map(n => n.val).join(" vs ")); }
  check("A two rounds on one lever need different values", worst <= 1, detail.join("; "));
}
{
  /* the deal holds the three arrows that are not the student's */
  const r = A.game.current(), v = A.v;
  const held = Object.keys(r.fix).every(k => Math.abs(v[k] - r.fix[k]) < 1e-9);
  check("A the held arrows are the round's", held, "round " + r.key + ": " + Object.keys(r.fix).map(k => k + " " + v[k] + " (dealt " + r.fix[k] + ")").join(", "));
}
/* ---- B: the trait on r and K -------------------------------------------- */
{
  /* births minus deaths, as the run splits it, against r (1 - N/K) */
  let worst = 0;
  for (const tr of [-0.3, 0, 0.3]) for (const tk of [-3000, 0, 3000]) for (const N of [0, 1000, 4000, 7000, 12000]) {
    const pp = B_rK(tr, tk);
    for (const i of [0, 1]) { const g = B_g(pp, i, N), b = Math.max(0, B_D0 + g), d = Math.min(1, B_D0 + Math.max(0, -(B_D0 + g)));
      if (d < 1) worst = Math.max(worst, Math.abs((b - d) - pp.r[i] * (1 - N / pp.K[i]))); }
  }
  check("B births minus deaths is r (1 - N/K), growing or shrinking", worst < 1e-12, "9 settings x 5 crowdings x 2 kinds: largest gap " + worst.toExponential(1));
  let gap = 0, n = 0;
  for (const tr of [-0.3, -0.1, 0.1, 0.3]) for (const tk of [-2000, -500, 500, 2000]) { const pp = B_rK(tr, tk), m = B_meet(pp); if (m == null) continue;
    gap = Math.max(gap, Math.abs(B_g(pp, 0, m) - B_g(pp, 1, m))); n++; }
  check("B the crossing printed is where the two lines meet", gap < 1e-12 && n > 8, n + " settings: largest gap in births minus deaths there " + gap.toExponential(1));
  /* r acts while uncrowded, K once crowded */
  const med = (tr, tk, t) => { const v = []; for (let q = 0; q < 15; q++) v.push(B_run(tr, tk, mulberry32(4000 + q * 7919 + Math.round(tr * 100) * 13 + tk)).share[t]); v.sort((a, b) => a - b); return v[7]; };
  const early = [-0.2, 0, 0.2].map(tr => med(tr, 0, 10)), late = [-1500, 0, 1500].map(tk => med(0, tk, 100));
  check("B the r arrow moves the early share, the K arrow the late one", early[0] < 0.4 && early[1] > 0.4 && early[1] < 0.6 && early[2] > 0.65 && late[0] < 0.05 && late[2] > 0.95,
        "share at generation 10, r arrow -0.2/0/+0.2: " + early.map(v => v.toFixed(2)).join(", ") + "  |  at 100, K arrow -1500/0/+1500: " + late.map(v => v.toFixed(2)).join(", ") + "  (medians of 15)");
}
{
  /* the r arrow in steps of 0.06 (on the slider's 0.02 steps, through 0 and +0.24) */
  const grid = []; for (let a = -0.3; a <= 0.3001; a += 0.06) for (let k = -3000; k <= 3000; k += 500) grid.push([+a.toFixed(2), k]);
  const rates = grid.map(([tr, tk], j) => { const h = B_ROUNDS.map(() => 0);
    for (let q = 0; q < 10; q++) { const sh = B_run(tr, tk, mulberry32(6000 + j * 131 + q * 7919)).share; B_ROUNDS.forEach((r, i) => { if (B_judge(sh, r)) h[i]++; }); }
    return h.map(v => v / 10); });
  const best = B_ROUNDS.map((r, i) => { let j = 0; rates.forEach((v, q) => { if (v[i] > rates[j][i]) j = q; });
    let c = 0; for (let q = 0; q < 40; q++) if (B_judge(B_run(grid[j][0], grid[j][1], mulberry32(8000 + i * 31 + q * 7919)).share, r)) c++;
    return { k: r.key, at: grid[j], v: c / 40 }; });
  check("B every pattern is hit by some setting", best.every(q => q.v >= 0.85),
        best.map(q => q.k + " @(" + q.at.join(", ") + "): " + Math.round(100 * q.v) + "%").join("  ") + "  (best of 143 by 10 runs, then 40 fresh)");
  const zero = B_ROUNDS.map((r, i) => { let c = 0; for (let q = 0; q < 20; q++) if (B_judge(B_run(0, 0, mulberry32(9000 + i * 31 + q * 7919)).share, r)) c++; return c / 20; });
  check("B the trait's arrows at zero hit none", zero.every(v => v === 0), zero.map(v => Math.round(100 * v) + "%").join(" / "));
  let most = 0, at = null; rates.forEach((v, j) => { const c = v.filter(x => x >= 0.5).length; if (c > most) { most = c; at = grid[j]; } });
  check("B no one setting clears three patterns", most <= 2, "143 settings, 10 runs each: the greediest (" + at.join(", ") + ") hits half the time or more in " + most);
}
/* ---- C: an allele and the environment make the trait -------------------- */
{
  /* the quadrature against a fine integral over the trait */
  let worst = 0;
  for (const v of [{ a: 1, e: 0.8, br: 0.3, bK: 0 }, { a: -1.2, e: 1.4, br: -0.2, bK: 2000 }, { a: 0.5, e: 0.3, br: 0.2, bK: -1500 }])
    for (const k of [0, 1, 2]) for (const N of [0, 3000, 6000]) {
      const [b, d] = C_rates(v, k, N), mu = v.a * (k - 1); let bi = 0, di = 0, wsum = 0;
      for (let q = -4000; q <= 4000; q++) { const x = q / 500, w = Math.exp(-x * x / 2), z = mu + v.e * x;
        const r = B_R0 + v.br * z, K = Math.max(100, B_K0 + v.bK * z), g = r * (1 - N / K);
        bi += w * Math.max(0, B_D0 + g); di += w * Math.min(1, B_D0 + Math.max(0, -(B_D0 + g))); wsum += w; }
      worst = Math.max(worst, Math.abs(b - bi / wsum), Math.abs(d - di / wsum)); }
  check("C each genotype's births and deaths, averaged by quadrature, match a fine integral", worst < 0.003, "27 cases: largest gap " + worst.toExponential(1));
  /* offspring genotypes: the page's two-step split of births against q², 2q(1-q), (1-q)² */
  const rng = mulberry32(55), q = 0.3, B = 1000; let s2 = 0, s1 = 0;
  for (let t = 0; t < 2000; t++) { const o2 = A_binom(rng, B, q * q), o1 = A_binom(rng, B - o2, 2 * q * (1 - q) / (1 - q * q)); s2 += o2 / B / 2000; s1 += o1 / B / 2000; }
  check("C offspring come in the proportions two draws from the gamete pool give", Math.abs(s2 - q * q) < 0.003 && Math.abs(s1 - 2 * q * (1 - q)) < 0.003,
        "q 0.3: two copies " + s2.toFixed(4) + " [" + (q * q).toFixed(4) + "], one " + s1.toFixed(4) + " [" + (2 * q * (1 - q)).toFixed(4) + "]  (2000 x 1000 births)");
  /* the spread printed, against individuals drawn from the starting genotypes */
  const rs = mulberry32(66); let sgap = 0;
  for (const v of [{ a: 1.4, e: 0 }, { a: 0.5, e: 1 }, { a: -1, e: 0.6 }]) { const zs = [];
    C_N0.forEach((n, k) => { for (let i = 0; i < n * 200; i++) zs.push(v.a * (k - 1) + v.e * A_gauss(rs)); });
    const m = mn(zs), sd = Math.sqrt(zs.reduce((x, z) => x + (z - m) * (z - m), 0) / zs.length); sgap = Math.max(sgap, Math.abs(sd - C_spread(v).sd)); }
  check("C the spread printed is the spread of the individuals", sgap < 0.02, "3 settings, 10000 individuals each: largest gap " + sgap.toFixed(4));
  /* the environment and the allele's fate */
  const med = (v, t) => { const x = []; for (let q2 = 0; q2 < 15; q2++) x.push(C_run(v, mulberry32(7000 + q2 * 7919)).p[t]); x.sort((a2, b2) => a2 - b2); return x[7]; };
  const rFlat = [0, 0.6, 1.2].map(e => med({ a: 1, e, br: 0.3, bK: 0 }, 30)), none = [0, 1.4].map(e => med({ a: 0, e, br: 0.3, bK: 0 }, 30));
  check("C with the trait acting on r, the environment arrow leaves the allele's fate alone", Math.max(...rFlat) - Math.min(...rFlat) < 0.03 && rFlat[0] > 0.8 && none.every(x => Math.abs(x - 0.5) < 0.1),
        "copies 1.0, environment 0 / 0.6 / 1.2: share at 30 " + rFlat.map(x => x.toFixed(2)).join(", ") + "  |  copies 0, environment 0 / 1.4: " + none.map(x => x.toFixed(2)).join(", ") + "  (medians of 15, same seeds)");
}
{
  const grid = []; for (let a = -1.5; a <= 1.5001; a += 0.1) for (let e = 0; e <= 1.5001; e += 0.1) grid.push([+a.toFixed(1), +e.toFixed(1)]);
  const V = (r, a, e) => ({ a, e, br: r.br, bK: r.bK });
  const rates = grid.map(([a, e], j) => C_ROUNDS.map((r, i) => { let c = 0; for (let q = 0; q < 8; q++) if (C_judge(V(r, a, e), C_run(V(r, a, e), mulberry32(11000 + j * 131 + q * 7919 + i)).p, r)) c++; return c / 8; }));
  /* the five best by 8 runs, each confirmed on 40 fresh: taking the first of
     many settings tied at 8/8 drifted to the edge of each round's region */
  const best = C_ROUNDS.map((r, i) => { const top = grid.map((g, j) => j).sort((x, y) => rates[y][i] - rates[x][i]).slice(0, 5);
    let pick = null; for (const j of top) { const [a, e] = grid[j]; let c = 0;
      for (let q = 0; q < 40; q++) if (C_judge(V(r, a, e), C_run(V(r, a, e), mulberry32(13000 + i * 31 + q * 7919)).p, r)) c++;
      if (!pick || c / 40 > pick.v) pick = { k: r.key, at: grid[j], v: c / 40 }; }
    return pick; });
  check("C every round is hit by some setting", best.every(q => q.v >= 0.85),
        best.map(q => q.k + " @(" + q.at.join(", ") + "): " + Math.round(100 * q.v) + "%").join("  ") + "  (top five of 496 by 8 runs, each then 40 fresh)");
  const open = C_ROUNDS.map((r, i) => { let c = 0; for (let q = 0; q < 20; q++) if (C_judge(V(r, 0, 0.5), C_run(V(r, 0, 0.5), mulberry32(15000 + i * 31 + q * 7919)).p, r)) c++; return c / 20; });
  check("C the opening arrows hit none", open.every(x => x === 0), open.map(x => Math.round(100 * x) + "%").join(" / "));
  let most = 0, at = null; rates.forEach((x, j) => { const c = x.filter(y => y >= 0.5).length; if (c > most) { most = c; at = grid[j]; } });
  check("C no one setting clears three rounds", most <= 2, "496 settings, 8 runs each: the greediest (" + at.join(", ") + ") hits half the time or more in " + most);
  const r0 = C.game.current();
  check("C the dealt arrows are the round's", C.br === r0.br && C.bK === r0.bK && +document.getElementById("C_br").value === r0.br && +document.getElementById("C_bK").value === r0.bK,
        "round " + r0.key + ": trait -> r " + C.br + " (dealt " + r0.br + "), trait -> K " + C.bK + " (dealt " + r0.bK + ")");
}
/* ---- every plot inside its panel --------------------------------------- */
{
  document.getElementById("stageA").classList.remove("stage-locked");
  document.getElementById("stageB").classList.remove("stage-locked");
  document.getElementById("stageC").classList.remove("stage-locked");
  const over = () => { const bad = [];
    document.querySelectorAll("canvas").forEach(cv => {
      if (cv.dataset.fit === "off") return;
      let host = cv.parentElement; while (host && !host.classList.contains("panel")) host = host.parentElement;
      if (!host) return;
      const cs = getComputedStyle(host), hr = host.getBoundingClientRect(), cr = cv.getBoundingClientRect();
      const o = cr.right - (hr.right - parseFloat(cs.paddingRight) - parseFloat(cs.borderRightWidth));
      if (o > 0.5) bad.push((cv.id || "card") + " +" + Math.round(o));
    });
    return bad; };
  const fe = window.frameElement, w0 = fe ? fe.width : null, res = [];
  for (const w of [w0, 1100, 900]) {
    if (fe && w) { fe.width = w; void document.body.offsetWidth; FIT_EPOCH++; repaintAll(); }
    res.push({ w: innerWidth, bad: over() });
  }
  if (fe) { fe.width = w0; void document.body.offsetWidth; FIT_EPOCH++; repaintAll(); }
  check("every plot fits its panel", res.every(q => q.bad.length === 0),
        res.map(q => q.w + " px: " + (q.bad.length ? q.bad.join(" ") : "none over")).join("  |  "));
}

/* ---- the practice switch, through the real buttons. Last: spends one
   scored attempt of each game. The runs animate on setInterval; a stand-in
   runs each out. */
{
  const realSI = window.setInterval, realCI = window.clearInterval;
  let loop = false, stop = false;
  window.setInterval = fn => { loop = true; stop = false; for (let k = 0; k < 20000 && !stop; k++) fn(); loop = false; return 0; };
  window.clearInterval = id => { if (loop) stop = true; else realCI(id); };
  const out = [], stages = { A, B, C };
  try {
    for (const [S, go] of [["A", "A_run"], ["B", "B_run"], ["C", "C_run"]]) {
      document.getElementById("stage" + S).classList.remove("stage-locked");
      const g = stages[S].game, box = document.getElementById(S + "_practice"), btn = document.getElementById(go);
      const tick = on => { box.checked = on; box.dispatchEvent(new Event("change")); };
      const n0 = g.st.hits.length;
      tick(true); btn.click();
      const pracOk = g.st.hits.length === n0 && g.st.last != null && /practice/.test(document.getElementById(S + "_tflip").textContent);
      tick(false); btn.click();
      const scored = g.st.hits.length === n0 + 1 && g.waiting(), blocked = btn.disabled;
      tick(true); btn.click();
      const stillPrac = !btn.disabled && g.st.hits.length === n0 + 1 && g.waiting();
      tick(false);
      out.push({ ok: pracOk && scored && blocked && stillPrac,
                 t: S + ": practice " + (pracOk ? "unscored" : "SCORED") + ", ticked off " + (scored ? "scored" : "NOT scored") +
                    ", waiting " + (blocked ? "Go off" : "GO ON") + (stillPrac ? " but practice runs" : ", practice BLOCKED") });
    }
  } finally { window.setInterval = realSI; window.clearInterval = realCI; }
  check("every stage has a practice switch that does not score", out.length === 3 && out.every(q => q.ok), out.map(q => q.t).join("  |  "));
}

say(bad ? ("FAILED " + bad) : "ALL BARS PASS");
say("RAN " + ran);
L.join(" ;; ");
`;

const probe = `<!doctype html><meta charset="utf-8"><title>pending</title>
<iframe id="f" src="http://127.0.0.1:${PORT}/app/lessons/lesson14.html?preview=1" width="1500" height="1000"></iframe>
<pre id="out"></pre>
<script>
const SRC = ${JSON.stringify(INNER)};
document.getElementById("f").addEventListener("load", () => setTimeout(() => {
  const w = document.getElementById("f").contentWindow;
  let res;
  try { res = String(w.eval(SRC)); }
  catch (e) { res = "THREW " + e.message + " @ " + (e.stack||"").split("\\n")[1]; }
  document.getElementById("out").textContent = res;
  document.title = "done";
}, 3000));
</script>`;

const probePath = path.join(ROOT, "_check_l14.html");
fs.writeFileSync(probePath, probe);
const server = spawn("python3", ["-m", "http.server", String(PORT), "--directory", ROOT],
                     { stdio: "ignore", detached: true });
const cleanup = () => { try { process.kill(-server.pid); } catch (e) {} try { fs.unlinkSync(probePath); } catch (e) {} };
process.on("exit", cleanup);

setTimeout(() => {
  const r = spawnSync(CHROME, ["--headless=new", "--disable-gpu", "--virtual-time-budget=900000",
                               "--dump-dom", `http://127.0.0.1:${PORT}/_check_l14.html`],
                      { encoding: "utf8", maxBuffer: 1 << 28 });
  const m = /<pre id="out">([\s\S]*?)<\/pre>/.exec(r.stdout || "");
  if (!m) { console.error("no result -- is Chrome at " + CHROME + " ?"); cleanup(); process.exit(2); }
  const text = m[1].replace(/&quot;/g, '"').replace(/&gt;/g, ">").replace(/&lt;/g, "<").replace(/&amp;/g, "&");
  const lines = text.split(" ;; ");
  for (const line of lines) console.log(line);
  const reported = lines.filter(l => /^(ok|FAIL)\s/.test(l)).length;
  const ranLine = /^RAN (\d+)$/.exec((lines.find(l => /^RAN \d+$/.test(l)) || ""));
  if (!ranLine || +ranLine[1] !== reported) {
    console.log("FAIL harness  " + (ranLine ? ranLine[1] : "?") + " checks ran, " + reported +
                " came back -- the report was truncated");
    cleanup(); process.exit(1);
  }
  cleanup();
  process.exit(/ALL BARS PASS/.test(text) ? 0 : 1);
}, 1800);
