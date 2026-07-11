import json
import os
from contextlib import asynccontextmanager
from pathlib import Path
from typing import Literal, Optional

from dotenv import load_dotenv
from fastapi import Depends, FastAPI, HTTPException
from pydantic import BaseModel

from app import db, repository, webhook

BASE_DIR = Path(__file__).resolve().parent.parent
SEEDS_PATH = BASE_DIR / "seeds" / "tickets.json"
DEFAULT_METRICS_PATH = BASE_DIR.parent / "data" / "processed" / "metrics.json"

load_dotenv(BASE_DIR / ".env")


def get_db_path() -> str:
    return os.environ.get("DB_PATH", str(BASE_DIR / "db.sqlite"))


def get_metrics_path() -> Path:
    return Path(os.environ.get("METRICS_PATH", str(DEFAULT_METRICS_PATH)))


def get_db():
    connection = db.get_connection(get_db_path())
    try:
        yield connection
    finally:
        connection.close()


class TicketOut(BaseModel):
    id: int
    created_at: str
    customer_name: str
    channel: str
    subject: str
    status: str
    priority: str


class TicketPatch(BaseModel):
    status: Optional[Literal["open", "in_progress", "closed"]] = None
    priority: Optional[Literal["low", "medium", "high"]] = None


@asynccontextmanager
async def lifespan(app: FastAPI):
    connection = db.get_connection(get_db_path())
    try:
        db.create_tables(connection)
        if not repository.list_tickets(connection):
            repository.seed_from_json(connection, str(SEEDS_PATH))
    finally:
        connection.close()
    yield


app = FastAPI(title="Mini Inbox API", lifespan=lifespan)


@app.get("/tickets", response_model=list[TicketOut])
def get_tickets(connection=Depends(get_db)):
    return repository.list_tickets(connection)


@app.patch("/tickets/{ticket_id}", response_model=TicketOut)
def patch_ticket(ticket_id: int, patch: TicketPatch, connection=Depends(get_db)):
    fields = patch.model_dump(exclude_unset=True)
    try:
        updated = repository.update_ticket(connection, ticket_id, **fields)
    except repository.TicketNotFoundError:
        raise HTTPException(status_code=404, detail="Ticket not found")

    if updated["status"] == "closed" or updated["priority"] == "high":
        webhook.notify_ticket_event(updated)

    return updated


@app.get("/metrics")
def get_metrics():
    metrics_path = get_metrics_path()
    if not metrics_path.exists():
        raise HTTPException(
            status_code=503,
            detail=(
                "Metrics not generated yet. Run the ETL pipeline first: "
                "python data/etl.py"
            ),
        )
    return json.loads(metrics_path.read_text(encoding="utf-8"))
