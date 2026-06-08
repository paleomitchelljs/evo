#!/usr/bin/env python3
"""Insert Score.bumpManipulation(stage) at the top of every lesson's
bumpExplore function, so manipulation counts flow into the score hash
without per-lesson instrumentation.

Idempotent: skip a file if the hook already appears.

Run from repo root: python3 tools/add_manipulation_hook.py
"""
import re
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
LESSONS = REPO / "lessons"

HOOK = 'if (typeof Score !== "undefined" && Score.bumpManipulation) Score.bumpManipulation(stage);'


def patch(path: Path) -> bool:
    src = path.read_text()
    if HOOK in src:
        return False

    # Match function bumpExplore(stage){ ... or function bumpExplore(stage) {
    pat = re.compile(r'(function\s+bumpExplore\s*\(\s*stage\s*\)\s*\{)')
    m = pat.search(src)
    if not m:
        return False
    insert_at = m.end()
    # Insert with a leading space + newline, indented similarly to surrounding code.
    new = src[:insert_at] + ' ' + HOOK + ' ' + src[insert_at:]
    path.write_text(new)
    return True


def main():
    n = 0
    for p in sorted(LESSONS.glob('lesson*.html')):
        if patch(p):
            print('hooked', p.name)
            n += 1
        else:
            print('skip   ', p.name)
    print(f'{n} files updated')


if __name__ == '__main__':
    main()
