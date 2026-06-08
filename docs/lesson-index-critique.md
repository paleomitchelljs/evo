# Critique — Lesson Index (Evolution course)

Compiled against `LESSON_INDEX.md` (2026-06-06). Organized as: cross-lesson
critiques, organizational critiques, specific-lesson critiques, and pitches.

---

## 1. High-level cross-lesson critiques

**There are two spines, and only one is reinforced.** The course claims a single
"everything is one object" thesis, but it runs two distinct unifying threads. The
*regression* spine is hammered relentlessly: L3 (residual), L4 (slope SE), L5
(permutation), L7 (h²=slope), L15 (R=h²S=slope), L19 (PGLS as slope-after-subtraction).
That repetition is the goal. But the *covariance/Price* spine — the one the course
supposedly terminates in — is almost absent until L26. The word "covariance" appears
nowhere in the built lessons; it first surfaces in the L26 stub. This matters because a
regression slope already *is* cov(x,y)/var(x). The course drills the covariance six
times without ever naming it, so when Price arrives it reads as new content instead of
the category collapse it should be. Fix is nearly free (see P2).

**The one weld explicitly requested is missing.** The Wright–Fisher widget was meant to
"share machinery with the regression-uncertainty activity." In the index they are Seed 1
(L4) and Seed 4 (L10), six lessons apart, with no cross-reference. L4's reveal ("the
cloud's width *is* the standard error") and L10's reveal ("random copying doesn't
reproduce proportions") are the same sampling-distribution fact — the (α,β) cloud and the
p′ histogram are the same object, both cov/var statistics tightening as 1/√n. The course
knows this at the level of seed-labeling but never makes a student *see* it. Highest-value
unification on the table; currently unbuilt.

**The "structural move" taxonomy conflates three axes.** The labels mix (a) mathematical
operations — "category collapse," "dimensional reduction"; (b) pedagogical events —
"model failure," the rug-pull; and (c) curricular roles — "primitive," "Seed." These
don't compose. The *math* labels are individually defensible (e.g., "dimensional
reduction" genuinely fits L1's μ,σ and L10/L11's Nₑ). The problem is that because the
three axes live on one tag, the taxonomy can't be used to audit coverage — you can't ask
"are all the math operations drilled?" or "are the pedagogical events varied?"

**The reveals are monotonically corrective; there's no positive-calibration lesson.** L1
is constructive (build a bell), so it isn't 19 straight gotchas. But after L1 the pattern
is overwhelmingly "you thought X, actually not-X": clean residuals don't confirm (L3),
significant≠big (L5), collider artifact (L6), chopstick trap (L7), HWE never true (L9),
F>0 means not-one-population (L14), tip order meaningless (L18), sign flip (L19). Not one
payoff is "your intuition was right, here's why the machinery agrees, and here's how
you'd know you can trust it." Twelve consecutive rug-pulls train a defensive crouch —
distrust every clean result — which is its own miscalibration.

---

## 2. Organizational critiques

**Seven statistics lessons before recognizable evolution, with no visible motivational
frame.** For a 200-level *Evolution* course, L1–L6 are a stats course using biology as
anchor data; evolution a student would name as such arrives at L7 or L8. The finches and
fossils appear in Unit 1 only as residual-drill fodder. The arc is probably correct, but
the index shows no cold-open justifying the deferral. Students should see in L1 that the
coin flip pays off as a finch-beak prediction by L15, or Unit 1 floats unanchored.

**The scaffold↔lesson relationship is undefined.** s01–s20 are mapped to lessons but the
index never states the intended traversal — prerequisite, co-requisite drill, or
failure-triggered remediation. A reader can't tell whether to do s02 before L3, alongside
it, or only after stumbling. Structural hole in a document whose job is to be the
authoritative catalog.

**"Trees & comparative methods" is named as a unit but split across three units.** Unit 3
is two lessons (L18–L19), while tree-reasoning content sits in the Unit 4–5 stubs: L24
(convergence vs drift vs shared ancestry) and L25 (species delimitation) are
phylogenetic-thinking lessons living outside the phylogenetics unit. Either pull them up
for a real 4-lesson comparative unit, or accept trees as a 2-lesson interlude and stop
calling it a unit. The topic boundary and unit boundary currently disagree.

**The distinctive part of the course is the unbuilt part.** L26–L34 — Price at nested
scopes, levels of selection, individuality — is what makes this course distinctive rather
than a generic well-built evo-stats course, and it is nine consecutive stubs. Strategic
risk: the built lessons keep getting iterated (the 2026-06-06 fixes show active
refinement), the capstone never gets the same passes, and the delivered course is
"excellent stats + popgen that trails into titles."

---

## 3. Specific-lesson critiques (front of Unit 1)

**L1 — the "error" ambiguity is the highest-leverage defect in the course.** Stage A's
coin-flip error (sample proportion vs 50/50) and Stage B's height-guess error
(observation vs prediction) are both called "error," but they are *sampling error* and
*residual error* — the two things the entire course depends on keeping apart. Drift =
sampling error (L10); residual = unexplained variance (L3); SE = cloud width (L4). All
three downstream distinctions fail if L1 fuses the two errors under one word in lesson
one. Name them differently from the first stage. Make this fix before any other.

Separately, L1's reveal bundles four ideas (CLT, mean as error-minimizer, μ/σ as dials,
between/within coda → y~Normal(μ,σ)). The between/within coda is the ANOVA-decomposition
seed and is load-bearing, but stapling it to the CLT lesson may overload the opener.

