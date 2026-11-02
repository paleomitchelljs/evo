#!/usr/bin/env python3
"""test_editor.py -- the lesson editor (editor/server.py + editor.js) against every page, on a throwaway copy.

  marks     the served page is the file plus the editor's marks and nothing else: with them stripped, it is the file
            byte for byte; every unit's recorded words are the file's words at its place; no two units overlap
  browser   each page in headless Chrome, served by the editor: the browser's own parse of the served page puts every
            unit's words exactly where the editor's parse did (so a save lands where it was typed); no uncaught error
  round     on lesson 19, through editor.js's real paths: type " EDTEST" at the end of the first intro paragraph and
            save; flag the first plot; then undo the edit over HTTP. The copy must change by exactly those seven
            characters, in that paragraph, and come back byte for byte; the flag keeps its picture; a call without
            the editor's header is refused

The copy is made in a temp folder (the lessons copied, assets and data linked), so nothing in the repo is written.

Usage:  python3 scripts/test_editor.py          (~1 minute)
Exit 0 iff everything passes. Needs Google Chrome.
"""
import html as htmllib
import json
import os
import re
import shutil
import socket
import subprocess
import sys
import tempfile
import time
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "editor"))
import server as S  # noqa: E402

CHROME = os.environ.get("CHROME", "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome")
ROUND_PAGE = "app/lessons/lesson19.html"
fails = []


def check(ok, what):
    print(("ok    " if ok else "FAIL  ") + what)
    if not ok:
        fails.append(what)


def free_port():
    with socket.socket() as s:
        s.bind(("127.0.0.1", 0))
        return s.getsockname()[1]


def chrome(url, budget=60000):
    r = subprocess.run([CHROME, "--headless=new", "--disable-gpu", "--enable-logging=stderr", "--v=0",
                        f"--virtual-time-budget={budget}", "--dump-dom", url],
                       capture_output=True, text=True, timeout=240)
    return r.stdout, r.stderr


def post(port, path, body, header=True):
    req = urllib.request.Request(f"http://127.0.0.1:{port}/__editor/api/{path}", data=json.dumps(body).encode(),
                                 headers={"Content-Type": "application/json", **({"X-Evo-Editor": "1"} if header else {})})
    try:
        with urllib.request.urlopen(req) as r:
            return r.status, json.loads(r.read())
    except urllib.error.HTTPError as e:
        return e.code, json.loads(e.read() or b"{}")


