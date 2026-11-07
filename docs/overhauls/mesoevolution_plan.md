# Mesoevolution: species selection on development, deep homology ("2Z"; after evo-devo, before the Michod capstone: JM 2026-11-07)

**File** · not yet built. Rename this file `lessonNN_overhaul.md` once its slot is fixed
**Checks** · `node scripts/check_lessonNN_numbers.js` (to write) · `python3 scripts/check_lessons.py` · `node scripts/check_layout.js`
**Status** · PLANNED 2026-11-07 (JM). A sketch; nothing measured. Needs 23's species-level engine and the evo-devo lesson's
limb network (evodevo_plan.md)
**Last touched** · 2026-11-07

## JM, 2026-11-07 (verbatim, the 2Z part; the whole message is in lesson21_overhaul.md)

> 2Z: simulation combining species selection & EvoDevo to illustrate "mesoevolution" in the sense that some traits are more
> likely to involve repeatedly & within certain groups. Maybe also illustrating deep homology

Reading: "more likely to involve repeatedly & within certain groups" = more likely to evolve repeatedly, and within some clades
more than others.

## The lecture behind it (docs/2026_lecture_detail.tex, Lec 29 and 31; verbatim)

- "Three timescales": "Micro: alleles within population, generations"; "Meso: gene regulatory networks, millions of years";
  "Macro: speciation/extinction, tens to hundreds of millions"; "All operate simultaneously; never stop".
- "Morphospace": "Theoretical morphospace vast; realized morphospace patchy". "Two sources of gaps": "Developmental constraint:
  regulatory networks can't build all shapes"; "Ecological constraint: buildable but selected against".
- Lec 31: "The most important things change least"; Hox "half-billion years, near-zero changes"; "Phenotypic difference lives in
  architecture around them". 202_lec31_05: "The same FGF/BMP/sonic-hedgehog/gremlin module that makes a limb also makes a
  pancreas or a taste bud. What changes is which enhancer is active where."
- Lec 31, hair against coral symbiosis: "Same forces, different weights".

From the papers (docs/refs/README.md): "some forms gradually become stabilized by canalizing selection over time" (Zhang et al.
2012); one network with "adjusted kinetic parameters and limb bud contours, but conserved regulatory network topology" makes
fossil fins and paddles (Zhu et al. 2010, via Zhang et al.); "digit loss in tetrapods ... could be reexamined as a modulation of
growth rate relative to processing and propagation" (Ben Tahar et al. 2026); digits form back to front in amniotes and front to
back in the axolotl (the same).

## What the lesson is

- Each species carries the evo-devo lesson's network as its genotype. Mutations change the network's settings, never the limb;
  the network makes a few limbs from most settings and some from almost none. So some limbs evolve again and again, more in
  some clades than in others, and some never appear though nothing selects against them. Species selection (23) acts on the
  limbs the network makes.
- Worth protecting: the two sources of gaps (a limb the network cannot make; a limb it makes and selection removes) told apart
  by the student from the runs, never stated.

## Shape (a sketch; nothing measured)

    A  the map. Random settings of the network → the limbs they make, sampled; a grid of limb types (digit count × element
       lengths), shade = how many settings make each. Most settings land on a few limbs (the realised patch in a vast space).
    B  the same loss, again and again, and not the same everywhere. Lineages on a tree (20's), selection to shorten the limb:
       limbs reduce over and over. Which digit goes first follows the order digits form (back-to-front in one clade, front-to-back
       in another: the axolotl contrast), so the same selection removes a different digit in each clade (Alberch & Gale 1985,
       amphibian digit reduction; to check). Targets: two clades, one selection, two different losses.
    C  two kinds of gap. A limb missing from the clade: selection off, the gap stays (the network cannot make it); the network
       rewired, it fills. A limb missing because selection removes it: selection off, it appears. Targets on the realised grid.
    D  deep homology (if kept): the evo-devo lesson's loop placed in other places by different enhancers (limb, fin; the
       lecture's pancreas and taste bud); a fin and a limb from one network (Onimaru et al. 2016, Zhu et al. 2010; to check).
       Species differ in which enhancers the module answers to; species selection runs on what they build.

Real data (none on file): repeated limb loss in squamates (Wiens, Brandley & Reeder 2006, Evolution 60: 123–141, "Why does a trait
evolve multiple times within a clade? Repeated evolution of snakelike body form in squamate reptiles"; to check); toe counts on
the fossil horses' tree (`data/clean/horse_*` carries body size and hypsodonty only; toes would be added from MacFadden, to
source).

## Engine notes

- The evo-devo grid is too slow to run inside every species at every step. Summarise the lower level per unit above it (23's
  10-28 time-scale note): run the network once over a lattice of settings, store settings → limb type, and let 23's species-level
  engine mutate settings and read limbs from the table.
- The table is the lesson's map (A), so building it is also building A.

## Open for JM

1. Limbs again (reusing evo-devo's network; recommended for continuity), or teeth (molar proportions predicted by an
   inhibitory cascade, with real ratios across rodents: Kavanagh, Evans & Jernvall 2007, Nature; to check)?
2. Deep homology: a stage (D) or one panel?
3. "Mesoevolution": the timescale (Lec 29: networks over millions of years) or how easily each clade evolves a trait? Read here
   as both, through the map.

## Items

| # | What | Status |
|---|------|--------|
| 1 | JM's brief (2026-11-07); this plan | done 2026-11-07 |
| 2 | JM rules on Open 1-3 | todo |
| 3 | after the evo-devo engine: the settings → limb table; then 23's species engine on it | todo |
| 4 | slot fixed; file renamed | todo |

## Rulings

- 2026-11-07: a simulation combining species selection and evo-devo, for "mesoevolution": some traits more likely to evolve
  repeatedly, and within certain groups; perhaps deep homology.

## Do not

- Say a gap is a constraint; students tell the two kinds apart from the runs.
- Name on screen what the runs show (constraint, canalisation, deep homology): the no-vocabulary rule.
