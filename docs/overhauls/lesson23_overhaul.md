# Lesson 23 — species selection and hierarchical selection (was `hierarchical_price_plan.md`, the 2026-10-28 target lesson)

**File** · `app/lessons/lesson23.html` — draft 1 (2026-11-07, v1, 5 bits, LOCKS `x`; `app/archive/lesson23.html` is an unrelated old draft on incompatibilities)
**Checks** · `node scripts/check_lesson23_numbers.js` (to write) · `python3 scripts/check_lessons.py` · `node scripts/check_layout.js`
**Status** · DRAFT 1 BUILT 2026-11-07 (JM: "let's please draft leson 23 and onward"; Open 1-4 unanswered, taken on the recommendations below). PLANNED before. Slot fixed 2026-11-07 (JM: "23: species selection / hierarchical selection"); file renamed. Before that
it was the target lesson, gene, cell, organism and species at once (2026-10-28, below). Nothing built
**Last touched** · 2026-11-07

## JM, 2026-11-07 (verbatim, the 23 part and the capstone; the whole message is in lesson21_overhaul.md)

> 23: species selection / hierarchical selection
>
> 2X: Michod style origins of individuality extending the hierarchical framework to show how cooperation evolves by shifting
> the weight of cov(w,z) to different levels. This is the full capstone, and perhaps it should come after Evo-devo…I'm not sure

## What moved (2026-11-07)

    gene      stays 22's (kin as the gene's view; greenbeard, drive, transposon)
    organism  23, the lower of its two levels
    species   23, the upper level
    cell      to the capstone (lesson26_overhaul.md): cells into an individual is Michod's transition
    the stack all four levels in one picture: to the capstone, as its last stage ("the full capstone")

So 23 builds the hierarchical framework at two levels (the multilevel Price equation, between and within), with species as
the units above organisms; the capstone extends it ("extending the hierarchical framework") to the shift itself. JM's
three-level idea (gene → organism → species, diet, evolving to extinction; verbatim below) stays here as an optional last stage.

## What the lesson is (2026-11-07)

- A trait's change across a clade, split from the run into between species and within species (Simpson's way), the
  at-the-splits term named apart; traits that act on splitting and extinction rather than on the bird.
