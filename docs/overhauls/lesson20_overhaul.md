# Lesson 20 — phylogeny: a population that keeps splitting, and the alleles inside it

**File** · `app/lessons/lesson20.html` — first draft 2026-10-20
**Checks** · `node scripts/check_lesson20_numbers.js` · `python3 scripts/check_lessons.py` · `node scripts/check_layout.js`
**Status** · not started (planned with 19 and 21, JM's 2026-10-20 brief)
**Last touched** · 2026-10-20

## What the lesson is

- One population that keeps splitting (apart, no floods: 19 A with migration off) into a tree drawn as it grows. Inside the tree, the alleles at a few loci traced back: their trees disagree with the populations' tree when the populations split fast and are large. F_ST between every pair; at the end, a trait evolving along the tree.
- Worth protecting: the tree is drawn from the run, never asserted; every gene tree comes from parent links recorded in the run.

## JM's brief, 2026-10-20 (verbatim, the 20 part; the whole message is in lesson19_overhaul.md)

> 20 should be on biologics. [...] By the end of 20, there should be similar traits along their tree. [...] For less than 20. We take the speciation results and build them up with more than two populations. Start with one population, and have it have some probability of dividing. As it divides, and compatibilities build up or reinforcing the ideas we talked about before. And we'll just use an allopatric sort of mode here. to make life a little bit easier for us. analytically. Importantly. I would like incomplete lineage sorting to be visible in the speciation simulation. So they start with solid population, has some amount of diversity, and they have some probability of the lineages splitting over time. I guess we'd get basically a pedigree. So then you just split and evolve, and we could trace individual wheels across that pedigree. We should link this to FST. This one might honestly be a single stage. Just an A. Even without a stage. Just with many targets and questions and additionally unlocking sliders rather than actually truly separate. targets, just a long time staring at this thing that produces, at the end, a phylogeny as it goes along. Dynamically.

Readings: biologics = phylogenetics; "similar traits along their tree" = traits simulated along the tree, close relatives alike; "compatibilities" = incompatibilities; wheels = alleles; solid = a single.

## Plan

One stage, no letters. Controls unlock one at a time as targets are hit; questions between them.

    engine     19's (copied: second caller of the pond engine), migration off. Each generation every population may split in two
               (chance b); a split halves nothing: each daughter is N fish drawn from the parent. Cap ~8-10 populations (or stop
               splitting). Mutations in the population's own shade; incompatibilities as 19 A between alleles from lineages that had
               already parted (never ancestor-descendant). Parent links recorded at 3-5 traced loci.
    displays   the population tree growing (branches as tubes, width ~ N); inside it, the traced alleles' tree for the chosen locus
               (one sampled chromosome a tip population); F_ST matrix / F_ST against time apart; a hybrid's survival between any
               two (species or not); at the end a trait (many small-effect loci, or Brownian) at the tips and along the branches.
    unlocks    1 chance of a split (b): grow a tree of k populations by generation G
               2 fish a population (N): gene trees that disagree with the population tree (ILS) — more with big N, fast splits
               3 mutation rate: F_ST and incompatibilities between sisters vs distant cousins; when a pair counts as two species
               4 the trait: relatives alike; the tree explains the tips
    questions  which pair is most alike / least; does this locus's tree agree; F_ST vs time apart (drawn prediction)
    real data  Anolis SVL + tree (data/clean/anolis_*): relatives alike, a closed box after the trait unlock

## Items

| # | What | Status |
|---|------|--------|
| 1 | prototype: splitting populations + parent links; ILS rate vs N and b; time and memory budget | todo |
| 2 | page: growing tree, traced allele tree, F_ST, unlocks, targets | todo |
| 3 | trait along the tree; Anolis box | todo |
| 4 | check script | todo |

## Rulings

- 2026-10-20: 20 builds on 19's results with more than two populations; one population with some chance of dividing; allopatric; incomplete lineage sorting visible; trace alleles across the pedigree; link to F_ST; maybe a single stage with many targets and questions and sliders unlocking; the phylogeny drawn as it goes. By the end, traits along the tree.

## Do not

- Simulate gene trees backwards (a coalescent) and draw them as if traced: trace them from the run's parent links.
- Tell students which gene trees disagree before they look.
