# Copy framework — plan

**Status: deferred.** Written 2026-09-02, to be picked up the weekend of 6–7 September
or the week after. Nothing here is built yet.

> **Read §4 and §7.4 with a correction, as of 2026-09-17.** This plan was written when
> `check_lessons.py` still ran a vocabulary ratchet and giveaway checks as **hard
> failures**, and §4's argument — "move copy into a JSON block and the gate goes blind"
> — rests on that. It no longer holds as written: the ratchet was retired 2026-09-03,
> and prose checks are now advisory `--style` / `--terms` reports that block nothing.
>
> The §4 conclusion survives with a smaller stake. Going blind to 1,825 strings still
> makes both reports useless, and the **structural** checks (undefined helpers, declared-
> but-unwritten scoring slots, `LOCKS.txt` coverage) are the real hard failures and do
> not read prose at all — so nothing silently stops *failing*, it stops *reporting*.
> Teach `extract()` about `#copy` anyway, and keep the three new hard failures proposed
> there, which are structural and are the valuable half. §7.4's "live ratchet" is now a
> live **report**; under the current rule — no vocabulary taught at all — a warn-while-
> typing term check is arguably worth more than it was, not less. `PROJECT_NOTES.md` §4.

"Copy" means the student-facing words — the advertising sense, nothing to do with
duplicates. The goal is that every word a student reads lives in one addressable place
per lesson, instead of being welded into markup and JavaScript across a 1,000–1,400 line
file.

---

## 1. Why

To change one sentence today you have to find it inside the lesson file, where it may be
in the markup, in a JavaScript string literal, or in a template literal inside a download
handler. Measured across the shipped pages:

| | strings in markup | strings in JS | total |
|---|---|---|---|
| 30 lessons | 1,319 | 138 | 1,457 |
| 24 scaffolds | 140 | 228 | 368 |
| **total** | **1,459** | **366** | **1,825** |

The JS ones are the expensive half: verdict text, solved-banners, task hints, tracker
labels. They cannot be edited without reading code, they are invisible to any search of
the visible page, and they are where the September editing sessions kept snagging.

Three things fall out of fixing it:

1. **JM can read or change a whole lesson's text in one file** without touching code.
2. **The lesson editor becomes possible** — a browser tool needs addressable strings to
   edit. See §7.
3. **The source audit stops being manual.** Every spliced sentence can be diffed against
   the quote corpus automatically, which is what caught the invented prose on 2026-09-01
   only after it had shipped.

## 2. Shape

One JSON block per lesson, at the top of the file:

```html
<script type="application/json" id="copy">
{
  "C.voice.1": "The bigger the data set, the easier it is to find a clear difference…",
  "C.setup.1": "n females and n males, drawn from the same 7,414.",
  "C.task.2":  "Land a handful where the adjustment for males comes out negative.",
  "C.solved":  "Stage D is open.",
  "C.numq.wrong": "Not that one. Watch the band shrink as you turn the number up."
}
</script>
```

Markup carries the key and nothing else:

```html
<p data-copy="C.voice.1"></p>
```

and JavaScript asks for it:

```js
showSolved("C", Copy.get("C.solved"));
```

**Keys** are `stage.slot.index` — stable, append-only, never renumbered, because an edit
file or an editor session refers to them. `docs/LESSON_ATLAS.md` can cite them directly.

**`app/assets/copy.js`** (new, ~60 lines) walks `[data-copy]` on load, fills each element,
and exposes `Copy.get(key)`. It must be **optional**: a page with no `#copy` block behaves
exactly as it does today. That is what makes a page-at-a-time migration safe.

### Why in the file rather than a separate `lessonN.copy.json`

The repo is static, `.nojekyll`, no build step, and a lesson is one self-contained file
that also has to work behind `lock.js` and from `file://`. A sidecar JSON would add a
fetch, a failure mode, and a second thing to keep in sync. Keeping it inline preserves the
existing invariant.

## 3. The constraint that decides the design

`scripts/check_lessons.py` strips `<script>` before it looks at anything:

```python
for tag in ("script", "style", "pre", "code", "template", "head"):
```

