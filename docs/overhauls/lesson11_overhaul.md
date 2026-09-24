# Lesson 11 — overhaul

**File** · `app/lessons/lesson11.html`
**Checks** · `node scripts/check_lesson11_numbers.js` · `python3 scripts/check_lessons.py`
**Status** · five stages; B rebuilt 2026-09-23 (round 3); C's tree redrawn as matings (round 4); D rebuilt as heterozygosity-to-zero (round 5); `version: 9`; prose still owed; locked
**Last touched** · 2026-09-23 (round 5 done; 47 bars pass; four calls flagged to JM)

## What the lesson is

Inbreeding and F. JM, 2026-09-22: *"The core of it is ok, but the interactives,
gates, and 'games' are out of date with the new style."* Restructured from five
stages to four. The thing worth protecting is that **F is one number to the
student** — see Rulings.

## Stages as they stand

    A  heterozygosity, and what inbreeding does to it   (updated old A)
    B  draw how many breed each generation; F runs underneath; match an
       F curve                                        (rebuilt 2026-09-23)
    C  the pedigree: set a founder's two alleles by colour, drop them down
                                                        (old B, new mechanics)
    D  alleles at the start, individuals, F; 150 populations run until one
       allele is left; make the average land on a dealt generation. Ne and
       4Ne shown live                                  (rebuilt, round 5)
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
| 22 | A | voice → JM's text: two distinct ancestors; inbreeding makes that **less likely** | done |
| 23 | A | animation faster (260 ms a generation → ~90) | done |
| 24 | A, B, C | **targets repeated**: `(seed + i*3) % 6` only ever reaches two values. Deal five distinct per student | done |
| 25 | — | no "land"/"knob" on screen. Pips read "3 of 5 attempts, 2 successful hits" | done |
| 26 | A | "dark allele" → "purple allele"; "pale/dark homozygote" → "yellow/purple" | done |
| 27 | B | **rebuild.** No birth/death model. Student paints the population size across the top plot; F runs under it; target is an F curve; practice switch | done |
| 28 | C | **Homozygous founders** button beside Random founders | done |
| 29 | D | **rebuild.** Target is an F curve from a hidden (breeders, sib-mating) setting. Student sets both, runs, sees the run over the target. Result stays until Next target (it was wiped by the next deal). Practice switch | done |
| 30 | — | checks for B and D rewritten; A/C/E distinct-target checks | done |
| 31 | C | **Homozygous founders** → every founder homozygous for the *same* allele (blue); student adds variety by clicking a founder | done |
| 32 | C | F in a row with one allele is undefined (0/0): plot a gap, not 0; readout "—" | done |
| 33 | C | **pedigree shows matings.** Tree was 0-4 partners per individual, a third of each row never bred, 32-40 crossing lines a generation, no mark for a mating: read as asexual. → monogamous couples; a mating dot per couple, sibship bar under it, children grouped beneath their parents | done |
| 34 | D, A | slider label → "probability a mate is a full sibling" (the operator's rule: with chance f the partner is the first parent's full sib). A shares the operator and the label | done |
| 35 | — | C checks re-run on the new tree; homozygous-founders check rewritten; pairs-once and one-page-readout checks added; "one drop" check moved to mid-range founders | done |
| 36 | C | pedigree canvas 900 → 680 px: it was wider than its panel, so the right-hand family was cut off with no visible scrollbar on a Mac | done |
| 37 | C | slider label "matings between relatives" could say what the rule is: "probability a mate is its closest relative" (parallel to D). Not asked; offered | todo |
| 38 | D | **rebuild (round 5).** Heterozygosity over time; sliders: alleles at the start, individuals, F; 200 populations run to one allele; dot strip of the generation each got there; Ne = N/(1+F) and 4Ne live, with Ne and F measured in the runs beside them after a run | done |
| 39 | D | F must be HELD by the mating rule, not set once: a starting F under random mating does nothing (measured) | done — flag to JM |
| 40 | D | mating rule that holds F: partial selfing, s = 2F/(1+F). Full-sib rules measured and rejected (see Measured, round 5) | done — flag to JM |
| 41 | D | JM's fourth slider (generations) dropped: every population runs to one allele, since an average of times needs every run to finish | done — flag to JM |
| 42 | D | five rounds, fixed ladder, per-student targets; each round holds the alleles and one of individuals/F. Bowling shape (dealt generation, student builds the population), not "call the generation for a dealt population" — see Measured | done — flag to JM |
| 43 | — | `mountRounds` picture mode also renders `rows` as a table above the picture (no other stage passes `rows`) | done |
| 44 | — | checks for D rewritten (15 bars); `Score.init` version 9 | done |
| 45 | D | old D's `popStep` operator no longer used by D; `popHo` kept with the operator | done |
| 46 | D | no voice block and a bare "Stage E is open." banner, like B and E: prose owed | todo |

