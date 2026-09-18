# BIO 202 — project notes

The single durable notes-and-memory file for this repo. Consolidated 2026-08-24
from thirteen scattered docs, most of which are now retired to
`_reference/retired/` (see §8).

**Numbering changed on 2026-09-16.** The old Lesson 10 (the baseline where
nothing is happening) was absorbed into Lesson 9; the old Lesson 11
(Wright–Fisher trajectories, Buri's fly lines, the Florida Scrub Jay stage) was
replaced by a new Lesson 10 built on drift as differential reproduction. Both
old files are in `_reference/retired/lessons/`. Everything from 12 up moved down
one, so 12→11 … 27→26, 31→30, 32→31, 35→34, and the design-slot gaps now sit at
27/28/29 and 32/33. Nothing released was touched: 1–8 and 6b keep their names
and their submission codes, and everything from 9 up was still `x` in
`LOCKS.txt`, so no code a student has handed in stops decoding. **Lesson numbers
written anywhere below this line predate that change and are one too high from
12 up.**

**Read order for anyone — human or agent — picking this up:**

1. `structurephilosophy.md` — what the lessons are for. Canonical, and short.
   Rewritten 2026-09-17: it no longer describes a fixed sequence of units, arcs,
   minute budgets or stage roles. What it describes is the goal and the method.
2. this file — what is true right now, what the live rules are, what was retired.
3. `docs/WORK_ORDER.md` — what to do next.
4. `docs/LESSON_ATLAS.md` — stage-by-stage description of the shipped lessons.
   Stale, and reliable only for 10 and 11.
5. `docs/2026_lecture_detail.tex` — the course content the lessons draw on.

**How finished a lesson is, before you read anything else about it** (JM,
2026-09-17):

| lessons | status | how to treat it |
|---|---|---|
| **1–9** | revised, used, reviewed by JM directly | the model form. Copy 8 and 9 for voice, gating, question shape, layout. |
| **10–11** | rebuilt 2026-09-17, in progress | current, and the reference for the shared-operator pattern. |
| **12 and up** | *nebulous drafts* | **content, order, number and structure are all in doubt.** Never flag overlap with one. Never take one as precedent. Descriptions of them anywhere in this repo are provisional. |

That table outranks every inventory below it. Where this file or the atlas
describes a lesson above 11 in confident detail, the detail is what the file
happened to contain, not a commitment.

---

## 1. What the lessons are for

**Rewritten 2026-09-17** against the new `structurephilosophy.md` and JM's ruling
on how to read it. The three-thread frame that stood here before — Thread A the
slope, Thread B the ledger, Thread C the discipline — is no longer the thing to
appraise or plan against. See §7. Its *content* is still real and still recurs;
it just is not the organizing axis any more.

The structure has two layers, and they are not the same kind of thing.

### The conceptual goals

Evolution as **(1) differential reproduction of (2) units with (3) transmissible
characteristics**, and the forces that move the frequency of those characteristics
— Vellend's "evolutionary soundboard": each process is a fader that can be pushed
up or down, no single one of them is the explanation, and any real case is a mix.
Every lesson is in service of one of those processes, or is building the capacity
for a later lesson that is.

The far end the sequence is aiming at, stated in `structurephilosophy.md`:
students with **no math or statistics background** and only introductory biology
who can nonetheless reason about **Price's equation, species, hierarchical
selection, and individuality**.

Two consequences worth stating, because both have already been decided against
once in this repo:

- **Individuality and hierarchical selection are named destinations, not
  optional capstones.** The scope ladder cut from Lesson 10 on 2026-09-17 —
  *"it is about what counts as an individual, not about drift"* — was a correct
  call about that lesson and leaves owed content behind it. Tracked in
  `docs/WORK_ORDER.md`.
- **A lecture topic with no lesson is still not a defect.** That ruling (JM,
  2026-08-24) survives intact. The lessons build reasoning that recurs across
  topics; they do not cover the lecture list.

### The implementation

**Model structure, and interaction with models and graphs.** Causal inference is
the point and detailed regression modelling is the primary tool. The throughline
is the split between the **stochastic and the deterministic part**, and how a
model is **built, fit, and evaluated**.

Operationally that means: the student manipulates a model and reads a display;
the display is the argument; the prose is thin. Activities require interaction
and interpretation of the graph, and direct manipulation wherever it is possible.
Embracing uncertainty and determining causal effects are goals in their own right,
not side effects.

**Shared assets and interactives are a primary design focus**, not an efficiency.
A lesson that reuses an interactive the student already solved is how "build on
each other in sequence, and foreshadow one another where possible" actually
happens. `app/assets/sim.js`, `paths.js`, `score.js` and the generation operator
in lessons 10 and 11 are the current instances. This raises the value of
extraction: see §5 on `pop.js`.

### The organization is free to vary, and stepping stones are the point

There is no required lesson shape, no required stage count, no fixed unit
sequence. JM, 2026-09-17: *"The organization of each activity and lesson should
be relatively free to vary but should always be in service of those goals, or
building up to later activities that are."* A lesson justifies itself by naming
which process it serves, or which later activity it is building the capacity for
— not by conforming to a template.

**"Building up to" is a first-class justification, not a weaker one.** JM,
2026-09-17: *"individual lessons are free to serve as stepping stones towards the
goals of the project — not every lesson needs to focus on individuality (say) but
it is necessary to understand the base mechanics of probability, statistics, and
evolution to get there."*

So: **a lesson that teaches base mechanics — probability, statistics, the
mechanics of evolution — and never touches a named destination is doing exactly
what it should.** The destinations (Price's equation, species, hierarchical
selection, individuality) are what the sequence arrives at, not a checklist each
lesson answers to. Asking "where is individuality in this lesson?" of a lesson on
sampling error is the wrong question.

The failure mode this rules out is the opposite one: a lesson that is neither a
destination nor groundwork for one — a reasoning move that goes nowhere the
course is headed. That is the thing to catch, and it is rare.

### Two cautions that must survive every revision

These lived in `structurephilosophy.md` §"The one thing underneath all of it",
which no longer exists. They are preserved here because they are load-bearing for
Price's equation, which is still a stated destination, and because live code
depends on them (`priceTerms` in lessons 10 and 11).

- **The "leftover" is not one object.** In a fitted line it is cross-sectional
  scatter around the line — variation the slope did not explain. In the identity
  it is within-lineage change across a round — what each unit did after it was
  measured. These share a *shape*, not an identity. Engineer recognition of the
  shape. **Never let a build imply that the residual around a line *is* the
  transmission term.** This is why `priceTerms` names `cov` and `within`
  separately and never sums them.
- **The slope picks up a weighting.** An ordinary best-fit slope weights every
  point equally; the slope in the identity weights each point by how much it
  reproduces. That weighting cannot appear from nowhere at the end. The
  hand-built version is `app/scaffolds/s25_counting_weights.html`.

---

## 2. Verified state (2026-08-24)

```
app/lessons/lesson*.html       29 lessons, all with a working interactive
                               (28/29/30/33/34 folded away — see below)
app/scaffolds/s01–s25.html     25 working drills (20–52 KB each, canvas + handlers)
app/interactives/descent.html  pedigree explorer: coalescence, IBD, gene dropping
                               — live on the index, UNSCORED, absent from the atlas
app/assets/sim.js              canonical shared helpers (fallback; locals shadow it)
app/assets/score.js            submission codes + cross-lesson carryover
app/assets/lock.js             release gate: reads LOCKS.txt, hides a locked page
app/assets/paths.js/.css       path-diagram controls: the arrows ARE the sliders
                               — a fixed causal model whose edges are draggable.
                               Not dag.js: that one lets a student BUILD a graph;
                               this one makes a lesson's own graph adjustable.
                               Binds each arrow to a hidden <input type=range>,
                               so existing listeners/gates/R-code keep working.
                               One control can drive a fork (one cause, two
                               outcomes) or a tier (the same relationship in two
                               places sharing no endpoint, via `edges`).
                               Per-arrow `dragSpan` buys precision where the
                               useful window is a sliver of the range.
                               Used by lesson8 stages B, C and D.
LOCKS.txt                      one row per page, o = open / x = locked
instructor/                    verify_code.html, aggregate.html
scripts/check_lessons.py       structural checks (+ --style, --terms reports)
scripts/decode_codes.py        batch code decoder + class item analysis
scripts/test_codec.py          pins the Python codec to the JavaScript one
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

**What a submission code carries (2026-08-25).** Name token, per-question bits for
the three groups, wall-clock seconds, *active* seconds, and per-stage control-move
counts — packed as
`NAME|PRE|SCAFFOLD|POST|WALL|MANIP|ACTIVE`, XOR'd against a salt-derived keystream
and tagged. Active seconds is the attention clock: consecutive signs of life
summed, with any pause over two minutes discarded, so a tab left open all evening
inflates the wall clock and not this. Codes minted before it existed carry six
fields and decode with `activeSec: null` — the decoders distinguish *not measured*
from *zero*, and must keep doing so.

Neither clock is proof of thought, and nothing in the code can be. Attention still
counts a student idly wiggling a slider; the per-stage move counts are the
cross-check, and a ratio that looks wrong is a prompt to look, not a verdict.

**Reading the lessons, not the students.** `decode_codes.py --items` and the item
panel in `aggregate.html` give per-question class-wide pass rates plus pretest →
posttest movement. This is the efficacy instrument: a checkpoint the whole class
misses is either the hard-won move the lesson exists to teach or a question that
does not say what it means, and only opening the item settles which.

**The release gate.** `LOCKS.txt` + `app/assets/lock.js`. One row per page, `x`
locked / `o` open; a locked page greys out on the index and refuses to render
itself if URL-guessed. `?preview=1` bypasses it. Fails *open* on any error, by
design — a fetch hiccup must never strand a student mid-homework — which is
exactly why `check_lessons.py` fails when a page has no row: a page missing from
the file would look released forever and never say so. Client-side, therefore a
curtain and not a vault; nothing that must stay unseen belongs in a public repo.

**Two names that open every stage.** Both are recognised in `app/assets/score.js`,
compared after `nameToken()` normalises case, spaces and punctuation, so the spelling
does not have to be exact.

- **`JMitchell`** (also `J. Mitchell`, `JSMitchell`, `JS Mitchell`) — the instructor
  bypass. Every section, gate and inner step opens at once, and the run **still mints a
  code**, in whatever name was typed. That is deliberate: a code in JM's name is how the
  codec gets exercised end to end, and it is worthless to hand in anyway.
- **`Study Mode`** (also `study mode`, `StudyMode`, `study-mode`) — added 2026-09-16 on
  JM's call, for students who want to replay an interactive without walking the lesson
  again. Opens exactly the same doors and **mints no code at all**: the final panel says
  so in words rather than going blank, because an empty panel where a code belongs reads
  as a bug and a code reading "Study Mode" reads as something to submit.

Neither touches a student's real record: the score key is `bio202-score:<module>v<n>:<nameToken>`,
so a study-mode run lands in its own bucket.

**Cross-lesson carryover.** `Score.carry(key, value)` / `Score.recall(key)` /
`Score.recallInfo(key)` persist to a course-wide, per-student namespace
(`bio202-carry:<nameToken>`), deliberately outside the per-module, version-stamped
score key — carried values are inputs to a later lesson, not scoring state, and
survive a version bump. A receiving lesson must degrade silently when the value is
absent, because students will skip things. Live hand-offs are listed in
`docs/WORK_ORDER.md` P0-2.

`python3 scripts/check_lessons.py` → **29 pages, 0 hard failures.** It now checks
structure only: scoring slots that nothing writes, helpers nothing defines, missing
`score.js`/`Score.init`/`sim.js`, an empty `<h1>`, and LOCKS.txt coverage — every
one of them a failure you cannot see by opening the page. Add `--style` for
advisory prose notes, `--terms` for the vocabulary report (§4 — the target is zero).

**It no longer skips lessons it does not recognise.** Until 2026-09-03 a lesson
whose number was absent from the unit map returned before any check ran, so a new
lesson got nothing — the checks switched off exactly when the sequence was being
edited. Verified after the change: a deliberately broken `lesson77.html` now
reports its empty `<h1>`, its missing `score.js` and its undefined helper, where
before it reported none of them. The unit map itself was struck on 2026-09-17
(§3); the script no longer carries a sequence at all.

The back half is less empty than the atlas implies: six scaffolds (s14, s16, s17,
s18, s19, s20) cover skeleton content outright. Real outstanding builds ≈ 8–9, not
15 — though with lessons 12 and up all in doubt, that is a count of files rather
than of work.

---

## 3. Unit ids — struck, and how to read old notes that still use them

**The 47-unit sequence is gone as of 2026-09-17.** `structurephilosophy.md` no
longer describes one; `ledger.json` no longer carries `course_length`,
`term_budget`, `min_prior_runs_before_naming`, `arc_budgets_minutes` or per-term
`unlock` ids; `check_lessons.py` no longer carries `LESSON_UNIT` or `UNIT_SEQ`.
The old map is in git history and nowhere else.

**The only sequence the course has is the lesson file numbers.** `LOCKS.txt` is
the authoritative list of what exists.

A lot of writing in this repo predates that. Three vocabularies are in old notes
and none of them is live:

- **`L7`, `L16a`, `S-weld`, `C1`, "seq 22"** — unit ids and positions in the
  47-unit sequence. Void. A note saying "lesson7 is L8 at seq 12" is saying
  nothing about the course as it stands.
- **"Arc 1" through "Arc 5"** — five groups with minute budgets. Void as budgets
  and as a design unit. `docs/LESSON_ATLAS.md` is still physically organized by
  them, which is one reason it needs regenerating rather than patching.
- **Lesson numbers written before 2026-09-16** — one too high from 12 up. See the
  banner at the top of this file.

**What is real and still matters from that history**, because submission codes
ride on it:

- **Renumbered 2026-09-15.** `lesson8b` became `lesson9`; everything above moved
  up one.
- **Renumbered 2026-09-16.** The old Lesson 10 was absorbed into Lesson 9 and the
  old Lesson 11 replaced; 12→11 … 27→26, 31→30, 32→31, 35→34.
- **Nothing released was touched by either.** Lessons 1–8 and 6b keep their names
  and their submission codes; everything from 9 up was still `x` in `LOCKS.txt`.
- **The gaps at 27/28/29 and 32/33 have no file.** They are leftovers of the Arc 5
  collapse of 2026-08-24, when seven transitions with an identical A/B/C/D shape
  became four lessons (now 26, 30, 31, 34). The five folded files are in
  `_reference/retired/lessons/` and still hold the fullest build specs for that
  material. Given that everything above 11 is a nebulous draft, treat the gaps as
  numbering slack rather than as design slots owed a build.
- **Module ids carry the submission codes.** Renumber in one sweep or not at all.

**Design work that was owed under the old sequence and is still owed as
content**, stripped of its unit ids — each of these is a gap in reasoning, not a
missing file number:

- the flat guess, before any line is fitted (old L3)
- hold the effect fixed and move only the sample size (old L7a)
- two measurements from the same parent are not two independent readings (old L8a)
- the early, biology-free statement of inherited-or-invented (old Thread B rung)
- the nesting step that pries apart the two meanings of "leftover" (old L27b)
- **the copy-count weighting — built**, as `app/scaffolds/s25_counting_weights.html`

---

## 4. Live rules

Everything here is enforced, currently followed, and consistent with the goals in
§1. Rules that are *not* on this list are not rules (see §7). Revised 2026-09-17
against the rewritten `structurephilosophy.md`.

### Vocabulary — the rule got stricter, not looser

**No vocabulary is taught in the lessons at all.** Not early, not late, not after
the fact. Jargon is avoided in student-facing prose wherever it can be; where it
cannot, the only terms allowed are **biological ones an introductory student
already has** — meiosis, allele, gene, locus, and their near neighbours.

Two things that used to be legal are not:

- **The naming-after-the-fact panel is retired** (JM, 2026-09-17). The `s19`
  pattern — a panel unlocking after the doing to say "what you just did has a
  name" — is gone. There is no position in a lesson where naming a statistical or
  population-genetic term is the right move.
- **The 20-name budget is gone**, along with the ratchet it belonged to. It is not
  a budget to spend down. The target is zero.

**Still legal: technical names inside the R code panel.** That is where jargon
goes to be legal, and the reason is that the panel is real code — a variable has
to be called something. The rule binds prose, UI, labels, titles, option text,
axis captions and stage headers. It does not bind `<pre class="code">`.

**Precedent, not exception:** `lesson9.html` teaches p²/2pq and a three-allele
locus with the words *Hardy*, *Weinberg* and *equilibrium* appearing zero times.
That is the standard, and it is JM's own 2026-09-14 ruling.

`check_lessons.py --terms` reports where each term is first named, in lesson-number
order, read off the shipped pages. It blocks nothing and never did. Under this rule
every line it prints for a student-facing string is something to look at. As of
2026-09-17 it prints `mean` at lesson 2, `95% interval` at lesson 5 and
`heritability` at lesson 7 — inside the revised, JM-owned lessons, so they are
reported here rather than edited.

### Gating and shape

**Gate on solving, not on predicting.** (JM, 2026-09-01; confirmed by the
2026-09-17 rewrite.) Controls are live the moment a stage opens. A stage opens the
next one by being *solved* — the student lands a target the interactive sets. The
old rule here, *"read, then predict, then touch; controls stay locked until a
prediction is recorded,"* is **void**. Interactives are harder on purpose: tighter
tolerances, more knobs, real search.

**The bowling pattern — set it, play it, watch it, find out.** (JM, 2026-09-17,
from the Lesson 10 Part C review: *"Having them set conditions at the start, hit
'play', watch it progress, and then see if they hit some target ... would be a
fantastic core kind of question. Kind of a 'bowling' approach."*) The shape:

1. The student is told the target — full bimodality, an allele extinct inside X
   generations, whatever the system's target is.
2. They set the conditions with the controls live.
3. They hit **play**.
4. **The controls lock while it plays**, and the animation runs generation by
   generation. They watch. They cannot steer it mid-roll — that is the whole
   point of the bowling analogy.
5. At the end it reports whether they hit the target.
6. Repeat until they land it the required number of times.

**This is a core question shape, to be used widely in this lesson and
subsequent ones** — not a one-off for Lesson 10. What it buys over a slider that
redraws instantly is a visceral feel for a stochastic process: the same setting
played twice gives different rolls, and the student feels the unpredictability
rather than reading it off a summary. Requiring *several* successes is what makes
that land — one success is luck, five is a claim about the setting.

Implemented in `lesson10.html` as `wireBowling(stage, cfg)`, written general
(target predicate, success count, per-frame painter) so the next lesson takes the
helper rather than the idea. **Extract to `sim.js` at the third caller.**

**Closing questions are lock-in-and-resample games.** Scored on the first lock
only; a miss never shuts a door. The interactive solve is the gate, the question
is the record. `wirePrediction` → `wireNumeric` → the games, in that order of
supersession; lessons 5–19 still carry older patterns and have not been converted.

**There is no required stage shape.** The six roles — orient, predict, act,
rebuild, real, break — are **retired** (JM, 2026-09-17) along with the document
that specified them. The shipped A/B/C/D/E lettering is just lettering. The
long-running "stage shape needs a ruling" flag is **closed**: organization is free
to vary, in service of the goals in §1.

**The break still earns its place, as a habit rather than a slot.** A clean
intuition that never meets the case that breaks it has not been tested, and some
control should accept a nonsensical setting so the model can be watched falling
over. What is gone is the requirement that this be a terminal stage naming a
forward unit by index — there are no unit indices any more.

### Prose and questions

**Show, don't tell.** The one-line version of a lesson's point is the answer key,
never on-screen text, in any paraphrase. No "what you'll do" front matter. No
takeaway printed at the bottom. Telling a student where to look is telling them
what they will see. Held by judgement and by `--style`, not by a blocking check.

**Text is extremely light.** `structurephilosophy.md`: *"Text should be extremely
light, with a focus on discovery through engagement with the data, models, and
diagrams."* When a paragraph and a display say the same thing, the paragraph goes.

**Options state WHAT, never WHY.** Every option is a bare competing claim. Strip
every clause that explains, justifies or defines. Distractors are the common
misreadings, stated flat. Target mean option length 4–7 words. **Never touch a
correct-answer `value=` token or a `correct:` index** — the scoring bits ride on
them.

**Titles name the move, never the term.**

**The code panel is always visible** and every unlocked control maps to a line. A
slider with no line is a spell.

**Prefer manipulating the graph over manipulating a slider beside it.** (JM,
2026-09-17, on Lesson 10 Part E: *"Instead of a slider, the graph should be wider
& dragging should occur directly on the graph."*) `structurephilosophy.md` asks
for *"direct manipulation where possible"* — a slider that sets a line's slope is
one level of indirection away from dragging the line. Where a control has an
obvious geometric meaning on a display, put the control on the display and give
the display the width the slider was taking. The code panel still gets its line;
the dragged value still writes to it.

**Anchor quotes stay.** Lecture quotes are the voice of the thing and survive every
overhaul. A quote must be load-bearing for the stage it sits on; keyword-matched
decoration is worse than no quote. No inline editorial glosses inside a quote.

**One move, many datasets; the last one is unscaffolded.** The final dataset is the
measurement, and it must not be the famous one — a canonical set is a feature in the
scaffolded stage and worthless as the transfer test.

**Real data alongside the simulation is wanted.** (JM, 2026-09-17.) Check
`data/SOURCES.md` before concluding a lesson has no real anchor.

### The two structural failures the gate exists to catch

**Never call a helper nothing defines.** The gate fails any lesson that calls a
function absent from the lesson, `sim.js` and `score.js`, and any lesson that
omits the `sim.js` include. A missing helper throws at page load, which means no
name box and no submission code, with nothing on screen saying so — it is how
lesson13 and lesson19 were both silently dead for a while.

**Never declare scoring you do not do.** The gate fails any lesson with
`scaffold: N` (N > 0) that never calls `recordCheckpoint`. Such a lesson emits a
valid code whose answer bits are all zero, so every student decodes as having got
every checkpoint wrong.

### The four adversarial passes

Preserved from the retired build contract because they are the useful half of it.
Run against the lesson HTML, not against a JSON spec. Passes A and B were re-cut
2026-09-17: both used to be run against the 47-unit sequence, which no longer
exists.

- **Pass A — the cold novice.** Read every on-screen string as a student with no
  math or statistics background and one introductory biology course. Name every
  token they cannot parse. Each one is an edit — under the current vocabulary rule
  there is no "unlock it later" outcome, and "they'll pick it up from context" was
  never one.
- **Pass B — licensing.** For each step, name the earlier *lesson* that licenses
  it, by file — not "builds on regression" but *lesson 4, the leftovers the student
  drew by hand*. A step with no license gets a rung built, the step cut, or the
  lesson moved. Inventing the license is not a fix. For lessons 12 and up, where
  order is in doubt, this pass reports rather than blocks.
- **Pass C — the giveaway.** Hunt every sentence that states, hints or paraphrases
  the point. `--style` catches the giveaway-phrase list; it cannot catch the
  sentence that structurally hands over the point without reusing a word. That is
  this pass.
- **Pass D — transfer.** Take the last, unscaffolded dataset. Can a student get
  through it by pattern-matching the previous screen without running the move? If
  yes it measures nothing. Two known failure shapes: the famous dataset, and one
  subject wearing two names (two height datasets are one dataset).

---

## 5. Design decisions on record

- **Lessons 10 and 11 rebuilt from scratch (2026-09-17), and written against a
  shared generation operator.** JM asked for a total overhaul of both, aimed at
  what causes drift, what makes it faster or slower, and foundations for
  drift–selection balance, neutral diversity, coalescence and F_ST that are
  never made explicit. He chose the split: **10 is drift, whole; 11 is ancestry,
  whole.** Full detail, measured numbers and the rulings are in
  `docs/WORK_ORDER.md`. Four things worth keeping for the next build of this
  shape:
  - **Write the operator more general than the lesson needs, and leave the
    unused arguments defaulted and exercised.** `breed()` takes one pool per
    parent slot, a share function and a copy function. Flat share is drift; a
    function of the genotype is selection; a second pool is migration; the copy
    function is mutation. Lesson 10 Stage B gets its whole point — that the
    error is inherited — by passing the *founding* population as the pool
    instead of the current one. That is one argument, not a second simulator.
  - **A shared engine is a shared failure mode, so it needs closed forms to be
    pinned against.** This round measured eight: `1/Σp²`, `1/(2Ne)`, `1.386N`,
    `(1−e^(−4Nsp))/(1−e^(−4Ns))`, `4NmNf/(Nm+Nf)`, the harmonic mean, `2N`, and
    `4Nμ/(1+4Nμ)`. Extract `app/assets/pop.js` when a third lesson wants the
    operator, with those as its test suite — not before.
  - **Keep the two Price terms separately named even where only one is live.**
    §1's first caution forbids implying that the scatter around a fitted line
    *is* the transmission term. (It used to live in `structurephilosophy.md`
    §"The one thing underneath all of it"; that section was struck 2026-09-17
    and the rule moved to §1 of this file, unchanged.) A shared engine is
    exactly where the two would fuse into one "leftover", so `priceTerms`
    returns `cov` and `within` and never sums them.
  - **A bar check that only tests one round misses the constant answer.** The
    two checker scripts now test that no single number clears three rounds of
    any closing game, by taking the three round classes' tolerance bands and
    requiring an empty intersection. It caught three games that could deal the
    same round twice.

- **Kinship and 1 − Ho/He are two different numbers and must not be presented as
  one (2026-09-17).** An early build of Lesson 11 Stage C claimed the kinship
  recursion down a pedigree and the two-tone count were two routes to the same
  quantity. They are not. Kinship rises under drift alone. `1 − Ho/He` compares
  this generation's two-tone birds against *this generation's own* frequencies,
  which have already drifted, so under random mating it sits at zero however
  small the pond is — measured at 0.228 against −0.074 in a pond of 40 over 20
  generations. `check_lesson11_numbers.js` caught it and now pins them to
  parting company in the direction the stage claims.

- **Lesson 9 built as one machine run three times (2026-09-10).** New lesson between
  L8 and L9, on JM's ask for a genetics interactive where students drag chromosomes out of
  a cell to make gametes. It resolves the open ruling the atlas recorded when Mendel's
  ratios were pulled out of the old Lesson 8: the ratios come back, built by hand, right
  before Hardy–Weinberg writes them down. Four things worth keeping for the next build of
  this shape:
  - **Where a lesson repeats itself, build the repeat from one function and a config.**
    A/B/C are `buildLab(K, STAGES[K])` with identical markup and identical handlers; the
    only differences are which spots carry a letter and whether a crossover exists. Three
    hand-written copies of a three-step bench would have drifted apart by the second edit,
    and the pedagogy depends on the passes being *the same* machine.
  - **A free-choice interaction can still enforce a result.** The drag rule is only "one
    long and one short per gamete", so the student's filling is genuinely their own — and
    every legal filling still yields 2 big : 2 little. Segregation is not asserted anywhere
    on the page; it is the only thing the bench can produce. Stage A's first question
    ("fill them so as many as possible carry big A") exists to make the student try to
    break it.
  - **Verify the model out of the shipped file, not from a reimplementation.** `meiosis`
    and `oneGamete` were sliced out of the HTML into a module and run 400,000 times per
    cell before any bar was calibrated. That is what confirmed Stage C's answer (44) is
    independent of which gap the student drops the rip into — had it not been, the question
    would have been unanswerable.
  - **Gate on the doing, not on a question about the doing.** JM replaced Stage B's
    written question ("how many versions have you seen?") with a harder unlock: step 2
    opens only on a round where all four kinds of gamete come out at once. Dealing the
    chromatids in the order they sit in yields two, so clearing it takes deliberately
    crossing a long copy with each short one — the exact move the stage exists to teach,
    and one the question could be answered without ever making. The stage now records
    five bits instead of six, which is the right trade.
  - **A control the student earns is better than a control you explain.** The bulk draw
    buttons do not exist on the page until five have been drawn one at a time, in every
    step that has them, and nothing says why. Same instinct as the gate above: make the
    slow path the only path until it has been walked.
  - **Draw the mechanism where the textbook draws it.** The rip first swapped chromatids
    0 and 2 — the outer two as rendered — which is statistically identical and reads
    wrong: the mark lands on an untouched chromatid and the crossing appears to skip a
    strand. Joining the inner two (1 and 2) puts the chiasma in the clear space between
    the pair it actually joined. JM caught this from the rendered letters alone.
  - **Constraining a control can restore answer keys that freedom broke.** Letting one
    mark go on either chromosome cost Stage C two fixed answers and forced the third to
    compute its target from page state. JM's next ask — force a cut on *both* chromosomes,
    with a slider for how many per chromosome — undid all of that: the long chromosome is
    always cut, so the questions can name it again, and because every crossover on a
    chromosome joins the same two chromatids, an intact ABCD survives on exactly one
    chromatid in four however many marks go down. All three targets went back to constants
    and the state-dependent target came out. Worth remembering that more mechanism is not
    automatically more special-casing.
  - **Hold the record, not the effect.** The rip was first applied by mutating the
    chromatids and undone by re-applying the same swap. That works for one mark and cannot
    survive lifting the second of three. The fix was to keep `st.xos` as the only truth and
    rebuild the chromatids from it on every change.
  - **An exploration control need not move a scored number.** The crossovers-per-chromosome
    slider leaves all three Stage C answers and the AA/Aa/aa bars exactly where they were —
    that invariance is the stage's point. §5's "a slider must be identifiable" test was
    written for sliders a student *fits*, and does not apply; the effect is visible in the
    products instead. Recorded so a later pass does not read it as a flat-slider defect.
  - **When a control gains a degree of freedom, re-audit every answer key it touches.**
    Letting the mark go on either chromosome broke two of Stage C's three questions: both
    named "the long version", and a rip on the short chromosome leaves the long one in the
    two versions it always had. Two were reworded to hold either way; the third has its
    target computed from where the mark sits (44 after a long rip, 75 after a short one),
    with the verdict naming which — both answers teach something. The novelty flag in the
    gamete table had the same bug and reported a short-chromosome rip as having produced
    nothing.
  - **Don't paint the discovery.** The round log first marked recombinant gametes in red;
    that is the observation Stage C's first question asks the student to make, so the
    colour was removed from the log and kept only in the summary tables, where the student
    is already quantifying something they have seen.

- **Lesson 7 Stage A rebuilt as a five-year "be a bird" lottery (2026-09-06).** Replaced the
  prisoner's-dilemma vignette (two sliders, a hard/soft dropdown, a four-cell table) on JM's
  request for something simpler: one slider picks a beak depth against three stacked panels
  (that year's real flock, expected chicks, survival chance), **Lock in this bird** draws a
  real outcome, and the flock evolves under its own selection each year rather than being
  redrawn. Full detail in `docs/LESSON_ATLAS.md`'s Lesson 7 entry. Two points worth keeping
  for the next similar build:
  - **When a mini-game needs "random but realistic" input, bootstrap the real record rather
    than inventing a distribution.** A first pass drew rain from `300*rng()*rng()` (mean 75)
    instead of sampling from the page's own 45-year `GRAIN` record (mean ~148) — half as wet
    as reality — and "always follow the deepest beak" won almost every run regardless of
    that year's conditions, reproducing the exact "beak that simply pays" failure this
    lesson already rejected once for its main model (see the Lesson 7 atlas entry, "Three
    models were prototyped and rejected"). Swapping in a bootstrap from `GRAIN` fixed it.
  - **Calibrate a threshold by simulating policies, not by picking a number.** Before
    hardcoding the "11 chicks over five years" bar, a throwaway Monte Carlo
    (`scratchpad/calibrate_l7a.mjs`, deleted after use) compared a policy that reads the
    expected-chicks panel each year (95.5% clear rate, mean 12.18) against naive heuristics
    that ignore it (best of them 69.3%, worst 33%) — the same exhaustive-sweep discipline
    used for every other bar in this lesson (§4, "A slider must be identifiable").

- **Lesson 6 Stage A's fourth target reworked twice in one sitting (2026-09-06).** "Finish at
  exactly 200" (genuinely impossible on a thousandths slider — closest is 201) used to
  require an explicit **Lock in** on a pair the student already knows is wrong, which is not
  a thing a student will ever choose to do — in practice, no win condition at all. First pass
  widened the target to a real window (195–205); JM's actual preference, on reflection, was
  to keep the impossible-target framing but fix *how* it resolves: it now counts silently off
  the two sliders themselves (a transition onto 201, so one sweep counts once, not once per
  redraw) and pops up an explanatory box after ten such landings, with neither the count nor
  the target of ten ever shown on the page. Worth remembering as a pattern: **a target the
  student is meant to be surprised by cannot be gated behind an action that telegraphs it's
  wrong before they take it** — the fix is to make the mechanic passive, not to lower the bar.

- **A target is claimed by committing, not by passing through it (2026-09-04).** Any
  stage whose tasks are checked inside the redraw can be beaten by sweeping a slider:
  the handler fires at every step, so one drag across the range trips every target on
  the way. Lesson 6 stage A and Lesson 8 stage A both had this — a single sweep of one
  knob opened the next stage. Both now have a **Lock in this pair** button and a panel
  recording what was locked and what it won, which is the rule Lessons 3 and 4 already
  used. Verified by sweeping the full range and claiming nothing.
  **Check this whenever a stage's gate reads state rather than an event.**

- **A slider must be identifiable, not merely present (2026-09-06).** Lesson 7 shipped with
  three separate versions of the same defect and none of them was visible by opening the
  page. Its heritability slider — the lesson's declared focus — did nothing at all: every
  value from 0.00 to 1.00 fitted the record equally well and cleared every bar, because
  offspring were centred on the post-selection mean, so the response was complete whatever
  the slider said. Its soft-crop slider did nothing for two students in three, because the
  default sat close enough to the truth that the next bar was already cleared when the piece
  arrived. And its `worth` slider was signed against its own label, so every model a student
  fitted read with the wrong sign.

  **The check, and it is cheap:** for each slider, sweep it across its whole range with
  everything else at a plausible fit and print the scored quantity. Three failure shapes,
  all of which lesson 7 had:
  1. *flat* — the score does not move, so the control is decoration;
  2. *already there* — the bar is cleared at the slider's opening value, so the step
     completes itself and the student never touches it;
  3. *inverted* — the score moves the right amount in the direction opposite to the label.

  Do this before calibrating bars, because fixing any of the three changes the model and
  every bar has to be re-derived afterwards anyway. `check_lessons.py` cannot see any of
  it — it checks structure, and all three of these are structurally perfect.

- **A model fix means regenerating synthetic data (2026-09-06).** Where a lesson's record
  was generated from its own model, correcting the model invalidates the record: the truth
  is no longer recoverable and the bars no longer mean what they measured. Lesson 7's
  correction forced a full regeneration, a redesign of one stretch of the rainfall, and a
  re-derivation of all six gates. Budget for that, or the fix ships as a lesson nobody can
  solve. Bump `version` when it lands — the answer keys have moved.

- **The information through-line, added 2026-09-03.** Lessons 1–4 were already
  measuring one idea in four currencies — L1's average error in cm, L2's calls right
  against expected right, L3's average miss in kg, L4's R² — without anything saying
  they were the same quantity. They now say it. **Nothing scored changed**: lessons 1–4
  are released, so every edit is a readout or a sentence, and no `version`, `scaffold`,
  gate or answer key was touched.
  - L3 is the spine, because it is already the ladder. Stage A prints the typical miss
    (16.43 kg — what knowing nothing costs), stage B prints it again against that
    baseline and says what the group label bought: **15.44 against 16.28, so 5%**. The
    baseline is the best a single number can do, which for absolute error is the median.
  - L8 stage A closes it with a live readout of what a correlation is worth on one
    person: `1 − sqrt(1 − r²)`. Measured on the page: r = 0.00 → 0%, r = 0.61 → 21%,
    r = 0.75 → 34%.
- **The factor-of-five trap this exists to defuse.** Three numbers all get called "how
  much it helps", and students will read the first as the third: the correlation
  (0.36 for Galton parent–child), the variance explained (0.13), and the reduction in a
  typical miss (**6.7%**). A strong heritability makes a guess about one person about
  7% less wrong. Say that out loud wherever the frame is used.

- **`JSMitchell` in the name box opens every stage.** Added 2026-09-03, in
  `app/assets/score.js`, so it works on all 29 lessons and every scaffold without
  touching them. Confirming as `JSMitchell` (or `JS Mitchell`) sets `state.bypass`,
  strips `.stage-locked` off every `section.stage`, unlocks the table of contents,
  and fires a `score:bypass` event on `document`. Lessons 5 and 6 listen for it and
  also undo the gates that live *inside* a stage — L5 stage B's second pair of
  sliders, L6 stage E's wolf panel — plus reveal every closing question; a lesson
  that does not listen still gets all its sections open, which is the point.
  `Score.isBypass()` reports it. It also flips every `.open` flag it can find on a
  page-level `Gates` object, because a visible section is not the same as an open gate:
  lessons 3 and 4 refuse to score a stage whose flag is shut, so before that fix the
  instructor could reach lesson 3 stage E and be unable to solve it. **Why it needs no protection:** the submission code
  is built from whatever name was typed, so a bypassed run emits a code whose token
  decodes as `jsmitchell`. Verified. A student who learns the name gains a code they
  cannot hand in. The status line under the box says "Confirmed — every stage open."
  so it is never on by accident.
- **The typical miss, `10^mean(|log10(model/observed)|)`.** Lesson 6's single score,
  across all five stages: the factor the model is usually out by, so 2.0 reads as
  "typically double or half". Chosen over R² because the same number then works for a
  sandbox with no data, a 37-year forward run, and a 42-year one, and because the
  gates become directly comparable across stages. Note it is computed over **every**
  year including the first, where the model is seeded from the observation and
  contributes zero — so it runs slightly lower than the same quantity computed over
  transitions only.

- **Covariance/Price naming lives in the code panel, not prose.** An earlier pass
  named `cov(x,y)/var(x)` in the closers of lessons 3/13/16/18. The ratchet reserves
  "the identity" for unit 38. Reconciled by keeping the thread as *the recurring
  slope you keep fitting* and removing premature naming from prose. Reverting is
  one line per lesson, and the checker will flag it.
- **Front matter cut, anchor quotes kept.** The rule applied everywhere during the
  July overhaul.
- **Lesson 7's transfer dataset is Galton** — canonical, which is a feature for a
  scaffolded real-data stage and weak as the unscaffolded measurement (Pass D).
  Bighorn pedigree and salamander morphology are in `data/clean/` if a true
  transfer set is wanted.
- **Lesson 12's Florida Scrub Jay curve is nearly flat, and that is the point.**
  The observed points sit inside the constant-size envelope, so the richer
  bottleneck model is overfitting. This is the intended reveal and a direct
  enactment of "high P-value: I don't know if my model was bad." Not a data bug.
  Do not "fix" it.
- **Submission codes.** `score.js` turns a name into a stable passcode and packs
  per-question bits, elapsed time and per-stage engagement into one opaque
  tamper-evident code. Rotate `Score.DEFAULT_SALT` and bump module `version` to
  invalidate a class's codes.
- **Every page seeds itself at random, per load.** Lessons used to ship
  `seed: 42`, so the whole class saw byte-identical "random" data — the same
  coin flips, the same drift walk, the same sampled thirty. Any answer read off
  the picture was shareable, and a result everyone sees identically is not a
  stochastic result. `sim.js` now draws one 32-bit `PAGE_SEED_BASE` per page
  load and derives every seed from it via `pageSeed(label)`, which is random
  across loads and *fixed within* one — so moving a slider redraws the same
  dataset instead of reshuffling it under a half-answered question. Stages with
  a seed slider need no per-lesson code: `randomizeSeedSliders()` sets the
  control and fires the `input` event the lesson already handles.
  `SEEDING_IN_PROGRESS` makes `Score.bumpManipulation` ignore those synthetic
  events, so engagement counts still measure the student.
- **Two datasets are drawn by rejection, not blind.** Lesson 6's cinema data and
  lesson 20's worms exist to display one specific reversal, and a scored
  question asks the student to read it off the screen. Measured over 20,000
  seeds the reversal survives 89% of draws in lesson 6 and 97% in lesson 20 — so
  seeding blind would hand about one student in nine a picture that does not
  show the thing they are being asked to see. `seedSatisfying()` draws at
  random, checks the property, and redraws if it is missing: ~1.16 draws on
  average, every student still getting their own dataset. If either generator is
  edited, re-check its predicate.
- **Cross-lesson navigation is gone.** Lessons are handed out one at a time, so
  the "Continue → Lesson N" buttons and "All lessons" links were removed from
  every lesson, scaffold and interactive. `index.html` still lists everything —
  it is the instructor's way in, not a path the student is meant to walk.
- **`app/decoder/`** is the paste-codes-get-a-CSV tool, sitting beside the older
  `instructor/aggregate.html` (which keeps a persistent roster and does item
  analysis). Both decode with `Score.decodeCode` and emit the same CSV columns
  as `scripts/decode_codes.py`, so their output stacks.

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
  (That section, and the rest of the long version, were struck 2026-09-17.)
  **Fixed** — it now points at `scripts/check_lessons.py`.
- `lesson35.html` Stage D calls back to a Lesson 1 framing that was never built.
- Stray literal markdown renders on the page in `lesson15.html`, `lesson23.html`,
  `lesson33.html`.
- Anolis ecomorph counting is built three times: lesson19 D, lesson25 D, s19.
- `docs/LESSON_ATLAS.md` claims to describe every lesson and omits all 24 scaffolds
  and the Descent explorer.
- **Eight lessons score a single bit.** `lesson21`–`lesson26`, `lesson31` and
  `lesson35` each declare `scaffold: 1` and record one checkpoint. Their codes
  decode correctly, but one bit per student is a coin flip: not enough to grade a
  student on, and not enough for the item analysis to say anything about the
  lesson. 22–26 still carry three TODO stages each, so this is expected there;
  `lesson21`, `lesson31` and `lesson35` are built out and still score once. Adding
  checkpoints is lesson-design work, not wiring — the slots have to attach to
  predictions worth scoring.
- **`index.html` undersells the back half.** Its last two groups are still
  captioned
  "outlines (text ready, simulators pending)". `lesson21` (5 canvases, no TODOs),
  `lesson27`, `lesson31`, `lesson32` and `lesson35` are built; only 22–26 still
  match the caption.
- `s01`–`s20` score the bookends only (`scaffold: 0`); the five rounds carry no
  answer bits. **Partly addressed 2026-08-25** — each round now bumps an `R`
  engagement count and each control move a `G`, so a code shows how much of the
  drill was actually worked. Whether the round guesses should also be *scored* is
  still open; the bookend pattern was a deliberate choice.

---

## 7. Retired directives — rules that were live and are now void

These contradicted the goals in §1 or the live rules in §4. Recorded so they do not
get reintroduced by someone reading an old file.

### Retired 2026-09-17, when `structurephilosophy.md` was rewritten

These were live until that day. Every one of them is written down somewhere in
this repo in confident, binding-sounding prose, which is why they are listed.

**The 47-unit sequence, the five arcs, and the per-arc minute budgets.** **Void.**
There is no fixed unit sequence. The lesson file numbers are the sequence. Unit
ids (`L7`, `L16a`, `S-weld`, `C1`) name nothing. The "forty-seven units at fifteen
to thirty minutes is roughly fifteen hours" cost argument and the
`arc_budgets_minutes` enforcement it justified are both gone. See §3.

**The six stage roles — orient, predict, act, rebuild, real, break.** **Void as a
required shape.** Organization is free to vary. The long-standing "both
vocabularies are in circulation, needs a ruling" flag is closed by this, in JM's
favour: the shipped lessons win, and their A–E lettering is lettering, not roles.

**"Read, then predict, then touch" / the prediction gate.** **Void.** Superseded
2026-09-01 by gate-on-solving and never removed from this file until now. Any
document still describing a lesson as locking controls until a prediction is
recorded is describing the old shape — `README.md` said this until 2026-09-17.

**The 20-name term budget, `min_prior_runs_before_naming: 3`, and per-term
`unlock` ids.** **Void**, and now physically absent from `ledger.json`. The rule
they implemented — a term becomes available at its unit — is replaced by a
stricter one: no vocabulary is taught at all. §4.

**The naming-after-the-fact panel (the `s19` "what you just did has a name"
pattern).** **Void.** It was the last legal way to name a term and it is not legal
any more.

**The three threads — A the slope, B the ledger, C the discipline — as the frame
to appraise and plan against.** **Retired as a frame**, not as content. The moves
are still real and still recur; the soundboard processes are the conceptual goal
and model structure is the implementation (§1). Do not write "this piece serves no
thread" as a criticism, and do not plan an arc to fill a thread. §9 keeps the old
table as an inventory of what each piece does, with that caveat.

**"The break names the forward unit that handles it, by index."** **Void as
stated** — there are no indices. The habit survives; see §4.

### Retired earlier

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

**"~30 minutes per lesson, 30 lessons."** From `lesson_plan_30.md`. **Void**, but
so is the 47-unit-with-per-arc-budgets scheme that superseded it. There is no
per-lesson or per-arc time budget of any kind right now.

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
| `notes/lesson_plan_30.md` | 30-lesson plan; superseded by the 47-unit sequence, which is itself void (§7) |
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

## 9. Piece inventory — the one line each piece exists to produce

**This is an inventory, not a standard.** The three threads it is keyed to were
retired as the planning frame on 2026-09-17 (§7). The letters are left in because
re-deriving them costs more than they cost to ignore, and because they are an
accurate description of what the shipped pieces happen to do: **A** = the slope,
**B** = inherited or invented, **C** = a pattern is not its own explanation.

**Do not plan against this table.** A piece that carries no letter is not
deficient, an arc of them is not a warning, and "Thread B is thin" is no longer a
reason to build anything. Plan against §1: which soundboard process does this
serve, or which later activity is it building the capacity for.

**Everything at lesson 12 and above in this table is a nebulous draft.** The
one-line descriptions there say what the file currently contains, not what the
course intends. The final paragraph of this section, which reasons about thread
coverage across the sequence, is kept as a record of how the project used to be
appraised and should not be acted on.

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
| | L20 | C | the rate you measure depends on the window; real fossils say the trait is going nowhere |
| L21 | **B** | how often something arises is set by how many ways in there are |
| L22 | C | a ratio between two kinds of change measures what has been sifting them |
| L23 | — | incompatibilities count pairs, so they outrun the changes that cause them |
| L24 | **B** | one tree, three deals, the same two species — only the rest of the tree separates the histories |
| L25 | — | the call is a claim about what happens next, tested by running it forward |
| | S24 | C | when two methods agreeing is evidence and when it is not |
| | L26 | **A** | the change in the average *is* the slope. Stages A/B/C/E built on one two-level engine; stage D still a spec |
| | L30 | **A** | the same ratio at cell→individual; gated and scored |
| L31 | **A** | the same engine at individual→superorganism; what two workers share sets how much colonies differ |
| | L34 | **A**, **B**, C | the cascade side by side, then above the individual and off DNA |

**What this table showed, under the retired frame** (kept as a record, not as a
to-do): Thread A ran unbroken from L3 to L26 with two welds carrying the student's
own numbers; Thread C was dense early and got its survivorship leg at S27; Thread
B was thin — L7, S26, L18, L19, S13, S15, S19 — with everything except S26
arriving late, in tree territory. The one item worth keeping out of that is a
content gap rather than a coverage score: **the early, biology-free statement of
inherited-or-invented is still owed**, and "transmissible characteristics" is
clause (3) of the definition in §1, so it has a live reason to exist.

**Placement note on S26.** It poses the dichotomy before any tree is on screen
(the first question is answerable only with "you cannot tell from the two of them
alone"), and then introduces the tree as the instrument that settles it. That
makes it usable either as a motivation *for* L18 or as a consolidation *after* it.
It currently sits with the Arc 3 tree lessons on the index. Moving it earlier is a
curricular call, not a build one.
