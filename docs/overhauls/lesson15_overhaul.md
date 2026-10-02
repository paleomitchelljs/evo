# Lesson 15 — the bridge: coalescence and linkage through a snake game (slot pencilled: JM, 2026-10-01: "make the snake game lesson 15")

**File** · `app/lessons/lesson15.html` — Stage A playable, locked
**Checks** · `node scripts/check_lesson15_numbers.js` (to write) · `python3 scripts/check_lessons.py`
**Status** · Stage A playable (built 2026-10-01 night, game first: no stages gated, `scaffold: 0`, page locked); B, targets and scoring to come. Mutation moved to `lesson16_overhaul.md`; the linkage plan that once held slot 16 is `lesson14_linkage_plan_absorbed.md`
**Last touched** · 2026-10-02 (eighth pass)

## Eighth pass (JM, 2026-10-02): the winter card

- *"a card at the end of each season showing your snake & its genes and your snake's random mate & its genes, and your offspring and their genes. The offspring the next round starts as should have a glow."*
- Built in the pop-up, in place of the arena once the season ends (played or let play itself; not after Skip). Your snake (icon, catch or fate, two bead strings) | your mate | your young: each young's chromosome from you above the one from your mate, so a crossover shows as a mix of your two strings; the one you play next glows red. No young: the snake from another family you play next, glowing. New alleles ringed as in the pedigree.

| # | What | Status |
|---|------|--------|
| 8-1 | winter card in the pop-up | done; checked headless after autopilot seasons (5 young, the next one glowing); the side counters show only the next generation while it is up |

## Seventh pass (JM, 2026-10-02): lines for one gene copy only; glow, no boxes

- *"The pedigree should only show lines for a highlighted locus, and should show those lines up & down. Descendants/ancestors of the player should just be highlighted with a glow. We don't need a rectangle around each, just show the chromosomes"*.
- Read as: point at (or click to keep) one bead = one copy of one gene; up = where that copy came from, back to the founders; down = every copy passed on from it. Family lines, the always-on 14-copy trace, the blue tint, the player's boxes and the snake parent/young hover lines all go.
- Glow: the player's snakes red; the snakes they descend from and that descend from them pale red. Cuts the sixth pass's "K of N" readout (it described the removed trace).

| # | What | Status |
|---|------|--------|
| 7-1 | lines only for the highlighted copy, up (red) and down (blue); click a bead to keep it | done; readout says how many snakes now carry that copy (seen: 12 of 15, ten generations on) |
| 7-2 | glow for the player's snakes and their ancestors/descendants; no rectangles | done; kin saturates within a few generations, so most snakes glow pale and the unrelated ones are the exceptions |

## Sixth pass (JM, 2026-10-02, later): the game as a pop-up; grey start, one new colour a generation

- Goal: *"The main goal I want to get across is that different loci in one individual coalesce to different individuals in the past. I want to build that intuition first before we actually do coalescence."*
- Layout: *"put the game above the pedigree instead of beside"*, then *"Alternatively, having the game as a 'pop up' that covers the page could allow more freedom."* Built: the pop-up (pedigree gets the full width).
- *"showing fewer past generations and more descendants ones could work. The player character begins with a mutation at some locus, but all other loci could start as gray with one new mutant each generation chosen at random to add a color"*: PRE 10 → 3; founders all grey; no new alleles before play; the player's one at generation 0; then exactly one a generation.
- Added toward the goal (not asked; JM may cut): the current player's snake's 14 gene copies traced back, always (click any snake to trace it instead); the snakes it descends from tinted; the snake where each colour arose ringed.

