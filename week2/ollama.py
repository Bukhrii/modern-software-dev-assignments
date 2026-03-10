"""Stub module to satisfy imports during testing and development.

The real `ollama` package is not installed in the test environment.  Tests
monkeypatch the `chat` function as needed, so the stub just provides a
placeholder that raises if accidentally used.
"""

def chat(*args, **kwargs):
    raise RuntimeError("ollama.chat called without being mocked")
