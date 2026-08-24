# Structure and philosophy

These are practice instruments, and together they are a course — a single
sequence, taken in order, start to finish. Each one takes a single reasoning
move and drills it until the move is theirs. The subject matter is a delivery
vehicle. The move is the payload.

Everything below describes the reasoning, not the subject it happens to be
dressed in. That is deliberate: a student who can only run the move on the one
example it arrived in hasn't learned the move.

A student walks in with no background. The whole design has to earn its way from
there — not by promising to be gentle, but by building each unit so the first
thing on screen is something anyone can read, and every step after it is one
short reach from the step before. Scaffolding is not a tone. It is a shape, and
the shape is specified below so it can't quietly go missing.

## The sequence is the design

Unit 1 is where everybody starts. Unit *n* assumes units 1 through *n*−1 and
nothing else, ever. This is not a library to draw from and it is not a menu.
Three consequences, and everything downstream rests on them:

- **Every unit names the earlier unit it reuses.** Not "builds on" in the vague
  sense — it takes a specific artifact the student produced with their own hands
  and puts it back on screen. Unit 14 redraws the null pile from unit 7. If a
  unit can't name what it reuses, it is either misplaced or it is the start of a
  different course.
- **Vocabulary is a one-way ratchet.** A term is unavailable until the unit that
  names it, and available forever after. Because the order is fixed, "what words
  does this student have right now" is answerable exactly, by index — so every
  piece of on-screen text is checkable against that list. A term appearing before
  its unit is a build error, not a style question.
- **A gap is fatal, not inconvenient.** In a pick-and-choose library a rough jump
  costs one confused student. In a fixed sequence it costs everything after it.
  So where the ramp was steep I have inserted half-steps rather than trusting an
  instructor to bridge it live, and the extra units are the price of the sequence
  being real.

Cost, stated once and then not relitigated: forty-seven units at fifteen to
thirty minutes is roughly fifteen hours of homework in a course that is not a
statistics course. That is the bill. The mechanism for controlling it is the
`minutes` budget per arc, declared in `ledger.json` and enforced by the
validator — if an arc runs long, something in it gets cut or merged, and the gate
says so out loud rather than letting the load drift upward one unit at a time.

## What the activities are for

Seven goals, in rough order of how hard they are to hold onto.

1. **Intuition before vocabulary.** The win condition is that a student can look
   at a picture — a spread, a line, the effect of a slider — and say whether a
   change helped, without needing the name of a single thing on the screen. Names
   are cheap and they hide gaps. A student who can recite the name of a curve but
   can't tell you when its spread got wider has learned nothing I wanted.
   Operationally: a term may be named only after its move has been run in at
   least three prior units, and the whole course spends at most twenty names.
   Twenty is a hard budget. Most candidate terms don't make it.

2. **Read, then predict, then touch.** A student can't predict the effect of a
   control whose picture they can't yet read — and reading the picture *is* goal
   one. So each unit opens with the resting state on screen and the controls
   locked, and a single question that only asks the student to read what's there.
   Only then does it ask for a prediction, and only then does the one relevant
   control unlock. Orient, commit, test. Tinker-first, explain-after is how you
   talk yourself into having understood something you didn't — but predict-blind,
   before you can read the display, is how you learn to guess at random and call
   it thinking.

3. **The reasoning stays on screen and editable.** There is a code panel beside
   every simulation, and moving a slider lights up the line it changes. A slider
   is a named quantity you can edit, not a spell.

4. **One move, many datasets — and the last one is unscaffolded.** The same move
   runs across unrelated data, over and over, before anything new arrives. When
   the subject changes every round and the move doesn't, the move is what's left
   in memory. The final dataset in every unit is one the student hasn't seen, with
   the hand-holding removed: succeeding there, alone, is the only evidence the
   move transferred. Everything before it is practice; that last one is the
   measurement.

5. **The meaning is derived, not handed over.** The units are built so the student
   has to reach the point themselves. I don't print the takeaway at the bottom. A
   conclusion you assembled is one you can rebuild; a conclusion you were handed
   is one you can only recall. The sharp one-line version of each unit's point —
   *a resemblance is a slope*, *the baseline is the ruler* — is the answer key,
   not a caption. It never appears on screen, in any paraphrase. If the student
   can't say it in their own words by the end, the unit failed, and printing it
   wouldn't have fixed that.

