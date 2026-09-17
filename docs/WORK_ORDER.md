# Work order — next edit round

**Lesson 10 rebuilt, and everything above it renumbered — 2026-09-16.** JM asked for
the drift lesson to be rebuilt in the Lesson 8/9 shape and moved into slot 10, on
Vellend's framing (drift is differential reproduction *not caused by* heritable
traits), Coop and Chen's gene dropping, inbreeding as a reduction in system size, and
a conservation call about a salamander pond. Six stages, twelve scored slots, no
prediction MCQs; every stage gates on a solve and closes on a lock-in-and-resample
game.

The through-line is one quantity, never named as a term on screen: **one over the sum
of the squared shares** — how many breeders are really in the game. It is checked
against the simulator rather than asserted; it predicts the measured decay of
heterozygosity to within 4% across the whole slider space, including the skewed
corners where the closed-form `N/(1+CV²)` version comes apart.

- **A** — differential reproduction with nothing attached to it. One switch decides
  whether colour changes a breeder's share; off is drift, on is selection, same
  machine. Gate: hold 100 breeders and drive variety under 55% in 25 generations,
  which only the spread slider can do.
- **B** — gene dropping down a fixed pedigree, 8 founders and 68 birds. Founders 7
  and 8 are genealogical ancestors of 10 of the 14 bottom-row birds and have a copy
  down there in only 31% of drops; founders 1, 2, 5 and 6 in 93–95%.
- **C** — inbreeding, with the medical readout (chicks conceived with two broken
  copies) as the thing being measured rather than an aside.
- **D** — the lek, and the bust. **This closes the old "L11 stage B" item below**:
  the game asks which *pairs* of depth and duration cost the same, which is what the
  arithmetic actually supports.
- **E** — the salamander pond. Netting **three** random larvae carries more variety
  than lifting a whole 200-egg mass (4.31 versions per locus against 3.32), and
  releasing a raised mass back *costs the pond* a whole version per locus.
- **F** — the scope ladder: gamete, larva, family, pond. The bar is the Price
  partition drawn; the buttons change what gets counted, not what the pond does.

Verified by `node scripts/check_lesson10_numbers.js`, which drives the shipped page in
headless Chrome and checks three things for every bar: that it is clearable, that the
naive answer (the headcount, "ancestor of everyone", q², "the same duration") does
*not* clear it across 8 dealt rounds, and that the truth sits inside its own band
against the six re-runs the student is shown. All pass. That script is the thing to
re-run after any edit to the simulators.

**Rulings 1 and 2 are closed — JM, 2026-09-17.** *"Every lesson later than 10 is a
super rough draft that will be completely overhauled. Lessons 1-9 are the model forms
so far, as they've been reviewed, revised, and used. Do not worry about overlap with
later lessons."* So Stage F against Lesson 34, and Stage D against Lesson 11 stage B,
are not conflicts to resolve: 11 and up get rebuilt anyway, and Lesson 10 should be
written as though they do not exist yet. **Do not raise overlap with 11+ again.**

**Ruling 3 is closed too, by building it.** Buri's 107 fly lines are back — see the
real-data entry below.

**Real data added to Lesson 10 — 2026-09-17.** JM: *"having real data and simulations
together can be helpful."* Three datasets already in the repo, each doing the job its
stage does with invented numbers, each as a full-width panel under the stage's two
columns. All three fetch and **fail soft**: if the data does not arrive the panel says
so and its stage stops waiting, rather than the lesson stalling behind a file.

- **Stage A — Buri 1956.** 107 bottles, eight males and eight females in each, nineteen
  generations. The student sets an even population size, the page runs 107 fresh
  bottles at that size six times over and lays them on Buri's histogram, and the
  answer is **9.8 against a census of 16**. His classic U comes out on screen: 30
  bottles that had lost the allele, 28 with nothing else left.
- **Stage B — the Ram Mountain bighorn pedigree.** 1,133 sheep, eight generations of
  real parentage. Gene-dropped 200 times: **135 founders had a shot at the 120 lambs
  born 2005 or later, 119 of them have nothing left down there, and what survives is
  the equivalent of about 6.** About 21% of the copies trace to a ram nobody
  identified, which the panel states rather than hides. New derivative
  `data/clean/bighorn_genedrop.json`, built by `scripts/make_bighorn_genedrop.py`.
- **Stage D — Isle Royale.** 61 winters of wolves counted from the air. **Average 21.1,
  drifts like 12.7**, and dragging the start year to 2000 opens it to 16.3 against 7.2.
  Three straight winters at two wolves are what do it.

Scoring went 12 slots to 15. A, B and D now open the next stage only once **both** the
closing game and the real panel are done, so the record is not optional — except when
the fetch fails, which releases the wait. `scripts/check_lesson10_numbers.js` covers
the three new bars: the census answer must miss on Buri, "all the founders" must miss
on the sheep, and the plain average must miss on the wolves at every window the slider
can reach. Twenty checks, all passing.

**Still worth finding data for.** Stage E is the one panel with no real counterpart.
What would serve it is a documented case of the Ryman–Laikre effect — supportive
breeding where a few families' offspring swamp a wild population and the total
effective size *falls*. Hatchery salmonids are the literature. Nothing in `data/` fits
today, and `salamander_morpho.csv` is museum specimens with an extant flag, which is a
survivor-bias substrate and not this. Stage C likewise has no real pedigree with a
known recessive behind it; the Habsburg dynasty pedigree (Alvarez et al. 2009) is the
obvious candidate if you want one.

