# Homework review — Evolution activities

*A code-grounded review of the built homework, for instructor use. This version
supersedes the prior one: it is written against the actual repository
(`github.com/paleomitchelljs/evo`, read directly), not against the inherited
adversarial/steelman summaries, which turned out to be stale.*

Date: 2026-06-06.
Verified inventory: **19 wired activities** (`app/lessons/lesson1–19.html`, each
with one `Score.init`), **15 stubs** (`app/lessons/lesson20–34.html`, ~100 lines,
no `Score.init`), **20 scaffolds** (`app/scaffolds/s01–s20`).

---

## 0. Repo vs. docs — read this first

I cloned `main` and checked it against the project docs. Several load-bearing
claims in the docs (and in the prior review) do not match the repository:

> **Applied 2026-06-06.** The pedagogy items in §3, §4, and §6 (de-telegraph
> L1–L7, fix the L11 FSJ load, tighten the L15 one-liner) have been done, and the
> `app/` restructure was adopted and the docs reconciled to it. A follow-up pass
> then: confirmed v3 scoring is live and set a real `Score.DEFAULT_SALT` (§6.6–6.7);
> redesigned L7 Stage C/D so the ≈0.65 slope is discovered in Stage D rather than
> pre-announced in Stage C; moved the applied `DETELEGRAPH_PATCH.md` into
> `docs/reviews/`; and added `docs/LESSON_INDEX.md` (a point-by-point catalog).
> The table and open-items list below are annotated with the resolution. See
> `PROJECT_PLAN.md §8`
> for the layout decision and the L11 detail.

| Claim in the docs / prior review | State (updated 2026-06-06) |
|---|---|
| Restructured under `app/` (`app/lessons`, `app/assets`, `instructor/`, `docs/`) | **Done.** Live layout: `app/lessons`, `app/scaffolds`, `app/assets`; instructor tools in `instructor/`; reviews in `docs/reviews/`, conceptual map + proposals in `docs/ideas/`. `index.html` stays at the root; back-to-index links repointed to `../../index.html` |
| `score.js` emits an opaque v3 code (XOR + MAC + elapsed time) | **Done.** `app/assets/score.js` emits `moduleNvVER.base64url(cipher).mac6` — keystream-XOR + 6-hex MAC + elapsed time, real `DEFAULT_SALT` set, round-trip tested. Cleartext v1 is legacy-decode only |
| Pre/post-vs-scaffold is an open decision | **Already resolved.** No `Score.init` carries `pretest`/`posttest`; no `recordPretest/Posttest` calls remain; `scripts/strip_pretest_posttest.py` is present. Scaffold bits are the only graded signal |
| Lessons 20–34 partly fleshed | Confirmed stubs (no scoring) |
| L11 FSJ data-load bug | **Fixed.** `app/lessons/lesson11.html` now fetches `fsj_allele_freq_subset.json` and reads `freq_total` (had read a nonexistent `r.p`); displayed/downloaded R repointed to the subset CSV |

**Reconciled 2026-06-06.** The `app/` restructure was adopted: activities, assets,
instructor tools, and review/idea docs were moved into `app/` and `docs/`, and
`README.md`, `CLAUDE.md`, `PROJECT_PLAN.md`, and this file were updated to match
the live layout. `CLAUDE.md`'s `app/…` paths now resolve. **Scoring is also done:**
`app/assets/score.js` emits v3 opaque, tamper-evident, time-stamped codes (it
already did — the docs were stale), and a real `Score.DEFAULT_SALT` is now set and
round-trip tested. The only infra item left open is the *optional* standalone
minimal-inference prompt (§6, item 4) — not a gap.

---

## 1. Orientation

This repo is homework, not the course: the lecture sequence (concepts in
`evolution_course_conceptual_map.md`) introduces; these activities drill. An
activity earns its place by performing a structural move — **category collapse**,
**unit-dissolves-into-population**, or **dimensional reduction** — with the Price
decomposition (`cov(w,z)`, "selection is the correlation, drift is the scatter")
as the recurring primitive.

**What the build actually looks like.** Every wired lesson uses a
predict-before-interact gate (verified: `onReady` / `locked` / `disabled` /
`unlock` gating in all 19) and a stage rhythm of A → B → C → D, several with an E
rug-pull. The five-part rhythm I previously demoted to "one shape among several"
is in fact the de facto backbone of the built lessons — which is fine; I'd keep
it non-mandatory for *new* activities but acknowledge it's how these were made.

**What each activity actually captures** (corrected): scaffold prediction bits +
per-stage manipulation counts + a cleartext name/hash token. **No** pretest,
**no** posttest, **no** elapsed time. The prior "pretest(2)·scaffold(N)·
posttest(2)·time" model was wrong on three of four counts.

