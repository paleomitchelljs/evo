# BIO 202 steelman + synthesis — 2026-05-28

Companion to `ADVERSARIAL_REVIEW.md`. Two passes:

1. **Steelman** — the strongest counter-case to each adversarial verdict.
   For OVERHAUL calls: the strongest case for *not* overhauling. For
   REVISE: the strongest case for leaving alone. For GOOD: the
   strongest case for revising anyway. The goal is to surface
   considerations the adversarial pass dismissed too quickly.
2. **Synthesis** — where the steelman moves the verdict, where it
   doesn't, and what new ideas surface from the tension between the two.

The intended workflow is:
`eval → steelman → synthesis → edit lessons → re-evaluate`.
This document is the second link in the first iteration.

---

# Course-wide steelmans first

Three structural calls in the adversarial review deserve their own
counter-case before the per-lesson analysis. If any of these flip,
the per-lesson reads change.

## "DAG construction is the missing C-stage primitive"

**Counter.** The course's three non-negotiables (§1 of `PROJECT_PLAN.md`)
don't require a DAG primitive. Show-don't-tell says students shouldn't
need the word "DAG" — and a click-to-draw-an-arrow widget is exactly
the kind of thing that *introduces* the formal abstraction it's meant
to bypass. The current C-stage tactic — *build the prediction by
visually setting parameters or matching a distribution* — already does
the work students need: it forces the student to commit to a model
before seeing data. Adding boxes-and-arrows risks making the lesson
about the tool rather than about the science.

The DellaVigna proxy-variable story doesn't strictly need a DAG either.
"Violent movies aren't really violent; they're young-men movies" is
a *story* about a mismeasured exposure. The student gets the lesson
from the data revelation, not from drawing arrows.

**What the steelman concedes.** L19's PGLS lesson does need a way to
talk about shared ancestry as a confounder. But "tree as confounder"
can be visualized by overlaying the tree on a scatter — not by
arrows-and-boxes.

**Where this lands in synthesis.** See §"DAG primitive" below.

## "Variance between/within should appear in a few places"

**Counter.** The course already does variance-between/within
implicitly in L14 (F-statistics) and L19 (PGLS). Making it *explicit*
risks turning a working biology lesson into a statistics lesson — the
exact failure mode the show-don't-tell commitment is trying to avoid.
A student who can compute F_ST has internalized between/within without
needing the words.

The L6 retrofit ("t-test is regression on a 0/1 indicator") is the
most contentious case. The current L6 frames four traps as four
distinct phenomena to recognize, which is closer to how a working
scientist actually thinks: "oh, this is the n=300 trap." Reframing
everything as "the slope on a 0/1 indicator" trades pattern recognition
for unified formalism — and most students don't need the formalism to
recognize the traps.

**What the steelman concedes.** L1 has zero between/within content
now and the data (NHANES heights) literally has a binary sex variable
sitting unused. Planting a between/within seed there is essentially
free.

## "LOTR enters at L3 as the non-biological anchor"

**Counter.** L3's current opener (kg-from-height NHANES regression)
*is* the biology anchor the lesson needs. Replacing it with a movie-
adaptation scatter risks the lesson feeling like a stats class
exercise that uses biology as decoration later, instead of a biology
lesson that uses statistics. The §1 *intuitive-data anchoring*
commitment says "lead with a dataset the student has intuition for" —
but it doesn't say "lead with a non-biological dataset." Height
predicting weight is intuitive to almost everyone.

