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
`lesson1.html` · v8 · 7 checkpoints · **Built**

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
`lesson2.html` · v4 · 7 checkpoints · **Built**

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
`lesson3.html` · v6 · 10 checkpoints · **Built**

*The move:* the ladder from one number, to one number plus a group, to asking whether that
group difference is bigger than the measuring, to one number plus a group plus a rate —
which is a regression, built without ever saying so.

*Revised 2026-09-01.* No stage is opened by a prediction any more: every stage is opened by
landing the thing it puts in front of you. The two written questions are numeric, are
scored on their first attempt only, say right or wrong on the spot, and never block the
next stage. Old stages C and D (height bands; click-to-place a hidden weighing) are gone.

- **A — Expect a person's weight**
  - *Interactive* — One slider, one number for all 7,414 adults. Histogram with your number
    as a line; readouts for heavier/lighter counts and the average miss. Gate: land the
    miss inside ±0.3 kg, on a 0.1 kg step (lands at 82.0 kg).
  - *Goal* — Repeat Lesson 1's move on a new measurement, so the ladder starts from
    something already earned.
  - *Hands to* — B **opens on the number just landed here**, which is what makes its
    reveal work.

- **B — Now you are told whether the person is a woman or a man**
  - *Interactive* — Two sliders: a starting number, and an extra added only for men. The
    plot is a mirrored pair of miss-distributions — women's above the axis in red, men's
    below in blue — with a marker on the zero line for each group's average miss. Gate:
    both groups inside ±0.4 kg (lands at base 75.4 + extra 13.5).
  - *Goal* — Carrying 82 kg in, women lean +6.6 and men −6.9. **Opposite leans.** One
    number with no overall lean can still be systematically wrong for everybody. The fix
    is one extra term.
  - *Hands to* — Stage C keeps the same two numbers and takes away the seven thousand
    people; C's sliders open on the pair landed here.

- **C — Weigh a handful of each and the gap moves**
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

- **D — Beren and Cyrus, from their first birthdays on**
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

- **E — Three films, and what one line cannot do**
  - *Interactive* — Every quoted moment from the three Jackson films: minute **within its
    own film** on the bottom, page of the whole 1,061-page story up the side, so the three
    films sit at three heights as well as three tilts. Six sliders (an opening page and a
    pace per film) and two buttons that **split** them: with a knob unsplit, the other two
    films' sliders dim and follow the first. A running table records the best average miss
    reached under each of the four combinations. Gate: average miss ≤ 15 pages. Then a
    numeric question: how many minutes 311 pages would take at the pace they gave
    Fellowship (≈135; the film runs 201).
  - *Goal* — **You need both splits.** Verified against the actual slider grid: one opening
    page and one pace bottoms out at 238.6 pages; three openings and one pace at 16.8; one
    opening and three paces at 161.1; both split at 11.1. The target sits in the only gap
    that separates them.
  - *Hands to* — Lesson 4, which asks how sure you can be about any one of those paces.

- **Showcase — the same leftover, on a nerve** *(open, ungated)*
  - *Interactive* — Ten mammals, brain-to-larynx distance against actual nerve length. The
    line is drawn through the nine non-giraffes; the giraffe sits in red about 210 cm above
    it. Residual panel below.
  - *Goal* — The largest leftover in the course, left as a question rather than an answer.

---

### Lesson 4 — Finding the cloud of lines that all fit the data
`lesson4.html` · v6 · 7 checkpoints · **Built**

*The move:* the best line is not one line, and how wide the cloud is depends on how much
data you have.

*Revised 2026-09-01.* Same treatment as Lesson 3: the three prediction gates are gone, each
stage is opened by solving its own puzzle, and each closes with a numeric question that
says right or wrong on the spot and is scored on the first attempt only.

- **A — Find ten lines that fit this data equally well**
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

- **B — Measure more people and close the fan down to a set width**
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

- **C — Note down enough moments to tell all three films apart**
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
  - *Hands to* — the stretch challenge, which asks what that number becomes when the gap
    being chased is half as wide.

