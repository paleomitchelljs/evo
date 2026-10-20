# Lesson 20 — phylogeny: a population that keeps splitting, and the alleles inside it

**File** · `app/lessons/lesson20.html` — first draft 2026-10-20
**Checks** · `node scripts/check_lesson20_numbers.js` · `python3 scripts/check_lessons.py` · `node scripts/check_layout.js`
**Status** · first draft built (v1, scaffold 9: S1-S9); checks green (18 + R, ~1 min); LOCKS `x`; JM to review; voice owed
**Last touched** · 2026-10-20

## What the lesson is

- One population that keeps splitting (apart, no floods: 19 A with migration off) into a tree drawn as it grows. Inside the tree, the alleles at a few loci traced back: their trees disagree with the populations' tree when the populations split fast and are large. F_ST between every pair; at the end, a trait evolving along the tree.
- Worth protecting: the tree is drawn from the run, never asserted; every gene tree comes from parent links recorded in the run.

## JM's brief, 2026-10-20 (verbatim, the 20 part; the whole message is in lesson19_overhaul.md)

> 20 should be on biologics. [...] By the end of 20, there should be similar traits along their tree. [...] For less than 20. We take the speciation results and build them up with more than two populations. Start with one population, and have it have some probability of dividing. As it divides, and compatibilities build up or reinforcing the ideas we talked about before. And we'll just use an allopatric sort of mode here. to make life a little bit easier for us. analytically. Importantly. I would like incomplete lineage sorting to be visible in the speciation simulation. So they start with solid population, has some amount of diversity, and they have some probability of the lineages splitting over time. I guess we'd get basically a pedigree. So then you just split and evolve, and we could trace individual wheels across that pedigree. We should link this to FST. This one might honestly be a single stage. Just an A. Even without a stage. Just with many targets and questions and additionally unlocking sliders rather than actually truly separate. targets, just a long time staring at this thing that produces, at the end, a phylogeny as it goes along. Dynamically.

Readings: biologics = phylogenetics; "similar traits along their tree" = traits simulated along the tree, close relatives alike; "compatibilities" = incompatibilities; wheels = alleles; solid = a single.

## As built (first draft, 2026-10-20)

One stage, no letter; nine steps; a slider joins the controls as the steps open it (split chance, then fish a population, then mutation).

    engine     19's fish and chromosomes; populations split with chance b a generation (cap 6), each half its own population, never
               meeting; 8N (at least 200) generations of the first population before 0, so traced lineages have met. Parent links at
               8 traced loci (3, 8, ..., 38); the alleles' trees traced from the run. Hybrids judged by 19 A's rule (new alleles from
               populations that had parted, pair chance 0.02, one kills) — never in the run, only between pairs for the plot.
               Size: every allele's effect N(0, .6) by hash; a fish 20 + its 80 effects; nothing selects on it.
    displays   the populations' tree as bars (letters on the living, top to bottom); one locus's lineages in red inside it; that
               locus's tree beside; 8 chips ✓/✗ (click to draw one). Every pair: F_ST, a hybrid's chance to live, size difference
               against generations since they parted. Size along the tree (opens at step 7). Anolis box (closed).
    steps      1 T six populations (split chance; opens .001)            2 Q the ringed population's closest relative (one letter)
               3 T six populations, 6+ of 8 loci not matching (+ N; opens N 5, b .008)
               4 T five or more, at most two not matching (opens N 50, b .008)
               5 T every pair parted 100+ ago two species (+ mutation; opens .001)
               6 Q the two populations whose hybrids live best (two letters: the pair that parted most recently)
               7-9 Q size, a tree each: before sizes show, the population you expect closest in size to the ringed one. The bit is
               the bet (its closest relative); the reveal says whether it paid off this time.
    the ringed population: one of the pair from the most recent split whose halves both live (its closest relative is one population)

## Measured (the page's engine in node, scratchpad nodeEng20.js; single trees)

    six by 400: b .001 rare, .002 .10-.50, .004 .25-.40, .008 .75-.85, .016 .99 (2,970 / 2,999)
    six and 6+ not matching: N 5 b .008 .05; N 10 b .008 .25; N 25 b .016 .80; N 50 b .008 .85, b .016 1.0
    five+ and at most two not matching: N 5 b .008 .60, b .004 .30; N 10 b .004 .27; N 25+ 0-.07 (a fail: two forks close together)
    old pairs two species (100+ ago, under 10%): mutation .001 0-.10; .002 .37-.50; .004 .83-.93; .006 .90-.97
    size: the latest split's pair also the closest in size in roughly half of trees (vs 1 in 5 by chance); average gap rises with
      time apart (N 5, mutation .001: 1.8 / 3.6 / 4.7 / 6.5 by 100s of generations). With size from standing variation alone it
      saturates within ~4N generations (each population fixes its alleles), so mutations carry the long-run rise.
    Anolis (82 species): pairs parted < 1 tree unit differ by 0.06 log units, 5+ units by 0.46 (3,321 pairs)

## Open for JM

1. The earlier plan's "oldest pair two species, newest not" hit 1 tree in 4 at best (it hangs on when the splits fall): replaced by
   step 5 (every pair parted 100+ ago two species) and the question in step 6.
2. Size questions score the bet, not the outcome: the reveal shows when relatives were not the closest. One tree is noisy; the
   Anolis box is the average. Say if you would rather score something else.
3. Split = a population's fish halved; the halves grow back to N the next generation (a founder step). The trait drifts; nothing
   selects. 21 adds a trait that changes splitting.
4. No drawn prediction yet in 20 (your 10-17 note): the pairs plot could take one (draw F_ST against time apart, cloud of trees)
   if you want it; the page plays one tree at a time.
5. Single-tree targets are stochastic: the best settings hit 60-99% a tree. The bit is the first scored tree.

## Items

| # | What | Status |
|---|------|--------|
| 1 | prototype: splitting populations + parent links; ILS rate vs N and b; time and memory budget | done |
| 2 | page: growing tree, traced allele tree, F_ST and hybrids by pair, unlocks, steps | done |
| 3 | trait along the tree; Anolis box | done |
| 4 | check script (`check_lesson20_numbers.js`, 18 + R) | done |
| 5 | JM's review; voice | todo |

## Rulings

- 2026-10-20: 20 builds on 19's results with more than two populations; one population with some chance of dividing; allopatric; incomplete lineage sorting visible; trace alleles across the pedigree; link to F_ST; maybe a single stage with many targets and questions and sliders unlocking; the phylogeny drawn as it goes. By the end, traits along the tree.

## Do not

- Simulate gene trees backwards (a coalescent) and draw them as if traced: trace them from the run's parent links.
- Tell students which gene trees disagree before they look.
