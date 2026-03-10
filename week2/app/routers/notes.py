from __future__ import annotations

from typing import Any, List
import sqlite3

from fastapi import APIRouter, HTTPException, Depends

from .. import db
from ..schemas import NoteCreate, Note


router = APIRouter(prefix="/notes", tags=["notes"])


@router.post("", response_model=Note)
def create_note(
    payload: NoteCreate, conn: sqlite3.Connection = Depends(db.get_db)
) -> Note:
    """Create a new note and return it."""
    content = payload.content.strip()
    if not content:
        raise HTTPException(status_code=400, detail="content is required")

    try:
        note_id = db.insert_note(conn, content)
        row = db.get_note(conn, note_id)
        assert row is not None  # should always be present immediately after insert
        return Note(id=row["id"], content=row["content"], created_at=row["created_at"])
    except sqlite3.Error as exc:
        raise HTTPException(status_code=500, detail="database error") from exc


@router.get("/{note_id}", response_model=Note)
def get_single_note(
    note_id: int, conn: sqlite3.Connection = Depends(db.get_db)
) -> Note:
    row = db.get_note(conn, note_id)
    if row is None:
        raise HTTPException(status_code=404, detail="note not found")
    return Note(id=row["id"], content=row["content"], created_at=row["created_at"])


@router.get("", response_model=List[Note])
def list_notes(conn: sqlite3.Connection = Depends(db.get_db)) -> List[Note]:
    """Return all saved notes.

    The results are ordered by id descending so the most recent appears
    first, matching the expectations of the frontend.
    """
    rows = db.list_notes(conn)
    return [
        Note(id=r["id"], content=r["content"], created_at=r["created_at"])
        for r in rows
    ]
