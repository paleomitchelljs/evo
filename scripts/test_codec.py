#!/usr/bin/env python3
"""
test_codec.py -- prove that scripts/decode_codes.py and app/assets/score.js
implement the same code format.

Two implementations of one codec is a standing invitation to drift: change the
keystream in the browser and every emailed code silently stops decoding at the
command line, or worse, decodes to something plausible and wrong. So this test
drives the *real* score.js under node to mint codes, decodes them with the
Python side, and insists the fields come back identical.

    python3 scripts/test_codec.py         # exits 0 when the two agree

Needs node on the PATH. Without it, the node-dependent cases are skipped and
the pure-Python cases still run, so the script is never a hard blocker on a
machine that has no node -- it just checks less.
"""

import json
import os
import shutil
import subprocess
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
sys.path.insert(0, HERE)

from decode_codes import decode, default_salt, parse_manipulations, pretty_name  # noqa: E402

# name, module, version, pretest bits, checkpoint bits, posttest bits,
# manipulations, wall seconds, active seconds
CASES = [
    ("Ada Lovelace-Byron", "lesson7", 2, [1, 0], [1, 1, 0, 1, 1, 0, 1, 1, 1], [1],
     {"A": 14, "B": 3, "C": 27}, 7200, 1450),
    ("bo", "s01", 1, [1, 1], [], [0, 1], {}, 65, 65),
    ("Ann-Marie  O'Hara", "lesson26", 2, [], [1, 0, 1, 0, 1], [],
     {"A": 1, "B": 2, "C": 3, "D": 4, "E": 5}, 3661, 900),
    # Every bit wrong, no activity: the shape of a student who clicked through.
    ("Zed", "lesson12", 2, [], [0, 0, 0, 0], [], {}, 40, 0),
    # Unicode in, slug out.
    ("José Ñuñez", "lesson3", 5, [], [1] * 12, [], {"A": 99}, 100000, 3600),
]

NODE_SCRIPT = r"""
const fs = require("fs");
const code = fs.readFileSync(process.argv[1], "utf8");
(0, eval)(code);
const cases = JSON.parse(process.argv[2]);
(async () => {
  const out = [];
  for (const c of cases) {
    const S = globalThis.Score;
    S._state.moduleId = c.module; S._state.version = c.version;
    S._state.salt = S.DEFAULT_SALT;
    S._state.studentName = c.name;
    S._state.bits = { pretest: c.pre, scaffold: c.sc, posttest: c.post };
    S._state.manipulations = Object.assign({}, c.manip);
    S._state.startTime = Date.now() - c.wall * 1000;
    S._state.activeMs = c.active * 1000;
    out.push({ code: await S._buildCodeAsync(), nameToken: S.nameToken(c.name) });
  }
  process.stdout.write(JSON.stringify(out));
})();
"""


def bits_str(arr):
    return "".join(str(b) for b in arr)


def run_node_cases(salt):
    node = shutil.which("node")
    if not node:
        return None
    payload = [
        {"name": n, "module": m, "version": v, "pre": pre, "sc": sc, "post": post,
         "manip": manip, "wall": wall, "active": active}
        for (n, m, v, pre, sc, post, manip, wall, active) in CASES
    ]
    proc = subprocess.run(
        [node, "-e", NODE_SCRIPT, os.path.join(ROOT, "app", "assets", "score.js"),
         json.dumps(payload)],
        capture_output=True, text=True)
    if proc.returncode != 0:
        print("node failed:\n" + proc.stderr, file=sys.stderr)
        return None
    return json.loads(proc.stdout)


def main():
    salt = default_salt()
    failures = []

    def check(label, got, want):
        if got != want:
            failures.append(f"{label}: got {got!r}, wanted {want!r}")

    # --- pure Python: helpers that have no node counterpart to compare against
    check("parse_manipulations round trip",
          parse_manipulations("A14B3C27"), {"A": 14, "B": 3, "C": 27})
    check("parse_manipulations empty", parse_manipulations(""), {})
    check("pretty_name", pretty_name("ada_lovelace_byron"), "Ada Lovelace Byron")
    check("pretty_name blank", pretty_name(""), "(no name)")
    check("garbage is rejected", decode("not-a-code", salt)["ok"], False)
    check("truncated is rejected", decode("lesson1v1.abc", salt)["ok"], False)

    minted = run_node_cases(salt)
    if minted is None:
        print("SKIP  node not available — cross-implementation cases not run")
    else:
        for (name, mod, ver, pre, sc, post, manip, wall, active), got in zip(CASES, minted):
            d = decode(got["code"], salt)
            tag = f"{mod}v{ver} ({name})"
            check(f"{tag} decodes", d["ok"], True)
            check(f"{tag} name", d.get("name_token"), got["nameToken"])
            check(f"{tag} module", d.get("moduleId"), mod)
            check(f"{tag} version", d.get("version"), ver)
            check(f"{tag} pretest", d.get("pretest"), bits_str(pre))
            check(f"{tag} checkpoints", d.get("scaffold"), bits_str(sc))
            check(f"{tag} posttest", d.get("posttest"), bits_str(post))
            check(f"{tag} manipulations", d.get("manipulations"), manip)
            check(f"{tag} active seconds", d.get("active_sec"), active)
            # Wall clock is measured against Date.now() in node, so allow the
            # second or two the subprocess takes.
            if abs(d.get("elapsed_sec", 0) - wall) > 5:
                failures.append(f"{tag} wall seconds: got {d.get('elapsed_sec')}, wanted ~{wall}")

            # Tamper: flipping any one character of the blob must fail the tag.
            head, blob, mac = got["code"].split(".")
            flipped = blob[:-1] + ("A" if blob[-1] != "A" else "B")
            check(f"{tag} tamper detected",
                  decode(f"{head}.{flipped}.{mac}", salt)["ok"], False)
            # Wrong salt must fail rather than yield a plausible record.
            check(f"{tag} wrong salt rejected",
                  decode(got["code"], salt + "x")["ok"], False)

        # A six-field code minted before the attention clock existed still reads,
        # with active time reported as "not measured" rather than zero.
        legacy = ("lesson7v2.it7fVYybpbRm-1k9PBnKkAP26W0dAK__hOS4Hv5al__tMMWwhB"
                  "-qg-FwaLR9DSU.1c0cc8")
        d = decode(legacy, salt)
        check("legacy six-field code decodes", d["ok"], True)
        check("legacy code has no active time", d.get("active_sec"), None)
        check("legacy code keeps its wall time", d.get("elapsed_sec"), 1837)

    if failures:
        print(f"FAIL  {len(failures)} check(s) failed:")
        for f in failures:
            print("      " + f)
        return 1
    print("OK    decode_codes.py and score.js agree on every case")
    return 0


if __name__ == "__main__":
    sys.exit(main())
