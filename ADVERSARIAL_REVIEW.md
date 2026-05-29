# BIO 202 adversarial activity review — 2026-05-28

Per-lesson adversarial evaluation of the 19 implemented lessons (L1–L19).
Scaffolds (S01–S20) are out of scope per the 2026-05-28 conversation; they
are leftover artifacts whose future is undecided.

## Framing

This review starts from the opposite presumption of `ACTIVITY_REVIEW.md`.
That document was calibrated to be lenient ("1s and 5s rare"). This one
**assumes each activity is failing until proven otherwise.** A passing
verdict has to be earned by clearing the bar on the criteria below, not
just by avoiding gross defects.

**Verdict scheme.** Each lesson gets one of:

- **GOOD** — meets the bar on most criteria, no expected harm from
  leaving it as-is. Used sparingly. Expect 2–4 of 19.
- **REVISE** — has a working spine but at least one criterion is failing
  badly enough that the lesson under-delivers. The fix is local: trim,
  rebuild a stage, swap a dataset, retire an essay.
- **OVERHAUL** — the lesson's structure is wrong for what it's trying
  to teach, the concept is anemic, or the interaction is mostly clicking
  through prose. The fix is to rebuild it from the rhythm up.

**Criteria** (from the 2026-05-28 directive):

1. **Show & manipulate** — student deepens understanding by moving
   features of a statistical or empirical model.
2. **Repeat & build** — parts reinforce and scaffold each other.
3. **Avoids needless telling / wordiness** — every paragraph earns its
   place; teaching notes / anchor essays / footer essays are interrogated.
4. **Emphasizes interpretation & analysis** — students *read* output,
   not compute it.
5. **Visually engaging and dynamic** — coordinated views, animation,
   live updates. Not text-heavy reveal panels.
6. **Clear correct answers** — fill-in, select-all checkboxes, or (rarely)
   strict MC.
7. **Avoids pretest/posttest** — universally failing today. Slated for
   removal in a separate pass; criterion is reported as **(pending
   removal)** for every lesson and does not contribute to the verdict.
8. **15–30 min for a clever, engaged, involved student** — closer to
   30 is better than closer to 15. Under 15 fails. Over 30 fails.
9. **Builds on prior, sets up next.**

**Big-picture criteria added in this pass** (from the same conversation):

- **DAG construction belongs only where it needs to be.** Lessons that
  carry a causal-modeling load (L3 residuals, L5 single-predictor test,
  L6 four-traps, L17 helping, L19 PGLS) should have an explicit
  build-the-DAG move at Stage C. Lessons that are about a single
  distribution / single mechanism (L1, L8, L10) should not.
- **Variance between vs. within should appear in a few places.** The
  course never explicitly frames a t-test as a regression with a 0/1
  predictor. Natural homes: L1 (as a coda — "the same mean machine,
  two groups"), L6 (the unifying frame for the four traps), L14 (where
  F-statistics already decompose variance components).
- **LOTR adaptation data enters at L3** as the non-biological anchor
  for intercept/slope/residual semantics, before NHANES kg-from-height.
- **DellaVigna 2008 movie-violence data is a proxy/mediator example,
  not collider bias.** The reveal — violent movies = young-men movies —
  is about a mismeasured exposure proxying for the real cause. A
  natural fit for L3 or a new Stage C/E in L5–L6 if DAG retrofits land
  there. A separate dataset is needed if a true-collider lesson is
  wanted (Berkson-style, NBA height-vs-shooting, etc.).
- **Stages may be subdivided.** A single Stage A or D may contain
  multiple datasets back-to-back. This raises the duration ceiling and
  enables intuitive-anchor-then-biology pacing.

---

# Verdict summary

