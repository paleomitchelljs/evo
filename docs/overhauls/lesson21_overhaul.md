# Lesson 21 — species selection: a trait good for the fish, bad for splitting

**File** · `app/lessons/lesson21.html` — first draft 2026-10-20
**Checks** · `node scripts/check_lesson21_numbers.js` · `python3 scripts/check_lessons.py` · `node scripts/check_layout.js`
**Status** · first draft built (v1, scaffold 3: A1-A3); checks green (14 + R, ~1 min); LOCKS `x`; JM to review; voice owed
**Last touched** · 2026-10-20

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
               species (19 A's idea). Lost with chance .002 whatever it carries; the clade's last species never.
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
   generations is a species (19 A). Students see light (few dispersers) branches splitting more.
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