The LOTR data also has a hidden risk: the intercept and slope have
*such* obvious narrative meanings ("when does the film start in book-
time", "pages per minute") that the student may never separate the
statistical concepts from the narrative concepts. They'll learn "the
slope of an adaptation curve" rather than "the slope of a regression."

**What the steelman concedes.** Adding LOTR as a Stage A1 *before*
NHANES (rather than instead of NHANES) is essentially free and gives
the repetition the §1 commitment recommends.

---

# Per-lesson steelman

For each lesson, the strongest counter-case to its adversarial verdict.

## L1 — Adding up coin flips

**Adversarial verdict: REVISE.**

**Steelman for GOOD-as-is.** L1 is the entry point. Every other lesson
in the course assumes the student has internalized μ as best-constant,
σ as typical spread, and the "draw → tally → compare to expectation"
rhythm. Trimming the teaching note risks raising the activation cost
for exactly the students who need the most hand-holding — students
who haven't seen a statistics framework presented as "build the
machine, then watch it work" before. The footer essay with the Unit 5
forward reference isn't padding; it's the only place in Unit 1 where
the student is told "this same machine will show up in lesson 30."
Cutting it severs a deliberate thread.

The 30 + 30 + stretch challenge structure is heavy, yes — but the
repetition is the pedagogical move. A student who short-circuits the
repetition doesn't internalize the running-average behavior, and L2's
bootstrap CI lands on uncertain footing.

**Where the steelman wins.** The forward-reference footer earns its
length if (and only if) Lessons 4, 6, and 30 actually call back to it
when the same machinery returns. Currently L4 does, L6 doesn't, L30
isn't built. Until L30 exists, the forward-reference is paying for
something that hasn't arrived.

## L2 — Resampling

**Adversarial verdict: REVISE.**

**Steelman for GOOD-as-is.** Stage A's 80 draws isn't repetition that
doesn't build; it's the deliberate moment where the student sees a
running mean *fail to converge fast enough* to feel intuitive. Cutting
to 30 draws lets students leave the stage thinking "30 is enough,"
which is exactly the wrong intuition for the rest of Unit 1. The
diminishing-returns plot in C is similarly load-bearing — it's the
first time the course says "yes, more data is better; here is *how
much* better, asymptotically."

**Where the steelman wins.** The 80-draw count is intentional, not
indulgent. Steelman holds for Stage A. Steelman does not hold for
Stage C's 5 batches — three would teach the same diminishing-returns
shape with less click-fatigue.

## L3 — Subtracting the line

**Adversarial verdict: OVERHAUL.**

**Steelman for REVISE-only.** The adversarial read overstates how much
the current lesson is doing. The residual-pattern drill in Stage C is
the centerpiece, and it is the highest-leverage single interaction in
Unit 1 — converting it to a DAG-construction move would replace a
proven five-rounds-of-pattern-recognition drill with a one-shot
arrow-drawing activity that hasn't been piloted anywhere in the
course. That's a bad trade.

The NHANES kg-from-height opener has a real virtue: students *know*
height and weight are related, so when the regression line works,
they're not surprised — and that lets them focus on the question
"how *much* does the line work?" which is the residual question. Open
with LOTR and the student is busy decoding the *premise* before they
get to the residual question.

The proposed Stage E (LOTR + film-color overlay) is great. The proposed
restructure that demotes the residual drill to make room for a DAG
move is the part that doesn't earn its keep.

**Where the steelman wins.** REVISE with LOTR-as-addition (Stage A1
before NHANES) and a film-color rug pull at Stage E is the right
scope. Full structural overhaul of Stages B, C, D is overreach.

## L4 — How unique is the line

**Adversarial verdict: REVISE (trim).**

**Steelman for GOOD-as-is.** The chalk-cliff showcase isn't redundant
with NHANES — it's the first time the course shows a bootstrap on
*chronologically ordered* data with a specific question ("how old is
this stratum?"). That's an entirely different framing than the
between-individuals bootstrap in NHANES, and pulling it out costs the
course the Unit-5-forward bridge that the chalk-cliff showcase is the
*only* current vehicle for.

The save-20-lines interaction is the lesson's signature move and
20-vs-12 isn't a meaningful runtime saving (the cost is one click and
one slider adjustment per line). Cutting to 12 saves ~2 minutes of
student time at the cost of weakening the visual punchline.

**Where the steelman wins.** The chalk-cliff showcase stays. The save-
20-lines count stays. The William Smith / Dover essays are still
trimmable.

## L5 — One regression, one shuffle, one tail

**Adversarial verdict: REVISE (DAG retrofit at C).**

**Steelman for GOOD-as-is.** The DAG move proposed for Stage C is the
first DAG move in the course. Piloting a brand-new interaction
primitive in a lesson that is already the strongest stat-machinery
lesson in Unit 1 is a high-variance bet — if the DAG widget doesn't
land cleanly, it taints the strongest lesson the course has.

The current C stage (5 real datasets, shuffle the predictor, read the
null, predict the 95% envelope) already does what the proposed DAG
move is trying to do — it forces a model commitment before the test
runs. The commitment is "I predict the envelope width" rather than
"I predict the causal structure," but both serve as the prediction-
before-data gate that §1 requires.

**Where the steelman wins.** L5 may be the wrong pilot for the DAG
primitive — L17 or L3 are lower-stakes places to validate the widget
first. If the DAG widget exists and works elsewhere, *then* a Stage C
retrofit becomes defensible.

## L6 — Same test, four traps

**Adversarial verdict: OVERHAUL.**

**Steelman for REVISE-only.** The "four traps" framing is more memorable
than "regression with a 0/1 indicator" because the traps are *stories*
— non-transitivity, sample-size-vs-effect, two-experiments-same-verdict,
unequal-variance — and students recall them as a kit of named patterns,
which is how working scientists actually use this knowledge. Reframing
everything as a single regression formalism trades pattern recognition
for unified machinery. That trade favors the statistician, not the
biology student.

The wrap-up "homoplasy" essay isn't padding; it's the only place in
Unit 1 where statistical traps are paralleled with biological traps,
priming the analogy that pays off in L18 (convergent ecomorphs that
look monophyletic). Pulling it out severs another forward thread, like
L1's footer.

**Where the steelman wins.** The four-trap structure should survive.
What can layer on top without restructure: a brief Stage 0 (or an
inline note at the start of Stage A) that says "every trap below is
the same regression — `outcome ~ group` — failing in a different way."
That gives the unifying frame without rebuilding the lesson. Stage E
(rug pull with DellaVigna) is still a worthwhile addition.

## L7 — Galton's slope = h²

**Adversarial verdict: REVISE.**

**Steelman for GOOD-as-is.** Q2C's paragraph-length option is a
deliberate choice — it's the only place in the course where students
are asked to choose between multiple complete biological
interpretations of the *same* number. The reasoning lives in the
option text because that's where the choice happens. Moving the
reasoning to the reveal panel makes the question "what is h²?"
(closed-form lookup) rather than "what does h² ≈ 0.65 mean
biologically?" (interpretation).

**Where the steelman wins.** The defense of Q2C is principled but not
decisive — the option-text reasoning still telegraphs the answer. A
better fix than rewriting Q2C is to *add* a Q3 that asks the student
to *write* the interpretation (free text, not scored). That keeps the
interpretive load without the telegraph.

## L8 — Mendel + chi-squared

**Adversarial verdict: REVISE.**

**Steelman for GOOD-as-is.** The χ² is genuinely a different statistic
than the shuffle null — it has a parametric reference distribution, not
an empirical one. Framing it as "the same null move on counts" papers
over a real conceptual distinction the student will need when they get
to L10's binomial null or L19's likelihood profiles. The two anchor
quotes per scenario panel build personality and are the lecture-tie
the course is otherwise missing in Unit 2.

**Where the steelman wins.** "Same null move on counts" is fine for
landing the lesson, but a brief reveal-panel callout that χ² has a
*known* reference distribution (whereas L5's shuffle null had to be
*generated*) preserves the conceptual distinction. Trim one of two
anchor quotes per panel; the second is decorative.

## L9 — Hardy-Weinberg

**Adversarial verdict: GOOD.**

**Counter-case for REVISE.** Stage D's "what fraction of wild loci
fail HWE" is a single fraction-estimate question. A lesson titled "the
baseline" earns its closer by asking the student to *do something*
with the baseline-violation pattern, not just guess a fraction. A
multi-select about *which violations* are operating across the real
loci shown would do real interpretive work and connect L9 to L10–L17
explicitly.

**Where the counter wins.** Minor revision; not blocking. Worth doing
on the next iteration but not on this one.

## L10 — Wright-Fisher drift

**Adversarial verdict: GOOD.**

**Counter-case for REVISE.** The 50-replicate fan toggle in Stage A
is one click. For a lesson that introduces stochastic dynamics, the
student should be predicting the *shape* of the fan before clicking
to reveal — not toggling it on and reading it. A "draw your guess for
the fan envelope" interaction (clicking on the canvas to mark the
expected ±2σ region, then revealing the simulated envelope) would
turn a passive reveal into an active prediction.

