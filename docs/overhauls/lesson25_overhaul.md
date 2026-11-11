# Lesson 25 — mesoevolution: species selection on development ("2Z"; slot 25 since 2026-11-07, was `mesoevolution_plan.md`)

**File** · `app/lessons/lesson25.html` — draft 3 (2026-11-09, v3, 17 bits, LOCKS `x`): the limb (from 24), then the map and clades. Draft 2 (2026-11-07, v2, 5 bits, LOCKS `x`): rebuilt on lesson 24's draft-2 limb
**Checks** · `node scripts/check_lesson25_numbers.js` · `python3 scripts/check_lessons.py` · `node scripts/check_layout.js`
**Status** · DRAFT 3 BUILT 2026-11-11 (v3, 17 bits; checks pass; JM to play). Planned 2026-11-09 (JM's rework note, below). Before it: DRAFT 1 BUILT 2026-11-07 (JM: "let's please draft leson 23 and onward"; Open 1-3 taken on the recommendations: limbs, deep homology left for later, both readings through the map). Needs 23's species-level engine and the evo-devo lesson's
limb network (lesson24_overhaul.md)
**Last touched** · 2026-11-11 (draft 3 built)

## DRAFT 3 — JM, 2026-11-09 (verbatim; the whole note and what it changes for both lessons: lesson24_overhaul.md)

> I want this to empower them to explore how diverse bodies and limb forms (like the differences in horses and ichthyosaurs
> and bats and humans and skinks of sorts).

> The current ones feel unengaging and the genetic controls too abstract. I also fear we've continued our drift towards
> assessing students relative to building understanding in the students

> While loci small, I do want them named clearly, though

### Lesson 25, draft 3 (v3, 17 bits): the limb, then the map

- The limb moved here from 24 (draft 2's D and E), rebuilt as one limb grown live. The map and clades stay, as the last stage.
- **Five genes: Fgf8, Shh, Grem1, Bmp4, Sox9.** Four are set; Sox9 is what they lay down.

    A  a bud that stops       parts: Fgf8 at the tip (grows without end); Bmp4 shuts Fgf8 off (never grows); Grem1 blocks
       itself                 Bmp4 (grows without end); Grem1 only where Shh reaches (grows, then stops itself)
                              controls: Fgf8, Shh, Grem1 levels
                              find: A1 it stops itself · A2 a longer limb · A3 a shorter one · A4 the same length sooner
    B  digits                 parts: Sox9 in the cells left behind the tip (one bone, two, then digits); joints, one every
                              4.2 hours the tip keeps growing; Bmp4 between the digits (web, free digits, side digits lost)
                              controls: the four levels
                              find: B1 six or more digits · B2 three or fewer, none lost to cell death · B3 three or fewer,
                              five laid down first · B4 a web · B5 six or more bones in a digit
    C  animals                the human limb is the start; cards drawn by the same engine: skink, horse, camel, bat,
                              ichthyosaur; build any four
    D  the map, and clades    Shh x Bmp4 → digits, off the engine; a founder clicked on the map; its clade walks the map
                              by small steps; menu: which limbs split more often
                              find: D1 digit number changes in four or more lineages · D2 twelve species and no change ·
                              D3 a digit lost to cell death in the clade

- Engine (one limb, rows from body to tip, .1-hour steps; JM's lecture: "Shh → Gremlin on → BMP off → FGF on → grow"; "Limb
  outgrows Shh diffusion range → circuit collapses → terminate"):
  - the tip grows 1.8 rows an hour x Fgf8 while its Fgf8 is on;
  - Grem1 is made out to where Shh reaches, 40 + 14 ln(Shh) rows; past that it thins by e every 10 rows;
  - Bmp4 at the tip = 1 / (1 + 7.39 x Grem1 there); above .5 it shuts the tip's Fgf8 off for good. So the limb stops at
    reach + 10 ln(7.39 x Grem1): 60 rows at the defaults;
  - Sox9: draft 2's Sox9-Bmp-Wnt rows (Raspopovic et al. 2014's signs), unnamed here: 8 cells wide to row 15, 12 to row 30,
    then the plate, 21 x sqrt(Shh) cells; stripe spacing by region as in draft 2 (the Hox code, now fixed and unnamed);
  - a joint every 4.2 hours of growth past row 30 (time at the tip sets the count: Sanz-Ezquerro & Tickle 2003);
  - Bmp4 between the digits: under .5 a web; from 1.5 the plate's edges die inward (to .2 of its width at 1.5, .4 at 2) and
    take the digits there; the middle one (odd) or two (even) always stay.
- MEASURED (scratchpad l24v3/t25b.js, 16 seeds):
  - parts: Fgf8 alone runs off the panel; + Bmp4 never grows; + Grem1 runs off; + Shh: 60 rows at hour 30.
  - Fgf8 x .5 / 1 / 2: 60 rows at hour 60 / 30 / 15; 8 / 4 / 2 bones in a digit. Grem1 x .25 / 1 / 4: 46 / 60 / 74 rows.
  - Shh x .2 / .3 / .5 / .7 / 1 / 1.5 / 2 / 3: 2 / 3 / 4 / 4-5 / 5 / 6-7 / 7-8 / 8-9 digits laid; limb 37 / 43 / 50 / 55 /
    60 / 66 / 70 / 75 rows. One bone, then two, in 16 of 16 at every level.
  - cell death: five laid → 3 at Bmp4 1.5-1.7, 1 from 1.75; four → 2; six → 4, then 2; seven → 5, 3, 1.
  - the five cards are each built by some settings and none by the defaults; one slider moved builds only the skink.
  - 17 ms a limb.

### Sources for draft 3

- Checked by search 2026-11-09: Shapiro, Hanken & Rosenthal 2003 (*J Exp Zool B* 297B:48: *Hemiergis* skinks with fewer digits
  make Shh for a shorter time); Cooper et al. 2014 (*Nature* 511:41: horse, camel and jerboa lose digits to cell death after five
  are laid down; the pig by earlier patterning); Weatherbee et al. 2006 (*PNAS* 103:15103: a bat's web keeps Grem1 and Fgf8 and
  loses Bmp signalling); Sanz-Ezquerro & Tickle 2003 (*Curr Biol* 13:1830, title only: Fgf at the tip and the number of phalanges).
- From memory, not checked, not in docs/refs: Sears et al. 2006 (bat digits lengthen through Bmp2, which this model does not
  do); Richardson & Oelschläger 2002 (dolphin flippers: more phalanges from a longer-lived tip ridge); Merino et al. 1999 (duck
  web and Gremlin).
- Stylised or by analogy: Shh as one level setting both reach and plate width; one Bmp4 level for the web and for side loss; the
  odd / even outcome of side loss; the ichthyosaur (no molecular data exists; built as a dolphin flipper with more digits).

### Open for JM (draft 3)

1. Which two genes the map crosses: built as Shh x Bmp4 (two ways to lose a digit). Shh x Grem1 would map length.
2. The camel card: a fifth animal, not on JM's list; it is the even-toed outcome of the same slider as the horse. Drop it if
   five is too many.
3. D's menu "split more often" is what is left of species selection in this lesson (23 has the rest).
4. The finds and cards: as lesson24_overhaul.md, Open 2.
5. A's reference is "every gene at ×1" (the same limb C calls the human arm); A2-A4 read against it. Two rows either way
   is the window (Shh one notch, ×0.9 or ×1.1, moves the stop 1.4-1.6 rows and does not count).
6. D's finds read clade 1 (the tree); the 16 bars are replicates from the same founder. D2 is a chance history: about one
   start in 400 misses (12 species not reached in 400 steps); ↺ starts the clades again.
7. The four sliders are transcription as a multiple (×0.2 to ×4), where lesson 24's are minutes and hours. This is the
   nearest thing left to what JM called "too abstract"; each one's effect is drawn (Shh's reach line, the Bmp4 gauge, a ▾
   every five hours of growth), but the control itself has no unit. Say so if they should be in something countable.
8. `pageSeed` is random across loads (sim.js: "random across loads, fixed within one"), so the limb seed and D's map are
   redrawn on a reload; digit counts at the edge Shh levels can differ. True of every lesson; CLAUDE.md §5 says otherwise.

### Draft 3 as built (2026-11-11; parts and build script in scratchpad l25v3/, `build25.py --install`)

    A  the bud and its four genes over it (Fgf8 a blue rim at the tip, Shh orange from the body to a dashed "Shh reaches"
       line, Grem1 hatching, Bmp4 red dots by 1 / (1 + Grem1)); a gauge "Bmp4 at the tip" against "Fgf8 off"; ▾ where the
       tip was every 5 hours; the ruler with the bud's length heavy and "×1 stops here". Parts panel under the picture;
       cards Fgf8, Shh, Grem1 (Shh, Grem1 held until their parts)
    B  the same limb as a skeleton: Sox9's runs joined into bones (rounded), joints as gaps, the palm and web or free
       fingers, cell death as dashed outlines; counts under the limb ("1 bone · 2 bones · 5 digits, 4 bones in each");
       Parts panel under the picture; cards Fgf8, Shh, Grem1, Bmp4 between the digits (held until its part)
    C  B's limb, all parts, opening on ×1 ("a human arm"); the four cards under the picture; five animal cards drawn by
       the same renderer at the same scale
    D  left: the map (17 Shh levels x 10 Bmp4 levels; number = digits kept, darker more; ✗n = lost) with clade 1's
       species as dots, the limb at the outlined cell, clade 1's tree; right: the menu, the 16 clades as bars, the finds

- Controls are ladders, one notch a level: Fgf8 .5 .6 .7 .85 1 1.2 1.4 1.7 2; Shh .2 .25 .3 .4 .5 .6 .7 .8 .9 1 1.1 1.2
  1.4 1.6 2 2.5 3; Grem1 .25 .35 .5 .7 1 1.4 2 2.8 4; Bmp4 between the digits 0 .2 .4 .6 .8 1 1.5 1.7 2 2.5.
- A change to a gene acts on the growing limb; once the limb has stopped, it grows it again. Bmp4 between the digits acts
  on a stopped limb at once (cell death is after the digits). A part added or switched grows it again.
- Live: A and B 3 model hours a second, C 5, D 40 steps a second; "fast" x3; ?still=1 keeps the clock stopped.
- Engine changes from the plan (measured in l25v3/m*.js): the web is (1 - Bmp4) / .6 of the way out (the plan's
  1 - (Bmp4 - .2) / .6 left no web one notch below x1); digits laid = the commonest count over the plate's last 15 rows
  (the plan's: all rows from 34; they agree on 1224 of 1224 untouched limbs, and the last 15 follow a Shh change made
  mid-run); clades walk the map's cells (sd .04 of a cell a step, 400 steps, split .05 x room, lost .015).

### Finds as built (windows; the check re-measures every line)

    A1 stop        all four parts in, the tip's Fgf8 off after growing: x1 stops at 60.18 rows, hour 30.1 (closed form
                   reach + 10 ln(7.39 Grem1) = 60.0; growth .18 rows a step)
    A2 longer      stopped >= x1 + 2 rows: Grem1 1.4 (63.4), 2, 4; Shh 1.2 (62.7), 1.4, 2. Not Shh 1.1 (61.4)
    A3 shorter     stopped <= x1 - 2 rows: Grem1 .7 (56.6), .5, .25; Shh .8 (56.9), .6, .3. Not Shh .9 (58.6)
    A4 sooner      within 1.5 rows of x1, by hour 28.1: Fgf8 1.2 (hour 25.1; changed at hour 10: 26.7), 1.4, 2.
                   Not Fgf8 .85 or .6 (later); Shh .8/1.2 are not the same length
    B1 six         >= 6 digits kept: Shh 1.6, 2, 3 (12 of 12 seeds); Shh 1.4 lays 5 on 2 seeds in 200
    B2 few         <= 3 kept, none lost: Shh .25, .2 (200 of 200 seeds); .3/.4 lay 4 on 13 in 200
    B3 carved      >= 5 laid, <= 3 kept: Bmp4 1.5 (3 of 5), 1.7, 2 (1 of 5), at once on a stopped limb
    B4 web         web >= .25: Bmp4 .8 (.33), .6, .4, .2, 0
    B5 bones       >= 6 bones a digit: Fgf8 .7 (6), .6, .5 (8); Grem1 4 (6); Shh 2.5, 3 (6). Not Fgf8 .85 (5), Grem1 2.8 (5)
    every B find needs its part (Sox9; joints; Bmp4 between the digits); none at x1; each the same from hour 10

    animals (ok on the finished limb; the card is grown at the first of its settings that is that animal on this page's
    seed):
    skink          kept 2-3, none lost, <= 50 rows                 card Shh .25          (Shh .2-.4 alone also)
    horse          kept 1, >= 2 lost, >= 65 rows                   card Grem1 2, Bmp4 2
    camel          kept 2, >= 2 lost                               card Shh .6, Grem1 2, Bmp4 1.7 (then .5; 2.5, Bmp4 2; 2)
    bat            kept 5, none lost, web >= .6, hand >= 36 rows, <= 4 bones      card Fgf8 1.4, Grem1 2.8, Bmp4 .2
    ichthyosaur    >= 6 kept, none lost, web >= .6, >= 8 bones                     card Fgf8 .5, Shh 2, Grem1 2, Bmp4 0
    the full ladder grid (13,770 settings), seed 1001 / 2002 / 3003: skink 1008, camel 972 / 1053 / 972, horse 604 /
    638 / 580 (398-506 on the check's page seeds), ichthyosaur 428, bat 200 (was 4 of 1600 in t25b; hand >= 40 -> 36 and the web formula widened it); two
    animals at once 0; x1 none. The t25b 1600-grid (5 x 8 x 5 x 8), 4 seeds: skink 80, camel 175-250, horse 67-107,
    bat 18, ichthyosaur 63. Card settings on 48 seeds: 48 / 48 / 47 / 48 / 48.

    D1 lineages    clade 1: >= 4 species whose own digits changed. Founder Shh .2, Bmp4 .4 (next to 3 digits): 20 of 20
                   seeds on 3 maps (median 128 steps in the check); Shh .7: 18-19 of 20
    D2 still       clade 1: >= 12 living, no species ever changed. Founder Shh 1 (or .9), Bmp4 .4: 400 of 400 seeds at
                   split .05 (397 of 400 at .04), median 92-111 steps; D1 from it 1 of 400, D3 0
    D3 lost        clade 1: a species comes to lose a digit to cell death, the founder had none. Founder at x1 (Shh 1,
                   Bmp4 1): 198 of 200 (20 of 20 in the check); D1 from it too, 16-19 of 20 (allowed)

- Stylised in the drawing (not in the plan): the elements of each region are drawn centred across the limb (the model's
  pattern puts the single upper bone against one edge); bones are Sox9's runs joined row to row, and a row that lays
  another count while the pattern settles (the first rows past the wrist; 2-5% of plate rows) carries the bones on either
  side of it, so the picture draws exactly the counts printed (checked on 5,076 limbs in node, and on the page for x1 and
  the five cards); the palm (to the first joint, or .3 of the plate) is always webbed; a free finger is a rounded strip
  round its digit; the Shh-making patch is drawn at the back edge near the body, though the model has only Shh's reach.
- Cards: where a card's first setting sits on an edge between two digit counts (camel at Shh .6: 4 digits on 198 seeds in
  200), the card takes its next setting on that seed, so it is always the animal it names.