- JM 2026-09-22: A and B → bowling with graphical targets, not number tables; C's bottom panel → founder-allele frequencies + F through time; Part E from `descent.html`.
- JM 2026-09-23 (round 3): *"a careful student should be able to visually inspect something and intuit the main point in a few tries — and then evaluate how well they can apply that intuition. The current lesson 11 largely relies on evaluating how well a student understands what's going on before even attempting the activity."* B: *"built to test if a student already understands births/deaths/F instead of existing to build intuition"*. D: *"no visual feedback, they just adjust a curve and see numbers 5 times until finally a line to compare to their curve is revealed."*
- D's missing feedback was partly a bug: non-picture `mountRounds` deals the next round inside `submit()`, and `onDeal` clears `D.truth`. The comparison line was drawn and erased in one tick.
- E drops `descent.html`'s outsiders: they are migration, which the 2026-09-17 ruling keeps out.
- JM 2026-09-23 (round 4): C, *"I'd like the 'homozygous founders' button to put a single allele fixed at the top--that is, all founding individuals are homozygous for the same allele, and you can add diversity by clicking and manually editing."* C's tree: *"each individual in generation N seems to be connected to only a single individual in generation N-1...so where are the mates? ... It may require fixed pedigrees but I really love the target predict & the 'click to set genotype' and the visual of the alleles dropping down the pedigree."* D: *"'how often a partner is a relative': can we make this 'probability of related mates' or--if we're using a specific definition of related (cousins?) we could say that 'probability mate is a 2nd cousin or closer'"*.

## Measured, 2026-09-22 round

- E, one chromosome per genome: bottom-row F wobbled ±0.10-0.19 run to run; unaimable. Four chromosomes, ~1 crossover each: ±0.05-0.10. That is why E's genome is four chromosomes end to end.
- E, 200 runs a setting: two generations after the founders = F 0.25 whatever the settings; six generations = 0.40 (8 a generation, random partners) to 0.68 (2 a generation).
- E targets were 0.40/0.52/0.64: the opening setting (4, 2 generations, 0.26 ± 0.07) landed 0.40 15% of the time. Moved to 0.44/0.56/0.68, generations slider to 7. Now 3%; best-setting hit rates 75/75/63%.
- E shading vs the pedigree's own kinship F: no bias. 2000 runs a setting in a standalone copy: mean differences +0.003/+0.001/−0.001, all under 2 SE. The page check is paired, 40 runs, 3 SE; one load read −0.028 ± 0.010, which is chance at that size.
- "A the knob runs one way" used 5 runs a setting and swapped f = 0 and 0.2 on one load in four; now 12.
- Check "B two different herds reach the same F" failed 1 page load in 3 before this round touched B: it depends on the per-student bad years. Searched on a finer grid now.
- Check "A inbreeding does not push the allele frequency" was 8 runs at 2 SE; widened to 30 runs at 3 SE (mean shift now −0.007 against a spread of 0.11).
- Card pictures are 460 px: `setupCanvas` pins a canvas to its width attribute, it does not fill the panel.

## Measured, 2026-09-23 round

