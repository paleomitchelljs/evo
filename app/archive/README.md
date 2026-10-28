# Archive — unreviewed first drafts

Lessons 14–34 as they stood on 2026-09-24, moved here out of `app/lessons/`.

JM, 2026-09-24: *"I genuinely don't care about anything beyond what we've
reviewed except in the most general sense of it as an arc. They don't represent
real plans or anything beyond the first set of first drafts ... archive them all
somewhere and only use them as references/sources when needed."*

- **Sources only.** Mine them for data, quotes, code and ideas. They are not
  precedent for style, structure or pedagogy, and nothing here is a plan.
- Not linked from `index.html`, not in `LOCKS.txt`, not scanned by
  `scripts/check_lessons.py`. They still open in a browser: `../assets/` and
  the data paths resolve from here as they did from `app/lessons/`.
- Their numbers are the old ones. A lesson rebuilt from one of them takes
  whatever slot the live sequence gives it, and is built fresh in
  `app/lessons/`.
- The selection lessons are 12 (genetics), 13 (regression) and 14 (birth–death
  and DAGs); frequency dependence is likely 15. See `docs/overhauls/`.

## Later additions

- `lesson14_2026-09-30.html` — lesson 14 as births, deaths and crowding (A-C, r and K, `version: 3`), archived when JM made 14 the genetics-of-selection lesson (2026-09-30). r and K are built nowhere else; JM: *"r and K don't matter here."* Its checks are `scripts/check_lesson14_numbers.js` at `77e4149`.

- `lesson13_2026-09-29.html` — lesson 13 as it stood at `287e3e0` (A-G, `version: 11`), kept whole and runnable when C (covariance: a fitness line through a dot cloud, signed rectangles, group colours), D (what responds: S against R point by point, one line per population) and E (the regression is the diagram: least-squares arrows, the leftover plot) were cut on 2026-09-29. JM: *"good but too arcane and superseded by the new parts A and B ... I like the visuals and features. I don't know if they can be reused or repurposed, but they seem archivable."* Its checks are `scripts/check_lesson13_numbers.js` at the same commit. On 2026-09-30 JM archived the mediator/confounder and collider stages too (they are F and G in this file).

- `lesson15_with_D_2026-10-09.html` — lesson 15 as it stood at `20b9c9b` (A-D, `version: 5`, scaffold 22), kept whole and runnable when D (one allele's change split among snakes and among the copies inside each snake: the hierarchical Price card, five targets, and "your island in B, winter by winter") was cut on 2026-10-09 and the jump moved from C into a new D. JM: *"we archive the current stage D and lock it away. And deal with it later."* Its checks are `scripts/check_lesson15_numbers.js` at the same commit.

- `lesson16_with_BCD_2026-10-11.html` — lesson 16 as it stood at `305611b` (A-D, `version: 3`, scaffold 19), kept whole and runnable when B (the bench: copy vs meiosis with placed crossovers; twenty young each; two populations and the ratchet, three rounds on N / U / s; one population with sexual and asexual females, three rounds on how often and how far the best value moves), C (chromosomes snapping at repeats: a watch menu of eight events, then deletions, duplications, inversions by hand, five targets) and D (an inversion carrying a helpful allele, bead strings, unscored) were replaced on 2026-10-11 by a copy-or-mate game and two stages built off it. JM: *"The mutations are fixed and don't change, and it doesn't really get to the idea of muller's ratchet. Parts C and D also don't build off from it."* Its checks are `scripts/check_lesson16_numbers.js` at the same commit.
- `lesson16_with_D_2026-10-12.html` — lesson 16 as it stood at `8c64baf` (A-D, `version: 5`, scaffold 15), kept whole and runnable when B became hermaphrodites, C lost its young-by-trait / harmful-changes plot (the over-time plot took its place under the bead strings), and D (an inversion holding "a team" of alleles; two targets: the team kept at 40, harmful changes piling up inside a single-copy inversion at 100) was rebuilt around how common the inversion gets. JM: *"I'm wanting this to be an avenue that clarifies/shows how inversions lock recombination until they're common"*. Its checks are `scripts/check_lesson16_numbers.js` at the same commit.
- `lesson19_v2_2026-10-17.html` — lesson 19 as it stood at `e137ba6` (A-C, `version: 2`, scaffold 9): A apart then back in contact as four drawn rounds (one bit each), B two pinned incompatible pairs and a draggable inversion on lesson 17's start, C a one-allele choosy allele where the two meet. Replaced on 2026-10-20 by JM's redraft brief for 19-21 (ponds and floods; one pair; a trait; a choosy allele placed on the chromosome). Its checks are `scripts/check_lesson19_numbers.js` at `e137ba6`.
- `lesson20_v2_2026-10-26.html` — lesson 20 as it stood at `03cf171` (A the one-split pedigree, B the nine steps on a chance-splitting tree with hybrids, size and the Anolis box; `version: 2`, scaffold 14), kept whole and runnable when JM's review of 2026-10-27 rebuilt it in four stages (A the pedigree with mutations and four sliders, B incompatibilities and a choosy allele, C a tree the student splits by clicking with gene trees laid over it, D traits that change splitting and loss). Its checks are `scripts/check_lesson20_numbers.js` at the same commit.