| # | Lesson | Verdict |
|---|---|---|
| L1  | Adding up coin flips until a bell appears | **REVISE** |
| L2  | Resampling to ask if new data still belongs | **REVISE** |
| L3  | Subtracting the line and reading what's left | **OVERHAUL** (LOTR retrofit + DAG move) |
| L4  | How unique is the line you fit (R² and bootstrap cloud) | **REVISE** (trim) |
| L5  | One regression, one shuffle, one tail | **REVISE** (DAG retrofit at C) |
| L6  | Same test, four traps | **OVERHAUL** (between-vs-within frame + DAG) |
| L7  | The regression slope becomes h² (Galton) | **REVISE** |
| L8  | Mendel and the chi-squared | **REVISE** |
| L9  | Hardy-Weinberg as the baseline | **GOOD** |
| L10 | Wright-Fisher drift | **GOOD** |
| L11 | Reading drift in the wild (Nₑ from heterozygosity decay) | **REVISE** |
| L12 | Selection on a single allele | **GOOD** |
| L13 | Mutation-selection balance | **REVISE** |
| L14 | F-statistics | **REVISE** (between-vs-within frame) |
| L15 | Breeder's equation | **REVISE** |
| L16 | F_ST and migration | **GOOD** |
| L17 | Hamilton's rule | **OVERHAUL** (Stage A is dead; DAG move missing) |
| L18 | Reading trees with rotated nodes | **REVISE** |
| L19 | PGLS / phylogenetic correction | **REVISE** (DAG retrofit + collider example) |

GOOD: 4 / REVISE: 12 / OVERHAUL: 3.

If you only do three overhauls, do L3, L6, L17 in that order — they
unblock the rest of the spine.

---

# Lessons

## L1 — Adding up coin flips until a bell appears

**Verdict: REVISE.**

**Adversarial read.** The core machine (μ as best-constant predictor →
heights → NHANES) is structurally clean, and the coin-flip → continuous-
trait progression is the strongest single-lesson scaffold in Unit 1.
Three real problems show up under adversarial reading:

1. **Wordiness is the worst in the unit.** The "Why this, first?"
   teaching note, the "What the plots are showing" prose, the outcomes
   box, and the long footer essay including a forward reference to
   Unit 5 — collectively this is the chattiest implementation in the
   course. Most can be cut without losing the activity.
2. **Stage B's reasoning options telegraph the answer.** The "stick
   with one value" option carries a paragraph-length rationale inside
   the option text itself. That is showing-via-option-text, which is
   the same defect Q2C has in L7.
3. **Duration is plausibly over 30 min.** 3 coin rounds + 30 height
   draws + 30 NHANES draws + a stretch challenge is heavy, especially
   for the first lesson when the student is still building muscle
   memory with the framework.

**What stays.** The three-stage scaffold (coins → heights → NHANES),
the live μ/σ overlay, the error-from-μ canvas.

**Revision plan.**
- Cut the footer essay, the Unit 5 forward reference, and the "Why
  this, first?" teaching note (one short scenario sentence per stage
  is enough).
- Rewrite Stage B Q2 options as bare values or claims; move the
  reasoning into the reveal panel.
- Cut Stage A from 3 coin rounds to 2.
- Add a "two groups" coda (~3 min): one slider sets the offset
  between two NHANES subgroups (men/women), student sees μ as
  best-constant within each group becomes the same machine giving two
  answers. This sets up the between-vs-within thread the course is
  missing.

**Course-fit note.** This is the right place to plant the
between/within seed — the μ-as-best-constant machine already runs here,
and adding "two groups, two means" costs almost nothing structurally
while paying off in L6.

---

## L2 — Resampling to ask if new data still belongs

**Verdict: REVISE.**

**Adversarial read.** The four-stage rhythm is the cleanest in Unit 1,
the hidden-switch slider in B is exactly the right interaction, and the
tortoise showcase in D earns its prose. Two problems:

1. **80 + 1 + 5 + 20 + showcase is at the top of the duration band.**
   The C stage's 100 replicates × 5 batches is heavy and produces a
   diminishing-returns plot.
2. **Stage A's 80 draws of stationary data is repetition that doesn't
   build.** The student has already seen the running-mean settle by
   draw 20; the remaining 60 are confirming a settled view.

