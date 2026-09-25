# Lesson 12 — selection at the gene

**File** · `app/lessons/lesson12.html` — rebuild from zero
**Checks** · `node scripts/check_lesson12_numbers.js` · `python3 scripts/check_lessons.py`
**Status** · replanned 2026-09-24; A-D built (`version: 6`, `scaffold: 4`, 33 bars pass); prose owed (D has a voice block); locked
**Last touched** · 2026-09-24

## What it is

- JM, 2026-09-24: *"maybe lesson 13 is a 'selection as regression' module that zeroes in on all of that, while lesson 12 is more genetics-specific."*
- 12 = alleles under selection, dominance, drift against selection, a valley. 13 = covariance, Price, the regression a DAG draws, mediators / confounders / colliders, the birth–death framework. See `lesson13_overhaul.md`.
- Supersedes the 2026-09-22 split (12 relative fitness / one locus, 13 absolute / one trait). Its measured numbers are kept below where they still apply.

## Stages

    A  one locus: lesson 11 A's population plus individuals, inbreeding,
       starting frequency, h and s. Pass the frequency through windows, one
       kind of dominance a round.                      (built 2026-09-24)
    B  four alleles race (lesson 11 C + D): each its own h and s; individuals,
       inbreeding; 200 populations run to one allele; traces coloured by the
       allele that won; a chart of who won; target = shares. Neutral-all
       button. A round where an advantageous allele must be lost to drift.
    C  the valley: two loci, start on the low peak, a deeper valley needs a
       smaller population to cross. Depth dealt, population the student's.
    D  mutation-selection balance, with h and s (JM 2026-09-24): a bad allele
       made by mutation, removed by selection; where it settles.  (built)

### A — one locus, h and s