**The FSJ data is in the repo but not used here.** `data/clean/fsj_*` is Chen et al.
2019's deposit, which is the system JM named — but the `.ped` with the pedigree and
genotypes is not in the repo, only the per-year cohort tables, so there is no pedigree
to drop. Chen et al. also ask for direct contact before re-use (see
`data/raw/fsj_extra/README_fsj.txt`). **That is a call for JM, not for an agent.** If
he has the standing to use it, the FSJ pedigree would be the better Stage B panel than
the bighorn, because it is the study the lesson's framing comes from.

**The renumber.** 12→11 … 27→26, 31→30, 32→31, 35→34, in one pass: files, module ids,
titles, cross-references, `LOCKS.txt`, `index.html`, and `check_lessons.py`'s unit
map. The design-slot gaps now sit at 27/28/29 and 32/33. Nothing released moved:
lessons 1–8 and 6b keep their names and their submission codes, and everything from 9
up was still `x` in `LOCKS.txt`. **Lesson numbers written below this entry predate the
change and are one too high from 12 up.**

`check_lessons.py` gained the rest of the typed-array family in its globals list —
`Uint8Array`, `Float64Array` and `Int32Array` were listed and `Float32Array` was not,
so a page using one read as calling a helper nobody defines.

---

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

**What is still spec.** Lessons 22–26 each keep three later-stage TODO blocks —
the classification drills and real-data stages. Those are deliberately not faked:
several are already covered by scaffolds (S14, S16, S17, S18, S19, S20), and
deciding whether to fold the scaffold in or build a separate stage is a
curricular call.

**Lesson 8 rebuilt on the regression, 2026-09-10.** JM asked for the heritability
lesson to be *about the nature of a linear regression*: the slope of the offspring-on-
mid-parent line as the share of the children's variation that came down from the
parents, and the residual as everything else — including the genetic part of
everything else. **Superseded 2026-09-13** — that sentence is itself the conflation JM
then called out. The slope *is* the heritability and is not a share of anything; R² is
the separate number that prices the deterministic part against the stochastic one. See
the Lesson 8 entry in `docs/LESSON_ATLAS.md`. Five stages: A one family at a time and then five bands (the
regression built as a separate best guess per band, which turns out to be a line);
B Galton's 934 children with the line as an input and the variance split as a bar;
C a model whose leftover comes apart into a genetic block and a life block; D the
same children against three different across axes; E a cut dragged across the
parents, and the response priced by the tilt.

Two things to rule on:

- **The old Lesson 8 is displaced**, archived at
  `_reference/retired/lessons/lesson8_resemblance_2026-09-10.html`. It carried
  Thread C material that is now made nowhere: the 72% base-rate trap, the
  cross-fostered song (culture transmits and produces the same number), the
  four-limbs trait with no genetic variation, the ladder of relatives, and the
  three-roads-plus-adoption-swap drill. Either fold one or two of those in as a
  Stage F, or give them their own lesson. **The substrate-agnostic point JM wants
  kept — inheritance is inheritance whatever the channel — currently survives only
  as the Stage E solved banner.**
- **Stage E previews selection** (choose the parents, the tilt prices the children).
  JM said selection gets its own lesson later. Cut Stage E if that lesson should
  own the move; the other four stages stand without it.

**Deferred, and waiting on you.**

0c. **Arc 2's framing versus its new opener.** Lesson 8's rebuild of 2026-09-03 made it
   the heritability lesson, which is where you asked heritability to be defined. That
   displaced Mendel — the 3:1 and 9:3:3:1 ratios, the pile of 1,000 honest experimenters,
   and Fisher's complaint — to
   `_reference/retired/lessons/lesson8_mendel_ratios_2026-09-03.html`. Two consequences to
   rule on: Arc 2 is still titled "Ratios, baselines, and the two forces that move them"
   and now opens on a continuous-trait lesson with no ratios in it; and Lesson 10 builds
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
5. **Lesson numbering — done 2026-09-15.** JM's call: the old `lesson8b` became
   `lesson9`, and every lesson above it moved up one — files, module ids, titles and
   cross-references, in a single sweep. `lesson6b` was deliberately left alone.
   Nothing released was touched: lessons 1–8 and 6b keep their names and their
   submission codes, and everything from 9 up was still `x` in `LOCKS.txt`, so no
   code a student has already handed in stops decoding. The gaps left by the Arc 5
   collapse now sit at 28/29/30/33/34; those are design slots with no file of their
   own, and they moved with everything else so that no two lessons share a number.

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
  settings produce the same loss. **Done — the stage now asks exactly that, and
  is the file that is today `lesson11.html` (it was `lesson12.html` when this was
  written). The new Lesson 10 stage D asks the same question as a game, which is
  ruling 2 in the entry at the top of this file.**
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

- **Rewrite the skeleton TODO specs out of tell-form.** `lesson23.html:52` states
  "The ratio dN/dS hovers around 1"; `:61` "Watch dN/dS fall toward 0." Those are
  answers written as page copy and will be pasted as page copy. Rewrite each as
  *control + committed prediction, outcome unstated*.
- **Fix L22's anchor quotes.** Stage D (`:76`) anchors on neuronal action
  potentials with an inline gloss that renders as literal asterisks and hands over
  the punchline; Stage C (`:67`) anchors on orthologs vs paralogs, a different
  topic. Same stray-markdown fix in `lesson15.html` and `lesson33.html`.
- **Add streakiness to L1 or L2.** The Lec 10 demo (`:1338` — half the class writes
  fake rolls, half rolls real dice, you sort them almost perfectly) appears in none
  of the 58 student-facing files. L1 currently builds "balance / no lean," which
  serves Thread A. It does not build "randomness is streaky," which is what Arc 2
  runs on.
- **L34's bookend.** Its spec claims a callback to Lesson 1's motion-not-gravity
  framing; Lesson 1 has no such framing (`grep` for it returns only lesson35).
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
