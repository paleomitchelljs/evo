# Lesson 16 — mutation: what a change does, the ratchet, how chromosomes break and rejoin

**File** · `app/lessons/lesson16.html`
**Checks** · `node scripts/check_lesson16_numbers.js` · `python3 scripts/check_lessons.py`
**Status** · first pass built (2026-10-08): A, B, C from JM's plan, locked in LOCKS.txt; D proposed, not built. 2026-10-09: A rebuilt on eight targets + dN/dS (v2, scaffold 16). Checks pass
**Last touched** · 2026-10-09

## What the lesson is

- Mutation as an event you make and then watch: what one change does to a protein, how often a new change is lost or takes over, why a genome that never recombines loads up, how recombination itself makes deletions, duplications and inversions.
- Worth protecting: every change is one the student made by hand; the fates are measured off 100 populations, never asserted.

## JM's plan, 2026-10-08 (dictated; speech-to-text as given: "code on chart as a circle regular diagram" = the codon chart as a circular diagram, "illegal" = allele, "Mueller's" = Muller's, "myosis" = meiosis, "camp meats" = gametes, "low si" = loci)

> Part A should be the big part. It should feature a diagram showing a long stretch of nucleotides. It should feature the code on chart as a circle regular diagram off to the side. And above the sequence should be the amino acids it codes for. There should be a start code on and a stop code on. The sequence doesn't need to be a real protein, but if possible, that'd be great. But it doesn't have to be short enough. that students can see the individual nucleotides. The idea is they would click on a nucleotide and they'd have the option to add nucleotide at its position. Delete that nucleotide or change it when they change it, they can change it to any of the other 3 possible nucleotides. Once they've made their decision, they identify what kind of mutation it is, an insertion, a deletion, a transversion, or a transition. And if they had any kind of change to amino acids, the amino acids and the diagram dynamically change. Including if the reading frame is shifted. So we need to show some nucleotides, 5 and 3 prime of the sequence of interest. What then plays out is if they made a non-synonymous mutation, they set an H and an S for their hypothetical protein. Uh, and it starts off, and a simulation is run with That as a new mutation in the population of a particular size. If they made a synonymous mutation, then all they can change is the size of that. Population. And it plays out, um, a simulation showing 100 runs of 100 populations with that. Uh, for 4 NE generations. And then they see what percentage of their runs did the illegal go extinct? What percentage did it reach fixation, if any? And then they do it again. And the idea is that they would generate 10 mutations this way and watch 10 of them play out as part A. Um, They wouldn't have any targets for this one. It would just be, did they correctly identify the mutation each of those 10 times? Which they should be able to just look up. I just want them to have to do it.

> Part B should be about Mueller's ratchet. We need a Mueller's ratchet part for part B. where they have an asexual reproduction, and they produce gametes, and they do sexual reproduction, they produce camp meats. And the fitness effects are shown. Something kind of like the meosis and game interactive. We did in a prior lesson.

> Part C should be about the mechanics or recombination. Um, and they should have some manner of interactive where they line them up. Uh, and some chance of or way to manipulate them so that they can create an inversion. However, we do the 2 chromosomes snapping together for recombination, we should have it so that they can snap to create and insert an inversion and deletion. Um, I'm not sure what to do. for targets there, but I like that idea.

> The final part, part D needs to be something that will lead into migration, which will be the next lesson after this one. So something with identical by descent blocks and hapletypes, which can connect the inversions above. This one I haven't fully cooked.

## Read as (mine; JM may overrule)

