def test_health_endpoint(client):
    # The health endpoint should return a simple status message
    r = client.get("/health")
    assert r.status_code == 200, r.text
    assert r.json() == {"status": "ok"}
