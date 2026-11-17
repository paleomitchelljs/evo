#!/usr/bin/env python3
"""Render the evo-devo lecture GIFs into export/.

    python3 scripts/make_evodevo_gifs.py                 # all of them
    python3 scripts/make_evodevo_gifs.py eve_stripe2 ... # just the named ones
    python3 scripts/make_evodevo_gifs.py --stills DIR    # PNG stills only, for checking layout

Needs matplotlib, numpy, pillow and ffmpeg. Every scene is a function
draw(ax, s) of time in seconds on a 16 x 9 canvas; edit the scene, rerun, the
GIF is replaced.

House rule: the GIFs carry no explanatory text. Gene and protein names only;
the story is told in export/README.md and by whoever is lecturing. Realistic
base drawings (embryo, blastocyst, virus particle) come from export/base/,
which holds openly licensed files from Wikimedia Commons; see CREDITS there.
All of the diagrams are schematics: curves and counts are stylised.
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
from matplotlib.patches import Circle, Ellipse, FancyBboxPatch, Polygon, Rectangle, RegularPolygon
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "export")
BASE = os.path.join(OUT, "base")
FPS = 12
PX = (1280, 720)

plt.rcParams["font.family"] = ["Inter", "DejaVu Sans"]

# Okabe-Ito, colour-blind safe
INK, GREY, PALE = "#222222", "#8a8a8a", "#cfcfcf"
BLUE, SKY, GREEN = "#0072B2", "#56B4E9", "#009E73"
ORANGE, VERM, PURPLE, YELLOW = "#E69F00", "#D55E00", "#CC79A7", "#F0E442"
ENVC = "#3f97a3"   # the envelope protein: matches the spikes on the virus drawing
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


def cross(ax, x, y, r, c="#b3261e", a=1.0, lw=3.5, z=9):
    line(ax, [x - r, x + r], [y - r, y + r], c=c, lw=lw, a=a, z=z)
    line(ax, [x - r, x + r], [y + r, y - r], c=c, lw=lw, a=a, z=z)


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


_SPR = {}


def put(ax, name, cx, cy, h, a=1.0, z=3, rot=0, px=460):
    """Place a base drawing from export/base, centred at (cx, cy), h units tall."""
    if a <= 0.01:
        return
    key = (name, rot, px)
    if key not in _SPR:
        im = Image.open(os.path.join(BASE, name)).convert("RGBA")
        im = im.crop(im.getbbox())
        if rot:
            im = im.rotate(rot, resample=Image.BICUBIC, expand=True)
        im.thumbnail((px, px))
        _SPR[key] = np.asarray(im) / 255.0
    arr = _SPR[key]
    w = h * arr.shape[1] / arr.shape[0]
    ax.imshow(arr, extent=(cx - w / 2, cx + w / 2, cy - h / 2, cy + h / 2), alpha=clip01(a),
              zorder=z, aspect="auto", interpolation="bilinear")
    return w


# ------------------------------------------------- 1. Hox gene regulation
def hox_gene_regulation(ax, s):
    n = 13
    p = lin(s, 2.0, 10.0)
    f = n * p
    gx = lambda i: 1.55 + i
    yb = 6.75
    line(ax, [1.2, 14.8], [yb + 0.3] * 2, c="#999", lw=3, z=1)
    txt(ax, 0.85, yb + 0.3, "3′", size=15, w="bold")
    txt(ax, 15.2, yb + 0.3, "5′", size=15, w="bold")
    for i in range(n):
        a = clip01(f - i)
        box(ax, gx(i), yb, 0.8, 0.6, mix("#d4d4d4", HOX[i], a), z=3)
        txt(ax, gx(i) + 0.4, yb + 0.3, str(i + 1), size=13, w="bold",
            c="white" if a > 0.5 else "#777", z=6)
        promoter(ax, gx(i) + 0.76, yb + 0.6, HOX[i], a, d=-1)
        squiggle(ax, gx(i) + 0.25, yb + 0.95, 0.5 * a, HOX[i], a, phase=s * 5 + i, lw=2)
    xf = 1.45 + min(f, n)
    if xf < 14.4:  # still-closed chromatin, drawn as packed nucleosomes
        ax.add_patch(Rectangle((xf, yb - 0.14), 14.45 - xf, 0.88, fc="#444", ec="none",
                               alpha=0.3, zorder=5))
        for x in np.arange(xf + 0.2, 14.4, 0.4):
            circ(ax, x, yb - 0.14, 0.13, "#666", a=0.95, z=5)
            circ(ax, x, yb + 0.74, 0.13, "#666", a=0.95, z=5)

    # the growing embryo: time of activation becomes position along the body
    tip0, span = 2.9, 12.0
    tip = tip0 + span * p
    xb = [tip0 + span * (i + 0.3) / n for i in range(n)] + [99]
    ye, he = 4.35, 0.7
    ax.add_patch(Ellipse((1.55, ye + he / 2), 1.5, 1.15, fc="#c9c9c9", ec=INK, lw=1.6, zorder=3))
    circ(ax, 1.25, ye + he / 2 + 0.15, 0.09, INK, z=4)
    ax.add_patch(Rectangle((1.9, ye), min(tip, xb[0]) - 1.9, he, fc="#c9c9c9", ec="none", zorder=2))
    for i in range(n):
        if tip > xb[i]:
            x1 = min(tip, xb[i + 1])
            ax.add_patch(Rectangle((xb[i], ye), x1 - xb[i], he, fc=HOX[i], ec="none", zorder=2))
            yr = 3.85 - i * 0.22
            ax.add_patch(Rectangle((xb[i], yr), tip - xb[i], 0.14, fc=HOX[i], ec="none", zorder=2))
            txt(ax, xb[i] - 0.08, yr + 0.07, f"Hox{i + 1}", size=9, ha="right", c="#444",
                a=lin(tip - xb[i], 0, 0.3))
    for x in np.arange(2.6, tip - 0.1, 0.46):  # segments
        line(ax, [x, x], [ye, ye + he], c="white", lw=1.2, a=0.6, z=3)
    box(ax, 1.9, ye, tip - 1.9, he, "none", ec=INK, lw=1.6, r=0.3, z=4)


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
    X0, X1 = 2.3, 13.7
    px = lambda v: X0 + (X1 - X0) * np.asarray(v) / 100
    xs = np.linspace(0, 100, 300)
    bcd, hb, gt, kr, out = _eve(xs)
    y0, hh = 3.7, 2.1
    names = [("Bicoid", bcd, GREEN, 0.3, 4, 0.9), ("Hunchback", hb, BLUE, 1.3, 30, 1.09),
             ("Giant", gt, VERM, 2.3, 14, 0.62), ("Krüppel", kr, ORANGE, 3.3, 62, 0.8)]
    u = lin(s, 4.8, 11.8)
    cur = float(np.interp(u, [0, 0.2, 0.75, 1], [0, 25, 50, 100]))
    look = cur + (37 - cur) * sm(s, 12.0, 12.8)   # where the enhancer is "reading"
    shown = cur if s >= 4.8 else -1

    emb = Ellipse((8, 7.45), X1 - X0, 1.9, fc="#f6efe2", ec=INK, lw=1.8, zorder=2)
    ax.add_patch(emb)
    for xv, ov in zip(xs[::2], out[::2]):
        if xv <= shown and ov > 0.02:
            r = Rectangle((px(xv), 6.4), (X1 - X0) / 150 + 0.01, 2.1, fc=INK, ec="none",
                          alpha=float(ov) * 0.9, zorder=3)
            ax.add_patch(r)
            r.set_clip_path(emb)

    line(ax, [X0, X1], [y0, y0], c="#777", lw=1.2)
    for name, v, col, t0, lx, ly in names:
        a = sm(s, t0, t0 + 0.8)
        line(ax, px(xs), y0 + hh * v, c=col, lw=3, a=a, z=4)
        txt(ax, px(lx), y0 + hh * ly, name, size=13, c=col, w="bold", a=a, ha="left")
    if shown >= 0:
        m = xs <= shown
        ax.fill_between(px(xs[m]), y0, y0 + hh * 0.95 * out[m], color=INK, alpha=0.8, zorder=3, lw=0)
        line(ax, [px(look)] * 2, [y0 - 0.1, 8.4], c=INK, lw=1.2, a=0.7, z=6, ls=(0, (4, 3)))

    # the enhancer, read at the cursor position: activators round, repressors square
    cb, ch, cg, ck, co = [float(v) for v in _eve(look)]
    live = sm(s, 4.3, 4.9)
    conc = {"B": (cb / 0.2, GREEN, 1), "H": (ch, BLUE, 1), "G": (cg, VERM, 0), "K": (ck, ORANGE, 0)}
    ye = 1.35
    line(ax, [2.3, 13.7], [ye + 0.25] * 2, c="#999", lw=3, z=1)
    for j, f in enumerate("KBGBKBHGBKBG"):
        v, col, is_act = conc[f]
        occ = clip01(v) * live
        x = 2.8 + j * 0.66
        box(ax, x, ye, 0.52, 0.5, "white", ec=col, lw=1.6, z=3, r=0.06)
        box(ax, x, ye, 0.52, 0.5, col, a=occ, z=4, r=0.06)
        txt(ax, x + 0.26, ye + 0.25, f, size=11, w="bold", c=mix(col, "white", occ), z=5)
        if occ > 0.5:  # bound protein sitting on the site
            a = (occ - 0.5) * 2
            if is_act:
                circ(ax, x + 0.26, ye + 0.78, 0.23, col, a=a, z=4)
            else:
                box(ax, x + 0.04, ye + 0.56, 0.44, 0.44, col, a=a, z=4, r=0.03)
    on = co * live
    promoter(ax, 11.0, ye + 0.5, mix(GREY, INK, on))
    box(ax, 11.45, ye, 2.0, 0.5, mix("#dddddd", INK, on), z=3)
    txt(ax, 12.45, ye + 0.25, "eve", size=13, c="white" if on > 0.4 else "#666", w="bold", z=5,
        style="italic")
    for k in range(4):
        squiggle(ax, 11.75 + k * 0.47, ye + 0.62, 0.7 * on, INK, on, phase=s * 6 + k, lw=2)


# ------------------------------------------------- 3. Hox regionalization
REG = [("cervical", 7, BLUE), ("thoracic", 13, GREEN), ("lumbar", 6, ORANGE),
       ("sacral", 4, VERM), ("caudal", 6, PURPLE)]
NV = sum(r[1] for r in REG)
REGION_OF = [k for k, r in enumerate(REG) for _ in range(r[1])]
START = np.cumsum([0] + [r[1] for r in REG])


class Col:
    """A row of vertebrae: x0 = left edge, p = pitch, w = vertebra width, h = height."""

    def __init__(self, x0=1.25, p=0.385, w=0.3, h=0.6):
        self.x0, self.p, self.w, self.h = x0, p, w, h
        self.end = x0 + (NV - 1) * p + w

    def x(self, i):
        return self.x0 + i * self.p

    def draw(self, ax, y, cols, ribs, pelv, alphas=None, head=True):
        k = self.p / 0.385
        if head:
            ax.add_patch(Ellipse((self.x0 - 0.57 * k, y + 0.38 * k + 0.1), 0.9 * k, 0.85 * k,
                                 fc="#d9d9d9", ec="none", zorder=2))
            circ(ax, self.x0 - 0.72 * k, y + 0.5 * k + 0.1, 0.06 * k, "#777", z=3)
        for i in range(NV):
            a = 1 if alphas is None else alphas[i]
            if ribs[i] > 0.02:
                xc = self.x(i) + self.w / 2
                t = np.linspace(0, 1, 12)
                line(ax, xc + 0.16 * k * ribs[i] * t ** 2, y - 0.8 * ribs[i] * t, c=cols[i],
                     lw=2.8 * k ** 0.5, a=a, z=2)
            box(ax, self.x(i) - 0.045 * k, y + self.h, self.p + 0.005, 0.16, cols[i], a=pelv[i] * a,
                r=0.02, z=2)
            box(ax, self.x(i), y, self.w, self.h, cols[i], a=a, r=0.05, z=3)

    def brackets(self, ax, y, a=1.0):
        for k, (name, nn, col) in enumerate(REG):
            line(ax, [self.x(START[k]), self.x(START[k + 1] - 1) + self.w], [y, y], c=col, lw=3, a=a)


# body axis of the E9 mouse drawing (export/base/mouse_embryo_E9.png), neck to tail tip, in the
# pixel coordinates of the 1280 x 1280 file
_AXIS = np.array([(490, 190), (400, 270), (330, 400), (285, 540), (260, 680), (262, 820), (290, 950),
                  (350, 1060), (440, 1140), (560, 1195), (680, 1200), (790, 1170), (880, 1100),
                  (950, 1000), (990, 880), (1000, 770), (990, 650)], float)
_E9_BOX = None


def _axis_points(n, cx, cy, h):
    """n*6+1 points evenly spaced along the embryo's axis, in canvas units."""
    global _E9_BOX
    if _E9_BOX is None:   # put() crops the file to its drawing before placing it
        _E9_BOX = Image.open(os.path.join(BASE, "mouse_embryo_E9.png")).convert("RGBA").getbbox()
    l, t, r, b = _E9_BOX
    d = np.r_[0, np.cumsum(np.hypot(*np.diff(_AXIS, axis=0).T))]
    u = np.linspace(0, d[-1], n * 6 + 1)
    px_, py_ = np.interp(u, d, _AXIS[:, 0]), np.interp(u, d, _AXIS[:, 1])
    k = np.ones(9) / 9   # round the corners of the traced polyline
    px_ = np.r_[px_[:4], np.convolve(px_, k, "valid"), px_[-4:]]
    py_ = np.r_[py_[:4], np.convolve(py_, k, "valid"), py_[-4:]]
    w = h * (r - l) / (b - t)
    return cx - w / 2 + (px_ - l) / (r - l) * w, cy + h / 2 - (py_ - t) / (b - t) * h


