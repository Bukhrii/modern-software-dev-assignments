from backend.app.services.extract import extract_action_items


def test_extract_action_items():
    text = """
    This is a note
    - TODO: write tests
    - ACTION: review PR
    - TASK: update docs
    - BUG: fix login
    - FIXME: refactor code
    - [ ] Implement feature
    * [ ] Test feature
    - Ship it!
    Not actionable
    """.strip()
    items = extract_action_items(text)
    assert "write tests" in items
    assert "review PR" in items
    assert "update docs" in items
    assert "fix login" in items
    assert "refactor code" in items
    assert "Implement feature" in items
    assert "Test feature" in items
    assert "Ship it" in items


