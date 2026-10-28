# Lesson 21 — species selection: a trait good for the fish, bad for splitting

**File** · `app/lessons/lesson21.html` — first draft 2026-10-20
**Checks** · `node scripts/check_lesson21_numbers.js` · `python3 scripts/check_lessons.py` · `node scripts/check_layout.js`
**Status** · first draft built (v1, species selection); pass 2 PLANNED (2026-10-28): speciation mechanics; the first draft's material to 22 D; LOCKS `x`
**Last touched** · 2026-10-20

## Pass 2 plan (2026-10-28, proposed, not built): speciation mechanics

JM, 2026-10-28 (verbatim): "Let's plot out lesson 21 & 22 a bit and see if we want to adjust 20 to foreshadow it at all. I'm
thinking of 21 being hard into the mechanics of speciation per se. Bringing back a lot of the stuff of 19 to illustrate allopatric
speciation, the snowballing of incompatibilities, and reinforcement (including inversions and magic traits and recombination as a
race with differentiation)."

The first draft below (species selection: a trait good for the fish, bad for splitting; Price one level up) moves to 22 D, where
the Price equation is the subject (see lesson22_overhaul.md). 21 becomes four stages on 19's ponds and fish (`pd*` engine
rebuilt in 21, 19 untouched), each a step 19 took in passing, now the whole stage:

    A  apart: the snowball. Two ponds, no floods, new alleles (19 C). Two plots against time apart: new alleles that differ (a
       line) and incompatible pairs (a curve that bends up: every new allele can clash with every one from the other pond).
       Controls: mutation, chance a pair is incompatible, fish a pond. A drawn round (REVISIONS row 15): draw incompatible pairs
       against time apart, then 16 runs; the share of the drawn curve inside the cloud. Targets: hybrids fail by a given time,
       by mutation or by time apart (20 B's pair, now at full length); doubling time apart more than doubles the pairs.
    B  contact: reinforcement. The ponds flood together after the snowball (19 A's floods). A choosy allele against hybrids:
       first a one-allele preference (choose a partner like yourself: 20 B's), then a two-allele one (a preference gene and a
       separate signal gene, 19 D's throat). Targets: the choosy allele rises only when hybrids are unfit; with the two-allele
       version the ponds fuse at rates where the one-allele version holds.
    C  recombination as a race. 19 D's dragged genes: a signal locus, a preference locus, a divergently selected (food) locus,
       each placed on the chromosome; crossovers per chromosome a slider. Plots: the association between signal and food (19 D's
       correlation) and F_ST at each, over time; the race drawn as two curves, how fast selection builds the association and
       how fast crossing over breaks it. Targets: hold the ponds apart with the genes far apart (needs low crossing over), fuse
       them with the genes beside each other (high migration), and find the distance where they just hold.
    D  short cuts: inversions and magic traits. An inversion over the block (19 D's toggle) stops crossovers in heterozygotes;
       a magic trait is one gene doing both jobs (the food allele is the mating cue: stickleback body size). Three versions on
       one control set (signal + preference + food apart; the same in an inversion; a magic trait), each scored on the ponds
       still apart after floods every generation. Real data, closed box: Heliconius colour pattern (a magic trait), stickleback
       body size; Drosophila reinforcement (prezygotic isolation stronger between species that meet: Coyne & Orr) as a picture
       only if a dataset can be sourced (none in data/clean; the archived 23's D was a TODO).

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
    20 B   one-allele choosy preference after contact; hybrid fitness landscape and loci grid; the snowball again (B1-B2)

So every piece JM named has been on a page once; 21's job is to put them together as one process and make the part each
skipped the whole stage. Revised against that:

    A  the snowball, counted: the one new thing is the shape (incompatible pairs against time apart bend up; new alleles that
       differ do not). A drawn round on that curve; short, and only if 20 B stops before it (Open 1).
    B  the race: 17 C's fragments and 19 B's F_ST peaks around a gene under divergent selection, now with floods every
       generation: how wide the island of differentiation grows depends on selection against crossing over; genes near the
       first one hitch a ride (divergence hitchhiking). New: the island grows or shrinks over time, and a second gene
       dropped inside it holds better than one outside (16 B's blocks, 17 C's fragments, 19 B's peaks at once).
    C  reinforcement, the three ways in one stage: one-allele (20 B), two-allele (19 D), magic trait (the food gene is the
       cue). New: all three on one set of controls, scored on the same F_ST, so the difference is recombination's alone.
    D  inversions win the race: 16 D's inversion (rare copies itself) placed over 19 D's three genes, now arising by mutation
       in one pond and spreading because it holds the good combination together. New: the inversion's own rise, not a toggle.

Build notes: 19's engine (`pdWorld`, `pdStep`, floods, kinds, preference, inversion) is the base; 20 B's one-allele choosy rule
and its fitness landscape / loci grid carry over. Extract-at-the-third-caller (WORK_ORDER): 19, 20 B and 21 make three callers of
the two-pond engine; extracting it to app/assets/ is worth doing at 21's build, with 19's checks run before and after.

Open for JM:
1. 20 B already does the snowball and a one-allele choosy allele. Move B's reinforcement to 21 B (20 B keeps the snowball and
   the hybrid fitness landscape, ending at the moment of contact, and 21 A opens from that number), or leave 20 B whole and
   start 21 at the two-allele version?
2. A real-data panel for the snowball (Coyne & Orr's Drosophila, hybrid inviability against genetic distance) needs a dataset
   sourced and cleaned; worth it?

## What the lesson is

- A clade of species grows on 20's tree. A dispersal allele helps the fish that carry it, so it rises inside every species; but a species full of dispersers keeps its populations in touch (19's floods), splits less, and lasts longer or shorter. Across the clade the allele can fall while it rises in every species. The change splits into Price's two terms one level up (Simpson's way): species selection (species' births minus deaths against their trait) and the change inside species.
- Worth protecting: the link from dispersal to splitting is not stated; it comes out of migration between a species' populations (19 A). Students find it.

## JM's brief, 2026-10-20 (verbatim, the 21 part; the whole message is in lesson19_overhaul.md)

> And 21 should be on comparative methods and species selection. [...] And by 21, it should be seen species selection, changing the frequency of traits over time as a traits in self-control. Space station and extinction probabilities. [...] The species selection? This one should be tricky. I want to illustrate basically two separate phenomena in this one. Have traits that are advantageous at the individual level, but decrease the likelihood of speciation. We should link this rather explicitly to what you were doing in 19, where we have some trait that allows individuals to spread further and have larger ranges, which makes them less likely the species. It reduces the probability that their population will split. They should be somewhat implicit and not necessarily spelled out for the students directly. They should be able to discover it through the interactions. The idea that would be to track the frequency. What traits over time? and show that within populations, a particular trait may increase in frequency. But his individuals who make who have that treatment, more of themselves than individuals who don't have that treat. With the overall frequency, in the population at large, global form can go down. Species of that trick, don't. So the change in frequency. And as we plotted, as a function of both. The effect on individual level fitness and... A higher order effect on speciation, right? I'd also like this one to explicitly tie into the price equation. to bring it back. So you can see the global change in traits, breaking down kind of Carl Simpson-esque manner. As always, the goal of these activities is not to assess, but rather to illustrate.

Readings: "as a traits in self-control. Space station and extinction probabilities" = as a trait's effect on speciation and extinction probabilities; "less likely the species" = less likely to speciate; "his individuals who make who have that treatment, more of themselves" = as individuals who have that trait make more of themselves; "global form" = global frequency; "Species of that trick, don't" = species with that trait don't [split]; Carl Simpson = species selection by the multilevel Price equation (Simpson & Harnik 2009 crinoids; Simpson 2010).

## As built (first draft, 2026-10-20)

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

## Measured (the page's engine in node, scratchpad nodeEng21.js; three sets of 16 clades)

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

## Open for JM

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

## Items

| # | What | Status |
|---|------|--------|
| 1 | prototype: species with demes (dropped), then species-level with cut-off pieces; Price three ways, exact | done |
| 2 | page: tree, over time, Price, your runs, sister clades; two targets and a drawn round | done |
| 3 | check script (`check_lesson21_numbers.js`, 14 + R) | done |
| 4 | JM's review; voice | todo |

## Rulings

- 2026-10-20: 21 = comparative methods and species selection; a trait good for individuals that lowers speciation (wider ranges, populations split less), linked explicitly to 19; implicit, discovered; within-species rise vs global fall; plotted as a function of the individual effect and the effect on speciation; Price equation, broken down Carl Simpson's way.

## Do not

- Fuse the Price terms into one "leftover" (WORK_ORDER): the three parts stay named apart; that they add to the clade's change is the equation, checked to 1e-12.
- State on screen that dispersal lowers splitting.
