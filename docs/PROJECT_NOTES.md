# BIO 202 — project notes

The single durable notes-and-memory file for this repo. Consolidated 2026-08-24
from thirteen scattered docs, most of which are now retired to
`_reference/retired/` (see §8).

**Read order for anyone — human or agent — picking this up:**

1. `structurephilosophy.md` — why, and the 47-unit sequence. Canonical.
2. this file — what is true right now, what the live rules are, what was retired.
3. `docs/WORK_ORDER.md` — what to do next.
4. `docs/LESSON_ATLAS.md` — stage-by-stage description of the shipped lessons.
5. `docs/2026_lecture_detail.tex` — the actual course content the lessons serve.

---

## 1. What the lessons are for

The lessons build intuition for the concepts that **recur across topics**. They do
not cover the lecture list, and are not expected to. A lecture topic with no lesson
is not a defect; a recurring reasoning move with no lesson is.

Three things recur. Everything in the sequence is one of them, or scaffolding for
one of them.

### Thread A — the slope

One number → one number plus a group → one number plus a rate → the rate is a
covariance → the covariance is the change in the average.

Regression, R², heritability, the breeder's equation, F_ST and Hamilton's *r* are
the same object seen at different scales. The lecture says so outright in four
places: "ANOVA is literally a linear regression" (`2026_lecture_detail.tex:2695`),
"h² is literally an R²" (`:2473`), "*r* = regression of recipient genotype on
helper's" (`:3654`), "Breeder's: structurally a regression" (`:2166`).

`structurephilosophy.md` §"The one thing underneath all of it" is this thread, and
carries two cautions that must survive every revision:

- **The "leftover" is not one object.** Early on it is cross-sectional scatter
  around a line. In the final identity it is within-lineage change across a round.
  These share a *shape*, not an identity. Engineer recognition of the shape. Never
  let a build imply the residual around a line *is* the transmission term.
- **The slope picks up a weighting.** An ordinary best-fit slope weights every
  point equally; the slope in the identity weights each point by how much it
  reproduces. That weighting cannot appear from nowhere at the end. Unit [22]
  (L16a) exists solely to build it by hand, and shipped 2026-08-24 as
  `app/scaffolds/s25_counting_weights.html`. It is not yet welded to L15 or L26
  — see WORK_ORDER P0-2.

### Thread B — the ledger

Every feature was inherited or invented. Heritability, mutation-as-the-act-of-not-
inheriting, IBD vs IBS, homology vs homoplasy, and the chopstick fallacy are one
question at five scales. The lecture's appendix calls it "the master ledger behind
almost everything." Currently the thinnest of the three in the build.

### Thread C — the discipline

A pattern is not its own explanation. Shuffled pile, default-to-drift,
what-you-see-is-what-didn't-die. Well served except the survivorship leg.

---

## 2. Verified state (2026-08-24)

```
app/lessons/lesson*.html       29 lessons; 1–19 built, 20–26/30/31/34 skeletons
                               (27/28/29/32/33 folded away — see below)
app/scaffolds/s01–s25.html     25 working drills (20–52 KB each, canvas + handlers)
app/interactives/descent.html  pedigree explorer: coalescence, IBD, gene dropping
                               — live on the index, UNSCORED, absent from the atlas
app/assets/sim.js              canonical shared helpers (fallback; locals shadow it)
app/assets/score.js            submission codes + cross-lesson carryover
instructor/                    verify_code.html, aggregate.html
scripts/check_lessons.py       THE LIVE GATE
```

**Front-end architecture.** Every page loads `sim.js` then `score.js` then its own
inline script, in that order. `sim.js` holds twelve helpers (mulberry32, gauss,
makeNormal, setupCanvas, makeFrame, drawAxes, quantile, rbinom, olsSlope, chi2P,
downloadText, highlightByDataLine). Lessons still carry their own local copies,
which shadow the library — so `sim.js` is a *safety net*, not yet a single source
of truth. Do not mass-strip the locals: drawAxes has 7 variants in the wild,
makeFrame 4, rbinom 4, and reconciling them needs the picture checked one lesson
at a time. `bumpExplore` is deliberately excluded — all 16 copies differ because
each counts stage combinations specific to its lesson.

