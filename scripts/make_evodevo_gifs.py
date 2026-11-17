#!/usr/bin/env python3
"""Render the evo-devo lecture GIFs into export/.

    python3 scripts/make_evodevo_gifs.py                 # all of them
    python3 scripts/make_evodevo_gifs.py eve_stripe2 ... # just the named ones
    python3 scripts/make_evodevo_gifs.py --stills DIR    # PNG stills only, for checking layout

Needs matplotlib, numpy and ffmpeg. Every scene is a function draw(ax, s) of
time in seconds on a 16 x 9 canvas; edit the scene, rerun, the GIF is replaced.
All of the diagrams are schematics: positions, curves and counts are stylised
unless a caption says otherwise.
"""
import math
import os
import subprocess
import sys

import numpy as np
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib.colors import to_rgb
from matplotlib.patches import Circle, Ellipse, FancyBboxPatch, Polygon, Rectangle

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "export")
FPS = 12
PX = (1280, 720)

plt.rcParams["font.family"] = ["Inter", "DejaVu Sans"]

# Okabe-Ito, colour-blind safe
INK, GREY, PALE = "#222222", "#8a8a8a", "#cfcfcf"
BLUE, SKY, GREEN = "#0072B2", "#56B4E9", "#009E73"
ORANGE, VERM, PURPLE, YELLOW = "#E69F00", "#D55E00", "#CC79A7", "#F0E442"
HOX = [matplotlib.colormaps["plasma"](v) for v in np.linspace(0.0, 0.86, 13)]


# ----------------------------------------------------------------- helpers
def clip01(x):
    return min(1.0, max(0.0, x))


def lin(s, a, b):
    return clip01((s - a) / (b - a))


def sm(s, a, b):
    x = lin(s, a, b)
    return x * x * (3 - 2 * x)


def win(s, a, b, f=0.4):
    """1 inside [a, b], faded at the edges. a <= 0 means 'on from the start'."""
    up = 1.0 if a <= 0 else sm(s, a, a + f)
    return up * (1 - sm(s, b - f, b))


def mix(c1, c2, t):
    t = clip01(t)
    return tuple(np.array(to_rgb(c1)) * (1 - t) + np.array(to_rgb(c2)) * t)


def box(ax, x, y, w, h, fc, ec="none", a=1.0, r=0.08, lw=1.2, z=2, **k):
    if a <= 0.01 or w <= 0 or h <= 0:
        return None
    r = min(r, w / 2, h / 2)
    p = FancyBboxPatch((x, y), w, h, boxstyle=f"round,pad=0,rounding_size={r}",
                       fc=fc, ec=ec, lw=lw, alpha=clip01(a), zorder=z, **k)
    ax.add_patch(p)
    return p


def txt(ax, x, y, s, size=12, c=INK, a=1.0, ha="center", va="center", w="normal", z=10, **k):
    if a <= 0.01:
        return
    ax.text(x, y, s, fontsize=size, color=c, alpha=clip01(a), ha=ha, va=va,
            fontweight=w, zorder=z, **k)


def line(ax, xs, ys, c=INK, lw=1.5, a=1.0, z=2, **k):
    if a <= 0.01:
        return
    k.setdefault("solid_capstyle", "round")
    ax.plot(xs, ys, color=c, lw=lw, alpha=clip01(a), zorder=z, **k)


def circ(ax, x, y, r, fc, ec="none", a=1.0, lw=1.2, z=3):
    if a <= 0.01:
        return
    ax.add_patch(Circle((x, y), r, fc=fc, ec=ec, lw=lw, alpha=clip01(a), zorder=z))


def squiggle(ax, x, y, length, c, a=1.0, lw=1.6, z=4, phase=0.0):
    """mRNA: a wavy line rising from (x, y)."""
    if a <= 0.01 or length <= 0.01:
        return
    t = np.linspace(0, 1, 30)
    line(ax, x + 0.07 * np.sin(t * length * 14 + phase), y + t * length, c=c, lw=lw, a=a, z=z)


def promoter(ax, x, y, c, a=1.0, d=1, z=4):
    """Bent transcription-start arrow at (x, y), pointing right (d=1) or left (d=-1)."""
    if a <= 0.01:
        return
    line(ax, [x, x, x + 0.26 * d], [y, y + 0.2, y + 0.2], c=c, lw=1.8, a=a, z=z)
    ax.add_patch(Polygon([[x + 0.26 * d, y + 0.29], [x + 0.26 * d, y + 0.11], [x + 0.4 * d, y + 0.2]],
                         closed=True, fc=c, ec="none", alpha=clip01(a), zorder=z))


def title(ax, s):
    txt(ax, 0.5, 8.45, s, size=19, w="bold", ha="left")


def caption(ax, s, items, size=14):
    for a, b, text in items:
        txt(ax, 8, 0.5, text, size=size, a=win(s, a, b), w="medium")


# ------------------------------------------------- 1. Hox gene regulation
def hox_gene_regulation(ax, s):
    title(ax, "Hox gene regulation: the cluster opens in order, 3′ → 5′")
    n = 13
    p = lin(s, 2.5, 10.0)
    f = n * p
    gx = lambda i: 1.55 + i
    yb = 6.35
    line(ax, [1.2, 14.8], [yb + 0.3] * 2, c="#999", lw=3, z=1)
    txt(ax, 0.85, yb + 0.3, "3′", size=14, w="bold")
    txt(ax, 15.2, yb + 0.3, "5′", size=14, w="bold")
    for i in range(n):
        a = clip01(f - i)
        box(ax, gx(i), yb, 0.8, 0.6, mix("#d4d4d4", HOX[i], a), z=3)
        txt(ax, gx(i) + 0.4, yb + 0.3, str(i + 1), size=12, w="bold",
            c="white" if a > 0.5 else "#777", z=6)
        promoter(ax, gx(i) + 0.76, yb + 0.6, HOX[i], a, d=-1)
        squiggle(ax, gx(i) + 0.25, yb + 0.95, 0.45 * a, HOX[i], a, phase=s * 5 + i)
    xf = 1.45 + min(f, n)
    if xf < 14.4:  # still-closed chromatin
        ax.add_patch(Rectangle((xf, yb - 0.14), 14.45 - xf, 0.88, fc="#444", ec="none",
                               alpha=0.3, zorder=5))
        for x in np.arange(xf + 0.25, 14.4, 0.5):
            circ(ax, x, yb - 0.14, 0.11, "#666", a=0.9, z=5)
        if 14.45 - xf > 5:
            txt(ax, (xf + 14.45) / 2, yb + 1.55, "closed chromatin, silenced (Polycomb, H3K27me3)",
                size=11.5, c="#555")
    if xf - 1.45 > 2.2:
        txt(ax, (1.45 + xf) / 2, yb + 1.55, "open, transcribed", size=11.5, c=mix(HOX[4], INK, 0.3))
    txt(ax, 8, yb - 0.5, "Hox1 … Hox13 sit in a row on the chromosome", size=10.5, c=GREY,
        a=1 - sm(s, 2.0, 2.8))

    # the growing embryo: time of activation becomes position
    tip0, span = 2.6, 12.3
    tip = tip0 + span * p
    xb = [tip0 + span * (i + 0.3) / n for i in range(n)] + [99]
    ye, he = 4.3, 0.55
    ax.add_patch(Rectangle((1.55, ye), min(tip, xb[0]) - 1.55, he, fc="#c9c9c9", ec="none", zorder=2))
    for i in range(n):
        if tip > xb[i]:
            x1 = min(tip, xb[i + 1])
            ax.add_patch(Rectangle((xb[i], ye), x1 - xb[i], he, fc=HOX[i], ec="none", zorder=2))
            yr = 3.92 - i * 0.2
            ax.add_patch(Rectangle((xb[i], yr), tip - xb[i], 0.13, fc=HOX[i], ec="none", zorder=2))
            txt(ax, xb[i] - 0.08, yr + 0.06, f"Hox{i + 1}", size=8, ha="right", c="#555",
                a=lin(tip - xb[i], 0, 0.3))
    box(ax, 1.55, ye, tip - 1.55, he, "none", ec=INK, lw=1.6, r=0.2, z=4)
    txt(ax, 1.55, ye + 0.82, "anterior (head)", size=11, ha="left", c="#555")
    txt(ax, max(tip, 5.6), ye + 0.82, "growing posterior end →", size=11, ha="right", c="#555")
    txt(ax, 0.75, ye + 0.27, "embryo", size=11, c="#555")
    caption(ax, s, [
        (0, 2.5, "Start: the whole cluster is compacted and silent"),
        (2.5, 6.5, "Chromatin opens from the 3′ end, so genes switch on one after another"),
        (6.5, 10.2, "The body axis is growing meanwhile, so later genes start farther back"),
        (10.2, 99, "Order on the chromosome = order in time = order along the body"),
    ])


