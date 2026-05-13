#!/usr/bin/env python3
"""Clean Beren and Cyrus event logs into a long-format growth-trajectory file.

Input: data/raw/new/{beren,cyrus}.csv (event logs in chronological order, with
       trait_mass / trait_length / trait_head_circum rows mixed in among other
       events). Re-run this script after adding new measurements to the raw
       CSVs and the cleaned derivative will refresh.

Output: data/clean/kids_growth.{csv,json}

Long format columns:
    kid, date, day_of_life, age_years, measure, value, units,
    on_antibiotic, sick_proxy

`on_antibiotic` is True if any antibiotic event (amoxicilin, predisolone) is
logged within ±7 days of the measurement. `sick_proxy` is True if any of
{tylenol, temperature, amoxicilin, predisolone} appears within ±7 days. These
are heuristics for the L3 "biased measurement" story; treat as approximate.
"""

import csv
import json
import sys
from datetime import date, timedelta
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
RAW = ROOT / "data" / "raw" / "new"
CLEAN = ROOT / "data" / "clean"

TRAIT_EVENTS = {"trait_mass", "trait_length", "traint_length", "trait_head_circum"}
ANTIBIOTIC_EVENTS = {"amoxicilin", "predisolone"}
SICK_EVENTS = {"amoxicilin", "predisolone", "tylenol", "temperature"}

# Normalize the obvious typo in cyrus.csv
EVENT_RENAME = {"traint_length": "trait_length"}


def parse_rows(path: Path):
    """Read an event-log CSV, return list of dicts with a `date` field (date object)."""
    with path.open(encoding="utf-8-sig") as f:
        rows = list(csv.DictReader(f))
    out = []
    for r in rows:
        try:
            d = date(int(r["year"]), int(r["month"]), int(r["day"]))
        except (ValueError, KeyError):
            continue
        rr = {**r, "_date": d, "event": EVENT_RENAME.get(r["event"], r["event"])}
        out.append(rr)
    return out


def has_event_in_window(rows, target_date: date, event_set, days: int):
    lo, hi = target_date - timedelta(days=days), target_date + timedelta(days=days)
    return any(lo <= r["_date"] <= hi and r["event"] in event_set for r in rows)


def process_kid(kid_name: str, raw_path: Path, birth_date_fallback=None):
    rows = parse_rows(raw_path)
    birth = next((r["_date"] for r in rows if r["event"] == "birth"), birth_date_fallback)
    if birth is None:
        print(f"warning: no birth event for {kid_name}, skipping")
        return []
    out = []
    for r in rows:
        if r["event"] not in TRAIT_EVENTS:
            continue
        v = r.get("value", "").strip()
        if not v:
            continue
        try:
            value = float(v)
        except ValueError:
            continue
        d = r["_date"]
        dol = (d - birth).days
        out.append({
            "kid": kid_name,
            "date": d.isoformat(),
            "day_of_life": dol,
            "age_years": round(dol / 365.25, 3),
            "measure": EVENT_RENAME.get(r["event"], r["event"]).replace("trait_", ""),
            "value": value,
            "units": r.get("units", "").strip(),
            "on_antibiotic": has_event_in_window(rows, d, ANTIBIOTIC_EVENTS, 7),
            "sick_proxy": has_event_in_window(rows, d, SICK_EVENTS, 7),
        })
    out.sort(key=lambda x: (x["kid"], x["day_of_life"], x["measure"]))
    return out


def main():
    all_rows = []
    all_rows.extend(process_kid("beren", RAW / "beren.csv"))
    all_rows.extend(process_kid("cyrus", RAW / "cyrus.csv"))
    if not all_rows:
        print("No measurements parsed; aborting.")
        sys.exit(1)

    fieldnames = list(all_rows[0].keys())
    out_csv = CLEAN / "kids_growth.csv"
    out_json = CLEAN / "kids_growth.json"
    with out_csv.open("w", newline="") as f:
        w = csv.DictWriter(f, fieldnames=fieldnames)
        w.writeheader()
        w.writerows(all_rows)
    with out_json.open("w") as f:
        json.dump(all_rows, f)

    by_kid = {}
    by_measure = {}
    for r in all_rows:
        by_kid[r["kid"]] = by_kid.get(r["kid"], 0) + 1
        by_measure[r["measure"]] = by_measure.get(r["measure"], 0) + 1
    print(f"Wrote {out_csv.relative_to(ROOT)} ({len(all_rows)} measurements).")
    print(f"By kid: {by_kid}")
    print(f"By measure: {by_measure}")
    print(f"Sick-proxy flagged: {sum(1 for r in all_rows if r['sick_proxy'])} of {len(all_rows)}")


if __name__ == "__main__":
    main()
