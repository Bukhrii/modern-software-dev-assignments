def test_create_and_list_notes(client):
    payload = {"title": "Test", "content": "Hello world"}
    r = client.post("/notes/", json=payload)
    assert r.status_code == 201, r.text
    data = r.json()
    assert data["title"] == "Test"

    r = client.get("/notes/")
    assert r.status_code == 200
    body = r.json()
    assert "items" in body
    assert "total" in body
    assert body["total"] >= 1
    assert len(body["items"]) >= 1

    r = client.get("/notes/search/")
    assert r.status_code == 200

    r = client.get("/notes/search/", params={"q": "Hello"})
    assert r.status_code == 200
    items = r.json()
    assert len(items) >= 1


def test_notes_pagination_empty_page(client):
    """Requesting a page beyond available data returns empty items but correct total."""
    client.post("/notes/", json={"title": "A", "content": "a"})
    r = client.get("/notes/", params={"page": 999, "page_size": 10})
    assert r.status_code == 200
    body = r.json()
    assert body["items"] == []
    assert body["total"] >= 1


def test_notes_pagination_large_page_size(client):
    """A page_size larger than total items returns all items on page 1."""
    for i in range(3):
        client.post("/notes/", json={"title": f"N{i}", "content": f"c{i}"})
    r = client.get("/notes/", params={"page": 1, "page_size": 100})
    assert r.status_code == 200
    body = r.json()
    assert body["total"] == 3
    assert len(body["items"]) == 3


def test_notes_pagination_page_size(client):
    """Verify pagination splits results correctly."""
    for i in range(5):
        client.post("/notes/", json={"title": f"N{i}", "content": f"c{i}"})
    r = client.get("/notes/", params={"page": 1, "page_size": 2})
    body = r.json()
    assert len(body["items"]) == 2
    assert body["total"] == 5

    r = client.get("/notes/", params={"page": 3, "page_size": 2})
    body = r.json()
    assert len(body["items"]) == 1
