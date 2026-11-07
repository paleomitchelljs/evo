# Evo-devo: a gene network builds a limb ("2Y"; slot 24, or 24-25 if it splits: JM 2026-11-07, Michod last)

**File** · not yet built. Rename this file `lessonNN_overhaul.md` once its slot is fixed. May split into two lessons (Open 1)
**Checks** · `node scripts/check_lessonNN_numbers.js` (to write) · `python3 scripts/check_lessons.py` · `node scripts/check_layout.js`
**Status** · PLANNED 2026-11-07 (JM). A sketch; nothing measured. The papers: `docs/refs/README.md`
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
| 4 | engine prototypes (E's pattern, D's loop, B's clock); Measure first | todo |
| 5 | slot fixed; file renamed | todo |

## Rulings

- 2026-11-07: the evo-devo lesson: a simplified limb network, standard models; diffusion and growth drive differential
  expression, self-limiting size, known skeletal patterns. Toy network first (perhaps no numerical model), a somite clock, limb
  location, growth to a size, skeletons of different tetrapod limbs.
- 2026-09-22 (sandbox brief, agreed): termination from the model, not a slider; BMP shuts down FGF; outputs length and duration.

## Do not

- Put a "stop" or "size" slider on the limb: the size is an outcome (JM 2026-10-01: never a slider on a drawn outcome).
- Call the network a DAG on screen: it has loops.
- Name on screen what the runs show (positional information, Turing, clock and wavefront): the no-vocabulary rule.