def hox_regionalization(ax, s):
    rows = [("Hox3", 0, BLUE), ("Hox5", 2, BLUE), ("Hox6", 7, GREEN), ("Hox9", 17, GREEN),
            ("Hox10", 20, ORANGE), ("Hox11", 26, VERM), ("Hox13", 30, PURPLE)]
    C = Col(x0=7.9, p=0.213, w=0.165, h=0.62)
    yc = 6.7
    cols = ["#c4c4c4"] * NV
    for k, (name, b, col) in enumerate(rows):
        pr = lin(s, 1.6 + k * 0.95, 2.5 + k * 0.95)
        front = C.x(b) + (C.end - C.x(b)) * pr
        yr = 5.0 - k * 0.52
        if pr > 0:
            box(ax, C.x(b), yr, front - C.x(b), 0.3, col, r=0.05, a=0.9)
            txt(ax, C.x(b) - 0.1, yr + 0.15, name, size=12, ha="right", c=col, w="bold",
                a=lin(pr, 0, 0.15))
            for i in range(b, NV):
                cols[i] = mix(cols[i], col, (front - C.x(i)) / C.p)
    morph = sm(s, 8.8, 10.2)
    ribs = [morph if REGION_OF[i] == 1 else 0 for i in range(NV)]
    pelv = [morph if REGION_OF[i] == 3 else 0 for i in range(NV)]
    alphas = [sm(s, -0.3 + i * 0.03, 0.1 + i * 0.03) if s < 2 else 1 for i in range(NV)]
    C.draw(ax, yc, cols, ribs, pelv, alphas)
    C.brackets(ax, yc + 1.0, a=morph)

    # the same code painted on a real embryo
    ecx, ecy, eh = 3.6, 4.5, 8.2
    put(ax, "mouse_embryo_E9.png", ecx, ecy, eh, z=1, px=640)
    X, Y = _axis_points(NV, ecx, ecy, eh)
    for i in range(NV):
        if cols[i] == "#c4c4c4":
            continue
        seg = slice(i * 6 + 1, i * 6 + 6)
        line(ax, X[seg], Y[seg], c=cols[i], lw=11, a=0.85, z=4, solid_capstyle="butt")


