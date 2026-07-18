#!/usr/bin/env python3
"""
validate.py -- the gate. A unit that does not pass this does not exist.

Usage:  python3 validate.py ledger.json units/*.json
Exit 0 = green. Exit 1 = at least one hard failure. There is no soft mode.

Every check here is mechanical. The checks that require judgment live in
BUILD_CONTRACT.md as passes A-D and are not automatable; this file exists so
that the automatable half cannot be talked around.
"""

import json, sys, re, glob
from collections import defaultdict

STOP = set("""a an the of to in on is are was were be been it its this that these those
and or but if then so as at by for from with without into out up down over under
you your they their we our i he she his her not no yes do does did done can could
what which who whom when where why how than too very just only also more most some
any all each every one two both same other another such own s t don now""".split())

ROLES = ["orient", "predict", "act", "rebuild", "real", "break"]

fails, warns = [], []
def F(uid, gate, msg): fails.append(f"[FAIL {gate}] {uid}: {msg}")
def W(uid, gate, msg): warns.append(f"[warn {gate}] {uid}: {msg}")

def norm(s):
    return re.sub(r"[^a-z0-9 ]+", " ", (s or "").lower())

def words(s):
    return [w for w in norm(s).split() if w]

def content(s):
    return set(w for w in words(s) if w not in STOP and len(w) > 2)

def onscreen_strings(u):
    out = [u.get("title", "")]
    for st in u.get("stages", []):
        out.append(st.get("onscreen", ""))
        for opt in st.get("options", []) or []:
            out.append(opt)
    a = u.get("analogy") or {}
    out.append(a.get("text", ""))
    return [s for s in out if s]

