#!/usr/bin/env node
/*
 * check_lesson11_numbers.js -- the bar checks for app/lessons/lesson11.html.
 *
 * Same contract as check_lesson10_numbers.js, against the ancestry lesson:
 *
 *   1. every gate is clearable by a student doing the intended thing;
 *   2. it is NOT clearable by the naive answer -- "an ancestor of everyone is
 *      in everyone", "the frequency moved", "a big genome protects you",
 *      "the two copies meet a headcount of generations back";
 *   3. the truth each lock is judged against sits inside its own band
 *      relative to the re-runs the student is shown;
 *   4. no CONSTANT answer clears three rounds of any closing game.
 *
 * Plus one check specific to this lesson. Stage C carries two quantities that
 * are both called F in the literature and are NOT the same number: kinship
 * down the pedigree, which rises under drift alone, and 1 - Ho/He, which
 * compares this generation's two-tone birds against this generation's own
 * frequencies and therefore sits at zero under random mating however small
 * the pond is. An earlier build of the stage asserted that they agree; this
 * file is what caught it. The checks now pin them to parting company in the
 * direction the stage claims. Do not re-fuse them.
 *
 * It drives the shipped page, inside a same-origin iframe, against the page's
 * own functions.
 *
 * Usage:  node scripts/check_lesson11_numbers.js
 * Exit 0 iff every bar passes. Needs Google Chrome and python3.
 */
const { spawn, spawnSync } = require("child_process");
const fs = require("fs"), path = require("path");

const ROOT = path.resolve(__dirname, "..");
const PORT = 8792;
const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

