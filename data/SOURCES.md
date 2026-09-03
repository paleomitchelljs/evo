# Data sources

Running log of every external dataset referenced in a lesson or simulator
comparison. Add an entry *before* the dataset appears in a lesson.

**Convention.** Each entry records:

- **Citation.** Full reference.
- **URL / DOI.** Where to (re-)fetch the raw data.
- **What it is.** One-paragraph description of the measurements, units,
  coverage, and known quirks.
- **Used in.** Lessons / simulator steps that reference it.
- **Clean derivative.** Path under `data/clean/` (CSV + JSON pair), or
  *"not yet cleaned"* with a note about the intended shape.
- **Redistribution.** Whether the raw file can live in this repo; if not,
  how to re-fetch.

Cleaned derivatives follow the `finch_beak.{csv,json}` / `finch_pop.{csv,json}`
shape already in `data/clean/`: long-format CSV with an explicit `year` (or
equivalent) column, plus a JSON of the same rows for direct browser
consumption.

---

## Grant & Grant (2014) — Darwin's finches, Daphne Major

- **Citation.** Grant, P. R. & Grant, B. R. (2014). *40 Years of Evolution:
  Darwin's Finches on Daphne Major Island.* Princeton University Press.
- **URL / DOI.** Companion data package, Princeton University Press.
- **What it is.** Annual beak morphology (length, depth, width) and
  population counts for *Geospiza fortis* and *G. scandens* on Daphne Major,
  1973–2012. Plus rainfall, seed abundance by size class, individual-level
  morphology at select time points, and selection / survival / pedigree
  files. See `data/guide_to_grant_data.txt` for the full per-figure index.
- **Used in.** Lesson 3 (empirical Step D); **Lesson 5 throughout** (the two
  species compared as individuals in one season, then as forty annual means,
  then against the seed crop); **Lesson 6 stages B and C** (the *scandens* count
  series against annual rainfall — *scandens* rather than *fortis* because its
  counts swing less year to year, so a 37-year forward run can track them at all);
  and the target time series for the IBM parameterization work.
- **Clean derivative.**
  - `data/clean/finch_beak.csv` / `.json` — annual beak means for fortis
    and scandens (from Fig. 01-06 and Fig. 01-07).
  - `data/clean/finch_pop.csv` / `.json` — annual population counts for
    both species (from Fig. 14-03).
  - `data/clean/finch_individuals.csv` / `.json` — 2,215 individually banded
    birds measured in four field seasons (1975, 1987, 1991, 2012), columns:
    year, species, band, beak_length, beak_depth (from the four
    `Fig. 10-03 data, NN.csv` files, whose headers differ between seasons).
    Lesson 5 stage A uses the 1987 season alone: 787 fortis, 156 scandens.
  - `data/clean/finch_seeds.csv` / `.json` — 16 annual seed counts, 1976–1991,
    columns: year, small_seeds, large_seeds, large_share (from Fig. 04-13).
    `large_share` is the derived big-and-hard fraction of the year's crop and
    is what Lesson 5 stage D puts on the bottom axis, lagged one year.
- **Redistribution.** Raw CSVs ship with the book and are **not**
  redistributed in this repo — only the cleaned derivatives above. See
  `data/clean/CITATION.txt`.

## Chen et al. — Florida Scrub-Jay pedigree, allele-frequency dynamics

- **Citation.** Chen, N., Juric, I., Cosgrove, E. J., Bowman, R., Fitzpatrick,
  J. W., Schoech, S. J., Clark, A. G., & Coop, G. (2019). Allele-frequency
  dynamics in a pedigreed natural population. *PNAS* (associated paper);
  dataset deposited on figshare.
- **URL / DOI.** <https://figshare.com/articles/dataset/Allele_frequency_dynamics_in_a_pedigreed_natural_population/7044368>
  (DOI 10.6084/m9.figshare.7044368.v1). License: **CC BY 4.0**.
- **What it is.** Pedigreed Florida Scrub-Jay population at Archbold
  Biological Station. PLINK `.ped` with 10,731 biallelic SNPs genotyped
  across 6,936 individuals, plus per-year cohort membership (founder /
  survivor / immigrant / nestling, 1990–2013). Rare combination: a real
  natural population where the pedigree is known *and* allele frequencies
  were tracked across cohorts, so observed drift can be compared against
  the Wright-Fisher null without guessing N_e. Chen et al. request
  direct contact before re-use; see the raw README.
- **Used in.** Planned for the Unit 2 drift lesson (A3) as the empirical
  Step D — observed allele-frequency trajectories to compare against
  simulated Wright-Fisher trajectories and against effective population
  sizes implied by the cohort structure.
- **Clean derivative.**
  - `data/clean/fsj_cohort_sizes.csv` / `.json` — year × category
    (founder / survivor / immigrant / nestling) → individual counts.
  - `data/clean/fsj_allele_freq.csv` — long-format allele frequencies
    per SNP per year (total + nestling-only), with sample sizes. Full
    panel: all 10,731 SNPs.
  - `data/clean/fsj_allele_freq_subset.csv` / `.json` — ~250 SNPs
    pruned to a browser-loadable size: chromosome-assigned, starting
    frequency in [0.1, 0.9], complete coverage across years. This is
    the file lessons should load by default.
  - Cleaning script: `scripts/make_fsj.py` (run against the raw figshare
    dump to regenerate).
