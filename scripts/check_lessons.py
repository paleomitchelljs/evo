#!/usr/bin/env python3
"""
check_lessons.py -- structural integrity checks for the shipped lesson pages.

WHAT THIS IS FOR. Every check in here catches something you cannot see by
opening the page. The lesson looks fine in the browser and the damage turns up
in the gradebook, or in a page being live before you meant it to be:

  - a lesson declaring scaffold:N but never calling recordCheckpoint, so every
    student's code decodes as having got every question wrong
  - a call to a helper nothing defines, so the page throws on load: no name box,
    no submission code, and nothing on screen says so (this took out lesson12
    and lesson18 in an earlier round)
  - no score.js, or score.js without Score.init, so the lesson emits no code
  - an empty <h1>, which hard-fails lock.js's release curtain
  - a page with no LOCKS.txt row, which looks released and stays released

WHAT THIS IS NOT FOR. It used to also enforce a vocabulary ratchet, a
giveaway-phrase ban and front/back-matter rules as hard failures, keyed to a
47-unit sequence. Those were an agent's guardrails on itself, they outranked the
author, and they went blind on any lesson number not in a hand-maintained map --
which is to say they switched off exactly when the sequence was being edited.
Removed 2026-09-03 on JM's call. Writing decisions belong to the author.

Two things survive as opt-in reporting, neither of which blocks anything:
  --style   flags giveaway phrases and jargon in prose. Useful to whoever is
            drafting; advisory, never a failure.
  --terms   says where each ledger term first appears, computed from the shipped
            lessons rather than from a map that has to be kept in sync. This is
            the thing worth having when you reorder the course.

Usage:  python3 scripts/check_lessons.py [--style] [--terms] [lesson paths...]

Exit 0 iff no page has a hard failure.
"""

import json, sys, re, glob, os, html

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)

# --- lesson file -> (unit id, seq). Consulted ONLY by --terms, and only to
# order the report. It no longer decides whether a lesson gets checked: a file
# missing from here used to be skipped entirely, structural checks and all.
# structurephilosophy.md inserts new L3 (the flat-guess rung) and several drills/
# checkpoints; the 34 HTML lessons carry every "L" unit's content with an offset.
LESSON_UNIT = {
    1:  ("L1", 1),  2:  ("L2", 2),  3:  ("L4", 4),  4:  ("L5", 5),
    5:  ("L6", 7),  6:  ("L7", 9),  7:  ("L8", 12), 8:  ("L9", 14),
    9:  ("L10", 15), 10: ("L11", 16), 11: ("L12", 17), 12: ("L13", 18),
    13: ("L14", 19), 14: ("L15", 21), 15: ("L16", 23), 16: ("L17", 24),
    17: ("L18", 26), 18: ("L19", 27), 19: ("L20", 29), 20: ("L21", 31),
    21: ("L22", 32), 22: ("L23", 33), 23: ("L24", 34), 24: ("L25", 35),
    25: ("L26", 37), 26: ("L27", 38),
    # 27/28/29 (gene->chromosome, ->genome, ->cell) folded into lesson26 stage D,
    # and 32/33 (lineage, off-DNA) into lesson34 stage B, 2026-08-24. Their unit
    # ids stay in UNIT_SEQ; only the lesson files are gone. Numbering gaps are
    # deliberate -- renumber in one sweep if ever, not piecemeal.
    30: ("L31", 43), 31: ("L32", 44),
    34: ("L35", 47),
}

# The full 47-unit id->seq table, so ledger unlock ids resolve to positions even
# for units (drills, rungs, checkpoints) that have no HTML lesson.
UNIT_SEQ = {
    "L1":1,"L2":2,"L3":3,"L4":4,"L5":5,"S-weld":6,"L6":7,"L7a":8,"L7":9,
    "S-single":10,"L8a":11,"L8":12,"C1":13,"L9":14,"L10":15,"L11":16,"L12":17,
    "L13":18,"L14":19,"C2":20,"L15":21,"L16a":22,"L16":23,"L17":24,"S-cond":25,
    "L18":26,"L19":27,"L19a":28,"L20":29,"C3":30,"L21":31,"L22":32,"L23":33,
    "L24":34,"L25":35,"S-agree":36,"L26":37,"L27":38,"L27b":39,"L28":40,"L29":41,
    "L30":42,"L31":43,"L32":44,"L33":45,"L34":46,"L35":47,
}

