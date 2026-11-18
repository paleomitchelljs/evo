"""Clean Campione & Evans (2012) extant limb data (via the MASSTIMATE R package) into data/clean.

Source: CRAN archive, MASSTIMATE_2.0-1.tar.gz -> MASSTIMATE/data/extants.csv
(package archived on CRAN 2026-10-12; the archive tarball still downloads).
Usage: python3 -I scripts/make_campione_limbs.py <path to extants.csv>
"""
import csv, sys
from pathlib import Path

OUT = Path(__file__).resolve().parent.parent / "data/clean/campione_evans_limbs.csv"
COLS = [("Mon.Groups", "group"), ("Family", "family"), ("Species", "species"),
        ("Common.Name", "common_name"), ("SP.", "specimen"), ("BM", "body_mass_g"),
        ("Humerus.Length", "humerus_length_mm"), ("HC", "humerus_circ_mm"),
        ("Femur.Length", "femur_length_mm"), ("FC", "femur_circ_mm")]
rows = list(csv.DictReader(open(sys.argv[1], encoding="utf-8")))
with open(OUT, "w", newline="") as f:
    w = csv.writer(f); w.writerow([c for _, c in COLS])
    for r in rows:
        w.writerow(["" if r[k] in ("NA", "") else r[k].strip() for k, _ in COLS])
print(len(rows), "rows ->", OUT)
