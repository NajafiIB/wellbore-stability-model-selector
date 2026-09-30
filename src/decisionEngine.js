export function normalizeText(value) {
  return String(value ?? "").toLowerCase();
}

function mergeStatus(current, incoming, rank) {
  if (!incoming) return current;
  if (!current) return incoming;
  return rank[incoming] > rank[current] ? incoming : current;
}

function addReason(reasons, layerId, reason) {
  if (!reasons[layerId]) reasons[layerId] = [];
  if (!reasons[layerId].includes(reason)) reasons[layerId].push(reason);
}

function mergeRow(accumulator, row, rank, reasons, reason) {
  for (const [layerId, status] of Object.entries(row.statuses)) {
    accumulator[layerId] = mergeStatus(accumulator[layerId], status, rank);
    addReason(reasons, layerId, reason);
  }
}

function selectedMechanisms(input) {
  return Array.isArray(input.mechanisms) ? input.mechanisms : [];
}

function conditionRows(input) {
  const rows = new Set();
  const formation = input.formation;
  const geometry = input.geometry;
  const pressureTemperature = input.pressureTemperature;
  const mechanisms = selectedMechanisms(input);

  if (input.stage === "before" && input.dataAvailability === "low") rows.add("early_screening");
  if (formation === "sandstone" || formation === "carbonate") rows.add("competent_sandstone_carbonate");
  if (geometry === "deviated" || geometry === "horizontal") rows.add("deviated_horizontal");
  if (formation === "shale" || formation === "anisotropic") rows.add("laminated_anisotropic");
  if (formation === "shale" && (mechanisms.includes("hydration") || mechanisms.includes("chemical"))) rows.add("reactive_shale");
  if (pressureTemperature === "hpht" || pressureTemperature === "deepwater") rows.add("hpht_deepwater");
  if (pressureTemperature === "thermal") rows.add("thermal_geothermal");
  if (formation === "hydrate") rows.add("hydrate");
  if (formation === "fractured" || formation === "faulted" || mechanisms.includes("discontinuity")) rows.add("fractured_faulted");
  if (mechanisms.includes("narrowWindow") || input.uncertainty === "high") rows.add("narrow_window");
  if (input.stage === "during" || mechanisms.includes("realTimeSymptoms")) rows.add("real_time_symptoms");
  if (input.stage === "after" || mechanisms.includes("postDrill")) rows.add("post_drill_validation");
  if (input.stage === "injection") rows.add("injection_operation");
  if (input.stage === "maintenance") rows.add("maintenance_intervention");
  if (input.dataset === "largeLabelled" || mechanisms.includes("aiDataset")) rows.add("labelled_dataset");

  if (rows.size === 0) rows.add("early_screening");
  return [...rows];
}

function buildWarnings(input, statuses) {
  const warnings = [];
  const mechanisms = selectedMechanisms(input);

  if (input.dataAvailability === "low" && ["numerical", "thmThmc", "shaleFluid"].some((id) => statuses[id] === "R")) {
    warnings.push("A high-complexity layer is required by the selected condition, but data availability is low. Use conservative sensitivity ranges and prioritize data acquisition before final design.");
  }
  if (input.formation === "shale" && (mechanisms.includes("hydration") || mechanisms.includes("chemical")) && statuses.shaleFluid !== "R") {
    warnings.push("Reactive shale was selected. A mechanical-only model should not be used without shale-fluid or chemo-mechanical sensitivity checks.");
  }
  if ((input.formation === "fractured" || input.formation === "faulted") && statuses.numerical !== "R") {
    warnings.push("Faulted or fractured rock usually needs explicit fracture/discontinuity representation or a conservative equivalent-continuum sensitivity analysis.");
  }
  if (input.dataset !== "largeLabelled" && statuses.aiMl === "Rec") {
    warnings.push("AI/ML should be used only as a support layer unless labels, external validation, and physics-informed features are available.");
  }
  if (input.validationEvidence === "none") {
    warnings.push("No validation evidence was selected. Treat the recommendation as screening-level until checked against field, laboratory, image-log, caliper, loss, or multi-well evidence.");
  }
  return warnings;
}

function practicalDecision(input, statuses) {
  const decisions = [];
  if (input.stage === "before") decisions.push("Pre-drill mud-weight window, trajectory envelope, casing-depth risk, and data-acquisition priorities.");
  if (input.stage === "during") decisions.push("Real-time mud-weight, ECD, mud-chemistry, hole-cleaning, MPD, or casing-timing response.");
  if (input.stage === "after") decisions.push("Back-analysis, MEM recalibration, next-well learning, and integrity lessons.");
  if (input.stage === "injection") decisions.push("Injection or production pressure-temperature envelope, rock-fracture surveillance, and separate casing-cement barrier monitoring.");
  if (input.stage === "maintenance") decisions.push("Locate casing, cement or formation damage; choose a workover or repair; verify integrity with a post-repair test before return to service.");
  if (statuses.probabilistic === "R" || statuses.probabilistic === "Rec") decisions.push("Risk-based pressure-window and uncertainty-margin decisions.");
  if (statuses.integrity === "R" || statuses.integrity === "Rec") decisions.push("Intervals where hole quality may affect casing running, cement placement, annular isolation, or barrier quality.");
  return decisions;
}

