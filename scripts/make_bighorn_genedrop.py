#!/usr/bin/env python3
"""
make_bighorn_genedrop.py -- join the Ram Mountain bighorn pedigree to its birth
cohorts, in the one shape lesson10's Stage B needs to gene-drop it in a browser.

WHY A SEPARATE DERIVATIVE. `bighorn_pedigree.csv` has (id, dam, sire) and no
dates; `bighorn_horn.csv` has the birth cohort but one row per sheep-year, 4,015
of them. Stage B needs both and has to decide two things the pedigree alone
cannot answer: which sheep count as the final cohort, and which founders were
even alive early enough to have had a shot at it. Fetching and joining two files
in the page to recompute the same table on every load is the wrong place for it.

The output also carries a topological order. Gene dropping has to visit parents
before offspring, and the pedigree file is in no particular order.

Usage:  python3 scripts/make_bighorn_genedrop.py
Writes: data/clean/bighorn_genedrop.json
"""
import csv, json, os

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
CLEAN = os.path.join(ROOT, "data", "clean")
NA = ("NA", "", None)

ped = list(csv.DictReader(open(os.path.join(CLEAN, "bighorn_pedigree.csv"))))
idx = {r["id"]: r for r in ped}

# birth cohort, one per sheep, off the sheep-year table
cohort = {}
for r in csv.DictReader(open(os.path.join(CLEAN, "bighorn_horn.csv"))):
    if r["cohort"] not in NA:
        try:
            cohort[r["ID"]] = int(float(r["cohort"]))
        except ValueError:
            pass

# depth = generations below the deepest founder above it, which is a valid
# topological key: a parent is always strictly shallower than its offspring.
depth = {}
def d(i):
    if i in depth:
        return depth[i]
    r = idx.get(i)
    if r is None or (r["dam"] in NA and r["sire"] in NA):
        depth[i] = 0
        return 0
    depth[i] = 0                        # guard, the file has no cycles
    depth[i] = 1 + max(d(r["dam"]) if r["dam"] in idx else 0,
                       d(r["sire"]) if r["sire"] in idx else 0)
    return depth[i]
for r in ped:
    d(r["id"])

order = sorted(idx, key=lambda i: (depth[i], i))
pos = {i: k for k, i in enumerate(order)}

out = []
for i in order:
    r = idx[i]
    out.append({
        "i":  pos[i],
        "id": i,
        "dam":  pos[r["dam"]]  if r["dam"]  in idx else -1,
        "sire": pos[r["sire"]] if r["sire"] in idx else -1,
        "cohort": cohort.get(i),
        "depth": depth[i],
    })

founders = [r for r in out if r["dam"] < 0 and r["sire"] < 0]
halfs    = [r for r in out if (r["dam"] < 0) != (r["sire"] < 0)]
meta = {
    "source": "Pelletier et al. 2022 / Coltman et al. 2003, Ram Mountain bighorn sheep. Dryad doi:10.5061/dryad.41d7q, CC0.",
    "n": len(out),
    "founders": len(founders),
    "one_parent_only": len(halfs),
    "max_depth": max(depth.values()),
    "cohort_range": [min(cohort.values()), max(cohort.values())],
    "note": ("A sheep with a dam but no sire is not an error: paternity was not "
             "assigned for every lamb. Stage B gives those the second copy from an "
             "unidentified ram, which is why about a fifth of the final cohort's "
             "copies trace to no founder in the file."),
}
json.dump({"meta": meta, "ped": out},
          open(os.path.join(CLEAN, "bighorn_genedrop.json"), "w"), separators=(",", ":"))
print(json.dumps(meta, indent=2))
print("wrote data/clean/bighorn_genedrop.json")
