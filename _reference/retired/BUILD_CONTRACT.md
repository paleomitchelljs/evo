# BUILD_CONTRACT.md

The binding document for anyone — human or agent — building or revising a unit.
`structurephilosophy.md` says why. This says what, and refuses what.

Read this first: **a first draft has never passed.** Not once. The gates below
were written by watching ordinary, competent, well-intentioned drafts fail in the
same nine or ten ways, and every gate is one of those ways made mechanical. If
your draft comes back clean on round one, the draft is not what impressed anyone —
your audit is what failed. `units/_draft0_L8.json` is a realistic first draft of
unit 12. It reads fine. It has nineteen hard failures. Run it and look.

---

## 1. Definition of done

A unit is done when **all four** hold. Not three.

1. `python3 validate.py ledger.json units/*.json` exits 0 with the full build
   present, and the run output is pasted into the unit's PR.
2. The unit's `audit.round` is at least 2, with passes A, B, C and D all present,
   each carrying findings and the edits those findings caused.
3. Every finding in every pass is either fixed in the spec or listed in
   `UNRESOLVED.md` with a reason a person can argue with.
4. A human signs off. The agent does not certify its own work; the validator
   certifies the mechanical half and a person certifies the rest.

The agent may not report a unit as done on any other basis. "It passes the
validator" is not done. "It looks good" is not anything.

---

## 2. The build protocol

Per unit, in this order. Skipping a step is a build failure, not a shortcut.

```
draft-0  ──▶  validate  ──▶  pass A  ──▶  pass B  ──▶  pass C  ──▶  pass D
                                                                      │
   ┌──────────────────────────────────────────────────────────────────┘
   ▼
draft-1  ──▶  validate  ──▶  passes A–D again, on the NEW text
   │
   ▼
draft-2  ──▶  validate green  ──▶  human sign-off  ──▶  done
              (or round 3, then escalate)
```

**Round 2 is a floor, not a target.** The second round exists because round 1 is
spent fixing what the validator already named, which is the easy half. Round 2 is
where the passes find what a machine can't see: the `reuses` field that is
technically true and pedagogically empty, the last dataset that measures nothing
because it's famous. Both of those are real findings from the exemplar's round 2.

**Stop condition.** Three rounds. If a unit isn't green after three, stop. Do not
start round four, and do not weaken the unit until it fits. Write the unresolved
items to `UNRESOLVED.md` and escalate. A unit that needs four rounds is usually
telling you the sequence is wrong around it — that it wants to be two units, or
that it needs a rung in front of it that doesn't exist yet. That is a curricular
decision and it is not yours to make quietly.

---

## 3. The four passes

Each pass produces an entry in `audit.passes` with `findings` and `edits`. A pass
with zero findings must carry a `justification` string, and the validator will
reject the entry without one. This is deliberate: zero findings is a *claim about
the draft*, and claims get defended.

### Pass A — the cold novice

Reconstruct the exact vocabulary available at this position. It is not a
judgement call: it is every ledger term whose `unlock` unit has a lower `seq`,
and nothing else. Write that list into the audit entry.

Now read every on-screen string as a student who has that list and nothing more.
For each string, name every token they cannot parse. Every one is an edit or a
new rung — those are the only two outcomes. "They'll pick it up from context" is
not an outcome. "It's common knowledge" is not an outcome; a student with no
background has no common knowledge and that is the entire premise.

### Pass B — licensing

For each step the unit asks the student to take, name the earlier unit that
licenses it, by index. Not "this builds on regression" — *unit 4, the leftovers
the student drew by hand.* A step with no license has three legal fixes: insert a
rung, move the unit later, or cut the step. Inventing the license is not one.

Same pass, the other direction: check that `break.door_to` points forward and
that the unit it points at genuinely handles the break. A door that points at a
unit which doesn't resolve the break is worse than no door — it's a promise the
sequence breaks forty minutes later.

### Pass C — the giveaway

Hunt every sentence that states, hints, or paraphrases the takeaway. Delete it.
The validator catches the aphorism verbatim, a 70%-content-word paraphrase, and
the giveaway phrase list. It cannot catch the sentence that structurally hands
over the point without reusing a word of it. That's this pass.

