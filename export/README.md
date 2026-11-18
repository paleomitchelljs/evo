# Evo-devo lecture GIFs

Looping, 1280 x 720, no explanatory text: only gene and protein names appear.
Rebuild with `python3 scripts/make_evodevo_gifs.py` (add a name to rebuild one).
Base drawings and their licences are in `base/`.

| GIF | What happens on screen |
|---|---|
| 01_hox_gene_regulation | A silenced Hox cluster (packed nucleosomes) opens from the 3' end; genes 1 to 13 fire in order while the embryo below lengthens, so each gene's domain starts farther back. |
| 02_multifactor_regulation_eve_stripe2 | Bicoid and Hunchback (activators, round) and Giant and Krüppel (repressors, square) across a fly embryo. A cursor sweeps front to back; the stripe 2 enhancer shows which proteins are bound, and *eve* turns on only in one stripe. |
| 03_hox_regionalization | Hox domains sweep back from their anterior limits along a row of vertebrae and, in step, along the somites of an E9 mouse embryo; ribs and sacrum then appear. |
| 04_hox_specification | Delete Hox10: lumbar and sacral vertebrae grow ribs. Delete Hox11: sacral become lumbar-like. Slide the Hox6 limit back: 7 neck vertebrae become 14. |
| 05_morphogen_cascade | A source cell releases a morphogen; in one receiving cell it binds a receptor, switches on a regulator (TF) that enters the nucleus, genes A to C turn on and D off. The row of cells then shows dose-dependent gene sets. |
| 06_placenta_transposon_enhancers | A transposon carrying binding sites copies itself next to unrelated genes. A hormone arrives; hormone-bound TF lands on every copy and the neighbouring genes switch on together. Copies far from genes decay. |
| 07_placenta_syncytin_cooption | A retrovirus fuses with a germ-line cell and its genome joins the host's. *gag* and *pol* decay, *env* is kept (syncytin). In the placenta the same protein studs trophoblast cells, which fuse into one multinucleate layer between maternal blood and fetus. |
| 08_placenta_development_overview | Human implantation: blastocyst attaches, trophoblast becomes an invading syncytium that taps maternal blood, lining cells decidualize. Closing icons: transposon for the decidua, virus for the syncytium. |

Sources behind the content: Small et al. 1992 (eve stripe 2); Wellik & Capecchi 2003
and Burke et al. 1995 (Hox10, Hox11, Hoxc6 boundary); Lynch et al. 2011 (MER20) and
Dunn-Fletcher et al. 2018 (THE1B and CRH); syncytin-1 is ERVW-1, syncytin-2 is ERVFRD-1.

# Bird morphospace

`bird_morphospace.png` (labelled) and `bird_morphospace_plain.png`: wing length against
tarsus length, log axes, for 11,004 species in AVONET (Tobias et al. 2022, CC BY 4.0).
The shaded box spans the observed range on each axis (theoretical); the dots are the
species that exist (realized). Kiwis are left out: AVONET codes their wing as 0.1 mm.
Rebuild with `python3 scripts/make_bird_morphospace.py`.
