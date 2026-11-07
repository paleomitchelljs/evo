# Lesson 24 — evo-devo: a gene network builds a limb ("2Y"; slot 24 since 2026-11-07, was `evodevo_plan.md`)

**File** · `app/lessons/lesson24.html` — draft 1 (2026-11-07, v1, 14 bits, LOCKS `x`). One lesson, five stages (Open 1 taken as one; may split A-C / D-E)
**Checks** · `node scripts/check_lesson24_numbers.js` · `python3 scripts/check_lessons.py` · `node scripts/check_layout.js`
**Status** · DRAFT 1 BUILT 2026-11-07 (JM: "let's please draft leson 23 and onward"). Open 1-4 taken on the recommendations. The papers: `docs/refs/README.md`
**Last touched** · 2026-11-07

## JM, 2026-11-07 (verbatim, the 2Y part; the whole message is in lesson21_overhaul.md)

> 2Y: evo-devo where we give a simplified gene network for a vertebrate limb and have students run through simple simulations
> using standard models to show how diffusion and growth drive differential gene expression and produce self-limiting limb
> sizes and recapitulate known skeletal patterns. I'm envisioning a setup simulation that shows students the basics of how
> gene regulatory networks work (toy first, maybe even an interactive showing gene regulation without a numerical model, just
> manipulation….then a model for somitogenesis via clocks?), then they run sims showing how limb location gets specified, then
> they grow a limb to a particular size, and finally they create different patterns of skeletons to make different types of
> tetrapod limbs

## JM's earlier brief (2026-09-22, a sandbox; from session notes, never in the repo; paraphrased)

- A graph of the limb-bud regulators (Shh, Fgfs, BMPs, Gremlin), each gene's effect on each other gene a slider from negative to
  positive; Grow runs diffusion from fixed producing cell groups: FGF → growth, BMP → cell death, Gremlin ⊣ BMP, SHH → Gremlin,
  with the negative feedbacks. Goal: grow a bud to a target length or duration.
- The long goal, verbatim: "(1) a general gene-regulatory-network DAG machinery that (2) produces structure outlines of particular
  size/shape". Later: dorsal-ventral WNT, A-P gradients, digit specification, ending with students matching a simple tetrapod
  limb skeleton outline. "relatively basic" machinery so those can be added.
- Agreed then (JM accepted all three): termination comes from the model, not a slider (Shh-descendant cells cannot make Gremlin;
  high FGF represses Gremlin: Bénazet et al. 2009); BMP's role in outgrowth is shutting down the AER's FGF (interdigital death
  later, optional); outputs are final length and duration of outgrowth. Note given then: the network has cycles, so it is not a
  DAG.

## The lecture behind it (docs/2026_lecture_detail.tex, Lec 29 and 31; verbatim)

- 202_lec31_04 (Antennapedia): "This was a homeotic shift—a shift in the identity of a location. And the mutation wasn't to the
  Hox gene itself; it was to an enhancer that unwrapped the wrong Hox gene in the wrong place."
- 336_lec09_06 (colinearity): "the order they're arranged matches the order they're expressed along the body axis".
  "Hox aren't the secret of all biology": "Important because positional, not because special molecules".
- 336_lec12_fgfs_02 (where a limb goes): "Implant a bead soaked in FGF8 and FGF10 into the flank of an early mouse embryo, between
  the normal forelimb and hindlimb. You get an extra limb. ... Above some axial level the extra limb is an arm; below it, a leg."
- The termination circuit: "AER produces FGF (grow signal)"; "ZPA produces Sonic hedgehog (A–P polarity)"; "BMP (stop signal)";
  "Gremlin (BMP inhibitor)". Logic: "Shh → Gremlin on → BMP off → FGF on → grow"; "Limb outgrows Shh diffusion range → circuit
  collapses → terminate"; "Length encoded by Shh diffusion range".
- 336_lec12_fgfs_04: "The limb network self-terminates by diffusion. ... There is no homunculus measuring the limb. The network is
  built so that growth turns itself off through its own success".
- 202_lec31_05: "Darwin's finches don't evolve a whole new protein for a thicker beak—they modify a beak-specific enhancer ...
  The same FGF/BMP/sonic-hedgehog/gremlin module that makes a limb also makes a pancreas or a taste bud. What changes is which
  enhancer is active where." (The finches of 14 and 21.)
