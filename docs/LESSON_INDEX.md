# Lesson index — itemized

A point-by-point catalog of every activity. The concept/structural-move mapping
is the authoritative one from `PROJECT_PLAN.md §3.4`; this file adds the stage
breakdown, the anchoring data, and the reveal for each built lesson. Compiled
2026-06-06 against the live `app/lessons/`.

> **Updated 2026-06-07 (critique-response pass).** In response to
> `docs/lesson-index-critique.md`: L1 now names sampling scatter vs individual
> spread distinctly; a *covariance* thread runs L3→L7→L12→L15→L17 and pays off in
> L26; L26 has a live interactive Stage A (the Price identity Δz̄ = cov(w,z)/w̄ as
> the regression slope); and four new scaffolds were added — **S21** (collider/DAG,
> linking L6 & L19), **S22** (minimal inference, paired with L12), **S23** (the
> sampling-distribution weld linking L4 & L10), **S24** (convergent evidence /
> positive calibration). See `docs/reviews/lesson-index-critique-response.md` for
> the steelman-against-each and the full synthesis. New sections below: **Scaffold
> traversal** and a **three-axis map**.

Format per lesson: **title** · *structural move* · stages (A–E) · data · the reveal.
`moduleId`/`version`/`scaffold`-bit count are from each `Score.init`.

---

## Unit 1 — How variation gets measured (L1–L7): the statistics spine

### L1 — Adding up coin flips until a bell appears
*Dimensional reduction.* `lesson1` v6, 7 scaffold bits.
- **A** Flip a coin 20×, three rounds. **(pause)** what your "error" looked like. **B** Guess a person's height. **C** Naming the pieces, on real data (NHANES).
- **Reveal:** stacking small independent events makes a bell; the mean is the error-minimizing single guess; μ and σ are the two dials. Ends at `y ~ Normal(μ, σ)`, with a two-group between/within coda.

### L2 — Resampling to ask if new data still belongs
*Unit dissolves into population.* `lesson2` v2, 9 bits.
- **A** Running mean of a stable population. **B** The population switches under you, unannounced. **C** How fast the alarm fires. **D** Real shift: NHANES vs NBA heights. **Showcase** when two populations stop being one.
- **Reveal:** "no trend / still belongs" is a *distribution* (a bootstrap CI), not a point; with enough data any null gets rejected.

### L3 — Subtracting the line and reading what's left
*Primitive (Seed 1 — regression core).* `lesson3` v4, 9 bits.
- **L** intercept/slope on familiar data (LOTR adaptation scatter). **A** best constant guess (NHANES weight). **B** add height as a predictor. **C** residual-pattern drill (5 rounds: mammals/birds/finches/fossils). **D** Beren & Cyrus growth — place the missing measurement. **E** the "noise" is a missing variable (film-split rug-pull). **Showcase** the vagus-nerve homology.
- **Reveal:** a residual is what the model didn't explain; a clean residual doesn't confirm a model, a patterned one rejects it.

### L4 — Finding the cloud of lines that all fit the data
*Primitive (Seed 1).* `lesson4` v2, 9 bits.
- **A** drag a line, watch R². **B** find 20 lines sharing the OLS R². **C** the bootstrap cloud (200 resamples). **D** real NHANES height→weight. **Showcase** bootstrapping the age of a chalk cliff (Dover/coccoliths).
- **Reveal:** the "single best fit" is one draw from an elongated (α,β) cloud; the cloud's width *is* the standard error.

### L5 — Shuffling the predictor to see what chance can do
*Primitive (Seed 1 — permutation null / p-value).* `lesson5` v4, 9 bits.
- **A** two-group comparison = regression with a 0/1 predictor. **B** same regression, flipped inputs. **C** same move on a real time series (predictor = year). **D** three sliders, one shuffle-null.
- **Reveal:** the p-value is "how often the broken (shuffled) version beats the real coefficient"; "significant" means *clear*, not big. (De-telegraphed: the p-value option is now the bare tail statement vs the two classic misreadings.)

