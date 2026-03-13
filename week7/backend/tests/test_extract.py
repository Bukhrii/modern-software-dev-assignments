from backend.app.services.extract import extract_action_items


def test_extract_action_items():
    text = """
    - TODO: write tests
    - ACTION: review PR
    - TASK: deploy app
    - FIXME: fix bug
    - [ ] buy milk
    - [x] call mom
    Not actionable
    """.strip()
    items = extract_action_items(text)
    assert "write tests" in items
    assert "review PR" in items
    assert "deploy app" in items
    assert "fix bug" in items
    assert "buy milk" in items
    assert "call mom" in items


