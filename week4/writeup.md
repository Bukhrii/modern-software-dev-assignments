# Week 4 Write-up
Tip: To preview this markdown file
- On Mac, press `Command (⌘) + Shift + V`
- On Windows/Linux, press `Ctrl + Shift + V`

## INSTRUCTIONS

Fill out all of the `TODO`s in this file.

## SUBMISSION DETAILS

Name: **TODO** \
SUNet ID: **TODO** \
Citations: **TODO**

This assignment took me about **TODO** hours to do. 


## YOUR RESPONSES
## How you used the automation to enhance the starter application
Using GitHub Copilot as the agent interface, I referenced the `CLAUDE.md` guidance and `tests.md` command to build a new `/health` route for the application using strict TDD.

1. **Prompting the Agent:** I prompted Copilot with: *"I want to add a `/health` endpoint to the FastAPI app. Please follow the instructions in #file:CLAUDE.md to do this using TDD. After generating the code, execute the workflow described in #file:tests.md."*
2. **Writing the Test First:** Constrained by `CLAUDE.md`, Copilot correctly generated a failing test (`test_health.py`) that expected a 200 status with `{"status":"ok"}`. 
3. **Execution & Failure:** It automatically triggered the test-runner workflow. As expected in TDD, the test initially failed with a `404 Not Found`.
4. **Implementation:** Copilot then wrote the actual endpoint logic in `main.py` to satisfy the failing test.
5. **Verification:** Finally, it re-ran the workflow defined in `tests.md` (which included formatting via `make format`, linting via `make lint`, and testing via `pytest` with `PYTHONPATH=.`). The execution returned a success message, confirming that the new endpoint passed all tests without breaking existing ones and complied with all formatting rules.