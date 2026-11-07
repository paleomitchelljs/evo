# The origins of individuality (Michod) — the capstone ("2X"; slot 24, or after evo-devo)

**File** · not yet built. Rename this file `lessonNN_overhaul.md` once its slot is fixed (Open 1)
**Checks** · `node scripts/check_lessonNN_numbers.js` (to write) · `python3 scripts/check_lessons.py` · `node scripts/check_layout.js`
**Status** · PLANNED 2026-11-07 (JM). A sketch; nothing measured
**Last touched** · 2026-11-07

## JM, 2026-11-07 (verbatim, the 2X part; the whole message is in lesson21_overhaul.md)

> 2X: Michod style origins of individuality extending the hierarchical framework to show how cooperation evolves by shifting
> the weight of cov(w,z) to different levels. This is the full capstone, and perhaps it should come after Evo-devo…I'm not sure

Readings: "the hierarchical framework" = 23's two-level Price equation (between groups, within groups). "shifting the weight of
cov(w,z) to different levels" = the share of a trait's change carried by the covariance among groups against the covariance
among cells inside them; an individual is a group whose inside share has gone to about zero. "the full capstone" = it also
holds the whole stack (gene, cell, organism, species), moved here from the 10-28 target lesson (lesson23_overhaul.md).

## The lecture behind it (docs/2026_lecture_detail.tex, Lec 30-31; verbatim)

- "Replicator ladder": "DNA sequences; chromosomes; genomes; organelles; cells; organisms; superorganisms; populations; species";
  "Each level in latent conflict with the next up".
- "'Individual' means indivisible": "The level where breaking destroys what the thing is"; "Our level special because cells held
  in cooperative equilibrium"; "Not pre-given—imposed by relatedness structure below". 202_lec30_01: "The organism level is where
  fitness covariances are maximally nested in eukaryotes."
- 202_lec30_03: "Your neurons cooperate because they're nearly genetically identical."
- "Cancer is default; cooperation is inherited". 202_lec30_05: "You can only inherit cooperation, because cooperation is the
  thing that persists".
- "Cooperation = suppression of next level down": "Cells suppressed; mitochondria suppressed; genes suppressed (drive
  suppressors)".
- Lec 31, "Michod 2006 group covariance effect": "W = VB = w̄ − Cov(v,b)"; "Group fitness exceeds average cell fitness by
  negative cell-level covariance"; "Cooperation = specialization producing negative lower-level covariance".
- "Kinship necessary, not sufficient": "Convex trade-off v(b) also required for germ–soma split"; "Volvox has it; Gonium doesn't".
- Lec 31, dN/dS "as level-alignment diagnostic"; 202_lec31_03 (Hox): "become so important that any mutation to you is
  catastrophic to the organism. Then the cellular and individual selection pressures align with the gene's".

## What the lesson is

- Cells in a group become an individual as the weight of the trait's change moves from among cells to among groups. Three things
  move it, each a control: how a group starts (one cell or a fragment: relatedness inside it, 22's r), division of labour (germ
  and soma, on a viability–fecundity trade-off the student bends), and suppression (a germ line set aside; policing).
- Worth protecting: the two-level terms computed from the run every generation and shown shifting; Michod's covariance effect
  (group fitness = mean cell fitness − cov(v, b)) read off the run, never stated.

## The model (Michod's; every source to check before it is cited)

- A cell has a viability v (its contribution to the group's survival) and a fecundity b (its contribution to the group's
  offspring). A group's fitness W = V·B, V and B the means over its cells; mean cell fitness w̄ = mean(v·b); so
  W = w̄ − cov(v, b): a group of specialists (some cells all v, some all b) beats the average of its cells (Michod 2006, PNAS
  103: 9113–9117, "The group covariance effect and fitness trade-offs during evolutionary transitions in individuality").
- The trade-off v = f(b): convex (specialists pay) or concave (generalists pay); the germ–soma split pays only on the convex
  curve, and more so in bigger groups (Michod, Viossat, Solari, Hurand & Nedelcu 2006, J Theor Biol 239: 257–272).
- A cheater: a cell lineage that divides faster inside the group and gives less to it. Within-group change favours it,
  between-group change works against it; the propagule's size sets how much within-group variation each group starts with
  (Michod & Roze 2001; Michod 1999, Darwinian Dynamics).
