# Wellbore Stability Model Selector

This repository contains a public, no-login, static companion tool for the review article:

**A Drilling Lifecycle-Based Model-Selection Framework for Wellbore Stability: From Pre-Drill Prediction to Post-Drill Validation and Integrity**

The tool implements the **Condition-Based Drilling Lifecycle Model-Selection Framework**. Users select drilling stage, formation type, well geometry, dominant failure mechanism, data availability, uncertainty level, validation evidence, and integrity consequence. The tool returns recommended model families, validation needs, warnings, operational decisions supported, and DOI-linked related articles from the public metadata corpus.

## What the tool does

- Recommends model families, not software packages.
- Shows required, recommended, conditional, and support-only modelling layers.
- Links recommendations to validation evidence.
- Lists related articles with DOI links.
- Exports a JSON result for documentation or supplementary workflows.
- Runs entirely in the browser with no database, no backend, and no login.

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

1. Create a new public GitHub repository, for example `wellbore-stability-model-selector`.
2. Upload the contents of this folder as the repository root.
3. In GitHub, open **Settings > Pages**.
4. Set the source to the `main` branch and `/root`.
5. Save. GitHub will publish the static site.

No Supabase, database, login, or server is needed.

Expected public URL after deployment:

```text
https://najafiib.github.io/wellbore-stability-model-selector/
```

## Public data policy

The public data file `data/papers.json` contains bibliographic and coding metadata only:

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