# --------------------------------------------- 4. Hox specification (tests)
def hox_specification(ax, s):
    C = Col()
    yc = 6.1
    ko10 = win(s, 2.6, 6.8, 0.9)
    ko11 = win(s, 7.2, 11.2, 0.9)
    shift = sm(s, 12.2, 14.4)
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
    C.draw(ax, yc, cols, ribs, pelv)
    for name, b, col, yr, ko in [("Hox6", b6, GREEN, 4.3, 0), ("Hox10", 20, ORANGE, 3.5, ko10),
                                 ("Hox11", 26, VERM, 2.7, ko11)]:
        box(ax, C.x(b), yr, C.end - C.x(b), 0.36, col, a=0.9 * (1 - ko), r=0.05)
        box(ax, C.x(b), yr, C.end - C.x(b), 0.36, "none", ec=col, lw=1.5, a=ko, r=0.05, ls=(0, (4, 3)))
        txt(ax, C.x(b) - 0.12, yr + 0.18, name, size=13, ha="right", c=col, w="bold")
        cross(ax, (C.x(b) + C.end) / 2, yr + 0.18, 0.3, a=ko, lw=5)
    if shift > 0.02:
        ax.annotate("", xy=(C.x(b6) - 0.02, 3.95), xytext=(C.x(7), 3.95), zorder=6,
                    arrowprops=dict(arrowstyle="-|>", color=INK, lw=2, alpha=clip01(shift * 3)))


