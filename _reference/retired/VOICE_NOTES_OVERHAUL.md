# Overhaul framework — from L1/L2 voice notes (2026-07-17)

Source: JM voice notes reviewing Lessons 1 and 2. This doc extracts the reusable
style/approach doctrine those notes imply, then gives per-lesson punch lists.
It is meant to gate the review of **all** lessons, not just the first two.

The notes are not a list of typos. They are a demand to return to the three
design commitments — hardest on **"show, don't tell"** and **"titles name the
mechanic, not the term."** The lessons have drifted into front-loaded framing,
statistical vocabulary, and lecture-prose. The job is to strip everything that
*explains* so the student is left with something to *do*.

---

## 1. Global style rules (apply to every lesson before it passes review)

1. **No front matter.** Delete the "What this lesson is asking" / "What you'll
   do" outcome blocks and the verbose header sub-paragraph. A lesson opens on
   Stage A. Header keeps the mechanic-title and at most one plain sentence.
2. **No back matter.** Delete the wrap-up footer entirely: "here is your code,"
   "where this lesson goes next," "one sentence to carry forward," office-hours
   note, forward-thread callouts. Keep only a minimal "→ next lesson / all
   lessons" link. (Exception: the covariance-thread closers — see §6.)
3. **No jargon in student-facing text.** Banned surface terms: μ, σ, Δ / delta,
   "shift magnitude," "bootstrap," "CI / confidence interval," "residual,"
   "sampling scatter," "draw index," "replicate," "null," "alarm," "latency."
   These live in the R code panel only, if anywhere. The concept emerges from
   doing; it is never named up front. These are intuition-builders, not
   vocabulary lessons.
4. **One word for the act of predicting: "expect / expectation."** Replace
   "guess" everywhere. Where the student commits a single value and then can't
   revise it, say "your expectation," not "your guesses."
