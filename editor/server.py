#!/usr/bin/env python3
"""The lesson editor (JM, 2026-11-01: "an editor so that I can directly rewrite text in panels and flag individual
boxes and interactives and targets to allow for more convenient editing").

    python3 editor/server.py               then open http://127.0.0.1:8770/
    double-click editor/launch.command     the same, and it opens the browser
    python3 editor/server.py --flags       print every open flag, for a Claude session (or --flags lesson21)

It serves the repo as any static server would. A page under app/lessons, app/scaffolds or app/interactives comes with
the editor on it (editor.js, editor.css), in three modes:

  Use         the page as a student has it.
  Edit text   click words and type. Enter saves them straight into the page's .html file, and the change is logged.
  Flag        click a box, plot, diagram, slider or target card and say what needs doing.

Flags and the edit log live in notes/flags/<page>.json (gitignored, as all of notes/ is), with pictures of flagged
plots in notes/flags/img/. Each flag carries where it points (stage, box, selector, line), the stage's slider
settings, and JM's words.

Only words the page's HTML holds can be rewritten here: verdicts, readouts and live counts are written by the page's
script, and get flagged instead. Nothing outside those three folders is written, and nothing is committed.

How a page is marked. The file is parsed here, not in the browser, so that every piece of text has its exact place
in the file. A "unit" is an element whose content is only words and inline markup (b, i, sub, sup, a, br ...): it
gets data-ed="k". Words that sit beside a control or a hover mark (a slider's label, the "Target" of a hover mark) are
wrapped in <ed-run data-ed="k">. A hover mark's words (.tip) are one unit, edited a line at a time. Every element in
the body also gets data-ln="N", its line in the file, so a flag can say where it points. The served copy is the file
plus those insertions and nothing else (scripts/test_editor.py checks that on every page).

A save names the unit's place and the words it held. If the file still holds those words there, they are replaced;
if it changed under the page (Claude editing at the same time), the words are looked for once in the whole file;
failing that the save is refused and the page asks to be reloaded.
"""
import argparse
import base64
import bisect
import datetime
import hashlib
import html
import http.server
import json
import os
import re
import shutil
import sys
import tempfile
import threading
import urllib.parse
from html.parser import HTMLParser
from pathlib import Path

HERE = Path(__file__).resolve().parent
REPO = HERE.parent


class Cfg:
    """Set in main(). The tests point root and notes at a copy of the repo."""
    root = REPO
    notes = REPO / "notes" / "flags"
    hosts = set()


