# Wellbore Stability Model Selector

This repository contains a public, no-login, static companion tool for the review article:

**Wellbore Stability Modelling for Subsurface Energy Wells: An Evidence-Mapped Review and Drilling-Lifecycle Model-Selection Framework**

Authors: **Iman Najafi and Dariusz Knez** (AGH University of Krakow). The article title and authors appear on the website's research credit panel.

The tool implements the **Condition-Based Drilling Lifecycle Model-Selection Framework** across drilling, injection/operation and maintenance/workover. Users select lifecycle stage, formation type, well geometry, dominant failure mechanism, data availability, uncertainty level, validation evidence, and integrity consequence. The tool returns recommended model families, validation needs, warnings, operational decisions supported, and source-linked related articles from the public metadata corpus.

## What the tool does

- Recommends model families, not software packages.
- Shows required, recommended, conditional, and support-only modelling layers.
- Links recommendations to validation evidence.
- Lists related articles with DOI links.
- Exports a JSON result for documentation or supplementary workflows.
- Runs entirely in the browser with no database, no backend, and no login.

The original public metadata file contains all 195 screened records for auditability. Recommendations use only the 190 records coded Core or Useful; three Background and two Exclude records are not ranked. A separate 18-paper geothermal extension covers drilling, completion, injection/operation, and maintenance/workover. It is ranked as a targeted source set and does not change the original review counts.

## What the tool does not do

- It does not replace site-specific geomechanical design.
- It does not calculate a final mud-weight window.
- It does not host or redistribute copyrighted PDFs.
- It does not claim that one model family is universally best.

## Local use

From this folder:

```bash
npm run build:data
npm test
npm run serve
```

Then open:

```text
http://localhost:8088
```

If you do not want to use npm, run:

```bash
python scripts/build_public_data.py
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

## Citation

If you use the tool, cite the associated review article and this repository. The file `CITATION.cff` provides citation metadata that GitHub can display automatically.