# ------------------------------------- 2. multi-factor regulation (eve stripe 2)
def _eve(x):
    x = np.asarray(x, float)
    bcd = np.exp(-x / 22)
    hb = 1 / (1 + np.exp((x - 47) / 3))
    gt = 1 / (1 + np.exp((x - 30) / 2.2))
    kr = np.exp(-(x - 53) ** 2 / (2 * 6.5 ** 2))
    act = hb * np.minimum(1, bcd / 0.12)
    out = act / (1 + (gt / 0.2) ** 4) / (1 + (kr / 0.2) ** 4)
    return bcd, hb, gt, kr, out


def eve_stripe2(ax, s):
    title(ax, "Many inputs, one enhancer: even-skipped stripe 2 in the fly embryo")
    X0, X1 = 2.6, 13.4
    px = lambda v: X0 + (X1 - X0) * np.asarray(v) / 100
    xs = np.linspace(0, 100, 300)
    bcd, hb, gt, kr, out = _eve(xs)
    y0, hh = 3.55, 1.9
    names = [("Bicoid", bcd, GREEN, 0.3, 4, 0.9), ("Hunchback", hb, BLUE, 1.3, 30, 1.08),
             ("Giant", gt, VERM, 2.3, 14, 0.62), ("Krüppel", kr, ORANGE, 3.3, 62, 0.8)]
    # cursor
    u = lin(s, 4.8, 11.8)
    cur = float(np.interp(u, [0, 0.2, 0.75, 1], [0, 25, 50, 100]))
    back = sm(s, 12.0, 12.8)
    look = cur + (37 - cur) * back          # where the enhancer is "reading"
    shown = cur if s >= 4.8 else -1

    # embryo
    emb = Ellipse((8, 7.0), X1 - X0, 1.5, fc="#f6efe2", ec=INK, lw=1.6, zorder=2)
    ax.add_patch(emb)
    for xv, ov in zip(xs[::2], out[::2]):
        if xv <= shown and ov > 0.02:
            r = Rectangle((px(xv), 6.2), (X1 - X0) / 150 + 0.01, 1.6, fc=INK, ec="none",
                          alpha=float(ov) * 0.9, zorder=3)
            ax.add_patch(r)
            r.set_clip_path(emb)
    txt(ax, X0 - 0.15, 7.0, "anterior", size=11, ha="right", c="#555")
    txt(ax, X1 + 0.15, 7.0, "posterior", size=11, ha="left", c="#555")

    # concentration curves
    line(ax, [X0, X1], [y0, y0], c="#777", lw=1.2)
    txt(ax, X0 - 0.15, y0 + hh / 2, "amount of\nprotein", size=10, ha="right", c="#555")
    for name, v, col, t0, lx, ly in names:
        a = sm(s, t0, t0 + 0.8)
        line(ax, px(xs), y0 + hh * v, c=col, lw=2.6, a=a, z=4)
        txt(ax, px(lx), y0 + hh * ly, name, size=11.5, c=col, w="bold", a=a, ha="left")
    txt(ax, X1 + 0.15, y0 + 1.5, "activators:\nBicoid, Hunchback", size=10, ha="left",
        c=mix(GREEN, BLUE, 0.5), a=sm(s, 1.3, 2.1))
    txt(ax, X1 + 0.15, y0 + 0.6, "repressors:\nGiant, Krüppel", size=10, ha="left",
        c=VERM, a=sm(s, 3.3, 4.1))
    if shown >= 0:
        m = xs <= shown
        ax.fill_between(px(xs[m]), y0, y0 + hh * 0.95 * out[m], color=INK, alpha=0.8, zorder=3, lw=0)
        ca = 1 - 0.0 * back
        line(ax, [px(look)] * 2, [y0 - 0.1, 7.75], c=INK, lw=1.2, a=0.7 * ca, z=6, ls=(0, (4, 3)))
        if s > 11.8:
            txt(ax, px(37), 6.02, "eve stripe 2", size=11.5, w="bold", a=sm(s, 11.8, 12.4))

    # the enhancer, read at the cursor position
    cb, ch, cg, ck, co = [float(v) for v in _eve(look)]
    live = sm(s, 4.3, 4.9)
    conc = {"B": (cb / 0.2, GREEN), "H": (ch, BLUE), "G": (cg, VERM), "K": (ck, ORANGE)}
    ye = 1.75
    line(ax, [2.6, 13.6], [ye + 0.22] * 2, c="#999", lw=3, z=1)
    order = "KBGBKBHGBKBG"
    for j, f in enumerate(order):
        v, col = conc[f]
        occ = clip01(v) * live
        x = 3.0 + j * 0.64
        box(ax, x, ye, 0.5, 0.44, "white", ec=col, lw=1.4, z=3, r=0.06)
        box(ax, x, ye, 0.5, 0.44, col, a=occ, z=4, r=0.06)
        txt(ax, x + 0.25, ye + 0.22, f, size=10, w="bold", c=mix(col, "white", occ), z=5)
        if occ > 0.5:  # bound protein sitting on the site
            circ(ax, x + 0.25, ye + 0.66, 0.2, col, a=(occ - 0.5) * 2, z=4)
    txt(ax, 6.8, ye - 0.33, "stripe 2 enhancer: 12 binding sites for 4 proteins", size=10.5, c="#555")
    on = co * live
    promoter(ax, 11.05, ye + 0.44, mix(GREY, INK, on))
    box(ax, 11.5, ye, 1.9, 0.44, mix("#dddddd", INK, on), z=3)
    txt(ax, 12.45, ye + 0.22, "eve gene", size=10.5, c="white" if on > 0.4 else "#666", w="bold", z=5)
    for k in range(3):
        squiggle(ax, 11.9 + k * 0.5, ye + 0.55, 0.55 * on, INK, on, phase=s * 6 + k)
    if live > 0:
        txt(ax, 14.5, ye + 0.22, "ON" if co > 0.5 else "off", size=15, w="bold",
            c=INK if co > 0.5 else "#aaa", a=live)
    caption(ax, s, [
        (0, 2.3, "Two activators are spread across the front half of the embryo"),
        (2.3, 4.6, "Two repressors each cover a different part of that region"),
        (4.6, 11.9, "Every nucleus reads all four at once through one stretch of DNA"),
        (11.9, 99, "ON only where both activators are present and both repressors absent"),
    ])