- **Showcase — how old the bottom of a cliff has to be** *(open, ungated)*
  - *Interactive* — Twelve modern carbonate deposition rates, redrawn 5,000 times, each
    redraw implying an age for 100 m of chalk. Log-scale histogram with a marked line at
    6,000 years.
  - *Goal* — The same redrawing move, pointed at deep time. Zero of 5,000 redraws fall
    under 6,000 years.

---

### Lesson 5 — Shuffling the predictor to see what chance can do
`lesson5.html` · v4 · 9 checkpoints · **Built**

*The move:* build the pile of results chance alone could produce, then see whether yours
sits in it.

- **A — Two groups, and one number for the gap between them**
  - *Interactive* — Four sliders (n per group, within-group spread, true gap, seed). Top
    panel: the two groups. Bottom: 1,000 refits with the group labels shuffled, as a
    histogram, with the observed gap marked. Gate: 5 slider combinations.
  - *Goal* — A tiny real gap becomes unmistakable at large n, because the shuffled pile
    collapses toward zero.
  - *Hands to* — Stage B runs the same machine with the inputs inverted.

- **B — Eight per group, and far more scatter**
  - *Interactive* — Identical controls, new defaults: n = 8, large spread, a gap of half a
    spread. The shuffled pile is now wide and the observed gap sits inside it.
  - *Goal* — A moderate real effect can be invisible. Nothing about the effect changed —
    only how much was measured.
  - *Hands to* — Stage C moves off two groups onto a continuous predictor.

- **C — The same move, with year along the bottom**
  - *Interactive* — Five real short time series, two of them the Grant lab's Galápagos
    finches through the 1977 drought. Per round, you first mark where you think the middle
    95% of the shuffled slopes will land, then reveal. Five rounds. A causal-model builder
    sits underneath: add arrows, watch the simulated data change, and find *two* different
    models that could have produced the slope you measured.
  - *Goal* — The shuffle test says the slope is not reshuffling noise. It does not say
    what caused it — "year" does nothing to a finch.
  - *Hands to* — Stage D turns the three inputs into a challenge.

- **D — Three knobs, one pile of shuffled gaps**
  - *Interactive* — Same simulator, three targets to hit in order: a tiny gap that still
    clears the pile; a huge gap that does not; an honest middle case. Plus an optional
    stretch challenge.
  - *Goal* — Separate "big" from "clearly distinguishable" as two independent things.
  - *Hands to* — Lesson 6, which shows the same machine giving four different verdicts.

---

### Lesson 6 — Watching the same biology give four different verdicts
`lesson6.html` · v4 · 4 checkpoints · **Built**

*The move:* four setups, one test, four answers — and each time, identify which input
moved the verdict.

- **A — Three groups, two tests run, one not**
  - *Interactive* — Low / Middle / High groups. Low-vs-Middle and Middle-vs-High both come
    back unremarkable; you commit a prediction for Low-vs-High before unlocking the sliders.
  - *Goal* — Non-significance is not transitive. Two "no differences" do not add to no
    difference.
  - *Hands to* — Stage B holds the effect fixed and moves n.

- **B — Two experiments, same true effect**
  - *Interactive* — Two experiments side by side, n = 30 and n = 300, with a shared
    true-difference slider. Four canvases: groups and shuffled pile for each.
  - *Goal* — Same biology, different verdicts, purely from sample size.
  - *Hands to* — Stage C pits effect size against precision directly.

- **C — Which one is "clear"?**
  - *Interactive* — Experiment A: small true difference, tight scatter, n = 200.
    Experiment B: huge true difference, big scatter, n = 12. You call which one clears the
    bar before seeing them, then reseed.
  - *Goal* — The bigger effect is not the one the test flags. This is the sharpest form of
    the Lesson 5 Stage D lesson.
  - *Hands to* — Stage D removes the effect entirely.

- **D — Same centre, very different spread**
  - *Interactive* — Two groups with identical means; a slider controls only how spread out
    the second group is.
  - *Goal* — A test aimed at the centre is blind to a difference in spread. The verdict
    answers the question it was asked, not the question you had.
  - *Hands to* — Stage E, where the verdict is correct and still misleads.

