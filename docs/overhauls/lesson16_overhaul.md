# Lesson 16 — mutation: what a change does; copy or mate; your DNA in pieces; an inversion

**File** · `app/lessons/lesson16.html`
**Checks** · `node scripts/check_lesson16_numbers.js` · `python3 scripts/check_lessons.py`
**Status** · first pass built (2026-10-08): A, B, C from JM's plan, locked in LOCKS.txt. 2026-10-09: A rebuilt on eight targets + dN/dS (v2); then B's spread + one-population rounds, C's watch, a new D (v3, scaffold 19). 2026-10-11: B rebuilt as copy or mate (a plan played in 100 populations), C and D drafted on its engine (v4, scaffold 15; section below). Checks pass. Items 6-11 and 20-24 below describe the archived B-D
**Last touched** · 2026-10-11

## JM, 2026-10-11: B rebuilt as a game; C and D built off it

> I don't like Part B of lesson 16. The mutations are fixed and don't change, and it doesn't really get to the idea of muller's ratchet. Parts C and D also don't build off from it. I'd like B to be the base and heavily adjusted--the goal is to build student understanding. The core idea I want to emphasize is: sexual reproduction makes your offspring have a larger variance & so the potential for them to be better...but at the cost of reducing how many copies of "yourself" there are in the next generation. The current setup is overly complicated and overly wrote. Making it more of a game with students making choices each generation would be good. Some systems where they have no chance for sexual recombination (and so bad mutations build up via drift), some where they can (but in stable environments their bespoke genome would get broken up for no reason). I am imagining a student selecting a few different options from dropdowns, and then a bunch of populations are simulated based on those choices, and they view summaries of the outcomes. The idea of identical-by-descent blocks could emerge from here as we trace the idea of a genome having heritability over the time. The idea of inversions stopping recombination and so resulting in chunks of the genome as evolving without recombination & all that brings to bear.

JM, the same day, before seeing the first build:

> I can't see the new b yet, but I had some ideas before we get too far on C/D. For B, letting the student make their choices and then showing side-by-side populations where the goal is to see how many copies of the originator exists after N generations. Control mutation rate, environmental change rate (basically just how much a genome's w varies). A Price equation style approach emphasizing the idea that the unit isn't exactly an organism, and a genic-level view

Read as (mine; JM may overrule):
- The student is one genome: a female in a sexual population of 40, her DNA red. Her line (her daughters, theirs) **copies** (every young a daughter, all of her) or **mates** (half the young sons; each young half her).
- **Plan first** (his second message): a strip of N cells, copy or mate each generation, click to switch or fill from a menu; then Go plays it in 100 populations. A first build stepped one generation at a time; replaced before he saw it.
- **Copies of you** (the originator): each female counts by how much of her DNA is red. The window on every target.
- **Side by side**: ten of the 100 populations, each female a square shaded by how much of her is you, copies labelled; click one to see its chromosomes and its last young.
- **Controls**: harmful changes a young (U) and how far the best value wanders a generation (a normal step, kept in 6-18): a genome's w swings with it. Held by each target, free after the three.
- **Price, two ways** (lesson 13's terms, mothers the parents, exact): for your DNA and for whole copies of you (a female who is you, every gene). Copying puts everything in cov(w, z); a mating ends every whole copy in E(wΔz) while your DNA goes on, a little diluted. A pure gene-level split (fathers as parents too) puts it all in cov, but its "before" is females and males together and no longer matches the plots; not built.
- Old B, C, D archived whole: `app/archive/lesson16_with_BCD_2026-10-11.html`.
- C (draft, built before his second message): B's engine, 40 genes, about one crossover a gamete, nothing helps or harms; still one generation at a time. Your DNA whole under copying, in pieces under mating, shorter each generation of it; click two females to see where both carry your DNA at the same genes. Leads to 17 (a migrant's pieces).
- D (draft): an inversion. A team of alleles at genes 9-16 on your chromosome, a help in one copy; inverted, it passes whole in carriers of one copy, so the team holds; if two copies kill (ruffs, fire ants), it stays in single copies, never crosses over, and harmful changes pile up inside it, B's copying line again inside one chromosome.

