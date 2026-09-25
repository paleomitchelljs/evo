# Lesson 13 — selection as regression

**File** · `app/lessons/lesson13.html` — rebuild from zero
**Checks** · `node scripts/check_lesson13_numbers.js` · `python3 scripts/check_lessons.py`
**Status** · replanned 2026-09-24 (the regression lesson of three); A built (`version: 5`, `scaffold: 1`, 11 bars in `check_lesson13_numbers.js`); B-D planned; locked
**Last touched** · 2026-09-24

Second of three selection lessons: 12 the genetics (`lesson12_overhaul.md`), this the regression, then birth–death and DAGs (planned at the end of this doc until it has a slot).

## What it is

- JM, 2026-09-24: *"keeping two things: explicit exploration of covariance as a concept, to build in the Price equation and help students understand its terms for later, and the idea of a regression model based on a causal diagram (arrow = slope, residuals = the 'other' box in the DAG). I would also like to build up the ideas of mediators, confounders, and colliders."*
- Supersedes the 2026-09-22 plan (one trait on a moving landscape). Its specialisation numbers are kept below, with the birth–death framework.
- Additive genetic variation and the response to selection (B) added 2026-09-24.

## Candidate stages (provisional)

JM, 2026-09-24: *"let's have selection as three lessons (genetics, regression, and birth-death/DAGs). We'll add a frequency dependent one later, probably as 15."* So this lesson is the regression one; the birth–death framework and the two-trait stages are the third lesson's (below, until it has a slot).

    A  covariance: who made more offspring, and did it track the trait
    B  additive genetic variation: push harder, and what actually responds
    C  the regression is the diagram: arrow = slope, "other" box = residual
    D  mediator, confounder, collider

### A — covariance

- JM, 2026-09-24, on the style: *"the recent design philosophy (diverse interactives, bowling games, practice rounds, etc) and any new, bespoke types of parts that make sense."*
- JM's idea: *"two plots, and when one is distorted the other distorts, and they try to get the two to match some target with rounds varying based on the covariance strength ... I'm not sure it would build up to the hierarchical nature of the Price equation."*
- **Recommended form, and why it does build to the hierarchical Price.** Left: every parent as a dot, trait across, offspring count up; the student distorts the *fitness* (drags a line or curve through the cloud, or grabs points). Right: the trait distribution twice, parents and offspring-weighted; it distorts as the left is dragged, and the gap between the two means is `cov(w, z)/w̄`, exactly, every frame. Rounds deal a shift to hit; what varies between rounds is the trait's **spread**, so one slope gives different shifts (`cov = slope × variance`: selection needs variation). Bowling, practice switch.
- The hierarchy comes from two extras seeded here: (1) covariance drawn as signed rectangles, one per dot, `(z − z̄)(w − w̄)`, so it is an area the student can see; (2) dots coloured by group from the start, doing nothing yet. Late-20s, the same picture splits the rectangles into between-group (group means) and within-group parts: the multilevel Price term is the same drawing with a partition, not a new apparatus.
- Risk to guard: linked plots can become a toy with no measurable target. The target must be the shift (the selection term), measured off the dots.
- The Price covariance term on screen: offspring count against trait, the covariance as a number, measured.
- The painted-flower contrast, measured 2026-09-22 (400 individuals, 12 additive loci, steady push, 120 generations, per parent):

                                  cov(w,z)/w   E(w·dz)/w   change   trait
      inherited                      0.0941      0.0051    0.0992   12.00 -> 23.90
      re-rolled each generation      0.2905     -0.2890    0.0015   12.00 -> 11.77

- Identity exact every generation. Three times the covariance and goes nowhere: `202_lec16_01` painted flowers, `202_lec15_05` puppy tails.
- `priceTerms` is in lessons 10 and 11, **called by neither, never run**. Check it against a hand computation.

### B — additive genetic variation, and what responds