**Where the counter wins.** Real improvement; not blocking. Worth
queueing for second-pass revision.

## L11 — Reading drift in the wild

**Adversarial verdict: REVISE.**

**Steelman for GOOD-as-is.** The two-epoch bottleneck with both depth
and duration sliders is the lesson's signature move — it's where
students discover that the *product* (depth × duration) is what
matters, not either individually. Locking one parameter at a time
removes the discovery and replaces it with a guided demonstration.
The "fiddling without payoff" is exactly the fiddling that leads to
the discovery.

**Where the steelman wins.** The two-slider stage stays as-is. The
revision that earns its keep is the Stage D side-by-side observed/
fitted comparison.

## L12 — Selection on a single allele

**Adversarial verdict: GOOD.**

**Counter-case for REVISE.** The lesson never asks the student to
*distinguish* drift-only from selection+drift on a trajectory they
haven't seen labeled. S06 the scaffold does this drill, but the
lesson itself doesn't. Adding a single round in Stage B or C —
"here's a trajectory; tell me if there's selection in it before I
fit it" — would turn the LTEE finale into a confirmation of a
prediction rather than a passive read.

**Where the counter wins.** Real improvement. Worth queueing.

## L13 — Mutation-selection balance

**Adversarial verdict: REVISE.**

**Steelman for GOOD-as-is.** The CF "model breaks → heterozygote
advantage" payoff is the strongest model-failure moment in the course
and the visual quietness of the lesson is part of what gives that
moment its weight. Adding a 50-replicate fan to Stage B (the proposed
revision) makes the lesson visually louder but distracts from the
deterministic equilibrium that is the *point* of mutation-selection
balance.

