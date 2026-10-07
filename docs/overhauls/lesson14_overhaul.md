# Lesson 14 — the genetics of selection: reading real genetic data with the tools from 1-13

**File** · `app/lessons/lesson14.html` — rebuilt from zero 2026-09-30; the births/deaths page is `app/archive/lesson14_2026-09-30.html`
**Checks** · `node scripts/check_lesson14_numbers.js [A] [B] [C] [D]` (~15 min with no letters, run in the background) · `python3 scripts/check_lessons.py`
**Status** · A-D built, JM's 2026-10-07 pass applied (`version: 12`, `scaffold: 22`: A 5 + observed data, B 5 + observed data, C 5, D 4 + observed data; one bit per attempt); C and D rebuilt from zero 2026-10-05/06 (JM's pivot, below); E removed 2026-10-05 (archived); page **unlocked 2026-10-07**; A and B voice blocks are JM's dictation (2026-10-02), C and D his dictation (2026-10-07)
**Last touched** · 2026-10-07 (JM's pre-posting pass: B, C, D text and cards; D windows widened)

## JM, 2026-10-07 (night) — C and D intros dictated; D bullets

- C and D voice blocks = his dictation, transcription and punctuation only ("loci" for "low si", "alleles" for "illeges", "additive" for "added", "ternary" for "turnary", and the like); C's bullets kept (*"otherwise, I think it's pretty good"*); D's bullets *"greatly cleaned up and shortened"*.
- **One content edit, flagged to JM:** the dictation had blue and yellow swapped (his blue = the female-mimic sneaker, his yellow = the small-territory guarder; "yellow beats blue, blue beats orange, orange beats yellow"). The lizards (Sinervo & Lively 1996) and this page's ring are orange beats blue, blue beats yellow, yellow beats orange, so the two colour names are swapped in the text; and "the fitness of orange is going to control the fitness of [yellow]" reads "how common orange is going to control the fitness of yellow". Left as dictated: epistasis defined as "a trait influenced by more than one gene" (the page's epistasis arrow is the interaction: Locus 2 changes what Locus 1 does) — noted to JM, not changed. JM, after: *"add an explicit line about polygenic inheritance (with additive as an example) and increase the precision in the definition of epistasis please, with minimal added text"* → "they're polygenic, influenced by many loci at once. Additive genetic variation, where each locus's alleles simply add to the trait, is one example"; "Epistasis is when the effect of one gene on a trait depends on which alleles another gene carries."

| # | What | Status |
|---|------|--------|
| T-1 | C voice → dictation | done (five paragraphs) |
| T-2 | D voice → dictation (blue/yellow corrected) | done (four paragraphs; the edit is in an HTML comment above the block) |
| T-3 | D bullets cut to three | done |

## JM, 2026-10-07 (evening) — buttons moved; unlock

- *"I'd like the "Next target" button from the Predict panel moved over to where the "Download .R" button currently is (next to "Go" in the Control Panel). The "Download R" should be at the bottom of the R code panel, or even replace the "R CODE" title of that panel with the button. Also please unlock lesson 14 and push those changes. Only make that adjustment for 14 for now and going forward--we'll need a note to add that revision to past lessons when we make those passes."*

| # | What | Status |
|---|------|--------|
| U-1 | "Next target" in each stage's Controls row beside Go (`mountRounds` uses the page's button instead of making one in the card) | done: `lockStage` turns it off during a run with the rest of the row; `paint()` sets it after |
| U-2 | "Download .R" replaces the "R code" title of the R code panel | done (`button.code-dl`, ghost style) |
| U-3 | `LOCKS.txt`: lesson14 open | done |
| U-4 | `docs/REVISIONS_PLANNED.md` row for 10-13 (and the default going forward) | done: row 12 |
| U-5 | checks | A 24/24, B 22/22, C 14/14, D 15/15 (practice, scoring, one-shot flows drive the moved button). The check takes `PORT` from the environment so stages run side by side |

## JM, 2026-10-07 (afternoon) — "Let's please fix Part B next then" (R-8's two failing bars)

