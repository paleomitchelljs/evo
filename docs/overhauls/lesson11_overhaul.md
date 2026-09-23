# Lesson 11 — overhaul

**File** · `app/lessons/lesson11.html`
**Checks** · `node scripts/check_lesson11_numbers.js` · `python3 scripts/check_lessons.py`
**Status** · five stages; A, B, C, E rebuilt 2026-09-22; prose still owed
**Last touched** · 2026-09-22 (round 2 done)

## What the lesson is

Inbreeding and F. JM, 2026-09-22: *"The core of it is ok, but the interactives,
gates, and 'games' are out of date with the new style."* Restructured from five
stages to four. The thing worth protecting is that **F is one number to the
student** — see Rulings.

## Stages as they stand

    A  heterozygosity, and what inbreeding does to it   (updated old A)
    B  F over time on a real herd: drift + bottlenecks  (new; old C's job,
                                                         old lesson-10-D's data)
    C  the pedigree: set a founder's two alleles by colour, drop them down
                                                        (old B, new mechanics)
    D  set a pedigree's inbreeding, predict the F curve, run it, find out (new)
    E  one founding pair traced down (descent.html's engine): F as the shaded
       share of a genome whose two copies come from one founder copy (new)

Retired: old D (inbreeding depression — load vs genome size) and old E (the
coalescent walk backwards). Both are in git history. Old E's payload — two
published constants giving ≈20,000 against eight billion people — is worth
rescuing into a later lesson.

## Items

| # | Stage | What | Status |
|---|-------|------|--------|
| 1 | — | strip all four stages to bare-minimum text | done |
| 2 | A | pond/bars/F kept, restyled to the predict card + five-round game | done |
| 3 | A | numeric-estimate game dropped; the gate is landing a dealt F | done |
| 4 | B | herd built from birth/death sliders with density dependence | done |
| 5 | B | loci drift through the trajectory; F = 1 − H_t/H_0 plotted under it | done |
| 6 | B | crashes visible in F; the herd must also survive to count | done |
| 7 | C | click a founder, pick its two alleles by colour, drop them down | done |
| 8 | C | pedigree generated with an inbreeding knob; its own F reported | done |
| 9 | D | deal a mating rule → draw the F curve → lock → run → verdict | done |
| 10 | — | `check_lesson11_numbers.js` rewritten: 22 bars, all pass | done |
| 11 | — | `Score.init` at version 6, scaffold 4, one bit per stage | done |
| 12 | — | **prose pass** — every stage is at bare-minimum filler by design | partial 2026-09-22: A/B/D bullets trimmed, solvedA rewritten off AA/aa |
| 13 | — | decide whether the retired old-E payload (≈20,000 against eight billion) lands in a later lesson | todo |
| 14 | C | the generated tree has no funnel; decide whether it wants one, and measure what it buys | todo |
| 15 | A | bowling: card draws the target (heterozygotes if pairing were random vs wanted); Go → controls lock, 15 generations animate, verdict | done |
| 16 | B | bowling: same two-bar picture against the founders; Go → herd and F reveal year by year, verdict | done |
| 17 | C | bottom panel → each founder allele's frequency by generation + F by generation (15 drops faint, mean bold); target drawn in the card as a row of boxes | done |
| 18 | — | "two-tone" → "heterozygote", "pond" → "population", "birds/chicks" → "individuals/offspring"; identifiers too | done |
| 19 | E | new Part E: descent framework, closed pedigree from one pair, no outsiders (no-migration ruling), no new mutations. Target = share of the bottom row's chromosomes whose two copies trace to the same founder copy; Go adds generations one at a time | done |
| 20 | — | "A inbreeding does not push the allele frequency" fails on the unedited page: a 2-SE test on 8 fixed seeds. Widen to 30 runs, 3 SE | done |
| 21 | — | `Score.init` version 7, scaffold 5; E1 bit; checks for E | done |

- JM 2026-09-22: A and B → bowling with graphical targets, not number tables; C's bottom panel → founder-allele frequencies + F through time; Part E from `descent.html`.
- E drops `descent.html`'s outsiders: they are migration, which the 2026-09-17 ruling keeps out.

## Measured, 2026-09-22 round

- E, one chromosome per genome: bottom-row F wobbled ±0.10-0.19 run to run; unaimable. Four chromosomes, ~1 crossover each: ±0.05-0.10. That is why E's genome is four chromosomes end to end.
- E, 200 runs a setting: two generations after the founders = F 0.25 whatever the settings; six generations = 0.40 (8 a generation, random partners) to 0.68 (2 a generation).
- E targets were 0.40/0.52/0.64: the opening setting (4, 2 generations, 0.26 ± 0.07) landed 0.40 15% of the time. Moved to 0.44/0.56/0.68, generations slider to 7. Now 3%; best-setting hit rates 75/75/63%.
- E shading vs the pedigree's own kinship F: no bias. 2000 runs a setting in a standalone copy: mean differences +0.003/+0.001/−0.001, all under 2 SE. The page check is paired, 40 runs, 3 SE; one load read −0.028 ± 0.010, which is chance at that size.
- "A the knob runs one way" used 5 runs a setting and swapped f = 0 and 0.2 on one load in four; now 12.
- Check "B two different herds reach the same F" failed 1 page load in 3 before this round touched B: it depends on the per-student bad years. Searched on a finer grid now.
- Check "A inbreeding does not push the allele frequency" was 8 runs at 2 SE; widened to 30 runs at 3 SE (mean shift now −0.007 against a spread of 0.11).
- Card pictures are 460 px: `setupCanvas` pins a canvas to its width attribute, it does not fill the panel.

## Rulings

- **2026-09-22 — there is only one F.** JM: *"the students ONLY know F — we
  will not introduce Fst until later and we won't dwell on different Fs."*
  So the page says **F** and nothing else. No F_ST, no subscripts, no stage
  that exists to separate two F's. The old Stage C ("two numbers that are not
  the same number") is retired on this ruling, not lost by accident.
- **2026-09-22 — Part B plots F = 1 − H_t/H_0**, heterozygosity lost since the
  founders. That is the one that rises with drift and jumps at a bottleneck,
  which is what the stage is for.
- **2026-09-22 — Part D is predict-then-measure**: set a pedigree's inbreeding
  level, draw the F curve you expect from a population mating that way, run it,
  find out.
- **2026-09-17 (standing)** — no migration, no between-population comparison.
  The operator still takes one pool per parent slot so a later lesson adds an
  argument rather than a model.
- **Drafts.** JM: *"All extremely text light as drafts — EXTREMELY text light —
  with the bare minimum filler existing as we refine the interactives, 'games',
  and gates."* Interactives, gates and games are the deliverable. Prose is not.

## Do not

- **Do not write a stage, a panel or a sentence explaining that there is more
  than one F.** Two of the quantities on this page are computed against
  different references and a statistician would name them differently. The
  student sees one word. This is JM's call and it is deliberate.
- **Do not add prose to these stages while they are drafts.** If a stage needs
  explaining, the interactive is wrong.
- **Do not re-import the old Stage C.** Its point is retired by the one-F
  ruling above.
- The pedigree in C is generated, not hand-built. **The old hand-built tree's
  funnel was dropped and nothing replaces it** — see item 14. The old 52-bird
  tree had three successive single-chick funnels that made founders 7 and 8
  land in only 24–26% of drops, which was the whole of "you are related to
  fewer of your ancestors than you think". That point retired with old
  Stage B's framing, so the new tree does not need it; but if a later pass
  wants it back, it is a shape to build in deliberately, not an accident to
  restore.


## What was measured, so it is not re-derived

All of this came out of `check_lesson11_numbers.js` or the calibration runs
behind it. Numbers here are the reason the constants are what they are.

**A.** F after fifteen generations runs 0.00 at f = 0 to 0.95 at f = 1, with a
run-to-run sd of 0.03–0.09. `A_TOL` is 0.09 because anything tighter is luck.
The lowest target is 0.20, not 0.12: f = 0 produces 0.00 ± 0.05 on its own, so
a target of 0.12 was landed by the opening setting about half the time — the
misconception clearing its own gate.

**B.** A hard ceiling on the herd was not enough; births had to slow as the
herd fills, so that `N* = K(1 − d/b)` is what the sliders actually set.
Measured against the herd at year 120: N* 2000 → 2010, 938 → 937, 500 → 485,
250 → 234. And the run is 120 generations, not 60, because **F is a sum**: at
sixty the best F reachable with a live herd was 0.11 whatever the sliders did.

**C.** Three things, each of which broke the stage once:
- A *deterministic* avoidance rule ("mate the least related") builds a
  **regular** pedigree that recycles the same pairings and comes out **more**
  inbred than a mixture — the knob read backwards at its own low end in every
  tree size tried. Drawing from the least-related quarter fixes it: 0.13 →
  0.13 → 0.16 → 0.21 → 0.26 → 0.35, monotone over three independent sets of
  fourteen trees.
- **One drop is not the number.** The same tree and the same founders give
  13.7 ± 2.7 two-tone birds over twenty drops against a tolerance of 1.5, so
  the verdict is the average of fifteen drops (which repeats to ± 0.83).
- The reachable fifteen-drop averages are 0, then 4, 5, 6, 6.5 … 15.5.
  **Nothing between 1 and 3 exists**, so no target sits there.

**D.** The student draws, *then* the pond runs, so the gate has to clear the
pond's own variability and not just the curve family's fit error.
- A power-law family **cannot reach its own deals** — best case 0.13–0.16
  against a tolerance of 0.10. The family is now `F(t) = 1 − (1−F_end)^(t/T)^b`,
  which is the shape drift actually makes.
- The verdict is the **root-mean-square** gap over all forty generations, not
  the single worst one: a curve that describes the run and misses one wobble
  is a good curve.
- Small ponds are not aimable. A curve fitted to one run of sixty breeders
  scored inside tolerance on only half the fresh runs. All three deals are
  now 250+ breeders.
- **Three settings, each dealt about twice, never twice running.** Six
  different settings over five rounds gave the student no way to calibrate —
  every round was a cold guess at a pond they had never seen.

## A bug this turned up in lesson 10

`Score.finish()` is never called on completion. Nothing calls it: the re-mint
guard inside `record()` only fires when the last gate is *already* done, and
`recordCheckpoint` does not mint. So the done banner appeared saying "your
completion code is below" with nothing below it, and no error anywhere. It
dates from 2026-09-21, when Stage E was cut and the guard moved to `Gates.D`.
Fixed in both lesson 10 and lesson 11, in `unlockNext`.