**Measured** (node model, 400 games, one snake's 14 copies traced back):

        generations back   snakes holding its copies (crossover 0.1 / 0.2 / 0.5)   snakes it descends from there
        3                  3.3 / 4.1 / 5.1                                        5.6
        5                  4.0 / 5.0 / 6.1                                        7.8
        10                 4.5 / 5.4 / 5.9                                        8.5

- Different genes of one snake reach different ancestors at any rate; about half its ancestors five or more generations back passed it none of the 14. The family tree saturates at ~8 because ~10 snakes breed.

| # | What | Status |
|---|------|--------|
| 6-1 | game in a pop-up over the page; pedigree full width, bigger beads | done: arena min(100vh − 60, 96vw − 290) px, HUD/buttons in a side column (~710 px on a 1300 x 860 window); "Back to the pedigree" / "Play the next season" at winter; Esc or the backdrop closes between seasons; beads ~7 px |
| 6-2 | grey founders, PRE 3, the player's allele, then one new allele a generation | done: no new alleles before play; exactly one from generation 1 |
| 6-3 | a snake's gene copies traced back (yours by default), its ancestors tinted, each colour's origin ringed | done: click a snake to trace it, again for yours; readout "Its 14 gene copies came from K of the N snakes it descends from in generation −3" (seen: 3 of 6, 3 of 10, 4 of 10, 5 of 8); a chromosome's genes draw as a band that splits at crossovers |

## Fifth pass (JM, 2026-10-02): simpler genetics, random mating, the family always drawn, new sprites

- *"the snakes shouldn't grow"*: found in the code: bodies were laid SEG apart at each season's start, then re-laid SEG + one frame's travel apart, so every snake stretched from 113 units to ~139 (60 fps) or ~186 (30 fps) in its first seconds each season. Fix: body points resampled at exactly SEG along the head's trail (112.5 at any frame rate, checked headless).
- *"remove my idea about putting the genes directly on the snake icons"*: no allele dots in the arena.
- *"a single chromosome with 7 loci represented as a string of circles ... color coded by allele"*: pedigree beads, two strings a snake (mother's above, father's below).
- *"the player's offspring to be 'locked' as shown--so the full family tree of the player and all descendants always shown"*: lines from every descendant of a player's snake to its parents in that family, always drawn; the player's own chain bold. Hover lines stay.
- *"Mating should be random--not a player choice"*: no winter den; the fed pair at random, the player included.
- New sprite sheets (hawk, newt): four directions, two frames each (side, toward the viewer, away); the frame set picked by heading.

**Measured** (node model of `modelSeason`, one chromosome of 7 genes, 600 games):

        crossover per gap   generations   genes down to one ancestor   TMRCA   the two end genes, different ancestors   neighbours, different
        0.1                 20            0.13                         16.5    1.00                                    0.57
        0.1                 30            0.36                         22.4    0.93                                    0.74
        0.2                 30            0.36                         22.5    0.96                                    0.91
        0.3                 30            0.37                         22.3    0.96                                    0.94

- 0.1 kept: ends nearly always differ, neighbours often share: the gradient along the chromosome shows.
- At the game's present size (~15 born, 10 kept) only ~1/3 of genes reach one ancestor in 30 generations (the 80% in the first pass was 8 snakes). Not changed this pass.

| # | What | Status |
|---|------|--------|
| 5-1 | snakes a fixed length | done |
| 5-2 | no dots on snakes; one chromosome, 7 genes; pedigree beads | done; beads ~4 px (15 snakes x 7 genes in half the page); a full-width pedigree under the arena would double them: JM's call |
| 5-3 | random mating (no den, no best-fed mate for the player or the autopilot) | done; spring message names the mate's catch and why a line broke |
| 5-4 | the player's family drawn always | done: pale red to family parents, bold for the player's own line; ~everyone is family within ~5 generations, so the lines get dense |
| 5-5 | JM's new hawk and newt sheets, by direction | done: side / up / down chosen by heading, side mirrored; 12 frames, 48 colours, 34 KB (the old six were 118 KB); his side-view and top-down frames all used |

- Not re-measured: the player's edge. Most of it was choosing the best-fed mate (fourth pass); what is left is eating and dodging hawks.

## What the lesson is

- JM, 2026-10-01 (first pass): *"intro to coalescence via snake game"*; *"the point is to teach them nothing about genetics per se. He says how to read a coalescence plot. As they move through time."* (dictated; "He says" reads as "It's"). Readings linked to *"4N and 4NU [4Nμ]"*.
- JM, second pass: *"make the snake game lesson 15 and use it as the bridge. We track alleles over time, and have random mutations at loci. Maybe to start each locus has 1-3 alleles, and through play alleles end up extinct and mutation adds them (1 mutant per generation average?)"*
- *"the main goal is to build intuition, rather than strict simulation of precise parameters. By creating advantageous snakes we're lowering the effective population size. But rendered carefully, the meaning of coalescence, that the MRCA =\= the original mutator, and that loci can coalesce to different ancestors, etc should all emerge from the game itself."*
- The meta point, on the player's edge: *"the player absolutely biases the snake—and because we move to offspring the player advantage is heritable…but the effect of individual alleles on the player is nil. Which illustrates a meta point."* (heritable is not the same as genetic: the player's skill passes down the line by the game's rule, not by any allele.)

## Stages (JM, second pass)

    A  pure mutation + drift: several loci, 1-3 alleles each to start, about one new allele a generation; play, and the pedigree / genealogy builds beside the arena
    B  one locus with a good allele ("more kids per unit food"), one with a bad one ("fewer kids per unit food"); "The s and h of each allele at those two loci are shown in a diagram beside the game"; neutral loci and neutral mutation stay; "a few rounds to see linkage in action"; "a few simple questions (does the player have an advantage? Is that advantage heritable?)"

## Third pass (JM, 2026-10-01): the pedigree, food as the only limit, s in units a kid

- Pedigree: *"The pedigree should show the chromosomes for each individual, and the lines don't need to appear unless you hover over one. The player's snake in each generation should be highlighted in the pedigree though."*
- Food: *"The limitation should emerge from the food. There should only be enough food on screen for 10 snakes to produce 10 more snakes on average (+/- allowed). So if each offspring costs 2 food units, there should be 20 food units on the screen 'up for grabs'. Snakes that don't get any food die before the mating part. A pair of snakes produces a number of offspring equal to the sum of their food units divided by the units needed per kid."*
- Selection: *"The 's' value for stage B, then, should be easily interpretable in terms of units/kid—something likely only needing 1.5 units/kid"*.

**Measured** (scratchpad model of the food rule: 20 units a season, each unit to a living snake by foraging weight, the player x2; hawks 10%, their food lost; no food = dies; survivors paired at random, the player taking the best-fed mate, an odd one out has none; a pair's kids = f1/c1 + f2/c2; 1,000-3,000 games):

        rounding of a pair's part-kid   snakes a season (5th-95th)   died out in 30 seasons   loci to one ancestor in 30 seasons   player's first snake's share of the genome
        down                            8.7 (7-10)                    0                        0.78                                 0.25 (fair 0.10)
        at random (1.5 -> 1 or 2)       9.5 (8-11)                    0                        0.72                                 0.23

        units a kid, 0 / 1 / 2 copies   after 15 seasons, from 0.50   games where it rose   fixed   lost
        2 / 2 / 2   (neutral)          0.50 ± 0.41                   0.49                  0.27    0.28
        2 / 1.75 / 1.5                 0.61 ± 0.39                   0.61                  0.34    0.18
        2 / 1.5 / 1                    0.75 ± 0.33                   0.79                  0.43    0.09
        2 / 3 / 4   (the bad one)      0.34 ± 0.43                   0.31                  0.25    0.52

- Food alone holds the population at ~10 with no extinctions; rounding a part-kid at random keeps the mean nearer 10 than rounding down.
- The food rule makes drift strong: a neutral allele from 50% is fixed or lost in 55% of games within 15 seasons (an effective size of about 4 snakes). So **1.5 units a kid for the homozygote is hard to see in one game** (rises in 61% of games against 49% for a neutral one). **1.5 for the heterozygote and 1 for the homozygote** (h 0.5 in units: twice the kids with two copies) rises in 79% and is lost in 9%: visible. The bad allele at 3 / 4 units is lost in 52% against 28%.
- Only the snake's own food counts at its own cost (f1/c1 + f2/c2): a good allele helps the parent that carries it, not its mate.

## Fourth pass (JM, 2026-10-01): unlocks later; food plentiful, hawks hold the number; sprites

- Unlocks: *"by clicking on the pedigree at target points (eg mrca for some locus, original mutant for the allele, generation where allele X went to fixation at locus Y, etc) ... can also challenge the player to hit targets by play (eg keep your allele from going to fixation or something to drive intentional poor play). Im more concerned with getting the game working first, and working out scoring later."*
- *"we should have more food than the snakes need—the hawks should eat a fixed number of snakes (4/14?) to keep the population at roughly the same level. If somehow the hawks eat the only 4 snakes that got resources…Game Over!"*
- JM's sprite sheet: four hawks, four snakes, four salamanders.

**Measured, then built:**
- A truly fixed 4 a season (model, 2,000 runs x 40 seasons): game over in 20-26% at 40 salamanders, over 90% at 36 — four is a bigger share of a smaller population. "Hawks take all above 10": none.
- In the game itself, hawks spread over the season made the headcount swing 10, 20, 10, 20 (twenty snakes share the food, the hawks take ten with half of it). So the hawks come in the first 4 s and the 30 salamanders come out over 16 s: survivors eat nearly all of it, ~FOOD / 2 young a season. Autoplayed 25 seasons x 3: born 9-16 (mostly 12-15), hawks take 0-6 (2-4 usually), their count exact every season, no game over; a season ~20-30 s.
- The computer's snakes first hunted far worse than a player: a greedy scripted player ate 9-13 of 30 and had 6-9 of ~13 young. Now near-even (speed 118 / 116, turn 4.4 / 4.4, wobble 8): the player eats 2-4 against the others' ~3, and has 4-6 young, most of that from choosing the best-fed mate (every snake's catch is shown at winter).

**As built (Stage A):** arena (mouse to steer; the others hunt the nearest salamander); hawks from JM's sprites, each throwing its shadow where its snake is heading and diving (talons), a miss coming back for another snake; salamanders walk (his sprites); snakes drawn in code in his sprites' colours (a sprite cannot bend along a path or carry the allele dots on its flanks); winter den (the fed snakes in rows, the catch over each head; click a mate); pairs have f1/2 + f2/2 young (part-chick at random); three chromosomes of three genes, crossover 0.1 between neighbours, ~1 new allele a generation; ten seasons of history before play (food handed out at random); the player reborn as one of their young; game over below two fed snakes. Pedigree: each snake's two chromosome sets, the player's outlined, lines only on hover (a snake: parents and young; a gene: that copy back to the founders). Buttons: start the season, let it play itself (2x, autopilot), skip 5 generations.

## The game as dictated (first pass; transcript below)

- A square arena; green garter snakes; food is salamanders; hawks swoop across and kill a snake they hit.
- A season: eat as much as you can before winter; at mating season choose a mate; offspring *"as a function of"* food.
- Every snake carries two chromosomes, one from each parent, at random.
- Mutations: a coloured dot at one of several spots on a snake. Colours from far ends of the spectrum, alternating.
- Right of the arena: a generation tracker building the pedigree for each gene; the player's lineage shown.
- Each round the player becomes one of their own offspring at random.
- The other snakes move at random, eat, and are eaten.

## Measured, 2026-10-01 (scratchpad models of the game's population, not the game: diploid snakes, parents drawn by food, the player out-eats the others x2, hawks take 15%, the player reborn as one of their own offspring)

**The player's edge rides on whatever the player carries** (one starting copy in the player, 40,000 games):

        N    player eats   reborn as        P(that allele fixes)   neutral 1/2N   gens to fix (4N)   to loss
        10   x1            own offspring    0.049                  0.050          37 (40)            5.5
        10   x2            own offspring    0.120                  0.050          32 (40)            9.2
        10   x3            own offspring    0.168                  0.050          26 (40)            9.9
        10   x3            a random snake   0.124                  0.050          29 (40)            9.1

**Stage A at playable lengths** (2 chromosomes x 3 loci, crossover 0.1 between neighbours, 1 new allele a generation over all loci, 400 games):

        snakes   generations   loci coalesced in the window   their TMRCA   unlinked loci, different ancestors   alleles per locus   new alleles whose copies' MRCA is younger than the mutator
        8        15            0.35                           11            0.85                                 1.9                 0.61
        8        30            0.80                           17            0.96                                 1.8                 0.68
        8        50            0.96                           21            0.97                                 1.8                 0.74
        12       30            0.52                           21            0.96                                 2.0                 0.67
        12       50            0.84                           28            0.98                                 1.9                 0.73

- Coalescence, "MRCA ≠ the original mutator" and different ancestors at different loci all emerge on their own at 8 snakes and ~30 generations. The TMRCA sits below 4N because the hawks and the player shrink the effective population, as JM said.
- One new allele a generation over nine loci keeps about two alleles a locus: JM's "1-3".

**Stage B** (3 chromosomes x 3 loci: [good, neutral, neutral], [bad, neutral, neutral], three neutral; 8 snakes, h 0.5, 2,000 games):

- Starting at 50%, over 30 generations: good allele (s +0.5) 0.50 → 0.80, fixed 57% (neutral: 0.42, 24%); bad allele (s −0.5) → 0.02, lost 96% (neutral: 51%).
- **Linkage does not show as lost diversity** at this size (beside the good locus 0.142, unlinked 0.148): drift already strips diversity everywhere, and an allele at 50% sits on many backgrounds.
- **It shows in the dots when the good allele starts as one new copy** (20 generations, games where it passes 75%): the neutral allele beside it ends at 0.85 (crossover 0.02 per gap) or 0.49 (0.1); two gaps away 0.75 / 0.36; on the same snake's other chromosome 0.15 (start 0.06). Even with s = 0, an allele that happens to drift up carries its neighbours just the same: linkage is not about selection.
- But one new good copy at s 0.5 passes 75% in only 18% of games (s 1: 34%).

## To settle with JM

- **Snakes per generation:** set by the food (JM, third pass): 20 units, 2 a kid → ~10 (measured 9.5, 8-11).
- **Food rules to fix:** a part-kid rounded at random (or carried); what an odd snake out does; whether a hawk's kill loses the food it ate; the computer's snakes must forage (random walkers eat little and leave the player most of the food).
- **Stage B's costs:** JM's 1.5 units a kid as the heterozygote's, 1 as the homozygote's (measured visible); the bad allele 3 / 4.
- **Pedigree hover:** hover a snake for lines to its parents and kids; hover one dot on a chromosome to trace that locus back to its common ancestor (the coalescence plot). Player highlighted each generation; chromosomes drawn for every snake.
- **Length:** ~30 generations for coalescence to show. Play them all (short seasons), play some and fast-forward the rest (the player's snake on autopilot), or pre-simulate a past for the tracker.
- **Chromosomes:** loci on different chromosomes (for different ancestors) and loci side by side with crossovers (for linkage in B). Proposed above: three chromosomes of three loci.
- **B's good allele:** start it at 50% (selection plain to see; linkage hidden), or as a few new copies / restarted when lost as 14 B does (linkage visible in the dots).
- **The questions:** lessons gate on solving, not on multiple choice (memory: gate on solving, 2026-09-01). "Is the player's advantage heritable?" can be measured off the game: the player's line out-eats and out-breeds the rest generation after generation (a parent–offspring resemblance), while no allele does anything (A) — JM's meta point. JM's call how to ask.
- **Colours:** dots by allele id as 14 D colours alleles (golden-angle hues), not a new palette (CLAUDE.md §5).
- **4N and 4Nμ:** print only beside readings the game is long enough to reach; measure first.

## Sources (not constraints)

- `app/interactives/descent.html`: one pedigree, coalescence by position (`coalesceAt`); *"Identity by descent and coalescence are the same fact read in two directions"*.
- 10 (drift as rolls), 11 (heterozygosity, 4Ne), 14 B/C (hitchhiking, haplotype rows), 14 E (4Nμ; ~4N generations for a silent change to take over), lesson 8 (a confound: skill rides with the player's alleles).

## Transcript (JM, 2026-10-01, dictated; speech-to-text left as is: "illegal(s)" / "wheel" = allele(s), "Jeans" = genes, "chrome is open" = chromosome, "coalitions" = coalescence, "saladanders" = salamanders, "4NU" = 4Nμ; "Your header is I guess" not read)

> Okay, for coalescence. I'm imagining a very silly game. There is a square that is the game area. There is a series of snakes. That are all green. You slither around, try and get food. And then choose a mate. All right, some chance, they're hawks. Swooping across the screen, and if they hit you, you die, the goal is to get food before winter. Once you do as much food as you can before mating season. And that mating season, you choose a mate. And you produce some number of offspring as a function of, uh, How much food you got? Food should be a little salamanters. There will be garter snakes eating saladanders. The trick here is that. The snakes are color coded. With mutations, they get a little dot on them. At one of several spots. Mutations are random and rare, however, you begin the game with one mutation. Your header is I guess. Jeans are calculated. I seen on the screen. There's a chance of mutation each round, and to the right of the game, is a generation tracker. Where it starts at some generation in the past, say -10, and goes forward in time. And it essentially builds a pedigree. For each gene. So each snake inherits randomly, one chrome is open to each parent. And the focal lineage, the player lineage is shown. Each round, you are randomly given to one of the one of the offspring, your lineage, and there's some chance of a new mutation occurring. Uh, at any site, including the one you are focusing on. Thinking the mutations could be indicated by colored circles. So we would have. Now. Yellow, orange, blue, green. As many tastes we have colors. And so we could choose from far ends of the spectrum. Alternating to keep them distinct. It is at the end of the game. You would have played it. The allele has no effect on fitness because fitness is determined by the player's skill. Not by the colorful dots on their snake. But you get a pedigree. Four. The snakes on the right. We can track how a given a wheel move through time. We use that as the basic framework. Understanding coalitions. and the time to most recent common ancestor. Because as long as the population sizes are up really small, then we can keep that nice and simple. I'm not sure. Feasibility. I don't know what we're talking about. 10 snakes per generation, or 50 snakes per generation. as viable. But as many snakes, as keeps the simulation running. Thinking that the allel has no effect on. Anything. It's just pure drift. Causing the frequency to move up. They're obviously fitness differences between snakes. They're unassociated with the illegals that are tracking since they just play your skill. All the other snakes randomly move to the environment at the same time. Gobbling up resources that the player could get, and getting gobbled up by hawks. That the player is avoiding, got the resources, should be small salamanders. The end of this. Be to calculate how fast. The illegal that you started with goes to fixation or extinction. And the total genetic diversity at the end. We're going to link these to 4N and 4NU. And the later simulations, which will be more standard, perhaps, but the point is to teach them nothing about genetics per se. He says how to read a coalescence plot. As they move through time.

## Items

| # | Stage | What | Status |
|---|-------|------|--------|
| 1 | — | settle snakes, length, chromosomes, B's starting good allele, the questions with JM | todo |
| 2 | — | game prototype: arena, snakes, hawks, salamanders, seasons | done (Stage A) |
| 3 | A | genealogy panel: lineages traced back per locus (done, on hover); MRCA and mutator marked (todo, with the targets) | doing |
| 4 | B | the s/h diagram; the good and bad loci | todo |
| 5 | — | `check_lesson15_numbers.js`: neutral alleles neutral apart from the player's line; coalescence and MRCA as the panel draws them; the hawks' count exact; no oscillation | todo |
| 6 | A | targets: click the pedigree at the MRCA of a locus, an allele's first mutant, the generation an allele fixed; play challenges | todo (JM: scoring later) |

## Do not

- Say a tracked allele is neutral while it rides in the player's body without saying why it spreads (measured above).
- Expect lost diversity to show linkage with 8 snakes: show it in the dots beside a new good allele.
