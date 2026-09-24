# Lesson 11 — overhaul

**File** · `app/lessons/lesson11.html`
**Checks** · `node scripts/check_lesson11_numbers.js` · `python3 scripts/check_lessons.py`
**Status** · five stages; B rebuilt 2026-09-23 (round 3); C's tree redrawn as matings (round 4); D rebuilt as heterozygosity-to-zero (round 5); `version: 9`; prose still owed; locked
**Last touched** · 2026-09-24 (round 6, then D and E rebuilt from JM's notes; 56 bars pass)

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
    D  alleles at the start (2-20), individuals, F; 200 populations run until
       one allele is left; the target is a fixation-time SHAPE on the dot
       strip; hit = average and spread both near it. Ne and 4Ne live
                                                       (rebuilt 2026-09-24)
    E  one founding pair traced down (descent.html's engine), mates from
       outside with no founder SNPs; target = founder SNPs left in the
       bottom row                                      (rebuilt 2026-09-24)

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
| 37 | C | slider label "matings between relatives" could say what the rule is: "probability a mate is its closest relative" (parallel to D). Not asked; offered | closed by 61: JM chose "inbreeding" |
| 38 | D | **rebuild (round 5).** Heterozygosity over time; sliders: alleles at the start, individuals, F; 200 populations run to one allele; dot strip of the generation each got there; Ne = N/(1+F) and 4Ne live, with Ne and F measured in the runs beside them after a run | done |
| 39 | D | F must be HELD by the mating rule, not set once: a starting F under random mating does nothing (measured) | done — flag to JM |
| 40 | D | mating rule that holds F: partial selfing, s = 2F/(1+F). Full-sib rules measured and rejected (see Measured, round 5) | done — flag to JM |
| 41 | D | JM's fourth slider (generations) dropped: every population runs to one allele, since an average of times needs every run to finish | done — flag to JM |
| 42 | D | five rounds, fixed ladder, per-student targets; each round holds the alleles and one of individuals/F. Bowling shape (dealt generation, student builds the population), not "call the generation for a dealt population" — see Measured | done — flag to JM |
| 43 | — | `mountRounds` picture mode also renders `rows` as a table above the picture (no other stage passes `rows`) | done |
| 44 | — | checks for D rewritten (15 bars); `Score.init` version 9 | done |
| 45 | D | old D's `popStep` operator no longer used by D; `popHo` kept with the operator | done |
| 46 | D | no voice block and a bare "Stage E is open." banner, like B and E: prose owed | todo |
| 47 | all | **plots overflow their panels** (A, B, D plots and every Predict-card picture): sim.js's `setupCanvas` pins the declared width. Port lesson 10's measuring override; C's pedigree opts out (JM: its scroller "works great") | done |
| 48 | D | y axis was "heterozygosity if pairing were random" (1 − Σp²). JM: plot the actual heterozygosity under the held F → share of individuals heterozygous, counted | done |
| 49 | E | "copy" → "allele" on screen: legend, bullets, hover readouts | done |
| 50 | E | new tracker under the card: founder alleles (the dots) left, by generation, and π (mean dot differences between two genomes in a row); earlier runs faint | done |
| 51 | — | checks: D's plotted line sits at (1 − F) of random pairing's; E's tracker = brute force, never rises, founders 12 / 6, π = 6(1 − mean kinship of the row's genomes); every plot fits its panel at 1500/1100/900 | done — 52 bars |
| 52 | C | a click on the pedigree that missed every founder blanked the tree (`C_layout` called `setupCanvas`, which clears). Found in passing | done |
| 53 | D | counted heterozygosity is a scribble at 25-80 individuals: bold line = average of all 200 (a finished population counts 0) | done — not asked; flag to JM |
| 54 | D | "every copy" / "every copy different" left as is: JM's copy→allele note was about E, and D's "copy" is a gene copy, not a founder's allele | open — ask JM |
| 55 | B | headcount drawn as one point per generation joined by lines, not flat steps; shading kept; brush unchanged (JM 2026-09-24). Point at the middle of its generation's column, so it sits under the pointer and above the F it makes | done |
| 56 | A, C, E | practice switch on every stage, B's pattern (JM 2026-09-24: "a default incorporation for all of the 'bowling' style activities"). C's button reads "Practice drop". Check drives all five stages' real buttons: 53 bars | done |
| 57 | A | prose from JM's dictation (2026-09-24): voice + mutation clause, a goal paragraph in the voice block (lessons 7 and 9 put theirs there), his three setup bullets; F bullet kept, practice bullet dropped (his paragraph says it) | done |
| 58 | B | intro replaced with JM's text (2026-09-24) as a voice block; three old setup bullets kept for what it does not say (how to draw, what the bottom plot shows, nothing chosen but the headcount); practice bullet dropped (his text says it). His F sentence reads "observed / expected"; B plots 1 − H_t/H_0, so "expected" is the starting population. JM: "the text doesn't need to be hyper correct"; B's quantity is F (loss from the founders), so it keeps the name | done |
| 59 | C | voice → JM's dictation (2026-09-24): alleles not genotypes, a 50-50 shot at meiosis, the pedigree's shape, equal expected offspring | done |
| 60 | C | "Drop it down" → "Pass it on" (bullet, button, card prompt); on-screen "drops" → "runs". Identifiers (`C_drop`, `C_DROPS`) kept | done |
| 61 | C | slider label "matings between relatives" → "inbreeding" (JM); the readout's echo of the slider dropped, so "inbreeding" is not printed beside the tree's own inbreeding with a different value. Closes 37 | done |
| 62 | C | **family sizes vary**: each child goes to a couple drawn at random (equal expected family, unequal realized, some childless); was as even as the row allows (4 / 2 / 2 / 2-3). Childless couples drawn as a joined pair with no sibship | done |
| 63 | C | **New tree** button: another tree at the same inbreeding (JM: "a set of 4 or 5 sibling pairs in each generation that they can be chosen among" -- generated instead of preset) | done |
| 64 | E | check "the default setting is not an answer" flaked (10% against < 10%): true rate 2.3-2.8% on 0.44, and 40 runs read 4 hits about one load in fifty. Now 200 runs | done |
| 65 | D | voice → JM's text (2026-09-24): the moose, 200 genetic states, heterozygosity over time, predict when the alleles go extinct | done |
| 66 | D | **target = a fixation-time distribution**, drawn as a density on the dot strip and in the card; the target band and line on the plot go. Verdict: average within ±12% and spread (sd) within ±20% of the target's. Every slider free; no held rows | done |
| 67 | D | alleles at the start: 2-20, "every copy" dropped (JM: "will just be confusing") | done |
| 68 | E | target = founder SNPs left in the bottom row (not F). Mates from outside, carrying no founder SNPs (descent.html's rule: inside = closest relative, else an outsider; two new a generation, then reused). Slider → "inbreeding". Reverses the 2026-09-17 no-migration ruling for E, on JM's word | done |
| 69 | E | voice → JM's text: recombination, haplotypes not alleles, SNPs in a founding pair, trace one through the tree | done |
| 70 | D, E | checks rewritten for both games | done |
| 71 | E | targets are WINDOWS of counts with gaps: none / 2-4 / 11-12. Point targets 0±1 and 3±1 touched, and a setting leaving ~1.5 cleared both half the time | done |
| 72 | E | outsiders sit in their generation's row with no parents: `E_matings` threw on them, so every tree with an outsider failed to draw (the practice check caught it; the build-only checks could not) | done |

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

## Measured, 2026-09-24 round 6

- Overflow before the fix, canvas right edge past the panel's content edge: 1440 window +4 px (680-wide plots); 1280 +15; 1100 +99 to +119, card pictures +56. After: none over at 1500, 1100, 900 (the check resizes its own iframe).
- C, missed click: 42,704 inked pixels → 0.
- D, counted over random pairing's from generation 10: 1.009 / 0.510 / 0.102 / 0.720 at F 0 / 0.5 / 0.9 / 0.3. Ne stays measured on random pairing's average: the counted line drops by (1 − F) over the first few generations and a log-slope through that drop reads the wrong Ne.
- D, counted can start above 1 − 1/k (two alleles, ten individuals: seven heterozygotes is 0.7); the y axis clears the traces drawn, and traces are clipped to the frame.
- E, π against 6(1 − mean kinship of a generation's genomes): no bias. 400 runs at 8/6/relatives always, −0.027 ± 0.036 and −0.040 ± 0.036; 120 batches of 40, z −2.6 to 2.2. The first check run drew z = −3.7 at 40 runs, 3 SE, the four settings sharing seeds and so site layouts; now per-setting seeds, 80 runs, 3.5 SE.
- E, the founders read 12 alleles and π 6.00 by construction: four genomes, three dots each, any two differ at six.

## Measured, 2026-09-24 — C's families

- Rule: each child goes to a couple drawn at random (row sizes fixed at 16/16/16/20). Family size by generation, 200 trees: mean 4 / 2 / 2 / 2.5, variance 3.2 / 1.7 / 1.7 / 2.2, range 0-10, childless 2% / 12% / 11% / 6%. Same at inbreeding 0 and 1.
- Relatedness does not set family size: 300 trees at 0.6, full-sib couples 0.982 of the row's mean against 1.014 for others; per tree −0.031 ± 0.016.
- Tree's own inbreeding, 0 → 1 by 0.1 (40 trees each): 0.089 0.100 0.107 0.126 0.144 0.170 0.190 0.214 0.247 0.297 0.336. Was 0.063 → 0.500: with uneven sibships not everyone has a sib to pair with, so full-sib lines stop closing. Floor up because uneven families make kin.
- One page's readout up the slider, 60 pages: median of 15 trees fell > 0.02 on 4 (largest 0.061); of 25, none (largest 0.009). `C_CAND` 25.
- Checks on the new tree: every target reachable (5→5.3 … 13→13.0), founders still out-move the slider (0.0-11.5 vs 10.3-15.5).

## Measured, 2026-09-24 — D's shape game, E's SNPs

- D, spread relative to average by alleles at the start (1000 populations): 2 → 0.745, 3 → 0.65, 4 → 0.62, 6 → 0.58, 10 → 0.575, 20 → 0.55. Shape separates two alleles from many, little else.
- D, one run of 200: average ±4-6%, spread ±9-11% (sd, middle half, middle 80% all alike). The limit is 200, not the statistic.
- D, verdict ±12% average, ±20% spread. Three target samples × 20 runs: own setting 85-98%; 2 against 20 alleles at the same average 8-23%. At ±15% spread, own fell to 68% on one target. One page load: own 75-100%, wrong count 5-40% (pooled 20%); the check holds the gap (≥ 0.3), not a ceiling.
- D, targets (k, Ne): (20,25) (2,35) (20,45) (2,62) (6,65) (3,20) → averages ~63, 92, 97, 160, 168, 236; windows never meet three deep. 600 populations a target, 0.05-0.55 s to build, once.
- E, founder SNPs left, one run: ±1-2 at a setting. More inbreeding keeps MORE (4 a generation, 5 generations: 1.1 / 4.6 / 6.6 at inbreeding 0 / 0.5 / 1) — outsiders carry none, so breeding out dilutes them. The reverse of "inbreeding loses diversity" as a student may read it; flagged to JM.
- E, windows none / 2-4 / 11-12 over the grid (60 runs a setting): best 92 / 75 / 93%; 34 / 148 / 45 settings ≥ 40%; no setting's second-best target above 33%; opening setting (7.5 ± 1.8 left) 0 / 5 / 3%.
- E, pi = 6(1 − mean kinship) still holds with no outsiders (inbreeding 1); with outsiders a genome can trace to no founder and the identity has another term, so the check runs at 1 only.

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
- **2026-09-24 — D plots the heterozygosity the population has.** JM: *"Why
  is the y axis labeled 'heterozygosity if mating were random'? Shouldn't it
  be the actual simulated heterozygosity for a given population size & level
  of pedigree-derived inbreeding?"* Counted heterozygotes, not 1 − Σp².
- **2026-09-24 — E says "allele", tracks the dots and π.** JM: *"I would like
  something that tracks the number of unique alleles over time (that is, the
  dots). Something that shows how the total diversity (pi) changes through
  time would be a valuable bridge forward. Also why 'copy' and not 'allele'
  for the labels?"* The page does not print π = 6(1 − kinship): that is a
  second F on screen. The check holds it.
- **2026-09-24 — D's target is a shape.** JM: *"I'd like to show a target
  fixation time distribution ... they are trying to basically make a set of
  dots that matches that density plot."* Judged on average and spread.
- **2026-09-24 — E has mates from outside, and targets founder SNPs.** JM:
  *"Mates from outside should just have no SNPs that we're tracking ... How
  many of the founder SNPs will there be at the end?"* This supersedes the
  2026-09-17 no-migration ruling **for E only**.
- **2026-09-17 (standing, except E)** — no migration, no between-population comparison.
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
