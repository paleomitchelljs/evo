#!/usr/bin/env python3
"""Fetch one region of a 1000 Genomes phase 3 VCF without htslib or pysam.

Reads the tabix index's linear index, asks the EBI FTP server for one byte range
of the BGZF file, inflates it block by block and keeps the lines inside the region.
Written for lesson 14 B (lactase): chr2:136.0-137.2 Mb is a 6.7 MB download.

    python3 scripts/fetch_1000g_region.py 2 136000000 137200000 out.vcf

The output is the region's VCF body lines with a #CHROM header line first, so the
sample columns can be matched to the panel file
(integrated_call_samples_v3.20130502.ALL.panel, same directory on the server).
Coordinates are GRCh37.
"""
import gzip, io, struct, subprocess, sys, urllib.request, zlib

BASE = "https://ftp.1000genomes.ebi.ac.uk/vol1/ftp/release/20130502/"
NAME = "ALL.chr{c}.phase3_shapeit2_mvncall_integrated_v5b.20130502.genotypes.vcf.gz"


def fetch(url, lo=None, hi=None):
    args = ["curl", "-s", "--fail"] + (["-r", f"{lo}-{hi}"] if lo is not None else []) + [url]
    return subprocess.run(args, capture_output=True, check=True).stdout


def inflate(data):
    """Every complete BGZF block in data, decompressed and joined."""
    out, p = io.BytesIO(), 0
    while p + 18 <= len(data) and data[p:p + 4] == b"\x1f\x8b\x08\x04":
        xlen, = struct.unpack_from("<H", data, p + 10)
        q, bsize = p + 12, None
        while q < p + 12 + xlen:
            if data[q] == 66 and data[q + 1] == 67:
                bsize, = struct.unpack_from("<H", data, q + 4)
            q += 4 + struct.unpack_from("<H", data, q + 2)[0]
        if bsize is None or p + bsize + 1 > len(data):
            break
        out.write(zlib.decompress(data[p + 12 + xlen:p + bsize + 1 - 8], -15))
        p += bsize + 1
    return out.getvalue()


def linear_index(tbi, chrom):
    raw, o = gzip.decompress(tbi), 4
    n_ref, _, _, _, _, _, _, l_nm = struct.unpack_from("<8i", raw, o); o += 32
    names = raw[o:o + l_nm].split(b"\0")[:-1]; o += l_nm
    for ref in range(n_ref):
        n_bin, = struct.unpack_from("<i", raw, o); o += 4
        for _ in range(n_bin):
            _, n_chunk = struct.unpack_from("<Ii", raw, o); o += 8 + 16 * n_chunk
        n_intv, = struct.unpack_from("<i", raw, o); o += 4
        ioff = struct.unpack_from(f"<{n_intv}Q", raw, o); o += 8 * n_intv
        if names[ref].decode() == chrom:
            return ioff
    raise SystemExit(f"{chrom} not in index")


def main(chrom, beg, end, out_path):
    url = BASE + NAME.format(c=chrom)
    lin = linear_index(fetch(url + ".tbi"), chrom)
    v0, v1 = lin[beg >> 14], lin[min((end >> 14) + 1, len(lin) - 1)]
    c0, c1 = v0 >> 16, (v1 >> 16) + 65536
    print(f"chr{chrom}: bytes {c0}-{c1} ({(c1 - c0) / 1e6:.1f} MB)", file=sys.stderr)
    body = inflate(fetch(url, c0, c1))[v0 & 0xFFFF:]
    header = next(l for l in inflate(fetch(url, 0, 1 << 20)).split(b"\n") if l.startswith(b"#CHROM"))
    n = 0
    with open(out_path, "wb") as f:
        f.write(header + b"\n")
        for line in body.split(b"\n"):
            t = line.split(b"\t", 2)
            if len(t) < 3 or not t[1].isdigit():
                continue
            pos = int(t[1])
            if pos < beg:
                continue
            if pos > end:
                break
            f.write(line + b"\n"); n += 1
    print(f"{n} variant lines -> {out_path}", file=sys.stderr)


if __name__ == "__main__":
    if len(sys.argv) != 5:
        raise SystemExit(__doc__)
    main(sys.argv[1], int(sys.argv[2]), int(sys.argv[3]), sys.argv[4])
