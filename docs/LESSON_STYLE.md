# Lesson style — a baseline, not a template

Read off lessons 1–10 as they actually ship. Almost nothing here is a rule.
`structurephilosophy.md` is the one document above this one; everything else is
this. Together they are the whole of the pedagogy, and **the shipped lessons
outrank both** — where a lesson JM has approved disagrees with a line here, the
lesson is right and the line is stale.

This is the *feel*: what makes a new lesson on a process nobody has built yet
still read as the eleventh of these rather than the first of something else.

Measured numbers appear throughout. They are calibration, not budgets.

---

## 1. What a lesson is

One process from the soundboard, or one capacity a later lesson will need. The
student manipulates a model and reads a display; **the display is the argument
and the prose is thin.** A lesson justifies itself by naming which process it
serves or which later activity it is building toward — never by covering a
lecture topic.

Three to five stages. A stage is however much apparatus one idea needs.

---

## 2. The furniture

Identical across all ten, and that is most of why they feel like one course.
Copy it rather than reinventing it: header, sticky letter nav, `lock.js`,
`quiz.js`, `sim.js`, `score.js`, the name prompt, the stage sections, the
completion-code panel. The palette is byte-identical in every file — off-white
ground `#fafaf7`, ink `#1d1d1b`, red accent `#b23a48`, blue second accent
`#2f6b8f`. Do not introduce a new one.

A stage is two columns: the plots on the left at roughly 1.4 parts, the
controls and the task list on the right at 1, collapsing to one column on a
narrow screen. Everything is `<canvas>`; there are no chart libraries and no
images.

Every stage carries, in order:

    a voice block          JM's own words
    a setup list           what is on screen
    the plots              the argument
    an R code panel        the same model, as code
    the controls           what you can move
    a task list            what opens the next stage
    a solved banner        the conclusion, held back until it is earned

Drop one when a stage genuinely has no use for it. Do not add a sixth kind of
panel without a reason you could say out loud.

---

## 3. Voice and text budget

The voice block is **JM's lecture prose, spliced** — quoted from the corpus or
dictated. It is not written in his style by someone else; it is his sentences,
trimmed. Source ids go in an HTML comment above the block.

Measured: 338–1135 words of voice per lesson, 85–230 per stage. Setup bullets
95–567 per lesson. Task lists 40–237.

The voice says why the question is worth asking and what the stakes are. It
never explains the graph, never defines a term, and never tells the student what
they are about to discover. **The conclusion is held back for the solved
banner** and appears only after the stage is beaten.

A quote has to be load-bearing for the stage it sits on — keyword-matched
decoration is worse than no quote — and nothing is glossed inside it. If a
quote needs a bracketed explanation to work, it is the wrong quote.

Panel and stage titles name the move, not the term.

Everything else on the page is bare: labels, one-line bullets, numbers. If you
find yourself writing a paragraph outside a voice block, the picture is doing
too little.

Never **land** or **knob** on screen (JM, 2026-09-23). Say hit, succeed, set,
slider, toggle.

---

## 4. The setup bullets

Almost always the same two openings, in this order:

1. **What is literally on screen** — the count, the unit, what the axes are.
   *"943 birds measured in one field season."* *"Across: year. Up: the average
   beak depth measured that year."* *"Each dot is an individual, coloured by its
   genotype."*
2. **What you can do and what to watch.** *"Those dots reproduce at random. Your
   job is to watch what they do."*

Then, at most three or four more: what the controls change, what they do *not*
change, and what is deliberately absent. The bullet that says *"nothing on this
screen knows which allele an individual is carrying"* is doing as much work as
any plot.

Never open with what the student will learn.

---

## 5. How a stage moves

Controls are live from the moment a stage opens. A stage opens the next one by
being **solved** — the student hits a target the interactive sets, not a
prediction they type. The task list is the contract and is visible from the
start; it is short, it is in the imperative, and its items are checkable by the
page.

The verbs that recur, as a menu:

    bring a number under a bar          "typical miss under 65 birds"
    get inside a window                 "between 45 and 55", "inside ±0.4 kg"
    hit a stated target                 "finish at exactly 200"
    find a configuration                "a population where the swap drops 0.60 to 0.25"
    draw an arrow, then use it          "with the rain arrow alone…"
    do it N times                       "three times over", "ten birds"
    commit an estimate and lock it in

**Repetition is a design tool.** One success is luck. Three to ten is a claim.
Where the system is stochastic, require several; where it is deterministic, one
is enough and more is padding.