PAGES = re.compile(r"^app/(lessons|scaffolds|interactives)/[\w.-]+\.html$")
VOID = {"area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "param", "source", "track", "wbr"}
INLINE = {"a", "abbr", "b", "bdi", "bdo", "br", "cite", "code", "del", "dfn", "em", "i", "ins", "kbd", "mark", "q",
          "s", "samp", "small", "span", "strong", "sub", "sup", "u", "var", "wbr"}
# nothing inside these is a unit: scripts, plots, R code, the diagrams' SVG
OPAQUE = {"script", "style", "svg", "math", "pre", "textarea", "template", "canvas", "iframe", "noscript", "object",
          "video", "audio"}
LOCK = threading.Lock()


class Refused(Exception):
    def __init__(self, status, msg):
        super().__init__(msg)
        self.status, self.msg = status, msg


# ---------------------------------------------------------------------------------------------------------------
# The parse: a light tree whose every node knows its place in the file
# ---------------------------------------------------------------------------------------------------------------

class Leaf:
    """A run of text, or a comment. It ends where the next thing starts."""
    __slots__ = ("start", "end", "comment")

    def __init__(self, start, comment=False):
        self.start, self.end, self.comment = start, start, comment


class El:
    __slots__ = ("tag", "attrs", "start", "name_end", "open_end", "close", "close_end", "children", "line")

    def __init__(self, tag, attrs, start, name_end, open_end, line):
        self.tag, self.attrs, self.start, self.name_end, self.open_end, self.line = tag, attrs, start, name_end, open_end, line
        self.close = self.close_end = None          # None: never closed in the file (an implied </li>); not a unit
        self.children = []

    @property
    def cls(self):
        return (self.attrs.get("class") or "").split()


class Tree(HTMLParser):
    def __init__(self, src):
        super().__init__(convert_charrefs=False)    # entities as their own events, so every position is exact
        self.src = src
        self.starts = [0] + [m.end() for m in re.finditer("\n", src)]
        self.root = El("#root", {}, 0, 0, 0, 1)
        self.stack, self.leaf = [self.root], None
        self.feed(src)
        self.close()
        self._end(len(src))
        self.body = next((c for c in self._walk(self.root) if c.tag == "body"), self.root)

    def _walk(self, n):
        for c in n.children:
            if isinstance(c, El):
                yield c
                yield from self._walk(c)

    def line_of(self, pos):
        return bisect.bisect_right(self.starts, pos)

    def _at(self):
        line, col = self.getpos()
        return self.starts[line - 1] + col

    def _end(self, pos):
        if self.leaf:
            self.leaf.end = pos
            self.leaf = None

    def _text(self, *_):
        if self.leaf and not self.leaf.comment:
            return
        pos = self._at()
        self._end(pos)
        self.leaf = Leaf(pos)
        self.stack[-1].children.append(self.leaf)

    handle_data = handle_entityref = handle_charref = _text

    def handle_comment(self, data):
        pos = self._at()
        self._end(pos)
        self.leaf = Leaf(pos, comment=True)
        self.stack[-1].children.append(self.leaf)

    def handle_decl(self, *_):
        self._end(self._at())

    handle_pi = unknown_decl = handle_decl

    def handle_starttag(self, tag, attrs, closed=False):
        pos = self._at()
        self._end(pos)
        raw = self.get_starttag_text()
        node = El(tag, dict(attrs), pos, pos + re.match(r"<[^\s/>]+", raw).end(), pos + len(raw), self.getpos()[0])
        self.stack[-1].children.append(node)
        if closed or tag in VOID:
            node.close = node.close_end = node.open_end
        else:
            self.stack.append(node)

    def handle_startendtag(self, tag, attrs):
        self.handle_starttag(tag, attrs, closed=True)

    def handle_endtag(self, tag):
        pos = self._at()
        self._end(pos)
        for i in range(len(self.stack) - 1, 0, -1):
            if self.stack[i].tag == tag:
                node = self.stack[i]
                node.close, node.close_end = pos, self.src.find(">", pos) + 1
                del self.stack[i:]
                return


def build(rel, src):
    """The page as served: the file plus data-ln / data-ed marks, <ed-run> wraps, and the editor itself."""
    tree = Tree(src)
    units, inline_memo = [], {}

    def text_of(items):
        out = []
        for it in items:
            if isinstance(it, Leaf):
                if not it.comment:
                    out.append(src[it.start:it.end])
            else:
                out.append(text_of(it.children))
        return "".join(out)

    def words(items):
        return html.unescape(text_of(items)).strip() != ""

    def inline_ok(n):
        """Can n sit inside a unit? Text, comments, and inline markup with no id (a script may hold it by its id)."""
        if isinstance(n, Leaf):
            return True
        if id(n) not in inline_memo:
            inline_memo[id(n)] = (n.tag in INLINE and "id" not in n.attrs and not {"info", "tip"} & set(n.cls)
                                  and n.close is not None and all(inline_ok(c) for c in n.children))
        return inline_memo[id(n)]

    def add(kind, s, e, node, stage, line):
        units.append({"k": len(units), "kind": kind, "s": s, "e": e, "tag": node.tag, "line": line, "stage": stage,
                      "src": src[s:e], "_node": node})

    def walk(n, stage):
        if n.tag == "section" and n.attrs.get("id"):
            stage = n.attrs["id"]
        run = []

        def flush():
            if run and words(run):
                s = run[0].start
                e = run[-1].end if isinstance(run[-1], Leaf) else run[-1].close_end
                while s < e and src[s].isspace():
                    s += 1
                while e > s and src[e - 1].isspace():
                    e -= 1
                add("run", s, e, n, stage, tree.line_of(s))
            run.clear()

        for c in n.children:
            if inline_ok(c):
                run.append(c)
                continue
            flush()
            if c.tag in OPAQUE:
                continue
            if "tip" in c.cls:
                if c.close is not None and words(c.children):
                    add("tip", c.open_end, c.close, c, stage, c.line)
                continue
            if (c.close is not None and c.tag not in VOID and "info" not in c.cls
                    and all(inline_ok(x) for x in c.children) and words(c.children)):
                add("el", c.open_end, c.close, c, stage, c.line)
                continue
            walk(c, stage)
        flush()

    walk(tree.body, "")

    marked = {id(u["_node"]): u["k"] for u in units if u["kind"] != "run"}
    ins = []
    for node in tree._walk(tree.body):
        mark = f' data-ln="{node.line}"'
        if id(node) in marked:
            mark += f' data-ed="{marked[id(node)]}"'
        ins.append((node.name_end, mark))
    for u in units:
        if u["kind"] == "run":
            ins.append((u["s"], f'<ed-run data-ed="{u["k"]}">'))
            ins.append((u["e"], "</ed-run>"))
    for u in units:
        del u["_node"]
    payload = json.dumps({"file": rel, "hash": digest(src), "units": units}, ensure_ascii=False).replace("<", "\\u003c")
    at = tree.body.close if tree.body is not tree.root and tree.body.close is not None else len(src)
    ins.sort(key=lambda x: x[0])
    ins.append((at, "<!-- evo-editor -->\n"
                    f'<script id="ed-units" type="application/json">{payload}</script>\n'
                    '<link rel="stylesheet" href="/__editor/editor.css">\n'
                    '<script src="/__editor/editor.js"></script>\n'
                    "<!-- /evo-editor -->\n"))
    ins.sort(key=lambda x: x[0])                    # stable: the editor stays after a run that ends at </body>
    out, last = [], 0
    for pos, text in ins:
        out.append(src[last:pos])
        out.append(text)
        last = pos
    out.append(src[last:])
    return "".join(out), units


def unmark(served):
    """The inverse of build(): what the file held. The tests insist it is the file, byte for byte."""
    served = re.sub(r"<!-- evo-editor -->\n.*?<!-- /evo-editor -->\n", "", served, flags=re.S)
    served = re.sub(r' data-ln="\d+"(?: data-ed="\d+")?', "", served)
    return re.sub(r'<ed-run data-ed="\d+">|</ed-run>', "", served)


# ---------------------------------------------------------------------------------------------------------------
# Files
# ---------------------------------------------------------------------------------------------------------------

def digest(text):
    return hashlib.sha1(text.encode("utf-8")).hexdigest()


def read(path):
    with open(path, encoding="utf-8", newline="") as f:
        return f.read()


def write(path, text):
    """Atomic, and the file keeps its mode: a half-written lesson in Dropbox would be worse than no edit."""
    path = Path(path)
    fd, tmp = tempfile.mkstemp(dir=path.parent, prefix="." + path.name + ".", suffix=".tmp")
    try:
        with os.fdopen(fd, "w", encoding="utf-8", newline="") as f:
            f.write(text)
        if path.exists():
            shutil.copymode(path, tmp)
        else:
            os.chmod(tmp, 0o644)
        os.replace(tmp, path)
    except BaseException:
        if os.path.exists(tmp):
            os.unlink(tmp)
        raise


def now():
    return datetime.datetime.now().isoformat(timespec="seconds")


def shown_path(p):
    p = Path(p).resolve()
    try:
        return str(p.relative_to(Cfg.root))
    except ValueError:
        return str(p)


def notes_path(rel):
    return Cfg.notes / (Path(rel).stem + ".json")


def load_notes(rel):
    p = notes_path(rel)
    d = json.loads(read(p)) if p.exists() else {}
    d.setdefault("file", rel)
    d.setdefault("next", 1)
    d.setdefault("flags", [])
    d.setdefault("edits", [])
    return d


def save_notes(rel, d):
    Cfg.notes.mkdir(parents=True, exist_ok=True)
    write(notes_path(rel), json.dumps(d, indent=1, ensure_ascii=False) + "\n")


def say(*parts):
    print(datetime.datetime.now().strftime("%H:%M:%S"), *parts, flush=True)


def short(s, n=60):
    s = re.sub(r"\s+", " ", html.unescape(re.sub(r"<[^>]*>", "", s))).strip()
    return s if len(s) <= n else s[:n - 1] + "…"


# ---------------------------------------------------------------------------------------------------------------
# Edits
# ---------------------------------------------------------------------------------------------------------------

ENTITY = re.compile(r"&(?:[A-Za-z][A-Za-z0-9]*|#\d+|#[xX][0-9A-Fa-f]+);")


def tidy(new, old):
    """The browser's serialisation of the edited words, put back in the file's own spelling where it can be."""
    new = re.sub(r'\s+data-(?:ed|ln)="\d*"', "", new)
    new = re.sub(r"</?ed-run\b[^>]*>", "", new)
    for ent in set(ENTITY.findall(old)) - {"&amp;", "&lt;", "&gt;", "&nbsp;"}:
        ch = html.unescape(ent)                     # &minus; stays &minus;, not a bare −
        if len(ch) == 1:
            new = "".join(p if p.startswith("<") else p.replace(ch, ent) for p in re.split(r"(<[^>]*>)", new))
    lead, trail = old[:len(old) - len(old.lstrip())], old[len(old.rstrip()):]
    return lead + new.strip() + trail


def locate(cur, at, text):
    if cur[at:at + len(text)] == text:
        return at
    if cur.count(text) == 1:
        return cur.index(text)
    return None


def apply_edit(rel, s, e, old, new, known_hash=None, meta=None):
    path = Cfg.root / rel
    with LOCK:
        cur = read(path)
        if cur[s:e] != old:
            s = locate(cur, s, old)
            if s is None:
                raise Refused(409, "These words have changed in the file since the page loaded. Reload the page and try again.")
        new = tidy(new, old)
        if new == old:
            return {"ok": True, "same": True}
        if not html.unescape(re.sub(r"<[^>]*>", "", new)).strip():
            raise Refused(400, "Empty words are not saved. Flag them to have them cut.")
        out = cur[:s] + new + cur[s + len(old):]
        write(path, out)
        notes = load_notes(rel)
        meta = meta or {}
        edit = {"id": f"e{len(notes['edits']) + 1}", "time": now(), "line": cur.count("\n", 0, s) + 1, "pos": s,
                "stage": meta.get("stage", ""), "kind": meta.get("kind", ""), "tag": meta.get("tag", ""),
                "old": old, "new": new}
        notes["edits"].append(edit)
        save_notes(rel, notes)
    say(f"edit  {rel}:{edit['line']}  “{short(old)}” → “{short(new)}”")
    return {"ok": True, "s": s, "e": s + len(new), "src": new, "html": new, "delta": len(new) - len(old),
            "hash": digest(out), "stale": known_hash is not None and known_hash != digest(cur), "edit": edit}


def undo_edit(rel, eid):
    path = Cfg.root / rel
    with LOCK:
        notes = load_notes(rel)
        edit = next((x for x in notes["edits"] if x["id"] == eid), None)
        if not edit or edit.get("undone"):
            raise Refused(400, "That edit is already undone.")
        cur = read(path)
        at = locate(cur, edit["pos"], edit["new"])
        if at is None:
            raise Refused(409, "Those words have changed again since that edit. Undo the later edit first.")
        write(path, cur[:at] + edit["old"] + cur[at + len(edit["new"]):])
        edit["undone"] = now()
        save_notes(rel, notes)
    say(f"undo  {rel}:{edit['line']}  back to “{short(edit['old'])}”")
    return {"ok": True, "edit": edit}


# ---------------------------------------------------------------------------------------------------------------
# Flags
# ---------------------------------------------------------------------------------------------------------------

def put_flag(rel, f):
    with LOCK:
        notes = load_notes(rel)
        old = next((x for x in notes["flags"] if x["id"] == f.get("id")), None) if f.get("id") else None
        if old:
            if "note" in f:
                old["note"] = str(f["note"]).strip()
            if f.get("status") in ("open", "done"):
                old["status"] = f["status"]
                old["done"] = now() if f["status"] == "done" else None
            old["updated"] = now()
            flag = old
        else:
            n = notes["next"]
            notes["next"] = n + 1
            flag = {"id": f"{Path(rel).stem}.{n}", "n": n, "time": now(), "status": "open",
                    "note": str(f.get("note") or "").strip(), "where": f.get("where") or {},
                    "settings": f.get("settings") or {}, "pictures": []}
            for i, url in enumerate((f.get("pictures") or [])[:6], 1):
                m = re.match(r"data:image/png;base64,([A-Za-z0-9+/=]+)$", url or "")
                if not m:
                    continue
                img = Cfg.notes / "img" / f"{flag['id']}-{i}.png"
                img.parent.mkdir(parents=True, exist_ok=True)
                img.write_bytes(base64.b64decode(m.group(1)))
                flag["pictures"].append(shown_path(img))
            notes["flags"].append(flag)
        save_notes(rel, notes)
    say(f"flag  {flag['id']}  {flag['status']}  {(flag.get('where') or {}).get('path', '')}  “{short(flag['note'], 80)}”")
    return {"ok": True, "flag": flag}


def delete_flag(rel, fid):
    with LOCK:
        notes = load_notes(rel)
        flag = next((x for x in notes["flags"] if x["id"] == fid), None)
        if not flag:
            raise Refused(404, "No such flag.")
        notes["flags"].remove(flag)
        for p in flag.get("pictures") or []:
            q = Cfg.root / p if not os.path.isabs(p) else Path(p)
            if q.is_file() and Cfg.notes in q.resolve().parents:
                q.unlink()
        save_notes(rel, notes)
    say(f"flag  {fid}  deleted")
    return {"ok": True}


def flags_md(rels):
    """The open flags as a message to Claude: JM's words quoted, each pinned to its element."""
    parts = []
    for rel in rels:
        notes = load_notes(rel)
        open_ = [f for f in notes["flags"] if f.get("status") != "done"]
        if not open_:
            continue
        parts.append(f"## {rel}: {len(open_)} open  ({shown_path(notes_path(rel))})")
        for f in open_:
            w = f.get("where") or {}
            at = f"{rel}:{w['line']}" if w.get("line") else rel
            parts.append(f"\n**{f['id']}** · {w.get('path') or w.get('what') or '?'} · `{at}`"
                         + (f" · `{w['selector']}`" if w.get("selector") else ""))
            parts += ["> " + ln for ln in (f.get("note") or "(no note)").splitlines()]
            if w.get("text"):
                parts.append(f"- on the page: “{w['text']}”")
            if f.get("settings"):
                parts.append("- settings: " + ", ".join(f"{k} {v}" for k, v in f["settings"].items()))
            if f.get("pictures"):
                parts.append("- pictures: " + ", ".join(f["pictures"]))
        parts.append("")
    if not parts:
        return "No open flags.\n"
    return ("Open flags from the lesson editor: JM's notes, quoted. A line number is where the element sat when it "
            "was flagged.\n\n" + "\n".join(parts))


# ---------------------------------------------------------------------------------------------------------------
# The editor's own home page
# ---------------------------------------------------------------------------------------------------------------

def natural(rel):
    m = re.match(r"(\D*)(\d+)(\D*)", Path(rel).stem)
    return (Path(rel).parent.name != "lessons", m.group(1), int(m.group(2)), m.group(3)) if m else (True, rel, 0, "")


def page_list():
    out = []
    for folder in ("lessons", "scaffolds", "interactives"):
        d = Cfg.root / "app" / folder
        if d.is_dir():
            out += [f"app/{folder}/{p.name}" for p in d.glob("*.html")]
    return sorted(out, key=lambda r: ({"lessons": 0, "scaffolds": 1}.get(Path(r).parent.name, 2), natural(r)))


def locks():
    out = {}
    p = Cfg.root / "LOCKS.txt"
    if p.exists():
        for line in read(p).splitlines():
            m = re.match(r"^([A-Za-z][\w-]*)\s+([oxOX])\b\s*(.*)$", line.strip())
            if m:
                out[m.group(1)] = (m.group(2).lower(), m.group(3))
    return out


def page_key(rel):
    stem = Path(rel).stem
    m = re.match(r"^(s\d+)_", stem)
    return m.group(1) if m else stem


def home():
    lk, rows, group = locks(), [], None
    for rel in page_list():
        g = Path(rel).parent.name
        if g != group:
            group = g
            rows.append(f'<tr><th colspan="4">{ {"lessons": "Lessons", "scaffolds": "Scaffolds"}.get(g, "Interactives") }</th></tr>')
        notes = load_notes(rel) if notes_path(rel).exists() else {"flags": [], "edits": []}
        nf = sum(1 for f in notes["flags"] if f.get("status") != "done")
        ne = sum(1 for e in notes["edits"] if not e.get("undone"))
        state, title = lk.get(page_key(rel), ("o", ""))
        rows.append(
            f'<tr><td><a href="/{rel}?preview=1">{html.escape(Path(rel).stem)}</a>{" <span class=lock>locked</span>" if state == "x" else ""}</td>'
            f'<td>{html.escape(title)}</td><td class=n>{f"<b>{nf}</b> open" if nf else ""}</td>'
            f'<td class=n>{f"{ne} edits" if ne else ""}</td></tr>')
    return f"""<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Lesson editor</title>
<style>
  body {{ margin:0; font:15px/1.45 -apple-system,BlinkMacSystemFont,"Helvetica Neue",sans-serif; background:#fafaf7; color:#1d1d1b; }}
  main {{ max-width:980px; margin:0 auto; padding:24px; }}
  h1 {{ font-size:20px; margin:0 0 6px; }}
  p {{ margin:0 0 10px; color:#3d3d3a; }}
  table {{ border-collapse:collapse; width:100%; margin-top:14px; background:#fff; border:1px solid #e2e0d9; border-radius:6px; }}
  th {{ text-align:left; font-size:12px; text-transform:uppercase; letter-spacing:.06em; color:#6b6b68; padding:14px 10px 6px; }}
  td {{ padding:5px 10px; border-top:1px solid #f2f0e8; font-size:14px; vertical-align:top; }}
  td.n {{ white-space:nowrap; color:#b23a48; }} td.n:last-child {{ color:#2f6b8f; }}
  a {{ color:#2f6b8f; font-weight:600; text-decoration:none; }} a:hover {{ text-decoration:underline; }}
  .lock {{ font-size:11px; color:#6a5018; background:#f0ece0; border:1px dashed #b4a06a; border-radius:3px; padding:0 4px; margin-left:4px; }}
  button {{ font:inherit; font-size:13px; background:#fff; border:1px solid #d6d3ca; border-radius:4px; padding:5px 10px; cursor:pointer; }}
  button:hover {{ background:#f4f2ec; }}
  code {{ font:12.5px ui-monospace,Menlo,monospace; background:#efeee8; padding:1px 4px; border-radius:3px; }}
</style></head><body><main>
<h1>Lesson editor</h1>
<p>Open a page, then pick a mode in the bar at the bottom left. <b>Edit text</b> (Alt+E): click words and type; Enter
saves them into the lesson's file. Click an ⓘ mark to rewrite its hover text. <b>Flag</b> (Alt+F): click a box, plot,
slider or target and say what needs doing. <b>Use</b> (Alt+U, or Esc): the page as a student has it.</p>
<p>Flags and the edit log are kept in <code>{html.escape(shown_path(Cfg.notes))}/</code>. To hand them on, tell Claude
"work through my flags on lesson 21", or copy them here.</p>
<p><button id="copy">Copy every open flag for Claude</button> <span id="said"></span></p>
<table>{"".join(rows)}</table>
</main>
<script>
document.getElementById("copy").addEventListener("click", async () => {{
  const t = await (await fetch("/__editor/api/flags.md")).text();
  try {{ await navigator.clipboard.writeText(t); document.getElementById("said").textContent = "Copied."; }}
  catch (e) {{ document.getElementById("said").textContent = "Copy failed: " + e.message; }}
}});
</script></body></html>"""


# ---------------------------------------------------------------------------------------------------------------
# The server
# ---------------------------------------------------------------------------------------------------------------

class Handler(http.server.SimpleHTTPRequestHandler):
    server_version = "EvoEditor/1"

    def __init__(self, *a, **k):
        super().__init__(*a, directory=str(Cfg.root), **k)

    def log_message(self, fmt, *args):
        pass

    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        super().end_headers()

    def _host_ok(self):
        # a page on another site cannot reach this server through a renamed host (DNS rebinding)
        return self.headers.get("Host", "") in Cfg.hosts

    def _send(self, status, body, ctype):
        data = body.encode("utf-8") if isinstance(body, str) else body
        self.send_response(status)
        self.send_header("Content-Type", ctype)
        self.send_header("Content-Length", str(len(data)))
        self.end_headers()
        self.wfile.write(data)

    def _json(self, status, obj):
        self._send(status, json.dumps(obj, ensure_ascii=False), "application/json; charset=utf-8")

    def do_GET(self):
        if not self._host_ok():
            return self.send_error(403)
        url = urllib.parse.urlsplit(self.path)
        p, q = urllib.parse.unquote(url.path), urllib.parse.parse_qs(url.query)
        if p in ("/", "/__editor", "/__editor/"):
            return self._send(200, home(), "text/html; charset=utf-8")
        if p in ("/__editor/editor.js", "/__editor/editor.css"):
            name = p.rsplit("/", 1)[1]
            return self._send(200, read(HERE / name), ("text/javascript" if name.endswith(".js") else "text/css") + "; charset=utf-8")
        if p == "/__editor/api/flags":
            rel = (q.get("file") or [""])[0]
            if not PAGES.match(rel):
                return self._json(400, {"error": "not a lesson page"})
            notes = load_notes(rel)
            return self._json(200, {"flags": notes["flags"], "edits": notes["edits"]})
        if p == "/__editor/api/flags.md":
            rels = [r for r in (q.get("file") or []) if PAGES.match(r)] or page_list()
            return self._send(200, flags_md(rels), "text/plain; charset=utf-8")
        rel = p.lstrip("/")
        if PAGES.match(rel) and (Cfg.root / rel).is_file():
            if q.get("preview") != ["1"]:           # lock.js would hide a locked page from its own editor
                q["preview"] = ["1"]
                self.send_response(302)
                self.send_header("Location", p + "?" + urllib.parse.urlencode(q, doseq=True))
                self.end_headers()
                return
            served, _ = build(rel, read(Cfg.root / rel))
            return self._send(200, served, "text/html; charset=utf-8")
        return super().do_GET()

    def do_POST(self):
        origin = self.headers.get("Origin")
        if (not self._host_ok() or self.headers.get("X-Evo-Editor") != "1"
                or (origin and urllib.parse.urlsplit(origin).netloc not in Cfg.hosts)):
            return self._json(403, {"error": "refused"})
        n = int(self.headers.get("Content-Length") or 0)
        if n > 40_000_000:
            return self._json(413, {"error": "too large"})
        try:
            body = json.loads(self.rfile.read(n) or b"{}")
            rel = body.get("file", "")
            if not PAGES.match(rel) or not (Cfg.root / rel).is_file():
                return self._json(400, {"error": "not a lesson page"})
            route = urllib.parse.urlsplit(self.path).path
            if route == "/__editor/api/edit":
                out = apply_edit(rel, int(body["s"]), int(body["e"]), body["src"], body["html"], body.get("hash"), body.get("meta"))
            elif route == "/__editor/api/undo":
                out = undo_edit(rel, body["id"])
            elif route == "/__editor/api/flag":
                out = put_flag(rel, body["flag"])
            elif route == "/__editor/api/flag-delete":
                out = delete_flag(rel, body["id"])
            else:
                return self._json(404, {"error": "no such call"})
        except Refused as x:
            return self._json(x.status, {"error": x.msg})
        except (KeyError, TypeError, ValueError) as x:
            return self._json(400, {"error": f"bad request: {x}"})
        self._json(200, out)


def main():
    ap = argparse.ArgumentParser(description="The lesson editor: rewrite a page's words where they sit, flag what needs doing.")
    ap.add_argument("--port", type=int, default=int(os.environ.get("EVO_EDITOR_PORT", 8770)))
    ap.add_argument("--flags", nargs="*", metavar="PAGE", help="print the open flags (every page, or lesson21 ...) and exit")
    ap.add_argument("--root", type=Path, default=REPO, help=argparse.SUPPRESS)      # the tests serve a copy
    ap.add_argument("--notes", type=Path, default=None, help=argparse.SUPPRESS)
    a = ap.parse_args()
    Cfg.root = a.root.resolve()
    Cfg.notes = (a.notes or Cfg.root / "notes" / "flags").resolve()
    if a.flags is not None:
        rels = page_list()
        if a.flags:
            rels = [r for r in rels if Path(r).stem in a.flags or page_key(r) in a.flags or r in a.flags]
        sys.stdout.write(flags_md(rels))
        return
    Cfg.hosts = {f"127.0.0.1:{a.port}", f"localhost:{a.port}"}
    try:
        srv = http.server.ThreadingHTTPServer(("127.0.0.1", a.port), Handler)
    except OSError as x:
        sys.exit(f"Port {a.port} is taken ({x.strerror}). Is the editor already running? Or try --port {a.port + 1}.")
    print(f"Lesson editor: http://127.0.0.1:{a.port}/   (Ctrl-C stops it)", flush=True)
    try:
        srv.serve_forever()
    except KeyboardInterrupt:
        print("\nstopped")


if __name__ == "__main__":
    main()
