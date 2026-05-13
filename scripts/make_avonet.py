"""Clean AVONET (Tobias et al. 2022) into a lesson-ready CSV + JSON.

Source: figshare 10.6084/m9.figshare.16586228 (ELEData.zip → TraitData/).
We use the species-level AVONET1_BirdLife.csv sheet (BirdLife taxonomy,
11,009 extant species).

Columns we keep: taxonomy + the core morphological axes (mass, wing, beak,
tarsus, tail, hand-wing index) + ecological classifiers (habitat,
migration, trophic level/niche, primary lifestyle) + range size. We drop
the measurement-provenance columns (N measured, inferred flags, source
refs, individual-count breakdowns) since they're not lesson-relevant.
"""

from __future__ import annotations

import csv
import json
import sys
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
RAW_DEFAULT = REPO.parent / "popgensims" / "data" / "avonet_raw" / "AVONET1_BirdLife.csv"
# Fallback to the extracted zip under /tmp when pulled fresh:
FALLBACK = Path("/tmp/avonet/ELEData/ELEData/TraitData/AVONET1_BirdLife.csv")
OUT_DIR = REPO / "data" / "clean"

COLUMNS = [
    ("Species1", "species", "str"),
    ("Family1", "family", "str"),
    ("Order1", "order", "str"),
    ("Mass", "mass_g", "float"),
    ("Wing.Length", "wing_length_mm", "float"),
    ("Beak.Length_Culmen", "beak_length_culmen_mm", "float"),
    ("Beak.Length_Nares", "beak_length_nares_mm", "float"),
    ("Beak.Width", "beak_width_mm", "float"),
    ("Beak.Depth", "beak_depth_mm", "float"),
    ("Tarsus.Length", "tarsus_length_mm", "float"),
    ("Tail.Length", "tail_length_mm", "float"),
    ("Kipps.Distance", "kipps_distance_mm", "float"),
    ("Hand-Wing.Index", "hand_wing_index", "float"),
    ("Habitat", "habitat", "str"),
    ("Habitat.Density", "habitat_density", "int"),
    ("Migration", "migration", "int"),
    ("Trophic.Level", "trophic_level", "str"),
    ("Trophic.Niche", "trophic_niche", "str"),
    ("Primary.Lifestyle", "primary_lifestyle", "str"),
    ("Range.Size", "range_size_km2", "float"),
    ("Centroid.Latitude", "centroid_latitude", "float"),
    ("Centroid.Longitude", "centroid_longitude", "float"),
]

MISSING = {"NA", "", "NaN"}


def coerce(value: str, kind: str):
    value = value.strip()
    if value in MISSING:
        return None
    if kind == "float":
        try:
            return float(value)
        except ValueError:
            return None
    if kind == "int":
        try:
            return int(float(value))
        except ValueError:
            return None
    return value


def clean(raw_path: Path, out_dir: Path) -> None:
    with raw_path.open(encoding="utf-8-sig", newline="") as fh:
        reader = csv.DictReader(fh)
        src_fields = reader.fieldnames or []
        missing_cols = [s for s, _, _ in COLUMNS if s not in src_fields]
        if missing_cols:
            raise SystemExit(f"missing source columns: {missing_cols}")

        rows = []
        for row in reader:
            cleaned = {dst: coerce(row[src], kind) for src, dst, kind in COLUMNS}
            if cleaned["mass_g"] is None and cleaned["beak_length_culmen_mm"] is None:
                continue
            rows.append(cleaned)

    out_dir.mkdir(parents=True, exist_ok=True)
    csv_path = out_dir / "avonet_birds.csv"
    json_path = out_dir / "avonet_birds.json"

    with csv_path.open("w", newline="") as fh:
        writer = csv.DictWriter(fh, fieldnames=[dst for _, dst, _ in COLUMNS])
        writer.writeheader()
        for r in rows:
            writer.writerow({k: ("" if v is None else v) for k, v in r.items()})

    with json_path.open("w") as fh:
        json.dump(rows, fh, separators=(",", ":"))

    print(f"wrote {len(rows)} rows → {csv_path.name}, {json_path.name}")


if __name__ == "__main__":
    if len(sys.argv) > 1:
        raw = Path(sys.argv[1])
    elif FALLBACK.exists():
        raw = FALLBACK
    else:
        raw = RAW_DEFAULT
    clean(raw, OUT_DIR)