**Cross-lesson carryover.** `Score.carry(key, value)` / `Score.recall(key)` /
`Score.recallInfo(key)` persist to a course-wide, per-student namespace
(`bio202-carry:<nameToken>`), deliberately outside the per-module, version-stamped
score key — carried values are inputs to a later lesson, not scoring state, and
survive a version bump. A receiving lesson must degrade silently when the value is
absent, because students will skip things. Live hand-offs are listed in
`docs/WORK_ORDER.md` P0-2.

`python3 scripts/check_lessons.py` → **29 lessons, 0 hard failures.** Warnings
(~110) are prose jargon for terms the ledger has already unlocked at that unit —
stylistic, not violations.

Arc 4/5 are less empty than the atlas implies: six scaffolds (s14, s16, s17, s18,
s19, s20) cover skeleton content outright. Real outstanding builds ≈ 8–9, not 15.

---

## 3. The old→new unit map

The shipped lesson files carry the 47-unit sequence with an offset. This map is the
Rosetta stone for the whole project and previously existed only as a Python dict at
`scripts/check_lessons.py:36-47`. The vocabulary ratchet is checked at the **new**
position, so e.g. lesson12 is unit 13 and may use a term that unlocks at unit 12.

| file | unit | seq | | file | unit | seq | | file | unit | seq |
|---|---|---|---|---|---|---|---|---|---|---|
| lesson1 | L1 | 1 | | lesson13 | L14 | 19 | | lesson25 | L26 | 37 |
| lesson2 | L2 | 2 | | lesson14 | L15 | 21 | | lesson26 | L27 | 38 |
| lesson3 | L4 | 4 | | lesson15 | L16 | 23 | | lesson27 | L28 | 40 |
| lesson4 | L5 | 5 | | lesson16 | L17 | 24 | | lesson28 | L29 | 41 |
| lesson5 | L6 | 7 | | lesson17 | L18 | 26 | | lesson29 | L30 | 42 |
| lesson6 | L7 | 9 | | lesson18 | L19 | 27 | | lesson30 | L31 | 43 |
| lesson7 | L8 | 12 | | lesson19 | L20 | 29 | | lesson31 | L32 | 44 |
| lesson8 | L9 | 14 | | lesson20 | L21 | 31 | | lesson32 | L33 | 45 |
| lesson9 | L10 | 15 | | lesson21 | L22 | 32 | | lesson33 | L34 | 46 |
| lesson10 | L11 | 16 | | lesson22 | L23 | 33 | | lesson34 | L35 | 47 |
| lesson11 | L12 | 17 | | lesson23 | L24 | 34 | | | | |
| lesson12 | L13 | 18 | | lesson24 | L25 | 35 | | | | |

**Sequence units with no lesson file.** These are real gaps in the design, not
bookkeeping:

- **[3] L3** — the flat guess (inserted rung)
- **[8] L7a** — hold the effect fixed, move only n
- **[11] L8a** — two dots from the same parent are not two independent readings
- **[22] L16a** — the weighting. **Built 2026-08-24** as `s25_counting_weights`,
  following the established rung-as-scaffold pattern; promote it to a full unit
  when the Arc 5 collapse renumbers the lesson files.
- **[28] L19a** — rotate the diagram at its hinges (partly covered by lesson18 A)
- **[39] L27b** — the nesting step; pries apart the two meanings of "leftover"
- **Checkpoints C1, C2, C3** — never built

**Arc 5 was collapsed 2026-08-24.** Seven transitions with an identical
A/B/C/D shape became four lessons: **26** (the identity; stage D now runs the
diagnostic at gene→chromosome, gene→genome and genome→cell as three cases of one
instrument), **30** (cell→individual, the only working simulator in the arc),
**31** (individual→superorganism), **34** (capstone; stage B runs the same
diagnostic above the individual and then off DNA entirely). The five folded files
are in `_reference/retired/lessons/` and still hold the fullest build specs.
Lesson numbering now has gaps — deliberate, since module ids carry the submission
codes. Renumber in one sweep or not at all.