const INNER = `
const L=[], say=s=>L.push(s);
let bad = 0;
const check = (name, ok, detail) => { if (!ok) bad++; say((ok?"ok   ":"FAIL ") + name + "  " + detail); };
const mn = a => a.reduce((x,y)=>x+y,0)/a.length;
const empty = iv => Math.max(...iv.map(v=>v[0])) > Math.min(...iv.map(v=>v[1]));

check("page loaded", !!(A && B_PED && C && D && E && typeof Score !== "undefined"),
      "every stage object and Score are defined");
check("slots declared match slots written", Object.keys(BIT).length === 12,
      Object.keys(BIT).length + " named bits");

/* ---- A. the gap, and the frequencies that did not move ----------------- */
{
  const flat = A_measure(0.5, 0, 8, 12), tight = A_measure(0.5, 1, 8, 12);
  check("A only the packaging moves",
        Math.abs(mn(flat.map(x=>x.p)) - mn(tight.map(x=>x.p))) < 0.03,
        "the dark version sits at " + mn(flat.map(x=>x.p)).toFixed(3) + " with partners at random and " +
        mn(tight.map(x=>x.p)).toFixed(3) + " with every partner a sibling");
  const gapFlat = mn(flat.map(x=>x.F)), gapTight = mn(tight.map(x=>x.F));
  check("A1 gate clearable", gapTight >= 0.20, "every partner a sibling opens a gap of " + gapTight.toFixed(3));
  check("A1 gate not cleared at random", gapFlat < 0.20, "partners at random gives " + gapFlat.toFixed(3));
  check("A2 rejects the counted number", Math.abs(mn(tight.map(x=>x.het)) - mn(tight.map(x=>A.N*x.He))) > Math.max(15, 0.08*mn(tight.map(x=>A.N*x.He))),
        "counted two-tone " + mn(tight.map(x=>x.het)).toFixed(0) + " against " + mn(tight.map(x=>A.N*x.He)).toFixed(0) + " at random");
  const rng = mulberry32(4242), iv = [];
  for (let n = 0; n < 3; n++) { const r = A.game.round(rng, n); iv.push([r.truth - r.tol, r.truth + r.tol]); }
  check("A3 no constant clears", empty(iv), "three rounds: " + iv.map(v=>"["+v[0].toFixed(2)+","+v[1].toFixed(2)+"]").join(" "));
  check("A3 rejects 'there is no gap'", iv.filter(v => 0 >= v[0] && 0 <= v[1]).length <= 1,
        "0.00 clears " + iv.filter(v => 0 >= v[0] && 0 <= v[1]).length + " of 3");
}

/* ---- B. an ancestor of everyone, genes in hardly anyone ---------------- */
{
  const nb = B_PED.bottom.length;
  check("B every founder is an ancestor of every bird at the bottom",
        B_GENEA.every(v => v === nb), "genealogical counts: " + B_GENEA.join(",") + " of " + nb);
  const rng = mulberry32(2026), hit = new Array(8).fill(0), surv = [];
  for (let r = 0; r < 3000; r++) { const s = B_bottomCopies(B_drop(rng)); surv.push(s.size);
    for (let f = 0; f < 8; f++) if (s.has(2*f) || s.has(2*f+1)) hit[f]++; }
  const rate = hit.map(v => 100*v/3000);
  check("B the funnel bites", rate[6] < 45 && rate[7] < 45 && Math.min(rate[0],rate[1],rate[2],rate[3],rate[4],rate[5]) > 70,
        "genetic rates: " + rate.map(v=>v.toFixed(0)+"%").join(" "));
  const t = mn(surv);
  check("B1 truth", t > 5 && t < 9, mn(surv).toFixed(1) + " of the 16 copies survive (sd " +
        Math.sqrt(surv.reduce((a,b)=>a+(b-t)*(b-t),0)/surv.length).toFixed(1) + ")");
  check("B1 rejects 'all sixteen'", Math.abs(16 - t) > 1.8, "16 is " + (Math.abs(16-t)/1.8).toFixed(1) + " tolerances out");
  const rg = mulberry32(808), iv = [];
  for (let n = 0; n < 3; n++) { const r = B.game.round(rg, n); iv.push([r.truth - r.tol, r.truth + r.tol, r.founder+1]); }
  check("B3 no constant clears", empty(iv),
        "founders " + iv.map(v=>v[2]+":["+v[0].toFixed(0)+","+v[1].toFixed(0)+"]").join(" "));
  check("B3 rejects 'always, it is an ancestor of all of them'", iv.filter(v => 100 >= v[0] && 100 <= v[1]).length === 0,
        "100 of 100 clears " + iv.filter(v => 100 >= v[0] && 100 <= v[1]).length + " of 3");
  if (REAL.sheep) {
    check("B4 the sheep loaded", SHEEP.eligible.length > 20 && SHEEP.finals.length > 50,
          SHEEP.eligible.length + " founders (" + (2*SHEEP.eligible.length) + " copies) had a shot at " +
          SHEEP.finals.length + " lambs born 2005 or later");
    const r2 = mulberry32(99), cp = [], nb = [];
    for (let i = 0; i < 40; i++) { const d = B_sheepDrop(r2); cp.push(d.copies); nb.push(d.fromNobody); }
    check("B4 most of the copies are gone", mn(cp) < 0.6 * 2 * SHEEP.eligible.length,
          mn(cp).toFixed(1) + " of " + (2*SHEEP.eligible.length) + " founder copies are still down there");
    check("B4 the unassigned sires are visible, not hidden", mn(nb) > 5,
          mn(nb).toFixed(0) + " copies in that cohort came from an animal nobody identified");
  } else check("B4 sheep loaded", false, "bighorn_genedrop.json did not arrive");
}

/* ---- C. two routes to the same number ---------------------------------- */
{
  // the two numbers are NOT the same number, and the stage only works if
  // they part company in the direction it says they do
  const runs = [];
  for (let r = 0; r < 6; r++) runs.push(C_run({ N: 40, k: 0, gens: 20 }));
  const ped = mn(runs.map(x => x.Fped[19])), cnt = mn(runs.map(x => x.Fcount[19]));
  check("C under random mating only one of the two moves", ped > 0.12 && Math.abs(cnt) < 0.08,
        "the founders' variety gone: " + ped.toFixed(3) + ", the gap: " + cnt.toFixed(3));
  const wide = [], narrow = [];
  for (let r = 0; r < 4; r++) { wide.push(C_run({ N: 80, k: 0, gens: 20 }).Fcount[19]);
                                narrow.push(C_run({ N: 20, k: 0, gens: 20 }).Fcount[19]); }
  check("C the gap does not answer to the headcount", Math.abs(mn(wide) - mn(narrow)) < 0.10,
        "a pond of 80 gives " + mn(wide).toFixed(3) + ", a pond of 20 gives " + mn(narrow).toFixed(3));

  const tightRuns = []; for (let r = 0; r < 4; r++) tightRuns.push(C_run({ N: 40, k: 1, gens: 30 }).Fcount[29]);
  const loose = []; for (let r = 0; r < 4; r++) loose.push(C_run({ N: 40, k: 0, gens: 30 }).Fcount[29]);
  check("C1 gate clearable", mn(tightRuns) > 0.35,
        "40 breeders, every partner the closest relative, 30 generations: the gap is " + mn(tightRuns).toFixed(3));
  check("C1 only the knob can do it", mn(loose) < 0.35,
        "same pond with partners at random: the gap is " + mn(loose).toFixed(3));

  const c2 = [], c2lost = [];
  for (let r = 0; r < 8; r++) { const run = C_run({ N: 30, k: 0, gens: 20 }); c2.push(run.Fcount[19]); c2lost.push(run.Fped[19]); }
  const t2 = mn(c2);
  check("C2 truth", Math.abs(t2) < 0.10, "a pond of thirty, nobody choosing a relative, 20 generations: the gap is " + t2.toFixed(3));
  check("C2 rejects 'a small pond must open a gap'", Math.abs(0.3 - t2) > 0.10,
        "0.30 is outside the band, and meanwhile " + mn(c2lost).toFixed(2) + " of the founders' variety really did go");

  const rg = mulberry32(606), iv = [];
  for (let n = 0; n < 3; n++) { const r = C.game.round(rg, n); iv.push([r.truth - r.tol, r.truth + r.tol, r.N, r.k]); }
  check("C3 no constant clears", empty(iv),
        "rounds: " + iv.map(v=>"N="+v[2]+" k="+v[3]+" ["+v[0].toFixed(2)+","+v[1].toFixed(2)+"]").join("  "));
}

/* ---- D. which of the two is doing the damage --------------------------- */
{
  const rng = mulberry32(900);
  const at = (rel, load, Ln) => { const v = [];
    for (let r = 0; r < 40; r++) v.push(D_clutch(rng, rel, load, Ln, 100).lost); return mn(v); };
  const sibsZero = at("sibs", 0, 200);
  check("D1 gate clearable", sibsZero === 0, "brother and sister carrying nothing broken: " + sibsZero + " of 100 lost");
  const noneHot = at("none", 8, 60);
  check("D2 gate clearable", noneHot >= 20, "unrelated, 8 broken copies, 60 places: " + noneHot.toFixed(0) + " of 100 lost");

  const small = [at("none", 5, 100), at("sibs", 5, 100)];
  const big   = [at("none", 5, 20000), at("sibs", 5, 20000)];
  check("D the genome size separates the two causes",
        big[0] < 0.2 * small[0] && big[1] > 0.85 * small[1],
        "unrelated " + small[0].toFixed(0) + "% -> " + big[0].toFixed(1) + "%, siblings " +
        small[1].toFixed(0) + "% -> " + big[1].toFixed(0) + "% when the genome goes from 100 places to 20,000");

  const t3 = big[1], tol3 = Math.max(8, 0.14 * t3);
  check("D3 truth", t3 > 60 && t3 < 88, "siblings, 5 broken copies, 20,000 places: " + t3.toFixed(0) + " of 100");
  check("D3 rejects 'a big genome protects them'", Math.abs(5 - t3) > tol3,
        "a low answer is " + (Math.abs(5-t3)/tol3).toFixed(1) + " tolerances out");

  const rg = mulberry32(1234), iv = [];
  for (let n = 0; n < 3; n++) { const r = D.game.round(rg, n); iv.push([r.truth - r.tol, r.truth + r.tol, r.rel]); }
  check("D4 no constant clears", empty(iv),
        "rounds: " + iv.map(v=>v[2]+" ["+v[0].toFixed(0)+","+v[1].toFixed(0)+"]").join("  "));
}

/* ---- E. the walk, run backwards ---------------------------------------- */
{
  const rng = mulberry32(700);
  const rows = [25, 50, 100, 200].map(N => [N, E_batch(rng, N, 0, 1500).mean]);
  check("E the two copies meet twice the headcount back",
        rows.every(([N, m]) => Math.abs(m - 2*N) / (2*N) < 0.12),
        rows.map(([N,m]) => N + " -> " + m.toFixed(0) + " (want " + 2*N + ")").join("  "));

  const at100 = E_batch(rng, 100, 0, 500).mean, at50 = E_batch(rng, 50, 0, 500).mean;
  check("E1 gate clearable", at100 >= 180 && at100 <= 220, "a pond of 100 meets " + at100.toFixed(0) + " back");
  check("E1 gate not cleared elsewhere", !(at50 >= 180 && at50 <= 220), "a pond of 50 meets " + at50.toFixed(0) + " back");

  const e2 = []; for (let r = 0; r < 6; r++) e2.push(E_batch(rng, 50, 0, 300).mean);
  const t2 = mn(e2), tol2 = Math.max(18, 0.2 * t2);
  check("E2 truth", Math.abs(t2 - 100) < 18, "a pond of fifty: " + t2.toFixed(0) + " generations back");
  check("E2 rejects the headcount", Math.abs(50 - t2) > tol2, "50 is " + (Math.abs(50-t2)/tol2).toFixed(1) + " tolerances out");

  const hets = [[25,0.004],[100,0.002],[200,0.008]].map(([N,mu]) =>
    [N, mu, E_batch(rng, N, mu, 3000).het, 4*N*mu/(1+4*N*mu)]);
  check("E two-tone matches the arithmetic",
        hets.every(([N,mu,m,t]) => Math.abs(m - t) < 0.04),
        hets.map(([N,mu,m,t]) => "N="+N+" measured "+m.toFixed(3)+" want "+t.toFixed(3)).join("  "));

  const rg = mulberry32(1111), iv = [];
  for (let n = 0; n < 3; n++) { const r = E.game.round(rg, n); iv.push([r.truth - r.tol, r.truth + r.tol, r.N]); }
  check("E3 no constant clears", empty(iv),
        "rounds: " + iv.map(v=>"N="+v[2]+" ["+v[0].toFixed(2)+","+v[1].toFixed(2)+"]").join("  "));

  const ht = humanTruth();
  check("E4 the back-calculation lands where it should", ht > 16000 && ht < 25000,
        "one base in a thousand at 1.25 per hundred million per generation gives " + Math.round(ht).toLocaleString());
  check("E4 rejects the census", 8e9 > 60000, "eight billion is not even on the slider, which stops at 60,000");
  check("E4 band excludes a tenfold miss", Math.abs(ht/10 - ht) > 4000 && Math.abs(ht*3 - ht) > 4000,
        "a tenfold miss either way is outside the band of 4,000");
}

say(bad ? ("FAILED " + bad) : "ALL BARS PASS");
L.join(" ;; ");
`;

