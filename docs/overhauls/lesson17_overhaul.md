# Lesson 17 — migration: fragments that cross, what sets their size, drift against migration, selection at one gene

**File** · `app/lessons/lesson17.html` — first draft 2026-10-12
**Checks** · `node scripts/check_lesson17_numbers.js` · `python3 scripts/check_lessons.py`
**Status** · draft built (A-D), checks green (30 + R panels); LOCKS `x`; JM to review
**Last touched** · 2026-10-12

## What the lesson is

- Two populations swapping genomes: the other population's DNA turns up in fragments, cut shorter every generation; drift pulls the two apart, migration holds them together, selection at one gene keeps it apart (or drags it in).
- Worth protecting: everything read off bead strings (hue = population an allele arose in, shade = which allele), 16's displays; F_ST measured off the student's own runs with the closed form beside it.

## JM's brief, 2026-10-12 (verbatim)

> I am wanting a draft of lesson 17 (migration--big goal to look at introgression, haplotypes, and population differentiation ideally using heterozygosity to connect to drift along with Fst and utilizing many of hte same kinds of simulations and displays done in 16 for mutation with the identical by descent blocks). Using the migration lesson to reinforce the prior forces (drift, selection, and mutation) and their key components is ideal.

## JM's outline, 2026-10-09 (verbatim)

