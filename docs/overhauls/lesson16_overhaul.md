# Lesson 16 — mutation: what a change does; you, a sequence, in pieces; copy or mate; an inversion

**File** · `app/lessons/lesson16.html`
**Checks** · `node scripts/check_lesson16_numbers.js` · `python3 scripts/check_lessons.py`
**Status** · first pass built (2026-10-08): A, B, C from JM's plan, locked in LOCKS.txt. 2026-10-09: A rebuilt on eight targets + dN/dS (v2); then B's spread + one-population rounds, C's watch, a new D (v3, scaffold 19). 2026-10-11: copy or mate rebuilt as a plan played in 100 populations, pieces and the inversion drafted on its engine (v4). 2026-10-12: pieces became B ("you are a specific sequence of nucleotides"), copy or mate C (v5, scaffold 15); later the same day B hermaphrodites, C's labels and plots, D rebuilt on how common the inversion gets (v6, scaffold 16); that evening hermaphrodites throughout, D's fourth target and mutational load (v7, scaffold 17). Checks pass. Items 6-11 and 20-24 below describe the archived B-D
**Last touched** · 2026-10-12 (evening: hermaphrodites throughout; D's side effect and mutational load; v7)

## JM, 2026-10-11: B rebuilt as a game; C and D built off it

> I don't like Part B of lesson 16. The mutations are fixed and don't change, and it doesn't really get to the idea of muller's ratchet. Parts C and D also don't build off from it. I'd like B to be the base and heavily adjusted--the goal is to build student understanding. The core idea I want to emphasize is: sexual reproduction makes your offspring have a larger variance & so the potential for them to be better...but at the cost of reducing how many copies of "yourself" there are in the next generation. The current setup is overly complicated and overly wrote. Making it more of a game with students making choices each generation would be good. Some systems where they have no chance for sexual recombination (and so bad mutations build up via drift), some where they can (but in stable environments their bespoke genome would get broken up for no reason). I am imagining a student selecting a few different options from dropdowns, and then a bunch of populations are simulated based on those choices, and they view summaries of the outcomes. The idea of identical-by-descent blocks could emerge from here as we trace the idea of a genome having heritability over the time. The idea of inversions stopping recombination and so resulting in chunks of the genome as evolving without recombination & all that brings to bear.

JM, the same day, before seeing the first build:

> I can't see the new b yet, but I had some ideas before we get too far on C/D. For B, letting the student make their choices and then showing side-by-side populations where the goal is to see how many copies of the originator exists after N generations. Control mutation rate, environmental change rate (basically just how much a genome's w varies). A Price equation style approach emphasizing the idea that the unit isn't exactly an organism, and a genic-level view

Read as (mine; JM may overrule):
- The student is one genome: a female in a sexual population of 40, her DNA red. Her line (her daughters, theirs) **copies** (every young a daughter, all of her) or **mates** (half the young sons; each young half her).
- **Plan first** (his second message): a strip of N cells, copy or mate each generation, click to switch or fill from a menu; then Go plays it in 100 populations. A first build stepped one generation at a time; replaced before he saw it.
- **Copies of you** (the originator): each female counts by how much of her DNA is red. The window on every target.
- **Side by side**: ten of the 100 populations, each female a square shaded by how much of her is you, copies labelled; click one to see its chromosomes and its last young.
- **Controls**: harmful changes a young (U) and how far the best value wanders a generation (a normal step, kept in 6-18): a genome's w swings with it. Held by each target, free after the three.
- **Price, two ways** (lesson 13's terms, mothers the parents, exact): for your DNA and for whole copies of you (a female who is you, every gene). Copying puts everything in cov(w, z); a mating ends every whole copy in E(wΔz) while your DNA goes on, a little diluted. A pure gene-level split (fathers as parents too) puts it all in cov, but its "before" is females and males together and no longer matches the plots; not built.
- Old B, C, D archived whole: `app/archive/lesson16_with_BCD_2026-10-11.html`.
- C (draft, built before his second message): B's engine, 40 genes, about one crossover a gamete, nothing helps or harms; still one generation at a time. Your DNA whole under copying, in pieces under mating, shorter each generation of it; click two females to see where both carry your DNA at the same genes. Leads to 17 (a migrant's pieces).
- D (draft): an inversion. A team of alleles at genes 9-16 on your chromosome, a help in one copy; inverted, it passes whole in carriers of one copy, so the team holds; if two copies kill (ruffs, fire ants), it stays in single copies, never crosses over, and harmful changes pile up inside it, B's copying line again inside one chromosome.

