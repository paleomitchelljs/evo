# Lesson 19 — speciation: apart and back in contact, an inversion, a choosy allele

**File** · `app/lessons/lesson19.html` — first draft 2026-10-17
**Checks** · `node scripts/check_lesson19_numbers.js` · `python3 scripts/check_lessons.py`
**Status** · pass 2 built (v2, scaffold 9: A1-A4 drawn rounds, B1-B3, C1-C2); LOCKS `x`; JM to review; voice owed (JM to dictate)
**Last touched** · 2026-10-17

## What the lesson is

- Lesson 17's engine and bead strings, with three additions: mutations in each population's own colour, incompatible pairs of genes, and a choosy allele. Barriers between populations build up while they are apart, an inversion holds them, and choosiness spreads where the two meet. F_ST between the two populations is on screen throughout: over time (A), gene by gene (B), against choosiness (C).
- Worth protecting: nothing on screen says "incompatible" in advance of what the run shows. Every barrier comes out of mutations that did nothing at home.

## JM's note, 2026-10-17, mid-build (verbatim)

> One general note: I'd like to transition to more "students draw what they expect". I like bowling activities, but more activities where the students manipulate a graph to produce what they think the controls will do, then hit go, then a series of simulations run & how often the student drawn prediction falls inside the cloud is recorded & shown

Done for A (pass 2); B and C are still bowling. REVISIONS_PLANNED row 15.

## JM's brief, 2026-10-17 (verbatim)

> Lessons 19 & 20 should be on speciation (19) and phylogeny (20). Species selection & macroevolutionary rates will be 21, I think. For 19, I'd like the migration style interactives and we should show how Fst between the two populations varies. I'm envisioning something where Dobzhansky-Muller incompatibilities & the role of inversions & re-enforcement all factor in and/or emerge from simulations that are very similar to what the students have recently done

## Stages as planned

