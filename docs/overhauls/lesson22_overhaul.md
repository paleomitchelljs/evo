# Lesson 22 — the Price equation, brought together: kin selection and altruism, mechanically

**File** · `app/lessons/lesson22.html` (not yet built; the archived lesson22.html is an unrelated old draft on codon ratios)
**Checks** · `node scripts/check_lesson22_numbers.js` · `python3 scripts/check_lessons.py` · `node scripts/check_layout.js`
**Status** · PLANNED (2026-10-28), not started
**Last touched** · 2026-10-28

## JM, 2026-10-28 (verbatim)

> Lesson 22 I want to bring it on. The idea is to synthesize a lot of we've done so far in the price equation. To illustrate kin
> selection & altruism mechanistically rather than stating it. I'm thinking of simple diagrams showing traits influencing behavior
> and behavior influencing others. If the "others" tend to be related, and the cost isn't too great, that allele will increase in
> frequency. We can then give a population where helpfulness is at fixation, and every mutation "breaks" the helpfulness gene and
> so the original helpful allele competes against the new non-helpful allele. Students can then see the rise and fall of altruism
> via genetic network effects in behavior, average relatedness, and the resulting allele frequencies

Earlier the same day, on 20 D: "Opens it up more to a later extension ... where we ultimately break down further in lesson 21 to
show how a trait can have different effects on fitness between individuals in a population & between species within a clade."
With 21 now on speciation, that breakdown lands here, as D.

## What the lesson is

- Hamilton's rule without being told it: a helping allele rises when the birds it helps tend to carry it too and the cost is not
  too great. Relatedness is measured off the pedigree (20 A's coalescence: the chance two copies share a recent ancestor), never
  given; b and c are arrows; the rule is what the runs show.
- Worth protecting: the Price equation's terms are computed from the run and shown to add up exactly (lesson 13's covariance,
  the multilevel split of the archived 26), never fused into one leftover (WORK_ORDER).

