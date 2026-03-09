# Repository Guidance

## Application Architecture
- **Backend:** FastAPI with SQLAlchemy (SQLite). Routers are located in `backend/app/routers`.
- **Frontend:** Static UI served by FastAPI.
- **Database:** SQLite. Database configuration and seeds are in the `data/` directory.

## Style & Safety Guardrails
- **Tooling:** Use `black` and `ruff` for formatting and linting. Always run pre-commit hooks before finalizing code.
- **Workflow:** When adding a new feature or endpoint, strictly follow Test-Driven Development (TDD). First, write a failing test in `backend/tests`, then implement the feature, and finally verify with the test runner.
- **Safety:** Do not modify database migration scripts directly without running the proper SQLAlchemy commands. Avoid running destructive commands.

## Code Navigation
- To run the application: `make run`
- To run tests: `make test`
- API documentation is available at `/docs` when the server is running.