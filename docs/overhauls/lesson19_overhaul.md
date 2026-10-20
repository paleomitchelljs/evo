# Lesson 19 — speciation as a process: ponds and floods, one incompatible pair, a trait, a preference

**File** · `app/lessons/lesson19.html` — pass 3 (redraft) 2026-10-20; v2 archived as `app/archive/lesson19_v2_2026-10-17.html`
**Checks** · `node scripts/check_lesson19_numbers.js` · `python3 scripts/check_lessons.py` · `node scripts/check_layout.js`
**Status** · pass 3 built (v3, scaffold 13: A1-A4, B1-B3, C1-C3, D1-D3); checks green (34 + R, ~2 min); LOCKS `x`; JM to review; voice owed (JM to dictate)
**Last touched** · 2026-10-20

## What the lesson is

- Two ponds from one population; floods now and then mix them. Incompatibilities build up by drift and mutation until floods stop doing anything (A); one pair made explicit, and the island it holds (B); a trait that survives better in one pond than the other (C); a mate preference on the same trait, at a locus the student places, with an inversion to lock them (D).
- Worth protecting: fitness is never set. Survival (ecology, incompatibilities) and births (mate choice) are; fitness is what comes out (JM).

## JM's brief, 2026-10-20 (verbatim, the whole message; 20 and 21 docs quote their parts)

> Ideas to redraft lessons 19, 20, and 21:
>
> I have ideas, lessons, 19, 20, and 21. These 3 lessons are all going to follow the concept of species. 19 should be on speciation as a process. 20 should be on biologics. And 21 should be on comparative methods and species selection. You should build on the previous. So by the end of 19, they should be seen a phylogeny generated through their population diverging. By the end of 20, there should be similar traits along their tree. And by 21, it should be seen species selection, changing the frequency of traits over time as a traits in self-control. Space station and extinction probabilities. For 19, There should be based extensively on the simulation machinery we built up in the migration lesson 17. Specifically, I'd like a scenario in which. They start with one population, and multiple wheels, and they diverge. So we should have a drift-based speciation. Model. where incompatibilities develop. Over time, as species, populations break. I'm imagining a slider that controls the mutation rate. Recombination rate. Migration rate. And the probability that 2 alleals at different low si are incompatible. We'll also need a slider for, uh, how often migration pulses can occur. I think setting this up. With an example like fish in ponds, where every time there's a flood, fish can move across ponds and intermingle, whereas in non-flood years, they're restricted. There's a good system. And we have just sort of periodic flood, some frequency. We track introgression rates over time and FST over time. And when the pulses, the goal is to have it such that the pulses no longer change FST, no longer decrease FST, no longer increase in progression. Because once the pulses no longer have an effect on SST, then You've got to Different populations. Attract their neutral diversity over time as well. Imagine like a drop down toward Target. Um, The other big one I want for the speciation. It's probably going to be part what I just described should be part A. Part D should be a more interactive one based more explicitly on low side. I'm imagining a situation where you have a focal locus. With 2 alleles, A and B with 2 different colors. And each genotype gives you a different phenotype. So AA gives you one phenotype, AB, gives you another phenotype. BB gives you a 3rd phenotype, and students can adjust H to modulate what the intermediate, the header as I go phenotype is. Uh, and the students can manipulate the fitness of each tree type. So it'd be a causal diagram with genotype, phenotype, phenotype, to fitness. Maybe that would be part C and part D would add another layer where we have a mate preference allel. Where you can prefer at some frequency, different phenotypes. So there is a, Survival aspect about how well they live, and a reproductive birth rate aspect for how many offspring they have. Make choice affects birth rate. Uh, phenotype. The insight would affect birth rate by a mate choice and survival. Probability. Um, by ecology, basically. You would have. The main choice of Leo located different positions on the chromosome. relative to the, uh, relative to the trait inducing, allel. And we could even have an inversion, and at least some targets are given the option to invert it. to lock them together. Importantly, fitness would be a derived characteristic in this one, actually. So we should have survival, and mate choice, as our two things, and fitness is the number of offspring who survive. So we track those 2 things separately. I think that's the better way to do it. Instead of having students set fitness. Fitness is the outcome of survival and mating probability. So for earlier activities. Mating is random. With respect to phenotype, and only survivals effective like being a type, and then the ladder one, the ladder a classic, we have mating success also impacted by phenotype. But, at some different allel that has a preference. So the same phenotype is driving both, but the heritability is different. This way, we can get at reinforcement, and we can get at the key aspects of how unsteady it is. We'd also need for the speciation activities, a strong effect, or a way to illustrate the effect of just drift being required to build up incompatibilities. So especially for the early activities, affect the population size and mutation rate are important. The faster you're fixing differences, Well, more likely they are to be incompatible when they come back. So it's kind of my visions for A, D is the full sweet C is the medium, and B would be something intermediate between them for less than 19. For less than 20. We take the speciation results and build them up with more than two populations. [... 20 and 21: see lesson20_overhaul.md, lesson21_overhaul.md ...] As always, the goal of these activities is not to assess, but rather to illustrate. It helps build intuition in the students. You should be extremely low text. I'm sure rely on visuals instead of words, wherever possible. Thing to be aware of is, There are a few colorblind students in the class. I want to be, making sure we're using symbols and colors that work well. for them.

