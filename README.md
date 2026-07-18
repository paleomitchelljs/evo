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
[`notes/references/2026_lecture_outline.tex`](notes/references/2026_lecture_outline.tex).

## Layout

```
index.html               landing page (lessons + scaffolds)
app/lessons/lessonN.html 34 lessons, in sequence
app/scaffolds/sNN_*.html 24 guess-and-check drills
app/assets/score.js      the submission-code library (name -> opaque passcode)
instructor/              verify_code.html + aggregate.html (decode student codes)
data/clean/*.csv         real datasets used in the "real data" stages
```

## The design/validation framework

The philosophy is not self-enforcing, so it is backed by machine checks:

- [`structurephilosophy.md`](structurephilosophy.md) — the 47-unit sequence and why the shape is the shape.
- [`BUILD_CONTRACT.md`](BUILD_CONTRACT.md) — the binding per-unit contract, the four adversarial passes, the gates.
- [`ledger.json`](ledger.json) — the vocabulary ratchet: each term is banned until the unit that unlocks it (or forever). A 20-name budget across the course.
- [`validate.py`](validate.py) — the gate for JSON unit specs (`python3 validate.py ledger.json units/*.json`).
- [`scripts/check_lessons.py`](scripts/check_lessons.py) — ports the HTML-applicable gates (vocabulary ratchet at each lesson's true sequence position, giveaway-phrase ban, title-names-no-term, front/back-matter, submission wiring) to the shipped lesson HTML.

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