def main(ledger_path, unit_paths):
    L = json.load(open(ledger_path))
    COURSE_LEN = L.get("course_length")
    units = []
    for p in unit_paths:
        u = json.load(open(p))
        u["_path"] = p
        units.append(u)
    units.sort(key=lambda u: u.get("seq", 0))
    by_id = {u["id"]: u for u in units}
    seq_of = {u["id"]: u["seq"] for u in units}

    partial = (COURSE_LEN is not None and len(units) != COURSE_LEN)
    if partial:
        print(f"[partial build] {len(units)} of {COURSE_LEN} units present. "
              f"Cross-unit existence checks and course budgets are advisory here; "
              f"a partial build is never GREEN for shipping.")
    MISS = W if partial else F

    # ---- term table: term/alias -> (canonical, unlock_seq or None) -----------
    term_rows = []
    for term, meta in L["terms"].items():
        unlock_id = meta.get("unlock")
        if unlock_id is None:
            unlock_seq = None            # never named: banned everywhere
        elif unlock_id not in seq_of:
            unlock_seq = -1              # unlock points at a unit not in this build
            if not partial:
                F(unlock_id, "G0", f"ledger unlocks '{term}' at a unit that is not in the build")
        else:
            unlock_seq = seq_of[unlock_id]
        for surface in [term] + list(meta.get("aliases", [])):
            term_rows.append((surface, term, unlock_seq))
    term_rows.sort(key=lambda r: -len(r[0]))

    # ---- G1 contiguous unique sequence ---------------------------------------
    seqs = [u.get("seq") for u in units]
    if len(set(seqs)) != len(seqs):
        F("COURSE", "G1", f"duplicate seq values: {sorted(seqs)}")
    if not partial and sorted(seqs) != list(range(1, len(units) + 1)):
        F("COURSE", "G1", f"seq must be 1..{len(units)} exactly once; got {sorted(seqs)}")

    move_runs = defaultdict(int)
    named_total = 0

    for u in units:
        uid, s = u.get("id", "?"), u.get("seq", 0)
        text_all = " | ".join(onscreen_strings(u))

        # ---- G2 requires point backward --------------------------------------
        for r in u.get("requires", []):
            if r not in seq_of:
                MISS(uid, "G2", f"requires '{r}' which is not in this build")
            elif seq_of[r] >= s:
                F(uid, "G2", f"requires '{r}' at seq {seq_of[r]}, which is not before {s}")

        # ---- G3 reuses a named artifact from a real earlier unit ---------------
        ru = u.get("reuses")
        if s == 1:
            pass
        elif not ru or not ru.get("from") or not ru.get("artifact"):
            F(uid, "G3", "no reuses{from,artifact}: every unit after the first must "
                         "put an earlier unit's artifact back on screen")
        elif ru["from"] not in seq_of:
            MISS(uid, "G3", f"reuses '{ru['from']}', which is not in this build")
        elif seq_of[ru["from"]] >= s:
            F(uid, "G3", f"reuses '{ru['from']}' which is not an earlier unit")

        # ---- G4 stage shape ---------------------------------------------------
        st = u.get("stages", [])
        if [x.get("role") for x in st] != ROLES:
            F(uid, "G4", f"stages must be exactly {ROLES}; got {[x.get('role') for x in st]}")
            continue
        s0, s1, s2 = st[0], st[1], st[2]

        # ---- G5 orient is readable and mechanism-free --------------------------
        n0 = len(words(s0.get("onscreen", "")))
        if n0 > 40:
            F(uid, "G5", f"orient is {n0} words; hard cap is 40")
        if s0.get("answerable_from") != "picture_only":
            F(uid, "G5", "orient must declare answerable_from='picture_only'")
        if s0.get("controls_unlocked"):
            F(uid, "G5", "orient must have every control locked")
        for m in L["stage0_mechanism_lexicon"]:
            if m in norm(s0.get("onscreen", "")):
                F(uid, "G5", f"orient names a mechanism ('{m}'); orient may only ask the "
                             f"student to read the picture")

        # ---- G6/G7 predict then act -------------------------------------------
        if not s1.get("records_guess"):
            F(uid, "G6", "predict must set records_guess=true")
        if s1.get("controls_unlocked"):
            F(uid, "G6", "predict must still have every control locked")
        cu = s2.get("controls_unlocked", [])
        if len(cu) != 1:
            F(uid, "G7", f"act must unlock exactly one control; unlocks {cu}")
        if not s2.get("confronts_guess"):
            F(uid, "G7", "act must set confronts_guess=true (the guess stays on screen)")

        # ---- G8 vocabulary ratchet --------------------------------------------
        hay = " " + norm(text_all) + " "
        for surface, canon, unlock_seq in term_rows:
            if re.search(r"(?<![a-z0-9])" + re.escape(norm(surface)).strip() + r"(?![a-z0-9])", hay):
                if unlock_seq is None:
                    F(uid, "G8", f"on-screen text uses '{surface}', a term this course never names")
                elif s < unlock_seq:
                    F(uid, "G8", f"on-screen text uses '{surface}' (unlocked at seq {unlock_seq}) "
                                 f"at seq {s}")

        # ---- G9 title names the move, never the term ---------------------------
        tnorm = " " + norm(u.get("title", "")) + " "
        for surface, canon, _ in term_rows:
            if re.search(r"(?<![a-z0-9])" + re.escape(norm(surface)).strip() + r"(?![a-z0-9])", tnorm):
                F(uid, "G9", f"title contains the term '{surface}'; titles name the move")

        # ---- G10 naming is earned ----------------------------------------------
        nt = u.get("names_terms", [])
        if len(nt) > 1:
            F(uid, "G10", f"names {len(nt)} terms; at most one per unit")
        for t in nt:
            named_total += 1
            if t not in L["terms"]:
                F(uid, "G10", f"names '{t}', which is not in the ledger")
            elif L["terms"][t].get("unlock") != uid:
                F(uid, "G10", f"names '{t}' but the ledger unlocks it at "
                              f"'{L['terms'][t].get('unlock')}'")
            runs = move_runs.get(u.get("move_id"), 0)
            if runs < L["min_prior_runs_before_naming"]:
                MISS(uid, "G10", f"names '{t}' after only {runs} prior runs of move "
                              f"'{u.get('move_id')}'; the floor is "
                              f"{L['min_prior_runs_before_naming']}. The name has to land as "
                              f"recognition, and it cannot recognise something done twice.")
        move_runs[u.get("move_id")] += 1

        # ---- G11 the aphorism is the answer key ---------------------------------
        aph = u.get("aphorism", "")
        if not aph:
            F(uid, "G11", "no aphorism recorded; the answer key is not optional")
        else:
            ac = content(aph)
            for s_ in onscreen_strings(u):
                if norm(aph).strip() and norm(aph).strip() in norm(s_):
                    F(uid, "G11", "the aphorism appears verbatim on screen")
                if ac and len(ac & content(s_)) / len(ac) >= 0.7:
                    F(uid, "G11", f"on-screen text paraphrases the aphorism "
                                  f"(>=70% of its content words): \"{s_[:70]}...\"")

        # ---- G12 nothing hands the meaning over ----------------------------------
        for g in L["giveaway_phrases"]:
            if g in norm(text_all):
                F(uid, "G12", f"on-screen text says '{g}'; the student derives the meaning")

        # ---- G13 the break opens a door -------------------------------------------
        br = u.get("break") or {}
        if not br.get("case"):
            F(uid, "G13", "no break case; every clean intuition gets one")
        door = br.get("door_to")
        if s == len(units):
            if door not in (None, "terminal"):
                F(uid, "G13", "the last unit's door must be 'terminal'")
        elif door not in seq_of:
            MISS(uid, "G13", f"break.door_to='{door}' is not in this build")
        elif seq_of[door] <= s:
            F(uid, "G13", f"break.door_to='{door}' points backward; a break must open "
                          f"forward or it is only a demolition")

        # ---- G14 the model is allowed to fall over ---------------------------------
        if not any(x.get("accepts_nonsense") for x in st):
            F(uid, "G14", "no stage accepts a nonsensical setting; the student never gets "
                          "to watch the model break")

        # ---- G15 datasets and the unscaffolded last one -----------------------------
        ds = u.get("datasets", [])
        kind = u.get("kind", "arc")
        subs = {d.get("subject") for d in ds}
        if kind == "drill":
            if len(ds) != 5:
                F(uid, "G15", f"a drill runs exactly 5 datasets; has {len(ds)}")
            if len(subs) < 3:
                F(uid, "G15", f"a drill needs >=3 distinct subjects; has {len(subs)}: {subs}")
        else:
            if len(ds) < 2:
                F(uid, "G15", f"needs >=2 datasets; has {len(ds)}")
            if len(subs) < 2:
                F(uid, "G15", f"needs >=2 distinct subjects; has {len(subs)}: {subs}")
        if ds and ds[-1].get("scaffolded") is not False:
            F(uid, "G15", "the last dataset must be unscaffolded; it is the measurement")
        if any(d.get("scaffolded") is False for d in ds[:-1]):
            W(uid, "G15", "an unscaffolded dataset appears before the last one")

        # ---- G16 analogy on tap, not on top -----------------------------------------
        an = u.get("analogy") or {}
        if an.get("trigger") != "on_demand":
            F(uid, "G16", "analogy.trigger must be 'on_demand'; a frame handed to everyone "
                          "is another takeaway handed over")

        # ---- G17 the code panel covers what the sliders do ----------------------------
        cp = u.get("code_panel") or {}
        if not cp.get("present"):
            F(uid, "G17", "no code panel; a slider with no line is a spell")
        mapping = cp.get("control_to_line", {})
        for st_ in st:
            for c in st_.get("controls_unlocked", []) or []:
                if c not in mapping:
                    F(uid, "G17", f"control '{c}' lights up no line in the code panel")

        # ---- G18 the audit happened --------------------------------------------------
        au = u.get("audit") or {}
        if au.get("round", 0) < 2:
            F(uid, "G18", f"audit round is {au.get('round', 0)}; a unit ships at round >=2. "
                          f"A first draft has never passed.")
        seen = {p.get("pass") for p in au.get("passes", [])}
        for p in "ABCD":
            if p not in seen:
                F(uid, "G18", f"audit is missing pass {p}")
        for p in au.get("passes", []):
            if not p.get("findings") and not p.get("justification"):
                F(uid, "G18", f"pass {p.get('pass')} reports no findings and no justification. "
                              f"Zero findings is a claim about the draft; defend it or go look "
                              f"again.")
            if p.get("findings") and not p.get("edits"):
                F(uid, "G18", f"pass {p.get('pass')} found problems and changed nothing")

    # ---- G19 term budget -------------------------------------------------------------
    if not partial and named_total > L["term_budget"]:
        F("COURSE", "G19", f"{named_total} terms named; budget is {L['term_budget']}. "
                           f"Cut names, not corners.")

    # ---- G20 arc load ----------------------------------------------------------------
    load = defaultdict(int)
    for u in units:
        load[str(u.get("arc"))] += u.get("minutes", 0)
    for arc, budget in (L["arc_budgets_minutes"].items() if not partial else []):
        if load[arc] > budget:
            F("COURSE", "G20", f"arc {arc} is {load[arc]} min against a {budget} min budget; "
                               f"merge or cut a unit")

    for w in warns: print(w)
    for f in fails: print(f)
    print(f"\n{len(units)} units | {named_total}/{L['term_budget']} terms named | "
          f"{len(fails)} failures | {len(warns)} warnings")
    if fails or partial:
        print("NOT GREEN. Fix, re-audit, re-run. Do not report this unit as done.")
    else:
        print("GREEN.")
    return 1 if fails else 0

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print(__doc__); sys.exit(2)
    paths = []
    for a in sys.argv[2:]:
        paths.extend(glob.glob(a))
    sys.exit(main(sys.argv[1], paths))