A
- The sequence is real: the E. coli trp operon leader peptide, trpL (MKAIFVLKGWWRTS, 14 amino acids + TGA), from the K-12 MG1655 genome (NC_000913.3, minus strand, 1323037-1323081), with 16 nt of the real sequence 5' (holds the ribosome-binding AAGGG) and 83 nt 3'. 144 nt, four rows of 36. Not named on the page (no gene names needed; JM's call).
- 3' flank sized so every reading frame meets a stop in view: frame 0 (stop codon lost) at +27, +1 at +82, +2 at +53 (measured on the real sequence).
- Reading = the first ATG from the 5' end to the first in-frame stop, so a change can also lose the start (the next ATG down takes over) or make a new one upstream (C→G at the ATC 7 nt up makes an out-of-frame start). Nothing is special-cased.
- DNA letters on the wheel too (T, not U), so the student reads the wheel off the same letters as the sequence.
- "100 runs of 100 populations" read as 100 populations, one run each, drawn as 100 lines. Flag.
- 4N generations at the N set (Wright-Fisher, N diploid, so Ne = N). N 10-1000.
- Fitness 1 / 1 − hs / 1 − s (JM's form; s > 0 harmful).
- "Synonymous" = the amino acids from start to stop are unchanged (a change outside the reading counts). Then s = 0 and only N is set.
- Each new mutation is made on the original sequence (a new change arises in a copy of the gene as the population has it).
- ~~The kind is asked once the change is made (insertion / deletion / transition / transversion); ten mutations, ten bits.~~ Replaced 2026-10-09 (JM): eight text targets, below.
- Targets (JM 2026-10-09): one synonymous, three nonsynonymous beneficial, three nonsynonymous harmful, one noncoding. Order mine: syn, harm, ben, noncoding, harm, ben, harm, ben. Beneficial / harmful = the sign of the s the student sets (s < 0 / s > 0), so the target also asks whether they read 1 − s right.
- Kind read off the result: protein changed = nonsynonymous (a new start upstream counts); protein the same with the letters start-to-stop unchanged = noncoding; otherwise synonymous. By result because one outcome can be clicked two ways (taking out the A of ATG = taking out the A before it).
- A target stays until hit; the first scored try is the bit; practice switch as B and C. The verdict and the protein sentence wait for Go.
- 1,000 populations a change (JM's "100 runs of 100", agreed 2026-10-09); every one a line, the first 100 squares. N 10 / 20 / 50, set on the first scored Go and held for the eight, so dN/dS compares like with like.
- A table of the eight: kind (✓/✗ first try), the change, what it did to the protein, s, h, extinct / still present / went to fixation.
- After the eight, dN/dS: a bar per change (went to fixation, of 1,000), dashed lines at the synonymous change and the nonsynonymous average; noncoding drawn, left out. One line: dN/dS = dN ÷ dS = ratio.

B
- Two populations side by side, one copying itself (no sex), one with meiosis and mating; each harmful mutation multiplies an individual's young by 1 − s; new ones arrive at U per young; none is ever undone.
- First a bench, lesson 9's in miniature: one parent copies itself (the young carries everything it had, plus anything new); one parent and a mate each make four gametes by meiosis, with a crossover the student places, and the student fuses one from each. Task: a young with fewer harmful mutations than either parent (only sex can do it).
- Then the ratchet: the fewest harmful mutations any individual carries, generation by generation, for both populations, and the load histogram (its left bar is the best class). Bowling rounds on how many times the best class is lost.

C
- Chromosomes of eight genes with short repeated stretches between some genes, some pointing one way, some the other. Drag the lower chromosome along the upper; it snaps wherever two repeats (or the genes) line up. Or drag a repeat onto another repeat on the same chromosome: it loops (same direction) or folds back (opposite). Then one crossover at the paired spot.
- What comes out follows the real rules of crossing over between repeats: genes lined up → two normal recombinants; two repeats facing the same way on two chromosomes → one chromosome missing the stretch between, one with it twice; on one chromosome, same way → the stretch loops out and is lost; opposite ways → the stretch comes back reversed (an inversion); opposite ways on two chromosomes → a chromosome with two centres and one with none.
- Targets (proposal, JM unsure): a normal recombinant; a deletion; a duplication; an inversion; then a snake carrying one inverted chromosome, where only a crossover outside the reversed stretch gives a gamete with every gene once. That last one is D's hook: an inversion keeps its stretch together.

D (proposal, not built)
- A migrant arrives on an island; its chromosomes painted in its own colour. Generations of crossing over chop its stretches into shorter and shorter blocks shared among its descendants: identical by descent. Reads: find a block two chromosomes share; lock in when the migrant arrived from block lengths (the page reruns it six times); the migrant's inverted stretch (from C) never breaks, so the longest block is not the youngest. Leads to 17: migration dated by block length.

## Items

| # | Stage | What | Status |
|---|-------|------|--------|
| 1 | A | sequence panel: 144 nt, amino acids above, start/stop marked, click → change / insert / delete | done: four rows of 36; codons drawn over their letters (split across rows); changed amino acids outlined red; a deletion marked by a caret; every tenth letter numbered; pop-up at the letter (3 changes, 4 insertions, take out) |
| 2 | A | codon wheel (canvas), old and new codon lit | done: T C A G from the middle out, DNA letters; hover a codon to light it; after a change, old (blue) and new (red), path drawn |
| 3 | A | kind question (4 buttons), first answer the bit | done: wrong → "incorrect — try again"; the right one opens the sliders; "Take it back" until the first answer |
| 4 | A | s, h, N; 100 populations for 4N generations, animated; lost / still here / taken over; the long-run formula beside (formula off, 2026-10-09: item 13) | done: lines + a 10 x 10 grid (a square fills by share; ✕ lost; black in every copy); the first 20 generations over 2.4 s, the rest by 6 s; s from −0.1 to 1 in 14 steps, h 0-1, N 10-1000 |
| 5 | A | the ten-mutation table; R panel | done; an eleventh change onward plays but is not counted |
| 6 | B | bench: copy vs meiosis + fuse; the task | done: parents [2,4 / 8] and [6 / 1,3]; a clean young needs the parent's crossover after gene 4-7 and the mate's after 3-5; without crossovers the best is 2 |
| 7 | B | ratchet engine; both populations; histogram + best-class plot; rounds (practice); R panel | done: 200 generations, worked out in slices while it plays at 50 a second; three rounds (one slider free each, the others held) |
| 8 | C | the snap-and-cross interactive; products classified; five targets | done: drag the lower chromosome (snaps at 0 or repeat over repeat, within 24 px), drag a repeat onto a repeat on the same chromosome (loop / fold); a free try, then five targets, practice; after the reversed board, the count of safe places |
| 9 | — | scoring, gates, LOCKS row (x), landing card | done: `version: 1`, `scaffold: 18` (A1-A10, B1-B3, C1-C5) |
| 10 | — | `check_lesson16_numbers.js`: translation, classification, fates against Kimura, ratchet bars, C's rules | done: 34 checks, ~40 s, R panels through Rscript |
| 11 | D | JM to settle the proposal | open |
| 12 | A | JM 2026-10-09: s and h not locked on a synonymous change (the rows were `hidden`, but `.tbar`'s display:flex beat the attribute; the check read the attribute) | done: rows stay in view, held (greyed, disabled); s set to 0 while held, the student's s back on the next change; the check reads `disabled` and the slider's value |
| 13 | A | JM 2026-10-09: the text under the graphs is too long. Runs: "In X populations where this mutation arose, it went extinct in Y after Z generations." | done: the runs line is JM's sentence and nothing else (no still here / in every copy; the table keeps the counts); the long-run formula and its two checks gone (git has them); the sequence line cut to the protein's length, plus a word when there is no start or the stop is off screen; the check reads the sentence back against the run |
| 14 | A | JM 2026-10-09: clearer column names in the table ("went to fixation" not "in every copy", "extinct" not "lost") | done: extinct / still present / went to fixation; the R panel's labels match |
| 15 | A | JM 2026-10-09: synonymous / nonsynonymous instead of transitions and transversions | done, then superseded by 16; kinds synonymous / nonsynonymous / noncoding (JM chose the third) |
| 16 | A | JM 2026-10-09: a text target per change in place of naming it: 1 syn, 3 nonsyn beneficial, 3 nonsyn harmful, 1 noncoding | done: v2, scaffold 16 (A1-A8); retry until hit, first scored try the bit; practice |
| 17 | A | JM 2026-10-09: dN/dS at the end from the student's own results | done: 1,000 populations a change, one N for the eight (JM chose both); N capped at 50 so the synonymous change fixes somewhere |
| 18 | A | the pooled ratio with 3 beneficial + 3 harmful usually comes out near or above 1 (beneficial fixations swamp the harmful zeros); real genes, mostly harmful changes, sit below 1 | done (JM 2026-10-09: break it into beneficial / harmful): two ratios, two lines; no pooled one |

## Measured (2026-10-08)

A (node prototype of `A_fate`, 2,000 runs a setting; share lost / still here / in every copy at 4N, then the long-run formula):

        N 10 neutral              93.3 / 3.3 / 3.5     (5.0)
        N 100 neutral             99.5 / 0.3 / 0.3     (0.5)
        N 100, h 0.5, s −0.05     95.3 / 0.1 / 4.6     (4.88)
        N 100, h 1, s −0.05       90.7 / 1.1 / 8.2     (8.97)
        N 100, h 0, s −0.05       98.2 / 0.1 / 1.8     (1.78)
        any N, s 0.1 or more       100 lost
        lost within               5-13 generations on average

- So most of the ten rows read "lost 100". Small N or a helpful s is where anything stays.
- trpL frames after its stop: a stop at +27 (frame 0, the stop codon lost), +53 (+2), +82 (+1). Every one-letter indel in the reading meets its stop by letter 144.

B (node prototype of the page's engine; best = fewest harmful changes anyone carries at generation 200; 10th-50th-90th of 40 runs):

        U 0.3, s 0.1      N 20: 16-19-24 / sex 0-1-3     N 100: 4-7-10 / 0     N 500: 0-1-3 / 0     N 1000: 0-0-1 / 0
        N 100, s 0.1      U 0.3: 4-8-10    U 0.5: 15-19-22 (sex 0-1-1)    U 1: 52-59-67 (sex 3-4-6)
        N 100, U 0.3      s 0.02: 24-29-34 (sex 5-9-12)    s 0.05: 14-17-21    s 0.2: 0-0-1

- With sex the average settles at U/s (2.84 at N 500, U 0.3, s 0.1, against 3.0). Without sex the best class is lost again and again; the rate goes with N e^(−U/s).
- Starting clean, both populations' best rise at first while the load builds; only the one without sex keeps rising.
- Rounds' hit rates (100 runs a setting): see "Round windows" below.

A, 2026-10-09 (the page's A_fate; 200 sets of 1,000 populations, by 4N): went to fixation per 1,000, and how often none

        neutral   N 10 33.3 (0)   N 20 15.5 (0)   N 50 6.3 (0.2%)   N 100 3.0 (~5%)   N 200 1.4 (22%)   N 1000 0.3 (74%)
        N 20      s 0.1 1.4 · s 0.02 10.3 · s 0.005 14.3 · s −0.01 18.4 · s −0.05 37.5
        N 50      s 0.1 0.0 · s 0.02 2.2 · s 0.005 4.8 · s −0.01 9.8 · s −0.05 37.9
        N 100     s 0.1 0.0 · s 0.02 0.2 · s 0.005 1.8 · s −0.01 7.5 · s −0.05 46.4

- One synonymous change is the yardstick, so N stops at 50. Opening N 20.
- Every one-letter change in view: 30 synonymous (28 substitutions, as the codon table gives, + 2 indels in TGA that make TAA / TAG), 328 nonsynonymous, 794 noncoding.

## Round windows (B; node prototype of the page's engine, 100 runs a setting, share hit)

        R1  without sex, best <= 3 at 200 (U 0.3, s 0.1; N free)          N 100 4% · 200 37% · 500 98% · 1000 100%
        R2  without 12-25, with sex <= 2 (N 100, s 0.1; U free)           U 0.3 2% · 0.4 69% · 0.5 97% · 0.6 43% · 0.7 1%
        R3  without 12-25 (N 100, U 0.3; s free)                          s 0.02 28% · 0.05 97% · 0.1 1% · 0.2 0%

- Openings (N 100, U 0.3, s 0.1) hit 4 / 2 / 1%. R3's naive move (harsher harm) hits 0%.

## Open for JM

- ~~"100 runs of 100 populations" read as 100 populations.~~ Settled 2026-10-09: 1,000.
- ~~Item 18, the pooled ratio.~~ Settled 2026-10-09: beneficial and harmful apart.
- trpL is real but unnamed on the page. Name it (and the trp operon) in a setup bullet?
- C's targets are mine. D is a proposal.
- B's round 1 is a floor (3 or fewer), cleared by N 500-1000; one step up from the opening (N 200) clears it only sometimes. The ratchet is noisy; the windows are set on the idea (bigger, more, milder), not one step.
- B's bench has no new mutations (only what the parents carry); the populations do.
- C has no R panel numbers to check beyond the products; its R panel writes the crossover rules out.
- Voice blocks: none.

## Rulings

- 2026-10-09: a synonymous change locks s (at 0) and h, in view.
- 2026-10-09: kinds synonymous / nonsynonymous / noncoding (a third button for the flanks); then text targets in place of naming: 1 / 3 beneficial / 3 harmful / 1.
- 2026-10-09: 1,000 populations a change, one N for all eight (for dN/dS).
- 2026-10-09: dN/dS beneficial and harmful apart, no pooled ratio.
- 2026-10-09: the table's fates are extinct / went to fixation (his words); "still present" is mine.
- 2026-10-09: the runs readout is one sentence, his: "In X populations where this mutation arose, it went extinct in Y after Z generations." Too many specifics under a graph hide what to look at.

## Do not

- Draw the trpL 3' flank shorter than 83 nt: a frameshift then runs off the screen without a stop.
- Special-case start or stop codons: the reading is found the same way after every change.
