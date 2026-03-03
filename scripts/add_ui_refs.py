#!/usr/bin/env python3
"""Scan HTML files and inject stylesheet and injection script references if missing."""
import os
from glob import glob

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

html_files = [
    p for p in glob(os.path.join(ROOT, '**', '*.html'), recursive=True)
    if os.path.isfile(p)
]

head_link = '<link rel="stylesheet" href="/assets/style.css">'
script_tag = '<script src="/scripts/inject_ui.js"></script>'

for path in html_files:
    with open(path, 'r', encoding='utf-8') as f:
        txt = f.read()
    changed = False
    if head_link not in txt:
        if '</head>' in txt:
            txt = txt.replace('</head>', f'    {head_link}\n</head>')
            changed = True
    if script_tag not in txt:
        if '</body>' in txt:
            txt = txt.replace('</body>', f'    {script_tag}\n</body>')
            changed = True
    if changed:
        with open(path, 'w', encoding='utf-8') as f:
            f.write(txt)
        print('Updated', os.path.relpath(path, ROOT))
    else:
        print('Skipped', os.path.relpath(path, ROOT))

print('\nDone')
