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
| 4 | **Plots stay inside their panels** | lesson 10/11 local `setupCanvas` override (sim.js pins the declared width) | pending measurement | — | — |

JM's words, 2026-09-24: *"lessons 1-8 could use bowling style games added,
lessons 1-10 could use practice toggles, lessons 1-6 need new interactives
beyond just sliders."*
