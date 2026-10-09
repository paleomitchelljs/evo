# Lesson 17 — migration: chunks that cross, and what sets their size

**File** · `app/lessons/lesson17.html` — not started
**Checks** · `node scripts/check_lesson17_numbers.js` (to write) · `python3 scripts/check_lessons.py`
**Status** · outline (JM 2026-10-09 + earlier plans); open points below; nothing built
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

- **The planned end plot is flat.** Under steady migration a chunk's length is set by how long it has been cut (generations × crossovers); migration rate sets how many chunks and how much of the genome, not how long they are. A student's 10 points against m will scatter around a level line.
- Recombination and time since arrival both move chunk length strongly. The foreign share moves with m.
- Length stops shrinking after ~40 generations at N 25: a chunk can only be cut against a chromosome of the other colour, and drift makes both copies the same colour more and more often.
- Not yet measured: mutations (orange / blue spectra) as the only marker; selection (h/s); F_ST.

## Proposed stages (mine, for JM to cut)

    A  The two populations, painted. Sliders m and r (N held). Rolls with practice; targets on outcomes, e.g. "a quarter of the orange population blue by generation 100" (m), "blue chunks in the orange population averaging over 8 loci" (r, or fewer generations).
    B  The student's 10 runs → their own plots, a fitted line and its interval on each: chunk length against m (flat: it does not predict), against r (it does). Causal inference on their own data, the course's throughline. JM's plot kept, as the surprise.
    C  One arrival (16 D's proposal moved here): a single migrant, its chunks halving and halving again; read the arrival date off chunk length (rerun six times). Option: the migrant carries 16 C's inversion, and its inverted stretch never breaks.
    D  Mutations and selection (U, h/s): what the h/s slider is for is open (below). Real anchor: Isle Royale's 1997 migrant wolf (counts + ice bridges in `data/clean/isle_royale.csv`).
    E  F_ST, visually: each locus's frequency in the two populations side by side; the gap between them as a share of the spread; 1/(1 + 4Nm) printed beside the measurement. N becomes a slider here (4Nm). Real anchor: the Italian sparrow genome scan (77 loci, house–Spanish F_ST bimodal, the Italian sparrow a mosaic). Here or in 18.

## Open for JM

1. The end plot: keep chunk length against m as a deliberate surprise and follow it with r (proposed B), or plot share foreign against m and chunk length against r, or chunk length against time since one arrival (C)?
2. Read chunks off the mutations only (as real data does: blue alleles in an orange genome), or paint each locus by origin with the mutations as dots on top? Dots alone: chunk edges fall somewhere between two dots, and at low U nothing shows.
3. N: hold it (e.g. 25: 4N = 100 generations a run, 50 rows a population) until F_ST, where 4Nm needs it?
4. h/s of new mutants, which story: harmful changes drifting up in a small population and migrants carrying the fix (genetic rescue); a beneficial change crossing over and dragging its chunk (adaptive introgression); or a locus good in one population and bad in the other, so chunks around it are kept out (a barrier, an F_ST peak)? The last needs a second difference between the populations beyond colour.
5. F_ST as 17 E, or lesson 18?
6. 16 D (IBD blocks, dating an arrival): fold into 17 C instead of building it in 16?
7. "10 runs": one point per run at whatever the student set, or 10 runs at one setting (a replicate panel), repeated?

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
| 1 | — | JM settles the open points | todo |
| 2 | — | prototype with mutations as the marker (open 2) and with h/s (open 4) | todo |
| 3 | — | stages, then build | todo |

## Rulings

- 2026-10-08: 17 is migration; IBD blocks and haplotypes lead into it.
- 2026-10-09: two populations side by side; orange and blue spectra; 10 runs; chunks show introgression; F_ST later, calculated visually.

## Do not

- Tell students chunk length tracks migration rate: measured flat (above).
- Read a long chunk as recent arrival without the recombination rate beside it: halving r doubles every chunk.
