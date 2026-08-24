# BIO 202 — Evolution simulations

Interactive homework for a conceptual evolution course (Coe College). Each lesson
is a self-contained HTML page: progressive locked stages, a prediction gate before
any control unlocks, canvas simulations, a live R code panel, and a submission code
the student pastes back for the instructor to decode.

The course is **one fixed sequence taken in order**. Each unit drills a single
reasoning move until it is the student's own; the biology is the delivery vehicle.
The design commitments — intuition before vocabulary, read-then-predict-then-touch,
derive-don't-hand-over, one move across many datasets — are spelled out in
[`structurephilosophy.md`](structurephilosophy.md). Course content is grounded in
[`docs/2026_lecture_detail.tex`](docs/2026_lecture_detail.tex).

## Layout

```
index.html                    landing page (lessons + scaffolds + explorer)
app/lessons/lessonN.html      34 lessons, in sequence
app/scaffolds/sNN_*.html      24 guess-and-check drills
app/interactives/descent.html pedigree explorer (unscored)
app/assets/score.js           the submission-code library (name -> opaque passcode)
instructor/                   verify_code.html + aggregate.html (decode student codes)
data/clean/*.csv              real datasets used in the "real data" stages
```

## Start here

- [`docs/PROJECT_NOTES.md`](docs/PROJECT_NOTES.md) — **the single notes-and-memory file.** Current state, the three recurring threads the lessons exist to build, the live rules, the old→new unit map, and the directives that are void.
- [`docs/WORK_ORDER.md`](docs/WORK_ORDER.md) — the prioritized next round of edits.
- [`docs/LESSON_ATLAS.md`](docs/LESSON_ATLAS.md) — stage-by-stage description of the shipped lessons.

## The design/validation framework

The philosophy is not self-enforcing, so it is backed by machine checks:

- [`structurephilosophy.md`](structurephilosophy.md) — the 47-unit sequence and why the shape is the shape.
- [`ledger.json`](ledger.json) — the vocabulary ratchet: each term is banned until the unit that unlocks it (or forever). A 20-name budget across the course.
- [`scripts/check_lessons.py`](scripts/check_lessons.py) — **the gate.** Applies the vocabulary ratchet at each lesson's true sequence position, plus the giveaway-phrase ban, title-names-no-term, front/back-matter and submission wiring, to the shipped lesson HTML.

The judgment-level checks that a machine cannot run — the four adversarial passes —
are in [`docs/PROJECT_NOTES.md`](docs/PROJECT_NOTES.md) §4.

> The former `BUILD_CONTRACT.md` and `validate.py` governed a `units/*.json` spec
> layer that was never built. Both are retired to `_reference/retired/`; their live
> rules moved into `docs/PROJECT_NOTES.md`.

Check every lesson:

```
python3 scripts/check_lessons.py          # all 34; exits 0 when clean
python3 scripts/check_lessons.py app/lessons/lesson7.html   # one lesson
```

## Running

Any static server works (the "real data" stages fetch `data/clean/*.csv`):

```
python3 -m http.server 8000
# then open http://localhost:8000/
```

## Submission codes

`app/assets/score.js` turns a student's name into a stable passcode and packs their
per-question bits, elapsed time, and per-stage engagement counts into one opaque,
tamper-evident code (`lessonNvVER.base64url(cipher).mac6`). The instructor decodes
it with `instructor/verify_code.html`. To invalidate a class's codes, rotate
`Score.DEFAULT_SALT` and bump each module's `version`.
