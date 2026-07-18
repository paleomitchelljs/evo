# Overnight overhaul — morning review (2026-07-18)

**Short version.** All 34 lessons were overhauled to fit `structurephilosophy.md`
and now pass `scripts/check_lessons.py` with **0 hard failures**. Everything is
committed and pushed to `main`. The interactive form and the `Score` submission
code are preserved. Below: how it was kept honest, what got deep work vs. a
lighter pass, the decisions I made, and what still needs you.

## What I did

I treated the philosophy's own enforcement idea seriously: rather than hand-edit by
feel, I built **`scripts/check_lessons.py`**, which ports the machine-checkable
gates to the shipped lesson HTML — the vocabulary ratchet at *each lesson's true
position in the 47-unit sequence*, the giveaway-phrase ban, title-names-no-term,
the front/back-matter rules, and submission-code wiring. Every lesson I touched was
driven to 0 failures against it. Run it yourself:

```
python3 scripts/check_lessons.py
```

The old→new mapping matters: the 34 HTML lessons carry the 35 "L" units with an
offset (new **L3**, the flat-guess rung, is the one L-unit with no lesson yet).
The ratchet is checked at the new position, so e.g. Lesson 12 (selection
coefficient) is unit 13, and "drift" — which unlocks one unit earlier — is allowed
there but not in Lesson 9.

## Status by tier (be skeptical in this order)

- **Lessons 1–7 (Arc 1) — deep overhaul.** Foundation, where a gap is fatal.
  Show-don't-tell rewrites, not just jargon-stripping: e.g. Lesson 3's giraffe
  showcase now *asks* what the outsized leftover means instead of handing over the
  ancestry-vs-engineering conclusion; Lesson 7 (heritability) discovers slope =
  carry-over instead of naming h² up front. Lessons 1–2 were already close and were
  left largely intact.
- **Lessons 8–19 (Arcs 2–3) — full overhaul.** These had working simulators but
  heavy jargon and lecture-prose. Front/back matter stripped, the "One sentence to
  carry forward" closings (which printed the answer key) deleted, vocabulary
  reframed in plain language (chi-square → "how far the counts miss"; the null →
  "the shuffled pile"; etc.), two titles that named ledger terms rewritten
  (Lessons 11 and 15), covariance/Price naming pulled out of prose. Anchor quotes
  from your lectures were **kept** — they're the voice of the thing.
- **Lessons 20–34 (Arcs 4–5) — text-conformant + submission wired, simulators still
  pending.** These were draft skeletons (anchor quotes + `TODO:` markers, no
  interactivity, no `Score`). I made their *text* philosophy-compliant (removed
  draft banners and the answer-key closings, fixed empty `<h1>`s, retitled Lessons
  23/24/26 off ledger terms, dejargoned locked terms) and **wired the submission
  code** (name prompt + finish button + code panel) so each emits a passcode. The
  `TODO` markers and anchor quotes are intentionally left — these are honest
  outlines, not finished units. The landing page marks them "outlines (simulators
  pending)."

## Decisions I made (worth a look)

- **Covariance / Price thread → code panel, not prose.** Your June work deliberately
  named `cov(x,y)/var(x)` in the closers of Lessons 3/12/15/17. The July philosophy
  and `ledger.json` are stricter: "the identity" is named only at unit 38 (Lesson
  26). I reconciled by *preserving the thread as the recurring slope you keep
  fitting* and removing the premature naming from prose. If you want the breadcrumb
  back in those closers, that's a one-line-per-lesson revert — but the ratchet check
  will flag it.
- **Anchor quotes kept, "What you'll do" blocks cut.** The voice-notes doc bans
  outcome blocks, not the lecture quotes. So the rule I applied everywhere: kill the
  front-matter framing, keep the quote.
- **Retitled lessons** (landing + `<title>` + `<h1>` all updated): 11 "Reading a
  population's hidden size…", 15 "How far a population shifts when you breed from the
  extremes", 23 "How incompatibilities pile up…", 24 "Same outcome, three different
  histories", 26 "Splitting a change in the average into two pieces".
- **One checker fix:** bare single-letter aliases (gene flow's "m") were matching
  units like "100 m of chalk"; the checker now skips 1-char aliases.

## Verified in a real browser

Served locally and clicked through **Lesson 3** (heaviest edits — renders, no
console errors, name prompt + stage locks work) and **Lesson 21** (the new skeleton
`Score` wiring — name confirms and the passcode flow works). Label text changed but
element IDs and correct-answer `value=` tokens were left untouched, so scoring bits
are intact.

## What still needs you

1. **Warning-level jargon polish.** 0 *failures*, but the checker still emits
   *warnings* for unlocked terms left in prose (α/β/SSR in Lesson 3's warm-up;
   scattered `regression`, `mean`, `σ`). These are legal but the philosophy would
   rather they lived in the code panel. `python3 scripts/check_lessons.py` lists
   them per lesson.
2. **Lessons 20–34 simulators.** Still `TODO`. The text and submission plumbing are
   ready to build onto.
3. **Lesson 7 transfer dataset.** Its last stage is Galton — canonical, which is a
   *feature* as the scaffolded real-data stage but weak as the unscaffolded
   measurement (BUILD_CONTRACT Pass D). If you want a true transfer set, bighorn
   pedigree or salamander morphology data are in `data/clean/`.
3. **The `units/` JSON spec layer is unbuilt.** `BUILD_CONTRACT.md` references
   `units/L8.json` (exemplar) and `units/_draft0_L8.json` as if they exist; they
   don't. I did not build the 47 JSON specs — I focused on the lessons per your
   note. If you want the full spec/validator backbone, that's the natural next job,
   and `check_lessons.py` already encodes the old→new mapping it would need.
4. **New rungs with no lesson yet:** L3 (flat guess) and the inserted half-steps
   (L7a, L8a, L16a, L19a) and drills (S-weld, S-single, S-cond, S-agree) exist in
   the sequence but not as lessons; the four drills are covered by scaffolds
   s21–s24.

## Housekeeping

- Rewrote `README.md` (had been deleted) and the landing page for the new titles/
  status. Left `docs/LESSON_INDEX.md` and `docs/lesson-index-critique.md` deleted —
  superseded by `structurephilosophy.md`.
- Committed the framework files you'd left untracked (philosophy, contract, ledger,
  validator) so the overhaul builds on a committed baseline.
- `caffeinate` and a local `http.server` were running for the overnight session; you
  can kill them (`pkill caffeinate`, `pkill -f http.server`) if they're still up.
