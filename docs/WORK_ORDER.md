# Work order — next edit round

Written 2026-08-24, against the state verified that day: 34 lessons, 25 scaffolds,
1 explorer, `scripts/check_lessons.py` green (0 hard failures, ~110 warnings).

**The organizing goal.** These lessons exist to build intuition for the concepts
that recur across every topic, not to cover the lecture list. Lecture-coverage gaps
are not defects. Three things recur, and the priorities below are ordered by how
badly each is served right now.

| Thread | What it is | State |
|---|---|---|
| **A — the slope** | One number → plus a group → plus a rate → the rate is a covariance → the covariance is the change in the average. Regression, R², heritability, breeder's equation, F_ST and Hamilton's *r* are one object. | ~70% built, **not welded**, and missing its keystone rung |
| **B — the ledger** | Every feature was inherited or invented. Heritability, mutation-as-not-inheriting, IBD vs IBS, homology vs homoplasy, the chopstick fallacy. | ~20% built, scattered, unnamed |
| **C — the discipline** | A pattern is not its own explanation. | ~60% built, one leg missing |

`structurephilosophy.md` already states Thread A as "the one thing underneath all
of it." This work order is mostly a matter of making the build match it.

---

## P0 — do these first

### 1. Build L16a — the weighting rung ✅ DONE 2026-08-24

**Nothing in the repo does this.** `structurephilosophy.md` [22] calls it "the
single most load-bearing insertion in the sequence" and says that without it the
identity at unit 38 is "a magic trick instead of a reunion." Lesson 26 Stage A
currently jumps straight to a reweighted readout (`lesson26.html:68`,
`Δz̄ measured directly (reweight by w)`), so the student sees the answer without
ever having built the object.

**Spec.** A plain scatter the student has already met. Give each point a
copy-count. Points that make more copies pull harder. The student moves the
weights; the data never changes; the fitted line swings. No reproduction framing
at all — just *a slope where some points count more than others.*

**Built** as `app/scaffolds/s25_counting_weights.html`, matching the pattern by
which the other four inserted rungs already ship (S-weld = s23, S-single = s22,
S-cond = s21, S-agree = s24), and avoiding a lesson renumber immediately before
the Arc 5 collapse. Twenty-four trees, trunk width against height, on a curve
that flattens. A dial changes how many times each tree is counted; the
measurements never move; the line swings from 0.330 to 0.175 — an 89% change.
Two scored checkpoints, both keys verified against the scaffold's own code.
Promote to a full unit when renumbering happens.

**Why first.** It is the one build that makes your named goal — the Price equation
landing as recognition — actually possible. Everything else in Arc 5 is downstream
of it.

---

### 2. Weld Thread A with numeric carryover across lessons

`app/assets/score.js:141` already persists per-module state to
`bio202-score:<moduleId>v<version>:<nameToken>`. Add a course-wide namespace —
`Score.carry(key, value)` / `Score.recall(key)` writing to
`bio202-carry:<nameToken>` — roughly fifteen lines, no change to the code format.

Then wire these four hand-offs:

| From | Artifact | To | State |
|---|---|---|---|
| L7 D | the slope fitted through Galton's families | L15 B **is** that lever, not a fresh dial | ✅ wired |
| s25 | the two slopes the student swung by hand | L26 A opens by naming them | ✅ wired |
| L3 C | the per-5cm rate the student landed | L4 A opens on it | still to wire |

**Dropped: L15 → s25.** The original plan chained the response L15 produces into
s25's dial. There is nothing real behind it — s25's dial is a counting tilt over
tree measurements, and no number L15 produces sets it. Forcing the link would be
decorative continuity, which is worse than none: it teaches the student that
these hand-offs are a UI motif rather than the same quantity travelling. The two
welds that survive are both genuine reappearances of one number.

L3 already does this *within* one lesson — B and C open on the 82 kg from A, and
that is exactly what makes their reveals work. Extending the same mechanic across
lessons is what turns five self-contained lessons into one argument. Without it,
L26 A's "the quantity you have been computing since Lesson 3" is an assertion.
With it, it is the student's own number, on screen.

---

### 3. Build Thread B

Mostly connection; one genuinely new stage.

- **New: the dichotomy, before any biology.** Two things share a feature — same
  source, or arrived separately? Lecture material is ready-made: turtle/tortoise
  vs turtle/armadillo (`2026_lecture_detail.tex:141`), lactase persistence with
  four independent origins (`:150`). Place around L2–L3, well before L18 needs it.
- **Promote the chopstick fallacy out of L7's footer into a stage.** It is
  currently a closing caution nobody acts on. It is the cross-topic form of the
  whole thread — genes, language, wealth, religion and diet all vertically
  inherited from the same parents (`:2490`) — and the single best guard against the
  GWAS-style misreading. L6 E's causal-model builder is the right machine already
  built; point it at parents → (genes, culture).
- **Retro-label the existing beads.** L7, L13 A, L18 D and L19 are already running
  Thread B without saying so. Use the S19 pattern — a "what you just did has a
  name" panel that unlocks *after* the doing, never before.

