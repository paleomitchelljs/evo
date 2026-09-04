# BIO 202 — Lesson Atlas

> **Stale as of 2026-08-24.** This atlas has not been regenerated since the Arc 5
> collapse and the scoring work. Known divergences from the repo:
>
> - **Arc 5 is now four lessons, not nine.** Lessons 27/28/29 folded into Lesson 26
>   stage D; 32/33 into Lesson 34 stage B; the five files are in
>   `_reference/retired/lessons/`. Sections below for those five describe files
>   that no longer ship.
> - **The checkpoint counts below are declarations, not scored questions.** Ten
>   lessons declared slots and recorded nothing until 2026-08-24. Current counts
>   live in each lesson's `Score.init`.
> - **It omits the 25 scaffolds and the Descent explorer**, which are shipped,
>   student-facing, and cover several gaps this document reports as empty.
> - **Lesson 15 stage B** now opens on the slope carried from Lesson 7, and
>   **Lesson 26 stage A** on the slopes carried from scaffold S25.
>
> `docs/PROJECT_NOTES.md` §2 is the accurate statement of what exists.
> Regenerate this file after the next content pass rather than patching it.

Every lesson as it currently stands, part by part. For each part: what the interactive
actually does, what intuition it is built to produce, and what it hands to the next part.

**How to read the status line.** `Built` means the stage has a working interactive and
scored checkpoints. `Skeleton` means the page has its title, its lecture quote, and a
build spec in an instructor-facing `TODO` block — but no interactive, and it scores zero.
Skeletons still emit a completion code on a button press.

**Scored checkpoints** are the bits packed into the student's submission code. A lesson
with 4 checkpoints records 4 right/wrong answers plus elapsed time and per-stage
interaction counts.

---

## Arc 1 — Where a prediction comes from, and what it costs to be wrong

Lessons 1–7. The through-line: you always predict *something*; the question is what you
are allowed to condition on, and how you would know if you were leaning.

---

### Lesson 1 — Adding up coin flips until a bell appears
`lesson1.html` · v10 · 6 checkpoints · **Built**

*Rebuilt from JM's voice notes, 2026-09-02.* Text throughout is his notes — patterns as
mental models, and statistics as the framework that says when the evidence is good enough
to overturn one. Three structural changes came with it. **The Pause is graded against the
student's own three rounds**, not against what a fair coin is supposed to do: three rounds
of 3, 6 and 4 make 4.33 the right answer and 5 a wrong one. It then hands them a button
that flips a hundred more rounds and asks again, where the answer lands near 5 — the small
sample and the large one giving different answers is the whole point, and the head-count
tally is the bell of the lesson's title appearing. **Stage B runs in rounds of ten**,
anchored on being told only that JM is 198 cm: the first round comes back 10 over, 0 under,
off by ~24 cm, and the stage is cleared by bringing a round back balanced — over about as
often as under, and by about as much. Every person drawn stays on the plot, because they
are what the next prediction is for.

*Pause graphs and a layout fix, same day.* The Pause carries two histograms of head count
— three rounds on a 0–3 axis, then all hundred and three — with the average printed under
each, so the question tests whether a student recognises that the balancing number *is* the
average rather than whether they can divide. **Across lessons 1–4 the framing text now spans
the page** instead of sitting in the left column: a 568 px intro in lesson 4 stage A had been
pushing the canvas 397 px below the knobs that drive it, which no viewport could hold. The
controls panel is also first in its column, so every stage now opens its graph and its
controls 29 px apart.

*Converted 2026-09-02* to the same shape as lessons 3 and 4: no titles (bare-letter
stage headings and table of contents), no prediction gate, controls live from the
start, one numeric question per closing point with instant right/wrong scored on the
first attempt only, and voice blocks spliced from the lecture corpus over bulleted
setups. Stage A used to lock the flip button behind a guess at the head count and
score three bits on whether that guess was exact — a one-in-four coin toss recorded
as knowledge; it now opens the Pause by being done. The Pause's two questions became
one numeric; stage B's "taller or shorter?" panel is gone; stage C's closing
multiple-choice became "how far would the number have to move", graded against the
student's own run. Voice: 202_lec10_01 on A, 202_lec24_01 on B, 202_lec10_02 on C.

*The move:* one number, used every time, and the two directions you can be wrong in.

- **A — Flip a coin ten times. Three rounds.**
  - *Interactive* — A dropdown commits how many heads you expect (0–10), which unlocks a
    Flip button. Ten single flips land in a strip; the round is scored ✓ only on an exact
    match. Three rounds, each recorded in a tally.
  - *Goal* — Feel that a sharp prediction is almost always wrong in a specific direction,
    and that "wrong" has a sign, not just a size.
  - *Hands to* — the three rounds are the raw material the Pause reads back.

- **Pause**
  - *Interactive* — A table of the three rounds with a `You were` column reading `3 above`
    / `2 below` / `exact`. Two questions: which side you landed on more often (graded
    against the student's own three rounds, not a fixed key), and which single number
    would leave you above as often as below.
  - *Goal* — The central claim of the course's first arc: a normal spread is what you get
    when you are equally likely to miss high and miss low. Balance, not accuracy.
  - *Hands to* — Stage B, where the same balance test runs on a continuous measurement.

- **B — Expect a person's height**
  - *Interactive* — Type one height, then draw 30 real adults one at a time. Running
    counts of taller/shorter and the average miss. Land inside ±1.75 cm and the Draw
    button becomes `Good enough ✓`; miss and it becomes `Try again`, gated behind one
    question — were people generally taller or shorter than your expectation.
  - *Goal* — Hunting for the number that has no lean, by reading the direction of your
    misses rather than their size.
  - *Hands to* — Stage C keeps that number. **The pool is male heights; nothing says so.**

- **C — Expect a person's height — again!**
  - *Interactive* — The number from B carries over, locked. Thirty new people are drawn —
    silently, from the female pool. Both batches plot together, first thirty in grey,
    these thirty in red, with the student's number as a vertical line. Typical outcome:
    29 of 30 shorter, average miss +14.5 cm.
  - *Goal* — A number that had no lean now leans hard in one direction. That one-sided
    miss is the signal that something about the population changed.
  - *Hands to* — Lesson 2, which makes detecting that change the whole task.

---

### Lesson 2 — Resampling to ask if new data still belongs
`lesson2.html` · v9 · 8 checkpoints · **Built**

*Rebuilt from JM's voice notes, 2026-09-02.* Text throughout is his notes: A and B follow
the mean as data accumulates and then as the population changes underneath it; C, D and E
are the same calling drill at three sizes of real difference — NBA players against ordinary
adults, males against females, home fans against away fans. Stage E gains a second closing
question (95% right means 5% wrong) after the first, with the framing paragraph that names
all three gaps as real and puts the difficulty on their size. Answering the second in
proportion rather than percentage counts, and the verdict names the unit.

*Converted 2026-09-02*, same treatment. (This row previously read v4 · 7, which was
already wrong for the shipped file — it was v7 · 9.) The four prediction bits are gone
with the panels that held them. Stages C, D and E no longer make the student submit a
guess at their own hit rate before the drill will start — the calls are the stage, and
every drill opens as soon as its people have loaded. The closing comparison and the
19-out-of-20 question became numeric; the "does 75% mean no difference" question was
dropped and its reveal moved onto the end of stage E, where it now fires whichever way
the numeric went. Voice: 461_lec07_09 on A, 202_lec10_02 on B, 145_lec01_08 on D,
202_lec07_06 on E; C carries bullets only.

*The move:* a running average settles, then leaves — and telling two crowds apart by eye
has a ceiling set by how much they overlap.

- **A — Measuring people entering a restaurant**
  - *Interactive* — Measure adults in batches of ten. Blue running-average line plus a
    resampled uncertainty band. Two predictions committed first: what the running average
    does as n grows, and what the band does. Gate: 60 people.
  - *Goal* — The average steadies and the band narrows fast then slowly. Establishes what
    "normal" looks like so a departure is legible later.
  - *Hands to* — Stage B, same stream, now with something hidden in it.

- **B — A bus pulls up**
  - *Interactive* — Same stream; partway through, a busload of much taller people starts
    entering. A faint red line marks where the average sat before. Once the band lifts
    entirely clear of the old level, an orange marker appears on the plot at the true
    switch point. **No banner, no text announcement — the marker is the whole reveal.**
    Two predictions: whether the bus will match the earlier crowd, and how you would
    recognise it if it didn't.
  - *Goal* — A busload is a group that arrived together — not a fresh draw from the same
    crowd. The tell is the average leaving where it was sitting.
  - *Hands to* — Stages C and D, which ask how well you can do this one person at a time.

- **C — Player or not?**
  - *Interactive* — Both full distributions on screen the whole time (professional players
    and a stadium of ordinary adults, each scaled to its own size). One person steps up as
    a black vertical line; you call `Player` or `Not a player`; the line is replaced by a
    ✓ or ✗ that **stays put at that height**. 24 rounds. You first commit how many of the
    24 you expect to get right.
  - *Goal* — Accumulated marks make the overlap zone visible: the errors pile up in the
    middle, not at the edges. Best possible here is 94%.
  - *Hands to* — Stage D runs the identical drill on a harder pair.

- **D — Man or woman?**
  - *Interactive* — Same machinery, same 24 rounds, on the two adult height groups from
    Lesson 1. Best possible here is 83%.
  - *Goal* — Same eye, same effort, worse score — because the two crowds sit closer
    together relative to their spread. Separability is a property of the data.
  - *Hands to* — A closing question comparing the student's own two scores, graded against
    their own results, then the code.

---

### Lesson 3 — Subtracting the line and reading what's left
`lesson3.html` · v8 · 8 checkpoints · **Built**

*Rebuilt from JM's voice notes, 2026-09-02.* The quote splices are gone; every stage's
text is now his dictated notes, edited only for flow. Three interactives changed with
them — C is solved by producing a negative male adjustment in a small sample rather than
by naming a sample size; D fits Beren first and only then reveals Cyrus and his one
offset; E plots each film against its own book's pages, so the three clouds overlap and
the opening pages can be compared. Stage D's closing question is cut (JM: Beren reaches
a weight later in age but earlier in time, which made the question confusing), as is
stage C's. The activity box is off for every lesson.

