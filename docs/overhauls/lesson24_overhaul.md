# Lesson 24 — evo-devo: a gene network builds a limb ("2Y"; slot 24 since 2026-11-07, was `evodevo_plan.md`)

**File** · `app/lessons/lesson24.html` — draft 3 (2026-11-09, v3, 11 bits, LOCKS `x`): bodies; the limb moved to 25. Draft 2 (2026-11-07, v2, LOCKS `x`): JM's draft-1 notes (below) rebuilt it. Draft 1 (v1, 14 bits) in git (674f05a and before)
**Checks** · `node scripts/check_lesson24_numbers.js` · `python3 scripts/check_lessons.py` · `node scripts/check_layout.js`
**Status** · DRAFT 3 2026-11-09 (JM's rework note, below). Before it: DRAFT 2 2026-11-07 (JM's notes on draft 1: named genes, explicit expression steps, embryo-shaped pictures, no line plots, no scalpel or bead). The papers: `docs/refs/README.md`
**Last touched** · 2026-11-10 (draft 3 built)

## DRAFT 3 — JM, 2026-11-09 (verbatim)

> I'd like a thorough reworking of the evo-devo lessons (24, 25).
>
> The goal is to give students compelling interactives that let them build a deep intuition for how gene regulatory networks
> and individual loci interact to form a diverse array of morphologies with small changes.
>
> The students have no developmental background, so I'd like to keep the number of loci small c but I want this to empower
> them to explore how diverse bodies and limb forms (like the differences in horses and ichthyosaurs and bats and humans and
> skinks of sorts). The oscillating somite clock is also key, but I want them to see the wavefronts and the oscillator
> and—through part by part manipulation—build an understanding of the system.
>
> The current ones feel unengaging and the genetic controls too abstract. I also fear we've continued our drift towards
> assessing students relative to building understanding in the students

> While loci small, I do want them named clearly, though

### What draft 2 got wrong, against that note

- Every stage a roll: set discrete arrow levels, Go, verdict, "Hit the three targets". Nothing moves while a control moves.
- About 19 gene names over five stages; the controls are arrows on a diagram at three or four levels.
- The only task is the target. That is the "assessing" he names.

### Draft 3: what changes (24 and 25 together)

- **Split by subject.** 24 = bodies (the clock, the front, segments, Hox along the body). 25 = limbs (the bud, digits, the
  animals), ending on the map and clades. Draft 2 had limbs in 24 and only the map in 25.
- **Four genes in 24: Hes7, Fgf8, Hoxc6, Hoxc10.** Five in 25: Fgf8, Shh, Grem1, Bmp4, Sox9. Each named on its own card.
  Dropped as names: Mesp2, Tbx5, Tbx4, Fgf10 (24); Gli3, Hox13, Meis, Hoxa11, Hoxa13, Wnt (25).
- **Live models.** No Go. The cell, the body and the limb run all the time; a slider acts on the running thing. After a run
  ends, a change regrows it. ↺ regrows.
- **Parts come on one at a time.** A stepper adds a part; each addition changes what the picture does.
- **Controls are a named gene's own steps**: introns clicked out of the gene, an mRNA's half-life, a protein's half-life, a
  level of transcription, the hour a Hox gene comes on (a flag dragged on the body).
- **Find, not hit.** A short list per stage of things to find; a find ticks itself off the live model; nothing reports a
  miss. The animal stages: build any three of four (24 C), any four of five (25 C).
- R panels kept, last and closed.

### Lesson 24, draft 3 (v3, 11 bits: A 3, B 5, C 3)

    A  one cell, Hes7        parts (3): transcription + mRNA decay; translation + protein decay; the protein binds its own
                             promoter (pulses)
                             controls: three introns (buttons on the gene; a control, not a part: the real gene has
                             them), mRNA half-life, protein half-life
                             picture: the cell (polymerases on the gene, mRNA, protein, promoter bound or free); the last
                             10 hours as two strips of shade with the peaks marked and the minutes between them
                             find: A1 pulses that keep going · A2 pulses sooner · A3 pulses stop, the protein still binding
    B  a row of cells        parts (4): A's cell in every cell; the tail adds cells; Fgf8 made only in the tail, its mRNA
                             decaying in cells left behind, Hes7 stopping where it runs out (segments); Fgf8 speeds Hes7
                             (stripes travel from the tail)
                             controls: Hes7's introns and protein half-life; Fgf8's mRNA half-life
                             find: B1 four segments · B2 smaller segments · B3 one block · B4 Hes7 stops farther from the
                             tail · B5 two stripes of Hes7 behind the tail at once
    C  the whole body        B's body for 64 hours + Hoxc6 and Hoxc10, each on in the tail from an hour (a slider on its
                             card; no flags dragged on the body in this draft). A cell keeps the code it left the tail
                             with. Neck in front of Hoxc6, ribs from Hoxc6 to Hoxc10, forelimb where Hoxc6 starts,
                             hindlimb where Hoxc10 starts; Hoxc6 from the first segment: no forelimb
                             starts as a mouse (Hoxc6 hour 12, Hoxc10 hour 39: 7 / 13 / 12)
                             cards: goose, a long lizard, snake; any two of three opens the code

