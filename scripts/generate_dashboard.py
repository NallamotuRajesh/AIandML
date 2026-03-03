#!/usr/bin/env python3
"""Generate central dashboard HTML for AIandML phases.

Usage:
    python scripts/generate_dashboard.py > index.html

Or run in-place; it will overwrite index.html in repo root.
"""
import glob
import os
import re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def parse_phase(phase_dir: str):
    """Return title and short description extracted from LEARNING_GUIDE.md."""
    guide_path = os.path.join(ROOT, phase_dir, "LEARNING_GUIDE.md")
    title = phase_dir
    desc = ""
    if not os.path.exists(guide_path):
        return title, desc
    with open(guide_path, "r", encoding="utf-8") as f:
        lines = f.readlines()
    # first non-empty line starting with '#' is title
    for line in lines:
        if line.strip().startswith("#"):
            title = line.lstrip("#").strip()
            break
    # look for a short descriptive line (duration/level or first paragraph)
    for line in lines[1:20]:
        if line.strip() and not line.strip().startswith("---"):
            desc = line.strip()
            # stop if it's metadata like **Duration:** etc.
            break
    # strip Markdown formatting from desc (basic)
    desc = re.sub(r"\*\*(.*?)\*\*", r"\1", desc)
    return title, desc


def build_html(entries):
    header = """<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>AI &amp; Machine Learning Mastery Roadmap</title>
<style>
body{font-family:Arial, sans-serif;margin:40px;}
h1{color:#2c3e50;}
.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:20px;}
.card{border:1px solid #ccc;padding:20px;border-radius:8px;box-shadow:2px 2px 8px rgba(0,0,0,0.1);}
.card h2{margin-top:0;font-size:1.25em;}
.card p{font-size:0.9em;color:#555;}
.card a{display:inline-block;margin:4px 8px 0 0;color:#2980b9;text-decoration:none;}
.card a:hover{text-decoration:underline;}
</style>
</head>
<body>
<h1>AI &amp; Machine Learning Mastery Roadmap</h1>
<p>Click a phase card below to explore course material, the learning guide, or the capstone project.</p>
<div class="grid">
"""
    footer = """
</div>
<p>Generated with <code>scripts/generate_dashboard.py</code>.</p>
</body>
</html>
"""
    cards = []
    for entry in entries:
        d = entry['dir']
        title = entry['title']
        desc = entry['desc']
        course = os.path.join(d, "course/index.html")
        guide = os.path.join(d, "LEARNING_GUIDE.md")
        capstone = ''
        # find capstone subdir
        for sub in glob.glob(os.path.join(ROOT, d, "Capstone_*")):
            if os.path.isdir(sub):
                capstone = os.path.join(d, os.path.basename(sub), "PROJECT.md")
                break
        card = f"""<div class="card">
  <h2>{title}</h2>
  <p>{desc}</p>
  <a href="{course}">Course Hub</a>
  <a href="{guide}">Learning Guide</a>"""
        if capstone:
            card += f"\n  <a href=\"{capstone}\">Capstone</a>"
        card += "\n</div>\n"
        cards.append(card)
    return header + "".join(cards) + footer


def main():
    # only include phase directories that contain a learning guide
    phases = []
    for p in sorted(os.listdir(ROOT)):
        path = os.path.join(ROOT, p)
        if p.startswith("Phase") and os.path.isdir(path):
            guide = os.path.join(path, "LEARNING_GUIDE.md")
            if os.path.exists(guide):
                phases.append(p)
    entries = []
    for p in phases:
        title,desc = parse_phase(p)
        entries.append({"dir":p, "title":title, "desc":desc})
    html = build_html(entries)
    out_path = os.path.join(ROOT, "index.html")
    with open(out_path, "w", encoding="utf-8") as f:
        f.write(html)
    print(f"Dashboard written to {out_path}")


if __name__ == "__main__":
    main()