- **Redistribution.** The raw `FSJpedgeno2018.ped` (~300 MB) is **not**
  redistributed in this repo — re-fetch from figshare as needed. Only
  the small cleaned derivatives above live in `data/clean/`.

## Jones et al. (2009) — PanTHERIA mammal life-history database

- **Citation.** Jones, K. E. et al. (2009). PanTHERIA: a species-level
  database of life history, ecology, and geography of extant and
  recently extinct mammals. *Ecology* 90(9): 2648.
  doi:10.1890/08-1494.1 (Ecological Archives E090-184).
- **URL / DOI.** ESA Ecological Archives E090-184. The ESA live
  archive now redirects to a landing page; a working mirror of the
  `PanTHERIA_1-0_WR05_Aug2008.txt` file is available via the Internet
  Archive Wayback Machine (snapshot of the esapubs URL). See the
  comment in `scripts/make_pantheria.py` for the exact fetch URL used.
- **What it is.** Species-level trait database covering 5,416 extant
  mammals (MSW 2005 taxonomy). ~50 numeric fields: body mass,
  gestation length, litter size, weaning age, max longevity, trophic
  level, habitat breadth, home range, etc. Missing values encoded as
  `-999.00`. Coverage is uneven — body mass is ~65 % populated,
  rarer fields drop below 10 %.
- **Used in.** Intended for Unit 1 allometry / regression examples
  (log body mass → gestation, metabolic rate, longevity) and Unit 3
  phylogenetic-comparative lessons once a mammal tree is added.
- **Clean derivative.**
  - `data/clean/pantheria_mammals.csv` / `.json` — 3,542 species that
    have a reported adult body mass, ~20 columns covering taxonomy +
    the most-populated life-history traits. Missing values → empty
    string (CSV) / `null` (JSON).
  - Cleaning script: `scripts/make_pantheria.py`.
- **Redistribution.** Original ESA data paper; no explicit license
  beyond journal terms. Cite Jones et al. (2009) for any use.

## Tobias et al. (2022) — AVONET bird trait database

- **Citation.** Tobias, J. A. et al. (2022). AVONET: morphological,
  ecological and geographical data for all birds. *Ecology Letters*
  25(3): 581–597. Dataset on figshare, DOI 10.6084/m9.figshare.16586228.
  License: **CC BY 4.0**.
- **URL / DOI.** <https://figshare.com/articles/dataset/AVONET_morphological_ecological_and_geographical_data_for_all_birds/16586228>
- **What it is.** Species-level morphological + ecological trait
  database for all 11,009 extant bird species under BirdLife
  taxonomy (parallel sheets exist for eBird and BirdTree taxonomy).
  Core morphology: mass, wing length, beak length / width / depth,
  tarsus length, tail length, Kipp's distance, hand-wing index.
  Ecology: habitat, migration code, trophic level, trophic niche,
  primary lifestyle. Geography: range size, centroid lat/long.
- **Used in.** Intended for the Darwin's-finches unit as the
  comparative backdrop (Geospiza beaks vs. the rest of Aves), and
  for Unit 3 phylogenetic comparative methods when paired with the
  included Hackett-stage phylogeny.
- **Clean derivative.**
  - `data/clean/avonet_birds.csv` / `.json` — species-level, 22
    columns: taxonomy + morphology + ecology + geography.
  - Cleaning script: `scripts/make_avonet.py`.
- **Redistribution.** CC BY 4.0 — cleaned derivatives can live in
  the repo; raw ELEData.zip from figshare is not tracked here.

## Wiser, Ribeck & Lenski (2013) — LTEE fitness, 50,000 generations

- **Citation.** Wiser, M. J., Ribeck, N., & Lenski, R. E. (2013). Long-term
  dynamics of adaptation in asexual populations. *Science* 342: 1364–1367.
- **URL / DOI.** Dryad doi:10.5061/dryad.0hc2m.
  <https://datadryad.org/stash/dataset/doi:10.5061/dryad.0hc2m>
- **What it is.** Per-competition fitness measurements for all 12 LTEE
  populations of *E. coli* (six each of Ara+ and Ara−) spanning
  generations 0 through 50,000. Each row is an assay: fitness of an
  evolved clone relative to its ancestor, measured by head-to-head
  competition. Accompanied by a 40k-vs-50k comparison file and the
  authors' R analysis script. Diminishing-returns vs. no-plateau
  debate is the pedagogical hook — a beautiful two-model fitting
  exercise for A2.
- **Used in.** Planned for Unit 1 A2 (model fitting — power-law vs.
  hyperbolic fitness decay) and Unit 2 A4 (selection; fitness
  trajectories as the target for Wright-Fisher + selection simulations).
- **Clean derivative.**
  - `data/clean/ltee_fitness_assays.csv` / `.json` — long-format
    (population, generation, fitness, replicate, marker).
  - `data/clean/ltee_fitness_summary.csv` / `.json` — per-population
    per-generation mean / SD / SE / n.
  - Cleaning script: `scripts/make_ltee_fitness.py`.
