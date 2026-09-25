# Revisions planned — released lessons

A running list, for one pass over the released lessons at the end. JM,
2026-09-24: *"saving revisions to the released lessons until the end, so we
can make a suite of changes all at once."*

- One row per feature that became a default after lessons shipped, and the released lessons that lack it.
- **Measured, not assumed:** each row says how "lacks it" was found. Re-measure before the pass; lessons move.
- Released = 1–10. Add 11 when JM signs it off. 12+ are drafts: not listed, they get the feature when built.
- Not a design reference. The rules live in `structurephilosophy.md` and `docs/LESSON_STYLE.md`; this only tracks where they are not yet true.
- When the pass starts, each lesson gets `docs/overhauls/lessonNN_overhaul.md` first (CLAUDE.md §3), seeded from its column here.

## Adding a row

- Feature, where it is defined, JM's words and date.
- Which released lessons lack it, and the command or check that says so.
- Anything that has to come first (a row it depends on).

## The list

| # | Feature | Defined in | Lacking | How measured | Depends on |
|---|---------|-----------|---------|--------------|------------|
| 1 | **Bowling games** (the roll: set, play, controls lock, hit or miss) | `LESSON_STYLE.md` §7 "The roll"; lesson 10 `wireBowling`, lesson 11 `mountRounds` picture mode | **1–8** (JM). 9 has none either by the same measure — JM's range stops at 8; confirm whether 9's lock-in-and-resample question games count | 2026-09-24: `wireBowling` / `mountRounds` / roll `lockStage` found only in 10 and 11 | each new roll needs a bar check (`check_lessonNN_numbers.js`); only 10 and 11 have one |
| 2 | **Practice switch on every roll** | `LESSON_STYLE.md` §7 "The roll"; lesson 11, all five stages | **1–10**. 10 has one on C only | 2026-09-24: `class="practice-row"` only in lesson 10 (C) | row 1 for 1–8: no roll there yet to put it on |
| 3 | **Interactives beyond sliders** | `LESSON_STYLE.md` §7 "The direct manipulation", "The model diagram" | **1–6** (JM) | 2026-09-24, controls per lesson: 1, 2 number boxes only; 3–5 sliders + number boxes; 6 sliders + a model diagram (`buildArrows`). For reference: 7, 8 add a click on a plot; 9 drags on a plot; 10's drag was on Stage E's scatter, cut 2026-09-18 (`f5520a0`), CSS rule left behind | — |
| 4 | **Plots stay inside their panels** (JM on 10 and 11: *"graphs extend beyond the limits of their boxes"*) | lesson 10/11 local `setupCanvas` override; sim.js's pins the declared width | **1, 8, 9** | 2026-09-24, canvas right edge past the panel's content edge, 1440 / 1100 window: 1 `plotP2` +17 / +17; 8 `A-C_gstrip` +17 / +17, `plotA-D` +2 / 0; 9 none / `A-C_run`, `A-C_bars` +16, `E_driftC`, `E_selC` +76. 2-7, 10 none at either (6 measured at 1100 only) | — |
| 5 | **The birth–death thread builds to r and K**: scalar rates don't work → rates that are functions → parameterize by r and K, which can also be functions. Expand and define r (births − deaths when uncrowded) and K (where births meet deaths) along the way, so lesson 14's r and K arrive already built | lesson 14 A (r and K named once built: r = b0 − d0, K where the lines cross) and B (the trait's arrows to r and K); JM, 2026-09-24: *"make a note to update the birth-death models in the earlier lessons to expand & define r/k—it's an obvious buildup from the 'scalar rates don't work' to 'use rates that are functions' to 'parameterize by r/K which can also be functions'"* | **6, 6b, 7, 9** (the lessons with birth–death models); where each sits: scalar rates in 6 (one birth and one death rate for the moose record), 6b (the finches' per-year rates) and 7 ("two constant rates cannot do it"); rates as functions in 6 (wolves → moose death rate), 7 (rain / seed on the rates) and 9 E (protein % → birth and death rates). r and K named in none | 2026-09-24: phrases *birth rate / death rate / births per / deaths per / per capita / carrying* by lesson: 6: 26, 6b: 14, 7: 12, 9: 24; 8, 10, 11 only in passing (plot labels, "carrying one of each allele"); 1–5: none. `r`/`K` as named quantities: only lesson 14 | which lesson gets which step is JM's call at the pass; 14 A is the working model of the last step |

JM's words, 2026-09-24: *"lessons 1-8 could use bowling style games added,
lessons 1-10 could use practice toggles, lessons 1-6 need new interactives
beyond just sliders."*
