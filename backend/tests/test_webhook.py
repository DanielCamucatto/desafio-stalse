from unittest.mock import patch

import httpx


def test_patch_to_closed_triggers_webhook(client, monkeypatch):
    monkeypatch.setenv("N8N_WEBHOOK_URL", "http://n8n.local/webhook/test")

    with patch("app.webhook.httpx.post") as mock_post:
        response = client.patch("/tickets/1", json={"status": "closed"})

    assert response.status_code == 200
    mock_post.assert_called_once()
    args, kwargs = mock_post.call_args
    assert args[0] == "http://n8n.local/webhook/test"
    assert kwargs["json"]["ticket_id"] == 1
    assert kwargs["json"]["status"] == "closed"


def test_patch_to_priority_high_triggers_webhook(client, monkeypatch):
    monkeypatch.setenv("N8N_WEBHOOK_URL", "http://n8n.local/webhook/test")

    with patch("app.webhook.httpx.post") as mock_post:
        response = client.patch("/tickets/2", json={"priority": "high"})

    assert response.status_code == 200
    mock_post.assert_called_once()
    _, kwargs = mock_post.call_args
    assert kwargs["json"]["priority"] == "high"


def test_patch_without_trigger_condition_does_not_call_webhook(client, monkeypatch):
    monkeypatch.setenv("N8N_WEBHOOK_URL", "http://n8n.local/webhook/test")

    with patch("app.webhook.httpx.post") as mock_post:
        response = client.patch("/tickets/3", json={"status": "in_progress"})

    assert response.status_code == 200
    mock_post.assert_not_called()


def test_webhook_failure_does_not_break_patch_response(client, monkeypatch):
    monkeypatch.setenv("N8N_WEBHOOK_URL", "http://n8n.local/webhook/test")

    with patch("app.webhook.httpx.post", side_effect=httpx.ConnectError("boom")):
        response = client.patch("/tickets/4", json={"status": "closed"})

    assert response.status_code == 200
    assert response.json()["status"] == "closed"
