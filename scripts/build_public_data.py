"""Build public metadata from an explicitly supplied consolidated S1 dataset.

The source JSON is not committed: only bibliographic metadata and bounded
paraphrases are exported. Audit records, source text, local paths and attribution
fields are deliberately omitted.
"""
from pathlib import Path
from collections import Counter
import argparse,json,re
ROOT=Path(__file__).resolve().parents[1]
def text(v):return str(v or '').strip()
def url(v):return text(v) if text(v).startswith(('https://','http://')) else ''
def make(r):
 doi=text(r.get('DOI')).replace('https://doi.org/','')
 if not re.match(r'^10\.\d{4,9}/\S+$',doi):doi=''
 grade=r.get('Historical grade') if r.get('Historical grade') in ['Core','Useful'] else 'Included'
 return dict(id=r['Paper ID'],title=r['Title'],authors=text(r.get('Authors')),year=text(r.get('Year')),venue=text(r.get('Venue')),doi=doi,doiUrl='https://doi.org/'+doi if doi else '',url=url(r.get('Source URL')),classification=grade,stage=r['Operational Stage'],secondaryStages=text(r.get('Secondary lifecycle tags')),theme=text(r.get('Technical Theme')),modelType=text(r.get('Prior model-type coding')),failureCriterion=text(r.get('Failure Criterion')),formation=text(r.get('Formation / Rock Type')),wellType=text(r.get('Well Type')),coupling=text(r.get('Coupling Considered')),validation=text(r.get('Calibration versus test')),validationStrength='',confidenceScore='',citations='',keyContribution=text(r.get('Assessment Rationale')),limitation=text(r.get('Transferability limit')),relevance=text(r.get('Assessment Rationale'))+' Evidence limit: '+text(r.get('Transferability limit')),recommendedUse=text(r.get('Recommended Use Case')),avoidUse=text(r.get('Avoid Use Case')),source='S1 consolidated evidence matrix',reviewExtent=text(r.get('Source review extent')),sourceLocator=text(r.get('Source locator')),publicationStatus=text(r.get('Publication status')),synthesisMember=True)

def main():
    p=argparse.ArgumentParser(description=__doc__)
    p.add_argument('--source',type=Path,required=True,help='Reproducibility/dataset.json from the current S1 package')
    p.add_argument('--snapshot-date',required=True,help='Date of the supplied evidence snapshot, YYYY-MM-DD')
    p.add_argument('--check',action='store_true')
    args=p.parse_args()
    source=json.loads(args.source.read_text(encoding='utf8'))
    records=[make(r) for r in source['records']]
    ids=[r['id'] for r in records]
    if len(ids)!=len(set(ids)):raise ValueError('Duplicate stable IDs in source dataset')
    counts=dict(Counter(r['stage'] for r in records))
    if counts!=source['counts']['primary_stages']:raise ValueError('Source stage counts do not reconcile')
    snapshot={'version':args.snapshot_date,'synthesisRecords':len(records),'primaryStages':counts,'ids':ids,'scope':'S1 synthesis membership; source records are not independent experiments','reviewType':'Structured critical review; exhaustive screening and independent duplicate assessment are not claimed'}
    outputs={'papers.json':[r for r in records if not r['id'].startswith('GEO-')],'geothermal-papers.json':[r for r in records if r['id'].startswith('GEO-')],'evidence-corpus.json':snapshot}
    for name,value in outputs.items():
        target=ROOT/'data'/name
        if args.check:
            if json.loads(target.read_text(encoding='utf8'))!=value:raise ValueError('Outdated public metadata: '+name)
        else:target.write_text(json.dumps(value,ensure_ascii=False,indent=2)+'\n',encoding='utf8')
    print(f'{len(records)} source records reconcile with the supplied S1 dataset')
if __name__=='__main__':main()
