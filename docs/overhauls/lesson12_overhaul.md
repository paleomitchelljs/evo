# Lesson 12 — selection at one locus, and the two terms

**File** · `app/lessons/lesson12.html` — rebuild from zero
**Checks** · `node scripts/check_lesson12_numbers.js` (to write) · `python3 scripts/check_lessons.py`
**Status** · plan only, no edits made
**Last touched** · 2026-09-22

First of a pair with 13. Shared spine is here; 13's doc points back.

## The pair

- **12** — one locus, discrete alleles, **relative** fitness. What selection is, dominance, the two terms.
- **13** — one continuous trait, a landscape, **absolute** birth and death. Headcount can fall.
- Why that axis: normalised bars mean something always has the top rate, so the population can never die. Specialisation / evolving-to-extinction is unbuildable in 12.
- Birth and death stay separate controls in both, never folded into one rate.

## Price thread

- On screen: `cov(w,z)` = who made more copies, and did it track the trait. `E(w·dz)` = did the copies come out like the parent.
- `priceTerms` exists in lesson 10 and lesson 11, **called by neither**. Never run. Check it against a hand computation, not a previous lesson.
- Never sum the two. `WORK_ORDER.md`.
- Measured — 400 individuals, 12 additive loci, steady push, 120 generations, per parent (`w` = offspring count, `dz` = mean offspring trait − parent):

                              cov(w,z)/w   E(w·dz)/w   change    trait went
      inherited                  0.0941      0.0051     0.0992   12.00 -> 23.90
      re-rolled each generation  0.2905     -0.2890     0.0015   12.00 -> 11.77

- Identity exact every generation, machine precision, both runs.
- The re-rolled row has **3× the covariance and goes nowhere**. Painted flowers `202_lec16_01`, puppy tails `202_lec15_05`.
- Covariance is larger there because that population keeps its variance; the inherited one spends it climbing. Racehorse asymptote `202_lec18_04`, and the hinge into 13.

## Protect

- The **three-bar fitness panel**: draggable, coloured off lesson 10's dot cloud, tallest normalised to 1.00, `s` and `h` printed as read-offs. Nothing typed, nothing named.

## Parameterisation

- JM wrote `wbb = s`. Read as `1 - s` — `s` makes a neutral allele lethal at `s = 0`. **Confirm.**
- Bars primary, not two sliders. `(1, 1-hs, 1-s)` pins the yellow homozygote at the top, so no stable point above 0.5. Measured:

      bars (yellow/het/purple)   behaviour   settles at
      0.909 / 1.000 / 0.818      stable        0.333
      0.900 / 1.000 / 0.900      stable        0.500
      0.800 / 1.000 / 0.950      stable        0.800
      1.000 / 0.850 / 1.000      unstable      0.500
      0.950 / 0.800 / 1.000      unstable      0.429

- Two sliders reach rows 1, 2, 4. Three bars reach all five. Row 5 is the one worth having.

## Current lesson12.html

- Retired form throughout: radio predictions, explore trackers, Haldane on the page, haploid approximation, `p₀` as a slider label. No precedent for anything.
- Keep only the pinecone quote `202_lec16_03`.

## Stages

    A  lesson 10's extinction game + one slider tying the allele to net growth
    B  three bars — relative fitness by genotype
    C  the middle bar — how long a bad allele lasts
    D  the two terms, side by side

### A — the correlation slider

- Lesson 10 Stage A furniture unchanged. One new slider. At zero it **is** lesson 10.
- The slider is the covariance term. Two readouts: what you set, and what was measured off the generation that ran. They disagree, and disagree more in small populations. `202_lec11_01`.

### B — three bars

- The A slider becomes three explicit heights.
- Task: **find two sets of bars giving the same trajectory.** 1.00/0.95/0.90 = 0.60/0.57/0.54.
- Ten dealt rounds, ending frequency + expected error, silent last-five-beats-first-five bit.

### C — the middle bar

- Generations for purple to go 0.10 → 0.01, deterministic:

      s      h=0    h=0.25   h=0.5   h=1
      0.02   4618     444      239    124
      0.05   1846     177       95     49
      0.10    922      88       47     24
      0.50    183      17        9      4
      1.00     90       8        4      1

- Factor of **38** at `s = 0.10` between middle bar bottom and top.
- One generation of change at `s = 0.10`:

      p=0.50   h=0: -0.0128    h=0.5: -0.0132   h=1: -0.0135
      p=0.10   h=0: -0.00090   h=0.5: -0.0045   h=1: -0.0083
      p=0.01   h=0: -0.0000099 h=0.5: -0.00050  h=1: -0.00098