6. **The data pushes back — and the break opens a door.** Every clean intuition
   has a case that breaks it, and the good version of a unit ends on that case:
   the uncounted third column, the sample that was filtered before you saw it, the
   baseline that was never exactly true. But the break is not a demolition. For a
   novice, "everything you just learned fails here" with nowhere to go breeds
   helplessness. The break has to reframe the intuition as a *special case* of
   something larger and point at the unit that handles it — by index, forward,
   always. In a fixed sequence that pointer is a promise the course can actually
   keep. The break is where the learning is because it is where the next question
   comes from.

7. **Analogy on tap, not on top.** The bias is toward intuition through analogy,
   but a frame handed to everyone is another takeaway handed over, and a frame
   handed to the student who didn't need it just gets in the way. So the analogy
   lives in a hint layer the student pulls when stuck — a jar of two bead colors,
   a board of pins the beads fall through, two editors revising the same page —
   and never in the spine. A stuck student reaches for it; a student who is flying
   never sees it. The analogy is a handhold, not the wall.

## How the units are built

Every unit, whatever its length, is the same six stages plus two persistent
layers. Not because uniformity is a virtue but because this shape is what makes
the scaffolding real instead of promised.

> **Open question, flagged 2026-08-24.** The shipped lessons use A/B/C/D/E stages
> that do not map cleanly onto these six roles, and both vocabularies are currently
> in circulation. Rule on it before the next build round — either map the roles onto
> the letters lesson by lesson, or retire the six-role names. See
> `docs/PROJECT_NOTES.md` §4 and `docs/WORK_ORDER.md` P0-5.

0. **Orient.** The resting state is on screen; every control locked. One question,
   and it only asks the student to read the picture: what is a dot, what does the
   axis mean, is this pile wide or narrow. No mechanism yet. Forty words maximum.
   This is the rung that makes the next prediction possible.
1. **Predict.** The student commits a guess about exactly one manipulation. The
   guess is recorded, because a prediction you can slink away from is not a
   prediction.
2. **Act.** That one control, and only that one, unlocks. The student moves it and
   watches the line it owns light up. The guess stays on screen to be confronted.
3. **Rebuild.** The student constructs the comparison or summary by hand — stacks
   the counts, draws the leftover, builds the null pile — rather than reading a
   verdict off the screen.
4. **Real data.** The same move on a real dataset with real mess in it.
5. **Break.** The case that violates the intuition — a nonsensical setting the
   model is *allowed* to accept so the student can watch it fall over (a spread of
   zero, a proportion above one, a founding batch of two), or a real case whose
   assumptions don't hold. It ends by naming the forward unit that handles it.

**The two persistent layers**, available at every stage: analogy on demand, and
the live editable code panel.

**Build rules.** The title names the move, never the term. Lead with the familiar
setting; the reasoning is the new thing in the room and the setting shouldn't be
new too. At least one stage accepts a nonsensical setting. The aphorism is the
answer key and is never on-screen text. Use the smallest shape that does the job —
some units are one move repeated with the narration stripped to nothing, some walk
the full arc, most sit between; length is chosen, not defaulted.

## The one thing underneath all of it

One split runs the length of the course, and most units are quietly a special case
of it. Written plainly: the change in an average comes apart into two pieces. The
first tracks how an outcome lines up with some measured quantity. The second is
the leftover scatter that lines up with nothing. The first is a slope. The second
is everything the slope missed.

Every fitted line is reading those two pieces. So is every "did this actually
move, or did it just wobble." So is every "is the gap between these groups bigger
than the gap inside them." The student manipulates the split for most of the
course with no name for it. The name arrives at unit 38, and it should land as
recognition — *that's the slope I've been fitting since unit 4* — rather than as
new material. Manipulate it everywhere; name it only at the finish.

Two cautions, so the recognition is honest rather than a magic trick:

- **The "leftover" is not always the same object.** In the early fitted-line units
  the leftover is *cross-sectional* scatter around the line — variation the slope
  didn't explain. In the identity at unit 38, the leftover is *within-lineage*
  change across a round — what each thing did after it was measured. These share a
  shape, not an identity. Engineer recognition of the shape. Do not let the build
  imply the residual around a line *is* the transmission term; that conflation
  makes the last arc mud. Unit 39 exists to pry them apart by nesting one inside
  the other explicitly.