# ------------------------------------------------- 3. Hox regionalization
REG = [("cervical", 7, BLUE), ("thoracic", 13, GREEN), ("lumbar", 6, ORANGE),
       ("sacral", 4, VERM), ("caudal", 6, PURPLE)]
NV = sum(r[1] for r in REG)
VX0, VP, VW = 1.25, 0.385, 0.3
VEND = VX0 + (NV - 1) * VP + VW
REGION_OF = [k for k, r in enumerate(REG) for _ in range(r[1])]
START = np.cumsum([0] + [r[1] for r in REG])


def vx(i):
    return VX0 + i * VP


def column(ax, y, cols, ribs, pelv, alphas=None):
    ax.add_patch(Ellipse((0.68, y + 0.38), 0.85, 0.8, fc="#d9d9d9", ec="none", zorder=2))
    txt(ax, 0.68, y + 0.38, "head", size=8, c="#666")
    for i in range(NV):
        a = 1 if alphas is None else alphas[i]
        if ribs[i] > 0.02:
            xc = vx(i) + VW / 2
            t = np.linspace(0, 1, 12)
            line(ax, xc + 0.16 * ribs[i] * t ** 2, y - 0.75 * ribs[i] * t, c=cols[i], lw=2.6, a=a, z=2)
        box(ax, vx(i) - 0.045, y + 0.6, VP + 0.005, 0.15, cols[i], a=pelv[i] * a, r=0.02, z=2)
        box(ax, vx(i), y, VW, 0.6, cols[i], a=a, r=0.06, z=3)


def region_labels(ax, y, a=1.0, counts=True):
    for k, (name, nn, col) in enumerate(REG):
        x0, x1 = vx(START[k]), vx(START[k + 1] - 1) + VW
        line(ax, [x0, x1], [y, y], c=col, lw=2, a=a)
        txt(ax, (x0 + x1) / 2, y + 0.3, f"{name} ({nn})" if counts else name, size=11.5, c=col,
            w="bold", a=a)


def hox_regionalization(ax, s):
    title(ax, "Hox regionalization: nested domains give each segment an address")
    rows = [("Hox3", 0, BLUE), ("Hox5", 2, BLUE), ("Hox6", 7, GREEN), ("Hox9", 17, GREEN),
            ("Hox10", 20, ORANGE), ("Hox11", 26, VERM), ("Hox13", 30, PURPLE)]
    yc = 5.6
    cols = ["#c4c4c4"] * NV
    for k, (name, b, col) in enumerate(rows):
        pr = lin(s, 1.8 + k * 0.95, 2.7 + k * 0.95)
        front = vx(b) + (VEND - vx(b)) * pr
        yr = 4.3 - k * 0.42
        if pr > 0:
            box(ax, vx(b), yr, front - vx(b), 0.26, col, r=0.05, a=0.9)
            txt(ax, vx(b) - 0.1, yr + 0.13, name, size=10.5, ha="right", c=col, w="bold",
                a=lin(pr, 0, 0.15))
            for i in range(b, NV):
                cols[i] = mix(cols[i], col, (front - vx(i)) / VP)
    morph = sm(s, 9.0, 10.4)
    ribs = [morph if REGION_OF[i] == 1 else 0 for i in range(NV)]
    pelv = [morph if REGION_OF[i] == 3 else 0 for i in range(NV)]
    alphas = [sm(s, -0.3 + i * 0.03, 0.1 + i * 0.03) if s < 2 else 1 for i in range(NV)]
    column(ax, yc, cols, ribs, pelv, alphas)
    region_labels(ax, yc + 0.95, a=sm(s, 9.4, 10.4))
    txt(ax, 15.2, 1.1, "mouse; anterior limits approximate", size=9, c=GREY, ha="right")
    caption(ax, s, [
        (0, 1.8, "Early embryo: a row of segments that all look the same"),
        (1.8, 8.6, "Each Hox gene is expressed from its own anterior limit back to the tail"),
        (8.6, 11.2, "The most posterior Hox gene a segment expresses sets what it becomes"),
        (11.2, 99, "The combination of Hox genes (the “Hox code”) marks each region"),
    ])