---

### 4. Integrate Descent, split by payload

Do not ship it as one sandbox. It carries three separable things:

| Payload | Destination | Why there |
|---|---|---|
| Coalescence / MRCA | **L10, new Stage E** | Fixation and coalescence are one process run two directions, same 4N (`:1762`). L10 already builds forward fixation; this is its mirror. |
| IBD segments | **Thread B stage, or L14** | IBD is the physical instance of "inherited"; IBS is the trap. |
| Gene dropping | keep as the reveal | "You are genetically zero-related to most of your ancestors" (`:1376`) is the strongest pretest-buster available. |

**Score it.** Unscored means skipped.

---

### 5. Reconcile the 47-unit sequence with the 34 shipped lessons

Right now the sequence in `structurephilosophy.md` and the shipped lessons are
related only through a lookup table buried in `scripts/check_lessons.py:36-47`.
That map is the Rosetta stone for the whole project and it is a Python dict.

- Lift it into `docs/PROJECT_NOTES.md` (done) and keep it current.
- Rule the stage-shape question explicitly: the six roles
  (`orient/predict/act/rebuild/real/break`) are the *design intent*; A–E stages are
  the *shipped form*. Either map the roles onto the letters lesson by lesson, or
  drop the six-role vocabulary. Leaving both in circulation means the next agent
  either enforces a shape that breaks working lessons or ignores the scaffolding
  entirely.

---

### 6. Collapse Arc 5 from seven transitions to three ✅ DONE 2026-08-24

Seven lessons with an identical A/B/C/D shape is the opposite of the variety that
makes Arc 1 work, and the atlas concedes the repetition itself. Keep:

- **L26** — the identity (keystone; Stage A built; now fed by L16a)
- **L30** — cell → individual (has a working simulator; it is the student's own
  body; reuses L14's split bar)
- **L31** — individual → superorganism (L17 D explicitly sets it up; this is where
  it cashes)

**Done.** 27/28/29 are now lesson26 stage D, "the same diagnostic, three times
down the stack" — one panel, a three-way toggle, one plot, three anchors
(dachshund FGFR3, the Alu in a Hox regulator, endosymbiosis and somatic
lineages). 32/33 are now lesson34 stage B, the same instrument pointed above the
individual and then off DNA. Five builds freed; the repetition is gone. The
retired files keep the fuller specs — read them when building these two stages
out.

Also keep **L27b** (`structurephilosophy.md` [39]) on the list — the nesting step
that pries apart the two meanings of "leftover." The philosophy is explicit that
letting them stay fused "is how the rest of the arc turns to mud."

---

### 7. Add the missing leg of Thread C — survivorship

Thread C has the shuffled pile (L5, L6, L8) and default-to-drift (L10, L12 E). It
has nothing for "what you see is what didn't die," which reaches further than
either: albino alligators (`:441`), important genes varying least (`:2255`), the
pupfish ponds that are gone (`:2223`), ancient inbreeding looking harmless
(`:3602`), the peacock's tail meaning only "a tiger didn't get me."

One mechanic: the student is shown a filtered sample and asked to infer the
unfiltered population.

**Note:** S21 (collider) is *not* free for this. It is the designed conditioning
rung `S-cond` [25], placed before units 26 and 29 because both ask the student to
hold something fixed. Reuse its machinery; do not relocate it.

---

## Scaffold absorption

The four `S-` drills in the sequence already exist as scaffolds. That mapping is
load-bearing and was previously undocumented:

| Sequence unit | Scaffold |
|---|---|
| [6] S-weld | s23_sampling_weld |
| [10] S-single | s22_minimal_inference |
| [25] S-cond | s21_collider_dag |
| [36] S-agree | s24_convergent_evidence |

The rest fold into lessons:

| Scaffold | Destination | Note |
|---|---|---|
| s02 residual reading | L3 | Thread A rung |
| s01 no-trend envelope | L5 | |
| s03 HWE counting | L9 | |
| s04 fixation probability | L10 C | **duplicate — retire** |
| s05 time to fixation | L10 B | **duplicate — retire** |
| s06 drift or selection | L12 E | **duplicate — retire** |
| s07 breeder's equation | L15 B | Thread A rung |
| s08 selection coefficient | L12 C | |
| s09 mutation–selection balance | L13 | |
| s10 F / heterozygote deficit | L14 | |
| s11 F_ST and migration | L16 | Thread A rung |
| s12 Hamilton's rule | L17 | Thread A rung — *r* is a slope |
| s13 tree rotation | L18 A | **duplicate — retire** |
| s14 rates across intervals | L20 | fills the skeleton |
| s15 phylogenetic non-independence | L19 | |
| s16 DM snowball | L23 | fills the skeleton |
| s17 mutation target | L21 | fills the skeleton |
| s18 dN/dS | L22 | fills the skeleton |
| s19 convergence vs drift | L24 | **dedupe Anolis** (L18 D, L24 D and s19 are three builds of one demonstration) |
| s20 species as hypothesis | L25 | fills the skeleton |

Six scaffolds fill Arc 4 skeletons outright. "Fifteen builds outstanding" is closer
to eight or nine once absorption is done.

---

## Questions that need a content fix before they can be scored

Found while wiring grading (2026-08-24). Each of these still gates and still
records engagement, but occupies no scored slot, because no option on offer is
defensibly correct at the stage's own defaults. These are content bugs, not
wording bugs — a plain-language rewrite will not fix them.

- **L9 stage B** — "which violation moves the frequency most?" Non-random mating
  moves it *exactly* zero for any starting frequency (`p²+Fpq + pq(1−F) = p`), and
  mutation also moves it exactly zero because the stage starts at p = 0.5, the
  mutational equilibrium. That toggle currently produces no visible effect at all.
  Between the two that do move it, drift vs selection is seed-dependent.
  *Fix:* start the stage at p = 0.3 so mutation visibly pulls toward 0.5, then ask
  which one leaves the mix exactly where it started — a single, provable answer.
- **L9 stage C** — asks about F = 0.3 at N = 200 and keys "the test is weak at
  this N." χ² there is ≈ N·F² = 18; it rejects strongly. *Fix:* ask what happens
  to your ability to notice a *fixed* real shortfall as the sample shrinks.
- **L11 stage B** — asks whether depth or duration matters more. The stage's own
  formula makes loss depend on duration ÷ depth: matched ratios give identical
  loss (37–39% across a 10× range of both), while the ratio swings it from 4% to
  99%. Depth, duration, and "the product" are all wrong. *Fix:* ask what pairs of
  settings produce the same loss.
- **L13 stage A** — built to show that arrival alone does not accumulate because
  drift keeps wiping new mutations out, but at μ = 10⁻⁴ and N = 1000 its own
  readout gives mean final q ≈ 0.34. The simulator contradicts the stage.
  *Fix:* lower μ (or track the fate of individual new mutants rather than the
  mean) so the intended point is what the screen actually shows.

## Deferred: the plain-language question pass

Question wording across all lessons still carries notation and embedded
rationale — `q̂`, `F_IS`, `Pagel's λ`, and options like "Rise (r·b = 0.15 > c =
0.1)" that hand over the reasoning the student is meant to supply. Hold this
pass until lesson content is settled, then do it in one sweep against the
options-state-what-never-why rule. L8's four questions were rewritten this way as
a sample of the target register.