- **E — A verdict that is true and still misleading**
  - *Interactive* — Weekend movie attendance against change in violent crime (synthetic,
    faithful to Dahl & DellaVigna 2009). The pooled slope is clearly negative. A view
    toggle colours by whether the weekend's big release was violent, and reports the pooled
    slope against the two within-group slopes. A causal-model builder underneath lets you
    add the unmeasured "young men in theatres" cause and watch the pooled pattern appear
    without any direct arrow.
  - *Goal* — "Violent movies reduce crime" is the wrong reading of a correct number.
  - *Hands to* — Lesson 7, which puts a parent on one axis and their child on the other.

---

### Lesson 7 — Tracing how much of a parent ends up in their child
`lesson7.html` · v2 · 9 checkpoints · **Built**

*The move:* a resemblance is a slope, and the slope has a ceiling you can see.

- **A — Two traits that have nothing to do with each other**
  - *Interactive* — Two genuinely independent simulated traits. Sliders for n and seed;
    readouts for how-they-move-together, the link, and rank agreement. Reseed repeatedly.
  - *Goal* — Independent traits do not measure as exactly zero. The wobble around zero
    shrinks with n; it never vanishes at any finite n.
  - *Hands to* — Stage B introduces a real, dialled-in resemblance.

- **B — Let the child inherit part of the parent**
  - *Interactive* — Pairs of (parents' average, child). One slider sets how much of a
    parent's departure from the crowd is handed on. At one extreme the cloud is round; at
    the other it is a tight line.
  - *Goal* — Watch a resemblance appear as a tilt, continuously dialled.
  - *Hands to* — Stage C puts a number on the tilt.

- **C — Draw the line from the parents to the child**
  - *Interactive* — Same simulator, now with the fitted line drawn and its slope displayed
    next to the dial you set. Readouts for how far the slope sits from the dial, and how
    much it wobbles. Gate: 8 different settings. Includes an unscored free-text reflection.
  - *Goal* — The slope recovers the dial. A child of extreme parents is predicted above
    average but by *less* — regression toward the mean falls out of a slope below one.
  - *Hands to* — Stage D does it on real families with no dial to check against.

- **D — Galton's 1885 data: 934 children, 197 families**
  - *Interactive* — Real Victorian family records. Fit the line, resample it, split by
    child sex.
  - *Goal* — The number (~0.65) is discovered here, not handed over earlier.
  - *Hands to* — Closes with a caution kept in the footer: anything a child gets from a
    parent — first language, diet, money, neighbourhood — bends that line just as steeply.

---

## Arc 2 — Ratios, baselines, and the two forces that move them

Lessons 8–13. Build the population where nothing changes, then break it one rule at a time.

---

### Lesson 8 — Counting the ratios that breed true
`lesson8.html` · v1 · 4 checkpoints · **Built**

- **A — One gene, two alleles, a 3:1 ratio**
  - *Interactive* — Simulate Aa × Aa crosses. Sliders for offspring count and seed; the
    observed ratio is whatever you sample. Gate: 5 combinations.
  - *Goal* — The expected ratio and the observed ratio are different objects.
  - *Hands to* — Stage B adds categories so the same check gets harder.

- **B — Two genes at once**
  - *Interactive* — Two independent loci, four phenotype categories, expected 9:3:3:1.
  - *Goal* — More categories at the same n means thinner counts and a fussier check.
  - *Hands to* — Stage C builds the reference pile the check implicitly uses.

- **C — When a mismatch is real, and when it is just a small sample**
  - *Interactive* — 1,000 simulated crosses, every one built to obey 3:1 exactly. Their
    mismatches stack into a distribution; the worst 5% mark its far edge. Your single real
    experiment is one draw from that pile.
  - *Goal* — Same shuffled-pile move as Lesson 5, now on counts. Ties Arc 2 back to Arc 1.
  - *Hands to* — Stage D turns the pile on Mendel himself.

- **D — Mendel's actual data — and Fisher's complaint**
  - *Interactive* — Mendel's published F2 counts, combined mismatch computed, then placed
    in the distribution of 1,000 simulated honest experimenters.
  - *Goal* — Data can be *too* clean. A famous result becomes a live question.
  - *Hands to* — Lesson 9 locks these ratios into a population.

---

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