- **Status.** **Manual fetch required.** Dryad serves files behind a
  JavaScript challenge that blocks `curl`/`WebFetch`. Download the
  ~80 KB bundle from the URL above, drop
  `Concatenated.LTEE.data.all.csv` into `/tmp/wiser_ltee/`, then run
  `python3 scripts/make_ltee_fitness.py`.
- **Redistribution.** CC0 on Dryad — cleaned derivatives may live in
  the repo. Cite Wiser et al. 2013 and the Dryad DOI.

## Kolbe et al. (2012) — *Anolis sagrei* experimental island introductions

- **Citation.** Kolbe, J. J., Leal, M., Schoener, T. W., Spiller, D. A.,
  & Losos, J. B. (2012). Founder effects persist despite adaptive
  differentiation: a field experiment with lizards. *Science* 335:
  1086–1089.
- **URL / DOI.** No public primary-data archive found on Dryad or
  figshare as of 2026-04-18. The paper's Supplementary Materials at
  science.org contains the morphology tables; extraction would be
  manual (SI tables → CSV).
- **What it is.** Seven tiny Bahamian islands seeded with a small
  number of adult *Anolis sagrei* (mostly 4–10 founders from a common
  source), then re-measured four years later. The founder
  morphological signal is still detectable despite clear adaptive
  response to each island's vegetation.
- **Used in.** Intended for Unit 2 as paired evidence for
  drift × selection: founder effects (A3) and adaptive response (A4)
  both visible in a single experiment.
- **Clean derivative.** Not yet. Intended shape: one CSV of
  `island, individual, year, svl, hindlimb, forelimb, perch_diameter,
  ...` after manual extraction from the SI.
- **Status.** **Raw data not publicly archived.** Hold for now —
  revisit when planning the A3/A4 lesson or contact authors.

## Good et al. (2017) — LTEE metagenomics, 60,000 generations

- **Citation.** Good, B. H., McDonald, M. J., Barrick, J. E., Lenski,
  R. E., & Desai, M. M. (2017). The dynamics of molecular evolution
  over 60,000 generations. *Nature* 551: 45–50.
- **URL / DOI.** GitHub: <https://github.com/benjaminhgood/LTEE-metagenomic>
  (analysis pipeline + processed frequency trajectories); raw reads on
  SRA (BioProject PRJNA380528).
- **What it is.** Whole-population metagenomic sequencing at roughly
  60 time points in each of the 12 LTEE populations. Produces
  per-mutation allele-frequency trajectories over 60,000 generations —
  a canonical view of clonal interference, hitchhiking, and the
  transition between the three hyper-mutator lineages.
- **Used in.** Intended for A3 (drift vs. selection — which
  trajectories look neutral?) and A4 (visible selective sweeps).
- **Status.** **Logged, not cleaned.** Pipeline requires running the
  authors' Python code to regenerate per-mutation tables.

## Blount, Borland & Lenski (2008) — Cit+ historical contingency

- **Citation.** Blount, Z. D., Borland, C. Z., & Lenski, R. E. (2008).
  Historical contingency and the evolution of a key innovation in an
  experimental population of *Escherichia coli*. *PNAS* 105: 7899–7906.
  Follow-up genomic study: Blount et al. (2012) *Nature* 489: 513–518.
- **URL / DOI.** Supplementary data in the PNAS/Nature papers;
  genome data on SRA/GenBank. No consolidated public archive of the
  Cit+ timing table has been located.
- **What it is.** Replay experiments showing Cit+ aerobic citrate
  utilization evolved once, deep in Ara-3's history, and that the
  phenotype is historically contingent on earlier potentiating
  mutations.
- **Used in.** Intended as a narrative case study alongside A3/A4 —
  contingency is the concept a simulator naturally erases.
- **Status.** **Logged, not cleaned.** Narrative weight is high even
  if a tidy CSV never materializes.

## Stuart et al. (2014) — *Anolis carolinensis* character displacement

- **Citation.** Stuart, Y. E. et al. (2014). Rapid evolution of a
  native species following invasion by a congener. *Science* 346:
  463–466.
- **URL / DOI.** Typically posted on Dryad — DOI not yet verified; the
  Losos-lab supplement is the immediate source.
- **What it is.** Experimental islands where *Anolis sagrei* was
  introduced alongside resident *A. carolinensis*. Native lizards
  shifted upward in the canopy and evolved larger toepads over ~20
  generations.
- **Used in.** Intended for A6 (which force?) — a clean example where
  selection from competition drives measurable evolution on
  decadal timescales.
- **Status.** **Logged, not cleaned.**

## Reznick & colleagues — Trinidad guppy predator-removal experiments

- **Citation.** Reznick, D. N., Shaw, F. H., Rodd, F. H., & Shaw, R. G.
  (1997). Evaluation of the rate of evolution in natural populations
  of guppies. *Science* 275: 1934–1937. (Plus ~30 years of follow-ups,
  most recently Potter et al., Fitzpatrick et al.)
- **URL / DOI.** Multiple Dryad deposits associated with later papers;
  the 1997 dataset is in the Science SI.
- **What it is.** Guppies moved from high-predation to low-predation
  reaches of Trinidad streams; life-history (age at maturity, litter
  size, body size) tracked over years, showing measurable evolution
  within 7–18 generations.