## Plan (proposed)

    A  a behaviour that reaches others. A diagram (paths.js, with 20 D's box plots): helping allele → helping (a behaviour) →
       its own survival (cost, red) and → a neighbour's survival (benefit, blue). Birds on a grid (or a ring) of nests; young
       settle near their parents with a dispersal distance the student sets, so neighbours are kin when dispersal is short.
       A network view: who helps whom this season, arrows between birds, helpers' arrows drawn. Targets: the helping allele
       rises with a given b and c (dispersal free); it falls at the same b and c (dispersal long); the same rise with less
       benefit by making neighbours closer kin.
    B  relatedness, measured. The pedigree (20 A's engine and view) under the grid: click a bird and a neighbour, see where
       their copies meet; the plot of average relatedness between helper and helped (the chance their copies at the helping
       locus meet within so many generations, or the regression of a neighbour's allele on the helper's). Targets on the
       measured r: make it high, low; the student finds where r x benefit = cost, read off the runs (a drawn round on
       the allele's change against r, the line crossing zero at c / b).
    C  the rise and fall. A population where helping is fixed; mutation breaks the helping gene (a loss-of-function target, so
       mutation to non-helping is common and back-mutation rare). The helpful allele against the broken ones: allele
       frequency, average relatedness among interacting birds, and the helping network over time. Targets: helping holds
       (short dispersal, cheap help); helping collapses (long dispersal); a population that cycles (non-helpers invade, the
       network thins, groups of helpers re-form where kin cluster), if the engine produces it (measure first).
    D  the Price equation, brought together. Each generation the change in the helping allele's frequency split, from the run:
       cov(w, z) / w̄ (selection, split further into the bird's own cost and the benefit from kin) and E(wΔz) (transmission:
       mutation breaking the gene). Then one level up: 20 D's clades and the archived 21's species, the same equation with
       species as the units (between species and within) — the trait good for the bird and bad for the species (20 D's wing
       length, with an individual-level arrow turned on). Bars show the terms adding to the change exactly.

Build notes: engine new (a spatial population with a helping locus); 20 A's pedigree trace (`pdUp`, `pdPairs`) for relatedness;
13's Price terms (`priceTerms`, kept split, WORK_ORDER); the archived 26 (two levels: between and within) as a source; scaffold
s12 (Hamilton's rule) as the guess-and-check drill alongside.

## What 11-20 already did (read 2026-10-28)

    11     kinship down a pedigree (rises under drift) against 1 - Ho/He (WORK_ORDER: never fuse the two F's); SNPs shared by kin
    13     the Price equation built: cov(w, z) and E(wΔz) from the run, then each split by arrows on a diagram (priceTerms)
    14 C-D additive genetic variation (polygenic); frequency dependence (a trait's fitness set by its own frequency)
    15 A-B coalescence on a pedigree (the snake game): each locus one parent; MRCA is not the first mutant
    15 C-D the Price equation down the levels: organism ← cell ← gene (the race; jumping genes, cells with a preference)
    16 C   the Price split each generation in copy-or-mate (cmPrice)
    17 D   four populations, migration arrows dragged, F per population
    18 Q4  bighorn sheep, hunting: the Price terms on a real record (data/clean/bighorn_*: horn lengths, a pedigree)
    20 A   when two copies meet, by kind of pair (a pedigree's relatedness in all but name); 20 D species and clades

So 22's pieces are mostly there; what is new is behaviour as a cause on someone else's fitness, and relatedness as the
covariance that makes it pay. The synthesis: 15 went down the levels (cells, genes inside the organism's transmission term);
22 goes up (kin, then species, 20 D), the same two Price terms at every level. Revised against that:

    A  as planned, the diagram built on 13's arrows and 20 D's box plots; dispersal on the grid is 17's migration.
    B  relatedness from 11's kinship (pedigree) and 20 A's pairs meeting, measured between helper and helped; Hamilton's line
       found on 13's terms: Δp's selection term splits into the bird's own (-c x its variance) and from others (b x the
       covariance with the birds it helps), both drawn as 13 draws its terms.
    C  as planned; 14 D's frequency dependence is the comparison (non-helpers do best when rare among helpers).
    D  up the levels: 15 C/D's nested picture turned outward (bird → kin group → species), the archived 21's species and 20
       D's clades as the top level; the bighorn pedigree (18) as real data for relatedness, if the kinship there is worth a
       panel (no helping data on file: data/clean has no cooperative-breeding record; the scrub-jay files carry years and
       cohorts only).

## Open for JM

1. Space: a grid of nests (birds help their neighbours) or groups (birds help their group-mates; relatedness from how groups
   form)? A grid gives kin clustering from short dispersal without any rule about recognising kin; groups make the Price split
   between and within groups cleaner. Recommendation: grid for A-C, groups appear in D as the bridge to species.
2. D's species level: fold the archived 21's dispersal clade in, or only 20 D's wing-length clade with an individual-level arrow?
3. Name Hamilton's rule on the page after students find it (the solved banner), or never?

## Review notes (2026-10-28, before any build; not yet ruled on)

- **Kin competition may cancel the grid's effect.** Short dispersal makes neighbours kin but also makes kin compete for the
  same nests; with fixed density and local competition the two cancel and helping gains nothing from viscosity alone (Taylor
  1992, Evol Ecol 6: altruism in viscous populations). The grid in A-C needs something that breaks the tie (helping raises local
  numbers: empty nests or elastic density; or competition for nests that is not local), or groups that send their young to a
  common pool. The prototype (item 3) should measure exactly this before Open 1 is settled: helping's change against dispersal
  with everything else fixed.
- **The split of cov(w, z) into "own cost" and "benefit from kin" is a regression.** It adds up exactly only when fitness is
  linear in the bird's own helping and its neighbours'; otherwise a residual is left. Build fitness additive or show the
  residual as its own bar (WORK_ORDER: terms never fused into a leftover; the same logic says a leftover is never hidden).
- **r for the rule is the regression** of the helped bird's allele on the helper's, relative to the population; 20 A's "copies
  meet within k generations" is the intuition bridge, not the number used.
- **D one level up** inherits 20 D's founder's bias at speciation: name three terms (between species, within, at the splits),
  not two (the archived 21's measurement: the splits term is large).

## Idea for 22 or a later 23 (JM, 2026-10-28, not planned)

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
- Where: 22 is already kin selection plus a species-level D. If both go in one lesson it is long; a 23 holding this and 22 D's
  species level together is the likelier fit. JM to decide.

## Items

| # | What | Status |
|---|------|--------|
| 1 | JM's brief (2026-10-28) and this plan | done |
| 2 | JM rules on Open 1-3 | todo |
| 3 | engine prototype: spatial helping, dispersal; measured r against dispersal; Hamilton's line from runs | todo |

## Rulings

- 2026-10-28: 22 synthesises the Price equation through kin selection and altruism, shown mechanically (diagrams: trait →
  behaviour → others), relatedness and cost deciding the allele's fate; helping at fixation broken by mutation; the rise and fall
  seen in behaviour networks, average relatedness and allele frequencies.

## Do not

- State Hamilton's rule, or that relatives share alleles, before the runs show it.
- Fuse the Price terms (WORK_ORDER).
