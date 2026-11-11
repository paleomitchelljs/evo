# Proposed fixes

Bugs and stale facts found while working, each with a proposed fix. Nothing here is done until JM says so.
Features the released lessons lack stay in `docs/REVISIONS_PLANNED.md` (summarised at the end, not copied).

**Started** · 2026-11-11, after lessons 24/25 draft 3 (`ef5401b`)
**Last touched** · 2026-11-11

## Suggested order

| # | What | Size | Status |
|---|------|------|--------|
| 1 | `pageSeed` is random across reloads; CLAUDE.md says stable | decision, then ~10 lines in sim.js | JM to rule |
| 2 | Number checks that paste seed-dependent numbers | ~50 min of check runs, then per-check edits | todo |
| 3 | sim.js `setupCanvas` pins the declared width | ~15 lines in sim.js | todo |
| 4 | CLAUDE.md: gitignored, and wrong or stale in four places | JM's file | JM to rule |
| 5 | REVISIONS_PLANNED row for draft 3 | one row | waits on JM's ruling on 24/25 draft 3 |
| 6 | Lessons 24 and 25: not yet seen; references from memory | a browser session; a source check | todo |
| 7 | 12 A: the h/s text over the Predict plot (F1) | one function | open since 2026-10-01 |

## 1. `pageSeed` is random across reloads

Found 2026-11-11:

- pageSeed isn't stable across reloads. CLAUDE.md §5 says "a student's page is stable across reloads". sim.js draws a
  fresh base on every load, and its own comment says "random across loads, fixed within one".
- That's why the check failed for me. 25's map hangs on the limb seed, so lesson 25's number check passed for the agent
  and failed on my re-run. On 7 of 24 limb seeds, Shh ×0.7 lays four digits instead of five, so the check's hard-coded
  ×0.9 founder sat next to the edge of the five-digit region. From there, 3 clades in 20 changed digits. From ×1, it was
  0 in 20 on all 24 seeds. The check now picks the founder itself and passes on fresh seeds.
- I didn't touch sim.js. It affects every lesson, so it's your call. Fixing it means making pageSeed repeatable across
  reloads, which matters if you want to reproduce a student's page as an instructor.

Where the code assumes one or the other:

- `app/assets/sim.js:149-158`: `PAGE_SEED_BASE` from `crypto.getRandomValues`, once per load.
- `app/lessons/lesson10.html:2804`: "The record: one per student per (loci, alleles), stable across reloads." It is
  drawn off `pageSeed("l10Drec")`, so it is not.
- `app/lessons/lesson15.html:1869`: "a later game (Play again) or a reload deals new targets": 15 relies on a reload
  re-dealing, and its bits record the first answer ever.
- `app/lessons/lesson9.html:949`: a reload as the student's way out of a stuck state (fixed 2026-09-17).
- `score.js` persists answers and notes across a reload, so a reload today keeps the code and redraws the page.

Options:

- **a. Keep random per load.** Correct CLAUDE.md §5 and the lesson 10 comment; do item 2. No lesson changes.
- **b. Stable per browser.** Keep `PAGE_SEED_BASE` in `localStorage` per page (try/catch; fresh draw if storage fails).
  A reload keeps the page; another browser or a private window gets a new one. Lesson 15's reload would stop
  re-dealing (Play again still would). The instructor still cannot see a student's page.
