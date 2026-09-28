# Lesson 12 — selection at the gene

**File** · `app/lessons/lesson12.html` — rebuild from zero
**Checks** · `node scripts/check_lesson12_numbers.js` · `python3 scripts/check_lessons.py`
**Status** · 2026-09-28 voice-note revision built (`version: 9`, 46 bars pass); awaiting JM's live test; locked
**Last touched** · 2026-09-28

## 2026-09-28 voice notes (JM, after demoing `version: 8`)

- Dictated intros for A, B, race, mutations, E: they are the copy (ASR fixes only). Mutations' bullets: JM "deal with the bullet points later".
- JM: *"in class, I used one minus HS and one minus S ... negative H should indicate over dominant"*; *"S should be inherently a negative factor. It's the fitness deficit of the negative allele."*
- JM calls h "heritability" (his lecture usage too: 202_lec17_02 "how heritable that badness is"). Kept in his prose; lesson 13's heritability is the regression slope.
- A: *"I dont think we need the sliders at all. The control panel should just be the beautiful interactive plot"*; "take" → "choose"; "red from one copy" → "redness of heterozygote"; PhyloPic hummingbird offered (b4f64736, CC0, Margot Michaud).
- B: plots top to bottom = frequency, bars, individuals; rounds sweep, rescue, hide, hold, split.
- Race moves before mutations: C = race, D = mutations. Race rounds a ladder: blue everywhere, keep everything (one-sided: *"if you maximize no extinction, you get the last target incorrect"*), two alleles, then drift, dominance.
- Mutations: keep the plane; the only line plots = homozygosity and average fitness (w̄) by generation; targets on those; spreads set on small distributions, not sliders; selfed ÷ outcrossed dropped (*"difficult for them"*); covariance plot dropped; banner "Stage E is open."

- As built (`version: 9`):

      A  rounds turned round (h_new = 1 - h_old); s floor 0.25 against red (was 1.3x white)
         asred h -0.15..0.15 · best h <= -0.25 · worst h >= 1.25 · halfway 0.35-0.65 · mostly 0.15-0.4
      B  sweep, rescue (h 0, s -0.2 held), hide (h -0.2, s 0.3), hold (h 2, s -0.15), split (h -1, s -0.3)
      C  (200 populations)                            built-for                 opening
         one    blue >= 0.9                         blue s -0.2, 100: 100%     21%
         all    still mixed >= 0.9                  every h -1, s 0.1: 100%    9-13% (same s, no dominance: 9-13%)
         two    50/50/0/0/0 +-0.1                   green, yellow s 0.2, 40    —  (100: 7-10% mixed; 150: 16-21%)
         drift, dominance as before, s signs flipped
      D  (U 0.3; holds: N rounds h 0.5+-0.1, s 0.05+-0.03; h rounds 300, h spread 0.1, s 0.15+-0.05)
         homozygous  homozygosity@400 >= 20    N 15: 16/16 (22-45) · 20 ~half · 25 13.6/19.2/25.4 (5th/50th/95th)
         clean       homozygosity@400 <= 0.4   N 1000: 16/16 · 700: 75% · 500: 44% · 300: 13%
         above       w̄@400 >= 2                h -0.1: 6.3-7.9 · -0.05: 2.6-3.0 · 0: 1.38-1.55
         fast        w̄@5 <= 0.82               h 2: 12/12 · 1.5: 8 · 1.2: 2 · 1: 0 (0.83-0.87)
         middle      homozygosity@400 6-16     N 35-45: 88-93% · 30: 78% · 100: 0 of 40  (slider floor now 15)