# Surface strings the voice notes ban from prose regardless of ledger position.
# These are style/jargon smells; they warn rather than fail (many are also
# ledger-banned, which fails separately). Greek glyphs are checked on raw text.
PROSE_JARGON = [
    "μ", "σ", "Δ", "delta", "shift magnitude", "sampling scatter",
    "draw index", "replicate", "latency", "false-alarm", "false alarm",
    "std dev", "std. dev", "variance", "covariance", "z-score", "z score",
]

# Front/back-matter and structural smells (substring, case-insensitive on prose).
BACK_MATTER = [
    "one sentence to carry forward", "where this lesson goes next",
    "office hours", "stuck on any of this", "to carry forward",
]
FRONT_MATTER = [
    "what this lesson is asking", "what you'll do", "what you will do",
    "draft skeleton", "draft v0", "draft v1", "spring 2026",
]

GIVEAWAY = [
    "the takeaway", "this shows that", "this demonstrates that", "as you can see",
    "in other words", "which means that", "therefore we", "notice that",
    "the lesson here", "what this tells us", "the key idea is", "remember that",
    "it is important to", "you should now understand", "the point is",
]


def norm(s):
    return re.sub(r"[^a-z0-9 ]+", " ", (s or "").lower())


def load_ledger():
    return json.load(open(os.path.join(ROOT, "ledger.json")))


def term_rows(ledger):
    """(surface, canonical, unlock_seq or None) for every term + alias."""
    rows = []
    for term, meta in ledger["terms"].items():
        uid = meta.get("unlock")
        useq = None if uid is None else UNIT_SEQ.get(uid, -1)
        for surface in [term] + list(meta.get("aliases", [])):
            rows.append((surface, term, useq))
    rows.sort(key=lambda r: -len(r[0]))
    return rows


def strip_block(text, tag):
    return re.sub(rf"<{tag}\b[^>]*>.*?</{tag}>", " ", text, flags=re.S | re.I)


def extract(html_text):
    """Return (prose_text, title_text, raw_prose_html).

    prose = visible student-facing text with <script>/<style>/<pre> removed.
    raw_prose_html retains glyphs for the greek check; title from <title>/<h1>.
    """
    title = ""
    m = re.search(r"<h1[^>]*>(.*?)</h1>", html_text, flags=re.S | re.I)
    if m and m.group(1).strip():
        title = re.sub(r"<[^>]+>", " ", m.group(1))
    else:
        m = re.search(r"<title>(.*?)</title>", html_text, flags=re.S | re.I)
        title = re.sub(r"<[^>]+>", " ", m.group(1)) if m else ""
    body = html_text
    for tag in ("script", "style", "pre", "code", "template", "head"):
        body = strip_block(body, tag)
    body = re.sub(r"<[^>]+>", " ", body)
    body = html.unescape(body)
    body = re.sub(r"\s+", " ", body).strip()
    return body, html.unescape(title).strip()


def word_hit(surface, hay_norm):
    s = norm(surface).strip()
    if not s:
        return False
    return re.search(r"(?<![a-z0-9])" + re.escape(s) + r"(?![a-z0-9])", hay_norm) is not None


