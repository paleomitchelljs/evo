# (Absorbed into lesson 14) Linkage: what selection drags along — was the lesson 16 plan, moved here 2026-10-01 when slot 16 went to coalescence

**File** · `app/lessons/lesson16.html` — new page, not started
**Checks** · `node scripts/check_lesson16_numbers.js` (to write) · `python3 scripts/check_lessons.py`
**Status** · **absorbed into lesson 14 (JM, 2026-09-30)**: linkage, sweeps and dN/dS are now 14's core; see `lesson14_overhaul.md`. Kept for its measurements. Planned 2026-09-25; nothing built
**Last touched** · 2026-09-25

After the selection lessons (12 genetics, 13 regression, 14 birth–death, 15 frequency dependence, pencilled). A bridge into the mutation lesson.

## What the lesson is

- JM, 2026-09-25: *"Linkage is what I'm trying to show--sorry, when I said recombination limiting selection I meant 'without' recombination it's an issue."*
- JM: *"do the role of recombination scrambling good & bad alleles, add in selective sweeps where fitnesses can fail to be optimized if recombination rates are low as 'suboptimal' alleles are dragged to fixation because they're linked to good alleles at other loci ... A 'bridge' lesson leading to mutation focused on how the specifics of heritability with genes directly influences how selection shapes frequencies."*
- Worth protecting: selection acts on chunks of chromosome, not on loci one at a time, and the chunk size is recombination against selection strength.

## Stages (provisional)

    A  scrambling: build a cell; which copy an allele sits on changes the offspring, not the parent
    B  the sweep: a new good allele lands on a chromosome the student built; what fixes along with it
    C  held back: the same good allele on a bad background fixes less often, and more slowly
    D  how wide: neutral diversity around the swept site; wider when selection outruns recombination

### A — scrambling

- JM's first sketch (2026-09-25): lesson 9's cell (two chromosomes, four loci each); click a locus to change its allele; each allele its own h and s; fitness adds across loci; a random meiosis, then fusion with a gamete from a population at set frequencies; the offspring goes on.
- As sketched it cannot show linkage (measured below): crossing over never moves the mean; a fully homozygous cell makes one kind of gamete; nothing uses fitness.
- What does work: the **arrangement** as a lever. Same genotype, same fitness bars, good alleles together on one copy or scattered across both; the offspring spread differs, and with the fittest offspring continuing, crossing over hurts one and helps the other.
- Show many offspring from the one cell (a histogram) or many chains. One chain cannot show 0.12 against 0.19.
- Fitness `1 + Σ` over loci, lesson 12's signs (`1, 1 + hs, 1 + s`) and 12 B's rule for two different alleles (`1 + hᵢsᵢ + hⱼsⱼ`). Floor at 0: eight loci at s −0.3 go below it.
- Recalls 9 E, does not repeat it: 9 E already shows crossing over raising the ceiling selection reaches (lesson9.html ~2659).

### B — the sweep

