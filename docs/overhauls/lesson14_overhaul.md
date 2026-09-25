# Lesson 14 — births, deaths, and crowding

**File** · `app/lessons/lesson14.html` — new page, 2026-09-24
**Checks** · `node scripts/check_lesson14_numbers.js` · `python3 scripts/check_lessons.py`
**Status** · A and B built (`version: 2`, `scaffold: 2`, 16 bars in `check_lesson14_numbers.js`); C planned; locked
**Last touched** · 2026-09-24

Third of three selection lessons: 12 the genetics, 13 the regression, this the births and deaths. Planned in `lesson13_overhaul.md` until it had a slot.

## What the lesson is

- JM, 2026-09-24: *"a trait that causes changes to the birth rate and causes changes to the death rate ... as mediated by something like carrying capacity ... they can adjust the arrows. The arrows exist. They can't take them away or add them ... 0 it's just a line ... positive, it's blue and negative, it's red."*
- JM: *"we haven't done carrying capacities and net growth rate, but r versus K. But we may need 2 parts to build that."* So r and K come first, then the trait on them.
- Lesson 9 E already has a trait (protein %) on birth and death arrows, with net selection as the difference, but no crowding. This lesson adds crowding.

## Stages (provisional)

    A  births and deaths lean on crowding; the population levels off where they meet   (built)
    B  a trait causes r and K, each arrow negative to positive; hit patterns of its share over time   (built)
    C  the trait driven by a locus + environmental factors: the genotype's direct influence against the rest

- JM, 2026-09-24, replanning B onward: *"I am thinking of a DAG where there is a Trait that *causes* r & K -- with the students able to adjust from negative to positive for each arrow separately. The goal would be to have students look at scenarios where the trait causes both to go up, where it causes each to go up while the other down, and a bad trait that causes them to go down. The Predict would be to try and achieve various frequencies and patterns of the traits over time and perhaps a complex landscape underlying it. Expanding out to have the trait then driven by a locus + environmental factors to allow students to adjust the direct influence of the genotype on the trait relative to other factors, kind of tying it all together."*
- "Perhaps a complex landscape underlying it": not built; open.
- Earlier, JM on two traits (may fold into C): *"2 traits, both caused by the same allele. 2 traits caused by different alleles ... trade-offs ... some single allele that pleiotropically causes 2 traits. One has a positive effect, one has a negative effect. And you sort of run it through. And see where the allele's frequency ends up."*
- Kept from 2026-09-22: after 300 generations on a peak, strong selection leaves spread 1.65, weak 2.07; move the optimum and the bottleneck is 3 against 105. 12 C (the valley) can move onto this framework once it exists.

## Items

| # | Stage | What | Status |
|---|-------|------|--------|
| 1 | — | new page from lesson 13's furniture; LOCKS row, index card; diagram colours per JM (negative red, arrow in hand dark) by lesson CSS over paths.css | done |
| 2 | A | births Poisson(b0 + bb N/100), deaths each with d0 + bd N/100; lesson 9 E's diagram with crowding as the cause; rates-vs-crowding plot with grow/shrink shading and the crossing; 40-generation runs from 20 | done |
| 3 | A | rounds: one arrow each (the other three held), a level to hit (mean of generations 31-40, ±10%); practice switch | done |
| 4 | A | checks: crossing vs bisection, populations settle at the crossing, rounds at the needed lever value, opening misses, held arrows | done |
| 5 | B | trait → r, trait → K (signed, student-set); other factors hold r 0.40, K 5000 for everyone; one shared crowding; 50 at the start, half carriers; births − deaths plot (r where a line meets the edge, K where it crosses zero), share over 100 generations against windows, counts of each | done |
| 6 | B | rounds: takes over / rises then vanishes / falls then takes over / vanishes fast / rises then holds; checks | done |
| 7 | C | locus + environment → trait → r, K | todo |

## Measured, 2026-09-24 — A

- Mean of generations 31-40 against the crossing, 30 runs each: 396/400, 250/250, 603/600, 299/300, 751/750. The discrete-generation brake settles on the crossing.
- At the lever value each level needs (on the slider's steps), rounds hit 98-100%. The opening lever values hit none.
- The page prints the crossing live, and the rates plot shows it against the target band, so A is easy. It is the first step, where the population settles where births meet deaths. Harder rounds (hit a speed as well as a level, or two arrows at once) are open for JM.

## Measured, 2026-09-24 — B

- From 20 at the start with a limit of 500, growth lasted ~8 generations and 10 carriers drifted: the best settings hit only 33-70%. From 50 up to 5000, growth lasts ~12 generations: best 88-100%.
- Medians over 15 runs: share at generation 10 is 0.20 / 0.51 / 0.77 for the r arrow at −0.2 / 0 / +0.2, and at generation 100 it is 0.00 / 0.52 / 1.00 for the K arrow at −1500 / 0 / +1500.
- With equal K, a trait with higher r rises and then holds wherever the growth phase left it (0.72 at +0.1, 0.81 at +0.2, 0.88 at +0.3): nothing acts once crowded.
- Neutral drift reached the "rises, then holds" windows 1% of the time (200 runs). Its first window is ≥ 0.72.

## Rulings

- Negative arrows red, positive blue, zero a plain line (JM, above).
- The level is not named on the page. Lesson 9's rule: build it, don't name it.

## Do not

- Edit `app/assets/paths.css` for this lesson's colours. The override lives in the lesson.
