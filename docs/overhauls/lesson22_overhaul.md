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

## Open for JM

1. Space: a grid of nests (birds help their neighbours) or groups (birds help their group-mates; relatedness from how groups
   form)? A grid gives kin clustering from short dispersal without any rule about recognising kin; groups make the Price split
   between and within groups cleaner. Recommendation: grid for A-C, groups appear in D as the bridge to species.
2. D's species level: fold the archived 21's dispersal clade in, or only 20 D's wing-length clade with an individual-level arrow?
3. Name Hamilton's rule on the page after students find it (the solved banner), or never?

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
