# Review methodology and model-selection evidence

Companion to **An Open Source Wellbore Stability Modeling Framework for Geothermal Wells: Linking Failure Mechanisms, Evidence, and Lifecycle Decisions**, by **Iman Najafi** (World Business Council, Warsaw) and **Dariusz Knez** (AGH University of Krakow).

The study combines a structured critical review with a conditional model-selection framework. It connects geothermal well conditions and failure mechanisms to modelling requirements, engineering decisions and observations for testing. The companion software implements these relationships as explicit categorical rules.

## 1. Purpose and scope

The review examines model selection across geothermal well design, drilling, completion, injection, production, thermal cycling and maintenance or intervention. The central question is whether a model represents the mechanism capable of changing a specified engineering decision and whether suitable observations support its application.

Petroleum and laboratory studies contribute where their mechanisms inform geothermal decisions and their transfer limitations can be stated. Rock failure, flow into connected fractures, casing deformation and cement-barrier leakage are distinct outcomes. Each requires an appropriate model, loading history and validation target. The review is an interpretive synthesis, not an estimate of research prevalence or an exhaustive systematic review.

## 2. Source identification and bibliographic verification

Source identification combines topical searches and citation tracing across rock-mechanics, petroleum-engineering and geothermal journals and technical proceedings. Search concepts cover wellbore stability, lost circulation, completion, injection, production, thermal cycling, creep and intervention. Citation counts inform reading priority; scientific reliability is assessed from methods, observations and applicability.

| Source | Function | Interpretation |
| --- | --- | --- |
| OpenAlex | Literature discovery and citation information | Citation influence indicates scholarly attention, not methodological quality |
| Crossref | DOI and bibliographic identity checks | Correct metadata establishes source identity, not scientific validity |
| Publisher platforms, including ScienceDirect and Taylor & Francis Online | Article records, publication details and accessible original texts | Article type and peer-review status require source-level verification |
| Conference archives | Technical reports relevant to mechanisms and decisions | Proceedings are identified by source type and evaluated against the claims used |
| Citation tracing | Links between relevant studies and their cited or citing work | Traced records are subject to the same eligibility criteria |

Bibliographic records identify each source by stable paper ID, title, authors, venue, year and DOI or persistent link. Search records and source locators support traceability. Search-only records do not contribute to synthesis counts.

Nine OpenAlex query families use a publication cutoff of 16 October 2026 and were executed on 16–18 October 2026 (Europe/Warsaw). Complete retrieval yields 10,514 distinct discovery identifiers after identifier reconciliation. Search retrieval does not determine synthesis eligibility. Exact requests and source dispositions are recorded in S1A.

| Query | Retrieved records |
| --- | --- |
| "geothermal wellbore" stability | 149 |
| "geothermal well" "lost circulation" | 780 |
| "geothermal well" completion | 3101 |
| "geothermal well" injection | 4615 |
| "geothermal well" production | 8411 |
| "geothermal wellbore" "thermal cycling" | 34 |
| "geothermal" "wellbore" creep | 832 |
| "geothermal well" maintenance | 2561 |
| "geothermal well" intervention | 615 |

## 3. Eligibility and duplicate handling

Eligibility requires an explicit connection to rock mechanics or failure, strength, fracture connectivity or losses, thermal or chemical effects, time-dependent deformation, or calibration and testing observations relevant to a wellbore decision. Barrier studies form a distinct application domain. Transfer studies require an identifiable mechanism and a stated limitation on geothermal applicability.

General energy-resource or economic studies without this connection do not support the synthesis. Editorials and collection notices provide context rather than primary evidence. Peer-reviewed articles are preferred; relevant technical proceedings and other source types are identified individually. An inaccessible full text is an access limitation, not proof that a study is irrelevant. Abstract-supported claims are bounded by the information the abstract contains.

Duplicate identification uses normalised DOI, normalised title and source-based checking of ambiguous versions. Repeated PDF copies represent one work. Related conference and journal reports are linked; they are collapsed only when source identity is established. Overlapping observations are not pooled. Stable paper IDs link eligibility decisions, coding and appraisal to their supporting records.

## 4. Evidence extraction and lifecycle classification

S1 records study characteristics, eligibility decisions, assumptions, evidence mode, limitations, recommended use and supporting source locations. Review extent distinguishes original-paper evidence from abstract or metadata support. Screening and appraisal are represented by consolidated decisions; independent duplicate screening and inter-assessor agreement statistics are not claimed.

Each source has one primary lifecycle classification based on its principal engineering decision or observed outcome. Secondary tags identify applications spanning several stages. The synthesis comprises 210 source records: 93 before drilling, 67 during drilling, 31 after drilling and 19 cross-cutting. Counts describe this evidence base and do not estimate the balance of publications across the field.