> Revised snake chromosome diagram the students are familiar with, but with more loci.
> Two side by side populations, sliders for mutation rate, recombination rate, average h/s of new mutants, migration rate (per gen prob of individuals swapping) and pop size (? Unsure about last one, visually)
> Only difference is popA has mutations from orange spectrum, and popB has mutations from blue spectrum
> Students set up and do 10 runs. Final outcomes shown. Chunks of blue in the orange pop (and vice versa) show introgression
> At the end, students plot "average size of introgressed chunks" against migration rate (recombination rate also matters, but we won't complicate this yet)
> Builds to Fst later which we'll calculate visually

## Stages as built (draft 1)

One engine throughout (`mg*` in the page): two populations of hermaphrodite genomes, one chromosome of 40 beads; Wright-Fisher (two different parents, picked by fitness); crossing over with chance R/39 at each gap; each generation Binomial(N, m) genomes swap places; new mutations Poisson(U) a gamete, each a new allele in the population's hue. 50 pairs (100 populations) a run in A, B, D; 20 pairs in C.

    A  Steady migration: m and R. Other colour 15-40% (m); then in fragments 4.5+ beads (lower R); then 6+ fragments a chromosome under 3 beads (high m and R).
    B  One pulse: migrants each way (1/2/4/6/10: ~4-40% other hue), R, generations after. Fragments 7+ beads with the other colour under 12% (small, recent); 4+ beads at generation 20 with 4 migrants held (lower R); under 3.5 beads, under 12% (small, old). Every run a dot on "your runs": fragment length against generations after, by R (JM's 10 runs). Click two genomes: where they carry the same alleles bead for bead (task: one shared other-hue fragment of 3+ beads).
    C  A split: one grey population divided in two. N, m, U. F_ST 0.2+ at 50 (drift: smaller N); 0.1-0.3 at 100 with N 25 (m); the same at 200 with N 100 (m four times smaller: Nm); heterozygosity 0.3+ at 100 with no migration (U). Bead-by-bead frequency bars, pair 1. Closed forms beside: H0(1 - 1/2N)^t, 1/(1 + 16Nm), 4Nu/(1 + 4Nu).
    D  Selection at gene 20: s, h, m, R. The other colour under 15% at gene 20 and 25%+ at the ends at 100 (barrier); 60%+ at gene 20 and under 35% at the ends at 60 (it sweeps in). Gene-by-gene panel (other colour, F_ST). Italian sparrow F_ST strip (77 values from data/clean, embedded) beside the student's, no target.

## Measured (node prototype of the page's engine, 2026-10-12; N 25, 40 beads)

        A, generation 50, 50 pairs         m 0 / .002 / .005 / .01 / .02 / .05
          other colour                     0 / .09 / .21 / .32 / .43 / .49        (flat in R)
          fragment length, R .25/.5/1/2/4  ~9 / ~5.3 / ~3.3 / ~2.3 / ~1.8          (flat in m)
          fragments a chromosome, R 1      0 / 1.3 / 2.7 / 4.0 / 5.0 / 6.2        (R 2: 1.8/4.2/5.5/7.2/8.1)
        B, pulse at gen 1 (both ways)      fragment length at 5 / 10 / 20 / 40 generations
          R .5                              17 / 9 / 5 / 3.3
          R 1                               11 / 5.4 / 3 / 2.1
          R 2                               6.6 / 3.1 / 1.9 / 1.5
          other colour: pulse 2 -> 8%, pulse 5 -> 19% (flat in time)
        C, split, U 0                      F_ST at 50 / 100: N 10 .84/.99, N 25 .44/.75, N 50 .25/.47, N 100 .13/.24
          H within tracks H0(1 - 1/2N)^t (0.233 vs 0.216 at N 25, gen 50; 0.222 vs 0.222 at N 50, gen 100)
          equilibrium F_ST                  N 25: m .005 .45 / .01 .23 / .02 .13 / .05 .05; N 100 (gen 200): .001 .32 / .002 .23 / .005 .12 / .01 .06
          1/(1 + 16Nm) agrees (.20 / .11 / .05; .24 / .11 / .06); 1/(1 + 4Nm) does not (.50 / .33 / .17)
          mutation, N 25, m 0, gen 100      U .1 .22 / .2 .35 / .4 .49 / .8 .66 / 1.6 .79   (4Nu/(1+4Nu), u = U/40: .20/.33/.50/.67/.80)
        D, gene 20, h .5, 100 gens         s .3 m .02: gene 20 .13, ends .42; s .6: .05/.31; s 1: .03 everywhere (whole chromosome shut)
          sweep, 60 gens, R 1               s -.3 m .005: gene 20 .77, ends .25; s -.6 m .002: .68/.16; s -.1 m .005: .42/.20
        Italian sparrows, 77 loci           mean F_ST .54, 22% >= .9, 34% < .3 (bimodal); one pair of 40 beads at s .6 m .01: .61 / .21 / .17, but s 0 m .002 matches as well (.61 / .24 / .19) -- so no target on it

## Open for JM

0. Founder shades: three alleles a gene in shades 1/3/5 of each hue (grey 0/2/5); new mutations a random shade. Hue reads clearly on the boards (screenshots 2026-10-12); a new mutation is not marked apart from a founder of the same shade.

1. **1/(1 + 4Nm) does not hold for two populations.** Measured F_ST (pooled H_T, as the sparrow file's column) sits on 1/(1 + 16Nm); the 4Nm form is the many-islands one. The page prints the 16Nm form. Keep, or switch C to many populations (n 10 gives 4Nm x 1.23)?
2. N: held at 25 in A, B, D; a slider only in C (where Nm is the point). OK?
3. D's sparrow strip has no target: one gene on one chromosome cannot tell selection from low migration in that histogram (above). A many-genes D (several selected genes) would; worth building?
4. 16 D's inversion riding in a migrant (old open point 3): not built.
5. No voice blocks yet: JM to dictate.

## Items

| # | Stage | What | Status |
|---|-------|------|--------|
| 1 | — | prototype engine, measure A-D | done |
| 2 | A-D | build the page | done |
| 3 | — | `check_lesson17_numbers.js` | done |
| 4 | — | JM's review; voice | todo |

## Rulings

- 2026-10-08: 17 is migration; IBD blocks and haplotypes lead into it.
- 2026-10-09 (outline): two populations side by side; orange and blue spectra; 10 runs; chunks show introgression; F_ST later, calculated visually.
- 2026-10-09: *"No surprises. Showing how recombination rate & constant migration produce many small chunks, while pulsed migration leaves chunks whose size is proportionate to the time since the migration pulse & the recombination rate is what I want to show students."*
- 2026-10-09: *"It should be visual, the goal is the color choice is to make it visible to students who don't need to quantify it precisely to understand what's happening."*
- 2026-10-09: *"The h/s slider just allows students to investigate how selection interacts with these processes."*
- 2026-10-09: beads on a string, each bead an allele in its own shade, hue = population it arose in.
- 2026-10-09: *"we aren't trying to trick or assess students in these homeworks ... We're trying to build intuition."*
- 2026-10-12: heterozygosity to connect to drift, F_ST; reinforce drift, selection, mutation (brief above).

## Do not

- Plot chunk size against migration rate, or build a stage around a surprise (measured flat; JM: no surprises).
- Read a long fragment as a recent arrival without R beside it: halving R doubles every fragment.
- Print 1/(1 + 4Nm) beside two populations' F_ST (measured: it is 1/(1 + 16Nm)).
- Fuse the two F's: C's F_ST is drift between populations; lesson 11's 1 - Ho/He within one stays near 0 under random mating.
