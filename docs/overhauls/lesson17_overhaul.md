# Lesson 17 — identical-by-descent blocks, haplotypes, runs of homozygosity (slot pencilled: JM "17(?)")

**File** · `app/lessons/lesson17.html` — not started
**Checks** · `node scripts/check_lesson17_numbers.js` (to write) · `python3 scripts/check_lessons.py`
**Status** · brief only (JM, 2026-10-01); nothing built
**Last touched** · 2026-10-01

## What the lesson is

- JM, 2026-10-01: *"17(?) identical by descent blocks, haplotypes, runs of homozygosity"*.
- After 15's coalescence (the snake game) and 16's mutation: a block identical by descent is two copies whose common ancestor is recent at that stretch of chromosome; a run of homozygosity is such a block inside one individual.

## What earlier lessons hand it (sources, not constraints)

- `app/interactives/descent.html`: one pedigree, coalescence by position (`coalesceAt`); its own comment: *"Identity by descent and coalescence are the same fact read in two directions: the stretches where two chromosomes meet an ancestor are IBD, and how far back they meet is the coalescence. Recombination is what splits a chromosome into stretches with different answers"*.
- 11: F, inbreeding, heterozygosity falling (a run of homozygosity is F read along a chromosome).
- 14 B/C: haplotype pictures (rows of chromosomes, rarer allele dark), the stretch two carriers share around a sweep (an IBD block made fast by selection).
- 14's overhaul doc, "Do not": *"Treat a long homozygous stretch as proof of selection: drift makes one too, genome-wide."*
- Real data: `scripts/fetch_1000g_region.py` fetches phased 1000 Genomes regions with no installs (used for 14 B's lactase scan). Runs of homozygosity need long stretches per individual: whether a region fetch is enough is to measure.

## Items

| # | Stage | What | Status |
|---|-------|------|--------|
| 1 | — | stages with JM | todo |
