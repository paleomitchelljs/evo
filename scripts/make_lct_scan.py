#!/usr/bin/env python3
"""Build data/clean/lct_scan.json for lesson 14 B: lactase, 1000 Genomes phase 3.

Streams chr2:134.5-138.7 Mb (GRCh37) from the EBI server with the reader in
fetch_1000g_region.py (no htslib), one BGZF block at a time, and keeps:

  windows   21 windows of 200 kb centred on rs4988235 (the -13910 C/T variant
            upstream of LCT, chr2:136,608,646; A on the + strand = T, lactase
            persistence) at offsets -2.0 ... +2.0 Mb: the sum of 2pq over
            biallelic SNPs per kb, for CEU (Utah residents, northern and
            western European ancestry) and YRI (Yoruba, Nigeria), and their ratio
  haps      the site and 100 marker SNPs, one per 40 kb bin across the 4 Mb
            (the SNP nearest each bin's centre with YRI minor allele frequency
            at least 0.2, so markers are chosen as varied in the population
            without the sweep, as the simulation's are at its start), and every
            CEU haplotype at them: rows of 0/1 strings
  carriers  the T frequency in CEU and YRI
  background  the same CEU/YRI ratio over three distant 500 kb stretches of
            chromosome 2 (120.0, 133.0 and 139.5 Mb: 16.6, 3.6 and 2.9 Mb from
            the site), standing for the rest of the genome

    python3 scripts/make_lct_scan.py            # writes data/clean/lct_scan.json

40 kb per gap is lesson 14 B's chromosome: 100 gaps, one crossover in 2,000
meioses per gap, about 1.25 cM/Mb.
"""
import json, os, struct, sys, zlib
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from fetch_1000g_region import BASE, NAME, fetch, linear_index, inflate

CHROM, SITE = "2", 136608646
HALF, GAP, WIN = 2_100_000, 40_000, 200_000
BEG, END = SITE - HALF, SITE + HALF
OUT = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "data", "clean", "lct_scan.json")


def stream_lines(url, c0, c1, skip):
    """Yield VCF lines from byte range c0..c1, decompressing block by block."""
    data = fetch(url, c0, c1)
    p, tail, first = 0, b"", True
    while p + 18 <= len(data) and data[p:p + 4] == b"\x1f\x8b\x08\x04":
        xlen, = struct.unpack_from("<H", data, p + 10)
        q, bsize = p + 12, None
        while q < p + 12 + xlen:
            if data[q] == 66 and data[q + 1] == 67:
                bsize, = struct.unpack_from("<H", data, q + 4)
            q += 4 + struct.unpack_from("<H", data, q + 2)[0]
        if bsize is None or p + bsize + 1 > len(data):
            break
        chunk = zlib.decompress(data[p + 12 + xlen:p + bsize + 1 - 8], -15)
        p += bsize + 1
        if first:
            chunk, first = chunk[skip:], False
        buf = tail + chunk
        lines = buf.split(b"\n")
        tail = lines.pop()
        yield from lines
    if tail:
        yield tail


BACKGROUND = [(120_000_000, 120_500_000), (133_000_000, 133_500_000), (139_500_000, 140_000_000)]


def region_2pq(url, lin, beg, end, ceu, yri):
    """Sum of 2pq over biallelic SNPs in [beg, end] for CEU and YRI."""
    v0, v1 = lin[beg >> 14], lin[min((end >> 14) + 1, len(lin) - 1)]
    sc = sy = 0.0
    for line in stream_lines(url, v0 >> 16, (v1 >> 16) + 65536, v0 & 0xFFFF):
        t = line.split(b"\t", 9)
        if len(t) < 10 or not t[1].isdigit():
            continue
        pos = int(t[1])
        if pos < beg:
            continue
        if pos > end:
            break
        if len(t[3]) != 1 or len(t[4]) != 1 or b"VT=SNP" not in t[7]:
            continue
        gts = t[9].split(b"\t")
        for idx, add in ((ceu, 0), (yri, 1)):
            k = sum(gts[i][0:1] == b"1" for i in idx) + sum(gts[i][2:3] == b"1" for i in idx)
            p = k / (2 * len(idx))
            if add == 0: sc += 2 * p * (1 - p)
            else: sy += 2 * p * (1 - p)
    return sc, sy