- **The slope picks up a weighting along the way.** An ordinary best-fit slope
  weights every point the same. The slope in the final identity weights each point
  by how much it reproduces. That weighting cannot appear from nowhere at the end,
  so unit 22 is nothing but reweighting a scatter by copy-count and watching the
  slope move. By unit 38 the weighted slope is a reunion, not an introduction.

## The sequence

Forty-seven units. Each header gives `[position] id — requires — names — minutes`.
`names` is the term this unit unlocks, if any; `—` means it unlocks nothing, which
is most of them. `requires` lists only the units whose artifact is reused or whose
move is presupposed; every unit implicitly assumes all units before it.

### Arc 1 — Measuring spread, and the best single summary (1–13) · budget 245 min

- **[1] L1 — requires: none — names: — — 20 min.**
  Stack many small independent chance events and watch the running total settle
  into a bell. *Orient:* is the pile taller in the middle or at the edges?
  *Break:* one giant event among the small ones and the bell won't form.
  *Underneath:* when you know nothing else, the middle is the best single stand-in
  for the next value, and a center and a spread summarize the whole heap.
  *Analogy on tap:* beads dropped through a board of pins.
  *Aphorism (answer key):* two numbers hold a whole pile.

- **[2] L2 — requires: L1 — names: — — 20 min.**
  Measurements arrive one at a time. Watch the running average settle and its
  uncertainty shrink, then catch the moment the arrivals stop coming from the same
  source. *Rebuild:* resample the data already in hand and build the spread of
  where the average could have landed. *Break:* the source changes mid-stream and
  the settled average lurches. *Aphorism:* how sure you are is a spread you can
  build out of what you already hold.

- **[3] L3 — requires: L2 — names: — — 15 min.**
  *(inserted rung — the flat guess)* Before any line: the best flat guess and what
  it costs. Move a flat line up and down, watch the total miss shrink to a
  minimum, find the middle by hand without being told it is the middle. Makes
  "trade the flat guess for a sloped guess" one step instead of two.

- **[4] L4 — requires: L3 — names: — — 25 min.**
  Trade the best flat guess for a best sloped guess, subtract the fit, read the
  leftovers. *Rebuild:* the student draws the residuals themselves. What the line
  couldn't account for is the whole reason to look at the leftovers. First face of
  the split that ends the course. *Aphorism:* the line is the part that tracks; the
  leftover is everything else.

- **[5] L5 — requires: L4, L2 — names: — — 20 min.**
  A single "best" line is one draw from a cloud of nearly-as-good lines. Resample
  and watch the cloud form; its width is how unsure you should be about the slope.
  *Break:* three points — the cloud is so wide the slope means nothing.

- **[6] S-weld — requires: L1, L5 — names: — — 15 min.**
  The weld. A cloud of slopes and a pile of outcomes are the same picture seen
  twice. Five datasets, no new mechanism; the student flips between the two views
  until they stop being two things. Placed here because this is the first moment
  both halves exist.

- **[7] L6 — requires: L4, L1 — names: — — 20 min.**
  Scramble one column so any real link is destroyed, then count how often pure
  chance still throws up an effect as big as the one you started with. *Analogy on
  tap:* cut the labels off two decks and re-pair at random. *Aphorism:* "no
  relationship" is a spread of outcomes around zero, not the number zero.

- **[8] L7a — requires: L6 — names: — — 15 min.**
  *(inserted rung)* Hold the real difference fixed and move only the sample size.
  A verdict flips on data volume alone with nothing real having changed. Isolates
  the one variable the next unit asks the student to juggle three of.

- **[9] L7 — requires: L7a, L6 — names: — — 20 min.**
  Run one and the same procedure four ways and get four verdicts, changing only
  the sample size, the scatter inside each group, or exactly what you asked it to
  compare. *Aphorism:* the verdict can be driven by how much data you have rather
  than by how large the real difference is.

- **[10] S-single — requires: L7, L6 — names: — — 15 min.**
  What a single observed change licenses you to say out loud. Five datasets; the
  gap between "it moved" and "something moved it," drilled until the student stops
  overclaiming from one wobble. Placed after the verdict-flipping units because
  that is what makes the overclaim feel dangerous rather than pedantic.

