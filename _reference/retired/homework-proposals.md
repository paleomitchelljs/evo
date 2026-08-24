# Interactive Homework Activities — Proposals

## 1. Regression core via the LOTR adaptation dataset

Use the book-to-film adaptation data (page number vs. movie timestamp, one point per matched quote; source: `bariumbitmap/lotr-adaptation-graphs`) to teach the core regression concepts.

- **Intercept** — what "zero" means; where the film starts relative to the book.
- **Slope** — if you know where you are in the book, what that tells you about where you are in the film.
- **Residuals** — quotes that appear out of order between book and film.
- **Covariates** — structural features (e.g., excluded chapters) that add information.
- **Uncertainty** — emphasize the uncertainty cloud around each slope.
- **P-value** — introduced once the slope is grounded.

**Sequencing philosophy:** Early homework should hammer the same conceptual core — intercept, slope, residual — repeatedly across *different* datasets, reinforcing the same logical/mathematical understanding before introducing new material.

## 2. Minimal-inference exam question (heritable trait at increased frequency)

Present a situation where a heritable trait has increased in frequency. Have students examine it and state only what can legitimately be said: that individuals with the trait made more of themselves (copies of the trait out-replicated the alternative) — **not** that selection mattered.

## 3. Lecture point: drift as sampling error

Use the exam question above to motivate drift.

- Drift is the simple fact that random chance does not produce *exactly* equal proportions.
- *How inexactly* sampling distorts proportions is a function of distance from infinite — that is, it is sampling error.
- This links drift → sampling → a method for examining random copying, showing that inexact proportionality *is* sampling error.

## 4. Random-copying (Wright–Fisher) widget

Build a sampling-distribution demo as an early activity:

- Student sets `p` and `N`.
- Run repeated draws (random copying); record `p′` each time.
- Read the spread off the histogram of `p′`.
- Increasing `N` collapses the distribution onto `p`, making "inexact proportionality is sampling error" visible.

Intended to share machinery with the regression-uncertainty activity (Activity 1).
