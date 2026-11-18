"""Wing length vs tarsus length for every bird in AVONET: realized vs theoretical morphospace.

Reads data/clean/avonet_birds.csv (Tobias et al. 2022, CC BY 4.0).
Writes export/bird_morphospace.png (labelled) and export/bird_morphospace_plain.png.
Kiwis (Apteryx) are dropped: AVONET codes their wing as 0.1 mm.
"""
import csv
from pathlib import Path
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt

REPO = Path(__file__).resolve().parent.parent
rows = [r for r in csv.DictReader(open(REPO / "data/clean/avonet_birds.csv"))
        if r["wing_length_mm"] and r["tarsus_length_mm"] and float(r["wing_length_mm"]) >= 5]
W = [float(r["tarsus_length_mm"]) for r in rows]   # x: tarsus (leg)
H = [float(r["wing_length_mm"]) for r in rows]     # y: wing
by = {r["species"]: (float(r["tarsus_length_mm"]), float(r["wing_length_mm"])) for r in rows}

LABELS = {
    "Struthio camelus": ("Ostrich", (6, -14)),
    "Dromaius novaehollandiae": ("Emu", (6, -4)),
    "Diomedea exulans": ("Wandering albatross", (6, 8)),
    "Fregata magnificens": ("Magnificent frigatebird", (-8, 6)),
    "Mellisuga helenae": ("Bee hummingbird", (6, -4)),
    "Apus apus": ("Common swift", (-6, 8)),
    "Himantopus himantopus": ("Black-winged stilt", (6, -10)),
    "Phoenicopterus roseus": ("Greater flamingo", (6, -10)),
    "Aptenodytes forsteri": ("Emperor penguin", (6, -4)),
}

INK, MUTED, DOT, BOX = "#1f2328", "#59636e", "#2b5c8a", "#e9edf2"

def draw(path, labelled):
    fig, ax = plt.subplots(figsize=(12.8, 7.2), dpi=150)
    fig.patch.set_facecolor("white")
    x0, x1, y0, y1 = min(W), max(W), min(H), max(H)
    ax.fill_between([x0, x1], y0, y1, color=BOX, zorder=0, lw=0)
    ax.plot([x0, x1, x1, x0, x0], [y0, y0, y1, y1, y0], color=MUTED, lw=1, ls="--", zorder=1)
    ax.scatter(W, H, s=4, color=DOT, alpha=0.35, lw=0, zorder=2)
    ax.set_xscale("log"); ax.set_yscale("log")
    ax.set_xlim(x0 / 1.4, x1 * 1.4); ax.set_ylim(y0 / 1.4, y1 * 1.4)
    ax.set_xlabel("Leg (tarsus) length, mm", fontsize=15, color=INK)
    ax.set_ylabel("Wing length, mm", fontsize=15, color=INK)
    from matplotlib.ticker import FixedLocator, NullFormatter
    for axis, ticks in ((ax.xaxis, [3, 10, 30, 100, 300]), (ax.yaxis, [30, 100, 300, 1000])):
        axis.set_major_locator(FixedLocator(ticks)); axis.set_minor_formatter(NullFormatter())
        axis.set_ticklabels([f"{t:,}" for t in ticks])
    ax.tick_params(labelsize=12, colors=MUTED)
    for s in ("top", "right"): ax.spines[s].set_visible(False)
    for s in ("left", "bottom"): ax.spines[s].set_color(MUTED)
    if labelled:
        for sp, (name, off) in LABELS.items():
            x, y = by[sp]
            ax.scatter([x], [y], s=36, facecolor="white", edgecolor=INK, lw=1.4, zorder=3)
            ha = "right" if off[0] < 0 else "left"
            ax.annotate(name, (x, y), xytext=off, textcoords="offset points",
                        fontsize=11, color=INK, ha=ha, zorder=4)
        ax.text(x1, y0 * 1.08, "theoretical", fontsize=14, color=MUTED, ha="right", style="italic")
        ax.text(x0 * 1.1, y1 / 1.25, f"realized: {len(rows):,} species", fontsize=14,
                color=DOT, ha="left", style="italic")
    fig.text(0.99, 0.01, "Data: AVONET, Tobias et al. 2022, Ecology Letters (CC BY 4.0)",
             fontsize=9, color=MUTED, ha="right")
    fig.tight_layout(rect=(0, 0.02, 1, 1))
    fig.savefig(path, facecolor="white"); plt.close(fig)

draw(REPO / "export/bird_morphospace.png", True)
draw(REPO / "export/bird_morphospace_plain.png", False)
print(len(rows), "species")
