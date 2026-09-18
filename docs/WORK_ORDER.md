# Work order — next edit round

> **Re-read against the rewritten `structurephilosophy.md`, 2026-09-17.** Four
> things below changed meaning that day:
>
> - **Lessons 1–9 are the model form; 10–11 are current; everything from 12 up is
>   a nebulous draft — content, order, number and structure all in doubt** (JM).
>   Every item below about a lesson numbered 12 or higher is therefore a note
>   about what a file currently contains, not a commitment to fix it in place. Do
>   not spend a pass polishing one.
> - **The 47-unit sequence, the five arcs and their minute budgets are void.**
>   Items below that reason about "Arc 2's framing" or an arc boundary are
>   reasoning about a structure that no longer exists; they are kept because the
>   *content* question inside each one is usually still real. `PROJECT_NOTES.md`
>   §3 and §7.
> - **The stage-shape ruling (was P0-5) is closed.** The six roles are retired,
>   organization is free to vary, and gate-on-solving is the rule. Removed below.
> - **Vocabulary got stricter, not looser**: no vocabulary is taught at all, the
>   naming-after-the-fact panel is retired, and the only legal home for jargon is
>   the R code panel. Any item below that talks about where a term "unlocks" is
>   void. `PROJECT_NOTES.md` §4.

**Lesson 10 revised against JM's design notes — 2026-09-17 (second pass).**
His notes, and what each became:

- *"Dragging interactive in Part E is great. Instead of a slider, the graph
  should be wider & dragging should occur directly on the graph."* — the `E_s`
  slider is gone. The scatter has its own full-width row and the red line is
  dragged directly. **One thing had to change to make that work and it is worth
  knowing:** across the whole usable range of `s` the true line's endpoint moves
  0.182 offspring, which on an axis holding raw counts of 0–9 is **six pixels**.
  Nobody can grab six pixels. So the panel is now two frames — left, the three
  genotype classes and their average offspring on a band zoomed around 2, which
  is where the line lives and what you drag; right, the 200 breeders at natural
  scale with the same line over them, so the zoom is honestly labelled. The
  slider had been hiding the fact that the quantity being set is tiny next to
  the cloud it is drawn on.
- *"The 'Play it Through' animation for Part C is fantastic... Kind of a
  'bowling' approach."* — built as `wireBowling(stage, cfg)` and used in **A, B,
  C and D**. Set the conditions, hit roll, the controls lock, the run animates,
  and it reports hit or miss at the end. Written general (target text, predicate,
  frame painter, hit count) so the next lesson takes the helper. **Extract to
  `sim.js` at the third caller.** The pattern is recorded as a live rule in
  `PROJECT_NOTES.md` §4 because JM asked for it "in this & subsequent lessons".
- *"Part A's walkthrough is great. The middle graph is unneeded."* — the
  share-against-copies scatter is gone from A; the pond and the frequency line
  now sit together, which is what the roll needs.
- *"terms like 'allele' should be freely used throughout"* — done across the
  lesson. This is consistent with the vocabulary rule, which permits exactly the
  biological terms an introductory student already has.
- *"Turning Part A into a game where they need to get one allele to extinction
  within X generations 5 times to progress"* — built: 30 generations, five
  landed rolls. Measured: 8 breeders flat lands 85% of rolls, 40 breeders at
  spread 2.6 lands 78%, and **300 breeders flat lands 0%** — so the default pond
  cannot walk it and the student has to find the setting.

**Still owed on this pass.** Stage A's closing game and stage B/D's committed
estimates were left on their existing wording; the roll replaced their *gates*,
not their questions. Worth a read-through for register now that the stage shape
around them has changed.

**Lessons 10 and 11 rebuilt from scratch — 2026-09-17.** JM asked for a total
overhaul of both, aimed at three things: what causes drift, what makes it go
faster or slower, and laying foundations for drift–selection balance, neutral
diversity, coalescence and F_ST **without making any of those explicit**. He
chose the arc himself: **10 is drift, whole; 11 is ancestry, whole.** Nothing
was carried over from either old file — both are archived under
`_reference/retired/lessons/`.

