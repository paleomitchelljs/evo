#!/usr/bin/env node
/*
 * check_lesson13_numbers.js -- the bar checks for app/lessons/lesson13.html.
 *
 * Lesson 13 is a draft (2026-09-24; rebuilt 2026-09-29): A the two routes,
 * B the meadow, C the diagram behind the two terms (one trait), D the same
 * diagram with a second trait (ten targets). One bit per scored attempt.
 * What has to hold:
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
 *      the meadow and strips its genes; every round hit at its setting
 *      (orange and purple hold the butterflies), the opening and no
 *      visitors hitting none, the cheap routes missing, no one setting
 *      clearing three; the map sets what the pointer is on; the card reads
 *      the average and count off the flowers;
 *   C. the start has the spread the arrows say; cov(w, z) + E(wΔz) is the
 *      change, every generation, counted seedling by seedling, and each
 *      term splits by the diagram's inputs; the slope of seedlings on their
 *      parents' average is the genes' share; the expected terms are the
 *      arrows' arithmetic and a run lands a little under them; the
 *      environment arrow grows cov(w, z) and E(wΔz) takes it back; nothing
 *      in the genes, nothing moves; a drought moves the average once; the
 *      rounds as in B; in a round the diagram carries a generation's terms as
 *      the arrows set them, the card's bells are trial generations centred on
 *      them, the card prints no numbers and nothing shows an expected end;
 *   D. the traits are tied only through the boxes they share; the terms
 *      add up for both; the responses keep the genes arrows' ratio
 *      whichever trait is selected; a shared environment gives cov(w, z)
 *      that E(wΔz) takes back; the rounds as in B;
 * The old C (covariance), D (what responds) and E (least squares) were
 * archived 2026-09-29 with their checks, and E (mediator / confounder) and F
 * (collider) on 2026-09-30: see app/archive/README.md.
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

check("page loaded", !!(A && A.game && B && B.game && C && C.game && C.paths && D && D.game && D.paths && typeof Score !== "undefined"), "Stages A-D, the two diagrams and Score are defined");
{
  /* one bit per scored attempt: five for A, B, C, ten for D, in order, no gaps */
  const want = []; for (const [S, n] of [["A", 5], ["B", 5], ["C", 5], ["D", 10]]) for (let k = 1; k <= n; k++) want.push(S + k);
  const ok = Object.keys(BIT).length === 25 && want.every((k, i) => BIT[k] === i) && A.game.st && D_ROUNDS.length === 10;
  check("one bit per scored attempt: 25 slots, five for A, B and C, ten for D", ok, Object.keys(BIT).length + " named bits (" + Object.keys(BIT).slice(0, 3).join(", ") + " … " + Object.keys(BIT).slice(-2).join(", ") + "); D deals " + D_ROUNDS.length + " rounds");
}
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
  /* JM, 2026-09-30: nothing under the card on a plain round -- no averages, no sums -- while the
     card's arrows show in practice */
  const keep = { n: A.n.slice(), d: A.d.slice(), step: A.step }, box = document.getElementById("A_practice");
  box.checked = true; A_setStep(1); A.n = [0, 1, 1, 2, 2, 2, 3, 3, 4, 5]; A_changed("n");
  const txt = document.getElementById("A_cardRead").textContent, shows = A_cardShows(), t = A_terms(A.n, A.d);
  box.checked = false; A_setStep(keep.step); A.n = keep.n; A.d = keep.d; A_changed("n"); A_syncGo();
  check("A the card is bare underneath and its arrows show in practice", !/[0-9]/.test(txt) && shows && Math.abs(t.cov + t.tr - t.dz) < 1e-12,
        "under the card: '" + txt.trim().slice(0, 60) + "'; arrows showing: " + shows + "; cov + E(wΔz) - Δz = " + (t.cov + t.tr - t.dz).toExponential(1));
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
  orange: { nH: 8, tH: 3,   nB: 0,  tB: 0,   nF: 0,  fMu: 5,   fSd: 1 },
  purple: { nH: 0, tH: 10,  nB: 8,  tB: 6.5, nF: 0,  fMu: 5,   fSd: 1 },
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
  /* the cheap routes (eight start meadows, 2026-09-29): hummingbirds at 4,
     orange's answer before the butterflies were held; the held bees
     answered by butterflies on the middle alone 3%; one kind of visitor
     against ten hummingbirds 0%; few visitors aimed straight at the window
     (bees at 7.5, the butterfly around 7.5 +- 0.5) 8%, crashing to ~16
     flowers and some dying */
  const by = k => B_ROUNDS.find(r => r.key === k);
  const past = B_rate(by("orange"), Object.assign({}, B_NONE, { nH: 8, tH: 4 }), 10, 13000);
  const mid = B_rate(by("still"), Object.assign({}, B_NONE, { nF: 10, fMu: 5, fSd: 1 }), 10, 13100);
  let alone = 0;
  for (const t of [5, 5.5, 6, 6.5, 7, 7.5]) alone = Math.max(alone, B_rate(by("past"), Object.assign({}, B_NONE, { nB: 10, tB: t }), 6, 13200 + t * 10));
  for (const [a, b] of [[7, 2], [8, 1], [8.5, 1], [9, 1.5], [7.5, 0.5]]) alone = Math.max(alone, B_rate(by("past"), Object.assign({}, B_NONE, { nF: 10, fMu: a, fSd: b }), 6, 13400 + a * 10 + b));
  const straight = B_rate(by("few"), Object.assign({}, B_NONE, { tB: 7.5, fMu: 7.5, fSd: 0.5 }), 12, 13600);
  check("B the cheap routes miss", past <= 0.2 && mid <= 0.3 && alone <= 0.34 && straight <= 0.4,
        "orange with hummingbirds at 4 against the held butterflies: " + Math.round(100 * past) + "%; still with butterflies around 5 alone: " + Math.round(100 * mid) +
        "%; past with one kind of visitor (best of 11): " + Math.round(100 * alone) + "%; few aimed straight at 7-8 (bees at 7.5, the butterfly 7.5 ± 0.5): " + Math.round(100 * straight) + "%");
  /* JM, 2026-09-29: "too easy to just set the butterfly on the target". Orange and purple hold them now;
     the old answer, butterflies on the window, comes out as the held butterflies and misses */
  const onWin = ["orange", "purple"].map((k, i) => { const r = by(k); return B_rate(r, Object.assign({}, B_NONE, { nF: 10, fMu: (r.lo + r.hi) / 2, fSd: 0.5 }), 6, 13700 + i * 7); });
  check("B orange and purple hold the butterflies, so they cannot be set on the window", onWin.every(v => v === 0) && ["orange", "purple"].every(k => "fMu" in by(k).hold && "nF" in by(k).hold),
        "butterflies 10 on the window, ± 0.5, with nothing else: orange " + Math.round(100 * onWin[0]) + "%, purple " + Math.round(100 * onWin[1]) + "% (100% before they were held)");
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
  const wasDone = B.game.st.done; B.game.st.done = true;   /* outside a round: orange and purple hold the butterflies */
  Object.assign(B, { nF: 2, fMu: 5, fSd: 1, tB: 0 }); B_syncHold();
  ev("pointerdown", f.cx[2], f.cBot - 3.5 * f.sh); ev("pointerup", f.cx[2], f.cBot - 3.5 * f.sh);
  const nGot = B.nF;
  ev("pointerdown", f.x(5), f.rows[2]); ev("pointermove", f.x(7.5), f.rows[2]); ev("pointerup", f.x(7.5), f.rows[2]);
  const muGot = B.fMu;
  ev("pointerdown", f.x(8.5), f.rows[2] + 9); ev("pointermove", f.x(9.75), f.rows[2] + 9); ev("pointerup", f.x(9.75), f.rows[2] + 9);
  const sdGot = B.fSd;
  ev("pointerdown", f.x(7.5 - 2.25), f.rows[2] + 9); ev("pointermove", f.x(7.5 - 0.1), f.rows[2] + 9); ev("pointerup", f.x(7.5 - 0.1), f.rows[2] + 9);
  const sdMin = B.fSd;
  B.game.st.done = wasDone; Object.assign(B, keep); B_syncHold(); B.run = null; B_paint();
  check("B the map sets counts, the butterflies' favorite and their spread where the pointer is", nGot === 4 && muGot === 7.5 && sdGot === 2.25 && sdMin === B_SDMIN,
        "fourth butterfly slot: " + nGot + " butterflies; favorite dragged from 5 to 7.5: " + muGot + "; spread handle dragged out to 9.75: spread " + sdGot +
        "; the other spread handle dragged onto the favorite: " + sdMin + " (the narrowest, " + B_SDMIN + ")");
}
{
  /* JM, 2026-09-30: no average under the card; in a round, the flower count the round needs */
  const keep = B.run, run = B_runAll(B_SOL.orange, mulberry32(15)), r = B_round();
  B.run = run; B.show = null; B_drawCard();
  const txt = document.getElementById("B_cardRead").textContent;
  const cnt = +(/(\\d+) flowers/.exec(txt) || [0, NaN])[1];
  B.run = keep; B_paint();
  check("B under the card: no average, and in a round the final meadow's count", !/average|[0-9]\\.[0-9]/.test(txt) && (r ? cnt === run.final.n : txt.trim() === ""),
        (r ? "round " + r.key + ": " : "free play: ") + "'" + txt.trim() + "'; counted " + run.final.n + " flowers");
}
/* ---- C: the diagram behind the two terms, one trait -------------------- */
/* the page's own set builder, so the checks run with the chance the page runs with */
const C_SET = (a, s, b, sh) => C_setOf(Object.assign({}, C_OPEN, { a, s, bb: b }), sh);
const C_endOf = (set, seed) => PD_mean(PD_run(set, C_START, mulberry32(seed)).z[PD_T][0]);
const C_rate = (r, st, reps, seed) => { let k = 0; const s = Object.assign({}, C_OPEN, st, r.hold);
  for (let q = 0; q < reps; q++) { const m = C_endOf(C_setOf(s, r.shift), seed + q * 7919); if (m >= r.lo && m <= r.hi) k++; } return k / reps; };
{
  const before = C.game.free() && C.game.current() == null, labFree = document.getElementById("C_run").textContent;
  document.getElementById("C_tnext").click();
  const r0 = C.game.current(), held = C.a === r0.hold.a && C.s === r0.hold.s && document.getElementById("C_a").value == r0.hold.a;
  check("C opens on free play; Start deals the first target and holds its arrows", before && labFree === "Practice run" && r0 === C_ROUNDS[0] && held && document.getElementById("C_run").textContent === "Go",
        "free at load: " + before + " (button '" + labFree + "'); after Start: round " + (r0 || {}).key + ", genes " + C.a + " and environment " + C.s + " held: " + held);
}
{
  /* the start has exactly the spreads the arrows say: genes and environment unrelated, each spread 1 */
  const g = C_START.gs[0], e = C_START.env[0];
  let c = 0; for (let i = 0; i < PD_N; i++) c += g[i] * e[i] / PD_N;
  const rows = [[1, 0.5], [0.5, 1], [1.5, 0], [0, 1.2]].map(([a, s]) => { const z = PD_traits(C_START, [{ g: [a], e: [s] }])[0]; return { a, s, m: PD_mean(z), sd: PD_sd(z), want: Math.sqrt(a * a + s * s) }; });
  check("C the start has the spread the arrows say, genes and environment unrelated", Math.abs(c) < 1e-12 && Math.abs(PD_mean(g)) < 1e-12 && Math.abs(PD_sd(g) - 1) < 1e-12 &&
        rows.every(q => Math.abs(q.m - 10) < 1e-12 && Math.abs(q.sd - q.want) < 1e-12),
        "genes–environment covariance " + c.toExponential(1) + "; " + rows.map(q => "genes " + q.a + ", env " + q.s + ": spread " + q.sd.toFixed(4) + " [√(a² + s²) " + q.want.toFixed(4) + "]").join("  "));
}
{
  /* Price by hand, every generation: w from the mothers and pollen parents,
     each term from its definition, and each split from the sources */
  let gap = 0, split = 0, gens = 0;
  const sets = [C_SET(1, 0.5, 4), C_SET(0.5, 1, -6), C_SET(0, 1, 8), C_SET(1.2, 0.6, 3, -1)];
  sets.forEach((set, si) => {
    const run = PD_run(set, C_START, mulberry32(40 + si));
    run.recs.forEach((r, t) => {
      const pop = run.pops[t], nx = run.pops[t + 1], z = run.z[t][0], zk = run.z[t + 1][0], w = new Float64Array(PD_N);
      for (let j = 0; j < PD_N; j++) { w[r.mom[j]]++; w[r.dad[j]]++; }
      const W = w.reduce((x, y) => x + y, 0), wb = W / PD_N, zb = mn(Array.from(z));
      let cov = 0, ewdz = 0; const kids = Array.from({ length: PD_N }, () => []);
      for (let j = 0; j < PD_N; j++) { kids[r.mom[j]].push(zk[j]); kids[r.dad[j]].push(zk[j]); }
      for (let i = 0; i < PD_N; i++) { cov += (w[i] - wb) * (z[i] - zb) / PD_N; if (w[i]) ewdz += w[i] * (mn(kids[i]) - z[i]) / PD_N; }
      const dz = mn(Array.from(zk)) - zb, T = r.terms[0];
      gap = Math.max(gap, Math.abs(cov / wb + ewdz / wb - dz), Math.abs(T.cov - cov / wb), Math.abs(T.E - ewdz / wb), Math.abs(T.dz - dz));
      const a = set.cf[0].g[0], s = set.cf[0].e[0], Ew = x => { let q = 0; for (let i = 0; i < PD_N; i++) q += w[i] * x[i]; return q / W; };
      const covG = a * (Ew(pop.gs[0]) - mn(Array.from(pop.gs[0]))), covE = s * (Ew(pop.env[0]) - mn(Array.from(pop.env[0])));
      const eOff = s * (mn(Array.from(nx.env[0])) - mn(Array.from(pop.env[0]))) + nx.sh[0] - pop.sh[0];
      split = Math.max(split, Math.abs(T.covG - covG), Math.abs(T.covE - covE), Math.abs(T.eEnv + covE), Math.abs(T.eOff - eOff), Math.abs(T.covG + T.covE - T.cov), Math.abs(T.eG + T.eEnv + T.eOff - T.E));
      gens++;
    });
  });
  check("C cov(w, z) + E(wΔz) is the change in the average, every generation, and each splits by the diagram's inputs", gap < 1e-9 && split < 1e-9,
        gens + " generations, 4 settings (one with a drought), counted seedling by seedling: identity and page vs hand " + gap.toExponential(1) + "; splits (genes, environment, not passed on, seedlings' environment) " + split.toExponential(1));
}
{
  /* what the diagram passes down: the slope of seedlings on the average of their two parents is the genes' share */
  const slope = (a, s) => { let sxy = 0, sxx = 0;
    for (let q = 0; q < 5; q++) { const run = PD_run(C_SET(a, s, 0), C_START, mulberry32(70 + q)), r = run.recs[0], z = run.z[0][0], zk = run.z[1][0];
      const mp = Array.from({ length: PD_N }, (_, j) => (z[r.mom[j]] + z[r.dad[j]]) / 2), mm = mn(mp), mk = mn(Array.from(zk));
      for (let j = 0; j < PD_N; j++) { sxy += (mp[j] - mm) * (zk[j] - mk); sxx += (mp[j] - mm) ** 2; } }
    return sxy / sxx; };
  const rows = [[1, 0.5], [0.5, 1], [1, 1], [0, 1]].map(([a, s]) => ({ a, s, got: slope(a, s), want: a * a / (a * a + s * s) }));
  check("C the slope of seedlings on their parents' average is the genes' share of the spread", rows.every(q => Math.abs(q.got - q.want) < 0.1),
        rows.map(q => "genes " + q.a + ", env " + q.s + ": " + q.got.toFixed(2) + " [a² ÷ (a² + s²) " + q.want.toFixed(2) + "]").join("  ") + "  (no selection, 5 × 400 seedlings each)");
}
{
  /* the expected terms are the arrows' arithmetic: a generation's cov(w, z) is b a² / W0 from the genes and b s² / W0 from the environment */
  let worst = 0; const rows = [];
  /* settings where no plant is pushed to zero seeds: there the floor bends the arithmetic (0.2997 for 0.3 at genes 0.5, env 1, seeds 6) */
  for (const [a, s, b] of [[1, 0.5, 4], [0.5, 1, 4], [1.2, 0.3, -3], [0.8, 0.6, 2]]) {
    const ex = PD_expect(C_START, C_SET(a, s, b))[0];
    worst = Math.max(worst, Math.abs(ex.per.covG - b * a * a / PD_W0), Math.abs(ex.per.covE - b * s * s / PD_W0), Math.abs(ex.eEnv + PD_T * ex.per.covE), Math.abs(ex.dz - PD_T * ex.per.covG));
    rows.push("a " + a + " s " + s + " b " + b + ": genes " + ex.per.covG.toFixed(4) + " [" + (b * a * a / PD_W0).toFixed(4) + "], environment " + ex.per.covE.toFixed(4) + " [" + (b * s * s / PD_W0).toFixed(4) + "]");
  }
  check("C the expected terms are the arrows' arithmetic", worst < 1e-9, rows.join("  "));
  /* and a run lands near them: the genes' part runs a little under, as their spread is spent */
  /* pooled over three settings and 8 runs each, so a run's drift (0.1-0.2) does not decide it. By
     chance the start's 50 genes are a little tied together across its 400 plants; free recombination
     undoes that in the first generation, so the genes' spread moves a few percent from the start's.
     Measured 2026-09-29, 12 starts x 8 runs at genes 1, env 0.5, seeds 4: 0.89 to 1.05, mean 0.95. */
  let got = 0, want = 0; const each = [];
  for (const [a, s, b] of [[1, 0.5, 4], [0.5, 1, 7], [0.8, 0.6, -3]]) { const w = PD_expect(C_START, C_SET(a, s, b))[0].dz; let g = 0;
    for (let q = 0; q < 8; q++) g += (C_endOf(C_SET(a, s, b), 90 + q) - 10) / 8; each.push(g / w); got += Math.abs(g); want += Math.abs(w); }
  check("C a run's change is close to the expected", got / want > 0.85 && got / want < 1.1,
        "realized ÷ expected over " + PD_T + " generations, pooled: " + (got / want).toFixed(3) + " (each: " + each.map(v => v.toFixed(3)).join(", ") + "; 8 runs each)");
}
{
  /* the environment arrow grows cov(w, z), E(wΔz) takes the growth back, the end stays;
     with nothing in the genes nothing moves; a drought moves the average once */
  const tot = (set, seeds) => { const t = { cov: 0, E: 0, dz: 0 }; seeds.forEach(sd => { const s = PD_sums(PD_run(set, C_START, mulberry32(sd)), PD_T)[0]; for (const k in t) t[k] += s[k] / seeds.length; }); return t; };
  const seeds = [110, 111, 112, 113, 114, 115];
  const lo = tot(C_SET(1, 0, 4), seeds), hi = tot(C_SET(1, 1.5, 4), seeds), none = tot(C_SET(0, 1, 8), seeds);
  check("C the environment arrow grows cov(w, z), E(wΔz) takes it back, and the end stays", hi.cov - lo.cov > 3 && Math.abs((hi.cov - lo.cov) + (hi.E - lo.E)) < 0.35 && Math.abs(hi.dz - lo.dz) < 0.35,
        "genes 1, seeds 4, environment 0 → 1.5: cov(w, z) " + lo.cov.toFixed(2) + " → " + hi.cov.toFixed(2) + ", E(wΔz) " + lo.E.toFixed(2) + " → " + hi.E.toFixed(2) + ", Δz " + lo.dz.toFixed(2) + " → " + hi.dz.toFixed(2) + "  (6 runs each)");
  check("C nothing in the genes: cov(w, z) is large and nothing moves", none.cov > 3 && Math.abs(none.dz) < 0.12,
        "genes 0, environment 1, seeds 8: cov(w, z) " + none.cov.toFixed(2) + " + E(wΔz) " + none.E.toFixed(2) + " = Δz " + none.dz.toFixed(2));
  /* 10 runs: a run's nine later generations wobble about 0.25 added up, its end about 0.2 */
  const dr = []; for (let q = 0; q < 10; q++) { const run = PD_run(C_SET(1, 0.6, 0, -1), C_START, mulberry32(130 + q)); dr.push({ first: run.recs[0].terms[0].E, later: run.recs.slice(1).reduce((x, r) => x + r.terms[0].E, 0), end: PD_mean(run.z[PD_T][0]) }); }
  check("C a drought moves the average once: E(wΔz) in the first generation, nothing after", Math.abs(mn(dr.map(q => q.first)) + 1) < 0.06 && Math.abs(mn(dr.map(q => q.later))) < 0.25 && Math.abs(mn(dr.map(q => q.end)) - 9) < 0.25,
        "drought −1, no selection: E(wΔz) in generation 1 " + mn(dr.map(q => q.first)).toFixed(2) + ", generations 2-" + PD_T + " added up " + mn(dr.map(q => q.later)).toFixed(2) + ", end " + mn(dr.map(q => q.end)).toFixed(2) + "  (10 runs)");
}
{
  /* seeds set are births less deaths: a birth arrow of +6 with a death arrow of +2 is a push of +4 */
  const both = C_setOf(Object.assign({}, C_OPEN, { bb: 6, bd: 2 }), 0), one = C_setOf(Object.assign({}, C_OPEN, { bb: 4, bd: 0 }), 0);
  const e1 = PD_expect(C_START, both)[0].per, e2 = PD_expect(C_START, one)[0].per;
  let m1 = 0, m2 = 0; for (let q = 0; q < 8; q++) { m1 += C_endOf(both, 140 + q) / 8; m2 += C_endOf(one, 140 + q) / 8; }
  check("C seeds set are births less deaths: births +6 with deaths +2 is a push of +4", Math.abs(e1.cov - e2.cov) < 1e-12 && Math.abs(m1 - m2) < 0.15,
        "a generation's cov(w, z): " + e1.cov.toFixed(4) + " and " + e2.cov.toFixed(4) + "; average after " + PD_T + " generations " + m1.toFixed(2) + " and " + m2.toFixed(2) + " (8 runs each)");
  /* chance on the rates is drift in Price's terms: with no selection, the genes' part of cov(w, z)
     averages 0 and wobbles more from generation to generation. Measured 2026-09-29: the rates' chance
     adds only about a quarter to that wobble (sd ratio ~1.25 at 8 on each), because most of it comes
     from which seeds become the 400 seedlings; the end of a single run barely shows it (0.19 against
     0.20 over 16 runs). Over 64 runs x 10 generations: 0.040 and 0.046, ratio 1.15 (from the start
     alone, 300 first generations: 1.33; the arithmetic sqrt((1/800 + 147/160000) / (1/800 + 20/160000))
     = 1.26). 160 generations gave 1.06 once: too few. */
  const quiet = C_setOf(Object.assign({}, C_OPEN, { bb: 0, lb: 0, ld: 0 }), 0), loud = C_setOf(Object.assign({}, C_OPEN, { bb: 0, lb: 8, ld: 8 }), 0);
  const parts = set => { const g = []; for (let q = 0; q < 64; q++) PD_run(set, C_START, mulberry32(160 + q)).recs.forEach(r => g.push(r.terms[0].covG)); return g; };
  const gq = parts(quiet), gl = parts(loud);
  check("C chance on the birth and death rates is drift: the genes' part of cov(w, z) averages 0 and wobbles more", Math.abs(mn(gq)) < 0.01 && Math.abs(mn(gl)) < 0.012 && PD_sd(gl) > 1.05 * PD_sd(gq),
        "no selection, 640 generations each: chance 0 on each rate " + mn(gq).toFixed(3) + " ± " + PD_sd(gq).toFixed(3) + ", chance 8 " + mn(gl).toFixed(3) + " ± " + PD_sd(gl).toFixed(3) + " (ratio " + (PD_sd(gl) / PD_sd(gq)).toFixed(2) + ")");
}
const C_SOL = { tall: { bb: 3.5 }, weather: { bb: 7 }, genes: { a: 0.7 }, wet: { bb: -2 }, shorter: { a: 1, bb: -3 } };
{
  const own = C_ROUNDS.map((r, i) => ({ k: r.key, v: C_rate(r, C_SOL[r.key], 20, 15000 + i * 97) }));
  check("C every round is hit at its setting", own.every(q => q.v >= 0.8), own.map(q => q.k + " " + Math.round(100 * q.v) + "% at " + JSON.stringify(C_SOL[q.k])).join("  ") + "  (20 runs each)");
  const open = C_ROUNDS.map((r, i) => C_rate(r, {}, 10, 15500 + i * 97));
  check("C the opening hits none", open.every(v => v === 0), open.map(v => Math.round(100 * v) + "%").join(" / ") + "  (10 runs each)");
  /* the cheap routes: selection read as if every seedling copied its parent
     (weather at tall's arrow); the wet year left alone; the genes arrow left
     where it opened */
  const by = k => C_ROUNDS.find(r => r.key === k);
  const copy = C_rate(by("weather"), { bb: 3.5 }, 10, 15700), still = C_rate(by("wet"), { bb: 0 }, 10, 15800), gOpen = C_rate(by("genes"), { a: 1 }, 10, 15900);
  /* 2026-09-29: this route once hit 1 in 10 on a check page and never in 1500 runs over 150 starts since; the lowest end is printed to catch it */
  let wetLow = 99; for (let q = 0; q < 10; q++) wetLow = Math.min(wetLow, C_endOf(C_SET(1, 0.6, 0, 1), 15800 + q * 7919));
  check("C the cheap routes miss", copy <= 0.2 && still === 0 && gOpen <= 0.1,
        "weather at tall's seeds arrow (3.5): " + Math.round(100 * copy) + "%; the wet year with no selection: " + Math.round(100 * still) + "% (lowest end " + wetLow.toFixed(2) + ", window from " + by("wet").lo + "); genes left at 1.0 in 'genes': " + Math.round(100 * gOpen) + "%");
  const rng = mulberry32(4242), pick = a => a[Math.floor(rng() * a.length)], hist = [0, 0, 0, 0, 0, 0];
  const sets = Object.values(C_SOL).map(s => Object.assign({}, C_OPEN, s));
  for (let q = 0; q < 100; q++) sets.push(Object.assign({}, C_OPEN, { a: pick([0, 0.3, 0.5, 0.6, 0.7, 0.8, 1, 1.2, 1.5]), s: pick([0, 0.5, 1, 1.5]), bb: pick([-8, -5, -3, -2, -1, 0, 1, 1.5, 2, 2.5, 3, 4, 4.5, 5, 6, 7, 8]) }));
  let most = 0; sets.forEach((s, q) => { const c = C_ROUNDS.filter((r, i) => C_rate(r, s, 2, 16000 + q * 13 + i) === 1).length; hist[c]++; most = Math.max(most, c); });
  check("C no one setting clears three rounds", most <= 2, sets.length + " settings (the five answers and 100 at random), 2 runs a round, cleared when both hit: " + hist.map((v, k) => k + ":" + v).filter((_, k) => k <= 3).join(" ") + "; the greediest clears " + most);
}
{
  /* JM, 2026-09-29: the terms are not kept secret, and the diagram carries them ("Let the DAG carry
     them to keep the plot layout tight"). In a scored round, practice off, the stem boxes read a
     generation's cov(w, z) and E(wΔz) as the page computes them, and they move with the arrows;
     the card prints no numbers, and no expected end anywhere */
  const keep = { a: C.a, s: C.s, bb: C.bb }, r = C_round(), dag = () => document.getElementById("pathsC").textContent.replace(/−/g, "-");
  const num = (txt, re) => { const m = re.exec(txt); return m ? +m[1] : NaN; };
  const setB = v => { document.getElementById("C_bb").value = v; document.getElementById("C_bb").dispatchEvent(new Event("input")); };
  C.run = null; setB(0); const flat = dag();
  setB(3); const txt = dag(), card = document.getElementById("C_cardRead").textContent, ex = PD_expect(C_START, C_setNow())[0].per;
  const got = [num(txt, /cov\\(w, z\\) ([-+][0-9.]+)/), num(txt, /E\\(wΔz\\) ([-+][0-9.]+)/)], want = [ex.cov, ex.E].map(v => +v.toFixed(2));
  /* the arrow redraws as it is set: its stroke thickens (numbers show only on a selected arrow) */
  const visible = id => { const h = document.querySelector('#pathsC .paths-hit[data-arrow="' + id + '"]'); return h ? h.nextElementSibling : null; };
  const arrowOn = +((visible("bb") || { getAttribute: () => 0 }).getAttribute("stroke-width")) > 4;
  Object.assign(C, keep); C_syncHold(); C_syncGo(); C_paint();
  check("C in a round the diagram carries a generation's terms as the arrows set them; the card prints none, and no expected end", !!r && got.every((v, i) => v === want[i]) && num(flat, /cov\\(w, z\\) ([-+][0-9.]+)/) === 0 && arrowOn && !/[0-9]/.test(card) && !/(?<!w)Δz [-+−]/.test(txt),
        "round " + (r || {}).key + ", practice off, birth arrow dragged 0 → 3: the boxes read cov(w, z) " + got[0] + ", E(wΔz) " + got[1] + "; computed " + want.join(", ") + "; at 0, cov(w, z) " + num(flat, /cov\\(w, z\\) ([-+][0-9.]+)/) +
        "; the arrow redrawn thicker at +3: " + arrowOn + "; numbers under the card: " + (/[0-9]/.test(card) ? "'" + card.slice(0, 40) + "'" : "none"));
  /* JM, 2026-09-30: numbers on the diagram only while an arrow is being adjusted; blue up, red down,
     pale = held this round, grey = fixed. Read in a round (tall holds genes and environment). */
  {
    const root = document.getElementById("pathsC"), vals = () => [...root.querySelectorAll(".paths-arrow-value")].map(t => t.textContent.trim()).filter(Boolean);
    /* read an arrow's class off the drawn curve: held and fixed arrows have no hit target (JM: no
       pop-ups on arrows that cannot be set), so find the curve by the arrow's slider */
    const cls = id => { const k = root.querySelector('.paths-arrow[data-of="' + id + '"]'); return k ? k.getAttribute("class") : ""; };
    /* the round's free arrow is stem height -> birth rate; set it negative (red) and click it */
    C.bb = -2; document.getElementById("C_bb").value = -2; C_syncDag(); C.paths.sync();
    const idle = vals();
    const hit = root.querySelector('.paths-hit[data-arrow="bb"]'); hit.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true })); window.dispatchEvent(new PointerEvent("pointerup"));
    const picked = vals(), noteEl = root.querySelector(".paths-note"), note = noteEl ? noteEl.textContent : "", noteHidden = !noteEl || getComputedStyle(noteEl).display === "none";
    /* JM, 2026-09-30: no pop-up on an arrow that cannot be set -- a held or fixed arrow has no hit target */
    const noHit = ["a", "s", "bd", "t", "gc"].every(id => !root.querySelector('.paths-hit[data-arrow="' + id + '"]'));
    const keepsColour = /down/.test(cls("bb")) && /selected/.test(cls("bb"));
    const held = C_round() && "a" in C_round().hold && /locked/.test(cls("a")) && /locked/.test(cls("s")) && /locked/.test(cls("bd")), neg = /down/.test(cls("bb"));
    const grey = [...root.querySelectorAll(".paths-arrow.dark")].length >= 5;
    C.bb = 0; document.getElementById("C_bb").value = 0; C_syncHold(); C_paint();
    check("C the diagram shows numbers only on the arrow being set; held arrows pale, fixed ones grey, neither clickable", idle.join(" ") === "+ −" && picked.some(v => v.replace("−", "-") === "-2.0") && noteHidden && held && neg && keepsColour && grey && noHit,
          "numbers on show with nothing selected: [" + idle.join(", ") + "]; after clicking stem height → birth rate at −2: [" + picked.join(", ") + "], note " + (noteHidden ? "hidden" : "SHOWN '" + note.slice(0, 40) + "'") + "; red, and still red selected: " + neg + ", " + keepsColour +
          "; held arrows marked locked: " + held + "; fixed (grey) arrows: " + [...root.querySelectorAll(".paths-arrow.dark")].length + "; held and fixed arrows without a click target: " + noHit);
  }
  /* the bells are trial generations at the arrows: their averages sit on the arrows' arithmetic */
  const set = C_SET(1, 0.8, 5, 0.6), tr = PD_trials(C_START, set, 999)[0], e2 = PD_expect(C_START, set)[0].per;
  const se = a => PD_sd(a) / Math.sqrt(a.length), zc = Math.abs(mn(tr.cov) - e2.cov) / se(tr.cov), ze = Math.abs(mn(tr.E) - e2.E) / se(tr.E), z1 = Math.abs(mn(tr.E1) - e2.E - 0.6) / se(tr.E1);
  check("C the card's bells are trial generations, centred on the arrows' arithmetic", zc < 3.5 && ze < 3.5 && z1 < 3.5,
        PD_TRIALS + " trial generations at genes 1, env 0.8, seeds 5, a +0.6 year: cov(w, z) " + mn(tr.cov).toFixed(3) + " ± " + PD_sd(tr.cov).toFixed(3) + " [" + e2.cov.toFixed(3) + "], E(wΔz) " + mn(tr.E).toFixed(3) + " [" + e2.E.toFixed(3) + "], first generation " + mn(tr.E1).toFixed(3) + " [" + (e2.E + 0.6).toFixed(3) + "]; " + [zc, ze, z1].map(v => v.toFixed(1)).join(", ") + " standard errors off");
}
/* ---- D: a second trait on the same diagram ------------------------------ */
const D_SET = s => D_setOf(Object.assign({}, D_OPEN, s));
const D_ends = (s, seed) => PD_run(D_SET(s), D_START, mulberry32(seed)).z[PD_T].map(z => PD_mean(z));
const D_rate = (r, st, reps, seed) => { let k = 0; const s = Object.assign({}, D_OPEN, st, r.hold);
  for (let q = 0; q < reps; q++) { const e = D_ends(s, seed + q * 7919); if (r.win.every((w, t) => !w || (e[t] >= w[0] && e[t] <= w[1]))) k++; } return k / reps; };
{
  const before = D.game.free() && D.game.current() == null;
  document.getElementById("D_tnext").click();
  const r0 = D.game.current(), held = Object.keys(r0.hold).every(k => D[k] === r0.hold[k]);
  check("D opens on free play; Start deals the first target and holds its arrows", before && r0 === D_ROUNDS[0] && held && document.getElementById("D_run").textContent === "Go",
        "free at load: " + before + "; after Start: round " + (r0 || {}).key + ", " + Object.keys(r0.hold).length + " arrows held: " + held);
}
{
  /* no arrow between the traits: their tie at the start is the boxes they share, exactly */
  const corr = (x, y) => { const mx = PD_mean(x), my = PD_mean(y); let c = 0, vx = 0, vy = 0; for (let i = 0; i < x.length; i++) { c += (x[i] - mx) * (y[i] - my); vx += (x[i] - mx) ** 2; vy += (y[i] - my) ** 2; } return c / Math.sqrt(vx * vy); };
  let worst = 0; const rows = [];
  for (const s of [{ gs: 1, gf: 0, es: 0.5, ef: 1 }, { gs: 0.8, gf: 1, es: 0.6, ef: 0.6 }, { gs: 0, gf: 1, es: 1, ef: 0.8 }, { gs: -0.8, gf: 1, es: 0.5, ef: 0.5 }]) {
    const z = PD_traits(D_START, D_SET(s).cf), got = corr(z[0], z[1]);
    const want = (s.gs * s.gf + s.es * s.ef) / Math.sqrt((s.gs ** 2 + s.es ** 2) * (s.gf ** 2 + s.ef ** 2));
    worst = Math.max(worst, Math.abs(got - want)); rows.push(got.toFixed(3) + " [" + want.toFixed(3) + "]"); }
  check("D the two traits are tied only through the genes and environment they share", worst < 1e-9,
        "correlation at the start, four diagrams: " + rows.join(", ") + " [(genes × genes + environment × environment) ÷ both spreads]");
}
{
  /* Price exact for each trait; the two responses keep the ratio of the genes arrows whichever trait is selected */
  let gap = 0; const run = PD_run(D_SET({ gs: 0.8, gf: 1, es: 0.6, ef: 0.6, sb: 3, fb: -2 }), D_START, mulberry32(210));
  for (const r of run.recs) for (const T of r.terms) gap = Math.max(gap, Math.abs(T.cov + T.E - T.dz), Math.abs(T.covG + T.covE - T.cov), Math.abs(T.eG + T.eEnv + T.eOff - T.E));
  const ratio = st => { let ds = 0, df = 0; for (let q = 0; q < 6; q++) { const e = D_ends(Object.assign({ gs: 0.8, gf: 1, es: 0.6, ef: 0.6 }, st), 220 + q); ds += e[0] - 10; df += e[1] - 10; } return ds / df; };
  const byStem = ratio({ sb: 5, fb: 0 }), byFlower = ratio({ sb: 0, fb: 4 });
  check("D both traits' terms add up every generation, and the responses keep the genes arrows' ratio whichever trait is selected",
        gap < 1e-9 && Math.abs(byStem - 0.8) < 0.1 && Math.abs(byFlower - 0.8) < 0.1,
        "identity and splits, 10 generations × 2 traits: " + gap.toExponential(1) + "; stem ÷ flower change, genes arrows 0.8 and 1.0: selecting stem " + byStem.toFixed(2) + ", selecting flower " + byFlower.toFixed(2) + "  (6 runs each)");
}
{
  /* a shared environment ties the traits, gives stem a cov(w, z) when flower is selected, and E(wΔz) takes it back */
  const t = { cov: 0, E: 0, dz: 0 };
  for (let q = 0; q < 6; q++) { const s = PD_sums(PD_run(D_SET({ gs: 0, gf: 1, es: 1, ef: 0.8, sb: 0, fb: 5 }), D_START, mulberry32(240 + q)), PD_T)[0]; for (const k in t) t[k] += s[k] / 6; }
  check("D a shared environment gives stem height a cov(w, z) that E(wΔz) takes back", t.cov > 1 && Math.abs(t.dz) < 0.12,
        "stem with no genes, environment shared with flower, flower selected (5): stem's cov(w, z) " + t.cov.toFixed(2) + " + E(wΔz) " + t.E.toFixed(2) + " = Δz " + t.dz.toFixed(2) + "  (6 runs)");
}
const D_SOL = { along: { fb: 4.5 }, eaten: { fd: 6 }, patch: { fb: -6.5 }, follow: { sb: -4 }, trade: { fb: -2.5 }, topple: { sd: 3.5 },
                shared: { gs: 0.4 }, shared2: { gf: 0.4 }, build: { gs: -1, gf: 0.7 }, build2: { gs: 0.8, gf: -0.6 } };
{
  const own = D_ROUNDS.map((r, i) => ({ k: r.key, v: D_rate(r, D_SOL[r.key], 20, 17000 + i * 97) }));
  check("D every round is hit at its setting", own.every(q => q.v >= 0.8), own.map(q => q.k + " " + Math.round(100 * q.v) + "% at " + JSON.stringify(D_SOL[q.k])).join("  ") + "  (20 runs each)");
  const open = D_ROUNDS.map((r, i) => D_rate(r, {}, 10, 17500 + i * 97));
  check("D the opening hits none", open.every(v => v === 0), open.map(v => Math.round(100 * v) + "%").join(" / ") + "  (10 runs each)");
  /* the cheap routes: stem left alone because nothing selects it; one round's
     push carried into the next (patch and trade at along's answer); the
     shared genes left where they opened; build at trade's answer */
  const by = k => D_ROUNDS.find(r => r.key === k);
  const alone = D_rate(by("along"), { fb: 0 }, 10, 17700), carried = D_rate(by("patch"), { fb: 4.5 }, 10, 17800), tradeAt = D_rate(by("trade"), { fb: 4.5 }, 10, 17850),
        gOpen = D_rate(by("shared"), { gs: 1 }, 10, 17900), buildAt = D_rate(by("build"), { gs: -0.8, gf: 1 }, 10, 17950);
  const noCost = D_rate(by("eaten"), { fd: 0 }, 10, 17960), noStem = D_rate(by("follow"), { sb: 0 }, 10, 17970), build2At = D_rate(by("build2"), { gs: -1, gf: 0.7 }, 10, 17980);
  check("D the cheap routes miss", alone === 0 && carried <= 0.2 && tradeAt <= 0.2 && gOpen === 0 && buildAt <= 0.2 && noCost === 0 && noStem === 0 && build2At <= 0.2,
        "along with flower's birth arrow at 0: " + Math.round(100 * alone) + "%; patch and trade at along's answer (4.5): " + Math.round(100 * carried) + "%, " + Math.round(100 * tradeAt) +
        "%; shared with genes → stem left at 1.0: " + Math.round(100 * gOpen) + "%; build at trade's answer: " + Math.round(100 * buildAt) + "%; eaten with no cost in deaths: " + Math.round(100 * noCost) + "%; follow with stem's births at 0: " + Math.round(100 * noStem) + "%; build2 at build's answer: " + Math.round(100 * build2At) + "%");
  /* the lazy route with the reset: put whatever seeds arrow a round frees at one value, every round */
  const single = D_ROUNDS.filter(r => { const f = D_KEYS.filter(k => !(k in r.hold)); return f.length === 1 && /^[sf][bd]$/.test(f[0]); });
  let lazy = 0, lazyAt = 0, lazyWhich = "";
  for (const x of [-7, -6.5, -6, -5, -4.5, -4, -3.5, -3, -2.5, -2, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6, 6.5, 7]) {
    const hit = single.filter((r, i) => { const k = D_KEYS.find(q => !(q in r.hold)); return D_rate(r, { [k]: x }, 4, 19000 + i * 17 + Math.round(x * 10)) >= 0.5; });
    if (hit.length > lazy) { lazy = hit.length; lazyAt = x; lazyWhich = hit.map(r => r.key).join(", "); } }
  check("D one value on whatever seeds arrow is free clears at most two rounds", lazy <= 2,
        single.length + " rounds free a single seeds arrow (" + single.map(r => r.key).join(", ") + "); the best single value (" + lazyAt + ") hits half the time or more in " + lazy + " (" + lazyWhich + ")");
  const rng = mulberry32(5151), pick = a => a[Math.floor(rng() * a.length)], hist = [0, 0, 0, 0, 0, 0];
  const sets = Object.values(D_SOL).map(s => Object.assign({}, D_OPEN, s)), gv = [-1, -0.7, -0.4, 0, 0.3, 0.4, 0.6, 1, 1.5], bv = [-6, -3, -1, 0, 1.5, 2.5, 3, 4, 5, 8];
  for (let q = 0; q < 80; q++) sets.push(Object.assign({}, D_OPEN, { gs: pick(gv), gf: pick(gv), es: pick([0, 0.5, 1]), ef: pick([0, 0.5, 1]), sb: pick(bv), sd: pick(bv), fb: pick(bv), fd: pick(bv) }));
  let most = 0, at = ""; sets.forEach((s, q) => { const hit = D_ROUNDS.filter((r, i) => D_rate(r, s, 2, 18000 + q * 13 + i) === 1); hist[hit.length]++;
    if (hit.length > most) { most = hit.length; at = JSON.stringify(s) + " clears " + hit.map(r => r.key).join(", "); } });
  check("D no one setting clears more than four of the ten rounds", most <= 4, sets.length + " settings (the ten answers and 80 at random), 2 runs a round, cleared when both hit: " + hist.map((v, k) => k + ":" + v).filter((_, k) => k <= 3).join(" ") + "; the greediest " + at);
}
/* ---- every plot inside its panel --------------------------------------- */
{
  for (const S of ["C", "D"]) document.getElementById("stage" + S).classList.remove("stage-locked");
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
  const out = [], stages = { A, B, C, D }, bitsSeen = [];
  const read = id => document.getElementById(id).textContent;
  let aBefore = null, aAfter = null, cBefore = "", cAfter = "", dBefore = "", dAfter = "";
  try {
    for (const [S, go] of [["A", "A_run"], ["B", "B_run"], ["C", "C_run"], ["D", "D_run"]]) {
      document.getElementById("stage" + S).classList.remove("stage-locked");
      const g = stages[S].game, box = document.getElementById(S + "_practice"), btn = document.getElementById(go);
      const tick = on => { box.checked = on; box.dispatchEvent(new Event("change")); };
      const n0 = g.st.hits.length;
      if (S === "A") { tick(false); aBefore = A_cardShows(); }
      if (S === "C") { tick(false); cBefore = read("pathsC") + " | " + read("C_cardRead"); }
      if (S === "D") { tick(false); dBefore = read("pathsD") + " | " + read("D_cardRead"); }
      tick(true); btn.click();
      const pracOk = g.st.hits.length === n0 && g.st.last != null && /practice/.test(read(S + "_tflip"));
      tick(false); btn.click();
      if (S === "A") aAfter = A_cardShows();
      if (S === "C") cAfter = read("pathsC") + " | " + read("C_cardRead");
      if (S === "D") dAfter = read("pathsD") + " | " + read("D_cardRead");
      const scored = g.st.hits.length === n0 + 1 && g.waiting(), blocked = btn.disabled;
      /* the scored attempt wrote its own bit, and wrote what the page judged */
      bitsSeen.push(S + (n0 + 1) + " " + (Score.getBit("scaffold", BIT[S + (n0 + 1)]) === (g.st.hits[n0] ? 1 : 0) ? "ok" : "WRONG"));
      tick(true); btn.click();
      const stillPrac = !btn.disabled && g.st.hits.length === n0 + 1 && g.waiting();
      tick(false);
      out.push({ ok: pracOk && scored && blocked && stillPrac,
                 t: S + ": practice " + (pracOk ? "unscored" : "SCORED") + ", ticked off " + (scored ? "scored" : "NOT scored") +
                    ", waiting " + (blocked ? "Go off" : "GO ON") + (stillPrac ? " but practice runs" : ", practice BLOCKED") });
    }
  } finally { window.setInterval = realSI; window.clearInterval = realCI; }
  check("every stage has a practice switch that does not score", out.length === 4 && out.every(q => q.ok), out.map(q => q.t).join("  |  "));
  check("each scored attempt records its own bit, as the page judged it", bitsSeen.length === 4 && bitsSeen.every(t => / ok$/.test(t)), bitsSeen.join(", "));
  /* a new target resets the arrows it frees: move every arrow off its opening, deal D's next round, read them back */
  for (const k of D_KEYS) D[k] = D_OPEN[k] + 1;
  document.getElementById("D_tnext").click();
  const r2 = D.game.current(), free = D_KEYS.filter(k => !(k in r2.hold)), reset = free.every(k => D[k] === D_OPEN[k]), held = Object.keys(r2.hold).every(k => D[k] === r2.hold[k]);
  check("a new target starts its free arrows where they opened", !!r2 && r2 !== D_ROUNDS[0] && free.length > 0 && reset && held,
        "every arrow moved, Next target: D round " + (r2 || {}).key + ", free " + free.map(k => k + " " + D[k] + " [opening " + D_OPEN[k] + "]").join(", ") + "; held arrows at the round's values: " + held);
  check("A the card's arrows wait for Go in a round, and show after it", aBefore === false && aAfter === true,
        "before the scored run: " + aBefore + "; after it: " + aAfter);
  /* the diagram's boxes carry the terms before Go and after; the card, no numbers either way */
  const onDag = (t, n) => (t.match(/cov\\(w, z\\) [-+−][0-9]/g) || []).length === n && (t.match(/E\\(wΔz\\) [-+−][0-9]/g) || []).length === n;
  const cardBare = t => !/[0-9]/.test(t.split(" | ")[1] || "");
  check("C the diagram carries the terms before Go and after; the card prints no numbers", onDag(cBefore, 1) && onDag(cAfter, 1) && cardBare(cBefore) && cardBare(cAfter),
        "stem boxes before the scored run: '" + (/cov\\(w, z\\)[^]{0,40}/.exec(cBefore) || [""])[0] + "'; card text before / after: '" + (cBefore.split(" | ")[1] || "") + "' / '" + (cAfter.split(" | ")[1] || "") + "'");
  check("D the diagram carries both traits' terms before Go and after; the card prints no numbers", onDag(dBefore, 2) && onDag(dAfter, 2) && cardBare(dBefore) && cardBare(dAfter),
        "trait boxes carry " + (dBefore.match(/cov\\(w, z\\) [-+−][0-9.]+/g) || []).join(", ") + "; card text before / after: '" + (dBefore.split(" | ")[1] || "") + "' / '" + (dAfter.split(" | ")[1] || "") + "'");
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
