# Wellbore Stability Model Selector

This repository contains a public, no-login, static companion tool for the review article:

**An Open Source Wellbore Stability Modeling Framework for Geothermal Wells: Linking Failure Mechanisms, Evidence, and Lifecycle Decisions**

Authors: **Iman Najafi and Dariusz Knez** (AGH University of Krakow). The article title and authors appear on the website's research credit panel.

The tool implements the **Geothermal Wellbore Stability Lifecycle Model-Selection Framework** across drilling, injection/operation and maintenance/workover. Users select lifecycle stage, formation type, well geometry, dominant failure mechanism, data availability, uncertainty level, validation evidence, and integrity consequence. The tool returns recommended model families, validation needs, warnings, operational decisions supported, and source-linked related articles from the public metadata corpus.

## What the tool does

- Recommends model families, not software packages.
- Shows required, recommended, conditional, and support-only modelling layers.
- Links recommendations to validation evidence.
- Lists related articles with DOI links.
- Exports a JSON result for documentation or supplementary workflows.
- Runs entirely in the browser with no database, no backend, and no login.

The two public metadata files together represent the submitted S1 inventory: **208 analytic records** (143 Core and 65 Useful) and five audit-only records (three Background and two Exclude). The 18 geothermal-extension IDs are already among the 208 analytic records; they are stored in a separate file only for maintenance and are loaded once. The five audit-only records are never ranked as related papers. These counts describe the assembled corpus, not publication prevalence.

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

The `build:data` script is retained for the earlier WBS-only source workflow. It must not be used as a complete regeneration of the submitted 208-record S1 inventory until the integrated matrix is supplied to the build. The versioned JSON files in this repository are the current public metadata snapshot.

## Citation

If you use the tool, cite the associated review article and this repository. The file `CITATION.cff` provides citation metadata that GitHub can display automatically.

## Revision candidate 0.1.6

Adds explicit screening-guidance status, a null operating-limit field, and condition-specific required observations to UI and JSON results. Categorical rule assignments remain those of frozen v0.1.5. Reopened manuscript screening is pending author adjudication; public catalogue counts remain the verified 208 analytic records. See docs/methodology.md.
