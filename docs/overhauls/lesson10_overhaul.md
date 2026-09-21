# Lesson 10 — overhaul

**File** · `app/lessons/lesson10.html` (`version: 5`, `scaffold: 9`)
**Checks** · `node scripts/check_lesson10_numbers.js` · `python3 scripts/check_lessons.py`
**Status** · rounds 1 and 2 done — 2026-09-21. Both check suites green; A, B and C driven end to end in headless Chrome.
**Last touched** · 2026-09-21

## What the lesson is

Drift, whole: random differential reproduction with nothing attached, the fact
that the error compounds because it is inherited, the two absorbing walls, and
four ways to shrink a population without taking a body off the island.

The thing to protect is **Stage B**: one switch decides whether the next
generation's parents come from the generation before it or from the pond the run
started with, with the per-generation randomness identical either way. That
contrast is the whole of "the error itself is inherited" and it costs one
argument in `breed()`.

## Stages as they stand

    A  one population, shares handed out unevenly, nothing looking at colour
    B  the switch: inherited pool vs. fresh pool — ten target spreads
    C  107 populations and the two walls — ten target shapes  (Buri is the framing, not a panel)
    D  the Lesson 6 moose model, with a gene walking its line   + real data: Isle Royale wolves
    E  four arrows into one junction: bodies, crash, sex ratio, brood spread  + real data: LTEE

D and E were rebuilt 2026-09-18 to JM's brief and were structurally what he
asked for, but the session ran out before the bar checks came with them: the
check script still tested the *retired* D/E and threw `D_formula is not
defined`, so nothing in either stage had ever been verified. Writing the
checks found four real defects, listed below.

## Items — round 1 (done)

| # | Stage | What | Status |
|---|-------|------|--------|
| 1 | A | Predict card → ten dealt rounds. Flat table: dealt parameters as read-only rows, then two sliders — **ending frequency** and **how far off you expect to be**. Both draw on the trajectory plot (a line and a band around it). Hit Go, the run animates, verdict. | done |
| 2 | A | Rounds are **not graded**. Ten of them. The one recorded bit is silent: did the last five land more often than the first five. | done |
| 3 | A | Keep the free controls and the extinction roll (drive an allele out inside 30 generations, five times) as an ungraded gate ahead of the rounds. | done |
| 4 | A | Drop the two-number opener (average brood / how many leave none) and the three-round "how far does it move" game. | done |
| 5 | — | Answer boxes say **correct / incorrect** and nothing else. The evidence is the plot, not a sentence. Applies to every `mountLock` and `wireGame` verdict on the page. | done |
| 6 | A | `done:` line "You were never asked which way it would go" was **strictly wrong** — the per-roll call asks exactly that. Gone with the rebuilt card. | done |
| 7 | — | `BIT` 13 → 12 slots, `scaffold: 12`, `version: 4`. Decoder is generic; no per-lesson table to update. | done |
| 8 | D/E | Rewrite the stale halves of `check_lesson10_numbers.js` against the shipped D (moose record) and E (four arrows). Add checks for A's ten rounds. | done |
| 9 | — | Run both check scripts; smoke-test the page in a browser. | done |

## Items — round 2, from JM's dictated notes 2026-09-21

The shape of every ask in this round is the same, and it is worth stating once
because it is what most of the work is: **a prediction is a picture the student
builds with the controls, not a number they type.** JM: *"I don't like these
text predictions. The predict [card] should just be controlled by the controls
and it should manifest as the plot ... The controls set the simulation up, then
they hit go, and the simulation runs and it shows them if their prediction
landed or not."* So A's band becomes a density curve on the right axis, B's
target becomes a spread to hit, and C's target becomes a histogram shape to
match.

### Stage A

