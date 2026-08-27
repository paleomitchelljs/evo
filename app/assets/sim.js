/* sim.js — canonical simulation and plotting helpers for BIO 202.
 *
 * WHY THIS EXISTS. Every lesson used to carry its own private copy of these
 * functions: 22 copies of mulberry32, 20 of makeFrame and drawAxes, ~45 KB of
 * duplicated code. When an edit dropped a copy the page threw at load and the
 * lesson silently emitted no submission code at all -- that is what took out
 * lesson12 and lesson18 earlier in the project.
 *
 * HOW IT WORKS. This file loads BEFORE each lesson's inline <script>, so a
 * lesson that still defines its own copy shadows the one here and behaves
 * exactly as it did. A lesson that does not define one falls through to these.
 * The crash class is therefore closed without changing any current behaviour.
 *
 * Each body below is the majority variant already running in the lessons, copied
 * verbatim rather than retyped, so adopting it cannot change a rendered result.
 * Where variants disagree the count is noted; reconciling those is a later job
 * and must be done one lesson at a time with the picture checked.
 *
 * scripts/check_lessons.py fails any lesson that calls a helper nothing defines.
 */

/* mulberry32: 11/22 copies agreed; 2 variants in the wild, majority taken */
function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a = (a + 0x6D2B79F5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* gauss: 3/6 copies agreed; 3 variants in the wild, majority taken */
function gauss(rng){let u=0,v=0;while(u===0)u=rng();while(v===0)v=rng();return Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*v);}

/* makeNormal: 9/9 copies agreed */
function makeNormal(rng) {
  let spare = null;
  return function () {
    if (spare !== null) { const s = spare; spare = null; return s; }
    let u = 0, v = 0, s = 0;
    do {
      u = rng() * 2 - 1; v = rng() * 2 - 1; s = u*u + v*v;
    } while (s >= 1 || s === 0);
    const m = Math.sqrt(-2 * Math.log(s) / s);
    spare = v * m;
    return u * m;
  };
}

/* setupCanvas: 19/22 copies agreed; 2 variants in the wild, majority taken */
function setupCanvas(canvas) {
  // Cache the original CSS size on first call so repeated redraws on retina
  // displays do not compound the dpr scaling and inflate the backing store.
  const dpr = window.devicePixelRatio || 1;
  if (!canvas.dataset.cssW) {
    canvas.dataset.cssW = String(canvas.width);
    canvas.dataset.cssH = String(canvas.height);
  }
  const cssW = +canvas.dataset.cssW, cssH = +canvas.dataset.cssH;
  canvas.width  = cssW * dpr;
  canvas.height = cssH * dpr;
  canvas.style.width  = cssW + "px";
  canvas.style.height = cssH + "px";
  const ctx = canvas.getContext("2d");
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return { ctx, W: cssW, H: cssH };
}

/* makeFrame: 13/20 copies agreed; 4 variants in the wild, majority taken */
function makeFrame(pad,W,H,xMin,xMax,yMin,yMax){const w=W-pad.l-pad.r,h=H-pad.t-pad.b; return {pad,W:w,H:h,xMin,xMax,yMin,yMax, x:v=>pad.l+(v-xMin)/(xMax-xMin)*w, y:v=>pad.t+h-(v-yMin)/(yMax-yMin)*h}; }

