# Lesson 17 — migration: chunks that cross, what sets their size, and F_ST

**File** · `app/lessons/lesson17.html` — not started
**Checks** · `node scripts/check_lesson17_numbers.js` (to write) · `python3 scripts/check_lessons.py`
**Status** · outline, JM's rulings of 2026-10-09 applied (beads, hue by population); three open points; nothing built
**Last touched** · 2026-10-09

## What the lesson is

- Two populations swapping a few individuals a generation: pieces of one population's chromosomes turn up inside the other's, and recombination cuts them smaller every generation.
- Worth protecting: the chunks are watched forming and shrinking, then measured off the student's own runs; F_ST comes after, read off the same pictures.

## JM's outline, 2026-10-09 (verbatim)

> Revised snake chromosome diagram the students are familiar with, but with more loci.
> Two side by side populations, sliders for mutation rate, recombination rate, average h/s of new mutants, migration rate (per gen prob of individuals swapping) and pop size (? Unsure about last one, visually)
> Only difference is popA has mutations from orange spectrum, and popB has mutations from blue spectrum
> Students set up and do 10 runs. Final outcomes shown. Chunks of blue in the orange pop (and vice versa) show introgression
> At the end, students plot "average size of introgressed chunks" against migration rate (recombination rate also matters, but we won't complicate this yet)
> Builds to Fst later which we'll calculate visually

## Measured before planning (2026-10-09; node prototype, `scripts/proto_lesson17_chunks.js`, not the page)

Two populations of N 25, one chromosome of 100 loci, origin painted per locus; Wright–Fisher, neutral; R crossovers a meiosis (Poisson); each individual swaps with one in the other population with probability m a generation. 20 runs a setting; chunk = a run of the other population's loci on one chromosome.

        100 generations (4N), R 1       m 0.002 / 0.005 / 0.01 / 0.02 / 0.05 / 0.1 / 0.2
          mean chunk length (loci)       4.7 / 5.1 / 5.3 / 4.9 / 4.9 / 4.7 / 4.5      flat
          chunks a population            200 / 308 / 444 / 503 / 532 / 553 / 563
          share of loci foreign          18 / 31 / 45 / 48 / 50 / 50 / 50 %           rises, saturates by m ~0.02
        100 generations, m 0.01          R 0.5 / 1 / 2:  mean length 9.4 / 5.3 / 3.3   halves as R doubles
        50 generations, R 1              m 0.005-0.2: 6.2-7.2 (flat); m 0.002: 8.5 ± 5.5, 4 of 20 runs no chunk
        one pulse (5 of 25 swap once), R 1    5 / 10 / 20 / 40 / 80 generations later: mean length 30 / 13 / 8.2 / 4.6 / 4.3

- **Chunk size against migration rate is flat.** Under steady migration a chunk's length is set by how long it has been cut (generations × crossovers); migration rate sets how many chunks and how much of the genome, not how long they are. (JM's end plot is now against time since a pulse and against r.)
- Recombination and time since arrival both move chunk length strongly. The foreign share moves with m.
- Length stops shrinking after ~40 generations at N 25: a chunk can only be cut against a chromosome of the other colour, and drift makes both copies the same colour more and more often.
- Not yet measured: selection (h/s); F_ST.

At bead-string scale (same prototype, N 25, 20 runs a setting):

        40 beads, steady, 100 gens, R 1    m 0.001 / 0.002 / 0.005 / 0.01 / 0.02 / 0.05
          fragments a population            97 / 139 / 231 / 300 / 341 / 333        more with m, level once fully mixed
          mean size (beads)                 2.6 / 2.8 / 2.9 / 3.0 / 2.9 / 3.1        flat
          other hue                         12 / 18 / 33 / 43 / 48 / 51 %
        40 beads, one pulse                 t 5 / 10 / 20 / 40 generations after
          R 0.5                             19 / 10.5 / 6.3 / 3.8 beads
          R 1                               11 / 6.0 / 3.7 / 2.3
          R 2                               7.7 / 3.4 / 2.1 / 1.8
        60 beads: the same shapes (steady 3.2-3.8 beads; pulse R 1: 18 / 9.3 / 4.4 / 3.0)

