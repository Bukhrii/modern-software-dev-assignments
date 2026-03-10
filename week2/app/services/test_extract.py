import pytest
import sys
import os

# ensure the repository root is on sys.path so that `import app` works no matter
# which directory pytest uses as the current working directory when collecting
# this test module
root = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
if root not in sys.path:
    sys.path.insert(0, root)

from app.services.extract import extract_action_items_llm




from unittest.mock import patch, Mock


def test_extract_action_items_llm_bulleted_list():
    """A simple bulleted list should be returned verbatim by the mocked LLM."""
    text = "- Task one\n- Task two"
    mock_chat = Mock(return_value={"message": {"content": '["Task one", "Task two"]'}})

    with patch("app.services.extract.chat", mock_chat):
        result = extract_action_items_llm(text)

    # verify spi output
    assert isinstance(result, list)
    assert all(isinstance(item, str) for item in result)
    assert result == ["Task one", "Task two"]

    # ensure the original text made it into the prompt
    sent_content = mock_chat.call_args[1]["messages"][0]["content"]
    assert text in sent_content


def test_extract_action_items_llm_keyword_prefixes():
    """Tasks prefixed with keywords should still be handled by the LLM."""
    text = (
        "Here is some background text.\n"
        "TODO: Finish the report by Friday.\n"
        "Action: Review the PR.\n"
        "Next: Kick off the deployment."
    )

    mock_chat = Mock(return_value={
        "message": {
            "content": '["Finish the report by Friday", "Review the PR", "Kick off the deployment"]'
        }
    })

    with patch("app.services.extract.chat", mock_chat):
        result = extract_action_items_llm(text)

    assert isinstance(result, list)
    assert all(isinstance(item, str) for item in result)
    assert result == [
        "Finish the report by Friday",
        "Review the PR",
        "Kick off the deployment",
    ]


def test_extract_action_items_llm_empty_string():
    """An empty input should produce an empty list and not crash."""
    mock_chat = Mock(return_value={"message": {"content": '[]'}})
    with patch("app.services.extract.chat", mock_chat):
        result = extract_action_items_llm("")

    assert result == []
    assert isinstance(result, list)


def test_extract_action_items_llm_no_action_items():
    """Text with no actionable content should still return an empty list."""
    text = "Just a normal paragraph. There are no todos or bullets here."
    mock_chat = Mock(return_value={"message": {"content": '[]'}})
    with patch("app.services.extract.chat", mock_chat):
        result = extract_action_items_llm(text)

    assert result == []
    assert isinstance(result, list)
