# docs/refs: limb-development modelling papers

The PDFs in this folder are gitignored (copyright). This summary is tracked. JM added them 2026-11-07 for the evo-devo lesson
(`docs/overhauls/evodevo_plan.md`); the 2012 review came from his link the same day
(https://academicweb.nd.edu/~yzhang10/Limb-Mathematical_Biosciences_2012.pdf). Quotes are verbatim; "Reading" marks mine.

| File | Paper |
|------|-------|
| `journal.pcbi.1014348.pdf` | Ben Tahar S, Comellas E, Duerr T, Bakr D, Monaghan J, Muñoz JJ, Shefelbine SJ (2026). Development of whole-limb skeletal patterning through the coordination of growth and self-organization models. *PLoS Comput Biol* 22(7): e1014348 |
| `2025.03.20.644440v2.full.pdf` | the same authors' preprint (bioRxiv 10.1101/2025.03.20.644440 v2, 2025-06-10), "Growth and patterning in vertebrate limb development: a timescale perspective on skeletal specification". **The same model**: "GPP" (growth-processing-propagation) in the preprint is "GRD" (growth-reaction-diffusion) in the journal. Cite the journal |
| `limb.pdf` | Dillon R, Othmer HG (1999). A mathematical model for outgrowth and spatial patterning of the vertebrate limb bud. *J Theor Biol* 197: 295–330 |
| `s44320-025-00128-y.pdf` | Matyjaszkiewicz A, Sharpe J (2026). LimbNET: collaborative platform for simulating spatial patterns of gene networks in limb development. *Mol Syst Biol* 22(2): 228–240 |
| `zhang_alber_newman_2012.pdf` | Zhang Y-T, Alber MS, Newman SA. Mathematical modeling of vertebrate limb development. *Math Biosci*, doi 10.1016/j.mbs.2012.11.003 (the accepted manuscript, 2012) |

What each gives the lesson, at a glance:

    limb position (where)        none of the five; LimbNET's proximal-distal network is the nearest (see Gaps)
    growth driven by a signal    Dillon & Othmer: growth rate = s1 x (AER factor) + s2
    growth that stops itself     none models it; Dillon & Othmer's feedback needs its two sources close (Reading, below)
    proximal-distal identity     LimbNET (Uzkudun et al. 2015's network: FGF, retinoic acid, Meis, Hoxa11, Hoxa13)
    the skeleton                 Ben Tahar et al.: one reaction-diffusion pair on a growing limb gives 1 -> 2 -> 5 elements
    different limbs              Ben Tahar et al. (mouse and axolotl, 2 to 6 digits); Zhang et al. (Zhu et al. 2010: fins,
                                 ichthyosaur paddles, Tiktaalik from one network)
    deep homology / evolution    Ben Tahar et al.'s discussion; Zhang et al. (canalising selection; fin to limb)

## Ben Tahar et al. 2026 (and the 2025 preprint)

What it is: "a reaction-diffusion system within a growing domain, where reaction represents the regulation of patterning cues and
diffusion captures their spatial propagation. The relative contribution of growth, reaction and diffusion is modulated through two
non-dimensional parameters, whose spatial variation is informed by positional cues derived from experimental morphogen maps."

The model:
- Two species. "u represents the specification of the skeletal elements (i.e. differentiation to cartilage), while v represents
  an antagonist of this specification." Journal: "High values of u simulate Sox9-positive cells".
- dc/dt + S c = βD D ∇²c + αR R(c), with S the growth rate (the "convective term ... accounts for signal transport caused by
  tissue expansion"). Schnakenberg kinetics: f(u, v) = a − u + u²v, g(u, v) = b − u²v; d = Dv / Du.
- Table S1 (preprint): a 0.47, b 2, d 113 for both species. Mouse: αR 1 → 2 → 8 (switches at 0.13 and 0.45 of final length),
  βD 1, 26 at the AER. Axolotl: αR 1 → 5 → 35, βD 15.
- "Simulations were initialized with random perturbations (10% variation) around the steady state".
- Growth is measured, not modelled: limb outlines from images, the tissue treated as an elastic sheet pulled to each outline.
  Code: https://gitlab.com/turing-embryogenesis-group/gpp-code.git (MATLAB, finite elements).

What the two parameters do:
- "αR controls the wavelength of the pattern, which determines the number of stripes (skeletal elements) formed. As αR increases
  distally, the wavelength shortens, allowing a transition from one stripe (humerus) to two stripes (radius and ulna) and
  eventually to multiple stripes (digits)." "The parameter βD governs the orientation of the stripe-like patterns".
- "By adjusting the weight of processing relative to growth, we can modulate the number of digits formed, ranging from two to six".
- "Proximally, αR = 1 and βD = 1, indicating that processing, propagation, and growth all contribute to the emerging pattern.
  Distally, however, higher values of αR and βD (8 and 25) indicate that processing and propagation dominate over growth."
- Below 1 "growth effects dominate and produce an apparent stretching of the patterns"; above 1, "outcomes similar to those
  observed in static (non-growing) domains" (journal, Fig 2).
- Knock-outs: no positional cue and no AER, "simple stripe patterns, potentially corresponding to a rudimentary stylopod
  element"; no AER "disrupts stripe orientation"; no positional cue "does not produce a stripe-like pattern for more proximal
  skeletal elements". Journal Fig 4D: "Decreasing the strength of the diffusion relative to growth ... leads to a loss of the
  digits orientation."
- Progressive against early identity: "Only the progressive identity scenario leads to appropriate skeletal patterning, with
  sequential emergence of the humerus, radius/ulna, and digits."
- Sensitivity (journal): "The stylopod and zeugopod patterns remain relatively unaffected compared to the autopod".
- Time: axolotl "εf = 3.95 over a period of 12 days. This implies a characteristic growth timescale TG = tf/εf ≈ 3.03 days."

For evolution:
- Axolotl differences: "salamanders do not form a morphologically distinct AER"; "In amniotes, digits form in a
  posterior-to-anterior sequence, through a paddle stage that is later sculpted by apoptosis in the interdigital regions. In
  contrast, axolotl digits emerge sequentially in an anterior-to-posterior order". Yet "a single framework predicts whole-limb
  skeletal patterns in both mice and axolotls".
- "features such as autopod elongation in bats, digit loss in tetrapods or even limb regeneration properties could be reexamined
  as a modulation of growth rate relative to processing and propagation." The fin-to-limb shift "offers a compelling test case".
- Preprint: "The concept of deep homology, which describes shared developmental mechanisms underlying diverse anatomical
  structures, suggests that common self-organizing principles shape limb formation across evolution".

Reading: the cheapest route to the skeleton stage (2Y E). One Schnakenberg pair on a 2-D grid that lengthens, αR rising from the
body to the tip, gives one element, then two, then five; digit count is a slider on αR; βD at the tip sets whether the digits
fan out. Whether a finite-difference grid in a canvas page reproduces that at page speed is the first thing to measure (d = 113
makes v's diffusion set the time step).

## Dillon & Othmer 1999

What it is: "A new model for limb development which incorporates both outgrowth due to cell growth and division, and
interactions between morphogens produced in the zone of polarizing activity (ZPA) and the apical epidermal ridge (AER)". 2-D,
the tissue "treated as a Newtonian fluid", the bud's edge a moving boundary.

The model:
- Two morphogens from two sources. The AER "serves both as the source of a substance that maintains cells in the
  undifferentiated state and as the source of one of the morphogens" (FGF-4); the ZPA is the source of the second (Shh).
  "All ectoderm is assumed to be impermeable to both morphogens, and both morphogens are degraded in the interior".
- The reduced network (their Fig 3b): "production of Shh is affected by FGF-4 which diffuses from the AER, and the reciprocal
  effect of Shh on production of FGF-4 in the AER." Production is Michaelis–Menten in the source, decay everywhere:
  R1 = V1 c2 / (K2 + c2) − k1 c1 in the AER, R2 = V2 c1 / (K1 + c1) − k2 c2 in the ZPA.
- Growth driven by the morphogen: "S = s1 c1 + s2. The growth rate comprises a constant component s2 = 0.1 that represents a basal
  growth rate, and a component proportional to the concentration of the growth factor c1. We set the first order rate constant s1
  equal to 10/3." "the growth rates are highest in the distal region. This is consistent with experimental observations which
  show that the mitotic rate is highest in the PZ and about one-fourth that rate in the proximal limb bud."
- Scale: the chick bud's "length increases from ~0.25 to ~1.75 mm in the 36 hours between stage 18 and stage 25, and patterning
  occurs in this interval." (The two approximate signs are garbled in the PDF's text.)
- The loop holds only when the gain is high enough: in their one-dimensional analysis a positive steady state exists when the
  product of the two production slopes (V1/K2, V2/K1) exceeds a term "determined by the diffusion coefficients and the decay rates"
  (a sinh of the sources' separation in units of the decay length).

How a cell reads it:
- "the history of a cell's exposure to the morphogens depends heavily on where the cell originates in the early limb bud";
  "interpretation functions based on the history of a cell's exposure to the morphogens can qualitatively account for observed
  patterns of gene expression."
- The progress zone as a threshold: "the region in which the concentrations of the AER morphogen and the ZPA factor are above a
  given threshold", cells leaving it "in a posterior to anterior sequence".
- A footnote proposes the proximal-distal split itself: with zero concentration at the body end, "a sequence of thresholds could
  produce the partitioning in the PD direction into three levels that could correspond to humerus, radius and ulna, and wrist and
  digits."
- Experiments it is meant to answer: AER removal "stops outgrowth of the limb and leads to a truncated limb with distal skeletal
  deficiencies"; ZPA grafts to the anterior margin give mirror duplications.

Reading: the source for the growing stage (2Y D). Growth comes out of the signal, so a limb's size can come out of the network,
which the 2026-09-22 brief needs (agreed with JM then: termination comes from the model, not from a slider). The paper does not stop
the limb: it predates Gremlin's place in the loop. Its existence condition is the termination argument in JM's lecture ("As it
grows, the AER and ZPA get farther apart") in one dimension: separation raises the sinh term until the loop cannot hold. That is
my inference from the formula; they do not run a bud to a stop.

## Zhang, Alber & Newman 2012 (review)

What it is: a review of the limb models of "outgrowth and shaping of the limb bud, establishment of molecular gradients within the
bud, and formation of the skeleton".

Positions worth keeping:
- Two views of the skeleton. Positional information: cells read "spatial coordinates, the values of which are specified by graded
  concentrations of, or duration of exposure to, 'positional information' (PI) molecules". Self-organisation:
  "quasi-periodic limb-like skeletons can form from dissociated, randomized mesenchymal cells repacked into ectodermal hulls".
  Their verdict: "Most likely the PI gradients fine-tune the details of the skeletal elements during their formation".
- Shh's place: "its absence (along with a transcriptional regulator of its function, Gli3) actually leads to increased numbers of
  digits via the impairment of its role in limb bud shaping ... This indicates that Shh is a modulator of skeletogenesis rather
  than part of its core generative mechanism."
- The AER keeps the tip unpatterned: its factors keep "the mesenchyme of the limb tip in a developmental labile state, primarily
  by suppressing its capacity to condense"; cells condense "only at a sufficient distance (~0.3 mm) from the AER". Hence the
  proximal-to-distal order.
- Newman & Frisch 1979: standing waves in a shrinking distal "diffusion chamber"; "the distance l_z acts as a control parameter
  for transitions in the number of parallel elements (i.e., a single stylopod, two zeugopodal elements, three digits)", and "an
  increase in l_y, which occurs in other types of limbs during development, would lead to a further increase in digit number."
- Hentschel et al. 2004: an active zone where elements are laid down and a frozen zone where "condensed cells leave the proximal
  end of the active zone".
- Shh gradients bending a Turing pattern (Glimm et al. 2012): the "loss of a middle finger in mouse embryos that were genetically
  modified such that a shallower Shh gradient was present", "an ectopic digit posterior to mouse digit V", digit fusion where "a
  limb-specific enhancer of Shh expression is duplicated".

For evolution:
- "A reaction-diffusion mechanism can provide a range of patterns during the origination of a character such as the limb
  skeleton, with some forms gradually become stabilized by canalizing selection over time".
- Zhu et al. 2010: "with adjusted kinetic parameters and limb bud contours, but conserved regulatory network topology ... could
  reproduce the features of fossil limb skeletons, including some from extinct fish-like ancestors and ichthyosaurs", among them
  "the lobe-finned fish Tiktaalik".
- "morphodynamic effects can have dramatic consequences for developmental and evolutionary change (Salazar-Ciudad and Jernvall,
  2005; 2010)" (teeth).

Reading: the review is the bridge from 2Y to 2Z. A conserved network with its settings varied gives fins, limbs and paddles
(deep homology: one network, many structures); "canalizing selection" is the mesoevolution lesson's mechanism stated in one line.

## Matyjaszkiewicz & Sharpe 2026 (LimbNET)

What it is: "LimbNET enables remote users to define and simulate arbitrary gene regulatory network (GRN) models of 2D
spatiotemporal developmental patterning processes", at https://limbnet.embl.es, on a mouse hindlimb bud and a catshark fin bud.

Models it carries:
- Proximal-distal identity (Uzkudun et al. 2015, "Model C" and "Model F"): "F, FGF; R, retinoic acid; C, Cyp26b1; M, Meis;
  A11, Hoxa11; A13, Hoxa13", signals "from, respectively, the proximal and distal ends of the growing limb bud". "The network is
  largely composed of feedforward interactions with one feedback ... modelled using a combination of Hill-type dynamics".
  Interventions reproduced: "Global Meis overexpression induces a distal shift of the expression boundary between Hoxa11 and
  Hoxa13"; "removal of the AER ... can cause a loss of expression of Hoxa13"; a bead of retinoic acid "shifts distally the
  expression boundary between Hoxa11 and Hoxa13".
- Digits (Raspopovic et al. 2014, "BSW"): "a Turing system to explain the patterning of digits through the interactions of Bmp,
  Sox9 and Wnt signalling", giving "a five-digit striped pattern in the limb bud autopod ... modulated by a time-dependent
  distal-to-proximal gradient of FGF". Beads in a square dish: BMP beads give "local upregulation of sox9"; Wnt beads "locally
  repress Sox9 while upregulating its expression over a longer range."
- Somites (in passing): "the Progressive Oscillatory Reaction–Diffusion (PORD (Cotterell et al, 2015)) model in a rectangular
  domain" (Cotterell, Robert-Moreno & Sharpe 2015, *Cell Syst* 1: 257–269, "A local, self-organizing reaction-diffusion model can
  explain somite patterning in embryos").
- Virtual beads: "Both the position and the timing of bead insertion can be defined, by clicking on a given triangle at a
  particular timepoint."

Limits: growth is prescribed ("LimbNET's pre-defined wild-type tissue movements"); "the current focus of LimbNET is to address
the complexities of pattern formation by GRNs per se", not "the physical morphogenesis". So it has no size that comes out of the
network.

Reading: the template for the network stages (2Y A, C). A network drawn as boxes and arrows, run on a 2-D bud, with beads as
the student's interventions, is the course's own pattern (paths.js arrows as sliders; clicking to place). The proximal-distal
network gives a three-domain stage (body, arm, hand) before the skeleton; the catshark fin bud is a deep-homology foil. Its
reference list holds Onimaru et al. 2016 (*Nat Commun* 7: 11582), "The fin-to-limb transition as the re-organization of a Turing
pattern".

## Gaps (for 2Y, none of them checked)

Nothing in the five covers:
- the somite clock: clock and wavefront (Cooke & Zeeman 1976); delayed self-repression as the oscillator (Lewis 2003); snakes'
  many somites from a faster clock relative to growth (Gomez et al. 2008, *Nature*);
- where a limb forms: FGF beads in the flank giving an extra limb (Cohn et al. 1995, the experiment in JM's lecture quote
  336_lec12_fgfs_02); the Hox code along the body (Burke et al. 1995); pythons' lost forelimbs (Cohn & Tickle 1999);
- the growth-termination loop JM's lecture uses (Shh → Gremlin ⊣ BMP ⊣ FGF; "Length encoded by Shh diffusion range"): Zuniga et
  al. 1999; Scherz et al. 2004; Verheyden & Sun 2008; Bénazet et al. 2009 (the last named in the 2026-09-22 brief).

Check each before it is cited on a page.
