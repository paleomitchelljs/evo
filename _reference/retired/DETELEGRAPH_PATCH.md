> **APPLIED 2026-06-06.** Every rewrite below (and a sweep of the remaining
> em-dash justifications) has been made in `app/lessons/lesson1–7.html` — note the
> files now live under `app/lessons/`, not the `lessons/` paths written below.
> Mean option length L1–L7 dropped from 8–12.5 words to 4.4–6.6, matching L8–L19.
> Kept for the record; do not re-apply. See `docs/reviews/HOMEWORK_REVIEW.md §6`.

# De-telegraphing patch — L1–L7 prediction options

The one pedagogical failure that survives contact with the actual code: in the
early lessons, prediction options are full sentences that embed the reasoning
the student is supposed to generate. The student can pick the right answer by
reading the explanation printed inside it, so the "reveal" is pre-spoiled. This
violates the project's own non-telegraphing commitment ("options are values or
claims, not values-with-embedded-reasoning").

It is **localized**. Measured mean option length (words) per lesson:

| L1 | L2 | L3 | L4 | L5 | L6 | L7 | L8–L19 |
|----|----|----|----|----|----|----|--------|
| 10 | 12.5 | 11 | 9 | 12.2 | 8.3 | 10.4 | 3.2–7.7 |

L8 onward already does this right (bare values, near-numeric options). The fix is
to bring L1–L7 in line with L8–L19 — **not** to redesign anything. The
interactions, stages, data, and structural moves are sound.

**Rule:** an option states *what*, never *why*. Strip every clause that explains,
justifies, or defines. Keep distractors as bare competing claims (ideally the
common misreadings), so the student supplies the reasoning and the reveal still
lands.

Below: the worst verbatim offenders and concrete rewrites. Apply by hand or have
Claude Code do the string replacements in `lessons/lessonN.html`.

---

## L1 — Stage B, naming the mean

**Before**
- "The value that, used as a single guess for every random adult, minimizes how wrong you'll typically be. The population mean, μ."
- "The typical spread of individual heights around any guess. The standard deviation, σ."

**After**
- "The population mean, μ"
- "The standard deviation, σ"
- "The median height"
- "The tallest height in the sample"

The student just *found* the error-minimizing value in the slider stage; the
option should make them match that experience to a name, not read the match.

---

## L2 — Stage B, the incompatibility statement

**Before**
- "\"If I keep predicting 'a 168-cm population is producing these draws,' that prediction is now incompatible with the data. Whatever's generating the draws is no longer that population.\""

**After**
- "The original population can no longer be producing these draws"
- "The original population is producing unusually tall draws by chance"
- "Nothing can be said until more draws arrive"

---

## L3 — Stage A (best constant) and the intercept question

**Before**
- "The population mean — squared errors punish being far away, so the balance point of the distribution minimizes the total penalty"
- "The population median — it splits the population in half by count"
- "The predicted weight of an adult with height = 0 cm — geometrically meaningful, biologically nonsense unless you center the predictor"

**After** (best constant)
- "The mean"
- "The median"
- "The mode"
- "Any constant scores the same"

**After** (intercept α̂)
- "The predicted weight at height = 0 cm"
- "The average weight in the sample"
- "The weight gained per cm of height"

The "biologically nonsense unless you center" insight is the *point* of the
reveal — it must not sit inside the option.

---

## L5 — Stage C, the p-value reading

**Before**
- "\"If we'd shuffled the predictor to break any real relationship, 2% of those shuffled slopes would have been at least this far from zero — so the observed slope is unusual under a no-link world.\""

**After**
- "2% of shuffled slopes are at least this far from zero"
- "There is a 2% chance the real relationship is null"
- "There is a 98% chance the relationship is real"

The first is correct; the other two are the textbook misreadings. Stated as bare
claims, the student must distinguish them — which is exactly the skill Stage C
exists to test. With the reasoning printed, it tests reading comprehension.

---

## L7 — Stage C, reading h² off the slope

**Before**
- "For every 1 inch a couple's midparent height is above average, expect their adult child to land about 0.65 inches above. h² ≈ 0.65; 'regression toward the mean' is the geometric consequence of h² < 1"
- "For every unit a couple's midparent trait exceeds the population mean, the predicted child exceeds the mean by β̂ units — i.e., β̂ is the heritability h²"

**After** (make it a numeric prediction)
- "About 0.65 inches above average"
- "About 1 inch above average"
- "About 0.35 inches above average"
- "The same as the midparent — 1 inch"

The slope → h² identity and "regression to the mean" are the conclusions of the
stage. Ask for the *number*; let the identity be the thing they realize when the
fitted slope turns out to equal h².

---

## L4 and L6 (lighter)

L4 (mean 9 words) and L6 (8.3) are milder. The same rule applies to any option
carrying an em-dash followed by a justification (e.g. L6's "a small but nonzero
fraction (under 2%)" is fine; "… because the means are so far apart that almost
no overlap exists" is not). Trim the post-dash clause.

---

## Not in scope (verified already built)

While checking the repo, these review recommendations turned out to be already
implemented — do **not** action them:

- L3 LOTR anchor + film-split (stages L and E exist).
- L6 Simpson's/DAG rug-pull (stage E, the violent-movies proxy).
- L17 interactive r=0 drift null (stage A).
- L18 branch-length intuition (stage E, BM on a tree).
- L16 F_ST inverter + Atlantic cod round (stage C + Round 2).
- L12 label-the-trajectory drill (stage E).
- L1 two-group between/within coda (final stage).
