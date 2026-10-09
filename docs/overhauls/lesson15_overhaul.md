# Lesson 15 — the bridge: coalescence and linkage through a snake game (slot pencilled: JM, 2026-10-01: "make the snake game lesson 15")

**File** · `app/lessons/lesson15.html` — A, B, C, D built (v6, scaffold 15), locked
**Checks** · `node scripts/check_lesson15_numbers.js` (~40 s; islands differ run to run, the page seed is random per load) · `python3 scripts/test_codec.py` · `python3 scripts/check_lessons.py`
**Status** · fifteenth pass built (2026-10-09): JM's intros for A, B, C; the questions in a card under the pedigree; the jump + a pedigree of cells as D; old D archived. Thirteenth pass built (2026-10-08): a new C (the race, the jump); old C is D. Twelfth: Run to generation 100 on B. Eleventh pass built (2026-10-07): the island-over-time plot after A and after B; B's reads rebuilt on the plots; top score (in the code); Play again; Run to generation 15 after one played season. Checks pass. JM live-tests B's reads next. Mutation moved to `lesson16_overhaul.md`; the linkage plan that once held slot 16 is `lesson14_linkage_plan_absorbed.md`
**Last touched** · 2026-10-09 (fifteenth pass)

## Fifteenth pass (JM, 2026-10-09): his intros, the questions in the pedigree, the jump as D, old D archived

