#!/usr/bin/env node
/*
 * proto_lesson17_chunks.js -- the measurement behind docs/overhauls/lesson17_overhaul.md
 * (2026-10-09), kept so the numbers there can be re-derived. A prototype, not the page:
 * two populations of N diploids, one chromosome of L loci painted by origin, neutral
 * Wright-Fisher, R crossovers a meiosis (Poisson), each individual swapping with one in
 * the other population with probability m a generation. Reports, per setting, the chunks
 * of the other population's origin: how many, their mean length in loci, the share of loci.
 *
 * Usage: node scripts/proto_lesson17_chunks.js   (~1 minute)
 */
// two populations, N diploid each, one chromosome of L loci; origin painted per locus (0 = A, 1 = B)
// Wright-Fisher, neutral; R crossovers per meiosis on average (Poisson), uniform over L-1 gaps;
// migration: each individual in A swaps with a random one in B with probability m, each generation.
function mulberry32(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;}}
function pois(rng,l){let L=Math.exp(-l),k=0,p=1;do{k++;p*=rng();}while(p>L);return k-1;}
function run(N,L,R,m,T,rng,pulse){
  const mk=o=>Array.from({length:N},()=>[new Uint8Array(L).fill(o),new Uint8Array(L).fill(o)]);
  let P=[mk(0),mk(1)];
  const gam=(ind)=>{const x=pois(rng,R),cuts=[];for(let i=0;i<x;i++)cuts.push(1+Math.floor(rng()*(L-1)));cuts.sort((a,b)=>a-b);
    let s=rng()<0.5?0:1,g=new Uint8Array(L),c=0;for(let i=0;i<L;i++){while(c<cuts.length&&cuts[c]===i){s^=1;c++;}g[i]=ind[s][i];}return g;};
  for(let t=0;t<T;t++){
    P=P.map(pop=>Array.from({length:N},()=>[gam(pop[Math.floor(rng()*N)]),gam(pop[Math.floor(rng()*N)])]));
    const mm = pulse ? (t===0?pulse:0) : m;
    for(let i=0;i<N;i++) if(rng()<mm){const j=Math.floor(rng()*N);const a=P[0][i];P[0][i]=P[1][j];P[1][j]=a;}
  }
  // chunks: runs of the other population's origin, in both populations
  let n=0,len=0,frac=0;
  P.forEach((pop,k)=>pop.forEach(ind=>ind.forEach(ch=>{let r=0;for(let i=0;i<=L;i++){const f=i<L&&ch[i]!==k;if(f){r++;frac++;}else if(r){n++;len+=r;r=0;}}})));
  return {n:n/2, mean:n?len/n:NaN, frac:frac/(2*2*N*L)};
}
const rng=mulberry32(7), N=25, L=100, runs=20;
const summ=(f)=>{const a=[];for(let i=0;i<runs;i++)a.push(f());const ok=a.filter(x=>!isNaN(x.mean));const mean=ok.reduce((s,x)=>s+x.mean,0)/ok.length;
  const sd=Math.sqrt(ok.reduce((s,x)=>s+(x.mean-mean)**2,0)/ok.length);return "chunks/pop "+(a.reduce((s,x)=>s+x.n,0)/runs).toFixed(1).padStart(6)+"  mean length "+(isNaN(mean)?"  -  ":mean.toFixed(1).padStart(5))+" (run sd "+(isNaN(sd)?" - ":sd.toFixed(1))+", "+(runs-ok.length)+" runs none)  foreign "+(100*a.reduce((s,x)=>s+x.frac,0)/runs).toFixed(1)+"%";};
for (const T of [50,100]) for (const R of [0.5,1,2]) { console.log("--- T",T,"R",R,"(crossovers a meiosis), N",N,"L",L);
  for(const m of [0.002,0.005,0.01,0.02,0.05,0.1,0.2]) console.log("m",String(m).padEnd(6),summ(()=>run(N,L,R,m,T,rng)));}
console.log("--- one pulse (5 of 25 swap at t=0), R 1, mean length by T");
for(const T of [5,10,20,40,80]) console.log("T",String(T).padEnd(4),summ(()=>run(N,L,1,0,T,rng,0.2)));
