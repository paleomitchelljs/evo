# Lesson 13 — a trait on a landscape that moves

**File** · `app/lessons/lesson13.html` — rebuild from zero
**Checks** · `node scripts/check_lesson13_numbers.js` (to write) · `python3 scripts/check_lessons.py`
**Status** · plan only, no edits made
**Last touched** · 2026-09-22

Second of a pair. **Shared spine — the 12/13 division, the Price thread, the measured two-term numbers — is in `docs/overhauls/lesson12_overhaul.md`.** Not repeated here.

Slot 13 was "Where deleterious alleles get held in place" in `LOCKS.txt`. This displaces it; see open question 4 in 12's doc.

## What it is

- One continuous trait, a growth-rate curve beside it, a headcount free to fall.
- Lesson 12 could not kill a population — relative fitness. This one can.

## Protect

- **Stage D**: the population that adapted better is the one that nearly dies.

## The model

- `L` additive biallelic loci. Trait = count of + copies out of `2L`, so it is a count the student already read off lesson 10's dot cloud.
- `makePop` / `makePool` with a `share` / `breed` all unchanged. **The multi-peak lesson is the same operator with more loci.**
- Absolute: next headcount = current × mean absolute growth, against a ceiling. Extinction reachable.

## The briefed Sewall Wright stage does not simulate

JM's brief: small populations do the jump to the high peak; large ones are stuck.

- Built the obvious way it teaches the opposite. Three peaks, population started on the middle one, success = **sustained** occupancy of the tall peak (mean trait over the last 100 of 600–700 generations), 25–30 runs per cell:

      12 loci, peaks 6/12/19 of 0..24, mu 0.002
        valley  9.7% deep   N=10: 32%  20: 56%  40: 56%  80: 76%  160: 100%  320: 100%
        valley 15.2% deep   N=10: 24%  20: 20%  40: 20%  80: 24%  160:  36%  320:  36%

      6 loci, peaks 3/6/10 of 0..12, mu 0.001
        valley 10.0% deep   N=15: 40%  30: 60%  60: 97%  125: 100%  250: 100%  500: 100%

- **Larger N equal or better in every cell tried. Never worse.**
- Trait spread scales with N: 0.85 at N=10, 1.11 at 20, 1.73 at 80, 2.25 at 320. Valley is ~7 trait units wide, so a spread of 2.25 already has individuals on the far peak. Nothing crosses; selection just pulls.
- At a 15% valley nobody crosses at any size. The 20–36% is drift wandering, not a peak shift.
- Reason: the model is additive, so there is no valley in **genotype** space — only phenotype space, and a broad distribution walks through it. Wright needs demes + migration, or sign epistasis.
- Shifting balance is contested in the field (Coyne, Barton & Turelli 1997). Do not assert it.

**Three ways forward:**

1. **Reframe around variation, not headcount.** Recommended. You need variation to move, selection spends variation, so the hardest-selected population is the one that cannot move. `202_lec08_01` + `202_lec18_04`, and it feeds Stage D instead of fighting it.
2. **Demes + migration.** Honest Wright. Cost: spends lesson 16's argument here, and `WORK_ORDER.md` currently forbids it.
3. **Epistatic landscape** — fitness from the combination, not the sum. Reproduces Wright, real valley in genotype space. More code, harder to draw.

Taking (1) below.

## Stages

    A  one peak — climb it, watch the spread collapse
    B  three peaks — what decides whether you get off the one you are on
    C  the peak sinks as you crowd it
    D  the optimum moves, and the better-adapted population dies

### A — climbing, and what it costs

- Trait on the vertical axis, growth-rate curve on the right. Birth and death are separate controls; the curve is their difference.
- Dot cloud from 10 and 12, now spread over a trait.
- Three numbers per generation: mean trait, **spread**, headcount. The spread falls as it climbs. That is the stage.
- Price readout returns with the within term doing real work — an offspring is built from two parents and lands nearer the mean. Regression to the mean, i.e. lesson 8's material as one of the two terms.

### B — three peaks

- Controls that matter are the ones governing **variation**: headcount, how hard selection pushes (peak width), mutation rate.
- Finding to engineer: **widening the peak — selecting less hard — gets you to the top; cranking selection up pins you.**
- Keep a headcount control and let it not do what the student expects. `LESSON_STYLE` §5.

### C — the peak sinks as you crowd it

- Landscape becomes a function of where the population is; the right-hand curve redraws every generation.
- `202_lec16_05` is exact: *"the fitness function changes because of the fitness function."* Pupfish as framing.
- Hardest stage to gate — the target moves while they aim. Suggested gate: **hold two peaks at once for N generations**, only possible when crowding is strong enough that neither wins. Sweep before committing.

### D — specialisation, evolving to extinction

- Phase 1: 300 generations on a peak at trait 12. Phase 2: optimum jumps to 19, headcount driven by absolute growth, ceiling 400, gone below 2. 20 runs per treatment:

                                        strong selection   weak selection
                                        (narrow peak)      (broad peak)
      trait spread after 300 gens             1.65              2.07
      lowest headcount after the move            3               105
      headcount 250 generations later           44               400
      mean trait reached (target 19)          13.8              18.8

- **25% more standing variation → 35× the bottleneck.** The strongly selected population never catches the optimum, still at a ninth of the ceiling 250 generations later.
- Nothing actually went extinct in 20 runs. Extinction needs the bar swept: bigger jump, lower ceiling, or harsher growth constant.
- Two populations side by side, same move; the student sets how hard each was selected beforehand. Task: build the one that dies.

## Real data

- `data/clean/ltee_fitness_assays.csv` / `ltee_fitness_summary.csv` — twelve populations from one clone, 50,000 generations, and the climb **decelerates**. Stage A's argument in a real record. `WORK_ORDER.md` pins the numbers already.
- Pupfish (Martin, San Salvador, scale-eaters vs generalists). **Verify the citation and whether data is downloadable before it enters `data/SOURCES.md`** — working from memory, including whether "blue holes" is the right water body. Framing without a panel is fine.

## Voice

    A  202_lec08_01  "selection destroys variation ... that's what it does"
       202_lec18_04  racehorse asymptote
    B  202_lec12_02  you can never make anything perfect
    C  202_lec16_05  scale-eating; the fitness function changes because of itself
       202_lec16_06  the horse with five mules
    D  202_lec16_02  "It does not matter if being red is bad later" — the hinge
       202_lec01_01  things just get better at not dying

## Still to measure

- Stage B, all of it. The numbers above rule out the briefed version, not in the reframed one. Sweep peak width against time-to-tall-peak for a two-sided window.
- Stage C: whether a two-peak occupancy gate is reachable, and over what crowding range.
- Stage D: settings where the strongly selected population genuinely dies rather than limping.
- How many loci. 6 is coarse and jumpy, 12 is smooth and slow. Pick on what reads on a canvas, then re-measure.
- Whether the Price readout is legible at this lesson's headcounts. Clean at 400, not at 40.

## Do not

- Assert Wright's shifting balance.
- Sum `cov` and `within`.
- Use relative fitness anywhere here — the normalisation is what makes extinction impossible.
- Add migration for Stage B without deciding it is worth spending lesson 16's argument.
- Take lesson 15 or anything above it as precedent.
- Pick a bar by eye.

## Open for JM

1. Stage B reframe (variation, not headcount) or one of the two honest Wright builds.
2. Must extinction actually happen in D, or is "crashed to 3 and never recovered" the lesson?
3. Pupfish citation and data.
4. Are C and D one lesson or does this split again? C is the most expensive thing in either doc.