JM, dictated (speech-to-text as given; the intro texts themselves go into the page's voice blocks, speech errors fixed):
- Top note: *"for this new part D I'd like a 'number of jumps per division' slider, and that's it. The pedigree of cells should be allowed to crash and die. They should start with one cell and have it run for at least 5 generations. A second part, where a slider allows students to set a 'preference' for transposons to land between genes should be added."*
- A: an intro (*"This lesson we're going to explore mutation ... it doesn't always go up. That's worth pondering over."*); *"the bullet points should be greatly, greatly, greatly reduced. I'm thinking just an island with snakes that eat salamanders and hawks that eat snakes. Steer your snake using the mouse, gather as much food as you can, before producing a set of offspring with a random mate. Repeat for 15 generations or have the computer finished the generations off for you and then examine the pedigree answering the questions below. Done."*
- A's questions: *"all good. Um, except for the last one ... instead of saying like 10 of 30 copies, it should say, The frequency of 10 out of 30. And click the copy where it arose, should say, Select the origin of the allele. Also, it doesn't seem to be working here ... I have a situation where The allele 1st arose in the founding generation. But selecting the founding generation is listed as incorrect."*
- A and B: *"If we could have the question, text, and then this one button pop up beneath the lock ... the lock thing should just be like, Lock pedigree lines when you click them ... It should be a lock and a clear ... Find the highest fitness allele in the final generation. And the most recent common ancestor for that allele ... find the lowest fitness, allele left, and its most recent common ancestor ... find the highest fitness allele. That ever emerged on the island ... instead of being a stack, they just switch out as it goes on, maybe with an arrow button on the right. And left toggle forward and backwards in them so you don't have to do them in order."*
- B: an intro (*"This is the same as part A, but with one very small difference ... can be quite informative."*).
- C: an intro (*"The price equation describes the observed change ... Observe how its frequency changes over time."*); *"the question shouldn't be shown at the beginning. It should show up at the end ... I don't know that we need finish boxes in general. Each question should be presented on its own ... because genomes that didn't solve this problem, made fewer of themselves, and so became rarer."*
- The jump: *"a little text box replace the target exactly"* (*"DNA copies itself. Within the cell ... relative to other loci."*); *"The cell doesn't need to exist, your copy is in a gap, no gene is broken. Or your copy is inside a gene for that gene is broken, that subtext shouldn't be there ... maybe we should just replace stage D with the jump ... a simple toggle that allows jumping genes to jump at random ... they jump once per cell division ... we start with one jumping gene ... if the jumping gene lands in a gene, that cell fails to divide ... the transposon is jumping at random, but where it ends up in the cells that survive at the end is not random. And we archive the current stage D and lock it away."*

| # | What | Status |
|---|------|--------|
| 15-1 | archive: the page as it stands → `app/archive/lesson15_with_D_2026-10-09.html` (runnable), README note | done |
| 15-2 | A: JM's intro (voice); bullets cut to his three lines | done |
| 15-3 | A, B: the reads move into the pedigree panel, under "Lock pedigree lines when you click them" + Clear; one question at a time, ‹ › to move between them in any order; no stacked list, no "Reading the pedigree" panel | done |
| 15-4 | A: the last question in his words ("... with a frequency of 10 out of 30", "Select the origin of the allele"); the founder bug: not reproduced (origin marked correct on 24 test islands, both views, lock on/off, after a wrong answer, 1000 px); likely the MRCA step after it, which swapped into the same box; each step now named in the card, and a wrong answer says what was clicked | done; the check clicks a founder origin for real |
| 15-5 | B: JM's intro; questions in his words (highest fitness in the final generation + its MRCA; lowest fitness left + its MRCA; highest fitness ever on the island) | done |
| 15-6 | C: JM's intro (Price); the jump out of C; no To finish panel; the question on its own after the race targets; last option reworded | done |
| 15-7 | D (new): the jump (from C) with JM's text in the target's place (his written version, 2026-10-09, replaced the dictated one), no targets, the gap/gene caption gone; then a pedigree of cells: one cell, one jumping gene, k jumps a division (slider), a copy in a gene stops that cell; 5 divisions; may crash; where the jumps landed vs where the copies sit in the survivors; then the same with a preference slider | done: genes 25% of the strand, 5 divisions, k 0-5 (opening 1), part two opens at k 3 with preference 0 |
| 15-8 | old D (hierarchical Price + "your island in B") removed from the page | done |
| 15-9 | scoring: A1-A6, B1-B5, C1-C3 race, C4 the question; D unscored (finishes on one run of each part); `version: 6`, `scaffold: 15` | done |
| 15-10 | checks rewritten for the reads, C, the new D | done |
| 15-11 | JM 2026-10-09: "increase the recombination rate for the snakes ... more recombinant chromosome examples" | done: XO 0.1 → 0.25 a gap. Measured (60 islands): chromosomes crossed over 47% → 82%; visibly recombinant 7% → 13%; winter cards with one 16% → 24% (0.5: 23%). The limit is allele differences, not crossovers: most beads are plain grey. More new alleles a generation would show more |
| 15-12 | JM 2026-10-09: "Part A doesn't seem to clear" | done: a second click on the copy already picked cleared it, so when an allele's origin is also where its living copies meet (3 of 12 islands) its last answer could not be given ("Click a copy first"). A click now always picks; Clear clears. Check: all six answers with real clicks on such an island |

- C round 3 made JM's system (his C intro: heterozygotes low fitness, homozygotes sterile): s 1, h 0.2 (was h 0). Measured (300 islands): gold within 0.3-0.85 at 30 generations ×1.0 0%, ×1.05 0%, ×1.1 4%, ×1.2 91%, ×1.3 94%. The window now needs ×1.2: two steps past the first step the right way, against the "one step lands" rule (targets teach). JM to say if it should be looser.
- Questions: a question finished moves the card on to the next one left; "correct — on to question N". What was found shows when the student goes back to it.

Measured for D (node prototype, genes 25% of the DNA, 5 divisions, 4,000 runs): lineage alive at the end, no preference — k 0: 100% (32 cells), 1: 67% (7.7), 2: 33% (1.8), 3: 12% (0.4), 4: 4%, 5: 1%; preference 0.5: k 3 54%; 0.8: k 3 84%, k 5 71%. Genes 35%: k 1 48%, k 2 13%; 50%: k 1 22%.

## Fourteenth pass (JM, 2026-10-08, night): a question after the race

JM, dictated: *"After the students have run through it, they should be given a final multiple choice question. It should say that. The rules of myosis and gamete formation are evolved features, traits. The above simulation is completely possible and in fact does happen. See, for instance, the T. locus in mice. However, it's not common. It's not common, even though. It clearly does make more of itself. Why? ... because the world is just and fair, because those are the rules. Because it'd be really inconvenient if individual low si broke whole genomes and drove sperm like that. And finally, because Genomes that solved the problem made more of themselves as genomes. And so became more common."*

| # | What | Status |
|---|------|--------|
| 14-1 | the question in the race's card once the three race targets are taken (instructor: at once); his words, minor edits ("myosis" meiosis, "low si" loci, "T. locus" T locus, the doubled "it's not common"); options in his order, the last one right | done |
| 14-2 | first answer = bit C6 (index 16); a wrong one says "incorrect — try again"; the right one closes a new task "Answer the question about the race"; C needs it | done; D's bits move to 17-21; `scaffold: 22`, `version: 5` |
| 14-3 | check: shown after the race, first answer recorded, the rest stay open, right one closes the task | done (76 checks); one earlier run failed one existing check once in ten (not the new one) |

- Honest-science note: in the t haplotype the distorters harm the motility of every sperm in a +/t male and the responder rescues t sperm, so t sperm effectively swim better: close to the race as built.

## Thirteenth pass (JM, 2026-10-08, later): a new C — play as a gamete; old C becomes D

JM, verbatim: *"What is up with Part C? It seems to still be the old offspring clicking activity. A fine activity, could be a decent part D, but we were plotting an interactive part C where the students play as a gamete. At present, the concept of "gametes compete, and even genes compete" is beyond the students. It needs to be built, even if the build itself is dead simple: some gametes move faster than others is fine. I'd like a simple gamete racing game, and maybe a simple meiosis game where genes (transposons) try to jump around."*

- No plan for a gamete C was written down in this doc, memory or git; the only brief for C was the tenth pass's hierarchical Price line, and that is what was built. Told JM.

Read as (mine; JM may overrule):
- New C, two games, each played first and then a few bowling rounds:
    - **The race.** A snake with one gold and one grey copy of a gene; its sperm, half gold and half grey, race to an egg; gold sperm swim faster. You are one sperm (dealt gold or grey), steered with the mouse. First to the egg is the young's copy from its father. Rounds: set how much faster gold sperm swim, Go, and the island runs.
    - **The jump.** A snake's two chromosomes, seven genes each; you are a jumping gene. Before the cell divides you copy yourself once, anywhere: a gap, or into a gene (which breaks it). Then meiosis plays: the chromosomes copy, cross over once, divide twice into four gametes. A gene that never jumps is in two of the four.
- Old C (the hierarchical Price demo + B's island read back) becomes D, untouched apart from its letter. C's play is the intuition, D's split is the evaluation.
- Honest-science flag for JM: in animals most of a sperm's make-up comes from its father's two copies (the developing sperm share cytoplasm), so a sperm's own copy setting its speed is the exception (t-haplotype; some sperm-expressed genes). In plants, pollen tubes race on their own genes as a rule. Kept as snakes' sperm: a hypothetical, as JM's sperm-killer note is.

| # | What | Status |
|---|------|--------|
| 13-1 | old C → D: ids, stage, gates, BIT D1-D5, toc, the check script | done; D's code untouched apart from names (`C_` → `D_`, the state object `C` → `D`) |
| 13-2 | race engine: sperm with vigour, start spread, wobble; the player steers; one brood of six played, then 100 more raced by the computer | done: closed-form times (distance / speed × vigour × straightness), the wiggle drawn along each path so a sperm reaches the egg exactly at its time; a computer race is 2 µs (a stepped model was 250 µs and gave the same curve). Play at ×1.10 |
| 13-3 | race rounds (bowling, practice): gold sperm speed slider; the island's gold over generations, its change split into who had young (cost) and which sperm won (the race) | done: slider ×1.00-×1.30 by 0.05; three rounds (below); the island plot shows gold's share and the summed cov(w, z) + E(wΔz) |
| 13-4 | the jump: two chromosomes, one copy-and-paste, meiosis animated (copy, cross over, two divisions), four gametes counted | done: 2.6 s animation; after it, the cell keeps the chromosomes faint, the four gametes carry two-tone strands; ten-division rounds add a tally column |
| 13-5 | jump rounds: more than half of the gametes; all four in each of ten meioses; no gene broken | done; the first division is a free try |
| 13-6 | scoring: C's new bits, D's five after; scaffold and version bumped | done: C1-C3 race, C4-C5 jump, D1-D5 (16-20); `scaffold: 21`, `version: 4` |
| 13-7 | measure every bar before setting it; checks for both games | done: 14 new checks (74 in all), including the animation loop on a pumped frame clock |

Measured (the page's engine; 40,000 races a speed, 400 islands a setting):

        gold sperm swim                ×1.00   ×1.05   ×1.10   ×1.15   ×1.20   ×1.30
        gold wins a race               0.50    0.74    0.89    0.96    0.99    1.00
        R1 hits (≥ 60% of 400 young)   0%      100%    100%    100%    100%    100%
        R2 hits (0.3 → ≥ 0.4, 25 gen)  0%      13%     100%    100%    100%    100%
        R3 hits (0.05 → 0.3-0.85, 30)  0%      12%     100%    100%    100%    100%
        R3 where gold ends (median)    0.01    0.24    0.45    0.58    0.67    0.73

- R2 (s 0.4, h 0.5): the race must beat the cost. Rare gold spreads only if (1 − hs)(k + ½) > 1, k > 0.75; ×1.05 gives 0.74, so gold barely holds (median 0.26 from 0.3). Summed over a ×1.10 run: cov(w, z) −0.96, E(wΔz) +1.64.
- R3 (s 1, h 0): any race spreads rare gold (its cost is only in gold/gold snakes, which are rare), and it levels off below every copy because gold/gold young leave none. The 0.85 ceiling never binds (99th percentile 0.78 at ×1.30); it is there to say "not all".
- The jump: staying put, 2 of 4 always; a copy on the other chromosome, never fewer than 3; at the matching place, 4 always; on your own chromosome d genes away, 3 of 4 with chance d/7. One gap off the matching place passes ten divisions by luck (6/7)^10 = 21%.

Open for JM:
- The jump's ten-division round rewards the matching place on the other chromosome: what homing genes (and CRISPR gene drives) do. A transposon proper lands at random; it is not named on the page.
- No R panel for C yet (A and B have none either; D does).
- Voice blocks: none for C.
- Not built: an island where jumping genes spread while breaking genes (copies per snake up, fitness down). JM's "maybe".

## Twelfth pass (JM, 2026-10-08): Run to generation 100, island B only

JM, verbatim: *"Would it be easy to add a 'Run to generation 100' button for Part B? I like keeping A tractable, and I like having the Run to 15 for both...but the ability to go further would be nice."*

Read as (mine; JM may overrule):
- B only. Run to 15 stays on both islands. The 100 button shows once B's five reads are done (instructor bypass / study: once the 15-generation game is over). It records nothing.
- The reads stay with the generation they were dealt in (15, or 16+ after Run one more generation). Their reveals keep saying what they said.
- The island runs on as the seasons after a death do (food at random). Island B dies out before 100 on 0.6% of first deals (3 of 500), so that run is dealt again (same island up to 15, new seasons after).

Measured before building (the page's engine, 500 computer-played B islands, run on from 15 to 100):

        generation                         15       50       100
        mean fitness (10-90%)              1.05     1.23     1.47 (0.94-2.08)
        snakes born                        15.0     17.7     21.1
        coloured alleles alive             5.0      5.8      6.5
        a coloured allele fixed            2.7%     ·        72% (1.2 on average)
        a whole locus meets in the record  4.5%     ·        98%
        best allele ever drawn gone        79%      ·        88%
        fitness lower at 100 than at 0     10%
        coloured alleles drawn by 100      114; up to 18 share one s value, 16 one h value
        widest pedigree row                median 23, 90% 34, max 65 (at 15: 16 / 20 / 29)

- So 100 shows what 15 cannot: fixation (72%) and whole loci meeting (98%). Mean fitness rises by about half.
- What breaks at 100 as built: B's dot strips hold three rows (up to 18 needed); the lifespan plot gives 114 alleles under 2 px each; a 34-px pedigree slot cuts off a 35+ snake row; the time axis labels every 5.

| # | What | Status |
|---|------|--------|
| 12-1 | `LONG = 100`; Run to generation 100 beside Play again, B only, after B's reads; dealt again if the island dies out | done: `cloneWorld` / `longAttempt` / `runLong`; each deal runs on a copy with its own seasons and its own s/h stream, adopted only if it reaches 100; up to 20 deals; the played line marked ended ("ran on") so no snake past it is the player's |
| 12-2 | B's reads pinned to the generation they were dealt in (`c.at`); marks on B's plots cleared by the run | done; the best-ever reveal now says "still here in generation 15, N copies" (it said "still here") |
| 12-3 | dot strips under s and h: as many rows as needed, canvas taller to fit | done: `packDots`; seen at 100: ~10 rows, canvas 342 px |
| 12-4 | lifespan plot: at least 3 px a row, canvas taller to fit; time axis labelled every 10 past 50 | done; 114 alleles → 394 px |
| 12-5 | pedigree slot narrows (chromosome view to 25 px, others to 18) when the widest row would not fit | done; also covers the rare wide row at 15 that used to be cut off |
| 12-6 | B intro bullet; phase line after the run; the play task's hint past 15 | done |
| 12-7 | checks | done: 8 new (60 in all), two clean runs; screenshots at 100 (pedigree, lifespans, s and h) looked over |

## Note (JM, 2026-10-08): an allele that kills the other sperm (parked; placement open)

JM, verbatim: *"I don't know where to put that exactly, but I wanted to put it down to remember and it seems relevant for how I want to structure the lesson."*

> Imagine a locus where one allele makes a pigment protein and the other doesn't, so that aa = brown eyes, ab = hazel eyes, and bb = blue eyes (no pigment). Does the b allele have to do **nothing**? It doesn't code for pigment anymore, but what if it codes for something else? What if it now codes for, say, a toxin that harms other sperm. In that hypothetical case, in the population the covariance between fitness (w) and blue eyes (z) is negative--say -0.1. What controls the transmission bias (E(wdz))? Well it's proximally controlled by what gametes end up fusing. That is, cov(w,z) is about which organisms reproduce, while E(wdz) can be thought of as which gamete cells fuse. If sperm that carries the b locus **kills all of the sperm that don't carry the b locus** though....then anytime an ab/bb male reproduces, nearly 100% of their gametes will carry b. Which means b is very likely to be transmitted, even though individuals who are ab/bb are less likely to reproduce than aa individuals, the b allele is more likely to be transmitted. It has a positive bias to its transmission. So the balance tilts and you expect the frequency of b to increase so long as the transmission bias is greater than the selection against.

Where it could go (mine):
- C round 2 is already this case without the story: *"The snakes with more gold have fewer young, and still gold gets commoner."* (rules cov(w, z) snakes < 0, no copy changes). The only way to clear it is drive: a gold/grey snake's gold copy reaches most of its young. The sperm killer can be that round's story, or C's intro (C has no voice block yet).
- "Which gamete cells fuse" is the **inner cov(w, z)** in C's split (copies reaching more young), not the inner E(wΔz) (copies that came out changed). The killer is selection one level down, inside the snakes' E(wΔz).
- Bigger, not measured: a driving allele in B's game. B's mean-fitness plot would fall while that allele rises.

To raise with JM:
- The bias comes only from **ab** fathers. A bb father passes b to every young, toxin or not. The transmission term scales with the number of heterozygous fathers and goes to 0 as b nears fixation.
- So "so long as" holds at some frequencies and fails at others. The balance sits at a frequency (table). Rare b, father-only drive k: b spreads if (1 − hs)(k + ½) > 1; full drive → the heterozygote's cost hs below 1/3.
- z: the drive acts in hazel (ab) males. z = share of b copies (0, ½, 1), as C scores it, catches that. z = "blue eyes" (bb only) does not. Eye paleness works as z only because hazel is halfway.
- The kill has a cost, and Price books it in cov(w, z): a male that kills half his sperm may sire fewer young. One act, both terms. (+/t house mice lose sperm contests against +/+ males.)
- A killer needs immunity: a b sperm must survive its own toxin. The house-mouse t-haplotype holds its killer genes and the gene they spare together in four inversions; a crossover between them makes a chromosome that kills its own sperm. Ties to 14's recombination and to 15's one chromosome. Not needed for the hypothetical.

Measured (scratchpad `drive.py`; deterministic, random mating, drive in fathers only, aa 1 / ab 1 − hs / bb 1 − s, b from 0.01; share of b in adults where it settles):

        k      h     s      settles at
        0.5    0.5   0.2    0       no drive: selection alone
        1      0.5   0.2    1
        1      0.5   0.5    1       hs 0.25
        1      0.5   0.8    0       hs 0.40, above 1/3
        1      0     1      0.50    bb dies: every adult ab, half of every brood dies
        0.95   0     1      0.39
        1      0.3   1      0.13
        1      0.4   1      0

- JM's −0.1: with bb lethal and full drive, one generation from young in random-mating proportions at p 0.4 gives cov(w, z) −0.11 and E(wΔz) +0.14: b still rises. At p 0.6, −0.23 against +0.19: it falls.

## Eleventh pass (JM, 2026-10-07, later): a plot over time; B's reads on the plots; top score; run to 15

JM, verbatim:
- *"an interactive plot where the x-axis is time (generations) and the right axis has drop down toggles for allele frequency (e.g., frequency of ___ locus ____ with lines for alleles at that locus over time, so two drop-downs), heterozygosity, population size, total genetic diversity, and extinction times (or MRCA times? Or both?). This should appear between parts A & B, with an additional version between B and C."*
- *"For Part B, the h/s distribution that exists at generation N should be shown along with the generation distributions. An additional toggle on the plot showing mean fitness over time should be added, too. The activities here should not be clones of those from Part A. Rather we should have them ask about interpretations of the plot and graphs--though I am not yet sure what. Maybe something like finding the worst alleles and best alleles present in the final generation & comparing their time-to-MRCA?"*
- *"For A & B: A 'run 15 generations' button should also always be available after students have played one generation of each game themselves. That way they aren't forced. BUT: For both Part A and B a 'Top score' should be displayed with the number of offspring produced to try and encourage students to play for keeps--if a lineage dies, it stops updating so it's the 'best run' instead of a continuous tally."*

Read as (mine; JM may overrule):
- "the right axis" = the y-axis (dictation). Two menus over the plot: what the y-axis shows, and which locus (for the per-locus measures; "all loci" where a sum or mean means something).
- Measures: allele frequency (every allele at the locus, plain grey included, a line ending where the allele is lost); heterozygosity (the share of snakes carrying two different alleles, counted, as lesson 11 D); snakes (born, and those that had young); distinct alleles ("total genetic diversity", as the winter card's plot); alleles' lifespans (each allele a bar from the generation it arose to the one it was lost: the extinction times); time to MRCA (each coloured allele: how many generations back its living copies meet, every generation it is alive). Both, as JM asked. B adds mean fitness (the average snake's multiplier).
- A whole locus coalesces within 15 generations in 4.5% of islands (measured below), so "MRCA times" are per allele: a coloured allele's copies always meet, at or after its mutant.
- Click a line to pick an allele (others fade); hover for the values at a generation. Clicking a copy in the pedigree picks its allele too.
- B's "h/s distribution that exists at generation N" = the s and h of the coloured copies alive in generation N, as bars over the curves new alleles are drawn from ("the generation distributions"); N on a slider. Alleles shown as dots in two strips (alive in generation N / gone by then), clickable.
- Top score = the young your played snakes have had, summed over the seasons you steer (11-10). It stops when your line ends (death, no mate, Run to generation 15). The best game is kept in the student's saved state and carried in the code (11-11); Play again or a reload is a new game on the same founders.
- "Run to generation 15" appears once a season on that island has been steered to winter (not "Let this season play itself"). It ends play, as a death does.

B's reads (proposal; JM "not yet sure what"), each one bit, first answer:
- B1 the best allele left in the last generation (lowest s): pick it (dot, line or a copy). B2 where its living copies meet: click that copy.
- B3 the worst left (highest s); B4 where its copies meet (one copy is its own).
- The reveal after B4: both on the time-to-MRCA plot, with 200 computer-played islands run on the page for the comparison (one island is a coin toss, see below).
- B5 the best allele that ever arose on the island: pick it. Reveal: when it was lost, or its copies now; and the 200 islands' share lost.

| # | What | Status |
|---|------|--------|
| 11-1 | time plot, A (after A's reads) and B (after B's game), measures and menus as above; hover, click to pick | done: `islandSeries` (cached until the island breeds), `drawTime`; y-axis menu + locus menu ("all loci" off for frequency, menu hidden for snakes / fitness); hover = dashed guide + numbers under the plot; click picks (others fade to 0.28); a pedigree copy picks its allele and turns a one-locus plot to its locus; time to MRCA draws the picked allele's age dashed beside it (where they part, the copies no longer meet at the mutant) |
| 11-2 | B: mean fitness on the plot | done: mean line, lowest-highest snake band, dashed 1; B's default view |
| 11-3 | B: s and h of the copies alive in generation N, over the drawing curves; slider; alleles as clickable dots | done: curve = density new alleles are drawn from, bars = density of coloured copies in N (0.1 bins); ▲ means (blue new, ink copies) on the axis and in numbers under it; dots packed three rows a strip; panel moved below B's plot |
| 11-4 | B's reads rebuilt (B1-B5), "Run one more generation" when fewer than two coloured alleles are left | done: `ChalB`; allele steps take a dot, a line or a copy; copy steps only a pedigree copy; reveals: the allele's copies' lines on the pedigree, then best and worst labelled on time to MRCA (all loci), then best ever on the lifespans; the 200 islands run when B4 is found (84 ms, real time) |
| 11-5 | top score, A and B: HUD and island panel; freezes when the line ends | done: `w.tally` adds the played snake's young at each winter of a steered season (11-10); the seasons after a death / Run add nothing; re-founded island = new game; kept per student (11-11, 11-12) |
| 11-6 | Run to generation 15 after one steered season (instructor bypass/study: from the start) | done: island panel and the winter card's side column; ends play as a death does |
| 11-7 | scoring: B 6 → 5 bits, scaffold 16, version 3; C's island read-back follows B's best allele | done |
| 11-8 | checks: series re-derived, B reads re-derived, top score freeze, Run button, canvases fit | done: ~40 s; see 11-12 for the count |

Open for JM (eleventh pass):
- "the right axis" read as the y-axis (dictation). If he meant a second axis drawn on the right, the menus move, nothing else.
- B's reads are my proposal on his "Maybe something like ...". Best-left vs worst-left time to MRCA is a coin toss on one island (57%), so the page prints 200 more islands beside it. B5 (best ever, gone 79%) is mine. JM: *"B's reads seem fine for now, I'll live test it in the morning."*
- B now has 5 bits, not 6 (scaffold 16, version 3).

Follow-up (JM, same evening): *"A 'play again' button is great, and no--letting the season play out shouldn't improve the score. I would like the score recorded, though, in the code--maybe using the notes column or something else."*

| # | What | Status |
|---|------|--------|
| 11-9 | Play again: island panel and the winter card, once the line has ended; same founders, new seasons (`dealt(w)` adds the game to every seed after the founders); score from 0, top score kept; reads dealt anew | done |
| 11-10 | a season let play itself adds nothing to the score (it still counts as the line going on) | done |
| 11-11 | the top score in the code: `Score.setNote` / `getNote` (score.js), an eighth payload field `topScoreA=…;topScoreB=…`, only when a lesson sets notes, so every other lesson's codes keep seven fields; `decode_codes.py` prints it first in the notes column (table and CSV), `verify_code.html` as "Lesson notes", `aggregate.html` CSV gains a notes column; a code already on screen is rebuilt when the top score changes after the lesson is finished | done; `test_codec.py` has a lesson 15 case with notes, read back by both sides |
| 11-12 | tightening: the top score kept in the student's own saved state (per name and lesson version), not a bare localStorage key a shared lab computer would hand to the next student; a read's bit is its first answer ever (`Score.isAnswered`), so Play again or a reload cannot re-take a missed read; the plot cache keyed by game; read ticks cleared for a new game; the generation-N slider counts a move on release, not every pixel | done; checks 49-50 (one runs only when the steered season leaves the line alive), 23 clean runs |

Measured before building (the page's own engine, `found` + `runRest`, computer-played; B unless said):

        coloured alleles alive in gen 15           mean 5.1; fewer than 2 in 0.5% of 1,000 islands (A: none of 400)
        best left vs worst left (s)                 s -0.28 vs +0.38; best helps 93%, worst hurts 95%
          age (generations since it arose)          7.5 vs 4.9; best older in 58% (tie 3%)
          time to MRCA of its living copies         4.0 vs 2.0; best further back in 57% (tie 14%)
          copies                                    7.7 vs 3.2; worst has one copy 40%, best 27%; ties on s 10% / 7%
        best allele ever drawn, alive at gen 15     21% (gone in 79%)
        mean multiplier, gen 0 -> 15                0.946 -> 1.037 (average); higher at 15 in 69% of islands
        mean s: drawn / alleles alive / copies      0.105 / 0.052 / -0.047; copies' mean below the drawn mean in 74%
        whole locus (all copies) meets by gen 15    4.5% of locus-islands

- So best-vs-worst time to MRCA is a coin toss on one island (57%) though the averages differ twofold: the reveal pools 200 islands. The best allele ever drawn being gone is the reliable one (79%).

## Tenth pass (JM, 2026-10-07): 15 generations, three views, challenges; B selected; C hierarchical Price

JM, verbatim:
- *"if the player dies or fails to mate, that's the end. Otherwise it should go 15 generations to produce a clean pedigree."*
- *"get rid of the red glow on player snakes & lineage--or add a toggle for it so students can see offspring lines for each played individual."*
- *"an 'organism view' (where each individual is a snake icon) and 'chromosome view' (where we have it as it is now--with the ability to trace where each gene came from), and also a 'locus view' (where each individual is a pair of circles representing one locus with a dropdown-menu to select which of loci 1-7)."*
- *"highlighting a specific allele and asking the student to select the parent and grandparent and great-grandparent of that allele on the pedigree, then selecting two loci from the last generation & asking the student to locate their most recent common ancestor, then finding any alleles at fixation in the final generation (if none, have the student run a few more generations until one hits) and find the origin of the fixed allele & the most recent common ancestor of living individuals with it."*
- B: *"new mutations are not selectively neutral: instead they have a random heritability (h) and fitness effect (s) pulled from a shown distribution. The s vallue refers explicitly to the newts-to-offspring ratio: a bb snake with b_s = -0.5 gets 1-(-0.5) offspring per consumed newt (so 1.5) ... a snake consumes 2 newts and it counts as 3 ... Then repeat."*
- C: *"a hierarchical Price equation example. I want to drill in that the E(wdz) term for individual organsisms has, within it, a cov(w,z)+E(wdz) at the level of DNA strands--that is, how DNA strands copy themselves relates directly to how we expect organisms to transmit said strands."*
- Later: *"have the lines only appear when an individual/locus gets clicked in the pedgiree view for parts A & B--a the omnipresent hover-over option can get laggy. I'm imagining clicking to show the lines, and a 'lock' toggle at the bottom to let you click another."*
- Later: *"individuals that did not reproduce can be removed from the pedigrees instead of just paled out. Only those that reproduced need to be shown"*

Read as (mine; JM may overrule):
- Death or no mate ends play; the seasons left to generation 15 then run themselves (random food, as Skip did) so the pedigree is whole. Skip 5 goes.
- "two loci from the last generation" = two copies of one gene, in two snakes of the last generation; their MRCA = the copy where their lines join.
- A fixed allele = a coloured one (plain grey has no origin on the pedigree). Its MRCA = the copy every living copy at that gene descends from.
- Answering: click a bead (selects it, shows its lines), then "This one". While a target is open its own lines up stay hidden (they would draw the answer); a candidate's blue lines down are how to test it.
- Lock ticked: a click adds lines, the old stay. Unticked: a click replaces.
- Past generations show breeders only; the living generation shows everyone.
- Glow toggle "your snakes": glow + lines to each played snake's young. Kin glow gone.
- B: a snake's newts count x product over genes of (1 − s) for two copies, (1 − h s) for one, (1 − hₐsₐ − h_b s_b) for two different new alleles; grey s = 0. s and h drawn per new allele, distributions drawn on the page.
- C: organism w = young / mean young, z = share of its two copies with the allele; copy w = young that got that copy / (mean young / 2), z = 0 or 1, Δz = mutation. Exact: E_snakes(w Δz) = E_snakes[cov over its two copies] + E_copies(w Δz). Built as lesson 13 A's demo (three pairs, one gene; set young, which copy each got, mutation; rounds on the young's frequency).

| # | What | Status |
|---|------|--------|
| 10-1 | game ends at death / no mate / no young (rest runs itself) or generation 15 | done; `w.ended` names why; Skip 5 gone; instructor-only "Run to generation 15" under bypass / study |
| 10-2 | views: organism / chromosome / locus (locus 1-7 menu) | done; mates side by side, each pair under the middle of its parents' places, rows centred |
| 10-3 | lines on click only; lock toggle; "your snakes" toggle; kin glow gone | done; no hover redraws (cursor only); a copy clicked in organism view draws its path snake to snake; "Clear the lines" beside lock |
| 10-4 | non-breeders dropped from past rows | done; the living row shows everyone |
| 10-5 | A reads: trace 3 back; MRCA of two copies; commonest coloured allele: origin + MRCA | done, **fixation swapped for the commonest coloured allele** (measured below); "Run one more generation" only when none has 3 copies |
| 10-6 | B: the game again, new alleles with s and h; distributions drawn; salamanders "count as" | done; HUD, heads, winter card and spring message say what a catch counts as; clicked copy's s and h tagged on the pedigree and its tick lifted on the curves |
| 10-7 | C: hierarchical Price demo + rounds | done: three pairs, one gene; + / − young, click a young's copy to switch its parent copy, diamond = came out changed; nested arrows; 5 rounds; R panel; plus "your island in B, winter by winter" (not asked) |
| 10-8 | scoring, gates, done banner | done: `version: 2`, `scaffold: 17` (A1-6, B1-6, C1-5), first click on This one / each scored Go; misses never shut a door |
| 10-9 | `check_lesson15_numbers.js` | done: 39 + R panel (Rscript), all pass, ~1 min |

Measured (model of `modelSeason`, 1,000 games, 14 founders, 15 generations):

        coloured allele fixed in gen 15        1.8%   (B: 2.7%)
        more generations until one fixes       median 21, 80% 32, 95% 38; none in +40: 44% (B: 34%)
        commonest coloured allele, gen 15      median 12 copies (10th pct 5) of ~29, in ~10 snakes; < 3 copies ~3%
        its copies' MRCA later than its origin 83% of games, 4.0 generations later on average (fresh islands in the check: 47 of 59)
        pairs, same locus, two snakes, gen 15  any that meet in the record: 100%; meeting 3-8 back: 100%
        B: s ~ N(0.1, 0.3) clipped [-0.5, 1]   no game over in 2,000; s < -0.25 lost 91%, s > 0.25 lost 99.6% by gen 55; gen-15 row 15 (95th pct 20, max 29)

- So "a few more generations" does not reach fixation at ten snakes. The commonest coloured allele keeps the point fixation was for (its living copies meet in a copy younger than the mutant).
- C's island panel: a big share of each winter's change sits in the copies-inside-snakes term (which copy each young got: segregation), i.e. drift lives partly inside the snakes' E(wΔz). Not measured as a share yet.

Rulings (JM, 2026-10-07, after the build):
- *"Most common is great"*: the commonest coloured allele stays in place of fixation.
- *"having the remaining seasons play themselves is solid"*: no restart after a death.

Open for JM (he is looking into these):
- Reads use the lines (click the marked copy and follow red; lock + two clicks show where a and b meet). Hide the target's own up-line during a read, so a candidate's blue down-lines are the test?
- C is lesson 13 A's demo one level down; the rounds teach "the snakes' E(wΔz) is made of which copy reached more young + copies that came out changed". A meiotic-drive round (gold costs its snakes young and still spreads) is round 2.
- Voice blocks: none yet for A, B, C.

## Ninth pass (JM, 2026-10-04): no history before play; a mutant in every founder; questions and plots on the winter card

- *"I would like the text at the bottom of the Pedigree totally removed."* Read as: the `#pedRead` readout under the pedigree canvas, and `pedRead()`. Hover and click lines stay.
- *"I'd like the generations before the start removed & not displayed."* Read as: PRE goes (no seasons simulated before play); the founders are generation 0, with no parents. The dashed start line and its label go with them.
- *"I'd like each individual in the starting generation to have one random mutation at a locus."* Every founder gets one new allele, random gene, random copy (14 colours at the start). The player is a random founder. One new allele a generation from generation 1 stays.
- *"On each 'end season' card where the mate is shown I'd like three questions: Did any of your alleles **not** get passed on? Did you pass on a recombinant chromosome? Do any of your offspring have a new mutation?"*
    - Shown only when there is a mate (a mate means ≥1 young: two fed snakes pay for at least one). Yes / No buttons in the pop-up's side column, locked after one pick, then right/wrong and the evidence marked on the card. Not gated, no bits (scoring later).
    - Answers measured off the snakes, as the card shows them: an allele = one colour at one gene (plain grey counts), passed on if any young carries it on the chromosome from you; recombinant = a chromosome from you that matches neither of yours, before any new mutation (a crossover between identical stretches cannot be seen and does not count); new mutation = a ringed bead in your young.
- *"two small plots displayed below the children: one showing frequency of each starting allele in the population so far and one showing the total number of distinct alleles in the population--both across all loci."*
    - Plot 1: one line per founder allele (the 14 colours), its frequency at its gene, generation 0 to now, 0 to 1; a line stops where the allele is lost. Plain grey left out (seven identical grey lines near the top tell nothing apart).
    - Plot 2: distinct alleles summed over the seven genes, grey included (21 at the start).

| # | What | Status |
|---|------|--------|
| 9-1 | pedigree readout removed | done (div, CSS, `pedRead()`, `FATE`); hover/click lines kept |
| 9-2 | no generations before play; founders = generation 0 | done: PRE gone, dashed start line and label gone, `found()` one pass (no retry: nothing to die out) |
| 9-3 | one new allele in every founder | done; checked headless: 14 founders, one coloured bead each, 21 alleles at load; one new allele in each of generations 1-10 after two skips |
| 9-4 | three questions on the winter card (when there is a mate); evidence marked after answering | done: `winterAnswers(me, kids)`; Yes / No in the side column, "correct" / "incorrect" as 10 and 11 word it, then × on your beads that went to none of your young, "mix of your two" under a recombinant young; hand-checked on four cards (a hidden crossover between matching stretches not counted; a new allele over an inherited grey counts as new and as not passed on). The pop-up now scrolls when the card plus questions outgrow a short window (the top was clipped out of reach) |
| 9-5 | two plots under the young: founder-allele frequencies; distinct alleles | done: bottom band of the card, on every card; young three to a row from nine up; screenshots at broods 1 / 4 / 8 / 14, ~700 and ~450 px arena, no overlaps; small text sized up for the narrow card |
| 9-6 | measure how often each answer is Yes (a question that is nearly always No teaches little) | done, table below |
| 9-7 | the mate's relatedness beside the mate on the card | done: `relation(a, b)`, printed under the mate's chromosomes (above them it ran into a ringed bead) |

- 9-7, JM (same day, later): *"the relatedness of the mate (sibling, 1st cousin, 2nd cousin, or distant) should be displayed next to the mate each season"*. Closest shared ancestor: parents → sibling, grandparents → 1st cousin, great-grandparents → 2nd cousin, none within three generations (or none on record: the founders have no parents) → distant. Every snake breeds once with one mate, so siblings are always full siblings.

**Measured** (the population model, food handed out at random as Skip does; 6 games x 45 generations, 2,516 parent-seasons; each parent of a pair counted):

        generation   n      Yes: not passed on   recombinant   new allele   mate: sibling / 1st cousin / 2nd cousin / distant   young
        0            58     28%                  0%            21%          0 / 0 / 0 / 100%                                     3.1
        1-4          224    28%                  12%           21%          16 / 40 / 13 / 31%                                   3.1
        5-19         832    24%                  13%           22%          20 / 45 / 31 / 4%                                    3.1
        20+          1402   29%                  19%           21%          19 / 50 / 28 / 3%                                    3.1

- No question is nearly always No, but the recombinant one can never be Yes in generation 0 (a founder differs between its chromosomes at one gene at most) and is Yes about one season in eight until diversity builds. A played snake eats more and has more young, which lowers "not passed on" and raises the other two.
- Past generation 5 nearly every mate is a sibling or cousin: one in five a sibling.

## Eighth pass (JM, 2026-10-02): the winter card

- *"a card at the end of each season showing your snake & its genes and your snake's random mate & its genes, and your offspring and their genes. The offspring the next round starts as should have a glow."*
- Built in the pop-up, in place of the arena once the season ends (played or let play itself; not after Skip). Your snake (icon, catch or fate, two bead strings) | your mate | your young: each young's chromosome from you above the one from your mate, so a crossover shows as a mix of your two strings; the one you play next glows red. No young: the snake from another family you play next, glowing. New alleles ringed as in the pedigree.

| # | What | Status |
|---|------|--------|
| 8-1 | winter card in the pop-up | done; checked headless after autopilot seasons (5 young, the next one glowing); the side counters show only the next generation while it is up |

## Seventh pass (JM, 2026-10-02): lines for one gene copy only; glow, no boxes

- *"The pedigree should only show lines for a highlighted locus, and should show those lines up & down. Descendants/ancestors of the player should just be highlighted with a glow. We don't need a rectangle around each, just show the chromosomes"*.
- Read as: point at (or click to keep) one bead = one copy of one gene; up = where that copy came from, back to the founders; down = every copy passed on from it. Family lines, the always-on 14-copy trace, the blue tint, the player's boxes and the snake parent/young hover lines all go.
- Glow: the player's snakes red; the snakes they descend from and that descend from them pale red. Cuts the sixth pass's "K of N" readout (it described the removed trace).

| # | What | Status |
|---|------|--------|
| 7-1 | lines only for the highlighted copy, up (red) and down (blue); click a bead to keep it | done; readout says how many snakes now carry that copy (seen: 12 of 15, ten generations on) |
| 7-2 | glow for the player's snakes and their ancestors/descendants; no rectangles | done; kin saturates within a few generations, so most snakes glow pale and the unrelated ones are the exceptions |

## Sixth pass (JM, 2026-10-02, later): the game as a pop-up; grey start, one new colour a generation

- Goal: *"The main goal I want to get across is that different loci in one individual coalesce to different individuals in the past. I want to build that intuition first before we actually do coalescence."*
- Layout: *"put the game above the pedigree instead of beside"*, then *"Alternatively, having the game as a 'pop up' that covers the page could allow more freedom."* Built: the pop-up (pedigree gets the full width).
- *"showing fewer past generations and more descendants ones could work. The player character begins with a mutation at some locus, but all other loci could start as gray with one new mutant each generation chosen at random to add a color"*: PRE 10 → 3; founders all grey; no new alleles before play; the player's one at generation 0; then exactly one a generation.
- Added toward the goal (not asked; JM may cut): the current player's snake's 14 gene copies traced back, always (click any snake to trace it instead); the snakes it descends from tinted; the snake where each colour arose ringed.

**Measured** (node model, 400 games, one snake's 14 copies traced back):

        generations back   snakes holding its copies (crossover 0.1 / 0.2 / 0.5)   snakes it descends from there
        3                  3.3 / 4.1 / 5.1                                        5.6
        5                  4.0 / 5.0 / 6.1                                        7.8
        10                 4.5 / 5.4 / 5.9                                        8.5

- Different genes of one snake reach different ancestors at any rate; about half its ancestors five or more generations back passed it none of the 14. The family tree saturates at ~8 because ~10 snakes breed.

| # | What | Status |
|---|------|--------|
| 6-1 | game in a pop-up over the page; pedigree full width, bigger beads | done: arena min(100vh − 60, 96vw − 290) px, HUD/buttons in a side column (~710 px on a 1300 x 860 window); "Back to the pedigree" / "Play the next season" at winter; Esc or the backdrop closes between seasons; beads ~7 px |
| 6-2 | grey founders, PRE 3, the player's allele, then one new allele a generation | done: no new alleles before play; exactly one from generation 1 |
| 6-3 | a snake's gene copies traced back (yours by default), its ancestors tinted, each colour's origin ringed | done: click a snake to trace it, again for yours; readout "Its 14 gene copies came from K of the N snakes it descends from in generation −3" (seen: 3 of 6, 3 of 10, 4 of 10, 5 of 8); a chromosome's genes draw as a band that splits at crossovers |

## Fifth pass (JM, 2026-10-02): simpler genetics, random mating, the family always drawn, new sprites

- *"the snakes shouldn't grow"*: found in the code: bodies were laid SEG apart at each season's start, then re-laid SEG + one frame's travel apart, so every snake stretched from 113 units to ~139 (60 fps) or ~186 (30 fps) in its first seconds each season. Fix: body points resampled at exactly SEG along the head's trail (112.5 at any frame rate, checked headless).
- *"remove my idea about putting the genes directly on the snake icons"*: no allele dots in the arena.
- *"a single chromosome with 7 loci represented as a string of circles ... color coded by allele"*: pedigree beads, two strings a snake (mother's above, father's below).
- *"the player's offspring to be 'locked' as shown--so the full family tree of the player and all descendants always shown"*: lines from every descendant of a player's snake to its parents in that family, always drawn; the player's own chain bold. Hover lines stay.
- *"Mating should be random--not a player choice"*: no winter den; the fed pair at random, the player included.
- New sprite sheets (hawk, newt): four directions, two frames each (side, toward the viewer, away); the frame set picked by heading.

**Measured** (node model of `modelSeason`, one chromosome of 7 genes, 600 games):

        crossover per gap   generations   genes down to one ancestor   TMRCA   the two end genes, different ancestors   neighbours, different
        0.1                 20            0.13                         16.5    1.00                                    0.57
        0.1                 30            0.36                         22.4    0.93                                    0.74
        0.2                 30            0.36                         22.5    0.96                                    0.91
        0.3                 30            0.37                         22.3    0.96                                    0.94

- 0.1 kept: ends nearly always differ, neighbours often share: the gradient along the chromosome shows.
- At the game's present size (~15 born, 10 kept) only ~1/3 of genes reach one ancestor in 30 generations (the 80% in the first pass was 8 snakes). Not changed this pass.

| # | What | Status |
|---|------|--------|
| 5-1 | snakes a fixed length | done |
| 5-2 | no dots on snakes; one chromosome, 7 genes; pedigree beads | done; beads ~4 px (15 snakes x 7 genes in half the page); a full-width pedigree under the arena would double them: JM's call |
| 5-3 | random mating (no den, no best-fed mate for the player or the autopilot) | done; spring message names the mate's catch and why a line broke |
| 5-4 | the player's family drawn always | done: pale red to family parents, bold for the player's own line; ~everyone is family within ~5 generations, so the lines get dense |
| 5-5 | JM's new hawk and newt sheets, by direction | done: side / up / down chosen by heading, side mirrored; 12 frames, 48 colours, 34 KB (the old six were 118 KB); his side-view and top-down frames all used |

- Not re-measured: the player's edge. Most of it was choosing the best-fed mate (fourth pass); what is left is eating and dodging hawks.

## What the lesson is

- JM, 2026-10-01 (first pass): *"intro to coalescence via snake game"*; *"the point is to teach them nothing about genetics per se. He says how to read a coalescence plot. As they move through time."* (dictated; "He says" reads as "It's"). Readings linked to *"4N and 4NU [4Nμ]"*.
- JM, second pass: *"make the snake game lesson 15 and use it as the bridge. We track alleles over time, and have random mutations at loci. Maybe to start each locus has 1-3 alleles, and through play alleles end up extinct and mutation adds them (1 mutant per generation average?)"*
- *"the main goal is to build intuition, rather than strict simulation of precise parameters. By creating advantageous snakes we're lowering the effective population size. But rendered carefully, the meaning of coalescence, that the MRCA =\= the original mutator, and that loci can coalesce to different ancestors, etc should all emerge from the game itself."*
- The meta point, on the player's edge: *"the player absolutely biases the snake—and because we move to offspring the player advantage is heritable…but the effect of individual alleles on the player is nil. Which illustrates a meta point."* (heritable is not the same as genetic: the player's skill passes down the line by the game's rule, not by any allele.)

## Stages (JM, second pass)

    A  pure mutation + drift: several loci, 1-3 alleles each to start, about one new allele a generation; play, and the pedigree / genealogy builds beside the arena
    B  one locus with a good allele ("more kids per unit food"), one with a bad one ("fewer kids per unit food"); "The s and h of each allele at those two loci are shown in a diagram beside the game"; neutral loci and neutral mutation stay; "a few rounds to see linkage in action"; "a few simple questions (does the player have an advantage? Is that advantage heritable?)"

## Third pass (JM, 2026-10-01): the pedigree, food as the only limit, s in units a kid

- Pedigree: *"The pedigree should show the chromosomes for each individual, and the lines don't need to appear unless you hover over one. The player's snake in each generation should be highlighted in the pedigree though."*
- Food: *"The limitation should emerge from the food. There should only be enough food on screen for 10 snakes to produce 10 more snakes on average (+/- allowed). So if each offspring costs 2 food units, there should be 20 food units on the screen 'up for grabs'. Snakes that don't get any food die before the mating part. A pair of snakes produces a number of offspring equal to the sum of their food units divided by the units needed per kid."*
- Selection: *"The 's' value for stage B, then, should be easily interpretable in terms of units/kid—something likely only needing 1.5 units/kid"*.

**Measured** (scratchpad model of the food rule: 20 units a season, each unit to a living snake by foraging weight, the player x2; hawks 10%, their food lost; no food = dies; survivors paired at random, the player taking the best-fed mate, an odd one out has none; a pair's kids = f1/c1 + f2/c2; 1,000-3,000 games):

        rounding of a pair's part-kid   snakes a season (5th-95th)   died out in 30 seasons   loci to one ancestor in 30 seasons   player's first snake's share of the genome
        down                            8.7 (7-10)                    0                        0.78                                 0.25 (fair 0.10)
        at random (1.5 -> 1 or 2)       9.5 (8-11)                    0                        0.72                                 0.23

        units a kid, 0 / 1 / 2 copies   after 15 seasons, from 0.50   games where it rose   fixed   lost
        2 / 2 / 2   (neutral)          0.50 ± 0.41                   0.49                  0.27    0.28
        2 / 1.75 / 1.5                 0.61 ± 0.39                   0.61                  0.34    0.18
        2 / 1.5 / 1                    0.75 ± 0.33                   0.79                  0.43    0.09
        2 / 3 / 4   (the bad one)      0.34 ± 0.43                   0.31                  0.25    0.52

- Food alone holds the population at ~10 with no extinctions; rounding a part-kid at random keeps the mean nearer 10 than rounding down.
- The food rule makes drift strong: a neutral allele from 50% is fixed or lost in 55% of games within 15 seasons (an effective size of about 4 snakes). So **1.5 units a kid for the homozygote is hard to see in one game** (rises in 61% of games against 49% for a neutral one). **1.5 for the heterozygote and 1 for the homozygote** (h 0.5 in units: twice the kids with two copies) rises in 79% and is lost in 9%: visible. The bad allele at 3 / 4 units is lost in 52% against 28%.
- Only the snake's own food counts at its own cost (f1/c1 + f2/c2): a good allele helps the parent that carries it, not its mate.

## Fourth pass (JM, 2026-10-01): unlocks later; food plentiful, hawks hold the number; sprites

- Unlocks: *"by clicking on the pedigree at target points (eg mrca for some locus, original mutant for the allele, generation where allele X went to fixation at locus Y, etc) ... can also challenge the player to hit targets by play (eg keep your allele from going to fixation or something to drive intentional poor play). Im more concerned with getting the game working first, and working out scoring later."*
- *"we should have more food than the snakes need—the hawks should eat a fixed number of snakes (4/14?) to keep the population at roughly the same level. If somehow the hawks eat the only 4 snakes that got resources…Game Over!"*
- JM's sprite sheet: four hawks, four snakes, four salamanders.

**Measured, then built:**
- A truly fixed 4 a season (model, 2,000 runs x 40 seasons): game over in 20-26% at 40 salamanders, over 90% at 36 — four is a bigger share of a smaller population. "Hawks take all above 10": none.
- In the game itself, hawks spread over the season made the headcount swing 10, 20, 10, 20 (twenty snakes share the food, the hawks take ten with half of it). So the hawks come in the first 4 s and the 30 salamanders come out over 16 s: survivors eat nearly all of it, ~FOOD / 2 young a season. Autoplayed 25 seasons x 3: born 9-16 (mostly 12-15), hawks take 0-6 (2-4 usually), their count exact every season, no game over; a season ~20-30 s.
- The computer's snakes first hunted far worse than a player: a greedy scripted player ate 9-13 of 30 and had 6-9 of ~13 young. Now near-even (speed 118 / 116, turn 4.4 / 4.4, wobble 8): the player eats 2-4 against the others' ~3, and has 4-6 young, most of that from choosing the best-fed mate (every snake's catch is shown at winter).

**As built (Stage A):** arena (mouse to steer; the others hunt the nearest salamander); hawks from JM's sprites, each throwing its shadow where its snake is heading and diving (talons), a miss coming back for another snake; salamanders walk (his sprites); snakes drawn in code in his sprites' colours (a sprite cannot bend along a path or carry the allele dots on its flanks); winter den (the fed snakes in rows, the catch over each head; click a mate); pairs have f1/2 + f2/2 young (part-chick at random); three chromosomes of three genes, crossover 0.1 between neighbours, ~1 new allele a generation; ten seasons of history before play (food handed out at random); the player reborn as one of their young; game over below two fed snakes. Pedigree: each snake's two chromosome sets, the player's outlined, lines only on hover (a snake: parents and young; a gene: that copy back to the founders). Buttons: start the season, let it play itself (2x, autopilot), skip 5 generations.

## The game as dictated (first pass; transcript below)

- A square arena; green garter snakes; food is salamanders; hawks swoop across and kill a snake they hit.
- A season: eat as much as you can before winter; at mating season choose a mate; offspring *"as a function of"* food.
- Every snake carries two chromosomes, one from each parent, at random.
- Mutations: a coloured dot at one of several spots on a snake. Colours from far ends of the spectrum, alternating.
- Right of the arena: a generation tracker building the pedigree for each gene; the player's lineage shown.
- Each round the player becomes one of their own offspring at random.
- The other snakes move at random, eat, and are eaten.

## Measured, 2026-10-01 (scratchpad models of the game's population, not the game: diploid snakes, parents drawn by food, the player out-eats the others x2, hawks take 15%, the player reborn as one of their own offspring)

**The player's edge rides on whatever the player carries** (one starting copy in the player, 40,000 games):

        N    player eats   reborn as        P(that allele fixes)   neutral 1/2N   gens to fix (4N)   to loss
        10   x1            own offspring    0.049                  0.050          37 (40)            5.5
        10   x2            own offspring    0.120                  0.050          32 (40)            9.2
        10   x3            own offspring    0.168                  0.050          26 (40)            9.9
        10   x3            a random snake   0.124                  0.050          29 (40)            9.1

**Stage A at playable lengths** (2 chromosomes x 3 loci, crossover 0.1 between neighbours, 1 new allele a generation over all loci, 400 games):

        snakes   generations   loci coalesced in the window   their TMRCA   unlinked loci, different ancestors   alleles per locus   new alleles whose copies' MRCA is younger than the mutator
        8        15            0.35                           11            0.85                                 1.9                 0.61
        8        30            0.80                           17            0.96                                 1.8                 0.68
        8        50            0.96                           21            0.97                                 1.8                 0.74
        12       30            0.52                           21            0.96                                 2.0                 0.67
        12       50            0.84                           28            0.98                                 1.9                 0.73

- Coalescence, "MRCA ≠ the original mutator" and different ancestors at different loci all emerge on their own at 8 snakes and ~30 generations. The TMRCA sits below 4N because the hawks and the player shrink the effective population, as JM said.
- One new allele a generation over nine loci keeps about two alleles a locus: JM's "1-3".

**Stage B** (3 chromosomes x 3 loci: [good, neutral, neutral], [bad, neutral, neutral], three neutral; 8 snakes, h 0.5, 2,000 games):

- Starting at 50%, over 30 generations: good allele (s +0.5) 0.50 → 0.80, fixed 57% (neutral: 0.42, 24%); bad allele (s −0.5) → 0.02, lost 96% (neutral: 51%).
- **Linkage does not show as lost diversity** at this size (beside the good locus 0.142, unlinked 0.148): drift already strips diversity everywhere, and an allele at 50% sits on many backgrounds.
- **It shows in the dots when the good allele starts as one new copy** (20 generations, games where it passes 75%): the neutral allele beside it ends at 0.85 (crossover 0.02 per gap) or 0.49 (0.1); two gaps away 0.75 / 0.36; on the same snake's other chromosome 0.15 (start 0.06). Even with s = 0, an allele that happens to drift up carries its neighbours just the same: linkage is not about selection.
- But one new good copy at s 0.5 passes 75% in only 18% of games (s 1: 34%).

## To settle with JM

- **Snakes per generation:** set by the food (JM, third pass): 20 units, 2 a kid → ~10 (measured 9.5, 8-11).
- **Food rules to fix:** a part-kid rounded at random (or carried); what an odd snake out does; whether a hawk's kill loses the food it ate; the computer's snakes must forage (random walkers eat little and leave the player most of the food).
- **Stage B's costs:** JM's 1.5 units a kid as the heterozygote's, 1 as the homozygote's (measured visible); the bad allele 3 / 4.
- **Pedigree hover:** hover a snake for lines to its parents and kids; hover one dot on a chromosome to trace that locus back to its common ancestor (the coalescence plot). Player highlighted each generation; chromosomes drawn for every snake.
- **Length:** ~30 generations for coalescence to show. Play them all (short seasons), play some and fast-forward the rest (the player's snake on autopilot), or pre-simulate a past for the tracker.
- **Chromosomes:** loci on different chromosomes (for different ancestors) and loci side by side with crossovers (for linkage in B). Proposed above: three chromosomes of three loci.
- **B's good allele:** start it at 50% (selection plain to see; linkage hidden), or as a few new copies / restarted when lost as 14 B does (linkage visible in the dots).
- **The questions:** lessons gate on solving, not on multiple choice (memory: gate on solving, 2026-09-01). "Is the player's advantage heritable?" can be measured off the game: the player's line out-eats and out-breeds the rest generation after generation (a parent–offspring resemblance), while no allele does anything (A) — JM's meta point. JM's call how to ask.
- **Colours:** dots by allele id as 14 D colours alleles (golden-angle hues), not a new palette (CLAUDE.md §5).
- **4N and 4Nμ:** print only beside readings the game is long enough to reach; measure first.

## Sources (not constraints)

- `app/interactives/descent.html`: one pedigree, coalescence by position (`coalesceAt`); *"Identity by descent and coalescence are the same fact read in two directions"*.
- 10 (drift as rolls), 11 (heterozygosity, 4Ne), 14 B/C (hitchhiking, haplotype rows), 14 E (4Nμ; ~4N generations for a silent change to take over), lesson 8 (a confound: skill rides with the player's alleles).

## Transcript (JM, 2026-10-01, dictated; speech-to-text left as is: "illegal(s)" / "wheel" = allele(s), "Jeans" = genes, "chrome is open" = chromosome, "coalitions" = coalescence, "saladanders" = salamanders, "4NU" = 4Nμ; "Your header is I guess" not read)

> Okay, for coalescence. I'm imagining a very silly game. There is a square that is the game area. There is a series of snakes. That are all green. You slither around, try and get food. And then choose a mate. All right, some chance, they're hawks. Swooping across the screen, and if they hit you, you die, the goal is to get food before winter. Once you do as much food as you can before mating season. And that mating season, you choose a mate. And you produce some number of offspring as a function of, uh, How much food you got? Food should be a little salamanters. There will be garter snakes eating saladanders. The trick here is that. The snakes are color coded. With mutations, they get a little dot on them. At one of several spots. Mutations are random and rare, however, you begin the game with one mutation. Your header is I guess. Jeans are calculated. I seen on the screen. There's a chance of mutation each round, and to the right of the game, is a generation tracker. Where it starts at some generation in the past, say -10, and goes forward in time. And it essentially builds a pedigree. For each gene. So each snake inherits randomly, one chrome is open to each parent. And the focal lineage, the player lineage is shown. Each round, you are randomly given to one of the one of the offspring, your lineage, and there's some chance of a new mutation occurring. Uh, at any site, including the one you are focusing on. Thinking the mutations could be indicated by colored circles. So we would have. Now. Yellow, orange, blue, green. As many tastes we have colors. And so we could choose from far ends of the spectrum. Alternating to keep them distinct. It is at the end of the game. You would have played it. The allele has no effect on fitness because fitness is determined by the player's skill. Not by the colorful dots on their snake. But you get a pedigree. Four. The snakes on the right. We can track how a given a wheel move through time. We use that as the basic framework. Understanding coalitions. and the time to most recent common ancestor. Because as long as the population sizes are up really small, then we can keep that nice and simple. I'm not sure. Feasibility. I don't know what we're talking about. 10 snakes per generation, or 50 snakes per generation. as viable. But as many snakes, as keeps the simulation running. Thinking that the allel has no effect on. Anything. It's just pure drift. Causing the frequency to move up. They're obviously fitness differences between snakes. They're unassociated with the illegals that are tracking since they just play your skill. All the other snakes randomly move to the environment at the same time. Gobbling up resources that the player could get, and getting gobbled up by hawks. That the player is avoiding, got the resources, should be small salamanders. The end of this. Be to calculate how fast. The illegal that you started with goes to fixation or extinction. And the total genetic diversity at the end. We're going to link these to 4N and 4NU. And the later simulations, which will be more standard, perhaps, but the point is to teach them nothing about genetics per se. He says how to read a coalescence plot. As they move through time.

## Items

| # | Stage | What | Status |
|---|-------|------|--------|
| 1 | — | settle snakes, length, chromosomes, B's starting good allele, the questions with JM | todo |
| 2 | — | game prototype: arena, snakes, hawks, salamanders, seasons | done (Stage A) |
| 3 | A | genealogy panel: lineages traced back per locus (done, on hover); MRCA and mutator marked (todo, with the targets) | doing |
| 4 | B | the s/h diagram; the good and bad loci | todo |
| 5 | — | `check_lesson15_numbers.js`: neutral alleles neutral apart from the player's line; coalescence and MRCA as the panel draws them; the hawks' count exact; no oscillation | todo |
| 6 | A | targets: click the pedigree at the MRCA of a locus, an allele's first mutant, the generation an allele fixed; play challenges | todo (JM: scoring later) |

## Do not

- Say a tracked allele is neutral while it rides in the player's body without saying why it spreads (measured above).
- Expect lost diversity to show linkage with 8 snakes: show it in the dots beside a new good allele.