**The four `S-` drills are the scaffolds:** [6] S-weld = s23, [10] S-single = s22,
[25] S-cond = s21, [36] S-agree = s24. Their placement in the sequence is
deliberate; do not relocate them to fill other gaps.

---

## 4. Live rules

Everything here is enforced, currently followed, and consistent with the goals in
§1. Rules that are *not* on this list are not rules (see §8).

**Vocabulary ratchet.** `ledger.json` is the single source of truth. A term with
`unlock: null` is banned everywhere, forever. A term with an unlock id is banned in
every unit before it and free afterward. Twenty names across the course, hard
budget. A term may be named only after its move has run in ≥3 prior units.

**Editing the ledger is a curricular decision, not a build decision.** An agent
blocked by the ratchet has exactly two legal moves: rewrite the text to say the
thing without the word, or escalate. Not: adding an unlock to a `null` term, moving
an unlock earlier because the prose is awkward, adding a term so it stops being
flagged, or raising `arc_budgets_minutes`.

**Show, don't tell.** The one-line version of each unit's point is the answer key,
never on-screen text, in any paraphrase. No "what you'll do" front matter. No
takeaway printed at the bottom. Telling a student where to look is telling them
what they'll see.

**Options state WHAT, never WHY.** *(from the applied de-telegraph pass,
2026-06-06)* Every prediction option is a bare competing claim. Strip every clause
that explains, justifies or defines — anything after an em-dash that reads as a
justification goes. Distractors are the common misreadings, stated flat. Target
mean option length 4–7 words. **Never touch a correct-answer `value=` token or a
`correct:` index** — the scoring bits ride on them.

**Titles name the move, never the term.**

**Read, then predict, then touch.** Controls stay locked until a prediction is
recorded. A prediction you can slink away from is not a prediction.

**The code panel is always visible** and every unlocked control maps to a line. A
slider with no line is a spell. Technical names are allowed to live in the code
panel — that is where jargon goes to be legal.

**Anchor quotes stay.** Lecture quotes are the voice of the thing and survive every
overhaul. But a quote must be load-bearing for the stage it sits on; keyword-matched
decoration is worse than no quote. No inline editorial glosses inside a quote.

**Naming after the fact.** When a move finally gets a name, it lands in a panel that
unlocks *after* the doing — the `s19` pattern ("what you just did has a name").
Never before.

**One move, many datasets; the last one is unscaffolded.** The final dataset is the
measurement, and it must not be the famous one — a canonical set is a feature in the
scaffolded stage and worthless as the transfer test.

**Never call a helper nothing defines.** The gate fails any lesson that calls a
function absent from the lesson, `sim.js` and `score.js`, and any lesson that
omits the `sim.js` include. A missing helper throws at page load, which means no
name box and no submission code, with nothing on screen saying so — it is how
lesson12 and lesson18 were both silently dead for a while.

**Never declare scoring you do not do.** The gate fails any lesson with
`scaffold: N` (N > 0) that never calls `recordCheckpoint`. Such a lesson emits a
valid code whose answer bits are all zero, so every student decodes as having got
every checkpoint wrong.

**The break opens a door.** Every clean intuition ends on the case that breaks it,
and the break names the forward unit that handles it. Some stage must accept a
nonsensical setting so the model can be watched falling over.

### The four adversarial passes

Preserved from the retired build contract because they are the useful half of it.
Run against the lesson HTML, not against a JSON spec.

- **Pass A — the cold novice.** Reconstruct the exact vocabulary available at this
  position: every ledger term whose unlock unit has a lower seq, and nothing else.
  Read every on-screen string as a student with that list. Name every token they
  cannot parse. Each one is an edit or a new rung — those are the only two
  outcomes. "They'll pick it up from context" is not an outcome.
