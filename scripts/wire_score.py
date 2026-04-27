#!/usr/bin/env python3
"""
Wire the score/quiz framework into all 19 scaffold modules (S1-S5, S7-S20).
S6 is already wired manually as the full-pattern reference.

For each scaffold, applies five surgical edits:
  1. Add <link rel="stylesheet" href="../lib/score.css"> after <title>.
  2. Insert score-name + pretest mounts above round-container, wrap
     round-container + tally in a score-locked gate.
  3. Insert posttest mount + close scaffold-body before existing finale.
  4. Insert score-final mount before </main>; add lib script tags.
  5. Replace the finale-show line with showPosttest().
  6. Replace the bottom-of-script bootstrap call with the Score.init wiring,
     including the per-module pretest/posttest items and the appropriate
     tally function name (drawTally vs renderTally).

Items defined here are placeholder drafts, all multiple-choice. Revise freely
in each module file once the framework is in place.
"""
import json
import os
import re
import sys

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# (moduleId, filename, tally_fn_name, [pretest items], [posttest items])
# Each item: (question, [4 options], correct_idx)
SCAFFOLDS = [
    ("s01", "s01_no_trend_envelope.html", None,  # tally fn detected per file
     [("If you fit a regression line to a 40-year time series with no real trend, the slope estimate β̂ will most likely be:",
       ["Exactly 0.", "Close to 0, with sample-to-sample variability.",
        "Significantly different from 0 (Type I error).", "Undefined."], 1),
      ("Doubling the number of years of data, holding all else equal, will most likely make the null half-width of |β̂|:",
       ["Larger.", "Smaller.", "Unchanged.", "Negative."], 1)],
     [("A permutation test gives a wide null half-width and the observed slope is small. The strongest claim is:",
       ["The trend is real and large.",
        "The observed slope is consistent with the null — no trend distinguishable.",
        "The permutation test is invalid.", "The slope is exactly zero."], 1),
      ("Two studies have the same observed slope, but Study A has higher residual scatter σ. Study A's null envelope is:",
       ["Narrower.", "Wider.", "The same.", "Inverted."], 1)]),
    ("s02", "s02_residual_reading.html", None,
     [("A residual plot shows a clear U-shape (negative at the ends, positive in the middle). The most likely diagnosis is:",
       ["Clean noise.", "Curvature — a line is the wrong model.",
        "Heteroskedasticity.", "Two distinct clouds."], 1),
      ("Residual variance grows visibly with x (small spread at low x, large at high x). This pattern is best described as:",
       ["Clean noise.", "Curvature.", "Heteroskedasticity.", "Outlier influence."], 2)],
     [("A residual plot shows two distinct horizontal bands of points. The most likely missing variable is:",
       ["None — this is just noise.",
        "A grouping factor (sex, species, treatment) not in the model.",
        "A polynomial term.", "An interaction with x²."], 1),
      ("Residuals look like clean noise around zero with constant spread. The linear model:",
       ["Has captured the structure adequately.", "Is definitely wrong.",
        "Should be replaced with a polynomial.", "Has no information."], 0)]),
    ("s03", "s03_hwe_counting.html", None,
     [("If allele A has frequency p = 0.4 and N = 100 individuals, the expected number of heterozygotes Aa under HWE is approximately:",
       ["16.", "24.", "48.", "64."], 2),
      ("Observed heterozygotes are far below the HWE expectation. The most likely cause is:",
       ["Random sampling noise alone.",
        "Inbreeding or population structure.",
        "Mislabeled genotypes.", "HWE doesn't apply to this species."], 1)],
     [("HWE assumes random mating and large population size. A small population violating these will most often show:",
       ["Exact HWE proportions.", "Departures from HWE due to drift.",
        "Excess heterozygotes.", "No allele variation."], 1),
      ("With p = 0.5 in a large random-mating population, the expected genotype frequencies are:",
       ["AA: 0.5, Aa: 0.5, aa: 0.", "AA: 0.25, Aa: 0.5, aa: 0.25.",
        "AA: 0.33, Aa: 0.33, aa: 0.33.", "AA: 0.5, Aa: 0.0, aa: 0.5."], 1)]),
    ("s04", "s04_fixation_probability.html", None,
     [("Under neutral drift starting at frequency p₀ = 0.1, the eventual fixation probability of the allele is:",
       ["0.1.", "0.5.", "0.9.", "1.0."], 0),
      ("Doubling the effective population size Nₑ, holding p₀ fixed, will most likely change the neutral fixation probability:",
       ["Halve it.", "Double it.", "Leave it unchanged.", "Drive it to 1."], 2)],
     [("An allele starts at p₀ = 0.5 in a small population. Across many replicates under neutral drift, the long-run fraction that fix the allele is:",
       ["0.0.", "0.5.", "1.0.", "Cannot be determined."], 1),
      ("A new mutation enters a population at p₀ = 1/(2Nₑ). Its neutral fixation probability is:",
       ["1/(2Nₑ).", "1/Nₑ.", "1/2.", "1.0."], 0)]),
    ("s05", "s05_time_to_fixation.html", None,
     [("Doubling Nₑ, holding p₀ fixed, will most likely change the median time to fixation:",
       ["Roughly halve it.", "Roughly double it.",
        "Leave it unchanged.", "Make it infinite."], 1),
      ("An allele starts at p₀ = 0.01 in a population of Nₑ = 100. The most likely outcome is:",
       ["Quick fixation.", "Quick loss.",
        "Indefinite stable polymorphism.", "Approach to p = 0.5."], 1)],
     [("Two replicates have the same p₀ but Nₑ = 10 vs Nₑ = 1000. Which one resolves (fixes or loses) faster on average?",
       ["Nₑ = 10.", "Nₑ = 1000.", "Both at the same time.", "Neither will fix."], 0),
      ("Under neutral drift starting at p₀ = 0.5, the expected time to fixation given fixation occurs is approximately:",
       ["Independent of Nₑ.", "Linear in Nₑ.",
        "Quadratic in Nₑ.", "Exponential in Nₑ."], 1)]),
    ("s07", "s07_breeders_equation.html", None,
     [("The breeder's equation says R = h² × S. With S = +0.2 cm and h² = 0.5, the predicted one-generation response is:",
       ["+0.04 cm.", "+0.10 cm.", "+0.20 cm.", "+0.40 cm."], 1),
      ("If h² = 0, then for any selection differential S, the response R is:",
       ["Equal to S.", "Half of S.", "Zero.", "Doubled."], 2)],
     [("A trait shows S = 0.5 SD and h² = 0.4. The expected one-generation response in trait units is:",
       ["0.1 SD.", "0.2 SD.", "0.4 SD.", "0.5 SD."], 1),
      ("Two species have the same S; Species A has h² = 0.8, Species B has h² = 0.2. After one generation, which shows the larger trait change?",
       ["Species A.", "Species B.", "Both equal.",
        "Neither — h² doesn't matter."], 0)]),
    ("s08", "s08_selection_coefficient.html", None,
     [("An allele goes from p = 0.1 to p = 0.5 over t = 50 generations in a large population. This requires a selection coefficient s that is:",
       ["Negative.", "Positive.", "Exactly zero.", "Undefined."], 1),
      ("If you observe Δp ≈ 0 across many generations, the most parsimonious estimate of s is:",
       ["Strongly positive.", "Near zero.",
        "Strongly negative.", "Cannot be determined."], 1)],
     [("Larger Nₑ, holding the observed Δp and t the same, implies the inferred s is:",
       ["Smaller (less drift attribution).",
        "Larger.", "Unchanged.", "Sign-reversed."], 0),
      ("If a small Δp could plausibly be produced by drift in a small Nₑ, the inferred s should be reported as:",
       ["Definitely positive.",
        "Plausibly zero (within drift expectation).",
        "Definitely negative.", "Infinitely large."], 1)]),
    ("s09", "s09_mutation_selection_balance.html", None,
     [("For a recessive lethal allele with mutation rate μ, the equilibrium allele frequency q̂ is approximately:",
       ["μ.", "√μ.", "μ/s.", "Zero."], 1),
      ("Halving the selection coefficient s while holding μ fixed will most likely:",
       ["Halve q̂.", "Increase q̂.",
        "Leave q̂ unchanged.", "Drive q̂ to 0."], 1)],
     [("A dominant deleterious allele reaches q̂ ≈ μ/s; a recessive reaches q̂ ≈ √(μ/s). For the same μ and s, which is larger?",
       ["Dominant.", "Recessive.", "Equal.", "Cannot tell."], 1),
      ("Mutation–selection balance explains why deleterious alleles are not exactly extinct. The equilibrium q̂ depends most directly on:",
       ["Population size only.",
        "The ratio of mutation rate to selection.",
        "Drift only.", "Migration rate only."], 1)]),
    ("s10", "s10_f_statistic.html", None,
     [("F is defined as 1 − H_obs / H_exp. If H_obs equals H_exp, then F equals:",
       ["−1.", "0.", "1.", "Undefined."], 1),
      ("H_obs is much smaller than H_exp. F is:",
       ["Negative.", "Near zero.",
        "Positive (heterozygote deficit).", "Greater than 1 always."], 2)],
     [("Inbreeding tends to make F:",
       ["More negative.", "More positive (heterozygote deficit).",
        "Always zero.", "Always 1."], 1),
      ("H_obs is slightly above H_exp. The most likely cause is:",
       ["Inbreeding.", "Outbreeding or sample noise.",
        "Strong purifying selection.", "Mutation pressure."], 1)]),
    ("s11", "s11_fst_migration.html", None,
     [("Wright's two-population approximation gives F_ST ≈ 1 / (1 + 4 Nₑ m). Increasing m, holding Nₑ fixed, will most likely:",
       ["Increase F_ST.", "Decrease F_ST.",
        "Leave F_ST unchanged.", "Make F_ST negative."], 1),
      ("If F_ST is small (near 0), the populations are most likely:",
       ["Strongly differentiated.",
        "Effectively well-mixed by migration.",
        "Completely isolated.", "Cannot tell."], 1)],
     [("F_ST = 0.2 implies, very roughly, the effective number of migrants Nm per generation is on the order of:",
       ["0.", "About 1.", "About 100.", "Infinite."], 1),
      ("Two populations with very small Nₑ but high m may show F_ST that is:",
       ["Very high.", "Low — migration overcomes drift.",
        "Always 0.5.", "Negative."], 1)]),
    ("s12", "s12_hamiltons_rule.html", None,
     [("Hamilton's rule says altruism is favored when:",
       ["C > B.", "rB > C.", "r = 1.", "The actor benefits."], 1),
      ("For full siblings (r = 0.5), helping is favored when B/C is:",
       ["> 0.5.", "> 1.", "> 2.", "> 4."], 2)],
     [("An allele for helping non-relatives (r = 0) will spread when:",
       ["Always.",
        "Never — rB = 0, so rB > C is impossible for C > 0.",
        "Sometimes, depending on B.", "Whenever the helper benefits."], 1),
      ("If r increases (closer kin), the threshold benefit-to-cost ratio for altruism to spread:",
       ["Goes up.", "Goes down.",
        "Stays the same.", "Becomes infinite."], 1)]),
    ("s13", "s13_tree_rotation.html", None,
     [("On a phylogeny, two tips can be drawn next to each other but not be each other's closest relatives. The reason is:",
       ["The tree is wrong.",
        "Adjacent tips are sisters only if their MRCA is theirs alone.",
        "All adjacent tips are sisters.", "Tree shape doesn't matter."], 1),
      ("Two tips are sisters if and only if:",
       ["They look adjacent in the drawing.",
        "Their most recent common ancestor is theirs alone (not shared with any other tip below it).",
        "They have the same branch length.",
        "They are alphabetically adjacent."], 1)],
     [("Rotating a node leaves the tree's biological meaning unchanged because rotation:",
       ["Is a different tree.",
        "Affects only visual order, not ancestor–descendant relationships.",
        "Removes branches.", "Always reduces support."], 1),
      ("Two tips whose path through the tree (sum of branch lengths to their MRCA) is short compared to other pairs are most likely:",
       ["Closer relatives.", "More distant relatives.",
        "The same species.", "Outgroups."], 0)]),
    ("s14", "s14_rates_intervals.html", None,
     [("The same evolutionary change measured over a short interval vs. a long interval will most often give a:",
       ["Higher rate over the long interval.",
        "Higher rate over the short interval.",
        "Same rate either way.", "No relationship."], 1),
      ("Averaging |Δ| over progressively longer intervals, the |rate| typically:",
       ["Increases.",
        "Decreases (regression toward zero).",
        "Stays constant.", "Becomes negative."], 1)],
     [("Higher measured rates at shorter timescales are best explained by:",
       ["Real acceleration over short times.",
        "Reversals and noise averaging out over long intervals.",
        "Measurement error increasing with time.",
        "Selection pressure increasing."], 1),
      ("Comparing rates between species or studies is fair only when intervals are:",
       ["The same length.", "Different lengths.",
        "Doesn't matter.", "Always 1 generation."], 0)]),
    ("s15", "s15_phylogenetic_nonindependence.html", None,
     [("Treating species as independent data points when they share evolutionary history will most often:",
       ["Have no effect.",
        "Inflate the apparent statistical significance of trait correlations.",
        "Reduce all p-values to 1.", "Make slopes negative."], 1),
      ("Phylogenetic comparative methods correct for:",
       ["Measurement error only.",
        "Shared ancestry as a source of correlation among species.",
        "Sample size.", "Heteroskedasticity."], 1)],
     [("Centering traits within taxonomic groups (e.g., subtracting order means) before regressing tends to:",
       ["Make the slope larger.",
        "Make the slope smaller and more conservative.",
        "Leave the slope unchanged.", "Force the slope to zero."], 1),
      ("The naïve cross-species slope and the within-group slope differ most when:",
       ["The trait varies among groups but not within.",
        "The trait is constant across groups.",
        "Sample sizes are equal.", "The traits are uncorrelated."], 0)]),
    ("s16", "s16_dm_snowball.html", None,
     [("The Dobzhansky–Muller model predicts the number of pairwise incompatibilities between two diverging lineages grows over divergence time:",
       ["Linearly.", "Faster than linearly (e.g., quadratically).",
        "Constantly (no change).", "Decreases."], 1),
      ("After divergence time t, the expected number of pairwise incompatibilities scales approximately like:",
       ["t.", "t².", "log(t).", "1/t."], 1)],
     [("Two species pairs have been isolated for the same total time, but pair A has accumulated alleles at twice the rate per generation. Pair A is most likely to show:",
       ["Fewer incompatibilities.",
        "More incompatibilities.",
        "Equal incompatibilities.",
        "No reproductive isolation."], 1),
      ("Reproductive isolation building up faster-than-linearly with divergence time supports the idea that:",
       ["Incompatibilities arise pairwise from accumulated substitutions.",
        "Speciation is purely allopatric.",
        "Reproductive isolation is unrelated to substitution rate.",
        "Incompatibilities decrease with time."], 0)]),
    ("s17", "s17_mutation_target.html", None,
     [("A trait that can be produced by mutations at many genes will evolve repeatedly across lineages more often than one requiring mutation at a single gene. The driver is:",
       ["Selection strength only.", "Mutation target size.",
        "Population size.", "Heritability."], 1),
      ("Two traits experience similar selection. Trait A is encoded by 50 genes, Trait B by 1 gene. Which is more likely to evolve in parallel?",
       ["Trait A.", "Trait B.", "Both equally.", "Neither."], 0)],
     [("The placenta evolved roughly twice in vertebrate history; eye loss has evolved many times in cave fish. The simplest explanation involves:",
       ["Different selection pressures only.",
        "Mutation target size — eye loss can be produced by many mutations, the placenta by very few.",
        "Population size.", "Drift."], 1),
      ("Conditional on selection acting, the per-generation rate at which a phenotype evolves depends most on:",
       ["The size of the mutational target that produces it.",
        "The phenotype's name.",
        "Geographic location.", "Year of observation."], 0)]),
    ("s18", "s18_dnds_classification.html", None,
     [("A gene with dN/dS > 1 is most consistent with:",
       ["Purifying (negative) selection.", "Neutral evolution.",
        "Positive (Darwinian) selection.", "No mutation."], 2),
      ("A gene with dN/dS << 1 is most consistent with:",
       ["Positive selection.",
        "Purifying selection conserving function.",
        "Convergence.", "Population size effects."], 1)],
     [("Most genes in most genomes show dN/dS values:",
       ["> 1, indicating widespread positive selection.",
        "≈ 0, indicating no mutation.",
        "< 1, reflecting purifying selection.",
        "Exactly 1."], 2),
      ("A measured dN/dS ≈ 1 across an entire gene is most parsimoniously interpreted as:",
       ["Strong directional selection.",
        "Approximate neutrality (or balance of positive and negative).",
        "Recombination breakdown.", "HWE failure."], 1)]),
    ("s19", "s19_convergence_vs_drift.html", None,
     [("Two distantly related lineages independently evolve white fur in cold environments. The most likely explanation is:",
       ["Shared common ancestor that was already white.",
        "Convergent selection for camouflage.",
        "Drift.", "Mutation rate alone."], 1),
      ("Two close sister species both have a rare trait — but no other relatives do. The simplest explanation is:",
       ["Convergence.",
        "Inheritance from their immediate common ancestor.",
        "Migration.", "Selection for it."], 1)],
     [("The strongest evidence for convergence (rather than shared ancestry) is when the trait appears:",
       ["In distantly related lineages but not in their common ancestor.",
        "Only in close relatives.",
        "Only in one lineage.", "Never."], 0),
      ("A morphological similarity that arose because two lineages happened to fix the same neutral allele by drift is best classified as:",
       ["Convergence due to selection.",
        "Drift-driven similarity.",
        "Shared ancestry.", "Migration."], 1)]),
    ("s20", "s20_species_hypothesis.html", None,
     [("When you call two populations 'separate species,' the most fundamental claim you are making is:",
       ["They cannot interbreed under any circumstances.",
        "They look different.",
        "They will not influence each other's evolutionary trajectory going forward.",
        "They live in different places."], 2),
      ("Two populations have F_ST = 0.05 at neutral loci but F_ST = 0.25 at a handful of behavioral-isolation loci. The strongest case is:",
       ["Clearly two species — high F_ST at any locus suffices.",
        "Clearly one species — low average F_ST.",
        "Speciation is in progress at the loci that matter; gene flow continues at neutral sites.",
        "The data are inconclusive."], 2)],
     [("A ring species — terminal populations don't interbreed, but a continuous gene-flow chain runs through intermediates — is best understood as:",
       ["Definitely two species.",
        "Definitely one species.",
        "A genuine grey zone — the binary classification doesn't fit naturally.",
        "An error in the data."], 2),
      ("F1 hybrids between two populations are completely sterile. This most strongly supports:",
       ["One species.",
        "Two species (operational reproductive isolation).",
        "High migration rate.",
        "Low F_ST."], 1)]),
]


