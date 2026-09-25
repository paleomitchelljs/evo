# Lesson 14 — births, deaths, and crowding

**File** · `app/lessons/lesson14.html` — new page, 2026-09-24
**Checks** · `node scripts/check_lesson14_numbers.js` · `python3 scripts/check_lessons.py`
**Status** · A built (`version: 1`, `scaffold: 1`, 10 bars in `check_lesson14_numbers.js`); B-D planned; locked
**Last touched** · 2026-09-24

Third of three selection lessons: 12 the genetics, 13 the regression, this the births and deaths. Planned in `lesson13_overhaul.md` until it had a slot.

## What the lesson is

- JM, 2026-09-24: *"a trait that causes changes to the birth rate and causes changes to the death rate ... as mediated by something like carrying capacity ... they can adjust the arrows. The arrows exist. They can't take them away or add them ... 0 it's just a line ... positive, it's blue and negative, it's red."*
- JM: *"we haven't done carrying capacities and net growth rate, but r versus K. But we may need 2 parts to build that."* So r and K come first, then the trait on them.
- Lesson 9 E already has a trait (protein %) on birth and death arrows, with net selection as the difference, but no crowding. This lesson adds crowding.

## Stages (provisional)

    A  births and deaths lean on crowding; the population levels off where they meet   (built)
    B  r versus K: a fast type and a crowding-tolerant type; disturbance decides
    C  a trait on the birth and death arrows (JM's diagram), and the trait evolves
    D  one allele, two traits: pleiotropy and trade-offs; where does the allele end up

- JM on D: *"2 traits, both caused by the same allele. 2 traits caused by different alleles ... trade-offs ... some single allele that pleiotropically causes 2 traits. One has a positive effect, one has a negative effect. And you sort of run it through. And see where the allele's frequency ends up."*
- Kept from 2026-09-22: after 300 generations on a peak, strong selection leaves spread 1.65, weak 2.07; move the optimum and the bottleneck is 3 against 105. 12 C (the valley) can move onto this framework once it exists.

## Items

| # | Stage | What | Status |
|---|-------|------|--------|
| 1 | — | new page from lesson 13's furniture; LOCKS row, index card; diagram colours per JM (negative red, arrow in hand dark) by lesson CSS over paths.css | done |
| 2 | A | births Poisson(b0 + bb N/100), deaths each with d0 + bd N/100; lesson 9 E's diagram with crowding as the cause; rates-vs-crowding plot with grow/shrink shading and the crossing; 40-generation runs from 20 | done |
| 3 | A | rounds: one arrow each (the other three held), a level to hit (mean of generations 31-40, ±10%); practice switch | done |
| 4 | A | checks: crossing vs bisection, populations settle at the crossing, rounds at the needed lever value, opening misses, held arrows | done |
| 5 | B | r versus K | todo |
| 6 | C | the trait on the arrows | todo |
| 7 | D | pleiotropy, trade-offs | todo |

## Measured, 2026-09-24 — A

- Mean of generations 31-40 against the crossing, 30 runs each: 396/400, 250/250, 603/600, 299/300, 751/750. The discrete-generation brake settles on the crossing.
- At the lever value each level needs (on the slider's steps), rounds hit 98-100%. The opening lever values hit none.
- The page prints the crossing live, and the rates plot shows it against the target band, so A is easy. It is the first step, where the population settles where births meet deaths. Harder rounds (hit a speed as well as a level, or two arrows at once) are open for JM.

## Rulings

- Negative arrows red, positive blue, zero a plain line (JM, above).
- The level is not named on the page. Lesson 9's rule: build it, don't name it.

## Do not

- Edit `app/assets/paths.css` for this lesson's colours. The override lives in the lesson.