### Looked at, 2026-11-11

- The limb seed is new on every load (sim.js `pageSeed`), so the map is too. 24 limb seeds: the five-digit patch at Bmp4
  x0.2 runs Shh x0.6-1.2 on 17, x0.8-1.2 on 7; from x0.9, 3 clades in 20 change digits on those 7; from x1, 0 in 20 on
  all 24 (D2 20/20 on all 24). The check's x0.9 founder was pasted; it now takes the patch cell farthest from a change.
- Some seeds' maps are not monotone in Shh (7 then 6 at x1.6/x2; 4 4 3 at x0.3-0.5): the Sox9 pattern's noise.
- Screenshots seen: A part by part (Bmp4 without Grem1: the bud never grows), B part by part, C, D, the code.

### Items (draft 3)

    plan           this section                                                    done 2026-11-09
    engine         one limb: loop, Sox9 rows, joints, cell death                   done (scratchpad l24v3; l25v3 eng25.js)
    page           app/lessons/lesson25.html rebuilt, v3, 17 bits                  done 2026-11-11
    check          scripts/check_lesson25_numbers.js rewritten                     done 2026-11-11 (ALL PASS)
    visual pass    lesson 24's: labels >= 11 px at 1400, clock alone, columns      done 2026-11-11
                   within 100 px, single column under 1180 px, drawn = printed
    LOCKS, index   titles                                                          done (by the coordinator)
    JM plays it    his voice for the intros; Open 1-4 above                        todo

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

