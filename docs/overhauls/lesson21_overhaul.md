# Lesson 21 — speciation by sexual selection: three genes (beak, colour, preference), seeds and preference strength, the beak as the cue, a learned song; first draft: species selection (parked for the hierarchical Price lesson)

**File** · `app/lessons/lesson21.html` — draft 3 (2026-10-29), JM's three-gene DAG, v3, 10 bits. Draft 2 is the file at
b46e463. The first draft (species selection) is `app/archive/lesson21_species_2026-10-20.html`
**Checks** · `node scripts/check_lesson21_numbers.js` · `python3 scripts/check_lessons.py` · `node scripts/check_layout.js`
**Status** · DRAFT 3 BUILT 2026-10-29 on JM's review of draft 2 (see "Draft 3"). Intros are draft bullets for JM's dictation.
LOCKS `x`
**Last touched** · 2026-10-29

## JM, 2026-10-28, second ruling (verbatim)

> We need to build to a hierarchical Price equation lesson that does cellular level, organismal level, and species level (maybe
> also genetic level with Kin and transposons included). That's the target lesson. 21 should focus on speciation, but in
> particular sexual selection. I want to illustrate the process of speciating with sexual selection where different behavioral
> strategies are optimal for different individuals. I'd also like to bring in both "magic traits" and also non-genetic
> inheritance (eg bird song).
>
> This lesson should build such that it flows easily into 22, on kin selection and genetic-level competition in general.
>
> Depending on if we end up splitting either of those two, the big hierarchical Price lesson would end up as one of 23-25

The arc: 21 sexual selection and speciation → 22 kin selection and gene-level competition (`lesson22_overhaul.md`) → the
hierarchical Price lesson, 23, 24 or 25 as 21 and 22 split or not (`hierarchical_price_plan.md`). 21 and 22 build toward it.

## What 8-20 already did (read 2026-10-28)

    8 C    song learned from the father that raised the chick, not the one it came from (eggs swapped). JM's intro: "Males will
           often sing a song that sounds like their father's, and females will often prefer a song that sounds like the song
           her father sang."
    13     a code comment quotes JM (2026-09-29) on births and deaths as two arrows: "This opens up tradeoff models and
           eventually sexual selection, too"; the comment adds that sexual selection enters as a mediator, trait -> mating
           success -> birth rate
    14 D   side-blotched lizards: three male strategies, each beating one and losing to another (frequency dependence)
    19 D   mate choice on a throat colour: the ponds stay apart when the throat alleles arose with the food, fuse (a food type
           lost) when not; a preference gene ◆ dragged on the chromosome; an inversion over the three genes
    20 B   hybrids at the first flood, ending at contact. Its one-allele choosy allele came out 2026-10-28 for 21, with a
           finding: at 40 fish a pond, migration .1, cost 1, no run kept two kinds apart (the allele died out, or one kind
           replaced the other in both ponds)

New in 21: which partner (or which mating rule) pays depends on the bird; a cue that is the ecological trait itself (magic);
a cue and a preference that are learned, not inherited.

