# Lesson 21 — species selection: a trait good for the fish, bad for splitting

**File** · `app/lessons/lesson21.html` — first draft 2026-10-20
**Checks** · `node scripts/check_lesson21_numbers.js` · `python3 scripts/check_lessons.py` · `node scripts/check_layout.js`
**Status** · not started (planned with 19 and 20, JM's 2026-10-20 brief)
**Last touched** · 2026-10-20

## What the lesson is

- A clade of species grows on 20's tree. A dispersal allele helps the fish that carry it, so it rises inside every species; but a species full of dispersers keeps its populations in touch (19's floods), splits less, and lasts longer or shorter. Across the clade the allele can fall while it rises in every species. The change splits into Price's two terms one level up (Simpson's way): species selection (species' births minus deaths against their trait) and the change inside species.
- Worth protecting: the link from dispersal to splitting is not stated; it comes out of migration between a species' populations (19 A). Students find it.

## JM's brief, 2026-10-20 (verbatim, the 21 part; the whole message is in lesson19_overhaul.md)

> And 21 should be on comparative methods and species selection. [...] And by 21, it should be seen species selection, changing the frequency of traits over time as a traits in self-control. Space station and extinction probabilities. [...] The species selection? This one should be tricky. I want to illustrate basically two separate phenomena in this one. Have traits that are advantageous at the individual level, but decrease the likelihood of speciation. We should link this rather explicitly to what you were doing in 19, where we have some trait that allows individuals to spread further and have larger ranges, which makes them less likely the species. It reduces the probability that their population will split. They should be somewhat implicit and not necessarily spelled out for the students directly. They should be able to discover it through the interactions. The idea that would be to track the frequency. What traits over time? and show that within populations, a particular trait may increase in frequency. But his individuals who make who have that treatment, more of themselves than individuals who don't have that treat. With the overall frequency, in the population at large, global form can go down. Species of that trick, don't. So the change in frequency. And as we plotted, as a function of both. The effect on individual level fitness and... A higher order effect on speciation, right? I'd also like this one to explicitly tie into the price equation. to bring it back. So you can see the global change in traits, breaking down kind of Carl Simpson-esque manner. As always, the goal of these activities is not to assess, but rather to illustrate.

Readings: "as a traits in self-control. Space station and extinction probabilities" = as a trait's effect on speciation and extinction probabilities; "less likely the species" = less likely to speciate; "his individuals who make who have that treatment, more of themselves" = as individuals who have that trait make more of themselves; "global form" = global frequency; "Species of that trick, don't" = species with that trait don't [split]; Carl Simpson = species selection by the multilevel Price equation (Simpson & Harnik 2009 crinoids; Simpson 2010).

## Plan (to prototype)

    species    each species: a few populations (demes) with a dispersal allele frequency p. Inside: dispersers do better (s), so p
               rises (lesson 12's s). Between its populations: dispersers carry fish across (19's floods, size ~ p); a population
               left alone long enough becomes a new species (19 A's clock: apart for tau generations, i.e. incompatibilities
               built). Extinction: each population can blink out; a species with more populations (bigger range, more dispersal)
               lasts longer.
    sliders    advantage to a disperser (s); how far dispersers go (sets mixing between a species' populations); chance a
               population is lost; (later) chance a new population is founded
    displays   the clade's tree, branches shaded by p (light = few dispersers, dark = many: lightness, colourblind-safe); over
               time: p inside each species (thin), p across the clade (thick); Price: Delta p = cov(species fitness, p) + E(species
               fitness x Delta p inside), each per interval and summed; species fitness = daughters that survive the interval
    targets    the allele rises in every species and falls overall; both terms the same sign; the covariance term beats the
               inside term; drawn prediction of the clade frequency
    comparative  sister-clade comparison (more dispersers vs fewer: which is the bigger clade?); the fossil horses (data/clean/horse_*)
               as observed data for the decomposition if the tree and ranges support it — to measure first

## Items

| # | What | Status |
|---|------|--------|
| 1 | prototype: species with demes, dispersal -> mixing -> fewer splits; Price terms add to Delta p | todo |
| 2 | page | todo |
| 3 | check script (terms sum to the total; the reversal reachable, not free) | todo |

## Rulings

- 2026-10-20: 21 = comparative methods and species selection; a trait good for individuals that lowers speciation (wider ranges, populations split less), linked explicitly to 19; implicit, discovered; within-species rise vs global fall; plotted as a function of the individual effect and the effect on speciation; Price equation, broken down Carl Simpson's way.

## Do not

- Sum or fuse the two Price terms into one "leftover" (WORK_ORDER: keep cov and the within term named apart).
- State on screen that dispersal lowers splitting.