# ------------------------------------------------- 5. morphogen cascade
_rng = np.random.default_rng(7)
_MX = 1.9 + _rng.exponential(3.0, 170)
_MX = _MX[_MX < 15.0]
_MY = 7.83 + 0.55 * _rng.random(len(_MX))
_MP = _rng.random(len(_MX)) * 6.28


def morphogen_cascade(ax, s):
    MC, AC = PURPLE, GREEN
    yc, hc, pitch, wc = 6.5, 1.15, 1.15, 1.07
    cx = lambda i: 1.0 + i * pitch
    fate = sm(s, 10.0, 11.4)
    groups = [(1, 3, BLUE, "ABC"), (4, 6, SKY, "BC"), (7, 9, YELLOW, "C"), (10, 11, "#e2e2e2", "D")]
    for i in range(12):
        fc, lit = "#f1f1f1", "D"
        for a, b, col, g in groups:
            if a <= i <= b:
                fc, lit = mix("#f1f1f1", mix(col, "white", 0.35), fate), g
        if i == 0:
            fc = MC
        box(ax, cx(i), yc, wc, hc, fc, ec="#999", lw=1.2, r=0.14, z=2)
        circ(ax, cx(i) + wc / 2, yc + 0.36, 0.2, "white", ec="#aaa", a=0.9, z=3)
        if i == 0:
            continue
        for k, g in enumerate("ABCD"):   # which target genes this cell is running
            base = 1.0 if g == "D" else 0.0
            lv = base + ((1.0 if g in lit else 0.0) - base) * fate
            col = AC if g != "D" else "#555"
            box(ax, cx(i) + 0.1 + k * 0.225, yc + 0.72, 0.2, 0.26, mix("#dcdcdc", col, lv), r=0.03, z=4)
            txt(ax, cx(i) + 0.2 + k * 0.225, yc + 0.85, g, size=7.5, w="bold",
                c=mix("#aaaaaa", "white", lv), z=5)
    # morphogen dots spreading from the source
    al = np.clip((s - (0.4 + 3.2 * (_MX - 1.9) / 13)) / 0.5, 0, 1)
    rgba = np.zeros((len(_MX), 4))
    rgba[:, :3] = to_rgb(MC)
    rgba[:, 3] = al
    ax.scatter(_MX + 0.05 * np.sin(s * 3 + _MP), _MY + 0.05 * np.cos(s * 2.3 + _MP), s=30, c=rgba,
               zorder=4, linewidths=0)

    # zoomed cell
    za = sm(s, 2.8, 3.6)
    if za > 0:
        o = 2.3                                # x offset of everything in the zoomed cell
        zx, zy, zw, zh = 1.6 + o, 0.75, 8.6, 4.1
        top = zy + zh
        for xa, xb in [(cx(2), zx), (cx(2) + wc, zx + zw)]:
            line(ax, [xa, xb], [yc, top], c="#aaa", lw=1, a=za * 0.8, z=1, ls=(0, (3, 3)))
        box(ax, cx(2), yc, wc, hc, "none", ec=INK, lw=2, a=za, r=0.14, z=5)
        box(ax, zx, zy, zw, zh, "#fbf7ee", ec=INK, lw=1.8, a=za, r=0.3, z=2)
        ax.add_patch(Ellipse((6.9 + o, 2.35), 5.8, 2.5, fc="#ece4f3", ec="#a48fba", lw=1.4, alpha=za, zorder=3))
        rx = 3.2 + o
        bound = sm(s, 4.9, 5.3)
        rc = mix("#777", MC, bound)
        line(ax, [rx, rx], [top - 0.4, top + 0.2], c=rc, lw=6, a=za, z=6)
        line(ax, [rx - 0.22, rx, rx + 0.22], [top + 0.46, top + 0.2, top + 0.46], c=rc, lw=6, a=za, z=6)
        d = sm(s, 4.0, 4.9)
        if s > 3.8:
            circ(ax, rx + 0.5 * (1 - d), top + 1.0 - 0.58 * d, 0.15, MC, a=sm(s, 3.8, 4.1), z=7)
        act = sm(s, 5.5, 6.3)
        mv = sm(s, 6.6, 8.0)
        tx, ty = 3.3 + o + (4.85 - 3.3) * mv, 4.0 + (2.62 - 4.0) * mv
        if act > 0 and mv < 0.05:               # relay from receptor to regulator
            for k in range(3):
                circ(ax, rx + 0.02, top - 0.52 - 0.13 * k, 0.04, AC, a=act * (1 - mv), z=6)
        circ(ax, tx, ty, 0.34, mix("#bdbdbd", AC, act), ec=mix("#888", INK, act), a=za, z=8)
        txt(ax, tx, ty, "TF", size=11, w="bold", c="white", a=za, z=9)
        ge = sm(s, 8.2, 9.4)
        yd = 1.95
        line(ax, [4.4 + o, 9.5 + o], [yd + 0.24] * 2, c="#999", lw=3, a=za, z=4)
        for k, g in enumerate("ABCD"):
            x = 5.4 + o + k * 1.0
            level = ge if g != "D" else 1 - ge
            col = AC if g != "D" else "#555"
            box(ax, x, yd, 0.76, 0.48, mix("#d6d6d6", col, level), a=za, z=5)
            txt(ax, x + 0.38, yd + 0.24, g, size=12, w="bold", c="white", a=za, z=6)
            promoter(ax, x - 0.02, yd + 0.48, mix("#bbbbbb", col, level), a=za, z=6)
            squiggle(ax, x + 0.5, yd + 0.6, 0.55 * level, col, level * za, phase=s * 6 + k, z=7, lw=2)