- The student builds the chromosome the new good allele lands on (which bad alleles sit next to it, and how far away), and sets s and the recombination rate. Target picture: which colours are fixed at the end.
- A share dragged is a probability, so many populations and windows on hit rates (12 C's machinery).
- Recombination needs a log scale or set steps: everything happens below 0.01 per gap (measured below).
- A new single copy is lost to drift ~92-96% of the time at these settings. Either run enough populations that the survivors are the picture, or start it at a few copies on the one chromosome. **Unmeasured.**
- Price and 13 E's language: at r 0 the bad allele's count *is* the good allele's count, so its covariance with fitness is positive whatever its own s. The good allele confounds it. 202_lec19_03: *"Selection on phenotype is blind to the linkage."*

### C — held back

- At r 0 the good allele on a bad background fixes half as often and takes twice as long (measured below). The other way fitness fails to be optimized. May be rounds of B, not a stage.

### D — how wide

- Neutral neighbours with standing variation; heterozygosity along the chromosome after the sweep; the gap in diversity widens with s and narrows with r.
- Needs a longer chromosome than four loci (four give three gaps). **Unmeasured.**
- 202_lec19_04, dachshund FGFR3: *"a wider area of low variation means selection had to outpace 20 million base pairs' worth of recombination."*

## Measured, 2026-09-25 (Python prototypes, not the page)

A, lesson 9's layout (8 loci), s summing to 0.9, mixed h, every bad allele at 0.5 in the population, one crossover per chromosome:

- Best cell's descendants, crossing over off / on: 1.000 → 0.825 → 0.712 → 0.657 → 0.628, identical. Exact when fitness adds across loci.
- Same cell (heterozygous at all 8, w 0.65), offspring mean 0.600 in every case:

      good alleles       crossing over   offspring spread   fittest of 4 continues, gen 1
      together           off             0.193              0.794
      together           on              0.122              0.723
      scattered          off             0.115              0.717
      scattered          on              0.141              0.738

  All four at 0.800 by generation 12 (the population's gametes swamp the line).
- "Lives with chance w", from the best cell: 3.9% alive at generation 8, crossing over on or off.

B-C, 250 diploids, one chromosome of 4 loci, a new good allele on one copy carrying a bad allele (s 0.02 each) 1, 2 and 3 gaps away, every other copy good there. Share of fixations that dragged each along:

      r per gap        .000        .001          .003          .010         .030+
      good s 0.1       1/1/1       .22/.08/.03   .11/.01/0     .01/0/0      0
      neutral nbrs     —           .60/.35/.24   .19/.05/.03   .02/0/0      0
      good s 0.3       —           .53/.28/.22   .18/.05/.01   .02/0/0      0

- Lesson 9 E's rule (~1/3 per gap) drags nothing.
- A bad neighbour is dragged ~3× less than a neutral one (recombinants without it are favoured).
- Good s 0.1 with bad neighbours: fixes 100/2500 in ~356 generations at r 0; ~200/2500 in ~180 at r ≥ 0.03.
- Not varied: N. Dragging should weaken as N grows (more recombinants).

## Sources

- JM quotes (quoteable/quotes/quotes_bio202.yaml): 202_lec19_05 (*"A locus is just a chunk of DNA selection hasn't recombined apart yet"*), 202_lec19_03 (selection faster than recombination drags bad alleles), 202_lec19_04 (dachshund FGFR3), 202_lec13_02 (each gene its own ancestors, Genghis Khan), 202_lec12_04 (inversions lock genes together, "super-loci"), 202_lec21_04 (Y and mitochondria do not recombine), 202_lec14_05 (*"recombination is mutation. It's super-mutation"*, the hinge into mutation), 202_lec14_04 (Muller's ratchet, for the mutation lesson).
- Lesson 11 E, JM's recombination passage (2026-09-25): chunks, *"driven by the recombination rate relative to the rate of other forces."*
- Lesson 9 E: `+3.0, wherever you cut`; the ceiling table.
- data/SOURCES.md: LTEE, Good et al. 2017. Asexual, so hitchhikers are visible in the trajectories. Logged, not cleaned (needs the authors' pipeline).
- Candidate lever, not planned: an inversion as a toggle that sets r to 0 across a stretch (202_lec12_04).

## Items

| # | Stage | What | Status |
|---|-------|------|--------|
| 1 | — | new page from 12's furniture (round machine, practice switch, setupCanvas override, many-populations runner); LOCKS row; index card | todo |
| 2 | A | cell with clickable alleles on each copy; h, s per allele; meiosis + population gamete; offspring histogram; fittest continues | todo |
| 3 | A | rounds on the arrangement; checks | todo |
| 4 | B | chromosome builder, s, log-scale recombination; many populations; final-chromosome picture as target; decide single copy vs a few | todo |
| 5 | B/C | rounds (drag one / drag none / drag all / held back); windows on binomial hit rates; checks | todo |
| 6 | D | longer chromosome, neutral diversity along it; measure the width against s and r first | todo |
| 7 | — | `check_lesson16_numbers.js` | todo |
| 8 | — | voice from JM | todo |

## Rulings

- **2026-09-25** — linkage is the point: *"'without' recombination it's an issue."*
- **2026-09-25** — not lesson 12: *"I don't think I want to put it in lesson 12."*
- **2026-09-25** — *"Let's plan it as Lesson 16 for now."*
- **2026-09-25** — dN/dS cut from here: *"bring that in later as a nice mutation-drift-selection interaction term, since it leverages all three. A kind of 'capstone' to the popgen unit along with the furthering of the culmination of this unit's Price equation focus."* Scaffold s18 (dN/dS classification) and archived lesson 22 (codon ratios, five genes) are its sources. It links through fixation chance: protein-changing over silent, i.e. 12 B's win share over lesson 10's neutral one.

## Do not

- Frame it as recombination limiting selection. Linkage (too little recombination) does.
- Use lesson 9 E's crossover rule for the sweep: nothing gets dragged.
- Expect a homozygous cell's meiosis to show anything.
- Build dN/dS here.
