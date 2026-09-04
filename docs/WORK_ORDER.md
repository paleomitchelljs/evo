# Work order — next edit round

**Deferred and queued, 2026-09-02 — the copy framework.** Every student-facing string
(1,825 across 54 pages) moves into one keyed block per lesson, so a lesson's words can be
read and changed in one place instead of being welded into markup and JavaScript. Full plan
in [`COPY_FRAMEWORK_PLAN.md`](COPY_FRAMEWORK_PLAN.md); JM asked to pick it up the weekend of
6–7 September or the week after. The one thing that must not be skipped is ordering: the
gate strips `<script>`, so `check_lessons.py` has to learn to read the copy block *before*
any lesson migrates, or the vocabulary ratchet goes silently blind.

**Status 2026-08-24.** Arcs 4 and 5 are built out. All 29 lessons now carry a
working interactive with a prediction gate and at least one scored checkpoint;
`scripts/check_lessons.py` is green. What remains is content review, not
construction — which is the point at which the prose and question wording want
your passes rather than more building.

**What is built.** Every lesson has a simulator. Every scored slot has a writer.
Every answer key in Arcs 4 and 5, and in the ten lessons graded earlier, was
measured off the shipped code rather than assumed.

**What is still spec.** Lessons 21–25 each keep three later-stage TODO blocks —
the classification drills and real-data stages. Those are deliberately not faked:
several are already covered by scaffolds (S14, S16, S17, S18, S19, S20), and
deciding whether to fold the scaffold in or build a separate stage is a
curricular call.

**Deferred, and waiting on you.**

0c. **Arc 2's framing versus its new opener.** Lesson 8's rebuild of 2026-09-03 made it
   the heritability lesson, which is where you asked heritability to be defined. That
   displaced Mendel — the 3:1 and 9:3:3:1 ratios, the pile of 1,000 honest experimenters,
   and Fisher's complaint — to
   `_reference/retired/lessons/lesson8_mendel_ratios_2026-09-03.html`. Two consequences to
   rule on: Arc 2 is still titled "Ratios, baselines, and the two forces that move them"
   and now opens on a continuous-trait lesson with no ratios in it; and Lesson 9 builds
   Hardy–Weinberg without the Mendelian ratios that used to set it up. Either the arc
   boundary moves so Lesson 8 closes Arc 1 beside Lesson 7, or Mendel returns as its own
   lesson ahead of 9.

0b. **Lesson 8 inherits heritability's definition.** Lesson 7's rebuild of 2026-09-03
   plays with heritability as a knob and never defines it, per your ruling. The old
   Lesson 7 — the Galton parent–offspring build, four stages of it — is archived at
   `_reference/retired/lessons/lesson7_galton_heritability_2026-09-03.html` and is the
   material for that definition. Note the ledger still pins the `heritability` unlock to
   unit L8, which is `lesson7.html`; if the definition lands in `lesson8.html` (unit L9,
   seq 14) the unlock should move with it. Either seat passes the gate today, so this is
   tidiness, not breakage.

0. **Lesson 6's displaced content.** The rebuild of 2026-09-03 replaced the old
   Lesson 6 ("same biology, four different verdicts": non-transitive
   non-significance, n = 30 against n = 300, the movie-versus-crime showcase). It is
   archived at `_reference/retired/lessons/lesson6_four_verdicts_2026-09-03.html`.
   Those Thread-A points about reading a verdict are now made nowhere in the
   sequence. Fold them into Lesson 7, make a drill of them, or drop them on purpose —
   but decide, rather than losing them by omission.

1. **The plain-language question pass.** Wording across all lessons still carries
   notation and, in places, options that explain themselves. Hold until content
   settles, then sweep once against the options-state-what-never-why rule.
2. **The stage-shape ruling.** Six roles in `structurephilosophy.md` versus the
   shipped A–E stages; both vocabularies are still in circulation.
3. **Thread B's early rung.** The dichotomy still arrives late, in tree
   territory. S26 poses it but the biology-free version is still owed.
4. **Regenerate `docs/LESSON_ATLAS.md`.** It is banner-flagged as stale and
   should be rebuilt in one pass now that the structure has stopped moving.
5. **Lesson numbering.** Gaps at 27/28/29/32/33 after the Arc 5 collapse.
   Renumber in one sweep or not at all — module ids carry the submission codes.

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
