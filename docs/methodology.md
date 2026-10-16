# Review methodology and model-selection evidence

Methodology revision: 16 October 2026. Software: v0.1.6. Evaluated categorical rules: frozen v0.1.5. This account describes the current author-review package and deployed tool; it does not imply journal acceptance or completed author approval.

Companion to **An Open Source Wellbore Stability Modeling Framework for Geothermal Wells: Linking Failure Mechanisms, Evidence, and Lifecycle Decisions**, by **Iman Najafi and Dariusz Knez**, AGH University of Krakow.

## 1. Purpose and scope

The review asks which modelling approaches suit a specified geothermal well condition, failure mechanism and engineering decision, and what observations are needed to test their predictions. It connects conditions, mechanisms, model requirements, decisions and evidence across design, drilling, completion, injection, production, thermal cycling and maintenance or intervention.

This is a structured critical review with an evidence matrix and an explicit engineering selection framework. Historical discovery records are incomplete; exhaustive systematic-search coverage is not claimed. Petroleum and laboratory studies are retained where their mechanisms inform geothermal decisions and their transfer limitations can be stated. Rock stability, fracture-controlled losses and casing or cement-barrier performance are distinguished because their observations and failure criteria differ.

## 2. Discovery and source verification

Sources serve different purposes. Citation counts and journal reputation do not establish predictive reliability.

| Source | Role | Limit |
| --- | --- | --- |
| OpenAlex | Discovery, citation information and prioritisation of reading | Citation influence is not a quality or eligibility score |
| Crossref | DOI and bibliographic identity checks | Metadata verification is not scientific validation |
| Publisher platforms, including ScienceDirect and Taylor & Francis Online | Article records, publication details and accessible original texts | Platform presence alone does not establish article type or peer-review status |
| Conference archives and other identifiable sources | Technical evidence relevant to a stated mechanism or decision | Source type and publication status require individual identification |
| Backward and forward citation tracing | Follow relevant work from a documented seed | Seed, direction and discovered records require an audit trail |

Older drafts, reference workbooks, Zotero records and saved source files document parts of identification and coding. They do not reconstruct every historical query, execution date or retrieval total. File modification dates are not treated as search dates. Article identity, publication type and reviewed material are checked separately; inaccessible full text is recorded as an access limitation.

## 3. Logged supplementary discovery

The saved discovery protocol uses the OpenAlex Works API with the publication-date filter `to_publication_date:2026-10-16`. Raw requests, result pages, actual UTC execution timestamps and failures are retained in the author-review package. An assembly timestamp is not the execution time of an earlier query.

| ID | Exact search string | Status in the 16 October package |
| --- | --- | --- |
| Q01 | `"geothermal wellbore" stability` | Complete saved retrieval |
| Q02 | `"geothermal well" "lost circulation"` | Complete saved retrieval |
| Q03 | `"geothermal well" completion` | Complete saved retrieval |
| Q04 | `"geothermal well" injection` | Complete saved retrieval |
| Q05 | `"geothermal well" production` | Incomplete |
| Q06 | `"geothermal wellbore" "thermal cycling"` | Complete saved retrieval |
| Q07 | `"geothermal" "wellbore" creep` | Incomplete |
| Q08 | `"geothermal well" maintenance` | Incomplete |
| Q09 | `"geothermal well" intervention` | Incomplete |

There are 6,967 unique saved discovery candidates. Five query families were fully retrieved; four were interrupted by pagination or rate-limit errors. Complete retrieval means the saved query result set was retrieved, not that all relevant literature was found or screened. Eighteen candidates match existing synthesis records; the other 6,949 remain candidates for eligibility assessment. Machine-assigned reading priorities are not inclusion decisions. The unfinished searches must be completed or explicitly bounded before a final coverage claim.

## 4. Eligibility, identity and screening

Eligibility requires evidence relevant to a stated wellbore decision: rock mechanics or failure, strength, fracture connectivity or losses, thermal or chemical effects, time-dependent deformation, or observations supporting calibration or testing. Barrier studies form a distinct application domain. Mechanism-transfer studies require an explicit transfer role and limitation. Peer-reviewed articles are preferred; relevant proceedings and other source types are identified individually.

