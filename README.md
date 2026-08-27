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
LOCKS.txt                     the release gate: one row per page, x = locked
app/lessons/lessonN.html      29 lessons, in sequence
app/scaffolds/sNN_*.html      27 guess-and-check drills
app/interactives/descent.html pedigree explorer (unscored)
app/assets/score.js           the submission-code library (name -> opaque passcode)
app/assets/lock.js            reads LOCKS.txt; hides a page that is not open yet
instructor/                   verify_code.html + aggregate.html (decode student codes)
scripts/decode_codes.py       the same decoding at the command line, in batch
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
- [`scripts/check_lessons.py`](scripts/check_lessons.py) — **the gate.** Applies the vocabulary ratchet at each lesson's true sequence position, plus the giveaway-phrase ban, title-names-no-term, front/back-matter and submission wiring, to the shipped lesson HTML. It also checks the release gate: every page has a `LOCKS.txt` row and loads `lock.js`.
- [`scripts/test_codec.py`](scripts/test_codec.py) — pins the Python decoder to the JavaScript one that mints the codes.

The judgment-level checks that a machine cannot run — the four adversarial passes —
are in [`docs/PROJECT_NOTES.md`](docs/PROJECT_NOTES.md) §4.

> The former `BUILD_CONTRACT.md` and `validate.py` governed a `units/*.json` spec
> layer that was never built. Both are retired to `_reference/retired/`; their live
> rules moved into `docs/PROJECT_NOTES.md`.

Check every lesson:

```
python3 scripts/check_lessons.py          # all 29; exits 0 when clean
python3 scripts/check_lessons.py app/lessons/lesson7.html   # one lesson
```

## Running

Any static server works (the "real data" stages fetch `data/clean/*.csv`):

```
python3 -m http.server 8000
# then open http://localhost:8000/
```

## Releasing lessons over the term

[`LOCKS.txt`](LOCKS.txt) is one row per page:

```
lesson7         o   Tracing how much of a parent ends up in their child
lesson8         x   Counting the ratios that breed true
```

`o` open, `x` locked. Flip the letter, commit, push — that is the whole workflow.
A locked lesson shows on the landing page as a greyed, unclickable card reading
*opens later* (set `display: hide` at the top of the file to drop it from the page
entirely instead), and a student who types the URL gets the same notice instead of
the lesson. Add `?preview=1` to any URL to look at a locked page yourself.

It is a curtain, not a vault: it runs in the student's browser, so anyone who
disables JavaScript or opens `LOCKS.txt` directly gets past it. It stops next
week's homework being stumbled into, which is the actual problem. If the file
cannot be fetched, everything opens — a hosting hiccup must never strand a student
mid-homework. `check_lessons.py` fails if a page has no row, since a page missing
from the file would look released forever.

## Submission codes

`app/assets/score.js` turns a student's name into a stable passcode and packs their
per-question bits, two clocks, and per-stage engagement counts into one opaque,
tamper-evident code (`lessonNvVER.base64url(cipher).mac6`):

| field | what it answers |
|---|---|
| name token | who |
| pretest / checkpoint / posttest bits | which questions they got right |
| wall seconds | how long the tab was open |
| active seconds | how long they were actually working (pauses over 2 min dropped) |
| per-stage move counts | how much they touched each stage's controls |

Decode one code in the browser with `instructor/verify_code.html`, a whole class
with `instructor/aggregate.html`, or a term's worth from the terminal:

```
python3 scripts/decode_codes.py -f codes.txt --items      # table + item analysis
python3 scripts/decode_codes.py -f codes.txt --csv out.csv
```

`--items` is the read on the *lessons* rather than the students: per-question
class-wide pass rates, pretest → posttest movement, and the spread of time and
control-moves. A checkpoint nobody clears is either the hard move the lesson
exists to teach or a question that does not say what it means.

To invalidate a class's codes, rotate `Score.DEFAULT_SALT` and bump each module's
`version`. `scripts/decode_codes.py` reads the salt out of `score.js` rather than
keeping its own copy, so rotating it is still a one-line edit.

Two implementations of one codec can drift, so they are pinned together:

```
python3 scripts/test_codec.py   # mints codes with the real score.js under node,
                                # decodes them in Python, insists they agree
```