- Engine: every cell carries A's delay equation, stepped live (ring buffers); a new tail cell copies the tail cell. A boundary
  where stopped cells' Hes7 passes from .8 or less to 1.25 or more of its resting level.
- **Introns unequal: 2.5 / 2.5 / 14 minutes; delay = 14 + the introns present** (33 all, 28 third only, 14 none). The three
  experiments come out of the one rule:
  - introns 1 + 2 out (Harima 2013: delay 5 min shorter, faster tempo, more vertebrae): 106 against 122 minutes, 36 against 32
    segments
  - all three out (Takashima 2011: 19 min shorter, no oscillation, fused): steady, one block
  - protein half-life 22 → 30 (Hirata 2004: segmentation fails after a few somites): 2 to 6 segments, then a block
- Live: no Go. A stage steps while it is open, on screen, not paused. "fast" = three times. A part toggled restarts the run;
  a slider acts on the running thing; a finished body regrows on a Hes7 or Fgf8 change; Hox sliders relabel a finished body
  at once.
- Finds latch; an unfound find writes nothing.
- MEASURED (scratchpad l24v3; the check re-derives):
  - one cell (period / swing), mRNA half-life 3, protein half-life 6 / 11 / 16 / 22 / 28 / 30: all three introns 98/.98,
    113/.92, 120/.80, 122/.56, 123/.19, 124/.07; third only 88/.96, 100/.88, 105/.71, 106/.35, steady; introns 1 + 2 only
    68/.91, 76/.70, 77/.24, steady; none 56/.82, 61/.38, steady
  - mRNA half-life 1.5 / 3 / 6 at the default: 115 / 122 / 134 minutes
  - levels: with binding mRNA 1 to 20, protein 354 to 1271 (rest 606); without binding 108 and 10,303
  - 24 hours (40 cells at the start, .1 cell a minute): 14 segments of 12 to 13 cells; one small intron out 15 of 11.3;
    1 + 2 out 16 of 10.7; third out: a block of 142; half-life 30: a block of 101; half-life 6: 17 of 9.7
  - Hes7 stops (.1737 × Fgf8 half-life) cells from the tail: 400 → 71, 500 → 88, 800 → 140
  - stripes between the tail and where Hes7 stops: with "Fgf8 speeds Hes7" two for 633 of 739 minutes; without, never two
  - 64 hours (10 cells at the start): 32 segments; third intron out + half-life 6 to 14: 57 to 51; none + 6 to 11: 69 to 64;
    all three + half-life 6: 40
  - cards on the whole-hour grid of Hox times: goose 216 to 281 settings at every clock; long lizard 187 to 284 (needs a
    faster clock: none at the default); snake 16 to 29 (third intron out and half-life 14 or less; Hoxc6 at hour 0)