- 40 beads is enough: steady fragments are 2-4 beads, a fresh pulse's are a quarter to half a chromosome. A pulse's fragments are whole until the first hybrids make gametes (a pure migrant's gametes are all one hue), so cutting starts a generation or two after the pulse.
- Fragment count rises with m and stops once the two populations are fully mixed (m ~0.02 at N 25 over 100 generations): keep m's slider below that, or let E show the mixing as F_ST falling to 0.

## Stages (outline; JM's rulings of 2026-10-09 applied)

One interactive throughout, 15's snake chromosomes with more loci (JM, 2026-10-09): beads on a string, each bead an allele in its own shade, the hue (blue / orange) the population the allele arose in. A genome from one population is all blue or all orange; a mix shows as fragments of the other hue. Sliders free to explore wherever they make sense; targets, where any, generous and on outcomes.
- Every bead needs an allele from generation 0: each population starts with a few founder alleles a locus, in its own hue (15 started loci with 1-3 alleles).
- A new mutation takes the hue of the population it arises in, even on a fragment from the other one: a lone off-hue bead inside a fragment, rare at low U.
- Shades of the course's blue and of 14's orange (`#e8730c`, lesson 14 B's bead list): no new palette.

    A  Steady migration. Sliders m and r. Many small chunks, and more of them the higher m; lower r, longer chunks. A plot beside the populations: the share of each population in the other's colour, and the average chunk size, generation by generation.
    B  One pulse. A batch of migrants once, then none. A few long chunks, cut shorter every generation; lower r, slower. The same plot: chunk size falling with time since the pulse, one line per run so two r's sit on one axis.
    C  The 10 runs (JM's outline): set up, play, final outcomes side by side. The student's own plot: average chunk size against generations since the pulse, and against r -- both falling, plainly. Steady and pulsed runs on one plot: steady sits low and flat, pulsed falls toward it.
    D  Selection: U and h/s (JM: "just allows students to investigate how selection interacts with these processes"). No story imposed; the same setups with selection on.
    E  F_ST, visually (JM: stage E of 17): each locus's frequency in the two populations side by side; the gap as a share of the spread; 1/(1 + 4Nm) beside the measurement. Real anchor: the Italian sparrow scan.

Notes for the build:
- A pulse's chunks shrink as 1/(r · time) only while the populations are still mixed: at N 25 the cutting stops after ~40 generations (drift makes both copies of a stretch the same colour, and a crossover between two same-colour copies cuts nothing). Keep a pulse's window to ~5-40 generations at N 25, or measure a larger N.
- The textbook mean, L / (1 + R t), understates a pulse's chunks here (measured 30 loci at t 5 against 17): a chunk is cut only when paired with the other colour. Measure before printing any formula beside it.
- Under steady migration the average chunk size settles at a level set by r (and the run's length), whatever m is: say nothing that ties chunk size to m.
- On the page: fragments get *smaller* the longer since the migrant ancestor and the higher r (JM's "size proportional to time since migrant ancestor + recombination rate" is the dependence, inverse).

## Open for JM

1. N: a slider throughout, or held (e.g. 25: 4N = 100 generations a run, 50 rows a population) until E, where 4Nm needs it?
2. 16 D (IBD blocks, dating an arrival from its blocks): fold into 17 B instead of building it in 16?
3. The inversion from 16 C riding in a migrant (its stretch never cut): in B, or not at all?

## Sources (earlier plans, archive, data)

- 16 D proposal (`lesson16_overhaul.md`): a migrant's chromosomes painted in its own colour, chopped into shorter blocks shared among its descendants (IBD); date the arrival from block length; its inverted stretch (from 16 C) never breaks, so the longest block is not the youngest.
- 2026-10-01 brief: *"17(?) identical by descent blocks, haplotypes, runs of homozygosity"*. Runs of homozygosity have no home yet (a chunk is IBD; a run of homozygosity is two IBD copies in one individual: 11's F read along a chromosome).
- `app/interactives/descent.html`: coalescence by position (`coalesceAt`), *"Identity by descent and coalescence are the same fact read in two directions"*.
- 15: the bead-string chromosomes (two strings of seven genes a snake, mother's above), drawn in `drawPed`. 9: the meiosis bench. 14 B/C: haplotype rows. 16 B: the copy / meiosis bench and two populations side by side.
- Archive, sources only: old 16 "Spreading or staying" (`app/archive/lesson16.html`: two populations drift apart; a few move; work back to m from F_ST; Italian sparrows; a cod F_ST round).
- Data: `data/clean/italian_sparrow_loci.csv` (77 loci, house / Spanish / Italian frequencies, house–Spanish F_ST 0.06-1.00, mean 0.54). `data/clean/fsj_cohort_sizes.csv`: Florida scrub-jay immigrants a year, 5.4% of the population on average (13% in 1992, 3-7% in the 2010s): a real m, a year rather than a generation. `data/clean/isle_royale.csv`: wolves + ice bridges (1997 migrant; 2018-19 re-founding). `scripts/fetch_1000g_region.py`: phased 1000 Genomes regions; whether admixed samples give local-ancestry chunks without a reference panel is unmeasured.

## Items

| # | Stage | What | Status |
|---|-------|------|--------|
| 1 | — | JM settles the three open points | todo |
| 2 | — | prototype the pulse at N 25 / 50 (window where chunks keep shrinking), and with h/s on | todo |
| 3 | A-E | build, A first | todo |

## Rulings

- 2026-10-08: 17 is migration; IBD blocks and haplotypes lead into it.
- 2026-10-09 (outline): two populations side by side; orange and blue spectra; 10 runs; chunks show introgression; F_ST later, calculated visually.
- 2026-10-09: *"No surprises. Showing how recombination rate & constant migration produce many small chunks, while pulsed migration leaves chunks whose size is proportionate to the time since the migration pulse & the recombination rate is what I want to show students."*
- 2026-10-09: *"It should be visual, the goal is the color choice is to make it visible to students who don't need to quantify it precisely to understand what's happening."*
- 2026-10-09: *"The h/s slider just allows students to investigate how selection interacts with these processes."*
- 2026-10-09: F_ST is stage E of 17.
- 2026-10-09: *"I'm envisioning a system just like the snakes, but with more loci. So a beads-on-a-string style of chromosome, where each bead is color coded by its mutation (given a different shade), with the hue (blue vs orange) based on the population. So that when you look at a genome you see all blue (if purely pop 1) alleles at each locus, or all orange (if purely pop 2), or a mix (number of fragments proportional to migration rate, size of fragments proportional to time since migrant ancestor + recombination rate)."*
- 2026-10-09: *"we aren't trying to trick or assess students in these homeworks, we're trying to give them adaptable interactives that clearly illustrate processes, and give them the freedom to explore the setups we give them ... We're trying to build intuition."*

## Do not

- Plot chunk size against migration rate, or build any stage around a result meant to surprise: measured flat (above), and JM: no surprises.
- Read a long chunk as recent arrival without the recombination rate beside it: halving r doubles every chunk.
