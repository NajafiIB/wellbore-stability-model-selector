# Wellbore Stability Model Selector

This repository contains a public, no-login, static companion tool for the review article:

**An Open Source Wellbore Stability Modeling Framework for Geothermal Wells: Linking Failure Mechanisms, Evidence, and Lifecycle Decisions**

Authors: **Iman Najafi** (World Business Council, Warsaw) and **Dariusz Knez** (AGH University of Krakow). The article title and authors appear on the website's research credit panel.

The tool implements the **Geothermal Wellbore Stability Lifecycle Model-Selection Framework** across drilling, injection/operation and maintenance/workover. Users select lifecycle stage, formation type, well geometry, dominant failure mechanism, data availability, uncertainty level, validation evidence, and integrity consequence. The tool returns recommended model families, validation needs, warnings, operational decisions supported, and source-linked related articles from the public metadata corpus.

## What the tool does

- Recommends model families, not software packages.
- Shows required, recommended, conditional, and support-only modelling layers.
- Links recommendations to validation evidence.
- Lists related articles with DOI links.
- Exports a JSON result for documentation or supplementary workflows.
- Runs entirely in the browser with no database, no backend, and no login.

The analytical corpus is defined by Supplementary Material S1. The website literature catalogue supports topic navigation and does not define manuscript inclusion decisions or counts; its coverage is not identical to S1. Audit-only catalogue records are excluded from related-paper ranking. See the [full methodology](docs/methodology.md).

## Methodology and evidence

Read the [public methodology page](https://najafiib.github.io/wellbore-stability-model-selector/methodology.html) or its [Markdown source](docs/methodology.md). It covers source identification, eligibility, duplicate handling, evidence extraction and claim appraisal, rule interpretation, uncertainty, external case evaluation and scope of inference.

The checked-in public page is generated from that Markdown source with `python scripts/build_methodology.py`. Run `python scripts/build_methodology.py --check` to verify parity. The page is static and requires no browser-side Markdown rendering.

## What the tool does not do

- It does not replace site-specific geomechanical design.
- It does not calculate a final mud-weight window.
- It does not host or redistribute copyrighted PDFs.
- It does not claim that one model family is universally best.
- It flags long-term creep as outside the categorical rule set; lifetime decisions require a site-specific time-dependent analysis and observations.
- A high uncertainty setting alone does not establish a narrow mud-weight window.

## Local use

From this folder:

```bash
npm test
npm run serve
```

Then open:

```text
http://localhost:8088
```

If you do not want to use npm, run:

```bash
node tests/decision-engine.test.mjs
python -m http.server 8088
```

## GitHub Pages deployment

This repository is published from the `main` branch and `/root` through GitHub Pages.

No Supabase, database, login, or server is needed.

Expected public URL after deployment:

```text
https://najafiib.github.io/wellbore-stability-model-selector/
```

## Public data policy

The public data files `data/papers.json` and `data/geothermal-papers.json` contain bibliographic and coding metadata only:

- title;
- authors;
- year;
- venue;
- DOI;
- lifecycle stage;
- technical theme;
- model family;
- failure criterion;
- formation/well type coding;
- validation coding;
- relevance notes.

It does **not** include copyrighted paper text or PDFs.

The `build:data` command accepts the WBS source schema only. The complete website catalogue comprises both `data/papers.json` and `data/geothermal-papers.json`; this command is not an integrated-corpus builder.

## Citation

If you use the tool, cite the associated review article and this repository. The file `CITATION.cff` provides citation metadata that GitHub can display automatically.

## Software and evaluation

Version 0.1.6 implements the evaluated v0.1.5 categorical assignments and reports screening-guidance status, a null numerical operating limit and condition-specific required observations. Three geothermal demonstrations and two external retrospective cases examine rule interpretation and applicability. Outcome-informed input encoding makes the external evaluation unblinded; predictive accuracy and operational benefit are not established. The software test suite verifies execution across 210 category-regression scenarios.