# --------------------------------------------- 4. Hox specification (tests)
def hox_specification(ax, s):
    title(ax, "Hox specification: change the code and the vertebra changes identity")
    yc = 5.7
    ko10 = win(s, 3.2, 7.4, 0.9)
    ko11 = win(s, 7.8, 11.8, 0.9)
    shift = sm(s, 12.6, 14.6)
    b6 = 7 + 7 * shift
    cols, ribs, pelv = [], [], []
    for i in range(NV):
        k = REGION_OF[i]
        col, rib, pv = REG[k][2], float(k == 1), float(k == 3)
        if k == 1:
            a = clip01(b6 - i)
            col, rib = mix(GREEN, BLUE, a), 1 - a
        if k == 2:
            col, rib = mix(ORANGE, GREEN, ko10), ko10
        if k == 3:
            col = mix(mix(VERM, GREEN, ko10), ORANGE, ko11)
            rib, pv = ko10, 1 - max(ko10, ko11)
        cols.append(col), ribs.append(rib), pelv.append(pv)
    column(ax, yc, cols, ribs, pelv)
    region_labels(ax, yc + 0.95, a=1 - sm(s, 12.2, 12.8), counts=False)
    # neck bracket for the boundary-shift act
    na = sm(s, 12.4, 13.0)
    x1 = vx(b6 - 1) + VW
    line(ax, [vx(0), x1], [yc + 0.95] * 2, c=BLUE, lw=2, a=na)
    txt(ax, vx(0), yc + 1.27, f"neck: {int(round(b6))} vertebrae", size=12.5, c=BLUE, w="bold", a=na, ha="left")

    for name, b, col, yr, ko in [("Hox6", b6, GREEN, 4.15, 0), ("Hox10", 20, ORANGE, 3.55, ko10),
                                 ("Hox11", 26, VERM, 2.95, ko11)]:
        box(ax, vx(b), yr, VEND - vx(b), 0.28, col, a=0.9 * (1 - ko), r=0.05)
        box(ax, vx(b), yr, VEND - vx(b), 0.28, "none", ec=col, lw=1.3, a=ko, r=0.05, ls=(0, (4, 3)))
        txt(ax, vx(b) - 0.1, yr + 0.14, name, size=11, ha="right", c=col, w="bold")
        txt(ax, (vx(b) + VEND) / 2, yr + 0.14, f"all {name} genes deleted", size=10.5, c=col, a=ko, w="bold")
    if shift > 0.02:
        ax.annotate("", xy=(vx(b6) - 0.02, 3.82), xytext=(vx(7), 3.82), zorder=6,
                    arrowprops=dict(arrowstyle="-|>", color=INK, lw=1.6, alpha=clip01(shift * 3)))
    txt(ax, 8, 2.0, "Experiment 1: remove Hox10", size=14, w="bold", a=win(s, 3.2, 7.4), c=ORANGE)
    txt(ax, 8, 2.0, "Experiment 2: remove Hox11", size=14, w="bold", a=win(s, 7.8, 11.8), c=VERM)
    txt(ax, 8, 2.0, "Evolution: move where Hox6 begins", size=14, w="bold", a=sm(s, 12.4, 13.0), c=GREEN)
    txt(ax, 15.2, 1.1, "Wellik & Capecchi 2003; Burke et al. 1995", size=9, c=GREY, ha="right")
    caption(ax, s, [
        (0, 3.2, "Normal mouse: every region of the spine has its own Hox code"),
        (3.2, 7.6, "No Hox10: lumbar and sacral vertebrae grow ribs, like thoracic ones"),
        (7.6, 12.2, "No Hox11: sacral vertebrae become lumbar-like"),
        (12.2, 99, "The Hox6 limit marks neck → thorax: 7 neck vertebrae in mouse, 14 in chicken"),
    ])


# ------------------------------------------------- 5. morphogen cascade
_rng = np.random.default_rng(7)
_MX = 1.9 + _rng.exponential(3.0, 170)
_MX = _MX[_MX < 15.0]
_MY = 7.18 + 0.5 * _rng.random(len(_MX))
_MP = _rng.random(len(_MX)) * 6.28


def morphogen_cascade(ax, s):
    title(ax, "Morphogen → receptor → regulator → a set of genes changes")
    MC, AC = PURPLE, GREEN
    # tissue row
    yc, hc, pitch, wc = 5.95, 1.0, 1.15, 1.07
    cx = lambda i: 1.0 + i * pitch
    fate = sm(s, 9.8, 11.2)
    groups = [(1, 3, BLUE, "A B C on"), (4, 6, SKY, "B C on"), (7, 9, YELLOW, "C on"), (10, 11, "#e2e2e2", "D on")]
    for i in range(12):
        fc = "#f1f1f1"
        for a, b, col, _ in groups:
            if a <= i <= b:
                fc = mix("#f1f1f1", mix(col, "white", 0.35), fate)
        if i == 0:
            fc = MC
        box(ax, cx(i), yc, wc, hc, fc, ec="#999", lw=1.2, r=0.14, z=2)
        circ(ax, cx(i) + wc / 2, yc + 0.36, 0.2, "white", ec="#aaa", a=0.9, z=3)
    txt(ax, cx(0) + wc / 2, yc + 0.75, "source", size=9.5, c="white", w="bold")
    for a, b, col, lab in groups:
        txt(ax, (cx(a) + cx(b) + wc) / 2, yc + 0.78, lab, size=11, w="bold", a=fate)
    txt(ax, (cx(1) + cx(3) + wc) / 2, yc - 0.25, "high dose", size=10, c="#555", a=fate)
    txt(ax, (cx(4) + cx(6) + wc) / 2, yc - 0.25, "medium", size=10, c="#555", a=fate)
    txt(ax, (cx(7) + cx(9) + wc) / 2, yc - 0.25, "low", size=10, c="#555", a=fate)
    txt(ax, (cx(10) + cx(11) + wc) / 2, yc - 0.25, "none", size=10, c="#555", a=fate)
    # morphogen dots spreading from the source
    al = np.clip((s - (0.4 + 3.2 * (_MX - 1.9) / 13)) / 0.5, 0, 1)
    rgba = np.zeros((len(_MX), 4))
    rgba[:, :3] = to_rgb(MC)
    rgba[:, 3] = al
    ax.scatter(_MX + 0.05 * np.sin(s * 3 + _MP), _MY + 0.05 * np.cos(s * 2.3 + _MP), s=22, c=rgba,
               zorder=4, linewidths=0)
    txt(ax, 15.3, 7.95, "morphogen spreads, thinning with distance", size=10.5, c=MC, ha="right",
        a=sm(s, 1.5, 2.5))

    # zoomed cell
    za = sm(s, 2.8, 3.6)
    if za > 0:
        zx, zy, zw, zh = 1.6, 1.05, 8.6, 3.45
        top = zy + zh
        for xa, xb in [(cx(2), zx), (cx(2) + wc, zx + zw)]:
            line(ax, [xa, xb], [yc, top], c="#aaa", lw=1, a=za * 0.8, z=1, ls=(0, (3, 3)))
        box(ax, cx(2), yc, wc, hc, "none", ec=INK, lw=2, a=za, r=0.14, z=5)
        box(ax, zx, zy, zw, zh, "#fbf7ee", ec=INK, lw=1.8, a=za, r=0.3, z=2)
        ax.add_patch(Ellipse((6.9, 2.45), 5.6, 2.1, fc="#ece4f3", ec="#a48fba", lw=1.4, alpha=za, zorder=3))
        txt(ax, 9.25, 3.2, "nucleus", size=9.5, c="#806a99", a=za)
        # receptor
        rx = 3.2
        bound = sm(s, 4.9, 5.3)
        rc = mix("#777", MC, bound)
        line(ax, [rx, rx], [top - 0.35, top + 0.18], c=rc, lw=5, a=za, z=6)
        line(ax, [rx - 0.2, rx, rx + 0.2], [top + 0.42, top + 0.18, top + 0.42], c=rc, lw=5, a=za, z=6)
        txt(ax, rx + 0.4, top - 0.25, "receptor", size=10, ha="left", c="#555", a=za)
        d = sm(s, 4.0, 4.9)
        if s > 3.8:
            circ(ax, rx + 0.5 * (1 - d), top + 0.95 - 0.55 * d, 0.14, MC, a=sm(s, 3.8, 4.1), z=7)
        # regulator
        act = sm(s, 5.5, 6.3)
        mv = sm(s, 6.6, 8.0)
        tx, ty = 3.25 + (5.0 - 3.25) * mv, 3.55 + (2.62 - 3.55) * mv
        if act > 0 and mv < 0.05:
            for k in range(3):
                line(ax, [rx, rx + 0.02], [top - 0.4 - 0.12 * k, top - 0.47 - 0.12 * k], c=AC, lw=2,
                     a=act * (1 - mv), z=6)
        circ(ax, tx, ty, 0.3, mix("#bdbdbd", AC, act), ec=mix("#888", INK, act), a=za, z=8)
        txt(ax, tx, ty, "TF", size=9.5, w="bold", c="white", a=za, z=9)
        txt(ax, 3.75, 3.55, "regulator (inactive)", size=10, ha="left", c="#777", a=za * (1 - act))
        txt(ax, 3.75, 3.55, "regulator switched on", size=10, ha="left", c=AC, w="bold",
            a=act * (1 - sm(s, 6.6, 7.2)))
        # DNA + target genes
        ge = sm(s, 8.2, 9.4)
        yd = 2.05
        line(ax, [4.5, 9.4], [yd + 0.2] * 2, c="#999", lw=3, a=za, z=4)
        for k, g in enumerate("ABCD"):
            x = 5.45 + k * 0.98
            level = ge if g != "D" else 1 - ge
            col = AC if g != "D" else "#555"
            box(ax, x, yd, 0.72, 0.4, mix("#d6d6d6", col, level), a=za, z=5)
            txt(ax, x + 0.36, yd + 0.2, g, size=10.5, w="bold", c="white", a=za, z=6)
            squiggle(ax, x + 0.36, yd + 0.48, 0.42 * level, col, level * za, phase=s * 6 + k, z=7)
            if ge > 0.3:
                txt(ax, x + 0.36, yd - 0.3, "on" if g != "D" else "off", size=10, w="bold",
                    c=col if g != "D" else VERM, a=(ge - 0.3) / 0.7)
        # steps list
        steps = [(4.0, "1  morphogen arrives", MC), (4.9, "2  receptor binds it", MC),
                 (5.5, "3  regulator activated,\n    enters nucleus", AC), (8.2, "4  target genes change:\n    A, B, C on; D off", INK)]
        for k, (t0, lab, col) in enumerate(steps):
            on = sm(s, t0, t0 + 0.5)
            txt(ax, 10.75, 4.15 - k * 0.85, lab, size=11.5, ha="left", va="top",
                c=mix("#c4c4c4", col, on), w="bold" if on > 0.5 else "normal", a=za, linespacing=1.25)
    caption(ax, s, [
        (0, 3.2, "One group of cells releases a signal molecule"),
        (3.2, 9.7, "Inside a receiving cell, the signal is relayed to the genes"),
        (9.7, 99, "Same signal, different dose → different gene sets → different cell fates"),
    ])


