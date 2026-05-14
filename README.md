# evo

Interactive simulation lessons for BIO 202 (Evolution) at Coe College.

Each lesson is a single self-contained HTML file. No build step, no framework, no package manager. Open `index.html` in a browser and everything works.

## Running locally

Clone the repo and open `index.html` directly, or serve the folder with anything that speaks HTTP:

```sh
python3 -m http.server 8000
# then visit http://localhost:8000
```

A plain static server is enough. Nothing here needs Node, Python, or R at runtime.

## Deploying

The site is published via GitHub Pages from the `main` branch at the repository root. Pushing to `main` updates the live site. The `.nojekyll` file in the root disables Jekyll so that paths starting with an underscore are served as-is.

## Layout

```
index.html          landing page with cards for each lesson and scaffold
lessons/
  lesson1.html      adding up coin flips until a bell appears
  lesson2.html      resampling to ask if new data still belongs
  lesson3.html      subtracting the line and reading what's left
  lesson4.html      finding the cloud of lines that all fit the data
  lesson5.html      shuffling the predictor to see what chance can do
  lesson6.html      watching the same biology give four different verdicts
  lesson7.html      tracing how much of a parent ends up in their child
scaffolds/          single-concept drill exercises (S01–S20)
data/clean/         cleaned CSV + JSON datasets the lessons load
data/raw/           original source data
scripts/            Python cleaners that produce data/clean/
lib/                shared JS (score, quiz) and CSS
oldcode/            historical R scripts; reference only
prototype/          early single-file prototypes
```

New lessons go into `lessons/lessonN.html` and get linked from `index.html`. Filenames match displayed lesson numbers.

See **`PROJECT_PLAN.md`** for the full ~30-lesson plan organized into five units, ending with the "What is an Individual?" capstone.

## Pedagogy

Three rules shape every lesson. They are not optional.

1. **Prediction before interactivity.** Controls are locked until the student commits to a prediction. Students predict, then test. They do not tinker first and rationalize after.
2. **Code is always visible.** Moving a slider highlights the corresponding line of R. A slider is an editable named variable, not a spell.
3. **Every assignment ends in real code.** The GUI is scaffolding. The final step is a `.R` modification the simulator cannot expose.

Each lesson also follows the same four-part rhythm: simulate a named null, layer in the novel feature, state the test that distinguishes the two, then bring in empirical data that pushes back on the model.

## License

Lessons are licensed for classroom use. Other uses, ask.
