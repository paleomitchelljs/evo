# Response to the lesson-index critique — steelman + synthesis

Against `docs/lesson-index-critique.md`. For each point: first the **steelman
*against* the critique** (the strongest defense of the current design), then the
**synthesis** (what I concluded and built). Bias this pass toward implementing —
where the steelman didn't fully win, I built the fix rather than only noting it.

Date: 2026-06-07. Overnight pass; **interactive builds were not browser-tested**
(no DOM harness available) — pure logic was unit-tested in Node and DOM id
references were cross-checked, but the items in §"Smoke-test before class" need a
real browser pass.

---

## Verdict table

| # | Critique | Steelman verdict | What shipped |
|---|---|---|---|
| C3.1 | L1 fuses sampling vs residual error | **Critique wins** | L1 names *sampling scatter* vs *individual spread/residual* from the bridge on; forward-refs drift & residual |
| P1 / C1.2 / C3.4 | The sampling weld is unbuilt | **Critique wins** | New **S23**: slope cloud + p′ histogram under one n slider, both → 1/√n; ref'd from L4 & L10 |
| P2 / C1.1 | "covariance" never named | **Mostly wins** | Threaded `cov(x,y)/var(x)` in L3 + refrains in L12/L15/L17; L26 pays it off |
| P5 / C3.5 | collider over-reach, no DAG drill | **Split** | Kept L6's collider (steelman); built **S21** DAG drill ref'd from L6 & L19 |
| P4 | minimal-inference missing | **Critique wins** | New **S22**, paired from L12's footer |
| P3 / C1.4 | all reveals are gotchas | **Split** | Built **S24** convergent-evidence (positive calibration that avoids "clean = trust") |
| C2.4 | distinctive part (Price) unbuilt | **Critique wins** | **L26 Stage A built & wired** (Δz̄ = cov/w̄ as the slope); B–D previews |
| C3.6 | L7 ½h² trap | **Steelman mostly wins** | Lesson is already midparent (=h²); added a clarifying note anyway |
| C3.2 | L2 misordered / redundant | **Steelman wins** | Kept order; added a forward-ref to L5/L6 (foreshadow, not redundancy) |
| C3.3 | L3 keystone too many switches | **Split** | Kept structure (repetition is the design); added a signpost; deferred restructure |
| P6 / C1.3 | one tag conflates 3 axes | **Mostly wins** | Added a three-axis coverage map to `LESSON_INDEX.md` |
| P7 / C2.3 | "trees unit" split | **Split** | Relabeled Unit 3 → interlude; noted the comparative thread |
| C2.1 | stats-first, no frame | **Split** | Added a cold-open payoff frame to L1 |
| C2.2 | scaffold relationship undefined | **Critique wins** | Added a Scaffold-traversal section to `LESSON_INDEX.md` |

---

## C3.1 — L1's two errors (act-first)

**Steelman against.** "Error" is the honest common word, and the two misses *are*
related (both are deviations from a guess). Over-distinguishing in lesson one
risks front-loading jargon that violates "show, don't tell."

