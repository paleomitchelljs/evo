# Lesson 21 — sexual selection and its consequences (re-cut 2026-11-07); before that, speciation by sexual selection (draft 3, built to 2026-11-02) and species selection (first draft, parked)

**File** · `app/lessons/lesson21.html` — still draft 3 (v5, 12 bits, 2026-11-02: speciation by sexual selection) until it is
rebuilt on the 2026-11-07 plan below. The first draft (species selection) is `app/archive/lesson21_species_2026-10-20.html`
**Checks** · `node scripts/check_lesson21_numbers.js` · `python3 scripts/check_lessons.py` · `node scripts/check_layout.js`
**Status** · DRAFT 4 BUILT 2026-11-07 (JM: "please start drafting these"): sexual selection itself, with one starting stage on
speciation; measured and built ("Draft 4"). Intros are draft bullets for JM's dictation. Draft 3's record is kept below as history (and a source: its engine, DAG and grid carry over). LOCKS `x`
**Last touched** · 2026-11-07

## JM, 2026-11-07 (verbatim, the whole message; each later plan quotes its own part)

> We have a draft of lesson 21, and various plans for later lessons. I'd like to change those.
>
> 21: purely illustrating sexual selection & its consequences, with a single starting activity showing how divergence in
> sexually selected traits may make speciation easier
>
> 22: kin selection / genic level selection
>
> 23: species selection / hierarchical selection
>
> 2X: Michod style origins of individuality extending the hierarchical framework to show how cooperation evolves by shifting
> the weight of cov(w,z) to different levels. This is the full capstone, and perhaps it should come after Evo-devo…I'm not sure
>
> 2Y: evo-devo where we give a simplified gene network for a vertebrate limb and have students run through simple simulations
> using standard models to show how diffusion and growth drive differential gene expression and produce self-limiting limb
> sizes and recapitulate known skeletal patterns. I'm envisioning a setup simulation that shows students the basics of how
> gene regulatory networks work (toy first, maybe even an interactive showing gene regulation without a numerical model, just
> manipulation….then a model for somitogenesis via clocks?), then they run sims showing how limb location gets specified, then
> they grow a limb to a particular size, and finally they create different patterns of skeletons to make different types of
> tetrapod limbs
>
> 2Z: simulation combining species selection & EvoDevo to illustrate "mesoevolution" in the sense that some traits are more
> likely to involve repeatedly & within certain groups. Maybe also illustrating deep homology

Reading: "more likely to involve repeatedly" = more likely to evolve repeatedly.

## The arc from 21 (2026-11-07)

    21  sexual selection and its consequences; one speciation stage          this file
    22  kin selection, gene-level selection                                  lesson22_overhaul.md
    23  species selection, hierarchical selection                            lesson23_overhaul.md (was hierarchical_price_plan.md)
    2X  origins of individuality (Michod), the capstone                      individuality_plan.md
    2Y  evo-devo: networks, a somite clock, limb position, size, skeleton    lesson24_overhaul.md (papers: docs/refs/README.md)
    2Z  mesoevolution: species selection on development; deep homology      mesoevolution_plan.md

Order after 23, ruled 2026-11-07: evo-devo (2Y), then mesoevolution (2Z), then Michod last (2X). JM:

> Let's put Michod last. My lecture order won't be identical this year. Then please start drafting these

So 24 is evo-devo (24-25 if it splits), mesoevolution follows, the capstone is last. Each unslotted plan is renamed
lessonNN_overhaul.md once the evo-devo split is decided and the numbers follow.

What changed from the 2026-10-28 arc: 21 is no longer speciation by sexual selection (magic traits and the learned song are no
longer asked of it); 23 is the species level and the two-level framework, no longer the four-level target lesson; the cell level
and the whole stack go to the capstone; evo-devo and mesoevolution are new (evo-devo was a sandbox brief in session notes,
2026-09-22, never a plan in the repo).

## What the lesson is (2026-11-07)

- A trait that costs survival spreads because it wins mates; a preference that does its carrier no good spreads because it
  travels with the trait; a costly signal can carry good genes; and the trait's success can cost the population.
- Worth protecting: the survival part and the mating part of the trait's change, measured off the run and shown apart (13's
  split by arrows). JM's lecture: "Whatever you say, you have to support." (461_lec04_06)

## The lecture behind it (docs/2026_lecture_detail.tex, Lec 27-29; verbatim, quote ids as there)

- Cost of choosiness: "Halves mating opportunities minimum"; "Only evolves if offspring quality compensates".
- Honest signals, 202_lec28_02 (birds of paradise): "The cost of the signal IS the signal."
- 202_lec28_04 (peacock): "Females prefer the extravagant males because those are the ones that didn't die."
- 202_lec28_03 (fiddler crabs, Jimmy and Frank): "Dishonest signaling can happen, but it never lasts." Bullets: "Frequency-dependent
  cycles"; "Stable on average, oscillating over time".
- "Intersexual: one sex chooses (birds of paradise)"; "Intrasexual: same sex fights (fiddler crabs)"; "Peacocks: both at once".
- 202_lec28_05 (ducks): "An arms race driven by asymmetrical investment." Bullet: "Selection acts in opposite directions on two
  sexes of same species".
- 461_lec04_06: "Sexual selection gets thrown around as 'this could be responsible.' ... Don't fall for it. Whatever you say, you
  have to support."
