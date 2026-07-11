import sqlite3

CREATE_TICKETS_TABLE = """
CREATE TABLE IF NOT EXISTS tickets (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    created_at TEXT NOT NULL,
    customer_name TEXT NOT NULL,
    channel TEXT NOT NULL,
    subject TEXT NOT NULL,
    status TEXT NOT NULL,
    priority TEXT NOT NULL
)
"""


def get_connection(db_path: str) -> sqlite3.Connection:
    connection = sqlite3.connect(db_path)
    connection.row_factory = sqlite3.Row
    return connection


def create_tables(connection: sqlite3.Connection) -> None:
    connection.execute(CREATE_TICKETS_TABLE)
    connection.commit()