**Synthesis.** The steelman loses: sampling error vs residual error is the single
distinction the whole course rests on (drift = sampling error that shrinks with
Nₑ; residual = fixed individual variance σ; SE = sampling error of an estimate).
Fusing them under one word in lesson one is the highest-leverage defect. **Built:**
the A→B bridge now calls the coin miss **sampling scatter** ("flip more coins and
it shrinks — a property of the sample size") and flags that Stage B brings a
*different* miss that does not shrink; Stage C's reveal names the height miss
**individual spread / residual** and contrasts it explicitly ("sampling scatter
shrinks with n — this is drift, Lesson 10; individual spread stays at σ — this is
the residual, Lesson 3"). Naming is distinct from the first stage, as requested.

## P1 — the weld (highest-value item)

**Steelman against.** The two clouds are not literally identical: L4's is a 2-D
bootstrap-*of-data* cloud; L10's is a 1-D *generative* sampling histogram.
Equating them naively conflates the bootstrap with the true sampling distribution.

**Synthesis.** The steelman names a real nuance, not a blocker — both are sampling
distributions tightening at 1/√n, and the bootstrap-vs-generative distinction is a
teachable footnote, not a reason to skip the highest-value unification on the
table. **Built S23** (`app/scaffolds/s23_sampling_weld.html`): one shared n slider
drives a bootstrap slope cloud (left) and a Wright–Fisher p′ histogram (right);
the bottom panel overlays both widths against a 1/√n reference. The Node check
confirms p′SD = √(p(1−p)/n) and the slope-bootstrap SD both scale as 1/√n. The
reveal states the bootstrap-vs-generative point honestly. Referenced as "the same
cloud, later/earlier" from L4 and L10. I chose a self-contained activity over an
in-L10 stage to avoid risking L10's working gate chain untested — it is still
prominent (linked from both lessons).

## P2 — thread covariance

**Steelman against.** `PROJECT_PLAN §3.1` is explicit that the Price/covariance
spine is "an organizing principle for *us*, not a term we hand the student," and
commitment #3 is show-don't-tell. Naming covariance risks turning a manipulated
intuition into memorized jargon.

**Synthesis.** Mostly wins, with a caveat the steelman respects: there is a
difference between *handing over a definition* and *using a consistent word in the
closers so the Price payoff is recognition, not new content*. **Built:** the word
lives only where naming-after-the-work is appropriate — L3's closer writes the
slope as `cov(x,y)/var(x)` once and asks the student to "keep the word," and
L12/L15/L17 closers each name the relevant covariance (cov(fitness,allele);
cov(parent,offspring) & cov(fitness,trait); relatedness as a covariance). L26's
closer collects them. No front-loaded definitions, no mid-stage jargon.

## P5 — collider scaffold

**Steelman against.** L6's collider is a *stage-E rug-pull* after the student has
the shuffle-null machinery; the DAG is shown, not derived; it is exposure, not a
mastery expectation. Removing or down-weighting it would lose the course's best
single demonstration that a significant slope can encode the wrong world.

**Synthesis.** Split: keep L6's collider (steelman wins on that), but the critique
is right that no scaffold drills it and it recurs orphaned in L19. **Built S21**
(`s21_collider_dag.html`): three predict-reveal cases (confounder, Berkson
collider, the rule) plus a guarded `DAG.init` sandbox, ref'd from both L6 ("drill
the collider") and L19 ("same trick as Lesson 6"). The two causal-confound lessons
now share a drill.

## P4 — minimal inference

**Steelman against.** The discipline is already exercised (L5's "what story is this
slope evidence for," L6's wrong-reading verdict, L12's drift-or-selection), so it's
not a coverage hole.

**Synthesis.** The critique wins on the specific move it isolates — the
*retrospective* problem (one realized Δp; what can you license?) is distinct from
all of those *prospective* exercises. **Built S22** (`s22_minimal_inference.html`):
four cases where the only licensed claim is "copies out-replicated," with
over-claims (selection, adaptation, continuation) as distractors, ending on "what
would upgrade it to selection?" → replication or Nₑ. Paired from L12's footer as
"the inverse problem."

## P3 — positive calibration

**Steelman against.** Several reveals are already constructive (L1 builds a bell,
L10 builds drift, L15 builds the response, L17 builds cooperation), so it isn't 19
straight gotchas. And a naive positive-calibration lesson risks the opposite
miscalibration — teaching "a clean result is trustworthy."

**Synthesis.** Split. The steelman is right that constructs exist and that
"clean = trust" is a trap; but the narrow gap is real — no reveal teaches *how
you'd know you can trust a result*. **Built S24** (`s24_convergent_evidence.html`)
as a *convergent-evidence* drill, not a clean-result drill: trust comes from
several methods with **independent failure modes** agreeing (and case 2 shows
disagreement localizing a confound; case 3 shows that methods sharing a blind spot
agreeing proves nothing). That teaches calibration in both directions and dodges
the steelman's trap.

## C2.4 — build the distinctive part (L26)

**Steelman against.** The stubs track lecture that may not each need an activity,
and the Price principle is "realized as ordinary activities" — the built lessons
already drill the covariance implicitly, so Price-the-equation can stay light.

**Synthesis.** The critique's strategic risk is real: the distinctive terminus is
nine consecutive stubs while the built lessons keep getting polished. **Built L26
Stage A** as a real interactive: a population with trait z and fitness w(z); the
student sets the fitness slope and watches `cov(w,z)`, `w̄`, `Δz̄ = cov/w̄`, the
fitted line of w on z (slope = cov/var), and a direct reweighted-mean check that
confirms the Price identity. The Node test confirms Δz̄(Price) = Δz̄(direct) exactly
and slope(w~z) = the set fitness slope. This is the P2 payoff made literal: "the
covariance of fitness with the trait *is* the regression slope you've fit since
Lesson 3." Stages B–D (two-level, diagnostic, Hamilton-from-Price) are upgraded
from dev-TODO placeholders to student-facing previews; wiring them is the next
build (alongside L27–L33).

## C3.6 — L7 ½h²

**Steelman against (wins).** The lesson uses the **midparent** predictor
throughout, so the slope genuinely equals h², not ½h². "Split by child sex" splits
the *children*, not the parents — each sex-specific regression is still
child-on-*midparent*, so the slope is still h². The critique's premise ("split by
sex implies single-parent regression") does not hold here.

**Synthesis.** Even though the lesson was correct, the confusion is one keystroke
away, so I added a one-line note in Stage C: the midparent slope reads h² directly;
a single-parent regression gives ½h² (double it). Cheap insurance.

## C3.2 — L2 order

**Steelman against (wins).** L2 is *resampling / change-detection* (a bootstrap CI),
legitimately before the permutation null of L5 — the two are different objects. The
"any null gets rejected" line is the closer's flourish, not the lesson's core, and
it's the seed of L6, not a duplicate of it.

**Synthesis.** Kept the order. Added a *Foreshadow* paragraph to L2's closer making
the L5/L6 connection explicit (so it reads as deliberate setup, not an orphaned
advanced point).

## C3.3 — L3 keystone churn

**Steelman against.** Repetition-across-datasets *is* the stated design
(`PROJECT_PLAN §2`), and L3's drill stage is where it's supposed to happen. The
keystone earns its length.

**Synthesis.** Split, leaning steelman. Restructuring a 1,380-line keystone
untested is high-risk for low marginal gain, so I added a signpost to L3's intro
framing the structure ("install once on weight, then re-run the same move on new
data; if a round feels repetitive, the design is working") rather than gutting it.
A fuller "teach the core on one dataset, then proliferate" restructure is
**recommended but deferred** — flagged here so it isn't lost.

## P6 / C1.3 — taxonomy axes

**Steelman against.** The single tag is a compact *communication* device for the
instructor, not an audit instrument; the conflation is a feature.

**Synthesis.** Mostly wins for the critique — the audit payoff is real and cheap.
Added a **three-axis map** to `LESSON_INDEX.md` (math operation / pedagogical event
/ curricular role) while keeping the compact tag as the authoritative concept
label in `PROJECT_PLAN §3.4`. The map immediately surfaces the §1 gotcha pattern
(the pedagogical-event column is mostly "corrective") and the now-closed
DAG-scaffold gap.

## P7 / C2.3 — trees unit

**Steelman against.** L24/L25 are filed by their *lecture* unit (speciation /
macroevolution), which is a defensible curricular choice, not an error.

**Synthesis.** Split. Renamed "Unit 3" → "Trees & comparative methods — interlude"
in the index and noted that the comparative thread continues in L24/L25 by lecture
unit. The label no longer over-promises a four-lesson unit. Pulling L24/L25 up is a
renumbering job left as optional.

## C2.1 — stats-first frame

**Steelman against.** The lectures supply the evolution frame; these are homework
drills, not the course (`PROJECT_PLAN §1`). The motivational arc lives in lecture.

**Synthesis.** Split. The frame is cheap to state and the index/L1 are the right
place. Added a cold-open paragraph to L1 ("Why coins and heights, not finches?")
naming the payoff arc to L10/L15/L19.

## C2.2 — scaffold traversal

**Steelman against.** Scaffolds are explicitly "thin" optional drills; the
relationship is "optional remediation," arguably obvious.

**Synthesis.** Critique wins — stating it is the index's job and free. Added a
**Scaffold traversal** section: scaffolds are failure-triggered remediation, done
after the paired lesson; the four cross-cutting drills (s21–s24) are done after
*both* lessons they bridge.

---

## Smoke-test before class (untested in a browser)

All logic was Node-tested and DOM ids were cross-checked, but please click through
these once in a browser (open `index.html`, or the file directly):

1. **L26** — Stage A: confirm name-gate unlocks the stage, the prediction unlocks
   the slider, and moving the fitness slope updates the scatter, the fitted line,
   and all five readouts (cov, w̄, slope, Δz̄, direct Δz̄ — the last two should
   stay equal). The final code should appear after ~4 slider moves.
2. **S21 / S22 / S24** — predict-reveal flow: each case locks the next until
   submitted; the final score code appears after the last case. S21's DAG sandbox
   should mount (it's guarded — it just hides if `dag.js` fails).
3. **S23** — the prediction unlocks the n slider; both histograms and the rate
   plot should redraw and visibly narrow as n rises; SDs update.
4. New cross-reference links (L4/L6/L10/L12/L19 footers) resolve to the right
   scaffold files.

## Deferred (recommended, not done)

- **L3 restructure** (teach core on one dataset, then proliferate) — C3.3.
- **L26 Stages B–D** wired (two-level Price, diagnostic permutation,
  Hamilton-from-Price) — the rest of the keystone.
- **Pull L24/L25 up** into a 4-lesson comparative block — P7's stronger option.
- A fuller **positive-calibration *lesson*** (S24 is the scaffold-sized version).
