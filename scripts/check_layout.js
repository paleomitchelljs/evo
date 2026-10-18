#!/usr/bin/env node
/*
 * check_layout.js -- the declutter rules, on every page in app/lessons (JM, 2026-10-17).
 *
 * JM: "the screen is cluttered. This is a pervasive issue ... the R code panels should always be last & default
 * to be collapsed"; "We should more liberally use hover text and optional boxes in general. The bullet points could
 * really be turned into hover text ... I want attention drawn and fixed to controls, output, and predictions".
 *
 * Each page is opened in headless Chrome, its name box given "study mode" (every stage open, no code), every
 * stage unlocked, and then:
 *   errors   no uncaught error on the page, at load or after the name (Chrome's log, attributed by file);
 *   ids      every literal $("x") / getElementById("x") in the page's own script names an element that exists
 *            (a summary line cut from the page with its writer left behind throws only when that writer runs);
 *   bullets  no setup bullet list (ul.setup): its words are hover text;
 *   tips     every .info mark has words behind it, and hover.js is on the page to show them;
 *   R code   in every section that has R code or a Download .R button, the last panel is a closed
 *            <details class="rcode">, and every pre.code and Download .R button of the section sits in one, under
 *            the stage (lesson 7 D has two: the stage's code and the closing table's);
 *   lines    no summary line under a board or plot (.readout, .fit-stats, .status-line) on the screen beyond the
 *            ones kept on purpose, each named below with why; one in a closed optional box is off it. (Lesson 9's
 *            .step-note is a step's lock notice, not a line.)
 *
 * Usage:  node scripts/check_layout.js [lesson12.html ...]     (~1 minute for all)
 * Exit 0 iff every page passes. Needs Google Chrome and python3.
 */
const fs = require("fs"), path = require("path"), { spawn, spawnSync } = require("child_process");
const ROOT = path.resolve(__dirname, ".."), DIR = path.join(ROOT, "app", "lessons");
const PORT = +process.env.PORT || 8805;
const CHROME = process.env.CHROME || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

/* Summary lines kept on purpose: feedback a task needs, or the output a question reads. Everything else that
   restates a board, plot or table is cut. */
const KEEP_LINES = {
  "lesson10.html": { A_read: "carrying one of each allele and 'really in the game', drawn nowhere; in a round, how far off",
                     B_read: "the round's measure: average distance from 0.50, alleles lost",
                     C_read: "the loss per generation and the 1/2N it implies, drawn nowhere else",
                     D_mooseRead: "the record's plain and harmonic means: two numbers the headcount offers, neither the answer",
                     D_read: "the round's measure: heterozygotes lost by Isle Royale against your herd" },
  "lesson11.html": { B_read: "the gap from the target curve, the round's own measure, with what counts as a hit",
                     C_pedRead: "the tree's own inbreeding, which the slider does not print (JM, 2026-09-24)",
                     C_who: "the founder task: which founder is picked", C_hint: "the founder task: two of the same is a homozygote",
                     D_ne: "Ne and 4Ne, the sliders' arithmetic", D_read: "the judged average and spread against the target",
                     E_status: "what is hovered or clicked in the tree: a SNP's copies, two individuals' shared ancestry" },
  "lesson12.html": { A_read: "the season's s and h, measured off the bars, against what the visitors should give: the round judges them",
                     A_mapRead: "what the paint control set (visitors, their choices, pink's redness), as 17 C's fitness line",
                     B_fitRead: "the fitnesses 1, 1 - hs, 1 - s the sliders give, and the covariance working: slope x spread, what selection should move against what moved" },
  "lesson13.html": { A_cardRead: "a round's rule the card's picture cannot show (flowers with none, families apart): JM, 2026-09-30",
                     B_cardRead: "the flowers left a round needs, which the picture cannot show: JM, 2026-09-30",
                     D_fieldRead: "the two traits' correlation, drawn nowhere else" },
  "lesson14.html": { A_barsRead: "the year's change selection should make against the change it made (the rest is chance), drawn nowhere else",
                     B_freqRead: "empty but for 'running...' while a run computes", C_hapsRead: "empty but for 'running...' while a run computes",
                     D_yearsRead: "empty but for 'running...' while a run computes" },
  "lesson15.html": { A_tread: "empty until an allele is picked; then what it is (when it arose, copies now), shown nowhere else",
                     B_tread: "the picked allele's s and h: 'click a copy in the pedigree to see its allele's s and h'",
                     C_popRead: "the race's young and the Price split (cov(w, z), E(wΔz)), drawn nowhere else" },
  "lesson16.html": { A_dndsRead: "dN/dS itself, beneficial and harmful over synonymous: the panel's one result, drawn nowhere else",
                     B_pickRead: "B's pick: the task 'click two genomes that both carry some of you' reads it" },
  "lesson17.html": { B_boardRead: "B's pick: the task 'click two genomes ... the same fragment' reads it" },
};
/* Lessons 1-9 measure in lines: a guess's misses, a fit's typical miss, the bench's next step. Those are the
   output their tasks read, not a plot said twice, so they stay, a class at a time (the sweep, 2026-10-17) */
