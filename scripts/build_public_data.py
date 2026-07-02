from __future__ import annotations

import csv
import json
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]
APP_ROOT = Path(__file__).resolve().parents[1]
OLD_RECORDS = ROOT / "work" / "review_workflow_records.csv"
NEW_RECORDS = ROOT / "outputs" / "v12_new_papers_records.json"
OUT = APP_ROOT / "data" / "papers.json"


def clean(value):
    if value is None:
        return ""
    return str(value).strip()


def doi_url(doi):
    value = clean(doi)
    if not value:
        return ""
    value = value.replace("https://doi.org/", "").replace("http://doi.org/", "")
    return f"https://doi.org/{value}"


def old_record(row):
    return {
        "id": clean(row.get("paper_id")),
        "title": clean(row.get("paper_title")),
        "authors": clean(row.get("authors")),
        "year": clean(row.get("publication_year")),
        "venue": clean(row.get("journal_conference")),
        "doi": clean(row.get("doi")),
        "doiUrl": doi_url(row.get("doi")),
        "classification": clean(row.get("screening_classification")),
        "stage": clean(row.get("operational_stage")),
        "theme": clean(row.get("technical_theme")),
        "modelType": clean(row.get("model_type")),
        "failureCriterion": clean(row.get("failure_criterion")),
        "formation": clean(row.get("formation_rock_type")),
        "wellType": clean(row.get("well_type")),
        "coupling": clean(row.get("coupling_considered")),
        "validation": clean(row.get("validation_type")),
        "validationStrength": "",
        "confidenceScore": "",
        "citations": "",
        "keyContribution": clean(row.get("key_contribution")),
        "limitation": clean(row.get("main_limitation")),
        "relevance": clean(row.get("relevance_to_review")),
        "recommendedUse": "",
        "avoidUse": "",
        "source": "Integrated review matrix"
    }


def new_record(row):
    return {
        "id": clean(row.get("paper_id")),
        "title": clean(row.get("title")),
        "authors": clean(row.get("authors")),
        "year": clean(row.get("year")),
        "venue": clean(row.get("journal")),
        "doi": clean(row.get("doi")),
        "doiUrl": doi_url(row.get("doi")),
        "classification": clean(row.get("screening")),
        "stage": clean(row.get("operational_stage")),
        "theme": clean(row.get("technical_theme")),
        "modelType": clean(row.get("model_type")),
        "failureCriterion": clean(row.get("failure_criterion")),
        "formation": clean(row.get("formation_rock_type")),
        "wellType": clean(row.get("well_type")),
        "coupling": clean(row.get("coupling_considered")),
        "validation": clean(row.get("validation_type")),
        "validationStrength": clean(row.get("validation_strength")),
        "confidenceScore": clean(row.get("confidence_score") or row.get("total_score")),
        "citations": clean(row.get("citations")),
        "keyContribution": clean(row.get("key_contribution")),
        "limitation": clean(row.get("main_limitation")),
        "relevance": clean(row.get("relevance_to_review")),
        "recommendedUse": clean(row.get("recommended_use_case")),
        "avoidUse": clean(row.get("avoid_use_case")),
        "source": "Integrated review matrix"
    }


def main():
    records = []
    with OLD_RECORDS.open("r", encoding="utf-8-sig", newline="") as f:
        records.extend(old_record(row) for row in csv.DictReader(f))

    with NEW_RECORDS.open("r", encoding="utf-8") as f:
        records.extend(new_record(row) for row in json.load(f))

    seen = set()
    unique = []
    for record in records:
        key = record["id"] or record["doi"] or record["title"].lower()
        if key in seen:
            continue
        seen.add(key)
        unique.append(record)

    unique.sort(key=lambda row: (row["id"], row["year"], row["title"]))
    OUT.write_text(json.dumps(unique, indent=2, ensure_ascii=False), encoding="utf-8")
    print(f"Wrote {len(unique)} public records to {OUT}")


if __name__ == "__main__":
    main()
