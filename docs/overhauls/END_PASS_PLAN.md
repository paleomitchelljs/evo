# The end pass — plan and shared brief

**Started** · 2026-11-13 · branch `claude/homework-lessons-overhaul-pdbxx0`
**Status** · in progress (see "Waves" for what has landed)

JM, 2026-11-13: *"look over the various proposed changes and develop a plan to implement them ... orchestrate a
series of Opus subagents that implement the listed changes, and other more comprehensive improvements to these
homework lessons. Lessons 15-20 are the 'best' examples, but I would like in general more flow through of concepts
and repeated widget types while also having specialized visualizations and interactives where possible. The meiosis
and genetic inheritance lessons are solid examples of pedagogy over assessment, which is what I'm looking for
broadly. In general, lessons 1-7 should have the greatest overhauls (potentially total rewrites), lessons 8-14 should
be modified and enhanced, lessons 15-20 should be updated and cleaned, and the post-20 lessons are currently drafts
but they're good ones—please tweak them and I will review them later."*

*"I want each lesson to help my students understand some evolutionary phenomenon more deeply and fully, without
their needing to know math, while the lessons as a whole should build understanding of biology and chart reading and
statistics, and they should build on each other where logical."*

This is the pass `docs/REVISIONS_PLANNED.md` was saving for, plus `docs/PROPOSED_FIXES.md`. This file is the one
brief every session working on the pass reads first. Per-lesson detail goes in `docs/overhauls/lessonNN_overhaul.md`.

---

## 1. What every lesson is held to

Read, in this order: `structurephilosophy.md` (canonical), `docs/LESSON_STYLE.md`, `docs/WORK_ORDER.md`,
`docs/REVISIONS_PLANNED.md` (the rows are the defaults), this file.

- **One evolutionary phenomenon per lesson.** The statistics and the chart-reading are what the student *uses* to see
  it; no lesson is "about" a statistic. No maths is asked of the student: no formula to apply, no number to compute
  by hand. A number is read off a display or set with a control.
- **Pedagogy over assessment** (lessons 8 and 9 are the model). A target is sized on the idea (right direction, rough
  size), closed only to the naive answer the round is built around. Nothing reports a miss as a failure; nothing
  shuts a door; things to find latch when found.
- **Text extremely light.** Hover tips on the box they describe, no setup lists, no line under a plot that restates
  it, R code last and closed. No vocabulary taught; jargon limited to introductory biology.
- **The same widget types, lesson after lesson** (section 3), so a student meets a new process inside furniture they
  already know how to work; and **one specialised picture per lesson** that only that process has (the meiosis cell,
  the pedigree, the grid of nests, the limb bud).
- **Lessons build on each other.** Each lesson names what it takes from earlier ones (a dataset, a number, a widget,
  a diagram) and what it hands on. Call-backs are one clause in a tip or a voice line ("the moose from Lesson 6").
- **Chart-reading and statistics build in a fixed order** (section 4). A chart type is introduced once, slowly, with
  the student building it by hand, and is then reused unchanged.

### The voice

The voice block is JM's own words. No session writes prose in his style.

- Keep his sentences wherever the stage they introduce survives; trim, never paraphrase.
- Where a rebuilt stage needs words that do not exist, write the short mechanical kind lessons 20-26 use (what is on
  screen, what is yours to set, "See whether ..."), at most ~60 words, and mark the block
  `<!-- voice: drafted 2026-11, not JM's words -->` so he can find and replace every one. List them in the overhaul doc.
- The lecture corpus (`docs/2026_lecture_detail.tex`) is not in the repo. Do not invent quotes.

### Scoring and codes

- A rewritten or restructured lesson bumps its `version` in `Score.init` (its old codes stop meaning the same thing).
- One bit per scored attempt or per thing found (row 8), not "hit X of N".
- Study mode leaves targets to be done (row 13).

---

## 2. Tiers

| Lessons | Depth | What that means here |
|---|---|---|
| 1-7 (1, 2, 3, 4, 5, 6, 6b, 7) | rewrite | Re-anchored on an evolutionary phenomenon; rebuilt on the shared kit (section 3) in the 15-20 form; rows 1-3, 5, 7, 9-15, 18-24. Keep the datasets and the statistical job each lesson has, and JM's voice where the stage survives. |
| 8-14 | modify and enhance | Stages stay. Rows 2, 4, 6-9, 11-13, 18-24 applied; cards made pictures; windows re-sized to teach; call-backs to the rebuilt 1-7 and forward hooks; fix F1 (12 A). 8 and 9: protect what they are. |
| 15-20 | update and clean | Rows 18-21 leftovers, wording, seed-robust checks, anything a cold read finds. No redesign. |
| 21-26 | tweak (drafts, JM reviews later) | Bugs, clarity, tips, consistency with 15-20, seed-robust checks, PROPOSED_FIXES item 6. No redesign; stay locked. |