# ------------------------------------ 6. placenta: transposons as enhancers
def placenta_transposon_enhancers(ax, s):
    title(ax, "Transposons as ready-made switches: wiring the pregnancy gene network")
    TE, TFc, ON = ORANGE, PURPLE, GREEN
    ys = [6.55, 5.0, 3.45]
    genes = [(0, 3.6), (0, 8.2), (0, 12.6), (1, 2.4), (1, 6.8), (1, 11.0), (2, 4.6), (2, 9.2), (2, 13.4)]
    copies = [(0, 7.25, 1), (1, 5.85, 4), (2, 3.65, 6), (2, 12.45, 8), (0, 10.9, None), (1, 13.6, None)]
    ox, oy = 1.7, ys[0]
    bind = [sm(s, 7.4 + 0.35 * k, 8.2 + 0.35 * k) for k in range(len(copies))]
    onl = {gi: sm(s, 8.6 + 0.35 * k, 9.6 + 0.35 * k) for k, (_, _, gi) in enumerate(copies) if gi is not None}
    decay = sm(s, 9.5, 11.0)

    def te(x, y, a=1.0, fade=0.0, z=4):
        box(ax, x, y - 0.2, 0.7, 0.4, mix(TE, "#dddddd", fade), ec=mix("#9a6a00", "#bbb", fade), a=a, r=0.05, z=z)
        for d in (0.18, 0.35, 0.52):
            line(ax, [x + d] * 2, [y - 0.13, y + 0.13], c=mix(INK, "#bbb", fade), lw=2, a=a, z=z + 1)

    for y in ys:
        line(ax, [0.8, 15.2], [y, y], c="#aaa", lw=3, z=1)
    for gi, (r, x) in enumerate(genes):
        lv = onl.get(gi, 0)
        box(ax, x, ys[r] - 0.22, 1.25, 0.44, mix("#d8d8d8", ON, lv), z=3)
        txt(ax, x + 0.62, ys[r], "gene", size=9.5, c=mix("#888", "white", lv), w="bold", z=5)
        promoter(ax, x + 0.04, ys[r] + 0.22, mix("#b5b5b5", ON, lv))
        for k in range(2):
            squiggle(ax, x + 0.55 + 0.4 * k, ys[r] + 0.5, 0.5 * lv, ON, lv, phase=s * 6 + k + gi)
    te(ox, oy)
    txt(ax, ox + 0.35, oy - 0.5, "transposon", size=10.5, c="#9a6a00", w="bold")
    txt(ax, ox + 0.35, oy + 0.75, "binding sites for a\ntranscription factor", size=9.5, c="#555",
        a=win(s, 0, 7.0))
    line(ax, [ox + 0.35] * 2, [oy + 0.22, oy + 0.45], c="#777", lw=1, a=win(s, 0, 7.0))
    for k, (r, x, gi) in enumerate(copies):
        t0 = 2.6 + k * 0.7
        pr = sm(s, t0, t0 + 1.1)
        if pr <= 0:
            continue
        if pr < 1:
            xx = ox + (x - ox) * pr
            yy = oy + (ys[r] - oy) * pr + 1.0 * math.sin(math.pi * pr)
            te(xx, yy, a=0.75, z=8)
        else:
            te(x, ys[r], fade=decay if gi is None else 0)
            if gi is not None and bind[k] > 0:
                yy = ys[r] + 0.42 + 1.2 * (1 - bind[k])
                ax.add_patch(Ellipse((x + 0.35, yy), 0.62, 0.36, fc=TFc, ec="#8a4a6f", lw=1.2,
                                     alpha=clip01(bind[k] * 1.5), zorder=7))
                txt(ax, x + 0.35, yy, "TF", size=8.5, c="white", w="bold", a=bind[k], z=8)
                gx_ = genes[gi][1]
                if onl[gi] > 0:
                    t = np.linspace(0, 1, 20)
                    line(ax, x + 0.7 + (gx_ - x - 0.7) * t, ys[r] - 0.26 - 0.3 * np.sin(math.pi * t),
                         c=ON, lw=1.6, a=onl[gi], z=2)
    txt(ax, 11.25, ys[0] - 0.5, "far from any gene:\nno effect, decays", size=9.5, c=GREY, a=decay)
    # the signal
    sa = sm(s, 6.6, 7.4)
    ax.add_patch(Ellipse((11.4, 7.68), 0.62, 0.36, fc=TFc, ec="#8a4a6f", lw=1.2, alpha=sa, zorder=7))
    txt(ax, 11.4, 7.68, "TF", size=8.5, c="white", w="bold", a=sa)
    txt(ax, 11.85, 7.68, "switched on by progesterone\nin the uterus during pregnancy", size=10,
        ha="left", c="#8a4a6f", a=sa)
    fa = sm(s, 11.4, 12.4)
    txt(ax, 8, 2.05, "MER20 transposons: progesterone-responsive genes in human decidual cells (Lynch et al. 2011)",
        size=10.5, c="#444", a=fa)
    txt(ax, 8, 1.55, "THE1B element: switches on CRH in the primate placenta, which sets gestation length (Dunn-Fletcher et al. 2018)",
        size=10.5, c="#444", a=fa)
    caption(ax, s, [
        (0, 2.6, "A transposon carries its own transcription-factor binding sites"),
        (2.6, 7.0, "It copies itself around the genome, landing beside unrelated genes"),
        (7.0, 11.3, "One pregnancy signal now reaches every copy at once"),
        (11.3, 99, "Result: scattered genes become one co-regulated network"),
    ])