Readings of the speech-to-text: wheels / alleals = alleles; low si / low side / Leo = loci; SST = F_ST; in progression = introgression; Attract = Track; header as I go = heterozygote; tree type = genotype; Make choice = mate choice; ladder = latter; sweet = suite; unsteady = unstable (read as: reinforcement is fragile); "drop down toward Target" = a drop-down to choose what the plot shows (17's and 19 v2's watch menu).

## Stages as built (pass 3)

One engine for all four (`pd*`): two ponds of N hermaphrodite fish, one chromosome of 40 loci (17's beads), parents at random (A-C) or by preference (D), young live or die (incompatibilities, ecology), young made until N live (deaths counted). Floods every T generations: each fish swaps ponds with chance m (17's swap), at the start of the generation, so a flood shows up in the young it leaves. F_ST on allele identity (17's formula). Snapshots every generation (every 2 at N 50+).

    A  Ponds and floods. One grey population (3 alleles a locus) splits. New alleles in the pond's colour. A new orange and a new
       blue allele at different loci are incompatible with chance p (a hash of the two: the same two, the same answer); one of
       each kills a young fish. Sliders: fish a pond, mutation, chance a pair is incompatible, crossovers, flood size, generations
       between floods. Board; over time (F_ST, alleles from the other pond, diversity within each pond, a hybrid's chance to live,
       incompatible pairs in a hybrid), floods as ≈ on the axis; "A hybrid, up close" (closed box: its pairs as a grid).
       16 runs, 400 generations. Rounds: 1 floods .2/10 held, mutation free (opens .002): F_ST ≥ .3; 2 mutation .001, floods free
       (opens .2/25): F_ST ≥ .3; 3 mutation .004, p and floods free (opens .02, .2/10): F_ST < .1; 4 N free (opens 50): diversity
       within each pond < .3.
    B  One pair. Ponds start apart (one allele a locus, each its own colour). ▲ (the orange allele's locus) and ■ (the blue's)
       dragged along the chromosome under an F_ST-by-locus bar plot; the pair's cost on a red arrow onto the dashed "orange allele
       alone -> chance to live" arrow. 16 runs, 150 generations, N 50. Rounds: 1 loci free (opens 5/36): F_ST ≥ .5 at both;
       2 cost free (opens .9): the same; 3 loci 20/21, floods free (opens .1/5): F_ST < .35 at both.
    C  A trait at locus 20: light / dark allele (lightness, not hue); ○ ◐ ●. DAG: genotype -h-> looks -> lives? orange pond, lives?
       blue pond (signed arrows) -> fitness <- births (at random). Survival picture (looks across, chance to live up, a line a
       pond, ○ ◐ ● on each). "What each look got": lived, births (1 = average), fitness (lived x births, 1 = the average young),
       last 20 generations. 16 runs, 200 generations, N 50, dark at 50% in both at the split. Rounds: 1 arrows free (open 0, 0):
       dark < 30% orange, > 70% blue; 2 arrows -1/+1, h free (opens .5): dark < 8% in orange; 3 floods free (open .1/2): F_ST ≥ .5
       at the trait, < .1 at the others.
    D  A choosy allele (one copy: choosy) prefers ○ or ● (radio); how choosy on an arrow onto the dashed looks -> births arrow;
       ♥ dragged along the chromosome; inversion (checkbox) from the trait locus to ♥ on every chromosome that starts choosy.
       Births come from being chosen; fitness derived. 12 runs, 300 generations, N 100, dark 5% / 95%, choosy 20% in both,
       floods .1 every generation. Rounds: 1 inversion at 21 held, the look free (opens light): choosy ≥ 40% blue and < 20%
       orange; 2 locus and inversion free (open 39, none): the same; 3 arrows free (open -1/+1): the two ponds' choosy shares
       within 10 points.

## Measured on the page's engine (2026-10-20; the numbers per round are in the page's comments above each ROUNDS)

    A  round 1, mutation .002 / .003 / .004 / .006 / .008: F_ST .10-.14 / .17-.31 / .37-.46 / .38-.41 / .33-.35 (more mutation,
       more diversity, a lower ceiling on F_ST)
    B  round 1, loci 5/36 .09-.27 ... 18/23 .43-.51, 19/21 .67-.72, 20/21 .75-.85; round 2, cost .9 .09-.27, 1 .93-.94 (every
       first hybrid dies: the whole chromosome holds)
    C  round 2, h 0 / .25 / .5 / .75 / 1: dark in orange .22-.24 / .16 / .10 / .05 / .00, in blue 1.00 / .95 / .90 / .85 / .76
    D  inversion: choosy .05-.12 orange / .50-.79 blue; adjacent, no inversion .06-.18 / .53-.64; far (39) .16/.20 or .53/.58:
       unlinked, it ends up in both ponds or neither. Needs the orange pond to keep dark out: arrows -.5/+1 .24/.24-.33/.33.
    colourblind (Machado 2009 simulation, CIE76 ΔE, normal / protan / deutan / tritan): pond orange-blue 106 / 84 / 98 / 99;
       trait light-dark 81 everywhere; DAG red-blue 72 / 33 / 53 / 95; held pale red-blue 35 / 15 / 22 / 48 (the sign is also on
       the number); verdict green-red 78 / 19 / 10 / 87 (so every verdict carries ✓/✗ and the word)

## Measured (node prototype, scratchpad `pond.js`, 2026-10-20)

    A, N 25, mu .004 a locus, R 1, p .02, lethal + dominant, flood at the start of a generation, measured on the young
      floods every 50 at m .2, one run: flood 50 F_ST .40 -> .26 (introgression 9%, gone by 53); floods 100-400: F_ST
        unmoved (.43/.39, .51/.52, .62/.62 ...), except one migrant-x-migrant flood at 250 (.72 -> .52, back by 253)
      migrant alleles still there 10 generations after a flood (%), 8 runs, by flood:
        T 5:  m .1 113 9 41 2 ...    m .2 never apart (0/8)   m .4 0/8 apart
        T 10: m .1 apart 8/8         m .2 7/8                 m .4 0/8 (F_ST .03 at 400)
        T 25: m .1 8/8 (24% kept at the first flood, then 0)  m .2 7/8   m .4 2/8 (30-70% kept every flood)
        T 50: m .1 8/8   m .2 8/8   m .4 3/8          T 100: m .1, .2 8/8; m .4 3/8
      flood m .5 (every fish 50:50) never separates: one mixed pond, then a hybrid swarm
    N barely changes the waiting time (sweep, T 50 m .2, floods stop by): N 10 mu .004 50-150 (one never); N 25 50-200;
      N 50 50-100; N 100 50-100. mu .001: N 10-100 mostly never by 500. mu sets the pace; N sets how lumpy (small N: every hybrid
      the same fate) and how fast F_ST climbs between floods (drift), and diversity within a pond (HS .22-.36 at N 25, .70+ at N 100)
    incompatibilities recessive (two copies at both loci): never apart at T 50 m .2 (F1 hybrids live and backcross);
      two copies at one locus: N 10 sometimes, N 100 never
    F_ST on allele identity tops out near 1 - HS (HS .3 -> F_ST ~.5-.6 when fully apart); on colour (grey/orange/blue) it climbs
      toward .9. The page uses identity (the real thing; drift of the grey alleles counts)
    speed: 2 ponds x N 25 x 400 generations ~ 0.05 s a run

## Open for JM

1. N and drift (your "the faster you're fixing differences"): in this model the build-up runs on mutation x time and barely on
   N (sweep above). Theory says the same for neutral substitutions (Orr & Orr 1996, Evolution 50: waiting time to speciation by
   drift is roughly independent of population size; I am fairly but not fully sure of the citation). What N does change on
   screen: F_ST climbs faster between floods, diversity within a pond drops, and small ponds give every hybrid the same fate.
   N is a slider; no target claims small ponds speciate faster. Say if you want a model where it does (e.g. incompatibilities
   only between fixed differences).
2. Incompatibilities are lethal and dominant in A (one copy of each kills): recessive ones never beat floods every 50 at m .2.
   B uses a partial cost on its arrow, because a lethal pair kills every F1 and nothing crosses at all.
3. Colourblind: ponds stay orange/blue (safe pair, measured above); grey = before the split. C/D's trait is lightness, never a
   hue; genotypes also by symbol (○ ◐ ●). Hit/miss by ✓/✗. The course's green/red verdict colours collapse for red-green
   colourblind eyes (ΔE 10-19): worth a REVISIONS row (symbols on every verdict in 1-18)? Not added without your word.
4. The redraft drops v2's three things: drawn rounds (A is bowling again; JM's "the goal is ... the pulses no longer change FST"
   reads as a target), the one-allele choosy allele (now JM's two-locus version: the position matters), B's sparrow data.
5. D is reinforcement in one direction: one choosy allele that prefers one look. It sorts by pond only when locked to the trait;
   unlinked it spreads into both ponds or neither (the two-allele problem). A pair of choosy alleles (one each way) was the
   first prototype: one preference swept both ponds (runaway) in most runs. Kept simple.
6. A's crossovers slider does little (a pair kills; one chromosome): .07-.12 F_ST across R .25-4. It matters in B and D.
7. C's floods at .2 every 5 are strong gene flow; one pond selecting alone takes the dark allele into both (0, +.25: 100% / 100%).
8. D's floods run every generation (.1): reinforcement needs hybrids every generation to work against.

## Items

| # | Stage | What | Status |
|---|-------|------|--------|
| 1 | — | archive v2; overhaul doc | done |
| 2 | A | engine (floods, identity F_ST, lethal pairs), measure, rounds | done |
| 3 | B | one pair, placed by drag; DAG; targets on holding where it sits | done |
| 4 | C | trait locus, h and the survival arrows on a DAG, survival plot, what each look got | done |
| 5 | D | choosy locus by drag, the look it prefers, inversion; births vs survival | done |
| 6 | — | `check_lesson19_numbers.js` rewritten (34 + four R panels, ~2 min) | done |
| 7 | — | colourblind pass: ✓/✗ on verdicts, trait by lightness and ○ ◐ ●, the blue pond's lines dashed, ▲ / ■ for B's loci | done |
| 8 | — | JM's review; voice | todo |

## Rulings

- 2026-10-20: 19 speciation as a process, built on 17's machinery; one population with many alleles diverging by drift; incompatibilities; sliders for mutation, recombination, migration, the chance two alleles at different loci are incompatible, how often floods come. Fish in ponds, floods. Track introgression, F_ST, neutral diversity; a drop-down. The goal: floods stop changing F_ST and introgression.
- 2026-10-20: C = focal locus, AA/AB/BB phenotypes, h sets the heterozygote, genotype -> phenotype -> fitness diagram, mating random. D = a preference allele at another locus, placed on the chromosome; an inversion in some targets. Fitness derived: survival and mate choice set, fitness = offspring that survive.
- 2026-10-20: illustrate, not assess; extremely low text; colourblind students: symbols and colours that work for them.
- 2026-10-17 (pass 2): more "students draw what they expect"; bowling stays.

## Do not

- Set fitness anywhere in C or D: survival and births are set; fitness is read off the run.
- Code the trait by hue: lightness and symbols only.
- Measure a flood on the adults it moved (the dip is mechanical); measure it on the young it leaves.

## Pass 1-2 (v2, 2026-10-17, archived)

A split/apart/contact as four drawn rounds; B two pinned pairs + a draggable inversion on 17's start (R 4); C one-allele choosy at N 100 with 17 C's gene 20. Measurements and dead ends kept in git history (this file before 2026-10-20). Carried forward: islands need R 4 on one 40-locus chromosome; reinforcement without local adaptation runs backwards (choosy migrants breed true abroad, F_ST falls); N 25 drift swamps a choosy allele; 3-try mate search barely moves it.
