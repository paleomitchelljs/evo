# Lesson 13 — selection as regression

**File** · `app/lessons/lesson13.html` — rebuild from zero
**Checks** · `node scripts/check_lesson13_numbers.js` · `python3 scripts/check_lessons.py`
**Status** · A-D (`version: 13`, `scaffold: 25`: one bit per scored attempt, D ten targets; uncommitted). 2026-09-29: old C, D, E archived, C/D rebuilt on JM's DAG; 2026-09-30: E (mediator/confounder) and F (collider) archived; locked; prose to come from JM
**Last touched** · 2026-09-30


## Study mode (JM, 2026-10-08)

- The `score:bypass` handler skips `game.show()` when `Score.isStudy()`: study mode opens every stage and leaves the targets to be done; the instructor bypass still fills them. Done; REVISIONS_PLANNED row 13.

## Revision 2026-09-29 (JM's review of v11)

- JM: A solid. B solid, *"though I think butterfly count or spread could use slightly more constrained--it's a bit too easy to just set the butterfly on the target with narrow preference spread."*
- JM: C/D *"good but too arcane and superseded by the new parts A and B ... they seem archivable."*
- JM on E: *"The targets are often much too directly tied to the sliders themselves."* New E: predict where the phenotype ends up; start and target distributions; *"Parent Traits -> Seeds -> Children Traits <- Other factors"*, Parent → Seeds = cov(w, z), Seeds → Children and Other → Children = E(wΔz) (*"if I am missing something here, please critically assess"*); the field drawn by stem height / flower size; a line plot of each trait over time; the DAG the only control; the two terms as densities on a shared axis; roll.
- Measured, B: a count cap and a wider minimum spread do nothing. Butterflies alone on the window, best of five backgrounds, 6 runs: orange and purple **100%** at every cap tried (10, 5, 4, 3) and every minimum spread (0.25, 1, 1.5, 2, 2.5, 3). A lone bell curve is a peak the meadow climbs wherever it sits. On the window they already miss still and past (0%).
- So B: orange and purple now **hold the butterflies** (5, liking the middle: 5.5 ± 1.5 for orange, 4.5 ± 1.5 for purple). Edge-only settings that hit ≥ 75% (4 runs, 210 tried): orange 4 (hummingbirds 6 at 2.5, 8 at 3, 8 at 3.5, 10 at 3.5); purple 5 (bees 6 at 7, 8 at 6.5, 10 at 6.5, …). Every round now holds one kind.
- DAG, assessed: the chain as first sent has no road from a parent's trait to its seedling's trait except through how many seeds it set. Taken as drawn, selection off means seedlings stop resembling parents, and selection on means E(wΔz) cancels cov(w, z) exactly (the painted flowers: cov 0.29, E(wΔz) −0.29, change 0.0015).
- **JM's second DAG, same day (built):** *"a major teaching point here should be that the numbers they practiced with (cov(w,z), E(wdz)) explain it all via their inputs ... Parent's Genetics -> Parent's traits <- Parent's environment; Parent's traits -> Seed number; Parent's genetics -> Offspring genetics -> Offspring traits <- Offspring environment. To not hide the causal chain, as what all goes into the E(wdz) term will be important later."* And: *"environment to have shared and unshared effects on each trait, as well as genetics having shared & unshared effects ... pleiotropy ... fall[s] out easily ... Maybe one trait DAG or no shared genetic/environmental influence for C, then adding the shared effects or second trait in part D?"*
- The terms, split by the diagram's inputs (exact every generation; E_w = average over parents counted once per seedling):
  - cov(w, z)/w̄ = genes' arrow × (E_w[genes] − mean) + environment's arrow × (E_w[env] − mean)
  - E(wΔz)/w̄ = − the environment's part of cov (the parents' environment, not passed on) + the seedlings' environment against the parents' (a round's wet year) + which copies each seed got (0 give or take)
  - expected a generation: genes b a²/W0, environment b s²/W0, E(wΔz) −b s²/W0 (+ the shift once)
- Built: one engine (`PD_`) for C and D. 400 plants, 50 genes a set (two copies, the value put on the start's scale), environment a fresh normal draw, made exactly unrelated to the genes in the start; seeds W0 20 + arrows, Poisson; both parents drawn by seeds; 10 generations. Genes → trait and environment → trait are paths.js tiers (one control, both generations); parent's genes → seedling's genes is drawn, "copied", not a control.
- C: one trait (stem height); arrows genes, environment (0-1.5), stem → seeds (−8..8). A round may deal the seedlings a wet year (shown on their environment box).
- D: flower size added; the same genes box and environment box reach both traits (four signed arrows) plus both seeds arrows. No arrow between the traits. One genes box means the two responses keep the genes arrows' ratio whichever trait is selected (measured 0.80 for arrows 0.8/1.0 either way); a second genes box would let each trait keep genes of its own — offered to JM.
- The card: per trait, the start's density, the target window, where cov(w, z) alone takes it (dashed), where both terms take it (dashed, before a run), the generation on screen (filled); A's three arrows over it, cov(w, z) in two colours (genes, environment). The field: start | generation, stems as tall as stem height, heads as wide as flower size, target band on the stems, flower target as two reference heads. By generation: each trait's average and each generation's terms.
- JM, later the same evening: *"cov(w,z) and E(wdz) shouldn't be kept secret. Manipulating the arrows in the DAG should directly show the students how the numbers are changing (or their expectation given stochasticity). Students shouldn't see how the expected trait value moves"*; *"The price terms density plots are way too messy--we don't need to show the lines for each individual and the labels shouldn't overlap the density curves"*; *"Let's not even show students the actual numbers below the plot--it's too many. Let the DAG carry them."* Built: the card's top strip is a generation's cov(w, z) and E(wΔz) as bells (24 trial generations, the environment drawn afresh each time, so the bells spread like a run's own generations: ±0.045 vs ±0.041), live in every mode; a run's generations land as dots. No expected end curve, no expected path, no Δz before a run, no text under the card. The diagram's trait boxes carry cov(w, z) (parents) and E(wΔz) (seedlings), redrawn as the arrows move (the arrows had not redrawn during a drag at all before this).
- JM: *"adding two causal arrows to 'seeds': birth rate & death rate. Then traits can link to the two separately ... Both birth and death get a random effect leading to them ... This opens up tradeoff models and eventually sexual selection, too."* Built: births 30 + arrows + chance, deaths 10 + arrows + chance, seeds set = births − deaths (fixed + and − arrows); chance 0-8, 2 by default. Rounds hold death arrows at 0 and chance at 2, so the free seeds arrow is births and the calibration carries over (re-measured). Trade-off rounds not built: freeing birth and death together lets one setting answer several rounds (the composite trap).
- JM asked whether the genes/environment split of cov(w, z) is right, or "more like drift". It is exact (z is linear in genes and environment, so the covariance splits). Each part has a selection piece set by the arrows (genes b a²/20, environment b s²/20 a generation) and a chance piece: with no selection the genes' part averages 0 ± 0.039 a generation (that is drift, and it is passed on) and the environment's 0 ± 0.018 (taken back by E(wΔz)). Chance on the rates adds to the drift, but little: at 8 on each rate the genes' part wobbles 15% more over a run's generations (0.046 vs 0.040; 1.33× in a first generation from the start). Most drift is which seeds become the 400 seedlings.
- Prototype (N 200, 40 runs a case): the end change is ~0.94 of the expected (the genes' spread is spent); a run's end wobbles 0.2 at N 200, so N 400 (0.1-0.2) and windows ± 0.3-0.4. The checks pool: realized ÷ expected 0.98.
- `pageSeed` gives every check run a new start, so rounds were calibrated over 8 start populations × 4 runs, not one page (one-page windows hit 65-70% on the next page).
- Composite settings: rounds that each free a *different* single arrow can all be cleared by one setting made of their answers (D's first set: 4 of 85 random settings cleared three). Fixed by freeing the same arrow (flower → seeds) in every one-arrow round of D, at values that do not overlap; in C, the drought became a wet year so its seeds arrow is negative.
- Archived as `app/archive/lesson13_2026-09-29.html` (the whole page at 287e3e0, all seven stages, runnable). Old E's least squares goes with it; E (old F) is now the first stage that fits arrows to a cloud; its setup bullet now says what an arrow is.

Second of three selection lessons: 12 the genetics (`lesson12_overhaul.md`), this the regression, then birth–death and DAGs (planned at the end of this doc until it has a slot).

## What it is

- JM, 2026-09-24: *"keeping two things: explicit exploration of covariance as a concept, to build in the Price equation and help students understand its terms for later, and the idea of a regression model based on a causal diagram (arrow = slope, residuals = the 'other' box in the DAG). I would also like to build up the ideas of mediators, confounders, and colliders."*
- Supersedes the 2026-09-22 plan (one trait on a moving landscape). Its specialisation numbers are kept below, with the birth–death framework.
- Additive genetic variation and the response to selection (C) added 2026-09-24.
- New opening stage added 2026-09-29 (JM): lesson 12 A's meadow on a continuous colour, as the intuitive road into the covariance picture. The old A-E became B-F, code and checks renamed with them.
- Later 2026-09-29 (JM): a Price-equation demo takes A; the meadow is B and everything after shifts again (C-G). *"they'll need to be cut/consolidated later but I haven't decided how yet."*

## Candidate stages (provisional)

JM, 2026-09-24: *"let's have selection as three lessons (genetics, regression, and birth-death/DAGs). We'll add a frequency dependent one later, probably as 15."* So this lesson is the regression one; the birth–death framework and the two-trait stages are the third lesson's (below, until it has a slot).

    A  the Price demo: things that make more (cov) / of themselves (E(wΔz)) / become more common (Δz)
    B  the meadow: visitors make a fitness landscape; where does the colour end up (every round holds one kind)
    C  the diagram behind the two terms: genes and environment, parents and seedlings, one trait (2026-09-29)
    D  a second trait on the same diagram: shared and unshared genes and environment (2026-09-29)
    archived 2026-09-29: covariance (was C), what responds (was D), the least-squares diagram (was E)
    archived 2026-09-30: mediator / confounder, collider (were E, F; F, G in the archive file)

### A — the Price equation, two routes (2026-09-29)

- JM, 2026-09-29: *"a 'Price equation demo'. The idea is that the Price equation has two terms: sorting (who reproduces) and changing (how much do offspring differ from parents; transmission bias) ... a two-step set of activities where students see a population with 0 transmission bias, and realize that the correlation between survival/reproduction & trait is the covariance(w,z) ... The second stage would be where all differential reproduction is removed--everyone reproduces exactly two times--but now there's a transmission bias."*
- JM: *"This stage wouldn't need intense questioning or too elaborate simulations. This is meant more to build understanding in prep for the flower activity ... and later activities (... altruism, species selection, the origin of individuality ...)."*
- JM's frame: *"things that make more of themselves become more common"* → "things making more" (sorting, cov(w, z)), "of themselves" (transmission, E(wΔz)), "become more common" (Δz).
- Plan: ten flowers on B's colour ramp, deterministic, direct manipulation, one picture.
  - Step 1, offspring copy their parent: click a column above a flower to set its offspring, 0-5. E(wΔz) is 0 by construction.
  - Step 2, every flower makes two: drag a family sideways to change its colour; drag the ramp to move all. cov(w, z) is 0 by construction.
  - Card: colour axis with parents' and offspring's averages; three arrows, cov(w, z) from the parents' average, E(wΔz) from its tip, Δz under both; target window on the offspring's average. w = offspring ÷ the average, as in B.
  - Rounds (freeFirst, practice; the round holds the step): purple 5.8-6.2 / orange 3.3-3.7 / three flowers make none, average 4.9-5.1 (step 1); purple 5.8-6.2 again / every family ≥ 0.5 from its parent, average 4.9-5.1 (step 2). The two "stays put" rounds are the point: unequal offspring move nothing unless they track colour; offspring that differ move nothing unless they differ one way on average.
  - Parents: mirrored pairs (z and 10 − z) at 0.1 resolution, so the average is exactly 5.00.
  - Voice (proposed, JM to replace): 202_lec15_03 + 202_lec05_06; solved banner 202_lec30_02 (prions: "fold more quickly" / "fold with higher fidelity").

### B — the meadow, on a continuous colour (2026-09-29)

- JM, 2026-09-29: *"a sort of copy of lesson 12's Part A. Except I'd like to (1) change from a single locus trait with explicit genes to a continuous trait (flower color ranging along this color ramp: ['#7f3b08', ..., '#2d004b']), (2) a third pollinator (butterflies), (3) the activity would have a control panel that's the same as the current 12.A one but with the necessary adjustments, (4) a "fitness landscape" produced by the setting of pollinator preferences/numbers, and (5) the goal is to predict final frequencies in the population, with the key terms of the price equation (cov(w,z) and E(dz*w)) shown visually as a function of the fitness landscape & parameters (the trait is assumed to be the result of additive genetic variation with some small random component to it, too). The idea would be to help bridge to the more arcane current visualization of cov(w,z) in the current 13A."*
- JM on the first build, same day: target = the meadow's **average colour**, on *"something like the fitness landscape from the latter part of 12, with individual points shown occupying different positions in the final round from the initial"*; Price terms kept (*"that's going to be recurring"*); *"all flowers are interfertile, but visitors should actively influence the offspring"*; *"the option for dying — the collapse of variation is a key conceptual point, and if a 'good' set of variants is lost that's important"*; *"something like 100 loci, each with two alleles (one increasing purple value, one increasing orange value) ... basically a pure additive state."*
- Model (rebuilt): colour 0 (darkest orange) to 10 (darkest purple); class c = [c−1, c) in ramp colour c. 100 genes, two copies, each copy purple or orange; colour = 5 + 0.08 × (purple − orange copies) + a random part sd 0.5, clipped 0-10. Purely additive. 0.08 a copy, not 0.05: at 0.05 the 200 copies span 0-10 exactly but the start's inherited spread is 0.35 and a third of the variation inherited. At 0.08: spread 1.13, inherited share ~0.8; 162+ purple copies = darkest.
- Visitors, 12 A's rules: each calls on a flower it chooses 8 times a season, others at 0.1, over a ramp 2 colours wide; hummingbirds 0 to an edge, bees an edge to 10. **Butterflies a bell curve** (JM 2026-09-29: *"a roughly normal distribution--so the students position their mean preference & spread using the same slider mechanic"*): a handle on the favourite, two small mirrored handles at ± one spread (0.25-4), down to the same 0.1 floor. A bell curve cannot be flat, so the opening has no butterflies. No seeds without visits.
- A generation: a seed = (kind, flower), drawn in proportion to visits; its pollen parent drawn from that kind's calls. Absolute fitness: next year's flowers = min(200, Binomial(seeds, 1/16)). The meadow can shrink, crash, die. JM: *"so long as the population doesn't easily crash & the genetic variation to reach both extremes does exist"*: over 300 random settings, 1 in 24 left 9 under 50 flowers (3 died), 1 in 16 left 6 (2 died), so 16. Both ends reachable at either: bees 10 at 8.5 → 9.5, hummingbirds 10 at 1.5 → 0.45.
- Price per generation, exact: w = seedlings parented as mother or pollen parent (w̄ = 2 × next ÷ this year's flowers); expected paternity = own visits, so the landscape is the shape of w.
- Panels: meadow (empty ground as it shrinks; a 100-bar gene strip; genes still varying); by generation (flowers of each colour stacked, so height = meadow size; the two terms as bars); map (counts + edges, no landscape); **card = the landscape with every flower stacked on it, the start in grey, the average window in red, start and now averages as triangles.** (JM cut the one-generation panel, the replacement line and the card title as chart junk.)
- Target: the average colour after 20 generations in a window, **and at least 100 flowers left** (a meadow crashed to 7 flowers with no gene varying sat at 8.0, inside the "few" window).

### Archived 2026-09-29 — covariance (was C)

- JM, 2026-09-24, on the style: *"the recent design philosophy (diverse interactives, bowling games, practice rounds, etc) and any new, bespoke types of parts that make sense."*
- JM's idea: *"two plots, and when one is distorted the other distorts, and they try to get the two to match some target with rounds varying based on the covariance strength ... I'm not sure it would build up to the hierarchical nature of the Price equation."*
- **Recommended form, and why it does build to the hierarchical Price.** Left: every parent as a dot, trait across, offspring count up; the student distorts the *fitness* (drags a line or curve through the cloud, or grabs points). Right: the trait distribution twice, parents and offspring-weighted; it distorts as the left is dragged, and the gap between the two means is `cov(w, z)/w̄`, exactly, every frame. Rounds deal a shift to hit; what varies between rounds is the trait's **spread**, so one slope gives different shifts (`cov = slope × variance`: selection needs variation). Bowling, practice switch.
- The hierarchy comes from two extras seeded here: (1) covariance drawn as signed rectangles, one per dot, `(z − z̄)(w − w̄)`, so it is an area the student can see; (2) dots coloured by group from the start, doing nothing yet. Late-20s, the same picture splits the rectangles into between-group (group means) and within-group parts: the multilevel Price term is the same drawing with a partition, not a new apparatus.
- Risk to guard: linked plots can become a toy with no measurable target. The target must be the shift (the selection term), measured off the dots.
- The Price covariance term on screen: offspring count against trait, the covariance as a number, measured.
- The painted-flower contrast, measured 2026-09-22 (400 individuals, 12 additive loci, steady push, 120 generations, per parent):

                                  cov(w,z)/w   E(w·dz)/w   change   trait
      inherited                      0.0941      0.0051    0.0992   12.00 -> 23.90
      re-rolled each generation      0.2905     -0.2890    0.0015   12.00 -> 11.77

- Identity exact every generation. Three times the covariance and goes nowhere: `202_lec16_01` painted flowers, `202_lec15_05` puppy tails.
- `priceTerms` is in lessons 10 and 11, **called by neither, never run**. Check it against a hand computation.

### Archived 2026-09-29 — additive genetic variation, and what responds (was D; its R = Va β point now lives in C)

- JM, 2026-09-24: *"The regression one should also include a bit on additive genetic variation and the fact that R=Va regardless of S should be discovered by students (I'm imagining them making a plot point-by-point where they use interactives to try and force change by ratcheting up selection strength only to find that the response correlates with the heritability variation amount)."*
- **Stated so it holds:** `R = h² S` — response does grow with S. What holds regardless of S: no additive variance, no response at any S; per unit of selection the response is set by the heritable variation, `R/S = h² = Va/Vp`. With selection strength as the fitness slope `β` (the line A's student drags), `R = Va β`, exactly, for an additive trait. The discoverable fact: **each population's points fall on a line whose slope is its Va.** Ratcheting strength slides along the line; only more Va steepens it.
- The bespoke part: a plot built point by point. Each run = one generation at a strength the student sets; the page adds a point (strength, response) for that population. Populations dealt with the same total variance and different Va, so the same push gives the same S and different R.
- Built 2026-09-24 as: x = how far the parents who bred moved (Stage B's shift, `S`), y = how far the offspring moved (`R`). Stage B is the line `R = S` (offspring copied parents), drawn dashed. Each population's line through the origin has slope h². Selection strength is the slope of B's line, so the x axis is measured, not set.
- The inherited share is hidden until that population's scored run, then shown beside the fitted slope. After the five rounds an inherited-share slider opens: at 0 the line lies flat at every slope.
- Not built: "one population cannot reach it at the slider's stop" (a round that cannot be hit is a trap). Multi-generation extension: strong selection spends Va, and the response decays (2026-09-22: spread 1.65 against 2.07 after 300 generations).
- Lesson 8 is the bridge: the slope of offspring on mid-parent is the heritability (JM's ruling, lesson 8), and it is the same `h²` that sets `R/S` here.

### Archived 2026-09-29 — the regression is the diagram (was E)

- JM: *"arrow = slope, residuals = the 'other' box in the DAG."*
- `paths.js` already binds each arrow of a fixed diagram to a slider. `buildArrows` draws one. Lesson 7's model diagram is the precedent in 1-10.
- Lesson 8 D already fits **one** arrow and an "other factors" band to one cloud. So C is two causes: flower size and stem height → seeds set, plus other causes. What it adds: a one-trait picture's spread is not the other box, because it holds the other trait's arrow too; and the least-squares arrows are the ones whose leftover leans on neither trait, with the leftover's spread as the box.
- Built 2026-09-24: the diagram (`paths.js`, signed arrows) is the controls. Two one-trait plots, each with the diagram's line and the band it expects there (`sqrt(other arrow² × var + box²)`). A leftover histogram against the box's curve, with its lean on each trait printed; live in practice, after Go in a round. Go grows seeds from the student's diagram on the same plants, as hollow dots over the real ones. A round is judged against the least-squares fit of that round's own plants, ±0.5 on each of the three.
- The traits are made exactly unrelated in every sample (C's one-trait slopes = the arrows). D breaks that on purpose.

### E — mediator, confounder; F — collider (were F, G until 2026-09-29)

- On the diagram C builds. Mediator: allele → trait → fitness. Confounder: one allele → two traits, one of which does nothing, and it still correlates with fitness. Collider: to build, and to measure what selecting on it does.
- Built 2026-09-24 (mediator + confounder): C's machinery with an allele (0/1/2 copies) behind flower size and stem height; those two arrows are dealt and held, the student sets the four arrows into seeds. Each picture draws the slope the **whole** diagram implies there, `Σ bⱼ cov(xⱼ, xₖ)/var(xₖ)`, so stem's picture tilts with stem's arrow at 0 (confounder) and the allele's picture tilts with the allele's own arrow at 0 (mediator). Rounds: confounder, mediator, hidden pair (+2 / −2, the allele's picture flat), the allele's own arrow, all three.
- The collider does not fit a "find the arrows" game: least squares on survivors is simply wrong about the arrows, and the page cannot judge against it. Planned as its own stage (F): flower size and stem height unrelated at birth; survival needs enough of the two together; among survivors they trade off. Bowling: set how hard the drought selects to hit a dealt trade-off slope among survivors. The point: selection manufactures a trade-off no allele made.

## The third selection lesson — birth–death and DAGs (no slot yet)

Takes slot 14 when it is built; the placeholder drafts from 14 up shift then (JM: they are an arc sketch, not plans). Planned here until then.

### Births and deaths on a diagram

- JM: *"a trait that causes changes to the birth rate and causes changes to the death rate ... as mediated by something like carrying capacity ... they can adjust the arrows. The arrows exist. They can't take them away or add them ... 0 it's just a line ... positive, it's blue and negative, it's red."*
- JM: *"we haven't done carrying capacities and net growth rate, but r versus K. But we may need 2 parts to build that."* So r and K first, then the trait on them.
- Then the trait driven by one allele, or several (12's machinery).
- Kept from 2026-09-22: after 300 generations on a peak, strong selection leaves spread 1.65, weak 2.07; move the optimum and the bottleneck is 3 against 105. 25% more variation, 35× the headcount. Nothing went extinct in 20 runs; the extinction bar needs sweeping.
- 12 C (the valley) can move onto this framework once it exists.

### Two traits

- JM: *"2 traits, both caused by the same allele. 2 traits caused by different alleles ... trade-offs ... some single allele that pleiotropically causes 2 traits. One has a positive effect, one has a negative effect. And you sort of run it through. And see where the allele's frequency ends up."*

## Items

| # | Stage | What | Status |
|---|-------|------|--------|
| 1 | — | new page from lesson 12's furniture; the old mutation–selection draft retired (its content goes to lesson 12 D) | done |
| 1a | — | shift A-E → B-F: ids, prefixes, gates, BIT, check script; `version: 10`, `scaffold: 6`; 47 bars still pass (checked before A went in); cross-references in lesson 14 and the 14/16 docs repointed | done |
| 1b | B | (superseded by 1g) model: 200 flowers, 10 loci + random part, three visitors, seeds → seedlings, 20 generations; Price terms per generation | done |
| 1c | B | map (12 A's, adjusted): three count columns, three preference rows (butterflies two handles), live landscape over the meadow's colours, colour ramp strip | done |
| 1d | B | meadow animation; this-generation panel (scatter + line + zoomed arrows + three distributions); by-generation panel; card histogram + target | done |
| 1e | B | rounds (freeFirst, practice, lesson 12's `mountRounds` ported in with `plot`): orange / purple / still / past / darkest | done |
| 1f | B | checks (11 new, 58 in all): landscape = hand rule and = mean seeds, Price identity per generation by hand, pull-back, rounds hit / opening and no visitors miss / cheap routes miss / none clears three, map drag, card count, practice | done |
| 1g | B | JM's revision: average-colour target on a landscape card (flowers stacked, start in grey); 100 additive genes; visitor-borne pollen; absolute fitness (1 seed in 24, room for 200, can die); ≥ 100 flowers to count | done |
| 1h | B | new rounds orange / purple / still / past / few; checks rewritten (15 for A, 62 in all): genes add up, one seed in 24, pollen by kind, crash strips genes | done |
| 1i | B | butterflies a bell curve (favourite + spread handles); one seed in 16; few holds 2 bees + 1 butterfly; answers and cheap routes re-measured; pushed for JM's live test | done |
| 1j | B | JM after the live look: this-generation panel (scatter + distributions) cut; the chart under the colour bars labelled cov(w, z) (who reproduced), E(wΔz) (inheritance, then transmission bias, written E(wΔz) not E(Δz, w): JM, same day), Δz (change this generation), with w = offspring ÷ the meadow's average; replacement line and card title cut | done |
| 2 | C | covariance, linked plots: parents as dots (trait across, offspring up) under a fitness line the student tilts by dragging; the offspring's trait distribution beside it; the gap between the means is `cov(w, z)/w̄`, printed beside `slope × variance` | done |
| 3 | C | covariance drawn as one signed rectangle per dot; dots coloured by group, doing nothing yet (seed for the late-20s multilevel Price) | done |
| 4 | C | rounds: a dealt shift of the mean in populations of different spread; Go draws each parent's actual offspring (Poisson), controls locked; practice switch. In a scored round the offspring distribution waits for Go; with practice ticked it moves live as the line is dragged | done |
| 5 | C | checks: identity to 1e-14, rectangles = covariance, shift grows with variance at one slope, rounds, slope 0 misses, no slope clears three, drag | done |
| 6 | D | one generation, 2000 parents, inherited value + the rest; parents picked in pairs off B's line; child = midparent + segregation + fresh rest | done |
| 7 | D | the point-by-point plot: (S, R) per run, practice included, one colour per population, each population's fitted line; B's `R = S` line for reference; bottom plot parents / parents counted once per child / offspring | done |
| 8 | D | rounds: a dealt response in a population with hidden h² (0.9, 0.8, 0.6, 0.4, 0.9); share revealed after its scored run; free h² after the rounds; practice switch | done |
| 9 | D | checks: R/S = h² at five h², no response at h² 0 at the stops, variance held at slope 0, one slope = one S everywhere, printed arithmetic, rounds, reveal | done |
| 10 | E | two traits → seeds, the diagram as controls; one-trait plots with the diagram's line and band; leftover plot; Go grows the diagram's seeds; rounds against least squares; free "New plants" after | done |
| 11 | E | checks: least squares vs a hand solve, leftover leans on nothing at the fit and is smallest there, one-trait slope = arrow, band formula = measured spread, bands ~2/3, rounds, opening and "box off one picture" miss, no diagram clears three, leftover hidden in a round | done |
| 12 | F | allele → flower, allele → stem dealt; four arrows into seeds; pictures draw the whole diagram's implied line; rounds confounder / mediator / hidden pair / allele itself / all three | done |
| 13 | F | checks: 4×4 hand solve, leftover leans on none, implied line = each picture's own at the fit, confounded and mediated slopes shown, bands, rounds, "arrows off pictures" misses all five, greediest of 63869 clears one | done |
| 14 | G | collider: 2000 seedlings, traits exactly unrelated; survival = dealt arrows + luck 0.5, the drought kills a set share; student sets the share to leave a dealt slope among survivors; the dead fade on Go; a point per run (share killed, survivors' slope) | done |
| 15 | G | checks: unrelated across all, exact kill share, no-luck slope = truncated-normal formula, deepens with drought and flips with the rule, rounds, no drought misses all, greediest clears two | done |
| 16 | A-G | prose from JM's dictation; lecture-quote splice (voice) | open |
| 17 | — | shift A-F → B-G (ids, prefixes, gates, BIT, checks; stale stage pointers in comments fixed); 62 bars pass before A went in; the meadow's genes-average bar resized to 4 standard errors (failed at HEAD on one page: 0.115 against 0.1, SE 0.036) | done |
| 18 | A | Price demo: ten flowers, step 1 counts (clones), step 2 family shifts (everyone two); card with the three arrows and the window; rounds; R panel written from the screen | done |
| 19 | A | checks (11 new, 73 in all; A added to page-loaded, slots and practice-switch checks): identity by hand, each term zero in its step, stay-put routes move nothing, rounds reachable / none hits two / intended moves hit / opening and cheap routes miss, pointer, printed arithmetic, average waits for Go | done |
| 20 | — | archive the page as it stands (`app/archive/lesson13_2026-09-29.html`, README line) | done |
| 21 | — | cut old C, D, E (markup, code, checks); F → E, G → F (ids, prefixes, gates, BIT, checks; `C_gauss` and `D_HUES`, borrowed by F and G, now shared `gauss1` and `HUES`); `version: 12`, `scaffold: 6` | done |
| 22 | B | orange and purple hold the butterflies; answers, cheap routes and the map-drag check (run outside a round) re-measured | done |
| 23 | C | JM's DAG, one trait: engine `PD_`, the diagram (tiers for the two generations), field, by-generation chart, card (densities + split arrows), R panel; rounds tall / weather / genes / wet / shorter | done |
| 24 | D | the same diagram, two traits: four signed source arrows + two seeds arrows; rounds along / patch / trade / shared / build | done |
| 25 | C, D | checks (26 new, 71 in all): start spreads exact, Price by hand and its splits, seedling-on-midparent slope = genes' share, expected = arrows' arithmetic, run ≈ expected, environment grows cov and E takes it back, nothing in the genes moves nothing, a wet/dry year moves once, traits tied only through shared boxes, response ratio = genes ratio, shared environment moves nothing, rounds / opening / cheap routes / none clears three, printed arithmetic, terms wait for Go | done |
| 26 | — | cross-references repointed (lesson 14 comment → 13 C; 16 doc → 13 E); memory | done |
| 27 | E, F | archived 2026-09-30 (JM) | done |
| 28 | — | one bit per scored attempt (JM 2026-09-30): BIT A1-A5, B1-B5, C1-C5, D1-D10; `version: 13`, `scaffold: 25`; tasks read "every one you hit counts"; bypass records every slot as hit; check that each scored attempt writes its own bit | done |
| 31 | C, D | JM 2026-09-30: diagram colours (blue / red adjustable, pale blue / pale red held, grey intrinsic) and numbers only on the arrow being set — `paths.js` gained opt-in `valuesOnSelect`, `lockColours`, per-arrow `width` (lessons 8, 9, 14 unchanged: same markup hash with and without; 14's 25 bars pass). Layout: pictures on top (field | trait over time), Predict beside Controls, code and tasks below; Go scrolls up to the pictures. Arrows named; readouts placed in open space; the words under the diagrams cut (the idle note is the colour key; C keeps its wet-year line) | done |
| 30 | C, D | germination drawn on both diagrams: seeds set → germination ("400 seeds grow") ← chance, a fixed thick "at random" arrow, no control. JM, 2026-09-30: *"I just want students to be able to visually see where a large chunk of drift is entering, even if they can't control it, lest they wonder why they're getting results more stochastic than it seems from the settings for drift they can control."* The draw is most of the drift: ±0.037 a generation in the genes' part of cov(w, z) with no selection and no chance on the rates; chance at 8 on each rate adds about a fifth | done |
| 29 | D | ten targets: eaten, follow, topple, shared2, build2 added (birth/death arrows, genes → flower); calibrated over 8 starts. Found: a round's held values carried into the next round's free arrows (eaten's held +6 on flower's births was patch's answer), so C and D now reset free arrows to the opening on every new target. Rounds freeing four different single arrows can be cleared together by one built-up setting (one of 90 random did), so the bar is no one setting clears more than four of ten. And the lazy route with the reset ("put whatever arrow is free at x"): with answers clustered at 2.5-4.5, x = 3 cleared four rounds; answers now spread and signed (patch −6.5, follow −4, trade −2.5, topple 3.5, along 4.5, eaten 6: trade and patch now select for smaller flowers, windows mirrored about 10 since the model is symmetric) and a check holds any single x to two; with trade +2.5 and patch +6.5, x = 3.5 cleared three on one page | done |
| 32 | A-D | JM's run-through, 2026-09-30. A, B, C, D intros are his dictation (transcription fixes only) with his bullets. A: steps "Perfect cloning" / "No differences in reproduction"; card arrows "who makes more", "how far from the parent are the kids?", "does the trait become more common?"; no window label, no averages or sums under the card (only the zeros / apart counters); prompt only for those two rules. B: C's layout (meadow \| bars on top, Predict \| Controls, code \| tasks; Go scrolls up); map rows "hummingbird / bee / butterfly preference"; held = black icon, black count, black handle; movable = colour icon, white handle; no text under the map; card label "target", no held list, no prompt; under the card only the flower count a round needs; under the bars "w: a flower's offspring ÷ the meadow's average, every generation." C, D: only settable arrows can be clicked, a selected arrow keeps its colour, no note under the diagram, no seedling-environment subtext, titles and labels trimmed ("target after 10 generations", "average stem height through generations"). "Lands" cut from every visible string | done |
| 33 | C, D | JM 2026-09-30, the diagrams' arrows. (1) thick lines poked out past their heads: the line ended 7.6 of 10 units into the head, where the head is 0.31 stroke-widths either side against a round cap of 0.5; it now ends at 4.5 (0.72 either side), tips unmoved -- a `paths.js` fix, so lessons 8, 9, 14 get it too (8's thick song arrows had the blob). (2) the selected readout is the number between −/+ only, no name. (3) it is placed beside its arrow, clear of it: flat (− n +) or upright (+ over n over −), whichever covers least -- a settable arrow costs most to cover, held less, fixed grey least, a box or label a lot; set away from its arrow, a faint dotted leader, and a leader through a box costs too. With every free arrow at its widest no readout covers its own arrow, a head or a box. (4) heads turned round: between close boxes the pull-back carried the line's end past its control point (11 of 32 arrows at full width in 13; one thin one in 8); such an arrow is redrawn from its own ends, no thicker than a head fits. (5) settable arrows (free this round, not mid-run) glow in their own colour (`settable` class under `lockColours`). Checks: glow only on free arrows and none mid-run; no arrow turns back; readouts cover nothing | done |

## Measured, 2026-09-29 — A (the two routes)

- Deterministic: the identity holds to 4e-15 over 900 settings, counted offspring by offspring.
- Random settings that hit each round (100 000 counts at 0-5, 100 000 shift sets at ±2): purple 4.9%, orange 0.7%, none 2.6%, two 1.3%, differ 1.6%. No setting hits two.
- Intended moves hit: every family +1 → 6.00; orange side +0.5, purple side −0.5 → 5.00; flowers 1, 5, 10 with none → 5.04-5.07 (the middle flower sits 4.5-4.7).
- Cheap routes miss: the three most orange (or purple) with none; every family +0.5; three offspring each; one family moved as far as it goes (+0.55 at most on the average).

## Measured, 2026-09-29 — B (the meadow), the rebuilt model (in-page, the checks re-measure)

- Rounds (bell-curve butterflies, 1 in 16), eight start meadows × 5 runs (hit = average in window with ≥ 100 flowers):
      orange   2.0-3.0                                   butterflies 10 around 2.5 ± 1: 100%; hummingbirds 8 at 4: 90%; at 3 (past it) 0%
      purple   6.5-7.5                                   butterflies 8 around 7 ± 1: 100%; around 7.5: 48%; bees 10 at 6.5 (past it) 3%
      still    bees 8 at 6 held; 4.5-5.5                 hummingbirds 8 at 4 + butterflies 10 around 5 ± 1: 100%; butterflies around 4 alone 95%, around 5 alone 3%; held alone 0% (7.7)
      past     hummingbirds 10 at 4 held; 7.5-8.5        bees 10 at 6.5 + butterflies 10 around 8 ± 1: 100%; any one kind alone 0%
      few      no hummingbirds, 2 bees, 1 butterfly      bees at 5.5, butterfly around 7.5 ± 1: 100% (never under ~150 flowers); aimed straight at it (bees 7.5, butterfly 7.5 ± 0.5)
               held; 7.0-8.0                              8%, crashing to ~16, some dying. (2 bees + 2 butterflies at 1 in 16: the straight shot hit 45%, crashing only to ~39.)
- Opening and no visitors: 0 in every round. 200 random settings × 3 runs: none clears three.
- Crash, 2 bees + 1 butterfly, bees at 8 and the butterfly around 7.5 ± 0.5: fewest flowers 0 (median), 15 of 100 genes still varying; bees at 5.5, butterfly ± 1: 153, 100 of 100.
- Pollen: mother–father colour correlation, hummingbirds on 0-3 and bees on 7-10: 0.37-0.53; generalists or one kind: −0.12 to 0.10.
- **A split meadow is not stable.** Hummingbirds on orange + bees on purple: the minority side holds 20% at generation 10 with visitor pollen (3% with random pollen), ~2% by 20. Both colours share one room of 200 and nothing favours the rarer, so one side drifts out. A stable split needs a rare advantage (visitors saturating on the common colour): frequency dependence, lesson 15's subject.
- Offspring vs. parents: −0.14 to −0.22 of who left more.
- Earlier 10-gene / fixed-200 draft, kept for the record: counts barely mattered alone; stabilising selection narrowed the spread only 1.17 → 1.08 in 20 generations; the class-share target topped out near 66% in two classes.

## Measured, 2026-09-24 — covariance (archived; was C)

- The drawn offspring move the shift by spread / sqrt(M w̄) = 0.041 × spread (300 parents, w̄ 2). Tolerance 0.09 × spread: the right slope 93-100%.
- At 0.1 × spread, a round asking +0.30 at spread 2 was reached by slope 0 on luck 15% of the time; at 0.07 × spread still 10% on one page. That round now asks +0.50.
- One slope, four spreads (0.5, 1, 2, 3): shift 0.034, 0.138, 0.534, 1.28 — selection needs variation, measured.
- Slopes the five rounds need: ~0.6, 0.25, −0.41, 1.0, 0.2 (each page draws its own populations).

## Measured, 2026-09-24 — what responds (archived; was D)

- `R/S` pooled over 60 runs: h² 0 → 0.006, 0.25 → 0.251, 0.5 → 0.498, 0.8 → 0.802, 1 → 1.001. At h² 0 and the slider's stops (±1.5) the parents who bred move ±0.65 and the offspring 0.01.
- Slope 1 moves the parents who bred 0.48 in every population (h² 0.2, 0.5, 0.9: 0.483, 0.484, 0.486). Truncation at zero offspring bends it: slope 1.5 gives 0.65, not 0.75.
- The response wanders run to run by 0.032 at 1000 parents, 0.024 at 2000. At 1000 with ±0.06, perfect aim hit 73-95% and slope 0 reached a +0.12 target 1 run in 20; at 2000 with ±0.05, best slopes 93-100%, slope 0 none, greediest slope clears two.
- A first round set asking for slopes 0.7-1.1 let slope 0.85 clear four.
- One run at slope 0 printed a fitted slope of 2.87 (two wobbles divided). The page holds the slope back until sum(S²) ≥ 0.02.

## Measured, 2026-09-24 — the least-squares diagram (archived; was E)

- Left to chance, 200 plants correlated the two traits by up to 0.19. At 0.19 the flower picture's slope read 2.45 against an arrow of 1.91, beyond the ±0.5 window. The traits are now made exactly unrelated in each sample.
- At the least-squares diagram the bands hold 65-72% of plants in every round.
- Arrows right, box read off the wider one-trait picture: misses 4 of 5 rounds. It hits r4, where the box (4) is most of the spread.
- On a 0.5 grid (3757 diagrams) the greediest clears one round.

## Measured, 2026-09-24 — E (mediator, confounder; was F)

- Reading each arrow off its own picture (box right) misses all five rounds. On a 0.5 grid the greediest of 63869 diagrams clears one.
- r2 (mediator) first had allele → flower 1.5 with flower noise 0.7. The allele was then 70% predictable from flower size, and its own fitted arrow (truly 0) passed 0.4 on 21% of pages. At 1.0 and box 1.5: 2%.
- At the fit, the line and band each picture draws equal that picture's own regression to 4e-15. The identity is `C b = c`, and var(seeds) = b'Cb + box².

## Measured, 2026-09-24 — F (collider; was G)

- No luck, equal arrows: the survivors' slope is `−δ/(2 − δ)`, with `δ = λ(λ − c)` for a cut at `c` on `(f + h)/√2`. Measured −0.328 / −0.524 / −0.704 at 30 / 60 / 90% killed, against the formula's −0.340 / −0.525 / −0.711.
- With luck 0.5, equal arrows, 0/20/50/80% killed: 0.00, −0.22, −0.39, −0.52. Flower +1, stem −1 at 50%: +0.38.
- A luck-heavy round (luck 1.5) sat near −0.2 for any kill from 30% to 95%, so one kill cleared three rounds. Cut.
- The practice preview without luck overstated the slope (−0.54 against about −0.44 at 60%). It now uses one seeded draw of luck.

## Open for JM

0. C/D (2026-09-29): (e) trade-off rounds on births vs deaths are still his call. Sexual selection is out of 13 (JM, 2026-09-30: held for speciation later in the semester; when it comes, *"mating success isn't so much a 'third rate' as it is a mediator between trait & birth rate"*: trait → mating success → birth rate). Note for then: this engine draws a plant's pollen success in proportion to its seeds set, so paternity rides on the birth rate; a male-only path (mating success → seeds sired) needs its own arrow; (f) D's diagram is busy (13 boxes). (a) D has one genes box, so the two traits' responses always keep the genes arrows' ratio; a second genes box gives each trait genes of its own. (b) JM's first DAG's seeds → seedling arrow is left out: its one honest meaning is crowding (more seeds, less in each), a one-off step. (c) closed: E and F archived. (d) B: the butterfly count/spread cap he suggested measured to do nothing; the rounds hold the butterflies instead.

1. A: JM called the first term "the correlation"; the page shows cov(w, z), which is the correlation × spread of w × spread of z, so the same perfect tilt moves a narrow population less (C's point). Labels say cov(w, z).
2. B: the meadow's bar labels (who reproduced / transmission bias / change this generation) could take A's new names (who makes more / how far from the parent are the kids? / does the trait become more common?).
3. A: the voice is JM's dictation (2026-09-30); the solved banner is still 202_lec30_02 (prions, a later lecture), a proposal.
4. B (meadow): a split meadow does not hold (see measured): offer visitor saturation (rare colours get more calls per flower) if he wants it — it is frequency dependence, 15's subject.
5. B (meadow): 0.08 a copy (not 0.05) so the start keeps a spread near 1.1; confirm.
6. Pupfish (scale-eaters) as framing for frequency-dependent fitness, for 15: citation unverified.

## Do not

- Sum `cov` and `within`.
- Take the pre-2026-09-22 `lesson13.html` (mutation–selection balance) as precedent.
- Assert shifting balance; 12 C shows the one case measured to work.