- A: the old deal `(seed + i*3) % 6` reaches two values of six. `dealDistinct` (seeded shuffle) now deals A, B, C and D. E keeps its three-target rotation.
- B, one run vs its own shape's average: 0.013-0.029 RMS. `B_TOL` 0.05. Fifteen breeders for fifteen generations hit its own target 75-80%; now 25 for 20 (90%+).
- B, crash two generations late still hits (100%); crash half as deep does not (0%). Timing forgiving, depth not.
- B, 60 generations of F cannot hold six shapes 0.10 apart; the closest pair is ~0.085. Over 1,295 drawn headcounts, 0-2 clear two targets per page, none three. The check's bar is "none clears three, ≤1% clear two".
- B, a zig-zag headcount can match a steady-line target inside 0.05 RMS (seen in a screenshot). RMS judges closeness, not shape; tightening it would fail the noise.
- D, noise: 0.015-0.039 RMS at the five settings; own-setting hit 90-100% at `D_TOL` 0.05.
- D, 1000/0.6 sat 0.068 from 100/0.5 and 142/0.5 cleared both: now 1000/0.5 (closest pair 0.099; 462-setting grid, none clears two).
- D, the wrong cause cannot fake the shape: best size-only try at 1000/0.5 misses by 0.085; best relatives-only try at 60/0 by 0.098.
- D, a run at 1000 breeders is ~100 ms (80 loci); big targets average 4 runs, small ones 24.
- C, the reachability check only tried evenly spread colours and could not reach 5 or 6 on some trees (floor 7.6). Rare-colour founder sets (m of 16 copies) reach both.
- C, Homozygous founders: F in the founders' row reads 1.0 (no heterozygotes), then drops below 0. Correct by the definition; flagged for JM.

## Measured, 2026-09-23 round 4 (C's tree)

- Old tree, one page: 0-4 partners per individual, 2-7 of each row never bred, the same pair mated twice (8 matings, 5 distinct pairs in row 0→1).
- New rule: everyone above the bottom row pairs once. With chance f the partner is the closest relative still unpaired, otherwise one from the least-related quarter. Family sizes as even as the row allows (4 each from the founders, then 2, then 2-3).
- Tree's own inbreeding, 40 trees a setting, 0 → 1 by 0.1: 0.063 0.071 0.083 0.082 0.124 0.140 0.171 0.225 0.264 0.363 **0.500** (was 0.13 → 0.35). Full-sib pairs 1% → 100%. At 1 the tree is eight closed full-sib lines.
- **One tree a setting was not monotone on a page**: one page read 0.05 0.11 0.09 0.06 0.09 0.04 up the slider's bottom half. Two causes. (1) The two branches drew different numbers of random numbers, so one changed pairing reshuffled the rest; both draws now taken every time. (2) Even coupled, a changed pairing changes kinship for every later choice: 37 of 60 pages fell by >0.02 somewhere. **The page now shows the median of 15 trees** (`C_typicalPed`): 1 page in 60 falls by >0.02, largest 0.03. At 7 trees: 3/60, largest 0.047.
- One drop, 200 drops per founder set in the target range: spread 2.2-3.1, within tolerance of its own mean 35-52% of the time. The check had read 1.5 against 1.5 because it sampled 20 drops at a founder set near the ceiling (15 of 20).
- Reachability on the new tree: 5→4.9, 7→7.1, 9→8.9, 11→11.0, 13→12.9, 6→6.0.

## Measured, 2026-09-23 round 5 (D, heterozygosity to zero)

Standalone node prototypes, 300-400 populations a setting, one locus.
- Average generations to one allele = 4Ne·(k−1)·ln(k/(k−1)) for k equally
  common alleles at the start (Littler 1975; the k → every-copy limit is the
  whole population's time back to one ancestor copy). N = 50: k = 2 → 142
  (formula 139), 3 → 162 (162), 4 → 167 (173), 10 → 183 (190), 100 → 190/200
  (199). **4Ne is the ceiling, reached only with many alleles.** Two alleles
  run out at ~2.8Ne.
- A starting F with random mating after it: 182 / 187 / 184 generations at
  F₀ = 0 / 0.5 / 1 (N = 50, k = 10, SE ≈ 5). Nothing.
- Selfing held at s = 2F/(1+F): Ne = N/(1+F) within 1-8% (N = 60, F up to 0.9);
  F measured in the runs 0.494 at 0.5, 0.590 at 0.6, 0.885 at 0.9.
- The lesson's own operator (`popStep`: pairs, two offspring each, parents
  drawn with replacement) has Ne ≈ **0.69N at f = 0** (family sizes 2 ×
  Poisson(1), variance 4) and 0.26N at f = 1, against N/(1+F) = 0.52N.