- JM, 2026-09-24: *"The regression one should also include a bit on additive genetic variation and the fact that R=Va regardless of S should be discovered by students (I'm imagining them making a plot point-by-point where they use interactives to try and force change by ratcheting up selection strength only to find that the response correlates with the heritability variation amount)."*
- **Stated so it holds:** `R = h² S` — response does grow with S. What holds regardless of S: no additive variance, no response at any S; per unit of selection the response is set by the heritable variation, `R/S = h² = Va/Vp`. With selection strength as the fitness slope `β` (the line A's student drags), `R = Va β`, exactly, for an additive trait. The discoverable fact: **each population's points fall on a line whose slope is its Va.** Ratcheting strength slides along the line; only more Va steepens it.
- The bespoke part: a plot built point by point. Each run = one generation at a strength the student sets; the page adds a point (strength, response) for that population. Populations dealt with the same total variance and different Va, so the same push gives the same S and different R.
- Game (to calibrate): a dealt response in a dealt population; one population cannot reach it at the slider's stop. Multi-generation extension: strong selection spends Va, and the response decays (2026-09-22: spread 1.65 against 2.07 after 300 generations).
- Lesson 8 is the bridge: the slope of offspring on mid-parent is the heritability (JM's ruling, lesson 8), and it is the same `h²` that sets `R/S` here.

### C — the regression is the diagram

- JM: *"arrow = slope, residuals = the 'other' box in the DAG."*
- `paths.js` already binds each arrow of a fixed diagram to a slider. `buildArrows` draws one. Lesson 7's model diagram is the precedent in 1-10.

### D — mediator, confounder, collider

- On the diagram C builds. Mediator: allele → trait → fitness. Confounder: one allele → two traits, one of which does nothing, and it still correlates with fitness. Collider: to build, and to measure what selecting on it does.

## The third selection lesson — birth–death and DAGs (no slot yet)

Takes slot 14 when it is built; the placeholder drafts from 14 up shift then (JM: they are an arc sketch, not plans). Planned here until then.

### Births and deaths on a diagram

- JM: *"a trait that causes changes to the birth rate and causes changes to the death rate ... as mediated by something like carrying capacity ... they can adjust the arrows. The arrows exist. They can't take them away or add them ... 0 it's just a line ... positive, it's blue and negative, it's red."*
- JM: *"we haven't done carrying capacities and net growth rate, but r versus K. But we may need 2 parts to build that."* So r and K first, then the trait on them.
- Then the trait driven by one allele, or several (12's machinery).
- Kept from 2026-09-22: after 300 generations on a peak, strong selection leaves spread 1.65, weak 2.07; move the optimum and the bottleneck is 3 against 105. 25% more variation, 35× the headcount. Nothing went extinct in 20 runs; the extinction bar needs sweeping.
- 12 C (the valley) can move onto this framework once it exists.

### Two traits

- JM: *"2 traits, both caused by the same allele. 2 traits caused by different alleles ... trade-offs ... some single allele that pleiotropically causes 2 traits. One has a positive effect, one has a negative effect. And you sort of run it through. And see where the allele's frequency ends up."*

## Items

| # | Stage | What | Status |
|---|-------|------|--------|
| 1 | — | new page from lesson 12's furniture; the old mutation–selection draft retired (its content goes to lesson 12 D) | done |
| 2 | A | covariance, linked plots: parents as dots (trait across, offspring up) under a fitness line the student tilts by dragging; the offspring's trait distribution beside it; the gap between the means is `cov(w, z)/w̄`, printed beside `slope × variance` | done |
| 3 | A | covariance drawn as one signed rectangle per dot; dots coloured by group, doing nothing yet (seed for the late-20s multilevel Price) | done |
| 4 | A | rounds: a dealt shift of the mean in populations of different spread; Go draws each parent's actual offspring (Poisson), controls locked; practice switch. In a scored round the offspring distribution waits for Go; with practice ticked it moves live as the line is dragged | done |
| 5 | A | checks: identity to 1e-14, rectangles = covariance, shift grows with variance at one slope, rounds, slope 0 misses, no slope clears three, drag | done |

## Measured, 2026-09-24 — A

- The drawn offspring move the shift by spread / sqrt(M w̄) = 0.041 × spread (300 parents, w̄ 2). Tolerance 0.09 × spread: the right slope 93-100%.
- At 0.1 × spread, a round asking +0.30 at spread 2 was reached by slope 0 on luck 15% of the time; at 0.07 × spread still 10% on one page. That round now asks +0.50.
- One slope, four spreads (0.5, 1, 2, 3): shift 0.034, 0.138, 0.534, 1.28 — selection needs variation, measured.
- Slopes the five rounds need: ~0.6, 0.25, −0.41, 1.0, 0.2 (each page draws its own populations).

## Open for JM

1. Pupfish (scale-eaters) as framing for frequency-dependent fitness, for 15: citation unverified.

## Do not

- Sum `cov` and `within`.
- Take the pre-2026-09-22 `lesson13.html` (mutation–selection balance) as precedent.
- Assert shifting balance; 12 C shows the one case measured to work.
