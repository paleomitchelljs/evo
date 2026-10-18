# Lesson 18 — the interactive exam key (Exam 02, spring 2026)

**File** · `app/lessons/lesson18.html` — first draft 2026-10-12
**Checks** · `node scripts/check_lesson18_numbers.js` · `python3 scripts/check_lessons.py`
**Status** · draft 2 built (1-5 + extra credit), checks green (21 bars); LOCKS `o` (unlocked 2026-10-14, JM); done (JM, 2026-10-14, after the clock target's menus, window and axis)
**Last touched** · 2026-10-14
**Source** · `notes/exams/2025.5/exam02_key.tex` and `exam02.pdf` (question text and key answers quoted verbatim on the page; the keys read "your simulations' ...")

## What the lesson is

- One stage per exam question: the question as printed, a simulation built for it, a target shaped like the question's plot or table. Hitting the target opens the key's answers, each beside the number from the student's own run that shows it.
- Abnormal on purpose (JM): no sequence; every stage open at once; the code mints when every target is hit.

## JM's brief, 2026-10-12 (verbatim)

> For lesson 18, I'd also like a draft. This lesson would be abnormal. I am looking for an "interactive exam key" where students get a bespoke simulation that lets them generate data similar to what is shown in the question plots and their goal is to hit a target that looks like the empircal data.

## Stages as built (draft 2, 2026-10-13, v2, scaffold 10)

    1  Pingelap. One target: 100 islands, 9 generations, at least 1 at 10%+. DAG: rate of colorblind mutation, colorblind homozygote fitness (s), heterozygote colorblind phenotype (h), census N, inbreeding F (0, cousins, half-sibs, siblings). The world comparison is gone. F and colorblind / q^2 shown beside drift alone, 1 - (1 - 1/2N)^9.
    2  Turtles. General model: mutation rate and the mean s, h of new mutants (shared arrows, two per control, grow together), average relatedness to mates and census N per species. Hatching comes from the new mutants' genotypes (0.95 x product), not asserted. N held at 39 / 109 until the target is hit, then free. Table and drop-down plot kept.
    3  Thornton (unchanged).
    4  Bighorn. Birth-death DAG: additive genetic variation -> horn phenotype -> births (mating edge) and -> rams hunted -> deaths (hunting); hunter preference onto the horn -> hunted arrow; horn -> deaths directly is a fixed 0; births, deaths -> population size -> inbreeding -> variation, and population size -> variation. Engine adds preference (Gumbel top-k on preference x horn z; 0 random, 50 the largest first).
    5  CTVT. Five tumors (N cells, a generation a year, asexual). DAG with signed arrows (blue +, red -) for s per gene class. Three targets on one card: the clock (y0, rate; s held 0), the table (dN/dS; y0, rate held), selection shrinks diversity (pairwise differences under half of 2 N rate). Outputs: clock plot, genealogy (lineages back) or pairwise differences, dN/dS table.
    F  Extra credit: boxes now "s for G allele" and "h for G allele".

## Measured, draft 2 (node prototypes in scratch; the page's check agrees)

- 1: islands at 10%+ of 100, 6 reps: N 10 s .01 10, s .3 h 0 6-8, s 1 h .5 0; N 20 s .3 h 0 1.8-2.8 (3 of 3 hits); N 50 0-1; N 100, 300: 0.
- 2: u .025, s .1, h .02, box 0.7 relatives: spotted .84 / .80 / .71, box .61 / .72 / .58 (Ho / He / hatching). With s 0 hatching .95 whatever the mating. Box He sits below the table's .85; the window is .66-.91.
- 4: preference 0 ends at 76 cm (no fall), 50 at 50 cm; targets as before.
- 5: coding share 1 in 5,000, N 100, rate 1900, begun 1000 AD: clock 1.879 million at 1988; s -.05 / +.05: housekeeping .22-.34, immune 2.4-3.2, other .9-1.1, common ancestor 33-89 generations, differences ~135k; no selection ~1, 233, 422k (2N 200, 2 N rate 380k).

## Measured, draft 1 (superseded where it names a stage rebuilt above)

- A2 (20 survivors, 9 gens, affected 1 - s with s .05): share of islands at 10%+: growth x2 0 whatever else; x1.25 carrier x8 .057; x1.1 carrier x1 .004, x4 .045, x8 .097. Cousins 50%: colorblind / q^2 1.04-1.56 (random mating .93-.97).
- C (exp(.25 (sensitivity - 2)), mu .005, 1500 gens): reach B's peak N 5 .31 / 10 .22 / 20 .08 / 50 0; C's peak N 200 .98, N 1000 ~1.
- D (10 loci, effect 3, env sd 4, 200 sheep, top share of rams shot): H .7 miss 3.2 cm, 2020 at 51; H .5 5.4; H .3 8.4; a = 2: 7.5-11.
- B (kinship matrix; on the page, hatching .82 exp(-F_rel)): u .02, spotted .77 / .75 / 81%; box at .75 .63-.65 / .79-.82 / 59-60%, at .9 .53 / .82 / 45%, at 1 .25 / .75 / 33%.

## Open for JM (the key, read against the simulations)

1. **Q2(d)**: key says spotted turtles. With equal mutation rates, He rises with N (4Nu/(1+4Nu)); the table's own He is higher in box turtles (0.85 vs 0.76), and the sim agrees. "Spotted" matches Ho only. Which answer should the page reveal?
2. **Q5(a) and the plot**: the plotted slope is ~1,900 mutations a year; 1.9 million at that rate is ~1,000 years, not the ~6,000 in the question. Two points sit at 2025 and 2028. Fit as drawn (the page does), or re-scale the axis?
   - **JM 2026-10-14**: fit as drawn; the question's "almost 6,000 years old" and (a)'s "thousands of years old" now read "long ago" (a number misleads). He hit target 1 at 1000 AD / 1,900 but found it touchy: only that one setting of the 80 hits (next best misses by ~79k), and the readout's least-squares slope (1,729) points to 1,800, which misses at every start on the menu.
   - **JM 2026-10-14, later**: "make that small adjustment to allow it to hit, and also constrain the values on the arrows a bit more so that most of the settings produce some visually non-flat line within the axes". Done:
     - starts 900-1100 AD in 25s, rates 1,700-2,100 in 100s (was 4000 BC-1500 AD, 300-2,500); opens at 1800/975 (56k low), one start step earlier hits
     - window 15,000 (was 5,000): a 5,000 window needed the start within ~3 years (1,800 a year misses even at 940); now the four diagonal pairs hit (1800/950 11k, 1900/1000 3k, 2000/1050 4k, 2100/1100 10k, noise free), nearest miss on the menu 32k
     - a fixed axis cannot do "most settings inside": one start step moves the line ~47k, half the 1.86-1.96 axis (40% inside at best); so the axis widens to take in the run (fixed for the run), every setting draws inside; widest 1.5-2.0 or 1.8-2.4, where the run's rise is ~15% of the height
     - rounds 2-3 hold 1000 / 1,900 as before
     - checks, three runs (2026-10-14): the clock target and the axis check pass 3/3. Four untouched bars failed once each (seeds are a fresh draw per load): B target 1's intended setting hit 1/3 (needs 2); E target 2's s -.1/+.1 hit 1/2 (should miss); E target 3's s -.01/+.01 hit 1/2 (should miss); extra credit's h .75 hit 1/2 (should miss; known, see the F comment). Not changed: JM called 18 done
3. **Q1(d)**: under random mating the sim's colorblind share sits on q^2 (HWE in the snapshot sense) even after drift; only cousin marriages push it above. The key's "No" reads as "the assumptions are broken". Fine as is?
4. **Q4(a)** "+ to −": the page's rams' mating edge gives a positive cov(w, z) before 1995 (+0.7 at edge .1, +2.2 at .3) and the rise after the ban, (e). At edge 0 cov sits at 0 and nothing rises after the ban (target 2 misses). Edge .3 overshoots 1995 (miss 6.5 cm on target 1); edge .1 clears both. Matches the key.
8. **Typos** (JM 2026-10-14: "I'm fine with the correction of minor typos"): Q5 "My took" read "I took"; Q4 "big horn" read "bighorn"; extra credit "fentyl" read "fentanyl" (also in its key), "look at" read "looked at". Each noted in its HTML comment.
9. **C**: N runs 6-1200 (multiples of 3: at N 5 the three lineages started 1/1/3 and B's peak fell to .14). Target 2 is "at least one of 10 reaches B's peak" (2+ was 77% of tries at best).
5. Points on the bighorn plot treated as generations (2.5 years apart): realish, not sheep biology.
6. Extra credit: only ARRB2 has a simulation; the three naming questions are not on the page.
7. Every stage open at once (no gating); answers hidden until the stage's targets are hit. OK?

## Items

| # | Stage | What | Status |
|---|-------|------|--------|
| 1 | — | prototypes for A-D | done |
| 2 | A-F | build the page | done |
| 3 | — | `check_lesson18_numbers.js` | done |
| 4 | — | JM rules on the open points; key answers settled | todo |
| 5 | A-F | streamlined (JM, 2026-10-13): setup bullets, R panels, Download .R, To-finish boxes gone; the exam's question text stays; sliders became lesson 14's arrow diagrams (paths.js) on A1, A2, B, D, E2, F; C and E1 keep plain sliders | done |
| 6 | A-F | declutter sweep (JM 10-17: "please go ahead and do a declutter sweep for past lessons"): no bullets or R here; the eight lines of key arithmetic each in a closed "The numbers" box under their plot (docs/overhauls/declutter_sweep.md) | done |
## Rulings

- 2026-10-12: lesson 18 is an interactive exam key: a bespoke simulation per question, a target that looks like the question's data (brief above).

## Do not

- Put bullets, setup notes or R code back: this is an exam key, not a lesson (JM, 2026-10-13). Question text, the target, the controls, the key.
- Edit the key's answers on the page to match the simulation: they are JM's, verbatim; disagreements go in "Open for JM".
- Gate the stages in sequence (the exam is not a sequence).
