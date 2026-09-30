#!/usr/bin/env node
/*
 * check_lesson13_numbers.js -- the bar checks for app/lessons/lesson13.html.
 *
 * Lesson 13 is a draft (2026-09-24; the meadow went in front 2026-09-29 and
 * moved to B when the Price demo took A the same day): A the two routes,
 * B the meadow, C covariance, D what responds, E the diagram, F mediator /
 * confounder, G the collider. What has to hold:
 *
 *   A. the ten flowers are mirrored pairs averaging exactly 5; cov(w, z) +
 *      E(wΔz) is the change in the average, counted offspring by offspring;
 *      copies leave E(wΔz) at 0 and two apiece leave cov(w, z) at 0;
 *      numbers that differ without tracking colour, and shifts that
 *      cancel, move nothing; every round has a setting and none hits two;
 *      the intended moves hit and the opening and cheap routes miss; the
 *      pointer sets counts, a family and all families; the card prints
 *      what the page counts; the average waits for Go in a round;
 *   B. colour is 100 additive genes plus a part not passed on; the
 *      landscape is the visitors' rule and a season's seeds average out to
 *      it; one seed in B_ONE (16) grows up to 200, no visitors kill the meadow;
 *      pollen comes from where the same kind called, so split visitors pair
 *      like with like; who left more plus offspring vs. parents is the
 *      change in the average colour, every generation, counted by hand; the
 *      part not passed on pulls back; a hard push with few visitors crashes
 *      the meadow and strips its genes; every round hit at its setting, the
 *      opening and no visitors hitting none, the cheap routes missing, no
 *      one setting clearing three; the map sets what the pointer is on; the
 *      card reads the average and count off the flowers;
 *   C. the offspring's shift IS cov(w, z) / w̄, every time, exactly -- the
 *      identity the stage prints -- and the covariance IS the average of the
 *      rectangles it draws; at a fixed slope the shift grows with the
 *      trait's variance: selection needs variation; every round is hit at
 *      its slope, missed at slope 0, and no one slope clears three rounds;
 *   D. the offspring move h2 times the parents who bred, whatever the
 *      slope; no inherited variation, no response; one slope gives the same
 *      shift in every population; the printed arithmetic agrees; D's rounds
 *      as in C; a population's inherited share stays hidden until its
 *      scored run;
 *   E. the page's least squares against a hand solve; the least-squares
 *      arrows leave the least over, and it leans on neither trait; each
 *      one-trait slope is its arrow and its spread is the other arrow plus
 *      the box; the rounds as in C, and reading the box off one picture
 *      misses;
 *   F. the same for three causes tied by an allele, plus: the line the
 *      whole diagram draws in each picture is that picture's slope at the
 *      fit; a confounded trait and a mediated allele show a slope their own
 *      arrow does not have; reading arrows off pictures misses;
 *   G. the traits are unrelated across all seedlings; the drought kills
 *      exactly its share; with no luck the survivors' slope is the
 *      truncated-normal value; it deepens with the drought and flips sign
 *      with the rule; the rounds as in C.
 *
 * Same harness as check_lesson11_numbers.js: the checks run inside a
 * same-origin iframe against the page's own functions; the report comes back
 * in a <pre>, and the runner fails if fewer checks come back than ran.
 *
 * Usage:  node scripts/check_lesson13_numbers.js
 * Exit 0 iff every bar passes. Needs Google Chrome and python3.
 */
const { spawn, spawnSync } = require("child_process");
const fs = require("fs"), path = require("path");

const ROOT = path.resolve(__dirname, "..");
const PORT = 8794;
const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