*Lock-ins, same day.* Stages A and D no longer open the next stage the instant a slider
passes the answer — the number has to be committed with a **Lock in** button, and a
lock-in that misses says by how much and hands the slider back. Stage B and Beren's half
of stage D still open on landing.

*The move:* the ladder from one number, to one number plus a group, to asking whether that
group difference is bigger than the measuring, to one number plus a group plus a rate —
which is a regression, built without ever saying so.

*Revised 2026-09-01.* No stage is opened by a prediction any more: every stage is opened by
landing the thing it puts in front of you. The two written questions are numeric, are
scored on their first attempt only, say right or wrong on the spot, and never block the
next stage. Old stages C and D (height bands; click-to-place a hidden weighing) are gone.

*Text refit, same day.* Every scenario panel is now a splice from the lecture-quote corpus
(`_reference/quotes/`) — JM's own words, spliced, cut and lightly edited, unattributed on
screen — over a bulleted setup with no prose in it. The quotes are deliberately **generic**:
statistics, models and philosophy, not biology the student has not earned yet. One quote is
held back as a **reveal**, appearing in the stage's solved-banner and nowhere else, so it
lands after the work rather than instead of it.

**There are no titles.** The `<h1>` is "Lesson 3" and the stage headings are the bare letters
A–E, as is the table of contents. (`<h1>` cannot be empty — the gate hard-fails — and
`<title>` still feeds `lock.js`'s "not open yet" curtain, so both keep the identifier and
nothing else.) Plot panels carry no headings either: the setup bullets and the axes already
say what is in them. Titles that survive name a thing rather than restate one — Controls,
R code, To open Stage X. Groups are "male"/"female" throughout, in the prose, the plot labels and the R panel.
The vagus showcase and the stretch challenge were removed to
`_reference/retired/showcases-and-stretch/`.

- **A — one number for all 7,414** *(text: JM voice notes — statistics as a framework, prediction as the mechanism)*
  - *Interactive* — One slider, one number for all 7,414 adults. Histogram with your number
    as a line; readouts for heavier/lighter counts and the average miss. Gate: land the
    miss inside ±0.3 kg, on a 0.1 kg step (lands at 82.0 kg).
  - *Goal* — Repeat Lesson 1's move on a new measurement, so the ladder starts from
    something already earned.
  - *Hands to* — B **opens on the number just landed here**, which is what makes its
    reveal work.

- **B — plus a group label** *(text: JM voice notes — one number is not enough, so split by biological sex; one number for females plus an adjustment for males)*
  - *Interactive* — Two sliders: a starting number, and an extra added only for men. The
    plot is a mirrored pair of miss-distributions — women's above the axis in red, men's
    below in blue — with a marker on the zero line for each group's average miss. Gate:
    both groups inside ±0.4 kg (lands at base 75.4 + extra 13.5).
  - *Goal* — Carrying 82 kg in, women lean +6.6 and men −6.9. **Opposite leans.** One
    number with no overall lean can still be systematically wrong for everybody. The fix
    is one extra term.
  - *Hands to* — Stage C keeps the same two numbers and takes away the seven thousand
    people; C's sliders open on the pair landed here.

- **C — small samples go the wrong way** *(text: JM voice notes. Gate: land a handful whose fitted male adjustment is negative, which the full 7,414 never are — about one draw in four at n=3. The lower panel now shows that adjustment and the room a handful this size leaves around it, replacing a band that referred to the population while the dots referred to the sample: a dot could sit plainly outside a band the readout called "no".)*
  - *Interactive* — A handful of n women and n men drawn from the 7,414 (n on a slider,
    2–60). Top: two dot columns with the two numbers drawn over their own column. Bottom:
    a gap axis carrying every handful weighed so far, a shaded band of what weighing that
    many hands you when the groups are alike (±2·s·√(2/n), with s the pooled scatter of all
    7,414 — fixed and known, so the band is a function of n alone), and a marker at the
    whole-population gap of 13.5 kg. Gate: land both groups of one handful inside ±1.0 kg,
    **and** catch a handful where the men come out lighter (about 1 draw in 6 at n = 6).
    Then a numeric question: the smallest n per group at which the gap clears the band —
    18, computed live from the data, not hard-coded.
  - *Goal* — A t-test, assembled out of the two numbers from Stage B. The gap is real; how
    many you weigh decides whether you can see it. No p-value is named — that is Lesson 5's
    job — and shuffling is left alone for the same reason.
  - *Hands to* — Stage D, where the group difference has to share the fit with a rate.

- **D — one rate, two starting points** *(text: JM voice notes. Two phases: fit Beren with two knobs, and only then do Cyrus's weighings and his single offset appear. Three numbers where four would have been the obvious choice.)*
  - *Interactive* — Both boys' real home weighing records, mass, age ≥ 1 year (Beren 11
    points, Cyrus 7). **Cyrus's are filed in grams and Beren's in kilograms; the page
    normalises on the way in.** Three sliders: weight at age two, kilograms added per year,
    and an extra that applies only to Cyrus. Lower panel: leftovers against age, plus one
    bar per (boy × younger/older half). Gate: all four half-means inside ±0.4 kg at once —
    334 of 417,231 slider settings do it. Lands near 13.7 / 2.68 / +1.18. Then a numeric
    question: how many months behind Cyrus Beren is at the same weight, graded against the
    student's own three numbers (12·extra/rate ≈ 5.3).
  - *Goal* — One rate and two starting points. The two-group comparison from B and the
    rate arrive in the same fit, and the vertical gap between two lines converts into a
    stretch of time.
  - *Hands to* — Stage E, which asks what happens when one rate is not enough either.