**Where the steelman wins.** Skip the fan-addition. Keep the CF DAG
multi-select revision; it adds interpretive load without changing the
visual register.

## L14 — F-statistics

**Adversarial verdict: REVISE.**

**Counter-case for GOOD-as-is.** The current three-bar F-decomposition
is concrete and quick — students see F_IS, F_ST, F_IT as three
numbers that add up. Reframing as "variance decomposition with an
animated bar split" makes the visual cleaner but introduces variance
as a new concept right when the student is trying to internalize what
the F numbers mean. Variance-of-allele-frequency isn't an intuitive
quantity for someone learning F-statistics for the first time.

**Where the counter wins.** Defer the variance-decomposition reframe
to a *second* lesson (an L14.5 if Unit 3 grows, or a later capstone
beat) rather than retrofitting L14 itself.

## L15 — Breeder's equation

**Adversarial verdict: REVISE.**

**Steelman for GOOD-as-is.** The static curves in Stage C are
deliberately static — the *point* of h²-collapse-without-mutation is
the long-run flattening, which is a static plot, not a trajectory
animation. Animating it round-by-round risks making the student focus
on each generation's tiny step rather than on the asymptotic flatness.

**Where the steelman wins.** Skip the trajectory animation revision.
The Stage D multi-year refit with bootstrap cloud is a clean addition
that connects to L4.

## L16 — F_ST and migration

**Adversarial verdict: GOOD.**

**Counter-case for REVISE.** Stage D is short (one Italian sparrow
redraw). The cod example from Spies et al. is already cited in the
guide and could provide an inverse-prediction round that would
extend the lesson by ~3-5 minutes without bloating it. A two-species
closer would also reinforce the "Nₑm is what matters, not the species"
point harder than a single-species closer can.

**Where the counter wins.** Worth doing. The lesson is at the bottom
of the duration band, which means there's headroom to add a round
without breaking the band.

## L17 — Hamilton's rule

**Adversarial verdict: OVERHAUL.**

**Steelman for REVISE-only.** The "no-dynamics baseline" in Stage A
is doing one real job: showing the student that *without* the
relatedness payoff, the helping allele just drifts. That's the
implicit null. Cutting Stage A entirely removes the null-baseline
reference that B/C/D are implicitly compared against.

**Where the steelman wins partially.** Stage A's job (establish the
null) is real. The way it currently does that job (a static panel
labeled "no dynamics") doesn't earn its place — students don't read
the panel as "this is what happens without the rule," they read it as
"nothing is happening on this page."

**Where the steelman doesn't save it.** The fix is to make Stage A
*about* the null, with an interaction: seed slider with r=0, drift
trajectory, "watch the helping allele do nothing." That's a small
build, not a structural change. So Stage A revision yes; lesson
overhaul no. The DAG-as-Stage-A move from the adversarial review
turns out to be overkill.

## L18 — Reading trees

**Adversarial verdict: REVISE.**

**Steelman for GOOD-as-is.** Stage D's single-click Anolis ecomorph
toggle is the closer the lesson needs — it's the moment where the
abstract "topology vs. layout" lesson lands on a real biological
case. Adding two more trees would dilute the punch.

**Where the steelman wins partially.** Stage D doesn't need
expansion. But adding branch lengths somewhere (whether in D or in a
new Stage E) is the L19 prerequisite the adversarial review
correctly flagged. The branch-length addition is the right revision;
the multi-tree expansion is not.

## L19 — PGLS

**Adversarial verdict: REVISE.**

