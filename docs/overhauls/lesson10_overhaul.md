# Lesson 10 — overhaul

**File** · `app/lessons/lesson10.html` (`version: 4`, `scaffold: 12`)
**Checks** · `node scripts/check_lesson10_numbers.js` · `python3 scripts/check_lessons.py`
**Status** · done — 2026-09-21. Both checks green; stage A, D and E driven in headless Chrome.
**Last touched** · 2026-09-21

## What the lesson is

Drift, whole: random differential reproduction with nothing attached, the fact
that the error compounds because it is inherited, the two absorbing walls, and
four ways to shrink a population without taking a body off the island.

The thing to protect is **Stage B**: one switch decides whether the next
generation's parents come from the generation before it or from the pond the run
started with, with the per-generation randomness identical either way. That
contrast is the whole of "the error itself is inherited" and it costs one
argument in `breed()`.

## Stages as they stand

    A  one pond, shares handed out unevenly, nothing looking at colour
    B  the switch: inherited pool vs. fresh pool
    C  107 ponds and the two walls           + real data: Buri 1956
    D  the Lesson 6 moose model, with a gene walking its line   + real data: Isle Royale wolves
    E  four arrows into one junction: bodies, crash, sex ratio, brood spread  + real data: LTEE

D and E were rebuilt 2026-09-18 to JM's brief and were structurally what he
asked for, but the session ran out before the bar checks came with them: the
check script still tested the *retired* D/E and threw `D_formula is not
defined`, so nothing in either stage had ever been verified. Writing the
checks found four real defects, listed below.

## Items

| # | Stage | What | Status |
|---|-------|------|--------|
| 1 | A | Predict card → ten dealt rounds. Flat table: dealt parameters as read-only rows, then two sliders — **ending frequency** and **how far off you expect to be**. Both draw on the trajectory plot (a line and a band around it). Hit Go, the run animates, verdict. | done |
| 2 | A | Rounds are **not graded**. Ten of them. The one recorded bit is silent: did the last five land more often than the first five. | done |
| 3 | A | Keep the free controls and the extinction roll (drive an allele out inside 30 generations, five times) as an ungraded gate ahead of the rounds. | done |
| 4 | A | Drop the two-number opener (average brood / how many leave none) and the three-round "how far does it move" game. | done |
| 5 | — | Answer boxes say **correct / incorrect** and nothing else. The evidence is the plot, not a sentence. Applies to every `mountLock` and `wireGame` verdict on the page. | done |
| 6 | A | `done:` line "You were never asked which way it would go" was **strictly wrong** — the per-roll call asks exactly that. Gone with the rebuilt card. | done |
| 7 | — | `BIT` 13 → 12 slots, `scaffold: 12`, `version: 4`. Decoder is generic; no per-lesson table to update. | done |
| 8 | D/E | Rewrite the stale halves of `check_lesson10_numbers.js` against the shipped D (moose record) and E (four arrows). Add checks for A's ten rounds. | done |
| 9 | — | Run both check scripts; smoke-test the page in a browser. | done |

## What the checks found once they ran (2026-09-21)

Four defects, all fixed, all of which come back if the simulators are edited
carelessly. This is what "the checks were never brought with the rebuild"
turned out to cost.

1. **D and E dealt a round and ran it in the same breath**, so the answer was
   on the plot and in the readout before the student was asked for it. D's
   readout printed *what the record is worth to a gene* — which is the
   question — and E's printed *lost an allele: k of 40*. `wireGame` now always
   draws the strip and calls `cfg.reveal` **after** the lock; D and E run
   their herds there, and both readouts say "lock in your estimate to run the
   forty herds" until then.
2. **E's ladder was clearable without the arrows it hands over.** A crash
   alone reaches 35 of the forty, so rungs 3 (asked 22) and 4 (asked 32) were
   both walkable with rung 2's arrow. Each rung now carries `floors`, applied
   to the slider's own `min`: from rung 3 the crash stops at 40, from rung 4
   at least 25 breed as males. Measured: crash alone at depth 40 reaches 4 of
   40; crash + sex reaches 40; crash + sex + broods reaches 35 where crash +
   sex alone reaches 7. Rung 1 is a **window** (14–20), so bottoming the
   headcount overshoots exactly as badly as leaving it alone.
