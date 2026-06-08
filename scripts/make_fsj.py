"""Clean Chen et al. Florida Scrub-Jay data into lesson-ready CSV + JSON.

Source: figshare 10.6084/m9.figshare.7044368 (Chen et al.,
"Allele frequency dynamics in a pedigreed natural population", 2019).

Expected inputs (all from the figshare dump):
    FSJpedgeno2018.ped   PLINK .ped with 10,731 biallelic SNPs, 6,936 indivs
    IndivList.txt        per-year cohort membership (year, indiv, category)
    IndivData.txt        per-individual natal year / immigrant cohort
    SNPlist.txt          SNP → chromosome

Outputs (under data/clean/):
    fsj_cohort_sizes.csv     year × category → n_indiv (small, ready for use)
    fsj_allele_freq.csv      long-format: year, snp, chr, n_chroms_total,
                             freq_total, n_chroms_nestling, freq_nestling.
                             CSV only — the full long format is ~250k rows, too
                             large to ship as browser-loaded JSON.
    fsj_allele_freq_subset.csv/.json
                             ~250 SNPs with genome-wide coverage, starting
                             frequency in [0.1, 0.9], genotyped in most years
                             — small enough to load in the browser for the
                             drift lesson (lesson11 fetches the .json and
                             averages 2·freq_total·(1−freq_total) per year)

Alleles in the .ped are coded 1/2 with 0 denoting missing. We tally the
count of "allele 2" copies per individual, restrict to individuals in
IndivList with Genotyped=Y, and sum across all indivs present in a given
year (total) and across nestlings only (new cohort that year).
"""

from __future__ import annotations

import csv
import json
import random
import sys
from collections import defaultdict
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
RAW_DIR_DEFAULT = Path("/tmp/chen_fsj")
OUT_DIR = REPO / "data" / "clean"

N_SNPS = 10731
START_YEAR = 1990
END_YEAR = 2013
SUBSET_TARGET = 250
SUBSET_SEED = 202


def load_indiv_list(path: Path) -> tuple[dict[str, list[tuple[int, str]]], dict[int, dict[str, int]]]:
    """Return {indiv → [(year, category), ...]} for genotyped indivs,
    plus cohort-size table {year → {category → n_indiv}}."""
    by_indiv: dict[str, list[tuple[int, str]]] = defaultdict(list)
    cohort: dict[int, dict[str, int]] = defaultdict(lambda: defaultdict(int))
    with path.open() as fh:
        reader = csv.DictReader(fh, delimiter="\t")
        for row in reader:
            year = int(row["Year"])
            indiv = row["Indiv"]
            cat = row["Category"]
            cohort[year][cat] += 1
            if row["Genotyped"].strip().upper() == "Y":
                by_indiv[indiv].append((year, cat))
    return by_indiv, cohort


def load_snp_chromosomes(path: Path) -> list[str]:
    """Return [chr_for_snp_1, chr_for_snp_2, ...] indexed 0 .. N_SNPS-1."""
    chrs: list[str] = []
    with path.open() as fh:
        reader = csv.DictReader(fh, delimiter="\t")
        for row in reader:
            chrs.append(row["Chr"])
    if len(chrs) != N_SNPS:
        raise SystemExit(f"SNPlist has {len(chrs)} rows, expected {N_SNPS}")
    return chrs


def tally(ped_path: Path, by_indiv: dict[str, list[tuple[int, str]]]):
    """Stream the .ped. For each (year, snp) tally allele-2 copies and
    non-missing chromosome counts, for 'total' (any category) and
    'nestling' (new cohort that year)."""
    shape = (END_YEAR - START_YEAR + 1, N_SNPS)
    alt_total = [[0] * N_SNPS for _ in range(shape[0])]
    n_total = [[0] * N_SNPS for _ in range(shape[0])]
    alt_nest = [[0] * N_SNPS for _ in range(shape[0])]
    n_nest = [[0] * N_SNPS for _ in range(shape[0])]

    with ped_path.open() as fh:
        for line_no, line in enumerate(fh, start=1):
            parts = line.split()
            if len(parts) < 6 + 2 * N_SNPS:
                raise SystemExit(f"short line {line_no}: {len(parts)} cols")
            indiv = parts[1]
            memberships = by_indiv.get(indiv)
            if not memberships:
                continue

            # Per-SNP allele-2 count for this individual (None if missing).
            geno = []
            base = 6
            for s in range(N_SNPS):
                a1 = parts[base + 2 * s]
                a2 = parts[base + 2 * s + 1]
                if a1 == "0" or a2 == "0":
                    geno.append(None)
                else:
                    geno.append((a1 == "2") + (a2 == "2"))

            for year, cat in memberships:
                y = year - START_YEAR
                for s, g in enumerate(geno):
                    if g is None:
                        continue
                    alt_total[y][s] += g
                    n_total[y][s] += 2
                    if cat == "nestling":
                        alt_nest[y][s] += g
                        n_nest[y][s] += 2

            if line_no % 500 == 0:
                print(f"  processed {line_no} individuals", file=sys.stderr)

    return alt_total, n_total, alt_nest, n_nest