# Identifiers that are always available: JS builtins, browser globals, and the
# two libraries every page loads. Anything called but not defined and not on this
# list is a crash waiting at page load.
JS_GLOBALS = {
    "Math","JSON","Array","Object","String","Number","Boolean","Date","Error","Map","Set",
    "Promise","RegExp","Symbol","BigInt","Proxy","Reflect","WeakMap","WeakSet","Blob","URL",
    "parseInt","parseFloat","isNaN","isFinite","encodeURIComponent","decodeURIComponent",
    "setTimeout","setInterval","clearTimeout","clearInterval","requestAnimationFrame",
    "fetch","alert","console","document","window","navigator","localStorage","performance",
    "structuredClone","queueMicrotask","TextEncoder","TextDecoder","Uint8Array","Float64Array",
    "Event","CustomEvent","Image","FileReader","Worker","Intl","AbortController",
    "Int32Array","ArrayBuffer","DataView","crypto","atob","btoa","escape","unescape",
    "if","for","while","switch","catch","return","function","typeof","new","await","super",
    "constructor","get","set","of","in","do","else","try","case","void","delete","yield",
}
SCORE_EXPORTS = {
    "Score","init","recordPretest","recordCheckpoint","recordPosttest","finish","isAnswered",
    "allAnswered","getBit","carry","recall","recallInfo","clearCarry","bumpManipulation",
    "getManipulations","manipulationCount","scoring","nameToken","elapsedSeconds","activeSeconds",
    "decodeCode","hashName","parseCode","isBypass",
}
# app/assets/lock.js, included by every student-facing page.
LOCK_EXPORTS = {"Lock", "load", "parse", "pageKey", "isPreview"}


def _sim_exports():
    """function names defined in app/assets/sim.js"""
    p = os.path.join(ROOT, "app", "assets", "sim.js")
    if not os.path.exists(p):
        return set()
    return set(re.findall(r"\bfunction\s+([A-Za-z_$][\w$]*)", open(p, encoding="utf-8").read()))


def undefined_calls(raw_html):
    """Names called as f(...) inside the page's inline <script> blocks that no
    inline script, sim.js or score.js defines. Deliberately conservative: it
    ignores anything after a dot (method calls) and anything bound as a
    parameter or local, so it under-reports rather than crying wolf."""
    scripts = re.findall(r"<script(?![^>]*\bsrc=)[^>]*>(.*?)</script>", raw_html, flags=re.S | re.I)
    js = "\n".join(scripts)
    js = re.sub(r"//[^\n]*", "", js)
    js = re.sub(r"/\*.*?\*/", "", js, flags=re.S)
    # Blank out string bodies. DOTALL matters: the .R files the lessons offer for
    # download are multi-line template literals full of R calls (lm, rnorm,
    # sapply...), and without it every one of them reads as an undefined helper.
    js = re.sub(r"`(?:\\.|[^`\\])*`", '""', js, flags=re.S)
    js = re.sub(r"\"(?:\\.|[^\"\\\n])*\"", '""', js)
    js = re.sub(r"'(?:\\.|[^'\\\n])*'", '""', js)

    defined = set(re.findall(r"\bfunction\s+([A-Za-z_$][\w$]*)", js))
    defined |= set(re.findall(r"\b(?:const|let|var)\s+([A-Za-z_$][\w$]*)", js))
    # Any `name =` binding. Deliberately broad -- `const rng = mulberry32(1), nrm
    # = makeNormal(rng)` declares two names and the const regex above sees only
    # the first. Over-approximating what counts as defined keeps this check on
    # the under-reporting side, which is where a gate like this belongs.
    defined |= set(re.findall(r"(?<![.\w$=!<>])([A-Za-z_$][\w$]*)\s*=(?!=)", js))
    # destructured bindings, e.g. const {ctx,W,H} = setupCanvas(c)
    for grp in re.findall(r"\b(?:const|let|var)\s*\{([^}]*)\}", js):
        defined |= {t.strip().split(":")[-1].strip() for t in grp.split(",") if t.strip()}
    # parameter lists
    for grp in re.findall(r"\bfunction\s+[\w$]*\s*\(([^)]*)\)", js):
        defined |= {t.strip().split("=")[0].strip() for t in grp.split(",") if t.strip()}
    for grp in re.findall(r"\(([^()]*)\)\s*=>", js):
        defined |= {t.strip().split("=")[0].strip() for t in grp.split(",") if t.strip()}
    defined |= set(re.findall(r"([A-Za-z_$][\w$]*)\s*=>", js))   # single-arg arrows

    known = defined | JS_GLOBALS
    # Only credit a library's exports if the page actually loads it. Reading
    # sim.js off disk regardless would hide exactly the failure this check is
    # for: a lesson that dropped both its local copy and the <script> tag.
    if re.search(r'<script[^>]*\bsrc="[^"]*sim\.js"', raw_html):
        known |= _sim_exports()
    if re.search(r'<script[^>]*\bsrc="[^"]*score\.js"', raw_html):
        known |= SCORE_EXPORTS
    if re.search(r'<script[^>]*\bsrc="[^"]*lock\.js"', raw_html):
        known |= LOCK_EXPORTS
    called = set(re.findall(r"(?<![.\w$])([A-Za-z_$][\w$]*)\s*\(", js))
    return sorted(c for c in called - known if not c.startswith("_"))


