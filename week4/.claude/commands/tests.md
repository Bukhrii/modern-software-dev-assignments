# Command: /test-runner
**Intent:** Run the test suite using pytest, check for formatting errors, and summarize failures.
**Inputs:** Optional file path to specific test file (e.g., `backend/tests/test_api.py`). If no input is provided, run all tests.

## Steps
1. Execute `make format` to ensure code meets Black formatting standards.
2. Execute `make lint` to check for Ruff violations. Fix any automatic violations.
3. Execute `PYTHONPATH=. pytest -q backend/tests --maxfail=1 -x` (or target the specific test file provided in inputs with PYTHONPATH=.).
4. If tests pass, output: "✅ All tests passed. Code is formatted and linted."
5. If tests fail, analyze the error output, summarize the exact failure reason, and suggest the exact lines of code to fix in the backend implementation.