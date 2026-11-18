"""Wing length vs tarsus length for every bird in AVONET: realized vs theoretical morphospace.

Reads data/clean/avonet_birds.csv (Tobias et al. 2022, CC BY 4.0).
Writes export/bird_morphospace.png (PhyloPic silhouettes; fetch them with
scripts/fetch_phylopic_birds.py) and export/bird_morphospace_plain.png.
Kiwis (Apteryx) are dropped: AVONET codes their wing as 0.1 mm.
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
rows = [r for r in csv.DictReader(open(REPO / "data/clean/avonet_birds.csv"))
        if r["wing_length_mm"] and r["tarsus_length_mm"] and float(r["wing_length_mm"]) >= 5]
W = [float(r["tarsus_length_mm"]) for r in rows]   # x: tarsus (leg)
H = [float(r["wing_length_mm"]) for r in rows]     # y: wing
by = {r["species"]: (float(r["tarsus_length_mm"]), float(r["wing_length_mm"])) for r in rows}

# species: (silhouette file, offset of the silhouette from the point in points, height in points)
SILS = {
    "Struthio camelus": ("ostrich", (-45, 50), 50),
    "Dromaius novaehollandiae": ("emu", (-5, -55), 38),
    "Diomedea exulans": ("albatross", (-50, 32), 32),
    "Fregata magnificens": ("frigatebird", (-55, -12), 38),
    "Mellisuga helenae": ("hummingbird", (45, -8), 26),
    "Apus apus": ("swift", (-48, 26), 18),
    "Himantopus himantopus": ("stilt", (38, -58), 36),
    "Phoenicopterus roseus": ("flamingo", (48, -42), 40),
    "Aptenodytes forsteri": ("penguin", (60, -62), 34),
}
SIL_DIR = REPO / "export/base/phylopic"
CREDITS = json.loads((SIL_DIR / "credits.json").read_text())

INK, MUTED, DOT = "#1f2328", "#59636e", "#2b5c8a"
DPI = 150

def silhouette(slug, height_pt):
    im = Image.open(SIL_DIR / f"{slug}.png").convert("LA")
    a = np.asarray(im)[..., 1].astype(float) / 255
    rgba = np.zeros(a.shape + (4,)); rgba[..., :3] = matplotlib.colors.to_rgb(INK); rgba[..., 3] = a
    return OffsetImage(rgba, zoom=height_pt * DPI / 72 / a.shape[0])

def draw(path, with_silhouettes):
    fig, ax = plt.subplots(figsize=(12.8, 7.2), dpi=DPI)
    fig.patch.set_facecolor("white")
    ax.scatter(W, H, s=22, color=DOT, alpha=0.18, lw=0, zorder=2)
    ax.set_xscale("log"); ax.set_yscale("log")
    ax.set_xlim(min(W) / 1.5, max(W) * 1.6); ax.set_ylim(min(H) / 1.5, max(H) * 2.1)
    ax.set_xlabel("Leg (tarsus) length, mm", fontsize=15, color=INK)
    ax.set_ylabel("Wing length, mm", fontsize=15, color=INK)
    from matplotlib.ticker import FixedLocator, NullFormatter
    for axis, ticks in ((ax.xaxis, [3, 10, 30, 100, 300]), (ax.yaxis, [30, 100, 300, 1000])):
        axis.set_major_locator(FixedLocator(ticks)); axis.set_minor_formatter(NullFormatter())
        axis.set_ticklabels([f"{t:,}" for t in ticks])
    ax.tick_params(labelsize=12, colors=MUTED)
    for s in ("top", "right"): ax.spines[s].set_visible(False)
    for s in ("left", "bottom"): ax.spines[s].set_color(MUTED)
    credit = "Data: AVONET, Tobias et al. 2022 (CC BY 4.0)"
    if with_silhouettes:
        for sp, (slug, off, h) in SILS.items():
            x, y = by[sp]
            ax.scatter([x], [y], s=70, color=INK, alpha=0.55, lw=0, zorder=3)
            ax.add_artist(AnnotationBbox(silhouette(slug, h), (x, y), xybox=off,
                          boxcoords="offset points", frameon=False, zorder=4,
                          arrowprops=dict(arrowstyle="-", color=MUTED, lw=0.8, shrinkA=0, shrinkB=4)))
        by_lic = [f"{c['taxon']} by {c['contributor']} (CC BY)" for c in CREDITS.values()
                  if "licenses/by/" in c["license"]]
        credit += ". Silhouettes: PhyloPic, public domain" + (", except " + "; ".join(by_lic) if by_lic else "")
    fig.text(0.99, 0.01, credit, fontsize=8, color=MUTED, ha="right")
    fig.tight_layout(rect=(0, 0.02, 1, 1))
    fig.savefig(path, facecolor="white"); plt.close(fig)

draw(REPO / "export/bird_morphospace.png", True)
draw(REPO / "export/bird_morphospace_plain.png", False)
print(len(rows), "species")