- **Used in.** Intended for A4 (selection on life history) and for
  contrasting "rates of evolution" with LTEE and Kolbe.
- **Status.** **Logged, not cleaned.**

## PETS — Paleontological Evolutionary Time Series database

- **Citation.** Hunt, G., Voje, K. L., & Liow, L. H. (associated with the
  "Punctuated equilibrium: state of the evidence" *Paleobiology* 2025
  review). Database maintained at the Natural History Museum,
  University of Oslo.
- **URL / DOI.** <https://pets.nhm.uio.no/PETS/> — interactive Shiny
  app with per-series and bulk CSV / .Rdata export. No public REST or
  static download endpoint; all exports go through the UI.
- **What it is.** 1,400 paleontological trait time series — mostly
  body-size and morphology measurements through geological time —
  spanning mammals, birds, fish, bryozoans, foraminifers, diatoms,
  and many other clades, across terrestrial / marine /
  benthic / pelagic / fluvial / lacustrine settings. Each series has
  a `tsID` joining an observation table (N, trait_mean, trait_var,
  age_MY) to a metadata row (taxon, trait_type, environment,
  geologic period/epoch bounds, citation, lat/lon, etc.).
- **Used in.** Primary empirical target for **A10 (macroevolution
  capstone)** — rates of evolution, BM / OU / trend model
  comparison, punctuated equilibrium vs. gradualism. Pairs naturally
  with the Gingerich / Hendry rates compilation below.
- **Clean derivative.**
  - `data/clean/pets_series_metadata.csv` / `.json` — 1,400 rows ×
    31 columns of series-level metadata.
  - `data/clean/pets_timeseries.csv` / `.json` — 20,093 observations
    in long format; join to metadata on `tsID`.
  - Cleaning script: `scripts/make_pets.py` (handles the mixed
    European / US decimal convention in the raw export).
- **Fetch.** Manual. The Shiny UI is not scriptable; use the
  "Download selected time series" tab in the app and drop
  `timeseries.csv` + `metadata.txt` into `data/timeseries/`, then
  run the cleaner.
- **Redistribution.** License not stated on the site; cite the
  underlying publications (listed per-series in the metadata
  `citation` column) as well as the PETS database.

## Gingerich / Hendry–Kinnison — rates of phenotypic evolution

- **Citation.** Gingerich, P. D. (2019). *Rates of Evolution: A
  Quantitative Synthesis.* Cambridge. Earlier: Gingerich (1983,
  2009); Hendry & Kinnison (1999). Hendry's compilation of
  contemporary-evolution rates is widely re-used.
- **URL / DOI.** Various: Gingerich's published compilations, plus
  Hendry lab supplementary data for the contemporary-evolution reviews.
- **What it is.** Compilations of measured rates of phenotypic
  change (in haldanes and darwins) across timescales from years to
  millions of years. The punchline — rates decline with the interval
  over which they are measured — is an important statistical-artifact
  lesson.
- **Used in.** Planned for A10 (macroevolution capstone) as the
  empirical target for rates-over-intervals analysis, and for
  comparison against LTEE / guppy / Anolis contemporary rates.
- **Status.** **Logged, not cleaned.**

---

## Galton — parent–child heights (1885)

- **Citation.** Galton, F. (1886). Regression Towards Mediocrity in Hereditary Stature. *Journal of the Anthropological Institute* 15: 246–263. CSV via `HistData` R package (Friendly).
- **URL / DOI.** <https://github.com/vincentarelbundock/Rdatasets> — `csv/HistData/Galton.csv` and `csv/HistData/GaltonFamilies.csv`. License: GPL-3 (R package).
- **What it is.** Two cuts of Galton's 1885 inheritance data. `Galton.csv` is 928 parent/child height pairs (parent = midparent of mother+father). `GaltonFamilies.csv` is 934 rows × 197 families with mother, father, midparent, child gender, and child height. The midparent dataset is the cleanest for teaching: regress childHeight on midparentHeight; the slope is ~0.65 and is read directly as h².
- **Used in.** Lesson 6 (Galton, regression-as-inheritance) as the empirical anchor. Modern parent-offspring height datasets work equally well — Galton is just convenient and historically anchored.
- **Clean derivative.** `data/clean/galton_heights.csv`/`.json` (parent, child); `data/clean/galton_families.csv`/`.json` (full table).
- **Redistribution.** Public-domain historical data; redistributed in cleaned form.

## NHANES — adult height and weight (US, 2009–2012)

- **Citation.** US National Health and Nutrition Examination Survey (NHANES) 2009–2010 and 2011–2012 sample. Distributed via the `NHANES` R package (Pruim) and ProjectMOSAIC GitHub mirror.
- **URL / DOI.** <https://github.com/ProjectMOSAIC/NHANES> — `data-raw/NHANES.csv`. License: CC0 / public domain.
- **What it is.** 10,000 respondents (2 survey cycles, 5,000 each), heavily curated for teaching purposes. Cleaned derivative below restricts to adults (≥18) with both height and weight reported — 7,414 rows.
- **Used in.** Lesson 1 (predicting height, error symmetry around the mean) and Lesson 2 (running-mean detection of distribution shift) as the "general population" reference cohort, contrasted against NBA player heights in L2 and L3.
- **Clean derivative.** `data/clean/nhanes_adults.csv`/`.json` — columns: SurveyYr, Gender, Age, Weight (kg), Height (cm).
- **Redistribution.** Public-domain government data; redistributed in cleaned form.