- Worth protecting: a trait favoured in every species can fall across the clade, and the reverse; which wins is read off the
  terms, never stated. Students find the link from the trait to splitting (the parked first draft's rule, below).

## The lecture behind it (docs/2026_lecture_detail.tex, Lec 29 and 31; verbatim)

- 202_lec29_01: "Speciation traits become more common among species over time. This is selection not on the individual but on
  the whole species—on the act of speciating. It can be opposite of selection at the individual level. Lineages that speciate
  fast become more numerous on the planet—even if individuals within them aren't more fit."
- "Speciation traits are heritable across species": "Strong sexual selection: easy reinforcement"; "Microhabitat preference
  (host-plant choice)"; "Geographic location (daughters inherit ancestral range)"; "Lock-and-key genitalia, floral morphology";
  "Parental care system".
- 202_lec29_02, platypus and fairy-wren: "Same start, same capacity. Time passes—the platypus stays one species; the fairy wrens
  have speciated maybe twice. ... But the lineage made more species." Five-step argument: "Selection has shifted up a level".
- "Self-fertilization: good for individual, bad for species".
- 202_lec29_03: "The unit of selection depends on the scope." 202_lec29_05: "There's no privileged level."
- Lec 31, the speciation–extinction trade-off: "High migration: broad range, low extinction, low speciation"; "Low migration:
  narrow, high extinction, high speciation"; "Species-level traits, not individual-level".

## Shape (a sketch, 2026-11-07; nothing measured)

    A  from 21: species whose birds choose strongly split more (Lec 29's fairy-wren and platypus). A species-level engine, each
       species carrying a choosiness (21 A summarised per species: its splitting chance set by it). The trait's share among
       species rises though no bird in any species is better off; with species as units the change sits in the between-species
       term. Targets on the clade's end.
       The link must not be asserted: a species-level rule "choosiness sets the splitting chance" states what B's students find.
       Read it off 21 A instead (a cut-off piece holds apart with the chance 21 A's engine measures at that strength), the lower
       level summarised per unit above it (the 10-28 time-scale note, below). Measure first.
    B  good for the bird, bad for splitting: the parked first draft of 21 (dispersers win inside every species and rejoin
       cut-off pieces, so their species split less; Price three ways, exact to 1e-12; below). Inside rises, between falls.
       Targets as the first draft's T1-T3.
    C  splitting against extinction (Lec 31's trade-off; the first draft's Open 1 asked for extinction tied to the trait):
       dispersal widens ranges (fewer losses) and lowers splitting; the clade's end depends on which wins.
    D  optional: JM's three levels (gene → organism → species; herbivore / omnivore / carnivore; evolving to extinction),
       if it stays tractable.

Real data: the fossil horses (`data/clean/horse_*`: body size, hypsodonty, a tree) for between and within (the first draft's
Open 3); untried.

## JM, 2026-11-07 (verbatim)

> Great, let's please draft leson 23 and onward.

Taken as: build 23 on the recommendations (A choosiness then B dispersal; C extinction tied to the trait if it measures
cleanly; self-fertilization and the three-level idea left for later), then evo-devo, mesoevolution, the capstone.

## Draft 1 prototype (2026-11-07; scratchpad l23/eng.js, engC.js; 16 clades x 1000 generations, start .5)

    engine     the first draft's species-level engine (200 birds a species, binomial breeding, mutation .0005 each way; a
               barrier cuts a 10-bird piece off; apart 40 generations it is a new species; Price three ways every 50
               generations, between / inside / at the splits, species counted once each). Two traits:
               choosiness (A): a choosy allele costs its bird (k: young 1 - k); a piece's colour drifts (sd .05 a generation,
               the species' .05 x sqrt(10/200)); each generation the piece meets its species with chance .05 and rejoins with
               chance exp(-S a gap^2), a the two's mean choosy share, S the preference strength: 21 A's mating rule.
               dispersal (B, C): the first draft's (advantage s; dispersers cross with chance d x mean share).
    pace       pieces cut off with chance .3 x room, up to 60 species (the first draft: .1, 40). Needed for C (with .1 / 40,
               losses that matter left 2-6 species and seed sets disagreed by .1-.2); A and B keep their pattern at it.
    A (k .005) S 0 .28, 10 .49, 30 .53, 100 .64 (between +.14 to +.40, inside -.19 to -.43). S 30: k 0 .71, .005 .53, .02 .30.
    B (d .05)  s 0 .23, .002 .30, .005 .36, .01 .48, .02 .56 (inside +.13 to +.87, between -.29 to -.48).
               s .005: between d .02 -.29, .05 -.37, .1 -.32, .2 -.08, .5 -.07 (pieces rejoin: few species form).
    C          a species lost with chance E0 x (1 - its share of dispersers) (a broad range: Lec 31). s .005, d .05, three seed
               sets: E0 .002 between -.16 to -.18; .005 -.01 to -.10; .01 +.13 to +.21; .02 +.34 to +.36 (at pace .3 / 60;
               .02 with .1 / 40). A partial protection (half) barely moved it (-.07 to -.24 at .01): left out.
    not used   protection at the first draft's pace (noisy, 2-6 species); E0 .012-.016 without the faster pace.

Rounds planned (bars to confirm over 20 seed sets on the page's engine):
    A1 cost .005 held, strength free (opens 0): the clade's choosy share .4 or more.
    A2 strength 30 held, cost free (0, .005, .02; opens .005): .4 or less.
    B1 how far .05 held, advantage free (0, .002, .005, .02; opens .02, rises): the clade's share .42 or less.
    B2 advantage .005 held, how far free (.02, .05, .1, .5; opens .5): between species -.2 or less.
    C1 advantage .005, how far .05 held; losses free (1 in 500, 1 in 100, 1 in 50; opens 1 in 500): between +.05 or more.

## Draft 1 as built (2026-11-07)

    page       lesson 22's machinery (head, helpers, stage machine, plot over time, Target card, split panel), stitched by
               scratchpad l23/gen.py; the archived first draft's tree. Each stage: the clade (clade 1's tree, shaded by its
               share, x a loss), over time (the clade's share; species living; between species, added up), the change taken
               apart (between species, inside species, at the splits, all of it), the diagram, Target, R last and closed.
    clades     32 a Go (16 left the bars overlapping: A1's opening .21-.45 against strength 10's .42-.61 over 20 seed sets);
               0.45 s a Go.
    diagrams   A: choosiness gene -> a bird's young (cost of choosiness, red); choosiness gene onto colour gap -> the piece
               rejoins (preference strength); rejoins -> a new species (fixed). B: dispersal gene -> a bird's young
               (advantage); dispersal gene -> a cut-off piece rejoins (how far dispersers go); rejoins -> a new species. C: B's,
               plus dispersal gene -> its range (fixed) -> the species lost (losses, red). The link to splitting is drawn only
               through the piece rejoining; what it does to the clade, students find.
    bars       20 seed sets of 32 clades (scratchpad l23/spread32.js):
               A1 cost .005, strength free 0 / 30 / 100 (opens 0, .24-.44): choosy share >= .5 (30 .56-.68). Strength 10 cut
                  (.46-.60 against a bar it would need at .45).
               A2 strength 30, cost free 0 / .005 / .02 (opens .005, .56-.68): <= .45 (.02 .23-.32; between still +.19 to +.41).
               B1 how far .05, advantage free 0 / .002 / .005 / .02 (opens .02, .60-.69): dispersers' share <= .45 (.005
                  .27-.37), inside positive.
               B2 advantage .005, how far free .02 / .05 / .5 (opens .5, between -.14 to -.03): between <= -.2 (.05 -.46 to
                  -.33). How far .1 cut (-.37 to -.18 crossed the bar).
               C1 losses free 1 in 500 / 100 / 50 (opens 1 in 500, between -.26 to -.16): between >= 0 (1 in 100 +.11 to +.22).
    checks     `check_lesson23_numbers.js`: 18 checks + both widths + 3 R panels (R_G=150 runs them longer): binomial draws;
               rejoining (.0185 against 1/20 x e^-1; .050; .497); losses (.151 against .15); the three parts exact (3e-16) and
               equal to the share's change; hits and misses; A2 and B1's levels pulling apart; the flow through 5 bits.
    left out   C as a lever on how much dispersers protect (half protection barely moved it); a drawn round (the first draft's
               B3, REVISIONS row 15); sister clades and the fossil horses; self-fertilization; the three-level idea.

## Open for JM (2026-11-07)

1. A (choosiness → splitting, from 21) as the opener? It is the lecture's own example and carries 21 forward; B is already
   built and measured as the first draft. Recommendation: A then B.
2. C: extinction tied to the trait. The first draft found an explicit "dispersers protect the species" lever barely moved
   species selection (speciation swamped it), and a range-based model reversed the effect. Worth a stage, or a menu option?
3. Self-fertilization (Lec 29: "good for individual, bad for species") as a second trait beside dispersal?
4. Carried from 2026-10-28 (below): Open 2 (one trait or a ladder; now moot at two levels), 3 (which species level: now A-C),
   4 (the fossil horses; the at-the-splits term apart or folded).

## Items (2026-11-07)

| # | What | Status |
|---|------|--------|
| 1 | slot fixed (23); renamed from `hierarchical_price_plan.md`; cell level and the stack moved to the capstone | done 2026-11-07 |
| 2 | JM rules on Open 1-4 (2026-11-07) | taken on the recommendations for draft 1 (JM: "draft leson 23 and onward") |
| 3 | engine: the first draft's species-level engine (`app/archive/lesson21_species_2026-10-20.html`) + a choosiness trait for A | done 2026-11-07 (prototype) |
| 4 | page, check script | done 2026-11-07 (draft 1, v1, 5 bits) |
| 5 | JM plays draft 1; Open 1-4; his voice for A-C; whether C stays one target | todo |

## Rulings (2026-11-07)

- 23 = species selection and hierarchical selection. The capstone (Michod) extends the framework; the cell level is its.

# Before 2026-11-07: the target lesson (gene, cell, organism, species), planned 2026-10-28

Kept as written then; its level table now reads per "What moved" above.

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
    kin       22 A-C (planned) helping, relatedness off the pedigree (11, 15, 20 A), Hamilton's rule found. Sits inside the
              gene level as the gene's view (inclusive fitness), not a level of its own (JM, 2026-10-28)
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

## Measure first (deferred to the build)

JM, 2026-10-28: "We can cross those technical bridges and conceptual issues when we get there; for now I want it more as a
design lodestar for these lessons." Kept so they are not rediscovered the hard way:

- Time scales: cells divide many times a generation; species form over thousands. One engine spanning all four levels may be
  too slow for a page. Likely each level keeps its own engine (15 D's cells, 13's organisms, 21's species-level engine) with
  the lower level summarised per unit above it. Time a prototype before choosing.
- The terms nest exactly only if each level's average is the count-weighted average of the level below. 21's first draft
  counts species once each (its Open 4); with organisms inside, that clade average is not the average over birds. Pick the
  weighting before the build and show any difference as its own bar, not a hidden leftover.
- The "at the splits" term at the species level (Simpson's directional speciation) has an organism-level twin: the
  single-cell bottleneck at each new organism. Both stay named apart.

## Open for JM

1. ~~Kin as a level of its own, or the gene's view?~~ Answered 2026-10-28: the gene's view. Levels: gene (with kin and
   transposons), cell, organism, species. The two splits are the same change partitioned two ways, so nothing is lost; and
   22's grid neighbourhoods overlap, so they are not nested units that could form a level anyway.
2. One trait carried through every level, or a ladder of adjacent pairs and then the whole stack?
3. The species level: 21's first draft (dispersal), 20 E's wing length with an individual-level arrow turned on, or the diet
   specialisation idea above?
4. 21's first-draft questions, carried here: extinction tied to the trait or flat; the fossil horses (data/clean/horse_*) as
   real data for the species level; "at the splits" kept apart or folded into "inside species".

## Items (2026-10-28)

| # | What | Status |
|---|------|--------|
| 1 | JM's second ruling (2026-10-28); this plan; the species level and the three-level idea moved here from 22 | done |
| 2 | JM rules on Open 1-4 | 1 done 2026-10-28; 2-4 wait for the build |
| 3 | slot fixed (23, 24 or 25) once 21 and 22 are; file renamed | done 2026-11-07 (23) |

## Rulings (2026-10-28)

- 2026-10-28 (second ruling): the target lesson is a hierarchical Price equation lesson, cellular, organismal and species
  levels, perhaps the genetic level with kin and transposons; 21 and 22 build toward it; it lands at 23-25.
- 2026-10-28: a design lodestar for 21 and 22 for now; technical and conceptual issues settled at its build. Kin as the gene's
  view.

## Do not (both plans)

- Fuse the Price terms into one leftover (WORK_ORDER), at any level.
- State on screen that dispersal lowers splitting (21's first draft: students find it).