const KEEP_CLASS = {
  "lesson1.html": { "fit-stats": "heads counted; over and under a guess, the average error; the Pause's averages, which its questions read" },
  "lesson2.html": { "fit-stats": "the running average and its band; calls right, against what chance would give" },
  "lesson3.html": { "fit-stats": "a guess's misses, heavier and lighter, the typical miss" },
  "lesson4.html": { "fit-stats": "the line's numbers, the samples' spread, the films' tangles" },
  "lesson5.html": { "fit-stats": "the finches' typical miss and trend per decade" },
  "lesson6.html": { "fit-stats": "births minus deaths and the model's typical miss" },
  "lesson6b.html": { "fit-stats": "the fit on the years it saw and on the years it had not" },
  "lesson7.html": { "fit-stats": "the island's year (the game's state), its outcome, the typical miss" },
  "lesson8.html": { "fit-stats": "what knowing the parents buys; the heritability line's miss" },
  "lesson9.html": { "status-line": "the bench's next step and what the marks on it can reach" },
};
/* Literal ids a page's script names that exist only later (made on a click), not at load */
const LATE_IDS = {
  "lesson10.html": ["A_rend", "A_rendOut", "A_rerr", "A_rerrOut", "A_rgo", "A_rnext"],   /* A's round rows, built when the rounds start */
};

const pages = (process.argv.slice(2).length ? process.argv.slice(2) : fs.readdirSync(DIR).filter(f => /^lesson\d+b?\.html$/.test(f)))
  .sort((a, b) => parseFloat(a.replace(/\D+/g, "") + (a.includes("b.") ? ".5" : "")) - parseFloat(b.replace(/\D+/g, "") + (b.includes("b.") ? ".5" : "")));

const INNER = (page) => `(() => {
  const out = [], d = document, keep = ${JSON.stringify(KEEP_LINES[page] || {})}, late = ${JSON.stringify(LATE_IDS[page] || [])};
  const src = [...d.querySelectorAll("script:not([src])")].map(s => s.textContent).join("\\n");
  const ids = new Set(); for (const m of src.matchAll(/(?:\\$|getElementById)\\(\\s*["']([A-Za-z][\\w-]*)["']\\s*\\)/g)) ids.add(m[1]);
  const missing = [...ids].filter(id => !d.getElementById(id) && !late.includes(id));
  out.push(["ids", missing.length === 0, ids.size + " literal ids" + (missing.length ? "; missing: " + missing.join(", ") : "")]);
  const ul = d.querySelectorAll("ul.setup").length;
  out.push(["bullets", ul === 0, ul + " bullet lists"]);
  const infos = [...d.querySelectorAll(".info")], tipOf = el => el.dataset.tip ? d.getElementById(el.dataset.tip) : el.querySelector(".tip");
  const empty = infos.filter(el => !tipOf(el) || !tipOf(el).textContent.trim()).length, popped = !!d.querySelector(".tip-pop");
  out.push(["tips", empty === 0 && (infos.length === 0 || popped), infos.length + " marks, " + empty + " empty" + (infos.length && !popped ? ", hover.js not running" : "")]);
  const rbad = [];
  for (const sec of d.querySelectorAll("section")) {
    const pres = [...sec.querySelectorAll("pre.code")], dls = [...sec.querySelectorAll("button")].filter(b => /download \\.r/i.test(b.textContent));
    if (!pres.length && !dls.length) continue;
    const panels = sec.querySelectorAll(".panel"), last = panels[panels.length - 1];
    const inBox = el => { const b = el.closest("details.rcode"); return !!b && !b.open && !!b.closest(".tail"); };
    const ok = last && last.matches("details.rcode") && !last.open && pres.every(inBox) && dls.every(inBox);
    if (!ok) rbad.push(sec.id || "(section)");
  }
  out.push(["R code", rbad.length === 0, rbad.length ? "not last and closed in: " + rbad.join(", ") : "last and closed"]);
  /* a line inside a closed optional box is off the screen until asked for */
  const kc = ${JSON.stringify(KEEP_CLASS[page] || {})};
  const lines = [...d.querySelectorAll(".readout, .fit-stats, .status-line")].filter(e => !(e.id in keep) && !e.closest("details.opt:not([open])") && !Object.keys(kc).some(c => e.classList.contains(c)));
  out.push(["lines", lines.length === 0, lines.length ? lines.length + " left: " + lines.map(e => e.id || e.className).join(", ") : (Object.keys(keep).length + Object.keys(kc).length) + " kept on purpose"]);
  return JSON.stringify(out);
})()`;

