import time


def test_create_list_and_patch_notes(client):
    payload = {"title": "Test", "content": "Hello world"}
    r = client.post("/notes/", json=payload)
    assert r.status_code == 201, r.text
    data = r.json()
    assert data["title"] == "Test"
    assert "created_at" in data and "updated_at" in data

    r = client.get("/notes/")
    assert r.status_code == 200
    items = r.json()
    assert len(items) >= 1

    r = client.get("/notes/", params={"q": "Hello", "limit": 10, "sort": "-created_at"})
    assert r.status_code == 200
    items = r.json()
    assert len(items) >= 1

    note_id = data["id"]
    r = client.patch(f"/notes/{note_id}", json={"title": "Updated"})
    assert r.status_code == 200
    patched = r.json()
    assert patched["title"] == "Updated"


def test_notes_list_pagination_and_sorting(client):
    # Create a few notes with slight delays so created_at values differ predictably
    payloads = [
        {"title": "Note 1", "content": "Content 1"},
        {"title": "Note 2", "content": "Content 2"},
        {"title": "Note 3", "content": "Content 3"},
    ]
    ids = []
    for payload in payloads:
        r = client.post("/notes/", json=payload)
        assert r.status_code == 201, r.text
        ids.append(r.json()["id"])
        time.sleep(0.01)

    # Ensure pagination works (skip + limit) with ascending sort
    r = client.get("/notes/", params={"sort": "created_at", "skip": 1, "limit": 2})
    assert r.status_code == 200
    items = r.json()
    assert len(items) == 2
    assert items[0]["id"] == ids[1]
    assert items[1]["id"] == ids[2]

    # Ensure sorting by created_at ascending returns the oldest first
    r = client.get("/notes/", params={"sort": "created_at"})
    assert r.status_code == 200
    items = r.json()
    assert len(items) >= 3
    assert items[0]["id"] == ids[0]
    assert items[1]["id"] == ids[1]
    assert items[2]["id"] == ids[2]

    # Ensure sorting by created_at descending returns the newest first
    r = client.get("/notes/", params={"sort": "-created_at"})
    assert r.status_code == 200
    items = r.json()
    assert len(items) >= 3
    assert items[0]["id"] == ids[2]
    assert items[1]["id"] == ids[1]
    assert items[2]["id"] == ids[0]