- Full-sib mating in monogamous pairs with random family sizes does follow
  N/(1+F) (0.96-1.02), but **F tops out at 0.27** when every individual that
  has an unpaired sib takes it: too few sibs to go round.
- Spread: one population's time has a coefficient of variation 0.53-0.57
  (many alleles) and 0.75 (two). At 4Ne generations 33-42% of populations
  still have two or more alleles (median ≈ 0.88 × mean). The average
  heterozygosity at 4Ne is e⁻² ≈ 14% of its start, not zero.
- Speed: 100 populations of 200, every copy different, F = 0: 0.8 s.
- **Why the game is "hit a dealt generation" and not "call the generation
  for a dealt population".** With 4Ne printed live, calling the time for a
  dealt population is reading the readout; and a practice run on the dealt
  population hands over the answer outright. Building the population to a
  dealt time keeps practice honest (the same trial-and-error B uses) and puts
  the sliders in the student's hands.
- Window ±12%, 200 populations. At ±15% the two F-lever rounds accepted
  overlapping F's (F is a weak lever: 0 → 1 only halves Ne), so one constant
  F cleared both. At ±12%: F above 0.65 in round 2, below 0.57 in round 4.
- Rounds (targets two per round, per student): 1 every copy / F 0 / individuals
  yours, 100 or 120; 2 every copy / 100 individuals / F yours, 210 or 220;
  3 two alleles / F 0 / individuals yours, 130 or 140; 4 two alleles / 120
  individuals / F yours, 250 or 260; 5 ten alleles / F 0.5 / individuals yours,
  190 or 200. Intended setting hits 90-100% (10 fresh runs each); reading 4Ne
  and stopping, F left at 0, ignoring the held F and the opening setting all
  hit 0%. Greediest single setting over 2,121: 2 of 5 on the formula, 1 run.
- Ne from the rate of loss (`neFromDecay`, the page's measured Ne): unbiased
  over 20 seeds (0.98-1.01 of N/(1+F)) but one run wobbles 4-8%; selfing at
  middling F runs a few percent under N/(1+F) at 60 individuals (0.92-0.97).
  The first version of the check took one run per setting at seeds 31 apart
  and failed on all four together.

## Rulings

- **2026-09-22 — there is only one F.** JM: *"the students ONLY know F — we
  will not introduce Fst until later and we won't dwell on different Fs."*
  So the page says **F** and nothing else. No F_ST, no subscripts, no stage
  that exists to separate two F's. The old Stage C ("two numbers that are not
  the same number") is retired on this ruling, not lost by accident.
- **2026-09-22 — Part B plots F = 1 − H_t/H_0**, heterozygosity lost since the
  founders. That is the one that rises with drift and jumps at a bottleneck,
  which is what the stage is for.
- ~~2026-09-22 — Part D is predict-then-measure~~ — superseded twice: round 3
  (match an F curve) and round 5 (below).
- **2026-09-23 — Part D is heterozygosity over time.** JM: *"it is a 'set up a
  population and predict F over time' which is, perhaps, too similar to the
  above Parts. What I am thinking is: heterozygosity over time. I am thinking
  of sliders for (1) Number of alleles at the start, (2) Population size, (3) F
  (initially), and (4) number of generations. ... run the simulation many times
  with a parameter set and show the students 4Ne via interaction as that should
  be when heterozygosity hits 0 (fixation of one allele) on average. I feel
  like the target would be for students to predict when the diversity hits 0.
  I think showing Ne as it is driven by their sliders would be good, with 4Ne
  next to it."*
- **2026-09-17 (standing)** — no migration, no between-population comparison.
  The operator still takes one pool per parent slot so a later lesson adds an
  argument rather than a model.
- **Drafts.** JM: *"All extremely text light as drafts — EXTREMELY text light —
  with the bare minimum filler existing as we refine the interactives, 'games',
  and gates."* Interactives, gates and games are the deliverable. Prose is not.

## Do not

- **Do not put Stage D back on `popStep`** (or any full-sib rule) while the
  page prints Ne = N/(1+F): that operator's Ne is 0.69N at f = 0 and 0.26N at
  f = 1. If JM wants full sibs back, the Ne readout has to become measured-only.
- **Do not give Stage D a starting-F slider** that the mating rule does not
  hold: it moves nothing, measured.

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