export function evaluateSelection(input, rules) {
  const rank = rules.statusRank;
  const rowById = Object.fromEntries(rules.heatmapRows.map((row) => [row.id, row]));
  const matchedRows = conditionRows(input);
  const statuses = {};
  const reasons = {};

  for (const rowId of matchedRows) {
    mergeRow(statuses, rowById[rowId], rank, reasons, `Matched condition: ${rowById[rowId].label}`);
  }

  if (input.integrityConsequence === "high") {
    statuses.integrity = mergeStatus(statuses.integrity, "R", rank);
    addReason(reasons, "integrity", "High integrity consequence selected.");
  } else if (input.integrityConsequence === "medium") {
    statuses.integrity = mergeStatus(statuses.integrity, "Rec", rank);
    addReason(reasons, "integrity", "Medium integrity consequence selected.");
  }

  if (input.uncertainty === "high") {
    statuses.probabilistic = mergeStatus(statuses.probabilistic, "R", rank);
    addReason(reasons, "probabilistic", "High decision-changing uncertainty selected.");
  }

  const layerResults = rules.layers.map((layer) => {
    const status = statuses[layer.id] || "";
    return {
      ...layer,
      status,
      statusLabel: status ? rules.statusLabels[status] : "Not primary",
      reasons: reasons[layer.id] || [],
      validationNeeded: rules.validationByLayer[layer.id] || []
    };
  });

  return {
    frameworkName: rules.frameworkName,
    matchedRows,
    layerResults,
    warnings: buildWarnings(input, statuses),
    decisions: practicalDecision(input, statuses),
    statusSummary: summarizeStatuses(layerResults)
  };
}

export function summarizeStatuses(layerResults) {
  return {
    required: layerResults.filter((layer) => layer.status === "R"),
    recommended: layerResults.filter((layer) => layer.status === "Rec"),
    conditional: layerResults.filter((layer) => layer.status === "C"),
    support: layerResults.filter((layer) => layer.status === "S")
  };
}

function paperStageScore(paper, stage) {
  const text = normalizeText(paper.stage);
  if (stage === "before" && text.includes("before")) return 6;
  if (stage === "during" && text.includes("during")) return 6;
  if (stage === "after" && text.includes("after")) return 6;
  if (stage === "injection" && (text.includes("injection") || text.includes("operation"))) return 28;
  if (stage === "maintenance" && (text.includes("maintenance") || text.includes("workover"))) return 28;
  if (text.includes("cross")) return 2;
  return 0;
}

function containsAny(text, terms) {
  const target = normalizeText(text);
  return terms.some((term) => target.includes(normalizeText(term)));
}

function activatedTerms(input, layerResults) {
  const terms = [];
  for (const layer of layerResults) {
    if (!layer.status) continue;
    terms.push(...(layer.themeKeywords || []), ...(layer.paperKeywords || []), layer.label);
  }
  terms.push(input.formation, input.geometry, input.pressureTemperature, ...selectedMechanisms(input));
  return terms.filter(Boolean);
}

export function rankRelatedPapers(papers, input, layerResults, limit = 12) {
  const terms = activatedTerms(input, layerResults);
  const activeLayerIds = new Set(layerResults.filter((layer) => layer.status).map((layer) => layer.id));

  return papers
    .filter((paper) => (paper.doi || paper.url) && ["Core", "Useful", "Geothermal extension"].includes(paper.classification))
    .map((paper) => {
      let score = 0;
      const blob = [
        paper.title,
        paper.stage,
        paper.theme,
        paper.modelType,
        paper.failureCriterion,
        paper.formation,
        paper.wellType,
        paper.coupling,
        paper.validation,
        paper.keyContribution,
        paper.relevance,
        paper.recommendedUse
      ].join(" ");

      score += paperStageScore(paper, input.stage);
      if (paper.classification === "Core") score += 5;
      if (paper.classification === "Useful") score += 3;
      if (paper.classification === "Geothermal extension" && ["injection", "maintenance"].includes(input.stage)) score += 4;
      if (paper.validationStrength === "Strong") score += 3;
      if (paper.validationStrength === "Moderate") score += 2;

      for (const term of terms) {
        if (term && normalizeText(term).length > 2 && containsAny(blob, [term])) score += 1;
      }

      if (activeLayerIds.has("aiMl") && containsAny(blob, ["AI", "machine learning", "data-driven"])) score += 5;
      if (activeLayerIds.has("shaleFluid") && containsAny(blob, ["shale", "hydration", "osmosis", "chemical"])) score += 5;
      if (activeLayerIds.has("weakPlane") && containsAny(blob, ["anisotropy", "weak-plane", "bedding", "laminated"])) score += 5;
      if (activeLayerIds.has("numerical") && containsAny(blob, ["FEM", "FDM", "DEM", "BEM", "numerical", "finite element", "discrete element"])) score += 4;
      if (activeLayerIds.has("probabilistic") && containsAny(blob, ["uncertainty", "probabilistic", "Monte Carlo", "risk"])) score += 4;
      if (activeLayerIds.has("postDrill") && containsAny(blob, ["breakout", "DITF", "caliper", "image log", "validation", "back-analysis"])) score += 4;
      if (input.stage === "injection" && containsAny(blob, ["injection", "injectivity", "thermal cycle", "cement sheath"])) score += 8;
      if (input.stage === "maintenance" && containsAny(blob, ["maintenance", "workover", "reconstruction", "casing failure", "repair"])) score += 8;

      return {...paper, matchScore: score};
    })
    .filter((paper) => paper.matchScore > 0)
    .sort((a, b) => {
      if (b.matchScore !== a.matchScore) return b.matchScore - a.matchScore;
      const scoreA = Number(a.confidenceScore || 0);
      const scoreB = Number(b.confidenceScore || 0);
      if (scoreB !== scoreA) return scoreB - scoreA;
      return Number(b.year || 0) - Number(a.year || 0);
    })
    .slice(0, limit);
}
