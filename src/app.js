import {evaluateSelection, rankRelatedPapers} from "./decisionEngine.js";

const state = {
  rules: null,
  papers: [],
  result: null
};

const form = document.querySelector("#selector-form");
const layerTableBody = document.querySelector("#layer-table tbody");
const paperList = document.querySelector("#paper-list");
const warningList = document.querySelector("#warning-list");
const decisionList = document.querySelector("#decision-list");
const matchedRows = document.querySelector("#matched-conditions");
const querySummary = document.querySelector("#query-summary");
const summaryMetrics = document.querySelector("#summary-metrics");
const selectedStage = document.querySelector("#selected-stage");
const exportButton = document.querySelector("#export-json");
const resetButton = document.querySelector("#reset-form");

function formInput() {
  const formData = new FormData(form);
  return {
    stage: formData.get("stage"),
    formation: formData.get("formation"),
    geometry: formData.get("geometry"),
    pressureTemperature: formData.get("pressureTemperature"),
    dataAvailability: formData.get("dataAvailability"),
    uncertainty: formData.get("uncertainty"),
    validationEvidence: formData.get("validationEvidence"),
    integrityConsequence: formData.get("integrityConsequence"),
    dataset: formData.get("dataset"),
    mechanisms: formData.getAll("mechanisms")
  };
}

function statusClass(status) {
  return status ? `status-${status.toLowerCase()}` : "status-none";
}

function renderLayers(result) {
  layerTableBody.innerHTML = "";
  for (const layer of result.layerResults) {
    if (!layer.status && !document.querySelector("#show-all-layers").checked) continue;
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>
        <span class="status-pill ${statusClass(layer.status)}">${layer.status || "-"}</span>
      </td>
      <td>
        <strong>${layer.label}</strong>
        <span>${layer.statusLabel}</span>
      </td>
      <td>${layer.reasons.length ? layer.reasons.join("<br>") : "Not primary for the selected condition."}</td>
      <td>${layer.validationNeeded.slice(0, 4).join("; ")}</td>
    `;
    layerTableBody.append(row);
  }
}

function doiLink(paper) {
  if (!paper.doi && paper.url) return `<a href="${paper.url}" target="_blank" rel="noopener">Source record</a>`;
  if (!paper.doi) return "";
  const doi = paper.doi.replace(/^https?:\/\/(dx\.)?doi\.org\//i, "");
  return `<a href="https://doi.org/${encodeURIComponent(doi).replace(/%2F/g, "/")}" target="_blank" rel="noopener">DOI: ${doi}</a>`;
}

function renderPapers(papers) {
  paperList.innerHTML = "";
  if (!papers.length) {
    paperList.innerHTML = "<li>No matching papers were found in the public metadata file.</li>";
    return;
  }
  for (const paper of papers) {
    const item = document.createElement("li");
    item.className = "paper-item";
    item.innerHTML = `
      <div class="paper-title">${paper.title || "Untitled record"}</div>
      <div class="paper-meta">${paper.authors || "Unknown authors"} (${paper.year || "n.d."}) · ${paper.venue || "Unknown venue"}</div>
      <div class="paper-tags">
        <span>${paper.classification || "Unclassified"}</span>
        <span>${paper.stage || "Stage not coded"}</span>
        <span>${paper.theme || "Theme not coded"}</span>
        <span>match ${paper.matchScore}</span>
      </div>
      <div class="paper-note">${paper.relevance || paper.keyContribution || ""}</div>
      <div class="paper-link">${doiLink(paper)}</div>
    `;
    paperList.append(item);
  }
}

function renderList(target, items, emptyText) {
  target.innerHTML = "";
  if (!items.length) {
    const li = document.createElement("li");
    li.textContent = emptyText;
    target.append(li);
    return;
  }
  for (const item of items) {
    const li = document.createElement("li");
    li.textContent = item;
    target.append(li);
  }
}

function renderMatchedRows(result) {
  const labels = result.matchedRows.map((id) => {
    const row = state.rules.heatmapRows.find((candidate) => candidate.id === id);
    return row?.label || id;
  });
  matchedRows.innerHTML = labels.map((label) => `<span>${label}</span>`).join("");
}

function renderSummary(input, result) {
  const required = result.statusSummary.required.map((layer) => layer.shortLabel).join(", ") || "none";
  const recommended = result.statusSummary.recommended.map((layer) => layer.shortLabel).join(", ") || "none";
  selectedStage.textContent = form.querySelector('[name="stage"]').selectedOptions[0].textContent.split(":")[0];
  querySummary.innerHTML = `
    <strong>Required:</strong> ${required}. <strong>Recommended:</strong> ${recommended}.
    This assessment matches ${result.matchedRows.length} condition row${result.matchedRows.length === 1 ? "" : "s"} from the framework.
  `;
  summaryMetrics.innerHTML = [
    [result.statusSummary.required.length, "Required", "metric-required"],
    [result.statusSummary.recommended.length, "Recommended", "metric-recommended"],
    [result.statusSummary.conditional.length, "Conditional", "metric-conditional"]
  ].map(([count, label, className]) => `<div class="summary-metric ${className}"><strong>${count}</strong><span>${label} layers</span></div>`).join("");
}

function runSelection() {
  const input = formInput();
  const result = evaluateSelection(input, state.rules);
  const papers = rankRelatedPapers(state.papers, input, result.layerResults, 12);
  state.result = {input, result, papers};
  renderSummary(input, result);
  renderMatchedRows(result);
  renderLayers(result);
  renderList(decisionList, result.decisions, "No specific operational decision was inferred.");
  renderList(warningList, result.warnings, "No major warning for this selection.");
  renderPapers(papers);
}

function downloadJson() {
  if (!state.result) return;
  const payload = JSON.stringify(state.result, null, 2);
  const blob = new Blob([payload], {type: "application/json"});
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "wellbore-model-selection-result.json";
  link.click();
  URL.revokeObjectURL(url);
}

async function init() {
  const [rulesResponse, papersResponse, geothermalResponse] = await Promise.all([
    fetch("./data/model-rules.json"),
    fetch("./data/papers.json"),
    fetch("./data/geothermal-papers.json")
  ]);
  state.rules = await rulesResponse.json();
  const basePapers = await papersResponse.json();
  const geothermalPapers = (await geothermalResponse.json()).map((paper) => ({...paper, classification: "Geothermal extension"}));
  state.papers = [...basePapers, ...geothermalPapers];
  form.addEventListener("change", runSelection);
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    runSelection();
  });
  document.querySelector("#show-all-layers").addEventListener("change", () => state.result && renderLayers(state.result.result));
  exportButton.addEventListener("click", downloadJson);
  resetButton.addEventListener("click", () => {
    form.reset();
    runSelection();
  });
  runSelection();
}

init().catch((error) => {
  document.querySelector("#app-error").textContent = `Could not load tool data: ${error.message}`;
});
