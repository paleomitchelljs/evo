"""Humerus vs femur length in 231 living quadrupeds (198 mammals, reptiles): the bird plot's companion.

Reads data/clean/campione_evans_limbs.csv (Campione & Evans 2012, via MASSTIMATE).
Writes export/limb_morphospace.png (PhyloPic silhouettes; fetch them with
scripts/fetch_phylopic.py tetrapods) and export/limb_morphospace_plain.png.
"""
import csv
import json
from pathlib import Path
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import numpy as np
from matplotlib.offsetbox import AnnotationBbox, OffsetImage
from PIL import Image

REPO = Path(__file__).resolve().parent.parent
rows = [r for r in csv.DictReader(open(REPO / "data/clean/campione_evans_limbs.csv"))
        if r["humerus_length_mm"] and r["femur_length_mm"]]
W = [float(r["femur_length_mm"]) for r in rows]     # x: femur (hindlimb)
H = [float(r["humerus_length_mm"]) for r in rows]   # y: humerus (forelimb)
by = {r["species"]: (float(r["femur_length_mm"]), float(r["humerus_length_mm"])) for r in rows}

# species: (silhouette file, offset of the silhouette from the point in points, height in points)
SILS = {
    "Loxodonta africana": ("elephant", (-25, -80), 40),
    "Pongo Pygmaeus": ("orangutan", (-55, 40), 44),
    "Macropus rufus": ("kangaroo", (45, -45), 44),
    "Varanus komodoensis": ("komodo", (10, -62), 22),
    "Arctocephalus pusillus": ("fur_seal", (-55, 40), 28),
    "Gopherus polyphemus": ("tortoise", (-50, 35), 22),
    "Dipodomys ordii": ("kangaroo_rat", (42, -28), 26),
    "Microtus pennsylvanicus": ("vole", (-30, 32), 18),
}
SIL_DIR = REPO / "export/base/phylopic_tetrapods"
CREDITS = json.loads((SIL_DIR / "credits.json").read_text())

INK, MUTED, DOT = "#1f2328", "#59636e", "#2b5c8a"
DPI = 150

def longest_run(mask):
    """Indices of the longest unbroken run of True: drops stray specks set apart by blank space."""
    best, start = (0, 0), None
    for i, v in enumerate(list(mask) + [False]):
        if v and start is None: start = i
        if not v and start is not None:
            if i - start > best[1] - best[0]: best = (start, i)
            start = None
    return slice(*best)

def silhouette(slug, height_pt, max_aspect=1.8):
    im = Image.open(SIL_DIR / f"{slug}.png").convert("LA")
    a = np.asarray(im)[..., 1].astype(float) / 255
    a = a[:, longest_run(a.max(axis=0) > 0.05)]
    a = a[longest_run(a.max(axis=1) > 0.05), :]
    rgba = np.zeros(a.shape + (4,)); rgba[..., :3] = matplotlib.colors.to_rgb(INK); rgba[..., 3] = a
    px = min(height_pt, max_aspect * height_pt * a.shape[0] / a.shape[1])   # wide animals capped by width
    return OffsetImage(rgba, zoom=px * DPI / 72 / a.shape[0])

def draw(path, with_silhouettes):
    fig, ax = plt.subplots(figsize=(12.8, 7.2), dpi=DPI)
    fig.patch.set_facecolor("white")
    ax.scatter(W, H, s=70, color=DOT, alpha=0.35, lw=0, zorder=2)
    ax.set_xscale("log"); ax.set_yscale("log")
    ax.set_xlim(min(W) / 1.6, max(W) * 1.6); ax.set_ylim(min(H) / 1.6, max(H) * 1.8)
    ax.set_xlabel("Femur length, mm", fontsize=15, color=INK)
    ax.set_ylabel("Humerus length, mm", fontsize=15, color=INK)
    from matplotlib.ticker import FixedLocator, NullFormatter
    for axis, ticks in ((ax.xaxis, [10, 30, 100, 300, 1000]), (ax.yaxis, [10, 30, 100, 300, 1000])):
        axis.set_major_locator(FixedLocator(ticks)); axis.set_minor_formatter(NullFormatter())
        axis.set_ticklabels([f"{t:,}" for t in ticks])
    ax.tick_params(labelsize=12, colors=MUTED)
    for s in ("top", "right"): ax.spines[s].set_visible(False)
    for s in ("left", "bottom"): ax.spines[s].set_color(MUTED)
    credit = "Data: Campione & Evans 2012, BMC Biology (CC BY 2.0)"
    if with_silhouettes:
        for sp, (slug, off, h) in SILS.items():
            x, y = by[sp]
            ax.scatter([x], [y], s=110, color=INK, alpha=0.55, lw=0, zorder=3)
            ax.add_artist(AnnotationBbox(silhouette(slug, h), (x, y), xybox=off,
                          boxcoords="offset points", frameon=False, zorder=4,
                          arrowprops=dict(arrowstyle="-", color=MUTED, lw=0.8, shrinkA=0, shrinkB=4)))
        by_lic = [f"{c['taxon']} by {c['contributor']} (CC BY)" for c in CREDITS.values()
                  if "licenses/by/" in c["license"]]
        credit += ". Silhouettes: PhyloPic, public domain" + (", except " + "; ".join(by_lic) if by_lic else "")
    fig.text(0.99, 0.01, credit, fontsize=8, color=MUTED, ha="right")
    fig.tight_layout(rect=(0, 0.02, 1, 1))
    fig.savefig(path, facecolor="white"); plt.close(fig)

draw(REPO / "export/limb_morphospace.png", True)
draw(REPO / "export/limb_morphospace_plain.png", False)
print(len(rows), "species")
