import pytest
from fastapi.testclient import TestClient

TICKET_FIELDS = {
    "id",
    "created_at",
    "customer_name",
    "channel",
    "subject",
    "status",
    "priority",
}


@pytest.fixture
def client(tmp_path, monkeypatch):
    db_path = tmp_path / "test.db"
    monkeypatch.setenv("DB_PATH", str(db_path))

    from app.main import app

    with TestClient(app) as test_client:
        yield test_client


def test_get_tickets_returns_seeded_list(client):
    response = client.get("/tickets")

    assert response.status_code == 200
    data = response.json()
    assert len(data) == 20
    assert set(data[0].keys()) == TICKET_FIELDS


def test_patch_ticket_updates_status(client):
    response = client.patch("/tickets/1", json={"status": "closed"})

    assert response.status_code == 200
    assert response.json()["status"] == "closed"


def test_patch_ticket_updates_priority(client):
    response = client.patch("/tickets/1", json={"priority": "high"})

    assert response.status_code == 200
    assert response.json()["priority"] == "high"


def test_patch_ticket_invalid_field_returns_422(client):
    response = client.patch("/tickets/1", json={"status": "not_a_status"})

    assert response.status_code == 422


def test_patch_ticket_not_found_returns_404(client):
    response = client.patch("/tickets/9999", json={"status": "closed"})

    assert response.status_code == 404