- **E — same start, different paces** *(text: JM voice notes. Now plotted against each film's own book pages. On that axis the finding changes: one opening page and one pace bottoms out at 47.8, three openings and one pace at 17.5, and three paces reach 11.7 — so the films begin in roughly the same place and differ in pace, which is what the framing question asks. Target 15 clears only with the paces split.)*
  - *Interactive* — Every quoted moment from the three Jackson films: minute **within its
    own film** on the bottom, page of the whole 1,061-page story up the side, so the three
    films sit at three heights as well as three tilts. Six sliders (an opening page and a
    pace per film) and **two matching three-stop sliders** — how many opening pages, and
    how many paces, the three films are allowed between them. Each runs: one for all three,
    Fellowship on its own with the other two sharing, or one each. (That middle stop is the
    split Lesson 4 stage C goes on to show is the one the data actually supports:
    Fellowship separates from Return, Two Towers never does.) The films that share a knob
    dim and follow, and collapsing a slider pulls them onto one value so the picture never
    shows a split the sliders no longer offer. *Both were two-state buttons until
    2026-09-03; the labels were hard to read. Pure UI: `version: 8` and `scaffold: 8`
    untouched, both stage-E bits fire on the same conditions, and nothing about the
    controls enters the submission payload, so codes already issued still decode —
    verified.* A running table now records the best average miss across nine combinations
    rather than four
    reached under each of the four combinations. Gate: average miss ≤ 15 pages. Then a
    numeric question: how many minutes 311 pages would take at the pace they gave
    Fellowship (≈135; the film runs 201).
  - *Goal* — **You need both splits.** Verified against the actual slider grid: one opening
    page and one pace bottoms out at 238.6 pages; three openings and one pace at 16.8; one
    opening and three paces at 161.1; both split at 11.1. The target sits in the only gap
    that separates them.
  - *Hands to* — Lesson 4, which asks how sure you can be about any one of those paces.

---

### Lesson 4 — Finding the cloud of lines that all fit the data
`lesson4.html` · v8 · 5 checkpoints · **Built**

*Rebuilt from JM's voice notes, 2026-09-02.* Text is his notes throughout; the quote
splices are gone. Stage A keeps the relative threshold (within 0.05 of what this
student's sixty can reach) but now **states that band on screen, computed from the draw**,
rounded outwards so every R² the plot paints green sits inside the quoted range. Stage B
is a six-rung ladder — the sample-size slider opens to 20, then 80, 100, 150, 200, 500,
and each rung has to be run above the previous cap, so nobody can jump to the biggest
sample and skip the point; a measured run gave spans of 5.60, 3.83, 2.75, 2.86, 2.26,
1.49. Stage C is rebuilt onto one set of axes: the second plot is gone, quotes appear on
the familiar minute-vs-page graph one viewing at a time, and the pale lines are every
pace still consistent with what has been noted. Measured: at 3–4 quotes a film everything
overlaps, Fellowship comes apart from Return at about 5–7, and **Two Towers never
separates from Return** — which is the finding.

*The move:* the best line is not one line, and how wide the cloud is depends on how much
data you have.

*Revised 2026-09-01.* Same treatment as Lesson 3: the three prediction gates are gone, each
stage is opened by solving its own puzzle, and each closes with a numeric question that
says right or wrong on the spot and is scored on the first attempt only. Same text refit —
lecture-quote splice plus a bulleted setup in every scenario panel, no titles anywhere, and
202_lec23_05 held back as the reveal on Stage C's solved-banner. The Dover chalk
showcase and the stretch challenge were removed to
`_reference/retired/showcases-and-stretch/`.

- **A — ten lines that are all the same answer** *(text: JM voice notes — every model is wrong; find the subset of factors useful for your purpose)*
  - *Interactive* — 60 adults (drawn fresh per page load, so the ceiling is this student's
    own number), same two knobs as Lesson 3. R² painted large in the plot corner, two
    decimals only. **No reference line is drawn.** `Lock in line` enables only when you are
    within 0.05 of the ceiling *and* **no line already locked uses that extra per 5 cm** —
    a repeat reads `That extra is taken`, so ten nudges of the same line will not do.
    Target: 10. Then a numeric question: the largest extra per 5 cm that still reaches the
    ceiling, computed live on the same grid the sliders offer (±0.3).
  - *Goal* — Pushing R² to its ceiling does not pin down a line. Roughly 45–50 of the 121
    settings of the slope knob sit at the same number, spanning about 4.5 kg per 5 cm.
  - *Hands to* — Stage B asks what changes the width of that range.

- **B — the spread of equivalent lines against sample size** *(text: JM voice notes. Six rungs, forced upward.)*
  - *Interactive* — A slider for how many adults go into each sample, then `Take a sample`
    or `Take 20 samples`. Each sample's best line is drawn on the scatter; below, each
    sample's pace is a dot on a row per sample size, with a bar for the middle 95% that
    turns green when it is inside target. Gate: at least 60 samples at one size with the
    middle 95% of their paces spanning 2.0 kg per 5 cm or less — which needs roughly 340
    adults a sample. Then a numeric question: how many per sample to halve that span again
    (4× whatever size they used, ±30%).
  - *Goal* — The cloud is not a property of the method, it is a property of how much you
    measured, and the exchange rate is four-for-one. Measured: n=40 spans about 6.8;
    n=500 about 1.6.
  - *Hands to* — Stage C applies it where you cannot go get more data.

- **C — one viewing at a time** *(text: JM voice notes. One graph, points accumulating, a cloud of consistent lines per film.)*
  - *Interactive* — The three films again, each from its own start. A knob sets **how many
    moments a viewing catches** (4–48, opening at 5); `Watch it again` draws that many at
    random from the ones noted — some twice, some not at all — and refits each film. Paces
    accumulate as three clouds on one shared axis with a middle-95% bar; the readout names
    which pairs still touch. Changing the knob starts the record again. Gate: all three
    clouds pairwise apart on at least 150 viewings. Then a numeric question: how far apart
    the middles of the closest two sit (±0.12), graded against the clouds actually built.
  - *Goal* — Whether two things are "clearly different" depends jointly on the gap and on
    the width of the clouds, and the width is bought with effort. Measured: at 5 moments
    two pairs overlap, at 8–10 only Two Towers/Return, and all three come apart at about
    12. Fellowship 2.30, Two Towers 1.76, Return 1.49 pages a minute.
  - *Hands to* — Lesson 5, which builds the pile of results chance alone could produce.

---

### Lesson 5 — Two species, and whether their lines come apart
`lesson5.html` · v6 · 8 checkpoints · **Skeleton built, text still owed**

*Rebuilt 2026-09-03 onto the Grants' finches, to JM's spec: a t-test written the way
Lessons 1–3 write everything (an average for one group plus an offset for the other),
then a line per species down the years, then the clouds of equally good lines, then the
seed crop added underneath. Every stage is the ladder one rung further on, and every
stage carries real Daphne Major data.*

**The interactives, gates and answer keys are finished and measured; the `.voice` blocks
and solved-banners are placeholders marked `TEXT FOR JM` in the source, waiting on the
voice notes.**

Same shape as Lessons 3 and 4: bare-letter stage headings, no prediction gate, controls
live from the start, each stage opened by solving its own puzzle and closed by one
numeric question scored on the first attempt only. The datasets are **embedded in the
page** rather than fetched, because `fetch()` dies on `file://` and these pages get
opened straight off disk; the R panels still point at the CSVs they were cut from.

- **A — one number for a fortis, one more for a scandens** *(the t-test, as an offset)*
  - *Interactive* — All 943 birds measured in the 1987 season (787 *fortis*, 156
    *scandens*), individually banded. Two knobs: a beak depth for a *fortis*, and an
    extra added only for a *scandens*. Upper panel is the mirrored pair of miss
    distributions from Lesson 3 stage B, fortis above the line and scandens below, with
    each species' average miss ticked on the line. Lower panel is the pile of extras
    1,000 shuffles of the species labels produce. Gate: both average misses inside
    ±0.03 mm (lands at 9.33 and −0.19). Then a numeric question: walk the extra back
    toward zero until it re-enters the pile — where does it re-enter? (the pile's lower
    edge, ≈ −0.125, ±0.03, graded against the pile the page actually built).
  - *Goal* — The offset is a quarter of a within-species spread and looks like nothing
    against the birds; against the shuffled pile it is three deep. Measured: 0–2 shuffles
    in 1,000 reach it.
  - *Hands to* — Stage B, which asks the same two-number question forty times over.

- **B — the same two numbers, once a decade** *(a line per species)*
  - *Interactive* — Annual means, 1973–2012, both species. Two phases: *fortis* is fitted
    alone on a starting depth and a change per decade, and only when both its half-means
    land do the *scandens* points and its two knobs appear — an extra on the start and an
    extra on the rate. Lower panel: leftovers against year, one bar per species per half
    of the record. Gate: all four half-means inside ±0.05 mm (96 of 19,481 fortis
    settings; ~103 scandens settings once fortis is down). Lands near 9.74 / −0.276 /
    −0.54 / +0.237. Then a numeric question: the year the two lines cross, graded against
    the student's own four numbers (±3 years; the true fit crosses at 1996).
  - *Goal* — *fortis* falls about seven times as fast as *scandens*, so "how much does a
    beak change" has no answer that is not per-species.
  - *Hands to* — Stage C, which asks whether that difference in rate survives having less
    data.

- **C — the cloud of rates for each species** *(Lesson 4's move, two clouds)*
  - *Interactive* — A knob for how many field seasons are in each record (4–40). Each
    record draws that many of the forty at random, some twice and some not at all, and
    fits a fresh rate to each species off exactly those seasons. Upper panel: the recent
    records drawn pale over the forty years. Lower panel: one row of dots per species with
    a middle-95% bar that turns green when the two stop overlapping. Changing the knob
    starts the record over. Gate: clouds apart on at least 150 records at one setting.
    Then a numeric question: the shortest record that still separates them, graded against
    a sweep the page runs on its own draws at boot (±2; the sweep lands on 10).
  - *Goal* — Ten seasons is roughly the price of being able to say the two species differ
    at all. Measured: k=6 overlaps, k=8 is marginal, k=10 and up separate.
  - *Hands to* — Stage D, which changes what is on the bottom axis.

- **D — put the seed crop underneath it** *(the predictor that can push on a bird)*
  - *Interactive* — Sixteen years of overlap, 1976–1991. Across: the share of last year's
    seed crop that was big and hard. Up: the average beak depth measured the following
    year. One knob per species — how far its beak moves across the whole crop axis — with
    each line's height pinned through its own species' averages, so the only choice is the
    tilt. Lower panel: the same two clouds, now on the response to the crop. Gate: all
    four half-means inside ±0.03 mm; the two acceptable windows do not overlap (fortis
    0.51–0.69, scandens 0.08–0.27). Then a numeric question: how much further a *fortis*
    beak moves than a *scandens* beak, on the student's own two numbers (±0.06).
  - *Goal* — A year does nothing to a finch. The readout under the graph carries the
    finding: over these sixteen seasons the change per decade is −0.38 for *fortis* and
    −0.14 for *scandens* on its own, and −0.10 and −0.03 once the crop sits beside it in
    the same fit. Year was standing in for the seeds. The two responses to the crop
    separate cleanly (0.556 vs 0.204), so what looked like two different trends is one
    resource shift pushing 2.7× harder on one species than the other.
  - *Hands to* — Lesson 6, which shows the same machine giving four different verdicts.

**Still owed on this lesson.** The four `.voice` blocks and the four solved-banners are
placeholders (`<!-- TEXT FOR JM -->` in the source). The four verdict strings are the bare
"Recorded — right/not right." The `setup` bullets are real and describe the mechanics.

### Lesson 6 — Building a model of a population, one cause at a time
`lesson6.html` · v7 · 10 checkpoints · **Skeleton built, text still owed**

*Rebuilt 2026-09-03 to JM's spec: a birth-and-death sandbox, then a real population
that two scalar rates cannot hold, then arrows from causes to rates, then the same move
on Isle Royale — first finding the bad winters by hand, then replacing them with the
wolves.* **Interactives, gates and answer keys are finished and measured off the shipped
code; the five `.voice` blocks and five solved-banners are placeholders marked
`TEXT FOR JM` in the source.**

*The model, all five stages:* `N(t+1) = N(t) · (1 + b − d)`, run forward from the first
real count. Nothing in the lesson ever changes that line — what changes is whether `b`
and `d` are numbers or functions of something. **The score is one number throughout: the
"typical miss", `mean(|model − counted|)` — how far the model sits from the count in an
average year, in birds, moose or wolves.**

*It was a scale-free factor until 2026-09-04, `10^mean(|log10(model/counted)|)`, shown
as "1.52×". Changed on JM's call: "out by 44 birds when there are usually 170" is a
sentence a student can picture and "1.52×" is not. Every bar was re-derived by brute
force on the shipped grids and the pedagogy is unchanged — the models rank in the same
order. Median absolute error was tried first and rejected: it is non-monotonic here,
ranking crowding-only **worse** than drawing no arrow at all.*

**Data.** Cactus finch counts and Daphne Major rainfall for A–C; Isle Royale moose and
wolves for D–E, **cut at 2000** — the wolf population collapsed genetically after that
and was re-founded from the mainland in 2018–19, which is a different system. Both sets
are embedded in the page, as in Lesson 5.

**A new primitive: the arrow widget.** Stages C and E carry a small clickable
node-and-arrow diagram, built in-page (`buildArrows`) rather than with `app/assets/dag.js`
— dag.js pairs its nodes with a synthetic scatter, and what is wanted here is an arrow
that turns a rate into a function and switches on the one slider it pays for. Grey solid
arrows are structure and are not clickable; dashed ones are offers. The readout counts
the numbers in the model, so parameter cost is on screen rather than asserted.

*Stage C's diagram was rebuilt 2026-09-04 on JM's correction.* Its nodes are now
**Rain that year → _Seeds_ → Birth rate**, **Finches alive now → Death rate**, and
**Finches next year** — with all three of births, deaths and *this year's count* running
into next year's, because `N(t+1) = N(t)(1 + b − d)` makes the current count a term in
its own right and not merely a route through the two rates. **Seeds is drawn dashed and
italic as an unobserved variable**: nobody counted seeds in these years, so the one
number the student fits for "rain" covers the whole path from rain through seeds to
nestlings. One arrow id can now span several segments, so that path lights and pays as a
single decision. Stage E's diagram has the same "Next year" ambiguity and has **not**
been rebuilt — it needs the same treatment for two species.

- **A — births, deaths, a hundred generations** *(the sandbox, no data)*
  - *Interactive* — 100 individuals, 100 years, two sliders. Three targets: finish above
    1,000, finish below 10, finish between 90 and 110, **each claimed with a Lock in
    button** — checked on redraw they could all be swept in one drag of a slider
    (fixed 2026-09-04). The third is the point — holding
    steady is not a setting but an exact tie. Then a numeric question: births 0.30 against
    deaths 0.28, two in a hundred, gives 724 of the original 100 at year 100 (±80).
  - *Hands to* — B, which asks the same two numbers to hold a real record.

- **B — a real population, and two numbers that cannot hold it** *(cactus finches)*
  - *Interactive* — 37 counts, 1976–2012, model started on the 1976 count. Two tasks that
    are individually easy and jointly impossible: put the model at or below 150 birds in
    1977 (needs b−d ≈ −0.21), and at or above 500 in 2012 (needs b−d ≥ +0.03). Then a
    numeric question: the b−d that makes the typical miss smallest.
  - *Goal* — **The answer is zero.** The best two-number model of a wild population is a
    flat line at 185 birds, typically 80 birds out. Measured on the shipped grid.
  - *Hands to* — C, which lets the rates move.

- **C — one arrow at a time** *(rain, and the birds themselves)*
  - *Interactive* — Two arrows on offer: rain → birth rate, and finches → death rate. Each
    drawn arrow switches on one slider. Gate: typical miss under 1.32. Then a numeric
    question: the smallest miss the rain arrow reaches on its own (1.35, ±0.04).
  - *Goal* — Measured, on the shipped grid: no arrows 80 birds, crowding alone 78, rain
    alone 58, both 44, against a usual count of about 170. **The crowding arrow alone buys almost nothing** — an extra
    number that is not a cause of much. The bar at 50 birds sits below what one arrow can do,
    so it takes both.
  - *Hands to* — D, where no cause is on offer at all.

- **D — the moose, and the years that went wrong** *(event-finding, not fitting)*
  - *Interactive* — 42 winter counts, 1959–2000, and a strip of clickable years below the
    plot. One birth rate, one death rate, and one "extra deaths in a bad year" that applies
    to every year marked. Gate: typical miss under 130 moose. Then a numeric question: the
    fewest marked years that get there — **two**.
  - *Goal* — Measured: nothing marked 250 moose, one year 187, **1977 + 1996 → 113**, which
    are the severe-winter die-off years. Marking a third makes it *worse* (161), because
    every marked year shares one extra-death number — so picking the right years matters,
    not picking many.
  - *Hands to* — E, which offers a reason for those years.

- **E — the wolves** *(two phases: the arrow that works, and the one that does not)*
  - *Interactive* — The wolf counts appear. The marked years are gone; in their place is
    one arrow, wolves → moose deaths, reading the counted wolves. Gate 1: moose under 235.
    That opens the wolf panel and the second arrow, moose → wolf births. Gate 2: wolves
    under 7.5, out of a usual 22. Then a numeric question: the setting of the second arrow that makes the
    wolves' miss smallest — **graded against the student's own two wolf rates**, because
    the arrow and the birth rate pull on the same thing.
  - *Goal* — Measured: the moose go from 250 to **220** on two numbers plus one arrow,
    against 113 for three numbers plus two hand-picked years. Fewer numbers, nearly as
    good, and now pointing at something. The wolves go from 7.0 to **6.8** — the
    arrow back the other way is worth nothing, and its best setting is about zero. **The
    honest finding: the moose can be explained partly by the wolves, and the wolves cannot
    be explained by the moose.** Their crashes (parvovirus in 1981, inbreeding later) come
    from outside both series.
  - *Hands to* — Lesson 7.

**Still owed on this lesson.** Five `.voice` blocks and five solved-banners are
placeholders. The four verdict strings are the bare "Recorded — right/not right."

**Displaced content, needs a ruling.** The old Lesson 6 — three groups where two
non-significant comparisons do not add to one, n = 30 against n = 300 on the same true
effect, and the movie-attendance-versus-crime showcase — is archived at
`_reference/retired/lessons/lesson6_four_verdicts_2026-09-03.html`. Those were Thread-A
points about reading a test's verdict, and the sequence no longer makes them anywhere.
Fold them into Lesson 7, or into a drill, or drop them deliberately.

### Lesson 7 — Trying to stop evolution, and finding out what that costs
`lesson7.html` · v4 · 10 checkpoints · **Skeleton built, text still owed**

*Rebuilt 2026-09-03 to JM's spec: the capstone for Arc 1, the last allele-free lesson,
and the one that has to carry the whole pre-genetic generalisation before Arc 2 starts
counting ratios.* **Interactives, gates and answer keys are finished and measured off
the shipped code; five `.voice` blocks and five solved-banners are placeholders marked
`TEXT FOR JM`, one of which is flagged NEEDS A SENTENCE FROM YOU.**

*The task, all five stages:* **stop the population changing.** They cannot, until they
switch off the thing that makes it a living population at all.

**What the ratchet does for this lesson.** Lesson 7 is unit L8, seq 12. `heritability`
unlocks exactly here; `hardy-weinberg` (seq 15), `drift` (seq 16) and
`effective population size` (seq 17) are all still locked, and `null hypothesis` is
never-named. So the equilibrium conditions and the finite-population wander both have
to be built and neither can be labelled — which is what JM asked for independently.
Per his ruling of the same day, heritability is *played with* here as a knob and
*defined* later as a parent–offspring correlation; the prose never names it.

**The four knobs**, and nothing else: how many there are, how much of the trait is
inherited, how different they are to begin with, and how strongly the trait goes with
number of offspring. There is no fifth knob — a separate "effective" population size
would be ledger-banned here and is not distinguishable from headcount pre-genetics.

**The ruler, built in stage A and used unchanged to the end.** Two numbers on the
inherited line the model passes to the next generation: **ended** (how far it finished from where it
began) and **strayed** (the furthest it ever got, at any point). Both count, because a
population that comes back to where it started has still been somewhere. The pass mark
is **both under 0.05, on the worst of a batch of ten** — one flat run proves nothing,
the same point Lessons 4 and 5 make about a single sample.

**What the graph plots, and why it matters.** The scored line is the mean of the
inherited part, not the mean of the trait. Measured: with nothing inherited, the
observed mean still wanders 0.35 while the inherited line is flat at exactly 0.000. If
the lesson scored the observed mean, the cleanest success in it would read as a failure.
The observed means are drawn as pale dots beside the line, so that Stage D shows both at
once — dots bouncing, line dead flat.

- **A — the advantage** *(one knob; the failure that starts it)*
  - *Interactive* — N = 100, half inherited, sixty generations. One knob: how strongly
    the trait goes with number of offspring. Drive the population up more than 5, drive
    it down more than 5, then set the knob to zero and run a batch. Measured: advantage
    +0.30 moves it 9.3; advantage 0.00 still strays about 1.2, which is 24× the pass
    mark. Then a numeric question, graded against the student's own batch.
  - *Goal* — Taking away the advantage takes away the direction, not the change.

- **B — how many there are** *(the four-for-one, arriving again)*
  - *Interactive* — A ladder: 25, 50, 100, 200, 400, 800, with a `Run forty` button
    because forty runs a rung is what it takes to read the pattern off six numbers
    (measured: at ten a rung the ladder is non-monotone about a third of the time).
    Each rung records the middle of everything run there. Measured ladder: 1.10, 0.81,
    0.53, 0.40, 0.31, 0.18 — **four times as many halves it**, the same exchange rate as
    Lesson 4 stage B, in a setting with nothing to do with sampling adults off a street.
    Then a numeric question: how many to halve it once more (3,200, ±30%).
  - *Goal* — More individuals buys less change at a punishing rate, and the slider runs
    out before the change does.

- **C — how much is inherited** *(the knob they have not met)*
  - *Interactive* — The third knob, floored at 0.20 so it cannot be zeroed yet. A lower
    panel shows one generation of parents against their offspring, so the knob's meaning
    is visible as a cloud tightening into a line. Push everything as far as it goes —
    biggest population, lowest inherited fraction, no advantage — and it still fails. Measured:
    0.26, five times the pass mark. Numeric graded against their own batch.
  - *Goal* — Inheriting less is a weak lever: it scales with the square root, so halving
    it buys about 30%.

- **D — the two that work** *(and the discontinuity)*
  - *Interactive* — The inherited knob now reaches zero, and the fourth knob appears:
    how different they are to begin with. Both routes flatten it. Gate: pass the test
    once by each. Then the numeric that carries the lesson's thesis — **the largest
    inherited fraction that still passes**. Measured on the shipped grid at the biggest
    population with no advantage at all: 0.05 fails (0.13), 0.01 fails (0.06),
    **only exactly zero passes.**
  - *Goal* — There is no small-but-nonzero setting that holds still. The only settings
    that work are the ones that describe a population which cannot evolve at all.

- **E — the sheep** *(four numbers nobody chose)*
  - *Interactive* — Ram Mountain bighorn, all four knobs measured off one real
    population rather than picked: **86** seen per year (median 1973–2013), **0.40**
    inherited (430 mother–offspring and 181 father–offspring pairs, standardised within
    sex — the dimorphism is 51.9 cm against 21.3 cm, so the raw slope is meaningless),
    **+0.27** for horn length against number of offspring (213 ewes), and a spread of
    1.00 by definition. Set them: the model moves 7.3. The real rams, on the same ruler,
    moved **2.21** — 44× the pass mark. Then take the whole advantage away, the one
    number of the four anyone has ever changed on purpose, and it still strays about 1.0.
  - *Goal* — Not one of the four numbers is anywhere near a stopping value, in the
    population you would have picked if you wanted a quiet one.
  - *Watch out* — The measured advantage is positive, so the model climbs while the real
    rams fell; hunters were removing the big-horned rams. Flagged in the source as
    needing a sentence, or the stage reads as a broken model.
  - *Hands to* — Lesson 9.

**Displaced content.** The old Lesson 7 — four stages of Galton, independent traits,
dialling in a resemblance, the slope, then 934 real children, with regression to the
mean falling out of a slope below one — is archived at
`_reference/retired/lessons/lesson7_galton_heritability_2026-09-03.html`. Per JM's
ruling it becomes Lesson 8's definition of heritability as a parent–offspring
correlation. **The ledger still pins the `heritability` unlock to L8 (= lesson7.html);
if the definition really lands in lesson8.html (unit L9, seq 14) the unlock should move
with it.** Using it at either seat passes the gate, so nothing is broken either way.

---

## Arc 2 — Ratios, baselines, and the two forces that move them

Lessons 8–13. Build the population where nothing changes, then break it one rule at a time.

---

### Lesson 8 — A resemblance is a number, whatever is causing it
`lesson8.html` · v4 · 12 checkpoints · **Skeleton built, text still owed**

*Rebuilt 2026-09-03 to JM's spec: heritability defined here off the parent–offspring
correlation, and drilled until the student stops expecting it to mean "genetic".*

**Corrected the same day: heritability is TWICE the single-parent correlation, not the
correlation itself.** A child gets half its inheritance from the parent on the axis. Two
routes on Galton's own families agree — 2 × 0.362 = 0.724, and the midparent–offspring
regression slope is 0.713 (his famous ~0.65 number). The lesson had both halves and named
neither: stage A landed 0.36 and stage D's knob landed 0.72. Stage A now prints both, and
stage D's knob is labelled *heritability* and shows what half of it predicts for the first
rung.
**Interactives, gates and answer keys are finished and measured off the shipped code;
five `.voice` blocks and five solved-banners are placeholders marked `TEXT FOR JM`.**

*The one measurement, in every stage:* put both sides in spreads and read the tilt. On
standardised axes that tilt **is** the correlation, which is why one number can be
reported for a parent and a child, for two nestmates, for two cousins, and for three
populations built by different means. `tiltOf()` in the source; nothing else is measured
anywhere in the lesson.

**Six stages, A–F.** The opener was added 2026-09-03 and the original five shifted to
B–F, identifiers and all. The lesson was still locked, so no submission codes existed to
protect: `version` went 2 → 3 and `scaffold` 10 → 12.

**Terminology.** The vocabulary ratchet was retired on 2026-09-03, and lessons 5–8 were
swept the same day to use the real words: this lesson names *heritability* and
*parent–offspring correlation* throughout, where it previously said only "the tilt". "Tilt"
survives in Stage A for the line being fitted, which is what it is.

- **A — what knowing the parents buys you** *(JM's two questions, 2026-09-03)*
  - *Interactive* — A binary trait as two columns of a hundred people: on the left,
    everyone whose parents have it; on the right, everyone whose parents do not. Two
    knobs set each column's share, and a switch relabels the trait from a disease to a
    song **without changing a single number**. Gate: hold the top knob at 72% and make
    knowing the parents worth nothing, then hold it at 72% and make it worth as much as
    it can be. Then a numeric question: what the other rate would have to be for that
    72% to tell you nothing — **72**, which is the point.
  - *Goal* — JM's framing, verbatim in the voice block: *72% of people whose parents have
    a particular genetic disease also have that disease — do you predict that they do
    too?* and the same sentence about a song. Neither is answerable, and not because one
    is genes and the other is culture: **72% on its own is not information about
    anybody.** Measured on the page: at 72% against 72% the two columns are
    indistinguishable, knowing the parents moves your answer by 0 points and the
    correlation is 0.00; at 72% against 12% it moves it 60 points and the correlation is
    0.61. The lesson's whole measure, in its plainest form — a correlation is how much
    your best guess about somebody moves when you are told something else about them,
    which on two 0/1 variables is exactly that gap rescaled.
  - *Hands to* — B, which measures the same thing on a scatter.

- **B — the line from parent to child** *(Galton, real)*
  - *Interactive* — 934 grown children from 205 families, each paired with both parents
    in turn for 1,868 points, women's heights ×1.08 exactly as Galton did. Both axes in
    spreads, so the line has only a tilt. Gate: drive the **tilt left over in what the
    line misses** to nothing — a signed target with a true zero, because an average miss
    is flat for a long way around its floor and would accept anything from 0.30 to 0.51.
    Lands at **0.362**. Then a numeric question: where the line puts the child of a parent
    two spreads up.
  - *Hands to* — B, which produces the same number with no genes in it at all.

- **C — a song nobody is born with** *(learned, and still inherited)*
  - *Interactive* — 60 broods, four nestlings each. Each father sings; each nestling
    learns from whoever's nest it wakes up in. One knob (how carefully they copy) and one
    switch (swap the eggs before they hatch). Gate: get nestmates sounding less than half
    as different as strangers, then swap the eggs and accumulate **eight** swapped sets.
  - *Goal* — Copying at 0.95 gives a tilt of 0.95 to the bird that raised it and, once the
    eggs are swapped, **nothing** to the father it came from. Measured: single swapped
    sets scatter with an SD of 0.12 — sixty fathers is not many — so the page averages
    them, and eight sets land on −0.02 against a theory of −0.017. 58 of 60 simulated
    students clear it on the eighth set, and the rest converge by pressing again.

- **D — four limbs, and no resemblance** *(genetic, and not inherited)*
  - *Interactive* — 400 parent-and-child pairs. Every gene says four; the variation is
    accidents. Two knobs: how often an accident happens, and how much danger runs in
    families. Gate: with danger spread evenly get a quarter of them missing a limb and the
    tilt still under 0.10, then make danger familial and push the tilt past 0.30.
  - *Goal* — The mirror of B. A trait every gene agrees about has a heritability of
    **zero**; and putting the *environment* into families conjures one out of nothing.
    Measured: clustering 0 → 0.01; 1.0 → 0.37; 1.6 → 0.53; reliably over 0.30 from 1.4 up.

- **E — down the ladder of relatives** *(where the number comes from)*
  - *Interactive* — One knob, 3,000 families of each kind, four rungs: one parent and a
    child, two full siblings, two half siblings, two first cousins. Galton's two **real**
    numbers are drawn on the same axis as dashed marks — one parent 0.36, full siblings
    0.40, which theory says should match and do. Gate: put the first rung on 0.36 (lands
    at h ≈ 0.72). Then a numeric question: the cousins rung.
  - *Goal* — Measured at the solved setting: **0.38, 0.36, 0.20, 0.12**. It halves down
    the ladder, which is what makes the tilt a measurement of something rather than a
    description of one pairing.

- **F — three roads to the same number** *(the drill)*
  - *Interactive* — Three populations side by side, 2,500 pairs each: a child gets half of
    what its parents were built with; a child copies whoever raises it; a parent and child
    live under one roof. One knob each, plus a swap-the-babies switch. Gate: bring all
    three tilts within 0.05 of each other near 0.36, then swap.
  - *Goal* — Matched, the three scatters are indistinguishable — measured 0.34, 0.35, 0.37,
    widest gap 0.031. Swap the babies and keep comparing each child to the parents it came
    from, and it reads **0.34, 0.00, 0.00**. The number does not identify the cause; an
    experiment does.
  - *Hands to* — Lesson 9.

**Displaced content, needs a ruling.** The old Lesson 8 — Mendel's 3:1 and 9:3:3:1,
the reference pile of 1,000 honest experimenters, and Fisher's complaint about Mendel's
data being too clean — is archived at
`_reference/retired/lessons/lesson8_mendel_ratios_2026-09-03.html`. **Arc 2 is titled
"Ratios, baselines, and the two forces that move them" and now opens on a
continuous-trait lesson with no ratios in it**, and Lesson 9 builds Hardy–Weinberg
without the Mendelian ratios that used to motivate it. Either the arc's framing moves,
or Mendel comes back as a lesson before this one.

### Lesson 9 — Building the population where nothing changes
`lesson9.html` · v2 · 4 checkpoints · **Built**

- **A — A population with nothing acting on it**
  - *Interactive* — One slider for allele frequency; the three genotype frequencies follow.
  - *Goal* — A baseline of no change — explicitly framed on-page as a fiction requiring
    infinite population size and teleportation.
  - *Hands to* — Stage B breaks it deliberately.

- **B — Turn the assumptions off**
  - *Interactive* — Four toggles with their own sliders: finite population, mutation,
    selection, non-random mating. Run 100 generations and watch which one moves the
    frequency most.
  - *Goal* — Each violation leaves a different signature. Ranking them is the point.
  - *Hands to* — Stage C asks whether a given miss is bigger than sampling noise.

- **C — Is the miss bigger than chance?**
  - *Interactive* — Sample N individuals at a set true frequency and inbreeding level;
    compare observed genotype counts to what the tidy ratio expects.
  - *Goal* — The test is weak at small N; a real violation can pass unnoticed.
  - *Hands to* — Stage D takes it to a wild population where the culprit is unknown.

- **D — A wild locus — four candidate culprits**
  - *Interactive* — Italian sparrow loci ranked by how far they sit from the tidy ratio.
    Click a locus for its breakdown. A multi-select asks which of the four forces you would
    investigate.
  - *Goal* — A failed check tells you *something* is off, never *what*. The hybrid origin
    of Italian sparrows makes several answers defensible at once.
  - *Hands to* — Lesson 10 isolates the small-population culprit.

---

### Lesson 10 — Watching alleles wander in a finite population
`lesson10.html` · v2 · 4 checkpoints · **Built**

- **A — One trajectory, then 50**
  - *Interactive* — Wright-Fisher sampling. Sliders for population size, starting
    frequency, generations, seed. A fan of 50 replicates can be toggled on. You can also
    click two points to mark where you expect most trajectories to land.
  - *Goal* — No force is acting, and the frequency moves anyway.
  - *Hands to* — Stage B runs them to the end.

- **B — Run to fixation**
  - *Interactive* — 500 replicates run until every one hits 0 or 1; histogram of fixation
    times.
  - *Goal* — Wandering has an endpoint: variation is lost. Time to get there scales with
    population size.
  - *Hands to* — Stage C asks where they end up, not when.

- **C — Where does a wandering allele end up?**
  - *Interactive* — Eight starting frequencies × 300 replicates each; fraction fixed
    plotted against starting frequency, with a diagonal reference. A selection slider tilts
    the points off the diagonal.
  - *Goal* — Under pure wandering, the odds of fixing equal where you started. Departure
    from the diagonal *is* the signature of selection.
  - *Hands to* — Stage D checks the whole picture against real flies.

- **D — Buri 1956 — 107 fly lines**
  - *Interactive* — Buri's real trajectories overlaid with a simulation at the true per-line
    sample size of 16.
  - *Goal* — The simulation reproduces the observed spread with no free parameters.
  - *Hands to* — Lesson 11 runs it backwards.

---

### Lesson 11 — Reading a population's hidden size from how fast it loses variety
`lesson11.html` · v2 · 4 checkpoints · **Built**

- **A — Variety draining out of a small population**
  - *Interactive* — Slider for effective size; watch the decay curve and its half-life.
  - *Goal* — Rate of loss and population size are two readings of one quantity.
  - *Hands to* — Stage B perturbs the size mid-run.

- **B — Squeeze the population, then let it back out**
  - *Interactive* — Two sliders: how small the population gets and how long it stays there.
    The trajectory decays slowly, crashes, then resumes from a lower level.
  - *Goal* — Depth and duration trade off; a brief severe squeeze can beat a long mild one.
  - *Hands to* — Stage C inverts the relationship.

- **C — Read a population's size off how fast it loses variety**
  - *Interactive* — Simulate a trajectory with known truth plus measurement noise, then
    scan candidate sizes for the best fit and read a range off the curve.
  - *Goal* — The estimate is imprecise from short series. The range is the honest answer.
  - *Hands to* — Stage D is the real test of that honesty.

- **D — Florida Scrub Jay across the decades**
  - *Interactive* — Real jay allele frequencies 1990–2013. Fit a constant-size model and a
    two-epoch bottleneck model. Five simulated decay paths are drawn under the constant-size
    fit as a noise envelope.
  - *Goal* — **The real curve is nearly flat.** The observed points sit *inside* the
    constant-size envelope, so the richer bottleneck model is overfitting. This is the
    intended reveal, not a data problem.
  - *Hands to* — Lesson 12 turns a directional force back on.

---

### Lesson 12 — Pushing the allele frequency with selection
`lesson12.html` · v2 · 4 checkpoints · **Built**

> Fixed this session: an undefined `wfStep` threw at page load, so this lesson could never
> show a name box or emit a code.

- **A — A steady thumb on the scale**
  - *Interactive* — Deterministic sweep, no wandering. Sliders for push strength and
    starting frequency; readouts for time to reach half and to reach 99%.
  - *Goal* — A constant per-generation advantage produces an S-shaped climb, and halving
    the push roughly doubles the time.
  - *Hands to* — Stage B adds the wandering back.

- **B — Selection + drift**
  - *Interactive* — 50 replicate populations at the same push strength. Some sweep, some
    lose the beneficial allele outright.
  - *Goal* — A beneficial allele usually still disappears. Advantage is not destiny.
  - *Hands to* — Stage C asks what a single observed change licenses.

- **C — Work backwards from one observed change**
  - *Interactive* — Simulate at a known push, observe start and end, then fit the push.
    Sliders for the truth, population size, and how long you watched.
  - *Goal* — The recovered range is wide when the change is small next to the wandering.
    Restraint about what one observation supports.
  - *Hands to* — Stage D shows the real version.

- **D — Lenski's long-term E. coli experiment**
  - *Interactive* — Real LTEE allele frequency trajectories; fit a push strength per
    trajectory; watch alleles rise then crash as fitter mutations appear.
  - *Goal* — Real sweeps are messy and interfere with each other.
  - *Hands to* — Stage E makes the whole lesson a judgement drill.

- **E — Drift, selection, or both? Five trajectories, five labels.**
  - *Interactive* — Five trajectories from known settings; label each as wandering only,
    selection dominated, or the boundary case. Must commit before the next round.
  - *Goal* — Confront the boundary where a single trace cannot tell you.
  - *Hands to* — Lesson 13 asks why harmful variants persist.

---

### Lesson 13 — Where deleterious alleles get held in place
`lesson13.html` · v2 · 4 checkpoints · **Built**

- **A — New variants arriving, nothing removing them**
  - *Interactive* — Start from zero; new mutants appear at a set rate with no selection.
    Sliders for mutation rate and population size.
  - *Goal* — Arrival alone does not accumulate the way intuition suggests — wandering keeps
    wiping new mutations out.
  - *Hands to* — Stage B adds removal.

- **B — Add the weeding out, and see where it settles**
  - *Interactive* — Sliders for mutation rate, cost, and dominance. The frequency climbs
    and then flattens; the settling point is displayed alongside the observed value.
  - *Goal* — A balance point, not a race to zero. Dominance changes it by orders of
    magnitude.
  - *Hands to* — Stage C inverts it.

- **C — Work backwards from where it settled**
  - *Interactive* — The pink katydid: an observed frequency plus a mutation rate and
    dominance, solved for the strength of selection.
  - *Goal* — A visible, rare morph implies a very strong cost. A number recovered from
    field observation.
  - *Hands to* — Stage D breaks the formula.

- **D — Cystic fibrosis — when the formula breaks**
  - *Interactive* — Three models tested against the observed CF frequency of 0.022; only a
    heterozygote-advantage model reaches it. A slider hunts for the configuration that
    matches. A multi-select asks what else could contribute.
  - *Goal* — When the balance model misses by a wide margin, the model is missing a term.
    Same shape as Lesson 1's one-directional lean, three arcs later.
  - *Hands to* — Lesson 14 opens Arc 3.

---

## Arc 3 — Structure, response, and family resemblance across species

Lessons 14–19.

---

### Lesson 14 — Counting heterozygote deficits
`lesson14.html` · v2 · 4 checkpoints · **Built**

- **A — One well-stirred population**
  - *Interactive* — Sample from a single mixed population many times; watch the shortfall
    measure scatter around zero, with spread shrinking as sample size grows.
  - *Goal* — Establish the no-structure baseline and its noise.
  - *Hands to* — Stage B introduces structure.

- **B — Split it into patches**
  - *Interactive* — Two subpopulations at different frequencies, each internally well
    mixed. Sliders for both frequencies, mixing proportion, sample size. Pool them and read
    the shortfall.
  - *Goal* — Pooling two well-mixed groups manufactures a deficit that neither group has.
  - *Hands to* — Stage C separates the two sources.

- **C — Two different ways to come up short**
  - *Interactive* — Multiple demes, each with its own frequency and its own internal
    inbreeding. Three measures reported plus their multiplicative relationship. **A
    pooled ↔ split slider peels a single bar of total variance into within- and
    between-deme pieces.**
  - *Goal* — The between/total ratio is the whole idea, shown as one bar splitting. Same
    move reappears at the colony level in Lesson 30.
  - *Hands to* — Stage D takes it to real loci.

- **D — Florida Scrub Jay — per-locus F**
  - *Interactive* — Per-locus shortfall across the jay dataset; outliers flagged.
  - *Goal* — Most loci sit at the baseline; a few outliers are candidates worth chasing.
  - *Hands to* — Lesson 15 brings the parent-child slope back as a lever.

---

### Lesson 15 — How far a population shifts when you breed from the extremes
`lesson15.html` · v2 · 4 checkpoints · **Built**

- **A — Breeding only from one tail of a bell-shaped trait**
  - *Interactive* — Slider for the fraction allowed to breed; readouts for the threshold
    and how far the breeders' average sits above the population's.
  - *Goal* — Quantify how hard you pushed, before asking what happens next.
  - *Hands to* — Stage B answers what happens next.

- **B — What the next generation actually does**
  - *Interactive* — Couple the push to inheritance with a carry-over slider; the offspring
    average moves partway.
  - *Goal* — The response is the push times the carry-over. Directly reuses Lesson 7's
    slope as a lever.
  - *Hands to* — Stage C runs it for a hundred generations.

- **C — Keep pushing, generation after generation**
  - *Interactive* — Long-run selection plotting both the trait average and the available
    variation. A slider controls how much new variation arrives each generation.
  - *Goal* — Selection consumes the variation it needs. With no new input, the response
    flattens and stops.
  - *Hands to* — Stage D looks for this in the wild.

- **D — Grant finches, year by year**
  - *Interactive* — Forty years of beak depth. Per year: the push and the following year's
    response. Fit the slope across years; drought years highlighted.
  - *Goal* — Recover the carry-over from a wild population, year by year, with resampled
    uncertainty.
  - *Hands to* — Lesson 16 is the mirror image: what movement between patches does.

---

### Lesson 16 — Spreading or staying — populations connected by migration
`lesson16.html` · v2 · 4 checkpoints · **Built**

- **A — Two isolated populations drift apart**
  - *Interactive* — Two populations from the same start, drifting independently; the gap
    between them grows toward complete separation.
  - *Goal* — Isolation plus time is sufficient for divergence. No selection required.
  - *Hands to* — Stage B connects them.

- **B — Let a few individuals move each generation**
  - *Interactive* — A migration slider on a log scale. The gap stops growing and settles.
  - *Goal* — Even a trickle of movement caps divergence. The settling point, not the
    endpoint, is the object.
  - *Hands to* — Stage C inverts it.

- **C — Work backwards to how many were moving**
  - *Interactive* — Enter an observed gap, read out the implied number of movers per
    generation, on a log axis.
  - *Goal* — Roughly one migrant per generation is enough to hold two populations together.
    Also: you recover a *product*, never the two factors separately.
  - *Hands to* — Stage D, which runs the inverter on two real systems.

- **D — Italian sparrows across the hybrid zone** *(plus a second real round)*
  - *Interactive* — Per-locus divergence across the sparrow genome, median and outliers.
    A second round supplies two Atlantic cod estimates — an open-coast pair and a
    sill-restricted fjord pair — and asks the student to run Stage C's inverter on both and
    submit the numbers.
  - *Goal* — Most of the genome says "connected"; a few loci say otherwise. Then a case
    where geography visibly sets the answer.
  - *Hands to* — Lesson 17 asks how a costly habit spreads.

---

### Lesson 17 — Helping relatives when cooperation can spread
`lesson17.html` · v2 · 4 checkpoints · **Built**

- **A — What happens without the rule**
  - *Interactive* — A helping allele introduced among strangers. Several replicates, each
    one a possible future.
  - *Goal* — A named baseline: without any kin structure, helping is just a cost and it
    dies. Establishes what needs explaining.
  - *Hands to* — Stage B supplies the missing ingredient.

- **B — Add altruism — sliders for r, b, c**
  - *Interactive* — Three sliders: relatedness, benefit, cost. Readouts include the
    combination and the ending frequency. Gate: 5 combinations **straddling the boundary**.
  - *Goal* — Find the tipping point by crossing it repeatedly, from both sides.
  - *Hands to* — Stage C draws the boundary explicitly.

- **C — Where helping starts to pay**
  - *Interactive* — The benefit-cost plane with the dividing line drawn. A relatedness
    slider rotates it; you place a point and read whether it spreads.
  - *Goal* — Relatedness sets how much benefit a given cost must buy. At clones, anything
    net-positive works; at strangers, nothing does.
  - *Hands to* — Stage D holds the rule fixed and changes the biology.

- **D — Same rule, three biologies — who should you help?**
  - *Interactive* — Toggle among a diploid mammal, a haplodiploid bee, and a clonal
    bacterium; the relatedness values change and the rule's advice changes with them.
  - *Goal* — One rule, three answers. The bee's sisters-over-daughters result predicts
    sterile workers — set up here, cashed at Lesson 31.
  - *Hands to* — Lesson 18 steps back to the trees these arguments lean on.

---

### Lesson 18 — Reading trees with rotated nodes
`lesson18.html` · v2 · 5 checkpoints · **Built**

> Fixed this session: undefined `mulberry32`, `makeFrame` and `drawAxes` threw at page
> load, so this lesson could never show a name box or emit a code.

- **A — Rotate a node; the tree is the same**
  - *Interactive* — A five-tip vertebrate tree. Click any node to flip its children; the
    tip order scrambles while relationships hold. Gate: 5 rotations, then commit.
  - *Goal* — Separate what the drawing encodes from how it happens to be hung. Kills the
    "ladder of progress" reading.
  - *Hands to* — Stage B drills reading the structure that *is* real.

- **B — Find the most recent common ancestor**
  - *Interactive* — Five trees; click the node joining two highlighted tips. Scored.
  - *Goal* — Trace back to the join; you cannot go forward from one tip to another.
  - *Hands to* — Stage C attacks the commonest misreading.

- **C — "Primitive?" — the trap**
  - *Interactive* — Five pairs of living taxa; answer First, Second, or Neither.
  - *Goal* — Both living taxa have been evolving for exactly the same time. "Primitive"
    only means "resembles the ancestor at one specific trait."
  - *Hands to* — Stage D shows what repeated evolution looks like on a tree.

- **D — Anolis ecomorphs**
  - *Interactive* — Anolis tree with tips coloured by body plan; toggle a category and
    count how many separate places on the tree it appears.
  - *Goal* — Similar lizards are scattered, not clustered — the same body plan arose
    independently on each island.
  - *Hands to* — Stage E adds the dimension topology does not carry.

- **E — Sister taxa share an ancestor. Branch length tells you how recently.**
  - *Interactive* — One topology drawn at two depths, with traits evolving along the
    branches. A depth slider; the sister-pair scatter responds.
  - *Goal* — Topology alone does not predict how similar two species should be; branch
    length does.
  - *Hands to* — Lesson 19, which needs exactly that to correct a slope.

---

### Lesson 19 — Removing the family resemblance before comparing species
`lesson19.html` · v3 · 4 checkpoints · **Built**

- **A — Draw the line straight across the species**
  - *Interactive* — A tree with two traits evolving genuinely independently. Fit the naive
    slope across tip values and reseed. Gate: 5 seeds.
  - *Goal* — Independent traits produce apparently real slopes far more often than they
    should, because species are not separate readings.
  - *Hands to* — Stage B fixes it.

- **B — Subtract what the branches already share**
  - *Interactive* — Compute the contrast at each internal node for both traits, then fit
    the corrected slope. The naive and corrected slopes sit side by side.
  - *Goal* — Comparing sisters to sisters removes the shared inheritance. The corrected
    slope centres on zero when the truth is zero.
  - *Hands to* — Stage C asks how much sharing there was.

- **C — How much of the resemblance is just the tree?**
  - *Interactive* — A slider sets how much of the resemblance is shared ancestry; the fit
    recovers it with a range. A causal-model builder underneath lets you construct the
    three stories that could produce a cross-species correlation.
  - *Goal* — The correction is a dial, not a switch — and how far to turn it is itself
    estimated from the data.
  - *Hands to* — Stage D goes to real birds.

- **D — AVONET birds — hand-wing index vs migration**
  - *Interactive* — Real bird data, naive slope against corrected slope, resampled subsets.
  - *Goal* — The correction shrinks the apparent relationship. How much matters.
  - *Hands to* — Stage E, the extreme case.

- **E — The earthworm sign flip**
  - *Interactive* — Thirty worm species in six clades. A view toggle colours by clade and
    reports the pooled slope against the median within-clade slope.
  - *Goal* — **The slope reverses sign.** Within clades, bigger worms prefer more alkaline
    soil; across clades, bigger-bodied lineages happen to live in acidic soil. Same shape as
    Lesson 6 Stage E, now with the tree as the grouping.
  - *Hands to* — Lesson 20 opens Arc 4 on deep time.

---

## Arc 4 — Deep time, genomes, and species boundaries

Lessons 20–25. **These are skeletons.** Each has its title, its lecture anchor quotes, and
a build spec in the instructor `TODO` block, but no scored interactive. Two exceptions are
noted.

---

### Lesson 20 — Measuring rates across sliding intervals
`lesson20.html` · v1 · 0 checkpoints · **Skeleton, one live stage**

- **A — Rate = distance / time** — *has a working simulator.* 10,000 generations of a
  wandering trait; slide the interval length and watch the measured rate per generation
  fall as the interval grows. Two canvases.
  - *Goal* — The same history yields a different rate depending on the window you measure
    it through. Answer depends on the question's shape.
- **B — Gingerich's decline** — *spec only.* Three real datasets at very different interval
  lengths landing on one decline curve.
- **C — Why does the rate decline?** — *spec only.* Three candidate causes (cancelling
  moves, wandering rather than accumulating, biased preservation) as toggles, fitted
  against the empirical curve.
- **D — The PETS time series** — *spec only.* Sliding-window rate analysis on real Eocene
  mammal data.
- *Hands to* — Lesson 21 asks the same rate question of the genome.

---

### Lesson 21 — Mutation target size and the parallel evolution it produces
`lesson21.html` · v1 · 0 checkpoints · **Skeleton**

- **A — Two genes, two mutation rates** — two loci, one with a much larger target; compare
  their substitution rates.
- **B — Run it again and see what repeats** — five traits, predict how many independent
  origins each has.
- **C — The Alu in the regulator** — the transposon insertion that removed the ape tail;
  distinguishing a big target from one lucky event.
- **D — Five phenotypes, five effective mutation rates** — classification drill, linked to
  scaffold S17.
- *Goal (whole lesson)* — How often something evolves is set by how many ways there are to
  reach it, not by how likely any one mutation is.
- *Hands to* — Lesson 22 turns this into a per-gene measurement.

---

### Lesson 22 — Reading selection off codon ratios
`lesson22.html` · v1 · 0 checkpoints · **Skeleton**

- **A — Two kinds of change in a gene nothing is acting on** — simulate a coding sequence
  with no selection; count both kinds of change; the ratio sits at one.
- **B — Make one kind of change costly** — a cost slider drives the ratio down; a benefit
  drives it above one.
- **C — A sliding window** — the ratio computed along the gene rather than over all of it;
  conserved core, variable surface.
- **D — Five genes, five patterns** — classify real genes by their pattern; linked to S18.
- *Goal (whole lesson)* — A ratio between two kinds of change is a measurement of what has
  been happening to a gene.
- *Hands to* — Lesson 23 moves from one gene to two whole lineages.

---

### Lesson 23 — How incompatibilities pile up between two diverging lineages
`lesson23.html` · v1 · 0 checkpoints · **Skeleton**

- **A — Two populations diverging neutrally** — each accumulates changes that are fine on
  their own background.
- **B — Count the pairs, watch the snowball** — the number of possible bad combinations
  grows as the square, not linearly.
- **C — Reinforcement closes the gap** — once hybrids are costly, selection favours not
  mating in the first place; a race between selection and recombination.
- **D — Hybrid fitness across divergence** — the square-law pattern across Drosophila,
  sunflowers, sticklebacks.
- *Goal (whole lesson)* — Reproductive isolation accelerates. Most of it needs no selection
  for isolation at all.
- *Hands to* — Lesson 24 takes the opposite case.

---

### Lesson 24 — Same outcome, three different histories
`lesson24.html` · v1 · 0 checkpoints · **Skeleton**

- **A — How alike should two species be?** — a trait evolving up a tree; rank tip pairs by
  similarity and ask whether similarity tracks relatedness.
- **B — Penguins and hummingbirds** — sort five trait/lineage pairs into inherited,
  independently evolved, or retained.
- **C — The test that distinguishes them** — map the trait on the tree and count the
  minimum number of changes.
- **D — Anolis ecomorphs across the Caribbean** — count independent origins from the real
  tree; shuffle tip labels to ask how often the pattern arises by chance.
- *Goal (whole lesson)* — Looking alike has three possible histories and they are
  distinguishable — but only against a tree.
- *Hands to* — Lesson 25 asks what the tips even are.

---

### Lesson 25 — Deciding one species or two — and what would change your mind
`lesson25.html` · v1 · 0 checkpoints · **Skeleton**

- **A — Two populations, you make the call** — a marginal pair; commit a call, then state in
  free text what observation would flip it *before* the stage unlocks.
- **B — The ring of warblers** — a pairwise interfertility map with no clean answer.
- **C — Is the line out there, or in your method?** — five cases × three methods; the right
  method depends on the case.
- **D — Five hard cases** — commit a call on each and name the observation that would flip
  it; linked to S20.
- *Goal (whole lesson)* — A species boundary is a hypothesis about future independence.
  The commitment is stable; the method for testing it varies by case.
- *Hands to* — Lesson 26 opens Arc 5 by naming the accounting that has been running all
  along.

---

## Arc 5 — One accounting move, run at seven scales

Lessons 26–34. Lesson 26 is the core; 27–33 are branches, one nested transition each;
34 is the capstone. **Only Lesson 26 Stage A is built.**

---

### Lesson 26 — Splitting a change in the average into two pieces
`lesson26.html` · v1 · 1 checkpoint · **Stage A built, B–D are previews**

- **A — One level: how the average moves** — *built.* Each dot is an individual: trait
  across the bottom, fitness up the side, with the fitted line drawn. A slider steepens the
  dependence of fitness on trait. Readouts show the shift computed two independent ways —
  from the covariance, and directly by reweighting — which agree.
  - *Goal* — The change in the average *is* the slope of fitness on trait. Nothing new is
    introduced; the quantity computed since Lesson 3 gets a name.
- **B — Two levels: between and within** — *preview.* Assemble individuals into groups; two
  covariances appear at once.
- **C — The diagnostic: which level is selection at?** — *preview.* The ratio of between to
  within; when it crosses one, the group is the unit.
- **D — Re-derive Hamilton's rule** — *preview.* Swap in the altruism fitness form and
  Lesson 17's rule falls out of the same algebra.
- *Hands to* — Lessons 27–33, each running the diagnostic at one transition.

---

### Lessons 27–33 — the seven transitions
All **Skeleton** (v1, 0 checkpoints), except Lesson 30 Stage B, which has a working
simulator. Every one follows the same four-part shape: **A** a named baseline where the
lower level is the unit; **B** introduce the structure that could make the higher level a
unit; **C** run the between/within diagnostic; **D** a real empirical anchor.

- **Lesson 27 — When the chromosome becomes the unit** *(gene → chromosome)*
  - A genes shuffled freely · B genes that can no longer be separated · C how wide the
    change reaches · D the dachshund's short legs and the 20-megabase footprint around FGFR3.
  - *Goal* — A gene is only a unit if recombination can separate it from its neighbours.

- **Lesson 28 — When the genome wins out over the gene** *(chromosome → genome)*
  - A fair meiosis · B introduce a driver that gets into 70% of gametes · C what stops a
    cheating gene (suppressors) · D the Alu transposon that removed the ape tail.
  - *Goal* — Genes can cheat; the genome polices them because it pays the cost.

- **Lesson 29 — When the cell wins out over the genome** *(genome → cell)*
  - A one cell, no internal competition · B endosymbiosis introduces subunits with their
    own replication · C the cell's policing (moving essential genes to the nucleus) ·
    D cancer initiation as the failure mode.
  - *Goal* — Reproduction competing with itself can happen entirely inside one individual.

- **Lesson 30 — When cells stop competing — the body emerges** *(cell → individual, CORE)*
  - A cells living on their own · **B — has a working simulator:** 200 cells in 10 colonies,
    a within-colony relatedness slider, live readouts of the within- and between-colony
    terms and which level currently wins · C the diagnostic · D three anchors (honeybee or
    Volvox for the clean case, somatic mutation data for the failure).
  - *Goal* — Your body is a truce. Same between/total ratio as Lesson 14's split bar, now on
    fitness rather than allele frequency.

- **Lesson 31 — When workers stop reproducing — the colony emerges** *(individual → superorganism)*
  - A solitary insects · B haplodiploid sisters · C the diagnostic with worker policing ·
    D honeybees and naked mole rats.
  - *Goal* — Lesson 17's bee result, cashed: sisters-over-daughters plus policing makes the
    colony the unit. Mole rats reach the same place by inbreeding instead.

- **Lesson 32 — When species outpersist each other** *(superorganism → lineage)*
  - A many lineages with identical individual fitness · B heritable traits that promote
    splitting · C the diagnostic at the lineage level · D bird wing shape against speciation
    rate.
  - *Goal* — Selection above the individual, with no individual being fitter than any other.

- **Lesson 33 — Beyond the species — when the unit doesn't have a name yet** *(speculative)*
  - A strip the substrate away (prions, memes, language) · B ideas that get copied ·
    C holobionts · D free-response: the student picks their own candidate and runs the
    diagnostic on it.
  - *Goal* — The accounting needs heredity, variation, and differential reproduction. It
    does not need DNA.

---

### Lesson 34 — Capstone — What is an Individual?
`lesson34.html` · v1 · 0 checkpoints · **Skeleton**

- **A — All seven cascades side by side** — every transition with its diagnostic and its
  empirical anchor in one view, each clickable back to its lesson.
- **B — Why we exist where we exist** — the eukaryote level as the one where the diagnostic
  returns the cleanest answer on Earth.
- **C — The story of George Price** — narrative only. Nothing to compute; the student sits
  with the implication.
- **D — Course bookend** — callback to Lesson 1's framing of evolution as motion rather than
  a force, now adding that the things it acts on are themselves produced by it.

---

## Cross-cutting notes for review

**Where the spine is strongest.** Lessons 1 → 3 → 4 now run as one continuous argument:
one number, then the direction of its misses, then a group term, then a per-unit term,
then the discovery that the per-unit term is not pinned down, then how much data it takes
to pin it. Lesson 2 sits alongside as the "has the population changed" thread. If you want
to reorder anything, this block is the part to leave alone.

**Repeated shapes worth keeping consistent.**
- *The shuffled pile* — L5 A/B/D, L8 C/D, L4 C. Four different dressings of one move.
- *The between/total ratio* — L14 C (the splitting bar), L26 C, L30 C. Currently only L14's
  is built, and it is the clearest of the three.
- *A correct number that misleads* — L6 E (movies), L19 E (earthworms). Same trap, once
  with a category and once with a tree.
- *Work backwards from an observation* — L11 C, L12 C, L13 C, L16 C. All four report a
  range rather than a value, deliberately.

**Known gaps.**
- Lessons 20–25 and 27–34 have no interactives and score zero. Fifteen builds outstanding.
- Lesson 26 B–D are previews on a page whose Stage A is the arc's keystone.
- Lesson 2's index title still says "Resampling to ask if new data still belongs", which
  now describes only its first half.
- Around 110 soft jargon warnings remain in the prose of Lessons 5–19 — all for terms the
  ledger unlocks at that unit, so they are stylistic rather than violations.

**Verification status.** All 34 lessons load without JavaScript errors and reach a
submission code. Lessons 1–4 were driven end to end in a headless browser and their codes
decoded through the instructor verifier. Lessons 5–34 were smoke-tested only: name gate,
first-stage unlock, and every unlocked control nudged once.