# ------------------------------------ 7. placenta: syncytin, a captured virus
def _virus(ax, x, y, a, r=0.5):
    if a <= 0.01:
        return
    for k in range(10):
        th = k * 2 * math.pi / 10
        line(ax, [x + r * math.cos(th), x + (r + 0.2) * math.cos(th)],
             [y + r * math.sin(th), y + (r + 0.2) * math.sin(th)], c=VERM, lw=2.2, a=a, z=7)
        circ(ax, x + (r + 0.24) * math.cos(th), y + (r + 0.24) * math.sin(th), 0.07, VERM, a=a, z=7)
    circ(ax, x, y, r, "#fff6ef", ec="#8a5a3a", lw=1.8, a=a, z=6)
    box(ax, x - 0.25, y - 0.09, 0.5, 0.18, BLUE, a=a, r=0.04, z=7)


def placenta_syncytin(ax, s):
    title(ax, "Syncytin: a captured viral gene builds the placenta’s fused layer")
    A = win(s, 0, 5.3, 0.5)
    B = win(s, 5.1, 8.9, 0.5)
    C = sm(s, 8.7, 9.4)
    # ---- A: infection of a germ-line cell
    if A > 0:
        box(ax, 5.6, 1.5, 7.4, 5.4, "#fdf5e6", ec="#c9a66b", lw=2, a=A, r=0.8, z=2)
        ax.add_patch(Ellipse((9.6, 4.0), 4.2, 2.6, fc="#ece4f3", ec="#a48fba", lw=1.4, alpha=A, zorder=3))
        txt(ax, 9.3, 6.4, "germ-line cell (egg or sperm lineage)", size=10.5, c="#8a6a35", a=A)
        txt(ax, 9.6, 4.9, "host DNA", size=9.5, c="#806a99", a=A)
        line(ax, [7.9, 11.3], [4.0, 4.0], c="#888", lw=3, a=A, z=4)
        mv = sm(s, 0.7, 2.4)
        fuse = sm(s, 2.4, 3.2)
        vxp, vyp = 2.3 + (4.9 - 2.3) * mv + 0.5 * fuse, 5.9 + (4.3 - 5.9) * mv
        _virus(ax, vxp, vyp, A * (1 - fuse))
        txt(ax, 2.3, 4.85, "retrovirus", size=11, w="bold", c="#8a5a3a", a=A * (1 - sm(s, 0.7, 1.3)))
        ea = A * (1 - fuse)
        txt(ax, 2.9, 2.6, "Env protein:\nfuses virus membrane\nto cell membrane", size=10.5, c=VERM, a=ea, w="bold")
        line(ax, [2.9, vxp - 0.1], [3.25, vyp - 0.75], c=VERM, lw=1, a=ea * 0.8)
        go = sm(s, 2.7, 3.9)
        ins = sm(s, 3.9, 4.5)
        if fuse > 0:
            box(ax, 5.6 + (9.35 - 5.6) * go, 4.21 + (3.9 - 4.21) * go, 0.5 + 0.4 * ins, 0.18 + 0.02 * ins,
                BLUE, a=A * fuse, r=0.04, z=8)
        txt(ax, 9.6, 3.4, "viral genome inserted:\nnow inherited by every descendant", size=10, c=BLUE,
            a=A * ins, w="bold")
    # ---- B: the endogenous retrovirus decays, env survives
    if B > 0:
        yb = 4.4
        line(ax, [1.2, 14.8], [yb + 0.35] * 2, c="#999", lw=3, a=B, z=1)
        dec = sm(s, 6.0, 7.5)
        keep = sm(s, 7.0, 7.8)
        segs = [("LTR", 3.0, 0.8, "#9aa7b3", 0), ("gag", 3.9, 2.4, SKY, 1), ("pol", 6.4, 3.5, BLUE, 1),
                ("env", 10.0, 2.2, VERM, 0), ("LTR", 12.3, 0.8, "#9aa7b3", 0)]
        for name, x, w_, col, rot in segs:
            box(ax, x, yb, w_, 0.7, mix(col, "#d2d2d2", dec * rot), a=B, r=0.06, z=3,
                ec=INK if name == "env" else "none", lw=2.2 * keep)
            txt(ax, x + w_ / 2, yb + 0.35, name, size=12, w="bold", c="white", a=B, z=5, style="italic")
            if rot:
                for k in range(3):
                    txt(ax, x + w_ * (0.2 + 0.3 * k), yb + 0.36 + 0.12 * (k % 2), "×", size=20, c="#b3261e",
                        a=B * sm(s, 6.0 + 0.3 * k, 6.5 + 0.3 * k), w="bold", z=6)
        txt(ax, 8, yb + 1.45, "endogenous retrovirus, sitting in the primate genome", size=12, c="#555", a=B)
        txt(ax, 6.2, yb - 0.45, "broken by mutations", size=11, c="#b3261e", a=B * dec)
        txt(ax, 11.1, yb - 0.45, "kept intact by selection", size=11, c=VERM, w="bold", a=B * keep)
        txt(ax, 8, 2.55, "Human syncytin-1 (ERVW-1) and syncytin-2 (ERVFRD-1) are viral env genes",
            size=12, a=B * keep, w="medium")
        txt(ax, 8, 2.0, "captured roughly 25 and 40+ million years ago", size=10.5, c="#666", a=B * keep)
    # ---- C: the placental interface
    if C > 0:
        x0, wc_, n = 3.6, 1.45, 8
        x1 = x0 + n * wc_
        yt, ym, yb_, yf = 5.3, 4.1, 2.9, 1.15
        ax.add_patch(Rectangle((x0, yt), x1 - x0, 2.4, fc="#fbe1dc", ec="none", alpha=C, zorder=1))
        rng = np.random.default_rng(3)
        for k in range(26):
            rx = x0 + 0.2 + ((rng.random() * (x1 - x0) + s * 0.35) % (x1 - x0 - 0.4))
            ax.add_patch(Ellipse((rx, yt + 0.3 + rng.random() * 1.8), 0.3, 0.17, angle=rng.random() * 180,
                                 fc="#d9544a", ec="none", alpha=0.75 * C, zorder=2))
        ax.add_patch(Rectangle((x0, yf), x1 - x0, yb_ - yf, fc="#eaf2fb", ec="none", alpha=C, zorder=1))
        box(ax, x0 + 0.6, yf + 0.55, x1 - x0 - 1.2, 0.5, "#e8a39c", ec="#b3564d", lw=1.2, a=C, r=0.25, z=2)
        txt(ax, (x0 + x1) / 2, yf + 0.8, "fetal capillary", size=9.5, c="#7a2e27", a=C)
        spike = sm(s, 9.8, 10.8)
        for i in range(n):
            xc = x0 + i * wc_
            box(ax, xc, yb_, wc_, ym - yb_, "#f3e3ee", ec="#9b6d8c", lw=1.5, a=C, r=0.12, z=3)
            circ(ax, xc + wc_ / 2, yb_ + 0.55, 0.24, "#b48aa6", a=C, z=4)
            circ(ax, xc + wc_ / 2 + 0.05 * math.sin(i * 1.7), ym + 0.5, 0.24, "#8f5f80", a=C, z=5)
        fz = [sm(s, 11.0 + 0.45 * abs(i - n / 2), 12.2 + 0.45 * abs(i - n / 2)) for i in range(n + 1)]
        allf = min(fz)
        ax.add_patch(Rectangle((x0, ym), x1 - x0, yt - ym, fc=mix("#f3e3ee", "#e3bcd3", allf), ec="none",
                               alpha=C, zorder=3))
        line(ax, [x0, x1, x1, x0, x0], [ym, ym, yt, yt, ym], c="#7d4f70", lw=1.8, a=C, z=6)
        for i in range(1, n):
            xb = x0 + i * wc_
            aa = C * (1 - fz[i])
            line(ax, [xb, xb], [ym, yt], c="#7d4f70", lw=1.8, a=aa, z=6)
            for yy in np.linspace(ym + 0.2, yt - 0.2, 4):
                line(ax, [xb - 0.13, xb + 0.13], [yy, yy], c=VERM, lw=2.4, a=aa * spike, z=7)
        lx = x0 - 0.2
        txt(ax, lx, 6.5, "maternal blood", size=11, ha="right", c="#a33a31", a=C, w="bold")
        txt(ax, lx, (ym + yt) / 2, "trophoblast cells\nmaking syncytin", size=11, ha="right", c=VERM,
            a=C * (1 - sm(s, 12.6, 13.4)), w="bold")
        txt(ax, lx, (ym + yt) / 2, "syncytiotrophoblast\none fused layer,\nmany nuclei", size=11, ha="right",
            c="#7d4f70", a=C * sm(s, 13.2, 14.0), w="bold")
        txt(ax, lx, (yb_ + ym) / 2, "cytotrophoblast\n(progenitor cells)", size=11, ha="right", c="#9b6d8c", a=C)
        txt(ax, lx, 2.0, "fetal side", size=11, ha="right", c="#3d6fa3", a=C, w="bold")
        txt(ax, x1 - 0.15, 7.42, "mice, carnivores and ruminants each captured a different virus for this job",
            size=10, ha="right", c="#7a2e27", a=C * sm(s, 14.6, 15.4), z=9)
    caption(ax, s, [
        (0, 2.6, "Tens of millions of years ago, a retrovirus infects a primate germ-line cell"),
        (2.6, 5.2, "Its Env protein fuses virus to cell; the viral genome joins the host’s DNA"),
        (5.2, 8.8, "Most of the viral DNA decays over generations, but env is preserved"),
        (8.8, 13.2, "In the placenta, the same fusion protein now merges trophoblast cells"),
        (13.2, 99, "A viral gene, co-opted to build the maternal–fetal exchange surface"),
    ])