**What stays.** The hidden-switch slider, the bootstrap-of-difference
move on Galápagos tortoises, the explicit handoff to L3.

**Revision plan.**
- Cut Stage A from 80 draws to 30 with a "keep drawing if you want"
  free-run toggle.
- Cut Stage C from 5 batches to 3.
- Replace one of the synthetic Stage C combos with a real-data
  comparison so the stage builds toward D rather than just timing the
  same machine.

---

## L3 — Subtracting the line and reading what's left

**Verdict: OVERHAUL.**

**Adversarial read.** This lesson is doing too much: it introduces
regression-as-line, residuals-as-leftover, the residual-pattern drill,
*and* a prediction-the-missing-point game on Beren/Cyrus growth data,
plus a vagus-nerve showcase. Each of these is a substantial concept;
together they push the lesson well past 30 min and dilute every stage.
The residual-pattern drill (Stage C, 5 rounds) is the strongest
interaction in the lesson and also the most cleanly liftable to a
scaffold. The biology-anchor opening (NHANES kg-from-height) is the
weakest part of the lesson on the "show don't tell" axis because
students have no domain intuition for what a "good" slope on this
relationship looks like — they're learning the math *and* asking
themselves what the variables mean.

**What stays.** Residual diagnostics as the central interpretive move,
the click-to-predict-the-missing-point Stage D, the handoff to L4.

**Overhaul plan.**

1. **Replace the Stage A anchor with LOTR adaptation graphs.** Each
   point is a quote; x = film minute, y = book page. The intercept and
   slope have immediate domain semantics ("the film opens 12 pages
   in", "10 pages per minute average pacing") that students already
   have intuition for, satisfying §1 *show don't tell* better than the
   weight-from-height regression does. The residuals are quote-out-of-
   order events the student can name.
2. **Stage A subdivides** into A1 (Jackson Fellowship, fit one line)
   and A2 (NHANES kg-from-height, fit the same machine on physical
   data). The repetition is the point.
3. **Stage C becomes a DAG-construction move.** Before the residual-
   pattern drill, the student is shown the LOTR plot with a colored
   chapter overlay and asked to draw the causal arrows: which variables
   plausibly affect the residual? (Extended-edition vs. theatrical;
   action scene vs. dialogue scene.) The DAG is the *prediction* of
   what residual structure the student expects to find. The residual-
   pattern drill follows as the test of that prediction.
4. **Stage E (rug pull) splits the LOTR data by film** (Jackson vs.
   Bakshi vs. Rankin/Bass) or by extended-edition flag — the residuals
   that looked like noise resolve into clean partitions. Same residuals,
   new variable.
5. **Stage D stays as the biology test** (vagus-nerve or
   Beren/Cyrus). The DAG the student built on LOTR gets re-applied on
   a dataset where the structure is biological.

**Course-fit note.** This is where the DAG-construction move enters
the course as a per-lesson tactic. L5, L6, L19 should also gain DAG
moves at their Stage C; L1, L2, L4 should not.

---

## L4 — How unique is the line you fit (R² and the bootstrap cloud)

**Verdict: REVISE.**

**Adversarial read.** The hand-drawn (α, β) cloud → bootstrap-cloud
overlap is the best implementation of "many equally good lines" I've
seen in an intro course. But it carries three substantial showcases
(NHANES, Galton, chalk-cliff) on top of the central interaction, and
the William Smith and Dover-cliff anchor essays are real reading work.
Total runtime probably 30–45 min for a careful student.

**What stays.** The save-20-lines interaction, the bootstrap cloud
overlay, the chalk-cliff bootstrap as the unit closer.

**Revision plan.**
- Drop either the NHANES showcase or the chalk-cliff showcase — both
  do the same job (bootstrap cloud on real data). Keep chalk-cliff;
  it foreshadows Unit 5 better than NHANES does.
- Compress the William Smith / Dover anchor prose to two sentences
  apiece.
- Reduce save-20 to save-12; the marginal student-effort cost of the
  last 8 lines is high and the visual payoff plateaus.

---

## L5 — One regression, one shuffle, one tail (empirical P)

**Verdict: REVISE.**

**Adversarial read.** The strongest stat-machinery lesson in Unit 1.
Reuses the shuffle null four times on different inputs; Stage C Q2
attacks the most common P-value misinterpretation directly. Two
problems:

1. **Stage D's three challenges (hit P<.05 with tiny δ, P>.05 with
   huge δ, moderate) is rich but might be the part that pushes runtime
   over 30 min.** Two challenges suffice to make the same point.
