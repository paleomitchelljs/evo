#!/usr/bin/env python3
"""
check_lessons.py -- the philosophy's mechanical gates, applied to the actual
lesson HTML instead of a JSON spec.

THIS IS THE GATE. A lesson that fails it does not ship.

structurephilosophy.md describes the 47-unit sequence. An earlier design had each
unit as a JSON spec under units/, checked by validate.py; those specs were never
written and both files are retired to _reference/retired/. The shipped course is
the HTML in app/lessons/, and this script is what holds it to the philosophy: the
vocabulary ratchet, the giveaway-phrase ban, the title-names-no-term rule, plus the
front/back-matter and no-jargon rules from the July voice-notes overhaul.

The judgment-level checks a regex cannot run -- the four adversarial passes -- live
in docs/PROJECT_NOTES.md section 4.

Scope: the student-facing PROSE and UI (headings, paragraphs, labels, buttons,
options). The R code panel (<pre>) and <script>/<style> are excluded -- technical
names are allowed to live in the code, per structurephilosophy.md goal 3.

Usage:  python3 scripts/check_lessons.py [app/lessons/lessonN.html ...]
        (no args -> every app/lessons/lesson*.html, in sequence order)

Exit 0 iff no lesson has a hard FAIL. WARNs never fail the run; they flag prose
jargon that is technically unlocked but that show-don't-tell would rather keep in
the code panel, plus style smells.
"""

import json, sys, re, glob, os, html

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)

# --- lesson file -> (new unit id, new seq). The authoritative old->new map. ----
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


def check_file(path, ledger, rows):
    fails, warns = [], []
    fname = os.path.basename(path)
    m = re.match(r"lesson(\d+)\.html", fname)
    if not m:
        return fails, warns, None
    n = int(m.group(1))
    if n not in LESSON_UNIT:
        return fails, warns, None
    uid, seq = LESSON_UNIT[n]
    raw = open(path, encoding="utf-8").read()
    prose, title = extract(raw)
    prose_norm = " " + norm(prose) + " "
    title_norm = " " + norm(title) + " "
    prose_low = prose.lower()

    # G8 ratchet: a term used in prose before its unlock, or a never-named term.
    for surface, canon, useq in rows:
        # Bare single-letter aliases (gene flow's "m") collide with units and
        # variables in prose (e.g. "100 m of chalk"); too noisy to flag. The
        # longer alias of the same term still catches genuine uses.
        if len(surface.strip()) <= 1:
            continue
        if not word_hit(surface, prose_norm):
            continue
        if useq is None:
            fails.append(f"G8 ratchet: prose uses '{surface}' -- a term the course never names")
        elif useq == -1:
            warns.append(f"G8: '{surface}' unlock unit not found in seq table")
        elif seq < useq:
            fails.append(f"G8 ratchet: prose uses '{surface}' (unlocks at seq {useq}) at seq {seq}")
        else:
            # Unlocked, but show-don't-tell keeps jargon in the code panel.
            warns.append(f"jargon: prose uses unlocked term '{surface}' (prefer code panel)")

    # G9 title contains a ledger term.
    for surface, canon, useq in rows:
        if word_hit(surface, title_norm):
            fails.append(f"G9 title: title contains ledger term '{surface}'")

    # G12 giveaway phrases.
    for g in GIVEAWAY:
        if g in prose_norm:
            fails.append(f"G12 giveaway: prose says '{g}'")

    # Voice-notes: back matter (hands the takeaway / clutter).
    for b in BACK_MATTER:
        if b in prose_low:
            fails.append(f"back-matter: '{b}' -- delete the wrap-up")
    for fr in FRONT_MATTER:
        if fr in prose_low:
            fails.append(f"front-matter: '{fr}' -- lesson opens on Stage A")

    # Greek glyphs / prose jargon (style warnings).
    for j in PROSE_JARGON:
        if j and j in prose_low:
            warns.append(f"prose jargon: '{j}' -- move to code panel or reword")

    # Structural: empty h1, missing Score wiring, missing final code mount.
    h1m = re.search(r"<h1[^>]*>(.*?)</h1>", raw, flags=re.S | re.I)
    if not h1m or not re.sub(r"<[^>]+>", "", h1m.group(1)).strip():
        fails.append("structure: <h1> is empty or missing")
    if "score.js" not in raw:
        fails.append("submission: no score.js include -- lesson emits no code")
    else:
        if "Score.init" not in raw:
            fails.append("submission: score.js included but Score.init never called")
        if "Score.finish" not in raw:
            warns.append("submission: Score.finish not called -- no final code panel?")

    # Undefined helpers. A lesson that calls a function nothing defines throws at
    # load, which means no name box and no submission code -- and nothing on the
    # page says so. This is what took out lesson12 and lesson18 earlier, so it is
    # a hard failure rather than a warning.
    if not re.search(r'<script[^>]*\bsrc="[^"]*sim\.js"', raw):
        fails.append("assets: sim.js not included -- no fallback for shared helpers")
    for missing in undefined_calls(raw):
        fails.append(f"undefined helper: {missing}() is called but never defined "
                     f"(not in the lesson, sim.js or score.js)")

    # Declared scaffold slots that nothing ever writes. Such a lesson emits a
    # valid code whose answer bits are all zero, so every student decodes as
    # having got every checkpoint wrong.
    mi = re.search(r"scaffold:\s*(\d+)", raw)
    if mi and int(mi.group(1)) > 0 and "recordCheckpoint" not in raw:
        fails.append(f"scoring: declares scaffold:{mi.group(1)} but never calls "
                     f"recordCheckpoint -- every answer bit ships as zero")

    return fails, warns, (uid, seq)


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
    ledger = load_ledger()
    rows = term_rows(ledger)
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
        fails, warns, meta = check_file(p, ledger, rows)
        if meta is None:
            continue
        uid, seq = meta
        tag = f"{os.path.basename(p)}  [{uid} seq {seq}]"
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

    # The release gate covers every page, not just the lessons named on the
    # command line, so it runs once at the end rather than per file.
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

    print(f"\n{len(paths)} lessons checked | {total_fail} hard failures")
    return 1 if total_fail else 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
