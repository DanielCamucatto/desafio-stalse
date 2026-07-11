import json
from pathlib import Path

import pandas as pd
import pytest

import etl

FIXTURE_CSV = Path(__file__).resolve().parent / "fixtures" / "sample.csv"


@pytest.fixture
def raw_df():
    return etl.load_dataset(FIXTURE_CSV)


def test_load_dataset_reads_all_rows(raw_df):
    assert len(raw_df) == 8


def test_parse_dates_drops_invalid_and_converts_dtype(raw_df):
    parsed = etl.parse_dates(raw_df)

    assert len(parsed) == 7
    assert pd.api.types.is_datetime64_any_dtype(parsed[etl.DATE_COLUMN])


def test_compute_daily_counts(raw_df):
    parsed = etl.parse_dates(raw_df)

    daily = etl.compute_daily_counts(parsed)

    assert daily == [
        {"date": "2024-01-01", "count": 2},
        {"date": "2024-01-02", "count": 3},
        {"date": "2024-01-03", "count": 2},
    ]


def test_compute_top_categories(raw_df):
    parsed = etl.parse_dates(raw_df)

    top = etl.compute_top_categories(parsed, limit=2)

    assert top[0] == {"category": "Technical issue", "count": 4}
    assert len(top) == 2


def test_save_metrics_writes_expected_json_shape(tmp_path):
    metrics = {
        "generated_at": "2024-01-01T00:00:00+00:00",
        "total_tickets": 7,
        "by_day": [{"date": "2024-01-01", "count": 2}],
        "top_categories": [{"category": "Technical issue", "count": 4}],
    }
    output_path = tmp_path / "metrics.json"

    etl.save_metrics(metrics, output_path)

    saved = json.loads(output_path.read_text(encoding="utf-8"))
    assert saved == metrics


def test_run_end_to_end_generates_metrics_file(tmp_path):
    output_path = tmp_path / "metrics.json"

    metrics = etl.run(csv_path=FIXTURE_CSV, output_path=output_path)

    assert metrics["total_tickets"] == 7
    assert metrics["by_day"][0] == {"date": "2024-01-01", "count": 2}
    assert output_path.exists()