2. **No DAG move at Stage C.** This is the lesson where students
   first hold "a slope + a test" together, and it's the natural place
   to introduce the DAG question: *what causal model is the slope
   evidence for?* Currently the slope is treated as just a number with
   a P-value attached.

**What stays.** The shuffle-null interaction, the Q2 misinterpretation
trap, the Geospiza fortis pre/post-drought stage.

**Revision plan.**
- Add a Stage C DAG move: student is shown the Grant fortis beak-
  depth × year scatter and draws the simplest possible DAG
  (`year → beak depth`) before the test, then is asked which alternative
  DAGs the test could and could not distinguish (`year → drought →
  beak depth` is observationally equivalent for this test). This is
  the first appearance of "the test doesn't see the mechanism" and it
  sets up L6.
- Cut Stage D from 3 challenges to 2.

---

## L6 — Same test, four traps

**Verdict: OVERHAUL.**

**Adversarial read.** The "four traps" framing is right, but the
execution misses the unifying thesis: *every two-group comparison is a
regression on a 0/1 indicator, and the four traps are four ways that
regression's verdict can mislead.* As implemented, the four stages each
demonstrate one trap (non-transitivity, n=30 vs n=300, two-experiments-
same-verdict, equal-means-unequal-variance) but none of them frame the
test as a regression. So the student gets four separate lessons-in-
miniature without the through-line that makes them one lesson. The
wrap-up's "homoplasy" essay with a Unit 5 forward reference is wordy
in a way that's at odds with the lesson's "verdicts mislead" thesis.

**What stays.** All four traps are individually well-chosen. The
non-transitivity panel is unusually sharp. The n=30 vs n=300 simulator
in B is the right interaction.

**Overhaul plan.**

1. **Reframe the lesson as "the same regression slope, four ways it
   misleads."** Every stage opens with the same two-group data view
   *and* the same two-group fit overlay: `y ~ β·indicator`. The slope
   *is* the mean difference. The four traps are four ways the slope's
   verdict misleads.
2. **Stage A becomes the introduction of the regression-as-test frame.**
   Two groups, slider for n; student sees the slope estimate and its
   CI, then sees that the slope = mean(B) − mean(A). The "this is the
   t-test" reveal is implicit. This is the between/within thread
   landing in the course for the first time.
3. **Stage C gains a DAG move.** Two experiments with the same verdict
   but different effect sizes — the student is asked which DAG is
   compatible with each (effect size vs. sample size). This is a small
   conceptual move that pays off the L5 DAG seed.
4. **Cut the wrap-up essay.** The "statistical homoplasy" pun and the
   Unit 5 forward reference can be a one-line callback inside a later
   lesson; they don't earn their length here.