- **The middle bar is worth ~6% when the allele is common and two orders of magnitude when it is rare.** Build the targets on that crossover.
- Readout: share of purple copies in heterozygotes = `1 - p`. 50% at p=0.5, 90% at 0.1, **99% at 0.01**.
- Four target pictures:

      gone inside 30 generations                     middle bar low
      still there at 200, nearly all in heterozygotes middle bar at the top
      settles somewhere, either start                middle bar above both ends
      0.49 and 0.51 end at opposite walls            middle bar below both ends

- Shapes 3 and 4 need the middle bar **outside** the ends. Sweep to confirm.
- Lesson 10 reserved this as *"share a line in purple -> selection."* A line through three points is `h = 0.5`.

### D — the two terms

- Two populations, same push, same bars: left inherited, right genotype re-rolled each generation.
- Three measured numbers under each: covariance, within, change that happened.
- Student's job: produce a state where selection is demonstrably happening and the frequency does not move.
- `buildArrows` diagram: genotype → net growth, and parent → offspring. First arrow alone is the painted field.

## Inherited with no new code

- `makePool(rng, pop, {share})` — lesson 10's comment: *"`share` is the whole selection hook."* Pass `share: (pop,i) => W[purpleCopies(pop,i)]`.
- `breedFreq` gains one argument. `p*(1+s+s*p)/(1+2*s*p)` is already `w = (1, 1+s, 1+2s)`, i.e. `h = 0.5`.
- `buildArrows`, `wireBowling`, `wireGame`, `mountLock`, palette, canvas helpers.
- `copy` (mutation) stays wired at zero.

## New

- Three-bar panel · correlation slider with set-vs-measured pair · heterozygote-share readout · `priceTerms` on screen for the first time · birth and death shown separately.

## Extraction

- This is the **third** caller of the core operator, 13 is the fourth. `WORK_ORDER.md`'s rule fires.
- Build both lessons against their own copies first. Extract to `pop.js` as its own pass afterwards, with all four bar-check suites as the regression test.

## Real data

- Huntington's `w = 0.97`, `h = 1`, `s = 0.03` (`202_lec17_04`). Straight into the bars. Lethal and barely selected.
- `data/clean/ltee_allele_freqs.csv` for a sweep panel if wanted. No heterozygotes there — say so. Fails soft.

## Voice

    A  202_lec16_03  pinecones (keep from draft)
       202_lec11_01  selection is the correlation, drift is the scatter
    B  202_lec16_02  the bears are coming and it does not matter
       202_lec17_04  Huntington's is 3% bad
    C  202_lec18_01  dominant/recessive are an outcome of context. "That's the rule."
       202_lec18_02  hummingbirds and bees — best quote in the corpus for this lesson
       202_lec13_04  "Recessive is the word we use when something doesn't matter as a heterozygote"
    D  202_lec16_01  painted flowers
       202_lec15_05  puppy tails

## R panel

    w  <- c(yy = 1, yp = 1 - h*s, pp = 1 - s)
    p  <- p0
    for (g in 1:gens) {
      wbar <- (1-p)^2*w["yy"] + 2*p*(1-p)*w["yp"] + p^2*w["pp"]
      p    <- (p^2*w["pp"] + p*(1-p)*w["yp"]) / wbar
      p    <- rbinom(1, 2*N, p) / (2*N)
    }

## Still to measure

- Stage C: settings clearing each shape; **zero** settings with the middle bar between the ends may clear 3 or 4.
- Whether any one setting clears two shapes.
- Unstable case under drift: how close to the threshold before the coin flip decides instead of the bars. Probably a problem at N=50.
- Stage A: spread between set correlation and measured covariance, vs headcount.
- Stage D: generations of averaging needed for the contrast to be legible. Clean at 400 individuals, not at 40.
- What the panel prints when `h` goes 0/0 at `s = 0`.

## Scoring

- `version: 1`, one bit per stage + A's silent bit. Every declared bit must be written or `check_lessons.py` fails the page.

## Checks

- Prove these do **not** work: cranking `s` to its stop · middle bar left at the midpoint · a large population · one constant across the closing rounds.
- Printed `s` and `h` must reproduce the trajectory the simulator walked.

## Rulings

- **JM 2026-09-22** — ancestry keeps lesson 11.
- **JM 2026-09-22** — two selection lessons, built in tandem, each connected to Price, each keeping birth/death explicit.

## Do not

- Take the current `lesson12.html` as precedent.
- Sum `cov` and `within`.
- Name the coefficients, the equilibrium, the two kinds of non-additivity, or Haldane where a student reads. Lesson 9 is the precedent.
- Add migration or a second population.
- Extract to `pop.js` before the stages work.
- Pick a bar by eye.

## Open for JM

1. `wbb = 1 - s` or literally `s`?
2. **Slot 13 was mutation–selection balance** (pink katydid `202_lec17_03`, `µ/HS`). The pair displaces it. Recommend one foreshadowing bullet in Stage C; decide the rest later.
3. The 12/13 split — relative vs absolute, one locus vs one trait.
4. Is Stage A's near-repeat of lesson 10 Stage A economical or filler?
