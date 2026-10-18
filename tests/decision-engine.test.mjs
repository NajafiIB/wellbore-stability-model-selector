import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
import {evaluateSelection, rankRelatedPapers} from "../src/decisionEngine.js";

const rules = JSON.parse(await readFile(new URL("../data/model-rules.json", import.meta.url), "utf8"));
const papers = JSON.parse(await readFile(new URL("../data/papers.json", import.meta.url), "utf8"));
const geothermalPapers = JSON.parse(await readFile(new URL("../data/geothermal-papers.json", import.meta.url), "utf8"));
assert.equal(geothermalPapers.length, 26);
assert.equal(new Set(geothermalPapers.map((paper) => paper.id)).size, 26);
const combined = [...papers, ...geothermalPapers];
assert.equal(combined.length, 210);
assert.equal(new Set(combined.map((paper) => paper.id)).size, 210);
assert.equal(combined.filter((paper) => paper.classification === "Core").length, 142);
assert.equal(combined.filter((paper) => paper.classification === "Useful").length, 60);
assert.equal(combined.filter((paper) => paper.classification === "Included").length, 8);
assert.ok(!combined.some(p => p.id === "WBS-004"));
assert.match(combined.find(p => p.id === "GEO-26").limitation,/specimen 6/i);
assert.match(combined.find(p => p.id === "WBS-009").modelType,/stress inversion/i);
assert.match(combined.find(p => p.id === "WBS-078").failureCriterion,/Hoek-Brown/);
assert.ok(!combined.find(p => p.id === "WBS-155").reviewExtent.includes("Full PDF"));

function statusFor(result, layerId) {
  return result.layerResults.find((layer) => layer.id === layerId)?.status || "";
}

const reactiveShale = evaluateSelection({
  stage: "during",
  formation: "shale",
  geometry: "horizontal",
  pressureTemperature: "normal",
  mechanisms: ["hydration", "collapse"],
  dataAvailability: "medium",
  uncertainty: "medium",
  validationEvidence: "field",
  integrityConsequence: "medium",
  dataset: "none"
}, rules);

assert.equal(statusFor(reactiveShale, "shaleFluid"), "R");
assert.equal(statusFor(reactiveShale, "poroelastic"), "R");
assert.equal(statusFor(reactiveShale, "weakPlane"), "R");
assert.equal(statusFor(reactiveShale, "aiMl"), "S");

const fractured = evaluateSelection({
  stage: "before",
  formation: "fractured",
  geometry: "deviated",
  pressureTemperature: "normal",
  mechanisms: ["discontinuity"],
  dataAvailability: "high",
  uncertainty: "medium",
  validationEvidence: "field",
  integrityConsequence: "high",
  dataset: "none"
}, rules);

assert.equal(statusFor(fractured, "numerical"), "R");
assert.equal(statusFor(fractured, "mem"), "R");
assert.equal(statusFor(fractured, "integrity"), "R");

const thermalGeothermal = evaluateSelection({
  stage: "before",
  formation: "fractured",
  geometry: "deviated",
  pressureTemperature: "thermal",
  mechanisms: ["discontinuity", "tensile"],
  dataAvailability: "medium",
  uncertainty: "high",
  validationEvidence: "field",
  integrityConsequence: "high",
  dataset: "none"
}, rules);

assert.ok(thermalGeothermal.matchedRows.includes("thermal_geothermal"));
assert.equal(statusFor(thermalGeothermal, "thmThmc"), "R");
assert.equal(statusFor(thermalGeothermal, "numerical"), "R");
assert.equal(statusFor(thermalGeothermal, "probabilistic"), "R");

const narrowWindow = evaluateSelection({
  stage: "before",
  formation: "carbonate",
  geometry: "vertical",
  pressureTemperature: "normal",
  mechanisms: ["narrowWindow"],
  dataAvailability: "medium",
  uncertainty: "high",
  validationEvidence: "lab",
  integrityConsequence: "medium",
  dataset: "none"
}, rules);

assert.equal(statusFor(narrowWindow, "probabilistic"), "R");

const uncertainButNotNarrow = evaluateSelection({stage: "before", formation: "general",
  geometry: "vertical", mechanisms: [], dataAvailability: "medium", uncertainty: "high",
  validationEvidence: "lab", integrityConsequence: "medium", dataset: "none"}, rules);
assert.ok(!uncertainButNotNarrow.matchedRows.includes("narrow_window"));
assert.equal(statusFor(uncertainButNotNarrow, "probabilistic"), "R");

const aiDataset = evaluateSelection({
  stage: "after",
  formation: "general",
  geometry: "mixed",
  pressureTemperature: "normal",
  mechanisms: [],
  dataAvailability: "high",
  uncertainty: "medium",
  validationEvidence: "multiwell",
  integrityConsequence: "medium",
  dataset: "largeLabelled"
}, rules);