- **[11] L8a — requires: L4 — names: — — 15 min.**
  *(inserted rung)* Two dots that came from the same parent are not two
  independent readings. Shown concretely, on its own, so the leap from "fit a line"
  to "fit a line through inherited pairs" is one step. Also seeds the
  non-independence problem that returns at unit 29.

- **[12] L8 — requires: L8a, L4, L5 — names: — — 25 min.**
  Pair each value with a second value made partly out of it, fit the line through
  the pairs, and read the slope as *how much of a source's departure from the
  middle carries into what is made from it.* *Break:* pairs measured in different
  settings, and the slope moves without anything being handed down. *Aphorism:* a
  resemblance is a slope.

- **[13] C1 — requires: Arc 1 — names: — — 15 min.**
  Checkpoint. No new move. One unseen dataset, no scaffolding, three of the arc's
  moves needed to get through it. If a student can't do this one, the sequence has
  already failed and the next arc will not repair it.

### Arc 2 — How proportions move when tokens get copied across rounds (14–20) · budget 145 min

- **[14] L9 — requires: L1, L6 — names: — — 20 min.**
  Each source hands down one of two tokens at random. Count how the combinations
  stack up, predict the ratio they should follow, test whether the observed counts
  sit close enough to pass as chance. *Orient:* which combination is most common,
  before any theory of why. Reuses the null pile from unit 7 directly.

- **[15] L10 — requires: L9 — names: — — 20 min.**
  Build the idealized baseline in which the proportions never move, then switch off
  its assumptions one at a time and watch each violation bend the counts.
  *Aphorism:* the baseline is never exactly true; it is the ruler everything else
  is measured against.

- **[16] L11 — requires: L10, L2 — names: — — 20 min.**
  Watch a proportion wander on nothing but the luck of copying a small batch each
  round, and see how often it wanders all the way to zero or one. *Analogy on tap:*
  scoop a handful of beads from a two-color jar to found the next jar; a small
  handful swings wildly. *Aphorism:* the strength of the wandering is set by the
  size of the batch alone, not by where the proportion currently sits.

- **[17] L12 — requires: L11, L2 — names: — — 25 min.**
  Read that same chance wandering backward out of a real time-series to recover the
  one number that sets how fast a small collection loses its internal differences.
  *Break:* a series too short to tell wandering from a trend — which is unit 10's
  overclaim wearing a new coat.

- **[18] L13 — requires: L11, L4 — names: — — 25 min.**
  Put a steady thumb on the scale so one token gains a little each round, and
  separate that pushed wandering from pure chance. Estimate the size of the push
  from how fast the proportion moved. *Aphorism:* a push is a slope against time.
  This is the second slope; unit 22 will weight it.

- **[19] L14 — requires: L13 — names: — — 20 min.**
  Find the standing level where a token that keeps getting removed is exactly
  refilled by one that keeps being reintroduced, then watch a clean formula for
  that balance fail on a case whose assumptions don't hold. *Break door:* what if
  the pool was never one pool? → unit 21.

- **[20] C2 — requires: Arc 2 — names: — — 15 min.**
  Checkpoint. Unseen time-series, unscaffolded: is this wandering, a push, or a
  balance?

### Arc 3 — How groups differ, mix, and get their structure (21–30) · budget 205 min

- **[21] L15 — requires: L10, L14 — names: — — 20 min.**
  Measure how far a pool falls short of the well-mixed combinations you would
  expect if it were one stirred group. *Analogy on tap:* two separate ponds versus
  one stirred pond. *Aphorism:* when the shortfall hits its ceiling you are not
  looking at one group, you are looking at two.

- **[22] L16a — requires: L4, L13 — names: — — 20 min.**
  *(inserted rung — the weighting)* Take a plain scatter and give each point a
  copy-count. Points that make more copies pull harder. Watch the fitted line swing
  as the weights move with the data itself untouched. Nothing about reproduction
  yet — just *a slope where some points count more than others.* This is the rung
  that makes unit 38 a reunion instead of a magic trick, and it is the single most
  load-bearing insertion in the sequence.

