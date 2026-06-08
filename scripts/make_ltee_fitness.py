"""Clean Wiser, Ribeck & Lenski (2013) LTEE fitness data into a
lesson-ready CSV + JSON.

Source: Dryad doi:10.5061/dryad.0hc2m. Dryad now serves files behind a
JavaScript challenge, so fetch is manual:

    1. Visit https://datadryad.org/stash/dataset/doi:10.5061/dryad.0hc2m
    2. Click "Download dataset" (or grab the individual CSVs).
    3. Drop `Concatenated.LTEE.data.all.csv` (and optionally
       `Concatenated.40k.v.50k.csv`) into /tmp/wiser_ltee/ or pass the
       path as this script's first argument.

The main file contains per-competition fitness measurements across 12
LTEE populations at many time points up to generation 50,000. We emit
a tidy long-format table (one row per competition assay) plus a
generation-level summary (mean fitness and SE by population × generation).

We do not assume exact column names — we detect them, log a schema to
stderr, and fail loudly if expected fields are absent. This keeps the
script tolerant to Dryad formatting quirks.
"""

from __future__ import annotations

import csv
import json
import statistics
import sys
from collections import defaultdict
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
RAW_DEFAULT = REPO / "data" / "raw" / "Concatenated.LTEE.data.all.csv"
OUT_DIR = REPO / "data" / "clean"

# Known column aliases from the README and prior analyses of this file.
# The Dryad README documents column names; we accept a few casings.
ALIASES = {
    "population": {"Population", "population", "Pop"},
    "generation": {"Generation", "generation", "Gen"},
    "fitness": {"Fitness", "fitness", "W", "Relative Fitness"},
    "replicate": {"Replicate", "replicate", "Rep"},
    "red_white": {"RedWhite", "Red.White", "RW", "Marker"},
    "mutator_ever": {"Mutator.Ever", "MutatorEver", "Mutator"},
    "complete": {"Complete"},
}


def detect(header: list[str]) -> dict[str, str]:
    found: dict[str, str] = {}
    for canon, names in ALIASES.items():
        for n in names:
            if n in header:
                found[canon] = n
                break
    missing = [k for k in ("population", "generation", "fitness") if k not in found]
    if missing:
        raise SystemExit(
            f"expected columns not found: {missing}. Header was: {header}"
        )
    return found


def clean(raw_path: Path, out_dir: Path) -> None:
    with raw_path.open(encoding="utf-8-sig", newline="") as fh:
        reader = csv.DictReader(fh)
        col_map = detect(reader.fieldnames or [])
        print(f"detected columns: {col_map}", file=sys.stderr)

        rows = []
        for r in reader:
            pop = r[col_map["population"]].strip()
            gen_raw = r[col_map["generation"]].strip()
            w_raw = r[col_map["fitness"]].strip()
            if not pop or not gen_raw or not w_raw:
                continue
            try:
                gen = int(float(gen_raw))
                w = float(w_raw)
            except ValueError:
                continue
            row = {"population": pop, "generation": gen, "fitness": w}
            if "replicate" in col_map:
                row["replicate"] = r[col_map["replicate"]].strip()
            if "red_white" in col_map:
                row["red_white"] = r[col_map["red_white"]].strip()
            if "mutator_ever" in col_map:
                row["mutator_ever"] = r[col_map["mutator_ever"]].strip()
            if "complete" in col_map:
                row["complete"] = r[col_map["complete"]].strip()
            rows.append(row)

    out_dir.mkdir(parents=True, exist_ok=True)
    assays_csv = out_dir / "ltee_fitness_assays.csv"
    assays_json = out_dir / "ltee_fitness_assays.json"
    field_order = ["population", "generation", "fitness"]
    for optional in ("replicate", "red_white", "mutator_ever", "complete"):
        if any(optional in r for r in rows):
            field_order.append(optional)

    with assays_csv.open("w", newline="") as fh:
        writer = csv.DictWriter(fh, fieldnames=field_order)
        writer.writeheader()
        for r in rows:
            writer.writerow({k: r.get(k, "") for k in field_order})

    with assays_json.open("w") as fh:
        json.dump(rows, fh, separators=(",", ":"))

    # Per-population, per-generation summary.
    grouped: dict[tuple[str, int], list[float]] = defaultdict(list)
    for r in rows:
        grouped[(r["population"], r["generation"])].append(r["fitness"])

    summary_rows = []
    for (pop, gen), vs in sorted(grouped.items()):
        n = len(vs)
        mean = statistics.fmean(vs)
        sd = statistics.stdev(vs) if n > 1 else 0.0
        se = sd / (n ** 0.5) if n > 1 else 0.0
        summary_rows.append(
            {
                "population": pop,
                "generation": gen,
                "mean_fitness": mean,
                "sd_fitness": sd,
                "se_fitness": se,
                "n": n,
            }
        )

    summary_csv = out_dir / "ltee_fitness_summary.csv"
    with summary_csv.open("w", newline="") as fh:
        writer = csv.DictWriter(
            fh,
            fieldnames=["population", "generation", "mean_fitness",
                        "sd_fitness", "se_fitness", "n"],
        )
        writer.writeheader()
        for r in summary_rows:
            writer.writerow(r)

    (out_dir / "ltee_fitness_summary.json").write_text(
        json.dumps(summary_rows, separators=(",", ":"))
    )

    print(
        f"wrote {len(rows)} assays → ltee_fitness_assays.csv, "
        f"{len(summary_rows)} (pop × gen) rows → ltee_fitness_summary.csv"
    )


if __name__ == "__main__":
    raw = Path(sys.argv[1]) if len(sys.argv) > 1 else RAW_DEFAULT
    if not raw.exists():
        raise SystemExit(
            f"input not found: {raw}\n"
            "Dryad requires a manual download — see this script's docstring."
        )
    clean(raw, OUT_DIR)