assert.equal(statusFor(aiDataset, "aiMl"), "Rec");
assert.equal(statusFor(aiDataset, "postDrill"), "R");

const related = rankRelatedPapers(papers, {
  stage: "during",
  formation: "shale",
  geometry: "horizontal",
  pressureTemperature: "normal",
  mechanisms: ["hydration"],
  dataAvailability: "medium",
  uncertainty: "medium",
  validationEvidence: "field",
  integrityConsequence: "medium",
  dataset: "none"
}, reactiveShale.layerResults, 5);

assert.ok(related.length > 0);
assert.ok(related.every((paper) => paper.matchScore > 0));
assert.ok(related.every((paper) => ["Core", "Useful", "Included"].includes(paper.classification)));

const injectionInput = {
  stage: "injection", formation: "fractured", geometry: "deviated",
  pressureTemperature: "thermal", mechanisms: ["tensile", "discontinuity"],
  dataAvailability: "medium", uncertainty: "high", validationEvidence: "field",
  integrityConsequence: "high", dataset: "none"
};
const injection = evaluateSelection(injectionInput, rules);
assert.ok(injection.matchedRows.includes("injection_operation"));
assert.equal(statusFor(injection, "thmThmc"), "R");
assert.equal(statusFor(injection, "integrity"), "R");
assert.ok(injection.decisions.some((decision) => decision.includes("pressure-temperature envelope")));
assert.ok(rankRelatedPapers(combined, injectionInput, injection.layerResults, 12)
  .some((paper) => paper.id.startsWith("GEO-") && /injection|operation/i.test(paper.secondaryStages)));

const maintenanceInput = {...injectionInput, stage: "maintenance", pressureTemperature: "normal", mechanisms: []};
const maintenance = evaluateSelection(maintenanceInput, rules);
assert.ok(maintenance.matchedRows.includes("maintenance_intervention"));
assert.equal(statusFor(maintenance, "postDrill"), "R");
assert.equal(statusFor(maintenance, "integrity"), "R");
assert.ok(rankRelatedPapers(combined, maintenanceInput, maintenance.layerResults, 12)
  .some((paper) => paper.id.startsWith("GEO-") && /maintenance|workover/i.test(paper.secondaryStages)));

const ungradedSource = combined.find(p => p.id === "GEO-26");
assert.equal(rankRelatedPapers([ungradedSource], injectionInput, injection.layerResults, 1)[0].id, "GEO-26");
assert.equal(rankRelatedPapers([{...ungradedSource, classification: "Exclude"}], injectionInput, injection.layerResults, 1).length, 0);

const creep = evaluateSelection({...maintenanceInput, mechanisms: ["creep"]}, rules);
assert.ok(creep.warnings.some((warning) => warning.includes("outside this categorical rule set")));

for (const result of [injection, maintenance, creep]) {
  assert.equal(result.recommendationStatus, "screening-guidance");
  assert.equal(result.operatingLimit, null);
  assert.ok(result.requiredObservations.length >= 3);
}
assert.ok(injection.requiredObservations.some((item) => item.includes("connectivity")));
assert.ok(injection.requiredObservations.some((item) => item.includes("temperature histories")));
assert.ok(creep.requiredObservations.some((item) => item.includes("time-dependent deformation")));
const missingInputs = evaluateSelection({}, rules);
assert.equal(missingInputs.operatingLimit, null);
assert.ok(missingInputs.warnings[0].includes("Screening guidance only"));

console.log("Decision-engine tests passed.");

const caseInput={stage:'injection',formation:'weakSandstone',geometry:'vertical',mechanisms:['fines'],pressureTemperature:'unknown',dataAvailability:'medium',validationEvidence:'field',uncertainty:'high',integrityConsequence:'medium',dataset:'none'};
const weak=evaluateSelection(caseInput,rules);
assert.ok(!weak.matchedRows.includes('competent_sandstone_carbonate'));
assert.ok(weak.matchedRows.includes('weak_unconsolidated'));
assert.equal(statusFor(weak,'finesTransport'),'R');
assert.notEqual(statusFor(weak,'elasticKirsch'),'R');
assert.equal(weak.operatingLimit,null);
assert.ok(weak.requiredObservations.some(x=>/particle/i.test(x)));
const diagnosis=evaluateSelection({...caseInput,stage:'maintenance',formation:'unknown',mechanisms:['postDrill']},rules);
assert.notEqual(statusFor(diagnosis,'mem'),'R');
assert.equal(statusFor(diagnosis,'integrity'),'R');
assert.ok(!diagnosis.requiredObservations.some(x=>x.startsWith('Stress orientation')));
console.log('Weak-formation, fines-transport and casing-diagnostic scope checks passed.');
