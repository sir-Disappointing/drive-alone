"""Bouwt borden/*.svg en signs-data.js uit twee open bronnen.

Gebruik:
    python3 tools/build-signs.py <traffic-signs-repo> <ribba-theorie-mcp-package>

- Afbeeldingen: https://github.com/skifahrer/traffic-signs (map signs/*/*/nl/),
  afkomstig van Wikimedia Commons. Per bord staan auteur en licentie in de metadata.
- Namen: de officiële omschrijvingen uit bijlage 1 van het RVV 1990, zoals verzameld
  in het npm-pakket @ribba/theorie-mcp (data/verkeersborden.json). Wetteksten vallen
  niet onder het auteursrecht (Auteurswet art. 11).

Het script schrijft alleen bestanden in deze repository: borden/ en signs-data.js.
"""

import glob
import json
import os
import re
import shutil
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Codes uit bijlage 1 waarvoor de afbeelding onder een andere code staat.
IMAGE_ALIASES = {"L3": "L3a", "L19": "L19 (rechts)"}


def main(signs_repo, ribba_pkg):
    names = json.load(open(os.path.join(ribba_pkg, "data", "verkeersborden.json"), encoding="utf-8"))

    images = {}
    for meta_path in glob.glob(os.path.join(signs_repo, "signs", "*", "*", "nl", "*-nl.json")):
        meta = json.load(open(meta_path, encoding="utf-8"))
        images[meta["code"]] = (os.path.join(os.path.dirname(meta_path), meta["image"]["file"]), meta["image"])

    out_dir = os.path.join(ROOT, "borden")
    os.makedirs(out_dir, exist_ok=True)

    signs, missing = [], []
    for code, name in names.items():
        found = images.get(IMAGE_ALIASES.get(code, code))
        if not found:
            missing.append(code)
            continue
        src, image = found
        svg = open(src, encoding="utf-8").read()
        if re.search(r"<script|javascript:|<foreignObject|\son\w+=", svg, re.I):
            raise SystemExit(f"{code}: SVG bevat scriptachtige inhoud, niet overgenomen")
        filename = re.sub(r"[^A-Za-z0-9_-]", "_", code) + ".svg"
        shutil.copyfile(src, os.path.join(out_dir, filename))

        license_name = image.get("license", "")
        entry = {"code": code, "name": name.strip(), "file": "borden/" + filename}
        # Publiek domein en CC0 hebben geen naamsvermelding nodig; CC BY wel.
        if license_name not in ("Public domain", "CC0"):
            entry["credit"] = {"author": image.get("author", ""), "license": license_name, "source": image.get("source", "")}
        signs.append(entry)

    def sort_key(s):
        m = re.match(r"([A-Z]+)(\d+)(.*)", s["code"])
        return (m.group(1), int(m.group(2)), m.group(3)) if m else (s["code"], 0, "")

    signs.sort(key=sort_key)
    with open(os.path.join(ROOT, "signs-data.js"), "w", encoding="utf-8") as f:
        f.write("// Gegenereerd door tools/build-signs.py. Niet met de hand aanpassen.\n")
        f.write("// Namen: RVV 1990 bijlage 1. Afbeeldingen: Wikimedia Commons via skifahrer/traffic-signs.\n")
        f.write("const SIGN_DATA = ")
        json.dump(signs, f, ensure_ascii=False, indent=1)
        f.write(";\n")

    print(f"{len(signs)} borden geschreven, zonder afbeelding overgeslagen: {', '.join(missing) or 'geen'}")


if __name__ == "__main__":
    if len(sys.argv) != 3:
        raise SystemExit(__doc__)
    main(sys.argv[1], sys.argv[2])
