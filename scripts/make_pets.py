"""Clean the PETS (Paleontological Evolutionary Time Series) export into
lesson-ready CSV + JSON.

Source: <https://pets.nhm.uio.no/PETS/> — the "Download selected time
series" tab produces two files, which should be placed under
`data/timeseries/`:

    metadata.txt    1,400 series × 31 columns, tab-delimited
    timeseries.csv  ~20,000 observations, semicolon-delimited, European
                    decimals in the age column (e.g. "0,00315" for
                    3.15 kyr)

Outputs (under data/clean/):

    pets_series_metadata.csv / .json   series-level metadata
    pets_timeseries.csv / .json        long-format trait observations
                                       (N, trait_mean, trait_var, age_MY,
                                       tsID, age_MY_min, age_MY_max)

Join the two on `tsID` for lesson use. Trait means use period decimals
in the source; ages use comma decimals — we normalise both to period.
"""

from __future__ import annotations

import csv
import json
import sys
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
RAW_DIR_DEFAULT = REPO / "data" / "timeseries"
OUT_DIR = REPO / "data" / "clean"

MISSING = {"", "NA", "NaN", "na"}


def coerce_float(value: str) -> float | None:
    v = value.strip().replace(",", ".")
    if v in MISSING:
        return None
    try:
        return float(v)
    except ValueError:
        return None


def coerce_int(value: str) -> int | None:
    v = value.strip()
    if v in MISSING:
        return None
    try:
        return int(float(v))
    except ValueError:
        return None


def clean_metadata(src: Path, out_dir: Path) -> None:
    with src.open(encoding="utf-8-sig", newline="") as fh:
        reader = csv.DictReader(fh, delimiter="\t")
        rows = []
        for r in reader:
            clean = {
                k: (None if (v is None or v.strip() in MISSING) else v.strip())
                for k, v in r.items()
            }
            for f in ("total_N", "steps", "publication_year"):
                if f in clean:
                    clean[f] = coerce_int(r.get(f, ""))
            for f in ("interval_MY", "lat", "lon"):
                if f in clean:
                    clean[f] = coerce_float(r.get(f, ""))
            rows.append(clean)

    out_dir.mkdir(parents=True, exist_ok=True)
    csv_path = out_dir / "pets_series_metadata.csv"
    json_path = out_dir / "pets_series_metadata.json"
    fields = list(rows[0].keys())

    with csv_path.open("w", newline="") as fh:
        writer = csv.DictWriter(fh, fieldnames=fields)
        writer.writeheader()
        for r in rows:
            writer.writerow({k: ("" if v is None else v) for k, v in r.items()})

    with json_path.open("w") as fh:
        json.dump(rows, fh, separators=(",", ":"))

    print(f"wrote {len(rows)} series → pets_series_metadata.{{csv,json}}")


def clean_timeseries(src: Path, out_dir: Path) -> None:
    with src.open(encoding="utf-8-sig", newline="") as fh:
        reader = csv.DictReader(fh, delimiter=";")
        rows = []
        for r in reader:
            rows.append(
                {
                    "tsID": coerce_int(r.get("tsID", "")),
                    "N": coerce_int(r.get("N", "")),
                    "trait_mean": coerce_float(r.get("trait_mean", "")),
                    "trait_var": coerce_float(r.get("trait_var", "")),
                    "age_MY": coerce_float(r.get("age_MY", "")),
                    "age_MY_min": coerce_float(r.get("age_MY_min", "")),
                    "age_MY_max": coerce_float(r.get("age_MY_max", "")),
                }
            )

    out_dir.mkdir(parents=True, exist_ok=True)
    csv_path = out_dir / "pets_timeseries.csv"
    json_path = out_dir / "pets_timeseries.json"
    fields = ["tsID", "N", "trait_mean", "trait_var",
              "age_MY", "age_MY_min", "age_MY_max"]

    with csv_path.open("w", newline="") as fh:
        writer = csv.DictWriter(fh, fieldnames=fields)
        writer.writeheader()
        for r in rows:
            writer.writerow({k: ("" if v is None else v) for k, v in r.items()})

    with json_path.open("w") as fh:
        json.dump(rows, fh, separators=(",", ":"))

    print(f"wrote {len(rows)} observations → pets_timeseries.{{csv,json}}")


def main(raw_dir: Path, out_dir: Path) -> None:
    clean_metadata(raw_dir / "metadata.txt", out_dir)
    clean_timeseries(raw_dir / "timeseries.csv", out_dir)


if __name__ == "__main__":
    raw = Path(sys.argv[1]) if len(sys.argv) > 1 else RAW_DIR_DEFAULT
    main(raw, OUT_DIR)