## NBA — career player heights and weights

- **Citation.** Brescou (compiler), *NBA player career dataset 1946–2023* (GitHub). Underlying data: NBA.com Stats / Basketball-Reference.
- **URL / DOI.** <https://github.com/Brescou/NBA-dataset-stats-player-team> — `player/player_index.csv`. License: MIT (compilation); underlying stats are NBA.com publicly distributed career summaries.
- **What it is.** 4,820 NBA players ever (career index). Each row: player name, position, draft year/round, country, career years, height (feet-inches), weight (lb), career averages. After parsing height into inches: 4,768 usable rows.
- **Used in.** Lesson 2 — the "shifted distribution" reveal (general population vs. NBA). Cleanly larger than NHANES adult means by ~6 inches with visible spread. Lesson 3 also uses the height/weight pair to contrast against general-population regressions.
- **Clean derivative.** `data/clean/nba_players.csv`/`.json` — columns: name_last, name_first, position, country, height_in, weight_lb, from_year, to_year.
- **Redistribution.** Public career statistics; redistributed in cleaned form.

## Good et al. 2017 — LTEE metagenomic allele-frequency trajectories

- **Citation.** Good, B. H., McDonald, M. J., Barrick, J. E., Lenski, R. E., & Desai, M. M. (2017). The dynamics of molecular evolution over 60,000 generations. *Nature* 551(7678): 45–50.
- **URL / DOI.** <https://github.com/benjaminhgood/LTEE-metagenomic> — `data_files/{pop}_annotated_timecourse.txt` for each of 12 populations. License: research-use (re-distribution of cleaned derivatives is the standard practice in the field).
- **What it is.** Time-resolved metagenomic allele-frequency trajectories across all 12 LTEE populations, ~110 timepoints from generation 0 to ~60,000. Each row is one called mutation × series of (alternate count, depth) pairs. Hypermutator populations (m5, m6, p3, p6) are flagged separately due to vastly elevated mutation density.
- **Used in.** Lesson 15 (selection coefficient from Δp — pick a mutation that swept, fit s with profile likelihood) and Lesson 18 (drift-or-selection classification — real trajectories from non-mutator pops alongside simulated drift/selection trajectories).
- **Clean derivative.**
  - `data/clean/ltee_allele_freqs.csv`/`.json` — long-format (pop, gene, pos, generation, freq) for the top-30 mutations by max frequency in each of 7 non-mutator populations (m1–m4, p1, p2, p4, p5). ~24,900 rows.
  - `data/clean/ltee_mutations_summary.csv`/`.json` — one row per mutation (pop, gene, pos, allele, annotation, max_freq).
- **Cleaning script.** Inline Python in this commit; if regenerated should become `scripts/make_ltee_metagenomic.py`.
- **Redistribution.** Cleaned derivative redistributed; raw multi-MB timecourse files in `data/raw/ltee_metagenomic/` are research-use; re-fetch from the GitHub source above.

## Chen et al. — FSJ individual and cohort records (supplementary)

- **Citation.** Same as the FSJ allele-frequency entry above (Chen et al. 2019 *PNAS*, figshare 7044368).
- **URL / DOI.** Same figshare deposit; specific files:
  - `IndivData.txt` (115 KB) — per-individual metadata.
  - `IndivList.txt` (151 KB) — year × individual × category × genotyped flag.