# ------------------------------------ 8. human placental development overview
_r2 = np.random.default_rng(11)
_SC = [(0.6 + 14.8 * _r2.random(), 4.85 + 2.6 * _r2.random(), 180 * _r2.random()) for _ in range(95)]


def placenta_development(ax, s):
    title(ax, "Human implantation: a placenta built from co-opted genomic parasites")
    y0, y1 = 4.6, 7.7
    DEC = "#E3A93C"
    stroma = Rectangle((0.4, y0), 15.2, y1 - y0, fc="#fbeeee", ec="none", zorder=1)
    ax.add_patch(stroma)
    inv = sm(s, 5.3, 10.0)
    cy = 1.9 + (3.72 - 1.9) * sm(s, 0.3, 3.3) + (5.55 - 3.72) * sm(s, 5.0, 9.0)
    cxm = 8.0
    for x, y, ang in _SC:
        dist = math.hypot(x - cxm, y - 5.6)
        d = sm(s, 6.0 + 0.55 * dist, 8.0 + 0.55 * dist)
        ax.add_patch(Ellipse((x, y), 0.36 - 0.04 * d, 0.13 + 0.15 * d, angle=ang, fc=mix("#cdb9b9", DEC, d),
                             ec="none", zorder=2))
    gap = 1.0 * sm(s, 4.4, 6.0)
    for x in np.arange(0.4, 15.6, 0.3):
        if abs(x + 0.15 - cxm) > gap or gap == 0:
            box(ax, x, y0 - 0.2, 0.28, 0.24, "#e9b8b8", ec="#c48f8f", lw=0.8, r=0.04, z=3)
    txt(ax, 0.6, 7.42, "uterine lining (endometrium)", size=10.5, ha="left", c="#8f5a5a", w="bold",
        bbox=dict(fc="#fbeeee", ec="none", pad=2.5))
    txt(ax, 0.6, 4.05, "uterine cavity", size=10.5, ha="left", c="#999", a=1 - sm(s, 11.5, 12.3))
    # syncytiotrophoblast: grows out from the embedded blastocyst
    SY = "#7d4f70"
    if inv > 0:
        th = np.linspace(0, 2 * math.pi, 140)
        R = (0.35 + 1.5 * inv) * (1 + 0.13 * np.sin(3 * th + 1) + 0.09 * np.sin(5 * th + 2) + 0.05 * np.sin(9 * th))
        by = cy + 0.25
        blob = Polygon(np.c_[cxm + 1.25 * R * np.cos(th), by + R * np.sin(th)], closed=True, fc="#c9a3bd",
                       ec=SY, lw=1.6, zorder=4)
        ax.add_patch(blob)
        blob.set_clip_path(stroma)
        for k in range(12):
            a_ = 0.35 + k * 0.52
            rr = (1.0 + 0.25 * (k % 3)) * inv * 1.05
            px_, py_ = cxm + 1.25 * rr * math.cos(a_), by + rr * math.sin(a_)
            if py_ > y0 + 0.15:
                circ(ax, px_, py_, 0.1, SY, a=inv, z=5)
        lac = sm(s, 9.0, 11.0)
        for k, a_ in enumerate([0.5, 1.25, 1.95, 2.7]):
            lx_, ly_ = cxm + 1.25 * 1.32 * inv * math.cos(a_), by + 1.32 * inv * math.sin(a_)
            circ(ax, lx_, ly_, 0.2, "#d9544a", ec="#a33a31", a=lac, z=6)
            if k in (1, 2):
                t = np.linspace(0, 1, 30)
                line(ax, lx_ + (0.5 * (k - 1.5)) * t + 0.08 * np.sin(t * 9), ly_ + (y1 - ly_) * t, c="#d9544a",
                     lw=3.5, a=sm(s, 9.8, 11.4) * 0.9, z=3)
    # blastocyst
    circ(ax, cxm, cy, 0.78, "#fdfcff", ec="#9b6d8c", lw=5, z=7)
    ax.add_patch(Ellipse((cxm, cy + 0.42), 0.8, 0.45, fc=BLUE, ec="none", zorder=8))
    e = win(s, 0, 5.0)
    txt(ax, cxm + 1.05, cy + 0.42, "inner cell mass → embryo", size=10, ha="left", c=BLUE, a=e, w="bold")
    txt(ax, cxm + 1.05, cy - 0.3, "trophoblast → placenta", size=10, ha="left", c="#9b6d8c", a=e, w="bold")
    txt(ax, cxm - 1.05, cy, "blastocyst", size=11, ha="right", c="#555", a=e, w="bold")
    # closing labels
    fa = sm(s, 11.8, 12.8)
    box(ax, 0.7, 1.45, 6.0, 1.95, "#fff8e8", ec=DEC, lw=1.6, a=fa, r=0.15)
    txt(ax, 3.7, 3.0, "DECIDUAL CELLS (mother)", size=11.5, w="bold", c="#9a6a00", a=fa)
    txt(ax, 3.7, 2.15, "pregnancy genes switched on through\nenhancers that began as transposons", size=11, a=fa)
    line(ax, [3.7, 4.6], [3.4, 5.3], c=DEC, lw=1.4, a=fa, z=9)
    box(ax, 9.3, 1.45, 6.0, 1.95, "#f6ecf3", ec=SY, lw=1.6, a=fa, r=0.15)
    txt(ax, 12.3, 3.0, "SYNCYTIOTROPHOBLAST (fetus)", size=11.5, w="bold", c=SY, a=fa)
    txt(ax, 12.3, 2.15, "cells fused into one layer by syncytin,\na captured retroviral envelope gene", size=11, a=fa)
    line(ax, [11.6, 9.75], [3.4, 5.0], c=SY, lw=1.4, a=fa, z=9)
    txt(ax, 10.2, 7.42, "← maternal blood", size=10, c="#a33a31", a=sm(s, 10.2, 11.2), w="bold", ha="left",
        bbox=dict(fc="#fbeeee", ec="none", pad=2.5))
    caption(ax, s, [
        (0, 3.3, "Day 5–6: the blastocyst reaches the uterine lining"),
        (3.3, 5.4, "Day 6–7: its outer layer, the trophoblast, attaches"),
        (5.4, 9.0, "Day 8–9: trophoblast cells fuse into a syncytium that invades the lining"),
        (9.0, 11.8, "Day 9–13: the syncytium taps maternal blood; lining cells decidualize"),
        (11.8, 99, "Both sides of this interface rely on recycled “selfish” DNA"),
    ])


