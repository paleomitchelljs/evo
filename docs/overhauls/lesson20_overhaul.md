# Lesson 20 — phylogeny: a population that keeps splitting, and the alleles inside it

**File** · `app/lessons/lesson20.html` — first draft 2026-10-20 (v1, one stage)
**Checks** · `node scripts/check_lesson20_numbers.js` · `python3 scripts/check_lessons.py` · `node scripts/check_layout.js`
**Status** · pass 2 PROPOSED 2026-10-23 (A one split as a pedigree, B the current stage, C new alleles along the tree); nothing built; LOCKS `x`
**Last touched** · 2026-10-26 (JM ruled on Open 1-6)

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
| 9 | A: pedigree port from 15 onto `tr*` data; split line; ponds by half; 4 marked copies' tree + chips | todo |
| 10 | A: reads 1-3, targets T1-T2 | todo |
| 11 | B: steps 1-4; pairs plot F_ST only; REVISIONS 18-21 | todo |
| 12 | C: ticks, allele picker, "new alleles that differ"; reads C1-C3; target; steps 5-9 moved; Anolis | todo |
| 13 | scoring v2, scaffold recount; R panels A, B, C; `check_lesson20_numbers.js` across A-C | todo |
| 14 | JM's voice A-C | todo |

## Rulings

- 2026-10-20: 20 builds on 19's results with more than two populations; one population with some chance of dividing; allopatric; incomplete lineage sorting visible; trace alleles across the pedigree; link to F_ST; maybe a single stage with many targets and questions and sliders unlocking; the phylogeny drawn as it goes. By the end, traits along the tree.
- 2026-10-23: the simulation stays, but later. First a granular view of one split: 15's locus-vs-individual pedigrees with 19's genome view of populations splitting. Then the current stage. Then perhaps mutations tracked along the tree.

- 2026-10-26 (JM, on Open 1-6): (1) a small founding group, so most cross pairs meet inside the pedigree; (2) four marked copies, yes; (3) A and B keep different splits: A's rows keep their width, B regrows after halving, but not necessarily to identical Ns (some variance in population size; read as: each half regrows to its own N drawn around the slider's N, not all to the same one); (4) steps 5-9 move from B to C; (5) "where did it arise" is scored as a bet; (6) C's target is a drawn round (REVISIONS row 15: draw against time apart, a cloud of trees).

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
