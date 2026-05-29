#!/usr/bin/env python3
"""Strip pretest/posttest scaffolding from lessons.

For each lessons/lessonN.html (N=1..19), removes:
- The pretest-card and posttest-card divs (and their mounts)
- PRETEST_ITEMS and POSTTEST_ITEMS array declarations
- showPretest and showPosttest function definitions
- pretest: / posttest: keys from Score.init
- Quiz.render() calls for pretest/posttest

Rewires the stage progression so:
- onReady directly unlocks Stage A (no pretest gate)
- The last stage's completion calls Score.finish() (no posttest gate)
- nextStageLabel returns null for the last stage; consumers handle it

Run from repo root: python3 tools/strip_pretest_posttest.py
"""
import re
import sys
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
LESSONS = REPO / "lessons"


def remove_balanced(text, start_pat, open_ch, close_ch, also_consume_semi=True):
    """Find `start_pat` and remove through the matching close-char.
    Returns (new_text, count_removed).
    """
    count = 0
    while True:
        m = re.search(start_pat, text)
        if not m:
            return text, count
        i = m.end()
        depth = 1
        while i < len(text) and depth > 0:
            if text[i] == open_ch:
                depth += 1
            elif text[i] == close_ch:
                depth -= 1
            i += 1
        # i points just past close_ch
        if also_consume_semi and i < len(text) and text[i] == ';':
            i += 1
        # consume trailing newline
        if i < len(text) and text[i] == '\n':
            i += 1
        text = text[:m.start()] + text[i:]
        count += 1