def main():
    pages = S.page_list()

    # ---- marks
    bad = []
    for rel in pages:
        src = S.read(ROOT / rel)
        served, units = S.build(rel, src)
        prev, ok = -1, S.unmark(served) == src
        for u in units:
            ok = ok and u["s"] >= prev and src[u["s"]:u["e"]] == u["src"] and u["src"].strip() != ""
            prev = u["e"]
        if not ok:
            bad.append(rel)
    check(not bad, f"marks: {len(pages)} pages, the served copy is the file plus marks" + (f"; wrong on {', '.join(bad)}" if bad else ""))

    # ---- the copy, and the editor serving it
    tmp = Path(tempfile.mkdtemp(prefix="evo_editor_test_"))
    proc = None
    try:
        for folder in ("lessons", "scaffolds", "interactives"):
            if (ROOT / "app" / folder).is_dir():
                shutil.copytree(ROOT / "app" / folder, tmp / "app" / folder)
        os.symlink(ROOT / "app" / "assets", tmp / "app" / "assets")
        os.symlink(ROOT / "data", tmp / "data")
        shutil.copy(ROOT / "LOCKS.txt", tmp / "LOCKS.txt")
        port = free_port()
        proc = subprocess.Popen([sys.executable, str(ROOT / "editor" / "server.py"), "--port", str(port), "--root", str(tmp),
                                 "--notes", str(tmp / "notes")], stdout=subprocess.PIPE, stderr=subprocess.STDOUT)
        for _ in range(50):
            try:
                urllib.request.urlopen(f"http://127.0.0.1:{port}/").read()
                break
            except OSError:
                time.sleep(0.1)

        # ---- browser: one Chrome (a launch costs most of a minute), the pages in turn in one iframe, each removed
        # once it has reported, so no page's timers run on; the round's page last
        runs = [(rel, 1) for rel in pages] + [(ROUND_PAGE, 2)]
        probe = tmp / "_probe.html"
        probe.write_text(f"""<!doctype html><meta charset=utf-8><title>pending</title><pre id="o"></pre>
<script>
const RUNS = {json.dumps(runs)}, out = [];
function next(i) {{
  if (i === RUNS.length) {{ document.getElementById("o").textContent = JSON.stringify(out); document.title = "done"; return; }}
  const f = document.createElement("iframe"); f.width = 1400; f.height = 900;
  f.src = "/" + RUNS[i][0] + "?preview=1&edtest=" + RUNS[i][1]; document.body.append(f);
  let waited = 0;
  (function poll() {{
    const d = f.contentDocument, v = d && d.documentElement && d.documentElement.getAttribute("data-edtest");
    if (v || waited > 30000) {{ out.push(v || JSON.stringify({{ error: "no result" }})); f.remove(); setTimeout(() => next(i + 1), 50); return; }}
    waited += 100; setTimeout(poll, 100);
  }})();
}}
next(0);
</script>""")
        out, err = chrome(f"http://127.0.0.1:{port}/{probe.name}", budget=3_600_000)
        m = re.search(r'<pre id="o">(.*?)</pre>', out, re.S)
        try:
            got = [json.loads(v) for v in json.loads(htmllib.unescape(m.group(1)))]
        except (AttributeError, ValueError, TypeError):
            got = [{"error": "no result"}] * len(runs)
        results = {}
        for (rel, _), res in zip(runs[:-1], got):
            name = rel.rsplit("/", 1)[1]
            res["uncaught"] = [ln for ln in err.splitlines() if "Uncaught" in ln and ("/" + name in ln or "editor.js" in ln)]
            results[rel] = res
        bad = {rel: r for rel, r in results.items() if r.get("error") or r.get("mismatch") or r.get("notOnce") or r.get("uncaught")}
        n_units = sum(r.get("units", 0) for r in results.values())
        check(not bad and len(results) == len(pages), f"browser: {len(results)} pages, {n_units} units, each where the browser puts it, no uncaught error")
        for rel, r in bad.items():
            print("        ", rel, {k: v for k, v in r.items() if k in ("error", "mismatch", "notOnce", "uncaught") and v})

        # ---- round: an edit and a flag through editor.js (the probe's last run), then undo over HTTP
        orig = S.read(ROOT / ROUND_PAGE)
        res = got[-1] if len(got) == len(runs) else {"error": "no result"}
        new = S.read(tmp / ROUND_PAGE)
        at = new.find(" EDTEST")
        landed = (new.count("EDTEST") == 1 and new.replace(" EDTEST", "", 1) == orig
                  and new[at + 7:at + 11] == "</p>" and new.count("\n", 0, at) + 1 == res.get("edited"))
        check(landed, f"round: the edit changed the copy by exactly \" EDTEST\", at the end of the paragraph on line {res.get('edited')}"
              + ("" if landed else f"  ({res})"))
        notes = json.loads(S.read(tmp / "notes" / "lesson19.json"))
        flag = (notes.get("flags") or [{}])[0]
        pics = [tmp / p for p in flag.get("pictures", [])]
        check(len(notes.get("edits", [])) == 1 and flag.get("note") == "EDTEST flag" and pics and all(p.is_file() and p.stat().st_size > 1000 for p in pics)
              and flag.get("where", {}).get("line"),
              f"round: the edit is logged; flag {flag.get('id')} points at “{flag.get('where', {}).get('path')}”, line {flag.get('where', {}).get('line')}, with {len(pics)} picture(s)")
        md = urllib.request.urlopen(f"http://127.0.0.1:{port}/__editor/api/flags.md?file={ROUND_PAGE}").read().decode()
        check("> EDTEST flag" in md and flag.get("id", "?") in md, "round: the flags print for Claude, JM's words quoted")
        status, _ = post(port, "undo", {"file": ROUND_PAGE, "id": "e1"}, header=False)
        check(status == 403, f"round: a call without the editor's header is refused ({status})")
        status, _ = post(port, "undo", {"file": ROUND_PAGE, "id": "e1"})
        check(status == 200 and S.read(tmp / ROUND_PAGE) == orig, "round: undo puts the copy back byte for byte")
        status, body = post(port, "edit", {"file": ROUND_PAGE, "s": 0, "e": 5, "src": "nope!", "html": "x"})
        check(status == 409, f"round: a save whose words are not in the file is refused ({status}: {body.get('error', '')[:50]}…)")
    finally:
        if proc:
            proc.terminate()
            proc.wait()
        shutil.rmtree(tmp, ignore_errors=True)

    print("ALL PASS" if not fails else f"FAILED {len(fails)}")
    sys.exit(1 if fails else 0)


if __name__ == "__main__":
    main()
