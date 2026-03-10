from __future__ import annotations

import sqlite3
from typing import List, Optional

from fastapi import APIRouter, HTTPException, Depends

from .. import db
from ..schemas import (
    ActionItem,
    ActionItemUpdate,
    ExtractPayload,
    ExtractResponse,
    ExtractedItem,
)
from ..services.extract import extract_action_items, extract_action_items_llm


router = APIRouter(prefix="/action-items", tags=["action-items"])


@router.post("/extract", response_model=ExtractResponse)
def extract(
    payload: ExtractPayload, conn: sqlite3.Connection = Depends(db.get_db)
) -> ExtractResponse:
    text = payload.text.strip()
    if not text:
        raise HTTPException(status_code=400, detail="text is required")

    note_id: Optional[int] = None
    if payload.save_note:
        try:
            note_id = db.insert_note(conn, text)
        except sqlite3.Error as exc:
            raise HTTPException(status_code=500, detail="failed to save note") from exc

    items = extract_action_items(text)
    try:
        ids = db.insert_action_items(conn, items, note_id=note_id)
    except sqlite3.Error as exc:
        raise HTTPException(status_code=500, detail="failed to insert action items") from exc

    extracted_items = [ExtractedItem(id=i, text=t) for i, t in zip(ids, items)]
    return ExtractResponse(note_id=note_id, items=extracted_items)


@router.get("", response_model=List[ActionItem])
def list_all(
    note_id: Optional[int] = None, conn: sqlite3.Connection = Depends(db.get_db)
) -> List[ActionItem]:
    rows = db.list_action_items(conn, note_id=note_id)
    return [
        ActionItem(
            id=r["id"],
            note_id=r["note_id"],
            text=r["text"],
            done=bool(r["done"]),
            created_at=r["created_at"],
        )
        for r in rows
    ]


@router.post("/{action_item_id}/done", response_model=ActionItem)
def mark_done(
    action_item_id: int,
    payload: ActionItemUpdate,
    conn: sqlite3.Connection = Depends(db.get_db),
) -> ActionItem:
    try:
        db.mark_action_item_done(conn, action_item_id, payload.done)
    except sqlite3.Error as exc:
        raise HTTPException(status_code=500, detail="failed to update action item") from exc

    row = db.get_action_item(conn, action_item_id)
    if row is None:
        # This should never happen because we just updated it, but guard anyway.
        raise HTTPException(status_code=404, detail="action item not found")

    return ActionItem(
        id=row["id"],
        note_id=row["note_id"],
        text=row["text"],
        done=bool(row["done"]),
        created_at=row["created_at"],
    )


@router.post(
    "/extract/llm", response_model=ExtractResponse
)
def extract_llm(
    payload: ExtractPayload, conn: sqlite3.Connection = Depends(db.get_db)
) -> ExtractResponse:
    """Use the LLM-based extractor rather than the heuristic version."""
    text = payload.text.strip()
    if not text:
        raise HTTPException(status_code=400, detail="text is required")

    note_id: Optional[int] = None
    if payload.save_note:
        try:
            note_id = db.insert_note(conn, text)
        except sqlite3.Error as exc:
            raise HTTPException(status_code=500, detail="failed to save note") from exc

    items = extract_action_items_llm(text)
    try:
        ids = db.insert_action_items(conn, items, note_id=note_id)
    except sqlite3.Error as exc:
        raise HTTPException(status_code=500, detail="failed to insert action items") from exc

    extracted_items = [ExtractedItem(id=i, text=t) for i, t in zip(ids, items)]
    return ExtractResponse(note_id=note_id, items=extracted_items)