- **[23] L16 — requires: L16a, L8, L13 — names: — — 25 min.**
  How far a biased pick shifts the next round equals the source-to-successor slope
  from unit 12, times how hard you pushed — and *how hard you pushed* is itself a
  slope: the line relating how much a thing copies itself to what it carries. The
  student sets the weights and reads the shift. *Aphorism:* the response is the old
  slope wearing a new name, and the push is a slope too.

- **[24] L17 — requires: L15, L11 — names: — — 20 min.**
  Treat *where a thing came from* as itself a copied, handed-down attribute, so
  that exchange between groups is just another channel of copying. *Aphorism:* a
  little mixing erases most of the between-group difference even when the items
  themselves almost never move.

- **[25] S-cond — requires: L4, L17 — names: — — 20 min.**
  When holding something fixed helps and when it quietly hurts — a shared cause
  versus a shared effect. Five datasets; the same act cleans one picture and
  poisons the other, and the drill is telling which you are in before you do it.
  Placed here because units 26 and 29 both ask the student to hold something fixed
  and neither is safe without it.

- **[26] L18 — requires: L16, S-cond, L8 — names: — — 25 min.**
  When a costly help-others move can still spread, because the benefit lands mostly
  on others who tend to carry the same tendency. Flagged in the build notes as a
  first special case of the identity at unit 38 — in the notes, not on screen.

- **[27] L19 — requires: order only — names: — — 20 min.**
  Read a branching diagram without fooling yourself. *Orient, at length:* the
  left-to-right order of the tips carries no information; closeness is set by
  shared branch-points, not by who sits next to whom; "splits off earlier" does not
  mean "simpler." *Analogy on tap:* a family tree is hinged at every fork.

- **[28] L19a — requires: L19 — names: — — 15 min.**
  *(inserted rung)* Rotate the diagram at its hinges and watch the tip order
  scramble while every cousin-relationship holds. Makes the single hardest
  misreading — order means relatedness — a thing the student disproves by hand
  before the next unit asks them to act on it.

- **[29] L20 — requires: L19a, L8a, S-cond, L4 — names: — — 25 min.**
  Subtract shared history before comparing two columns, because items with a common
  origin are not independent readings. *Break, and it is the point:* a real
  relationship can flip its sign once shared structure is taken out. *Aphorism:*
  the end of the road for correlation manufactured by shared transmission.

- **[30] C3 — requires: Arc 3 — names: — — 15 min.**
  Checkpoint. Unseen paired columns with a tree attached: is the relationship real,
  or is it the tree?

### Arc 4 — How change piles up over long stretches (31–37) · budget 145 min

- **[31] L21 — requires: L11, L2 — names: — — 20 min.**
  Measure how fast something changes over windows of many different lengths and
  watch the apparent rate fall as the window grows, because back-and-forth
  wandering partly cancels over long spans. *Orient:* which window makes the change
  look fastest, before asking why.

- **[32] L22 — requires: L11, L13 — names: — — 20 min.**
  Why some features almost never change and others change constantly: the rate is
  set by how big a target chance has to hit and how costly a hit turns out to be.
  Give it a big cheap target and the same outcome arrives again and again, on its
  own each time.

- **[33] L23 — requires: L22, L13 — names: — — 20 min.**
  Read a bias off the ratio of two kinds of change — the ones that alter something
  that matters and the ones that don't. Below one, change is being weeded out;
  above one, favored. *Break:* the two kinds aren't cleanly separable and the ratio
  lies.

- **[34] L24 — requires: L21 — names: — — 20 min.**
  Incompatibilities between two steadily diverging copies pile up in pairs, not one
  at a time, so their count grows with the square of the time apart — a tally that
  falls on a straight line once plotted log against log. *Analogy on tap:* two
  editors independently revising the same page; clashes come from pairs of edits,
  not single ones.

- **[35] L25 — requires: L22, L19a — names: — — 25 min.**
  Tell three histories apart when they land on the same end state: independent
  arrival under the same pressure, arrival by pure chance, and a form simply kept
  from a shared origin. *Rebuild:* the student sorts simulated cases into the three
  before any labels are revealed.

- **[36] S-agree — requires: L25, S-single — names: — — 20 min.**
  When agreement between methods is worth trusting. Two methods that fail in
  *different* ways agreeing is evidence; two that fail the same way agreeing is
  not. Five datasets, and the drill is spotting which case you have. Placed
  immediately after the three-histories unit because that is where a student first
  has two methods that could agree.