def strip_file(path: Path):
    src = path.read_text()
    orig = src

    # 1. Remove single-line `<div class="score-card" id="pretest-card" ...><div id="pretest-mount"></div></div>`
    src = re.sub(
        r'<div class="score-card" id="pretest-card"[^>]*>\s*<div id="pretest-mount"></div>\s*</div>\s*\n?',
        '', src)
    # Multi-line variant
    src = re.sub(
        r'<div class="score-card" id="pretest-card"[^>]*>\s*\n\s*<div id="pretest-mount"></div>\s*\n\s*</div>\s*\n?',
        '', src)

    # 2. Same for posttest-card
    src = re.sub(
        r'<div class="score-card" id="posttest-card"[^>]*>\s*<div id="posttest-mount"></div>\s*</div>\s*\n?',
        '', src)
    src = re.sub(
        r'<div class="score-card" id="posttest-card"[^>]*>\s*\n\s*<div id="posttest-mount"></div>\s*\n\s*</div>\s*\n?',
        '', src)

    # 3. Update lock-banner text mentioning pretest (Stage A's banner)
    src = re.sub(
        r'Locked[.—–\-]?\s*[Aa]nswer the pretest( above)?( to unlock( this section)?)?( first)?\.?',
        'Locked — confirm your name above to begin.', src)

    # 4. Remove PRETEST_ITEMS and POSTTEST_ITEMS array declarations.
    # Match `const NAME = [` (or `const NAME=[`) and strip through matching `]` + optional `;` + newline.
    for name in ['PRETEST_ITEMS', 'POSTTEST_ITEMS']:
        src, _ = remove_balanced(src, rf'const {name}\s*=\s*\[', '[', ']', also_consume_semi=True)

    # 5. Remove showPretest and showPosttest function definitions.
    for name in ['showPretest', 'showPosttest']:
        src, _ = remove_balanced(src, rf'function {name}\s*\(\s*\)\s*\{{', '{', '}', also_consume_semi=False)

    # 6. nextStageLabel: replace `"posttest"` value with `null` so consumers can detect end-of-lesson
    src = re.sub(
        r'(function\s+nextStageLabel[^{]*\{[^}]*?)"posttest"',
        r'\1null', src, flags=re.DOTALL)

    # 7. Replace `nxt === "posttest"` ternary patterns that built the tracker text.
    # Convert `nxt === "posttest" ? A : B` to `nxt === null ? A : B`.
    src = src.replace('nxt === "posttest"', 'nxt === null')
    src = src.replace("nxt === 'posttest'", 'nxt === null')

    # 8. unlockNext final-stage branch: where it used to call showPosttest(), call Score.finish().
    # Variant A: `else { ... if (typeof showPosttest === "function") showPosttest(); ... }`
    src = re.sub(
        r'if\s*\(\s*typeof\s+showPosttest\s*===?\s*"function"\s*\)\s*showPosttest\s*\(\s*\)\s*;',
        'if (typeof Score !== "undefined" && Score.finish) Score.finish();',
        src)
    src = re.sub(
        r'if\s*\(\s*typeof\s+showPosttest\s*===?\s*\'function\'\s*\)\s*showPosttest\s*\(\s*\)\s*;',
        'if (typeof Score !== "undefined" && Score.finish) Score.finish();',
        src)
    # Variant B: bare `showPosttest();`
    src = re.sub(r'\bshowPosttest\s*\(\s*\)\s*;', 'if (typeof Score !== "undefined" && Score.finish) Score.finish();', src)

    # 9. Strip `pretest:` and `posttest:` keys from Score.init({...}).
    # These are simple lines like `pretest: 0,` or `posttest: POSTTEST_ITEMS.length,`
    # Strip the whole line including leading whitespace and trailing newline.
    src = re.sub(r'^[ \t]*pretest\s*:\s*[A-Za-z0-9_.]+\s*,?[ \t]*\n', '', src, flags=re.MULTILINE)
    src = re.sub(r'^[ \t]*posttest\s*:\s*[A-Za-z0-9_.]+\s*,?[ \t]*\n', '', src, flags=re.MULTILINE)
    # Inline variant (single-line Score.init): `, pretest:N` or `pretest:N,`
    src = re.sub(r',\s*pretest\s*:\s*[A-Za-z0-9_.]+', '', src)
    src = re.sub(r'pretest\s*:\s*[A-Za-z0-9_.]+\s*,\s*', '', src)
    src = re.sub(r',\s*posttest\s*:\s*[A-Za-z0-9_.]+', '', src)
    src = re.sub(r'posttest\s*:\s*[A-Za-z0-9_.]+\s*,\s*', '', src)

    # 10. onReady: rewrite `onReady: () => showPretest()` (and variants) to unlock Stage A directly.
    unlock_a = (
        '() => { '
        'const s = document.getElementById("stageA"); if (s) s.classList.remove("stage-locked"); '
        'const t = document.getElementById("tocA"); if (t) t.classList.remove("locked"); '
        '}'
    )
    src = re.sub(
        r'onReady\s*:\s*\(\s*\)\s*=>\s*showPretest\s*\(\s*\)',
        f'onReady: {unlock_a}', src)
    src = re.sub(
        r'onReady\s*:\s*\(\s*\)\s*=>\s*\{\s*showPretest\s*\(\s*\)\s*;?\s*\}',
        f'onReady: {unlock_a}', src)

    # 11. Clean up any leftover references in stage-progression code.
    # The `Stage ${nextStageLabel(stage)} unlocked` template — when label is null,
    # we want "Lesson complete." Patch the ternary that builds the tracker text.
    # Pattern: `\`${...} done — Stage ${nextStageLabel(stage)} unlocked.\``
    src = re.sub(
        r'`\$\{g\.explores\}\+ done — Stage \$\{nextStageLabel\(stage\)\} unlocked\.`',
        '`${g.explores}+ done — ` + (nextStageLabel(stage) ? `Stage ${nextStageLabel(stage)} unlocked.` : `Lesson complete.`)',
        src)

    # 12. Final guard: if Score.init left dangling commas (`{,` or `,,` or `,}`), clean them.
    src = re.sub(r'\{\s*,', '{', src)
    src = re.sub(r',\s*,', ',', src)
    src = re.sub(r',\s*\}', '}', src)
    src = re.sub(r',(\s*\))', r'\1', src)  # `, )` -> `)`

    if src != orig:
        path.write_text(src)
        return True
    return False


def main():
    changed = []
    for n in range(1, 20):
        p = LESSONS / f'lesson{n}.html'
        if not p.exists():
            print(f'skip (missing) {p}', file=sys.stderr)
            continue
        if strip_file(p):
            changed.append(p.name)
            print(f'updated {p.name}')
        else:
            print(f'no changes {p.name}')
    print(f'\nTotal updated: {len(changed)}')


if __name__ == '__main__':
    main()