**Steelman for GOOD-as-is.** The lesson already implicitly does the
"shared ancestry as confounder" move when Stage A shows that OLS on
truly independent BM traits gives spurious correlations. Adding a
DAG widget to make this explicit risks pulling the lesson out of its
biology register into a statistics register. The earthworm Simpson's-
paradox closer is a real addition, but the lesson already lives at
the top of the duration band — adding it might push past 30 min.

**Where the steelman wins partially.** The DAG move at C may be
overkill. The earthworm closer is worth doing only if duration permits
— possibly by trimming Stage B's correlation-slider rounds from 5 to 3.

---

# Synthesis

Where the steelman moved the verdict, what survives, and what new
ideas emerge.

## Revised verdict table

| # | Lesson | Adversarial | Steelman | **Synthesized** |
|---|---|---|---|---|
| L1  | Coin flips | REVISE | GOOD-ish | **REVISE (smaller scope: trim wordiness only after L30 stub exists; add 2-group coda)** |
| L2  | Resampling | REVISE | GOOD-ish | **REVISE (Stage C 5→3 batches only; Stage A 80-draws stays)** |
| L3  | Subtracting the line | OVERHAUL | REVISE | **REVISE+ (LOTR as A1 addition, film-color rug pull at E; residual drill untouched; no DAG retrofit)** |
| L4  | R² and bootstrap cloud | REVISE | GOOD-ish | **REVISE (trim anchor essays only; save-20 and chalk-cliff stay)** |
| L5  | Shuffle null | REVISE (DAG) | GOOD | **GOOD (defer DAG retrofit; pilot DAG elsewhere first)** |
| L6  | Four traps | OVERHAUL | REVISE | **REVISE+ (add Stage 0 unifying-frame note + Stage E DellaVigna rug pull; keep 4-trap structure)** |
| L7  | Galton h² | REVISE | REVISE | **REVISE (add Q3 free-text interpretation; keep Q2C reasoning options as-is)** |
| L8  | Mendel χ² | REVISE | REVISE | **REVISE (one anchor quote per panel; reveal-panel note on parametric vs. empirical null)** |
| L9  | HWE | GOOD | REVISE-ish | **GOOD (queue Stage D multi-select for second pass)** |
| L10 | Wright-Fisher | GOOD | REVISE-ish | **GOOD (queue draw-your-fan-envelope for second pass)** |
| L11 | Drift in wild | REVISE | GOOD-ish | **REVISE (Stage D side-by-side comparison only; two-slider stage stays)** |
| L12 | Selection on allele | GOOD | REVISE-ish | **GOOD (queue "label the trajectory" round for second pass)** |
| L13 | Mutation-selection | REVISE | GOOD-ish | **REVISE (CF DAG multi-select only; skip fan addition)** |
| L14 | F-statistics | REVISE | GOOD | **GOOD (defer variance-decomposition reframe to capstone Price beat)** |
| L15 | Breeder's | REVISE | GOOD-ish | **REVISE (Stage D multi-year refit only; keep static C curves)** |
| L16 | F_ST migration | GOOD | REVISE | **REVISE (add cod inverse round to Stage D; duration headroom exists)** |
| L17 | Hamilton | OVERHAUL | REVISE | **REVISE (rebuild Stage A with r=0 drift trajectory; expand Stage D to 3-organism comparison; no DAG retrofit)** |
| L18 | Trees | REVISE | GOOD-ish | **REVISE (add branch-length intro at end; keep single-click Anolis closer)** |
| L19 | PGLS | REVISE | GOOD-ish | **REVISE (trim Stage B 5→3 rounds; add earthworm Stage E; no DAG retrofit)** |

**Net movement.** The steelman moved 3 OVERHAUL → REVISE (L3, L6,
L17). The synthesis kept 2 GOOD as GOOD (L5, L14) — the steelman
saved them from cosmetic revisions. The synthesis moved 1 GOOD →
REVISE (L16) — the counter-case for adding a cod round was decisive.

GOOD: 4 (L5, L9, L10, L12, L14) — wait, that's 5. Recount:
- GOOD: L5, L9, L10, L12, L14 → **5**
- REVISE: L1, L2, L3, L4, L6, L7, L8, L11, L13, L15, L16, L17, L18, L19 → **14**
- OVERHAUL: none

The net change: OVERHAUL collapsed; GOOD list grew by 1. The course
is in better shape than the adversarial pass alone suggested. But
nearly every lesson still needs a revision touch.

## The biggest structural change from synthesis