Duplicates or alternative versions of the same work, unrelated energy-resource or economic studies, and records without recoverable relevant evidence are not counted as separate synthesis studies. Reservoir-scale observations require an explicit transfer role before informing a wellbore claim. Unavailable full text is not automatically evidence of irrelevance.

Identity checking starts with normalised DOI, then normalised title. Ambiguous title matches, conference-to-journal versions and aliases require a source-based decision. Repeated PDFs are manifestations of a work, not additional papers. Stable paper IDs preserve assessment links. Current duplicate and source-role decisions are recorded; some historical kept/removed ID links remain undocumented.

Existing Excel assessments are reused. Reconciliation inspected 34 workbooks, representing 23 distinct file hashes, and linked all 208 retained assessments to saved assessment or revision-evidence records. It did not restart screening or alter scientific scores. New assessment is confined to genuinely new candidates and flagged source or claim gaps.

The surviving workbooks contain consolidated decisions and appraisals. Separate initial decisions from both authors, full assessor attribution and a historical disagreement log have not been located. This is a documentation limitation, not proof that author review did not occur. Independent duplicate screening and agreement statistics are therefore not claimed. New decisions should record assessor, date, reviewed material, decision and reason. For an actual disagreement, retain both views, the source and criterion consulted, and the final reasoned decision; unresolved conflicts remain explicit.

## 5. Coding and claim-specific appraisal

Each synthesis record has one primary lifecycle classification based on its principal decision or outcome. Secondary tags retain applications spanning stages. Current author-review S1 contains 208 synthesis records and 11 audit-only records. Exclusive primary-stage counts are 93 before drilling, 66 during drilling, 30 after drilling and 19 cross-cutting. These describe the assembled evidence base, not research prevalence or model performance.

Coding covers domain, mechanism, model family, assumptions, reviewed material, validation, limitations and recommended use. Article-supported coding takes precedence over title inference. Supporting pages or sections and review extent are recorded where established.

| Dimension | Appraisal question |
| --- | --- |
| Claim and outcome | What exact prediction, association or decision does the source support? |
| Evidence mode | Is the result measured, simulated, analytical or interpretive? |
| Scale and exposure | How many samples or wells, over what duration and loading history? |
| Calibration and testing | Were observations used for fitting or reserved for testing? |
| Uncertainty | Which stress, strength, thermal or fracture assumptions were varied or measured? |
| Transferability | Do formation, geometry, scale and lifecycle conditions match the proposed use? |
| Assessment provenance | Which source and saved assessment support the coding, and what was reviewed? |

Historical relevance grades and numeric priorities remain historical data, not a validated pooled quality score or complete risk-of-bias assessment. “Not reported” means the reviewed source omits an item; “not established” means available evidence or review extent is insufficient. PDF extraction or AI-assisted coding does not establish full-text appraisal or independent human review.

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

Related-paper ranking uses lifecycle and keyword matches, active layers and legacy relevance labels, with topical weights for injection and maintenance. Only eligible public-catalogue entries with a DOI or URL are ranked. This is a navigation heuristic, not a reliability score. Source claims and applicability require checking before design use.

## 8. Uncertainty and resolving observations

| Uncertain quantity | Potential effect | Useful observations |
| --- | --- | --- |
| Stress, pore pressure and strength | Changes failure margins and adequacy of simple elastic treatment | Stress tests/inversions, image logs, pressures and formation-specific strength tests |
| Fracture orientation/connectivity | Changes relevance of intact failure versus existing-fracture flow | Fracture logs, loss depths, pressure at loss onset and injection-test response |
| Thermal properties/history/cycling | Changes whether thermal coupling is decision-critical | Formation/fluid temperatures, flow/pressure histories, thermal properties and cycle duration |
| Time-dependent deformation | Changes adequacy of an instantaneous model for lifetime decisions | Material-specific creep tests and repeated deformation observations |
| Casing/cement condition | Changes whether a rock model addresses observed damage | Inspection, caliper, pressure/leak tests and post-intervention observations |