- Measured (node, D's simulator): with h ≥ 0.3, w̄@400 is 0.72-0.77 at any s and N ≥ 50 (the magic trick); any h tail below 0 is heterozygote advantage and w̄ runs to 10^4 at 1000 (plot clips, prints the value). A recessive load does NOT show in w̄ at 400: h 0.05 ± 0.02, s 0.3 is 0.75-0.79 at every N ≥ 50 (hs 0.015 is purged in ~70 generations); only h ≈ 0 holds w̄ near 0.9, and half of that curve is below 0.
- w̄(t) against exp(−U(1 − e^(−hst))): 0.752 expected, 0.754 measured at generation 10, h 2, N 300. Generation 10 is too noisy to separate h 1 from 2 (sd ~0.025 against a 0.04 gap); generation 5 does.
- Homozygosity = loci with two copies of one allele, fixed loci included, averaged over individuals.
- Dropped from D: Price covariance dots and take-out plot (JM had asked for covariance in B and C; now only in B), selfed ÷ outcrossed test, copies line. In git at c5b4968.
- The check suite outgrew 10 minutes (race "all" runs 200 populations to the 600 cap).

| # | What | Status |
|---|------|--------|
| V1 | swap C ↔ D (ids, prefixes, seeds, BIT, checks); fix the stale `C1_now`/`D1_now` tally spans | done (regex missed `predD_slot`; fixed) |
| V2 | 1 − hs, 1 − s in A (against red), B, race, mutations (s > 0 harmful) | done |
| V3 | A: map is the control card, counts set on it, no sliders; wording; JM intro + bullets; PhyloPic bird | done |
| V4 | B: plot order; JM intro; round order | done |
| V5 | C race: JM intro; ladder rounds; checks | done |
| V6 | D mutations: JM intro; homozygosity + w̄ panel; distribution widgets; rounds measured; checks | done |
| V7 | E: JM intro | done |
| V8 | `version` 9; all checks | done (46 bars; D's homozygosity windows reset once after the first run caught 100 and 300 individuals in them) |
| V9 | JM live test | todo |

## 2026-09-28 revision (JM)

- JM: new C = students set average and spread of **h and s of new mutations** (fixed rate, hidden), individuals the lever; show the h/s of what persists, arrivals in the first half against the second. Old C, D → D, E. Old E dropped.
- JM: *"constraining new mutations to have negative fitness makes sense. I'd like the student sliders to allow h to explore under/over dominant scenarios--they're important!--and to keep at least one target that requires over/under dominance (h outside of 0-1)."*
- JM: *"also put covariance in both B & C and include the C inbreeding round--don't show the mutation line yet."*
- Approved list (chat, 2026-09-28): A visits at a fixed rate per flower taken; A free play before round 1, seasons that accumulate, rounds 4-5 retargeted at colour against fitness, "best" one-sided; A's white-to-red line on the bars; B's h bullet; covariance in B (line through the genotypes weighted by the population) and in C (selection's take-out = cov(w, copies)/w̄, dots of individuals); C inbreeding round.

      A  meadow (visits fixed per flower; free play; seasons plot)
      B  one locus + covariance line on the bars
      C  NEW: new mutations' h and s; what stays; covariance; inbreeding test
      D  four alleles (old C)
      E  valley (old D)

- Measured 2026-09-28 (node prototype, `C_` simulator as on the page; U 0.3 a generation, 400 generations, multiplicative, free recombination):
  - Low h shows **by copies, not alleles**: harmful copies from h < 0.1 = 17% of arrivals, 36-52% standing; per distinct allele 18-31%.
  - Run halves split works at 200-400 generations; at 1000 the old half is a few near-neutral alleles. First half empty at ≤ 50 individuals.
  - **Any tail of h below 0 takes the old copies**: h 0.4 ± 0.15 (0.4% below 0) at 1000 individuals, old copies' average h ≈ −0.03. What stays is what does not hurt in one copy: recessive or heterozygote advantage.
  - N 500, s 0.15 ± 0.05, h spread 0.1, by average h: selfed / outcrossed 0.01 (h 0), 0.29 (0.1), 0.70 (0.2), 0.88 (0.3), 0.99 (0.5), 1.08 (1), 1.1 (2); copies each carries 250-280 (h ≤ −0.2), 100 (0), 35 (0.1), 14 (0.2), 4.7 (0.5), 2.3 (1), 1.5 (1.5), 1.1 (2).
  - Average fitness (against an individual carrying none) 0.72-0.77 for h 0.2-2 (202_lec14_01's "magic trick"); above 1 with heterozygote advantage; 0.33-0.51 at 20 individuals (drift fixes 3-6).
  - Worst case (1000 individuals, every mutation h −1): 1.6 s a run in node.

- As built 2026-09-28 (`version: 8`, `scaffold: 5`, 47 bars):

      A  rounds (held; target; built-for; 40 seasons on the page)
      asred    pink 0.5; h 0.85-1.15            8 H from 0.3, 2 B to 0.3      98%
      best     pink 0.5; h at least 1.25        7 H from 0.3, 3 B to 0.7     100%
      worst    pink 0.5; h at most -0.25        7 H from 0.7, 3 B to 0.3     100%
      halfway  8 H from 0.9, no bees; h 0.35-0.65     pink 0.8              100%
      mostly   8 H from 0.4, no bees; h 0.6-0.85      pink 0.35             100%   (top at 0.9 let pink 0.5, h 1.00 ± 0.06, through 1 season in 30)
      random setting clears 12 / 6 / 4 / 5 / 5%; greediest of 307,461 clears 2

      C  rounds (held; target; built-for; 4 runs)
      inbred   500, h spread 0.1, s 0.15 ± 0.05; selfed ÷ outcrossed 0.55-0.8   h 0.2      100%
      kept     same; harmful copies each ≥ 150 at 400                           h -0.2     100%
      cleared  same; harmful copies each ≤ 1.6 at 400                           h 2        100%
      hidden   h 0.05 ± 0.02, s 0.3 ± 0.1; selfed ÷ outcrossed ≤ 0.35           1000       100%
      fixed    h 0.5 ± 0.25, s 0.05 ± 0.03; drift fixes ≥ 10                     20         100%
      kept needs h < 0 (h 0: ~100 copies); cleared needs h > 1 (h 1: 2.0-2.5)

- A free play first: `mountRounds({ freeFirst })`, no target until "Start the targets"; runs before it score as practice. Also on C.
- A's s is still large (s 1.9 at 8 H / 2 B; 9 with no bees) against B's ±0.3. Left as is.
- C, dropped: an "old copies" round with the size as lever. With any tail of h below 0 the old copies are heterozygote-advantage alleles at every size ≥ 100; tail-free (h 0.3 ± 0.1), old copies ≤ 5% and noisy. Old against new stays a picture (plane, edges, readout), not a target.
- C, the covariance: dots (copies against offspring ÷ average), least-squares line, `slope × spread = covariance`; the take-out plot; checked against `C_U − taken out` = the copies line's change (Price, with the mutation term off screen).
- B, the covariance: the line through every individual on the bars, counts under each; printed covariance ÷ w̄ ÷ 2 against purple's actual next change. Checked: over 400 populations the average change is the average covariance term, at F 0 and F 0.4-0.6.

| # | What | Status |
|---|------|--------|
| S1 | cut E; letters C → D, D → E (ids, prefixes, seeds, BIT, checks); E's closing quote moved to the valley | done |
| S2 | A: visits at a fixed rate per flower taken (s from visitors only) | done |
| S3 | A: free play before round 1; seasons plot (colour against h); white-to-red line; rounds 4-5 retargeted; "best" one-sided | done |
| S4 | B: h bullet; covariance line on the bars, printed beside purple's next change | done |
| S5 | C: simulator, plane + edges, copies and take-out plot, individuals' dots, inbreeding bars; rounds; free play first | done |
| S6 | checks for A, B, C; D and E renamed; `version` 8 | done |
| S7 | JM live test | todo |

## 2026-09-27 restructure (JM)

- JM: *"Lesson 12 parts A and B are fantastic. I'd like to keep them, but move them down. I'd like a very simple interactive that helps students intuit what h and s mean. Something where they manipulate a visible phenotype based on alleles (a modification of the previous shape/elongation/color activity?) and an environment (color of background? Preference of pollinators?) such that the advantage/disadvantage of a given trait is clear, and where h is made clear to be a function of both the gene (dominance per se) and the environment (eg red, light red, and white may have identical fitnesses, higher fitness for heterozygotes, no difference between red/light red, etc) depending on the context."*
- JM: *"Parts C and D are good—but I am thinking of keeping only one, and adding something about population level mean fitness. I think I'd like to keep the fitness valley example and have a track-the-population-mean-fitness be the final part. So it'd go: visually explore h/s (A), current part A (B), current part B (C), fitness valley activity (D), population-mean-fitness capstone (E)."*

      A  NEW: the meadow. Flowers red / pink / white (lesson 9 D's glyph idea,
         colour only); hummingbirds and bees visit; seeds per flower -> h and s
      B  old A, unchanged (windows, one kind of dominance a round)
      C  old B, unchanged (four alleles race)
      D  old C, unchanged (the valley)
      E  NEW: mean fitness. Old A's population; w-bar tracked by generation and
         on the hill w-bar(p); rounds on what only w-bar shows
      --  old D (mutation-selection balance) cut; in git at 8ced490

- A as built: gene = how red one copy makes a flower (the heterozygote's colour, 0 white .. 1 red; JM's 145_lec25_02 "add purple paint"). Environment = hummingbirds (visit flowers at least this red) and bees (at most this red), a count and a colour edge each. Visits -> seeds. Bars relative to white: 1, 1 + hs, 1 + s; h read off a ruler from white's bar (0) to red's (1). Voice 202_lec18_02 (JM's own pink flower, hummingbirds and bees); conclusion 202_lec18_01 in the solved banner.
- A rounds: gene held at pink-halfway for three (pink as good as red / pink best / pink worst: environment the lever); environment held for two (gene the lever). Opening = visitors take any colour, all three bars equal (JM's "identical fitnesses"), which is no round's answer.
- E as built: w-bar measured each generation off B's simulator (`B_run` returns `W`; its RNG draws unchanged, so B's bars hold); closed form `HW + F p q s (1 - 2h)` beside. Hill plot (w-bar against p, dashed at F, a ball) over a w-bar-by-generation plot with windows; dotted line = fittest genotype. On-screen wording "average fitness" (style report flags "mean"; JM's 461_lec16_04 says "average population fitness").
- Voice: A = 145_lec25_02 (red for purple) + 202_lec18_02 cut at "Which one likes pink?", **hummingbirds and bees swapped** to hummingbirds-red / bees-white (JM's lecture has them the other way); solved banner = the quote's answer + 202_lec18_01. E = 202_lec01_02 + first sentence of 202_lec14_01; solved banner 461_lec12_02 trimmed. B gained "as in Stage A" on its bars bullet.

      A rounds (hold; target; built-for setting, on the page, 40 seasons)
      asred    pink 0.5 held; h 0.85-1.15, s >= 0.3; 8 H from 0.3, 2 B to 0.3     98%
      best     pink 0.5 held; h 1.5-2.5;             7 H from 0.3, 3 B to 0.7     98%
      worst    pink 0.5 held; h -1.5 to -0.5;        7 H from 0.7, 3 B to 0.3    100%
      aswhite  visitors held (8 H from 0.8, 2 B to 0.3); h +-0.15; pink <= 0.4, or 0.65   100%
      asred2   same visitors held; h 0.85-1.15; pink >= 0.8                        88-98%
      opening (pink 0.5, 5 and 5 taking every colour): s = 0, clears none
      one setting, 307,461 on the arithmetic: at most 2 rounds

      E rounds (30 runs at the built-for setting)
      climb    from 0.05; >= 1.10 at 40, 1.18-1.22 at 100          h 0.7 s 0.2        97%
      above    s 0.1 held, from 0.1; 1.105-1.16 at 60 and 100     h 2                100%
      strand   s 0.3 held, from 0.25; <= 0.97 at 2, 0.98-1.02 at 100   h -1          100%
      drift    from 0.5; 0.98-1.02 at 0/25/50/75/100, purple at a wall   40 at F 0.8  83%
      inbred   F 0.8 held, from 0.5; falls 0.08 by generation 5    h 2 s 0.3         100%
      each needs its thing: recessive climb, h 1 above, drift strand, selection-cleared
      drift, recessive-bad or additive inbred: all 0%. Opening: 0% in all five.

- Measured 2026-09-27, A: visitors share their visits among the flowers they take, so **moving pink moves red's seeds**. At 6 H / 3 B held, pink at 0.9 took half the hummingbirds' visits off red and s fell from 0.75 to 0.11 (under 0.3): held visitors moved to 8 / 2.
- Measured 2026-09-27, E: inbreeding costs w-bar `F p q s (1 - 2h)`: nothing without dominance, most with a heterozygote above both homozygotes. A recessive bad allele (h 0, s -0.3) at F 0.8 dips 0.02, because purging starts at once; only heterozygote advantage clears the 0.08 round.
- Open: mutation–selection balance has no home now (was D). Candidates: the later mutation–drift–selection + Price capstone (lesson 16 doc), or a round in E on JM's 1 − 2μ (202_lec14_01, 461_lec16_04), which would need mutation in `B_run`.
- Open: A's phenotype is colour only; JM floated shape/elongation from lesson 9 D. Not added.

| # | What | Status |
|---|------|--------|
| R1 | cut old D; letters shift A->B, B->C, C->D (ids, prefixes, seeds, BIT, checks) | done (a regex shift; `A.F` and `A[key]` needed a second pass) |
| R2 | new A: meadow, map, bars; rounds; checks (6 bars) | done |
| R3 | new E: w-bar tracked; rounds; checks (5 bars) | done |
| R4 | `version` 7, `scaffold` 5; done banner; nav | done |
| R5 | JM review of A and E | todo |

## What it is

- JM, 2026-09-24: *"maybe lesson 13 is a 'selection as regression' module that zeroes in on all of that, while lesson 12 is more genetics-specific."*
- 12 = alleles under selection, dominance, drift against selection, a valley. 13 = covariance, Price, the regression a DAG draws, mediators / confounders / colliders, the birth–death framework. See `lesson13_overhaul.md`.
- Supersedes the 2026-09-22 split (12 relative fitness / one locus, 13 absolute / one trait). Its measured numbers are kept below where they still apply.

## Stages (2026-09-24 letters: this A is now B, B is C, C is D; D was cut 2026-09-27)

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
