import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import {evaluateSelection} from '../src/decisionEngine.js';
const baseline=JSON.parse(await fs.readFile(new URL('./fixtures/model-rules-v0.1.5.json',import.meta.url),'utf8'));
const candidate=JSON.parse(await fs.readFile(new URL('../data/model-rules.json',import.meta.url),'utf8'));
assert.deepEqual(candidate.heatmapRows,baseline.heatmapRows);
assert.deepEqual(candidate.statusRank,baseline.statusRank);
let checked=0;
for(const stage of ['before','during','after','injection','maintenance'])for(const formation of ['sandstone','carbonate','shale','anisotropic','fractured','faulted','hydrate'])for(const pressureTemperature of ['normal','thermal','hpht'])for(const uncertainty of ['medium','high']) {
 const input={stage,formation,pressureTemperature,uncertainty,geometry:'vertical',mechanisms:[],dataAvailability:'medium',validationEvidence:'field',integrityConsequence:'medium',dataset:'none'};
 const a=evaluateSelection(input,baseline),b=evaluateSelection(input,candidate);
 assert.deepEqual(b.layerResults.map(x=>[x.id,x.status]),a.layerResults.map(x=>[x.id,x.status]));
 assert.equal(b.operatingLimit,null);assert.equal(b.recommendationStatus,'screening-guidance');checked++;
}
console.log(`${checked} category-regression scenarios passed; no predictive accuracy inferred.`);