**L2 — misordered, and possibly redundant with L6.** Teaching "with enough data any null
gets rejected" as lesson *two*, before the null is formalized in L5, asks for a subtle
power-vs-significance point with no scaffolding under it. The same insight reappears in L6
("sample size, not effect size, drives it"). Either L2 is foreshadowing L6 (then say so
and make it a callback) or it's redundant. The changepoint showcase is also advanced for
second position.

**L3 — the keystone has too many context switches.** Six dataset changes in one lesson:
LOTR → NHANES weight → NHANES +height → five-round drill → Beren & Cyrus growth → LOTR
rug-pull → vagus-nerve showcase. The repetition-across-datasets philosophy is right *for
the course*, but the keystone is where the concept is first installed, and installing it
while juggling six domains works against retention. Teach the core on one dataset
thoroughly, then proliferate in L4–L5. The Popperian reveal ("a clean residual doesn't
confirm a model, a patterned one rejects it") is the best line in Unit 1 — protect it from
the churn.

**L4 — correct, but this is where the drift bridge should be planted and isn't.** See §1.
The Dover-cliff/coccolith showcase is a good deep-time hook. But L4 building the slope's
sampling cloud and L10 building the proportion's sampling cloud with no weld between them
is the central missed opportunity.

**L6 — a collider in lesson six is over-reach.** Colliders are a recognized
graduate-level stumbling block. The DellaVigna collider + DAG one lesson after p-values
asks students to hold regression, significance, *and* causal-graph reasoning at once,
having met the first two the previous lesson. No scaffold covers DAG/collider reasoning
anywhere in s01–s20 — a coverage gap the separated taxonomy (P6) would have surfaced. The
collider reappears as L19's Simpson's-paradox-on-a-tree, so the course has two
causal-confound lessons with no shared drill.

**L7 — well-built, with one technical trap.** Moving the ≈0.65 discovery to Stage D is the
right correction. But watch the h²-vs-slope identity: midparent–offspring regression
(Stage C) gives h² directly, but single-parent regression — implied by "split by sex" in
Stage D — gives ½h² and needs doubling. The lesson should be explicit about which slope
equals h² and which equals ½h².

---

## 4. Pitches

**P1 — Build the weld lesson (or stage): the cloud and the histogram are the same
cloud.** One activity: set p, draw N, read the p′ histogram's spread; then fit and
bootstrap a slope; then see the two clouds are the same shape and both equal cov/var
sampling distributions tightening at 1/√n. The requested unification and the most
conspicuous gap. Highest value.

**P2 — Thread "covariance" from L3 onward.** Not a new lesson — a vocabulary discipline.
Write the slope as cov(x,y)/var(x) at least once in L3, then reuse "covariance" verbally
in L12 (Δp), L15 (R=h²S), L17 (Hamilton). Then L26's Price decomposition lands as "the
slope you've used six times, with fitness as the predictor" — a category collapse instead
of new material. Makes the single-spine thesis actually true rather than aspirational.

**P3 — Add a positive-calibration lesson.** One lesson whose reveal *confirms* a clean
result, built on a case where the naive slope, the PIC/PGLS slope, and an experimental
estimate all agree — teaching convergent evidence and when to trust. Antidote to the
gotcha monotony in §1.

**P4 — Pull the minimal-inference question into the course (stage in L12, or a
scaffold).** An observed Δp licenses only "copies out-replicated" — not "selection
mattered," not individual fitness, not continuation. Not currently in the index. L12 is
the forward simulation (selection is correlation, drift is scatter); this is the *inverse*
problem (one realized change — what can you license?). The honest answer is "almost
nothing without replication or Nₑ." It's the retrospective-vs-prospective distinction the
course skips, and the bridge from exam question to drift lecture.

**P5 — Give causal-graph reasoning its own scaffold and pair L6 with L19.** Colliders are
too important and too hard to be a coda in two unconnected lessons. A dedicated
DAG/collider drill, referenced by both L6 and L19, fixes the L6 over-reach and the
orphaned-confound problem.

**P6 — Split the "structural move" tag into three axes** (math operation / pedagogical
event / curricular role), so coverage can be audited. Immediate payoff: it would have
flagged that every pedagogical event is a rug-pull (§1) and that no scaffold covers DAGs
(§3, L6) — both invisible under the current single label.

**P7 — Consolidate the comparative unit.** Move L24 and L25 adjacent to L18–L19 for a
coherent 4-lesson trees block, or relabel Unit 3 as an interlude. Don't let the topic
boundary and unit boundary disagree.

---

**Act on first:** P1 (the weld) and the L1 error-naming fix — nearly everything downstream
(drift as sampling error, residual as unexplained variance, SE as cloud width) is
load-bearing on those two distinctions being clean from the start.