def detect_tally_fn(html):
    """Return the bottom-of-file tally function name (drawTally or renderTally)."""
    if re.search(r"^drawTally\(\);$", html, re.MULTILINE):
        return "drawTally"
    if re.search(r"^renderTally\(\);$", html, re.MULTILINE):
        return "renderTally"
    return "renderTally"  # safe default


def js_items_literal(items):
    """Render Python item tuples as a JS array literal."""
    parts = []
    for i, (q, opts, correct) in enumerate(items):
        parts.append(
            "  {\n"
            f"    idx: {i},\n"
            f"    q: {json.dumps(q)},\n"
            f"    options: {json.dumps(opts)},\n"
            f"    correct: {correct}\n"
            "  }"
        )
    return "[\n" + ",\n".join(parts) + "\n]"


def wire_scaffold(module_id, filename, pretest, posttest):
    path = os.path.join(REPO, "scaffolds", filename)
    html = open(path, encoding="utf-8").read()

    if "lib/score.css" in html:
        print(f"  SKIP {filename}: already wired")
        return False

    tally_fn = detect_tally_fn(html)

    # 1. Add CSS link after <title>...</title>
    html = re.sub(
        r"(<title>[^<]+</title>)",
        r'\1\n<link rel="stylesheet" href="../lib/score.css">',
        html, count=1
    )

    # 2. Replace <main>\n  <div id="round-container"></div> with the structured opener
    main_open_old = '<main>\n  <div id="round-container"></div>'
    main_open_new = (
        '<main>\n'
        '  <div id="score-name"></div>\n'
        '\n'
        '  <div class="score-card" id="pretest-card" style="display:none;">\n'
        '    <div id="pretest-mount"></div>\n'
        '  </div>\n'
        '\n'
        '  <div id="scaffold-body" class="score-locked">\n'
        '    <div class="score-locked-banner" id="scaffold-lock-note">Locked — answer the pretest above first.</div>\n'
        '    <div id="round-container"></div>'
    )
    if html.count(main_open_old) != 1:
        raise RuntimeError(f"{filename}: main_open anchor not unique")
    html = html.replace(main_open_old, main_open_new)

    # 3. Insert posttest mount + close scaffold-body before <div class="finale" id="finale">
    finale_old = '\n  <div class="finale" id="finale">'
    finale_new = (
        '\n  </div>\n'
        '\n'
        '  <div class="score-card" id="posttest-card" style="display:none;">\n'
        '    <div id="posttest-mount"></div>\n'
        '  </div>\n'
        '\n'
        '  <div class="finale" id="finale">'
    )
    if html.count(finale_old) != 1:
        raise RuntimeError(f"{filename}: finale_open anchor not unique")
    html = html.replace(finale_old, finale_new)

    # 4. Insert score-final mount before </main>; add lib script tags
    main_close_old = '</main>\n\n<script>'
    main_close_new = (
        '\n  <div id="score-final"></div>\n'
        '</main>\n'
        '\n'
        '<script src="../lib/score.js"></script>\n'
        '<script src="../lib/quiz.js"></script>\n'
        '<script>'
    )
    if html.count(main_close_old) != 1:
        raise RuntimeError(f"{filename}: main_close anchor not unique")
    html = html.replace(main_close_old, main_close_new)

    # 5. Replace finale-show line with showPosttest()
    finale_show_old = '    document.getElementById("finale").classList.add("shown");'
    finale_show_new = '    showPosttest();'
    if html.count(finale_show_old) != 1:
        raise RuntimeError(f"{filename}: finale_show line not unique")
    html = html.replace(finale_show_old, finale_show_new)

    # 6. Replace bottom bootstrap with Score.init wiring
    bootstrap_pattern = re.compile(
        r"\nrenderRound\(\);\n(?:draw|render)Tally\(\);\n</script>", re.MULTILINE
    )
    if not bootstrap_pattern.search(html):
        raise RuntimeError(f"{filename}: bottom bootstrap not found")

    pretest_lit  = js_items_literal(pretest)
    posttest_lit = js_items_literal(posttest)

    wiring_block = f"""
// ---------- Pretest / posttest items (placeholder draft — revise freely) ----------
const PRETEST_ITEMS = {pretest_lit};

const POSTTEST_ITEMS = {posttest_lit};

// ---------- Score / quiz wiring ----------
function showPretest() {{
  document.getElementById("pretest-card").style.display = "block";
  Quiz.render({{
    mount: "#pretest-mount",
    group: "pretest",
    title: "Before you start",
    items: PRETEST_ITEMS,
    onComplete: () => {{
      const body = document.getElementById("scaffold-body");
      body.classList.remove("score-locked");
      const banner = document.getElementById("scaffold-lock-note");
      if (banner) banner.style.display = "none";
      renderRound();
      {tally_fn}();
    }}
  }});
}}

function showPosttest() {{
  const card = document.getElementById("posttest-card");
  card.style.display = "block";
  Quiz.render({{
    mount: "#posttest-mount",
    group: "posttest",
    title: "After the rounds, before the reveal",
    intro: "Take these before reading the explanation below.",
    items: POSTTEST_ITEMS,
    onComplete: () => {{
      document.getElementById("finale").classList.add("shown");
      Score.finish();
      document.getElementById("finale").scrollIntoView({{ behavior: "smooth", block: "start" }});
    }}
  }});
  card.scrollIntoView({{ behavior: "smooth", block: "start" }});
}}

Score.init({{
  moduleId: "{module_id}",
  version: 1,
  pretest: PRETEST_ITEMS.length,
  scaffold: 0,                  // bookend pattern — no per-round bits
  posttest: POSTTEST_ITEMS.length,
  mountNamePrompt: "#score-name",
  mountFinalCode:  "#score-final",
  onReady: () => {{ showPretest(); }}
}});
</script>"""

    # re.sub interprets backslashes in the replacement; wrap in a lambda so
    # \uXXXX sequences from json.dumps survive untouched.
    html = bootstrap_pattern.sub(lambda _m: wiring_block, html)

    open(path, "w", encoding="utf-8").write(html)
    print(f"  WIRED {filename}  (tally={tally_fn})")
    return True


