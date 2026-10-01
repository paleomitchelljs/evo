# Lesson 14 — the genetics of selection: reading real genetic data with the tools from 1-13

**File** · `app/lessons/lesson14.html` — rebuilt from zero 2026-09-30; the births/deaths page is `app/archive/lesson14_2026-09-30.html`
**Checks** · `node scripts/check_lesson14_numbers.js` (37 bars, A and B; ~6.5 min, run in the background) · `python3 scripts/check_lessons.py`
**Status** · A and B built (`version: 5`, `scaffold: 10`, one bit per attempt); C-E planned; page locked
**Last touched** · 2026-09-30

## What the lesson is

- JM, 2026-09-30 (night), the brief this plan answers: *"integrate real world data with the tools we built for students in lessons 1-13 to show how the activities and simulations they've run can help them understand real world data (or simulated data similar to what you would encounter). Selective sweeps, dN/dS, linkage disequilibrium, allelic diversity, etc are meant to be the data they look at and try to predict using widgets and models they've practiced with in prior lessons. This is also meant to be a clean stepping stone on to the mutation exercises coming next. I'd like realistic selective regiems, like fluctating selective gradients and frequence dependent selection, to play some role in at least some of the parts and Drift should be incorporated as an important process."*
- Earlier the same day (still standing): takeaway *"The **rate** of selection and how it manifests geneticaly (increased homozygosity & broader linkage disequilibrium when fast)"*; *"A split of both human-health-related and ecologically-relevant examples is ideal"*; *"Any stage that can clearly link the 'background' skills ... to the sort of data students may actually encounter ... is gold"*; *"forward-looking stages ... MRCA-for-an-allele and different ancestry for different loci"*.

## Rulings (JM, 2026-09-30, night)

- Order: *"I don't have a strong view yet."* A-E as proposed.
- *"There's no need to flag simulated data--this is a student homework problem set."*
- *"modifying the data to be easier to fit in simulations / give cleaner results is fine; our purpose is pedagogical as I just want students to know what real (or realish) data look like, and how the processes they've been practicing manifest."* So a record may be made by the page's own engine at a hidden setting, with a known truth: windows sit on the truth's measured spread, and the record shown is a run near the truth's means.
- r and K: *"It's fine--r and K don't matter here."* (`REVISIONS_PLANNED.md` row 5 now points at the archived page.)

## The rule this plan follows

