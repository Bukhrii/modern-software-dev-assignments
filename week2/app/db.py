from __future__ import annotations

import sqlite3
from typing import Generator, Iterable, Optional

from .config import settings


# ---------------------------------------------------------------------------
# helpers/config
# ---------------------------------------------------------------------------

def ensure_data_directory_exists() -> None:
    """Make sure the directory that will hold the SQLite file exists."""
    settings.data_dir.mkdir(parents=True, exist_ok=True)


def get_connection() -> sqlite3.Connection:
    """Return a new SQLite connection using the configured database path.

    The caller is responsible for closing the connection when finished.  This
    function is used internally by the dependency provider but can also be used
    in scripts or tests that need an isolated connection.
    """
    ensure_data_directory_exists()
    conn = sqlite3.connect(settings.db_path)
    conn.row_factory = sqlite3.Row
    return conn


def get_db() -> Generator[sqlite3.Connection, None, None]:
    """FastAPI dependency generator for a database connection.

    A new connection is yielded for every request and automatically closed at
    the end of the request lifecycle.
    """
    conn = get_connection()
    try:
        yield conn
    finally:
        conn.close()


# ---------------------------------------------------------------------------
# database initialization / migrations
# ---------------------------------------------------------------------------

def init_db() -> None:
    """Ensure the database file and required tables exist."""
    ensure_data_directory_exists()
    with get_connection() as connection:
        cursor = connection.cursor()
        cursor.execute(
            """
            CREATE TABLE IF NOT EXISTS notes (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                content TEXT NOT NULL,
                created_at TEXT DEFAULT (datetime('now'))
            );
            """
        )
        cursor.execute(
            """
            CREATE TABLE IF NOT EXISTS action_items (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                note_id INTEGER,
                text TEXT NOT NULL,
                done INTEGER DEFAULT 0,
                created_at TEXT DEFAULT (datetime('now')),
                FOREIGN KEY (note_id) REFERENCES notes(id)
            );
            """
        )
        connection.commit()


# ---------------------------------------------------------------------------
# CRUD helpers (take explicit connection arguments)
# ---------------------------------------------------------------------------

def insert_note(conn: sqlite3.Connection, content: str) -> int:
    cursor = conn.cursor()
    cursor.execute("INSERT INTO notes (content) VALUES (?)", (content,))
    conn.commit()
    return int(cursor.lastrowid)


def list_notes(conn: sqlite3.Connection) -> list[sqlite3.Row]:
    cursor = conn.cursor()
    cursor.execute("SELECT id, content, created_at FROM notes ORDER BY id DESC")
    return cursor.fetchall()


def get_note(conn: sqlite3.Connection, note_id: int) -> Optional[sqlite3.Row]:
    cursor = conn.cursor()
    cursor.execute(
        "SELECT id, content, created_at FROM notes WHERE id = ?",
        (note_id,),
    )
    return cursor.fetchone()


def insert_action_items(
    conn: sqlite3.Connection, items: Iterable[str], note_id: Optional[int] = None
) -> list[int]:
    cursor = conn.cursor()
    ids: list[int] = []
    for item in items:
        cursor.execute(
            "INSERT INTO action_items (note_id, text) VALUES (?, ?)",
            (note_id, item),
        )
        ids.append(int(cursor.lastrowid))
    conn.commit()
    return ids


def list_action_items(
    conn: sqlite3.Connection, note_id: Optional[int] = None
) -> list[sqlite3.Row]:
    cursor = conn.cursor()
    if note_id is None:
        cursor.execute(
            "SELECT id, note_id, text, done, created_at FROM action_items ORDER BY id DESC"
        )
    else:
        cursor.execute(
            "SELECT id, note_id, text, done, created_at FROM action_items WHERE note_id = ? ORDER BY id DESC",
            (note_id,),
        )
    return cursor.fetchall()


def get_action_item(conn: sqlite3.Connection, action_item_id: int) -> Optional[sqlite3.Row]:
    cursor = conn.cursor()
    cursor.execute(
        "SELECT id, note_id, text, done, created_at FROM action_items WHERE id = ?",
        (action_item_id,),
    )
    return cursor.fetchone()


def mark_action_item_done(
    conn: sqlite3.Connection, action_item_id: int, done: bool
) -> None:
    cursor = conn.cursor()
    cursor.execute(
        "UPDATE action_items SET done = ? WHERE id = ?",
        (1 if done else 0, action_item_id),
    )
    conn.commit()

