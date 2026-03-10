# Week 5: Agentic Development with Warp

## 1. Warp Drive Automation: "Test Runner & Fixer"
**Design:**
- **Goal:** To automate the tedious process of running tests, analyzing tracebacks, and applying fixes.
- **Inputs:** Terminal output from the `make test` command.
- **Outputs:** Autonomous code modifications to the `week5/` directory and a verified "All tests passed" state.
- **Steps:** The prompt is saved as a Warp Drive workflow. It instructs the agent to run `make test`. If it passes, it terminates. If it fails, the agent reads the error logs, locates the faulty source code or test file, applies the fix, and recursively runs `make test` until success is achieved.

**Before vs. After:**
- **Before (Manual):** I had to manually run `make test`, scroll through terminal logs to find the exact line causing the failure, switch contexts to the editor, fix the code, and run the tests again.
- **After (Automated):** The Warp Agent acts as an autonomous testing loop. It executes the tests, parses its own errors, and fixes the code contextually within seconds without me leaving the terminal.

**Autonomy Level:**
- **Supervised Autonomy:** I granted the agent permissions to read the filesystem and suggest edits. However, I maintained supervision by requiring explicit clicks on "Run" or "Approve" for every terminal command or file modification. This ensures the agent strictly stays within the `week5/` scope and does not execute destructive system commands.

## 2. Multi-Agent Workflow: Concurrent Task Execution
**Design & Roles:**
- **Goal:** Execute two independent development tasks simultaneously to reduce development time.
- **Agent 1 Role:** Backend Developer implementing Task 7 (Robust error handling and response envelopes).
- **Agent 2 Role:** Fullstack Developer implementing Task 8 (List endpoint pagination for all collections).

**Coordination Strategy & Concurrency:**
- **Strategy:** To prevent agents from clobbering each other's file edits, I utilized `git worktree`. I created two separate worktrees (`task7-error-handling` and `task8-pagination`) mapped to different branches. 
- **Concurrency Wins:** Development time was essentially cut in half. Both agents generated Pydantic schemas, updated FastAPI routers, and wrote Pytest tests in parallel.
- **Risks/Failures:** The main risk with this approach is merge conflicts during the final integration step if both agents modify the exact same lines in central files (like `main.py` or `schemas.py`). Isolating them via worktrees successfully mitigated real-time file-locking issues, but the final Git merge still requires human oversight.

## 3. How the Automations Resolved Pain Points
These automations directly resolved the pain point of context-switching and sequential bottlenecking. Traditionally, backend features like pagination and error handling must be implemented one after another to avoid breaking the test suite. By utilizing Warp's agentic environment alongside Git worktrees, I effectively cloned myself—allowing two features to be developed, tested, and debugged asynchronously in isolated environments. The Warp Drive test runner further accelerated the feedback loop, eliminating the manual overhead of debugging typos or mismatched Pydantic schemas.