# ------------------------------------ 6. placenta: transposons as enhancers
def placenta_transposon_enhancers(ax, s):
    TE, TFc, ON, HOR = ORANGE, PURPLE, GREEN, YELLOW
    ys = [6.9, 4.7, 2.5]
    genes = [(0, 3.6), (0, 8.2), (0, 12.6), (1, 2.4), (1, 6.8), (1, 11.0), (2, 4.6), (2, 9.2), (2, 13.4)]
    copies = [(0, 7.25, 1), (1, 5.85, 4), (2, 3.65, 6), (2, 12.45, 8), (0, 10.9, None), (1, 13.6, None)]
    ox, oy = 1.7, ys[0]
    bind = [sm(s, 7.2 + 0.35 * k, 8.2 + 0.35 * k) for k in range(len(copies))]
    onl = {gi: sm(s, 8.6 + 0.35 * k, 9.6 + 0.35 * k) for k, (_, _, gi) in enumerate(copies) if gi is not None}
    decay = sm(s, 9.5, 11.0)

    def te(x, y, a=1.0, fade=0.0, z=4):
        box(ax, x, y - 0.24, 0.7, 0.48, mix(TE, "#dddddd", fade), ec=mix("#9a6a00", "#bbb", fade), a=a,
            r=0.05, z=z, lw=1.5)
        for d in (0.18, 0.35, 0.52):
            line(ax, [x + d] * 2, [y - 0.16, y + 0.16], c=mix(INK, "#bbb", fade), lw=2.4, a=a, z=z + 1)

    for y in ys:
        line(ax, [0.8, 15.2], [y, y], c="#aaa", lw=3, z=1)
    for gi, (r, x) in enumerate(genes):
        lv = onl.get(gi, 0)
        box(ax, x, ys[r] - 0.26, 1.25, 0.52, mix("#d8d8d8", ON, lv), z=3)
        promoter(ax, x + 0.04, ys[r] + 0.26, mix("#b5b5b5", ON, lv))
        for k in range(3):
            squiggle(ax, x + 0.5 + 0.3 * k, ys[r] + 0.56, 0.6 * lv, ON, lv, phase=s * 6 + k + gi, lw=2)
    te(ox, oy)
    for k, (r, x, gi) in enumerate(copies):
        t0 = 2.0 + k * 0.75
        pr = sm(s, t0, t0 + 1.2)
        if pr <= 0:
            continue
        if pr < 1:
            xx = ox + (x - ox) * pr
            yy = oy + (ys[r] - oy) * pr + 1.0 * math.sin(math.pi * pr)
            te(xx, yy, a=0.75, z=8)
            continue
        te(x, ys[r], fade=decay if gi is None else 0)
        if gi is None:
            cross(ax, x + 0.35, ys[r], 0.2, a=decay * 0.8, lw=3, c="#999")
        elif bind[k] > 0:
            yy = ys[r] + 0.48 + 1.3 * (1 - bind[k])
            ax.add_patch(Ellipse((x + 0.35, yy), 0.7, 0.42, fc=TFc, ec="#8a4a6f", lw=1.2,
                                 alpha=clip01(bind[k] * 1.5), zorder=7))
            txt(ax, x + 0.35, yy, "TF", size=9.5, c="white", w="bold", a=bind[k], z=8)
            ax.add_patch(RegularPolygon((x + 0.72, yy + 0.2), numVertices=6, radius=0.14, fc=HOR,
                                        ec="#8a7a00", lw=1, alpha=clip01(bind[k] * 1.5), zorder=8))
            gx_ = genes[gi][1]
            if onl[gi] > 0:
                t = np.linspace(0, 1, 20)
                line(ax, x + 0.7 + (gx_ - x - 0.7) * t, ys[r] - 0.3 - 0.32 * np.sin(math.pi * t),
                     c=ON, lw=2, a=onl[gi], z=2)
    # the hormone arriving
    ha = win(s, 6.2, 8.6, 0.5)
    rng = np.random.default_rng(5)
    for k in range(16):
        hx, hy = 1 + 14 * rng.random(), 8.6 - 0.6 * rng.random() - 0.4 * lin(s, 6.2, 8.6)
        if ha > 0.01:
            ax.add_patch(RegularPolygon((hx, hy), numVertices=6, radius=0.14, fc=HOR, ec="#8a7a00", lw=1,
                                        alpha=clip01(ha), zorder=6))