- Lactase: the real 1000 Genomes profile is jagged (real haplotypes carry LD the engine's founders lack: loci at −4, −3 hold ~2-3 alleles, +6 ~13); every 40-haplotype sample sits 2.2-2.9 from any smooth simulated mean, so no window fits it. The profile cannot pin the setting either (dozens of settings sit 2.19-2.33 from it). Fix, on JM's realish-data ruling (2026-09-30): the hidden setting stays (0.15, 126 individuals; fitted earlier to the file's diversity loss and carriers' stretch, which do identify it), stop the file's 0.737; the observed data shown is a run at that setting, the one of 40 tries closest to the real profile among those typical of the setting. Named lactase after the shot as before.
- Grid: slow (0.02, 992) and mid (0.1, 492) share a level (a slow sweep's long run erodes diversity like a smaller population) and slow's window is the widest; fast's answer reaches partial (0.1, 1383) because at 50% the profile is set by N, and 40 chromosomes saturate there. Fix: 6 populations a Go (bars ~0.7×); mid to 263 individuals; partial to 739. Sample stays 40.
- Opening (0.05, 380) then lands mid 0.75: opening to (0.05, 2,000), which clears nothing.
- Records: one population inside a six-population window is rare (0-3%), so the record is the closest of 12 (lactase: as above) and is checked against single populations (closer than the median), not against the six-population bar.

| # | What | Status |
|---|------|--------|
| B-1 | `B_POPS` 6; mid (0.1, 263), partial (0.1, 739, 50%); opening (0.05, 2,000); targets and bars re-derived (80 Go's) | done: bars fast 0.986, slow 1.127, mid 0.772, small 0.653, partial 0.97, lactase 0.795; fresh 30 Go's at each setting 0.93-1.00 |
| B-2 | lactase: no fetch; observed data a run at the hidden setting shaped on the file (`shape`), stop 0.737 | done: the pick sits 2.24 from the file's profile (a typical run 2.75); `data/SOURCES.md` says so |
| B-3 | records: closest of 12; check re-pinned (records vs single populations; lactase shape vs the file) | done |
| B-4 | check B green; screenshots | done: check B 22/22 (grid most 1; fresh hit rates 0.93-1.00; opening 0 everywhere; lactase shape vs file 0.07). Screenshots: a round, the lactase shot. R-8 closed |

Measured (node, the page's engine; scratch `l14b/`):
- Screening, 6 populations, 40 Go's a setting: same-stop target gaps minus the two bars, best set slow (0.02, 992) + mid (0.1, 263): margin +0.25 at 40 chromosomes, +0.45 at 150. 40 kept (what the card already says).
- Grid (10 advantages x chance 0-100 by 20, 6 Go's, stops 0.95 and 0.5): with partial at 739 (or 0.3 at 457), no cell clears two rounds; 1,383 (the old) collides with fast at 956; 457 (0.1) with slow.
- Openings, 12 Go's each against all six targets: (0.05, 380) mid 0.75; (0.05, 219) lactase 1.00; (0.07, 219) lactase 0.92; (0.03, 219) small 0.58; (0.05, 2,000) none (nearest partial, 2.20 vs bar 0.97).
- Single populations against a six-population window: inside 0-3%; median 1.5-1.9 bars off. Best of 12 always under the median population (fast's worst 1.52 vs median 1.65).
- Rounds' answers against lactase 0 (8 Go's each); cross-round 0 except partial's answer on fast 0.125.

## JM's review, 2026-10-07 — cleanup before posting

- B: *"Part B's bullets are far too wordy, there are too many, and they reference things the students haven't seen (like Lesson 15)."* His three: a whole chromosome with one locus of interest; each locus has multiple alleles, only one affects fitness; manipulate the focal locus to see its effect on diversity across the chromosome.
- B card: *"Remove the 'measured when the new allele reached' line ... drop the 'profile different mean|your count|...' ... remove the box below showing the 0 to 2 profile difference measure--instead just have that happen silently behind the scenes. Ditch the legend as well."*
- C: bullets too wordy; the independence arrow's readout text (*"never parting or different chromosomes"*) too long: *"A single line of text beside the arrow arranged vertically that says 'recombination rate' would be fine, and keep the dial to just numbers"*; its tip pokes under Locus 1 and stands off Locus 2; *"The 'glow' for selectable arrows could also be tightened--maybe a black outline for unelectable ones?"*
- D card: text cut off, *"especially the legend ... reducing the problem text rather than futzing with the margins"*; cut the subtitle and the legend; *"The tuning of this also seems off"* (his screenshot: the orange round, a miss).

Read off his screenshot: the ring sits 32 px from the data's dot on a 398 px triangle (window radius 14 px), a centre distance of ≈ 0.114, which is orange-beats-blue 4.5 with the others 4 (measured 0.111-0.116). One step in the right direction missed.

| # | What | Status |
|---|------|--------|
| V-1 | B bullets → JM's three | done (punctuation only) |
| V-2 | B card: no "measured when" row, no gauge, no legend; the profile difference still judges | done: plot 230 px tall (`pictureH` 280); lactase rows kept (named after the shot); `B_win` gone |
| V-3 | C bullets cut to three | done |
| V-4 | C arrow: "recombination rate", upright beside it; readout a bare number (recombination fraction = independence / 2, engine unchanged); R code in r | done: dial 0, 0.001, 0.0025, 0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5 |
| V-5 | `paths.js` `both`: the start head backs off its box as the end head does | done; plus opt-in `caption` / `captionAt` / `captionUpright` (always-on name beside an arrow; the readout avoids it). Arrows without either draw exactly as before (same expressions) |
| V-6 | glow tightened; held and fixed arrows outlined in ink (lesson 14 CSS) | done: glow 1.2 + 2.4 px (was 2 + 5); outline = four 0.7 px offset shadows on `.locked:not(.zero)` and `.dark` (held at zero left dashed: the outline made its dashes a heavy dark line). Applies to every diagram on the page, A-D |
| V-7 | D card: no subtitle, no legend, shorter gauge label, "never" tick clear of 200, shorter "based on" rows | done: "year a colour was lost"; tick labels drawn right to left, one that would hit its neighbour dropped (at ~1060 px "200" drops, "never" stays); gauges moved to 0.3 / 0.62 of the card |
| V-8 | D windows widened on the idea (measured); check D re-pinned | done, below; check D 15/15 |

**D windows, 2026-10-07** (node, the page's engine; a Go's middle spreads ~0.005, so each window is a cut on the arrow; edges set in the gaps between neighbouring settings):
- orange middle 0.05 → **0.124**: ob 4.5 (others 4) 0.105-0.118 lands, ob 4 (equal) 0.131-0.142 does not (40 Go's each); 5 0.090, 6 0.055, 8 0.004, 10 0.040.
- blue middle 0.05 → **0.141**: by 4.5 0.122-0.136 lands, by 4 0.147-0.166 does not.
- even cycle 8.5-11.5 → **7.5-13**, middle 0.05 → **0.09**: equal 4 (12.3) to 10 (7.9) land; 3.5 (13.5), 3 (15.1), 2 (20.8) do not; one or two steps unequal land (7/6/6 0.031, 6/6/5 0.053, 8/6/6 0.056, 5/6/7 0.071, 6/6/8 0.082), 6/6/4 (0.115) does not.
- collapse lost 50-180 → **40-190** (mean of three; 40 Go's): 200 lizards 0.95, 159 0.97, 126 0.93; 252 and 100 ~0.6; 80 0.45; 317 0.10; 63 and fewer, 399 and more ≤ 0.07.
- observed data cycle 9.2-12.5 → **8.8-13.6**, middle 0.05 → **0.09**: one step on any one arrow lands (6/3/5 0.079, 5/2/6 0.076, 5/4/6 0.057, 4/3/6 0.051); equal arrows 4/4/4-6/6/6 (0.134-0.148), 3/2/4 (cycle 15.0) and 8/4/10 (8.6) do not.
- Full check 2026-10-07: A, C, D and every all-stage bar pass (63 of 66). B fails 2 bars B-only, the same 2 as the committed page (run on HEAD's files the same day): the lactase observed data sits 2.7-2.8 from its target profile (bar 1.14), and on the grid slow and mid share settings. In the full run a third, "each made record sits within its setting's window", fails at partial 1.02 (needs < 1): run order, not today's edits. All three are R-8, still open.
- Check D (12-16 Go's): even 4/5/6/8/10 equal and 8/6/6 1.00, opening / 3/3/3 / 6/6/4 0.00; orange and blue at 4.5, 5, 7, 8, 10 1.00, at 2 and 4 0.00; collapse 159 0.88, 200 0.81, 126 1.00, 1,002 and 50 0.00; observed data at its setting 1.00, 6/3/5 1.00, 5/2/6 0.83, opening / 5/5/5 0.00; no round's setting lands another.

## JM's pivot, 2026-10-05 (evening) — C and D rebuilt from zero

- C: *"I'd like the DAG to just have Locus 1 -> Trait 1 -> Fitness <- Trait 2 <- Locus 2 as a DAG, with the arrow between them being "Prob. of independent inheritance" and have that be adjustable. I'd also like cross arrows that potentially allow locus 1 to affect both Traits and Locus 2 to affect both traits. I'd like the targets revised to illustrate hitchhiking & selective sweeps still, but also pleiotropy and epistasis with a cleaner structural model."*
- D: *"I think Part D on frequency dependence could be streamlined and simplified. I think using an animal example with more than 2 alleles/traits might help, and a more interactive/diagrammatic way of illustrating the process & outcome. Something simple like frequency over generation plots revealing oscillations. A simple model that lets drift get ramped up which creatres the possibility of a total system collapse, too, would be good."*
- His picks (asked): epistasis = **Locus 2 → onto the Locus 1 → Trait 1 arrow** (gene × gene on a trait); C's card judges the **whole trajectories** (both loci's allele frequency by generation, one distance reading, as B's whole profile); D = **side-blotched lizards** (orange / blue / yellow, rock-paper-scissors, one locus, three alleles); D's display = **frequency lines + a triangle** (the population traces a loop; a collapse runs to a corner).
- Supersedes R-9 (C card in allele counts) and the old C and D below.

Plan:
- **C engine**: two loci, two alleles each, diploid individuals; traits additive in copies; fitness from the two traits; one gamete per parent, Locus 2 taken from a random one of the parent's two chromosomes with probability = independence (so recombination fraction = half of it; 1 = different chromosomes). Chance = headcount. Locus 1's new allele starts in a few % of chromosomes, all one founder's, carrying Locus 2's allele.
- **C diagram**: Locus 1 → Trait 1 → Fitness ← Trait 2 ← Locus 2; Locus 1 ⟷ Locus 2 "prob. of independent inheritance" (settable); cross arrows Locus 1 → Trait 2, Locus 2 → Trait 1; Locus 2 → onto (Locus 1 → Trait 1); chance. One arrow glows per target.
- **C rounds** (proposed, to measure): a neutral hitchhiker (independence free); a harmful hitchhiker dragged up (independence free); pleiotropy (Locus 1 → Trait 2 free); epistasis (the onto arrow free: Locus 2's allele sweeps second, once Locus 1's is common; beach mice Mc1r × Agouti, Steiner et al. 2007); one more after measuring.
- **D engine**: lizards, annual; one locus o / b / y; throat orange if any o, else yellow if any y, else blue (dominance order to check with JM / Sinervo et al. 2001); males' mating success from the colours they beat and are beaten by (orange beats blue, blue beats yellow, yellow beats orange: three settable "beats" arrows); chance = headcount; a colour lost = the cycle collapses.
- **D readings** (to measure): where the loop centres (each colour's average frequency: in rock-paper-scissors a stronger orange makes **yellow** commoner), how fast it cycles, how far it swings, years until a colour is lost.

- JM, mid-build: *"Targets, questions, and objectives in lessons should be built to enhance student understanding, rather than to assess it."* So windows are sized on the idea a round teaches (right direction, rough size: a neighbouring slider step passes), closed only to the misconception or naive answer the round is built around. Noise sets the floor of a window, never its width.

### Measured, 2026-10-05 evening (scratch prototypes `l14cd/c_proto.js`, `d_proto.js`)

**C** (N 1,000; Locus 1 → Trait 1 0.3, Trait 1 → fitness +1, Trait 2 → fitness −1; Locus 1's allele from 5%, all on chromosomes carrying Locus 2's; 150 generations; fitness exp(T1 − T2); ~30 ms a population):
- Hitchhiker (Locus 2 neutral, from 15%): where it ends tracks independence on a log scale: 0 → 1.00, 0.005 → 0.95, 0.01 → 0.92, 0.02 → 0.83, 0.05 → 0.66, 0.1 → 0.48, 0.2 → 0.31, 1 → 0.15. All the action is below 0.2, so the arrow steps are 0, 0.002, 0.005, 0.01, 0.02, 0.05, 0.1, 0.2, 0.5, 1.
- Dragged (Locus 2 → Trait 2 0.1, harmful): at independence 0.02 it rises to ~0.45 with the sweep, then is purged; at 0 it is carried to fixation and slows the sweep; at 0.1 it barely rises.
- Pleiotropy (Locus 1 → Trait 2): 0.1 / 0.2 slow the sweep (half-way at ~20 / ~45 generations vs ~15); 0.3 cancels it; 0.4 reverses it.
- Epistasis, second sweep (Locus 2 → onto (Locus 1 → Trait 1), Locus 2 from 5%, unlinked): 0.1 / 0.2 / 0.4: Locus 2 at 0.30 / 0.70 / 0.99 by generation 50, after Locus 1.
- Epistasis, masking (onto −0.1 to −0.3, Locus 2 from 60%): Locus 2 is purged once Locus 1 is common; Locus 1's sweep slows.
- Reading: mean |run − data| over generations and both loci, Go = three populations averaged. A noise-sized window (95% of the truth's) passed the truth 93-100% and one log step either side 0-53%; two steps away ~0. Windows will be widened so one step either side passes.
- A drift round does not work here: below ~100 individuals the sweep is lost often enough (from 5%) that averages of three can't be judged.

**D** (lizards; fitness exp(gain from the colour you beat × its frequency − loss to the colour that beats you × its frequency), zero-sum; males only; o > y > b dominance):
- The linear form (1 + s f) runs away even at 20,000 lizards (the loop grows to an edge in 70-210 years): collapse would not be drift's doing. A win worth more than a loss damps the loop to the centre (colours wander, no clear cycles). The exponential zero-sum form holds a steady loop: cycle length 20.7 / 12.4 / 9.7 / 8.6 years at strength 2 / 4 / 6 / 8 (spread 0.1-0.8), the same at 300-3,000 lizards; swings ~±0.25.
- The centre follows the rock-paper-scissors rule: orange beats blue harder (2 → 8, others 4): orange stays 0.38, blue 0.44 → 0.25, yellow 0.18 → 0.37. Yellow beats orange harder (2 → 8): orange 0.51 → 0.25, blue 0.22 → 0.49, yellow stays 0.27. A colour's average is set by the arrow two steps round the loop, not its own.
- Collapse (an allele lost for good, strength 4; average of three): 50 lizards 22 ± 8 years, 80 39 ± 20, 100 53 ± 23, 130 78 ± 27, 160 107 ± 40, 200 138 ± 40 (2 of 40 never in 200 years). Below ~200 the game collapses faster than no game (the big swings carry each colour near zero); above it, slower.
- Real cycles are 4-5 years (Sinervo & Lively 1996); this engine's fastest is ~8. Framed "based on".

| # | What | Status |
|---|------|--------|
| P-1 | C engine prototype (node): hitchhiking vs independence, pleiotropy, epistasis; trajectory distance spread | done (above) |
| P-2 | D engine prototype: deterministic behaviour (damped / steady / runaway loop), drift collapse vs neutral, readings' spread | done (above) |
| P-3 | C, D rounds chosen from P-1/P-2; traps measured | C: hitchhiker (independence), dragged (independence), pleiotropy (Locus 1 → Trait 2), second sweep (onto +), masking (onto −). D: even fight (all three arrows: cycle speed + centre), orange beats blue harder (centre), yellow beats orange less (centre), collapse in about a century (chance), observed data one shot (Los Baños-like, all free). Windows on the idea |
| P-4 | page: C and D sections, engines, diagrams, cards, triangle; `scaffold`/`version` | done: C = Locus 1/2, Trait 1/2, fitness, chance; independence on log steps (0, 0.002 … 1); card = both alleles' course (data dots every 5 generations, a band as wide as the window), gauge "average gap" = the larger locus's mean absolute gap; top: chromosomes by which new alleles they carry, the two traits' averages. D = ring of three "beats" arrows + "mates won" (grey) → next year's lizards ← chance; top: colour shares by year, the triangle path; card: the loop's middle on a triangle, gauges for years a cycle and the year a colour was lost; 4 rounds + a one-shot. `version` 10, `scaffold` 22 unchanged (D1-D4 + D5 the one shot) |
| P-5 | `check_lesson14_numbers.js` C and D rewritten | done (results below) |
| P-6 | B agent (R-8) cancelled by JM mid-fix | its first pass is in the committed page (05dc829: alleles per locus, stacked dot plot); its notes say 2 of B's 22 bars failed then (the lactase observed data 2.56 vs bar 1.14, and one more); its later work (six populations, re-derived bars) never landed. R-8 stays open |

**C as built, 2026-10-06** (windows chosen off each step's gaps, 30 Go's a step; q50 / q95 of the gap):
- hitch (independence 0.02, Locus 2 neutral, from 15% on Locus 1's chromosomes): bar 0.10. 0.01 → 0.062 / 0.095, 0.005 → 0.096 / 0.125, 0.05 → 0.144 / 0.215; opening 0.59.
- dragged (0.01, Locus 2 → Trait 2 0.1): bar 0.12. 0.02 → 0.082 / 0.123, 0.005 → 0.115 / 0.198, 0.05 → 0.154; opening 0.22. Rises to ~0.58, purged by generation 150.
- pleio (Locus 1 → Trait 2 0.2): bar 0.14. 0.15 → 0.132 / 0.156, 0.25 → 0.316, 0.1 → 0.197; opening 0.26.
- second (onto +0.15, Locus 2 from 5%, unlinked): bar 0.12. 0.2 → 0.083 / 0.116, 0.1 → 0.143 / 0.271; opening 0.56.
- mask (onto −0.2, Locus 2 from 60%): bar 0.06. −0.1 to −0.3 land (q50 0.038-0.053), −0.05 → 0.151; opening 0.43.
- First tried: the gap averaged over both loci. In rounds where Locus 2 does nothing it halved the signal, and the pleiotropy window then let the opening in 100%. Now the larger of the two loci's gaps.
- Anchors (framing, JM to check): Cyp6g1 neighbourhood in *Drosophila* (Schlenke & Begun 2004); deleterious variants near dog-breed sweeps (Marsden et al. 2016); VKORC1 warfarin resistance and vitamin K need in rats; beach mice Agouti × Mc1r (Steiner et al. 2007); masking: E over B in Labradors (a mechanism, not a sweep study).

**D as built, 2026-10-06** (60 Go's a setting for the middles; 12-16 Go's per hit rate):
- even (6/6/6, 1,002 lizards): middle (0.366, 0.362, 0.273), cycle 9.79 ± 0.08; window cycle 8.5-11.5 + middle within 0.05. Equal arrows 5-8 land; 4 and 10 do not; 6/6/4, 8/6/6, 5/6/7 do not; 6/7/6 does.
- orange (orange beats blue 8, others 4): middle (0.376, 0.254, 0.370); 6.5-10 land, ≤ 6 do not.
- blue (blue beats yellow 8): middle (0.499, 0.318, 0.183); 6.5-10 land (10: 0.92).
- collapse (159 lizards, arrows 4): lost at 110 ± 36 (average of three); window 50-180 (first 60-170: 126 and 200 lizards landed only 63-69% in the check). 50 and 1,002 lizards never.
- observed data, one shot (5/3/6, 252 lizards): middle (0.257, 0.404, 0.340), cycle 10.87 ± 0.11; window cycle 9.2-12.5 + middle 0.05. Most settings within ±0.5 on each arrow land; 6/3/5, 5/5/5, 4/4/4 do not; 159 lizards or fewer sometimes collapse and miss.
- Open for JM: the dominance order (o > y > b) is our reading of Sinervo et al. 2001; real Los Baños cycles run 4-5 years and this engine's fastest is ~8 (strength 8-10); the anchors (Sinervo & Lively 1996, Sinervo et al. 2000 testosterone, Sinervo et al. 2006 blue cooperation, Corl et al. 2010 morph loss) are framing only.

## JM's review, 2026-10-05 — E out?, the diagrams, A's signs, the sweep display

- *"I'm also leaning towards removing part E from lesson 14"*
- *"review the DAGs in lesson 14. Some of them felt glitchy to me. I also dislike their arrangement—for part B, having two arrows with no mediators felt off. For the piggy backing one, the arrow arrangement is inconsistent for the beneficial & nearby harmful genes."*
- *"I'd also like the finch example to have more diverse targets (two positive, two negative, one neutral)"*
- *"I think the format of the sweep part to be brought more in line & simplified to connect nicer with the visualization style used in Lesson 15."*

Seen (headless screenshots, every stage open, one Go each): B's diagram is advantage → new allele ← chance, nothing between; C's new allele (top left) acts through trait → survival, its harmful neighbour (top right) runs one long diagonal straight to survival, so two genes on one chromosome sit at opposite corners and act in different ways; B and C's chromosome panel is a 40 x 100 barcode (dark = rarer allele). A's rounds are +0.30, 0, +0.08, +0.50, −0.18 on the beak arrow: three positive, one neutral, one negative.

Plan:
- **Glitches first, measured**: drive every diagram headless (drag each settable arrow end to end, deal every round, Go, resize) and list what misbehaves before changing anything.
- **A**: "beak" round +0.30 → −0.30 (then +0.08, +0.50 positive; −0.30, −0.18 negative; chance 0 neutral); re-measure its readings and every trap with the A check.
- **B diagram**: give it the skeleton C and D already have: new allele → survival (advantage) ← chance; survival → new allele next generation ← crossovers. Same engine (parents drawn by weight is survival or fecundity alike, as C and D call it).
- **C diagram**: the two genes drawn as neighbours on one chromosome and acting in the same way (JM to pick the arrangement).
- **Sweep display (B, C)**: Lesson 15's bead strings: fewer chromosomes, a subset of markers as beads, plain grey for the common allele and a colour for the other, the new allele's bead at the gene; readings still off every marker.
- **E**: JM to confirm; if out, the stage moves to `app/archive/` whole (a source for the mutation lesson), `scaffold` 27 → 22, version bumped, the E check dropped.

- JM's answers (2026-10-05): E out, *"Remove, archive it"*; C, *"Both through a trait"*: the two genes side by side on one chromosome, each gene → its own trait → survival (new allele → trait ← environment; harmful allele → health), survival → new allele next generation ← crossovers; the harm round's settable arrow is health → survival (the engine's (1 − harm) per copy is that trait).

- JM, later the same day: *"Have a linkage arrow between the beneficial & harmful alleles. Also 'how common an allele is' isn't caused by the allele directly—it's a separate box that modulates the trait/reproduction arrow"*. Read as: C gains a grey linkage arrow between the new allele and the harmful allele (both ways); D loses "host's alleles → how common they are": host's alleles → survival is the arrow, "how common they are" lands on it (grey), and the settable pathogens arrow lands on it too (the engine: survival = 1 − c × how common the host's alleles are, so both scale the allele's effect).

- JM, later still: *"For the selective sweep predict panel—let's scrap the Mb framing, and just have a 'number of alleles' for each locus with the beads shown as a basically a stacked dot plot. That might be easier to interpret as students can see the bars fall."* Asked what is judged: *"Whole profile"* (one reading: how far the run's column heights sit from the observed data's, locus by locus); C *"too, to match"*. A marker is two-allele, so a locus = 4 neighbouring markers and an allele = a distinct 4-marker sequence (25 loci, one per bead; works the same on the real lactase haplotypes, engine unchanged).

| # | What | Status |
|---|------|--------|
| R-1 | diagram glitch audit, A-D | done (real pointer events, hit-testing): (1) every diagram's arrows stayed draggable during a Go — `.paths-hit { pointer-events: stroke }` beat the locked panel's `none` (seen: beak 0.00 → 0.56, trait → survival 0.05 → 0.24 mid-run, drawing frozen, snapping back at the end); (2) C's "one copy → trait" (−0.5..1) not signed, so −0.5 drew dashed like zero; (3) the drag note said "up = bigger" for signed arrows. Clean: hit targets (no wrong arrow picked), round deals, `onto` landing, resize. Lesson 13 has bug (1) too (not edited) |
| R-2 | A: two positive, two negative, one neutral; re-measured | done: "beak" +0.30 → −0.30 (s 0.5 held): slope +0.11636 ± 0.00737, error 0.01492 ± 0.00195 (500 runs, seeds 9001 + 7919 q; the recipe reproduced the old +0.30 numbers exactly first). Now faint +0.08, strong +0.50; beak −0.30, both −0.18; chance 0. Check A: 24 bars pass; no round's answer clears the observed data more than 12% (strong); beak's answer clears both's windows 0.2%, both's clears beak's 0% |
| R-3 | B diagram with mediators | done: new allele → survival (advantage) ← chance (right); survival → new allele next generation ← crossovers |
| R-4 | C diagram: the two genes consistent; linkage arrow between them | done: new allele ⟷ a harmful allele beside it (grey, both heads); new allele → trait ← environment, trait → survival; harmful allele → health (grey, "each copy counts") → survival (settable); chance right; crossovers box moved clear of the outcome (they touched) |
| R-4b | D diagram: how common → (host's alleles → survival); pathogens onto the same arrow | done (`ontoAt` 0.3 / 0.65); chance moved right |
| R-5 | B/C chromosome panel as Lesson 15 bead strings | done (built on a copy, applied as a patch): 16 of the 40 sampled chromosomes, 25 beads (every 4th marker), grey the commoner allele, Lesson 15's colours for the other, the gene bead purple and ringed on carriers; checks B 22/22, C 14/14 on the copy. To be re-coloured by locus allele with R-8 |
| R-6 | E removed (JM confirmed) | done: the page as committed (E intact) is `app/archive/lesson14_with_E_2026-10-05.html`; E's section, code, CSS, gate, check part gone; D finishes the lesson; `version` 9, `scaffold` 22 (bits A 0-5, B 6-11, C 12-16, D 17-21); a bypass code decodes 22/22; check D 16 bars pass |
| R-7 | fixes from R-1; full check green | fixes done: lesson CSS `.controls.pending .paths-hit, .paths-step { pointer-events:none }` + blur in `lockStage`; `h` signed; `renderNote` true for signed arrows (lesson 9 shows that note). `paths.js` gained opt-in `ontoAt` and `both`; lessons 8, 9, 13 and 14 A's diagrams byte-identical before/after. Checks A 24/24, D 16/16. Full check after R-8/R-9 |
| R-8 | B card: alleles per locus as a stacked dot plot, judged on the whole profile; lactase target in the same terms | done 2026-10-07 (B-1 to B-4 above) |
| R-9 | C card in allele counts to match B | todo |

## JM's notes, 2026-10-02 — A and B text, A's diagram

- A intro = his dictation (minor edits only); A bullets = his four, verbatim-ish (*"those should be the bullets"*).
- A diagram: *"beak size instead of beak depth"* (matches HMGA2's label in the genome picture); boxes *"genetics"* and *"non-genetic factors"* → beak size, *"they shouldn't have arrows that you can manipulate ... they don't even necessarily have to do anything"*; *"survivor → parents → new chicks. To make that clear."*
- B intro = his dictation; B bullets *"highly simplified and adjusted"*.
- Engine consequence: the page drew parents from every bird of the year (dead or alive: "they bred first"). Survivors → parents is only true if deaths come first, so the engine changes and A's targets are re-measured.

| # | What | Status |
|---|------|--------|
| N-1 | A voice ← dictation; bullets ← his four; intro layout voice \| bullets over genome | done ("child to parent" → "parent to child"; "HGMA one" → HMGA2) |
| N-2 | A diagram: beak size; genetics, non-genetic factors → beak size (grey, inert); survivors → parents | done; rows spread so chance and beak arrows read at full width (chance ~49 px → ~90 px) |
| N-3 | A engine: deaths first, survivors breed (births weight 2q/(1−q) keeps 500 birds level); bars' expected = survival × (1 + chicks) | done |
| N-4 | A rounds + observed data re-measured; check A green | done: 24 bars pass |
| N-5 | B voice ← dictation; bullets cut down (7 → 6, no fitness formula, no "diagram is the controls") | done |
| N-6 | `paths.js`: an `onto` arrow's tip lands on its point (it stopped 2 + 2.7 widths short, ~29 px at full width) | done; only lesson 14 A uses `onto` |

- **Survivors breed, measured** (node, page engine, 500 runs, seeds 9001 + 7919 q): beak 0.30 / 0.5: −0.11691 ± 0.00705, 0.01489 ± 0.00196 · chance 0 / 2.2: −0.00056 ± 0.02050, 0.03281 ± 0.00653 · faint 0.08 / 0: −0.03258 ± 0.00670, 0.01296 ± 0.00180 · strong 0.50 / 0.5: −0.18683 ± 0.00880, 0.01788 ± 0.00292 · **both −0.18 / 1.8**: +0.05624 ± 0.01507, 0.02744 ± 0.00428 · data 0.45 / 2.0: −0.11567 ± 0.02949, 0.03338 ± 0.00568.
- Selection compounds (the beak sets survival and then who of the survivors breeds): slopes ~10% steeper, errors ~10% larger, data's slope spread 0.022 → 0.029.
- **"both" flipped sign.** At +0.18 its answer cleared the data 57% (the data's wider slope window reached −0.051). Tried: +0.12 (right luck, no beak cleared it 35%); data at 0.55/1.8 (right beak, no luck cleared the data 35%); data 0.5-0.6 at 2.0 (both's answer 35-40%). −0.18: every trap passes; the round now asks for the other direction (big beaks lose in droughts), which the signed arrow allows.
- Headcount: harmonic mean 364 at no luck/no beak (was 374; real 372); peaks higher (median max 2,912 vs 2,089: a wet year now lifts survival and then the survivors' breeding). Birds strip ceiling 5,000 → 10,000 (the data run peaks at 5,204). Luck 3 explodes some runs past 100,000 birds; the old engine did too (top 179,114 of 100).
- Not checked by a bar: that only survivors breed (the first-year headcount test cannot tell the two orders apart in an ordinary year). By construction: `pick()` draws from the survivor list.
- Open for JM: "non-genetic factors → beak size" is drawn and does nothing (as he allowed). Making it real (beak = genotype + noise) means re-measuring all six targets. B's source (JM, 2026-10-02): Pollinger et al. 2005, *Genome Res.* 15:1809 (PMC1356119): 302 microsatellites, 8-12 dachshunds; *"three linked monomorphic microsatellite markers all within a 10-Mb region on chromosome 3"* (elsewhere *"a 15-Mb region"*), containing FGFR3, *"responsible for achondroplasia in humans, but not in dogs"*; cause *"a gene or regulatory region closely linked to FGFR3"*. His text says ~20 Mb on either side (~40 Mb): the paper's region is 10-15 Mb in all. Later: the breed's short legs map to an FGF4 retrogene on chromosome 18 (Parker et al. 2009), not chromosome 3. Text left as dictated. A lactase transition in the intro would name the one-shot before it is taken (2026-10-01: named only after); the solved banner is where it can go without that. No lactase-selection quote in the corpus (only 145_lec04_05, 336_lec07_03).

## JM's second pass, 2026-10-01 (evening) — A and B

- Genome mock-up: *"The 'other sites: which allele...' Bit in the intro figure is cut off. That panel also doesn't need a title"* (JM will describe it in the text).
- Wording, this lesson and (noted in `REVISIONS_PLANNED.md`) past ones: *"drop the use of 'move' and replace with 'change the frequency of' when talking about alleles"*; *"'offspring, against [other]' structures should be just shift to use 'relative to' instead of 'against'"*.
- Bars key: *"just 'survivors' and 'new offspring'"*.
- The record: *"'one shot at the record' should be: 'Try to match actual data' -- let's not call it 'the record' and instead just state it as empirical data"*; B: *"'the record' should just be 'observed data' and 'copies' should be 'chromosomes'"*.
- **A's diagram, rebuilt.** *"What matters is how beak depth **causes** differences in food acquisition under different levels of rainfall. So the beak depth arrow should really point to the rainfall->food a bird gets arrow, and that should be the lever students tweak."* *"if sliding [the chance arrows] controls the population size...what are birth and death rates doing?"* His structure: *"Rainfall -> Food available (with an arrow from Beak depth to the Rainfall->Food available arrow itself ...). Birth rate <- Food available -> Death rate with population size the outcome ... a population size -> food available arrow. Birth rate -> New chicks -> Frequency of allele <- Survivors <- Death rate ... A path from Parents to New Chicks"*; *"I'd prefer conceptual clarity to the students over proper DAG construction so long as the visual model accurately reflects the underlying simulations."* Then: chance → births and deaths (*"Why not random chance influencing birth and death rate?"*), boxes renamed *"just 'births' and 'deaths' instead of the rate--to reflect the combination of stochastic and deterministic inputs"*, and *"even if an arrow doesn't matter mathematically here, I'd want to include anything needed to keep the model interpretable to a student--and seeing no chance effect on death would be wild!"*
- Measured before building (scratchpad prototype, 200 runs, beak 0): luck on births raises the error 0.0122 → 0.0157 / 0.0213 / 0.0291 (spread 1 / 1.5 / 2); luck on deaths, fresh each year, leaves it at 0.0122 (a death is already a coin toss; a random bias on the coin has the same average) and only dilutes the beak (slope −0.166 → −0.149 at 2). So the one chance control drives both, the drift comes through births, and the diagram still says what the engine does.

| # | What | Status |
|---|------|--------|
| A-1 | genome key wraps (no cut-off); no title | done |
| A-2 | "move" → "change the frequency of"; "against" → "relative to" (on-screen text, A-E); `REVISIONS_PLANNED.md` row 9 for 1-13 | done. Left: C's solved banner ("the population only moves by the additive variation": a lecture quote, about the mean trait), E's "move the curve" (not an allele), "protects against a malaria" |
| A-3 | bars key: "survivors" / "new offspring" | done |
| A-4 | "the record" → "observed data"; last target "Try to match actual data" (A-E, the round machine) | done (comments still say record) |
| A-5 | B: "copies" → "chromosomes" where a copy is a chromosome (B's display, reused by C; C's crossovers box) | done. D and E keep "two copies of the gene" (gene copies in one individual) |
| A-6 | A engine: population size emerges (survivors + chicks; crowding cuts food); food = rain + beak x rain + crowding; luck on births and deaths | done |
| A-7 | A diagram: beak depth → the rainfall → food arrow (settable); chance → births, deaths (settable, one control); the rest grey, "−" on the three negative ones; `paths.js` `onto:` (an arrow that lands on an arrow) | done |
| A-8 | A rounds and the observed-data target re-measured; check rewritten for A | done: 24 bars pass |
| A-9 | B lag, C freeze (JM: *"Stage B is laggy at times, and stage C freezes and the DAG bugs out"*) | done, see below |

### As built, 2026-10-01 evening — A rebuilt again; B, C, D made in slices

- **A engine** (population an outcome): food = −dry + beak x (k − 1) x dry − log(N / 500); deaths plogis(qlogis(0.35) − food + luck z); births weight 0.7 exp(food + luck z′ − luck²/2), new chicks Poisson(Σ/2), parents by weight, one copy from each; N next = survivors + new chicks. No luck, no beak: N 111-2,089, harmonic mean 374 (real fortis 1976-2012: 71-2,531, 372). Levers: beak −0.6..0.6 (signed), luck 0..3 (one control on both; input runs to −0.3 so 0 draws thin). Top-left gained a birds strip (log); bars key survivors / new offspring.
- **A rounds** (beak, luck; slope, error, 500 runs): beak 0.30, luck held 0.5: −0.1055 ± 0.0055, 0.0134 ± 0.0017 · chance: beak held 0, 2.2: −0.0001 ± 0.0175, 0.0304 ± 0.0060 · faint 0.08, luck held 0: −0.0290 ± 0.0054, 0.0111 ± 0.0014 · strong 0.50, luck held 0.5: −0.1682 ± 0.0090, 0.0172 ± 0.0025 · both 0.18, 1.8 free: −0.0519 ± 0.0137, 0.0243 ± 0.0039 · **observed data** 0.45, 2.0 free: −0.1177 ± 0.0220, 0.0298 ± 0.0050. Opening 0, 0.
- **A traps measured:** moderate luck (~1) cannot be told from none on forty years (error 0.011 → 0.014), so free-luck targets sit at ≥ 1.8 and the rest hold luck. Data first at (0.4, 1.8): right beak at no luck cleared it 30% → (0.45, 2.0): 15%. "strong" at luck 1.2 was cleared by the beak alone 98% → luck held. No round's answer clears the data more than 17% ("strong"); 91 reachable settings, none clears two rounds.
- **Chance on deaths** adds no drift (a death is already a coin toss; a randomly biased coin has the same average) and dilutes the beak a little; kept because JM wants the arrow (*"seeing no chance effect on death would be wild!"*), and the engine does what it draws.
- **B, C, D freezes, measured** (plain node; Chrome with the extension's debugger attached ran ~9x slower and is not a fair clock): B Go at the slow round 0.7 s, at advantage 0.01 with 2,000 individuals 2.9 s; B's observed data at deal 0.3-0.8 s (on one seed: up to 40 tries, so up to ~20x that on an unlucky one); C Go 2.7 s at selection 0.01, 1.0 s at environment 4; C's observed data 0.06-0.3 s; D's 0.65 s at the fish round. All on the main thread, and a slower laptop multiplies them. So the page froze. **Now:** every run is a generator yielding each generation; a runner advances all jobs for ~20 ms a slice (`startJob`, "long work in slices"); Go shows "running… population 2 of 3, generation 412"; observed data is made in slices after the deal with "drawing the observed data…" meanwhile; Next target waits while a run is made or played (`busy`). Same draws in the same order, so the same numbers; `B_record` etc. stay synchronous for the check, which sets `JOBS_SYNC`.
- **C's "DAG bugs out":** `paths.js` writes the bound input and leaves the redraw to the page; C's change handler never asked for one (B and D redraw through their chance box's headcount), so a dragged arrow kept its old width and number while the value underneath changed. `C_changed` (and the new `A_changed`) now call `paths.sync()`. C's boxes were also spread out: the held "new allele → trait" arrow at full width had no room for its head and drew as a blob.

## JM's review, 2026-10-01 (supersedes the stage plans below where they differ)

- Lesson goals, in his order: *"(1) unite their prior experience with processes/widgets to predict real-ish data they could encounter going forward, (2) deepen & broaden their understanding of what influences selection, and (3) least & last of all, lay a simple groundwork for understanding loci-level changes in prep for the upcoming mutation lessons where MRCAs, identical-by-descent blocks, and coalesence all figure."* Future lessons' drafts: non-binding, non-guiding.
- **A:** *"The solid dots should be removed ... putting dark purple dots and lines ontop of existed black dots and lines makes it hard to see"*; record shown only at the end. Labels: top right y *"fitness (relative to yellow)"*; card x *"total rainfall (mm)"*, gauges *"slope"*, *"error"*, card y *"change in frequency of big beak allele"*. Names: allele names everywhere, never purple/yellow (*"just use the name of the allele"*). DAG: *"(1) who lives/dies (carry-over), (2) reproduces and (3) how much the offspring resemble the parents ... meiotic chance (so an unalterable arrow) ... rain -> food -> death rate / birth rate with beak"*. **A2**: one shot, no practice, aim at the record's trajectory.
- **B:** *"opens too hot"* → a static mock-up of a finch genome beside A's text (a few of the Grants' loci as blocks, heterozygous at A's locus). Top right y *"new allele frequency"*. **B2**: one shot at the real lactase data, the gene revealed after.
- **C:** *"(1) the size of the selective sweep is a function of the **speed** of selection and (2) many things can slow selection down **other than** the selective strength on the phenotype (low h, fluctuating selective regimes, linked loci, etc)"*; each target *"based on, not identical to"* a specific empirical finding, same units.
- **D:** *"frequency dependent selection, ideally with an immune or disease angle."*

### As built, 2026-10-01 (supersedes "Plan for this pass" and the stage sections below where they differ)

- **A** births/deaths engine: food = −dry + 0.5 (k − 1) dry; death = plogis(qlogis(0.35) + d·food); parent weight exp(b·food); survivors stay, chicks fill the room, one copy from each parent; N constant. Diagram: rain → food ← beak depth ← big-beak allele (grey); food → death rate, food → birth rate (settable, signed); chance → both (one control); death rate → (−), birth rate → (+), meiosis → next year (grey). Bars: survives + chicks per genotype, relative to the small-beak homozygote; blue covariance line. Card: change vs rain (log10(mm+10), wetter right), gauges "slope" (per tenfold rain) and "error". No record in rounds 1-5.
- **A rounds** (d, b, birds; held arrow): deaths −0.6, 0 held, 1,002 · chance 0, 0 held, 32 · births 0 held, +0.6, 632 · both −0.5, +0.3 held, 796 · faint −0.2, 0 held, 1,589. Opening 0, 0, 126. **Record (one shot)**: −0.3, +0.2, 399 birds (harmonic mean of the real fortis counts: 372), all free; its trajectory, points and gauge ticks drawn, windows shown after.
- **A traps measured:** both at 80 birds: right food arrows at the opening's headcount cleared it 75% → moved to 796. Record first at (−0.4, +0.3, 502): round 4's answer cleared it 60% → moved. Chance at 40 birds: opening cleared it 12% → 32. Grid of reachable settings (holds applied, 352 x 16): most 1. Deaths' answer clears the record 17%.
- **A intro** gained a static genome canvas: four chromosome pairs, HMGA2 (heterozygous: big-beak / small-beak allele), ALX1, BMP4, CALM1 as blocks; no chromosome numbered (placement is a mock-up). Bullet "the rain you fitted in Lesson 7" was wrong (lesson 7's rain is synthetic): now "As in Lesson 7" on the mechanism only.
- **B**: lactase is the one-shot last target, named only after it is shot at ("people, chromosome 2" before). Fifth round "partial": 0.1, 1,383, stopped at 50% (rest 0.957 ± 0.013, stretch 0.71 ± 0.07 Mb). Each round's answer clears only its own (8 Go's each). Top right y: "new allele frequency".
- **C** what slows a sweep: B's chromosome (992 individuals) with a trait: 0, h, 1 for 0/1/2 copies + environment (sd se); parents by exp(beta x trait in its own sds) x (1 − harm)^copies; in the rain round beta x dryness in dry years, wet x dryness (the other way) in wet ones, Stage A's rain cycled. Go runs **six** populations (three let the opening through 40-50% on recessive and rain). Card: generations to 95% (log) against carriers' shared stretch; band on the stretch; every population's dot stays across rounds.
- **C rounds** (free arrow, truth, stretch Mb): strong beta 0.2, 1.39 ± 0.11 (DDT resistance, fruit flies) · recessive h 0.05, 0.90 ± 0.09 (Duffy-null) · environment se 1.5, 0.75 ± 0.07 (red deer antlers, Rum) · rain wet 0.1, 0.53 ± 0.04 (Daphne beaks) · linked harm 0.1, 0.77 ± 0.07 (fruit flies, low crossing over). Held: beta 0.2, h 0.5, se 0.5, wet 0, harm 0; opening beta 0.05. h runs −0.5..1 so the recessive window is not at the slider's floor (h < 0 never sweeps).
- **C record** = one population within 0.6 of a six-average spread of the mean, closest of 16 tries (at 1 spread the records sat at 0.97-0.99, too near the check's bar). D's: within 1 spread, closest of 12. Both capped because they are made on deal (a large population takes ~0.25 s).
- **C measured:** slowers all fall near one footprint-vs-time curve; recessive sits above it (0.90 Mb at 161 gen vs ~0.70). A harmful neighbour 40-120 kb away did not slow the sweep that won (it had shed it): so the neighbour is "too close to split". Settings that never sweep end the Go at the first failed population (cap 1,500 gen., 200 restarts).
- **D** when the rare allele wins: an MHC-like gene (pathogens: survival 1 − c x mean frequency of the host's two alleles) and a neutral gene, unlinked, both from 20 alleles, mutation 1/1,000 to new alleles, 500 generations; sample 100 individuals. Card: alleles at the neutral gene (across) vs at the immune gene (up), diagonal = as many at both. **First built on one gene (alleles + homozygosity): pull 0.2 at 502 cleared two rounds 100%, pull 0.3 at 2,000 cleared HLA 67%; the neutral gene pins N.**
- **D rounds** (pull, individuals; immune / neutral alleles): HLA-B 1.0, 1,262 (39.2 / 20.9) · San Nicolas foxes 1.0, 50 (5.7 / 2.0) · cheetahs 0.4, 399 (16.0 / 9.0) · sticklebacks, few parasites 0.2, 1,262 (28.1 / 20.7) · Soay sheep 0.7, 632 (24.5 / 12.6). Opening 0, 200 (fox was cleared 25% from 126). Cheap routes ≤ 6%.
- **Anchors are framing only** (rows on the card; no data files). JM to check: Aguilar et al. 2004 (island fox MHC), Hamblin & Di Rienzo 2000 (Duffy), Kruuk et al. 2002 (Rum antlers), Grant & Grant 2002 (Daphne), Betancourt & Presgraves 2002 (low recombination), Daborn et al. 2002 (Cyp6g1), Paterson et al. 1998 (Soay MHC), Wegner et al. 2003 (stickleback parasites → MHC).

### Plan for this pass

- A: births/deaths engine (constant N, survivors carry over, recruits fill the room, parents drawn by birth rate, meiosis); diagram rain → food ← beak ← allele; food → death rate, food → birth rate (settable), chance → both (one control), meiosis grey. Bars: survival + chicks per genotype, relative to the small-beak homozygote. Card x = rain (mm, log, wetter right); slope = change per tenfold more rain. A2 = record at a hidden realistic setting (N ≈ harmonic mean of the real fortis counts), trajectory + card drawn, windows hidden until the shot.
- A intro: genome mock-up canvas (HMGA2 heterozygous; ALX1, BMP4, CALM1 as blocks; no chromosome numbers).
- B: lactase out of the rounds → B2; a fifth round in B1 measured in; partial-stop round considered.
- C: B's engine + one argument per slower; selection on the beak held strong in every round, one slower free per round; card = footprint (shared stretch) against generations, the record a band on the footprint; dots persist across rounds.
- D: many-allele locus, new alleles by mutation (held), N, pathogens that adapt to common host alleles (rare-allele advantage); readings = alleles in a sample and homozygosity (Ewens–Watterson form); MHC / island fox / HLA anchors.

## What the lesson is

- JM, 2026-09-30 (night), the brief this plan answers: *"integrate real world data with the tools we built for students in lessons 1-13 to show how the activities and simulations they've run can help them understand real world data (or simulated data similar to what you would encounter). Selective sweeps, dN/dS, linkage disequilibrium, allelic diversity, etc are meant to be the data they look at and try to predict using widgets and models they've practiced with in prior lessons. This is also meant to be a clean stepping stone on to the mutation exercises coming next. I'd like realistic selective regiems, like fluctating selective gradients and frequence dependent selection, to play some role in at least some of the parts and Drift should be incorporated as an important process."*
- Earlier the same day (still standing): takeaway *"The **rate** of selection and how it manifests geneticaly (increased homozygosity & broader linkage disequilibrium when fast)"*; *"A split of both human-health-related and ecologically-relevant examples is ideal"*; *"Any stage that can clearly link the 'background' skills ... to the sort of data students may actually encounter ... is gold"*; *"forward-looking stages ... MRCA-for-an-allele and different ancestry for different loci"*.

## Rulings (JM, 2026-09-30, night)

- Order: *"I don't have a strong view yet."* A-E as proposed.
- *"There's no need to flag simulated data--this is a student homework problem set."*
- *"modifying the data to be easier to fit in simulations / give cleaner results is fine; our purpose is pedagogical as I just want students to know what real (or realish) data look like, and how the processes they've been practicing manifest."* So a record may be made by the page's own engine at a hidden setting, with a known truth: windows sit on the truth's measured spread, and the record shown is a run near the truth's means.
- r and K: *"It's fine--r and K don't matter here."* (`REVISIONS_PLANNED.md` row 5 now points at the archived page.)

## The rule this plan follows

- **The data is the target; an old widget is the tool.** Each stage puts one kind of genetic data on the Predict card (real, or simulated to look like what a lab would get). The controls are a widget from 7-13, extended by one argument. Go runs it; the run is drawn in the same form as the data; hit = inside the data's window.
- **No new widget families.** The earlier plan's new apparatus (Price-along-the-chromosome plot, ROH strip, a fresh haplotype viewer) is cut or replaced by the old widget that already does it (below).
- **Drift is a lever in every stage** (N, or the population the data came from). **Regimes vary by round**: constant, fluctuating (real rain), switched off (drug withdrawn), frequency-dependent.
- **Two readings per target where possible** (lesson 7's rule: score beak AND count): one the drift sets, one the selection sets. Measured below that each pair separates.
- **Targets sit on scale-free readings of real data.** A 1,000-diploid sim cannot match human-scale parameters; it can match a frequency, a ratio of near to far, a carrier-to-non-carrier stretch ratio, a count of alleles, a dN/dS.

## Stages (proposed): a timescale ladder, years to millions of years, ending at mutation

    A  one allele, year by year      frequency series vs rain        12 B's locus + real rain + 13's diagram  fluctuating   (built)
    B  what a sweep leaves           diversity along a chromosome     12 B's locus on a chromosome + 11's H     constant   (built)
    C  what travels together         haplotypes, hitchhikers (LD)     12 C's race + 11 E's painted chromosomes   drug on/off
    D  how many alleles stay         allele counts, the bump          12 C's race (many alleles) + 12 D's input  frequency-dependent
    E  counting fixed changes        dN/dS                            12 D's mutation curve + 10's 1/2N          purifying / relaxed / arms race

### A — one allele, year by year (fluctuating selection vs drift) — BUILT 2026-09-30

- Data card: an allele's frequency by year, under the year's rain bars.
- Tool: lesson 7's rain → seeds → beak (they fitted it) with a beak gene added on 13 C's genes + environment DAG; N from 10. Arrow being set: rain → the gene's fitness.
- Rounds: constant push; the real Daphne rain (1973-2012, in repo); the 2004-05 reversal (lesson 7 D's newcomers = *G. magnirostris*); small N.
- Two readings: **where it ends** (spread set by N) and **whether its yearly moves track the rain** (set by the push). Measured: the first does not separate them, the second does.
- Round worth having: "keep both alleles for 500 years of this rain". Drift alone fails; one homozygote held fixed fails faster; both homozygotes swinging with the heterozygote between them holds (measured). Hands D its question.
- Real, ecology: **HMGA2** in *G. fortis*, 2004-05 drought (Lamichhaney et al. 2016): s = 0.59 against the large-beak allele; 27% of beak-size variance; 133 birds genotyped; ~30% of the drought's beak shift. Genotype counts to transcribe (Fig. 4 / supplement): JM checks.
- Simulated look-alike: a seasonal fly series (Bergland et al. 2014: hundreds of SNPs moving 4-8% spring to fall, three years).
- Price link: the DAG's cov(w, z) bell flips sign with the rain; E(wΔz) sits at 0 (Mendelian copying).

- **As built** (supersedes the bullets above where they differ): lesson 12 B's one locus (fitness 1, 1 − hs, 1 − s, h held 0.5) with s = −push × dryness each year; dryness = −scale(log(rain + 10)), the real Daphne rain 1973-2012 from `data/clean/grant_rainfall.csv`. No lesson 7 seeds model, no newcomers (the 2004-05 reversal muddled the readings: it moved the miss as much as N did). Diagram: rain → big-beak allele (signed push), chance → big-beak allele (thicker = fewer birds; the chance box says "which of N birds breed"). Top: frequency by year over rain bars | 12 B's bars for the year (hover a year). Card: each year's change against that year's dryness, record (black) and run (purple), a least-squares line each; two gauges with windows: the line's rise from the wettest year to the driest, and the typical miss from it (lesson 3's mean absolute miss).
- **Rounds** (push, birds): rain 0.30, 1,002 · chance 0, 63 · both 0.30, 80 · faint 0.08, 1,589 · wet −0.16, 632. Opening push 0, 252 birds. Windows = truth mean ± 2.2 sd of each reading (400 runs). Truth hits 0.91-0.97; no grid setting clears two rounds at ≥ 50% (231 settings); the opening clears none; push right with chance at the opening: 0-14%.
- **Trap, measured:** with the opening at 200 birds, "both" at 0.24/100 and "wet" at 317, setting the rain arrow alone cleared "both" 55% and "wet" 60%. The miss window spans ±~14 chance steps; every round's population now sits ≥ 20 steps from the opening.

### B — what a sweep leaves (diversity along a chromosome) — BUILT 2026-09-30

- **As built** (supersedes the bullets below where they differ): 12 B's locus (1, 1 − hs, 1 − s, h 0.5, s = −advantage) as bit 50 of a chromosome of 101 markers 40 kb apart (4 Mb), packed in 4 words, crossover 0.001 per gap per meiosis (drawn as geometric gaps), plus 64 unlinked markers in 2 words ("the rest of the genome"). One new copy; lost copies restart from the same founders and are counted. Stops when the new allele first reaches the round's frequency. Diagram: advantage → new allele, chance → new allele (headcount on the box). Top: 40 chromosomes, record | run, carriers on top, minor allele dark | the sweep curve, lost copies in red. Card: diversity along the chromosome in 200 kb windows (record dots, run line); gauges: diversity in the rest of the genome, and the stretch two carriers share (Mb).
- **Go runs three populations**, draws the first; the gauges show three dots and a ring; the average is judged (lesson 7's typical-of-three).
- **Rounds** (advantage, individuals, stop): fast 0.3, 992, 95% · slow 0.02, 992, 95% · mid 0.1, 492, 95% · small 0.05, 105, 95% · **lactase (real)** 0.15, 126, 74%. Opening 0.05, 380. Windows = mean ± 2.2 sd of three-population averages (60 Go's).
- **Lactase record = `data/clean/lct_scan.json`** (`scripts/make_lct_scan.py`, 1000 Genomes, streamed with `fetch_1000g_region.py`): CEU/YRI diversity in 21 windows; 198 CEU haplotypes at 100 markers (YRI MAF ≥ 0.2, one per 40 kb bin = the sim's spacing); background from three distant 500 kb stretches of chr2 (0.67, 0.75, 0.86 → 0.76). Page measures carriers' stretch 1.57 Mb, non-carriers 0.29. The setting that reproduces it (0.15, 126, 74%): rest 0.76, stretch 1.66 Mb.
- **Measured traps:**
  - Crossover 0.0005 per gap: a fast sweep reaches the chromosome's far end (far markers 0.72 of the start where chance alone leaves 0.97); nothing on the chromosome reads chance alone. Hence 0.001 and the unlinked markers.
  - Diversity near the gene (or the dip's half-width) as a reading: run-to-run spread about half its mean. Dropped; stays on the picture.
  - One population per Go: one setting cleared three of five rounds; the small round's windows covered most reachable readings. Three per Go: most a setting clears is two (0.07, 151: small and lactase at 50% each, because they are measured at 95% and 74%).
  - Small at 151 individuals overlapped lactase in both readings; at 105 its rest of the genome (0.41) clears lactase's (0.76).
- **Not built from the plan:** dominance rounds, soft sweeps, drug withdrawn (the dip refilling). Shifting regimes go to C.

- Data card: diversity in windows along a chromosome; and how far two copies of the same allele stay identical (shared stretch).
- Tool: 12 B's one locus (h, s, N, F) on a chromosome of markers; r set as lesson 9 C's crossover marks (log steps: everything happens below 0.01 per gap); 11 A/D's heterozygosity as the readout.
- Two readings: **far from the site** (N: markers lose heterozygosity as 11 D's lines did) and **the dip** (s, h, r). Small N: no dip to see.
- Rounds: fast/slow, dominant/additive/recessive, soft (standing variation), drug withdrawn (the dip refills: measured), drift only (whole chromosome low, no dip).
- Real, health (**in hand, measured below**): **lactase**, 1000 Genomes phase 3, rs4988235 (−13910 T). Europeans' diversity near LCT falls to 0.2-0.45 of West Africans'; far away it is 0.67-0.86 (drift: the out-of-Africa bottleneck). T carriers share ~250 kb; C carriers ~5 kb.
- Real, ecology: peppered moth *cortex* insertion dated to 1819 by its stretch (van't Hof et al. 2016), as a citation panel, or a simulated look-alike.
- Price link (13): for a marker, cov(w, z) comes only through linkage; recombination is its E(wΔz). Hitchhiking = lesson 8's confound.

### C — what travels together (hitchhikers, haplotypes, LD)

- Data card: trajectories of many mutations at once (lockstep cohorts), and haplotypes as painted chromosomes.
- Tool: 12 C's race (several new alleles, coloured) on 11 E's painted chromosomes (segments coloured by founder; JM's 11 E text already says *"The existence and size of these chromosomal chunks is driven by the recombination rate relative to the rate of other forces"*). r from 9 C. "Travels with" arrow on the DAG, display only.
- Rounds: no recombination (bacteria); low; free. A slightly bad neighbour dragged along (16's numbers). Two good mutations on different backgrounds: without recombination one is lost (the suboptimal winner). Drug on, then off.
- Drift: the dragged bad allele fixes more in small N; two-good-mutation interference is a race decided by chance early.
- Real, ecology/evolution: **LTEE** trajectories (in repo, `ltee_allele_freqs.csv`): cohorts rise together, silent ones among them.
- Real, health: **Pf7** (measured): kelch13 Thailand 0/35 (2001) → 86/115 with 12 alleles (2012) → 19/19 with 2 (2017); crt 76T Kenya 32/35 (1995) → 3/62 (2014) after chloroquine stopped (1999).
- Coalescence groundwork: click a position, rows repaint by ancestor at that position; count of ancestors (1 at a hard sweep's site, many far away; several after a soft sweep).

### D — how many alleles stay (frequency dependence, heterozygote advantage, drift)

- Data card: number of alleles a population holds; and the scan again, now with a bump instead of a dip.
- Tool: 12 C's race grown to many alleles, with 12 D's new-allele input and N. Frequency rules: rare-type advantage (the meadow's visitors from 12 A / 13 B learning to avoid the common colour); "a pollen grain cannot fertilise a plant that shares its allele"; overdominance (12 B's h above 1).
- Two readings: alleles held (N vs the rule) and the bump near the site (same display as B, opposite sign).
- Rounds: neutral (drift takes them); fluctuating rain (keeps two only when both homozygotes swing: from A); rare-type advantage; overdominance; malaria removed (HbS falls slowly: the harm is recessive).
- Let it break: 45 alleles in ≤ 1,000 plants is out of reach at sane mutation rates (measured), which is Wright's own 1939 puzzle.
- Real, ecology: ***Oenothera organensis*** ≥ 45 self-incompatibility alleles in ≤ 1,000 plants (Emerson 1938-39; Wright 1939). **Orchid *Dactylorhiza sambucina***, yellow/purple, rare colour reproduces better (Gigord et al. 2001, PNAS, open at PMC33454): array numbers to transcribe, JM checks.
- Real, health: **HbS** (Piel et al. 2010 layer); **HLA** allele counts (IPD-IMGT/HLA, GitHub).

### E — counting what stuck (dN/dS) → mutation and coalescence — DRAFT, 2026-10-01

- JM, 2026-10-01: *"Let's draft up a dN/dS exercise that could, maybe, help bind selective sweeps (above) while prepping students for the mutation/coalesence work to come."*
- Tool: 12 D's curve of new mutations' effects (drag the typical harm, bracket the spread; here on a log axis, so a step is ten times more harmful) + one argument, a bar for the share that help (+0.05 each); 10's 1/2N; B's lost copies; individuals. h held 0.5.
- Engine: one gene = 300 silent + 900 protein-changing sites; each site changes in one copy in 100,000 a generation; 10,000 generations. Every new change runs its own story from one copy (frequency-level binomial, 1 − s/2, 1 − s) until lost or fixed — independent stories, no linkage between them (said so in the code). Go = ten genes, pooled.
- Readings (the plane, like D's): **silent diversity within** (two copies' silent differences per 1,000 sites, sampled every 500 generations from 2,000 on and averaged: CV 3-6%, pins N; 4Nμ printed beside) and **dN/dS** (protein changes that took over per site ÷ silent ones; CV ~10%). Window = a box. Not judged, drawn: the same ratio among changes still varying (pN/pS, the McDonald-Kreitman comparison) as an open diamond.
- Measured on the prototype (node, 10 genes): silent changes per site per generation = 1.0e-5 = μ at every N and selection (**the clock**, printed beside μ); diversity = 4Nμ; dN/dS 0.78 / 0.59 / 0.50 at N 30 / 100 / 300 (typical harm 0.01, spread 0.3) against Kimura 0.75 / 0.61 / 0.49. Help 5% at N 300: dN/dS 1.63, pN/pS 0.42 (sweeps go through fast, rarely caught varying); at N 50: 0.63 (help barely shows in a small population).
- Binds sweeps: top-left draws every change that took over as it spread — silent ones wander for ~4N generations (printed beside 4N: the time back to the copies' common ancestor), helpful ones go up as sweeps in ~100-200. Prep: dS/time = μ ("distance over speed", 202_lec20_02); diversity = 4Nμ (lesson 11 E).
- **As built** (rounds: free part, truth; dN/dS, diversity per 1,000; 40 runs, page engine): fly typical (harm, 0.1 at 248; 0.253 ± 0.021, 9.89 ± 0.39) · people vs chimps (harm, 0.1 at 30; 0.465 ± 0.035, 1.17 ± 0.09) · histone (spread, shape 1 at 248; 0.031 ± 0.006) · flu antibody sites (help, 5% at 248; 1.43 ± 0.08) · TRIM5α (help, 5% at 51; 0.64 ± 0.04, 1.97 ± 0.13). Opening harm 0.01, widest spread, no help, 101. The headcount is free in every round; the curve's other parts held (grey).
- **Measured traps** (node, then the check): opening, right curve at the opening's headcount, right headcount with the curve at the opening, both ends of each free part: all 0; 209 reachable settings x 4 runs, none clears two rounds. People vs chimps' free harm is the same as flies': only the headcount differs, so the student finds that drift alone raised dN/dS.
- Speed: a Go at 248 individuals ~0.45 s (≈10^6 stories); at the 400 maximum ~0.7 s.
- **Check** (`node scripts/check_lesson14_numbers.js E`, 18 bars): clock = μ (1.009e-5 ± 0.012); diversity = 4Nμ (1.40/1.44, 3.93/4.04, 10.01/9.92); 1 in 2N and ~4N generations (981 vs 992); dN/dS vs Kimura's integral within 8% (0.617 vs 0.624; with help 0.999 vs 0.966); help 0 → 5%: dN/dS 0.27 → 1.47, still varying 0.40 → 0.46.
- Open for JM: is the independent-stories engine enough (no hitchhiking inside a gene, so sweeps do not lower diversity here as they did in B)? A one-shot real record (McDonald & Kreitman's Adh table: fixed 7 protein / 17 silent, varying 2 / 42) would make the sweep link a target rather than a picture. Anchors to check: Chimpanzee Sequencing Consortium 2005; Sawyer et al. 2005 (TRIM5α); Bush et al. 1999 (flu HA).

## Links to earlier lessons (the "gold")

- Rain → the gene's fitness is lesson 7's arrow with a gene under it (A); the DAG and its Price bells are 13 C/D.
- Hitchhiking is lesson 8's confound; recombination breaks it as swapping the eggs did (B, C).
- A sweep is F at one spot: 11's heterozygosity read along a chromosome (B).
- Painted chromosomes and "different ancestors at different positions" are 11 E's picture (C).
- dS is the control group: 10's 1/2N against 12 D's "which new mutations stay" (E).

## Measured, 2026-09-30 night (scratchpad prototypes, not the page)

**Lactase, 1000 Genomes phase 3 (GRCh37), fetched by HTTP range request: 6.7 MB for chr2:136.0-137.2 Mb, 31,664 SNPs, no htslib.** Diversity = Σ 2pq per kb:

      window (Mb)   136.0  136.1  136.2  136.3  136.4  136.5  136.6  136.7  136.8  136.9  137.0  137.1
      Utah Eur.      0.18   0.23   0.14   0.10   0.30   0.37   0.29   0.16   0.40   0.49   0.76   0.83
      Yoruba         0.65   0.88   0.64   0.57   0.67   0.90   0.71   0.60   0.67   0.93   1.10   1.42

- Far windows (133.0, 139.5, 120.0 Mb, 500 kb each): Utah Eur./Yoruba 0.75, 0.86, 0.67. Near LCT: 0.18-0.45.
- rs4988235 T (A on the + strand): Utah 0.74, British 0.72, Finnish 0.59, Yoruba 0.00.
- Pairwise shared stretch through the site (mean / median): T-T 250 / 256 kb (Utah), 258 / 244 (British), 259 / 249 (Finnish); C-C 17 / 4, 18 / 6, 25 / 4; Yoruba C-C 9 / 4.
- The dip runs past the 136.0 edge: fetch 134-139 Mb for the page.

**Rain-driven selection vs drift** (real Daphne rain 1973-2012, +1 = a dry year, push × dryness = s for the big-beak homozygote, h 0.5, start 0.5, 39 years):

      N      push   sd of end change   corr(yearly change, dryness) median   runs with corr > 0.3
      50     0      0.283              0.00                                   0.04
      50     0.15   0.280              0.33                                   0.60
      200    0      0.149              -0.01                                  0.04
      200    0.15   0.149              0.60                                   0.99
      1000   0      0.069              -0.01                                  0.03
      1000   0.05   0.068              0.50                                   0.95

- Where it ends cannot tell rain from drift; whether it tracks the rain can, once N ≥ ~200.
- 500-2,000 years of the same rain recycled, N 200, start 0.5. **Whether rain keeps two alleles depends on how the fitnesses swing**:

      fitness scheme                                   push   still mixed at 500 / 2000 years
      drift only                                       0      0.41-0.45 / 0.01
      small homozygote held at 1 (1, 1+hs, 1+s), h .5  0.15   0.35 / 0.00   (big allele lost 0.59 by 500)
                                                       0.3    0.01 / 0.00   (lost 0.99)
      both homozygotes swing (1+s, 1, 1−s)             0.15   0.73 / 0.19
                                                       0.3    1.00 / 0.98   (N 1,000: 1.00 / 1.00)

- Why: the push averages 0 over the record (skew −0.09), but the long-run worth of a genotype is its average log fitness. Held at 1: mean log(1 + s) for the big homozygote is −0.054 at push 0.3, so it loses. Both swinging: the heterozygote is never best in any one year and still beats both homozygotes over the decades (Haldane & Jayakar 1963). A heterozygote advantage that exists only across years: D's question, arriving from A.
- 12's convention (1, 1 − hs, 1 − s, one homozygote at 1) is the first scheme. In 14 A the beak gene's fitness comes out of 7's seeds model, so which scheme the ecology produces is to be measured there, not set.

**Allele counts, self-incompatibility vs neutral** (N plants, 3,000 generations from 40 alleles, mutation to a new allele 4Nμ):

      N      4Nμ 0.1: SI / neutral    4Nμ 1: SI / neutral
      100    9.4 / 1.2                15.4 / 6.5
      500    16.8 / 2.3               26.4 / 8.7
      1000   22.4 / 1.5               36.0 / 6.7

- 7-15× the neutral count; Emerson's 45 not reached at N 1,000 and 4Nμ 1.

**The scan under each regime** (N 500, r 0.0005 per gap, 101 markers, 1,500 generations, 10 runs; heterozygosity / start by distance from the site, gaps 0-2 / 3-7 / 8-15 / 16-30 / 31-50):

      overdominant     0.46  0.29  0.24  0.20  0.21
      rare-type adv.   0.35  0.30  0.19  0.21  0.23
      neutral site     0.14  0.25  0.14  0.19  0.25
      hard sweep s .1  0.02  0.09  0.12  0.14  0.20

- Drug on (s 0.2 for the homozygote) until ~0.88, then off (−0.1), N 1,000: at the peak 0.24 near vs 0.82 far; 105 generations later (allele at 0.09) 0.74 vs 0.80. **A reversed sweep erases its own dip**; only the time series keeps the history.
- Speed: ~2 s a run in plain JS at 1,500 generations, N 500 (40 runs in 72 s). Bit-packed markers (101 in 4 words, crossovers as masks) should be several times faster: not measured. Needed for D's bump; B's sweeps are short.

**dN/dS by population size** (protein-changing s from a gamma, shape 0.2; silent neutral; Kimura fixation, WF check below):

      N               10     30     100    300    1000   3000   10000  100000
      mean s .01     0.87   0.75   0.61   0.49   0.39   0.31   0.25   0.16
      mean s .001    0.98   0.95   0.86   0.74   0.61   0.49   0.39   0.24
      + 1% good .01  0.87   0.76   0.64   0.61   0.77   1.46   4.26   39.9

- WF simulation, 400,000 mutations: N 30 / 100 / 300 = 0.72 / 0.57 / 0.45 against formula 0.75 / 0.61 / 0.49 (diffusion slightly high). Silent fixation 0.0052 at N 100 against 1/2N 0.0050.
- Drift raises dN/dS with the same mutations; a little advantage only shows in large populations.

**Earlier, 2026-09-30 evening (still valid).** Sweep engine, 1,000 diploids, 101 markers, r 0.0005 per gap, hard sweeps conditioned on fixing, 8 each, at 95%:

      sweep                     gens to 95%   run through site   run near vs far   ancestors at site
      s .02  h .5                   718             12.7            10.2 vs 5.3          1
      s .05  h .5                   309             20.8            15.9 vs 4.4          1
      s .1   h .5                   169             26.7            17.9 vs 5.0          1
      s .3   h .5                    70             43.4            21.3 vs 8.9          1
      s .1   h 1 (dominant)         211             25.1            17.5 vs 5.1          1
      s .1   h 0 (recessive)        298             20.4            14.4 vs 5.0          1   (1 in 126 new copies fixes)
      soft, s .1 from 5%            135              7.7             5.4 vs 3.4          7.1
      drift, no s, from 5%         2931             22.1            15.3 vs 11.7         1

- At 400 diploids drift washes out slow sweeps: use 1,000.
- Pf7 (Zenodo `Pf7_samples.txt` + `Pf7_drug_resistance_marker_genotypes.txt`, QC pass, mixed calls out): crt 76T Kenya 1995 32/35, 1998 10/11, 2005 11/26, 2010 25/71, 2014 3/62; Malawi 2011 0/265; Tanzania 2010 22/43, 2014 25/247. kelch13 Thailand 2001 0/35, 2008 35/259 (9 alleles), 2012 86/115 (12), 2013 94/111 (13), 2017 19/19 (2); Cambodia 2007 13/29 (3), 2011 150/297 (7), 2016 162/187 (2), C580Y 161 of 162.
- LTEE metagenomic (PASS; fixed = last three samples ≥ 0.9): normal-rate pops protein-changing 132 : silent 14 fixed, 590 : 109 seen; mutators m2 39:23, m4 447:267, p3 637:317; m1 546:101, p6 1135:173 (mutT spectrum).

## Data

| Source | What | Status |
|---|---|---|
| 1000 Genomes phase 3, chr2 | LCT region, phased | **fetchable now**: `scripts/fetch_1000g_region.py 2 136000000 137200000 out.vcf` (pure-Python tabix over HTTP, tested); clean a derivative to `data/clean/` |
| Grant rain, beak series | Daphne Major | in repo |
| LTEE metagenomic | trajectories, fixed N:S | in repo |
| [Pf7, Zenodo 18711720](https://zenodo.org/records/18711720) | resistance genotypes | downloaded in scratch; clean a derivative |
| Lamichhaney et al. 2016, *Science* 352:470 | HMGA2 genotypes, 2004-05 survivors | transcribe from figure/supplement; JM checks |
| Gigord et al. 2001, PNAS 98:6253 (PMC33454) | orchid arrays, rare-colour advantage | transcribe; JM checks |
| Emerson 1938-39; Wright 1939 | *Oenothera* S-allele count | citation numbers (≥ 45, ≤ 1,000 plants) |
| [Nextstrain H3N2 HA](https://nextstrain.org/seasonal-flu/h3n2/ha/12y) | mutations per branch | direct |
| [IPD-IMGT/HLA](https://github.com/ANHIG/IMGTHLA) | alleles, alignments | direct |
| HbS (Piel et al. 2010) | allele-frequency layer | browser (JM), or citation numbers only |
| REL606 genome | LTEE neutral expectation | direct (NCBI) |
| Ag1000G, HIVDB, Timema (Dryad) | | **dropped** unless JM wants them: each stage has a health and an ecology anchor without them |

## Absorbed / retired

- Lesson 16's linkage plan → B and C (its drag numbers: bad neighbours dragged ~3× less than neutral; all of it below r ≈ 0.01 per gap).
- The 2026-09-25 ruling that dN/dS waits → superseded (E).
- r/K births-deaths page (built A-C) and the FDS-on-births plan → archived at rebuild; frequency dependence lives in D and E.
- From the evening plan, cut: Price-along-the-chromosome plot, ROH strip, the stand-alone "more than one way" stage (its soft sweeps go to B, its Pf7 to C).

## Open for JM

1. **Order and count.** Five stages, short timescale to long, ending at dN/dS → mutation. Alternative: B first (the sweep is the evening takeaway), A second.
2. **Simulated look-alikes.** Where real data are not in hand (fly seasons, moth scan), a simulated "sample" drawn like the real display. Say "simulated" on screen?
3. **Transcriptions** (HMGA2 counts, orchid arrays): Claude transcribes, JM checks against the papers.
4. **r and K** still have no home once the current page is archived (`REVISIONS_PLANNED.md` row 5 names 14 A).

## Items

| # | Stage | What | Status |
|---|-------|------|--------|
| 1 | — | archive the current page (`app/archive/lesson14_2026-09-30.html`, README line); new page from 13's furniture | done |
| 2 | — | chromosome engine, bit-packed (B, C, D share it); painted chromosomes from 11 E | B's engine done; ancestry paint for C todo |
| 3 | A | 12 B's locus with s set by the real rain; diagram; record-vs-run card; checks | done (voice is a placeholder: 202_lec10_01) |
| 4 | B | chromosome engine (bit-packed); scan + shared stretch; LCT derivative `data/clean/lct_scan.json`; SOURCES row | done (voice placeholder: 202_lec19_04, banner 19_04 + 19_05) |
| 5 | C | what slows a sweep (JM 2026-10-01 brief): B's engine + trait; one slower per round; anchors | done |
| 6 | D | rare-allele advantage on an MHC-like gene + a neutral gene; HLA, foxes, cheetahs, sticklebacks, Soay | done |
| 7 | E | dN/dS draft (JM 2026-10-01, later): 12 D's curve + help bar; diversity vs dN/dS plane; history of what took over | done (draft): 18 bars |
| 8 | — | `check_lesson14_numbers.js` rewritten for A-D (stage filter by letter) | done: 65 bars, all pass (2026-10-01, full run ~15 min; C and D re-run after the last edits) |
| 9 | — | voice from JM (A-D all placeholders; C: 202_lec17_01 + 19_03, banner 19_01; D: 231_lec33a_01 + 202_lec16_05, banner 461_lec28_01) | todo |
| 10 | A | 2026-10-01 review: no record in rounds; labels; allele names; births/deaths diagram; one-shot record; genome mock-up | done |
| 11 | B | 2026-10-01 review: axis label; lactase one shot, named after; fifth round | done |

## Do not

- Print a dN/dS from the LTEE counts against a guessed 3 : 1; derive the expectation first.
- Run the sweep engine below ~1,000 diploids for slow sweeps.
- Treat a long homozygous stretch as proof of selection: drift makes one too, genome-wide.
- Set a window on a real record's exact value: the record is one realisation (stochastic-bar rule 2); size windows off runs at a setting that reproduces it.
- State that fluctuating selection keeps (or loses) two alleles without saying which homozygote swings: measured both ways on the same rain.
- Add a widget family the earlier lessons do not have.