Application-domain coding relies on article-supported evidence. A contextual mention of geothermal or petroleum energy does not establish the study's primary application. Mixed and indeterminate domains are identified explicitly. Background, duplicate and other audit records do not enter synthesis totals.

## 5. Claim-specific appraisal

Appraisal relates each source to the particular claim for which it is used. Measured outcomes are distinguished from simulations, and calibration observations from data reserved for testing. Supporting pages or sections and review extent define the evidential basis of each interpretation.

| Dimension | Appraisal question |
| --- | --- |
| Claim and outcome | What prediction, association or engineering decision does the source support? |
| Evidence mode | Is the result measured, simulated, analytical or interpretive? |
| Scale and exposure | How many samples or wells, over what duration and loading history? |
| Calibration and testing | Were observations used to fit the model or reserved for testing? |
| Uncertainty | Which stress, strength, thermal or fracture assumptions were measured or varied? |
| Transferability | Do formation, geometry, scale and lifecycle conditions match the intended use? |
| Source support | Which passage, observation or calculation supports the interpretation? |

Relevance labels support literature organisation; they are not validated quality scores. “Not reported” denotes information omitted by the reviewed source. “Not established” denotes information that cannot be determined from the available material. Extracted text alone does not establish a quantitative result or independent human assessment. Heterogeneous outcomes are compared by mechanism and decision, without pooling them into a single prediction-error ranking.

