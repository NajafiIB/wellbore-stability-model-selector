import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";
import {evaluateSelection, rankRelatedPapers} from "../src/decisionEngine.js";

const rules = JSON.parse(await readFile(new URL("../data/model-rules.json", import.meta.url), "utf8"));
const papers = JSON.parse(await readFile(new URL("../data/papers.json", import.meta.url), "utf8"));

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
assert.ok(related.every((paper) => ["Core", "Useful"].includes(paper.classification)));

console.log("Decision-engine tests passed.");
