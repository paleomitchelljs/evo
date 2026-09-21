# Standing warnings and pinned constants

**This file is not a work log and not a style guide.** It holds two things: the
mistakes that have already been made once, and the numbers that were measured
expensively enough to be worth not re-deriving. Round-by-round history lives in
`docs/overhauls/lessonNN_overhaul.md`. Pedagogy lives in
`structurephilosophy.md` and `docs/LESSON_STYLE.md`.

Nothing here is a design rule. Everything here is a fact or a trap.

---

## Traps

**Do not retry the Florida scrub-jay deposit as a drift-vs-selection panel.**
`fsj_allele_freq_subset.csv` is 250 SNPs over 24 years and looks perfect for
"is this streak drift or selection?". It is not: the observed year-to-year
variance in frequency is **below** what independent binomial sampling at the
stated depths would produce on its own, because the cohorts overlap — the same
birds are resampled year to year. A neutral envelope built the obvious way
overstates the real one, and the panel would teach the opposite of what it
claims. The flat FSJ heterozygosity curve is the same fact from another angle.

**Do not sum the two Price terms.** `priceTerms` keeps `cov` and `within`
separately named and never adds them. The scatter around a fitted line and the
change within a lineage share a shape and are not the same object. A shared
engine is exactly where the two would quietly fuse into one "leftover", so they
stay split even in lessons where only one is live.

**Do not fuse the two F's.** Kinship down a pedigree rises under drift alone;
`1 - Ho/He` compares this generation's heterozygotes against *this generation's
own* frequencies, which have already drifted, so under random mating it sits at
zero however small the population is. Measured: 0.228 against −0.074 at N=40
over 20 generations. Lesson 11 Stage C draws both and makes the difference the
point.

**Do not extract the core generation operator to `app/assets/pop.js` yet.**
`makePop`, `makePool`, `breed`, `breedFreq`, `reallyInTheGame`,
`acrossGenerations` and `priceTerms` are byte-identical in `lesson10.html` and
`lesson11.html`. Extract at the **third** caller, not the second — three working
instances give an API, designing one from zero gives a guess. The same rule
applies to `wireBowling`.

**Do not add F_ST, migration, or a between-population comparison yet.** Both
lessons are written against an operator taking **one pool per parent slot**, so
a second population is a new argument rather than a rewrite. Replicate runs
(107 bottles, the 20, the 40) are fine — they are the sampling distribution of
one process, not a comparison between populations with different histories.

**A bar chosen by eye is either unreachable or free**, and you cannot tell which
by reading the page. Sweep the controls and measure before fixing any target,
tolerance or window.

**A check that fails one run in twenty teaches nothing.** Size tolerances off
the measured run-to-run spread and say in the comment what that spread was.

---

## Pinned constants

Closed forms the simulators are checked against. If an engine is ever extracted,
its test suite pins to these.

    effective size from shares      Ne = 1 / sum(p^2)
    heterozygosity decay            H(t) = H(0) * (1 - 1/(2Ne))^t
    half-life of variety            about 1.386 N generations
    fixation probability            u(p) = (1 - e^(-4Nsp)) / (1 - e^(-4Ns))
    two sexes                       4 Nm Nf / (Nm + Nf)
    varying size through time       the harmonic mean of the sizes
    uneven offspring                divide by (1 + cv^2)
    coalescent depth                about 2N generations
    neutral diversity               4 N mu / (1 + 4 N mu)

Real-data numbers already measured off the shipped panels:

    Buri 1956          107 bottles, 32 copies, 19 generations. H 0.500 -> 0.1616,
                       which is 5.93% a generation, an effective 8.2 against a
                       census of 16. 58 of 107 bottles fixed by generation 19;
                       107 simulated bottles of sixteen flies reach about 25.
    Isle Royale        moose 42 winters 1959-2000; the Lesson 6 model (b 0.260,
                       d 0.200, extra 0.60, 1976 and 1996 marked) sits about 108
                       moose off the record. Wolves, 61 winters: average 21.1,
                       drifts like 12.7, and the plain average misses at every
                       start year the slider reaches.
    LTEE               twelve populations from one clone. Spread 0.021 at
                       generation 0 against a repeat-measurement bar of 0.022;
                       0.206 at 50,000 against a bar of 0.099. The leader
                       changes hands repeatedly; several lineages evolved higher
                       mutation rates, which the panel says out loud.
    Ram Mountain       1,133 sheep. 49 founders (98 copies) had a shot at the 120
                       lambs born 2005 or later; about 38 of those copies are
                       still there. NB: an earlier build reported "135 founders,
                       119 with nothing left", which counted founders old enough
                       to have had a shot rather than founders that actually feed
                       the cohort. 49 is the honest number.
    Human diversity    two copies in one person differ at about 1 base in 1,000;
                       new marks land at about 1.25 per 10^8 bases per
                       generation. The arithmetic gives an effective size around
                       20,000 against eight billion people.

---

## Known and deliberate

`scripts/check_lessons.py`'s `LESSON_UNIT` table still carries unit ids from a
sequence that no longer exists. Its own comment says they are notes rather than
gates; they only order the `--terms` report. Left alone.