# =====================================================================
# Lessons (bookend pattern — pretest gates stage A; final stage triggers
# posttest; posttest reveals score code).
# =====================================================================

# Each lesson: (module_id, filename, last_stage, hook_old, hook_new, pre, post)
# `hook_old` and `hook_new` describe how to insert the showPosttest trigger
# in the existing unlock-progression code. Different lessons use different
# unlock idioms.

L0_HOOK_OLD = '''    if (g.nextStage) {
      document.getElementById("stage" + g.nextStage).classList.remove("stage-locked");
      document.getElementById(g.tocNext).classList.remove("locked");
    }'''
L0_HOOK_NEW = '''    if (g.nextStage) {
      document.getElementById("stage" + g.nextStage).classList.remove("stage-locked");
      document.getElementById(g.tocNext).classList.remove("locked");
    } else if (typeof showPosttest === "function") {
      showPosttest();
    }'''

L2_HOOK_OLD = '''    if (stage === "A") unlockStage("B");
    if (stage === "B") unlockStage("C");
    if (stage === "C") unlockStage("D");'''
L2_HOOK_NEW = '''    if (stage === "A") unlockStage("B");
    if (stage === "B") unlockStage("C");
    if (stage === "C") unlockStage("D");
    if (stage === "D" && typeof showPosttest === "function") showPosttest();'''

