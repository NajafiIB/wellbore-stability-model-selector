# Methodology

The tool is a browser implementation of a review-derived model-selection framework. It uses two inputs:

1. A public metadata corpus containing the 195 screened records from the integrated review matrix. Only the 190 Core or Useful records are ranked from that set.
2. A separate, targeted 18-paper geothermal source set, with injection/operation and maintenance/workover evidence. It is not counted in the original 195/190 evidence map.
3. A transparent rule table derived from the Condition-Based Drilling Lifecycle Model-Selection Framework.

The rule table maps conditions to model layers:

- `R`: Required
- `Rec`: Recommended
- `C`: Conditional
- `S`: Support-only
- blank: Not primary

The framework follows the minimum-model principle:

> Use the simplest model family that captures the dominant instability mechanism, supports the operational decision, and can be checked against field or laboratory evidence.

The tool is intentionally conservative. It flags cases where model complexity is high but data availability or validation evidence is weak. AI/ML is treated as a support layer unless labelled multi-well data, external validation, uncertainty reporting, and physics-informed features are available.

## Main decision variables

- Operational stage: before drilling, during drilling, after drilling, injection/production operation, or maintenance/workover.
- Formation or rock type.
- Well geometry.
- Pressure-temperature context.
- Dominant failure mechanism.
- Data availability.
- Uncertainty level.
- Validation evidence.
- Integrity consequence.
- Availability of a labelled multi-well dataset.

## Literature matching

The related-paper list is ranked by matching the selected conditions and activated model layers against public metadata fields, including lifecycle stage, technical theme, model type, failure criterion, formation type, well type, validation basis, and relevance notes.

The ranking is a navigation aid. It is not a bibliometric score and should not be interpreted as a final quality ranking of papers.
