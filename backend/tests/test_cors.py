def test_cors_allows_cross_origin_requests(client):
    response = client.get("/tickets", headers={"Origin": "http://localhost:3000"})

    assert response.headers.get("access-control-allow-origin") == "*"


def test_cors_allows_patch_preflight(client):
    response = client.options(
        "/tickets/1",
        headers={
            "Origin": "http://localhost:3000",
            "Access-Control-Request-Method": "PATCH",
        },
    )

    assert response.status_code == 200
    assert response.headers.get("access-control-allow-origin") == "*"