/* drawAxes: 8/20 copies agreed; 7 variants in the wild, majority taken */
function drawAxes(ctx,f,xLabel,yLabel,xTicks,yTicks,xFmt,yFmt){xFmt=xFmt||(v=>v.toString()); yFmt=yFmt||(v=>v.toString()); ctx.strokeStyle="#333"; ctx.lineWidth=1; ctx.beginPath(); ctx.moveTo(f.pad.l, f.pad.t); ctx.lineTo(f.pad.l, f.pad.t+f.H); ctx.lineTo(f.pad.l+f.W, f.pad.t+f.H); ctx.stroke(); ctx.fillStyle="#333"; ctx.font="10px ui-monospace"; ctx.textAlign="center"; ctx.textBaseline="top"; for(let i=0;i<=xTicks;i++){const v=f.xMin+(f.xMax-f.xMin)*i/xTicks, x=f.x(v); ctx.beginPath(); ctx.moveTo(x,f.pad.t+f.H); ctx.lineTo(x,f.pad.t+f.H+4); ctx.stroke(); ctx.fillText(xFmt(v),x,f.pad.t+f.H+5);} ctx.textAlign="right"; ctx.textBaseline="middle"; for(let i=0;i<=yTicks;i++){const v=f.yMin+(f.yMax-f.yMin)*i/yTicks, y=f.y(v); ctx.beginPath(); ctx.moveTo(f.pad.l-4,y); ctx.lineTo(f.pad.l,y); ctx.stroke(); ctx.fillText(yFmt(v),f.pad.l-6,y);} ctx.textAlign="center"; ctx.textBaseline="bottom"; ctx.font="11px -apple-system, sans-serif"; ctx.fillStyle="#555"; if(xLabel) ctx.fillText(xLabel, f.pad.l+f.W/2, f.pad.t+f.H+22); if(yLabel){ ctx.save(); ctx.translate(f.pad.l-32, f.pad.t+f.H/2); ctx.rotate(-Math.PI/2); ctx.fillText(yLabel,0,0); ctx.restore(); } }

/* quantile: 5/8 copies agreed; 3 variants in the wild, majority taken */
function quantile(arr, p) { const s=arr.slice().sort((a,b)=>a-b); const i=p*(s.length-1); const lo=Math.floor(i), hi=Math.ceil(i); return s[lo]+(s[hi]-s[lo])*(i-lo); }

/* rbinom: 5/8 copies agreed; 4 variants in the wild, majority taken */
function rbinom(rng,n,p){let k=0; for(let i=0;i<n;i++) if(rng()<p) k++; return k;}

/* olsSlope: 1/2 copies agreed; 2 variants in the wild, majority taken */
function olsSlope(xs, ys) {
  const mx = mean(xs), my = mean(ys);
  let sxy = 0, sxx = 0;
  for (let i=0;i<xs.length;i++) { sxy += (xs[i]-mx)*(ys[i]-my); sxx += (xs[i]-mx)*(xs[i]-mx); }
  return sxy/sxx;
}

/* chi2P: 1/2 copies agreed; 2 variants in the wild, majority taken */
function chi2P(x, k) { if (x <= 0) return 1; // upper tail
  // Use regularized incomplete gamma: P = 1 - gammaInc(k/2, x/2)
  function gammaIncLower(s, x) { let term = 1/s, sum = term; for (let n=1; n<200; n++) { term *= x/(s+n); sum += term; if (Math.abs(term) < 1e-12*Math.abs(sum)) break; } return sum * Math.exp(-x + s*Math.log(x) - lgamma(s)); }
  function lgamma(z) { const g=7; const c=[0.99999999999980993,676.5203681218851,-1259.1392167224028,771.32342877765313,-176.61502916214059,12.507343278686905,-0.13857109526572012,9.9843695780195716e-6,1.5056327351493116e-7]; if (z<0.5) return Math.log(Math.PI/Math.sin(Math.PI*z)) - lgamma(1-z); z-=1; let x=c[0]; for(let i=1;i<g+2;i++) x+=c[i]/(z+i); const t=z+g+0.5; return 0.5*Math.log(2*Math.PI)+(z+0.5)*Math.log(t)-t+Math.log(x); }
  return 1 - gammaIncLower(k/2, x/2); }

