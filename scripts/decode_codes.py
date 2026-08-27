#!/usr/bin/env python3
r"""
decode_codes.py -- turn the codes students email in back into names, effort and
scores. The command-line counterpart to instructor/verify_code.html, meant for
the batch case: paste a semester's worth of emailed codes into a text file and
get a gradebook plus a read on whether the lesson itself worked.

A code looks like

    lesson7v2.it7fVYybpbRm-1k9PBnKk...WaLR9DSWmjBw7rQ.bd8b5a
    \_______/ \___________________________________/ \____/
     module +   XOR-encrypted payload, base64url       tamper tag
     version

and unpacks to: name, per-question right/wrong bits for the pretest, the
in-lesson checkpoints and the posttest, wall-clock and active working time, and
a per-stage count of how many times the student actually moved a control.

This file reimplements app/assets/score.js's codec in the standard library --
same SHA-256 keystream, same MAC -- so grading needs no browser and no network.
The two must agree; scripts/test_codec.py checks that they do.

Usage
-----
    python3 scripts/decode_codes.py CODE [CODE ...]      # one or a few
    python3 scripts/decode_codes.py -f codes.txt         # a file of them
    cat codes.txt | python3 scripts/decode_codes.py -     # or a pipe

    -f/--file FILE    read codes from FILE (one per line; any surrounding text
                      such as "Jane Doe <jdoe@coe.edu>: lesson3v5...." is fine,
                      the code is picked out of the line)
    --csv [OUT]       write one row per submission as CSV (default: stdout)
    --items           add the class-wide item analysis: which checkpoint did
                      what fraction of the class get right
    --salt SALT       override the project salt (default: read from score.js)
    --quiet           suppress the per-submission table (use with --csv/--items)

Lines that do not contain a code are ignored, so an email dump can be pasted in
whole. Codes that fail to decode are listed at the end and never silently
scored.
"""

import argparse
import base64
import csv
import hashlib
import io
import os
import re
import sys
from collections import defaultdict

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
SCORE_JS = os.path.join(ROOT, "app", "assets", "score.js")

# A v3 code, loose enough to pull out of a line of email text.
CODE_RE = re.compile(r"\b([a-z][a-z0-9_]*v\d+)\.([A-Za-z0-9_\-]+)\.([0-9a-f]{6})\b", re.I)


# --------------------------------------------------------------------------
# The salt
# --------------------------------------------------------------------------
def default_salt():
    """Read DEFAULT_SALT out of score.js.

    Read rather than duplicated on purpose: rotating the salt to invalidate a
    class's codes is a one-line edit in score.js, and a copy here would quietly
    keep decoding the old ones.
    """
    try:
        with open(SCORE_JS, encoding="utf-8") as fh:
            m = re.search(r'const\s+DEFAULT_SALT\s*=\s*"([^"]+)"', fh.read())
            if m:
                return m.group(1)
    except OSError:
        pass
    return ""


# --------------------------------------------------------------------------
# The codec (mirror of app/assets/score.js)
# --------------------------------------------------------------------------
def keystream(n_bytes, salt, modver):
    """SHA-256 in counter mode over (salt | module+version), as score.js does."""
    out = bytearray()
    counter = 0
    while len(out) < n_bytes:
        block = hashlib.sha256(
            f"ks|{salt}|{modver}|{counter}".encode("utf-8")).digest()
        out.extend(block)
        counter += 1
    return bytes(out[:n_bytes])


def mac_hex(payload, salt, modver):
    """The 6-hex tamper tag, computed over the *cleartext* payload."""
    return hashlib.sha256(
        f"mac|{payload}|{salt}|{modver}".encode("utf-8")).hexdigest()[:6]


def b64url_decode(s):
    return base64.urlsafe_b64decode(s + "=" * (-len(s) % 4))


def parse_manipulations(token):
    """`A12B8C5` -> {'A': 12, 'B': 8, 'C': 5}."""
    return {k: int(v) for k, v in re.findall(r"([A-Za-z]+)(\d+)", token or "")}


