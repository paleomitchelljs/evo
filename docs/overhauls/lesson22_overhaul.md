# Lesson 22 — kin selection and gene-level competition: the Price equation, mechanically

**File** · `app/lessons/lesson22.html` (not yet built; the archived lesson22.html is an unrelated old draft on codon ratios)
**Checks** · `node scripts/check_lesson22_numbers.js` · `python3 scripts/check_lessons.py` · `node scripts/check_layout.js`
**Status** · PLANNED (2026-10-28), not started. Revised the same day (JM's second ruling): the species level moves to the
hierarchical Price lesson (now `lesson23_overhaul.md`); D is now gene-level competition; 22 opens from 21's birds. 2026-11-07
(JM's arc re-cut): 22 = "kin selection / genic level selection", the same substance; 21 is now sexual selection itself (its
learned song parked); 23 is species / hierarchical selection; the cell level goes to the individuality capstone
**Last touched** · 2026-11-07

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

## JM, 2026-11-07 (verbatim, the 22 part; the whole message is in lesson21_overhaul.md)

> 22: kin selection / genic level selection

Nothing in 22's plan changes in substance. What changes around it:
- 21 is sexual selection itself (lesson21_overhaul.md). Its C, a preference rising because choosy mothers have bright sons, is
  an allele gaining through copies in other birds without kin: 22 A can open from it (the same covariance, now with kin).
- 21's learned song (draft 3's C) is parked, so the learned call as a kin cue (A, below) takes its song from lesson 8 C (eggs
  swapped; a son sings the song of the father who raised him), not from 21.
- 23 holds the species level (lesson23_overhaul.md). The cell level (clonal cells, r ≈ 1) and the whole stack are the
  capstone's (individuality_plan.md). 22 D's gene-level competition (drive, transposon) is still the gene level the capstone
  stacks.

## JM, 2026-11-07, later (verbatim): relatedness is a condition, not the cause

> Also to connect to Michod, let's make sure the kin selection activity doesnt imply organisms cooperate **because** theyre
> related, rather being closely related creates the conditions that allow the shift of cov(w,z) sufficiently to create
> cooperation

What it changes:
- Relatedness never appears on screen as the reason a bird helps. It is a condition the student sets (dispersal, how groups form)
  and measures; what decides the helping allele's fate is the covariance between helping and fitness, read off the run.
