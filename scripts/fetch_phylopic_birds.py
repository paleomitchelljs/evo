"""Download public-domain (CC0 / PDM) PhyloPic silhouettes for the bird morphospace figure.

Writes export/base/phylopic/<slug>.png and credits.json (contributor, licence, image id).
Tries the species name first, then each fallback name in turn; CC BY only if no
public-domain image exists for any of the names (attribution then goes on the figure).
"""
import json, subprocess, urllib.parse
from pathlib import Path

OUT = Path(__file__).resolve().parent.parent / "export/base/phylopic"
API = "https://api.phylopic.org"
OK = ("publicdomain/zero", "publicdomain/mark")
BY = ("licenses/by/",)   # last resort; never -nc or -sa
WANT = {
    "ostrich": ["Struthio camelus", "Struthio"],
    "emu": ["Dromaius novaehollandiae", "Dromaius"],
    "albatross": ["Diomedea exulans", "Diomedea"],
    "frigatebird": ["Fregata magnificens", "Fregata"],
    "hummingbird": ["Mellisuga helenae", "Mellisuga", "Trochilidae"],
    "swift": ["Apus apus", "Apus", "Apodidae"],
    "stilt": ["Himantopus himantopus", "Himantopus", "Recurvirostridae"],
    "flamingo": ["Phoenicopterus roseus", "Phoenicopterus", "Phoenicopteridae"],
    "penguin": ["Aptenodytes forsteri", "Aptenodytes", "Spheniscidae"],
}

def get(url):
    return subprocess.run(["curl", "-sfL", "-A", "course-figure-script", url],
                          check=True, capture_output=True).stdout

build = json.loads(subprocess.run(["curl", "-s", f"{API}/images?build=x"], capture_output=True).stdout)["build"]
OUT.mkdir(parents=True, exist_ok=True)
credits = {}
for slug, names in WANT.items():
  for licences in (OK, BY):
    if slug in credits: break
    for name in names:
        q = urllib.parse.quote(name.lower())
        d = json.loads(get(f"{API}/images?build={build}&filter_name={q}&embed_items=true&page=0"))
        items = d.get("_embedded", {}).get("items", [])
        pick = next((it for it in items if any(k in it["_links"]["license"]["href"] for k in licences)), None)
        if pick:
            L = pick["_links"]
            png = max(L["rasterFiles"], key=lambda f: int(f["sizes"].split("x")[0]) if int(f["sizes"].split("x")[0]) <= 1024 else 0)
            (OUT / f"{slug}.png").write_bytes(get(png["href"]))
            credits[slug] = {"taxon": L["specificNode"]["title"], "searched": name,
                             "contributor": pick.get("attribution") or L["contributor"]["title"],
                             "license": L["license"]["href"], "image": L["self"]["href"]}
            print(slug, "->", credits[slug]["taxon"], "|", credits[slug]["contributor"])
            break
  if slug not in credits: print(slug, "NONE")
(OUT / "credits.json").write_text(json.dumps(credits, indent=1))