def decode(code, salt):
    """Decode one code. Returns a dict; `ok` is True only when the tamper tag
    matches and the payload is well formed. A wrong salt lands as ok=False with
    a reason rather than an exception."""
    code = code.strip()
    parts = code.split(".")
    if len(parts) != 3:
        return {"raw": code, "ok": False, "reason": "not a v3 code"}
    modver, blob, mac = parts
    m = re.match(r"^([a-z][a-z0-9_]*)v(\d+)$", modver, re.I)
    if not m:
        return {"raw": code, "ok": False, "reason": "bad module prefix"}
    rec = {"raw": code, "moduleId": m.group(1), "version": int(m.group(2))}
    try:
        cipher = b64url_decode(blob)
    except Exception:
        return dict(rec, ok=False, reason="payload is not base64url")

    ks = keystream(len(cipher), salt, modver)
    payload = bytes(c ^ k for c, k in zip(cipher, ks)).decode("utf-8", "replace")
    fields = payload.split("|")
    # Six fields is the original layout; seven adds active seconds.
    if len(fields) not in (6, 7):
        return dict(rec, ok=False, reason="wrong salt or corrupt code")

    name, pre, sc, post, elapsed, manip = fields[:6]
    active = fields[6] if len(fields) == 7 else None
    bits_ok = all(re.fullmatch(r"[01]*", b) for b in (pre, sc, post))
    mac_ok = mac_hex(payload, salt, modver) == mac.lower()

    def as_int(v):
        try:
            return int(v)
        except (TypeError, ValueError):
            return 0

    return dict(
        rec,
        ok=(mac_ok and bits_ok),
        mac_ok=mac_ok,
        reason="" if (mac_ok and bits_ok) else "tamper tag does not match",
        name_token=name,
        pretest=pre, scaffold=sc, posttest=post,
        elapsed_sec=as_int(elapsed),
        # None, not 0, for codes predating the attention clock: "not measured"
        # and "measured as zero" are different findings.
        active_sec=(as_int(active) if active is not None else None),
        manip_token=manip,
        manipulations=parse_manipulations(manip),
    )


# --------------------------------------------------------------------------
# Presentation
# --------------------------------------------------------------------------
def pretty_name(token):
    """`ada_lovelace_byron` -> `Ada Lovelace Byron`.

    The token is a slug of whatever the student typed, so hyphens and
    apostrophes are already gone; this is a display convenience, and the raw
    token stays in the CSV as the join key."""
    return " ".join(w.capitalize() for w in (token or "").split("_") if w) or "(no name)"


def fmt_time(sec):
    if sec is None:
        return "--"
    sec = max(0, int(sec))
    h, rem = divmod(sec, 3600)
    m, s = divmod(rem, 60)
    if h:
        return f"{h}h{m:02d}m"
    if m:
        return f"{m}m{s:02d}s"
    return f"{s}s"


def ones(bits):
    return bits.count("1")


def totals(rec):
    """(correct, out_of) across all three question groups."""
    allbits = rec.get("pretest", "") + rec.get("scaffold", "") + rec.get("posttest", "")
    return ones(allbits), len(allbits)


def manip_total(rec):
    return sum(rec.get("manipulations", {}).values())


def flags(rec):
    """Short notes worth the instructor's eye. Not verdicts -- prompts to look."""
    out = []
    if not rec.get("ok"):
        out.append("TAMPER")
    if manip_total(rec) == 0:
        out.append("no activity")
    act, wall = rec.get("active_sec"), rec.get("elapsed_sec", 0)
    if act is not None and wall > 0:
        if act < 60:
            out.append("under a minute of attention")
        elif act / wall < 0.25 and wall > 900:
            out.append("mostly idle")
    return out


def report(records, out=sys.stdout):
    """The per-submission table, grouped by module."""
    by_mod = defaultdict(list)
    for r in records:
        by_mod[(r["moduleId"], r["version"])].append(r)

    for (mod, ver), recs in sorted(by_mod.items(), key=lambda kv: mod_key(kv[0][0])):
        recs.sort(key=lambda r: r.get("name_token", ""))
        print(f"\n{mod} v{ver} — {len(recs)} submission{'' if len(recs) == 1 else 's'}", file=out)
        print(f"  {'student':<22} {'score':>12}  {'attention':>9} {'wall':>8}  "
              f"{'moves':>5}  {'bits (pre/checkpoints/post)':<32} notes", file=out)
        for r in recs:
            correct, total = totals(r)
            score = f"{correct}/{total}"
            pct = f"{round(100 * correct / total)}%" if total else "--"
            bits = " ".join(x for x in (r.get("pretest") or "·",
                                        r.get("scaffold") or "·",
                                        r.get("posttest") or "·"))
            stages = " ".join(f"{k}{v}" for k, v in sorted(r.get("manipulations", {}).items()))
            note = "; ".join(flags(r))
            print(f"  {pretty_name(r.get('name_token')):<22} "
                  f"{score:>7} {pct:>4}  "
                  f"{fmt_time(r.get('active_sec')):>9} {fmt_time(r.get('elapsed_sec')):>8}  "
                  f"{manip_total(r):>5}  {bits:<32} {note}".rstrip(), file=out)
            if stages:
                print(f"  {'':<22} {'':>12}  {'':>9} {'':>8}  {'':>5}  per stage: {stages}", file=out)