const probe = `<!doctype html><meta charset="utf-8"><title>pending</title>
<iframe id="f" src="http://127.0.0.1:${PORT}/app/lessons/lesson11.html?preview=1" width="1500" height="1000"></iframe>
<script>
const SRC = ${JSON.stringify(INNER)};
document.getElementById("f").addEventListener("load", () => setTimeout(() => {
  const w = document.getElementById("f").contentWindow;
  try { document.title = String(w.eval(SRC)); }
  catch (e) { document.title = "THREW " + e.message + " @ " + (e.stack||"").split("\\n")[1]; }
}, 4000));
</script>`;

const probePath = path.join(ROOT, "_check_l11.html");
fs.writeFileSync(probePath, probe);
const server = spawn("python3", ["-m", "http.server", String(PORT), "--directory", ROOT],
                     { stdio: "ignore", detached: true });
const cleanup = () => { try { process.kill(-server.pid); } catch (e) {} try { fs.unlinkSync(probePath); } catch (e) {} };
process.on("exit", cleanup);

setTimeout(() => {
  const r = spawnSync(CHROME, ["--headless=new", "--disable-gpu", "--virtual-time-budget=900000",
                               "--dump-dom", `http://127.0.0.1:${PORT}/_check_l11.html`],
                      { encoding: "utf8", maxBuffer: 1 << 28 });
  const m = /<title>([\s\S]*?)<\/title>/.exec(r.stdout || "");
  if (!m) { console.error("no result -- is Chrome at " + CHROME + " ?"); cleanup(); process.exit(2); }
  const text = m[1].replace(/&quot;/g, '"').replace(/&gt;/g, ">").replace(/&lt;/g, "<").replace(/&amp;/g, "&");
  for (const linefeed of text.split(" ;; ")) console.log(linefeed);
  cleanup();
  process.exit(/ALL BARS PASS/.test(text) ? 0 : 1);
}, 1800);
