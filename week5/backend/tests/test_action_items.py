def test_create_and_complete_action_item(client):
    payload = {"description": "Ship it"}
    r = client.post("/action-items/", json=payload)
    assert r.status_code == 201, r.text
    item = r.json()
    assert item["completed"] is False

    r = client.put(f"/action-items/{item['id']}/complete")
    assert r.status_code == 200
    done = r.json()
    assert done["completed"] is True

    r = client.get("/action-items/")
    assert r.status_code == 200
    body = r.json()
    assert "items" in body
    assert "total" in body
    assert body["total"] == 1
    assert len(body["items"]) == 1


def test_action_items_pagination_empty_page(client):
    """Requesting a page beyond available data returns empty items but correct total."""
    client.post("/action-items/", json={"description": "task"})
    r = client.get("/action-items/", params={"page": 999, "page_size": 10})
    assert r.status_code == 200
    body = r.json()
    assert body["items"] == []
    assert body["total"] >= 1


def test_action_items_pagination_large_page_size(client):
    """A page_size larger than total items returns all items on page 1."""
    for i in range(3):
        client.post("/action-items/", json={"description": f"task {i}"})
    r = client.get("/action-items/", params={"page": 1, "page_size": 100})
    assert r.status_code == 200
    body = r.json()
    assert body["total"] == 3
    assert len(body["items"]) == 3


def test_action_items_pagination_page_size(client):
    """Verify pagination splits results correctly."""
    for i in range(5):
        client.post("/action-items/", json={"description": f"task {i}"})
    r = client.get("/action-items/", params={"page": 1, "page_size": 2})
    body = r.json()
    assert len(body["items"]) == 2
    assert body["total"] == 5

    r = client.get("/action-items/", params={"page": 3, "page_size": 2})
    body = r.json()
    assert len(body["items"]) == 1