def bit_map_faults(raw):
    """Every declared scoring slot must be reachable through the BIT map.

    THE FAILURE THIS CATCHES. A lesson declares `scaffold: 8` and a `const BIT`
    map with only seven names in it. `BIT.B_num1` is then `undefined`,
    `recordCheckpoint(undefined, ok)` writes nowhere, and the bit stays 0. A
    student who answers everything correctly scores 6/8. Nothing shows: no
    console error, the verdict on screen still says "right", and the emitted
    code decodes with a valid checksum -- so in the gradebook it is
    indistinguishable from a class that genuinely missed two questions. The
    coarse check above does not see it, because recordCheckpoint IS being
    called, just not for every slot. Caught by hand on lesson5 v8, 2026-09-04.

    SCOPE. Only pages carrying a `const BIT = {...}` map are examined. Lessons
    that index their checkpoints some other way -- a computed `start + i`, or a
    bare literal -- cannot be resolved without running the page, and are skipped
    silently rather than warned about. They pick this check up for free if they
    are ever rewritten onto the BIT pattern.
    """
    out = []
    mm = re.search(r"const\s+BIT\s*=\s*\{([^}]*)\}", raw)
    mi = re.search(r"scaffold:\s*(\d+)", raw)
    if not mm or not mi:
        return out
    n = int(mi.group(1))
    idx = {}
    for k, v in re.findall(r"(\w+)\s*:\s*(\d+)", mm.group(1)):
        idx[k] = int(v)

    # Names used as a checkpoint slot: `bit: BIT.x` in an options object, or
    # passed straight to a record()/recordCheckpoint() call.
    refs = set(re.findall(r"bit\s*:\s*BIT\.(\w+)", raw))
    refs |= set(re.findall(r"record(?:Checkpoint)?\(\s*BIT\.(\w+)", raw))
    # `BIT[stage]` and friends: a computed lookup reaches names this cannot
    # name, so slot coverage is not decidable and only the hard faults stand.
    computed = bool(re.search(r"BIT\s*\[", raw))

    undefined = sorted(r for r in refs if r not in idx)
    if undefined:
        out.append("scoring: " + ", ".join("BIT." + u for u in undefined) +
                   " referenced but missing from the BIT map -- records nowhere, "
                   "and that answer ships as zero however the student answers")

    dupes = sorted(k for k in idx if list(idx.values()).count(idx[k]) > 1)
    if dupes:
        out.append("scoring: " + ", ".join("BIT." + d for d in dupes) +
                   " share a slot -- one answer overwrites the other")

    over = sorted(k for k in idx if idx[k] >= n)
    if over:
        out.append(f"scoring: " + ", ".join("BIT." + o for o in over) +
                   f" sit past the declared scaffold:{n} -- written and then dropped")

    if len(idx) != n and not computed:
        out.append(f"scoring: BIT map has {len(idx)} names but scaffold:{n} slots "
                   f"are declared")

    if not computed:
        reached = set(idx[r] for r in refs if r in idx)
        missing = sorted(set(range(n)) - reached)
        if missing:
            names = {v: k for k, v in idx.items()}
            shown = ", ".join(f"{s} ({names.get(s, 'unnamed')})" for s in missing)
            out.append(f"scoring: slot(s) {shown} are declared but nothing ever "
                       f"writes them -- they ship as zero for every student")
    return out