The specific temptation: the aphorisms are quotable. *A resemblance is a slope.*
*The baseline is the ruler.* They are quotable because they are the answer, and
the answer is exactly the thing the student is here to produce. Printing it is
not a summary — it's the theft of the only thing the unit was for.

Also in scope: the break stage that says "now set the noise to zero" instead of
letting the student find the setting. Telling a student where to look is telling
them what they'll see.

### Pass D — transfer

Take the last dataset — the unscaffolded one. Ask: can a student get through it
by pattern-matching the previous screen, without running the move? If yes, it
measures nothing and it gets replaced. Two specific failure shapes, both from the
exemplar:

- **The famous dataset.** Galton's heights as the *unscaffolded* set is worthless;
  it's recognisable from any textbook and can be recited rather than solved. As
  the *scaffolded* real-data stage, being canonical is a feature. Placement is the
  whole difference.
- **One subject wearing two names.** Two height datasets are one dataset. The
  subject has to change or the move isn't what got remembered.

---

## 4. The unit spec

One JSON file per unit in `units/`. `units/L8.json` is the exemplar; diff it
against `units/_draft0_L8.json`. Fields prefixed `_` are notes for humans and are
ignored by the validator.

| field | type | notes |
|---|---|---|
| `seq` | int | position in the sequence, 1–47, unique |
| `id` | string | stable id, e.g. `L8`, `S-weld`, `C1` |
| `arc` | int | 1–5, used for the minutes budget |
| `kind` | `arc` \| `drill` \| `checkpoint` | drills run exactly 5 datasets over ≥3 subjects |
| `title` | string | names the move; may contain no ledger term at all |
| `move_id` | string | the payload. Shared across units that run the same move — this is what makes "named only after 3 prior runs" checkable |
| `move` | string | one sentence |
| `aphorism` | string | the answer key. Never on screen, in any paraphrase |
| `minutes` | int | honest estimate; summed against the arc budget |
| `requires` | [id] | units whose artifact is reused or move presupposed; all must be earlier |
| `reuses` | `{from, artifact}` | mandatory after unit 1. `artifact` names the *thing the student made*, not the unit |
| `names_terms` | [term] | ≤1, must match the ledger's unlock, needs ≥3 prior runs of `move_id` |
| `stages` | [6] | roles exactly `orient, predict, act, rebuild, real, break` |
| `datasets` | [obj] | `{name, subject, scaffolded}`; last one `scaffolded: false` |
| `analogy` | `{trigger, text}` | `trigger` must be `on_demand` |
| `break` | `{case, door_to}` | `door_to` points forward, or `terminal` for unit 47 |
| `code_panel` | `{present, control_to_line}` | every unlocked control maps to a line |
| `audit` | obj | round ≥2, passes A–D |

Stage fields: `onscreen` (the text), `controls_unlocked` (list),
`answerable_from` (orient only, must be `picture_only`), `records_guess` (predict),
`confronts_guess` (act), `student_constructs` (rebuild), `accepts_nonsense` (at
least one stage), `dataset` (real).

---

## 5. The gates

All mechanical, all in `validate.py`, none negotiable. Listed so a failure code
means something.

| gate | rule | why it exists |
|---|---|---|
| G1 | `seq` is 1..47, unique | the sequence is the design |
| G2 | every `requires` is earlier | no forward dependencies, ever |
| G3 | `reuses` names a real earlier unit and a real artifact | "builds on" is not a relationship; reopening a drawing is |
| G4 | stages are exactly the six roles in order | the shape *is* the scaffolding |
| G5 | orient ≤40 words, `picture_only`, no controls, no mechanism words | you cannot predict what you cannot read |
| G6 | predict records the guess, controls still locked | a prediction you can slink away from isn't one |
| G7 | act unlocks exactly one control and confronts the guess | two controls means no attribution |
| G8 | no on-screen text uses a term before its unlock; `unlock: null` terms are banned everywhere | the ratchet |
| G9 | the title contains no ledger term | titles name the move |
| G10 | ≤1 term named per unit, matching the ledger, after ≥3 prior runs of the move | the name lands as recognition or not at all |
| G11 | the aphorism appears on screen neither verbatim nor at ≥70% content-word overlap | the answer key is not a caption |
| G12 | no giveaway phrase on screen | "as you can see" is where derivation goes to die |
| G13 | a break exists and its door points forward | the break opens a door |
| G14 | some stage accepts a nonsensical setting | the model must be allowed to fall over |
| G15 | ≥2 datasets over ≥2 subjects (drills: exactly 5 over ≥3); last one unscaffolded | one move, many datasets; the last is the measurement |
| G16 | `analogy.trigger == on_demand` | a handhold, not a wall |
| G17 | every unlocked control maps to a code-panel line | a slider with no line is a spell |
| G18 | audit round ≥2, passes A–D present, findings have edits, zero findings has a justification | forces the revision |
| G19 | ≤20 terms named across the course | names are cheap and they hide gaps |
| G20 | each arc's minutes ≤ its budget | fifteen hours is the bill; it does not drift upward |

