# Lesson 20 — phylogeny: a population that keeps splitting, and the alleles inside it

**File** · `app/lessons/lesson20.html` — first draft 2026-10-20 (v1, one stage); pass 2 2026-10-26 (A built); pass 3 2026-10-27 (four stages, JM's review)
**Checks** · `node scripts/check_lesson20_numbers.js` · `python3 scripts/check_lessons.py` · `node scripts/check_layout.js`
**Status** · pass 3 built, then D cut to one trait and E added (2026-10-28; v4, scaffold 26: A 0-7, B 8-11, C 12-15, D 16-19, E 20-25), checks green (`check_lesson20_numbers.js` 30 + narrow fit; `check_lessons.py`; `check_layout.js`); JM to review; voice owed for A-D; LOCKS `x`
**Last touched** · 2026-10-27

## JM, 2026-10-27 (verbatim, dictated; "less than 19" = lesson 20, "parade" = part A)

> For less than 19. I'm still not particularly happy with uh, structure here. I do like the visualization in part A a lot. And the visualization part B is also pretty good. But the flow is off. I'd like the students too, for parade, use the visualization we currently have, but add in mutations explicitly. And I'd like for them to do a few simple tasks of tracking allegals that coalesce within each population separately, and allegals that coalesce before the population split. I'd also like the visualizations to show the frequency of coalescence times against the timing of the population split. And I was thinking they should be able to adjust the timing of the split, and the mutation rate, and the effective size, and the number of generations. And in this way they can generate different patterns. And the big thing would be the, a combination of some targets being clicking on coalescence as it is now, and others, like seeing the patterns that you get from these 2 divergent populations under different sets of incompatible sets of mutation rate, drift, and divergence times. you know, coalescence patterns throughout. First off. Second for part B. Here, I'd like to introduce incompatibilities, building on what they did in lesson 19. Um... And also the idea of, like, make preferences, again, expanding on lesson 19, uh, and basically, building on part A as well. Have the population run for a little bit longer. With the mutations accumulating as before. and have fitness for hybrids of different lowsi. Where they can see the fitness landscapes for hybrids and not hybrids. and have a meat preference a leal. That avoids the low fitness hybrids. Part C would be similar to our current part B, with the phylogy being generated. Big differences here. I like it to build more directly. It could be a different interactive. I like it to build more directly on the concepts and visualizations we did in A and B and there's what graphs and summary results they could plot. Um, I'd also like for them to not have the splits as limited with six. This will change what we can do, what is feasible and practical, but I would like for them to be able to produce larger number of larger numbers of splits and larger phylogenes. I would like the main population divergence philology to be shown in dark black, but then they can add the phylogenes for individual low sies, thin colorful lines, for coalescence plots, and see how many of them reflect the population patterns, the pattern of population splits versus predated versus Mismatch it. And so the targets could be something like, um, trying to get the genes to match the phylogeny, uh, trying to get the chance to mismatch and complete linear sorting and trying to get the genes to. Yeah, that's it. producing greater and smaller amounts of matching, which is not matching the actual population history they see. Actually, Instead of this one being growth, they should set the times of population split. Like we have the population running, and they click a button to split the population. And then they click a button, they split one of the splits, and they click, and they click, and they click, and the clicking is what causes the divergences. And they should be able to set things like the mutation rate and the recombination rate. But the clicking is what causes the splits and so they can figure out that. They should have to get certain amounts of matching versus mismatching due to incomplete lineage sorting individual gene topologies. Um, so I can use the visualization for before. But then, when it's done, it superimposes a black phylogeny showing the full time range, showing their actual history of population divergences, and they add on in different colors, genes that map, genes whose coalescence times match, low side whose genes coalescence times match, or mismatch the actual population history. Or D then would be the final one. This final one would allow them to set a rate of population divergence or a probability of population divergence. In a causal diagram. As a function of traits. So we don't have to do the genetics here. We have some trait like dispersal ability. On dispersability is high. The population diverges less when it's low, it diverges more. And they do that to look at the frequency of other traits over time. The idea is that this one would show species selection without naming it as such. Um, we would also have extinction rate. Probably they go extinct. could be a function of traits as well. We could build this off of something like the Carl Simpson Coral example, where you have colonial and symbiotic, non-colonial and non-symbiotic in the combinations they're in. And they have different probabilities of, The trade arising, and when they arise, they have different probabilities of different effects on BC and extinction. These are the reviews for lesson 20.

Readings: allegals = alleles; lowsi / low sies = loci; meat preference a leal = mate-preference allele; philology / phylogy / phylogenes = phylogeny, phylogenies; "incompatible sets of mutation rate, drift, and divergence times" = different combinations of the three (read as: the same pattern from more than one combination); "complete linear sorting" = incomplete lineage sorting; "predated" = a gene tree with the populations' order whose forks sit further back than the populations' own (its lineages did not meet in the branch between two splits); "instead of this one being growth" = instead of splits arising by chance (v1's split chance b); BC = speciation; Carl Simpson's corals = Simpson 2013 (Evolution 67: coloniality and photosymbiosis in scleractinian corals, species selection).

## Pass 3 plan (2026-10-27)

    A  one split, as a pedigree (pass 2's A) + mutations drawn; four sliders; when pairs of copies meet against the split
    B  NEW  two ponds run longer: incompatibilities from new alleles (19 C), then floods; a choosy allele (19 D) that avoids hybrids
    C  pass 2's B rebuilt: the student splits populations by clicking them (no cap of six); N, mutation, crossing over;
       at the end the populations' tree in black with each locus's tree in thin colour: matches / predates / mismatches
    D  NEW  no genes: species with traits (colonial, symbiotic: Simpson's corals) whose splitting and loss the student sets
       in a causal diagram; the traits' shares over time

v1's size steps, the hybrid pairs plot and the Anolis box are cut (their ideas now live in B and D). Lesson 21 keeps
dispersal and the Price breakdown; D here is its trait-only foreshadowing (Open 1).

### A — one split, mutations, and when copies meet

- engine: pass 2's (`pdWorld`), founding group 3 at generation 0, three founder alleles a locus; the pond splits at
  generation s into n + n; G generations in all. Mutation: each traced copy takes a new allele with chance mu a generation.
- beads: founder alleles white / light / mid grey (pass 2); a new allele by where it arose: before the split green, after it
  in the orange pond orange, in the blue pond blue (19's colours; never by hue alone: ponds also by row side and the
  dashed / solid underline).
- sliders: fish a pond n (4 / 6 / 8 / 10), generations G (20 / 30 / 40 / 60), split at generation s (1 to G - 2, also
  draggable on the plot), mutation rate (0 / .002 / .005 / .01 / .02 / .04).
- plot, with a menu: "when pairs of copies meet" (every pair of copies in the last generation, at the 8 traced loci:
  how many met in each generation; within orange, within blue, one from each; the split as a dashed line; pairs that
  never met inside the pedigree in a bar at the left); "differences between copies" (the same pairs: how many of the 8
  loci carry different alleles; three outlines again); F_ST across the genome (pass 2's).
- reads (Lock in, first answer the bit): R1 a cross pair (where they meet, always above the line); R2 an orange pair;
  R3 NEW a ringed copy carrying a new allele: click the copy where that allele arose; R4 four copies, where the first two
  meet (pass 2's R3).
- targets (16 pedigrees a Go, judged on the 16 together; wordless picture cards):
  T1 within-pond pairs mostly meet after the split (n held, split free)
  T2 within-pond pairs mostly meet before it (split held, n free)
  T3 differences: cross pairs differ at many loci, within-pond few (G and split held, mutation free)
  T4 the same picture with mutation held low: G / split free (the same pattern from another combination)
  windows measured on the page's engine.

### B — incompatibilities, then contact, then a choosy allele

- engine: A's fish (20's `tr*` pieces) in two ponds of N 30 split from one population; apart for the generations set, new
  alleles accumulating (orange, blue); then a flood every generation moves a share m of each pond. A new orange and a new
  blue allele at different loci are incompatible with chance p (a hash, 19 C), each pair costs `cost` of the chance to
  survive. A preference locus ◆: a choosy allele, present at 5% in both ponds from the split; a fish with a choosy allele
  turns down a partner whose look (its new alleles' share from the other pond) is unlike its own, with chance c (one
  choosy copy half that), up to 4 looks (19 D's rule, a one-allele model: no throat gene to come apart).
- displays: the two ponds (19's board, fish with a look square); over time with a menu (hybrid survival, choosy allele each
  pond, F_ST, new alleles from the other pond); the fitness landscape: chance to survive against the share of a fish's new
  alleles from the blue pond (0 pure orange ... 1 pure blue), run 1's fish and sampled hybrids as dots; the loci grid:
  orange new-allele loci down, blue across, a cell dark when hybrids carrying that pair die (19 C's grid, by locus); a
  diagram (paths.js): new alleles → incompatible pairs → survival (cost arrow), choosy allele → mating (how choosy arrow).
- targets (16 runs a Go): B1 hybrids fail at contact (mutation free); B2 the same with mutation held low (time apart free);
  B3 the choosy allele rises in both ponds after contact (how choosy free); B4 it does not, hybrids fine (time apart free).

### C — the student splits the populations

- engine: pass 2's B (`trWorld`) with no chance split: a click on a living population's bar splits it then; at most 16.
  N 5-100, mutation, crossing over R 0 / .25 / 1 / 4 a chromosome. 400 generations, played slowly enough to click
  (pause button). Burn-in before 0 as before.
- at the end: the populations' tree in thick black, lines on the time axis back past 0 to the oldest gene fork; each
  traced locus's tree in thin colour, added and removed by its chip: blue solid matches (same order, every fork inside the
  branch before its split), orange long-dashed predates (same order, a fork further back), red short-dashed mismatches.
- plots: every pair of living populations, generations since they parted against differences (new alleles that differ) or
  F_ST; your runs: one dot a run, the average generations between splits per fish across, the share of loci that match up.
- targets (one tree a Go, judged at 400): C1 6+ populations, 6+ of 8 match; C2 6+ populations, 6+ mismatch; C3 10+
  populations and between 3 and 5 match; C4 6+ populations and every locus the same tree (crossing over free).

### D — traits that split and are lost

- species-level engine, no genes: a clade from one species without either trait; each step a species splits with chance
  λ, is lost with chance μ (its last species never), gains a trait with chance g (per trait, slider), loses it with .01;
  a new species keeps its parent's traits; at most 80 living (splitting × room).
- diagram (paths.js): colonial → splitting, colonial → loss, symbiotic → splitting, symbiotic → loss (signed arrows);
  symbiotic onto colonial → splitting (the combination). Base chances fixed.
- displays: clade 1's tree, lines by trait (colonial thick, symbiotic blue); the traits' shares among living species over
  time (16 clades thin, average thick), and where a share settles with no arrows (g / (g + .01)) as a faint line; living
  species.
- targets (16 clades a Go): D1 colonial common though it arises rarely (splitting); D2 the same with splitting held (loss);
  D3 colonial rises though it raises loss; D4 colonial falls though it arises often; D5 colonial-and-symbiotic the most
  common combination.

## Pass 3 as built (2026-10-27)

Where the build departs from the plan above, and the numbers each target was set on (the full sweeps sit in comments above
each stage's targets in `lesson20.html`; seeds kept apart between Gos: an early D sweep reused 15 of 16 clades between Gos and
read spreads far too narrow).

- **A.** Pass 2's four-copy tree and chips panel cut: "every pair of copies" took its place, one plot with a menu (when two
  copies meet / loci where two copies differ / F_ST across the genome). The split is a slider and a handle dragged along the
  meet plot; its top follows the generations. Reads A1, A2, A4 are pass 2's R1-R3; A3 is new (the copy where a new allele
  arose; mutation held at .02 so one is always there). Targets, Go = 16 pedigrees, the red boxes on the plot and on a sketch
  in the card:
      A5 within-pond pairs met after the split, 70%+ (n 4, G 40; split free, opens 35): split 35 .41-.48, 30 .63-.73, 28 .71-.78, 25 .81-.85
      A6 within-pond pairs met before it, 72%+ (G 40, split 35; fish free, opens 4): n 4 .52-.59, 6 .63-.70, 8 .72-.76, 10 .77-.80
      A7 within pairs at 2 or fewer loci and cross pairs at 5+, 70% each (n 4, G 60, split 10; mutation free, opens 0):
         0 cross .00-.19; .005 cross .41-.84; .01 .77-.92 / .88-.99; .02 within .58-.68; .04 within .25-.35 (a window)
      A8 the same picture, mutation held .005 (G and split free, open 40 / 30): cross .00-.11; G 60 split 1-2 .64-.95
- **B.** 40 fish a pond; one population split at 0; apart for 25-400 generations; then 150 of floods (migration .02-.2 a
  generation). Incompatible chance .05 (19 C's .02 was too slow for 40 fish: .32-.43 hybrids at mutation .002 after 100).
  The choosy allele is a one-allele preference on the partner's mix of new alleles (no throat gene), one chromosome in ten at
  the first flood. Plots: the two ponds; over time (hybrid survival, choosy allele, F_ST, alleles from the other pond); the
  fitness landscape (survival against a young fish's mix, parents within each pond and across) or loci by loci (orange
  locus x blue locus, darker the more an F1 loses); diagram with the cost and how-choosy arrows. Targets (16 runs):
      B1 hybrids at the first flood 25% or under (100 apart; mutation free, opens .0005): .0005 .88-.97; .001 .54-.78; .002 .08-.14
      B2 the same, mutation held .0005 (apart free, opens 50): 200 .52-.58; 400 .10-.19
      B3 choosy allele 40%+ in each pond after the floods (200 apart, mutation .002; how choosy free, opens 0): 0 .00-.07; .5 .18-.38; 1 .43-.59
      B4 choosy allele 20% or under, how choosy held 1 (apart free, opens 200): 25 .13-.17; 50 .05; 100 .23-.26; 200 .43-.59
  With choosy fish the ponds' F_ST falls (.19-.31 against .57 with none): an immigrant's young by an immigrant partner live,
  so each pond comes to hold both kinds. Worth a look: it reads as fusion on the F_ST plot though the two kinds stay apart.
- **C.** Up to 16 populations; 400 generations at 45 ms each, a Pause button; a split lands at the next generation, each half
  growing to its own size around the slider's (lognormal, sd .2: your 2026-10-26 ruling). End: the black tree back past 0
  to the oldest fork, the eight loci thin over it (blue ✓ / orange ↶ / red ✗, chips to add and remove each); every pair's
  loci that differ or F_ST against time apart; your runs (generations between splits per fish against loci ✓, a log scale).
  The R panel carries the student's own clicks. Targets (one tree a Go):
      C1 6+ populations, 6+ ✓ (opens N 50): N 5 or 10 with splits 50+ apart 7-8/8 trees; N 25-50 0-2/8
      C2 6+ populations, 6+ ✗ (opens N 5): quick splits (2 apart) or N 25+ 8/8; N 5 with splits 10 apart 0/8
      C3 12+ populations, 4+ ✓ (opens N 25): N 5-10, every population split every 70+ 8/8; N 25 0/8. (Planned "a window of
         matching" between C1 and C2: at 2-6 ✓ the opening landed 2 trees in 6, at 3-5 the best setting 6 in 8.)
      C4 6+ populations, every locus the same tree, a ✗ among them (N held 100; crossovers free, opens 1): 0 8/8; .25-4 0/8
- **D (2026-10-28, JM, three steps that day: "a simple single trait that influences both speciation and extinction"; "dispersal
  ability as the trait"; then "a modification to the core DAG plot. Something where you shift a distribution (eg mean/var of
  wing size), and adjust a correlation by dragging a line (eg between wing size & P(founding a new population)) which is
  causally linked to more speciation and more extinction via arrows", with "an extra box on additive genetic variation +
  environment controlling wing length", "We'll change by a Va unit each speciation", wing size as dispersal, replacing D).**
  The diagram: additive genetic variation (V_A arrow) and environment (V_E arrow) → wing length, a box holding the first
  species' fish as two curves (genetic values dark, wing lengths light), its centre dragged → P(founding a new population),
  a box holding the line from 9 to 11 mm, both ends dragged, clade 1's species as dots on it → speciation and extinction
  (signed arrows). `paths.js` gained `drag` on a box (one listener on the SVG; boxes without it unchanged; 8 pages' layout
  and lesson 19's 47 checks green after it). A species carries G; its fish g ~ N(G, V_A), wing length g + e, e ~ N(0, V_E);
  its founding chance the line averaged over its fish; speciation 0.1 exp(cs (2f - 1)) x room, extinction 0.05 exp(cl (2f -
  1)); a new species' G is the g of one fish that dispersed (a V_A unit, biased by founding).
  V_E: under a straight line it does nothing (the founders' bias is V_A x slope / f, h2 and S cancelling V_E: 12.0 mm at V_E 0,
  11.9 at 4), so the line's handles sit 2 mm apart and a steep line is a threshold, where V_E blurs which fish found.
  Then (2026-10-28, JM): "Larger wings = lower extinction/speciation due to larger Ne resulting from higher gene flow"; and
  then "wing length should affect a bird's gene flow & census population size (total range). Then extinction is based on smaller
  wings = smaller size, and speciation is based on lower gene flow = more fragments. Opens it up more to a later extension ... in
  lesson 21 to show how a trait can have different effects on fitness between individuals in a population & between species
  within a clade." Birds, not fish. Wing length → two boxes, each a line dragged at 9 and 11 mm: gene flow (the chance a bird
  disperses) → speciation, and range size (census size) → extinction; both arrows negative in D1-D4. A new species starts from
  a fragment, from a bird that stayed (chance 1 - gene flow), and leans toward short wings. The over-time menu adds gene flow
  and range size (a clade's species averaged): 21's hook.
  Targets (16 clades, 6 Gos measured; average wing length at 200 million years):
      D1 V_A free (start 10, gene flow steep, range flat): 0 10.0; .25 7.7-8.0; 1 6.0-6.5. Bar 8.2 or under
      D2 V_E free (start 12, V_A .25): 0 8.3-8.7; 2 9.3-9.8; 4 9.0-10.7. Bar 9.4 or more
      D3 the start free, change within 1 mm (opens 12: -3.7 to -2.4): 6 -.4 to +.1; 14 -1.0 to +.5
      D4 the range line free (gene flow .4 → .6): flat 4.5-5.8; .2 → .8 7.8-10.4; 0 → 1 8.0-10.4. Bar 8.5 or more
      D5 the arrows free (gene flow .4 → .6, range .2 → .8): none 7.4-8.4; both -.7 7.8-10.4; extinction -1.4 10.3-12.1;
         speciation -.7 with extinction -1.4 10.0-11.7. Bar 10.5 or more
  Checks: a founder's bias -.148 / -.145 mm against -V_A x slope / (1 - f) = -.150; V_A 0 changes nothing; a flat line, no drift.

- **E (2026-10-28, JM: "a random phylogeny is generated and students must click the nearest relative of a random tip, and the
  common ancestor of two tips").** A random tree of 8-12 species, lineages joined two at a time with the forks evenly spaced
  (waiting times like A's crowded the young forks against the letters), each fork's branches drawn up or down at random.
  Click a letter or a fork, then Lock in; a wrong answer shows the right one and Another tree asks again. Six questions:
  E1-E3 the nearest relative of a ringed tip (every tip across its last fork counts; E2 deals a tip whose nearest relatives
  are a group, E3 one whose neighbour on the page is not among them); E4-E6 the common ancestor of two ringed tips (E5 two
  far apart on the page whose fork is not the oldest, E6 two side by side whose fork is the oldest). Lessons 15 and 19 read
  for the move (15 B: pick the copy, then This one); 19 unchanged.

## Foreshadowing 21 and 22 (proposed 2026-10-28, not built)

21 is now speciation mechanics (lesson21_overhaul.md, pass 2 plan), 22 the Price equation through kin selection
(lesson22_overhaul.md). What 20 could change to lead into them:

1. B overlaps 21. Recommended: 20 B keeps the snowball and the hybrid fitness landscape and ends at contact (targets B1-B2);
   its choosy allele (B3-B4) moves to 21 B, which opens from 20 B's endpoint. 20 B then needs two new targets or none.
2. D gets an inert arrow, wing length → a bird's own survival, drawn and held at 0 (LESSON_STYLE §11: a hook left visible but
   inert). 22 D turns it on: the trait's effect on birds within a species against its effect on species within a clade.
3. A's "when two copies meet" is 22's relatedness, and 11 and 15 are its ancestors (kinship; the snake game's pedigree). One
   hover line in A could say "as in Lessons 11 and 15"; 22 B then says "as in Lesson 20 A".
4. Real data for D (closed box): AVONET (data/clean/avonet_birds.csv, 11,009 species, unused so far): hand-wing index, the
   birds' dispersal, against range size, the wing → range arrow measured in real birds.

## Open for JM (pass 3)

1. D overlaps lesson 21 (species selection with dispersal and the Price breakdown). D here is trait-only (corals), no Price
   terms; 21 is unchanged. Dispersal is not named in D: 21 is built so students find that dispersers split less.
2. "Predates" is defined as above (same order, a fork older than the split before it). Say if you meant something else.
3. A's split slider and the generations slider: the split must fall inside the run, so the split slider's top follows G.
4. B's choosy allele is a one-allele preference (a partner's mix of new alleles), not 19 D's throat and preference genes:
   nothing for crossing over to break apart, so the rise reads cleanly. Say if you want 19 D's two genes back here.
5. B's incompatible chance is .05, not 19 C's .02 (40 fish a pond were too slow at .02).
6. A's reads and C's targets keep one sentence each in the card (a read has no picture; C's control, a click on a bar, has no
   cue of its own: REVISIONS row 22). Everything else is wordless.
7. Voice: none yet for A-D.

## What the lesson is

- One population that keeps splitting (apart, no floods: 19 A with migration off) into a tree drawn as it grows. Inside the tree, the alleles at a few loci traced back: their trees disagree with the populations' tree when the populations split fast and are large. F_ST between every pair; at the end, a trait evolving along the tree.
- Worth protecting: the tree is drawn from the run, never asserted; every gene tree comes from parent links recorded in the run.

## JM, 2026-10-23 (verbatim)

> I'd like a proposed revision plan for lesson 20. I like the simulation, but it comes too early. I think a more granular view reusing the coalesence locus-vs-individual style pedigrees of lesson 15 with the genomic-level-view-of-population-splitting visuals of 19 would be good. An activity to help the student conceptualize the pedigree along a single split. Then the current visualization / activity mode. Then perhaps something to track mutations along the tree with the population splits.

## Pass 2 plan (proposed, not built)

    A  NEW  one split, as a pedigree: 15's pedigree whose rows are 19's ponds
    B       the current stage, steps 1-4 (six populations; closest relative; alleles disagree; alleles agree); no mutation slider
    C  NEW  new alleles along the tree; then the current steps 5-9 (hybrids, size) and the Anolis box

- Steps 5-9 move to C: hybrids fail on pairs of new alleles from two branches, and size's long-run rise is carried by new alleles (measured 2026-10-20). Both are what mutations along the tree do; in v1 they come before anything shows a mutation on a branch. Alternative: B whole, C only the ticks.
- B's red lines in bars are A's pedigree folded up: a tip in B says "as in A".

### A — one split, as a pedigree

- engine: B's (`tr*`), not 15's snakes. A only: a pond of 2n fish splits into two ponds of n, no regrowth (B halves, then regrows to N), so the row keeps its width. Founders at generation 0, no burn-in (15's start).
- drawn: B's 8 traced loci (a row of 40-bead fish is unreadable; 15 drew 7). The other 32 stay, for F_ST.
- sliders: fish a pond n 4 / 6 / 8 (rows of 8 / 12 / 16; 15's run ~10-14); generations since the split 5-30. Before the split held at 6-10. 11-40 rows: scrolls like 15 B.
- pedigree (port of `lesson15.html` 1311-1537: `pedLayout`, `drawPed`, `pedHit`, `pedClick`, `setView`): organism / chromosome / locus views; click = red up, blue down; lock; Clear; question card ‹ ›. Parent fish = link >> 1. Split line across the row; orange left, blue right below it (19's colours and names).
- beside it: the 4 marked copies' tree (B's "locus k's tree", 4 tips); under it the 8 chips ✓/✗ (B's chips: do the marked copies sort by pond). Marked = the same 4 chromosomes at every locus, 2 fish a pond (B's one-chromosome-a-fish rule).
- F_ST across the genome (19's `drawGenes`, the 8 marked) under the pedigree: keep only if ✓ loci measurably sit higher (not measured).
- reads (one bit each, first answer):
  1 one marked copy each pond: click the copy where they meet (always above the line)
  2 two marked copies, orange pond: click where they meet (below or above the line)
  3 the four: click the copy where the first two meet; that locus's chip then shows
- targets (16 pedigrees a Go, run 1 drawn, 19's way; judged on the share of the 128 loci ✓):
  T1 most loci sorted: n held, generations since the split free
  T2 few sorted: generations held, n free
  windows from the page's engine (indicative numbers below)

### B — the current stage, trimmed

- steps 1-4 unchanged (mutation .001 held, as now). Pairs plot F_ST only.
- REVISIONS rows 18-21 (wordless cards, "practice", blank plots before Go: v1 has "Go plays it here." and the long practice label); questions keep one sentence (row 22).

### C — new alleles along the tree

- B's tree with each common new allele (50%+ in a living population at 400) a tick on the bar where it arose, at the generation it arose. Ink ticks, the picked one red: never by hue (six populations). Click a tick: its share in each living population, by letter. Origin is already in the registry (`w.org`).
- pairs plot menu: F_ST, new alleles that differ, a hybrid's chance to live, size difference.
- reads:
  C1-C2 bet: an allele the page picks; click the bar where you expect it arose. Bit = the bet (the carriers' last shared population); the reveal shows where it did
  C3 find an allele carried by populations that are not each other's closest relatives (B's ✗ loci, seen through mutations)
- target: new alleles that differ, pairs parted 300+ ago, a window with mutation free; or a drawn round (REVISIONS row 15, draw it against time apart, a cloud of trees)
- then v1's steps 5-9 unchanged; Anolis box last.

## Measured for the plan (2026-10-23)

Scratchpad `split_ped.js` (B's rules, the 2n → two-of-n split, 300 pedigrees a cell) and `muts20.js` (B's engine cut from the page, 30 trees a row).

    A, per locus, two copies a pond (g0 6; at g0 10 ✓ within .06, ✗ up to .12 higher: more cross pairs meet inside):
      a cross pair meets inside the pedigree     g0 6: .32 / .22 / .17 (n 4 / 6 / 8); g0 10: .46 / .34 / .26; flat in g1
      the orange pair meets after the split, n 6  g1 5 .32 · 10 .55 · 15 .70 · 20 .80 · 30 .92
      four copies sorted by pond (✓)              n 4 .32 / .56 / .75 / .86 / .96 (g1 5 / 10 / 15 / 20 / 30)
                                                  n 6 .19 / .37 / .57 / .68 / .87
                                                  n 8 .13 / .29 / .42 / .55 / .76
      a clade mixing ponds (✗), n 6               .42 / .30 / .20 / .14 / .06; the rest not met by generation 0
      one pedigree, 6+ of 8 ✓                     n 4 .03 / .28 / .67 / .90 / 1.0 · n 6 0 / .06 / .27 / .51 / .92 · n 8 0 / .01 / .06 / .25 / .72
      one pedigree, 2 or fewer ✓                  n 4 .50 / .12 / .01 / 0 / 0 · n 6 .80 / .40 / .08 / .02 / 0 · n 8 .91 / .57 / .27 / .12 / .01
      every copy in each pond sorted, n 6         0 / .05 / .18 / .34 / .66: too slow, and too many copies to trace by hand
    C, B's engine, b .008, N 25, mutation .001, trees with 4+ populations at 400:
      common new alleles a tree                   median 61 (31-82); mutation .002: 110
      carriers a clade of the tree                .88 (N 10 .89, N 50 .82)
      arose in the carriers' last shared pop.     .77 (N 10 .84, N 50 .67)
      new alleles that differ, by pair, parted    0-99 / 100-199 / 200-299 / 300+: 7 / 17 / 23 / 28 (mutation .002: 15 / 33 / 42 / 46).
                                                  Bends: 40 loci, so a newer allele can replace an older one at a locus

## Measured, item 8 (2026-10-26)

Scratchpad `split_ped2.js` (B's rules; F founder fish at generation 0, rows of 2n for g0 generations, split into two ponds of n, g1 more; 3 founder alleles a locus; 300 pedigrees a cell, or 200 Gos of 16 pedigrees).

    small founding group: a cross pair meets inside the pedigree (any cross pair of the four copies, n 6)
                F 1 / 2 / 3 / 4        g0 8: .60 / .61 / .57 / .51   g0 10: .65 / .65 / .60 / .56   g0 12: .68 / .68 / .63 / .61
                (was .34 with distinct founders at g0 6-10). A small group helps by ~.2, not to "most": the orange clade and the blue
                clade must land on the same founder chromosome, a 1-in-2F chance. Read 1 still deals from pairs that meet.
    T1/T2, F 3, g0 10, share of the 128 loci sorted by pond (4 marked copies), mean (sd across Gos .03-.05; range of 200 Gos about ±.12):
                g1        5     10    15    20    30
                n 4      .37   .61   .77   .87   .96
                n 6      .27   .45   .60   .73   .87
                n 8      .20   .35   .48   .61   .77
    F_ST (8 traced loci, 16 runs, pond allele counts): sorted loci sit higher than unsorted in every cell (n 6, g1 10: .30 vs .20;
                n 6, g1 30: .38 vs .26; n 8, g1 20: .36 vs .26). Keep the F_ST-across-the-genome panel under the pedigree.
    windows (indicative; set from the page's engine at build): T1 most sorted, n 4, g1 free: reachable from g1 15 (.77), not at g1 5 (.37).
                T2 few sorted, g1 held at 10, n free: n 8 gives .35, n 4 .61.

## Open for JM (pass 2)

1. A cross pair meets inside a short pedigree 17-47% of the time (generation 0's fish are distinct founders). Read 1 is dealt from pairs that meet (15's way). Or: a small founding group, so most meet.
2. One copy a pond can never disagree with the ponds (two tips, one tree). The single-split version of B's ✗ needs two copies a pond: hence four marked copies.
3. A's split (2n → two of n) differs from B's (halve, regrow to N). Keep both, or bring B in line (then a population shrinks at every split)?
4. Steps 5-9 from B to C.
5. "Where did it arise" has no unique answer from the carriers alone (23% arose earlier, lost in some descendants): scored as a bet, like the size steps.
6. C's target: window or drawn round.

## Items

| # | What | Status |
|---|------|--------|
| 1 | prototype: splitting populations + parent links; ILS rate vs N and b; time and memory budget | done |
| 2 | page: growing tree, traced allele tree, F_ST and hybrids by pair, unlocks, steps | done |
| 3 | trait along the tree; Anolis box | done |
| 4 | check script (`check_lesson20_numbers.js`, 18 + R) | done |
| 5 | JM's review of v1 (2026-10-23: "I like the simulation, but it comes too early") | done |
| 6 | pass 2 plan; A and C measured | done |
| 7 | JM rules on Open 1-6 (2026-10-26, see Rulings) | done |
| 8 | A: node prototype on the page's engine (2n → two of n, small founding group at 0); T1/T2 windows over 16 pedigrees; F_ST against ✓ | done 2026-10-26 (see Measured, item 8) |
| 9 | A: pedigree port from 15 onto `tr*` data; split line; ponds by half; 4 marked copies' tree + chips | done 2026-10-26 (`pdWorld`, `pdLayout`, `drawPed`; three views, click = red up / blue down, lock, Clear) |
| 10 | A: reads 1-3, targets T1-T2 | done 2026-10-26 (bits 0-4; reads need Lock in; T1 >= 70% at n 4 from g1 5, T2 <= 28% at g1 5 from n 4; see Measured, item 10) |
| 11 | B: steps 1-4; pairs plot F_ST only; REVISIONS 18-21 | superseded by pass 3 (2026-10-27) |
| 12 | C: ticks, allele picker, "new alleles that differ"; reads C1-C3; target; steps 5-9 moved; Anolis | superseded by pass 3 |
| 13 | scoring v2, scaffold recount; R panels A, B, C; `check_lesson20_numbers.js` across A-C | superseded by pass 3 (item 19) |
| 14 | JM's voice A-C | moved to item 20 |
| 15 | JM's review of pass 2 (2026-10-27): A with mutations and four sliders; B incompatibilities and mate preference; C splits by click, gene trees over the black tree; D traits, splitting and loss | done (verbatim above) |
| 16 | A: mutations drawn; G, split, mutation sliders; every pair of copies (meet / differ / F_ST); read A3; targets A5-A8 measured | done 2026-10-27 |
| 17 | B: two ponds apart then floods; incompatibilities; choosy allele; landscape and loci grid; diagram; B1-B4 measured | done 2026-10-27 |
| 18 | C: click to split (16), black tree + loci, chips, pairs, your runs; C1-C4 measured. D: species engine, diagram, tree, shares; D1-D5 measured | done 2026-10-27 |
| 19 | scoring v3 (21 bits), R panels A-D, `check_lesson20_numbers.js` (30 + narrow) | done 2026-10-27; the four R panels run (B and C shortened, as the check does) |
| 20 | JM's voice A-E; JM's review of pass 3 | todo |
| 22 | D wing length: V_A, V_E, a dragged distribution and a dragged founding line, arrows to speciation and extinction; five targets; `paths.js` box drag; v5, scaffold 27 | done 2026-10-28 |
| 21 | D one trait, dispersal, worded as speciation and extinction (JM, 2026-10-28: "Why such informal terminology? Why \"loss\" instead of extinction?"); E reading a tree (six questions); checks 30 + narrow, R panels A-E run | done 2026-10-28 |

## Measured, item 10 (2026-10-26, the page's engine, 60 Gos of 16 pedigrees a cell; mean ± sd across Gos [range])

    share of the 128 loci ✓, F 3, g0 10, mutation .001:
                g1       5                10               15               20               30
      n 4      .38±.07 [.20-.52]  .62±.05 [.47-.73]  .78±.04 [.69-.86]  .87±.03  .95±.02
      n 6      .26±.05 [.17-.38]  .45±.05 [.33-.56]  .62±.05 [.51-.76]  .74±.04  .88±.03
      n 8      .21±.04 [.13-.33]  .34±.06 [.23-.51]  .50±.05 [.38-.63]  .61±.06  .77±.04
    (agrees with item 8: .37 / .61 / .77 / .87 / .96 at n 4.) Bars set on these:
      T1 n held 4, g1 from 5: >= 70%. Hits g1 5 0 of 20, g1 10 1-4 of 20, g1 15 16-20 of 20.
      T2 g1 held 5, n from 4: <= 28%. Hits n 4 about 1 in 10, n 6 about 6 in 10, n 8 about 9 in 10 (n 6 is the soft one: the sd is .05 and the step is .12).
    F_ST per locus, 60 pedigrees at n 6, g1 10: loci that sort .28, loci that do not .15: the panel stays.
    ✓ here = the orange pair met each other and the blue pair met each other, and no copy met one of the other pond first; ✗ = a mixed clade; – = a pair not met by generation 0.

## Built so far (A)

- reads need **Lock in** (a click also draws lines, so a click cannot be the answer); a wrong copy records 0 and the read stays on a new locus; R3 answered shows the four-copy tree and the chips; targets show them always.
- reads redeal when either slider moves; targets hold one slider and open the other at the intended starting value.
- the wordless-card rows (REVISIONS 18-22) not applied to A's cards yet; voice (item 14) none.
- `check_lesson20_numbers.js`: 27 bars. `step 4` (B) is flaky at HEAD too (7 of 10 hit at N 5 but the opening hit 1; it needs 0): a bar to loosen or sample more, not touched.

## Rulings

- 2026-10-20: 20 builds on 19's results with more than two populations; one population with some chance of dividing; allopatric; incomplete lineage sorting visible; trace alleles across the pedigree; link to F_ST; maybe a single stage with many targets and questions and sliders unlocking; the phylogeny drawn as it goes. By the end, traits along the tree.
- 2026-10-23: the simulation stays, but later. First a granular view of one split: 15's locus-vs-individual pedigrees with 19's genome view of populations splitting. Then the current stage. Then perhaps mutations tracked along the tree.

- 2026-10-26 (JM, on Open 1-6): (1) a small founding group, so most cross pairs meet inside the pedigree; (2) four marked copies, yes; (3) A and B keep different splits: A's rows keep their width, B regrows after halving, but not necessarily to identical Ns (some variance in population size; read as: each half regrows to its own N drawn around the slider's N, not all to the same one); (4) steps 5-9 move from B to C; (5) "where did it arise" is scored as a bet; (6) C's target is a drawn round (REVISIONS row 15: draw against time apart, a cloud of trees).
- 2026-10-27 (JM's review of pass 2, verbatim above): four stages. A keeps the pedigree, adds mutations, the split's timing, mutation rate, size and generations, and the distribution of when copies meet against the split; reads and pattern targets. B incompatibilities (19 C) and a mate-preference allele (19 D) that avoids unfit hybrids, built on A, run longer; fitness for hybrids by loci and landscapes for hybrids and not. C the student splits populations by clicking, no cap of six; the populations' tree in black over the full time range, each locus's tree thin in colour, matching / predating / mismatching; targets on amounts of matching. D splitting and loss as functions of traits in a causal diagram, no genetics (Simpson's corals); species selection, never named.
- 2026-10-28 (JM): don't change lesson 19; look at it and 15. 20 D a single trait that influences both speciation and extinction (trade-offs from 21 on). A Part E: a random phylogeny, click the nearest relative of a random tip and the common ancestor of two tips.
- 2026-10-28 (JM): D's trait is dispersal ability: high dispersers lower extinction and lower speciation, low dispersers the reverse.
- 2026-10-28 (JM): D rebuilt on the diagram: a wing-length distribution (V_A + V_E boxes) shifted by drag, a dragged line wing length → P(founding a new population), arrows to speciation and extinction; a new species changes by a V_A unit; wing size as dispersal. Replaces the high / low dispersal D.
- 2026-10-28 (JM): larger wings lower extinction and speciation, through larger Ne from higher gene flow (the middle box is gene flow, its arrows negative).
- 2026-10-28 (JM): wing length sets a bird's gene flow (lower: more fragments, more speciation) and census size / total range (smaller: more extinction); 21 to break the trait's effects apart between individuals and between species.

## Do not

- Simulate gene trees backwards (a coalescent) and draw them as if traced: trace them from the run's parent links. A's pedigree too.
- Tell students which gene trees disagree before they look.
- Ask students to sort every copy in a pond by hand: chips judge the four marked copies.
- Mark C's ticks or populations by hue alone.

---

## First draft (v1, 2026-10-20): the source for B and for C's steps 5-9

### JM's brief, 2026-10-20 (verbatim, the 20 part; the whole message is in lesson19_overhaul.md)

> 20 should be on biologics. [...] By the end of 20, there should be similar traits along their tree. [...] For less than 20. We take the speciation results and build them up with more than two populations. Start with one population, and have it have some probability of dividing. As it divides, and compatibilities build up or reinforcing the ideas we talked about before. And we'll just use an allopatric sort of mode here. to make life a little bit easier for us. analytically. Importantly. I would like incomplete lineage sorting to be visible in the speciation simulation. So they start with solid population, has some amount of diversity, and they have some probability of the lineages splitting over time. I guess we'd get basically a pedigree. So then you just split and evolve, and we could trace individual wheels across that pedigree. We should link this to FST. This one might honestly be a single stage. Just an A. Even without a stage. Just with many targets and questions and additionally unlocking sliders rather than actually truly separate. targets, just a long time staring at this thing that produces, at the end, a phylogeny as it goes along. Dynamically.

Readings: biologics = phylogenetics; "similar traits along their tree" = traits simulated along the tree, close relatives alike; "compatibilities" = incompatibilities; wheels = alleles; solid = a single.

### As built

One stage, no letter; nine steps; a slider joins the controls as the steps open it (split chance, then fish a population, then mutation).

    engine     19's fish and chromosomes; populations split with chance b a generation (cap 6), each half its own population, never
               meeting; 8N (at least 200) generations of the first population before 0, so traced lineages have met. Parent links at
               8 traced loci (3, 8, ..., 38); the alleles' trees traced from the run. Hybrids judged by 19 C's rule (pass 4 moved incompatibilities from A to C) (new alleles from
               populations that had parted, pair chance 0.02, one kills) — never in the run, only between pairs for the plot.
               Size: every allele's effect N(0, .6) by hash; a fish 20 + its 80 effects; nothing selects on it.
    displays   the populations' tree as bars (letters on the living, top to bottom); one locus's lineages in red inside it; that
               locus's tree beside; 8 chips ✓/✗ (click to draw one). Every pair: F_ST, a hybrid's chance to live, size difference
               against generations since they parted. Size along the tree (opens at step 7). Anolis box (closed).
    steps      1 T six populations (split chance; opens .001)            2 Q the ringed population's closest relative (one letter)
               3 T six populations, 6+ of 8 loci not matching (+ N; opens N 5, b .008)
               4 T five or more, at most two not matching (opens N 50, b .008)
               5 T every pair parted 100+ ago two species (+ mutation; opens .001)
               6 Q the two populations whose hybrids live best (two letters: the pair that parted most recently)
               7-9 Q size, a tree each: before sizes show, the population you expect closest in size to the ringed one. The bit is
               the bet (its closest relative); the reveal says whether it paid off this time.
    the ringed population: one of the pair from the most recent split whose halves both live (its closest relative is one population)

### Measured (the page's engine in node, scratchpad nodeEng20.js; single trees)

    six by 400: b .001 rare, .002 .10-.50, .004 .25-.40, .008 .75-.85, .016 .99 (2,970 / 2,999)
    six and 6+ not matching: N 5 b .008 .05; N 10 b .008 .25; N 25 b .016 .80; N 50 b .008 .85, b .016 1.0
    five+ and at most two not matching: N 5 b .008 .60, b .004 .30; N 10 b .004 .27; N 25+ 0-.07 (a fail: two forks close together)
    old pairs two species (100+ ago, under 10%): mutation .001 0-.10; .002 .37-.50; .004 .83-.93; .006 .90-.97
    size: the latest split's pair also the closest in size in roughly half of trees (vs 1 in 5 by chance); average gap rises with
      time apart (N 5, mutation .001: 1.8 / 3.6 / 4.7 / 6.5 by 100s of generations). With size from standing variation alone it
      saturates within ~4N generations (each population fixes its alleles), so mutations carry the long-run rise.
    Anolis (82 species): pairs parted < 1 tree unit differ by 0.06 log units, 5+ units by 0.46 (3,321 pairs)

### Open for JM (v1; 3 and 5 stay with B; 1, 2 and 4 move to C with steps 5-9)

1. The earlier plan's "oldest pair two species, newest not" hit 1 tree in 4 at best (it hangs on when the splits fall): replaced by
   step 5 (every pair parted 100+ ago two species) and the question in step 6.
2. Size questions score the bet, not the outcome: the reveal shows when relatives were not the closest. One tree is noisy; the
   Anolis box is the average. Say if you would rather score something else.
3. Split = a population's fish halved; the halves grow back to N the next generation (a founder step). The trait drifts; nothing
   selects. 21 adds a trait that changes splitting.
4. No drawn prediction yet in 20 (your 10-17 note): the pairs plot could take one (draw F_ST against time apart, cloud of trees)
   if you want it; the page plays one tree at a time.
5. Single-tree targets are stochastic: the best settings hit 60-99% a tree. The bit is the first scored tree.