def check_file(path, ledger, rows, style=False):
    """Structural checks. These run on every lesson page, whether or not it has
    a position in LESSON_UNIT -- a new lesson is exactly when they matter most."""
    fails, warns = [], []
    raw = open(path, encoding="utf-8").read()
    prose, title = extract(raw)

    # An empty <h1> hard-fails lock.js's curtain.
    h1m = re.search(r"<h1[^>]*>(.*?)</h1>", raw, flags=re.S | re.I)
    if not h1m or not re.sub(r"<[^>]+>", "", h1m.group(1)).strip():
        fails.append("structure: <h1> is empty or missing")

    # No score.js, or score.js that is never initialised: the lesson emits no code.
    if "score.js" not in raw:
        fails.append("submission: no score.js include -- lesson emits no code")
    else:
        if "Score.init" not in raw:
            fails.append("submission: score.js included but Score.init never called")
        if "Score.finish" not in raw:
            warns.append("submission: Score.finish not called -- no final code panel?")

    if not re.search(r'<script[^>]*\bsrc="[^"]*sim\.js"', raw):
        fails.append("assets: sim.js not included -- no fallback for shared helpers")

    # A helper nothing defines throws at load, and the page says nothing.
    for missing in undefined_calls(raw):
        fails.append(f"undefined helper: {missing}() is called but never defined "
                     f"(not in the lesson, sim.js or score.js)")

    # Declared scoring slots that nothing ever writes ship as all-zero answers.
    mi = re.search(r"scaffold:\s*(\d+)", raw)
    if mi and int(mi.group(1)) > 0 and "recordCheckpoint" not in raw:
        fails.append(f"scoring: declares scaffold:{mi.group(1)} but never calls "
                     f"recordCheckpoint -- every answer bit ships as zero")

    # ... and the finer version of the same failure, for pages that route their
    # checkpoints through a `const BIT = {...}` map.
    for msg in bit_map_faults(raw):
        fails.append(msg)

    # --style: advisory prose notes for whoever is drafting. Never a failure.
    if style:
        prose_norm = " " + norm(prose) + " "
        prose_low = prose.lower()
        for g in GIVEAWAY:
            if g in prose_norm:
                warns.append(f"style: prose says '{g}'")
        for j_ in PROSE_JARGON:
            if j_ and j_ in prose_low:
                warns.append(f"style: prose jargon '{j_}'")
        for surface, canon, useq in rows:
            if len(surface.strip()) <= 1:
                continue
            if word_hit(surface, prose_norm):
                warns.append(f"style: names '{surface}' in prose (fine -- noting it)")

    m = re.match(r"lesson(\d+)\.html", os.path.basename(path))
    n = int(m.group(1)) if m else None
    meta = LESSON_UNIT.get(n) if n is not None else None
    return fails, warns, meta


def terms_report(rows):
    """Where each ledger term first appears, read off the shipped lessons.
    Nothing to keep in sync: if you reorder the course, rerun it."""
    paths = sorted(
        glob.glob(os.path.join(ROOT, "app", "lessons", "lesson*.html")),
        key=lambda p: int(re.search(r"lesson(\d+)", p).group(1)),
    )
    seen = {}
    for p in paths:
        n = int(re.search(r"lesson(\d+)", p).group(1))
        prose, _ = extract(open(p, encoding="utf-8").read())
        hay = " " + norm(prose) + " "
        for surface, canon, _u in rows:
            if len(surface.strip()) <= 1 or canon in seen:
                continue
            if word_hit(surface, hay):
                seen[canon] = (n, surface)
    print("Where each term is first named in prose")
    print("-" * 52)
    named = sorted(seen.items(), key=lambda kv: kv[1][0])
    for canon, (n, surface) in named:
        print(f"  lesson {n:<3} {canon}" + (f"   (as '{surface}')" if surface != canon else ""))
    never = sorted(c for c in {r[1] for r in rows} if c not in seen)
    if never:
        print(f"\n  never named in any lesson ({len(never)}):")
        for c in never:
            print(f"    {c}")


def lock_key(path):
    """The LOCKS.txt key for a page: its filename without .html, with the
    descriptive tail trimmed off a scaffold (s04_fixation_probability -> s04)."""
    stem = os.path.basename(path)[:-len(".html")]
    m = re.match(r"^(s\d+)_", stem)
    return m.group(1) if m else stem