- Lec 27, mechanism 3: "Divergent trait IS the mate-choice criterion"; "Hybrid signal is bad → low fitness IS the pre-zygotic
  barrier". 202_lec27_05: "you don't want to be the purple bird."
- Lec 29, the hand-off to 23. "Speciation traits are heritable across species: Strong sexual selection: easy reinforcement".
  202_lec29_02 (platypus and fairy-wren): "Were the new species better off as individuals? No—smaller populations, less
  efficient selection. But the lineage made more species."

## Plan (proposed 2026-11-07; a sketch, nothing measured)

Setting: draft 3's finches, its DAG, its mating grid ("male colour" across, "female preference" up), the preference drawn onto
colour → mating, the over-time chart with its menu. A runs on two islands; B onward on one island with no migration, so nothing
after A can be read as speciation.

    A  the one speciation stage. Draft 3's A as built (two islands, seeds set by island, colour and preference genes, strength
       on colour → mating), re-aimed at the beak gene: the colour preference holding the beaks apart, because a newcomer of the
       other colour seldom breeds. Rounds (to measure): random mating with seeds apart, the beak split partial; strength free,
       the beak split holds; seeds that favour one beak on both islands, strength high, the colours merge all the same (draft
       3's A3, the preference cannot hold what the seeds erase).
    B  the cost and the pay. One island. Colour as the sum of several loci (14 C's polygenic trait), so the average can settle
       anywhere between dull and bright. Two arrows from colour: → survival (the cost of brightness, males only, draft 3 B's red
       arrow) and → mating (the preference onto it). Surfaces: survival by colour, the mating grid. The average settles past
       survival's peak, how far set by the preference strength. Each generation's change split from the run into the survival
       term (negative) and the mating term (positive), adding up exactly; at the end they cancel (13's bars). Targets on where
       the average ends: past the survival peak; on it (strength 0); dull (a cost too high to pay).
    C  the preference travels with the trait. A preference gene with no arrow to its carrier's survival, or a small cost of
       choosiness (fewer looks: draft 2's 4 looks). It rises because choosy mothers have bright sons, so the two genes come to
       sit together in the same birds (run 1's dots line up on the grid). Its change is a covariance with fitness that runs
       through the colour gene: 13's arrows, direct (zero, or the cost) and through her sons (positive). Targets: the
       preference rises with no use to the female; a cost of choosiness stops it (the lecture's "Only evolves if offspring
       quality compensates"); both climbing together, if the engine gives that at page sizes (measure first).
    D  honest signals. Colour shows condition: each bird carries 16's harmful mutations, and a bird with fewer can be brighter
       (a condition arrow onto colour). Choosy mothers' young carry fewer harmful mutations. Targets: the preference spreads in
       spite of its cost; the population's average survival ends higher with choice than without, at the same mutation rate.
       Lecture: birds of paradise, the peacock.
    E  the trait against the population (Open 2 picks one):
       (i)   conflict (ducks): a male allele that raises his matings and lowers his mates' survival spreads while the
             population's average survival falls; a female resistance allele follows;
       (ii)  bluffers (fiddler crabs): a cheap large claw wins by display until fighters are common; the two cycle (14 D's
             frequency dependence with two kinds, not three);
       (iii) the bighorn record (Real data, below).
       Each ends on the point 23 opens with: good for the bird that carries it, bad for the group it lives in.

Real data: `data/clean/bighorn_*` (Pelletier et al. 2022). Rams' horns are a weapon (intrasexual selection); "males average 51.9 cm
and females 21.3 cm" (data/SOURCES.md: the dimorphism); horn length against offspring, sires +0.14 on 69; hunting removes the
large-horned rams, an arrow against the mating one. A closed box under B or E. Lessons 7 E, 10 B and 18 Q4 use the file
already; the horns as a sexually selected trait are new.

Carried from draft 3 (reuse, not rebuild): the engine's finches, two islands of 100, seeds by island; mating probability
exp(-s d²); the preference arrow onto colour → mating (paths.js, ontoAt .4) and colour → mating as thick as the strength; the
cost of brightness on males; the survival-by-colour surface; the over-time chart; the check script's structure.

Parked 2026-11-07 (speciation, not sexual selection): B's colour gene dragged along the beak gene's chromosome with the
inversion; C's learned song beside colour; D's three drawn rounds on F_ST. All in git at 2368016 and recorded below.

## Flow into 22 and 23

- 22: C's preference rising through sons is an allele gaining through copies in other birds, 22's logic without kin. One gene
  for the colour and the liking for it would be a greenbeard's shape (a tag and its recognition in one gene).
- 23: A at the species level. Lineages whose birds choose strongly split more (Lec 29's platypus and fairy-wren); 23 opens there.
  E's "good for the bird, bad for the group" is the within-against-between split 23 names.
- 22's learned call as a kin cue was to come from 21 C's song, now parked. Lesson 8 C (eggs swapped; a son sings the song of
  the father who raised him) is still its source.

## Measure first (2026-11-07)

- A: F_ST at the beak gene at 100 generations against strength 0-6, seeds apart, the colour gene unlinked. Not in any draft-3
  table (draft 3 measured the colour gene's F_ST against strength, and the beak's only with the beak as the cue or with linkage).
  One step the right way must land (targets teach).
- B: a polygenic colour (how many loci; 14 C's engine) under the two arrows; the end average against strength and cost; the
  survival and mating terms adding exactly each generation (13's priceTerms, never fused: WORK_ORDER).
- C: at 100 birds, does a preference gene with no direct effect rise above drift? The association it rides on is weak; drift
  may swamp it at page sizes (Lande 1981; Kirkpatrick 1982; to check). A cost of choosiness should stop it (Kirkpatrick 1985;
  Pomiankowski 1987; to check); a mutation bias on colour toward dull keeps it (Pomiankowski, Iwasa & Nee 1991; to check).
- D: does condition at 16's mutation rates make choice pay at page sizes (Rowe & Houle 1996, to check), and does the survival
  difference show above the noise of 16 runs?
- E: (i) a conflict allele and a resistance allele at page sizes, escalating or cycling; (ii) a two-kind bluffing cycle.

## Open for JM (2026-11-07)

1. Five stages is a lot. If one goes, merge C into D: C runs the preference against its cost and ends where D starts ("Only
   evolves if offspring quality compensates").
2. E: conflict (ducks), bluffers (fiddler crabs), or the bighorn record?
3. A's trait: colour, as built and reviewed, or the learned song (Lec 27's mechanism 3; the warblers)? Recommendation: colour.
   The song beside colour was the C you found "tricky" (2026-11-02).
4. Young against number of mates, males and females (the slope steeper in males: Bateman's gradient, Arnold & Duvall 1994, to
   check), as a panel in B: it is a regression slope, the course's tool. In or out?
5. Draft 3's open items close with this re-cut (they were about B-D, now parked), except A's: the strength steps 0 1 2 3 4 6;
   A3 as a target that makes the islands the same.

## Draft 4 (2026-11-07): what is being built, and the numbers behind it

JM, 2026-11-07: "Let's put Michod last. My lecture order won't be identical this year. Then please start drafting these"

Prototype: scratchpad l21/engA.js (draft 3's engine pulled from the page) and l21/eng1.js (one island). 16 runs at 100
generations, the runs' average; the spread is over 4-6 seed sets.

    A  draft 3's engine and A as built. A2 re-aimed at the beak gene: seeds apart, F_ST at the beak gene by preference strength
       0 .48-.56, 1 .47-.52, 2 .47-.51, 3 .54-.60, 4 .86-.90, 6 .91-.94 (colour gene .02 / .02 / .01 / .17-.25 / .82-.89 /
       .91-.94). Seeds (0, ¾): .38-.40 at 0-3, .81-.82 at 4. The beak split holds once the colours do.
       A2: seeds apart held, strength free (opens 3, as draft 3's A2 did): beak F_ST ≥ .7. A1, A3 as built.
    B-E one island, 500 birds (drift swamped C at 200: the preference's end over six seed sets overlapped between strength 0
       and 4). Colour from two genes (a bird's colour 0, ¼, ½, ¾, 1; at eight genes the preference's rise in C was smaller).
       Mutation .002 an allele a generation. Mating (changed from A's rule; why below): a female keeps meeting males until
       one becomes her mate, a meeting ending in mating with A's probability exp(-s a d²) (a her choosiness, d = 1 - his
       colour), so she always mates; a cost of choosiness is its own arrow (a choosy female breeds with 1 - cp x a).
       A's rule (4 looks, then unmated) puts a hidden cost on choosiness among dull males: with it the preference gene
       died (0.00 in every run at 4 looks) or fell (strength 6, colour starting rare: .11-.27). A pick-among-4 rule with
       weights exp(s a z) sent the colour to one end (strength 2: .96 at cost .5, .19 at cost 1).
    B  every female likes bright. Bright alleles at 100 by cost x strength: cost .5: 0 .02, 1 .62-.65, 2 .82-.83, 3 .90-.92,
       4 .94-.95; cost .75: 0 .02, 1 .39-.41, 2 .58-.59, 3 .68-.70; cost 1: 1 .22-.24, 2 .47-.49, 4 .53-.54, 6 .60-.61.
       B1 cost .5 held, strength free (opens 0): ≥ .4. B2 strength 2 held, cost free (opens .5): ≤ .7.
       The change split each generation, exactly: who mates (females, males), what the young keep, who lives.
    C  a preference gene (likes bright, start 30%), strength 6, cost of brightness .25. The liking-bright allele at 100 by
       cost of choosiness: 0 .41-.51, .05 .17-.31, .1 .05-.08, .2 .00-.01. Its change summed over 100 generations: in males'
       matings +.17 to +.23 at every cost (it sits in bright males), in females' about 0 at cost 0, through survival -.02 to
       -.05 (bright males die more). C1 opens .1: ≥ .33 (was .35; see Built). C2 opens 0: ≤ .15. Cost steps 0, .1, .2.
    D  C's world, cost of choosiness .1; harmful mutations (16's: .5 new a young, each 5% off survival, start ~10 a bird);
       his colour dulled by them, 0.95^(g h). Liking-bright allele by g: 0 .04-.06, 1 .19-.29, 2 .46-.52, 4 .67-.85; harmful
       mutations a bird 9.3-9.7 → 7.1-7.6 → 4.7-5.0 → 2.4-2.8; young that live .57 → .62 → .70 → .79. By the mutation rate at
       g 2: 0 .06-.08, .25 .15-.24, .5 .44-.54, 1 .61-.76. D1 g free (opens 0): ≥ .15. D2 g 2 held, rate free (opens .25): ≥ .35.
    E  colour shows in females too (every female likes bright, strength 2, cost .5): daughters that live 1.00 → .71, bright
       alleles .81 → .57. A gene that switches colour off in females (start 10%) by cost: 0 .08-.13, .25 .96-.97, .5+ .94-1.00.
       E1 toggle free (opens off): daughters that live ≤ .9. E2 the off gene present, cost free (opens 0): off gene ≥ .5.
       The ducks' conflict did not fit: with one brood a season, harming his mate harms his own young.
    scoring v6, scaffold 11: A1 A2 A3 B1 B2 C1 C2 D1 D2 E1 E2.

Built (2026-11-07, v6, 11 bits; `check_lesson21_numbers.js` rewritten, 32 checks + both widths + 5 R panels):

    page       A as draft 3 (its engine stripped of linkage, inversion, cost and song; the random draws unchanged), A2 on
               the beak gene. B-E share one template: over time (menu), the change taken apart (B; C and D with a menu for
               which quantity, the mating part by sex), fitness surfaces (survival by colour, or in D by harmful mutations
               and the colour she sees; the mating grid, one row "likes bright" in B and E, three in C and D), the diagram
               (paths.js; arrows ids = the controls), the Target card, R last and closed. E's two switches are boxes under
               its diagram (draft 3 B's inversion box); the off gene's box and the females' cost arrow appear only when on.
    seeds      the page's one-island engine over 30 seed sets of 16 runs (scratchpad l21/pageOne.js), at the bars:
               C1 cost 0 .36-.55 (median .44) against .33, opening .1 .03-.10; C2 .1 .03-.10 against .15; D1 dulling 0
               .03-.10, 1 .19-.31 against .15; D2 rate .25 .12-.28, .5 .39-.59 against .35. C1's bar went from .35 to .33 on this
               (the minimum was .36), still above the allele's start of .30, so a hit is a rise.
    D layout   the diagram widened to 540 so harmful mutations -> colour, D1's control, is long enough to see.

Open with the draft (2026-11-07): E's pick (Open 2) made as conflict between the sexes over colour, Lec 28's "Selection acts in
opposite directions on two sexes of same species"; A2 opens at strength 3, not 0 (the one-step rule cannot be met from 0:
1 and 2 leave the beak split as the seeds alone leave it); B-E's mating rule differs from A's (above); no Bateman panel (Open 4).

## Items (2026-11-07)

| # | What | Status |
|---|------|--------|
| 1 | JM's re-cut (2026-11-07); this plan; the arc 21-2Z written (22 updated, the target plan renamed 23, three new plans, docs/refs summarised) | done 2026-11-07 |
| 2 | JM rules on Open 1-5 (2026-11-07) | todo |
| 3 | archive draft 3 whole and runnable as `app/archive/lesson21_speciation_d3_2026-11-02.html` + README note naming its checks at 2368016 | done 2026-11-07 |
| 4 | Measure first: A's beak F_ST by strength; B's polygenic colour and its two terms; C's preference gene; D's condition; E | done 2026-11-07 (Draft 4, above) |
| 5 | page: A re-aimed, B-E; v6 (slots change); `check_lesson21_numbers.js` rewritten | done 2026-11-07 |
| 6 | JM plays with draft 4; Open 1-5 (2026-11-07) and the draft's open points; his voice for A-E | todo |

## Rulings (live; the full dated list is at the end of the history)

- 2026-11-07: 21 = "purely illustrating sexual selection & its consequences, with a single starting activity showing how
  divergence in sexually selected traits may make speciation easier". 22 kin / genic-level selection; 23 species /
  hierarchical selection; 2X Michod's origins of individuality, "the full capstone"; 2Y evo-devo; 2Z mesoevolution.
- Still standing from draft 3, because the new plan reuses what they rule on: the DAG genes → beak → seeds → reproduction ←
  mating ← colour / preference ← genes (10-29); the over-time chart with its menu as the animation core (10-29); seeds by island
  and preference strength each make a fitness surface (10-29); brighter males die more (11-01); "mating probability", never
  "chance she takes him" (11-01); the grid reads "male colour" and "female preference" (11-02); colour → mating is zero without
  a preference, the preference drawn onto that arrow (11-02).
- Superseded for 21 on 2026-11-07: the 10-28 second ruling's 21 part (speciation by sexual selection; magic traits; non-genetic
  inheritance), the song rulings (10-29, 10-30), and 11-01's linkage tool, inversion and father's-song arrows (parked with B-D).

## Do not (live)

- Put B-E on two islands: they would read as speciation again.
- Name on screen what the runs show: runaway, handicap, good genes, Bateman, sexy sons (the no-vocabulary rule; lesson 9).
- Say why a preference spread before the run shows it (JM: "Whatever you say, you have to support").
- Fuse the survival and mating terms into one leftover (WORK_ORDER).

# History: speciation by sexual selection, 2026-10-28 to 2026-11-02 (draft 3, superseded 2026-11-07)

Everything below is the record of the plan JM replaced on 2026-11-07. Its open items are closed by the re-cut; its engine
and measurements are sources for the new A and for B-E's finches.

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
hierarchical Price lesson, 23, 24 or 25 as 21 and 22 split or not (`lesson23_overhaul.md`). 21 and 22 build toward it.

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
from her genes, her father's song or the island's songs. 2026-11-01: the beak-as-cue arrow is gone; B carries the colour gene
dragged along the beak gene's chromosome and an inversion (the tag-and-help race in 22); C's song passes from the father to
son and daughter by two arrows, and the island's songs are gone. The list below is the 10-28 plan.)

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

JM on the song, 2026-10-30 (verbatim): "Beaks don't have a strong effect on song, though. I'd rather the broader lesson than
trying to shoehorn in a magic trait angle. I like the idea of a magic trait, but if we're "only" illustrating non-genetic
inheritance reinforcing barriers and the role a non-recombining trait has for species differentiation combined with a
recombining ecological trait...that seems fine."

C rebuilt 2026-10-30 (magic traits stay in B, the beak as the cue):
    C          beak -> song (lim) cut, with its "how well he sings it" grid. Two toggles under the diagram:
               - his song from his genes (a song gene in the colour gene's place: recombines; ◐ sings in between) or his
                 father's song (learned, 1 in 50 misheard: never recombines);
               - her preference from her genes / her father's song / the island's songs.
               Surfaces: survival by beak; his song × she likes (2 columns, or 3 from a song gene). Seeds apart, β 2 held.
               C1 his father's song held, her preference free (opens the island's songs): beak F_ST ≥ .68.
               C2 her father's song held, his song free (opens his genes): the same.
    measured   (eng5.js, six sets of 16, β 2, seeds apart; beak F_ST at 100, song F_ST in brackets)
                               her genes            her father's song     the island's songs
               his genes       .45-.54 [.00-.01]    .45-.51 [.00-.03]     .46-.55 [.00]
               his father's    .48-.58 [.07-.19]    .71-.75 [.70-.80]     .47-.54 [.01-.03]
               Neither alone holds. Both together: the song and the liking for it pass from the father as one block that
               never recombines, while the beak recombines and is held by the seeds (paternal imprinting: Verzijden et al.
               2005, Evolution, to check).
               β 3: his father's / her genes .73-.80 and his genes / her father's .76-.84 hold too; β 2 held, where only the
               pair holds. β 1: nothing holds (.45-.55).
               Seeds favouring one beak on both islands (both soft, β 2-3): beak 0, a father's song .00-.01, a song gene
               .03-.09. The song goes with the kind that wins, so there is no "songs apart, beaks the same" round.

Open for JM (draft 3):
1. ~~B and C carry his 10-28 asks on the new DAG. Keep, change, or cut?~~ Answered 2026-10-29: song as a sort of magic trait,
   built as C. B (beak as the cue) kept. 2026-10-30: C's magic trait cut (beak -> song). Should one D round be a song set-up?
   (Father's song + her father's song, β 2, ends ~.73, close to B's .77 round.)
2. Preference strength steps 0 1 2 3 4 6: the colours hold at 4 and fall at 2; 3 is the edge (slow loss). The mating
   grid shows what each step means.
3. A3 is a target to make the islands the same: strong preferences, but seeds that favour one beak on both islands.
   Fine as a target?
4. Draft 2's Open 1 (the one immigrant), 3 (4 looks), 5 (citations: now Grant & Grant 1997 too) and 6 (real data) still
   stand; 2 and 4 went with the panels and sliders they were about. Podos 2001 is off the page (2026-10-30).
5. B's empirical anchor for the beak as the cue: Ratcliffe & Grant 1983 (Anim Behav; finches told species apart by
   morphology, mounted specimens), to check. Name it in B's diagram tip?

## JM, 2026-11-01 (verbatim, three messages)

> For lesson 21–I don't like the part B where females are choosing based on beak shape. Also for part C, I think there
> should be an arrow from father's song to preference, as in birds a female's song is often driven by their parents rather
> than by other birds in general.
>
> I think having an increased death rate with brighter colors makes more sense for illuminating a trade off for part B

> Also "chance she takes him" is creepy wording—could it just be "mating probability"

> We can also use the loci positioning tool from prior lessons to have the color locus and beak shape locus at variable to
> approximate the trade off, with an inversion toggle to potentially lock them together

Readings:
- "brighter colors": the colour gene runs dull → bright on every stage (was pale → dark), bright in the page's red (a
  lightness ramp too: colourblind students). The colour shows in males, and only males pay the cost.
- "at variable": at variable distances. "to approximate the trade off": read as the colour gene linked to the beak gene, so
  a costly colour can ride on a favoured beak (or drag it down). Built in B beside the cost, not instead of it.
- "an arrow from father's song to preference": C's diagram gets a father's-song box with two arrows out, to his song and to
  her preference; each arrow is the control (on or off), the radio rows are gone. "rather than by other birds in general":
  the island's songs are cut as a source.
- "mating probability": every "chance she takes him" on screen and in the code comments.

Built (2026-11-01, v4, 12 bits; scratchpad eng6.js the engine, then the page in the check):

    engine     a gamete takes the colour allele from the beak allele's chromosome unless a crossover parts them: 1/2 on
               separate chromosomes (A, C, D), r = (1 - (1 - 2/39)^d) / 2 at d loci apart on B's 40-locus chromosome (beak
               gene at 20: .026 beside, .32 at 40), none in a bird with one inverted and one standard chromosome (the
               inversion on every chromosome that starts on the blue island). A male lives with his beak's chance times
               1 - c x colour (0, 1/2, 1), c the cost of brightness. C: sg and pl set at hatching: the father's song (1 in 50
               wrong) when the arrow is on, else the bird's own song or preference gene. B's beak-as-cue (w) is gone.
    B          seeds apart. Diagram: A's plus the cost of brightness, colour -> reproduction (red, signed, lesson 19's cost
               idiom). Surfaces: survival by beak; a male's survival by colour (new, the cost); mating probability. The
               chromosome (lesson 19 D's strip, draft 2's drag): the colour gene ■ dragged, an inversion box with its bracket.
               B1 strength 4, colour gene at 40, cost free (opens 0): F_ST at the colour gene ≤ .1.
               B2 strength 3, cost .25, colour gene free (opens 40): F_ST at the colour gene ≥ .4; one sentence (a drag).
               B3 the same, colour gene at 40 held, inversion free (opens off): the same.
               B4 strength 3, inversion on, cost free (opens .25): F_ST at the beak gene ≤ .1.
    C          diagram: beak gene, song gene, father's song, preference gene; father's song -> song and father's song ->
               preference, each on or off; the song gene's and preference gene's arrows pale, on when the father's is off.
               Seeds apart, strength 2. Judged on F_ST of the song (≥ .45), not the beak (see Measured).
               C1 sons' arrow held on, daughters' free (opens off). C2 daughters' held on, sons' free (opens off).
    D          D2 is now B3's set-up (strength 3, cost .25, colour gene at 40 with the inversion; ends ~.73-.80). D1, D3 as were.
    scoring    v4, scaffold 12: A1 A2 A3 B1 B2 B3 B4 C1 C2 D1 D2 D3.
    also       a newly freed arrow glowed only after the next redraw (paths.js synced before Next target re-enabled its
               input; A2's strength arrow had it too): syncStage re-syncs the diagram when the set of enabled inputs changes.

Measured (eng6.js; 16 runs at 100 generations, the runs' average, three to eight seed sets; the page's runs in brackets):

    B, strength x cost, colour gene unlinked / at 40 / beside / inversion, F_ST at the colour gene:
      s 3: c 0 .28-.36 / .22-.38 / .59-.76 / .75-.82; c .25 .15-.16 / .08-.28 / .50-.62 / .68-.78; c .5 0 / 0 / .07-.23 / .32-.47
      s 4: c 0-.25 .78-.91 everywhere; c .5 .55-.71 / .62-.77 / .80-.87 / .87-.90; c .75 0 / 0 / .10-.11 / .10-.25; c 1 0
      s 6: holds to c .75 (.84-.93); c 1 0
    B1 (s 4, at 40) by cost: 0 .83-.89 [.87], .25 .82-.86, .5 .69-.79 [.68], .75 .00-.01 [.00], 1 0 [.00].
    B2 (s 3, c .25) by the colour gene's distance from the beak gene: 1 .49-.71 [.57 at 21, .66 at 19], 2 .38-.62, 3
      .31-.49, 4 .29-.59, 6 .30-.42, 9 .28-.31, 14-20 .07-.33 [.16 at 40, .15 at 1]. Bar .4: beside always, two away 7 of 8.
    B3 inversion, colour gene at 40: .68-.82 [.74]; off [.14].
    B4 (s 3, inversion) F_ST at the beak gene by cost: 0 .75-.82, .25 .68-.78 [.78], .5 .23-.47 [.49], .75 .00-.01 [.00], 1 0;
      no inversion at .75 .46-.55 [.50]. Locked together, purging the bright colour purges the large beak: the small beak
      takes both islands.
    C, F_ST at the beak gene by the chance a son / a daughter learns (0 .25 .5 .75 1 each): both 1 .70-.75; any other pair
      .45-.60. Learning short of always breaks the block, so the arrows are on or off. On the page both on gave .62 at
      C1's seed against .57 with daughters off: too thin for a bar, so C is judged on F_ST of the song: both on .61-.78
      [.61, .71], sons only .07-.23 [.06], daughters only .00-.05 [.02]. The beak, both on [.73, .74], one off [.49, .52].

Open for JM (2026-11-01):
1. Magic traits have now left the lesson (B's beak-as-cue cut today; C's beak -> song cut 2026-10-30), though his 10-28
   ruling asked for them. The inversion locking the colour gene to the beak gene is the nearest thing. A cost of brightness
   that differs by island (predators on one island only) would make the colour a magic trait in Servedio et al.'s sense
   (divergent natural selection on a mating cue): one more setting a stage. Add it, or leave magic traits out?
2. "to approximate the trade off" read as linkage carrying the cost (above). If he meant something else, B2-B4 change.
3. B has four targets (12 bits in all). B4 (the inversion takes the large beak down with the bright colour) is the one to
   cut if that is too many; it is also the one that shows an inversion is not only protective.
4. C is judged on the songs, not the beaks (Measured). The beak shows in the menu. Fine?
5. The island's songs were cut from C on "rather than by other birds in general". Back as a third arrow if he wants the
   contrast (it measured .47-.54 at the beak, like her genes).
6. Draft 3's open items 2-5 stand (strength steps; A3; the immigrant, 4 looks, citations, real data). D has no song round.

## JM, 2026-11-02 (verbatim)

> For lesson 21, part A, the "mating probability" box should have "male color" and "female preference" instead of his
> color & she likes.
>
> For A and B, I'm not sold on the arrows leading to mating. The color -> mating arrow should be zero if there's no
> preference. So it should be linked to preference in a way the current setup doesn't convey, rather it conveys a fixed
> effect of color on mating.
>
> Part C is also tricky, as it isn't clear what the genes are doing. I'd rather something like keeping color & preference
> for color but adding the non-genetic song factor and seeing how it interacts

Readings:
- "male color" / "female preference": the grid's two axis labels, spelled "colour" as the rest of the page. The grid is
  shared by A, B and D, so all three change; C's grids take the same two words ("male song" for its song grid).
- "linked to preference": preference → mating is gone. The preference arrow lands on colour → mating (`onto`, lesson 14 A's
  idiom and draft 2 A's choosiness arrow) and carries the preference strength. Colour → mating is pale and drawn as thick
  as the strength: dashed (zero) at strength 0. That is what the engine does: exp(-s d²) is 1 for every male at s 0.
- "keeping color & preference for color but adding the non-genetic song factor": C keeps A's three genes as they are. The
  song has no gene: a son sings his father's song and a daughter likes her father's song (11-01's two arrows, now fixed:
  with no song gene there is nothing for "off" to fall back on). She judges both: mating probability = exp(-s d_colour²)
  × exp(-s_song d_song²). The song preference strength is the new arrow (song preference onto song → mating).
- "seeing how it interacts": the rounds pair a weak genetic barrier with a weak cultural one (Measured, below).

Plan / status:

| # | What | Status |
|---|------|--------|
| 1 | the mating grid's labels: male colour, female preference (A, B, D; C's two grids); B's cost panel "male colour" too | done |
| 2 | A and B diagrams: preference onto colour → mating, the strength on it; colour → mating follows the strength | done |
| 3 | C engine: colour + preference genes as A; learned song and song preference beside them; two strengths | done |
| 4 | C page: diagram, two grids (colour, song), menus, rounds, draft intro, R panel; v5 (C's targets change) | done |
| 5 | check script: C's engine checks, rounds, flow, R panel; A/B diagram classes | done (29 + both widths + 5 R) |

Built (2026-11-02, v5, 12 bits):

    A, B       preference → mating cut. The preference's arrow lands 40% along colour → mating (ontoAt .4, so the two
               heads do not pile up at full width) and carries the strength; colour → mating is bound to the same input,
               read-only: pale, as thick as the strength, dashed at 0. Mating moved down and right so both arrows run
               ~90-100 px edge to edge (a full-width arrow on less is mostly head). Reproduction lower; diagram 460 x 328.
    C          diagram (490 x 346): beak gene → beak → seeds → reproduction; colour gene → colour → mating with the
               preference onto it (A's); father's song → song and → song preference, both grey (fixed: no gene to fall
               back on); song → mating with the song preference onto it, its own strength. Surfaces: survival by beak;
               "mating probability: colour" (3 x 3); "× song" (2 x 2, cells as tall as the colour grid's). Menu adds F_ST
               at the colour gene, bright allele, liking for bright.
               C1 preference strength 2 held, song preference strength free (opens 0): F_ST at the colour gene ≥ .15.
               C2 song preference strength 1 held, preference strength free (opens 1): F_ST of the song ≥ .35.
    measured   thirty sets of 16 (eng7.js): C1 ss 0 .00-.03, ss 1 .25-.56 (median .42), ss 2 .78-.88; C2 s 1 .08-.31,
               s 2 .43-.74 (median .58), s 3 .66-.83. Page (the check's seed): C1 ss 1 .43, ss 2 .87, ss 0 .00; C2 s 2
               .55, s 3 .81, s 1 .20, s 0 .25. The C1 bar was .2 until a page run at ss 1 ended at .27.

Open for JM (2026-11-02):
1. C1 and C2 end on the same pair of settings (preference strength 2, song preference strength 1), reached from either
   side: the song holds the colour genes, then the colour preference holds the songs. If that reads as one target twice,
   C2 could instead hold no colour preference (0) and ask for the songs apart (song preference strength 2 does it,
   .64-.73) while the colour genes mix (.05-.10): the song alone holds itself, not the genes.
2. The father's-song arrows are fixed now. With no song gene, "off" had nothing to fall back on except the island's
   songs, which were cut 2026-11-01. Say if you want a switch back (learned from the father or from the island).
3. A song with no song preference drifts to 50:50 from the 1-in-50 copying errors alone (an error is the other island's
   song), whatever the colour preference does (song F_ST .13-.23 at colour strength 4-6). So "a colour barrier holds the
   songs" only shows with some song preference. Fewer errors (1 in 200) would let a colour barrier hold the songs by
   itself; unmeasured.
4. "male colour", not "male color": the page spells colour the British way throughout.

Measured (scratchpad eng7.js, the engine for the new C; 16 runs at 100 generations, seeds apart):

    colour strength x song strength (0 1 2 3 4 6 each), three sets; F_ST at the colour gene / of the song / at the beak:
      s 0:  ss 0 .01-.02 / .04-.12 / .49-.51   ss 1 .02-.03 / .13-.20   ss 2 .05-.10 / .64-.73   ss 6 .36-.53 / .77-.82
      s 1:  ss 0 .01-.02 / .06-.08             ss 1 .01-.02 / .14-.31   ss 2 .33-.45 / .71-.79   ss 3 .61-.78
      s 2:  ss 0 .00-.02 / .05-.08             ss 1 .32-.40 / .51-.68   ss 2 .77-.85 / .79-.86
      s 3:  ss 0 .08-.31 / .05-.12             ss 1 .78-.87 / .68-.76
      s 4:  ss 0 .84-.85 / .13-.21             ss 1 .91-.93 / .79-.82
    The two barriers add up to more than either: colour 2 alone loses the colours, song 1 alone loses the songs; together
    both hold. A song held apart with no song preference (ss 0) is lost to the 1-in-50 copying errors whatever the colour
    preference does (.13-.23 at s 4-6): an error is the other island's song, so errors alone pull both islands to 50:50.
    A strong song alone holds the songs (.64+ from ss 2) but the colour gene only slowly (.36-.53 at ss 6).
    eight sets:
      C1 (s 2 held; song strength free; F_ST at the colour gene): ss 0 .00-.02, 1 .35-.58, 2 .80-.87, 3 .88-.91
      C2 (ss 1 held; colour strength free; F_ST of the song): s 0 .04-.17, 1 .10-.24, 2 .47-.71, 3 .72-.80, 4 .73-.81
    Bars: C1 colour F_ST ≥ .15 (opens ss 0; one step, ss 1, lands; .2 at first, see Built). C2 song F_ST ≥ .35 (opens s 1, A's lost colours; one
    step, s 2, lands). Both end at the same pair (s 2, ss 1), reached from the two sides.

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

## Items (draft 3, to 2026-11-02)

| # | What | Status |
|---|------|--------|
| 1 | JM's second ruling (2026-10-28) and this plan; the earlier plan and the first draft parked here | done |
| 2 | JM rules on Open 1-4 | 1-3 done 2026-10-28; 4 closed 2026-11-07 |
| 3 | archive the first draft as `app/archive/lesson21_species_2026-10-20.html` (runnable) + a README note naming its checks at the archiving commit | done 2026-10-29 |
| 4 | engine prototype: beak, mating rules, song learning; the Measure first list | done 2026-10-29 (Measured, draft 2) |
| 5 | draft 2: A-D, v2, 10 bits; `check_lesson21_numbers.js` rewritten (23 + widths + R) | done 2026-10-29 |
| 6 | JM plays with draft 2; Open for JM (draft 2); his voice for A-D | done 2026-10-29: his review, the three-gene DAG |
| 7 | draft 3: engine prototype (eng3.js), the bars measured; the page rebuilt, v3, 10 bits; check script rewritten | done 2026-10-29 |
| 8 | JM plays with draft 3; Open for JM (draft 3); his voice for A-D | closed 2026-11-07 (A's open items carry to the new plan) (his C rulings done: song 2026-10-29; no beak -> song 2026-10-30) |
| 9 | C without the beak's limit: his song from his genes or his father; eng5.js measured; page, check script | done 2026-10-30 |
| 10 | JM 2026-11-01: B = cost of brightness + colour gene on the beak's chromosome + inversion (beak-as-cue cut); C = two arrows from the father's song (island's songs cut); "mating probability"; dull/bright; eng6.js measured; page v4 (12 bits); check script (27 + widths + R) | done 2026-11-01 |
| 11 | JM rules on Open for JM (2026-11-01) | closed 2026-11-07 by the re-cut |
| 12 | JM 2026-11-02: grid labels; preference onto colour → mating (A, B); C = A's genes + a learned song (see "JM, 2026-11-02") | done 2026-11-02 |
| 13 | JM rules on Open for JM (2026-11-02) | closed 2026-11-07 by the re-cut (B-D parked) |

## Rulings (all, dated; the latest wins)

- 2026-11-07: see "Rulings (live)" above: 21 = sexual selection and its consequences, one starting stage on speciation.
- 2026-10-20: 21 = comparative methods and species selection; a trait good for individuals that lowers speciation (wider ranges, populations split less), linked explicitly to 19; implicit, discovered; within-species rise vs global fall; plotted as a function of the individual effect and the effect on speciation; Price equation, broken down Carl Simpson's way. (Superseded for 21 on 2026-10-28; it stands for the hierarchical Price lesson's species level.)
- 2026-10-28 (second ruling): 21 = speciation, in particular by sexual selection, where different behavioural strategies are optimal for different individuals; magic traits; non-genetic inheritance (bird song); built to flow into 22 (kin selection, gene-level competition); the target lesson is the hierarchical Price lesson (23-25).
- 2026-10-28 (on the plan): "Yes to the bird reading" (the best mating rule depends on the bird); sexual selection alone may fail to split, and the page shows both outcomes ("That's fine"); "Birds, two islands".
- 2026-10-29 (on draft 2): the DAG genes → beak → seeds → reproduction ← mating ← colour / preference ← genes; three genes (beak, colour, preference); who mated whom and young per female cut; the over-time chart with its menu is the animation core; seeds by island and preference strength each make a fitness surface.
- 2026-10-29 (on draft 3): song as a sort of magic trait (a bad song costs fitness and discriminates between groups); the DAG's genes -> colour becomes parent song -> offspring song.
- 2026-10-30 (on C): beaks have no strong effect on song; no magic-trait angle in C. C shows non-genetic inheritance reinforcing barriers, and a non-recombining trait (the song) with a recombining ecological trait (the beak).
- 2026-11-02: the mating grid reads "male colour" and "female preference"; colour → mating is zero without a preference, so
  the preference is drawn onto that arrow (A, B); C keeps A's colour and preference genes and adds the learned song beside them.
- 2026-11-01: no female choice by beak shape in B; B shows a trade-off: brighter males die more; the loci-positioning tool puts the colour gene at a variable distance from the beak gene, with an inversion toggle to lock them together. C: an arrow from the father's song to her preference (a female's preference comes from her parents rather than other birds). On screen, "mating probability", never "chance she takes him".

## Do not (draft 3 and the first draft)

- Tune 21's engine until sexual selection alone splits a population (Measure first, the first bullet).
- Fuse the Price terms into one "leftover" (WORK_ORDER): the three parts stay named apart; that they add to the clade's change is the equation, checked to 1e-12. (First draft; carries to the hierarchical Price lesson.)
- State on screen that dispersal lowers splitting. (First draft; carries to the hierarchical Price lesson.)