5. **Add Stage E (rug pull).** A real two-group comparison where the
   regression slope says one thing and stratifying by a hidden third
   variable flips it (Simpson's paradox). DellaVigna's "violent
   movies" data is the natural fit: the slope `crime ~ violent_movie`
   is strongly negative until you stratify by "movie attended by young
   men", at which point the slope is the same in both strata and the
   variable doing the work is the categorization, not the violence.

**Course-fit note.** This is where between-vs-within and DAG-as-causal-
prediction *both* land hardest. Two of the most important threads in
the course pivot through this lesson; the current implementation does
neither of them justice.

---

## L7 — The regression slope becomes h² (Galton)

**Verdict: REVISE.**

**Adversarial read.** The h² slider tilting the cloud live is the right
interaction, and the Galton-data bootstrap closer is strong. One real
problem: Q2 in Stage C provides a paragraph-length "biological reading"
of slope ≈ 0.65 as the *option text itself*. That's the same telegraph-
in-the-option defect as L1B. It's not a small wording fix — it's the
crux question of the lesson, and the option text gives away the answer.

**What stays.** The cov(midparent, offspring) → slope-as-h² thread,
the Galton-data overlay, the explicit unit closer.

**Revision plan.**
- Rewrite Q2C as numeric or as bare-claim MC. The "biological reading"
  belongs in the reveal panel, not in the option text. (Reasonable
  redraft: "What is your best estimate of *h*² from the cloud?"
  numeric input, gated by `withinPct`.)
- Add an explicit handoff to L15 (breeder's equation) at the wrap-up.
  The current implementation closes Unit 1 but the slope-is-h² thread
  is what L15 picks up; this should be telegraphed.

---

## L8 — Mendel and the chi-squared

**Verdict: REVISE.**

**Adversarial read.** The 1000-simulated-honest-experimenters Stage D
is the strongest part — the Fisher-style reveal that Mendel sits in
the lower tail. Three problems:

1. **The chi-squared move is introduced without grounding it in the
   already-built machinery.** The student has been doing permutation
   nulls since L5 and shuffle-the-predictor in L6, and chi-squared
   could land as "the same null move, now on counts." Currently it
   arrives as new vocabulary.
2. **Two anchor quotes per scenario panel is more than the lesson
   needs.** They add personality and bulk in equal measure.
3. **Stage A's n-slider for 3:1 with 4 explorations is on the thin
   side of the duration band.** Could either be cut to make room for
   the chi-squared-as-permutation framing, or extended with a
   "non-1:1 ratio" trial that previews the 9:3:3:1 case.

**Revision plan.**
- Frame χ² in the Stage B reveal as "the same null distribution we've
  been building since L5, but now the statistic is a count discrepancy
  rather than a slope." This is a one-paragraph rewrite, not a
  restructure.
- Cut one anchor quote per scenario.
- Move Stage A from 5 explorations to 4, repurpose the saved time
  toward the framing rewrite in B.

---

## L9 — Hardy-Weinberg as the baseline

**Verdict: GOOD.**

**Adversarial read.** Tight scenarios, strong four-violation toggle in
B that foreshadows L10–L17 cleanly, real-locus stress test in D. The
"null is set up to be wrong" thread carries over from L8 without
adding bulk. Anchor quote is short. The visualization mix
(three-curve genotype plot + generation-trajectory plot + observed-vs-
expected bars + per-locus χ² panel) does real work and isn't
text-heavy. Duration is on target (4 + 5 + 3 + 2 explorations).

**Caveats.** Stage D's "what fraction of wild loci fail HWE" question
could be more interpretive (currently it's a fraction estimate; could
be a multi-select about *which violations* are operating across the
real loci shown). Worth keeping as-is unless the lesson is opened for
other reasons.

---

## L10 — Wright-Fisher drift

**Verdict: GOOD.**

**Adversarial read.** Wright-Fisher delivered live + Buri overlay is
exactly the right closer. Stage C ("do points sit on the diagonal?")
is the right interpretive move — students predict P(fix) = p₀ and read
the scatter against the y=x line. Duration is tight (15 explorations).
Three lecture quotes total is light. The visualization is the most
coordinated in the unit (trajectory + fan + histogram + Buri overlay).

**Caveats.** Stage A's 50-replicate fan toggle is a single click; the
interaction could be stronger if the student first predicts where the
fan will go before toggling. Minor enough to leave alone.

---

## L11 — Reading drift in the wild (Nₑ from heterozygosity decay)

**Verdict: REVISE.**

**Adversarial read.** The profile-likelihood Nₑ estimation is a real
piece of statistics that survives the trip to a slider. The bottleneck
"depth vs. duration vs. product" question is a clean intuition trap.
Two real problems:

1. **The FSJ data fit in D is presented as the climax but is visually
   less engaging than the synthetic decay curves earlier.** A single
   observed-vs-fitted plot doesn't carry the weight a closer needs.
2. **Stage B's two-epoch bottleneck has too many parameters at once
   (depth × duration).** The interaction is rich but a careful student
   spends a lot of time fiddling without obvious payoff before they
   reach the "only the product matters" insight.

**Revision plan.**
- Add a brief Stage B intermediate where one parameter is locked at a
  time, with the explicit "predict before the product reveal" gate.
- Beef up the Stage D FSJ panel with a side-by-side: observed FSJ
  alongside the synthetic decay at the fitted Nₑ. The student should
  see the empirical noise around the fit.

---

## L12 — Selection on a single allele

**Verdict: GOOD.**

**Adversarial read.** Selection + drift cleanly separated then
recombined, LTEE finale as the real-data payoff. The s+p₀ slider plus
50-replicate fan is the right combination — students see the
deterministic spine and the stochastic envelope together. Three-slider
SSR fit for s is the strongest C-stage in Unit 2. Duration on target.

**Caveats.** Could add a DAG move at Stage C (drift-only DAG vs.
selection+drift DAG, with the data being the discriminator), but this
is a maybe-later, not a should-revise.

---

## L13 — Mutation-selection balance

**Verdict: REVISE.**

**Adversarial read.** The CF "the formula breaks → heterozygote
advantage" payoff in Stage D is one of the cleanest model-failure
moments in the course. But the lesson is visually less dynamic than
L10–L12 — more static curves, fewer fans — and Stage A's mutation-only
drift trajectory is largely a restatement of L10's drift trajectory.

**What stays.** The CF three-model panel, the recessive-vs-dominant
contrast, the q̂ ≈ μ/(hs) inversion.

**Revision plan.**
- Cut Stage A from 4 explorations to 2, treating it as a quick recap
  rather than its own stage.
- Add a 50-replicate fan to Stage B (mutation+selection) so the
  trajectory has the same visual signature as L10/L12.
- Frame the CF round in Stage D as a DAG question: "the model says
  the frequency should be X; the observed is 200× higher; what extra
  arrow in the causal graph could account for that?" with three
  candidate DAGs (heterozygote advantage, elevated μ, founder effect)
  as the multi-select.

---

## L14 — F-statistics

**Verdict: REVISE.**

**Adversarial read.** The Wahlund-effect stage is the right execution
of "same F, different cause." The F_IS / F_ST / F_IT decomposition in
Stage C is conceptually heavy and the visualization (three-bar plot)
is the least dynamic in the lesson. The biggest missed opportunity is
that F-statistics *are* the variance-between-vs-within decomposition,
and the lesson never says so. The course's between/within thread
should land here as the framing for the whole lesson.

**Revision plan.**
- Reframe Stage C as a variance-decomposition move. Show the variance
  of allele frequency as a single number, then split it into within-
  deme and between-deme components. F_ST is the between/total ratio.
  This is the between/within thread paying off — the same machinery
  the student is going to need in L19 (PGLS) and the capstone (L30
  Price equation).
- Tighten the three-bar plot into an animated split: variance starts
  as one bar, splits into two as the demes-toggle is dragged. Same
  data, different framing, much stronger visual.
- Keep Stage A (null F histogram) and Stage B (Wahlund) intact.

---

## L15 — Breeder's equation (R = h²·S)

**Verdict: REVISE.**

**Adversarial read.** The h²-collapse stage is the conceptually richest
move in the course's selection-genetics section. But the long-run
collapse in Stage C is more static than it should be — curves rather
than animated trajectories. The Grant finch refit in Stage D is the
right closer but it's a single fit, not a comparison.

**Revision plan.**
- Convert Stage C from static curves to animated trajectories: the
  student presses "advance one generation" and watches h² decay year
  by year, with the population mean drift shown alongside.
- Beef up Stage D into a multi-year refit: rather than fitting one R
  vs. S point, fit the regression across multiple drought-and-recovery
  years and show the bootstrap cloud. This connects back to L4's
  bootstrap-cloud machinery.

---

## L16 — F_ST and migration

**Verdict: GOOD.**

**Adversarial read.** Tight, focused, well-paced. The drift-vs-
migration mirror framing is precisely articulated. The F_ST = 1/(1 +
4Nₑm) closed form delivered via slider is the cleanest formula-
internalization move in Unit 3. The Italian sparrow redraw in Stage D
is short but it does its job. Three real strengths: same machine four
times, formula inversion as part of the rhythm, anchor quote is one
sentence.

**Caveats.** Stage D could be extended with a second species (cod
example from Spies et al. is already cited in the guide and could
provide an inverse-prediction round), but the lesson is already at
target duration. Worth leaving.

---

## L17 — Hamilton's rule

**Verdict: OVERHAUL.**

**Adversarial read.** Stage A is the cleanest example in the course of
a stage that is doing nothing. "A no-dynamics baseline with a seed
slider" is not a stage; it's a control image. The phase-plane in C is
the strongest piece of the lesson (the r·b = c line as the
discriminator is the right visualization), and the haplodiploid reveal
in D is a clean payoff, but the lesson as a whole is well under the
duration target (~12 explorations, plausibly under 15 min). Stages A
and D are both thin.

**What stays.** The phase-plane visualization, the haplodiploid
relatedness reveal, the kidney-donation anchor quote.

**Overhaul plan.**

1. **Replace Stage A entirely.** New A: a "build the DAG" stage where
   the student is shown a behavior (alarm call, sterile worker
   producing siblings, sperm clustering) and asked to draw the causal
   arrows from `relatedness × benefit × cost` to `helping allele
   spreads`. This is the C-stage move from L5/L6 making its first Unit
   3 appearance.
2. **Expand Stage D to a multi-organism comparison.** Currently it
   shows haplodiploid r-to-sister via a one-step reveal. Expand to a
   three-row comparison: diploid full-sibling, haplodiploid sister,
   clonal bacterium — student predicts which has the highest r and
   sees the rule applied across three biological levels.
3. **Carry the trajectory visualization from B forward into C.**
   Currently C is a static phase plane; the trajectory from B vanishes.
   Re-overlay the live trajectory on the phase plane so the student
   sees the trajectory crossing or not crossing the r·b = c line.
4. **Wrap-up should explicitly hand off to L18** (the gene's-eye view
   that makes the haplodiploid reveal generalize). Currently the
   handoff is implicit.

**Course-fit note.** The DAG-as-Stage-A move that L17 needs is the
same move L3 should be doing at Stage C. The two lessons need
coordinated treatment of the DAG primitive.

---

## L18 — Reading trees with rotated nodes

**Verdict: REVISE.**

**Adversarial read.** The click-a-node-to-rotate canvas is the right
core interaction, and the MRCA "trace back not forward" Q in B targets
exactly the right misconception. Two problems:

1. **Stage D's Anolis ecomorph toggle is a single click.** The
   ecomorph-non-monophyly reveal is conceptually rich but the
   interaction is one button press.
2. **The lesson treats trees as topology-only and doesn't introduce
   branch-length intuition** (which L19 then assumes). PGLS depends on
   covariance scaling with branch length; if L18 never mentions branch
   lengths, L19's "the tree is part of the data" reveal lands cold.

**Revision plan.**
- Expand Stage D: instead of one Anolis toggle, walk the student
  through three trees where the "same ecomorph" tips appear in
  different topological positions and the count of independent origins
  changes accordingly.
- Add a brief Stage E (or extend D) where the tree gains branch
  lengths and the student sees that "sister taxa" is a topology fact
  but "how similar should they be?" depends on branch length. This is
  the L19 setup.

---

## L19 — PGLS / phylogenetic correction

**Verdict: REVISE.**

**Adversarial read.** The "naive OLS produces inflated false positives
on truly independent BM traits" demo is the cleanest available proof
that PGLS is necessary. Stage A's false-positive-rate question is the
exact right interpretive move. Two real gaps:

1. **No DAG move at Stage C.** This is the lesson where "shared
   ancestry" *is* a confounding variable, and Pagel's λ is the
   estimator for how much of the trait covariance the shared ancestry
   accounts for. A DAG with `phylogeny → trait1, phylogeny → trait2`
   creating spurious `trait1 ~ trait2` is the canonical confounding
   DAG and should land here explicitly.
2. **Stage E (rug pull) is the natural home for the earthworm
   Simpson's-paradox sign-flip mentioned in the anchor quote.** The
   guide cites it; the lesson doesn't actually deliver it.

**Revision plan.**
- Add a Stage C DAG move: shared ancestry as the confounder; PGLS as
  the conditioning move on the confounder. Same DAG primitive as
  L3/L5/L6/L17 retrofits.
- Add Stage E with the earthworm body-size × soil-pH dataset (or a
  synthetic analog faithful to the structure). Naive: negative slope.
  PIC: positive slope. Sign flip. This is the unit closer the lesson
  currently lacks.

---

# Patterns across the verdict set

**Three structural themes drive most of the REVISE / OVERHAUL calls.**

1. **The DAG-as-causal-prediction move is the missing C-stage primitive
   in the course's regression spine.** L3, L5, L6, L17, L19 all need
   it. L1, L2, L4, L8, L9, L10, L12, L13, L14, L15, L16, L18 don't (the
   user's "common but only where it needs to be" call). The retrofit
   is bounded: a small library of "draw an arrow from variable A to
   variable B" primitive + a stage-template, used in 5 lessons. This is
   the highest-leverage single piece of infrastructure to build before
   touching the lessons themselves.

2. **The variance between/within thread has no current home.** L1 is
   the right place to plant the seed (two-group μ as two best-constants),
   L6 is the right place for the regression-with-0/1-indicator framing,
   L14 is the right place for the F-statistic-as-variance-decomposition
   payoff. None of these currently carry the thread. Connected lessons:
   L19 (PGLS does the same variance decomposition on the tree) and the
   capstone L30 (Price equation is the decomposition at every level).

3. **The wordiness problem is concentrated in Lessons 1, 3, 4, 5, 6,
   13.** Teaching notes, anchor essays, and footer essays carry most
   of the bulk. Cutting these is the cheapest path to bringing the
   over-long lessons into the 15–30 min band.

**Two lessons (L9, L10, L12, L16) are GOOD as-is.** Worth protecting
under any retrofit pass — they're the structural template for what the
course is trying to be.

**Three lessons (L3, L6, L17) need full overhaul.** L3 because the LOTR
retrofit + DAG move requires restructuring three of four stages; L6
because the unifying regression-as-test frame needs to replace four
separate trap-stages; L17 because Stage A is dead and the DAG move is
the natural replacement.

---

# Scaffolds (deferred)

S01–S20 are not evaluated in this pass. Per the 2026-05-28
conversation, scaffolds are leftover artifacts whose use is undecided.
Three open options worth tracking:

- **Promote a subset to in-course homework.** S04/S05 (drift) and S07
  (breeder's equation) are the strongest fits for assignable homework
  per ACTIVITY_REVIEW.md.
- **Retire the rest.** S16–S20 (Unit 4) are text-heavy click-throughs
  that don't carry the show-don't-tell commitment well.
- **Reframe as instructor-led demos.** Scaffolds that build a single
  visual intuition (S04, S05, S13) could serve as in-class projection
  material rather than student work.

This decision can be deferred until after the lesson-level retrofits
land — the lesson revisions will tell us which intuitions need extra
drill and which don't.