**Nothing ever shuts a door.** A wrong answer is recorded once and the student
moves on. Gates are things you can retry forever.

**A ladder beats a bar.** The strongest stages hand over one more thing to
manipulate at each rung and ask for more with it — and take away the cheap route
that cleared the rung before. Guard against the ladder that can be walked with
the first rung's control alone; that has to be measured, not assumed.

**Two-sided targets beat floors.** A window punishes cranking a slider to its
stop exactly as hard as doing nothing, so aiming becomes the skill.

**Let something break.** Some control should accept a setting that makes the
model fall over, and the student should be able to watch it happen. An intuition
that never meets the case that breaks it has not been tested.

---

## 6. What a prediction is

A picture the student builds with the controls, not a number they type into a
sentence.

    the target is shown          a shape, a band, a stated pair of numbers
    the controls set it up       live, theirs
    they hit go                  the controls lock, the thing plays
    it reports back              correct / incorrect, and nothing else

Answer boxes say **correct** or **incorrect**. The evidence is the plot and the
result strip, not a paragraph. Where a finding matters, it belongs on the panel's
own readout, where it stays — not inside a verdict that scrolls past.

The prediction card itself is short and flat: a small table of what the student
is *given*, then the one or two things they are *claiming*, then a button. If it
reads as prose, it is wrong.

Two things worth stealing:

- **Ask for an error, not a confidence.** *How far off do you expect to be* is a
  quantity this course has already built (average error, typical miss). A
  percentage is a quantity it has not.
- **Score improvement silently where the question has no information in it.**
  Ten rounds, and the recorded bit is whether the last five beat the first five.
  Do not tell the student — a student who knows they are marked on improvement
  can manufacture it.

---

## 7. Interactive families

Not a list to conform to. A menu of what already exists, so a novel process can
inherit a feel rather than invent one.

- **The stream** — items arrive one at a time and a running statistic updates.
  Good for anything where the *accumulation* is the point.
- **The fitted line** — sliders are parameters; a miss statistic sits under the
  plot; the gate is a bar on the miss. The workhorse. Good for any deterministic
  model with a record to fit.
- **The sample fan** — many draws of the same process, each with its own
  estimate, so the spread is visible. Good for anything about uncertainty.
- **The model diagram** — boxes and dashed arrows. Draw an arrow and the number
  it pays for switches on; an arrow you have not drawn costs nothing and does
  nothing. The count of numbers in the model ends up on the page instead of in
  the text. `buildArrows` builds one; `paths.js` makes the arrow itself the
  slider on a graph the lesson has fixed.