- Thresholds (windows on the idea; each re-measured on the page by the check):
  - A1: translation and binding on, 600 minutes since the last change, swing over the last 150 minutes ≥ .35
  - A2: mean gap between peaks since the last change ≤ 118 minutes (the mouse: 122), swing over 300 minutes ≥ .2
  - A3: 240 minutes since the last change, swing over 240 minutes < .12. Measured: intron 3 out, 452 minutes after the
    change; protein half-life 30 / 35 / 40, 1309 / 644 / 518 minutes; half-life 28 and under, never
  - B1: ≥ 4 somites · B2: mean of the last five somites made since the last change to Hes7 ≤ 11.7 cells (the mouse:
    12.0-12.2), no credit in a run whose Fgf8 half-life was changed · B3: ≥ 60 cells stopped since the last boundary,
    Fgf8 on · B4: ≥ 76 cells between the tail and where Hes7 stops (the mouse: 71 at most) · B5: two stripes for 60
    minutes in all
  - C, any two of three. Goose: neck ≥ 14, ribbed ≥ 3 and no longer than the neck, both limbs (card: Hoxc6 hour 30,
    Hoxc10 hour 46 → 16 / 8 / 8). Lizard: ≥ 35 vertebrae, neck 3 to 9, ribbed ≥ 20, both limbs (card: introns 1 and 2
    out, protein half-life 11, hours 8 and 50 → 6 / 25 / 8). Snake: ≥ 48 vertebrae, no forelimb, ribbed ≥ 40 (card:
    intron 3 out, protein half-life 11, hours 0 and 56 → 0 / 46 / 6; Hoxc6 has to be on from the start). The mouse
    (7 / 13 / 12) is none of them; the Hox hours alone reach only the goose

- Engineering (2026-11-10):
  - the page's clock runs only while something is moving (`wake()`); `?still=1` keeps it stopped and the checks step the
    models themselves
  - `scripts/check_layout.js` asks every page for `?preview=1&still=1`; other lessons ignore the flag
  - a headless Chrome launch costs about a minute on JM's machine: one launch per check; `check_lesson24_numbers.js`
    runs in about a minute
  - the fade threshold was .08 and took 1807 minutes at half-life 30; .12 since 2026-11-10