3. **E's closing rounds had two of three classes answering near zero**, and
   "all forty" cleared one of them. Classes are now 50–70 bodies (≈11 of 40),
   a crash to 10–12 (≈16), and a lek plus uneven broods (≈28); tolerance
   tightened from 0.25 to 0.18 of the truth. Neither 0 nor 40 clears any round.
4. **`C1 half-life is 1.4 × the headcount` failed about one run in twenty**,
   and had done since before this pass. `C_halfLife` reads the crossing off
   400 replicates; over 24 seeds it is unbiased but its spread is 5–6% of the
   answer, so a single draw sat outside a 15% window regularly. The bar is now
   20% per headcount **and** 8% on the average of the four, which is the sharp
   half. Nothing on the page changed.

## Measured numbers this pass pinned

- Stage A's ten rounds: a pond of 14 is typically off by **0.367** after 30
  generations, one of 60 by **0.200**, one of 320 by **0.088** — a factor of
  4.2, which is the whole reason the second slider is the stage. The widest
  band lands 100% of the time in every class and the narrowest lands 3–8%, so
  the silent last-five-vs-first-five bit cannot be gamed from either end.
- `A_typical` (which draws the green band) agrees with Stage A's own
  `makePool`+`breed` operator to within 6% at every class.
- Stage D's window (12–24 of 40 outside 0.35–0.65) corresponds to a record
  worth **50 to 240 moose**, and is landable by two routes: deaths at
  0.260–0.285 on the Lesson 6 winters, or 4–6 deep winters with the rates left
  alone. Doing nothing gives 0–1 of 40; flattening the herd gives 40 of 40.
- Stage E's four causes against the simulator: 24 bodies → herds measure 25.8;
  a crash to 10 → says 27.0, measures 26.3; 6 of 100 breeding as males → says
  22.6, measures 22.9; broods spread 1.8 → says 23.6, measures 24.7.

## Rulings

- **JM, 2026-09-21, on Stage A's card**: *"There is WAY too much text in the
  prediction box. It should be a short, flat table."* Two calls: the expected
  final frequency, and how far off they expect to be. Each is a slider that
  moves something on the graph.
- **JM, 2026-09-21, on the second call**: *"Have the students predict it in the
  form of their expected error (eg how wrong they expect to be on average) as
  this builds on earlier lessons (4-6)."* So it is a **typical miss**, Lesson
  6's words, not a confidence percentage.
- **JM, 2026-09-21, on scoring**: *"These predictions are not scored … what we
  score is a silent record of whether the last 5 predictions were more correct
  than their first five."*
- **JM, 2026-09-18, on D**: *"the moose data from an earlier lesson (6?)
  already have them label 'two bad years' and have static birth/death rate
  models. We should use that as part D."* Built.
- **JM, 2026-09-18, on E**: *"manipulate all four triggers … via a DAG-like
  framework — ideally one built so that later on we can implement selection."*
  Built; the selection arrow is declared hidden and `herdStep` already takes `s`.
- **JM, 2026-09-18, on every game**: *"trying to get allele frequencies to end
  at particular targets some fraction of the time … while giving them more and
  more factors to manipulate to do so."* That is E's four-rung ladder and D's
  two-sided window.

## Do not

- Do not re-fuse `cov` and `within` in `priceTerms`. PROJECT_NOTES §1.
- Do not extract the core operator to `pop.js` yet — third caller, not second.
- Do not retry the FSJ deposit for 10E. Its year-to-year variance is *below*
  binomial, because the cohorts overlap. WORK_ORDER says why.
- Do not add F_ST, migration, or a second population. One pool per parent slot
  is the whole API this lesson commits to.
- Do not take Lessons 12+ as precedent for anything here.