# Lesson 3 uses the same idiom as Lesson 0 but the surrounding text differs
# (different "you have reached the end of" string). Anchor on the if-block
# that does the actual unlock, which is identical structure across L0/L3.
L3_HOOK_OLD = L0_HOOK_OLD
L3_HOOK_NEW = L0_HOOK_NEW

# unlockStage("A") syntax — varies because L2 has a helper, L0/L3 don't.
L0_UNLOCK_A = '''document.getElementById("stageA").classList.remove("stage-locked");
      const tocA = document.getElementById("tocA");
      if (tocA) tocA.classList.remove("locked");'''
L2_UNLOCK_A = '''unlockStage("A");'''
L3_UNLOCK_A = L0_UNLOCK_A

LESSONS = [
    {
        "module_id": "lesson0",
        "filename": "lesson0.html",
        "hook_old": L0_HOOK_OLD,
        "hook_new": L0_HOOK_NEW,
        "unlock_a": L0_UNLOCK_A,
        "pretest": [
            ("A scatter has points around a line with positive slope. The Pearson correlation r will be:",
             ["Negative.", "Positive.", "Zero.", "Undefined."], 1),
            ("If you generate y from y = α + β·x + noise and fit a regression, repeating with new noise many times gives you:",
             ["The exact same β̂ each time.",
              "A distribution of β̂ values around the true β.",
              "β̂ = 0 always.", "β̂ = ∞."], 1),
        ],
        "posttest": [
            ("A correlation r = 0.8 between two traits across 30 species means:",
             ["The traits are causally related.",
              "They are strongly linearly associated; causation requires more analysis.",
              "They are unrelated.", "Their slopes are equal."], 1),
            ("Holding x and the true β fixed, as residual scatter shrinks, the correlation r:",
             ["Increases toward 1.", "Decreases toward 0.",
              "Becomes negative.", "Remains unchanged."], 0),
        ],
    },
    {
        "module_id": "lesson2",
        "filename": "lesson2.html",
        "hook_old": L2_HOOK_OLD,
        "hook_new": L2_HOOK_NEW,
        "unlock_a": L2_UNLOCK_A,
        "pretest": [
            ("Two different linear models on the same data give different slopes for x (e.g., y ~ x vs y ~ x + group). This usually means:",
             ["One model is computationally wrong.",
              "A grouping variable absorbs some of x's apparent effect.",
              "The data are noise.", "The models are equivalent."], 1),
            ("Looking at residuals of a fitted model is most useful for:",
             ["Confirming the model is correct.",
              "Identifying what variable was forgotten.",
              "Computing R².", "Visualizing the slope."], 1),
        ],
        "posttest": [
            ("A residual plot shows clear structure (curvature, clusters). The implication is:",
             ["The model fits perfectly.",
              "The model is missing structure that's still in the data.",
              "The data are bad.", "The slope estimate is biased toward zero."], 1),
            ("Adding a variable to a regression model and watching the slope of x change substantially indicates:",
             ["The added variable is irrelevant.",
              "The added variable confounds (or mediates) the relationship between x and y.",
              "The model is overfit.",
              "The slopes don't actually depend on covariates."], 1),
        ],
    },
    {
        "module_id": "lesson3",
        "filename": "lesson3.html",
        "hook_old": L3_HOOK_OLD,
        "hook_new": L3_HOOK_NEW,
        "unlock_a": L3_UNLOCK_A,
        "pretest": [
            ("Two heterozygous parents (Aa × Aa) cross. The expected offspring genotype ratio is:",
             ["1:1 AA:aa.", "1:2:1 AA:Aa:aa.",
              "1:1:1:1.", "9:3:3:1."], 1),
            ("A single Aa × Aa cross with 4 offspring is unlikely to show exactly 1:2:1. The best explanation is:",
             ["Mendel's laws are wrong.",
              "Sampling variation — small samples deviate from expected ratios.",
              "The genotypes are all the same.", "A mutation occurred."], 1),
        ],
        "posttest": [
            ("Two loci on the same chromosome with a small recombination distance will most likely:",
             ["Segregate independently.",
              "Be inherited together (linked) more often than chance.",
              "Always recombine.", "Show 1:1:1:1 ratios."], 1),
            ("Gene dropping in a pedigree, repeated many times, builds the distribution of:",
             ["Allele frequencies expected at the founders.",
              "Allele frequencies expected in descendants given the pedigree.",
              "Recombination rates.", "Mutation rates."], 1),
        ],
    },
]