# ------------------------------------ 7. placenta: syncytin, a captured virus
def placenta_syncytin(ax, s):
    A = win(s, 0, 5.3, 0.5)
    B = win(s, 5.1, 8.9, 0.5)
    C = sm(s, 8.7, 9.4)
    # ---- A: a retrovirus infects a germ-line cell and its genome joins the host's
    if A > 0:
        box(ax, 6.2, 0.9, 8.6, 7.2, "#fdf5e6", ec="#c9a66b", lw=2, a=A, r=1.0, z=2)
        ax.add_patch(Ellipse((10.9, 4.4), 5.0, 3.4, fc="#ece4f3", ec="#a48fba", lw=1.4, alpha=A, zorder=3))
        line(ax, [8.9, 12.9], [4.4, 4.4], c="#888", lw=4, a=A, z=4)
        mv = sm(s, 0.7, 2.4)
        fuse = sm(s, 2.4, 3.2)
        vxp, vyp = 2.4 + (5.25 - 2.4) * mv + 0.6 * fuse, 6.4 + (4.6 - 6.4) * mv
        put(ax, "retrovirus_particle.png", vxp, vyp, 2.3, a=A * (1 - fuse), z=6)
        go = sm(s, 2.7, 3.9)
        ins = sm(s, 3.9, 4.5)
        if fuse > 0:
            box(ax, 6.3 + (10.5 - 6.3) * go, 4.5 + (4.28 - 4.5) * go, 0.6 + 0.5 * ins, 0.24,
                ENVC, ec="#2c6c75", a=A * fuse, r=0.05, z=8)
    # ---- B: most of the provirus decays, env is kept
    if B > 0:
        yb = 4.3
        line(ax, [1.0, 15.0], [yb + 0.45] * 2, c="#999", lw=4, a=B, z=1)
        dec = sm(s, 6.0, 7.5)
        keep = sm(s, 7.0, 7.8)
        segs = [("LTR", 2.6, 0.9, "#9aa7b3", 0), ("gag", 3.6, 2.5, SKY, 1), ("pol", 6.2, 3.7, BLUE, 1),
                ("env", 10.0, 2.4, ENVC, 0), ("LTR", 12.5, 0.9, "#9aa7b3", 0)]
        for name, x, w_, col, rot in segs:
            grow = 0.12 * keep if name == "env" else 0
            box(ax, x, yb - grow, w_, 0.9 + 2 * grow, mix(col, "#d2d2d2", dec * rot), a=B, r=0.06, z=3,
                ec=INK if name == "env" else "none", lw=2.4 * keep)
            txt(ax, x + w_ / 2, yb + 0.45, name, size=15, w="bold", c="white", a=B, z=5, style="italic")
            if rot:
                for k in range(3):
                    cross(ax, x + w_ * (0.18 + 0.32 * k), yb + 0.45 + 0.15 * (k % 2 - 0.5), 0.16,
                          a=B * sm(s, 6.0 + 0.3 * k, 6.5 + 0.3 * k), lw=3.5, z=6)
        txt(ax, 11.2, yb - 0.75, "syncytin", size=15, w="bold", c=ENVC, a=B * keep)
    # ---- C: the same fusion protein merges trophoblast cells in the placenta
    if C > 0:
        x0, wc_, n = 1.3, 1.675, 8
        x1 = x0 + n * wc_
        yt, ym, yb_, yf = 5.6, 4.1, 2.6, 0.7
        ax.add_patch(Rectangle((x0, yt), x1 - x0, 2.7, fc="#fbe1dc", ec="none", alpha=C, zorder=1))
        rng = np.random.default_rng(3)
        for k in range(30):
            rx = x0 + 0.2 + ((rng.random() * (x1 - x0) + s * 0.35) % (x1 - x0 - 0.4))
            ax.add_patch(Ellipse((rx, yt + 0.3 + rng.random() * 2.1), 0.34, 0.19, angle=rng.random() * 180,
                                 fc="#d9544a", ec="none", alpha=0.75 * C, zorder=2))
        ax.add_patch(Rectangle((x0, yf), x1 - x0, yb_ - yf, fc="#eaf2fb", ec="none", alpha=C, zorder=1))
        box(ax, x0 + 0.6, yf + 0.6, x1 - x0 - 1.2, 0.6, "#e8a39c", ec="#b3564d", lw=1.2, a=C, r=0.3, z=2)
        for k in range(12):
            rx = x0 + 0.9 + ((k * 1.1 + s * 0.5) % (x1 - x0 - 1.8))
            ax.add_patch(Ellipse((rx, yf + 0.9), 0.3, 0.17, fc="#c9433a", ec="none", alpha=0.8 * C, zorder=3))
        spike = sm(s, 9.8, 10.8)
        for i in range(n):
            xc = x0 + i * wc_
            box(ax, xc, yb_, wc_, ym - yb_, "#f3e3ee", ec="#9b6d8c", lw=1.5, a=C, r=0.12, z=3)
            circ(ax, xc + wc_ / 2, yb_ + 0.7, 0.28, "#b48aa6", a=C, z=4)
            circ(ax, xc + wc_ / 2 + 0.05 * math.sin(i * 1.7), ym + 0.65, 0.28, "#8f5f80", a=C, z=5)
        fz = [sm(s, 11.0 + 0.45 * abs(i - n / 2), 12.2 + 0.45 * abs(i - n / 2)) for i in range(n + 1)]
        ax.add_patch(Rectangle((x0, ym), x1 - x0, yt - ym, fc=mix("#f3e3ee", "#e3bcd3", min(fz)), ec="none",
                               alpha=C, zorder=3))
        line(ax, [x0, x1, x1, x0, x0], [ym, ym, yt, yt, ym], c="#7d4f70", lw=1.8, a=C, z=6)
        for i in range(1, n):
            xb = x0 + i * wc_
            aa = C * (1 - fz[i])
            line(ax, [xb, xb], [ym, yt], c="#7d4f70", lw=1.8, a=aa, z=6)
            for yy in np.linspace(ym + 0.22, yt - 0.22, 5):
                line(ax, [xb - 0.16, xb + 0.16], [yy, yy], c=ENVC, lw=3, a=aa * spike, z=7)
                for sx in (-0.16, 0.16):
                    circ(ax, xb + sx, yy, 0.06, ENVC, a=aa * spike, z=7)


