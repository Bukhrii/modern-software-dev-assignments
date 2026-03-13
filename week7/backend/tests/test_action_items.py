import time


def test_create_complete_list_and_patch_action_item(client):
    payload = {"description": "Ship it"}
    r = client.post("/action-items/", json=payload)
    assert r.status_code == 201, r.text
    item = r.json()
    assert item["completed"] is False
    assert "created_at" in item and "updated_at" in item

    r = client.put(f"/action-items/{item['id']}/complete")
    assert r.status_code == 200
    done = r.json()
    assert done["completed"] is True

    r = client.get("/action-items/", params={"completed": True, "limit": 5, "sort": "-created_at"})
    assert r.status_code == 200
    items = r.json()
    assert len(items) >= 1

    r = client.patch(f"/action-items/{item['id']}", json={"description": "Updated"})
    assert r.status_code == 200
    patched = r.json()
    assert patched["description"] == "Updated"


def test_action_items_list_pagination_and_sorting(client):
    # Create a few action items with slight delays so created_at values differ predictably
    payloads = [
        {"description": "Item 1"},
        {"description": "Item 2"},
        {"description": "Item 3"},
    ]
    ids = []
    for payload in payloads:
        r = client.post("/action-items/", json=payload)
        assert r.status_code == 201, r.text
        ids.append(r.json()["id"])
        time.sleep(0.01)

    # Ensure pagination works (skip + limit) with ascending sort
    r = client.get("/action-items/", params={"sort": "created_at", "skip": 1, "limit": 2})
    assert r.status_code == 200
    items = r.json()
    assert len(items) == 2
    assert items[0]["id"] == ids[1]
    assert items[1]["id"] == ids[2]

    # Ensure sorting by created_at ascending returns the oldest first
    r = client.get("/action-items/", params={"sort": "created_at"})
    assert r.status_code == 200
    items = r.json()
    assert len(items) >= 3
    assert items[0]["id"] == ids[0]
    assert items[1]["id"] == ids[1]
    assert items[2]["id"] == ids[2]

    # Ensure sorting by created_at descending returns the newest first
    r = client.get("/action-items/", params={"sort": "-created_at"})
    assert r.status_code == 200
    items = r.json()
    assert len(items) >= 3
    assert items[0]["id"] == ids[2]
    assert items[1]["id"] == ids[1]
    assert items[2]["id"] == ids[0]


