"""Dependency-free renderer for this document's headings, lists and pipe tables."""
from pathlib import Path
import argparse
import html
import re

ROOT = Path(__file__).resolve().parents[1]

def inline(text):
    tokens = []
    def protect(fragment):
        tokens.append(fragment)
        return f'\x00{len(tokens)-1}\x00'
    text = re.sub(r'`([^`]+)`', lambda m: protect('<code>' + html.escape(m[1]) + '</code>'), text)
    text = re.sub(r'\[([^\]]+)\]\((https://[^\s)]+)\)', lambda m: protect('<a href="' + html.escape(m[2], quote=True) + '">' + html.escape(m[1]) + '</a>'), text)
    text = re.sub(r'\*\*([^*]+)\*\*', r'<strong>\1</strong>', html.escape(text))
    return re.sub(r'\x00(\d+)\x00', lambda m: tokens[int(m[1])], text)

def render(source):
    blocks, nav = [], []
    for block in source.strip().split('\n\n'):
        lines = block.splitlines()
        if block.startswith('# '):
            continue
        if block.startswith('## '):
            title = block[3:]
            slug = re.sub(r'[^a-z0-9]+', '-', title.lower()).strip('-')
            nav.append(f'<a href="#{slug}">{html.escape(title)}</a>')
            blocks.append(f'<h2 id="{slug}">{html.escape(title)}</h2>')
        elif block.startswith('| '):
            rows = [[inline(c.strip()) for c in line.strip('|').split('|')] for line in lines]
            head = '<tr>' + ''.join(f'<th scope="col">{c}</th>' for c in rows[0]) + '</tr>'
            body = ''.join('<tr>' + ''.join(f'<td>{c}</td>' for c in row) + '</tr>' for row in rows[2:])
            blocks.append('<div class="method-table" role="region" aria-label="Methodology table" tabindex="0"><table><thead>' + head + '</thead><tbody>' + body + '</tbody></table></div>')
        elif block.startswith('- '):
            blocks.append('<ul>' + ''.join('<li>' + inline(line[2:]) + '</li>' for line in lines) + '</ul>')
        else:
            blocks.append('<p>' + inline(' '.join(lines)) + '</p>')
    content, navigation = '\n'.join(blocks), '\n'.join(nav)
    return f'''<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Methodology &amp; Evidence | Wellbore Studio</title>
<meta name="description" content="Review methods, existing evidence appraisals, selection rules, uncertainty and retrospective geothermal case evaluation.">
<link rel="stylesheet" href="./styles.css"><link rel="stylesheet" href="./methodology.css">
</head><body>
<a class="skip-link" href="#methodology-content">Skip to methodology</a>
<header class="site-header">
<div class="brand-bar">
<a class="brand-lockup method-brand" href="./index.html" aria-label="Wellbore Studio selector"><span class="brand-mark" aria-hidden="true">W<span>·</span></span><span><span class="brand-name">Wellbore Studio</span><span class="brand-subtitle">METHODS &amp; EVIDENCE</span></span></a>
<nav class="header-links" aria-label="Main navigation"><a href="./index.html">Open selector ↗</a><a href="https://github.com/NajafiIB/wellbore-stability-model-selector/blob/main/docs/methodology.md">GitHub source ↗</a></nav>
</div>
<div class="header-content method-hero"><p class="eyebrow">FROM LITERATURE TO ENGINEERING DECISIONS</p><h1>Review methodology<br><span>&amp; model-selection evidence</span></h1><p class="lede">How sources are selected and assessed, how the framework works, and what its evaluations establish.</p><div class="method-badges"><span>Structured critical review</span><span>Software · v0.2.0</span><span>Rules evaluated · v0.2.0</span></div></div>
</header>
<div class="method-layout"><aside class="method-toc"><nav aria-label="On this page"><p class="section-kicker">ON THIS PAGE</p>{navigation}</nav></aside>
<main id="methodology-content" class="method-content" tabindex="-1"><div class="method-notice"><strong>Conditions → mechanisms → models → decisions → observations</strong><p>A framework for selecting modelling approaches across the geothermal well lifecycle, supported by claim-specific evidence appraisal and retrospective case evaluation.</p></div>{content}</main></div>
<footer><p><strong>Wellbore Studio</strong> · Iman Najafi and Dariusz Knez · <a href="./index.html">Return to selector</a> · <a href="https://github.com/NajafiIB/wellbore-stability-model-selector">Repository</a></p></footer>
</body></html>
'''

if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--check', action='store_true')
    args = parser.parse_args()
    generated = render((ROOT / 'docs/methodology.md').read_text(encoding='utf-8'))
    target = ROOT / 'methodology.html'
    if args.check:
        if not target.exists() or target.read_text(encoding='utf-8') != generated:
            raise SystemExit('methodology.html differs from Markdown; regenerate it.')
        print('Methodology source/page parity verified.')
    else:
        target.write_text(generated, encoding='utf-8', newline='\n')
        print('Generated methodology.html')