- Lec 29 morphospace: "Developmental constraint: regulatory networks can't build all shapes" (mesoevolution's, after this).

## What the lesson is

- A network of genes switching each other, run in space, builds a limb: a clock that cuts the body into blocks, a code that
  places the limb, a loop that grows it and stops it, a self-organising pattern that lays down its bones. The same network with
  its settings changed builds different limbs.
- Worth protecting: the limb's size comes out of the network (no "stop" slider); every expression pattern on screen is the run's,
  measured; the network's loops are drawn as loops.

## Shape (a sketch; nothing measured)

    A  switches, no numbers. Genes as boxes in a row of cells; arrows that turn on (→) or off (⊣); a gene listens to the inputs
       its enhancer names. The student wires a few arrows to get a target pattern: a stripe, a boundary, a gene on only where
       two signals meet, a switch that remembers. Then Antennapedia: one enhancer rewired puts a gene in the wrong place.
       paths.js or buildArrows; on/off cells, no rates.
    B  a clock and a wavefront (somites). A gene that turns itself off after a delay switches on and off (A's switch with a
       delay: the clock; Lewis 2003). A tail signal recedes as the body lengthens; cells it leaves freeze the clock's phase into
       blocks (Cooke & Zeeman 1976). Sliders: the clock's period, how fast the body lengthens. Targets: a number of blocks; a
       snake's many (a faster clock against growth: Gomez et al. 2008), which 15's snakes foreshadow. PORD (Cotterell et al.
       2015, in LimbNET) is the alternative model.
    C  where a limb goes. B's blocks each carry a Hox code (colinearity: genes in chromosome order switched on in time order as
       the body grows). A bud forms where the code and an FGF signal agree; an FGF bead in the flank makes an extra limb, arm
       or leg by its level (the lecture's experiment: Cohn et al. 1995). A python's code (the thoracic code run forward, no
       forelimb: Cohn & Tickle 1999). Targets: a limb at a level; an extra limb that is a leg; no forelimb.
    D  grow it to a size. A 2-D bud on a grid that adds cells where growth is: growth = s1 × FGF + s2 (Dillon & Othmer 1999).
       The loop: SHH → Gremlin ⊣ BMP ⊣ FGF, and FGF → SHH; Shh-descendant cells cannot make Gremlin. As the bud lengthens the
       sources part and the loop fails: growth stops by itself (the lecture's "Length encoded by Shh diffusion range"). The
       network's arrows are the sliders (JM's 09-22 brief; paths.js). Targets: a limb of a target length; the same length by two
       different arrows; a limb cut short (the AER's FGF lost early: Summerbell 1974, via Dillon & Othmer). Proximal-distal
       identity on the grown bud (retinoic acid from the body, FGF from the tip → Meis, Hoxa11, Hoxa13: LimbNET's Uzkudun et al.
       2015 network) is a menu here or a step of E.
    E  the skeleton. A reaction-diffusion pair on the grown bud (Ben Tahar et al. 2026: Schnakenberg, a 0.47, b 2, d 113),
       its strength rising from body to tip (αR, read off D's Hox domains), gives one bone, then two, then five; digit count
       by the tip's αR, their fan by βD. Targets: skeleton outlines of different limbs: a mouse forelimb (1-2-5), a two-digit
       limb, a six-digit limb, an axolotl's (digits formed front to back, no thick ridge), a paddle of many short elements
       (ichthyosaurs: Zhu et al. 2010, via Zhang et al. 2012).

If it splits (Open 1): A-C (networks, a clock, a body plan) and D-E (the limb). D-E alone holds JM's sandbox brief whole.

Real data: none on file (data/SOURCES.md). The papers' images are copyrighted; skeleton outlines would be drawn (realish, JM
2026-09-30). Expression maps can come from the model itself.

## Engine notes

- A grid, not finite elements. Dillon & Othmer's fluid and Ben Tahar et al.'s elastic growth are far past a page; what a grid
  must reproduce is their qualitative results (elements splitting 1 → 2 → many as αR rises; the feedback failing with
  separation). Measure before choosing.
- Schnakenberg with d = 113: v's diffusion sets the explicit step; an implicit or split step may be needed, or a smaller d still
  inside the Turing range (Ben Tahar et al.'s supplement gives the linear-stability conditions).
- setupCanvas's overflow (WORK_ORDER; lesson 10/11's measuring override) for every grid plot.
- Genes need four or more colours: never by hue alone (JM 2026-10-20, colourblind students): lightness ramps, patterns, labels.

## Gaps to source (docs/refs/README.md, "Gaps")

The clock (Cooke & Zeeman 1976; Lewis 2003; Gomez et al. 2008), limb position (Cohn et al. 1995; Burke et al. 1995; Cohn & Tickle
1999), the termination loop (Zuniga et al. 1999; Scherz et al. 2004; Verheyden & Sun 2008; Bénazet et al. 2009). None checked.

## Measure first

- E: a Turing pair on a lengthening grid at page speed (a grid of about 60 × 120?) giving 1 → 2 → 5 as αR ramps; digit count
  against αR.
- D: the loop on a growing grid stopping at a length set by Shh's reach; length against the diffusion range and against the
  Gremlin rule; the time it takes.
- B: block count = lengthening time / clock period, and how much it jitters.

## Prototypes (2026-11-07; scratchpad l24/)

    E skeleton  (turing.js) one Schnakenberg pair (a .47, b 2, d 113: Ben Tahar et al.; Turing threshold d 82, so a narrow band),
                the limb grown row by row from the body: each new row of cells starts from the row behind it (2% noise) and
                settles its pattern across the limb's width (front to back) at its region's strength alphaR. 60 rows ~0.06 s a limb.
                Widths: upper arm 10 cells, forearm 12, hand-plate 22. Strength 1 / 3 / x, 16 limbs:
                  upper arm 1 element 15 of 16; forearm 2 elements 16 of 16 (at strength 2, half and half);
                  hand-plate x 3 or 4: 3 digits 16/16; 6: 5 digits 16/16; 8: 5-6; 12: 7-8.
                Counts jump 3 -> 5 at this width (the 2 forearm elements split from the middle): four digits needs another
                width (26: strength 3 gives 4 in 8 of 16). A 2-D grid at d 113 was too slow for a page; the row-by-row grid is
                the progress zone's way (each row patterns as it leaves the tip).
    D growth    (grow.js) one dimension, body to tip, quasi-steady diffusion each step: FGF from the tip; Shh from the ZPA at the
                body end, made while FGF reaches it; Gremlin made where Shh is above a threshold and outside the Shh-descendant
                zone (it widens with time); BMP at the tip = 1 / (1 + w Gremlin there); the ridge (FGF) works while that BMP is
                low; dL/dt = s1 FGF at the tip. Start .30:
                  Shh's reach .1 .53, .15 .59, .2 .64, .25 .68, .3 .71, .4 .77 (length set by the reach);
                  growth s1 .15 / .3 / .6: .66 / .68 / .68, stopping at 32 / 17 / 9 (faster, same size, sooner);
                  Gremlin on BMP w 5 / 20 / 80: .60 / .68 / .80; ridge removed at 1 / 3: .33 / .39 (cut short).
    B clock     (clock.js) Lewis 2003: dm/dt = k / (1 + (p(t - Tm) / p0)^2) - c m, dp/dt = a m(t - Tp) - b p (k 33, c b .23,
                a 4.5, p0 40, Tp 2.8); the tail grows .5 cells a minute for 500 minutes, each new cell frozen at the clock's
                state; a block = a run of cells frozen while the gene was on. Delay 3 / 6 / 9 / 12 / 15 / 20: period 25 / 33 /
                42 / 49 / 56 / 67 minutes, blocks 20 / 15 / 13 / 11 / 9 / 7.
    A, C        rules on on/off cells, no numbers (JM: "without a numerical model, just manipulation").

## Draft 1 plan (2026-11-07)

    A  switches: a row of 12 cells; signal L on in cells 1-8, signal R in 5-12; genes X and Y. Each arrow off (dashed), turns on
       (blue) or turns off (red). A gene is on in a cell when something on there turns it on and nothing on there turns it off;
       the cells update together, step by step. Targets on Y's final pattern: A1 Y in 1-4 only; A2 Y in 5-8 only (where both
       signals meet: needs X between); A3 L a pulse (first 3 steps), Y on in 1-8 at the end (a loop that remembers).
    B  a clock: the delay sets the period; blocks = growth time / period. B1 delay free (opens 20): 10-14 blocks. B2 a snake:
       slower growth, longer, delay free (opens 12): 35 or more blocks.
    C  where a limb goes: 24 blocks; Hox genes switch on in order as blocks form (colinearity); a forelimb where the code
       turns from neck to chest, a hindlimb where it turns to lumbar; an FGF bead (click a block) makes an extra limb in the
       flank, an arm or a leg by the code there. C1 an extra leg; C2 no forelimb (a python: the chest code from the first block).
    D  grow it: the loop above, the arrows Shh's reach, FGF -> growth, Gremlin -| BMP, and the ridge removed. D1 a limb of a
       target length (reach free); D2 the same length sooner (growth free); D3 a limb cut short (ridge removed).
    E  the skeleton: strengths of forearm and hand-plate free. E1 1-2-5 in 12 or more of 16 limbs; E2 three digits; E3 seven or
       more.

## Draft 1 as built (2026-11-07)

    page       lesson 22's machinery (stitched by scratchpad l24/gen24.py); each stage its own engine, drawing and R panel.
    A          a row of 12 cells, step by step (four grids: L, R, X, Y); six arrows, each off / on / none. Targets exact:
               A1 Y 1-4 (Y <- L, Y -| R); A2 Y 5-8 (needs X: X <- L, X -| R, Y <- L, Y -| X); A3 L a pulse, Y 1-8 kept (X and Y
               turning each other on). A loop with Y turning X off flickers (shown, not targeted).
    B          Lewis's clock; delay 20 / 12 / 6 / 3 (red arrow, protein back onto the gene). B1 growth .5, 500 minutes, opens
               20 (7 blocks): 10-14 (12: 11). B2 growth .2, 1,500 minutes, opens 12 (31): 35 or more (6: 46). At 3 the clock
               damps (12-13 blocks): a delay is what makes it tick.
    C          24 blocks, Hox one every 2 blocks; neck / chest / lumbar / tail; bead by a click on a chest block.
               C1 an extra leg (bead in block 15), C2 an extra arm (block 13), C3 no forelimb (Hox 10 blocks early).
    D          the loop above; Shh's reach .1 / .25 / .4, Gremlin blocks BMP x80 / 20 / 5, FGF -> growth .3 / .6, the ridge
               removed at hour 1 / 3 / never. D1 opens reach .1 (1.33 mm): 1.6-1.8 (.25: 1.70). D2 opens growth .3 (stops
               at hour 17): by hour 10 (.6: 8.6, still 1.71 mm). D3 opens never: 1.1 mm or less (hour 3: .97).
    E          upper arm 8 cells wide (10 made two elements in 7% of limbs), forearm 12, hand-plate 22; forearm strength 1 / 3,
               hand-plate 3 / 6 / 12. Over 20 seed sets of 16 limbs: E1 1-2-5 16 of 16 (opens 1, 3: 0); E2 three digits 16
               of 16 (opens 6: 0); E3 seven or more 15-16 of 16.
    arrows     a held arrow at input 0 draws dashed ("none"): every input that is never "none" runs from 1 (or -1).
    checks     `check_lesson24_numbers.js`: 28 checks + both widths + five R panels (shortened: rows 20, 200 minutes).
    left out   Antennapedia (an enhancer rewired); proximal-distal identity read off D's bud into E's regions (drawn as
               fixed regions here); an axolotl's order of digits; four digits (counts jump 3 -> 5 at this width:
               mesoevolution's constraint); real data.

## Open for JM

1. One lesson or two (A-C, D-E)?
2. A: on/off switches in a row of cells, no rates (as read from "without a numerical model, just manipulation"), or something
   else?
3. B: clock and wavefront (the textbook model) or PORD?
4. E's targets: which limbs? (Proposed: mouse forelimb, axolotl, a two- and a six-digit limb, an ichthyosaur paddle; a horse's
   single toe would tie to the fossil horses on file, which carry no toe counts.)