Material-specific appraisal distinguishes analytical salt closure from laboratory creep in fractured granite. [Weijermars et al.](https://doi.org/10.1093/gji/ggt346) relate salt closure to pressure imbalance, viscosity and lateral creep; transfer requires an appropriate salt rheology. [Zhang et al.](https://doi.org/10.1155/2018/4653937) report six reactive-flow creep tests, but specimen/solution attribution differs between Table 1 and Section 3.1. Their qualitative mechanism evidence does not establish a well-scale failure time or a geothermal service lifetime.

## 6. Synthesis and framework construction

The synthesis compares represented mechanisms, required assumptions, supported decisions and observations needed for calibration and testing. Complexity alone is not ranked as predictive ability. A laboratory seal test, a coupled stress simulation and a field loss record answer different questions and are not interchangeable validation evidence.

The framework translates this synthesis into condition-to-layer assignments: engineering judgments informed by evidence, not statistically fitted probabilities. S1A links rules to supporting records, activation conditions, required inputs and limitations. Executable assignments and their implementation are available in the [versioned rule table](https://github.com/NajafiIB/wellbore-stability-model-selector/blob/main/data/model-rules.json) and [decision engine](https://github.com/NajafiIB/wellbore-stability-model-selector/blob/main/src/decisionEngine.js).

The workflow is: define the lifecycle decision; identify mechanisms and uncertainty; select model layers; acquire calibration inputs; reserve observations for testing; and revisit the decision if those observations contradict its assumptions.

## 7. How the selector computes a recommendation

Inputs are categorical: lifecycle stage, formation, geometry, pressure/temperature context, mechanisms, data availability, uncertainty, validation evidence, integrity consequence and labelled multi-well dataset availability. Matching condition rows activate model layers; the highest assigned category is retained for each layer. Consequence and uncertainty selections can raise integrity or probabilistic layers. Several complementary layers may be needed.

| Category | Meaning |
| --- | --- |
| Required (R) | Omission conflicts with the declared condition and decision within this table; necessity in every field setting is not proved |
| Recommended (Rec) | Normally consider, subject to local evidence and sensitivity |
| Conditional (C) | Further mechanism or data justification is needed |
| Support only (S) | Auxiliary diagnostic or decision support |
| Not primary | No active rule assigns the layer; physical irrelevance is not established |

The thermal flag represents an analyst's assessment that thermal loading could change the decision. Geothermal use alone does not activate a universal temperature threshold; none is defined. Flow into connected fractures is distinguished from initiation of a new fracture in intact rock. Long-term creep requires material-specific time-dependent analysis; the selector does not choose or solve a creep law.

Every result is labelled `screening-guidance` and returns `operatingLimit: null`. Required observations appear in the interface and exported JSON. The selector does not ingest numerical stress, strength, connectivity or thermal histories needed to calculate a safe pressure, temperature or service-life limit. Selecting high data availability or field validation does not certify suitable observations exist.

Related-paper ranking uses lifecycle and keyword matches, active layers and relevance labels, with topical weights for injection and maintenance. Only included public-catalogue entries with a DOI or URL are ranked. Historical Core/Useful labels retain their navigation weights; newly appraised Included records carry no historical grade bonus. This is a navigation heuristic, not a reliability score. Source claims and applicability require checking before design use.

## 8. Uncertainty and resolving observations

| Uncertain quantity | Potential effect | Useful observations |
| --- | --- | --- |
| Stress, pore pressure and strength | Changes failure margins and adequacy of simple elastic treatment | Stress tests/inversions, image logs, pressures and formation-specific strength tests |
| Fracture orientation/connectivity | Changes relevance of intact failure versus existing-fracture flow | Fracture logs, loss depths, pressure at loss onset and injection-test response |
| Thermal properties/history/cycling | Changes whether thermal coupling is decision-critical | Formation/fluid temperatures, flow/pressure histories, thermal properties and cycle duration |
| Time-dependent deformation | Changes adequacy of an instantaneous model for lifetime decisions | Material-specific creep tests and repeated deformation observations |
| Casing/cement condition | Changes whether a rock model addresses observed damage | Inspection, caliper, pressure/leak tests and post-intervention observations |

Six reported categorical perturbations test recommendation sensitivity to changed inputs. They do not quantify continuous parameter uncertainty, pressure-window uncertainty or failure probabilities. Numerical uncertainty analysis remains a site-specific task.

## 9. Case evaluation and interpretation

Evaluation uses the fixed version 0.1.5 categorical rules. Three demonstrations examine drilling transfer from GRT-1 to GRT-2, fractured-reservoir injection at Soultz, and inspection-led reconstruction of a Polish injection well. These illustrate rule interpretation using sources associated with framework development.

External retrospective evaluation comprises two published geothermal cases outside the development corpus. Input encoding uses published descriptions with outcomes available to the analyst. The assessment is unblinded and evaluates applicability to the mechanism and decision; it does not estimate prospective predictive accuracy. Source-supported inputs and analyst assumptions are distinguished in S1A.

| External case | Observations | Interpretation |
| --- | --- | --- |
| Szentes, Hungary: one converted injection well | Stimulation and injectivity observations in weak sandstone | The sandstone input activates competent-rock logic; fines migration and clogging have no dedicated category. Treatment success and long-term injectivity are not predicted |
| Leyte, Philippines: four selected wells from 14 solids-carryover wells | Casing-caliper observations including thinning and deformation | Diagnostic layers partly align with inspection. A Mechanical Earth Model is not demonstrated necessary for wall-thinning diagnosis; remaining casing life is not predicted |

Sources: [Farkas et al. (2025), Szentes stimulation comparison](https://doi.org/10.1186/s40517-025-00344-7) and [Buñing et al. (2005), Leyte casing-inspection surveys](https://www.worldgeothermal.org/pdf/IGAstandard/WGC/2005/2038.pdf).

Applicability is classified as concordant, partly supported or unsupported against the reported mechanism and decision. Conceptual comparators represent intact-wall stress/failure analysis and generic inspection guidance; they are not calibrated competing forecasts. Six categorical perturbations examine sensitivity to input classification. Agreement with a diagnostic category does not establish an improvement in operational decisions or economic performance.

## 10. Reproducibility and software

| Resource | Scientific function |
| --- | --- |
| S1 evidence matrix | Study characteristics, eligibility, source identity, claim appraisal and source locators |
| S1A framework records | Rules, source-to-rule links, case inputs/outputs, sensitivity analyses and claim checks |
| Supporting search records | Traceable search and bibliographic information, separate from analytical inclusion |
| Public repository | Executable rule table, decision engine, bibliographic navigation catalogue and tests |

The analytical corpus is defined by S1. The website's related-paper catalogue is a navigation resource and does not define the manuscript's inclusion decisions or counts. Its stable-ID membership matches the 210 S1 synthesis records. Audit-only records and unassessed search candidates are excluded. Primary stage counts use the exclusive S1 classification; secondary stage tags support navigation. Source articles are linked through bibliographic records; copyrighted full texts are not redistributed.

The companion interface is version 0.1.7 and implements the evaluated v0.1.5 categorical assignments. Each exported result identifies screening guidance, required observations and a null numerical operating limit. Rule execution is checked by the software test suite, including 210 category-regression scenarios. These tests establish implementation behaviour, not scientific accuracy.

Run `npm test` for rule-execution checks. Run `python scripts/build_methodology.py --check` to verify that this document and the public methodology page match. The [repository](https://github.com/NajafiIB/wellbore-stability-model-selector) contains the implementation and reproducible software tests.

## 11. Scope of inference

Search coverage is not demonstrably exhaustive, and the consolidated assessment does not establish independent duplicate screening. Field-wide prevalence and inter-assessor agreement are not estimated. Review extent varies among original papers, abstracts and publisher records; claim-specific appraisal is not a complete risk-of-bias assessment.

The framework expresses conditional engineering judgments. External evaluation is retrospective and unblinded, and it does not establish forecast accuracy or decision benefit. Material mapping, fines-controlled injection and long-term deformation define important limits of applicability. The tool provides neither calibrated failure probabilities nor pressure or lifetime predictions.

Model use requires a stated engineering decision, locally constrained inputs and observations appropriate to the predicted outcome. A borehole image, injection response and barrier leak test assess different claims. Independent predictive testing requires inputs fixed before outcome exposure and observations excluded from calibration.
