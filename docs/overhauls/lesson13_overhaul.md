# Lesson 13 — selection as regression

**File** · `app/lessons/lesson13.html` — rebuild from zero
**Checks** · `node scripts/check_lesson13_numbers.js` · `python3 scripts/check_lessons.py`
**Status** · replanned 2026-09-24 (the regression lesson of three); A-D built (`version: 8`, `scaffold: 4`, 41 bars in `check_lesson13_numbers.js`); E (collider) planned; locked
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
    D  mediator, confounder (built)
    E  collider: selection makes a trade-off (planned)

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
- Built 2026-09-24 as: x = how far the parents who bred moved (Stage A's shift, `S`), y = how far the offspring moved (`R`). Stage A is the line `R = S` (offspring copied parents), drawn dashed. Each population's line through the origin has slope h². Selection strength is the slope of A's line, so the x axis is measured, not set.
- The inherited share is hidden until that population's scored run, then shown beside the fitted slope. After the five rounds an inherited-share slider opens: at 0 the line lies flat at every slope.
- Not built: "one population cannot reach it at the slider's stop" (a round that cannot be hit is a trap). Multi-generation extension: strong selection spends Va, and the response decays (2026-09-22: spread 1.65 against 2.07 after 300 generations).
- Lesson 8 is the bridge: the slope of offspring on mid-parent is the heritability (JM's ruling, lesson 8), and it is the same `h²` that sets `R/S` here.

### C — the regression is the diagram

- JM: *"arrow = slope, residuals = the 'other' box in the DAG."*
- `paths.js` already binds each arrow of a fixed diagram to a slider. `buildArrows` draws one. Lesson 7's model diagram is the precedent in 1-10.
- Lesson 8 D already fits **one** arrow and an "other factors" band to one cloud. So C is two causes: flower size and stem height → seeds set, plus other causes. What it adds: a one-trait picture's spread is not the other box, because it holds the other trait's arrow too; and the least-squares arrows are the ones whose leftover leans on neither trait, with the leftover's spread as the box.
- Built 2026-09-24: the diagram (`paths.js`, signed arrows) is the controls. Two one-trait plots, each with the diagram's line and the band it expects there (`sqrt(other arrow² × var + box²)`). A leftover histogram against the box's curve, with its lean on each trait printed; live in practice, after Go in a round. Go grows seeds from the student's diagram on the same plants, as hollow dots over the real ones. A round is judged against the least-squares fit of that round's own plants, ±0.5 on each of the three.
- The traits are made exactly unrelated in every sample (C's one-trait slopes = the arrows). D breaks that on purpose.

### D — mediator, confounder, collider

- On the diagram C builds. Mediator: allele → trait → fitness. Confounder: one allele → two traits, one of which does nothing, and it still correlates with fitness. Collider: to build, and to measure what selecting on it does.
- Built 2026-09-24 (mediator + confounder): C's machinery with an allele (0/1/2 copies) behind flower size and stem height; those two arrows are dealt and held, the student sets the four arrows into seeds. Each picture draws the slope the **whole** diagram implies there, `Σ bⱼ cov(xⱼ, xₖ)/var(xₖ)`, so stem's picture tilts with stem's arrow at 0 (confounder) and the allele's picture tilts with the allele's own arrow at 0 (mediator). Rounds: confounder, mediator, hidden pair (+2 / −2, the allele's picture flat), the allele's own arrow, all three.
- The collider does not fit a "find the arrows" game: least squares on survivors is simply wrong about the arrows, and the page cannot judge against it. Planned as its own stage (E): flower size and stem height unrelated at birth; survival needs enough of the two together; among survivors they trade off. Bowling: set how hard the drought selects to hit a dealt trade-off slope among survivors. The point: selection manufactures a trade-off no allele made.

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
| 6 | B | one generation, 2000 parents, inherited value + the rest; parents picked in pairs off A's line; child = midparent + segregation + fresh rest | done |
| 7 | B | the point-by-point plot: (S, R) per run, practice included, one colour per population, each population's fitted line; A's `R = S` line for reference; bottom plot parents / parents counted once per child / offspring | done |
| 8 | B | rounds: a dealt response in a population with hidden h² (0.9, 0.8, 0.6, 0.4, 0.9); share revealed after its scored run; free h² after the rounds; practice switch | done |
| 9 | B | checks: R/S = h² at five h², no response at h² 0 at the stops, variance held at slope 0, one slope = one S everywhere, printed arithmetic, rounds, reveal | done |
| 10 | C | two traits → seeds, the diagram as controls; one-trait plots with the diagram's line and band; leftover plot; Go grows the diagram's seeds; rounds against least squares; free "New plants" after | done |
| 11 | C | checks: least squares vs a hand solve, leftover leans on nothing at the fit and is smallest there, one-trait slope = arrow, band formula = measured spread, bands ~2/3, rounds, opening and "box off one picture" miss, no diagram clears three, leftover hidden in a round | done |
| 12 | D | allele → flower, allele → stem dealt; four arrows into seeds; pictures draw the whole diagram's implied line; rounds confounder / mediator / hidden pair / allele itself / all three | done |
| 13 | D | checks: 4×4 hand solve, leftover leans on none, implied line = each picture's own at the fit, confounded and mediated slopes shown, bands, rounds, "arrows off pictures" misses all five, greediest of 63869 clears one | done |
| 14 | E | collider: selection makes a trade-off | open |

## Measured, 2026-09-24 — A

- The drawn offspring move the shift by spread / sqrt(M w̄) = 0.041 × spread (300 parents, w̄ 2). Tolerance 0.09 × spread: the right slope 93-100%.
- At 0.1 × spread, a round asking +0.30 at spread 2 was reached by slope 0 on luck 15% of the time; at 0.07 × spread still 10% on one page. That round now asks +0.50.
- One slope, four spreads (0.5, 1, 2, 3): shift 0.034, 0.138, 0.534, 1.28 — selection needs variation, measured.
- Slopes the five rounds need: ~0.6, 0.25, −0.41, 1.0, 0.2 (each page draws its own populations).

## Measured, 2026-09-24 — B

- `R/S` pooled over 60 runs: h² 0 → 0.006, 0.25 → 0.251, 0.5 → 0.498, 0.8 → 0.802, 1 → 1.001. At h² 0 and the slider's stops (±1.5) the parents who bred move ±0.65 and the offspring 0.01.
- Slope 1 moves the parents who bred 0.48 in every population (h² 0.2, 0.5, 0.9: 0.483, 0.484, 0.486). Truncation at zero offspring bends it: slope 1.5 gives 0.65, not 0.75.
- The response wanders run to run by 0.032 at 1000 parents, 0.024 at 2000. At 1000 with ±0.06, perfect aim hit 73-95% and slope 0 reached a +0.12 target 1 run in 20; at 2000 with ±0.05, best slopes 93-100%, slope 0 none, greediest slope clears two.
- A first round set asking for slopes 0.7-1.1 let slope 0.85 clear four.
- One run at slope 0 printed a fitted slope of 2.87 (two wobbles divided). The page holds the slope back until sum(S²) ≥ 0.02.

## Measured, 2026-09-24 — C

- Left to chance, 200 plants correlated the two traits by up to 0.19. At 0.19 the flower picture's slope read 2.45 against an arrow of 1.91, beyond the ±0.5 window. The traits are now made exactly unrelated in each sample.
- At the least-squares diagram the bands hold 65-72% of plants in every round.
- Arrows right, box read off the wider one-trait picture: misses 4 of 5 rounds. It hits r4, where the box (4) is most of the spread.
- On a 0.5 grid (3757 diagrams) the greediest clears one round.

## Measured, 2026-09-24 — D

- Reading each arrow off its own picture (box right) misses all five rounds. On a 0.5 grid the greediest of 63869 diagrams clears one.
- r2 (mediator) first had allele → flower 1.5 with flower noise 0.7. The allele was then 70% predictable from flower size, and its own fitted arrow (truly 0) passed 0.4 on 21% of pages. At 1.0 and box 1.5: 2%.
- At the fit, the line and band each picture draws equal that picture's own regression to 4e-15. The identity is `C b = c`, and var(seeds) = b'Cb + box².

## Open for JM

1. Pupfish (scale-eaters) as framing for frequency-dependent fitness, for 15: citation unverified.

## Do not

- Sum `cov` and `within`.
- Take the pre-2026-09-22 `lesson13.html` (mutation–selection balance) as precedent.
- Assert shifting balance; 12 C shows the one case measured to work.