## Items

| # | What | Status |
|---|------|--------|
| 1 | JM's brief (2026-11-07); this plan; the five papers summarised (docs/refs/README.md); the 09-22 sandbox brief brought in | done 2026-11-07 |
| 2 | JM rules on Open 1-4 | todo |
| 3 | sources for the gaps checked | todo |
| 4 | engine prototypes (E's pattern, D's loop, B's clock); Measure first | done 2026-11-07 |
| 5 | slot fixed; file renamed | done 2026-11-07 (24) |
| 6 | draft 1: page, check script | done 2026-11-07 (v1, 14 bits) |
| 7 | JM plays draft 1; Open 1-4; his voice | todo |

## Rulings

- 2026-11-07: the evo-devo lesson: a simplified limb network, standard models; diffusion and growth drive differential
  expression, self-limiting size, known skeletal patterns. Toy network first (perhaps no numerical model), a somite clock, limb
  location, growth to a size, skeletons of different tetrapod limbs.
- 2026-09-22 (sandbox brief, agreed): termination from the model, not a slider; BMP shuts down FGF; outputs length and duration.

## Do not

- Put a "stop" or "size" slider on the limb: the size is an outcome (JM 2026-10-01: never a slider on a drawn outcome).
- Call the network a DAG on screen: it has loops.
- Name on screen what the runs show (positional information, Turing, clock and wavefront): the no-vocabulary rule.
