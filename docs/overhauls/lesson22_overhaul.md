# Lesson 22 — kin selection and gene-level competition: the Price equation, mechanically

**File** · `app/lessons/lesson22.html` — draft 1 (2026-11-07, v1, 10 bits; LOCKS `x`). The archived `app/archive/lesson22.html` is an unrelated old draft on codon ratios
**Checks** · `node scripts/check_lesson22_numbers.js` · `python3 scripts/check_lessons.py` · `node scripts/check_layout.js`
**Status** · DRAFT 1 BUILT 2026-11-07 (the grid). Before that: PLANNED (2026-10-28). Revised the same day (JM's second ruling): the species level moves to the
hierarchical Price lesson (now `lesson23_overhaul.md`); D is now gene-level competition; 22 opens from 21's birds. 2026-11-07
(JM's arc re-cut): 22 = "kin selection / genic level selection", the same substance; 21 is now sexual selection itself (its
learned song parked); 23 is species / hierarchical selection; the cell level goes to the individuality capstone
**Last touched** · 2026-11-07 (grid ruled; prototype started)

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

1. ~~Space: a grid of nests or groups?~~ Answered 2026-11-07: "Yes please go ahead with the grid". Original question: a grid of nests (birds help their neighbours) or groups (birds help their group-mates; relatedness from how groups
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

## JM, 2026-11-07, on draft 1 being built (verbatim)

> Let's also for 22 to make the link to the old coalescence activities explicit—that it need not be relatedness per se but a
> specific allele being shared. If we can tie it together with the idea of proxies (how do organisms recognize relatedness to
> reciprocate) and include the resulting "slosh" from the fact that evolution needs to make things "better" rather than "good"
> (meaning relatedness recognition need not and likely can't evolve to be perfect) that's even better

Readings:
- "the old coalescence activities": lesson 15 A-B (the snake game's pedigree; each locus from one parent; MRCA), 16 B (a
  sequence's ancestry), 20 A (when two copies meet). The link: what helping needs is that the bird helped carries a copy of
  the same helping allele by descent, not that it is "a relative". Shown by giving every copy of the helping allele the label
  of the founding copy it descends from, and measuring neighbours carrying copies of one ancestral allele.
- "proxies": what a bird can actually use to direct help: being next door (A-D's rule; Lec 32: "the circuit can't detect
  kinship—it detects proximity"), a call learned from its father (lesson 8 C; long-tailed tits, Sharp et al. 2005), or a tag
  (a greenbeard, Open 2). Each a proxy for sharing the allele, none exact.
- "slosh": a recognition rule evolves only while a better one leaves more copies; it stops short of perfect (the cue is
  copied wrong; perfecting it costs; the last gains are too small for selection to see at page sizes) and wanders.

Proposed (not yet measured): a new stage E after D's drive, or in B's place (to decide when measured).
    E  who to help: a cue. Every helping allele copy labelled by its founding copy (menu: neighbours carrying copies of one
       ancestral helping allele; map: click a nest, its allele's copies by descent light up). Each young learns its father's
       call, wrong with chance e (a random nearby bird's instead). A recognition gene: "help any neighbour" (proximity) or
       "help a neighbour that calls like me", the latter with a small cost; help costs per neighbour helped. Targets (to
       measure): the cue lets helping spread where proximity alone fails (farther dispersal); helping still spreads with a
       sloppy cue (e .2: better, not good); the recognition allele rises and stops short of fixation, sloshing.

E prototype (2026-11-07, scratchpad l22/engE.js; b 1.5, c .1 per full helping spread over the neighbours helped; 8 runs,
100 generations; a call learned from the father, wrong with chance e = a random bird's within 2 nests):
    helping allele, proximity (help every neighbour) against the call (help only neighbours that call alike):
      d 1 .84 / .91; d 2 .57 / .64; d 3 .37 / .46; d 4 .19 / .38; d 8 .15 / .45. The call directs help where proximity fails.
    but by generation 100 every bird sings the same call (neighbours calling alike 1.00 at every d with the call, against
      .09-.18 with proximity): the helpers' call spreads with the helping, and the cue stops telling kin from non-kin.
      Crozier's paradox (Crozier 1986; Rousset & Roze 2007; to check): a recognition cue that works makes itself common.
      Copying errors (e 0-.5) barely change it.
    a recognition gene (help by call) from .1 with a cost .02 fell to .05-.06.
    Readings for the slosh: (i) the cue erodes as it works, so recognition cannot stay good (needs new calls arising, e.g.
    1 in 50 young invent one, to keep it in balance; unmeasured); (ii) a recognition-precision trait that rises to "better"
    and wanders (unmeasured). Neighbours with copies of one founding helping allele: d 1 .41-.50, d 8 .19-.21 at 100.

## Draft 1 prototype (2026-11-07, after "Yes please go ahead with the grid"; scratchpad l22/eng.js)

    grid       32 x 32 nests on a torus, one diploid bird a nest; a helping gene (2 alleles, additive: helping h 0, 1/2, 1).
               A bird's young: Poisson(2 f), f = 1 - c h + b (sum of its 4 neighbours' h) / 4; each young's father a bird from
               the 8 nests around its mother, by f ("each bird both lays and fathers young", lesson 16's hermaphrodites).
    Taylor     measured first, as the review note asked. Every nest refilled each generation from mothers within d (local
               competition): helping dies at nearly every setting (b/c 20: .07-.21 at any d; d 1 no better than d 2) -- the
               cancellation. Nests left empty when no young arrive: dispersal matters (b 2: d 1 .46, d 16 .11) but helping
               still falls from .5. Built on: young, in a random order, each take a random nest within d of the mother, or
               if taken the nearest empty one in rings around it (to radius 4); the rest die. Competition for nests is then
               island-wide while young still settle near home; helping spreads when benefit x relatedness beats the cost.
    A numbers  c .1, 100 generations, start .5, 8 runs x 2 seed sets, helping allele at 100 (relatedness to the 4
               neighbours at the helping gene, generations 1-20):
                 d 1: b .25 .03-.04, .5 .13-.16, 1 .63-.64, 1.5 .84-.85, 2 .91-.94, 3 .95-.97   (r .09-.10)
                 d 2: .02, .05-.06, .28-.32, .51-.54, .68-.75, .86                           (r .05)
                 d 3: .01-.02, .03-.05, .12-.18, .28-.34, .46-.55, .69-.76                   (r .03)
                 d 4: .01, .02-.04, .09-.10, .19-.24, .39-.41, .56-.65                       (r .02)
                 d 8: .01-.02, .02-.03, .06-.10, .13-.16, .22-.29, .51                       (r .00)
    C numbers  helping fixed at the start, each helping allele broken with chance mu a generation (none restored), 100
               generations: mu .01: d 1 b .5 .15-.16, 1 .40-.41, 2 .63-.66; d 2 .08-.10, .22-.24, .46-.50; d 4 .05,
               .12-.14, .29-.34; d 8 .05-.06, .09-.13, .24-.27. mu .005: d 1 b 2 .79, d 8 b 2 .52.
    split      the change in the helping allele each generation, exactly: cov(w, z) / w-bar + E(w dz) / w-bar (Price), and
               cov(w, z) = b_own var(z) + b_nbr cov(z, z_nbr), the partial regression of young on a bird's own helping and
               its neighbours' (least squares, so no leftover: Queller 1992). Relatedness r = cov(z, z_nbr) / var(z): the
               change is var(z) (b_own + r b_nbr) / w-bar. Relatedness is the condition; the covariance decides (JM).

    kinship    neighbours that share a parent (b 0, c 0; 30 generations): d 1 .15, 2 .08, 3 .05, 4 .04, 8 .01.
    cost       d 1, b 1: c .1 .59-.62, .2 .03, .3 .00.
    D numbers  a driving gene (no helping): a carrier's young x (1 - k x its driving alleles / 2); in a carrier with one, the
               driver goes into a share q of its eggs and sperm. Driver from .05, 100 generations, driver (nests filled):
               q .6: k .2 1.00, .4+ 0; q .7: k .4 1.00, .5 .76-.78, .6 0; q .9: k .4 1.00 (1.00), .5 1.00 (.68), .6 extinct.
               Its change: who leaves more young negative, what the young keep positive (q .7 k .2: -.39 / +1.35 summed).
               A suppressor gene (fair meiosis restored) barely moves once the driver is fixed (.05 -> .11 in 200): not used.

Draft 1 rounds (10 bits), cost of helping .1 unless held otherwise:

    A  the grid; benefit, cost, how far young settle.
       A1 d 1 held, benefit free (opens .5, .13-.16): helping >= .5 (b 1 .63-.64).
       A2 b 2 held, dispersal free (opens 2, .68-.75): helping <= .63 (d 3 .46-.55, 4 .39-.41; bar from .6, see seeds).
       A3 b 1 held, dispersal free (opens 2, .28-.32): helping >= .5 (d 1 .63-.64).
    B  relatedness as the condition (JM, 2026-11-07): kinship measured, the split read.
       B1 dispersal free (opens 2, .08): neighbours that share a parent >= .12 (d 1 .15).
       B2 benefit and dispersal free (open b 2, d 2, .68-.75): helping ends .40-.65, its two parts cancelling (b 1.5 d 2
          .51-.54; d 3 b 2 .46-.55; d 4 b 3 .56-.65; d 8 b 3 .51): the line, more benefit the farther young settle.
       B3 d 1, b 1 held, cost free (opens .1, .59-.62): helping <= .2 (c .2 .03).
    C  helping fixed at the start; each helping allele broken with chance .01 a generation.
       C1 (150 generations) b 2 held, dispersal free (opens 3): helping >= .31 (see seeds).
       C2 (150 generations) d 1 held, benefit free (opens 1.5): helping <= .41 (see seeds).
    D  a gene that cheats in meiosis (no helping): driver from 5%.
       D1 cost .2 held, drive free (steps .5 .6 .7 .9; opens .5): driver >= .5 (q .6 1.00).
       D2 drive .9 held, cost free (steps 0 .2 .4 .5 .6; opens .4, nests filled 1.00): nests filled <= .8 (k .5 .68, .6 0).

## Draft 1 as built (2026-11-07)

    page       one template for A-D: the island (32 x 32 nests, run 1, shade = the bird's helping or driving alleles, blank =
               empty), over time (menu: helping allele, neighbours that share a parent, relatedness at the helping gene,
               nests filled; D: driving allele, nests filled, young a bird leaves), the change taken apart (since generation 0:
               from its own helping, from its neighbours' helping, what the young keep; D: who leaves more young, what the young
               keep), the diagram (paths.js), the Target card, R last and closed. Shared helpers and the stage machinery are
               lesson 21's, copied verbatim.
    diagram    helping gene -> helping -> its young (cost, red); neighbours' helping genes -> neighbours' helping -> its young
               (benefit, blue); helping gene -> neighbours' helping genes, "how close young settle" (thicker the closer). The
               last is the condition (JM, 2026-11-07): it sets who the neighbours are, not what helping does. Reading it as an
               arrow from a bird's gene to its neighbours' genes is an interpretive arrow (JM 2026-10-01 allows them where the
               engine does what is drawn); flag for JM. C adds "1 in 100 broken" -> its young. D: driving gene -> its share of
               eggs and sperm (drive) -> its young; driving gene -> its young (cost); its young -> nests filled.
    checks     `check_lesson22_numbers.js`: 24 checks + both widths + 4 R panels. Engine: young = 2 f (a lone helper at cost .5
               1.02, a non-helper 2.04, a helper among four at b 1 c .2 3.60); Mendel and drive (.50, .90); kinship falls with
               distance (.149, .084, .035, .009); the split exact (1e-17), own + neighbours' = cov(w, z) / w-bar.
    seeds      the page's engine over 20 seed sets of 16 runs (scratchpad l22/pageSpread.js): A1 b 1 .60-.67 (bar .5); A2 d 3
               .47-.58, opening d 2 .68-.76 (bar moved .6 -> .63); A3 opening .24-.33; B1 d 1 .145-.155, opening .081-.086 (.12);
               B2 b 1.5 d 2 .51-.60, d 3 b 2 .47-.58, opening .68-.76 (window .40-.65); C at 100 generations overlapped (d 2
               .42-.53 against d 3 .34-.42), so C runs 150: over 12 sets C1 d 2 .36-.42, opening d 3 .19-.26 (bar .31), d 1
               .60-.63; C2 b 1 .25-.33, opening b 1.5 .49-.54 (bar .41).
    coalescence (JM, 2026-11-07, above) every copy of the helping allele carries the label of the founding copy it
               descends from; menu: neighbours with copies of one founding helping allele (A-C). The labels draw no random
               numbers, so the measurements stand.
               At the check's seed (before the bar moves): A1 b 1 .69; A2 d 3 .57; A3 d 1 .65; B1 .15; B2 b 1.5 d 2 .50, d 3 b 2 .52, b 3 d 8 .57
               (opening .73); B3 c .2 .03; C1 d 2 .50 (opening d 3 .38); C2 b 1 .41 (opening .54); D1 q .6 .99; D2 k .5 .70.
               B2 at the line: from its own helping -.54, from its neighbours' +.59 (summed over 100 generations).

## Items

| # | What | Status |
|---|------|--------|
| 1 | JM's brief (2026-10-28) and this plan | done |
| 2 | JM rules on Open 1-3 | 1 done 2026-11-07 (the grid); 2-3 todo |
| 3 | engine prototype: spatial helping, dispersal; measured r against dispersal; Hamilton's line from runs | done 2026-11-07 |
| 6 | draft 1: A-D page, v1, 10 bits; check script | done 2026-11-07 (bars over 20 seed sets: see below) |
| 7 | JM plays with draft 1; Open 2-3; the interpretive dispersal arrow; his voice for A-D | todo |
| 8 | JM 2026-11-07: coalescence link (allele shared by descent), proxies, the slosh: measure E; build | todo |
| 4 | JM's second ruling (2026-10-28): species level out to the hierarchical Price lesson; D gene-level competition; A from 21's birds | done (plan) |
| 5 | JM's arc re-cut (2026-11-07): substance unchanged; links to 21 (song parked, kin cue from 8 C), 23 and the capstone; lecture quotes | done 2026-11-07 |

## Rulings

- 2026-10-28: 22 synthesises the Price equation through kin selection and altruism, shown mechanically (diagrams: trait →
  behaviour → others), relatedness and cost deciding the allele's fate; helping at fixation broken by mutation; the rise and fall
  seen in behaviour networks, average relatedness and allele frequencies.
- 2026-10-28 (second ruling): 22 = kin selection and genetic-level competition in general; 21 flows into it; the hierarchical
  Price lesson (cell, organism, species; perhaps gene with kin and transposons) is the target, at 23-25.
- 2026-11-07: 22 = kin selection / genic-level selection; 23 species / hierarchical selection; the capstone (Michod) last.
- 2026-11-07, later: make the link to coalescence explicit (a specific allele shared, not relatedness per se); proxies for
  recognising kin; the slosh: recognition evolves to better, not perfect.
- 2026-11-07, later: the grid (JM: "Yes please go ahead with the grid"), for A-C at least.
- 2026-11-07, later: the kin activity must not imply organisms cooperate because they are related; close relatedness creates the
  conditions that let cov(w, z) shift far enough for cooperation (to connect to Michod).

## Do not

- Imply birds help because they are related (JM, 2026-11-07, above): relatedness sets the conditions; the covariance decides.
- State Hamilton's rule, or that relatives share alleles, before the runs show it.
- Fuse the Price terms (WORK_ORDER).