- Every stage shows the Price split, not a relatedness readout alone: cov(w, z) for the helping allele, with its two parts (the
  bird's own cost; the help it gets from the birds around it), and E(wΔz). Relatedness is the knob that moves the second part;
  the bars show the move.
- B's Hamilton's-line round reads as "where the covariance changes sign", r on the x axis as the condition, not "r b > c, so they
  help". The same r can give no helping when b is small (the condition is not enough by itself).
- The capstone (individuality_plan.md) runs the same picture a level up: clonal groups (r near 1) set the condition; the shift
  of cov(w, z) from inside groups to between them is what makes the group an individual.
- Words: no "because they are related", "kin help kin", "to help their relatives" on screen or in the intros' drafts.

## The lecture behind it (docs/2026_lecture_detail.tex, Lec 30-32; verbatim)

- Hamilton's rule: "C = cost in lost own-offspring"; "B = benefit in recipient's extra offspring"; "r = relatedness
  (regression of recipient genotype on helper's)"; offspring as units because they are the "Only common currency that sums in
  Price equation". 202_lec30_04: "That scaling—relatedness × benefit > cost—is Hamilton's rule. It's a derivative of the Price
  equation."
- 202_lec30_03: "Your neurons cooperate because they're nearly genetically identical." (The capstone's, not 22's.)
- Haplodiploidy: "Sister r=0.75 > daughter r=0.5 → help mom > make daughters"; "Multi-mate queens weaken cooperation".
- Lec 31: "Transmission term alone can drive cooperation (asymmetric mutation; Pachter Cor. 2)". Bears on C: mutation that
  breaks the helping gene is asymmetric mutation the other way, a transmission term against helping (E(wΔz) < 0). C's terms
  should show it.
- Lec 31: "Selfish elements: short-term copy count (transposons)" against "Regulatory elements: long-term persistence + cheap
  variation". D's transposon.
- 202_lec32_05: "the circuit can't detect kinship—it detects proximity. In small inbred groups, nearby = kin." Bears on Open 1:
  the grid (birds help neighbours) is the lecture's mechanism; a learned call is the alternative.
- 202_lec32_04 (Price): "You're not helping your brother—you're helping your genes inside your brother."

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
       2026-10-29, 21 draft 3 (JM): 21 dropped the who-mated-whom panel. Its over-time chart (with a menu), the fitness
       surfaces and the three-gene DAG are what 22 inherits. 21 C is a learned song again: a son sings his father's song,
       and her preference comes from her genes, her father's song or the island's songs. The learned call as a kin cue
       still follows from it.
       2026-10-30: 21 C cut the beak's limit on the song and added his song from his genes or his father. Only father's
       song with her father's song holds: the song tracks the father's line whole, which is what a kin cue needs.
       2026-11-01: 21 C is two arrows from the father's song (to the son's song, to the daughter's preference), each on or
       off; the island's songs are gone as a source (JM: "a female's song is often driven by their parents rather than by
       other birds in general"). 21 B is now the cost of brightness with the colour gene dragged along the beak gene's
       chromosome and an inversion between them: the tag-and-help race below has its picture there (linkage and an
       inversion holding a cue to the trait), not in a magic trait.
       2026-11-02: 21 C keeps A's colour and preference genes and adds the song beside them, with no gene and no
       switches: a son sings his father's song, a daughter likes it. Two strengths (colour, song); a weak one of each holds
       what neither holds alone. The song still passes down the father's line whole, so the kin-cue reading stands. The
       preference is now drawn onto colour -> mating (zero at strength 0) in every stage, an arrow onto an arrow 22 can reuse.
       2026-11-07: 21 re-cut as sexual selection itself; its song is parked (above). The finches, the DAG with the preference
       onto colour -> mating, and the over-time chart stay; C's preference riding on sons is 22 A's covariance without kin.
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
    D  genes that compete inside the bird (second ruling; the species level that was here is in lesson23_overhaul.md).
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
   to kin by recognition, not by living close.) (JM, 2026-10-28, for the hierarchical lesson: kin as the gene's view, which
   fits the grid: 22 B's split of cov(w, z) into own cost and benefit from others is the gene's-view split. Not yet ruled
   here.)
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
- **D one level up** (moved to lesson23_overhaul.md with the species level): inherits 20 D's founder's bias at
  speciation: name three terms (between species, within, at the splits), not two.
- **A greenbeard holds only while the tag and the help stay together.** Recombination between them, or a mutation giving the
  tag without the help, breaks it: the same race as 21 B's colour gene against the beak gene (2026-11-01: dragged along one
  chromosome, an inversion between them; draft 3's magic trait, the beak as the cue, was cut). One gene for both (magic)
  cannot be broken by crossing over, only by mutation.

## Idea for 22 or a later 23 (JM, 2026-10-28) — MOVED

JM's three-level 20 D idea (gene, organism, species; diet specialisation; evolving to extinction) is now in
`lesson23_overhaul.md`, verbatim, as a candidate for that lesson's species level.

## Items

| # | What | Status |
|---|------|--------|
| 1 | JM's brief (2026-10-28) and this plan | done |
| 2 | JM rules on Open 1-3 | todo |
| 3 | engine prototype: spatial helping, dispersal; measured r against dispersal; Hamilton's line from runs | todo |
| 4 | JM's second ruling (2026-10-28): species level out to the hierarchical Price lesson; D gene-level competition; A from 21's birds | done (plan) |
| 5 | JM's arc re-cut (2026-11-07): substance unchanged; links to 21 (song parked, kin cue from 8 C), 23 and the capstone; lecture quotes | done 2026-11-07 |

## Rulings

- 2026-10-28: 22 synthesises the Price equation through kin selection and altruism, shown mechanically (diagrams: trait →
  behaviour → others), relatedness and cost deciding the allele's fate; helping at fixation broken by mutation; the rise and fall
  seen in behaviour networks, average relatedness and allele frequencies.
- 2026-10-28 (second ruling): 22 = kin selection and genetic-level competition in general; 21 flows into it; the hierarchical
  Price lesson (cell, organism, species; perhaps gene with kin and transposons) is the target, at 23-25.
- 2026-11-07: 22 = kin selection / genic-level selection; 23 species / hierarchical selection; the capstone (Michod) last.
- 2026-11-07, later: the kin activity must not imply organisms cooperate because they are related; close relatedness creates the
  conditions that let cov(w, z) shift far enough for cooperation (to connect to Michod).

## Do not

- Imply birds help because they are related (JM, 2026-11-07, above): relatedness sets the conditions; the covariance decides.
- State Hamilton's rule, or that relatives share alleles, before the runs show it.
- Fuse the Price terms (WORK_ORDER).