---

## 3. The kit: widget types that repeat

Built first (wave 1) in `app/assets/`, documented in `docs/KIT.md`, shown working in `app/assets/kit_demo.html`.
Extracted from the lessons that already carry three or more copies (the `WORK_ORDER.md` rule: extract at the third
caller). Lessons 1-7 are built on it; 8-14 use it for any stage they rebuild; 15-26 keep their inline copies this
pass (migrating them is its own later job, with their number checks as the safety net).

| Widget | What the student does | Source |
|---|---|---|
| **Target card with circles** | a picture of the outcome with a red box; circles pick any unsolved target; Next target beside Go | 19/20 `mkStage` family, `pips.js` |
| **The roll, with practice** | set, Go, controls hold, the run plays on the plot that carries the target; a ticked practice run does not count | 19/20 `goStage` |
| **Over-time plot** | menu first, lines named at the right of their window, blank before Go | 19 `drawTime` / `labRoom` |
| **Draw what you expect** | drag a curve or a histogram onto the plot, Go plays many runs, the share of the drawing inside the runs' middle 90% is shown | 19 A `A_pred` |
| **Ribbon target** | a band around a line as the target for a spread (row 23) | new |
| **Causal diagram** | arrows are the sliders; one visual language from births/deaths (6) to Price terms (13) | `paths.js` |
| **Things to find** | a short list that latches; no miss is reported | 24/25 draft 3 |
| **Dot strip → histogram → cloud** | the three pictures of a distribution, the same axes and colours each time | new, from 1-4 |
| **Scatter with a draggable line** | drag the line; the leftovers plot under it | new, from 3-5 |

Every widget takes its seed from `pageSeed`, sizes its canvas to its panel, and writes its bits through `score.js`.

---

## 4. The arc: what each lesson is about, takes, and hands on

Chart-reading and statistics, in the order they are built:

    1  a dot per individual → a histogram; centre and spread; one number as a prediction and how far off it is
    2  a sample is not the population; resampling; two histograms that overlap; "does this one belong?"
    3  a scatter; a line; what is left after the line
    4  the cloud of lines that all fit; the cloud narrows with more data
    5  two groups, two lines; when two clouds of lines come apart
    6  a line over time; a model that makes the line (births, deaths); arrows as causes
    6b fitting on part of a record, judged on the rest; more numbers is not better
    7  a trait on the arrows; forecast, then the world changes
    8  parent and child on a scatter: resemblance as a slope, whatever causes it
    9  ratios from a mechanism (meiosis); counts settling as they pile up
    10-11 many runs of one process: the spread *is* the result (drift, inbreeding)
    12-14 a push and its scatter together (selection with drift); the change split into two terms
    15+  everything above, read off new pictures (pedigrees, genomes, F_ST, trees, maps)

### Lessons 1-7, rewritten

| # | Phenomenon | The student sees | Statistics and chart built | Data | Hands on |
|---|---|---|---|---|---|
| 1 | **Variation.** Individuals in a population differ, and for most traits the differences pile into the same shape, because many small causes add up | builds a trait from many small either/or contributions and watches the bell appear; then real birds | dot strip → histogram; centre, spread; one number as a prediction, and its typical miss | Daphne Major finches (`finch_individuals`), NHANES heights | the histogram; "typical miss"; many small causes → 9 E, 14 C (many loci) |
| 2 | **A sample is not the population.** Catch a few birds and the average wobbles; the fewer caught, the more it wobbles. A real difference has to be bigger than the wobble | resamples; asks whether the 1978 birds (after the drought) belong with the 1976 birds | the sample fan; two histograms; overlap; bigger sample, narrower fan | finches before/after 1977; NHANES/NBA kept as the obvious case | sampling wobble → drift in 10 ("random sampling error, inherited and compounded") |
| 3 | **A trait tracks something.** Beak depth with body size, with year; subtract the trend and look at what is left | drags a line through a scatter; reads the leftovers; a second cause shows up in them | scatter, line, leftovers; a group as a second number | finches (individuals; 40-year record), `kids_growth` | the line and its leftovers → 4, 5, 8, 13 |
| 4 | **Is the change real?** A trend through few points could be many trends | locks in many lines that all fit; samples again and again; watches the cloud narrow | the cloud of lines; more data, tighter cloud | bighorn horn length by year (`bighorn_horn`), finches | the cloud → every "many runs" plot from 10 on |
| 5 | **Two species on one island change differently.** fortis and scandens under the same weather | two lines, two clouds; when they come apart; the seed crop as the reason | two groups, two lines; a cause that acts differently on each | finches (beak, seeds) | species as separate lineages → 19-20; seeds as the cause → 7 |
| 6 | **A population changes by births and deaths, and nothing else.** Constant rates cannot make a real record; rates that depend on something can | builds the model arrow by arrow: rain → finches; wolves → moose; crowding | a model that draws the line; typical miss; arrows as causes (DAG step 1); r and K arrive built, unnamed until used | `finch_pop`, `grant_rainfall`, `isle_royale` | births/deaths → 7, 9 E, 10, 14; the moose → 10 D, 11 D |
| 6b | **A model that fits the past perfectly can know nothing about next year** | fits half the record, is judged on the other half; three models compared | train/test; more numbers, more ways to be wrong | finches | "predict before it is unveiled" → 7 C/D |
| 7 | **A heritable trait sits on the arrows** (the bridge to unit 2): beak depth changes who lives, so the population's beaks change | plays a bird; builds the trait into the birth-death model; forecasts; a new species arrives and the forecast breaks | forecast with a cloud; a cause that was not in the data | `island.csv` (modelled on the Grants) | trait → births/deaths → heredity: 8, 12-14 |

