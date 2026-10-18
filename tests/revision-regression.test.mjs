import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import {evaluateSelection} from '../src/decisionEngine.js';
import {evaluateSelection as evaluateBaseline} from './fixtures/decision-engine-v0.1.5.mjs';
const baseline=JSON.parse(await fs.readFile(new URL('./fixtures/model-rules-v0.1.5.json',import.meta.url),'utf8'));
const candidate=JSON.parse(await fs.readFile(new URL('../data/model-rules.json',import.meta.url),'utf8'));
assert.deepEqual(candidate.statusRank,baseline.statusRank);
let checked=0,changed=0;
for(const stage of ['before','during','after','injection','maintenance'])for(const formation of ['sandstone','carbonate','shale','anisotropic','fractured','faulted','hydrate'])for(const pressureTemperature of ['normal','thermal','hpht'])for(const uncertainty of ['medium','high']) {
 const input={stage,formation,pressureTemperature,uncertainty,geometry:'vertical',mechanisms:[],dataAvailability:'medium',validationEvidence:'field',integrityConsequence:'medium',dataset:'none'};
 const a=evaluateBaseline(input,baseline),b=evaluateSelection(input,candidate);
 for (const old of a.layerResults) {
  const now=b.layerResults.find(x=>x.id===old.id);
  if(now.status!==old.status) {
   assert.equal(old.id,'mem'); assert.equal(old.status,'R'); assert.equal(now.status,'Rec');
   assert.ok(a.matchedRows.includes('post_drill_validation'));changed++;
  }
 }
 assert.equal(b.operatingLimit,null);assert.equal(b.recommendationStatus,'screening-guidance');checked++;
}
console.log(`${checked} legacy-input scenarios checked; ${changed} documented MEM downgrades; no predictive accuracy inferred.`);