- **The roll** — set it, play it, watch it, find out. The only honest way to
  show a stochastic process; a summary statistic cannot do it. **Every roll
  gets a practice switch** (JM, 2026-09-24: *"a default incorporation for all
  of the 'bowling' style activities"*): a ticked run plays against the same
  target and shows on the card, but is not scored and does not spend an
  attempt, and it still runs while a scored result waits for the next target.
  Lesson 11 has one on every stage.
- **The replicate panel** — twenty or a hundred of the same run side by side,
  with the distribution of endpoints revealed when it finishes. Turns "it
  varies" into a shape.
- **The direct manipulation** — drag the line, click the plot to mark a year,
  place the crossover, choose the gamete. Prefer this to a slider **whenever the
  thing being set is visible on the plot**, and check that what you are asking
  them to grab is bigger than a few pixels.
- **The role** — the student is an organism making a choice each round. Rare,
  expensive, and memorable.

A new process usually wants an old family with a new payload. Reach for a new
family only when none of these can carry it.

---

## 8. Numbers on screen

Under every plot, a line of `label: value` pairs in monospace — the running
statistic, the miss, the count, the thing the gate is about. That line is how a
student knows whether they are getting warmer, and it is checked far more often
than the prose is read.

**Every number is measured off the simulation, never asserted.** Where a closed
form exists, print it *beside* the measurement, never instead of it. If the two
stop agreeing, the formula is wrong and the page says so.

Colour a number against its bar so "not yet" and "there" are legible at a
glance.

---

## 9. Real data

Every abstraction lands on a named, real dataset, and the same ones recur:
seven thousand NHANES adults, forty years of Grant finches, the Isle Royale
moose and wolves, Galton's families, Buri's bottles, the long-term lines. The
recurrence is the point — a student who fitted the moose in one lesson and finds
a gene walking that same record three lessons later has been handed a
connection for free.

Real panels fail soft: if the file does not load, the panel is skipped and the
rest of the stage still counts.

When the data will not support the claim, say so and cut the panel rather than
building an envelope that teaches the opposite. Keep the story as framing if it
is worth telling.

---

## 10. The R panel

Every stage carries the model as real R, and the slider you touch highlights the
line it sets. Offer the file for download. Header it `# Lesson N, Stage X -- <one
line about what this is>`.

This is the one place technical names are legal — a variable has to be called
something. It is also the honest test of whether a stage has a model at all: if
you cannot write the panel in a dozen lines, the stage is doing several things.

---

## 11. Making a new lesson feel like the eleventh

Cohesion is built out of four things, in rough order of value:

1. **Reuse the engine.** The same generation operator, the same fitting loop,
   the same arrow widget with a different graph. A shared helper is worth more
   than a shared paragraph.
2. **Reuse the dataset.** Return to a record they have already fitted and ask a
   different question of it.
3. **Call it out.** *"You fitted this record in Lesson 6."* One sentence in a
   setup bullet does more for continuity than any amount of structural
   similarity.
4. **Carry a number forward.** A quantity the student produced in an earlier
   lesson, arriving as the starting condition of this one.

And foreshadow: leave the hook for the next process visible but inert — an arrow
declared and hidden, an argument defaulted to zero, a box nothing points at yet.
It costs one argument now and saves a rewrite later.

---

## 12. Building a new interactive, end to end

    name the process         which fader on the soundboard, or which later capacity
    find the target          what does a student have to DO to show they have it?
    pick the family          §7 — inherit a feel before inventing one
    build the smallest model that can miss
    measure the bars         sweep the controls; find what is reachable and what is not
    make it two-sided        a window, not a floor
    check the cheap route    can it be cleared by bottoming a slider? by one constant?
    splice the voice         JM's words, conclusion held back
    write the R panel        if it will not fit, the stage is two stages
    write the checks         see below

**Measure before you choose a number.** Every target, tolerance and bar in these
lessons was swept out of the simulator, not picked. A bar chosen by eye is
either unreachable or free, and you cannot tell which from reading the page.

---

## 13. What the checks are for

A stochastic lesson has bars that are invisible in the browser. Per target:

- it is **clearable** by a student doing the intended thing;
- it is **not clearable** by the naive answer — the headcount, "it never moves",
  "the advantage always wins", the plain average;
- no **constant** clears the closing rounds, and no single **setting** clears
  two different targets;
- the truth is inside its own band relative to the re-runs the student is shown;
- and where the page prints arithmetic beside a measurement, the two **agree**.

Drive the shipped page rather than a copy of its arithmetic. Re-derive the
numbers in the check rather than pasting them, so a bar that drifts gets caught
rather than enshrined.

A check that fails one run in twenty teaches nothing. Size tolerances off the
measured run-to-run spread, and say in the comment what that spread was.

---

## 14. Before you call it done

Two passes, both by eye, both cheap:

- **The cold novice.** Read every on-screen string as someone with no maths or
  statistics and one introductory biology course. Name every token they cannot
  parse. Each one is an edit.
- **The giveaway.** Hunt every sentence that states, hints or paraphrases the
  point. A sentence can hand the point over without reusing a single word of
  it; that is the one a word-list cannot catch.

Then run `python3 scripts/check_lessons.py` and the lesson's own bar checks.

---

## 15. The few things that are actually rules

Everything above is a suggestion. These four are not, and three of them are
JM's own words in `structurephilosophy.md`:

- **Text is extremely light**, with discovery happening through engagement with
  the data, models and diagrams.
- **Activities require interaction and interpretation of the display**, with
  direct manipulation wherever it is possible.
- **Vocabulary is not taught.** Jargon is avoided in prose where possible;
  where it is not possible, terms are restricted to biological ones an
  introductory student already has. *Where possible* is doing real work in that
  sentence — the approved lessons do say `mean`, `95% interval` and
  `heritability` where nothing else would serve, and that is the standard, not
  a defect waiting to be fixed.
- **Shared assets and reusable interactives are a primary design focus**, not an
  efficiency.

And one piece of local practice: **write the prep document before the first
edit** — `docs/overhauls/_TEMPLATE.md`.

Nothing else is binding. If a constraint is not in `structurephilosophy.md`,
not in this file, and not visible in lessons 1–10, it is not a rule — it is
somebody's old note, and it does not get a vote.