### Lessons 8-26: what each already is (do not change the phenomenon)

    8  resemblance between parent and child, whatever causes it      9  meiosis makes the ratios
    10 drift            11 inbreeding and F       12 selection at a gene       13 selection as regression (Price)
    14 real genetic data read with 1-13          15 the bridge: mutants followed (snakes, newts)
    16 mutation         17 migration             18 exam 02 key               19 speciation
    20 phylogeny        21 sexual selection      22 kin and gene-level selection
    23 species selection   24 evo-devo, bodies   25 evo-devo, limbs           26 origins of individuality

---

## 5. PROPOSED_FIXES.md, item by item

| # | Item | In this pass |
|---|---|---|
| 1 | `pageSeed` random across reloads | **Option a + `?seed=N`.** sim.js takes `?seed=N` to force the base (a check or JM can replay a page) and exposes the base; the page stays random per load; the lesson 10 comment is corrected. Options b/c (stable per browser; base carried in the code) change what a reload does in 15 and what a code holds: **left for JM to rule.** |
| 2 | Number checks that paste seed-dependent numbers | Each lesson's session runs its check three times on fresh seeds and re-derives any number that fails; a failing check prints the page's base. |
| 3 | `setupCanvas` pins the declared width | The measuring version goes into sim.js; pages with their own keep it. 8 and 9 looked at 1000 and 1400 wide. |
| 4 | CLAUDE.md gitignored and stale | **Not in this clone (gitignored), so not editable here.** The corrected facts are in README.md; JM's file is his. |
| 5 | REVISIONS_PLANNED row for draft 3 | Added as row 25 ("things to find that latch"), marked as waiting on JM's ruling on 24/25 draft 3; used as a kit widget meanwhile. |
| 6 | 24/25 not yet seen; references from memory | Seen in headless Chrome at 1000 and 1500 wide, tips and R panels opened, study mode, locked view, D's menu. References: checked against what can be reached online; any that cannot be confirmed stay flagged. |
| 7 | 12 A h/s text and y-axis (F1) | Done with lesson 12. |

---

## 6. How the work is run

- One session per lesson (pairs for 21-26). A session edits only: its `app/lessons/lessonN.html`, its
  `docs/overhauls/lessonN_overhaul.md`, its `scripts/check_lessonN_numbers.js`. Anything shared (`app/assets/*`,
  `index.html`, `LOCKS.txt`, `README.md`, `scripts/check_layout.js`, `scripts/check_lessons.py`, the docs in `docs/`)
  is changed by the coordinating session only: a lesson's session reports what it needs there.
- No session commits. The coordinator commits per wave after the checks pass.
- Checks: `scripts/run_check.sh <script> [args]` (takes a free port, at most three Chromes at once, finds Chrome).
  `python3 scripts/check_lessons.py app/lessons/lessonN.html` · `scripts/run_check.sh scripts/check_layout.js lessonN.html`
  · `scripts/run_check.sh scripts/check_lessonN_numbers.js` (write one for a rewritten lesson; three passes on fresh seeds).
- Every session looks at its page: screenshots in headless Chromium at 1500 and 1000 wide, each stage, before and after.
- The overhaul doc comes before the first edit (`_TEMPLATE.md`), and ends with what JM should look at first.

### Waves

| Wave | What | Status |
|---|---|---|
| 0 | this plan; checks runnable anywhere (`CHROME`, `PORT`, `run_check.sh`) | done |
| 1 | the kit + sim.js fixes; 15-20 cleaned; 21-26 tweaked | |
| 2 | 1-7 rewritten on the kit; 8-14 enhanced | |
| 3 | read-through in lesson order for flow (call-backs, wording row 9, one diagram language); index, LOCKS titles, README, REVISIONS_PLANNED and PROPOSED_FIXES brought up to date; every check | |