## P1 — same round, lower cost

- **Rewrite the skeleton TODO specs out of tell-form.** `lesson22.html:52` states
  "The ratio dN/dS hovers around 1"; `:61` "Watch dN/dS fall toward 0." Those are
  answers written as page copy and will be pasted as page copy. Rewrite each as
  *control + committed prediction, outcome unstated*.
- **Fix L22's anchor quotes.** Stage D (`:76`) anchors on neuronal action
  potentials with an inline gloss that renders as literal asterisks and hands over
  the punchline; Stage C (`:67`) anchors on orthologs vs paralogs, a different
  topic. Same stray-markdown fix in `lesson14.html` and `lesson32.html`.
- **Add streakiness to L1 or L2.** The Lec 10 demo (`:1338` — half the class writes
  fake rolls, half rolls real dice, you sort them almost perfectly) appears in none
  of the 58 student-facing files. L1 currently builds "balance / no lean," which
  serves Thread A. It does not build "randomness is streaky," which is what Arc 2
  runs on.
- **L34's bookend.** Its spec claims a callback to Lesson 1's motion-not-gravity
  framing; Lesson 1 has no such framing (`grep` for it returns only lesson34).
  Either retarget the callback to L3's ladder, or — better, since "evolution is the
  net change resulting from many forces" *is* Δz̄ = Cov + E in prose — add the
  decomposition framing to L1 so the bookend becomes true and Thread A gets an
  opening.
- **L2's index title** still describes only its first half.
- **Update `docs/LESSON_ATLAS.md`** to cover the 24 scaffolds and the Descent
  explorer. It currently claims to describe "every lesson as it currently stands"
  and omits both, which makes its "Known gaps" section overstate Arc 4 and
  understate everything else.

---

## What to cut

- Four duplicate scaffolds (s04, s05, s06, s13)
- Four Arc 5 lessons (27, 28, 29 into L26; 32, 33 into L34)
- Anolis, from three builds down to one

That is the focus, and it comes out of the existing pile rather than out of new
work.

---

## Deliberately not doing

Lecture-coverage gaps — Lec 14 (Muller's ratchet, sex), Lec 16 (fitness
landscapes, selection patterns), Lec 28 (sexual selection), Lec 31 (evo devo) —
have no lessons. Per the stated goal, that is acceptable: these lessons reinforce
cross-topic reasoning, not lecture content. Recorded here so the absence stays a
decision rather than an oversight. The one worth revisiting later is Lec 16's
frequency dependence, which is a *mechanism* students reuse rather than a topic.