def wire_lesson(spec):
    path = os.path.join(REPO, "lessons", spec["filename"])
    html = open(path, encoding="utf-8").read()

    if "lib/score.css" in html:
        print(f"  SKIP {spec['filename']}: already wired")
        return False

    # 1. CSS link after <title>
    html = re.sub(
        r"(<title>[^<]+</title>)",
        r'\1\n<link rel="stylesheet" href="../lib/score.css">',
        html, count=1
    )

    # 2. Insert score-name + pretest mounts immediately after </header>.
    header_close_old = "</header>\n"
    header_close_new = (
        '</header>\n'
        '\n'
        '<div id="score-name" style="max-width: 1300px; margin: 16px auto 0 auto; padding: 0 24px;"></div>\n'
        '\n'
        '<div class="score-card" id="pretest-card" style="display:none; max-width: 1300px; margin: 0 auto; padding: 16px 24px;">\n'
        '  <div id="pretest-mount"></div>\n'
        '</div>\n'
    )
    if html.count(header_close_old) != 1:
        raise RuntimeError(f"{spec['filename']}: </header> anchor not unique")
    html = html.replace(header_close_old, header_close_new, 1)

    # 3. Lock first stage initially. The first stage is the one with class
    # "stage" (not "stage stage-locked") — i.e., stageA. Update the lock banner.
    stage_a_open_old = '<section class="stage" id="stageA">'
    stage_a_open_new = '<section class="stage stage-locked" id="stageA">'
    if html.count(stage_a_open_old) != 1:
        raise RuntimeError(f"{spec['filename']}: stageA opener anchor not unique")
    html = html.replace(stage_a_open_old, stage_a_open_new, 1)

    # The lock-banner inside stage A often says "Start with Stage A" or
    # "Complete the previous stage…". Replace whichever is there with
    # the pretest-aware text. Match the stage A's first lock-banner only.
    # Use a regex limited to the area between stageA opening and the next section.
    # Two known variants: "Start with Stage A." and "Complete the previous stage to unlock this section."
    a_section_re = re.compile(
        r'(<section class="stage stage-locked" id="stageA">.*?)<div class="lock-banner">[^<]*</div>',
        re.DOTALL
    )
    new_banner = '<div class="lock-banner">Locked — answer the pretest above to unlock this section.</div>'
    if not a_section_re.search(html):
        raise RuntimeError(f"{spec['filename']}: stageA lock-banner not found")
    html = a_section_re.sub(lambda m: m.group(1) + new_banner, html, count=1)

    # 4. Insert posttest + score-final mounts after </footer> (wrap-up footer).
    footer_close_old = "</footer>\n"
    footer_close_new = (
        '</footer>\n'
        '\n'
        '<div class="score-card" id="posttest-card" style="display:none; max-width: 1300px; margin: 16px auto; padding: 16px 24px;">\n'
        '  <div id="posttest-mount"></div>\n'
        '</div>\n'
        '\n'
        '<div id="score-final" style="max-width: 1300px; margin: 0 auto; padding: 0 24px 32px 24px;"></div>\n'
    )
    # Some lessons have nested </footer> tags inside other elements? Unlikely.
    # Replace only the first occurrence (the wrap-up footer).
    if html.count(footer_close_old) < 1:
        raise RuntimeError(f"{spec['filename']}: </footer> anchor not found")
    html = html.replace(footer_close_old, footer_close_new, 1)

    # 5. Add lib script tags before the existing <script>.
    script_open_old = "\n<script>\n"
    script_open_new = '\n<script src="../lib/score.js"></script>\n<script src="../lib/quiz.js"></script>\n<script>\n'
    # First inline <script> we hit. Lessons have just one script block.
    if html.count(script_open_old) != 1:
        raise RuntimeError(f"{spec['filename']}: <script> anchor not unique")
    html = html.replace(script_open_old, script_open_new, 1)

    # 6. Insert the showPosttest hook in the unlock-progression chain.
    if html.count(spec["hook_old"]) != 1:
        raise RuntimeError(f"{spec['filename']}: unlock hook anchor not unique")
    html = html.replace(spec["hook_old"], spec["hook_new"], 1)

    # 7. Append the Score.init wiring at the end of the script (just before </script>).
    pretest_lit  = js_items_literal(spec["pretest"])
    posttest_lit = js_items_literal(spec["posttest"])
    unlock_a = spec["unlock_a"]

    wiring_block = f"""
/* =======================================================================
   Score / pretest / posttest wiring (bookend pattern — no scaffold bits)
   ======================================================================= */
const PRETEST_ITEMS = {pretest_lit};

const POSTTEST_ITEMS = {posttest_lit};

function showPretest() {{
  document.getElementById("pretest-card").style.display = "block";
  Quiz.render({{
    mount: "#pretest-mount",
    group: "pretest",
    title: "Before you start",
    items: PRETEST_ITEMS,
    onComplete: () => {{
      {unlock_a}
    }}
  }});
}}

function showPosttest() {{
  const card = document.getElementById("posttest-card");
  if (card.style.display === "block") return;
  card.style.display = "block";
  Quiz.render({{
    mount: "#posttest-mount",
    group: "posttest",
    title: "Wrap-up check",
    items: POSTTEST_ITEMS,
    onComplete: () => {{ Score.finish(); }}
  }});
}}

Score.init({{
  moduleId: "{spec["module_id"]}",
  version: 1,
  pretest: PRETEST_ITEMS.length,
  scaffold: 0,
  posttest: POSTTEST_ITEMS.length,
  mountNamePrompt: "#score-name",
  mountFinalCode:  "#score-final",
  onReady: () => {{ showPretest(); }}
}});
</script>"""

    # Replace the LAST occurrence of </script> (end-of-file).
    last_script_close = "\n</script>"
    if not html.endswith(last_script_close + "\n</body>\n</html>\n"):
        # Fall back: just replace the final </script> with our wiring + </script>.
        # Find the final "</script>" and rewrite everything from there.
        idx = html.rfind("</script>")
        if idx < 0:
            raise RuntimeError(f"{spec['filename']}: no </script> at end")
        html = html[:idx] + wiring_block + html[idx + len("</script>"):]
    else:
        # Tidy path: replace the trailing </script> with wiring (which itself ends in </script>).
        html = html[: -len("</script>\n</body>\n</html>\n")] + wiring_block + "\n</body>\n</html>\n"

    open(path, "w", encoding="utf-8").write(html)
    print(f"  WIRED {spec['filename']}")
    return True


if __name__ == "__main__":
    print("Wiring scaffolds…")
    n_s = 0
    for module_id, filename, _tally, pre, post in SCAFFOLDS:
        if wire_scaffold(module_id, filename, pre, post):
            n_s += 1
    print(f"  → {n_s} scaffolds wired.\n")

    print("Wiring lessons…")
    n_l = 0
    for spec in LESSONS:
        if wire_lesson(spec):
            n_l += 1
    print(f"  → {n_l} lessons wired.")