- JM: *"Just like we do in lesson 11 A, except in addition to being able to control the population size, and the inbreeding, and the initial frequency, we also add an H and an S factor ... over dominant, under dominant, recessive, everywhere in between ... S ... positive or negative. And basically let them explore that."*
- Fitness `(1, 1 + h s, 1 + s)` for yellow homozygote, heterozygote, purple homozygote. `h` −1 to 2 (under- to overdominance), `s` −0.3 to 0.3.
- Three fitness bars drawn from the sliders: the picture of what `h` and `s` mean.
- Inbreeding held by selfing, `2F/(1+F)` (lesson 11 D's rule). Inbreeding exposes a recessive: the bridge from 11.
- Game: five rounds, one kind of dominance each, as **windows** a run must pass through (a new picture: red bands at set generations). Practice switch. Not curve-matching: see Measured.

      hide    from 0.5: <= 0.25 by gen 15, >= 0.01 at 100       best h -0.2 s -0.3
      sweep   from 0.02: >= 0.5 by 40, 0.85-0.98 at 100          h 1 s 0.25
      hold    from 0.1 and 0.9: both 0.5-0.8 at 100              h 2 s 0.15
      split   from 0.2 and 0.45: opposite walls at 100           h -1 s 0.3
      rescue  h 0, s 0.2 held; from 0.05: >= 0.5 by 40           F 0.5

### B — four alleles race

- JM: *"they can select from, say, 4 alleles and for each of these, set the H and the S ... hit go ... what color the line is, is what allele ends up as the only one ... some kind of chart ... baseline setting button ... at least one run where they have to drive an advantageous allele extinct through drift."*
- Heterozygote of two alleles: `w_ij = 1 + h_i s_i + h_j s_j`; homozygote `1 + s_i`. Reduces to A's model when `j` is neutral. **Confirm.**
- Target: a bar chart of win shares over 200 populations, ±0.10 a bar (±0.08 in the recessive round). Balancing selection never finishes: capped at 600 generations, "still mixed" is a fifth bar. Targets built from 300 populations when dealt (≤ 0.7 s).
- **All neutral** sets every s to 0 and h to 0.5, not 0: in the recessive round every s is held and h = 0 is the answer.

      favourite   blue s 0.08, 60 individuals                          ~90/3/3/3/0
      drift       every h, s held (blue 0.1); N, F the levers; 10     ~43/19/19/19/0
      recessive   every s and 40 held; h the lever; blue h 0          ~68/11/11/11/0
      dominance   blue s 0.08 h 1 vs orange s 0.08 h 0, 60            ~72/26/1/0/1
      balance     every h 2, s 0.1, 30                                ~2/3/3/3/89

### C — the valley

- JM: *"a peak near their starting position that is low and a peak far ... high ... a valley in between of some depth and they can control the depth ... they need drift to cross the valley."*
- Works **only** as a valley in genotype space, entered from one genotype with rare mutation (measured below). The 2026-09-22 phenotype version, 12 loci with standing variation, had larger N always better.
- JM wants it "as evidenced by a birth death sort of process": the framework lives in the third selection lesson (see 13's doc); C can move onto it once it exists.
- Built at 1500 generations, 50 populations, 10-120 individuals, depth 0-0.2, mutation 0.001, high peak 1.2. Rounds, each a window for the share reaching the high peak:

      middling  depth 0.05 held, 28-48%     N 20: 85%
      stuck     depth 0.05 held, 0-5%       N 120: 100%   (Wright: big populations stay put)
      deep      depth 0.10 held, 20-45%     N 10: 94%
      depth20   20 individuals held, 30-55% depth 0.04-0.05: ~90%
      depth10   10 individuals held, 4-14%  depth 0.17: 87%
      opening   40 individuals, depth 0.10: at most 4% in any

## Measured, 2026-09-24 (node prototypes)

- A, generations 0.05 → 0.5, `s` 0.1, N 400, median of 20:

      F 0     h 0: 217   h 0.5: 66   h 1: 41   h 1.5: 35
      F 0.5   h 0:  62   h 0.5: 40   h 1: 41   h 1.5: 30

  Inbreeding cuts a recessive sweep 3.5-fold and does nothing for a dominant one.
- A, 150 generations, N 400, from 0.1 / from 0.9: overdominant (h 1.5, s 0.1) 0.76 / 0.77; underdominant (h −0.5, s 0.1) 0.00 / 1.00; recessive bad (h 0, s −0.1) 0.01 / 0.06; dominant bad (h 1, s −0.1) 0.00 / 0.33.
- B, blue `s` +0.05 (h 0.5), three neutral, 200 populations: blue wins 33 / 42.5 / 72 / 91.5% at N 10 / 20 / 50 / 100. Lost to drift two times in three at 10. N 50, `s` +0.1: recessive wins 75%, dominant 97.5%. 200 populations ≤ 0.55 s at N 100.
- C, two loci, starts all "−", valley = every mixed genotype at `1 − d`, high peak `1.2`, mutation 0.001 a copy, 3000 generations, 40 runs, share reaching the high peak:

      valley 0.02   N 10: 85%  20: 90%  40: 80%  80: 75%  160: 50%  320: 15%
      valley 0.05   N 10: 78%  20: 63%  40: 38%  80:  3%  160:  0%  320:  0%
      valley 0.10   N 10: 63%  20: 25%  40:  0%  80:  0%  160:  0%  320:  0%

  Mutation 0.0002: same order, lower (valley 0.05: 20 / 8 / 0%). One locus, mutation 0.0005, valley 0.1: 78 / 58 / 43 / 20 / 3 / 0%.

## Measured, 2026-09-24 — A's game

- **Curve-matching does not force dominance.** Six dominance curves over 100 generations: a setting with h = 0.5 fitted four of them to 0.037-0.047 RMS against a tolerance of 0.05. Two (recessive good from 0.1, dominant bad from 0.9) were unaimable: early drift sets their timing (own setting 0%).
- **Windows do.** Deterministic screen over h (−1..2), s (−0.3..0.3), F: no h = 0.5 setting passes rounds 1-4; no constant setting clears more than two. On the page: own settings 60-100%, opening setting 0%, no dominance ≤ 5%.
- **Symmetric underdominance is out of reach** with `(1, 1 + hs, 1 + s)`: the tipping point is h/(2h − 1), 0.33 at h = −1, never 0.5. The split round's starts straddle 0.33. (The 2026-09-22 plan's three-bar table found the same.)
- **Hide is a squeeze.** A rare recessive at 400 individuals is lost to drift by generation 100 about one run in four; an early, lower window lets h = 0.5 through. Best setting h −0.2 (a slight heterozygote advantage) 83% in node, 60% on the page's check seeds; plain recessive ~65%.
- Rescue: F 0 → 0%, 0.5 → 93%, 0.75 → 100%.

## Measured, 2026-09-24 — B's game

- Own setting 94-100% (four students' targets x 8 runs); opening setting (every s 0, 100) misses all five.
- Dominance is the lever where it should be: recessive round with blue additive 0%; dominance race with both additive ~53/47 (0%); balance with the same s and no dominance leaves nothing mixed (0%).
- Drift round: blue s 0.1 held wins 98% at 100 individuals, ~43% at 10.
- The recessive gap is ~19 points whatever N and s (blue wins 68% recessive vs 87% additive at 40, s 0.1); at ±0.10 the opening passed 1 run in 5 on one page, so this round's window is ±0.08 (own 90%, opening 2%).
- "Keep them all" at 30 needed s 0.1 (90% mixed); at s 0.05 only 34% stayed mixed.

## Measured, 2026-09-24 — C at page scale

- Chance one population reaches the high peak in 1500 generations (200-400 populations a cell): depth 0.05: N 10 .53, 15 .45-.47, 20 .35-.38, 30 .29, 40 .14-.18, 60 .05, 80-100 .03, 120 0. Depth 0.10: N 10 .29-.34, 12-15 .20, 20 .14, 40 .01. N 20 by depth: .02 .67, .03 .57, .04 .46, .06 .29, .08 .17. N 10 by depth: .08 .45, .12-.13 .27, .14-.15 .18, .17 .08, .20 .04-.07.
- A run of 50 wobbles ~7 points, so the windows sit on binomial hit rates, not on the means: at 25-45% (round 1) and 5-18% (round 5) the opening setting reached 9% and 5%, and one page's opening landed on the edge. Moved to 28-48% and 4-14%.
- On the page: small populations cross (depth 0.05: 10 → 49%, 20 → 43%, 40 → 17%, 120 → 1%); deeper valleys need smaller populations (20 individuals: 0.02 → 63%, 0.05 → 35%, 0.10 → 5%).
- A population can sit at an average of 2 for hundreds of generations: one locus fixed for +, the other not, every individual in the valley.

## Measured, 2026-09-24 — D

- Rounds (mutation dealt, one of h and s held, the other the lever):

      additive  mu .004, h .5 held; s -0.08 -> ~0.10         8 runs: 75-100%
      partial   mu .004, s -.2 held; h 0.25 -> ~0.07          100%
      hidden    mu .002, s -.1 held; h 0 -> ~0.14             88% (sqrt(mu/s) 0.141 vs 0.04 at h .5)
      dominant  mu .006, h 1 held; s -0.2 -> ~0.031           100%
      shows     mu .003, s -.1 held; h 1 -> ~0.031            88%

- **With h and s both free, one setting cleared four rounds** (h .25, s −.11): the recessive term blurs the h × s the rounds need. One lever per round, with conflicting values for the same lever across rounds, caps it at two.
- At balance, copies made = copies removed (14.6/14.5, 15.2/15.1, 6.9/6.7, 23.6/23.6, 11.7/11.8 per generation).
- The settled frequency against the printed arithmetic: within 11% (additive runs 0.089 against μ/(h|s|) 0.100; the recessive term the formula drops).
- Share of purple copies in heterozygotes is ~1 − q (87-97%): it tracks rarity, not dominance. The check says so.

## Carried from the 2026-09-22 plan

- Dominance, 0.10 → 0.01 at `s` = 0.10, deterministic: 922 generations at `h` = 0, 24 at `h` = 1. The middle bar is worth ~6% when the allele is common and two orders of magnitude when rare.
- Share of purple copies in heterozygotes = `1 − p`: 99% at p = 0.01.
- Huntington's `w` = 0.97, `h` = 1 (`202_lec17_04`) for a real-data line.
- Voice candidates: `202_lec16_03` pinecones, `202_lec18_01`, `202_lec18_02` hummingbirds and bees, `202_lec13_04` "recessive is the word we use when something doesn't matter as a heterozygote".

## Items

| # | Stage | What | Status |
|---|-------|------|--------|
| 1 | — | new page from lesson 11's furniture (setupCanvas override, round machine, practice switch, lockStage); old page retired | done |
| 2 | A | population grid, fitness bars, frequency curve; individuals, F, p0, h, s. Voice: the pinecone quote | done |
| 3 | A | five window rounds, calibrated; `check_lesson12_numbers.js`, 13 bars | done |
| 4 | B | four-allele race: allele rows (h, s each), genotype-fitness grid, 200 populations to one allele or 600 generations, traces and dots in the winner's colour, win-share bars against red outlines; five rounds; All neutral; checks (7 bars) | done |
| 6 | D | mutation–selection balance: JM, 2026-09-24, *"A mutation-selection balance activity makes sense as a stage with manipulable h and s—either standalone or baked in somewhere."* Standalone D here (12 has the h and s machinery; the old slot-13 lesson's content). Built: 2000 individuals, 300 generations, target = purple over 200-300; plots of purple (with the arithmetic beside) and of copies made vs removed; voice 202_lec17_02, pink katydid in the banner; checks (7 bars) | done |
| 5 | C | the valley: two loci, 50 populations, 1500 generations, stepped animation; landscape with a ball per population (stacks capped at 8 with a count), traces of each population's average, share gauge; five rounds holding depth or headcount; checks (6 bars) | done |

## Rulings

- **2026-09-24** — selection is three lessons: 12 genetics, 13 regression, 14 birth–death and DAGs; frequency dependence later, probably 15.
- **2026-09-24** — `h` −1 to 2, `s` −0.3 to 0.3: *"Ok."*
- **2026-09-24** — B's heterozygote `w_ij = 1 + h_i s_i + h_j s_j`: *"Ok."*
- **2026-09-24** — C in genotype space: *"For now."* It may move onto 14's birth–death framework.

## Still open

- ~~Mutation–selection balance displaced~~ → 12 D (JM, 2026-09-24).

## Do not

- Take the pre-2026-09-22 `lesson12.html` as precedent.
- Build C with standing variation across many loci: bigger populations always win there (measured 2026-09-22).