def mod_key(mod):
    """Sort lesson2 before lesson10, and lessons before scaffolds."""
    m = re.match(r"^([a-z_]*?)(\d*)$", mod)
    prefix, num = (m.group(1), m.group(2)) if m else (mod, "")
    return (prefix, int(num) if num else -1)


def item_analysis(records, out=sys.stdout):
    """Per-checkpoint pass rates across the class.

    This is the lesson-efficacy read rather than the student read. A checkpoint
    that most of the class gets right is doing its job; one that nearly nobody
    gets is either the hard-won insight the lesson exists to teach or a
    question that does not say what it means -- and which of the two it is
    usually becomes obvious once you look at the item next to the number."""
    by_mod = defaultdict(list)
    for r in records:
        if r.get("ok"):
            by_mod[(r["moduleId"], r["version"])].append(r)

    print("\n" + "=" * 72, file=out)
    print("ITEM ANALYSIS — fraction of the class correct, per question", file=out)
    print("=" * 72, file=out)

    for (mod, ver), recs in sorted(by_mod.items(), key=lambda kv: mod_key(kv[0][0])):
        n = len(recs)
        print(f"\n{mod} v{ver}  (n={n})", file=out)
        any_items = False
        for group, label in (("pretest", "pretest"), ("scaffold", "checkpoint"), ("posttest", "posttest")):
            width = max((len(r.get(group, "")) for r in recs), default=0)
            if not width:
                continue
            any_items = True
            for i in range(width):
                got = [r[group][i] for r in recs if len(r.get(group, "")) > i]
                if not got:
                    continue
                frac = got.count("1") / len(got)
                bar = "█" * round(frac * 20) + "·" * (20 - round(frac * 20))
                print(f"  {label:<11} {i + 1:>2}  {bar}  {round(100 * frac):>3}%  "
                      f"({got.count('1')}/{len(got)})", file=out)
        if not any_items:
            print("  (no scored questions in this module)", file=out)
            continue

        # Pretest -> posttest movement, when the module has both. This is the
        # closest thing the codes carry to "did the lesson move anyone".
        pre_w = max((len(r.get("pretest", "")) for r in recs), default=0)
        post_w = max((len(r.get("posttest", "")) for r in recs), default=0)
        if pre_w and post_w:
            pre = sum(ones(r.get("pretest", "")) for r in recs)
            post = sum(ones(r.get("posttest", "")) for r in recs)
            pre_rate = pre / (pre_w * n) if n else 0
            post_rate = post / (post_w * n) if n else 0
            arrow = "+" if post_rate >= pre_rate else ""
            print(f"  {'':<11}     pretest {round(100 * pre_rate)}% → "
                  f"posttest {round(100 * post_rate)}%  "
                  f"({arrow}{round(100 * (post_rate - pre_rate))} points)", file=out)

        # Engagement, which reads the lesson as much as the student: a lesson
        # nobody touches is not a lesson nobody understood.
        moves = sorted(manip_total(r) for r in recs)
        if moves:
            median = moves[len(moves) // 2]
            print(f"  {'':<11}     control moves per student: median {median}, "
                  f"range {moves[0]}–{moves[-1]}", file=out)
        act = [r["active_sec"] for r in recs if r.get("active_sec") is not None]
        if act:
            act.sort()
            print(f"  {'':<11}     attention per student: median "
                  f"{fmt_time(act[len(act) // 2])}, range {fmt_time(act[0])}–{fmt_time(act[-1])}", file=out)


CSV_HEADER = [
    "name_token", "name", "module", "version",
    "correct", "out_of", "percent",
    "pretest_bits", "checkpoint_bits", "posttest_bits",
    "active_sec", "elapsed_sec", "moves_total", "moves_by_stage",
    "tamper_ok", "notes",
]


def write_csv(records, out):
    w = csv.writer(out)
    w.writerow(CSV_HEADER)
    for r in sorted(records, key=lambda r: (r.get("name_token", ""), mod_key(r["moduleId"]))):
        correct, total = totals(r)
        w.writerow([
            r.get("name_token", ""), pretty_name(r.get("name_token")),
            r["moduleId"], r["version"],
            correct, total, (round(100 * correct / total) if total else ""),
            r.get("pretest", ""), r.get("scaffold", ""), r.get("posttest", ""),
            r.get("active_sec") if r.get("active_sec") is not None else "",
            r.get("elapsed_sec", ""),
            manip_total(r),
            " ".join(f"{k}{v}" for k, v in sorted(r.get("manipulations", {}).items())),
            1 if r.get("ok") else 0,
            "; ".join(flags(r)),
        ])


# --------------------------------------------------------------------------
def harvest(text):
    """Pull every code out of a blob of text, keeping the line it came from so
    an unreadable line can be reported back recognisably."""
    found, unmatched = [], []
    for line in text.splitlines():
        line = line.strip()
        if not line or line.startswith("#"):
            continue
        m = CODE_RE.search(line)
        if m:
            found.append(m.group(0))
        else:
            unmatched.append(line)
    return found, unmatched


def main(argv=None):
    ap = argparse.ArgumentParser(
        description="Decode BIO 202 submission codes.",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="With no CODE and no -f, codes are read from stdin.")
    ap.add_argument("codes", nargs="*", metavar="CODE")
    ap.add_argument("-f", "--file", help="file of codes, one per line")
    ap.add_argument("--csv", nargs="?", const="-", metavar="OUT",
                    help="write CSV to OUT (default stdout)")
    ap.add_argument("--items", action="store_true",
                    help="add the class-wide item analysis")
    ap.add_argument("--salt", default=None, help="override the project salt")
    ap.add_argument("--quiet", action="store_true",
                    help="skip the per-submission table")
    args = ap.parse_args(argv)

    salt = args.salt if args.salt is not None else default_salt()
    if not salt:
        print("warning: no salt found in app/assets/score.js and none given "
              "with --salt; codes will not decode.", file=sys.stderr)

    raw = list(args.codes)
    unmatched = []
    if args.file:
        with open(args.file, encoding="utf-8") as fh:
            found, unmatched = harvest(fh.read())
        raw.extend(found)
    elif not raw or "-" in raw:
        raw = [c for c in raw if c != "-"]
        if not sys.stdin.isatty():
            found, unmatched = harvest(sys.stdin.read())
            raw.extend(found)

    if not raw:
        ap.print_help()
        return 2

    good, bad = [], []
    seen = set()
    for code in raw:
        # The same code pasted twice (a student resending) is one submission.
        if code in seen:
            continue
        seen.add(code)
        rec = decode(code, salt)
        (good if rec.get("name_token") is not None else bad).append(rec)

    if not args.quiet and good:
        report(good)
    if args.items and good:
        item_analysis(good)

    if args.csv:
        if args.csv == "-":
            buf = io.StringIO()
            write_csv(good, buf)
            print("\n" + buf.getvalue(), end="")
        else:
            with open(args.csv, "w", newline="", encoding="utf-8") as fh:
                write_csv(good, fh)
            print(f"\nWrote {len(good)} rows to {args.csv}", file=sys.stderr)

    if bad or unmatched:
        # Keep the two streams from interleaving when both go to a terminal.
        sys.stdout.flush()
        print("\n" + "-" * 72, file=sys.stderr)
        for rec in bad:
            print(f"COULD NOT DECODE  {rec['raw'][:60]}"
                  f"{'…' if len(rec['raw']) > 60 else ''}"
                  f"\n                  {rec.get('reason', 'unknown')}", file=sys.stderr)
        for line in unmatched:
            print(f"NO CODE ON LINE   {line[:60]}{'…' if len(line) > 60 else ''}", file=sys.stderr)
        print("A code that will not decode is usually a paste that lost a "
              "character, or a salt that has been rotated since it was issued.",
              file=sys.stderr)

    tampered = [r for r in good if not r.get("ok")]
    if tampered:
        print(f"\n{len(tampered)} code(s) decoded but failed the tamper tag — "
              f"listed as TAMPER above.", file=sys.stderr)

    return 0


if __name__ == "__main__":
    sys.exit(main())