### L6 — Watching the same biology give four different verdicts
*Dimensional reduction.* `lesson6` v4, 4 bits.
- **A** three groups, two tests. **B** two experiments, same true effect. **C** which one is "clear"? **D** equal means, unequal variances. **E** a two-group test whose verdict is the wrong reading of the world (DellaVigna violent-movies collider + DAG).
- **Reveal:** P is δ̂ relative to the shuffle-noise — sample size and within-group spread, not effect size, drive it; a significant pooled slope can be a collider artifact.

### L7 — Tracing how much of a parent ends up in their child
*Category collapse (heritability = parent→offspring slope).* `lesson7` v2, 9 bits.
- **A** two independent traits (sample r wobbles around 0). **B** couple them — introduce h². **C** fit offspring on midparent in a simulator *you* drive (slope tracks the h² you set). **D** Galton's 1885 data (934 children, 197 families) — predict the slope, fit, bootstrap, split by sex.
- **Reveal:** the regression slope *is* h²; h² < 1 means children land partway back toward the mean. **(Redesigned 2026-06-06** so Stage D discovers the ≈0.65 slope instead of Stage C pre-announcing it.) Closer: the chopstick trap — a high slope ≠ genetic causation.

## Unit 2 — Population genetics (L8–L17)

### L8 — Counting the ratios that breed true
*Unit dissolves into population.* `lesson8` v1, 4 bits.
- **A** one gene, 3:1. **B** two genes, 9:3:3:1. **C** when χ² rejects, and when it shouldn't. **D** Mendel's actual data — and Fisher's complaint.
- **Reveal:** a Mendelian ratio is a *distribution of counts*; dominant/recessive describe manifestation, not the gene.

### L9 — Building the population where nothing changes
*Unit dissolves into population.* `lesson9` v2, 4 bits.
- **A** infinite, panmictic, no mutation. **B** turn the assumptions off. **C** χ² on genotype counts. **D** a wild locus — four candidate culprits.
- **Reveal:** Hardy–Weinberg is the never-true inertial baseline you measure deviation against.

### L10 — Watching alleles wander in a finite population
*Dimensional reduction (Seed 4 — Wright–Fisher).* `lesson10` v2, 4 bits.
- **A** one trajectory, then 50. **B** run to fixation. **C** Fix(p₀)=p₀. **D** Buri 1956 — 107 fly lines.
- **Reveal:** random copying doesn't reproduce proportions; Nₑ sets the *rate*, p₀ is the *state* (sets the absorption outcome, not drift's strength).

### L11 — Reading drift in the wild when a population gets small
*Dimensional reduction (Nₑ).* `lesson11` v2, 4 bits.
- **A** heterozygosity decay at 1−1/(2Nₑ). **B** a bottleneck. **C** fit Nₑ from a noisy trajectory. **D** Florida Scrub Jay across the decades (real `fsj_allele_freq_subset`).
- **Reveal:** Nₑ ≪ census, and it sets drift's speed. **(Fixed 2026-06-06:** real FSJ data now loads; common-SNP H is nearly flat, so the honest Stage D lesson is "constant-Nₑ is enough; the two-epoch bottleneck model overfits.")

### L12 — Pushing the allele frequency with selection
*Selection-vs-drift split.* `lesson12` v2, 4 bits.
- **A** deterministic s-curve. **B** selection + drift. **C** estimate s from Δp. **D** Lenski's LTEE E. coli. **E** drift, selection, or both? — label five trajectories.
- **Reveal:** selection is the correlation, drift the scatter; selection has no foresight.

### L13 — Where deleterious alleles get held in place
*Model failure.* `lesson13` v2, 4 bits.
- **A** mutation alone (q drifts up at μ). **B** mutation+selection, equilibrium μ/(hs). **C** estimate s from q. **D** cystic fibrosis — where the formula breaks.
- **Reveal:** load tracks the mutation rate, not how bad the allele is; a disagreement with μ/(hs) signals something else (heterozygote advantage).

### L14 — Counting heterozygote deficits
*Unit dissolves into population.* `lesson14` v2, 4 bits.
- **A** panmictic — F around 0. **B** split the population — F climbs. **C** F_IS / F_ST / F_IT. **D** Florida Scrub Jay — per-locus F.
- **Reveal:** F > 0 is a population telling you it isn't one population (Wahlund).

