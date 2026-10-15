# Lesson 17 — migration: fragments that cross, what sets their size, selection at one gene, four populations and F_ST

**File** · `app/lessons/lesson17.html` — first draft 2026-10-12; second pass 2026-10-15 (JM's review)
**Checks** · `node scripts/check_lesson17_numbers.js` · `python3 scripts/check_lessons.py`
**Status** · second pass built (v2); LOCKS `x`; JM to review; voice still owed
**Last touched** · 2026-10-15

## What the lesson is

- Two populations swapping genomes: the other population's DNA turns up in fragments, cut shorter every generation; selection at one gene keeps it apart, lets it in, or is swamped; then four populations, and F_ST as how differentiated they are.
- Worth protecting: everything read off bead strings (hue = population an allele arose in, shade = which allele), 16's displays; F_ST read as colour (each population its own colour = 1, all the same mix = 0).

## JM's review, 2026-10-15 (verbatim)

> Reviewing lesson 17, I like Part A but I think Part B has targets that are maybe too tight and sliders that could be worded better. It's a single dispersal event at some point in the past. I love the visuals and interactives for B but the framing of the targets is confusing. Part C jumps immediately into using Fst as a measure. I think expanding it to four types of populations (blue, orange, red, purple?) and connecting Fst directly to differences in chunk size/number. I usually teach Fst as how differentiated the populations are, and framing Part C i nthat way--where the goal is to teach them visually what Fst means through interactions--is what I'd prefer over trying to assess their understanding of a measure. D is solid and I am fine with having two populations (maybe we move current D to C and current C to D so we do two-population selection & then do four-population differentiation to learn Fst last). One thing I think would be important for the selection one is somethign that allows a given allele to have different s/h in different populations so that in addition to everything else we can show migration swamping local adaptation in some scenarios.

## JM's brief, 2026-10-12 (verbatim)

> I am wanting a draft of lesson 17 (migration--big goal to look at introgression, haplotypes, and population differentiation ideally using heterozygosity to connect to drift along with Fst and utilizing many of hte same kinds of simulations and displays done in 16 for mutation with the identical by descent blocks). Using the migration lesson to reinforce the prior forces (drift, selection, and mutation) and their key components is ideal.

## JM's outline, 2026-10-09 (verbatim)

> Revised snake chromosome diagram the students are familiar with, but with more loci.
> Two side by side populations, sliders for mutation rate, recombination rate, average h/s of new mutants, migration rate (per gen prob of individuals swapping) and pop size (? Unsure about last one, visually)
> Only difference is popA has mutations from orange spectrum, and popB has mutations from blue spectrum
> Students set up and do 10 runs. Final outcomes shown. Chunks of blue in the orange pop (and vice versa) show introgression
> At the end, students plot "average size of introgressed chunks" against migration rate (recombination rate also matters, but we won't complicate this yet)
> Builds to Fst later which we'll calculate visually

## Stages as built (pass 2, 2026-10-15)

One engine (`mg*`): n populations (2 in A-C, 4 in D) of N hermaphrodite genomes, one chromosome of 40 beads; Wright-Fisher, parents picked by fitness; crossing over R/39 a gap; each generation, for each connected pair, Binomial(N, m) genomes swap. Hue in bits 0-2 (1 orange, 2 blue, 3 red, 4 purple), shade 3-5. No new mutations any more (old C's U went with old C).

    A  Steady migration (unchanged): m and R. Three targets as pass 1.
    B  One dispersal event, some generations back. Sliders: genomes dispersed (each way), crossovers a chromosome,
       generations since the dispersal event. Each round holds the event at 4 each way and frees one slider:
       1 time (R 1 held): fragments 4+ beads; 2 R (20 generations held): 4+ beads; 3 R (5 generations held): under 6 beads.
       Your-runs plot and the shared-fragment pick unchanged.
    C  Old D, two populations: the blue allele at gene 20 has its own s and h in each population (1, 1 - hs, 1 - s; s > 0 harmful there).
       1 local adaptation (m .02 held): orange under 30% blue at gene 20, blue over 70%. 2 swamping (s +.1 / -.6 held):
       orange's gene 20 60%+ blue at 100 (raise m). 3 a sweep that drags little: orange's gene 20 70%+ blue, its ends under 40%, at 60.
       Gene-by-gene and over-time panels show share blue, each population. No F_ST in C.
    D  Four populations, each starting all its own colour (one allele a gene): orange, blue, red, purple. Migration per pair as
       six two-headed arrows (paths.js, `both`), N a slider. Board with each population's colour mix and the pooled mix; within and
       pooled heterozygosity on colour; F_ST overall, over time, and for each pair (grid). Sparrow strip moved here from old D.
       1 alike: F_ST under 0.2 (N 25 held). 2 two pairs: orange-blue and red-purple under 0.2, every cross pair over 0.4.
       3 every pair held at m .01: F_ST over 0.25 (smaller N: drift).

## Measured (node prototype of the pass-2 engine, 2026-10-15; N 25, 40 beads)

        B, pulse of 4 each way, 50 pairs, 4 seeds   average fragment length at G 2 / 5 / 10 / 20 / 40 / 80
          R .25                                     33 / 21 / 14 / 8.5 / 5.6 / 4.9
          R .5                                      28 / 15 / 8.4 / 5.0 / 3.3 / 2.9
          R 1                                       21 / 9.3 / 5.0 / 3.0 / 2.2 / 1.9   (sd of a run's average 0.1-0.2)
          R 2                                       15 / 5.4 / 3.0 / 2.0 / 1.6 / 1.6
          R 4                                       9.2 / 3.1 / 1.9 / 1.5 / 1.3 / 1.4
          pulse size, R 1, G 20: M 1/2/4/6/10 -> other 4/9/16/24/41%, length 2.7/2.8/3.1/3.5/4.4 (neighbouring fragments merge: M held in every round)
        C, h .5 both, 50 pairs, at 100 (orange g20 blue / orange ends blue / blue g20 blue)
          m .02: s 0/0 57/50/57; +.3/0 2/38/18; 0/-.3 79/60/95; +.1/-.1 35/50/66; +.3/-.3 11/43/84; +.6/-.6 6/25/90
          s +.1/-.6: m .005 10%, .01 24%, .02 47-49%, .05 81-82%, .1 95% (orange g20 blue)
          at 60, R 1: s -.3/0 m .005 g20 80 (77-84), ends 30 (26-32); -.6/0 m .002 81 / 19; -.3/0 m .01 93 / 42 (37-47);
          cheap routes: s 0 m .05 51 / 48; +.1/-.6 m .05 71 / 61; 0/-.6 m .05 91 / 64
        D, four populations, 20 sets, at 100, N 25 (F_ST on colour; 6 seeds)
          every pair at m: 0 1.0; .002 .53; .005 .30 (.28-.32); .01 .17 (.17-.18); .02 .09; .05 .04
          two pairs (O-B, R-P) at .02: within .14, across .66; at .01: within .24 (.20-.27); plus B-P .002: across .53 (.49-.57)
          chain O-B-R-P at .02: neighbours .12, ends .30-.35; ring (sides) .02: .15
          every pair .01: N 10 .36 (.34-.38), 25 .17, 50 .09 (drift)
          balance for n islands, m to each of 3: 1/(1 + 4N(3m)(4/3)^2) = .16 / .32 / .09 at N 25 / 10 / 50, m .01 (R panel only)

## Open for JM

1. Voice blocks: none yet, all four stages.
2. D's pairwise F_ST between two populations that share no colour at all sits near 0.67, not 1 (each is itself a mix; F_ST is 1 only when each population is one colour). No target leans on it; say so in lecture or the voice if it comes up.
3. Mutation is no longer in the lesson (old C's U went with old C). Add it back to D?
4. B's rounds each free one slider with the dispersal event held at 4 each way; the pulse-size slider is free only in practice and after the targets.
5. 16 D's inversion riding in a migrant: not built.

## Items

| # | Stage | What | Status |
|---|-------|------|--------|
| 1 | — | prototype engine, measure A-D (pass 1) | done |
| 2 | A-D | build the page (pass 1) | done |
| 3 | — | `check_lesson17_numbers.js` (pass 1) | done |
| 4 | B | dispersal-event wording; one idea a round, wider windows (JM 10-15) | done |
| 5 | C | old D moved here; s and h of the blue allele per population; swamping round (JM 10-15) | done |
| 6 | D | four populations, F_ST as differentiation, per-pair migration on a diagram; old C retired (JM 10-15) | done |
| 7 | — | engine generalised to n populations; prototype measurements above | done |
| 8 | — | checks rewritten for B-D; version 2 | done |
| 9 | — | JM's review; voice | todo |

## Rulings

- 2026-10-08: 17 is migration; IBD blocks and haplotypes lead into it.
- 2026-10-09 (outline): two populations side by side; orange and blue spectra; 10 runs; chunks show introgression; F_ST later, calculated visually.
- 2026-10-09: *"No surprises. Showing how recombination rate & constant migration produce many small chunks, while pulsed migration leaves chunks whose size is proportionate to the time since the migration pulse & the recombination rate is what I want to show students."*
- 2026-10-09: *"It should be visual, the goal is the color choice is to make it visible to students who don't need to quantify it precisely to understand what's happening."*
- 2026-10-09: *"The h/s slider just allows students to investigate how selection interacts with these processes."*
- 2026-10-09: beads on a string, each bead an allele in its own shade, hue = population it arose in.
- 2026-10-09: *"we aren't trying to trick or assess students in these homeworks ... We're trying to build intuition."*
- 2026-10-12: heterozygosity to connect to drift, F_ST; reinforce drift, selection, mutation (brief above).
- 2026-10-15: A stays. B: *"a single dispersal event at some point in the past"*; targets less tight, framing less confusing. Two-population selection becomes C, with *"a given allele"* having *"different s/h in different populations"* so migration can swamp local adaptation. Four populations (orange, blue, red, purple) last, F_ST taught as *"how differentiated the populations are"*, visually, *"over trying to assess their understanding of a measure"*.

## Do not

- Plot chunk size against migration rate, or build a stage around a surprise (measured flat; JM: no surprises).
- Read a long fragment as a recent arrival without R beside it: halving R doubles every fragment.
- Free the pulse size in a B round with a floor on fragment length: big pulses merge neighbouring fragments (M 10 at G 20 reads 4.4 beads, M 4 reads 3.1).
- Put F_ST in C (JM: it came too early); D builds it.
- Fuse the two F's: D's F_ST is between populations; lesson 11's 1 - Ho/He within one stays near 0 under random mating.