The validator prints `NOT GREEN` for a partial build even at zero failures. That
is correct. G8, G10, G19 and G20 cannot be judged from a slice — a term that looks
unlocked might be unlocked by a unit nobody wrote yet.

---

## 6. Editing the ledger

`ledger.json` is a curricular decision, not a build decision.

An agent blocked by G8 or G10 has exactly two legal moves: **rewrite the text** to
say the thing without the word, or **file it in `UNRESOLVED.md`** and escalate. It
does not have a third. Specifically:

- Do not add an `unlock` to a `null` term to buy room. Those terms are `null`
  because the course decided not to spend a name on them.
- Do not move an unlock earlier because a unit wants the word. That inverts the
  entire design: the word arrives when the move has been run, not when the prose
  gets awkward.
- Do not add a term to the ledger so it stops being flagged. The ledger is a
  denylist with unlock dates, not a glossary; adding a term makes it *more*
  controlled, and if you're adding one to make an error go away you have
  misunderstood which direction it points.
- Do not raise `arc_budgets_minutes`. If an arc is over, cut or merge a unit and
  say which.

Twenty names across forty-seven units means most candidate terms don't survive.
That is the intent. The pressure to spend a name is the pressure the design is
built to resist, and an agent that relieves that pressure by editing the ledger
has defeated the whole thing while turning the build green.

---

## 7. The agent's instruction block

Paste this to a build agent, along with `structurephilosophy.md`, `ledger.json`,
`validate.py`, and both L8 files.

> You are building unit [N] of a fixed 47-unit sequence. The student has done
> units 1 through N−1 and nothing else. They have no background.
>
> 1. Read `structurephilosophy.md` and this contract. Read `units/L8.json` and
>    `units/_draft0_L8.json` and diff them; the draft is what you are about to
>    write, and the exemplar is what it has to become.
> 2. Write draft-0. Do not polish it. Polish at this stage is wasted, because
>    passes A–D will take most of it apart.
> 3. Run `python3 validate.py ledger.json units/*.json`. Paste the output.
> 4. Run passes A, B, C, D in order. Write findings into `audit.passes` before
>    you edit anything — findings first, then edits, never in the same motion.
> 5. Write draft-1. Re-run the validator. Re-run all four passes on the new text,
>    not on your memory of the old one.
> 6. Write draft-2. If green, stop and hand to a human with the validator output
>    and the audit. If not green after round 3, stop and escalate; do not weaken
>    the unit to fit.
>
> Constraints that will trip you if you skim:
> - Your orient stage will want to mention the mechanism. It may not.
> - Your rebuild stage will want to state the point. It may not.
> - Your title will want the technical term. It may not have it.
> - Your last dataset will want to be the famous one. It may not be.
> - Your ledger will look like it has an obvious small fix. It does not.
>
> You may not report the unit as done. You may report it as green and hand it on.

---

## 8. Files

```
structurephilosophy.md         why, and the 47-unit sequence
BUILD_CONTRACT.md              this file
ledger.json                    term unlocks, banned terms, budgets
validate.py                    the gate (python3, stdlib only)
units/L8.json                  the exemplar: unit 12, green, round 2
units/_draft0_L8.json          the same unit as an ordinary first draft: 19 failures
UNRESOLVED.md                  where escalations go
```