Model (B; the page's engine, `cmStep`; C and D run on it):
- Females and males; every female has 6 young; at most 40 (B) or 60 (C, D) of each sex live. A young lives with chance exp(-(z - best)² / 6) × 0.88^(harmful changes) (B); z the dark alleles on 2 × 12 genes; no new trait alleles, so copies stay alike; harmful changes Poisson(U), never undone; crossovers chance 0.2 a gap.
- Fathers: this generation's males (sons of last generation's matings). When your line mates after copying it has no sons, so each of its mothers counts as a son she made as a copy of herself (aphids, water fleas); without that a line that copied everyone away could never mate again.
- Start: 5 generations of mating from alleles at 50%; you replace one female: 6 dark alleles on each chromosome, opposite halves, at the best value.

Measured (the page's engine in node; 100 populations, two to six starts; copies of you at the end):

        still, 6 generations                copy every generation 37 · mate 0.8 · every 5th 23 · only at 6: 26-28
          (10 generations: every 10th 38.5 against copy 39.6: a mating after your copies fill the population costs nothing; hence 6)
        wanders 1, 30 generations           copy 8-12 · every 3rd 11-12 · every 5th 18-21 · every 10th 22-24 · mate ~1
          (20 generations: copy reached 19 and met every 5th; hence 30)
        harmful changes 0.7, 100 generations copy 3-4 (the populations die out) · every 5th 29-31 · every 10th 28 · every 20th 9-13
        C, at generation 8 (females carrying you / average piece): copy 8: 41 / 40 · copy 6, mate 2: 42 / 26 · copy 5, mate 3: 39 / 17 · mate 8: 12 / 5
        D, team lasts at 40 (of 100): inverted 55-71 · standard 8-17;  at 100, harm 0.5, fewest inside the team's chromosomes: inverted + two kill 1.2-1.7 (others 0.00) · two help 0.04-0.37 · standard 0-0.86 from 5-13 populations

Items (2026-10-11):

| # | Stage | What | Status |
|---|-------|------|--------|
| 25 | — | archive the page whole (B, C, D as of `305611b`) | done |
| 26 | B | plan strip; ten populations side by side; one up close with its young; over time (copies / whole copies / trait and best value / fewest harmful changes / females); Price for your DNA and for whole copies | done |
| 27 | B | three targets: still, 6 gens, ≥ 30 copies; wandering 1, 30 gens, ≥ 16; harmful changes 0.7, 100 gens, ≥ 20; practice; free play after (U, wander, N, plan) | done |
| 28 | C | your DNA in pieces: two targets (pieces 20-30 / 10-20 at generation 8, 30+ females), compare two females | draft, built before JM's second message; still step by step |
| 29 | D | the inversion: two targets (the team in 40+ populations at 40; at 100 the team in 40+ and fewest inside ≥ 1) | draft |
| 30 | — | scoring v4, scaffold 15 (A1-8, B1-3, C1-2, D1-2); checks rewritten for B-D (36 + R panels) | done |

Open for JM:
- C and D are drafts he has not seen; he had ideas for them. C still plays one generation at a time; B's plan strip would carry over.
- The Price panel: mothers as parents (exact, matches the plots). Is "whole copies of you" against "your DNA" the organism / gene contrast he means?
- B's still world is only 6 generations: at 10, mating once your copies fill the population costs nothing, and "mate every 10th" cleared all three targets.

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
- 2026-10-09: B shows (1) sex's young spread wider than copies, (2) stable environments favour low variation and unstable ones high, and that sex halves what a parent puts in each young. C: watch events from a menu, then the manipulation and its five targets. D: an inversion in one population, its alleles riding together.
- 2026-10-09: the table's fates are extinct / went to fixation (his words); "still present" is mine.
- 2026-10-09: the runs readout is one sentence, his: "In X populations where this mutation arose, it went extinct in Y after Z generations." Too many specifics under a graph hide what to look at.

## Do not

- Draw the trpL 3' flank shorter than 83 nt: a frameshift then runs off the screen without a stop.
- Special-case start or stop codons: the reading is found the same way after every change.