- The volvocine algae as the system: single cells (Chlamydomonas), colonies with no division of labour (Gonium), up to Volvox
  with a sequestered germ line (Koufopanou 1994, Am Nat 143: 907–931; Herron & Michod 2008, Evolution 62: 436–451).

## Shape (a sketch; nothing measured)

    A  cells that stay together. A colony grows from a propagule; a cheater lineage arises by mutation as it grows (15 D's
       cells; "Cancer is default"). Two-level bars each generation: among cells inside colonies, among colonies (23's terms).
       Targets: cheaters win inside and the colonies decline; the colonies hold when each starts from one cell (r inside → 1).
    B  division of labour. Cells specialise along a trade-off curve the student bends (convex, straight, concave), at three
       group sizes. The cov(v, b) term drawn beside group fitness and mean cell fitness. Targets: a germ–soma split that
       appears only on the convex curve, only above a size.
    C  the individual. A germ line set aside (a soma cell cannot found the next group) and policing; the inside term goes to
       about zero. Targets: the inside term near zero by two different controls (20 A's T3/T4 pattern).
    D  the whole stack (from the 10-28 target lesson): gene (22 D's transposon or drive), cell (A-C), organism, species (23)
       as one nested diagram; one trait's change split level by level; where the weight sits, read off the bars.

Real data: volvocine group size against the share of somatic cells (Koufopanou 1994, or realish: JM 2026-09-30, "simulate or
tidy data so it fits"). Nothing on file.

Sources (archived, sources only per CLAUDE.md): `app/archive/lesson26.html` (splitting a change into two pieces), `lesson30.html`
(when cells stop competing: the body), `lesson31.html` (when workers stop reproducing: the colony), `lesson34.html` (what is an
individual); `lesson15_with_D_2026-10-09.html` (the hierarchical Price card: one allele's change among snakes and among copies
inside each).

## Where it goes (Open 1) — recommendation

Recommend slot 24, then evo-devo (25), then mesoevolution (26):
1. The lecture runs that way: Lec 30 Hamilton's rule, then Lec 31 Michod's covariance, then Hox and the limb circuit.
2. The Price thread runs unbroken 22 → 23 → 24, so the capstone is built while 23's two-level machinery is fresh.
3. Evo-devo and mesoevolution need engines the course has never had (a network on a growing 2-D grid; reaction-diffusion), so
   they are the likeliest to slip at the end of term; the goal in structurephilosophy.md names "Price's equation and the ideas
   of species, hierarchical selection, and individuality among other topics", and development is not among those named.
4. Mesoevolution (species selection on development) still closes the course across levels (Lec 29's three timescales: "All
   operate simultaneously; never stop").

The case for after evo-devo: "the full capstone" read as the last lesson; and the limb gives cells that stop dividing when the
network says, and cells that die on cue between the digits (the paddle "sculpted by apoptosis in the interdigital regions":
Ben Tahar et al. 2026, docs/refs), which is soma doing what this lesson explains. Either order can foreshadow the other: if 2X
comes first, evo-devo's growth stage points back to it; if second, the limb plants the picture.

## Measure first

- A two-level engine at page sizes (say 100 colonies, up to 64 cells): time per generation; the inside and between terms exact.
- B's convex/concave result at page sizes, and the group size where the split appears.
- The weighting (cells counted by group size, or groups once): the same question 23 has (lesson23_overhaul.md, 10-28 notes);
  any difference shown as its own bar.

## Open for JM

1. The slot: 24 (recommended) or after evo-devo?
2. The system: volvocine algae (recommended: Michod's own, and a real gradient of sizes), a body of cells (cancer), or a colony
   of workers?
3. D (the whole stack) in this lesson, or left implied by 23 and A-C?

## Items

| # | What | Status |
|---|------|--------|
| 1 | JM's brief (2026-11-07); this plan; the cell level and the stack moved here from lesson 23's plan | done 2026-11-07 |
| 2 | JM rules on Open 1-3 | todo |
| 3 | slot fixed; file renamed | todo |
| 4 | engine prototype; Measure first | todo |

## Rulings

- 2026-11-07: the capstone is Michod-style origins of individuality, extending the hierarchical framework, cooperation evolving
  by shifting the weight of cov(w, z) between levels.

## Do not

- Fuse the two levels' terms into one leftover (WORK_ORDER).
- State that relatedness, a germ line or a convex trade-off makes an individual; students find each from the bars.
- Name the volvocine genera on screen outside a closed box (the no-vocabulary rule).