- **What it is.** Individual-level supplementary data for the FSJ allele-frequency study. Useful for L11 (gene dropping, IBD, F via pedigree links) and L27 (helping-at-the-nest if cohort/family columns suffice).
- **Used in.** Lesson 11 (drift III — F and heterozygote deficit; potentially small-pedigree subset for gene dropping). Lesson 27 (Hamilton's rule — if helping behavior coding is present).
- **Clean derivative.**
  - `data/clean/fsj_individuals.csv`/`.json` — 6,936 rows × 5 columns (Indiv, NatalYear, CoreNestling, ImmCohort, InclBr).
  - `data/clean/fsj_cohort_indiv.csv`/`.json` — 7,259 rows × 4 columns (Year, Indiv, Category, Genotyped).
- **Redistribution.** Same constraints as the parent FSJ deposit; small text files are redistributed in cleaned form.

## Buri 1956 — Drosophila bw⁷⁵ allele-frequency replicate populations

- **Citation.** Buri, P. (1956). Gene frequency in small populations of mutant *Drosophila*. *Evolution* 10(4): 367–402.
- **URL / DOI.** Raw matrix from the `popgenr` R package (Aaron Adamack); shipped here as `data/raw/fly.csv`. License: research/teaching use (original paper is open via Wiley historical archive).
- **What it is.** Buri's classic drift experiment: 107 replicate populations of 8♂ + 8♀ *D. melanogaster*, tracked over 19 generations from p₀ = 0.5. The matrix is 20 rows (generations 0–19) × 33 columns (count of populations holding each possible allele count 0..32 of 32 total gene copies per population). The empirical drift variance fits a Wright–Fisher null with Ne ≈ 9, not the census 16 — a foundational demonstration that effective size ≠ census size.
- **Used in.** Lesson 9 (drift I — sex ratio, absolute N, and the Ne/Nc gap) as the empirical Step D. Buri's data is the single canonical lab-controlled drift dataset.
- **Clean derivative.**
  - `data/clean/buri_fly.csv`/`.json` — long format: (generation, allele_count, n_pops). 530 rows.
  - `data/clean/buri_fly_summary.csv`/`.json` — per-generation summary: (generation, n_pops, mean_p, var_p, n_lost, n_fixed). 20 rows. Reproduces Buri's reported 30 losses + 28 fixations by generation 19.
- **Redistribution.** Historical dataset, public-domain status; redistributed in cleaned form.

## Pelletier et al. 2022 — bighorn sheep horn-size time series

- **Citation.** Pelletier, F., Hogg, J. T., Festa-Bianchet, M., Coltman, D. W., et al. (2022). Intense selective hunting leads to artificial evolution in horn size. *Evolutionary Applications* (and predecessors: Coltman et al. 2003 *Nature*).
- **URL / DOI.** Dryad: <https://doi.org/10.5061/dryad.41d7q>. License: CC0.
- **What it is.** 39 years of phenotypic data on horn size in Ram Mountain (Alberta) bighorn sheep, paired with a pedigree of 1,133 individuals (253 founders, 880 with assigned parents). Horn length, "Avhb114" (average horn base at age class), relative longevity, by sex × age × cohort × year. The dataset that supports the trophy-hunting selection-response and post-protection plateau analysis.
- **Used in.** **Lesson 7 stage E**, as the one real population that supplies all four of that lesson's knobs at once — see the measured values below. Also Lesson 15 (selection II — heritability as a state; selection-coefficient drill). The horn-length trajectory shows initial decline under hunting, then plateau after protection — the discussion case for V_A exhaustion vs. survivor bias.
- **The four numbers Lesson 7 reads off it**, computed from `bighorn_horn.csv` + `bighorn_pedigree.csv` and stated on that page:
  - *how many there are* — **86**, the median count of distinct sheep seen per year over 1973–2013 (range 19–219).
  - *how much is handed on* — **0.40**, from parent–offspring slopes of 0.228 (430 dam–offspring pairs) and 0.182 (181 sire–offspring pairs). **Standardised within sex first**: males average 51.9 cm and females 21.3 cm, so the raw pooled slope is an artefact of the dimorphism and means nothing.
  - *how much the trait helps you breed* — **+0.27**, horn length against number of offspring in the pedigree, 213 ewes (sires give +0.14 on 69, a thinner sample).
  - *how different they are* — **1.00** by construction; the lesson's units are the rams' own spread, 8.2 cm.
  - *what the rams actually did* — adult (age 4+) male horn length by year, standardised on the whole record: +0.53 in 1975 falling to −1.69 in 1995, a move of **2.21** on the lesson's own ruler against a pass mark of 0.05. Only years with at least five rams are used, which is 14 years; between 5 and 13 rams in most of them, so some of the wobble is sampling.
- **Clean derivative.**
  - `data/clean/bighorn_horn.csv`/`.json` — 4,015 individual-year records. Columns: ID, yr, age, sex, cohort, hlM, hlF, Avhb114M, Avhb114F, relLongM, relLongF (NA preserved).
  - `data/clean/bighorn_pedigree.csv`/`.json` — 1,133 rows: (id, dam, sire). 253 founders (both parents NA).
- **Redistribution.** CC0 license; redistributed in cleaned form.

## Trier, Hermansen et al. 2014 — Italian sparrow hybrid speciation

- **Citation.** Trier, C. N., Hermansen, J. S., Sætre, G.-P., & Bailey, R. I. (2014). Evidence for mito-nuclear and sex-linked reproductive barriers between the hybrid Italian sparrow and its parent species. *PLOS Genetics* 10(1): e1004075. (See also Hermansen et al. 2014 *Mol. Ecol.* for the underlying genotype panel.)
- **URL / DOI.** Dryad: <https://doi.org/10.5061/dryad.v6f4d>. License: CC0.
- **What it is.** 77 species-informative SNP markers genotyped across house sparrow (*P. domesticus*, parental), Spanish sparrow (*P. hispaniolensis*, parental), and Italian sparrow (*P. italiae*, the hybrid taxon) populations. Allele counts per locus in each parental, and per-locus per-population counts across many Italian sampling localities (433 individuals at locus 0). Originally distributed as BGC (Bayesian Genomic Cline) input files; cleaned to a single per-locus table here.
- **Used in.** Lesson 19 (migration I — F_ST as 1/(1+4Nm), Italian sparrow as the empirical anchor for genome-wide F_ST distribution between parental species, with the hybrid taxon as a third frequency-mosaic point of comparison).
- **Clean derivative.** `data/clean/italian_sparrow_loci.csv`/`.json` — 77 rows × 8 cols: (locus, house_p, house_n, spanish_p, spanish_n, italy_p, italy_n, fst_house_spanish). House–Spanish FST ranges 0.057–1.000 (mean 0.538) — visible bimodal genome scan.
- **Redistribution.** CC0 license; redistributed in cleaned form. Raw BGC input files retained in `data/raw/doi_10_5061_dryad_v6f4d__v20140911/` for re-derivation (87 KB).

## Mitchell — Beren & Cyrus growth logs (personal)

- **Citation.** Personal data, J. Mitchell, 2019–present (Beren) and 2022–present (Cyrus).
- **URL / DOI.** Not external. Raw event logs in `data/raw/new/{beren,cyrus}.csv`, refreshed by hand as new measurements come in.
- **What it is.** Chronological event logs for both children — diaper changes, feedings, naps, illnesses, antibiotic courses, milestones, and (the relevant part for lessons) periodic measurements of mass (kg), length (cm), and head circumference. Mixed-event format; the cleaning script extracts trait rows and computes age-in-days from birth, with a heuristic flag for whether the child was on antibiotics or recently febrile within ±7 days of each measurement.
- **Used in.** Lesson 3 (predict-the-missing-point with biased-measurement story) — the empirical Step D. The sick-day flag is the substrate for the "this measurement was at the doctor while ill" reveal.
- **Clean derivative.** `data/clean/kids_growth.csv`/`.json` — 74 measurements (46 Beren + 28 Cyrus), columns: kid, date, day_of_life, age_years, measure, value, units, on_antibiotic, sick_proxy.
- **Cleaning script.** `scripts/make_kids_growth.py` — re-run after editing the raw event logs.
- **Redistribution.** Personal — repository-local only. Do not redistribute the raw logs externally.

## WHO Child Growth Standards — boy mass percentile (reference overlay)

- **Citation.** WHO Multicentre Growth Reference Study Group (2006). *WHO Child Growth Standards*. World Health Organization.
- **URL / DOI.** <https://www.who.int/tools/child-growth-standards>
- **What it is.** 20-row reference curve, (day of life, mass in kg), for L3's growth-trajectory overlay against `kids_growth.csv`. Exact percentile and sex not annotated in the source file; treat as a generic reference, not a clinical baseline.
- **Used in.** Lesson 3 — overlay on the Beren/Cyrus growth scatter so students see typical-range vs. measured values.
- **Clean derivative.** `data/clean/who_growth_reference.csv`/`.json` — columns: day_of_life, mass_kg.
- **Redistribution.** Public reference; cleaned form redistributed.

## Grant & Grant — Daphne Major finches, 40-year extended series with CIs

- **Citation.** Grant, P. R., & Grant, B. R. (2014). *40 Years of Evolution: Darwin's Finches on Daphne Major Island.* Princeton.
- **URL / DOI.** Companion data package; cleaned subset distributed with this repo.
- **What it is.** Same study as the existing `finch_beak`/`finch_pop` cleaned files, but a richer cut: annual means for *both* species (fortis + scandens), with **confidence intervals** on beak length / depth / width, and a companion rainfall series across the same years. The CIs are what make Lessons 4–5 ("lines of equally good fit", "P-value as clarity") possible without re-bootstrapping from scratch.
- **Used in.** Lesson 14 (selection year-by-year drill, S7 integration) as the primary fortis time series. Lesson 3 / Lesson 5 supplementarily. The rainfall series is the *missing covariate* discussion in Lesson 14's empirical Step D (drought years 1977, 2003 stand out as extreme residuals when finch mean beak is regressed on year alone).
- **Clean derivative.**
  - `data/clean/grant_finches_40y.csv`/`.json` — 80 rows (40 yr × 2 species), columns: Year, Species, Beak length, Beak depth, Beak width, CI Beak length, CI Beak depth, CI Beak width.
  - `data/clean/grant_rainfall.csv`/`.json` — 40 rows, columns: Year, Rain (mm).
- **Redistribution.** Same constraints as the existing finch cleaned derivatives.

## Fossil horses — North American body-size and hypsodonty time series + phylogeny

- **Citation.** MacFadden, B. J. (various, see also Shoemaker & Hopkins compilations); tree topology from published horse cladograms.
- **URL / DOI.** Compiled by J. Mitchell for prior course offerings; redistributed in cleaned form.
- **What it is.** 138 fossil horse species with first-appearance (oldest, Ma) and last-appearance (youngest, Ma) dates, mean body size (kg), and hypsodonty index. Companion Newick phylogeny includes all 138 species. The textbook macroevolution dataset for rates-vs-interval and OU/BM/Trend/Bounded-BM model comparison.
- **Used in.** Lesson 25 (rates of evolution across intervals — S14 integration) as the empirical anchor for the Gingerich-style rate-vs-interval plot. Future capstone lesson (L30 alternative) on bounded-BM vs. Trend for body-size evolution.
- **Clean derivative.**
  - `data/clean/horse_traits.csv`/`.json` — 138 rows. Columns: species, oldest, youngest, body_size, hypsodonty, midpoint_Ma.
  - `data/clean/horse_tree.nwk` — Newick tree, 5.3 KB.

## Anolis lizards — Caribbean SVL + phylogeny

- **Citation.** Various; compiled from published Anolis ecomorph datasets (Losos, Mahler) and the standard Anolis Newick phylogeny.
- **URL / DOI.** Compiled by J. Mitchell for prior course offerings; redistributed in cleaned form.
- **What it is.** Two cuts of species-level snout-vent length (SVL, log-transformed) for Greater Antillean *Anolis*: `svl.csv` (82 species, matched to the tree tips) and `svl_full.csv` (100 species, broader sample). Companion Newick phylogeny.
- **Used in.** Lesson 24 (PGLS / phylogenetic non-independence — S13 + S15 integration) — Anolis is a cleaner pedagogical case than the full AVONET bird tree because the tree fits in the browser at 82 tips. Lesson 26 (convergence vs. drift — S19) once ecomorph labels are added.
- **Note.** SVL alone does not encode ecomorph; an ecomorph-label join (Mahler 2013 or similar) is the next data-cleaning task for L26.
- **Clean derivative.**
  - `data/clean/anolis_svl.csv`/`.json` — 82 species (tree-matched).
  - `data/clean/anolis_svl_full.csv`/`.json` — 100 species (broader).
  - `data/clean/anolis_tree.nwk` — Newick tree, 3.5 KB.

## Salamander morphology — multi-species SVL with extinct/extant flag

- **Citation.** Compiled by J. Mitchell from museum specimen records (MCZ catalog numbers visible in source).
- **URL / DOI.** Compiled for prior course offerings; redistributed in cleaned form.
- **What it is.** 964 individual salamander specimens across many genera (Amphiuma, etc.) with snout-vent length (mm), head width (mm), and an extant/extinct flag. 91 extinct, 873 extant. Useful for "trait distribution conditional on survival" — a survivor-bias substrate analogous to bighorn rams or PETS lineages.
- **Used in.** Lesson 10 (drift II — bottlenecks; supports the salamander-vernal-pool side discussion) and potentially Lesson 25 (rates / disparity-through-time) as a non-horse macroevolution example.
- **Clean derivative.** `data/clean/salamander_morpho.csv`/`.json` — 964 specimens. Columns: species, catalog_num, svl_mm, head_width_mm, extant.

## Mendel 1866 — pea-plant trait counts (F2 generation)

- **Citation.** Mendel, G. (1866). *Versuche über Pflanzen-Hybriden* (Experiments on Plant Hybrids). Verhandlungen des naturforschenden Vereines in Brünn, 4: 3–47.
- **URL / DOI.** Public-domain historical data; counts transcribed directly from Mendel's 1866 table.
- **What it is.** F2 phenotypic counts for Mendel's seven heritable traits in *Pisum sativum*. For each trait, the number of dominant-form vs. recessive-form individuals in the F2 generation, with expected 3:1 ratio under independent-assortment Mendelian inheritance.
- **Used in.** Lesson 7 (Mendel without Punnett squares) — students compute expected counts from the 3:1 ratio and a chi-square goodness-of-fit, observing that "even Mendel's data has variance" but also noting (a la Fisher 1936) that the chi-square values are suspiciously small.
- **Clean derivative.** `data/clean/mendel_pea.csv`/`.json` — 7 rows, columns: trait, dominant_phenotype, recessive_phenotype, dominant_count, recessive_count, total, observed_ratio, expected_ratio (= 3.0), chi2_vs_3to1.
- **Redistribution.** Public domain.

## Vucetich & Peterson — Isle Royale wolves and moose, 1959–2019

- **Citation.** Vucetich, J. A. & Peterson, R. O. *Ecological Studies of Wolves on
  Isle Royale.* Michigan Technological University, Houghton MI. Annual reports,
  1959–present. The longest continuous predator–prey study on record.
- **URL / DOI.** `isleroyalewolf.org`. The cut used here is the project's own
  `Data_wolves_moose_Isle_Royale_June2019` table, obtained via the `data-raw/`
  directory of the `dsem` R package (James Thorson, NOAA), which redistributes it.
- **What it is.** One row per winter, 1959–2019: wolf count, moose count, kill rate,
  predation rate, moose recruitment, diet composition, browse indices, and a climate
  block (rainfall, seasonal temperatures, winter NAO, snow depth, ice bridges).
  Wolves range 2–50; moose 385–2,398.
- **Used in.** **Lesson 6 stages D and E** — the moose alone (find the winters when
  the death rate spiked: 1977 and 1996), then the wolves brought in as a cause.
- **Clean derivative.** `data/clean/isle_royale.csv`/`.json` — all 61 rows, 1959–2019.
  Columns: year, wolves, moose, snow_depth_cm, nao_djfm, ice_bridge, jan_feb_temp_f.
  The three climate columns are carried but not yet used by any lesson. Snow depth is
  missing before 1974 and NAO for 2019.
- **Lesson 6 embeds 1959–2000 only, deliberately.** After 2000 the wolf population
  collapsed from inbreeding to two animals and was re-founded from the mainland in
  2018–19. Measured on this file: over 1959–2000 a wolves → moose-deaths term improves
  a forward run from a typical miss of 1.24× to 1.17×; over the full 1959–2019 record
  the best fitted coupling coefficient is **zero** — it buys nothing. The lesson uses
  the window where the coupling is real. The clean file keeps every year, so widening
  the window is a one-line change to the embedded block.
- **Redistribution.** Counts and climate summaries only; the project's per-kill and
  per-individual records are not redistributed here.