5. **Scenarios are concrete and narrative, or absent.** If a stage has a
   scenario it names a place and an action ("you're outside a coffee shop;
   adults walk out one at a time; you measure each one's height"). Then
   *everything* obeys it: axis labels ("adults measured," not "draw index"),
   button labels ("Measure the next adult," not "Step the stream"), and question
   wording ("as the group who arrived together start coming out…"). No abstract
   "100 replicates, each 300 draws" framing.
6. **Fewer buttons; automatic transitions.** Unlocks should fire automatically
   (or on one obvious prompt), never require hunting for a "Reveal" button.
   Remove decorative controls — the **seed slider comes out of the UI on every
   stage**; `set.seed()` stays in the code panel only.
7. **Titles/cards name the mechanic only.** On the landing page: keep the snappy
   single-clause title, strip the descriptive subtitle, the lecture tag, and any
   formula/Greek. Trim the lede to just the italicized recurring question.
8. **The unlock should total and compare, not just pass.** Where a stage
   accumulates predictions, the gate that opens the next stage should sum them,
   sum the outcomes, and compare the student's running error against the
   "always expect the average" strategy — shown as an explicit summation. Keep
   average-error read-outs.
9. **Generate visuals dynamically.** Build the histogram/distribution as data
   streams in. Don't pre-draw static bars and drop dots on top.
10. **Cut prose to the bone.** Every "what to do" panel is one or two plain
    sentences. Delete second-paragraph elaborations and teaching notes that
    lecture rather than instruct.

---

## 2. Landing page (`index.html`)

- **Lede:** cut to the italicized question only — *"what's holding this thing
  together across generations, and how can you tell when transmission stops?"*
  Drop the surrounding "same handful of tools…" sentence.
- **Lesson cards:** **title only.** Remove the `.sub` description *and* the
  `.lec` lecture tag from every card (decided — §7). The index becomes bare
  mechanic-titles grouped under unit headers; no Greek, no formulae, no
  provenance line.
- Units are already grouped; keep the unit headers.

---

## 3. Lesson 1 — punch list

- **Header:** trim the sub-paragraph to one plain line. Remove the "Meet the
  formula `y ~ Normal(μ, σ)`" promise.
- **Delete the entire "What this lesson is asking" block** (the outcomes div,
  both paragraphs, including the "Why coins and heights, not finches?" essay).
- **Stage A ("Flip a coin"):**
  - Trim the "What to do" panel to ~1 sentence.
  - **Reduce clicking:** **10 flips per round** (decided — §7). Rebuild the
    dropdown (0–10), the 10-slot strip, and the "1 in 6" tally note (a batch of
    10 is noisier — recheck that copy's numbers).
  - Replace "guess" → "expect" in the prediction copy and the tally-frame note.
  - **Rebuild the A→B bridge as a summation.** Sum the 3 expectations, sum the 3
    actual head counts, show total error across all rounds, and show how much
    smaller the error would have been had they expected the **average** every
    round (call it "the average," never "correct"). Keep the average-error line.
  - **Bridge prose:** keep only the "that last column is your error" sentence;
    delete the sampling-scatter paragraph and the entire second paragraph.
- **Stage B ("Guess a person's height"):**
  - Retitle/reword away from "guess" → "your expectation."
  - Fix the failB question: "Across these 30 draws, were you consistently
    guessing too high or too low?" → **"Were your draws consistently above or
    below your expectation?"** (single estimate, not repeated guesses).
- **Stage C — rebuild, don't rename.** The current "Naming the pieces: μ and σ"
  stage gives the answer away and is jargon-first. **Cut the μ/σ naming stage.**
  Replace it by promoting the existing "one more move — two groups" coda into
  Stage C proper: take Stage B and expand it to **two colour-coded groups**
  (men/women). Student enters an expectation for **each** group, is asked **why**
  the two differ, and **compares the spreads**. Keep it wordless on μ/σ.
  - Consequence to log: L1 no longer "ends at `y ~ Normal(μ, σ)`." Update
    PROJECT_PLAN §3.4 and the landing card to match (they currently promise it).

---

## 4. Lesson 2 — punch list

- **Header:** drop the "BIO 202, Spring 2026, draft v1…" boilerplate subtitle.
- **Delete the "What you'll do" block** (outcomes div). The albino-alligator note
  lives inside it — cut it, or, if kept, demote to a one-line scenario hook
  (JM said cut the section).
- **Stage A ("Running mean"):** keep the mechanic — JM likes the scenario.
  - Add the concrete frame: **"You're standing outside a coffee shop. Adults
    walk out one at a time; you measure each one's height."**
  - Keep Q1 (10 draws then 90 more).
  - **Rewrite Q2** — no "bootstrap CI on ȳ / how wrong could ȳ be." Ask plainly
    **how their uncertainty changes** as more adults come out.
  - Rename **"Step the stream"** button → "Measure the next adult" (or similar).
  - Axis label **"draw index" → "adults measured."**
  - **Remove the seed slider from the UI** (code panel keeps `set.seed`).
  - Fix the stray bullet artifact rendering before Q1.
- **Stage B ("Population switches"):**
  - Rewrite scenario, coffee-shop-native: *"You keep measuring. You notice a bus
    pull up; a group gets off and files into the shop. You measure them as they
    come out."* **Drop "the next adult comes from NBA players, μ ≈ 199."** No
    population labels, no μ reveal.
  - Reword Q1 in scenario terms ("as the group who arrived together start coming
    out, the running mean…").
  - **Rewrite Q2** — remove the bootstrap-CI framing.
  - **Fix the unlock bug + button glut.** Stage C does not unlock after
    answering; the gate is a hard-to-find "Reveal switch" button. Make the
    reveal **automatic** (after N post-switch measurements) or a single obvious
    prompt. Remove the extra buttons.
- **Stage C ("How fast does the alarm fire?") — rebuild as narrative** (decided
  — §7). The 100-replicate / Δ / false-alarm framing is out entirely. Keep a
  "how soon could you have told?" beat, coffee-shop-native: the earlier the
  student calls the switch, the better — but call it too early on the stable
  stream and you were wrong. No Δ, no "replicate," no "false-alarm rate," no
  sliders labelled in Greek. Sits between B (spot the switch) and D (real-data
  payoff).
- **Stage D (NHANES vs NBA):**
  - The static-bars-then-drop-dots presentation is off; **build the two
    distributions dynamically** as draws come in.
  - Reframe as the payoff of Stage B's coffee-shop question (does this group
    still belong?), using the real data. This is the "use this data for real"
    JM wanted — likely **absorbs the cut Stage C**.
  - Strip the heavy overlay text (ancestral lineages, vertical transmission).
- **"Showcase — when two populations stop being one":** **delete.** No reason to
  be here; its two-islands / vertical-transmission prose is exactly the
  over-explaining the notes target.
- **Footer wrap-up:** delete "One sentence to carry forward," "Where this lesson
  goes next," office-hours note. (Covariance foreshadow → see §6.)

---

## 5. What stays (don't over-correct)

- Prediction-before-interaction lock/unlock flow (commitment #1).
- Code panel with slider→line highlighting (commitment #2).
- The scenario *device itself* in L2 — JM explicitly likes having a scenario.
- Average-error read-outs and the dynamic plots.
- Real-data anchoring (NHANES, NBA).

---

## 6. Cross-cutting risks to hold while editing

- **Covariance thread.** Per CLAUDE.md, the closers of L3, L12, L15, L17 pay off
  in L26 (Δz̄ = cov(w,z)/w̄). The "delete all back matter" rule must **not**
  blanket-strip those four closers — rework them to obey the no-jargon rule
  while preserving the thread; name covariance only after the work. L2's footer
  foreshadow is safe to cut.
- **Scoring bit layout.** Adding/removing stages changes the scaffold-bit map in
  `Score.recordCheckpoint(pos, …)` and the `POS_START` table. When L1 Stage C is
  rebuilt and L2 loses a stage, re-derive the bit positions and confirm
  `instructor/verify_code.html` still decodes. Keep `moduleId` == filename.
- **Doc drift.** De-jargoning changes stated lesson endpoints. Update
  PROJECT_PLAN §3.4 and the landing cards wherever they promise a named result
  (e.g. L1's `y ~ Normal(μ, σ)`).
- **Voice.** This plan is analysis; write it plainly. But the *replacement
  student copy* (scenarios, questions, closers) should go through **/mitchell**
  when we draft it — that's the voice the lessons are graded on.

---

## 7. Open decisions — RESOLVED (2026-07-17)

1. **Landing cards:** **title only** — strip both subtitle and lecture tag.
2. **L1 flips:** **10 per round.**
3. **L2 Stage C ("alarm"):** **rebuild as a narrative "how soon could you tell?"
   stage** — not cut. Four-stage L2 stands: A stream · B spot the switch · C
   how soon could you tell · D real-data payoff.

## 8. Suggested sequence

1. Settle §7. 2. Write the global rules into L1 as the reference implementation.
3. Port to L2. 4. Extract any shared copy/UX into the pattern both use.
5. Re-derive scoring bits + update PROJECT_PLAN/landing. 6. Only then sweep L3+.
