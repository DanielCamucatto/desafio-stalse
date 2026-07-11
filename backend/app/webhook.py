import os

import httpx


def get_webhook_url() -> str | None:
    return os.environ.get("N8N_WEBHOOK_URL")


def notify_ticket_event(ticket: dict) -> None:
    webhook_url = get_webhook_url()
    if not webhook_url:
        return

    payload = {
        "event": "ticket_updated",
        "ticket_id": ticket["id"],
        "status": ticket["status"],
        "priority": ticket["priority"],
    }
    try:
        httpx.post(webhook_url, json=payload, timeout=5)
    except httpx.HTTPError:
        pass