const probe = (list) => `<!doctype html><meta charset="utf-8"><title>pending</title>
${list.map((p, i) => `<iframe id="f${i}" src="app/lessons/${p}?preview=1" width="1400" height="1000"></iframe><pre id="o${i}"></pre>`).join("\n")}
<script>
const PAGES = ${JSON.stringify(list)}, SRC = ${JSON.stringify(list.map(INNER))};
let n = 0;
PAGES.forEach((p, i) => document.getElementById("f" + i).addEventListener("load", () => setTimeout(() => {
  const w = document.getElementById("f" + i).contentWindow, d = w.document;
  const inp = d.getElementById("score-name-input"), btn = d.getElementById("score-name-confirm");
  if (inp && btn) { inp.value = "study mode"; btn.click(); }
  setTimeout(() => {
    for (const s of d.querySelectorAll(".stage-locked")) s.classList.remove("stage-locked");
    let res; try { res = String(w.eval(SRC[i])); } catch (e) { res = JSON.stringify([["probe", false, "THREW " + e.message]]); }
    document.getElementById("o" + i).textContent = res;
    if (++n === PAGES.length) document.title = "done";
  }, 2500);
}, 1500)));
</script>`;

const server = spawn("python3", ["-m", "http.server", String(PORT), "--directory", ROOT], { stdio: "ignore", detached: true });
const probes = [];
const cleanup = () => { try { process.kill(-server.pid); } catch (e) {} for (const f of probes) try { fs.unlinkSync(f); } catch (e) {} };
process.on("exit", cleanup);

setTimeout(() => {
  let bad = 0;
  for (let k = 0; k < pages.length; k += 5) {
    const list = pages.slice(k, k + 5), file = "_check_layout_" + PORT + "_" + k + ".html", fp = path.join(ROOT, file);
    fs.writeFileSync(fp, probe(list)); probes.push(fp);
    const r = spawnSync(CHROME, ["--headless=new", "--disable-gpu", "--enable-logging=stderr", "--v=0", "--virtual-time-budget=60000", "--dump-dom",
                                 `http://127.0.0.1:${PORT}/${file}`], { encoding: "utf8", maxBuffer: 1 << 28 });
    const dec = s => s.replace(/&quot;/g, '"').replace(/&gt;/g, ">").replace(/&lt;/g, "<").replace(/&amp;/g, "&");
    list.forEach((p, i) => {
      const m = new RegExp('<pre id="o' + i + '">([\\s\\S]*?)</pre>').exec(r.stdout || "");
      let res; try { res = JSON.parse(dec(m[1])); } catch (e) { res = [["probe", false, "no result"]]; }
      const errs = (r.stderr || "").split("\n").filter(l => /Uncaught/.test(l) && l.includes("/" + p)).map(l => (/"(.*)", source: .*\/([^/]+)$/.exec(l) || [, l])[1] + " @" + ((/\((\d+)\)\s*$/.exec(l) || [])[1] || "?"));
      res.unshift(["errors", errs.length === 0, errs.length ? errs.slice(0, 3).join(" | ") : "none"]);
      const fails = res.filter(x => !x[1]);
      if (fails.length) bad++;
      console.log((fails.length ? "FAIL " : "ok   ") + p.padEnd(14) + res.map(x => (x[1] ? "" : "[" + x[0] + ": " + x[2] + "] ")).join("") +
                  (fails.length ? "" : res.filter(x => ["tips", "lines"].includes(x[0])).map(x => x[2]).join("; ")));
    });
  }
  console.log(bad ? "FAILED " + bad + " of " + pages.length + " pages" : "ALL " + pages.length + " PAGES PASS");
  cleanup(); process.exit(bad ? 1 : 0);
}, 700);