def write_outputs(chrs, alt_t, n_t, alt_n, n_n, cohort, out_dir: Path) -> None:
    out_dir.mkdir(parents=True, exist_ok=True)

    cohort_path = out_dir / "fsj_cohort_sizes.csv"
    cohort_rows = []
    with cohort_path.open("w", newline="") as fh:
        writer = csv.writer(fh)
        writer.writerow(["year", "category", "n_indiv"])
        for year in sorted(cohort):
            for cat in ("founder", "survivor", "immigrant", "nestling"):
                n = cohort[year].get(cat, 0)
                writer.writerow([year, cat, n])
                cohort_rows.append({"year": year, "category": cat, "n_indiv": n})
    (out_dir / "fsj_cohort_sizes.json").write_text(
        json.dumps(cohort_rows, separators=(",", ":"))
    )

    full_rows = []
    for y in range(END_YEAR - START_YEAR + 1):
        year = START_YEAR + y
        for s in range(N_SNPS):
            nt = n_t[y][s]
            nn = n_n[y][s]
            full_rows.append(
                {
                    "year": year,
                    "snp": s + 1,
                    "chr": chrs[s],
                    "n_chroms_total": nt,
                    "freq_total": (alt_t[y][s] / nt) if nt else None,
                    "n_chroms_nestling": nn,
                    "freq_nestling": (alt_n[y][s] / nn) if nn else None,
                }
            )

    full_path = out_dir / "fsj_allele_freq.csv"
    with full_path.open("w", newline="") as fh:
        writer = csv.DictWriter(
            fh,
            fieldnames=[
                "year", "snp", "chr",
                "n_chroms_total", "freq_total",
                "n_chroms_nestling", "freq_nestling",
            ],
        )
        writer.writeheader()
        for r in full_rows:
            writer.writerow({k: ("" if v is None else v) for k, v in r.items()})

    # Lesson-sized subset: SNPs with a known chromosome, starting freq in
    # [0.1, 0.9] in the earliest year with ≥50 chromosomes observed, and
    # non-missing freq_total in every year thereafter.
    def snp_series(snp_idx: int):
        return [
            full_rows[y * N_SNPS + snp_idx] for y in range(END_YEAR - START_YEAR + 1)
        ]

    eligible = []
    for s in range(N_SNPS):
        if chrs[s] == "Un":
            continue
        series = snp_series(s)
        first = next(
            (
                r for r in series
                if r["n_chroms_total"] and r["n_chroms_total"] >= 50
            ),
            None,
        )
        if first is None:
            continue
        p0 = first["freq_total"]
        if not (0.1 <= p0 <= 0.9):
            continue
        later = [r for r in series if r["year"] >= first["year"]]
        if any(r["freq_total"] is None for r in later):
            continue
        eligible.append(s)

    rng = random.Random(SUBSET_SEED)
    if len(eligible) > SUBSET_TARGET:
        eligible = sorted(rng.sample(eligible, SUBSET_TARGET))

    subset_rows = [r for s in eligible for r in snp_series(s)]
    subset_csv = out_dir / "fsj_allele_freq_subset.csv"
    with subset_csv.open("w", newline="") as fh:
        writer = csv.DictWriter(
            fh,
            fieldnames=[
                "year", "snp", "chr",
                "n_chroms_total", "freq_total",
                "n_chroms_nestling", "freq_nestling",
            ],
        )
        writer.writeheader()
        for r in subset_rows:
            writer.writerow({k: ("" if v is None else v) for k, v in r.items()})
    (out_dir / "fsj_allele_freq_subset.json").write_text(
        json.dumps(subset_rows, separators=(",", ":"))
    )

    print(
        f"wrote {len(full_rows)} rows → fsj_allele_freq.csv, "
        f"{len(subset_rows)} rows ({len(eligible)} SNPs) → fsj_allele_freq_subset.csv"
    )


def main(raw_dir: Path, out_dir: Path) -> None:
    print("loading IndivList …", file=sys.stderr)
    by_indiv, cohort = load_indiv_list(raw_dir / "IndivList.txt")
    print(f"  {len(by_indiv)} genotyped individuals", file=sys.stderr)

    print("loading SNPlist …", file=sys.stderr)
    chrs = load_snp_chromosomes(raw_dir / "SNPlist.txt")

    print("tallying genotypes …", file=sys.stderr)
    alt_t, n_t, alt_n, n_n = tally(raw_dir / "FSJpedgeno2018.ped", by_indiv)

    print("writing outputs …", file=sys.stderr)
    write_outputs(chrs, alt_t, n_t, alt_n, n_n, cohort, out_dir)


if __name__ == "__main__":
    raw = Path(sys.argv[1]) if len(sys.argv) > 1 else RAW_DIR_DEFAULT
    main(raw, OUT_DIR)