def check_locks():
    """Every shipped page needs a LOCKS.txt row and the lock.js include.

    The gate fails open by design -- a page with no row is treated as open --
    which is the right runtime behaviour and exactly why it needs a check here.
    A lesson silently missing from the release file would look released, stay
    released, and never announce itself.
    """
    fails, warns = [], []
    locks_path = os.path.join(ROOT, "LOCKS.txt")
    if not os.path.exists(locks_path):
        return ["LOCKS.txt is missing -- the release gate has nothing to read"], []

    keys, dupes = set(), []
    for line in open(locks_path, encoding="utf-8"):
        s = line.strip()
        if not s or s.startswith("#") or re.match(r"^display\s*:", s, re.I):
            continue
        m = re.match(r"^([A-Za-z][\w-]*)\s+([oxOX])\b", s)
        if not m:
            warns.append(f"LOCKS.txt: cannot read line, ignored at runtime: {s[:60]}")
            continue
        if m.group(1) in keys:
            dupes.append(m.group(1))
        keys.add(m.group(1))
    for d in sorted(set(dupes)):
        fails.append(f"LOCKS.txt: '{d}' listed twice -- the last row silently wins")

    pages = (sorted(glob.glob(os.path.join(ROOT, "app", "lessons", "lesson*.html")))
             + sorted(glob.glob(os.path.join(ROOT, "app", "scaffolds", "s*.html")))
             + sorted(glob.glob(os.path.join(ROOT, "app", "interactives", "*.html"))))
    for p in pages:
        rel = os.path.relpath(p, ROOT)
        if lock_key(p) not in keys:
            fails.append(f"LOCKS.txt: no row for {rel} (key '{lock_key(p)}') "
                         f"-- it can never be locked")
        if 'src="../assets/lock.js"' not in open(p, encoding="utf-8").read():
            fails.append(f"release gate: {rel} does not include lock.js "
                         f"-- locking it would do nothing")

    listed = {lock_key(p) for p in pages}
    for k in sorted(keys - listed):
        warns.append(f"LOCKS.txt: row '{k}' matches no page on disk")

    index = os.path.join(ROOT, "index.html")
    if os.path.exists(index):
        raw = open(index, encoding="utf-8").read()
        if "lock.js" not in raw:
            fails.append("release gate: index.html does not load lock.js -- "
                         "locked lessons would still be clickable on the landing page")
    return fails, warns


def main(argv):
    style = "--style" in argv
    want_terms = "--terms" in argv
    argv = [a for a in argv if not a.startswith("--")]
    ledger = load_ledger()
    rows = term_rows(ledger)

    if want_terms:
        terms_report(rows)
        if not argv:
            return 0
        print()

    if argv:
        paths = []
        for a in argv:
            paths.extend(sorted(glob.glob(a)))
    else:
        paths = sorted(
            glob.glob(os.path.join(ROOT, "app", "lessons", "lesson*.html")),
            key=lambda p: int(re.search(r"lesson(\d+)", p).group(1)),
        )
    total_fail = 0
    for p in paths:
        fails, warns, meta = check_file(p, ledger, rows, style=style)
        tag = os.path.basename(p)
        if meta:
            tag += f"  [{meta[0]} seq {meta[1]}]"
        if not fails and not warns:
            print(f"OK   {tag}")
            continue
        head = "FAIL" if fails else "warn"
        print(f"{head} {tag}  ({len(fails)} fail, {len(warns)} warn)")
        for f in fails:
            print(f"       FAIL  {f}")
        for w in warns:
            print(f"       warn  {w}")
        total_fail += len(fails)

    lock_fails, lock_warns = check_locks()
    if lock_fails or lock_warns:
        print(f"\n{'FAIL' if lock_fails else 'warn'} release gate  "
              f"({len(lock_fails)} fail, {len(lock_warns)} warn)")
        for f in lock_fails:
            print(f"       FAIL  {f}")
        for w in lock_warns:
            print(f"       warn  {w}")
        total_fail += len(lock_fails)
    else:
        print("\nOK   release gate  (LOCKS.txt covers every page)")

    print(f"\n{len(paths)} pages checked | {total_fail} hard failures")
    return 1 if total_fail else 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