const INNER = `
const L=[], say=s=>L.push(s);
let bad = 0, ran = 0;
const check = (name, ok, detail) => { ran++; if (!ok) bad++; say((ok?"ok   ":"FAIL ") + name + "  " + detail); };
const mn = a => a.reduce((x,y)=>x+y,0)/a.length;
const sdv = a => { const m = mn(a); return Math.sqrt(a.reduce((x,y)=>x+(y-m)*(y-m),0)/Math.max(1,a.length-1)); };

check("page loaded", !!(A && A.game && B && B.game && C && C.game && D && D.game && E && E.game && E.paths && F && F.game && F.paths && G && G.game && G.paths && typeof Score !== "undefined"), "Stages A-G, the three diagrams and Score are defined");
check("slots declared match slots written", Object.keys(BIT).length === 7, Object.keys(BIT).length + " named bits, scaffold is 7");
/* ---- A: the two routes -------------------------------------------------- */
{
  /* A opens on free play; Start deals the first target, and the round holds its step */
  const before = A.game.free() && A.game.current() == null, labFree = document.getElementById("A_run").textContent;
  document.getElementById("A_tnext").click();
  const r0 = A.game.current(), held = document.getElementById("A_step2").disabled && !document.getElementById("A_step1").disabled;
  check("A opens on free play; Start deals the first target and holds its step", before && labFree === "Practice run" && r0 === A_ROUNDS[0] && A.step === 1 && held && document.getElementById("A_run").textContent === "Go",
        "free at load: " + before + " (button '" + labFree + "'); after Start: round " + (r0 || {}).key + ", step " + A.step + ", the other step held: " + held);
}
{
  const gaps = A_Z.slice(1).map((v, i) => v - A_Z[i]), mirror = A_Z.every((v, i) => Math.abs(v + A_Z[A_N - 1 - i] - 10) < 1e-9);
  check("A ten flowers in mirrored pairs at 0.1, average exactly 5, none closer than 0.5", A_Z.length === 10 && Math.abs(mn(A_Z) - 5) < 1e-12 && mirror &&
        Math.min(...gaps) >= 0.5 - 1e-9 && A_Z[0] >= 1.3 && A_Z[9] <= 8.7 && A_Z.every(v => Math.abs(v * 10 - Math.round(v * 10)) < 1e-9),
        "colors " + A_Z.join(", ") + "; average " + mn(A_Z).toFixed(12) + "; closest pair " + Math.min(...gaps).toFixed(2));
}
{
  /* Price by hand: every offspring listed, one by one. Counts only, shifts
     only, and both; each term against its definition. */
  const rng = mulberry32(77); let worst = 0, worstT = 0, zeroTr = 0, zeroCov = 0, runs = 0;
  for (let q = 0; q < 900; q++) {
    const kind = q % 3;
    const n = Array.from({ length: A_N }, () => kind === 1 ? 2 : Math.floor(rng() * 6));
    const d = A_Z.map(z => kind === 0 ? 0 : Math.round((Math.min(10, Math.max(0, z + (rng() - 0.5) * 6)) - z) * 10) / 10);
    if (n.every(v => v === 0)) continue;
    const t = A_terms(n, d), kids = []; n.forEach((k, i) => { for (let j = 0; j < k; j++) kids.push(A_Z[i] + d[i]); });
    const zb = mn(A_Z), w = n.map(v => v / mn(n)), dz = mn(kids) - zb;
    const cov = mn(w.map((v, i) => (v - mn(w)) * (A_Z[i] - zb))), tr = mn(w.map((v, i) => v * d[i]));
    worst = Math.max(worst, Math.abs(t.cov + t.tr - dz)); worstT = Math.max(worstT, Math.abs(t.cov - cov), Math.abs(t.tr - tr), Math.abs(t.zo - mn(kids)));
    if (kind === 0) zeroTr = Math.max(zeroTr, Math.abs(t.tr));
    if (kind === 1) zeroCov = Math.max(zeroCov, Math.abs(t.cov));
    runs++;
  }
  check("A cov(w, z) + E(wΔz) is the change in the average, counted offspring by offspring", worst < 1e-12 && worstT < 1e-12,
        runs + " settings (counts, shifts, both): identity gap " + worst.toExponential(1) + "; page vs hand, largest " + worstT.toExponential(1));
  check("A copies leave E(wΔz) at zero, and two apiece leave cov(w, z) at zero", zeroTr === 0 && zeroCov < 1e-12,
        "largest E(wΔz) with offspring copying their parent: " + zeroTr + "; largest cov(w, z) with every flower making two: " + zeroCov.toExponential(1));
  /* the two stay-put routes: counts that differ but mirror across the pairs, and shifts that cancel */
  let still = 0, spread = 0; const r2 = mulberry32(78);
  for (let q = 0; q < 200; q++) {
    const half = Array.from({ length: 5 }, () => Math.floor(r2() * 6)), n = half.concat(half.slice().reverse());
    if (n.every(v => v === 0)) continue;
    still = Math.max(still, Math.abs(A_terms(n, new Array(A_N).fill(0)).dz)); spread = Math.max(spread, sdv(n));
    const up = Array.from({ length: 5 }, () => Math.round(r2() * 20) / 10), d = up.concat(up.map(v => -v));
    still = Math.max(still, Math.abs(A_terms(new Array(A_N).fill(2), d).dz));
  }
  check("A numbers that differ without tracking color, and shifts that cancel, move nothing", still < 1e-12 && spread > 1.5,
        "200 of each (offspring numbers mirrored across the pairs, spread up to " + spread.toFixed(2) + "; shifts of up to 2 cancelled pair against pair): largest change in the average " + still.toExponential(1));
}
{
  /* the rounds: a setting for each found by search, the intended ones hit,
     the opening and the cheap routes miss */
  const rng = mulberry32(99), found = {}, rate = {}, zero = new Array(A_N).fill(0), two = new Array(A_N).fill(2), T = 100000;
  let most = 0;
  for (const r of A_ROUNDS) { found[r.key] = null; rate[r.key] = 0; }
  for (let q = 0; q < T; q++) {
    const n = Array.from({ length: A_N }, () => Math.floor(rng() * 6)); let c = 0;
    for (const r of A_ROUNDS) if (A_judge(r, n, zero)) { c++; rate[r.key]++; found[r.key] = found[r.key] || n; }
    const d = A_Z.map(z => Math.round((Math.min(10, Math.max(0, z + Math.round((rng() - 0.5) * 40) / 10)) - z) * 10) / 10); let e = 0;
    for (const r of A_ROUNDS) if (A_judge(r, two, d)) { e++; rate[r.key]++; found[r.key] = found[r.key] || d; }
    most = Math.max(most, c, e);
  }
  check("A every round has a setting that hits it, and none hits two", A_ROUNDS.every(r => found[r.key]) && most === 1,
        T + " random counts and " + T + " random shifts: " + A_ROUNDS.map(r => r.key + " " + (100 * rate[r.key] / T).toFixed(2) + "%").join("  ") + "; most rounds one setting hits: " + most);
  const by = k => A_ROUNDS.find(r => r.key === k);
  const ends = zero.map((_, i) => (i === 0 || i === 9 || i === 4) ? 0 : 2);
  const intended = { two: A_judge(by("two"), two, zero.map(() => 1)),
                     differ: A_judge(by("differ"), two, zero.map((_, i) => i < 5 ? 0.5 : -0.5)),
                     none: A_judge(by("none"), ends, zero) };
  check("A the intended moves hit: all +1; ±0.5 across the pairs; both ends and one middle flower with none", intended.two && intended.differ && intended.none,
        "every family +1: " + intended.two + " (average " + f2(A_terms(two, zero.map(() => 1)).zo) + "); orange side +0.5, purple side −0.5: " + intended.differ +
        "; flowers 1, 5 and 10 with none: " + intended.none + " (average " + f2(A_terms(ends, zero).zo) + ")");
  const open = A_ROUNDS.map(r => A_judge(r, two, zero));
  const oneEnd = A_judge(by("none"), zero.map((_, i) => i < 3 ? 0 : 2), zero) || A_judge(by("none"), zero.map((_, i) => i > 6 ? 0 : 2), zero);
  const allHalf = A_judge(by("differ"), two, zero.map(() => 0.5)), allSame = A_judge(by("none"), zero.map(() => 3), zero);
  let single = false; for (let i = 0; i < A_N; i++) for (const v of [-5, 5]) { const d = zero.slice(); d[i] = Math.round((Math.min(10, Math.max(0, A_Z[i] + v)) - A_Z[i]) * 10) / 10; single = single || A_judge(by("two"), two, d); }
  check("A the opening and the cheap routes miss", open.every(v => !v) && !oneEnd && !allHalf && !allSame && !single,
        "opening: " + open.map(v => v ? "hit" : "miss").join("/") + "; the three most orange (or purple) with none: " + (oneEnd ? "hit" : "miss") +
        "; every family +0.5: " + (allHalf ? "hit" : "miss") + "; three offspring each: " + (allSame ? "hit" : "miss") + "; one family moved as far as it goes: " + (single ? "hit" : "miss"));
}
{
  /* the pointer: a column's fourth place sets four and clicking the top takes
     it away; the flower itself sets none; a drag up the column sets five; a
     family dragged sideways; the strip moves them all */
  const cv = document.getElementById("A_fam"), rc = cv.getBoundingClientRect(), W = +cv.dataset.drawW, H = +cv.dataset.cssH;
  const keep = { n: A.n.slice(), d: A.d.slice(), step: A.step };
  const ev = (type, x, y) => cv.dispatchEvent(new PointerEvent(type, { clientX: rc.left + x * rc.width / W, clientY: rc.top + y * rc.height / H, pointerId: 1, bubbles: true }));
  const click = (x, y) => { ev("pointerdown", x, y); ev("pointerup", x, y); };
  A_setStep(1); A_paint();
  let f = A_frame(W, H), Lo = A_layout(f);
  click(f.x(A_Z[3]), A_slotY(f, Lo, 4)); const four = A.n[3];
  click(f.x(A_Z[3]), A_slotY(f, Lo, 4)); const three = A.n[3];
  click(f.x(A_Z[3]), f.yP); const none = A.n[3];
  ev("pointerdown", f.x(A_Z[6]), A_slotY(f, Lo, 1)); ev("pointermove", f.x(A_Z[6]), A_slotY(f, Lo, 5)); ev("pointerup", f.x(A_Z[6]), A_slotY(f, Lo, 5)); const five = A.n[6];
  const code = document.getElementById("codeA").textContent, codeN = /n  <- c\\(([^)]*)\\)/.exec(code);
  A_setStep(2); A_paint(); f = A_frame(W, H); Lo = A_layout(f);
  ev("pointerdown", f.x(A_Z[2]), A_slotY(f, Lo, 1)); ev("pointermove", f.x(A_Z[2] + 1.3), A_slotY(f, Lo, 1)); ev("pointerup", f.x(A_Z[2] + 1.3), A_slotY(f, Lo, 1));
  const moved = A.d[2];
  ev("pointerdown", f.x(5), f.strip + 4); ev("pointermove", f.x(5.5), f.strip + 4); ev("pointerup", f.x(5.5), f.strip + 4);
  const all = A.d.slice(), allOk = all.every((v, i) => Math.abs(v - (i === 2 ? 1.8 : 0.5)) < 1e-9);
  A_setStep(keep.step); A.n = keep.n; A.d = keep.d; A_code(); A_paint();
  check("A the pointer sets a flower's offspring, a family's color and every family's", four === 4 && three === 3 && none === 0 && five === 5 && Math.abs(moved - 1.3) < 1e-9 && allOk &&
        !!codeN && codeN[1].replace(/\\s/g, "") === [2, 2, 2, 0, 2, 2, 5, 2, 2, 2].join(","),
        "fourth place: " + four + "; clicked again: " + three + "; the flower: " + none + "; dragged up the column: " + five + "; R panel n = c(" + (codeN ? codeN[1] : "?") +
        "); a family dragged 1.3: " + moved + "; the strip dragged 0.5: " + all.join(", "));
}
{
  /* the card's arithmetic is the page's own terms, rounded as printed */
  const keep = { n: A.n.slice(), d: A.d.slice(), step: A.step }, box = document.getElementById("A_practice");
  box.checked = true; A_setStep(1); A.n = [0, 1, 1, 2, 2, 2, 3, 3, 4, 5]; A_changed("n");
  const txt = document.getElementById("A_cardRead").textContent.replace(/−/g, "-");
  const m = /cov\\(w, z\\) ([-+][0-9.]+) \\+ E\\(wΔz\\) ([-+][0-9.]+) = Δz ([-+][0-9.]+)/.exec(txt), t = A_terms(A.n, A.d);
  const ok = !!m && +m[1] === +t.cov.toFixed(2) && +m[2] === +t.tr.toFixed(2) && +m[3] === +t.dz.toFixed(2) && new RegExp("offspring's " + f2(t.zo)).test(txt);
  box.checked = false; A_setStep(keep.step); A.n = keep.n; A.d = keep.d; A_changed("n"); A_syncGo();
  check("A the card prints the terms and the offspring's average as the page counts them", ok,
        "printed '" + (m ? m[0] : txt.slice(0, 80)) + "'; counted cov " + t.cov.toFixed(4) + ", E(wΔz) " + t.tr.toFixed(4) + ", Δz " + t.dz.toFixed(4) + ", average " + t.zo.toFixed(4));
}
/* ---- B: the meadow ------------------------------------------------------ */
{
  /* A opens on free play, like lesson 12 A: no target until Start */
  const before = B.game.free() && B.game.current() == null, labFree = document.getElementById("B_run").textContent;
  document.getElementById("B_tnext").click();
  const after = !B.game.free() && B.game.current() === B_ROUNDS[0], labNow = document.getElementById("B_run").textContent;
  check("B opens on free play, then deals the first target on Start", before && after && labFree === "Practice run" && labNow === "Go",
        "free at load: " + before + " (button '" + labFree + "'); after Start: round " + (B.game.current() || {}).key + " (button '" + labNow + "')");
}
{
  /* the colour is the genes, added up: 5, plus 0.08 a purple copy and minus 0.08 an orange one, plus the part not passed on */
  const L2 = 2 * B_L, cs = [];
  for (let i = 0; i < B_K; i++) { let c = 0; for (let k = 0; k < L2; k++) c += B_START.g[i * L2 + k]; cs.push(5 + B_EFF * (2 * c - L2)); }
  /* away from the ends, where the color is not clipped */
  const res = cs.map((v, i) => B_START.z[i] - v).filter((_, i) => cs[i] > 1.5 && cs[i] < 8.5), rsd = sdv(res);
  const gsd = sdv(cs), zsd = sdv(Array.from(B_START.z));
  check("B a flower's color is its genes added up, and a little that is not passed down", B_L === 100 && Math.abs(rsd - B_SE) < 0.08 && Math.abs(mn(res)) < 4 * B_SE / Math.sqrt(res.length),
        B_L + " genes, two copies each; color minus the genes' sum has spread " + rsd.toFixed(3) + " (set " + B_SE + "), average " + mn(res).toFixed(3) +
        " (bar ± " + (4 * B_SE / Math.sqrt(res.length)).toFixed(3) + ", four standard errors)" + "; the start: spread " + zsd.toFixed(2) + ", of it from the genes " + gsd.toFixed(2) + " (inherited share, genes ÷ (genes + the rest), " + (gsd * gsd / (gsd * gsd + rsd * rsd)).toFixed(2) + ")");
}
{
  /* the landscape the card draws is the visitors' rule, written out again here */
  const ramp = d => 0.1 + 0.9 * Math.min(1, Math.max(0, d / 2));
  const hand = (z, s) => 8 * (s.nH * ramp(s.tH - z + 2) + s.nB * ramp(z - s.tB + 2) + s.nF * (0.1 + 0.9 * Math.exp(-((z - s.fMu) ** 2) / (2 * s.fSd ** 2))));
  let worst = 0, n = 0; const rng = mulberry32(31);
  for (let q = 0; q < 40; q++) {
    const s = { nH: Math.floor(rng() * 11), tH: Math.round(rng() * 20) / 2, nB: Math.floor(rng() * 11), tB: Math.round(rng() * 20) / 2, nF: Math.floor(rng() * 11), fMu: Math.round(rng() * 20) / 2, fSd: 0.25 + Math.floor(rng() * 16) * 0.25 };
    for (let k = 0; k <= 100; k++) { worst = Math.max(worst, Math.abs(B_expect(k / 10, s).seeds - hand(k / 10, s))); n++; }
  }
  const flat = Array.from({ length: 101 }, (_, k) => B_expect(k / 10, B_OPEN).seeds);
  check("B the landscape is the visitors' rule, and the opening is flat", worst < 1e-9 && Math.max(...flat) - Math.min(...flat) < 1e-9,
        n + " colors x settings against a hand formula: largest gap " + worst.toExponential(1) + "; opening: " + Math.min(...flat).toFixed(1) + " to " + Math.max(...flat).toFixed(1) + " seeds");
  /* and the seeds a season draws average out to it */
  const s = { nH: 6, tH: 3, nB: 4, tB: 7, nF: 5, fMu: 5, fSd: 1 }, tot = new Float64Array(B_K), R = 60;
  for (let q = 0; q < R; q++) { const g = B_gen(B_START, s, mulberry32(500 + q)); for (let i = 0; i < B_K; i++) tot[i] += g.seeds[i] / R; }
  let rel = 0, sEx = 0, sGot = 0; for (let i = 0; i < B_K; i++) { const e = B_expect(B_START.z[i], s).seeds; sEx += e; sGot += tot[i]; rel = Math.max(rel, Math.abs(tot[i] - e) / Math.sqrt(e / R)); }
  check("B a season's seeds average out to the landscape", Math.abs(sGot / sEx - 1) < 0.01 && rel < 4.5,
        R + " seasons on the start meadow: seeds " + (sGot / B_K).toFixed(2) + " per flower against " + (sEx / B_K).toFixed(2) + " expected; worst flower " + rel.toFixed(1) + " standard errors off");
}
{
  /* one seed in B_ONE grows, up to 200; no visits, no seeds, no meadow */
  const one = { nH: 1, tH: 10, nB: 0, tB: 0, nF: 0, fMu: 5, fSd: 1 }, got = [], want = [];
  for (let q = 0; q < 40; q++) { const g = B_gen(B_START, one, mulberry32(900 + q)); got.push(g.next.n); want.push(g.T / B_ONE); }
  const full = B_gen(B_START, B_OPEN, mulberry32(950)).next.n;
  const none = B_runAll({ nH: 0, tH: 10, nB: 0, tB: 0, nF: 0, fMu: 5, fSd: 1 }, mulberry32(960));
  const se = Math.sqrt(mn(want) * (1 - 1 / B_ONE) / got.length);
  check("B one seed in " + B_ONE + " grows, up to the 200 there is room for, and no visitors kill the meadow", Math.abs(mn(got) - mn(want)) < 3.5 * se && full === B_K && none.gens.length === 1 && none.final.n === 0,
        "one hummingbird on every color: " + mn(got).toFixed(1) + " flowers next year against seeds ÷ " + B_ONE + " = " + mn(want).toFixed(1) + " (40 seasons); the opening fills all " + full +
        "; no visitors: " + none.final.n + " flowers after " + none.gens.length + " generation");
}
{
  /* the pollen: every seedling's pollen parent is a flower the kind of
     visitor that set the seed called on, and so visitors that split the
     colors pair like with like */
  const corr = (a, b) => { const n = a.length, ma = mn(a), mb = mn(b); let sab = 0, sa = 0, sb = 0; for (let i = 0; i < n; i++) { sab += (a[i] - ma) * (b[i] - mb); sa += (a[i] - ma) ** 2; sb += (b[i] - mb) ** 2; } return sab / Math.sqrt(sa * sb); };
  const pair = s => { let bad = 0; const cs = []; for (let q = 0; q < 10; q++) { const g = B_gen(B_START, s, mulberry32(600 + q));
      for (let j = 0; j < g.mom.length; j++) if (!(g.vis[g.kind[j]][g.dad[j]] > 0 && g.vis[g.kind[j]][g.mom[j]] > 0)) bad++;
      cs.push(corr(Array.from(g.mom, i => B_START.z[i]), Array.from(g.dad, i => B_START.z[i]))); } return { bad, c: mn(cs) }; };
  const split = pair({ nH: 8, tH: 3, nB: 8, tB: 7, nF: 0, fMu: 5, fSd: 1 }), open = pair(B_OPEN);
  check("B pollen comes from where the same kind of visitor called, so split visitors pair like with like", split.bad === 0 && open.bad === 0 && split.c > 0.3 && Math.abs(open.c) < 0.08,
        "seedlings with a parent that kind never visited: " + (split.bad + open.bad) + "; mother and pollen parent's colors, correlation over 10 seasons: hummingbirds on 0-3 and bees on 7-10 " +
        split.c.toFixed(2) + ", every visitor on every color " + open.c.toFixed(2) + " (measured 2026-09-29: 0.37-0.53 and -0.12 to 0.09)");
}
{
  /* The Price identity, every generation, recomputed here from who parented
     whom: each seedling counted once for its mother and once for its pollen
     parent. The page's two terms add to the change in the mean, and each is
     what the check counts by hand. A generation that leaves no seedlings has
     no terms. */
  let worstId = 0, worstSel = 0, worstOff = 0, twoN = true, gens = 0;
  const sets = [B_OPEN, { nH: 6, tH: 3, nB: 0, tB: 0, nF: 0, fMu: 5, fSd: 1 }, { nH: 0, tH: 0, nB: 8, tB: 6, nF: 5, fMu: 8, fSd: 1 }, { nH: 8, tH: 4.5, nB: 8, tB: 5.5, nF: 0, fMu: 5, fSd: 1 }, { nH: 0, tH: 10, nB: 2, tB: 8, nF: 1, fMu: 7.5, fSd: 0.5 }];
  sets.forEach((s, si) => {
    const run = B_runAll(s, mulberry32(700 + si));
    for (const g of run.gens) {
      if (g.dead) continue;
      const N = g.z.length, w = new Float64Array(N), zk = g.next.z;
      for (let j = 0; j < zk.length; j++) { w[g.mom[j]]++; w[g.dad[j]]++; }
      let sw = 0, swz = 0, sz = 0, szo = 0; for (let i = 0; i < N; i++) { sw += w[i]; swz += w[i] * g.z[i]; sz += g.z[i]; } for (const v of zk) szo += v;
      if (sw !== 2 * zk.length) twoN = false;
      const sel = swz / sw - sz / N, off = (szo * 2 - swz) / sw, dz = szo / zk.length - sz / N;   /* every seedling counted twice: sum of w z' = 2 sum z' */
      worstId = Math.max(worstId, Math.abs(g.sel + g.off - g.dz), Math.abs(sel + off - dz));
      worstSel = Math.max(worstSel, Math.abs(g.sel - sel)); worstOff = Math.max(worstOff, Math.abs(g.off - off)); gens++;
    }
  });
  check("B who left more plus offspring vs. parents is the change in average color, every generation", worstId < 1e-9 && worstSel < 1e-9 && worstOff < 1e-9 && twoN,
        gens + " generations, 5 settings (one of them crashing): identity gap " + worstId.toExponential(1) + "; page vs hand: " + worstSel.toExponential(1) + " (who left more), " + worstOff.toExponential(1) + " (offspring vs. parents); w sums to 2 x seedlings every time: " + twoN);
}
{
  /* the part of color that is not passed on pulls every move back a little:
     summed over runs that go somewhere, offspring vs. parents runs against
     who left more, at roughly (1 - inherited share) of it */
  let S = 0, O = 0; const sets = [{ nH: 8, tH: 4, nB: 0, tB: 0, nF: 0, fMu: 5, fSd: 1 }, { nH: 0, tH: 0, nB: 8, tB: 6.5, nF: 0, fMu: 5, fSd: 1 }, { nH: 0, tH: 0, nB: 0, tB: 0, nF: 8, fMu: 7, fSd: 1 }];
  sets.forEach((s, si) => { for (let q = 0; q < 4; q++) { const run = B_runAll(s, mulberry32(800 + si * 31 + q)); for (const g of run.gens) if (!g.dead) { S += Math.abs(g.sel); O += g.off * Math.sign(g.sel); } } });
  /* the inherited share as genes ÷ (genes + the rest): the plain ratio of spreads
     also carries the chance tie between the two in 200 flowers (0.95 on one page) */
  const L2 = 2 * B_L, gv = [], ev = []; for (let i = 0; i < B_K; i++) { let c = 0; for (let k = 0; k < L2; k++) c += B_START.g[i * L2 + k]; gv.push(B_EFF * (2 * c - L2)); ev.push(B_START.z[i] - 5 - gv[i]); }
  const h2 = sdv(gv) ** 2 / (sdv(gv) ** 2 + sdv(ev) ** 2);
  check("B offspring vs. parents pulls back against who left more", O / S < -0.08 && O / S > -0.35,
        "12 runs that go somewhere: offspring vs. parents " + (O / S).toFixed(3) + " of who left more; the start meadow's inherited share " + h2.toFixed(2) + " (so about " + (-(1 - h2)).toFixed(2) + " expected)");
}
{
  /* a crash strips the meadow's genes: the same few visitors, pushed hard
     and pushed gently */
  const few = B_ROUNDS.find(r => r.key === "few").hold;
  const go = (s, seed) => { const run = B_runAll(Object.assign({}, s, few), mulberry32(seed)); return { low: Math.min(...run.gens.map(g => g.next.n)), vary: run.final.n ? B_varying(run.final) : 0 }; };
  const hard = [], soft = []; for (let q = 0; q < 10; q++) { hard.push(go({ nH: 0, tH: 10, tB: 8, fMu: 7.5, fSd: 0.5 }, 1500 + q)); soft.push(go({ nH: 0, tH: 10, tB: 5.5, fMu: 7.5, fSd: 1 }, 1600 + q)); }
  const med = a => a.slice().sort((x, y) => x - y)[a.length >> 1];
  check("B with few visitors, a hard push crashes the meadow and it loses genes for good", med(hard.map(q => q.low)) < 30 && med(soft.map(q => q.low)) > 60 && mn(hard.map(q => q.vary)) < mn(soft.map(q => q.vary)) - 10,
        "2 bees and 1 butterfly, 10 runs each; bees at 8, the butterfly around 7.5 ± 0.5: fewest flowers " + med(hard.map(q => q.low)) + " (median), genes still varying at the end " + mn(hard.map(q => q.vary)).toFixed(0) +
        " of " + B_L + "; bees at 5.5, the butterfly around 7.5 ± 1: " + med(soft.map(q => q.low)) + ", " + mn(soft.map(q => q.vary)).toFixed(0));
}
/* the rounds: each hit at a setting that does the intended thing, and the
   cheap routes missing. The start meadow is the page's own (pageSeed), so
   these hold on whatever meadow this run of the check was dealt. Measured
   2026-09-29 over eight start meadows: these settings hit 100%. */
const B_SOL = {
  orange: { nH: 0, tH: 10,  nB: 0,  tB: 0,   nF: 10, fMu: 2.5, fSd: 1 },
  purple: { nH: 0, tH: 10,  nB: 0,  tB: 0,   nF: 8,  fMu: 7,   fSd: 1 },
  still:  { nH: 8, tH: 4,   nB: 0,  tB: 0,   nF: 10, fMu: 5,   fSd: 1 },
  past:   { nH: 0, tH: 0,   nB: 10, tB: 6.5, nF: 10, fMu: 8,   fSd: 1 },
  few:    { nH: 0, tH: 10,  nB: 0,  tB: 5.5, nF: 0,  fMu: 7.5, fSd: 1 } };
const B_NONE = { nH: 0, tH: 10, nB: 0, tB: 0, nF: 0, fMu: 5, fSd: 1 };
const B_rate = (r, s, reps, seed) => { let k = 0; for (let q = 0; q < reps; q++) if (B_judge(r, B_runAll(Object.assign({}, s, r.hold), mulberry32(seed + q * 7919)).final)) k++; return k / reps; };
{
  const own = B_ROUNDS.map((r, i) => ({ k: r.key, v: B_rate(r, B_SOL[r.key], 20, 11000 + i * 97) }));
  check("B every round is hit at its setting", own.every(q => q.v >= 0.8), own.map(q => q.k + " " + Math.round(100 * q.v) + "%").join("  ") + "  (20 runs each)");
  const open = B_ROUNDS.map((r, i) => B_rate(r, B_OPEN, 10, 12000 + i * 97)), nil = B_ROUNDS.map((r, i) => B_rate(r, B_NONE, 10, 12500 + i * 97));
  check("B the opening, and no visitors at all, hit none", open.every(v => v === 0) && nil.every(v => v === 0),
        "opening: " + open.map(v => Math.round(100 * v) + "%").join(" / ") + "; no visitors: " + nil.map(v => Math.round(100 * v) + "%").join(" / ") + "  (10 runs each)");
  /* the cheap routes (eight start meadows, 2026-09-29): past the orange 0%;
     the held bees answered by butterflies on the middle alone 3%; one kind
     of visitor against ten hummingbirds 0%; few visitors aimed straight at
     the window (bees at 7.5, the butterfly around 7.5 +- 0.5) 8%, crashing
     to ~16 flowers and some dying */
  const by = k => B_ROUNDS.find(r => r.key === k);
  const past = B_rate(by("orange"), Object.assign({}, B_NONE, { nH: 8, tH: 3 }), 10, 13000);
  const mid = B_rate(by("still"), Object.assign({}, B_NONE, { nF: 10, fMu: 5, fSd: 1 }), 10, 13100);
  let alone = 0;
  for (const t of [5, 5.5, 6, 6.5, 7, 7.5]) alone = Math.max(alone, B_rate(by("past"), Object.assign({}, B_NONE, { nB: 10, tB: t }), 6, 13200 + t * 10));
  for (const [a, b] of [[7, 2], [8, 1], [8.5, 1], [9, 1.5], [7.5, 0.5]]) alone = Math.max(alone, B_rate(by("past"), Object.assign({}, B_NONE, { nF: 10, fMu: a, fSd: b }), 6, 13400 + a * 10 + b));
  const straight = B_rate(by("few"), Object.assign({}, B_NONE, { tB: 7.5, fMu: 7.5, fSd: 0.5 }), 12, 13600);
  check("B the cheap routes miss", past <= 0.2 && mid <= 0.3 && alone <= 0.34 && straight <= 0.4,
        "orange with hummingbirds at 3: " + Math.round(100 * past) + "%; still with butterflies around 5 alone: " + Math.round(100 * mid) +
        "%; past with one kind of visitor (best of 11): " + Math.round(100 * alone) + "%; few aimed straight at 7-8 (bees at 7.5, the butterfly 7.5 ± 0.5): " + Math.round(100 * straight) + "%");
  /* no one setting clears three: random settings, each tried 3 times per round, cleared when 2 of 3 hit */
  const rng = mulberry32(4321), g = () => Math.round(rng() * 20) / 2, n = () => Math.floor(rng() * 11), hist = [0, 0, 0, 0, 0, 0];
  let most = 0; const NS = 200;
  const sets = Object.values(B_SOL).slice();
  for (let q = 0; q < NS; q++) sets.push({ nH: n(), tH: g(), nB: n(), tB: g(), nF: n(), fMu: g(), fSd: 0.25 + Math.floor(rng() * 16) * 0.25 });
  sets.forEach((s, q) => { const c = B_ROUNDS.filter((r, i) => B_rate(r, s, 3, 14000 + q * 13 + i) >= 0.66).length; hist[c]++; if (c > most) most = c; });
  check("B no one setting clears three rounds", most <= 2,
        sets.length + " settings (the five answers and " + NS + " at random), 3 runs a round: rounds cleared " + hist.map((v, k) => k + ":" + v).filter((_, k) => k <= 3).join(" ") + "; the greediest clears " + most);
}
{
  /* the map: a count set on its column; the butterflies' favourite dragged
     along its row, and their spread from the small handle under it */
  const cv = document.getElementById("B_map"), rc = cv.getBoundingClientRect(), W = +cv.dataset.drawW, H = +cv.dataset.cssH, f = B_mapFrame(W, H);
  const keep = B_setNow(), ev = (type, x, y) => cv.dispatchEvent(new PointerEvent(type, { clientX: rc.left + x * rc.width / W, clientY: rc.top + y * rc.height / H, pointerId: 1, bubbles: true }));
  Object.assign(B, { nF: 2, fMu: 5, fSd: 1, tB: 0 }); B_syncHold();
  ev("pointerdown", f.cx[2], f.cBot - 3.5 * f.sh); ev("pointerup", f.cx[2], f.cBot - 3.5 * f.sh);
  const nGot = B.nF;
  ev("pointerdown", f.x(5), f.rows[2]); ev("pointermove", f.x(7.5), f.rows[2]); ev("pointerup", f.x(7.5), f.rows[2]);
  const muGot = B.fMu;
  ev("pointerdown", f.x(8.5), f.rows[2] + 9); ev("pointermove", f.x(9.75), f.rows[2] + 9); ev("pointerup", f.x(9.75), f.rows[2] + 9);
  const sdGot = B.fSd;
  ev("pointerdown", f.x(7.5 - 2.25), f.rows[2] + 9); ev("pointermove", f.x(7.5 - 0.1), f.rows[2] + 9); ev("pointerup", f.x(7.5 - 0.1), f.rows[2] + 9);
  const sdMin = B.fSd;
  Object.assign(B, keep); B_syncHold(); B.run = null; B_paint();
  check("B the map sets counts, the butterflies' favorite and their spread where the pointer is", nGot === 4 && muGot === 7.5 && sdGot === 2.25 && sdMin === B_SDMIN,
        "fourth butterfly slot: " + nGot + " butterflies; favorite dragged from 5 to 7.5: " + muGot + "; spread handle dragged out to 9.75: spread " + sdGot +
        "; the other spread handle dragged onto the favorite: " + sdMin + " (the narrowest, " + B_SDMIN + ")");
}
{
  /* the card reads the average and the count off the flowers on screen */
  const keep = B.run, run = B_runAll(B_SOL.orange, mulberry32(15));
  B.run = run; B.show = null; B_drawCard();
  const txt = document.getElementById("B_cardRead").textContent;
  const avg = +(/average color ([0-9.]+)/.exec(txt) || [0, NaN])[1], cnt = +(/(\\d+) flowers/.exec(txt) || [0, NaN])[1];
  const hand = run.final.z.reduce((a, b) => a + b, 0) / run.final.n;
  B.run = keep; B_paint();
  check("B the card's average and count are the final meadow's", avg === +hand.toFixed(2) && cnt === run.final.n,
        "printed average " + avg + ", counted here " + hand.toFixed(2) + "; printed " + cnt + " flowers, counted " + run.final.n);
}
/* ---- the identity, recomputed here from the dots ----------------------- */
{
  let worst = 0, worstRect = 0, n = 0;
  for (const sd of [0.5, 1.5, 3]) for (const beta of [-1, -0.3, 0, 0.4, 1.2]) for (let q = 0; q < 5; q++) {
    const pop = C_makePop(sd, 900 + q * 13 + Math.round(sd * 10)), rng = mulberry32(1000 + q * 7919);
    const w = C_lambda(pop, beta).map(l => C_pois(rng, l)), st = C_stats(pop, w);
    /* by hand: the weighted mean of the parents' trait, minus their mean */
    let sw = 0, swz = 0, sz = 0; for (let i = 0; i < pop.z.length; i++) { sw += w[i]; swz += w[i] * pop.z[i]; sz += pop.z[i]; }
    const shift = sw > 0 ? swz / sw - sz / pop.z.length : 0;
    /* the rectangles, one per dot, signed, averaged */
    const zb = sz / pop.z.length, wb = sw / pop.z.length;
    let rect = 0; for (let i = 0; i < pop.z.length; i++) rect += (pop.z[i] - zb) * (w[i] - wb) / pop.z.length;
    worst = Math.max(worst, Math.abs(shift - rect / wb), Math.abs(st.shift - shift));
    worstRect = Math.max(worstRect, Math.abs(rect - st.cov)); n++;
  }
  check("C the shift is cov(w, z) / w̄, and the covariance is the average rectangle", worst < 1e-9 && worstRect < 1e-9,
        n + " populations x slopes x draws: largest gap " + worst.toExponential(1) + " (shift) and " + worstRect.toExponential(1) + " (rectangles)");
}
{
  /* selection needs variation: one slope, four spreads */
  const beta = 0.3, rows = [0.5, 1, 2, 3].map(sd => { const pop = C_makePop(sd, 1200 + sd * 10), st = C_stats(pop, C_lambda(pop, beta));
    return { sd, V: pop.V, shift: st.shift, pred: beta * pop.V / st.wb }; });
  check("C at one slope the shift grows with the variance", rows.every((q, i) => i === 0 || q.shift > rows[i - 1].shift) && rows.every(q => Math.abs(q.shift - q.pred) < 0.02 * Math.max(1, q.pred)),
        "slope 0.3: " + rows.map(q => "spread " + q.sd + " (variance " + q.V.toFixed(2) + ") → " + q.shift.toFixed(3) + " [slope × variance ÷ w̄ " + q.pred.toFixed(3) + "]").join("  "));
}
/* ---- the rounds --------------------------------------------------------- */
{
  const popOf = (r, i) => C_makePop(r.sd, pageSeed("l13Ap", 1, 99999) + (i + 1) * 7919);
  const hitA = (r, pop, beta, reps, seed) => { let k = 0; const lam = C_lambda(pop, beta);
    for (let q = 0; q < reps; q++) { const rng = mulberry32(seed + q * 7919); if (Math.abs(C_stats(pop, lam.map(l => C_pois(rng, l))).shift - r.S) <= C_tol(r)) k++; }
    return k / reps; };
  const own = C_ROUNDS.map((r, i) => { const pop = popOf(r, i), beta = Math.round(200 * r.S / pop.V) / 100; return { k: r.key, beta, v: hitA(r, pop, beta, 40, 2000 + i * 97) }; });
  check("C every round is hit at its slope", own.every(q => q.v >= 0.9),
        own.map(q => q.k + " @" + q.beta + ": " + Math.round(100 * q.v) + "%").join("  ") + "  (40 draws each)");
  const zero = C_ROUNDS.map((r, i) => hitA(r, popOf(r, i), 0, 20, 2500 + i * 97));
  check("C slope 0, the opening, hits none", zero.every(v => v === 0), zero.map(v => Math.round(100 * v) + "%").join(" / "));
  let most = 0, at = 0;
  for (let b = -1.5; b <= 1.5001; b += 0.01) { const beta = Math.round(b * 100) / 100;
    const c = C_ROUNDS.filter((r, i) => { const pop = popOf(r, i); return Math.abs(C_stats(pop, C_lambda(pop, beta)).shift - r.S) <= C_tol(r); }).length;
    if (c > most) { most = c; at = beta; } }
  check("C no one slope clears three rounds", most <= 2, "301 slopes on the expected offspring: the greediest (" + at + ") clears " + most);
  const spreadOK = C_ROUNDS.map((r, i) => { const pop = popOf(r, i); return Math.round(200 * r.S / pop.V) / 100; });
  check("C the slope a round needs changes with its spread", Math.max(...spreadOK.map(Math.abs)) / Math.min(...spreadOK.map(Math.abs)) > 3,
        "slopes: " + spreadOK.join(", ") + " — spreads " + C_ROUNDS.map(r => r.sd).join(", "));
}
/* ---- the drag puts the slope where the pointer is ---------------------- */
{
  const cv = document.getElementById("C_scatter"), rc = cv.getBoundingClientRect(), W = +cv.dataset.drawW, H = +cv.dataset.cssH;
  const keep = C.beta; C.drawn = null;
  const f = C_frameTop(W, H), z = C.pop.zb + 2 * C.pop.sd, w = C_WBAR + 0.4 * (2 * C.pop.sd);
  C_dragTo({ clientX: rc.left + f.x(z) * rc.width / W, clientY: rc.top + f.y(w) * rc.height / H });
  const got = C.beta; C.beta = keep; C_syncSliders(); C_paint();
  check("C dragging on the plot sets the slope through the pointer", Math.abs(got - 0.4) <= 0.02, "pointer on the line of slope 0.40 through the average parent: slope set to " + got);
}
/* ---- D: the model, recomputed here -------------------------------------- */
const D_gen = (h2, beta, seed) => D_breed(D_makePop(h2, seed), beta, mulberry32(seed + 17));
{
  /* the offspring move h2 times the parents who bred: pooled slope through
     the origin, 60 runs at slopes -1 and +1 */
  const rows = [0, 0.25, 0.5, 0.8, 1].map(h2 => { let sr = 0, ss = 0;
    for (let q = 0; q < 30; q++) for (const beta of [-1, 1]) {
      const g = D_gen(h2, beta, 3000 + q * 131 + Math.round(h2 * 1000) + (beta > 0 ? 7 : 0)); sr += g.S * g.R; ss += g.S * g.S; }
    return { h2, slope: sr / ss }; });
  check("D the offspring move h² times the parents who bred", rows.every(q => Math.abs(q.slope - q.h2) < 0.05),
        rows.map(q => "h² " + q.h2 + " → " + q.slope.toFixed(3)).join("  ") + "  (60 runs each)");
  /* none inherited: ratchet the slope to the stop and nothing moves */
  const flat = [-1.5, 1.5].map(beta => { const R = [], S = []; for (let q = 0; q < 20; q++) { const g = D_gen(0, beta, 3500 + q * 17 + (beta > 0 ? 3 : 0)); R.push(g.R); S.push(g.S); }
    return { beta, R: mn(R), S: mn(S), se: sdv(R) / Math.sqrt(R.length) }; });
  check("D no inherited variation: no response at the slider's stops", flat.every(q => Math.abs(q.R) < 3 * q.se + 0.005 && Math.abs(q.S) > 0.5),
        flat.map(q => "slope " + q.beta + ": parents moved " + q.S.toFixed(3) + ", offspring " + q.R.toFixed(4) + " ± " + q.se.toFixed(4)).join("  "));
  /* the spread holds across the generation: a midparent halves the inherited
     variance and the segregation term puts it back */
  const vs = []; for (let q = 0; q < 20; q++) { const g = D_gen(0.5, 0, 3700 + q * 29); vs.push(sdv(Array.from(g.zo)) ** 2); }
  check("D at slope 0 the offspring vary as much as their parents", Math.abs(mn(vs) - 1) < 0.03, "offspring variance " + mn(vs).toFixed(3) + " (parents 1), 20 runs, h² 0.5");
  /* every population varies alike, so one slope gives one shift */
  const sh = [0.2, 0.5, 0.9].map(h2 => { const S = []; for (let q = 0; q < 20; q++) S.push(D_gen(h2, 1, 3900 + q * 23 + Math.round(h2 * 100)).S); return mn(S); });
  check("D one slope moves the parents who bred alike in every population", Math.max(...sh) - Math.min(...sh) < 0.03,
        "slope 1: h² 0.2, 0.5, 0.9 → " + sh.map(v => v.toFixed(3)).join(", "));
}
{
  /* the printed arithmetic, against a hand count */
  const pop = D_makePop(0.6, 4242), g = D_breed(pop, 1, mulberry32(4243));
  let zb = 0, sw = 0, swz = 0, so = 0; for (let i = 0; i < pop.z.length; i++) { zb += pop.z[i] / pop.z.length; sw += g.uses[i]; swz += g.uses[i] * pop.z[i]; so += g.zo[i]; }
  const S = swz / sw - zb, R = so / g.zo.length - zb;
  const keep = { run: D.run, frame: D.frame, pts: D.pts };
  g.parents = pop; g.key = "r1"; D.run = g; D.frame = null; D_drawGen();
  const txt = document.getElementById("D_read").textContent.replace(/\\s+/g, " ");
  const num = re => { const m = re.exec(txt); return m ? +m[1] : NaN; };
  const pS = num(/bred moved ([+-][0-9.]+)/), pR = num(/offspring moved ([+-][0-9.]+)/), pQ = num(/parents ([0-9.-]+)/);
  D.pts = [{ key: "r2", S: 0.3, R: 0.2 }, { key: "r2", S: -0.5, R: -0.4 }, { key: "r2", S: 0.6, R: 0.5 }]; D_drawPts();
  const fit = (0.3 * 0.2 + 0.5 * 0.4 + 0.6 * 0.5) / (0.09 + 0.25 + 0.36);
  const pF = +(/population 2: 3 runs · slope of its line ([0-9.]+)/.exec(document.getElementById("D_ptsRead").textContent) || [0, NaN])[1];
  Object.assign(C, keep); D_paint();
  check("D the printed shifts, ratio and fitted slope agree with a hand count",
        sw === 2 * pop.z.length && pS === +S.toFixed(2) && pR === +R.toFixed(2) && pQ === +(R / S).toFixed(2) && pF === +fit.toFixed(2),
        "parents counted " + sw + " times (2 per child); printed " + pS + ", " + pR + ", ratio " + pQ + " — by hand " + S.toFixed(3) + ", " + R.toFixed(3) + ", " + (R / S).toFixed(3) +
        "; fitted slope printed " + pF + ", by hand " + fit.toFixed(3));
}
/* ---- D: the rounds ------------------------------------------------------ */
{
  const rate = (r, beta, reps, seed) => { let k = 0; for (let q = 0; q < reps; q++) if (Math.abs(D_gen(r.h2, beta, seed + q * 7919).R - r.R) <= D_TOL) k++; return k / reps; };
  const slopes = []; for (let b = -1.5; b <= 1.5001; b += 0.05) slopes.push(Math.round(b * 100) / 100);
  const table = D_ROUNDS.map((r, i) => slopes.map(b => rate(r, b, 12, 5000 + i * 97 + Math.round(b * 100) * 3)));
  const best = D_ROUNDS.map((r, i) => { let j = 0; table[i].forEach((v, k) => { if (v > table[i][j]) j = k; });
    return { k: r.key, b: slopes[j], v: rate(r, slopes[j], 40, 9000 + i * 31) }; });
  check("D every round is hit at its best slope", best.every(q => q.v >= 0.7),
        best.map(q => q.k + " @" + q.b + ": " + Math.round(100 * q.v) + "%").join("  ") + "  (best of 61 slopes by 12 runs, then 40 fresh)");
  const zero = D_ROUNDS.map((r, i) => rate(r, 0, 20, 9500 + i * 31));
  check("D slope 0, the opening, hits none", zero.every(v => v === 0), zero.map(v => Math.round(100 * v) + "%").join(" / "));
  let most = 0, at = 0;
  slopes.forEach((b, j) => { const c = D_ROUNDS.filter((_, i) => table[i][j] >= 0.5).length; if (c > most) { most = c; at = b; } });
  check("D no one slope clears three rounds", most <= 2, "61 slopes, 12 runs each: the greediest (" + at + ") hits half the time or more in " + most);
}
/* ---- E: the regression, recomputed here --------------------------------- */
const E_popOf = i => E_makePop(E_ROUNDS[i], pageSeed("l13Cp", 1, 99999) + (i + 1) * 7919);
{
  /* a hand solve: the 3 x 3 normal equations on raw sums, by elimination */
  const solve = pop => { const n = pop.w.length, X = i => [1, pop.z1[i], pop.z2[i]];
    const A = [[0,0,0],[0,0,0],[0,0,0]], y = [0,0,0];
    for (let i = 0; i < n; i++) { const x = X(i); for (let a = 0; a < 3; a++) { y[a] += x[a] * pop.w[i]; for (let b = 0; b < 3; b++) A[a][b] += x[a] * x[b]; } }
    for (let c = 0; c < 3; c++) for (let r = c + 1; r < 3; r++) { const k = A[r][c] / A[c][c]; for (let q = c; q < 3; q++) A[r][q] -= k * A[c][q]; y[r] -= k * y[c]; }
    const b = [0,0,0]; for (let r = 2; r >= 0; r--) { let t = y[r]; for (let q = r + 1; q < 3; q++) t -= A[r][q] * b[q]; b[r] = t / A[r][r]; }
    let ss = 0; for (let i = 0; i < n; i++) { const e = pop.w[i] - b[0] - b[1] * pop.z1[i] - b[2] * pop.z2[i]; ss += e * e / n; }
    return { b1: b[1], b2: b[2], sig: Math.sqrt(ss) }; };
  let worst = 0, lean = 0, sdGap = 0, corr = 0, one = 0, view = 0;
  const pops = E_ROUNDS.map((_, i) => E_popOf(i));
  for (const pop of pops) {
    const f = pop.fit, h = solve(pop);
    worst = Math.max(worst, Math.abs(f.b1 - h.b1), Math.abs(f.b2 - h.b2), Math.abs(f.sig - h.sig));
    const st = E_leftStats(pop, f.b1, f.b2);
    lean = Math.max(lean, Math.abs(st.lean1), Math.abs(st.lean2)); sdGap = Math.max(sdGap, Math.abs(st.sd - f.sig));
    corr = Math.max(corr, Math.abs(f.c12));
    /* one trait at a time: slope, and the spread left around it */
    for (const k of [1, 2]) { const z = k === 1 ? pop.z1 : pop.z2, m = k === 1 ? f.m1 : f.m2, v = k === 1 ? f.v1 : f.v2;
      let c = 0; for (let i = 0; i < E_N; i++) c += (z[i] - m) * (pop.w[i] - f.mw) / E_N;
      const slope = c / v; let ss = 0; for (let i = 0; i < E_N; i++) { const e = pop.w[i] - f.mw - slope * (z[i] - m); ss += e * e / E_N; }
      one = Math.max(one, Math.abs(slope - (k === 1 ? f.b1 : f.b2)));
      const keep = { b1: E.b1, b2: E.b2, sig: E.sig }; E.b1 = f.b1; E.b2 = f.b2; E.sig = f.sig;
      view = Math.max(view, Math.abs(Math.sqrt(ss) - E_viewSpread(pop, k))); Object.assign(D, keep); }
  }
  check("E the page's least squares agrees with a hand solve", worst < 1e-9, "5 populations: largest gap " + worst.toExponential(1));
  check("E at the least-squares arrows the leftover leans on neither trait, and its spread is the box", lean < 1e-9 && sdGap < 1e-9,
        "largest lean " + lean.toExponential(1) + ", spread vs fit " + sdGap.toExponential(1));
  check("E the traits are unrelated, so each one-trait slope is its arrow", corr < 1e-12 && one < 1e-9, "largest correlation " + corr.toExponential(1) + ", slope vs arrow " + one.toExponential(1));
  check("E a one-trait picture's spread is the other arrow plus the box, as the band says", view < 1e-9, "measured vs printed: largest gap " + view.toExponential(1));
  /* the least-squares arrows leave the least over */
  let least = true; const eg = [];
  pops.forEach((pop, i) => { const f = pop.fit, sd0 = E_leftStats(pop, f.b1, f.b2).sd;
    for (const [d1, d2] of [[0.3, 0], [-0.3, 0], [0, 0.3], [0, -0.3]]) { const sd = E_leftStats(pop, f.b1 + d1, f.b2 + d2).sd; if (sd <= sd0) least = false; if (i === 1 && d1 > 0) eg.push(sd0.toFixed(3) + " → " + sd.toFixed(3)); } });
  check("E the least-squares arrows leave the least over", least, "every arrow nudged 0.3 either way leaves more, all 5 populations (e.g. " + eg.join("") + ")");
  const bands = pops.map(pop => { const f = pop.fit, keep = { b1: E.b1, b2: E.b2, sig: E.sig }; E.b1 = f.b1; E.b2 = f.b2; E.sig = f.sig;
    const r = [E_inBand(pop, 1), E_inBand(pop, 2)]; Object.assign(D, keep); return r; });
  check("E at the right diagram each band holds about two in three", bands.every(q => q.every(v => v >= 0.58 && v <= 0.78)),
        bands.map(q => q.map(v => Math.round(100 * v) + "%").join("/")).join("  "));
}
/* ---- E: the rounds ------------------------------------------------------ */
{
  const pops = E_ROUNDS.map((_, i) => E_popOf(i)), r1 = v => Math.round(v * 10) / 10;
  const hits = d => pops.map(pop => { const j = E_judge(pop, d(pop)); return j.ok1 && j.ok2 && j.ok3; });
  const ls = hits(pop => ({ b1: r1(pop.fit.b1), b2: r1(pop.fit.b2), sig: r1(pop.fit.sig) }));
  check("E every round is hit at its least-squares diagram, on the slider's steps", ls.every(Boolean), ls.map(v => v ? "hit" : "MISS").join(" / "));
  const open = hits(() => ({ b1: 0, b2: 0, sig: 3 }));
  check("E the opening diagram hits none", open.every(v => !v), open.map(v => v ? "HIT" : "miss").join(" / "));
  /* the natural mistake: arrows right, the box read off the wider one-trait picture */
  const naive = hits(pop => { const f = pop.fit, s1 = Math.sqrt(f.b2 * f.b2 * f.v2 + f.sig * f.sig), s2 = Math.sqrt(f.b1 * f.b1 * f.v1 + f.sig * f.sig);
    return { b1: r1(f.b1), b2: r1(f.b2), sig: r1(Math.max(s1, s2)) }; });
  check("E reading the box off one picture misses most rounds", naive.filter(Boolean).length <= 1,
        naive.map((v, i) => E_ROUNDS[i].key + (v ? " hit" : " miss")).join("  ") + " (arrows right, box = the wider picture's spread)");
  let most = 0, at = null;
  for (let b1 = -4; b1 <= 4; b1 += 0.5) for (let b2 = -4; b2 <= 4; b2 += 0.5) for (let sg = 0; sg <= 6; sg += 0.5) {
    const c = hits(() => ({ b1, b2, sig: sg })).filter(Boolean).length; if (c > most) { most = c; at = [b1, b2, sg]; } }
  check("E no one diagram clears three rounds", most <= 2, "3757 diagrams on a 0.5 grid: the greediest (" + at + ") clears " + most);
}
/* ---- F: three causes tied by an allele ---------------------------------- */
const F_popOf = i => F_makePop(F_ROUNDS[i], pageSeed("l13Dp", 1, 99999) + (i + 1) * 7919);
{
  const pops = F_ROUNDS.map((_, i) => F_popOf(i));
  /* a hand solve: the 4 x 4 normal equations on raw sums, by elimination */
  const solve = pop => { const n = pop.w.length, K = 4, A = [], y = [0,0,0,0];
    for (let a = 0; a < K; a++) A.push([0,0,0,0]);
    for (let i = 0; i < n; i++) { const x = [1, pop.x[0][i], pop.x[1][i], pop.x[2][i]];
      for (let a = 0; a < K; a++) { y[a] += x[a] * pop.w[i]; for (let b = 0; b < K; b++) A[a][b] += x[a] * x[b]; } }
    for (let c = 0; c < K; c++) for (let r = c + 1; r < K; r++) { const k = A[r][c] / A[c][c]; for (let q = c; q < K; q++) A[r][q] -= k * A[c][q]; y[r] -= k * y[c]; }
    const b = [0,0,0,0]; for (let r = K - 1; r >= 0; r--) { let t = y[r]; for (let q = r + 1; q < K; q++) t -= A[r][q] * b[q]; b[r] = t / A[r][r]; }
    return b.slice(1); };
  let worst = 0, lean = 0, sdGap = 0, pic = 0;
  for (const pop of pops) {
    const f = pop.fit, h = solve(pop);
    worst = Math.max(worst, ...h.map((v, j) => Math.abs(v - f.b[j])));
    const st = F_leftStats(pop, f.b); lean = Math.max(lean, ...st.lean.map(Math.abs)); sdGap = Math.max(sdGap, Math.abs(st.sd - f.sig));
    /* each picture on its own, measured, against what the fitted diagram draws there */
    for (const k of [0, 1, 2]) { const m = f.m[k]; let c = 0, v = 0;
      for (let i = 0; i < F_N; i++) { c += (pop.x[k][i] - m) * (pop.w[i] - f.mw) / F_N; v += (pop.x[k][i] - m) ** 2 / F_N; }
      const slope = c / v; let ss = 0; for (let i = 0; i < F_N; i++) { const e = pop.w[i] - f.mw - slope * (pop.x[k][i] - m); ss += e * e / F_N; }
      const im = F_implied(pop, k, f.b, f.sig); pic = Math.max(pic, Math.abs(im.slope - slope), Math.abs(im.spread - Math.sqrt(ss))); }
  }
  check("F the page's least squares agrees with a hand solve", worst < 1e-9, "5 populations, 3 slopes each: largest gap " + worst.toExponential(1));
  check("F at the least-squares arrows the leftover leans on none of the three, and its spread is the box", lean < 1e-9 && sdGap < 1e-9,
        "largest lean " + lean.toExponential(1) + ", spread vs fit " + sdGap.toExponential(1));
  check("F at the fit, the line and band the diagram draws in each picture are that picture's own", pic < 1e-9, "slope and spread, 15 pictures: largest gap " + pic.toExponential(1));
  const f1 = pops[0].fit, f2_ = pops[1].fit;
  check("F a confounded trait and a mediated allele show slopes their own arrows lack",
        f1.one[2] >= 1 && Math.abs(f1.b[2]) <= 0.5 && f2_.one[0] >= 2 && Math.abs(f2_.b[0]) <= 0.5,
        "r1 stem height: picture " + f1.one[2].toFixed(2) + ", arrow " + f1.b[2].toFixed(2) + "  |  r2 allele: picture " + f2_.one[0].toFixed(2) + ", arrow " + f2_.b[0].toFixed(2));
  const bands = pops.map(pop => { const keep = { b: F.b.slice(), sig: F.sig }; F.b = pop.fit.b.slice(); F.sig = pop.fit.sig;
    const r = [0, 1, 2].map(k => F_inBand(pop, k)); F.b = keep.b; F.sig = keep.sig; return r; });
  check("F at the right diagram each band holds about two in three", bands.every(q => q.every(v => v >= 0.58 && v <= 0.78)),
        bands.map(q => q.map(v => Math.round(100 * v) + "%").join("/")).join("  "));
  const r1 = v => Math.round(v * 10) / 10;
  const hits = d => pops.map(pop => F_judge(pop, d(pop).b, d(pop).sig).ok.every(Boolean));
  const ls = hits(pop => ({ b: pop.fit.b.map(r1), sig: r1(pop.fit.sig) }));
  check("F every round is hit at its least-squares diagram, on the slider's steps", ls.every(Boolean), ls.map(v => v ? "hit" : "MISS").join(" / "));
  const open = hits(() => ({ b: [0, 0, 0], sig: 3 }));
  check("F the opening diagram hits none", open.every(v => !v), open.map(v => v ? "HIT" : "miss").join(" / "));
  const naive = hits(pop => ({ b: pop.fit.one.map(r1), sig: r1(pop.fit.sig) }));
  check("F reading each arrow off its own picture misses most rounds", naive.filter(Boolean).length <= 1,
        naive.map((v, i) => F_ROUNDS[i].key + (v ? " hit" : " miss")).join("  ") + " (box right)");
  let most = 0, at = null; const fits = pops.map(p => p.fit);
  for (let a = -4; a <= 4; a += 0.5) for (let b = -4; b <= 4; b += 0.5) for (let c = -4; c <= 4; c += 0.5) for (let sg = 0; sg <= 6; sg += 0.5) {
    let n = 0; for (const f of fits) if (Math.abs(a - f.b[0]) <= F_TOL && Math.abs(b - f.b[1]) <= F_TOL && Math.abs(c - f.b[2]) <= F_TOL && Math.abs(sg - f.sig) <= F_TOL) n++;
    if (n > most) { most = n; at = [a, b, c, sg]; } }
  check("F no one diagram clears three rounds", most <= 2, "63869 diagrams on a 0.5 grid: the greediest (" + at + ") clears " + most);
}
/* ---- G: the collider ---------------------------------------------------- */
{
  const pop = G_makePop(4321), all = G_slope(pop, null);
  const counts = [0.25, 0.5, 0.8].map(k => G_alive(pop, 1, 1, k, pop.luck).alive.reduce((x, y) => x + y, 0));
  check("G across all seedlings the traits are unrelated, and the drought kills exactly its share",
        Math.abs(all.slope) < 1e-12 && counts[0] === 1500 && counts[1] === 1000 && counts[2] === 400,
        "slope among all " + all.slope.toExponential(1) + "; survivors at 25/50/80% killed: " + counts.join(", "));
  /* with no luck, equal arrows: survival cuts (f + h)/sqrt2 at c; lambda = phi(c)/(1 - Phi(c));
     delta = lambda (lambda - c); the survivors' slope of stem on flower is -delta / (2 - delta) */
  const erf = x => { const t = 1 / (1 + 0.3275911 * Math.abs(x)), y = 1 - (((((1.061405429 * t - 1.453152027) * t) + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-x * x);
    return x >= 0 ? y : -y; };
  const Phi = x => 0.5 * (1 + erf(x / Math.SQRT2)), phi = x => Math.exp(-x * x / 2) / Math.sqrt(2 * Math.PI);
  const qn = p => { let lo = -8, hi = 8; for (let k = 0; k < 80; k++) { const m = (lo + hi) / 2; if (Phi(m) < p) lo = m; else hi = m; } return (lo + hi) / 2; };
  const rows = [0.3, 0.6, 0.9].map(k => { const c = qn(k), lam = phi(c) / (1 - Phi(c)), d = lam * (lam - c);
    let m = 0; for (let q = 0; q < 8; q++) m += G_slope(G_makePop(5000 + q * 37), G_alive(G_makePop(5000 + q * 37), 1, 1, k, null).alive).slope / 8;
    return { k, got: m, want: -d / (2 - d) }; });
  check("G with no luck the survivors' slope is the truncated-normal value", rows.every(q => Math.abs(q.got - q.want) < 0.03),
        rows.map(q => Math.round(q.k * 100) + "% killed: " + q.got.toFixed(3) + " [formula " + q.want.toFixed(3) + "]").join("  ") + "  (8 populations each)");
  const mean = (wf, wh, k) => { let m = 0; for (let q = 0; q < 10; q++) { const pp = G_makePop(6000 + q * 41), rng = mulberry32(6100 + q * 43), lk = Float64Array.from({ length: G_N }, () => C_gauss(rng));
    m += G_slope(pp, G_alive(pp, wf, wh, k, lk).alive).slope / 10; } return m; };
  const eq = [0, 0.2, 0.5, 0.8].map(k => mean(1, 1, k)), flip = mean(1, -1, 0.5);
  check("G the survivors' trade-off deepens with the drought, and flips sign with the rule",
        Math.abs(eq[0]) < 0.02 && eq[1] < -0.1 && eq[2] < eq[1] && eq[3] < eq[2] && flip > 0.3,
        "equal arrows, 0/20/50/80% killed: " + eq.map(v => v.toFixed(2)).join(", ") + "  |  flower +1, stem -1, 50%: " + flip.toFixed(2) + "  (10 runs each)");
}
{
  const kills = []; for (let k = 0; k <= 0.95001; k += 0.05) kills.push(Math.round(k * 100) / 100);
  const one = (r, k, seed) => { const pp = G_makePop(seed), rng = mulberry32(seed + 17), lk = new Float64Array(G_N);
    for (let i = 0; i < G_N; i++) lk[i] = C_gauss(rng); return G_slope(pp, G_alive(pp, r.wf, r.wh, k, lk).alive).slope; };
  const rate = (r, k, reps, seed) => { let c = 0; for (let q = 0; q < reps; q++) if (Math.abs(one(r, k, seed + q * 7919) - r.T) <= G_TOL) c++; return c / reps; };
  const table = G_ROUNDS.map((r, i) => kills.map(k => rate(r, k, 10, 7000 + i * 97 + Math.round(k * 100) * 3)));
  const best = G_ROUNDS.map((r, i) => { let j = 0; table[i].forEach((v, q) => { if (v > table[i][j]) j = q; });
    return { k: r.key, kill: kills[j], v: rate(r, kills[j], 40, 9100 + i * 31) }; });
  check("G every round is hit at its best drought", best.every(q => q.v >= 0.7),
        best.map(q => q.k + " @" + Math.round(q.kill * 100) + "%: " + Math.round(100 * q.v) + "%").join("  ") + "  (best of 20 by 10 runs, then 40 fresh)");
  const zero = G_ROUNDS.map((r, i) => rate(r, 0, 10, 9500 + i * 31));
  check("G no drought, the opening, hits none", zero.every(v => v === 0), zero.map(v => Math.round(100 * v) + "%").join(" / "));
  let most = 0, at = 0;
  kills.forEach((k, j) => { const c = G_ROUNDS.filter((_, i) => table[i][j] >= 0.5).length; if (c > most) { most = c; at = k; } });
  check("G no one drought clears three rounds", most <= 2, "20 droughts, 10 runs each: the greediest (" + Math.round(at * 100) + "%) hits half the time or more in " + most);
}
/* ---- every plot inside its panel --------------------------------------- */
{
  document.getElementById("stageG").classList.remove("stage-locked");
  document.getElementById("stageD").classList.remove("stage-locked");
  document.getElementById("stageE").classList.remove("stage-locked");
  document.getElementById("stageF").classList.remove("stage-locked");
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
  const out = [], stages = { A, B, C, D, E, F, G };
  let aBefore = "", aAfter = "", hidden = "", shown = "", leftBefore = "", leftAfter = "", dBefore = "", dAfter = "";
  try {
    for (const [S, go] of [["A", "A_run"], ["B", "B_run"], ["C", "C_run"], ["D", "D_run"], ["E", "E_run"], ["F", "F_run"], ["G", "G_run"]]) {
      document.getElementById("stage" + S).classList.remove("stage-locked");
      const g = stages[S].game, box = document.getElementById(S + "_practice"), btn = document.getElementById(go);
      const tick = on => { box.checked = on; box.dispatchEvent(new Event("change")); };
      const n0 = g.st.hits.length;
      if (S === "A") { tick(false); aBefore = document.getElementById("A_cardRead").textContent; }
      if (S === "E") { tick(false); leftBefore = document.getElementById("E_leftRead").textContent; }
      if (S === "F") { tick(false); dBefore = document.getElementById("F_leftRead").textContent; }
      tick(true); btn.click();
      const pracOk = g.st.hits.length === n0 && g.st.last != null && /practice/.test(document.getElementById(S + "_tflip").textContent);
      if (S === "D") hidden = document.getElementById("D_ptsRead").textContent;
      tick(false); btn.click();
      if (S === "A") aAfter = document.getElementById("A_cardRead").textContent;
      if (S === "D") shown = document.getElementById("D_ptsRead").textContent;
      if (S === "E") leftAfter = document.getElementById("E_leftRead").textContent;
      if (S === "F") dAfter = document.getElementById("F_leftRead").textContent;
      const scored = g.st.hits.length === n0 + 1 && g.waiting(), blocked = btn.disabled;
      tick(true); btn.click();
      const stillPrac = !btn.disabled && g.st.hits.length === n0 + 1 && g.waiting();
      tick(false);
      out.push({ ok: pracOk && scored && blocked && stillPrac,
                 t: S + ": practice " + (pracOk ? "unscored" : "SCORED") + ", ticked off " + (scored ? "scored" : "NOT scored") +
                    ", waiting " + (blocked ? "Go off" : "GO ON") + (stillPrac ? " but practice runs" : ", practice BLOCKED") });
    }
  } finally { window.setInterval = realSI; window.clearInterval = realCI; }
  check("every stage has a practice switch that does not score", out.length === 7 && out.every(q => q.ok), out.map(q => q.t).join("  |  "));
  check("A the offspring's average waits for Go in a round, and shows after it", /after Go/.test(aBefore) && !/offspring's [0-9]/.test(aBefore) && /offspring's [0-9]/.test(aAfter),
        "before: '" + aBefore.trim().slice(0, 60) + "'; after the scored run: '" + aAfter.trim().slice(0, 60) + "'");
  check("E the leftover waits for Go in a round, and shows after it", !/left over: spread/.test(leftBefore) && /left over: spread/.test(leftAfter) && /least squares on these plants/.test(leftAfter),
        "before: '" + leftBefore.trim().slice(0, 40) + "'; after the scored run: '" + leftAfter.trim().slice(0, 40) + "…'");
  check("F the leftover waits for Go in a round, and shows after it", !/left over: spread/.test(dBefore) && /left over: spread/.test(dAfter) && /least squares on these plants/.test(dAfter),
        "before: '" + dBefore.trim().slice(0, 40) + "'; after the scored run: '" + dAfter.trim().slice(0, 40) + "…'");
  const h1 = f2(D_ROUNDS[0].h2);
  check("D a population's inherited share shows only after its scored run", /inherited share \\?/.test(hidden) && new RegExp("inherited share " + h1).test(shown),
        "after a practice run: '" + (/population 1[^\\n]*/.exec(hidden) || [""])[0].trim() + "'; after the scored run: '" + (/population 1[^\\n]*/.exec(shown) || [""])[0].trim() + "'");
}

say(bad ? ("FAILED " + bad) : "ALL BARS PASS");
say("RAN " + ran);
L.join(" ;; ");
`;

const probe = `<!doctype html><meta charset="utf-8"><title>pending</title>
<iframe id="f" src="http://127.0.0.1:${PORT}/app/lessons/lesson13.html?preview=1" width="1500" height="1000"></iframe>
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

const probePath = path.join(ROOT, "_check_l13.html");
fs.writeFileSync(probePath, probe);
const server = spawn("python3", ["-m", "http.server", String(PORT), "--directory", ROOT],
                     { stdio: "ignore", detached: true });
const cleanup = () => { try { process.kill(-server.pid); } catch (e) {} try { fs.unlinkSync(probePath); } catch (e) {} };
process.on("exit", cleanup);

setTimeout(() => {
  const r = spawnSync(CHROME, ["--headless=new", "--disable-gpu", "--virtual-time-budget=900000",
                               "--dump-dom", `http://127.0.0.1:${PORT}/_check_l13.html`],
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
