# Declutter sweep — every released lesson (REVISIONS_PLANNED rows 16 and 17)

**Files** · `app/lessons/lesson1.html` … `lesson16.html`, `lesson6b.html`, `lesson18.html`; shared `app/assets/hover.css`, `hover.js`
**Checks** · `node scripts/check_layout.js` (all pages) · `python3 scripts/check_lessons.py` · each `check_lessonNN_numbers.js` (10-18)
**Status** · done (all 20 pages pass `check_layout.js`); JM to look
**Last touched** · 2026-10-17

## What it is

- The layout of 17 and 19 (2026-10-17) taken back through every released lesson, on JM's word. Nothing about what a lesson teaches, scores or simulates changes: no slot, version or bar moves.
- Worth protecting: the voice blocks (JM: "The voice text is fine"), every control, plot, target card and question; feedback a task or question reads.

## JM, 2026-10-17 (verbatim)

> For lesson 17, the screen is cluttered. This is a pervasive issue. I've included some images of unnecessary captions, and plots that should be moved away. Also the R code panels should always be last & default to be collapsed please

> We should more liberally use hover text and optional boxes in general. The bullet points could really be turned into hover text over the intro. I don't want to overwhelm students with reading, basically. I want attention drawn and fixed to controls, output, and predictions

> The voice text is fine, but yes, please go ahead and do a declutter sweep for past lessons. Students missing definitions if they don't hover is also fine--these interactives are built to reinforce concepts defined & learned in lecture and build intuition, not assess mastery **or** provide definitions

## What each lesson gets

1. **R code**: the R panel last in each stage, a closed `<details class="panel rcode">` in a `.tail` under the grid; any Download .R button moved inside it.
2. **Bullets**: `ul.setup` gone; each bullet's words a tip on the box or control it describes (`.info` + `.tip`, `data-tip` for a shared one). Model rules and what a run plays: the target/predict/controls heading. A bullet that repeats a label: dropped. The intro keeps the voice alone, one column.
3. **Summary lines** (`.readout`, `.fit-stats`, `.status-line`, `.step-note`): cut where they restate a board, plot, table or card; kept where a task or question reads them (each kept one named in `check_layout.js` with why). A cut line's writer goes with it.
4. **Observed data** read after the work: a closed `details.opt` under the stage. Observed data that is the target stays where it is.
5. Bar checks that read a cut line read the canvas or the run instead.

## Baseline (check_layout.js, 2026-10-17, before)

| Page | Bullet lists | R not last/closed | Summary lines |
|------|-------------|-------------------|---------------|
| 1 | 3 | A B C | 5 |
| 2 | 5 | A-E | 8 |
| 3 | 5 | A-E | 8 |
| 4 | 3 | A-C | 4 |
| 5 | 4 | A-D | 8 |
| 6 | 5 | A-E | 5 |
| 6b | 4 | A-D | 4 |
| 7 | 4 | B-D | 8 |
| 8 | 4 | A-D | 5 |
| 9 | 5 | A-E | 26 |
| 10 | 4 | A-D | 9 (+6 ids missing at load: A_rend … A_rnext) |
| 11 | 5 | A B D | 14 |
| 12 | 5 | A-E | 13 |
| 13 | 4 | A-D | 14 |
| 14 | 4 | A-D | 12 |
| 15 | 4 | (no pre.code) | 6 |
| 16 | 4 | A-D | 11 |
| 18 | 0 | (none) | 8 |

## Items

| # | Page | What | Status |
|---|------|------|--------|
| 1 | — | `app/assets/hover.css` + `hover.js` (from 17/19's inline copies); every page loads them | done |
| 2 | — | `scripts/check_layout.js`: errors, literal ids, bullets, tips, R code, lines, every page | done |
| 3 | 16 | 18 marks; 9 lines cut, A's dN/dS and B's pick kept; R last + closed | done |
| 4 | 15 | 10 marks (A/B's built in script); B's s/h summary and D's two cell lines cut; the over-time line keeps only a picked allele; C's race line kept; no R panel | done |
| 5 | 14 | 14 marks; card lines (never written) gone; A's bars cut to selection vs chance; B/C/D's first lines kept for "running..." only; A's intro keeps its two columns (the genome) | done |
| 6 | 13 | 11 marks; A's and B's card lines kept (JM 09-30), D's field line cut to the traits' correlation, B's "w ..." sentence to hover; six always-empty lines gone | done |
| 7 | 12 | 18 marks; A's card and map lines kept, B's bars line without the sliders' echo; ten cut | done |
| 8 | 11 | 16 marks; B's gap, C's tree F, the founder panel, D's Ne and judged line, E's status kept; A's three, B's census, C's bottom row, E's tracker cut; C's Download .R in a closed R box (no code panel) | done |
| 9 | 10 | 11 marks; pond line and C's extinctions cut; B's rule words and colour key to hover; five kept (concept numbers, round measures) | done |
| 10 | 18 | no bullets, no R; the eight key-arithmetic lines each in a closed "The numbers" box under their plot | done |
| 11 | 1-9, 6b | bullets to marks (6-15 a page; 9's on its step headings, built in script; 4's live R² bound inside its tip); R last + closed, Download .R inside; every line kept (they are the measurements the tasks read: misses, counts, the bench's next step) | done |
| 12 | — | REVISIONS rows 16, 17 marked done; LESSON_STYLE.md §2-4, §10; README; CLAUDE.md (local) | done |

## Lines JM asked for at the time, now cut or moved (say if any should come back)

- 16 A, under the runs: *"In 1,000 populations where this mutation arose, it went extinct in N after g generations"* (JM 10-09: "this one sentence and nothing else under the graph"). The table of eight carries the counts for each change.
- 16 A, under the sequence: the protein's length (JM 10-09: short). The effect line under the target says what the change did.
- 15 D, under the cells: *"The jumping gene jumps at random, but where it ends up in the cells that survive is not random."* The canvas shows jumps above the line and surviving copies below.
- 13 B: *"w: a flower's offspring ÷ the meadow's average, every generation. Full stop."* (JM 09-30), now the hover text on that plot.

## Checks after the sweep

- `check_layout.js`: 20 of 20 pages pass.
- Bar checks, all passing: 10 (59), 11 (56), 12 (48), 13 (65), 14 (67), 15 (73), 16 (45), 17 (44 + R), 18 (22), 19 (35 + R). 12, 13 and 18 each failed one stochastic bar on a first run (12 A "the opening setting is not an answer", 13 B "no one setting clears three rounds", 18 E target 2's near miss) and passed on the rerun; the untouched HEAD of 12 passed the same run, and its A layout is drawn fresh each load (PAGE_SEED_BASE), so the bar moves with the load, not the sweep. `check_lessons.py` 20 pages clean; `test_codec.py` agrees.

## Rulings

- JM, 2026-10-17: definitions may live only in hover text; a student who never hovers is fine.
- The voice stays as written.

## Do not

- Change a scaffold count, version, bar or what a run does.
- Cut a line a task's hint, a question or a check of a printed number depends on without moving what it carried.