So the moment copy moves into a JSON script block, **the prose reports go blind to all
1,825 strings** and keep printing nothing. *(As written in September 2026 this said "the
vocabulary ratchet, the giveaway-phrase check and the front/back-matter checks" and called
it a hard failure going silent. Those were retired as failures on 2026-09-03 and are now
`--style` / `--terms` reports — see the banner at the top. The point still stands for the
reports, and the structural hard failures never read prose.)*

**Therefore the gate is changed first, before a single lesson is migrated.**

Changes to `check_lessons.py`:

- `extract()` additionally parses `#copy` and appends every string value to the prose it
  checks. Everything downstream — `--terms`, giveaways, jargon warnings — then works
  unchanged.
- New hard failure: a page that has `data-copy` attributes but no parseable `#copy` block.
- New hard failure: a `data-copy` key with no entry, or an entry no key uses (catches drift
  in both directions).
- New hard failure: a page with a `#copy` block that does not load `copy.js`.

## 4. Migration

`scripts/extract_copy.py` (new) does the mechanical half per file: lift markup text nodes
into the block, insert `data-copy` attributes, emit a starting JSON.

The JS strings cannot be lifted automatically — template literals with `${}` interpolation
need judgement about what is copy and what is a computed number — so those are done by hand,
per lesson, at roughly 20 minutes each.

**Per lesson:** run the extractor, hand-lift the JS strings, read the diff, run the gate,
drive the lesson end to end in a browser, commit. Copy changes touch no scoring, so **no
`version:` bump and no passcode invalidation** — unlike most of the September work.

**Do not big-bang all 54 pages.** Migrate lessons 1–4 to prove the mechanism, then migrate
on touch: any page being edited for other reasons gets converted in the same commit. Lessons
21–35 are mostly skeletons and can wait indefinitely.

## 5. Effort

| step | what | cost |
|---|---|---|
| 1 | `copy.js`, gate changes, extractor script | half a day, no lesson touched |
| 2 | lessons 3 and 4 — the proof, and the two under active revision | ~1 h each |
| 3 | lessons 1, 2, 5, 7 — the rest of the built-and-open set | ~1 h each |
| 4 | everything else, on touch | no scheduled cost |

Stopping after step 2 is a legitimate outcome: the mechanism exists, the two live lessons
are editable, and nothing is half-done in a way that breaks.

## 6. What can go wrong

- **Gate blindness** — §3. Mitigated by ordering, and by making the missing-block case a
  hard failure rather than a silent skip.
- **Key churn.** Renaming or renumbering keys breaks any saved edit file. Keys are
  append-only; a removed string leaves its key retired, never reused.
- **Blank page on a JS error.** With empty placeholders, a broken `#copy` block means no
  text. Acceptable: these lessons are already wholly JS-dependent — canvas, gating, scoring
  and the name prompt all fail together — so this adds no new class of failure. It is worth
  re-checking that judgement if a lesson ever ships mostly-prose.
- **A half-migrated repo.** Harmless by design, because `copy.js` is optional and the gate
  only enforces consistency on pages that have a block.

## 7. What it unlocks — the editor

Deferred separately, and only worth building after §2–3 exist:

1. **`?edit=1` overlay** — `app/assets/edit.js`, gated on the flag *and* `localhost`, so it
   can never reach students. Hover outlines editable regions; click edits in place; the
   interactives keep running because it is the real page.
2. **Edit files out.** Save writes a keyed, human-readable `edits/lesson3.2026-09-06.md`
   rather than rewriting HTML — JM's own suggestion, and the thing that removes the risky
   part. The DOM has been mutated by the running sim, so serialising it back would produce
   garbage diffs; keyed edits do not care.
3. **Corpus drawer.** Search the 1,551 quotes, click to insert, record the quote id so
   provenance is automatic. Build the index from `git show HEAD:quotes/*.yaml` in
   `quoteable` — never write there, and HEAD parses cleanly even when the working tree does
   not.
4. **Live term report.** `ledger.json` already ships, so the term and giveaway checks
   reimplement in ~100 lines of JS and warn while typing instead of at commit. *(Called a
   "live ratchet" when written; nothing ratchets any more, and the rule it would serve is
   now "no vocabulary at all" rather than "not yet".)*

## 8. Not in scope

Layout, interactives, scoring, and the R code panels stay in the lesson file. This is a
copy framework, not a CMS. The moment it starts wanting to own the canvas code, stop.