One engine (17's `mg*`, copied: 19 is its second caller, so no extraction yet). Two populations of N genomes, one chromosome of 40 genes, Wright-Fisher, parents picked by fitness, R crossovers a chromosome, migration as 17's swaps.

    A  Apart, then back in contact. One grey population splits in two; while apart, each takes new mutations in its own colour
       (orange left, blue right; mu .004 a gene a generation); nothing helps or harms at home. Before the run, 2 in every 100
       ordered pairs of genes (orange at i, blue at j) are made incompatible: each such pair in one genome halves its fitness.
       Then 100 generations of contact at m. Sliders: generations apart, m. N 25, R 1, 50 pairs.
       Displays: board (pair 1), over time across the split and contact (F_ST, mutations a chromosome, incompatible pairs in a
       hybrid, hybrid fitness, other colour), a hybrid's grid (rows its orange mutations, columns its blue, red = incompatible),
       your runs (mutations and incompatible pairs against generations apart).
       Pass 1 (98e3698): three bowling targets. Pass 2 (JM's note above): four drawn rounds. Practice ticked at the start (free
       play, own settings, draw or not). Unticked, a round holds its settings and the measure: drag across the over-time plot to
       set a dot every 25 generations (Go waits until all are set; Clear drawing); Go plays 50 pairs; the cloud is the middle
       90% of them at each generation; a dot inside (give or take 2% of the axis) turns green. One bit a round (half the dots or
       more inside), "kofn" in the notes (A_in1-4), a row in "Your predictions" and a dot on its plot; Next round. Rounds:
       1 hybrid fitness, 200 apart, m .05; 2 F_ST, 50 apart, m .1; 3 F_ST, 150 apart, m .05; 4 F_ST, 150 apart, m .2.
       Task: five times apart on your runs.
    B  An inversion. Lesson 17's start (each population all its own colour, every gene different), no new mutations; two pairs
       incompatible, marked: orange at gene 10 with blue at 15, orange at 30 with blue at 34. The blue population carries an
       inversion the student drags across the gene strip. N 25, 50 pairs, 100 generations.
       Displays: board with brackets on inverted chromosomes, F_ST gene by gene with the pairs and the inversion drawn, over
       time (F_ST at each pair, all genes, chromosomes that fit both populations), the sparrows from 17 D.
       Targets: 1 R 4, m .02 held: hold genes 10 and 15 (F_ST .7+ at both) -> invert across both; 2 inversion over 8-17 held:
       mix them anyway (under .4) -> m .05+; 3 no inversion, m .02 held: hold the pair another way (.65+) -> R .5 or .25 (opens
       at R 1, which straddles .6). Inversion set by dragging across a strip under the gene-by-gene plot; a click removes it.
    C  A choosy allele. A's world (split, apart, incompatible pairs, contact), with N 100 (chance matters less), gene 20 held
       apart by local adaptation as in 17 C (the other population's allele 1, .75, .5), gene 1 the choosy gene: 20% of
       chromosomes carry the choosy allele at contact. A choosy genome turns a partner down with chance = how different
       they look (look: the share of its mutations in orange). 150 generations of contact. Sliders: generations apart, m.
       Displays: board (look swatch, choosy bead), over time (choosy share, young from mixed pairs, F_ST, hybrid fitness), your
       runs (choosy share at the end against m, coloured by time apart).
       Targets: 1 200 apart held: choosy allele half of all chromosomes or more at contact 150 -> m .2 (opens at m .1, .39-.45);
       2 m .2 held: choosy allele under 10% -> 50 apart or fewer (opens at 100). Task: six runs on your runs plot.

## Measured (node prototype of the engine, scratchpad, 2026-10-17)

        A, N 25, mu .004, R 1, 2/100 pairs incompatible, each halves fitness, six incompatibility maps (23-31 pairs), 50 pairs each
          generations apart            25      50      75      100     150     200
          mutations a chromosome       3.7     7.3     10.5    12.9    18.3    22.7
          incompatible pairs, hybrid   .27     1.0     2.3     3.4     6.4     10.3     (the snowball: pairs of mutations 13 / 54 / 111 / 168 / 333 / 515)
          hybrid fitness at contact    .87-.91 .60-.70 .36-.48 .20-.29 .03-.10  .01
          F_ST at contact              .15     .29     .37     .46     .59     .69
          F_ST after 100 at m .05      .05-.07 .07-.09 .14-.22 .27-.37 .45-.54  .58
          150 apart, after 100 at m:   0 .75, .02 .62, .05 .45-.54, .1 .09-.14, .2 .01-.02
          m .02 is a poor contrast: mutation during contact keeps F_ST up (0 apart reads .18 after 100)
        B, 17's start, pairs (10, 15) (30, 34), each halves fitness, N 25, 50 pairs, at 100 (F_ST at 10 / 15)
          R 4, m .02: none .34/.31; inverted 8-17 .82/.82 (pair 2 .54); 10-15 .81; 11-20 (15 only) .57/.58; 5-12 (10 only) .39/.43;
            1-8 .36/.35; 28-37 (pair 2) .47/.53, pair 2 .73
          inverted 8-17, R 4, m .01 / .02 / .05 / .1: .92 / .82 / .25 / .00
          none, m .02, R .5 / 1 / 2 / 4 / 8: .73 / .63 / .54 / .33 / .35
          R 1: the whole chromosome holds without an inversion (one chromosome is all linked); islands need R 4
          cost .9 or m .02 at R 1: everything held; cost .5, m .05, R 1-2: everything mixes, inverted or not
        C, A's world at N 100, gene 20 local adaptation s .5 h .5, choosy 20% at contact, 10 pairs, choosy share at contact 150
          apart \ m       0     .02   .05   .1    .2
          50 (w .58)     .20   .16   .30   .14   .00
          100 (w .19)    .20   .29   .27   .42   .52
          150 (w .05)    .25   .18   .40   .46   .59
          200 (w .01)    .13   .24   .38   .49   .71
          young from mixed pairs at m .2: S 1 .014-.06, the effect off .15-.2
          F_ST between the places barely moves with choosiness (hybrids already rarely breed; the migrants themselves set it)

        The page itself, 2026-10-17 (three runs each unless said; A's list held 26 pairs on that load)
          A  hybrid fitness at contact, 25 / 50 / 75 / 100 / 150 / 200 apart: .88 / .59-.70 / .42-.45 / .19-.28 / .09 / .01-.03
             F_ST after 100 at m .05: 0 apart .05, 25 .06-.07, 50 .06-.11, 75 .17-.18, 100 .30-.35, 150 .41-.53, 200 .49-.58
             150 apart, m .02 / .1 / .2: .62-.66 / .11-.12 / .02
             100 -> 200 apart: mutations 1.66x, pairs of mutations in a hybrid 2.77x, incompatible pairs 2.93x
          B  F_ST at 10 / 15 at 100: none .29-.48; inverted 8-17 .78-.82; 10-15 .79-.81; 11-20 (15 only) .41-.66; 14-23 untested on
             the page (prototype .38); 5-12 .31-.44; 1-8 .29-.43; inverted 8-17 at m .01 / .05 / .1: .9 / .19-.28 / 0
             none at m .02, R .25 / .5 / 1 / 2 / 4 / 8: .76-.82 / .71-.78 / .57-.64 / .43-.66 / .29-.48 / .22-.36
             chromosomes that fit both (blue at 10, orange at 15): none ~.4 at 100; inverted across both: never one
          C  20 pairs, choosy share at contact 150: 200 apart, m 0 / .02 / .05 / .1 / .2: .13-.29 / .16-.26 / .27-.34 / .39-.45 / .59-.68
             150 apart m .1 .44-.50, m .2 .55-.58; 100 apart m .2 .46-.59; m .2 at 50 apart 0-.09, at 0 apart 0
             young whose parents look different, 200 apart m .2: 1-2%
          Checks: `scripts/check_lesson19_numbers.js`, 29 checks + two canvas widths + three R panels, ~2 minutes.

        A's drawn rounds (the page; a drawing's dots inside: the 50 pairs' median / straight to the contact value / one
        straight line / right while apart then flat at contact):
          1 hybrid fitness 13/13 11/13 7/13 13/13; 2 F_ST 50 apart m .1: 7/7 7/7 5/7 3/7; 3 F_ST 150 apart: 11/11 11/11 5/11
          11/11; 4 F_ST m .2: 11/11 11/11 5/11 7/11
          incompatible pairs can't be drawn usefully: the 50 pairs spread 5-15 at contact (a straight line scores 12/13)
          50 apart at m .05: the cloud after contact sometimes reaches .48; "flat at contact" scored 3, 5 and 7 of 7: m .1 instead

## Why C is built the way it is (measured dead ends, 2026-10-17)

- N 25: drift swamps the choosy allele (its pull is about m x (1 - hybrid fitness), ~.05). N 100 gives a clean signal.
- Without local adaptation, choosy migrants find each other and breed true in the other place: both kinds live in each place and F_ST between places FALLS as choosiness rises (m .05: .31 with, .59 without). Gene 20 (17 C's) stops that.
- One place (the two merged): one kind takes over within ~20 generations whatever the choosiness; 0/20 kept both.
- Mate search limited to 3 tries: choosiness barely spreads (10% to 18%).

## Open for JM

1. Voice: none yet. Corpus candidates (quoteable, BIO 202): A 202_lec24_02 (sugar flask: "a separation that stops fixation"), 202_lec20_03 (drift and migration mirror images); B 202_lec12_04 (inversions lock genes together; gives away little); C 202_lec26_05 and 202_lec28_01 both state C's finding (giveaways; better as the solved banner or after). 202_lec25_06 states B's finding.
2. C's choosy allele is one-allele (choose a partner who looks like you): it needs no linkage. Your lecture (202_lec26_05, lec27_04) frames reinforcement as a race with recombination, a preference that must be linked to the incompatibility or sit inside an inversion. A two-allele version locked in B's inversion is buildable from the same engine; say if you want it.
3. B leaves A's world for 17's (every gene differs, two marked pairs): in A's world the islands are buried in noise (one chromosome is all linked; most genes never differed).
4. A's rule is dominant: one copy of each mutation in a pair is enough to clash, so first-generation hybrids suffer.
5. "Incompatible pairs" on screen; no "Dobzhansky-Muller", no "reinforcement". "Choosy allele", "look".
6. C's F_ST barely responds to choosiness (above): the visible outcome is the choosy share and the young from mixed pairs.
7. C1 is cleared by the top of the m slider (200 apart held): a floor, not a window. C2 holds the same m and wants the opposite fate, which is the contrast; a window on C1 (e.g. 30-45%) would add aiming without adding an idea.
8. C's "hybrid fitness" after contact is a young of one genome from each place, migrants included, so it climbs as the places mix. A defines a hybrid at contact, when the two are still pure.
9. B's R slider runs .25 to 8 (17's ran .25 to 4): islands need R 4, and 8 shows the islands no narrower.
10. A's drawn rounds (pass 2): the cloud is the middle 90% of 50 pairs; at m .05 after contact it is wide (some pairs fuse, the rest hold), so round 3 forgives a lot. Narrower (middle 50%) would score harder; your call. The bit is "half the dots or more inside"; the count itself is in the notes.
11. B and C could take the same drawing: B, the gene-by-gene F_ST profile the inversion will leave (a cloud per gene); C, the choosy allele's course after contact. Not built; say if you want them.
12. The quote corpus file `quoteable/quotes/quotes_bio202.yaml` does not parse as YAML: line 574, the `notes:` of 202_lec07_03 has unescaped double quotes inside a double-quoted string. Not touched.

## Items

| # | Stage | What | Status |
|---|-------|------|--------|
| 1 | — | prototype engine (mutation, incompatible pairs, inversion, choosy allele), measure A-C | done |
| 2 | A-C | build the page from 17's | done |
| 3 | — | `check_lesson19_numbers.js` (29 + R panels) | done |
| 4 | — | LOCKS row (x), index card | done |
| 5 | — | JM's review; voice | todo |
| 6 | A | pass 2: four drawn rounds (draw, Go, share inside the cloud recorded and shown) in place of the three bowling targets; v2, scaffold 9; checks rewritten | done |
| 7 | A-C | declutter, from JM's note on 17 (2026-10-17: *"the screen is cluttered. This is a pervasive issue ... the R code panels should always be last & default to be collapsed"*): all eleven readout lines cut (B's bars/ticks legend moved into its bullet), B's sparrows under the stage, R code last and collapsed; checks: layout check in place of the runs-caption check | done |
| 8 | A-C | hover text, from JM's note (2026-10-17: *"The bullet points could really be turned into hover text over the intro. I don't want to overwhelm students with reading"*): bullets onto the boxes and controls they describe, intro panels removed until a voice, B's sparrows an optional box (closed); 14 marks (A 8, B 3, C 3); checks as 17's (35 + R) | done |

## Rulings

- 2026-10-17 (mid-build): more "students draw what they expect"; bowling stays, but more drawn predictions scored against the cloud of runs.
- 2026-10-17: 19 speciation, 20 phylogeny, 21 species selection and macroevolutionary rates (pencilled). 19: 17's interactives; F_ST between the two populations shown varying; incompatibilities, inversions and reinforcement factor in or emerge.

## Do not

- Measure C's reinforcement on F_ST between places without local adaptation: it runs backwards (coexistence).
- Hold B's islands at R 1: the whole chromosome holds.
- Name the pairs' mechanism on screen before a run shows it.