---

## 2. The headline finding: the lessons are more complete than the review claimed

The adversarial/steelman passes — and the prior version of this review, which
inherited them — were written against an earlier build. A large fraction of
their marquee "one key change" recommendations describe features that are
**already implemented**:

- **L3** already opens with the LOTR adaptation scatter (stage "L — intercept and
  slope, on data you already have intuition for," Jackson's *Fellowship*) and
  closes with the film-split rug-pull (stage E, "the films have different slopes
  … within each, the relationship is much tighter"). The review says to *add*
  both.
- **L6** stage E is already the DellaVigna violent-movies proxy/collider with an
  explicit DAG — the "Simpson's-paradox rug-pull" the review says to add.
- **L17** stage A is already "the null — pure drift, no Hamilton math, five
  replicate trajectories" — the exact interactive `r=0` rebuild the review calls
  for, contradicting its claim that stage A "does nothing."
- **L18** stage E already introduces branch lengths and Brownian motion on a tree
  — the prerequisite the review says L18 lacks for L19.
- **L16** already has the F_ST inverter (stage C) and the Atlantic cod Round 2.
- **L12** stage E is already "Drift, selection, or both? Five trajectories."
- **L1** already ends with "the same machine, but on two groups" (between/within).

Net: the activities genuinely fit their concepts and perform their structural
moves. They do **not** need the rebuilds the old review proposed. Treat the
inherited verdict map as obsolete.

---

## 3. The one real pedagogical failure: telegraphing options in L1–L7

This survives. Early-lesson prediction options are full sentences with the
reasoning baked in, so the student selects the right answer by reading its
explanation. Measured mean option length (words):

| L1 | L2 | L3 | L4 | L5 | L6 | L7 | L8–L19 |
|----|----|----|----|----|----|----|--------|
|10|12.5|11|9|12.2|8.3|10.4| 3.2–7.7 |

Verbatim worst case (L7): an option reads *"…expect their adult child to land
about 0.65 inches above average. h² ≈ 0.65; 'regression toward the mean' is the
geometric consequence of h² < 1."* The option is the answer key.

The irony: L1–L7 are described in the old review as the strongest, most-polished
lessons. By the project's **own** non-telegraphing standard they are the weakest,
and L8–L19 (bare, near-numeric options) are the model to copy. Concrete
before/after rewrites for the worst items are in `DETELEGRAPH_PATCH.md`. This is
a string-level fix; no interaction changes.

A second, milder show-vs-tell note: a few scenario blocks name the term and give
the formula up front (e.g. L10 states "the variance is p(1−p)/(2N)" before the
student produces it). This is setup, not reveal, and is mild — the "one sentence
to carry forward" closers correctly name concepts *after* the work. Leave unless
trimming for length.

---

## 4. Concept-fidelity flags — checked against code

The prior review raised several concept flags as "verify in code." Verified:

- **Precision note 3 (R = h²S vs Fisher's Fundamental Theorem), L15 — mostly
  clear.** "Fisher" / "fundamental theorem" appear nowhere. L15 does carry the
  lecture's compressed line "additive variation sets the magnitude" (quote
  `202_lec19_01`), which note 3 flags — but its stage C ("watch h² collapse:
  additive variance falls, the response asymptotes") teaches the correct
  responsiveness/ceiling idea through manipulation, and the closer ties R=h²S to
  the regression spine well ("same regression, different rows"). **Action:** a
  one-line tightening of the summary so "magnitude" doesn't read as "S and Va set
  it independently." Minor.
- **Precision note 1 (drift: p is state, not a knob), L10/L11 — clear.** L11
  stage A states heterozygosity decay at rate 1 − 1/(2Nₑ) (Nₑ only, no p), and
  L10 stage C is "Fix(p₀) = p₀" (p₀ as the state setting the absorption outcome,
  not the rate). The category error the note warns about is not present.
- **Precision note 2 (Nₑ "always" below census), L11 — verify wording only.** Not
  audited line-by-line; check the prose doesn't assert "always."

### The Seed 2 question (minimal inference) — revised down

I previously called the minimal-inference activity ("a heritable trait rose →
say only that copies out-replicated, not that selection mattered") an "outright
hole." That overstated it. The discipline is exercised across **L5** ("the slope
is a number — what causal story is it evidence for?"), **L6** (the verdict that's
the wrong reading of the world), and **L12** ("drift, selection, or both?"). A
dedicated standalone inference prompt could still be a clean short addition, but
it is not a gap in coverage. Demoted from "build this" to "optional."

---

## 5. Verdict map (corrected)

Concept fit is **real** for all 19 (each performs its stated move on real data).
The only open craft item, where present, is option telegraphing (§3) or a small
named fix. "Already built" marks features the old review wrongly flagged as
missing.

| # | Title | Move | Real open item |
|---|---|---|---|
| 1 | Adding up coin flips until a bell appears | dimensional reduction | de-telegraph options; two-group coda already built |
| 2 | Resampling to ask if new data still belongs | dissolve into population | de-telegraph options |
| 3 | Subtracting the line and reading what's left | primitive (Seed 1) | de-telegraph options; LOTR + film-split already built |
| 4 | Finding the cloud of lines that all fit | primitive (Seed 1) | light de-telegraph |
| 5 | Shuffling the predictor | primitive (Seed 1) | de-telegraph the p-value option |
| 6 | Same biology, four verdicts | dimensional reduction | light de-telegraph; Simpson's/DAG already built |
| 7 | How much of a parent ends up in their child | category collapse | de-telegraph the h² option (worst in repo) |
| 8 | Counting the ratios that breed true (Mendel) | dissolve into population | none material |
| 9 | The population where nothing changes (HWE) | dissolve into population | none — template |
| 10 | Watching alleles wander (Wright–Fisher) | dimensional reduction (Seed 4) | none — note 1 clear |
| 11 | Reading drift in the wild (Nₑ) | dimensional reduction | **fix the FSJ data load**; check note-2 wording |
| 12 | Pushing the frequency with selection | selection vs drift | none — label drill already built |
| 13 | Where deleterious alleles are held in place | model failure | none material |
| 14 | Counting heterozygote deficits (F) | dissolve into population | none |
| 15 | The response to selection is a regression line | primitive / collapse | one-line precision-note tightening |
| 16 | Spreading or staying — migration | category collapse | none — inverter + cod already built |
| 17 | Helping relatives | Price special case | none — r=0 null already built |
| 18 | Reading trees with rotated nodes | category collapse | none — branch lengths already built |
| 19 | Removing the family resemblance (PGLS) | category collapse | none material |

---

## 6. What's actually open

Pedagogy:
1. ~~De-telegraph L1–L7 prediction options.~~ **Done 2026-06-06.** Applied
   `DETELEGRAPH_PATCH.md`'s named rewrites (L1 mean-naming, L2 incompatibility,
   L3 best-constant + intercept, L5 p-value, L7 h²/slope) and swept the rest:
   every option's post-dash justification was trimmed so options state *what*, not
   *why*. Mean option length L1–L7 fell from 8–12.5 words to 4.4–6.6, matching the
   L8–L19 baseline (3.2–7.7). Correct-answer tokens unchanged, so scoring is intact.
2. ~~L15: tighten the "additive variance sets the magnitude" one-liner.~~
   **Done 2026-06-06.** The closing now reads R = h²·S = S·(Va/Vp): S sets the
   magnitude, additive variance sets responsiveness (h²) and the consumed-variance
   ceiling — not an independent magnitude. The verbatim lecture anchor quote is
   left intact (it is the framing the activity refines).
3. ~~L11: fix the FSJ data load.~~ **Done 2026-06-06.** See the §0 table / 
   `PROJECT_PLAN.md §8`. The real common-SNP heterozygosity is nearly flat, so the
   stage now honestly teaches "don't overfit a bottleneck"; header softened to match.
4. *(Optional, still open)* a standalone minimal-inference prompt; not a gap.

Infrastructure (the real open questions, none of which are pedagogy):
5. ~~Decide the `app/` restructure.~~ **Done 2026-06-06.** Adopted `app/`; all docs
   reconciled; broken `../index.html` back-links repointed to `../../index.html`.
6. ~~Decide the scoring upgrade.~~ **Done 2026-06-06.** `app/assets/score.js`
   already emitted v3 opaque, tamper-evident, time-stamped codes (the "unbuilt"
   claim was stale). Verified encode → decode round-trips; tampered code and wrong
   salt fail. The instructor tools (`verify_code.html`, `aggregate.html`) decode v3.
7. ~~Set a real salt.~~ **Done 2026-06-06.** `Score.DEFAULT_SALT` is a real
   project-wide salt folded into the keystream + MAC; `init` and `decodeCode` resolve
   a blank salt to it, and the instructor tools prefill it. Rotate it + bump module
   `version`s to invalidate a class's codes.

Scaffold scoring is already lean (bookend bits were stripped; S06 keeps per-round
bits). If any scaffold stays graded, give it per-round bits like S06; otherwise
collect no codes for it.