Model (B; the page's engine, `cmStep`; C and D run on it):
- Females and males; every female has 6 young; at most 40 (B) or 60 (C, D) of each sex live. A young lives with chance exp(-(z - best)² / 6) × 0.88^(harmful changes) (B); z the dark alleles on 2 × 12 genes; no new trait alleles, so copies stay alike; harmful changes Poisson(U), never undone; crossovers chance 0.2 a gap.
- Fathers: this generation's males (sons of last generation's matings). When your line mates after copying it has no sons, so each of its mothers counts as a son she made as a copy of herself (aphids, water fleas); without that a line that copied everyone away could never mate again.
- Start: 5 generations of mating from alleles at 50%; you replace one female: 6 dark alleles on each chromosome, opposite halves, at the best value.

Measured (the page's engine in node; 100 populations, two to six starts; copies of you at the end):

        still, 6 generations                copy every generation 37 · mate 0.8 · every 5th 23 · only at 6: 26-28
          (10 generations: every 10th 38.5 against copy 39.6: a mating after your copies fill the population costs nothing; hence 6)
        wanders 1, 30 generations           copy 8-12 · every 3rd 11-12 · every 5th 18-21 · every 10th 22-24 · mate ~1
          (20 generations: copy reached 19 and met every 5th; hence 30)
        harmful changes 0.7, 100 generations copy 3-4 (the populations die out) · every 5th 29-31 · every 10th 28 · every 20th 9-13
        C, at generation 8 (females carrying you / average piece): copy 8: 41 / 40 · copy 6, mate 2: 42 / 26 · copy 5, mate 3: 39 / 17 · mate 8: 12 / 5
        D, team lasts at 40 (of 100): inverted 55-71 · standard 8-17;  at 100, harm 0.5, fewest inside the team's chromosomes: inverted + two kill 1.2-1.7 (others 0.00) · two help 0.04-0.37 · standard 0-0.86 from 5-13 populations

Items (2026-10-11):

| # | Stage | What | Status |
|---|-------|------|--------|
| 25 | — | archive the page whole (B, C, D as of `305611b`) | done |
| 26 | B | plan strip; ten populations side by side; one up close with its young; over time (copies / whole copies / trait and best value / fewest harmful changes / females); Price for your DNA and for whole copies | done |
| 27 | B | three targets: still, 6 gens, ≥ 30 copies; wandering 1, 30 gens, ≥ 16; harmful changes 0.7, 100 gens, ≥ 20; practice; free play after (U, wander, N, plan) | done |
| 28 | C | your DNA in pieces: two targets (pieces 20-30 / 10-20 at generation 8, 30+ females), compare two females | draft, built before JM's second message; still step by step |
| 29 | D | the inversion: two targets (the team in 40+ populations at 40; at 100 the team in 40+ and fewest inside ≥ 1) | draft |
| 30 | — | scoring v4, scaffold 15 (A1-8, B1-3, C1-2, D1-2); checks rewritten for B-D (36 + R panels) | done |

JM, 2026-10-12:

> The current C is great. I think it should be Part B and Part B should be shifted to part C. I also think that the "you" should be more explicitly "you are a specific sequence of nucleotides"

Read as (mine):
- Swap: your DNA in pieces is B (it now introduces copy and mate); the copy-or-mate plan game is C. Ids, functions, bits follow the letters (B1-B2 pieces, C1-C3 the game), `version: 5`.
- In B each bead is one nucleotide: you are a specific sequence of 80 letters (two chromosomes of 40), shown in red letters; everyone else's letters are their own. Click a female, then another: their chromosomes letter by letter, red where the letters came from you.
- In C you are that kind of sequence again, spanning twelve genes a chromosome; "copies of you" counts your sequence, "you, whole" a female carrying all of it unbroken.

| # | Stage | What | Status |
|---|-------|------|--------|
| 31 | B, C | swap: pieces → B, the plan game → C; bits, ids, checks follow | done: `version: 5`, B1-B2 then C1-C3; the engine its own section ahead of both |
| 32 | B | you as letters: your sequence shown; a picked female's chromosomes letter by letter | done: each place one nucleotide; your 80 letters drawn once per student; everyone else's at random; checked: every red place carries your letter there, grey ones match yours ~25% by chance |
| 33 | B, C | wording: "you are a specific sequence of nucleotides" | done: B introduces copy and mate; C "you are a specific sequence of nucleotides again"; "whole copies" became "you, whole" |

Open for JM:
- ~~D is a draft he has not seen.~~ Seen 2026-10-12; see below.
- The Price panel: mothers as parents (exact, matches the plots). Is "whole copies of you" against "your DNA" the organism / gene contrast he means?
- B's still world is only 6 generations: at 10, mating once your copies fill the population costs nothing, and "mate every 10th" cleared all three targets.

JM, 2026-10-12 (notes after looking at B-D):

> Part B: make them hermaphrodites instead of females. Label them "genomes" as in "genomes carrying any of you" or "genomes". Also say "sequence length" instead of "pieces".
>
> Part C: "the best value wanders" let's just say "how often selection changes". Likewise, I think the "new harmful changes a young" line is confusing. Let's just say "how bad new mutations are".
>
> The two drop-down menu plots should be swapped. The density plot showing trait/harmful changes should be dropped or archived, and the line plot showing copies over generations should be moved into the "Population 1, Up Close" panel beneath the small genome figures.
>
> Part D: I hate the term "the team". We can use biological terminology here. Likewise the "harmful change" phrasing is more confusing here (as in Part C) than just using some light jargon.
>
> I like this part overall. I think the displays are great, but I'm wanting this to be an avenue that clarifies/shows how inversions lock recombination until they're common resulting in all the upsides and downsides of linkage in terms of selection efficiency, and I'm wanting to illustrate that (when rare) this means that an inversion evolves **like** a asexual chunk, but evolves more "normally" later. Basically I want to use inversions to help illustrate Muller's ratchet again, while also building up the next unit (Migration) where we'll look at haplotypes and population differentiation.

Read as (mine):
- B, hermaphrodites: one sex, sixty genomes; each is the parent of six young and a mate for anyone's. Every genome carrying any of you copies or mates together; a copying genome takes no part in anyone else's mating. No males, so copying no longer multiplies you: copies of you hold near 1 under either choice (neutral), and the choice only sets how many genomes you are in and how long the sequences are. The old floor ("in at least 30 females") came from the cost of males and goes.
- C keeps females and males: it is where the cost of sons comes in. Its intro says so now that B has none.
- C's two labels as he gives them. The controls underneath are unchanged: "how often selection changes" is still a normal step each generation, never / rarely / often / very often over steps 0 / 0.5 / 1 / 1.5; "how bad new mutations are" still sets how many a young gets (U 0.1 / 0.3 / 0.7: mild / bad / very bad), not how much each one harms (s stays 0.12).
- "The two drop-down plots swapped" read with the sentence after it: the young-by-trait plot goes (archived with the page); the over-time plot takes its place in "Population N, up close", under the bead strings. The population looked at up close is drawn dark among the hundred. Price stays below.
- D: "the team" → your haplotype; "harmful change" → harmful mutation (C too).
- D, the idea: an inverted chromosome crosses over only beside another inverted one; how often it sits beside one is how common it is (with two copies lethal, never). So a rare inversion passes on whole, like C's copies, and harmful mutations ratchet up inside it; a common one crosses over with itself and evolves like the rest. The upside (your haplotype held together) and the downside (mutations ratcheting inside it) both from the one lock.
- How common it gets is set by what two copies do: kill (it settles near a quarter of chromosomes, never paired), no better than none (about half), help as one copy (nearly all). Harmful mutations fixed at 0.5 a young; no slider.
- Toward 17: the board sorts genomes by arrangement (two inverted, one, none) so the pairs that can cross over are the ones in view; a gene-by-gene panel: harmful mutations on inverted and standard chromosomes at each gene, which part only inside the bracket. Haplotypes and differentiation by picture, not named past "haplotype".

| # | Stage | What | Status |
|---|-------|------|--------|
| 34 | — | archive the page whole as `app/archive/lesson16_with_D_2026-10-12.html` (at `8c64baf`), README line | done |
| 35 | B | hermaphrodites ("genomes"); carriers copy or mate together; "sequence length"; targets re-measured | done: windows 18-30 (two generations of mating) and 8-16 (three to five), on length alone |
| 36 | C | labels: how often selection changes; how bad new mutations are; harmful mutation; intro: females and males here | done; targets unchanged ("Selection never changes", "Selection changes often", "New mutations are very bad") |
| 37 | C | young plot out; over-time plot into the up-close panel, the picked population dark | done; the engine still keeps the young when asked (the checks read them) |
| 38 | D | haplotype, harmful mutation; two copies kill / none / one; U fixed; board by arrangement; paired measure; gene-by-gene panel; targets | done: three targets (keep it whole at 40, inverted; pile up inside it at 100, kill; common and not piling up at 100, none or one); each round opens on a world that misses; the board shows the first population still carrying it |
| 39 | — | scoring and checks follow | done: `version: 6`, scaffold 16 (D1-D3); checks 41 + four R panels; C's R panel no longer stops when a population runs out of males |

Measured (2026-10-12; node prototypes of the page's code, scratch bh.js, bh2.js, d1-d4.js; 100 populations):

        B, generation 8, by generations of mating (20 starts; average sequence length 5th-50th-95th / genomes carrying you, median)
          0: 40 / 1.1   1: 40 / 2.1   2: 19.0-20.9-23.0 / 3.1   3: 12.3-14.1-15.9 / 4.2   4: 9.3-10.8-11.6 / 5.2   8: 4.6-5.1-5.8 / 9.8
          (when the matings fall changes length by under a letter; copies of you near 1 either way; copying alone loses you in ~75 of 100)
        D, generation 100 (26 starts kill / none, 6 one): share where it lasts · beside another · fewest inside · average inside (others)
          kill 0.22-0.24 · 0 · 1.04-1.93 · 2.7-3.2 (1.3)    none 0.47-0.50 · 0.35-0.39 · 0.10-0.40 · 1.5-2.1 (1.4)    one 0.90-0.97 · 0.88-0.96 · 0.11-0.32
          lasts at 40: inverted 58-75, standard 11-17. Gene by gene, kill: 2.0x the others' mutations inside 9-16, 1.0x at the ends
          5-17% of populations die out under the mutations whatever the settings (more without your haplotype)

Open for JM (2026-10-12):
- C's two labels sit on the old controls. "How bad new mutations are" sets how many a young gets (U), not how bad each is (s held at 0.12); a student may read "very bad" as each dot costing more. Making it s would change world 3: a harsher s purges faster, so copying alone may stop melting down; not measured. "How often selection changes" is still a step every generation, sized never / rarely / often / very often; a literal "how often" (the best value jumping at a set rate) would need world 2 re-measured.
- ~~B hermaphrodites, C females and males?~~ Settled below: hermaphrodites throughout.
- D's toward-17 is a picture, not a measure: the board sorted by two / one / no copies and the gene-by-gene panel (inside the bracket the two kinds of chromosome part; outside they match). Nothing named past "haplotype". A differentiation number could join the gene panel if 17 wants one to point back to.
- ~~A fourth target for the side effect?~~ Built below.

JM, 2026-10-12, evening:

> Hermaphrodites throughout would be good--I want to focus on the genetic cost of reproduction, rather than just the production of males per se. I like the side effect idea of D--also it serves as a good time to bring up mutational load (which we don't currently do).

Read as (mine):
- One engine for B, C, D: hermaphrodites. Every genome carrying any of you copies or mates (C's "your line" becomes that, as in B); a genome that copies is no one's mate, so copying gains nothing by numbers. The cost of mating is then all genetic: it breaks your best-value genome up (your dark alleles sit in opposite halves; a crossover makes gametes with 0 to 12). No aphid clone-son rule (no males).
- C's Price split counts every genome a parent (a young from mating half to each); now that there are no males it matches the plots. Your sequence passes on as it was (E(wΔz) averages ~0 in matings); you, whole, end in E(wΔz).
- D, 60 genomes. The side effect as a fourth target: "help as one", at generation 50 the standard chromosomes are the rare ones and their fewest inside climbs. Mutational load as a measure (how much a genome's harmful mutations cut its chance to live), split into the genomes carrying your haplotype and the rest, with a one-line definition in the intro. It shows where the lock is permanent (kill): carriers' load pulls ahead of a balance the rest settle at. It does not show in the side effect itself (below).

| # | Stage | What | Status |
|---|-------|------|--------|
| 40 | — | the engine: hermaphrodites for B, C, D; B's own step removed | done |
| 41 | C | text and labels for genomes; Price every genome a parent; windows re-measured: never changes, 6 gens, ≥ 5; changes often + bad (U 0.3), **60** gens, ≥ 1.2; never changes + very bad, 100 gens, ≥ 10; generations menu gains 60 | done |
| 42 | D | 60 hermaphrodite genomes; windows 1.5 (targets 2, 3); target 4, the side effect; mutational load (menu, readout, intro line) | done |
| 43 | B | window 18 → 17 (two matings reached 18.7 on the page) | done |
| 44 | — | `version: 7`, scaffold 17 (D1-D4); checks 43 + R panels; three consecutive passes. A's dN/dS check widened by a hair (0.125 prints 0.13: an old rounding-edge flake) | done |

Measured (node prototypes of the page's engine, scratch herm.js, c1-c2.js, d5-d7.js; 100 populations; min / median / max over starts):

        C, never changes, mild, 6 gens (16)          copy 6.5/7.2/9.1 · mate only at the end 4.2/4.7/5.8 (6.1 on the page) · every 5th 3.3/3.7/4.5 · mate 0.5/0.7/0.7
        C, often, bad, 60 gens (16-24)               copy 0.0/0.0/1.4 · every 2nd 1.3/1.8/2.7 · 3rd 1.4/2.2/3.9 · 5th 1.7/3.0/4.2 · 10th 0.6/2.3/3.9 · 20th 0.3/1.1/2.3 · mate ~0.7
          (often, mild, 30 gens: every plan 0.4-3.4, overlapping; often, bad, 40 gens: copy up to 2.0, every 3rd down to 1.3)
        C, never changes, very bad, 100 gens (16)    copy 1.2/2.0/3.2 (42-62 populations left) · mate 0.6/0.8/1.2 · every 5th 7.0/11.0/13.5 · 10th 16.1/19.3/22.5 · 20th 10.2/13.3/19.3
        D, 60 genomes (12 starts)                    lasts at 40: inverted 58-70, standard 5-22
          fewest inside at 100, yours: kill 2.17/2.65/3.03 · none 0.33/0.50/0.76 (1.16 on the page) · one 0.06/0.20/0.40
          fewest inside at 50, the others: one 0.35/0.48/0.67 · none ≤ 0.10 · kill ≤ 0.01 · standard ≤ 0.04
          load: ~0.28 in every setting once settled (a balance set by the mutation rate); kill at 100, carriers 0.31-0.32, the rest 0.27-0.28; one: no gap (the standard chromosomes are rare only a while, then lost in about half the populations)

Open for JM (2026-10-12, evening):
- C's numbers are small now. Without the cost of sons, copies of you grow only through your genome's fit: 7 at most in the still world (37 before), 1-4 in the changing one. The lesson holds (copying wins when nothing changes, mating now and then wins when it does or when mutations pile up), but world 2 needed 60 generations and bad mutations to separate at all.
- Load in the side effect: the rare standard chromosomes lose their mutation-free copies (the fewest climbs) but their average barely moves before they are lost, so their load does not show. Load shows where the lock lasts (kill). If he wants load on the side effect itself, the standard arrangement would have to stay rare longer (it is swept out now).
- "Mutational load" is named on screen with a one-line gloss: the first term this lesson names beyond haplotype. His call that it should be.

## Measured (2026-10-08)

A (node prototype of `A_fate`, 2,000 runs a setting; share lost / still here / in every copy at 4N, then the long-run formula):

        N 10 neutral              93.3 / 3.3 / 3.5     (5.0)
        N 100 neutral             99.5 / 0.3 / 0.3     (0.5)
        N 100, h 0.5, s −0.05     95.3 / 0.1 / 4.6     (4.88)
        N 100, h 1, s −0.05       90.7 / 1.1 / 8.2     (8.97)
        N 100, h 0, s −0.05       98.2 / 0.1 / 1.8     (1.78)
        any N, s 0.1 or more       100 lost
        lost within               5-13 generations on average

- So most of the ten rows read "lost 100". Small N or a helpful s is where anything stays.
- trpL frames after its stop: a stop at +27 (frame 0, the stop codon lost), +53 (+2), +82 (+1). Every one-letter indel in the reading meets its stop by letter 144.

B (node prototype of the page's engine; best = fewest harmful changes anyone carries at generation 200; 10th-50th-90th of 40 runs):

        U 0.3, s 0.1      N 20: 16-19-24 / sex 0-1-3     N 100: 4-7-10 / 0     N 500: 0-1-3 / 0     N 1000: 0-0-1 / 0
        N 100, s 0.1      U 0.3: 4-8-10    U 0.5: 15-19-22 (sex 0-1-1)    U 1: 52-59-67 (sex 3-4-6)
        N 100, U 0.3      s 0.02: 24-29-34 (sex 5-9-12)    s 0.05: 14-17-21    s 0.2: 0-0-1

- With sex the average settles at U/s (2.84 at N 500, U 0.3, s 0.1, against 3.0). Without sex the best class is lost again and again; the rate goes with N e^(−U/s).
- Starting clean, both populations' best rise at first while the load builds; only the one without sex keeps rising.
- Rounds' hit rates (100 runs a setting): see "Round windows" below.

A, 2026-10-09 (the page's A_fate; 200 sets of 1,000 populations, by 4N): went to fixation per 1,000, and how often none

        neutral   N 10 33.3 (0)   N 20 15.5 (0)   N 50 6.3 (0.2%)   N 100 3.0 (~5%)   N 200 1.4 (22%)   N 1000 0.3 (74%)
        N 20      s 0.1 1.4 · s 0.02 10.3 · s 0.005 14.3 · s −0.01 18.4 · s −0.05 37.5
        N 50      s 0.1 0.0 · s 0.02 2.2 · s 0.005 4.8 · s −0.01 9.8 · s −0.05 37.9
        N 100     s 0.1 0.0 · s 0.02 0.2 · s 0.005 1.8 · s −0.01 7.5 · s −0.05 46.4

- One synonymous change is the yardstick, so N stops at 50. Opening N 20.
- Every one-letter change in view: 30 synonymous (28 substitutions, as the codon table gives, + 2 indels in TGA that make TAA / TAG), 328 nonsynonymous, 794 noncoding.

## Round windows (B; node prototype of the page's engine, 100 runs a setting, share hit)

        R1  without sex, best <= 3 at 200 (U 0.3, s 0.1; N free)          N 100 4% · 200 37% · 500 98% · 1000 100%
        R2  without 12-25, with sex <= 2 (N 100, s 0.1; U free)           U 0.3 2% · 0.4 69% · 0.5 97% · 0.6 43% · 0.7 1%
        R3  without 12-25 (N 100, U 0.3; s free)                          s 0.02 28% · 0.05 97% · 0.1 1% · 0.2 0%

- Openings (N 100, U 0.3, s 0.1) hit 4 / 2 / 1%. R3's naive move (harsher harm) hits 0%.

## Open for JM

- ~~"100 runs of 100 populations" read as 100 populations.~~ Settled 2026-10-09: 1,000.
- ~~Item 18, the pooled ratio.~~ Settled 2026-10-09: beneficial and harmful apart.
- trpL is real but unnamed on the page. Name it (and the trp operon) in a setup bullet?
- C's targets are mine. D is a proposal.
- B's round 1 is a floor (3 or fewer), cleared by N 500-1000; one step up from the opening (N 200) clears it only sometimes. The ratchet is noisy; the windows are set on the idea (bigger, more, milder), not one step.
- B's bench has no new mutations (only what the parents carry); the populations do.
- C has no R panel numbers to check beyond the products; its R panel writes the crossover rules out.
- Voice blocks: none.

## Rulings

- 2026-10-09: a synonymous change locks s (at 0) and h, in view.
- 2026-10-09: kinds synonymous / nonsynonymous / noncoding (a third button for the flanks); then text targets in place of naming: 1 / 3 beneficial / 3 harmful / 1.
- 2026-10-09: 1,000 populations a change, one N for all eight (for dN/dS).
- 2026-10-09: dN/dS beneficial and harmful apart, no pooled ratio.
- 2026-10-09: B shows (1) sex's young spread wider than copies, (2) stable environments favour low variation and unstable ones high, and that sex halves what a parent puts in each young. C: watch events from a menu, then the manipulation and its five targets. D: an inversion in one population, its alleles riding together.
- 2026-10-09: the table's fates are extinct / went to fixation (his words); "still present" is mine.
- 2026-10-09: the runs readout is one sentence, his: "In X populations where this mutation arose, it went extinct in Y after Z generations." Too many specifics under a graph hide what to look at.

## Do not

- Draw the trpL 3' flank shorter than 83 nt: a frameshift then runs off the screen without a stop.
- Special-case start or stop codons: the reading is found the same way after every change.