**The DAG primitive is deferred.** Three of three adversarial OVERHAUL
calls hinged on building a DAG-widget; the steelmans of all three were
substantively about *not* building it yet. The synthesis: don't
introduce DAG-as-interaction in this revision pass. Revisit after the
revised L3, L6, L17 have been validated with students.

This is the highest-impact synthesis decision. It frees the editing
pass from a major infrastructure dependency, lets the revisions
happen in the existing primitives, and defers a high-variance design
choice until there's data on whether it's actually needed.

## What new activities emerge

Three new candidates surfaced during synthesis:

1. **A standalone "between vs. within" mini-lesson** (call it L1.5 or
   slot into L6 as Stage 0). The synthesis confirms the between/within
   thread is currently absent and the L6 retrofit is non-disruptive.
   If the L6 Stage 0 lands cleanly, no separate L1.5 is needed.
2. **A collider-bias activity** distinct from the DellaVigna proxy
   case. The user noted DellaVigna is proxy/mediator, not collider.
   If collider bias is wanted in the course, it needs its own
   activity — possibly using the "tall basketball players aren't
   worse shooters except *conditional on being in the NBA*" data
   structure, or a Berkson-style hospital admission example. Slot:
   probably between L6 and L7, or as part of L19's confounding-vs-
   selection reveal.
3. **A "label this trajectory" activity for L12.** The L12 steelman
   surfaced that the lesson never tests the drift/selection
   distinction before applying it. If scaffold S06 is being retired
   (per the user's "leftover artifacts" framing), the drill belongs
   in L12 itself as a Stage B addition.

The first two are real new-activity candidates. The third is a
within-L12 revision. None require new infrastructure beyond what
exists today.

## What changes for the editing pass

Based on the synthesis, the editing pass should:

1. **Skip the DAG primitive build entirely.** Revisit only if a future
   iteration's eval surfaces a clear need.
2. **Treat L3, L6, L17 as REVISE, not OVERHAUL.** The smaller scope
   means each can be a single-PR edit instead of a structural rebuild.
3. **Land the L1 two-group coda even before the L30 stub exists.** It
   plants the between/within seed cheaply and the seed pays off
   regardless of whether L30 ever explicitly calls back to it.
4. **Cut the L4 anchor essays but keep the showcases.** Half the
   adversarial trim, all of the duration benefit.
5. **L8: trim one anchor quote per panel.** Cheapest revision in the
   set; restores duration without touching structure.
6. **L11: Stage D side-by-side observed/fitted is the one revision.**
   Skip the two-slider stage rework.
7. **L17 Stage A becomes "watch drift do nothing when r=0."** Not a
   structural overhaul; a single-stage rebuild.
8. **L16, L19: extend Stage D with one extra round each.** L16 cod
   inverse, L19 earthworm Simpson's flip. Both are within-duration.
9. **L7: add a free-text Q3.** Keep the Q2C reasoning options intact.
10. **L13: replace Stage D's third panel with a 3-option multi-select
    on the CF discrepancy.** Smallest possible CF DAG move.

The five GOOD lessons (L5, L9, L10, L12, L14) get no edits this pass.
Their queued revisions go on a second-pass list.

## Second-pass queue (after first edit cycle)

For the eval-steelman-synthesis-edit *second* iteration, queue:

- **L5**: revisit DAG retrofit once the primitive has been piloted in
  L17 (the lowest-stakes place).
- **L9**: Stage D multi-select on which HWE violations are operating.
- **L10**: draw-your-fan-envelope interaction.
- **L12**: label-this-trajectory addition.
- **L14**: variance-decomposition reframe as a Unit 5 capstone beat,
  not an L14 retrofit.
- **Cross-cutting**: by second pass, the L30 stub should exist so L1
  and L4's forward references actually go somewhere.

## What the synthesis decided not to decide

- **Scaffolds (S01–S20).** Still deferred per the user's "leftover
  artifacts" framing. The synthesis surfaces one consideration: if
  L12 absorbs the trajectory-classification drill from S06, that's
  one scaffold's content getting promoted into a lesson. If the
  pattern repeats (S04/S05 content into L10, S07 into L15, etc.),
  scaffolds might naturally dissolve via absorption rather than
  needing an explicit kill decision.
- **The "true collider" example dataset.** New activity candidate
  flagged above; dataset choice deferred to a separate conversation.
- **The L30 capstone build.** Multiple forward references in L1, L4,
  L6, L14 depend on L30 existing. Not in scope for this pass but
  blocking on several second-pass items.
