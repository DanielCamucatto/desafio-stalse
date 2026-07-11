import json


def test_get_metrics_returns_file_contents(client, tmp_path, monkeypatch):
    metrics_path = tmp_path / "metrics.json"
    metrics_data = {
        "generated_at": "2024-01-01T00:00:00+00:00",
        "total_tickets": 1,
        "by_day": [{"date": "2024-01-01", "count": 1}],
        "top_categories": [{"category": "Technical issue", "count": 1}],
    }
    metrics_path.write_text(json.dumps(metrics_data), encoding="utf-8")
    monkeypatch.setenv("METRICS_PATH", str(metrics_path))

    response = client.get("/metrics")

    assert response.status_code == 200
    assert response.json() == metrics_data


def test_get_metrics_missing_file_returns_clear_error(client, tmp_path, monkeypatch):
    missing_path = tmp_path / "does_not_exist.json"
    monkeypatch.setenv("METRICS_PATH", str(missing_path))

    response = client.get("/metrics")

    assert response.status_code == 503
    assert "detail" in response.json()
