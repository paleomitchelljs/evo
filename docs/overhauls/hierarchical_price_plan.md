# The hierarchical Price lesson — gene, cell, organism, species (the target lesson; slot 23, 24 or 25)

**File** · not yet built; slot set when 21 and 22 are (each may split). Rename this file `lessonNN_overhaul.md` then.
**Checks** · `node scripts/check_lessonNN_numbers.js` (to write) · `python3 scripts/check_lessons.py` · `node scripts/check_layout.js`
**Status** · PLANNED 2026-10-28 (JM's second ruling that day), not started. 21 and 22 are built toward it
**Last touched** · 2026-10-28

## JM, 2026-10-28, second ruling (verbatim, the target-lesson part; the whole message is in lesson21_overhaul.md)

> We need to build to a hierarchical Price equation lesson that does cellular level, organismal level, and species level (maybe
> also genetic level with Kin and transposons included). That's the target lesson. [...] Depending on if we end up splitting
> either of those two, the big hierarchical Price lesson would end up as one of 23-25

Earlier the same day, on 20 D (now 20 E, wing length): "Opens it up more to a later extension ... where we ultimately break
down further in lesson 21 to show how a trait can have different effects on fitness between individuals in a population &
between species within a clade."

## What the lesson is

- One change in a trait, split level by level from the run: between species, between organisms inside a species, between cells
  inside an organism, between genes inside a cell (perhaps kin and transposons at the gene level). Each term computed, named
  apart, and shown to add up exactly.
- Worth protecting: a trait can be favoured at one level and disfavoured at another; which wins is read off the terms, never
  stated.

## What feeds each level

    gene      15 C the race (play as a gamete); 15 D a jumping gene in a pedigree of cells; 16 D an inversion copying itself
              when rare; 22 D (planned) a greenbeard, a driving allele, a transposon at the bird's cost
    kin       22 A-C (planned) helping, relatedness off the pedigree (11, 15, 20 A), Hamilton's rule found
    cell      15 D (cells that fail to divide when a copy lands in a gene); archived lesson15_with_D_2026-10-09 (the
              hierarchical Price card: one allele's change split among snakes and among the copies inside each snake)
    organism  13 (the Price equation built: cov(w, z), E(wΔz), priceTerms); 16 C (cmPrice each generation); 18 Q4 (bighorn,
              Price terms on a real record)
    species   21's first draft (species selection: dispersers win inside species and rejoin cut-off pieces; Price three ways,
              between / inside / at splits, exact to 1e-12; parked in lesson21_overhaul.md with its measurements); 20 E (wing
              length: a trait setting gene flow, hence speciation, and range size, hence extinction)
    culture   21 C (planned): learned song, a trait with no gene whose transmission term is the copying

Archived sources only (CLAUDE.md: never precedent): 26 (two levels, between and within), 30 (cells stop competing: the body),
31 (workers stop reproducing: the colony), 34 (what is an individual).

## Shape (a sketch, 2026-10-28; nothing measured)

    - The nested equation as a diagram: 15's levels (organism ← cell ← gene) turned outward to species, one box per level,
      each box holding its two terms (selection among its units, transmission inside them).
    - Traits with opposite signs at two levels: a transposon (gene up, cell or organism down); a cell lineage that divides
      faster (cell up, organism down); dispersal (organism up, species splitting down: 21's first draft); JM's diet
      specialisation (below).
    - Targets on outcomes: the trait's end frequency across the clade; the same end reached by toggles at different levels
      (20 A's T3/T4 pattern); a run that ends in extinction.
    - Possibly a ladder: two adjacent levels at a time (gene/cell, cell/organism, organism/species), then the whole stack.

## Moved here from lesson22_overhaul.md (2026-10-28)

The species level once planned as 22 D (verbatim):

    D  the Price equation, brought together. Each generation the change in the helping allele's frequency split, from the run:
       cov(w, z) / w̄ (selection, split further into the bird's own cost and the benefit from kin) and E(wΔz) (transmission:
       mutation breaking the gene). Then one level up: 20 D's clades and the archived 21's species, the same equation with
       species as the units (between species and within) — the trait good for the bird and bad for the species (20 D's wing
       length, with an individual-level arrow turned on). Bars show the terms adding to the change exactly.

    D  up the levels: 15 C/D's nested picture turned outward (bird → kin group → species), the archived 21's species and 20
       D's clades as the top level; the bighorn pedigree (18) as real data for relatedness, if the kinship there is worth a
       panel (no helping data on file: data/clean has no cooperative-breeding record; the scrub-jay files carry years and
       cohorts only).

("The archived 21" there is 21's first draft, still at `app/lessons/lesson21.html` until it is archived; `app/archive/lesson21.html`
is an unrelated old draft on mutation target size. "20 D" there is 20 E since 2026-10-28.)

Review note (22, 2026-10-28): **D one level up** inherits 20 D's founder's bias at speciation: name three terms (between
species, within, at the splits), not two (the archived 21's measurement: the splits term is large).

### JM's three-level idea (2026-10-28, verbatim; was "Idea for 22 or a later 23")

> I am also envisioning slotting a modified version of 20D where we have gene, organism, and species level features & have
> students target different end frequencies of trait or the same ends via different toggles. Adding in things like evolving to
> extinction would be interesting too (eg genes -> ecological specialization [herb-omni-carn?], with generalists having high
> dispersal but low local abundance and specialists having low dispersal but high local abundance—I'm imagining students setting
> local scale fitness landscapes for a trait and watching that percolate down through evolutionary time to produce various
> outcomes). Maybe that's in 22, maybe a future 23.

Readings: "percolate down through evolutionary time" = the local fitness landscape's effect carried forward to clade-level
outcomes; "evolving to extinction" = selection inside species driving the species (or the clade) toward extinction.

- Shape: 20 D's diagram with a box at each level (gene → organism → species), the student setting a local fitness landscape for
  one trait (diet: herbivore / omnivore / carnivore); targets on the trait's end frequency across the clade, including the same
  end reached by different toggles (lesson 20 A's T3/T4 pattern, one level up), and runs that end in extinction.
- The trade-off as JM states it: generalists disperse far but are locally rare; specialists disperse little but are locally
  abundant. Dispersal ties to speciation (20 D's gene-flow arrow); local abundance ties to extinction (20 D's range arrow).
- Carries forward from the 2026-10-28 review of 20 D: the trait there changes only at speciation (a founder's bias, Simpson's
  "at the splits" term), so a three-level version needs that term kept apart from species sorting, and the three Price terms
  named apart (WORK_ORDER: never fused).

## Measure first

- Time scales: cells divide many times a generation; species form over thousands. One engine spanning all four levels may be
  too slow for a page. Likely each level keeps its own engine (15 D's cells, 13's organisms, 21's species-level engine) with
  the lower level summarised per unit above it. Time a prototype before choosing.
- The terms nest exactly only if each level's average is the count-weighted average of the level below. 21's first draft
  counts species once each (its Open 4); with organisms inside, that clade average is not the average over birds. Pick the
  weighting before the build and show any difference as its own bar, not a hidden leftover.
- The "at the splits" term at the species level (Simpson's directional speciation) has an organism-level twin: the
  single-cell bottleneck at each new organism. Both stay named apart.

## Open for JM

1. Which levels: gene, cell, organism, species. Kin as a level of its own (between kin groups), or as the gene's view of the
   organism level (inclusive fitness)?
2. One trait carried through every level, or a ladder of adjacent pairs and then the whole stack?
3. The species level: 21's first draft (dispersal), 20 E's wing length with an individual-level arrow turned on, or the diet
   specialisation idea above?
4. 21's first-draft questions, carried here: extinction tied to the trait or flat; the fossil horses (data/clean/horse_*) as
   real data for the species level; "at the splits" kept apart or folded into "inside species".

## Items

| # | What | Status |
|---|------|--------|
| 1 | JM's second ruling (2026-10-28); this plan; the species level and the three-level idea moved here from 22 | done |
| 2 | JM rules on Open 1-4 | todo |
| 3 | slot fixed (23, 24 or 25) once 21 and 22 are; file renamed | todo |

## Rulings

- 2026-10-28 (second ruling): the target lesson is a hierarchical Price equation lesson, cellular, organismal and species
  levels, perhaps the genetic level with kin and transposons; 21 and 22 build toward it; it lands at 23-25.

## Do not

- Fuse the Price terms into one leftover (WORK_ORDER), at any level.
- State on screen that dispersal lowers splitting (21's first draft: students find it).