- **The data is the target; an old widget is the tool.** Each stage puts one kind of genetic data on the Predict card (real, or simulated to look like what a lab would get). The controls are a widget from 7-13, extended by one argument. Go runs it; the run is drawn in the same form as the data; hit = inside the data's window.
- **No new widget families.** The earlier plan's new apparatus (Price-along-the-chromosome plot, ROH strip, a fresh haplotype viewer) is cut or replaced by the old widget that already does it (below).
- **Drift is a lever in every stage** (N, or the population the data came from). **Regimes vary by round**: constant, fluctuating (real rain), switched off (drug withdrawn), frequency-dependent.
- **Two readings per target where possible** (lesson 7's rule: score beak AND count): one the drift sets, one the selection sets. Measured below that each pair separates.
- **Targets sit on scale-free readings of real data.** A 1,000-diploid sim cannot match human-scale parameters; it can match a frequency, a ratio of near to far, a carrier-to-non-carrier stretch ratio, a count of alleles, a dN/dS.

## Stages (proposed): a timescale ladder, years to millions of years, ending at mutation

    A  one allele, year by year      frequency series vs rain        12 B's locus + real rain + 13's diagram  fluctuating   (built)
    B  what a sweep leaves           diversity along a chromosome     12 B's locus on a chromosome + 11's H     constant   (built)
    C  what travels together         haplotypes, hitchhikers (LD)     12 C's race + 11 E's painted chromosomes   drug on/off
    D  how many alleles stay         allele counts, the bump          12 C's race (many alleles) + 12 D's input  frequency-dependent
    E  counting fixed changes        dN/dS                            12 D's mutation curve + 10's 1/2N          purifying / relaxed / arms race

### A — one allele, year by year (fluctuating selection vs drift) — BUILT 2026-09-30

- Data card: an allele's frequency by year, under the year's rain bars.
- Tool: lesson 7's rain → seeds → beak (they fitted it) with a beak gene added on 13 C's genes + environment DAG; N from 10. Arrow being set: rain → the gene's fitness.
- Rounds: constant push; the real Daphne rain (1973-2012, in repo); the 2004-05 reversal (lesson 7 D's newcomers = *G. magnirostris*); small N.
- Two readings: **where it ends** (spread set by N) and **whether its yearly moves track the rain** (set by the push). Measured: the first does not separate them, the second does.
- Round worth having: "keep both alleles for 500 years of this rain". Drift alone fails; one homozygote held fixed fails faster; both homozygotes swinging with the heterozygote between them holds (measured). Hands D its question.
- Real, ecology: **HMGA2** in *G. fortis*, 2004-05 drought (Lamichhaney et al. 2016): s = 0.59 against the large-beak allele; 27% of beak-size variance; 133 birds genotyped; ~30% of the drought's beak shift. Genotype counts to transcribe (Fig. 4 / supplement): JM checks.
- Simulated look-alike: a seasonal fly series (Bergland et al. 2014: hundreds of SNPs moving 4-8% spring to fall, three years).
- Price link: the DAG's cov(w, z) bell flips sign with the rain; E(wΔz) sits at 0 (Mendelian copying).

- **As built** (supersedes the bullets above where they differ): lesson 12 B's one locus (fitness 1, 1 − hs, 1 − s, h held 0.5) with s = −push × dryness each year; dryness = −scale(log(rain + 10)), the real Daphne rain 1973-2012 from `data/clean/grant_rainfall.csv`. No lesson 7 seeds model, no newcomers (the 2004-05 reversal muddled the readings: it moved the miss as much as N did). Diagram: rain → big-beak allele (signed push), chance → big-beak allele (thicker = fewer birds; the chance box says "which of N birds breed"). Top: frequency by year over rain bars | 12 B's bars for the year (hover a year). Card: each year's change against that year's dryness, record (black) and run (purple), a least-squares line each; two gauges with windows: the line's rise from the wettest year to the driest, and the typical miss from it (lesson 3's mean absolute miss).
- **Rounds** (push, birds): rain 0.30, 1,002 · chance 0, 63 · both 0.30, 80 · faint 0.08, 1,589 · wet −0.16, 632. Opening push 0, 252 birds. Windows = truth mean ± 2.2 sd of each reading (400 runs). Truth hits 0.91-0.97; no grid setting clears two rounds at ≥ 50% (231 settings); the opening clears none; push right with chance at the opening: 0-14%.
- **Trap, measured:** with the opening at 200 birds, "both" at 0.24/100 and "wet" at 317, setting the rain arrow alone cleared "both" 55% and "wet" 60%. The miss window spans ±~14 chance steps; every round's population now sits ≥ 20 steps from the opening.

### B — what a sweep leaves (diversity along a chromosome) — BUILT 2026-09-30

- **As built** (supersedes the bullets below where they differ): 12 B's locus (1, 1 − hs, 1 − s, h 0.5, s = −advantage) as bit 50 of a chromosome of 101 markers 40 kb apart (4 Mb), packed in 4 words, crossover 0.001 per gap per meiosis (drawn as geometric gaps), plus 64 unlinked markers in 2 words ("the rest of the genome"). One new copy; lost copies restart from the same founders and are counted. Stops when the new allele first reaches the round's frequency. Diagram: advantage → new allele, chance → new allele (headcount on the box). Top: 40 chromosomes, record | run, carriers on top, minor allele dark | the sweep curve, lost copies in red. Card: diversity along the chromosome in 200 kb windows (record dots, run line); gauges: diversity in the rest of the genome, and the stretch two carriers share (Mb).
- **Go runs three populations**, draws the first; the gauges show three dots and a ring; the average is judged (lesson 7's typical-of-three).
- **Rounds** (advantage, individuals, stop): fast 0.3, 992, 95% · slow 0.02, 992, 95% · mid 0.1, 492, 95% · small 0.05, 105, 95% · **lactase (real)** 0.15, 126, 74%. Opening 0.05, 380. Windows = mean ± 2.2 sd of three-population averages (60 Go's).
- **Lactase record = `data/clean/lct_scan.json`** (`scripts/make_lct_scan.py`, 1000 Genomes, streamed with `fetch_1000g_region.py`): CEU/YRI diversity in 21 windows; 198 CEU haplotypes at 100 markers (YRI MAF ≥ 0.2, one per 40 kb bin = the sim's spacing); background from three distant 500 kb stretches of chr2 (0.67, 0.75, 0.86 → 0.76). Page measures carriers' stretch 1.57 Mb, non-carriers 0.29. The setting that reproduces it (0.15, 126, 74%): rest 0.76, stretch 1.66 Mb.
- **Measured traps:**
  - Crossover 0.0005 per gap: a fast sweep reaches the chromosome's far end (far markers 0.72 of the start where chance alone leaves 0.97); nothing on the chromosome reads chance alone. Hence 0.001 and the unlinked markers.
  - Diversity near the gene (or the dip's half-width) as a reading: run-to-run spread about half its mean. Dropped; stays on the picture.
  - One population per Go: one setting cleared three of five rounds; the small round's windows covered most reachable readings. Three per Go: most a setting clears is two (0.07, 151: small and lactase at 50% each, because they are measured at 95% and 74%).
  - Small at 151 individuals overlapped lactase in both readings; at 105 its rest of the genome (0.41) clears lactase's (0.76).
- **Not built from the plan:** dominance rounds, soft sweeps, drug withdrawn (the dip refilling). Shifting regimes go to C.

- Data card: diversity in windows along a chromosome; and how far two copies of the same allele stay identical (shared stretch).
- Tool: 12 B's one locus (h, s, N, F) on a chromosome of markers; r set as lesson 9 C's crossover marks (log steps: everything happens below 0.01 per gap); 11 A/D's heterozygosity as the readout.
- Two readings: **far from the site** (N: markers lose heterozygosity as 11 D's lines did) and **the dip** (s, h, r). Small N: no dip to see.
- Rounds: fast/slow, dominant/additive/recessive, soft (standing variation), drug withdrawn (the dip refills: measured), drift only (whole chromosome low, no dip).
- Real, health (**in hand, measured below**): **lactase**, 1000 Genomes phase 3, rs4988235 (−13910 T). Europeans' diversity near LCT falls to 0.2-0.45 of West Africans'; far away it is 0.67-0.86 (drift: the out-of-Africa bottleneck). T carriers share ~250 kb; C carriers ~5 kb.
- Real, ecology: peppered moth *cortex* insertion dated to 1819 by its stretch (van't Hof et al. 2016), as a citation panel, or a simulated look-alike.
- Price link (13): for a marker, cov(w, z) comes only through linkage; recombination is its E(wΔz). Hitchhiking = lesson 8's confound.

### C — what travels together (hitchhikers, haplotypes, LD)

- Data card: trajectories of many mutations at once (lockstep cohorts), and haplotypes as painted chromosomes.
- Tool: 12 C's race (several new alleles, coloured) on 11 E's painted chromosomes (segments coloured by founder; JM's 11 E text already says *"The existence and size of these chromosomal chunks is driven by the recombination rate relative to the rate of other forces"*). r from 9 C. "Travels with" arrow on the DAG, display only.
- Rounds: no recombination (bacteria); low; free. A slightly bad neighbour dragged along (16's numbers). Two good mutations on different backgrounds: without recombination one is lost (the suboptimal winner). Drug on, then off.
- Drift: the dragged bad allele fixes more in small N; two-good-mutation interference is a race decided by chance early.
- Real, ecology/evolution: **LTEE** trajectories (in repo, `ltee_allele_freqs.csv`): cohorts rise together, silent ones among them.
- Real, health: **Pf7** (measured): kelch13 Thailand 0/35 (2001) → 86/115 with 12 alleles (2012) → 19/19 with 2 (2017); crt 76T Kenya 32/35 (1995) → 3/62 (2014) after chloroquine stopped (1999).
- Coalescence groundwork: click a position, rows repaint by ancestor at that position; count of ancestors (1 at a hard sweep's site, many far away; several after a soft sweep).

### D — how many alleles stay (frequency dependence, heterozygote advantage, drift)

- Data card: number of alleles a population holds; and the scan again, now with a bump instead of a dip.
- Tool: 12 C's race grown to many alleles, with 12 D's new-allele input and N. Frequency rules: rare-type advantage (the meadow's visitors from 12 A / 13 B learning to avoid the common colour); "a pollen grain cannot fertilise a plant that shares its allele"; overdominance (12 B's h above 1).
- Two readings: alleles held (N vs the rule) and the bump near the site (same display as B, opposite sign).
- Rounds: neutral (drift takes them); fluctuating rain (keeps two only when both homozygotes swing: from A); rare-type advantage; overdominance; malaria removed (HbS falls slowly: the harm is recessive).
- Let it break: 45 alleles in ≤ 1,000 plants is out of reach at sane mutation rates (measured), which is Wright's own 1939 puzzle.
- Real, ecology: ***Oenothera organensis*** ≥ 45 self-incompatibility alleles in ≤ 1,000 plants (Emerson 1938-39; Wright 1939). **Orchid *Dactylorhiza sambucina***, yellow/purple, rare colour reproduces better (Gigord et al. 2001, PNAS, open at PMC33454): array numbers to transcribe, JM checks.
- Real, health: **HbS** (Piel et al. 2010 layer); **HLA** allele counts (IPD-IMGT/HLA, GitHub).

### E — counting fixed changes (dN/dS) → mutation

- Data card: dN/dS for gene classes.
- Tool: 12 D's mutation curve (drag the average s and spread of protein-changing mutations; silent ones are neutral) + 10's fixation (1/2N) + N.
- Two readings: dS (silent changes fixed per site per generation = the mutation rate, measured on the page: the step into the mutation lessons) and dN/dS.
- Rounds: purifying; relaxed (small N: drift lets the slightly bad through, measured); recurrent advantage (host immunity favours the rare antigen: D's frequency dependence again).
- Real: **LTEE** fixed protein-changing vs silent (in repo; derive the neutral expectation from REL606 first); **flu H3N2 HA** epitope vs rest (Nextstrain JSON); **HLA** binding-site codons vs the rest (Hughes & Nei 1988).

## Links to earlier lessons (the "gold")

- Rain → the gene's fitness is lesson 7's arrow with a gene under it (A); the DAG and its Price bells are 13 C/D.
- Hitchhiking is lesson 8's confound; recombination breaks it as swapping the eggs did (B, C).
- A sweep is F at one spot: 11's heterozygosity read along a chromosome (B).
- Painted chromosomes and "different ancestors at different positions" are 11 E's picture (C).
- dS is the control group: 10's 1/2N against 12 D's "which new mutations stay" (E).

## Measured, 2026-09-30 night (scratchpad prototypes, not the page)

**Lactase, 1000 Genomes phase 3 (GRCh37), fetched by HTTP range request: 6.7 MB for chr2:136.0-137.2 Mb, 31,664 SNPs, no htslib.** Diversity = Σ 2pq per kb:

      window (Mb)   136.0  136.1  136.2  136.3  136.4  136.5  136.6  136.7  136.8  136.9  137.0  137.1
      Utah Eur.      0.18   0.23   0.14   0.10   0.30   0.37   0.29   0.16   0.40   0.49   0.76   0.83
      Yoruba         0.65   0.88   0.64   0.57   0.67   0.90   0.71   0.60   0.67   0.93   1.10   1.42

- Far windows (133.0, 139.5, 120.0 Mb, 500 kb each): Utah Eur./Yoruba 0.75, 0.86, 0.67. Near LCT: 0.18-0.45.
- rs4988235 T (A on the + strand): Utah 0.74, British 0.72, Finnish 0.59, Yoruba 0.00.
- Pairwise shared stretch through the site (mean / median): T-T 250 / 256 kb (Utah), 258 / 244 (British), 259 / 249 (Finnish); C-C 17 / 4, 18 / 6, 25 / 4; Yoruba C-C 9 / 4.
- The dip runs past the 136.0 edge: fetch 134-139 Mb for the page.

**Rain-driven selection vs drift** (real Daphne rain 1973-2012, +1 = a dry year, push × dryness = s for the big-beak homozygote, h 0.5, start 0.5, 39 years):

      N      push   sd of end change   corr(yearly change, dryness) median   runs with corr > 0.3
      50     0      0.283              0.00                                   0.04
      50     0.15   0.280              0.33                                   0.60
      200    0      0.149              -0.01                                  0.04
      200    0.15   0.149              0.60                                   0.99
      1000   0      0.069              -0.01                                  0.03
      1000   0.05   0.068              0.50                                   0.95

- Where it ends cannot tell rain from drift; whether it tracks the rain can, once N ≥ ~200.
- 500-2,000 years of the same rain recycled, N 200, start 0.5. **Whether rain keeps two alleles depends on how the fitnesses swing**:

      fitness scheme                                   push   still mixed at 500 / 2000 years
      drift only                                       0      0.41-0.45 / 0.01
      small homozygote held at 1 (1, 1+hs, 1+s), h .5  0.15   0.35 / 0.00   (big allele lost 0.59 by 500)
                                                       0.3    0.01 / 0.00   (lost 0.99)
      both homozygotes swing (1+s, 1, 1−s)             0.15   0.73 / 0.19
                                                       0.3    1.00 / 0.98   (N 1,000: 1.00 / 1.00)

- Why: the push averages 0 over the record (skew −0.09), but the long-run worth of a genotype is its average log fitness. Held at 1: mean log(1 + s) for the big homozygote is −0.054 at push 0.3, so it loses. Both swinging: the heterozygote is never best in any one year and still beats both homozygotes over the decades (Haldane & Jayakar 1963). A heterozygote advantage that exists only across years: D's question, arriving from A.
- 12's convention (1, 1 − hs, 1 − s, one homozygote at 1) is the first scheme. In 14 A the beak gene's fitness comes out of 7's seeds model, so which scheme the ecology produces is to be measured there, not set.

**Allele counts, self-incompatibility vs neutral** (N plants, 3,000 generations from 40 alleles, mutation to a new allele 4Nμ):

      N      4Nμ 0.1: SI / neutral    4Nμ 1: SI / neutral
      100    9.4 / 1.2                15.4 / 6.5
      500    16.8 / 2.3               26.4 / 8.7
      1000   22.4 / 1.5               36.0 / 6.7

- 7-15× the neutral count; Emerson's 45 not reached at N 1,000 and 4Nμ 1.

**The scan under each regime** (N 500, r 0.0005 per gap, 101 markers, 1,500 generations, 10 runs; heterozygosity / start by distance from the site, gaps 0-2 / 3-7 / 8-15 / 16-30 / 31-50):

      overdominant     0.46  0.29  0.24  0.20  0.21
      rare-type adv.   0.35  0.30  0.19  0.21  0.23
      neutral site     0.14  0.25  0.14  0.19  0.25
      hard sweep s .1  0.02  0.09  0.12  0.14  0.20

- Drug on (s 0.2 for the homozygote) until ~0.88, then off (−0.1), N 1,000: at the peak 0.24 near vs 0.82 far; 105 generations later (allele at 0.09) 0.74 vs 0.80. **A reversed sweep erases its own dip**; only the time series keeps the history.
- Speed: ~2 s a run in plain JS at 1,500 generations, N 500 (40 runs in 72 s). Bit-packed markers (101 in 4 words, crossovers as masks) should be several times faster: not measured. Needed for D's bump; B's sweeps are short.

**dN/dS by population size** (protein-changing s from a gamma, shape 0.2; silent neutral; Kimura fixation, WF check below):

      N               10     30     100    300    1000   3000   10000  100000
      mean s .01     0.87   0.75   0.61   0.49   0.39   0.31   0.25   0.16
      mean s .001    0.98   0.95   0.86   0.74   0.61   0.49   0.39   0.24
      + 1% good .01  0.87   0.76   0.64   0.61   0.77   1.46   4.26   39.9

- WF simulation, 400,000 mutations: N 30 / 100 / 300 = 0.72 / 0.57 / 0.45 against formula 0.75 / 0.61 / 0.49 (diffusion slightly high). Silent fixation 0.0052 at N 100 against 1/2N 0.0050.
- Drift raises dN/dS with the same mutations; a little advantage only shows in large populations.

**Earlier, 2026-09-30 evening (still valid).** Sweep engine, 1,000 diploids, 101 markers, r 0.0005 per gap, hard sweeps conditioned on fixing, 8 each, at 95%:

      sweep                     gens to 95%   run through site   run near vs far   ancestors at site
      s .02  h .5                   718             12.7            10.2 vs 5.3          1
      s .05  h .5                   309             20.8            15.9 vs 4.4          1
      s .1   h .5                   169             26.7            17.9 vs 5.0          1
      s .3   h .5                    70             43.4            21.3 vs 8.9          1
      s .1   h 1 (dominant)         211             25.1            17.5 vs 5.1          1
      s .1   h 0 (recessive)        298             20.4            14.4 vs 5.0          1   (1 in 126 new copies fixes)
      soft, s .1 from 5%            135              7.7             5.4 vs 3.4          7.1
      drift, no s, from 5%         2931             22.1            15.3 vs 11.7         1

- At 400 diploids drift washes out slow sweeps: use 1,000.
- Pf7 (Zenodo `Pf7_samples.txt` + `Pf7_drug_resistance_marker_genotypes.txt`, QC pass, mixed calls out): crt 76T Kenya 1995 32/35, 1998 10/11, 2005 11/26, 2010 25/71, 2014 3/62; Malawi 2011 0/265; Tanzania 2010 22/43, 2014 25/247. kelch13 Thailand 2001 0/35, 2008 35/259 (9 alleles), 2012 86/115 (12), 2013 94/111 (13), 2017 19/19 (2); Cambodia 2007 13/29 (3), 2011 150/297 (7), 2016 162/187 (2), C580Y 161 of 162.
- LTEE metagenomic (PASS; fixed = last three samples ≥ 0.9): normal-rate pops protein-changing 132 : silent 14 fixed, 590 : 109 seen; mutators m2 39:23, m4 447:267, p3 637:317; m1 546:101, p6 1135:173 (mutT spectrum).

## Data

| Source | What | Status |
|---|---|---|
| 1000 Genomes phase 3, chr2 | LCT region, phased | **fetchable now**: `scripts/fetch_1000g_region.py 2 136000000 137200000 out.vcf` (pure-Python tabix over HTTP, tested); clean a derivative to `data/clean/` |
| Grant rain, beak series | Daphne Major | in repo |
| LTEE metagenomic | trajectories, fixed N:S | in repo |
| [Pf7, Zenodo 18711720](https://zenodo.org/records/18711720) | resistance genotypes | downloaded in scratch; clean a derivative |
| Lamichhaney et al. 2016, *Science* 352:470 | HMGA2 genotypes, 2004-05 survivors | transcribe from figure/supplement; JM checks |
| Gigord et al. 2001, PNAS 98:6253 (PMC33454) | orchid arrays, rare-colour advantage | transcribe; JM checks |
| Emerson 1938-39; Wright 1939 | *Oenothera* S-allele count | citation numbers (≥ 45, ≤ 1,000 plants) |
| [Nextstrain H3N2 HA](https://nextstrain.org/seasonal-flu/h3n2/ha/12y) | mutations per branch | direct |
| [IPD-IMGT/HLA](https://github.com/ANHIG/IMGTHLA) | alleles, alignments | direct |
| HbS (Piel et al. 2010) | allele-frequency layer | browser (JM), or citation numbers only |
| REL606 genome | LTEE neutral expectation | direct (NCBI) |
| Ag1000G, HIVDB, Timema (Dryad) | | **dropped** unless JM wants them: each stage has a health and an ecology anchor without them |

## Absorbed / retired

- Lesson 16's linkage plan → B and C (its drag numbers: bad neighbours dragged ~3× less than neutral; all of it below r ≈ 0.01 per gap).
- The 2026-09-25 ruling that dN/dS waits → superseded (E).
- r/K births-deaths page (built A-C) and the FDS-on-births plan → archived at rebuild; frequency dependence lives in D and E.
- From the evening plan, cut: Price-along-the-chromosome plot, ROH strip, the stand-alone "more than one way" stage (its soft sweeps go to B, its Pf7 to C).

## Open for JM

1. **Order and count.** Five stages, short timescale to long, ending at dN/dS → mutation. Alternative: B first (the sweep is the evening takeaway), A second.
2. **Simulated look-alikes.** Where real data are not in hand (fly seasons, moth scan), a simulated "sample" drawn like the real display. Say "simulated" on screen?
3. **Transcriptions** (HMGA2 counts, orchid arrays): Claude transcribes, JM checks against the papers.
4. **r and K** still have no home once the current page is archived (`REVISIONS_PLANNED.md` row 5 names 14 A).

## Items

| # | Stage | What | Status |
|---|-------|------|--------|
| 1 | — | archive the current page (`app/archive/lesson14_2026-09-30.html`, README line); new page from 13's furniture | done |
| 2 | — | chromosome engine, bit-packed (B, C, D share it); painted chromosomes from 11 E | B's engine done; ancestry paint for C todo |
| 3 | A | 12 B's locus with s set by the real rain; diagram; record-vs-run card; checks | done (voice is a placeholder: 202_lec10_01) |
| 4 | B | chromosome engine (bit-packed); scan + shared stretch; LCT derivative `data/clean/lct_scan.json`; SOURCES row | done (voice placeholder: 202_lec19_04, banner 19_04 + 19_05) |
| 5 | C | race on painted chromosomes; LTEE + Pf7 panels; trace-back | todo |
| 6 | D | many-allele race with frequency rules; S-alleles, orchid, HbS | todo |
| 7 | E | mutation curve → dN/dS; REL606 expectation; flu, HLA | todo |
| 8 | — | `check_lesson14_numbers.js` rewritten (A, B: 37 bars); `data/SOURCES.md` rows before any panel ships (LCT done) | doing |
| 9 | — | voice from JM | todo |

## Do not

- Print a dN/dS from the LTEE counts against a guessed 3 : 1; derive the expectation first.
- Run the sweep engine below ~1,000 diploids for slow sweeps.
- Treat a long homozygous stretch as proof of selection: drift makes one too, genome-wide.
- Set a window on a real record's exact value: the record is one realisation (stochastic-bar rule 2); size windows off runs at a setting that reproduces it.
- State that fluctuating selection keeps (or loses) two alleles without saying which homozygote swings: measured both ways on the same rain.
- Add a widget family the earlier lessons do not have.
