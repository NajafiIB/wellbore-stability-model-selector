# Methodology and evidence boundaries

This companion to **An Open Source Wellbore Stability Modeling Framework for Geothermal Wells: Linking Failure Mechanisms, Evidence, and Lifecycle Decisions**, by **Iman Najafi and Dariusz Knez**, implements an explicit condition-to-model-layer table.

## Literature and source roles

OpenAlex supports discovery and citation tracing; citation counts indicate scholarly influence, not scientific reliability. Crossref supports identifier and bibliographic checks. Publisher platforms and conference archives provide article records and accessible texts. Article type, reviewed material and claim-specific evidence must be checked separately. Historical scores and field/laboratory labels are not validated quality grades.

The public source catalogue comprises 208 analytic records and five audit-only records. Its 18 geothermal-extension records are already included in the 208. Reopened screening and manuscript evidence reconciliation are being prepared for author review; this catalogue must not be represented as the final result of that screening. The legacy build:data command does not rebuild the integrated catalogue.

## Rule interpretation

Required means that omitting a layer conflicts with the user-declared mechanism and decision. Recommended means normally consider the layer, subject to local sensitivity and evidence. Conditional means its use requires further mechanism/data justification. Support Only indicates an auxiliary diagnostic layer. The assignments are engineering judgments informed by mechanism studies. When several conditions apply, the highest category for each layer is retained.

The thermal flag is an analyst assessment that thermal loading could alter the decision; geothermal use alone does not activate it. The tool has no numerical temperature cutoff. A fracture/fault condition denotes connected-fracture behaviour; an intact tensile-fracture threshold is not a circulation-loss threshold. Creep requires a separate, material-specific constitutive assessment.

## Missing inputs and operating limits

Every result is labelled `screening-guidance` and returns `operatingLimit: null`. The tool does not ingest the numerical stress, strength, fracture-connectivity or temperature history needed to compute a pressure or lifetime limit. Required observations are displayed with the result and included in JSON exports. A high data-availability selection does not certify that these observations exist or that a model has been independently tested.

## Evaluation and versions

Version 0.1.5 is the frozen rule baseline for the manuscript demonstrations and categorical sensitivity checks. Version 0.1.6 is a revision candidate that adds an explicit output status and observation requirements. Its categorical assignments are unchanged and are tested separately. Software tests establish rule execution, not predictive accuracy. GRT-2, Soultz and the Polish reconstruction examples informed the discussion and are demonstrations, not a reserved independent test set.

An independent case evaluation requires published cases outside rule development, rules and case inputs frozen before outcome review, a predefined simpler comparator, and reporting of disagreements as well as agreements. No independently held-out selector accuracy is claimed here.

## Literature matching

Related-paper ranking uses topical and lifecycle matching. It is a navigation aid, not a reliability score. Results should be checked in the source article before use in a design decision.