Six reported categorical perturbations test recommendation sensitivity to changed inputs. They do not quantify continuous parameter uncertainty, pressure-window uncertainty or failure probabilities. Numerical uncertainty analysis remains a site-specific task.

## 9. Evaluation and its limits

The v0.1.5 rules were frozen for evaluation. Rule-file SHA-256: `dcaa66c0405057deb62527b381a3e593d733c7a0a0e00660ca18805da0515cc9`. GRT-2, Soultz and Polish intervention examples informed the development discussion and retain demonstration status.

Two published sources outside the rule-development corpus were evaluated retrospectively. Published outcomes had been read before exact input encoding was fixed; the same workflow encoded inputs and interpreted outcomes. These are external-source, unblinded applicability evaluations, not blinded independent predictive validation. Comparators were conceptual, not newly calibrated models rerun. Six categorical input perturbations were reported. A third proposed source was inaccessible and not counted as evaluated.

| External case | Observations | Findings and limitations |
| --- | --- | --- |
| Szentes, Hungary: one converted injection well | Stimulation and injectivity observations in weak sandstone | Sandstone input activates competent-rock logic; fines transport/clogging lacks a category. No treatment-success or long-term injectivity forecast established |
| Leyte, Philippines: four selected wells from 14 solids-carryover wells | Caliper observations including casing thinning and deformation | Diagnostic layers partly align with inspection, but stage encoding supplies some information. Mandatory MEM was not demonstrated necessary; casing life was not predicted |

Sources: [Farkas et al. (2025), Szentes stimulation comparison](https://doi.org/10.1186/s40517-025-00344-7) and [Buñing et al. (2005), Leyte casing-inspection surveys](https://www.worldgeothermal.org/pdf/IGAstandard/WGC/2005/2038.pdf). S1A and the evaluation audit retain inputs, outputs, source locations, disagreements and perturbations.

Version v0.1.6 is deployed. It adds explicit screening status and required observations while preserving v0.1.5 categorical assignments. Regression checks cover 210 scenarios for category preservation. Software tests verify implementation behaviour, not scientific accuracy or economic benefit. Stronger predictive claims require inputs and a comparator fixed before outcome exposure, independent observations and explicit reporting of mismatches.

## 10. Reproducibility and version boundaries

| Artifact | Purpose and availability |
| --- | --- |
| S1 | Author-review matrix, source-role decisions, appraisal and existing-assessment provenance |
| S1A | Author-review rule trace, demonstrations, external cases, sensitivity and search register |
| Search/provenance audit | Saved requests/results, identity decisions and source checks in the author-review package |
| Public repository | Executable rules, decision engine, bibliographic metadata and tests |
| Permanent supplementary archive | Awaiting author approval of contents/licence and a verified identifier |

The website literature catalogue is a versioned submission-era metadata snapshot. It is not the reconciled author-review S1: identical headline totals do not imply identical membership. Reproduce manuscript counts and appraisal conclusions from reconciled S1, not website search results. Audit-only records are excluded from related-paper ranking. This documentation update does not replace catalogue membership or change evaluated rules.

Run `npm test` for rule execution. Run `python scripts/build_methodology.py --check` to verify the public page matches this Markdown source; omit `--check` to regenerate. The legacy `build:data` command does not regenerate the integrated manuscript corpus.

## 11. Specific remaining work

- Complete or explicitly bound four unfinished query families; assess genuinely new candidates without repeating existing Excel assessments.
- Resolve flagged sources: intended WBS-004 article; secondary indexed abstracts WBS-013, WBS-014, WBS-020 and WBS-053; WBS-112 text encoding; and claim fields needing original-source verification.
- Confirm historical assessor roles and review sequence where establishable. Retain documentation limits where they cannot be recovered; do not manufacture separate decisions or agreement statistics.
- Obtain both authors' approval of interpretations, case limitations, language, contributions, funding and accurate AI-use disclosure.
- Approve archive contents/licence, deposit supplements and insert the verified persistent identifier before submission.

Independent predictive validation remains a scientific limitation and is needed for stronger predictive claims. The completed retrospective evaluations retain their actual evidential status. Editorial acceptance is determined by reviewers and the editor.
