# BIO 202 — Evolution simulations

Interactive homework for a conceptual evolution course (Coe College). Each lesson
is a self-contained HTML page: progressive stages that unlock by being *solved*,
canvas simulations, a live R code panel, and a submission code the student pastes
back for the instructor to decode.

The subject is evolution as **differential reproduction of units with transmissible
characteristics**, and the forces that move the frequency of those characteristics.
Causal inference is the point; regression modelling is the primary tool; the split
between the stochastic and deterministic parts of a model is the throughline. The
students have no maths or statistics background, and no vocabulary is taught —
they get there by manipulating models and reading displays, with the prose kept
thin. All of that is in [`structurephilosophy.md`](structurephilosophy.md), which
is short and worth reading before anything else here. Course content is grounded in
[`docs/2026_lecture_detail.tex`](docs/2026_lecture_detail.tex).

**Lessons 1–9 are the model form** — revised, reviewed and used. 10–11 were rebuilt
2026-09-17. **Everything from 12 up is a nebulous draft**: content, order, number
and structure are all in doubt, and no document in this repo describing one is a
commitment.

## Layout

```
index.html                    landing page (lessons + scaffolds + explorer)
LOCKS.txt                     the release gate: one row per page, x = locked
app/lessons/lessonN.html      30 lessons, in file-number order
app/scaffolds/sNN_*.html      27 guess-and-check drills
app/interactives/descent.html pedigree explorer (unscored)
app/assets/score.js           the submission-code library (name -> opaque passcode)
app/assets/lock.js            reads LOCKS.txt; hides a page that is not open yet
instructor/                   verify_code.html + aggregate.html (decode student codes)
scripts/decode_codes.py       the same decoding at the command line, in batch
data/clean/*.csv              real datasets used in the "real data" stages
```

## Start here

- [`structurephilosophy.md`](structurephilosophy.md) — seventeen lines, JM's, canonical. Read it first.
- [`docs/LESSON_STYLE.md`](docs/LESSON_STYLE.md) — how these lessons are actually built, read off lessons 1–10. Suggestions, not rules.
- [`docs/WORK_ORDER.md`](docs/WORK_ORDER.md) — standing warnings and pinned constants. Traps and numbers, no design rules.
- [`docs/overhauls/`](docs/overhauls/) — one prep document per lesson, written before the first edit.

## The checks

**Writing decisions belong to the author.** The machine checks only catch things
you cannot see by opening the page; nothing here gates prose, vocabulary or lesson
design. That is deliberate — the guardrails that used to do so were keyed to a
sequence the course had stopped following, and they outranked JM.

- [`scripts/check_lessons.py`](scripts/check_lessons.py) — **the gate**, and it is structural only: scoring slots that nothing writes, helpers nothing defines, a missing `score.js`/`Score.init`/`sim.js`, an empty `<h1>`, and the release gate (every page has a `LOCKS.txt` row and loads `lock.js`). It runs on every lesson file, including new numbers. Exit 0 iff clean.
- `--style` and `--terms` are **reports, not gates.** `--style` flags giveaway phrases and prose jargon; `--terms` says where each term in [`ledger.json`](ledger.json) is first named, in lesson-number order. Since no vocabulary is taught at all, every line `--terms` prints for student-facing prose is something to look at.
- [`ledger.json`](ledger.json) — a term list and two phrase lists, feeding those two reports. **Nothing in it blocks anything**, and it no longer carries course length, term budgets, naming delays, per-arc minute budgets or per-term unlock units; all of those were struck on 2026-09-17.
- [`scripts/test_codec.py`](scripts/test_codec.py) — pins the Python decoder to the JavaScript one that mints the codes.

The judgment-level checks a machine cannot run are in
[`docs/LESSON_STYLE.md`](docs/LESSON_STYLE.md) §14.

Check every lesson:

```
python3 scripts/check_lessons.py          # all 30; exits 0 when clean
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
