# evo

Interactive homework activities for BIO 202 (Evolution) at Coe College.

These are practice instruments, not a course. The lecture sequence introduces
the material; each activity here drills one concept — predict, then manipulate,
then confront data that pushes back. Every activity is a single self-contained
HTML file. No build step, no framework, no package manager. Open `index.html`
in a browser and everything works.

## Running locally

Clone the repo and open `index.html` directly, or serve the folder with anything
that speaks HTTP:

```sh
python3 -m http.server 8000
# then visit http://localhost:8000
```

A plain static server is enough. Nothing here needs Node, Python, or R at
runtime.

## Deploying

Published via GitHub Pages from the `main` branch at the repository root.
Pushing to `main` updates the live site. The `.nojekyll` file disables Jekyll
so paths starting with an underscore are served as-is.

## Layout

```
index.html               landing page (repo root, the GitHub Pages entry point)
app/
  lessons/               one self-contained HTML file per activity (lesson1..34)
  scaffolds/             single-concept drills (s01..s20)
  assets/                shared JS (score, quiz, dag) and CSS the pages load
data/
  clean/                 cleaned CSV + JSON datasets the activities load
  raw/                   original source data
scripts/                 Python cleaners that produce data/clean/
instructor/              browser-only grading tools (verify_code.html, aggregate.html)
docs/
  ideas/                 conceptual map + activity proposals
  reviews/               pedagogy review passes (ADVERSARIAL, STEELMAN, HOMEWORK_REVIEW)
```

The landing page stays at the repo root so GitHub Pages serves it as the entry
point; everything it links to lives under `app/`. From `app/lessons/` (and
`app/scaffolds/`), activities load assets as `../assets/…`, data as
`../../data/clean/…`, and link home as `../../index.html`.

See **`PROJECT_PLAN.md`** for the concept index, the design commitments, and how
new activities are added. The concepts being reinforced are drawn from
`evolution_course_conceptual_map.md`.

## Pedagogy

Three rules shape every activity. They are not optional.

1. **Prediction before interactivity.** Controls are locked until the student
   commits to a prediction. They predict, then test — they do not tinker first
   and rationalize after.
2. **Code is always visible.** Moving a slider highlights the corresponding line
   of R. A slider is an editable named variable, not a spell.
3. **Show, don't tell.** The aim is intuition, not vocabulary. A student should
   be able to look at a distribution and a slider's effect and judge whether the
   fit improved, without being handed the name of the distribution or the
   parameter.

Where it fits, an activity repeats one concept across several datasets, leads
with data the student already understands before the biological case, and offers
a "break it" mode that lets the model fail. Some activities end in a small `.R`
edit; many don't.

## License

Activities are licensed for classroom use. Other uses, ask.