- **[37] L26 — requires: L25, L15 — names: — — 20 min.**
  Treat "one kind or two?" as a claim about future independence rather than a fact
  to look up, and name the single observation that would flip the call. The many
  competing textbook definitions are just as many tests of that one claim. *(No C4:
  unit 47 is the checkpoint, and it is the whole course's.)*

### Arc 5 — How new units of accounting emerge from lower ones (38–47) · budget 220 min

- **[38] L27 — requires: L4, L16a, L16 — names: the identity — 30 min.**
  The master identity, stated at last. The change in an average comes apart into
  the piece that tracks how an outcome lines up with the measured quantity — the
  weighted slope built by hand at unit 22 and used at unit 23 — plus the leftover:
  within-lineage change, *not* the residual around a line. The orient question is
  pure recognition: *where have you fit this slope before?* Every prior unit that
  was secretly this gets named here, by index, and the student is asked to check
  the claim rather than accept it.

- **[39] L27b — requires: L27 — names: — — 25 min.**
  *(split out, because nesting is its own step)* The leftover term is itself the
  same identity one level down. Run it on a case where the two levels disagree in
  sign, so the nesting does work rather than being notation. This is also where the
  two meanings of "leftover" get pried apart; letting them stay fused is how the
  rest of the arc turns to mud.

- **[40] L28 — requires: L27b — names: — — 20 min.**
  A linked block acts as a single unit of account because nothing has yet broken it
  apart. *Aphorism:* the unit of bookkeeping is whatever the shuffling hasn't split
  yet.

- **[41] L29 — requires: L28, L27b — names: — — 20 min.**
  The whole set can override any single part, and the copying rules are themselves
  up for grabs, which means a part can game the rules and copy itself at the set's
  expense. *Break:* the part wins and the set falls apart — a rule with no
  enforcement.

- **[42] L30 — requires: L27b — names: — — 20 min.**
  The enclosing container can out-compete its own contents. Differential copying
  hides one level down, inside what looks like a single actor.

- **[43] L31 — requires: L30, L29 — names: — — 25 min.**
  How a crowd of competing lower units becomes one higher unit, once competition
  among them is held down and their fates are tied together. The canonical step-up,
  run with the same algebra as the level below.

- **[44] L32 — requires: L31 — names: — — 20 min.**
  The same step-up one scale larger. Independent actors give up copying on their
  own account, so the larger collective becomes the thing that copies.

- **[45] L33 — requires: L31, L26 — names: — — 20 min.**
  When the rate at which a group throws off new groups behaves as a handed-down
  attribute of the group itself, a bias can act at a level above the single actor.

- **[46] L34 — requires: L33, L27b — names: — — 20 min.**
  Run the same diagnostic on candidate units with no settled name — ideas that
  copy, composite collectives, self-copying structures — and apply the checklist
  that decides whether a thing counts as a unit of account at all.

- **[47] L35 — requires: everything — names: — — 20 min.**
  The synthesis. Seven step-ups laid side by side, all running the one identity,
  landing on the claim that a level counts as a unit because the accounting closes
  there, and not the other way round. The last orient question is the whole course:
  *point to where you first fit this, and to every place since.* Terminal
  checkpoint; no scaffolding anywhere in it.

## Enforcement

None of the above is self-enforcing, and a build agent working from prose will
produce something that reads compliant and isn't.

**The gate is `scripts/check_lessons.py`**, run against the shipped lesson HTML. It
applies the vocabulary ratchet at each lesson's true position in this sequence,
the giveaway-phrase ban, title-names-no-term, and the front/back-matter and
submission-wiring rules. A lesson that fails it does not ship.

The checks that need judgment rather than a regex — the four adversarial passes
(cold novice, licensing, giveaway, transfer) — are in `docs/PROJECT_NOTES.md` §4,
along with the rest of the live rules and the map from these unit ids to the
lesson files.

> **Historical note.** This section previously named `BUILD_CONTRACT.md` and
> `validate.py` as the enforcement layer, built around a `units/*.json` spec for
> each of the 47 units. Those specs were never written. Both files are retired to
> `_reference/retired/`; their durable content was folded into
> `docs/PROJECT_NOTES.md`. The sequence below is unaffected — it remains the
> design.
