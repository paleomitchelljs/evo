# Lesson 25 — mesoevolution: species selection on development ("2Z"; slot 25 since 2026-11-07, was `mesoevolution_plan.md`)

**File** · `app/lessons/lesson25.html` — draft 1 (2026-11-07, v1, 5 bits, LOCKS `x`)
**Checks** · `node scripts/check_lesson25_numbers.js` · `python3 scripts/check_lessons.py` · `node scripts/check_layout.js`
**Status** · DRAFT 1 BUILT 2026-11-07 (JM: "let's please draft leson 23 and onward"; Open 1-3 taken on the recommendations: limbs, deep homology left for later, both readings through the map). Needs 23's species-level engine and the evo-devo lesson's
limb network (lesson24_overhaul.md)
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

## Prototype (2026-11-07; scratchpad l25/)

    the map    lesson 24's skeleton model (forearm strength 3), 8 limbs a cell, hand-plate width 14-30 x strength 2-14 (table.js,
               table.json; the modal digit count, * where not 8 of 8):
                 W \ a3  2  2.5  3  3.5  4  5  6  7  8  10  12  14
                 14      2  2    2  2    2  3  3  3  3  4   5   5
                 18      2  2    3  3    3  3  3  5* 5  5*  6   6
                 22      3  3    3  3    3  5  5  5* 6* 7*  8*  8*
                 26      3  3    3  4    5  5* 6  6  7* 9*  9   9*
                 30      3  3    5  5    6* 6  6* 7* 8* 10* 10  10*
               Four digits in a handful of cells, never at width 22 (counts jump 3 -> 5); 3 and 5 from many.
    clades     (clade.js) species carry the strength (log, mutating sd .06 a step) at their clade's width; digits read from the
               table; split .03 x room (cap 40), lost .015; 300 steps, 16 clades, from strength 6 (five digits):
                 width 22: neutral 3 digits .40 of species at the end (a species came to have 3 digits 24 times a clade), 4
                   digits never (0 of 16 clades), 6+ .31; three or fewer split x3: .71 (62 times); four favoured x3: no change
                   (none to favour); 6+ lost x4: .16.
                 width 26: 4 digits in 15 of 16 clades (neutral .06; favoured .13); 6+ .52, lost x4 .11.
               The two gaps: four digits at width 22 never appear whatever selection does (the map has none); six or more
               appear in every clade and are removed when selected against.

## Draft 1 plan (2026-11-07)

    A  the map: a grid of settings (hand-plate width x strength), blank at the start; click a cell to grow a limb there (lesson
       24's model, live); its digits fill the cell. A1 grow a four-digit limb; A2 grow a two-digit limb.
    B  clades on the map: the hand-plate's width (narrow 22 / broad 26) and selection (three or fewer split more; four favoured;
       six or more lost faster). B1 three-digit species .6 or more (favour three or fewer); B2 four digits in 12+ of 16 clades
       (four favoured; the width the lever); B3 six or more .3 or more (their losses held, then off).

## Draft 1 as built (2026-11-07)

    A          the map (width 14-30 x strength 2-14), blank until grown; a click picks a cell (or the two arrows), Go grows
               one limb there with lesson 24's model (seeded by the cell, so a cell gives the same limb every time for a
               student); its digits fill the cell. A1 four digits (cells 26/3.5, 24/4, 28/3 make it 8 of 8; opens 22/6, five);
               A2 two digits (narrow, weak: 14/2).
    B          16 clades, 300 steps; strength drifts (sd .06, log); digits read from DIGITS (widths 22 and 26: the table's
               modes, embedded; the check regrows all 24 on the page and they match). Over 20 seed sets of 16 clades:
               B1 width 22, three or fewer favoured (x6 splitting) (opens none, .24-.51): three-digit species .57 or more
                  (.62-.80).
               B2 four favoured, width free (opens narrow: four digits in 0 of 16 clades every set): clades with four .6 or
                  more (broad .69-1.00).
               B3 width 26, favoured free (opens five or fewer, six or more .13-.26 though they arise in every clade): .33
                  or more (none favoured .42-.69).
               Selection against six or more through losses (x4, x8) overlapped (.10-.63): done through splitting instead.
    checks     `check_lesson25_numbers.js`: 14 checks + both widths + two R panels.
    left out   deep homology (Open 2); real data (squamate limb loss; horse toes); the time-scale reading of
               "mesoevolution" beyond the map.

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
| 3 | after the evo-devo engine: the settings → limb table; then 23's species engine on it | done 2026-11-07 |
| 4 | slot fixed; file renamed | done 2026-11-07 (25) |
| 5 | draft 1: page, check script | done 2026-11-07 (v1, 5 bits) |
| 6 | JM plays draft 1; Open 1-3; his voice | todo |

## Rulings

- 2026-11-07: a simulation combining species selection and evo-devo, for "mesoevolution": some traits more likely to evolve
  repeatedly, and within certain groups; perhaps deep homology.

## Do not

- Say a gap is a constraint; students tell the two kinds apart from the runs.
- Name on screen what the runs show (constraint, canalisation, deep homology): the no-vocabulary rule.
