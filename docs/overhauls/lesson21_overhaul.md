# Lesson 21 — speciation by sexual selection: who to mate with, magic traits, learned song (planned); first draft: species selection (parked for the hierarchical Price lesson)

**File** · `app/lessons/lesson21.html` — still the first draft of 2026-10-20 (species selection); archive it before the rebuild (item 3)
**Checks** · `node scripts/check_lesson21_numbers.js` (the first draft's) · `python3 scripts/check_lessons.py` · `node scripts/check_layout.js`
**Status** · RE-PLANNED 2026-10-28 (JM's second ruling that day): speciation by sexual selection. The speciation-mechanics plan
of earlier that day is parked below; the first draft's species selection is parked for the hierarchical Price lesson
(`hierarchical_price_plan.md`). JM ruled on Open 1-3 the same day: the best mating rule depends on the bird; birds; two
islands. Nothing built since the first draft; LOCKS `x`
**Last touched** · 2026-10-28

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
| 3 | archive the first draft as `app/archive/lesson21_species_2026-10-20.html` (runnable) + a README note naming its checks at the archiving commit | todo |
| 4 | engine prototype: beak, mating rules, song learning; the Measure first list | todo |

## Rulings

- 2026-10-20: 21 = comparative methods and species selection; a trait good for individuals that lowers speciation (wider ranges, populations split less), linked explicitly to 19; implicit, discovered; within-species rise vs global fall; plotted as a function of the individual effect and the effect on speciation; Price equation, broken down Carl Simpson's way. (Superseded for 21 on 2026-10-28; it stands for the hierarchical Price lesson's species level.)
- 2026-10-28 (second ruling): 21 = speciation, in particular by sexual selection, where different behavioural strategies are optimal for different individuals; magic traits; non-genetic inheritance (bird song); built to flow into 22 (kin selection, gene-level competition); the target lesson is the hierarchical Price lesson (23-25).
- 2026-10-28 (on the plan): "Yes to the bird reading" (the best mating rule depends on the bird); sexual selection alone may fail to split, and the page shows both outcomes ("That's fine"); "Birds, two islands".

## Do not

- Tune 21's engine until sexual selection alone splits a population (Measure first, the first bullet).
- Fuse the Price terms into one "leftover" (WORK_ORDER): the three parts stay named apart; that they add to the clade's change is the equation, checked to 1e-12. (First draft; carries to the hierarchical Price lesson.)
- State on screen that dispersal lowers splitting. (First draft; carries to the hierarchical Price lesson.)