| # | What | Status |
|---|------|--------|
| A1 | Replace the intro prose with JM's dictated passage: evolution needs a unit and a population; selected means the trait influences its own transmission; unequal transmission for *any* reason changes the frequency; smaller populations fluctuate harder. | done |
| A2 | Rewrite the setup bullets to his three: what a dot is and the three genotypes · they reproduce at random, watch them · what the two tasks are. | done |
| A3 | **The two sliders draw a vertical density curve on the right-hand axis**, not a line and a band. *"I would rather [it] be a histogram rendered on the right y axis, so that they are actually looking at a distribution instead of a set line in a band ... they shift the mean and the variation of it."* | done |
| A4 | Labels: round → **population** · "the pond starts at" → **starting allele frequency** · "and holds" → **population size** · sliders → **predicted final frequency** / **expected error** · "Next pond" → **New population**. | done |
| A5 | Two exceptions to the bare verdict, and only these two: on **incorrect**, a standing note that the population size and starting frequency change every time; and a max-width band reads **"correct, but too uncertain"**. | done |
| A6 | The extinction roll can be gamed by bottoming both sliders and re-rolling. A landed roll must use a **setting not already used** — a different number of individuals, or a different combination of the two. | done |
| A7 | The offspring-unevenness slider "can get too high" — cap it. | done |
| A8 | **Put the yellow/purple call back** before each roll. Ungraded and never recorded, and the student is not told so. | done |
| A9 | Task text: 1 *"Predict the final allele frequency for 10 populations."* 2 *"Set population parameters to drive one allele extinct inside 30 generations."* | done |

### Stage B

| # | What | Status |
|---|------|--------|
| B1 | New prose: A watched one population drift from different starting points; B watches several drift apart from the same one. Each generation inherits the noise of the one before, which is what makes a single population look like it is being pushed. The switch is inherited vs. not; the uninherited setting is where migration arrives in a few weeks. | done |
| B2 | Rewrite the bullets. | done |
| B3 | **A histogram of where the 20 ended up, on the right-hand axis**, revealed at the end of the run alongside the trajectory lines. | done |
| B4 | Drop the committed estimate entirely. The card becomes: the populations all start at 0.5 — use the controls to hit a **target spread**. | done |
| B5 | Ten rounds. **The first five are practice; the last five are scored.** | done |
| B6 | Targets are named by the shape they produce: everything fixed at one end or the other, and roughly normal with nothing extinct after ~300 generations. A variety of them. | done |
| B7 | **One target must be reachable only with the uninherited switch** — the setting where the spread stops growing with time. | done |
| B8 | Keep 20 populations. JM considered raising it and said no. | done |

### Stage C

| # | What | Status |
|---|------|--------|
| C1 | New prose: the classic 107-bottle experiment as framing, then *"drift destroys variation"* — an allele that randomly hits zero is gone forever, nothing maintains variation, the system collapses to one allele, and the time it takes is a function of only the starting frequency and the population size. | done |
| C2 | Rewrite the bullets. | done |
| C3 | **The predict card shows a target histogram and the student matches it with the controls.** Ten targets, ranging from both spikes (everything fixed) to still roughly normal. Judged on general shape, not exactly — *"the correct/mismatch because of the randomness, not to get it exactly right, but if they got the general shape."* | done |
| C4 | Histogram labels → **purple extinct** / **yellow extinct**. | done |
| C5 | **Drop the Buri real-data panel.** *"Just ditch the actual 'flies somebody actually counted' data — just have that be the framing at the top."* Buri survives as the opening prose. | done |

### Cross-cutting

| # | What | Status |
|---|------|--------|
| X1 | `BIT` and `scaffold` change again as A's, B's and C's recorded items move. Bump `version`. | done |
| X2 | Rewrite the A, B and C halves of `check_lesson10_numbers.js` against the new games, and re-measure every target. | done |

### One contradiction in the dictation, and how it was read