SCENES = [  # (file name, draw function, seconds)
    ("01_hox_gene_regulation", hox_gene_regulation, 14.0),
    ("02_multifactor_regulation_eve_stripe2", eve_stripe2, 16.0),
    ("03_hox_regionalization", hox_regionalization, 15.0),
    ("04_hox_specification", hox_specification, 18.0),
    ("05_morphogen_cascade", morphogen_cascade, 15.0),
    ("06_placenta_transposon_enhancers", placenta_transposon_enhancers, 16.0),
    ("07_placenta_syncytin_cooption", placenta_syncytin, 18.5),
    ("08_placenta_development_overview", placenta_development, 17.0),
]


def frame(fig, ax, draw, s):
    ax.clear()
    ax.set_xlim(0, 16)
    ax.set_ylim(0, 9)
    ax.axis("off")
    draw(ax, s)
    fig.canvas.draw()
    return np.asarray(fig.canvas.buffer_rgba())


def main(argv):
    stills = None
    if "--stills" in argv:
        i = argv.index("--stills")
        stills = argv[i + 1]
        argv = argv[:i] + argv[i + 2:]
        os.makedirs(stills, exist_ok=True)
    todo = [sc for sc in SCENES if not argv or any(a in sc[0] for a in argv)]
    os.makedirs(OUT, exist_ok=True)
    fig = plt.figure(figsize=(PX[0] / 100, PX[1] / 100), dpi=100)
    fig.patch.set_facecolor("white")
    ax = fig.add_axes([0, 0, 1, 1])
    for name, draw, dur in todo:
        if stills:
            for k, fr in enumerate(np.linspace(0, 1, 8)):
                frame(fig, ax, draw, fr * dur)
                fig.savefig(os.path.join(stills, f"{name}_{k}.png"), dpi=75)
            continue
        path = os.path.join(OUT, name + ".gif")
        vf = ("split[a][b];[a]palettegen=max_colors=256:stats_mode=diff[p];"
              "[b][p]paletteuse=dither=none:diff_mode=rectangle")
        ff = subprocess.Popen(
            ["ffmpeg", "-loglevel", "error", "-y", "-f", "rawvideo", "-pix_fmt", "rgba",
             "-s", f"{PX[0]}x{PX[1]}", "-r", str(FPS), "-i", "-", "-vf", vf, "-loop", "0", path],
            stdin=subprocess.PIPE)
        for k in range(int(dur * FPS)):
            ff.stdin.write(frame(fig, ax, draw, k / FPS).tobytes())
        ff.stdin.close()
        ff.wait()
        print(f"{path}  {os.path.getsize(path) / 1e6:.1f} MB")


if __name__ == "__main__":
    main(sys.argv[1:])