# ------------------------------------ 8. human placental development overview
_r2 = np.random.default_rng(11)
_SC = [(0.3 + 15.4 * _r2.random(), 4.75 + 3.9 * _r2.random(), 180 * _r2.random()) for _ in range(150)]


def placenta_development(ax, s):
    y0, y1 = 4.5, 8.8
    DEC, SY = "#E3A93C", "#7d4f70"
    stroma = Rectangle((0.2, y0), 15.6, y1 - y0, fc="#fbeeee", ec="none", zorder=1)
    ax.add_patch(stroma)
    inv = sm(s, 5.3, 10.0)
    cy = 1.5 + (3.2 - 1.5) * sm(s, 0.3, 3.3) + (6.0 - 3.2) * sm(s, 5.0, 9.0)
    cxm = 8.0
    for x, y, ang in _SC:
        dist = math.hypot(x - cxm, y - 5.8)
        d = sm(s, 6.0 + 0.55 * dist, 8.0 + 0.55 * dist)
        ax.add_patch(Ellipse((x, y), 0.36 - 0.04 * d, 0.13 + 0.15 * d, angle=ang, fc=mix("#cdb9b9", DEC, d),
                             ec="none", zorder=2))
    gap = 1.3 * sm(s, 4.4, 6.0)
    for x in np.arange(0.2, 15.8, 0.3):
        if abs(x + 0.15 - cxm) > gap or gap == 0:
            box(ax, x, y0 - 0.2, 0.28, 0.24, "#e9b8b8", ec="#c48f8f", lw=0.8, r=0.04, z=3)
    # syncytiotrophoblast: grows out from the embedded blastocyst
    if inv > 0:
        th = np.linspace(0, 2 * math.pi, 140)
        R = (0.6 + 1.95 * inv) * (1 + 0.13 * np.sin(3 * th + 1) + 0.09 * np.sin(5 * th + 2) + 0.05 * np.sin(9 * th))
        by = cy + 0.25
        blob = Polygon(np.c_[cxm + 1.25 * R * np.cos(th), by + R * np.sin(th)], closed=True, fc="#c9a3bd",
                       ec=SY, lw=1.6, zorder=4)
        ax.add_patch(blob)
        blob.set_clip_path(stroma)
        for k in range(14):
            a_ = 0.3 + k * 0.45
            rr = (1.45 + 0.3 * (k % 3)) * inv * 1.1
            px_, py_ = cxm + 1.25 * rr * math.cos(a_), by + rr * math.sin(a_)
            if py_ > y0 + 0.15:
                circ(ax, px_, py_, 0.11, SY, a=inv, z=5)
        lac = sm(s, 9.0, 11.0)
        for k, a_ in enumerate([0.45, 1.2, 1.95, 2.7]):
            lx_, ly_ = cxm + 1.25 * 1.85 * inv * math.cos(a_), by + 1.85 * inv * math.sin(a_)
            circ(ax, lx_, ly_, 0.24, "#d9544a", ec="#a33a31", a=lac, z=6)
            if k in (1, 2):   # maternal vessels opening into the lacunae
                t = np.linspace(0, 1, 30)
                line(ax, lx_ + (0.6 * (k - 1.5)) * t + 0.08 * np.sin(t * 9), ly_ + (y1 - ly_) * t, c="#d9544a",
                     lw=5, a=sm(s, 9.8, 11.4) * 0.9, z=3)
    # blastocyst: inner cell mass turned to face the lining
    circ(ax, cxm, cy, 1.08, "#fdfcff", z=6)
    put(ax, "human_blastocyst.png", cxm, cy, 3.0, z=7, rot=130)
    # what each side was built with: a transposon for the decidua, a virus for the syncytium
    fa = sm(s, 11.8, 12.8)
    pulse = 1 + 0.06 * math.sin(s * 5)
    if fa > 0:
        box(ax, 2.2, 1.0, 2.6, 2.2, "white", ec=DEC, lw=2.5, a=fa, r=0.25, z=8)
        w_ = 1.5 * pulse
        box(ax, 3.5 - w_ / 2, 2.1 - 0.42 * pulse, w_, 0.84 * pulse, ORANGE, ec="#9a6a00", lw=2, a=fa, r=0.08, z=9)
        for d in (-0.38, 0, 0.38):
            line(ax, [3.5 + d * pulse] * 2, [2.1 - 0.27, 2.1 + 0.27], c=INK, lw=4, a=fa, z=10)
        line(ax, [3.5, 3.2], [3.2, 5.6], c=DEC, lw=2.2, a=fa, z=8)
        circ(ax, 3.2, 5.6, 0.5, "none", ec=DEC, lw=2.2, a=fa, z=8)
        box(ax, 11.2, 1.0, 2.6, 2.2, "white", ec=SY, lw=2.5, a=fa, r=0.25, z=8)
        put(ax, "retrovirus_particle.png", 12.5, 2.1, 1.85 * pulse, a=fa, z=9)
        line(ax, [12.5, 10.3], [3.2, 5.2], c=SY, lw=2.2, a=fa, z=8)
        circ(ax, 10.3, 5.2, 0.5, "none", ec=SY, lw=2.2, a=fa, z=8)


SCENES = [  # (file name, draw function, seconds)
    ("01_hox_gene_regulation", hox_gene_regulation, 13.0),
    ("02_multifactor_regulation_eve_stripe2", eve_stripe2, 16.0),
    ("03_hox_regionalization", hox_regionalization, 14.0),
    ("04_hox_specification", hox_specification, 17.5),
    ("05_morphogen_cascade", morphogen_cascade, 15.0),
    ("06_placenta_transposon_enhancers", placenta_transposon_enhancers, 15.0),
    ("07_placenta_syncytin_cooption", placenta_syncytin, 17.5),
    ("08_placenta_development_overview", placenta_development, 16.5),
]


def frame(fig, ax, draw, s):
    ax.clear()
    ax.axis("off")
    draw(ax, s)
    ax.set_xlim(0, 16)   # after drawing: imshow moves the limits
    ax.set_ylim(0, 9)
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
