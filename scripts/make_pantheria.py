"""Clean PanTHERIA (Jones et al. 2009) into a lesson-ready CSV + JSON.

Source: https://esapubs.org/archive/ecol/E090/184/ (Ecological Archives E090-184)
Expected input: PanTHERIA_1-0_WR05_Aug2008.txt (MSW 2005 taxonomy, 5416 species).

PanTHERIA uses -999.00 as the missing-value sentinel across every numeric
column. We rewrite those to empty strings on output.

We keep a compact subset of traits that are well-populated and teach well:
body mass, gestation, litter size, max longevity, weaning age, head-body
length, diet/habitat breadth, trophic level. Sparse columns (BMR,
forearm length, teat number) are dropped to keep the file small.
"""

from __future__ import annotations

import csv
import json
import sys
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
RAW_DEFAULT = Path("/tmp/pantheria/PanTHERIA_WR05.txt")
OUT_DIR = REPO / "data" / "clean"

COLUMNS = [
    ("MSW05_Order", "order", "str"),
    ("MSW05_Family", "family", "str"),
    ("MSW05_Genus", "genus", "str"),
    ("MSW05_Species", "species", "str"),
    ("MSW05_Binomial", "binomial", "str"),
    ("5-1_AdultBodyMass_g", "adult_body_mass_g", "float"),
    ("13-1_AdultHeadBodyLen_mm", "adult_head_body_len_mm", "float"),
    ("9-1_GestationLen_d", "gestation_days", "float"),
    ("15-1_LitterSize", "litter_size", "float"),
    ("16-1_LittersPerYear", "litters_per_year", "float"),
    ("17-1_MaxLongevity_m", "max_longevity_months", "float"),
    ("25-1_WeaningAge_d", "weaning_age_days", "float"),
    ("5-3_NeonateBodyMass_g", "neonate_body_mass_g", "float"),
    ("23-1_SexualMaturityAge_d", "sexual_maturity_age_days", "float"),
    ("6-1_DietBreadth", "diet_breadth", "int"),
    ("12-1_HabitatBreadth", "habitat_breadth", "int"),
    ("6-2_TrophicLevel", "trophic_level", "int"),
    ("22-1_HomeRange_km2", "home_range_km2", "float"),
    ("21-1_PopulationDensity_n/km2", "pop_density_per_km2", "float"),
    ("26-1_GR_Area_km2", "geog_range_km2", "float"),
]

MISSING = {"-999.00", "-999", ""}


def coerce(value: str, kind: str):
    if value in MISSING:
        return None
    if kind == "float":
        return float(value)
    if kind == "int":
        return int(float(value))
    return value


def clean(raw_path: Path, out_dir: Path) -> None:
    with raw_path.open(encoding="latin-1", newline="") as fh:
        reader = csv.DictReader(fh, delimiter="\t")
        src_fields = reader.fieldnames or []
        missing_cols = [s for s, _, _ in COLUMNS if s not in src_fields]
        if missing_cols:
            raise SystemExit(f"missing source columns: {missing_cols}")

        rows = []
        for row in reader:
            cleaned = {}
            for src, dst, kind in COLUMNS:
                cleaned[dst] = coerce(row[src], kind)
            if cleaned["adult_body_mass_g"] is None:
                continue
            rows.append(cleaned)

    out_dir.mkdir(parents=True, exist_ok=True)
    csv_path = out_dir / "pantheria_mammals.csv"
    json_path = out_dir / "pantheria_mammals.json"

    with csv_path.open("w", newline="") as fh:
        writer = csv.DictWriter(fh, fieldnames=[dst for _, dst, _ in COLUMNS])
        writer.writeheader()
        for r in rows:
            writer.writerow({k: ("" if v is None else v) for k, v in r.items()})

    with json_path.open("w") as fh:
        json.dump(rows, fh, separators=(",", ":"))

    print(f"wrote {len(rows)} rows → {csv_path.name}, {json_path.name}")


if __name__ == "__main__":
    raw = Path(sys.argv[1]) if len(sys.argv) > 1 else RAW_DEFAULT
    clean(raw, OUT_DIR)
