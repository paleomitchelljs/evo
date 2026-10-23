# Lesson 19 — speciation as a process: pulsed migration, sticklebacks, incompatibilities, mate choice

**File** · `app/lessons/lesson19.html` — pass 4 2026-10-22 (JM's review of pass 3); pass 3 archived as `app/archive/lesson19_v3_2026-10-20.html`, v2 as `lesson19_v2_2026-10-17.html`
**Checks** · `node scripts/check_lesson19_numbers.js` · `python3 scripts/check_lessons.py` · `node scripts/check_layout.js`
**Status** · pass 5 built (JM's second 10-22 review): v5 (A's targets changed), scaffold 14 kept (A1-A3, B1-B4, C1-C3, D1-D4); checks green (40 + four R panels, ~3 min); LOCKS `x`; voice owed (JM to dictate)
**Last touched** · 2026-10-22

## Pass 5 — JM's review, 2026-10-22, evening (verbatim; the scheduler lines in the same paste belong to another project)

> Part A: I don't like the text/numeric targets in the "Target" box. Let's just have them target an average genome-wide Fst and put the "Fst across the genome" graph smaller and directly over the controls with a red box shown.
>
> Part B: Great--though again I'd prefer the text gone & the visual target. A representation of what the final graph (either the dropdown or the Fst across the genome) "should" look like if they're successful. A single representative graph shrunk and unlabeled in the Target panel would work. No text, just an image of what they want & the controls (some locked) to get there.
>
> For the drop-down plot, we should have the dropdown first & "over time" follows it, with 16 runs excluded. The gene legend (triangle Bmp6 & gill raker) currently float over the simulation lines--I'd rather they be to the right of their respective target area.
>
> For C/D, I think the "Fitness Surface" figure should go on the left side to bring the control panel up closer to the DAG. Both should also lose the qualifier after the comma. Just fitness surface with details in the (i)
>
> Also all of the "unlock" messages are unnecessary--eg "All three targets hit. Run any setting you like: 400 generations, 16 times.". The freeing of the controls & "TO FINISH" turning green is sufficient--we can just remove that text from the Target boxes.
>
> Also the "pracitce -- a run with this ticked does not count" should just be "practice"

| # | Stage | What | Status |
|---|-------|------|--------|
| 17 | A | genome graph into the Target card (460 x 150), over the controls; red box = the window; a line at F_ST over the genome; no target text; rounds rebuilt on that one measure | done |
| 18 | A | floods at 1, 1 + T, ... (`P.ph`, `pdFloodAt`): generation 400 is just before a flood for every T (at multiples of T the last flood fell on 400 and cut every run by about (1 - 2m)^2 at the moment it was judged) | done |
| 19 | B | no target text; `B_tpic`, an unlabeled sketch of a hit (`B_picBars`), red boxes on the judged loci, drawn where ▲ and ■ sit now | done |
| 20 | all | "<menu> over time" (menu first, no "16 runs"); line names right of their target windows (`labRoom`) | done |
| 21 | C, D | fitness surface to the left column (last panel); headings "Fitness surface", the rest in the ⓘ; D's start toggle into the card's controls. B's heading the same (not moved) | done |
| 22 | all | no free-play text once a stage is done; practice label "practice" | done |
| 23 | — | check: A's flood timing, A's rounds, the line = the bars' average, B's pictures judged by their own rounds, wordless cards; REVISIONS rows 18-20 | done |

### Measured (pass 5; scratchpad `eng.js`, `measA*.js`: the page's engine lifted into node)

    A  the measure: F_ST over the genome = in each run, the average over the loci of each locus's F_ST, leaving out loci where
       both ponds carry one allele (undefined; counted as 0 they made N 10 read .12 against N 25's .09-.11). The ratio over the
       genome (17's) runs .03-.13 above the drawn bars; this sits within .01 of their mean at every setting measured.
       At 400 (just before a flood), N 25: .2 every 10 .10-.12 (opens 1); every 25 .20-.25; migration .1 .14-.18; .05 .22-.28.
       Floods .2 every 10: N 10 .20-.24, 25 .10-.12, 50 .07, 100 .04. N 10: every 5 .15, every 2 .07, .5 every 10 .16-.19.
       Windows: 1 floods free, .15 or more; 2 N free, .15 or more; 3 N 10, floods free, .17 or less (opens .20-.24).
       Loci left out at 400: N 10 36-54%, N 25 4-14%, N 50 1-2%.

### Open for JM (pass 5)

1. C and D's Target cards still print a sentence and a rules list. Same treatment as A and B (a picture, no words)?
2. B's picture is a sketch of a hit (heights inside the windows, widths read off measured runs), not a run: a run at the
   intended setting would show round 3's answer (the genes side by side). It is drawn where ▲ and ■ sit now, so in round 3
   it shows two peaks until they are moved.
3. A's F_ST is now the bars' average, not lesson 17's ratio over the genome (B-D keep the ratio). The R panel computes the same.
4. B's fitness surface keeps its place (between the diagram and the card); only its heading changed. Move it left too?
5. D's "throat colour at the start" toggle moved into the Target card's controls with the panel's move.
6. Rows 18-20 of `docs/REVISIONS_PLANNED.md`: the same changes for 10-18, 20, 21, counted there. Not applied outside 19.

## Pass 4 — JM's review, 2026-10-22 (verbatim)

> Some revisions to lesson 19: For A, "flood size" should be "migration during flood"
>
> I am also thinking we take out incompaitibilites from Part A. They need to be taught what those are by later stages.
>
> Also crossovers a chromosome should be crossovers per chromosome
>
> Part B: I like the visualization. I think we need to refine a few things. One simple chance: "chance a hybrid lives" as a dropdown should just be "hybrid survival rate". The DAG is also maybe too abstract. Let's anchor this to sticklebacks. They're well studied, and we can reference specific loci. We can also adjust for pedagogical reasons (eg, place real loci at varying unreal positions). They'll also work when we expand to mate choice later. The DAG should show genes influencing phenotypes influencing food pool influencing prob of surviving to reproduce.
>
> Part A is meant to show pulsed migration & Fst across the genome. Part B should be focused on how Fst at (and around) a locus can vary.
>
> Part C should build on Part B by having new mutations arising that produce incompatibilities. This should show hybrid fitness decreasing over time.
>
> Part D should bring in mate choice. A preference for mating with genetically similar individuals resulting from some tractible phenotype (mating display?). Idea is two different mating displays, with two alleles, and the ability to vary h. The student should, through exploring the sliders, find that when mating displays allele correlates with ecology you can separate populations, but when they don't the populations end up fusing (with some ecology phenotype going extinct even if it is very fit locally). The role of both frequent migration, fitness landscapes of hybrids, and recombination should be emphasized here.
>
> Incorporating fitness surfaces where they make sense, even just as a small inset display, is ideal.

### Stages as built (pass 4)

One engine (`pd*`, pass 3's): two ponds of N hermaphrodite fish, one chromosome of 40 loci, young made until N live, floods
every T at the start of a generation (each fish swaps with chance m), F_ST on allele identity, measured on the young.
New: food genes (benthic / limnetic alleles), a diet d (0.5 + the genes' arrows x (benthic share - .5), averaged), food d in
the orange pond and 1 - d in the blue, survival 1 - S (top - food) - v 4 food (1 - food), top = the best-fed fish's food;
a throat gene (red / black, h); choice = turn a partner down with chance choosy x |throat difference|, at most 4 times.

    A  pulsed migration. A's pass 3 start (grey split, mutation in pond colours), no incompatibilities. Sliders: fish a pond,
       mutation, crossovers per chromosome, migration during flood, generations between floods. New panel: F_ST across the
       genome (bars: 16 runs averaged a locus; dots: run 1). Menu: F_ST, alleles from the other pond, diversity. 400 gens.
       Rounds (pass 4, replaced in pass 5: see "Measured (pass 5)"): 1 the last flood lowers F_ST by .12+ (floods free, open
       .2/10); 2 floods .2/25, F_ST at 399 .4+ (N free, open 25); 3 a flood every 10, F_ST at 400 .2+ (migration free, open .2).
    B  sticklebacks, ponds long apart (17 D's start), orange pond benthic (bottom prey), blue limnetic (plankton). ▲ Bmp6
       (pharyngeal teeth) and ■ a gill-raker gene, dragged under the F_ST bars. DAG: gene -> phenotype (grey) -> food pool
       (two settable arrows: how much each trait changes the food a fish gets) -> survives to breed (grey; S .8 fixed).
       Inset: each pond's fitness surface, ▲ genotype x ■ genotype, shade = survival, dots = run 1's fish. Menu: F_ST at the
       genes, every locus, hybrid survival rate, benthic allele at ▲. N 50, 200 gens. Rounds: 1 F_ST .4+ at ▲, < .15 at ■
       (arrows free, open .5/.5); 2 F_ST .42+ averaged over the four loci beside ▲ (crossovers free, open 1); 3 arrows
       .5/.5, floods .1/2: F_ST .3+ at both (genes free, open 10/30); 4 side by side: F_ST < .2 at both (floods free).
    C  B's sticklebacks just after the split (grey neutral loci, genes at 10 and 30 sorted, arrows held .5), mutation; a new
       orange x a new blue allele at different loci incompatible with chance p (pass 3 A's hash rule); each pair costs
       `cost` (red arrow onto survives). Inset: one pair's two-locus fitness surface (3 x 3, each pond's path). "A hybrid,
       up close" (closed). Menu: hybrid survival rate, incompatible pairs, F_ST, alleles from the other pond. N 25 (no
       slider), 400 gens. Rounds: 1 hybrid survival < 20% (mutation, p free; open .002/.02); 2 mutation .004: survival 60%+
       (floods free, open .2/10); 3 floods .2/25 (A round 1's): the last flood lowers F_ST by < .12 (mutation, p, cost free; open .001).
    D  mate choice. Ponds long apart; Bmp6 (locus 20) the one food gene (arrow 1, S .4); the throat gene (♥, dragged; h on
       its arrow); every fish prefers its own throat colour (how choosy on an arrow onto throat colour -> births); hybrid
       valley set by dragging ◐ on the fitness surface (survival vs Bmp6 genotype, a line a pond); throat start matched
       (black benthic, red limnetic) or the same mix (30% black both); inversion (Bmp6 to ♥, orange pond's chromosomes).
       Menu: benthic allele, black-throat allele, throat colour-food correlation, F_ST at the other loci, hybrid survival.
       "What each Bmp6 genotype got" (survived, births, fitness). N 100, 300 gens, 16 runs. Rounds: 1 floods .2 every
       gen, valley .4, matched: both food types left in 10+ of 16 runs (choosy free, open 0); 2 choosy 1: same (start free,
       open same mix); 3 choosy .75, floods .15: correlation .5+ (♥, crossovers, inversion free; open locus 40, R 4); 4 same
       mix, choosy 1: both left in 10+ of 16 (valley and floods free, open .4, .2/1).

### Measured (node prototype of the page's engine, scratchpad `eng.js`, 2026-10-22; per round, in the page's comments)

    A  drop at the last flood: .2/10 .07-.08; .2/25 .15-.20; .2/50 .23-.27; .2/100 .34-.37. F_ST at 399, .2/25: N 10 .52-.61,
       25 .28-.31, 50 .16. F_ST at 400, every 10: m .02 .38-.43, .05 .24-.30, .1 .13-.17, .2 .07. Mutation barely moves F_ST.
    B  (150 gens) arrows 1/0 .56-.65/.02-.08; .5/.5 .42-.50; width (200 gens, 4 loci beside ▲) R .25 .59-.69, .5 .45-.56,
       1 .31-.38, 2 .20-.26; side by side vs far at .5/.5, floods .1/2: .32-.43 vs .13-.27 (coupling, modest).
    C  hybrid survival at 400: food alone .80; mutation .001 .72, .002 .37, .004 .04; floods .2/2 .73 at mutation .004.
       Drop at a .2/25 flood: p 0 .21-.27 (A's), mutation .004 .07-.08. Bigger ponds fall faster (N 10 .52-.66, 100 .07-.15).
    D  (k = looks) k 30: a shared throat splits each pond into two throat "species" (no fusion); k 4-5 fuses. k 4, floods
       .2/1, valley .4: choosy 0 / .5 / .75 lost 16 / 16 / 15 of 16; 1 lost 2-3. Same mix lost 13-15. Valley .1 or 0 lost 0
       (kept runs well mixed, benthic ~.6/.35). Floods .3 every gen fuse everything. Recombination: choosy .75, floods .15:
       correlation beside Bmp6 .98, locus 31 .43-.68, locus 40 .03-.10, locus 40 R 4 .00, + inversion 1.00; on extinction
       at floods .2 it is modest (far R 4 lost 5-9 vs beside 2-3). h 0 / 1: the recessive throat's pond leaks.
    colourblind (Machado 2009, CIE76 ΔE, normal / protan / deutan / tritan): throat red-black 77 / 40 / 60 / 89; food
       light-dark 81 throughout; red throat vs orange pond 35 / 37 / 28 / 14 (they never share a place on the board).

### Open for JM (pass 4)

1. B's genes: Bmp6 is real (pharyngeal teeth, Paxton benthics, chr 21; Cleves et al. 2014). Gill rakers have no named gene
   (QTL on chr 4 and 20; Glazer et al. 2014), so ■ is "a gill-raker gene". The food pool is one box; which food each pond
   holds is in the hover text and the fitness-surface inset. Two settable arrows (trait -> food); food -> survival grey.
2. C: real benthic x limnetic hybrids show little intrinsic incompatibility (Hatfield & Schluter 1999; Thompson et al. 2022
   PLOS Biology: environment-dependent). C is framed as the ponds run on; said in a code comment, not on screen. Fine?
3. C and pond size: bigger ponds lower the hybrid survival rate faster (a pair needs one copy each, so rare new alleles
   count). The opposite of "the faster you fix differences"; fish a pond is held at 25 in C, no slider. Want a version
   where only fixed differences clash?
4. D's choice is a matching rule (prefer your own throat colour), not a separate preference allele. The fusion needs a
   limited search (4 looks): with 30 looks a throat shared by both ponds split each pond into two throat species instead.
   Real stickleback females do hybridise more when their own type is rare; the hover text says "up to 4 times".
5. D's target counts runs where neither food allele is lost. With floods every generation a kept run's ponds are well
   mixed (~.8/.2); the stage is about extinction under fusion (Enos Lake), not full separation.
6. Recombination in D shows mostly on the throat colour-food correlation (round 3, choosiness .75). At full choosiness
   hybrids are too rare for crossing over to matter. The inversion is kept (10-20 brief).
7. Fitness surfaces: B (each pond, teeth x gill rakers), C (one incompatible pair, 3 x 3), D (survival by Bmp6 genotype,
   ◐ draggable). A has none (nothing selects).
8. Still open from pass 3: the course's green/red verdict colours collapse for red-green colourblind eyes (ΔE 10-19);
   19 marks every verdict ✓/✗. A REVISIONS row for 1-18? Not added without your word.

| # | Stage | What | Status |
|---|-------|------|--------|
| 9 | — | overhaul doc, plan; pass 3 archived as `app/archive/lesson19_v3_2026-10-20.html` | done |
| 10 | — | engine: food genes (diet, food, valley), throat gene + matching choice (4 looks), incompatibility cost | done |
| 11 | A | strip incompatibilities; renames; genome bars; measure; rounds | done |
| 12 | B | sticklebacks: genes, DAG, fitness surface, drag; measure; rounds | done |
| 13 | C | mutations + incompatibilities on B; DMI inset; hybrid box; measure; rounds | done |
| 14 | D | throat gene, choice, valley drag, start matched/same; measure; rounds | done |
| 15 | — | R panels; `check_lesson19_numbers.js` rewritten (36 + R); lessons 20/21 "19 A" -> "19 C"; colourblind red/black | done |
| 16 | — | JM's review; voice | todo |

## What the lesson is

- Two ponds; floods now and then mix them. Pulsed migration and F_ST across the genome (A); sticklebacks whose food genes hold F_ST up at and around themselves (B); new mutations that make hybrids fail, until floods stop counting (C); mate choice on a throat colour that separates the ponds when it matches the food and fuses them, losing a food type, when it does not (D).
- Worth protecting: fitness is never set. Survival (ecology, incompatibilities) and births (mate choice) are; fitness is what comes out (JM).

## JM's brief, 2026-10-20 (verbatim, the whole message; 20 and 21 docs quote their parts)

> Ideas to redraft lessons 19, 20, and 21:
>
> I have ideas, lessons, 19, 20, and 21. These 3 lessons are all going to follow the concept of species. 19 should be on speciation as a process. 20 should be on biologics. And 21 should be on comparative methods and species selection. You should build on the previous. So by the end of 19, they should be seen a phylogeny generated through their population diverging. By the end of 20, there should be similar traits along their tree. And by 21, it should be seen species selection, changing the frequency of traits over time as a traits in self-control. Space station and extinction probabilities. For 19, There should be based extensively on the simulation machinery we built up in the migration lesson 17. Specifically, I'd like a scenario in which. They start with one population, and multiple wheels, and they diverge. So we should have a drift-based speciation. Model. where incompatibilities develop. Over time, as species, populations break. I'm imagining a slider that controls the mutation rate. Recombination rate. Migration rate. And the probability that 2 alleals at different low si are incompatible. We'll also need a slider for, uh, how often migration pulses can occur. I think setting this up. With an example like fish in ponds, where every time there's a flood, fish can move across ponds and intermingle, whereas in non-flood years, they're restricted. There's a good system. And we have just sort of periodic flood, some frequency. We track introgression rates over time and FST over time. And when the pulses, the goal is to have it such that the pulses no longer change FST, no longer decrease FST, no longer increase in progression. Because once the pulses no longer have an effect on SST, then You've got to Different populations. Attract their neutral diversity over time as well. Imagine like a drop down toward Target. Um, The other big one I want for the speciation. It's probably going to be part what I just described should be part A. Part D should be a more interactive one based more explicitly on low side. I'm imagining a situation where you have a focal locus. With 2 alleles, A and B with 2 different colors. And each genotype gives you a different phenotype. So AA gives you one phenotype, AB, gives you another phenotype. BB gives you a 3rd phenotype, and students can adjust H to modulate what the intermediate, the header as I go phenotype is. Uh, and the students can manipulate the fitness of each tree type. So it'd be a causal diagram with genotype, phenotype, phenotype, to fitness. Maybe that would be part C and part D would add another layer where we have a mate preference allel. Where you can prefer at some frequency, different phenotypes. So there is a, Survival aspect about how well they live, and a reproductive birth rate aspect for how many offspring they have. Make choice affects birth rate. Uh, phenotype. The insight would affect birth rate by a mate choice and survival. Probability. Um, by ecology, basically. You would have. The main choice of Leo located different positions on the chromosome. relative to the, uh, relative to the trait inducing, allel. And we could even have an inversion, and at least some targets are given the option to invert it. to lock them together. Importantly, fitness would be a derived characteristic in this one, actually. So we should have survival, and mate choice, as our two things, and fitness is the number of offspring who survive. So we track those 2 things separately. I think that's the better way to do it. Instead of having students set fitness. Fitness is the outcome of survival and mating probability. So for earlier activities. Mating is random. With respect to phenotype, and only survivals effective like being a type, and then the ladder one, the ladder a classic, we have mating success also impacted by phenotype. But, at some different allel that has a preference. So the same phenotype is driving both, but the heritability is different. This way, we can get at reinforcement, and we can get at the key aspects of how unsteady it is. We'd also need for the speciation activities, a strong effect, or a way to illustrate the effect of just drift being required to build up incompatibilities. So especially for the early activities, affect the population size and mutation rate are important. The faster you're fixing differences, Well, more likely they are to be incompatible when they come back. So it's kind of my visions for A, D is the full sweet C is the medium, and B would be something intermediate between them for less than 19. For less than 20. We take the speciation results and build them up with more than two populations. [... 20 and 21: see lesson20_overhaul.md, lesson21_overhaul.md ...] As always, the goal of these activities is not to assess, but rather to illustrate. It helps build intuition in the students. You should be extremely low text. I'm sure rely on visuals instead of words, wherever possible. Thing to be aware of is, There are a few colorblind students in the class. I want to be, making sure we're using symbols and colors that work well. for them.

Readings of the speech-to-text: wheels / alleals = alleles; low si / low side / Leo = loci; SST = F_ST; in progression = introgression; Attract = Track; header as I go = heterozygote; tree type = genotype; Make choice = mate choice; ladder = latter; sweet = suite; unsteady = unstable (read as: reinforcement is fragile); "drop down toward Target" = a drop-down to choose what the plot shows (17's and 19 v2's watch menu).

## Rulings

- 2026-10-20: 19 speciation as a process, built on 17's machinery; one population with many alleles diverging by drift; incompatibilities; sliders for mutation, recombination, migration, the chance two alleles at different loci are incompatible, how often floods come. Fish in ponds, floods. Track introgression, F_ST, neutral diversity; a drop-down. The goal: floods stop changing F_ST and introgression.
- 2026-10-20: C = focal locus, AA/AB/BB phenotypes, h sets the heterozygote, genotype -> phenotype -> fitness diagram, mating random. D = a preference allele at another locus, placed on the chromosome; an inversion in some targets. Fitness derived: survival and mate choice set, fitness = offspring that survive.
- 2026-10-20: illustrate, not assess; extremely low text; colourblind students: symbols and colours that work for them.
- 2026-10-22: A = pulsed migration and F_ST across the genome, no incompatibilities; "migration during flood", "crossovers per chromosome". B = sticklebacks, real loci at unreal positions, genes -> phenotypes -> food pool -> survival; F_ST at and around a locus; "hybrid survival rate". C = new mutations make incompatibilities, hybrid fitness falls over time. D = mate choice on a display (two alleles, h); matched to ecology separates, not matched fuses with a locally fit type lost; frequent migration, hybrid fitness landscapes, recombination. Fitness surfaces as insets where they make sense.
- 2026-10-17 (pass 2): more "students draw what they expect"; bowling stays.

## Do not

- Set fitness anywhere in B-D: survival and births are set; fitness is read off the run.
- Code a food type or a throat by hue alone: food by lightness and ○ ◐ ●, throat red to black (lightness carries it).
- Put incompatibilities back in A (JM, 2026-10-22: "They need to be taught what those are by later stages").
- Give D's fish unlimited looks: with 30, a shared throat makes two species inside each pond and nothing fuses.
- Measure a flood on the adults it moved (the dip is mechanical); measure it on the young it leaves.

## Pass 3 (v3, 2026-10-20, archived as app/archive/lesson19_v3_2026-10-20.html)

A ponds and floods with lethal dominant incompatibilities by drift until floods stopped mattering (4 rounds); B one
incompatible pair placed by drag, its cost on an arrow; C a light/dark trait locus with h and signed survival arrows a pond,
births at random, fitness derived; D a one-copy choosy allele placed by drag, preferring a look, with an inversion. Its
measurements, prototype notes (scratchpad `pond.js`) and open points are in git history (this file before 2026-10-22).
Carried forward: lethal dominant pairs were needed to beat floods (recessive never did); N barely set the pace (Orr & Orr
1996); a two-allele preference ran away to one preference in both ponds.

## Pass 1-2 (v2, 2026-10-17, archived)

A split/apart/contact as four drawn rounds; B two pinned pairs + a draggable inversion on 17's start (R 4); C one-allele choosy at N 100 with 17 C's gene 20. Measurements and dead ends kept in git history (this file before 2026-10-20). Carried forward: islands need R 4 on one 40-locus chromosome; reinforcement without local adaptation runs backwards (choosy migrants breed true abroad, F_ST falls); N 25 drift swamps a choosy allele; 3-try mate search barely moves it.