- **Lesson 10** (`version: 2`, `scaffold: 13`, five stages). A random
  differential reproduction with nothing attached · B **the error is
  inherited** — one switch decides whether the next generation's parents come
  from the generation before it or from the pond the run started with, and the
  amount of randomness per generation is identical either way · C 107 ponds and
  the two absorbing walls · D three routes to a smaller system (uneven shares,
  a lopsided lek, a bust) · E the slope and the scatter.
- **Lesson 11** (`version: 5`, `scaffold: 12`, five stages). A the gap between
  the pairings you can count and the pairings random mating would give · B gene
  dropping down a fixed 52-bird tree · C two numbers that are not the same
  number · D which of the two is doing the damage · E the walk run backwards.

**Stage B of Lesson 10 is the new thing and the one to protect.** One switch,
two settings, everything else identical. Measured: at 25 breeders over 200
generations the inheriting pond fixes 19 of 20 and ends 0.476 from where it
started; the fresh-start pond fixes **0 of 60 over 300 generations** and its
typical distance from the start sits flat at ~0.05 however long it runs. That
contrast is the whole of "the random error itself is inherited" and it costs
one argument in the operator.

**Rulings taken on the way.**
- **No F_ST, no migration, no multiple-population comparison yet.** JM: *"the
  pure inbreeding statistic (F = 1 - (Ho / He)) is the only point we're
  currently at. But having it built so that **in a later lesson** we can
  slightly expand a known activity to include Fst/etc would be ideal."* Both
  lessons are written against an operator that takes **one pool per parent
  slot**, so a second population is a new argument rather than a rewrite.
  Replicate ponds (Buri's 107, the 20 in 10B, the 40 in 10E) are fine — they
  are the sampling distribution of one process, not a comparison between
  populations with different histories.
- **The scope ladder (old Lesson 10 Stage F) is cut.** It is about what counts
  as an individual, not about drift, and it was the one stage with no real
  anchor. The code is in git history.

**The core operator is duplicated verbatim between the two files and should be
`app/assets/pop.js`.** `makePop`, `makePool`, `breed`, `breedFreq`,
`reallyInTheGame`, `acrossGenerations` and `priceTerms` are byte-identical in
`lesson10.html` and `lesson11.html`. They were written general on purpose:
`share` flat is drift and a function of the genotype is selection; `pools` is
where migration goes; `copy` is where mutation goes; both are defaulted and
exercised. **Extract them when a third lesson wants them, not before** — three
working instances give an API, and designing one from zero gives a guess. When
extracting, the engine needs its own test suite pinned against the closed forms
this round measured: `Ne = 1/Σp²`, H decaying at `1/(2Ne)`, half-life `1.386N`,
`u(p) = (1-e^(-4Nsp))/(1-e^(-4Ns))`, `4NmNf/(Nm+Nf)`, the harmonic mean,
coalescent depth `2N`, and `4Nμ/(1+4Nμ)`.

**`priceTerms` keeps `cov` and `within` separately named and never sums them.**
The rule is that the scatter around a fitted line and the change within a lineage
share a shape and not an identity. It used to live in `structurephilosophy.md`
§"The one thing underneath all of it"; that section was struck 2026-09-17 and the
rule moved verbatim to `PROJECT_NOTES.md` §1, which is now the citation. A shared engine
is exactly where those two would quietly fuse into one "leftover", so the two
terms are split from day one even in lessons where only one is live.

**The bar checks are `scripts/check_lesson10_numbers.js` (42 checks) and
`scripts/check_lesson11_numbers.js` (41 checks).** Both drive the shipped page
in headless Chrome. They now check a fourth thing beyond the old three: **no
constant answer may clear three rounds of any closing game.** Each game's three
round classes are tested for an empty common interval. That check caught two of
the four defects below.

**Four real defects the checks caught, all fixed, all of which come back if the
simulators are edited carelessly:**
1. **Lesson 11 Stage C claimed two routes to one number, and they are not one
   number.** Kinship down the pedigree rises under drift alone; `1 - Ho/He`
   compares this generation's two-tone birds against *this generation's own*
   frequencies, which have already drifted, so under random mating it sits at
   zero however small the pond is (measured: 0.228 against −0.074 at N=40 over
   20 generations). The stage now draws both and makes the difference the
   point, and its committed estimate asks for the gap after twenty generations
   of a pond of thirty where nobody ever chooses a relative — the answer is
   **nothing**, while 0.27 of the founders' variety really did go. **Do not
   re-fuse them.**
2. **Lesson 10 Stage E's second bar sat at 35 of 40 where the right answer
   produces 36.7 ± 1.8** — a bar a correct student fails one run in six. Now 33.
3. **Three of the six closing games could deal the same round twice**, which
   let one constant clear all three. Every game now rotates three fixed classes.
4. **`neFromDecay` was fitting into the tail**, where mean variety is a handful
   of unfixed ponds and its log is nearly all noise. That biased every small-Ne
   estimate shallow. It now fits only where H is above 5% of its start.

**Real data, five panels, all failing soft.**
- **10C — Buri 1956.** 107 bottles, 32 copies each, 19 generations. Heterozygosity
  falls 0.500 → **0.1616**, which is 5.93% a generation, which is a pond of
  **8.2 against a census of 16**. By generation 19, **58 of 107** bottles have
  one colour left; 107 simulated bottles of sixteen flies only reach ~25. That
  gap is the door into Stage D.
- **10D — Isle Royale.** 61 winters. Average **21.1**, drifts like **12.7**.
  The plain average misses the band at every start year the slider reaches.
- **10E — the LTEE fitness lines.** Twelve populations from one clone. At
  generation 0 they are spread **0.021** against a repeat-measurement bar of
  0.022 — indistinguishable. At 50,000 they are spread **0.206** against a bar
  of **0.099**. The leader changes hands repeatedly. Several lineages evolved
  higher mutation rates, which the panel says out loud.
- **11B — Ram Mountain.** 1,133 real sheep. **49 founders (98 copies) had a
  shot at the 120 lambs born 2005 or later; about 38 of those copies are still
  there**, and about 8 of the cohort's copies came from an animal nobody
  identified. NB the retired build reported "135 founders, 119 with nothing
  left" — that counted founders old enough to have had a shot rather than
  founders that actually feed the cohort, which inflates the story with
  founders that have no descendants there at all. 49 is the honest number.
- **11E — no file, and that is the point.** Two published constants (two copies
  in one person differ at ~1 base in 1,000; new marks land at ~1.25 per 10⁸
  bases per generation) and the stage's own arithmetic give **≈20,000**. There
  are eight billion people. The slider stops at 60,000.

**The FSJ deposit was evaluated for 10E and rejected — do not retry it without
reading this.** `fsj_allele_freq_subset.csv` is 250 SNPs over 24 years, which
looks like the perfect "is this streak drift or selection?" dataset. It is not:
the observed year-to-year variance in frequency is **below** what independent
binomial sampling at the stated depths would produce on its own, so a neutral
envelope built the obvious way overstates the real one and the panel would
teach the opposite of what it claims. The cohorts overlap — the same birds are
resampled year to year — so the sampling is not independent. The flat FSJ
heterozygosity curve recorded elsewhere in these notes is the same fact seen
from another angle.

**Known and deliberate:** `check_lessons.py`'s `LESSON_UNIT` still labels
lesson10 as `L11 seq 16` and lesson11 as `L12 seq 17`. Its own comment says the
ids are notes rather than gates and are already stale against the sequence the
course follows; they only order the `--terms` report. Left alone.

**Still worth finding data for.** Lesson 11 Stage D has no real counterpart. The
Habsburg pedigree (Alvarez et al. 2009) is the obvious candidate — a real
pedigree with real inbreeding coefficients and real recessive outcomes — and it
would let the stage say the thing it currently only simulates.

---

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
any lesson migrates, or `--style` and `--terms` go silently blind. *(Written when those
were hard failures rather than reports — see the banner on `COPY_FRAMEWORK_PLAN.md`. The
ordering still matters; the stake is smaller.)*

**Status 2026-08-24**, in the vocabulary of the time. The back half is built out. All
lessons then shipped carried a working interactive with a prediction gate and at least one
scored checkpoint;
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

0c. **The 8–9 boundary, and the displaced Mendel material.** *(Written as an
   "Arc 2 framing" question; arcs are void as of 2026-09-17, so read it as a
   question about lessons 8, 9 and 10 in sequence.)* Lesson 8's rebuild of 2026-09-03 made it
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
   material for that definition. **The ledger-unlock half of this item is void as of
   2026-09-17** — per-term unlock units are gone from `ledger.json`, and the live rule
   is that no vocabulary is taught anywhere. What survives is the content question:
   if heritability is played with as a knob in 7 and never defined, is anything owed
   in 8, and can it be owed without naming it? `lesson9.html` is the precedent for
   "yes, and without the name".

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
2. ~~**The stage-shape ruling.**~~ **Closed 2026-09-17.** The six roles are
   retired with the document that specified them; organization is free to vary, in
   service of the goals in `PROJECT_NOTES.md` §1. A/B/C/D/E is lettering.
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

## Found 2026-09-17 — `check_lesson11_numbers.js` fails intermittently on correct code

**Not a lesson bug, and not caused by the Lesson 10 work** (`lesson11.html` was not
touched). At least **two** of its bars fail some of the time and pass the rest, which
means the script cannot currently be used as a pass/fail gate:

**Measured: 2 failures in 5 conclusive runs** (a sixth produced no output at all,
probably a Chrome launch hiccup — worth knowing the harness does that). Two *different*
bars failed, so it is not one bad check:

- **"A only the packaging moves"** — asserts a null (non-random mating moves the
  packaging, not the allele frequency) against a fixed tolerance of `0.03`, averaging
  **12 replicates**. Seen failing at 0.491 vs 0.546, and again at 0.482 vs 0.568 — a
  difference of 0.086 against a 0.03 bar.
- **"C the gap does not answer to the headcount"** — seen failing with *"a pond of 80
  gives 0.011, a pond of 20 gives -0.102"*.

Both are null-assertions with a fixed tolerance and a small replicate count, which is
the shape that produces this. **The fix is to measure the sampling distribution of each
statistic and set the replicate count from it**, rather than to loosen the tolerance —
loosening makes the bar stop testing the thing.

Raising A's replicate count from 12 to 200 was tried and is deliberately **not** in the
tree. The one suggestive data point: across the six runs, A failed only on a run using
the original 12, while the runs at 200 failed on C instead. That is consistent with the
under-powering diagnosis but it is n≈1 and the runs straddled the revert, so it is a
lead, not a result. Do the whole script in one pass with the variance actually measured.

Run it a few times before trusting a green result.

---

## Opened 2026-09-17 by the philosophy rewrite

- **Individuality and hierarchical selection are now named destinations.**
  `structurephilosophy.md` ends on *"Price's equation and the ideas of species,
  hierarchical selection, and individuality."* Two weeks earlier the scope ladder
  was cut from Lesson 10 as *"about what counts as an individual, not about
  drift"* — a correct call about that lesson, which now leaves content owed
  somewhere else. The code is in git history and the fuller build specs are in
  `_reference/retired/lessons/`. **Decide where it goes; do not rebuild it into a
  drift lesson.**
- **Shared assets are a stated primary design focus, not an efficiency.** That
  raises the priority of `app/assets/pop.js` above where the entry at the top of
  this file left it. The "extract at the third caller" rule still holds — three
  working instances give an API and designing one from zero gives a guess — but
  the third caller is now something to go looking for rather than something to
  wait for.
- **The `--terms` report has three hits inside the revised lessons**: `mean`
  (lesson 2), `95% interval` (lesson 5), `heritability` (lesson 7). Under the
  no-vocabulary rule each is a thing to look at. They sit in JM-owned, released
  lessons, so they are reported, not edited. **Ask before touching.**

---

## What to cut

- Four duplicate scaffolds (s04, s05, s06, s13)
- The four folded back-half lessons (27, 28, 29 into 26; 32, 33 into 34 — written
  as "Arc 5" before arcs were void; the folding is done, the numbering gaps remain)
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