## Plan (proposed 2026-10-28, not built; a sketch, each stage measured before it is built)

    Setting (JM, 2026-10-28: birds, two islands): two finch-like islands, one mostly small seeds, one mostly large (14 B's
    finches; 19 B's food pool, snails and plankton turned into seeds), birds crossing between them (19's floods, 20 B's
    contact). Birds for the song (8 C's birds; 20's birds). On file: data/clean/finch_individuals (beak depth, 2,215
    banded birds).
    A  who to mate with. Beak depth under divergent selection. Each bird mates by a rule: take anyone, prefer a partner like
       yourself, or hold out for one cue. The best rule differs by bird (JM's reading, 2026-10-28): a deep-beaked bird's best
       partner is deep-beaked; a bird of the rare kind on its island (a newcomer) pays more to be choosy (fewer partners to
       choose from). A who-mated-whom network across the two islands (the picture 22 reuses for who-helps-whom) and each
       island's beak distribution, two kinds held apart or merged. Targets on outcomes: two kinds hold; choosiness spreads in
       one kind and not the other.
    B  magic traits. The same split with the cue as the beak itself (one gene does both; recombination has nothing to break)
       against a separate plumage gene on the chromosome (19 D: crossing over scrambles cue from beak; an inversion holds
       them). One set of controls, one measure, recombination the only difference. The parked "reinforcement three ways"
       folds in here: one-allele matching, two-allele preference, magic.
    C  learned song. No song gene: sons copy their father's song with error, daughters prefer the song their father sang
       (8 C). The beak limits the song (a deep beak cannot trill fast: Podos 2001, Nature), so a learned cue is tied to the
       ecological trait, a magic trait by way of learning. Toggle: learn from the father, or from the neighbours. Targets:
       two song kinds and two beak kinds held apart with no song gene; the same split erased when birds learn from neighbours.
    D  one immigrant. Daphne Major's "Big Bird" lineage: an immigrant male whose descendants sang his song and, after a drought,
       bred only among themselves (Lamichhaney et al. 2018, Science; Grant & Grant 2009, PNAS; check both before citing on the
       page). The student sets what keeps a new line apart for N generations. Realish data in a closed box (no song or
       lineage record on file).

## Flow into 22

(2026-10-29, draft 3: the who-mated-whom network is gone. What carries over is the over-time chart, the fitness surfaces,
the three-gene DAG, the beak-as-cue arrow (B) and C's learned song: a son sings his father's song, and her preference comes
from her genes, her father's song or the island's songs. The list below is the 10-28 plan.)

- A's who-mated-whom network becomes 22's who-helps-whom.
- A's "prefer a partner like yourself" becomes 22's greenbeard: one gene for a tag, its recognition, and the help.
- B's race between a cue and the trait it marks (magic or separate, recombination between them) is the greenbeard's weakness
  in 22: a tag without the help (a falsebeard) spreads when the two come apart.
- C's learned song becomes a kin cue: long-tailed tits learn their calls from the birds that raise them and help birds that
  call like them (Sharp et al. 2005, Nature). Learned from parents, the cue tracks kin; learned from neighbours, it does not.
- C's song changes between father and son: a transmission term, E(wΔz), in a trait with no gene. The hierarchical Price
  lesson uses it.

## Measure first

- Sexual selection on its own can weaken divergence once populations exchange migrants rather than strengthen it
  (Servedio & Bürger 2014, PNAS; check before citing). 19 D found the same (fusion when the cue is not matched to the food).
  Build so both outcomes happen; do not tune the engine until sexual selection alone splits a population. (JM, 2026-10-28:
  "That's fine.")
- Choosiness: 20 B's finding (above). Find settings where two kinds hold before scoring anything on it.
- Learned song can speed divergence (Lachlan & Servedio 2004, Evolution); learning from neighbours should erase it. Measure
  both at page sizes.

## Open for JM

1. ~~"different behavioral strategies are optimal for different individuals": which reading?~~ Answered 2026-10-28: the best
   mating rule depends on the bird (its own beak; how common its kind is). Not alternative male tactics, not learning
   strategies.
2. ~~Birds or 19's sticklebacks?~~ Answered 2026-10-28: birds.
3. ~~One island or two with migration?~~ Answered 2026-10-28: two islands.
4. The parked speciation mechanics (below): leave parked, or bring one piece back (the inversion's rise fits B)?

## Draft 2 as built (2026-10-29)

JM, 2026-10-29: "Let's please make a draft of lesson 21 and its parts, and I can play with it and we can assess"

    engine     bw*: two islands of 100 finches, female or male. Two chromosomes of 40 loci, kept as the loci that matter: beak
               gene at 20 (small / large), plumage gene where B puts it, choosy gene at 30 (A), ten marker loci (island of
               origin). Song and preferred song carried, not in the genes. Start apart: island 0 small seeds, small beaks, pale,
               fast trills; island 1 the opposite. A generation: Binomial(N, m) birds swap islands; each female meets up to 4
               males, a choosy one turns a male down with chance c x how much they differ (beak or plumage by alleles 0 / .5 / 1;
               song 0 / 1); turned down 4 times, she does not breed; young from mated pairs, a gamete switching at each gap with
               chance R / 39; the young hear the father's song or a random island male's (1 in 50 misheard); a son sings it, or
               with chance lim the song his beak suits; survival 1 - S((1 - q) b + q(1 - b)) - v 4b(1 - b), S .4.
    A          choosy gene (1 in 10 at the start), cue the beak. Who mated whom (females top, males bottom, sorted by beak, mate
               lines dashed red when beaks differ, ✗ unmated, ▾ newcomer); DAG (choosiness onto beak -> mating, paths.js);
               young per female (born here / newcomers x choosy / take any, last 20 gens, 16 runs); survival by beak, ◐ dragged
               for the valley; migration slider. 200 gens.
               A1 newcomers' choosy bar .15+ under their take-any bar, c free (opens 0), m .1 v .2 held.
               A2 choosy allele .3+ over both islands at 200, valley free (opens 0), m .1 c 1 held.
    B          every female choosy (.9), m .1, v 0. Chromosome strip, ◆ plumage dragged; cue toggle (beak / plumage); crossovers.
               200 gens. Bar F_ST at the beak gene .5+.
               B1 ◆ free (opens locus 40), R 1, plumage cue. B2 ◆ beside the beak gene, R free (opens 4). B3 ◆ at 40, R 4 held, cue
               free (opens plumage). B1's card has one sentence (the drag has no cue: REVISIONS row 22).
    C          every female choosy by song (.9 held; free once done), m .1, v 0. DAG: song heard -> his song / her preference; beak
               -> his song (lim, the arrow); choosiness onto his song -> mating. Learning toggle (father / island's males). 200
               gens. Bar F_ST at the beak gene .45+.
               C1 learned from fathers, lim free (opens 0). C2 lim 1, learning free (opens the island's males).
    D          three drawn rounds on F_ST at the beak gene, 100 gens, a dot every 10: random mating; plumage beside the beak gene
               (R 1, c .9); song from the island's males, lim 1, c .9. Cloud = the 16 runs' middle 90% at each dot, .02 slack;
               bit = half the dots inside on the first run; counts in the notes (D_in1-3). No practice switch (a drawing is one
               shot a round); Clear drawing.
    scoring    v2, scaffold 10: A1 A2 B1 B2 B3 C1 C2 D1 D2 D3, first scored try each.

## Measured (draft 2; scratchpad eng21.js = the page's engine, then the page in the check)

    random mating, m .1, v 0: F_ST at the beak gene .22-.28, falls from 1 to ~.33 in 5 gens. m .05 .46-.54; m .2 .09-.11; v .2 m .2:
      one beak takes both islands (F_ST 0).
    A1 (m .1 v .2, last 20 gens): newcomers choosy minus take-any: c 0 -.00 to +.09, .5 -.09 to .00, .75 -.13 to -.06, 1 -.46 to
      -.27. Born here: c 1 +.03 to +.05 (small: the benefit is diluted by how rarely a resident meets a newcomer); below .75 ~0.
      Page: c 1 -.36 / -.39, c 0 +.04 / +.06, c .5 -.06 / -.07.
    A2 (m .1 c 1): choosy allele at 200: v 0 .00-.16, .1 .13-.25, .2 .22-.35, .3 .42-.58, .4 .41-.62 (m .05 .02-.35 whatever v).
    B (c .9, m .1, v 0, 200): plumage at 18-21 .55-.62; 22 .44-.53; 23 .36-.46; 26 .26-.31; 40 .21-.27. Beside the beak gene: R .5
      .58-.62, 1 .57-.62, 2 .49-.54, 4 .37-.48 (.56 at 100: the cue still fading, hence 200 gens). Beak as cue .64-.67, R 4 too.
      c 1 with no hybrids: plumage anywhere = beak (nothing to recombine); the cue needs c < 1 to matter.
    C (c .9, m .1, v 0, 200): fathers, lim 0 .23-.29, .25 .38-.51, .5 .52-.55, .75 .57-.66, 1 .60-.64. Island's males: lim 0
      .22-.25, .5 .23-.27, 1 .26-.34. Fathers, lim 1: c 0 .23-.25, .5 .28-.34, .75 .43-.47. A song with no tie to the beak
      holds nothing apart: the songs become cultural groups that cross the islands.
    D (100 gens): averages at 10-100 .20-.27 (random), .56-.69 (plumage beside), .28-.44 (song from neighbours, lim 1); band about
      ±.1. No flat line among .25, .3, .45, .6 scores on all three.
    Dead end, the planned D (one immigrant, Daphne Major's "Big Bird"): one large-beaked male with a slow trill, paired with a
      resident on island 0, no more migration; his line (birds with a quarter or more of his genes) alive at 40 gens in 0 of
      16 runs at every setting tried (learning father / island, c 0-1, looks 4-50, seeds 0-.5 large, with and without
      seeds shared so a rare beak eats more). A flock of 10-20 the same: its beak alleles leak in through hybrids while its
      song dies (song 1 ~.01 with fathers' learning, c .9). Best flock case, beak shaping the song (lim 1), fathers,
      c .9, 12 looks, half large seeds, seeds shared: two kinds side by side (F = 1 - Ho/He at the beak gene > .5, large
      beaks 10%+) in 7 of 16, F .32-.35. A family of two or three young is a branching process with nothing to grow on.

## Open for JM (draft 2)

1. D: three drawn rounds stand in for the one immigrant. Keep them; or build the immigrant with what he needs (a line that
   grows: several breeding seasons per bird, kin that settle together, or seeds no one else eats), which is a new engine
   piece; or drop D.
2. A1's numbers: newcomers' cost of choosiness is large (−.3 to −.45), the resident's gain small (+.03 to +.05) and not
   judged. A2 (the allele spreads) is where the gain shows. Fine, or make the resident's gain bigger (more migration
   fuses the islands; a deeper valley helps a little)?
3. Choosiness costs only a female who turns down 4 males; a male turned down simply mates less. Keep the 4 looks?
4. Each target needs choosiness near 1 to show (A1 c 1; .75 misses). The slider steps 0 .25 .5 .75 1 leave one step that
   works. Steps 0 .5 .75 .9 1 instead?
5. Citations on the page to check: Podos 2001 (beak size and trill rate) in C's diagram tip. Not on the page: Grant & Grant
   2009, Lamichhaney et al. 2018 (Big Bird), Servedio & Bürger 2014, Lachlan & Servedio 2004, Sharp et al. 2005.
6. Real data: none yet. data/clean/finch_individuals (beak depth, 2,215 birds) could carry a closed box of real beak
   distributions in A.

## JM on draft 2, 2026-10-29 (verbatim)

> I think we should adjust lesson 21. A simplified but realistic DAG genes -> beak -> seeds -> reproduction <- mating <-
> color / preference <- genes. So we have a three gene system: one controlling beak size, one controlling bird color, one
> controling bird preference. The "who mated whom" panel can be cut--we can show the drop-down chart as the animation core.
> We can also drop the young-per-female. A hard/soft seeds by island setting to create a fitness surface, and a
> preference-strength setting to also create a fitness surface would be good.

Readings (2026-10-29):
- The DAG and the three genes run through every stage: the engine is replaced, and the two panels are cut from every stage.
- "Fitness surface" is lesson 19's word. Seeds give survival by beak, one line an island. Preference strength gives the chance
  she takes him, by his colour (across) and her preference (up).
- Hard/soft seeds by island: one setting an island, the share of hard seeds (lesson 19 D's one-gene food share), set by
  clicking seeds in the Target card (lesson 19 B's columns).
- Not in the message: magic traits and the learned song, both from his ruling of 10-28. Kept, each as one change to the same
  DAG:
  - B: one arrow added, beak → mating (she judges his beak against hers).
  - C: where her preference comes from (her genes / her father's colour / the island's males' colours). This is sexual
    imprinting, not song; Grant & Grant 1997 is to check. Replaced the same day by the song, at JM's word (below).
  - Either can be cut.

## Draft 3 (2026-10-29)

    engine     two islands of 100 finches; 1 in 10 swap each generation. Three genes, two alleles each, additive, on separate
               chromosomes: beak (small / large), colour (pale / dark), preference (likes pale / likes dark). Start apart:
               island 1 small, pale, likes pale; island 2 large, dark, likes dark.
               Seeds: an island's hard share q (0, ¼, ½, ¾, 1). Food = (1 - q) soft-eff + q hard-eff, with soft-eff 1, .35, 0
               and hard-eff 0, .35, 1 for ○ ◐ ●. Survival = 1 - .6 (1 - food / best food on the island). A mixed island
               has a valley at ◐.
               Mating: a female meets up to 4 males and takes one with chance exp(-β d²), β the preference strength (0 1 2 3
               4 6), d = |his colour - her preference| (0, ½, 1). Turned down 4 times, she does not breed.
               B: d = (1 - w)|colour - preference| + w|his beak - her beak|, w the beak's say.
               C: preference = her genes, her father's colour, or a random island male's colour (1 in 50 misremembered).
               Young from mated pairs until 100 live. 100 generations, 16 runs.
    panels     every stage: the over-time chart with its menu (the animation core, top left); fitness surfaces (survival by
               beak, a line an island, dots = run 1's birds; mating grid, his colour × her preference, shade = chance she
               takes him, dots = run 1's pairs this generation; B adds his beak × her beak); the DAG (paths.js, preference
               strength on preference → mating); Target card with the seeds; To finish; R last and closed.
    A          A1 seeds free (open both soft), β 0 held: beak F_ST ≥ .25. A2 seeds apart held, β free (opens 3): colour F_ST
               ≥ .5. A3 β 6 held, seeds free (open apart): colour F_ST ≤ .1 (one kind takes both islands).
    B          seeds apart. B1 β 2 held, the beak's say w free (opens 0): beak F_ST ≥ .72. B2 w 1 held, β free (opens
               1): the same.
    C          seeds apart. C1 β 3 held, source free (opens her genes): colour F_ST ≥ .5. C2 β 4 held, source free (opens
               the island's males): the same.
    D          three drawn rounds, F_ST at the beak gene, 100 gens, a dot every 10: seeds apart β 2; seeds apart β 2 with the
               beak as the cue (w 1); both islands soft, β 6.
    scoring    v3, scaffold 10: A1 A2 A3 B1 B2 C1 C2 D1 D2 D3.

Measured (scratchpad eng3.js, the page's engine; 16 runs at 100 gens, five seed sets, mean F_ST):

    random mating, F_ST at the beak gene by seeds: (0,1) .50, (0,¾) .39-.43, (¼,¾) .31-.35; seeds favouring the same beak
      ((0,0), (0,¼), (0,½), (½,1), (½,½)) 0: the same beak takes both islands.
    seeds apart, colour F_ST by β: 0-2 .00-.03; 3 .16-.43 (all gone by 200); 4 .79-.90; 5+ .90. Linear acceptance (1 - s d) was
      tried first: nothing held below s .98, because birds between the colours were taken by everyone. Gaussian acceptance
      makes the mating surface's own valley (a grey male is turned down by both pale- and dark-likers).
    β 6, colour F_ST by seeds: apart (0,1) .89-.94, (0,¾) .85-.92, (¼,¾) .80-.88; the same beak favoured 0, in under 10
      generations when one kind's beak loses on both islands; mixed (½,½) one kind wins both islands by chance (by ~70).
    B, β 2, beak F_ST by w: 0 .47-.53, .5 .59-.66, .75 .66-.73, 1 .76-.77 (colour mixes: its gene no longer matters).
      w 1 by β: 0 .50, 1 .58-.67, 2 .76-.77, 3 .86-.89.
    C, colour F_ST: β 3 genes .16-.43, father .58-.77, island's males 0; β 4 genes .79-.90, father .85-.91, island's males 0.
      Learned from the island, a newcomer's daughters like the local colour: her colour genes join the island in one
      generation.
    linkage (tried, not on the page): β 3, colour gene beside the beak gene (r 0) .76 vs unlinked .27; all three genes
      together (r 0) β 2 .77. The beak-as-cue arrow does what r 0 does with one arrow.

JM on draft 3, 2026-10-29 (verbatim): "Introducing song as a sort of magic trait--where having a bad song directly effects
fitness & discriminates between groups--is a fine thing to build for since the parts are all bird centered. It's just a shift
from a genes -> color panel to a parent song -> offspring song panel in a DAG."

C rebuilt the same day (read: a bad song = a song the beak does not suit, sung badly, so taken less; the song discriminates as
the cue she judges):
    C          no colour gene: father's song -> song (sons learn it, 1 in 50 misheard); she judges his song (fast / slow trill)
               against her preference; she takes him with exp(-β d²) times how well he sings, 1 - lim |beak - song| (beak ->
               song, the new arrow, "how much the beak limits the song"; Podos 2001, to check). Preference source toggle kept:
               her genes / her father's song / the island's songs. Surfaces: his song × she likes; his song × his beak (how
               well he sings it). Seeds apart, β 2 held.
               C1 her genes held, lim free (opens 0): beak F_ST ≥ .68. C2 lim 0 held, source free (opens the island's songs):
               the same.
    measured   (eng4.js, four sets; page in brackets) genes: lim 0 .52-.58 [.54], .25 [.64], .5 .67-.72, 1 .75-.79 [.79].
               lim 0: father's song .73-.75 [.73], island's songs .49-.53 [.53] (songs mix, .01-.03). No preference (β 0), lim
               1: .56-.62 (the song tracks the beak, .55-.69, but nothing chooses by it). A song passed father to son never
               recombines: the song-beak link decays only through the mothers' beak genes.
    D          unchanged (no song set-up). The 10-28 learned-colour C is gone; its numbers stay above.

Open for JM (draft 3):
1. ~~B and C carry his 10-28 asks on the new DAG. Keep, change, or cut?~~ Answered 2026-10-29: song as a sort of magic trait,
   built as C. B (beak as the cue) kept. Should one D round be a song set-up?
2. Preference strength steps 0 1 2 3 4 6: the colours hold at 4 and fall at 2; 3 is the edge (slow loss). The mating
   grid shows what each step means.
3. A3 is a target to make the islands the same: strong preferences, but seeds that favour one beak on both islands.
   Fine as a target?
4. Draft 2's Open 1 (the one immigrant), 3 (4 looks), 5 (citations: now Grant & Grant 1997 too) and 6 (real data) still
   stand; 2 and 4 went with the panels and sliders they were about.

## Parked 2026-10-28: speciation mechanics (the plan of earlier that day; superseded by the second ruling, kept as a source)

> **2026-10-28, from lesson 20's review (JM agreed):** 20 B no longer has the choosy allele or the tag. 21 B inherits both. The
> engine pieces are in `git log` for `app/lessons/lesson20.html` before this change (`bwChoosy`, `B_START` = one chromosome in ten,
> `bwFstTag`, the ◆ and tag loci 21 and 11, the "how choosy" arrow onto the partner-mix arrow, `B_TRIES` = 4 looks). Finding that
> came with it: with how choosy 1, the choosy allele died out in half the runs and fixed in both ponds in the other half, one kind
> replacing the other (hybrids .93-.98 only because one kind was left); no run kept two kinds side by side. Find settings that keep
> two kinds apart before scoring reinforcement.

JM, 2026-10-28 (verbatim): "Let's plot out lesson 21 & 22 a bit and see if we want to adjust 20 to foreshadow it at all. I'm
thinking of 21 being hard into the mechanics of speciation per se. Bringing back a lot of the stuff of 19 to illustrate allopatric
speciation, the snowballing of incompatibilities, and reinforcement (including inversions and magic traits and recombination as a
race with differentiation)."

The first draft below (species selection: a trait good for the fish, bad for splitting; Price one level up) moves to 22 D, where
the Price equation is the subject (see lesson22_overhaul.md). 21 becomes four stages on 19's ponds and fish, each a step 19
took in passing, now the whole stage. A first list of the four (snowball; reinforcement; the race; inversions and magic traits)
was revised the same day against what 14-20 already did; only the revised list, below, stands.

### What 14-20 already did (read 2026-10-28, at JM's request: "inspect lessons 15-18 as well to see what we've used before")

    14 B   linkage: meiosis passes on a haploid set, recombination scrambles it (Grants' finches)
    16 B   a sequence's ancestry: each SNP one parent, a chunk many; recombination makes the blocks
    16 C   copy or mate: recombination breaks up a good genome; the Price split per generation (cmPrice)
    16 D   an inversion: copies itself when rare (no recombination in heterozygotes), recombines when common; its frequency
    17 A-B migrant fragments, shorter each generation, crossovers and generations setting their size; pulsed floods (B)
    17 C   selection at one gene keeps the populations apart there, lets the rest flow, or is swamped (mouse coat colour)
    19 B   F_ST high at and around a selected gene, how wide set by crossing over; floods erase it; two genes side by side
    19 C   new alleles from the two ponds incompatible by chance; hybrid survival falls (the snowball, run on, never counted)
    19 D   reinforcement, two-allele: throat gene + preference gene + Bmp6, dragged on the chromosome; an inversion over all three
    20 B   hybrid fitness landscape and loci grid; the snowball again (B1-B2). (The one-allele choosy preference was here until 2026-10-28; it moved to 21 B)

So every piece JM named has been on a page once; 21's job is to put them together as one process and make the part each
skipped the whole stage. Revised against that:

    A  the snowball, counted: the one new thing is the shape (incompatible pairs against time apart bend up; new alleles that
       differ do not). A drawn round on that curve; short, and only if 20 B stops before it (Open 1). Measure first: with 40
       loci a newer allele replaces an older one at the same locus, so "loci that differ" saturates and the bend may be short.
    B  the race: 17 C's fragments and 19 B's F_ST peaks around a gene under divergent selection, now with floods every
       generation: how wide the island of differentiation grows depends on selection against crossing over; genes near the
       first one hitch a ride (divergence hitchhiking). New: the island grows or shrinks over time, and a second gene
       dropped inside it holds better than one outside (16 B's blocks, 17 C's fragments, 19 B's peaks at once).
    C  reinforcement, the three ways in one stage: one-allele (20 B), two-allele (19 D), magic trait (the food gene is the
       cue). New: all three on one set of controls, scored on the same measure, so the difference is recombination's alone.
       **Not F_ST between ponds** (lesson 20 review, 2026-10-28): with choosy fish, 20 B's ponds lost their F_ST because one
       kind replaced the other in both ponds in about half the runs, and two kinds sharing a pond would read the same way. Use
       20 B's tag (a never-mutating allele marking where a chromosome started) and score on F_ST between the tags, with the
       hybrids' share as a second line. And first find settings where reinforcement keeps two kinds apart at all: at 20 B's
       (40 fish a pond, migration .1, cost 1) no run did (lesson20_overhaul.md, Handoff 3 and Open, pass 3 review).
    D  inversions win the race: 16 D's inversion (rare copies itself) placed over 19 D's three genes, now arising by mutation
       in one pond and spreading because it holds the good combination together. New: the inversion's own rise, not a toggle.
       Measure first: the rise needs gene flow against local selection (Kirkpatrick & Barton 2006), unmeasured at 40 fish a pond.
       Real data, closed box (carried from the first list): Heliconius colour pattern (a magic trait), stickleback body size;
       Coyne & Orr's Drosophila only if a dataset can be sourced (none in data/clean).

Build notes: 19's engine (`pdWorld`, `pdStep`, floods, kinds, preference, inversion) is the base; 20 B's one-allele choosy rule
and its fitness landscape / loci grid carry over. Extract-at-the-third-caller (WORK_ORDER): 19, 20 B and 21 make three callers of
the two-pond engine; extracting it to app/assets/ is worth doing at 21's build, with 19's checks run before and after.

Open for JM (parked with the plan):
1. 20 B already does the snowball and a one-allele choosy allele. Move B's reinforcement to 21 B (20 B keeps the snowball and
   the hybrid fitness landscape, ending at the moment of contact, and 21 A opens from that number), or leave 20 B whole and
   start 21 at the two-allele version? (Answered 2026-10-28: moved; 20 B ends at contact.)
2. A real-data panel for the snowball (Coyne & Orr's Drosophila, hybrid inviability against genetic distance) needs a dataset
   sourced and cleaned; worth it?

## Parked: the first draft (v1, 2026-10-20), species selection — material for the hierarchical Price lesson's species level

### What the first draft is

- A clade of species grows on 20's tree. A dispersal allele helps the fish that carry it, so it rises inside every species; but a species full of dispersers keeps its populations in touch (19's floods), splits less, and lasts longer or shorter. Across the clade the allele can fall while it rises in every species. The change splits into Price's two terms one level up (Simpson's way): species selection (species' births minus deaths against their trait) and the change inside species.
- Worth protecting: the link from dispersal to splitting is not stated; it comes out of migration between a species' populations (19 A). Students find it.

### JM's brief, 2026-10-20 (verbatim, the 21 part; the whole message is in lesson19_overhaul.md)

> And 21 should be on comparative methods and species selection. [...] And by 21, it should be seen species selection, changing the frequency of traits over time as a traits in self-control. Space station and extinction probabilities. [...] The species selection? This one should be tricky. I want to illustrate basically two separate phenomena in this one. Have traits that are advantageous at the individual level, but decrease the likelihood of speciation. We should link this rather explicitly to what you were doing in 19, where we have some trait that allows individuals to spread further and have larger ranges, which makes them less likely the species. It reduces the probability that their population will split. They should be somewhat implicit and not necessarily spelled out for the students directly. They should be able to discover it through the interactions. The idea that would be to track the frequency. What traits over time? and show that within populations, a particular trait may increase in frequency. But his individuals who make who have that treatment, more of themselves than individuals who don't have that treat. With the overall frequency, in the population at large, global form can go down. Species of that trick, don't. So the change in frequency. And as we plotted, as a function of both. The effect on individual level fitness and... A higher order effect on speciation, right? I'd also like this one to explicitly tie into the price equation. to bring it back. So you can see the global change in traits, breaking down kind of Carl Simpson-esque manner. As always, the goal of these activities is not to assess, but rather to illustrate.

Readings: "as a traits in self-control. Space station and extinction probabilities" = as a trait's effect on speciation and extinction probabilities; "less likely the species" = less likely to speciate; "his individuals who make who have that treatment, more of themselves" = as individuals who have that trait make more of themselves; "global form" = global frequency; "Species of that trick, don't" = species with that trait don't [split]; Carl Simpson = species selection by the multilevel Price equation (Simpson & Harnik 2009 crinoids; Simpson 2010).

### As built (first draft, 2026-10-20)

One stage, three rounds. Go plays 16 clades of 1000 generations (species-level engine, ~0.6 s).

    species    200 fish; p, the share carrying the disperser allele: dispersers leave 1 + s young (s the student's), mutation
               .0005 each way, binomial drift. A barrier cuts a 10-fish piece off (chance .1 x room, room = 1 - species / 40); each
               generation dispersers cross with chance d x (p + piece's p) / 2 and it rejoins; cut off 40 generations, it is a new
               species (19 C's idea since 19 pass 4). Lost with chance .002 whatever it carries; the clade's last species never.
    sliders    advantage to a disperser (0, .002, .005, .01, .02); how far dispersers go (.02, .05, .1, .2, .5)
    displays   clade 1's tree, branches shaded by p (light few, dark many: one hue); over time (the clade's average, 16 clades
               thin + their average; each species of clade 1; species living); the clade's change taken apart (three parts and
               their sum, added up, 16 clades averaged); your runs (advantage x how far, ▲ rose ▼ fell); sister clades (three
               columns by how a new species started, its side's species minus the other's, column means)
    Price      every 50 generations, species as units: change = cov(w, z) / mean(w) [between species] + mean of each living
               species' change inside species + mean of its change at splits (new species' share minus its parent's the day they
               split; the parent's jump when it loses the piece). Exact (checked 1e-12).
    rounds     1 T how far .05 held, advantage free (opens .02): the clade's average falls 0 -> 1000, inside species above +.15
               2 T advantage .005 held, how far free (opens .5): between species -.2 or below
               3 D advantage .002, how far .05 held: draw the clade's average (a dot every 100); the cloud = middle 90% of 200
               resamples of the 16 clades' average (Lesson 2); bit = half the dots inside; count in the notes (A_in3)

### Measured (the page's engine in node, scratchpad nodeEng21.js; three sets of 16 clades)

    how far .05: advantage 0 total -.24 to -.29; .002 -.18 to -.27; .005 -.15 to -.17 (inside +.40 to +.48, between -.37 to -.48,
      splits -.16 to -.23); .01 -.04 to +.01; .02 +.12 to +.20 (inside +.77 to 1.02)
    advantage .005, between species: how far .02 -.27 to -.33; .05 -.37 to -.48; .1 -.16 to -.32; .2 -.15 to -.20; .5 -.02 to -.08
      (pieces nearly always rejoin, few species form, nothing to sort)
    sister clades (advantage .005, how far .05): new species that started with fewer dispersers: their side +1.0 to +2.1 species;
      about the same ~0; more -0.5 to -2.5
    single clades are noisy (a clade's average anywhere from .05 to .95); the 16-clade average to about +-.05: hence 16
    prototype dead ends: populations-within-species model (deme gene flow, colonization, rescue): founding scaled with dispersal
      gave dispersing species bigger ranges and more chances to split, reversing the effect; with N 50 drift beat s; tangled.
      An extinction lever (dispersers protect a species from loss) barely moved the between term (-.11 to -.27 at full): cut.

### Open for JM (first draft, 2026-10-20; now questions for the hierarchical Price lesson)

1. Extinction is the same for every species. Your brief: "speciation and extinction probabilities". An explicit "dispersers
   protect a species" lever barely moved species selection here (speciation swamps it); a range-based model made dispersers'
   species split more, not less. Say if you want extinction tied to the trait anyway.
2. The link from dispersal to splitting is never stated: the tip says dispersers cross barriers and a piece left alone 40
   generations is a species (19 C). Students see light (few dispersers) branches splitting more.
3. Comparative methods are one panel (sister clades). The fossil horses (data/clean/horse_*) could carry a real-data version of
   the Price breakdown or the sister-clade test; not attempted.
4. Species count once each in the clade's average (the way species selection is usually counted), not by their fish.
5. The "at the splits" part is large: new species come from the pieces that dispersers failed to rejoin, which carry fewer
   dispersers. It is Simpson's third term (directional speciation); say if you want it folded into "inside species".

### Items (first draft)

| # | What | Status |
|---|------|--------|
| 1 | prototype: species with demes (dropped), then species-level with cut-off pieces; Price three ways, exact | done |
| 2 | page: tree, over time, Price, your runs, sister clades; two targets and a drawn round | done |
| 3 | check script (`check_lesson21_numbers.js`, 14 + R) | done |
| 4 | JM's review; voice | dropped (2026-10-28: 21 re-planned; the draft is parked) |

## Items

| # | What | Status |
|---|------|--------|
| 1 | JM's second ruling (2026-10-28) and this plan; the earlier plan and the first draft parked here | done |
| 2 | JM rules on Open 1-4 | 1-3 done 2026-10-28; 4 todo |
| 3 | archive the first draft as `app/archive/lesson21_species_2026-10-20.html` (runnable) + a README note naming its checks at the archiving commit | done 2026-10-29 |
| 4 | engine prototype: beak, mating rules, song learning; the Measure first list | done 2026-10-29 (Measured, draft 2) |
| 5 | draft 2: A-D, v2, 10 bits; `check_lesson21_numbers.js` rewritten (23 + widths + R) | done 2026-10-29 |
| 6 | JM plays with draft 2; Open for JM (draft 2); his voice for A-D | done 2026-10-29: his review, the three-gene DAG |
| 7 | draft 3: engine prototype (eng3.js), the bars measured; the page rebuilt, v3, 10 bits; check script rewritten | done 2026-10-29 |
| 8 | JM plays with draft 3; Open for JM (draft 3); his voice for A-D | todo (his C ruling done 2026-10-29: song) |

## Rulings

- 2026-10-20: 21 = comparative methods and species selection; a trait good for individuals that lowers speciation (wider ranges, populations split less), linked explicitly to 19; implicit, discovered; within-species rise vs global fall; plotted as a function of the individual effect and the effect on speciation; Price equation, broken down Carl Simpson's way. (Superseded for 21 on 2026-10-28; it stands for the hierarchical Price lesson's species level.)
- 2026-10-28 (second ruling): 21 = speciation, in particular by sexual selection, where different behavioural strategies are optimal for different individuals; magic traits; non-genetic inheritance (bird song); built to flow into 22 (kin selection, gene-level competition); the target lesson is the hierarchical Price lesson (23-25).
- 2026-10-28 (on the plan): "Yes to the bird reading" (the best mating rule depends on the bird); sexual selection alone may fail to split, and the page shows both outcomes ("That's fine"); "Birds, two islands".
- 2026-10-29 (on draft 2): the DAG genes → beak → seeds → reproduction ← mating ← colour / preference ← genes; three genes (beak, colour, preference); who mated whom and young per female cut; the over-time chart with its menu is the animation core; seeds by island and preference strength each make a fitness surface.
- 2026-10-29 (on draft 3): song as a sort of magic trait (a bad song costs fitness and discriminates between groups); the DAG's genes -> colour becomes parent song -> offspring song.

## Do not

- Tune 21's engine until sexual selection alone splits a population (Measure first, the first bullet).
- Fuse the Price terms into one "leftover" (WORK_ORDER): the three parts stay named apart; that they add to the clade's change is the equation, checked to 1e-12. (First draft; carries to the hierarchical Price lesson.)
- State on screen that dispersal lowers splitting. (First draft; carries to the hierarchical Price lesson.)