- Looked at, 2026-11-10 (every part-by-part state at 1400 and one state per stage at 1000; a subagent's pass, reviewed):
  - canvas labels 12.5-13.5 px on the 760 frame (were 10.5-12; under 10 px on screen at 1400)
  - the clock sits in the corner of the label gutter (it ran into "head")
  - A draws every molecule it counts at the default settings: 224 mRNA slots, 1360 protein slots (was 110 / 440, with
    10303 protein printed). Still short at mRNA half-life 6 with protein half-life 40 and no binding (37464 printed)
  - B's Parts panel under the row, C's Hes7 card under the body: the two columns end within 30-100 px of each other
  - one column from 1180 px down (other lessons: 1040); between 1180 and 1300 the labels are 10-11 px
  - a body with no ribbed vertebrae labels its rear stretch "behind", not "behind the ribs"
  - not seen: hover tips opened, the R panels opened, the done banner, the models moving (still frames only)
  - B with parts 1-3 has every cell in step, so the row flashes as one; stripes in the tail appear only with part 4

### Sources for draft 3

- Checked by search 2026-11-09/10: Gomez et al. 2008 (*Nature* 454:335: a snake's clock fast against its growth); Matsuda et
  al. 2020 (*Science*: mouse and human clocks differ by degradation and delays, not by the HES7 sequence, so the page does
  not say species differ at Hes7); Harima et al. 2013 (*Cell Rep* 3:1: two introns out, delay 5 min shorter, faster, more
  cervical and thoracic vertebrae); Takashima et al. 2011 (*PNAS* 108:3300: all introns out, 19 min shorter, no oscillation,
  fused); Hirata et al. 2004 (*Nat Genet* 36:750: half-life 22 → 30 min, segmentation fails after a few somites).
- From memory, not checked, not in docs/refs: Burke et al. 1995 (Hoxc6 at the neck's end: mouse 7, chick 14, goose 17); Cohn &
  Tickle 1999 (python); Wellik & Capecchi 2003 (Hox10 and ribs).
- Stylised: "Fgf8 speeds Hes7" stands for the slowing of the clock toward the front; the delay is 33 minutes where the papers
  fit 29; an intron's delay is drawn as transcription length (it is splicing and export too); Hoxc6 and Hoxc10 stand for
  their paralogue groups; Hoxc6 drawn on all the way to the tail; ribs end at Hoxc10 (a snake's Hox10 does not stop ribs:
  not modelled); a snake is built here by Hes7's kinetics (nothing on the page says snakes differ at Hes7).

### Open for JM (draft 3)

1. The split: bodies in 24, limbs and the map in 25. Recommend as built.
2. The finds are things found, so most bits end at 1 in a finished code; what tells students apart is the counts and time.
   Say so if a stage should end on a tested round after the building.
3. The tail's growth is not a control (not a gene). A snake is a fast clock here, nothing else.
4. 24 C starts as a mouse; cards goose, long lizard, snake, any two. A frog (few segments) cannot be built: the slowest
   clock is 136 minutes.
5. Intros are goal-then-controls lists for dictation, as before. No lecture quote covers the somite clock; C carries the
   co-linearity quote.
6. Hox on-times are sliders, not flags dragged on the body. Flags are the better control; not built.
7. The snake needs Hoxc6 on at hour 0 exactly; at hour .5 it has a forelimb. Widen if that is too fine a setting.
8. B and C's clocks run past the hours of growth their hover text names (24 → 35.6, 64 → 75.6) while the last cells stop.

### Items (draft 3)

    plan           this section                                                    done 2026-11-10
    engine         one stepped Hes7 cell; body of cells; Hox by hour               done (scratchpad l24v3)
    page           app/lessons/lesson24.html rebuilt, v3, 11 bits                  done 2026-11-10
    check          scripts/check_lesson24_numbers.js rewritten                     done 2026-11-10
    LOCKS, index   titles                                                          done 2026-11-10

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

## JM on draft 1, 2026-11-07 (verbatim)

> For 24/25 the developmental runs should be more explicit and specific. We can and should name things like HES and also put
> transcription/mRNA decay in there. I don't think we need or want any line plots, though more embryo-shaped visualizations would
> be ideal. I want them to set values for core genes and modify expression levels and watch what happens. Simplified in the sense
> that only a core set of genes are shown, but explicit in the steps involved like mRNA decay. Same with the limbs, where instead
> of embryological terms like hand plate we should use more genetic-developmental terms.

> I also don't want manipulations like a scalpel involved—purely modulating the expression of different genes is what I'm after

Read as:
- every control is a gene's expression step: transcription rate, mRNA or protein half-life, the delay before new mRNA is ready
  (Hes7's introns), or where a gene is switched on. No scalpel, no bead, no growth-speed slider.
- named genes, a core set per stage: Hes7, Fgf8, Mesp2; Hox, Tbx5, Tbx4, Fgf10; Fgf8, Shh, Grem1, Bmp4; Sox9, Bmp, Wnt, Hox13, Gli3.
- pictures are a cell, an embryo, a bud, a limb skeleton; no line over time anywhere.
- regions named by their genes: the Meis region, the Hoxa11 region, the Hoxa13 region (not upper arm / forearm / hand-plate).

## Facts checked for draft 2 (web, 2026-11-07)

- Hes7 protein half-life about 22 min; a K14R form at about 30 min damps the clock, segmentation fails after 3-4 cycles (Hirata
  et al. 2004, Nat Genet 36: 750).
- Hes7's three introns delay new mRNA by about 19 min; without them the clock stops and every somite fuses (Takashima et al.
  2011, PNAS). Two of the three removed: a faster clock, more somites and vertebrae in the neck and upper chest (Harima et al.
  2013, Cell Rep 3: 1).
- Digits: Bmp promotes Sox9, Wnt represses it, Sox9 represses both (Raspopovic et al. 2014, Science 345: 566; their parameters
  not found, so the page's are its own, with their signs). Less distal Hox (Hoxa13, Hoxd11-13) gives more, thinner digits:
  the dose sets the spacing (Sheth et al. 2012, Science 338: 1476).
- Fgf8 mRNA made only in the tail and decaying in the cells it leaves behind makes the gradient (Dubrulle & Pourquie 2004,
  Nature 427: 419): from memory, not rechecked.

## Draft 2 plan and measurements (2026-11-07; scratchpad l24v2/)

    A  one cell's Hes7 (hes.js). dm/dt = k / (1 + (p(t - tau) / p0)^2.5) - ln2/hm m; dp/dt = a m(t - 2) - ln2/hp p.
       k 25 mRNA/min, a 3, p0 200, hm 3 min, hp 22 min, tau 33 (3 introns) / 26.6 (1) / 14 (none).
       Measured: tau 14 steady; 26.6 period 102 min, swing .27; 33 period 122, swing .56; 40 period 143.
       hp 11 / 16 / 22 / 26 / 30: swing .92 / .80 / .56 / .34 / .11 (30 damps: Hirata). hm 1.5-12: period 115-151, no damping.
       Transcription rate: swing up, period unchanged. The period is set by the delay.
       A1 no feedback (the protein cannot shut its gene): protein = k a hm hp / ln2^2; mRNA half-life free from 3: protein in a
          window (one step doubles it, two overshoot).
       A2 feedback; the delay free from none: the cell pulses (swing .2 or more).
       A3 the delay 3 introns; protein half-life free from 22: stronger pulses (swing .75 or more: 16 or 11).
       Picture: the cell (nucleus, the gene with its introns, mRNA and protein as dots), a strip of the cell every 20 min.
    B  the embryo (emb.js): tail cells carry the clock; a cell's Fgf8 mRNA decays after it leaves the tail (half-life hF); its
       clock slows as Fgf8 falls (rate .4 + .6 Fgf8); at Fgf8 .3 the clock freezes; Mesp2 marks a boundary where frozen cells
       pass from low Hes7 to high. One cell trajectory read at each cell's own clock time (exact: no coupling).
       24 h, hF 416: 3 introns 9 somites, 1 intron 11, none 1 then fused; protein 30 min 3 then fused; hF 200 / 416 / 830: Hes7
       stripes in the tail 1 / 2 / 3.
       B1 more somites (the delay free from 3 introns: Harima); B2 somites stop after a few (protein half-life free: Hirata);
       B3 more Hes7 stripes in the tail (Fgf8 mRNA half-life free; a snake's tail: Gomez et al. 2008).
       Picture: the embryo from above, head to tail, somites in pairs, the tail shaded by the gene chosen (Hes7 mRNA, Hes7 protein,
       Fgf8 mRNA, Mesp2).
    C  where a limb goes: rules on 24 somite levels (draft 1's), named: Hox genes come on in order (when they start: the arrow);
       Tbx5 in the lateral plate where 5-6 Hox genes are on, Tbx4 where 7-9; Fgf10 switched on at the first Tbx5 level and the first
       lumbar level makes a bud; Fgf10 can be switched on at one flank level (a click: where a gene is on, not a bead).
       C1 the forelimb further back (Hox later: a longer neck); C2 an extra leg (Fgf10 on in the back of the flank, where Tbx4 is);
       C3 no forelimb (Hox early: a python's code).
       Picture: the embryo from the side, somites along the back, lateral plate below (Tbx5 hatched, Tbx4 dotted), buds drawn.
    D  the bud's loop (bud.js; draft 1's engine, sources scaled by transcription): Shh x .3 / 1 / 3: 1.01 / 1.70 / 2.29 mm;
       Fgf8 x 1 / 2: 1.70 mm at hour 17 / 1.78 at hour 9.4; Grem1 x 20 / 80: 1.70 / 2.00 (below 20 it plateaus near 1.45, at 1
       no growth); Bmp4 x 1-5: 1.70-1.46 (x 10 no growth).
       D1 1.6-1.8 mm (Shh free from .3); D2 the same length by hour 10 (Fgf8 free); D3 1.9 mm or more (Grem1 free
       from 20). Picture: the bud on the flank, four copies, one a gene (Fgf8, Shh, Grem1, Bmp4); outlines every 5 hours.
    E  Sox9-Bmp-Wnt, row by row (bsw.js): ds/dt = -s + b - w - s^3; db/dt = -1.59 s - .1 b + h b''; dw/dt = -1.27 s - .5 w +
       .1 h w''; h set by the region's Hox code: Meis region 10 (8 cells wide), Hoxa11 region 4 (12), Hoxa13 region 1.5 x Hox13
       (22 - 8 (Gli3 - 1) cells). 16 limbs, 4 ms a limb.
       Hox13 x .5 / 1 / 2 / 3: digits 10 / 5 / 4 / 3 (16 of 16 at 1-2-5). Gli3 x 1 / .5 / 0 (width 22 / 26 / 30): 5 / 6-7 / 7-8.
       E1 1-2-5 (Hox13 free from x .5); E2 three digits (Hox13 free from x 1; values .5, 1, 3); E3 seven or more (Gli3 free,
       normal / off). Picture: the limb's outline with the Sox9 cells dark; the 16 limbs as 16 small skeletons.
    map    (map.js, for lesson 25) digits by width x Hox13: at width 18 the count jumps 7 -> 5 (six never), at 22 every count
           3-8 and 10 (nine never); at 26 nine never.

## Draft 2 as built (2026-11-07; v2, 15 bits)

    every control  a gene's expression step: a transcription rate, an mRNA or protein half-life, the delay before new mRNA is
                   ready (Hes7's introns), where a gene starts or is switched on. An arrow to "broken down" is thicker the faster
                   the breakdown. No scalpel, no bead, no growth slider; no line over time.
    A  one cell    the cell (nucleus, the gene drawn with its introns, mRNA strokes, a protein dot per 25) and the cell every 20
                   minutes. A1 no binding, mRNA half-life free from 3 (10,303): protein 15,000-30,000 (6: 20,606; 12: 41,211;
                   the closed form k a hm hp / ln2^2 printed beside it in the check). A2 the delay free from none (swing 0):
                   swing .2 or more (1 intron .34, 3 introns .57). A3 protein half-life free from 22 (.57): .75 or more (16: .80;
                   11: .92; 30: .26).
    B  embryo      from above; menu Hes7 mRNA / Hes7 protein / Fgf8 mRNA / Mesp2. 24 hours. B1 the delay free from 3 introns
                   (9 somites): 11 or more (1 intron: 11; none: 1, then a block). B2 protein half-life free from 22 (9): 5 or
                   fewer (30: 3, then a block of 159 cells). B3 Fgf8 mRNA half-life free from 400 (2 stripes): 3 or more (800: 3).
    C  side view   Hox bars over the somites, the flank hatched (Tbx5) or dotted (Tbx4), Fgf10 dark, buds below. C1 Hoxc6 free
                   from somite 8: the arm at somite 11 or later (12). C2 Fgf10 switched on by a click in the flank: an extra leg
                   (somites 12-19; 9-11 give an arm; the neck nothing). C3 Hoxc6 free: no arm (from somite 1).
    D  the bud     four copies, one gene each (Fgf8, Shh, Grem1, Bmp4), and the bud every 5 hours. D1 Shh free from x .3
                   (1.01 mm): 1.6-1.8 (x 1: 1.70; x 3: 2.29). D2 Fgf8 free: stopped by hour 10, 1.6 mm or more (x 2: 1.78 at
                   9.4). D3 Grem1 free from x 1: 1.9 or more (x 4: 2.00; x .25: 1.50).
    E  skeleton    the limb's outline with the Sox9 cells dark; the 16 limbs small, each with its counts. Over 20 seed sets of 16
                   limbs every case is 16 of 16 or 0 of 16: E1 Hox13 free from x .5 (ten digits): 1-2-5 (x 1); E2 Hox13 free
                   from x 1: three digits (x 3); E3 Gli3 free: seven or more (not made: 7-8).
    checks         `check_lesson24_numbers.js`: 30 checks + both widths + five R panels (shortened); run in full, the R
                   panels give the page's numbers (swing .57, 9 somites, 1.70 mm, 1-2-5).
    left out       Antennapedia; Lfng and Notch (the cells do not talk: each runs its own Hes7 from minute 0); Tbx5 itself as
                   a control (Hoxc6 does the work); proximal-distal identity read off D's bud (E's regions fixed).

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
| 7 | JM plays draft 1; Open 1-4; his voice | done 2026-11-07 (his notes above; Open 1-4 not ruled) |
| 8 | draft 2: named genes, expression steps, embryo-shaped pictures, no line plots, no scalpel or bead | done 2026-11-07 (v2, 15 bits) |
| 9 | JM plays draft 2; his voice | todo |

## Rulings

- 2026-11-07: the evo-devo lesson: a simplified limb network, standard models; diffusion and growth drive differential
  expression, self-limiting size, known skeletal patterns. Toy network first (perhaps no numerical model), a somite clock, limb
  location, growth to a size, skeletons of different tetrapod limbs.
- 2026-09-22 (sandbox brief, agreed): termination from the model, not a slider; BMP shuts down FGF; outputs length and duration.

## Do not

- Put a manipulation on screen (a scalpel, a bead, a graft) or a growth-speed slider: every control is a gene's expression
  (JM, 2026-11-07).
- Draw a line over time: cells, embryos, buds and limbs only (JM, 2026-11-07).
- Name regions by anatomy or embryology (hand-plate, autopod): by the genes on there (JM, 2026-11-07).

- Put a "stop" or "size" slider on the limb: the size is an outcome (JM 2026-10-01: never a slider on a drawn outcome).
- Call the network a DAG on screen: it has loops.
- Name on screen what the runs show (positional information, Turing, clock and wavefront): the no-vocabulary rule.