- **Pass B — licensing.** For each step, name the earlier unit that licenses it, by
  index — not "builds on regression" but *unit 4, the leftovers the student drew by
  hand*. A step with no license gets a rung inserted, the unit moved later, or the
  step cut. Inventing the license is not a fix.
- **Pass C — the giveaway.** Hunt every sentence that states, hints or paraphrases
  the takeaway. The checker catches verbatim aphorisms, 70% paraphrases and the
  giveaway-phrase list; it cannot catch the sentence that structurally hands over
  the point without reusing a word. That is this pass.
- **Pass D — transfer.** Take the last, unscaffolded dataset. Can a student get
  through it by pattern-matching the previous screen without running the move? If
  yes it measures nothing. Two known failure shapes: the famous dataset, and one
  subject wearing two names (two height datasets are one dataset).

### Stage shape — unresolved, needs a ruling

`structurephilosophy.md` specifies six roles: `orient, predict, act, rebuild, real,
break`. The shipped lessons use A/B/C/D/E stages that do not map cleanly onto them.
Both vocabularies are currently in circulation, which means the next agent either
enforces a shape that breaks working lessons or ignores the scaffolding entirely.
**Decide before the next build round.** See WORK_ORDER P0-5.

---

## 5. Design decisions on record

- **Covariance/Price naming lives in the code panel, not prose.** An earlier pass
  named `cov(x,y)/var(x)` in the closers of lessons 3/12/15/17. The ratchet reserves
  "the identity" for unit 38. Reconciled by keeping the thread as *the recurring
  slope you keep fitting* and removing premature naming from prose. Reverting is
  one line per lesson, and the checker will flag it.
- **Front matter cut, anchor quotes kept.** The rule applied everywhere during the
  July overhaul.
- **Lesson 7's transfer dataset is Galton** — canonical, which is a feature for a
  scaffolded real-data stage and weak as the unscaffolded measurement (Pass D).
  Bighorn pedigree and salamander morphology are in `data/clean/` if a true
  transfer set is wanted.
- **Lesson 11's Florida Scrub Jay curve is nearly flat, and that is the point.**
  The observed points sit inside the constant-size envelope, so the richer
  bottleneck model is overfitting. This is the intended reveal and a direct
  enactment of "high P-value: I don't know if my model was bad." Not a data bug.
  Do not "fix" it.
- **Submission codes.** `score.js` turns a name into a stable passcode and packs
  per-question bits, elapsed time and per-stage engagement into one opaque
  tamper-evident code. Rotate `Score.DEFAULT_SALT` and bump module `version` to
  invalidate a class's codes.

---

## 6. Known-broken

- `units/` does not exist. `validate.py` and the old build contract governed it.
  Both retired.