The third setup bullet says *"First, you will run the population 10 times,
trying to drive one allele extinct ... Then you will try and predict the end
frequency."* The task list dictated a few sentences later says step one is
*"Predict the final allele frequency for 10 populations"* and step two is
*"Set population parameters to drive one allele extinct."* **Taken as
predict-first**, which is what the numbered task list says, what the stage
already does, and the only order in which the card can deal the population
rather than the student setting it. The bullet was rewritten to match. Say the
word and it flips.


## What round 2 measured, and the two things it had to design around

- **Stage A's expected-error slider is a real distribution, not a band.** The
  curve drawn on the right axis is normal with `sigma = e * sqrt(pi/2)`, so a
  stated error of `e` is a curve whose own average miss is exactly `e`. The
  truth beside it is a **histogram**, not a curve, because a small population
  piles its endpoints against the two walls and a smooth curve hides the two
  spikes that are the point.
- **Stage B's five targets, measured.** `dist` is the average distance of the
  twenty endpoints from 0.50. Reachable settings, counted over the whole of
  both sliders: target 1 (everything fixed) 46, target 2 (spread, one or two
  gone) 115, target 3 (about half fixed) 144, target 4 (tight pile, nothing
  lost) 39, target 5 (300 generations, nothing extinct) 35. **Target 5 has
  zero inherited settings and thirty-five uninherited ones** — at 300
  generations the tightest the inherited rule gets is 0.32 away with six
  populations gone, at the top of the headcount slider. That is the switch
  earning its place.
- **Stage C could not be judged by comparing the two pictures, and that took
  three passes to establish.** 107 populations over 21 bins gives a
  same-setting distance of 0.13–0.17, which is as large as the gap between
  neighbouring targets: a tolerance wide enough to accept a correct answer
  accepts the wrong shape, and a setting sitting between two targets clears
  both. Measured at 9, 11, 15 and 21 bins; it fails at all of them, and
  widening the ladder does not save it because past "mostly fixed" the
  distribution stops changing (two settings an order of magnitude apart in
  generations-over-headcount sit 0.02 apart).
  **So the picture is what is shown and matched, and the verdict is taken on
  the two numbers that pin a picture of this kind down** — how many of the 107
  have lost an allele, and how far from 0.500 they sit on average. Both are
  printed on the card. Under that judge the five shapes are disjoint (tightest
  pair separated by 1.25 tolerance-box widths), every shape accepts its own
  setting 18–20 times out of 20, each is reachable by 93–318 settings, and no
  setting anywhere on the two sliders clears two shapes.
- **Stage A's roll is no longer gameable by bottoming both sliders.** A landed
  roll spends its `(individuals, unevenness)` setting; a later roll at a spent
  setting reports that an allele went and refuses to count it. Measured: well
  over eight distinct settings land 5+ times in 12, so the rule costs nothing
  but a slider move.
- **The unevenness slider now stops at 2.0** (was 3.0), on JM's note that it
  "can get too high".


## What the checks found once they ran (2026-09-21)

Four defects, all fixed, all of which come back if the simulators are edited
carelessly. This is what "the checks were never brought with the rebuild"
turned out to cost.

1. **D and E dealt a round and ran it in the same breath**, so the answer was
   on the plot and in the readout before the student was asked for it. D's
   readout printed *what the record is worth to a gene* — which is the
   question — and E's printed *lost an allele: k of 40*. `wireGame` now always
   draws the strip and calls `cfg.reveal` **after** the lock; D and E run
   their herds there, and both readouts say "lock in your estimate to run the
   forty herds" until then.
2. **E's ladder was clearable without the arrows it hands over.** A crash
   alone reaches 35 of the forty, so rungs 3 (asked 22) and 4 (asked 32) were
   both walkable with rung 2's arrow. Each rung now carries `floors`, applied
   to the slider's own `min`: from rung 3 the crash stops at 40, from rung 4
   at least 25 breed as males. Measured: crash alone at depth 40 reaches 4 of
   40; crash + sex reaches 40; crash + sex + broods reaches 35 where crash +
   sex alone reaches 7. Rung 1 is a **window** (14–20), so bottoming the
   headcount overshoots exactly as badly as leaving it alone.
