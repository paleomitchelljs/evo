# Lesson 22 — kin selection and gene-level competition: the Price equation, mechanically

**File** · `app/lessons/lesson22.html` (not yet built; the archived lesson22.html is an unrelated old draft on codon ratios)
**Checks** · `node scripts/check_lesson22_numbers.js` · `python3 scripts/check_lessons.py` · `node scripts/check_layout.js`
**Status** · PLANNED (2026-10-28), not started. Revised the same day (JM's second ruling): the species level moves to the
hierarchical Price lesson (`hierarchical_price_plan.md`); D is now gene-level competition; 22 opens from 21's birds
**Last touched** · 2026-10-28

## JM, 2026-10-28 (verbatim)

> Lesson 22 I want to bring it on. The idea is to synthesize a lot of we've done so far in the price equation. To illustrate kin
> selection & altruism mechanistically rather than stating it. I'm thinking of simple diagrams showing traits influencing behavior
> and behavior influencing others. If the "others" tend to be related, and the cost isn't too great, that allele will increase in
> frequency. We can then give a population where helpfulness is at fixation, and every mutation "breaks" the helpfulness gene and
> so the original helpful allele competes against the new non-helpful allele. Students can then see the rise and fall of altruism
> via genetic network effects in behavior, average relatedness, and the resulting allele frequencies

## JM, 2026-10-28, second ruling (verbatim, the 22 part; the whole message is in lesson21_overhaul.md)

> We need to build to a hierarchical Price equation lesson that does cellular level, organismal level, and species level (maybe
> also genetic level with Kin and transposons included). That's the target lesson. [...] This lesson [21] should build such
> that it flows easily into 22, on kin selection and genetic-level competition in general. Depending on if we end up splitting
> either of those two, the big hierarchical Price lesson would end up as one of 23-25

So the species-level breakdown that was to be 22 D (JM on 20 D, earlier the same day: "where we ultimately break down further
... between species within a clade") goes to the hierarchical Price lesson; 22 D becomes genes competing inside the bird.

## What the lesson is

- Hamilton's rule without being told it: a helping allele rises when the birds it helps tend to carry it too and the cost is not
  too great. Relatedness is measured off the pedigree (20 A's coalescence: the chance two copies share a recent ancestor), never
  given; b and c are arrows; the rule is what the runs show.
- Gene-level competition: an allele can spread by helping copies of itself in other birds whether or not they are kin (a
  greenbeard), or by out-copying the rest of its own genome at the bird's cost (a driving allele, a transposon).
- Worth protecting: the Price equation's terms are computed from the run and shown to add up exactly (lesson 13's covariance,
  the multilevel split of the archived 26), never fused into one leftover (WORK_ORDER).

## Plan (proposed)

    A  a behaviour that reaches others. A diagram (paths.js, with 20 D's box plots): helping allele → helping (a behaviour) →
       its own survival (cost, red) and → a neighbour's survival (benefit, blue). Birds on a grid (or a ring) of nests; young
       settle near their parents with a dispersal distance the student sets, so neighbours are kin when dispersal is short.
       A network view: who helps whom this season, arrows between birds, helpers' arrows drawn. Targets: the helping allele
       rises with a given b and c (dispersal free); it falls at the same b and c (dispersal long); the same rise with less
       benefit by making neighbours closer kin.
       From 21 (second ruling): the birds are 21's; the who-helps-whom network is 21 A's who-mated-whom network; a learned call
       (21 C's song) as a kin cue: helpers help birds that call like them (long-tailed tits, Sharp et al. 2005, Nature).
       Learned from the parents the cue tracks kin; learned from the neighbours it does not.
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
    D  genes that compete inside the bird (second ruling; the species level that was here is in hierarchical_price_plan.md).
       (i) A greenbeard: the helping allele also makes a tag and helps birds with the tag, kin or not (21 A's "prefer a partner
       like yourself", turned to helping); a falsebeard (the tag without the help) breaks it, as C's mutation breaks the
       helper. (ii) An allele that raises its own share at the bird's cost: a driving allele in the gamete race (15 C) or a
       transposon (15 D's jumps), spreading while the birds carrying it leave fewer young. The Price split each generation,
       from the run: cov(w, z) / w̄ between birds against E(wΔz) inside them (transmission), opposite in sign. Bars show the
       terms adding to the change exactly.

Build notes: engine new (a spatial population with a helping locus); 20 A's pedigree trace (`pdUp`, `pdPairs`) for relatedness;
13's Price terms (`priceTerms`, kept split, WORK_ORDER); the archived 26 (two levels: between and within) as a source; scaffold
s12 (Hamilton's rule) as the guess-and-check drill alongside. For D: 15 C's race and 15 D's jumping gene (engines on the page).

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
    21     (planned, second ruling) who-mated-whom network; a matching rule (prefer a partner like yourself); learned song

So 22's pieces are mostly there; what is new is behaviour as a cause on someone else's fitness, and relatedness as the
covariance that makes it pay. The synthesis: 15 went down the levels (cells, genes inside the organism's transmission term);
22 goes up (kin, then species, 20 D), the same two Price terms at every level. (Second ruling: "then species" is now the
hierarchical Price lesson's; 22 goes up to kin and back down to genes competing inside the bird.) Revised against that:

    A  as planned, the diagram built on 13's arrows and 20 D's box plots; dispersal on the grid is 17's migration.
    B  relatedness from 11's kinship (pedigree) and 20 A's pairs meeting, measured between helper and helped; Hamilton's line
       found on 13's terms: Δp's selection term splits into the bird's own (-c x its variance) and from others (b x the
       covariance with the birds it helps), both drawn as 13 draws its terms.
    C  as planned; 14 D's frequency dependence is the comparison (non-helpers do best when rare among helpers).
    D  (second ruling) genes inside the bird: 15 C's race and 15 D's jumps (whose cost falls on the cell) are the gene-level
       pieces; 22 D puts the cost on the bird, so the two Price terms take opposite signs. The bighorn pedigree (18) as real
       data for relatedness, if the kinship there is worth a panel (no helping data on file: data/clean has no
       cooperative-breeding record; the scrub-jay files carry years and cohorts only). Going up the levels (bird → kin group →
       species) is now the hierarchical Price lesson's.

## Open for JM

1. Space: a grid of nests (birds help their neighbours) or groups (birds help their group-mates; relatedness from how groups
   form)? A grid gives kin clustering from short dispersal without any rule about recognising kin; groups make the Price split
   between and within groups cleaner. Recommendation: grid for A-C, groups appear in D as the bridge to species. (Second
   ruling: a learned call as the kin cue, from 21 C, is a third way, and avoids the kin-competition problem below: help goes
   to kin by recognition, not by living close.)
2. D: a greenbeard, a driving allele, a transposon: all three, or one? If 22 runs long it splits (kin selection; gene-level
   competition), which is one of the splits that decides whether the hierarchical Price lesson is 23, 24 or 25.
3. Name Hamilton's rule on the page after students find it (the solved banner), or never?
4. (Was 2, moved:) D's species level is now the hierarchical Price lesson's question.

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
- **D one level up** (moved to hierarchical_price_plan.md with the species level): inherits 20 D's founder's bias at
  speciation: name three terms (between species, within, at the splits), not two.
- **A greenbeard holds only while the tag and the help stay together.** Recombination between them, or a mutation giving the
  tag without the help, breaks it: the same race as 21 B's magic trait against a separate cue. One gene for both (magic)
  cannot be broken by crossing over, only by mutation.

## Idea for 22 or a later 23 (JM, 2026-10-28) — MOVED

JM's three-level 20 D idea (gene, organism, species; diet specialisation; evolving to extinction) is now in
`hierarchical_price_plan.md`, verbatim, as a candidate for that lesson's species level.

## Items

| # | What | Status |
|---|------|--------|
| 1 | JM's brief (2026-10-28) and this plan | done |
| 2 | JM rules on Open 1-3 | todo |
| 3 | engine prototype: spatial helping, dispersal; measured r against dispersal; Hamilton's line from runs | todo |
| 4 | JM's second ruling (2026-10-28): species level out to the hierarchical Price lesson; D gene-level competition; A from 21's birds | done (plan) |

## Rulings

- 2026-10-28: 22 synthesises the Price equation through kin selection and altruism, shown mechanically (diagrams: trait →
  behaviour → others), relatedness and cost deciding the allele's fate; helping at fixation broken by mutation; the rise and fall
  seen in behaviour networks, average relatedness and allele frequencies.
- 2026-10-28 (second ruling): 22 = kin selection and genetic-level competition in general; 21 flows into it; the hierarchical
  Price lesson (cell, organism, species; perhaps gene with kin and transposons) is the target, at 23-25.

## Do not

- State Hamilton's rule, or that relatives share alleles, before the runs show it.
- Fuse the Price terms (WORK_ORDER).
