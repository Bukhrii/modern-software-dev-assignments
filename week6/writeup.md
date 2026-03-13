# Week 6 Write-up
Tip: To preview this markdown file
- On Mac, press `Command (⌘) + Shift + V`
- On Windows/Linux, press `Ctrl + Shift + V`

## Instructions

Fill out all of the `TODO`s in this file.

## Submission Details

Name: **TODO** \
SUNet ID: **TODO** \
Citations: **TODO**

This assignment took me about **TODO** hours to do. 


## Brief findings overview 
Based on the Semgrep scan results for the `week6/` directory, several security issue categories were identified:
- **SAST (Static Analysis Security Testing):** Critical vulnerabilities were detected, including SQL Injection, use of the `eval()` function, and the use of `subprocess` with `shell=True`.
- **SCA (Supply Chain Analysis):** Several dependencies in `requirements.txt` use outdated versions with known vulnerabilities (e.g., `PyYAML==5.1`).
- **Secrets:** No exposed API keys or passwords were found.

**False Positives/Ignored:**
- `wildcard-cors`: Temporarily ignored to facilitate frontend testing in the local environment.
- `urllib-use-detected`: Not fixed as the `debug_fetch` function is optional and intended for internal use only.

## 2. Three Fixes

### Fix #1: SQL Injection
- **File:** `backend/app/routers/notes.py` (Function `unsafe_search`)
- **Rule:** `python.sqlalchemy.security.audit.avoid-sqlalchemy-text`
- **Brief Risk Description:** An attacker could inject arbitrary SQL commands through the `q` parameter due to the use of f-strings in raw queries.
- **Your Change:** Replaced raw SQL strings with the SQLAlchemy Expression API (`select`, `where`, `or_`) to build the query safely.
- **AI Coding Tool Usage:** Used Claude 3.5 Sonnet to refactor the raw query into a secure SQLAlchemy ORM format.
- **Why this mitigates the issue:** User input is now processed as a parameter rather than part of the SQL command, preventing query manipulation.

### Fix #2: Code Injection (eval)
- **File:** `backend/app/routers/notes.py` (Function `debug_eval`)
- **Rule:** `python.lang.security.audit.eval-detected`
- **Brief Risk Description:** The `eval()` function can execute any Python code sent by a user, leading to Remote Code Execution (RCE).
- **Your Change:** Replaced `eval()` with `ast.literal_eval()` and added error handling (try-except).
- **AI Coding Tool Usage:** Used Claude to provide a secure alternative for evaluation and data type validation.
- **Why this mitigates the issue:** `ast.literal_eval()` only allows the evaluation of literal Python structures (strings, numbers, lists, dicts) and cannot execute dangerous functions.

### Fix #3: Subprocess Shell Injection
- **File:** `backend/app/routers/notes.py` (Function `debug_run`)
- **Rule:** `python.lang.security.audit.subprocess-shell-true`
- **Brief Risk Description:** `shell=True` allows an attacker to execute additional system commands (e.g., `; rm -rf /`) by manipulating the command string.
- **Your Change:** Removed `shell=True` and used `shlex.split(cmd)` to parse the command into a safe list of arguments.
- **AI Coding Tool Usage:** Used Claude to suggest using the `shlex` library for safe string command parsing.
- **Why this mitigates the issue:** With `shell=False`, the system only executes the primary command without processing shell metacharacters, preventing command chaining.