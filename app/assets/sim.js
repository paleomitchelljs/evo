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