### L15 — The response to selection is a regression line in disguise
*Category collapse / primitive.* `lesson15` v2, 4 bits.
- **A** truncation selection on a Gaussian. **B** R = h²·S, the next generation. **C** watch h² collapse. **D** Grant finches, year by year.
- **Reveal:** R = h²·S = S·(Va/Vp) — the same Galton slope, different rows. **(Tightened 2026-06-06:** S sets the magnitude; Va sets responsiveness and the ceiling — not an independent magnitude, and not Fisher's fundamental theorem.)

### L16 — Spreading or staying — populations connected by migration
*Category collapse (migration = inheritance of location).* `lesson16` v2, 4 bits.
- **A** two populations drift apart. **B** migration on — F_ST equilibrates. **C** estimate Nₑm from F_ST. **D** Italian sparrows across the hybrid zone. (Round 2: Atlantic cod.)
- **Reveal:** drift and migration are mirror images; F_ST = 1/(1+4Nₑm), and a trickle of migration erases differentiation.

### L17 — Helping relatives when cooperation can spread
*Price special case (Hamilton's rule).* `lesson17` v2, 4 bits.
- **A** the null — drift without the rule. **B** add altruism (sliders r, b, c). **C** the r·b = c boundary. **D** same rule, three biologies (incl. haplodiploidy).
- **Reveal:** r·b > c turns altruism into selfish help — you help your genes inside your relative; kin selection is the Price equation read at the relatedness scope.

## Trees & comparative methods — interlude (L18–L19)

*Relabeled from "unit" 2026-06-07 (critique P7).* This is a two-lesson interlude,
not a full unit. The comparative-thinking thread it opens continues in the Unit
4–5 stubs (L24 convergence-vs-drift-vs-ancestry, L25 species delimitation), which
are filed by their lecture unit rather than pulled up here; the topic boundary and
the unit boundary deliberately differ.

### L18 — Reading trees with rotated nodes
*Category collapse.* `lesson18` v2, 5 bits.
- **A** rotate a node — same tree. **B** find the MRCA. **C** the "primitive?" trap. **D** Anolis ecomorphs. **E** sister taxa + branch length / Brownian motion on a tree.
- **Reveal:** tip order is meaningless; only where lines join matters. Branch lengths (E) set up L19.

### L19 — Removing the family resemblance before comparing species
*Category collapse (spurious-correlation terminus).* `lesson19` v3, 4 bits.
- **A** naive OLS across species. **B** phylogenetic independent contrasts. **C** Pagel's λ. **D** AVONET birds — hand-wing index vs migration. **E** the earthworm sign flip (Simpson's paradox on a tree).
- **Reveal:** species aren't independent; ignoring shared ancestry manufactures (or flips) a slope. PGLS subtracts the family resemblance out.

---

## Stubs (no scoring yet) — track lecture Units 4–5

| # | Title |
|---|---|
| L20 | Measuring rates across sliding intervals |
| L21 | Mutation target size and the parallel evolution it produces |
| L22 | Reading selection off codon ratios (dN/dS) |
| L23 | The Dobzhansky–Muller incompatibility snowball |
| L24 | Convergence vs drift vs shared ancestry |
| L25 | Deciding one species or two — and what would change your mind |
| L26 | The Price equation — splitting Δz̄ into two covariances **(Stage A now live; B–D preview)** |
| L27 | When the chromosome becomes the unit |
| L28 | When the genome wins out over the gene |
| L29 | When the cell wins out over the genome |
| L30 | When cells stop competing — the body emerges |
| L31 | When workers stop reproducing — the colony emerges |
| L32 | When species outpersist each other |
| L33 | Beyond the species — when the unit doesn't have a name yet |
| L34 | Capstone — What is an Individual? |

L26–L34 are the Price-at-nested-scopes / levels-of-selection sequence. There is no
"boss" capstone in the scoring sense — the Price decomposition is realized as
ordinary activities.

## Scaffolds (single-concept drills) — `app/scaffolds/`

s01–s13 pair with built activities; s14–s20 with stubs; **s21–s24 (added
2026-06-07) are cross-cutting drills** that thread between lessons. Bookend bits
were stripped repo-wide; only s06 carries per-round bits.

| | | |
|---|---|---|
| s01 no-trend envelope | s02 residual reading | s03 HWE counting |
| s04 fixation probability | s05 time to fixation | s06 drift or selection |
| s07 breeder's equation | s08 selection coefficient | s09 mutation–selection balance |
| s10 F statistic | s11 F_ST migration | s12 Hamilton's rule |
| s13 tree rotation | s14 rates across intervals | s15 phylogenetic non-independence |
| s16 Dobzhansky–Muller snowball | s17 mutation target | s18 dN/dS classification |
| s19 convergence vs drift | s20 species hypothesis | **s21 collider / DAG** (L6 ↔ L19) |
| **s22 minimal inference** (↔ L12) | **s23 sampling-distribution weld** (L4 ↔ L10) | **s24 convergent evidence** (↔ L19) |

## Scaffold traversal — how to use them (critique C2.2)

Scaffolds are **optional, failure-triggered drills**, not prerequisites. The
intended traversal: attempt the lesson first; if a specific move doesn't land
(your prediction came out wrong and the reveal didn't fix it), drop to the paired
scaffold, which isolates that one move across fresh datasets, then return. The
exceptions are the four cross-cutting drills, which are best done *after* both
lessons they bridge:

- **s23 (weld)** after L4 *and* L10 — it only "welds" once you've built both clouds.
- **s21 (collider)** after L6 *and* before/with L19 — L6 plants the collider, s21 drills it, L19 reuses it.
- **s22 (minimal inference)** after L12 — the inverse of the forward simulation.
- **s24 (convergent evidence)** after L19 — the positive-calibration counterweight to the rug-pulls.

## Three-axis map — coverage audit (critique P6)

The single "structural move" tag conflates three independent axes. Splitting them
lets you audit coverage. (The math-operation axis is the authoritative concept tag
in `PROJECT_PLAN.md §3.4`; the other two are diagnostic.)

| Lesson | Math operation | Pedagogical event | Curricular role |
|---|---|---|---|
| L1 | dimensional reduction (μ,σ) | **construct** (build the bell) | foundation |
| L2 | dissolve into population | corrective (any null rejects) | foundation |
| L3 | primitive (slope/residual) | corrective (clean ≠ confirm) | spine (Seed 1) |
| L4 | primitive (SE = cloud) | construct (build the cloud) | spine (Seed 1) |
| L5 | primitive (permutation) | corrective (significant ≠ big) | spine (Seed 1) |
| L6 | dimensional reduction | corrective (collider) | spine |
| L7 | category collapse | corrective (chopstick) | bridge to biology |
| L8 | dissolve into population | corrective (Fisher's critique) | popgen |
| L9 | dissolve into population | corrective (HWE never true) | popgen |
| L10 | dimensional reduction (Nₑ) | construct (build drift) | popgen (Seed 4) |
| L11 | dimensional reduction | corrective (don't overfit) | popgen |
| L12 | selection/drift split | construct + inverse (s22) | popgen |
| L13 | model failure | corrective (formula breaks) | popgen |
| L14 | dissolve into population | corrective (F>0 ≠ one pop) | popgen |
| L15 | category collapse | construct (build response) | bridge |
| L16 | category collapse | corrective (migration = heredity) | popgen |
| L17 | Price special case | construct (build cooperation) | popgen |
| L18 | category collapse | corrective (rotation trap) | trees |
| L19 | category collapse | corrective (sign flip) | trees |
| L26 | **the primitive, named** | construct (Price = the slope) | Unit 5 core |

**What the audit surfaces** (the point of P6): the *pedagogical-event* column is
heavily "corrective" — the gotcha pattern §1 of the critique flags. The
**construct** rows (L1, L4, L10, L12, L15, L17, L26) and the new **s24**
(convergent-evidence positive calibration) are the deliberate counterweight. And
collider/DAG reasoning, previously drilled by *no* scaffold, is now **s21**.