- **c. Reproducible.** b, plus `?seed=N` in sim.js to force the base, plus the base carried in the code as a note
  (`Score.setNote`, which already prints in the decoders' notes column). The instructor opens `lessonNN.html?seed=N`
  and sees that student's page. Check before building: whether a new note changes the code format enough to need a
  `version` bump on every page.
- Recommend: **c** if reproducing a student's page is wanted, **a** if not. `?seed=N` is worth having either way:
  it lets a check replay a failure.
- Cost of b/c: sim.js only; then `check_layout.js` and every number check rerun; lesson 15's reload note rewritten.

## 2. Number checks that paste seed-dependent numbers

- 25's D check failed on a fresh page seed (item 1). Fixed 2026-11-11: the founder is re-derived.
- Checks that say they account for the page seed: 10 (`check_lesson10_numbers.js:497`), 13 (`:303`). The rest (11, 12,
  14-26) not audited.
- Proposed: run each number check three times (each run is a fresh seed). Any check that fails on one run: re-derive
  the number inside the check (CLAUDE.md §5: "Re-derive numbers inside the check rather than pasting them").
- Cost: about a minute per Chrome launch when the machine is quiet: 17 checks x 3 = about 50 minutes, run in the
  background.
- With item 1's `?seed=N`: each check prints the page's base on a failure, so the failure can be replayed.

## 3. sim.js `setupCanvas` pins the declared width

- `app/assets/sim.js:53-67` sizes a canvas to its declared `width`/`height`, never to its panel. CLAUDE.md §5 says it
  "sizes a canvas to the room it has".
- 25 of 27 pages carry their own measuring override (lesson 10/11's `fitWidth`); 8 and 9 do not. REVISIONS_PLANNED row
  4 lists 1, 8, 9 as lacking it; 1 has one now (re-measure).
- Proposed: put the measuring version in sim.js. A page's own `function setupCanvas` is declared after sim.js loads and
  replaces it, so the 25 pages draw exactly as now; 8 and 9 get the fix; CLAUDE.md's line becomes true. The per-page
  copies come out in the end pass, not now.
- Check: `node scripts/check_layout.js`; 8 and 9 looked at 1000 and 1400 wide, before and after.

## 4. CLAUDE.md is gitignored, and wrong or stale in four places

- The ?still=1 note isn't in the commit. I added it to CLAUDE.md, which is gitignored, so it's on disk only.
  (`.gitignore` line 2.)
- §5 "Conventions": "a student's page is stable across reloads and an instructor can reproduce it". False today
  (item 1).
- §5 "The shared library": `setupCanvas` "sizes a canvas to the room it has". False today (item 3).
- §5 "Checks": lists the number checks for 10, 11 and 12. Scripts exist for 10-26.
- Proposed: JM edits these, or says to. If the ignore rule is not deliberate, un-ignoring it puts the technical facts
  under version control; README.md is the committed alternative for them.

## 5. REVISIONS_PLANNED row for draft 3

- No new row in REVISIONS_PLANNED.md yet. I'll add one once you've ruled on draft 3.
- The candidate default: models that run as they are watched, parts added one at a time, a card per named gene, a
  short list of things to find that latch (nothing reports a miss) in place of target windows. If ruled in, the row
  measures which lessons lack it.

## 6. Lessons 24 and 25: not yet seen, and references from memory

Not yet seen by anyone:

- 24: hover tips and R panels opened; the done banner.
- 24 and 25: the models moving in a real browser (every look so far was headless).
- 25: at 1000 px wide; in study mode; the locked view; D's "split more often" menu set to anything but "none".

References used in the designs and checked only from memory (24's Items row 3, "sources for the gaps checked", is
still todo):

- Burke 1995; Cohn & Tickle 1999; Wellik & Capecchi 2003; Sears 2006; Richardson & Oelschläger 2002; Merino 1999;
  Raspopovic 2014; Cooke & Zeeman 1976; Dubrulle & Pourquié 2004.

Stale rows: `lesson24_overhaul.md` Items 2 and 9 and `lesson25_overhaul.md` Items 2 and 8 refer to draft 2's Open
lists and "JM plays draft 2". Mark them superseded by draft 3.

## 7. 12 A: the h/s text over the Predict plot (F1)

- `docs/REVISIONS_PLANNED.md` F1, JM 2026-10-01, noticed in student use. Still open: `app/lessons/lesson12.html:1355`
  still draws `"s at least " + f2(A_SMIN) ...`; the y-axis top is still set from the run's own bars.
- F1 says "fix in the end pass unless JM says sooner". Students are in 12 now; sooner is a one-function change plus
  `node scripts/check_lesson12_numbers.js`.

## Already tracked in REVISIONS_PLANNED.md (features the released lessons lack)

For the end pass; detail and the measurements are there. Rows 16 and 17 are done.

- 1 bowling games (1-8) · 2 practice switch on every roll (1-10) · 3 interactives beyond sliders (1-6)
- 4 plots inside their panels (1, 8, 9; see item 3) · 5 the birth-death thread to r and K (6, 6b, 7, 9)
- 6 one picture per roll (10) · 7 targets are outcomes (not measured) · 8 one bit per scored attempt (10, 11)
- 9 wording: "change the frequency of", "relative to" (1-13) · 10 one causal-diagram language across the course
- 11 targets teach, not assess (not measured) · 12 "Next target" beside Go, "Download .R" as the R title (10, 11)
- 13 study mode leaves targets to be done (none of 1-10) · 14 mechanical setup bullets (not sorted)
- 15 draw what you expect (1-10) · 18 wordless target cards · 19 the practice box reads "practice"
- 20 over-time plot labels · 21 a plot is blank before Go · 22 one sentence for an uncued drag
- 23 a target box for uncertainty around a line · 24 targets in any order within a part
