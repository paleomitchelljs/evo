# Lesson 18 — the interactive exam key (Exam 02, spring 2026)

**File** · `app/lessons/lesson18.html` — first draft 2026-10-12
**Checks** · `node scripts/check_lesson18_numbers.js` · `python3 scripts/check_lessons.py`
**Status** · draft built (A-F), checks green (20 + R panels); LOCKS `x`; JM to review
**Last touched** · 2026-10-13
**Source** · `notes/exams/2025.5/exam02_key.tex` and `exam02.pdf` (question text and key answers quoted verbatim on the page)

## What the lesson is

- One stage per exam question: the question as printed, a simulation built for it, a target shaped like the question's plot or table. Hitting the target opens the key's answers, each beside the number from the student's own run that shows it.
- Abnormal on purpose (JM): no sequence; every stage open at once; the code mints when every target is hit.

## JM's brief, 2026-10-12 (verbatim)

> For lesson 18, I'd also like a draft. This lesson would be abnormal. I am looking for an "interactive exam key" where students get a bespoke simulation that lets them generate data similar to what is shown in the question plots and their goal is to hit a target that looks like the empircal data.

## Stages as built (draft 1)

    A  Pingelap. A1 before the typhoon: u, s, h set the worldwide colorblind share (target 0.001-0.01%, data 0.003%). A2 the typhoon: 20 survivors, one carrier; regrowth, the carrier's young, cousin marriages; 100 islands, 9 generations; target: at least 1 island at 10%+ (2+ hit only 2 of 6 tries at the best setting). F and colorblind against q^2 under the islands.
    B  Turtles. N held at the table's 39 and 109; shared mutation rate; each species' share of young from the first parent's closest relative; hatching .82 exp(-relatedness). Target: the table (windows ~ +-0.07 on Ho/He; hatching 72%+ / 48-68%). Hit at u .02, box .75 (box .63 / .80 / 60%).
    C  Thornton. The three lineages on the exam's landscape; 10 populations; N. Targets: all 10 at C's peak; at least 2 reach B's peak. N a multiple of 3 (6-1200) so the lineages start equal.
    D  Bighorn. Hunting share, heritability, rams' mating edge; the exam's 17 points as the target (typical miss under 4.5 cm); then the ban in 2027: horn length rises, slower than it fell. cov(w, z), V_A, neutral H and breeding rams by year.
    E  CTVT. E1 the clock: rate and start year against the exam's 11 points. E2 dN/dS: how harmful a housekeeping change is, how helpful an immune one is (windows .15-.5 / 1.8-3.5 / .8-1.3 on the table's 0.22 / 2.45 / 0.99). Not built: a host-DNA-stealing toggle for (d); the key's (d) line points at the harmful housekeeping changes that still fixed.
    F  Extra credit: ARRB2. G/G's dose and h make three box plots; target the exam's (A/A ~48, A/G ~40, G/G ~31).

## Measured (node prototypes, scratch, 2026-10-12)

- A2 (20 survivors, 9 gens, affected 1 - s with s .05): share of islands at 10%+: growth x2 0 whatever else; x1.25 carrier x8 .057; x1.1 carrier x1 .004, x4 .045, x8 .097. Cousins 50%: colorblind / q^2 1.04-1.56 (random mating .93-.97).
- C (exp(.25 (sensitivity - 2)), mu .005, 1500 gens): reach B's peak N 5 .31 / 10 .22 / 20 .08 / 50 0; C's peak N 200 .98, N 1000 ~1.
- D (10 loci, effect 3, env sd 4, 200 sheep, top share of rams shot): H .7 miss 3.2 cm, 2020 at 51; H .5 5.4; H .3 8.4; a = 2: 7.5-11.
- B (kinship matrix; on the page, hatching .82 exp(-F_rel)): u .02, spotted .77 / .75 / 81%; box at .75 .63-.65 / .79-.82 / 59-60%, at .9 .53 / .82 / 45%, at 1 .25 / .75 / 33%.

## Open for JM (the key, read against the simulations)

1. **Q2(d)**: key says spotted turtles. With equal mutation rates, He rises with N (4Nu/(1+4Nu)); the table's own He is higher in box turtles (0.85 vs 0.76), and the sim agrees. "Spotted" matches Ho only. Which answer should the page reveal?
2. **Q5(a) and the plot**: the plotted slope is ~1,900 mutations a year; 1.9 million at that rate is ~1,000 years, not the ~6,000 in the question. Two points sit at 2025 and 2028. Fit as drawn (the page does), or re-scale the axis?
3. **Q1(d)**: under random mating the sim's colorblind share sits on q^2 (HWE in the snapshot sense) even after drift; only cousin marriages push it above. The key's "No" reads as "the assumptions are broken". Fine as is?
4. **Q4(a)** "+ to −": the page's rams' mating edge gives a positive cov(w, z) before 1995 (+0.7 at edge .1, +2.2 at .3) and the rise after the ban, (e). At edge 0 cov sits at 0 and nothing rises after the ban (target 2 misses). Edge .3 overshoots 1995 (miss 6.5 cm on target 1); edge .1 clears both. Matches the key.
8. **Q5 voice**: "My took some notes" left as printed (typo in the exam).
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

## Rulings

- 2026-10-12: lesson 18 is an interactive exam key: a bespoke simulation per question, a target that looks like the question's data (brief above).

## Do not

- Put bullets, setup notes or R code back: this is an exam key, not a lesson (JM, 2026-10-13). Question text, the target, the controls, the key.
- Edit the key's answers on the page to match the simulation: they are JM's, verbatim; disagreements go in "Open for JM".
- Gate the stages in sequence (the exam is not a sequence).