- **Two lecture files, one authoritative.** `docs/2026_lecture_detail.tex`
  (2026-05-27, 32 chapters, 237 KB, carries the quote apparatus and the "Recurring
  Through-Lines" appendix) supersedes `notes/references/2026_lecture_outline.tex`
  (2026-05-18, 31 chapters, 131 KB). `README.md` pointed at the older one.
  **Fixed.** The outline is kept but should not be used as the content reference.
- `structurephilosophy.md` §Enforcement claimed `validate.py` is the gate.
  **Fixed** — it now points at `scripts/check_lessons.py`.
- `lesson34.html` Stage D calls back to a Lesson 1 framing that was never built.
- Stray literal markdown renders on the page in `lesson14.html`, `lesson22.html`,
  `lesson32.html`.
- Anolis ecomorph counting is built three times: lesson18 D, lesson24 D, s19.
- `docs/LESSON_ATLAS.md` claims to describe every lesson and omits all 24 scaffolds
  and the Descent explorer.

---

## 7. Retired directives — rules that were live and are now void

These contradicted the goals in §1 or the live rules in §4. Recorded so they do not
get reintroduced by someone reading an old file.

**"Options should carry an embedded rationale."** From
`notes/question_rewrites_review.md`: *"Most options now carry a brief embedded
rationale so they're recognizable as positions"* and *"the right answer is the
sentence that explains the mechanism."* **Void.** This directive is what produced
the telegraphing the de-telegraph pass had to undo — mean option length in L1–L7
had reached 8–12.5 words against 3.2–7.7 in L8–L19. The live rule is the opposite:
an option states *what*, never *why*. That file is retired specifically because it
reads as authoritative and is wrong.

**The `units/*.json` spec layer and gates G1–G20.** From `BUILD_CONTRACT.md`.
**Void** — the architecture was never built. Its useful half (the four adversarial
passes, the ledger-editing prohibition, the transfer test) is preserved in §4. The
schema, the six-stage `stages[6]` requirement, the `audit.round ≥ 2` protocol, the
three-round stop condition and the escalation-to-`UNRESOLVED.md` loop are all void.

**"A first draft has never passed."** Same source. Void as a *protocol* — there is
no draft-0/1/2 loop in the current workflow — though it remains true as an
observation.

**"One required non-trivial code modification per assignment"** and
**"reproducibility `.R` export as a first-class deliverable."** From
`simulator_pedagogy_notes.md` and `lesson_plan_30.md`. **Void as requirements** —
neither is implemented in any built lesson, and requiring code modification is at
odds with a course carrying no math or stats prerequisite. Keep as *optional
stretch* only; several skeleton specs still mention it and should be softened.
The third commitment from that set — **aggregate class predictions and show them
in the next lecture** — is live and its infrastructure exists at
`instructor/aggregate.html`.

**"~30 minutes per lesson, 30 lessons."** From `lesson_plan_30.md`. **Void** —
superseded by 47 units at 15–30 minutes with per-arc budgets in `ledger.json`.

**Stale inventories.** `HOMEWORK_REVIEW.md` reports 19 wired lessons and 20
scaffolds; it is 34 and 24. `persona_feedback_2026_05_12.md` walks
`lessons/lesson0.html` through `lesson6.html`, a layout that no longer exists.
Neither should be used as a state description.

---

## 8. Retired files

Moved to `_reference/retired/` on 2026-08-24. Nothing was deleted; the manifest in
that directory records why each was retired and what absorbed it.

| File | Why |
|---|---|
| `BUILD_CONTRACT.md` | governs `units/`, which does not exist; live half → §4 |
| `validate.py` | gate for those nonexistent specs |
| `UNRESOLVED.md` | empty; tied to the retired escalation protocol |
| `docs/MORNING_REVIEW.md` | dated session handoff; state → §2, decisions → §5 |
| `docs/reviews/DETELEGRAPH_PATCH.md` | marked APPLIED; rule → §4 |
| `docs/reviews/HOMEWORK_REVIEW.md` | marked applied; inventory stale |
| `docs/reviews/lesson-index-critique-response.md` | responds to a deleted document |
| `docs/reviews/VOICE_NOTES_OVERHAUL.md` | applied; style rules → §4 |
| `docs/ideas/homework-proposals.md` | all four proposals built (L3 E, L4 C, s22, L10) |
| `docs/ideas/evolution_course_conceptual_map.md` | superseded by the lecture tex's own "Recurring Through-Lines" appendix |
| `notes/lesson_plan_30.md` | 30-lesson plan superseded by the 47-unit sequence |
| `notes/lesson1andahalf.txt` | the P-value lesson it proposes was built as lesson6 |
| `notes/persona_feedback_2026_05_12.md` | applied; refers to a dead file layout |
| `notes/question_rewrites_review.md` | **carries a void directive** — see §7 |

`notes/additional_activities.md` was byte-identical to
`_reference/notes_old_ideas/additional_activities.md` and was deleted outright.

**Left alone:** `_reference/quotes/` (source corpora, referenced by qid throughout
the lessons and the lecture tex), `_reference/design/` (the Mitchell Design System,
a separate skill), `_reference/notes_old_ideas/` (already archived),
`notes/questions.yaml` (question-style source material), `data/`.

---

## 9. Thread map — what each piece is for

Which of the three threads each shipped piece serves, and the one line it exists
to produce. **A** = the slope, **B** = the ledger (inherited or invented),
**C** = the discipline (a pattern is not its own explanation). A piece with no
thread is doing groundwork rather than carrying an argument, which is fine — but
a whole arc of them is a warning.

| | Piece | Thread | What it is for |
|---|---|---|---|
| | L1 | — | a spread has a middle and a width; misses have a sign |
| | L2 | C | a running average settles, then leaves; overlap caps how well you can tell two crowds apart |
| | L3 | **A** | one number → plus a group → plus a rate. The ladder |
| | L4 | **A**, C | the best line is a cloud of lines, and its width is set by how much you measured |
| | S23 | **A**, C | that cloud and a histogram of outcomes are one object |
| | L5 | C | build the pile chance alone could produce, then see whether yours sits in it |
| | S01 | C | "no trend" is a distribution, not the number zero |
| | L6 | C | one test, four verdicts; which input moved each one |
| | S21 | C | holding something fixed cleans one picture and poisons another |
| | S22 | C | what a single observed change licenses you to say |
| | L7 | **A**, **B** | a resemblance is a slope — and so is a shared first language |
| | **S26** | **B** | two species, one feature: handed down, or arrived twice? |
| | L8 | C | the expected ratio and the observed ratio are different objects |
| | L9 | C | a baseline of no change, then each rule switched off |
| | L10–L11 | C | frequencies move with no force acting; read population size off the rate of loss |
| | S04–S06 | C | fixation odds, timing, and telling drift from selection |
| | L12–L13 | C | a push against wandering; where harmful variants settle |
| | S08–S09 | **A**, C | recover a rate from an observed change; recover a cost from a frequency |
| | L14 | **A** | a shortfall splits into within and between — the ratio that returns in L26 |
| | S10 | **A** | the same shortfall, drilled |
| | L15 | **A** | the response is the push times the carry-over. Opens on L7's own slope |
| | S07 | **A** | the same lever, year by year |
| | **S25** | **A** | a slope where some points count more than others. Feeds L26 |
| | L16 | **A** | movement between groups caps divergence; you recover a product, never its factors |
| | S11 | **A** | the same inverter |
| | L17 | **A** | relatedness is a slope, and it sets what a cost must buy |
| | S12 | **A** | the same rule, drilled |
| | L18 | **B** | what a tree encodes, and what is only how it was hung |
| | S13 | **B** | rotate the hinges; relationships hold |
| | L19 | **A**, **B** | subtract the shared inheritance before comparing; the slope can flip sign |
| | S15 | **B** | the same non-independence, drilled |
| | S19 | **B**, C | convergence, drift, or shared ancestry — and you need the tree to say |
| | **S27** | C | you are always counting what is still there |
| | L20–L25 | mixed | Arc 4 — skeletons; S14/S16/S17/S18/S20 cover much of the content |
| | S24 | C | when two methods agreeing is evidence and when it is not |
| | L26 | **A** | the change in the average *is* the slope. Opens on the student's S25 slopes |
| | L30, L31 | **A** | the same ratio at cell→individual and individual→superorganism |
| | L34 | **A**, **B**, C | the cascade side by side, then above the individual and off DNA |

**What this table shows.** Thread A now runs unbroken from L3 to L26 with two
welds carrying the student's own numbers. Thread C is dense through Arcs 1–2 and
has its survivorship leg at S27. **Thread B is still the thin one** — L7, S26,
L18, L19, S13, S15, S19 — and everything in it except S26 arrives late, in tree
territory. The early, biology-free statement of the dichotomy is still owed.

**Placement note on S26.** It poses the dichotomy before any tree is on screen
(the first question is answerable only with "you cannot tell from the two of them
alone"), and then introduces the tree as the instrument that settles it. That
makes it usable either as a motivation *for* L18 or as a consolidation *after* it.
It currently sits with the Arc 3 tree lessons on the index. Moving it earlier is a
curricular call, not a build one.