## JM on draft 1, 2026-11-07 (verbatim; the whole note is in lesson24_overhaul.md)

> For 24/25 the developmental runs should be more explicit and specific. ... I don't think we need or want any line plots, though
> more embryo-shaped visualizations would be ideal. ... Same with the limbs, where instead of embryological terms like hand plate
> we should use more genetic-developmental terms.

> I also don't want manipulations like a scalpel involved—purely modulating the expression of different genes is what I'm after

## Draft 2 (2026-11-07; scratchpad l25v2/)

    the map    lesson 24's draft-2 limb (Sox9 with Bmp and Wnt, row by row), two genes free: Gli3 (the Hoxa13 region 30 - 8 x
               Gli3 cells wide: 22 at x 1, lesson 24's) and Hox13 (spacing 1.5 x Hox13). 8 limbs a cell (map.js, table.json):
                 Gli3 \ Hox13  .4  .5  .6  .7  .85  1  1.2  1.45  1.75  2.1  2.5  3
                 x 2   (14)      6*  5*  5   4*  4   4   3   3    3    3*   2    2
                 x 1.5 (18)      8   8   7*  5   5   4*  4   4    3    3    3    2*
                 x 1.25 (20)    10  10   7*  6   5   5   5   4    4    3    3    3
                 x 1   (22)     10  10   8*  7   6*  5   5   5*   4    4    3    3
                 x .5  (26)     12* 10* 10   8   7   6*  5*  5    5    4    4    4
                 x 0   (30)     14  12* 10* 10*  8   8*  7*  6*   5    5    5    4
               At Gli3 x 1.5 the count jumps 7 -> 5: no Hox13 level makes six. At x 1 six at .85.
    clades     (clade.js) as draft 1, species carrying Hox13 (log, sd .06, inside .4-3) from x 1; Gli3 the clade's (x 1.5 or x 1);
               20 seed sets of 16 clades:
                 x 1.5, none favoured: three-digit species .18-.35; three or fewer favoured .45-.57; five or fewer .27-.39.
                 six favoured: a six-digit species in 0 of 16 clades at x 1.5 (seven or eight in all 16), .88-1.00 at x 1.
                 x 1, none favoured: six or more .28-.58; five or fewer favoured .12-.19 (six arose in every clade).
    as built   A1 a six-digit limb (opens Gli3 x 1, Hox13 x 1: five); A2 two digits. B1 Gli3 x 1.5, favour free: three-digit
               species .42 or more; B2 six favoured, Gli3 free from x 1.5: clades where six arose .6 or more; B3 Gli3 x 1,
               favour free from five or fewer: six or more .24 or more.
               B's plot over time and its line-sketch cards replaced by the 16 clades now, a bar each (living species by
               digits, the counted ones at the bottom, ◆ where six has arisen) and wordless bar cards: no line over time.
               Regions named by their genes (the Hoxa13 region, not the hand-plate); the arrows are Gli3 and Hox13.
    checks     `check_lesson25_numbers.js`: 15 checks (the table regrown on the page matches) + both widths + two R panels.

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
| 6 | JM plays draft 1; Open 1-3; his voice | done 2026-11-07 (his notes above; Open 1-3 not ruled) |
| 7 | draft 2 on lesson 24's draft-2 limb; no line plots; genes' names | done 2026-11-07 (v2) |
| 8 | JM plays draft 2; his voice | todo |

## Rulings

- 2026-11-07: a simulation combining species selection and evo-devo, for "mesoevolution": some traits more likely to evolve
  repeatedly, and within certain groups; perhaps deep homology.

## Do not

- Say a gap is a constraint; students tell the two kinds apart from the runs.
- Name on screen what the runs show (constraint, canalisation, deep homology): the no-vocabulary rule.
