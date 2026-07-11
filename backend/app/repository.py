import json
import sqlite3

TICKET_FIELDS = (
    "id",
    "created_at",
    "customer_name",
    "channel",
    "subject",
    "status",
    "priority",
)

UPDATABLE_FIELDS = ("status", "priority")


class TicketNotFoundError(Exception):
    pass


def _row_to_dict(row: sqlite3.Row) -> dict:
    return {field: row[field] for field in TICKET_FIELDS}


def seed_from_json(connection: sqlite3.Connection, seed_path: str) -> None:
    with open(seed_path, encoding="utf-8") as f:
        tickets = json.load(f)

    connection.executemany(
        """
        INSERT INTO tickets (created_at, customer_name, channel, subject, status, priority)
        VALUES (:created_at, :customer_name, :channel, :subject, :status, :priority)
        """,
        tickets,
    )
    connection.commit()


def list_tickets(connection: sqlite3.Connection) -> list[dict]:
    rows = connection.execute("SELECT * FROM tickets ORDER BY id").fetchall()
    return [_row_to_dict(row) for row in rows]


def get_ticket(connection: sqlite3.Connection, ticket_id: int) -> dict | None:
    row = connection.execute(
        "SELECT * FROM tickets WHERE id = ?", (ticket_id,)
    ).fetchone()
    return _row_to_dict(row) if row else None


def update_ticket(connection: sqlite3.Connection, ticket_id: int, **fields) -> dict:
    updates = {key: value for key, value in fields.items() if key in UPDATABLE_FIELDS}
    if not updates:
        ticket = get_ticket(connection, ticket_id)
        if ticket is None:
            raise TicketNotFoundError(f"Ticket {ticket_id} not found")
        return ticket

    set_clause = ", ".join(f"{field} = :{field}" for field in updates)
    cursor = connection.execute(
        f"UPDATE tickets SET {set_clause} WHERE id = :id",
        {**updates, "id": ticket_id},
    )
    connection.commit()

    if cursor.rowcount == 0:
        raise TicketNotFoundError(f"Ticket {ticket_id} not found")

    return get_ticket(connection, ticket_id)