/* downloadText: 19/19 copies agreed */
function downloadText(filename, text) {
  const blob = new Blob([text], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click();
  setTimeout(() => { document.body.removeChild(a); URL.revokeObjectURL(url); }, 0);
}

/* highlightByDataLine: 16/16 copies agreed */
function highlightByDataLine(codeId, key) {
  const pre = document.getElementById(codeId);
  if (!pre) return;
  pre.querySelectorAll(".line").forEach(l => l.classList.remove("hi"));
  pre.querySelectorAll(`.line[data-line="${key}"]`).forEach(l => l.classList.add("hi"));
}

/* ===========================================================================
 * PER-PAGE SEEDING
 *
 * WHY THIS EXISTS. Every lesson shipped with `seed: 42` (or another constant),
 * so every student in the class saw byte-identical "random" data: the same ten
 * coin flips, the same drift walk, the same 30 sampled heights. Two costs. The
 * cheap one is that any answer read off the picture is shareable -- the first
 * student to finish can tell the rest that the third round came up 7 heads.
 * The expensive one is pedagogical: a stochastic result that the whole class
 * sees identically is not a stochastic result. It is a fixed figure wearing a
 * seed, and a lesson that spends its time saying "this varies" while showing
 * everyone the same picture is arguing against its own evidence.
 *
 * WHAT CHANGES. Each page LOAD draws its own base at random, and every seed on
 * the page is derived from it. Two students opening the same lesson get
 * different draws of the same process; so does one student who reloads.
 *
 * WHAT DOES NOT CHANGE. pageSeed() is stable WITHIN a load. Call it twice with
 * the same label and the same number comes back, so a redraw triggered by
 * moving some other slider does not reshuffle the data underneath the student
 * mid-question. Only a refresh moves it. This matters because the draw
 * functions are called on every control change: a raw Math.random() at the
 * point of use would make the picture flicker to a new dataset on every drag.
 *
 * WHAT IS DELIBERATELY LEFT FIXED. A few synthetic datasets exist to display
 * one specific structure -- a collider, a Simpson's-paradox reversal, a
 * within-clade slope that flips sign across clades -- and a scored question
 * asks the student to read that structure off the screen. Those generators
 * impose their structure by construction rather than by luck, but they are
 * called out at their definitions so the choice is visible rather than
 * accidental. See PROJECT_NOTES.
 * ========================================================================= */

/* One 32-bit draw per page load. Everything else on the page hangs off it, so
 * a single value is all that separates one student's copy from another's. */
var PAGE_SEED_BASE = (function () {
  try {
    const b = new Uint32Array(1);
    (window.crypto || window.msCrypto).getRandomValues(b);
    if (b[0]) return b[0] >>> 0;
  } catch (e) { /* no WebCrypto (file:// on an old browser) -- fall through */ }
  return ((Date.now() ^ (Math.random() * 0xFFFFFFFF)) >>> 0) || 1;
})();

/* True only while randomizeSeedSliders() is synthesising input events, so the
 * engagement counters can tell "the page seeded itself" from "the student
 * moved a control". Without this every lesson would open claiming the student
 * had already manipulated four panels. */
var SEEDING_IN_PROGRESS = false;

const __pageSeedCache = Object.create(null);

/* A fresh integer in [min,max] every call. For "re-roll this now" buttons. */
function randomSeed(min, max) {
  min = (min == null) ? 1 : (min | 0);
  max = (max == null) ? 999 : (max | 0);
  return min + Math.floor(Math.random() * (max - min + 1));
}

/* The page's seed for `label`: random across loads, fixed within one.
 * Labels are hashed (FNV-1a over the base) rather than offset, so two stages
 * on a page get unrelated draws instead of adjacent integers -- adjacent
 * mulberry32 seeds produce visibly similar first values. */
function pageSeed(label, min, max) {
  const key = String(label);
  if (key in __pageSeedCache) return __pageSeedCache[key];
  min = (min == null) ? 1 : (min | 0);
  max = (max == null) ? 999 : (max | 0);
  let h = PAGE_SEED_BASE >>> 0;
  for (let i = 0; i < key.length; i++) {
    h = Math.imul(h ^ key.charCodeAt(i), 0x01000193) >>> 0;
  }
  h = Math.imul(h ^ (h >>> 15), 0x2545F491) >>> 0;
  h = (h ^ (h >>> 13)) >>> 0;
  const v = min + (h % (max - min + 1));
  __pageSeedCache[key] = v;
  return v;
}

/* Paint a seed value into the three places a stage can show it: the range
 * input, its <output>, and the `set.seed(...)` number in the R listing beside
 * the plot. All three are optional -- a stage with no slider still gets its
 * code listing updated, and a stage with no listing is left alone. Returns the
 * value so it can be used inline: `sA.seed = paintSeed("A", pageSeed("l8A"))`.
 */
function paintSeed(prefix, value) {
  const v = String(value);
  const inp = document.getElementById(prefix + "_seedIn");
  if (inp) inp.value = v;
  const out = document.getElementById(prefix + "_seedOut");
  if (out) out.textContent = v;
  const code = document.getElementById("c" + prefix + "_seed");
  if (code) code.textContent = v;
  return value;
}

/* Randomise every stage that already exposes a seed slider.
 *
 * The lesson's own `input` handler owns the state object, the <output>, the
 * code listing and the redraw, so the cheapest correct move is to set the
 * slider and fire the event the lesson is already listening for. That is why
 * no slider-driven stage needs a per-lesson edit for this.
 */
function randomizeSeedSliders(root) {
  const scope = root || document;
  const inputs = scope.querySelectorAll('input[type="range"][id$="_seedIn"]');
  SEEDING_IN_PROGRESS = true;
  try {
    inputs.forEach(inp => {
      const prefix = inp.id.slice(0, -"_seedIn".length);
      const min = (inp.min === "" || inp.min == null) ? 1 : +inp.min;
      const max = (inp.max === "" || inp.max == null) ? 999 : +inp.max;
      const v = pageSeed("slider:" + prefix, min, max);
      inp.value = String(v);
      try {
        inp.dispatchEvent(new Event("input", { bubbles: true }));
      } catch (e) {
        // A stage whose draw throws before its data has loaded must not stop
        // the remaining stages from being seeded.
        console.warn("seeding: " + inp.id + " handler threw", e);
      }
      // Belt and braces: a handler that updates state but not the readout
      // still ends up displaying the seed it actually used.
      paintSeed(prefix, v);
    });
  } finally {
    SEEDING_IN_PROGRESS = false;
  }
  // Those handlers highlight the seed line in the listing as a side effect of
  // "the student touched this control". Nobody touched it. Clear the marks.
  scope.querySelectorAll("pre.code .line.hi").forEach(l => l.classList.remove("hi"));
}

/* Inline lesson scripts run before DOMContentLoaded, so by the time this fires
 * every stage has defined its state and wired its handlers. */
if (typeof document !== "undefined") {
  document.addEventListener("DOMContentLoaded", function () { randomizeSeedSliders(); });
}

/* A page seed whose DATA passes a test.
 *
 * Most seeds can be drawn blind: a drift walk is a drift walk whichever way it
 * goes, and that it goes differently for different students is the point. A few
 * datasets are not like that. Lesson 6's cinema data and lesson 19's worms are
 * built to display one specific reversal, and a scored question asks the student
 * to read that reversal off the screen. Measured over 20,000 seeds, lesson 6's
 * pooled-vs-within reversal survives 89% of draws and lesson 19's survives 97% —
 * so seeding those blind would hand roughly one student in nine a picture that
 * does not show the thing they are being asked to see, and mark them wrong for
 * reporting what was actually on it.
 *
 * Pinning the seed fixes that and reintroduces the shared-answer problem. So:
 * draw at random, build the data, check the property the lesson depends on, and
 * draw again if it is missing. Every student still gets their own dataset; every
 * student's dataset still shows the phenomenon.
 *
 *   const seed = seedSatisfying("l6dv", s => hasReversal(buildDV(s)));
 *
 * `test` must be cheap and must not mutate anything — it runs up to `tries`
 * times. If nothing passes (a test that is wrong, or far stricter than the
 * caller thought), the first candidate is returned and a warning is logged: a
 * page that renders a merely-unlucky dataset beats a page that hangs or throws.
 */
function seedSatisfying(label, test, tries, min, max) {
  tries = tries || 200;
  let first = null;
  for (let i = 0; i < tries; i++) {
    const s = pageSeed(label + "#" + i, min, max);
    if (first === null) first = s;
    let ok = false;
    try { ok = !!test(s); }
    catch (e) { console.warn("seedSatisfying(" + label + "): test threw", e); return first; }
    if (ok) return s;
  }
  console.warn("seedSatisfying(" + label + "): no seed passed in " + tries +
               " tries; using the first draw. Is the test too strict?");
  return first;
}
