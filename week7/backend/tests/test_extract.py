from backend.app.services.extract import extract_action_items


def test_extract_action_items():
    text = """
    This is a note
    - TODO: write tests
    - ACTION: review PR
    - TASK: fix bug
    - FIXME: update docs
    - [ ] clean code
    - [x] deploy app
    Not actionable
    """.strip()
    items = extract_action_items(text)
    assert "write tests" in items
    assert "review PR" in items
    assert "fix bug" in items
    assert "update docs" in items
    assert "clean code" in items
    assert "deploy app" in items


