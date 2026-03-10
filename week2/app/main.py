from __future__ import annotations

from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles

from .config import settings
from .db import init_db
from .routers import action_items, notes


@asynccontextmanager
async def lifespan(app: FastAPI):
    # startup: ensure database exists and is initialized
    init_db()
    yield
    # shutdown: nothing special right now


app = FastAPI(title="Action Item Extractor", lifespan=lifespan)


@app.get("/", response_class=HTMLResponse)
def index() -> str:
    html_path = settings.base_dir / "frontend" / "index.html"
    return html_path.read_text(encoding="utf-8")


# include routers after creating the app
app.include_router(notes.router)
app.include_router(action_items.router)


# serve static assets
app.mount(
    "/static",
    StaticFiles(directory=str(settings.base_dir / "frontend")),
    name="static",
)