def main():
    url = BASE + NAME.format(c=CHROM)
    lin = linear_index(fetch(url + ".tbi"), CHROM)
    v0, v1 = lin[BEG >> 14], lin[min((END >> 14) + 1, len(lin) - 1)]
    c0, c1 = v0 >> 16, (v1 >> 16) + 65536
    print(f"fetching {(c1 - c0) / 1e6:.1f} MB", file=sys.stderr)
    header = next(l for l in inflate(fetch(url, 0, 1 << 20)).split(b"\n") if l.startswith(b"#CHROM"))
    samples = header.decode().split("\t")[9:]
    panel = {}
    for l in fetch(BASE + "integrated_call_samples_v3.20130502.ALL.panel").decode().splitlines()[1:]:
        t = l.split()
        panel[t[0]] = t[1]
    ceu = [i for i, s in enumerate(samples) if panel.get(s) == "CEU"]
    yri = [i for i, s in enumerate(samples) if panel.get(s) == "YRI"]
    n_win = 2 * (HALF - WIN // 2) // WIN + 1          # 21
    win = {"CEU": [0.0] * n_win, "YRI": [0.0] * n_win}
    n_bin = 2 * (2_000_000 // GAP) + 1                 # 101 bins over +-2 Mb, the site's at the centre
    best = [None] * n_bin                               # (distance to bin centre, pos, CEU haplotypes)
    site_row, n_snp = None, 0
    for line in stream_lines(url, c0, c1, v0 & 0xFFFF):
        t = line.split(b"\t", 9)
        if len(t) < 10 or not t[1].isdigit():
            continue
        pos = int(t[1])
        if pos < BEG:
            continue
        if pos > END:
            break
        if len(t[3]) != 1 or len(t[4]) != 1 or b"VT=SNP" not in t[7]:
            continue
        gts = t[9].split(b"\t")
        def haps(idx):
            out = bytearray()
            for i in idx:
                g = gts[i]
                out += g[0:1] + g[2:3]
            return out
        hc, hy = haps(ceu), haps(yri)
        pc = (hc.count(b"1"[0])) / len(hc)
        py = (hy.count(b"1"[0])) / len(hy)
        n_snp += 1
        k = round((pos - SITE) / WIN) + n_win // 2
        if 0 <= k < n_win and abs(pos - SITE - (k - n_win // 2) * WIN) <= WIN // 2:
            win["CEU"][k] += 2 * pc * (1 - pc)
            win["YRI"][k] += 2 * py * (1 - py)
        if pos == SITE:
            site_row = hc.decode()
            t_freq = {"CEU": pc, "YRI": py}
            continue
        b = round((pos - SITE) / GAP) + n_bin // 2
        if 0 <= b < n_bin and b != n_bin // 2 and min(py, 1 - py) >= 0.2:
            d = abs(pos - SITE - (b - n_bin // 2) * GAP)
            if best[b] is None or d < best[b][0]:
                best[b] = (d, pos, hc.decode())
    if site_row is None:
        raise SystemExit("rs4988235 not found")
    bg = []
    for beg, end in BACKGROUND:
        sc, sy = region_2pq(url, lin, beg, end, ceu, yri)
        bg.append({"from_mb": beg / 1e6, "to_mb": end / 1e6, "ceu_per_kb": round(sc / 500, 4), "yri_per_kb": round(sy / 500, 4), "ratio": round(sc / sy, 4)})
    kb = WIN / 1000
    windows = [{"offset_mb": round((k - n_win // 2) * WIN / 1e6, 2),
                "ceu_per_kb": round(win["CEU"][k] / kb, 4), "yri_per_kb": round(win["YRI"][k] / kb, 4),
                "ratio": round(win["CEU"][k] / win["YRI"][k], 4)} for k in range(n_win)]
    cols = [(b, best[b]) for b in range(n_bin) if b != n_bin // 2 and best[b] is not None]
    nh = len(site_row)
    rows = []
    for h in range(nh):
        rows.append("".join(c[1][2][h] if c[0] != n_bin // 2 else "" for c in cols))
    out = {
        "meta": {
            "source": "1000 Genomes Project phase 3 (GRCh37), release 20130502, chr2; read by HTTP range request from ftp.1000genomes.ebi.ac.uk",
            "built_by": "scripts/make_lct_scan.py",
            "site": {"rsid": "rs4988235", "pos": SITE, "allele": "A on the + strand = T at -13910 upstream of LCT, lactase persistence"},
            "populations": {"CEU": "Utah residents, northern and western European ancestry (99 people)", "YRI": "Yoruba in Ibadan, Nigeria (108 people)"},
            "windows": "200 kb windows centred on the site; sum of 2pq over biallelic SNPs per kb",
            "haps": "every CEU haplotype at the site and at one marker SNP per 40 kb bin (nearest the bin centre, YRI minor allele frequency >= 0.2); 1 = ALT",
            "snps_read": n_snp,
        },
        "t_freq": {k: round(v, 4) for k, v in t_freq.items()},
        "background": bg,
        "windows": windows,
        "marker_bins": [b - n_bin // 2 for b, _ in cols],
        "marker_pos": [c[1][1] for c in cols],
        "site_haps": site_row,
        "haps": rows,
    }
    with open(OUT, "w") as f:
        json.dump(out, f, separators=(",", ":"))
    print(f"{n_snp} SNPs; {len(cols)} marker bins filled of {n_bin - 1}; {nh} CEU haplotypes; T in CEU {t_freq['CEU']:.3f}, YRI {t_freq['YRI']:.3f} -> {OUT}", file=sys.stderr)
    for b in bg:
        print(f"background {b['from_mb']}-{b['to_mb']} Mb: ratio {b['ratio']:.2f}", file=sys.stderr)
    for w in windows:
        print(f"{w['offset_mb']:+5.1f} Mb  CEU {w['ceu_per_kb']:.2f}  YRI {w['yri_per_kb']:.2f}  ratio {w['ratio']:.2f}", file=sys.stderr)


if __name__ == "__main__":
    main()
