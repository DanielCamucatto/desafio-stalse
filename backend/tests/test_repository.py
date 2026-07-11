import json
from pathlib import Path

import pytest

from app import db, repository

SEEDS_PATH = Path(__file__).resolve().parent.parent / "seeds" / "tickets.json"


@pytest.fixture
def conn(tmp_path):
    db_path = tmp_path / "test.db"
    connection = db.get_connection(str(db_path))
    db.create_tables(connection)
    yield connection
    connection.close()


def _write_seed(tmp_path, tickets):
    seed_file = tmp_path / "seed.json"
    seed_file.write_text(json.dumps(tickets))
    return str(seed_file)


SAMPLE_TICKET = {
    "created_at": "2024-01-01T10:00:00",
    "customer_name": "Alice",
    "channel": "email",
    "subject": "Problema no login",
    "status": "open",
    "priority": "low",
}


def test_create_tables_creates_tickets_table(conn):
    cursor = conn.execute(
        "SELECT name FROM sqlite_master WHERE type='table' AND name='tickets'"
    )
    assert cursor.fetchone() is not None


def test_seed_tickets_inserts_from_json(conn, tmp_path):
    seed_path = _write_seed(tmp_path, [SAMPLE_TICKET, {**SAMPLE_TICKET, "customer_name": "Bob"}])

    repository.seed_from_json(conn, seed_path)

    assert len(repository.list_tickets(conn)) == 2


def test_list_tickets_returns_all(conn, tmp_path):
    seed_path = _write_seed(tmp_path, [SAMPLE_TICKET])

    repository.seed_from_json(conn, seed_path)
    tickets = repository.list_tickets(conn)

    assert tickets[0]["customer_name"] == "Alice"
    assert set(tickets[0].keys()) == {
        "id",
        "created_at",
        "customer_name",
        "channel",
        "subject",
        "status",
        "priority",
    }


def test_get_ticket_by_id_found(conn, tmp_path):
    seed_path = _write_seed(tmp_path, [SAMPLE_TICKET])
    repository.seed_from_json(conn, seed_path)

    ticket = repository.get_ticket(conn, 1)

    assert ticket["customer_name"] == "Alice"


def test_get_ticket_by_id_not_found(conn):
    assert repository.get_ticket(conn, 999) is None


def test_update_ticket_status(conn, tmp_path):
    seed_path = _write_seed(tmp_path, [SAMPLE_TICKET])
    repository.seed_from_json(conn, seed_path)

    updated = repository.update_ticket(conn, 1, status="closed")

    assert updated["status"] == "closed"
    assert updated["priority"] == "low"


def test_update_ticket_priority(conn, tmp_path):
    seed_path = _write_seed(tmp_path, [SAMPLE_TICKET])
    repository.seed_from_json(conn, seed_path)

    updated = repository.update_ticket(conn, 1, priority="high")

    assert updated["priority"] == "high"
    assert updated["status"] == "open"


def test_update_ticket_invalid_id_raises(conn):
    with pytest.raises(repository.TicketNotFoundError):
        repository.update_ticket(conn, 999, status="closed")


def test_real_seed_file_loads_around_20_tickets(conn):
    repository.seed_from_json(conn, str(SEEDS_PATH))

    tickets = repository.list_tickets(conn)

    assert len(tickets) >= 20
    for ticket in tickets:
        assert ticket["status"] in {"open", "in_progress", "closed"}
        assert ticket["priority"] in {"low", "medium", "high"}
