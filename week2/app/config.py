from __future__ import annotations

from pathlib import Path

from pydantic import BaseSettings


class Settings(BaseSettings):
    # base directory for the project (two levels up from this file)
    base_dir: Path = Path(__file__).resolve().parents[1]
    data_dir: Path = base_dir / "data"
    db_path: Path = data_dir / "app.db"

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


# single global settings object that can be imported anywhere
settings = Settings()