3. **E's closing rounds had two of three classes answering near zero**, and
   "all forty" cleared one of them. Classes are now 50–70 bodies (≈11 of 40),
   a crash to 10–12 (≈16), and a lek plus uneven broods (≈28); tolerance
   tightened from 0.25 to 0.18 of the truth. Neither 0 nor 40 clears any round.
4. **`C1 half-life is 1.4 × the headcount` failed about one run in twenty**,
   and had done since before this pass. `C_halfLife` reads the crossing off
   400 replicates; over 24 seeds it is unbiased but its spread is 5–6% of the
   answer, so a single draw sat outside a 15% window regularly. The bar is now
   20% per headcount **and** 8% on the average of the four, which is the sharp
   half. Nothing on the page changed.

## Measured numbers this pass pinned

- Stage A's ten rounds: a pond of 14 is typically off by **0.367** after 30
  generations, one of 60 by **0.200**, one of 320 by **0.088** — a factor of
  4.2, which is the whole reason the second slider is the stage. The widest
  band lands 100% of the time in every class and the narrowest lands 3–8%, so
  the silent last-five-vs-first-five bit cannot be gamed from either end.
- `A_typical` (which draws the green band) agrees with Stage A's own
  `makePool`+`breed` operator to within 6% at every class.
- Stage D's window (12–24 of 40 outside 0.35–0.65) corresponds to a record
  worth **50 to 240 moose**, and is landable by two routes: deaths at
  0.260–0.285 on the Lesson 6 winters, or 4–6 deep winters with the rates left
  alone. Doing nothing gives 0–1 of 40; flattening the herd gives 40 of 40.
- Stage E's four causes against the simulator: 24 bodies → herds measure 25.8;
  a crash to 10 → says 27.0, measures 26.3; 6 of 100 breeding as males → says
  22.6, measures 22.9; broods spread 1.8 → says 23.6, measures 24.7.

## Rulings

- **JM, 2026-09-21, on Stage A's card**: *"There is WAY too much text in the
  prediction box. It should be a short, flat table."* Two calls: the expected
  final frequency, and how far off they expect to be. Each is a slider that
  moves something on the graph.
- **JM, 2026-09-21, on the second call**: *"Have the students predict it in the
  form of their expected error (eg how wrong they expect to be on average) as
  this builds on earlier lessons (4-6)."* So it is a **typical miss**, Lesson
  6's words, not a confidence percentage.
- **JM, 2026-09-21, on scoring**: *"These predictions are not scored … what we
  score is a silent record of whether the last 5 predictions were more correct
  than their first five."*
- **JM, 2026-09-18, on D**: *"the moose data from an earlier lesson (6?)
  already have them label 'two bad years' and have static birth/death rate
  models. We should use that as part D."* Built.
- **JM, 2026-09-18, on E**: *"manipulate all four triggers … via a DAG-like
  framework — ideally one built so that later on we can implement selection."*
  Built; the selection arrow is declared hidden and `herdStep` already takes `s`.
- **JM, 2026-09-18, on every game**: *"trying to get allele frequencies to end
  at particular targets some fraction of the time … while giving them more and
  more factors to manipulate to do so."* That is E's four-rung ladder and D's
  two-sided window.

## Do not

- Do not re-fuse `cov` and `within` in `priceTerms`. `docs/WORK_ORDER.md`.
- Do not extract the core operator to `pop.js` yet — third caller, not second.
- Do not retry the FSJ deposit for 10E. Its year-to-year variance is *below*
  binomial, because the cohorts overlap. WORK_ORDER says why.
- Do not add F_ST, migration, or a second population. One pool per parent slot
  is the whole API this lesson commits to.
- Do not take Lessons 12+ as precedent for anything here.
